# Kit request: shm-oscillator
**Status: REQUESTED 2026-11-11** (ss2-phy-simple-harmonic-motion, lesson-02 video). Build before the lesson-02 plan is written.
(02-lesson.md § 7 and the catalog backlog call this gap "pendulum & mass–spring SHM video kit"; the reusable id is
`shm-oscillator`. This request needs scene `spring`. **Other directors (lesson-07 Barton's / driven pendulums, any later
pendulum video): append a `## Scene … (lesson-0X)` section here instead of opening a new request.** It is separate from
`reference-circle` (lesson-03: circle and shadow, x/v/a traces, crate lift-off). Do not duplicate the lift-off scene here.)

Needed for: lesson-02 video, chapters 1–5 and 7 (Hooke's law with a pointer on a metre rule, the restoring force ∝ x towards
equilibrium, a = −(k/m)x, the period not depending on amplitude, the okada with 200 kg vs 250 kg bouncing side by side).
Reusable for: any loaded-spring / Hooke's law video (JSS elasticity, SS1 Hooke's law, energy in SHM `½kx²` if a bar state is
added later, damping if an amplitude-decay state is added later), and the pendulum scene other lessons may append.

## Must show: scene `spring`

One or two **vertical spiral springs** hanging side by side (`n: 1 | 2`), each from a clamp on a retort-stand bar at the top.

- **Spring.** A real helix (drawn as a zig-zag/coil path with front/back strokes), fixed number of coils. When the load grows,
  **the pitch grows evenly along the whole spring** (equal coil spacing: uniform stretch), never only the bottom coils.
  Static extension is computed by the kit: `x₀ = m g / k` (g default 9.8), drawn to a fixed scale (`scale`, px per cm, default
  chosen so that 10 cm of extension fits comfortably; the okada skin uses its own scale, see below).
- **Load, `skin: 'lab'`.** A hanger with **slotted 50 g discs**: the disc count is `round(m / 0.050)` (0 = empty hanger), each
  disc visibly slotted. A horizontal **pointer** fixed to the hanger points at a **vertical metre rule** with a cm scale
  (`ruler: 1`). `reading` is a plan string (≤ 10 chars) shown next to the pointer tip, e.g. `'2.0 cm'`.
- **Load, `skin: 'okada'`.** The okada's rear end as a model: a carrier plate with **egg crates** (trays visible) standing on
  a **compression coil spring** above a short ground/axle block (the coil squashes under load; the sag is drawn from
  `m g / k` to a separate okada scale, so 6.2 cm vs 7.8 cm sag differ visibly). A small **"model"** badge in a corner, always
  shown in this skin. No rider is needed.
- **Equilibrium line** (`eq: 1`): a dashed horizontal line through the loaded resting position of each load, with a short
  label "equilibrium" (≤ 18 chars) at the side away from the arrows.
- **Held displacement** (`x`, `x2`, metres, + = below equilibrium, − = above): the load sits at equilibrium + x, the spring
  stretched or relaxed to match. Animates smoothly between values (blend over 1.4 s).
- **Displacement bracket** (`xArrow: 1`): blue (`COLOR('x')`) double-headed bracket from the equilibrium line to the load's
  reference point, with `xLabel` (e.g. `'2.0 cm'`).
- **Restoring-force arrow** (`force: 1`): red (`COLOR('F')`), drawn on the load, **length ∝ |x| with one fixed scale per kit
  instance** (so 4.0 cm draws exactly twice 2.0 cm), **always pointing back towards the equilibrium line**, zero length (hidden)
  at x = 0. `forceLabel` string beside it (e.g. `'0.49 N'`). While oscillating, the arrow follows the live displacement
  (this is the core visual: longest at the ends, zero at the centre, flipping as the load crosses).
- **Acceleration arrow** (`accel: 1`): purple (`COLOR('a')`), same rule as the force arrow (∝ |x|, towards equilibrium),
  drawn offset to the other side of the load so the two never overlap. `accelLabel` string (e.g. `'2.45 m s⁻²'`).
- **Static balance** (`balance: 1`, only meaningful at x = 0, no oscillation): two equal arrows on the load, weight `mg`
  down (red, `COLOR('F')`) and spring pull up (green, `COLOR('k')`), labelled "mg" and "spring pull".
- **Oscillation** (`osc`, `osc2`: 0 held / 1 oscillating; `A`, `A2` amplitude in metres): the load moves as
  `x = A sin(2πt/T)` about equilibrium, with **T computed by the kit: `T = 2π√(m/k)`** for each spring from its own `m`.
  `slow` (default 1) is a slow-motion factor: the drawn period is `T × slow`, **the same factor for both springs**, so the
  ratio of the two periods stays true (0.50 s vs 0.56 s must visibly drift out of step; 1.0 cm vs 3.0 cm on the same load
  must stay exactly in step). When `slow > 1` a small "slow motion" tag shows.
- **Tags** (`tag`, `tag2`): a label above each spring (≤ 18 chars), e.g. `'200 kg (model)'`, `'A = 3.0 cm'`; `''` hides.
- **Period pills** (`periodLabel`, `periodLabel2`): small stopwatch pills under each load (gold, `COLOR('T')`),
  e.g. `'T = 0.568 s'`; `''` hides. Plan-supplied strings, so the plan's checks own the numbers.

## States it needs (scene `spring`)

| State | Meaning |
|---|---|
| `scene` | `'spring'` (other scenes may be appended by other lessons) |
| `skin` | `'lab'` (spiral spring, hanger, 50 g discs, pointer, metre rule) · `'okada'` (carrier + crates on a compression coil, "model" badge) |
| `n` | 1 or 2 springs side by side |
| `m`, `m2` | load in kg per spring (lab: 0–0.30, disc count from it; okada: 150–300) |
| `k`, `k2` | spring constant in N m⁻¹ (k2 defaults to k); used for the static stretch and the period |
| `g` | default 9.8 |
| `ruler` | 0/1 metre rule + pointer (lab skin) |
| `reading` | pointer label string (≤ 10 chars) |
| `eq` | 0/1 dashed equilibrium line(s) |
| `x`, `x2` | held displacement from equilibrium in metres (+ below) |
| `xArrow`, `xLabel` | 0/1 displacement bracket, its label |
| `force`, `forceLabel` | 0/1 restoring-force arrow ∝ x towards equilibrium, its label (spring 1; `force2`/`forceLabel2` for spring 2) |
| `accel`, `accelLabel` | 0/1 acceleration arrow ∝ x towards equilibrium, its label |
| `balance` | 0/1 weight vs spring-pull arrows at rest |
| `osc`, `osc2` | 0 held · 1 oscillating at the computed period |
| `A`, `A2` | amplitude in metres |
| `slow` | slow-motion factor (≥ 1), common to both springs |
| `tag`, `tag2` | label above each spring |
| `periodLabel`, `periodLabel2` | stopwatch pill under each load |
| `focus` | dashed pulsing ring: `'pointer'`, `'mass'`, `'mass2'`, `'eq'`, `'spring'` or `null` |

## Close-ups (camera `focus` regions)

`pointer` (pointer tip + the ruler around it) · `mass` (load 1 with its arrows and bracket, enough room above/below for ±4 cm
of travel) · `mass2` · `spring` (spring 1 coils) · `both` (both loads and their tags/pills) · `eq` (the equilibrium line
across the loads).

## Accuracy

- Hooke's law: extension ∝ load, `x₀ = mg/k`. Lab default `k = 24.5 N m⁻¹`: 0.050 → 2.0 cm, 0.100 → 4.0 cm,
  0.150 → 6.0 cm, 0.200 → 8.0 cm, 0.250 → 10.0 cm. Okada model `k = 3.16 × 10⁴ N m⁻¹`: 200 kg → 6.2 cm sag,
  250 kg → 7.8 cm sag.
- **x is measured from the loaded equilibrium position**, not the natural length; the restoring force is `−kx` about that line
  (weight already balanced by the static stretch). The force arrow is therefore zero at the equilibrium line, not at the
  spring's natural length.
- Force and acceleration arrows: linear in x, always towards equilibrium, never away; flip exactly as the load crosses the line.
- Period `T = 2π√(m/k)`, independent of amplitude: lab 0.200 kg → 0.568 s; okada 200 kg → 0.500 s, 250 kg → 0.559 s.
  Motion is sinusoidal (slowest at the ends, fastest through equilibrium); never constant speed.
- The okada skin is a **teaching model**, never a measured motorcycle: the "model" badge is always on in that skin.
- The spring's own mass is ignored (as in the lesson).

## Look like

Same look as `kits/video/circuit-network` and `galvanometer` (dark card, soft walls, palette). Colours from the plan's roles
when defined: `x` blue, `F` red, `a` purple, `m` orange, `k` green, `T` gold; same fallbacks. Labels ≤ 18 characters,
≥ 12 units, never on top of the moving load or its arrows (put labels on the side away from the arrows). With `n: 2` on a
270 px phone panel, each spring column should be at least 40 % of the panel width; keep the helix, discs and arrows big.

---

## Scenes `barton` and `ridge` (lesson-07)
**Appended 2026-11-11** by the lesson-07 video director (forced vibration, resonance, Barton's pendulums, the Ridge Road
verdict). Build before the lesson-07 plan is written.

Needed for: lesson-07 video, chapters 1, 3, 4, 5, 6 and 9 (three rides at 10 / 18 / 30 km/h, "pushes in step", Barton's
pendulums with driver 0.60 m then 0.45 m, the ridges as a driver `f = v/d`, crate lift-off at resonance, leaking vs healthy
damper, 200 vs 250 kg). The amplitude–speed resonance curve itself is drawn with the built-in `graph` kit, not here.
Reusable for: any forced-vibration / resonance video (swing pushed in step, marching soldiers, washing machine on spin,
keke on speed bumps, tuning), and any pendulum video (scene `barton` with one pendulum and `swing` is a plain pendulum).
Overlap note: the crate lift-off rule in `ridge` is the same physics as `reference-circle` scene `carrier`; reuse that code
(separation when the carrier's downward acceleration exceeds g, free flight under g, landing) rather than writing it twice.
`ridge` may also reuse this kit's `skin: 'okada'` coil/carrier/crate drawing.

### Must show: scene `barton`

- A **taut horizontal cord** between two posts/clamps near the top of the panel.
- A **heavy driver** pendulum (dark metal bob, visibly bigger) hanging from the cord at one end, length `driverL` (m).
- **Five light paper-cone pendulums** hanging from the same cord at lengths `cones` (default `[0.30, 0.45, 0.60, 0.75, 0.90]` m),
  drawn to one length scale so the longest fits (lengths visibly different; the cone equal to the driver is easy to pick out).
  Small length tags under each cone (`labels: 1`, e.g. "0.60 m").
- `swing: 1`: the driver swings at **its own period `T = 2π√(driverL/g)`** (shown in slow motion `slow`); every cone
  swings **at the driver's frequency** (steady state), with an amplitude **computed** from the driven-oscillator model
  `A_i ∝ 1/√((1 − r²)² + (2ζr)²)`, `r = f_driver/f_i`, `f_i = (1/2π)√(g/l_i)`, light damping (ζ about 0.05–0.08, a kit
  constant), normalised so the matched cone's swing is clearly the widest and the far ones are small. When `swing` turns on,
  cone amplitudes **build up from rest** over a few driver cycles (smooth envelope `1 − e^(−t/τ)`, τ ≈ 3 driver periods),
  so the student sees the matched cone grow while the others stay small.
- **Phase (accuracy detail, not narrated):** relative to the driver, cones shorter than the driver swing nearly in step,
  the matched cone lags by a quarter cycle, longer cones swing nearly opposite.
- Changing `driverL` (0.60 → 0.45) re-tunes the driver: its length animates over the blend, then the steady-state pattern
  moves so the newly matched cone becomes the widest (amplitudes blend over about 2 s, never jump).
- `match: 1`: soft highlight ring/glow on the cone whose length equals `driverL` (computed, within 0.005 m), none if no match.
- `readout: 1`: a small pill "T = …, f = …" from plan strings `readoutT`, `readoutF` (plan owns the numbers).

### Must show: scene `ridge`

- Side view of the **okada rear on Ridge Road**: laterite road (orange-brown) with low **concrete drainage ridges** at a
  fixed spacing (labelled `d = 2.5 m` when `labels: 1`), drawn to one horizontal scale; the road **scrolls** right-to-left
  at a rate ∝ `v` (km/h; 10, 16, 18, 30 must look clearly different).
- The rear end: wheel rolling over the ridges (it rises a little at each ridge: the base push), a **coil-over shock
  absorber** (coil outside a damper body), the **carrier** with **egg crates** on top (3 crates at 200 kg, 5 at 250 kg).
  A small "model" badge always on.
- **Bounce physics, computed by the kit** from `v`, `m`, `k` (default 31 600), `d` (2.5 m), `Y` (1.0 cm) and `damper`:
  driving `f = v/(3.6 d)`, `f₀ = (1/2π)√(k/m)`, `r = f/f₀`, steady-state amplitude
  `A = Y√(1 + (2ζr)²)/√((1 − r²)² + (2ζr)²)` with ζ = 0.05 (`leaking`) or 0.30 (`healthy`). The carrier moves at the
  **driving** frequency (shown in slow motion `slow`, the same factor for road and bounce so they stay in step), drawn
  exaggerated by a fixed visual scale (`ampScale`) but proportional: 10.0 cm must look about 7× the 1.4 cm ride.
- `build: 1`: the bounce **grows from rest** with envelope `1 − e^(−ζω₀t)` (for the leaking damper at resonance that is a
  visible pump-up over several bounces), so "higher and higher" is seen; `build: 0` shows the steady state at once.
- **Crate lift-off, computed:** the crate leaves the carrier when the carrier's downward acceleration exceeds g
  (threshold amplitude `g/ω²` with the driving `ω = 2πf`), flies under gravity, lands; at `v` 18 / 200 kg / leaking it lifts
  and shows a **crack** mark (egg yolk splash, small) after the first landing; at 10 and 30 km/h, or with `healthy`, it never
  lifts. 250 kg leaking: lifts at 16 km/h, not at 18.
- `trace: 1`: a strip chart under the bike: carrier displacement against time (scrolling), with a **tick at every ridge hit**
  on the time axis, so at 18 km/h the ticks line up with each bounce and the trace grows; at 30 km/h the ticks fall all over
  the cycle and the trace stays small.
- `gauge: 1`: a vertical amplitude gauge (cm) beside the carrier with a red dashed **lift-off line** at `g/ω²` (computed from
  the driving frequency) and a purple bar showing the current amplitude; `gaugeLabel` plan string (e.g. "10.0 cm").
- `readout: 1`: pills "v = 18 km/h" and "f = 2.0 Hz" from plan strings `readoutV`, `readoutF`.
- `damper`: `'leaking'` shows dark oil streaks on the damper body and, in a small cut-away window, a low oil level with the
  piston moving through air; `'healthy'` shows a full oil level and faint warm glow (heat) on each stroke.

### States it needs (scenes `barton`, `ridge`)

| State | Meaning |
|---|---|
| `scene` | adds `'barton'` · `'ridge'` |
| `driverL` | driver length, m (default 0.60) |
| `cones` | array of cone lengths, m (default `[0.30, 0.45, 0.60, 0.75, 0.90]`) |
| `swing` | 0 still · 1 swinging (builds up from rest when switched on) |
| `match` | 0/1 highlight the cone matched to the driver |
| `v` | ridge scene speed, km/h (5–35) |
| `m`, `k`, `d`, `Y` | sprung load kg (200 / 250), spring constant N m⁻¹ (31 600), ridge spacing m (2.5), base push cm (1.0) |
| `damper` | `'leaking'` (ζ 0.05) · `'healthy'` (ζ 0.30) |
| `build` | 0 steady state · 1 grow from rest |
| `trace` | 0/1 bounce strip chart with ridge-hit ticks |
| `gauge`, `gaugeLabel` | 0/1 amplitude gauge with lift-off line; its label |
| `readout`, `readoutV`, `readoutF`, `readoutT` | 0/1 pills and their plan strings |
| `labels` | 0/1 part labels (cord, driver, cone lengths; ridges, d = 2.5 m, shock absorber, carrier) |
| `slow` | slow-motion factor (≥ 1); same factor for road, bounce and pendulums |
| `focus` | dashed pulsing ring: `'driver'`, `'matched'`, `'crate'`, `'damper'`, `'ridges'`, `'trace'`, `'gauge'`, `'readout'` or `null` |

### Close-ups (camera `focus` regions)

`barton`: `driver` · `cones` (all five) · `matched` (the cone matched to the current `driverL`; region follows it) · `cord`.
`ridge`: `crate` (crate and carrier with room for the lift) · `damper` (shock absorber and cut-away) · `ridges` (two ridges
with the `d` label) · `trace` · `gauge` · `readout` · `rear` (wheel + shock + carrier).

### Accuracy (lesson-07 values, all recomputed)

- Barton: driver 0.60 m → `T = 2π√(0.60/9.8) = 1.555 s`, `f = 0.643 Hz`; 0.45 m → 1.346 s, 0.743 Hz. The matched cone
  swings widest, neighbours less, far ones least; all cones swing at the driver's frequency in steady state. Heavier cones
  (less relative damping) would give a sharper peak; the kit's ζ is a constant.
- Ridge, 200 kg (`f₀ = 2.00 Hz`), leaking: 10 km/h `f 1.11 Hz` A 1.44 cm · 14 → 2.49 · 16 → 4.40 · 18 (`f 2.00 Hz`) → 10.0 cm (10.05 with f₀ = 2.00)
  · 20 → 3.89 · 30 (`f 3.33 Hz`) → 0.57 cm. Healthy: peak 1.99 cm (≈ 16.7 km/h), never lifts off at any speed or load.
  250 kg (`f₀ = 1.79 Hz`), leaking: peak 10.03 cm at 16.1 km/h; 18 km/h → 3.68 cm.
- Lift-off line `g/ω²` (driving ω): 20.1 cm at 10 km/h, 7.85 at 16, 6.21 at 18, 2.23 at 30 km/h; it does not depend on the
  load. Lift-off bands (leaking): 200 kg about 17.0–19.3 km/h; 250 kg about 15.6–16.9 km/h.
- Time between ridges `d/v`: 0.50 s at 18 km/h (= `T₀`). Road scroll and bounce share one clock.
- Story numbers are a **teaching model**; the "model" badge is always on in `ridge`.

### Look like

Same look as the rest of this kit. Colours from the plan's roles when defined: `f` blue, `f0` gold, `v` orange, `d` green,
`A` purple (amplitude bar, bounce trace), `g` red (lift-off line); same fallbacks. Barton: cones light paper-cream, driver dark
metal; cord clearly taut. Labels ≤ 18 characters, never on top of a swinging cone, the moving crate or the trace.
On a 270 px phone panel the six pendulums must stay distinct (spread across the full width); in `ridge` keep the carrier and
crate big (at least a third of the panel width) and the trace strip at least 60 units tall.
