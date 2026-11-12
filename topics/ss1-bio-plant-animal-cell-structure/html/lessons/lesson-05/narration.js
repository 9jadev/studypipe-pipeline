/* Lesson 05 · StudyNarrator script: WAEC Paper 3 Clinic, slides, biological drawing and magnification (Nigerian English, en-NG).
   The Do Now chapter (2 steps) is inserted by narrator.js, so this script plus that chapter gives 28 steps. */
(function () {
  "use strict";
  function S(name) { return window.StudyScenes && window.StudyScenes[name]; }
  function split(arg) { var i = String(arg).indexOf(":"); return i < 0 ? [String(arg), ""] : [arg.slice(0, i), arg.slice(i + 1)]; }

  window.NARRATION = {
    rate: 0.96,
    pitch: 1.01,

    waits: {
      note: {
        event: "kit:note",
        prompt: "Pin a prediction to the Wonder Wall: why might a correct drawing lose marks?",
        react: function () { return "Pinned! Hold on to that idea. We will test it on the slide bench and in the drawing audit."; }
      },
      sort: {
        event: "l5:sort",
        prompt: "Sort all ten cards into Reward and Penalise, then tap Check my sorting",
        react: function (d) {
          if (!d) return "Good effort!";
          if (d.correct === d.total) return "Ten out of ten! You already think like a Paper 3 examiner.";
          if (d.correct >= 8) return "Nice work! " + d.correct + " out of " + d.total + ". Read the reasons below for the card that slipped.";
          return "You got " + d.correct + " out of " + d.total + ". Read the reasons below. Every one of these rules is marked in WAEC Paper 3.";
        }
      },
      bench: {
        event: "l5:bench-done",
        prompt: "Mount one good onion slide and one good cheek slide on the bench",
        react: function () { return "Well done! You mounted a clean onion slide and a clean cheek slide. Now compare them, feature by feature."; }
      },
      bridge: {
        event: "l5:bridge",
        prompt: "Run Steps 1, 2 and 3: fix both drawings, then see plasmolysis",
        react: function () { return "Case closed! Draw what you see, label what you can see, and prove your claims with evidence. That is the whole unit."; }
      },
      quiz: {
        event: "kit:quiz-done",
        prompt: "Answer all the quiz questions",
        react: function (d) {
          if (!d) return "Quiz complete!";
          if (d.score >= d.total - 2) return "Outstanding! " + d.score + " out of " + d.total + ". You are ready for Paper 3.";
          if (d.score >= Math.round(d.total * 0.6)) return "Well done! " + d.score + " out of " + d.total + ". Read the explanations for the ones you missed.";
          return "You scored " + d.score + " out of " + d.total + ". Replay the slide bench and the drawing audit, then retry the quiz.";
        }
      }
    },

    actions: {
      story: function (arg) { var s = S("story"); if (s && s.beat) s.beat(+arg); },
      method: function (arg) {
        for (var i = 1; i <= 4; i++) { var c = document.getElementById("m" + i); if (c) c.classList.toggle("now", i === +arg); }
      },
      bench: function (arg) {
        var p = split(arg), b = S("bench"); if (!b) return;
        if (p[0] === "mode") b.setMode(p[1]);
        else if (p[0] === "step") b.setStep(+p[1]);
        else if (p[0] === "mount") b.mount();
        else if (p[0] === "view") b.setView(+p[1]);
      },
      zoom: function (arg) {
        var p = split(arg), z = S("zoom"); if (!z) return;
        if (p[0] === "mode") z.setMode(p[1]);
        else if (p[0] === "pick") z.pick(p[1]);
      },
      audit: function (arg) {
        var p = split(arg), a = window.L05 && window.L05.audit; if (!a) return;
        if (p[0] === "demo") a.demo(p[1]);
        else if (p[0] === "select") a.select(p[1]);
      },
      mag: function (arg) { if (window.L05 && window.L05.showMag) window.L05.showMag(+arg); },
      open: function (arg) { if (window.L05 && window.L05.open) window.L05.open(arg); },
      br: function (arg) { if (window.L05 && window.L05.bridge) window.L05.bridge.step(+arg); }
    },

    script: [
      {
        title: "Welcome",
        steps: [
          {
            target: ".l-hero .display", cue: "Lesson 5 · The Paper 3 clinic", sparkle: true,
            say: "Welcome to the final lesson of Plant and Animal Cells! Today we are in the WAEC Paper 3 clinic. We will prepare two slides, draw what we see, and calculate magnification the way an examiner will mark it. Our question is simple: can we prove what we claimed?"
          },
          {
            target: "#objectives", cue: "5 goals for Lesson 5",
            say: "By the end you will prepare an onion slide and a cheek slide, apply the nine drawing rules, state observable differences, calculate drawing magnification and actual size, and explain what can and cannot be labelled."
          }
        ]
      },
      {
        title: "The Story",
        steps: [
          {
            target: "#story-stage", action: "story:0", cue: "Exam week in the lab",
            say: "It is exam week in the Biology lab. Chinedu has drawn onion cells and cheek cells, and he is very proud of them."
          },
          {
            target: { scene: "story", part: "cust2" }, action: "story:1", cue: "Coach Danjuma's advice",
            say: "Coach Danjuma is reading from a textbook. He says: label the mitochondria and the chloroplasts, examiners love those! More labels, more marks."
          },
          {
            target: { scene: "story", part: "drawingMarked" }, action: "story:2", cue: "Four out of ten",
            say: "Dr Amaka marks the drawing with her red pen. Four out of ten! Chinedu cannot believe it."
          },
          {
            target: { scene: "story", part: "amaka" }, action: "story:3", cue: "True in the textbook, not on your slide",
            say: "But Dr Amaka, everything I drew is true! Yes, Chinedu. It is true in the textbook, but not on your slide. The examiner marks what is on your slide."
          },
          {
            target: { scene: "story", part: "slides" }, action: "story:4", cue: "To the slide bench",
            say: "So Dr Amaka invites him to the slide bench. First we prepare two slides ourselves, then we audit his drawings against the nine rules."
          }
        ]
      },
      {
        title: "Wonder Wall",
        steps: [
          {
            target: "#wall-wonder", cue: "Pin your prediction", wait: "note",
            say: "Before we touch the bench, pin your prediction to the Wonder Wall. Why might a correct drawing lose marks?"
          }
        ]
      },
      {
        title: "Examiner Sort",
        steps: [
          {
            target: "#sort-board", cue: "Reward or penalise?", wait: "sort",
            say: "Activity one! Sort the ten cards into two bins: will the examiner reward it, or penalise it? Then tap Check my sorting."
          }
        ]
      },
      {
        title: "Slide Bench",
        steps: [
          {
            target: "#method-cards", action: "method:1", cue: "Four numbered method cards",
            say: "Here are the four method cards. Card one: peel the thin inner epidermis and lay it flat in a drop of iodine. Card two: lower the cover slip from one edge at about forty-five degrees. Card three is the cheek slide. Card four: view each slide on low power first, then high power."
          },
          {
            target: { scene: "bench", part: "peel" }, action: "bench:mode:onion", cue: "Thin peel, flat in iodine",
            say: "On the bench, the thin inner peel of the onion scale comes off with forceps. It is only one cell thick, so light passes through. It must lie flat in the iodine, never folded."
          },
          {
            target: { scene: "bench", part: "coverslip" }, action: "bench:mode:bubbles", cue: "Too flat: air bubbles",
            say: "Now watch what happens when the cover slip is held too flat, at only ten degrees. Air is trapped, and the view shows thick dark rings. Those are air bubbles, not cells! Lower it slowly at about forty-five degrees instead."
          },
          {
            target: { scene: "bench", part: "spatula" }, action: "bench:mode:cheek", cue: "Gentle scrape, then methylene blue",
            say: "For slide B, scrape the inside of the cheek gently with a clean spatula and smear it thinly. Add a drop of methylene blue and a cover slip. Afterwards, the used spatula goes into disinfectant."
          },
          {
            target: "#bench-stage", cue: "Your turn on the bench!", wait: "bench", action: "bench:mode:good",
            say: "Your turn! Prepare one good onion slide and one good cheek slide. Use Next step, or tap Mount it now. Then look at both slides at times one hundred and times four hundred."
          }
        ]
      },
      {
        title: "Drawing Audit",
        steps: [
          {
            target: "#audit-root", action: "audit:demo:d1", cue: "Drawing 1: four out of ten",
            say: "Now the drawing audit. Here is Chinedu's onion drawing. Look at the red numbers. It is too small, shaded, the guidelines have an arrowhead and cross, the label Nuclei is plural, and it names mitochondrion and chloroplast. Four out of ten."
          },
          {
            target: "#audit-root", action: "audit:demo:d2", cue: "Drawing 2: seven out of ten",
            say: "His cheek cell is better: seven out of ten. But there is no magnification, Nucleus is misspelt, and mitochondrion cannot be seen on this slide. Try judging the nine rules yourself."
          }
        ]
      },
      {
        title: "Movement Break",
        steps: [
          {
            target: "#movement-break", cue: "Stand up!", sparkle: true,
            say: "Time for a five-minute movement break. Stand up, shake out your hands, and draw a straight horizontal line in the air with your finger. That is how a good guideline looks!"
          }
        ]
      },
      {
        title: "Make Sense",
        steps: [
          {
            target: ["#results-table", "#props-table"], action: "open:#expected", cue: "Observable differences",
            say: "Now make sense of the slides. Fill in the results table: shape, cell wall, position of the nucleus, vacuole and stain. Only differences you can see on the slides earn marks. Mitochondria, E R and Golgi are textbook differences, not observable ones."
          },
          {
            target: "#eq-mag", cue: "Magnification = drawing ÷ actual", sparkle: true,
            say: "Drawing magnification equals drawing length divided by actual length, with both in the same unit. Actual size equals drawing length divided by M. And write M under the drawing with no unit."
          },
          {
            target: "#pos-explorer", action: "mag:4", cue: "Does it fit 6–8 cm?",
            say: "A specimen is one point two centimetres long, and the paper asks for a drawing between six and eight centimetres. At times four, it is only four point eight centimetres. Too small. Tap the other pins to find which magnifications fit."
          }
        ]
      },
      {
        title: "Slide Zoom",
        steps: [
          {
            target: { scene: "zoom", part: "view" }, action: "zoom:mode:x100", cue: "×100: 32 cells across",
            say: "Here is the onion slide through the eyepiece. At times one hundred the field is one point six millimetres, and about thirty-two cells fit across. Compare it with the textbook diagram on the right."
          },
          {
            target: { scene: "zoom", part: "mitochondrion" }, action: "zoom:mode:x400", cue: "Hidden: no stain, too small",
            say: "At times four hundred, eight cells fill the view. Now notice the textbook structures fading out. Chloroplasts are absent in onion bulb cells, ribosomes are too small, and mitochondria are not stained by iodine. If you cannot see it on your slide, do not label it."
          }
        ]
      },
      {
        title: "Worked Examples",
        steps: [
          {
            target: "#examples", cue: "Three calculations",
            say: "Study the three worked examples. In each one, first convert to the same unit, then divide. A Spirogyra segment of zero point four zero millimetres drawn eight centimetres long gives times two hundred. And a drawing of sixty millimetres at times one thousand five hundred shows a cell of forty micrometres."
          }
        ]
      },
      {
        title: "The Bridge",
        steps: [
          {
            target: "#bridge-test", cue: "Fix the drawings, close the case", wait: "bridge", action: "br:1",
            say: "Now close the unit's mystery. Run Step one and two to fix both drawings. Then Step three: put the onion peel in the salty water from Lesson four, and finally see the membrane pulled away from the wall."
          }
        ]
      },
      {
        title: "Quiz and Reflect",
        steps: [
          {
            target: "#quiz", cue: "Exam-style questions", wait: "quiz",
            say: "Test yourself on these exam-style questions about slides, drawing rules and magnification."
          },
          {
            target: "#reflect", cue: "Rate yourself, then the assignment",
            say: "Finally, rate your confidence from one to four, try the exit ticket, and complete Part A and Part B of the assignment. Well done for finishing the whole unit!"
          }
        ]
      }
    ]
  };
})();
