/* Lesson 04 · Choreographed StudyNarrator script (en-NG): The Cell and Its Environment. 28 steps. */
window.NARRATION = {
  rate: 0.96,
  pitch: 1.01,

  waits: {
    note: {
      event: "kit:note",
      prompt: "Pin a prediction to the Wonder Wall (or tap a seed idea)",
      react: function () { return "Pinned! Hold on to that prediction. We are about to test it with a real potato."; }
    },
    sort: {
      event: "l4:sort",
      prompt: "Sort all nine cards, then tap Check my sorting",
      react: function (d) {
        if (!d) return "Good effort. You can come back to the sort any time.";
        if (d.correct === d.total) return "Nine out of nine! You separated diffusion, osmosis and active transport perfectly.";
        if (d.correct >= 7) return "Nice. " + d.correct + " out of " + d.total + ". Read the notes for the ones that slipped: they are classic exam traps.";
        return "You got " + d.correct + " out of " + d.total + ". Read the notes below the bins. Ask yourself: is it only water, and does it go against the gradient?";
      }
    },
    bench: {
      event: "l4:bench-done",
      timeout: 600000,
      prompt: "Weigh all six strips, leave them for 30 minutes, then re-weigh each one",
      already: function () {
        var b = window.StudyScenes && window.StudyScenes.bench, r = b && b.reading && b.reading();
        return r && r.nDone === 6 ? r : null;
      },
      react: function () { return "Excellent! All six strips are re-weighed. Now we turn those masses into percentages and a curve."; }
    },
    bridge: {
      event: "l4:bridge",
      prompt: "Decide which way water moves in all three cases",
      react: function (d) {
        if (d && d.correct === d.total) return "All three right the first time! Salty water pulls water out of ugu, plain water floods red cells, and saline keeps them safe.";
        return "Mystery solved. The ugu wilted because water left its cells, and a plain water drip would burst red cells. Saline is isotonic, so it is safe.";
      }
    },
    quiz: {
      event: "kit:quiz-done",
      prompt: "Answer all the quiz questions",
      react: function (d) {
        if (!d) return "Quiz complete!";
        if (d.score >= 10) return "Outstanding. " + d.score + " out of " + d.total + "! You really understand how water moves.";
        if (d.score >= 7) return "Well done. " + d.score + " out of " + d.total + ". Read the explanations for the ones you missed.";
        return "You scored " + d.score + " out of " + d.total + ". Revisit the practical and the zoom, then try again.";
      }
    }
  },

  actions: {
    story: function (arg) { var s = window.StudyScenes && window.StudyScenes.story; if (s && s.beat) s.beat(parseInt(arg, 10)); },
    bench: function (arg) {
      var b = window.StudyScenes && window.StudyScenes.bench; if (!b) return;
      var p = String(arg).split(":"), fn = b[p[0]];
      if (typeof fn === "function") fn.apply(b, p.slice(1));
    },
    zoom: function (arg) {
      var z = window.StudyScenes && window.StudyScenes.zoom; if (!z) return;
      var p = String(arg).split(":");
      if (p[0] === "mode" && z.setMode) z.setMode(p[1]);
    },
    method: function (arg) { if (window.L04 && window.L04.method) window.L04.method(parseInt(arg, 10)); },
    pin: function (arg) { if (window.L04 && window.L04.showPin) window.L04.showPin(parseInt(arg, 10)); },
    open: function (arg) { var d = document.querySelector(arg); if (d && d.tagName === "DETAILS") d.open = true; }
  },

  script: [
    {
      title: "Welcome",
      steps: [
        {
          target: ".l-hero .question",
          cue: "Our guiding question",
          sparkle: true,
          say: "Welcome to Lesson 4 of Plant and Animal Cells. Today we find out why salty water wilts ugu, and why a drip must be nought point nine percent saline, not plain water. By the end you will have measured it yourself, with a potato."
        }
      ]
    },
    {
      title: "Do Now",
      steps: [
        {
          target: "#donow-list",
          cue: "Wake up what you know",
          say: "Start with four quick questions from earlier lessons. Selectively permeable membranes, the tonoplast, surface area to volume ratio, and the cell wall. Answer in your head first."
        },
        {
          target: "#donow-list",
          wait: "donow",
          say: "Your turn. Reveal each answer and mark yourself honestly."
        }
      ]
    },
    {
      title: "The Story",
      steps: [
        {
          target: { scene: "story", part: "ngozi" },
          action: "story:0",
          cue: "Limp ugu at Mile 12",
          say: "Mile 12 Market, Lagos. Mama Ngozi's nephew washed her ugu in salty water, against flies. One hour later, the leaves are limp. What happened?"
        },
        {
          target: { scene: "story", part: "cust2" },
          action: "story:1",
          cue: "Coach Danjuma's theory",
          say: "Coach Danjuma says the salt soaked into the leaves and made them heavy. Hold that idea. We will test it."
        },
        {
          target: { scene: "story", part: "amaka" },
          action: "story:2",
          cue: "The drip at LUTH",
          say: "Now the LUTH lab. Doctor Amaka sets up a drip for a dehydrated patient. She puts the plain water aside and reaches for the nought point nine percent saline."
        },
        {
          target: { scene: "story", part: "cust1" },
          action: "story:3",
          cue: "Why not plain water?",
          say: "Chinedu asks the obvious question: the patient is thirsty, so why not just use water?"
        },
        {
          target: { scene: "story", part: "amaka" },
          action: "story:4",
          cue: "Water always moves",
          say: "Doctor Amaka answers: water always moves. Today you will measure which way it goes, with a potato."
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
          say: "If you put potato strips in pure water and in very salty water, what will happen to their mass? Pin your prediction to the Wonder Wall."
        }
      ]
    },
    {
      title: "Which kind of movement?",
      steps: [
        {
          target: "#kitchen-sort",
          cue: "Diffusion, osmosis, active",
          wait: "sort",
          say: "Activity A. Sort nine cards into diffusion, osmosis and active transport. Two questions help: is it only water moving, and is it moving against the gradient?"
        }
      ]
    },
    {
      title: "Potato practical",
      steps: [
        {
          target: "#method-cards",
          action: "method:1",
          cue: "Four steps",
          say: "Now the potato practical. Four steps. One, cut six equal strips with a cork borer, blot, and weigh each one. Two, leave one strip in each tube for thirty minutes. Three, remove, blot gently, and re-weigh. Four, calculate the percentage change in mass and plot it."
        },
        {
          target: { scene: "bench", part: "balance" },
          cue: "Zero, then weigh",
          say: "This is the top-pan balance. Zero it before every weighing, and read to two decimal places. Notice the blotting paper and the tile beside it, because they matter later."
        },
        {
          target: { scene: "bench", part: "rack" },
          action: "bench:weigh:0",
          cue: "Tube 1 · pure water",
          say: "Watch tube one, pure water. The strip is blotted, weighed, and set down. About two point five grams. The six tubes run from zero to one mole per decimetre cubed of sucrose."
        },
        {
          target: "#bench-stage",
          cue: "Your turn on the bench",
          wait: "bench",
          say: "Your turn. Weigh the other strips, leave them for thirty minutes, then re-weigh all six. Tap Weigh, then Leave, then Re-weigh. Or let the bench run all six for you, and watch closely."
        },
        {
          target: "#graph-card",
          action: "open:#expected",
          cue: "A smooth curve",
          say: "Look at your graph. The dots fall along a curve, so we draw a smooth curve of best fit, never a straight line. It crosses the zero percent line at about nought point three four moles per decimetre cubed. That is the isotonic point."
        },
        {
          target: "#err-panel",
          cue: "Sources of error",
          say: "What can go wrong? Surface water left on the strip makes the final mass too high. Blotting too hard, or leaving the strip on the tile, makes it too low. Try each technique on the bench, and watch the curve move."
        }
      ]
    },
    {
      title: "Movement break",
      steps: [
        {
          target: "#movement-break",
          cue: "Be a red blood cell",
          sparkle: true,
          say: "Time to move! Stand up. You are a red blood cell. Puff up and clap for pure water. Shrink in tight for salty water. Calm circle for saline. Five minutes, then sit down ready."
        }
      ]
    },
    {
      title: "Make sense",
      steps: [
        {
          target: "#defs",
          cue: "Three movements",
          say: "Three definitions. Diffusion is the spreading of particles from crowded to few, until they are even. Osmosis is the movement of water only, across a selectively permeable membrane, from dilute to concentrated. Active transport is pumping against the gradient, and it costs energy from respiration."
        },
        {
          target: ["#props-table", "#eq-pct"],
          cue: "Three solutions, one formula",
          sparkle: true,
          say: "Hypotonic is more dilute than the cell sap, so a plant cell goes turgid and a red cell bursts. Isotonic is the same, so nothing changes. Hypertonic is more concentrated, so a plant cell is plasmolysed and a red cell crenates. And the percentage change in mass is the final mass minus the initial mass, over the initial mass, times one hundred."
        },
        {
          target: "#pos-explorer",
          action: "pin:3",
          cue: "Tap a concentration",
          say: "Tap along the explorer. At zero point six moles, the strip is limp, the ugu cell is plasmolysed, and the red cell is crenated. Try pure water too, and see the red cell burst."
        }
      ]
    },
    {
      title: "3D cell zoom",
      steps: [
        {
          target: { scene: "zoom", part: "rbc" },
          action: "zoom:mode:hypo",
          cue: "Pure water: hypotonic",
          say: "Zoom in. Pure water. Water molecules rush in. The ugu cell swells until its wall pushes back, so it is turgid. The red cell has no wall, so it swells and bursts."
        },
        {
          target: { scene: "zoom", part: "plant" },
          action: "zoom:mode:hyper",
          cue: "Salty water: hypertonic",
          say: "Salty water. Water leaves by osmosis. The membrane pulls away from the wall, and that is plasmolysis. The salt did not soak in. The leaf lost water, and the red cell shrinks and wrinkles."
        },
        {
          target: { scene: "zoom", part: "pump" },
          action: "zoom:mode:active",
          cue: "Active transport",
          say: "Now the membrane. Diffusion and osmosis are passive: they follow the gradient, with no energy. Active transport is different. This pump moves ions from the scarce side to the plentiful side, so the cell pays with ATP. Switch between the three modes and watch the counts."
        }
      ]
    },
    {
      title: "Worked examples",
      steps: [
        {
          target: "#ex1",
          cue: "Percentage change",
          say: "Worked examples. First find the change, final minus initial. Then divide by the initial mass, and multiply by one hundred. Zero point three five over two point five, times one hundred, is plus fourteen percent. In example three, the line crosses zero between plus four point eight and minus two point zero, which puts the isotonic point at about zero point three four."
        }
      ]
    },
    {
      title: "Explainer video",
      steps: [
        {
          target: ["#lesson-video"],
          cue: "Watch the video",
          say: "Before the final challenge, press play on the short explainer video at the start of the Make Sense section. It shows water crossing the membrane step by step."
        }
      ]
    },
    {
      title: "The mystery, solved",
      steps: [
        {
          target: "#mystery-box",
          cue: "Solve the mystery",
          wait: "bridge",
          say: "Back to Mile 12 and the LUTH lab. For each case, decide which way water moves. Salty bowl, plain water drip, and saline drip."
        }
      ]
    },
    {
      title: "Quiz and reflect",
      steps: [
        {
          target: "#quiz",
          cue: "WAEC, NECO and JAMB",
          wait: "quiz",
          say: "Test yourself on these exam-style questions. Watch for the common traps: dividing by the final mass instead of the initial mass, and calling a red cell plasmolysed."
        },
        {
          target: "#reflect",
          cue: "Rate yourself, then the assignment",
          say: "Finally, rate your confidence from one to four, try the exit ticket, and then do Part A and Part B of the assignment at home. Well done today."
        }
      ]
    }
  ]
};
