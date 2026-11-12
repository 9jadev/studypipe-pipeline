# Video kit · reference-circle

SHM as the shadow of steady circular motion. Four scenes (`scene`, cross-fades), all driven by **one angle θ**, so every
scene agrees with every other: `x = A sin θ`, `v = ωA cos θ`, `a = −ω²x`, timed from the centre (P starts level with O, so the
shadow starts at the middle moving in the + direction; up or right is +).

- **wheel**: okada rear wheel on its centre stand (treaded tyre, rim, 12 spokes, hub, swing-arm, stand, laterite ground).
  A red-brown mud lump goes round clockwise; with `sun: 1` the sun, faint vertical rays and a dashed drop line put its dark
  shadow on the ground. The shadow is a true projection (slow at the ends, fastest under the hub). `bracket: 1`: ground
  bracket "path = 2A" plus a half bracket "A" and the radius drawn on the wheel.
- **circle**: reference circle (radius fixed at 125 units), centre O, vertical diameter = projection axis, P, radius OP, θ arc
  from the horizontal radius (purple), dashed projection P → N. On N: `xbar` (green bracket O → N, left), `varrow` (sky, right
  of the axis, length ∝ cos θ, flips), `aarrow` (amber, left of the axis, always towards O, ∝ |x|, zero at O). `components: 1`
  P's tangent velocity ωA (constant length) with its dashed vertical component; `components: 2` P's centripetal ω²A towards O
  with its vertical component; both equal the arrow on N. `pins`: dots on the circle at the given angles, shadow ticks on the
  diameter, angle labels. `readout`: x, v, a computed from A, ω, θ in the plan unit (3 s.f., e.g. `v = 0.816 m/s`).
- **traces**: small reference circle (same P / N / arrows) beside three strips on one time axis (two cycles): x–t sine, v–t
  cosine (¼ cycle ahead), a–t = x inverted. Live trace up to the cursor, last sweep faint ahead of it. `cursor` draws the
  vertical cursor and the faint line from N to the x-strip. `gline: 1` draws a dashed red −g line on the a-strip; the a-strip
  scale then comes from ω²A and g, so the trough visibly dips below −g when ω²A > g (and sits above it when ω²A < g).
- **carrier**: small reference circle on the left (radius = A at 12 px per cm, capped at 96) linked to the okada carrier plate
  on a coil spring (pitch stretches evenly), egg crate sitting loosely on top. **Lift-off is computed**: the crate leaves where
  the carrier's downward acceleration ω²x first exceeds g (x = g/ω², on the way up), flies under gravity alone from speed
  ω√(A² − x²), and lands where the paths meet again (okada, A = 8 cm: leaves at θ ≈ 51°, apex 8.26 cm, max gap ≈ 1.9 cm, lands
  at θ ≈ 213°; A = 3 cm never leaves). `forces`: weight mg (red, constant), push R = m(g + a_carrier) (blue, shrinks as the
  carrier accelerates down, 0 in flight, never down), carrier acceleration a (amber, towards the centre line), reference g
  arrow (32 units ≡ g for all four). `verdict`: "stays on" / "lifts off" with `ω²A = 4.74 < 9.8`. A "model" tag is always on.

## States (`{ panel: 'reference-circle', s: { … } }`)

| State | Scene | Meaning |
|---|---|---|
| `scene` | all | `'wheel'` · `'circle'` · `'traces'` · `'carrier'` |
| `A`, `unit` | all | amplitude number and `'m'` / `'cm'` (default 0.30 m). Drawing radius fixed except in `carrier` |
| `omega` | all | ω in rad/s (default π): spin rate, v, a, lift-off, trace scales |
| `spin` | all | 0 hold at `theta` · 1 P turns steadily at `omega × slow` rad per video second |
| `theta` | all | degrees when `spin: 0`; eases over 1.4 s the short way (exactly 180° goes forwards) |
| `slow` | all | slow-motion factor (default 1; 0.25 for the 2.0 Hz okada) |
| `labels` | all | 0/1: O, P, N, A, θ = ωt · mud lump, tyre, hub, swing-arm, stand, sun, shadow · carrier, spring, egg crate, centre |
| `sun` | wheel | 0/1 sun, rays, drop line |
| `bracket` | wheel, circle | 0/1 amplitude bracket (path = 2A, A = radius) |
| `xbar`, `varrow`, `aarrow` | circle, traces | 0/1 each: x bracket, v arrow, a arrow on N |
| `components` | circle | 0 · 1 (ωA tangent + vertical part) · 2 (ω²A centripetal + vertical part) |
| `pins` | circle | array of degrees, e.g. `[0, 30, 60, 90]`; `[]` hides |
| `readout` | circle | 0/1 x, v, a values (3 s.f., plan unit; bottom-left corner) |
| `show` | traces | array from `['x', 'v', 'a']` (default all three) |
| `cursor` | traces | 0/1 cursor + N-to-strip line |
| `g`, `gline` | traces, carrier | g in m/s² (default 9.8) · 0/1 dashed −g line |
| `forces` | carrier | 0/1 mg, R, a, g arrows |
| `verdict` | carrier | 0/1 stays on / lifts off tag (from the target ω and A) |
| `focus` | all | ring on `'lump'` (lump / P) · `'shadow'` (shadow / N) · `'centre'` · `'angle'` · `'crate'` · `'carrier'` · `null`; the ring follows the moving part |

## Camera close-ups (`{ camera, focus: '…' }`)

`lump` (wheel / circle: the whole circle) · `shadow` (the vertical diameter with N and its arrows) · `centre` · `angle` ·
`ground` (wheel: shadow path and bracket) · `traces-x` · `traces-v` · `traces-a` · `gline` (a-strip trough and −g line) ·
`carrier` (rack at the top of its travel, with the verdict) · `crate` (crate, its arrows and the verdict).
Note: `shadow` and `angle` crop the circle-scene readouts (bottom-left); use `wide` while `readout: 1` must be read.

## Good for

SHM as the projection of uniform circular motion, x = A sin ωt timed from the centre, where v and a peak, phase of x / v / a
graphs, lift-off of a loose load (ω²A ≥ g: carriers, sieves, vibrating tables), radians vs degrees; later: phase difference,
AC sine generation, unit-circle sin / cos as projections in maths.

## Used in

- `ss2-phy-simple-harmonic-motion` lesson-03 video (planned)
- Demo: `kits/video/reference-circle/demo.plan.cjs` (every scene, state and close-up; QA clean on 360×740, 740×360, 1152×700)
