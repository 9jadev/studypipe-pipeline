/* Lesson 05 · Null Methods — Metre Bridge, Potentiometer & WAEC Practicals.
   window.L05 holds the sort cards, the length explorer pins and the mystery-verdict bridge.
   window.LESSON_QUIZ = the 12 MCQs of 03-questions.md § Lesson 05 Part 1 (keys unchanged).
   Every bench/zoom number comes from the kits' models, not from this file. */
(function () {
  "use strict";

  window.L05 = {
    // ---- 2A sort: metre bridge / potentiometer / both ----
    bins: {
      "metre-bridge": "Metre bridge",
      "potentiometer": "Potentiometer",
      "both": "True of both"
    },
    items: [
      { id: "balance",   bin: "metre-bridge",  name: "Balances when R/S = l/(100 − l)", why: "The two gap resistances match the ratio of the two wire lengths." },
      { id: "compareR",  bin: "metre-bridge",  name: "Compares two resistances", why: "A standard in one gap finds the unknown in the other." },
      { id: "slope",     bin: "metre-bridge",  name: "Slope of R₂ against R₁ gives the diameter ratio squared", why: "For equal wires of one material, R ∝ 1/d², so √slope = d₁/d₂." },
      { id: "vkl",       bin: "potentiometer", name: "p.d. along a uniform wire grows with length", why: "A steady current makes V = kl: the potentiometer principle." },
      { id: "compareE",  bin: "potentiometer", name: "Compares two EMFs by their balance lengths", why: "E₁/E₂ = l₁/l₂, because each cell balances where V = kl equals its EMF." },
      { id: "nocurrent", bin: "potentiometer", name: "Draws no current from the test cell at balance", why: "At the null point I = 0 through the test cell, so no lost volts." },
      { id: "internal",  bin: "potentiometer", name: "Finds a cell's internal resistance from two lengths", why: "r = R(l₁ − l₂)/l₂ from the open and loaded balance lengths." },
      { id: "jockey",    bin: "both",          name: "Uses a centre-zero galvanometer and a jockey", why: "Both are null methods: you slide the jockey for a zero reading." },
      { id: "tight",     bin: "both",          name: "Needs tight, clean joints and no wire heating", why: "Loose contacts and a warming wire spoil the length ratio in either method." },
      { id: "jockeyoff", bin: "potentiometer", name: "Reads the galvanometer with the jockey lifted first", why: "The potentiometer practical checks the swing direction before balancing." }
    ],

    // ---- length explorer (#pos-explorer): V = kl on the school wire (k = 0.0200 V cm⁻¹) ----
    k: 0.0200,
    pins: [20, 40, 60, 75, 80, 100],

    // ---- mystery verdict bridge (#bridge) ----
    bridge: [
      {
        q: "At the null point, how much current flows from Emeka's battery?",
        o: ["Zero — the galvanometer reads nothing", "The full starter current, 3.0 A", "A small leakage current"],
        a: 0,
        why: "At balance the galvanometer reads zero, so no current is drawn from the battery."
      },
      {
        q: "So the balance length of 80.0 cm measures the battery's true…",
        o: ["terminal p.d. under load", "electromotive force (EMF)", "internal resistance"],
        a: 1,
        why: "With I = 0 there are no lost volts, so V = E: the balance gives the EMF, 0.150 × 80.0 = 12.0 V."
      },
      {
        q: "The fault in Emeka's battery is that its…",
        o: ["EMF has fallen to 8.4 V", "internal resistance has risen", "connecting cables are broken"],
        a: 1,
        why: "The EMF is unchanged at 12.0 V; a risen internal resistance drops 3.6 V under the 3.0 A starter load."
      }
    ]
  };

  window.LESSON_QUIZ = [
    {
      q: "Engr. Nkechi tells Chinedu that her slide-wire potentiometer works on one simple principle. Which statement gives that principle?",
      o: [
        "The p.d. across a wire is the same whatever length of it you choose.",
        "With a steady current in a uniform wire, the p.d. between two points on it is directly proportional to the length of wire between them.",
        "The current in a uniform wire grows in direct proportion to its length.",
        "The resistance of a wire grows in direct proportion to its cross-sectional area."
      ],
      a: 1,
      e: "A steady current along an even wire drops the same p.d. in every centimetre, so V = kl, where k is the potential gradient in V cm⁻¹. A forgets that p.d. builds up with length. C is wrong because the current is the same at every point of a single wire; it is the p.d. that grows with length. D turns R = ρL/A upside down: resistance falls as the area grows."
    },
    {
      q: "Chinedu connects a 6.3 Ω standard resistor across the left gap of a metre bridge and an unknown coil across the right gap. The galvanometer reads zero when the jockey is 70.0 cm from the left end. What is the resistance of the coil?",
      o: ["14.7 Ω", "9.0 Ω", "4.4 Ω", "2.7 Ω"],
      a: 3,
      e: "At balance the left resistance ÷ the right resistance = l/(100 − l), so 6.3/R = 70.0/30.0 and R = 6.3 × 30.0/70.0 = 2.7 Ω. A inverts the length ratio. B uses 100/l instead of (100 − l)/l. C uses l/100 (6.3 × 70.0/100 = 4.4 Ω)."
    },
    {
      q: "On Nkechi's potentiometer a standard cell of EMF 1.08 V balances at 54.0 cm. A dry cell from Emeka's torch balances at 72.5 cm on the same wire with the same driver current. What is the EMF of the dry cell?",
      o: ["1.45 V", "0.80 V", "0.37 V", "1.34 V"],
      a: 0,
      e: "E₁/E₂ = l₁/l₂, so E = 1.08 × 72.5/54.0 = 1.45 V. The dry cell needs a longer length, so its EMF is larger than 1.08 V. B inverts the ratio. C uses only the length difference. D stops at 72.5/54.0 and forgets to multiply by 1.08 V."
    },
    {
      q: "Under the starter, Chinedu's voltmeter showed only 8.4 V across Emeka's battery, yet on the potentiometer the battery balanced at its full 12.0 V. Why does the potentiometer give the true EMF?",
      o: [
        "Its slide wire is longer than a voltmeter's coil, so it is more sensitive.",
        "The driver cell adds its own EMF to the battery, making up the missing volts.",
        "At the null point no current passes through the battery, so there is no Ir drop inside it and its terminal p.d. equals its EMF.",
        "It has a lower resistance than a voltmeter, so it draws a larger current and reads more fully."
      ],
      a: 2,
      e: "At balance the galvanometer reads zero, so no current flows through the test battery. With I = 0 the lost volts Ir are zero, and V = E − Ir becomes V = E. A confuses sensitivity with the real reason (zero current). B is wrong: at balance the driver's p.d. opposes the battery, it is not added. D is backwards: drawing more current would make the lost volts bigger and the reading smaller."
    },
    {
      q: "A cell balances at 84.0 cm on a potentiometer on open circuit. When a 4.0 Ω resistor is connected across it, the balance length falls to 70.0 cm. What is the internal resistance of the cell?",
      o: ["0.80 Ω", "0.67 Ω", "20 Ω", "0.20 Ω"],
      a: 0,
      e: "r = R(l₁ − l₂)/l₂ = 4.0 × (84.0 − 70.0)/70.0 = 4.0 × 14.0/70.0 = 0.80 Ω. B divides by l₁ instead of l₂. C turns the fraction upside down. D forgets to multiply by R (14.0/70.0 = 0.20, with no ohms)."
    },
    {
      q: "A 100 cm potentiometer wire of resistance 4.0 Ω is in series with a 3.0 V driver accumulator (negligible internal resistance) and an 11.0 Ω resistor. At what length does a 0.060 V thermocouple balance?",
      o: ["2.0 cm", "5.5 cm", "7.5 cm", "2.7 cm"],
      a: 2,
      e: "The 3.0 V is shared: I = 3.0/(4.0 + 11.0) = 0.20 A; V_wire = 0.20 × 4.0 = 0.80 V; k = 0.80/100 = 0.0080 V cm⁻¹; l = 0.060/0.0080 = 7.5 cm. A is the trap of putting the whole 3.0 V across the wire. B leaves out the wire's 4.0 Ω. D uses the p.d. across the 11.0 Ω resistor instead of the wire."
    },
    {
      q: "In a Wheatstone bridge, P and Q are in series on one side, R and S in series on the other, and the galvanometer links the P–Q junction to the R–S junction. Which statement describes the balanced bridge?",
      o: [
        "P + Q = R + S, and the galvanometer reads zero.",
        "P/Q = S/R, and the galvanometer reads zero.",
        "P/Q = R/S, and the galvanometer current is at its largest.",
        "P/Q = R/S, and no current flows through the galvanometer."
      ],
      a: 3,
      e: "The bridge balances when each side divides the supply in the same ratio, P/Q = R/S, so the two junctions sit at the same potential and the galvanometer carries no current. A adds the resistances instead of taking ratios. B pairs them the wrong way round. C has the right ratio but mistakes the null point for maximum current."
    },
    {
      q: "In a metre-bridge practical, equal lengths of two wires A and B of the same material were tested in turn. A plot of R_B (vertical) against R_A was a straight line through the origin, of slope 2.25. What is d_A/d_B, the diameter of A ÷ the diameter of B?",
      o: ["2.25", "1.5", "0.67", "5.1"],
      a: 1,
      e: "For equal lengths of one material, R ∝ 1/d², so R_B/R_A = d_A²/d_B². The slope is R_B/R_A, so d_A/d_B = √2.25 = 1.5: wire A is the thicker one. A forgets the square root. C gives the ratio upside down. D squares the slope instead of rooting it."
    },
    {
      q: "While comparing cells on a potentiometer, Chinedu found the standard cell's balance length first. Later the driver accumulator ran down a little, but he still used his first potential gradient to work out the EMF of a cell balanced at the end. How was that EMF affected?",
      o: [
        "Too low, because a weaker driver made the balance length shorter.",
        "Unaffected, because no current is drawn from the test cell at balance.",
        "Too low, because the test cell supplied current through the galvanometer.",
        "Too high, because the smaller potential gradient pushed the balance point to a longer length."
      ],
      a: 3,
      e: "A weaker driver lowers k (V per cm), so the test cell needs more wire to balance; using the old larger k with the longer length makes E = kl come out too high. A has the direction wrong: a smaller k lengthens the balance length. B is true of the test cell but ignores that the wire's calibration itself changed. C is wrong because at balance the test cell supplies no current."
    },
    {
      q: "Which precaution for the potentiometer practical is written in a form a WAEC examiner would credit?",
      o: [
        "The jockey was pressed gently at each point on the wire and was not slid along it.",
        "I will make sure that all the connections are tight.",
        "I was careful when taking all my readings.",
        "The pendulum bob was given only a small angle of swing."
      ],
      a: 0,
      e: "A precaution must say what was actually done, in the past tense, and belong to this experiment; tapping the jockey stops it scraping and thinning the wire, which would spoil the uniform resistance per centimetre. B is in the future tense. C is too vague to show a real step. D belongs to a pendulum experiment."
    },
    {
      q: "A metre bridge with a 3.0 Ω resistor in each gap balances at 50.0 cm. Chinedu replaces the right-gap resistor with a 6.0 Ω coil, keeping 3.0 Ω on the left. Where is the new balance point, from the left end?",
      o: ["66.7 cm", "33.3 cm", "25.0 cm", "50.0 cm"],
      a: 1,
      e: "3.0/6.0 = l/(100 − l), so 2l = 100 − l, 3l = 100 and l = 33.3 cm. The smaller resistor is on the left, so the left share of the wire is the shorter one. A swaps the gaps. C simply halves the old length. D assumes a bridge always balances at the middle."
    },
    {
      q: "The potentiometer balances Emeka's battery at an EMF of 12.0 V. Under the 2.8 Ω starter, its terminal p.d. was 8.4 V. Tobe still says the battery is dead. What is the correct verdict?",
      o: [
        "The EMF has fallen to 8.4 V, so the battery should be thrown away.",
        "The internal resistance is 8.4/3.0 = 2.8 Ω, so the plates are completely worn out.",
        "The EMF is still 12.0 V; the internal resistance has risen to (12.0 − 8.4)/3.0 = 1.2 Ω, so the battery needs servicing, not dumping.",
        "The missing 3.6 V are lost in the connecting cables, so the battery's internal resistance is zero."
      ],
      a: 2,
      e: "I = V/R = 8.4/2.8 = 3.0 A; lost volts = 12.0 − 8.4 = 3.6 V, so r = 3.6/3.0 = 1.2 Ω (the same as r = R(E − V)/V = 2.8 × 3.6/8.4). The chemistry (EMF) is fine; only r has risen. A is Tobe's error of reading the loaded p.d. as the EMF. B divides the terminal p.d. by the current, giving the starter's resistance. D blames the wires, but the volts are lost across r."
    }
  ];
})();
