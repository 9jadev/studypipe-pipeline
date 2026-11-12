# `auto-workshop-props` (`window.AutoWorkshopProps`)

Shared **story props** for every `story.js` in the Ohm's Law unit (`ss2-phy-ohms-law-circuits`): Nkechi's auto-electric
workshop on Ngwa Road, Aba (StoryStage Set 1) and her test bench (Set 2). Use it so the keke, the battery and the
jumper cables look the same in all five lessons. Reusable for any electricity, auto-mechanic or market-workshop story.

Classic script, offline, three.js only (`window.THREE`). `window.SceneKit` is optional (used only for the sign texture).
Load it **after** `three.min.js` and `scene-kit.js` and **before** `story-scene.js` / `story.js`
(copy `kits/auto-workshop-props/auto-workshop-props.js` to `html/assets/js/auto-workshop-props.js`).

**Scale:** 1 unit = 1 metre, the StoryStage scale (people about 1.75 m tall; market table top y = 0.94; lab bench top y = 0.99, lab-local).
Every prop stands on y = 0 at its own origin, front towards +z. The keke's nose is +x (seen side-on from the StoryStage camera).

## Quick use in `story.js`
```js
var shop = null;
StoryStage.wire("story-stage", "story", beats, {
  names: { ... },
  setup: function (api) {
    if (window.AutoWorkshopProps) {
      shop = AutoWorkshopProps.dressWorkshop(api, { tobeStall: true });      // Set 1 (lessons 01-03)
      // or: shop = AutoWorkshopProps.dressBench(api, { meterOnBattery: true }); // Set 2 (lessons 04-05)
      // place people with shop.spots.emeka / .tobe / .chinedu / .nkechi   ([x, 0, z] in the set group)
    }
  },
  onTick: function (api, dt, t) { if (shop) shop.update(dt, t); }
});
// in a beat:  run: function (api) { api.shot.apply(null, shop.shots.battery); shop.battery.setLoad(2.8); }
```
`dressWorkshop` / `dressBench` also register every prop in `api.props` (`api.props.keke`, `.battery`, `.cablesThin`, …),
so StoryStage `rect("battery")` / `highlight("keke")` and narration targets like `{ scene: "story", part: "battery" }` work.

### `dressWorkshop(api, opts)` (Set 1, market group)
Hides the jars and the two vinegar bottles (`keepMarketProps: true` keeps them) and moves the jerrycan to the left of the stall.

| prop key | where (market space) | default |
|---|---|---|
| `keke` | (2.9, 0, 1.5), turned −0.45 rad so the nose and headlamp face the camera | on |
| `battery` | on the table (0.72, 0.94, 0.02); E = 12.0 V, r = 1.2 Ω, corroded terminals (Emeka's worn battery) | on |
| `cablesThick` / `cablesThin` | two red + black jumper sets lying on the table front (thick behind, thin in front) | on |
| `meter` | digital multimeter on the table (0.30, 0.94, 0.30) | on |
| `coil`, `bulb` | constantan spool and B22 bulb on its holder, table back | on |
| `toolBoard` | pegboard on legs behind the stall (−1.35, 0, −1.55) | on |
| `cells`, `pump` | three D cells / 12 V pump on the table back (lesson 03) | add to `include` |

Options: `include` (array of keys above), `keke`, `battery`, `bulb`, `coil`, `cells`, `pump`, `toolBoard` (each passed to its `create*`),
`meterOnBattery` (probes on the battery posts, LCD = battery terminal p.d. from the model), `tobeStall` (Tobe's neighbouring stall at x ≈ 4.3:
its produce is replaced by five batteries and a "TOBE BATTERIES" sign), `propScale` (enlarge the small table props for wide shots; default 1 = real size).
Returns `{ <props>, update(dt, t), spots, shots, highlighter(scene) }`.
`shots` (StoryStage `[camPos, lookAt]`): `wide`, `table`, `battery`, `cables`, `keke`, `kekeLamp`, `batteryBox`.
`spots`: `emeka` (by the keke), `tobe` (by his stall), `chinedu` (front of the table), `nkechi` (behind the table).

### `dressBench(api, opts)` (Set 2, lab group at world x = 40)
Hides the balance, burette and flasks (`keepLabProps: true` keeps them). Default `include`: `battery, meter, cablesThin, cablesThick, coil, bulb`
(also `cells`, `pump`, `keke`). Same options and return shape. `shots`: `bench`, `battery`, `cables` (world coordinates). `spots`: `nkechi`, `chinedu` (x 0.9, z −0.9 as the build plan says), `tobe`.

## The props (`AutoWorkshopProps.create*`)
Every builder returns a `THREE.Group` `g` with `g.parts` (= `g.userData.parts`, every mesh tagged `userData.partId`),
`g.update(dt, t)` (= `g.tick`), `g.setState(o)`, `g.reading()` and `g.pickPart(raycaster)`.

| builder | what it is | methods | `reading()` | parts |
|---|---|---|---|---|
| `createKeke(opts)` | Bajaj-style three-wheeler, about 2.7 × 1.3 × 1.8 m: one front wheel on a sprung fork, two rear wheels in arches, tapered nose with round headlamp and indicators, curved windscreen with wiper, motorcycle handlebar with grips, levers, speedometer and mirrors, driver's seat on the battery box, bench seat, black rexine canopy with green fringe and rolled side curtains, rear panel with window, spare wheel, tail lamps, "ABIA" plate, exhaust | `setLamp(0–1)`, `setLampSource(fn)` (fn → 0–1 each frame), `setBatteryBox(0–1 \| bool)`, `setState({ lamp, boxOpen, speed (m/s, wheels roll), battery:{…} })`, `g.battery` (the battery inside the box) | `{ lamp, boxOpen, speed, battery }` | `body, canopy, windscreen, handlebar, headlamp, frontWheel, rearWheels, spareWheel, tailLamps, batteryBox, batteryLid, battery, driverSeat, passengerSeat` |
| `createBattery(opts)` | 12 V lead-acid battery 24 × 17 × 19 cm: case with label (volts from `E`), ribs, hold-down ledge, lid, six vent caps, carry handle, tapered lead posts with red/black collars and +/− marks, terminal clamps with bolts and cable tails, white-green sulphate crust | `setLoad(R \| null)`, `setHeat(0–1)` (warm glow + heat shimmer), `terminal(+1 \| −1, v)` (world position of a post top), `setState({ E, r, R, heat, corrosion, clamps })` | `{ E, r, R, I, V, lost, P_r, P_R, heat, corrosion }` from `model.cell` | `case, lid, ventCaps, handle, posPost, negPost, posClamp, negClamp, corrosion` |
| `createJumperSet(opts)` | red + black pair; `gauge: "thin" \| "thick"` | `setCurrent(I)` (heat from the model), `setHeat(0–1)`, `setState({ from, to, sag, bend, floorY, … })`, `g.red`, `g.black` | the red lead's reading | `red, black, insulation, clips` |
| `createJumperCable(opts)` | one lead: spline insulation (`TubeGeometry`), copper ferrules, two alligator clamps (extruded toothed copper jaws, rubber sleeves, coil spring, pivot pin) | `setEnds(a, b)`, `setCurrent(I)`, `setHeat(h)`, `setClipOpen(rad)`, `curve()` | `{ gauge, d_mm, L_m, rho, R_ohm, I, P_W, heat }` | `insulation, clipA, clipB` |
| `createBulb(opts)` | A60 pear envelope (lathe), B22 brass cap with bayonet pins, glass stem, lead-in wires, coiled filament on an arc, optional batten holder (`holder: false` for a hand-held bulb) | `setVoltage(V)`, `setGlow(0–1 \| null)` (null = follow the model) | `{ V, I, R, P, glow, V_rated, P_rated }` from `model.lamp` | `holder, cap, envelope, filament` |
| `createWireCoil(opts)` | spool of bare resistance wire, label printed from `material` and `d_mm` (default constantan 0.30 mm), loose end on the table | — | `{ material, d_mm, rho, R_per_m, R_40cm }` | `spool, winding, wireEnd, label` |
| `createMultimeter(opts)` | yellow-holstered digital multimeter: LCD (drawn from the value), rotary dial, three jacks, tilt stand, red/black probe leads | `setValue(v)`, `setSource(fn)`, `clipTo(battery \| null)`, `setProbes(redTip, blackTip)`, `setState({ mode, unit, decimals, value })` | `{ mode, unit, value, text }` | `body, display, dial, jacks, probes` |
| `createToolBoard(opts)` | pegboard on legs, combination spanners (extruded, hex ring end), screwdrivers, pliers, hacksaw, test lamp, hanks of wire. `toolScale` (default 1.6) enlarges the tools so they read at story distance | — | `{ tools }` | `board, tools` |
| `createCellPack(opts)` | `n` identical D cells (default 3 × 1.5 V, r = 2.0 Ω); series = end to end, parallel = side by side with copper bus straps (animated) | `setArrangement("series" \| "parallel", instant)`, `setLoad(R)` | `{ n, arrangement, E_cell, r_cell, E_total, r_total, R, I, V, lost, P_r, P_R }` from `model.cellArray` | `cellA, cellB, cellC, bus, leads` |
| `createPump(opts)` | small 12 V DC water pump: finned motor can, volute housing, inlet, outlet, bracket, red/black leads, water stream when running | `setRunning(bool)` | `{ running, R }` | `motor, housing, water` |

`AutoWorkshopProps.makeHighlighter(scene).highlight(partId)` / `.clear()` pulses any tagged part. `AutoWorkshopProps.triangles(obj)` counts triangles.
The kit emits **no events**; the lesson's `story.js` owns its `story:beat` flow.

## Model (`AutoWorkshopProps.model`, the only source of readings)
| function | rule |
|---|---|
| `cell(E, r, R)` | `I = E/(R + r)`, `lost = Ir`, `V = E − Ir`; `R = null` is open circuit (`I = 0`, `V = E`). Emeka's battery 12.0 V, 1.2 Ω on the 2.8 Ω starter test load → 3.0 A, 3.6 V lost, 8.4 V |
| `cellArray(n, E, r, arr, R)` | series `E_t = nE`, `r_t = nr`; parallel (identical cells) `E_t = E`, `r_t = r/n`. 3 × 1.5 V, 2.0 Ω on a 1.0 Ω pump → series 0.64 A, parallel 0.90 A |
| `wireR(rho, L, d_mm)` | `R = ρL/(πd²/4)`; `RHO = { copper 1.7e-8, constantan 4.9e-7, nichrome 1.1e-6 }` Ω m. Thin 0.30 mm vs thick 1.20 mm of the same metal and length → R ratio 16 |
| jumper heat | `setCurrent(I)`: `P = I²R`, `heat = 1 − exp(−(P/L)/heatRef)`, `heatRef = 1.1 W m⁻¹`. At 3.0 A (copper, 1 m): thin 2.16 W → heat 0.86 (glows), thick 0.135 W → 0.12 (stays cool) |
| `lamp(V, V_rated, P_rated)` | empirical filament law `I = I_rated (V/V_rated)^0.55` (non-ohmic: R rises with V); `glow = P/P_rated`. Default bulb 12 V 15 W: 9.6 Ω hot |

Demo wiring that the lesson can copy: `keke.setLampSource(function () { return Math.min(1, AutoWorkshopProps.model.lamp(keke.battery.reading().V, 12, 35).glow); })`
then `keke.battery.setLoad(2.8)` dims the headlamp (glow 0.58 at 8.4 V) and `setLoad(null)` restores it.

## Geometry and budget (triangles)
keke 28.0k · battery 4.8k (3.0k with `lite: true`) · thin jumper set 9.4k · thick set 10.2k · bulb 5.0k · wire coil 1.6k · multimeter 3.5k · 3 cells 2.6k · pump 2.9k · tool board 10.2k.
Default `dressWorkshop` ≈ 73k (+15k with `tobeStall`), default `dressBench` ≈ 35k: fine on the story stage (the people and market are light). Textures are small canvases (≤ 1024 × 440).
Techniques: keke tub = `THREE.Shape` side profile with wheel arches cut in, `ExtrudeGeometry` with bevel, then each vertex's width scaled by an analytic taper `hw(x)`
(wide passenger cabin → narrow nose); livery and stripe painted on a `CanvasTexture` mapped in body space; canopy roof = deformed plane (dome + droop + rolled edge);
windscreen = curved deformed plane with tube frame; tyres with tread bump, lathe rims; seats = analytic rounded boxes with channel-stitch vinyl.
Battery = rounded box with planar label UVs, lathe vent caps and tapered posts. Alligator clamps = extruded toothed lever profiles + helix spring.
Bulb = lathe envelope, coiled-coil filament swept on a Bézier arc. Spool winding = lathe with turn texture + bump. Multimeter LCD = live `CanvasTexture`.

## Demo
`demo.html`: gallery modes (Keke, Nose, Battery box, Battery, Cables, Clamp, Bulb, Meter, Cells, Pump, Tool board) and the real StoryStage
(`Set 1`, `Set 1 keke`, `Set 1 table`, `Set 1 box`, `Set 2`, loaded from the lesson-shell `story-scene.js`), toggles for the 2.8 Ω starter load, 3.0 A in the cables,
series/parallel, pump, battery-box lid, and a bulb-voltage slider; the readout line prints every model reading. `node scripts/qa.mjs kits/auto-workshop-props/demo.html` → PASS.
