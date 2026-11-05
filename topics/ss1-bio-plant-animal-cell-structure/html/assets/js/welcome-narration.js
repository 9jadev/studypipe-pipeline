/* ==========================================================
   StudyPipe — Welcome Hub Guided Narrator Tour (Plant & Animal Cell Structure, en-NG)
   ========================================================== */
window.NARRATION = {
  rate: 0.96,
  pitch: 1.01,

  actions: {
    "lab:iso":   function () { if (window.StudyLab) window.StudyLab.setMode("isotonic"); },
    "lab:hypo":  function () { if (window.StudyLab) window.StudyLab.setMode("hypotonic"); },
    "lab:hyper": function () { if (window.StudyLab) window.StudyLab.setMode("hypertonic"); }
  },

  script: [
    {
      title: "Welcome & 3D Twin-Cell Lab",
      steps: [
        {
          target: ".hero-title",
          cue: "SS1 Biology · 5-Lesson Unit",
          sparkle: true,
          say: "Welcome to Plant and Animal Cell Structure, Organisation, and Microscopy! In this five-lesson unit, we will explore living cells in 3D, work through every WAEC, NECO, and JAMB calculation step by step, and master the Paper 3 wet-mount practical."
        },
        {
          target: { scene: "lab", part: "plantCell" },
          action: "lab:iso",
          cue: "3D Plant Palisade Cell",
          say: "Look at the left side of our live 3D Hero Stage: a cut-away Plant Cell bounded by a rigid green cellulose cell wall, with a large central sap vacuole surrounded by its tonoplast, green chloroplasts, and a nucleus pushed to the side."
        },
        {
          target: { scene: "lab", part: "animalCell" },
          cue: "3D Animal Cell & Red Blood Cell",
          say: "On the right is an Animal Cell: it has a flexible lipoprotein plasma membrane, a central nucleus, a pair of cylindrical centrioles, and no cell wall."
        },
        {
          target: "#lab",
          action: "lab:hypo",
          cue: "Pure Water Osmosis Test!",
          say: "Watch what happens when we flood both cells with pure distilled water: the plant cell swells into firm turgidity because its cellulose wall resists bursting, while the red blood cell swells and bursts in haemolysis."
        },
        {
          target: "#lab",
          action: "lab:hyper",
          cue: "Concentrated Salt Test!",
          say: "And in concentrated salt water, the plant cell's protoplasm pulls inward away from its wall in plasmolysis, while the red blood cell shrinks and wrinkles in crenation."
        }
      ]
    },
    {
      title: "The Mile 12 & LUTH Mystery",
      steps: [
        {
          target: ".mystery-card",
          action: "lab:iso",
          cue: "Case File #CELL-05",
          say: "Every lesson connects to our Nigerian mystery: why sprinkling pure borehole water rescues Mama Nkechi's wilted ugu leaves at Mile 12 Market, yet the exact same pure water destroys a patient's red blood cell smear at LUTH Idi-Araba."
        },
        {
          target: ".stats",
          cue: "Where it is tested",
          say: "Cell structure, osmosis, levels of organisation, and specimen drawing are tested in both the written papers and the Paper 3 practical."
        }
      ]
    },
    {
      title: "Your 5-Lesson Journey",
      steps: [
        {
          target: "#journey",
          cue: "5 Progressive 80-Minute Lessons",
          say: "Here is your five-lesson roadmap: Lesson 1 covers the Cell Theory pioneers, prokaryotes versus eukaryotes, and magnification; Lesson 2 dissects every eukaryotic organelle; Lesson 3 explores Amoeba, Paramecium, Euglena, Volvox, Spirogyra, and surface-area-to-volume ratios; Lesson 4 masters diffusion, osmosis, turgor, and haemolysis; and Lesson 5 prepares you for the WAEC Paper 3 microscopy and biological drawing exam."
        }
      ]
    },
    {
      title: "Interactive Explorer & Myths",
      steps: [
        {
          target: "#explorer",
          action: "combo:osmometry",
          cue: "Interactive Cytology Curves",
          say: "Use the interactive graph explorer to slide along the magnification line, find the isotonic point where percentage mass change is zero, or test the surface-area-to-volume hyperbola."
        },
        {
          target: "#archetypes",
          cue: "6 calculation types",
          say: "We cover all six calculation types you will meet in the exam. Every worked example is broken into steps, with a plain-English note under each line."
        },
        {
          target: ".finale",
          cue: "Start Lesson 1!",
          sparkle: true,
          say: "Whenever you are ready, tap Start Lesson 1 to step into Mile 12 Market and Robert Hooke's 1665 microscope laboratory!"
        }
      ]
    }
  ]
};
