/* Lesson 02 · Choreographed StudyNarrator Script — EMF, Terminal P.D., Lost Volts & Internal Resistance (en-NG) */
window.NARRATION = {
  rate: 0.96,
  pitch: 1.01,

  waits: {
    note: {
      event: "kit:note",
      prompt: "Type a prediction (or tap a seed question) and pin it to the Wonder Wall",
      react: function () {
        return "Pinned! Let's test your hypothesis about the missing 3.6 volts.";
      }
    },
    sort: {
      event: "l1:sort-checked",
      prompt: "Sort all 12 cards into EMF (E), Terminal P.D. (V), and Lost Volts / Internal r, then tap Check my sorting",
      react: function (d) {
        if (!d) return "Good effort!";
        if (d.score === d.total) return "Twelve out of twelve! You distinguished open-circuit E M F, external terminal voltage V, and internal lost volts I r cleanly.";
        if (d.score >= 9) return "Great work! " + d.score + " out of " + d.total + ". Check the notes below for any card you missed.";
        return "You got " + d.score + " out of " + d.total + ". Review the feedback below — separating E, V, and I r is essential for Lesson 2!";
      }
    },
    bench: {
      event: "l1:bench-done",
      prompt: "Test at least 4 external loads (Trials A–E) on the 3D Internal Resistance Bench",
      react: function () {
        return "Spot on! Notice how Terminal V plus Lost Volts I r always adds up to the full 12 point 0 volts E M F!";
      }
    },
    bridge: {
      event: "l1:vinegar-done",
      prompt: "Run Steps 1, 2 and 3 to solve the Two-Readings Simultaneous Equation",
      react: function () {
        return "Mystery solved! Equating I one into R one plus r with I two into R two plus r gave r equals 1.20 ohms and E equals 12.0 volts.";
      }
    },
    quiz: {
      event: "kit:quiz-done",
      prompt: "Answer all 12 WAEC/NECO/JAMB quiz questions",
      react: function (d) {
        if (!d) return "Quiz complete!";
        if (d.score >= 10) return "Outstanding — " + d.score + " out of " + d.total + "! You are ready for any exam question on E M F and internal resistance.";
        if (d.score >= 7) return "Well done! " + d.score + " out of " + d.total + ". Review the explanations on the ones you missed.";
        return "You scored " + d.score + " out of " + d.total + ". Replay the Make Sense and Electrolyte Zoom chapters, then retry!";
      }
    }
  },

  actions: {
    "pin:0": function () { if (window.L01 && window.L01.showPin) window.L01.showPin(0); },
    "pin:3": function () { if (window.L01 && window.L01.showPin) window.L01.showPin(3); },
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
          cue: "Lesson 2 · EMF & Internal Resistance",
          sparkle: true,
          say: "Welcome to Lesson 2! Today we are solving the Aba workshop battery mystery by mastering Electromotive Force E, Terminal Potential Difference V, Lost Volts I r, and Internal Resistance r."
        },
        {
          target: "#objectives",
          cue: "5 goals for Lesson 2",
          say: "You will apply E equals I into R plus r, solve the classic two-readings simultaneous equation, and find E and r from the intercept and negative slope of a V-against-I graph."
        }
      ]
    },
    {
      title: "Do Now",
      steps: [
        {
          target: "#donow-list",
          cue: "Spaced retrieval from Lesson 1",
          say: "First, complete these four Do Now cards from Lesson 1 on Ohm's law, diameter scaling, charge flow, and opening the plug key."
        }
      ]
    },
    {
      title: "The Story",
      steps: [
        {
          target: "#story-stage",
          action: "story:0",
          cue: "The 12.0 V → 8.4 V Drop",
          say: "Back at Chinedu's workshop in Aba, Kelechi measures a newly charged 12-volt battery: it reads 12 point 0 volts when the switch is open, but plunges to 8 point 4 volts the instant he cranks the 2 point 8 ohm starter!"
        },
        {
          target: { scene: "story", part: "ngozi" },
          action: "story:2",
          cue: "Internal resistance r inside the cell",
          say: "Oga Chinedu points out that the battery casing warms up because the sulfuric acid electrolyte and plates inside have their own internal resistance r."
        },
        {
          target: { scene: "story", part: "clockB" },
          action: "story:3",
          cue: "3.6 V lost inside the battery!",
          say: "When 3 amps flow through r equal to 1 point 2 ohms, 3 point 6 volts are lost inside the battery itself, leaving 8 point 4 volts for the starter motor!"
        },
        {
          target: { scene: "story", part: "amaka" },
          action: "story:5",
          cue: "Plot V against I in the Lab",
          say: "At the Physics Lab, Engineer Nkechi sets up a decade resistance box so we can vary R, measure V and I, and determine both E and r."
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
          say: "Pin your prediction to the Wonder Wall: how can we find a battery's internal resistance r without opening its casing?"
        }
      ]
    },
    {
      title: "Concept Sort",
      steps: [
        {
          target: "#kitchen-sort",
          cue: "Sort E, V, and Lost Volts Ir",
          wait: "sort",
          say: "Activity 1! Sort all twelve statements into Electromotive Force E, Terminal Potential Difference V, and Lost Volts or Internal Resistance r."
        }
      ]
    },
    {
      title: "3D Practical",
      steps: [
        {
          target: { scene: "bench", part: "bob" },
          cue: "12.0 V Cell (r = 1.2 Ω)",
          say: "Here on the 3D bench is Chinedu's 12-volt battery with internal resistance r equal to 1 point 2 ohms."
        },
        {
          target: { scene: "bench", part: "ruler" },
          cue: "Decade Load Box R",
          say: "In the front is the decade resistance box R, wired with a series ammeter and a parallel voltmeter across the battery terminals."
        },
        {
          target: "#bench-cond",
          action: "bench:heavy",
          cue: "Open Key: V = E = 12.0 V",
          say: "When we open the brass plug key, current I drops to zero, lost volts I r become zero, and the voltmeter reads the full open-circuit E M F of 12 point 0 volts!"
        },
        {
          target: "#bench-stage",
          action: "bench:std",
          cue: "Your turn on the bench!",
          wait: "bench",
          say: "Now it's your turn! Tap Trials A through E to test at least four external loads and watch how Terminal V and Lost Volts behave."
        },
        {
          target: "#expected",
          action: "open:#expected",
          cue: "Slope = −r = −1.20 Ω",
          say: "Look at the completed table: as current rises from 1 amp to 3 amps, terminal voltage drops linearly from 10 point 8 volts to 8 point 4 volts with gradient minus 1 point 20 ohms!"
        }
      ]
    },
    {
      title: "Complete Circuit Law",
      steps: [
        {
          target: "#eq-shm",
          cue: "E = I(R + r) & V = E − Ir",
          sparkle: true,
          say: "Here is the complete circuit equation: E equals V plus v, which equals I R plus I r, or I into R plus r. Rearranging gives V equals E minus I r."
        },
        {
          target: "#eq-vel",
          cue: "Two Readings, Same Cell",
          say: "And memorise this top JAMB and WAEC weapon: when the same cell supplies current I one to resistor R one and I two to resistor R two, equate I one into R one plus r with I two into R two plus r!"
        },
        {
          target: "#ph-explorer",
          action: "pin:0",
          cue: "Open Circuit (I = 0)",
          say: "On the Load Current Explorer, at open circuit I equals zero, 100 percent of E appears at the terminals."
        },
        {
          target: "#ph-explorer",
          action: "pin:4",
          cue: "Short Circuit (R = 0)",
          say: "At short circuit R equals zero, current hits I max equals E over r, terminal voltage collapses to zero, and all 12 volts turn into internal heat!"
        }
      ]
    },
    {
      title: "3D Electrolyte Zoom",
      steps: [
        {
          target: { scene: "zoom", part: "vectors" },
          action: "zoom:mode:mix",
          cue: "Ions migrating through acid",
          say: "Zoom inside the lead-acid cell! As ions migrate between the positive and negative plates through the electrolyte, internal drag costs 3 point 6 lost volts."
        },
        {
          target: { scene: "zoom", part: "bars" },
          action: "zoom:mode:acid",
          cue: "Open Circuit: Zero Lost Volts",
          say: "Switch to Open Circuit: ion drift stops, the red Lost Volts bar drops to zero, and Terminal V equals the full 12 volts E M F!"
        }
      ]
    },
    {
      title: "Worked Examples & Bridge",
      steps: [
        {
          target: "#ex1",
          cue: "Example 1 · Terminal P.D. & Lost Volts",
          say: "Worked Example 1 solves the Aba starter drop in three clean lines."
        },
        {
          target: "#ex2",
          cue: "Example 2 · Two Readings Method",
          say: "Worked Example 2 shows how to equate I one into R one plus r with I two into R two plus r to find both r and E."
        },
        {
          target: "#vinegar-test",
          action: "clock:1",
          cue: "Solve the Two-Readings Case!",
          wait: "bridge",
          say: "Now use the two-readings method in the Bridge Challenge! Click Steps 1, 2, and 3 to solve for Chinedu's battery internal resistance and E M F."
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
          say: "Try all twelve exam questions on E M F, lost volts, two-load calculations, and V–I cell graphs!"
        },
        {
          target: "#reflect",
          cue: "Reflect & Assignment",
          say: "Rate yourself from 1 to 4, answer the Exit Ticket, and complete the 30-mark assignment before heading to Lesson 3!"
        }
      ]
    }
  ]
};
