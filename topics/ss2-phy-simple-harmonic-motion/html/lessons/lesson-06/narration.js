/* Lesson 06 · StudyNarrator choreography: Energy in SHM and Damping (en-NG). 29 steps. */
window.NARRATION = {
  rate: 0.96,
  pitch: 1.01,

  waits: {
    donow: {
      event: "kit:donow", timeout: 120000,
      prompt: "Your turn! Answer the four Do Now cards and mark yourself",
      react: function () { return "Good. Now let us go to Mallam Sule's shed, where a shock absorber is weeping oil."; }
    },
    note: {
      event: "kit:note", timeout: 120000,
      prompt: "Your turn! Pin one idea: does a pendulum ever really stop by itself?",
      react: function () { return "Pinned. Keep that idea in mind. The energy bars will test it."; }
    },
    sort: {
      event: "l6:sort", timeout: 180000,
      prompt: "Your turn! Drop all nine cards into KE greatest, PE greatest or KE equals PE, then Check",
      react: function (d) {
        if (!d || d.total == null) return "No wahala, you can try the sort again later.";
        if (d.correct === d.total) return "Perfect, all nine! Ends are all potential, the centre is all kinetic.";
        if (d.correct >= 6) return "Well done, " + d.correct + " out of " + d.total + ". Read the reasons under the cards.";
        return "You got " + d.correct + " out of " + d.total + ". Remember: zero speed means all potential; zero displacement means all kinetic.";
      }
    },
    bench: {
      event: "l6:bench-done", timeout: 360000,
      prompt: "Your turn! Record five cycles in air, water and oil",
      react: function () { return "Excellent! Three decaying curves. Air barely loses anything, water takes a quarter of the amplitude each cycle, and oil kills the motion fast."; }
    },
    pin: {
      event: "l6:pin", timeout: 120000,
      prompt: "Your turn! Tap the position pins and read PE, KE and the speed",
      react: function () { return "See it? The total stays at zero point two five joule at every pin. Only the share between KE and PE changes."; }
    },
    pushes: {
      event: "l6:pushes", timeout: 180000,
      prompt: "Your turn! Switch to Leaking, then tap Ten pushes",
      react: function (d) {
        if (d && d.damper === "leaking") return "Look at that. The leaking shock stores every push and climbs past six centimetres.";
        return "The healthy shock settles near two centimetres. Now try the leaking one.";
      }
    },
    bridge: {
      event: "l6:bridge", timeout: 180000,
      prompt: "Your turn! Answer Mallam Sule's three steps",
      react: function (d) {
        return d && d.correct >= 3
          ? "Correct! A working shock absorber drains energy every cycle. The leaking one lets the road pile it up."
          : "Nearly. The green rings show the right answers. Energy goes with A squared, so a big bounce needs a lot of stored energy.";
      }
    },
    quiz: {
      event: "kit:quiz-done", timeout: 600000,
      prompt: "Answer all the quiz questions, or press Next to move on",
      react: function (d) {
        if (!d) return "Quiz complete!";
        if (d.score >= d.total - 2) return "Sharp work, " + d.score + " out of " + d.total + "! Energy and damping are yours.";
        if (d.score >= 8) return "Well done, " + d.score + " out of " + d.total + ". Read the explanations you missed.";
        return "You scored " + d.score + " out of " + d.total + ". Revisit the energy bars and the position explorer, then try again.";
      }
    }
  },

  actions: {
    story: function (arg) { if (window.StudyScenes && StudyScenes.story) StudyScenes.story.beat(+arg); },
    open: function (arg) { var el = document.querySelector(arg); if (el && el.tagName === "DETAILS") el.open = true; },
    bench: function (arg) {
      var b = window.StudyScenes && StudyScenes.bench; if (!b) return;
      var p = String(arg).split(":");
      if (p[0] === "rig") b.setRig(p[1]);
      else if (p[0] === "medium") b.setMedium(p[1]);
      else if (p[0] === "release") b.release();
      else if (p[0] === "demo") b.demo(p[1]);
      else if (p[0] === "reset") b.reset();
    },
    zoom: function (arg) {
      var z = window.StudyScenes && StudyScenes.zoom; if (!z) return;
      var p = String(arg).split(":");
      if (p[0] === "damper") z.setDamper(p[1]);
      else if (p[0] === "ten") z.pushTen();
      else if (p[0] === "reset") z.reset();
    },
    trace: function (arg) { var t = window.StudyScenes && StudyScenes.trace; if (t) t.setMode(arg); },
    pin: function (arg) { if (window.L06 && L06.showPin) L06.showPin(+arg); },
    bridge: function (arg) { if (arg === "solve" && window.L06 && L06.solveBridge) L06.solveBridge(); }
  },

  script: [
    {
      title: "Welcome",
      steps: [
        { target: ".l-hero .display", cue: "Lesson 6 · Energy and damping", sparkle: true,
          say: "Welcome to Lesson 6 of simple harmonic motion. Our question today: where does the bounce energy go, and what is the shock absorber for?" }
      ]
    },
    {
      title: "Do Now",
      steps: [
        { target: "#donow-list", cue: "Your turn", wait: "donow",
          say: "Start with four Do Now cards: kinetic and potential energy, the greatest speed in S H M, omega squared for a spring, and a precaution from the pendulum practical. Answer each in your head, reveal it and mark yourself." }
      ]
    },
    {
      title: "The Story",
      steps: [
        { target: { scene: "story", part: "sule" }, action: "story:0", cue: "The weeping shock",
          say: "Mallam Sule has unbolted the okada's rear shock absorber. Dark oil streaks its body. It is weeping, he says. The oil inside is what kills the bounce." },
        { target: { scene: "story", part: "dayo" }, action: "story:1", cue: "Dayo is not sure",
          say: "Dayo is not convinced. Kills the bounce? The spring is still strong." },
        { target: { scene: "story", part: "shock" }, action: "story:2", cue: "New against old",
          say: "Sule pushes the new and the old damper side by side. The new one resists firmly and slowly; the old one slides freely. A spring stores energy and gives it back. The oil turns it to heat." },
        { target: { scene: "story", part: "zainab" }, action: "story:3", cue: "Zainab wonders",
          say: "Zainab asks: so every time the bike bounces, the energy just keeps going round and round?" },
        { target: { scene: "story", part: "okafor" }, action: "story:4", cue: "To the lab",
          say: "In the physics lab, Mrs Okafor releases a pendulum and a bouncing spring. Let us watch where the energy is at every point, and what happens when we make it work through water." }
      ]
    },
    {
      title: "Wonder Wall",
      steps: [
        { target: "#wall-wonder", cue: "Pin your idea", wait: "note",
          say: "Pin your idea on the Wonder Wall. Does a pendulum ever really stop by itself? And if it does, where would its energy go?" }
      ]
    },
    {
      title: "Sort Game",
      steps: [
        { target: "#l6-sort", cue: "Your turn", wait: "sort",
          say: "Your turn. For each moment, is the kinetic energy greatest, the potential energy greatest, or are they equal? Place all nine cards, then tap Check." }
      ]
    },
    {
      title: "Virtual Lab",
      steps: [
        { target: "#method-cards", action: "bench:reset", cue: "Four method cards",
          say: "Now the virtual lab. A zero point two kilogram load hangs on a spring of twenty four point five newtons per metre. Follow the four method cards." },
        { target: { scene: "bench", part: "total-bar" }, action: "bench:release", cue: "Watch the total bar",
          say: "We release it from five centimetres. Watch the bars. At the ends it is all potential; at the centre it is all kinetic. The total, half k A squared, is about zero point zero three zero six joule." },
        { target: { scene: "bench", part: "vane" }, action: "bench:demo:water", cue: "The card vane in water",
          say: "Now Damping. A card vane on the hanger dips into a beaker of water. Each cycle the water takes some energy, and the amplitude falls by the same ratio, about zero point seven five." },
        { target: "#bench-stage", cue: "Your turn", wait: "bench",
          say: "Your turn. Release and record five cycles in air, in water and in oil. I will carry on when all three are in the table." },
        { target: "#graph-card", cue: "Three decaying curves",
          say: "Look at the graph of amplitude against cycle number. Each curve drops steeply, then levels towards zero. Notice the ten oscillation times: air five point six eight seconds, water about five point seven. Light damping hardly changes the period." }
      ]
    },
    {
      title: "Make Sense",
      steps: [
        { target: "#concepts", cue: "Energy swaps form",
          say: "Let us make sense of it. Without losses, the total energy stays fixed while it changes form: all potential at the ends, all kinetic at the centre." },
        { target: "#eq-energy", cue: "The energy equations",
          say: "For a spring, E equals half k A squared. At displacement x, potential energy is half k x squared, and kinetic energy is half k times A squared minus x squared. Since k equals m omega squared, E also equals half m omega squared A squared." },
        { target: "#damp-callout", cue: "Light, heavy, critical",
          say: "Damping is a resistive force taking energy out each cycle. Light damping gives many shrinking swings. Heavy damping creeps back slowly. Critical damping returns quickest without overshoot, like a good shock absorber or a meter needle." },
        { target: "#pos-explorer", action: "pin:3", cue: "Position explorer", wait: "pin",
          say: "Your turn. For a half kilogram mass on fifty newtons per metre with amplitude zero point one metre, tap the pins. At zero point zero six metre, PE is zero point zero nine joule and KE is zero point one six joule." }
      ]
    },
    {
      title: "Zoom",
      steps: [
        { target: { scene: "zoom", part: "piston" }, action: "zoom:damper:healthy", cue: "The piston in oil",
          say: "Zoom inside the coil over. The spring is outside. Inside, a piston with small holes moves through oil. Oil jets through the holes and warms up. That warmth is the bounce energy turning to heat." },
        { target: { scene: "zoom", part: "oil" }, action: "zoom:damper:leaking", cue: "Leaking: low oil",
          say: "Now the leaking one. The oil level is low, so the piston slides through air. Very little energy is taken each cycle." },
        { target: "#zoom-trace", action: "trace:kinds", cue: "The traces",
          say: "The side panel draws the traces. Light damping keeps oscillating, critical damping comes straight back, heavy damping creeps." },
        { target: "#zoom-stage", action: "trace:shock", cue: "Your turn", wait: "pushes",
          say: "Your turn. Give each shock ten equal pushes, one every half second. Try healthy, then leaking, and watch the bounce." }
      ]
    },
    {
      title: "Worked Examples",
      steps: [
        { target: "#ex1", cue: "Energy at a point",
          say: "Worked example one. E equals half times fifty times zero point one squared, which is zero point two five joule. At zero point zero six metre, PE is zero point zero nine, KE is zero point one six, and the speed is zero point eight metres per second. Example two: KE equals PE at A over root two, seventy one per cent of the way out, not halfway." },
        { target: "#ex4", cue: "The okada's bounce energy",
          say: "Examples three and four. A pendulum bob from five centimetres reaches zero point nine nine metres per second. And for the okada, a six point two centimetre bounce stores about sixty one joules, nearly ten times a gentle two centimetre bounce." }
      ]
    },
    {
      title: "Solving the Mystery",
      steps: [
        { target: "#bridge-card", cue: "Sule's push test", wait: "bridge",
          say: "Now the bridge. Answer Mallam Sule's three steps about the healthy and the leaking shock." },
        { target: "#big-idea", cue: "The big idea", sparkle: true,
          say: "The big idea: in S H M, E equals half k A squared sloshes between KE and PE, and damping drains it. A leaking damper lets the road pile energy up, but only if the pushes arrive in time with the bounce. That is our next lesson." }
      ]
    },
    {
      title: "Quiz & Reflection",
      steps: [
        { target: "#quiz-list", cue: "Quiz time", wait: "quiz",
          say: "Now the quiz: twelve questions in WAEC, NECO and JAMB style, plus two review questions from earlier lessons." },
        { target: "#reflect", cue: "Reflect",
          say: "Rate yourself from one to four on each goal, then do the exit ticket and the blank page recall." },
        { target: "#assignment", cue: "Assignment",
          say: "For homework, do the bounce test on two parked vehicles with the owners' permission, then the thirty mark paper. Well done today." }
      ]
    }
  ]
};
