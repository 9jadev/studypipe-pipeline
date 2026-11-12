# Kit request: galvanometer
**Status: REQUESTED 2026-11-08** (ss2-phy-ohms-law-circuits, lesson-04 video). Build before the lesson-04 plan is written.

Needed for: lesson-04 video, chapters 1–8 (what is inside a moving-coil galvanometer; why 3.0 A or 40 V burns it out; a shunt in
parallel splitting the line current I into I_g through the coil and I − I_g through the shunt; a multiplier in series sharing the
p.d. with the coil at one common current I_g; the dial rescaled to 0–3 A and 0–40 V; the two finished meters tested on Emeka's
battery, ammeter in series and voltmeter in parallel; the classic "swapped places" mistake).
Reusable for: every later meter-conversion video (dual-range meters, ohmmeter idea, meter loading, JAMB shunt/multiplier items),
the electromagnetism topic (motor effect in a moving-coil meter, radial field, hairspring), and any "where does the meter go" clip.

Why not extend `circuit`: the built-in `circuit` kit has a fixed topology (voltmeter across the battery, ammeter in series), no
galvanometer internals, no branch currents and a voltmeter scale that only ticks 5 or 15 V. A separate kit is cleaner than bending it.

## Must show

Three scenes, picked with `scene`. One drawing language (dark card, soft walls, the palette), so cuts between scenes feel like one bench.

### `scene: 'dial'` — the moving-coil galvanometer, big
- Front face: an arc scale (about 100°), a thin pointer pivoting from the bottom centre, two terminals (`+` red, `−` black) on the base.
- Scale ticks and numbers **computed by the kit from `scaleMax` and `unit`** with a tidy step: 15 mA → 0 5 10 15; 3 A → 0 1 2 3;
  40 V → 0 10 20 30 40; 2.4 A → 0 0.8 1.6 2.4 is acceptable (or 0 1 2 with the end marked 2.4); unit written under the arc (`mA`, `A`, `V`).
- Pointer angle from `defl` (0 = zero mark, 1 = full scale). `defl > 1` drives the pointer to the end stop (about 8 % past full
  scale) where it **jitters against the stop** (pure function of t).
- `inside: 1`: the lower half of the face becomes a cut-away showing the curved **N** and **S** poles of a permanent magnet, the
  soft-iron cylinder, the rectangular **coil** of fine copper wire on its pivot (it rotates with the pointer), a coiled **hairspring**,
  and faint **radial field lines** between pole and cylinder. Labels (with `labels: 1`): `magnet N`, `magnet S`, `coil`, `hairspring`,
  `soft iron`.
- `burn: 1`: the coil glows orange-red, two or three smoke wisps rise from it, and a small `burnt out!` tag appears (red). Works in
  `dial` and `convert`.
- Optional tag `rg` under the meter, e.g. `R_g = 18 Ω` (pink role colour).

### `scene: 'convert'` — the conversion schematic
- A dashed rounded **meter box** with a terminal on each side (left in, right out). Inside it the galvanometer drawn as a small dial
  (circle with the same live pointer and the scale from `scaleMax` / `unit`, so relabelling the scale shows the converted range)
  with its coil resistance tag (`rg`).
- `mode: 'bare'`: only the galvanometer between the terminals; the line current runs straight through it.
- `mode: 'ammeter'`: a **short, thick shunt** (copper-coloured strip, green role) on a parallel branch beneath the galvanometer, joining
  the main line at a left and right **junction** (dots). Tag `rs` beside it.
- `mode: 'voltmeter'`: a **long, tall multiplier** resistor (zig-zag or bobbin, orange role) in series with the galvanometer inside the
  box. Tag `rm` beside it.
- `flow: 1`: charge dots move along the wires, left to right, at a speed scaled by the plan's `speed` (0–1, default 0.6).
  In `ammeter` mode the stream **splits at the left junction**: the coil branch carries a **thin, sparse** stream (gold, I_g) and the
  shunt branch a **wide, dense** stream (sky, I − I_g); they rejoin at the right junction. The visual share is fixed (coil ≈ 1 dot
  for every 12–15 in the shunt, never zero) and does not need to be to scale; the plan's labels carry the numbers.
  In `voltmeter` and `bare` mode one stream of equal density passes through everything (gold).
- `split: 1`: current labels — `iLine` on the incoming wire (sky), `iCoil` on the coil branch (gold), `iShunt` on the shunt branch (sky)
  — each a short string from the plan.
- `pd: 1`: p.d. brackets. Ammeter: **one** bracket spanning the parallel pair with `vCoil` (both branches share it; a small `same p.d.`
  note). Voltmeter: two brackets side by side, `vCoil` over the coil and `vOther` over the multiplier, and an overall bracket under
  the box with `vTotal`.
- `box: 1`: the dashed meter box brightens and shows its **total resistance** tag `total` (e.g. `meter = 0.0900 Ω`) and a big
  meter letter in a circle at the top-right corner: `A` in ammeter mode, `V` in voltmeter mode.
- `wrong`: `null` (default) · `'shunt-series'` the small shunt drawn **in series** with the coil (no parallel branch; all the
  current goes through the coil) · `'multiplier-parallel'` the big resistor drawn **across** the coil (the coil still gets the full
  p.d.). A red `✗` by the misplaced resistor. Combine with `burn: 1`.

### `scene: 'test'` — the finished meters on Emeka's battery
- A simple loop: a **battery** (left, label `bat`, e.g. `12.0 V`, with an optional small internal-resistor tag `r`, e.g. `r = 1.2 Ω`),
  a **starter load** resistor (right, label `R`, e.g. `2.8 Ω`), wires top and bottom; charge dots flow with speed ∝ `I` / `imax`.
- `ammeter: 1`: a circle-`A` meter inserted **in series** in the top wire, with its small dial (scale `aMax` A, pointer `aDefl` 0–1),
  a reading tag `aRead` (string) and a resistance tag `aR` (string, e.g. `0.0900 Ω` or `18 Ω`). With `ammeter: 0` the top wire is plain.
- `voltmeter: 1`: a circle-`V` meter connected **in parallel across the battery terminals** (two leads), with its small dial (scale
  `vMax` V, pointer `vDefl` 0–1), reading tag `vRead`, resistance tag `vR` (e.g. `2 667 Ω`), and a thin trickle of gold dots through
  its leads (visibly far sparser than the main loop) when `I > 0`.
- `verdict`: `null` · `'ok'` green tick by the ammeter · `'bad'` red cross by the ammeter (for the 18 Ω "what if" line).

## States

| State | Meaning |
|---|---|
| `scene` | `'dial'` \| `'convert'` \| `'test'` |
| `labels` | 0/1: part labels (magnet N/S, coil, hairspring, soft iron in `dial`; `coil`, `shunt`, `multiplier` in `convert`; `battery`, `starter load` in `test`) |
| `inside` | 0/1: cut-away of magnet, coil, hairspring, radial field (`dial`) |
| `defl` | pointer, fraction of full scale (animates; > 1 pins against the stop and jitters) |
| `scaleMax`, `unit` | scale end value and unit: e.g. `15, 'mA'` · `3, 'A'` · `40, 'V'` |
| `burn` | 0/1: coil glows, smoke, `burnt out!` (`dial`, `convert`) |
| `rg` | coil resistance tag, e.g. `'R_g = 18 Ω'` (or `''`) |
| `mode` | `'bare'` \| `'ammeter'` \| `'voltmeter'` (`convert`) |
| `rs`, `rm` | shunt / multiplier tags, e.g. `'R_s = 0.0905 Ω'`, `'R_m = 2 649 Ω'` (or `''`) |
| `flow`, `speed` | 0/1 moving charge dots · speed 0–1 (default 0.6) |
| `split` | 0/1: branch current labels |
| `iLine`, `iCoil`, `iShunt` | branch current strings, e.g. `'3.0 A'`, `'15 mA'`, `'2.985 A'` |
| `pd` | 0/1: p.d. brackets |
| `vCoil`, `vOther`, `vTotal` | p.d. strings, e.g. `'0.27 V'`, `'39.73 V'`, `'40 V'` |
| `box`, `total` | 0/1 highlight the finished meter box · its total-resistance string, e.g. `'meter = 0.0900 Ω'` |
| `wrong` | `null` \| `'shunt-series'` \| `'multiplier-parallel'` |
| `bat`, `r`, `R` | `test` labels, e.g. `'12.0 V'`, `'r = 1.2 Ω'`, `'2.8 Ω'` |
| `I`, `imax` | loop current for dot speed (animates), e.g. `3.0`, `imax: 3` |
| `ammeter`, `aMax`, `aDefl`, `aRead`, `aR` | series ammeter on/off · scale end (A) · pointer 0–1 · reading string · resistance string |
| `voltmeter`, `vMax`, `vDefl`, `vRead`, `vR` | parallel voltmeter on/off · scale end (V) · pointer 0–1 · reading string · resistance string |
| `verdict` | `null` \| `'ok'` \| `'bad'` |
| `focus` | dashed pulsing ring on a part: any close-up name below, or `null` |

Every numeric state (`defl`, `I`, `aDefl`, `vDefl`, `speed`) animates over 1.4 s via `mixN`. Strings never compute numbers: the plan
supplies them (with checks), so the kit cannot disagree with the board.

## Close-ups (`focus`)

`dial` (whole meter face, `dial` scene) · `scale` (arc and pointer tip) · `coil` (the coil, poles and hairspring cut-away) ·
`G` (the small galvanometer in `convert`) · `junction` (left split point with the two branch starts and their labels) ·
`shunt` · `multiplier` · `pd` (the p.d. brackets) · `box` (whole meter box with its total tag) · `ammeter` · `voltmeter` ·
`battery` · `load` (all three for `test`).

## Accuracy

- Moving-coil meter: coil in a **radial** field between curved poles and a soft-iron cylinder; the hairspring provides the
  restoring torque; deflection proportional to current, so the scale is **linear** (equal tick spacing).
- Ammeter: shunt in **parallel** with the coil; the parallel pair has a single p.d.; the line current splits, the coil takes the
  small share. Voltmeter: multiplier in **series** with the coil; one current through both; p.d.s add.
- The finished ammeter goes **in series** in the loop; the finished voltmeter goes **in parallel across** the battery. Never draw the
  ammeter across a component in the `test` scene.
- Conventional current: dots move from the battery's `+` terminal round the external circuit to `−` (in `test`); left → right through
  the meter box (in `convert`).
- Numbers the plan will drive (all supplied as strings / fractions): I_g = 15 mA, R_g = 18 Ω; R_s = 0.0905 Ω; split 15 mA / 2.985 A;
  ammeter total 0.0900 Ω; bare coil on 40 V → ≈ 2.2 A; R_m = 2 649 Ω; p.d. split 0.27 V / 39.73 V / 40 V; voltmeter total 2 667 Ω;
  test loop 12.0 V, r = 1.2 Ω, 2.8 Ω, 3.0 A; ammeter in loop ≈ 2.9 A (`aDefl` 0.978 on a 3 A scale); "what if 18 Ω" ≈ 0.55 A
  (`aDefl` 0.18); voltmeter reads 8.4 V (`vDefl` 0.21 on a 40 V scale).

## Numbers the plan will drive (sequence)

1. `scene: 'dial', scaleMax: 15, unit: 'mA', defl: 0 → 1.2, burn: 1` (hook), then `inside: 1, defl: 0.6`, `defl: 1, rg: 'R_g = 18 Ω'`.
2. `scene: 'convert', mode: 'ammeter', flow: 1, split: 1, iLine: '3.0 A', iCoil: 'I_g', iShunt: 'I − I_g'`, then `pd: 1, vCoil: 'same p.d.'`;
   then `rs: 'R_s = 0.0905 Ω', iCoil: '15 mA', iShunt: '2.985 A'`, `scaleMax: 3, unit: 'A', defl: 1`, `box: 1, total: 'meter = 0.0900 Ω'`.
3. `mode: 'bare', iLine: '≈ 2.2 A', burn: 1, defl: 1.2` (40 V on the bare coil), then `mode: 'voltmeter', burn: 0, rm: 'R_m = ?'`,
   then `rm: 'R_m = 2 649 Ω', pd: 1, vCoil: '0.27 V', vOther: '39.73 V', vTotal: '40 V', scaleMax: 40, unit: 'V'`, `box: 1, total: 'meter = 2 667 Ω'`.
4. `scene: 'test', bat: '12.0 V', r: 'r = 1.2 Ω', R: '2.8 Ω', I: 3.0, imax: 3`, then `ammeter: 1, aMax: 3, aDefl: 0.978, aRead: '≈ 2.9 A', aR: '0.0900 Ω', verdict: 'ok'`,
   then `aR: '18 Ω', aDefl: 0.18, aRead: '≈ 0.55 A', I: 0.55, verdict: 'bad'`, then `ammeter: 0, I: 3.0, voltmeter: 1, vMax: 40, vDefl: 0.21, vRead: '8.4 V', vR: '2 667 Ω'`.
5. `scene: 'convert', mode: 'ammeter', wrong: 'shunt-series', burn: 1` (mistake four).

## Look like

`kits/video/capillary-bed` / `kits/video/heart` (dark card, soft walls, same palette) and the built-in `circuit` kit (its meter faces,
brass terminals and charge dots), so the lesson-02 and lesson-04 videos look like one bench. Role colours from the plan:
`COLOR('I')` sky (line current), `COLOR('Ig')` gold (coil current), `COLOR('Rg')` pink, `COLOR('Rs')` green, `COLOR('Rm')` orange,
with those fallbacks. Labels ≤ 18 characters, ≥ 12 units, never on top of the moving pointer or the dot streams; readable at 270 px.
The shunt must look obviously **short and thick**, the multiplier obviously **long and big**: that contrast is the lesson.
