/* Lesson 05 · Null-Balance Precision: Metre Bridge, Potentiometer & WAEC Practicals — pure data (offline, no fetch) */
window.L01 = {
  items: [
    { id: "c1", name: "Wheatstone Balance: R₁ ÷ R₂ = R₃ ÷ R₄ (I_g = 0)", emo: "⚖️", group: "shm", fact: "When opposite arms of a four-resistor bridge have equal ratios, both junction nodes sit at identical potential and zero current flows through G." },
    { id: "c2", name: "Metre Bridge Equation: R₁ ÷ R₂ = l ÷ (100 − l)", emo: "📏", group: "shm", fact: "On a uniform 100 cm constantan wire, resistance is proportional to length, so R₁/R₂ equals l / (100 − l)." },
    { id: "c3", name: "WAEC Two-Wire Diameter Ratio: √s = d₁ ÷ d₂", emo: "🔬", group: "shm", fact: "When two wires of the same material and length are compared in a metre bridge, slope s = R₂/R₁ = (d₁/d₂)², so √s = d₁/d₂." },
    { id: "c4", name: "Best Accuracy Near the Midpoint (l ≈ 40–60 cm)", emo: "🎯", group: "shm", fact: "Choosing standard resistance R₂ close to R₁ keeps the balance point near 50 cm, minimising percentage end-error." },
    { id: "c5", name: "Potentiometer EMF Ratio: E₁ ÷ E₂ = l₁ ÷ l₂", emo: "🔋", group: "periodic", fact: "Along a uniform wire carrying steady driver current, potential drop is V = kl, so two cells balance at lengths proportional to their EMFs." },
    { id: "c6", name: "Zero Current Drawn from Test Cell at Null Point (Ir = 0)", emo: "🥇", group: "periodic", fact: "At balance (I_g = 0), no current leaves the test cell, so lost volts Ir = 0 and the potentiometer measures true open-circuit EMF!" },
    { id: "c7", name: "Potentiometer Cell Internal Resistance: r = R(l₁ − l₂) ÷ l₂", emo: "🧪", group: "periodic", fact: "If a cell balances at l₁ on open circuit and at l₂ when shunted by load R, then E/V = l₁/l₂ and r = R(l₁ − l₂)/l₂." },
    { id: "c8", name: "Driver Series Resistor Voltage Divider: V_AB = E_drv × R_w ÷ (R_w + R_s)", emo: "⚠️", group: "periodic", fact: "When a series resistor R_s is in the driver circuit, find V_AB across the 100 cm wire first before scaling by l / 100!" },
    { id: "c9", name: "I Did Not Drag the Jockey Along the Constantan Wire", emo: "✍️", group: "non", fact: "Dragging the jockey scrapes the wire, alters its cross-sectional area A, and destroys the uniform potential gradient!" },
    { id: "c10", name: "I Avoided Parallax Error & Opened the Key Between Readings", emo: "👁️", group: "non", fact: "WAEC Paper 3 requires past-tense first-person precautions: reading the metre rule vertically and opening the key so the wire stays cool." }
  ],

  trials: [
    { id: "t1", name: "Metre Bridge Unknown Coil X (Standard R₂ = 6.0 Ω)", L: "l = 40.0 cm", m: "100−l = 60.0 cm", A: "I_g = 0", t: "4.00 Ω", T: "0.667", T2: "Metre Bridge", g: "X = 6 × (40/60)", col: "#3ee6c4" },
    { id: "t2", name: "Metre Bridge Unknown Coil Y (Standard R₂ = 10.0 Ω)", L: "l = 60.0 cm", m: "100−l = 40.0 cm", A: "I_g = 0", t: "15.0 Ω", T: "1.500", T2: "Metre Bridge", g: "Y = 10 × (60/40)", col: "#ffb23f" },
    { id: "t3", name: "WAEC Two-Wire Diameter Ratio (Slope s = R₂/R₁ = 3.24)", L: "Wire 1 & 2", m: "s = 3.24", A: "I_g = 0", t: "1.80", T: "3.240", T2: "Metre Bridge", g: "√s = d₁/d₂ = 1.8", col: "#a855f7" },
    { id: "t4", name: "Potentiometer EMF Comparison (E₁ = 1.50 V at l₁ = 50.0 cm)", L: "l₂ = 70.0 cm", m: "k = 0.03 V/cm", A: "I_g = 0", t: "2.10 V", T: "1.400", T2: "Potentiometer", g: "E₂ = 1.5 × (70/50)", col: "#2fb344" },
    { id: "t5", name: "Potentiometer Driver Trap (E_d=3V, R_s=2Ω, R_w=10Ω, l=50cm)", L: "V_AB = 2.50 V", m: "l = 50.0 cm", A: "I_g = 0", t: "1.25 V", T: "0.500", T2: "Potentiometer", g: "E_x = 2.50 × 0.50", col: "#f43f5e" },
    { id: "t6", name: "Potentiometer Internal Resistance r (l₁=75 cm, l₂=60 cm, R=4 Ω)", L: "l₁=75, l₂=60", m: "Load R = 4.0 Ω", A: "I_g = 0", t: "1.00 Ω", T: "1.250", T2: "Potentiometer", g: "r = 4×(75−60)/60", col: "#38bdf8" }
  ],
  tOptions: ["4.00 Ω", "15.0 Ω", "1.80", "2.10 V", "1.25 V", "1.00 Ω"],
  TOptions: ["0.667", "1.500", "3.240", "1.400", "0.500", "1.250"],
  T2Options: ["Metre Bridge", "Potentiometer"],

  pins: [
    { x: -1.5, name: "Metre Bridge Left Balance (l = 40 cm)", num: "R₁/R₂ = 2/3", cat: "shm", col: "#3ee6c4", desc: "When the jockey balances at l = 40.0 cm (so 100 − l = 60.0 cm), the left-gap resistor R₁ is 40/60 = 2/3 of the right-gap resistor R₂." },
    { x: -0.5, name: "Metre Bridge Midpoint (l = 50 cm)", num: "R₁ = R₂", cat: "shm", col: "#ffb23f", desc: "At l = 50.0 cm, both wire segments are equal (50 cm : 50 cm), so R₁ = R₂ and percentage measurement error is minimised." },
    { x: 0.5, name: "Potentiometer True EMF (I_g = 0)", num: "Ir = 0 V!", cat: "periodic", col: "#2fb344", desc: "At null balance, zero current leaves the test cell (I_g = 0), so there are zero lost volts (Ir = 0) and we read the exact open-circuit EMF!" },
    { x: 1.5, name: "Potentiometer Shunted Cell (l₂ < l₁)", num: "r = R(l₁−l₂)/l₂", cat: "periodic", col: "#a855f7", desc: "Closing a shunt resistor R across the test cell drops its balance length from l₁ (for E) to l₂ (for V), revealing internal resistance r!" }
  ]
};

window.LESSON_QUIZ = [
  {
    q: "In a metre bridge experiment, an unknown resistor X is in the left gap and a standard 12 Ω resistor is in the right gap. If the balance point is found at l = 40.0 cm from the left end, what is the resistance of X?",
    o: ["18.0 Ω", "8.0 Ω", "4.8 Ω", "7.2 Ω"],
    a: 1,
    e: "X / R₂ = l / (100 − l) → X / 12 = 40.0 / (100 − 40.0) = 40 / 60 = 2 / 3 → X = 12 × (2/3) = 8.0 Ω.",
    src: "WAEC 2018"
  },
  {
    q: "Why is a potentiometer preferred to a moving-coil voltmeter when measuring the accurate electromotive force (EMF) of a cell?",
    o: [
      "A potentiometer is smaller and cheaper than a voltmeter",
      "At the balance point, the potentiometer draws zero current from the cell, so no volts are lost across the cell's internal resistance",
      "A potentiometer draws maximum current from the cell",
      "A potentiometer decreases the EMF of the cell"
    ],
    a: 1,
    e: "At null balance (I_g = 0), zero current flows through the test cell, so lost volts Ir = 0 and the true open-circuit EMF E is measured.",
    src: "WAEC 2020"
  },
  {
    q: "On a potentiometer, a standard cell of EMF 1.50 V balances at a length of 60.0 cm. If another cell balances at 84.0 cm on the same wire, what is the EMF of the second cell?",
    o: ["1.07 V", "2.10 V", "1.80 V", "2.40 V"],
    a: 1,
    e: "E₂ / E₁ = l₂ / l₁ → E₂ = 1.50 × (84.0 / 60.0) = 1.50 × 1.40 = 2.10 V.",
    src: "JAMB 2017"
  },
  {
    q: "A potentiometer wire AB of length 100 cm and resistance 10 Ω is connected in series with a driver accumulator of EMF 3.0 V (negligible internal resistance) and a 2.0 Ω series resistor. If a test cell balances at 50.0 cm along AB, what is the EMF of the test cell?",
    o: ["1.50 V", "1.25 V", "2.50 V", "1.00 V"],
    a: 1,
    e: "First find V_AB across the 10 Ω wire: V_AB = 3.0 × [10 / (10 + 2)] = 30 / 12 = 2.50 V. At l = 50 cm, E_x = (50 / 100) × 2.50 V = 1.25 V.",
    src: "JAMB 2021"
  },
  {
    q: "A cell balances at l₁ = 75.0 cm on a potentiometer when on open circuit. When a 4.0 Ω resistor is connected across the cell terminals, the balance length drops to l₂ = 60.0 cm. What is the internal resistance r of the cell?",
    o: ["0.80 Ω", "1.00 Ω", "1.25 Ω", "5.00 Ω"],
    a: 1,
    e: "r = R × [(l₁ − l₂) / l₂] = 4.0 × [(75.0 − 60.0) / 60.0] = 4.0 × (15 / 60) = 1.00 Ω.",
    src: "WAEC 2022"
  },
  {
    q: "In a WAEC metre bridge practical comparing two resistance wires 1 and 2 of the same material and equal length, the slope of the graph of l₂ against l₁ is found to be s = R₂ / R₁ = 2.25. What is the ratio of their diameters (d₁ : d₂)?",
    o: ["2.25 : 1", "1.50 : 1", "1 : 1.50", "5.06 : 1"],
    a: 1,
    e: "Since R ∝ 1/d², s = R₂ / R₁ = (d₁ / d₂)². Therefore √s = d₁ / d₂ = √2.25 = 1.50 (ratio 1.50 : 1).",
    src: "WAEC Practical Paper 3"
  },
  {
    q: "Which of the following is an accepted WAEC Practical precaution when using a metre bridge or potentiometer?",
    o: [
      "Drag the jockey firmly along the wire to clean the constantan surface",
      "I did not drag the jockey along the resistance wire so that its cross-sectional area remained uniform",
      "Keep the key closed throughout the experiment to keep the wire hot",
      "I will ensure tight connections next time"
    ],
    a: 1,
    e: "WAEC requires past-tense active precautions: tapping (not dragging) the jockey preserves uniform cross-sectional area A along the wire.",
    src: "WAEC Paper 3 Marking Scheme"
  },
  {
    q: "In a balanced Wheatstone bridge with four arms P, Q, R, and S in cyclic order, if P = 4 Ω, Q = 6 Ω, and R = 8 Ω, what value of S balances the bridge?",
    o: ["10 Ω", "12 Ω", "5.33 Ω", "16 Ω"],
    a: 1,
    e: "At balance, P / Q = R / S → 4 / 6 = 8 / S → S = (6 × 8) / 4 = 12 Ω.",
    src: "NECO 2017"
  },
  {
    q: "Why should the balance length l in a metre bridge experiment ideally lie near the middle of the wire (between 40 cm and 60 cm)?",
    o: [
      "To maximise the current through the galvanometer",
      "To minimise percentage errors due to end-resistances at the brass strips",
      "To make the wire heat up faster",
      "Because Ohm's law only holds at 50 cm"
    ],
    a: 1,
    e: "Balancing near 50 cm makes both l and (100 − l) reasonably large and symmetric, minimising the impact of contact/end resistances.",
    src: "WAEC 2016"
  },
  {
    q: "If the driver battery of a potentiometer has a LOWER EMF than the test cell being measured, what will be observed?",
    o: [
      "The balance point will be at 50.0 cm",
      "No balance point will be found anywhere along the 100 cm wire, and the galvanometer will deflect in one direction only",
      "The galvanometer needle will stay at zero everywhere",
      "The balance point will double"
    ],
    a: 1,
    e: "To achieve a null point, the maximum p.d. V_AB across the potentiometer wire must exceed the EMF of the test cell.",
    src: "JAMB 2019"
  },
  {
    q: "If a 10 Ω resistor is connected in series with the centre-zero galvanometer in a metre bridge to protect it from large off-balance currents, how does this affect the balance length l?",
    o: [
      "It shifts the balance point by 10 cm to the right",
      "It leaves the balance point unchanged because at balance I_g = 0",
      "It halves the balance length",
      "It doubles the balance length"
    ],
    a: 1,
    e: "At the null point, current through the galvanometer branch is zero (I_g = 0), so any protective resistor in series with G drops 0 V and does not shift the balance length!",
    src: "WAEC 2023"
  },
  {
    q: "Along a uniform 100 cm potentiometer wire across which a steady potential difference of 2.0 V is maintained, what is the potential gradient k?",
    o: ["0.020 V cm⁻¹", "50 V cm⁻¹", "2.0 V cm⁻¹", "0.20 V cm⁻¹"],
    a: 0,
    e: "Potential gradient k = V_AB / L = 2.0 V / 100 cm = 0.020 V cm⁻¹ (or 2.0 V m⁻¹).",
    src: "NECO 2021"
  }
];
