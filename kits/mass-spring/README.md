# `mass-spring` (v2) — `window.MassSpringKit`

Parametric 3D mass–spring and okada-shock-absorber kit for SS2 Physics (simple harmonic motion, Hooke's law,
period of a loaded spring, energy in SHM, damping, forced vibration / resonance). Classic script, 100 % offline,
three.js only (`kits/_vendor/three-bundle.min.js` → lessons: `assets/js/three.min.js`). Every number comes from
`MassSpringKit.model`; nothing is typed in. The v1 widget (`kit.js`, `demo-v1.html`) is kept unchanged for old users.

```html
<script src="../../assets/js/three.min.js"></script>
<script src="../../assets/js/ridge-road-props.js"></script>   <!-- optional: okada body + road -->
<script src="../../assets/js/mass-spring.js"></script>
```
```js
var kit = MassSpringKit.create({ mode: "period", m: 0.20, k: 24.5, onEvent: function (name, detail) {} });
scene.add(kit);                       // THREE.Group, 1 unit = 1 m, y up, viewer on +z, bench top / road at y = 0
kit.update(dt, t);                    // every frame
```

## Methods on the group
| method | what it does |
|---|---|
| `update(dt, t)` (= `tick`, `userData.update`) | advances the kit clock (`dt × timeScale`), poses the rig, runs the stopwatch / crate / shock simulation, pulses highlights |
| `setState(patch)` (= `userData.setState`) | any key in `MassSpringKit.defaults` (below); `{ reset: true }` resets the motion. Changing `mode`, `view`, `mass`, `leak`, `zeta`, `k`, `medium`, `parked` resets the motion |
| `reading()` | live numbers for the current mode, from the model (fields below); `display` holds strings rounded as in 02-lesson.md |
| `addMass(dm=0.05)` / `removeMass()` | slotted masses on the hanger (hanger = first 50 g; 0.05–0.50 kg). The spring settles with a short damped bounce |
| `release(A)` | pull down by `A` (m) and let go (okada bench → `press`, shock view → `push`) |
| `timeN(n, reaction=0)` | built-in stopwatch: starts at the next pass through equilibrium, stops after `n` whole oscillations; `t = n·2π√(m/k) + reaction` (no noise unless you pass `reaction`). Okada parked: `t = n·T₀` |
| `startWatch(delay)` / `stopWatch(delay)` | manual stopwatch; `delay` = simulated reaction time (start late → t shorter, stop late → t longer). Returns `{ t, n, T }` |
| `recordAmplitude()` | damping: amplitudes for every finished cycle, `A₀·ratio^n` (cm, 2 d.p.) |
| `press(A=0.03)` | okada parked: push the loaded carrier down and let go (damped free bounce at f₀) |
| `push()` / `pushTrain(n=10, interval=0.5)` | shock view: velocity kicks of 0.326 m s⁻¹ to the sprung rear |
| `highlight(part)` / `clearHighlight()` | pulsing emissive highlight (null clears). Props-owned okada parts use `RidgeRoadProps.makeHighlighter` |
| `viewFor(part)` | `{ target:[x,y,z], dist, pitch, yawPortrait }`; `"all"` frames the mode (lab: spring travel + mode extras). Portrait: multiply `dist` by `max(1, 1/aspect)` as `demo.html` does |
| `pickPart(raycaster)` | partId or `null` |
| `action(name, payload)` | narrator hook: `add-mass, remove-mass, release, time {n, reaction}, start-watch, stop-watch, record, press, push, push-train {n, interval}, ride {speed_kmh}, stop, reset, mode {mode}` |
| `triangles()` · `getState()` · `reset()` · `usesProps` · `dispose()` | helpers |

`g.parts` is a stable object whose keys are refreshed on every mode/view change (the parts of the visible rig);
re-read it after `setState({ mode })`. `MassSpringKit.makeHighlighter(scene)` is also provided (kit contract).

## `create(opts)` / `setState` keys (`MassSpringKit.defaults`)
`mode` (`period`) · `m` 0.20 kg · `k` 24.5 N m⁻¹ · `A` (null → mode default: period 3 cm, forces/energy/damping 5 cm, testtube 2 cm) ·
`medium` `air|water|oil` · `n` 20 · `g` 9.8 · `view` `bench|shock` (okada only) · `mass` 200 | 250 kg ·
`kOkada` = 4π²(2.00 Hz)²(200 kg) ≈ 31 583 N m⁻¹ (labels may say 3.16 × 10⁴) · `zeta` (null → from `leak`) · `leak` true (ζ 0.05) / false (ζ 0.30) ·
`speed_kmh` 10 · `d` 2.5 m · `Y` 0.010 m · `parked` false · `tubeMass` 0.030 kg · `tubeR` 0.0095 m · `rho` 1000 · `labels` true · `timeScale` 1.
Also `onEvent(name, detail)` (create only; the kit dispatches no DOM events: bench.js emits `l0X:bench`).
Events: `mass`, `release`, `timed`, `amplitude`, `press`, `push`, `pushes-done`, `lift`, `crack`, `reset`.

## Model (the only source of numbers)
| quantity | rule |
|---|---|
| static extension | `x₀ = mg/k`; pointer reading = 25.0 cm + x (the pointer sits at 25.0 cm on the 0-at-top metre rule when the spring is unstretched) |
| period | `T = 2π√(m/k)`, `t = nT (+ reaction)`, `f = 1/T`, `ω = 2π/T` |
| forces | `F = −kx`, `a = −(k/m)x` (x measured downward from equilibrium; arrows always point back to the dashed plane) |
| energy | `E = ½kA²`, `PE = ½kx²` (about equilibrium), `KE = E − PE` |
| damping | amplitude × ratio per cycle: air 0.97, water 0.75, oil 0.40; `ζ = δ/√(4π² + δ²)`, `δ = ln(1/ratio)`; `T_d = T₀·added/√(1 − ζ²)` (added-mass factor of the vane: 1.000 air, 1.003 water/oil) |
| test-tube | restoring force = extra upthrust `ρgAx`, `k = ρgπr²`, `T = 2π√(m/k)`, floating depth `m/(ρπr²)` (0.030 kg, r 0.95 cm → k 2.78 N m⁻¹, T 0.653 s, depth 10.6 cm) |
| okada ride | `f = v/d`, `f₀ = √(k/m)/2π`, `r = f/f₀`, `A = Y√(1 + (2ζr)²)/√((1 − r²)² + (2ζr)²)`; build-up time constant `1/(ζω₀)`; lift-off when `A ≥ g/ω²` with the **driving** `ω = 2πv/d` (`th`); `th0 = g/ω₀²` (= static sag) is reported too |
| crate | free body: leaves the carrier when the carrier's downward acceleration exceeds g; "crack" when it lands faster than 0.12 m s⁻¹ relative |
| okada parked | free damped bounce at f₀; `T₀ = 2π√(m/k)` |
| shock pushes | `ẍ + 2ζω₀ẋ + ω₀²x = 0` (fixed 0.5 ms steps) with a 0.326 m s⁻¹ kick every 0.5 s; peak `|x|` per interval |

Reproduced exactly (script-checked against 02-lesson.md):
L02 Hooke/period table `(0.050, 2.0, 5.68) (0.100, 4.0, 8.03) (0.150, 6.0, 9.83) (0.200, 8.0, 11.35) (0.250, 10.0, 12.69)`, T² `0.0806 … 0.403`;
L01 spring `t₂₀ 11.35 s, T 0.568 s, f 1.76 Hz, ω 11.1`; L06 amplitudes air `5.00 4.85 4.70 4.56 4.43 4.29` · water `5.00 3.75 2.81 2.11 1.58 1.19` ·
oil `5.00 2.00 0.80 0.32 0.13 0.05`, `E₀ = 0.0306 J`, 10 osc air `5.68 s`, water `5.70 s`; L06 WE1 `E = 0.25 J`;
okada 200 kg leaking `10 → 1.4, 14 → 2.5, 16 → 4.4, 18 → 10.0 (lift-off), 20 → 3.9, 30 → 0.6 cm`, threshold `6.2 / 5.0 / 2.2 cm` at 18 / 20 / 30 km/h;
healthy peak `2.0 cm`, never lifts; 250 kg leaking `16 → 10.0 cm (lift-off)`, `18 → 3.7 cm`, f₀ `1.79 Hz`, `g/ω₀² = 7.8 cm`;
parked `T₀ 0.50 s → 20 bounces 10.0 s` (200 kg), `0.56 s → 11.2 s` (250 kg);
shock pushes healthy `1.74 1.97 1.99 2.00 …` (settles at 2.0 cm), leaking `2.40 4.16 5.44 6.37 … 8.52` (past 6 cm from the 4th push).

## Modes, parts, reading()
| mode | what you see | parts | reading() |
|---|---|---|---|
| `hooke` | retort stand, boss + clamp, helical spring (TubeGeometry helix with hook loops, rebuilt as it stretches), hanger with extruded slotted 50 g brass discs, red pointer on a 0-at-top metre rule, stopwatch | `spring, hanger, slotted-mass, mass, pointer, ruler, clamp, stand, stopwatch` | `m, F, x, x_cm, pointer_cm, p0_cm, k, slotted, display` |
| `period` | same, bouncing; live stopwatch face (t, n, RUN) | as hooke | `m, k, n, t, T, f, w, T2, Tmodel, display, watch {running, t, count, timed}, x, released` |
| `forces` | red F = −kx, teal v and amber a arrows beside the load; dashed equilibrium plane | + `f-arrow, v-arrow, a-arrow, equilibrium` | `m, k, x, x_cm, F, a, v, A` |
| `energy` | KE / PE / total bars on a board beside the spring (heights ∝ energy) | + `ke-bar, pe-bar, total-bar` | `E0, E, KE, PE, A0, A, x, T, t10, cycles, amps, display` |
| `damping` | card vane under the hanger in a LatheGeometry beaker (graduated) of water / oil / air on a scissor lab jack that sets the vane at mid-depth | + `vane, beaker, jack` | as energy + `medium, ratio, ampsModel, recorded` |
| `testtube` | weighted test-tube (lead shot, cotton plug, paper scale) floating upright in water, restoring-force arrow, waterline plane, ripple | `testtube, beaker, f-arrow, equilibrium` (`mass` = test-tube) | `m, r, rho, k, T, f, depth_cm, x, F` |
| `okada` view `bench` | okada on laterite with concrete ridges every 2.5 m (scrolling), twin rear coil-overs, carrier + egg crate (free body), speedometer | `okada, rear-shock, carrier, crate, ridges, speedometer` | model `okada()` fields (`v, f, f0, w0, T0, r, zeta, A, th, th0, lift, sag, display`) + `speed_kmh, leak, damper, parked, Acur, crateOff, lifted, cracks, y`; parked: `T, n, t, watch` |
| `okada` view `shock` | cut-away coil-over (150° window, red section faces, honed bore), brass piston with 6 real orifices (Shape holes), chrome rod, oil column (86 % healthy / 28 % leaking), oil jets through the orifices that warm in colour with dissipated energy, bubbles above low oil, weeping-oil streak and drip when leaking | `rear-shock, piston, orifices, oil, coil, damper-body` | `leak, zeta, f0, x, A, A_cm, E, E_removed_per_cycle, removedFrac, oilLevel, heat, pushes, peaks, peaksModel` |

**RidgeRoadProps:** when `window.RidgeRoadProps` is loaded first, okada mode uses `RidgeRoadProps.okada()` (driven by
`setBounce(y)`, `setWheelBump(yF, yR)`, `setSpeed(kmh)`, `liftCrate(dy)`, `crack()`, `setLeak(on)`) and `RidgeRoadProps.road()`
(`scroll(s)`, `bumpAt(x)`), and maps `carrier, crate, rear-shock, speedometer` to its parts. Without it, a built-in stand-in
okada (lifted from the hub's `welcome-lab.js`) is used, so the kit always works alone. `kit.usesProps` tells you which.

## Phone notes
Labels are short sprites beside static parts (never on the moving load); hide them below 560 px with `setState({ labels: false })`
and show values in `.bench-readout`. Triangles: lab 5–16 k, okada ≈ 26 k (stand-in), shock ≈ 15 k. Demo: `demo.html`
(`?mode=…&view=shock&props=1`).
