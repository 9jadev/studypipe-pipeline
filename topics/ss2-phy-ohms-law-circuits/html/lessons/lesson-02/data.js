/* Lesson 02 · EMF, Terminal P.D., Lost Volts & Internal Resistance — content data and 12 WAEC/NECO/JAMB quiz questions */
(function () {
  "use strict";

  window.L01 = {
    // ---- 1. EMF, Terminal P.D. & Lost Volts Sort items ----
    items: [
      { id: "emf_def", name: "Total electrical energy supplied per coulomb by the source (W_total / Q)", emo: "⚡", bin: "shm", why: "Electromotive force (E) is the total energy supplied per unit charge around the entire circuit (inside + outside)." },
      { id: "open_v", name: "Voltmeter reading across cell terminals when the plug key is OPEN (I = 0)", emo: "🔓", bin: "shm", why: "When current I = 0, lost volts Ir = 0, so terminal p.d. equals the open-circuit EMF (V = E)." },
      { id: "v_int", name: "Vertical axis intercept on a graph of Terminal P.D. (V) against Current (I)", emo: "📈", bin: "shm", why: "In V = −rI + E, the vertical intercept at I = 0 gives the electromotive force E." },
      { id: "pot_null", name: "Voltage measured by a potentiometer at the null balance point (I_g = 0)", emo: "🎯", bin: "shm", why: "Because zero current is drawn at null balance, no voltage is dropped across r and true EMF E is measured." },
      { id: "term_pd", name: "Potential difference V = IR across the external load resistor R when key is CLOSED", emo: "💡", bin: "periodic", why: "Terminal potential difference V is the useful energy per coulomb delivered to the external circuit (V = E − Ir)." },
      { id: "closed_v", name: "Reading of 8.4 V across Chinedu's 12.0 V battery while cranking a 2.8 Ω starter", emo: "🚗", bin: "periodic", why: "Under a 3.0 A load, 3.6 V is lost inside the battery (Ir), leaving a terminal p.d. of V = 8.4 V." },
      { id: "ext_work", name: "Useful electrical work done per coulomb outside the battery terminals", emo: "🔌", bin: "periodic", why: "Terminal p.d. V measures work done per unit charge in the external load R only." },
      { id: "eff_num", name: "Numerator V in the cell efficiency formula η = (V ÷ E) × 100%", emo: "📊", bin: "periodic", why: "Cell efficiency is the ratio of useful terminal voltage V = IR to total EMF E = I(R + r)." },
      { id: "lost_v", name: "Potential drop v = Ir dissipated as heat inside the battery electrolyte", emo: "🔥", bin: "non", why: "Lost volts (v = Ir) is the potential difference wasted overcoming the cell's internal resistance r." },
      { id: "electrolyte", name: "Opposition to ion flow offered by the acid and plates inside the cell (r)", emo: "🧪", bin: "non", why: "Internal resistance r arises from the finite ionic conductivity of the electrolyte and electrodes." },
      { id: "slope_vi", name: "Magnitude of the negative gradient (−ΔV / ΔI) of a V-against-I cell graph", emo: "📐", bin: "non", why: "From V = −rI + E, the slope of V against I is −r, so the magnitude of the slope equals internal resistance r." },
      { id: "two_read", name: "Unknown r solved from I₁(R₁ + r) = I₂(R₂ + r) using two external resistors", emo: "🧮", bin: "non", why: "Equating E for two different loads directly yields the internal resistance r of the cell." }
    ],

    // ---- 2. 3D Internal Resistance Practical trials (Cell E = 12.0 V, r = 1.20 Ω) ----
    // L = External Load R (Ω), t = Current I (A), T = Terminal P.D. V (V), T2 = Lost Volts v = Ir (V)
    trials: [
      { label: "A", L: 10.8, t: "1.00", T: "10.80", T2: "1.20" },
      { label: "B", L: 6.8,  t: "1.50", T: "10.20", T2: "1.80" },
      { label: "C", L: 4.8,  t: "2.00", T: "9.60",  T2: "2.40" },
      { label: "D", L: 3.6,  t: "2.50", T: "9.00",  T2: "3.00" },
      { label: "E", L: 2.8,  t: "3.00", T: "8.40",  T2: "3.60" }
    ],
    tOptions: ["1.00", "1.50", "2.00", "2.50", "3.00"],
    TOptions: ["8.40", "9.00", "9.60", "10.20", "10.80"],
    T2Options: ["1.20", "1.80", "2.40", "3.00", "3.60"],

    // ---- 3. Load Current & Terminal Voltage Explorer pins (E = 12.0 V, r = 1.2 Ω) ----
    pins: [
      { frac: -1.0, label: "Open Circuit", emo: "🔓", x: "I = 0.00 A (R = ∞)", v: "V = 12.00 V (= E)", a: "v = 0.00 V (Zero loss)", ke: "100% E", pe: "0% Lost", note: "With the switch open, zero current flows through r. Lost volts Ir = 0, so the voltmeter reads the full EMF E = 12.0 V!" },
      { frac: -0.5, label: "Light Load", emo: "💡", x: "I = 1.00 A (R = 10.8 Ω)", v: "V = 10.80 V", a: "v = 1.20 V", ke: "90% V", pe: "10% Lost", note: "At 1.0 A, only 1.0 × 1.2 = 1.2 V is lost inside the cell, leaving 10.8 V across the external load." },
      { frac: 0.0,  label: "Medium Load", emo: "🎯", x: "I = 2.00 A (R = 4.8 Ω)", v: "V = 9.60 V", a: "v = 2.40 V", ke: "80% V", pe: "20% Lost", note: "Doubling current to 2.0 A doubles the internal voltage drop Ir to 2.40 V, pulling terminal voltage down to 9.60 V." },
      { frac: 0.5,  label: "Starter Load", emo: "🚗", x: "I = 3.00 A (R = 2.8 Ω)", v: "V = 8.40 V", a: "v = 3.60 V", ke: "70% V", pe: "30% Lost", note: "Chinedu's Aba Workshop case! At I = 3.0 A, v = 3.0 × 1.2 = 3.6 V is lost inside the battery, leaving V = 8.4 V." },
      { frac: 1.0,  label: "Short Circuit!", emo: "⚠️", x: "I_max = 10.0 A (R = 0 Ω)", v: "V = 0.00 V", a: "v = 12.00 V (All heat!)", ke: "0% V", pe: "100% Lost!", note: "If the terminals are shorted (R = 0), current surges to I_max = E/r = 12.0/1.2 = 10.0 A and all 12.0 V is dissipated as dangerous heat inside the battery!" }
    ]
  };

  // ---- 4. 12 WAEC / NECO / JAMB Quiz Questions ----
  window.LESSON_QUIZ = [
    {
      q: "Why is the <strong>terminal potential difference (V)</strong> of a cell less than its <strong>electromotive force (E)</strong> whenever current is being drawn from the cell?",
      o: [
        "Because part of the EMF is used up in overcoming the internal resistance r of the cell (lost volts = Ir)",
        "Because the external resistor creates extra charge",
        "Because the ammeter absorbs all the voltage",
        "Because EMF only exists in alternating current circuits"
      ],
      a: 0,
      e: "When current <strong>I</strong> flows, energy per coulomb <strong>v = Ir</strong> is lost as heat inside the electrolyte, leaving <strong>V = E − Ir</strong> for the external load.",
      src: "WAEC-style"
    },
    {
      q: "An accumulator of EMF <strong>12.0 V</strong> and internal resistance <strong>1.2 Ω</strong> is connected to a starter load of resistance <strong>2.8 Ω</strong>. What are the current I and terminal p.d. V?",
      o: [
        "I = 3.0 A, V = 8.4 V",
        "I = 4.29 A, V = 12.0 V",
        "I = 3.0 A, V = 3.6 V",
        "I = 10.0 A, V = 8.4 V"
      ],
      a: 0,
      e: "Current <strong>I = E ÷ (R + r) = 12.0 ÷ (2.8 + 1.2) = 12.0 ÷ 4.0 = 3.0 A</strong>. Terminal p.d. <strong>V = IR = 3.0 × 2.8 = 8.4 V</strong> (or 12.0 − 3.0×1.2 = 8.4 V).",
      src: "WAEC-style"
    },
    {
      q: "A cell supplies a current of <strong>0.80 A</strong> when connected to a <strong>4.0 Ω</strong> resistor, and a current of <strong>0.50 A</strong> when connected to a <strong>7.0 Ω</strong> resistor. Calculate the internal resistance <strong>r</strong> of the cell.",
      o: ["1.0 Ω", "0.50 Ω", "1.5 Ω", "2.0 Ω"],
      a: 0,
      e: "Using <strong>I₁(R₁ + r) = I₂(R₂ + r)</strong>: <strong>0.80(4.0 + r) = 0.50(7.0 + r) ⇒ 3.2 + 0.80r = 3.5 + 0.50r ⇒ 0.30r = 0.30 ⇒ r = 1.0 Ω</strong>.",
      src: "JAMB-style"
    },
    {
      q: "For the cell in Question 3 (which supplies <strong>0.80 A</strong> to a <strong>4.0 Ω</strong> resistor and has internal resistance <strong>r = 1.0 Ω</strong>), what is its electromotive force <strong>E</strong>?",
      o: ["3.2 V", "4.0 V", "3.5 V", "5.0 V"],
      a: 1,
      e: "Substitute r = 1.0 Ω into <strong>E = I₁(R₁ + r) = 0.80 × (4.0 + 1.0) = 0.80 × 5.0 = 4.0 V</strong>.",
      src: "JAMB-style"
    },
    {
      q: "A battery of EMF <strong>6.0 V</strong> has an internal resistance of <strong>0.40 Ω</strong>. What is the <strong>maximum (short-circuit) current</strong> it can deliver if its terminals are shorted by a thick copper bar of negligible resistance?",
      o: ["2.4 A", "15.0 A", "6.4 A", "0.067 A"],
      a: 1,
      e: "On a short circuit, external resistance <strong>R = 0</strong>, so <strong>I<sub>max</sub> = E ÷ r = 6.0 ÷ 0.40 = 15.0 A</strong>.",
      src: "NECO-style"
    },
    {
      q: "A student plots a graph of terminal potential difference <strong>V (vertical axis)</strong> against current <strong>I (horizontal axis)</strong> for a dry cell. Which statement correctly describes the graph?",
      o: [
        "A straight line through the origin with positive slope r",
        "A downward-sloping straight line with vertical intercept equal to E and gradient equal to −r",
        "A parabola curving upward",
        "A horizontal line at V = 0"
      ],
      a: 1,
      e: "Comparing <strong>V = −rI + E</strong> with <strong>y = mx + c</strong> shows that the vertical intercept (c) is <strong>E</strong> and the gradient (m) is <strong>−r</strong>.",
      src: "WAEC Practical"
    },
    {
      q: "A cell of EMF <strong>1.5 V</strong> reads <strong>1.2 V</strong> on a high-resistance voltmeter when delivering a current of <strong>0.60 A</strong> to a torch bulb. What are the <strong>lost volts</strong> and the <strong>internal resistance r</strong>?",
      o: [
        "Lost volts = 0.30 V, r = 0.50 Ω",
        "Lost volts = 1.20 V, r = 2.00 Ω",
        "Lost volts = 0.30 V, r = 2.50 Ω",
        "Lost volts = 2.70 V, r = 0.50 Ω"
      ],
      a: 0,
      e: "Lost volts <strong>v = E − V = 1.5 − 1.2 = 0.30 V</strong>. Since <strong>v = Ir</strong>, internal resistance <strong>r = 0.30 ÷ 0.60 = 0.50 Ω</strong>.",
      src: "WAEC-style"
    },
    {
      q: "A cell supplies a current of <strong>0.60 A</strong> through a <strong>2.0 Ω</strong> coil and <strong>0.30 A</strong> through a <strong>5.0 Ω</strong> coil. What is the EMF of the cell?",
      o: ["1.8 V", "1.5 V", "1.2 V", "3.0 V"],
      a: 0,
      e: "First find r: <strong>0.60(2.0 + r) = 0.30(5.0 + r) ⇒ 1.2 + 0.6r = 1.5 + 0.3r ⇒ 0.3r = 0.3 ⇒ r = 1.0 Ω</strong>. Then <strong>E = 0.60(2.0 + 1.0) = 1.8 V</strong>.",
      src: "JAMB-style"
    },
    {
      q: "On a graph of terminal voltage <strong>V</strong> against current <strong>I</strong> for a cell, the vertical intercept is <strong>6.0 V</strong> and the horizontal intercept (where V = 0) is <strong>4.0 A</strong>. What is the internal resistance r of the cell?",
      o: ["1.5 Ω", "0.67 Ω", "24.0 Ω", "2.0 Ω"],
      a: 0,
      e: "Magnitude of gradient <strong>r = E ÷ I<sub>max</sub> = 6.0 ÷ 4.0 = 1.5 Ω</strong>.",
      src: "WAEC Practical"
    },
    {
      q: "Under what condition is the terminal potential difference <strong>V</strong> across a cell <em>greater</em> than its EMF <strong>E</strong> (V = E + Ir)?",
      o: [
        "When the cell is being charged by an external DC charger forcing current backwards into the positive terminal",
        "When the cell is on open circuit",
        "When the cell is short-circuited",
        "When the cell is completely flat"
      ],
      a: 0,
      e: "During <strong>charging</strong>, the external charger must overcome both the cell's EMF <strong>E</strong> and its internal voltage drop <strong>Ir</strong>, so terminal voltage is <strong>V = E + Ir</strong>.",
      src: "JAMB-style"
    },
    {
      q: "Which factor inside a chemical cell increases its internal resistance <strong>r</strong>?",
      o: [
        "Decreasing the distance between the electrodes",
        "Increasing the submerged surface area of the plates",
        "Polarisation (gas bubbles covering the electrode) or drying/sulphation of the electrolyte",
        "Using a more conductive electrolyte"
      ],
      a: 2,
      e: "Gas bubbles on the plate (polarisation), smaller plate area, wider plate separation, or depleted electrolyte all increase internal resistance <strong>r</strong>.",
      src: "NECO-style"
    },
    {
      q: "A cell of EMF <strong>E = 3.0 V</strong> and internal resistance <strong>r = 0.50 Ω</strong> is connected to a resistor of <strong>R = 2.50 Ω</strong>. What fraction of the total energy supplied by the cell is wasted inside the cell?",
      o: ["1/6 (16.7%)", "5/6 (83.3%)", "1/5 (20.0%)", "1/2 (50.0%)"],
      a: 0,
      e: "Fraction wasted internally is <strong>r ÷ (R + r) = 0.50 ÷ (2.50 + 0.50) = 0.50 ÷ 3.00 = 1/6 ≈ 16.7%</strong>.",
      src: "JAMB-style"
    }
  ];
})();
