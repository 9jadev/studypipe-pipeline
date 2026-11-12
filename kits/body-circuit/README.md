# `body-circuit` (`window.BodyCircuit`)

3D standing body (Lesson 03 of `ss2-bio-heart-circulation`, "The Double Circuit"): organs, named vessels, a red-blue route tracer, the hepatic portal zoom and the coronary zoom with a *Block* toggle. Classic script, offline, three.js only (labels draw their own canvas sprites; no SceneKit needed).
Load after `three.min.js`: `<script src="body-circuit.js">`. Put `HeartKit.heart({ mode: "both" })` beside it in the lesson for the big beating heart.

## Usage
```js
var kit = BodyCircuit.create({ labels: true, onEvent: function (name, detail) {} });
scene.add(kit);                    // THREE.Group, feet at y = 0, head top at y = 3.4, faces +z
// each frame:  kit.update(dt, t)
kit.trace("armBrain");             // preset | { from, to } (edge ids) | [edge ids...]
kit.freeTrace("forearmVein", "brainCap");   // then kit.tap(partId) for each vessel / chamber / valve in order
```
**Orientation:** the figure faces the viewer, so the patient's right is on the SCREEN LEFT (-x). Say so in labels and narration.

`create(opts)` / `setState(obj)`: `view` (`"body"` default | `"portal"` | `"coronary"`), `labels` (`true` organs | `"vessels"` | `false`), `skin` (glass body on/off), `bpm` (default 72; beats the compact in-chest heart), `speed` (tracer and particle rate), `blocked` (coronary view), `storeFraction` (portal view, share of glucose stored as glycogen, default 0.6), `onEvent`, `reset: true`.

## Model (the only source of readings)
The whole circulation is a directed graph (`BodyCircuit.model.edges`): every vessel, capillary bed, chamber and valve is an edge with `part`, `from`, `to`, `kind` (`A` artery, `V` vein, `C` capillary bed, `ch` chamber, `valve`) and oxygen `o0 → o1` (0 blue, 1 red). A route is the **shortest directed path** between a start and an end edge (`kit.route(a, b)`); valves and lungs are **counted from that path**, nothing is typed. Vessel colour and tracer colour both come from `o0 → o1`, so the tracer turns red only inside the lung capillaries (and blue again in each systemic bed).

Presets (`kit.presets`) and results (checked against 02 § L03):
| preset | route | valves | passes lungs |
|---|---|---|---|
| `armBrain` | forearm vein → subclavian vein → SVC → RA → tricuspid → RV → pulmonary valve → pulmonary artery → lung capillaries → pulmonary vein → LA → bicuspid → LV → aortic valve → aorta → carotid → brain | 4 | yes |
| `ileumBrain` | gut capillaries → hepatic portal vein → liver sinusoids → hepatic vein → IVC → RA … (as above) … aorta → carotid → brain | 4 | yes |
| `liverKidney` | liver → hepatic vein → IVC → RA … lungs … LV → aorta → renal artery → kidney | 4 | yes |
| `lungsHeart` | lung capillaries → pulmonary vein → LA → bicuspid → LV → aortic valve → aorta → coronary artery → heart muscle | 2 | starts in the lungs (`passedLungs: true`, it begins there) |

## Methods
`trace(path)` → `true|false` · `freeTrace(fromEdge, toEdge)` (waits; the start vessel is already lit) · `tap(partId)` → `{ ok, label, next }` or `{ ok:false, expected }` · `hint()` (label of the next vessel to tap, `null` when finished) · `reset()` · `setState(obj)` · `update(dt, t)` · `reading()` · `highlight(partId, on)` (emissive pulse; `highlight()` clears all) · `viewFor(name)` → `{ target:[x,y,z], dist }` (`body, head, chest, heart, gut, liver, kidney, arm, leg, portal, coronary`) · `pickPart(raycaster)` → partId or `null` (the glass skin is never picked) · `route(a, b)` · `BodyCircuit.makeHighlighter(scene)` (same contract as HeartKit's).

Edge ids you can pass to `trace` / `freeTrace` (beds end in `Cap`): `armCap forearmVein subclavianV svc ra tricuspid rv pulmValve pulmonaryArtery lungCap pulmonaryVein la bicuspid lv aorticValve aortaRoot aortaAsc aortaDesc1..4 carotid brainCap jugular subclavianA mesenteric gutCap hepaticPortal hepaticArtery liverCap hepaticVein renalA kidCap renalV femoralA legCap femoralV ivcA ivcB ivcC coronaryA heartCap coronaryV`.

## `reading()`
`{ view, route:[labels, in order, repeats merged], routeName, valves, passedLungs, complete, from, to, steps, parts:[partIds in order], bpm, cycle_s, free?:{ next, tapped, of, wrong }, portal?, coronary? }`
`valves` / `passedLungs` count only what the tracer has **already passed** (full values once `complete`). `portal` (view `"portal"`): `{ glucoseSeen, stored, passedThrough, glycogenGranules, storeFraction }`; every glucose sphere that reaches mid-sinusoid is stored if `(n x 0.618) mod 1 < storeFraction` (deterministic), becoming a cluster of glycogen granules beside the sinusoid. `coronary` (view `"coronary"`): `{ blocked, blockage, musclePctAtRisk, musclePctStarved, bloodBeyondBlock }`; the territory is the part of the ventricle surface fed by the LAD beyond the clot (about 18 %), greying over about 3 s after `blocked: true`.

## Parts (`g.parts`, each tagged `userData.partId`)
Organs: `lungs liver gut kidney brain arm leg heartMuscle` (plus `armLeft legLeft kidneyLeft lungsLeft`, same tags). Heart: `heart ra la rv lv tricuspid bicuspid aorticValve pulmValve semilunar aorta pulmonaryArtery pulmonaryVeins venaCavae`. Vessels: `carotid jugular subclavianA subclavianV forearmVein renalA renalV femoralA femoralV hepaticPortal hepaticVein hepaticArtery mesenteric coronary coronaryV svc ivc`. Mirrored left-side vessels share the right side's partId. Named in 02 § L03: all present. `parts.semilunar` = the aortic valve object (both semilunar valves carry their own ids `aorticValve` / `pulmValve`); `parts.venaCavae` = SVC mesh, `parts.pulmonaryVeins` = the route vein.

## Events (`onEvent(name, detail)`)
`route-start {name, from, to, length}` · `step {index, edge, part, label, oxy, valve, lungs}` (each vessel / chamber / valve entered; use `part` to light the same part on the big `HeartKit.heart`) · `valve {part, label}` · `route-done { ...reading() }` · `free-start {from, to, expected, steps}` · `tap-ok {part, label, next}` · `tap-wrong {tapped, expected}` · `view {view}` · `reset`.
Lesson glue: emit `l3:bench` on `route-done` (detail = `reading()`), `l3:bench-done` after 3 routes.

## Geometry (HeartKit v2 fidelity, about 80k triangles for the body view)
Glass body from an extruded, bevelled outline with leg gap and glowing contour; arms and legs as tapered tubes; brain as a displaced sphere with gyri, central fissure and per-vertex shading (plus cerebellum); lungs as bevelled extrusions with a cardiac notch, textured, with fissures and a branching trachea and bronchi; liver as a textured lobed extrusion with gall bladder; stomach, ridged coiled small intestine and haustrated colon as tubes (the small intestine centreline IS the gut capillary path); bean-shaped kidneys deformed from spheres; spine; the heart as analytical heart-shaped myocardium with tinted chamber pools that squeeze at the beat rate and valve funnels / pockets; every vessel a `CatmullRomCurve3` `taperTube` with per-vertex red-purple-blue oxygen colour (hepatic portal vein tinted amber: food-rich). Portal view: translucent intestine with 170 instanced villi, wall capillary mesh merging into the portal vein, lobed liver with a hexagonal lobule (hepatocyte texture), portal triads at three corners, 18 sinusoids to the central vein, hepatic vein out, glucose spheres and glycogen granules. Coronary view: analytical heart shell with per-vertex territory colouring, aorta root with three sinuses and three cusps, left main to LAD / circumflex, right coronary, great cardiac vein, plaque and clot at the blockage, blood particles that pile up behind it.
