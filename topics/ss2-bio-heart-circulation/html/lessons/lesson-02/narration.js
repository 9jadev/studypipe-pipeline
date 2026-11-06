/* Lesson 02 · Choreographed StudyNarrator Script — Structure of the Mammalian Heart & The Double-Circulation Pathway (en-NG) */
window.NARRATION = {
  rate: 0.96,
  pitch: 1.01,

  waits: {
    note: {
      event: "kit:note",
      prompt: "Type a prediction (or tap a seed question) and pin it to the Wonder Wall",
      react: function () {
        return "Pinned! Now let's test your knowledge of the four chambers, great vessels, and valves.";
      }
    },
    sort: {
      event: "l1:sort-checked",
      prompt: "Sort all 12 cards into Right/Pulmonary, Left/Systemic, and Valves & Septum, then tap Check my sorting",
      react: function (d) {
        if (!d) return "Good effort!";
        if (d.score === d.total) return "Twelve out of twelve! You sorted every chamber, vessel, and valve in the mammalian heart without a single slip.";
        if (d.score >= 9) return "Nice work! " + d.score + " out of " + d.total + ". Check the notes below for any card that slipped.";
        return "You got " + d.score + " out of " + d.total + ". Review the feedback below — remember that the pulmonary artery carries deoxygenated blood while the pulmonary vein carries oxygenated blood!";
      }
    },
    bench: {
      event: "l1:bench-done",
      prompt: "Record at least 4 chamber wall trials (A–E) on the 3D Heart Dissector bench",
      react: function () {
        return "Splendid! You measured myocardial wall thickness from 1 point 5 millimetres in the right atrium up to 15 millimetres in the left ventricle!";
      }
    },
    bridge: {
      event: "l1:vinegar-done",
      prompt: "Run Steps 1, 2 and 3 to complete Tunde's LUTH echocardiogram analysis",
      react: function () {
        return "Echocardiogram solved! A 3-to-1 wall thickness ratio, 70 millilitres stroke volume, and 58 point 3 percent ejection fraction!";
      }
    },
    quiz: {
      event: "kit:quiz-done",
      prompt: "Answer all 12 WAEC/NECO/JAMB quiz questions",
      react: function (d) {
        if (!d) return "Quiz complete!";
        if (d.score >= 10) return "Outstanding — " + d.score + " out of " + d.total + "! You know the mammalian heart chambers, valves, and circulation pathway inside out.";
        if (d.score >= 7) return "Well done! " + d.score + " out of " + d.total + ". Review the explanations on the ones you missed.";
        return "You scored " + d.score + " out of " + d.total + ". Replay the Make Sense and 3D Valve Zoom chapters, then retry!";
      }
    }
  },

  actions: {
    "pin:0": function () { if (window.L02 && window.L02.showPin) window.L02.showPin(0); },
    "pin:1": function () { if (window.L02 && window.L02.showPin) window.L02.showPin(1); },
    "pin:3": function () { if (window.L02 && window.L02.showPin) window.L02.showPin(3); },
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
          cue: "Lesson 2 · Structure of the Mammalian Heart & Double-Circulation Pathway",
          sparkle: true,
          say: "Welcome to Lesson 2! Today we dissect the four-chamber mammalian heart, explain the 3-to-1 left-to-right ventricular wall ratio, inspect all four one-way valves and chordae tendineae, and trace a red blood cell through every chamber and great vessel."
        },
        {
          target: ".l-hero .question",
          cue: "Our guiding question",
          say: "Here is our guiding puzzle: why is your left ventricular wall three times thicker than your right ventricular wall even though both pump the exact same 70 millilitres per beat?"
        },
        {
          target: "#objectives",
          cue: "5 goals for Lesson 2",
          say: "By the end of this lesson you will describe the pericardium and septum, compare wall thicknesses across all four chambers, explain the tricuspid, bicuspid, and semilunar valves, trace the complete double-circulation pathway including coronary and hepatic portal vessels, and calculate stroke volume, ejection fraction, and drawing magnification."
        }
      ]
    },
    {
      title: "Do Now",
      steps: [
        {
          target: "#donow-list",
          cue: "Retrieve Lesson 1 concepts",
          say: "Start with these four spaced-retrieval Do Now cards from Lesson 1 on SA over V ratios, cockroach haemolymph, fish gill pressure drop, and cardiac output."
        }
      ]
    },
    {
      title: "The Story",
      steps: [
        {
          target: "#story-stage",
          action: "story:0",
          cue: "LUTH Cardiac Echo Desk, Idi-Araba",
          say: "At the LUTH Sports Medicine Clinic in Idi-Araba, Tunde inspects his echocardiogram printout: his left ventricular wall is 15 millimetres thick while his right ventricular wall is 5 millimetres thick."
        },
        {
          target: { scene: "story", part: "ngozi" },
          action: "story:2",
          cue: "Same 70 mL Volume, Different Pressure!",
          say: "Nurse Chidinma busts a famous WAEC myth: both ventricles eject the exact same 70 millilitres stroke volume! The left wall is three times thicker because it must generate 120 millimetres of mercury to reach the brain and toes."
        },
        {
          target: { scene: "story", part: "clockB" },
          action: "story:3",
          cue: "Chordae Tendineae & Papillary Muscles",
          say: "Look at the valve model: inelastic collagen cords called chordae tendineae anchor the tricuspid and bicuspid valve flaps to papillary muscles so they cannot flip inside out during systole."
        },
        {
          target: { scene: "story", part: "amaka" },
          action: "story:5",
          cue: "To the 3D Heart Dissector!",
          say: "Doctor Bamidele invites us to the 3D Heart Dissector Bench to measure wall thickness and peak systolic pressure across all four chambers."
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
          say: "Pin your prediction on why the pulmonary artery carries deoxygenated blood or how chordae tendineae work!"
        }
      ]
    },
    {
      title: "Heart Structure Sort",
      steps: [
        {
          target: "#kitchen-sort",
          cue: "Right/Pulmonary vs Left/Systemic vs Valves",
          wait: "sort",
          say: "Activity 1! Sort all twelve cards into Right Side Pulmonary, Left Side Systemic, and Valves and Septum, then tap Check my sorting."
        }
      ]
    },
    {
      title: "3D Heart Dissector Bench",
      steps: [
        {
          target: "#safety-box",
          cue: "Anatomical Right vs Left Rule",
          say: "Now step up to the 3D Heart Dissector Bench! Remember the WAEC Paper 3 rule: when you look at the front of a heart, the anatomical right side is on your left, and the thicker left ventricle forms the apex on your right!"
        },
        {
          target: { scene: "bench", part: "clamp" },
          cue: "3D Cut-Away 4-Chamber Heart",
          say: "On the left is our cut-away mammalian heart showing the right atrium, tricuspid valve, right ventricle, interventricular septum, left atrium, bicuspid valve, and thick left ventricle."
        },
        {
          target: { scene: "bench", part: "bob" },
          action: "bench:test:2",
          cue: "Trial C · Right Ventricle (w = 5.0 mm)",
          say: "Watch Trial C: the right ventricle wall is 5 millimetres thick, generating 40 millimetres of mercury on our wall-thickness bench."
        },
        {
          target: "#bench-stage",
          action: "bench:std",
          cue: "Your turn on the Heart Dissector!",
          wait: "bench",
          say: "Now it's your turn! Tap Trials A to E to measure at least four chamber wall thicknesses."
        },
        {
          target: "#results-table",
          cue: "Complete the WAEC table",
          say: "Select the matching chamber name, peak pressure, and wall-thickness ratio in the table below."
        }
      ]
    },
    {
      title: "4 Chambers, 4 Valves & Pathway",
      steps: [
        {
          target: "#eq-shm",
          cue: "3:1 Ventricular Wall Ratio",
          sparkle: true,
          say: "Let's lock in the key quantitative relationships of Lesson 2: first, the left-to-right ventricular wall ratio is 15 millimetres divided by 5 millimetres, which equals 3 to 1."
        },
        {
          target: ["#eq-omega", "#eq-vel"],
          cue: "Stroke Volume SV = EDV − ESV & EF%",
          say: "Second, stroke volume equals end-diastolic volume minus end-systolic volume, and ejection fraction is stroke volume divided by end-diastolic volume times 100 percent."
        },
        {
          target: "#ph-explorer",
          action: "pin:1",
          cue: "Pulmonary Artery Exception",
          say: "Tap along the Double-Circulation Pathway Explorer: the pulmonary artery leaves the right ventricle carrying deoxygenated blood to the lungs."
        },
        {
          target: "#ph-explorer",
          action: "pin:4",
          cue: "Coronary Arteries & Hepatic Portal Vein",
          say: "And at Pin 5, coronary arteries branch off the base of the aorta to feed cardiac muscle, while the hepatic portal vein carries nutrient-rich blood from the ileum directly to the liver!"
        }
      ]
    },
    {
      title: "3D Valve & Chordae Zoom",
      steps: [
        {
          target: { scene: "zoom", part: "vectors" },
          action: "zoom:mode:acid",
          cue: "Diastole · AV Valve Open, Chordae Slack",
          say: "Zoom inside the atrioventricular valve in 3D! During diastole, blood pushes the cusps open downward into the ventricle while the chordae tendineae are slack."
        },
        {
          target: { scene: "zoom", part: "vectors" },
          action: "zoom:mode:base",
          cue: "Systole · AV Valve Locked, Chordae Taut",
          say: "Now switch to Ventricular Systole: rising ventricular pressure snaps the cusps shut while papillary muscles pull the chordae tendineae taut so the valve cannot turn inside out!"
        }
      ]
    },
    {
      title: "Worked Examples & Bridge",
      steps: [
        {
          target: "#ex1",
          cue: "Example 1 · SV & Ejection Fraction",
          say: "Study Worked Example 1: every step is expanded in LaTeX with a plain-English explainer note underneath."
        },
        {
          target: "#vinegar-test",
          action: "clock:1",
          cue: "Complete Tunde's Echocardiogram!",
          wait: "bridge",
          say: "Now run Steps 1, 2, and 3 to verify Tunde's 3-to-1 wall ratio, 70 millilitres stroke volume, and 58 point 3 percent ejection fraction!"
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
          say: "Test yourself on these twelve exam-style questions on the pericardium, chamber walls, valves, chordae tendineae, and circulation pathway."
        },
        {
          target: "#reflect",
          cue: "Rate your confidence & Assignment",
          say: "Finally, rate your confidence from 1 to 4, complete the Exit Ticket, and try the 30-mark assignment before moving to Lesson 3!"
        }
      ]
    }
  ]
};
