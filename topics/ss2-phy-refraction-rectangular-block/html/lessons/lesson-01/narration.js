/* Lesson 01 · Choreographed StudyNarrator Script — Refraction at Plane Surfaces, Wavefront Speed & Snell's Law (en-NG) */
window.NARRATION = {
  rate: 0.96,
  pitch: 1.01,

  waits: {
    note: {
      event: "kit:note",
      prompt: "Type a prediction (or tap a seed question) and pin it to the Wonder Wall",
      react: function () {
        return "Pinned! Now let's test your prediction on the 3D optical bench.";
      }
    },
    sort: {
      event: "l1:sort-checked",
      prompt: "Sort all 12 cards into Changes in Glass, Remains Constant, and Special Angle Rules, then tap Check my sorting",
      react: function (d) {
        if (!d) return "Good effort!";
        if (d.score === d.total) return "Twelve out of twelve! You know that speed and wavelength decrease in glass while frequency stays constant.";
        if (d.score >= 9) return "Nice work! " + d.score + " out of " + d.total + ". Check the notes below for any card that slipped.";
        return "You got " + d.score + " out of " + d.total + ". Review the feedback below — knowing that frequency f stays constant is a classic WAEC and JAMB question!";
      }
    },
    bench: {
      event: "l1:bench-done",
      prompt: "Record at least 4 angle trials (A–E) on the 3D Snell's law bench",
      react: function () {
        return "Excellent! You have recorded your sine i and sine r readings. Notice that the ratio sine i over sine r stays constant at 1 point 5 0!";
      }
    },
    bridge: {
      event: "l1:vinegar-done",
      prompt: "Run Steps 1, 2 and 3 to solve the 90-degree reflected-refracted puzzle",
      react: function () {
        return "Spot on! When reflected and refracted rays are 90 degrees apart, r equals 90 minus i so n equals tan i equal to 1 point 5 0!";
      }
    },
    quiz: {
      event: "kit:quiz-done",
      prompt: "Answer all 12 WAEC/NECO/JAMB quiz questions",
      react: function (d) {
        if (!d) return "Quiz complete!";
        if (d.score >= 10) return "Outstanding — " + d.score + " out of " + d.total + "! You have mastered Snell's Law and Wavefront Refraction.";
        if (d.score >= 7) return "Well done! " + d.score + " out of " + d.total + ". Review the explanations on the ones you missed.";
        return "You scored " + d.score + " out of " + d.total + ". Replay the Make Sense and Wavefront Zoom chapters, then retry!";
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
          cue: "Lesson 1 · Snell's Law & WaveSpeed",
          sparkle: true,
          say: "Welcome to Lesson 1 of Refraction Through a Rectangular Glass Block! Today we are investigating why light bends at a plane boundary, how wavefront speed and wavelength change while frequency stays constant, and how to apply Snell's law."
        },
        {
          target: ".l-hero .question",
          cue: "Our guiding question",
          say: "Here is our guiding puzzle: why does a laser beam entering glass at 45 degrees bend sharply to 28 point 1 degrees while keeping its exact same frequency and colour?"
        },
        {
          target: "#objectives",
          cue: "5 goals for Lesson 1",
          say: "By the end of this lesson you will state the two laws of refraction, use n equals sine i over sine r equals c over v equals lambda air over lambda glass, avoid the glancing-angle trap, and prove n equals tan i when reflected and refracted rays are 90 degrees apart."
        }
      ]
    },
    {
      title: "Do Now",
      steps: [
        {
          target: "#donow-list",
          cue: "Wake up your optics toolkit",
          say: "Start with these four quick Do Now cards on the speed of light in air, the wave equation v equals f lambda, measuring angles from the normal, and the law of reflection."
        }
      ]
    },
    {
      title: "The Story",
      steps: [
        {
          target: "#story-stage",
          action: "story:0",
          cue: "Surulere Optometry Clinic",
          say: "Let's step into Doctor Kunle's Optometry Clinic in Surulere, Lagos. Zainab watches a green laser enter a crown-glass block at 45 degrees and bend down to 28 point 1 degrees."
        },
        {
          target: { scene: "story", part: "cust2" },
          action: "story:1",
          cue: "Kelechi's guess",
          say: "Kelechi wonders whether the glass slows down the frequency of the laser oscillations."
        },
        {
          target: { scene: "story", part: "ngozi" },
          action: "story:2",
          cue: "Speed & wavelength drop, frequency stays fixed",
          say: "Doctor Kunle explains that frequency never changes! Instead, wave speed drops from 3 point 0 times 10 to power 8, to 2 point 0 times 10 to power 8 metres per second, compressing wavelength and pivoting the wavefront."
        },
        {
          target: { scene: "story", part: "clockB" },
          action: "story:3",
          cue: "Rig A (i=0°) vs Rig B (i=45°)",
          say: "Look at Rig A and Rig B on the bench: at normal incidence i equal to 0 degrees, the ray passes straight through with r equal to 0 degrees. At oblique incidence i equal to 45 degrees, Snell's law governs the bend!"
        },
        {
          target: { scene: "story", part: "amaka" },
          action: "story:5",
          cue: "To the Optics Lab",
          say: "Now let's join Mrs Adebayo in the physics lab to test five angles of incidence on our 3D Snell's law bench."
        }
      ]
    },
    {
      title: "Wonder Wall",
      steps: [
        {
          target: "#wall-wonder",
          cue: "Pin your prediction",
          say: "Before we fire the laser on the bench, pin your own prediction or tap one of the seed questions on the Wonder Wall.",
          wait: "note"
        }
      ]
    },
    {
      title: "Wavefront & Angle Sort",
      steps: [
        {
          target: "#kitchen-sort",
          cue: "Sort all 12 optics cards",
          say: "Sort these twelve cards into three bins: quantities that change when entering glass, quantities that remain strictly constant, and special angle rules or exam traps.",
          wait: "sort"
        }
      ]
    },
    {
      title: "3D Snell's Law Practical",
      steps: [
        {
          target: "#safety-box",
          cue: "Measure from the Normal!",
          say: "First, remember WAEC's number-one angle rule: always measure the angle of incidence i and angle of refraction r from the normal, never from the block surface!"
        },
        {
          target: { scene: "bench", part: "clamp" },
          cue: "Laser Ray Box",
          say: "On the 3D optical bench, our laser ray box fires an amber incident beam at the point of incidence O on the protractor disc."
        },
        {
          target: { scene: "bench", part: "bob" },
          cue: "Crown Glass Block (n = 1.50)",
          say: "Inside the crown glass block, the green refracted ray bends towards the normal while a faint violet ray partially reflects at angle i. Now tap at least four trials A to E to record your readings!",
          wait: "bench"
        },
        {
          target: "#results-table",
          cue: "Constant sin i / sin r = 1.50",
          say: "Fill in the table and check your readings — for every single angle, sine i divided by sine r equals 1 point 5 0!"
        }
      ]
    },
    {
      title: "Make Sense",
      steps: [
        {
          target: "#eq-shm",
          cue: "Snell's Law & Wave Speed",
          sparkle: true,
          say: "Here is the complete Snell's law chain: n equals sine i over sine r, which equals speed in air c over speed in medium v, which equals wavelength in air over wavelength in the medium!"
        },
        {
          target: "#eq-vel",
          cue: "90° Reflected–Refracted Shortcut",
          say: "And look at the famous JAMB and WAEC shortcut: when the reflected and refracted rays are perpendicular at 90 degrees apart, r equals 90 degrees minus i, so sine r equals cos i and refractive index n equals tan i!"
        },
        {
          target: "#ph-explorer",
          action: "pin:4",
          cue: "Optical Media Explorer",
          say: "Tap the pins on the Optical Media Explorer to compare air, water, crown glass, flint glass, and diamond."
        }
      ]
    },
    {
      title: "3D Wavefront Zoom",
      steps: [
        {
          target: "#zoom-stage",
          cue: "3D Marching Wavefronts",
          say: "Watch the 3D wavefront bars march across the air-to-glass boundary! As one edge of each wavefront enters glass first and slows down, the entire wavefront pivots towards the normal while the wavelength spacing compresses from 600 nanometres to 400 nanometres."
        }
      ]
    },
    {
      title: "Worked Examples & Bridge",
      steps: [
        {
          target: "#examples",
          cue: "3 step-by-step examples",
          say: "Study these three worked examples covering wavelength in glass, the glancing-angle trap, and the 90-degree reflected-refracted calculation."
        },
        {
          target: "#vinegar-test",
          cue: "Solve the 90° Clinic Puzzle",
          say: "Now apply the 90-degree perpendicular shortcut step by step in our Bridge Challenge below!",
          wait: "bridge"
        }
      ]
    },
    {
      title: "Quiz & Reflect",
      steps: [
        {
          target: "#quiz",
          cue: "12 WAEC & JAMB Questions",
          say: "Time to test yourself on twelve exam-style questions. Take your time and read every explanation!",
          wait: "quiz"
        },
        {
          target: "#reflect",
          cue: "Rate your confidence",
          say: "Rate yourself from 1 to 4 on each learning goal, complete the exit ticket and the 30-mark assignment, and I will see you in Lesson 2!"
        }
      ]
    }
  ]
};
