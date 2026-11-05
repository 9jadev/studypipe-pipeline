/* Lesson 01 · Choreographed StudyNarrator Script — Discovery of the Cell, Cell Theory & Prokaryotes vs Eukaryotes (en-NG) */
window.NARRATION = {
  rate: 0.96,
  pitch: 1.01,

  waits: {
    note: {
      event: "kit:note",
      prompt: "Type a prediction (or tap a seed question) and pin it to the Wonder Wall",
      react: function () {
        return "Pinned! Now let's test your ideas on cell pioneers and microscopy.";
      }
    },
    sort: {
      event: "l1:sort-checked",
      prompt: "Sort all 12 cards into Cell Theory Pioneers, Prokaryotic Features, and Eukaryotic Features, then tap Check my sorting",
      react: function (d) {
        if (!d) return "Good effort!";
        if (d.score === d.total) return "Twelve out of twelve! You distinguished Cell Theory pioneers, 70S prokaryotes, and 80S eukaryotes flawlessly.";
        if (d.score >= 9) return "Nice work! " + d.score + " out of " + d.total + ". Check the notes below for any card that slipped.";
        return "You got " + d.score + " out of " + d.total + ". Review the feedback below — WAEC and JAMB love contrasting 70S prokaryotes with 80S eukaryotes!";
      }
    },
    bench: {
      event: "l1:bench-done",
      prompt: "Record at least 4 objective lens trials (A–E) on the 3D microscope bench",
      react: function () {
        return "Splendid! You measured image size I across four objective lenses and proved that I divided by M equals the constant actual cell length A = 0.060 mm (60 micrometres).";
      }
    },
    bridge: {
      event: "l1:vinegar-done",
      prompt: "Run Steps 1, 2 and 3 to calibrate Tunde's onion cell measurement",
      react: function () {
        return "Calibration complete! Converting millimetres to micrometres first makes M equals I over A crystal clear.";
      }
    },
    quiz: {
      event: "kit:quiz-done",
      prompt: "Answer all 12 WAEC/NECO/JAMB quiz questions",
      react: function (d) {
        if (!d) return "Quiz complete!";
        if (d.score >= 10) return "Outstanding — " + d.score + " out of " + d.total + "! You have mastered Cell Theory, Microscopy, and Prokaryotes versus Eukaryotes.";
        if (d.score >= 7) return "Well done! " + d.score + " out of " + d.total + ". Review the explanations on the ones you missed.";
        return "You scored " + d.score + " out of " + d.total + ". Replay the Make Sense and 3D Cell Zoom chapters, then retry!";
      }
    }
  },

  actions: {
    "pin:0": function () { if (window.L01 && window.L01.showPin) window.L01.showPin(0); },
    "pin:1": function () { if (window.L01 && window.L01.showPin) window.L01.showPin(1); },
    "pin:4": function () { if (window.L01 && window.L01.showPin) window.L01.showPin(4); },
    "bench:heavy": function () { if (window.StudyScenes && window.StudyScenes.bench) window.StudyScenes.bench.setCond("heavy"); },
    "bench:std":   function () { if (window.StudyScenes && window.StudyScenes.bench) window.StudyScenes.bench.setCond("std"); },
    "clock:1": function () { if (window.L01 && window.L01.vt) window.L01.vt.step1(); },
    "clock:2": function () { if (window.L01 && window.L01.vt) window.L01.vt.step2(); }
  },

  script: [
    {
      title: "Welcome",
      steps: [
        {
          target: ".l-hero .display",
          cue: "Lesson 1 · Discovery, Cell Theory & Prokaryotes vs Eukaryotes",
          sparkle: true,
          say: "Welcome to Lesson 1 of Plant and Animal Cell Structure! Today we trace how scientists discovered the cell, formulate the Cell Theory, master microscope magnification M equals I over A, and contrast prokaryotic bacteria with eukaryotic cells."
        },
        {
          target: ".l-hero .question",
          cue: "Our guiding question",
          say: "Here is our guiding puzzle: how did a slice of dead bottle cork in 1665 reveal the hidden building blocks of every plant, animal, and microbe on Earth?"
        },
        {
          target: "#objectives",
          cue: "5 goals for Lesson 1",
          say: "By the end of this lesson you will trace contributions from Hooke, Leeuwenhoek, Brown, Dujardin, Purkinje, Schleiden, Schwann, and Virchow, explain why viruses sit on the borderline of life, calculate magnification in micrometres, and compare 70S prokaryotes with 80S eukaryotes."
        }
      ]
    },
    {
      title: "Do Now",
      steps: [
        {
          target: "#donow-list",
          cue: "Wake up your biology toolkit",
          say: "Start with these four quick Do Now cards on characteristics of life, SI micrometre conversions, compound microscope lenses, and ratio equations. Answer each in your head before flipping!"
        }
      ]
    },
    {
      title: "The Story",
      steps: [
        {
          target: "#story-stage",
          action: "story:0",
          cue: "Mile 12 Market, Lagos",
          say: "Let's step into Mama Titi's fresh vegetable stall at Mile 12 Market, Lagos. Tunde wonders how an onion bulb, an iroko tree, and a human being are all built from microscopic cells."
        },
        {
          target: { scene: "story", part: "cust2" },
          action: "story:1",
          cue: "Hooke's 1665 bottle cork",
          say: "Alhaji Musa asks whether Robert Hooke was looking at living cells when he coined the word cell in 1665."
        },
        {
          target: { scene: "story", part: "ngozi" },
          action: "story:2",
          cue: "Dead walls vs living protoplasm",
          say: "Mama Titi points out a classic WAEC truth: bottle cork is dead bark! Hooke saw only empty cell walls. Dujardin and Purkinje showed that living cells are filled with jelly-like protoplasm."
        },
        {
          target: { scene: "story", part: "clockB" },
          action: "story:3",
          cue: "Schleiden, Schwann & Virchow",
          say: "Schleiden and Schwann unified plants and animals under the Cell Theory, and Rudolf Virchow added Omnis cellula e cellula — every cell arises from a pre-existing living cell."
        },
        {
          target: { scene: "story", part: "amaka" },
          action: "story:5",
          cue: "To the Yaba Microscopy Lab!",
          say: "At the Yaba Diagnostic Lab, Doctor Kunle sets up the compound light microscope so we can measure onion cells across five objective lenses."
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
          say: "Before we touch the 3D microscope, pin your prediction or question to the Wonder Wall!"
        }
      ]
    },
    {
      title: "Pioneer & Cell Sort",
      steps: [
        {
          target: "#kitchen-sort",
          cue: "Pioneers vs Prokaryotes vs Eukaryotes",
          wait: "sort",
          say: "Activity 1! Sort all twelve cards into Cell Theory Pioneers, Prokaryotic Features, and Eukaryotic Features, then tap Check my sorting."
        }
      ]
    },
    {
      title: "3D Microscope Bench",
      steps: [
        {
          target: "#safety-box",
          cue: "WAEC Microscopy Rules",
          say: "Now step up to the 3D Compound Microscope Bench! Always start with the low-power objective lens, and use only the fine adjustment knob under high power so you never crack the slide."
        },
        {
          target: { scene: "bench", part: "clamp" },
          cue: "Eyepiece Lens (×10)",
          say: "At the top of the body tube is the times-10 ocular eyepiece lens."
        },
        {
          target: { scene: "bench", part: "ruler" },
          cue: "Revolving Nosepiece & Objectives",
          say: "Below it is the revolving nosepiece carrying our objective lenses from times 4 up to times 60."
        },
        {
          target: { scene: "bench", part: "bob" },
          action: "bench:test:1",
          cue: "Trial B · ×100 Total Magnification",
          say: "Watch Trial B: with a times 10 eyepiece and times 10 objective, total magnification M is times 100, and our 60-micrometre onion cell gives a 6 point 00 millimetre image!"
        },
        {
          target: "#bench-stage",
          action: "bench:std",
          cue: "Your turn on the microscope!",
          wait: "bench",
          say: "Now it's your turn! Tap the trial buttons A to E to record at least four lens magnifications."
        },
        {
          target: "#results-table",
          cue: "Complete the WAEC table",
          say: "Select your recorded objective power, image length I, and actual cell length A in the table below."
        },
        {
          target: "#expected",
          action: "open:#expected",
          cue: "Slope ΔI / ΔM = A = 0.060 mm (60 µm)",
          say: "Look at the completed table: dividing image size I by total magnification M always yields 0 point 060 millimetres, or 60 micrometres!"
        }
      ]
    },
    {
      title: "Cell Theory & Magnification",
      steps: [
        {
          target: "#eq-shm",
          cue: "Total Magnification: M_total = M_e × M_o",
          sparkle: true,
          say: "Let's lock in the two microscopy equations: first, total magnification equals eyepiece magnification multiplied by objective magnification."
        },
        {
          target: ["#eq-omega", "#eq-vel"],
          cue: "Linear Magnification: M = I ÷ A (1 mm = 1000 µm)",
          say: "Second, linear magnification M equals image size I divided by actual size A — and always multiply millimetres by 1000 to convert into micrometres before dividing!"
        },
        {
          target: "#ph-explorer",
          action: "pin:0",
          cue: "0.10 µm Virus Particle",
          say: "Tap along the Biological Scale Explorer: at 0 point 10 micrometres, a virus is smaller than the wavelength of visible light and has no protoplasm, so it requires an electron microscope."
        },
        {
          target: "#ph-explorer",
          action: "pin:4",
          cue: "60 µm Onion Epidermal Cell",
          say: "At 60 micrometres, an Allium cepa onion epidermal cell is 30 times longer than an E. coli bacterium!"
        }
      ]
    },
    {
      title: "3D Prokaryote vs Eukaryote Zoom",
      steps: [
        {
          target: { scene: "zoom", part: "vectors" },
          action: "zoom:mode:acid",
          cue: "Prokaryotic Bacterium (70S, Nucleoid)",
          say: "Zoom inside the prokaryotic bacterium in 3D! Notice the naked circular DNA loop in the nucleoid, tiny 70S ribosomes, peptidoglycan cell wall, and rotary flagellum — with zero membrane-bound organelles."
        },
        {
          target: { scene: "zoom", part: "vectors" },
          action: "zoom:mode:base",
          cue: "Eukaryotic Cell (80S, True Nucleus)",
          say: "Switch to the Eukaryotic Cell: here DNA is enclosed inside a double-membrane nuclear envelope, cytoplasmic ribosomes are 80S, and ATP is made inside membrane-bound mitochondria!"
        }
      ]
    },
    {
      title: "Worked Examples & Bridge",
      steps: [
        {
          target: "#ex1",
          cue: "Example 1 · Drawing Magnification in µm",
          say: "Study Worked Example 1: every step is expanded in LaTeX with an explainer note underneath — convert 48 millimetres to 48,000 micrometres first, then divide by 60 micrometres to get times 800."
        },
        {
          target: "#vinegar-test",
          action: "clock:1",
          cue: "Calibrate Tunde's Onion Cell!",
          wait: "bridge",
          say: "Now help Tunde calibrate his Yaba Lab measurement! Click Steps 1, 2, and 3 to convert millimetres to micrometres, find actual size A, and compare with E. coli."
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
          say: "Test yourself on these twelve exam-style questions on Cell Theory pioneers, viruses, magnification, and prokaryotes versus eukaryotes."
        },
        {
          target: "#reflect",
          cue: "Rate your confidence & Assignment",
          say: "Finally, rate your confidence from 1 to 4, complete the Exit Ticket, and try the 30-mark assignment before moving to Lesson 2!"
        }
      ]
    }
  ]
};
