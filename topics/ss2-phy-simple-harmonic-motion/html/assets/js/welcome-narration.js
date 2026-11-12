/* ==========================================================
   StudyPipe — Welcome Hub guided tour · Simple Harmonic Motion
   Nigerian English (en-NG) first. Read by assets/js/narrator.js (window.NARRATION).
   3D targets use { lab: "<part>" } → window.StudyLab.rect()/highlight() (welcome-lab.js).
   Parts: spring, hanger, pointer, ruler, stand · cork, thread, bob, marker, stopwatch ·
          okada, rear-shock, carrier, crate, ridges.
   Actions: "labmode:<spring|pendulum|ridge>", "labmass:<kg>", "labrelease", "lablen:<m>",
            "labtime", "labspeed:<km/h>", "labload:<kg>", "labdamper:<healthy|leaking>",
            "combo:<key>", "myth:<i>".
   Waits: spring (lab:result, spring), ridge (lab:result, ridge), tab (hub:tab), flip (hub:flip).
   Symbols are spelled out in every `say` for the TTS engine.
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

  function spoken(x) { return String(x).replace("-", "minus ").replace(".", " point "); }
  function lab() { return window.StudyLab; }

  window.NARRATION = {
    rate: 0.95,
    pitch: 1.02,

    actions: {
      labmode: function (m) { if (lab()) lab().setMode(m); },
      labmass: function (kg) { if (lab()) lab().setMass(parseFloat(kg) || 0.2); },
      labrelease: function () { if (lab()) lab().release(); },
      lablen: function (l) { if (lab()) lab().setLength(parseFloat(l) || 0.8); },
      labtime: function () { if (lab()) lab().time(); },
      labspeed: function (v) { if (lab()) lab().setSpeed(parseFloat(v) || 10); },
      labload: function (kg) { if (lab()) lab().setLoad(parseFloat(kg) || 200); },
      labdamper: function (d) { if (lab()) lab().setDamper(d || "leaking"); },
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
      spring: {
        event: "lab:result", timeout: 60000,
        prompt: "Your turn! Change the load, then tap Pull and release.",
        filter: function (d) { return d.mode === "spring" && d.T != null; },
        react: function (d) {
          if (!d) return { say: "No wahala. You can play with the spring any time. Let's swing a pendulum next." };
          return { say: "Good! With " + spoken(d.m.toFixed(2)) + " kilograms on the spring, it stretches " + spoken((d.x0 * 100).toFixed(1)) + " centimetres and bounces with a period of " + spoken(d.T.toFixed(2)) + " seconds. More mass, slower bounce.", target: "#lab-readouts", sparkle: true, cue: "T = " + d.T.toFixed(3) + " s" };
        }
      },
      ridge: {
        event: "lab:result", timeout: 75000,
        prompt: "Your turn! Slide the speed, or change the damper.",
        filter: function (d) { return d.mode === "ridge" && d.f != null; },
        react: function (d) {
          if (!d) return { say: "That's fine. Remember: the danger is not speed itself, but one particular speed. We will find out why in Lesson 7." };
          if (d.lift) return { say: "See it? At " + Math.round(d.kmh) + " kilometres per hour the ridges push at " + spoken(d.f.toFixed(2)) + " hertz, very close to the bike's own two hertz. The bounce grows past the lift-off line, and the crate flies.", target: "#lab-readouts", sparkle: true, cue: "Lift-off!" };
          return { say: "At " + Math.round(d.kmh) + " kilometres per hour the bounce is only " + spoken((d.A * 100).toFixed(1)) + " centimetres, below the lift-off line of " + spoken((d.th * 100).toFixed(1)) + " centimetres. The crates stay on.", target: "#lab-readouts", cue: "Crates safe" };
        }
      },
      tab: {
        event: "hub:tab", timeout: 60000,
        prompt: "Your turn! Tap one of the other graph tabs.",
        filter: function (d) { return d.combo !== "resonance"; },
        react: function (d) {
          if (!d) return { say: "No problem. You can try the other graphs later." };
          return { say: "Good. Now slide along the graph and watch the readings change.", target: "#combo-slider", cue: "Slide along" };
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
          { target: ".hero-title", cue: "The cracked crates", sparkle: true,
            say: "Welcome! In this seven-lesson unit we solve the case of the cracked crates of Ridge Road. Simple harmonic motion comes up in WAEC and NECO theory papers, the pendulum returns in Paper 3, and JAMB loves the ratio questions." },
          { target: ".hero-meta", cue: "7 lessons · 7 labs · 7 zooms",
            say: "You have seven lessons of about eighty minutes each, seven virtual practicals, seven zooms, eighty-four quiz questions and seven thirty-mark papers. Everything works offline." }
        ]
      },
      {
        title: "The 3D Lab: the loaded spring",
        steps: [
          { target: "#lab", action: "labmode:spring", cue: "Live 3D lab",
            say: "This is Mrs Okafor's lab bench. It has three rigs: a loaded spring, a simple pendulum, and Dayo's okada on Ridge Road. Drag sideways to turn it." },
          { target: { lab: "spring" }, action: "labmass:0.2", cue: "Spiral spring",
            say: "Here is a spiral spring with a slotted-mass hanger. Every fifty grams you add stretches it by the same amount. That is Hooke's law: F equals k x." },
          { target: { lab: "pointer" }, action: "labrelease", cue: "Pointer on the metre rule",
            say: "Now it bounces. The period is two pi root m over k, so more mass means a slower bounce, and a stiffer spring a faster one." },
          { target: "#ctrl-spring", cue: "Load it, then release",
            say: "Your turn. Change the load and tap Pull and release.",
            wait: "spring" }
        ]
      },
      {
        title: "The 3D Lab: the simple pendulum",
        steps: [
          { target: { lab: "cork" }, action: "labmode:pendulum", cue: "Split cork",
            say: "Switch to the pendulum. The thread is gripped between two halves of a split cork, so the point of suspension stays fixed." },
          { target: { lab: "bob" }, action: "lablen:0.8", cue: "l to the bob's centre",
            say: "The length l is measured from the cork to the centre of the bob. For small swings the period is two pi root L over g. The mass of the bob does not matter at all." },
          { target: { lab: "stopwatch" }, action: "labtime", cue: "Count from zero",
            say: "Watch the stopwatch. It starts as the bob passes the rest mark, counting zero, and stops after five complete oscillations. That is exactly how WAEC wants you to time it." }
        ]
      },
      {
        title: "The 3D Lab: Ridge Road",
        steps: [
          { target: { lab: "okada" }, action: "labmode:ridge", cue: "Dayo's okada",
            say: "Now Ridge Road. Dayo's okada carries an egg crate over concrete drainage ridges two point five metres apart." },
          { target: { lab: "rear-shock" }, action: "labspeed:10", cue: "Coil-over shock",
            say: "The rear sits on coil springs with oil dampers inside. At ten kilometres per hour the bounce is small. The crate stays on." },
          { target: { lab: "crate" }, action: "labspeed:18", cue: "18 km/h", sparkle: true,
            say: "Now eighteen kilometres per hour. The ridges arrive two times every second, exactly the bike's own rhythm. The bounce grows and grows, and the crate leaves the carrier. Crack!" },
          { target: "#ctrl-ridge", cue: "Try a speed",
            say: "Your turn. Try a faster speed, or fit a healthy damper, and watch the amplitude.",
            wait: "ridge" }
        ]
      },
      {
        title: "The Mystery",
        steps: [
          { target: "#mystery .section-title", cue: "The case", sparkle: true,
            say: "Every lesson closes one piece of one case: the cracked crates of Ridge Road." },
          { target: ".mystery-narrative", cue: "Ridge Road, Ogbomoso",
            say: "Hajia Ramatu's eggs survive slow trips and fast trips, but not one middle speed. Tunde says faster is always worse. Mrs Okafor says the bike behaves like a mass on a spring." },
          { target: ".clues", cue: "Four clues",
            say: "Look at the clues: whole at ten and thirty kilometres per hour, cracked at about eighteen, about sixteen with two extra crates, and a rear shock absorber weeping oil." },
          { target: ".case-card", cue: "Case File #RIDGE-18",
            say: "The case opens in Lesson 1. We find the lift-off rule in Lesson 3, measure our own g in Lesson 5, and close the file in Lesson 7." }
        ]
      },
      {
        title: "Your Lesson Journey",
        steps: [
          { target: "#journey .lessons", cue: "7 lessons",
            say: "Here is your journey: seven lessons, from a stopwatch to the dangerous speed." },
          { target: '.lesson[data-lesson="1"]', cue: "Lessons 1 and 2",
            say: "Lesson 1 puts a number on a bounce. Lesson 2 finds the pull back to the middle that makes motion simple harmonic." },
          { target: '.lesson[data-lesson="3"]', cue: "Lessons 3 and 4",
            say: "Lesson 3 shows S H M as the shadow of a circle and finds when the crates fly. Lesson 4 tests the simple pendulum fairly." },
          { target: '.lesson[data-lesson="5"]', cue: "Lessons 5 and 6",
            say: "Lesson 5 is the WAEC Paper 3 practical to find g. Lesson 6 follows the energy and the shock absorber." },
          { target: '.lesson[data-lesson="7"]', cue: "Lesson 7: the verdict",
            say: "And Lesson 7 brings in resonance, and we tell Dayo the speed he must never ride." },
          { target: ".thread-note", cue: "Spaced retrieval",
            say: "Every lesson starts with a Do Now that brings back ideas from earlier lessons, so nothing is forgotten." }
        ]
      },
      {
        title: "Interactive Explorer",
        steps: [
          { target: "#explorer .explorer", action: "combo:xva", cue: "x, v and a",
            say: "These five graphs explain the whole unit. The first shows displacement, velocity and acceleration against time. Speed is greatest where displacement is zero, and acceleration is greatest at the ends." },
          { target: "#combo-curve", action: "combo:resonance", cue: "Resonance peak",
            say: "This one is the heart of the mystery: amplitude against driving frequency. The peak sits at the okada's natural frequency of two hertz. Where the curve rises above the dashed line, the crates lift off." },
          { target: "#combo-tabs", cue: "Try a tab",
            say: "Your turn. Tap another tab.",
            wait: "tab" }
        ]
      },
      {
        title: "What You Will Master",
        steps: [
          { target: "#master .outcomes", cue: "6 outcomes",
            say: "By the end of Lesson 7 you will master these six skills, from timing an oscillation to predicting a resonant speed." },
          { target: "#archetypes", cue: "6 calculation types",
            say: "Almost every number question on this topic is one of these six types: timing, S H M kinematics, the loaded spring, the simple pendulum, practical g from a graph, and energy and resonance. Every step has a note under it." },
          { target: ".formula-strip", cue: "7 key formulas",
            say: "And here are the seven formulas to carry into the exam hall, from a equals minus omega squared x, to resonance, f equals f nought." }
        ]
      },
      {
        title: "Three Myths",
        steps: [
          { target: "#myths", action: "myth:0", cue: "Myth 1 busted",
            say: "First myth: a heavier bob swings more slowly. No! For a simple pendulum the mass cancels out. Only the length and g count." },
          { target: "#myths", action: "myth:1", cue: "Myth 2 busted",
            say: "Second myth: it moves fastest at the ends. No! At the ends it is momentarily still. That is where the acceleration is greatest. The speed is greatest in the middle." },
          { target: "#myths", action: "myth:2", cue: "Myth 3 busted",
            say: "Third myth: resonance means vibrating very fast. No! It means the push matches the natural frequency. The okada's resonance is only two hertz." },
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
            say: "You are ready! Tap Start Lesson 1, and let's save Hajia Ramatu's eggs." }
        ]
      }
    ]
  };
})();
