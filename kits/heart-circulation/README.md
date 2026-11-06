# HeartKit (`kits/heart-circulation/heart-kit.js`)

**v2** · Reusable 3D cardiovascular, vascular, lymphatic, and haematology builders (`window.HeartKit`) built on `window.THREE` and `window.SceneKit`.

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
- `valve` — `setState({ open: 0..1, cusps: 2|3 })`, `setCusps(n)`.
- `capillaryBed` — `setState({ mode: "normal"|"kwash"|"congest"|"blocked", probe: 0..1, nfp })`.
- `bloodSmear` — `setState({ clot, sickle, hb })`. Pass `labels: false` for small story props.
