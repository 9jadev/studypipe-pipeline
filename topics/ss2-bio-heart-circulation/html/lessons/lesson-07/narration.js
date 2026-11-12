/* Lesson 07 · StudyNarrator choreography: Blood Groups, Rhesus, Transfusion and Disorders, Closing the Case (en-NG). 28 steps. */
window.NARRATION = {
  rate: 0.96,
  pitch: 1.01,

  waits: {
    note: {
      event: "kit:note", timeout: 120000,
      prompt: "Type what could go wrong with the wrong blood (or tap a seed note) and pin it to the Wonder Wall",
      react: function () { return "Pinned! Now let us find out which bags are safe."; }
    },
    sort: {
      event: "l7:sort", timeout: 150000,
      prompt: "Sort all 8 cards into safe or unsafe, then tap Check my sorting",
      react: function (d) {
        if (!d || d.total == null) return "No problem. You can try the sort again later.";
        if (d.correct === d.total) return "Eight out of eight! You can read antigens against antibodies.";
        if (d.correct >= 6) return "Good work, " + d.correct + " out of " + d.total + ". Read the notes below for the cards that slipped.";
        return "You got " + d.correct + " out of " + d.total + ". Remember: look at the donor's antigens and the patient's antibodies.";
      }
    },
    bench: {
      event: "l7:bench-done", timeout: 300000,
      prompt: "Your turn! Choose each donor in turn, run the four steps and read the tile, until all five samples are read",
      react: function () { return "Well done! All five samples typed. Only Donor 1, group O negative, is safe for the rider on this tile, and B negative is the exact match in the cool box."; }
    },
    pin: {
      event: "l7:pin", timeout: 150000,
      prompt: "Your turn! Tap three squares of the donor and patient grid, and switch the Rhesus buttons",
      filter: function (d) { return d && d.count >= 3; },
      react: function () { return "Good. Each square is the same rule: the donor's antigens against the patient's antibodies."; }
    },
    bridge: {
      event: "l7:bridge", timeout: 180000,
      prompt: "Your turn! Choose an answer for each of the three cases and give your verdict",
      react: function (d) {
        return d && d.correct
          ? "Case closed! Chidi is healthy, Mama Bisi's ankles came from pooled venous blood, and the rider needs B negative or O negative."
          : "Not quite, but look at the green rings, and read the notes on each case.";
      }
    },
    quiz: {
      event: "kit:quiz-done", timeout: 600000,
      prompt: "Answer all the quiz questions, or press Next to skip",
      react: function (d) {
        if (!d) return "Quiz complete!";
        if (d.score >= d.total - 2) return "Excellent, " + d.score + " out of " + d.total + "! You have closed the case.";
        if (d.score >= 9) return "Well done, " + d.score + " out of " + d.total + ". Read the explanations on the ones you missed.";
        return "You scored " + d.score + " out of " + d.total + ". Go back to the typing tile and the clump zoom, then try again.";
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
      else if (p[0] === "step") b.step(+p[1]);
      else if (p[0] === "sample") b.sample(p[1]);
      else if (p[0] === "cond") b.cond(p[1]);
      else if (p[0] === "run") b.run(p[1]);
      else if (p[0] === "hl") b.highlight(p[1] === "none" ? null : p[1]);
    },
    zoom: function (arg) {
      var z = window.StudyScenes && StudyScenes.zoom; if (!z) return;
      var p = String(arg).split(":");
      if (p[0] === "mode") z.setMode(p[1]);
      else if (p[0] === "donor") z.donor(p[1]);
      else if (p[0] === "serum") z.serum(p[1]);
      else if (p[0] === "agg") z.agg(+p[1]);
      else if (p[0] === "auto") z.auto(p[1] === "1");
      else if (p[0] === "stage") z.stageTo(+p[1]);
      else if (p[0] === "inject") z.inject(p[1] === "1");
      else if (p[0] === "play") z.play();
      else if (p[0] === "hl") z.highlight(p[1] === "none" ? null : p[1]);
    },
    pin: function (arg) {
      if (!window.L07 || !L07.showPair) return;
      var p = String(arg).split(":");           // pin:O:AB  (donor, patient)
      if (L07.setRh) L07.setRh("-", "-");
      L07.showPair(p[0], p[1], true);
    },
    bridge: function (arg) {
      if (!window.L07 || !L07.bridge) return;
      if (arg === "solve") L07.bridge.solve();
      else if (arg === "flip") L07.bridge.flipAll();
    }
  },

  script: [
    {
      title: "Welcome",
      steps: [
        { target: ".l-hero .question", cue: "Our guiding question", sparkle: true,
          say: "Welcome to Lesson 7, the last lesson of the heart and blood circulation unit. Today we close the whole Oja Oba case. Which of the six bags can save a B Rh negative rider, and how great a danger is Mama Bisi's one hundred and sixty over one hundred? By the end you will type blood on a tile, explain clumping and Rhesus, name circulatory disorders, and solve all three cases." }
      ]
    },
    {
      title: "Do Now",
      steps: [
        { target: "#donow-list", cue: "Your turn", wait: "donow",
          say: "Start with four quick Do Now cards from Lessons 1, 4, 5 and 6: plasma antibodies, fibrin, one twenty over eighty, and materials carried by blood. Answer each in your head, then reveal it and mark yourself honestly. I will carry on when you have marked them all." }
      ]
    },
    {
      title: "The Story",
      steps: [
        { target: { scene: "story", part: "cust1" }, action: "story:0", cue: "The cool box",
          say: "At the Oja Oba health tent the lid of the cool box opens on six bags: O positive, O negative, A negative, B positive, B negative and AB negative. The okada rider's card reads B, Rh negative." },
        { target: { scene: "story", part: "cust2" }, action: "story:1", cue: "Baba Sule's advice",
          say: "Baba Sule reaches for the AB bag. Take the AB, he says. It has both letters, so it suits everybody." },
        { target: { scene: "story", part: "cust1" }, action: "story:2", cue: "Chidi shrugs",
          say: "Chidi shrugs. Blood is blood, he says. Won't any bag do?" },
        { target: { scene: "story", part: "amaka" }, action: "story:3", cue: "Test first",
          say: "Dr Aisha stops them. The wrong bag can kill him faster than the crash, she says. We test first. Meanwhile Mama Bisi asks quietly whether her one hundred and sixty over one hundred is just tiredness." },
        { target: { scene: "story", part: "amaka" }, action: "story:4", cue: "To the typing tile",
          say: "At the UCH lab, the typing tile is ready: three sera, five samples. Let us find out which bag is safe." }
      ]
    },
    {
      title: "Wonder Wall",
      steps: [
        { target: "#wall-wonder", cue: "Pin your idea", wait: "note",
          say: "Before we test, pin your idea to the Wonder Wall: what could go wrong if the rider receives the wrong bag of blood?" }
      ]
    },
    {
      title: "Safe to give?",
      steps: [
        { target: "#abo-sort", cue: "Safe or unsafe",
          say: "First, a sorting game. For each card, decide: safe or unsafe? The first four cards are for a group A patient, the last four for a group AB patient. Remember the rule: look at the donor's antigens and the patient's antibodies." },
        { target: "#abo-sort", cue: "Your turn", wait: "sort",
          say: "Your turn. Sort all eight cards, then tap Check my sorting." }
      ]
    },
    {
      title: "The Typing Tile",
      steps: [
        { target: "#method-cards", action: "bench:reset", cue: "Four method cards",
          say: "Now the typing tile. Follow the four method cards: place the sera, add the sample and stir with fresh stirrers, rock for two minutes, then look for clumping. In a real class the teacher uses a commercial kit with screened samples, and nobody shares a lancet." },
        { target: { scene: "bench", part: "antiB" }, action: "bench:step:1", cue: "Three sera",
          say: "Step one: three drops of serum for the rider. Anti A is blue, anti B is yellow and anti D is clear. Each serum carries antibodies that grip one antigen." },
        { target: { scene: "bench", part: "stirrer" }, action: "bench:step:2", cue: "Sample and fresh stirrers",
          say: "Step two: a drop of the rider's blood in each well, and a fresh stirrer for every well. A used stirrer would carry serum from one well to the next." },
        { target: { scene: "bench", part: "timer" }, action: "bench:step:3", cue: "Rock for two minutes",
          say: "Step three: rock the tile and wait the full two minutes. Reading too soon can miss a weak clump." },
        { target: { scene: "bench", part: "wellB" }, action: "bench:step:4", cue: "The anti B well clumps",
          say: "Step four: read the tile. Only the anti B well has clumped, red specks in clear fluid, while anti A and anti D stay smooth. So the rider has antigen B and no antigen A and no D: group B, Rh negative." },
        { target: "#bench-stage", action: "bench:hl:none", cue: "Your turn", wait: "bench",
          say: "Your turn. Choose Donor 1, then run the four steps and read the tile. Do the same for Donors 2, 3 and 4. I will carry on when all five samples are read." },
        { target: "#results-table", cue: "Results and errors",
          say: "Look at your table. Donor 1, group O negative, is safe. Donor 2 is A, which the rider's anti A would clump. Donor 3 is B but Rh positive, which could sensitise him. Donor 4 is A B, and carries antigen A. Watch for errors: reading too soon gives a false negative, and one stirrer or a drying edge can give a false positive." }
      ]
    },
    {
      title: "Make Sense",
      steps: [
        { target: "#props-table", cue: "The ABO table",
          say: "Now make sense of it. Group A carries antigen A and has anti b. Group B carries antigen B and has anti a. Group A B carries both antigens and has no antibodies, so it receives from all four groups. Group O carries neither antigen and has both antibodies, so it gives to all four groups. O gives, A B receives." },
        { target: "#agglutination-rule", cue: "Agglutination",
          say: "If a donor's red cells carry an antigen that matches an antibody in the patient's plasma, the antibodies link the cells into clumps. The clumps can block small vessels and burst cells can damage the kidneys, which can be fatal. That is why hospitals type both people, mix samples to check, and screen donated blood for syphilis, H I V and hepatitis B and C. Blood is stored with an anticoagulant such as sodium citrate." },
        { target: "#rhesus-callout", cue: "Rhesus",
          say: "Rhesus. People whose red cells carry the D antigen are Rh positive. Rh negative people make anti D only after meeting Rh positive cells. If an Rh negative mother carries an Rh positive baby, baby cells can enter her blood at birth. In a later Rh positive pregnancy her anti D crosses the placenta and attacks the baby's red cells: haemolytic disease of the newborn. An anti D injection after each delivery prevents it." },
        { target: "#disorders-table", cue: "Eleven disorders",
          say: "Now the disorders of the circulation. Hypertension, atherosclerosis, heart attack, stroke, thrombosis, varicose veins, anaemia, sickle cell anaemia, leukaemia, haemophilia and a hole in the heart. For each, know a cause, a sign and a prevention. Less salt, exercise, no smoking, a healthy weight and regular checks protect the heart." },
        { target: "#pos-explorer", action: "pin:O:AB", cue: "Donor and patient explorer", wait: "pin",
          say: "Your turn. Tap three squares in the donor and patient grid, and try the Rhesus buttons. Watch the zoom to see the rule decide." }
      ]
    },
    {
      title: "Zoom",
      steps: [
        { target: "#zoom-stage", action: "zoom:mode:agglutination", cue: "Antibodies bridging cells",
          say: "Zoom in. Group B cells in anti B serum. The Y shaped antibodies grip antigen B on neighbouring cells and bridge them, until the cells pack into a clump. In the lower panel, a serum that does not match: the antibodies drift past and the cells stay free." },
        { target: { scene: "zoom", part: "mother" }, action: "zoom:mode:rhesus", cue: "Two pregnancies",
          say: "Now Rhesus. At the first birth, Rh positive baby cells leak into the Rh negative mother. Without an injection she makes anti D, and in the second pregnancy it crosses the placenta and the baby's cells clump. With an anti D injection after the first birth, the leaked cells are cleared and the second baby stays healthy." }
      ]
    },
    {
      title: "Apply",
      steps: [
        { target: ["#ex1", "#ex2", "#ex3", "#ex4"], action: "zoom:mode:agglutination", cue: "Worked examples",
          say: "Worked examples. A sample that clumps with anti A and anti D but not anti B is group A, Rh positive. For the rider, reject A negative and A B negative for antigen A, reject O positive and B positive for Rhesus, leaving B negative first and O negative second. Mama Bisi's reading is above the line on both numbers, and her pulse pressure is one sixty minus one hundred, sixty, against forty normally. The Rhesus pregnancy is the four steps we saw in the zoom." },
        { target: "#bridge-card", cue: "Close the case", wait: "bridge",
          say: "Back to Dr Aisha's whiteboard. Solve the three cases, then flip Baba Sule's seven wrong claims one by one." },
        { target: "#quiz-list", cue: "Quiz time", wait: "quiz",
          say: "Now the quiz. Twelve questions from WAEC, NECO and JAMB styles, plus two review questions from Lesson 6." }
      ]
    },
    {
      title: "Reflect",
      steps: [
        { target: "#reflect", cue: "Reflect and assignment",
          say: "To finish, rate yourself from one to four on each goal, then do the exit ticket and the blank page recall. Your assignment is Part A, the paper cross match and the family salt check, and Part B, the thirty mark paper. The unit is complete: a working circulation needs a healthy pump, sound vessels, the right pressure and the right blood. Well done." }
      ]
    }
  ]
};
