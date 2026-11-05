/* Lesson 03 · Series & Parallel Networks, Cell Arrays, Power & Efficiency — pure data (offline, no fetch) */
window.L01 = {
  items: [
    { id: "c1", name: "Same Current I Through Every Resistor (I₁ = I₂)", emo: "➡️", group: "shm", fact: "In a series branch there is only one conducting path, so identical current I flows through every series element." },
    { id: "c2", name: "Same Voltage V Across Every Branch (V₁ = V₂)", emo: "🔀", group: "periodic", fact: "Parallel branches share the same two junction nodes, so the potential difference V across each parallel branch is equal." },
    { id: "c3", name: "Equivalent Resistance R_eq = R₁ + R₂ + R₃", emo: "➕", group: "shm", fact: "Connecting resistors in series increases effective length, so total resistance is the direct sum and exceeds the largest single resistor." },
    { id: "c4", name: "Two-Resistor Product-Over-Sum: R₁R₂ ÷ (R₁ + R₂)", emo: "➗", group: "periodic", fact: "Adding a parallel path increases effective cross-sectional area, making equivalent resistance smaller than the smallest branch resistor." },
    { id: "c5", name: "Current Divider: I₁ = I_total × R₂ ÷ (R₁ + R₂)", emo: "⚖️", group: "periodic", fact: "In a two-branch parallel network, the branch with LOWER resistance carries the LARGER share of current (inverse ratio)." },
    { id: "c6", name: "Cells in Series: E_eq = nE and r_eq = nr", emo: "🔋", group: "shm", fact: "Connecting n identical cells in series boosts total EMF to nE, but their internal resistances also add up to nr." },
    { id: "c7", name: "Identical Cells in Parallel: E_eq = E and r_eq = r ÷ n", emo: "🪫", group: "periodic", fact: "Connecting n identical cells in parallel keeps EMF at E while slashing total internal resistance to r/n for heavy-current loads!" },
    { id: "c8", name: "Cell Efficiency η = [R ÷ (R + r)] × 100%", emo: "📈", group: "non", fact: "Efficiency equals useful load power I²R divided by total chemical power I²(R + r), simplified to V/E or R/(R + r)." },
    { id: "c9", name: "Joule Heating Rate P = I²R = V² ÷ R = IV (watts)", emo: "🔥", group: "non", fact: "Electrical power dissipated as thermal energy in a resistor is measured in watts (J s⁻¹)." },
    { id: "c10", name: "Maximum Power Transfer When R = r (η = 50%)", emo: "🎯", group: "non", fact: "External load power P_load peaks when load resistance matches internal resistance (R = r), where efficiency is 50%." }
  ],

  trials: [
    { id: "t1", name: "Series Resistor Pair (4 Ω + 12 Ω on 12 V, r = 0)", L: "R₁ = 4 Ω, R₂ = 12 Ω", m: "E = 12 V", A: "I = 0.75 A", t: "16.0 Ω", T: "9.0 W", T2: "100%", g: "I = 12/16 = 0.75 A", col: "#3ee6c4" },
    { id: "t2", name: "Parallel Resistor Pair (4 Ω ∥ 12 Ω on 12 V, r = 0)", L: "R₁ = 4 Ω, R₂ = 12 Ω", m: "E = 12 V", A: "I = 4.00 A", t: "3.0 Ω", T: "48.0 W", T2: "100%", g: "I₁=3 A, I₂=1 A", col: "#ffb23f" },
    { id: "t3", name: "Series-Parallel Combo (3 Ω + (4 Ω ∥ 12 Ω) + r = 1 Ω on 14 V)", L: "E = 14 V, r = 1 Ω", m: "3 Ω + (4 Ω ∥ 12 Ω)", A: "I = 2.00 A", t: "6.0 Ω", T: "24.0 W", T2: "85.7%", g: "1.50 A in the 4 Ω branch", col: "#a855f7" },
    { id: "t4", name: "3 Cells in Series (each 2.0 V, 1.5 Ω) driving R = 1.5 Ω", L: "E_eq = 6.0 V", m: "r_eq = 4.5 Ω", A: "I = 1.00 A", t: "1.5 Ω", T: "1.50 W", T2: "25.0%", g: "V_load = 1.50 V", col: "#f43f5e" },
    { id: "t5", name: "3 Cells in Parallel (each 2.0 V, 1.5 Ω) driving R = 1.5 Ω", L: "E_eq = 2.0 V", m: "r_eq = 0.5 Ω", A: "I = 1.00 A", t: "1.5 Ω", T: "1.50 W", T2: "75.0%", g: "r drops 3× → 3× η!", col: "#2fb344" },
    { id: "t6", name: "3 Cells in Parallel (each 2.0 V, 1.5 Ω) driving Heavy Starter R = 0.3 Ω", L: "E_eq = 2.0 V", m: "r_eq = 0.5 Ω", A: "I = 2.50 A", t: "0.3 Ω", T: "1.88 W", T2: "37.5%", g: "Beats series (1.25 A)!", col: "#38bdf8" }
  ],
  tOptions: ["16.0 Ω", "3.0 Ω", "6.0 Ω", "1.5 Ω", "0.3 Ω"],
  TOptions: ["9.0 W", "48.0 W", "24.0 W", "1.50 W", "1.88 W"],
  T2Options: ["100%", "85.7%", "25.0%", "75.0%", "37.5%"],

  pins: [
    { x: -1.5, name: "Series Single-File Road (R₁ + R₂)", num: "16.0 Ω", cat: "shm", col: "#3ee6c4", desc: "One narrow single-lane road: all cars (electrons) must pass through R₁ AND R₂, so total resistance rises to R₁ + R₂." },
    { x: -0.5, name: "Parallel Express Lanes (R₁ ∥ R₂)", num: "3.0 Ω", cat: "periodic", col: "#ffb23f", desc: "Opening a second parallel highway lane lets 3× more current take the wider 4 Ω lane than the 12 Ω lane, dropping R_eq to 3.0 Ω." },
    { x: 0.5, name: "Series Cell Array (nE, nr)", num: "η = 25%", cat: "shm", col: "#f43f5e", desc: "Three cells in series triple EMF to 6.0 V, but also triple internal resistance to 4.5 Ω — choking heavy low-resistance loads." },
    { x: 1.5, name: "Parallel Cell Bank (E, r/n)", num: "η = 75%", cat: "periodic", col: "#2fb344", desc: "Three identical cells in parallel keep E = 2.0 V while slashing r_eq to 0.5 Ω — tripling efficiency and doubling starter current!" }
  ]
};

window.LESSON_QUIZ = [
  {
    q: "Three resistors of 2 Ω, 3 Ω, and 6 Ω are connected in parallel. What is their combined equivalent resistance?",
    o: ["1.0 Ω", "11.0 Ω", "0.5 Ω", "2.0 Ω"],
    a: 0,
    e: "1/R_eq = 1/2 + 1/3 + 1/6 = (3 + 2 + 1)/6 = 6/6 = 1 Ω⁻¹ → R_eq = 1.0 Ω.",
    src: "WAEC 2018"
  },
  {
    q: "A total main current of 10 A enters a parallel combination of a 2 Ω resistor and an 8 Ω resistor. What current flows through the 2 Ω resistor?",
    o: ["2.0 A", "8.0 A", "5.0 A", "4.0 A"],
    a: 1,
    e: "By the current-divider rule (inverse branch ratio): I_2Ω = I_total × [R_other / (R₁ + R₂)] = 10 × (8 / 10) = 8.0 A.",
    src: "JAMB 2020"
  },
  {
    q: "Four identical cells, each of EMF 1.5 V and internal resistance 2.0 Ω, are connected in parallel across a 3.5 Ω load. What are the equivalent EMF and internal resistance of the battery bank?",
    o: ["E_eq = 6.0 V, r_eq = 8.0 Ω", "E_eq = 6.0 V, r_eq = 0.5 Ω", "E_eq = 1.5 V, r_eq = 0.5 Ω", "E_eq = 1.5 V, r_eq = 8.0 Ω"],
    a: 2,
    e: "For n identical cells in parallel, E_eq = E = 1.5 V and r_eq = r/n = 2.0 / 4 = 0.5 Ω.",
    src: "JAMB 2019"
  },
  {
    q: "Using the four parallel cells (E_eq = 1.5 V, r_eq = 0.5 Ω) connected across the 3.5 Ω external resistor, what current flows through the 3.5 Ω load?",
    o: ["0.375 A", "0.522 A", "0.150 A", "0.429 A"],
    a: 0,
    e: "I = E_eq / (R + r_eq) = 1.5 / (3.5 + 0.5) = 1.5 / 4.0 = 0.375 A.",
    src: "NECO 2021"
  },
  {
    q: "A 3 Ω resistor is connected in series with a parallel combination of 6 Ω and 12 Ω resistors. What is the total resistance of the network?",
    o: ["21.0 Ω", "7.0 Ω", "9.0 Ω", "5.0 Ω"],
    a: 1,
    e: "First reduce the parallel pair: R_p = (6 × 12)/(6 + 12) = 72/18 = 4.0 Ω. Add the series 3 Ω: R_total = 3 + 4 = 7.0 Ω.",
    src: "WAEC 2016"
  },
  {
    q: "A cell of EMF 6.0 V and internal resistance 1.0 Ω supplies current to an external load of 3.0 Ω. What is the electrical efficiency of this circuit?",
    o: ["83.3%", "75.0%", "66.7%", "25.0%"],
    a: 1,
    e: "η = [R / (R + r)] × 100% = [3.0 / (3.0 + 1.0)] × 100% = 75.0%.",
    src: "WAEC 2022"
  },
  {
    q: "Two resistors of 5 Ω and 10 Ω are connected in SERIES across a battery. What is the ratio of the power dissipated in the 5 Ω resistor to that in the 10 Ω resistor (P_5Ω : P_10Ω)?",
    o: ["2 : 1", "1 : 2", "1 : 4", "4 : 1"],
    a: 1,
    e: "In series, current I is identical in both resistors, so use P = I²R. Thus P_5Ω : P_10Ω = 5 : 10 = 1 : 2.",
    src: "JAMB 2017"
  },
  {
    q: "If the same 5 Ω and 10 Ω resistors are instead connected in PARALLEL across the battery, what is the ratio of their powers (P_5Ω : P_10Ω)?",
    o: ["2 : 1", "1 : 2", "4 : 1", "1 : 4"],
    a: 0,
    e: "In parallel, voltage V is identical across both branches, so use P = V²/R. Thus P_5Ω : P_10Ω = (1/5) : (1/10) = 2 : 1.",
    src: "JAMB 2021"
  },
  {
    q: "A 24 V battery with negligible internal resistance is connected to a 4 Ω resistor in series with two parallel 8 Ω resistors. How much power is dissipated in the 4 Ω resistor?",
    o: ["36 W", "64 W", "144 W", "72 W"],
    a: 0,
    e: "R_p = (8 × 8)/(8 + 8) = 4 Ω. R_total = 4 + 4 = 8 Ω. Main current I = 24 / 8 = 3.0 A. Power in 4 Ω = I²R = (3.0)² × 4 = 36 W.",
    src: "WAEC 2019"
  },
  {
    q: "Three identical cells, each of EMF 2.0 V and internal resistance 0.6 Ω, are connected in SERIES to a 4.2 Ω load. What is the terminal voltage across the battery pack?",
    o: ["6.0 V", "4.2 V", "1.8 V", "5.4 V"],
    a: 1,
    e: "E_eq = 3 × 2.0 = 6.0 V; r_eq = 3 × 0.6 = 1.8 Ω. I = 6.0 / (4.2 + 1.8) = 6.0 / 6.0 = 1.0 A. V = I R = 1.0 × 4.2 = 4.2 V.",
    src: "NECO 2018"
  },
  {
    q: "When is it advantageous to connect identical cells in PARALLEL rather than in series?",
    o: [
      "When the external load resistance R is much larger than the cell internal resistance r",
      "When the external load resistance R is very small compared with the cell internal resistance r",
      "When we want the highest possible open-circuit EMF",
      "Never — series cells always deliver more current"
    ],
    a: 1,
    e: "When R ≪ r (a low-resistance heavy load like a starter motor), internal resistance dominates; connecting cells in parallel reduces r_eq to r/n and delivers larger current.",
    src: "WAEC 2023"
  },
  {
    q: "An immersion heater rated 1200 W operates for 5 minutes. How much electrical energy is converted into heat?",
    o: ["6.0 × 10³ J", "2.4 × 10² J", "3.6 × 10⁵ J", "7.2 × 10⁴ J"],
    a: 2,
    e: "Energy E = P × t = 1200 W × (5 × 60 s) = 1200 × 300 = 360,000 J = 3.6 × 10⁵ J.",
    src: "WAEC 2015"
  }
];
