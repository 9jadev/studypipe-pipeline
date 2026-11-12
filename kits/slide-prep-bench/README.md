# `slide-prep-bench` (v1)

Wet-mount slide preparation bench for WAEC Paper 3 practicals: **onion epidermis in iodine** and **cheek cells in methylene blue**.
Self-contained (needs only `window.THREE`; no SceneKit, no CellKit). Classic script, offline. 1 scene unit = 1 cm, Y up.

Apparatus (all `LatheGeometry` / extruded `THREE.Shape` / `CatmullRomCurve3` tube, procedural canvas textures): bench top with wood grain,
white tile, glass slide with frosted label end (A = onion, B = cheek), 22 mm cover slip hinged on a mounted needle, whole onion bulb
(ridged papery skin, root plexus, dry neck), a fleshy scale (concave) with a peelable epidermis (vertex-deformed sheet: conforms, lifts,
droops, lays flat, can fold), fine forceps, micro-spatula, three dropper bottles (amber iodine, clear methylene blue, clear salt) with a
real lifting dropper (teat squeezes, drops fall), a graduated disinfectant beaker with meniscus, and an eyepiece view disc.

## Use

```html
<script src="three.min.js"></script>            <!-- window.THREE (+ OrbitControls for the demo only) -->
<script src="slide-prep-bench.js"></script>
```
```js
var kit = SlidePrepBench.create({ specimen: "onion", stain: "iodine", coverslipAngle_deg: 45, folded: false, view: 100 });
scene.add(kit);                       // kit is a THREE.Group (kit.isObject3D, kit.group === kit)
SlidePrepBench.lights(scene);         // optional studio lights
scene.environment = SlidePrepBench.environment(renderer);   // optional reflections for the glass
SlidePrepBench.fit(camera, controls, aspect);               // optional portrait/landscape framing
// per frame: kit.update(dt, t)   (alias kit.tick)
kit.onEvent = function (name, detail) {};
```
`StudyPipeKits["slide-prep-bench"].mount(container, params, host)` builds a full page (canvas, readout, buttons); `demo.html` uses it.

## Parameters (`create(opts)` and `setState(obj)`)

| name | values | default | effect |
|---|---|---|---|
| `specimen` | `"onion"` \| `"cheek"` | `"onion"` | onion: peel + iodine route (step order below); cheek: spatula smear route |
| `stain` | `"iodine"` \| `"methylene"` \| `"none"` \| `"salt"` | `"iodine"` | liquid dispensed on the slide. `none` = a drop of plain water (no dropper animation). `salt` shows the salt dropper bottle |
| `coverslipAngle_deg` | 0..90 | 45 | angle at which the slip is held on the needle before lowering. **< 30 deg traps air** |
| `folded` | bool | false | onion peel laid down folded (two layers) |
| `view` | `100` \| `400` | 100 | total magnification of the view disc (eyepiece x10; fields 1.6 mm / 0.40 mm) |
| `labels` | bool | false | optional short pill labels over main parts (create-time only) |
| `step` | 0..5 | 0 | current practical step |

Changing `specimen` or `stain` through `setState` resets the bench to step 0 (apparatus returns to its resting place).

## Steps (`setStep(n)`, `nextStep()`, `play()`, `pause()`, `reset()`, `settle(seconds)`)

| step | onion | cheek |
|---|---|---|
| 0 | bench ready | bench ready |
| 1 | dropper lifts out of the bottle, a drop of stain forms on the slide | spatula smears cheek cells on the dry slide |
| 2 | forceps lift the peel off the scale and lay it flat in the drop | dropper puts a drop of stain on the smear |
| 3 | cover slip held at `coverslipAngle_deg` on the needle | same |
| 4 | slip lowered, film spreads, bubbles appear (if angle < 30), **view disc shows the mounted slide**; emits `mounted` | same |
| 5 | tidy up (forceps rest) | spatula goes into the disinfectant beaker |

`settle(seconds)` fast-forwards the animation (for tests and for jumping straight to a state).

## `parts` (also `userData.parts`; each has `userData.partId`)

`slide`, `stage` (white tile), `drop`, `film`, `specimen` (= `peel`), `peel`, `smear`, `scale`, `bulb`, `coverslip`, `needle`, `forceps`,
`spatula`, `iodine`, `methylene`, `salt` (dropper bottles), `disinfectant` (beaker), `view` (eyepiece disc).
The Lesson 05 names `peel, iodine, coverslip, spatula, methylene, slide, stage` are all present.

## `reading()` (computed from the model, never typed text)

```
{ specimen, stain, stain_colour: "yellow-brown"|"blue"|"none", angle_deg,
  bubbles: 0 if angle >= 30 else min(8, 1 + floor((30 - angle) / 4)),
  layers: 1 | 2 (folded), nucleusVisible, contrast: 0..1,
  cellWall (onion true), nucleusPosition ("side" onion | "central" cheek), vacuoleVisible (onion),
  plasmolysed (onion + salt), crenated (cheek + salt),
  faults: ["air-bubbles","folded-peel","no-stain","plasmolysed","crenated"], quality: "good"|"poor",
  view, magnification, field_um (1600 | 400), width_um (onion 50, cheek 60), cells_across (field / width),
  step, mounted }
```
Consequences drawn on the view disc: air bubbles = thick dark rings; folded = overlapping darker band + fold line; no stain = faint walls and
no nucleus; salt = plasmolysed onion (protoplast pulled from wall) or crenated cheek cells; iodine = yellow-brown, methylene = blue nuclei.

## Events (`kit.onEvent(name, detail)`; the demo forwards them to `host.emit`)

| name | detail |
|---|---|
| `step` | `{ step }` whenever the step changes |
| `mounted` | `reading()` once the cover slip is down (step >= 4) |
| `state` | `reading()` after a parameter change |

Suggested lesson wiring: emit `l5:bench` with `reading()` on `mounted`; `l5:bench-done` after one good onion and one good cheek mount.

## Notes

- Phone first: ~60 meshes, one 512 px canvas redrawn only when state changes, DPR capped at 2 by the demo. No HUD sprites unless `labels: true`.
- Model values are textbook-level: onion cell width 50 um, cheek cell about 60 um (consistent with 02-lesson). Iodine on cheek is shown as pale (contrast 0.4).
