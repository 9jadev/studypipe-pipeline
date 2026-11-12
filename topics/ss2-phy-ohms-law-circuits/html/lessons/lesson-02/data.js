/* Lesson 02 · EMF, Terminal P.D., Lost Volts & Internal Resistance
   — sort cards (EMF / terminal p.d. / lost volts), load-explorer pins, bridge answers,
   and the 12 quiz questions (03-questions.md § Lesson 02 Part 1 → window.LESSON_QUIZ, keys unchanged). */
(function () {
  "use strict";

  window.L02 = {
    // ---- 2A sort: EMF or terminal p.d.? (3 bins, 9 cards) ----
    bins: {
      emf: "EMF (E)",
      "terminal-pd": "Terminal p.d. (V)",
      "lost-volts": "Lost volts (Ir)"
    },
    items: [
      { id: "open-read", name: "A voltmeter across a cell with the key open", bin: "emf", emo: "🔌", why: "No current flows, so V = E − Ir = E: the open-circuit reading is the EMF." },
      { id: "energy-coulomb", name: "The total energy given to each coulomb by the cell", bin: "emf", emo: "⚡", why: "That is the definition of the EMF: energy per coulomb for the whole circuit." },
      { id: "starter-read", name: "The voltmeter reading while the starter runs", bin: "terminal-pd", emo: "📟", why: "A current is flowing, so the terminals show V = E − Ir, less than E." },
      { id: "ir-external", name: "The I R across the external load", bin: "terminal-pd", emo: "💡", why: "The p.d. shared out to the outside circuit is the terminal p.d., V = IR." },
      { id: "ir-inside", name: "The I r drop across the cell's inside", bin: "lost-volts", emo: "🔥", why: "The volts used up on the internal resistance are the lost volts, Ir." },
      { id: "warm-cell", name: "The reason a battery warms under heavy load", bin: "lost-volts", emo: "🌡️", why: "Energy I²r is spent inside the cell on its internal resistance: lost volts at work." },
      { id: "never-changes", name: "The number that never changes as the load changes", bin: "emf", emo: "🔒", why: "For a given cell the EMF is fixed by its chemistry; only V and Ir change with load." },
      { id: "shrinks", name: "What gets smaller as you draw more current", bin: "terminal-pd", emo: "📉", why: "Larger I means larger Ir, so the terminal p.d. V = E − Ir falls." },
      { id: "the-gap", name: "The gap between 12.0 V and 8.4 V here", bin: "lost-volts", emo: "➖", why: "E − V = 12.0 − 8.4 = 3.6 V, the lost volts dropped inside Emeka's battery." }
    ],

    // ---- load explorer (#pos-explorer): fixed cell E = 6.0 V, r = 1.5 Ω; pins are external loads ----
    cell: { E: 6.0, r: 1.5 },
    pins: [
      { key: "open", label: "Open", R: null },
      { key: "6", label: "6 Ω", R: 6 },
      { key: "3", label: "3 Ω", R: 3 },
      { key: "2", label: "2 Ω", R: 2 },
      { key: "1", label: "1 Ω", R: 1 }
    ],

    // ---- bridge (#bridge): rebuild Emeka's circuit ----
    bridge: {
      answers: { open: "emf", drop: "inside", left: "8_4" },
      preset: "keke"   // E = 12.0 V, r = 1.2 Ω, R = 2.8 Ω → I 3.0 A, lost 3.6 V, V 8.4 V
    }
  };

  window.LESSON_QUIZ = [
    {
      q: "Which statement best describes the electromotive force (EMF) of a cell?",
      o: [
        "The p.d. across the cell's terminals while it is driving a current",
        "The energy wasted inside the cell for each coulomb that passes through it",
        "The total energy the cell gives to each coulomb of charge driven round the whole circuit",
        "The current the cell supplies for each ohm of external resistance"
      ],
      a: 2,
      e: "EMF is the full energy per coulomb the source supplies to the complete circuit, inside and outside; it equals the terminal reading only when no current flows. A describes the terminal p.d. (V = E − Ir), which is less than the EMF once current flows. B describes the lost volts (Ir), only the internal share. D mixes up Ohm's law: current per ohm is not an energy per coulomb."
    },
    {
      q: "Before switching on the starter, Chinedu clips a high-resistance voltmeter across Emeka's resting battery. Why does this reading equal the battery's EMF?",
      o: [
        "Almost no current flows, so the lost volts Ir inside the battery are practically zero",
        "The battery's internal resistance disappears while the key is open",
        "The voltmeter adds its own EMF to the battery's terminal p.d.",
        "The battery's EMF rises whenever no current is being drawn"
      ],
      a: 0,
      e: "With (nearly) zero current, V = E − Ir = E − 0 = E, so the terminals show the full EMF. B is wrong: r belongs to the electrolyte and plates and is always there; what vanishes is the current through it. C is wrong: a voltmeter is not a source and adds no EMF. D is wrong: the EMF is fixed by the cell's chemistry; it is the terminal p.d., not the EMF, that changes with current."
    },
    {
      q: "Emeka's battery (EMF 12.0 V, internal resistance 1.2 Ω) is connected to his 4.8 Ω headlamp alone. What does a voltmeter across the battery terminals read?",
      o: ["12.0 V", "2.4 V", "9.0 V", "9.6 V"],
      a: 3,
      e: "I = E/(R + r) = 12.0 ÷ (4.8 + 1.2) = 12.0 ÷ 6.0 = 2.0 A. Lost volts = Ir = 2.0 × 1.2 = 2.4 V, so V = E − Ir = 12.0 − 2.4 = 9.6 V (check: V = IR = 2.0 × 4.8 = 9.6 V). A ignores the internal resistance. B is the lost volts, not the terminal p.d. C found the current as E/R = 2.5 A (forgot to add r), then subtracted 2.5 × 1.2."
    },
    {
      q: "A battery of EMF 9.0 V and internal resistance 0.50 Ω drives a current through a 4.0 Ω resistor. What are the lost volts?",
      o: ["8.0 V", "1.0 V", "1.125 V", "4.5 V"],
      a: 1,
      e: "I = E/(R + r) = 9.0 ÷ 4.5 = 2.0 A; lost volts = Ir = 2.0 × 0.50 = 1.0 V. A (8.0 V) is the terminal p.d. IR, the useful part. C found I = E/R = 2.25 A (forgot the internal resistance), then multiplied by r. D multiplied the EMF by r (9.0 × 0.50), skipping the current."
    },
    {
      q: "A radio battery of EMF 4.5 V drives a current of 0.60 A through a 6.5 Ω resistor. What is its internal resistance?",
      o: ["7.5 Ω", "0.60 Ω", "14 Ω", "1.0 Ω"],
      a: 3,
      e: "E = I(R + r), so R + r = E/I = 4.5 ÷ 0.60 = 7.5 Ω and r = 7.5 − 6.5 = 1.0 Ω. (Or: terminal p.d. = 0.60 × 6.5 = 3.9 V, lost volts = 0.60 V, r = 0.60 ÷ 0.60 = 1.0 Ω.) A is the total resistance E/I: the external 6.5 Ω was not subtracted. B is the lost volts written as a resistance, without dividing by the current. C added R instead of subtracting it."
    },
    {
      q: "With a variable load, a cell's terminal p.d. is 1.40 V when the current is 0.20 A, and 1.10 V when the current is 0.80 A. What are its EMF and internal resistance?",
      o: ["1.40 V and 0.50 Ω", "1.50 V and 2.0 Ω", "1.50 V and 0.50 Ω", "1.25 V and 0.50 Ω"],
      a: 2,
      e: "V = E − Ir, so r = −ΔV/ΔI = (1.40 − 1.10) ÷ (0.80 − 0.20) = 0.30 ÷ 0.60 = 0.50 Ω, and E = V + Ir = 1.40 + 0.20 × 0.50 = 1.50 V (check: 1.10 + 0.80 × 0.50 = 1.50 V). A takes the first terminal reading as the EMF, forgetting that a current was already flowing. B used ΔI/ΔV, the gradient upside down. D averaged the two terminal readings."
    },
    {
      q: "Chinedu's V–I graph for a cell (V vertical, I horizontal) is a straight line that cuts the V axis at 3.0 V and the I axis at 4.0 A. What are the cell's EMF and internal resistance?",
      o: ["3.0 V and 0.75 Ω", "4.0 V and 0.75 Ω", "3.0 V and 1.33 Ω", "3.0 V and 12 Ω"],
      a: 0,
      e: "The vertical intercept (I = 0) is the EMF, E = 3.0 V. The magnitude of the gradient is r = 3.0 V ÷ 4.0 A = 0.75 Ω; the I-axis intercept is the short-circuit current, where V = 0 and E = Ir. B read the wrong axis for the EMF. C used ΔI/ΔV, inverted. D multiplied the intercepts instead of dividing them."
    },
    {
      q: "Nkechi reduces the load resistance connected to a battery step by step, so that the battery supplies more and more current. What happens to its terminal p.d.?",
      o: [
        "It rises, because more current is flowing",
        "It falls, because the larger current makes the lost volts Ir larger",
        "It stays equal to the EMF, because the EMF of the battery is constant",
        "It falls, because the EMF of the battery falls as the load gets heavier"
      ],
      a: 1,
      e: "V = E − Ir with E and r fixed, so as I grows the internal drop Ir grows and V falls; this is the straight, downward-sloping V–I line. A assumes 'more current, more voltage', which is true for a fixed resistor, not for a cell's terminals. C confuses a constant EMF with a constant terminal p.d.; they are equal only when I = 0. D blames the EMF, which does not change with load: that is Tobe's mistake."
    },
    {
      q: "A month later Emeka's battery still has an EMF of 12.0 V, but when it drives the same 2.8 Ω starter the terminal p.d. is only 7.0 V. What is its internal resistance now?",
      o: ["1.2 Ω", "2.8 Ω", "2.0 Ω", "4.8 Ω"],
      a: 2,
      e: "I = V/R = 7.0 ÷ 2.8 = 2.5 A; lost volts = E − V = 12.0 − 7.0 = 5.0 V; r = 5.0 ÷ 2.5 = 2.0 Ω (check: 2.5 × (2.8 + 2.0) = 12.0 V). A repeats last month's value. B gives the starter's own resistance. D is E/I = 4.8 Ω, the total circuit resistance: the external 2.8 Ω was not subtracted."
    },
    {
      q: "A 24 V battery bank of internal resistance 0.50 Ω supplies a 5.5 Ω motor. At what rate is energy wasted as heat inside the bank?",
      o: ["88 W", "96 W", "2.0 W", "8.0 W"],
      a: 3,
      e: "I = E/(R + r) = 24 ÷ 6.0 = 4.0 A; power wasted inside = I²r = 4.0² × 0.50 = 8.0 W. A (88 W) is I²R, the power delivered to the motor. B (96 W) is EI, the total power the bank supplies. C (2.0 W) is Ir written as watts: the student forgot to multiply by the current once more."
    },
    {
      q: "A torch cell drives 0.30 A through a 4.5 Ω bulb and 0.50 A through a 2.5 Ω bulb. Assuming the bulbs keep these resistances, what are the cell's internal resistance and EMF?",
      o: ["0.50 Ω and 1.5 V", "0.50 Ω and 1.35 V", "2.0 Ω and 1.95 V", "0.10 Ω and 1.38 V"],
      a: 0,
      e: "The EMF is the same both times: 0.30(4.5 + r) = 0.50(2.5 + r), so 1.35 + 0.30r = 1.25 + 0.50r, giving 0.20r = 0.10 and r = 0.50 Ω; then E = 0.30 × (4.5 + 0.50) = 1.5 V. B found r correctly but took E as I₁R₁ = 1.35 V, forgetting r. C solved 0.20r = 0.10 upside down. D wrote 0.10 as r without dividing by 0.20."
    },
    {
      q: "To measure the EMF on open circuit, Tobe used a cheap voltmeter whose resistance was not very high. How did this affect his value of E?",
      o: [
        "It was too high, because the voltmeter added its own p.d. to the cell's",
        "It was too low, because the voltmeter drew a small current, so a little p.d. was lost across the internal resistance",
        "It was correct, because no current flows when the circuit is open",
        "It was too low, because the voltmeter's resistance added to the cell's internal resistance"
      ],
      a: 1,
      e: "Any voltmeter of finite resistance completes a circuit across the cell, so a small current flows and the reading is E − Ir, slightly below E. A wrongly treats the voltmeter as a source. C forgets that the voltmeter itself is a load. D has the direction right but the wrong reason: the meter is the external resistance, not part of r; the error comes from the current it draws through r."
    }
  ];
})();
