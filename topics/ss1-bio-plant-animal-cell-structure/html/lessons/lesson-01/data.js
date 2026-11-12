/* Lesson 01 · Discovering the Cell: Microscopes, Cell Theory and Prokaryotes vs Eukaryotes
   Content data: sort items, microscope constants, explorer pins, bridge questions, and the 12 exam-style quiz questions.
   Every microscope number below is COMPUTED (eyepiece x objective, field = 160 / M, width = field / cells), never typed as a result. */
(function () {
  "use strict";

  window.L01 = {
    /* ---- 2A. Sort game: who discovered what? (9 cards, 3 bins) ---- */
    bins: {
      hooke: "Robert Hooke (1665)",
      dujardin: "Félix Dujardin (1835)",
      "schleiden-schwann": "Schleiden (1838) and Schwann (1839)"
    },
    items: [
      { id: "named-cells", name: "Named the box-like spaces in cork “cells”", emo: "📦", bin: "hooke", why: "Hooke looked at a thin slice of cork in 1665 and called the little box-like spaces cells." },
      { id: "dead-cork", name: "Looked at the walls of dead cork", emo: "🪵", bin: "hooke", why: "Cork is dead bark, so Hooke saw only the empty walls that once surrounded living cells." },
      { id: "own-scope", name: "Used an early compound microscope that he improved himself", emo: "🔭", bin: "hooke", why: "Hooke built and improved his own compound microscope before he examined the cork." },
      { id: "living-jelly", name: "First reported the living jelly that fills cells", emo: "🫧", bin: "dujardin", why: "Dujardin (1835) saw that cells hold a living, jelly-like material, not just walls." },
      { id: "sarcode", name: "Called that jelly “sarcode”", emo: "🏷️", bin: "dujardin", why: "Sarcode was Dujardin’s name for the living material inside the cell." },
      { id: "living-material", name: "Showed that cells contain living material, not just walls", emo: "💧", bin: "dujardin", why: "This was the step beyond Hooke: the cell is alive inside, not merely an empty box." },
      { id: "all-plants", name: "Concluded that every plant is built of cells", emo: "🌿", bin: "schleiden-schwann", why: "Schleiden, studying plants in 1838, concluded that plants are made of cells." },
      { id: "all-animals", name: "Extended the idea to every animal", emo: "🐐", bin: "schleiden-schwann", why: "Schwann, in 1839, showed that animal tissues are made of cells too." },
      { id: "together", name: "Together laid the base of the cell theory", emo: "🧱", bin: "schleiden-schwann", why: "Plants (Schleiden) plus animals (Schwann) together gave the foundation of the cell theory." }
    ],

    /* ---- 2B. Microscope bench: constants used by the explorer and the answer table (all derived) ---- */
    eyepiece: 10,
    objectives: [4, 10, 40],
    fieldConstant: 160,           /* field diameter (mm) = 160 / total magnification at eyepiece x10, the scope's model */
    cellWidthMm: { cork: 0.050, onion: 0.050, blood: 0.008 },
    slideNames: { cork: "Cork", onion: "Onion peel", blood: "Blood smear" },
    slideNotes: {
      cork: "dead cells: empty walls only",
      onion: "living cells with walls, nucleus stained by iodine",
      blood: "round cells, no wall, no nucleus"
    },

    /* ---- 3. Explorer: image size of a 50 µm cell (computed from M x width) ---- */
    pins: [
      { obj: 4, note: "Wide field, so you can find the specimen first. The cell is tiny in the image." },
      { obj: 10, note: "A medium view. Nuclei begin to show on a stained onion peel." },
      { obj: 40, note: "A narrow field, so only a few cells fit. Focus with the fine knob only." }
    ],

    /* ---- 4. Bridge: the two unlabelled slides from the story ---- */
    bridge: {
      slides: [
        { id: "P", slide: "blood" },
        { id: "Q", slide: "onion" }
      ],
      q1: {
        text: "Which slide is the ugu leaf peel?",
        opts: ["Slide P: round cells, no walls", "Slide Q: regular box-shaped cells with walls"],
        a: 1,
        why: "Plant cells such as ugu have a cell wall, so they look like neat boxes. Slide P has round cells with no walls: that is the blood smear."
      },
      q2: {
        text: "On Slide P at ×400 the field is 0.40 mm wide and 50 red cells lie across it. About how wide is one red cell?",
        opts: ["0.8 µm", "8 µm", "80 µm", "800 µm"],
        a: 1,
        fieldMm: 0.40,
        cells: 50,
        why: "Cell width = 0.40 mm ÷ 50 = 0.008 mm, and 0.008 × 1000 = 8 µm. Choosing 0.8 µm or 80 µm means a slip of ×10 in the conversion."
      }
    },

    /* ---- 5. Self-rating items (I can, 1 to 4) ---- */
    can: [
      "I can state the three ideas of the cell theory.",
      "I can name four scientists and say what each contributed.",
      "I can calculate total magnification.",
      "I can find the actual size of a cell in µm.",
      "I can compare prokaryotic and eukaryotic cells."
    ]
  };

  /* ---- 12 exam-style questions, wording and keys from 03-questions.md § Lesson 01 ---- */
  window.LESSON_QUIZ =
[
    {
      "q": "At Mile 12 Market, Chinedu tells Mama Ngozi that Robert Hooke \"saw cells\" in a thin slice of cork in 1665. Which statement best describes what Hooke actually saw?",
      "o": [
        "Living cells, each with a clear nucleus",
        "The jelly-like living material he called \"sarcode\"",
        "The empty box-like walls of dead cork cells",
        "Bacteria swimming between the cork fibres"
      ],
      "a": 2,
      "e": "Cork is dead bark tissue, so Hooke saw only the empty walls that once surrounded living cells; he named these box-like spaces \"cells\". Option B is the main trap: the living jelly (\"sarcode\") was described by Félix Dujardin in 1835, about 170 years later, not by Hooke.",
      "src": "WAEC-style · Understand"
    },
    {
      "q": "Which scientist first described the living, jelly-like contents of cells and named this material \"sarcode\"?",
      "o": [
        "Félix Dujardin",
        "Matthias Schleiden",
        "Theodor Schwann",
        "Robert Hooke"
      ],
      "a": 0,
      "e": "Dujardin (1835) showed that cells contain living material, not just walls, and called it sarcode. Schleiden (1838) and Schwann (1839) are remembered for stating that plants and animals respectively are made of cells; Hooke only named the empty compartments in dead cork.",
      "src": "NECO-style · Remember"
    },
    {
      "q": "The cell theory grew from the work of Schleiden on plants (1838) and Schwann on animals (1839). Which of the following is NOT a statement of the cell theory?",
      "o": [
        "Every organism consists of one cell or of many cells.",
        "Organisms are built from cells, and cells carry out their life processes.",
        "New cells form only when existing cells divide.",
        "Every cell contains a nucleus that controls its activities."
      ],
      "a": 3,
      "e": "The cell theory makes no claim that every cell has a nucleus, and such a claim would be false: bacteria (prokaryotes) have no true nucleus, and a mature human red blood cell has lost its nucleus. Options A, B and C are the three accepted ideas (C is credited to Virchow, 1855). Candidates often pick C as \"not part of it\" because it was added later, but it is part of the modern theory.",
      "src": "JAMB-style · Understand"
    },
    {
      "q": "Which of the following best defines an organelle?",
      "o": [
        "The smallest unit of a living organism that can carry out all life processes",
        "A tiny part inside the cytoplasm that is specialised to do one particular job for the cell",
        "A group of similar cells working together to perform one function",
        "The jelly-like fluid that fills the space between the nucleus and the membrane"
      ],
      "a": 1,
      "e": "An organelle is a specialised part inside a cell (e.g. mitochondrion, chloroplast) with a definite job. Option A is the definition of a cell, the commonest mix-up; C defines a tissue; D describes cytoplasm, which is not itself an organelle.",
      "src": "WAEC-style · Remember"
    },
    {
      "q": "Dr Amaka shows her class a single Amoeba in a drop of pond water from Badagry. On its own it feeds, respires, excretes, responds to light and divides. This observation best supports the idea that the cell is",
      "o": [
        "the basic unit of life: the smallest part of an organism that is both its building block (structure) and its working unit (function)",
        "always one part of a larger tissue",
        "made only of organelles, with no cytoplasm",
        "a building block (structure) of life but not a working unit (function)"
      ],
      "a": 0,
      "e": "One Amoeba is one cell, yet it carries out every life process, so the cell is both the building block and the working unit of life. Option D is the trap: the evidence here is all about functions (feeding, respiring), so it shows the cell is a working unit as well as a building block. Option B is wrong because Amoeba is free-living, not part of a tissue.",
      "src": "NECO-style · Understand"
    },
    {
      "q": "At the LUTH teaching laboratory, a student uses a microscope with a ×8 eyepiece and a ×40 objective. What is the total magnification?",
      "o": [
        "×48",
        "×5",
        "×3200",
        "×320"
      ],
      "a": 3,
      "e": "Total magnification = eyepiece × objective = 8 × 40 = ×320. Option A (×48) comes from adding the two powers, the classic examiner trap; lenses in series multiply each other's effect. Option B divides 40 by 8, and C has a misplaced zero.",
      "src": "WAEC Practical · Apply"
    },
    {
      "q": "Having focused an onion peel on the ×4 objective, Chinedu turns to the ×40 objective. Which knob should he now use to focus, and why?",
      "o": [
        "The coarse adjustment knob, because it brings the image into view faster",
        "The fine adjustment knob, because the ×40 objective sits very close to the slide and could crack it if moved a lot",
        "The coarse adjustment knob, because the ×40 lens needs a large movement to focus",
        "The fine adjustment knob, because it changes the magnification of the eyepiece"
      ],
      "a": 1,
      "e": "The high-power objective has a very short working distance, so only the small movements of the fine knob are safe; large coarse-knob turns can drive the lens into the slide and damage both. Option D is wrong because no focusing knob changes magnification; magnification is set by the lenses chosen.",
      "src": "WAEC Practical · Understand"
    },
    {
      "q": "At ×100, the field of view of a microscope is 1.2 mm in diameter. Fifteen cheek cells lie end to end across it. What is the approximate length of one cheek cell?",
      "o": [
        "18 µm",
        "8 µm",
        "80 µm",
        "800 µm"
      ],
      "a": 2,
      "e": "Cell length = field diameter ÷ number of cells = 1.2 mm ÷ 15 = 0.08 mm; 0.08 mm × 1000 = 80 µm. Option B (8 µm) comes from multiplying by 100 instead of 1000 when converting; remember 1 mm = 1000 µm. Option A comes from multiplying 1.2 by 15.",
      "src": "WAEC-style · Apply"
    },
    {
      "q": "A photomicrograph of a ugu leaf cell taken at ×450 shows the cell as 18 mm long. What is the actual length of the cell?",
      "o": [
        "4 µm",
        "40 µm",
        "400 µm",
        "8100 µm"
      ],
      "a": 1,
      "e": "Actual size = image size ÷ magnification = 18 mm ÷ 450 = 0.04 mm; 0.04 mm × 1000 = 40 µm. Option D comes from multiplying 18 × 450 = 8100, which makes the real cell larger than its photograph, which is impossible. Options A and C are conversion slips by a factor of ten.",
      "src": "NECO-style · Apply"
    },
    {
      "q": "A cheek cell with an actual length of 0.07 mm is drawn 28 mm long in a practical notebook. What is the magnification of the drawing?",
      "o": [
        "×400",
        "400 mm",
        "×40",
        "×0.0025"
      ],
      "a": 0,
      "e": "Magnification = drawing length ÷ actual length = 28 mm ÷ 0.07 mm = ×400. Both lengths are in mm, so the units cancel and the answer has no unit; option B (400 mm) loses the mark for attaching a unit. Option D (0.07 ÷ 28 = 0.0025) divides the wrong way round.",
      "src": "JAMB-style · Apply"
    },
    {
      "q": "A swab from a hospital ward at LUTH contains cells with a cell wall, ribosomes, and a single loop of circular DNA lying free in the cytoplasm. No nuclear membrane or mitochondria can be found. The cells are most likely",
      "o": [
        "yeast cells",
        "onion epidermal cells",
        "bacteria",
        "human red blood cells"
      ],
      "a": 2,
      "e": "Circular DNA free in the cytoplasm, no nuclear membrane and no membrane-bound organelles such as mitochondria are the marks of a prokaryote, i.e. a bacterium. Yeast (A) and onion cells (B) also have cell walls, but they are eukaryotes with a nucleus and mitochondria; the wall alone cannot identify a prokaryote. Red blood cells (D) have no wall.",
      "src": "WAEC-style · Analyse"
    },
    {
      "q": "Which structure is found in BOTH prokaryotic and eukaryotic cells?",
      "o": [
        "Nuclear membrane",
        "Mitochondria",
        "Endoplasmic reticulum",
        "Ribosomes"
      ],
      "a": 3,
      "e": "All cells make proteins, so both prokaryotes and eukaryotes have ribosomes; prokaryotic ribosomes are smaller. A nuclear membrane, mitochondria and endoplasmic reticulum are membrane-bound structures found only in eukaryotes. Ribosomes themselves have no membrane, which is why prokaryotes can have them.",
      "src": "JAMB-style · Analyse"
    }
  ];
})();
