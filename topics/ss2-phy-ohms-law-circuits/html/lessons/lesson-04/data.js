/* Lesson 04 · Galvanometer Conversion: Ammeter Shunts & Voltmeter Multipliers — pure data (offline, no fetch) */
window.L01 = {
  items: [
    { id: "c1", name: "Full-Scale Deflection Current I_g (milliamperes)", emo: "🧭", group: "shm", fact: "I_g is the maximum safe current that drives the delicate moving-coil galvanometer pointer to full scale without burning the coil." },
    { id: "c2", name: "Galvanometer Coil Resistance R_g (ohms)", emo: "🌀", group: "shm", fact: "R_g is the resistance of the fine copper winding on the moving coil inside the galvanometer (typically 5 Ω to 100 Ω)." },
    { id: "c3", name: "Full-Scale Voltage Drop V_g = I_g × R_g", emo: "⚡", group: "shm", fact: "At full-scale deflection, the p.d. directly across the galvanometer terminals is V_g = I_g R_g." },
    { id: "c4", name: "Low-Resistance Shunt R_s Connected in PARALLEL", emo: "🔀", group: "periodic", fact: "To convert a galvanometer into an ammeter, connect a very low resistance shunt R_s in parallel so most current (I − I_g) bypasses the coil." },
    { id: "c5", name: "Shunt Formula: R_s = (I_g × R_g) ÷ (I − I_g)", emo: "📐", group: "periodic", fact: "Because shunt and coil are in parallel, equal p.d. gives I_g R_g = (I − I_g) R_s." },
    { id: "c6", name: "Ammeter Connected in SERIES with the Load", emo: "🔗", group: "periodic", fact: "An ammeter must be placed in series so all load current passes through it; an ideal ammeter has zero resistance (R_A → 0)." },
    { id: "c7", name: "High-Resistance Multiplier R_m Connected in SERIES", emo: "🛡️", group: "non", fact: "To convert a galvanometer into a voltmeter, connect a large multiplier resistor R_m in series to drop the excess voltage (V − I_g R_g)." },
    { id: "c8", name: "Multiplier Formula: R_m = (V ÷ I_g) − R_g", emo: "🧮", group: "non", fact: "Total voltmeter resistance is R_total = V / I_g = R_g + R_m, so the added series multiplier is R_m = (V / I_g) − R_g." },
    { id: "c9", name: "Voltmeter Connected in PARALLEL Across Component", emo: "📏", group: "non", fact: "A voltmeter is connected in parallel across two points; an ideal voltmeter has infinite resistance (R_V → ∞) so it draws zero current." },
    { id: "c10", name: "Exam Trap: Total Voltmeter R_total = V/I_g vs Added R_m", emo: "⚠️", group: "non", fact: "Always check whether WAEC/JAMB asks for the ADDED series multiplier R_m = (V/I_g) − R_g or the TOTAL voltmeter resistance V/I_g!" }
  ],

  trials: [
    { id: "t1", name: "5.0 A Ammeter Conversion (R_g = 20 Ω, I_g = 10 mA)", L: "Shunt in parallel", m: "I = 5.0 A", A: "I_s = 4.99 A", t: "0.0401 Ω", T: "0.200 V", T2: "99.8%", g: "R_s = 0.2 / 4.99", col: "#3ee6c4" },
    { id: "t2", name: "2.0 A Ammeter Conversion (R_g = 50 Ω, I_g = 20 mA)", L: "Shunt in parallel", m: "I = 2.0 A", A: "I_s = 1.98 A", t: "0.505 Ω", T: "1.000 V", T2: "99.0%", g: "R_s = 1.0 / 1.98", col: "#ffb23f" },
    { id: "t3", name: "10.0 A Ammeter Conversion (R_g = 9.9 Ω, I_g = 0.10 A)", L: "Shunt in parallel", m: "I = 10.0 A", A: "I_s = 9.90 A", t: "0.100 Ω", T: "0.990 V", T2: "99.0%", g: "R_s = 0.99 / 9.9", col: "#2fb344" },
    { id: "t4", name: "15.0 V Voltmeter Conversion (R_g = 20 Ω, I_g = 10 mA)", L: "Multiplier in series", m: "V = 15.0 V", A: "I_g = 10 mA", t: "1480 Ω", T: "0.200 V", T2: "98.7%", g: "R_tot = 1500 Ω", col: "#a855f7" },
    { id: "t5", name: "10.0 V Voltmeter Conversion (R_g = 5.0 Ω, I_g = 50 mA)", L: "Multiplier in series", m: "V = 10.0 V", A: "I_g = 50 mA", t: "195 Ω", T: "0.250 V", T2: "97.5%", g: "R_tot = 200 Ω", col: "#f43f5e" },
    { id: "t6", name: "100 V Voltmeter Conversion (R_g = 25 Ω, I_g = 5.0 mA)", L: "Multiplier in series", m: "V = 100 V", A: "I_g = 5 mA", t: "19975 Ω", T: "0.125 V", T2: "99.9%", g: "R_tot = 20000 Ω", col: "#38bdf8" }
  ],
  tOptions: ["0.0401 Ω", "0.505 Ω", "0.100 Ω", "1480 Ω", "195 Ω", "19975 Ω"],
  TOptions: ["0.200 V", "1.000 V", "0.990 V", "0.250 V", "0.125 V"],
  T2Options: ["99.8%", "99.0%", "98.7%", "97.5%", "99.9%"],

  pins: [
    { x: -1.5, name: "Bare Moving-Coil Galvanometer", num: "10 mA / 20 Ω", cat: "shm", col: "#ffb23f", desc: "Delicate pointer coil: full-scale deflection occurs at I_g = 10 mA (0.010 A) and V_g = I_g R_g = 0.20 V. Any larger current burns it!" },
    { x: -0.5, name: "Ammeter with Parallel Shunt (0–5 A)", num: "R_s = 0.0401 Ω", cat: "periodic", col: "#3ee6c4", desc: "A heavy copper strip of 0.0401 Ω in parallel diverts 4.99 A around the coil while allowing exactly 0.010 A through the galvanometer." },
    { x: 0.5, name: "Voltmeter with Series Multiplier (0–15 V)", num: "R_m = 1480 Ω", cat: "non", col: "#a855f7", desc: "A high-resistance 1480 Ω resistor in series absorbs 14.80 V so only 0.20 V reaches the 20 Ω galvanometer coil at 15.0 V full scale." },
    { x: 1.5, name: "Ideal Meter Limits (R_A → 0, R_V → ∞)", num: "0 Ω vs ∞ Ω", cat: "non", col: "#2fb344", desc: "An ideal ammeter has zero resistance so it drops 0 V in series; an ideal voltmeter has infinite resistance so it draws 0 A in parallel." }
  ]
};

window.LESSON_QUIZ = [
  {
    q: "To convert a moving-coil galvanometer into a heavy-current ammeter, you must connect:",
    o: [
      "A high resistance (multiplier) in series with the galvanometer",
      "A low resistance (shunt) in parallel with the galvanometer",
      "A low resistance (shunt) in series with the galvanometer",
      "A high resistance (multiplier) in parallel with the galvanometer"
    ],
    a: 1,
    e: "An ammeter requires a low-resistance shunt in parallel so that the bulk of the main current (I − I_g) bypasses the delicate moving coil.",
    src: "WAEC 2017"
  },
  {
    q: "A galvanometer of resistance 20 Ω gives full-scale deflection when a current of 10 mA passes through it. What shunt resistance is required to convert it into an ammeter reading up to 5.0 A?",
    o: ["0.0400 Ω", "0.0401 Ω", "1980 Ω", "0.200 Ω"],
    a: 1,
    e: "I_g = 0.010 A, R_g = 20 Ω. R_s = (I_g × R_g) / (I − I_g) = (0.010 × 20) / (5.0 − 0.010) = 0.20 / 4.99 = 0.04008 Ω ≈ 0.0401 Ω.",
    src: "WAEC 2021"
  },
  {
    q: "Using the same galvanometer (R_g = 20 Ω, I_g = 10 mA), what multiplier resistance must be connected in series to convert it into a voltmeter reading up to 15.0 V?",
    o: ["1500 Ω", "1480 Ω", "1520 Ω", "300 Ω"],
    a: 1,
    e: "Total resistance R_total = V / I_g = 15.0 / 0.010 = 1500 Ω. Subtract the coil resistance: R_m = 1500 − 20 = 1480 Ω.",
    src: "JAMB 2018"
  },
  {
    q: "What is the TOTAL resistance of the 0–15.0 V voltmeter formed in the previous question (R_g = 20 Ω, R_m = 1480 Ω)?",
    o: ["1480 Ω", "1500 Ω", "20 Ω", "1520 Ω"],
    a: 1,
    e: "Watch the classic exam distinction: the added multiplier is R_m = 1480 Ω, while the TOTAL voltmeter resistance is R_total = R_g + R_m = 20 + 1480 = 1500 Ω.",
    src: "WAEC 2019"
  },
  {
    q: "A moving-coil galvanometer of resistance 5.0 Ω gives a full-scale deflection for a current of 50 mA. What series resistance is required to convert it to a voltmeter reading up to 10.0 V?",
    o: ["200 Ω", "195 Ω", "205 Ω", "0.25 Ω"],
    a: 1,
    e: "I_g = 0.050 A. R_m = (V / I_g) − R_g = (10.0 / 0.050) − 5.0 = 200 − 5.0 = 195 Ω.",
    src: "NECO 2020"
  },
  {
    q: "A galvanometer of resistance 99 Ω gives full-scale deflection for a current I_g. If it is shunted with a 1.0 Ω resistor, what fraction of the total main current passes through the galvanometer?",
    o: ["1 / 99", "1 / 100", "99 / 100", "1 / 10"],
    a: 1,
    e: "By the parallel current-divider rule: I_g / I = R_s / (R_g + R_s) = 1.0 / (99 + 1.0) = 1 / 100 (or 1% of the total current).",
    src: "JAMB 2022"
  },
  {
    q: "Why must a voltmeter have a very high resistance when connected in parallel across a circuit component?",
    o: [
      "So that it draws maximum current from the battery",
      "So that it draws negligible current and does not alter the potential difference being measured",
      "So that its internal heat dissipation I²R is maximised",
      "To increase the internal resistance of the cell"
    ],
    a: 1,
    e: "If a voltmeter has low resistance, it diverts current from the component it is measuring and lowers the true circuit p.d. ('loading effect').",
    src: "WAEC 2020"
  },
  {
    q: "A galvanometer with coil resistance R_g = 50 Ω and full-scale current I_g = 20 mA is converted into a 0–2.0 A ammeter. How much current flows through the parallel shunt at full-scale deflection?",
    o: ["2.00 A", "0.02 A", "1.98 A", "1.80 A"],
    a: 2,
    e: "At full-scale deflection, I_g = 20 mA = 0.02 A flows through the coil, so the remaining I_s = I − I_g = 2.00 − 0.02 = 1.98 A flows through the shunt.",
    src: "WAEC 2016"
  },
  {
    q: "What is the potential difference across the terminals of a galvanometer of resistance 40 Ω when it shows full-scale deflection for a current of 5.0 mA?",
    o: ["8.0 V", "0.20 V", "200 V", "0.02 V"],
    a: 1,
    e: "V_g = I_g × R_g = 0.005 A × 40 Ω = 0.20 V.",
    src: "JAMB 2016"
  },
  {
    q: "An ideal ammeter and an ideal voltmeter have resistances of:",
    o: [
      "Zero and infinity respectively",
      "Infinity and zero respectively",
      "Zero and zero respectively",
      "1.0 Ω and 1000 Ω respectively"
    ],
    a: 0,
    e: "An ideal ammeter (in series) has 0 Ω so it causes zero voltage drop; an ideal voltmeter (in parallel) has ∞ Ω so it draws zero current.",
    src: "NECO 2019"
  },
  {
    q: "A galvanometer of resistance 25 Ω gives full-scale deflection at 5.0 mA. To convert it into a 0–100 V voltmeter, the required multiplier resistance is:",
    o: ["20,000 Ω", "19,975 Ω", "20,025 Ω", "500 Ω"],
    a: 1,
    e: "R_m = (V / I_g) − R_g = (100 / 0.005) − 25 = 20,000 − 25 = 19,975 Ω.",
    src: "JAMB 2015"
  },
  {
    q: "If a technician accidentally connects a high-resistance voltmeter in SERIES with a load instead of in parallel, what happens to the circuit?",
    o: [
      "The voltmeter immediately burns out from excessive current",
      "The circuit current drops to almost zero and the voltmeter reads nearly the full EMF of the source",
      "The load operates at double its normal power",
      "The battery is short-circuited"
    ],
    a: 1,
    e: "Because a voltmeter has very high resistance (thousands of ohms), placing it in series reduces circuit current to nearly zero, and almost all the source EMF appears across the voltmeter.",
    src: "WAEC 2022"
  }
];
