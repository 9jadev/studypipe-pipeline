/* Lesson 04 · Choreographed StudyNarrator Script — The Cell & Its Environment: Diffusion, Osmosis, Turgor, Plasmolysis, Haemolysis & Active Transport (en-NG) */
window.NARRATION = {
  rate: 0.96,
  pitch: 1.01,

  waits: {
    note: {
      event: "kit:note",
      prompt: "Type a prediction (or tap a seed question) and pin it to the Wonder Wall",
      react: function () {
        return "Pinned! Now let's test diffusion, osmosis, and active transport.";
      }
    },
    sort: {
      event: "l4:sort-checked",
      prompt: "Sort all 12 cards into Simple Diffusion, Osmosis & Tonicity, and Active/Bulk Transport, then tap Check my sorting",
      react: function (d) {
        if (!d) return "Good effort!";
        if (d.score === d.total) return "Twelve out of twelve! You distinguished simple diffusion, osmosis, plasmolysis, haemolysis, and ATP-driven active transport like a true biologist.";
        if (d.score >= 9) return "Nice work! " + d.score + " out of " + d.total + ". Check the notes below for any card that slipped.";
        return "You got " + d.score + " out of " + d.total + ". Review the feedback below — WAEC and JAMB test these transport mechanisms in every session!";
      }
    },
    bench: {
      event: "l4:bench-done",
      prompt: "Record at least 4 sucrose baths (A–E) on the 3D osmosis chamber",
      react: function () {
        return "Fantastic! You tracked endosmosis at 0.00 M, the isotonic zero-crossing at 0.30 M, and exosmosis/plasmolysis at 0.70 M!";
      }
    },
    bridge: {
      event: "l4:vinegar-done",
      prompt: "Run Steps 1, 2 and 3 to resolve the Mile 12 ugu leaf, salted fish, and hospital IV saline mystery",
      react: function () {
        return "Unit mystery solved! You explained why fresh water revives ugu leaves, why salt preserves fish, and why hospitals use 0.9 percent isotonic saline!";
      }
    },
    quiz: {
      event: "kit:quiz-done",
      prompt: "Answer all 12 WAEC/NECO/JAMB quiz questions",
      react: function (d) {
        if (!d) return "Quiz complete!";
        if (d.score >= 10) return "Outstanding — " + d.score + " out of " + d.total + "! You have mastered Diffusion, Osmosis, Turgor, Plasmolysis, Haemolysis, and Active Transport.";
        if (d.score >= 7) return "Well done! " + d.score + " out of " + d.total + ". Review the explanations on the ones you missed.";
        return "You scored " + d.score + " out of " + d.total + ". Replay the Make Sense and 3D Bilayer Zoom chapters, then retry!";
      }
    }
  },

  actions: {
    "pin:0": function () { if (window.L04 && window.L04.showPin) window.L04.showPin(0); },
    "pin:2": function () { if (window.L04 && window.L04.showPin) window.L04.showPin(2); },
    "pin:4": function () { if (window.L04 && window.L04.showPin) window.L04.showPin(4); },
    "bench:wide":  function () { if (window.StudyScenes && window.StudyScenes.bench) window.StudyScenes.bench.setCond("wide"); },
    "bench:std":   function () { if (window.StudyScenes && window.StudyScenes.bench) window.StudyScenes.bench.setCond("std"); },
    "clock:1": function () { if (window.L04 && window.L04.vt) window.L04.vt.step1(); },
    "clock:2": function () { if (window.L04 && window.L04.vt) window.L04.vt.step2(); }
  },

  script: [
    {
      title: "Welcome",
      steps: [
        {
          target: ".l-hero .display",
          cue: "Lesson 4 · The Cell & Its Environment",
          sparkle: true,
          say: "Welcome to Lesson 4! Today we resolve the central mystery of our unit: how living cells interact with their environment through diffusion, osmosis, turgidity, plasmolysis, haemolysis, crenation, and ATP-driven active transport!"
        },
        {
          target: ".l-hero .question",
          cue: "Our guiding question",
          say: "Here is our guiding puzzle: why does pure water make a wilted ugu leaf firm and crisp, yet burst a human red blood cell — while strong salt brine shrivels both?"
        },
        {
          target: "#objectives",
          cue: "5 goals for Lesson 4",
          say: "By the end of this lesson you will compare diffusion, osmosis, and active transport, contrast plant and animal cell responses in hypotonic, isotonic, and hypertonic solutions, calculate yam-strip percentage mass change, and explain why boiling destroys osmosis."
        }
      ]
    },
    {
      title: "Do Now",
      steps: [
        {
          target: "#donow-list",
          cue: "Retrieve Lessons 1–3",
          say: "Start with these four retrieval cards on the plasma membrane vs cellulose wall, the tonoplast, Euglena, and percentage change."
        }
      ]
    },
    {
      title: "The Story",
      steps: [
        {
          target: "#story-stage",
          action: "story:0",
          cue: "Mama Titi's Ugu & Salted Fish",
          say: "Back at Mile 12 Market, Tunde watches Mama Titi revive wilted ugu leaves with fresh water while salting Tilapia fish."
        },
        {
          target: { scene: "story", part: "cust2" },
          action: "story:1",
          cue: "Why not pure water in an IV drip?",
          say: "Alhaji Musa asks why hospital nurses never inject pure distilled water into a patient's vein if pure water is so good for ugu leaves."
        },
        {
          target: { scene: "story", part: "ngozi" },
          action: "story:2",
          cue: "Cellulose Wall vs No Wall!",
          say: "Mama Titi explains the secret: plant cells have a rigid cellulose cell wall that resists bursting and builds turgor pressure, whereas red blood cells have no cell wall and burst by haemolysis in pure water!"
        },
        {
          target: { scene: "story", part: "clockB" },
          action: "story:3",
          cue: "0.9% Isotonic Normal Saline",
          say: "That is why hospital drips always use isotonic 0 point 9 percent normal saline!"
        },
        {
          target: { scene: "story", part: "amaka" },
          action: "story:5",
          cue: "To the Yaba Osmosis Lab!",
          say: "At the Yaba Lab, Doctor Kunle sets up five sucrose baths from 0.00 molar to 0.70 molar so we can test yam strips, plant cells, and red blood cells."
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
          say: "Pin your prediction to the Wonder Wall before we sort the twelve transport examples!"
        }
      ]
    },
    {
      title: "Transport Sort",
      steps: [
        {
          target: "#kitchen-sort",
          cue: "Diffusion vs Osmosis vs Active Transport",
          wait: "sort",
          say: "Activity 1! Sort all twelve cards into Simple Diffusion, Osmosis and Tonicity, and Active or Bulk Transport, then tap Check my sorting."
        }
      ]
    },
    {
      title: "3D Osmosis Chamber",
      steps: [
        {
          target: { scene: "bench", part: "clamp" },
          cue: "3D Plant Cell (Turgor ↔ Plasmolysis)",
          say: "On the left of our 3D chamber is the plant cell: watch its central vacuole swell turgid in pure water and pull away from the cellulose wall in strong brine!"
        },
        {
          target: { scene: "bench", part: "bob" },
          action: "bench:test:0",
          cue: "3D Red Blood Cell (Haemolysis ↔ Crenation)",
          say: "On the right is the mammalian red blood cell: in 0.00 molar distilled water (Trial A), it swells and bursts by haemolysis while the yam strip gains 18 percent in mass!"
        },
        {
          target: "#bench-stage",
          action: "bench:std",
          cue: "Your turn on the bench!",
          wait: "bench",
          say: "Now it's your turn! Tap Trials A to E to test all five sucrose concentrations from 0.00 molar to 0.70 molar."
        },
        {
          target: "#results-table",
          cue: "Complete the WAEC Osmosis Table",
          say: "Select the final mass, percentage mass change, and cellular state in the table below."
        },
        {
          target: "#expected",
          action: "open:#expected",
          cue: "Isotonic Point at 0.30 M (%Δm = 0%)",
          say: "Look at Trial C: at 0 point 30 molar sucrose, final mass equals initial mass (2.50 grams) and percentage change is zero — that is the isotonic concentration of the yam cell sap!"
        }
      ]
    },
    {
      title: "Tonicity & Water Potential Math",
      steps: [
        {
          target: "#eq-shm",
          cue: "Percentage Mass Change: %Δm = ((m_f − m_i) ÷ m_i) × 100%",
          sparkle: true,
          say: "Here is the WAEC Paper 3 osmometry formula: subtract initial mass from final mass, divide by initial mass, and multiply by 100 percent!"
        },
        {
          target: ["#eq-omega", "#eq-vel"],
          cue: "Suction Pressure SP = OP − TP & Graham's Law",
          say: "And for plant water relations, suction pressure equals osmotic pressure minus turgor pressure — which drops to zero when a cell is fully turgid!"
        },
        {
          target: "#ph-explorer",
          action: "pin:0",
          cue: "Hypotonic Distilled Water (0.00 M)",
          say: "Tap Pin 1 on the Tonicity Explorer: in pure water, plant cells become fully turgid while red blood cells burst by haemolysis."
        },
        {
          target: "#ph-explorer",
          action: "pin:4",
          cue: "Hypertonic Brine (0.70 M)",
          say: "Tap Pin 5: in concentrated brine, plant cells plasmolyse and red blood cells crenate!"
        }
      ]
    },
    {
      title: "3D Lipid Bilayer Zoom",
      steps: [
        {
          target: { scene: "zoom", part: "vectors" },
          action: "zoom:mode:mix",
          cue: "Aquaporin Osmosis (High → Low Ψ_w, 0 ATP)",
          say: "Zoom into the selectively permeable phospholipid bilayer in 3D! Cyan water molecules stream through the aquaporin channel down their water-potential gradient without using any ATP."
        },
        {
          target: { scene: "zoom", part: "vectors" },
          action: "zoom:mode:acid",
          cue: "Active Transport Pump (Low → High, Uses ATP)",
          say: "Switch to Active Transport: watch the amber carrier pump hydrolyse golden ATP spheres to push mineral ions uphill against their concentration gradient!"
        }
      ]
    },
    {
      title: "Worked Examples & Bridge",
      steps: [
        {
          target: "#ex1",
          cue: "Example 1 · Yam Strip %Δm in Water vs 0.70 M",
          say: "Study Worked Example 1: every step of the percentage mass gain (+18%) and percentage mass loss (−18%) is expanded in LaTeX with an explainer note underneath."
        },
        {
          target: "#vinegar-test",
          action: "clock:1",
          cue: "Solve the Mile 12 & Hospital Mystery!",
          wait: "bridge",
          say: "Now click Steps 1, 2, and 3 in the Bridge solver to connect turgidity, salted-fish plasmolysis, and hospital isotonic saline!"
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
          say: "Test yourself on these twelve exam-style questions on diffusion, osmosis, plasmolysis, haemolysis, boiled yam controls, and active transport."
        },
        {
          target: "#reflect",
          cue: "Rate your confidence & Assignment",
          say: "Rate your confidence from 1 to 4, complete the Exit Ticket, and try the 30-mark assignment before moving to our final Practical Clinic in Lesson 5!"
        }
      ]
    }
  ]
};
