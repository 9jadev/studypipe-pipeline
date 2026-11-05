/* Lesson 03 · Choreographed StudyNarrator Script — Series & Parallel Networks, Cell Arrays, Power & Efficiency (en-NG) */
window.NARRATION = {
  rate: 0.96,
  pitch: 1.01,

  waits: {
    note: {
      event: "kit:note",
      prompt: "Pin your question or prediction to the Wonder Wall",
      react: function () {
        return "Pinned! Let's explore how parallel paths divide current on the 3D bench.";
      }
    },
    sort: {
      event: "sort:checked",
      prompt: "Sort all 10 cards into Series, Parallel, and Power & Efficiency, then tap Check my sorting",
      react: function (d) {
        if (!d) return "Good sorting effort!";
        if (d.right === d.total) return "Ten out of ten! You have completely separated series current, parallel voltage, and cell efficiency.";
        return "You scored " + d.right + " out of " + d.total + ". Review the cards in red — in series current is identical, while in parallel voltage is identical!";
      }
    },
    bench: {
      event: "bench:record",
      prompt: "Adjust topology or cells and log at least 1 reading on the 3D bench",
      react: function () {
        return "Logged! Notice how connecting cells in parallel slashes internal resistance so more power reaches the load.";
      }
    },
    bridge: {
      event: "vinegar:pick",
      prompt: "Pick the correct load current for 4 parallel cells",
      react: function (d) {
        if (d && d.ok) return "Spot on! 0.375 A — because E_eq stays 1.5 V and r_eq drops to 0.5 Ω!";
        return "Careful with parallel cells: E_eq stays 1.5 V while r_eq divides by 4!";
      }
    },
    quiz: {
      event: "kit:quiz-done",
      prompt: "Answer all 12 WAEC/NECO/JAMB quiz questions",
      react: function (d) {
        if (!d) return "Quiz finished!";
        if (d.score >= 10) return "Outstanding — " + d.score + " out of " + d.total + "! You are fully prepared for series/parallel exam questions.";
        return "You got " + d.score + " out of " + d.total + ". Review the detailed step-by-step solutions below.";
      }
    }
  },

  actions: {
    "story:0": function () { var b = document.querySelector('#story [data-beat="0"]'); if (b) b.click(); },
    "story:1": function () { var b = document.querySelector('#story [data-beat="1"]'); if (b) b.click(); },
    "story:2": function () { var b = document.querySelector('#story [data-beat="2"]'); if (b) b.click(); },
    "bench:parallel": function () { if (window.StudyScenes && window.StudyScenes.bench) window.StudyScenes.bench.setConfig({ topology: "parallel", cellArray: "parallel3" }); },
    "bench:series": function () { if (window.StudyScenes && window.StudyScenes.bench) window.StudyScenes.bench.setConfig({ topology: "series", cellArray: "series3" }); },
    "zoom:split": function () { if (window.StudyScenes && window.StudyScenes.zoom) window.StudyScenes.zoom.setMode("parallel-4-12"); }
  },

  script: [
    {
      title: "Welcome",
      steps: [
        {
          target: ".l-hero .display",
          cue: "Lesson 3 · Networks & Cell Arrays",
          sparkle: true,
          say: "Welcome to Lesson 3! Today we are investigating Series and Parallel Resistor Networks, Current Division, Identical Cells in Series versus Parallel, and Circuit Efficiency."
        },
        {
          target: "#objectives",
          cue: "5 goals for Lesson 3",
          say: "You will calculate equivalent resistance, apply the inverse current-divider rule, master the parallel-cells exam trap, and compute power and efficiency."
        }
      ]
    },
    {
      title: "Do Now",
      steps: [
        {
          target: "#donow-list",
          cue: "Retrieve Lessons 1 & 2",
          say: "Warm up with these four retrieval flashcards on terminal p.d., lost volts, V-against-I slopes, and wire diameter scaling."
        }
      ]
    },
    {
      title: "The Story",
      steps: [
        {
          target: "#story-stage",
          action: "story:0",
          cue: "Tunde's Solar Workshop, Surulere",
          say: "In Surulere, solar technician Tunde connects three 2-volt cells in series to spin a heavy pump. Total E M F reaches 6 volts, but internal resistance triples to 4.5 ohms, choking the current!"
        },
        {
          target: "#story-stage",
          action: "story:1",
          cue: "Damilola wires cells in parallel",
          say: "Apprentice Damilola rewires the same three cells in parallel! E M F stays at 2 volts, but internal resistance drops three-fold to 0.5 ohms, doubling current into the pump!"
        },
        {
          target: "#story-stage",
          action: "story:2",
          cue: "Current division & 75% efficiency",
          say: "Current divides inversely with resistance across parallel branches, and slashing internal resistance boosts circuit efficiency from 25 percent to 75 percent!"
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
          say: "Pin your prediction or question: why does the branch with lower resistance carry the larger current?"
        }
      ]
    },
    {
      title: "Concept Sort",
      steps: [
        {
          target: "#kitchen-sort",
          cue: "Sort circuit rules",
          wait: "sort",
          say: "Classify all 10 cards into Series Network, Parallel Network, or Power and Efficiency, then tap Check my sorting."
        }
      ]
    },
    {
      title: "3D Practical",
      steps: [
        {
          target: "#bench-stage",
          action: "bench:parallel",
          cue: "3D Network & Cell Array Bench",
          wait: "bench",
          say: "Explore the 3D bench! Compare 3 cells in series versus 3 cells in parallel, change branch resistances, and log a reading."
        }
      ]
    },
    {
      title: "Make Sense",
      steps: [
        {
          target: "#concepts",
          cue: "Core equations",
          say: "Review the four essential formulas: product-over-sum for two parallel resistors, the inverse current-divider ratio, parallel cell arrays, and cell efficiency."
        }
      ]
    },
    {
      title: "Concept Zoom",
      steps: [
        {
          target: "#zoom-stage",
          action: "zoom:split",
          cue: "Inside the parallel junction",
          say: "Zoom into the parallel Y-junction! Three times as many electrons take the low-resistance 4-ohm path as the 12-ohm path, while the green pillar shows useful load power."
        }
      ]
    },
    {
      title: "Worked Examples",
      steps: [
        {
          target: "#examples",
          cue: "Step-by-step calculations",
          say: "Study these step-by-step WAEC and JAMB calculation examples covering series-parallel networks, identical cells, and power ratios."
        }
      ]
    },
    {
      title: "The Big Idea",
      steps: [
        {
          target: "#vinegar-test",
          cue: "The 4-Parallel-Cells Trap",
          wait: "bridge",
          say: "Solve the JAMB bridge challenge: four 1.5-volt, 2.0-ohm cells in parallel driving a 3.5-ohm load. Pick the correct current!"
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
          say: "Now tackle the 12 exam checkpoint questions, rate your confidence, and complete the take-home assignment!"
        }
      ]
    }
  ]
};
