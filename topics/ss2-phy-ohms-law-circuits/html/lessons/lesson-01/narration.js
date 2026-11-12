/* Lesson 01 · StudyNarrator choreography (en-NG). 28 steps.
   Symbols are spelled out for the voice ("V equals I R", "R is rho L over A"). */
window.NARRATION = {
  rate: 0.96,
  pitch: 1.01,

  waits: {
    note: {
      event: "kit:note", timeout: 120000,
      prompt: "Type your prediction (or tap a seed) and pin it to the Wonder Wall",
      react: function () { return "Pinned. Now let us sort the conductors before we measure."; }
    },
    sort: {
      event: "l1:sort", timeout: 180000,
      prompt: "Sort every card into ohmic, non-ohmic or barely-conducts, then tap Check",
      react: function (d) {
        if (!d || d.total == null) return "You can try the sorting again later.";
        if (d.correct === d.total) return "Perfect! All " + d.total + " in the right bin.";
        return "You got " + d.correct + " out of " + d.total + ". Read the reasons below, then on to the bench.";
      }
    },
    bench: {
      event: "l1:bench-done", timeout: 300000,
      prompt: "Your turn! Step the rheostat and take five readings on the constantan wire",
      react: function () { return "Well done. Five points, and V divided by I stays at about two point seven seven ohms: the wire is ohmic."; }
    },
    pin: {
      event: "l1:pin", timeout: 120000,
      prompt: "Your turn! Tap the wire pins to see how length and diameter change the resistance",
      react: function () { return "Notice it: resistance grows with length, but falls as the square of the diameter."; }
    },
    bridge: {
      event: "l1:bridge", timeout: 180000,
      prompt: "Your turn! Answer the three steps about Emeka's two cables",
      react: function (d) {
        return d && d.correct
          ? "Case settled! The thin cable has sixteen times the resistance, so it burns sixteen times the power and runs hot."
          : "Look again. Area depends on diameter squared, so four times the diameter is sixteen times the area.";
      }
    },
    quiz: {
      event: "kit:quiz-done", timeout: 600000,
      prompt: "Answer the quiz questions, or press Next to skip",
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
      else if (p[0] === "comp") b.setComp(p[1]);
      else if (p[0] === "notch") b.setNotch(+p[1]);
      else if (p[0] === "take") b.take();
      else if (p[0] === "hl") b.highlight(p[1] || null);
    },
    zoom: function (arg) {
      var z = window.StudyScenes && StudyScenes.zoom; if (!z) return;
      var p = String(arg).split(":");
      if (p[0] === "d") z.setD(+p[1]);
      else if (p[0] === "T") z.setT(+p[1]);
      else if (p[0] === "reset") z.reset();
      else if (p[0] === "hl") z.highlight(p[1] || null);
    },
    pin: function (arg) { if (window.L01 && L01.showPin) L01.showPin(+arg, true); },
    bridge: function (arg) { if (window.L01 && L01.bridge && arg === "solve") L01.bridge.solve(); }
  },

  script: [
    {
      title: "Welcome",
      steps: [
        { target: ".l-hero .display", cue: "Lesson 1", sparkle: true,
          say: "Welcome to Lesson 1 of the current electricity unit: current, potential difference, Ohm's law, and the resistance of wires." },
        { target: ".l-hero .question", cue: "Our question",
          say: "Here is our guiding question. Why does the thin lamp wire glow while the thick starter cable barely warms, and how do we measure a resistance?" }
      ]
    },
    {
      title: "Do Now",
      steps: [
        { target: "#donow-list", cue: "Your turn", wait: "donow",
          say: "Start with four quick warm-up cards on charge, current, unit conversion and reading a meter. Answer each in your head, reveal it, and mark yourself honestly." }
      ]
    },
    {
      title: "The Story",
      steps: [
        { target: { scene: "story", part: "emeka" }, action: "story:0", cue: "Emeka's keke",
          say: "On Ngwa Road in Aba, Emeka says his keke starts fine, but once he switches on the headlamp and revs, the light goes weak." },
        { target: { scene: "story", part: "chinedu" }, action: "story:1", cue: "Two cables",
          say: "Chinedu touches the two jumper cables after a test run. The thin one is hot, the thick one is cool, yet the same current went through both. Why is only the thin one hot?" },
        { target: { scene: "story", part: "tobe" }, action: "story:2", cue: "Tobe's verdict",
          say: "Tobe says the thin wire is just bad quality. Throw it away. But is he right? We will measure before we judge." },
        { target: { scene: "story", part: "nkechi" }, action: "story:3", cue: "Measure first",
          say: "Engineer Nkechi holds up a coil of resistance wire and a filament bulb. Current, voltage and resistance decide everything here, she says. Before we judge any wire, we measure." },
        { target: { scene: "story", part: "nkechi" }, action: "story:4", cue: "To the bench",
          say: "She sets a cell, a key, an ammeter, a voltmeter and a rheostat on the bench. Change the voltage, read the current, and let the graph tell us the resistance." }
      ]
    },
    {
      title: "Wonder Wall",
      steps: [
        { target: "#wall-wonder", cue: "Pin your idea", wait: "note",
          say: "Pin your idea on the Wonder Wall. What makes one wire heat up more than another carrying the same current?" }
      ]
    },
    {
      title: "Sort Game",
      steps: [
        { target: "#ohm-sort", cue: "Ohmic or not?",
          say: "First, sort the conductors. Ohmic ones give a straight V against I line through the origin. Non-ohmic ones curve. And some things barely conduct at all." },
        { target: "#ohm-sort", cue: "Your turn", wait: "sort",
          say: "Your turn. Drag each card into its bin, then tap Check." }
      ]
    },
    {
      title: "Virtual Lab",
      steps: [
        { target: "#method-cards", action: "bench:reset", cue: "Four method cards",
          say: "Now the practical. Follow the four method cards: connect the ammeter in series and the voltmeter across the wire, set the rheostat, record the paired current and voltage, and repeat for five settings." },
        { target: { scene: "bench", part: "ammeter" }, action: "bench:comp:constantan", cue: "The circuit",
          say: "The ammeter in series reads the current I. The voltmeter across the wire reads the potential difference V. Our test wire is constantan, forty centimetres long and zero point three millimetres across." },
        { target: { scene: "bench", part: "wire" }, action: "bench:take", cue: "First reading",
          say: "Watch one reading. At this rheostat setting the current is about zero point six amperes and the voltmeter reads about one point six six volts. V divided by I is two point seven seven ohms." },
        { target: "#graph-card", action: "bench:take", cue: "The graph builds",
          say: "Each reading lands on the graph as a dot. For the wire the dots line up straight through the origin, so V is proportional to I." },
        { target: "#bench-stage", cue: "Your turn", wait: "bench",
          say: "Your turn. Step the rheostat through its five settings and take a reading each time. Then try copper, and the filament lamp, and watch how the lamp's line bends." },
        { target: "#expected", action: "open:#expected", cue: "Check your table",
          say: "Compare your readings with the expected table, then try the locked analysis questions before you unlock the answers." }
      ]
    },
    {
      title: "Make Sense",
      steps: [
        { target: "#def-current", cue: "Definitions",
          say: "Let us make sense of it. Current is the rate at which charge flows: I equals Q over t. Potential difference is energy changed per coulomb: V equals W over Q. Resistance is V over I." },
        { target: "#eq-ohm", cue: "Ohm's law",
          say: "Ohm's law: for a metal at a steady temperature, the current is proportional to the potential difference, so V equals I R, and V over I is the constant resistance R." },
        { target: "#eq-rho", cue: "Resistance of a wire",
          say: "The resistance of a uniform wire is R equals rho L over A, where the area A is pi d squared over four. So R grows with length and falls as the square of the diameter." },
        { target: "#pos-explorer", action: "pin:1", cue: "Your turn", wait: "pin",
          say: "Your turn. Tap the wire pins and watch the area and the resistance change as you vary the length and the diameter." }
      ]
    },
    {
      title: "Zoom",
      steps: [
        { target: "#zoom-stage", action: "zoom:d:0.30", cue: "Inside the metal",
          say: "Zoom inside the wire. The free electrons drift slowly against the current and keep colliding with the vibrating positive ions. Those collisions are the resistance." },
        { target: "#zoom-stage", action: "zoom:d:1.20", cue: "Thick vs thin, and heat",
          say: "A thick wire gives the electrons more room, so the resistance is far lower. Now raise the temperature: the ions shake harder, the electrons collide more often, and the resistance rises." }
      ]
    },
    {
      title: "Worked Examples",
      steps: [
        { target: ["#ex1", "#ex2"], action: "zoom:reset", cue: "Worked examples",
          say: "Two worked examples. First, current, power and charge from Ohm's law. Then resistivity from R equals rho L over A, and a second wire with twice the diameter." },
        { target: "#ex3", cue: "Resistance from a graph",
          say: "The third example reads the resistance straight from the slope of a V against I graph, exactly as the examiner expects." }
      ]
    },
    {
      title: "Solving the Mystery",
      steps: [
        { target: "#bridge-steps", action: "bench:comp:constantan", cue: "The two cables", wait: "bridge",
          say: "Back to Emeka's two cables. Answer the three steps to settle Tobe's claim. Remember, area depends on the diameter squared." }
      ]
    },
    {
      title: "Quiz & Reflection",
      steps: [
        { target: "#quiz-list", cue: "Quiz", wait: "quiz",
          say: "Now the quiz: twelve questions in WAEC, NECO and JAMB style, with a full explanation for each." },
        { target: "#reflect", cue: "Reflect",
          say: "To finish, rate yourself from one to four on each goal, do the exit ticket, and your assignment is Part A and Part B from the questions for Lesson 1. Well done today." }
      ]
    }
  ]
};
