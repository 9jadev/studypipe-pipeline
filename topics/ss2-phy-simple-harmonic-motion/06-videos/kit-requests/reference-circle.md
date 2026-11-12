# Kit request: reference-circle
**Status: REQUESTED 2026-11-11** (ss2-phy-simple-harmonic-motion, lesson-03 video). Build before the lesson-03 plan is written.
(02-lesson.md § 7 calls this gap "unit circle video kit"; the reusable id is `reference-circle`. It is separate from the
pendulum / mass–spring SHM kit that lessons 02 and 07 may request: this one is the circle-and-shadow picture of SHM, plus a
carrier-and-crate lift-off scene driven by the same circle. If the mass–spring kit is built first and already has a
loose-load lift-off state, scene `carrier` can reuse it instead.)

Needed for: lesson-03 video, chapters 1–6 and 8–10 (the mud lump's shadow, the reference circle, `x = A sin ωt`, where `v` and
`a` peak, the x/v/a time traces, the crate lift-off rule `ω²A ≥ g`).
Reusable for: any later SHM / circular-motion / waves video (phase, `x = A sin ωt`, projection of circular motion, AC sine
generation, unit-circle trig in maths: sin and cos as projections, radians).

## Must show

Four scenes, chosen with `scene`. Angles follow `x = A sin θ`, `θ = ωt`, timed from the centre: P starts on the radius
perpendicular to the projection axis, so the shadow starts at the middle moving in the + direction. Up (or right) is +.

**`wheel` (the story picture).** Side view of an okada rear wheel on its centre stand: tyre (dark, treaded), spokes, hub,
a bit of the swing-arm. A red-brown **mud lump** on the tyre goes round at a steady rate. **Sun overhead**: faint vertical
rays; a dashed drop line from the lump to the **ground line** under the wheel, where a dark **shadow** dot slides left and
right. Optional amplitude bracket on the ground under the wheel showing the shadow's path = one diameter, with "A" marking
half of it (radius = amplitude). The shadow must visibly slow at the ends and be fastest under the hub (it is a true
projection; never animate it at constant speed).

**`circle` (the abstract reference circle).** Circle of radius A, centre O, a vertical diameter (the projection axis, like
light from the side onto a wall). P on the circle, radius OP, angle arc `θ` from the horizontal radius, horizontal dashed
projection line P → N, shadow N on the vertical diameter. On N: displacement bracket `x` from O; velocity arrow `v` (vertical,
length ∝ `ωA cos θ`, flips sign); acceleration arrow `a` (vertical, always towards O, length ∝ `ω²|x|`, zero at O).
Optional `components`: 1 = P's velocity arrow (tangent, length ωA, constant) with its vertical component drawn on N (= v);
2 = P's centripetal acceleration arrow (towards O, length ω²A) with its vertical component on N (= a). Optional `pins`: small
dots at chosen angles (0°, 30°, 60°, 90°) on the circle, and the matching shadow positions on the diameter.
Readouts (optional): `x`, `v`, `a` computed from `A`, `omega`, `theta` with the plan's unit and 3 s.f.

**`traces` (three graphs in step).** A small reference circle on the left (same P/N as `circle`), and three stacked strips
on the right: `x`–`t` (sine), `v`–`t` (cosine, a quarter cycle ahead), `a`–`t` (x inverted), each over one or two cycles,
drawn progressively as P turns, with a **vertical cursor** through all three at the current t, joined by a faint horizontal
line from N to the x-strip. `show` picks which strips are drawn. Optional `gline`: a dashed horizontal line at `a = −g` on the
a-strip, in the plan's units (the a-strip's scale then comes from `omega`, `A` and `g`), so the student sees the a-trough dip
below −g when `ω²A > g`.

**`carrier` (the crate on the okada carrier).** Small reference circle on the left (vertical projection, P drives the
height), a horizontal dashed link from P to the **carrier** on the right: a rear rack/plate on a coil spring (the spring
compresses and stretches with the motion) with an **egg crate** sitting loosely on it. Arrows on the crate: weight `mg`
down (red, constant), the carrier's push `R` up (shrinks as the carrier accelerates downwards; never points down); arrow
`a` on the carrier (amber, towards the centre line, length ∝ `ω²|x|`); a short reference arrow `g`. Verdict tag:
"stays on" / "lifts off". `slow`: the playback slow-motion factor (the model bounce is 2.0 Hz, too fast to watch).

## States it needs

| State | Meaning |
|---|---|
| `scene` | `'wheel'` · `'circle'` · `'traces'` · `'carrier'` |
| `A`, `unit` | amplitude as a number and its unit (`'m'` or `'cm'`); drawing radius is fixed, labels use the number |
| `omega` | angular frequency, rad s⁻¹ (physics: v, a, lift-off, trace scales) |
| `spin` | 0 = hold at `theta` · 1 = P turns steadily (at `omega × slow`) |
| `theta` | angle in degrees when `spin: 0` (animates smoothly to the new angle, the short way forwards) |
| `slow` | slow-motion factor for `spin` (e.g. 0.25 for the 2.0 Hz okada; 1 for the 0.5 Hz lab wheel) |
| `labels` | 0/1: O, P, N, A, θ = ωt, wheel parts |
| `sun` | 0/1 (`wheel`): overhead rays and drop line |
| `bracket` | 0/1: amplitude bracket (path = diameter, A = radius) |
| `xbar`, `varrow`, `aarrow` | 0/1 each: displacement bracket, velocity arrow, acceleration arrow on the shadow |
| `components` | 0 none · 1 P's velocity + vertical component · 2 P's centripetal acceleration + vertical component |
| `pins` | array of angles in degrees, e.g. `[0, 30, 60, 90]`; `[]` hides |
| `readout` | 0/1: x, v, a values (3 s.f., with units) |
| `show` | `traces`: array from `['x', 'v', 'a']` |
| `cursor` | 0/1 (`traces`): vertical cursor through the strips |
| `g`, `gline` | g in m s⁻² (default 9.8); 0/1 dashed `−g` line on the a-strip |
| `forces` | 0/1 (`carrier`): weight and push arrows on the crate |
| `verdict` | 0/1 (`carrier`): "stays on" / "lifts off" tag, computed from `omega² A` vs `g` |
| `focus` | dashed pulsing ring on a named part (`'lump'`, `'shadow'`, `'centre'`, `'angle'`, `'crate'`, `'carrier'`) or `null` |

## Close-ups (camera `focus` regions)

`lump` · `shadow` (N and its arrows) · `centre` (O) · `angle` (θ arc) · `ground` (wheel scene: the shadow's path) ·
`traces-x` · `traces-v` · `traces-a` · `gline` (a-strip trough with the −g line) · `carrier` (rack at the top of its travel) ·
`crate` (crate and its force arrows).

## Accuracy

- The shadow is an exact projection: `x = A sin θ`, `v = ωA cos θ`, `a = −ω²x`. Lab defaults `A = 0.30 m`, `T = 2.0 s`
  (`ω = π`): at 0°, 30°, 60°, 90° → x = 0, 0.150, 0.260, 0.300 m; v = 0.942, 0.816, 0.471, 0 m s⁻¹; a = 0, −1.48, −2.56,
  −2.96 m s⁻². The `a` arrow always points at O; the `v` arrow is longest at O and zero at the ends.
- The x/v/a traces must be in true phase: v leads x by a quarter cycle, a is x inverted (half a cycle). Same time axis.
- **Lift-off must be computed, not scripted.** Okada model: `ω = 12.57 rad s⁻¹` (`ω² = 158 s⁻²`), `g = 9.8 m s⁻²`, threshold
  `A = g/ω² = 6.2 cm`. The crate stays on while the carrier's downward acceleration is ≤ g; it separates when `ω²x > g`, i.e.
  at height `x = g/ω²` in the upper part of the travel (at the very top only at the threshold amplitude), then flies freely
  under gravity alone (initial upward speed `ω√(A² − x²)`) and lands back on the carrier where the paths meet again. At
  `A = 3 cm` (a_max 4.7 m s⁻²) the crate never leaves; at `A = 8 cm` (a_max 12.6 m s⁻²) it visibly leaves near the top.
  The push arrow `R = m(g + a_carrier)` shrinks to zero at separation and never points down.
- The carrier/crate is a **teaching model** (story numbers, not measurements); a small "model" tag in a corner is welcome.
- `traces` with `gline`: the a-strip trough is `−ω²A`; the `−g` line sits at `−g` on the same scale.

## Look like

Same look as `kits/video/circuit-network` and `galvanometer` (dark card, soft walls, palette). Colours from the plan's roles
when defined: `x` green, `v` sky, `a` amber, `g` red (weight arrow and g line), `omega` purple (angle arc); fallbacks the
same. Labels ≤ 18 characters, never on top of the moving lump, shadow or crate. On a 270 px phone panel the circle should
fill at least half the panel width in `circle`, and the traces must stay readable (strips at least 70 units tall each).
The `carrier` scene's rack, coil and egg crates should match the `skin: 'okada'` look in the sibling request
`shm-oscillator.md` (lesson-02), which leaves lift-off to this kit; build the two together or share the drawing code.
