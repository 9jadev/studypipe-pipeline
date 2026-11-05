# 01 — Topic Map: Ohm's Law & Current Electricity (`ss2-phy-ohms-law-circuits`)

## 1. Syllabus & Target Audience
- **Subject:** Physics
- **Level:** Senior Secondary 2 (SS2) / Exam Prep (SS3)
- **Syllabuses Covered:**
  - **WAEC WASSCE Physics:** Section IV (Electricity & Magnetism) — Electric current, potential difference, electromotive force (e.m.f.), Ohm's law, resistance, series and parallel circuits, internal resistance of cells, electrical energy and power, resistivity and conductivity, shunt and multiplier (galvanometer conversion), Wheatstone bridge, metre bridge, and potentiometer; plus **Paper 3 (Practical Physics)** electricity experiments.
  - **NECO SSCE Physics:** Current electricity, circuit networks, cell arrangements, bridge and null-deflection measurements, and practical electricity tables/graphs.
  - **JAMB UTME Physics:** Current electricity — Ohm's law, series/parallel combinations, EMF and internal resistance, power and cell efficiency, ammeter/voltmeter conversion, metre bridge, and potentiometer calculations.

---

## 2. Paraphrasing & Originality Commitment
All definitions, explanations, Nigerian phenomena, worked examples, and assessment items in this unit are **100% originally authored and paraphrased**. No sentences, problem stems, or numerical setups are copied verbatim from the uploaded past-question source bank or any textbook. Every calculation archetype and practical paradigm identified in the syllabus is taught through fresh Nigerian contexts and newly constructed numbers.

---

## 3. Unit-Wide Nigerian Phenomenon & Mystery Thread
- **The Case File:** *The Aba Tailoring Workshop & Keke Battery Drop*
  - At **Chinedu's Garment & Auto-Electric Workshop on Ngwa Road, Aba**, an apprentice measures a newly charged $12.0\text{ V}$ lead-acid battery with a digital voltmeter while nothing is connected: it reads a healthy **$12.0\text{ V}$**.
  - Yet the moment he flips the main workshop changeover switch to crank the starter motor or run the low-resistance pressing iron heater, the cabin roof lamp dims dramatically and the voltmeter across the battery terminals plunges to **$8.4\text{ V}$**!
  - Even stranger: when his boss, **Engr. Nkechi**, measures the same battery on a **100 cm potentiometer wire** at the test bench, the balance point gives the full **$12.0\text{ V}$** with zero voltage drop.
- **Driving Unit Question:** *Where do the missing $3.6\text{ V}$ disappear to when current flows, how do series and parallel networks split current and voltage, how can a delicate $10\text{ mA}$ galvanometer measure $10\text{ A}$ or $150\text{ V}$ without burning out, and why does a potentiometer measure true EMF when a voltmeter fails?*

---

## 4. Transversal Competences (`L1`–`L7`) Across the Unit
- **`L1` Thinking & Learning to Learn:** Formulating hypotheses about hidden internal resistance ($r$), testing predictions on 3D circuit benches, and interpreting linear slopes and intercepts ($V$ vs $I$, $R_2$ vs $R_1$).
- **`L2` Cultural Competence, Interaction & Self-Expression:** Connecting physics principles to Nigerian artisanal workshops (Aba auto-electricians, Onitsha electronics markets, Alaba solar/battery installers, school physics labs) and articulating past-tense experimental precautions clearly.
- **`L3` Taking Care of Oneself & Managing Daily Life:** Calculating household appliance power ratings ($P = IV$), avoiding overloaded extension sockets, and recognizing when high battery internal resistance causes heat waste.
- **`L4` Multiliteracy:** Translating fluently between 3D physical circuit benches, standard schematic symbols, algebraic equations, and plotted linear graphs ($V$–$I$, $R_2$–$R_1$, $1/I$–$l$).
- **`L5` ICT Competence:** Operating interactive 3D circuit simulations, virtual ammeters/voltmeters, sliding rheostats, and null-balance jockeys.
- **`L6` Working Life & Entrepreneurship:** Diagnosing sulphated batteries vs wiring drops, sizing shunt/multiplier resistors in meter repair, and evaluating cell efficiency ($\eta = \frac{R}{R+r} \times 100\%$).
- **`L7` Participation, Involvement & Building a Sustainable Future:** Minimising $I^2r$ Joule heating losses in solar-inverter DC cabling by selecting proper wire cross-sectional area ($A$) and low-resistivity copper ($\rho = RA/L$).

---

## 5. Multi-Lesson Unit Architecture (Welcome Hub + 5 Progressive Lessons)

### Unit Welcome Hub (`html/index.html`)
- **3D Hero Lab (`#lab-canvas`):** Interactive 3D DC Circuit & Internal Resistance Bench (`StudyLab`) featuring a lead-acid cell ($E$, $r$), brass plug key, sliding rheostat load $R$, analogue series ammeter, parallel voltmeter, and animated electron-drift beads.
- **01 / The Unit Mystery (`#mystery`):** The Aba Workshop $12.0\text{ V} \to 8.4\text{ V}$ voltage collapse case file + WAEC/NECO/JAMB exam weight breakdown.
- **02 / The 5-Lesson Journey (`#journey`):** Interactive cards linking to Lessons 01–05.
- **03 / Interactive Concept Explorer (`#explorer`):** 4-tab live SVG curve explorer (*1. Ohmic vs Non-Ohmic $I$–$V$*, *2. Terminal P.D. $V = E - Ir$ Line*, *3. Cell Efficiency $\eta$ vs Load Ratio $R/r$*, *4. Potentiometer & Metre Bridge Null Balance*).
- **04 / What You'll Master, 6 Exam Archetypes & 3 Myth-Busters (`#master`, `#archetypes`, `#myths`):** Overview of the 6 core calculation patterns and 3 interactive flip cards busting classic student misconceptions.
- **05 / How We Learn (`#method`, `#kit`, `.finale`):** Overview of the 5-phase inquiry loop and launch button into Lesson 01.

---

### Lesson 01: Ohm's Law, Metallic Conduction & Wire Resistivity (`html/lessons/lesson-01/`)
- **Core Concepts:**
  1. Electric current $I = Q/t$ (conventional current vs electron drift) and potential difference $V = W/Q$.
  2. Ohm's Law: $V \propto I$ at constant temperature and physical conditions ($V = IR$).
  3. Ohmic conductors (constantan, manganin, copper at constant $T$) vs non-ohmic devices (filament lamp, semiconductor diode, electrolyte).
  4. Factors affecting resistance of a uniform wire: length $L$, cross-sectional area $A = \pi d^2/4$, material resistivity $\rho$ ($R = \frac{\rho L}{A}$, so $R \propto \frac{L}{d^2}$), and temperature.
  5. **WAEC Paper 3 Practical 3 (Ohm's Law $V$–$I$ Graph):** Ammeter in series, voltmeter in parallel across constantan resistance wire, rheostat in series, key removed between readings to prevent heating; slope of $V$ against $I$ equals $R$.
- **3D Interactive Stages:**
  - `story.js`: Aba workshop apprentice testing thin vs thick copper jumper cables and watching a filament bulb heat up.
  - `bench.js`: 3D Ohm's Law & Resistivity Bench — adjust wire length $L$ ($20\text{–}100\text{ cm}$), wire diameter $d$ ($0.3\text{–}1.2\text{ mm}$), material ($\text{Copper}$, $\text{Constantan}$, $\text{Nichrome}$), and rheostat slider to plot $V$ vs $I$.
  - `zoom.js`: 3D Atomic Lattice Drift Zoom — drifting free electrons colliding with vibrating metal ions as temperature or electric field changes.

---

### Lesson 02: EMF, Terminal P.D., Lost Volts & Internal Resistance (`html/lessons/lesson-02/`)
- **Core Concepts:**
  1. Electromotive force ($E$): total electrical energy supplied per coulomb by the source ($E = W_{\text{total}}/Q$), measured on open circuit ($I = 0$).
  2. Internal resistance ($r$): opposition offered by the electrolyte and electrodes inside the cell itself.
  3. Complete circuit equation: $E = V + v = IR + Ir = I(R + r)$.
  4. Terminal potential difference ($V = IR = E - Ir$) and lost volts ($v = Ir$).
  5. **"Two Readings, Same Cell" Archetype:** When load $R_1$ draws $I_1$ and load $R_2$ draws $I_2$ from the same cell, $E = I_1(R_1 + r) = I_2(R_2 + r) \implies r = \frac{I_2 R_2 - I_1 R_1}{I_1 - I_2}$.
  6. Graphical determination of $E$ and $r$: plotting terminal p.d. $V$ on the vertical axis against current $I$ on the horizontal axis yields a straight line $V = -rI + E$ with vertical intercept $E$ and gradient $-r$.
- **3D Interactive Stages:**
  - `story.js`: Chinedu's $12.0\text{ V}$ battery dropping to $8.4\text{ V}$ under a $2.8\,\Omega$ starter load in Aba.
  - `bench.js`: 3D Internal Resistance & Lost Volts Lab — toggle the brass plug key (open circuit $V = E$ vs closed circuit $V = E - Ir$), adjust external load $R$ and cell internal resistance $r$, and watch the live $V$–$I$ straight-line graph plot its intercept $E$ and negative slope $-r$.
  - `zoom.js`: 3D Inside the Cell Electrolyte Zoom — ions migrating through battery acid between lead plates, showing energy dissipated as internal heat ($Ir$ lost volts) before charges ever reach the external brass terminals.

---

### Lesson 03: Series & Parallel Networks, Cell Arrays, Power & Efficiency (`html/lessons/lesson-03/`)
- **Core Concepts:**
  1. Resistors in series: same current $I$ through each, voltages add ($V = V_1 + V_2 + \dots$), $R_{\text{eq}} = R_1 + R_2 + \dots$
  2. Resistors in parallel: same p.d. $V$ across each branch, currents split inversely with resistance ($I_1/I_2 = R_2/R_1$), $\frac{1}{R_{\text{eq}}} = \frac{1}{R_1} + \frac{1}{R_2} + \dots$, and for two branches $R_{\text{eq}} = \frac{R_1 R_2}{R_1 + R_2}$.
  3. Series-parallel combination networks: collapsing parallel pods first, then adding series resistors, then working backwards to find branch currents and potential drops.
  4. Cells in series ($E_{\text{total}} = nE$, $r_{\text{total}} = nr$ for aiding cells; opposing cell subtracts $E$ but still adds $r$!) vs **identical cells in parallel** ($E_{\text{total}} = E$, $r_{\text{total}} = \frac{r}{n}$).
  5. Electrical energy ($W = IVt = I^2Rt = \frac{V^2}{R}t$) and power ($P = IV = I^2R = \frac{V^2}{R}$).
  6. Cell efficiency: $\eta = \frac{\text{Useful power in external load}}{\text{Total power generated by cell}} \times 100\% = \frac{I^2 R}{I^2(R + r)} \times 100\% = \frac{R}{R + r} \times 100\% = \frac{V}{E} \times 100\%$.
- **3D Interactive Stages:**
  - `story.js`: Solar-inverter technician in Surulere choosing between wiring three $2.0\text{ V}$ cells in series vs in parallel to power a low-resistance DC water pump.
  - `bench.js`: 3D Network & Cell Array Builder — switch between Series Cells, Parallel Cells, and Mixed Resistor Pods ($R_1, R_2, R_3$), measuring total current $I$, branch currents, load power $P_{\text{load}}$, wasted internal power $P_{\text{lost}}$, and cell efficiency $\eta$.
  - `zoom.js`: 3D Hydraulic-Electric Junction & Efficiency Zoom — visualizing current splitting at a parallel node ($I = I_1 + I_2$) and power partitioning between external load $R$ and internal resistance $r$.

---

### Lesson 04: Galvanometer Conversion — Ammeter Shunts & Voltmeter Multipliers (`html/lessons/lesson-04/`)
- **Core Concepts:**
  1. Why a sensitive moving-coil galvanometer (e.g. full-scale deflection current $I_g = 5\text{–}20\text{ mA}$, coil resistance $R_g = 5\text{–}50\,\Omega$) cannot directly measure large currents ($5\text{–}10\text{ A}$) or high voltages ($50\text{–}250\text{ V}$).
  2. **Converting a Galvanometer to an Ammeter (Shunt $R_s$):**
     - Connect a very low-resistance **shunt ($R_s$)** in **parallel** with the galvanometer so that most of the line current ($I - I_g$) bypasses the delicate coil.
     - Parallel voltage equality: $V_g = V_s \implies I_g R_g = (I - I_g) R_s \implies R_s = \frac{I_g R_g}{I - I_g}$.
     - Ideal ammeter has very low total resistance so it does not reduce the circuit current when connected in series.
  3. **Converting a Galvanometer to a Voltmeter (Multiplier $R_m$):**
     - Connect a very high-resistance **multiplier ($R_m$)** in **series** with the galvanometer so that at full-scale voltage $V$, the current does not exceed $I_g$.
     - Series voltage equation: $V = I_g(R_g + R_m) \implies R_m = \frac{V}{I_g} - R_g$.
     - **Exam Trap Alert:** Distinguish between *total resistance of the converted voltmeter* ($R_{\text{total}} = V/I_g = R_g + R_m$) and the *additional series multiplier resistance required* ($R_m = R_{\text{total}} - R_g$).
- **3D Interactive Stages:**
  - `story.js`: Instrument repair technician at Onitsha Head Bridge market rescuing a student's $10\text{ mA}$ galvanometer from burning out on a $5\text{ A}$ generator line.
  - `bench.js`: 3D Galvanometer Conversion Bench — toggle between **Ammeter Mode (Parallel Shunt $R_s$)** and **Voltmeter Mode (Series Multiplier $R_m$)**, dial the target full-scale range ($I$ or $V$), and test the converted meter on a live circuit with needle deflection and current-split readouts.
  - `zoom.js`: 3D Moving-Coil & Current Bypass Zoom — close-up of the hairspring, pointer, and radial magnetic field alongside the thick copper shunt strip carrying $99\%$ of the current vs the fine series multiplier bobbin dropping excess voltage.

---

### Lesson 05: Null-Balance Precision — Metre Bridge, Potentiometer & WAEC Practicals (`html/lessons/lesson-05/`)
- **Core Concepts:**
  1. **Wheatstone Bridge & Metre Bridge:**
     - Four-resistor diamond network balanced when potential at the two middle junctions is equal ($I_g = 0$): $\frac{R_1}{R_2} = \frac{R_3}{R_4}$.
     - On a $100\text{ cm}$ uniform constantan metre bridge wire: $\frac{R_{\text{left}}}{R_{\text{right}}} = \frac{l}{100 - l} \implies R_{\text{right}} = R_{\text{left}}\left(\frac{100 - l}{l}\right)$.
  2. **WAEC Paper 3 Practical 1 (Metre Bridge Comparison of Two Wires $A$ and $B$):**
     - Standard resistor $R_x = 1.0\,\Omega$ in left gap; test wire of length $L = 100, 95, 85, 75, 65\text{ cm}$ in right gap.
     - Plotting wire resistance $R_2$ against $R_1$ yields slope $s = \frac{R_2}{R_1} = \left(\frac{d_1}{d_2}\right)^2$, so diameter ratio $\sqrt{s} = \frac{d_1}{d_2}$.
  3. **Potentiometer Principle & Calculations:**
     - Uniform slide wire driven by an accumulator $E_0$: potential drop per unit length $k = V_{\text{AB}}/100$ is constant ($V \propto l$).
     - Comparing two cells: $\frac{E_1}{E_2} = \frac{l_1}{l_2}$.
     - **Why a Potentiometer Beats a Voltmeter:** At the null balance point ($I_g = 0$), **zero current** is drawn from the test cell, so internal resistance $r$ causes zero lost volts ($Ir = 0$) and true open-circuit EMF $E$ is measured!
     - **Driver Circuit Series Resistor Trap:** If the driver cell $E_0$ is in series with an external resistor $R_{\text{ext}}$ and potentiometer wire resistance $R_p$, first find total potential drop across the wire $V_{\text{AB}} = E_0 \left(\frac{R_p}{R_p + R_{\text{ext}}}\right)$, then $E_{\text{test}} = \frac{l}{100} V_{\text{AB}}$.
     - Internal resistance by potentiometer: open-circuit balance length $l_1$ ($E \propto l_1$) and shunted balance length $l_2$ across load $R$ ($V \propto l_2$) give $r = R\left(\frac{l_1 - l_2}{l_2}\right)$.
  4. **WAEC Paper 3 Practical 2 & Standard Precautions:**
     - Potentiometer tables ($l$, $l^{-1}$, $I$, $I^{-1}$, $V$) and past-tense precautions acceptable to WAEC examiners (*"I ensured tight and clean electrical connections"*, *"I removed the plug key immediately after each reading to prevent heating of the wire"*, *"I tapped the jockey lightly on the wire instead of scraping it so the cross-sectional area remained uniform"*, *"I avoided parallax error when reading the metre rule and ammeter/galvanometer"*).
- **3D Interactive Stages:**
  - `story.js`: Engr. Nkechi resolving the Aba workshop battery mystery on a $100\text{ cm}$ mahogany potentiometer board where $I_g = 0$ reveals the true $12.0\text{ V}$ EMF.
  - `bench.js`: 3D Dual Metre Bridge & Potentiometer Bench — slide the brass jockey along the $100\text{ cm}$ constantan wire, watch the centre-zero galvanometer needle swing from negative through zero (`NULL BALANCE!`) to positive, switch between **Metre Bridge Mode** and **Potentiometer Mode**, and record WAEC practical readings.
  - `zoom.js`: 3D Null-Point Potential Gradient Zoom — comparing the potential slope along the slide wire with the test cell's EMF until both potentials match and galvanometer current drops to zero.

---

## 6. Spaced Retrieval Map (`retrieval-bank.js`)
Every lesson starts with a **Phase 0: Do Now** pulling 3 quick questions from earlier lessons or foundational prerequisites:
- **Lesson 01 Pool:** Charge/current definition ($I = Q/t$), Ohm's law $V = IR$, resistivity proportionality $R \propto L/d^2$.
- **Lesson 02 Pool:** Terminal p.d. $V = E - Ir$, lost volts $Ir$, slope and intercept of $V$–$I$ graph, plus retrieval from Lesson 01.
- **Lesson 03 Pool:** Parallel cells EMF ($E_{\text{tot}} = E$, $r_{\text{tot}} = r/n$), current divider, cell efficiency $\eta = R/(R+r)$, plus retrieval from Lessons 01–02.
- **Lesson 04 Pool:** Shunt formula $R_s = I_g R_g/(I - I_g)$, multiplier formula $R_m = (V/I_g) - R_g$, total vs added resistance, plus retrieval from Lessons 01–03.
- **Lesson 05 Pool:** Metre bridge $R_1/R_2 = l/(100-l)$, potentiometer $E_1/E_2 = l_1/l_2$, null-point zero current reason, WAEC past-tense precautions, plus retrieval from Lessons 01–04.
