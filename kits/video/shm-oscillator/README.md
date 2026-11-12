# Video kit · shm-oscillator

Simple harmonic motion, forced vibration and resonance. Three scenes in one kit (`scene`, cross-fades):

- **spring**: one or two vertical loaded springs (`n`).
  - `skin: 'lab'`: spiral spring on a retort-stand clamp, hanger with slotted 50 g discs (count = round(m / 0.050)), pointer on a
    metre rule (cm, 0 at the unloaded pointer; shown with `n: 1`). The helix keeps a fixed coil count, so a bigger load spreads
    **every** coil evenly.
  - `skin: 'okada'`: teaching model: carrier plate with egg crates (3 at 200 kg, 5 at 250 kg) on a compression coil above an axle
    block, "model" badge always on. Sag drawn at 10 units/cm (6.2 vs 7.8 cm differ visibly).
  - The kit computes the static stretch `x0 = mg/k` and the period `T = 2π√(m/k)` for each spring. `x` is measured from the
    **loaded** equilibrium line. Force and acceleration arrows are ∝ |x| on one fixed scale (4 cm draws exactly twice 2 cm), always
    point towards equilibrium, follow the live x while oscillating, and are hidden at x = 0. Oscillation is released from the held
    `x` (x = A cos(ωt + φ)), slowest at the ends. `slow` scales both springs alike, so 0.50 s vs 0.56 s drift apart while 1 cm
    vs 3 cm on the same load stay exactly in step.
- **barton**: Barton's pendulums. A taut cord between two posts, a heavy dark driver (length `driverL`) and paper cones (`cones`),
  all drawn to one length scale (320 units/m). The driver swings at `T = 2π√(l/g)`. Every cone is driven at the driver's frequency.
  Its amplitude is computed from `1/√((1 − r²)² + (2ζr)²)`, `r = f_driver / f_cone = √(l_cone / l_driver)`, with ζ = 0.06 and the
  matched cone at 14°. Its phase lag is `atan2(2ζr, 1 − r²)`: short cones swing nearly in step, the matched cone ¼ cycle behind,
  long cones nearly opposite. When `swing` turns on, the cones build up from rest (time constant 3 driver periods). On a re-tune
  they settle in about 2 s.
- **ridge**: the okada rear on Ridge Road. A laterite road with concrete ridge caps every `d` (50 units/m) scrolls right to left
  at a rate ∝ `v`. The wheel rides the base push `Y(1 + cos φ)` with `φ = 2π·distance/d`, so every ridge hit is exactly φ = 2πn.
  The rear has a coil-over shock absorber (damper body with a cut-away oil window, piston, shroud and coil) and the carrier with
  crates. The bounce is a base-excited damped oscillator (`m`, `k`, ζ 0.05 leaking / 0.30 healthy, `Y`):
  - `build: 0` gives the closed-form steady state `A = Y√(1 + (2ζr)²)/√((1 − r²)² + (2ζr)²)` at the driving frequency `f = v/d`.
  - `build: 1` integrates the motion in time, so at resonance it pumps up over several bounces and a speed change shows its
    transient.
  - Bounce drawn at 4 units/cm (10.0 cm is 7× the 1.4 cm ride).
  - Crate lift-off is computed: the carrier can only push up, so the crate leaves when the carrier's downward acceleration
    exceeds g, flies under gravity (exact free fall) and lands. A yolk splash ("crack") appears after the first landing of the
    current ride and clears when `v`, `m`, `k`, `d`, `Y` or `damper` change.

Values the kit reproduces (tested against its own precompute):

| Case | Kit value |
|---|---|
| Lab k = 24.5 N m⁻¹, 0.050 kg | 2.0 cm |
| Lab 0.200 kg | T = 0.568 s |
| Okada 200 / 250 kg | T = 0.500 / 0.559 s |
| Barton driver 0.60 m | T = 1.555 s; cones 0.30–0.90 m at 3.3 / 6.2 / 14.0 / 5.9 / 3.2°, lag 10 / 23 / 90 / 152 / 164° |
| Ridge, 200 kg, leaking | 10 → 1.44 cm · 14 → 2.49 · 16 → 4.40 · 18 (f = f₀ = 2.00 Hz) → 10.0 (1.0 × √1.01 ÷ 0.10 = 10.0499) (lifts, crate up to 7.4 cm) · 20 → 3.88 · 30 → 0.57 |
| Ridge, 200 kg, healthy | peak 1.99 cm, never lifts |
| Ridge, 250 kg, leaking | f₀ 1.79 Hz; 16 → 10.04 cm (lifts) · 18 → 3.68 cm (no lift) |
| Lift-off line g/ω² | 20.1 / 7.85 / 6.21 / 2.23 cm at 10 / 16 / 18 / 30 km/h |

**Timeline precompute.** Phases, build-ups, the bounce ODE and the crate flight would jump if computed from the time of the last
panel op. So the kit replays the video's own `DATA.cues` exactly like the runtime's panel keyframes and integrates once on a
1/120 s grid at load. Every frame stays a pure function of (t, P): pause freezes it and scrubbing reproduces it. Without `DATA`
it falls back to closed-form steady states. `KIT.__sim` exposes the precompute read-only for physics tests.

## States (`{ panel: 'shm-oscillator', s: { … } }`)

| State | Scene | Meaning |
|---|---|---|
| `scene` | all | `'spring'` · `'barton'` · `'ridge'` |
| `skin` | spring | `'lab'` · `'okada'` |
| `n` | spring | 1 or 2 springs (columns at x 155, or 110 and 310) |
| `m`, `m2` | spring, ridge | load in kg (lab 0–0.30; okada / ridge 150–300; `m2` defaults to `m`) |
| `k`, `k2` | spring, ridge | spring constant N m⁻¹ (lab default 24.5, okada and ridge 4π²·2.00²·200 ≈ 31 583, f₀ = 2.00 Hz; `k2` defaults to `k`) |
| `g` | all | default 9.8 |
| `scale` | spring (lab) | units per cm, default 9 |
| `ruler`, `reading` | spring (lab, n 1) | metre rule + pointer · label next to the pointer tip (≤ 10 chars) |
| `eq` | spring | dashed equilibrium line(s) with an "equilibrium" tag above the line |
| `x`, `x2` | spring | held displacement in metres (+ below) |
| `xArrow`, `xLabel` | spring | blue bracket from the equilibrium line to the load (spring 1) and its label |
| `force`, `forceLabel`, `force2`, `forceLabel2` | spring | red restoring-force arrows and labels |
| `accel`, `accelLabel` | spring | purple acceleration arrow (left of load 1) and label |
| `balance` | spring | mg (red, down) vs spring pull (green, up), equal, at rest |
| `osc`, `osc2`, `A`, `A2` | spring | oscillate at the computed period · amplitude in metres |
| `slow` | all | slow-motion factor ≥ 1 (one clock for everything); "slow motion" tag when > 1 |
| `tag`, `tag2` | spring | labels above the springs |
| `periodLabel`, `periodLabel2` | spring | gold stopwatch pills under the loads |
| `driverL`, `cones` | barton | driver length (animates) · cone lengths array |
| `swing`, `match` | barton | swinging on/off · glow on the cone equal to `driverL` (±0.005 m) |
| `v`, `d`, `Y` | ridge | speed km/h · ridge spacing m · base push cm |
| `damper` | ridge | `'leaking'`: oil streaks, low oil, piston in air · `'healthy'`: full oil, warm glow on each stroke |
| `build` | ridge | 0 steady at once · 1 integrated (grows) |
| `trace` | ridge | bounce strip chart (last 2.5 s real) with green ridge-hit ticks |
| `gauge`, `gaugeLabel` | ridge | amplitude gauge 0–12 cm (purple bar = largest bounce over the last driving period) with the red dashed lift-off line g/ω² (arrow at the top when off scale) · label |
| `readout`, `readoutV`, `readoutF`, `readoutT` | barton, ridge | pills (barton: one pill "readoutT, readoutF"; ridge: v pill + f pill) |
| `labels` | barton, ridge | part labels (cord, driver, cone lengths · ridges, d = … m, shock absorber, carrier) |
| `focus` | all | dashed pulsing ring: `pointer` `mass` `mass2` `eq` `spring` · `driver` `matched` `cones` `cord` `readout` · `crate` `damper` `ridges` `trace` `gauge` `readout` · `null` |

Role colours follow `meta.roles` when defined: `x` blue, `F` red, `a` purple, `k` green (spring pull), `T` gold (period pills) ·
`f` blue, `v` orange, `d` green, `A` purple (gauge bar, trace), `g` red (lift-off line).

## Camera close-ups (`{ camera, focus: '…' }`)

- spring: `pointer` · `mass` · `mass2` · `spring` · `both` · `eq`. These are re-aimed every frame from the state (column
  layout, load, skin) at rest positions, so they never shake.
- barton: `driver` · `cones` · `matched` (follows the cone matched to the current `driverL`) · `cord`.
- ridge: `crate` · `damper` · `ridges` · `trace` · `gauge` · `readout` · `rear`.

## Good for

Hooke's law, restoring force and a = −(k/m)x, the period of a mass–spring system (independent of amplitude, T ∝ √m),
the okada bounce, Barton's pendulums, the simple pendulum (`barton` with one cone and `swing`), forced vibration and
resonance (f = v/d, pushes in step, damping lowers and broadens the peak), lift-off when ω²A ≥ g. Later: energy bars, damped
free decay.

## Used in

- `ss2-phy-simple-harmonic-motion` lesson-02 video (scene `spring`) and lesson-07 video (scenes `barton`, `ridge`), planned.
- Demo: `kits/video/shm-oscillator/demo.plan.cjs` (every scene, state and close-up). QA is clean on 360×740, 740×360 and 1152×700.
