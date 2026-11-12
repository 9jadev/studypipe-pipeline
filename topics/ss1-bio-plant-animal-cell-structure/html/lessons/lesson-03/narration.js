/* Lesson 03 · StudyNarrator choreography (en-NG): Forms of Cells and Levels of Organisation */
window.NARRATION = {
  rate: 0.96,
  pitch: 1.01,

  waits: {
    note: {
      event: "kit:note",
      prompt: "Type a prediction (or tap a seed question) and pin it to the Wonder Wall",
      react: function () { return "Pinned! Now let us put the pond organisms in order."; }
    },
    sort: {
      event: "l3:sort",
      prompt: "Sort all nine specimens into free-living, colony or filament, and tissue level, then tap Check my sorting",
      react: function (d) {
        if (!d) return "Good effort! Check the notes under the bins.";
        if (d.correct === d.total) return "Nine out of nine! You can tell a single cell, a colony, a filament and a tissue apart.";
        if (d.correct >= 7) return "Nice work! " + d.correct + " out of " + d.total + ". Read the notes for the ones that slipped.";
        return "You got " + d.correct + " out of " + d.total + ". Read the notes: the key question is whether the cells share out the jobs.";
      }
    },
    bench: {
      event: "l3:bench-done",
      prompt: "Calculate at least four cubes on Station B",
      already: function () { var s = window.StudyScenes && window.StudyScenes.bench && window.StudyScenes.bench.state(); return s && s.cubes >= 4 ? { count: s.cubes } : null; },
      react: function () { return "Well done! Four cubes calculated. Now watch what happens to S A to V on the graph, and compare the pale centres."; }
    },
    bridge: {
      event: "l3:bridge",
      prompt: "Scale the body up, then answer the question about Dr Amaka's patient",
      filter: function (d) { return !!d.correct; },
      react: function () { return "Exactly! A big body has a small S A to V, so the cells deep inside are too far from the surface for diffusion. That is why blood must do the carrying."; }
    },
    quiz: {
      event: "kit:quiz-done",
      prompt: "Answer all the quiz questions",
      react: function (d) {
        if (!d) return "Quiz complete!";
        if (d.score >= d.total - 2) return "Outstanding! " + d.score + " out of " + d.total + ". You have mastered forms of cells and S A to V.";
        if (d.score >= Math.round(d.total * 0.6)) return "Well done! " + d.score + " out of " + d.total + ". Read the explanations for the ones you missed.";
        return "You scored " + d.score + " out of " + d.total + ". Replay the pond survey and the cube bench, then try again.";
      }
    }
  },

  actions: {
    story: function (arg) { var s = window.StudyScenes && window.StudyScenes.story; if (s) s.beat(parseInt(arg, 10) || 0); },
    open: function (arg) { var d = document.querySelector(arg); if (d && d.tagName === "DETAILS") d.open = true; },
    bench: function (arg) {
      var b = window.StudyScenes && window.StudyScenes.bench; if (!b) return;
      var p = String(arg).split(":");
      if (p[0] === "mode") b.setMode(p[1]);
      else if (p[0] === "org") b.org(p[1]);
      else if (p[0] === "pick") b.pick(+p[1]);
      else if (p[0] === "calc") b.calc(p[1] != null ? +p[1] : undefined);
    },
    zoom: function (arg) { var z = window.StudyScenes && window.StudyScenes.zoom; if (z) z.setMode(arg); },
    pin: function (arg) { if (window.L03 && window.L03.showPin) window.L03.showPin(parseInt(arg, 10) || 0); },
    ladder: function () { if (window.L03 && window.L03.ladder) window.L03.ladder.climb(); },
    scale: function (arg) { if (window.L03 && window.L03.bridgeScale) window.L03.bridgeScale(parseInt(arg, 10) || 0); }
  },

  script: [
    {
      title: "Welcome",
      steps: [
        {
          target: ".l-hero .display", cue: "Lesson 3 · Forms of cells", sparkle: true,
          say: "Welcome to Lesson 3! Today we meet the creatures in a drop of drain water, and we find out why an Amoeba can live alone while Chinedu needs a heart, lungs and blood."
        },
        {
          target: ["#objectives", "#timetable"], cue: "Five goals · 80 minutes",
          say: "By the end you will describe the forms of cells, tell a colony from a tissue, name the ways cells feed, order the six levels of organisation, and calculate surface area to volume ratio. We follow the timetable shown: Do Now, Wonder, Investigate, a movement break at forty-five minutes, Make Sense, then Apply and Reflect."
        }
      ]
    },
    {
      title: "Do Now",
      steps: [
        {
          target: "#donow-list", cue: "Wake up your toolkit", sparkle: true,
          say: "Start with four quick questions from Lessons 1 and 2: the contractile vacuole, plant-only structures, respiration, and a magnification sum. Answer in your head before you flip each card."
        },
        {
          target: "#donow-list", wait: "donow",
          say: "Your turn. Reveal and mark each card. I will carry on when all four are marked."
        }
      ]
    },
    {
      title: "The Story",
      steps: [
        {
          target: { scene: "story", part: "cust1" }, action: "story:0", cue: "Mile 12 Market",
          say: "At Mile 12 Market in Lagos, Chinedu has scooped green water from the drain beside the stalls into a jar."
        },
        {
          target: { scene: "story", part: "cust2" }, action: "story:1", cue: "Coach Danjuma",
          say: "Coach Danjuma frowns. He says nothing can live in that, it is just dirty water."
        },
        {
          target: { scene: "story", part: "dish" }, action: "story:2", cue: "Under the microscope",
          say: "But in Dr Amaka's lab, one drop shows a blob that keeps changing shape, a slipper covered in hairs, a green spindle with a whip, and a hollow green ball."
        },
        {
          target: { scene: "story", part: "amaka" }, action: "story:3", cue: "The puzzle",
          say: "Dr Amaka says each of these is a whole living thing. Yet Chinedu is billions of cells working together. Why the difference?"
        },
        {
          target: { scene: "story", part: "amaka" }, action: "story:4", cue: "Pond survey and cubes",
          say: "She invites us to survey the pond, and then to cut agar cubes and let the numbers answer the puzzle."
        }
      ]
    },
    {
      title: "Wonder Wall",
      steps: [
        {
          target: "#wall-wonder", cue: "Pin your prediction", wait: "note",
          say: "Before we investigate, pin your prediction. Is a single cell that lives on its own simpler, or smarter, than your whole body?"
        }
      ]
    },
    {
      title: "Sort",
      steps: [
        {
          target: "#form-sort", cue: "How does it live?", wait: "sort",
          say: "Activity one. Sort the nine specimens into free-living, colony or filament, and tissue level. Ask yourself: do the cells share out the jobs? Then tap Check my sorting."
        }
      ]
    },
    {
      title: "3D Practical",
      steps: [
        {
          target: "#method-cards", cue: "Four method cards",
          say: "Now the practical, with two stations. Method card one: survey the pond. Cards two and three: choose a cube, press Calculate and record the numbers. Card four: compare the undyed centres."
        },
        {
          target: { scene: "bench", part: "volvox" }, action: "bench:org:volvox", cue: "Station A · Volvox", sparkle: true,
          say: "Station A is the pond. Here is Volvox, a hollow ball of similar green cells. Tap each of the seven organisms in turn, and especially compare Volvox with Hydra, whose cells have different jobs."
        },
        {
          target: { scene: "bench", part: "core" }, action: "bench:calc:6", cue: "Station B · 6 mm cube",
          say: "Station B is the cube bench. I will calculate the six millimetre cube. The surface area is six times six squared, the volume is six cubed, and watch the dye soak in. The middle stays pale, because it is far from every face."
        },
        {
          target: "#bench-stage", cue: "Your turn on the bench!", wait: "bench",
          say: "Now it is your turn. Pick a side, press Calculate, and do at least four cubes."
        },
        {
          target: ["#graph-card", "#results-table"], cue: "Table and graph",
          say: "Record each cube in the results table. On the graph, the dots fall on a smooth curve, not a straight line. Every time the side doubles, S A to V halves. The smallest cubes are fully dyed, but the big cube keeps a pale centre."
        }
      ]
    },
    {
      title: "Make Sense",
      steps: [
        {
          target: "#props-table", cue: "Seven forms", sparkle: true,
          say: "Let us make sense of the survey. Amoeba, Paramecium, Euglena and Chlamydomonas live alone. Volvox is a colony, Spirogyra is a filament, and Hydra is at the tissue level. Amoeba and Paramecium are holozoic, Chlamydomonas, Volvox and Spirogyra are autotrophic, and Euglena is autotrophic in light but saprophytic in darkness."
        },
        {
          target: "#colony-vs-tissue", cue: "Colony or tissue?",
          say: "What separates a colony from a tissue is the sharing of jobs. Volvox cells are copies of one another and each can live by itself. Hydra cells have different jobs and cannot live apart."
        },
        {
          target: "#eq-levels", cue: "Six levels",
          say: "The levels run from organelle to cell, to tissue, to organ, to system, and finally to the organism."
        },
        {
          target: "#eq-sav", cue: "Six over L", sparkle: true,
          say: "And the key formula: surface area over volume equals six L squared over L cubed, which simplifies to six over L. As L grows, the ratio falls."
        },
        {
          target: "#pos-explorer", action: "pin:5", cue: "Cube explorer",
          say: "In the explorer, tap the cube sides. At six millimetres the ratio is only one, and nearly a third of the volume stays undyed."
        }
      ]
    },
    {
      title: "3D Zoom",
      steps: [
        {
          target: { scene: "zoom", part: "volvox" }, action: "zoom:colony", cue: "Volvox beside Hydra",
          say: "In the zoom, Volvox sits beside Hydra. Volvox cells are alike, so it is a colony. Hydra has two layers of cells doing different jobs, so it is at the tissue level."
        },
        {
          target: "#level-ladder", action: "zoom:ladder", cue: "Climb the ladder",
          say: "Now climb the ladder: organelle, cell, tissue, organ, system and organism. Each step is built from the one below."
        }
      ]
    },
    {
      title: "Worked Examples",
      steps: [
        {
          target: "#examples", cue: "Three examples",
          say: "In the worked examples, the two millimetre cube gives three point zero. Comparing the one and six millimetre cubes shows the small cube has six times more surface for each cubic millimetre. And an Amoeba modelled as a cube has an S A to V three hundred times larger than a small frog's."
        }
      ]
    },
    {
      title: "Explainer Video",
      steps: [
        {
          target: ["#lesson-video", "#concepts h2"], cue: "Explainer video",
          say: "At the start of Make Sense there is a short explainer video that shows colony, tissue and the level ladder in motion. Watch it any time you want a second look."
        }
      ]
    },
    {
      title: "The Big Idea",
      steps: [
        {
          target: "#bridge-test", action: "scale:3", cue: "Why does the patient need blood?", wait: "bridge",
          say: "Back to the lab. Scale the body up from an Amoeba to a small frog and watch S A to V fall. Then explain why Dr Amaka's patient needs blood to deliver water at all."
        }
      ]
    },
    {
      title: "Quiz",
      steps: [
        {
          target: "#quiz-list", cue: "Twelve questions", wait: "quiz",
          say: "Now the quiz, in WAEC, NECO and JAMB style. Pick an option for instant feedback and read every explanation."
        }
      ]
    },
    {
      title: "Reflect and Assignment",
      steps: [
        {
          target: ["#rate-list", "#assignment"], cue: "Rate yourself 1 to 4",
          say: "Rate yourself from one to four on each goal, and try the exit ticket: the S A to V of a five millimetre cube. For your assignment, do Part A and Part B from the questions file for Lesson 3. Well done today!"
        }
      ]
    }
  ]
};
