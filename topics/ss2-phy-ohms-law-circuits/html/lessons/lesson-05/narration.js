/* Lesson 05 · Choreographed StudyNarrator Script — Null-Balance Precision (en-NG) */
window.NARRATION = {
  rate: 0.96,
  pitch: 1.01,

  waits: {
    note: {
      event: "kit:note",
      prompt: "Pin your question or prediction about null balance to the Wonder Wall",
      react: function () {
        return "Pinned! Let's see why null balance draws zero current and preserves true EMF.";
      }
    },
    sort: {
      event: "sort:checked",
      prompt: "Sort all 10 cards into Metre Bridge, Potentiometer, or WAEC Precautions, then tap Check",
      react: function (d) {
        if (!d) return "Good effort!";
        if (d.right === d.total) return "Ten out of ten! You have mastered Wheatstone bridges, potentiometers, and WAEC Paper 3 precautions.";
        return "You got " + d.right + " out of " + d.total + ". Review the cards in red — tapping the jockey preserves uniform cross-sectional area!";
      }
    },
    bench: {
      event: "bench:record",
      prompt: "Find the balance point and log at least 1 reading on the 3D bridge bench",
      react: function () {
        return "Logged! Notice that at null balance, the centre-zero pointer stands dead vertical at 0.00 mA.";
      }
    },
    bridge: {
      event: "vinegar:pick",
      prompt: "Solve the driver series-resistor trap and pick the true test cell EMF",
      react: function (d) {
        if (d && d.ok) return "Masterful! 1.25 V — because V_AB across the 10 Ω wire is 2.50 V, and 50 cm takes half of 2.50 V!";
        return "Watch out for the driver series resistor: find V_AB across the 10 Ω wire first, which is 2.50 V, then take half at 50 cm!";
      }
    },
    quiz: {
      event: "kit:quiz-done",
      prompt: "Answer all 12 WAEC/NECO/JAMB unit quiz questions",
      react: function (d) {
        if (!d) return "Unit quiz complete!";
        if (d.score >= 10) return "Superb — " + d.score + " out of " + d.total + "! You are 100% prepared for WAEC theory and practical exams.";
        return "You scored " + d.score + " out of " + d.total + ". Review the explanations below, then celebrate finishing the unit!";
      }
    }
  },

  actions: {
    "story:0": function () { var b = document.querySelector('#story [data-beat="0"]'); if (b) b.click(); },
    "story:1": function () { var b = document.querySelector('#story [data-beat="1"]'); if (b) b.click(); },
    "story:2": function () { var b = document.querySelector('#story [data-beat="2"]'); if (b) b.click(); },
    "bench:metre": function () { if (window.StudyScenes && window.StudyScenes.bench) window.StudyScenes.bench.setConfig({ mode: "metre-bridge", jockeyL: 40.0 }); },
    "bench:pot": function () { if (window.StudyScenes && window.StudyScenes.bench) window.StudyScenes.bench.setConfig({ mode: "potentiometer", jockeyL: 50.0 }); },
    "zoom:null": function () { if (window.StudyScenes && window.StudyScenes.zoom) window.StudyScenes.zoom.setMode("null-point"); }
  },

  script: [
    {
      title: "Welcome",
      steps: [
        {
          target: ".l-hero .display",
          cue: "Lesson 5 · Null-Balance Precision",
          sparkle: true,
          say: "Welcome to Lesson 5, our grand unit finale! Today we are mastering the Wheatstone bridge, the metre bridge, the 100-centimetre potentiometer, and WAEC Physics Practical Paper 3 precautions."
        },
        {
          target: "#objectives",
          cue: "5 goals for Lesson 5",
          say: "You will apply R 1 over R 2 equals l over 100 minus l, prove the two-wire square root of s identity, solve potentiometer driver circuits, and write official WAEC precautions."
        }
      ]
    },
    {
      title: "Do Now",
      steps: [
        {
          target: "#donow-list",
          cue: "Retrieve Lessons 1–4",
          say: "Warm up with these four retrieval cards on ammeter shunts, voltmeter multipliers, parallel cells, and wire diameter scaling."
        }
      ]
    },
    {
      title: "The Story",
      steps: [
        {
          target: "#story-stage",
          action: "story:0",
          cue: "Aba Workshop battery mystery",
          say: "Back in Aba, Engineer Nkechi shows Chinedu why even a high-grade voltmeter draws current and loses volts. To measure true open-circuit E M F, we use a null-balance potentiometer!"
        },
        {
          target: "#story-stage",
          action: "story:1",
          cue: "Tapping the jockey to I_g = 0",
          say: "Chinedu taps the brass jockey gently along the constantan wire until the galvanometer needle reads zero. When current is zero, lost volts I r is zero!"
        },
        {
          target: "#story-stage",
          action: "story:2",
          cue: "Case closed & WAEC Paper 3 mastered",
          say: "Case closed! With true E M F verified at 12.0 volts and internal resistance at 1.2 ohms, Chinedu cleans the terminals and masters the entire unit!"
        }
      ]
    },
    {
      title: "Wonder Wall",
      steps: [
        {
          target: "#wall-wonder",
          cue: "Pin your question",
          wait: "note",
          say: "Pin your prediction: why does tapping instead of dragging the jockey preserve the uniform potential gradient?"
        }
      ]
    },
    {
      title: "Concept Sort",
      steps: [
        {
          target: "#kitchen-sort",
          cue: "Sort bridge rules",
          wait: "sort",
          say: "Sort these 10 cards into Wheatstone and Metre Bridge, Potentiometer, or WAEC Paper 3 Precautions, then tap Check my sorting."
        }
      ]
    },
    {
      title: "3D Practical",
      steps: [
        {
          target: "#bench-stage",
          action: "bench:metre",
          cue: "3D Dual Bridge Bench",
          wait: "bench",
          say: "Slide the brass jockey on our 3D bridge bench! Find the exact null balance point where the green halo lights up and log your reading."
        }
      ]
    },
    {
      title: "Make Sense",
      steps: [
        {
          target: "#concepts",
          cue: "Core bridge formulas",
          say: "Review the key relationships: metre bridge balance, the WAEC two-wire diameter ratio square root of s equals d 1 over d 2, and the driver series-resistor divider."
        }
      ]
    },
    {
      title: "Concept Zoom",
      steps: [
        {
          target: "#zoom-stage",
          action: "zoom:null",
          cue: "Zero-current null point",
          say: "Look inside the contact! At the Exact Null Point, driver current flows steadily along the top wire while the green charges below stand completely still — proving I g equals zero and lost volts I r equals zero!"
        }
      ]
    },
    {
      title: "Worked Examples",
      steps: [
        {
          target: "#examples",
          cue: "Step-by-step solutions",
          say: "Study these step-by-step worked examples covering metre bridge unknown resistance, the two-wire slope identity, driver series resistors, and internal resistance."
        }
      ]
    },
    {
      title: "The Big Idea",
      steps: [
        {
          target: "#vinegar-test",
          cue: "The Driver Resistor Trap",
          wait: "bridge",
          say: "Conquer the ultimate exam trap: find the test cell E M F when a 3.0-volt driver battery is in series with a 2.0-ohm resistor and a 10-ohm wire, balancing at 50 centimetres!"
        }
      ]
    },
    {
      title: "Quiz",
      steps: [
        {
          target: "#quiz-list",
          cue: "Final Unit Checkpoint",
          wait: "quiz",
          say: "Take the 12-question final checkpoint, rate your confidence, and unlock the WAEC Paper 3 practical marking schemes!"
        }
      ]
    }
  ]
};
