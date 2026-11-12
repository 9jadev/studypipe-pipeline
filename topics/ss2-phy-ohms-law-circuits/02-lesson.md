---
slug: ss2-phy-ohms-law-circuits
title: Ohm's Law & Current Electricity — Current, P.D., EMF, Networks and Null Methods
subject: Physics
class: SS2
exams: [WAEC, NECO, JAMB]
lessons: 5
duration_min: 80
version: 3
---

# Multi-Lesson Unit Plan: Ohm's Law & Current Electricity (`ss2-phy-ohms-law-circuits`)

---

## Part I: Unit Welcome Hub (`html/index.html`)

### 1. Hero & 3D Hero Lab
- **Eyebrow:** `SS2 PHYSICS · WAEC · NECO · JAMB · PAPER 3 PRACTICAL`
- **Display title:** Current Electricity: *Chasing the Missing Volts*
- **Lede:** Emeka's keke battery reads a steady 12.0 V at rest, yet the headlamp dims and the reading crashes to 8.4 V the moment the starter turns. Where do the 3.6 volts go? Trace charge through wires, cells and networks, convert a fragile galvanometer into a working ammeter and voltmeter, and prove a battery's true EMF the way a WAEC examiner expects.
- **CTAs:** `Start guided tour (en-NG) ▷` (`data-tour`) · `Begin Lesson 1 →` (`lessons/lesson-01/index.html`)
- **Hero meta:** `5 lessons · ~6 h 40 min` · `5 3D labs + 5 3D zooms` · `60 quiz questions + 5 × 30-mark papers` · `Paper 3: V–I, metre bridge, potentiometer`
- **3D Hero Lab (`#lab-canvas`, `window.StudyLab`, `dc-circuit-bench` kit):**
  - `ohms-law`: a lead-acid cell, plug key, rheostat `R`, series ammeter and parallel voltmeter; slide `R` and watch `V` and `I` change while `V ÷ I` stays constant for the wire.
  - `internal-resistance`: open the key → voltmeter shows `E`; close it → it shows `V = E − Ir`; a live V–I line plots the vertical intercept `E` and the gradient `−r`.
  - `null`: a 100 cm slide wire with a jockey; drag it until the centre-zero galvanometer reads zero.
  - HUD readouts: mode, `E`, `r`, `R`, `I`, `V`, lost volts `Ir`.

### 2. Marquee (12 terms)
current `I = Q/t` · p.d. `V = W/Q` · Ohm's law `V = IR` · resistivity `ρ` · EMF `E` · internal resistance `r` · lost volts `Ir` · series `R = R₁ + R₂` · parallel `¹⁄R = ¹⁄R₁ + ¹⁄R₂` · power `P = IV` · shunt / multiplier · potentiometer `E ∝ l`

### 3. Unit Mystery Case File (`#mystery`)
- **Narrative:** On Ngwa Road in Aba, the keke rider Emeka drops off a battery that was charged last week but now starts his engine weakly. At Engr. Nkechi's workshop, Chinedu clips a voltmeter across the resting battery and reads 12.0 V — normal-looking. The instant he switches in the starter, the reading drops to 8.4 V and the lamp dims. Tobe says the battery is finished. Nkechi says, "Measure it a cleverer way before you throw it away."
- **Realism note (one line on screen, for teachers and curious students):** a real keke starter motor draws far more current than this — often well over a hundred amperes for a moment — so the unit models the "starter" as Nkechi's `2.8 Ω` starter test load (starter relay and headlamp), which draws `3.0 A` and keeps every number easy to follow; the physics (`V = E − Ir`) is exactly the same.
- **Clue cards:** resting reading 12.0 V · under-load reading 8.4 V · the lamp dims only while current flows · on the potentiometer, where no current is drawn, it still balances at 12.0 V.
- **Exam-weight stats:** `Regularly` current electricity appears across WAEC/NECO Papers 1 and 2 · `Paper 3`: the metre bridge, potentiometer and V–I set-ups recur most years · `JAMB`: numerical items on Ohm's law, internal resistance, networks and null methods are very frequent.

### 4. Lesson Journey (`#journey`)
Five cards linking to `lessons/lesson-01/` … `lesson-05/`, each with duration (80 min), tags and a one-line promise (see Part II titles). Thread note: every lesson's Do Now retrieves from earlier lessons, so the mystery and the mathematics build together.

### 5. Explorer, Archetypes, Myths, Method
- **Explorer tabs (4)** with SVG curve `#combo-curve` / marker `#combo-marker`:
  1. *Ohmic vs non-ohmic I–V* — axes: **`I` (vertical) against `V` (horizontal)**: a **straight line through the origin** for a wire (constant `R`) and, for comparison, a **curve** that bends over (flattens towards the `V` axis) for a filament lamp, because its resistance rises as it heats. (Lesson 01 plots `V` vertical against `I`, where the same lamp curve bends upwards; the tab caption says so.)
  2. *Terminal p.d. V = E − Ir*: a **straight line** with vertical intercept `E` and gradient `−r`.
  3. *Power and efficiency vs load R*: two **smooth curves** — load power `P = E²R/(R+r)²` peaking where `R = r`, and efficiency `η = R/(R+r)` climbing towards 100 %. (Never a straight line.)
  4. *Potentiometer balance V = kl*: a **straight line through the origin** (p.d. proportional to length).
- **6 calculation archetypes (StudyMath chains):**
  1. Ohm's law and power: `V = IR`; `P = IV = I²R = V²/R`; charge `Q = It`.
  2. Resistance of a wire: `R = ρL/A`, `A = πd²/4`, so `R ∝ L/d²`; resistivity `ρ = RA/L`.
  3. EMF and internal resistance: `E = I(R + r)`, terminal p.d. `V = E − Ir`, lost volts `Ir`; the two-readings method.
  4. Networks and cell arrays: series `R = ΣR`; parallel `¹⁄R = Σ(¹⁄R)`; series cells `E_t = nE`, `r_t = nr`; identical parallel cells `E_t = E`, `r_t = r/n`; efficiency `η = R/(R+r)`.
  5. Meter conversion: shunt `R_s = I_g R_g /(I − I_g)`; multiplier `R_m = V/I_g − R_g`.
  6. Null methods: metre bridge `R/S = l/(100 − l)`; potentiometer `E₁/E₂ = l₁/l₂`; internal resistance `r = R(l₁ − l₂)/l₂`.
- **Myth flip cards (3):** see Topic Map § 3 (voltmeter ≠ EMF under load · parallel cells don't add voltage · multiplier = total − `R_g`).
- **Method (`#method`):** the 5-step inquiry loop · What's inside every lesson (`#kit`) · finale CTA to Lesson 1.

### 6. Spaced Retrieval Bank (`assets/js/retrieval-bank.js`)
`l01` … `l05`, each with `donow` (4 cards, `from`), `quiz` and `recall` arrays, as listed in each lesson's Phase 0 and Phase 5. Do Now cards for `l02`–`l05` carry one-tap *"Revisit Lesson X →"* links to the earlier lesson they pull from.

---

## Part II: The Five Lessons

---

### LESSON 01: Current, P.D., Ohm's Law & the Resistance of Wires
- **Folder:** `html/lessons/lesson-01/` · **Duration:** 80 min · **Competences:** L1, L2, L4, L5
- **Guiding question:** Why does the thin lamp wire glow while the thick starter cable barely warms, and how do we measure a resistance?
- **Objectives:**
  1. **01** · Define current (`I = Q/t`) and potential difference (`V = W/Q`) and state their SI units.
  2. **02** · State Ohm's law and its condition (steady temperature and physical state), and use `V = IR`.
  3. **03** · Distinguish ohmic conductors from non-ohmic devices from the shape of a V–I graph.
  4. **04** · Calculate the resistance of a uniform wire from `R = ρL/A` and use `R ∝ L/d²`.
  5. **05** · Find a resistance from the slope of a V–I graph and state the practical's precautions in the past tense.

#### 0. Warm-up · Do Now (5 min, `from: 0`)
1. **Q:** What is measured in coulombs, and what does one ampere mean? **A:** Electric **charge** is measured in coulombs (C); one **ampere** is one coulomb passing a point each second (`1 A = 1 C s⁻¹`).
2. **Q:** Convert 3.0 minutes to seconds and 0.50 mm to metres. **A:** `3.0 min = 180 s`; `0.50 mm = 0.50 × 10⁻³ m = 5.0 × 10⁻⁴ m`.
3. **Q:** Find the area of a circle of diameter 0.40 mm. **A:** `A = πd²/4 = π(4.0 × 10⁻⁴)²/4 = 1.26 × 10⁻⁷ m²`.
4. **Q:** Why do we read a meter with the eye square to the scale? **A:** To avoid **parallax error**, which otherwise makes the reading systematically too high or too low.

#### 1. Wonder · Story & Wonder Wall (10 min)
- **3D Story (`story.js`, scene key: `story`), Set 1 (workshop):**
  1. `shot: [[0, 2.4, 7.0], [0, 1.2, 0]]`, `who: "emeka"`, "My keke starts fine, but once I switch on the headlamp and rev, the light goes weak." `caption: "Aba, Ngwa Road."`
  2. `who: "chinedu"` — he touches two jumper cables after a test run: the thin one is hot, the thick one is cool. "Same current went through both. Why is only the thin one hot?"
  3. `who: "tobe"` — "The thin wire is just bad quality, throw it." Chinedu is not sure.
  4. `who: "nkechi"` — she holds up a coil of resistance wire and a filament bulb. "Current, voltage and resistance decide everything here. Before we judge any wire, we measure."
  5. `who: "nkechi"` — she sets a cell, key, ammeter, voltmeter and rheostat on the bench. "Change the voltage, read the current, and let the graph tell us the resistance."
- **Collapsible transcript (`#story-text`):** full dialogue for low-end offline fallback.
- **Wonder Wall (`#wonder`) prompt:** *Before we measure: what makes one wire heat up more than another carrying the same current?*
- **Seed notes (4):** "Thin wires have more resistance? (Chinedu)" · "Longer wires too? (Amara)" · "Maybe the metal matters (Ngozi)" · "All copper is the same, resistance is nonsense (Tobe)".

#### 2. Investigate · Sort Game & 3D Practical (30 min)
- **2A Sort game (`#sort`):** *Ohmic or not?* Bins (3): `ohmic` (obeys Ohm's law — straight V–I through origin) · `non-ohmic` (V–I curves) · `insulator-ish` (barely conducts). Items (10): a constantan resistance wire at steady temperature → ohmic · a metal rod kept cool → ohmic · a carbon film resistor → ohmic · a filament lamp → non-ohmic (hotter = more resistance) · a semiconductor diode → non-ohmic (conducts one way) · an electrolyte (salty water) → non-ohmic · a thermistor → non-ohmic (hotter = less resistance) · dry wood → insulator-ish · dry air → insulator-ish · pure distilled water → insulator-ish. Each item carries a one-line *why* revealed after checking.
- **2B 3D Practical (`#practical`, scene key: `bench`, `dc-circuit-bench` kit, `ohms-law` mode):**
  - **Apparatus & 4 method cards (`.method`):**
    1. Connect the cell, plug key, ammeter (in series) and the test wire, with the voltmeter across the wire; keep the key open until a reading is taken.
    2. Close the key briefly, set the rheostat, and record the paired ammeter (`I`) and voltmeter (`V`) readings, then open the key again.
    3. Repeat for at least five different rheostat settings, spreading the readings across the range.
    4. Plot `V` (vertical) against `I` (horizontal); for the wire, draw the straight line of best fit and read its slope as the resistance.
  - **3D scene (`bench`):** built with `SceneKit.createStage`. Named parts for `StudyNarrator`: `cell`, `key`, `ammeter`, `voltmeter`, `rheostat`, `wire`, `leads`. **Controls:** component under test (`constantan wire` / `copper wire` / `filament lamp`), length `L` (`20`, `40`, `60`, `80`, `100 cm`; default `40 cm`), diameter `d` (`0.30`, `0.60`, `1.20 mm`; default `0.30 mm`), rheostat slider, **Take reading** and **Reset**. Readings computed from the model (`I = V/R`, `R = ρL/A`; the lamp's `R` rises with `I`). Emits `l1:bench` each reading and `l1:bench-done` after 5 readings on one component.
  - **Interactive results table (`#results-table`):** Reading · `I / A` (2 d.p.) · `V / V` (2 d.p.) · `V/I / Ω` (2 d.p.).
  - **Expected results & graph (`#expected`), constantan wire at the bench default `L = 40 cm`, `d = 0.30 mm` (`R = ρL/A = 4.9 × 10⁻⁷ × 0.40 ÷ 7.07 × 10⁻⁸ = 2.77 Ω`), driven by `graph.js` → `window.StudyGraph`:** `(0.20, 0.55)`, `(0.40, 1.11)`, `(0.60, 1.66)`, `(0.80, 2.22)`, `(1.00, 2.77)`. A **straight line of best fit through the origin** (`fit: "origin"`); slope triangle gives `R = 2.77 Ω`. The filament lamp instead gives a **smooth curve** bending upwards, towards the `V` axis, as it heats (with `V` on the vertical axis, a rising resistance `V/I` makes the curve steeper) (`join: true`, no straight fit).
  - **Precautions (past tense):** the plug key was opened between readings so the wire did not heat up and change its resistance · the connections were kept tight and the terminals clean · zero errors on the ammeter and voltmeter were checked before readings began · parallax error was avoided by reading each meter square to its scale · the readings were repeated and spread across the range.
  - **Sources of error (with direction):** a warming wire (key left closed) raised its resistance, so later `V` readings were **too high** for their current and the slope was **over-estimated** · a loose contact between the wire and the points where the voltmeter was clipped was measured as part of the wire, so each `V` was too large for its current and the slope came out **too high** (a loose contact elsewhere in the loop only lowered the current and did not bias `V/I`) · a voltmeter of low resistance drew a little current, so the ammeter read **too high** and `V/I` came out **too low**.
  - **Analysis questions (5, locked `.solution`):** Why does the wire give a straight line but the lamp a curve? · Why must the key be opened between readings? · How does the slope of the graph give the resistance? · If the wire's length is doubled, what happens to the slope? (doubles) · If its diameter is doubled, what happens to the resistance? (falls to one quarter).

#### 3. Make Sense · Core Concepts & 3D Drift Zoom (15 min)
- **Definitions (`#concepts`):** *current* is the rate at which charge flows past a point, `I = Q/t` (amperes). *Potential difference* between two points is the electrical energy changed to other forms per coulomb that passes between them, `V = W/Q` (volts). *Resistance* is the opposition of a component to current, `R = V/I` (ohms).
- **Ohm's law (`.callout.big`):** for a metallic conductor kept at steady temperature and physical condition, the current through it is directly proportional to the p.d. across it, so `V/I` is constant and equals its resistance `R`. Devices that do not keep this ratio constant (a filament lamp, a diode, an electrolyte such as acidified or salty water between inert plates, where gas forms at the plates) are non-ohmic.
- **Equations (`.eq`):** `I = Q/t` · `V = IR` · `R = ρL/A` with `A = πd²/4` · `R ∝ L/d²` · power `P = IV = I²R = V²/R`.
- **Comparison table (`#props-table`):** factor vs effect on `R`: length `L` (↑ L → ↑ R, directly) · cross-section `A` (↑ A → ↓ R, inversely) · diameter `d` (↑ d → ↓ R as `1/d²`) · material `ρ` (copper low, nichrome high) · temperature (metal: ↑ T → ↑ R; semiconductor/thermistor: ↑ T → ↓ R).
- **Pin/Scale Explorer (`#pos-explorer`):** tap wire pins to inspect `R`: fix `ρ` (constantan) and sweep length `L = 20 → 100 cm` and diameter `d = 0.30 / 0.60 / 1.20 mm`, reading `A`, `R` and the live point on the V–I line at a chosen `V`.
- **3D Zoom (`#zoom`, scene key: `zoom`):** a close-up metal lattice — free electrons drifting and colliding with vibrating positive ions; a thin wire crowds the electrons and heats more, a thick wire lets them through easily; raising the temperature shakes the ions harder and raises the resistance. Live `.counters`: drift speed, collisions per second, temperature.

#### 4. Apply · Worked Examples, The Bridge & Quiz (10 min; quiz finished at home if needed)
- **Worked Example 1 (current, power and charge — 3 steps):** A workshop pressing-iron element of resistance `48 Ω` runs from the `240 V` mains. Find (a) the current it draws, (b) its power, and (c) the charge that flows in 2.0 minutes.
  1. `I = V/R = 240 ÷ 48 = 5.0 A`.
  2. `P = IV = 5.0 × 240 = 1 200 W = 1.2 kW`.
  3. Convert the time, `t = 2.0 min = 120 s`, then `Q = It = 5.0 × 120 = 600 C`.
  - **Answer:** `I = 5.0 A`; `P = 1.2 kW`; `Q = 600 C`.
- **Worked Example 2 (resistivity, then a second wire — 3+ steps):** A nichrome heating wire is `2.00 m` long with cross-sectional area `5.0 × 10⁻⁷ m²`, and a V–I test gives it a resistance of `4.40 Ω`. (a) Find the resistivity. (b) A second wire of the same material is `3.00 m` long but has **twice** the diameter; find its resistance.
  1. `ρ = RA/L = (4.40 × 5.0 × 10⁻⁷) ÷ 2.00`.
  2. `= (2.20 × 10⁻⁶) ÷ 2.00 = 1.1 × 10⁻⁶ Ω m`.
  3. For the second wire use `R ∝ L/d²`: twice the diameter means four times the area, so `R₂ = R₁ × (L₂/L₁) × (d₁/d₂)² = 4.40 × (3.00/2.00) × (1/2)²`.
  4. `= 4.40 × 1.50 × 0.25 = 1.65 Ω`.
  - **Answer:** `ρ = 1.1 × 10⁻⁶ Ω m`; `R₂ = 1.65 Ω`.
- **Worked Example 3 (resistance from a V–I graph — 3 steps):** A V–I graph for a wire passes through `(0.20 A, 0.44 V)` and `(1.00 A, 2.20 V)` on its line of best fit. Find the resistance.
  1. Choose two well-separated points on the line and read them off.
  2. `ΔV = 2.20 − 0.44 = 1.76 V`; `ΔI = 1.00 − 0.20 = 0.80 A`.
  3. `R = slope = ΔV/ΔI = 1.76 ÷ 0.80 = 2.20 Ω`.
  - **Answer:** `R = 2.20 Ω` (the line is straight and passes through the origin, so the wire is ohmic).
- **The Bridge (`#bridge`):** test Emeka's two jumper cables on the bench — the thin one (`d = 0.30 mm`) and the thick one (`d = 1.20 mm`), same material and length. The thin cable's resistance is sixteen times the thick one's (`(1.20/0.30)² = 16`), so at the same current it dissipates sixteen times the power (`P = I²R`) and runs hot. Unlocks the `.vt-verdict` + `.callout.big#big-idea`: *resistance grows with length and material but falls as the square of the diameter; the hot wire is the thin one, not a "bad" one.*
- **Quiz (`#quiz`):** 12 questions from `03-questions.md` § Lesson 01 (`window.LESSON_QUIZ`).

#### 5. Reflect & Assignment (5 min + 40 min home)
- **I can (1–4):** define current and p.d. with units · state Ohm's law and its condition · tell ohmic from non-ohmic from a V–I graph · find a wire's resistance from `R = ρL/A` and `R ∝ L/d²` · read a resistance from a graph's slope.
- **Exit ticket (`.aq`, 2 marks):** A `1.5 m`, `0.50 mm²` wire has resistance `3.0 Ω`. Find its resistivity. (`ρ = RA/L = 3.0 × 0.50 × 10⁻⁶ ÷ 1.5 = 1.0 × 10⁻⁶ Ω m`.)
- **Blank-page recall (`#recall-box`):** `I = Q/t` · `V = W/Q` · Ohm's law and its condition · `R = ρL/A`, `A = πd²/4`, `R ∝ L/d²` · slope of V–I is `R` · ohmic vs non-ohmic shapes.
- **Assignment:** Part A and Part B from `03-questions.md` § Lesson 01.
- **Teacher notes (`#teacher-notes`):** timetable — 0–5 Do Now · 5–15 Wonder · 15–45 Investigate · **45–50 movement break** · 50–65 Make Sense · 65–80 Apply and Reflect. Competences: L1 (predict then test), L2 (link the jumper-cable puzzle to Aba auto-electric trade practice, and write the precautions in clear past-tense sentences an examiner can credit), L4 (graphs and scales), L5 (simulation). Support/Stretch: support with pre-filled table rows; stretch with a copper-vs-nichrome resistivity comparison.

---

### LESSON 02: EMF, Terminal P.D., Lost Volts & Internal Resistance
- **Folder:** `html/lessons/lesson-02/` · **Duration:** 80 min · **Competences:** L1, L4, L6
- **Guiding question:** Where do the missing 3.6 V go the instant the starter cranks?
- **Objectives:**
  1. **01** · Define electromotive force (`E`) and internal resistance (`r`).
  2. **02** · Apply the full-circuit relation `E = I(R + r)` and terminal p.d. `V = E − Ir`.
  3. **03** · Explain lost volts (`Ir`) and why a voltmeter reads the EMF only on open circuit.
  4. **04** · Find `E` and `r` by the two-readings method.
  5. **05** · Find `E` (intercept) and `r` (gradient) from a V–I graph.

#### 0. Do Now (`from: 1`)
1. **Q:** State Ohm's law. **A:** At steady temperature, current is proportional to the p.d. across a conductor, so `V = IR` with `R` constant. *(Revisit Lesson 1 →)*
2. **Q:** A V–I graph's slope is `3.0 V ÷ 1.5 A`. What does it give? **A:** The resistance, `R = 2.0 Ω`.
3. **Q:** What does an ammeter read, and where is it connected? **A:** The current; in **series**.
4. **Q:** What does a voltmeter read, and where is it connected? **A:** The potential difference; in **parallel** across the component.

#### 1. Wonder
- **3D Story (`story.js`), Set 1 (workshop):**
  1. `who: "chinedu"` — he clips the voltmeter straight across the resting battery: "12.0 V, boss. It looks normal."
  2. `who: "chinedu"` — he throws the starter switch; the reading drops to 8.4 V and the lamp dims. "It fell! Where did 3.6 volts go?"
  3. `who: "tobe"` — "The battery is weak, it has lost its voltage. Dump it."
  4. `who: "nkechi"` — "The EMF has not fallen. Those volts are spent *inside* the battery when a big current flows. We'll measure how much resistance is hiding in there."
  5. `who: "nkechi"` — she sets up the cell, key, rheostat and both meters. "Open key: you see the EMF. Closed key: you see what's left after the inside takes its cut."
- **Wonder Wall prompt:** *If the battery still 'has' 12.0 V, why does the meter show only 8.4 V when the starter runs?* Seeds: "The wires steal it? (Chinedu)" · "The battery is dying (Tobe)" · "Something inside the battery resists (Amara)" · "The meter is faulty (Ngozi)".

#### 2. Investigate
- **2A Sort (`#sort`):** *EMF or terminal p.d.?* Bins (3): `emf` (the open-circuit reading / energy per coulomb supplied) · `terminal-pd` (the reading while current flows) · `lost-volts` (the `Ir` drop inside). Items (9): voltmeter across a cell with the key open → emf · total energy given to each coulomb by the cell → emf · voltmeter reading while the starter runs → terminal-pd · the `IR` across the external load → terminal-pd · the `Ir` drop across the cell's inside → lost-volts · the reason a battery warms under heavy load → lost-volts · the number that never changes as load changes (for a given cell) → emf · what gets smaller as you draw more current → terminal-pd · the gap between 12.0 V and 8.4 V here → lost-volts.
- **2B 3D Practical (`#practical`, scene key: `bench`, `dc-circuit-bench` kit, `internal-resistance` mode):**
  - **Method cards (4):**
    1. With the key open, read the voltmeter: this is the EMF `E`.
    2. Close the key, set the rheostat, and record the paired `I` and terminal `V`; open the key again.
    3. Repeat for at least five loads so the current spans a good range.
    4. Plot `V` (vertical) against `I` (horizontal); read the vertical intercept as `E` and the magnitude of the gradient as `r`.
  - **3D scene (`bench`):** parts `cell`, `key`, `ammeter`, `voltmeter`, `rheostat`, `leads`. **Controls:** EMF `E` preset, internal resistance `r` preset, rheostat load `R`, key open/closed, **Take reading**, **Reset**. Readings from the model: open → `V = E`; closed → `I = E/(R+r)`, `V = E − Ir`. Emits `l2:bench`, `l2:bench-done` after 5 loads.
  - **Results table (`#results-table`):** Reading · `R / Ω` · `I / A` (2 d.p.) · `V / V` (2 d.p.) · lost volts `E − V / V`.
  - **Expected results & graph (`#expected`), `E = 6.0 V`, `r = 1.5 Ω`, via `graph.js`:** `(0.50, 5.25)`, `(1.00, 4.50)`, `(1.50, 3.75)`, `(2.00, 3.00)`, `(2.50, 2.25)`. A **straight line of best fit** (`fit: "line"`, `extend: true`); vertical intercept `E = 6.0 V`, gradient `−1.5`, so `r = 1.5 Ω`.
  - **Precautions (past tense):** the key was opened between readings so the cell and wire did not heat and change `r` · the open-circuit reading for `E` was taken with a high-resistance voltmeter so negligible current flowed · the connections were tight and the terminals clean · parallax error was avoided on both meters · readings were repeated and spread across the range.
  - **Sources of error (with direction):** a voltmeter of finite resistance drew a small current even on "open circuit", so the measured `E` was slightly **too low** · a cell kept delivering a large current polarised (reaction products built up at its plates), which raised `r` during the run (readings were taken in order of increasing current), so the later, higher-current points sagged and the gradient (and `r`) came out **too high** · a dirty or loose contact at the cell's own terminals (inside the voltmeter connections) was measured as part of the cell, so the computed `r` came out **too high**; extra resistance elsewhere in the external circuit only lowered `I` and did not bias `r`.
  - **Analysis questions (5, locked):** Why is the open-circuit reading the EMF? · Why does the terminal p.d. fall as the current rises? · What does the vertical intercept represent, and what does the gradient represent? · Why should the voltmeter resistance be high? · Why does a battery feel warm under heavy load? (energy `I²r` lost inside).

#### 3. Make Sense
- **Definitions (`.callout`):** *electromotive force (EMF, `E`)* is the total electrical energy the source gives to each coulomb driven round the whole circuit, measured in volts; it is the open-circuit terminal reading (`I = 0`). *Internal resistance (`r`)* is the opposition to current inside the source itself (its electrolyte and electrodes). *Lost volts* is the p.d. used up inside, `Ir`. *Terminal p.d. (`V`)* is what is left for the external circuit, `V = E − Ir = IR`.
- **Equations (`.eq`):** `E = I(R + r)` · `V = E − Ir` · `V = IR` · lost volts `= Ir` · two readings: `E = I₁(R₁ + r) = I₂(R₂ + r)`.
- **Comparison table (`#props-table`):** open circuit (`I = 0`): current 0, lost volts 0, voltmeter reads `E` · on load (`I > 0`): current `E/(R+r)`, lost volts `Ir`, voltmeter reads `E − Ir`; the heavier the load (smaller `R`), the larger the current, the larger the lost volts and the smaller the terminal p.d.
- **Position Explorer (`#pos-explorer`):** tap load pins (`R = ∞, 6, 3, 2, 1 Ω`) for a fixed cell (`E = 6.0 V`, `r = 1.5 Ω`) and read `I`, `Ir`, `V` at each — watch the terminal p.d. fall as the load gets heavier and the point slide down the V–I line.
- **3D Zoom (`#zoom`, scene key: `zoom`):** inside the cell — positive and negative ions crossing the electrolyte between the plates, some energy turning to heat before the charge reaches the terminals; a live 3D "energy per coulomb" bar splitting into `IR` (useful, external) and `Ir` (lost, internal). Counters: `E`, `Ir`, `V`.

#### 4. Apply
- **Worked Example 1 (the mystery battery — 3 steps):** Emeka's battery reads `12.0 V` on open circuit and `8.4 V` while driving the `2.8 Ω` starter. Find (a) the current, (b) the lost volts, (c) the internal resistance.
  1. `I = V/R = 8.4 ÷ 2.8 = 3.0 A`.
  2. Lost volts `= E − V = 12.0 − 8.4 = 3.6 V`.
  3. `r = (lost volts) ÷ I = 3.6 ÷ 3.0 = 1.2 Ω`.
  - **Answer:** `I = 3.0 A`; lost volts `= 3.6 V`; `r = 1.2 Ω`. (Check: `E = I(R + r) = 3.0 × (2.8 + 1.2) = 12.0 V`.)
- **Worked Example 2 (two readings, same cell — 3+ steps):** A cell drives `0.80 A` through a `4.0 Ω` lamp, and `0.50 A` through a `7.0 Ω` lamp. Find its internal resistance and EMF.
  1. The EMF is the same both times: `0.80(4.0 + r) = 0.50(7.0 + r)`.
  2. Expand: `3.2 + 0.80r = 3.5 + 0.50r`, so `0.30r = 0.30`.
  3. `r = 1.0 Ω`.
  4. `E = 0.80 × (4.0 + 1.0) = 0.80 × 5.0 = 4.0 V`.
  - **Answer:** `r = 1.0 Ω`; `E = 4.0 V`.
- **Worked Example 3 (E and r from a graph, then a load — 3 steps):** A V–I graph for a cell has a vertical intercept of `6.0 V` and a gradient of `−1.5 V A⁻¹`. Find the terminal p.d. when the current is `1.2 A`.
  1. Read the graph: `E = 6.0 V` (intercept) and `r = 1.5 Ω` (magnitude of the gradient).
  2. Lost volts `= Ir = 1.2 × 1.5 = 1.8 V`.
  3. `V = E − Ir = 6.0 − 1.8 = 4.2 V`.
  - **Answer:** `V = 4.2 V`.
- **The Bridge (`#bridge`):** rebuild Emeka's circuit. On open circuit the voltmeter sits at `12.0 V` (the EMF); switch in the `2.8 Ω` starter and `3.0 A` flows, dropping `3.6 V` inside the cell, so the terminals fall to `8.4 V`. The missing volts never left the battery's chemistry — they were spent on the battery's own internal resistance. `.callout.big#big-idea`: *EMF is what the cell can give; terminal p.d. is what survives after `Ir` is paid inside. A tired battery has a larger `r`, so it drops more volts under load even though its EMF is unchanged.*
- **Quiz:** 12 questions from `03-questions.md` § Lesson 02.

#### 5. Reflect & Assignment
- **I can (1–4):** define EMF and internal resistance · use `E = I(R + r)` and `V = E − Ir` · explain lost volts and the open-circuit rule · find `E` and `r` by two readings · find `E` and `r` from a graph.
- **Exit ticket (2 marks):** A solar-lantern battery of EMF `7.5 V` and internal resistance `0.40 Ω` lights a `2.1 Ω` lamp. Find the terminal p.d. (`I = 7.5 ÷ (2.1 + 0.40) = 7.5 ÷ 2.5 = 3.0 A`; `V = 7.5 − 3.0 × 0.40 = 7.5 − 1.2 = 6.3 V`.)
- **Recall:** EMF vs terminal p.d. · lost volts `Ir` · `E = I(R + r)` · two-readings method · intercept `E`, gradient `−r`.
- **Assignment:** Part A and Part B from `03-questions.md` § Lesson 02.
- **Teacher notes:** 0–5 Do Now · 5–15 Wonder · 15–45 Investigate · **45–50 movement break** · 50–65 Make Sense · 65–80 Apply and Reflect. Competences: L1 (hypothesis about hidden `r`), L4 (graph intercept/gradient), L6 (battery diagnosis). Support: give the two-readings equations set up; stretch: derive `r = (I₂R₂ − I₁R₁)/(I₁ − I₂)`.

---

### LESSON 03: Series & Parallel Networks, Cell Arrays, Power & Efficiency
- **Folder:** `html/lessons/lesson-03/` · **Duration:** 80 min · **Competences:** L1, L4, L6, L7
- **Guiding question:** Series or parallel for the shop's backup cells, and why does a worn battery run hot?
- **Objectives:**
  1. **01** · Combine resistors in series (`R = ΣR`) and in parallel (`¹⁄R = Σ ¹⁄R`), and reduce a mixed network.
  2. **02** · Find branch currents and potential drops in a series–parallel network.
  3. **03** · Combine cells in series (`E_t = nE`, `r_t = nr`) and identical cells in parallel (`E_t = E`, `r_t = r/n`).
  4. **04** · Calculate electrical energy and power (`P = IV = I²R = V²/R`).
  5. **05** · Calculate source efficiency `η = R/(R + r) = V/E` and read the `P–R` and `η–R` curves.

#### 0. Do Now (`from: 1, 2`)
1. **Q:** What does `V = E − Ir` give? **A:** The terminal p.d. after lost volts. *(Revisit Lesson 2 →)*
2. **Q:** Write the three forms of electrical power. **A:** `P = IV = I²R = V²/R`. *(Revisit Lesson 1 →)*
3. **Q:** Two `6 Ω` resistors in series — total? **A:** `12 Ω`.
4. **Q:** What is the lost power inside a cell carrying current `I`? **A:** `I²r`.

#### 1. Wonder
- **3D Story (`story.js`), Set 1 (workshop):**
  1. `who: "emeka"` — "My shop needs a backup pump. Should I join these three cells in a line, or side by side?"
  2. `who: "tobe"` — "Side by side gives more voltage, obviously." Chinedu frowns.
  3. `who: "nkechi"` — "A low-resistance pump pulls a big current. Series gives more voltage but more internal resistance; parallel keeps the voltage but shares the current and lowers `r`."
  4. `who: "chinedu"` — he notices the worn battery is hot after the test. "Why does it warm up so much?"
  5. `who: "nkechi"` — "Because `I²r` is burned inside it. Let's measure which arrangement wastes least and runs coolest."
- **Wonder Wall prompt:** *For a pump that needs a big current, which cell arrangement delivers the most useful power?* Seeds: "Series, more voltage (Tobe)" · "Parallel, more current (Amara)" · "It depends on the pump's resistance (Chinedu)" · "They're all the same (Ngozi)".

#### 2. Investigate
- **2A Sort (`#sort`):** *Series or parallel behaviour?* Bins (3): `series` · `parallel` · `either/both`. Items (10): same current through every part → series · voltages add up → series · resistances add directly → series · cells here add EMF **and** add `r` → series · same p.d. across every branch → parallel · currents split and add (`I = I₁ + I₂`) → parallel · total resistance is **less** than the smallest branch → parallel · identical cells keep one EMF and give `r/n` → parallel · total current leaves and returns to the source → either/both · energy is conserved round any loop → either/both.
- **2B 3D Practical (`#practical`, scene key: `bench`, `dc-circuit-bench` kit, `network-cells` mode):**
  - **Method cards (4):**
    1. Build the external network (`R₁`, `R₂`, `R₃`) and choose a cell arrangement.
    2. Read the total current, each branch current and the load power.
    3. Switch the cells between series and parallel and compare.
    4. Vary the load `R` and record load power `P` and efficiency `η` to plot their curves.
  - **3D scene (`bench`):** parts `cellA`, `cellB`, `cellC`, `R1`, `R2`, `R3`, `ammeter`, `voltmeter`, `node`. **Controls:** cell preset (default `E = 5.0 V`, `r = 0.5 Ω`, the values behind the P–R and η–R data), cell arrangement (series / parallel), network (series / parallel / mixed pods), load `R`, **Measure**, **Reset**. Readings from the model (`R_eq`, `I`, branch split, `P = I²R`, `η = R/(R+r)`). Emits `l3:bench`, `l3:bench-done` after both cell arrangements and 4 loads.
  - **Results table (`#results-table`):** Setup · `R_eq / Ω` · `I / A` (2 d.p.) · load power `P / W` (2 d.p.) · efficiency `η / %`.
  - **Expected results & graphs (`#expected`), fixed cell `E = 5.0 V`, `r = 0.5 Ω`, via `graph.js`:** load-power points (`R`, `P`) `(0.1, 6.94)`, `(0.5, 12.5)`, `(1.0, 11.1)`, `(2.0, 8.00)`, `(4.0, 4.94)` (from `P = E²R/(R + r)²`) with a **smooth curve of best fit** (`fn`, peak at `R = r = 0.5 Ω`) — **not** a straight line; and efficiency points (`R`, `η`) `(0.1, 16.7)`, `(0.5, 50.0)`, `(1.0, 66.7)`, `(2.0, 80.0)`, `(4.0, 88.9)` with a **smooth curve** rising towards 100 %.
  - **Precautions (past tense):** the key was opened between readings so the cells did not polarise and change `r` · the same cells were used throughout so only the arrangement changed · connections were tight and parallax error was avoided on the meters · each reading was repeated.
  - **Sources of error (with direction):** cells left delivering current polarised and their `r` rose, so the measured efficiency came out **too low** and the current **too low** · the ammeter's own resistance added to the circuit, so the current and load power were slightly **lower** than the model value for that `R` (the ammeter still read the actual current correctly) · a loose branch connection diverted current, so a branch current read **too low**.
  - **Analysis questions (5, locked):** For a low-resistance pump, which cell arrangement gives more current, and why? · Why is a parallel combination's resistance smaller than any one branch? · At what load is the output power greatest? (`R = r`) · Why does maximum power not mean maximum efficiency? · Why does a worn (high-`r`) battery run hot and waste power?

#### 3. Make Sense
- **Series rules (`.callout`):** one path, so the current is the same everywhere; the p.d.s add; `R = R₁ + R₂ + …`. **Parallel rules:** the branches share the same p.d.; the currents add (`I = I₁ + I₂ + …`); `¹⁄R = ¹⁄R₁ + ¹⁄R₂ + …`, and for two branches `R = R₁R₂/(R₁ + R₂)`.
- **Cell arrays (`.callout.big`):** `n` identical cells in **series** give `E_t = nE` and `r_t = nr` (more voltage, more internal resistance). `n` identical cells in **parallel** give `E_t = E` and `r_t = r/n` (same voltage, less internal resistance, so more current for a low-`R` load).
- **Equations (`.eq`):** `R_series = ΣR` · `¹⁄R_parallel = Σ ¹⁄R` · `W = IVt = I²Rt = (V²/R)t` · `P = IV = I²R = V²/R` · `η = R/(R + r) = V/E` (×100 %) · `1 kWh = 1 kW × 1 h = 1 000 W × 3 600 s = 3.6 × 10⁶ J` (a unit of **energy**, not power).
- **Kilowatt-hour on the light bill (one worked line):** one "unit" on a NEPA/PHCN prepaid meter is `1 kWh`. A `750 W` freezer running for `8.0 h` uses `E = Pt = 0.75 kW × 8.0 h = 6.0 kWh` (six units) `= 6.0 × 3.6 × 10⁶ J = 2.16 × 10⁷ J`.
- **Comparison table (`#props-table`):** quantity in series vs parallel — current (same vs splits), p.d. (adds vs same), total `R` (larger vs smaller), cells' EMF (adds vs unchanged), cells' `r` (adds vs `r/n`), best use (high voltage vs high current).
- **Position Explorer (`#pos-explorer`):** tap load pins (`R = 0.1, 0.5, 1.0, 2.0, 4.0 Ω`) for `E = 5.0 V`, `r = 0.5 Ω`; read `I`, load power `P` and efficiency `η`, and see the two curves' markers move (power peaks at `R = r`; efficiency keeps rising).
- **3D Zoom (`#zoom`, scene key: `zoom`):** current splitting at a parallel node (beads dividing by branch resistance and rejoining), and a power-partition bar dividing total power `EI` into useful `I²R` (external) and wasted `I²r` (inside the cell).

#### 4. Apply
- **Worked Example 1 (mixed network — 4 steps):** A battery of EMF `14.0 V` and internal resistance `1.0 Ω` feeds a `3.0 Ω` resistor in series with a parallel pair of `6.0 Ω` and `12.0 Ω`. Find the total current and the current in the `6.0 Ω` branch.
  1. Parallel pair: `R_p = (6.0 × 12.0)/(6.0 + 12.0) = 72/18 = 4.0 Ω`.
  2. External total: `R_ext = 3.0 + 4.0 = 7.0 Ω`.
  3. Total current: `I = E/(R_ext + r) = 14.0/(7.0 + 1.0) = 14.0/8.0 = 1.75 A`.
  4. P.d. across the pair: `V_p = I × R_p = 1.75 × 4.0 = 7.0 V`; so `I₆ = V_p/6.0 = 7.0/6.0 = 1.17 A`.
  - **Answer:** `I = 1.75 A`; `I₆ = 1.17 A`.
- **Worked Example 2 (cell arrays compared — 3 steps):** Four identical cells, each `1.5 V` with `r = 2.0 Ω`, feed a `1.0 Ω` pump. Compare the current when they are all in **parallel** with when they are all in **series**.
  1. Parallel: `E_t = 1.5 V`, `r_t = r/n = 2.0/4 = 0.5 Ω`; `I = 1.5/(1.0 + 0.5) = 1.5/1.5 = 1.0 A`.
  2. Series: `E_t = 4 × 1.5 = 6.0 V`, `r_t = 4 × 2.0 = 8.0 Ω`; `I = 6.0/(1.0 + 8.0) = 6.0/9.0 = 0.67 A`.
  3. Compare: `1.0 A > 0.67 A`, so for this low-resistance pump the **parallel** array delivers the larger current.
  - **Answer:** parallel `1.0 A`; series `0.67 A`; parallel wins here.
- **Worked Example 3 (power and efficiency — 3 steps):** A cell of EMF `5.0 V` and internal resistance `0.5 Ω` drives a `4.5 Ω` load. Find the power delivered to the load and the efficiency.
  1. `I = E/(R + r) = 5.0/(4.5 + 0.5) = 5.0/5.0 = 1.0 A`.
  2. Load power `P = I²R = 1.0² × 4.5 = 4.5 W`; total power `= EI = 5.0 × 1.0 = 5.0 W`.
  3. `η = P/EI × 100 = 4.5/5.0 × 100 = 90 %` (check: `R/(R + r) = 4.5/5.0 = 90 %`).
  - **Answer:** `P = 4.5 W`; `η = 90 %`.
- **The Bridge (`#bridge`):** advise Emeka. For his low-resistance pump the three cells go in **parallel** (same voltage, `r/3`, more current), not in series. And his hot worn battery wastes `I²r` inside — the bigger `r` grew, the more power it burns as heat and the lower its efficiency. `.callout.big#big-idea`: *series stacks voltage, parallel shares current; maximum power transfer happens at `R = r`, but high efficiency needs `R ≫ r`.*
- **Quiz:** 12 questions from `03-questions.md` § Lesson 03.

#### 5. Reflect & Assignment
- **I can (1–4):** combine resistors in series and parallel · find branch currents in a mixed network · combine cells in series and in parallel · calculate power three ways · calculate and interpret efficiency.
- **Exit ticket (2 marks):** A rechargeable lantern battery of internal resistance `0.60 Ω` feeds a `5.4 Ω` LED panel. Find its efficiency. (`η = R/(R + r) × 100 = 5.4/(5.4 + 0.60) × 100 = 5.4/6.0 × 100 = 90 %`.)
- **Recall:** series vs parallel resistor rules · cells series `nE, nr` / parallel `E, r/n` · `P = IV = I²R = V²/R` · `η = R/(R+r)` · power peaks at `R = r`.
- **Assignment:** Part A and Part B from `03-questions.md` § Lesson 03.
- **Teacher notes:** 0–5 Do Now · 5–15 Wonder · 15–45 Investigate · **45–50 movement break** · 50–65 Make Sense · 65–80 Apply and Reflect. Competences: L1 (predict best array), L4 (two curves), L6 (sizing a backup supply), L7 (the worn battery's wasted `I²r`: keeping `r` and cable resistance low, with clean, tight connections, cuts heating losses in solar-battery DC wiring and makes stored energy go further). Support: collapse-the-network worksheet; stretch: prove maximum power at `R = r`.

---

### LESSON 04: Galvanometer Conversion — Ammeter Shunts & Voltmeter Multipliers
- **Folder:** `html/lessons/lesson-04/` · **Duration:** 80 min · **Competences:** L1, L4, L6
- **Guiding question:** How can a 15 mA galvanometer test a 3 A line or a 40 V bank and survive?
- **Objectives:**
  1. **01** · Explain why a sensitive galvanometer cannot directly measure large currents or high voltages.
  2. **02** · Derive and use the shunt formula `R_s = I_g R_g /(I − I_g)` to make an ammeter.
  3. **03** · Derive and use the multiplier formula `R_m = V/I_g − R_g` to make a voltmeter.
  4. **04** · Distinguish the total resistance of a converted meter from the added resistor.
  5. **05** · Explain why an ideal ammeter has low resistance and an ideal voltmeter high resistance.

#### 0. Do Now (`from: 1, 2, 3`)
1. **Q:** In a parallel pair, what is equal across both? **A:** The potential difference. *(Revisit Lesson 3 →)*
2. **Q:** `V = IR`: find `V` across `18 Ω` carrying `15 mA`. **A:** `V = 0.015 × 18 = 0.27 V`. *(Revisit Lesson 1 →)*
3. **Q:** In series, what is the same through both parts? **A:** The current. *(Revisit Lesson 3 →)*
4. **Q:** Convert `8 mA` to amperes. **A:** `8 mA = 0.008 A`.

#### 1. Wonder
- **3D Story (`story.js`), Set 2 (test bench):**
  1. `who: "chinedu"` — he reaches for a small galvanometer to check the `3 A` starter line. Nkechi stops his hand.
  2. `who: "nkechi"` — "That coil takes full-scale deflection at only `15 mA`. Push `3 A` through it and it burns out."
  3. `who: "tobe"` — "So we just buy a bigger meter?" Nkechi smiles.
  4. `who: "nkechi"` — "No. We give most of the current a bypass — a tiny resistor in parallel. The same coil then reads amperes."
  5. `who: "nkechi"` — "And for voltage we add a big resistor in series, so the coil only ever sees `15 mA`. One movement, two instruments."
- **Wonder Wall prompt:** *How do you let a delicate meter measure something far beyond its range without destroying it?* Seeds: "Add resistance (Chinedu)" · "A bypass for the extra current (Amara)" · "Make it stronger (Tobe)" · "You can't (Ngozi)".

#### 2. Investigate
- **2A Sort (`#sort`):** *Ammeter or voltmeter?* Bins (3): `ammeter` · `voltmeter` · `galvanometer-truth`. Items (10): needs a low-resistance **shunt** in parallel → ammeter · connected in **series** with the circuit → ammeter · ideally has very **low** total resistance → ammeter · most of the line current bypasses the coil → ammeter · needs a high-resistance **multiplier** in series → voltmeter · connected in **parallel** across a component → voltmeter · ideally has very **high** total resistance → voltmeter · draws almost no current from the circuit → voltmeter · deflects fully at a tiny current `I_g` → galvanometer-truth · has its own coil resistance `R_g` → galvanometer-truth.
- **2B 3D Practical (`#practical`, scene key: `bench`, `dc-circuit-bench` kit, `galvanometer` mode):**
  - **Method cards (4):**
    1. Note the galvanometer's full-scale current `I_g` and coil resistance `R_g`.
    2. For an ammeter, choose the full-scale current `I`, connect a shunt `R_s` in parallel, and check the split.
    3. For a voltmeter, choose the full-scale voltage `V`, connect a multiplier `R_m` in series, and check the coil current stays at `I_g`.
    4. Test each converted meter on a live circuit and read the deflection.
  - **3D scene (`bench`):** parts `coil`, `pointer`, `shunt`, `multiplier`, `terminals`, `scale`. **Controls:** mode (ammeter shunt / voltmeter multiplier), `I_g`, `R_g`, target `I` or `V`, **Build & test**, **Reset**. Readings from the model: `R_s = I_g R_g/(I − I_g)`; `R_m = V/I_g − R_g`; current split `I_g : (I − I_g)`. Emits `l4:bench`, `l4:bench-done` after one of each conversion.
  - **Results table (`#results-table`):** Conversion · `I_g` or `R_g` · target range · required `R_s` or `R_m` (3 s.f.) · total meter resistance.
  - **Expected results (`#expected`), one coil for both meters (`I_g = 15 mA`, `R_g = 18.0 Ω`):** ammeter: target `3.0 A` → `R_s = 0.0905 Ω` (coil carries `15 mA`, shunt carries `2.985 A`). Voltmeter: target `40 V` → total `R_total = 40/0.015 = 2 667 Ω`, `R_m = 2 667 − 18 = 2 649 Ω ≈ 2 650 Ω` (3 s.f.). Optional graph (`graph.js`): `R_s` against target `I` — a **smooth curve** falling steeply as `I` rises (not a straight line).
  - **Precautions (past tense):** the shunt and multiplier values were calculated before any connection was made so the coil was never overloaded · connections were tight and of negligible resistance for the shunt · the correct terminals and polarity were used · parallax error was avoided when reading the deflection.
  - **Sources of error (with direction):** connection/contact resistance in series with a low-value shunt made the shunt effectively larger, so more of the current went through the coil and the ammeter read **too high** · taking `R_total` as the multiplier (forgetting to subtract `R_g`) made the voltmeter read **too low** · a metal shunt warming up raised its resistance, so (like a larger shunt) it diverted less current away from the coil and the ammeter read **too high**.
  - **Analysis questions (5, locked):** Why must the shunt resistance be very small? · Why must the multiplier resistance be very large? · What fraction of the line current flows through the coil in the ammeter above? (`0.015/3.0 = 0.5 %`) · Why does adding a series multiplier not change the current the coil needs for full scale? · What goes wrong if you use `R_total` as the multiplier?

#### 3. Make Sense
- **Converting to an ammeter (`.callout.big`):** put a small **shunt** `R_s` in parallel with the coil so most of the current bypasses it. Equal p.d. across the parallel pair gives `I_g R_g = (I − I_g)R_s`, so `R_s = I_g R_g/(I − I_g)`. The finished ammeter has a very low resistance and goes in **series**.
- **Converting to a voltmeter (`.callout.big`):** put a large **multiplier** `R_m` in series with the coil so that at full-scale voltage the current is just `I_g`. Then `V = I_g(R_g + R_m)`, so `R_m = V/I_g − R_g`. The finished voltmeter has a very high resistance and goes in **parallel**. Note `R_total = V/I_g` is the whole thing; the resistor you *add* is `R_m = R_total − R_g`.
- **Equations (`.eq`):** `R_s = I_g R_g/(I − I_g)` · `R_m = V/I_g − R_g` · `R_total(voltmeter) = V/I_g` · current split `I_g : (I − I_g)`.
- **Comparison table (`#props-table`):** ammeter vs voltmeter — extra resistor (shunt vs multiplier), its size (very small vs very large), its position (parallel with coil vs series with coil), the meter's connection (series vs parallel), ideal total resistance (low vs high), what it reads (current vs p.d.).
- **Position Explorer (`#pos-explorer`):** tap range pins for a fixed coil (`I_g = 15 mA`, `R_g = 18 Ω`): ammeter targets `1, 2, 3, 5 A` show the required `R_s`; voltmeter targets `5, 10, 40, 150 V` show the required `R_m` and the total resistance.
- **3D Zoom (`#zoom`, scene key: `zoom`):** the moving coil in its radial field with the hairspring and pointer; a thick copper shunt strip carrying ~99 % of the current beside the fine coil, and the tall series multiplier bobbin dropping the extra voltage.

#### 4. Apply
- **Worked Example 1 (ammeter shunt — 3 steps):** A galvanometer of coil resistance `18.0 Ω` gives full-scale deflection at `15 mA`. What shunt turns it into a `3.0 A` ammeter?
  1. Convert the full-scale current: `I_g = 15 mA = 0.015 A`; target `I = 3.0 A`.
  2. `R_s = I_g R_g/(I − I_g) = (0.015 × 18.0)/(3.0 − 0.015)`.
  3. `= 0.270/2.985 = 0.0905 Ω` (3 s.f.) in parallel.
  - **Answer:** `R_s = 0.0905 Ω` (so the coil takes `15 mA` and the shunt the other `2.985 A`).
- **Worked Example 2 (voltmeter multiplier — 3 steps; a second, textbook galvanometer, not Nkechi's):** A galvanometer of coil resistance `25 Ω` and full-scale current `8 mA` is to read up to `40 V`. Find the multiplier.
  1. Convert: `I_g = 8 mA = 0.008 A`.
  2. Total resistance needed: `R_total = V/I_g = 40.0/0.008 = 5 000 Ω`.
  3. Multiplier: `R_m = R_total − R_g = 5 000 − 25 = 4 975 Ω` in series.
  - **Answer:** `R_m = 4 975 Ω` (note: the `5 000 Ω` is the whole meter's resistance, not the resistor you add).
- **Worked Example 3 (find I_g first, then the multiplier — 3 steps):** A galvanometer of coil resistance `40 Ω` reaches full-scale deflection when the p.d. across its coil is `0.10 V`. Convert it to a `25 V` voltmeter.
  1. Full-scale current: `I_g = V_g/R_g = 0.10/40 = 0.0025 A` (2.5 mA).
  2. Total resistance: `R_total = V/I_g = 25.0/0.0025 = 10 000 Ω`.
  3. Multiplier: `R_m = 10 000 − 40 = 9 960 Ω` in series.
  - **Answer:** `R_m = 9 960 Ω`.
- **The Bridge (`#bridge`):** kit out Nkechi's `15 mA`, `18 Ω` galvanometer for the starter test — a `0.0905 Ω` shunt in parallel makes a `3 A` ammeter for the line, and a `2 650 Ω` (2.65 kΩ) multiplier in series on the **same** `15 mA`, `18 Ω` coil makes a `40 V` voltmeter for the bank (`R_m = 40/0.015 − 18 = 2 649 Ω`). One movement, two safe instruments. `.callout.big#big-idea`: *a shunt in parallel diverts current (low-resistance ammeter, in series); a multiplier in series drops voltage (high-resistance voltmeter, in parallel) — and you always subtract `R_g` to get the resistor you add.*
- **Quiz:** 12 questions from `03-questions.md` § Lesson 04.

#### 5. Reflect & Assignment
- **I can (1–4):** say why a galvanometer needs converting · size a shunt for an ammeter · size a multiplier for a voltmeter · tell total resistance from the added resistor · explain ideal ammeter/voltmeter resistance.
- **Exit ticket (2 marks):** A meter-repair shop in Onitsha has a `90 Ω` galvanometer with full-scale current `3.0 mA`. It is to read up to `18 V`. Find the multiplier `R_m`. (`R_total = 18/0.0030 = 6 000 Ω`; `R_m = 6 000 − 90 = 5 910 Ω`, in series.)
- **Recall:** shunt `R_s = I_g R_g/(I − I_g)` · multiplier `R_m = V/I_g − R_g` · ammeter: low `R`, series, shunt · voltmeter: high `R`, parallel, multiplier · subtract `R_g`.
- **Assignment:** Part A and Part B from `03-questions.md` § Lesson 04.
- **Teacher notes:** 0–5 Do Now · 5–15 Wonder · 15–45 Investigate · **45–50 movement break** · 50–65 Make Sense · 65–80 Apply and Reflect. Competences: L1 (reason from the parallel/series rule), L4 (symbols and formulae), L6 (meter repair). Support: give the p.d.-equality starting line; stretch: design a dual-range meter.

---

### LESSON 05: Null Methods — Metre Bridge, Potentiometer & WAEC Practicals
- **Folder:** `html/lessons/lesson-05/` · **Duration:** 80 min · **Competences:** L3, L4, L6
- **Guiding question:** How does the potentiometer still read the true 12.0 V, and how do we measure an unknown coil exactly?
- **Objectives:**
  1. **01** · State the balance condition of a Wheatstone/metre bridge and use `R/S = l/(100 − l)`.
  2. **02** · State the principle of the potentiometer (p.d. proportional to length) and compare EMFs with `E₁/E₂ = l₁/l₂`.
  3. **03** · Find internal resistance by potentiometer, `r = R(l₁ − l₂)/l₂`.
  4. **04** · Explain why the potentiometer measures true EMF (no current drawn at balance) while a voltmeter does not.
  5. **05** · Carry out the WAEC practicals, state precautions in the past tense, and name sources of error with their direction.

#### 0. Do Now (`from: 1, 2, 3, 4`)
1. **Q:** Why does a loaded voltmeter read less than the EMF? **A:** It reads `E − Ir`; current flows, so lost volts appear. *(Revisit Lesson 2 →)*
2. **Q:** For a wire, `R ∝ ?` **A:** `R ∝ L/d²` (length over diameter squared). *(Revisit Lesson 1 →)*
3. **Q:** An ideal voltmeter draws how much current? **A:** Almost none (very high resistance). *(Revisit Lesson 4 →)*
4. **Q:** On a balanced bridge, what flows through the galvanometer? **A:** Zero current (null point).

#### 1. Wonder
- **3D Story (`story.js`), Set 2 (test bench):**
  1. `who: "nkechi"` — she lays Emeka's battery on the bench beside a `100 cm` slide wire. "The voltmeter lied under load. Let's ask the battery without taking any current from it."
  2. `who: "chinedu"` — he slides the jockey; the galvanometer swings one way, then the other.
  3. `who: "nkechi"` — "At the null point, no current flows from the battery, so no lost volts. The balance length tells us its true EMF." She points to the driver: "To balance 12 V on this wire, the driver must be bigger than 12 V — so I use a `24 V` driver (two batteries in series) with a rheostat set so the wire carries `0.150 V` per cm."
  4. `who: "nkechi"` — the needle settles at `80.0 cm`: `E = kl = 0.150 × 80.0 = 12.0 V`. "The EMF is unchanged — the chemistry still pushes a full 12 V. What has risen is the internal resistance: sulphate crust on the plates and corroded terminals add resistance to the path the current must take, without changing the EMF."
  5. `who: "nkechi"` — she clips an unknown coil into the metre bridge. "Same idea, different question: find a resistance exactly by where the bridge balances."
- **Wonder Wall prompt:** *How can you measure a cell's voltage without drawing any current from it?* Seeds: "Balance it against another voltage (Chinedu)" · "Find the no-current point (Amara)" · "Impossible (Tobe)" · "Use a longer wire (Ngozi)".

#### 2. Investigate
- **2A Sort (`#sort`):** *Which null-method statement is true?* Bins (3): `metre-bridge` · `potentiometer` · `both`. Items (10): balances when `R/S = l/(100 − l)` → metre-bridge · compares two resistances → metre-bridge · the slope of `R₂` vs `R₁` gives the square of the diameter ratio → metre-bridge · p.d. along a uniform wire is proportional to length → potentiometer · compares two EMFs by balance lengths → potentiometer · draws no current from the test cell at balance → potentiometer · measures a cell's internal resistance from two lengths → potentiometer · uses a centre-zero galvanometer and a jockey → both · needs tight, clean connections and no wire heating → both · reads the "jockey-off" meter value first (potentiometer practical) → potentiometer.
- **2B 3D Practical (`#practical`, scene key: `bench`, `dc-circuit-bench` kit, `bridge-potentiometer` mode):**
  - **Method cards (4):**
    1. **Metre bridge:** place the standard `R_x` in the left gap and the unknown in the right gap; slide the jockey for the null point `l`; compute `R = R_x(100 − l)/l`.
    2. **Potentiometer:** connect the driver, standard resistor and jockey; for EMF comparison, balance each cell and record its length.
    3. For internal resistance, balance the cell on open circuit (`l₁`), then across a known `R` (`l₂`).
    4. Tabulate to the stated decimals, plot the required graph, and read the slope from a large triangle.
  - **3D scene (`bench`):** parts `slidewire`, `jockey`, `galvanometer`, `leftgap`, `rightgap`, `driver`, `standard`, `scale`. **Controls:** mode (metre bridge / potentiometer), standard value, unknown/test cell, jockey position, **Find balance**, **Reset**. Readings from the model: bridge `R/S = l/(100 − l)`; potentiometer `V = kl`. Emits `l5:bench`, `l5:bench-done` after a bridge balance and a potentiometer balance.
  - **Results table (`#results-table`):** metre bridge — Standard `R_x / Ω` · balance `l / cm` (1 d.p.) · `(100 − l) / cm` · unknown `R / Ω` (2 d.p.). Potentiometer — Cell · balance length `l / cm` (1 d.p.) · deduced `E` or `V`.
  - **Expected results & graph (`#expected`), via `graph.js`:** metre bridge with `R_x = 7.0 Ω` balances at `l = 56.0 cm` → `R = 7.0 × 44.0/56.0 = 5.50 Ω` (the same balance as Worked Example 1); plotting `R₂` (wire B, vertical) against `R₁` (wire A, horizontal) for two wires of the same material and length gives a **straight line through the origin** whose slope is `(d_A/d_B)²`. Potentiometer: `V_AJ` against length `l` is a **straight line through the origin** (`fit: "origin"`), confirming `V ∝ l`; a cell balancing at `75.0 cm` where `k = 0.0200 V cm⁻¹` reads `1.50 V`.
  - **Precautions (past tense):** the plug key was removed immediately after each reading so the wire did not heat and its resistance per cm stayed uniform · the jockey was tapped lightly on the wire, never dragged, so the wire was not thinned · connections were tight and terminals clean · parallax error was avoided when reading the metre rule and the galvanometer scale.
  - **Sources of error (with direction):** current left flowing through the unknown coil warmed it and raised its resistance, so the deduced resistance came out **too high** compared with its cold value (an even warming of the bridge wire itself cancels in the ratio `l/(100 − l)`, so the key was pressed only briefly while seeking balance) · end corrections at the metre-bridge terminals shifted the true zero, so a short balance length read **too low** · a driver cell whose EMF fell during the run lowered the p.d. per cm along the wire, so balance lengths found later were longer and the EMF deduced from them came out **too high**.
  - **Analysis questions (5, locked):** Why is no current drawn from the test cell at balance? · Why does that let the potentiometer read the true EMF when a voltmeter cannot? · Why must the bridge wire be uniform? · In the driver circuit, why isn't the whole driver EMF across the wire? · Why tap, not drag, the jockey?

#### 3. Make Sense
- **Metre bridge (`.callout.big`):** a Wheatstone bridge balances (galvanometer current zero) when `R₁/R₂ = R₃/R₄`. On a uniform `100 cm` wire with balance length `l` from the left, `R_left/R_right = l/(100 − l)`, so an unknown `R = R_x(100 − l)/l`.
- **Potentiometer (`.callout.big`):** a steady current in a uniform wire makes the p.d. across any length proportional to that length, `V = kl`. Because the balanced cell passes no current, no lost volts arise inside it and its full EMF is read off: `E₁/E₂ = l₁/l₂`. Internal resistance by two lengths: `r = R(l₁ − l₂)/l₂`.
- **Equations (`.eq`):** `R/S = l/(100 − l)` · `V = kl` · `E₁/E₂ = l₁/l₂` · `r = R(l₁ − l₂)/l₂` · driver share `V_wire = E₀ × R_wire/(R_wire + R_series)`.
- **Comparison table (`#props-table`):** voltmeter vs potentiometer for measuring a cell — current drawn (some vs none at balance), lost volts (yes vs no), what it reads (terminal p.d. `E − Ir` vs true EMF `E`), accuracy (limited by its resistance vs high, null method), needs calibration driver (no vs yes).
- **Position Explorer (`#pos-explorer`):** tap length pins along the `100 cm` wire (`k = 0.0200 V cm⁻¹`) to read the p.d. at each length (confirming `V ∝ l`), and tap the two internal-resistance lengths (`l₁ = 75.0`, `l₂ = 60.0 cm`, `R = 3.0 Ω`) to see `r` build up.
- **3D Zoom (`#zoom`, scene key: `zoom`):** the potential falling steadily along the slide wire as a sloping ramp; the jockey point rises and falls until the ramp height equals the test cell's EMF, and the galvanometer current fades to zero at the null point.

#### 4. Apply
- **Worked Example 1 (metre bridge, then resistivity from a measured diameter — 4 steps):** Chinedu puts a `7.0 Ω` standard in the left gap and Emeka's spare coil in the right gap; the galvanometer reads zero at `l = 56.0 cm`. (a) Find the coil's resistance. (b) The coil is `1.25 m` of wire whose diameter, measured with a micrometer screw gauge, is `0.36 mm`. Find the resistivity of the wire.
  1. `R_left/R_right = l/(100 − l)` → `7.0/R = 56.0/44.0`.
  2. `R = 7.0 × 44.0/56.0 = 5.50 Ω`.
  3. Area from the diameter: `A = πd²/4 = π × (3.6 × 10⁻⁴)²/4 = 1.018 × 10⁻⁷ m²` (keep 4 s.f. until the end).
  4. `ρ = RA/L = (5.50 × 1.018 × 10⁻⁷)/1.25 = 4.48 × 10⁻⁷ Ω m`.
  - **Answer:** `R = 5.50 Ω`; `ρ = 4.48 × 10⁻⁷ Ω m` (≈ `4.5 × 10⁻⁷ Ω m` to 2 s.f.).
- **Worked Example 2 (potentiometer driver circuit — 3 steps):** A `100 cm` potentiometer wire of resistance `5.0 Ω` is in series with a `2.0 V` driver cell (negligible internal resistance) and a `15.0 Ω` resistor. (a) Find the current in the wire. (b) Find the p.d. across the whole wire. (c) At what length does a `0.040 V` source balance?
  1. `I = E₀/(R_wire + R_series) = 2.0/(5.0 + 15.0) = 2.0/20.0 = 0.10 A`.
  2. `V_wire = I × R_wire = 0.10 × 5.0 = 0.50 V`, so `k = 0.50/100 = 0.0050 V cm⁻¹`.
  3. `l = V/k = 0.040/0.0050 = 8.0 cm`.
  - **Answer:** `I = 0.10 A`; `V_wire = 0.50 V`; balance at `l = 8.0 cm`. (Trap: the full `2.0 V` is **not** across the wire — only `0.50 V` is.)
- **Worked Example 3 (internal resistance by potentiometer — 3 steps):** A cell balances at `l₁ = 75.0 cm` on open circuit. With a `3.0 Ω` resistor connected across it, the balance falls to `l₂ = 60.0 cm`. Find the internal resistance.
  1. Open circuit gives `E ∝ l₁`; on load the terminal p.d. gives `V ∝ l₂`, and `r = R(l₁ − l₂)/l₂`.
  2. Substitute: `r = 3.0 × (75.0 − 60.0)/60.0`.
  3. `= 3.0 × 15.0/60.0 = 3.0 × 0.25 = 0.75 Ω`.
  - **Answer:** `r = 0.75 Ω`.
- **The Bridge (`#bridge`, mystery solved):** balance Emeka's battery on the potentiometer. No current is drawn, so no lost volts, and it balances at the full `12.0 V` (`80.0 cm` at `0.150 V cm⁻¹` from the `24 V` driver). The verdict from the whole unit: **EMF unchanged; internal resistance risen** (sulphated plates and corroded terminals add resistance in the current's path but do not change the cell's chemical push), so under the starter test load's `3.0 A` it drops `Ir = 3.6 V` and the terminals sag to `8.4 V`. Clean the terminals, recharge and re-test `r`, and replace the battery only if `r` stays high. `.callout.big#big-idea`: *a null method draws no current, so it reads the true EMF; a voltmeter under load always reads `E − Ir`.*
- **Quiz:** 12 questions from `03-questions.md` § Lesson 05.

#### 5. Reflect & Assignment
- **I can (1–4):** use the metre-bridge balance condition · compare EMFs on a potentiometer · find internal resistance by two lengths · explain why a null method reads true EMF · state precautions and name errors with their direction.
- **Exit ticket (2 marks):** On a metre bridge a `12.0 Ω` standard in the left gap balances at `l = 64.0 cm`. Find the right-gap resistance. (`12.0/R = 64.0/36.0`, so `R = 12.0 × 36.0/64.0 = 6.75 Ω`.)
- **Recall:** `R/S = l/(100 − l)` · `V = kl`, `E₁/E₂ = l₁/l₂` · `r = R(l₁ − l₂)/l₂` · null = no current = true EMF · driver share `V_wire = E₀ R_wire/(R_wire + R_series)`.
- **Assignment:** Part A and Part B from `03-questions.md` § Lesson 05.
- **Teacher notes:** 0–5 Do Now · 5–15 Wonder · 15–45 Investigate · **45–50 movement break** · 50–65 Make Sense · 65–80 Apply and Reflect. Competences: L3 (safe bench practice), L4 (tables, graphs, slope triangles), L6 (precision measurement). Support: pre-labelled bridge diagram; stretch: derive `r = R(l₁ − l₂)/l₂` from `E ∝ l₁`, `V ∝ l₂`.

---

## 6. Narrator Choreography Blueprint (`window.NARRATION`)
- **Welcome Hub (`welcome-narration.js`):** 11 steps — hero title → 3D Hero Lab (`ohms-law`, `internal-resistance`, `null` modes) → mystery case file (the 12.0 → 8.4 V collapse) → journey cards → explorer tabs (ohmic/non-ohmic, V = E − Ir, P–R & η–R curves, V = kl) → archetypes → myths → method → finale CTA. Nigerian English (`en-NG`) voice ranked #1.
- **Each lesson (`lessons/lesson-0X/narration.js`, 26–28 steps):** hero → Do Now (wait `donow`) → story playback (`story:0`–`story:4`) → Wonder Wall (wait `note`) → sort (wait `sort`) → bench (`bench.setMode`, demo `action`, wait `lX:bench-done`) → results table and graph → concepts and `.eq` → Position Explorer (`#pos-explorer`) → 3D zoom (`zoom.setMode`) → worked examples → explainer video (Lessons 02, 03, 04) → The Bridge (wait `bridge`) → quiz (wait `quiz`) → reflect and assignment. Chapters: `Welcome`, `Do Now`, `The Story`, `Wonder Wall`, `Sort Game`, `Virtual Lab`, `Make Sense`, `Zoom`, `Worked Examples`, `Solving the Mystery`, `Quiz & Reflection`. Each spotlights named 3D parts (e.g. `cell`, `voltmeter`, `shunt`, `jockey`) and pauses with "Your turn!" at every `wait`.

---

## 7. Explainer Video Plan
video_cap: 3

Scored with `references/video-criteria.md`; each score equals the sum of its reasons. All five lessons reach the threshold (≥ 5); the cap of 3 keeps the top three (Lessons 02, 04, 03), dropping Lessons 01 and 05.

| lesson | score | recommend | reasons | video would cover |
|---|---|---|---|---|
| lesson-01 | 5 | yes | +3 multi-step calculations · +2 frequently examined · +2 invisible mechanism · +1 graph reading · −3 practical-led | Ohm's law, `R ∝ L/d²`, resistivity and slope-as-resistance — but the V–I bench already shows it live, so it is dropped by the cap · kits: graph, circuit |
| lesson-02 | 10 | yes | +3 multi-step calculations · +2 frequently examined · +2 misconception · +2 invisible mechanism · +1 graph reading | lost volts, `E = I(R + r)`, why a voltmeter ≠ EMF under load, finding `E` and `r` from a V–I graph, two worked examples · kits: cell, circuit, toll, graph |
| lesson-03 | 9 | yes | +3 multi-step calculations · +2 frequently examined · +2 misconception · +1 graph reading · +1 staged process | collapsing a mixed network, series vs parallel cells, power and the η–R / P–R curves · kits: graph, circuit; KIT GAP: network-builder (on the fly) |
| lesson-04 | 10 | yes | +3 multi-step calculations · +2 frequently examined · +2 misconception · +2 invisible mechanism · +1 derivation | shunt and multiplier design, current split in the meter, total vs added resistance · kits: circuit; KIT GAP: galvanometer-conversion (on the fly) |
| lesson-05 | 6 | yes | +3 multi-step calculations · +2 frequently examined · +2 misconception · +1 graph reading · +1 staged process · −3 practical-led | the null method, metre bridge and potentiometer, why it reads true EMF — but the dual bench teaches it hands-on, so it is dropped by the cap · kits: graph, circuit |
