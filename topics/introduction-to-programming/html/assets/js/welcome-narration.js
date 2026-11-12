/* ==========================================================
   StudyPipe — Welcome Hub guided tour · Introduction to Computer Programming
   Nigerian English (en-NG) first. Read by assets/js/narrator.js (window.NARRATION).
   3D targets use { lab: "<part>" } → window.StudyLab.rect()/highlight() (welcome-lab.js).
   Parts: board, cpu, cu, alu, clock, bus, ram, terminal.
   Modes: high-level · assembly-machine · memory-slots
   Actions: "labmode:<m>", "labstmt:<i>", "labcycle:<c>", "labslot:<s>", "combo:<k>", "myth:<i>".
   Waits: parse / cycle / slot on "lab:result", tab on "hub:tab", flip on "hub:flip".
   ========================================================== */
(function () {
  "use strict";

  function hook(selector, evt, detailOf) {
    document.querySelectorAll(selector).forEach(function (n) {
      n.addEventListener("click", function () {
        document.dispatchEvent(new CustomEvent(evt, { detail: detailOf(n) }));
      });
    });
  }
  hook(".combo-tab[data-combo]", "hub:tab", function (n) { return { combo: n.getAttribute("data-combo") }; });
  hook("#myths .myth-card", "hub:flip", function () { return { open: true }; });

  window.NARRATION = {
    rate: 0.95,
    pitch: 1.02,

    actions: {
      labmode: function (m) { if (window.StudyLab) window.StudyLab.setMode(m); },
      labstmt: function (i) { if (window.StudyLab) window.StudyLab.setStmt(parseInt(i, 10) || 0); },
      labcycle: function (c) { if (window.StudyLab) window.StudyLab.setCycle(parseInt(c, 10) || 0); },
      labslot: function (s) { if (window.StudyLab) window.StudyLab.setSlot(parseInt(s, 10) || 0); },
      combo: function (k) {
        var t = document.querySelector('.combo-tab[data-combo="' + k + '"]');
        if (t) t.click();
      },
      myth: function (i) {
        var cards = document.querySelectorAll("#myths .myth-card");
        var n = parseInt(i, 10);
        cards.forEach(function (c, k) {
          var on = k === n;
          c.classList.toggle("is-flipped", on);
          c.setAttribute("aria-expanded", on ? "true" : "false");
        });
      }
    },

    waits: {
      parse: {
        event: "lab:result", timeout: 60000,
        prompt: "Your turn! Pick a statement preset or tap Parse & execute.",
        filter: function (d) { return d && d.mode === "high-level" && d.code != null; },
        react: function (d) {
          if (!d) return { say: "No wahala! You can test the statements any time. Let's look inside the machine cycles." };
          if (!d.ok) {
            return {
              say: "Aha! Look at that TypeError. Because one hundred and fifty is inside quotation marks, the computer sees text instead of a number. Try the third preset with int casting next!",
              target: "#lab-readouts", sparkle: true, cue: "TypeError caught!"
            };
          }
          return {
            say: "Sharp! The statement parsed cleanly and the A L U computed " + d.acc + " with zero errors.",
            target: "#lab-readouts", sparkle: true, cue: d.acc
          };
        }
      },
      cycle: {
        event: "lab:result", timeout: 60000,
        prompt: "Your turn! Slide the cycle bar or tap Step cycle.",
        filter: function (d) { return d && d.mode === "assembly-machine" && d.cycle != null; },
        react: function (d) {
          if (!d) return { say: "That's fine. Remember the four steps: fetch, decode, execute, and store." };
          return {
            say: "Well done! On cycle " + (d.cycle + 1) + ", the processor runs " + d.asm + " as binary byte " + d.bin + ".",
            target: "#lab-readouts", sparkle: true, cue: d.stage
          };
        }
      },
      slot: {
        event: "lab:result", timeout: 60000,
        prompt: "Your turn! Slide the RAM slot bar to inspect another memory address.",
        filter: function (d) { return d && d.mode === "memory-slots" && d.slot != null; },
        react: function (d) {
          if (!d) return { say: "No problem. You will allocate and index all eight slots in Lessons 1 and 4." };
          return {
            say: "Great! Address " + d.addr + " is zero-based index " + d.slot + ", holding variable " + d.name + " with value " + d.val + ".",
            target: "#lab-readouts", sparkle: true, cue: d.addr + " [" + d.slot + "]"
          };
        }
      },
      tab: {
        event: "hub:tab", timeout: 60000,
        prompt: "Your turn! Tap one of the other Explorer tabs.",
        filter: function (d) { return d && d.combo !== "hierarchy"; },
        react: function (d) {
          if (!d) return { say: "No problem. You can explore the four visualizers whenever you like." };
          return { say: "Nice! Drag the slider underneath to step through the model.", target: "#combo-slider", cue: "Slide along" };
        }
      },
      flip: {
        event: "hub:flip", timeout: 60000,
        prompt: "Your turn! Tap any myth card to flip it.",
        react: function (d) {
          if (!d) return { say: "That's fine. You can flip the cards any time." };
          return { say: "Exactly. Every card busts one trap that WAEC and JAMB examiners love to set.", target: "#myths", cue: "Myth busted" };
        }
      }
    },

    script: [
      {
        title: "Welcome",
        steps: [
          { target: ".hero-title", cue: "The Ikogosi Smart Grid", sparkle: true,
            say: "Welcome, scholar! In this six-lesson Computer Studies unit, we step into Ikogosi, Ekiti State, to rescue a community solar microgrid from a cascade of software bugs." },
          { target: ".hero-meta", cue: "6 lessons · 6 labs · 72 MCQs",
            say: "You have six lessons of eighty minutes each, six 3D practical benches, six 3D concept zooms, seventy-two exam questions, and six thirty-mark papers. Everything runs one hundred percent offline." }
        ]
      },
      {
        title: "The 3D Lab: High-Level Code",
        steps: [
          { target: "#lab", action: "labmode:high-level", cue: "Live 3D MCU Lab",
            say: "This is the Ikogosi microcontroller and RAM architecture bench. It has three modes: high-level code, assembly and binary, and memory slots. Drag sideways to rotate the board." },
          { target: { lab: "cpu" }, action: "labstmt:0", cue: "32-bit Microcontroller",
            say: "On the left sits the thirty-two-bit microcontroller package with its gold pins, Control Unit, and chevron-shaped Arithmetic Logic Unit." },
          { target: { lab: "alu" }, action: "labstmt:1", cue: "The String Trap!",
            say: "Watch what happens when the sensor script tries to add quoted string one hundred and fifty to integer twenty: the A L U halts with a TypeError!" },
          { target: "#ctrl-high-level", cue: "Test a statement",
            say: "Now you try. Tap one of the statement buttons or press Parse and execute.",
            wait: "parse" }
        ]
      },
      {
        title: "The 3D Lab: Assembly & Binary",
        steps: [
          { target: { lab: "cu" }, action: "labmode:assembly-machine", cue: "Control Unit & Decoder",
            say: "Switch to Assembly and binary mode. Compilers and interpreters translate human code into assembly mnemonics like LOAD, MULT, and STORE, and finally into eight-bit binary voltage pulses." },
          { target: { lab: "clock" }, action: "labcycle:2", cue: "16 MHz Quartz Clock",
            say: "The sixteen megahertz quartz crystal beats time. On cycle three, the A L U multiplies one hundred and twenty by sixty-eight point zero and sets status byte zero x seven E." },
          { target: "#ctrl-assembly-machine", cue: "Step the clock",
            say: "Your turn. Slide the cycle bar or tap Step cycle to walk through the four machine stages.",
            wait: "cycle" }
        ]
      },
      {
        title: "The 3D Lab: RAM Memory Slots",
        steps: [
          { target: { lab: "ram" }, action: "labmode:memory-slots", cue: "8-Slot RAM Array (0..7)",
            say: "Now switch to Memory slots mode. Here is the eight-slot physical RAM rack, spanning hexadecimal addresses zero x zero zero to zero x zero seven." },
          { target: { lab: "bus" }, action: "labslot:1", cue: "Data Bus",
            say: "Glowing data packets travel across the copper bus traces to read or write each variable container. Notice that eight slots have valid zero-based indices zero through seven—never eight!" },
          { target: "#ctrl-memory-slots", cue: "Inspect RAM",
            say: "Slide the RAM slot bar to inspect the variables stored in memory.",
            wait: "slot" }
        ]
      },
      {
        title: "The Mystery",
        steps: [
          { target: "#mystery .section-title", cue: "The case file", sparkle: true,
            say: "Every lesson in this unit unlocks one piece of the Ikogosi Smart Solar Microgrid shutdown." },
          { target: ".mystery-narrative", cue: "Ikogosi, Ekiti State",
            say: "During an evening rainstorm, the backup generator stays silent, the clinic vaccine cooler flashes Error zero x seven E, and smart meters overcharge households. Chief Babatunde thinks the inverter hardware is fried, but Amina and Tari prove it is four software bugs." },
          { target: ".case-card", cue: "Case File #IKOGOSI-0x7E",
            say: "We fix the string trap in Lesson 1, invert the boolean gate in Lesson 2, stop the runaway loop in Lesson 3, cure the array index crash in Lesson 4, modularise billing in Lesson 5, and reboot the system in Lesson 6." },
          { target: "#mystery .stats", cue: "Exam weight",
            say: "Programming, flowcharts, and dry-run trace tables account for up to thirty-five percent of WAEC and NECO Computer Studies, and ten to twelve questions every year in JAMB." }
        ]
      },
      {
        title: "Your Lesson Journey",
        steps: [
          { target: "#journey .lessons", cue: "6 progressive lessons",
            say: "Here is your six-lesson learning journey, from binary voltage states to full examination trace tables." },
          { target: '.lesson[data-lesson="1"]', cue: "Lesson 1",
            say: "Lesson 1: programming languages, compilers versus interpreters, data types, and memory variables." },
          { target: '.lesson[data-lesson="2"]', cue: "Lesson 2",
            say: "Lesson 2: relational operators, AND, OR, NOT truth tables, and IF-ELIF-ELSE branching." },
          { target: '.lesson[data-lesson="3"]', cue: "Lesson 3",
            say: "Lesson 3: counted FOR loops, conditional WHILE loops, accumulators, and preventing infinite loops." },
          { target: '.lesson[data-lesson="4"]', cue: "Lesson 4",
            say: "Lesson 4: one-dimensional arrays, contiguous memory offsets, and zero-based indexing." },
          { target: '.lesson[data-lesson="5"]', cue: "Lesson 5",
            say: "Lesson 5: modular functions, parameters, return values, and local versus global variable scope." },
          { target: '.lesson[data-lesson="6"]', cue: "Lesson 6",
            say: "And Lesson 6: binary and hexadecimal conversions, WAEC dry-run trace tables, and the final microgrid reboot." },
          { target: ".thread-note", cue: "Spaced retrieval",
            say: "Every lesson begins with a Do Now warm-up that retrieves concepts from earlier lessons so your memory stays rock-solid." }
        ]
      },
      {
        title: "Interactive Explorer",
        steps: [
          { target: "#explorer .explorer", action: "combo:hierarchy", cue: "Language Ladder",
            say: "These four interactive diagrams preview the core models of the unit. First is the language abstraction ladder, stepping from Python down to assembly mnemonics and binary bits." },
          { target: "#combo-svg", action: "combo:arrays", cue: "Zero-based arrays",
            say: "And here is the eight-element array grid. Slide to index seven for the eighth cell, or slide to index eight to see why going one step too far triggers an IndexError." },
          { target: "#combo-tabs", cue: "Try a tab",
            say: "Your turn. Tap another Explorer tab to inspect it.",
            wait: "tab" }
        ]
      },
      {
        title: "What You Will Master",
        steps: [
          { target: "#master .outcomes", cue: "8 outcomes",
            say: "By the end of Lesson 6 you will master all eight syllabus outcomes, from language translators to dry-run trace tables." },
          { target: "#archetypes", cue: "6 calculation types",
            say: "Almost every programming calculation in WAEC, NECO, and JAMB is one of these six archetypes: operator precedence and modulus, type casting, boolean logic, loop accumulators, zero-based array offsets, and function returns with hex decoding." }
        ]
      },
      {
        title: "Three Myths",
        steps: [
          { target: "#myths", action: "myth:0", cue: "Myth 1 busted",
            say: "First myth: computers understand English commands directly. False! Hardware only executes binary zero and one voltage states after translation." },
          { target: "#myths", action: "myth:1", cue: "Myth 2 busted",
            say: "Second myth: an eight-element array has its last item at index eight. False! Zero-based indices run from zero to seven." },
          { target: "#myths", action: "myth:2", cue: "Myth 3 busted",
            say: "Third myth: a variable created inside a function can be read anywhere. False! It has local scope and is destroyed when the function returns." },
          { target: "#myths", cue: "Your turn",
            say: "Tap any myth card yourself to flip it.",
            wait: "flip" }
        ]
      },
      {
        title: "Ready to Begin",
        steps: [
          { target: "#method .loop", cue: "5-step inquiry loop",
            say: "Every lesson follows our five-step inquiry loop: wonder, investigate, make sense, apply, and reflect, with a stretch break at forty-five minutes." },
          { target: ".finale", cue: "Start Lesson 1", sparkle: true,
            say: "You are ready, detective! Tap Start Lesson 1, and let's debug the Ikogosi solar microgrid." }
        ]
      }
    ]
  };
})();
