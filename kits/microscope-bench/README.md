# `microscope-bench` (v1)

Paper-3-style compound-microscope practical for StudyPipe Biology (L01 of *Plant and Animal Cells*). Self-contained:
it does **not** use `kits/cell-bio`. Needs `window.THREE` (r160 bundle) only; `SceneKit` is optional.
Classic script, fully offline, no `fetch`, no modules.

```html
<script src="three.min.js"></script><script src="scene-kit.js"></script><script src="microscope-bench.js"></script>
```
Lessons copy `kits/microscope-bench/microscope-bench.js` to `html/assets/js/microscope-bench.js` (load it after `cell-kit.js`).

## Build

`const scope = MicroscopeBench.create(opts); stage.rig.add(scope); scope.setCamera(stage.camera);`
then call `scope.update(dt, t)` every frame (SceneKit `onFrame`) and register parts with `stage.addPart(id, scope.parts[id], label)`.

| option | default | meaning |
|---|---|---|
| `objective` | `0` | `0 / 1 / 2` = x4 / x10 / x40 |
| `slide` | `"onion"` | `"cork"` (dead cells, empty walls), `"onion"` (iodine, side nucleus), `"blood"` (round cells, no wall, no nucleus) |
| `eyepiece` | `10` | eyepiece power (10 or 15; the engraved sleeve follows) |
| `mirror` | `"plane"` | `"plane"` or `"concave"` (concave: brighter, converging beam) |
| `iris` | `0.85` | condenser diaphragm 0..1 (small = dark, high contrast; wide = bright, washed out) |
| `focus` | auto | stage position 0.15..0.88; ideal focus is 0.500 / 0.504 / 0.508 |
| `startBlurred` | `false` | start out of focus so the learner must use the coarse knob |
| `parfocal` | `true` | switching objective keeps a sharp image almost sharp (one fine-knob touch finishes it) |
| `pan` | `[0,0]` | specimen point (mm) at the centre of the field |
| `wbc` | `false` | blood only: a few white cells (lobed purple nucleus) |
| `labels` | `false` | short 3D labels (hide on phones; use HTML readout) |
| `lightPath` | `true` | faint ray through the tube to the eye |
| `view` | float | `"none"` hides the floating eyepiece-view disc (use `scope.viewCanvas` in HTML instead) |
| `guide` | `true` | dashed counting line across the field diameter |
| `onEvent(name, detail)` | none | event callback (or use `scope.on`) |

## Model (all numbers computed, never typed)

- Total magnification `M = eyepiece x objective`; field diameter `field_mm = 160 / M` (4.0 / 1.6 / 0.40 mm at eyepiece x10).
- Cell widths: cork 0.050 mm, onion 0.050 mm, blood 0.008 mm. `cells = round(field / width)`: onion 80 / 32 / 8, blood 500 / 200 / 50.
- Image blur = distance from the focus plane x depth-of-field factor (x4: 1, x10: 1.9, x40: 4.2): high power is far fussier.
  `focused` means blur < 1.4 px. Brightness depends on mirror, iris and objective.
- **Coarse knob is locked at x40**: `coarse()` returns `false`, shakes the knob/arm, flashes "Fine knob only at x40" in 3D and emits `coarse-locked`.
- Pure model without THREE: `MicroscopeBench.compute({ objective, eyepiece, slide })`.

## `scope.reading()`

`{ eyepiece, objective (x4/10/40), objectiveIndex, na, M, field_mm, cells (integer count a learner would record), cells_exact, width_mm, width_um, slide, slideName, slideNote, focused, blur, brightness, focus, mirror, iris, coarseLocked }`.
Example, onion at x40: `M 400, field_mm 0.4, cells 8, width_mm 0.05, width_um 50`. With a x15 eyepiece and x40 objective `M = 600` (WAEC exercise).
`width_um` is the specimen's true width; with unusual eyepieces `cells` is rounded (e.g. 5.33 -> 5), as a learner counts whole cells.

## API

`coarse(steps)` (+/-, 0.05 each; false at x40) · `fine(steps)` (0.002 each) · `autoFocus()` · `setObjective(i)` · `setSlide(k)` · `setMirror(k)` · `setIris(v)` · `setEyepiece(n)` · `setPan(x,y)` · `setLabels(bool)` ·
`measure()` (emits `measure` with the reading) · `tap(part)` (default action: coarse/fine +1, objective/nosepiece next, slide next, mirror toggle, iris/condenser step) ·
`highlight(part, on)` (pulses every mesh tagged with that part; `highlight(null)` clears) · `setState({...})` · `on(name, fn)` / `off` · `pickables` + `partOf(mesh)` for raycasting (`stage.pick(e, scope.pickables)`) ·
`viewCanvas` (512 px eyepiece disc, live) · `setCamera(cam)` (floating disc turns to the camera) · `dispose()` · `MicroscopeBench.renderView(ctx, D, state)` for a 2D-only view.

## Parts (`scope.parts`, also `partId` on every mesh)

`base` (bevelled horseshoe foot, rubber feet) · `arm` (lofted C-limb) · `head` (prism housing) · `tube` (body tube + inclined eyepiece tube) · `eyepiece` (engraved "10x" sleeve, rubber eye-cup) ·
`nosepiece` (tilted, knurled revolving turret) · `objective` (invisible anchor that follows the active objective, for narrator `rect()`; the real three lenses are tagged `objective` too: red 4x/0.10, yellow 10x/0.25, blue 40x/0.65, "160/0.17") ·
`stage` (plate with aperture hole + bracket; moves with focus) · `aperture` · `clips` (spring clips) · `condenser` · `iris` (leaves + lever) · `slide` (glass, frosted label) · `coverslip` · `specimen` ·
`mirror` (plane/concave on a gimbal fork) · `coarse` / `fine` (true knurled gear knobs, coaxial, both sides) · `lamp` (= `light`, the window) · `view` (eyepiece disc).
Lesson names `eyepiece, objective, stage, mirror, coarse, fine, slide` are all present.

## Events (`scope.on(name, fn(detail))`)

`objective` / `slide` / `mirror` / `iris` (detail = reading) · `focus` (`{ blur, focused, focus }`) · `measure` (reading) · `coarse-locked` (`{ message }`).
The lesson re-emits `l1:bench` from `measure` and `l1:bench-done` after three different objectives have been measured.

## Phone notes

~35 draw-light meshes per part group, 512 px view texture redrawn only on change (blur is a down/up-scale, no per-frame filter). Use `view: "none"` plus an HTML canvas
(`ctx.drawImage(scope.viewCanvas, ...)`) when the floating disc is too small. Labels are off by default.
`demo.html` shows the full wiring (tap parts, buttons, readout, eyepiece canvas).
