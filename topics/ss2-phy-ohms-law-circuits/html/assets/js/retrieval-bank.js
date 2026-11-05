/* ==========================================================
   StudyPipe — Spaced Retrieval Bank for Ohm's Law & Current Electricity (L1–L5)
   Used by LessonKit across lessons/lesson-01 .. lesson-05
   ========================================================== */
window.RETRIEVAL_BANK = {
  l01: {
    title: "Ohm's Law, Metallic Conduction & Wire Resistivity",
    donow: [
      {
        from: 0, sec: "concepts", where: "Electric Charge & Current",
        q: "Define electric current I in terms of charge Q and time t, and state its SI unit.",
        a: "Electric current is the <strong>rate of flow of electric charge</strong> (<strong>I = Q ÷ t</strong>), measured in <strong>amperes (A)</strong>, where 1 A = 1 C s<sup>−1</sup>."
      },
      {
        from: 0, sec: "concepts", where: "Potential Difference",
        q: "What is meant by a potential difference of 12.0 V between two points in a circuit?",
        a: "It means <strong>12.0 joules of electrical energy</strong> are converted to other forms for every <strong>1 coulomb of charge</strong> passing between the two points (<strong>V = W ÷ Q</strong>)."
      },
      {
        from: 0, sec: "practical", where: "Meter Placement",
        q: "How must an ammeter and a voltmeter be connected relative to a resistor in an Ohm's law circuit?",
        a: "Connect the <strong>ammeter in series</strong> with the resistor (low resistance) and the <strong>voltmeter in parallel</strong> across the resistor (high resistance)."
      },
      {
        from: 0, sec: "practical", where: "Area of a Round Wire",
        q: "Write the formula for the cross-sectional area A of a cylindrical wire of diameter d.",
        a: "Since radius r = d ÷ 2, cross-sectional area is <strong>A = πr<sup>2</sup> = πd<sup>2</sup> ÷ 4</strong>."
      }
    ],
    recall: {
      prompt: "Without looking back at the notes, tick off every core idea from Lesson 1 you can state from memory:",
      points: [
        "Ohm's law states that current I through a metallic conductor is directly proportional to potential difference V across its ends (V = IR), provided temperature and other physical conditions remain constant.",
        "Heating a metallic conductor increases lattice ion vibrations, causing more frequent electron collisions and increasing resistance R.",
        "Electrical resistance of a uniform wire is R = ρL ÷ A = 4ρL ÷ (πd²), so R ∝ L ÷ d².",
        "In a WAEC Ohm's law practical, the slope of V (vertical) against I (horizontal) equals the resistance R of the wire.",
        "The plug key must be removed immediately after each reading so the constantan wire does not heat up and change resistance."
      ]
    }
  },

  l02: {
    title: "EMF, Terminal P.D., Lost Volts & Internal Resistance",
    donow: [
      {
        from: 1, sec: "concepts", where: "Ohm's Law",
        q: "State Ohm's law and the essential physical condition that must be kept constant.",
        a: "The current I through a metallic conductor is directly proportional to the potential difference V across its ends (<strong>V = IR</strong>), provided <strong>temperature and other physical conditions remain constant</strong>."
      },
      {
        from: 1, sec: "concepts", where: "Wire Diameter Scaling",
        q: "Wire B has the same length and material as Wire A, but twice the diameter (dB = 2dA). If Wire A has resistance 16.0 Ω, what is the resistance of Wire B?",
        a: "Since <strong>R ∝ 1 ÷ d²</strong>, doubling diameter divides resistance by 2² = 4: <strong>RB = 16.0 ÷ 4 = 4.0 Ω</strong>."
      },
      {
        from: 1, sec: "examples", where: "Charge & Current",
        q: "A resistor of 6.0 Ω is connected across a 9.0 V p.d. for 2.0 minutes. Calculate the current I and total charge Q.",
        a: "<strong>I = V ÷ R = 9.0 ÷ 6.0 = 1.5 A</strong>. Time t = 120 s, so <strong>Q = It = 1.5 × 120 = 180 C</strong>."
      },
      {
        from: 1, sec: "practical", where: "WAEC Precaution",
        q: "Why do we open the plug key between readings during an Ohm's law experiment?",
        a: "To prevent continuous current from <strong>heating the resistance wire</strong>, which would raise its temperature and resistance."
      }
    ],
    recall: {
      prompt: "Without scrolling up, write down the core EMF and internal resistance equations from Lesson 2 and tick what you remembered:",
      points: [
        "Electromotive force (E) is the total energy supplied per coulomb by the source (open-circuit voltage when I = 0).",
        "Complete circuit equation: E = V + v = IR + Ir = I(R + r).",
        "Terminal potential difference V = E − Ir, where v = Ir is the 'lost volts' dropped across the internal resistance r.",
        "For two load readings on the same cell: E = I₁(R₁ + r) = I₂(R₂ + r), so r = (I₂R₂ − I₁R₁) ÷ (I₁ − I₂).",
        "Plotting terminal p.d. V against current I gives a straight line V = −rI + E with vertical intercept E and gradient −r."
      ]
    }
  },

  l03: {
    title: "Series & Parallel Networks, Cell Arrays, Power & Efficiency",
    donow: [
      {
        from: 2, sec: "concepts", where: "Terminal P.D. & Lost Volts",
        q: "A 12.0 V battery with internal resistance r = 1.2 Ω delivers 3.0 A to a starter load. Calculate the lost volts v and terminal p.d. V.",
        a: "Lost volts <strong>v = Ir = 3.0 × 1.2 = 3.6 V</strong>. Terminal p.d. <strong>V = E − Ir = 12.0 − 3.6 = 8.4 V</strong>."
      },
      {
        from: 2, sec: "examples", where: "Two Readings Method",
        q: "A cell supplies 0.80 A to a 4.0 Ω resistor and 0.50 A to a 7.0 Ω resistor. Find its internal resistance r.",
        a: "Using I₁(R₁ + r) = I₂(R₂ + r): <strong>0.80(4.0 + r) = 0.50(7.0 + r) ⇒ 3.2 + 0.8r = 3.5 + 0.5r ⇒ r = 1.0 Ω</strong>."
      },
      {
        from: 2, sec: "concepts", where: "V–I Graph of a Cell",
        q: "When terminal voltage V is plotted on the vertical axis against current I on the horizontal axis, what do the vertical intercept and gradient represent?",
        a: "The vertical intercept represents the <strong>EMF (E)</strong>, and the gradient equals <strong>−r</strong> (negative of internal resistance)."
      },
      {
        from: 1, sec: "concepts", where: "Resistivity Formula",
        q: "State the formula relating resistance R, resistivity ρ, length L, and cross-sectional area A.",
        a: "<strong>R = ρL ÷ A</strong> (or <strong>ρ = RA ÷ L</strong>, measured in Ω m)."
      }
    ],
    recall: {
      prompt: "Close your notes and recall the core rules for series/parallel networks, cell arrays, and cell efficiency:",
      points: [
        "Resistors in series carry the same current I and add directly: R_eq = R₁ + R₂ + …",
        "Resistors in parallel share the same p.d. V and split current inversely with resistance: 1/R_eq = 1/R₁ + 1/R₂ (or R₁R₂/(R₁ + R₂) for two branches).",
        "Identical cells in series (aiding) have E_eq = nE and r_eq = nr; identical cells in parallel keep ONE cell's EMF (E_eq = E) while dividing internal resistance (r_eq = r ÷ n).",
        "Electrical power P = IV = I²R = V² ÷ R (in watts, W) and electrical energy W = IVt (in joules, J).",
        "Cell efficiency η = (R ÷ (R + r)) × 100% = (V ÷ E) × 100%."
      ]
    }
  },

  l04: {
    title: "Galvanometer Conversion — Ammeter Shunts & Voltmeter Multipliers",
    donow: [
      {
        from: 3, sec: "concepts", where: "Parallel Cells Trap",
        q: "Four identical cells each of EMF 1.5 V and internal resistance 2.0 Ω are connected in parallel. What are the combined EMF and combined internal resistance?",
        a: "Combined EMF <strong>E_eq = 1.5 V</strong> (same as one cell!), and combined internal resistance <strong>r_eq = 2.0 ÷ 4 = 0.50 Ω</strong>."
      },
      {
        from: 3, sec: "examples", where: "Cell Efficiency",
        q: "A cell of internal resistance 0.50 Ω is connected across an external resistor of 4.50 Ω. Calculate the efficiency η of the cell.",
        a: "<strong>η = [R ÷ (R + r)] × 100% = [4.50 ÷ (4.50 + 0.50)] × 100% = 90%</strong>."
      },
      {
        from: 3, sec: "concepts", where: "Current Divider",
        q: "A total current of 3.0 A enters a parallel pair of 4.0 Ω and 8.0 Ω resistors. How much current flows through the 4.0 Ω branch?",
        a: "By the current divider rule, the smaller resistor takes the larger share: <strong>I₄ = 3.0 × [8.0 ÷ (4.0 + 8.0)] = 2.0 A</strong>."
      },
      {
        from: 2, sec: "concepts", where: "Complete Circuit Law",
        q: "Write the formula for the current I delivered by a cell of EMF E and internal resistance r to an external load R.",
        a: "<strong>I = E ÷ (R + r)</strong>."
      }
    ],
    recall: {
      prompt: "Without looking back, recall how to convert a galvanometer into an ammeter or a voltmeter:",
      points: [
        "To convert a galvanometer (I_g, R_g) into an ammeter reading up to I, connect a low-resistance shunt R_s in PARALLEL.",
        "Shunt equation from equal parallel voltage: I_g R_g = (I − I_g) R_s ⇒ R_s = (I_g R_g) ÷ (I − I_g).",
        "To convert a galvanometer (I_g, R_g) into a voltmeter reading up to V, connect a high-resistance multiplier R_m in SERIES.",
        "Multiplier equation: V = I_g(R_g + R_m) ⇒ R_m = (V ÷ I_g) − R_g.",
        "Exam trap: total resistance of the converted voltmeter is V ÷ I_g, whereas the added series multiplier is (V ÷ I_g) − R_g."
      ]
    }
  },

  l05: {
    title: "Null-Balance Precision — Metre Bridge, Potentiometer & WAEC Practicals",
    donow: [
      {
        from: 4, sec: "concepts", where: "Ammeter Shunt",
        q: "A galvanometer of resistance 19.8 Ω gives full-scale deflection at 10 mA (0.010 A). What shunt resistance R_s converts it into a 0–1.0 A ammeter?",
        a: "<strong>R_s = (I_g R_g) ÷ (I − I_g) = (0.010 × 19.8) ÷ (1.0 − 0.010) = 0.198 ÷ 0.990 = 0.20 Ω</strong> in parallel."
      },
      {
        from: 4, sec: "concepts", where: "Voltmeter Multiplier",
        q: "A galvanometer of resistance 25 Ω has full-scale deflection current 8.0 mA (0.008 A). What series multiplier R_m converts it to read up to 40 V?",
        a: "Total resistance = 40 ÷ 0.008 = 5000 Ω. Added series multiplier <strong>R_m = 5000 − 25 = 4975 Ω</strong>."
      },
      {
        from: 3, sec: "concepts", where: "Parallel Cells",
        q: "Why do auto-electricians connect two 12 V batteries in parallel when jump-starting a heavy diesel engine?",
        a: "Because parallel connection keeps the voltage at <strong>12 V</strong> while <strong>halving the internal resistance (r/2)</strong>, allowing much larger cranking current."
      },
      {
        from: 2, sec: "concepts", where: "Open-Circuit EMF",
        q: "Under what condition does the terminal potential difference V across a cell equal its true EMF E?",
        a: "When the cell is on <strong>open circuit (current I = 0 A)</strong> so that lost volts Ir = 0."
      }
    ],
    recall: {
      prompt: "Without scrolling up, write down the core metre bridge, potentiometer, and WAEC Paper 3 practical rules from Lesson 5:",
      points: [
        "Metre bridge balance equation on a 100 cm uniform wire: R_left ÷ R_right = l ÷ (100 − l).",
        "In the WAEC two-wire metre bridge practical, the gradient s of R₂ against R₁ equals (d₁ ÷ d₂)², so √s = d₁ ÷ d₂.",
        "Potentiometer cell comparison: E₁ ÷ E₂ = l₁ ÷ l₂; internal resistance r = R(l₁ − l₂) ÷ l₂.",
        "A potentiometer measures true EMF because at the null balance point (I_g = 0), zero current is drawn from the test cell so no volts are lost across r.",
        "WAEC Paper 3 precautions must be written in the past tense (e.g., 'I tapped the jockey lightly on the wire instead of scraping it', 'I ensured tight and clean electrical connections')."
      ]
    }
  }
};
