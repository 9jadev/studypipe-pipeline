/* Lesson 02 · StudyNarrator choreography (en-NG). 25 steps.
   Symbols are spelled out for the voice ("double equals", "greater than or equal to", "not grid online"). */
window.NARRATION = {
  rate: 0.96,
  pitch: 1.01,

  waits: {
    note: {
      event: "kit:note", timeout: 120000,
      prompt: "Type your prediction (or tap a seed) and pin it to the Wonder Wall",
      react: function () { return "Pinned! Now let us classify boolean expressions before we wire the switchboard."; }
    },
    sort: {
      event: "l02:sort", timeout: 180000,
      prompt: "Sort all eight boolean expressions into True or False, then tap Check",
      react: function (d) {
        if (!d || d.total == null) return "You can try the boolean sorting again later.";
        if (d.correct === d.total) return "Brilliant! All " + d.total + " boolean expressions in the right truth bin.";
        return "You got " + d.correct + " out of " + d.total + ". Check the operator precedence notes below, then on to the switchboard.";
      }
    },
    bench: {
      event: "l02:bench-done", timeout: 300000,
      prompt: "Your turn! Test five battery and grid combinations on the logic switchboard",
      react: function () { return "Well done! With battery less than twenty and not grid online, the relay triggers only when the battery is low during a blackout."; }
    },
    pin: {
      event: "l02:pin", timeout: 120000,
      prompt: "Your turn! Tap the JAMB and NEPA pins to trace which if, elif, or else branch runs",
      react: function () { return "Notice that! Once the first matching branch executes, Python skips every remaining elif and else block."; }
    },
    bridge: {
      event: "l02:bridge", timeout: 180000,
      prompt: "Your turn! Answer the three steps to repair generator_control.py",
      react: function (d) {
        return d && d.correct
          ? "Case settled! Combining AND with NOT starts the backup generator right when Ikogosi clinic needs it."
          : "Look closely: both conditions must hold at the same time, so we need AND together with NOT grid online.";
      }
    },
    quiz: {
      event: "kit:quiz-done", timeout: 600000,
      prompt: "Answer the quiz questions, or press Next to skip",
      react: function (d) {
        if (!d) return "Quiz complete!";
        if (d.score >= d.total - 2) return "Excellent work, " + d.score + " out of " + d.total + "!";
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
      else if (p[0] === "mode") b.setMode(p[1]);
      else if (p[0] === "bat") b.setBattery(+p[1]);
      else if (p[0] === "grid") b.setGrid(p[1] === "true");
      else if (p[0] === "take") b.take();
      else if (p[0] === "step") b.step();
      else if (p[0] === "hl") b.highlight(p[1] || null);
    },
    zoom: function (arg) {
      var z = window.StudyScenes && StudyScenes.zoom; if (!z) return;
      var p = String(arg).split(":");
      if (p[0] === "step") z.setStep(+p[1]);
      else if (p[0] === "scen") z.setScenario(+p[1], p[2] === "true");
      else if (p[0] === "reset") z.reset();
      else if (p[0] === "hl") z.highlight(p[1] || null);
    },
    pin: function (arg) { if (window.L02 && L02.showPin) L02.showPin(+arg, true); },
    bridge: function (arg) { if (window.L02 && L02.bridge && arg === "solve") L02.bridge.solve(); }
  },

  script: [
    {
      title: "Welcome",
      steps: [
        { target: ".l-hero .display", cue: "Lesson 2", sparkle: true,
          say: "Welcome to Lesson 2 of Introduction to Computer Programming: Making Decisions with Conditional Logic, Boolean Operators, and Branching." },
        { target: ".l-hero .question", cue: "Our question",
          say: "Here is our guiding question. How does an automated solar microgrid or an ATM decide what action to take when conditions change?" }
      ]
    },
    {
      title: "Do Now",
      steps: [
        { target: "#donow-list", cue: "Your turn", wait: "donow",
          say: "Start with four quick warm-up cards from Lesson 1 on booleans, single equals versus double equals, strings, and compilers. Answer each in your head, reveal it, and mark yourself honestly." }
      ]
    },
    {
      title: "The Story",
      steps: [
        { target: { scene: "story", part: "babatunde" }, action: "story:0", cue: "Storm at Ikogosi",
          say: "Dark rain clouds gather over the Ikogosi Solar Microgrid in Ekiti State, and the community battery bank sinks to eighteen percent." },
        { target: { scene: "story", part: "tari" }, action: "story:1", cue: "Silent generator",
          say: "Tari checks the courtyard. The battery is below twenty percent, yet the diesel backup generator stays completely silent." },
        { target: { scene: "story", part: "amina" }, action: "story:2", cue: "Line 14 bug",
          say: "Amina opens generator control dot py and inspects line fourteen: if battery level is less than twenty and grid power active double equals True, start generator." },
        { target: { scene: "story", part: "tari" }, action: "story:3", cue: "Inverted logic",
          say: "Tari gasps! It only starts if the main grid is active. But during a blackout, the main grid is down, so grid power active is False!" },
        { target: { scene: "story", part: "babatunde" }, action: "story:4", cue: "Fix the condition",
          say: "Chief Babatunde points to the flickering clinic lights. We must invert that condition with NOT on the logic switchboard right away." }
      ]
    },
    {
      title: "Wonder Wall",
      steps: [
        { target: "#wall-wonder", cue: "Pin your idea", wait: "note",
          say: "Pin your prediction on the Wonder Wall. How does a single logical word like AND, OR, or NOT change whether an emergency machine starts or stays off?" }
      ]
    },
    {
      title: "Sort Game",
      steps: [
        { target: "#bool-sort", cue: "True or False?",
          say: "First, let us evaluate eight boolean expressions. Remember the order: relational comparisons first, then NOT, then AND, and finally OR." },
        { target: "#bool-sort", cue: "Your turn", wait: "sort",
          say: "Your turn. Drag each expression into Evaluates to True or Evaluates to False, then tap Check." }
      ]
    },
    {
      title: "Virtual Lab",
      steps: [
        { target: "#method-cards", action: "bench:reset", cue: "Four method steps",
          say: "Now the 3D logic switchboard. Follow the four method cards: set battery and grid sensors, select the gate wiring, test the relay, and verify blackout safety." },
        { target: { scene: "bench", part: "batteryDial" }, action: "bench:mode:buggy", cue: "Buggy AND gate",
          say: "Look at the battery dial at eighteen percent and the grid switch offline. In the buggy AND mode, the generator relay stays off because grid online is False." },
        { target: { scene: "bench", part: "notGate" }, action: "bench:mode:fixed", cue: "Fixed AND NOT gate",
          say: "Now switch to Fixed AND NOT. The NOT gate flips grid offline from False to True, the AND gate receives two Trues, and the generator relay energizes!" },
        { target: { scene: "bench", part: "relay" }, action: "bench:take", cue: "First trial",
          say: "We log our first trial into the truth table: eighteen percent battery and grid offline gives Relay ON." },
        { target: "#bench-stage", cue: "Your turn", wait: "bench",
          say: "Your turn! Tap Next combo or Test relay to record all five truth-table trials, and compare Fixed AND NOT against Buggy AND and OR." },
        { target: "#expected", action: "open:#expected", cue: "Expected truth table",
          say: "Compare your recorded rows with the expected five-row truth table, then answer the three practical analysis questions below." }
      ]
    },
    {
      title: "Make Sense",
      steps: [
        { target: "#props-table", cue: "Operators table",
          say: "Let us make sense of the rules. Relational operators like double equals, not equal to, less than, and greater than or equal to compare two values and return True or False." },
        { target: "#bool-math", cue: "Boolean algebra",
          say: "Logical operators combine those truths. NOT binds tightest, followed by AND which needs both sides True, and OR which needs at least one side True." },
        { target: "#eq-branch", cue: "Flowchart diamonds",
          say: "In a flowchart, every conditional decision is drawn inside a diamond with mutually exclusive True and False exit arrows." },
        { target: "#pos-explorer", action: "pin:0", cue: "Your turn", wait: "pin",
          say: "Your turn. Tap the JAMB score and NEPA tariff pins to see which branch of the if, elif, else ladder runs first." }
      ]
    },
    {
      title: "Concept Zoom",
      steps: [
        { target: { scene: "zoom", part: "rootDiamond" }, action: "zoom:step:1", cue: "Root decision diamond",
          say: "Zoom inside our 3D decision tree. Stage one tests the root diamond: is battery less than twenty percent?" },
        { target: { scene: "zoom", part: "secondDiamond" }, action: "zoom:step:2", cue: "Secondary diamond",
          say: "When True, the token flows down the True branch to the second diamond: is not grid online True? Try toggling the scenario buttons to watch the path switch." }
      ]
    },
    {
      title: "Worked Examples & Bridge",
      steps: [
        { target: ["#ex1", "#ex2"], action: "zoom:reset", cue: "Worked examples",
          say: "Study the two worked examples: first, an ATM cash withdrawal validation checking balance and daily limit, leaving fifteen thousand naira; second, a NEPA tariff band selector." },
        { target: "#bridge-steps", cue: "Repair the script", wait: "bridge",
          say: "Now back to Ikogosi Station! Answer the three steps in the Bridge Challenge to repair line fourteen of generator control dot py." }
      ]
    },
    {
      title: "Quiz & Reflection",
      steps: [
        { target: "#quiz-list", cue: "Quiz", wait: "quiz",
          say: "Time for the quiz: twelve WAEC, NECO, and JAMB questions plus two review questions from Lesson 1." },
        { target: "#reflect", cue: "Reflect & Assignment",
          say: "Finish by rating your confidence from one to four, completing the exit ticket and blank-page recall, and tackling the thirty-mark assignment. Well done!" }
      ]
    }
  ]
};
