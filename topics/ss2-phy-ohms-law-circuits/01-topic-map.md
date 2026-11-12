---
slug: ss2-phy-ohms-law-circuits
subject: Physics
class: SS2
exams: [WAEC, NECO, JAMB]
practical: true
lessons_count: 5
duration_per_lesson_min: 80
---

# Topic Map: Ohm's Law & Current Electricity — Current, P.D., EMF, Networks and Null Methods

## 1. Paraphrased Syllabus Scope (WAEC | NECO | JAMB)

| Board | What candidates must be able to do (paraphrased) |
|---|---|
| **WAEC SSCE (Theory)** | Explain current as rate of charge flow and potential difference as energy transferred per coulomb; state and apply Ohm's law for a conductor at steady temperature; distinguish ohmic conductors from non-ohmic devices (a filament bulb, a diode, an electrolyte such as acidified or salty water between inert plates, where gas forms at the plates). Work out the resistance of a uniform wire from its length, cross-section and material (resistivity), and combine resistors in series and in parallel. Define electromotive force and internal resistance, and apply the full-circuit relation linking EMF, terminal p.d. and lost volts. Combine cells in series and in parallel. Calculate electrical energy, power and the efficiency of a source. Explain how a sensitive galvanometer is turned into an ammeter (with a shunt) or a voltmeter (with a multiplier). State the balance conditions for a metre bridge and a slide-wire potentiometer and use them to compare resistances and EMFs. |
| **WAEC Paper 3 (Practical)** | Set up a current–voltage circuit with an ammeter in series and a voltmeter in parallel, take at least five paired readings, tabulate to the correct decimal places and find a resistance from the slope of the graph. Find the balance length on a metre bridge for several standard values and deduce an unknown resistance (and a diameter ratio of two wires from the slope). Operate a potentiometer: record the "jockey-off" meter reading first, then balance lengths, plot the required graph and deduce EMF, internal resistance or a p.d. State precautions in acceptable wording (past tense) and identify sources of error. |
| **NECO SSCE** | The same senior-secondary scope and examining style as WAEC, with a strong preference for tabulated readings, clearly labelled graphs, slope triangles, and the metre-bridge and potentiometer practicals. |
| **JAMB UTME** | Under "Current electricity": apply Ohm's law and the EMF/internal-resistance relation; handle series and parallel resistor and cell combinations; compute power and source efficiency; size an ammeter shunt or a voltmeter multiplier; and use the metre-bridge and potentiometer balance conditions. Numerical multiple-choice items are very frequent. |

## 2. Unit Mystery Thread & 3D Story Cast

**The case: The Ngwa Road Keke Battery Drop.**
At **Engr. Nkechi's Auto-Electric Workshop on Ngwa Road, Aba**, a tricycle (keke) rider, **Emeka**, complains that his keke starts sluggishly and the headlamp dims whenever he revs the engine. His battery was charged only last week. On the bench, **Chinedu** (an SS2 apprentice) clips a digital voltmeter straight across the resting battery: it reads a normal-looking **12.0 V**. Yet the instant Chinedu throws the switch to the starter motor, that same voltmeter collapses to **8.4 V** and the test lamp goes dim. **Tobe**, a fellow apprentice, is sure the battery is simply "half dead" and should be thrown away. But when **Engr. Nkechi** balances the battery against her 100 cm potentiometer wire, where no current is drawn from it, the needle settles at the full **12.0 V** — the battery's true EMF has not fallen at all.

**Driving unit question:** *Where do the missing 3.6 V go the moment current flows, how do series and parallel networks share current and voltage, how can a delicate 15 mA galvanometer safely test a 3 A starter line or a 40 V bank, and why does the potentiometer still read 12.0 V when the voltmeter does not?*

| Lesson | The piece of the mystery it unlocks |
|---|---|
| 01 | What current and p.d. really are, why the thick starter cable barely warms while the thin lamp wire glows, and how to measure a resistance from a V–I graph. |
| 02 | **The core clue:** the 3.6 V are not lost in the wires — they are dropped *inside* the battery across its internal resistance the moment a large current flows (lost volts, terminal p.d.). |
| 03 | Whether the shop's backup cells should be wired in series or in parallel to run a low-resistance pump, why a worn battery runs hot, and how much of its power is wasted (networks, cell arrays, power, efficiency). |
| 04 | How Nkechi's tiny 15 mA galvanometer is converted — with a parallel shunt or a series multiplier — to measure the starter current and the bank voltage without burning out. |
| 05 | **The resolution:** proving the battery's true 12.0 V EMF with the potentiometer null method (no current drawn, so no lost volts) and measuring an unknown coil exactly on the metre bridge — the verdict: EMF unchanged, internal resistance risen (sulphated plates / corroded terminals) — clean, recharge and re-test `r`; replace only if `r` stays high. |

**StoryStage cast:** `nkechi` = Engr. Nkechi (master auto-electrician, the expert) · `chinedu` = Chinedu (SS2 apprentice, the learner) · `tobe` = Tobe (apprentice who holds the misconceptions) · `emeka` = Emeka (keke rider whose battery is the case). **Sets:** the workshop floor with the keke and battery (Set 1) and Nkechi's precision test bench with the potentiometer and metre bridge (Set 2).

## 3. Unit Welcome Hub Specification

- **3D Hero Lab (`#lab-canvas`, `window.StudyLab`):** an interactive DC circuit and internal-resistance bench — a 12 V lead-acid cell (adjustable EMF `E` and internal resistance `r`), a brass plug key, a sliding rheostat load `R`, a series ammeter and a parallel voltmeter, with drifting electron beads. Three HUD modes: `ohms-law` (vary `R`, read `V` and `I`, watch `V/I` stay constant for the wire) · `internal-resistance` (open key → `V = E`; close key → `V = E − Ir`, with the live V–I line) · `null` (slide a jockey on a 100 cm wire until the galvanometer reads zero). *(Build note / kit gap in § 10.)*
- **Marquee (12 terms):** current `I = Q/t` · p.d. `V = W/Q` · Ohm's law `V = IR` · resistivity `ρ` · EMF `E` · internal resistance `r` · lost volts `Ir` · series `R = R₁ + R₂` · parallel `1/R = 1/R₁ + 1/R₂` · power `P = IV` · shunt / multiplier · potentiometer `E ∝ l`.
- **Unit Mystery Case File (`#mystery`):** the 12.0 V → 8.4 V collapse on Ngwa Road, with clue cards (resting 12.0 V · under-load 8.4 V · potentiometer 12.0 V · lamp dims when the starter cranks) and three exam-weight stat cards (`Marks at stake` · `Exam boards: WAEC · NECO · JAMB` · `Core laws: Ohm, EMF, null balance`).
- **Explorer tabs (4, live SVG curve):** *1. Ohmic vs non-ohmic I–V* (axes `I` vertical against `V`: straight line through the origin for the wire vs a curve that bends over towards the `V` axis for a filament lamp) · *2. Terminal p.d. V = E − Ir* (straight line, vertical intercept `E`, gradient `−r`) · *3. Power and efficiency vs load R* (two **smooth curves**: `P` peaks where `R = r`; `η = R/(R+r)` rises towards 100 %) · *4. Potentiometer balance V = kl* (straight line through the origin).
- **6 calculation archetypes:**
  1. Ohm's law and power: `V = IR`; `P = IV = I²R = V²/R`; charge `Q = It`.
  2. Resistance of a wire: `R = ρL/A`, `A = πd²/4`, so `R ∝ L/d²`; resistivity `ρ = RA/L`.
  3. EMF and internal resistance: `E = I(R + r)`, terminal p.d. `V = E − Ir`, lost volts `Ir`; the two-readings method.
  4. Networks and cell arrays: series `R = ΣR`; parallel `1/R = Σ(1/R)`; cells in series add `E` and `r`; identical cells in parallel keep `E`, give `r/n`; efficiency `η = R/(R+r)`.
  5. Meter conversion: shunt `R_s = I_g R_g /(I − I_g)`; multiplier `R_m = V/I_g − R_g`.
  6. Null methods: metre bridge `R/S = l/(100 − l)`; potentiometer `E₁/E₂ = l₁/l₂`; internal resistance `r = R(l₁ − l₂)/l₂`.
- **3 myth-buster flip cards:**
  1. *"A voltmeter across a battery always shows its EMF."* — Only on open circuit. The moment current flows, it shows the terminal p.d. `V = E − Ir`, which is smaller.
  2. *"Joining identical cells in parallel raises the voltage."* — Parallel identical cells keep one cell's EMF; what falls is the internal resistance (`r/n`), letting the group deliver more current.
  3. *"To build a voltmeter you just put the whole resistance in series with the galvanometer."* — You add a **multiplier** `R_m = (V/I_g) − R_g`; the galvanometer's own coil resistance must be subtracted from the total.

## 4. Multi-Lesson Breakdown

| Lesson | Title | Driving question | 3D lab bench | 3D zoom | Bridge | Retrieval |
|---|---|---|---|---|---|---|
| **01** | **Current, P.D., Ohm's Law & the Resistance of Wires** | Why does the thin lamp wire glow while the thick starter cable barely warms, and how do we measure a resistance? | Ohm's-law & resistivity bench: vary `R`, material, length `L` and diameter `d`; take V–I pairs; plot V against I; a wire gives a straight line through the origin, a filament lamp a curve | Atomic-lattice drift: free electrons colliding with vibrating ions; thin vs thick wire; heating | Decide which jumper cable (thin vs thick) is overheating Emeka's circuit | from: 0 (charge, units, decimals) |
| **02** | **EMF, Terminal P.D., Lost Volts & Internal Resistance** | Where do the missing 3.6 V go the instant the starter cranks? | Internal-resistance lab: toggle the key (open `V = E`; closed `V = E − Ir`), adjust `R` and `r`, read the live V–I straight line with intercept `E` and gradient `−r` | Inside the cell: ions crossing the electrolyte between plates; energy wasted as heat (`Ir`) before charge reaches the terminals | Explain the 12.0 V → 8.4 V collapse and find the battery's `r` | from: 1 |
| **03** | **Series & Parallel Networks, Cell Arrays, Power & Efficiency** | Series or parallel for the shop's backup cells, and why does a worn battery run hot? | Network & cell-array builder: series/parallel resistors and cells; read total current, branch currents, load power, wasted power and efficiency; `P–R` and `η–R` smooth curves | Current splitting at a parallel node (`I = I₁ + I₂`); power shared between load `R` and internal `r` | Choose the cell arrangement that runs the low-resistance pump best | from: 1, 2 |
| **04** | **Galvanometer Conversion — Ammeter Shunts & Voltmeter Multipliers** | How can a 15 mA galvanometer test a 3 A line or a 40 V bank and survive? | Conversion bench: Ammeter mode (parallel shunt `R_s`) vs Voltmeter mode (series multiplier `R_m`); dial the full-scale range; watch the current split and needle deflection | Moving coil, hairspring and radial field; thick shunt strip carrying ~99 % of the current vs the fine series multiplier dropping the excess voltage | Size the shunt and the multiplier Nkechi needs for the starter test | from: 1, 2, 3 |
| **05** | **Null Methods — Metre Bridge, Potentiometer & WAEC Practicals** | How does the potentiometer still read the true 12.0 V, and how do we measure an unknown coil exactly? | Dual bench: metre bridge (slide the jockey, find the balance length, `R/S = l/(100−l)`) and potentiometer (balance lengths, `E ∝ l`, internal resistance by two lengths); WAEC tables | Potential gradient along the slide wire falling steadily until it equals the test EMF and the galvanometer current drops to zero | Solve the mystery: true EMF 12.0 V, risen internal resistance | from: 1, 2, 3, 4 |

## 5. Unit Learning Objectives

1. **LO1 (Remember, Understand):** Define current, potential difference, EMF and internal resistance, and state Ohm's law with its conditions.
2. **LO2 (Apply):** Use `V = IR`, `Q = It` and `P = IV = I²R = V²/R` in Nigerian workshop and household contexts, including unit conversions.
3. **LO3 (Apply, Analyse):** Calculate the resistance of a uniform wire from `R = ρL/A`, use the proportionality `R ∝ L/d²`, and distinguish ohmic from non-ohmic behaviour from a V–I graph.
4. **LO4 (Apply, Analyse):** Relate EMF, terminal p.d. and lost volts; find `E` and `r` from two readings and from the intercept and gradient of a V–I graph.
5. **LO5 (Apply):** Reduce series–parallel resistor networks and combine cells in series and in parallel, then find branch currents and potential drops.
6. **LO6 (Apply, Evaluate):** Compute electrical energy, power and source efficiency, and interpret the `P–R` and `η–R` curves.
7. **LO7 (Apply):** Size an ammeter shunt and a voltmeter multiplier, and explain why an ideal ammeter has low resistance and an ideal voltmeter high resistance.
8. **LO8 (Apply, Evaluate):** Use the metre-bridge and potentiometer balance conditions to find resistances, compare EMFs and measure internal resistance, state precautions in the past tense, and identify sources of error with their direction.

## 6. Prerequisites & Spaced Retrieval Matrix

| Lesson | Retrieves from | Key retrieval points |
|---|---|---|
| 01 | Prerequisites (from: 0) | Charge is measured in coulombs; a cell drives current round a circuit; reading a scale without parallax; multiplying and dividing decimals; area of a circle `πd²/4`. |
| 02 | Lesson 01 | `V = IR`; a V–I graph slope is resistance; ohmic vs non-ohmic; what an ammeter and a voltmeter measure. |
| 03 | Lessons 01–02 | `E = I(R + r)`; terminal p.d. `V = E − Ir`; lost volts `Ir`; a voltmeter under load does not read the EMF. |
| 04 | Lessons 01–03 | Series carries the same current; parallel shares the same p.d.; identical cells in parallel give `r/n`; efficiency `η = R/(R+r)`. |
| 05 | Lessons 01–04 | Shunt and multiplier formulae; an ideal voltmeter draws almost no current; `R ∝ L/d²`; a balanced bridge draws no current through the galvanometer. |

## 7. Transversal Competences (L1–L7)

- **L1 · Thinking and learning to learn:** forming and testing predictions on the circuit, cell and null benches; reading slopes and intercepts.
- **L2 · Cultural interaction and self-expression:** linking physics to Aba auto-electric work, Onitsha meter repair and solar-battery installers, and writing precautions clearly.
- **L3 · Managing daily life and safety:** safe wiring, avoiding overloaded sockets, and recognising when a hot battery or cable signals wasted power.
- **L4 · Multiliteracy:** moving between 3D benches, circuit symbols, equations and graphs (V–I, P–R, η–R, potentiometer).
- **L5 · Digital and simulation competence:** operating virtual meters, rheostats and a null-balance jockey.
- **L6 · Working-life skills and entrepreneurship:** diagnosing a faulty battery vs faulty wiring, sizing shunts and multipliers in meter repair, and judging source efficiency.
- **L7 · Building a sustainable future:** cutting `I²r` heating losses with the right cable and good connections in solar-inverter DC wiring.

## 8. Exam Emphasis & Chief Examiner Traps

1. **The voltmeter does not read the EMF under load.** Candidates routinely call the terminal p.d. the EMF. The EMF is the open-circuit reading; once current flows, the terminals show `E − Ir`. This single idea drives the whole unit.
2. **Full driver EMF is not all across the potentiometer wire.** A reported trap: with a series resistor in the driver circuit, find the current first, then the p.d. across the wire is `I × R_wire`. Assuming the whole driver EMF sits on the wire gives wrong balance lengths.
3. **Multiplier is total resistance minus the coil.** For a voltmeter, `R_m = V/I_g − R_g`; writing `R_total = V/I_g` as the added resistor loses marks.
4. **Series vs parallel cells.** Series adds EMF and adds `r`; identical cells in parallel keep one EMF and give `r/n`. Mixing these up is a classic error.
5. **Resistance depends on diameter squared.** `R ∝ 1/d²`, not `1/d`; doubling the diameter quarters the resistance.
6. **"Plot A against B" puts A on the vertical axis.** Plotting the wrong variable vertically, and using a slope triangle that is too small, cost marks every year in the practical.
7. **Practical discipline.** Record the "jockey-off" ammeter reading the question asks for; open the key between readings to stop the wire warming; give readings to the stated decimal places and check that they show the expected trend before leaving the bench.
8. **Graph shape must match the physics.** V–I for a wire, V–I for a cell, and `V = kl` for the potentiometer are genuinely **straight lines**; power and efficiency against load are **smooth curves**, never a straight regression line.

## 9. Known Misconceptions

| Misconception | What the unit teaches instead |
|---|---|
| A voltmeter across a battery reads its EMF. | Only on open circuit; under load it reads the terminal p.d. `V = E − Ir`. |
| The "missing volts" are lost in the connecting wires. | They are dropped inside the cell across its internal resistance `r` as `Ir`. |
| Identical cells in parallel give a bigger voltage. | The EMF stays the same; parallel lowers `r` to `r/n` and shares the current. |
| Resistance is proportional to diameter. | Resistance is proportional to `1/d²` (through the cross-sectional area). |
| The multiplier resistance equals `V/I_g`. | That is the total; the multiplier is `V/I_g − R_g`. |
| An ammeter should have high resistance for accuracy. | An ideal ammeter has very low resistance (in series) and an ideal voltmeter very high resistance (in parallel). |
| The whole driver EMF sits across the potentiometer wire. | Share it by resistance: the wire gets `I × R_wire`, after finding the current. |

## 10. Sources Consulted (paraphrased)

- `sources/Current Electricity Past Questions Bank (WAEC, NECO, JAMB).pdf`: a reworded bank of WAEC/NECO/JAMB items with the six recurring question types, three practical paradigms (metre bridge, potentiometer, V–I), sample readings, examiner-reported traps and precaution rules. Read for scope, exam weighting and examiner expectations only; nothing is copied. Every scenario, number, definition and question in this unit is newly authored.
- Standard textbook values of resistivity used in worked examples (copper ≈ `1.7 × 10⁻⁸ Ω m`, constantan ≈ `4.9 × 10⁻⁷ Ω m`, nichrome ≈ `1.1 × 10⁻⁶ Ω m`) are well-established constants, not source-specific data.

### Build notes & kit gaps (for `lesson-renderer` / `kit-builder`)
- **`kits/dc-circuit-bench/kit.js` is incomplete.** It currently exposes only `window.DCCircuitKit` with two part-builders (`createAccumulatorCell`, `createAnalogMeter`). The parametric, window-exposed **`DcCircuitBench`** with the five physics modes advertised in the kit README (`ohms-law`, `internal-resistance`, `network-cells`, `galvanometer`, `bridge-potentiometer`) is **not yet implemented**. Every bench in this unit assumes that full bench exists and that readings are computed from a physics model (so each mode/condition button changes the numbers it physically should). `kit-builder` must build it out before the lessons render. Modelled numbers to reproduce: open-circuit `V = E`; closed `V = E − Ir`; the mystery battery `E = 12.0 V`, under a `2.8 Ω` starter `V = 8.4 V`, `I = 3.0 A`, `r = 1.2 Ω`.
- **`kits/study-graph/` (`window.StudyGraph`) is complete** and drives every lesson graph via a per-lesson `graph.js`. Use `fit: "line"`/`"origin"` for the genuinely linear plots (V–I wire, V–I cell, potentiometer `V = kl`, metre-bridge `R₂` vs `R₁`) and the `fn` smooth-curve option for `P–R` and `η–R`. No gap.
- **Video kits** available for Lesson 02 in `kits/catalog.md`: `circuit`, `cell`, `toll`, `graph`. Lessons 03 and 04 would use `graph` plus board, or newly built video kits (network-builder and galvanometer-conversion are video-kit gaps the director can build on the fly).
