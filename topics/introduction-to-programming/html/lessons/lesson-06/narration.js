/* ==========================================================
   StudyPipe — Lesson 06 StudyNarrator Choreography (en-NG)
   26 steps. Symbols and bases are spelled out for clear speech
   ("zero x seven E", "zero one one one one one one zero base two").
   ========================================================== */
window.NARRATION = {
  rate: 0.96,
  pitch: 1.01,

  waits: {
    donow: {
      event: "kit:donow", timeout: 120000,
      prompt: "Flip the four Do Now cards and mark each one",
      react: function () { return "Great retrieval! Now let us head to the Ikogosi Microgrid Control Station for the final system reboot."; }
    },
    note: {
      event: "kit:note", timeout: 120000,
      prompt: "Type your prediction (or tap a seed) and pin it to the Wonder Wall",
      react: function () { return "Pinned! Now let us classify the three families of programming bugs before we step onto the recovery console."; }
    },
    sort: {
      event: "l06:sort", timeout: 180000,
      prompt: "Sort all 9 bug cards into Syntax, Run-Time or Logic error, then tap Check",
      react: function (d) {
        if (!d || d.total == null) return "You can retry the bug sorting anytime.";
        if (d.correct === d.total) return "Sharp mind! All " + d.total + " bugs classified accurately.";
        return "You got " + d.correct + " out of " + d.total + ". Check the explanations below, then let us move to the 3D recovery console.";
      }
    },
    bench: {
      event: "l06:bench-done", timeout: 300000,
      prompt: "Your turn! Match 0x7E (01111110) and step through the 4 trace rows or tap Authenticate & Boot",
      react: function () { return "Brilliant work! Register zero x seven E is matched, sum even is thirty-six with count two, and the fifty hertz microgrid contactor is closed!"; }
    },
    pin: {
      event: "l06:pin", timeout: 120000,
      prompt: "Your turn! Tap the status byte pins to inspect their 4-bit nibbles and decimal values",
      react: function () { return "Notice how every two-digit hex byte splits cleanly into an upper four-bit nibble and a lower four-bit nibble."; }
    },
    bridge: {
      event: "l06:bridge", timeout: 180000,
      prompt: "Your turn! Complete the three verification steps to restore power across Ikogosi",
      react: function (d) {
        return d && d.correct
          ? "Mystery solved! The Ikogosi Smart Solar Microgrid is back online at one hundred and seventy kilowatts!"
          : "Check each step carefully: zero x seven E is zero one one one one one one zero base two, and fourteen plus twenty-two gives thirty-six.";
      }
    },
    quiz: {
      event: "kit:quiz-done", timeout: 600000,
      prompt: "Answer the quiz questions, or press Next to skip",
      react: function (d) {
        if (!d) return "Quiz complete!";
        if (d.score >= d.total - 2) return "Outstanding, " + d.score + " out of " + d.total + "!";
        return "You scored " + d.score + " out of " + d.total + ". Read the explanations on the questions you missed.";
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
      else if (p[0] === "byte") b.setByte(+p[1]);
      else if (p[0] === "step") b.step();
      else if (p[0] === "take") b.take();
      else if (p[0] === "hl") b.highlight(p[1] || null);
    },
    zoom: function (arg) {
      var z = window.StudyScenes && StudyScenes.zoom; if (!z) return;
      var p = String(arg).split(":");
      if (p[0] === "tier") z.setTier(+p[1]);
      else if (p[0] === "byte") z.setByte(+p[1]);
      else if (p[0] === "reset") z.reset();
      else if (p[0] === "hl") z.highlight(p[1] || null);
    },
    pin: function (arg) { if (window.L06 && L06.showPin) L06.showPin(+arg, true); },
    bridge: function (arg) { if (window.L06 && L06.bridge && arg === "solve") L06.bridge.solve(); }
  },

  script: [
    {
      title: "Welcome",
      steps: [
        { target: ".l-hero .display", cue: "Lesson 6 Finale", sparkle: true,
          say: "Welcome, scholar, to Lesson 6, our grand finale: Silicon Roots and the Exam Clinic, covering binary, hexadecimal, dry-run trace tables, and full system recovery." },
        { target: ".l-hero .question", cue: "Guiding question",
          say: "Here is our guiding question: how do logic gates, truth tables, and hexadecimal status codes translate to high-level mastery, and how do we ace the WAEC programming paper?" }
      ]
    },
    {
      title: "Do Now",
      steps: [
        { target: "#donow-list", cue: "Warm-up retrieval", wait: "donow",
          say: "Warm up with four quick retrieval cards from Lessons 2, 4, and 5 on function keywords, local scope, zero-based array lookup, and boolean negation." }
      ]
    },
    {
      title: "The Story",
      steps: [
        { target: { scene: "story", part: "tari" }, action: "story:0", cue: "Ready for reboot",
          say: "The rainstorm over Ikogosi has cleared. On the central console, Tari spots the prompt: System Status, Ready for Reboot." },
        { target: { scene: "story", part: "amina" }, action: "story:1", cue: "Five modules patched",
          say: "Amina checks off every module we fixed across the unit: integer type casting, boolean generator logic, bounded loops, zero-to-seven battery indexing, and modular tariff functions." },
        { target: { scene: "story", part: "babatunde" }, action: "story:2", cue: "Parity lock 0x7E",
          say: "Chief Babatunde points to the central inverter cabinet. Before the high-voltage contactor can close, the hardware requires the eight-bit binary parity for hexadecimal register zero x seven E." },
        { target: { scene: "story", part: "tari" }, action: "story:3", cue: "Nibble conversion",
          say: "Tari splits zero x seven E into two four-bit nibbles: seven is zero one one one base two, and E is fourteen, which is one one one zero base two. Joined together, that is zero one one one one one one zero, or one hundred and twenty-six in decimal!" },
        { target: { scene: "story", part: "amina" }, action: "story:4", cue: "Power restored!",
          say: "Amina runs the verified master boot script. The relays click shut, the clinic vaccine fridge cools to three point eight degrees Celsius, and the town floodlights shine across Ikogosi!" }
      ]
    },
    {
      title: "Wonder Wall",
      steps: [
        { target: "#wall-wonder", cue: "Pin your prediction", wait: "note",
          say: "Pause and think: how does combining high-level Python fluency with low-level binary and hexadecimal make you an unstoppable problem solver? Pin your idea to the Wonder Wall." }
      ]
    },
    {
      title: "Sort Game",
      steps: [
        { target: "#bug-sort", cue: "3 classes of bugs",
          say: "Activity 1: Every programmer and WAEC candidate must distinguish three bug families. Syntax errors break language grammar before execution. Run-time errors crash when an illegal operation runs. Logic errors run smoothly without crashing, but produce the wrong result." },
        { target: "#bug-sort", cue: "Your turn", wait: "sort",
          say: "Your turn! Drag or tap each of the nine bug cards into Syntax error, Run-time error, or Logic error, then tap Check." }
      ]
    },
    {
      title: "Virtual Lab",
      steps: [
        { target: "#method-cards", action: "bench:reset", cue: "Four recovery steps",
          say: "Now step up to the 3D Recovery and Trace Console. Follow the four method cards: set the eight-bit register to zero x seven E, step through the four-element dry-run trace, inspect sum even and count, and close the fifty hertz contactor." },
        { target: { scene: "bench", part: "switches" }, action: "bench:byte:126", cue: "8-bit switch bank",
          say: "Look at the eight toggle switches on the left. When set to zero one one one one one one zero, the dual decoder screen confirms zero x seven E, decimal one hundred and twenty-six." },
        { target: { scene: "bench", part: "traceScreen" }, action: "bench:step", cue: "Step 1 · v = 14",
          say: "Watch the first trace step on the array fourteen, seven, twenty-two, nine. At index zero, v is fourteen. Fourteen modulo two double equals zero is True, so sum even becomes fourteen and count becomes one." },
        { target: { scene: "bench", part: "traceScreen" }, action: "bench:step", cue: "Step 2 · v = 7",
          say: "At index one, v is seven. Seven modulo two leaves remainder one, so the condition is False. Seven is skipped, and sum even stays fourteen." },
        { target: "#bench-stage", cue: "Your turn", wait: "bench",
          say: "Your turn! Tap Step trace to finish the remaining array elements, or tap Authenticate and Boot to close the main contactor and record the complete table." },
        { target: "#expected", action: "open:#expected", cue: "Expected trace table",
          say: "Compare your recorded trace with the expected WAEC model table, then attempt the analysis questions below." }
      ]
    },
    {
      title: "Make Sense",
      steps: [
        { target: "#def-bases", cue: "Binary & hexadecimal",
          say: "Let us make sense of the silicon roots. Binary is base two, using weights from one hundred and twenty-eight down to one. Hexadecimal is base sixteen, where each hex digit maps cleanly to a four-bit binary nibble." },
        { target: "#props-table", cue: "Bug taxonomy & WAEC rubric",
          say: "Review the comparison table of syntax, run-time, and logic errors, along with how WAEC examiners award marks for initialization, loop conditions, and chronological trace rows." },
        { target: "#pos-explorer", action: "pin:1", cue: "Your turn", wait: "pin",
          say: "Your turn! Tap the six status byte pins to see how each two-digit hexadecimal code splits into two four-bit nibbles and converts to decimal." }
      ]
    },
    {
      title: "Zoom",
      steps: [
        { target: { scene: "zoom", part: "pythonTier" }, action: "zoom:tier:0", cue: "Tier 1 · Python",
          say: "Zoom into the Silicon Bridge. At the top tier, we write human-readable Python: if total is greater than or equal to thirty, unlock inverter zero x seven E." },
        { target: { scene: "zoom", part: "hexTier" }, action: "zoom:tier:2", cue: "Tier 3 · Hex & Binary",
          say: "Two tiers down, the compiler and assembler pack that instruction into raw eight-bit register bytes: zero x seven E, stored as zero one one one one one one zero." },
        { target: { scene: "zoom", part: "cmosTier" }, action: "zoom:tier:3", cue: "Tier 4 · CMOS Gates",
          say: "At the silicon floor, CMOS transistors switch between zero volts for binary zero and three point three volts for binary one, energizing the physical contactor coil!" }
      ]
    },
    {
      title: "Worked Examples",
      steps: [
        { target: ["#ex1", "#ex2"], action: "zoom:reset", cue: "Worked examples",
          say: "Study the two worked examples: first, a complete WAEC even-number filter trace table with step-by-step arithmetic; second, converting hexadecimal zero x four A to binary zero one zero zero one zero one zero and decimal seventy-four, plus the classic in-place variable swap." }
      ]
    },
    {
      title: "Solving the Mystery",
      steps: [
        { target: "#bridge-steps", cue: "Final reboot verification", wait: "bridge",
          say: "Now complete the three-step Bridge Challenge to verify the master script and permanently restore power to Ikogosi!" }
      ]
    },
    {
      title: "Quiz & Reflection",
      steps: [
        { target: "#quiz-list", cue: "12-question exam clinic", wait: "quiz",
          say: "Time for the Instant Quiz: twelve WAEC, NECO, and JAMB questions plus two spaced-retrieval review items." },
        { target: "#reflect", cue: "Reflect & assignment",
          say: "Finally, rate your mastery from one to four, complete the exit ticket and blank-page recall, and tackle the thirty-mark written examination paper in the assignment. Congratulations on completing Introduction to Computer Programming!" }
      ]
    }
  ]
};
