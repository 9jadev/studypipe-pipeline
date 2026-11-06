/* Lesson 05 · Choreographed StudyNarrator Script — Composition of Blood, Clotting Cascade, ABO/Rhesus Groups & WAEC Paper 3 Heart Practical (en-NG) */
window.NARRATION = {
  rate: 0.96,
  pitch: 1.01,

  waits: {
    note: {
      event: "kit:note",
      prompt: "Type a prediction (or tap a seed question) and pin it to the Wonder Wall",
      react: function () {
        return "Pinned! Now let's test your ideas on blood cells, clotting, ABO cross-matching, and WAEC Paper 3 heart drawings.";
      }
    },
    sort: {
      event: "l1:sort-checked",
      prompt: "Sort all 12 cards into Plasma/RBCs/WBCs, Platelets & Clotting Cascade, and ABO/Rhesus & WAEC Paper 3, then tap Check my sorting",
      react: function (d) {
        if (!d) return "Good effort!";
        if (d.score === d.total) return "Twelve out of twelve! You classified blood components, the 4-step clotting cascade, ABO/Rhesus genetics, and WAEC Paper 3 rules perfectly.";
        if (d.score >= 9) return "Nice work! " + d.score + " out of " + d.total + ". Check the notes below for any card that slipped.";
        return "You got " + d.score + " out of " + d.total + ". Review the feedback below — WAEC loves testing thromboplastin, calcium ions, and universal donor O negative!";
      }
    },
    bench: {
      event: "l1:bench-done",
      prompt: "Record at least 4 haemoglobin & Paper 3 trials (A–E) on the 3D Haematology & Dissection Bench",
      react: function () {
        return "Splendid! You plotted oxygen-carrying capacity from 8 to 18 grams per 100 millilitres and verified Paper 3 drawing magnification!";
      }
    },
    bridge: {
      event: "l1:vinegar-done",
      prompt: "Run Steps 1, 2 and 3 to complete the LUTH Haematology & WAEC Paper 3 Unit Finale",
      react: function () {
        return "Congratulations! You have solved the entire five-lesson Human Heart and Blood Circulation unit!";
      }
    },
    quiz: {
      event: "kit:quiz-done",
      prompt: "Answer all 12 WAEC/NECO/JAMB quiz questions",
      react: function (d) {
        if (!d) return "Quiz complete!";
        if (d.score >= 10) return "Outstanding — " + d.score + " out of " + d.total + "! You are ready for WAEC Paper 1, Paper 2, Paper 3, NECO, and JAMB!";
        if (d.score >= 7) return "Well done! " + d.score + " out of " + d.total + ". Review the explanations on the ones you missed.";
        return "You scored " + d.score + " out of " + d.total + ". Replay the Make Sense and 3D Blood Smear Zoom chapters, then retry!";
      }
    }
  },

  actions: {
    "pin:0": function () { if (window.L05 && window.L05.showPin) window.L05.showPin(0); },
    "pin:2": function () { if (window.L05 && window.L05.showPin) window.L05.showPin(2); },
    "pin:4": function () { if (window.L05 && window.L05.showPin) window.L05.showPin(4); },
    "bench:heavy": function () { if (window.StudyScenes && window.StudyScenes.bench) window.StudyScenes.bench.setCond("heavy"); },
    "bench:std":   function () { if (window.StudyScenes && window.StudyScenes.bench) window.StudyScenes.bench.setCond("std"); },
    "clock:1": function () { if (window.L05 && window.L05.vt) window.L05.vt.step1(); },
    "clock:2": function () { if (window.L05 && window.L05.vt) window.L05.vt.step2(); }
  },

  script: [
    {
      title: "Welcome",
      steps: [
        {
          target: ".l-hero .display",
          cue: "Lesson 5 · Blood Cells, Clotting, ABO Groups & Paper 3 Practical",
          sparkle: true,
          say: "Welcome to Lesson 5, the grand finale of our unit! Today we investigate the composition and eight functions of mammalian blood, the four-step enzymatic clotting cascade, ABO and Rhesus blood groups, and how to score full marks on a WAEC Paper 3 mammalian heart dissection and drawing."
        },
        {
          target: ".l-hero .question",
          cue: "Our guiding question",
          say: "Here is our guiding puzzle: why do mature mammalian red blood cells have no nucleus, how does liquid fibrinogen turn into a solid fibrin seal over a wound, and how do we safely cross-match blood and draw a dissected heart at 1.5 times magnification?"
        },
        {
          target: "#objectives",
          cue: "5 goals for Lesson 5",
          say: "By the end of this lesson you will compare plasma, serum, erythrocytes, phagocytes, lymphocytes, and platelets, write the four-step clotting cascade, construct the ABO and Rhesus compatibility table, solve sickle-cell genetic crosses, and apply all nine WAEC Paper 3 biological drawing rules."
        }
      ]
    },
    {
      title: "Do Now",
      steps: [
        {
          target: "#donow-list",
          cue: "Cumulative Retrieval (Lessons 1–4)",
          say: "Start with these four cumulative Do Now flashcards reviewing surface-area-to-volume ratio, the four heart valves, cardiac output, and Starling capillary ultrafiltration."
        }
      ]
    },
    {
      title: "The Story",
      steps: [
        {
          target: "#story-stage",
          action: "story:0",
          cue: "LUTH Haematology Lab & Blood Bank",
          say: "At the LUTH Haematology Lab, Nurse Chidinma shows Tunde and Amaka a centrifuged tube of blood: 55 percent straw-coloured plasma above and 45 percent blood cells below."
        },
        {
          target: { scene: "story", part: "ngozi" },
          action: "story:2",
          cue: "4-Step Blood Clotting Cascade",
          say: "Amaka traces how ruptured platelets release thromboplastin, which uses calcium ions and Vitamin K to turn prothrombin into thrombin, spinning soluble fibrinogen into an insoluble fibrin mesh!"
        },
        {
          target: { scene: "story", part: "clockB" },
          action: "story:4",
          cue: "WAEC Paper 3 Heart Dissection (×1.5)",
          say: "Then in the Paper 3 practical lab, they orient a dissected 80-millimetre goat heart by the diagonal coronary groove, pinch the three-times-thicker left ventricle, and draw it at 120 millimetres for 1.5 times magnification!"
        },
        {
          target: { scene: "story", part: "amaka" },
          action: "story:5",
          cue: "To the 3D Haematology & Paper 3 Bench!",
          say: "Doctor Bamidele invites us to test haemoglobin oxygen capacity and Paper 3 magnification on our 3D bench."
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
          say: "Pin your prediction on why mature mammalian red blood cells lack a nucleus and why Blood Group O negative is the universal donor!"
        }
      ]
    },
    {
      title: "Haematology & Paper 3 Sort",
      steps: [
        {
          target: "#kitchen-sort",
          cue: "Blood Cells vs Clotting vs ABO & Paper 3",
          wait: "sort",
          say: "Activity 1! Sort all twelve cards into Plasma, RBCs and WBCs, Platelets and Clotting Cascade, and ABO/Rhesus and WAEC Paper 3, then tap Check my sorting."
        }
      ]
    },
    {
      title: "3D Haematology & Paper 3 Bench",
      steps: [
        {
          target: "#safety-box",
          cue: "Haemoglobin O₂ Capacity & Paper 3 Magnification",
          say: "Step up to the 3D Haematology and Paper 3 Bench! Each gram of haemoglobin binds 1.34 millilitres of oxygen, and biological drawing magnification M equals drawing length divided by actual specimen length."
        },
        {
          target: { scene: "bench", part: "clamp" },
          cue: "3D Stained Blood Smear & Fibrin Mesh",
          say: "On the left is our 3D blood smear showing biconcave erythrocytes, lobed phagocytes, round-nucleus lymphocytes, and golden platelets."
        },
        {
          target: { scene: "bench", part: "bob" },
          action: "bench:test:3",
          cue: "Trial D · [Hb] = 15.0 g/100 mL → 20.1 mL O₂/dL & ×1.5",
          say: "Watch Trial D at a healthy haemoglobin concentration of 15 grams per 100 millilitres: oxygen capacity is 20 point 1 millilitres per 100 millilitres, or 1,005 millilitres in 5 litres of blood, and a 120-millimetre drawing of an 80-millimetre heart gives 1.5 times magnification!"
        },
        {
          target: "#bench-stage",
          action: "bench:std",
          cue: "Your turn on the Haematology Bench!",
          wait: "bench",
          say: "Now it's your turn! Tap Trials A to E to record at least four haemoglobin and Paper 3 magnification readings."
        },
        {
          target: "#results-table",
          cue: "Complete the WAEC table",
          say: "Select the matching oxygen capacity C O2, total oxygen in 5 litres, and Paper 3 magnification M in the table below."
        }
      ]
    },
    {
      title: "Blood, Clotting, ABO & Paper 3",
      steps: [
        {
          target: "#eq-shm",
          cue: "O₂ Capacity: C_O₂ = 1.34 × [Hb]",
          sparkle: true,
          say: "Let's lock in the equations of Lesson 5: first, arterial oxygen capacity equals 1.34 times haemoglobin concentration, and Serum equals Blood Plasma minus Fibrinogen."
        },
        {
          target: ["#eq-omega", "#eq-vel"],
          cue: "4-Step Clotting Cascade & Paper 3 Magnification M = I ÷ O",
          say: "Second, thromboplastin and calcium ions convert prothrombin to thrombin, which turns soluble fibrinogen into insoluble fibrin; and Paper 3 magnification M equals Drawing Length divided by Actual Specimen Length."
        },
        {
          target: "#ph-explorer",
          action: "pin:2",
          cue: "Pin 3 · 4-Step Blood Clotting Cascade",
          say: "Tap along the Explorer: at Pin 3, trace how Vitamin K in the liver, calcium ions in plasma, thromboplastin, thrombin, and fibrin work together to seal a cut."
        },
        {
          target: "#ph-explorer",
          action: "pin:4",
          cue: "Pin 5 · WAEC Paper 3 Heart Dissection & 9 Drawing Rules",
          say: "And at Pin 5, review the nine mandatory WAEC Chief Examiner rules: sharp HB pencil, 8 to 12 centimetres long, zero shading, horizontal uncrossed ruled label lines, title with view below, and magnification!"
        }
      ]
    },
    {
      title: "3D Blood Smear & Paper 3 Zoom",
      steps: [
        {
          target: { scene: "zoom", part: "vectors" },
          action: "zoom:mode:acid",
          cue: "Biconcave RBCs, Lobed Phagocytes & Lymphocytes",
          say: "Inspect the 3D blood smear up close: notice the enucleated biconcave red blood cells, the multi-lobed nucleus of the phagocyte, and the large round nucleus of the lymphocyte."
        },
        {
          target: { scene: "zoom", part: "vectors" },
          action: "zoom:mode:base",
          cue: "WAEC Paper 3 Dissected Mammalian Heart",
          say: "Now switch to the WAEC Paper 3 Dissected Heart: compare the three-times-thicker left ventricular wall against the thinner right ventricular wall!"
        }
      ]
    },
    {
      title: "Worked Examples & Finale Bridge",
      steps: [
        {
          target: "#ex1",
          cue: "Example 1 · Haemoglobin O₂ Capacity in 5 L of Blood",
          say: "Study Worked Examples 1, 2, and 3: every calculation is expanded step by step in LaTeX with a plain-English explainer note underneath."
        },
        {
          target: "#vinegar-test",
          action: "clock:1",
          cue: "Solve the Unit Mystery Finale!",
          wait: "bridge",
          say: "Now run Steps 1, 2, and 3 to complete the LUTH Haematology and WAEC Paper 3 Unit Finale!"
        }
      ]
    },
    {
      title: "Quiz & Reflect",
      steps: [
        {
          target: "#quiz",
          cue: "12 WAEC, NECO & JAMB Questions",
          wait: "quiz",
          say: "Test yourself on these twelve exam-style questions covering blood cells, clotting, ABO and Rhesus groups, sickle-cell genetics, and WAEC Paper 3 practical skills."
        },
        {
          target: "#reflect",
          cue: "Rate your confidence & Complete the Unit!",
          say: "Finally, rate your confidence from 1 to 4, complete the Exit Ticket, and try the 30-mark assignment. Congratulations on mastering the Human Heart and Blood Circulation!"
        }
      ]
    }
  ]
};
