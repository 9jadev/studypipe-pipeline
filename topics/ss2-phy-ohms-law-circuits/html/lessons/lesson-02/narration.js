/* Lesson 02 · StudyNarrator choreography: EMF, Terminal P.D. & Internal Resistance (en-NG). 27 steps. */
window.NARRATION = {
  rate: 0.96,
  pitch: 1.01,

  waits: {
    donow: {
      event: "kit:donow", timeout: 120000,
      prompt: "Your turn! Answer the four Do Now cards and mark yourself",
      react: function () { return "Good. Now let us meet the missing volts."; }
    },
    note: {
      event: "kit:note", timeout: 120000,
      prompt: "Type your idea about the missing volts (or tap a seed note) and pin it",
      react: function () { return "Pinned! Let us sort out what each reading really means."; }
    },
    sort: {
      event: "l2:sort", timeout: 180000,
      prompt: "Sort all nine cards into EMF, terminal p.d. and lost volts, then tap Check",
      react: function (d) {
        if (!d || d.total == null) return "No problem. You can try the sorting again later.";
        if (d.correct === d.total) return "Perfect! Nine out of nine. You can tell EMF, terminal p.d. and lost volts apart.";
        if (d.correct >= 7) return "Good work, " + d.correct + " out of " + d.total + ". Read the reasons below the bins.";
        return "You got " + d.correct + " out of " + d.total + ". Remember: EMF never changes, terminal p.d. is what is left, lost volts are spent inside.";
      }
    },
    bench: {
      event: "l2:bench-done", timeout: 300000,
      prompt: "Your turn! Take five readings at five different loads",
      react: function () { return "Well done! Five loads recorded. The straight line is ready to give us E and r."; }
    },
    pin: {
      event: "l2:pin", timeout: 120000,
      prompt: "Your turn! Tap the load pins and watch the terminal p.d. fall",
      filter: function (d) { return d && d.R === 1; },
      react: function () { return "At one ohm the current is large, so the lost volts are large and very little is left at the terminals."; }
    },
    bridge: {
      event: "l2:bridge", timeout: 180000,
      prompt: "Your turn! Answer the three questions and give your verdict on the battery",
      react: function (d) {
        return d && d.correct
          ? "Case settled! The EMF is intact; the missing volts were paid inside the cell across r."
          : "Not quite. Look at the green rings: the open reading is the EMF, and the lost volts are dropped inside, not in the wires.";
      }
    },
    quiz: {
      event: "kit:quiz-done", timeout: 600000,
      prompt: "Answer all the quiz questions, or press Next to skip",
      react: function (d) {
        if (!d) return "Quiz complete!";
        if (d.score >= d.total - 2) return "Excellent, " + d.score + " out of " + d.total + "! You understand internal resistance.";
        if (d.score >= 9) return "Well done, " + d.score + " out of " + d.total + ". Read the explanations on the ones you missed.";
        return "You scored " + d.score + " out of " + d.total + ". Go back to the bench and the graph, then try again.";
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
      else if (p[0] === "key") b.key(p[1] === "closed");
      else if (p[0] === "load") b.load(+p[1]);
      else if (p[0] === "rebuild") b.rebuildEmeka();
      else if (p[0] === "demo") b.demo();
      else if (p[0] === "hl") b.highlight(p[1] || null);
    },
    zoom: function (arg) {
      var z = window.StudyScenes && StudyScenes.zoom; if (!z) return;
      var p = String(arg).split(":");
      if (p[0] === "key") z.key(p[1] === "closed");
      else if (p[0] === "load") z.load(+p[1]);
      else if (p[0] === "reset") z.reset();
    },
    pin: function (arg) { if (window.L02 && L02.showPin) L02.showPin(+arg, true); },
    bridge: function (arg) {
      if (!window.L02 || !L02.bridge || !L02.bridge.ui) return;
      if (arg === "solve") L02.bridge.ui.solve(); else if (arg === "rebuild") L02.bridge.ui.rebuild();
    }
  },

  script: [
    {
      title: "Welcome",
      steps: [
        { target: ".l-hero .display", cue: "Lesson 2 · EMF & Internal Resistance", sparkle: true,
          say: "Welcome to Lesson 2 of the Ohm's law unit. Today we hunt for the volts that vanish the instant a battery is put under load." },
        { target: ".l-hero .question", cue: "Our guiding question",
          say: "Here is the puzzle. Emeka's resting battery reads twelve point zero volts, but it slumps to eight point four volts the moment the starter cranks. Where do the missing three point six volts go?" }
      ]
    },
    {
      title: "Do Now",
      steps: [
        { target: "#donow-list", cue: "Your turn", wait: "donow",
          say: "Start with four quick Do Now cards from Lesson 1, on Ohm's law, the slope of a V against I graph and where the meters go. Answer each in your head, reveal it, and mark yourself honestly." }
      ]
    },
    {
      title: "The Story",
      steps: [
        { target: { scene: "story", part: "battery" }, action: "story:0", cue: "A normal-looking battery",
          say: "At Nkechi's auto-electric shop, Chinedu clips a voltmeter across Emeka's resting keke battery. Twelve point zero volts. It looks normal." },
        { target: { scene: "story", part: "battery" }, action: "story:1", cue: "The reading falls",
          say: "He throws the starter switch. The meter drops to eight point four volts and the headlamp dims. Where did three point six volts go?" },
        { target: { scene: "story", part: "tobe" }, action: "story:2", cue: "Tobe's quick verdict",
          say: "Tobe, the battery seller, says the battery is weak and should be dumped. We will test that claim." },
        { target: { scene: "story", part: "nkechi" }, action: "story:3", cue: "Nkechi disagrees",
          say: "Engr. Nkechi disagrees. The E M F has not fallen, she says. Those volts are spent inside the battery when a big current flows." },
        { target: { scene: "story", part: "nkechi" }, action: "story:4", cue: "To the bench",
          say: "Open key, you see the E M F. Closed key, you see what is left after the inside takes its cut. Let us go and measure it." }
      ]
    },
    {
      title: "Wonder Wall",
      steps: [
        { target: "#wall-wonder", cue: "Pin your idea", wait: "note",
          say: "Pin your idea first. If the battery still has twelve volts, why does the meter show only eight point four volts when the starter runs?" }
      ]
    },
    {
      title: "Sort Game",
      steps: [
        { target: "#rate-sort", cue: "Three bins",
          say: "Now sort nine cards into three bins. E M F is the energy per coulomb the cell supplies, read on open circuit. Terminal p dot d is what is left for the outside. Lost volts, I r, are spent inside the cell." },
        { target: "#rate-sort", cue: "Your turn", wait: "sort",
          say: "Your turn. Drag each card, or tap a card then a bin, and press Check." }
      ]
    },
    {
      title: "Virtual Lab",
      steps: [
        { target: "#method-cards", action: "bench:key:open", cue: "Four method cards",
          say: "On the bench, follow four steps. Open the key and read the E M F. Close the key, pick a load, and record the current and the terminal p dot d. Spread the current over five loads. Then plot V against I." },
        { target: { scene: "bench", part: "voltmeter" }, action: "bench:hl:voltmeter", cue: "Key open: the EMF",
          say: "Key open. Almost no current flows, so there are no lost volts, and the voltmeter shows the full E M F, six point zero volts." },
        { target: { scene: "bench", part: "rheostat" }, action: "bench:load:4.5", cue: "Close and load",
          say: "Now close the key and set a load of four point five ohms. One amp flows, and the terminal p dot d drops to four point five volts. The difference, one point five volts, is the lost volts." },
        { target: { scene: "bench", part: "ammeter" }, action: "bench:hl:ammeter", cue: "Read I and V",
          say: "The ammeter in series reads the current, and the voltmeter in parallel reads the terminal p dot d. Record the pair, then open the key again." },
        { target: "#bench-stage", action: "bench:hl:", cue: "Your turn", wait: "bench",
          say: "Your turn. Take five readings at five different loads, so the current spans a good range. I will carry on after five loads." },
        { target: "#graph-card", cue: "The V–I line",
          say: "Look at the graph. The points fall on a straight line that slopes downward: V equals E minus r times I. Extended back to zero current it cuts the V axis at the E M F, and the magnitude of its gradient is the internal resistance." },
        { target: "#expected", action: "open:#expected", cue: "Compare results",
          say: "Compare with the expected results, then try the five locked analysis questions before you unlock the answers." }
      ]
    },
    {
      title: "Make Sense",
      steps: [
        { target: "#def-box", cue: "The four quantities",
          say: "Let us name them. E M F is the energy per coulomb the cell gives the whole circuit. Internal resistance r is the opposition inside the cell. Lost volts are I r. Terminal p dot d is what is left, V equals E minus I r." },
        { target: "#eq-full", cue: "The key equations",
          say: "The master equation is E equals I times, bracket, R plus r. From it, the terminal p dot d is V equals E minus I r, and also V equals I R." },
        { target: "#props-table", cue: "Open circuit versus on load",
          say: "On open circuit the current is zero, the lost volts are zero, and the meter reads the E M F. On load, a current flows, the lost volts are I r, and the meter reads E minus I r." },
        { target: "#pos-explorer", action: "pin:1", cue: "Load explorer", wait: "pin",
          say: "Your turn. Tap the load pins for the same cell. Watch the terminal p dot d fall and the point slide down the line as the load gets heavier. Finish on the one ohm load." }
      ]
    },
    {
      title: "Zoom",
      steps: [
        { target: "#zoom-stage", action: "zoom:key:closed", cue: "Inside the cell",
          say: "Zoom inside the cell. Positive and negative ions cross the electrolyte, and some energy turns to heat on the internal resistance before the charge reaches the terminals." },
        { target: "#zoom-stage", action: "zoom:load:1.5", cue: "The energy bar splits",
          say: "Watch the energy per coulomb bar. The cell lifts each coulomb to the E M F, then the column splits into I R, the useful part for the outside, and I r, the lost part inside. A heavier load takes a bigger inside slice." }
      ]
    },
    {
      title: "Worked Examples",
      steps: [
        { target: ["#ex1", "#ex2", "#ex3"], action: "zoom:reset", cue: "Three worked examples",
          say: "Three worked examples. First, Emeka's battery: current is V over R, three amps; lost volts are three point six; so r is one point two ohms. Second, two readings give r and E together. Third, read E from the intercept and r from the gradient of a graph." }
      ]
    },
    {
      title: "Solving the Mystery",
      steps: [
        { target: "#bridge-card", action: "bench:rebuild", cue: "Rebuild the circuit", wait: "bridge",
          say: "Back to the workshop. Rebuild Emeka's circuit: open circuit twelve volts, then three amps through the starter drops three point six volts inside, leaving eight point four volts. Answer the three questions to settle Tobe's verdict." },
        { target: "#big-idea", cue: "The big idea",
          say: "The big idea. E M F is what the cell can give; terminal p dot d is what survives after I r is paid inside. A tired battery has a larger r, so it drops more volts under load even though its E M F is unchanged." },
        { target: "#quiz-list", cue: "Quiz time", wait: "quiz",
          say: "Now the quiz. Twelve questions in exam style, plus two review questions from Lesson 1." }
      ]
    },
    {
      title: "Quiz & Reflection",
      steps: [
        { target: "#reflect", cue: "Reflect and assignment",
          say: "To finish, rate yourself from one to four on each goal, then do the exit ticket and the blank page recall. Your assignment is Part A and Part B from the questions for Lesson 2. Well done today." }
      ]
    }
  ]
};
