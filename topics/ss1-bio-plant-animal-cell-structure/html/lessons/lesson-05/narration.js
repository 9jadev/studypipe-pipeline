/* Lesson 05 · Choreographed StudyNarrator Script — WAEC Paper 3 Practical: Wet-Mount Microscopy, Cytological Staining & Biological Drawing Clinic (en-NG) */
window.NARRATION = {
  rate: 0.96,
  pitch: 1.01,

  waits: {
    note: {
      event: "kit:note",
      prompt: "Type a prediction (or tap a seed question) and pin it to the Wonder Wall",
      react: function () {
        return "Pinned! Now let's master wet-mount microscopy and WAEC Paper 3 biological drawings.";
      }
    },
    sort: {
      event: "l5:sort-checked",
      prompt: "Sort all 12 cards into Wet-Mount & Staining Protocol, WAEC Drawing Rules, and Disallowed Faults, then tap Check my sorting",
      react: function (d) {
        if (!d) return "Good effort!";
        if (d.score === d.total) return "Twelve out of twelve! You know every cytological stain, wet-mount step, and WAEC Paper 3 drawing rule.";
        if (d.score >= 9) return "Nice work! " + d.score + " out of " + d.total + ". Check the notes below for any card that slipped.";
        return "You got " + d.score + " out of " + d.total + ". Review the feedback below — avoiding shading and arrowheads saves easy marks in WAEC Paper 3!";
      }
    },
    bench: {
      event: "l5:bench-done",
      prompt: "Record at least 4 FOV calibrations (A–E) on the 3D wet-mount bench",
      react: function () {
        return "Excellent! You calibrated field-of-view diameter D across magnifications and confirmed that onion cell length A = D divided by N equals 75 micrometres!";
      }
    },
    bridge: {
      event: "l5:vinegar-done",
      prompt: "Run Steps 1, 2 and 3 to upgrade Tunde's biological drawing from 3/10 to 10/10",
      react: function () {
        return "Ten out of ten! Sharp HB continuous lines, double line for the plant wall, horizontal uncrossed guidelines without arrows, and ×1200 magnification below!";
      }
    },
    quiz: {
      event: "kit:quiz-done",
      prompt: "Answer all 12 WAEC/NECO/JAMB quiz questions",
      react: function (d) {
        if (!d) return "Quiz complete!";
        if (d.score >= 10) return "Outstanding — " + d.score + " out of " + d.total + "! You have completed all 5 lessons of Plant and Animal Cell Structure!";
        if (d.score >= 7) return "Well done! " + d.score + " out of " + d.total + ". Review the explanations on the ones you missed.";
        return "You scored " + d.score + " out of " + d.total + ". Replay the Make Sense and 3D Drawing Clinic chapters, then retry!";
      }
    }
  },

  actions: {
    "pin:0": function () { if (window.L05 && window.L05.showPin) window.L05.showPin(0); },
    "pin:2": function () { if (window.L05 && window.L05.showPin) window.L05.showPin(2); },
    "pin:3": function () { if (window.L05 && window.L05.showPin) window.L05.showPin(3); },
    "bench:wide":  function () { if (window.StudyScenes && window.StudyScenes.bench) window.StudyScenes.bench.setCond("wide"); },
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
          cue: "Lesson 5 · WAEC Paper 3 Microscopy & Drawing Clinic",
          sparkle: true,
          say: "Welcome to Lesson 5 — our final practical clinic! Today we master temporary wet-mount slide preparation, cytological staining with iodine and methylene blue, field-of-view cell sizing, and the exact WAEC Paper 3 biological drawing rubric!"
        },
        {
          target: ".l-hero .question",
          cue: "Our guiding question",
          say: "Here is our guiding puzzle: how do we mount an onion peel or cheek smear without trapping dark-rimmed air bubbles, estimate cell size in micrometres, and score 10 out of 10 on a WAEC biological drawing?"
        },
        {
          target: "#objectives",
          cue: "5 goals for Lesson 5",
          say: "By the end of this lesson you will prepare bubble-free wet mounts at a 45-degree angle, match stains to cell structures, apply D 2 equals D 1 times M 1 over M 2, follow all WAEC drawing rules, and contrast light and electron microscopes."
        }
      ]
    },
    {
      title: "Do Now",
      steps: [
        {
          target: "#donow-list",
          cue: "Retrieve Lessons 1–4",
          say: "Warm up with these four retrieval cards on total magnification, onion versus cheek boundaries, plasmolysis, and percentage mass change."
        }
      ]
    },
    {
      title: "The Story",
      steps: [
        {
          target: "#story-stage",
          action: "story:0",
          cue: "WAEC Paper 3 Prep at Mile 12",
          say: "Tunde is preparing for his WAEC Biology Paper 3 Practical, but his first onion slide had giant black rings and his drawing lost half its marks!"
        },
        {
          target: { scene: "story", part: "cust2" },
          action: "story:1",
          cue: "Shading & arrowheads?",
          say: "Alhaji Musa wonders if shading the nucleus and putting arrowheads on label lines makes a biology drawing look better."
        },
        {
          target: { scene: "story", part: "ngozi" },
          action: "story:2",
          cue: "No shading, no arrows, 45° coverslip!",
          say: "Mama Titi warns him: in WAEC Biology, artistic shading and arrowheads on label lines are penalised! And those black rings were air bubbles trapped by dropping the coverslip flat!"
        },
        {
          target: { scene: "story", part: "clockA" },
          action: "story:3",
          cue: "Iodine vs Methylene Blue",
          say: "Always lower the coverslip at a 45-degree angle using a mounting needle, stain onion cells with iodine solution, and stain cheek cells with methylene blue!"
        },
        {
          target: { scene: "story", part: "amaka" },
          action: "story:5",
          cue: "To the Yaba Practical Clinic!",
          say: "At the Yaba Lab, Doctor Kunle sets up our 3D Wet-Mount Bench and Field-of-View Calibrator."
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
          say: "Pin your question or prediction to the Wonder Wall before we sort the practical rules!"
        }
      ]
    },
    {
      title: "Staining & Drawing Sort",
      steps: [
        {
          target: "#kitchen-sort",
          cue: "Wet-Mount vs Drawing Rules vs Faults",
          wait: "sort",
          say: "Activity 1! Sort all twelve cards into Wet-Mount and Staining Protocol, Mandatory WAEC Drawing Rules, and Disallowed WAEC Faults, then tap Check my sorting."
        }
      ]
    },
    {
      title: "3D Wet-Mount Bench",
      steps: [
        {
          target: { scene: "bench", part: "clamp" },
          cue: "3D Glass Slide & 45° Coverslip",
          say: "On the left of our 3D bench is the glass microscope slide with its specimen, iodine dropper, and coverslip lowered gently at a 45-degree angle."
        },
        {
          target: { scene: "bench", part: "bob" },
          action: "bench:test:1",
          cue: "Field of View Calibration (×100 → 1800 µm)",
          say: "On the right is the calibrated field of view: at times 100 magnification, the diameter is 1800 micrometres and 24 onion cells fit across, giving an actual cell length A of 75 micrometres!"
        },
        {
          target: "#bench-stage",
          action: "bench:std",
          cue: "Your turn on the bench!",
          wait: "bench",
          say: "Now it's your turn! Tap Trials A to E to calibrate field-of-view diameter D and cell count N across at least four magnifications."
        },
        {
          target: "#results-table",
          cue: "Complete the FOV Table",
          say: "Select the matching field diameter D, cell count N, and calculated cell length A in the table below."
        }
      ]
    },
    {
      title: "FOV Math & Drawing Rules",
      steps: [
        {
          target: "#eq-shm",
          cue: "FOV Scaling: D₂ = D₁ × (M₁ ÷ M₂)",
          sparkle: true,
          say: "Look at the field-of-view equation: when magnification increases 4 times from times 100 to times 400, field diameter shrinks 4 times from 1800 micrometres to 450 micrometres!"
        },
        {
          target: ["#eq-omega", "#eq-vel"],
          cue: "Cell Length A = D_FOV ÷ N_cells & Drawing M = I ÷ A",
          say: "Dividing the 450-micrometre field diameter by 6 cells gives 75 micrometres per cell; and a 90-millimetre drawing of that cell has a magnification of times 1200!"
        },
        {
          target: "#ph-explorer",
          action: "pin:3",
          cue: "WAEC Paper 3 Drawing Rubric",
          say: "Tap Pin 4 on the Practical Explorer to review the five WAEC drawing mark categories: Clarity of Lines, Size, Neatness of Labels, Title, and Magnification."
        }
      ]
    },
    {
      title: "3D Drawing & EM Zoom",
      steps: [
        {
          target: { scene: "zoom", part: "vectors" },
          action: "zoom:mode:mix",
          cue: "Onion Cell (Double Line Wall)",
          say: "Inspect the iodine-stained onion cell in 3D: notice the double line representing the cellulose cell wall and the peripheral nucleus pushed aside by the large central vacuole."
        },
        {
          target: { scene: "zoom", part: "vectors" },
          action: "zoom:mode:acid",
          cue: "Cheek Cell (Single Line Membrane)",
          say: "Switch to the methylene-blue cheek cell: irregular outline drawn with a single continuous line and a central dark-blue nucleus."
        },
        {
          target: { scene: "zoom", part: "vectors" },
          action: "zoom:mode:base",
          cue: "TEM Ultrastructure (0.2 nm)",
          say: "Switch to the Transmission Electron Microscope view: at 0.2 nanometre resolution, cristae, grana, Rough ER, and Golgi cisternae come into sharp view!"
        }
      ]
    },
    {
      title: "Worked Examples & Bridge",
      steps: [
        {
          target: "#ex1",
          cue: "Example 1 · Full FOV & Drawing Magnification Chain",
          say: "Study Worked Example 1: every step from D 2 equals 450 micrometres to A equals 75 micrometres and M equals times 1200 is expanded in LaTeX with an explainer note underneath."
        },
        {
          target: "#vinegar-test",
          action: "clock:1",
          cue: "Upgrade Tunde's Drawing to 10/10!",
          wait: "bridge",
          say: "Now run Steps 1, 2, and 3 in the Drawing Clinic Bridge to fix Tunde's draft and score 10 out of 10!"
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
          say: "Test yourself on these final twelve exam-style questions on wet mounts, cytological stains, field-of-view calculations, WAEC drawing rules, and electron microscopy."
        },
        {
          target: "#reflect",
          cue: "Congratulations on completing all 5 lessons!",
          say: "Rate your confidence from 1 to 4, complete the Exit Ticket, and finish the 30-mark practical paper. Congratulations on mastering Plant and Animal Cell Structure!"
        }
      ]
    }
  ]
};
