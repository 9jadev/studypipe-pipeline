/* ==========================================================
   StudyPipe — Welcome Hub guided tour · Ohm's Law & Current Electricity
   Nigerian English (en-NG) first. Read by assets/js/narrator.js (window.NARRATION).
   3D targets use { lab: "<part>" } → window.StudyLab.rect()/highlight() (welcome-lab.js).
   Parts: battery, driver, key, rheostat, ammeter, voltmeter, galv, wire, lamp, board, jockey.
   Modes: ohms · ir · null (actions "labmode:<m>", "labr:<ohm>", "labkey:open|closed",
   "labload:<ohm>", "jockey:<cm>").
   Waits: ohms / ir / nullpt on "lab:result", tab on "hub:tab", flip on "hub:flip".
   ========================================================== */
(function () {
  "use strict";

  // The explorer tabs and myth cards do not emit events themselves, so the tour listens to their clicks here.
  function hook(selector, evt, detailOf) {
    document.querySelectorAll(selector).forEach(function (n) {
      n.addEventListener("click", function () { document.dispatchEvent(new CustomEvent(evt, { detail: detailOf(n) })); });
    });
  }
  hook(".combo-tab[data-combo]", "hub:tab", function (n) { return { combo: n.getAttribute("data-combo") }; });
  hook("#myths .myth-card", "hub:flip", function () { return { open: true }; });

  function spoken(x) { return String(x).replace(".", " point "); }

  window.NARRATION = {
    rate: 0.95,
    pitch: 1.02,

    actions: {
      labmode: function (m) { if (window.StudyLab) window.StudyLab.setMode(m); },
      labr: function (r) { if (window.StudyLab) window.StudyLab.setR(parseFloat(r) || 10); },
      labkey: function (s) { if (window.StudyLab) window.StudyLab.key(s !== "closed"); },
      labload: function (r) { if (window.StudyLab) window.StudyLab.load(parseFloat(r) || 2.8); },
      jockey: function (l) { if (window.StudyLab) window.StudyLab.jockey(parseFloat(l) || 50); },
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
      ohms: {
        event: "lab:result", timeout: 60000,
        prompt: "Your turn! Slide the rheostat, then tap Take reading.",
        filter: function (d) { return d.mode === "ohms" && d.I != null; },
        react: function (d) {
          if (!d) return { say: "No wahala. You can take readings any time. Let's see what happens inside the battery." };
          return { say: "Good! With the rheostat at " + d.R + " ohms, the current is " + spoken(d.I.toFixed(2)) + " amperes and the wire's p.d. is " + spoken(d.V.toFixed(2)) + " volts. Divide them: " + spoken(d.ratio.toFixed(2)) + " ohms, the same as before. That is Ohm's law.", target: "#lab-readouts", sparkle: true, cue: "V ÷ I = " + d.ratio.toFixed(2) + " Ω" };
        }
      },
      ir: {
        event: "lab:result", timeout: 60000,
        prompt: "Your turn! Tap a test load, or close the key.",
        filter: function (d) { return d.mode === "ir" && d.open === false; },
        react: function (d) {
          if (!d) return { say: "That's fine. Remember: open key, the voltmeter shows the EMF. Closed key, it shows E minus I r." };
          return { say: "See it? " + spoken(d.I.toFixed(2)) + " amperes flow, " + spoken(d.lost.toFixed(1)) + " volts are lost inside the battery, and only " + spoken(d.V.toFixed(1)) + " volts reach the terminals. The heavier the load, the bigger the lost volts.", target: "#lab-readouts", sparkle: true, cue: "V = " + d.V.toFixed(1) + " V" };
        }
      },
      nullpt: {
        event: "lab:result", timeout: 75000,
        prompt: "Your turn! Slide the jockey until the galvanometer reads null.",
        filter: function (d) { return d.mode === "null" && d.balanced; },
        react: function (d) {
          if (!d) return { say: "No problem. The balance point is at eighty centimetres. You will find it yourself in Lesson 5." };
          return { say: "Balanced! At eighty point zero centimetres no current flows from the keke battery, so there are no lost volts. Zero point one five zero times eighty gives twelve point zero volts. The EMF has not changed at all.", target: "#lab-readouts", sparkle: true, cue: "E = 12.0 V" };
        }
      },
      tab: {
        event: "hub:tab", timeout: 60000,
        prompt: "Your turn! Tap one of the other graph tabs.",
        filter: function (d) { return d.combo !== "ohmic"; },
        react: function (d) {
          if (!d) return { say: "No problem. You can try the other graphs later." };
          return { say: "Good. Now slide along the graph to read any point on it.", target: "#combo-slider", cue: "Slide along" };
        }
      },
      flip: {
        event: "hub:flip", timeout: 60000,
        prompt: "Your turn! Tap a myth card to flip it.",
        react: function (d) {
          if (!d) return { say: "That's fine. You can flip the cards any time." };
          return { say: "Nice. Every card hides one fact that WAEC examiners love to test.", target: "#myths", cue: "Flipped" };
        }
      }
    },

    script: [
      {
        title: "Welcome",
        steps: [
          { target: ".hero-title", cue: "The missing volts", sparkle: true,
            say: "Welcome! In this five-lesson unit we chase some missing volts. Current electricity comes up regularly in WAEC and NECO, the metre bridge and potentiometer return in Paper 3, and JAMB loves the calculations." },
          { target: ".hero-meta", cue: "5 lessons · 5 labs · 5 zooms",
            say: "You have five lessons of about eighty minutes each, five 3D practical benches, five 3D zooms, sixty quiz questions and five thirty-mark papers. Everything works offline." }
        ]
      },
      {
        title: "The 3D Lab: Ohm's law",
        steps: [
          { target: "#lab", action: "labmode:ohms", cue: "Live 3D lab",
            say: "This is Engineer Nkechi's test bench in Aba. It has three modes: Ohm's law, E M F and internal resistance, and the null point. Drag sideways to turn it." },
          { target: { lab: "wire" }, action: "labr:10", cue: "Constantan test wire",
            say: "Here is a constantan test wire. The ammeter is in series with it, and the voltmeter is connected across it, in parallel." },
          { target: { lab: "rheostat" }, cue: "Rheostat",
            say: "The rheostat changes the current. Slide it, and both the current and the p.d. change, but V divided by I stays the same: two point two zero ohms." },
          { target: "#ctrl-ohms", cue: "Slide, then read",
            say: "Now you try. Slide the rheostat and take a reading.",
            wait: "ohms" }
        ]
      },
      {
        title: "The 3D Lab: EMF and lost volts",
        steps: [
          { target: { lab: "voltmeter" }, action: "labmode:ir", cue: "Key open: E = 12.0 V",
            say: "Switch to E M F mode. The voltmeter now sits across Emeka's keke battery. With the key open, no current flows, so it shows the E M F: twelve point zero volts." },
          { target: { lab: "key" }, action: "labload:2.8", cue: "Key closed: 8.4 V",
            say: "Close the key on the two point eight ohm starter test load. Three amperes flow, three point six volts are spent inside the battery, and the terminals fall to eight point four volts. That is the mystery!" },
          { target: "#lab-mini", cue: "Mini V–I graph",
            say: "Look at the small graph in the corner. Terminal p.d. against current is a straight line. Where it meets the V axis is the E M F, and its slope gives the internal resistance." },
          { target: "#ctrl-ir", cue: "Try a load",
            say: "Your turn. Try the headlamp or the parking lamp, and watch the lost volts change.",
            wait: "ir" }
        ]
      },
      {
        title: "The 3D Lab: the null point",
        steps: [
          { target: { lab: "board" }, action: "jockey:50", cue: "100 cm potentiometer wire",
            say: "Now the null point. A twenty-four volt driver pushes a steady current along this one-metre wire, so every centimetre carries zero point one five zero volts." },
          { target: { lab: "galv" }, cue: "Centre-zero galvanometer",
            say: "The keke battery is connected through this centre-zero galvanometer to the jockey. When the needle reads zero, no current is drawn from the battery." },
          { target: "#ctrl-null", cue: "Find the balance",
            say: "Slide the jockey and find the balance point.",
            wait: "nullpt" }
        ]
      },
      {
        title: "The Mystery",
        steps: [
          { target: "#mystery .section-title", cue: "The case", sparkle: true,
            say: "Every lesson closes one piece of one case: the Ngwa Road keke battery drop." },
          { target: ".mystery-narrative", cue: "Ngwa Road, Aba",
            say: "Emeka's battery reads twelve point zero volts at rest. Chinedu switches in the starter test load, and it crashes to eight point four volts. Tobe says, dump it! Engineer Nkechi says, measure it a cleverer way first." },
          { target: ".case-card", cue: "Case File #KEKE-12V",
            say: "The case opens in Lesson 1. We find the lost volts in Lesson 2, build safe meters in Lesson 4, and close the file in Lesson 5." },
          { target: "#mystery .stats", cue: "Exam weight",
            say: "And look at the exam weight. Current electricity is regular in WAEC and NECO, Paper 3 brings the V I graph, the metre bridge and the potentiometer, and JAMB sets many numerical questions on it." }
        ]
      },
      {
        title: "Your Lesson Journey",
        steps: [
          { target: "#journey .lessons", cue: "5 lessons",
            say: "Here is your journey: five lessons, from a hot jumper cable to the battery's true E M F." },
          { target: '.lesson[data-lesson="1"]', cue: "Lesson 1",
            say: "Lesson 1: current, p.d., Ohm's law and the resistance of wires." },
          { target: '.lesson[data-lesson="2"]', cue: "Lesson 2",
            say: "Lesson 2: E M F, lost volts and internal resistance. This is where the three point six volts go." },
          { target: '.lesson[data-lesson="3"]', cue: "Lesson 3",
            say: "Lesson 3: series and parallel networks, cells, power and efficiency." },
          { target: '.lesson[data-lesson="4"]', cue: "Lesson 4",
            say: "Lesson 4: turning one galvanometer into an ammeter and a voltmeter." },
          { target: '.lesson[data-lesson="5"]', cue: "Lesson 5",
            say: "And Lesson 5: the metre bridge and the potentiometer, where we close the case." },
          { target: ".thread-note", cue: "Spaced retrieval",
            say: "Every lesson starts with a Do Now that brings back ideas from earlier lessons, so nothing is forgotten." }
        ]
      },
      {
        title: "Interactive Explorer",
        steps: [
          { target: "#explorer .explorer", action: "combo:ohmic", cue: "Ohmic or not",
            say: "These four graphs explain the whole unit. The first one: a wire gives a straight line through the origin, but a filament lamp's curve bends, because it heats up and its resistance rises." },
          { target: "#combo-svg", action: "combo:power", cue: "P peaks at R = r",
            say: "Here are power and efficiency against load. Power peaks when the load equals the internal resistance, but efficiency keeps climbing towards one hundred percent. Two smooth curves, never straight lines." },
          { target: "#combo-tabs", cue: "Try a tab",
            say: "Your turn. Tap another tab.",
            wait: "tab" }
        ]
      },
      {
        title: "What You Will Master",
        steps: [
          { target: "#master .outcomes", cue: "8 outcomes",
            say: "By the end of Lesson 5 you will master these eight skills, from measuring a resistance to reading a battery's true E M F." },
          { target: "#archetypes", cue: "6 calculation types",
            say: "Almost every number question on this topic is one of these six types: Ohm's law and power, resistance of a wire, E M F and internal resistance, networks and cells, shunts and multipliers, and null methods. Every step has a note under it." }
        ]
      },
      {
        title: "Three Myths",
        steps: [
          { target: "#myths", action: "myth:0", cue: "Myth 1 busted",
            say: "First myth: a voltmeter across a battery always shows its E M F. No! Only on open circuit. When current flows, it shows E minus I r." },
          { target: "#myths", action: "myth:1", cue: "Myth 2 busted",
            say: "Second myth: identical cells in parallel raise the voltage. No! They keep one cell's E M F. Only the internal resistance falls, to r over n." },
          { target: "#myths", action: "myth:2", cue: "Myth 3 busted",
            say: "Third myth: for a voltmeter, put the whole V over I g in series. No! Subtract the coil's own resistance to get the multiplier." },
          { target: "#myths", cue: "Your turn",
            say: "Now flip a card yourself, to check one more time.",
            wait: "flip" }
        ]
      },
      {
        title: "Ready to Begin",
        steps: [
          { target: "#method .loop", cue: "How every lesson works",
            say: "Every lesson follows the same loop: wonder, investigate, make sense, apply, then reflect. And there is a movement break at forty-five minutes." },
          { target: ".finale", cue: "Start Lesson 1", sparkle: true,
            say: "You are ready! Tap Start Lesson 1, and let's find the missing three point six volts." }
        ]
      }
    ]
  };
})();
