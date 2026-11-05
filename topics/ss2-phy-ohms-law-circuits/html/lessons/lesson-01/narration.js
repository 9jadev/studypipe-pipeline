/* Lesson 01 · Choreographed StudyNarrator Script — Ohm's Law, Metallic Conduction & Wire Resistivity (en-NG) */
window.NARRATION = {
  rate: 0.96,
  pitch: 1.01,

  waits: {
    note: {
      event: "kit:note",
      prompt: "Type a prediction (or tap a seed question) and pin it to the Wonder Wall",
      react: function () {
        return "Pinned! Now let's test your prediction on the 3D circuit bench.";
      }
    },
    sort: {
      event: "l1:sort-checked",
      prompt: "Sort all 12 cards into Ohmic, Non-Ohmic, and WAEC Circuit Rules, then tap Check my sorting",
      react: function (d) {
        if (!d) return "Good effort!";
        if (d.score === d.total) return "Twelve out of twelve! You separated ohmic alloys, non-ohmic lamps and diodes, and WAEC circuit rules like a pro.";
        if (d.score >= 9) return "Nice work! " + d.score + " out of " + d.total + ". Check the notes below for any card that slipped.";
        return "You got " + d.score + " out of " + d.total + ". Review the feedback below — distinguishing ohmic from non-ohmic conductors is a classic WAEC question!";
      }
    },
    bench: {
      event: "l1:bench-done",
      prompt: "Record at least 4 trials (A–E) on the 3D Ohm's law bench",
      react: function () {
        return "Excellent! You have recorded your V and I readings while opening the key between trials. Let's inspect the constant ratio V over I.";
      }
    },
    bridge: {
      event: "l1:vinegar-done",
      prompt: "Run Steps 1, 2 and 3 to upgrade Kelechi's workshop cable",
      react: function () {
        return "Puzzle solved! Doubling diameter, halving length, and switching to copper slashed the cable resistance so full current flows.";
      }
    },
    quiz: {
      event: "kit:quiz-done",
      prompt: "Answer all 12 WAEC/NECO/JAMB quiz questions",
      react: function (d) {
        if (!d) return "Quiz complete!";
        if (d.score >= 10) return "Outstanding — " + d.score + " out of " + d.total + "! You have mastered Ohm's Law and Wire Resistivity.";
        if (d.score >= 7) return "Well done! " + d.score + " out of " + d.total + ". Review the explanations on the ones you missed.";
        return "You scored " + d.score + " out of " + d.total + ". Replay the Make Sense and Lattice Zoom chapters, then retry!";
      }
    }
  },

  actions: {
    "pin:0": function () { if (window.L01 && window.L01.showPin) window.L01.showPin(0); },
    "pin:2": function () { if (window.L01 && window.L01.showPin) window.L01.showPin(2); },
    "pin:4": function () { if (window.L01 && window.L01.showPin) window.L01.showPin(4); },
    "bench:heavy": function () { if (window.StudyScenes && window.StudyScenes.bench) window.StudyScenes.bench.setCond("heavy"); },
    "bench:std":   function () { if (window.StudyScenes && window.StudyScenes.bench) window.StudyScenes.bench.setCond("std"); },
    "clock:1": function () { if (window.L01 && window.L01.vt) window.L01.vt.step1(); },
    "clock:2": function () { if (window.L01 && window.L01.vt) window.L01.vt.step2(); }
  },

  script: [
    {
      title: "Welcome",
      steps: [
        {
          target: ".l-hero .display",
          cue: "Lesson 1 · Ohm's Law & Resistivity",
          sparkle: true,
          say: "Welcome to Lesson 1 of Current Electricity! Today we are investigating Ohm's Law, Metallic Conduction, and Wire Resistivity — the foundation of every circuit calculation and WAEC Paper 3 practical."
        },
        {
          target: ".l-hero .question",
          cue: "Our guiding question",
          say: "Here is our guiding puzzle: why does a thin constantan wire choke current and heat up, while a thick copper cable of the same length lets current surge freely?"
        },
        {
          target: "#objectives",
          cue: "5 goals for Lesson 1",
          say: "By the end of this lesson you will state Ohm's law with its constant-temperature condition, distinguish ohmic from non-ohmic conductors, apply R equals 4 rho L over pi d squared, and run the WAEC V-against-I practical."
        }
      ]
    },
    {
      title: "Do Now",
      steps: [
        {
          target: "#donow-list",
          cue: "Wake up your toolkit",
          say: "Start with these four quick Do Now cards on electric current I equals Q over t, potential difference, meter placement, and circular wire area. Answer each in your head before flipping!"
        }
      ]
    },
    {
      title: "The Story",
      steps: [
        {
          target: "#story-stage",
          action: "story:0",
          cue: "Chinedu's Workshop, Aba",
          say: "Let's step into Chinedu's Auto-Electric Workshop on Ngwa Road, Aba. Apprentice Kelechi is baffled: why did a thin jumper wire get hot and barely crank the machine, while a thick copper cable spun it immediately?"
        },
        {
          target: { scene: "story", part: "cust2" },
          action: "story:1",
          cue: "Papa Nnamdi's question",
          say: "Papa Nnamdi thinks any one-metre metal wire connected across 2 volts should carry the exact same current."
        },
        {
          target: { scene: "story", part: "ngozi" },
          action: "story:2",
          cue: "Resistance controls current",
          say: "Oga Chinedu explains that at a given voltage V, current I is controlled by electrical resistance R — and wire diameter and material change R dramatically."
        },
        {
          target: { scene: "story", part: "clockB" },
          action: "story:3",
          cue: "Rig A vs Rig B",
          say: "Look at Rig A and Rig B on the bench: doubling a wire's diameter quadruples its circular cross-sectional area and cuts its resistance to one-quarter!"
        },
        {
          target: { scene: "story", part: "amaka" },
          action: "story:5",
          cue: "To the WAEC Physics Lab!",
          say: "In the Physics Laboratory, Engineer Nkechi sets up the standard WAEC Ohm's law circuit — ammeter in series, voltmeter in parallel, rheostat and plug key — so we can test V against I ourselves."
        }
      ]
    },
    {
      title: "Wonder Wall",
      steps: [
        {
          target: "#wall-wonder",
          cue: "Pin your prediction",
          wait: "note",
          say: "Before we touch the 3D circuit bench, pin your prediction to the Wonder Wall: how do wire diameter and temperature affect resistance?"
        }
      ]
    },
    {
      title: "Conductor Sort",
      steps: [
        {
          target: "#kitchen-sort",
          cue: "Ohmic vs Non-Ohmic vs Rules",
          wait: "sort",
          say: "Activity 1! Sort all twelve cards into Ohmic Conductors, Non-Ohmic Devices, and Mandatory WAEC Circuit Rules, then tap Check my sorting."
        }
      ]
    },
    {
      title: "3D Practical",
      steps: [
        {
          target: "#safety-box",
          cue: "WAEC Setup Rules",
          say: "Now step up to the 3D Ohm's Law Practical Bench! Remember: connect the ammeter in series, connect the voltmeter in parallel across the constantan wire, and remove the plug key immediately after each reading."
        },
        {
          target: { scene: "bench", part: "clamp" },
          cue: "Accumulator & Plug Key K",
          say: "On the back left are the accumulator cell and the brass plug key K."
        },
        {
          target: { scene: "bench", part: "ruler" },
          cue: "Sliding Rheostat",
          say: "In the front left is the sliding rheostat used to vary the circuit current I in five clean steps."
        },
        {
          target: { scene: "bench", part: "fiducial" },
          cue: "Ammeter (series) & Voltmeter (parallel)",
          say: "And here are the series ammeter and the parallel voltmeter wired across our 2 point 20 ohm constantan resistance wire."
        },
        {
          target: { scene: "bench", part: "bob" },
          action: "bench:test:0",
          cue: "Trial A · I = 0.25 A, V = 0.55 V",
          say: "Watch Trial A: when current I is 0 point 25 amps, potential difference V is 0 point 55 volts, giving V divided by I equal to 2 point 20 ohms!"
        },
        {
          target: "#bench-stage",
          action: "bench:std",
          cue: "Your turn on the bench!",
          wait: "bench",
          say: "Now it's your turn! Tap the trial buttons to record at least four readings on the 3D circuit bench."
        },
        {
          target: "#results-table",
          cue: "Complete the WAEC table",
          say: "Select your recorded I, V, and R values in the WAEC table and tap Check my table."
        },
        {
          target: "#expected",
          action: "open:#expected",
          cue: "Slope ΔV / ΔI = R = 2.20 Ω",
          say: "Look at the completed table: V divided by I stays constant at 2 point 20 ohms across every trial, confirming Ohm's law!"
        }
      ]
    },
    {
      title: "Ohm's Law & Resistivity",
      steps: [
        {
          target: "#eq-shm",
          cue: "Ohm's Law: V = IR",
          sparkle: true,
          say: "Let's state Ohm's law formally: the electric current I flowing through a metallic conductor is directly proportional to the potential difference V across its ends, provided temperature and other physical conditions remain constant."
        },
        {
          target: ["#eq-omega", "#eq-vel"],
          cue: "Resistivity & Diameter Ratio",
          say: "Resistance R equals rho L over A. Since circular area A equals pi d squared over 4, R equals 4 rho L over pi d squared! That means R is inversely proportional to diameter squared."
        },
        {
          target: "#ph-explorer",
          action: "pin:0",
          cue: "Short & Thick Wire (½L, 2d)",
          say: "Tap along the Wire Dimension Explorer: halving length and doubling diameter drops resistance from 4 ohms right down to 0 point 50 ohms!"
        },
        {
          target: "#ph-explorer",
          action: "pin:4",
          cue: "Long & Thin Wire (2L, ½d)",
          say: "Whereas doubling length and halving diameter multiplies resistance by 8 times to 32 ohms!"
        }
      ]
    },
    {
      title: "3D Lattice Zoom",
      steps: [
        {
          target: { scene: "zoom", part: "vectors" },
          action: "zoom:mode:mix",
          cue: "300 K Constantan Lattice",
          say: "Zoom inside the metal wire in 3D! Cyan free electrons drift past amber positive metal ions."
        },
        {
          target: { scene: "zoom", part: "vectors" },
          action: "zoom:mode:acid",
          cue: "2200 K Hot Tungsten Filament",
          say: "Switch to Hot Filament mode: notice how the amber lattice ions vibrate violently at high temperature, colliding with electrons and raising resistance R!"
        },
        {
          target: { scene: "zoom", part: "bars" },
          action: "zoom:mode:base",
          cue: "Double Diameter (4× Area)",
          say: "Switch to Double Diameter: the wider channel lets four times as much current flow at the same voltage!"
        }
      ]
    },
    {
      title: "Worked Examples & Bridge",
      steps: [
        {
          target: "#ex1",
          cue: "Example 1 · Ohm's Law & Charge",
          say: "Study Worked Example 1: find current I equals V over R first, convert minutes to seconds, and multiply I by t to get charge Q in coulombs."
        },
        {
          target: "#ex2",
          cue: "Example 2 · Resistivity & 2× Diameter",
          say: "Example 2 shows how to calculate resistivity rho in ohm-metres and use the diameter-squared ratio."
        },
        {
          target: "#vinegar-test",
          action: "clock:1",
          cue: "Upgrade Kelechi's Cable!",
          wait: "bridge",
          say: "Now help Kelechi upgrade the thin Aba workshop cable! Click Steps 1, 2, and 3 to double diameter, halve length, and switch to copper."
        }
      ]
    },
    {
      title: "Quiz & Reflect",
      steps: [
        {
          target: "#quiz",
          cue: "12 WAEC & JAMB Questions",
          wait: "quiz",
          say: "Test yourself on these twelve exam-style questions on Ohm's law, resistivity, and WAEC Paper 3 precautions."
        },
        {
          target: "#reflect",
          cue: "Rate your confidence & Assignment",
          say: "Finally, rate your confidence from 1 to 4, complete the Exit Ticket, and try the 30-mark assignment before moving to Lesson 2!"
        }
      ]
    }
  ]
};
