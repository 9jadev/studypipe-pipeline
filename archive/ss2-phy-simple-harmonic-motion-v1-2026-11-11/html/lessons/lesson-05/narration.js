/* Lesson 01 · Choreographed StudyNarrator Script — Simple Harmonic Motion & the Simple Pendulum */
window.NARRATION = {
  rate: 0.96,
  pitch: 1.01,

  waits: {
    note: {
      event: "kit:note",
      prompt: "Type a prediction (or tap a seed question) and pin it to the wall",
      react: function () {
        return "Pinned! Now let's test your prediction with real physics.";
      }
    },
    sort: {
      event: "l1:sort-checked",
      prompt: "Sort all 12 motions into the 3 bins, then tap Check my sorting",
      react: function (d) {
        if (!d) return "Good effort!";
        if (d.score === d.total) return "Twelve out of twelve! You spotted every true harmonic oscillator and didn't fall for the spinning fan trap.";
        if (d.score >= 9) return "Nice work! " + d.score + " out of " + d.total + ". Check the notes below for the ones that slipped.";
        return "You got " + d.score + " out of " + d.total + ". Read the explanations below — separating SHM from general periodic motion is a classic WAEC question!";
      }
    },
    bench: {
      event: "l1:bench-done",
      prompt: "Time at least 4 lengths on the 3D pendulum bench",
      react: function () {
        return "Brilliant! You've timed your lengths for twenty oscillations each. Let's look at the numbers in the table.";
      }
    },
    bridge: {
      event: "l1:vinegar-done",
      prompt: "Run Steps 1, 2 and 3 to calibrate Clock B",
      react: function () {
        return "Case solved! Shortening the rod by 15.6 centimetres brought Clock B's period right back to 2.00 seconds.";
      }
    },
    quiz: {
      event: "kit:quiz-done",
      prompt: "Answer all 12 WAEC/NECO/JAMB quiz questions",
      react: function (d) {
        if (!d) return "Quiz complete!";
        if (d.score >= 10) return "Outstanding — " + d.score + " out of " + d.total + "! You are ready for any WAEC or JAMB question on Simple Harmonic Motion.";
        if (d.score >= 7) return "Well done! " + d.score + " out of " + d.total + ". Review the explanations on the ones you missed.";
        return "You scored " + d.score + " out of " + d.total + ". Replay the Make Sense and Vector Zoom chapters, then hit Retry quiz!";
      }
    }
  },

  actions: {
    "pin:0": function () { if (window.L01 && window.L01.showPin) window.L01.showPin(0); },
    "pin:3": function () { if (window.L01 && window.L01.showPin) window.L01.showPin(3); },
    "pin:6": function () { if (window.L01 && window.L01.showPin) window.L01.showPin(6); },
    "bench:heavy": function () { if (window.StudyScenes && window.StudyScenes.bench) window.StudyScenes.bench.setCond("heavy"); },
    "bench:std":   function () { if (window.StudyScenes && window.StudyScenes.bench) window.StudyScenes.bench.setCond("std"); },
    "clock:1": function () { if (window.L01 && window.L01.vt) window.L01.vt.step1(); },
    "clock:2": function () { if (window.L01 && window.L01.vt) window.L01.vt.step2(); }
  },

  script: [
    // ---------------- 0. WELCOME ----------------
    {
      title: "Welcome",
      steps: [
        {
          target: ".l-hero .display",
          cue: "Lesson 5 · Energy & Finale",
          sparkle: true,
          say: "Welcome to Lesson 5 — the grand finale of our Simple Harmonic Motion unit! Today we explore mechanical energy interchange, loaded spiral springs, damping, resonance, and solve Mama Ngozi's Yaba Market clock mystery."
        },
        {
          target: ".l-hero .question",
          cue: "Our finale question",
          say: "How do kinetic and potential energy trade places across every swing, why is a spiral spring's period independent of gravity, and what exact pendulum length gives a two-second period in Lagos?"
        },
        {
          target: "#objectives",
          cue: "5 goals for Lesson 5",
          say: "By the end of this lesson you will calculate total SHM energy one-half m omega squared A squared, apply T equals two pi root m over k for spiral springs, distinguish damping from resonance, and calibrate Mama Ngozi's clock."
        }
      ]
    },

    // ---------------- 1. DO NOW ----------------
    {
      title: "Do Now",
      steps: [
        {
          target: "#donow-list",
          cue: "Retrieval from Lessons 2, 3 & 4",
          say: "First, test your memory across Lessons 2, 3, and 4: calculating gravity g from the L-T squared slope, diagnosing a fast stopwatch error, and stating WAEC Paper 3 precautions."
        }
      ]
    },

    // ---------------- 2. THE STORY ----------------
    {
      title: "The story",
      steps: [
        {
          target: "#story-stage",
          action: "story:0",
          cue: "Yaba Market, Lagos",
          say: "Let's head to Yaba Market in Lagos. Kunle, a school prefect, has brought back a pendulum wall clock he bought from Mama Ngozi. It loses eight minutes every single hour!"
        },
        {
          target: { scene: "story", part: "cust2" },
          action: "story:1",
          cue: "Mrs Adeyemi's theory",
          say: "Mrs Adeyemi is convinced the brass bob is too light. She says tying a heavier lead weight onto the bob will make gravity pull it faster."
        },
        {
          target: { scene: "story", part: "ngozi" },
          action: "story:2",
          cue: "Or the starting angle?",
          say: "Mama Ngozi wonders if Kunle didn't pull the pendulum out to a wide enough angle when starting it."
        },
        {
          target: { scene: "story", part: "clockB" },
          action: "story:3",
          cue: "Compare Clock A and Clock B",
          say: "Look closely at Clock A and Clock B on the table. Both have identical brass bobs, yet Clock B swings noticeably slower than Clock A."
        },
        {
          target: { scene: "story", part: "ngozi" },
          action: "story:4",
          cue: "Three suspects",
          say: "So we have three suspects: the mass of the bob, the starting angle, or the length of the pendulum rod. Which one really controls the time of one swing?"
        },
        {
          target: { scene: "story", part: "amaka" },
          action: "story:5",
          cue: "To the physics lab!",
          say: "Across town at the University of Lagos Metrology Lab, Dr Amaka has the answer: don't guess — put a pendulum on the retort stand, time twenty swings, and let the numbers speak!"
        }
      ]
    },

    // ---------------- 3. WONDER WALL ----------------
    {
      title: "Wonder Wall",
      steps: [
        {
          target: "#wall-wonder",
          cue: "Pin your prediction",
          wait: "note",
          say: "Before we touch the lab apparatus, what is your prediction? Does mass, angle, or length control the period of a pendulum? Type your prediction and pin it to the Wonder Wall."
        }
      ]
    },

    // ---------------- 4. MOTION SORT ----------------
    {
      title: "Motion sort",
      steps: [
        {
          target: "#kitchen-sort",
          cue: "SHM vs Periodic vs Non-periodic",
          wait: "sort",
          say: "Activity 1! Not every repeating motion is Simple Harmonic. To be SHM, a restoring force must pull the object back towards a central equilibrium position in proportion to its displacement. Sort all twelve cards into the three bins, then tap Check my sorting."
        }
      ]
    },

    // ---------------- 5. 3D PRACTICAL ----------------
    {
      title: "3D practical",
      steps: [
        {
          target: "#safety-box",
          cue: "WAEC setup rules",
          say: "Now step up to the 3D Pendulum Lab! Pay close attention to this examiner rule: always measure length L from the bottom of the split cork right to the centre of gravity of the bob."
        },
        {
          target: "#m1",
          action: "method:0",
          cue: "Step 1 · Measure L",
          say: "Step 1: Set the length L along the vertical metre rule, keeping your eye perpendicular to the scale to avoid parallax error."
        },
        {
          target: "#m2",
          action: "method:1",
          cue: "Step 2 · Fiducial mark at x = 0",
          say: "Step 2: Place the green fiducial reference pointer at the equilibrium centre. Why the centre? Because the bob flashes past the centre at maximum speed, making the crossing instant super sharp!"
        },
        {
          target: "#m3",
          action: "method:2",
          cue: "Step 3 · Small angle (≤ 10°)",
          say: "Step 3: Displace the bob through a small angle of ten degrees or less so it swings smoothly in a single vertical plane without conical wobble."
        },
        {
          target: "#m4",
          action: "method:3",
          cue: "Step 4 · Time 20 oscillations",
          say: "Step 4: Time twenty complete to-and-fro oscillations and divide by twenty. That divides your stopwatch reaction-time error by twenty!"
        },
        {
          target: { scene: "bench", part: "clamp" },
          cue: "Split cork suspension",
          say: "Here on the 3D bench is the split cork clamp holding the top of the thread firmly."
        },
        {
          target: { scene: "bench", part: "fiducial" },
          cue: "Centre reference pointer",
          say: "Down below is the green fiducial pointer at x equals zero, and the vertical metre rule on the left."
        },
        {
          target: { scene: "bench", part: "bob" },
          action: "bench:test:0",
          cue: "Trial A · L = 0.40 m",
          say: "Watch me time Trial A at length 0.40 metres. Twenty complete swings take 25.38 seconds, giving a period T of 1.269 seconds!"
        },
        {
          target: "#bench-cond",
          action: "bench:heavy",
          cue: "Test the 100 g heavy bob!",
          say: "What if we switch to the 100 gram heavy bob, or the 10 degree angle? Try them as you time the remaining lengths — you'll see the period stays identical!"
        },
        {
          target: "#bench-stage",
          action: "bench:std",
          cue: "Your turn on the bench!",
          wait: "bench",
          say: "Now it's your turn! Tap the trial buttons to time at least four different lengths on the 3D bench."
        },
        {
          target: "#results-table",
          cue: "Record your WAEC table",
          say: "Fill in your recorded values of t, T, and T squared in the WAEC results table here, and click Check my table."
        },
        {
          target: "#expected",
          action: "open:#expected",
          cue: "T² is proportional to L",
          say: "Look at the completed table and slope calculation: when length L doubles from 0.40 to 0.80 metres, T squared doubles from 1.61 to 3.22! Multiplying the slope by 4 pi squared gives g equals 9.81 metres per second squared."
        }
      ]
    },

    // ---------------- 6. SHM LAWS ----------------
    {
      title: "SHM laws",
      steps: [
        {
          target: "#eq-shm",
          cue: "The heart of SHM",
          sparkle: true,
          say: "Now let's make sense of the theory. Every simple harmonic motion obeys one master equation: a equals minus omega squared x. Acceleration is proportional to displacement x, and the minus sign shows it always points back towards the equilibrium centre."
        },
        {
          target: ["#eq-omega", "#eq-vel", "#eq-pend"],
          cue: "Your formula toolkit",
          say: "Here are the equations you'll use in calculations: omega equals 2 pi f, velocity v equals omega root A squared minus x squared, and for a simple pendulum, T equals 2 pi root L over g."
        },
        {
          target: "#all-alkalis",
          cue: "Classic exam distinction",
          sparkle: true,
          say: "Remember this golden rule: all simple harmonic motions are periodic, but not all periodic motions are simple harmonic!"
        },
        {
          target: "#props-table",
          cue: "Centre vs Extreme Ends",
          say: "Study this table carefully. At the equilibrium centre x equals zero, speed and kinetic energy are maximum while acceleration is zero. At the extreme ends, speed is zero while acceleration and potential energy are maximum!"
        },
        {
          target: "#ph-explorer",
          action: "pin:0",
          cue: "Left extreme (−A)",
          say: "Tap along the Swing Position Explorer: at the left extreme minus A, the bob stops momentarily, so speed is zero, but restoring acceleration is at its peak pulling rightward."
        },
        {
          target: "#ph-explorer",
          action: "pin:3",
          cue: "Equilibrium centre (x = 0)",
          say: "Right at the centre x equals zero, potential energy has turned 100 percent into kinetic energy — speed hits maximum and acceleration drops to zero!"
        }
      ]
    },

    // ---------------- 7. VECTOR ZOOM ----------------
    {
      title: "Vector zoom",
      steps: [
        {
          target: { scene: "zoom", part: "vectors" },
          action: "zoom:mode:mix",
          cue: "Teal = v · Amber = a",
          say: "Zoom in on the oscillating bob in 3D! The teal arrow shows velocity v, and the amber arrow shows restoring acceleration a."
        },
        {
          target: { scene: "zoom", part: "vectors" },
          action: "zoom:mode:acid",
          cue: "Frozen at x = 0",
          say: "Let's freeze the bob right at the equilibrium centre: notice how the teal velocity arrow is at full length, while the amber acceleration arrow has completely vanished!"
        },
        {
          target: { scene: "zoom", part: "vectors" },
          action: "zoom:mode:base",
          cue: "Frozen at x = +A",
          say: "Now freeze at the right extreme plus A: velocity is zero, but the amber restoring acceleration arrow is at maximum strength, pulling the bob back to the left."
        },
        {
          target: { scene: "zoom", part: "bars" },
          action: "zoom:mode:mix",
          cue: "Energy conservation",
          say: "And watch the 3D energy pillars on the right: kinetic energy and potential energy trade places twice every cycle, while total mechanical energy stays constant unless air damping is switched on."
        }
      ]
    },

    // ---------------- 8. WORKED EXAMPLES ----------------
    {
      title: "Worked examples",
      steps: [
        {
          target: "#ex1",
          cue: "Example 1 · From 20 swings to L",
          say: "Walk through Worked Example 1: divide 36.0 seconds by 20 swings first to get T equals 1.80 seconds, then find frequency, omega, and length L."
        },
        {
          target: "#ex2",
          cue: "Example 2 · Speed at displacement x",
          say: "Example 2 shows how to find maximum speed omega A, maximum acceleration omega squared A, and instantaneous speed at any displacement x."
        },
        {
          target: "#ex3",
          cue: "Example 3 · Slope of L vs T²",
          say: "Example 3 is straight from WAEC Paper 3: find the slope delta L over delta T squared, then multiply by 4 pi squared to determine g."
        },
        {
          target: "#ex4",
          cue: "Example 4 · Quadrupling L",
          say: "And Example 4 tackles JAMB's favourite scaling trap: because T is proportional to the square root of L, multiplying length by 4 doubles the period!"
        }
      ]
    },

    // ---------------- 9. THE BIG IDEA ----------------
    {
      title: "The big idea",
      steps: [
        {
          target: ["#vt-a", "#vt-b"],
          cue: "Clock A vs Clock B",
          say: "Now let's return to Mama Ngozi's stall and fix Kunle's school clock! Clock A ticks at 2.00 seconds, while Clock B is dragging at 2.15 seconds."
        },
        {
          target: "#vinegar-test",
          action: "clock:1",
          cue: "Step 1 · Heavy bob test",
          say: "When we clip a heavy lead weight onto Clock B in Step 1, its period stays 2.15 seconds! Mrs Adeyemi's mass theory is busted."
        },
        {
          target: "#vinegar-test",
          cue: "Shorten Clock B's length!",
          wait: "bridge",
          say: "Click Step 2 and Step 3 to screw the regulating nut upward, shortening Clock B's effective length L to 0.994 metres."
        },
        {
          target: "#big-idea",
          cue: "The core principle",
          sparkle: true,
          say: "And there is the big idea of this entire topic: the period of a simple pendulum depends only on its effective length L and gravity g — never on its mass!"
        }
      ]
    },

    // ---------------- 10. QUIZ & REFLECT ----------------
    {
      title: "Quiz & Reflect",
      steps: [
        {
          target: "#quiz",
          cue: "12 exam-style questions",
          wait: "quiz",
          say: "Test yourself on these twelve WAEC, NECO, and JAMB questions. Pick your answers and read the instant feedback!"
        },
        {
          target: "#reflect",
          cue: "Rate your confidence (1–4)",
          say: "Finally, rate yourself honestly from 1 to 4 on each learning goal, complete the two-mark Exit Ticket, and try the home pendulum investigation in the Assignment section. Well done today!"
        }
      ]
    }
  ]
};
