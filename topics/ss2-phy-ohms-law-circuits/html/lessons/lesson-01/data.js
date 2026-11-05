/* Lesson 01 · Ohm's Law, Metallic Conduction & Wire Resistivity — content data and 12 WAEC/NECO/JAMB quiz questions */
(function () {
  "use strict";

  window.L01 = {
    // ---- 1. Conductor & Circuit Rule Sort items ----
    items: [
      { id: "constantan", name: "Constantan resistance wire at constant T", emo: "🧵", bin: "shm", why: "Constantan has a negligible temperature coefficient of resistance, so V is strictly proportional to I (ohmic)." },
      { id: "copper", name: "Thick copper jumper cable at room T", emo: "🔌", bin: "shm", why: "At constant temperature, metallic copper obeys Ohm's law (V = IR) with a linear V–I graph through the origin." },
      { id: "manganin", name: "Standard 2.0 Ω manganin lab coil", emo: "🌀", bin: "shm", why: "Manganin alloy keeps constant resistance across normal lab currents, making it an ideal ohmic standard resistor." },
      { id: "acid", name: "Dilute tetraoxosulphate(VI) acid with copper electrodes", emo: "🧪", bin: "shm", why: "Above zero back-e.m.f. with copper electrodes in CuSO₄/acid, metallic/electrolytic conduction under constant conditions is linear." },
      { id: "filament", name: "Tungsten filament headlamp bulb", emo: "💡", bin: "periodic", why: "Non-ohmic: as current increases, the tungsten filament heats up (> 2000 °C), lattice vibrations intensify, and resistance R increases." },
      { id: "diode", name: "Silicon p–n junction semiconductor diode", emo: "📲", bin: "periodic", why: "Non-ohmic: conducts easily in forward bias above ~0.7 V but blocks current in reverse bias." },
      { id: "thermistor", name: "NTC semiconductor thermistor bead", emo: "🌡️", bin: "periodic", why: "Non-ohmic: heating releases more charge carriers so its resistance drops sharply as temperature rises." },
      { id: "led", name: "Workshop indicator light-emitting diode (LED)", emo: "🔴", bin: "periodic", why: "Non-ohmic semiconductor device whose I–V characteristic is strongly curved and one-way." },
      { id: "ammeter", name: "Connecting the ammeter in SERIES with the wire", emo: "🧭", bin: "non", why: "Mandatory WAEC circuit rule: an ammeter has very low resistance and must be placed in series so all current flows through it." },
      { id: "voltmeter", name: "Connecting the voltmeter in PARALLEL across the wire", emo: "📟", bin: "non", why: "Mandatory WAEC circuit rule: a voltmeter has very high resistance and must be connected in parallel across the test wire." },
      { id: "keyopen", name: "Removing the plug key immediately after each reading", emo: "🔑", bin: "non", why: "Mandatory WAEC precaution: prevents continuous current from heating the constantan wire and altering its resistance." },
      { id: "tight", name: "Ensuring clean and tight brass terminal connections", emo: "🔩", bin: "non", why: "Mandatory WAEC precaution: prevents unwanted contact resistance from distorting V and I readings." }
    ],

    // ---- 2. 3D Ohm's Law V–I Practical trials (Standard R = 2.20 Ω constantan coil) ----
    trials: [
      { label: "A", L: 0.25, t: "0.25", T: "0.55", T2: "2.20" },
      { label: "B", L: 0.50, t: "0.50", T: "1.10", T2: "2.20" },
      { label: "C", L: 0.75, t: "0.75", T: "1.65", T2: "2.20" },
      { label: "D", L: 1.00, t: "1.00", T: "2.20", T2: "2.20" },
      { label: "E", L: 1.25, t: "1.25", T: "2.75", T2: "2.20" }
    ],
    tOptions: ["0.25", "0.50", "0.75", "1.00", "1.25"],
    TOptions: ["0.55", "1.10", "1.65", "2.20", "2.75"],
    T2Options: ["1.80", "2.00", "2.20", "2.50", "3.00"],

    // ---- 3. Wire Resistivity & Dimension Explorer pins (R = 4ρL / πd²) ----
    pins: [
      { frac: -1.0, label: "Short & Thick", emo: "🟢", x: "L = 0.50 m, d = 0.80 mm", v: "R = 0.50 Ω (Lowest)", a: "I = 4.00 A at 2.0 V", ke: "Low R", pe: "High I", note: "Short length (½L₀) and double diameter (2d₀ → 4× area A) slash resistance to one-eighth of a 1 m thin wire!" },
      { frac: -0.5, label: "Double Diameter", emo: "🔵", x: "L = 1.00 m, d = 0.80 mm", v: "R = 1.00 Ω (¼ R₀)", a: "I = 2.00 A at 2.0 V", ke: "4× Area", pe: "¼ R", note: "Doubling wire diameter d quadruples the circular cross-sectional area A = πd²/4, dividing resistance R by 4!" },
      { frac: 0.0,  label: "Reference Wire", emo: "🎯", x: "L = 1.00 m, d = 0.40 mm", v: "R₀ = 4.00 Ω", a: "I = 0.50 A at 2.0 V", ke: "1× Area", pe: "1× R₀", note: "Standard constantan reference wire: L₀ = 1.00 m, d₀ = 0.40 mm (A = 1.26 × 10⁻⁷ m²), giving R₀ = 4.00 Ω." },
      { frac: 0.5,  label: "Double Length", emo: "🟠", x: "L = 2.00 m, d = 0.40 mm", v: "R = 8.00 Ω (2 R₀)", a: "I = 0.25 A at 2.0 V", ke: "2× Length", pe: "2× R", note: "Since R = ρL/A, doubling length L at the same diameter doubles the electron path and doubles resistance to 8.00 Ω." },
      { frac: 1.0,  label: "Long & Half d", emo: "🛑", x: "L = 2.00 m, d = 0.20 mm", v: "R = 32.0 Ω (8 R₀!)", a: "I = 0.063 A at 2.0 V", ke: "¼ Area", pe: "8× R!", note: "Doubling L (×2) while halving diameter d (÷0.5² = ×4) multiplies resistance by 2 × 4 = 8 times to 32.0 Ω!" }
    ]
  };

  // ---- 4. 12 WAEC / NECO / JAMB Quiz Questions ----
  window.LESSON_QUIZ = [
    {
      q: "Which statement accurately expresses <strong>Ohm's law</strong> for a metallic conductor?",
      o: [
        "Current is inversely proportional to potential difference at all temperatures",
        "Current is directly proportional to potential difference across its ends, provided temperature and other physical conditions remain constant",
        "Resistance is directly proportional to current when the wire is heated white-hot",
        "Potential difference equals the ratio of resistance to current (V = R/I)"
      ],
      a: 1,
      e: "Ohm's law states that <strong>I ∝ V</strong> (or <strong>V = IR</strong>) provided <strong>temperature and other physical conditions (such as mechanical strain) remain constant</strong>.",
      src: "WAEC-style"
    },
    {
      q: "Why does the electrical resistance of a pure metallic wire <strong>increase</strong> when its temperature rises?",
      o: [
        "The metal ions vibrate with greater amplitude, increasing the frequency of collisions with drifting free electrons",
        "The number of protons inside the nucleus increases with temperature",
        "The wire becomes shorter when heated",
        "All free electrons evaporate out of the wire above 50 °C"
      ],
      a: 0,
      e: "Heating increases the thermal vibration amplitude of positive lattice ions, obstructing drifting electrons and raising resistance <strong>R</strong>.",
      src: "JAMB-style"
    },
    {
      q: "A constantan wire of resistance <strong>8.0 Ω</strong> is connected across a steady p.d. of <strong>12.0 V</strong> for <strong>2.5 minutes</strong>. What total electric charge Q passes through the wire?",
      o: ["3.75 C", "18.0 C", "225 C", "1440 C"],
      a: 2,
      e: "Current <strong>I = V ÷ R = 12.0 ÷ 8.0 = 1.5 A</strong>. Convert time to seconds: <strong>t = 2.5 × 60 = 150 s</strong>. Charge <strong>Q = It = 1.5 × 150 = 225 C</strong>.",
      src: "WAEC-style"
    },
    {
      q: "Wire X and Wire Y are made of the same alloy. Wire Y has <strong>twice the length</strong> and <strong>twice the diameter</strong> of Wire X. If the resistance of Wire X is <strong>12.0 Ω</strong>, what is the resistance of Wire Y?",
      o: ["6.0 Ω", "12.0 Ω", "24.0 Ω", "3.0 Ω"],
      a: 0,
      e: "Since <strong>R = 4ρL ÷ (πd²) ∝ L ÷ d²</strong>, doubling L multiplies R by 2 while doubling d divides R by 2² = 4: <strong>R<sub>Y</sub> = 12.0 × (2 ÷ 4) = 6.0 Ω</strong>.",
      src: "JAMB-style"
    },
    {
      q: "A uniform resistance wire of length <strong>2.0 m</strong> and cross-sectional area <strong>5.0 × 10<sup>−7</sup> m<sup>2</sup></strong> has a resistance of <strong>4.0 Ω</strong>. Calculate the resistivity ρ of the material.",
      o: [
        "1.0 × 10⁻⁶ Ω m",
        "4.0 × 10⁻⁶ Ω m",
        "1.6 × 10⁶ Ω m",
        "2.5 × 10⁻⁷ Ω m"
      ],
      a: 0,
      e: "Using <strong>ρ = RA ÷ L = (4.0 × 5.0 × 10⁻⁷) ÷ 2.0 = 1.0 × 10⁻⁶ Ω m</strong>.",
      src: "NECO-style"
    },
    {
      q: "In a WAEC Physics Paper 3 experiment to verify Ohm's law for a standard resistor R, how must the <strong>ammeter</strong> and <strong>voltmeter</strong> be connected?",
      o: [
        "Both ammeter and voltmeter in series with R",
        "Both ammeter and voltmeter in parallel with R",
        "Ammeter in series with R; voltmeter in parallel across R",
        "Ammeter in parallel across R; voltmeter in series with R"
      ],
      a: 2,
      e: "An <strong>ammeter</strong> (low resistance) is always connected in <strong>series</strong> to measure through-current, while a <strong>voltmeter</strong> (high resistance) is connected in <strong>parallel</strong> to measure potential difference across R.",
      src: "WAEC Practical"
    },
    {
      q: "Why are candidates instructed to <strong>remove the plug key immediately after taking each reading</strong> during an electricity practical?",
      o: [
        "To prevent the resistance wire from heating up and changing its resistance, and to avoid running down the cell",
        "To allow the voltmeter needle to swing faster",
        "To convert alternating current into direct current",
        "To increase the resistivity of the copper connecting leads"
      ],
      a: 0,
      e: "Continuous current causes Joule heating (<strong>I²Rt</strong>), which raises the temperature and resistance of the wire and drains the accumulator/cell.",
      src: "WAEC Practical"
    },
    {
      q: "During an Ohm's law practical, a student plots potential difference <strong>V (vertical axis)</strong> against current <strong>I (horizontal axis)</strong>. Two points on the line of best fit are <strong>(0.25 A, 0.55 V)</strong> and <strong>(1.15 A, 2.53 V)</strong>. What is the resistance R represented by the slope?",
      o: ["0.45 Ω", "2.20 Ω", "1.98 Ω", "2.75 Ω"],
      a: 1,
      e: "Slope <strong>R = ΔV ÷ ΔI = (2.53 − 0.55) ÷ (1.15 − 0.25) = 1.98 ÷ 0.90 = 2.20 Ω</strong>.",
      src: "WAEC Practical"
    },
    {
      q: "Which of the following devices is a <strong>non-ohmic conductor</strong>?",
      o: [
        "Constantan wire at constant temperature",
        "Manganin standard resistor coil",
        "Semiconductor p–n junction diode",
        "Copper rod kept in a constant-temperature bath"
      ],
      a: 2,
      e: "A <strong>semiconductor diode</strong> has a non-linear I–V curve and conducts predominantly in one direction, so it does not obey Ohm's law.",
      src: "JAMB-style"
    },
    {
      q: "Two wires P and Q made of the same metal have equal lengths, but the diameter of P is <strong>three times</strong> the diameter of Q (d<sub>P</sub> = 3d<sub>Q</sub>). What is the ratio of their resistances <strong>R<sub>P</sub> : R<sub>Q</sub></strong>?",
      o: ["1 : 9", "1 : 3", "3 : 1", "9 : 1"],
      a: 0,
      e: "For equal lengths of the same material, <strong>R ∝ 1 ÷ d²</strong>. Therefore <strong>R<sub>P</sub> ÷ R<sub>Q</sub> = (d<sub>Q</sub> ÷ d<sub>P</sub>)² = (1 ÷ 3)² = 1 : 9</strong>.",
      src: "JAMB-style"
    },
    {
      q: "What is the SI unit of <strong>electrical conductivity (σ)</strong>, the reciprocal of resistivity ρ?",
      o: ["Ω m", "Ω⁻¹ m⁻¹ (siemens per metre)", "V A⁻¹", "J C⁻¹"],
      a: 1,
      e: "Since resistivity ρ is measured in <strong>Ω m</strong>, electrical conductivity <strong>σ = 1 ÷ ρ</strong> is measured in <strong>Ω⁻¹ m⁻¹</strong> (or S m⁻¹).",
      src: "NECO-style"
    },
    {
      q: "Which of the following is an acceptable <strong>past-tense precaution</strong> in a WAEC Paper 3 Ohm's law practical?",
      o: [
        "I ensured tight and clean electrical connections at all terminals.",
        "I will remove the key after every reading.",
        "I closed the windows to prevent draught.",
        "I was careful with the voltmeter."
      ],
      a: 0,
      e: "WAEC rewards specific electrical precautions written in the <strong>past tense</strong>, such as <em>'I ensured tight and clean electrical connections'</em> or <em>'I opened the key between readings so the wire did not heat up'</em>.",
      src: "WAEC Practical"
    }
  ];
})();
