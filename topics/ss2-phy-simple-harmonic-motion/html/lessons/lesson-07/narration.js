/* Lesson 07 · StudyNarrator choreography: Forced Vibration and Resonance (en-NG voice ranked first by narrator.js).
   30 steps in 11 chapters. Symbols are spelled out for the voice ("f equals v over d", "f nought",
   "omega squared A", "kilometres per hour"). Every wait shows "Your turn!". */
window.NARRATION = {
  rate: 0.96,
  pitch: 1.01,

  waits: {
    note: {
      event: "kit:note", timeout: 120000,
      prompt: "Your turn! Pin your prediction of the dangerous speed to the Wonder Wall",
      react: function () { return "Pinned! Keep your prediction in mind. We will test it on the bench."; }
    },
    sort: {
      event: "l7:sort", timeout: 180000,
      prompt: "Your turn! Sort all ten cards into useful or harmful, then tap Check",
      react: function (d) {
        if (!d || d.total == null) return "No problem, you can try the sort again later.";
        if (d.correct === d.total) return "Perfect, all ten right! The same physics can help us or hurt us.";
        return "You got " + d.correct + " out of " + d.total + ". Read the reasons below each card.";
      }
    },
    bench: {
      event: "l7:bench-done", timeout: 420000,
      prompt: "Your turn! Run Barton's pendulums to the steady state, then sweep the ridge rig from 10 to 30 kilometres per hour",
      react: function () { return "Well done! The equal-length cone, and the okada at eighteen kilometres per hour: both are driven at their own natural frequency. That is resonance."; }
    },
    pin: {
      event: "l7:pin", timeout: 120000,
      prompt: "Your turn! Tap a few speed pins and compare the amplitude with the threshold",
      react: function (d) {
        if (d && d.lift) return "Eighteen kilometres per hour: f equals f nought, and the bounce passes the threshold. Lift-off!";
        return "See how the forcing frequency changes with speed, and how far it is from f nought.";
      }
    },
    zoom: {
      event: "l7:zoom", timeout: 120000,
      prompt: "Your turn! Drag the dot or move the damping slider on the resonance curve",
      react: function () { return "Good. Damping squashes the peak; extra load slides it to a lower frequency."; }
    },
    bridge: {
      event: "l7:bridge", timeout: 240000,
      prompt: "Your turn! Tap the test rides, answer the three questions and give your verdict",
      react: function (d) {
        return d && d.correct
          ? "Case closed! Eighteen kilometres per hour is resonance. Replace the shock absorber, and ride slowly over the ridges until then."
          : "Not quite. The danger is a frequency match, not speed itself. Check the green answers and read the verdict.";
      }
    },
    quiz: {
      event: "kit:quiz-done", timeout: 600000,
      prompt: "Your turn! Answer all the quiz questions, or press Next to skip",
      react: function (d) {
        if (!d) return "Quiz complete!";
        if (d.score >= d.total - 2) return "Excellent, " + d.score + " out of " + d.total + "! You have mastered resonance.";
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
      else if (p[0] === "start") b.startBarton(p[1] ? +p[1] : null);
      else if (p[0] === "ride") b.ride(+p[1], { mass: p[2] ? +p[2] : 200, leak: p[3] !== "healthy" });
      else if (p[0] === "sweep") b.sweep();
      else if (p[0] === "hl") b.highlight(p[1] || null);
      else if (p[0] === "reset") b.reset();
    },
    zoom: function (arg) {
      var z = window.StudyScenes && StudyScenes.zoom; if (!z) return;
      var p = String(arg).split(":");
      if (p[0] === "mode") z.setMode(p[1]);
      else if (p[0] === "speed") z.setSpeed(+p[1]);
    },
    pin: function (arg) { if (window.L07 && L07.showPin) L07.showPin(+arg, true); },
    bridge: function (arg) { if (window.L07 && L07.runBridge) L07.runBridge(arg); },
    video: function () {
      var f = document.querySelector("#lesson-video");
      if (f && f.scrollIntoView) f.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  },

  script: [
    {
      title: "Welcome",
      steps: [
        { target: ".l-hero .display", cue: "Lesson 7 · Resonance", sparkle: true,
          say: "Welcome to Lesson 7, the finale of our unit. Today we finally solve the case of the cracked crates of Ridge Road." },
        { target: ".l-hero .question", cue: "Our guiding question",
          say: "Here is our question. Why does exactly eighteen kilometres per hour over the ridges cause disaster, when thirty kilometres per hour is smooth?" }
      ]
    },
    {
      title: "Do Now",
      steps: [
        { target: "#donow-list", cue: "Your turn", wait: "donow",
          say: "First, four Do Now cards from earlier lessons: the okada's natural frequency, load, the lift-off rule and damping. Answer from memory, reveal, and mark yourself honestly." }
      ]
    },
    {
      title: "The Story",
      steps: [
        { target: { scene: "story", part: "dayo" }, action: "story:0", cue: "About 10 km/h",
          say: "Dayo rides over the concrete ridges at about ten kilometres per hour. The carrier jolts at every ridge, small and untidy. The crates stay put." },
        { target: { scene: "story", part: "dayo" }, action: "story:1", cue: "About 30 km/h",
          say: "Now about thirty kilometres per hour. The ridges blur, and the back of the okada hardly moves. Still fine." },
        { target: { scene: "story", part: "crate" }, action: "story:2", cue: "18 km/h · crack!",
          say: "Now eighteen kilometres per hour. Each ridge arrives just as the last bounce comes back. The rear pumps higher and higher, and a crate lifts off and cracks." },
        { target: { scene: "story", part: "tunde" }, action: "story:3", cue: "Faster is worse?",
          say: "Tunde scratches his head. So it is not faster is worse after all. Thirty was smooth, eighteen was a disaster." },
        { target: { scene: "story", part: "cone-3" }, action: "story:4", cue: "Barton's pendulums",
          say: "In the lab, Mrs Okafor swings a heavy pendulum on a taut cord. Only the paper cone with the same length swings wide. Pushes that arrive at a system's own rhythm add up. That is resonance." },
        { target: { scene: "story", part: "ramatu" }, action: "story:5", cue: "The verdict",
          say: "Hajia Ramatu wants answers. Tell Dayo the speed to avoid, and what to fix. By the end of this lesson, you will." }
      ]
    },
    {
      title: "Wonder Wall",
      steps: [
        { target: "#wall-wonder", cue: "Predict first", wait: "note",
          say: "Predict before we test. The ridges are two point five metres apart, and the okada bounces naturally at two hertz. What speed is dangerous? Pin your idea." }
      ]
    },
    {
      title: "Sort Game",
      steps: [
        { target: "#l07-sort", cue: "Useful or harmful?", wait: "sort",
          say: "Resonance is not always bad. Sort ten examples into useful and harmful resonance. A radio, a talking drum, a washing machine, and Dayo's crates. Place all ten, then tap Check." }
      ]
    },
    {
      title: "Virtual Lab",
      steps: [
        { target: "#method-cards", action: "bench:mode:barton", cue: "Four method cards",
          say: "Now the bench. Follow the four method cards: Barton's pendulums first, then the ridge rig." },
        { target: { scene: "bench", part: "driver" }, action: "bench:start:0.60", cue: "The heavy driver",
          say: "This heavy bob is the driver, zero point six zero metres long. Its period is one point five five seconds, so its frequency is zero point six four hertz. It pushes every cone through the taut cord. Watch: the cone with the same length, cone three, swings widest once the motion settles." },
        { target: { scene: "bench", part: "rear-shock" }, action: "bench:ride:18", cue: "The leaking shock",
          say: "Now the ridge rig. Two hundred kilograms on the okada, with the leaking rear shock absorber. At eighteen kilometres per hour the ridges push at two hertz: the bounce grows to ten point zero centimetres, more than the six point two centimetre lift-off threshold." },
        { target: "#bench-stage", cue: "Your turn", wait: "bench",
          say: "Your turn. Run Barton's pendulums until the steady state, then tap Sweep, or ride each speed yourself from ten to thirty kilometres per hour. I will carry on when both are done." },
        { target: "#graph-card", action: "open:#expected", cue: "The resonance curve",
          say: "Look at the graph. The amplitude rises slowly, shoots up to a sharp peak at eighteen kilometres per hour, then falls away. Above the dashed curve, the crates lift off. The teal curve, the healthy damper, never comes close." }
      ]
    },
    {
      title: "Make Sense",
      steps: [
        { target: ["#lesson-video", "#concepts h2"], action: "video", cue: "Explainer video",
          say: "At the start of Make Sense there is a short explainer video. It shows energy being pumped in step, Barton's pendulums, the resonance curve, and the two worked examples that crack the case. Watch it whenever you want a second look." },
        { target: "#kinds-box", cue: "Free, damped, forced",
          say: "Three kinds of vibration. Free: the system vibrates at its own natural frequency. Damped: the amplitude dies away as energy is removed. Forced: an outside push makes it vibrate at the driving frequency." },
        { target: "#resonance-box", cue: "Resonance", sparkle: true,
          say: "Resonance is when the driving frequency equals the natural frequency. Each push arrives in step, energy builds up, and the amplitude is greatest. Damping lowers and widens the peak." },
        { target: "#ridge-box", cue: "f equals v over d",
          say: "Ridges spaced d apart are met at a rate f equals v over d. Resonance when v over d equals f nought, so the dangerous speed is v equals d times f nought. Always change kilometres per hour to metres per second first." },
        { target: "#pos-explorer", action: "pin:0", cue: "Speed explorer", wait: "pin",
          say: "Your turn. Tap the speed pins. Compare the forcing frequency with f nought, and the amplitude with the lift-off threshold, g over omega squared." }
      ]
    },
    {
      title: "Zoom",
      steps: [
        { target: { scene: "zoom", part: "peak" }, action: "zoom:mode:leaking", cue: "The peak at f nought",
          say: "Zoom in on the resonance curve. The dot is the okada at eighteen kilometres per hour, right at the peak, two hertz, above the dashed lift-off threshold." },
        { target: { scene: "zoom", part: "curve" }, action: "zoom:mode:healthy", cue: "A healthy damper",
          say: "Now a healthy damper, zeta zero point three zero. The peak collapses to about two centimetres, far below the threshold. That is why Mallam Sule's new shock absorber is the real cure." },
        { target: "#zoom-stage", action: "zoom:mode:heavy", cue: "Two extra crates", wait: "zoom",
          say: "And with two hundred and fifty kilograms the peak slides to one point seven nine hertz, sixteen kilometres per hour. Your turn: drag the dot or the damping slider and watch." }
      ]
    },
    {
      title: "Worked Examples",
      steps: [
        { target: "#ex1", cue: "The dangerous speed",
          say: "Example one. v equals d times f nought, two point five times two point zero, which is five point zero metres per second. Times three point six gives eighteen kilometres per hour." },
        { target: ["#ex2", "#ex3", "#ex4"], cue: "Three more",
          say: "Example two: two hundred and fifty kilograms gives f nought of one point seven nine hertz and a danger speed of sixteen kilometres per hour. Example three: the Barton driver. Example four: a keke on speed bumps, about twenty-two kilometres per hour. Then try the two exam clinic questions." },
      ]
    },
    {
      title: "Solving the Mystery",
      steps: [
        { target: "#bridge-card", action: "bridge:r18", cue: "Case closed", wait: "bridge",
          say: "Now solve the mystery. Tap the five test rides: ten, eighteen and thirty with the leaking damper, sixteen with two hundred and fifty kilograms, and the healthy damper at every speed. Then answer the three questions and give your verdict to Hajia Ramatu." },
        { target: "#big-idea", cue: "The big idea", sparkle: true,
          say: "The big idea: resonance happens when the driving frequency matches the natural frequency. Damping limits it, and changing mass or stiffness moves it." }
      ]
    },
    {
      title: "Quiz & Reflection",
      steps: [
        { target: "#quiz-list", cue: "Quiz time", wait: "quiz",
          say: "Now the quiz: twelve questions in WAEC, NECO and JAMB style, plus two review questions from earlier lessons." },
        { target: ["#reflect", "#rate-list"], cue: "Reflect and assignment",
          say: "Rate yourself from one to four on each goal, then do the exit ticket and the blank-page recall. For homework, push a swing in step, twice as often, and at random, and explain which builds the biggest swing. Then the thirty-mark paper. Congratulations, you have finished the whole unit on simple harmonic motion. Well done!" }
      ]
    }
  ]
};
