/* Lesson 03 · Choreographed StudyNarrator Script — Working of the Heart: Cardiac Cycle, Myogenic Pacemaker, Heart Sounds & Blood Pressure (en-NG) */
window.NARRATION = {
  rate: 0.96,
  pitch: 1.01,

  waits: {
    note: {
      event: "kit:note",
      prompt: "Type a prediction (or tap a seed question) and pin it to the Wonder Wall",
      react: function () {
        return "Pinned! Now let's test your ideas on the cardiac cycle, pacemaker, and Lub-Dub sounds.";
      }
    },
    sort: {
      event: "l1:sort-checked",
      prompt: "Sort all 12 cards into Atrial Systole & SAN, Ventricular Systole & 'LUB', and General Diastole & 'DUB', then tap Check my sorting",
      react: function (d) {
        if (!d) return "Good effort!";
        if (d.score === d.total) return "Twelve out of twelve! You matched every phase of the cardiac cycle, valve sound, and nerve control accurately.";
        if (d.score >= 9) return "Nice work! " + d.score + " out of " + d.total + ". Check the notes below for any card that slipped.";
        return "You got " + d.score + " out of " + d.total + ". Review the feedback below — remember that 'LUB' is AV valve closure and 'DUB' is semilunar valve closure!";
      }
    },
    bench: {
      event: "l1:bench-done",
      prompt: "Record at least 4 heart rate trials (A–E) on the 3D Pacemaker Bench",
      react: function () {
        return "Splendid! You stepped heart rate from 60 to 150 beats per minute and plotted the linear cardiac output line CO equals HR times SV!";
      }
    },
    bridge: {
      event: "l1:vinegar-done",
      prompt: "Run Steps 1, 2 and 3 to complete Tunde's LUTH blood pressure and cycle analysis",
      react: function () {
        return "Haemodynamics mastered! Cycle time 0 point 80 seconds, pulse pressure 40 millimetres of mercury, and mean arterial pressure 93 point 3 millimetres of mercury!";
      }
    },
    quiz: {
      event: "kit:quiz-done",
      prompt: "Answer all 12 WAEC/NECO/JAMB quiz questions",
      react: function (d) {
        if (!d) return "Quiz complete!";
        if (d.score >= 10) return "Outstanding — " + d.score + " out of " + d.total + "! You have mastered the myogenic pacemaker, cardiac cycle, heart sounds, and blood pressure.";
        if (d.score >= 7) return "Well done! " + d.score + " out of " + d.total + ". Review the explanations on the ones you missed.";
        return "You scored " + d.score + " out of " + d.total + ". Replay the Make Sense and 3D Conduction Zoom chapters, then retry!";
      }
    }
  },

  actions: {
    "pin:0": function () { if (window.L03 && window.L03.showPin) window.L03.showPin(0); },
    "pin:2": function () { if (window.L03 && window.L03.showPin) window.L03.showPin(2); },
    "pin:4": function () { if (window.L03 && window.L03.showPin) window.L03.showPin(4); },
    "bench:heavy": function () { if (window.StudyScenes && window.StudyScenes.bench) window.StudyScenes.bench.setCond("heavy"); },
    "bench:std":   function () { if (window.StudyScenes && window.StudyScenes.bench) window.StudyScenes.bench.setCond("std"); },
    "clock:1": function () { if (window.L03 && window.L03.vt) window.L03.vt.step1(); },
    "clock:2": function () { if (window.L03 && window.L03.vt) window.L03.vt.step2(); }
  },

  script: [
    {
      title: "Welcome",
      steps: [
        {
          target: ".l-hero .display",
          cue: "Lesson 3 · Cardiac Cycle, Pacemaker, Heart Sounds & Blood Pressure",
          sparkle: true,
          say: "Welcome to Lesson 3! Today we explore how the heart beats on its own without a brain nerve impulse, trace the sinoatrial node pacemaker wave, decode the Lub-Dub heart sounds, and calculate blood pressure and cardiac output."
        },
        {
          target: ".l-hero .question",
          cue: "Our guiding question",
          say: "Here is our guiding puzzle: what sparks 100,000 heartbeats every day inside your chest, and what slams shut to make the Lub-Dub sound in a doctor's stethoscope?"
        },
        {
          target: "#objectives",
          cue: "5 goals for Lesson 3",
          say: "By the end of this lesson you will explain myogenic contraction, trace the SAN-to-Purkinje conduction pathway, compare atrial systole, ventricular systole, and general diastole, link Lub and Dub to exact valve closures, and solve pulse pressure and cardiac output calculations."
        }
      ]
    },
    {
      title: "Do Now",
      steps: [
        {
          target: "#donow-list",
          cue: "Retrieve Lessons 1 & 2",
          say: "Start with these four spaced-retrieval Do Now cards on the 3-to-1 ventricular wall ratio, the pulmonary artery and vein exception, chordae tendineae, and vertebrate heart chambers."
        }
      ]
    },
    {
      title: "The Story",
      steps: [
        {
          target: "#story-stage",
          action: "story:0",
          cue: "LUTH ECG & Stethoscope Bay",
          say: "At the LUTH ECG and Haemodynamics Bay, Tunde listens to his chest through a stethoscope: Lub-Dub, Lub-Dub!"
        },
        {
          target: { scene: "story", part: "ngozi" },
          action: "story:2",
          cue: "Myogenic Pacemaker (SAN in Right Atrium)",
          say: "Nurse Chidinma explains why a heart keeps beating even outside the body: cardiac muscle is myogenic! The Sinoatrial Node in the upper right atrium fires its own electrical rhythm."
        },
        {
          target: { scene: "story", part: "clockB" },
          action: "story:3",
          cue: "'LUB' (AV Close) vs 'DUB' (Semilunar Close)",
          say: "And the sounds come from valve doors slamming shut: Lub is the bicuspid and tricuspid valves closing at the start of ventricular systole, while Dub is the semilunar valves closing at the start of diastole!"
        },
        {
          target: { scene: "story", part: "amaka" },
          action: "story:5",
          cue: "To the 3D Pacemaker Bench!",
          say: "Doctor Bamidele invites us to step heart rate from 60 to 150 beats per minute on the 3D Pacemaker Bench."
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
          say: "Pin your prediction on why the AVN delays the pacemaker impulse by 0 point 10 second!"
        }
      ]
    },
    {
      title: "Cardiac Cycle Sort",
      steps: [
        {
          target: "#kitchen-sort",
          cue: "Atrial Systole vs Ventricular Systole vs Diastole",
          wait: "sort",
          say: "Activity 1! Sort all twelve cards into Atrial Systole and SAN, Ventricular Systole and Lub, and General Diastole and Dub, then tap Check my sorting."
        }
      ]
    },
    {
      title: "3D Pacemaker Bench",
      steps: [
        {
          target: "#safety-box",
          cue: "Brachial Sphygmomanometer Rules",
          say: "Now step up to the 3D Pacemaker and Haemodynamics Bench! In clinical practice, blood pressure is measured over the brachial artery at heart level using an inflatable sphygmomanometer cuff."
        },
        {
          target: { scene: "bench", part: "clamp" },
          cue: "Golden Conduction Wave (SAN → Purkinje)",
          say: "Watch the golden electrical impulse fire at the Sinoatrial Node in the right atrium, pause at the AVN, and race down the septum to the Purkinje fibres."
        },
        {
          target: { scene: "bench", part: "bob" },
          action: "bench:test:1",
          cue: "Trial B · 75 bpm (Cycle T = 0.80 s)",
          say: "Look at Trial B: at 75 beats per minute, one cardiac cycle lasts 0 point 80 second, and with a 75 millilitre stroke volume, cardiac output is 5 point 63 litres per minute!"
        },
        {
          target: "#bench-stage",
          action: "bench:std",
          cue: "Your turn on the Pacemaker Bench!",
          wait: "bench",
          say: "Now it's your turn! Tap Trials A to E to record at least four heart rates."
        },
        {
          target: "#results-table",
          cue: "Complete the WAEC table",
          say: "Select the matching cycle duration T, stroke volume SV, and cardiac output CO in the table below."
        }
      ]
    },
    {
      title: "Pacemaker, Lub-Dub & BP",
      steps: [
        {
          target: "#eq-shm",
          cue: "Cycle Duration: T = 60 ÷ HR = 0.80 s",
          sparkle: true,
          say: "Let's lock in the equations of Lesson 3: first, cardiac cycle duration T equals 60 seconds divided by heart rate HR — which equals 0 point 10 plus 0 point 30 plus 0 point 40 second at 75 beats per minute."
        },
        {
          target: ["#eq-omega", "#eq-vel"],
          cue: "Pulse Pressure PP = P_sys − P_dia & MAP",
          say: "Second, pulse pressure equals systolic pressure minus diastolic pressure, and mean arterial pressure equals diastolic pressure plus one-third of pulse pressure."
        },
        {
          target: "#ph-explorer",
          action: "pin:2",
          cue: "0.10 s · First Sound 'LUB' (AV Valves Close)",
          say: "Tap along the Cardiac Cycle Timeline Explorer: at 0 point 10 second, ventricular contraction snaps the bicuspid and tricuspid valves shut, producing the first sound, Lub!"
        },
        {
          target: "#ph-explorer",
          action: "pin:4",
          cue: "0.40 s · Second Sound 'DUB' (Semilunar Close)",
          say: "And at 0 point 40 second, ventricular relaxation causes arterial blood to snap the aortic and pulmonary semilunar valves shut, producing the second sound, Dub!"
        }
      ]
    },
    {
      title: "3D Conduction & Phase Zoom",
      steps: [
        {
          target: { scene: "zoom", part: "vectors" },
          action: "zoom:mode:acid",
          cue: "Atrial Systole (0.10 s · SAN Fires)",
          say: "Inspect Atrial Systole in 3D: the SAN fires, both atria squeeze blood through open AV valves into the ventricles, and the semilunar valves stay closed."
        },
        {
          target: { scene: "zoom", part: "vectors" },
          action: "zoom:mode:base",
          cue: "Ventricular Systole (0.30 s · 'LUB' & Ejection)",
          say: "Switch to Ventricular Systole: Purkinje fibres contract the ventricles from the apex upward, snapping the AV valves shut with a Lub and forcing open the semilunar valves at 120 millimetres of mercury!"
        }
      ]
    },
    {
      title: "Worked Examples & Bridge",
      steps: [
        {
          target: "#ex1",
          cue: "Example 1 · Cardiac Cycle Phase Timing",
          say: "Study Worked Example 1: every calculation step is rendered in LaTeX with a plain-English explainer note underneath."
        },
        {
          target: "#vinegar-test",
          action: "clock:1",
          cue: "Solve Tunde's BP & Cycle Timing!",
          wait: "bridge",
          say: "Now run Steps 1, 2, and 3 to calculate Tunde's 0 point 80 second cycle duration, 40 millimetre of mercury pulse pressure, and 93 point 3 millimetre of mercury mean arterial pressure!"
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
          say: "Test yourself on these twelve exam-style questions on myogenic contraction, SAN and AVN, Lub-Dub sounds, and blood pressure."
        },
        {
          target: "#reflect",
          cue: "Rate your confidence & Assignment",
          say: "Finally, rate your confidence from 1 to 4, complete the Exit Ticket, and try the 30-mark assignment before moving to Lesson 4!"
        }
      ]
    }
  ]
};
