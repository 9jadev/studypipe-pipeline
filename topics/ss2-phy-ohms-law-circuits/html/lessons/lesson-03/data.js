/* Lesson 03 · Series & Parallel Networks, Cell Arrays, Power & Efficiency
   Sort cards, load-pin explorer data and the 12 quiz questions (03-questions.md § Lesson 03).
   The single cell for the P–R and η–R trials is E = 5.0 V, r = 0.5 Ω. */
(function () {
  "use strict";

  window.L03 = {
    cell: { E: 5.0, r: 0.5 },                       // fixed cell behind the P–R / η–R data
    loads: [0.1, 0.5, 1.0, 2.0, 4.0],              // load R values (Ω) for the explorer and bench

    // ---- 2A sort: series or parallel behaviour? (10 cards, 3 bins) ----
    bins: [
      { id: "series", label: "Series", hint: "one path, one current" },
      { id: "parallel", label: "Parallel", hint: "shared p.d., split current" },
      { id: "either", label: "Either / both", hint: "true of any circuit" }
    ],
    items: [
      { id: "i1", name: "Same current through every part", bin: "series", why: "One path means the same current flows everywhere in series." },
      { id: "i2", name: "The voltages add up", bin: "series", why: "In series each part takes a share, so the p.d.s add to the supply p.d." },
      { id: "i3", name: "Resistances add directly (R = R₁ + R₂)", bin: "series", why: "A longer single path adds its resistances directly." },
      { id: "i4", name: "Cells here add EMF and add r", bin: "series", why: "n cells in series give Eₜ = nE and rₜ = nr: more voltage, more internal resistance." },
      { id: "i5", name: "Same p.d. across every branch", bin: "parallel", why: "Parallel branches join the same two points, so they share one p.d." },
      { id: "i6", name: "Currents split and add (I = I₁ + I₂)", bin: "parallel", why: "At a junction the current divides between branches and rejoins." },
      { id: "i7", name: "Total R is less than the smallest branch", bin: "parallel", why: "An extra path lets more current flow, so the combined resistance drops below any branch." },
      { id: "i8", name: "Identical cells keep one EMF and give r/n", bin: "parallel", why: "Identical cells in parallel give Eₜ = E and rₜ = r/n: same voltage, less internal resistance." },
      { id: "i9", name: "Total current leaves and returns to the source", bin: "either", why: "Charge is conserved: whatever leaves the source comes back to it in any circuit." },
      { id: "i10", name: "Energy is conserved round any loop", bin: "either", why: "Kirchhoff's voltage law: the EMF equals the sum of the p.d.s round any loop, series or parallel." }
    ],

    // ---- load explorer pins: E = 5.0 V, r = 0.5 Ω; I, P and η computed from the model in lesson.js ----
    pins: [
      { R: 0.1, note: "A very heavy load. Big current, but little power reaches R and most is wasted inside the cell." },
      { R: 0.5, note: "R = r: the output power peaks here (12.5 W), yet the efficiency is only 50 %." },
      { R: 1.0, note: "Past the peak, output power falls while efficiency keeps climbing." },
      { R: 2.0, note: "A lighter load: less current, less wasted power, efficiency now 80 %." },
      { R: 4.0, note: "R ≫ r: high efficiency (88.9 %) but the output power is small." }
    ]
  };

  window.LESSON_QUIZ = [
    {
      q: "Chinedu wires three lamps side by side (in parallel) across one supply. Which statement about this arrangement is correct?",
      o: [
        "Every lamp carries the same current, whatever its resistance",
        "Every lamp has the same p.d. across it, and the lamp currents add up to the supply current",
        "The combined resistance is larger than that of the largest lamp",
        "The p.d.s across the three lamps add up to the supply p.d."
      ],
      a: 1,
      e: "Parallel branches join the same two points, so each has the same p.d., and at the junction the current divides, so I = I₁ + I₂ + I₃. A is the series rule carried over wrongly. C is also a series property; in parallel the combination is <em>smaller</em> than the smallest branch. D is the series rule for p.d.s."
    },
    {
      q: "Resistors of 3.0 Ω, 6.0 Ω and 12.0 Ω are connected in parallel. What is their combined resistance?",
      o: ["21 Ω", "0.58 Ω", "10.3 Ω", "1.71 Ω"],
      a: 3,
      e: "1/R = 1/3.0 + 1/6.0 + 1/12.0 = 0.333 + 0.167 + 0.083 = 0.583 Ω⁻¹, so R = 1 ÷ 0.583 = 1.71 Ω. A added them as if in series. B stopped at 1/R and forgot the reciprocal. C used product-over-sum, which only works for a pair."
    },
    {
      q: "In Emeka's backup lighting circuit, a 2.5 Ω resistor is in series with a parallel pair of 10 Ω and 15 Ω. What is the total resistance of the network?",
      o: ["8.5 Ω", "27.5 Ω", "1.76 Ω", "15.0 Ω"],
      a: 0,
      e: "Reduce the pair first: R_p = (10 × 15) ÷ (10 + 15) = 150 ÷ 25 = 6.0 Ω; then add the series resistor: R = 2.5 + 6.0 = 8.5 Ω. B added all three in series. C put all three in parallel. D used the average of 10 and 15; a parallel pair is always smaller than its smaller member."
    },
    {
      q: "A battery of EMF 9.0 V and internal resistance 0.50 Ω drives a 2.5 Ω resistor in series with a parallel pair of 4.0 Ω and 12.0 Ω. What current flows in the 12.0 Ω branch?",
      o: ["1.5 A", "1.1 A", "0.38 A", "0.75 A"],
      a: 2,
      e: "R_p = (4.0 × 12.0) ÷ 16.0 = 3.0 Ω; total R + r = 2.5 + 3.0 + 0.50 = 6.0 Ω; I = 9.0 ÷ 6.0 = 1.5 A; p.d. across the pair V_p = 1.5 × 3.0 = 4.5 V; so I₁₂ = 4.5 ÷ 12.0 = 0.375 ≈ 0.38 A. A is the total current, never split. B is the 4.0 Ω branch current. D split the total equally, which only happens for equal branches."
    },
    {
      q: "Three identical cells, each of EMF 2.0 V and internal resistance 0.90 Ω, are joined in parallel. What are the EMF and internal resistance of the combination?",
      o: ["2.0 V and 0.30 Ω", "6.0 V and 2.7 Ω", "6.0 V and 0.30 Ω", "2.0 V and 2.7 Ω"],
      a: 0,
      e: "Identical cells in parallel keep one cell's EMF (2.0 V), and their internal resistances act as parallel branches: rₜ = r ÷ n = 0.90 ÷ 3 = 0.30 Ω. B is the series result. C added the EMFs (series) but divided r (parallel). D kept one EMF but added the resistances."
    },
    {
      q: "Four cells, each of EMF 1.5 V and internal resistance 0.50 Ω, are joined in series to light a 4.0 Ω inspection lamp. What current flows?",
      o: ["1.5 A", "1.0 A", "0.36 A", "1.3 A"],
      a: 1,
      e: "In series, Eₜ = 4 × 1.5 = 6.0 V and rₜ = 4 × 0.50 = 2.0 Ω, so I = Eₜ ÷ (R + rₜ) = 6.0 ÷ (4.0 + 2.0) = 1.0 A. A forgot the internal resistance. C used the parallel arrangement. D added only one cell's internal resistance."
    },
    {
      q: "Emeka's backup pump has a resistance of only 0.40 Ω. He has two identical cells, each of EMF 1.5 V and internal resistance 1.0 Ω. Which arrangement drives the larger current through the pump, and how large is it?",
      o: ["Series, 1.25 A", "Series, 7.5 A", "Parallel, 3.75 A", "Parallel, 1.67 A"],
      a: 3,
      e: "Series: I = 3.0 ÷ (0.40 + 2.0) = 1.25 A. Parallel: Eₜ = 1.5 V, rₜ = 0.50 Ω, so I = 1.5 ÷ (0.40 + 0.50) = 1.67 A, which is larger. For a low-resistance load the internal resistance dominates, so halving it beats doubling the EMF. A is the smaller series current (Tobe's idea). B and C ignored the internal resistance."
    },
    {
      q: "A keke headlamp is rated 24 W, 12 V. What is its resistance when it works normally?",
      o: ["2.0 Ω", "288 Ω", "6.0 Ω", "0.50 Ω"],
      a: 2,
      e: "P = V²/R, so R = V² ÷ P = 12² ÷ 24 = 144 ÷ 24 = 6.0 Ω. A (24 ÷ 12) is the current in amperes mislabelled. B multiplied V by P. D (12 ÷ 24) divided voltage by power, which has no meaning here."
    },
    {
      q: "Engr. Nkechi's 750 W electric kettle is switched on for 4.0 minutes. How much electrical energy does it use?",
      o: ["3.0 kJ", "180 kJ", "187.5 J", "10.8 MJ"],
      a: 1,
      e: "Convert the time first: t = 4.0 × 60 = 240 s; then W = Pt = 750 × 240 = 180 000 J = 180 kJ. A left the time in minutes. C divided instead of multiplying. D treated 4.0 minutes as 4.0 hours."
    },
    {
      q: "A cell of EMF 6.0 V and internal resistance 0.80 Ω drives a 3.2 Ω load. What is the efficiency of the cell?",
      o: ["80 %", "20 %", "25 %", "75 %"],
      a: 0,
      e: "η = R ÷ (R + r) × 100 % = 3.2 ÷ (3.2 + 0.80) × 100 % = 3.2 ÷ 4.0 × 100 % = 80 %. (Check: I = 1.5 A; useful I²R = 7.2 W; total EI = 9.0 W; 7.2 ÷ 9.0 = 80 %.) B is the fraction wasted inside. C divided r by R. D used an invented formula."
    },
    {
      q: "Chinedu varies the load R on a cell of internal resistance 1.5 Ω and plots the power delivered to the load against R. Which description of the graph is correct?",
      o: [
        "A straight line through the origin, rising steadily as R increases",
        "A line that falls steadily from its highest value at R = 0",
        "A smooth curve that rises to a single maximum at R = 1.5 Ω and then falls",
        "A smooth curve with its maximum at R = 1.5 Ω, where the efficiency is 100 %"
      ],
      a: 2,
      e: "Load power P = E²R ÷ (R + r)² is zero at R = 0, zero again as R grows very large, and peaks where R = r = 1.5 Ω, so a smooth curve is drawn, never a straight line. A treats it as linear. B confuses power with current. D has the shape right but the wrong efficiency: at R = r, η = 50 %."
    },
    {
      q: "Emeka's worn battery (EMF 12.0 V, internal resistance 1.2 Ω) delivers 3.0 A to his starter. At what rate is energy turned into heat inside the battery itself?",
      o: ["36 W", "25.2 W", "3.6 W", "10.8 W"],
      a: 3,
      e: "The power wasted inside is I²r = 3.0² × 1.2 = 9.0 × 1.2 = 10.8 W, which is why the battery runs hot. A (EI) is the total power converted. B (I²R) is the useful power in the 2.8 Ω starter. C (Ir) is the lost volts, not multiplied by the current again."
    }
  ];
})();
