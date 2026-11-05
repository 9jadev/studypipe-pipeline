/* ==========================================================
   StudyPipe — Welcome Hub Guided Tour Narration (en-NG priority)
   ========================================================== */
window.NARRATION = {
  rate: 0.95,
  pitch: 1.02,

  waits: {
    lab: {
      event: "lab:result",
      timeout: 60000,
      prompt: "Your turn! Tap 'Toggle Plug Key' or 'Change Load R' in the 3D circuit bench.",
      react: function (d) {
        if (!d) return { say: "No wahala! You can test the 3D circuit bench any time. Let's explore the rest of the unit." };
        if (!d.closed) {
          return {
            say: "Spot on! With the brass plug key open, current I is zero, so zero volts are lost inside the battery and the voltmeter reads the full open-circuit E M F of 12 point 0 volts!",
            target: "#endpoint-toast",
            sparkle: true,
            cue: "Open circuit: V = E = 12.0 V"
          };
        }
        return {
          say: "Look at that reading! With external load R equal to " + d.R.toFixed(1) + " ohms, current I is " + d.I.toFixed(2) + " amps, terminal voltage V drops to " + d.V.toFixed(1) + " volts, and " + d.lost.toFixed(1) + " volts are lost across the internal resistance r!",
          target: "#endpoint-toast",
          sparkle: true,
          cue: "Closed circuit reading!"
        };
      }
    }
  },

  script: [
    {
      title: "Welcome",
      steps: [
        {
          target: ".hero-title",
          cue: "Ohm's Law & Current Electricity",
          sparkle: true,
          say: "Welcome! In this five-lesson physics unit, we are mastering Ohm's Law, Circuit Networks, and Electrical Measurements — one of the most heavily tested topics in WAEC, NECO, and JAMB Physics."
        },
        {
          target: ".hero-meta",
          cue: "5 lessons · 10 3D stages",
          say: "You have five progressive lessons, ten interactive 3D circuit stages, and all three compulsory WAEC Paper 3 electricity practicals — working one hundred percent offline."
        }
      ]
    },
    {
      title: "The 3D Circuit Bench",
      steps: [
        {
          target: "#lab",
          cue: "Live 3D Circuit Lab",
          say: "Right here in the hero is a live 3D direct-current circuit bench. Let's inspect each piece of apparatus before you test the circuit."
        },
        {
          target: { part: "cell" },
          cue: "12 V Lead-Acid Accumulator",
          say: "At the back left sits a 12-volt lead-acid accumulator cell with internal resistance r equal to 1 point 2 ohms."
        },
        {
          target: { part: "switch" },
          cue: "Brass Plug Key",
          say: "In front of the cell is the brass plug key. Remember WAEC's golden rule: always remove the plug key between readings so the resistance wire does not heat up!"
        },
        {
          target: { part: "rheostat" },
          cue: "Sliding Constantan Rheostat",
          say: "Across the front is the variable load resistor R, wired in series with the ammeter on the right and the parallel voltmeter across the battery. Now it's your turn to toggle the key or change the load!",
          wait: "lab"
        }
      ]
    },
    {
      title: "The Aba Workshop Mystery",
      steps: [
        {
          target: "#mystery .section-title",
          cue: "Aba Workshop Mystery",
          sparkle: true,
          say: "Every lesson in this unit connects to a real Nigerian puzzle at Chinedu's Auto-Electric and Tailoring Workshop on Ngwa Road, Aba."
        },
        {
          target: ".case-card",
          cue: "Case File #ELEC-05",
          say: "Why does Chinedu's newly charged 12-volt battery read a full 12 point 0 volts when idle, yet plunge to 8 point 4 volts the instant the heavy starter load is switched on — while Engineer Nkechi's 100-centimetre potentiometer still measures the full 12 point 0 volts?"
        },
        {
          target: ".stats",
          cue: "High Exam Weight",
          say: "Look at the exam weight: Current Electricity gives you three to five objective questions and a compulsory WAEC or NECO Paper 3 practical almost every single year."
        }
      ]
    },
    {
      title: "Your 5-Lesson Journey",
      steps: [
        {
          target: "#journey .section-title",
          cue: "5 progressive lessons",
          say: "We have structured the entire topic into five focused fifty-minute lessons."
        },
        {
          target: '.lesson[data-lesson="1"]',
          cue: "Lesson 1 · Ohm's Law & Resistivity",
          say: "Lesson 1 covers Ohm's law V equals I R, why heating a metal raises its resistance, wire resistivity R equals rho L over A, and the WAEC V-against-I graph practical."
        },
        {
          target: '.lesson[data-lesson="2"]',
          cue: "Lesson 2 · EMF & Lost Volts",
          say: "Lesson 2 solves the Aba battery voltage drop using E equals I into R plus r, terminal potential difference V equals E minus I r, and the famous two-readings simultaneous method."
        },
        {
          target: '.lesson[data-lesson="3"]',
          cue: "Lesson 3 · Networks, Cells & Efficiency",
          say: "Lesson 3 masters series and parallel resistor networks, the parallel-cells exam trap where E stays equal to one cell while internal resistance divides by n, plus electrical power and cell efficiency."
        },
        {
          target: '.lesson[data-lesson="4"]',
          cue: "Lesson 4 · Shunts & Multipliers",
          say: "Lesson 4 shows you how to convert a sensitive milliammeter galvanometer into a heavy-duty ammeter using a parallel shunt R s, or into a high-range voltmeter using a series multiplier R m."
        },
        {
          target: '.lesson[data-lesson="5"]',
          cue: "Lesson 5 · Metre Bridge & Potentiometer",
          say: "And Lesson 5 puts you in full command of the Wheatstone metre bridge, the 100-centimetre potentiometer, and the exact past-tense precautions WAEC examiners reward."
        }
      ]
    },
    {
      title: "Concept Explorer",
      steps: [
        {
          target: "#explorer .section-title",
          cue: "Interactive Graph Explorer",
          say: "Try this four-tab Concept Explorer to preview the key graphs of Current Electricity."
        },
        {
          target: "#combo-tabs",
          action: "combo:ohmic",
          cue: "Ohmic Constantan Wire",
          say: "For an ohmic constantan wire at constant temperature, voltage V against current I is a straight line through the origin whose slope equals resistance R."
        },
        {
          target: "#combo-tabs",
          action: "combo:internal",
          cue: "Terminal P.D. (V = E − Ir)",
          say: "Switch to Terminal Voltage Drop: plotting V against I for a cell gives a downward-sloping line starting at vertical intercept E with gradient equal to minus r!"
        }
      ]
    },
    {
      title: "Archetypes & Myths",
      steps: [
        {
          target: "#archetypes",
          cue: "6 calculation patterns",
          say: "Here are the six calculation archetypes from your past-question bank — covering resistivity ratios, two-load internal resistance, parallel cells, efficiency, shunts and multipliers, and bridge balance."
        },
        {
          target: "#myths",
          action: "myth:0",
          cue: "Myth #1 busted",
          say: "And never fall for these three exam traps! First: four 1 point 5 volt cells in parallel do NOT give 6 volts — they give 1 point 5 volts with one-quarter of the internal resistance!"
        },
        {
          target: "#myths",
          action: "myth:1",
          cue: "Myth #2 busted",
          say: "Second: a voltmeter always draws a small current and reads slightly less than true E M F. Only a potentiometer at null balance draws zero current and reads exact E M F!"
        }
      ]
    },
    {
      title: "Ready to Begin",
      steps: [
        {
          target: ".finale",
          cue: "Start Lesson 1",
          sparkle: true,
          say: "You are ready! Tap Start Lesson 1 below to step into the Aba workshop and begin your investigation."
        }
      ]
    }
  ]
};
