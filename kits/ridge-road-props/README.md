# `ridge-road-props` (`window.RidgeRoadProps`)

Shared **story props** for every `story.js` in the Simple Harmonic Motion unit (`ss2-phy-simple-harmonic-motion`,
*The Cracked Crates of Ridge Road*): a laterite farm road near Ogbomoso with concrete drainage ridges every **2.5 m**,
Hajia Ramatu's farm gate and poultry pen, Mallam Sule's roadside shed (StoryStage Set 1), the school physics lab
(Set 2: pendulum, loaded spring, Barton's pendulums) and the okada whose rear end bounces. The same okada body is used by
`mass-spring` v2 (`okada` mode, L07 bench), which hangs its own cut-away coil-over on the anchors below.
Reusable for any okada, farm-road, vibration or resonance story.

Classic script, offline, three.js only (`window.THREE`). `window.StoryStage` is optional (only used to make a rider).
Load it **after** `three.min.js` / `scene-kit.js` and **before** `mass-spring.js`, `story-scene.js` and `story.js`
(copy `kits/ridge-road-props/ridge-road-props.js` to `html/assets/js/ridge-road-props.js`).

**Scale:** 1 unit = 1 metre (StoryStage scale). Every prop stands on y = 0 at its own origin.
**Okada frame:** nose +x, the right-hand side (exhaust, kick-start, clutch cover) faces +z, the chain and sprocket are on −z.
Wheel radius 0.31 m, front axle x = +0.65, rear axle x = −0.65 (wheelbase 1.30 m), carrier top ≈ (−0.79, 0.83).

## Quick use in `story.js`
```js
var road = null, lab = null;
StoryStage.wire("story-stage", "story", beats, {
  names: { ramatu: "Hajia Ramatu", ngozi: "Hajia Ramatu", dayo: "Dayo", cust1: "Dayo", zainab: "Zainab", tunde: "Tunde", sule: "Mallam Sule", okafor: "Mrs Okafor", amaka: "Mrs Okafor" },
  setup: function (api) {
    if (window.RidgeRoadProps) {
      road = RidgeRoadProps.dressRoad(api, { tape: false });   // Set 1 (also replaces mSign with "RIDGE ROAD · OGBOMOSO")
      lab = RidgeRoadProps.dressLab(api, {});                   // Set 2 (replaces lSign with "PHYSICS LABORATORY")
      api.people.ramatu = api.people.ngozi; api.people.dayo = api.people.cust1; api.people.okafor = api.people.amaka;
      api.people.dayo.position.fromArray(road.spots.dayo);      // spots are [x, 0, z] in the set group
      // new people: StoryStage.person({...}) placed at road.spots.zainab / .tunde / .sule, lab.spots.zainab / .tunde
    }
  },
  onTick: function (api, dt, t) { if (road) road.update(dt, t); if (lab) lab.update(dt, t); }
});
// beats:  run: function (api) { api.shot.apply(null, road.shots.okada); road.press(0.04); }
//         run: function (api) { road.mount(api.people.dayo); road.ride(18); }      // follow with road.followShot()
//         run: function (api) { api.shot.apply(null, lab.shots.barton); lab.barton.start(); }
```
Both dress functions register their props in `api.props`, so `rect("okada")`, `highlight("crate")` and narration targets
such as `{ scene: "story", part: "rear-shock" }` work. Registered keys:
Set 1 `okada, crate, ridges, road, shed, shock, newShock, gate, pen, crates, farmSign, rear-shock, rearShock, carrier, rearWheel, mud, shadow, speedometer, tape`;
Set 2 `pendulum, springStand, spring, barton, driver, cone-1 … cone-5, board`.
The shot coordinates in `02-lesson.md` are rough; use `road.shots.*` / `lab.shots.*` (they frame these sets).

### `dressRoad(api, opts)` → Set 1 (market group at world origin)
Hides the stock stalls, jars, bottles, buildings and the grey world road (`keepMarketProps`, `hideStockRoad: false` keep them).
Builds: savanna ground; 50 m laterite road along x, centred on z = 2.4, 4 m wide, ridge crests at x = 1.25 + 2.5k; Hajia Ramatu's
gate and wall at z = −1.9 (sign *HAJIA RAMATU FARMS · POULTRY & FRESH EGGS*); poultry pen with hens behind; three crates waiting by the gate;
Mallam Sule's shed at (−5.6, 0, −0.9) with the oil-weeping and the new shock on the bench; trees, an electricity pole, hills; the okada
parked on the near edge of the road at (0.1, 0, 0.85).
Options: `tape` (yellow tape measure crest to crest, shows 2.5 m), `mass` 200 | 250, `damper` `"leaking"` (default) | `"healthy"`,
`crates` (1–3), `okadaX/okadaZ`, `shedX`, `roadZ`, `sign: false`, `signText`, `mountDayo` (seat `cust1` at once).

Returns `{ okada, road, ridges, gate, pen, shed, shock, newShock, crateStack, crate, set, sim, spots, shots, update(dt, t), highlighter(scene), props, hidden }` plus story helpers:

| helper | what it does |
|---|---|
| `press(depth = 0.04)` | park and press the carrier down `depth` m, then release: free decay at f₀ with the damper's ζ (leaking: many bobs, healthy: two) |
| `ride(kmh, { mass, damper, from: −11, to: 11 })` | okada rides along the lane z = 2.0 over the fixed ridges, looping from `from` to `to`; rear amplitude builds to the model value with time constant 1/(ζω₀); the crate is a free body and **cracks** when it lands faster than 0.12 m s⁻¹ relative |
| `park(x, z)` | stop, back to the parked spot |
| `setLoad(200 \| 250)` | mass for the model; 250 kg shows three crates (Lesson 02's "two extra crates") |
| `setDamper("healthy" \| "leaking")` | ζ 0.30 / 0.05; the oil streak on the rear shocks follows |
| `mount(person)` / `dismount()` | seat a StoryStage person (Dayo) on the okada in a riding pose (shoes move to the feet) / put him back |
| `followShot(dist, height)` | `[camPos, lookAt]` tracking the riding okada (call `api.shot` with it in `onTick`) |
| `reading()` | `{ mode, kmh, mass, damper, A_cm, A_target_cm, th_cm, lift, f0, T0, t20, cracks }` from `model` |
| `shed.pushDampers(true)` | Lesson 06: the new damper compresses slowly, the old one slides at once |

`spots`: `ramatu (0, −1.0)`, `dayo (−1.05, 1.3)`, `zainab (2.3, −0.85)`, `tunde (3.1, −0.55)`, `sule (−6.75, −0.35)`, `okafor (1.55, 1.75)`, `gate`, `shedFront`.
`shots`: `wide, gate, okada, carrier, stand, ridges, ride, shed, shock, pen`.

### `dressLab(api, opts)` → Set 2 (lab group at world x = 40, bench top y = 0.99)
Hides the balance, burette and flasks and the reagent bottles (`keepLabProps: true` keeps them). Adds: retort stand with split cork
and a 0.80 m brass-bob pendulum (`lab.pendulum.swing(true)`, T = 2π√(l/g) = 1.80 s), retort stand with a helical spring, slotted
50 g masses and pointer by a metre-rule section (`lab.spring.setLoad(n)` n × 50 g → x = mg/k with k = 24.5 N m⁻¹; `lab.spring.bounce(true)`),
stopwatch and metre rule on the bench, chalkboard (T = 2π√(l/g), T = 2π√(m/k), f = 1/T, a = −ω²x), and **Barton's pendulums**
on a floor frame at lab x = 3.4 (`lab.barton.start()`, `setDriverLength(L)`).
`spots`: `okafor, zainab, tunde, okaforBarton, zainabBarton, tundeBarton`. `shots`: `lab, bench, pendulum, spring, barton, board` (world coordinates).

## `RidgeRoadProps.okada(opts)` (the API `mass-spring` v2 uses)
Returns a `THREE.Group` with `parts`, `update(dt, t)` (= `tick`), `setState(o)`, `reading()`, `viewFor(part)`:

| method | effect |
|---|---|
| `setBounce(y)` | absolute vertical displacement (m) of the carrier from rest; the sprung body pivots about the front axle (Lc = 1.44 m) |
| `setWheelBump(yF, yR)` | lift each wheel (ridge under the tyre); turns off auto bumps from an attached road |
| `setSpeed(kmh)` | wheels spin at v/R; the speedometer needle follows; with `attachRoad(road)` the road scrolls (treadmill) and the wheel bumps are read from `road.bumpAt` |
| `liftCrate(dy)` | raise the crate stack `dy` m off the carrier (it tilts a little) |
| `crack(n)` | crack flash at the crate + `n` eggs on the top tray turn to yolk; `reading().cracks` counts |
| `setCrates(0–3)`, `resetEggs()` | stack of egg crates on the carrier |
| `setMud(on)`, `setCentreStand(on, spinRadPerS)`, `spinRear(radPerS)` | Lesson 03: red mud lump on the rear tyre, bike up on its centre stand (rear wheel 3.5 cm clear), slow spin, the lump's shadow on the ground |
| `setLeak(on)`, `setShocksVisible(on)` | oil streak on the built-in coil-overs / hide them (mass-spring adds its own) |
| `seatRider(person)`, `dismount()` | rider pose (`opts.rider: true` makes one with StoryStage) |
| `anchors`, `anchorLocal(name)`, `anchorWorld(name)` | live mount points: `shockTopL/R` (frame, z ±0.108), `shockBottomL/R` (swing-arm, near the axle), `carrierTop`, `swingPivot`, `seat`, `handlebarL/R`, `headlamp`, `frontAxle`, `rearAxle` (the wheel groups). Rest values: top (−0.52, 0.715), bottom (−0.585, 0.375), eye-to-eye 0.346 m |
| `topCrate()` | the crate group on top (for a lid-off close-up) |

opts: `crates` (1), `leak` (true), `shocks` (true), `rider`, `mud`.
Parts (`userData.partId`): `okada, frame, tank, seat, engine, exhaust, fork, handlebar, headlamp, speedometer, mudguards, tailLamp, plate,
frontWheel, rearWheel, mud, shadow, swingarm, chain, rear-shock, carrier, stand, crate, eggs, rider`.
`RidgeRoadProps.createShock(opts)` is the coil-over on its own (`setLength(len)`, `setLeak(on)`).

## Other builders
`road(opts)` (`length 40, width 4, d 2.5, ridgeH 0.045, ridgeW 0.5, x0, tape, tufts`) → `bumpAt(x)`, `scroll(s)` (treadmill), `ridgeXs()`, `reading()`;
`rideController(okada, road, { mass, damper, treadmill })` → the same `ride/park/press/set/step(dt)/reading` engine as `dressRoad` (with `treadmill: true` the bike stays put and the road scrolls, for a bench);
`createCrate({ lite, eggs })`, `createEggTray({ cracked })` (a 30-egg pulp tray to hand to Hajia Ramatu with `person.hold(tray)`),
`createGate`, `createPoultryPen`, `createShed`, `createPendulumStand({ l })`, `createSpringStand({ k })`, `createBarton({ driverL, cones })`,
`createTree`, `createChickens`. `makeHighlighter(scene)`, `triangles(obj)`, `drawCalls(obj)`.

## Model (`RidgeRoadProps.model`; same numbers as `02-lesson.md` and `welcome-lab.js`)
| function | rule / check |
|---|---|
| `ridge(kmh, mass, damper)` | k is built from f₀ = 2.00 Hz exactly: k = 4π²·2.00²·200 = 31 583 N m⁻¹ (`model.STORY.kLabel` = "3.16 × 10⁴ N m⁻¹" is only a label). f = v/d, r = f/f₀, `A = Y√(1+(2ζr)²)/√((1−r²)²+(2ζr)²)`, Y = 1.0 cm; lift-off when A ≥ g/(2πf)². 200 kg leaking: 10 → 1.4, 14 → 2.5, 16 → 4.4, **18 → 10.0 cm (10.0499, > 6.2, lift)**, 20 → 3.9, 30 → 0.6; healthy peak ≈ 2.0; 250 kg leaking 16 km/h → 10.0 cm (threshold 7.9), 18 → 3.7 |
| `parked(mass)` | 200 kg: ω₀ 12.57, f₀ 2.00 Hz, T₀ 0.500 s, 20 bounces 10.0 s, sag 6.2 cm; 250 kg: T₀ 0.56 s, 11.2 s, 7.8 cm |
| `resonantSpeed(mass)` | 18.0 km/h (200 kg), 16.1 km/h (250 kg) |
| `barton(driverL, lengths, ζ = 0.05)` | driver 0.60 m → T 1.55 s, f 0.64 Hz, widest `cone-3`; amplitudes from the driven-oscillator response |
| `pendulumT(l, g)`, `springT(m, k)` | 0.80 m → 1.795 s; 0.20 kg on 24.5 N m⁻¹ → 0.568 s |
These are the story-model numbers for animation only; `mass-spring` v2 owns the bench readings.

## Quality (level of detail)
Every builder and both dress functions take `quality: "auto" | "high" | "low"` (default `"auto"`: **low** when the viewport's shorter side
is under 600 px or `navigator.deviceMemory` ≤ 4, otherwise high). The API, part names and props are the same in both. `RidgeRoadProps.quality(q)`
tells you what `"auto"` resolves to; `dressRoad(...).quality` reports the level used.
Low mode uses fewer lathe, tube, rod, extrude and spoke segments (18 spokes, 6-sided eggs, one coarse tray per crate, one crate strap), fewer tufts and hens,
detail-0 trees, and **bakes static geometry**: the okada body, wheels, swing-arm and shock halves, each crate, the crate stack, the lab stands and
the trees/pole/hills each become one vertex-coloured mesh; the gate, pen and shed become one mesh per material. `carrier`, `rear-shock`, `crate`, `eggs`,
`mud`, `speedometer` and the Barton cord/cones stay separate, so the narration spotlights still work. In low mode the okada's small sub-parts
(`tank`, `seat`, `engine`, …) all point to the merged body mesh, so highlighting one of them lights up the whole bike.

| measured in `demo.html` | high (desktop, close-ups) | low (phones) |
|---|---|---|
| okada (one crate) | 38.4k triangles / 73 calls | 16.6k / 22 |
| shed · gate · pen | 10.1k / 31 · 2.5k / 7 · 3.8k / 6 | 5.9k / 19 · 1.2k / 6 · 2.7k / 6 |
| **Set 1 (`dressRoad`, with tape)** | **80.0k / 155** | **37.2k / 67** |
| **Set 2 (`dressLab`)** | **16.4k / 79** | **11.2k / 63** |

## Geometry and budget
Techniques: wheels = lathe tyre cross-section with tread `CanvasTexture` + bump, lathe drop-centre rim and drum hub, 36 tangentially laced
spokes merged into one mesh, extruded 36-tooth rear sprocket with lightening holes; fuel tank = analytically deformed sphere (rear taper,
knee recesses, tunnel underside) with a painted pinstripe/knee-pad texture; seat = bevelled extruded profile, tapered and crowned, stitched vinyl;
engine = extruded crankcase + lathe cylinder with nine cooling fins, clutch/magneto covers; header pipe `TubeGeometry` into a lathe
muffler with a perforated heat shield; fork = lathe sliders, ribbed rubber gaiters and chrome stanchions, extruded triple clamps with holes;
mudguards = U-channel extruded along an arc; frame/carrier = `CatmullRomCurve3` tubes; swing-arm = extruded arms with axle-adjuster slots;
coil-overs = closed-end helix `TubeGeometry` over lathe damper bodies; crate = chamfered extruded slats with grain + stencilled label,
pulp trays with 30 moulded cups (vertex-displaced plane), instanced lathe eggs; ridges = cos² hump `ExtrudeGeometry` (instanced, one draw call);
road = cambered, rutted plane with laterite map + bump; gate/pen/shed = extruded pillars, steel tube gate leaves, block-wall and plank
textures, corrugated (displaced) zinc roofs, extruded spanners with ring holes, lathe oil drum.

High-mode triangles / draw calls: okada 38.4k / 73 · 16 m treadmill road 4.5k / 7 · pendulum stand 1.5k / 9 · spring stand 6.2k / 15 · Barton frame 1.5k / 16
(low: 1.3k / 7 · 0.7k / 3 · 2.6k / 7 · 1.0k / 14). Set totals are in the quality table above (StoryStage people not included; only what is in the camera
frustum is drawn). Textures are small canvases (≤ 1024 × 512), created once and shared.

## Demo
`demo.html`: gallery views (Okada, Side, Rear shocks, Crate, Front, Engine, Wheel, Ridges with tape, Tray, Gate, Shed, Lab rigs, Barton) on a
treadmill road (the L07 bench arrangement), plus the real StoryStage (`Set 1`, `gate`, `okada` with press-and-release, `stand` with mud,
`ridges`, `ride` with Dayo at 18 km/h and a following camera, `shed`, `Set 2`, `Set 2 Barton`). Controls: Ride, Press & release, 250 kg,
Healthy damper, Crack, Mud + stand, Rider, Push dampers, Detail high ↔ low (reloads with `?q=high|low`; default auto), speed slider (5–35 km/h), bounce slider (±8 cm → `setBounce`), Barton driver length.
The readout prints every model reading. `node scripts/qa.mjs kits/ridge-road-props/demo.html` → PASS (0 console errors, 0 network requests).
