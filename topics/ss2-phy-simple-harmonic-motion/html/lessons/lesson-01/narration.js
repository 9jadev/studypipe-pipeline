/* Lesson 01 · StudyNarrator choreography (en-NG priority in narrator.js). 30 steps.
   Symbols are spelled out for the voice ("T equals t over n", "omega equals two pi f"). */
window.NARRATION = {
  rate: 0.96,
  pitch: 1.01,

  waits: {
    note: {
      event: "kit:note", timeout: 120000,
      prompt: "Your turn! Type your idea (or tap a seed) and pin it to the Wonder Wall",
      react: function () { return "Pinned. Hold that idea. First, let us sort the motions we see every day."; }
    },
    sort: {
      event: "l1:sort", timeout: 180000,
      prompt: "Your turn! Sort every card into a bin, then tap Check",
      react: function (d) {
        if (!d || d.total == null) return "You can try the sorting again later.";
        if (d.correct === d.total) return "Perfect! All " + d.total + " in the right bin.";
        return "You got " + d.correct + " out of " + d.total + ". Read the reasons, then on to the bench.";
      }
    },
    bench: {
      event: "l1:bench-done", timeout: 300000,
      prompt: "Your turn! Time 20 oscillations of the pendulum, then of the spring",
      react: function () { return "Well done. Twenty swings of the pendulum take about thirty-five point nine seconds, so T is about one point eight seconds. The spring is faster: T is about zero point five seven seconds."; }
    },
    pin: {
      event: "l1:pin", timeout: 120000,
      prompt: "Your turn! Tap the pins A, O, B, O, A along one swing",
      react: function () { return "See it? One complete oscillation is A to O to B to O and back to A, moving the same way as at the start."; }
    },
    bridge: {
      event: "l1:bridge", timeout: 180000,
      prompt: "Your turn! Hand-time 1 bounce and 20 bounces of the okada, then choose the period you trust",
      react: function (d) {
        return d && d.correct
          ? "Exactly. The okada's rear has its own steady rhythm: T is zero point five zero seconds and f is two hertz. Whatever cracks the eggs must be connected with this number."
          : "Look again at your one-bounce timings: they scatter by a few tenths of a second. Twenty bounces share that error out.";
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
      else if (p[0] === "rig") b.setRig(p[1]);
      else if (p[0] === "release") b.release();
      else if (p[0] === "time") b.timeN(+p[1] || 20);
      else if (p[0] === "fast") b.setFast(p[1] === "on");
      else if (p[0] === "hl") b.highlight(p[1] || null);
    },
    zoom: function (arg) {
      var z = window.StudyScenes && StudyScenes.zoom; if (!z) return;
      var p = String(arg).split(":");
      if (p[0] === "release") z.release();
      else if (p[0] === "time") z.time(+p[1] || 1);
      else if (p[0] === "reset") z.reset();
      else if (p[0] === "hl") z.highlight(p[1] || null);
    },
    pin: function (arg) { if (window.L01 && L01.showPin) L01.showPin(+arg, true); }
  },

  script: [
    {
      title: "Welcome",
      steps: [
        { target: ".l-hero .display", cue: "Lesson 1", sparkle: true,
          say: "Welcome to Lesson 1 of simple harmonic motion: things that repeat. Today we learn to put a number on a bounce." },
        { target: ".l-hero .question", cue: "Our question",
          say: "Here is our guiding question. How can we put a number on a bounce? By the end you will measure period, frequency and angular frequency like a WAEC examiner." }
      ]
    },
    {
      title: "Do Now",
      steps: [
        { target: "#donow-list", cue: "Your turn", wait: "donow",
          say: "Start with four warm-up cards: speed, units of time, reaction time and reciprocals. Answer each in your head, reveal it, and mark yourself honestly." }
      ]
    },
    {
      title: "The Story",
      steps: [
        { target: { scene: "story", part: "ramatu" }, action: "story:0", cue: "Cracked eggs",
          say: "At her farm outside Ogbomoso, Hajia Ramatu holds up another cracked tray. Third time this month, she says, and Dayo swears he rode carefully." },
        { target: { scene: "story", part: "okada" }, action: "story:1", cue: "The okada",
          say: "Dayo says: slow, nothing breaks. Fast, nothing breaks. But somewhere in the middle, the back starts to jump like a goat." },
        { target: { scene: "story", part: "tunde" }, action: "story:2", cue: "Tunde's idea",
          say: "Tunde thinks it is simple: the faster you ride, the more it bounces. Is he right? Keep that question in mind." },
        { target: { scene: "story", part: "carrier" }, action: "story:3", cue: "Its own rhythm",
          say: "Zainab presses the carrier down and lets go. Watch it: it bounces at its own rhythm, even when the bike is standing still." },
        { target: { scene: "story", part: "okafor" }, action: "story:4", cue: "To the lab",
          say: "In the physics laboratory, Mrs Okafor says: before we argue about speed, let us measure that rhythm. Anything that repeats can be timed." },
        { target: { scene: "story", part: "okafor" }, action: "story:5", cue: "Count twenty",
          say: "Count twenty bounces, not one, she says. Then we will know how long one takes, and how many happen in a second." }
      ]
    },
    {
      title: "Wonder Wall",
      steps: [
        { target: "#wall-wonder", cue: "Pin your idea", wait: "note",
          say: "If you had only a phone stopwatch, how would you time one bounce of the okada as accurately as possible? Pin your idea on the Wonder Wall." }
      ]
    },
    {
      title: "Sort Game",
      steps: [
        { target: "#rep-sort", cue: "Three bins",
          say: "Some motions repeat and go to and fro about a rest position: those are oscillations. Some repeat but go round and round: periodic only. And some never repeat at all." },
        { target: "#rep-sort", cue: "Your turn", wait: "sort",
          say: "Your turn. Drag each card into its bin, or tap the card and then the bin. Then tap Check." }
      ]
    },
    {
      title: "Virtual Lab",
      steps: [
        { target: "#method-cards", action: "bench:reset", cue: "Four steps",
          say: "Now the practical. Four steps: release the bob a small distance, start the watch as it passes the rest mark counting zero, count twenty complete oscillations, then calculate." },
        { target: { scene: "bench", part: "marker" }, action: "bench:rig:pendulum", cue: "The rest mark",
          say: "This chalk mark sits under the bob's rest position. The bob moves fastest here, so the instant it passes is sharp and easy to judge." },
        { target: { scene: "bench", part: "stopwatch" }, action: "bench:release", cue: "The stopwatch",
          say: "Watch the stopwatch. Its face also shows the problem: a reaction error of zero point two seconds is about eleven percent of one swing, but barely half a percent of twenty swings." },
        { target: "#bench-stage", cue: "Your turn", wait: "bench",
          say: "Your turn. Press Time n with n equal to twenty for the pendulum, then switch to the spring and do the same. Try Start and Stop by hand too, and compare." },
        { target: "#results-table", cue: "Find f",
          say: "Every timing lands in the table with t and T. Type the frequency yourself: f equals one over T. The table checks it and then shows omega, which is two pi over T." },
        { target: "#expected", action: "open:#expected", cue: "Check your table",
          say: "Compare with the expected results: the pendulum gives thirty-five point nine zero seconds for twenty, and the spring eleven point three five seconds. Then try the locked analysis questions." }
      ]
    },
    {
      title: "Make Sense",
      steps: [
        { target: "#concepts h2", cue: "Definitions",
          say: "Let us make sense of it. Periodic motion repeats in equal intervals of time. An oscillation is periodic to-and-fro motion about a fixed rest position." },
        { target: "#eq-measures", cue: "The equations",
          say: "Period T equals t over n. Frequency f equals one over T, in hertz. Angular frequency omega equals two pi f, in radians per second. And in one complete oscillation the body covers four times the amplitude. And careful: amplitude is measured from the middle to one end, never from end to end." },
        { target: "#pos-explorer", action: "pin:1", cue: "Your turn", wait: "pin",
          say: "Your turn. Tap the pins along one swing of our point eight metre pendulum and watch the fraction of a cycle grow." }
      ]
    },
    {
      title: "Zoom",
      steps: [
        { target: { scene: "zoom", part: "ghosts" }, action: "zoom:release", cue: "Slow motion",
          say: "In slow motion, the bob leaves a ghost at A, then O at one quarter, B at one half, O again at three quarters, and A at one full cycle." },
        { target: { scene: "zoom", part: "stopwatch" }, cue: "One vs twenty",
          say: "The split stopwatch compares one swing with twenty. The same zero point two second slip is eleven percent of one period, but only about zero point six percent of twenty." }
      ]
    },
    {
      title: "Worked Examples",
      steps: [
        { target: "#ex1", action: "zoom:reset", cue: "The okada's rhythm",
          say: "Example one: twenty bounces in ten seconds. T is ten over twenty, zero point five zero seconds. f is two hertz. Omega is about twelve point six radians per second." },
        { target: ["#ex2", "#ex3"], cue: "Swing and error",
          say: "Example two does the same for a compound swing. Example three shows why we time twenty: the percentage error falls from about eleven percent to about zero point six percent." },
        { target: "#ex4", cue: "Four A",
          say: "Example four: the amplitude is half the end-to-end distance, and each complete oscillation covers four A." }
      ]
    },
    {
      title: "Solving the Mystery",
      steps: [
        { target: "#bridge-steps", action: "bench:rig:okada", cue: "Your turn", wait: "bridge",
          say: "Back to the okada. Hand-time one bounce a few times, then twenty bounces a few times, and decide which period you trust." },
        { target: "#big-idea", cue: "Big idea", sparkle: true,
          say: "The big idea: an oscillation is measured by its period and frequency, f equals one over T. Time many cycles to beat your reaction time." }
      ]
    },
    {
      title: "Quiz & Reflection",
      steps: [
        { target: "#quiz-list", cue: "Quiz", wait: "quiz",
          say: "Now the quiz: twelve questions in WAEC, NECO and JAMB style, with a full explanation for each." },
        { target: "#assignment", cue: "Assignment",
          say: "Rate yourself from one to four on each goal, then your assignment: time a stone on a thread at home, then the thirty-mark paper. Each solution unlocks after you try. Well done today." }
      ]
    }
  ]
};
