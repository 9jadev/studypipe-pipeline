/* Lesson 04 · Choreographed StudyNarrator Script — Blood Vessels, Capillary Exchange, the Lymphatic System & Cardiovascular Disorders (en-NG) */
window.NARRATION = {
  rate: 0.96,
  pitch: 1.01,

  waits: {
    note: {
      event: "kit:note",
      prompt: "Type a prediction (or tap a seed question) and pin it to the Wonder Wall",
      react: function () {
        return "Pinned! Now let's test your ideas on arteries, veins, capillaries, and the lymphatic system.";
      }
    },
    sort: {
      event: "l1:sort-checked",
      prompt: "Sort all 12 cards into Arteries & Arterioles, Capillaries & Tissue Fluid, and Veins & Lymphatic System, then tap Check my sorting",
      react: function (d) {
        if (!d) return "Good effort!";
        if (d.score === d.total) return "Twelve out of twelve! You distinguished arteries, one-cell-thick capillaries, veins with pocket valves, and lymphatic vessels flawlessly.";
        if (d.score >= 9) return "Nice work! " + d.score + " out of " + d.total + ". Check the notes below for any card that slipped.";
        return "You got " + d.score + " out of " + d.total + ". Review the feedback below — WAEC loves testing why tissue fluid lacks red blood cells and large plasma proteins!";
      }
    },
    bench: {
      event: "l1:bench-done",
      prompt: "Record at least 4 capillary position trials (A–E) on the 3D Starling Filtration Bench",
      react: function () {
        return "Splendid! You plotted Net Filtration Pressure from plus 10 millimetres of mercury at the arterial end down to minus 10 millimetres of mercury at the venous end!";
      }
    },
    bridge: {
      event: "l1:vinegar-done",
      prompt: "Run Steps 1, 2 and 3 to balance daily capillary filtration and lymphatic return",
      react: function () {
        return "Fluid balance solved! Out of 20 litres filtered daily, 17 litres are reabsorbed into venules and 3 litres return via the lymphatic ducts to the subclavian veins!";
      }
    },
    quiz: {
      event: "kit:quiz-done",
      prompt: "Answer all 12 WAEC/NECO/JAMB quiz questions",
      react: function (d) {
        if (!d) return "Quiz complete!";
        if (d.score >= 10) return "Outstanding — " + d.score + " out of " + d.total + "! You have mastered blood vessels, Starling capillary exchange, and the lymphatic system.";
        if (d.score >= 7) return "Well done! " + d.score + " out of " + d.total + ". Review the explanations on the ones you missed.";
        return "You scored " + d.score + " out of " + d.total + ". Replay the Make Sense and 3D Vessel Zoom chapters, then retry!";
      }
    }
  },

  actions: {
    "pin:0": function () { if (window.L04 && window.L04.showPin) window.L04.showPin(0); },
    "pin:2": function () { if (window.L04 && window.L04.showPin) window.L04.showPin(2); },
    "pin:4": function () { if (window.L04 && window.L04.showPin) window.L04.showPin(4); },
    "bench:heavy": function () { if (window.StudyScenes && window.StudyScenes.bench) window.StudyScenes.bench.setCond("heavy"); },
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
          cue: "Lesson 4 · Blood Vessels, Capillary Exchange & Lymphatic System",
          sparkle: true,
          say: "Welcome to Lesson 4! Today we compare arteries, veins, and capillaries, calculate Starling ultrafiltration and reabsorption across capillary beds, trace tissue fluid and lymph back to the subclavian veins, and explain oedema and cardiovascular disorders."
        },
        {
          target: ".l-hero .question",
          cue: "Our guiding question",
          say: "Here is our guiding puzzle: how does blood climb a full metre uphill from your ankles at near-zero pressure, and how does plasma leave capillaries to feed your cells without losing red blood cells?"
        },
        {
          target: "#objectives",
          cue: "5 goals for Lesson 4",
          say: "By the end of this lesson you will construct WAEC comparison tables for arteries, veins, and capillaries, explain why blood slows down in capillary beds, calculate Starling net filtration pressure, contrast blood, tissue fluid, and lymph, and explain elephantiasis, kwashiorkor oedema, atherosclerosis, and stroke."
        }
      ]
    },
    {
      title: "Do Now",
      steps: [
        {
          target: "#donow-list",
          cue: "Retrieve Lessons 2 & 3",
          say: "Start with these four spaced-retrieval Do Now cards on Lub-Dub valve closures, the SAN and AVN delay, pulse pressure, and coronary arteries."
        }
      ]
    },
    {
      title: "The Story",
      steps: [
        {
          target: "#story-stage",
          action: "story:0",
          cue: "LUTH Vascular Clinic, Idi-Araba",
          say: "At the LUTH Vascular Clinic, Tunde wonders how blood in his ankle veins at less than 10 millimetres of mercury climbs a full metre uphill back to his right atrium."
        },
        {
          target: { scene: "story", part: "ngozi" },
          action: "story:2",
          cue: "Skeletal Muscle Pump & Pocket Valves",
          say: "Nurse Chidinma explains the two-part mechanism: contracting calf muscles squeeze thin-walled veins to push blood upward, and internal pocket semilunar valves snap shut to prevent any backflow!"
        },
        {
          target: { scene: "story", part: "clockB" },
          action: "story:3",
          cue: "Ultrafiltration (+10 mmHg) vs Reabsorption (−10 mmHg)",
          say: "And in the capillary bed, hydrostatic pressure of 35 beats osmotic pressure of 25 at the arterial end to force tissue fluid out, while 15 minus 25 at the venous end reabsorbs 85 percent and green lymphatics drain the remaining 15 percent!"
        },
        {
          target: { scene: "story", part: "amaka" },
          action: "story:5",
          cue: "To the 3D Capillary Bench!",
          say: "Doctor Bamidele invites us to measure Starling filtration pressure from 0 to 100 percent along the 3D Capillary Bench."
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
          say: "Pin your prediction on why red blood cells and albumin are absent from normal tissue fluid!"
        }
      ]
    },
    {
      title: "Vessels & Lymph Sort",
      steps: [
        {
          target: "#kitchen-sort",
          cue: "Arteries vs Capillaries vs Veins & Lymph",
          wait: "sort",
          say: "Activity 1! Sort all twelve cards into Arteries and Arterioles, Capillaries and Tissue Fluid, and Veins and Lymphatic System, then tap Check my sorting."
        }
      ]
    },
    {
      title: "3D Starling Capillary Bench",
      steps: [
        {
          target: "#safety-box",
          cue: "Continuity Law (A₁v₁ = A₂v₂)",
          say: "Now step up to the 3D Starling Capillary and Vessel Bench! Remember why blood slows down from 35 centimetres per second in the aorta to 0 point 03 centimetres per second in capillaries: the total cross-sectional area of billions of capillaries is 1,000 times larger!"
        },
        {
          target: { scene: "bench", part: "clamp" },
          cue: "3D Capillary Bed & Blind-Ended Lymph Vessel",
          say: "On the left is our 3D capillary network showing the red arterial end, blue venous end, surrounding tissue cells, and green lymphatic vessel."
        },
        {
          target: { scene: "bench", part: "bob" },
          action: "bench:test:0",
          cue: "Trial A · Arterial End (0% → NFP = +10.0 mmHg)",
          say: "Watch Trial A at the arterial end: hydrostatic pressure is 35 millimetres of mercury and colloid osmotic pressure is 25, giving a net outward filtration pressure of plus 10 millimetres of mercury!"
        },
        {
          target: "#bench-stage",
          action: "bench:std",
          cue: "Your turn on the Capillary Bench!",
          wait: "bench",
          say: "Now it's your turn! Tap Trials A to E to record at least four positions along the capillary bed."
        },
        {
          target: "#results-table",
          cue: "Complete the WAEC table",
          say: "Select the matching hydrostatic pressure P c, colloid osmotic pressure pi c, and net filtration pressure NFP in the table below."
        }
      ]
    },
    {
      title: "Vessels, Tissue Fluid & Lymph",
      steps: [
        {
          target: "#eq-shm",
          cue: "Starling Equation: NFP = P_c − π_c",
          sparkle: true,
          say: "Let's lock in the equations of Lesson 4: first, Starling Net Filtration Pressure equals capillary hydrostatic pressure P c minus plasma protein osmotic pressure pi c."
        },
        {
          target: ["#eq-omega", "#eq-vel"],
          cue: "Continuity v = Q ÷ A & Daily Lymph Drainage",
          say: "Second, flow velocity v equals flow rate Q divided by total cross-sectional area A, and daily lymphatic drainage equals 15 percent of total capillary filtration."
        },
        {
          target: "#ph-explorer",
          action: "pin:2",
          cue: "Arterial End (+10 mmHg Ultrafiltration)",
          say: "Tap along the Vascular Tree Explorer: at Pin 3, ultrafiltration forces water, glucose, amino acids, and oxygen out into tissue spaces while leaving red blood cells, platelets, and albumin inside the capillary."
        },
        {
          target: "#ph-explorer",
          action: "pin:4",
          cue: "Veins, Pocket Valves & Subclavian Lymph Return",
          say: "And at Pin 5, lymph passes through lymph nodes and returns to the venous system at the left and right subclavian veins!"
        }
      ]
    },
    {
      title: "3D Vessel & Capillary Zoom",
      steps: [
        {
          target: { scene: "zoom", part: "vectors" },
          action: "zoom:mode:acid",
          cue: "Artery (Thick Media) vs Vein (Wide Lumen + Valve) vs Capillary",
          say: "Inspect the three blood vessels in 3D: notice the thick elastic and muscular tunica media of the artery, the wide lumen and semilunar pocket valve of the vein, and the single-cell endothelial wall of the capillary."
        },
        {
          target: { scene: "zoom", part: "vectors" },
          action: "zoom:mode:base",
          cue: "Capillary Ultrafiltration & Lymphatic Return",
          say: "Now switch to the 3D Capillary and Lymphatic Bed: watch golden solute droplets filter out at the arterial end, reabsorb at the venous end, and drain into the green lymphatic capillary!"
        }
      ]
    },
    {
      title: "Worked Examples & Bridge",
      steps: [
        {
          target: "#ex1",
          cue: "Example 1 · Starling NFP Calculation",
          say: "Study Worked Example 1: every step is expanded in LaTeX with a plain-English explainer note underneath."
        },
        {
          target: "#vinegar-test",
          action: "clock:1",
          cue: "Balance Daily Tissue Fluid & Lymph!",
          wait: "bridge",
          say: "Now run Steps 1, 2, and 3 to calculate arterial ultrafiltration, 85 percent venous reabsorption, and the 3 litres per day lymphatic return!"
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
          say: "Test yourself on these twelve exam-style questions on arteries, veins, capillaries, tissue fluid, lymph, elephantiasis, and kwashiorkor."
        },
        {
          target: "#reflect",
          cue: "Rate your confidence & Assignment",
          say: "Finally, rate your confidence from 1 to 4, complete the Exit Ticket, and try the 30-mark assignment before moving to Lesson 5!"
        }
      ]
    }
  ]
};
