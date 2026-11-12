/* Lesson 01 · Current, P.D., Ohm's Law & the Resistance of Wires
   Content data + the 12 WAEC/NECO/JAMB MCQs (window.LESSON_QUIZ) from 03-questions.md § Lesson 01.
   Every number here is for display/checking only; the live bench numbers come from the dc-circuit-bench model. */
(function () {
  "use strict";

  var RHO = 4.9e-7;                 // constantan, Ω m (matches the bench model)
  function area(d_mm) { return Math.PI * Math.pow(d_mm / 1000, 2) / 4; }   // m²
  function wireR(L_cm, d_mm) { return RHO * (L_cm / 100) / area(d_mm); }    // Ω

  window.L01 = {
    RHO: RHO,
    area: area,
    wireR: wireR,

    // ---- 2A Sort game · "Ohmic or not?" (3 bins) ----
    bins: {
      ohmic: "Ohmic (straight V–I through the origin)",
      nonohmic: "Non-ohmic (V–I curves)",
      insulator: "Barely conducts (insulator-ish)"
    },
    items: [
      { id: "constantan", name: "Constantan resistance wire at steady temperature", emo: "🧵", bin: "ohmic", why: "Constantan's resistance hardly changes, so at a steady temperature V ÷ I stays constant and the graph is a straight line through the origin." },
      { id: "metalrod", name: "A metal rod kept cool", emo: "🪙", bin: "ohmic", why: "A metal at a fixed, low temperature obeys Ohm's law: its V–I graph is a straight line through the origin." },
      { id: "carbon", name: "A carbon-film resistor", emo: "🟫", bin: "ohmic", why: "A carbon-film resistor keeps a near-constant resistance over normal currents, so it is ohmic." },
      { id: "lamp", name: "A filament lamp", emo: "💡", bin: "nonohmic", why: "As the current rises, the filament heats up (over 2000 °C), its ions vibrate harder and its resistance rises, so the V–I graph curves." },
      { id: "diode", name: "A semiconductor diode", emo: "📟", bin: "nonohmic", why: "A diode conducts easily one way and hardly at all the other way, so its V–I graph is far from a straight line." },
      { id: "electrolyte", name: "Salty water between two inert plates", emo: "🧪", bin: "nonohmic", why: "An electrolyte does not keep V ÷ I constant (gas forms at the plates and the solution changes), so it is non-ohmic." },
      { id: "thermistor", name: "A thermistor (NTC bead)", emo: "🌡️", bin: "nonohmic", why: "A thermistor loses resistance as it warms, so more charge carriers appear and its V–I graph curves." },
      { id: "wood", name: "Dry wood", emo: "🪵", bin: "insulator", why: "Dry wood has very few free charges, so almost no current flows: it behaves as an insulator." },
      { id: "air", name: "Dry air", emo: "🌬️", bin: "insulator", why: "Dry air is an insulator: it barely conducts until the voltage is huge enough to spark." },
      { id: "purewater", name: "Pure distilled water", emo: "💧", bin: "insulator", why: "Pure water has almost no dissolved ions, so it barely conducts (it is the dissolved salts, not the water, that carry current)." }
    ],

    // ---- Make Sense · Pin/Scale Explorer (constantan, sweep L and d) ----
    // Each pin recomputes R = ρL/A from the same model the bench uses.
    pins: [
      { L: 40, d: 1.20, label: "Short-ish & thick", note: "Four times the reference diameter means 16× the area, so the resistance is far lower than the thin reference wire." },
      { L: 40, d: 0.60, label: "Double diameter", note: "Doubling the diameter (0.30 → 0.60 mm) quadruples the area A = πd²/4, so the resistance falls to one quarter." },
      { L: 20, d: 0.30, label: "Half length", note: "Half the length means half the electron path, so half the resistance of the reference wire." },
      { L: 40, d: 0.30, label: "Reference wire", note: "The bench default: constantan, L = 40 cm, d = 0.30 mm. This is the 2.77 Ω wire you plotted." },
      { L: 80, d: 0.30, label: "Double length", note: "Doubling the length doubles the electron path, so the resistance doubles (R ∝ L)." },
      { L: 100, d: 0.30, label: "Long & thin", note: "The longest, thinnest wire here has the highest resistance: R grows with length and falls as the square of the diameter." }
    ],
    refPin: 3,

    // ---- Apply · The Bridge (thin vs thick jumper cable, same material & length) ----
    bridge: [
      {
        q: "Emeka's two jumper cables are the same metal and length, but the thin one is d = 0.30 mm and the thick one d = 1.20 mm. How do their cross-sectional areas compare?",
        o: ["The thick cable has 4 times the area", "The thick cable has 16 times the area", "They have the same area"],
        a: 1,
        why: "A = πd²/4 depends on d², and 1.20 ÷ 0.30 = 4, so the thick cable has 4² = 16 times the area of the thin one."
      },
      {
        q: "Using R = ρL/A, how do their resistances compare?",
        o: ["The thin cable has 16 times the resistance", "The thick cable has 16 times the resistance", "They have equal resistance"],
        a: 0,
        why: "Same ρ and L, and R ∝ 1/A, so the thin cable (16× smaller area) has 16 times the resistance of the thick one."
      },
      {
        q: "They carry the SAME current. Using P = I²R, which cable heats more, and by how much?",
        o: ["The thick one, 16× the power", "Equal heating", "The thin one, 16× the power"],
        a: 2,
        why: "With the same current, P = I²R is proportional to R, so the thin cable dissipates 16 times the power and runs hot. It is the thin wire, not a 'bad' one."
      }
    ],

    // ---- 12 WAEC / NECO / JAMB MCQs (03-questions.md § Lesson 01, keys unchanged) ----
    quiz: []
  };

  window.LESSON_QUIZ = [
    {
      q: "Chinedu notices that his workshop voltmeter is marked in volts. One volt is the same as",
      o: ["one coulomb per second", "one joule per coulomb", "one joule per second", "one ohm per ampere"],
      a: 1,
      e: "Potential difference is energy changed per unit charge, <strong>V = W/Q</strong>, so 1 V = 1 J ÷ 1 C = 1 J C⁻¹. One coulomb per second is the ampere (current); one joule per second is the watt (power); and V = IR gives ohms × amperes, not ohms ÷ amperes."
    },
    {
      q: "Emeka leaves his keke headlamp on while he waits for a passenger. It draws a steady 1.6 A for 5.0 minutes. How much charge passes through the lamp?",
      o: ["8.0 C", "187.5 C", "0.32 C", "480 C"],
      a: 3,
      e: "Change the time to seconds first: t = 5.0 × 60 = 300 s. Then <strong>Q = It = 1.6 × 300 = 480 C</strong>. Forgetting to convert the minutes (1.6 × 5.0 = 8.0 C) or inverting the formula gives the wrong options."
    },
    {
      q: "Engr. Nkechi says Ohm's law applies to a metal wire \"only under one condition\". Which condition does she mean?",
      o: ["The temperature and other physical conditions of the wire stay the same", "The current through the wire is kept below 1 A", "The voltmeter is connected in parallel with the wire", "The p.d. across the wire is raised in equal steps"],
      a: 0,
      e: "Current is proportional to p.d. only while the wire's <strong>temperature (and physical state) stays constant</strong>; once it warms, its resistance rises and V ÷ I is no longer constant. There is no fixed 1 A rule, and meter placement is a wiring rule, not a condition of the law."
    },
    {
      q: "Tobe tests a small filament lamp and records (0.10 A, 0.20 V), (0.20 A, 0.60 V) and (0.30 A, 1.35 V). What do these readings show?",
      o: ["The lamp has a constant resistance of 2.0 Ω, so it is ohmic", "The lamp's resistance falls as it heats up, so it is non-ohmic", "The lamp's resistance rises as the filament heats up, so it is non-ohmic", "The lamp obeys Ohm's law, because V rises whenever I rises"],
      a: 2,
      e: "Work out V ÷ I: 2.0 Ω, 3.0 Ω, 4.5 Ω. The ratio is not constant and <strong>grows with the current (and temperature)</strong>, which is non-ohmic. Falling resistance with temperature describes a thermistor, not a metal filament."
    },
    {
      q: "In the sort game, which of these would give a straight-line V–I graph through the origin?",
      o: ["A constantan resistance wire kept at room temperature", "A semiconductor diode", "A thermistor", "Salty water between two copper plates"],
      a: 0,
      e: "Constantan is an alloy whose resistance hardly changes, so at a steady temperature V ÷ I is constant and the graph is a straight line through the origin (ohmic). A diode, a thermistor and an electrolyte all give curved V–I graphs."
    },
    {
      q: "Wires P and Q are made of the same alloy. Q is three times as long as P and has half its diameter. The resistance of P is 2.0 Ω. What is the resistance of Q?",
      o: ["3.0 Ω", "24 Ω", "12 Ω", "1.5 Ω"],
      a: 1,
      e: "R ∝ L/d². Tripling the length multiplies R by 3; halving the diameter makes the area one quarter, multiplying R by 2² = 4. So <strong>R_Q = 2.0 × 3 × 4 = 24 Ω</strong>."
    },
    {
      q: "Chinedu fits a new copper battery lead 5.0 m long with a cross-sectional area of 2.5 mm². Copper has a resistivity of 1.7 × 10⁻⁸ Ω m. What is the resistance of the lead?",
      o: ["1.4 × 10⁻³ Ω", "3.4 × 10⁻⁵ Ω", "8.5 × 10⁻¹⁵ Ω", "3.4 × 10⁻² Ω"],
      a: 3,
      e: "Convert the area: 2.5 mm² = 2.5 × 10⁻⁶ m². Then <strong>R = ρL/A = (1.7 × 10⁻⁸ × 5.0) ÷ (2.5 × 10⁻⁶) = 3.4 × 10⁻² Ω</strong> (0.034 Ω)."
    },
    {
      q: "On Chinedu's V–I graph for a coil (V on the vertical axis), the line of best fit passes through the origin and through (0.30 A, 1.05 V) and (1.20 A, 4.20 V). What is the resistance of the coil?",
      o: ["0.29 Ω", "4.0 Ω", "3.5 Ω", "3.15 Ω"],
      a: 2,
      e: "The slope of a V–I graph is the resistance: <strong>R = ΔV/ΔI = (4.20 − 1.05) ÷ (1.20 − 0.30) = 3.15 ÷ 0.90 = 3.5 Ω</strong>. The inverse slope, a bare voltage ratio and ΔV alone all give the wrong options."
    },
    {
      q: "During the V–I practical, Tobe left the plug key closed all session and the constantan wire became warm. How did this most likely affect the slope of his V–I graph?",
      o: ["Too low, because a warm wire has a lower resistance", "Too high, because the warm wire's resistance rose, so the later V readings were too high for their currents", "Unaffected, because Ohm's law holds at any temperature", "Too low, because the ammeter read too high when the wire was warm"],
      a: 1,
      e: "Warming makes the ions vibrate more, the electrons collide more often and the resistance rises, so each later V reading is too big for its current and the slope (R) comes out <strong>too high</strong>. Lower resistance with temperature describes a thermistor, not a metal."
    },
    {
      q: "Emeka has two copper jumper cables of the same length. The thin one is 0.50 mm across and the thick one 1.50 mm. Carrying the same current, what is the ratio of the heating power in the thin cable to that in the thick cable?",
      o: ["9 : 1", "3 : 1", "1 : 9", "81 : 1"],
      a: 0,
      e: "R ∝ 1/d², so R_thin : R_thick = (1.50 ÷ 0.50)² = 3² = 9. With the same current, P = I²R is in the same ratio as R, so <strong>9 : 1</strong>, and the thin cable runs hot."
    },
    {
      q: "Nkechi's soldering iron is rated 60 W on the 240 V mains. What is the resistance of its element when it is working?",
      o: ["4.0 Ω", "0.25 Ω", "14 400 Ω", "960 Ω"],
      a: 3,
      e: "From P = V²/R, <strong>R = V²/P = 240² ÷ 60 = 57 600 ÷ 60 = 960 Ω</strong>. (Check: I = P/V = 0.25 A, and R = V/I = 240 ÷ 0.25 = 960 Ω.)"
    },
    {
      q: "Chinedu wants to halve the resistance of a length of constantan wire without changing the material. Which change does exactly that?",
      o: ["Doubling the length of the wire", "Doubling the diameter of the wire", "Doubling the cross-sectional area of the wire", "Halving the diameter of the wire"],
      a: 2,
      e: "R = ρL/A is inversely proportional to the area, so <strong>doubling A halves R</strong>. Doubling the diameter quadruples A (R falls to a quarter), doubling the length doubles R, and halving the diameter quadruples R."
    }
  ];
  window.L01.quiz = window.LESSON_QUIZ;
})();
