/* Lesson 04 · StudyNarrator choreography: The Simple Pendulum (en-NG voice first). 28 steps. */
window.NARRATION = {
  rate: 0.96,
  pitch: 1.01,

  waits: {
    donow: {
      event: "kit:donow", timeout: 120000,
      prompt: "Your turn! Answer the four Do Now cards and mark yourself",
      react: function () { return "Good. Hold on to that last card about small angles. We will need it today."; }
    },
    note: {
      event: "kit:note", timeout: 120000,
      prompt: "Your turn! Pin your ranking of what changes a pendulum's period",
      react: function () { return "Pinned. Now let us sort the claims before we test them on the bench."; }
    },
    sort: {
      event: "l4:sort", timeout: 180000,
      prompt: "Your turn! Drop all nine cards into the bins, then tap Check",
      react: function (d) {
        if (!d || d.total == null) return "No wahala, you can try the sort again later.";
        if (d.correct === d.total) return "Perfect, all nine! Only length and g change the period, and a wide swing changes it a little.";
        if (d.correct >= 6) return "Well done, " + d.correct + " out of " + d.total + ". Read the reasons under the cards.";
        return "You got " + d.correct + " out of " + d.total + ". Do not worry. The bench will show you which ones really matter.";
      }
    },
    bench: {
      event: "l4:bench-done", timeout: 420000,
      prompt: "Your turn! Change the mass, the angle, the length and g, timing 20 swings each time",
      react: function () { return "Excellent fair testing! The mass made no difference, small angles made almost none, but length and gravity changed the period."; }
    },
    pin: {
      event: "l4:pin", timeout: 120000,
      prompt: "Your turn! Tap the angle pins from 5 to 45 degrees",
      react: function () { return "See how fast the error grows after about ten degrees. That is why WAEC says small angle."; }
    },
    zoom: {
      event: "l4:zoom", timeout: 150000,
      prompt: "Your turn! Swap 50 grams for 100 grams, or drag the angle",
      react: function () { return "Every force arrow doubled with the heavier bob, but the acceleration arrow, g sine theta, did not move. Mass cancels."; }
    },
    bridge: {
      event: "l4:bridge", timeout: 180000,
      prompt: "Your turn! Answer the three Bridge steps",
      react: function (d) {
        return d && d.correct >= 3
          ? "Puzzle solved! Mass does not set the rhythm, and the okada bounces in time with a six point two centimetre pendulum."
          : "Nearly. The green rings show the right answers: l equals g T squared over four pi squared, which is six point two centimetres.";
      }
    },
    quiz: {
      event: "kit:quiz-done", timeout: 600000,
      prompt: "Answer all the quiz questions, or press Next to move on",
      react: function (d) {
        if (!d) return "Quiz complete!";
        if (d.score >= d.total - 2) return "Sharp work, " + d.score + " out of " + d.total + "! You own the pendulum formula.";
        if (d.score >= 8) return "Well done, " + d.score + " out of " + d.total + ". Read the explanations you missed.";
        return "You scored " + d.score + " out of " + d.total + ". Revisit the worked examples, then try again.";
      }
    }
  },

  actions: {
    story: function (arg) { if (window.StudyScenes && StudyScenes.story) StudyScenes.story.beat(+arg); },
    open: function (arg) { var el = document.querySelector(arg); if (el && el.tagName === "DETAILS") el.open = true; },
    bench: function (arg) {
      var b = window.StudyScenes && StudyScenes.bench; if (!b) return;
      var p = String(arg).split(":");
      if (p[0] === "set") b.set(p[1], +p[2]);
      else if (p[0] === "time") b.time();
      else if (p[0] === "view") b.view(p[1]);
      else if (p[0] === "reset") b.reset();
      else if (p[0] === "hl") b.highlight(p[1] || null);
    },
    zoom: function (arg, later) {
      var z = window.StudyScenes && StudyScenes.zoom; if (!z) return;
      var p = String(arg).split(":");
      if (p[0] === "reset") z.reset();
      else if (p[0] === "sweep") {
        // demonstrate: 10° then 45°
        z.setMode("theta:10");
        if (later) later(function () { z.setMode("theta:45"); }, 2600);
      } else z.setMode(arg);
    },
    pin: function (arg) { if (window.L04 && L04.showPin) L04.showPin(+arg); },
    bridge: function (arg) { if (arg === "solve" && window.L04 && L04.solveBridge) L04.solveBridge(); }
  },

  script: [
    {
      title: "Welcome",
      steps: [
        { target: ".l-hero .display", cue: "Lesson 4 · The Simple Pendulum", sparkle: true,
          say: "Welcome to Lesson 4. Today we hang a bob on a thread and ask a simple question that trips up many students in WAEC." },
        { target: ".l-hero .question", cue: "Our guiding question",
          say: "Does a heavier bob, or a bigger swing, change the timing of a pendulum? By the end you will know, and you will know why." }
      ]
    },
    {
      title: "Do Now",
      steps: [
        { target: "#donow-list", cue: "Your turn", wait: "donow",
          say: "Start with four Do Now cards: where acceleration is greatest in S H M, spring period ratios, components of a force, and sine of a small angle. Answer each in your head, reveal it, and mark yourself. I will wait." }
      ]
    },
    {
      title: "The Story",
      steps: [
        { target: { scene: "story", part: "tunde" }, action: "story:0", cue: "Tunde's claim",
          say: "In the school physics lab, Tunde holds up two bobs, brass and wood. He says the heavy one will swing slowly, steady like a loaded lorry." },
        { target: { scene: "story", part: "zainab" }, action: "story:1", cue: "Zainab's claim",
          say: "Zainab has her own idea. If she pulls the bob back further, it must take longer, because it has further to go." },
        { target: { scene: "story", part: "okafor" }, action: "story:2", cue: "Fair tests",
          say: "Mrs Okafor says: two claims, two fair tests. Change one thing at a time, and time twenty swings." },
        { target: { scene: "story", part: "shortPendulum" }, action: "story:3", cue: "The puzzle",
          say: "Then she points at a tiny pendulum, about the length of a finger. It keeps exactly the okada's time. Why that length? Keep this puzzle for later." },
        { target: { scene: "story", part: "zainab" }, action: "story:4", cue: "In step",
          say: "Zainab lets a brass pendulum and a wooden pendulum of the same length go together. Tunde, they are together! Hmm. Let us find out why." }
      ]
    },
    {
      title: "Wonder Wall",
      steps: [
        { target: "#wall-wonder", cue: "Pin your ranking", wait: "note",
          say: "On the Wonder Wall, rank what you think changes a pendulum's period: the bob's mass, the release angle, the thread length, or the planet you are on. Pin one idea." }
      ]
    },
    {
      title: "Sort Game",
      steps: [
        { target: "#pd-sort", cue: "Three bins",
          say: "Now a sort. For each card, decide: does it change the period, make no change, or change it only when the swing is wide?" },
        { target: "#pd-sort", cue: "Your turn", wait: "sort",
          say: "Your turn. Place all nine cards, then tap Check." }
      ]
    },
    {
      title: "Virtual Lab",
      steps: [
        { target: "#method-cards", action: "bench:reset", cue: "Four fair tests",
          say: "Now the pendulum bench. Four method cards, four fair tests: the mass, the angle, the length, and gravity. Change only one thing each time." },
        { target: { scene: "bench", part: "bob" }, action: "bench:view:bob", cue: "The bob",
          say: "Here is the bob. The brass bob is one hundred grams; the wooden one, the same size, is fifty grams. The black band marks its centre, which sets the length l." },
        { target: { scene: "bench", part: "protractor" }, action: "bench:view:all", cue: "The release angle",
          say: "The protractor at the top shows the release angle. We use five, ten and thirty degrees. Timing starts as the bob passes the rest mark, counting zero." },
        { target: "#bench-stage", action: "bench:time", cue: "Watch the stopwatch",
          say: "Watch me time twenty swings at zero point five metres and ten degrees. The stopwatch should stop at about twenty eight point four four seconds, so T is about one point four two seconds." },
        { target: "#bench-stage", action: "bench:view:bob", cue: "Your turn", wait: "bench",
          say: "Your turn. Swap to the fifty gram bob and time it. Then try five and thirty degrees, the short and long threads, and finally the Moon. I will carry on when all four variables are tested." },
        { target: "#results-table", action: "open:#expected", cue: "Compare your results",
          say: "Compare your table with the expected results. Fifty grams and one hundred grams both gave twenty eight point four four seconds. Quadrupling the length doubled the period. And on the Moon, twenty swings took about seventy seconds." }
      ]
    },
    {
      title: "Make Sense",
      steps: [
        { target: "#concept-forces", cue: "Forces on the bob",
          say: "Let us make sense of it. The weight m g splits into two parts. M g cos theta pulls along the thread and the tension balances it. M g sin theta pulls along the arc, back to the lowest point. That is the restoring force." },
        { target: "#concept-small", cue: "The small-angle step", sparkle: true,
          say: "For a small angle in radians, sine theta is almost equal to theta, which is x over l. So the acceleration is minus g over l times x. The mass cancels! This is S H M with omega squared equal to g over l, so T equals two pi root L over g." },
        { target: "#props-table", cue: "Pendulum vs spring",
          say: "Compare with the spring. The spring's period depends on mass but not on g. The pendulum's period depends on g but not on mass. WAEC loves this contrast." },
        { target: "#pos-explorer", action: "pin:4", cue: "Your turn", wait: "pin",
          say: "Your turn. Tap the angle pins. At ten degrees, sine theta is only half a per cent below theta. At forty five degrees it is ten per cent below, and the period grows by four per cent." }
      ]
    },
    {
      title: "Zoom",
      steps: [
        { target: { scene: "zoom", part: "mg-sin" }, action: "zoom:reset", cue: "mg sin θ",
          say: "In the force zoom, the amber arrow is m g sin theta, along the arc. The violet arrow is m g cos theta, along the thread, cancelled by the tension." },
        { target: { scene: "zoom", part: "triangle" }, action: "zoom:sweep", cue: "sin θ ≈ x/l",
          say: "The shaded thin triangle has sides x and l. For small angles, sine theta is almost x over l. Watch the angle go from ten to forty five degrees and see the readout drift apart." },
        { target: { scene: "zoom", part: "a-arrow" }, action: "zoom:mass:100", cue: "Your turn", wait: "zoom",
          say: "Your turn. Swap between fifty and one hundred grams. Every force arrow doubles, but the green acceleration arrow, g sine theta, stays the same length. Heavier means more force, but also more inertia." }
      ]
    },
    {
      title: "Worked Examples",
      steps: [
        { target: "#ex1", cue: "Find the period",
          say: "Example one. A pendulum zero point nine metres long. T equals two pi root zero point nine over nine point eight, which is one point nine zero seconds." },
        { target: "#ex2", cue: "Ratios",
          say: "Example two uses a ratio. T two over T one equals root of l two over l one. Root two point two five is one point five, so the new period is one point nine zero seconds. The same answer as example one." },
        { target: ["#ex3", "#ex4"], cue: "Moon and seconds pendulum",
          say: "Example three: on the Moon, g is one sixth, so the period is multiplied by root six, two point four five. Example four: the seconds pendulum, period two seconds, is about zero point nine nine metres long." }
      ]
    },
    {
      title: "Solving the Mystery",
      steps: [
        { target: "#bridge-card", cue: "Your turn", wait: "bridge",
          say: "Now the Bridge. First, Tunde's test. Then Mrs Okafor's puzzle: what length of pendulum keeps the okada's half second bounce? Answer the three steps." },
        { target: "#big-idea", cue: "The big idea", sparkle: true,
          say: "The big idea. T equals two pi root L over g. Only length and gravity count, for small swings. And the okada bounces in time with a six point two centimetre pendulum, exactly its static sag." }
      ]
    },
    {
      title: "Quiz & Reflection",
      steps: [
        { target: "#quiz-list", cue: "Quiz time", wait: "quiz",
          say: "Now the quiz: twelve questions in WAEC, NECO and JAMB style, plus two review questions from Lessons 2 and 3." },
        { target: "#reflect", cue: "Reflect",
          say: "Rate yourself from one to four on each goal, then do the exit ticket and the blank page recall." },
        { target: "#assignment", cue: "Assignment",
          say: "For homework, Part A: hang a key and a padlock on equal threads and see if they stay in step. Part B is a thirty mark paper. Well done today!" }
      ]
    }
  ]
};
