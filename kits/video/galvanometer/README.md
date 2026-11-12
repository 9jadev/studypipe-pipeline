# Video kit · galvanometer

A moving-coil galvanometer and how it becomes an ammeter or a voltmeter. Three scenes in one kit (`scene`, cross-fades), drawn
in the same style as the built-in `circuit` kit (cream meter faces, red needle, brass terminals, charge dots):

- **dial**: big meter face with a **linear** arc scale (ticks and numbers computed from `scaleMax` + `unit` with a tidy step:
  15 → 0 5 10 15, 3 → 0 1 2 3, 40 → 0 10 20 30 40, 2.4 → 0 1 2 + end 2.4). Pointer follows `defl`; `defl > 1` pins it against
  the end stop (8 % past full scale) where it jitters. `inside: 1` opens a cut-away: curved N and S pole pieces on a yoke,
  soft-iron cylinder, **radial** field lines (N → cylinder → S), the coil seen end-on (rotates with the pointer) and a hairspring
  that winds up as the pointer turns. Terminals `+` (red) and `−` (black) on the base.
- **convert**: dashed meter box, terminals left (in) and right (out), the galvanometer G (same live pointer and scale).
  `bare` (G alone) · `ammeter` (short, thick copper shunt on a **parallel** branch; line stream splits at the left junction into
  a thin sparse gold coil stream and a wide dense sky shunt stream, ≈ 1 : 15) · `voltmeter` (long, big multiplier bobbin in
  **series**; one gold stream through both). Mistakes: `wrong: 'shunt-series'` (all current through the coil, dense stream) and
  `wrong: 'multiplier-parallel'` (coil still across the full p.d.), each with a red ✗.
- **test**: battery (`+` on top, optional internal resistor `r`) and starter load in a loop; dots leave `+`, run clockwise and
  return to `−` at a speed ∝ `I / imax`. Ammeter **in series** in the top wire; voltmeter **in parallel across the battery**
  with a sparse gold trickle through its leads.

The kit computes no physics: every number is a string or fraction from the plan (so it cannot disagree with the board).

## States (`{ panel: 'galvanometer', s: { … } }`)

| State | Scene | Meaning |
|---|---|---|
| `scene` | all | `'dial'` · `'convert'` · `'test'` |
| `labels` | all | 0/1 part labels: magnet N / magnet S / coil / soft iron / hairspring (dial, with `inside`); coil / shunt / multiplier (convert); battery / starter load (test) |
| `focus` | all | dashed pulsing ring on a close-up name below, or `null` |
| `inside` | dial | 0/1 cut-away of the internals |
| `defl` | dial, convert | pointer, fraction of full scale (animates; > 1 pins and jitters at the stop) |
| `scaleMax`, `unit` | dial, convert | scale end and unit, e.g. `15, 'mA'` · `3, 'A'` · `40, 'V'` (a change fades the old numbers out, the new in) |
| `burn` | dial, convert | 0/1 coil glows orange-red, smoke, `burnt out!` |
| `rg` | dial, convert | coil-resistance tag (pink role `Rg`), e.g. `'R_g = 18 Ω'` |
| `mode` | convert | `'bare'` · `'ammeter'` · `'voltmeter'` |
| `rs`, `rm` | convert | shunt tag (green `Rs`) · multiplier tag (orange `Rm`) |
| `flow`, `speed` | convert | 0/1 charge dots, left → right · speed 0–1 (default 0.6, animates) |
| `split` | convert | 0/1 current labels |
| `iLine`, `iCoil`, `iShunt` | convert | current strings (sky `I`, gold `Ig`, sky `I`) |
| `pd` | convert | 0/1 p.d. brackets: ammeter one bracket over the parallel pair (`vCoil`, plus a `same p.d.` note unless `vCoil` already says it); voltmeter `vCoil` over the coil, `vOther` over the multiplier, `vTotal` under the box |
| `vCoil`, `vOther`, `vTotal` | convert | p.d. strings |
| `box`, `total` | convert | 0/1 highlight the finished meter, letter A / V in the corner · total-resistance string |
| `wrong` | convert | `null` · `'shunt-series'` · `'multiplier-parallel'` |
| `bat`, `r`, `R` | test | battery label · internal-resistance tag (`''` hides the internal resistor) · load label |
| `I`, `imax` | test | loop current (animates) · current for full dot speed (default 3) |
| `ammeter`, `aMax`, `aDefl`, `aRead`, `aR` | test | ammeter on/off · scale end (A) · pointer 0–1 · reading · resistance |
| `voltmeter`, `vMax`, `vDefl`, `vRead`, `vR` | test | voltmeter on/off · scale end (V) · pointer 0–1 · reading · resistance |
| `verdict` | test | `null` · `'ok'` (green ✓ by the ammeter) · `'bad'` (red ✗) |

Role colours follow the plan's `meta.roles` when defined: `I` (sky), `Ig` (gold), `Rg` (pink), `Rs` (green), `Rm` (orange),
`R` (load, orange), `V` (p.d. / voltmeter, blue); the fallbacks are the ones in brackets.

## Camera close-ups (`{ camera, focus: '…' }`)

`dial` `scale` `coil` (dial) · `G` `junction` `shunt` `multiplier` `pd` `box` (convert; `shunt` frames the ammeter-mode shunt,
`multiplier` the voltmeter-mode one) · `ammeter` `voltmeter` `battery` `load` (test)

## Good for

What is inside a moving-coil meter (radial field, hairspring, linear scale), why a bare galvanometer burns out, shunts
(R_s = I_g R_g / (I − I_g)) and multipliers (R_m = V / I_g − R_g), rescaling the dial, where ammeters and voltmeters go, meter
loading (an 18 Ω "ammeter" in the loop), the swapped-places mistakes; later: dual-range meters, motor effect in a meter.

## Used in

- `ss2-phy-ohms-law-circuits` lesson-04 video (planned)
- Demo: `kits/video/galvanometer/demo.plan.cjs` (every scene, state and close-up; QA clean on 360×740, 740×360, 1152×700)
