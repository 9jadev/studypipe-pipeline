/* ==========================================================
   StudyPipe — Lesson 03 StudyNarrator Choreography (en-NG)
   25 steps across all 5 inquiry phases.
   Symbols spelled out for voice ("plus equals", "less than", "range one comma six").
   ========================================================== */
window.NARRATION = {
  rate: 0.96,
  pitch: 1.01,

  waits: {
    donow: {
      event: "kit:donow", timeout: 120000,
      prompt: "Reveal and self-mark the Do Now retrieval cards",
      react: function () { return "Great warm-up! Your boolean logic and modulus arithmetic are sharp. Now let us enter the Ikogosi control room."; }
    },
    note: {
      event: "kit:note", timeout: 120000,
      prompt: "Type your prediction (or tap a seed idea) and pin it to the Wonder Wall",
      react: function () { return "Pinned! Every loop needs a changing state or counter that drives its condition toward False."; }
    },
    sort: {
      event: "l03:sort", timeout: 180000,
      prompt: "Sort all 8 cards into FOR Loop vs WHILE Loop, then tap Check my sorting",
      react: function (d) {
        if (!d || d.total == null) return "You can revisit the sorting activity anytime.";
        if (d.correct === d.total) return "Spot on! All " + d.total + " scenarios classified into counter-controlled FOR loops and condition-controlled WHILE loops.";
        return "You got " + d.correct + " out of " + d.total + ". Check the feedback notes below, then let us step onto the 3D loop bench.";
      }
    },
    bench: {
      event: "l03:bench-done", timeout: 300000,
      prompt: "Your turn! Tap Step iteration (or Run all) on the 3D Loop Stepper Bench to record at least 5 steps",
      react: function () {
        return "Excellent! Notice how the accumulator adds each reading step by step—45, 97, 157, 215, 264, 327, up to 382 kilowatt-hours—and the live graph plots the rising curve!";
      }
    },
    pin: {
      event: "l03:pin", timeout: 120000,
      prompt: "Your turn! Tap any pin in the Loop Range & Syntax Explorer to compare Python and BASIC loops",
      react: function () {
        return "Notice how Python's range stops one integer before the stop value, while BASIC's FOR I equals 1 TO N is inclusive.";
      }
    },
    bridge: {
      event: "l03:bridge", timeout: 180000,
      prompt: "Your turn! Answer the three steps to repair solar_monitor.py",
      react: function (d) {
        return d && d.correct
          ? "Case solved! A bounded FOR loop over daily_readings totals 382 kilowatt-hours with an average of 54 point 5 7 kilowatt-hours and stops cleanly."
          : "Look closely at the loop condition: without an update inside a WHILE loop, it runs forever.";
      }
    },
    quiz: {
      event: "kit:quiz-done", timeout: 600000,
      prompt: "Attempt the WAEC, NECO & JAMB quiz questions, or press Next to continue",
      react: function (d) {
        if (!d) return "Quiz complete!";
        if (d.score >= d.total - 2) return "Outstanding work, " + d.score + " out of " + d.total + "!";
        return "You scored " + d.score + " out of " + d.total + ". Review the explanations on the questions you missed.";
      }
    }
  },

  actions: {
    story: function (arg) { if (window.StudyScenes && StudyScenes.story) StudyScenes.story.beat(+arg); },
    open: function (arg) { var el = document.querySelector(arg); if (el && el.tagName === "DETAILS") el.open = true; },
    bench: function (arg) {
      var b = window.StudyScenes && StudyScenes.bench;
      if (!b) return;
      var p = String(arg).split(":");
      if (p[0] === "reset") b.reset();
      else if (p[0] === "ds") b.setDataset(p[1]);
      else if (p[0] === "step") b.step();
      else if (p[0] === "run") b.runAll();
      else if (p[0] === "hl") b.highlight(p[1] || null);
    },
    zoom: function (arg) {
      var z = window.StudyScenes && StudyScenes.zoom;
      if (!z) return;
      var p = String(arg).split(":");
      if (p[0] === "step") z.setStep(+p[1]);
      else if (p[0] === "iter") z.setIter(+p[1]);
      else if (p[0] === "next") z.next();
      else if (p[0] === "reset") z.reset();
      else if (p[0] === "hl") z.highlight(p[1] || null);
    },
    pin: function (arg) { if (window.L03 && L03.showPin) L03.showPin(+arg, true); },
    bridge: function (arg) { if (window.L03 && L03.bridge && arg === "solve") L03.bridge.solve(); }
  },

  script: [
    {
      title: "Welcome",
      steps: [
        { target: ".l-hero .display", cue: "Lesson 3", sparkle: true,
          say: "Welcome to Lesson 3: The Power of Repetition, Counter and Conditional Loops." },
        { target: ".l-hero .question", cue: "Guiding question",
          say: "Here is our guiding question: why write hundreds of lines of code when three lines can automate repetitive tasks thousands of times?" }
      ]
    },
    {
      title: "Do Now",
      steps: [
        { target: "#donow-list", cue: "Your turn", wait: "donow",
          say: "Begin with four quick Do Now retrieval cards from Lessons 1 and 2 on boolean NOT, if-elif-else branches, floating-point types, and the modulus operator." }
      ]
    },
    {
      title: "The Story",
      steps: [
        { target: { scene: "story", part: "amina" }, action: "story:0", cue: "99% CPU Alarm",
          say: "Inside the Ikogosi Microgrid station, the terminal cooling fans are screaming at four thousand two hundred R P M, and processor usage is pinned at ninety-nine percent!" },
        { target: { scene: "story", part: "tari" }, action: "story:1", cue: "Runaway Console",
          say: "Tari spots the console scrolling millions of identical lines: Checking solar array 1, Checking solar array 1." },
        { target: { scene: "story", part: "amina" }, action: "story:2", cue: "Line 22 Bug",
          say: "Amina inspects solar monitor dot py at line 22: while solar output is greater than zero, print Active." },
        { target: { scene: "story", part: "tari" }, action: "story:3", cue: "No Increment",
          say: "Tari realises why it froze: the variable solar output never changes inside the loop body, so the condition stays True forever!" },
        { target: { scene: "story", part: "babatunde" }, action: "story:4", cue: "Clean Termination",
          say: "Chief Babatunde asks how we can check each solar panel or daily reading once, accumulate the total kilowatt-hours, and stop cleanly." }
      ]
    },
    {
      title: "Wonder Wall",
      steps: [
        { target: "#wall-wonder", cue: "Pin your prediction", wait: "note",
          say: "Before we test on the bench, pin your thought to the Wonder Wall: what prevents a computer loop from running forever and draining processor resources?" }
      ]
    },
    {
      title: "Sort Game",
      steps: [
        { target: "#loop-sort", cue: "FOR vs WHILE",
          say: "First activity: classify eight tasks into counter-controlled FOR loops when the number of repetitions is known in advance, versus condition-controlled WHILE loops when waiting for a sensor or user condition." },
        { target: "#loop-sort", cue: "Your turn", wait: "sort",
          say: "Drag or tap each card into its bin, then tap Check my sorting." }
      ]
    },
    {
      title: "3D Loop Stepper Bench",
      steps: [
        { target: { scene: "bench", part: "gear" }, action: "bench:reset", cue: "Brass Stepper Gear",
          say: "Here is our 3D Iterative Loop Stepper Bench. Each tooth on the brass gear advances one iteration of the program counter." },
        { target: { scene: "bench", part: "counterReg" }, action: "bench:hl:counterReg", cue: "Counter Register",
          say: "The Counter Register holds the loop index variable i, while the Accumulator Register next to it holds the running total." },
        { target: { scene: "bench", part: "condDiamond" }, action: "bench:hl:condDiamond", cue: "Condition Diamond",
          say: "Before every cycle, the blue Condition Diamond checks whether more items remain. If you switch to the runaway while loop without an increment, the purple Watchdog beacon trips an emergency halt!" },
        { target: "#bench-stage", action: "bench:hl:", cue: "Your turn", wait: "bench",
          say: "Step through the 7-day solar readings or range 1 to 6, watch the live accumulator graph climb, and test the infinite loop watchdog." }
      ]
    },
    {
      title: "Make Sense",
      steps: [
        { target: "#concepts", cue: "Core Definitions",
          say: "In Make Sense, we connect our bench data to five formal terms: Iteration, Counter, Accumulator, Sentinel Value, and Infinite Loop." },
        { target: "#eq-loop", cue: "Accumulator Math",
          say: "In the accumulator pattern, total equals total plus value. Starting at zero, seven daily solar readings of 45, 52, 60, 58, 49, 63, and 55 add up to 382 kilowatt-hours, with a mean of 54 point 5 7 kilowatt-hours per day." },
        { target: "#pos-explorer", action: "pin:2", cue: "Range Explorer", wait: "pin",
          say: "Tap through the Loop Range Explorer pins to compare Python's range start, stop, step against BASIC's FOR TO STEP syntax." }
      ]
    },
    {
      title: "3D Execution Tracer Zoom",
      steps: [
        { target: { scene: "zoom", part: "initNode" }, action: "zoom:reset", cue: "1. Initialization",
          say: "Now look inside the 3D Loop Jump Tracer. Execution starts at the top Init Node, setting i equal to 1 once." },
        { target: { scene: "zoom", part: "condNode" }, action: "zoom:step:1", cue: "2. Condition Diamond",
          say: "Next, the golden Condition Diamond tests whether i is less than 6. While True, control flows down into the blue Body Node to add the reading into total." },
        { target: { scene: "zoom", part: "backEdgeArc" }, action: "zoom:step:3", cue: "3. Back-Edge Jump",
          say: "At the bottom Step Node, i increments by 1 and the glowing cyan Back-Edge Arc shoots the execution pulse backwards up to the Condition Diamond! When i reaches 6, the condition turns False and exits right through the green Exit Chute." }
      ]
    },
    {
      title: "Worked Examples & Bridge",
      steps: [
        { target: "#ex1", cue: "Worked Example 3.1",
          say: "Study Worked Example 3.1 using the interactive StudyCode tracer for the 7-day solar accumulator, and Example 3.2 for the diesel generator countdown timer." },
        { target: "#bridge-card", cue: "Repair solar_monitor.py", wait: "bridge",
          say: "Now settle the Ikogosi control room mystery in three steps and unlock the Big Idea of Lesson 3." }
      ]
    },
    {
      title: "Quiz, Reflect & Assignment",
      steps: [
        { target: "#quiz", cue: "12 Exam MCQs", wait: "quiz",
          say: "Test yourself on twelve WAEC, NECO, and JAMB questions covering range parameters, dry-run sums, nested loops, break versus continue, and sentinel values." },
        { target: "#assignment", cue: "Home Assignment",
          say: "Finally, rate your confidence, complete the exit ticket, and tackle the 5-hour generator fuel dry-run table and 30-mark exam paper in the Assignment section. Well done!" }
      ]
    }
  ]
};
