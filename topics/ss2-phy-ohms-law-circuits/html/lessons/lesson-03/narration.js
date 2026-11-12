/* Lesson 03 · StudyNarrator choreography: Series & Parallel Networks, Cell Arrays, Power & Efficiency (en-NG). 28 steps. */
window.NARRATION = {
  rate: 0.96,
  pitch: 1.01,

  waits: {
    donow: {
      event: "kit:donow", timeout: 120000,
      prompt: "Answer the four Do Now cards, then mark yourself",
      react: function () { return "Good. Now let us meet Emeka and his three backup cells."; }
    },
    note: {
      event: "kit:note", timeout: 120000,
      prompt: "Pin your prediction about which cell arrangement delivers the most power",
      react: function () { return "Pinned. Let us sort what belongs to series and what belongs to parallel."; }
    },
    sort: {
      event: "l3:sort", timeout: 180000,
      prompt: "Drag all ten cards into Series, Parallel or Either, then tap Check",
      react: function (d) {
        if (!d || d.total == null) return "No problem, you can try the sort again later.";
        if (d.correct === d.total) return "Perfect! Ten out of ten.";
        return "You got " + d.correct + " out of " + d.total + ". Read the notes below, then let us measure on the bench.";
      }
    },
    bench: {
      event: "l3:bench-done", timeout: 300000,
      prompt: "Your turn! Record four loads with the single cell, then measure the series and the parallel array",
      react: function () { return "Well done. The output power peaked at R equal to r, and the parallel array beat series for the low resistance pump."; }
    },
    pin: {
      event: "l3:pin", timeout: 120000,
      prompt: "Your turn! Tap the load pins and watch the current, the power and the efficiency change",
      filter: function (d) { return d && Math.abs(d.R - 0.5) < 1e-6; },
      react: function () { return "At R equal to r, the output power is greatest, yet the efficiency is only fifty per cent."; }
    },
    bridge: {
      event: "l3:bridge", timeout: 180000,
      prompt: "Your turn! Advise Emeka: series or parallel, and when parallel wins, then give your verdict",
      react: function (d) {
        return d && d.correct
          ? "Case closed! For his low resistance pump, parallel delivers more current, because the pump's R is less than one cell's r."
          : "Not quite. For a low resistance load the internal resistance decides it. Parallel gives r over n, so it wins when R is less than r.";
      }
    },
    quiz: {
      event: "kit:quiz-done", timeout: 600000,
      prompt: "Answer the quiz questions, or press Next to skip",
      react: function (d) {
        if (!d) return "Quiz complete!";
        if (d.score >= d.total - 2) return "Excellent, " + d.score + " out of " + d.total + "!";
        return "You scored " + d.score + " out of " + d.total + ". Read the explanations on the ones you missed.";
      }
    }
  },

  actions: {
    story: function (arg) { if (window.StudyScenes && StudyScenes.story) StudyScenes.story.beat(+arg); },
    open: function (arg) { var el = document.querySelector(arg); if (el && el.tagName === "DETAILS") el.open = true; },
    bench: function (arg) {
      var b = window.StudyScenes && StudyScenes.bench; if (!b) return;
      var p = String(arg).split(":");
      if (p[0] === "reset") b.reset();
      else if (p[0] === "arr") b.setMode(p[1]);
      else if (p[0] === "load") b.setLoad(+p[1]);
      else if (p[0] === "hl") b.highlight(p[1] || null);
    },
    zoom: function (arg) {
      var z = window.StudyScenes && StudyScenes.zoom; if (!z) return;
      var p = String(arg).split(":");
      if (p[0] === "mode") z.setMode();
      else if (p[0] === "ratio") z.ratio(p[1]);
      else if (p[0] === "reset") z.reset();
      else if (p[0] === "hl") z.highlight(p[1] || null);
    },
    graph: function (arg) { var b = document.querySelector('#graph-mode [data-g="' + arg + '"]'); if (b) b.click(); },
    pin: function (arg) { if (window.L03 && L03.showPin) L03.showPin(+arg, true); }
  },

  script: [
    {
      title: "Welcome",
      steps: [
        { target: ".l-hero .display", cue: "Lesson 3 · Networks, Cells, Power & Efficiency", sparkle: true,
          say: "Welcome to Lesson 3 of the current electricity unit. Today we combine resistors and cells, and work out electrical power and efficiency." },
        { target: ".l-hero .question", cue: "Our guiding question",
          say: "Here is our question. Series or parallel for the shop's backup cells, and why does a worn battery run hot? Let us find out." }
      ]
    },
    {
      title: "Do Now",
      steps: [
        { target: "#donow-list", cue: "Your turn", wait: "donow",
          say: "Start with four quick Do Now cards from Lessons 1 and 2. Answer each in your head, reveal it, and mark yourself. I will carry on when you are done." }
      ]
    },
    {
      title: "The Story",
      steps: [
        { target: { scene: "story", part: "emeka" }, action: "story:0", cue: "Emeka's backup cells",
          say: "At Nkechi Auto-Electric on Ngwa Road, Emeka has three cells for a backup pump. Should he join them in a line, or side by side?" },
        { target: { scene: "story", part: "tobe" }, action: "story:1", cue: "Tobe's guess",
          say: "Tobe is sure. Side by side gives more voltage, he says. Chinedu is not so sure, and he is right to doubt it." },
        { target: { scene: "story", part: "nkechi" }, action: "story:2", cue: "Nkechi weighs it",
          say: "Nkechi explains. A low resistance pump pulls a big current. Series gives more voltage but more internal resistance; parallel keeps the voltage but shares the current and lowers r." },
        { target: { scene: "story", part: "chinedu" }, action: "story:3", cue: "The hot battery",
          say: "Chinedu touches the old battery. It is hot. Why does it warm up so much?" },
        { target: { scene: "story", part: "nkechi" }, action: "story:4", cue: "To the bench",
          say: "Because I squared r is burned inside it, says Nkechi. Let us measure which arrangement wastes least and runs coolest." }
      ]
    },
    {
      title: "Wonder Wall",
      steps: [
        { target: "#wall-wonder", cue: "Pin your idea", wait: "note",
          say: "Pin your prediction. For a pump that needs a big current, which cell arrangement delivers the most useful power?" }
      ]
    },
    {
      title: "Sort Game",
      steps: [
        { target: "#net-sort", cue: "Series or parallel?",
          say: "First, sort ten statements. Some belong to series, some to parallel, and some are true of any circuit." },
        { target: "#net-sort", cue: "Your turn", wait: "sort",
          say: "Your turn. Drag each card into Series, Parallel, or Either, then tap Check." }
      ]
    },
    {
      title: "Virtual Lab",
      steps: [
        { target: "#method-cards", action: "bench:reset", cue: "Four method cards",
          say: "Now the cell-array bench. Follow the four cards: build the circuit, read the current and power, switch the cells between series and parallel, then vary the load to plot the curves." },
        { target: { scene: "bench", part: "node" }, action: "bench:load:0.5", cue: "The single cell at R = r",
          say: "Watch the single cell, five volts with half an ohm of internal resistance. At a load of half an ohm, the output power is at its greatest, twelve point five watts." },
        { target: { scene: "bench", part: "cellA" }, action: "bench:arr:parallel", cue: "Three cells in parallel",
          say: "Now the three backup cells in parallel. Same voltage, but the internal resistance drops to r over n, so the pump gets a bigger current." },
        { target: { scene: "bench", part: "cellA" }, action: "bench:arr:series", cue: "Three cells in series",
          say: "In series the voltage triples, but so does the internal resistance. For this low resistance pump, that is the losing choice." },
        { target: "#bench-stage", cue: "Your turn", wait: "bench",
          say: "Your turn. Record four different loads with the single cell, then measure both the series and the parallel array. I will carry on when the table is full." },
        { target: "#graph-card", action: "graph:power", cue: "The power curve",
          say: "Look at the graph. Load power is a smooth curve, not a straight line. It climbs to a single peak where R equals r, then falls." },
        { target: "#graph-card", action: "graph:eff", cue: "The efficiency curve",
          say: "Switch to efficiency. It is another smooth curve, climbing towards one hundred per cent. At the power peak it is only fifty per cent, so maximum power is not maximum efficiency." },
        { target: "#expected", action: "open:#expected", cue: "Expected results",
          say: "Compare with the expected table, then try the five locked analysis questions before you reveal the answers." }
      ]
    },
    {
      title: "Make Sense",
      steps: [
        { target: "#movement-break", cue: "Movement break",
          say: "Time for the forty-five minute movement break. Stand up and shake out your arms for a minute, then sit down refreshed." },
        { target: "#concepts h2", cue: "Series and parallel rules",
          say: "Let us make sense of it. In series the current is the same everywhere and the p.d.s add. In parallel the branches share one p.d., the currents add, and the total resistance is less than any single branch." },
        { target: "#cell-arrays", cue: "Cell arrays",
          say: "For n identical cells: in series you get n E and n r; in parallel you get the same E but r over n. Parallel is better for a low resistance load, because it lowers the internal resistance." },
        { target: "#kwh", cue: "The kilowatt-hour",
          say: "One unit on a prepaid meter is one kilowatt-hour, a unit of energy, not power. A seven hundred and fifty watt freezer for eight hours uses six units, which is six times three point six mega-joules." },
        { target: "#pos-explorer", action: "pin:1", cue: "Load explorer", wait: "pin",
          say: "Your turn. Tap the load pins and watch the current, the power and the efficiency change. Notice the power peak at R equal to r." }
      ]
    },
    {
      title: "Zoom",
      steps: [
        { target: "#zoom-stage", action: "zoom:mode:node", cue: "Current splits at the node",
          say: "Zoom in on a parallel junction. The charge beads split between the branches, more of them taking the smaller resistance, and they rejoin at the far node." },
        { target: "#zoom-stage", action: "zoom:ratio:equal", cue: "The power partition",
          say: "The power bar shows total power E I splitting into useful I squared R in the load and wasted I squared r inside the cell. Make the branches equal and the current splits fifty fifty." }
      ]
    },
    {
      title: "Worked Examples",
      steps: [
        { target: ["#ex1", "#ex2", "#ex3"], action: "zoom:reset", cue: "Three worked examples",
          say: "Three worked examples. Collapsing a mixed network, comparing cell arrays, and working out power and efficiency. Try each on paper, then check the steps." }
      ]
    },
    {
      title: "Solving the Mystery",
      steps: [
        { target: "#bridge-card", cue: "Advise Emeka", wait: "bridge",
          say: "Now advise Emeka. Choose series or parallel for his pump, and say when parallel wins, then give your verdict." }
      ]
    },
    {
      title: "Quiz & Reflection",
      steps: [
        { target: "#quiz-list", cue: "Quiz time", wait: "quiz",
          say: "Now the quiz. Twelve questions in exam style, plus two review questions." },
        { target: "#reflect", cue: "Reflect and assignment",
          say: "To finish, rate yourself from one to four on each goal, do the exit ticket and the blank page recall. Your assignment is Part A and Part B from the questions for Lesson 3. Well done today." }
      ]
    }
  ]
};
