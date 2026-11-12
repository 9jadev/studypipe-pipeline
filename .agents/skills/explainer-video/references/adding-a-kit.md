# Adding a video kit (on the fly)

When a video needs a visual that no kit provides, a kit is **built on the fly**, the same way `kit-builder` builds 3D lab kits:
the explainer-director writes a **kit request**, the `video-kit-engineer` builds the kit in `kits/video/<id>/`, proves it with
its demo video, and the director's plan uses it. Kits are reusable: every later video on that idea gets it for free.

## 1. The kit request (written by the explainer-director)

`topics/<slug>/06-videos/kit-requests/<id>.md`:

```markdown
# Kit request: capillary-bed
Needed for: lesson-04 video, chapters 2–3 (ultrafiltration and reabsorption along a capillary)
Must show: arteriole → capillary → venule; plasma leaving at the arterial end, re-entering at the venous end; red cells and
  proteins staying inside; excess fluid draining into a blind-ended lymph capillary
States it needs: position 0–1 along the capillary, Pc (mmHg), πc (mmHg), arrows on/off, lymph on/off, oedema 0–1, labels
Close-ups: arterial end, venous end, lymph capillary
Accuracy: Pc 35 → 15 mmHg, πc 25 mmHg; red cells never cross the wall; lymph capillaries are blind-ended
Look like: kits/video/heart (front view, blue/red conventions), labels short (≤ 18 characters)
```

Check first: `kits/catalog.md` → *Video kits* (built-ins and `kits/video/*`). Extending an existing kit with a new state is better
than a near-duplicate kit.

## 2. Build (the video-kit-engineer)

```bash
node scripts/new-video-kit.mjs <id> "<what it shows>"        # kits/video/<id>/: kit.js, demo.plan.cjs, README.md
```

`kit.js` registers one kit:

```js
(window.VIDEO_KITS = window.VIDEO_KITS || {}).heart = {
  title: '…',
  states: { beat: '0/1: …', hr: 'bpm …', focus: '…' },     // every state a plan may set; the build rejects anything else
  focus: { LV: [196, 206, 196, 180], … },                    // camera close-ups: [x, y, w, h] in the 420×420 drawing
  create(svg, api) {                                          // build the drawing ONCE into svg (viewBox 0 0 420 420)
    const { el, tx, mixN, lerp, ease, seg, clamp, frac, spring, backOut, PAL, C, COLOR } = api;
    …
    return { draw(t, P) { const s = P.s, p = P.p, u = P.u; … } };   // update it EVERY frame
  },
};
```

| `api` | Use |
| --- | --- |
| `el(tag, attrs, parent)` | create an SVG element |
| `tx(text, x, y, size, fill, parent, anchor, weight)` | **every label** (records its design size: phones boost it, camera close-ups scale it gently) |
| `mixN(p, s, key, u, default)` | a numeric state, blended from its previous value over 1.4 s (`P.p` previous state, `P.s` current, `P.u` progress) |
| `lerp`, `ease`, `seg(t, a, b)`, `clamp`, `frac`, `spring`, `backOut` | timing helpers (all pure) |
| `PAL`, `C`, `COLOR(nameOrRole)` | palette, kit colours, a plan's role colours (so the kit matches the board) |

## 3. Rules

1. **Pure function of time.** `draw(t, P)` sets everything from `t` and the state. No `setInterval`, no `Date`, no `Math.random()`
   at draw time (pre-compute random positions in `create` with a seeded generator). Pausing freezes it; scrubbing reproduces it.
2. **Accurate science first.** Conventions as WAEC/NECO draw and teach them (heart front view: patient's right on viewer's left;
   blue deoxygenated, red oxygenated; correct sequences and timings). Encode timings as numbers from the topic.
3. **Readable on a 360 px phone.** Labels ≥ 12 units, short (≤ 18 characters), never on top of moving parts. The kit panel is
   about 270 px wide on a phone, so draw big and keep detail inside close-up regions.
4. **Declare everything.** Every state in `states`, every close-up in `focus`. The README lists both for the director.
5. **No HTML, no network, no external assets.** SVG elements only. The kit file is self-contained classic JS.
6. **Same look as the other kits:** dark card background, soft walls, the palette above.

## 4. Prove it

```bash
node .agents/skills/explainer-video/scripts/build.cjs kits/video/<id>/demo.plan.cjs     # validates states/close-ups, bundles the kit
node .agents/skills/explainer-video/scripts/qa.cjs kits/video/<id>/demo.html           # portrait, landscape, desktop
```

The demo must show **every state and every close-up**. QA must be clean (no errors, no small/overlapping labels, controls
tappable), and you must **look at every contact sheet**: does each state show what its description says, and is the science right?

## 5. Hand over

- Fill in `kits/video/<id>/README.md` (states, close-ups, good for, used in).
- Return the catalog row for `kits/catalog.md` → *Video kits* (the director adds it).
- The plan can now use `{ panel: '<id>', s: { … } }` and `{ camera, focus }` on it. Unit builds copy only the kits a video
  uses into `html/assets/video/kits/`.
