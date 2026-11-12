/* ==========================================================
   Lesson 01 · StudyNarrator Choreography (en-NG) — 26 steps
   Symbols and operators are spelled out naturally for speech synthesis.
   ========================================================== */
window.NARRATION = {
  rate: 0.96,
  pitch: 1.01,

  waits: {
    note: {
      event: "kit:note", timeout: 120000,
      prompt: "Type your prediction (or tap a seed) and pin it to the Wonder Wall",
      react: function () { return "Pinned! Now let us classify programming languages and translators."; }
    },
    sort: {
      event: "l01:sort", timeout: 180000,
      prompt: "Sort all 9 cards into High-Level Languages, Translators, or Low-Level Code, then tap Check",
      react: function (d) {
        if (!d || d.total == null) return "You can revisit the sorting activity anytime.";
        if (d.correct === d.total) return "Excellent! All " + d.total + " terms sorted into their exact category.";
        return "You got " + d.correct + " out of " + d.total + ". Check the feedback notes below, then let us step onto the RAM bench.";
      }
    },
    bench: {
      event: "l01:bench-done", timeout: 300000,
      prompt: "Your turn! Tap 'Allocate & Execute' through the 5 memory and type-casting steps",
      react: function () { return "Well done! You allocated integers, floats, and strings in RAM, triggered the string-plus-integer TypeError, and fixed it with int casting to get one hundred and seventy."; }
    },
    pin: {
      event: "l01:pin", timeout: 120000,
      prompt: "Your turn! Tap the expression pins to inspect data types, floor division, modulus, and operator precedence",
      react: function () { return "Spot on! Notice how quotation marks, floor division, and operator precedence change both the value and the data type."; }
    },
    bridge: {
      event: "l01:bridge", timeout: 180000,
      prompt: "Your turn! Fix all three bugs in Amina's Ikogosi solar sensor script",
      react: function (d) {
        return d && d.correct
          ? "Telemetry restored! Valid variable naming and explicit int and str casting cleared every bug."
          : "Look closely at the variable naming rules and where int or str casting is needed.";
      }
    },
    quiz: {
      event: "kit:quiz-done", timeout: 600000,
      prompt: "Answer the 12 WAEC, NECO and JAMB quiz questions, or press Next to skip",
      react: function (d) {
        if (!d) return "Quiz complete!";
        if (d.score >= d.total - 2) return "Outstanding! " + d.score + " out of " + d.total + " on the exam practice quiz!";
        return "You scored " + d.score + " out of " + d.total + ". Review the explanations on any question you missed.";
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
      else if (p[0] === "preset") b.selectPreset(p[1]);
      else if (p[0] === "take") b.take();
      else if (p[0] === "hl") b.highlight(p[1] || null);
    },
    zoom: function (arg) {
      var z = window.StudyScenes && StudyScenes.zoom; if (!z) return;
      var p = String(arg).split(":");
      if (p[0] === "step") z.setStep(+p[1]);
      else if (p[0] === "trans") z.setTranslator(p[1]);
      else if (p[0] === "raw") z.setRawStr(p[1]);
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
          say: "Welcome to Lesson 1 of Introduction to Computer Programming: From Logic to Code — Programming Languages, Translators, and Memory Variables." },
        { target: ".l-hero .question", cue: "Guiding question",
          say: "Here is our guiding question: how does a computer convert human instructions into physical machine action, and how does it store information in memory?" }
      ]
    },
    {
      title: "Do Now",
      steps: [
        { target: "#donow-list", cue: "Warm-up cards", wait: "donow",
          say: "Begin with four quick Do Now retrieval cards on binary digits, basic algebra substitution, RAM volatility, and four-bit binary conversion." }
      ]
    },
    {
      title: "The Story",
      steps: [
        { target: { scene: "story", part: "amina" }, action: "story:0", cue: "Ikogosi Control Room",
          say: "Inside the Ikogosi Smart Solar Microgrid control room in Ekiti State, thunder rolls outside as Amina and Tari boot the maintenance terminal." },
        { target: { scene: "story", part: "amina" }, action: "story:1", cue: "System TypeError",
          say: "Amina plugs in the serial cable, and the status screen flashes red: System Error, TypeError, can only concatenate string to string." },
        { target: { scene: "story", part: "tari" }, action: "story:2", cue: "Line 12 mystery",
          say: "Tari reads line twelve on the monitor: total power equals quote one hundred and fifty quote plus twenty. He wonders why a processor with millions of transistors cannot add one hundred and fifty and twenty." },
        { target: { scene: "story", part: "amina" }, action: "story:3", cue: "The quotation marks",
          say: "Amina spots the culprit: the quotation marks tell the computer that one hundred and fifty is text letters, not a mathematical number!" },
        { target: { scene: "story", part: "babatunde" }, action: "story:4", cue: "Chief Babatunde arrives",
          say: "Chief Babatunde rushes in with a multimeter, worried the solar inverter has burned out. Amina assures him the hardware is safe and promises to trace the software bug." }
      ]
    },
    {
      title: "Wonder Wall",
      steps: [
        { target: "#wall-wonder", cue: "Pin your prediction", wait: "note",
          say: "Before we test the code, pin your prediction on the Wonder Wall: why does writing fifty inside quotes behave completely differently from writing fifty without quotes?" }
      ]
    },
    {
      title: "Sort Game",
      steps: [
        { target: "#prog-sort", cue: "Languages & Translators",
          say: "First, let us classify our tools. High-level languages like Python and BASIC use English-like words. Low-level code includes binary machine language and assembly mnemonics. Language translators convert between them." },
        { target: "#prog-sort", cue: "Your turn", wait: "sort",
          say: "Your turn! Drag or tap each of the nine cards into High-Level Languages, Language Translators, or Low-Level Code, then tap Check." }
      ]
    },
    {
      title: "Virtual Lab",
      steps: [
        { target: "#method-cards", action: "bench:reset", cue: "Four lab steps",
          say: "Now step onto the 3D Variable and Memory Allocation Bench. Follow the four method cards: allocate typed variables in RAM, observe their byte sizes, trigger the string-plus-integer TypeError, and resolve it with integer casting." },
        { target: { scene: "bench", part: "slot1" }, action: "bench:preset:slot1", cue: "RAM Slot 0x01",
          say: "Look at RAM slot zero x zero one. It stores the integer variable voltage equals two hundred and thirty in two bytes of memory." },
        { target: { scene: "bench", part: "alu" }, action: "bench:preset:mismatch", cue: "The TypeError trap",
          say: "When the ALU tries to evaluate quote one hundred and fifty quote plus twenty without casting, the board flashes a TypeError because a string and an integer cannot be added directly." },
        { target: { scene: "bench", part: "display" }, action: "bench:preset:cast", cue: "Explicit int() cast",
          say: "Applying int of quote one hundred and fifty quote plus twenty converts the text into a binary integer first, and the ALU cleanly outputs one hundred and seventy kilowatt-hours." },
        { target: "#bench-stage", action: "bench:reset", cue: "Your turn", wait: "bench",
          say: "Your turn! Tap Allocate and Execute five times to record all five memory and type-casting steps into your results table." },
        { target: "#expected", action: "open:#expected", cue: "Expected results",
          say: "Compare your recorded rows with the expected memory table, then answer the three practical analysis questions below." }
      ]
    },
    {
      title: "Make Sense",
      steps: [
        { target: "#def-program", cue: "Core definitions",
          say: "Let us connect our findings to formal definitions. A computer program is a sequence of logical instructions executed by hardware. Source code is human-readable; machine code is binary zeros and ones." },
        { target: "#props-table", cue: "Compiler vs Interpreter",
          say: "Compare a compiler and an interpreter. A compiler translates the entire source program into a standalone object file before execution, whereas an interpreter translates and executes line by line at runtime, halting on the first error." },
        { target: "#var-rules", cue: "Variable naming & types",
          say: "Remember the identifier rules for WAEC and JAMB: a variable name must start with a letter or underscore, contain no spaces, and never use reserved keywords like class or for." },
        { target: "#pos-explorer", action: "pin:1", cue: "Your turn", wait: "pin",
          say: "Your turn! Tap through the six expression pins to inspect type casting, string concatenation, floor division, modulus remainder, and operator precedence." }
      ]
    },
    {
      title: "Concept Zoom",
      steps: [
        { target: { scene: "zoom", part: "sourceStage" }, action: "zoom:step:0", cue: "Translation pipeline",
          say: "Now zoom into the 3D Translation Pipeline. Stage one receives the high-level Python source statement, and stage two breaks it into six lexical tokens." },
        { target: { scene: "zoom", part: "translatorGate" }, action: "zoom:step:2", cue: "Compiler vs Interpreter gate",
          say: "At stage three, toggle between Compiler single-pass translation and Interpreter line-by-line execution. At stage four, watch the eight-bit binary voltage pulses drive the silicon ALU." }
      ]
    },
    {
      title: "Worked Examples",
      steps: [
        { target: ["#ex1", "#ex2"], action: "zoom:reset", cue: "Worked examples",
          say: "Study the three worked examples. Example one calculates a fifteen percent airtime recharge bonus in Python and BASIC, yielding one thousand one hundred and fifty Naira. Example two converts eighty-five kilowatt-hour units from string to integer and adds seven point five percent VAT to get six thousand two hundred and thirteen Naira fifty kobo." }
      ]
    },
    {
      title: "Bridge Challenge",
      steps: [
        { target: "#bridge-steps", cue: "Fix sensor_log.py", wait: "bridge",
          say: "Back to the Ikogosi control room! Step through the three bugs in Amina's sensor log script to restore live solar telemetry." }
      ]
    },
    {
      title: "Quiz & Reflection",
      steps: [
        { target: "#quiz-list", cue: "12 Exam MCQs", wait: "quiz",
          say: "Now test yourself on twelve WAEC, NECO, and JAMB multiple-choice questions with instant explanations." },
        { target: "#reflect", cue: "Reflect & Assignment",
          say: "Finally, rate your confidence from one to four, complete the exit ticket and blank-page recall, and tackle the household data audit and thirty-mark written assignment. Well done in Lesson 1!" }
      ]
    }
  ]
};
