/* ==========================================================
   StudyPipe — Welcome Hub guided tour · The Human Heart and Blood Circulation
   Nigerian English (en-NG) first. Read by assets/js/narrator.js (window.NARRATION).
   3D targets use { lab: "<part>" } → window.StudyLab.rect()/highlight() (welcome-lab.js);
   highlighting a part also switches the lab to that part's mode.
   Waits: heart / circuit / pace on "lab:result", tab on "hub:tab", flip on "hub:flip".
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
  hook("#myths .myth-card", "hub:flip", function (n) { return { open: true }; });

  window.NARRATION = {
    rate: 0.95,
    pitch: 1.02,

    actions: {
      labmode: function (m) { if (window.StudyLab) window.StudyLab.setMode(m); },
      pick: function (k) { if (window.StudyLab) window.StudyLab.select(k); },
      circ: function (c) { if (window.StudyLab) window.StudyLab.circuit(c); },
      bpm: function (b) { if (window.StudyLab) window.StudyLab.bpm(parseInt(b, 10) || 72); },
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
      heart: {
        event: "lab:result", timeout: 60000,
        prompt: "Your turn! Tap any chamber, valve or vessel in the heart.",
        filter: function (d) { return d.mode === "heart" && !!d.part; },
        react: function (d) {
          if (!d) return { say: "No wahala. You can tap the heart any time. Let's look at the circuits next." };
          return { say: "Good one! You found the " + d.name + ". " + d.say + ". You will study every part like this in Lesson 2.", target: "#lab-readouts", sparkle: true, cue: d.name };
        }
      },
      circuit: {
        event: "lab:result", timeout: 60000,
        prompt: "Your turn! Tap Tilapia or Cockroach to compare it with the human circuit.",
        filter: function (d) { return d.mode === "circuit" && !!d.circ && d.circ !== "double"; },
        react: function (d) {
          if (!d) return { say: "That's fine. Remember: the human heart pushes blood twice in every circuit." };
          return { say: d.say + " That is why large, active animals like Chidi need the double system.", target: "#lab-readouts", sparkle: true, cue: d.name };
        }
      },
      pace: {
        event: "lab:result", timeout: 75000,
        prompt: "Your turn! Slide the heart rate up to 150 beats per minute or more.",
        filter: function (d) { return d.mode === "pace" && d.bpm >= 120; },
        react: function (d) {
          if (!d) return { say: "No problem. You can play with the slider later. We will measure a real pulse in Lesson 4." };
          return { say: "See it? At " + d.bpm + " beats per minute, one cycle lasts sixty divided by " + d.bpm + ", which is " + String(d.cycle).replace(".", " point ") + " seconds. The faster the heart, the shorter every cycle. That is what happened to Chidi after his sprint.", target: "#lab-readouts", sparkle: true, cue: d.bpm + " bpm" };
        }
      },
      tab: {
        event: "hub:tab", timeout: 60000,
        prompt: "Your turn! Tap one of the other graph tabs.",
        filter: function (d) { return d.combo !== "sav"; },
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
          { target: ".hero-title", cue: "The Heart", sparkle: true,
            say: "Welcome! In this seven-lesson unit we open the heart and follow the blood. The heart diagram and the course of blood come up regularly in WAEC and NECO theory, and blood is a topic in JAMB too." },
          { target: ".hero-meta", cue: "7 lessons · 7 labs · 7 zooms",
            say: "You have seven lessons of about eighty minutes each, seven 3D practical benches, seven 3D zooms, eighty-four quiz questions and seven thirty-mark papers. Everything works offline." }
        ]
      },
      {
        title: "The 3D Lab: the heart",
        steps: [
          { target: "#lab", action: "labmode:heart", cue: "Live 3D lab",
            say: "This is your live 3D lab. It has three modes: heart, circuits and pacemaker. Drag sideways to turn it." },
          { target: { lab: "lv" }, cue: "Left ventricle",
            say: "Here is a real beating heart, cut open. Remember, the heart faces you, so the patient's left side is on your right. See the left ventricle: its wall is about three times thicker than the right, because it pushes blood all round the body." },
          { target: { lab: "septum" }, cue: "Septum",
            say: "Down the middle is the septum, a wall of muscle. It keeps oxygen-rich blood on the left and oxygen-poor blood on the right." },
          { target: "#lab", cue: "Tap a part",
            say: "Now you try. Tap any chamber, valve or vessel, and the lab will tell you what it receives and where it sends blood.",
            wait: "heart" }
        ]
      },
      {
        title: "The 3D Lab: circuits",
        steps: [
          { target: { lab: "circuit" }, action: "circ:double", cue: "Double circulation",
            say: "Switch to circuits. A human heart pushes blood twice in every round trip: once to the lungs, and once to the whole body. That is double circulation." },
          { target: "#ctrl-circuit", cue: "Compare animals",
            say: "Now compare. A tilapia has single circulation, and a cockroach has open circulation. Tap one and watch how the blood moves.",
            wait: "circuit" }
        ]
      },
      {
        title: "The 3D Lab: pacemaker",
        steps: [
          { target: { lab: "san" }, action: "bpm:72", cue: "SAN · pacemaker",
            say: "Now the pacemaker. The yellow spark starts at the S A N in the wall of the right atrium. It spreads over both atria, pauses at the A V N, then races down the septum and up the ventricle walls." },
          { target: "#ctrl-pace", cue: "Heart rate slider",
            say: "Slide the heart rate up. At seventy-two beats a minute, one cycle lasts sixty divided by seventy-two, about zero point eight three seconds. Make it faster and watch the cycle time shrink.",
            wait: "pace" }
        ]
      },
      {
        title: "The Mystery",
        steps: [
          { target: "#mystery .section-title", cue: "The case", sparkle: true,
            say: "Every lesson closes one piece of one case: three puzzles at the Oja Oba health day." },
          { target: ".mystery-narrative", cue: "Oja Oba market",
            say: "Chidi's pulse jumped from sixty-eight to one hundred and thirty-two after a sprint, then settled. Mama Bisi's ankles keep a thumb dent, and her cuff reads one sixty over one hundred. And an okada rider arrives bleeding, group B Rhesus negative, with six bags in the cool box. Baba Sule says, take the A B, it suits everybody. Is he right?" },
          { target: ".case-card", cue: "Case File #HEART-01",
            say: "The case opens in Lesson 1, Chidi's pulse is solved in Lesson 4, Mama Bisi's ankles in Lesson 5, and the whole file closes in Lesson 7." },
          { target: "#mystery .stats", cue: "Exam weight",
            say: "And look at the exam weight. The heart diagram and the course of blood are regular WAEC and NECO items, Paper 3 brings heart specimens and blood slides, and JAMB has quick-recall items on heart parts, vessels and blood groups." }
        ]
      },
      {
        title: "Your Lesson Journey",
        steps: [
          { target: '.lesson[data-lesson="1"]', cue: "Lesson 1 · Why transport?",
            say: "Lesson 1: why big bodies need a transport system. You will drop agar cubes into acid, work out surface area to volume ratio, and compare open, single and double circulation." },
          { target: '.lesson[data-lesson="2"]', cue: "Lesson 2 · The heart",
            say: "Lesson 2: the heart up close. Dissect a goat heart, measure every wall, and name the valves and the chordae tendineae." },
          { target: '.lesson[data-lesson="3"]', cue: "Lesson 3 · The double circuit",
            say: "Lesson 3: the double circuit. Trace blood through thirteen steps, and meet the hepatic portal system and the coronary arteries." },
          { target: '.lesson[data-lesson="4"]', cue: "Lesson 4 · The beating heart",
            say: "Lesson 4: the beating heart. The cardiac cycle, lub and dub, the pacemaker, and your own pulse and blood pressure." },
          { target: '.lesson[data-lesson="5"]', cue: "Lesson 5 · Vessels and fluid",
            say: "Lesson 5: arteries, veins and capillaries, tissue fluid and lymph. This is where Mama Bisi's swollen ankles are solved." },
          { target: '.lesson[data-lesson="6"]', cue: "Lesson 6 · Blood",
            say: "Lesson 6: blood. Plasma, the three kinds of cell, a haemocytometer count, and the clotting chain." },
          { target: '.lesson[data-lesson="7"]', cue: "Lesson 7 · Closing the case",
            say: "Lesson 7: blood groups, Rhesus, transfusion and common disorders. You close the case and choose the rider's safe bags." },
          { target: ".thread-note", cue: "Spaced Do Now",
            say: "Every lesson starts with a Do Now warm-up from earlier lessons, so nothing is forgotten." }
        ]
      },
      {
        title: "Explorer",
        steps: [
          { target: "#combo-tabs", action: "combo:sav", cue: "Surface area : volume",
            say: "Try the explorer. First, surface area to volume ratio. It is six over L, so every time the side doubles, the ratio halves. That is why a tiny Amoeba needs no heart but Chidi does." },
          { target: "#combo-tabs", cue: "Try another graph",
            say: "Tap another tab: the pulse recovery curve, the pressure round the circuit, or capillary filtration.",
            wait: "tab" },
          { target: "#combo-svg", action: "combo:capillary", cue: "Capillary filtration",
            say: "In a capillary, the blood pressure Pc falls from thirty-six to sixteen millimetres of mercury, while the pull of the plasma proteins stays at twenty-five. The lines cross fifty-five percent of the way along. Before that point fluid leaves, after it fluid returns." },
          { target: "#combo-slider", cue: "Slide along",
            say: "Move the slider to read any point on the graph. You will draw these graphs from your own results in Lessons 1, 4 and 5." }
        ]
      },
      {
        title: "What You Will Master",
        steps: [
          { target: "#master .outcomes", cue: "8 outcomes",
            say: "Here is everything you will master, from why we need blood to choosing a safe transfusion." },
          { target: "#archetypes", cue: "6 calculation types",
            say: "Almost every number question on this topic is one of these six types: surface area to volume ratio, heart rate and cycle time, cardiac output, net filtration pressure, blood speed, and red cell count. Every step has a note under it." }
        ]
      },
      {
        title: "Three Myths",
        steps: [
          { target: "#myths", action: "myth:0", cue: "Myth 1 busted",
            say: "First myth: arteries carry oxygenated blood and veins carry deoxygenated blood. No! Direction decides. The pulmonary artery carries oxygen-poor blood, and the pulmonary veins carry oxygen-rich blood." },
          { target: "#myths", action: "myth:1", cue: "Myth 2 busted",
            say: "Second myth: on a heart diagram, the left ventricle is on your left. No! The drawing faces you, so the patient's left is on your right." },
          { target: "#myths", action: "myth:2", cue: "Myth 3 busted",
            say: "Third myth: A B is the universal donor. No! O gives, A B receives." },
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
            say: "You are ready! Tap Start Lesson 1 and find out why Chidi's heart raced." }
        ]
      }
    ]
  };
})();
