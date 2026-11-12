# `vessel-slide-bench` (v1)

Lesson 05 station 1: a prepared **artery + vein cross-section slide** viewed at low power, with an **eyepiece graticule**, a **stage micrometre** calibration step and wall / lumen measuring.
Self-contained (needs only `window.THREE`; no SceneKit, no HeartKit). Classic script, offline. 1 scene unit = 1 cm, Y up.

Bench: glass slide with the stained section (artery left, vein right) and cover slip, stage-micrometre slide, graticule glass disc, an **eyepiece view disc** (`CanvasTexture`, 640 px, drawn from the model), and a back row of "real vessel" reference parts at 0.9 cm per mm of tissue:
artery section (`ExtrudeGeometry` rings with cavity holes: intima, thick media with five wavy elastic laminae as `TubeGeometry`, adventitia, blood-filled lumen), vein section (oval lumen, thin media, thick adventitia),
a vein **opened lengthways with a pocket valve** (half-pipe `LatheGeometry`, two crescent leaflets) and a **capillary** (glass tube, endothelial nuclei bulging in, three biconcave red cells moving single file).

Eyepiece view: artery (wavy internal elastic lamina, 6 laminae, smooth-muscle nuclei, vasa vasorum in the adventitia), vein (wide irregular lumen, thin media, loose adventitia), a zoomed **capillary inset** (60 micrometre field, one flat endothelial cell wide, red cells in single file, 10 micrometre bar), and the graticule (100 divisions).

## Use

```html
<script src="three.min.js"></script>
<script src="vessel-slide-bench.js"></script>
```
```js
var kit = VesselSlideBench.create({ calibrated: true, errors: {} });
scene.add(kit);                         // THREE.Group (kit.isKit, kit.group === kit)
VesselSlideBench.lights(scene);         // optional
scene.environment = VesselSlideBench.environment(renderer);   // optional, for the glass
VesselSlideBench.fit(camera, controls, aspect);               // optional framing
// per frame: kit.update(dt, t)   (alias kit.tick)
kit.onEvent = function (name, detail) {};
```
`StudyPipeKits["vessel-slide-bench"].mount(container, params, host)` builds a full page; `demo.html` uses it.

## Parameters (`create(opts)` / `setState(obj)`)

| name | values | default | effect |
|---|---|---|---|
| `calibrated` | bool | `true` | graticule calibrated against the micrometre. `false` = the student keeps the assumed 0.100 mm per division (true value 0.080), so every reading is 1.25 times too big |
| `calibrating` | bool | `false` | the view shows the stage micrometre beside the graticule (1 mm covers 12.5 divisions); the answer is revealed only when `calibrated` is true |
| `errors` | `{ slant, collapsedVein, noCalibration }` | `{}` | `slant`: section cut at `slant_deg`, both vessels stretched by 1 / cos(angle) along the reading axis (wall and lumen both too big); `collapsedVein`: vein squashed to a slit, lumen read across the slit (0.70 mm instead of 4.0); `noCalibration`: forces the uncalibrated factor |
| `slant_deg` | 0..70 | 35 | angle used when `errors.slant` is on (factor 1.22 at 35 deg) |
| `focus` | `null` `"artery"` `"vein"` `"media"` `"lumen"` `"valve"` `"capillary"` | `null` | spotlight: amber ring in the view disc and pulsing emissive on the 3D part (`valve` is 3D only) |

## Methods

`calibrate()` (sets `calibrated = true`, emits `calibrate`) · `measure("artery"|"vein")` (draws the wall arrow and lumen arrow on the disc, emits `measure`, returns the reading) · `highlight(part)` (= focus) · `reset()` · `setState(obj)` · `update(dt, t)` · `settle(seconds)` · `dispose()`.

## Model

Teaching values: artery wall 0.90 mm / lumen 2.2 mm, vein wall 0.40 mm / lumen 4.0 mm, one graticule division = 0.080 mm (100 divisions across 8.0 mm of a 13 mm field).
Reading: `divisions = apparent size / 0.080`, then `mm = divisions x (0.080 if calibrated else 0.100)`. Nothing is typed text.

`reading()` returns
`{ part, wall_mm, lumen_mm, wall_div, lumen_div, ratio, artery:{ wall_mm, lumen_mm, wall_div, lumen_div, outer_mm }, vein:{ ... }, capillary:{ lumen_um, wall_um, rbc_um, cellsWide }, truth, calibrated, calibrating, mm_per_div_used, mm_per_div_true, factor, measured:{ artery, vein }, slantFactor, errors:[...], focus, wallRatioVeinToArtery, lumenRatioVeinToArtery }`.
Defaults give artery 0.90 / 2.2 and vein 0.40 / 4.0; a wall : lumen ratio of 0.41 (artery) against 0.10 (vein). `part` is the last measured vessel.

## Events (`kit.onEvent`)

`measure` (detail = `reading()` for the vessel measured) · `calibrate` · `focus` (`{ focus }`) · `state` (`reading()`).

## `parts` (also `userData.parts`; each has `userData.partId`)

`slide`, `coverslip`, `micrometre`, `graticule`, `view`, `artery`, `vein`, `tunicaMedia` (artery media ring), `veinMedia`, `lumen` (artery blood column), `veinLumen` (both are highlighted by `focus: "lumen"`), `valve`, `capillary`.
