/* Lesson 02 · Choreographed StudyNarrator Script — Inside the Eukaryotic Cell: Organelles & Plant vs Animal Cells (en-NG) */
window.NARRATION = {
  rate: 0.96,
  pitch: 1.01,

  waits: {
    note: {
      event: "kit:note",
      prompt: "Type a prediction (or tap a seed question) and pin it to the Wonder Wall",
      react: function () {
        return "Pinned! Let's explore the organelles inside plant and animal cells.";
      }
    },
    sort: {
      event: "l2:sort-checked",
      prompt: "Sort all 12 cards into Plant-Only, Shared Eukaryotic, and Animal-Typical structures, then tap Check my sorting",
      react: function (d) {
        if (!d) return "Good effort!";
        if (d.score === d.total) return "Twelve out of twelve! You sorted plant-only structures, shared organelles, and animal-typical features without a single error.";
        if (d.score >= 9) return "Nice work! " + d.score + " out of " + d.total + ". Check the notes below for any card that slipped.";
        return "You got " + d.score + " out of " + d.total + ". Remember: both plant and animal cells have mitochondria, Rough ER, and Golgi bodies!";
      }
    },
    bench: {
      event: "l2:bench-done",
      prompt: "Record at least 4 tissue trials (A–E) on the 3D organelle bench",
      react: function () {
        return "Bravo! You showed that tissues with higher energy demand pack more mitochondrial cristae surface area to generate ATP.";
      }
    },
    bridge: {
      event: "l2:vinegar-done",
      prompt: "Run Steps 1, 2 and 3 to compare the ugu leaf cell with the catfish muscle cell",
      react: function () {
        return "Mystery solved! You connected cellulose walls, vacuoles, chloroplasts, and mitochondria to real Nigerian plant and animal tissues.";
      }
    },
    quiz: {
      event: "kit:quiz-done",
      prompt: "Answer all 12 WAEC/NECO/JAMB quiz questions",
      react: function (d) {
        if (!d) return "Quiz complete!";
        if (d.score >= 10) return "Outstanding — " + d.score + " out of " + d.total + "! You know every eukaryotic organelle inside out.";
        if (d.score >= 7) return "Well done! " + d.score + " out of " + d.total + ". Review the explanations on the ones you missed.";
        return "You scored " + d.score + " out of " + d.total + ". Replay the Make Sense and 3D Organelle Zoom chapters, then retry!";
      }
    }
  },

  actions: {
    "pin:0": function () { if (window.L02 && window.L02.showPin) window.L02.showPin(0); },
    "pin:1": function () { if (window.L02 && window.L02.showPin) window.L02.showPin(1); },
    "pin:4": function () { if (window.L02 && window.L02.showPin) window.L02.showPin(4); },
    "bench:heavy": function () { if (window.StudyScenes && window.StudyScenes.bench) window.StudyScenes.bench.setCond("heavy"); },
    "bench:std":   function () { if (window.StudyScenes && window.StudyScenes.bench) window.StudyScenes.bench.setCond("std"); },
    "clock:1": function () { if (window.L02 && window.L02.vt) window.L02.vt.step1(); },
    "clock:2": function () { if (window.L02 && window.L02.vt) window.L02.vt.step2(); }
  },

  script: [
    {
      title: "Welcome",
      steps: [
        {
          target: ".l-hero .display",
          cue: "Lesson 2 · Inside the Eukaryotic Cell",
          sparkle: true,
          say: "Welcome to Lesson 2! Today we step inside the eukaryotic cell to inspect every organelle — from the nucleus, Rough ER, and Golgi apparatus to the semi-autonomous mitochondria and chloroplasts — and compare plant and animal cells."
        },
        {
          target: ".l-hero .question",
          cue: "Our guiding question",
          say: "Here is our guiding puzzle: why does a green ugu leaf stand firm and manufacture its own sugar in sunlight, while a catfish muscle cell is soft, flexible, and must consume food?"
        },
        {
          target: "#objectives",
          cue: "5 goals for Lesson 2",
          say: "By the end of this lesson you will describe the structure and function of twelve eukaryotic organelles, explain why mitochondria and chloroplasts are semi-autonomous, trace the secretory pathway, calculate aerobic versus anaerobic ATP yields, and contrast plant and animal cells."
        }
      ]
    },
    {
      title: "Do Now",
      steps: [
        {
          target: "#donow-list",
          cue: "Retrieve Lesson 1 concepts",
          say: "Warm up with these four retrieval cards from Lesson 1 on Hooke's cork walls, Virchow's cell division rule, drawing magnification, and 70S versus 80S ribosomes."
        }
      ]
    },
    {
      title: "The Story",
      steps: [
        {
          target: "#story-stage",
          action: "story:0",
          cue: "Ugu Leaf vs Catfish at Mile 12",
          say: "At Mile 12 Market, Tunde compares a stiff green ugu leaf with a flexible catfish fillet."
        },
        {
          target: { scene: "story", part: "cust2" },
          action: "story:1",
          cue: "A classic WAEC misconception",
          say: "Alhaji Musa asks whether plant cells have chloroplasts instead of mitochondria."
        },
        {
          target: { scene: "story", part: "ngozi" },
          action: "story:2",
          cue: "Plant cells have BOTH!",
          say: "Mama Titi clears up that exam trap immediately: plant cells have BOTH chloroplasts AND mitochondria! Chloroplasts trap sunlight to make glucose, and mitochondria oxidise glucose into ATP day and night."
        },
        {
          target: { scene: "story", part: "clockA" },
          action: "story:3",
          cue: "3D Plant vs Animal Models",
          say: "Look at the two 3D models: the plant cell has a rigid cellulose cell wall, green chloroplasts, and a giant central sap vacuole bounded by a tonoplast."
        },
        {
          target: { scene: "story", part: "amaka" },
          action: "story:5",
          cue: "To the Yaba Organelle Lab!",
          say: "At the Yaba Cytology Lab, Doctor Kunle invites us to dissect both cells in 3D and test how mitochondrial cristae area drives ATP production."
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
          say: "Pin your prediction to the Wonder Wall before we start the organelle sort!"
        }
      ]
    },
    {
      title: "Organelle Sort",
      steps: [
        {
          target: "#kitchen-sort",
          cue: "Plant-Only vs Shared vs Animal-Typical",
          wait: "sort",
          say: "Activity 1! Sort all twelve cards into Plant-Only Structures, Shared Eukaryotic Organelles, and Animal-Typical Structures, then tap Check my sorting."
        }
      ]
    },
    {
      title: "3D Organelle Bench",
      steps: [
        {
          target: { scene: "bench", part: "clamp" },
          cue: "3D Plant Cell Cut-Away",
          say: "On the left of our 3D bench is the eukaryotic plant cell, showing its hexagonal cellulose cell wall, large central sap vacuole, green chloroplasts, peripheral nucleus, and mitochondria."
        },
        {
          target: { scene: "bench", part: "bob" },
          action: "bench:test:2",
          cue: "3D Animal Cell & ATP Trials",
          say: "On the right is the animal cell with its flexible plasma membrane, central nucleus, paired centrioles, lysosomes, and abundant mitochondria."
        },
        {
          target: "#bench-stage",
          action: "bench:std",
          cue: "Your turn on the bench!",
          wait: "bench",
          say: "Now it's your turn! Tap Trials A to E to record mitochondrial cristae surface area and ATP output across five different tissues."
        },
        {
          target: "#results-table",
          cue: "Complete the WAEC table",
          say: "Fill in the tissue name, ATP output rate, and ATP-to-cristae ratio in the table below."
        }
      ]
    },
    {
      title: "Organelles & ATP Math",
      steps: [
        {
          target: "#eq-shm",
          cue: "Aerobic vs Anaerobic ATP Ratio (19 : 1)",
          sparkle: true,
          say: "Look at the bioenergetics equation: complete aerobic respiration inside mitochondria yields 38 ATP per glucose, whereas anaerobic glycolysis in the cytoplasm yields only 2 ATP — a 19-to-1 advantage!"
        },
        {
          target: "#ph-explorer",
          action: "pin:1",
          cue: "Secretory Pathway: Rough ER → Golgi → Vesicle",
          say: "Tap along the Organelle Pathway Explorer: proteins made on 80S ribosomes of the Rough ER travel in transport vesicles to the Golgi apparatus for glycosylation and packaging."
        },
        {
          target: "#ph-explorer",
          action: "pin:4",
          cue: "Semi-Autonomous Mitochondria & Chloroplasts",
          say: "And tap Pin 5: both mitochondria and chloroplasts are double-membrane, semi-autonomous organelles with their own circular DNA and 70S ribosomes!"
        }
      ]
    },
    {
      title: "3D Mitochondrion & Chloroplast Zoom",
      steps: [
        {
          target: { scene: "zoom", part: "vectors" },
          action: "zoom:mode:acid",
          cue: "3D Mitochondrion Cut-Away",
          say: "Zoom inside the mitochondrion in 3D! Notice how the inner membrane folds into shelf-like cristae to pack thousands of ATP synthase enzymes around the matrix."
        },
        {
          target: { scene: "zoom", part: "vectors" },
          action: "zoom:mode:base",
          cue: "3D Chloroplast Cut-Away",
          say: "Switch to the chloroplast: green coin-like thylakoids stack into grana for the light stage of photosynthesis, suspended in the enzyme-rich stroma where the Calvin cycle fixes carbon dioxide!"
        }
      ]
    },
    {
      title: "Worked Examples & Bridge",
      steps: [
        {
          target: "#ex1",
          cue: "Example 1 · Aerobic vs Anaerobic ATP Yield",
          say: "Study Worked Example 1: 15 glucose molecules yield 570 ATP aerobically in mitochondria versus only 30 ATP anaerobically — a net gain of 540 ATP!"
        },
        {
          target: "#vinegar-test",
          action: "clock:1",
          cue: "Compare Ugu Leaf vs Catfish!",
          wait: "bridge",
          say: "Now complete Steps 1, 2, and 3 in the Bridge activity to contrast Mama Titi's ugu leaf cell with the catfish muscle cell."
        }
      ]
    },
    {
      title: "Quiz & Reflect",
      steps: [
        {
          target: "#quiz",
          cue: "12 WAEC & JAMB Questions",
          wait: "quiz",
          say: "Answer all twelve exam-style questions on organelle functions, plastids, and plant versus animal cells."
        },
        {
          target: "#reflect",
          cue: "Rate your confidence & Assignment",
          say: "Rate your confidence from 1 to 4, complete the Exit Ticket, and tackle the 30-mark assignment before moving to Lesson 3!"
        }
      ]
    }
  ]
};
