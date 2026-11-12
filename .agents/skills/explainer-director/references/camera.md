# Camera: directing the shots

The video has a virtual camera. It never draws anything new; it chooses what the student looks at. Use it the way a
good teacher points: to make sure eyes are on the right thing at the moment the voice talks about it.

## The op

```js
{ camera: 'wide' | 'kit' | 'board', focus, dur, cut, drift, at }
```

| Field | Meaning |
| --- | --- |
| `camera` | The shot. **`wide`**: board and kit side by side (the default; every video starts wide). **`kit`**: the kit fills the picture and the board dims back (on a phone held upright the kit lifts over the board). **`board`**: the board takes the whole width and the kit steps away (upright phones: the kit row folds away so more board lines show) |
| `focus` | Push in on part of the current kit. A region name from `../../explainer-video/references/kits.md` (`'V'`, `'bat'`, `'toll'`…); for the graph kit, an item id or several (`['grad', 'gradtxt']`) or a data box `{ x: [a, b], y: [c, d] }`; or a raw `[x, y, w, h]` in the kit's 420×420 space. Works with `wide` (the board stays visible) and `kit` |
| `dur` | Seconds for the move, default 1.1. Keep it 0.8–1.6 |
| `cut` | `true` for a hard cut instead of a move (use sparingly: chapter changes, a surprise) |
| `drift` | 0–1: a slow push-in after the move lands (about 12% over 14 s), for "look closer" moments |
| `at` | When in the line the move starts (seconds), like any op |

A shot lasts until the next `camera` op. Changing kit (`panel`) drops the push-in (focus belongs to the kit it was set on);
`panel: null` ends a `kit` shot.

## Shot grammar for teaching

| Moment | Shot |
| --- | --- |
| A new setup or experiment appears | `wide`, so the student sees the whole bench and the board together |
| "Look at the voltmeter / the ammeter / this point" | `wide` + `focus` on that part, **on the line that says it** |
| Going *inside* something, an analogy starting, a reveal | `kit` (no board writing in that line), optionally `drift: .5` |
| Following a process stage by stage (the coin on the toll road) | `wide` + `focus` moving from part to part, one move per line |
| A worked example, a derivation, simultaneous equations | `board`, so the maths gets the room |
| Checking the answer against the apparatus ("that matches the ammeter") | back to `wide` + `focus` on the instrument |
| Summary, common mistakes, your-turn | `wide` (usually the kit is off anyway) |

## Rules

1. **Never hide the board while it is being written.** A line with a `write` must not be in a `kit` shot. Use `wide` + `focus`
   instead, which pushes in inside the kit panel while the board stays readable.
2. **One move per line**, at most. Moves are for meaning, not decoration; most lines have no camera op.
3. **Point before or as the voice names it**, never after. Put the op on the line that says "look at…", with `at` if the
   phrase comes late in the line.
4. **Come back out.** After a push-in, return to `wide` within one or two lines (or when the topic moves on), so the student
   regains the whole picture.
5. **Moves of 0.8–1.6 s.** Faster feels like a jolt; slower drags. A `cut` only at a chapter change or a deliberate surprise.
6. **No camera op on the first line of a video**: the title card is fading; let the first picture settle wide.
7. Phones: a push-in makes the drawing bigger but labels only grow gently, so close-ups stay readable without crowding.
   The QA checks label size and overlap on every screen; if a close-up crowds labels, widen the region or pick another.

## In the direction script

Write the shot in the *On screen* column, so the reviewer approves it with the line:

```
| 1.4 | But look at the voltmeter. It has dropped to eight point four volts. | Kit: voltmeter falls to 8.4 V · Board: voltmeter = 8.4 V · 📷 WIDE → voltmeter |
| 3.1 | Let's go inside the battery. | Kit: cell cross-section · 📷 KIT CLOSE-UP, slow drift |
| 5.2 | Step one. Find the current from the external load. | Board: I = V/R = 8.4/2.8 = 3.0 A · 📷 BOARD SHOT |
```

`node .agents/skills/explainer-director/scripts/plan-to-script.cjs <plan>` shows the shots of a written plan the same way.
