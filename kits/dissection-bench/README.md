# `dissection-bench` (v1)

Goat-heart dissection bench for WAEC Paper 3 practicals (SS2 heart topic, lesson 02). Wraps `HeartKit.heart` (two instances: `specimen` exterior and `dissect` longitudinal section) on a dissecting board, with a scalpel, a 30 cm ruler and a measuring callout.
Classic script, offline. Needs `window.THREE` and `window.HeartKit` (v2 or later). **No SceneKit dependency.** 1 scene unit = 1 cm, Y up.

```html
<script src="three.min.js"></script><script src="heart-kit.js"></script><script src="dissection-bench.js"></script>
```
```js
var kit = DissectionBench.create({ length_cm: 8 });
scene.add(kit);  DissectionBench.lights(scene);          // lights() optional
DissectionBench.fit(camera, controls, aspect);           // optional framing (portrait/landscape)
// per frame: kit.update(dt, t)   (alias kit.tick, kit.userData.update)
kit.onEvent = function (name, detail) {};
kit.cut(1);                       // scalpel sweeps apex -> base, exterior is cut away, section appears
var r = kit.measure("lv");        // { region, trial, value, r1, r2, mean, pumpsTo } ; second call = reading 2
```
`StudyPipeKits["dissection-bench"].mount(container, params, host)` builds a full demo page (used by `demo.html`).

## Parameters (`create(opts)`, `setState(obj)`)

| name | values | default | effect |
|---|---|---|---|
| `length_cm` | 4..14 | 8 | base-to-apex length of the specimen (02 worked example 2 uses 8.0 cm); heart is scaled to it |
| `cut` | 0..1 | 0 | cut progress; `setState({cut})` jumps, `cut(to)` animates (about 4 s for a full sweep) |
| `errors` | `{ slantCut, papillaryIncluded, shrunken }` | none | slant: section tilted 30 degrees, every wall reads x 1.155 (too high); papillaryIncluded: RV and LV read +1.8 mm; shrunken: x 0.85 (too low) and heart drawn 10 % smaller |
| `labels` | bool | false | three short 3D pills (board, ruler, scalpel); hide below 560 px |

Clipping planes need `renderer.localClippingEnabled`. The kit switches it on in its first draw (`board.onBeforeRender`); a host can call `DissectionBench.enableClipping(renderer)` up front. Cut progress 0 and 1 never need clipping.

## Model (readings come from this, never from typed text)

True simulated readings, mm [reading 1, reading 2]: RA 1.6 / 1.4, LA 2.1 / 1.9, RV 4.2 / 3.8, LV 12.4 / 11.6, septum 10.8 / 11.2 (02 section L02). Means 1.5, 2.0, 4.0, 12.0, 11.0. LV : RV = 12.0 / 4.0 = 3.0. Errors are applied as above, then rounded to 0.1 mm. `DissectionBench.model(errors)` is the pure function.

## Methods

`measure(part)` (part: `ra|la|rv|lv|septum`, or `raWall` etc.) works only after the cut (otherwise emits `blocked`, returns `null`). First call per region gives reading 1, second gives reading 2 and the mean, further calls repeat reading 2. A callout (arrow, mm bar, pill "LV 12.4 mm") appears at that wall.
`reading()` -> `{ region, r1, r2, mean, pumpsTo, ratioLVRV, length_cm, cut, cutDone, errors[], table[5], complete }` (`table` rows: `{ region, name, r1, r2, mean, pumpsTo }`, null until measured). `reset()`, `settle(seconds)` (fast-forward for tests), `setState`.

## Events (`kit.onEvent(name, detail)`)

`cut` (sweep finished) · `measure` (each reading, detail as `measure()`) · `region-done` (both readings of a region taken) · `bench-done` (all five regions done; detail = `reading()`) · `blocked` · `reset` · `state`. The lesson maps `measure` to `l2:bench` and `bench-done` to `l2:bench-done`.

## Parts (`kit.parts`, each Object3D)

`ra, la, rv, lv` (cavities), `septum`, `tricuspid`, `bicuspid`, `chordae`, `papillary`, `aorta`, `pulmonaryArtery`, `pulmonaryVeins`, `venaeCavae`, `semilunar` (aortic pockets; pulmonary pockets in `pulmValve`), `scalpel`, `ruler`, plus `board`, `specimen`, `section`, `cutPlane`, `callout`, and wall anchors `raWall` (new), `laWall` (new), `rvWall`, `lvWall`. Internal parts are visible only after the cut. Use `HeartKit.makeHighlighter(scene)` with any part for a glow.
Orientation: heart lies front-side up, apex toward the viewer; the patient's right is on screen left.

## Fidelity notes

Board: rounded extruded slab with bevel, wood-grain `CanvasTexture` + bump, rubber feet, dissecting pins. Scalpel: lathe handle with ridges and thumb bump, extruded curved blade with edge facing away. Ruler: 30 cm, canvas graduations (mm ticks, cm numbers), steel edge. Heart: HeartKit v2 organs (not re-modelled). Cost: two `HeartKit.heart` instances (the specimen is hidden once the cut completes).
