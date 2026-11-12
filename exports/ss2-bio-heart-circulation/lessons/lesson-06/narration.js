/* Lesson 06 · StudyNarrator choreography: Blood, Plasma, Cells and Clotting (en-NG). 28 steps. */
window.NARRATION = {
  rate: 0.96,
  pitch: 1.01,

  waits: {
    note: {
      event: "kit:note", timeout: 120000,
      prompt: "Type your idea about what seals the cut (or tap a seed note) and pin it to the Wonder Wall",
      react: function () { return "Pinned! Now let us sort the parts of blood."; }
    },
    sort: {
      event: "l6:sort", timeout: 150000,
      prompt: "Sort all 12 cards into plasma, red cells, white cells or platelets, then tap Check my sorting",
      react: function (d) {
        if (!d || d.total == null) return "No problem. You can try the sort again later.";
        if (d.correct === d.total) return "Twelve out of twelve! You know your plasma from your platelets.";
        if (d.correct >= 10) return "Good work, " + d.correct + " out of " + d.total + ". Read the notes below for the cards that slipped.";
        return "You got " + d.correct + " out of " + d.total + ". Read the notes below. Remember: red cells have no nucleus, white cells do, and platelets are only fragments.";
      }
    },
    bench: {
      event: "l6:bench-done", timeout: 240000,
      prompt: "Your turn! Fill the chamber, wait the two minutes, then count all five squares",
      react: function (d) {
        var tot = d && d.total != null ? d.total : 480;
        return "Well done! All five squares counted: " + tot + " red cells in a volume of point zero two zero cubic millimetres.";
      }
    },
    pin: {
      event: "l6:pin", timeout: 120000,
      prompt: "Your turn! Tap the pins one by one and finish on the platelets",
      filter: function (d) { return d && d.key === "platelets"; },
      react: function () { return "Platelets: about two hundred and fifty thousand in every cubic millimetre, tiny fragments that start the clot."; }
    },
    bridge: {
      event: "l6:bridge", timeout: 150000,
      prompt: "Your turn! Answer the three questions and give your verdict on the rider's gash",
      react: function (d) {
        return d && d.correct
          ? "Case closed! A fibrin net sealed the cut, fibrinogen was the dissolved protein, and the rider lost thirty percent of his blood."
          : "Not quite, but look at the green rings. Fibrinogen became fibrin, and one point five out of five is thirty percent.";
      }
    },
    quiz: {
      event: "kit:quiz-done", timeout: 600000,
      prompt: "Answer all the quiz questions, or press Next to skip",
      react: function (d) {
        if (!d) return "Quiz complete!";
        if (d.score >= d.total - 2) return "Excellent, " + d.score + " out of " + d.total + "! You know blood well.";
        if (d.score >= 9) return "Well done, " + d.score + " out of " + d.total + ". Read the explanations on the ones you missed.";
        return "You scored " + d.score + " out of " + d.total + ". Go back to the bench and the clot zoom, then try again.";
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
      else if (p[0] === "find") b.find(p[1]);
      else if (p[0] === "view") b.view(+p[1]);
      else if (p[0] === "micro") b.micro();
      else if (p[0] === "fill") b.fill();
      else if (p[0] === "next") { for (var i = 0; i < (+p[1] || 1); i++) b.next(); }
      else if (p[0] === "count") b.setMode("count");
      else if (p[0] === "clot") b.clot(p[1] !== "0");
      else if (p[0] === "hl") b.highlight(p[1] === "none" ? null : p[1]);
    },
    zoom: function (arg) {
      var z = window.StudyScenes && StudyScenes.zoom; if (!z) return;
      var p = String(arg).split(":");
      if (p[0] === "play") z.play();
      else if (p[0] === "step") z.step(+p[1]);
      else if (p[0] === "citrate") z.citrate(p[1] !== "0");
      else if (p[0] === "reset") z.reset();
    },
    pin: function (arg) { if (window.L06 && L06.showPin) L06.showPin(+arg, true); },
    bridge: function (arg) { if (window.L06 && L06.bridge && arg === "solve") L06.bridge.solve(); }
  },

  script: [
    {
      title: "Welcome",
      steps: [
        { target: ".l-hero .display", cue: "Lesson 6 · Blood", sparkle: true,
          say: "Welcome to Lesson 6 of the heart and blood circulation unit. Today we look at blood itself: its plasma, its cells, and the chain of events that turns it solid at a cut." },
        { target: ".l-hero .question", cue: "Our guiding question",
          say: "Here is our guiding question. The rider's cut finally stopped oozing. What sealed it, and what did he lose? By the end you will compare the three kinds of cell, describe the four clotting steps, and work out a red cell count from a haemocytometer." }
      ]
    },
    {
      title: "Do Now",
      steps: [
        { target: "#donow-list", cue: "Your turn", wait: "donow",
          say: "Start with four quick Do Now cards from Lessons 3, 4 and 5: the circuit, the heart sounds and the vessels. Answer each one in your head, then reveal it and mark yourself honestly. I will carry on when you have marked them all." }
      ]
    },
    {
      title: "The Story",
      steps: [
        { target: { scene: "story", part: "amaka" }, action: "story:0", cue: "Pressure on the gash",
          say: "At the Oja Oba health-day tent, Dr Aisha presses a pad on the okada rider's gash. After some minutes the bleeding slows to a seep, and then it stops." },
        { target: { scene: "story", part: "cust1" }, action: "story:1", cue: "Chidi's question",
          say: "Chidi looks at the cut and asks: nobody stitched it yet, so what closed it?" },
        { target: { scene: "story", part: "cust2" }, action: "story:2", cue: "Baba Sule's idea",
          say: "Baba Sule is sure. Blood dries in the air like palm oil, he says, so rub some salt in. Hold that idea. We will test it." },
        { target: { scene: "story", part: "amaka" }, action: "story:3", cue: "A drop under the microscope",
          say: "In the lab at UCH, Dr Aisha puts a drop of blood under the microscope. Discs, a few large cells with odd nuclei, and tiny specks. Each of these did a job at that wound." },
        { target: { scene: "story", part: "amaka" }, action: "story:4", cue: "To the bench",
          say: "Come to the bench. We will look at the cells, and then we will count them." }
      ]
    },
    {
      title: "Wonder Wall",
      steps: [
        { target: "#wall-wonder", cue: "Pin your idea", wait: "note",
          say: "Before we look, pin your idea to the Wonder Wall: what do you think turns runny blood into a solid plug?" }
      ]
    },
    {
      title: "Which part?",
      steps: [
        { target: "#blood-sort", cue: "Your turn", wait: "sort",
          say: "First, a sorting game. Put each card in the right bin: plasma, red cells, white cells, or platelets. Tap a card, then tap a bin. Sort all twelve cards, then tap Check my sorting." }
      ]
    },
    {
      title: "The Bench",
      steps: [
        { target: "#method-cards", action: "bench:reset", cue: "Four method cards",
          say: "Now the practical. Only prepared, stained smears are used in class. Follow the four method cards: look at the smear, measure a red cell on a micrograph, fill the haemocytometer and count five squares, then calculate the count in a cubic millimetre." },
        { target: { scene: "bench", part: "rbc" }, action: "bench:find:rbc", cue: "Red cells",
          say: "At times four hundred, the field is full of red cells: pale centred discs with no nucleus. The patient's blood and the lab smear are the same stuff, only now you can see it." },
        { target: { scene: "bench", part: "phagocyte" }, action: "bench:find:phagocyte", cue: "Phagocyte, lymphocyte, platelets",
          say: "The big cell with a lobed nucleus is a phagocyte, which swallows bacteria. The cell with one large round nucleus is a lymphocyte, which makes antibodies. And the tiny specks with no nucleus are platelets." },
        { target: "#micro-card", action: "bench:micro", cue: "Real size from a micrograph",
          say: "Now the micrograph. The red cell measures fifteen millimetres on the page at times two thousand. Actual size is image size divided by magnification: fifteen divided by two thousand is zero point zero zero seven five millimetres, which is seven point five micrometres." },
        { target: { scene: "bench", part: "coverslip" }, action: "bench:fill", cue: "Fill and wait two minutes",
          say: "Now the haemocytometer. Fill the chamber from the edge of the cover slip in one smooth flow, with no air bubbles, then wait two minutes for the cells to settle. The blood was diluted one in two hundred, because undiluted blood has far too many cells to count." },
        { target: "#bench-stage", action: "bench:count", cue: "Your turn", wait: "bench",
          say: "Your turn. Tap Next square and count the red cells in each of the five medium squares. Count cells touching the top and left lines, but leave out those on the bottom and right lines. I will carry on when all five are done." },
        { target: "#results-table", cue: "Results and the sums",
          say: "Look at your table. The counts are ninety eight, ninety two, one hundred and one, ninety five and ninety four: a total of four hundred and eighty cells. Five squares hold point zero two zero cubic millimetres. Four hundred and eighty divided by point zero two zero is twenty four thousand, and times two hundred is four point eight million per cubic millimetre." },
        { target: "#expected", action: "open:#expected", cue: "Expected results and errors",
          say: "Compare with the expected results. And remember the sources of error: counting all four boundary lines reads too high, too much diluting fluid reads too low, and counting before the cells settle reads too low." }
      ]
    },
    {
      title: "Make Sense",
      steps: [
        { target: "#composition", action: "bench:view:400", cue: "Plasma and cells",
          say: "Now make sense of it. Blood is about fifty five percent plasma and forty five percent cells. Plasma is a straw coloured liquid, about nine tenths water, carrying food, salts, hormones, urea, carbon dioxide and plasma proteins. Serum is plasma with the clotting proteins removed." },
        { target: "#props-table", cue: "Three kinds of cell",
          say: "Red cells have no nucleus, number about five million per cubic millimetre, and carry oxygen as oxyhaemoglobin. White cells have a nucleus, number seven to eight thousand, and defend the body. Platelets are fragments, about two hundred and fifty thousand, and they help blood to clot. Red cells are adapted by their dimpled shape, no nucleus, small bendy size, and carbonic anhydrase." },
        { target: "#eq-clot", cue: "The clotting chain",
          say: "Now clotting. Damaged tissue and platelets release thromboplastin. With calcium ions and vitamin K, it turns prothrombin into thrombin. Thrombin turns dissolved fibrinogen into solid fibrin threads, and the fibrin net traps red cells to make a clot. Inside healthy vessels the lining is smooth and heparin is present, so blood stays liquid." },
        { target: "#pos-explorer", action: "pin:0", cue: "Blood in a bottle", wait: "pin",
          say: "Your turn. Tap the pins in the blood bottle, and watch each kind of cell light up on the 3D smear. Finish on the platelets." }
      ]
    },
    {
      title: "Clot Zoom",
      steps: [
        { target: { scene: "zoom", part: "platelets" }, action: "zoom:play", cue: "Platelets, then the fibrin net",
          say: "Zoom in on the cut edge. First the platelets gather. The chain fires, and then the fibrin threads weave across and snare the red cells. That is the clot that sealed the rider's gash." },
        { target: { scene: "zoom", part: "fibrin" }, action: "zoom:citrate:1", cue: "Add sodium citrate",
          say: "Now add sodium citrate, which removes calcium ions. The platelets still gather, but the threads fail to form. That is why the blood bank adds citrate to stored blood, to keep it runny." }
      ]
    },
    {
      title: "Apply",
      steps: [
        { target: ["#ex1", "#ex2", "#ex3"], action: "zoom:reset", cue: "Counts and sizes",
          say: "Worked examples. One square is point two times point two times point one, which is point zero zero four cubic millimetres. Five squares make point zero two zero. Four hundred and eighty divided by that, times two hundred, is four point eight million. A micrograph size of fifteen millimetres at times two thousand is seven point five micrometres. And five million per cubic millimetre in five dm cubed gives two point five times ten to the thirteen red cells." },
        { target: "#bridge-card", action: "zoom:play", cue: "What sealed the gash?", wait: "bridge",
          say: "Back to the tent. Answer the three questions: what sealed the cut, which dissolved protein became the threads, and what percentage of his blood the rider had lost." },
        { target: "#quiz-list", cue: "Quiz time", wait: "quiz",
          say: "Now the quiz. Twelve questions from WAEC, NECO and JAMB styles, plus two review questions from Lesson 5." }
      ]
    },
    {
      title: "Reflect",
      steps: [
        { target: "#reflect", cue: "Reflect and assignment",
          say: "To finish, rate yourself from one to four on each goal, then do the exit ticket and the blank page recall. Your assignment is Part A, counting what you cannot count, and Part B, the thirty mark paper. Well done today." }
      ]
    }
  ]
};
