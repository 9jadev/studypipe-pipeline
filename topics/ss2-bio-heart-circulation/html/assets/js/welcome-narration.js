/* ==========================================================
   StudyPipe — Welcome Hub Guided Narrator Tour (The Human Heart & Blood Circulation, en-NG)
   ========================================================== */
window.NARRATION = {
  rate: 0.96,
  pitch: 1.01,

  actions: {
    "lab:rest":    function () { if (window.StudyLab) window.StudyLab.setMode("rest"); },
    "lab:sprint":  function () { if (window.StudyLab) window.StudyLab.setMode("sprint"); },
    "lab:cutaway": function () { if (window.StudyLab) window.StudyLab.setMode("cutaway"); }
  },

  script: [
    {
      title: "Welcome & 3D Beating Heart Lab",
      steps: [
        {
          target: ".hero-title",
          cue: "SS2 Biology · 5-Lesson Unit",
          sparkle: true,
          say: "Welcome to The Human Heart and Blood Circulation! In this five-lesson unit, we will explore the beating four-chamber mammalian heart in 3D, solve every WAEC, NECO, and JAMB cardiovascular calculation step by step, and master the Paper 3 dissection and blood-grouping practical."
        },
        {
          target: { scene: "lab", part: "rv" },
          action: "lab:rest",
          cue: "Right Pump · Pulmonary Circuit",
          say: "Look at the left side of your screen — that is the anatomical right side of our 3D heart. Dark-blue deoxygenated blood from the superior and inferior venae cavae enters the right atrium, passes through the three-flap tricuspid valve into the right ventricle, and pumps to the lungs through the pulmonary artery."
        },
        {
          target: { scene: "lab", part: "lv" },
          cue: "Left Pump · Systemic Circuit",
          say: "Now look at the anatomical left side: bright-red oxygenated blood returns from the lungs via the pulmonary veins into the left atrium, passes through the two-flap bicuspid mitral valve into the thick-walled left ventricle, and surges out through the arching aorta to the entire body!"
        },
        {
          target: "#lab",
          action: "lab:cutaway",
          cue: "3:1 Ventricular Wall Ratio!",
          say: "Watch the cut-away comparison: the left ventricle wall is fifteen millimetres thick — three times thicker than the five-millimetre right ventricle wall — because it must generate one hundred and twenty millimetres of mercury to pump blood from head to toe."
        },
        {
          target: "#lab",
          action: "lab:sprint",
          cue: "150 bpm Sprint & SAN Pacemaker!",
          say: "And when Tunde sprints four hundred metres at Surulere National Stadium, the sinoatrial node fires at one hundred and fifty beats per minute, boosting cardiac output above sixteen litres per minute!"
        }
      ]
    },
    {
      title: "The Surulere & LUTH Heart Mystery",
      steps: [
        {
          target: ".mystery-card",
          action: "lab:rest",
          cue: "Case File #HEART-05",
          say: "Every lesson connects to our Lagos investigation: why Tunde's left ventricular wall is three times thicker than his right, why blood pressure drops from one hundred and twenty in his aorta to near zero in his vena cava yet still climbs uphill from his ankles, and how LUTH doctors cross-match safe blood."
        },
        {
          target: ".stats",
          cue: "Where it is tested",
          say: "Heart chambers, the pulmonary artery and vein exception, blood vessels, blood clotting, and Paper 3 heart drawings are tested across Papers 1, 2, and 3."
        }
      ]
    },
    {
      title: "Your 5-Lesson Journey",
      steps: [
        {
          target: "#journey",
          cue: "5 Progressive 80-Minute Lessons",
          say: "Here is your five-lesson roadmap: Lesson 1 compares open versus closed and single versus double circulation; Lesson 2 dissects the four chambers, four valves, and coronary vessels; Lesson 3 explores the cardiac cycle, pacemaker, heart sounds, and blood pressure; Lesson 4 examines arteries, veins, capillaries, Starling filtration, and lymph; and Lesson 5 covers blood cells, the clotting cascade, ABO and Rhesus blood groups, and the WAEC Paper 3 practical."
        }
      ]
    },
    {
      title: "Interactive Explorer & Myths",
      steps: [
        {
          target: "#explorer",
          cue: "Interactive Cardiovascular Curves",
          say: "Use the interactive graph explorer to slide along the cardiac output curve, inspect the systemic pressure drop, or test capillary ultrafiltration and reabsorption."
        },
        {
          target: "#archetypes",
          cue: "6 calculation types",
          say: "We cover all six cardiovascular calculation types you will meet in the exam, with every step rendered in LaTeX and explained in plain English."
        },
        {
          target: ".finale",
          cue: "Start Lesson 1!",
          sparkle: true,
          say: "Whenever you are ready, tap Start Lesson 1 to join Tunde, Amaka, and Dr Bamidele at Surulere National Stadium and LUTH!"
        }
      ]
    }
  ]
};
