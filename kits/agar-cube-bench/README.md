# `agar-cube-bench` v2 (`window.AgarCubeKit`)

v2 adds `mode: "acid"` (heart unit, lesson 01). The default mode (`"dye"`) is the v1 kit, unchanged: same options, parts, events and `AgarCubeKit.model`. `AgarCubeKit.version === 2`.

Surface-area : volume practical for lesson 03. A translucent agar cube, cut open (one octant removed) so the
dye front and the undyed core can be read against a ruler. All numbers come from a model.
Classic script, offline, needs `window.THREE`; `window.SceneKit` only for the optional 3D labels.

Script: `kits/agar-cube-bench/agar-cube-bench.js` (copy to `html/assets/js/agar-cube-bench.js`, load after `cell-kit.js`).

## Build
```js
var kit = AgarCubeKit.create({ L_mm: 3, t_min: 30, dyeDepth_mm: 1.0, cutaway: true, labels: true, emit: fn });
stage.rig.add(kit);              // call kit.update(dt, t) every frame
```
Options / `setState(obj)`: `L_mm` 1-6 (the bench uses 1, 2, 3, 4, 6; `AgarCubeKit.LEVELS`), `t_min` minutes in the dye (default 30, fully developed),
`dyeDepth_mm` final dye penetration (default 1.0), `tau_min` uptake time constant (default 3), `cutaway` (true = octant removed), `labels` (3D sprites; lessons hide them below 560 px).
Changing `L_mm` or `t_min` jumps straight to the finished state; `play()` re-runs the dye from t = 0 to `t_min` in about 4 s.

## Model (`AgarCubeKit.model(L, t, d, tau)` and `kit.reading()`)
depth = min(d (1 - e^(-t/tau)), L/2); undyed core side = L - 2 depth; undyedFraction = (core/L)^3; SA = 6L^2; V = L^3; ratio = 6/L.
`reading()` returns `{ L_mm, SA, V, ratio, t_min, dyeDepth_mm, depth_mm, core_mm, undyedFraction, dyedFraction }` for the time currently shown.
With d = 1 mm: L = 1 and 2 are fully dyed (0 %), L = 3 -> 3.7 %, L = 4 -> 12.5 %, L = 6 -> 29.6 % undyed by volume.
The dye is a generic coloured tracer (the real class practice uses phenolphthalein agar in acid; the model shows the tracer front moving in).

## Parts (`kit.parts`, each tagged with `userData.partId`)
`cube` (whole cube group) · `dye` (pink shell) · `core` (undyed centre, absent when fully dyed) · `front` (dye-front outline) ·
`tile` · `ruler` (graduated in mm, zero at the cube's left edge) · `scalpel` · `dish` (dye dish) · `labelL`, `labelCore` (sprites, may be null).
Scene scale: `kit.getState().mmToUnit` scene units per mm (changes with L so every cube is easy to see).

## Methods and events
`create(opts)` · `setState(o)` · `play()` · `reset()` · `reading()` · `getState()` · `isPlaying()` · `update(dt, t)` · `AgarCubeKit.makeHighlighter(scene).highlight(partId)`.
Events on the group (`kit.addEventListener(type, fn)`, `e.reading`) and via `opts.emit(type, reading)`: `change`, `diffusion-start`, `diffusion-done`.
The lesson's `l3:bench` event should carry `kit.reading()`.

## Demo
`demo.html` (L buttons, Play dye, cut-away toggle, dye depth 1/2 mm, live readout). Check: `node scripts/qa.mjs kits/agar-cube-bench/demo.html`.

---

## v2: `mode: "acid"` (phenolphthalein agar in dilute hydrochloric acid)

Alkali agar made with phenolphthalein is **pink**; wherever acid has diffused in it turns **colourless**. So the pink core is the part the acid has not reached.
Four cubes (default 5, 10, 20, 30 mm) sit together in one glass beaker (rolled rim, graduations, "dilute hydrochloric acid" label, meniscus),
on a white tile with a 10 mm grid, with stainless forceps (extruded arms, pivot rivet, serrated tips), a scalpel blade, a 0-40 mm ruler (to scale) and a dial clock (one turn = 15 min, red mark at 8 min).
Each cube is a translucent colourless block with a pink core and an octant cut away (extruded `Shape` slabs) so the colourless rim and the pink core show in section.

```js
var kit = AgarCubeKit.create({ mode: "acid", sides: [5, 10, 20, 30], acidDepth_mm: 3.0, t_min: 8,
                               errors: { lateLift: false, flatOnFloor: false, oversizedCube: false }, cutaway: true, labels: true, emit: fn });
stage.rig.add(kit);   // kit.update(dt, t) every frame
```
Options / `setState(obj)` (acid mode):
- `sides` array of up to 4 cube sides, mm, each clamped 1-30 (default `AgarCubeKit.ACID_SIDES` = `[5, 10, 20, 30]`).
- `L_mm` (1-30): selects that cube if it is in `sides`; if it is not, the beaker holds just that one cube. (v1 clamp of 1-6 applies only to the default dye mode.)
- `selected` which cube `reading()` describes (default `sides[0]`; `select(L)` does the same and emits `select`).
- `acidDepth_mm` (default 3.0): depth reached on **every face after 8 min** (`AgarCubeKit.ACID_TREF_MIN`). At other times depth = `acidDepth_mm * sqrt(t / 8)`.
- `t_min` (default 8): minutes in the acid. Changes jump straight to the finished state; `play()` runs the clock from 0 in about 5 s.
- `errors` (any subset, all default false), the sources of error in 02-lesson L01:
  - `lateLift`: cubes stay in 4 min too long (12 min), so acid goes deeper and **% colourless rises** (10 -> 98.1, 20 -> 74.7, 30 -> 57.0).
  - `flatOnFloor`: the cubes lie on the beaker floor, the floor face gets no acid, so the pink core reaches the floor and **% colourless falls** (10 -> 88.8, 20 -> 58.4, 30 -> 42.4).
  - `oversizedCube`: every cube is cut 1 mm too big (`oversize_mm` via `AgarCubeKit.acidModel` only). The student still works out SA : V from the nominal side, but the real % colourless is **slightly lower** (10 -> 90.6, 20 -> 63.6, 30 -> 47.6).
- `cutaway` (octant removed, default true), `labels` (3D side labels, sprites; hide below 560 px), `emit(type, reading)`.

### Model (`AgarCubeKit.acidModel(L, { acidDepth_mm, t_min, errors, oversize_mm })`, also `kit.reading(L?)`)
`depth = min(acidDepth * sqrt(t/8), L / 2)`; pink core side = `L - 2 * depth`; pink volume = core^3; `% colourless = (V - core^3) / V * 100`.
With the defaults: **5 -> 100 %, 10 -> 93.6 %, 20 -> 65.7 %, 30 -> 48.8 %** (pink volumes 0, 64, 2744, 13 824 mm^3; SA : V 1.2, 0.60, 0.30, 0.20 mm^-1).

`reading(L?)` (the selected cube if `L` is omitted) returns
`{ L_mm, L_actual_mm, SA, V, ratio, t_min, acidDepth_mm, depth_mm, core_mm, coreHeight_mm, pinkVolume, colourlessVolume, pctColourless }`.
`SA`, `V`, `ratio` come from the nominal `L_mm` (what the student calculates); the pink and % values use the cube as actually cut and positioned. `readings()` returns all cubes, smallest first.

### Parts (`kit.parts`, tagged with `userData.partId`)
`cube` (all cubes; each child cube is also tagged `cube`) · `cubes` (map `"5"`, `"10"`, `"20"`, `"30"` -> group) · `core` (the selected cube's pink core, `null` when fully colourless) ·
`beaker` · `acid` · `forceps` (rests on the tile while the clock runs, then poises over the beaker) · `ruler` · `tile` · `blade` · `clock` · `labelL` (selected cube's label, may be `null`).
`kit.getState()` returns `sides, acidDepth_mm, t_min, errors, cutaway, labels, selected, t_now, t_end, measured, mmToUnit`.

### Methods and events (acid mode)
`create` · `setState(o)` · `select(L)` · `measure(L?)` (marks the cube as measured, returns its reading) · `play()` · `reset()` · `reading(L?)` · `readings()` · `getState()` · `isPlaying()` · `update(dt, t)` · `AgarCubeKit.makeHighlighter(scene).highlight("core")`.
Events on the group (`kit.addEventListener(type, fn)`, `e.reading`) and via `opts.emit(type, reading)`: `change`, `select`, `acid-start`, `acid-done` (clock reached the end time), `measure` (`e.measured` = sides measured so far), `measure-done` (every cube measured).
Lesson wiring: emit `l1:bench` with `kit.reading()` on each `measure`, and `l1:bench-done` on `measure-done`.

## Demo
`demo.html` opens in acid mode (cube buttons, Measure, Play 8 min, Cut-away, the three error toggles, "Dye mode (v1)" to swap to the v1 kit; `?mode=dye` starts in v1).
Check: `node scripts/qa.mjs kits/agar-cube-bench/demo.html`.
