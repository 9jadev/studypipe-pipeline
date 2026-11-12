# Themes

A theme changes the world around the lesson: background animation, board and panel cards, heading pills, captions, the mascot, and motion style. It never changes the meaning colours (roles) or the maths. Set it once in `meta.theme`; viewers can also cycle themes with the palette button (or the T key).

| Theme | World | Motion | Mascot hat | Good for |
| --- | --- | --- | --- | --- |
| `safari` (default) | Savanna sunset, acacia trees, a giraffe and elephant walking past, birds, kente-striped board | Bouncy | Safari helmet | JSS–SS, general science, physics |
| `vegetation` | Bright garden, swaying leaves and vines, butterflies, sun rays, grass | Bouncy | Leaf crown | Biology, agriculture, maths |
| `fiesta` | Purple-to-orange party sky, sliding Ankara-style pattern, balloons, confetti, stars | Bouncy | Party hat | Primary and JSS, revision videos |
| `classic` | Calm dark chalkboard, no mascot | Smooth wipe | none | SS3 exam prep, adults, teachers' versions |

Bouncy motion means: board lines pop in with overshoot, headings drop in, boxed answers burst with sparkles and jiggle, highlighted symbols wiggle, kit panels float and squash on change, the title letters tumble in, and the mascot bounces while the narrator talks and cheers when an answer is boxed.

Everything animates from the video's own clock, so pausing freezes the whole world and scrubbing shows exactly the same frame every time.

## Adding a theme

Themes live in `runtime/runtime.js` (`THEMES`) and `runtime/player.html` (CSS under "theme layer"). A theme needs:

1. `build()` that draws the background into the 1600×900 SVG and returns an array of `update(t)` functions (pure functions of time).
2. `name`, `motion` (`'pop'` or `'wipe'`), mascot `body`/`belly` colours and a `hat` (`safari`, `leaf`, `party`, `grad`, or add a new hat in `buildMascot`).
3. CSS for `.frame[data-theme="<id>"]`: card backgrounds for `.board` and `.panel` (keep them dark and at least 85% opaque so role colours stay readable), heading gradient, chip and caption colours, `--spark` colour.
4. Add the id to `THEMES` in `scripts/build.cjs` and to `ORDER` in the runtime.

Check contrast: every role colour must be readable on the card colour. Run `scripts/qa.cjs --theme <id>` on both example plans.
