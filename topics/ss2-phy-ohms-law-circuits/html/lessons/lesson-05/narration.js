/* Lesson 05 · StudyNarrator choreography: Null Methods (en-NG). 27 steps.
   Symbols are spelled out for the voice ("R over S", "k l", "E minus I r"). */
window.NARRATION = {
  rate: 0.96,
  pitch: 1.01,

  waits: {
    note: {
      event: "kit:note", timeout: 120000,
      prompt: "Type your idea (or tap a seed note) and pin it to the Wonder Wall",
      react: function () { return "Pinned! Now let us sort the null-method statements."; }
    },
    sort: {
      event: "l5:sort", timeout: 180000,
      prompt: "Sort all ten cards into metre bridge, potentiometer or both, then tap Check",
      react: function (d) {
        if (!d || d.total == null) return "No problem, you can try the sort again later.";
        if (d.correct === d.total) return "Perfect, all ten right! Both are null methods, but only the potentiometer draws no current.";
        return "You got " + d.correct + " out of " + d.total + ". Read the reasons below, then on to the bench.";
      }
    },
    bench: {
      event: "l5:bench-done", timeout: 300000,
      prompt: "Your turn! Find a metre-bridge null and a potentiometer null",
      react: function () { return "Well done. Both nulls found. At the potentiometer balance, no current was drawn, so you read the true EMF."; }
    },
    pin: {
      event: "l5:pin", timeout: 120000,
      prompt: "Your turn! Tap the length pins and watch the p.d. rise in step with the length",
      react: function () { return "See how V equals k l: the p.d. is proportional to the length. That is the potentiometer principle."; }
    },
    bridge: {
      event: "l5:bridge", timeout: 180000,
      prompt: "Your turn! Balance Emeka's battery, then answer the three questions and give your verdict",
      react: function (d) {
        return d && d.correct
          ? "Case closed! The EMF is still twelve volts; only the internal resistance has risen."
          : "Not quite. At balance no current flows, so the length gives the true EMF, and the fault is a risen internal resistance.";
      }
    },
    quiz: {
      event: "kit:quiz-done", timeout: 600000,
      prompt: "Answer all the quiz questions, or press Next to skip",
      react: function (d) {
        if (!d) return "Quiz complete!";
        if (d.score >= d.total - 2) return "Excellent, " + d.score + " out of " + d.total + "! You have mastered the null methods.";
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
      if (p[0] === "mode") b.setMode(p[1]);
      else if (p[0] === "balance") b.findBalance();
      else if (p[0] === "hl") b.highlight(p[1] || null);
      else if (p[0] === "reset") b.setMode("bridge");
    },
    zoom: function (arg) {
      var z = window.StudyScenes && StudyScenes.zoom; if (!z) return;
      var p = String(arg).split(":");
      if (p[0] === "mode") z.setMode(p[1]);
      else if (p[0] === "balance") z.findBalance();
      else if (p[0] === "hl") z.highlight(p[1] || null);
    },
    pin: function (arg) { if (window.L05 && L05.showPin) L05.showPin(+arg, true); },
    bridge: function (arg) {
      if (!window.L05 || !L05.bridge_api) return;
      if (arg === "solve") L05.bridge_api.solve(); else if (arg === "balance") L05.bridge_api.balance();
    }
  },

  script: [
    {
      title: "Welcome",
      steps: [
        { target: ".l-hero .display", cue: "Lesson 5 · Null Methods", sparkle: true,
          say: "Welcome to Lesson 5, the finale. Today we solve the mystery for good, using two null methods: the metre bridge and the potentiometer." },
        { target: ".l-hero .question", cue: "Our guiding question",
          say: "Here is our question. How does the potentiometer still read Emeka's true twelve volts when it draws no current, and how do we measure an unknown coil exactly?" }
      ]
    },
    {
      title: "Do Now",
      steps: [
        { target: "#donow-list", cue: "Your turn", wait: "donow",
          say: "Start with four quick Do Now cards from Lessons 1, 2 and 4. Answer each from memory, reveal it, and mark yourself. I will carry on when you have marked them all." }
      ]
    },
    {
      title: "The Story",
      steps: [
        { target: { scene: "story", part: "amaka" }, action: "story:0", cue: "Ask the battery",
          say: "At the test bench, Engr. Nkechi lays Emeka's battery beside a hundred centimetre slide wire. The voltmeter lied under load, she says, so let us ask the battery without taking any current from it." },
        { target: { scene: "story", part: "cust1" }, action: "story:1", cue: "Chinedu slides the jockey",
          say: "Chinedu slides the jockey along the wire. The centre-zero galvanometer swings one way, then the other." },
        { target: { scene: "story", part: "amaka" }, action: "story:2", cue: "The driver",
          say: "To balance twelve volts, Nkechi uses a twenty-four volt driver, set so the wire carries zero point one five zero volts per centimetre." },
        { target: { scene: "story", part: "amaka" }, action: "story:3", cue: "Eighty centimetres",
          say: "The needle settles at eighty point zero centimetres. E equals k l, so zero point one five zero times eighty is twelve point zero volts. The EMF is unchanged; the internal resistance has risen." },
        { target: { scene: "story", part: "amaka" }, action: "story:4", cue: "To the bench",
          say: "Same idea, different question: on the metre bridge we find a resistance exactly, by where the galvanometer reads zero. Let us go to the bench." }
      ]
    },
    {
      title: "Wonder Wall",
      steps: [
        { target: "#wall-wonder", cue: "Pin your idea", wait: "note",
          say: "Pin your idea. How can you measure a cell's voltage without drawing any current from it?" }
      ]
    },
    {
      title: "Sort Game",
      steps: [
        { target: "#l05-sort", cue: "Sort the statements",
          say: "First, sort ten statements into metre bridge, potentiometer, or true of both. Remember: both are null methods, but only the potentiometer draws no current at balance." },
        { target: "#l05-sort", cue: "Your turn", wait: "sort",
          say: "Your turn. Place all ten cards, then tap Check." }
      ]
    },
    {
      title: "Virtual Lab",
      steps: [
        { target: "#method-cards", action: "bench:reset", cue: "Four method cards",
          say: "Now the null-balance bench. Follow the four method cards: set the standard, slide the jockey for a zero galvanometer reading, then record and compute." },
        { target: { scene: "bench", part: "standard" }, action: "bench:balance", cue: "Metre bridge null",
          say: "Watch the metre bridge. A seven point zero ohm standard sits in the left gap. The jockey taps to the null at fifty-six point zero centimetres, so the unknown is seven times forty-four over fifty-six, five point five zero ohms." },
        { target: { scene: "bench", part: "testcell" }, action: "bench:mode:potentiometer", cue: "Switch to the potentiometer",
          say: "Now switch to the potentiometer. A one point five zero volt cell balances on the school driver, where k is zero point zero two zero zero volts per centimetre." },
        { target: "#bench-stage", cue: "Your turn", wait: "bench",
          say: "Your turn. Find a metre-bridge null and a potentiometer null. Tap Find null point, or slide the jockey yourself. I will carry on after both." },
        { target: "#graph-card", cue: "p.d. against length",
          say: "Look at the graph. V equals k l is a straight line through the origin, so the p.d. is proportional to the length. The one point five zero volt cell balances at seventy-five point zero centimetres." }
      ]
    },
    {
      title: "Make Sense",
      steps: [
        { target: "#metre-bridge-box", cue: "The metre bridge",
          say: "Make sense of it. The metre bridge balances when R over S equals l over a hundred minus l, so an unknown R is the standard times a hundred minus l, over l." },
        { target: "#potentiometer-box", cue: "The potentiometer",
          say: "The potentiometer uses V equals k l. Because the balanced cell passes no current, there are no lost volts, so its full EMF is read. Comparing cells, E one over E two equals l one over l two, and r equals R times l one minus l two, over l two." },
        { target: "#driver-box", cue: "The driver trap",
          say: "Mind the driver trap. The whole driver EMF is not across the wire: part drops across the series rheostat. Work out V wire first, then the gradient k." },
        { target: "#pos-explorer", action: "pin:3", cue: "Length explorer", wait: "pin",
          say: "Your turn. Tap the length pins and watch V equals k l rise in step with the length. The marked lengths show how internal resistance is found from an open and a loaded balance." }
      ]
    },
    {
      title: "Zoom",
      steps: [
        { target: "#zoom-stage", action: "zoom:mode:school", cue: "The potential ramp",
          say: "Zoom in on the potential ramp. The potential falls steadily along the wire. The green line is the cell's EMF; the red gap is E minus k l. Press Find null and the gap closes to zero, where the galvanometer current fades away." },
        { target: "#zoom-stage", action: "zoom:mode:keke", cue: "Emeka's battery",
          say: "Now Emeka's battery, with the twenty-four volt driver. The gradient is steeper, zero point one five zero volts per centimetre, and it balances at eighty point zero centimetres, reading its true twelve volts." }
      ]
    },
    {
      title: "Worked Examples",
      steps: [
        { target: ["#ex1", "#ex2", "#ex3"], action: "zoom:mode:school", cue: "Three worked examples",
          say: "Three worked examples. The metre bridge and resistivity of a coil. The potentiometer driver circuit, where only part of the driver volts sits across the wire. And internal resistance from two balance lengths, giving zero point seven five ohms." }
      ]
    },
    {
      title: "Solving the Mystery",
      steps: [
        { target: "#bridge-card", action: "bridge:balance", cue: "Case closed", wait: "bridge",
          say: "Now solve the mystery. Balance Emeka's battery on the potentiometer: no current drawn, so it reads the full twelve volts. Answer the three questions and give your verdict." }
      ]
    },
    {
      title: "Quiz & Reflection",
      steps: [
        { target: "#quiz-list", cue: "Quiz time", wait: "quiz",
          say: "Now the quiz. Twelve questions in WAEC, NECO and JAMB style, plus two review questions from earlier lessons." },
        { target: "#reflect", cue: "Reflect and assignment",
          say: "To finish, rate yourself from one to four on each goal, then do the exit ticket, the blank-page recall and the assignment. Congratulations, you have finished the whole unit. Well done." }
      ]
    }
  ]
};
