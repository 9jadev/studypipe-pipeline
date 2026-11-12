/* Lesson 01 · Choreographed StudyNarrator script (en-NG): Discovering the Cell, 28 steps.
   Symbols are spelled out in `say` so the voice reads them naturally (times, micrometres, millimetres). */
(function () {
  "use strict";
  function scene(name) { return window.StudyScenes && window.StudyScenes[name]; }
  function split(arg) { return String(arg || "").split(":"); }

  window.NARRATION = {
    rate: 0.96,
    pitch: 1.01,

    waits: {
      note: {
        event: "kit:note",
        prompt: "Type a prediction (or tap a seed idea) and pin it to the Wonder Wall",
        react: function () { return "Pinned! Keep that idea in mind. We are about to test it at the microscope."; }
      },
      sort: {
        event: "l1:sort",
        prompt: "Sort all nine clues, then tap Check my sorting",
        react: function (d) {
          if (!d) return "Good effort! Come back to the sort any time.";
          if (d.correct === d.total) return "Nine out of nine! Hooke named the empty walls, Dujardin found the living jelly, and Schleiden and Schwann said plants and animals are made of cells.";
          if (d.correct >= 7) return "Nice work, " + d.correct + " out of " + d.total + ". Read the reasons under the bins for any card that slipped.";
          return "You got " + d.correct + " out of " + d.total + ". Read the reasons below. Remember: Hooke saw dead walls, Dujardin saw the living jelly.";
        }
      },
      bench: {
        event: "l1:bench-done",
        prompt: "Focus the image, then press Measure at ×4, ×10 and ×40",
        react: function () {
          return {
            say: "Well done. You measured three powers. Look down the last two columns of your table: the cell width stays the same at every power. Magnifying changes the image, not the cell. Open the expected results to compare.",
            target: "#results-table", sparkle: true, cue: "Same width every time"
          };
        }
      },
      bridge: {
        event: "l1:bridge",
        prompt: "Answer both questions about the two unlabelled slides",
        react: function (d) {
          return (d && d.correct ? "Both right first time! " : "Solved! ") + "Slide Q is the ugu peel with walls, and a red blood cell is about eight micrometres wide. Both a leaf and blood are made of cells.";
        }
      },
      quiz: {
        event: "kit:quiz-done",
        prompt: "Answer all the quiz questions",
        react: function (d) {
          if (!d) return "Quiz complete!";
          if (d.score >= 10) return "Outstanding, " + d.score + " out of " + d.total + "! You have really discovered the cell.";
          if (d.score >= 7) return "Well done, " + d.score + " out of " + d.total + ". Read the explanations for the ones you missed.";
          return "You scored " + d.score + " out of " + d.total + ". Go back to the microscope bench and the equations, then try again.";
        }
      }
    },

    actions: {
      story: function (arg) { var s = scene("story"); if (s && s.beat) s.beat(+arg || 0); },
      open: function (sel) { var d = document.querySelector(sel); if (d && "open" in d) d.open = true; },
      pin: function (arg) { if (window.L01 && window.L01.showPin) window.L01.showPin(+arg || 0); },
      method: function (arg, later) {
        var b = scene("bench"); if (!b || !b.method) return;
        b.method(1);
        if (later) { later(function () { b.method(2); }, 3500); later(function () { b.method(3); }, 7000); later(function () { b.method(4); }, 10500); }
      },
      bench: function (arg) {
        var b = scene("bench"); if (!b) return;
        var p = split(arg);
        if (p[0] === "show") b.show(p[1]);
        else if (p[0] === "autoFocus") b.autoFocus();
        else if (p[0] === "slide") b.setSlide(p[1]);
        else if (p[0] === "blur") b.blur();
      },
      zoom: function (arg) {
        var z = scene("zoom"); if (!z) return;
        var p = split(arg);
        if (p[0] === "mode") z.setMode(p[1]);
        else if (p[0] === "set") z.set(p[1], p[2] !== "0");
        else if (p[0] === "reset") z.reset();
      }
    },

    script: [
      {
        title: "Welcome",
        steps: [
          {
            target: ".l-hero .display", cue: "Lesson 1 · Discovering the Cell", sparkle: true,
            say: "Welcome to Lesson 1! Ugu leaves and blood look nothing alike, so what do they share, and how do we see it? Today you will use a microscope to find out."
          },
          {
            target: "#objectives", cue: "5 goals for Lesson 1",
            say: "By the end you will state the three ideas of the cell theory, define a cell and an organelle, name the parts of a microscope and calculate total magnification, find the real size of a cell in micrometres, and compare prokaryotes with eukaryotes."
          }
        ]
      },
      {
        title: "Do Now",
        steps: [
          {
            target: "#donow-list", cue: "Wake up your toolkit", sparkle: true,
            say: "Start with four quick questions from your earlier science and maths. Think of your answer first, then flip the card."
          },
          { target: "#donow-list", wait: "donow", say: "Your turn. Reveal and mark each question. I will carry on when you have marked them all." }
        ]
      },
      {
        title: "The Story",
        steps: [
          {
            target: "#story-stage", action: "story:0", cue: "Mile 12 Market",
            say: "Welcome to Mile 12 Market in Lagos. Mama Ngozi shows Chinedu two ugu bunches picked the same morning. One is crisp. The other went limp after a salty wash."
          },
          {
            target: { scene: "story", part: "cust2" }, action: "story:1", cue: "Coach Danjuma's idea",
            say: "Coach Danjuma has a quick answer: the salt soaked in and made the leaf heavy. Chinedu is not convinced, and neither should we be, yet."
          },
          {
            target: { scene: "story", part: "amaka" }, action: "story:2", cue: "Dr Amaka at LUTH",
            say: "At the teaching hospital, Dr Amaka thinks about a patient who must never be given plain water through a drip. She says leaves and blood obey the same rule. To see why, we begin with what they are both made of."
          },
          {
            target: { scene: "story", part: "monitor" }, action: "story:3", cue: "Under the microscope",
            say: "She puts a thin ugu peel and a smear of blood under the microscope. They look different, but both show tiny compartments."
          },
          {
            target: { scene: "story", part: "scope" }, action: "story:4", cue: "Come to the bench",
            say: "In sixteen sixty-five a man looking at cork named shapes just like these. Today you will see them yourselves."
          }
        ]
      },
      {
        title: "Wonder Wall",
        steps: [
          {
            target: "#wall-wonder", cue: "Pin your prediction", wait: "note",
            say: "Before we look: what could a leaf and a drop of blood possibly have in common? Pin your prediction to the Wonder Wall."
          }
        ]
      },
      {
        title: "Who Found What",
        steps: [
          {
            target: "#hist-sort", cue: "Hooke, Dujardin, Schleiden and Schwann", wait: "sort",
            say: "Now the history. Sort the nine clues between Robert Hooke, Felix Dujardin, and Schleiden and Schwann. Tap a card, then tap a bin."
          }
        ]
      },
      {
        title: "3D Microscope",
        steps: [
          {
            target: "#method-cards", action: "method:1", cue: "Four method cards",
            say: "Here are the four steps of the practical. One: start on times four and focus with the coarse knob. Two: centre the specimen, then use times ten and times forty with the fine knob only. Three: record eyepiece, objective and total magnification. Four: count the cells across the field and record the field diameter."
          },
          {
            target: { scene: "bench", part: "objective" }, action: "bench:blur", cue: "Objectives and knobs",
            say: "On the microscope, the eyepiece is times ten. The nosepiece carries three objectives: times four, times ten and times forty. The coarse knob makes big focus moves, and the fine knob makes tiny ones. At times forty the coarse knob locks, so the lens cannot crush the slide."
          },
          {
            target: { scene: "bench", part: "eye" }, action: "bench:show:2", cue: "Times forty: field 0.40 mm",
            say: "Watch the eyepiece. With a times ten eyepiece and a times forty objective, the total magnification is ten times forty, four hundred. The field is only zero point four zero millimetres across, so just a few cells fit."
          },
          {
            target: "#bench-stage", cue: "Your turn at the bench!", wait: "bench", action: "bench:blur",
            say: "Your turn. The slide is blurred again. Focus on times four with the coarse knob, press Measure, then do the same at times ten and times forty with the fine knob. Measure all three powers."
          }
        ]
      },
      {
        title: "Movement Break",
        steps: [
          {
            target: "#movement-break", cue: "Stand up!", sparkle: true,
            say: "Time to move! Stand beside your desk and make a loop with your fingers: that is your field of view. Line up friends as cells across it, and call out: ten times forty, four hundred. Multiply, never add. Sit down when you are done."
          }
        ]
      },
      {
        title: "Make Sense",
        steps: [
          {
            target: "#cell-theory", cue: "The cell theory", sparkle: true,
            say: "A cell is the basic unit of life: it is both a building block and a working unit. An organelle is a tiny part inside the cell with one special job. The cell theory says every organism is made of one cell or many, cells carry out life processes, and new cells come only from existing cells."
          },
          {
            target: ["#eq-mag", "#eq-actual", "#eq-width", "#eq-conv"], cue: "Four equations",
            say: "Learn these four. Total magnification equals eyepiece times objective. Actual size equals image size divided by magnification. Cell width equals field diameter divided by the number of cells. And one millimetre is one thousand micrometres."
          },
          {
            target: "#props-table", cue: "Prokaryote vs eukaryote",
            say: "A prokaryote has no nuclear membrane, no membrane-bound organelles, smaller ribosomes, circular DNA, and is usually smaller. A eukaryote has a true nucleus, organelles like mitochondria, larger ribosomes, linear chromosomes, and is usually larger."
          },
          {
            target: "#pos-explorer", action: "pin:2", cue: "Image size of a 50 µm cell",
            say: "Tap the objectives in the explorer. A fifty micrometre cell looks two millimetres wide at times forty, five millimetres at times one hundred, and twenty millimetres at times four hundred. The cell did not grow; only the image did."
          },
          {
            target: ["#lesson-video", "#concepts h2"], cue: "Explainer video",
            say: "If your lesson has the short explainer video, watch it here. It shows how a microscope magnifies, why powers multiply, and how to find cell size from a field of view."
          }
        ]
      },
      {
        title: "3D Zoom",
        steps: [
          {
            target: { scene: "zoom", part: "plant" }, action: "zoom:mode:structure", cue: "Plant cell and bacterium",
            say: "Now the zoom. The plant cell has a nucleus wrapped in a double membrane, plus mitochondria, chloroplasts and more. The bacterium has its DNA as a free loop and no membrane-bound organelles. The counter reads zero for the bacterium and many for the plant cell."
          },
          {
            target: { scene: "zoom", part: "bacterium" }, action: "zoom:mode:true", cue: "True size",
            say: "At true size the bacterium is about two micrometres, against fifty for the plant cell. That is twenty-five times shorter. Prokaryotes are usually the smaller cells."
          }
        ]
      },
      {
        title: "Worked Examples",
        steps: [
          {
            target: "#ex1", cue: "Example 1",
            say: "Example one. Ten times forty is times four hundred. Forty hundredths of a millimetre divided by eight cells gives zero point zero five zero millimetres, and times one thousand gives fifty micrometres."
          },
          {
            target: "#ex2", cue: "Examples 2 and 3",
            say: "Example two: twenty-four millimetres divided by four hundred is zero point zero six millimetres, so sixty micrometres. Example three works the other way: a fifty millimetre drawing of a zero point two five millimetre cell is times two hundred, with no unit."
          }
        ]
      },
      {
        title: "The Big Idea",
        steps: [
          {
            target: "#bridge-test", cue: "Two unlabelled slides", wait: "bridge", action: "story:3",
            say: "Back to Dr Amaka's two slides. Which one is the ugu peel, and how wide is a red blood cell? Remember: cell width is the field diameter divided by the number of cells."
          }
        ]
      },
      {
        title: "Quiz and Reflect",
        steps: [
          {
            target: "#quiz", cue: "12 exam questions", wait: "quiz",
            say: "Test yourself on these twelve exam-style questions. Watch out for the trap: powers multiply, they never add."
          },
          {
            target: "#reflect", cue: "Rate yourself, then the assignment",
            say: "Finally, rate your confidence from one to four on each goal and try the exit ticket. For your assignment, do Part A and Part B from the questions file for this lesson."
          }
        ]
      }
    ]
  };
})();
