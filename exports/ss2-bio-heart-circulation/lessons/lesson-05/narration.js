/* Lesson 05 · Choreographed StudyNarrator script: arteries, veins, capillaries, tissue fluid and lymph (Nigerian English, en-NG ranked first) */
window.NARRATION = {
  rate: 0.96,
  pitch: 1.01,

  waits: {
    note: {
      event: "kit:note",
      prompt: "Type a prediction (or tap a seed question) and pin it to the Wonder Wall",
      react: function () { return "Pinned! Now let us test your idea at the two benches."; }
    },
    sort: {
      event: "l5:sort",
      prompt: "Sort all eleven clues into artery, vein and capillary, then tap Check my sorting",
      react: function (d) {
        if (!d) return "Good effort!";
        if (d.correct === d.total) return "Eleven out of eleven! You sorted by direction, wall and job like a real biologist.";
        if (d.correct >= 8) return "Nice work, " + d.correct + " out of " + d.total + ". Read the reasons below for any card that slipped.";
        return "You got " + d.correct + " out of " + d.total + ". Read the reasons below. The pulmonary vein is the classic trap: a vein is named by its direction, not its oxygen.";
      }
    },
    bench: {
      event: "l5:bench-done",
      prompt: "Station 1: calibrate, measure the artery and the vein, find a capillary. Station 2: record all five probe points",
      react: function () { return "Both stations complete. The artery wall is thick, the vein lumen is wide, and the pressure drops along the capillary."; }
    },
    pin: {
      event: "l5:pin",
      prompt: "Tap any pin on the capillary probe explorer",
      react: function (d) {
        if (d && d.mode === "congest" && d.x >= 0.75) return "See that? In Mama Bisi's congested leg the venous end still pushes fluid out.";
        if (d && d.x >= 0.75) return "Good. Near the venous end the net filtration pressure is negative, so fluid returns.";
        return "Good. Near the arterial end the net filtration pressure is positive, so fluid leaves.";
      }
    },
    bridge: {
      event: "l5:bridge",
      prompt: "Answer the three steps of Mama Bisi's case",
      react: function (d) {
        if (d && d.correct === d.total) return "Case two solved, all three steps right!";
        return "Case two solved. Read the reasons again if a step surprised you.";
      }
    },
    quiz: {
      event: "kit:quiz-done",
      prompt: "Answer all twelve quiz questions",
      react: function (d) {
        if (!d) return "Quiz complete!";
        if (d.score >= 10) return "Outstanding, " + d.score + " out of " + d.total + "!";
        if (d.score >= 7) return "Well done, " + d.score + " out of " + d.total + ". Read the explanations for the ones you missed.";
        return "You scored " + d.score + " out of " + d.total + ". Go back to the benches and the capillary zoom, then retry.";
      }
    }
  },

  actions: {
    story: function (arg) { if (window.StudyScenes && window.StudyScenes.story) window.StudyScenes.story.beat(parseInt(arg, 10) || 0); },
    bench: function (arg) {
      var b = window.StudyScenes && window.StudyScenes.bench;
      if (!b) return;
      var p = String(arg).split(":");
      if (p[0] === "station") b.station(p[1]);
      else if (p[0] === "view") { b.view(); b.frame("wide"); }
      else if (p[0] === "frame") b.frame(p[1]);
      else if (p[0] === "calibrate") b.calibrate();
      else if (p[0] === "measure") {
        if (p[1] === "both") { b.measure("artery"); setTimeout(function () { b.measure("vein"); }, 1400); }
        else b.measure(p[1]);
      }
      else if (p[0] === "capillary") b.findCapillary();
      else if (p[0] === "probe") b.probe(parseFloat(p[1]));
      else if (p[0] === "record") b.record();
      else if (p[0] === "mode") b.bedMode(p[1]);
      else if (p[0] === "reset") b.reset();
    },
    zoom: function (arg) { if (window.StudyScenes && window.StudyScenes.zoom) window.StudyScenes.zoom.setMode(String(arg)); },
    pin: function (arg) { if (window.L05 && window.L05.showPin) window.L05.showPin(parseInt(arg, 10) || 0); },
    exmode: function (arg) { if (window.L05 && window.L05.setExplorerMode) window.L05.setExplorerMode(String(arg)); },
    open: function (sel) { var d = document.querySelector(sel); if (d && d.tagName === "DETAILS") d.open = true; }
  },

  script: [
    {
      title: "Welcome",
      steps: [
        {
          target: ".l-hero .display",
          cue: "Lesson 5 · Vessels, tissue fluid and lymph",
          sparkle: true,
          say: "Welcome to Lesson 5 of The Human Heart and Blood Circulation! Today we compare arteries, veins and capillaries, and we solve the second clue in our mystery: why do Mama Bisi's ankles swell after a day of standing? By the end you will compare the three vessels, calculate net filtration pressure, and compare blood, tissue fluid and lymph."
        }
      ]
    },
    {
      title: "The Story",
      steps: [
        {
          target: "#story-stage", action: "story:0", cue: "Oja Oba health-day tent",
          say: "We are at the Oja Oba health-day tent. Mama Bisi props her feet on a stool. Dr Aisha presses her thumb into the ankle, and the dent stays."
        },
        {
          target: { scene: "story", part: "ngozi" }, action: "story:1", cue: "Sandals tight by evening",
          say: "Mama Bisi says: in the morning they are fine, but by evening my sandals are tight. See the blue, knotted veins winding up her calves."
        },
        {
          target: { scene: "story", part: "cust2" }, action: "story:2", cue: "Baba Sule's advice",
          say: "Baba Sule is sure. Too much water in the blood, he says. Stop drinking water!"
        },
        {
          target: { scene: "story", part: "amaka" }, action: "story:3", cue: "A tube one cell thick",
          say: "Now in the lab, Dr Aisha zooms into a single capillary between leg muscle cells. The answer lies in a tube one cell thick, and in two pressures fighting inside it. She invites us to the vessel bench and the capillary bench."
        }
      ]
    },
    {
      title: "Wonder Wall",
      steps: [
        {
          target: "#wall-wonder", cue: "Pin your prediction", wait: "note",
          say: "Before the benches, pin your prediction. If blood stays inside vessels, where does the fluid in a swollen ankle come from?"
        }
      ]
    },
    {
      title: "Vessel Sort",
      steps: [
        {
          target: "#vessel-sort", cue: "Three bins, eleven clues", wait: "sort",
          say: "Sort all eleven clues into artery, vein or capillary. The pulmonary vein is the classic trap. Then tap Check my sorting."
        }
      ]
    },
    {
      title: "Two-Station Bench",
      steps: [
        {
          target: "#method-cards", cue: "Station 1 method cards",
          say: "Station one has four steps. View the slide at low power. Calibrate the graticule against the stage micrometre. Measure the wall and the lumen of the artery and the vein. Then find a capillary. Station two has its own four cards, for the pressure probe."
        },
        {
          target: { scene: "bench", part: "artery" }, action: "bench:view", cue: "Artery left, vein right",
          say: "Here is the prepared slide at low power. On the left, the artery, with a thick muscular wall and a narrow lumen. On the right, the vein, with a thin wall and a wide lumen."
        },
        {
          target: { scene: "bench", part: "graticule" }, action: "bench:calibrate", cue: "Calibrate first",
          say: "Always calibrate first. One millimetre on the stage micrometre covers twelve and a half graticule divisions, so one division is 0.080 millimetres. Never assume it."
        },
        {
          target: { scene: "bench", part: "tunicaMedia" }, action: "bench:measure:both", cue: "Wall and lumen of each",
          say: "Now measure across the narrowest diameter, at right angles to the wall. Artery: wall 0.90 millimetres, lumen 2.2. Vein: wall 0.40 millimetres, lumen 4.0. The artery wall is far thicker for its size."
        },
        {
          target: { scene: "bench", part: "probe" }, action: "bench:probe:0", cue: "Arterial end: NFP positive",
          say: "Station two. The probe sits at the arterial end. Blood pressure P c is 36 millimetres of mercury, and the pull of the plasma proteins is 25. N F P is positive eleven, so fluid is pushed out."
        },
        {
          target: { scene: "bench", part: "probe" }, action: "bench:probe:1", cue: "Venous end: NFP negative",
          say: "Slide the probe to the venous end. Blood pressure has fallen to 16, below the protein pull of 25. N F P is negative nine, so fluid is drawn back in."
        },
        {
          target: "#bench-stage", action: "bench:station:1", cue: "Your turn on the bench", wait: "bench",
          say: "Your turn. At station one, calibrate, measure both vessels and find the capillary. At station two, record all five probe points. Switch between stations with the buttons."
        },
        {
          target: "#graph-card", cue: "A straight line in this model", action: "open:#expected",
          say: "Your readings land on the graph. In this teaching model the pressure falls evenly, so the points lie on a straight line, and it crosses the flat protein pull at 0.55 of the way along. Check the expected results, and the errors: a slanted cut makes a wall read too high, and a collapsed vein makes its lumen read too low."
        }
      ]
    },
    {
      title: "Make Sense",
      steps: [
        {
          target: "#props-table", cue: "Nine differences",
          say: "Learn the table of differences. Arteries: thick, elastic, narrow, high pressure with a pulse. Veins: thinner, wide, low pressure, with pocket valves. Capillaries: one cell thick, slowest flow. Deoxygenated blood is dark red, and veins only look blue through the skin."
        },
        {
          target: "#tissue-fluid", cue: "Tissue fluid in four steps",
          say: "At the arterial end, blood pressure beats the protein pull, so water and small solutes leave as tissue fluid. Red cells and big proteins stay. Cells swap what they need. At the venous end the protein pull wins, so most fluid returns. The rest drains into lymph capillaries and becomes lymph."
        },
        {
          target: "#pos-explorer", action: "pin:4", cue: "Capillary probe explorer", wait: "pin",
          say: "Try the explorer. Tap a pin to read the pressures and the direction of the arrow, then switch to Mama Bisi's congested leg and compare the venous end."
        }
      ]
    },
    {
      title: "Capillary Zoom",
      steps: [
        {
          target: { scene: "zoom", part: "capillary" }, action: "zoom:normal", cue: "Normal: out, then back",
          say: "Zoom in. Normally fluid leaves at the arterial end and most of it returns at the venous end. A small surplus drains into the blind-ended lymph capillary."
        },
        {
          target: { scene: "zoom", part: "tissueFluid" }, action: "zoom:congest", cue: "Congested: fluid keeps leaving",
          say: "Now the congested leg. Venous-end pressure is 30, so N F P stays positive along the whole capillary. Fluid keeps leaving, little returns, and the tissue swells."
        },
        {
          target: { scene: "zoom", part: "lymphCapillary" }, action: "zoom:kwash", cue: "Low protein, then blocked lymph",
          say: "Low plasma protein, as in kwashiorkor, weakens the pull that brings fluid back, so the body swells. And if filarial worms block the lymph vessels, the surplus cannot drain, which causes elephantiasis."
        }
      ]
    },
    {
      title: "Worked Examples",
      steps: [
        {
          target: "#ex1", cue: "NFP at both ends",
          say: "Example one. N F P equals P c minus the protein pull. Arterial end: 36 minus 25 is positive 11, out. Venous end: 16 minus 25 is negative 9, in. It becomes zero when P c is 25, which is 11 out of a total fall of 20, so 0.55 of the way along."
        },
        {
          target: "#ex2", cue: "Why capillary blood is slow",
          say: "Example two. Flow is area times speed. The aorta gives 2.4 times 35, which is 84 cubic centimetres per second. Spread over 2400 square centimetres of capillaries, the speed is 84 divided by 2400, which is 0.035 centimetres per second, about a thousand times slower, giving time for exchange."
        }
      ]
    },
    {
      title: "The Big Idea",
      steps: [
        {
          target: "#bridge-steps", cue: "Mama Bisi's case", wait: "bridge",
          say: "Now solve case two in three steps: the venous-end pressure after standing, what a positive N F P along the whole capillary does, and whether Baba Sule is right."
        }
      ]
    },
    {
      title: "Quiz and Reflect",
      steps: [
        {
          target: "#quiz", cue: "12 exam-style questions", wait: "quiz",
          say: "Test yourself on these twelve questions. Read the explanation for every option, not only the one you picked."
        },
        {
          target: "#reflect", cue: "Rate yourself, then the assignment",
          say: "Finally, rate your confidence from one to four, write your exit ticket, and do Part A and Part B of the assignment at home. Well done on Lesson 5!"
        }
      ]
    }
  ]
};
