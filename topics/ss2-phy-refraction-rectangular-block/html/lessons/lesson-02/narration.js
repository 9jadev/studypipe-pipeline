/* Lesson 02 · Choreographed StudyNarrator Script — Path Through a Rectangular Glass Block, Lateral Displacement & Dispersion (en-NG) */
window.NARRATION = {
  rate: 0.96,
  pitch: 1.01,

  waits: {
    note: {
      event: "kit:note",
      prompt: "Type a prediction (or tap a seed question) and pin it to the Wonder Wall",
      react: function () {
        return "Pinned! Let's test how thickness and angle control lateral displacement on the 3D bench.";
      }
    },
    sort: {
      event: "l1:sort-checked",
      prompt: "Sort all 12 cards into Parallel-Sided Block Properties, Increases Lateral Shift, and Prism/Triangle Geometry",
      react: function (d) {
        if (!d) return "Good effort!";
        if (d.score === d.total) return "Twelve out of twelve! You can clearly distinguish parallel emergence, lateral shift factors, and prism dispersion.";
        if (d.score >= 9) return "Nice work! " + d.score + " out of " + d.total + ". Check the notes below for any card that slipped.";
        return "You got " + d.score + " out of " + d.total + ". Review the feedback below!";
      }
    },
    bench: {
      event: "l1:bench-done",
      prompt: "Record at least 4 angle trials (A–E) on the 3D Lateral Displacement bench",
      react: function () {
        return "Awesome! You have recorded refracted angle r, lateral displacement d, and far-face shift E F across the trials.";
      }
    },
    bridge: {
      event: "l1:vinegar-done",
      prompt: "Run Steps 1, 2 and 3 to calculate the 1.98 cm Surulere laser shift",
      react: function () {
        return "Bullseye! Using d equals t sine of i minus r over cos r gives the exact 1 point 9 8 centimetre sideways shift!";
      }
    },
    quiz: {
      event: "kit:quiz-done",
      prompt: "Answer all 12 WAEC/NECO/JAMB quiz questions",
      react: function (d) {
        if (!d) return "Quiz complete!";
        if (d.score >= 10) return "Outstanding — " + d.score + " out of " + d.total + "! You have mastered Lateral Displacement and Rectangular Block Geometry.";
        if (d.score >= 7) return "Well done! " + d.score + " out of " + d.total + ". Review the explanations on the ones you missed.";
        return "You scored " + d.score + " out of " + d.total + ". Replay the Make Sense and Dispersion Zoom chapters, then retry!";
      }
    }
  },

  actions: {
    "pin:0": function () { if (window.L01 && window.L01.showPin) window.L01.showPin(0); },
    "pin:2": function () { if (window.L01 && window.L01.showPin) window.L01.showPin(2); },
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
          cue: "Lesson 2 · Lateral Shift & Dispersion",
          sparkle: true,
          say: "Welcome to Lesson 2! Today we trace a light ray all the way through a parallel-sided rectangular glass block — proving why the emergent ray leaves parallel to the incident ray, deriving the lateral displacement formula, and comparing a rectangular block with a triangular prism."
        },
        {
          target: "#objectives",
          cue: "5 goals for Lesson 2",
          say: "By the end of this lesson you will prove e equals i with zero net angular deviation, apply d equals t sine of i minus r over cos r, calculate far-face shift E F equals t tan r, and explain why white light emerges without angular rainbow fan-out."
        }
      ]
    },
    {
      title: "Do Now",
      steps: [
        {
          target: "#donow-list",
          cue: "Retrieve Lesson 1",
          say: "Start with these four spaced-retrieval cards from Lesson 1 on wave speed in glass, the glancing-angle trap, the 90-degree reflected-refracted shortcut, and normal incidence."
        }
      ]
    },
    {
      title: "The Story",
      steps: [
        {
          target: "#story-stage",
          action: "story:0",
          cue: "The 1.98 cm Laser Offset",
          say: "Back at Doctor Kunle's clinic in Surulere, Zainab aims the alignment laser at 45 degrees through the 6-centimetre crown-glass block — and watches the emergent beam miss the bullseye by 1 point 9 8 centimetres while staying parallel!"
        },
        {
          target: { scene: "story", part: "cust2" },
          action: "story:1",
          cue: "Why no rainbow fan?",
          say: "Meanwhile, Kelechi wonders why shining a white torch through the rectangular block does not produce a diverging rainbow fan like a triangular prism."
        },
        {
          target: { scene: "story", part: "ngozi" },
          action: "story:2",
          cue: "Parallel Normals (r₁ = i₂)",
          say: "Doctor Kunle points out the geometric secret: because the opposite faces are parallel, their normals are parallel, so alternate interior angles r 1 and i 2 are equal and emergent angle e equals incident angle i!"
        },
        {
          target: { scene: "story", part: "clockB" },
          action: "story:3",
          cue: "Rect Block vs 60° Prism",
          say: "Compare Rig A and Rig B: the rectangular block cancels angular deviation at the second face, whereas the inclined faces of a triangular prism bend light towards the base twice!"
        }
      ]
    },
    {
      title: "Wonder Wall & Sort",
      steps: [
        {
          target: "#wall-wonder",
          cue: "Pin your prediction",
          say: "Pin your prediction on the Wonder Wall about how thickness and angle of incidence affect lateral displacement.",
          wait: "note"
        },
        {
          target: "#kitchen-sort",
          cue: "Sort all 12 cards",
          say: "Now sort these twelve cards into Parallel-Sided Block Properties, Factors that Increase Lateral Shift d, and Prism or Triangle Geometry.",
          wait: "sort"
        }
      ]
    },
    {
      title: "3D Lateral Shift Bench",
      steps: [
        {
          target: { scene: "bench", part: "bob" },
          cue: "Rectangular Glass Block (t = 6.0 cm)",
          say: "Look at the 3D rectangular glass block on the drawing sheet. The crimson segment shows perpendicular lateral displacement d, while the violet segment along the bottom edge shows far-face shift E F equals t tan r."
        },
        {
          target: "#bench-trials",
          cue: "Test Trials A to E",
          say: "Tap at least four angle trials from 15 degrees to 75 degrees and watch how both d and E F grow with angle of incidence!",
          wait: "bench"
        }
      ]
    },
    {
      title: "Make Sense",
      steps: [
        {
          target: "#eq-shm",
          cue: "Proof that e = i",
          sparkle: true,
          say: "Here is the two-line proof that WAEC and NECO examiners love: at the top face, sine i over sine r 1 equals n; at the parallel bottom face, sine e over sine r 1 also equals n. Therefore sine e equals sine i, so e equals i and net angular deviation is zero!"
        },
        {
          target: "#eq-omega",
          cue: "Lateral Displacement Formula",
          say: "And from the two right-angled triangles inside the block, hypotenuse O N equals t over cos r, and perpendicular shift d equals O N sine of i minus r — giving d equals t sine of i minus r over cos r!"
        }
      ]
    },
    {
      title: "3D Dispersion Zoom",
      steps: [
        {
          target: "#zoom-stage",
          cue: "Block vs Prism Dispersion",
          say: "Use the 3D Concept Zoom to switch between monochromatic parallel normals, white light in a rectangular block where red and violet emerge parallel, and white light in a 60-degree prism!"
        }
      ]
    },
    {
      title: "Examples, Bridge & Quiz",
      steps: [
        {
          target: "#vinegar-test",
          cue: "Calculate the 1.98 cm Shift",
          say: "Run Steps 1, 2, and 3 in the Bridge Challenge to calculate Zainab's exact 1 point 9 8 centimetre sideways laser shift!",
          wait: "bridge"
        },
        {
          target: "#quiz",
          cue: "12 WAEC & JAMB Questions",
          say: "Now complete the 12-question quiz to lock in your mastery of Lesson 2!",
          wait: "quiz"
        }
      ]
    }
  ]
};
