# Plan schema (v1)

A plan is a CommonJS module named `<slug>.plan.cjs` that exports one object. The director writes it; the video skill validates and builds it. Plans are data plus small helper functions; they never contain drawing code.

```js
module.exports = {
  meta: { ... },        // title card, theme, colour roles, integration
  checks: [ ... ],      // every number the video shows or says, verified at build time
  chapters: [ { title, cues: [ { say, ops: [ ... ] } ] } ]
};
```

## meta

| Field | Required | Meaning |
| --- | --- | --- |
| `title` | yes | Title card and page title |
| `subtitle` | no | Line under the title |
| `eq` | no | Plain-text formula shown on the title card, e.g. `'E = V + v = I(R + r)'` |
| `subject`, `level` | no | Shown above the title, e.g. `'Physics'`, `'SS2–SS3 · WAEC / NECO / JAMB'` |
| `theme` | no | `safari` (default), `vegetation`, `fiesta`, `classic`. See `themes.md` |
| `roles` | yes if the board uses colour | `{ E: { color: 'gold', name: 'EMF' }, ... }`. Palette: gold, amber, blue, sky, red, green, purple, pink, orange, white (or a hex colour) |
| `captionFixes` | no | Map of spoken spellings to caption spellings, e.g. `{ 'E M F': 'EMF' }` |
| `next`, `nextLabel` | no | End-card button; posts `{type:'studypipe:video', event:'continue', next}` to the host app |
| `wordsPerSecond` | no | Narration pace estimate, default 2.4 |
| `out` | no | Output path; default is the plan path with `.html` |

## Roles (colour coding)

A role is one meaning with one colour for the whole video (EMF is always gold). Wrap LaTeX in `\htmlClass{role-<name>}{...}`. A tiny helper keeps plans readable:

```js
const k = (r, s) => `\\htmlClass{role-${r}}{${s}}`;
const E = s => k('E', s);
// tex: `${E('E')} = I(R + r)`
```

Use two to six roles. Keep them consistent with the lesson's lab and the rest of the course.

## chapters and cues

```js
{ title: 'Solving the Aba mystery', cues: [
  { say: 'Step three. Find the internal resistance ...', ops: [ ... ] },
  { say: 'Now it is your turn ...', hold: 15, ops: [ ... ] }
] }
```

| Cue field | Meaning |
| --- | --- |
| `say` | Exactly what the voice says. Spoken words only: no LaTeX, no symbols. Up to about 45 words. See the director's `narration.md` |
| `caption` | Optional caption text if it should differ from `say` (otherwise `captionFixes` are applied) |
| `hold` | Seconds of silence after the line with a pause-and-try countdown (practice questions) |
| `ops` | What happens on screen during this line, in order |

## ops

Every op may carry `at`: seconds after the line starts (default 0.35). Use it to stagger several writes inside one long line.

| Op | Shape | Effect |
| --- | --- | --- |
| clear | `{ clear: 'Heading' }` | Wipes the board and drops in a new heading |
| write | `{ write: 'id', tex: 'LaTeX', note: 'short side note', at }` | Writes one board line. `id` must be unique on the current board |
| box | `{ box: 'id' }` | Boxes a written line (the answer), with sparkle burst and mascot cheer |
| hl | `{ hl: ['E', 'v'] }` | Highlights these roles for the length of this line |
| panel | `{ panel: 'circuit', s: { ...state }, fresh: 1, at }` | Shows a kit on the right and sets its state. State merges with the kit's previous state unless `fresh: 1`. Changes animate over 1.4 s |
| panel off | `{ panel: null }` | Hides the kit panel; the board widens |

The board shows about six lines, then scrolls whole lines upward. Use a new `clear` for each new idea or worked example.

## checks

Every number that appears on the board or is spoken needs a check. Four forms:

```js
['Aba r = 3.6/3.0', 3.6 / 3.0, 1.2],                         // [name, computed, expected, tolerance?]
{ name: 'roots satisfy', f: x => x*x + 6*x - 2, roots: [-3 + Math.sqrt(11), -3 - Math.sqrt(11)] },
{ name: 'decimals', approx: [[-3 + Math.sqrt(11), 0.32, 2]] },  // [value, shown, decimal places]
{ name: 'same expression', same: [x => (x + 3) ** 2 - 11, x => x*x + 6*x - 2], range: [-10, 10] },
{ name: 'any boolean test', test: () => Math.abs(0.8 * (4 + 1) - 0.5 * (7 + 1)) < 1e-9 }
```

A failed check stops the build. The fix goes back to the director; the video skill never edits numbers to make a check pass.

## Build-time validation (what gets rejected)

- Missing `meta.title`, unknown theme, empty chapters
- `say` containing LaTeX or symbols (`\`, `$`, `^`, `_{`)
- LaTeX that KaTeX cannot render
- A role used in LaTeX or `hl` but not defined in `meta.roles`
- A `box` pointing at a line not on the current board; a line id reused on one board
- A `panel` that is not a registered kit (flag the gap instead)
- Graph `show` ids that are not items in the active spec; graph functions that fail to evaluate
- Warnings: lines over ~48 words, odd `at` values, a plan with no checks
