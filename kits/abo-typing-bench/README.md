# `abo-typing-bench` (v1)

ABO and Rhesus blood-typing tile for the Lesson 07 practical, plus two zoom views: **agglutination** (Y antibodies bridging cells) and **Rhesus sensitisation** over two pregnancies.
Classic script, offline, `window.AboTypingBench`. Needs `window.THREE`. Optional `window.HeartKit` (`rbcGeo`, `makeHighlighter`) and `window.SceneKit` (glow sprite); the kit has its own fallbacks, so it never throws without them.
1 scene unit = 1 cm in the bench view, Y up. Cells in the zoom views are drawn at about 1 unit radius.

Apparatus (all `LatheGeometry` / `ExtrudeGeometry` with holes / `TubeGeometry`, procedural canvas textures): white ceramic tile (extruded slab with 15 circular holes, a lathe dimple in each, a glossy lens over each fluid disc), three dropper bottles (glass lathe body, label, collar, rubber teat, glass pipette that really lifts out, squeezes and drips) for **anti-A (blue)**, **anti-B (yellow)** and **anti-D (clear)**, a sample bottle with its own dropper, a pot of three clear stirrers, a lancet with cap and steel tip, a yellow sharps bin with a slot lid, and a stopwatch that counts the 2 minutes. The tile has 5 rows (Rider, Donor 1 to 4) and 3 wells per row.

## Use

```js
var kit = AboTypingBench.create({ sample: "rider", view: "bench" });
scene.add(kit);                         // kit is a THREE.Group (kit.group === kit)
AboTypingBench.lights(scene);           // optional
scene.environment = AboTypingBench.environment(renderer);   // optional, makes the glass shine
AboTypingBench.fit(camera, controls, aspect, kit.params.view);   // framing per view
// per frame: kit.update(dt, t)   (alias kit.tick)
kit.onEvent = function (name, detail) {};
var hl = kit.attachHighlighter(scene); kit.highlight("antiB");    // glow on a named part (null clears)
```
`StudyPipeKits["abo-typing-bench"].mount(container, params, host)` builds a whole page (canvas, readout, buttons); `demo.html` uses it.

## Parameters (`create(opts)` and `setState(obj)`)

| name | values | default | effect |
|---|---|---|---|
| `view` | `"bench"` \| `"agglutination"` \| `"rhesus"` | `"bench"` | which scene shows (the others are hidden); emits `view` |
| `sample` | `rider` `donor1` `donor2` `donor3` `donor4` | `"rider"` | sample being typed (one row of the tile each). Changing it resets that row |
| `abo`, `rh` | `"A"\|"B"\|"AB"\|"O"`, `"+"\|"-"` | null | override the sample's group (any group can be typed) |
| `patient` | `{ abo, rh }` | `{ B, - }` | patient for the safe / unsafe verdict (the rider) |
| `step` | 0..5 | 0 | bench step (below); the apparatus animates to it |
| `rock_s` | null or seconds | null | null = automatic (0 to 120 s while step 4 runs). A number fixes the time the tile has been rocked, so you can show a weak, early reading |
| `errors` | `{ earlyRead, reusedStirrer, dryingEdge }` | all false | see Errors |
| `donor`, `donorRh`, `serum` | `"A"\|"B"\|"AB"\|"O"`, `"+"\|"-"`, `"anti-A"\|"anti-B"\|"anti-D"` | `B`, `-`, `anti-B` | agglutination view: which cells meet which serum (the lower panel is the control, a serum that does not match) |
| `agg` | null or 0..1 | null | agglutination progress; null loops by itself (free, bridging, clumped, reset) |
| `stage`, `prevent` | 0..3, bool | 0, false | Rhesus view stage; `prevent` = anti-D injection after the first birth |
| `labels` | bool | false | optional short plate labels over the bench parts (create-time only) |

## Bench steps (`setStep(n)`, `nextStep()`, `play()`, `pause()`, `reset()`, `settle(seconds)`, `fillAll()`)

| step | what happens |
|---|---|
| 0 | bench ready; the active row is outlined |
| 1 | each serum dropper lifts out of its bottle, goes over its well in the active row, squeezes and drops (anti-A, anti-B, anti-D, left to right) |
| 2 | the lancet goes into the sharps bin; the sample dropper adds one drop of the sample to each well |
| 3 | a fresh stirrer swirls each well (one stirrer per well; `reusedStirrer` makes stirrer 1 do all three) and the stirrers are laid down used |
| 4 | the tile rocks and the stopwatch runs to 2:00 (fast); clumps grow with time |
| 5 | read the wells; the row gets a tick. Emits `sample`; after all 5 rows `done` |

`fillAll()` completes all five rows at once (for demos and tests). `settle(s)` fast-forwards the animation.

## Biology model (the single source of truth, never typed text)

- Antigens on red cells: A `["A"]`, B `["B"]`, AB `["A","B"]`, O none, plus `D` when Rh+. Antibodies in plasma: A has anti-b, B has anti-a, AB none, O both (same tables as `kits/video/blood`).
- A well clumps when `donorAntigen AND serumAntibody` match: anti-A well with antigen A, anti-B with B, anti-D with D. Clump amount grows with rocking time, `sstep(15, 120, rock_s)`; a well reads positive at amount >= 0.5, so a 2 minute wait is needed.
- Expected patterns anti-A / anti-B / anti-D: Rider `- + -` (B, Rh-) · Donor 1 `- - -` (O, Rh-) · Donor 2 `+ - -` (A, Rh-) · Donor 3 `- + +` (B, Rh+) · Donor 4 `+ + -` (AB, Rh-).
- Transfusion rule `AboTypingBench.compat(patient, donor)`: unsafe if a donor antigen meets a patient antibody (ABO), or if an Rh- patient would get Rh+ cells. `AboTypingBench.bags(patient)` rates the six bags. For the rider (B Rh-): O+ no (Rh), O- **yes**, A- no (antigen A meets anti-a), B+ no (Rh), B- **yes**, AB- no (antigen A meets anti-a).

## Errors (`errors: {...}`, directions as in 02-lesson.md Lesson 07)

| flag | effect | result |
|---|---|---|
| `earlyRead` | the clock stops at 45 s before the read | weak clumping missed: **false negative** |
| `reusedStirrer` | stirrer 1 serves all wells and carries serum forward; a later well clumps when an earlier serum matches the cells | **false positive** (e.g. the rider's anti-D well clumps because anti-B was carried over) |
| `dryingEdge` | the last truly negative well gets a grainy dry rim | **false positive** |

`reading().faults` lists which of `false-negative`, `read-too-soon`, `false-positive-stirrer`, `false-positive-drying` happened.

## `reading()` (computed; fields depend on `view`)

Bench:
```
{ view:"bench", sample, label, A, B, D (observed booleans, null until step 5), group ("B Rh−"), abo, rh, pattern ("- + -"),
  truth:{A,B,D,abo,rh,group}, correct, faults[], wells:[{serum,name,clump,amount,truth}], rock_s, step, read,
  safeForPatient (= safeForRider), aboOK, rhOK, safeReason, samplesDone, done[5], patient }
```
Agglutination: `{ view, donor, donorRh, serum, antigens, clump, bridged (0..1), controlSerum, controlClump, reason }`.
Rhesus: `{ view, stage, prevent, leaked, motherAntiD, sensitised, babyAtRisk, haemolytic, caption }`.

## Events (`kit.onEvent(name, detail)`)

| name | detail | suggested lesson event |
|---|---|---|
| `step` | `{ step, reading }` | |
| `sample` | `reading()` when a row is read (step 5 reached) | `l7:bench` |
| `done` | `reading()` when all 5 rows are read | `l7:bench-done` |
| `state` | `reading()` after `setState` | |
| `view` | `{ view }` (refit the camera: `AboTypingBench.fit(..., view)`) | `l7:zoom` |
| `stage` | rhesus `reading()` | |

## `parts` (also `userData.parts`; each tagged `userData.partId`)

Bench: `tile`, `wells` (the 15 wells), `antiA`, `antiB`, `antiD` (bottle and dropper), `stirrer` (the three stirrers), `lancet`, `sharpsBin`, `sampleTube`, `timer`, `bench`.
Agglutination: `agglutination` (= `antibody`), `panelMatch`, `panelControl`. Rhesus: `rhesus`, `mother`, `baby`, `placenta`, `syringe`.

## Views

- **agglutination**: two panels. Top, the chosen donor cells in the matching serum: red cells with antigen knobs (A orange cones, B blue spheres, D lilac octahedra), free Y-shaped antibodies (extruded `Shape`) that, as `agg` rises, take up positions between neighbouring cells with both arm tips touching them, pulling the cells into a packed clump. Bottom, the same cells in a serum that does not match: the Y antibodies drift past and the cells stay free. Which panel clumps comes from the antigen / antibody rule above, not from a flag.
- **rhesus**: a mother figure with uterus, baby, placenta and cord above two blood zones separated by the placenta wall. Stage 0, pregnancy 1: cells kept apart. Stage 1, birth: the membrane tears and four Rh+ baby cells pass into the mother's blood. Stage 2: without injection a plasma cell makes anti-D Ys, which hold the leaked cells (sensitised); with `prevent: true` a syringe delivers anti-D that clears the cells and then disappears. Stage 3, pregnancy 2: without injection her anti-D crosses the placenta and the new baby cells clump and darken (haemolytic disease); with injection there is no anti-D and they stay healthy. Cells reuse `HeartKit.rbcGeo`'s profile when HeartKit is loaded.

## Notes

- Phone first: the bench is about 400 draw calls worth of small meshes at most; the 15 well textures are 128 px canvases redrawn only when quantised state changes; zoom views use `InstancedMesh` (cells, knobs, antibodies). 3D plates are off by default; read values from the HTML readout under the canvas.
- Typing sera colours follow the usual commercial kit (anti-A blue, anti-B yellow, anti-D clear). In the zoom views antibody colour matches the antigen it binds (same colours as the video kit: A orange, B cyan, D lilac).
- Teaching sources of error follow the lesson text only; no numbers are invented beyond the 2 minute wait and the reading threshold (documented above).
