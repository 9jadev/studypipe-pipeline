# `dc-circuit-bench` (v2) — `window.DcCircuitBench`

Parametric 3D DC-electricity bench for SS2 Physics (Ohm's law, EMF and internal resistance, networks and cell arrays,
galvanometer conversion, metre bridge and potentiometer). Classic script, 100 % offline, three.js only (`kits/_vendor/three-bundle.min.js`).
Every reading comes from the physics model in `DcCircuitBench.model`; nothing is typed in.

The v1 part-builders are kept: `window.DCCircuitKit.createAccumulatorCell(THREE, opts)` and `createAnalogMeter(THREE, opts)`
(same names and return fields: `userData.rGlowMat`, `userData.pivot`, `userData.setFraction(f)`), now built from the v2 apparatus.

## Usage
```js
var kit = DcCircuitBench.create({ mode: "ohms-law", onEvent: function (name, detail) {} });
scene.add(kit);                       // THREE.Group; viewer on +z, y up; 1 unit = 15.6 cm (100 cm wire = 6.4 units)
// every frame:
kit.update(dt, t);
```
`create(opts)`: `mode` (`ohms-law` default · `internal-resistance` · `network-cells` · `galvanometer` · `bridge-potentiometer`; `"null"` = potentiometer),
`labels` (true), `onEvent`, plus any `setState` key.

## Methods on the group
| method | what it does |
|---|---|
| `update(dt, t)` (= `tick`, `userData.update`) | solves the model, swings needles (damped), animates key / wiper / jockey, moves current beads, error dynamics |
| `setState(obj)` (= `userData.setState`) | `mode`, `preset`, `labels`, `errors:{…}`, `reset:true` and every mode control below (keys go to the current mode; each mode remembers its own settings) |
| `reading()` | live model values for the current mode (fields below) + `rows`, `done`, `controls`, `errors`, `busy` |
| `takeReading()` | records a row for the results table (ohms-law closes the key briefly if it is open); galvanometer = `build()`; bridge/pot = `findBalance()` |
| `build()` | galvanometer: build & test the converted meter, records `R_s` / `R_m` |
| `findBalance()` | bridge / potentiometer: taps the jockey towards the null point (overshooting in shrinking steps), records the balance (needs the key closed) |
| `highlight(part)` / `clearHighlight()` | pulsing emissive highlight on a part (null clears). `DcCircuitBench.makeHighlighter(scene)` also exists |
| `viewFor(part)` | `{ target:[x,y,z], dist, pitch, yawPortrait:0 }` framed from the visible bounding box; `"all"` frames the whole mode (portrait: multiply `dist` by `max(1, 1.15/aspect)` as `demo.html` does) |
| `pickPart(raycaster)` | partId or `null` |
| `triangles()` | triangle count of what is visible |
| `reset()` | resets the current mode (defaults, rows, error dynamics) |
| `setMode(m)` `getMode()` `setKey(closed)` `setJockey(l)` | shortcuts |

## Model (the only source of numbers)
| quantity | rule |
|---|---|
| wire | `R = ρL/A`, `A = πd²/4`; copper 1.7e-8, constantan 4.9e-7, nichrome 1.1e-6 Ω m. **Default constantan, L = 40 cm, d = 0.30 mm → 2.77 Ω** |
| filament lamp (2.5 V 0.3 A) | `R² − R₀R − R₀kV² = 0` (R₀ = 1.0 Ω cold, k = 9.77): R rises with power, V–I bends towards the V axis; colour from `T = 293 + (R/R₀ − 1)/α_W` |
| Ohm's-law circuit | cell `E = 4.0 V`, `r = 0.1 Ω`, rheostat 0.5–30 Ω, solved exactly (bisection) incl. any voltmeter current |
| cell | `I = E/(R + r)`, `V = E − Ir`, lost volts `Ir`; key open → `V = E` |
| networks / cells | series `ΣR`, parallel `1/R = Σ1/R`, mixed `R₁ + R₂‖R₃`; n cells series `nE, nr`; parallel `E, r/n`; `P = I²R`, `η = R/(R + r)` |
| galvanometer | `R_s = I_g R_g/(I − I_g)`, `R_m = V/I_g − R_g`; coil current from the exact current divider; needle angle ∝ coil current |
| metre bridge | full nodal solution of the Wheatstone network (driver 2.0 V, 0.2 Ω; wire 2.0 Ω; G 50 Ω); balance `R/S = l/(100 − l)` |
| potentiometer | `k = E₀R_w/(R_w + R_ser + r₀)/100`; `I_G = (kl − E′)/(R_th + r′ + R_G)`; K2 shunts the test cell (`E′ = ER/(R + r)`) |

Reproduced exactly (script-checked): mystery battery `E = 12.0 V`, `r = 1.2 Ω`, `R = 2.8 Ω` → `I = 3.0 A`, `V = 8.4 V`, lost volts `3.6 V`;
potentiometer (24 V driver, `k = 0.150 V cm⁻¹`) balances it at **80.0 cm**, and at **56.0 cm** with K2 + 2.8 Ω (`r = 2.8 × 24/56 = 1.2 Ω`);
L01 table `(0.20, 0.55) (0.40, 1.11) (0.60, 1.66) (0.80, 2.22) (1.00, 2.77)`; L02 table `E = 6.0 V, r = 1.5 Ω` → `(0.50, 5.25) … (2.50, 2.25)` at `R = 10.5, 4.5, 2.5, 1.5, 0.9 Ω`;
L03 `E = 5.0 V, r = 0.5 Ω` single cell: `P = 6.94, 12.5, 11.1, 8.00, 4.94 W`, `η = 16.7, 50.0, 66.7, 80.0, 88.9 %` at `R = 0.1, 0.5, 1, 2, 4 Ω`;
L04 `I_g = 15 mA`, `R_g = 18 Ω`: 3.0 A → `R_s = 0.0905 Ω`; 40 V → `R_m = 2650 Ω` (3 s.f.); L05 bridge `R = 7.0 Ω` balances at `56.0 cm` → `5.50 Ω`;
school potentiometer (`k = 0.0200`) balances a 1.50 V cell at `75.0 cm`, `60.0 cm` with 3.0 Ω across it (`r = 0.75 Ω`).

## Modes, controls, parts, reading()
**`ohms-law`** — controls `comp` (`constantan|copper|nichrome|lamp`), `L` (20–100 cm), `d` (0.30 / 0.60 / 1.20 mm), `Rh` (0.5–30 Ω), `E`, `r`, `key`, `alpha` (override the temperature coefficient).
Parts `cell, key, ammeter, voltmeter, rheostat, wire, lamp, leads`. reading: `comp, material, L_cm, d_mm, rho, A_m2, R_wire, R_component, E, r, Rh, key, I, V, ratio (V/I), P, lampT, dT`.
Row `{ comp, L, d, Rh, I, V, ratio }` (2 d.p.). `done` after 5 readings on one component.

**`internal-resistance`** — `E`, `r`, `R` (0.5–30 Ω), `key` (default open: voltmeter reads E). Presets `keke` (12.0 V, 1.2 Ω, 2.8 Ω) and `lesson-cell` (6.0 V, 1.5 Ω).
Parts `cell, key, ammeter, voltmeter, rheostat, leads`. reading: `E, r, R, key, I, V, lost, r_apparent, P_load, P_lost`. Row `{ R, I, V, lost }` (open-circuit row `{ R:null, I:0, V, open:true }`). `done` after 5 different loads.

**`network-cells`** — `E`, `r` (preset `cell-5v`: 5.0 V, 0.5 Ω), `n` (3), `cells` (`single|series|parallel`, default `single` so the P–R / η–R tables reproduce), `net` (`load|series|parallel|mixed`), `R` (load), `R1 R2 R3` (2, 3, 6 Ω), `key`.
Parts `cellA, cellB, cellC, R1, R2, R3, ammeter, voltmeter, node, nodeB, key, leads`. reading: `E_t, r_t, R_eq, I, V, V_terminal, I1, I2, I3, P, P_total, P_lost, eta, eta_pct`.
Row `{ setup, cells, net, R_eq, I, P, eta(%) }`. `done` after a series and a parallel cell row and 4 different `R_eq`.

**`galvanometer`** — `Ig` (0.015 A), `Rg` (18 Ω), `conv` (`ammeter|voltmeter|bare`), `rangeA` (3 A), `rangeV` (40 V), `test` (line current / applied voltage; default 80 % of range).
Parts `coil, pointer, shunt, multiplier, terminals, scale, magnet, core, hairspring, source, rheostat, leads`. reading: `R_s, R_s_eff, R_m, R_m_used, R_total, R_meter, I_coil, I_shunt, fraction_coil, deflection, indicated, overload`.
Row `{ conv, Ig_mA, Rg, range, unit, R_s, R_m, R_meter (3 s.f.), test, indicated }`. `done` after one ammeter and one voltmeter build.

**`bridge-potentiometer`** — `sub` (`bridge|potentiometer`), `l` (jockey, cm), `key`; bridge: `Rx` (standard, left gap, 7.0 Ω), `Ru` (unknown, right gap, 5.5 Ω);
potentiometer: `driver` (`workshop` 24 V → k 0.150 | `school` 2 V → k 0.0200), `cell` (`battery` 12.0 V/1.2 Ω | `dry-cell` 1.50 V/0.75 Ω | `cell-2`), `E`/`r` override, `k2`, `Rshunt` (2.8 Ω).
Presets `keke-pot`, `school-pot`. Parts `slidewire, jockey, galvanometer, scale, key, leads` + bridge `leftgap, rightgap, standard, unknown, driver` / potentiometer `driver, testcell, standard (= shuntR), rheostat, key2`.
reading: bridge `Rx, Ru, l, I_G, l_balance, deduced_R, deduced_at_balance, balanced`; potentiometer `k, k_cal, V_wire, l, I_G, l_balance, deduced, V_AJ, E_effective, balanced`.
Rows `{ kind:"bridge", Rx, l, l_rest, R }` (l 1 d.p., R 2 d.p.) or `{ kind:"potentiometer", cell, k, k2, R, l, E_deduced }`. `done` after one bridge and one potentiometer balance.

## Error modes (`setState({ errors: { name: true } })`, each shifts readings the physically correct way)
| mode | error | effect |
|---|---|---|
| ohms-law | `contact` | 0.25 Ω loose contact inside the voltmeter span → V/I too high |
| | `voltmeter` | 50 Ω voltmeter draws current → ammeter high, V/I too low |
| | `warming` | key left closed: wire heats towards `P/(hπdL)` (h = 60 W m⁻² K⁻¹) and `R(1 + αΔT)` rises → V/I too high. Constantan's tiny α (1e-5 K⁻¹) hides it; use copper/nichrome or `alpha` to show it |
| internal-resistance | `voltmeter` | 50 Ω voltmeter: open-circuit "E" too low |
| | `warming` | heavily worked cell: r creeps up with I² (later, higher-current points sag; r too high) |
| | `contact` | 0.3 Ω at the cell's own terminals: counted as r → r too high |
| network-cells | `warming` · `ammeter` (0.1 Ω) · `contact` (0.5 Ω in the R₂ branch) | current and η too low · I and P slightly low · I₂ too low |
| galvanometer | `contact` (0.02 Ω with the shunt) · `warming` (shunt) · `forgotRg` (R_total used as R_m) | ammeter reads high · ammeter reads high · voltmeter reads low |
| bridge-potentiometer | `warming` (unknown coil +5 % while the key is closed) · `ends` (end corrections 2.0 / 1.0 cm) · `driverFall` (driver EMF sags up to 10 %) | deduced R too high · short balance length too low · balance longer, deduced E too high |

## Events (`onEvent(name, detail)`)
`mode {mode}` · `state {mode, controls}` · `key {closed}` · `reading` (detail = `reading()`) · `built` (row) · `search-start {from}` · `balance` (row) · `no-balance` · `overload {deflection}` · `done` (detail = `reading()`, once per mode) · `reset {mode}`.
Lesson glue: emit `lN:bench` on `reading` and `lN:bench-done` on `done`.

## Geometry & cost (triangles, measured with `triangles()` in `demo.html`)
| mode | triangles |
|---|---|
| ohms-law | ≈ 24 k |
| internal-resistance | ≈ 23 k |
| network-cells | ≈ 33 k |
| galvanometer | ≈ 23 k |
| bridge-potentiometer | ≈ 22 k (bridge) · ≈ 35 k (potentiometer) |

Apparatus (all exposed under `DcCircuitBench.builders`): analogue meters (extruded wedge case with sloping dial, `CanvasTexture` scale with mirror strip and auto ranges, damped needle on a pivot, glass, knurled red/black binding posts);
school lead-acid accumulator (glass tank showing brown PbO₂ and grey Pb grid plates in acid, ebonite lid, vent plug, cell strap); moulded 12 V / 24 V / 5 V block batteries (ribbed case, vent caps, tapered lead posts, label);
sliding rheostat (cast end stands, glazed former, 58-turn helical `TubeGeometry` coil, brass bar, slider with spring finger); plug key (ebonite base, brass blocks, lathe plug that lifts out);
test-wire board with a mm metre scale and sliding crocodile clip (wire colour and thickness follow material and d); filament lamp (lathe glass bulb, coiled filament glowing with temperature);
resistance box (mahogany, brass blocks, plugs, value plate); bobbin resistance coils; junction strips; metre-bridge board (100 cm wire over a mm scale, thick copper L-strips with two gaps, knife-edge jockey);
demonstration moving-coil galvanometer (extruded horseshoe magnet with concave pole pieces, soft-iron core, rectangular coil, spindle, hairspring, long pointer over a double arc scale — coil mA and converted range — copper shunt strap, multiplier bobbin).
Leads are `CatmullRomCurve3` + `TubeGeometry`, red for +, black for −; yellow beads show conventional current, speed ∝ branch current (so the coil branch of an ammeter barely moves while the shunt races).
Labels are short sprites above static housings (`labels:false` hides them); none sit over the needle, wiper, jockey or clip.
