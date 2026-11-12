# `pendulum` (v3) — `window.PendulumKit`

A 3D school-lab simple pendulum for SHM lessons: split cork in clamp jaws on a boss head and retort stand, thread,
turned brass/wooden bob with a centre band, chalk-tipped rest marker, metre rule with a readable mm/cm scale, set-square to the bob
centre, protractor, stopwatch with a live LCD; also a ceiling rig and a Barton's-pendulums frame.
Classic script, 100 % offline, `window.THREE` only (`kits/_vendor/three-bundle.min.js`). **Every number comes from `PendulumKit.model`.**

File: `kits/pendulum/pendulum.js` → copy to `html/assets/js/pendulum.js`. Demo: `demo.html` (open over `file://`).
The legacy v2 widget (`kit.js`, `window.StudyPipeKits.pendulum`, demo `demo-v2.html`) is unchanged for older topics.

## Usage
```js
var kit = PendulumKit.create({ mode: "practical", onEvent: function (name, detail) {} });
scene.add(kit);                 // THREE.Group, 1 unit = 1 m, viewer on +z, y up, bench/floor top at y = 0
kit.update(dt, t);              // every frame (= kit.tick = kit.userData.update)
stage.addPart("bob", kit.parts.bob, "Bob");   // SceneKit: register any id from kit.partsFor()
```
`create(opts)`: `mode` (default `laws`), `onEvent`, `seed` (reaction-delay PRNG), `autoRelease`, plus any `setState` key for that mode.

## Methods on the group
| method | what it does |
|---|---|
| `update(dt, t)` | runs the swing (speed-scaled), stopwatch, measuring animation, Barton build-up, highlight pulse |
| `setState(patch)` | `mode` switches (each mode keeps its own settings) · any key below · `labels` · `speed` · `reset:true`. Changing a physical setting stops the swing (rows are kept) |
| `reading()` | live model values for the current mode (below) + `rows`, `done`, `watch {state, display, n}` |
| `release()` | pulls the bob to the set angle (0.6 s) and lets go. Barton: same as `start()` |
| `time(n, {instant})` | stopwatch run: starts as the bob passes the rest mark counting **zero** and stops after `n` oscillations, landing exactly on the model time (`instant:true` returns the reading now). `practical`: 1st call = t₁, 2nd = t₂ |
| `startWatch()` / `stopWatch()` | manual stopwatch (L01) — each press takes effect after a modelled reaction delay of 0.1–0.3 s (seeded); `reading().manual = { t, n, delayStart, delayStop }` |
| `measure()` | `practical`: the metre rule slides up to the cork's lower edge, the set-square drops to the top of the bob ("thread 0.380 m") then to the centre ("+ r 2.0 cm → l 0.400 m"); with `length-to-top` it stops at the top |
| `start()` | Barton: releases the driver; cones build up with time constant 1/(ζω₀) |
| `highlight(part)` / `clearHighlight()` | pulsing emissive on that part only (materials are per-part). `PendulumKit.makeHighlighter(scene)` also exists |
| `viewFor(part)` | `{ target, dist, size:[x,y,z], pitch, yaw }`; `"all"` = whole mode; `"conical"` = top view of the bob's path. Fit distance for any aspect: `max(size.y/2/tan(fov/2), size.x/2/(tan(fov/2)·aspect))·1.1` (see demo) |
| `pickPart(raycaster)` · `partsFor(mode)` · `triangles()` · `settings()` · `reset()` · `setMode(m)` · `getMode()` | helpers |

## Model (the only source of numbers)
| quantity | rule |
|---|---|
| `periodModel: "small"` | `T = 2π√(l/g)` (default for every mode except `laws`, `forces`) |
| `periodModel: "exact"` | `T = 2π√(l/g) / AGM(1, cos(θ₀/2))` (complete elliptic integral; equals the series `1 + θ²/16 + 11θ⁴/3072 + …`) — `laws` default |
| `model.timeFor(n, l, g, deg, pm)` | `n·T` rounded to 0.01 s (stopwatch). Mass never enters (`bob` only swaps brass ↔ wood, same size) |
| practical | fixed class readings for the five presets (g = 9.79, r = 2.0 cm); other lengths `20·2π√(l/g) ± 0.03 s` (deterministic); `T = t̄/20`, `T²` from the unrounded `T`, `g = 4π²l/T²` |
| faults | `count-from-1`: t × 19/20 (counter starts at "1") → g ≈ 11 % high · `time-from-extreme`: start/stop judged at the extreme, t₁ +0.34 s, t₂ −0.27 s · `length-to-top`: recorded `l = l − r` (times unchanged) · `wide-angle`: 40° swing, t × exact factor 1.0313 · `conical`: path is a horizontal circle, `T = 2π√(l cos α/g)` (α = `coneAngle_deg`, 15°) · `draught`: t₁ +0.21, t₂ −0.18, extra amplitude loss and sideways push |
| ceiling | `l = H − y`, `T² = (4π²/g)(H − y)`, slope `−4π²/g` |
| energy | `h = l(1 − cos θ)`, `E = mgh₀`, `PE = mgh`, `KE = E − PE`, `v_max = √(2gh₀)`; `h0` sets θ₀; `decay` = amplitude ratio per cycle (total bar shrinks) |
| Barton | support moved by the driver: `θᵢ'' + 2ζωᵢθᵢ' + ωᵢ²θᵢ = (ω²S/lᵢ) cos ωt`, `S = κ·l_d·θ_d` (κ 0.30, θ_d 8°, ζ 0.06) → `Aᵢ = (ω²S/lᵢ)/√((ωᵢ² − ω²)² + (2ζωᵢω)²)`, lag `φᵢ = atan2(2ζωᵢω, ωᵢ² − ω²)`: shorter cones ≈ in step, equal length ¼ cycle behind (90°), longer ≈ opposite |

Reproduced exactly (script-checked in Chromium): **L01** l 0.80 m, n 20 → 35.90 s (T 1.795, f 0.557 Hz, ω 3.50); 0.2 s reaction error → 11.1 % (1 osc) vs 0.56 % (20 osc).
**L04** (exact, 20 osc, l 0.50 m): 5° 28.40 · 10° 28.44 (50 g and 100 g) · 30° 28.88 · l 0.25 → 20.11 · l 1.00 → 40.22 · Moon → 70.38 s.
**L05**: (0.400: 25.36, 25.44 → T² 1.613) (0.550: 29.82, 29.76 → 2.219) (0.700: 33.57, 33.63 → 2.822) (0.850: 37.06, 37.00 → 3.428) (1.000: 40.13, 40.19 → 4.032), g = 9.79; count-from-1 at 0.400 → 24.09/24.17, g 10.85.
Ceiling (g 9.8, H 2.80): y 1.80 → T² 4.028, y 2.20 → 2.417. **L06 WE3**: 0.10 kg from 5.0 cm → E 0.049 J, v_max 0.99 m s⁻¹.
**L07 Barton** driver 0.60 m → T 1.555 s, f 0.64 Hz; amplitudes 4.7 / 8.9 / **20.0** / 8.5 / 4.6° (cone-3 widest), lags 10 / 23 / 90 / 152 / 164°; driver 0.45 m → cone-2 widest.
Okada match `model.lengthFor(0.50, 9.8)` = 0.0621 m.

## Modes, settings, parts, reading()
Common keys: `l` (m), `angle_deg`, `g` (9.8 | 1.6 | 9.79), `bob` (50 wood | 100 brass g), `r_bob` (0.020), `periodModel`, `n` (20), `speed` (time scale), `labels`.

| mode | defaults | parts | reading() adds |
|---|---|---|---|
| `trace` (L01 bench + zoom) | l 0.80, 10°, small, speed 0.35 (slow motion), `reactionError` 0.2 | `bob thread cork clamp marker ruler stopwatch ghosts amp-ruler stand` | `T f w t fraction phase (A/O/B) A_cm pins[A,O,B,O,A at 0,¼,½,¾,1] errOne_pct errTwenty_pct manual` — ghost bobs appear at A·0, O·¼, B·½, O·¾, A·1; amplitude ruler O→A; the stopwatch face shows the 1-osc vs 20-osc % error |
| `laws` (L04 bench) | l 0.50, 10°, 100 g, exact | `bob thread cork clamp marker protractor ruler set-square stopwatch` | `T f w t g_from_T`; `done` once `bob`, `angle_deg`, `l`, `g` have each been changed and a timing exists |
| `forces` (L04 3D context) | l 0.50, 20°, exact, auto-swinging | `bob thread cork` (+ clamp) | dashed vertical, live angle arc, swing path only — the force triangle is the Paper.js `pendulum-forces` scene |
| `practical` (L05 bench + zoom) | l 0.400, 10°, g 9.79, small, `fault` none | `cork clamp thread bob bob-centre ruler set-square marker stopwatch protractor` | `l l_true thread r_bob t1 t2 tmean T T2 g_from_T fault note measured expected{…}`; rows `{l,t1,t2,tmean,T,T2,fault,g_from_T}`; `done` after five fault-free lengths |
| `ceiling` (L05 zoom) | H 2.80, y 1.80, g 9.8 | `hook thread bob ruler set-square marker` | `H y l T T2 t slope` (stacked metre rules 0–250 cm, H and y dimension arrows) |
| `energy` (L06 bench) | l 0.80, 100 g, h0 0.05 m (θ₀ 20.4°), `decay` 1 | `bob thread cork ke-bar pe-bar total-bar h-marker` | `h0 h E KE PE v vmax E0` (bars normalised to the starting energy) |
| `barton` (L07 bench) | driverL 0.60, cones [0.30, 0.45, 0.60, 0.75, 0.90], ζ 0.06 | `driver cord cone-1 … cone-5 ruler` | `driverL T fDriver w cones amps[°] ampsRel phases[°] widest widestPart widestL running steady live[°]`; row and `done` at steady state |

## Events (`onEvent(name, detail)`; CustomEvent-free — bench.js re-emits `lN:bench` etc.)
`mode` · `state` · `release` · `timing {n}` · `timed` + `reading` (detail = `reading()`) · `watch-start {delay}` · `measured {thread, r_bob, l, fault}` · `steady` (Barton) · `done` (once per mode) · `reset`.

## Geometry & cost (triangles, `triangles()`)
laws / practical ≈ 11 k · trace ≈ 17 k · forces ≈ 6 k · energy ≈ 12 k · ceiling ≈ 4 k · barton ≈ 9 k.
Split cork = two tapered extruded D-section halves with the thread between, in felt-lined jaws with screw and wing nut; bob = `LatheGeometry`
sphere with turned equator groove, black centre band, centre punch, neck and hook eye; rule faces, protractor scale, cork, brass, wood grain,
paper, plaster and tiles are seeded `CanvasTexture`s; set-square is an extruded triangle with its window; protractor an extruded half-ring with
a printed degree scale; stopwatch a lathe case with knurled crown, buttons and live LCD; paper cones are thin lathe shells hung apex-up with
the pendulum length measured to the cone's centroid (⅔ of its height); the Barton cord is a sagging tube that flexes with the support motion.
Labels are short sprites (≤ 20 characters) placed beside static parts, never over the bob; `labels:false` hides them (do this below 560 px and
show values in `.bench-readout`).
