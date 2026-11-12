# `dc-concept-zoom` (`window.DcConceptZoom`, v1)

Five 3D concept close-ups for current electricity (SS2 *Ohm's Law & Current Electricity*), one per lesson zoom:
`lattice` (L01) · `cell` (L02) · `node` (L03) · `coil` (L04) · `ramp` (L05).
Classic script, fully offline, no `fetch`, no modules, no external textures. Needs `window.THREE` (r160 bundle); `SceneKit` optional.

```html
<script src="three.min.js"></script><script src="scene-kit.js"></script><script src="dc-concept-zoom.js"></script>
```
Lessons copy `kits/dc-concept-zoom/dc-concept-zoom.js` to `html/assets/js/dc-concept-zoom.js`.

## Mount (zoom.js)
```js
var z = DcConceptZoom.create({ mode: "lattice", labels: window.innerWidth >= 560, onEvent: function (name, d) {} });
stage.rig.add(z);                                  // SceneKit stage
// stage onFrame:  z.update(dt, t)
Object.keys(z.parts).forEach(function (id) { stage.addPart(id, z.parts[id], id); });   // re-run after setMode()
var v = z.viewFor("all");                          // { target:[x,y,z], dist, pitch } (world coords, includes g.position/scale)
document.dispatchEvent(new CustomEvent("l01:zoom", { detail: { mode: "lattice" } }));
```
`g.parts` belongs to the **current mode** (re-read it after `setMode`). Each mode is built lazily the first time it is shown.

## Methods on the group
`setMode(mode)` · `setState(obj)` (returns `reading()`) · `reading()` · `reset()` (mode defaults) · `update(dt, t)` (= `tick`) ·
`findBalance()` (ramp: slides the jockey to the null point at 30 cm s⁻¹, emits `balance`; `false` if beyond 100 cm) ·
`highlight(part)` (pulsing glow, `null` clears) · `viewFor(part)` · `pickPart(raycaster)` → partId | `null` · `triangles()` ·
`params()` (live params of the current mode) · `on(event, fn)` · `modes`.
`setState` keys: `mode`, `labels` (bool), `speed` (0–4 animation rate), `onEvent`, `reset`, `params: { <mode>: {...} }`, or any
parameter of the current mode as a flat key (`z.setState({ T_C: 200 })`). `DcConceptZoom.makeHighlighter(scene)` also exists.

## Modes, parameters (defaults), `reading()`
Every number comes from `DcConceptZoom.model` (`solveLattice / solveCell / solveNode / solveCoil / solveRamp`, pure functions).

### `lattice` — `{ d_mm: 0.30, T_C: 20, I_A: 1.0, alpha: 3.9e-3 }`
Cut-away copper wire (PVC sleeve stripped back at the ends, half-section so the inside shows). Positive ions (+ marked) on a
body-centred lattice vibrate; free electrons move randomly, **drift towards the + end (against the conventional current arrow)** and
collide with the nearest ion (flash + ion kick). Copper: ρ₂₀ = 1.7 × 10⁻⁸ Ω m, α = 3.9 × 10⁻³ K⁻¹, n = 8.5 × 10²⁸ m⁻³.
- drift `v = I/(nAe)`: 0.30 mm → **1.04 mm s⁻¹**, 1.20 mm → 0.065 mm s⁻¹ (same current squeezes through 16× less area).
- collisions per electron per second `= n e² ρ(T)/m` (Drude): 4.1 × 10¹³ s⁻¹ at 20 °C, 6.9 × 10¹³ s⁻¹ at 200 °C.
- `R_rel` = (ρ(T)/A) ÷ (0.30 mm wire at 20 °C) ∝ (1 + αΔT)/d²: 1.20 mm → 0.0625; 0.30 mm at 200 °C → 1.70.

`reading()`: `{ mode, d_mm, T_C, I_A, drift_mm_s, collisions_per_s, rho, R_per_m, R_rel, heat_W_per_m, n_per_m3 }`.
Visuals: electron count ∝ cross-section (density n is a constant); on-screen drift ∝ √v (so the thick wire still visibly moves);
collision rate ∝ ρ(T); ion amplitude grows with T (physically ∝ √T, exaggerated so 20 → 200 °C shows); a faint warm tint only (no glow — copper does not glow at 200 °C).
Parts: `wire, insulation, ions, electrons, current` (conventional current arrow →), `drift` (electron drift arrow ←).

### `cell` — `{ E: 12.0, r: 1.2, R: 2.8, closed: true }`
Lead-acid battery cut-away: translucent case with `round(E/2)` compartments **in series** (inter-cell straps through each partition),
alternating PbO₂ (+, brown) and Pb (−, grey) cast-grid plates, separators, electrolyte; on discharge H⁺ ions move to the PbO₂ plates and sulphate
ions to the Pb plates (speed ∝ I); heat flashes inside ∝ I²r. External wire-wound load R and a hinged key; charge beads flow + → load → − (∝ I).
Energy-per-coulomb bar: the blue arrow is the chemistry lifting each coulomb to E; the column splits into **V = IR** (green) + **Ir** (red).
- open key: `I = 0`, `V = E`, lost 0 · closed: `I = E/(R + r)`, `V = E − Ir`.
- defaults (Emeka): I 3.0 A, V 8.4 V, Ir 3.6 V · L02 bench `{E: 6.0, r: 1.5, R: 10.5}`: I 0.50 A, V 5.25 V.

`reading()`: `{ mode, E, r, R, closed, I, V, lost, V_check (=IR), P_total, P_ext, P_int, eta, nCells }`.
Parts: `case, posPlate, negPlate, electrolyte, ions, plus, minus, load, key, charges, bar`.

### `node` — `{ E: 5.0, r: 0.5, R1: 6.0, R2: 12.0, Rs: 0 }`
A small battery (E, r), optional series `Rs`, then R₁ ∥ R₂ between brass junctions A and B. Charge beads ride inside glass guide tubes on a copper core;
at A each bead is sent down a branch by error diffusion so the long-run split is exactly **I₁ : I₂ = R₂ : R₁**; all rejoin at B.
Live label at A: `in N = n₁ + n₂` (always equal). Wire-wound resistors: more turns = more ohms. Power bar: **EI = I₁²R₁ + I₂²R₂ (+ I²Rs) + I²r**.
- defaults: I 1.111 A, I₁ 0.741 A, I₂ 0.370 A, EI 5.56 W · WE1 `{E: 14, r: 1, R1: 6, R2: 12, Rs: 3}`: I 1.75 A, I(6 Ω) 1.167 A.

`reading()`: `{ mode, E, r, R1, R2, Rs, R_par, R_ext, I, I1, I2, V_term, V_par, P_total, P1, P2, Ps, P_int, eta, beads_in, beads_1, beads_2 }`.
Parts: `cell, Rs (if > 0), R1, R2, nodeA, nodeB, node (= nodeA), tubes, beads, bar`.

### `coil` — `{ I_g: 0.015, R_g: 18.0, conversion: "ammeter", target: 3.0, input: 1.0, value: null }`
Moving-coil galvanometer: horseshoe magnet (N red, S blue) with concave soft-iron pole shoes, fixed soft-iron core (radial field lines in the gap),
rectangular copper coil on an aluminium former, spindle in jewelled pivots, two flat spiral hairsprings (wind up as the coil turns),
counter-weighted pointer over an arc scale with anti-parallax mirror (graduations redrawn per conversion: 0–3 A, 0–40 V, 0–15 mA).
Deflection ∝ coil current (torque BANI balanced by the hairspring cθ); pointer motion is damped (eddy currents in the former).
`conversion`: `"ammeter"` shows the thick copper shunt bar in parallel (≈ 199 of every 200 beads take it); `"voltmeter"` shows the wound
multiplier bobbin in series; `"none"` = bare galvanometer. `input` = fraction of full scale applied; or `value` = applied A (ammeter/none) or V (voltmeter).
- 3.0 A: **R_s = I_g R_g/(I − I_g) = 0.0905 Ω**, coil 15 mA, shunt 2.985 A · 40 V: **R_m = V/I_g − R_g = 2 649 Ω (≈ 2 650)**, R_total 2 667 Ω.

`reading()`: `{ mode, conversion, I_g, R_g, target, unit, full_scale, R_s, R_m, R_m_3sf, R_total, applied, I_in, I_coil_mA, I_shunt, V_coil, shunt_pct, frac, theta_deg, torque_rel, scale_reading, over_range, pointer_deg }`.
Parts: `magnet, north, south, poles, core, field, coil, former, spindle, pointer, hairspring, scale, shunt, multiplier, terminals, base, beads`.

### `ramp` — `{ k: 0.0200, E_cell: 1.50, l: 50.0, r_cell: 1.0, R_g: 20.0, I_fs_mA: 10 }`
Potentiometer on a wooden board: 100 cm constantan wire between thick brass strips, metre rule (mm graduations), knife-edge jockey, driver accumulator,
test source (dry cell ≤ 2.2 V, else a lead-acid battery of round(E/2) cells), centre-zero galvanometer. Above the wire a translucent **ramp**:
height = potential, falling uniformly from A to B. Green bar at A = the test EMF E (down to the dashed **EMF level** line); orange bar at J = **V_AJ = k l**;
red bar = the gap **E − k l** (gone at the null point, where a green ring shows). Needle ∝ I = (E − k l)/(r + R_g), saturating at ±`I_fs_mA`;
beads on the jockey lead flow one way or the other, and stop at null. Small bar beside the test source: **V_terminal + Ir = E** (Ir → 0 at null, so a null method reads the true EMF).
- L05: k 0.0200 V cm⁻¹, 1.50 V → balance **75.0 cm** · story: k 0.150 V cm⁻¹, 12.0 V → **80.0 cm**.

`reading()`: `{ mode, k, E_cell, l, V_l, diff, I_g_mA, l_balance (null if > 100 cm), reachable, balanced (|l − l_bal| ≤ 0.05 cm), V_wire, V_terminal, lost, seeking }`.
Parts: `wire, jockey, ramp, emf, kl, gap, galvanometer, needle, cell, cellBar, driver, leads, scale, strips, board, beads`.

## Events (`onEvent(name, detail)` or `g.on(name, fn)`)
`mode {mode}` · `state` (detail = `reading()`, after a parameter change) · `balance` (ramp, detail = `reading()`) · `reset {mode}`.
Lesson glue: emit `l0X:zoom` `{ mode }` from `zoom.js`.

## Labels
Short sprites (≤ 20 characters), placed on fixed ground beside moving parts (never on beads/electrons/pointer). Hide them on phones
(`labels: false` below 560 px) and show the same numbers in the HTML `.counters`.

## Size (phone)
Triangles (visible mode): lattice 5.5 k (0.30 mm) – 25 k (1.20 mm, instanced ions); cell 15 k (3 cells) – 21 k (6 cells); node 19 – 23 k;
coil 12.6 – 14.3 k; ramp 10.8 – 14.2 k. One mode is visible at a time; canvas textures ≤ 2048 × 96. Script ≈ 94 KB unminified.
