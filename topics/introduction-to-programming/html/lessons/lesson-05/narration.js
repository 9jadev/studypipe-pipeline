/* ==========================================================
   StudyPipe — Lesson 05 StudyNarrator Choreography (en-NG)
   26 steps · Symbols spelled out for TTS ("def", "seven point five percent",
   "seven thousand seven hundred and thirteen naira fifty kobo").
   ========================================================== */
window.NARRATION = {
  rate: 0.96,
  pitch: 1.01,

  waits: {
    donow: {
      event: "kit:donow",
      timeout: 120000,
      prompt: "Reveal and mark each Do Now card to warm up your memory",
      react: function () { return "Great recall! Now let us head to the Ikogosi Microgrid Station."; }
    },
    note: {
      event: "kit:note",
      timeout: 120000,
      prompt: "Type your prediction (or tap a seed) and pin it to the Wonder Wall",
      react: function () { return "Pinned! Let us classify the parts of a function before we test the Function Factory."; }
    },
    sort: {
      event: "l05:sort",
      timeout: 180000,
      prompt: "Sort all 8 code statements into Header, Local Body, or Return/Caller, then tap Check",
      react: function (d) {
        if (!d || d.total == null) return "You can revisit the sort activity anytime.";
        if (d.correct === d.total) return "Spot on! All " + d.total + " function statements sorted accurately.";
        return "You got " + d.correct + " out of " + d.total + ". Review the explanations below, then step up to the Function Factory bench.";
      }
    },
    bench: {
      event: "l05:bench-done",
      timeout: 300000,
      prompt: "Your turn! Call calculate_nepa_bill() for at least three household unit presets on the bench",
      react: function () {
        return "Excellent! Notice that every call computes its own local energy cost and VAT inside the dome, while the global revenue pillar stays completely safe.";
      }
    },
    pin: {
      event: "l05:pin",
      timeout: 120000,
      prompt: "Your turn! Tap the household meter pins to compare their local stack frames and return values",
      react: function () {
        return "See how one six-line function handles eighty-five, one hundred and twenty, or two hundred and ten kilowatt-hours without repeating code.";
      }
    },
    bridge: {
      event: "l05:bridge",
      timeout: 180000,
      prompt: "Your turn! Complete the three steps to refactor billing.py and fix the smart meters",
      react: function (d) {
        return d && d.correct
          ? "Mystery solved! One modular function with local scope fixes all two hundred and fifty smart meters at once."
          : "Look closely: local variables inside a function live in a temporary stack frame and never overwrite global variables.";
      }
    },
    quiz: {
      event: "kit:quiz-done",
      timeout: 600000,
      prompt: "Answer the quiz questions, or press Next to skip",
      react: function (d) {
        if (!d) return "Quiz complete!";
        if (d.score >= d.total - 2) return "Outstanding score, " + d.score + " out of " + d.total + "!";
        return "You scored " + d.score + " out of " + d.total + ". Check the model explanations on any questions you missed.";
      }
    }
  },

  actions: {
    story: function (arg) {
      if (window.StudyScenes && StudyScenes.story) StudyScenes.story.beat(+arg);
    },
    open: function (arg) {
      var el = document.querySelector(arg);
      if (el && el.tagName === "DETAILS") el.open = true;
    },
    bench: function (arg) {
      var b = window.StudyScenes && StudyScenes.bench;
      if (!b) return;
      var p = String(arg).split(":");
      if (p[0] === "reset") b.reset();
      else if (p[0] === "units") b.setUnits(+p[1]);
      else if (p[0] === "stage") b.setStage(p[1]);
      else if (p[0] === "take") b.take();
      else if (p[0] === "step") b.step();
      else if (p[0] === "hl") b.highlight(p[1] || null);
    },
    zoom: function (arg) {
      var z = window.StudyScenes && StudyScenes.zoom;
      if (!z) return;
      var p = String(arg).split(":");
      if (p[0] === "step") z.setStep(+p[1]);
      else if (p[0] === "units") z.setUnits(+p[1]);
      else if (p[0] === "next") z.next();
      else if (p[0] === "reset") z.reset();
      else if (p[0] === "hl") z.highlight(p[1] || null);
    },
    pin: function (arg) {
      if (window.L05 && L05.showPin) L05.showPin(+arg, true);
    },
    bridge: function (arg) {
      if (window.L05 && L05.bridge && arg === "solve") L05.bridge.solve();
    }
  },

  script: [
    {
      title: "Welcome",
      steps: [
        {
          target: ".l-hero .display",
          cue: "Lesson 5",
          sparkle: true,
          say: "Welcome to Lesson 5: Modular Architecture, Functions, Scope, and Reusability."
        },
        {
          target: ".l-hero .question",
          cue: "Guiding question",
          say: "Here is our guiding question: how do developers build complex software systems without repeating the same calculations dozens of times?"
        }
      ]
    },
    {
      title: "Do Now",
      steps: [
        {
          target: "#donow-list",
          cue: "Warm up",
          wait: "donow",
          say: "Begin with four quick retrieval cards from earlier lessons: zero-based indexing, the len function, infinite loops, and string concatenation."
        }
      ]
    },
    {
      title: "The Story",
      steps: [
        {
          target: { scene: "story", part: "babatunde" },
          action: "story:0",
          cue: "Billing protest",
          say: "Outside the Ikogosi Microgrid Station, Chief Babatunde reports that neighbours who used eighty-five units of electricity are getting completely different smart meter bills."
        },
        {
          target: { scene: "story", part: "terminal" },
          action: "story:1",
          cue: "12 copies in billing.py",
          say: "Inside the control room, Amina inspects billing dot py. The exact same fifteen-line tariff calculation was copy-pasted twelve different times across the file!"
        },
        {
          target: { scene: "story", part: "terminal" },
          action: "story:2",
          cue: "5% vs 7.5% VAT",
          say: "Tari spots why the bills disagree: in one copy, the VAT rate was updated to seven point five percent, giving seven thousand seven hundred and thirteen naira fifty kobo, but in three other copies an old five percent rate was left behind!"
        },
        {
          target: { scene: "story", part: "smartMeter" },
          action: "story:3",
          cue: "Global scope collision",
          say: "Even worse, Amina sees that a variable named total inside one copy-pasted block ran in global scope and overwrote the station's global total revenue counter."
        },
        {
          target: { scene: "story", part: "amina" },
          action: "story:4",
          cue: "One modular function",
          say: "Amina announces the fix: package the tariff logic into a single modular function with isolated local scope. Update the function once, and all two hundred and fifty meters are accurate!"
        }
      ]
    },
    {
      title: "Wonder Wall",
      steps: [
        {
          target: "#wall-wonder",
          cue: "Pin your prediction",
          wait: "note",
          say: "Before we build the function, pin your idea on the Wonder Wall: how does packaging code into independent functions protect variables from interfering with each other?"
        }
      ]
    },
    {
      title: "Sort Game",
      steps: [
        {
          target: "#fn-sort",
          cue: "Function anatomy",
          say: "Every modular function has three parts: the header with its def keyword and formal parameters, the indented body where local variables do the work, and the return statement or caller interface."
        },
        {
          target: "#fn-sort",
          cue: "Your turn",
          wait: "sort",
          say: "Your turn! Drag or tap each of the eight code cards into its matching bin, then click Check my sorting."
        }
      ]
    },
    {
      title: "Virtual Lab",
      steps: [
        {
          target: "#method-cards",
          action: "bench:reset",
          cue: "Four method steps",
          say: "Now step up to the Modular Function Factory bench. Follow the four method steps: select input units, step inside the local dome, inspect the global revenue pillar, and return the final bill."
        },
        {
          target: { scene: "bench", part: "hopper" },
          action: "bench:units:85",
          cue: "Parameter hopper",
          say: "Here is the input hopper. When we pass eighty-five kilowatt-hours into calculate nepa bill, the argument drops into the function parameter slot."
        },
        {
          target: { scene: "bench", part: "localDome" },
          action: "bench:stage:local",
          cue: "One-Way Glass dome",
          say: "Inside the translucent local scope dome, energy cost equals five thousand seven hundred and eighty naira, and VAT equals four hundred and thirty-three naira fifty kobo. These local variables are invisible to the outside program."
        },
        {
          target: { scene: "bench", part: "returnChute" },
          action: "bench:take",
          cue: "Return value",
          say: "When the function executes return, the final bill of seven thousand seven hundred and thirteen naira fifty kobo slides down the return chute, while the global revenue pillar remains untouched."
        },
        {
          target: "#bench-stage",
          cue: "Your turn",
          wait: "bench",
          say: "Your turn! Select one hundred and twenty kilowatt-hours and two hundred and ten kilowatt-hours, and click Call and Return Bill to record at least three calls."
        },
        {
          target: "#expected",
          action: "open:#expected",
          cue: "Compare results",
          say: "Compare your recorded calls with the expected table, then answer the practical analysis questions below."
        }
      ]
    },
    {
      title: "Make Sense",
      steps: [
        {
          target: "#def-dry",
          cue: "DRY & Modularity",
          say: "Let us connect what you observed to software engineering principles. DRY stands for Don't Repeat Yourself: write a calculation once inside a named function and call it wherever needed."
        },
        {
          target: "#eq-scope",
          cue: "One-Way Glass of Scope",
          say: "Variable scope works like one-way glass: code inside a function can read global constants outside, but outer code cannot peek into or overwrite local variables inside the function."
        },
        {
          target: "#props-table",
          cue: "Local vs Global",
          say: "Check the comparison table: formal parameters and local variables live only during the function call, whereas global variables persist for the whole program run."
        },
        {
          target: "#pos-explorer",
          action: "pin:1",
          cue: "Your turn",
          wait: "pin",
          say: "Your turn! Tap the six household meter pins to inspect the local stack frame and returned bill for each call."
        }
      ]
    },
    {
      title: "Concept Zoom",
      steps: [
        {
          target: { scene: "zoom", part: "stackFrame" },
          action: "zoom:step:1",
          cue: "Push stack frame",
          say: "Zoom into RAM to watch the call stack in action. In Phase 1, calling calculate nepa bill pushes a fresh stack frame onto memory and binds units equals eighty-five."
        },
        {
          target: { scene: "zoom", part: "localVars" },
          action: "zoom:step:2",
          cue: "Local execution",
          say: "In Phase 2, the four local variables compute inside the one-way glass shield. In Phase 3, the return orb delivers seven thousand seven hundred and thirteen naira fifty kobo and the stack frame is popped and destroyed!"
        }
      ]
    },
    {
      title: "Worked Examples",
      steps: [
        {
          target: "#ex1",
          action: "zoom:step:3",
          cue: "Example 5.1 · NEPA Tariff",
          say: "Study Worked Example 5.1. Step through the Python code for calculate nepa bill and follow the atomic math steps for eighty-five units and two hundred and ten units."
        },
        {
          target: "#ex2",
          cue: "Example 5.2 · Temperature",
          say: "In Worked Example 5.2, Dr. Folake's clinic sensor uses celsius to fahrenheit to convert thirty-seven point zero degrees Celsius into ninety-eight point six degrees Fahrenheit."
        }
      ]
    },
    {
      title: "Solving the Mystery",
      steps: [
        {
          target: "#bridge-steps",
          cue: "Refactor billing.py",
          wait: "bridge",
          say: "Now return to the Ikogosi control room and complete the three refactoring steps in the Bridge Challenge to fix billing dot py permanently."
        }
      ]
    },
    {
      title: "Quiz & Reflection",
      steps: [
        {
          target: "#quiz-list",
          cue: "12-Question Quiz",
          wait: "quiz",
          say: "Test your mastery on twelve WAEC, NECO, and JAMB multiple-choice questions, plus two spaced-retrieval review questions."
        },
        {
          target: "#reflect",
          cue: "Reflect & Assignment",
          say: "Finally, rate your confidence on all five objectives, complete the exit ticket and blank-page recall, and tackle the thirty-mark written assignment. Well done!"
        }
      ]
    }
  ]
};
