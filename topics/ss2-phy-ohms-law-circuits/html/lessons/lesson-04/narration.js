/* Lesson 04 · Choreographed StudyNarrator Script — Galvanometer Conversion (en-NG) */
window.NARRATION = {
  rate: 0.96,
  pitch: 1.01,

  waits: {
    note: {
      event: "kit:note",
      prompt: "Pin your question or prediction about meters to the Wonder Wall",
      react: function () {
        return "Pinned! Let's see how parallel shunts and series multipliers protect the meter.";
      }
    },
    sort: {
      event: "sort:checked",
      prompt: "Sort all 10 cards into Coil, Ammeter Shunt, or Voltmeter Multiplier, then tap Check my sorting",
      react: function (d) {
        if (!d) return "Good effort!";
        if (d.right === d.total) return "Ten out of ten! You have completely distinguished galvanometer ratings, parallel shunts, and series multipliers.";
        return "You got " + d.right + " out of " + d.total + ". Remember: low-resistance shunts connect in parallel for ammeters; high-resistance multipliers connect in series for voltmeters!";
      }
    },
    bench: {
      event: "bench:record",
      prompt: "Design an ammeter or voltmeter on the 3D bench and log the design",
      react: function () {
        return "Logged! Notice that the ammeter shunt is tiny fractions of an ohm, while the voltmeter multiplier is thousands of ohms.";
      }
    },
    bridge: {
      event: "vinegar:pick",
      prompt: "Pick the correct added series multiplier R_m",
      react: function (d) {
        if (d && d.ok) return "Spot on! 195 ohms — 200 ohms total minus the 5-ohm coil!";
        return "Careful! 200 ohms is the total resistance, so subtract the 5.0-ohm coil to find R_m!";
      }
    },
    quiz: {
      event: "kit:quiz-done",
      prompt: "Answer all 12 WAEC/NECO/JAMB quiz questions",
      react: function (d) {
        if (!d) return "Quiz finished!";
        if (d.score >= 10) return "Outstanding — " + d.score + " out of " + d.total + "! You have mastered meter conversion.";
        return "You scored " + d.score + " out of " + d.total + ". Review the step-by-step solutions below.";
      }
    }
  },

  actions: {
    "story:0": function () { var b = document.querySelector('#story [data-beat="0"]'); if (b) b.click(); },
    "story:1": function () { var b = document.querySelector('#story [data-beat="1"]'); if (b) b.click(); },
    "story:2": function () { var b = document.querySelector('#story [data-beat="2"]'); if (b) b.click(); },
    "bench:ammeter": function () { if (window.StudyScenes && window.StudyScenes.bench) window.StudyScenes.bench.setConfig({ mode: "ammeter", Rg: 20, Ig_mA: 10 }); },
    "bench:voltmeter": function () { if (window.StudyScenes && window.StudyScenes.bench) window.StudyScenes.bench.setConfig({ mode: "voltmeter", Rg: 20, Ig_mA: 10 }); },
    "zoom:shunt": function () { if (window.StudyScenes && window.StudyScenes.zoom) window.StudyScenes.zoom.setMode("shunt-bypass"); }
  },

  script: [
    {
      title: "Welcome",
      steps: [
        {
          target: ".l-hero .display",
          cue: "Lesson 4 · Meter Conversion",
          sparkle: true,
          say: "Welcome to Lesson 4! Today we are learning how to convert a sensitive moving-coil galvanometer into a heavy-current ammeter or a high-voltage voltmeter."
        },
        {
          target: "#objectives",
          cue: "5 goals for Lesson 4",
          say: "You will derive the parallel shunt formula, the series multiplier formula, distinguish added R m from total resistance, and master ideal meter placements."
        }
      ]
    },
    {
      title: "Do Now",
      steps: [
        {
          target: "#donow-list",
          cue: "Retrieve Lessons 1–3",
          say: "Warm up with these four retrieval flashcards on parallel current division, parallel cell banks, efficiency, and lost volts."
        }
      ]
    },
    {
      title: "The Story",
      steps: [
        {
          target: "#story-stage",
          action: "story:0",
          cue: "Mazi Okafor's Workshop, Onitsha",
          say: "At Onitsha Head Bridge Market, Mazi Okafor has a delicate 20-ohm galvanometer that can only tolerate 10 milliamperes. Any larger current would destroy the moving coil!"
        },
        {
          target: "#story-stage",
          action: "story:1",
          cue: "Amaka's 0.0401 Ω parallel shunt",
          say: "Amaka solders a 0.0401-ohm copper shunt in parallel! Now 4.99 amperes safely bypasses the coil while exactly 0.010 amperes gives full-scale deflection!"
        },
        {
          target: "#story-stage",
          action: "story:2",
          cue: "1480 Ω series multiplier",
          say: "To read up to 15 volts instead, Mazi Okafor connects a 1480-ohm resistor in series to absorb 14.80 volts, leaving only 0.20 volts across the delicate coil!"
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
          say: "Post your question: why do we connect the shunt in parallel for an ammeter, but place the completed ammeter in series?"
        }
      ]
    },
    {
      title: "Concept Sort",
      steps: [
        {
          target: "#kitchen-sort",
          cue: "Sort meter parts",
          wait: "sort",
          say: "Sort these 10 cards into Galvanometer Coil, Ammeter Shunt, or Voltmeter Multiplier, then tap Check my sorting."
        }
      ]
    },
    {
      title: "3D Practical",
      steps: [
        {
          target: "#bench-stage",
          action: "bench:ammeter",
          cue: "3D Conversion Bench",
          wait: "bench",
          say: "On our 3D Conversion Bench, toggle between Ammeter Mode and Voltmeter Mode, adjust coil ratings and desired ranges, and log your design."
        }
      ]
    },
    {
      title: "Make Sense",
      steps: [
        {
          target: "#concepts",
          cue: "Shunt & multiplier derivations",
          say: "Remember: parallel p.d. equality gives the shunt formula, while series voltage division gives the multiplier formula. Never confuse added R m with total resistance!"
        }
      ]
    },
    {
      title: "Concept Zoom",
      steps: [
        {
          target: "#zoom-stage",
          action: "zoom:shunt",
          cue: "Inside the meter coil",
          say: "Look inside the moving coil! In shunt mode, almost all the current speeds along the bottom copper highway so the delicate coil never overheats."
        }
      ]
    },
    {
      title: "Worked Examples",
      steps: [
        {
          target: "#examples",
          cue: "Step-by-step solutions",
          say: "Study these step-by-step worked examples covering 5-amp ammeter conversion, 15-volt voltmeter conversion, and range multiplying factors."
        }
      ]
    },
    {
      title: "The Big Idea",
      steps: [
        {
          target: "#vinegar-test",
          cue: "The Multiplier Trap",
          wait: "bridge",
          say: "Solve the classic WAEC multiplier trap: find the added series multiplier R m for a 5.0-ohm, 50-milliampere meter to read up to 10.0 volts!"
        }
      ]
    },
    {
      title: "Quiz",
      steps: [
        {
          target: "#quiz-list",
          cue: "12-Question Checkpoint",
          wait: "quiz",
          say: "Complete the 12-question exam checkpoint, rate your confidence, and unlock the written assignment marking scheme!"
        }
      ]
    }
  ]
};
