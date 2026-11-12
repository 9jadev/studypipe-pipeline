# HeartKit (`kits/heart-circulation/heart-kit.js`)

**v2.1** · Reusable 3D cardiovascular, vascular, lymphatic, and haematology builders (`window.HeartKit`) built on `window.THREE` and `window.SceneKit`.

## Builders

- `HeartKit.heart(opts)` — 3D 4-chamber cut-away mammalian heart (RA, RV, LA, LV with $3\times$ thicker LV wall, septum, tricuspid/bicuspid/semilunar valves, chordae tendineae, venae cavae, pulmonary artery/veins, aorta, coronary arteries, and $\text{SAN}\rightarrow\text{AVN}\rightarrow\text{His}\rightarrow\text{Purkinje}$ conduction wave).
- `HeartKit.circuitCompare(opts)` — 3D Open vs Single (2-chamber) vs Double (4-chamber) circulatory loop.
- `HeartKit.cube(L, opts)` — 3D $\text{SA}/\text{V} = 6/L$ diffusion scaling cube with hypoxic core.
- `HeartKit.valve(opts)` — 3D Atrioventricular valve flaps, chordae tendineae, and papillary muscles.
- `HeartKit.vessels(opts)` — 3D Artery, Vein (with semilunar pocket valve), and Capillary (with single-file RBCs).
- `HeartKit.capillaryBed(opts)` — 3D Capillary ultrafiltration, tissue fluid, and blind-ended lymphatic vessel.
- `HeartKit.bloodSmear(opts)` — 3D Erythrocytes, lobed-nucleus phagocyte, lymphocyte, platelets, and insoluble fibrin clot mesh.
- `HeartKit.label(text, opts)` — Crisp 3D sprite label pill.

## v2 state API
- `heart({ bpm, mode, labels, scale })` — modes: `both` (section + blood flow), `pace` (conduction spark), `sys` (5 mm vs 15 mm wall callouts), `exterior`, `dissect` (static Paper 3 section), `specimen` (static exterior). `setState({ bpm, mode, labels, hold: 0..1|null })`; read `userData.phase` and `userData.beat.avOpen` to sync other models.
- `circuitCompare` — `setState({ mode: "double"|"single"|"incomplete"|"open"|"both" })`.
- `cube` — `setState({ L })` (mm): purple O₂-starved core grows as L passes ~1 mm.
- `valve` — `setState({ open: 0..1, cusps: 2|3, chordaeCut })`, `setCusps(n)`. **v2.1** `chordaeCut: true` snaps the cords (short stubs on the papillary muscles, loose ends on the flaps); when the valve is shut the flaps evert into the atrium and a red leak jet streams back. `userData.leak` (0..1) reports the jet; new part `leakJet`.
- `capillaryBed` — `setState({ mode: "normal"|"kwash"|"congest"|"blocked", probe: 0..1, nfp })`.
- `bloodSmear` — `setState({ clot, sickle, hb, citrate })`. **v2.1** `citrate: true` (with `clot: true`) = calcium removed: platelets still gather, fibrin does not form (a few short broken stubs, part `fibrinStubs`), red cells are not drawn into a clot.
- `vessels` — **v2.1** `setState({ focus: "artery"|"vein"|"capillary"|null })` (a string also works): glowing ring (part `spotlight`) + the chosen vessel grows 18 % while the other two dim; `userData.focus` echoes it. Pass `labels: false` for small story props.

## v2.1 notes
Strictly backward compatible with v2 (no existing parts, options or defaults changed). `HeartKit.version` is `2.1`. Demo: `kits/heart-circulation/demo.html` (tabs Valve, Vessels, Smear, Heart). Topics holding a copy of `heart-kit.js` can re-copy it to get the additions.
