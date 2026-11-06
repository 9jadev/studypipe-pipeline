/* Lesson 01 · Choreographed StudyNarrator Script — Need for Transport: Open vs Closed & Single vs Double Circulation (en-NG) */
window.NARRATION = {
  rate: 0.96,
  pitch: 1.01,

  waits: {
    note: {
      event: "kit:note",
      prompt: "Type a prediction (or tap a seed question) and pin it to the Wonder Wall",
      react: function () {
        return "Pinned! Now let's test your ideas on open, single, and double circulatory systems.";
      }
    },
    sort: {
      event: "l1:sort-checked",
      prompt: "Sort all 12 cards into Open Circulation, Single Closed Circulation, and Double Closed Circulation, then tap Check my sorting",
      react: function (d) {
        if (!d) return "Good effort!";
        if (d.score === d.total) return "Twelve out of twelve! You distinguished insect open haemocoel, fish single circulation, and tetrapod double circulation flawlessly.";
        if (d.score >= 9) return "Nice work! " + d.score + " out of " + d.total + ". Check the notes below for any card that slipped.";
        return "You got " + d.score + " out of " + d.total + ". Review the feedback below — WAEC and JAMB love testing cockroach haemolymph and the crocodile 4-chamber exception!";
      }
    },
    bench: {
      event: "l1:bench-done",
      prompt: "Record at least 4 cube size trials (A–E) on the 3D SA/V bench",
      react: function () {
        return "Splendid! You measured surface area, volume, and SA over V across four cube sizes and proved that SA over V equals 6 divided by L.";
      }
    },
    bridge: {
      event: "l1:vinegar-done",
      prompt: "Run Steps 1, 2 and 3 to solve Tunde's Surulere Stadium transport puzzle",
      react: function () {
        return "Puzzle solved! At 150 beats per minute and 110 millilitres stroke volume, Tunde's cardiac output reaches 16 point 5 litres per minute!";
      }
    },
    quiz: {
      event: "kit:quiz-done",
      prompt: "Answer all 12 WAEC/NECO/JAMB quiz questions",
      react: function (d) {
        if (!d) return "Quiz complete!";
        if (d.score >= 10) return "Outstanding — " + d.score + " out of " + d.total + "! You have mastered SA/V ratios, Open versus Closed, and Single versus Double Circulation.";
        if (d.score >= 7) return "Well done! " + d.score + " out of " + d.total + ". Review the explanations on the ones you missed.";
        return "You scored " + d.score + " out of " + d.total + ". Replay the Make Sense and 3D Circuit Zoom chapters, then retry!";
      }
    }
  },

  actions: {
    "pin:0": function () { if (window.L01 && window.L01.showPin) window.L01.showPin(0); },
    "pin:1": function () { if (window.L01 && window.L01.showPin) window.L01.showPin(1); },
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
          cue: "Lesson 1 · Need for Transport, Open vs Closed & Single vs Double Circulation",
          sparkle: true,
          say: "Welcome to Lesson 1 of The Human Heart and Blood Circulation! Today we prove mathematically why large organisms need a transport system, contrast open and closed circulation, and compare single and double vertebrate circulation."
        },
        {
          target: ".l-hero .question",
          cue: "Our guiding question",
          say: "Here is our guiding puzzle: why can a microscopic pond Amoeba breathe by simple diffusion, a cockroach survive with colourless haemolymph, and a human sprinter require a four-chambered double pump?"
        },
        {
          target: "#objectives",
          cue: "5 goals for Lesson 1",
          say: "By the end of this lesson you will calculate surface-area-to-volume ratios, explain why insect haemolymph does not carry oxygen, contrast open and closed systems, compare two-chamber fish, three-chamber amphibian, and four-chamber mammalian hearts, and compute cardiac output."
        }
      ]
    },
    {
      title: "Do Now",
      steps: [
        {
          target: "#donow-list",
          cue: "Wake up your biology toolkit",
          say: "Start with these four quick Do Now cards on diffusion distance, surface-area-to-volume formulas, cellular respiration, and levels of organisation. Answer each in your head before flipping!"
        }
      ]
    },
    {
      title: "The Story",
      steps: [
        {
          target: "#story-stage",
          action: "story:0",
          cue: "Surulere National Stadium, Lagos",
          say: "Let's step onto the track at Surulere National Stadium, Lagos. Tunde has just finished a 400-metre sprint with his heart hammering at 150 beats per minute."
        },
        {
          target: { scene: "story", part: "cust2" },
          action: "story:1",
          cue: "The SA/V = 6 ÷ L Mathematical Trap",
          say: "Amaka explains the mathematical reason: as an organism's side length L increases a thousand-fold, its surface-area-to-volume ratio 6 over L drops a thousand-fold, making simple diffusion far too slow."
        },
        {
          target: { scene: "story", part: "ngozi" },
          action: "story:2",
          cue: "Cockroach Open Haemocoel",
          say: "Coach Musa points to a cockroach by the bench: insects have an open circulatory system where colourless haemolymph bathes organs directly in a haemocoel."
        },
        {
          target: { scene: "story", part: "clockA" },
          action: "story:3",
          cue: "Tracheae Carry O₂ in Insects!",
          say: "Remember this classic WAEC exam fact: cockroach haemolymph lacks haemoglobin and carries zero oxygen! Instead, tracheal tubes deliver oxygen directly to insect tissues."
        },
        {
          target: { scene: "story", part: "amaka" },
          action: "story:5",
          cue: "To the LUTH Cardiovascular Lab!",
          say: "At the LUTH Cardiovascular Lab, Doctor Bamidele invites us to test cube scaling and circulation loops on the 3D bench."
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
          say: "Before we touch the 3D bench, pin your prediction or question to the Wonder Wall!"
        }
      ]
    },
    {
      title: "Circulatory Systems Sort",
      steps: [
        {
          target: "#kitchen-sort",
          cue: "Open vs Single Closed vs Double Closed",
          wait: "sort",
          say: "Activity 1! Sort all twelve cards into Open Circulation, Single Closed Circulation, and Double Closed Circulation, then tap Check my sorting."
        }
      ]
    },
    {
      title: "3D SA/V & Pump Bench",
      steps: [
        {
          target: "#safety-box",
          cue: "Why Size Demands Mass Flow",
          say: "Now step up to the 3D Surface-Area-to-Volume and Pump Bench! Watch how subdividing a tissue block into capillary-fed units restores exchange area."
        },
        {
          target: { scene: "bench", part: "clamp" },
          cue: "3D Subdivided Tissue Cube",
          say: "On the left is our 3D tissue cube showing surface area 6 L squared and volume L cubed."
        },
        {
          target: { scene: "bench", part: "bob" },
          action: "bench:test:1",
          cue: "Trial B · L = 1.0 mm (SA/V = 6.00 mm⁻¹)",
          say: "Watch Trial B: at side length L equals 1 millimetre, surface area is 6 square millimetres, volume is 1 cubic millimetre, and SA over V is 6 per millimetre."
        },
        {
          target: "#bench-stage",
          action: "bench:std",
          cue: "Your turn on the 3D bench!",
          wait: "bench",
          say: "Now it's your turn! Tap the trial buttons A to E to record at least four organism sizes."
        },
        {
          target: "#results-table",
          cue: "Complete the WAEC table",
          say: "Select your recorded surface area, volume, and SA over V ratio in the table below."
        }
      ]
    },
    {
      title: "Open vs Closed & Single vs Double",
      steps: [
        {
          target: "#eq-shm",
          cue: "Surface-Area-to-Volume: SA/V = 6 ÷ L",
          sparkle: true,
          say: "Let's lock in the two core equations of Lesson 1: first, for a cube of side L, surface-area-to-volume ratio equals 6 divided by L."
        },
        {
          target: ["#eq-omega", "#eq-vel"],
          cue: "Cardiac Output: CO = HR × SV",
          say: "Second, cardiac output equals heart rate multiplied by stroke volume, and full blood circulation time equals total blood volume divided by cardiac output."
        },
        {
          target: "#ph-explorer",
          action: "pin:1",
          cue: "Cockroach Open Circulation",
          say: "Tap along the Comparative Transport Explorer: in the cockroach, a 13-chambered dorsal heart pumps colourless haemolymph through ostia into the haemocoel."
        },
        {
          target: "#ph-explorer",
          action: "pin:4",
          cue: "4-Chamber Complete Double Circulation",
          say: "In birds, mammals, and crocodiles, a four-chambered heart completely separates oxygenated and deoxygenated blood!"
        }
      ]
    },
    {
      title: "3D Vertebrate Circuit Zoom",
      steps: [
        {
          target: { scene: "zoom", part: "vectors" },
          action: "zoom:mode:acid",
          cue: "Fish Single Circulation (2 Chambers)",
          say: "Zoom inside the 3D Fish Single Circulation loop on the left! Blood passes through the two-chambered heart once per lap, losing pressure across the gill capillaries before reaching the body."
        },
        {
          target: { scene: "zoom", part: "vectors" },
          action: "zoom:mode:base",
          cue: "Mammalian Double Circulation (4 Chambers)",
          say: "Now switch to Mammalian Double Circulation on the right: the figure-eight loop returns oxygenated blood from the lungs to the thick left ventricle, repumping it at 120 millimetres of mercury!"
        }
      ]
    },
    {
      title: "Worked Examples & Bridge",
      steps: [
        {
          target: "#ex1",
          cue: "Example 1 · SA/V Scaling Calculation",
          say: "Study Worked Example 1: every step is rendered in LaTeX with a plain-English explainer note underneath — showing why a 0 point 1 millimetre Amoeba has a 1,000 times larger SA over V ratio than a 100 millimetre tissue cube."
        },
        {
          target: "#vinegar-test",
          action: "clock:1",
          cue: "Solve Tunde's Surulere Sprint Output!",
          wait: "bridge",
          say: "Now help Tunde and Amaka connect SA over V scaling to his 400-metre sprint cardiac output! Click Steps 1, 2, and 3."
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
          say: "Test yourself on these twelve exam-style questions on SA over V ratios, cockroach haemolymph, fish single circulation, and mammalian double circulation."
        },
        {
          target: "#reflect",
          cue: "Rate your confidence & Assignment",
          say: "Finally, rate your confidence from 1 to 4, complete the Exit Ticket, and try the 30-mark assignment before moving to Lesson 2!"
        }
      ]
    }
  ]
};
