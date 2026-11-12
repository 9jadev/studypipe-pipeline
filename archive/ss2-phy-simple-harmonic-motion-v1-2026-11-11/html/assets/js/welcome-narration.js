/* ==========================================================
   StudyPipe — Welcome Hub Guided Tour Narration (en-NG priority)
   ========================================================== */
window.NARRATION = {
  rate: 0.95,
  pitch: 1.02,

  waits: {
    lab: {
      event: "lab:result",
      timeout: 60000,
      prompt: "Your turn! Tap 'Time 20 Swings' or 'Change Length L' in the 3D lab.",
      react: function (d) {
        if (!d) return { say: "No rush! You can test the 3D pendulum any time. Let's explore the rest of the unit." };
        return {
          say: "Brilliant timing! At length " + (d.length * 100).toFixed(0) + " centimetres, twenty complete swings gave a period T of " + d.period.toFixed(2) + " seconds, confirming Lagos gravity at 9 point 78 metres per second squared!",
          target: "#endpoint-toast",
          sparkle: true,
          cue: "20 swings timed!"
        };
      }
    }
  },

  script: [
    {
      title: "Welcome",
      steps: [
        {
          target: ".hero-title",
          cue: "Welcome to SHM",
          sparkle: true,
          say: "Welcome! In this five-lesson physics unit, we are mastering Simple Harmonic Motion and the Simple Pendulum — one of the highest-scoring topics in WAEC, NECO, and JAMB Physics."
        },
        {
          target: ".hero-meta",
          cue: "5 lessons · 10 3D stages",
          say: "You have five progressive lessons, ten interactive 3D stages, and three virtual practicals — all working completely offline on your phone or laptop."
        }
      ]
    },
    {
      title: "The 3D Lab",
      steps: [
        {
          target: "#lab",
          cue: "Live 3D Pendulum",
          say: "Right here in the hero is a live 3D simple pendulum bench. Let's inspect each piece of apparatus before we time a swing."
        },
        {
          target: { part: "cork" },
          cue: "Split cork clamp",
          say: "At the top is the split cork clamped in a retort stand. It grips the cotton thread tightly so the pivot point never slips sideways."
        },
        {
          target: { part: "bob" },
          cue: "Brass pendulum bob",
          say: "Hanging at the bottom is the heavy spherical brass bob. Remember: effective length L is measured from the bottom of the split cork right to the centre of gravity of this bob."
        },
        {
          target: { part: "fiducial" },
          cue: "Equilibrium fiducial mark",
          say: "Behind the centre of the swing stands the glowing teal fiducial mark at x equals zero, where the bob moves fastest. Now it's your turn to time twenty swings!",
          wait: "lab"
        }
      ]
    },
    {
      title: "The Mystery",
      steps: [
        {
          target: "#mystery .section-title",
          cue: "Yaba Market Mystery",
          sparkle: true,
          say: "Every lesson in this unit follows a real Nigerian mystery: why did Mama Ngozi's antique grandfather clock keep perfect time in London, yet start losing fourteen minutes every single day inside her Yaba Market stall in Lagos?"
        },
        {
          target: ".case-card",
          cue: "Case File #SHM-04",
          say: "Even stranger, when her apprentice Chidi hung heavy brass washers onto the pendulum bob, the clock didn't speed up by even one second! By Lesson 5, you will use the pendulum law to calibrate her clock to the exact millimetre."
        },
        {
          target: ".stats",
          cue: "WAEC Paper 3 favourite",
          say: "Look at the exam weight: Simple Harmonic Motion and the simple pendulum practical carry up to thirty percent of your WAEC and NECO Paper 3 Mechanics marks."
        }
      ]
    },
    {
      title: "Your 5-Lesson Journey",
      steps: [
        {
          target: "#journey .section-title",
          cue: "5 progressive lessons",
          say: "Instead of cramming everything into one marathon page, we've broken the unit into five focused lessons."
        },
        {
          target: '.lesson[data-lesson="1"]',
          cue: "Lesson 1 · Harmonic Motion",
          say: "Lesson 1 opens the Yaba Market clock mystery and teaches you how to distinguish true Simple Harmonic Motion from ordinary periodic motion using the restoring law a equals minus omega squared x."
        },
        {
          target: '.lesson[data-lesson="2"]',
          cue: "Lesson 2 · Kinematics",
          say: "Lesson 2 dives into angular frequency omega, velocity v equals omega root A squared minus x squared, and 3D phase vectors."
        },
        {
          target: '.lesson[data-lesson="3"]',
          cue: "Lesson 3 · Pendulum Practical",
          say: "Lesson 3 puts you on the WAEC Paper 3 laboratory bench to test how string length, bob mass, and release angle affect the period T."
        },
        {
          target: '.lesson[data-lesson="4"]',
          cue: "Lesson 4 · Finding Gravity g",
          say: "Lesson 4 teaches you how to plot L against T squared, calculate acceleration due to gravity g from the slope, and spot experimental errors."
        },
        {
          target: '.lesson[data-lesson="5"]',
          cue: "Lesson 5 · Energy, Springs & Resonance",
          say: "And Lesson 5 covers mechanical energy exchange, loaded spiral springs, damping, resonance, and solving Mama Ngozi's clock mystery once and for all."
        }
      ]
    },
    {
      title: "SHM Position Explorer",
      steps: [
        {
          target: "#explorer .section-title",
          cue: "Interactive sneak preview",
          say: "Try this interactive SHM Position Explorer. Tap any position along the swing to see how velocity, acceleration, and energy behave."
        },
        {
          target: "#combo-tabs",
          action: "combo:equilibrium",
          cue: "At equilibrium (x = 0)",
          say: "At equilibrium x equals zero, restoring force and acceleration drop to zero, while speed and kinetic energy hit their absolute maximum!"
        },
        {
          target: "#combo-tabs",
          action: "combo:extreme",
          cue: "At the extremes (x = ±A)",
          say: "Switch to the extreme turning points x equals plus or minus A: the bob pauses for an instant so velocity is zero, but restoring acceleration reaches its peak omega squared A."
        }
      ]
    },
    {
      title: "Formulas & Myths",
      steps: [
        {
          target: "#archetypes",
          cue: "6 calculation types",
          say: "Here are the six calculation archetypes that WAEC, NECO, and JAMB set every year — from angular frequency and maximum speed to pendulum slope and spiral springs."
        },
        {
          target: "#myths",
          action: "myth:0",
          cue: "Myth #1 busted",
          say: "And watch out for these three classic student traps! First: hanging a heavier bob does NOT make a pendulum swing faster — mass cancels out completely in T equals two pi root L over g."
        },
        {
          target: "#myths",
          action: "myth:1",
          cue: "Myth #2 busted",
          say: "Second: acceleration is NOT maximum at the centre just because speed is maximum there. At the centre, net force is zero, so acceleration is zero!"
        }
      ]
    },
    {
      title: "Ready to Begin",
      steps: [
        {
          target: ".finale",
          cue: "Start Lesson 1",
          sparkle: true,
          say: "You are all set! Tap Begin Lesson 1 below to step into Mama Ngozi's clock stall in Yaba Market and start your investigation."
        }
      ]
    }
  ]
};
