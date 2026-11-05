/* Lesson 03 · Choreographed StudyNarrator Script — Forms of Living Cells & Levels of Biological Organisation (en-NG) */
window.NARRATION = {
  rate: 0.96,
  pitch: 1.01,

  waits: {
    note: {
      event: "kit:note",
      prompt: "Type a prediction (or tap a seed question) and pin it to the Wonder Wall",
      react: function () {
        return "Pinned! Let's explore the four forms of living cells and the five levels of organisation.";
      }
    },
    sort: {
      event: "l3:sort-checked",
      prompt: "Sort all 12 cards into Single Free-Living Cells, Colonies & Filaments, and Tissues/Organs/Systems, then tap Check my sorting",
      react: function (d) {
        if (!d) return "Good effort!";
        if (d.score === d.total) return "Twelve out of twelve! You sorted free-living protists, Volvox colonies, Spirogyra filaments, and multicellular tissues and organs perfectly.";
        if (d.score >= 9) return "Nice work! " + d.score + " out of " + d.total + ". Check the notes below for any card that slipped.";
        return "You got " + d.score + " out of " + d.total + ". Review the feedback below — WAEC tests Volvox versus Spirogyra and the onion bulb organ level almost every year!";
      }
    },
    bench: {
      event: "l3:bench-done",
      prompt: "Record at least 4 cube & protist trials (A–E) on the 3D SA/V bench",
      react: function () {
        return "Well done! You proved that as side length L grows from 1 millimetre to 6 millimetres, surface-area-to-volume ratio SA over V drops from 6 down to 1!";
      }
    },
    bridge: {
      event: "l3:vinegar-done",
      prompt: "Run Steps 1, 2 and 3 to classify Mama Titi's onion bulb and SA/V scaling",
      react: function () {
        return "Spot on! An onion bulb is a complete plant organ because it combines epidermal, storage parenchyma, xylem, and phloem tissues.";
      }
    },
    quiz: {
      event: "kit:quiz-done",
      prompt: "Answer all 12 WAEC/NECO/JAMB quiz questions",
      react: function (d) {
        if (!d) return "Quiz complete!";
        if (d.score >= 10) return "Outstanding — " + d.score + " out of " + d.total + "! You have mastered Forms of Living Cells and Biological Organisation.";
        if (d.score >= 7) return "Well done! " + d.score + " out of " + d.total + ". Review the explanations on the ones you missed.";
        return "You scored " + d.score + " out of " + d.total + ". Replay the Make Sense and 3D Protist Zoom chapters, then retry!";
      }
    }
  },

  actions: {
    "pin:0": function () { if (window.L03 && window.L03.showPin) window.L03.showPin(0); },
    "pin:2": function () { if (window.L03 && window.L03.showPin) window.L03.showPin(2); },
    "pin:4": function () { if (window.L03 && window.L03.showPin) window.L03.showPin(4); },
    "bench:heavy": function () { if (window.StudyScenes && window.StudyScenes.bench) window.StudyScenes.bench.setCond("heavy"); },
    "bench:std":   function () { if (window.StudyScenes && window.StudyScenes.bench) window.StudyScenes.bench.setCond("std"); },
    "clock:1": function () { if (window.L03 && window.L03.vt) window.L03.vt.step1(); },
    "clock:2": function () { if (window.L03 && window.L03.vt) window.L03.vt.step2(); }
  },

  script: [
    {
      title: "Welcome",
      steps: [
        {
          target: ".l-hero .display",
          cue: "Lesson 3 · Forms of Living Cells & Organisation",
          sparkle: true,
          say: "Welcome to Lesson 3! Today we explore the four forms in which living cells exist — single free-living cells, colonies, filaments, and part of a multicellular organism — plus the five levels of biological organisation and the surface-area-to-volume law!"
        },
        {
          target: ".l-hero .question",
          cue: "Our guiding question",
          say: "Here is our guiding puzzle: why can a microscopic Amoeba in Ogun River water breathe across its cell membrane alone, while a Tilapia fish or onion plant needs specialized tissues, organs, and transport systems?"
        },
        {
          target: "#objectives",
          cue: "5 goals for Lesson 3",
          say: "By the end of this lesson you will distinguish Amoeba, Paramecium, Euglena, and Chlamydomonas, contrast colonial Volvox with filamentous Spirogyra, classify tissues and organs like the onion bulb, and calculate surface-area-to-volume ratios."
        }
      ]
    },
    {
      title: "Do Now",
      steps: [
        {
          target: "#donow-list",
          cue: "Retrieve Lessons 1 & 2",
          say: "Start with these four retrieval cards on mitochondria, the Golgi secretory pathway, starch versus glycogen storage, and cube geometry."
        }
      ]
    },
    {
      title: "The Story",
      steps: [
        {
          target: "#story-stage",
          action: "story:0",
          cue: "Ogun River Pond Safari",
          say: "By the Ogun River near Mile 12 Market, Tunde scoops a jar of green pond water and holds up one of Mama Titi's purple onion bulbs."
        },
        {
          target: { scene: "story", part: "cust2" },
          action: "story:1",
          cue: "Is an onion bulb a tissue?",
          say: "Alhaji Musa guesses that a whole onion bulb is just a single storage tissue."
        },
        {
          target: { scene: "story", part: "ngozi" },
          action: "story:2",
          cue: "An onion bulb is an ORGAN!",
          say: "Mama Titi corrects him right away: the thin peel is epidermal tissue, but the whole onion bulb combines epidermis, storage parenchyma, xylem, and phloem — making it a complete plant organ!"
        },
        {
          target: { scene: "story", part: "clockA" },
          action: "story:3",
          cue: "Volvox Colony vs Spirogyra Filament",
          say: "And in the pond jar are single free-living Euglena, hollow spherical Volvox colonies, and unbranched Spirogyra filaments!"
        },
        {
          target: { scene: "story", part: "amaka" },
          action: "story:5",
          cue: "To the Yaba SA/V Lab!",
          say: "At the Yaba Lab, Doctor Kunle sets up our 3D protist carousel and surface-area-to-volume scaling cubes."
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
          say: "Pin your prediction to the Wonder Wall before we sort the twelve organisms and structures!"
        }
      ]
    },
    {
      title: "Cell Forms Sort",
      steps: [
        {
          target: "#kitchen-sort",
          cue: "Free-Living vs Colony/Filament vs Tissue/Organ",
          wait: "sort",
          say: "Activity 1! Sort all twelve cards into Single Free-Living Cells, Colonies and Filaments, and Tissues, Organs or Systems, then tap Check my sorting."
        }
      ]
    },
    {
      title: "3D Protist & SA/V Bench",
      steps: [
        {
          target: { scene: "bench", part: "clamp" },
          cue: "3D Protist Safari Carousel",
          say: "On the left of our 3D bench is the live pond specimen — starting with mixotrophic Euglena with its green chloroplasts, red eyespot, and anterior flagellum."
        },
        {
          target: { scene: "bench", part: "bob" },
          action: "bench:test:0",
          cue: "3D Scaling Cube (SA/V = 6/L)",
          say: "On the right is our 3D scaling cube: at side length L equals 1 millimetre, surface area is 6 square millimetres and volume is 1 cubic millimetre, giving a huge ratio of 6 per millimetre!"
        },
        {
          target: "#bench-stage",
          action: "bench:std",
          cue: "Your turn on the bench!",
          wait: "bench",
          say: "Now it's your turn! Tap Trials A to E to inspect Euglena, Paramecium, Amoeba, Volvox, and Spirogyra while recording SA, V, and SA over V."
        },
        {
          target: "#results-table",
          cue: "Complete the SA/V table",
          say: "Select the matching surface area, volume, and SA-over-V ratio in the table below."
        }
      ]
    },
    {
      title: "Hierarchy & SA/V Law",
      steps: [
        {
          target: "#eq-shm",
          cue: "Surface-Area-to-Volume Law: SA/V = 6 ÷ L",
          sparkle: true,
          say: "Look at the mathematical proof: surface area is 6 L squared while volume is L cubed, so the ratio SA over V simplifies to 6 divided by L! As an organism grows larger, SA over V drops inversely with L."
        },
        {
          target: "#ph-explorer",
          action: "pin:2",
          cue: "Level 3 · Why an Onion Bulb is an Organ",
          say: "Tap Pin 3 on the Biological Hierarchy Explorer: an onion bulb, leaf, root, heart, or eye is an organ because it integrates several distinct tissues."
        }
      ]
    },
    {
      title: "3D Protist & Hydra Zoom",
      steps: [
        {
          target: { scene: "zoom", part: "vectors" },
          action: "zoom:mode:mix",
          cue: "Euglena & Volvox Colony",
          say: "Rotate our 3D models of Euglena and the spherical Volvox colony linked by cytoplasmic bridges!"
        },
        {
          target: { scene: "zoom", part: "vectors" },
          action: "zoom:mode:acid",
          cue: "Spirogyra Unbranched Filament",
          say: "Switch to Spirogyra: notice the cylindrical cells joined end to end, each containing a spiral ribbon chloroplast studded with starch-forming pyrenoids."
        },
        {
          target: { scene: "zoom", part: "vectors" },
          action: "zoom:mode:base",
          cue: "Hydra (Diploblastic Tissue Level)",
          say: "Switch to Hydra: this freshwater animal has ectoderm and endoderm tissues and stinging tentacles, but no true organs!"
        }
      ]
    },
    {
      title: "Worked Examples & Bridge",
      steps: [
        {
          target: "#ex1",
          cue: "Example 1 · Cube SA/V Calculation",
          say: "Study Worked Example 1: every step from SA equals 6 L squared to SA over V equals 6 over L is shown in LaTeX with an explainer note underneath."
        },
        {
          target: "#vinegar-test",
          action: "clock:1",
          cue: "Classify the Onion Bulb!",
          wait: "bridge",
          say: "Now complete Steps 1, 2, and 3 in the Bridge solver to prove why Mama Titi's onion bulb is a plant organ!"
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
          say: "Test yourself on these twelve exam-style questions on Euglena, Volvox, Spirogyra, Hydra, SA-over-V ratios, and levels of organisation."
        },
        {
          target: "#reflect",
          cue: "Rate your confidence & Assignment",
          say: "Rate your confidence from 1 to 4, complete the Exit Ticket, and try the 30-mark assignment before moving to Lesson 4!"
        }
      ]
    }
  ]
};
