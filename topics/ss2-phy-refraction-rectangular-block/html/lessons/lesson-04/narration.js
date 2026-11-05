/* Lesson 04 · Choreographed StudyNarrator Script — Critical Angle, Total Internal Reflection & Optical Fibre Engineering (en-NG) */
window.NARRATION = {
  rate: 0.96,
  pitch: 1.01,

  waits: {
    note: {
      event: "kit:note",
      prompt: "Type a prediction (or tap a seed question) and pin it to the Wonder Wall",
      react: function () {
        return "Pinned! Now let's test the critical angle and Total Internal Reflection on our 3D optical bench.";
      }
    },
    sort: {
      event: "l1:sort-checked",
      prompt: "Sort all 12 cards into Refraction (i ≤ c), Total Internal Reflection (i > c), and TIR Applications",
      react: function (d) {
        if (!d) return "Good effort!";
        if (d.score === d.total) return "Twelve out of twelve! You know the two mandatory conditions for Total Internal Reflection and its real-world engineering applications.";
        if (d.score >= 9) return "Nice work! " + d.score + " out of " + d.total + ". Check the notes below for any card that slipped.";
        return "You got " + d.score + " out of " + d.total + ". Review the feedback below!";
      }
    },
    bench: {
      event: "l1:bench-done",
      prompt: "Record at least 4 angle trials (A–E) on the 3D Critical Angle bench",
      react: function () {
        return "Awesome! You watched the ray refract out below 41 point 8 degrees, graze the surface at 41 point 8 degrees, and reflect 100 percent internally at 45 and 60 degrees!";
      }
    },
    bridge: {
      event: "l1:vinegar-done",
      prompt: "Run Steps 1, 2 and 3 to verify 100% TIR in the 45° prism and Yaba optical fibre",
      react: function () {
        return "Spot on! Because 45 degrees is greater than the 41 point 8 degree critical angle of crown glass, 100 percent Total Internal Reflection occurs!";
      }
    },
    quiz: {
      event: "kit:quiz-done",
      prompt: "Answer all 12 WAEC/NECO/JAMB quiz questions",
      react: function (d) {
        if (!d) return "Quiz complete!";
        if (d.score >= 10) return "Outstanding — " + d.score + " out of " + d.total + "! You have mastered Critical Angle and Total Internal Reflection.";
        if (d.score >= 7) return "Well done! " + d.score + " out of " + d.total + ". Review the explanations on the ones you missed.";
        return "You scored " + d.score + " out of " + d.total + ". Replay the Make Sense and Prism Zoom chapters, then retry!";
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
          cue: "Lesson 4 · Critical Angle & TIR",
          sparkle: true,
          say: "Welcome to Lesson 4! Today we step into Tunde's Yaba Fibre-Optic Splice Hub to master the Critical Angle, Total Internal Reflection, 45-degree prism periscopes, optical fibres, and hot-road mirages."
        },
        {
          target: "#objectives",
          cue: "5 goals for Lesson 4",
          say: "By the end of this lesson you will define critical angle c, apply sine c equals 1 over n and v equals c naught sine c, state the two compulsory conditions for Total Internal Reflection, and explain why prisms and optical fibres outperform mirrors."
        }
      ]
    },
    {
      title: "Do Now",
      steps: [
        {
          target: "#donow-list",
          cue: "Retrieve Lessons 1–3",
          say: "Start with these four spaced-retrieval cards from Lessons 1 to 3 on apparent depth, multi-layer slabs, far-face shift E F, and reversibility of light."
        }
      ]
    },
    {
      title: "The Story",
      steps: [
        {
          target: "#story-stage",
          action: "story:0",
          cue: "Yaba Fibre-Optic Splice Hub",
          say: "At the Yaba tech corridor, Zainab watches Engineer Tunde tilt a laser beam inside a crown-glass block past 41 point 8 degrees — and suddenly the beam refuses to exit into air, reflecting 100 percent off the boundary!"
        },
        {
          target: { scene: "story", part: "ngozi" },
          action: "story:2",
          cue: "Two Mandatory Conditions for TIR",
          say: "Tunde emphasizes the two compulsory conditions for Total Internal Reflection: light must travel from an optically denser medium towards a less dense medium, and the angle of incidence must be greater than the critical angle c!"
        },
        {
          target: { scene: "story", part: "clockB" },
          action: "story:3",
          cue: "Critical Angle c = 41.8° vs TIR at 45°",
          say: "Look at Rig A and Rig B: at 41 point 8 degrees, the refracted ray grazes the surface at 90 degrees. At 45 degrees, 100 percent of the light reflects internally!"
        }
      ]
    },
    {
      title: "Wonder Wall & Sort",
      steps: [
        {
          target: "#wall-wonder",
          cue: "Pin your prediction",
          say: "Pin your prediction on the Wonder Wall before we sweep the internal laser angle.",
          wait: "note"
        },
        {
          target: "#kitchen-sort",
          cue: "Sort all 12 cards",
          say: "Sort these twelve cards into Refraction or Critical Angle, Total Internal Reflection, and Engineering Applications of TIR.",
          wait: "sort"
        }
      ]
    },
    {
      title: "3D Critical Angle & Fibre Bench",
      steps: [
        {
          target: { scene: "bench", part: "bob" },
          cue: "Sweep Internal Angle i (20° to 60°)",
          say: "On the 3D bench, the laser originates inside the denser glass block. Tap Trials A to E from 20 degrees to 60 degrees and switch to the Optical Fibre Waveguide mode to see multi-bounce Total Internal Reflection!",
          wait: "bench"
        }
      ]
    },
    {
      title: "Make Sense & 3D Prism Zoom",
      steps: [
        {
          target: "#eq-shm",
          cue: "sin c = 1/n & v = c₀ sin c",
          sparkle: true,
          say: "Here are the master equations: sine c equals 1 over n, or n 2 over n 1 for two media; and combining v equals c naught over n with sine c equals 1 over n gives the JAMB speed shortcut v equals c naught sine c!"
        },
        {
          target: "#zoom-stage",
          cue: "45° Prism vs Thick Mirror Ghost Images",
          say: "In the 3D Concept Zoom, compare a 45-degree crown-glass prism with a thick silvered mirror! Notice how the thick mirror produces faint red ghost images from front-surface reflections, whereas the prism gives a single 100-percent bright image!"
        }
      ]
    },
    {
      title: "Examples, Bridge & Quiz",
      steps: [
        {
          target: "#vinegar-test",
          cue: "Verify 45° Prism & Fibre TIR",
          say: "Run Steps 1, 2, and 3 in the Bridge Challenge to verify why 45-degree prisms and Yaba optical fibres achieve 100 percent reflection!",
          wait: "bridge"
        },
        {
          target: "#quiz",
          cue: "12 WAEC & JAMB Questions",
          say: "Now complete all twelve exam questions!",
          wait: "quiz"
        }
      ]
    }
  ]
};
