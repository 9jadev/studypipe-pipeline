# 02 — Multi-Lesson Unit Plan: Ohm's Law & Current Electricity (`ss2-phy-ohms-law-circuits`)

## Unit Overview & Design Philosophy
- **Unit Title:** Ohm's Law, Circuit Networks & Electrical Measurements
- **Target Level:** SS2 / SS3 Physics (WAEC WASSCE, NECO SSCE, JAMB UTME)
- **Structure:** Unit Welcome Hub (`html/index.html`) + 5 Progressive 5-Phase Inquiry Lessons (`html/lessons/lesson-01/` … `lesson-05/`)
- **Inquiry Standard:** Every lesson follows the 5-phase phenomenon-based inquiry cycle (*0. Do Now → 1. Wonder → 2. Investigate → 3. Make sense → 4. Apply → 5. Reflect & Assignment*), weaving in 7 Transversal Competences (`L1`–`L7`), a 5-minute active movement break at the 45-minute midpoint, low-stakes self-rating (`1–4`), and locked-until-attempted solutions.
- **Originality Note:** 100% of explanations, definitions, Nigerian scenarios, worked examples, and questions are newly written and paraphrased.

---

## Part 0: Unit Welcome Hub (`html/index.html`)

### Hero & 3D Interactive Circuit Bench (`#lab-canvas`)
- **Headline:** *Why does a 12 V battery drop to 8.4 V the instant you crank the engine?*
- **3D Stage (`StudyLab`):**
  - A mahogany physics bench carrying a **lead-acid accumulator cell** ($E = 12.0\text{ V}$, adjustable internal resistance $r$), a **brass plug key**, a **sliding constantan rheostat** ($R = 1.0\text{–}20.0\,\Omega$), a **series analogue ammeter**, and a **parallel voltmeter** wired across the cell terminals, plus glowing cyan charge-carrier spheres drifting around the copper loop.
  - **Controls:**
    1. `Plug Key`: Open Circuit ($I = 0$) vs Closed Circuit ($I = E/(R+r)$)
    2. `External Load R (Ω)`: $1.0\,\Omega$ to $20.0\,\Omega$
    3. `Internal Resistance r (Ω)`: $0.2\,\Omega$ to $3.0\,\Omega$
    4. `Camera Preset`: Bench Overview / Cell & Voltmeter / Rheostat & Ammeter
  - **Live Readouts:** Open-circuit EMF $E$, Current $I$, Terminal P.D. $V = IR$, Lost Volts $v = Ir$, and Cell Efficiency $\eta = \frac{R}{R+r} \times 100\%$.

### 01 / The Unit Mystery (`#mystery`)
- **Case File:** At **Chinedu's Auto-Electric & Tailoring Workshop on Ngwa Road, Aba**, a newly charged $12.0\text{ V}$ battery reads $12.0\text{ V}$ when idle. When the $2.8\,\Omega$ starter motor is engaged, the cabin lamp dims and the terminal voltage plunges to $8.4\text{ V}$. Yet when **Engr. Nkechi** tests the same battery on a **100 cm potentiometer wire**, the null-balance point reveals the full $12.0\text{ V}$ without losing a single millivolt.
- **Exam Weight Cards:**
  - `3–5 MCQs` in every WAEC & JAMB Physics paper
  - `1 Compulsory` WAEC Paper 3 Electricity Practical (Metre Bridge, Potentiometer, or Ohm's Law $V$–$I$ graph)
  - `6 Archetypes` that cover $>90\%$ of calculation marks

### 02 / The 5-Lesson Journey (`#journey`)
1. **Lesson 01:** *Ohm's Law, Metallic Conduction & Wire Resistivity* ($V = IR$, $R = \rho L/A$, Paper 3 $V$–$I$ graph)
2. **Lesson 02:** *EMF, Terminal P.D., Lost Volts & Internal Resistance* ($E = I(R+r)$, $V = E - Ir$, two-readings method)
3. **Lesson 03:** *Series & Parallel Networks, Cell Arrays, Power & Efficiency* ($R_{\text{eq}}$, parallel cells $E, r/n$, $\eta = R/(R+r)$)
4. **Lesson 04:** *Galvanometer Conversion — Ammeter Shunts & Voltmeter Multipliers* ($R_s = I_g R_g/(I - I_g)$, $R_m = (V/I_g) - R_g$)
5. **Lesson 05:** *Null-Balance Precision — Metre Bridge, Potentiometer & WAEC Practicals* ($R_1/R_2 = l/(100-l)$, $E_1/E_2 = l_1/l_2$, WAEC precautions)

### 03 / Interactive Concept Explorer (`#explorer`)
- **Tab 1:** *Ohmic vs Filament Lamp $I$–$V$ Curve* (linear constantan slope vs curving tungsten filament as $T$ rises)
- **Tab 2:** *Terminal Voltage Drop ($V = E - Ir$)* (straight line with vertical intercept $E$ and negative gradient $-r$)
- **Tab 3:** *Cell Efficiency vs Load Ratio ($\eta = \frac{R}{R+r}$)* (showing $\eta = 50\%$ at $R = r$ and $\eta \to 100\%$ as $R \gg r$)
- **Tab 4:** *Potentiometer Null Balance ($I_g = 0$)* (potential gradient $k = V_{\text{AB}}/100$ matching test EMF at balance length $l$)

### 04 / 6 Calculation Archetypes & 3 Myth-Buster Flip Cards (`#archetypes`, `#myths`)
- **6 Archetypes:**
  1. Wire Resistivity & Diameter Scaling ($R \propto L/d^2$)
  2. Internal Resistance from Two Load Readings ($I_1(R_1 + r) = I_2(R_2 + r)$)
  3. Parallel Cells vs Series Cells ($E_{\text{parallel}} = E$, $r_{\text{parallel}} = r/n$)
  4. Cell Efficiency & Power Dissipation ($\eta = \frac{R}{R+r} \times 100\%$)
  5. Galvanometer Shunt & Multiplier Sizing ($R_s$ in parallel vs $R_m$ in series)
  6. Metre Bridge & Potentiometer Null Balance ($R_1/R_2 = l/(100-l)$, $E_1/E_2 = l_1/l_2$)
- **3 Myth-Busters:**
  1. **Myth:** *"Connecting four $1.5\text{ V}$ cells in parallel gives $6.0\text{ V}$."* → **Truth:** Identical cells in parallel keep the EMF of **one single cell ($1.5\text{ V}$)** while dividing the internal resistance by $4$ ($r_{\text{eq}} = r/4$).
  2. **Myth:** *"A voltmeter always reads the true EMF of a cell."* → **Truth:** A voltmeter draws a small current, causing a lost-volts drop $Ir$; only a **potentiometer at null balance ($I_g = 0$)** draws zero current and measures true EMF.
  3. **Myth:** *"To convert a galvanometer into an ammeter, add a big resistor in series."* → **Truth:** That makes a **voltmeter**! An ammeter needs a tiny **shunt resistor ($R_s$) in parallel** so most current bypasses the delicate coil.

---

## Lesson 01: Ohm's Law, Metallic Conduction & Wire Resistivity (`html/lessons/lesson-01/`)

### Phase 0: Do Now (`#do-now`)
- 3 rapid spaced-retrieval cards checking foundational charge $Q = It$, energy per unit charge $V = W/Q$, and basic circuit symbols.

### Phase 1: Wonder (`#wonder`)
- **3D Phenomenon Story (`story.js`):** In Aba, apprentice **Kelechi** tests two jumper leads of the same length across a $2.0\text{ V}$ test cell: a thick copper wire carries a strong steady current, a thin constantan wire carries much less, and a torch bulb's current fails to double when voltage doubles because its white-hot tungsten filament increases in resistance.
- **Wonder Wall:** Why does heating a metal increase its resistance? How do length $L$ and diameter $d$ control the resistance of a uniform wire?

### Phase 2: Investigate (`#investigate`)
- **Interactive Concept Sort (`#sort-card`):** Sort 6 conductors and circuit rules into *Ohmic Conductors*, *Non-Ohmic Devices*, and *WAEC Circuit Connection Rules* (ammeter in series, voltmeter in parallel).
- **3D Ohm's Law & Resistivity Lab (`#bench-canvas` / `bench.js`):**
  - Adjust **Wire Material** ($\text{Copper}$, $\text{Constantan}$, $\text{Nichrome}$), **Length $L$** ($20\text{–}100\text{ cm}$), **Diameter $d$** ($0.4\text{–}1.2\text{ mm}$), and **Applied Voltage $V$** ($0.5\text{–}6.0\text{ V}$).
  - Read live Resistance $R = \frac{4\rho L}{\pi d^2}$ and Current $I = V/R$, and record $V$–$I$ data points.

### Phase 3: Make Sense (`#make-sense`)
- **Core Synthesis:**
  - **Ohm's Law:** The electric current $I$ flowing through a metallic conductor is directly proportional to the potential difference $V$ across its ends, provided temperature and other physical conditions remain constant:
    $$V = IR$$
  - **Resistivity ($\rho$):** Resistance $R$ is directly proportional to length $L$ and inversely proportional to cross-sectional area $A = \frac{\pi d^2}{4}$:
    $$R = \frac{\rho L}{A} = \frac{4\rho L}{\pi d^2} \implies \frac{R_1}{R_2} = \left(\frac{L_1}{L_2}\right)\left(\frac{d_2}{d_1}\right)^2$$
- **3D Atomic Lattice Drift Zoom (`#zoom-canvas` / `zoom.js`):**
  - Shows free electrons (cyan spheres) drifting through a 3D lattice of vibrating metal ions (amber spheres). Raising the **Lattice Temperature** slider makes the ions vibrate violently, causing more frequent collisions and reducing drift velocity (higher $R$).
- **Active 5-Minute Movement Break (45-min mark):** Stand up and act out electron drift through a cool lattice (smooth walking) vs a hot lattice (dodging rapid vibrations).
- **Worked Examples:**
  1. **Example 1.1 (Ohm's Law & Charge Flow):** A constantan coil of resistance $8.0\,\Omega$ is connected across a steady p.d. of $12.0\text{ V}$ for $2.5\text{ minutes}$. Find (a) the current $I = 1.5\text{ A}$ and (b) total charge $Q = It = 225\text{ C}$.
  2. **Example 1.2 (Resistivity & Diameter Ratio):** A uniform wire of length $1.50\text{ m}$ and diameter $0.40\text{ mm}$ has resistance $3.60\,\Omega$. Calculate (a) its resistivity $\rho = 3.02 \times 10^{-7}\,\Omega\cdot\text{m}$ and (b) the resistance of a second wire of the same alloy of length $3.00\text{ m}$ and diameter $0.80\text{ mm}$ ($R_2 = 1.80\,\Omega$).
  3. **Example 1.3 (WAEC Paper 3 $V$–$I$ Graph Slope):** From experimental readings $(I = 0.25\text{ A}, V = 0.55\text{ V})$ and $(I = 1.15\text{ A}, V = 2.53\text{ V})$, determine the slope $R = \frac{2.53 - 0.55}{1.15 - 0.25} = 2.20\,\Omega$ and state two past-tense precautions.

### Phase 4: Apply (`#apply`)
- **Bridge Challenge** + **12-Question Interactive Quiz (`window.LESSON_QUIZ`)** focused on Ohm's Law, non-ohmic curves, resistivity $\rho = RA/L$, and $V$–$I$ practical precautions.

### Phase 5: Reflect & Assignment (`#reflect`)
- Self-rating (`1–4`) + **Part A Home Cable Check** + **Part B 30-Mark Written & Practical Assignment** with locked solutions.

---

## Lesson 02: EMF, Terminal P.D., Lost Volts & Internal Resistance (`html/lessons/lesson-02/`)

### Phase 0: Do Now (`#do-now`)
- 3 spaced-retrieval cards from Lesson 01 ($V = IR$, $R \propto L/d^2$, ammeter/voltmeter placement).

### Phase 1: Wonder (`#wonder`)
- **3D Phenomenon Story (`story.js`):** Returning to **Chinedu's Aba Workshop**, we watch the voltmeter across the $12.0\text{ V}$ battery read $12.0\text{ V}$ when the brass switch is open, then drop to $8.4\text{ V}$ when a $2.8\,\Omega$ load is connected and $I = 3.0\text{ A}$ flows. Where did the missing $3.6\text{ V}$ go?
- **Wonder Wall:** Why does a battery heat up internally when delivering heavy current? How can we find $E$ and $r$ without cutting the battery open?

### Phase 2: Investigate (`#investigate`)
- **Interactive Concept Sort (`#sort-card`):** Classify circuit quantities into *Open-Circuit Quantities ($I = 0$)*, *External Load Quantities ($V = IR$)*, and *Internal Cell Quantities ($v = Ir$)*.
- **3D Internal Resistance & Lost Volts Lab (`#bench-canvas` / `bench.js`):**
  - Toggle the **Circuit Switch** (`Open` vs `Closed`), vary **External Load $R$** ($1.0\text{–}15.0\,\Omega$) and **Internal Resistance $r$** ($0.4\text{–}2.5\,\Omega$) for a cell of $E = 12.0\text{ V}$.
  - Observe how $V = E - Ir$ and $v = Ir$ always sum to $12.0\text{ V}$, and watch the plotted point move along the straight line $V = -rI + E$.

### Phase 3: Make Sense (`#make-sense`)
- **Core Synthesis:**
  - **Complete Circuit Equation:**
    $$E = V + v = IR + Ir = I(R + r) \implies I = \frac{E}{R + r}$$
  - **Terminal P.D. & Straight-Line Graph:**
    $$V = E - Ir$$
    Plotting $V$ (vertical) against $I$ (horizontal) gives vertical intercept $= E$ and gradient $= -r$. Short-circuit current ($V = 0$) is $I_{\text{max}} = E/r$.
  - **"Two Readings, Same Cell" Method:**
    $$I_1(R_1 + r) = I_2(R_2 + r) \implies r = \frac{I_2 R_2 - I_1 R_1}{I_1 - I_2}$$
- **3D Electrolyte Internal Loss Zoom (`#zoom-canvas` / `zoom.js`):**
  - Visualizes positive and negative ions moving through the sulfuric acid electrolyte between battery plates, losing potential $v = Ir$ to internal drag before charges exit the terminals.
- **Active 5-Minute Movement Break (45-min mark):** Role-play the "Energy Tollgate" where each coulomb receives $12\text{ J}$ at the source, pays an internal toll $Ir$ inside the gate, and spends the remaining $IR$ in the external load.
- **Worked Examples:**
  1. **Example 2.1 (Terminal P.D. & Lost Volts):** Solving the Aba mystery: $E = 12.0\text{ V}$, $V = 8.4\text{ V}$ across $R = 2.8\,\Omega$. Current $I = 8.4/2.8 = 3.0\text{ A}$, lost volts $v = 12.0 - 8.4 = 3.6\text{ V}$, internal resistance $r = 3.6/3.0 = 1.2\,\Omega$.
  2. **Example 2.2 (Two Readings, Same Cell):** A cell supplies $0.80\text{ A}$ to a $4.0\,\Omega$ resistor and $0.50\text{ A}$ to a $7.0\,\Omega$ resistor. Find $r$ and $E$: $0.80(4.0 + r) = 0.50(7.0 + r) \implies 3.2 + 0.8r = 3.5 + 0.5r \implies 0.3r = 0.3 \implies r = 1.0\,\Omega$, and $E = 0.80(4.0 + 1.0) = 4.0\text{ V}$.
  3. **Example 2.3 (Short-Circuit Current & $V$–$I$ Intercepts):** A cell has vertical intercept $E = 6.0\text{ V}$ and horizontal intercept $I_{\text{sc}} = 4.0\text{ A}$ on a $V$–$I$ graph. Find $r = 6.0/4.0 = 1.5\,\Omega$ and terminal p.d. when $I = 1.2\text{ A}$ ($V = 4.2\text{ V}$).

### Phase 4: Apply (`#apply`)
- **Bridge Challenge** + **12-Question Interactive Quiz** on $E = I(R+r)$, lost volts, two-load simultaneous equations, and $V$–$I$ graph slopes.

### Phase 5: Reflect & Assignment (`#reflect`)
- Self-rating (`1–4`) + **Part A Torch Battery Dimming Investigation** + **Part B 30-Mark Written Assignment** with locked solutions.

---

## Lesson 03: Series & Parallel Networks, Cell Arrays, Power & Efficiency (`html/lessons/lesson-03/`)

### Phase 0: Do Now (`#do-now`)
- 3 spaced-retrieval cards from Lessons 01–02 ($R \propto L/d^2$, $E = I(R+r)$, two-readings formula).

### Phase 1: Wonder (`#wonder`)
- **3D Phenomenon Story (`story.js`):** In Surulere, Lagos, solar technician **Tunde** connects three identical $2.0\text{ V}$, $0.6\,\Omega$ cells in **series** ($E = 6.0\text{ V}, r = 1.8\,\Omega$) vs in **parallel** ($E = 2.0\text{ V}, r = 0.2\,\Omega$) to drive a low-resistance $0.3\,\Omega$ DC pump coil—discovering that parallel cells keep one cell's EMF while cutting internal resistance to a third!
- **Wonder Wall:** Why do household lamps stay at full $230\text{ V}$ brightness in parallel, and why don't parallel cells multiply voltage?

### Phase 2: Investigate (`#investigate`)
- **Interactive Concept Sort (`#sort-card`):** Sort 6 rules into *Series Resistor / Cell Rules*, *Parallel Resistor / Cell Rules*, and *Power & Efficiency Relations*.
- **3D Network & Cell Array Builder (`#bench-canvas` / `bench.js`):**
  - Switch between **Series Cells ($3 \times 2.0\text{ V}$)**, **Parallel Cells ($3 \times 2.0\text{ V}$)**, and **Series-Parallel Resistor Pod ($R_1$ in series with $R_2 \parallel R_3$)**.
  - Adjust resistances and read live $R_{\text{eq}}$, Total Current $I$, Branch Currents $I_2, I_3$, Useful Power $P_{\text{load}} = I^2 R$, and Cell Efficiency $\eta = \frac{R}{R+r} \times 100\%$.

### Phase 3: Make Sense (`#make-sense`)
- **Core Synthesis:**
  - **Resistors in Series & Parallel:**
    $$R_{\text{series}} = R_1 + R_2 + \dots, \qquad \frac{1}{R_{\text{parallel}}} = \frac{1}{R_1} + \frac{1}{R_2} + \dots \quad \left(R_{1\parallel 2} = \frac{R_1 R_2}{R_1 + R_2}\right)$$
  - **Current Divider Rule (Two Parallel Branches):**
    $$I_1 = I_{\text{total}}\left(\frac{R_2}{R_1 + R_2}\right), \qquad I_2 = I_{\text{total}}\left(\frac{R_1}{R_1 + R_2}\right)$$
  - **Cells in Series vs Identical Cells in Parallel:**
    - $n$ identical cells in **series (aiding)**: $E_{\text{eq}} = nE$, $r_{\text{eq}} = nr$. *(If one cell is reversed/opposing, $E_{\text{eq}} = (n - 2)E$, but $r_{\text{eq}}$ is still $nr$!)*
    - $n$ identical cells in **parallel**: $E_{\text{eq}} = E$, $r_{\text{eq}} = \frac{r}{n}$.
  - **Electrical Power, Energy & Cell Efficiency:**
    $$P = IV = I^2 R = \frac{V^2}{R}, \qquad W = Pt = IVt$$
    $$\eta = \frac{P_{\text{external}}}{P_{\text{total}}} \times 100\% = \frac{I^2 R}{I^2(R + r)} \times 100\% = \frac{R}{R + r} \times 100\%$$
- **3D Current Junction & Efficiency Zoom (`#zoom-canvas` / `zoom.js`):**
  - Shows a 3D copper junction splitting current spheres into wide (low-$R$) and narrow (high-$R$) parallel branches in inverse proportion to resistance.
- **Active 5-Minute Movement Break (45-min mark):** Form a "Single Corridor" (series) vs "Two Open Doors" (parallel) to feel how parallel paths lower total opposition.
- **Worked Examples:**
  1. **Example 3.1 (Combined Series-Parallel Network):** A $3.0\,\Omega$ resistor is in series with a parallel combination of $6.0\,\Omega$ and $12.0\,\Omega$ across a $14.0\text{ V}$ battery of internal resistance $1.0\,\Omega$. Find $R_{\text{parallel}} = 4.0\,\Omega$, $R_{\text{ext}} = 7.0\,\Omega$, total current $I = 14.0/(7.0 + 1.0) = 1.75\text{ A}$, p.d. across parallel pod $V_p = 1.75 \times 4.0 = 7.0\text{ V}$, and current in the $6.0\,\Omega$ branch ($I_6 = 7.0/6.0 = 1.17\text{ A}$).
  2. **Example 3.2 (Identical Cells in Parallel vs Series):** Four identical cells each of $E = 1.5\text{ V}$ and $r = 2.0\,\Omega$ are connected in parallel across a $1.0\,\Omega$ resistor. Find $E_{\text{eq}} = 1.5\text{ V}$, $r_{\text{eq}} = 2.0/4 = 0.5\,\Omega$, and current $I = 1.5/(1.0 + 0.5) = 1.0\text{ A}$.
  3. **Example 3.3 (Cell Efficiency & Power):** A battery of EMF $10.0\text{ V}$ and internal resistance $0.5\,\Omega$ is connected to a $4.5\,\Omega$ load. Calculate current $I = 2.0\text{ A}$, useful load power $P_R = 18.0\text{ W}$, wasted internal power $P_r = 2.0\text{ W}$, and efficiency $\eta = \frac{4.5}{4.5 + 0.5} \times 100\% = 90\%$.

### Phase 4: Apply (`#apply`)
- **Bridge Challenge** + **12-Question Interactive Quiz** on series/parallel combinations, parallel cell arrays, current splitting, power, and cell efficiency.

### Phase 5: Reflect & Assignment (`#reflect`)
- Self-rating (`1–4`) + **Part A Household Extension Load Audit** + **Part B 30-Mark Written Assignment** with locked solutions.

---

## Lesson 04: Galvanometer Conversion — Ammeter Shunts & Voltmeter Multipliers (`html/lessons/lesson-04/`)

### Phase 0: Do Now (`#do-now`)
- 3 spaced-retrieval cards from Lessons 01–03 (current divider, parallel cell internal resistance, cell efficiency).

### Phase 1: Wonder (`#wonder`)
- **3D Phenomenon Story (`story.js`):** At Onitsha Electronics Market, technician **Mazi Okafor** shows a student why a delicate moving-coil galvanometer ($I_g = 10\text{ mA}$, $R_g = 20\,\Omega$) will violently peg its needle and burn its hairspring if placed directly into a $5.0\text{ A}$ generator line—unless fitted with a precision bypass **shunt** or a high-resistance **multiplier**.
- **Wonder Wall:** How can the exact same $10\text{ mA}$ galvanometer movement become either a $0\text{–}5\text{ A}$ ammeter or a $0\text{–}100\text{ V}$ voltmeter?

### Phase 2: Investigate (`#investigate`)
- **Interactive Concept Sort (`#sort-card`):** Sort 6 meter conversion statements into *Ammeter Conversion (Shunt $R_s$)*, *Voltmeter Conversion (Multiplier $R_m$)*, and *Exam Traps to Avoid*.
- **3D Galvanometer Conversion Bench (`#bench-canvas` / `bench.js`):**
  - Switch between **Ammeter Mode (Parallel Shunt $R_s$)** and **Voltmeter Mode (Series Multiplier $R_m$)** for a galvanometer with $I_g = 10\text{ mA}, R_g = 20\,\Omega$.
  - Adjust target full-scale range ($I = 0.5\text{–}10.0\text{ A}$ or $V = 5\text{–}100\text{ V}$) and watch the exact required $R_s$ or $R_m$, coil current $I_g$, bypass current $I - I_g$, and pointer deflection to full scale (`FSD`).

### Phase 3: Make Sense (`#make-sense`)
- **Core Synthesis:**
  - **Converting a Galvanometer into an Ammeter (Parallel Shunt $R_s$):**
    - Connect a low-resistance **shunt ($R_s$)** in **parallel** with the galvanometer coil ($R_g$).
    - At full-scale current $I$, coil current is $I_g$ and shunt current is $I_s = I - I_g$. Since parallel voltages are equal:
      $$I_g R_g = (I - I_g) R_s \implies R_s = \frac{I_g R_g}{I - I_g}$$
  - **Converting a Galvanometer into a Voltmeter (Series Multiplier $R_m$):**
    - Connect a high-resistance **multiplier ($R_m$)** in **series** with the galvanometer coil ($R_g$).
    - At full-scale voltage $V$, series current is $I_g$:
      $$V = I_g(R_g + R_m) \implies R_{\text{total}} = \frac{V}{I_g}, \qquad R_m = \frac{V}{I_g} - R_g$$
  - **Crucial WAEC/JAMB Trap:** Always check whether the question asks for the *multiplier resistance to be connected in series* ($R_m = \frac{V}{I_g} - R_g$) or the *total resistance of the resulting voltmeter* ($R_{\text{total}} = \frac{V}{I_g}$).
- **3D Coil & Shunt/Multiplier Zoom (`#zoom-canvas` / `zoom.js`):**
  - Side-by-side 3D view of the moving coil in its radial permanent magnet field: in Ammeter mode, a thick copper shunt bar beneath the terminals carries $99.8\%$ of the current; in Voltmeter mode, a wire-wound ceramic multiplier resistor in series absorbs $99.8\%$ of the voltage drop.
- **Active 5-Minute Movement Break (45-min mark):** Act out the "VIP Toll Lane ($I_g$)" vs the "Express Highway Bypass ($I - I_g$)" for a shunt, then the "Speed Bump Corridor ($R_m$)" for a multiplier.
- **Worked Examples:**
  1. **Example 4.1 (Ammeter Shunt Calculation):** A moving-coil galvanometer has resistance $R_g = 18.0\,\Omega$ and gives full-scale deflection for a current of $I_g = 15.0\text{ mA} = 0.015\text{ A}$. Calculate the shunt resistance required to convert it to read up to $I = 3.015\text{ A}$:
     $$R_s = \frac{0.015 \times 18.0}{3.015 - 0.015} = \frac{0.27}{3.00} = 0.090\,\Omega$$
  2. **Example 4.2 (Voltmeter Multiplier vs Total Resistance):** A galvanometer of resistance $R_g = 25.0\,\Omega$ gives full-scale deflection at $I_g = 8.0\text{ mA} = 0.008\text{ A}$. To measure up to $V = 40.0\text{ V}$, find (a) total resistance of the voltmeter $R_{\text{total}} = 40.0/0.008 = 5000\,\Omega$ and (b) series multiplier resistance required $R_m = 5000 - 25 = 4975\,\Omega$.
  3. **Example 4.3 (Given Potential Drop Across Galvanometer):** A galvanometer of resistance $40\,\Omega$ shows full-scale deflection when a p.d. of $100\text{ mV}$ ($0.10\text{ V}$) is applied across it. First find $I_g = \frac{0.10}{40} = 0.0025\text{ A}$ ($2.5\text{ mA}$), then find the multiplier needed to read $25.0\text{ V}$: $R_m = \frac{25.0}{0.0025} - 40 = 10000 - 40 = 9960\,\Omega$.

### Phase 4: Apply (`#apply`)
- **Bridge Challenge** + **12-Question Interactive Quiz** on shunts, multipliers, milliamps-to-amps conversions, and total vs added resistance.

### Phase 5: Reflect & Assignment (`#reflect`)
- Self-rating (`1–4`) + **Part A Multimeter Range Selector Inspection** + **Part B 30-Mark Written Assignment** with locked solutions.

---

## Lesson 05: Null-Balance Precision — Metre Bridge, Potentiometer & WAEC Practicals (`html/lessons/lesson-05/`)

### Phase 0: Do Now (`#do-now`)
- 3 spaced-retrieval cards from Lessons 01–04 ($R \propto L/d^2$, $V = E - Ir$, shunt & multiplier equations).

### Phase 1: Wonder (`#wonder`)
- **3D Phenomenon Story (`story.js`):** Back at the Aba workshop, **Engr. Nkechi** connects Chinedu's $12.0\text{ V}$ battery ($r = 1.2\,\Omega$) to a **100 cm potentiometer board** driven by a $15.0\text{ V}$ workshop accumulator. Sliding the brass jockey to $l = 80.0\text{ cm}$ brings the centre-zero galvanometer needle to **exact zero (`0.0 mA`)**—proving the battery's true EMF is $12.0\text{ V}$ because at null balance, zero current flows through $r$!
- **Wonder Wall:** Why does a null-balance point ($I_g = 0$) eliminate internal-resistance error completely? And how do we score full marks on WAEC Paper 3 Metre Bridge and Potentiometer practicals?

### Phase 2: Investigate (`#investigate`)
- **Interactive Concept Sort (`#sort-card`):** Sort 6 statements into *Metre Bridge Principles*, *Potentiometer Principles*, and *Accepted WAEC Past-Tense Precautions*.
- **3D Dual Metre Bridge & Potentiometer Bench (`#bench-canvas` / `bench.js`):**
  - Switch between **Metre Bridge Mode** (standard resistor $R_1$ in left gap, unknown resistor/wire $R_2$ in right gap) and **Potentiometer Mode** (driver accumulator $E_0$ across $100\text{ cm}$ wire, test cell $E_x$ in secondary loop).
  - Slide **Jockey Position $l$ ($\text{cm}$)** from $5\text{ cm}$ to $95\text{ cm}$ and watch the 3D brass jockey move along the constantan wire alongside the metre rule while the centre-zero galvanometer needle swings to `0.00 mA (NULL BALANCE!)` at the exact balance length $l_0$.

### Phase 3: Make Sense (`#make-sense`)
- **Core Synthesis:**
  - **Wheatstone Bridge & Metre Bridge ($100\text{ cm}$ Uniform Wire):**
    $$\frac{R_{\text{left}}}{R_{\text{right}}} = \frac{l}{100 - l} \implies R_{\text{right}} = R_{\text{left}}\left(\frac{100 - l}{l}\right)$$
  - **WAEC Paper 3 Practical 1 (Comparing Two Wires $A$ and $B$ on a Metre Bridge):**
    Since $R = \frac{4\rho L}{\pi d^2}$, for equal lengths of the same alloy, plotting $R_2$ (vertical) against $R_1$ (horizontal) gives a straight line through the origin with slope:
    $$s = \frac{R_2}{R_1} = \left(\frac{d_1}{d_2}\right)^2 \implies \sqrt{s} = \frac{d_1}{d_2}$$
  - **Potentiometer Equations:**
    1. **Comparing Two Cells:**
       $$\frac{E_1}{E_2} = \frac{l_1}{l_2}$$
    2. **Driver Cell with Series Resistor Trap:** If driver cell $E_0$ has series resistor $R_{\text{ext}}$ and potentiometer wire resistance $R_p$ (length $100\text{ cm}$):
       $$V_{\text{AB}} = E_0\left(\frac{R_p}{R_p + R_{\text{ext}}}\right), \qquad E_{\text{test}} = \left(\frac{l}{100}\right)V_{\text{AB}}$$
    3. **Internal Resistance of a Cell by Potentiometer:** If open-circuit balance length is $l_1$ and closed-circuit balance length across external load $R$ is $l_2$:
       $$r = R\left(\frac{l_1 - l_2}{l_2}\right)$$
  - **Accepted Past-Tense WAEC Electricity Precautions:**
    1. *"I ensured tight and clean electrical connections at all terminals."*
    2. *"I opened/removed the plug key immediately after taking each reading so the resistance wire did not heat up."*
    3. *"I tapped the jockey lightly on the constantan wire instead of scraping it along the wire to preserve uniform cross-sectional area."*
    4. *"I avoided parallax error when reading the metre rule and the ammeter/galvanometer pointer."*
    5. *"I noted and corrected for zero error on the ammeter/voltmeter before taking readings."*
    *(Never write future tense like "I will ensure...", vague claims like "I was careful", or mechanics rules like "I avoided draught"!)*
- **3D Null-Balance Potential Gradient Zoom (`#zoom-canvas` / `zoom.js`):**
  - Displays the continuous voltage slope along the $100\text{ cm}$ slide wire versus the constant plateau of the test cell $E_x$; at $l = l_0$, both potentials are identical so zero charge flows through the galvanometer bridge.
- **Active 5-Minute Movement Break (45-min mark):** Practice "Light Tap vs Scrape" and recite the 4 golden past-tense WAEC precautions aloud.
- **Worked Examples:**
  1. **Example 5.1 (Metre Bridge Unknown Resistance & Wire Resistivity):** A standard $4.0\,\Omega$ resistor in the left gap of a metre bridge balances an unknown wire of length $0.80\text{ m}$ and diameter $0.40\text{ mm}$ in the right gap at $l = 40.0\text{ cm}$ from the left end. Find $R_{\text{right}} = 4.0 \times \frac{60.0}{40.0} = 6.0\,\Omega$ and resistivity $\rho = \frac{R\pi d^2}{4L} = 9.42 \times 10^{-7}\,\Omega\cdot\text{m}$.
  2. **Example 5.2 (Potentiometer with Driver Series Resistor):** A $100\text{ cm}$ potentiometer wire of resistance $R_p = 8.0\,\Omega$ is connected in series with a $2.0\,\Omega$ resistor and a $5.0\text{ V}$ driver accumulator of negligible internal resistance. Find (a) p.d. across the whole wire $V_{\text{AB}} = 5.0 \times \frac{8.0}{8.0 + 2.0} = 4.0\text{ V}$ and (b) EMF of a test cell that balances at $l = 65.0\text{ cm}$ ($E = \frac{65.0}{100} \times 4.0 = 2.60\text{ V}$).
  3. **Example 5.3 (Potentiometer Internal Resistance & WAEC Practical Slope):** A cell balances at $l_1 = 75.0\text{ cm}$ on open circuit and at $l_2 = 60.0\text{ cm}$ when shunted by a $3.0\,\Omega$ resistor. Find its internal resistance $r = 3.0\left(\frac{75.0 - 60.0}{60.0}\right) = 0.75\,\Omega$.

### Phase 4: Apply (`#apply`)
- **Bridge Challenge** + **12-Question Interactive Quiz** on Metre Bridge, Potentiometer, Driver Series Resistor calculations, and WAEC Paper 3 precautions.

### Phase 5: Reflect & Assignment (`#reflect`)
- Self-rating (`1–4`) + **Part A Practical Precaution Audit** + **Part B 30-Mark WAEC Paper 2 & Paper 3 Capstone Assignment** with locked solutions.
