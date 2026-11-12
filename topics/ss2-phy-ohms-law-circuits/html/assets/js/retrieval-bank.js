/* ==========================================================
   StudyPipe — Spaced Retrieval Bank · Ohm's Law & Current Electricity (L1–L5)
   Read by LessonKit in lessons/lesson-01 .. lesson-05 (classic script, offline).
   donow  : the 4 Do Now cards of each lesson in 02-lesson.md (from: 0 = prerequisite,
            from: N = Lesson N; sec = the section id in that earlier lesson the "Revisit" link opens)
   quiz   : 2 original review MCQs from earlier lessons (l02 onward), appended after the lesson's own quiz
   recall : blank-page recall prompt + the key points to tick off (02-lesson.md § 5 Recall)
   ========================================================== */
window.RETRIEVAL_BANK = {
  l01: {
    title: "Current, P.D., Ohm's Law and the Resistance of Wires",
    donow: [
      {
        from: 0, sec: "concepts", where: "Charge and current",
        q: "What is measured in coulombs, and what does one ampere mean?",
        a: "Electric <strong>charge</strong> is measured in coulombs (C); one <strong>ampere</strong> is one coulomb passing a point each second (1 A = 1 C s⁻¹)."
      },
      {
        from: 0, sec: "examples", where: "Unit conversion",
        q: "Convert 3.0 minutes to seconds and 0.50 mm to metres.",
        a: "3.0 min = <strong>180 s</strong>; 0.50 mm = 0.50 × 10⁻³ m = <strong>5.0 × 10⁻⁴ m</strong>."
      },
      {
        from: 0, sec: "examples", where: "Area of a circle",
        q: "Find the area of a circle of diameter 0.40 mm.",
        a: "A = πd²/4 = π(4.0 × 10⁻⁴)²/4 = <strong>1.26 × 10⁻⁷ m²</strong>."
      },
      {
        from: 0, sec: "practical", where: "Reading meters",
        q: "Why do we read a meter with the eye square to the scale?",
        a: "To avoid <strong>parallax error</strong>, which otherwise makes the reading systematically too high or too low."
      }
    ],
    quiz: [],
    recall: {
      prompt: "Close your notes. Write down everything you remember from Lesson 1, then tick each point below that you wrote, even in your own words:",
      points: [
        "Current is the rate of flow of charge: I = Q/t, in amperes.",
        "P.d. is the electrical energy changed per coulomb between two points: V = W/Q, in volts.",
        "Ohm's law: at steady temperature and physical state, I is proportional to V, so V = IR with R constant.",
        "Resistance of a uniform wire: R = ρL/A with A = πd²/4, so R ∝ L/d².",
        "The slope of a V–I graph (V vertical, I horizontal) is the resistance R.",
        "Ohmic conductor: straight V–I line through the origin. Non-ohmic (filament lamp, diode, electrolyte): a curve."
      ]
    }
  },

  l02: {
    title: "EMF, Terminal P.D., Lost Volts and Internal Resistance",
    donow: [
      {
        from: 1, sec: "concepts", where: "Ohm's law",
        q: "State Ohm's law.",
        a: "At steady temperature, the current through a conductor is proportional to the p.d. across it, so <strong>V = IR</strong> with R constant."
      },
      {
        from: 1, sec: "practical", where: "Slope of a V–I graph",
        q: "A V–I graph's slope is 3.0 V ÷ 1.5 A. What does it give?",
        a: "The resistance, <strong>R = 2.0 Ω</strong>."
      },
      {
        from: 1, sec: "practical", where: "The ammeter",
        q: "What does an ammeter read, and where is it connected?",
        a: "The current; in <strong>series</strong>."
      },
      {
        from: 1, sec: "practical", where: "The voltmeter",
        q: "What does a voltmeter read, and where is it connected?",
        a: "The potential difference; in <strong>parallel</strong> across the component."
      }
    ],
    quiz: [
      {
        from: 1,
        q: "A soldering-iron element of resistance 2.5 Ω carries a current of 4.0 A. What is the p.d. across it?",
        o: ["1.6 V", "6.5 V", "10 V", "0.63 V"],
        a: 2,
        e: "V = IR = 4.0 × 2.5 = 10 V. Dividing (4.0 ÷ 2.5 = 1.6) or adding (6.5) mixes up the formula."
      },
      {
        from: 1,
        q: "Two wires of the same metal and length: wire Y has three times the diameter of wire X. What is R_Y ÷ R_X?",
        o: ["3", "1/3", "9", "1/9"],
        a: 3,
        e: "R ∝ 1/d². Three times the diameter gives nine times the area, so the resistance falls to one ninth."
      }
    ],
    recall: {
      prompt: "Close your notes. Write down everything you remember from Lesson 2, then tick each point below that you wrote:",
      points: [
        "EMF (E) is the total energy the source gives each coulomb driven round the whole circuit; it is the open-circuit reading (I = 0).",
        "Terminal p.d. is what is left for the external circuit: V = E − Ir = IR.",
        "Lost volts Ir are spent on the internal resistance r inside the cell.",
        "Full-circuit relation: E = I(R + r).",
        "Two-readings method: E = I₁(R₁ + r) = I₂(R₂ + r), then solve for r and E.",
        "On a V–I graph for a cell, the vertical intercept is E and the gradient is −r."
      ]
    }
  },

  l03: {
    title: "Series and Parallel Networks, Cell Arrays, Power and Efficiency",
    donow: [
      {
        from: 2, sec: "concepts", where: "Terminal p.d.",
        q: "What does V = E − Ir give?",
        a: "The <strong>terminal p.d.</strong>, what is left after the lost volts."
      },
      {
        from: 1, sec: "concepts", where: "Electrical power",
        q: "Write the three forms of electrical power.",
        a: "<strong>P = IV = I²R = V²/R</strong>."
      },
      {
        from: 0, sec: "concepts", where: "Series resistors",
        q: "Two 6 Ω resistors in series: what is the total?",
        a: "<strong>12 Ω</strong>."
      },
      {
        from: 2, sec: "concepts", where: "Power lost inside a cell",
        q: "What is the power lost inside a cell carrying current I?",
        a: "<strong>I²r</strong>."
      }
    ],
    quiz: [
      {
        from: 2,
        q: "A cell of EMF 9.0 V and internal resistance 0.50 Ω drives 2.0 A through a load. What is its terminal p.d.?",
        o: ["9.0 V", "8.0 V", "10 V", "4.5 V"],
        a: 1,
        e: "Lost volts Ir = 2.0 × 0.50 = 1.0 V, so V = E − Ir = 9.0 − 1.0 = 8.0 V. Adding the lost volts (10 V) is the classic slip."
      },
      {
        from: 2,
        q: "A voltmeter reads 3.0 V across a cell on open circuit. Why does this equal the EMF?",
        o: ["The cell has no internal resistance", "No current flows, so there are no lost volts", "The voltmeter has zero resistance", "The EMF is always 3.0 V"],
        a: 1,
        e: "With the key open, I = 0, so Ir = 0 and V = E. The cell still has its internal resistance; it just has no current through it."
      }
    ],
    recall: {
      prompt: "Close your notes. Write down everything you remember from Lesson 3, then tick each point below that you wrote:",
      points: [
        "Series resistors: same current, p.d.s add, R = R₁ + R₂ + …",
        "Parallel resistors: same p.d., currents add, 1/R = 1/R₁ + 1/R₂ + …; for two, R = R₁R₂/(R₁ + R₂).",
        "n identical cells in series: E_t = nE, r_t = nr. n identical cells in parallel: E_t = E, r_t = r/n.",
        "Power three ways: P = IV = I²R = V²/R; energy W = Pt, and 1 kWh = 3.6 × 10⁶ J.",
        "Efficiency η = R/(R + r) = V/E; load power peaks at R = r, where η is only 50 %."
      ]
    }
  },

  l04: {
    title: "Galvanometer Conversion: Ammeter Shunts and Voltmeter Multipliers",
    donow: [
      {
        from: 3, sec: "concepts", where: "Parallel branches",
        q: "In a parallel pair, what is equal across both?",
        a: "The <strong>potential difference</strong>."
      },
      {
        from: 1, sec: "concepts", where: "V = IR",
        q: "Find V across 18 Ω carrying 15 mA.",
        a: "V = 0.015 × 18 = <strong>0.27 V</strong>."
      },
      {
        from: 3, sec: "concepts", where: "Series parts",
        q: "In series, what is the same through both parts?",
        a: "The <strong>current</strong>."
      },
      {
        from: 0, sec: "examples", where: "Milliamperes",
        q: "Convert 8 mA to amperes.",
        a: "8 mA = <strong>0.008 A</strong>."
      }
    ],
    quiz: [
      {
        from: 3,
        q: "Resistors of 4.0 Ω and 12 Ω are joined in parallel. What is their combined resistance?",
        o: ["16 Ω", "8.0 Ω", "3.0 Ω", "0.33 Ω"],
        a: 2,
        e: "R = (4.0 × 12)/(4.0 + 12) = 48/16 = 3.0 Ω, less than the smaller branch, as a parallel pair always is. 0.33 is 1/R, not R."
      },
      {
        from: 3,
        q: "Three identical cells, each 1.5 V with internal resistance 0.9 Ω, are joined in parallel. What are the EMF and internal resistance of the group?",
        o: ["4.5 V and 2.7 Ω", "1.5 V and 0.3 Ω", "4.5 V and 0.3 Ω", "1.5 V and 2.7 Ω"],
        a: 1,
        e: "Identical cells in parallel keep one cell's EMF (1.5 V), and the internal resistance falls to r/n = 0.9 ÷ 3 = 0.3 Ω."
      }
    ],
    recall: {
      prompt: "Close your notes. Write down everything you remember from Lesson 4, then tick each point below that you wrote:",
      points: [
        "Ammeter: a small shunt R_s in parallel with the coil, R_s = I_g R_g/(I − I_g); the meter goes in series and has low resistance.",
        "Voltmeter: a large multiplier R_m in series with the coil, R_m = V/I_g − R_g; the meter goes in parallel and has high resistance.",
        "R_total = V/I_g is the whole voltmeter; the resistor you add is R_total − R_g.",
        "The coil itself only ever carries its full-scale current I_g; the shunt carries the rest, I − I_g."
      ]
    }
  },

  l05: {
    title: "Null Methods: Metre Bridge, Potentiometer and WAEC Practicals",
    donow: [
      {
        from: 2, sec: "concepts", where: "Voltmeter under load",
        q: "Why does a loaded voltmeter read less than the EMF?",
        a: "It reads <strong>E − Ir</strong>: current flows, so lost volts appear inside the cell."
      },
      {
        from: 1, sec: "concepts", where: "Resistance of a wire",
        q: "For a wire, R is proportional to what?",
        a: "<strong>R ∝ L/d²</strong>: length over diameter squared."
      },
      {
        from: 4, sec: "concepts", where: "Ideal voltmeter",
        q: "An ideal voltmeter draws how much current?",
        a: "<strong>Almost none</strong>, because its resistance is very high."
      },
      {
        // review minor 4: kept as real retrieval (L03) instead of new L05 content
        from: 3, sec: "concepts", where: "Current in a parallel pair",
        q: "A 3.0 Ω and a 6.0 Ω resistor are in parallel. Which one carries the larger current, and why?",
        a: "The <strong>3.0 Ω</strong> one: both share the same p.d., so I = V/R is larger where R is smaller (twice the current of the 6.0 Ω)."
      }
    ],
    quiz: [
      {
        from: 4,
        q: "A galvanometer of coil resistance 50 Ω gives full-scale deflection at 2.0 mA. What multiplier makes it a 10 V voltmeter?",
        o: ["5 000 Ω", "4 950 Ω", "5 050 Ω", "0.020 Ω"],
        a: 1,
        e: "R_total = V/I_g = 10 ÷ 0.0020 = 5 000 Ω, so R_m = 5 000 − 50 = 4 950 Ω in series. 5 000 Ω is the whole meter, not the resistor you add."
      },
      {
        from: 4,
        q: "Why must an ammeter's shunt have a very small resistance?",
        o: ["So most of the line current bypasses the coil", "So the coil carries all the current", "So the meter has a high resistance", "So it can be joined in parallel with the circuit"],
        a: 0,
        e: "The shunt sits in parallel with the coil and takes most of the current, leaving only I_g for the coil; the finished ammeter has a low resistance and goes in series."
      }
    ],
    recall: {
      prompt: "Close your notes. Write down everything you remember from Lesson 5, then tick each point below that you wrote:",
      points: [
        "Metre bridge balance: R/S = l/(100 − l), so an unknown R = R_x(100 − l)/l.",
        "Potentiometer: V = kl along a uniform wire; comparing cells, E₁/E₂ = l₁/l₂.",
        "Internal resistance by potentiometer: r = R(l₁ − l₂)/l₂.",
        "Null = no current drawn from the test cell, so no lost volts: the potentiometer reads the true EMF.",
        "Driver share: V_wire = E₀ R_wire/(R_wire + R_series); the whole driver EMF is not across the wire."
      ]
    }
  }
};
