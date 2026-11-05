/* Lesson 05 · Choreographed StudyNarrator Script — WAEC/NECO Paper 3 Four-Pin Ray-Tracing Practical & The 7 Graph Variants (en-NG) */
window.NARRATION = {
  rate: 0.96,
  pitch: 1.01,

  waits: {
    note: {
      event: "kit:note",
      prompt: "Type a prediction (or tap a seed question) and pin it to the Wonder Wall",
      react: function () {
        return "Pinned! Now let's test the four-pin ray-tracing practical and internal triangle L N naught E on our 3D optical bench.";
      }
    },
    sort: {
      event: "l1:sort-checked",
      prompt: "Sort all 12 cards into Snell's Law Slopes, Internal Triangle LN₀E Slopes, and Paper 3 Precautions",
      react: function (d) {
        if (!d) return "Good effort!";
        if (d.score === d.total) return "Twelve out of twelve! You know every WAEC Paper 3 graph slope and practical precaution.";
        if (d.score >= 9) return "Nice work! " + d.score + " out of " + d.total + ". Check the notes below for any card that slipped.";
        return "You got " + d.score + " out of " + d.total + ". Review the feedback below!";
      }
    },
    bench: {
      event: "l1:bench-done",
      prompt: "Record at least 4 four-pin trials (A–E) on the 3D WAEC Paper 3 bench",
      react: function () {
        return "Awesome! You measured L E equals w tan r, L N equals w sec r, and confirmed that L E divided by L N equals sine r across every angle!";
      }
    },
    bridge: {
      event: "l1:vinegar-done",
      prompt: "Run Steps 1, 2 and 3 to decode Variant F and Variant C and complete the unit",
      react: function () {
        return "Congratulations! You have solved the Clinic Glass Block Mystery and mastered all five lessons of this unit!";
      }
    },
    quiz: {
      event: "kit:quiz-done",
      prompt: "Answer all 12 WAEC/NECO/JAMB quiz questions",
      react: function (d) {
        if (!d) return "Quiz complete!";
        if (d.score >= 10) return "Outstanding — " + d.score + " out of " + d.total + "! You are 100 percent ready for WAEC, NECO, and JAMB questions on Refraction Through a Rectangular Glass Block.";
        if (d.score >= 7) return "Well done! " + d.score + " out of " + d.total + ". Review the explanations on the ones you missed.";
        return "You scored " + d.score + " out of " + d.total + ". Replay the Make Sense and 7-Graph Decoder chapters, then retry!";
      }
    }
  },

  actions: {
    "pin:0": function () { if (window.L01 && window.L01.showPin) window.L01.showPin(0); },
    "pin:1": function () { if (window.L01 && window.L01.showPin) window.L01.showPin(1); },
    "pin:2": function () { if (window.L01 && window.L01.showPin) window.L01.showPin(2); },
    "pin:4": function () { if (window.L01 && window.L01.showPin) window.L01.showPin(4); },
    "bench:heavy": function () { if (window.StudyScenes && window.StudyScenes.bench) window.StudyScenes.bench.setCond("heavy"); },
    "bench:wide":  function () { if (window.StudyScenes && window.StudyScenes.bench) window.StudyScenes.bench.setCond("wide"); },
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
          cue: "Lesson 5 · WAEC Paper 3 & The 7 Graph Variants",
          sparkle: true,
          say: "Welcome to Lesson 5, the grand finale of our unit! Today we step into the WAEC Physics Paper 3 practical examination hall to master the four-pin ray-tracing method, mandatory precautions, the internal right-angled triangle L N naught E, and all seven WAEC graph variants."
        },
        {
          target: "#objectives",
          cue: "5 goals for Lesson 5",
          say: "By the end of this lesson you will align pin bases at 4 to 5 centimetres spacing, derive L E equals w tan r and L N equals w sec r, and decode all seven WAEC Paper 3 graphs."
        }
      ]
    },
    {
      title: "Do Now",
      steps: [
        {
          target: "#donow-list",
          cue: "Retrieve Lessons 1–4",
          say: "Warm up with these four spaced-retrieval cards covering Lessons 1 to 4: Snell's law, lateral displacement, apparent depth, and critical angle."
        }
      ]
    },
    {
      title: "The Story",
      steps: [
        {
          target: "#story-stage",
          action: "story:0",
          cue: "The Tilted Pin Mystery",
          say: "In the physics lab, Kelechi aligned the red plastic heads at the tops of pins P 3 and P 4 — and because pin P 3 tilted slightly, his emergent ray missed by four degrees!"
        },
        {
          target: { scene: "story", part: "ngozi" },
          action: "story:2",
          cue: "Align Pin Bases (Feet) at ≥ 4 cm Spacing",
          say: "Dr Kunle and Zainab explain why WAEC examiners always award marks for aligning the bases or feet of the pins where they pierce the paper, and spacing consecutive pins at least 4 to 5 centimetres apart!"
        },
        {
          target: { scene: "story", part: "clockB" },
          action: "story:3",
          cue: "Internal Triangle LN₀E",
          say: "Look at Board B: inside the glass block of width w, the normal L N naught, back-face offset L E equals w tan r, and refracted path L N equals w sec r form a right-angled triangle!"
        }
      ]
    },
    {
      title: "Wonder Wall & Sort",
      steps: [
        {
          target: "#wall-wonder",
          cue: "Pin your prediction",
          say: "Pin your prediction on the Wonder Wall before we sort the seven WAEC graph variants.",
          wait: "note"
        },
        {
          target: "#kitchen-sort",
          cue: "Sort 12 Paper 3 cards",
          say: "Sort these 12 cards into Snell's Law Slopes, Internal Triangle L N naught E Slopes, and Paper 3 Precautions.",
          wait: "sort"
        }
      ]
    },
    {
      title: "3D Four-Pin Lab",
      steps: [
        {
          target: { scene: "bench", part: "clamp" },
          action: "bench:std",
          cue: "Optical Pins P₁–P₄ (Bases Highlighted)",
          say: "Look at the four optical pins on the drawing board. Notice the glowing green rings at the bases of the pins on the paper!"
        },
        {
          target: { scene: "bench", part: "bob" },
          action: "bench:heavy",
          cue: "Triangle LN₀E (w, LE, LN)",
          say: "Inside the block, the cyan normal has length w equals 6 centimetres, the amber offset along the back face is L E equals w tan r, and the emerald refracted path is L N equals w sec r."
        },
        {
          target: "#bench-trials",
          cue: "Record at least 4 trials",
          say: "Tap Trials A to E on the 3D Four-Pin bench to record at least four ray-tracing measurements.",
          wait: "bench"
        }
      ]
    },
    {
      title: "Make Sense",
      steps: [
        {
          target: "#eq-shm",
          cue: "Triangle LN₀E Equations",
          sparkle: true,
          say: "In right-angled triangle L N naught E, L E equals w tan r, L N equals w sec r, and L E divided by L N equals sine r!"
        },
        {
          target: "#ph-explorer",
          action: "pin:1",
          cue: "Variant C: cos i vs cos r Curve",
          say: "In Variant C, plotting cos i against cos r gives a curve, never a straight line! Read a point x 1 comma y 1 on the curve and calculate n equals square root of 1 minus x 1 squared divided by 1 minus y 1 squared."
        },
        {
          target: "#zoom-stage",
          cue: "3D Triangle LN₀E & Pin-Base Zoom",
          say: "Use the 3D zoom stage to toggle between the internal triangle L N naught E, the tilted pin-base comparison, and the curved cosine graph."
        }
      ]
    },
    {
      title: "Unit Finale & Quiz",
      steps: [
        {
          target: "#vinegar-test",
          action: "clock:1",
          cue: "Decode Variant F & Variant C",
          say: "Run Steps 1, 2, and 3 to decode the LE versus LN graph and celebrate completing all five lessons!",
          wait: "bridge"
        },
        {
          target: "#quiz-list",
          cue: "12 WAEC/NECO/JAMB Questions",
          say: "Now complete all 12 WAEC, NECO, and JAMB exam questions to finish the unit strong.",
          wait: "quiz"
        }
      ]
    }
  ]
};
