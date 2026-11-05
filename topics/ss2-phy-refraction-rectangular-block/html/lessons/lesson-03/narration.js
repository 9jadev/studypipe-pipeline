/* Lesson 03 · Choreographed StudyNarrator Script — Real & Apparent Depth, Multi-Layer Slabs & The No-Parallax Method (en-NG) */
window.NARRATION = {
  rate: 0.96,
  pitch: 1.01,

  waits: {
    note: {
      event: "kit:note",
      prompt: "Type a prediction (or tap a seed question) and pin it to the Wonder Wall",
      react: function () {
        return "Pinned! Now let's test Real and Apparent Depth on our 3D No-Parallax bench.";
      }
    },
    sort: {
      event: "l1:sort-checked",
      prompt: "Sort all 12 cards into Real & Apparent Depth, Upward Vertical Shift, and No-Parallax Mechanism",
      react: function (d) {
        if (!d) return "Good effort!";
        if (d.score === d.total) return "Twelve out of twelve! You can clearly distinguish Apparent Depth A from Upward Shift d v.";
        if (d.score >= 9) return "Nice work! " + d.score + " out of " + d.total + ". Check the notes below for any card that slipped.";
        return "You got " + d.score + " out of " + d.total + ". Review the feedback below!";
      }
    },
    bench: {
      event: "l1:bench-done",
      prompt: "Record at least 4 thickness trials (A–E) on the 3D No-Parallax bench",
      react: function () {
        return "Spot on! Across all five thicknesses from 3 to 15 centimetres, Real Depth R divided by Apparent Depth A equals 1 point 5 0!";
      }
    },
    bridge: {
      event: "l1:vinegar-done",
      prompt: "Run Steps 1, 2 and 3 to bust the 'appears raised by' exam trap",
      react: function () {
        return "Trap busted! 'Appears raised by 2 centimetres' is upward shift d v, so Apparent Depth A is 6 minus 2 equal to 4 centimetres and n equals 1 point 5 0!";
      }
    },
    quiz: {
      event: "kit:quiz-done",
      prompt: "Answer all 12 WAEC/NECO/JAMB quiz questions",
      react: function (d) {
        if (!d) return "Quiz complete!";
        if (d.score >= 10) return "Outstanding — " + d.score + " out of " + d.total + "! You have mastered Real Depth, Apparent Depth, and No-Parallax.";
        if (d.score >= 7) return "Well done! " + d.score + " out of " + d.total + ". Review the explanations on the ones you missed.";
        return "You scored " + d.score + " out of " + d.total + ". Replay the Make Sense and Ray Cone Zoom chapters, then retry!";
      }
    }
  },

  actions: {
    "pin:0": function () { if (window.L01 && window.L01.showPin) window.L01.showPin(0); },
    "pin:1": function () { if (window.L01 && window.L01.showPin) window.L01.showPin(1); },
    "pin:3": function () { if (window.L01 && window.L01.showPin) window.L01.showPin(3); },
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
          cue: "Lesson 3 · Real & Apparent Depth",
          sparkle: true,
          say: "Welcome to Lesson 3! Today we investigate why objects beneath a glass block or swimming pool appear shallower than they really are, how to add multi-layer apparent depths, and how to locate virtual images using the no-parallax method."
        },
        {
          target: "#objectives",
          cue: "5 goals for Lesson 3",
          say: "By the end of this lesson you will apply n equals Real Depth R over Apparent Depth A, calculate upward vertical shift d v equals R times 1 minus 1 over n, solve multi-layer problems, and bust the number-one WAEC wording trap."
        }
      ]
    },
    {
      title: "Do Now",
      steps: [
        {
          target: "#donow-list",
          cue: "Retrieve Lessons 1 & 2",
          say: "Start with these four spaced-retrieval cards from Lessons 1 and 2 on parallel emergence, lateral displacement, prism vs rectangular block dispersion, and Snell's law."
        }
      ]
    },
    {
      title: "The Story",
      steps: [
        {
          target: "#story-stage",
          action: "story:0",
          cue: "The Floating Eye-Chart Puzzle",
          say: "At Doctor Kunle's clinic, Zainab looks straight down through the 6-centimetre glass block at a printed patient chart — and notices the letters look as if they are floating 2 centimetres above the table!"
        },
        {
          target: { scene: "story", part: "cust2" },
          action: "story:1",
          cue: "Kelechi's Wording Trap",
          say: "Kelechi falls right into the classic exam trap: he divides 6 centimetres by the 2-centimetre rise and gets refractive index 3 point 0!"
        },
        {
          target: { scene: "story", part: "ngozi" },
          action: "story:2",
          cue: "d_v = 2.0 cm vs A = 4.0 cm",
          say: "Doctor Kunle corrects him immediately: 2 centimetres is the upward shift d v! The apparent depth measured from the top surface is A equals 6 minus 2 equal to 4 centimetres, giving n equals 6 over 4 equal to 1 point 5 0!"
        }
      ]
    },
    {
      title: "Wonder Wall & Sort",
      steps: [
        {
          target: "#wall-wonder",
          cue: "Pin your prediction",
          say: "Pin your prediction on the Wonder Wall before we test the no-parallax search pin.",
          wait: "note"
        },
        {
          target: "#kitchen-sort",
          cue: "Sort all 12 cards",
          say: "Sort these twelve cards into Real and Apparent Depth, Upward Vertical Shift d v, and No-Parallax Mechanism.",
          wait: "sort"
        }
      ]
    },
    {
      title: "3D No-Parallax Bench",
      steps: [
        {
          target: { scene: "bench", part: "clamp" },
          cue: "Retort Stand & Search Pin P₂",
          say: "On our 3D bench, a search pin P 2 is clamped to a retort stand beside the glass block. When P 2 is raised by d v equals R minus A above the bench, it aligns with the cyan virtual image I with zero parallax!"
        },
        {
          target: "#bench-trials",
          cue: "Test 5 Block Thicknesses",
          say: "Tap at least four thickness trials A to E to record Apparent Depth A and Upward Shift d v!",
          wait: "bench"
        }
      ]
    },
    {
      title: "Make Sense & 3D Cone Zoom",
      steps: [
        {
          target: "#eq-shm",
          cue: "n = R / A & Upward Shift",
          sparkle: true,
          say: "Here are the three master equations of Lesson 3: refractive index n equals Real Depth R over Apparent Depth A; upward vertical shift d v equals R minus A equals R times 1 minus 1 over n; and for multiple layers, total apparent depth equals the sum of t i over n i!"
        },
        {
          target: "#zoom-stage",
          cue: "3D Virtual-Image Ray Cone",
          say: "In the 3D Concept Zoom, see how amber rays from the bottom object O bend away from the normal as they enter air, so your eyes trace the green emergent rays backward along the cyan dashed lines to virtual image I!"
        }
      ]
    },
    {
      title: "Examples, Bridge & Quiz",
      steps: [
        {
          target: "#vinegar-test",
          cue: "Bust the 'Appears Raised By' Trap",
          say: "Run Steps 1, 2, and 3 in the Bridge Challenge to fix Kelechi's calculation!",
          wait: "bridge"
        },
        {
          target: "#quiz",
          cue: "12 WAEC & JAMB Questions",
          say: "Now test yourself on all twelve exam questions!",
          wait: "quiz"
        }
      ]
    }
  ]
};
