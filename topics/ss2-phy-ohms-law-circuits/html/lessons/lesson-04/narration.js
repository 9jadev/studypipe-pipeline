/* Lesson 04 · StudyNarrator choreography: Galvanometer Conversion (en-NG). 27 steps. */
window.NARRATION = {
  rate: 0.96,
  pitch: 1.01,

  waits: {
    donow: {
      event: "kit:donow", timeout: 120000,
      prompt: "Your turn! Answer the four Do Now cards and mark yourself",
      react: function () { return "Good. Now let us meet the delicate little meter that started all the trouble."; }
    },
    note: {
      event: "kit:note", timeout: 120000,
      prompt: "Pin one idea about measuring something far beyond a meter's range",
      react: function () { return "Pinned. Let us sort out which clue belongs to the ammeter and which to the voltmeter."; }
    },
    sort: {
      event: "l4:sort", timeout: 180000,
      prompt: "Your turn! Drop all ten cards into Ammeter, Voltmeter or Galvanometer truth, then Check",
      react: function (d) {
        if (!d || d.total == null) return "No wahala, you can try the sort again later.";
        if (d.correct === d.total) return "Perfect, all ten correct! Shunt for the ammeter, multiplier for the voltmeter.";
        if (d.correct >= 7) return "Well done, " + d.correct + " out of " + d.total + ". Read the reasons below the cards.";
        return "You got " + d.correct + " out of " + d.total + ". Remember: small shunt in parallel makes an ammeter; big multiplier in series makes a voltmeter.";
      }
    },
    bench: {
      event: "l4:bench-done", timeout: 300000,
      prompt: "Your turn! Build one ammeter and one voltmeter from Nkechi's coil",
      react: function () { return "Excellent! One coil, two instruments, and the coil never saw more than fifteen milliamperes."; }
    },
    pin: {
      event: "l4:pin", timeout: 120000,
      prompt: "Your turn! Tap the range pins to see the shunt or multiplier each one needs",
      react: function () { return "See the pattern: a bigger ammeter needs a smaller shunt, and a bigger voltmeter needs a larger multiplier."; }
    },
    bridge: {
      event: "l4:bridge", timeout: 180000,
      prompt: "Your turn! Answer the three steps to kit out Nkechi's coil",
      react: function (d) {
        return d && d.correct >= 3
          ? "Case closed! One movement becomes a safe three amp ammeter and a safe forty volt voltmeter."
          : "Nearly. A tiny shunt in parallel makes the ammeter; a big multiplier in series makes the voltmeter. The green rings show the right answers.";
      }
    },
    quiz: {
      event: "kit:quiz-done", timeout: 600000,
      prompt: "Answer all the quiz questions, or press Next to move on",
      react: function (d) {
        if (!d) return "Quiz complete!";
        if (d.score >= d.total - 2) return "Sharp work, " + d.score + " out of " + d.total + "! You can size a shunt and a multiplier.";
        if (d.score >= 8) return "Well done, " + d.score + " out of " + d.total + ". Read the explanations you missed.";
        return "You scored " + d.score + " out of " + d.total + ". Revisit the design bench, then try again.";
      }
    }
  },

  actions: {
    story: function (arg) { if (window.StudyScenes && StudyScenes.story) StudyScenes.story.beat(+arg); },
    open: function (arg) { var el = document.querySelector(arg); if (el && el.tagName === "DETAILS") el.open = true; },
    bench: function (arg) {
      var b = window.StudyScenes && StudyScenes.bench; if (!b) return;
      var p = String(arg).split(":");
      if (p[0] === "conv") b.setConv(p[1]);
      else if (p[0] === "target") b.setTarget(+p[1]);
      else if (p[0] === "build") b.build();
      else if (p[0] === "reset") b.reset();
      else if (p[0] === "hl") b.highlight(p[1] || null);
    },
    zoom: function (arg) {
      var z = window.StudyScenes && StudyScenes.zoom; if (!z) return;
      var p = String(arg).split(":");
      if (p[0] === "view") z.setMode(p[1]); else if (p[0] === "reset") z.view("ammeter");
    },
    graph: function (arg) {
      var el = document.querySelector("#rs-card [data-gmode='" + arg + "']"); if (el) el.click();
    },
    pin: function (arg) { if (window.L04 && L04.showPin) L04.showPin(+arg); },
    bridge: function (arg) { if (arg === "solve" && window.L04 && L04.solveBridge) L04.solveBridge(); }
  },

  script: [
    {
      title: "Welcome",
      steps: [
        { target: ".l-hero .display", cue: "Lesson 4 · Galvanometer Conversion", sparkle: true,
          say: "Welcome to Lesson 4 of the current electricity unit. Today we take one delicate galvanometer and turn it into both a working ammeter and a working voltmeter." },
        { target: ".l-hero .question", cue: "Our guiding question",
          say: "Here is the question. How can a fifteen milliamp galvanometer safely test a three amp line or a forty volt bank without burning out? The answer is a shunt and a multiplier." }
      ]
    },
    {
      title: "Do Now",
      steps: [
        { target: "#donow-list", cue: "Your turn", wait: "donow",
          say: "Start with four quick Do Now cards from Lessons 1 and 3: parallel p.d., Ohm's law, series current and milliamps. Answer each in your head, reveal it, and mark yourself. I will wait." }
      ]
    },
    {
      title: "The Story",
      steps: [
        { target: { scene: "story", part: "chinedu" }, action: "story:0", cue: "Chinedu reaches for the meter",
          say: "At Engr. Nkechi's test bench, Chinedu reaches for a small galvanometer to clip onto the three amp starter line." },
        { target: { scene: "story", part: "nkechi" }, action: "story:1", cue: "Nkechi stops him",
          say: "Nkechi stops his hand. That coil reaches full scale at only fifteen milliamperes. Push three amperes through it and it will burn out." },
        { target: { scene: "story", part: "tobe" }, action: "story:2", cue: "Tobe's idea",
          say: "Tobe says, so we just buy a bigger meter? Nkechi smiles." },
        { target: { scene: "story", part: "nkechi" }, action: "story:3", cue: "The bypass",
          say: "No, she says. We give most of the current a bypass, a tiny resistor in parallel called the shunt. The same coil then reads amperes." },
        { target: { scene: "story", part: "nkechi" }, action: "story:4", cue: "And for voltage",
          say: "And for voltage we add a big resistor in series, the multiplier, so the coil only ever sees fifteen milliamperes. One movement, two instruments. Let us build them." }
      ]
    },
    {
      title: "Wonder Wall",
      steps: [
        { target: "#wall-wonder", cue: "Pin your idea", wait: "note",
          say: "Pin your idea on the Wonder Wall. How do you let a delicate meter measure something far beyond its range without destroying it?" }
      ]
    },
    {
      title: "Sort Game",
      steps: [
        { target: "#gv-sort", cue: "Three bins",
          say: "First, a sort. Each card describes an ammeter, a voltmeter, or a plain truth about the galvanometer itself. Drop each card into the right bin." },
        { target: "#gv-sort", cue: "Your turn", wait: "sort",
          say: "Your turn. Place all ten cards, then tap Check." }
      ]
    },
    {
      title: "Virtual Lab",
      steps: [
        { target: "#method-cards", action: "bench:reset", cue: "Four method cards",
          say: "Now the design bench. Follow the four method cards: note the coil's I g and R g, choose a full scale, add the resistor, and test the meter." },
        { target: { scene: "bench", part: "shunt" }, action: "bench:conv:ammeter", cue: "Ammeter: the shunt",
          say: "For an ammeter, we pick three amperes and add a shunt in parallel. The formula gives R s equals zero point zero nine zero five ohms, and the coil keeps just fifteen milliamperes." },
        { target: { scene: "bench", part: "multiplier" }, action: "bench:conv:voltmeter", cue: "Voltmeter: the multiplier",
          say: "For a voltmeter, we pick forty volts and add a multiplier in series. R m is about two thousand six hundred and fifty ohms, and again the coil sees only fifteen milliamperes." },
        { target: "#bench-stage", cue: "Your turn", wait: "bench",
          say: "Your turn. Build one ammeter and one voltmeter, each with Build and test. I will carry on after both." },
        { target: "#rs-card", action: "graph:ammeter", cue: "The design graph",
          say: "Look at the live graph. For the ammeter the shunt curve falls steeply: a bigger range needs a smaller shunt. For the voltmeter the multiplier is a straight line, climbing with the range." }
      ]
    },
    {
      title: "Make Sense",
      steps: [
        { target: "#concepts", cue: "Shunt and multiplier",
          say: "Let us make sense of it. An ammeter needs a small shunt in parallel; a voltmeter needs a large multiplier in series. Always subtract R g to get the resistor you add." },
        { target: "#eq-shunt", cue: "The two formulae",
          say: "Equal p.d. across the parallel pair gives R s equals I g R g divided by I minus I g. In series, V equals I g times R g plus R m, so R m equals V over I g minus R g." },
        { target: "#pos-explorer", action: "pin:2", cue: "Range explorer", wait: "pin",
          say: "Your turn. Tap the range pins and watch the shunt or the multiplier each range needs. Notice how fast the shunt shrinks as the current grows." }
      ]
    },
    {
      title: "Zoom",
      steps: [
        { target: "#zoom-stage", action: "zoom:view:ammeter", cue: "Inside: the shunt",
          say: "Zoom inside the moving coil. In the ammeter, the thick copper shunt beside the coil carries about ninety nine per cent of the current, so the fine coil stays safe." },
        { target: "#zoom-stage", action: "zoom:view:voltmeter", cue: "Inside: the multiplier",
          say: "Switch to the voltmeter. Now the tall multiplier bobbin sits in series and drops the extra voltage, while the coil still carries only its fifteen milliamperes." }
      ]
    },
    {
      title: "Worked Examples",
      steps: [
        { target: "#examples", action: "open:#ex1", cue: "Three worked examples",
          say: "Three worked examples. First, Nkechi's coil as a three amp ammeter. Second, a different eight milliamp coil as a forty volt voltmeter. Third, finding I g first from the coil's full scale p.d. Work each one on paper, then check the steps." }
      ]
    },
    {
      title: "Solving the Mystery",
      steps: [
        { target: "#bridge-card", cue: "Kit out the coil", wait: "bridge",
          say: "Now the big idea. Kit out Nkechi's own coil for the starter test. Answer the three steps to choose the shunt and the multiplier." }
      ]
    },
    {
      title: "Quiz & Reflection",
      steps: [
        { target: "#quiz-list", cue: "Quiz time", wait: "quiz",
          say: "Now the quiz: twelve questions in WAEC, NECO and JAMB style, plus two review questions from earlier lessons." },
        { target: "#reflect", cue: "Reflect and assignment",
          say: "To finish, rate yourself from one to four on each goal, do the exit ticket and the blank page recall, then Part A and Part B for Lesson 4. Well done today." }
      ]
    }
  ]
};
