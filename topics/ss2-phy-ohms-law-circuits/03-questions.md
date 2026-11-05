# 03 — Assessment & Question Bank: Ohm's Law & Current Electricity (`ss2-phy-ohms-law-circuits`)

All items in this bank are **100% originally authored and paraphrased** to reflect WAEC WASSCE, NECO SSCE, and JAMB UTME question patterns without copying any past-question text verbatim.

---

## 1. Master 12-Question Interactive Quiz Bank (Core Unit / Lesson 05 Capstone)

### Q1 — Ohm's Law & Physical Conditions
- **Stem:** Why must the temperature of a metallic conductor remain constant when verifying Ohm's law in a school physics laboratory?
- **Options:**
  - `A`: Because rising temperature increases the amplitude of lattice ion vibrations and increases the wire's resistance
  - `B`: Because rising temperature destroys the electromotive force of the accumulator cell
  - `C`: Because a hot wire converts the ammeter into a voltmeter
  - `D`: Because free electrons disappear completely above room temperature
- **Correct:** `A`
- **Explanation:** In a metal, higher temperature causes positive lattice ions to vibrate more vigorously, increasing electron-ion collision frequency and raising resistance $R$ so the $V$–$I$ graph curves away from a straight line.

### Q2 — Wire Resistivity & Diameter Ratio
- **Stem:** Wire X and Wire Y are made of the same constantan alloy. Wire Y has twice the length and twice the diameter of Wire X. If the resistance of Wire X is $12.0\,\Omega$, what is the resistance of Wire Y?
- **Options:**
  - `A`: $6.0\,\Omega$
  - `B`: $12.0\,\Omega$
  - `C`: $24.0\,\Omega$
  - `D`: $3.0\,\Omega$
- **Correct:** `A`
- **Explanation:** Since $R = \frac{4\rho L}{\pi d^2} \propto \frac{L}{d^2}$, doubling $L$ multiplies $R$ by $2$, while doubling $d$ divides $R$ by $2^2 = 4$. Thus $R_Y = 12.0 \times \frac{2}{4} = 6.0\,\Omega$.

### Q3 — Terminal P.D. & Lost Volts
- **Stem:** An accumulator of EMF $12.0\text{ V}$ and internal resistance $0.80\,\Omega$ delivers a steady current of $2.5\text{ A}$ to a workshop lamp. What is the terminal potential difference across the accumulator?
- **Options:**
  - `A`: $10.0\text{ V}$
  - `B`: $14.0\text{ V}$
  - `C`: $9.6\text{ V}$
  - `D`: $2.0\text{ V}$
- **Correct:** `A`
- **Explanation:** Lost volts inside the cell: $v = Ir = 2.5 \times 0.80 = 2.0\text{ V}$. Terminal p.d. $V = E - Ir = 12.0 - 2.0 = 10.0\text{ V}$.

### Q4 — "Two Readings, Same Cell" Internal Resistance
- **Stem:** A dry cell supplies a current of $0.60\text{ A}$ when connected to a $2.0\,\Omega$ resistor, and $0.30\text{ A}$ when connected to a $5.0\,\Omega$ resistor. What is the internal resistance $r$ of the cell?
- **Options:**
  - `A`: $1.0\,\Omega$
  - `B`: $0.5\,\Omega$
  - `C`: $1.5\,\Omega$
  - `D`: $2.0\,\Omega$
- **Correct:** `A`
- **Explanation:** Using $E = I_1(R_1 + r) = I_2(R_2 + r)$: $0.60(2.0 + r) = 0.30(5.0 + r) \implies 1.2 + 0.60r = 1.5 + 0.30r \implies 0.30r = 0.30 \implies r = 1.0\,\Omega$.

### Q5 — Identical Cells in Parallel
- **Stem:** Four identical cells, each of EMF $1.5\text{ V}$ and internal resistance $2.0\,\Omega$, are connected in parallel across an external resistor of $1.5\,\Omega$. What current flows through the external resistor?
- **Options:**
  - `A`: $0.75\text{ A}$
  - `B`: $3.00\text{ A}$
  - `C`: $0.16\text{ A}$
  - `D`: $1.00\text{ A}$
- **Correct:** `A`
- **Explanation:** For 4 identical cells in parallel, $E_{\text{eq}} = 1.5\text{ V}$ (same as one cell!) and $r_{\text{eq}} = \frac{2.0}{4} = 0.50\,\Omega$. Current $I = \frac{E_{\text{eq}}}{R + r_{\text{eq}}} = \frac{1.5}{1.5 + 0.50} = \frac{1.5}{2.0} = 0.75\text{ A}$.

### Q6 — Series-Parallel Resistor Network & Branch Current
- **Stem:** A $4.0\,\Omega$ resistor is connected in series with a parallel combination of $6.0\,\Omega$ and $3.0\,\Omega$ resistors across a $12.0\text{ V}$ battery of negligible internal resistance. What current passes through the $3.0\,\Omega$ resistor?
- **Options:**
  - `A`: $1.33\text{ A}$
  - `B`: $2.00\text{ A}$
  - `C`: $0.67\text{ A}$
  - `D`: $4.00\text{ A}$
- **Correct:** `A`
- **Explanation:** Parallel pod $R_p = \frac{6 \times 3}{6 + 3} = 2.0\,\Omega$. Total resistance $R_{\text{tot}} = 4.0 + 2.0 = 6.0\,\Omega$. Main current $I = \frac{12.0}{6.0} = 2.0\text{ A}$. By current divider, current in the $3.0\,\Omega$ branch is $I_3 = 2.0 \times \frac{6.0}{6.0 + 3.0} = 1.33\text{ A}$.

### Q7 — Cell Efficiency
- **Stem:** A cell of internal resistance $0.50\,\Omega$ is connected to an external load resistor of $4.50\,\Omega$. What is the efficiency of the cell in this circuit?
- **Options:**
  - `A`: $90\%$
  - `B`: $88.9\%$
  - `C`: $10\%$
  - `D`: $95\%$
- **Correct:** `A`
- **Explanation:** Efficiency $\eta = \frac{R}{R + r} \times 100\% = \frac{4.50}{4.50 + 0.50} \times 100\% = \frac{4.50}{5.00} \times 100\% = 90\%$.

### Q8 — Galvanometer to Ammeter (Shunt $R_s$)
- **Stem:** A moving-coil galvanometer of resistance $19.8\,\Omega$ gives full-scale deflection when a current of $10\text{ mA}$ flows through it. What shunt resistance must be connected in parallel with it to measure currents up to $1.0\text{ A}$?
- **Options:**
  - `A`: $0.20\,\Omega$
  - `B`: $0.198\,\Omega$
  - `C`: $2.00\,\Omega$
  - `D`: $1980\,\Omega$
- **Correct:** `A`
- **Explanation:** $I_g = 0.010\text{ A}$, $I - I_g = 1.0 - 0.010 = 0.990\text{ A}$. Using $R_s = \frac{I_g R_g}{I - I_g} = \frac{0.010 \times 19.8}{0.990} = \frac{0.198}{0.990} = 0.20\,\Omega$.

### Q9 — Galvanometer to Voltmeter (Multiplier $R_m$)
- **Stem:** A galvanometer of coil resistance $30\,\Omega$ gives full-scale deflection for a current of $5.0\text{ mA}$. What series multiplier resistance is required to convert it into a voltmeter reading up to $15.0\text{ V}$?
- **Options:**
  - `A`: $2970\,\Omega$
  - `B`: $3000\,\Omega$
  - `C`: $3030\,\Omega$
  - `D`: $297\,\Omega$
- **Correct:** `A`
- **Explanation:** Total resistance needed is $R_{\text{tot}} = \frac{V}{I_g} = \frac{15.0}{0.005} = 3000\,\Omega$. Subtracting the existing coil resistance $R_g = 30\,\Omega$ gives the added multiplier $R_m = 3000 - 30 = 2970\,\Omega$.

### Q10 — Metre Bridge Balance Point
- **Stem:** In a metre bridge experiment, a standard resistor of $6.0\,\Omega$ is placed in the left-hand gap and an unknown coil $X$ is placed in the right-hand gap. If the null balance point is found at $40.0\text{ cm}$ from the left end, what is the resistance of coil $X$?
- **Options:**
  - `A`: $9.0\,\Omega$
  - `B`: $4.0\,\Omega$
  - `C`: $6.0\,\Omega$
  - `D`: $15.0\,\Omega$
- **Correct:** `A`
- **Explanation:** Using $\frac{R_{\text{left}}}{R_{\text{right}}} = \frac{l}{100 - l} \implies \frac{6.0}{X} = \frac{40.0}{60.0} \implies X = 6.0 \times \frac{60.0}{40.0} = 9.0\,\Omega$.

### Q11 — Potentiometer with Driver Series Resistor
- **Stem:** A $100\text{ cm}$ uniform potentiometer wire of resistance $9.0\,\Omega$ is connected in series with a $3.0\,\Omega$ resistor and a $6.0\text{ V}$ driver accumulator of negligible internal resistance. If a test cell balances at a length of $50.0\text{ cm}$ on the wire, what is the EMF of the test cell?
- **Options:**
  - `A`: $2.25\text{ V}$
  - `B`: $3.00\text{ V}$
  - `C`: $4.50\text{ V}$
  - `D`: $1.50\text{ V}$
- **Correct:** `A`
- **Explanation:** First find the potential drop across the $100\text{ cm}$ wire: $V_{\text{AB}} = 6.0 \times \frac{9.0}{9.0 + 3.0} = 4.50\text{ V}$. At $l = 50.0\text{ cm}$, $E_{\text{test}} = \frac{50.0}{100} \times 4.50 = 2.25\text{ V}$.

### Q12 — WAEC Paper 3 Electricity Precautions
- **Stem:** Which of the following is an acceptable precaution when reporting a WAEC Physics Paper 3 metre bridge or potentiometer practical?
- **Options:**
  - `A`: I tapped the jockey lightly on the constantan wire instead of scraping it along the wire
  - `B`: I will ensure tight connections at all terminals before starting the experiment
  - `C`: I closed the laboratory windows to avoid draughts affecting the galvanometer
  - `D`: I was very careful when reading the metre rule
- **Correct:** `A`
- **Explanation:** WAEC Paper 3 requires specific, physically valid precautions stated in the **past tense** (*"I tapped the jockey lightly..."*, *"I ensured tight connections..."*, *"I opened the key between readings..."*). Future tense (`B`), mechanics-only draught rules (`C`), and vague claims (`D`) score zero.

---

## 2. Lesson-Specific Quizzes & Written Assignments (Lessons 01–05)

### Lesson 01 Written & Practical Assignment (30 Marks)
- **Part A (Home/Workshop Investigation):** Inspect three electrical appliances or extension cables at home (e.g., pressing iron cord vs phone charger cord). Compare their conductor thickness and explain in 3 sentences why high-current heating appliances use thicker copper cores.
- **Part B (30-Mark WAEC Structured Paper):**
  1. **(10 marks)** State Ohm's law and explain using the free-electron lattice model why a tungsten filament lamp disobeys Ohm's law at high voltages. Calculate the resistance and resistivity of a constantan wire of length $2.00\text{ m}$ and diameter $0.50\text{ mm}$ that carries $0.40\text{ A}$ when connected across $1.60\text{ V}$.
  2. **(10 marks)** Two wires $P$ and $Q$ of the same alloy have lengths in the ratio $3:1$ and diameters in the ratio $2:1$. If $R_P = 6.0\,\Omega$, find $R_Q$.
  3. **(10 marks)** In an Ohm's law practical, a student records $(I = 0.20\text{ A}, V = 0.44\text{ V})$ and $(I = 1.00\text{ A}, V = 2.20\text{ V})$. Calculate the gradient of the $V$–$I$ graph, state what physical quantity it represents, and write two acceptable past-tense precautions.

### Lesson 02 Written & Practical Assignment (30 Marks)
- **Part A (Home Investigation):** Observe what happens to the cabin light of a car or Keke Napep (or a torch bulb with weak batteries) the moment the starter or high-beam switch is engaged. Explain the observation using $V = E - Ir$.
- **Part B (30-Mark WAEC Structured Paper):**
  1. **(10 marks)** Distinguish between electromotive force ($E$) and terminal potential difference ($V$). Explain why $E > V$ whenever a cell delivers current.
  2. **(10 marks)** A cell delivers $0.75\text{ A}$ through a $3.0\,\Omega$ resistor and $0.45\text{ A}$ through a $5.4\,\Omega$ resistor. Calculate (a) the internal resistance $r$ and (b) the EMF $E$ of the cell.
  3. **(10 marks)** A student plots terminal p.d. $V$ on the vertical axis against current $I$ on the horizontal axis for a lead-acid cell, obtaining a vertical intercept of $2.10\text{ V}$ and a horizontal intercept of $3.50\text{ A}$. Determine the internal resistance $r$ and the terminal voltage when $I = 1.50\text{ A}$.

### Lesson 03 Written & Practical Assignment (30 Marks)
- **Part A (Home Investigation):** List 3 appliances in your room connected in parallel to the $230\text{ V}$ mains supply, note their power ratings in watts ($\text{W}$), and calculate the current each draws ($I = P/V$).
- **Part B (30-Mark WAEC Structured Paper):**
  1. **(10 marks)** Derive the equivalent resistance of two resistors $R_1, R_2$ in parallel. A $2.5\,\Omega$ resistor is in series with a parallel pair of $6.0\,\Omega$ and $12.0\,\Omega$ across a $15.0\text{ V}$ battery ($r = 1.0\,\Omega$). Find the total current and the current in the $6.0\,\Omega$ branch.
  2. **(10 marks)** Three identical cells each of $E = 2.0\text{ V}$ and $r = 1.5\,\Omega$ are connected (a) in series and (b) in parallel across a $1.5\,\Omega$ external load. Calculate the load current in each arrangement and explain which gives a larger current.
  3. **(10 marks)** A battery of EMF $12.0\text{ V}$ and internal resistance $0.60\,\Omega$ drives a $5.40\,\Omega$ load for $5\text{ minutes}$. Calculate (a) the useful energy delivered to the load, (b) the energy wasted inside the battery, and (c) the efficiency of the battery.

### Lesson 04 Written & Practical Assignment (30 Marks)
- **Part A (Home/Lab Investigation):** Sketch the dial of a workshop multimeter showing the DC current ($\text{mA / 10 A}$) and DC voltage ($\text{20 V / 200 V}$) ranges, and note why the $10\text{ A}$ jack uses a separate heavy-duty terminal.
- **Part B (30-Mark WAEC Structured Paper):**
  1. **(10 marks)** Explain with clear circuit diagrams how a moving-coil galvanometer of coil resistance $R_g$ and full-scale current $I_g$ is converted into (a) an ammeter and (b) a voltmeter.
  2. **(10 marks)** A galvanometer of resistance $15.0\,\Omega$ gives full-scale deflection with $20\text{ mA}$. Calculate the shunt resistance required to convert it to read up to $5.02\text{ A}$.
  3. **(10 marks)** Using the same galvanometer ($R_g = 15.0\,\Omega, I_g = 20\text{ mA}$), calculate (a) the total resistance of a voltmeter reading up to $60.0\text{ V}$ and (b) the series multiplier resistance that must be added.

### Lesson 05 Written & Practical Capstone Assignment (30 Marks)
- **Part A (Lab Precaution Checklist):** Write out 4 past-tense WAEC Paper 3 precautions for a metre bridge or potentiometer experiment and explain the physical reason behind each one.
- **Part B (30-Mark WAEC Paper 2 & Paper 3 Capstone):**
  1. **(10 marks)** Explain why a potentiometer is preferred to a moving-coil voltmeter when measuring the EMF of a dry cell. A $100\text{ cm}$ potentiometer wire of resistance $8.0\,\Omega$ is in series with a $4.0\,\Omega$ resistor and a $6.0\text{ V}$ driver cell ($r = 0$). Find the balance length for a $1.80\text{ V}$ test cell.
  2. **(10 marks)** On a potentiometer, a cell balances at $l_1 = 84.0\text{ cm}$ on open circuit and at $l_2 = 70.0\text{ cm}$ when shunted by a $4.0\,\Omega$ resistor. Calculate the internal resistance $r$ of the cell.
  3. **(10 marks — WAEC Paper 3 Practical Analysis):** In a metre bridge experiment comparing two constantan wires $A$ and $B$ with a $1.0\,\Omega$ standard resistor in the left gap, a student plots $R_B$ on the vertical axis against $R_A$ on the horizontal axis and obtains a straight line through the origin of gradient $s = 2.25$. Evaluate $k = \sqrt{s}$ and state the physical meaning of $k$ in terms of the wire diameters $d_A$ and $d_B$.
