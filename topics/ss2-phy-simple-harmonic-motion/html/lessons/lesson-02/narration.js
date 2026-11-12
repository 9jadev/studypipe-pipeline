/* Lesson 02 · StudyNarrator choreography: The Pull Back to the Middle (en-NG). 29 steps, 11 chapters. */
window.NARRATION = {
  rate: 0.96,
  pitch: 1.01,

  waits: {
    donow: {
      event: "kit:donow", timeout: 120000,
      prompt: "Your turn! Answer the four Do Now cards and mark yourself",
      react: function () { return "Good. Now let us go back to Ridge Road."; }
    },
    note: {
      event: "kit:note", timeout: 120000,
      prompt: "Your turn! Pin your prediction about the two extra crates",
      react: function () { return "Pinned! Now let us find out which motions are really simple harmonic."; }
    },
    sort: {
      event: "l2:sort", timeout: 180000,
      prompt: "Your turn! Sort all eleven cards, then tap Check",
      react: function (d) {
        if (!d || d.total == null) return "No problem. You can come back to the sort later.";
        if (d.correct === d.total) return "Perfect! Eleven out of eleven. You can spot the pull back to the middle.";
        if (d.correct >= 8) return "Good work, " + d.correct + " out of " + d.total + ". Read the reason under each card you missed.";
        return "You got " + d.correct + " out of " + d.total + ". Ask yourself: is there a force that grows with displacement and points back to the middle?";
      }
    },
    bench: {
      event: "l2:bench-done", timeout: 420000,
      prompt: "Your turn! Read five loads, then time 20 oscillations for each",
      react: function () { return "Well done! Five loads read and timed. Now look at the two graphs."; }
    },
    pin: {
      event: "l2:pin", timeout: 120000,
      prompt: "Your turn! Tap the mass pins, then tap Okada 250 kilograms",
      filter: function (d) { return d && d.key === "ok250"; },
      react: function () { return "Two hundred and fifty kilograms: the period grows to zero point five six seconds. Heavier is slower, not steadier."; }
    },
    bridge: {
      event: "l2:bridge", timeout: 180000,
      prompt: "Your turn! Answer the three questions and give your verdict",
      react: function (d) {
        return d && d.correct
          ? "Case settled! The loaded okada still bounces; the extra crates only slow it from two hertz to about one point eight hertz."
          : "Not quite. Look at the green rings: more mass gives a longer period and a lower frequency, but the bounce does not stop.";
      }
    },
    quiz: {
      event: "kit:quiz-done", timeout: 600000,
      prompt: "Your turn! Answer the quiz questions, or press Next to skip",
      react: function (d) {
        if (!d) return "Quiz complete!";
        if (d.score >= d.total - 2) return "Excellent, " + d.score + " out of " + d.total + "! You understand the loaded spring.";
        if (d.score >= 9) return "Well done, " + d.score + " out of " + d.total + ". Read the explanations on the ones you missed.";
        return "You scored " + d.score + " out of " + d.total + ". Go back to the bench and the worked examples, then try again.";
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
      else if (p[0] === "mode") b.setMode(p[1]);
      else if (p[0] === "add") b.addMass();
      else if (p[0] === "release") b.release();
      else if (p[0] === "time") b.time();
      else if (p[0] === "okada") b.okadaRun(+p[1] || 200);
      else if (p[0] === "lab") b.rig("lab");
      else if (p[0] === "hl") b.highlight(p[1] || null);
    },
    graph: function (arg) { if (window.L02 && L02.graphTab) L02.graphTab(arg === "t2m" ? "t2m" : "fx"); },
    zoom: function (arg) {
      var z = window.StudyScenes && StudyScenes.zoom; if (!z) return;
      var p = String(arg).split(":");
      if (p[0] === "mode") z.setMode(p[1]);
      else if (p[0] === "slow") z.slow(p[1] !== "off");
      else if (p[0] === "reset") z.reset();
    },
    video: function () { var v = document.getElementById("lesson-video"); if (v && v.scrollIntoView) v.scrollIntoView({ behavior: "smooth", block: "center" }); },
    pin: function (arg) { if (window.L02 && L02.showPin) L02.showPin(+arg, true); },
    bridge: function (arg) {
      if (!window.L02 || !L02.bridge || !L02.bridge.ui) return;
      if (arg === "solve") L02.bridge.ui.solve(); else L02.bridge.ui.run(+arg || 200);
    }
  },

  script: [
    {
      title: "Welcome",
      steps: [
        { target: ".l-hero .display", cue: "Lesson 2 · The pull back", sparkle: true,
          say: "Welcome to Lesson 2. Today we find the force that pulls every oscillator back to the middle, and we use it to test a claim about Dayo's okada." },
        { target: ".l-hero .question", cue: "Our guiding question",
          say: "Here is our question. What makes a motion simple harmonic, and why do extra crates slow the bounce?" }
      ]
    },
    {
      title: "Do Now",
      steps: [
        { target: "#donow-list", cue: "Your turn", wait: "donow",
          say: "Start with four Do Now cards from Lesson 1: period and frequency, amplitude, omega, and weight. Answer each in your head, reveal it, and mark yourself honestly." }
      ]
    },
    {
      title: "The Story",
      steps: [
        { target: { scene: "story", part: "okada" }, action: "story:0", cue: "Two extra crates",
          say: "On Ridge Road, Dayo straps two extra crates onto the okada. Heavier load, steadier ride, he says." },
        { target: { scene: "story", part: "tunde" }, action: "story:1", cue: "Tunde agrees",
          say: "Tunde agrees. Heavy things do not bounce, he says. We will test that claim." },
        { target: { scene: "story", part: "carrier" }, action: "story:2", cue: "Still bouncing",
          say: "Zainab presses the loaded carrier and lets go. It still bounces. It just looks lazier." },
        { target: { scene: "story", part: "spring" }, action: "story:3", cue: "Equal steps",
          say: "In the lab, Mrs Okafor hangs fifty gram masses on a spiral spring. Every extra fifty grams pulls the pointer down by the same amount." },
        { target: { scene: "story", part: "spring" }, action: "story:4", cue: "Pulled back to the middle",
          say: "She pulls the hanger down and lets go. The further you pull, the harder the spring pulls back, always towards the middle. That is the secret of simple harmonic motion." }
      ]
    },
    {
      title: "Wonder Wall",
      steps: [
        { target: "#wall-wonder", cue: "Pin your idea", wait: "note",
          say: "Pin your prediction. With two extra crates, will the okada bounce faster, slower, or at the same rhythm? Why?" }
      ]
    },
    {
      title: "Sort Game",
      steps: [
        { target: "#shm-sort", cue: "Three bins",
          say: "Now sort eleven motions. Simple harmonic means a restoring force proportional to the displacement, always pointing to the middle. Some motions repeat but are not simple harmonic, and some do not oscillate at all." },
        { target: "#shm-sort", cue: "Your turn", wait: "sort",
          say: "Your turn. Drag each card, or tap a card then a bin, and press Check." }
      ]
    },
    {
      title: "Virtual Lab",
      steps: [
        { target: "#method-cards", action: "bench:mode:hooke", cue: "Four method cards",
          say: "On the bench, follow four steps. Read the pointer with the empty hanger. Add fifty grams at a time and find the extension. Then time twenty oscillations for each load. Finally plot two graphs." },
        { target: { scene: "bench", part: "pointer" }, action: "bench:hl:pointer", cue: "Read the pointer",
          say: "This red pointer moves down the metre rule as the spring stretches. Keep your eye level with it to avoid parallax." },
        { target: { scene: "bench", part: "slotted-mass" }, action: "bench:add", cue: "Add 50 g",
          say: "Each slotted mass is fifty grams. One hundred grams stretches the spring four point zero centimetres. Every fifty grams adds another two point zero centimetres." },
        { target: { scene: "bench", part: "spring" }, action: "bench:release", cue: "Pull & release",
          say: "Now switch to Time it. Pull the hanger down a little and let go. The spring pulls it back towards the middle, again and again." },
        { target: { scene: "bench", part: "stopwatch" }, action: "bench:time", cue: "Time 20",
          say: "The stopwatch starts as the load passes the equilibrium position and stops after twenty full oscillations. Divide by twenty to get the period, T." },
        { target: "#bench-stage", action: "bench:hl:", cue: "Your turn", wait: "bench",
          say: "Your turn. Read five loads, from fifty to two hundred and fifty grams, and time twenty oscillations for each. I will carry on when all five are timed." },
        { target: "#graph-card", action: "graph:fx", cue: "F against x",
          say: "First graph. Force against extension is a straight line through the origin. That is Hooke's law, and the slope is the spring constant, twenty four point five newtons per metre." },
        { target: "#graph-card", action: "graph:t2m", cue: "T squared against m",
          say: "Second graph. T squared against m is also a straight line through the origin. Its slope is one point six one seconds squared per kilogram, and k equals four pi squared over the slope, twenty four point five again. The two methods agree." },
        { target: "#expected", action: "open:#expected", cue: "Compare results",
          say: "Compare your table with the expected results, then try the five locked analysis questions before you unlock the answers." }
      ]
    },
    {
      title: "Make Sense",
      steps: [
        { target: ["#lesson-video", "#concepts h2"], action: "video", cue: "Explainer video",
          say: "Make Sense opens with an explainer video. It takes you from Hooke's law to the restoring force, to T equals two pi root m over k. Watch it now, or come back to it any time." },
        { target: "#shm-cond", cue: "The SHM condition", sparkle: true,
          say: "Here is the key idea. Displace the mass and the spring pulls it back with F equals minus k x. Newton's second law gives a equals minus k over m times x. Any motion with a equals minus omega squared x is simple harmonic: the acceleration is proportional to the displacement and always directed towards the middle." },
        { target: "#eq-list", cue: "The equations",
          say: "From omega squared equals k over m we get the period, T equals two pi root m over k. Square it and T squared equals four pi squared over k, times m. That is why T squared against m is a straight line." },
        { target: "#props-table", cue: "What changes T?",
          say: "A heavier load makes the period longer. A stiffer spring makes it shorter. A bigger amplitude changes nothing at all." },
        { target: "#pos-explorer", action: "pin:1", cue: "Your turn", wait: "pin",
          say: "Your turn. Tap the mass pins and watch T grow as root m. Then tap the okada pins: two hundred kilograms bounces every zero point five zero seconds. Finish on two hundred and fifty kilograms." }
      ]
    },
    {
      title: "Zoom",
      steps: [
        { target: { scene: "zoom", part: "f-arrow" }, action: "zoom:mode:forces", cue: "The restoring force",
          say: "Zoom in. The red arrow is the restoring force. It is zero at the dashed equilibrium line and longest at the ends, and it always points back to the middle." },
        { target: "#zoom-stage", action: "zoom:mode:testtube", cue: "The test-tube",
          say: "Now a weighted test tube floating in water. Push it down and the extra upthrust pushes it back up. The same pull back to the middle, so it is simple harmonic too." }
      ]
    },
    {
      title: "Worked Examples",
      steps: [
        { target: ["#ex1", "#ex2"], action: "zoom:reset", cue: "k, T and a",
          say: "Example one finds k from a stretch, forty nine newtons per metre, then the period, zero point four nine seconds. Example two uses a equals minus k over m times x for the same spring." },
        { target: ["#ex3", "#ex4"], cue: "The okada and ratios",
          say: "Example three times the okada. Two hundred kilograms gives zero point five zero seconds; two hundred and fifty kilograms gives zero point five six seconds. Example four uses T proportional to root m: the period rises by one point five times." }
      ]
    },
    {
      title: "Solving the Mystery",
      steps: [
        { target: "#bridge-card", action: "bridge:200", cue: "Time the okada", wait: "bridge",
          say: "Back to Ridge Road. Time twenty bounces of the okada with two hundred kilograms, then with two hundred and fifty. Then answer the three questions to settle Tunde's claim." },
        { target: "#big-idea", cue: "The big idea", sparkle: true,
          say: "The big idea. A restoring force proportional to displacement gives simple harmonic motion. For a spring, T equals two pi root m over k, so more mass means a longer period, not a steadier ride." }
      ]
    },
    {
      title: "Quiz & Reflection",
      steps: [
        { target: "#quiz-list", cue: "Quiz time", wait: "quiz",
          say: "Now the quiz. Twelve exam style questions, plus two review questions from Lesson 1." },
        { target: "#reflect", cue: "Reflect and assignment",
          say: "To finish, rate yourself from one to four on each goal, then do the blank page recall and the exit ticket. Your assignment has a home investigation with keys and a spring, and a thirty mark paper. Well done today." }
      ]
    }
  ]
};
