/* Lesson 02 · Choreographed StudyNarrator script: Inside the Cell, Organelles, Plant vs Animal Cells (en-NG) */
window.NARRATION = {
  rate: 0.96,
  pitch: 1.01,

  waits: {
    note: {
      event: "kit:note",
      prompt: "Pin your idea to the Wonder Wall: which workers does a cell need?",
      react: function () {
        return "Pinned! Hold on to that idea. Now let's see which workers a cell really has.";
      }
    },
    sort: {
      event: "l2:sort",
      prompt: "Sort all 10 cards into double, single and no membrane, then tap Check my sorting",
      react: function (d) {
        if (!d) return "Good effort!";
        if (d.correct === d.total) return "Ten out of ten! You even remembered that the cell wall is not a membrane at all.";
        if (d.correct >= 8) return "Nice work! " + d.correct + " out of " + d.total + ". Read the notes for any card that slipped.";
        return "You got " + d.correct + " out of " + d.total + ". Read the feedback carefully. Membrane counts are a classic exam question.";
      }
    },
    bench: {
      event: "l2:bench-done",
      prompt: "Tap at least 8 different organelles on the dissector",
      react: function () {
        return "Well done! You have met eight organelles. Now let's fill in the table and compare the two cells.";
      }
    },
    bridge: {
      event: "l2:bridge",
      prompt: "Predict: which cell can resist bursting in pure water?",
      react: function (d) {
        if (d && d.correct) return "Yes! The ugu cell. Its cellulose wall pushes back, so it becomes firm instead of bursting.";
        return "Not quite. It is the ugu cell. Its cellulose wall pushes back against the water. The red blood cell has no wall, so it bursts.";
      }
    },
    quiz: {
      event: "kit:quiz-done",
      prompt: "Answer all the quiz questions",
      react: function (d) {
        if (!d) return "Quiz complete!";
        if (d.score >= 11) return "Outstanding! " + d.score + " out of " + d.total + ". You really know the inside of the cell.";
        if (d.score >= 8) return "Well done! " + d.score + " out of " + d.total + ". Read the explanations on the ones you missed.";
        return "You scored " + d.score + " out of " + d.total + ". Replay the organelle table and the zoom, then try again.";
      }
    }
  },

  actions: {
    story: function (arg) { var s = window.StudyScenes && window.StudyScenes.story; if (s && s.beat) s.beat(+arg); },
    method: function (arg) {
      var cards = document.querySelectorAll("#method-cards .method");
      Array.prototype.forEach.call(cards, function (c, i) { c.classList.toggle("now", i === (+arg) - 1); });
    },
    open: function (arg) { var d = document.querySelector(arg); if (d && d.tagName === "DETAILS") d.open = true; },
    pin: function (arg) { if (window.L02 && window.L02.showPin) window.L02.showPin(+arg); },
    bench: function (arg) {
      var p = arg.split(":"), b = window.StudyScenes && window.StudyScenes.bench;
      if (!b) return;
      if (p[0] === "pick" && b.pick) b.pick(p[1]);
      else if (p[0] === "view" && b.setView) b.setView(p[1]);
      else if (p[0] === "light" && b.lightMembranes) b.lightMembranes(p[1] === "none" ? null : +p[1]);
    },
    zoom: function (arg) {
      var p = arg.split(":"), z = window.StudyScenes && window.StudyScenes.zoom;
      if (!z) return;
      if (p[0] === "mode" && z.setMode) z.setMode(p[1]);
      else if (p[0] === "step" && z.step) z.step(+p[1]);
      else if (p[0] === "select" && z.select) z.select(p[1], true);
    },
    bridge: function () { if (window.L02 && window.L02.bridge) { /* the learner answers; the narrator only points */ } }
  },

  script: [
    {
      title: "Welcome",
      steps: [
        {
          target: ".l-hero .display",
          cue: "Lesson 2 · Inside the Cell",
          sparkle: true,
          say: "Welcome to Lesson 2 of Plant and Animal Cells! Today we open the cell and meet its workers, the organelles."
        },
        {
          target: ".l-hero .question",
          cue: "Our guiding question",
          say: "Here is our guiding question: what is inside an ugu cell that a blood cell lacks, and why does that matter for water?"
        },
        {
          target: "#objectives",
          cue: "5 goals for Lesson 2",
          say: "By the end you will describe each organelle, sort them by membranes, compare plant and animal cells, trace a protein from the ribosome to the outside, and explain why ribosomes can never be seen with a school microscope."
        }
      ]
    },
    {
      title: "Do Now",
      steps: [
        {
          target: "#donow-list",
          cue: "Wake up Lesson 1",
          sparkle: true,
          say: "Before the story, a quick warm-up. These four questions come from Lesson 1. Answer each one from memory first, then reveal the answer and mark yourself honestly."
        },
        {
          target: "#donow-list",
          cue: "Your turn",
          wait: "donow",
          say: "Your turn. Reveal and mark each question. I will carry on when you have marked them all, or you can press Next."
        }
      ]
    },
    {
      title: "The Story",
      steps: [
        {
          target: "#story-stage",
          action: "story:0",
          cue: "The LUTH teaching lab",
          say: "We are in the teaching lab at LUTH. Dr Amaka has projected two giant cells: a plant cell from an ugu leaf, and an animal cell from a cheek."
        },
        {
          target: { scene: "story", part: "cust2" },
          action: "story:1",
          cue: "Coach Danjuma's doubt",
          say: "Coach Danjuma is not impressed. He says a cell is just a bag of water."
        },
        {
          target: { scene: "story", part: "cust1" },
          action: "story:2",
          cue: "Chinedu spots the wall",
          say: "But Chinedu looks carefully. The ugu cell has a thick layer all around the outside. The cheek cell does not."
        },
        {
          target: { scene: "story", part: "amaka" },
          action: "story:3",
          cue: "Wall and sap vacuole",
          say: "Dr Amaka agrees. That wall, and the big sap vacuole, will decide what happens to a leaf in salty water. So today we open the cell and meet its workers."
        },
        {
          target: "#story-stage",
          action: "story:4",
          cue: "Off to the dissector",
          say: "Now Dr Amaka invites us to the organelle dissector. Let's go and tap every part."
        }
      ]
    },
    {
      title: "Wonder Wall",
      steps: [
        {
          target: "#wall-wonder",
          cue: "Pin your idea",
          wait: "note",
          say: "If the cell is a small factory, which workers would it need? A boss to give orders? A power station? A kitchen? Pin your idea to the Wonder Wall."
        }
      ]
    },
    {
      title: "Membrane Sort",
      steps: [
        {
          target: "#membrane-sort",
          cue: "How many membranes?",
          wait: "sort",
          say: "Activity one! Sort all ten cards into double membrane, single membrane and no membrane. Careful with the cell wall. Is it a membrane at all? Then tap Check my sorting."
        }
      ]
    },
    {
      title: "Organelle Dissector",
      steps: [
        {
          target: "#method-cards",
          action: "method:1",
          cue: "Four steps",
          say: "Now the organelle dissector. Four steps: tap each organelle in the plant cell, repeat for the animal cell, fill in the table, and note what a school slide can show."
        },
        {
          target: { scene: "bench", part: "nucleus" },
          action: "bench:pick:nucleus",
          cue: "Nucleus · 2 membranes",
          say: "Start with the nucleus. It is wrapped in two membranes with pores, and it directs the cell. Notice the dark nucleolus inside, and that the plant nucleus sits to the side."
        },
        {
          target: { scene: "bench", part: "mitochondrion" },
          action: "bench:pick:mitochondrion",
          cue: "Mitochondrion · 2 membranes",
          say: "Now the mitochondrion in the animal cell. Two membranes again, and the inner one is folded. This is the power station. It releases energy in aerobic respiration."
        },
        {
          target: "#bench-stage",
          action: "method:2",
          cue: "Your turn on the dissector!",
          wait: "bench",
          say: "Your turn! Tap at least eight different organelles, in the plant cell and in the animal cell."
        },
        {
          target: "#results-table",
          action: "open:#expected",
          cue: "Fill in the table",
          say: "Now fill in the table. Choose the number of membranes, tick plant and animal, and say whether it shows on a school slide. Then open the expected table and compare. Three structures are only in plant cells: the wall, chloroplasts and the large vacuole."
        }
      ]
    },
    {
      title: "Make Sense",
      steps: [
        {
          target: "#props-table",
          cue: "Organelles and jobs",
          sparkle: true,
          say: "Let's make sense of it. This table gives each organelle's structure and its job. Learn them in pairs: nucleus with control, mitochondrion with energy, chloroplast with food, ribosome with protein."
        },
        {
          target: ["#pa-table", "#wm-table"],
          cue: "Plant vs animal · wall vs membrane",
          say: "Two tables for the exam. Plant against animal: wall, chloroplasts, large vacuole, and starch are plant. Centrioles and glycogen are animal. And the wall is cellulose, rigid, fully permeable and non-living, while the membrane is a living, flexible skin that chooses what passes."
        },
        {
          target: "#resolution",
          cue: "Magnification is not resolution",
          say: "Why can we never see ribosomes? Magnification makes an image bigger, but resolution is the ability to separate two close points. A school light microscope cannot separate points closer than about nought point two micrometres, so a ribosome stays a blur at any magnification."
        },
        {
          target: "#pos-explorer",
          action: "pin:2",
          cue: "Count the membranes",
          say: "Use the membrane explorer. Tap two, and the nucleus, mitochondrion and chloroplast light up in both cells. Then try one, and then zero. Remember: the cell wall is on the zero list because it is not a membrane."
        }
      ]
    },
    {
      title: "3D Zoom",
      steps: [
        {
          target: { scene: "zoom", part: "cristae" },
          action: "zoom:mode:mito",
          cue: "Inside the mitochondrion",
          say: "Zoom inside the mitochondrion. Two membranes, and the inner one folds into cristae around the matrix. More folds give more surface area for respiration, so a muscle cell is packed with them."
        },
        {
          target: { scene: "zoom", part: "grana" },
          action: "zoom:mode:chloro",
          cue: "Inside the chloroplast",
          say: "Now the chloroplast. Two membranes around a stroma with stacks of grana. The grana hold chlorophyll and capture light to make food."
        },
        {
          target: "#zoom-stage",
          action: "zoom:step:0",
          cue: "The protein route",
          say: "And now the protein route. A ribosome on the rough ER builds the protein. A vesicle carries it to the Golgi body, which packs it, and a second vesicle fuses with the cell membrane and releases it outside. Press the five steps to follow it."
        }
      ]
    },
    {
      title: "Worked Examples",
      steps: [
        {
          target: "#ex1",
          cue: "Size from a micrograph",
          say: "Example one. Actual size equals image size divided by magnification. Thirty millimetres divided by fifteen thousand is nought point nought nought two millimetres. Multiply by one thousand to get two micrometres. And Example two shows why a ribosome's ten micrometre image at times four hundred is still invisible."
        }
      ]
    },
    {
      title: "The Big Idea",
      steps: [
        {
          target: "#bridge-pick",
          cue: "Which cell survives?",
          wait: "bridge",
          say: "Back to our story. Water is entering both cells in pure water. Which cell can resist bursting? Tap your prediction."
        }
      ]
    },
    {
      title: "Quiz & Reflect",
      steps: [
        {
          target: "#quiz",
          cue: "Exam-style questions",
          wait: "quiz",
          say: "Test yourself on these exam-style questions on organelles, membranes, the protein route and size calculations."
        },
        {
          target: "#reflect",
          cue: "Rate yourself · Assignment",
          say: "Finally, rate your confidence from one to four, answer the exit ticket, and complete Part A and Part B of the assignment. See you in Lesson 3!"
        }
      ]
    }
  ]
};
