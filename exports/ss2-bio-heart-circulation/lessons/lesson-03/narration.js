/* Lesson 03 · StudyNarrator choreography: The Double Circuit (en-NG). 27 steps. */
window.NARRATION = {
  rate: 0.96,
  pitch: 1.01,

  waits: {
    note: {
      event: "kit:note", timeout: 120000,
      prompt: "Type your idea about the drip route (or tap a seed note) and pin it to the Wonder Wall",
      react: function () { return "Pinned! Now let us put the whole journey in order."; }
    },
    sort: {
      event: "l3:sort", timeout: 180000,
      prompt: "Build the journey in order, leave out the card that does not belong, then tap Check",
      react: function (d) {
        if (!d || d.total == null) return "No problem. You can try the sorting again later.";
        if (d.correct === d.total) return "Perfect! Thirteen steps in the right order, and you left out the hepatic portal vein.";
        if (d.correct >= 10) return "Good work, " + d.correct + " out of " + d.total + ". Study the correct order below the cards.";
        return "You got " + d.correct + " out of " + d.total + ". Read the correct order below. Remember: right side, then lungs, then left side.";
      }
    },
    bench: {
      event: "l3:bench-done", timeout: 300000,
      prompt: "Your turn! Trace three routes, from the presets or with Free trace",
      react: function () { return "Well done! Three routes traced. Notice that every one of them passed through the lungs."; }
    },
    pin: {
      event: "l3:pin", timeout: 120000,
      prompt: "Your turn! Tap the organ pins to light each artery and vein on the 3D body",
      filter: function (d) { return d && d.key === "gut"; },
      react: function () { return "The gut pin: its blood leaves by the hepatic portal vein and goes to the liver, not to the heart."; }
    },
    bridge: {
      event: "l3:bridge", timeout: 180000,
      prompt: "Your turn! Answer the three questions about the rider's drip and give your verdict",
      react: function (d) {
        return d && d.correct
          ? "Case closed! The drip enters the right atrium, crosses the lungs, and only then leaves by the carotid artery to the brain."
          : "Not quite. Veins carry blood towards the heart. Look at the green rings for the right answers.";
      }
    },
    quiz: {
      event: "kit:quiz-done", timeout: 600000,
      prompt: "Answer all the quiz questions, or press Next to skip",
      react: function (d) {
        if (!d) return "Quiz complete!";
        if (d.score >= d.total - 2) return "Excellent, " + d.score + " out of " + d.total + "! You can trace the double circuit.";
        if (d.score >= 9) return "Well done, " + d.score + " out of " + d.total + ". Read the explanations on the ones you missed.";
        return "You scored " + d.score + " out of " + d.total + ". Go back to the route tracer, then try again.";
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
      else if (p[0] === "trace") b.trace(p[1]);
      else if (p[0] === "mode") b.setMode(p[1]);
      else if (p[0] === "hl") b.highlight(p[1] ? p[1].split(",") : null);
    },
    zoom: function (arg) {
      var z = window.StudyScenes && StudyScenes.zoom; if (!z) return;
      var p = String(arg).split(":");
      if (p[0] === "mode") z.setMode(p[1]);
      else if (p[0] === "block") z.block(p[1] === "1");
      else if (p[0] === "store") z.store(+p[1]);
      else if (p[0] === "reset") z.reset();
    },
    pin: function (arg) { if (window.L03 && L03.showPin) L03.showPin(+arg, true); },
    bridge: function (arg) {
      if (!window.L03 || !L03.bridge) return;
      if (arg === "solve") L03.bridge.solve(); else if (arg === "trace") L03.bridge.trace();
    }
  },

  script: [
    {
      title: "Welcome",
      steps: [
        { target: ".l-hero .display", cue: "Lesson 3 · The Double Circuit", sparkle: true,
          say: "Welcome to Lesson 3 of the heart and blood circulation unit. Today we trace blood all the way around the body, and find out how the okada rider's drip reaches his brain." },
        { target: ".l-hero .question", cue: "Our guiding question",
          say: "Here is our guiding question. How does the donated blood reach his brain, and why does food from the gut go to the liver first? By the end you will name every chamber, valve and vessel on the route." }
      ]
    },
    {
      title: "Do Now",
      steps: [
        { target: "#donow-list", cue: "Your turn", wait: "donow",
          say: "Start with four quick Do Now cards from Lessons 1 and 2. Answer each in your head, reveal it, and mark yourself honestly. I will carry on when you have marked them all." }
      ]
    },
    {
      title: "The Story",
      steps: [
        { target: { scene: "story", part: "cust1" }, action: "story:0", cue: "The rider on the mat",
          say: "At the Oja Oba health tent, the okada rider is laid on a mat. The nurse puts a drip line into a vein in his forearm." },
        { target: { scene: "story", part: "cust1" }, action: "story:1", cue: "Chidi's question",
          say: "Chidi says the arm is close to the head. Will the new blood reach his brain in one second?" },
        { target: { scene: "story", part: "cust2" }, action: "story:2", cue: "Baba Sule's answer",
          say: "Baba Sule laughs. Of course! Vein to brain, straight up! We will test that claim." },
        { target: { scene: "story", part: "amaka" }, action: "story:3", cue: "The glowing body",
          say: "In the lab at UCH, Dr Aisha traces the route on a glowing 3D body. It has a much longer journey, she says, and it must pass one organ you have forgotten." },
        { target: { scene: "story", part: "amaka" }, action: "story:4", cue: "To the route tracer",
          say: "Enough talk. Let us trace the route ourselves." }
      ]
    },
    {
      title: "Wonder Wall",
      steps: [
        { target: "#wall-wonder", cue: "Pin your idea", wait: "note",
          say: "Pin your idea. Starting in a vein of the arm, which organs must blood pass before it reaches the brain?" }
      ]
    },
    {
      title: "Put it in order",
      steps: [
        { target: "#seq-sort", cue: "Build the journey",
          say: "First, build the journey. Tap the cards in order, from the venae cavae to the aorta. One card does not belong in the heart's own double loop, so leave it out." },
        { target: "#seq-sort", cue: "Your turn", wait: "sort",
          say: "Your turn. Place all thirteen steps, then tap Check." }
      ]
    },
    {
      title: "The Route Tracer",
      steps: [
        { target: "#method-cards", action: "bench:reset", cue: "Four method cards",
          say: "Now the route tracer. Follow the four method cards: pick a start and an end organ, tap each vessel, chamber and valve in order, watch the red and blue tracer, then record the route and count the valves." },
        { target: { scene: "bench", part: "bench" }, action: "bench:trace:armBrain", cue: "Arm to brain",
          say: "Watch the arm to brain route. The body faces you, so the patient's right side is on your left. The drip enters a forearm vein, climbs to the superior vena cava and arrives in the right atrium." },
        { target: { scene: "bench", part: "lungs" }, action: "bench:hl:lungs,pulmonaryArtery,pulmonaryVeins", cue: "The lungs, and the tracer turns red",
          say: "Through the tricuspid valve, the right ventricle, the pulmonary valve and the pulmonary artery, the blood reaches the lungs. Look: the tracer turns red there, because the lung capillaries swap carbon dioxide for oxygen." },
        { target: { scene: "bench", part: "carotid" }, action: "bench:hl:carotid,brain", cue: "Out to the brain",
          say: "Back to the left atrium, through the bicuspid valve, the left ventricle, the aortic valve, up the aorta and the carotid artery to the brain. Four heart valves in all." },
        { target: "#bench-stage", cue: "Your turn", wait: "bench",
          say: "Your turn. Trace three routes. Use the presets, or try Free trace and tap each part in order. The Hint button helps if you are stuck. I will carry on after three routes." },
        { target: "#results-table", cue: "Valves and lungs",
          say: "Look at your table. Every route passed four valves and went through the lungs, except lungs to heart muscle, which starts there and passes only two valves." },
        { target: "#expected", action: "open:#expected", cue: "Expected routes",
          say: "Compare with the expected routes, then try the five locked analysis questions. Why must every body to body trip pass through the lungs? Think about it before you unlock the answers." }
      ]
    },
    {
      title: "Make Sense",
      steps: [
        { target: "#two-loops", cue: "Two loops, two pumps",
          say: "Now make sense of it. One complete circuit passes through the heart twice. The pulmonary loop runs from the right ventricle to the lungs and back to the left atrium. The systemic loop runs from the left ventricle to every organ and back to the right atrium." },
        { target: "#vessel-chain", cue: "Within the body",
          say: "Within the body, blood goes heart, arteries, arterioles, capillaries, venules, veins, and back to the heart." },
        { target: "#portal-box", cue: "The hepatic portal system",
          say: "Blood from the gut is full of absorbed food and any swallowed poisons. It travels in the hepatic portal vein to the liver. There, extra glucose is stored as glycogen, and poisons are made harmless. Any vein that links two capillary beds is a portal vein." },
        { target: "#coronary-box", cue: "Feeding the heart itself",
          say: "The heart muscle has its own supply. The coronary arteries branch from the aorta just beyond its valve. If one is blocked, the muscle beyond it dies. That is a heart attack." },
        { target: "#props-table", cue: "Named vessels",
          say: "Learn the pairs: lungs, pulmonary artery in and pulmonary veins out; brain, carotid in and jugular out; arm, subclavian; kidney, renal; leg, femoral; liver, hepatic artery and portal vein in, hepatic vein out." },
        { target: "#pos-explorer", action: "pin:0", cue: "Organ explorer", wait: "pin",
          say: "Your turn. Tap the organ pins and watch each artery and vein light up on the 3D body. Finish on the gut." }
      ]
    },
    {
      title: "Zoom",
      steps: [
        { target: "#zoom-stage", action: "zoom:mode:portal", cue: "Gut to liver",
          say: "Zoom in on the portal system. Gut capillaries drain into the hepatic portal vein, which ends in the liver. See the glucose spheres turn into glycogen granules on the way." },
        { target: "#zoom-stage", action: "zoom:mode:coronary", cue: "Block the artery",
          say: "Now the coronary view. Press Block the artery, and the muscle beyond the clot greys out as it starves of oxygen. That is why a heart attack is an emergency." }
      ]
    },
    {
      title: "Apply",
      steps: [
        { target: ["#ex1", "#ex2", "#ex3", "#ex4"], action: "zoom:reset", cue: "Four worked routes",
          say: "Worked examples. Arm to brain, four valves and the lungs. Ileum to a leg muscle, the liver first, then the lungs. Liver to kidney, four valves. And lungs to heart muscle, only two valves, because the right side is not involved." },
        { target: "#bridge-card", action: "bridge:trace", cue: "Settle the argument", wait: "bridge",
          say: "Back to the tent. Trace the rider's drip, then answer the three questions to settle Baba Sule's argument." },
        { target: "#quiz-list", cue: "Quiz time", wait: "quiz",
          say: "Now the quiz. Twelve questions in WAEC, NECO and JAMB style, plus two review questions." }
      ]
    },
    {
      title: "Reflect",
      steps: [
        { target: "#reflect", cue: "Reflect and assignment",
          say: "To finish, rate yourself from one to four on each goal, then do the exit ticket and the blank page recall. Your assignment is Part A and Part B from the questions for Lesson 3. Well done today." }
      ]
    }
  ]
};
