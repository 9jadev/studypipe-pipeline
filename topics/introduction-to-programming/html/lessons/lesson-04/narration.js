/* Lesson 04 · StudyNarrator choreography (en-NG). 26 steps.
   Symbols and hex addresses are spelled out for voice synthesis ("index N minus one", "zero x one zero zero zero"). */
window.NARRATION = {
  rate: 0.96,
  pitch: 1.01,

  waits: {
    donow: {
      event: "kit:donow",
      timeout: 120000,
      prompt: "Reveal each Do Now card and mark whether you remembered it",
      react: function () {
        return "Great warm-up! Now let us head to the Ikogosi Clinic telemetry lab.";
      }
    },
    note: {
      event: "kit:note",
      timeout: 120000,
      prompt: "Type your prediction (or tap a seed) and pin it to the Wonder Wall",
      react: function () {
        return "Pinned! Now let us classify common array operations before we test the battery rack.";
      }
    },
    sort: {
      event: "l04:sort",
      timeout: 180000,
      prompt: "Sort all eight array operations into Access/Query or Mutate/Update, then tap Check",
      react: function (d) {
        if (!d || d.total == null) return "You can revisit the sorting activity anytime.";
        if (d.correct === d.total)
          return "Perfect score! All " + d.total + " array operations sorted accurately.";
        return (
          "You got " +
          d.correct +
          " out of " +
          d.total +
          ". Read the feedback notes below, then let us move to the 3D array bench."
        );
      }
    },
    bench: {
      event: "l04:bench-done",
      timeout: 300000,
      prompt: "Your turn! Dial indices 0, 3, 7, and 8 and tap Read index, or run Scan 0..7",
      react: function () {
        return "Excellent! You saw index zero at the base address, found the weak cell at index three, and triggered the IndexError boundary alarm at index eight.";
      }
    },
    pin: {
      event: "l04:pin",
      timeout: 120000,
      prompt: "Your turn! Tap the memory pins to see how each index maps to a byte address",
      react: function () {
        return "Notice that every step in index adds exactly four bytes to the base address zero x one zero zero zero.";
      }
    },
    bridge: {
      event: "l04:bridge",
      timeout: 180000,
      prompt: "Your turn! Answer the three steps to patch battery_check.py and restore the clinic fridge",
      react: function (d) {
        return d && d.correct
          ? "Clinic cooling restored! Using range of len of battery cells checks indices zero through seven safely."
          : "Look closely: an eight-element list has valid indices zero to seven, so range of len of battery cells is the safe loop bound.";
      }
    },
    quiz: {
      event: "kit:quiz-done",
      timeout: 600000,
      prompt: "Answer the quiz questions, or press Next to skip",
      react: function (d) {
        if (!d) return "Quiz complete!";
        if (d.score >= d.total - 2)
          return "Brilliant work, " + d.score + " out of " + d.total + "!";
        return (
          "You scored " +
          d.score +
          " out of " +
          d.total +
          ". Review the explanations on any question you missed."
        );
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
      else if (p[0] === "idx") b.setIndex(+p[1]);
      else if (p[0] === "take") b.take();
      else if (p[0] === "scan") b.scan();
      else if (p[0] === "hl") b.highlight(p[1] || null);
    },
    zoom: function (arg) {
      var z = window.StudyScenes && StudyScenes.zoom;
      if (!z) return;
      var p = String(arg).split(":");
      if (p[0] === "idx") z.setIndex(+p[1]);
      else if (p[0] === "reset") z.reset();
      else if (p[0] === "hl") z.highlight(p[1] || null);
    },
    pin: function (arg) {
      if (window.L04 && L04.showPin) L04.showPin(+arg, true);
    },
    bridge: function (arg) {
      if (window.L04 && L04.bridge && arg === "solve") L04.bridge.solve();
    }
  },

  script: [
    {
      title: "Welcome",
      steps: [
        {
          target: ".l-hero .display",
          cue: "Lesson 4",
          sparkle: true,
          say: "Welcome to Lesson 4: Organising Data with Arrays, Collections, and Zero-Based Indexing."
        },
        {
          target: ".l-hero .question",
          cue: "Guiding question",
          say: "Here is our guiding question. How does a system track readings from fifty solar panels or one hundred students without creating one hundred separate variables?"
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
          say: "Start with four quick Do Now retrieval cards on Python ranges, loop counts, boolean logic, and string casting. Answer in your head first, then reveal."
        }
      ]
    },
    {
      title: "The Story",
      steps: [
        {
          target: { scene: "story", part: "folake" },
          action: "story:0",
          cue: "Clinic fridge alarm",
          say: "At the Ikogosi Health Clinic lab, Doctor Folake raises the alarm: the vaccine refrigerator cooling sensor is offline and the temperature is rising towards ten degrees Celsius!"
        },
        {
          target: { scene: "story", part: "amina" },
          action: "story:1",
          cue: "IndexError on line 34",
          say: "Amina checks the telemetry terminal. Line thirty-four threw a fatal exception: IndexError, list index out of range."
        },
        {
          target: { scene: "story", part: "tari" },
          action: "story:2",
          cue: "range(1, 9) bug",
          say: "Tari inspects battery check dot py: for i in range one comma nine, check cell battery cells of i. Whoever wrote the loop counted from one to eight!"
        },
        {
          target: { scene: "story", part: "amina" },
          action: "story:3",
          cue: "Indices 0 to 7",
          say: "Amina spots the off-by-one bug immediately: with eight battery cells in zero-based indexing, the valid indices are zero through seven. When i reaches eight, Python crashes!"
        },
        {
          target: { scene: "story", part: "babatunde" },
          action: "story:4",
          cue: "To the array bench",
          say: "Chief Babatunde realises that cell zero was skipped and asking for index eight halted the clinic cooling unit. Let us test the eight-slot array rack on the bench."
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
          say: "Before we measure, pin your prediction on the Wonder Wall. Why do computer scientists start counting at zero instead of one?"
        }
      ]
    },
    {
      title: "Sort Game",
      steps: [
        {
          target: "#arr-sort",
          cue: "Access vs Mutate",
          say: "First, sort these eight Python list operations. Some only read or query data without changing the list, while others mutate, update, or resize the list."
        },
        {
          target: "#arr-sort",
          cue: "Your turn",
          wait: "sort",
          say: "Your turn. Drag or tap each card into Access and Query or Mutate and Update, then tap Check."
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
          say: "Now the 3D practical: the Contiguous Array Locker Rack. Follow the four method cards to inspect index zero, index seven, index eight, and scan for the weakest cell."
        },
        {
          target: { scene: "bench", part: "slot0" },
          action: "bench:idx:0",
          cue: "Index 0 at 0x1000",
          say: "At index zero, the motorized pointer targets the first lithium cell at base address zero x one zero zero zero, reading three point two five volts."
        },
        {
          target: { scene: "bench", part: "slot3" },
          action: "bench:idx:3",
          cue: "Weakest cell at Index 3",
          say: "Now look at index three, which is the fourth physical cell at address zero x one zero zero C. Its voltage has dropped to two point nine five volts!"
        },
        {
          target: { scene: "bench", part: "oobZone" },
          action: "bench:idx:8",
          cue: "Index 8 Out of Bounds",
          say: "When we dial index eight at zero x one zero two zero, the pointer crosses into the red out-of-bounds hazard zone and triggers an IndexError alarm!"
        },
        {
          target: "#bench-stage",
          action: "bench:idx:0",
          cue: "Your turn",
          wait: "bench",
          say: "Your turn! Dial indices zero, three, seven, and eight and tap Read index to record them in your table, or tap Scan zero to seven."
        },
        {
          target: "#expected",
          action: "open:#expected",
          cue: "Expected array table",
          say: "Compare your logged rows with the expected memory table, then answer the practical analysis questions below."
        }
      ]
    },
    {
      title: "Make Sense",
      steps: [
        {
          target: "#def-array",
          cue: "Contiguous memory & offsets",
          say: "Let us make sense of it. An array stores elements in contiguous memory blocks of equal byte size S. The hardware finds any index i in one step: Address equals Base plus i times S."
        },
        {
          target: "#eq-offset",
          cue: "Maximum valid index N − 1",
          say: "Because the first element sits right at the base address, its offset is zero, giving index zero. For N elements, the last valid index is always N minus one."
        },
        {
          target: "#pos-explorer",
          action: "pin:2",
          cue: "Your turn",
          wait: "pin",
          say: "Your turn. Tap the six memory pins to compare zero-based machine indices, one-based human positions, Python negative indices, and byte addresses."
        }
      ]
    },
    {
      title: "Concept Zoom",
      steps: [
        {
          target: { scene: "zoom", part: "baseMarker" },
          action: "zoom:idx:0",
          cue: "Base Address 0x1000",
          say: "Zoom inside the RAM bus. At index zero, the green offset caliper has zero width because we are right at base address zero x one zero zero zero."
        },
        {
          target: { scene: "zoom", part: "caliper" },
          action: "zoom:idx:3",
          cue: "Stride of 4 bytes per slot",
          say: "Dialing index three stretches the caliper across three four-byte float blocks, adding twelve bytes to land on zero x one zero zero C."
        },
        {
          target: { scene: "zoom", part: "boundaryWall" },
          action: "zoom:idx:8",
          cue: "The boundary wall at Index 8",
          say: "Dialing index eight hits the red hardware boundary wall at zero x one zero two zero. Python blocks the read and raises IndexError to protect memory."
        }
      ]
    },
    {
      title: "Worked Examples",
      steps: [
        {
          target: ["#ex1", "#ex2"],
          action: "zoom:reset",
          cue: "Code traces & math steps",
          say: "Study the two worked examples: first, the linear scan algorithm that finds the weakest battery cell at index three; second, accumulating and averaging student test marks."
        }
      ]
    },
    {
      title: "The Bridge",
      steps: [
        {
          target: "#bridge-steps",
          cue: "Patch battery_check.py",
          wait: "bridge",
          say: "Now return to the Ikogosi Clinic. Complete the three steps to fix battery check dot py and restore the vaccine refrigerator to four point one degrees Celsius."
        }
      ]
    },
    {
      title: "Quiz & Reflection",
      steps: [
        {
          target: "#quiz-list",
          cue: "12 Exam MCQs",
          wait: "quiz",
          say: "Test yourself with the twelve WAEC, NECO, and JAMB multiple-choice questions on arrays, indexing, and loop traversal."
        },
        {
          target: "#reflect",
          cue: "Reflect & Assignment",
          say: "Finally, rate your confidence on each learning goal, complete the exit ticket and blank-page recall, and tackle the thirty-mark assignment. Well done!"
        }
      ]
    }
  ]
};
