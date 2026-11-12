/* Lesson 03 · StudyNarrator choreography: SHM as a Circle's Shadow (en-NG). 30 steps.
   Spotlights: story people/props, bench parts lump, shadow, a-arrow, v-arrow, zoom traces and g line.
   narrator.js has no built-in story/open/bench actions here; they are defined below. */
window.NARRATION = {
  rate: 0.96,
  pitch: 1.01,

  waits: {
    donow: {
      event: "kit:donow", timeout: 120000,
      prompt: "Your turn! Answer the four Do Now cards, then mark yourself",
      react: function () { return "Good. Now let us go back to Ridge Road and watch Dayo's crates."; }
    },
    note: {
      event: "kit:note", timeout: 120000,
      prompt: "Your turn! Pin your idea: where is the carrier fastest, and where is its acceleration biggest?",
      react: function () { return "Pinned. Let us sort what happens at the centre and what happens at the ends."; }
    },
    sort: {
      event: "l3:sort", timeout: 180000,
      prompt: "Your turn! Drag all ten cards into Centre, Ends or Nowhere, then tap Check",
      react: function (d) {
        if (!d || d.total == null) return "No problem, you can try the sort again later.";
        if (d.correct === d.total) return "Perfect! Ten out of ten.";
        return "You got " + d.correct + " out of " + d.total + ". Read the notes, then let us test it on the wheel.";
      }
    },
    bench: {
      event: "l3:bench-done", timeout: 300000,
      prompt: "Your turn! Press Step thirty degrees until you have recorded 0°, 30°, 60° and 90°",
      react: function () { return "Well done. The shadow was fastest at zero degrees, and its acceleration was biggest at ninety degrees, where it stopped."; }
    },
    pin: {
      event: "l3:pin", timeout: 120000,
      prompt: "Your turn! Tap the phase pins and compare x, v and a",
      filter: function (d) { return d && d.deg === 90; },
      react: function () { return "At ninety degrees the shadow is at the end. The velocity is zero, but the acceleration is at its greatest, omega squared A."; }
    },
    zoom: {
      event: "l3:zoom", timeout: 180000,
      prompt: "Your turn! On the okada circle, drag A up until a max crosses the g line",
      filter: function (d) { return d && d.mode === "okada" && d.lift; },
      react: function (d) { return "There! At about six point two centimetres, a max passes g, and the crates would lift off."; }
    },
    bridge: {
      event: "l3:bridge", timeout: 180000,
      prompt: "Your turn! Try A = 3 cm and A = 8 cm, answer the three questions, then give your verdict",
      react: function (d) {
        return d && d.correct
          ? "Exactly. The crates fly at the top, where the speed is zero but the downward acceleration is greatest. And they need a bounce of at least six point two centimetres."
          : "Not quite. Remember, only gravity pulls the crate down. It leaves at the top, once omega squared A is bigger than g.";
      }
    },
    quiz: {
      event: "kit:quiz-done", timeout: 600000,
      prompt: "Your turn! Answer the quiz questions, or press Next to skip",
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
      else if (p[0] === "spin") b.spin(true);
      else if (p[0] === "angle") b.setAngle(+p[1]);
      else if (p[0] === "graphs") b.graphs(p[1] !== "off");
    },
    zoom: function (arg) {
      var z = window.StudyScenes && StudyScenes.zoom; if (!z) return;
      var p = String(arg).split(":");
      if (p[0] === "mode") z.setMode(p[1]);
      else if (p[0] === "A") z.setA(+p[1], true);
      else if (p[0] === "reset") z.reset();
    },
    pin: function (arg) { if (window.L03 && L03.showPin) L03.showPin(+arg, true); },
    video: function () { var v = document.getElementById("lesson-video"); if (v && v.scrollIntoView) v.scrollIntoView({ block: "center" }); }
  },

  script: [
    {
      title: "Welcome",
      steps: [
        { target: ".l-hero .display", cue: "Lesson 3 · SHM as a circle's shadow", sparkle: true,
          say: "Welcome to Lesson 3 of simple harmonic motion. Today we find out exactly when the crates leave Dayo's carrier, using the shadow of a turning wheel." },
        { target: ".l-hero .question", cue: "Our guiding question",
          say: "Here is our question. When exactly do the crates leave the carrier? Is it where the bike moves fastest, or somewhere else?" }
      ]
    },
    {
      title: "Do Now",
      steps: [
        { target: "#donow-list", cue: "Four quick cards", wait: "donow",
          say: "Start with four Do Now cards on circular motion, the SHM condition, omega and radians. Answer each in your head, reveal it, and mark yourself." }
      ]
    },
    {
      title: "The Story",
      steps: [
        { target: { scene: "story", part: "dayo" }, action: "story:0", cue: "Dayo on Ridge Road",
          say: "On Ridge Road near Ogbomoso, Dayo rides over the concrete ridges at a moderate pace. The carrier pumps up and down. The crates rattle, but today they stay on." },
        { target: { scene: "story", part: "zainab" }, action: "story:1", cue: "Zainab's observation",
          say: "Zainab has been watching closely. The crates stay on while the carrier rises, she says. They only jump at the top, just as it starts down." },
        { target: { scene: "story", part: "tunde" }, action: "story:2", cue: "Tunde's idea",
          say: "Tunde disagrees. They jump because that is where the bike is moving fastest. Hold on to that idea. We will test it." },
        { target: { scene: "story", part: "mud" }, action: "story:3", cue: "The mud's shadow",
          say: "Mrs Okafor puts the okada on its centre stand and spins the rear wheel. A lump of red mud goes round, and the midday sun throws its shadow on the ground. Watch the shadow slide to and fro, exactly like the bounce." },
        { target: { scene: "story", part: "okafor" }, action: "story:4", cue: "The top of the bounce",
          say: "At the top of the bounce, she says, the carrier is barely moving, but it is accelerating downwards harder than anywhere else. If that acceleration beats g, the carrier falls away faster than the crate can." }
      ]
    },
    {
      title: "Wonder Wall",
      steps: [
        { target: "#wall-wonder", cue: "Pin your idea", wait: "note",
          say: "Where in the bounce is the carrier moving fastest, and where is its acceleration biggest? Same place, or different? Pin your idea on the Wonder Wall." }
      ]
    },
    {
      title: "Sort Game",
      steps: [
        { target: "#shm-sort", cue: "Centre, ends or nowhere?", wait: "sort",
          say: "Sort ten statements. Does each one happen at the centre, at the ends, or nowhere in simple harmonic motion? Drag each card, then tap Check." }
      ]
    },
    {
      title: "Virtual Lab",
      steps: [
        { target: "#method-cards", action: "bench:reset", cue: "Four method cards",
          say: "Now the wheel and shadow bench. The wheel has radius A equal to zero point three zero metres and period two seconds, so omega is pi radians per second." },
        { target: { scene: "bench", part: "shadow" }, action: "bench:spin", cue: "The lump and its shadow",
          say: "The mud lump goes round at a steady rate. Now look only at its shadow on the ground. It slides fast through the middle, slows down, stops at each end, and comes back. That is simple harmonic motion." },
        { target: { scene: "bench", part: "a-arrow" }, action: "bench:angle:60", cue: "a always points to O",
          say: "The amber arrow is the acceleration. Wherever the shadow is, it points back to the centre O. That is the minus sign in a equals minus omega squared x." },
        { target: "#bench-stage", action: "bench:angle:0", cue: "Your turn", wait: "bench",
          say: "Your turn. Press Step thirty degrees to pause at zero, thirty, sixty and ninety degrees. Each one goes into the table. I will carry on when all four are in." },
        { target: { scene: "bench", part: "trace-x" }, action: "bench:graphs:on", cue: "Three time-graphs",
          say: "Now the graphs. x against t is a sine curve. v against t is a cosine, a quarter cycle ahead, peaking where x is zero. And a against t is the upside-down copy of x." },
        { target: "#expected", action: "open:#expected", cue: "Expected results",
          say: "Compare your table with the expected values. Notice that a over x is minus nine point eight seven at every angle. That is minus omega squared. Then try the five locked analysis questions." }
      ]
    },
    {
      title: "Make Sense",
      steps: [
        { target: "#movement-break", cue: "Movement break",
          say: "Forty-five minutes! Time for the shadow dance. One person walks a circle; a partner on the wall line copies only their side-to-side position. Then sit down." },
        { target: ["#lesson-video", "#concepts h2"], action: "video", cue: "Explainer video",
          say: "If your lesson has the explainer video, watch it now. It shows the circle's shadow, where v and a peak, and the lift-off rule, step by step." },
        { target: "#ref-circle", cue: "The reference circle",
          say: "Here is the big idea. A point going round a circle of radius A at steady omega casts a shadow on a diameter that moves in simple harmonic motion, with amplitude A and the same omega. So x equals A sine omega t." },
        { target: "#eq-xva", cue: "The four equations",
          say: "Learn these. v equals omega root A squared minus x squared, so v max is omega A at the centre. a equals minus omega squared x, so a max is omega squared A at the ends. Always use radians for omega t." },
        { target: "#lift-rule", cue: "The lift-off rule", sparkle: true,
          say: "Now the lift-off rule. The carrier can push the crate up, but it cannot pull it down. Only gravity pulls the crate down. So if the carrier accelerates downwards faster than g, at the top of the bounce, the crate is left behind." },
        { target: "#pos-explorer", action: "pin:1", cue: "Position Explorer", wait: "pin",
          say: "Your turn. Tap the phase pins and compare x, v and a. Find the pin where the speed is zero and the acceleration is biggest." }
      ]
    },
    {
      title: "Zoom",
      steps: [
        { target: { scene: "zoom", part: "cursor" }, action: "zoom:mode:lab", cue: "Circle and traces",
          say: "In the zoom, the reference circle is on the left and the three traces on the right. The cursor links them, so you can see the shadow, its velocity and its acceleration at the same instant." },
        { target: { scene: "zoom", part: "g-line" }, action: "zoom:mode:okada", cue: "The okada and the g line",
          say: "Switch to the okada numbers. Omega is about twelve point six radians per second. The dashed line on the acceleration trace is g, nine point eight metres per second squared." },
        { target: "#zoom-stage", cue: "Your turn", wait: "zoom",
          say: "Your turn. Drag A up from two centimetres. Watch the acceleration peak grow until it crosses the g line." }
      ]
    },
    {
      title: "Worked Examples",
      steps: [
        { target: ["#ex1", "#ex2", "#ex3", "#ex4"], action: "zoom:A:3", cue: "Four worked examples",
          say: "Four worked examples. Speed and acceleration at a point, displacement at a time with the calculator in radians, a gentle three centimetre bounce, and the threshold A equals g over omega squared, six point two centimetres." }
      ]
    },
    {
      title: "Solving the Mystery",
      steps: [
        { target: "#bridge-card", cue: "Do the crates fly?", wait: "bridge",
          say: "Back to Tunde's claim. Try A equal to three centimetres and eight centimetres in the zoom, answer the three questions, and give your verdict." },
        { target: "#big-idea", cue: "The big idea", sparkle: true,
          say: "The big idea. In simple harmonic motion, speed peaks at the centre, omega A, and acceleration peaks at the ends, omega squared A. Something on Ridge Road must be pumping the bounce past six point two centimetres." }
      ]
    },
    {
      title: "Quiz & Reflection",
      steps: [
        { target: "#quiz-list", cue: "Quiz time", wait: "quiz",
          say: "Now the quiz. Twelve exam-style questions, plus two review questions from earlier lessons." },
        { target: "#assignment", cue: "Assignment",
          say: "Finish with the exit ticket and the blank page recall. For homework, do the bottle cap shadow investigation and the thirty mark paper. Each model answer unlocks after you try. Well done today!" }
      ]
    }
  ]
};
