/* Lesson 02 · StudyNarrator choreography: The Heart Up Close (en-NG). 28 steps. */
window.NARRATION = {
  rate: 0.96,
  pitch: 1.01,

  waits: {
    note: {
      event: "kit:note", timeout: 120000,
      prompt: "Type your idea about the thick wall (or tap a seed note) and pin it to the Wonder Wall",
      react: function () { return "Pinned! Now let us see which side of the heart is which."; }
    },
    sort: {
      event: "l2:sort", timeout: 150000,
      prompt: "Sort all 10 cards into right, left or both, then tap Check my sorting",
      react: function (d) {
        if (!d || d.total == null) return "No problem. You can try the sort again later.";
        if (d.correct === d.total) return "Ten out of ten! You know your right side from your left side.";
        if (d.correct >= 8) return "Good work, " + d.correct + " out of " + d.total + ". Read the notes below for the cards that slipped.";
        return "You got " + d.correct + " out of " + d.total + ". Read the notes below. Remember, tricuspid has the R sound, T R I, for the right side.";
      }
    },
    bench: {
      event: "l2:bench-done", timeout: 240000,
      prompt: "Your turn! Cut the heart open, then measure all five walls twice",
      react: function (d) {
        var r = d && d.ratioLVRV != null ? d.ratioLVRV : 3.0;
        return "Well done! All five walls measured twice. The left ventricle is " + r.toFixed(1).replace(".", " point ") + " times thicker than the right ventricle.";
      }
    },
    pin: {
      event: "l2:pin", timeout: 120000,
      prompt: "Your turn! Tap the pins one by one to light each wall on the 3D section",
      filter: function (d) { return d && d.key === "lv"; },
      react: function () { return "The left ventricle pin: the longest trip, and the thickest wall. Wall thickness matches the job."; }
    },
    bridge: {
      event: "l2:bridge", timeout: 150000,
      prompt: "Your turn! Answer the three questions and give your verdict on Baba Sule's argument",
      react: function (d) {
        return d && d.correct
          ? "Case closed! It is the left ventricle, and in a front-view diagram it sits on your right, so Baba Sule mixed up the sides."
          : "Not quite, but look at the green rings. The thick wall with the aorta leaving it is the left ventricle.";
      }
    },
    quiz: {
      event: "kit:quiz-done", timeout: 600000,
      prompt: "Answer all the quiz questions, or press Next to skip",
      react: function (d) {
        if (!d) return "Quiz complete!";
        if (d.score >= d.total - 2) return "Excellent, " + d.score + " out of " + d.total + "! You have the heart up close.";
        if (d.score >= 9) return "Well done, " + d.score + " out of " + d.total + ". Read the explanations on the ones you missed.";
        return "You scored " + d.score + " out of " + d.total + ". Go back to the bench and the valve zoom, then try again.";
      }
    }
  },

  actions: {
    story: function (arg) { if (window.StudyScenes && StudyScenes.story) StudyScenes.story.beat(+arg); },
    open: function (arg) { var el = document.querySelector(arg); if (el && el.tagName === "DETAILS") el.open = true; },
    bench: function (arg, later) {
      var b = window.StudyScenes && StudyScenes.bench; if (!b) return;
      var p = String(arg).split(":");
      if (p[0] === "reset") b.reset();
      else if (p[0] === "cut") b.cut();
      else if (p[0] === "showcut") b.showCut();
      else if (p[0] === "tour") b.tour(p[1]);
      else if (p[0] === "cond") b.setCond(p[1]);
      else if (p[0] === "measure") { b.showCut(); b.measure(p[1]); }
    },
    zoom: function (arg) {
      var z = window.StudyScenes && StudyScenes.zoom; if (!z) return;
      var p = String(arg).split(":");
      if (p[0] === "mode") z.setMode(p[1]);
      else if (p[0] === "cusps") z.setCusps(+p[1]);
      else if (p[0] === "cut") z.cut(p[1] === "1");
      else if (p[0] === "open") z.open(+p[1]);
    },
    pin: function (arg) { if (window.L02 && L02.showPin) L02.showPin(+arg, true); },
    bridge: function (arg) { if (window.L02 && L02.bridge && arg === "solve") L02.bridge.solve(); }
  },

  script: [
    {
      title: "Welcome",
      steps: [
        { target: ".l-hero .display", cue: "Lesson 2 · The Heart Up Close", sparkle: true,
          say: "Welcome to Lesson 2 of the heart and blood circulation unit. Today we cut open a goat heart and measure it, to settle Baba Sule's argument." },
        { target: ".l-hero .question", cue: "Our guiding question",
          say: "Here is our guiding question. Baba Sule says the thick side is the right side. Who is right? By the end of this lesson you will name the four chambers and four valves, explain the wall thicknesses, and draw the heart to WAEC rules." }
      ]
    },
    {
      title: "Do Now",
      steps: [
        { target: "#donow-list", cue: "Your turn", wait: "donow",
          say: "Start with four quick Do Now cards from Lesson 1: why big bodies need a transport system. Answer each one in your head, then reveal it and mark yourself honestly. I will carry on when you have marked them all." }
      ]
    },
    {
      title: "The Story",
      steps: [
        { target: { scene: "story", part: "cust2" }, action: "story:0", cue: "Baba Sule's heart",
          say: "At the Oja Oba health-day tent, Baba Sule slaps a goat heart on the table. He says one side is thick like his thumb, and that is the right side, because right is strong." },
        { target: { scene: "story", part: "cust1" }, action: "story:1", cue: "Chidi turns it over",
          say: "Chidi turns the heart over and asks a very good question: how do you even know which side is which?" },
        { target: { scene: "story", part: "amaka" }, action: "story:2", cue: "Clues on the outside",
          say: "Dr Aisha points to the groove running down the front and the thick vessels at the top. These tell us which is which, she says, but we will cut it open properly." },
        { target: { scene: "story", part: "amaka" }, action: "story:3", cue: "The board in the lab",
          say: "In the lab at UCH, Dr Aisha draws a heart facing the class, and asks: why do the labels, right and left, look backwards on the board?" },
        { target: { scene: "story", part: "amaka" }, action: "story:4", cue: "To the bench",
          say: "Enough arguing. Let us measure. To the dissection bench, with a scalpel, a ruler and two readings for every wall." }
      ]
    },
    {
      title: "Wonder Wall",
      steps: [
        { target: "#wall-wonder", cue: "Pin your idea", wait: "note",
          say: "Before we cut, pin your idea to the Wonder Wall: why might one side of the heart need a thicker wall than the other?" }
      ]
    },
    {
      title: "Which side?",
      steps: [
        { target: "#side-sort", cue: "Right, left or both",
          say: "First, a sorting game. Put each card in the right bin: right side, left side, or both. Tap a card, then tap a bin." },
        { target: "#side-sort", cue: "Your turn", wait: "sort",
          say: "Your turn. Sort all ten cards, then tap Check my sorting." }
      ]
    },
    {
      title: "The Dissection",
      steps: [
        { target: "#method-cards", action: "bench:reset", cue: "Four method cards",
          say: "Now the dissection. Wear gloves, keep the blade facing away from you, and cut on the dissecting board. Follow the four method cards: lay the heart front side up, cut from apex to base, find the inside parts, then measure each wall twice." },
        { target: "#bench-stage", action: "bench:cut", cue: "Cut from apex to base",
          say: "Watch the scalpel. It cuts from the apex, the pointed tip, upwards through both ventricles, and the section opens. The heart faces you, so the animal's right side is on your left." },
        { target: { scene: "bench", part: "chordae" }, action: "bench:tour:chordae", cue: "Septum, cords and valves",
          say: "Inside, find the septum, the thick muscle partition that keeps oxygen rich and oxygen poor blood apart. Then the chordae tendineae, tough cords tied to the valve flaps. They end at the papillary muscles on the ventricle wall. Notice also the three flaps of the tricuspid valve on the right, and the two flaps of the bicuspid valve on the left." },
        { target: { scene: "bench", part: "lv" }, action: "bench:measure:lv", cue: "Left ventricle wall",
          say: "Now measure. Tap the left ventricle and see its wall, about twelve millimetres. Measure at mid height, with your eye level with the ruler, and take every wall twice." },
        { target: "#bench-stage", cue: "Your turn", wait: "bench",
          say: "Your turn. Measure the right atrium, left atrium, right ventricle, left ventricle and the septum, two readings each. I will carry on when all five are done." },
        { target: "#results-table", cue: "Means and the ratio",
          say: "Look at your table. The right ventricle mean is four point zero millimetres and the left ventricle mean is twelve point zero millimetres. Twelve divided by four is three: the left wall is three times thicker." },
        { target: "#expected", action: "open:#expected", cue: "Expected readings",
          say: "Compare with the expected readings. And remember the sources of error: a slanting cut reads too high, a papillary muscle in the way reads too high, and a heart that has shrunk in the fridge reads too low." }
      ]
    },
    {
      title: "Make Sense",
      steps: [
        { target: "#props-table", cue: "Four chambers",
          say: "Now make sense of it. The heart lies between the lungs, wrapped in the pericardium, with thick myocardium muscle and a smooth endocardium lining. The right atrium receives oxygen poor blood from the two venae cavae and sends it to the right ventricle. The right ventricle sends it to the lungs. The left atrium receives oxygen rich blood from the four pulmonary veins, and the left ventricle sends it to the whole body." },
        { target: "#why-walls", cue: "Thickness matches the job",
          say: "So who is right? A wall matches its job. The atria squeeze blood only a few centimetres. The right ventricle pushes it a short way to the lungs. The left ventricle must drive blood from scalp to toes, so it has the most muscle. The thick side is the left, not the right." },
        { target: "#def-valves", cue: "Four valves",
          say: "Four valves keep blood moving one way. Tricuspid on the right, with the R sound, bicuspid or mitral on the left, then a semilunar valve at the base of the pulmonary artery and another at the base of the aorta." },
        { target: "#pos-explorer", action: "pin:0", cue: "Wall explorer", wait: "pin",
          say: "Your turn. Tap the pins in the wall explorer, and watch each wall light up on the 3D section. Finish on the left ventricle." }
      ]
    },
    {
      title: "Valve Zoom",
      steps: [
        { target: "#zoom-stage", action: "zoom:mode:valve", cue: "One valve",
          say: "Zoom in on one atrioventricular valve. Slide it open and shut, and compare three flaps with two flaps. The cords and papillary muscles hold the flaps while the ventricle squeezes." },
        { target: { scene: "zoom", part: "chordae" }, action: "zoom:cut:1", cue: "Cut the chordae",
          say: "Now Dr Aisha cuts the chordae tendineae. The flaps flip backwards into the atrium and blood leaks back. That is why the cords matter." }
      ]
    },
    {
      title: "Apply",
      steps: [
        { target: ["#ex1", "#ex2", "#ex3"], action: "zoom:cut:0", cue: "Ratio and magnification",
          say: "Worked examples. The mean left ventricle wall is twelve point zero millimetres and the right is four point zero, so the ratio is three. Chidi's drawing is one hundred and twenty millimetres, the heart is eight centimetres, so magnification is twelve divided by eight, times one point five. Real size is the drawing size divided by the magnification, so eighteen millimetres becomes one point two centimetres." },
        { target: "#bridge-card", cue: "Settle the argument", wait: "bridge",
          say: "Back to the tent. Answer the three questions: which wall is thick, which vessel leaves it, and where it appears on a diagram facing you." },
        { target: "#quiz-list", cue: "Quiz time", wait: "quiz",
          say: "Now the quiz. Twelve questions from WAEC, NECO and JAMB styles, plus two review questions from Lesson 1." }
      ]
    },
    {
      title: "Reflect",
      steps: [
        { target: "#reflect", cue: "Reflect and assignment",
          say: "To finish, rate yourself from one to four on each goal, then do the exit ticket and the blank page recall. Your assignment is Part A, the kitchen heart check, and Part B, the thirty mark paper. Well done today." }
      ]
    }
  ]
};
