# `cell-bio` (`window.CellKit`) v2

Reusable parametric 3D cell-biology, microscopy, protist, osmometry and ultrastructure kit for StudyPipe Biology topics.
Classic script (`cell-kit.js`), needs `window.THREE` and `window.SceneKit`. Fully offline. `demo.html` previews the upgraded builders.

v2 upgrades `plantCell`, `animalCell`, `microscope` and `mitochondrion` to HeartKit-v2 fidelity. **The API and `parts` names of v1 are unchanged**
(the Welcome Hub's `welcome-lab.js` still works untouched); v2 only adds options, parts and `reading()`.

## Builders (`window.CellKit`)
Every builder returns a `THREE.Group` with `group.userData.parts`, `userData.update(dt, t)` and (where live) `userData.setState(obj)`.
Aliases on the group: `.parts`, `.update`, `.tick`, `.setState`, `.reading`.

### `plantCell(opts)`
Options: `w, h, d` (box size, default 2.4 / 1.4 / 1.2), `chloroplasts` (12), `onion` (no chloroplasts), `tonicity` (+1 turgid ... 0 flaccid ... -1 plasmolysed), `cutaway` (default `true`: front face removed; `false` closes the box).
- Cellulose wall: bevel-free extruded rounded frames = primary wall + gold middle lamella + secondary wall, cut-away rim shows the double line, fibril bump texture, plasmodesmata channels through back and side walls.
- Protoplast: plasma membrane is a live superellipsoid, so on plasmolysis the **corners peel away from the wall first** and Hechtian strands stay attached; organelles keep their size and drift inward.
- Vacuole = sap + distinct tonoplast shell. Chloroplasts: double-membrane lens, 3 grana stacks of thylakoid discs + stroma lamellae, starch grain, streaming round the edge.
- Parts: `cellWall` (group), `middleLamella`, `cutFace`, `plasmodesmata`, `membrane` (=`cytoplasm`), `hechtian`, `vacuole` (group), `tonoplast`, `sap`, `nucleus`, `nucleolus`, `chloroplast` (group), `mitochondrion`, `er`, `golgi`, `ribosome`.
- `setState({ tonicity })`, `setTonicity(0..1)`. `reading()` -> `{ tonicity, state: "turgid"|"flaccid"|"plasmolysed", protoplastFraction }` (protoplast volume / cavity volume from the superellipsoid model).

### `animalCell(opts)`
Options: `r` (0.9), `seed`, `cheek`, `simple`, `color`. Live `tonicity` swell / burst / crenation as in v1.
Nucleus has a double envelope with instanced nuclear pores, chromatin strands and nucleolus; rough ER is folded cisternal sheets with ribosomes; Golgi is a stack of curved extruded cisternae with vesicles; mitochondria show cristae.
Parts (unchanged): `membrane, cytoplasm, nucleus, nucleolus, mitochondrion, centrioles, lysosome, vacuole, golgi, er, glycogen, ribosome`. `isBurst()`.

### `microscope(opts)`
Options: `objective` (0 = x4, 1 = x10, 2 = x40; default 1), **`mirror`** (`false` default: built-in lamp on a solid foot, as v1; `true`: horseshoe foot with a swivelling plane/concave mirror, daylight source and incoming ray),
`eyepiece` (10), `fieldNumber` (16 mm), `iris` (0..1, 0.7), `focus` (0..1, 0.5), `mirrorFace` (`"plane"|"concave"`), `mirrorAngle_deg` (45).
- Curved C-arm (offset-ribbon `ExtrudeGeometry`), bevelled horseshoe or rounded foot, `LatheGeometry` body tube / inclined eyepiece / objectives with **engraved x4 / x10 / x40 colour bands** (red / yellow / blue, NA printed) and knurled rings, revolving nosepiece (active objective hangs vertical, others swing out), stage plate with a real aperture hole, slide + cover slip + specimen, tube spring clips, condenser, 7-leaf iris with lever, coarse + fine knurled knobs on both sides, light-path cone (lamp or mirror -> specimen -> up the tube to the eye).
- Parts: `foot` (=`base`), `arm`, `tube`, `eyepiece` (group), `eyeLens`, `nosepiece` (=`turret`), `objective` (the revolving group), `stage`, `slide`, `specimen`, `clips`, `condenser`, `iris`, `lamp`, `coarse` (=`knob`), `fine`, `beam`, `lightPath`; with `mirror: true` also `mirror`, `planeFace`, `concaveFace`.
- `selectObjective(i)` / `setObjective(i)`; `setState({ objective, focus, iris, mirror: "plane"|"concave", mirrorAngle_deg })`. `focus` raises/lowers the stage and spins the knobs (fine 4x coarse); a mirror more than 9 degrees off 45 degrees cuts the light.
- `reading()` -> `{ objective, M_obj, eyepiece, M, field_mm (= fieldNumber / M_obj: 4.0 / 1.6 / 0.4), iris, mirror, lit, focus }`.

### `mitochondrion(opts)`
Cut-away (`cut: false` for a closed organelle). Outer membrane + inner membrane (lathe) with **cristae folds as extruded plates** alternating from opposite walls, matrix visible, mtDNA loop, matrix granules, drifting ATP.
Parts: `outer, matrix` (=`innerMembrane`), `cristae, atp, mtDNA, granules`.

### Unchanged from v1
`rbc`, `bacterium`, `protist(type)`, `cube`, `slide`, `chloroplast`, `bilayer`, `label`, `setLabelText`, `glass`, `glowMat`, `std`, `makeHighlighter`, `nucleusMesh`, `mitochondrionMesh`, `chloroplastMesh`.
`CellKit.version === 2`. `std()` now accepts hex numbers for `emissive` / `color` extras. New export: `canvasTex(w, h, draw, srgb)`.

## Events
The kit itself fires none; lesson code emits `l0X:bench` etc. from `reading()`.

## Phone budget
Plant cell about 120 draw calls (chloroplast grana and nuclear pores are instanced, mitochondria share cached geometry); microscope about 140.
