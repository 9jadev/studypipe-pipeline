/* Lesson 05 · WAEC Paper 3 Clinic: Slides, Biological Drawing and Magnification — content data and the 12 quiz questions */
(function () {
  "use strict";

  window.L05 = {
    // ---- 1. Examiner sort: will the examiner reward it? (bins: reward | penalise) ----
    items: [
      { id: "title", name: "A title written under the drawing", emo: "T", bin: "reward", why: "Rule 1: every drawing has a title under it, with the generic name starting with a capital letter." },
      { id: "mag", name: "Magnification stated under the drawing", emo: "×", bin: "reward", why: "Rule 2: write the magnification below the drawing, for example Mag. ×200. It is a ratio, so it has no unit." },
      { id: "guide-ok", name: "Ruled horizontal guidelines that touch the part", emo: "—", bin: "reward", why: "Rule 5: a guideline is a ruled, horizontal line that ends exactly on the part it names." },
      { id: "labels-ok", name: "Labels in the singular, in a neat column", emo: "A", bin: "reward", why: "Rule 6: write “Nucleus”, not “Nuclei”, and line the labels up one under another." },
      { id: "size-ok", name: "A drawing 6–8 cm long, as the paper instructed", emo: "cm", bin: "reward", why: "Rule 3: draw to the size the question asks for. Read the instruction every time." },
      { id: "shading", name: "Shading the cytoplasm to show depth", emo: "▒", bin: "penalise", why: "Rule 4: use clean, continuous pencil lines. Shading and colour are penalised." },
      { id: "cross", name: "Guidelines that cross each other", emo: "✕", bin: "penalise", why: "Rule 5: guidelines must never cross. Crossed lines make it unclear which label names which part." },
      { id: "arrow", name: "Arrowheads on the guidelines", emo: "→", bin: "penalise", why: "Rule 5: guidelines end on the part with no arrowhead." },
      { id: "mito", name: "“Mitochondria” labelled on an onion slide drawing", emo: "M", bin: "penalise", why: "Rule 9: label only what you can see. Mitochondria are not visible on an iodine-stained slide at ×400." },
      { id: "textbook", name: "Drawing the textbook differences instead of what is on the slide", emo: "B", bin: "penalise", why: "Rule 9: draw what you see. A textbook diagram is true for the textbook, but the examiner marks your slide." }
    ],

    // ---- 2. Slide bench: the four numbered method cards (text mirrored in index.html) and step captions ----
    stepText: {
      onion: [
        "Bench ready: onion scale, forceps, iodine, slide A and a cover slip.",
        "Method 1 · a drop of iodine goes on the slide.",
        "Method 1 · the forceps lay the thin inner peel in the iodine.",
        "Method 2 · the cover slip is held at an angle on the needle.",
        "Method 2 · the slip is lowered from one edge. Look at the eyepiece view.",
        "Tidy up: forceps go back to the tile."
      ],
      cheek: [
        "Bench ready: spatula, methylene blue, slide B and a cover slip.",
        "Method 3 · scrape the cheek gently and smear it on the slide.",
        "Method 3 · a drop of methylene blue goes on the smear.",
        "Method 3 · the cover slip is held at an angle on the needle.",
        "Method 3 · the slip is lowered. Look at the eyepiece view.",
        "Method 3 · the used spatula goes into the disinfectant."
      ]
    },

    // ---- 3. Magnification explorer: a 1.2 cm specimen, instruction 6–8 cm ----
    specimen_cm: 1.2,
    band_cm: [6, 8],
    mags: [4, 5, 6, 7],

    // ---- 4. Drawing audit: the nine rules (marks add to 10; rule 5 carries 2) ----
    rules: [
      { id: "r1", n: 1, name: "Title under the drawing", marks: 1 },
      { id: "r2", n: 2, name: "Magnification stated, no unit", marks: 1 },
      { id: "r3", n: 3, name: "Size as instructed (6–8 cm)", marks: 1 },
      { id: "r4", n: 4, name: "Sharp lines, no shading", marks: 1 },
      { id: "r5", n: 5, name: "Guidelines ruled, horizontal, touching, never crossing, no arrowheads", marks: 2 },
      { id: "r6", n: 6, name: "Labels singular, in a column", marks: 1 },
      { id: "r7", n: 7, name: "Spelling and capital letters correct", marks: 1 },
      { id: "r8", n: 8, name: "Double lines where walls or cut surfaces meet", marks: 1 },
      { id: "r9", n: 9, name: "Draw what you see, label what you see", marks: 1 }
    ],
    drawings: [
      {
        id: "d1", title: "Chinedu’s drawing 1 · onion epidermis (two adjacent cells)",
        pass: { r1: true, r2: true, r3: false, r4: false, r5: false, r6: false, r7: true, r8: true, r9: false },
        why: {
          r1: "The title is under the drawing: Onion epidermal cells.",
          r2: "“Mag. ×250” is under the drawing, with no unit.",
          r3: "The drawing is only 3 cm long, but the paper asked for 6–8 cm.",
          r4: "The cytoplasm is shaded with dark pencil. Use clean lines only.",
          r5: "One guideline ends in an arrowhead and it crosses another guideline. Rule it straight, horizontal, touching the part, no arrowhead (worth 2 marks).",
          r6: "“Nuclei” is plural. Each label must be a single noun, “Nucleus”, lined up in a column.",
          r7: "Every word is spelt correctly and the capital letters are right.",
          r8: "The wall shared by the two cells is drawn as a double line.",
          r9: "“Mitochondrion” and “chloroplast” are labelled. The first is not visible on an iodine slide, and onion bulb cells have no chloroplasts."
        }
      },
      {
        id: "d2", title: "Chinedu’s drawing 2 · human cheek cell",
        pass: { r1: true, r2: false, r3: true, r4: true, r5: true, r6: true, r7: false, r8: true, r9: false },
        why: {
          r1: "The title is under the drawing: Human cheek cell.",
          r2: "There is no magnification under the drawing. Add Mag. ×… with no unit.",
          r3: "The drawing is 7.2 cm long, inside the 6–8 cm instruction.",
          r4: "The lines are clean and continuous, with no shading.",
          r5: "All guidelines are ruled, horizontal, touch the part, do not cross and have no arrowheads.",
          r6: "Every label is a single noun and the labels line up in a column.",
          r7: "“Nucleous” is misspelt. It should be “Nucleus”.",
          r8: "This is one cell with one clean outline. Nothing is cut, so a single line is correct.",
          r9: "“Mitochondrion” is labelled, but it cannot be seen on a methylene-blue slide at ×400."
        }
      }
    ],

    // ---- 5. Results table: Feature / Onion (A) / Cheek (B). Choice lists; the expected answer is computed from the bench model ----
    tableRows: [
      { id: "shape", feature: "Shape of cell", a: ["Regular, box-like", "Irregular, rounded"], pick: "shape" },
      { id: "wall", feature: "Cell wall", a: ["Present", "Absent"], pick: "wall" },
      { id: "nucleus", feature: "Position of nucleus", a: ["At the side", "Central"], pick: "nucleus" },
      { id: "vacuole", feature: "Vacuole", a: ["Large, visible", "Not visible"], pick: "vacuole" },
      { id: "stain", feature: "Colour of stain", a: ["Yellow-brown (iodine)", "Blue (methylene blue)"], pick: "stain" }
    ]
  };

  // ---- 6. The 12 quiz questions (03-questions.md § Lesson 05, keys unchanged) ----
  window.LESSON_QUIZ = [
    {
      "q": "In the school laboratory at Enugu, Ngozi places a strip of onion epidermis in a drop of iodine solution on a slide. She touches one edge of the cover slip to the liquid and slowly lowers it at about 45° using a mounted needle. What is the main reason for lowering the cover slip this way?",
      "o": [
        "To spread the iodine stain evenly over the cells",
        "To stop the cover slip from cracking under its own weight",
        "To push air out ahead of the liquid so that no air bubbles are trapped",
        "To flatten the cells so that the nucleus is pushed to the centre"
      ],
      "a": 2,
      "e": "Lowering the cover slip gently at an angle lets the liquid spread across under it and drive air out to the side, so no air bubbles are trapped. Air bubbles look like dark-rimmed circles that hide cells and are often mistaken for cells. Option A is the main distractor: the stain spreads by itself in the drop; the angle has nothing to do with the stain. The nucleus of an onion cell stays at the side, pushed there by the large vacuole, so option D is also wrong.",
      "src": "WAEC Practical"
    },
    {
      "q": "Before viewing an onion epidermis under the microscope, Tunde adds a drop of dilute iodine solution. Which statement best explains why he stains the specimen?",
      "o": [
        "Onion epidermal cells are almost transparent; iodine colours the nucleus and cytoplasm so they stand out clearly",
        "Iodine kills the cells so that they stop moving on the slide",
        "Iodine turns the chloroplasts of the onion cells green so they can be seen",
        "Iodine makes the cells larger so that a lower magnification can be used"
      ],
      "a": 0,
      "e": "The thin epidermis is almost colourless. Iodine stains the nucleus and cytoplasm yellow-brown, which gives contrast so that the nucleus, cell wall and cytoplasm can be seen and drawn. Option C is the main distractor: onion bulb cells have <strong>no</strong> chloroplasts (bulb scales develop in the dark), and iodine stains yellow-brown, not green. Onion cells do not move, so B is wrong, and a stain does not change cell size (D).",
      "src": "WAEC Practical"
    },
    {
      "q": "Ifeoma's onion slide shows dark, overlapping layers of cells. She cannot focus clearly on any single cell, even on low power. Which preparation error most likely caused this?",
      "o": [
        "She used methylene blue instead of iodine",
        "She lowered the cover slip at an angle of 45°",
        "She viewed the slide on low power before high power",
        "She cut a thick piece of the fleshy scale leaf, or let the thin peel fold over, instead of laying a single flat layer of epidermis"
      ],
      "a": 3,
      "e": "A good onion slide uses the thin inner epidermis, which is one cell thick, laid flat in the stain. A thick slice or a folded peel puts several layers of cells on top of one another, so the cells overlap and look dark, and no single layer can be brought into focus. Option A is the main distractor: methylene blue would only change the colour of the stain; it would not make the cells overlap. Options B and C are correct practice, not errors.",
      "src": "WAEC Practical"
    },
    {
      "q": "Dr Amaka returns Chinedu's drawing of Specimen A (onion epidermis). It has the title \"Onion epidermal cells\", is 7 cm long, and states \"Mag. ×250\" below it. Its guidelines are ruled and horizontal, but each guideline ends in an arrowhead pointing at the part. Which part of the drawing will lose marks?",
      "o": [
        "The title, because it should be written above the drawing",
        "The arrowheads on the guidelines",
        "The magnification, because it should be written as \"×250 cm\"",
        "The size, because a cell drawing must be at least 10 cm long"
      ],
      "a": 1,
      "e": "WAEC guidelines are ruled straight lines that end touching the part, with <strong>no arrowheads</strong>. Option C is the main distractor: drawing magnification is a ratio of two lengths in the same units, so it has <strong>no unit</strong>; \"×250\" is correct. The title is usually written below the drawing (A is wrong), and 7 cm is within the usual 6–8 cm instruction (D is wrong).",
      "src": "WAEC Practical"
    },
    {
      "q": "Which of the following titles and labels for a Paper 3 drawing would earn full credit?",
      "o": [
        "Title: \"a filament of spirogyra\"; label: \"Chloroplasts\"",
        "Title: \"A Filament of Spirogyra ×150 mm\"; label: \"Nuclei\"",
        "Title: \"A filament of <em>Spirogyra</em>\", with \"Mag. ×150\" below it; label: \"Chloroplast\"",
        "Title: \"Spirogyra cells (diagram from textbook)\"; label: \"pyrenoids\""
      ],
      "a": 2,
      "e": "A generic name starts with a capital letter (<em>Spirogyra</em>), magnification has no unit, and each label is written in the <strong>singular</strong> (\"Chloroplast\", \"Nucleus\"). Option B is the main distractor: it puts a unit (mm) on the magnification and uses a plural label (\"Nuclei\"). Option A has a small letter on the generic name and a plural label. Option D breaks the rule that you draw only the specimen you actually observe, never a copy from a book, and it also uses a plural label.",
      "src": "WAEC-style"
    },
    {
      "q": "Specimen A is an iodine-stained onion epidermis and Specimen B is a methylene-blue cheek cell smear, both viewed with a school light microscope at ×400. Which of these is an <strong>observable</strong> difference that would score in Paper 3?",
      "o": [
        "A has mitochondria; B has no mitochondria",
        "A has a regular, box-like shape with a visible cell wall; B has an irregular shape with no cell wall",
        "A has ribosomes attached to its endoplasmic reticulum; B has free ribosomes",
        "B has centrioles visible beside its nucleus; A has none"
      ],
      "a": 1,
      "e": "\"Observable\" means what you can actually see on the slides in front of you. The box-like shape and cell wall of the onion cell, and the irregular shape of the cheek cell with no wall, are clearly visible at ×400. Option A is the main distractor and is doubly wrong: both cells have mitochondria, and mitochondria cannot be seen on a school light-microscope slide. Ribosomes, ER and centrioles (C, D) are also too small to be seen, so they score zero.",
      "src": "WAEC Practical"
    },
    {
      "q": "Halima notices that the nucleus of each onion cell on her slide lies close to the cell wall, while the nucleus of each cheek cell lies near the middle. What best explains the position of the onion cell nucleus?",
      "o": [
        "The iodine stain pulls the nucleus towards the cell wall",
        "The onion cell has no cytoplasm, so the nucleus rests on the wall",
        "The cover slip pressed the nucleus to one side",
        "A large central vacuole fills most of the onion cell and pushes the cytoplasm and nucleus to the side"
      ],
      "a": 3,
      "e": "A mature plant cell has a large sap vacuole that takes up most of its volume, so the cytoplasm forms a thin layer and the nucleus is pushed to the side. A cheek cell has no large vacuole, so its nucleus is central. Option C is the main distractor: a correctly lowered cover slip does not move the nucleus, and the pattern is seen in every onion cell on the slide. A stain does not move organelles (A), and the onion cell does have cytoplasm (B).",
      "src": "WAEC Practical"
    },
    {
      "q": "Femi measures a cheek cell with an eyepiece graticule and finds that it is 0.06 mm across. In his drawing the same cell is 72 mm across. What is the magnification of his drawing?",
      "o": [
        "×1200",
        "×120",
        "×12",
        "×4.32"
      ],
      "a": 0,
      "e": "<code>M = drawing length ÷ actual length = 72 mm ÷ 0.06 mm = 1200</code>, so <code>M = × 1200</code> (no unit, because mm cancel). Both lengths are already in mm. Option D is the main distractor: it comes from <strong>multiplying</strong> 72 × 0.06 instead of dividing. Options B and C come from slipping a decimal place.",
      "src": "WAEC Practical"
    },
    {
      "q": "Chiamaka's drawing of an onion epidermal cell is 54 mm long, and she has written \"Mag. ×300\" under it. What is the actual length of the cell?",
      "o": [
        "0.018 mm",
        "1.8 mm",
        "0.18 mm",
        "16 200 mm"
      ],
      "a": 2,
      "e": "<code>actual length = drawing length ÷ M = 54 mm ÷ 300 = 0.18 mm</code> (= 180 µm). Option D is the main distractor: it multiplies the drawing length by the magnification (54 × 300) instead of dividing. Options A and B are decimal-place slips.",
      "src": "WAEC Practical"
    },
    {
      "q": "A question paper says: \"Draw a piece of onion scale leaf (Specimen C), 1.2 cm long, making your drawing 8–10 cm long.\" Which magnification should Emeka use so that his drawing meets the size instruction?",
      "o": [
        "×5",
        "×6",
        "×9",
        "×7.5"
      ],
      "a": 3,
      "e": "drawing length <code>= M × actual length</code>. For ×7.5: <code>7.5 × 1.2 cm = 9.0 cm</code>, which lies between 8 and 10 cm. Check the others: ×5 gives 6.0 cm and ×6 gives 7.2 cm (both too small); ×9 gives 10.8 cm (too large). Option B is the main distractor: 7.2 cm would satisfy the common 6–8 cm instruction but <strong>not</strong> this paper's 8–10 cm instruction, so always read the size the question asks for.",
      "src": "WAEC Practical"
    },
    {
      "q": "Coach Danjuma tells Chinedu to label chloroplasts on his onion epidermis drawing \"because all plant cells make food\". Why is this advice wrong?",
      "o": [
        "Onion bulb scales form below the soil, where no light reaches them, so their cells never develop chloroplasts",
        "Iodine destroys chloroplasts during staining",
        "Chloroplasts are found only in animal cells",
        "Chloroplasts are present but are too small to see with any microscope"
      ],
      "a": 0,
      "e": "Chloroplasts develop in plant cells that are exposed to light. The fleshy scale leaves of an onion bulb grow underground in darkness, so their cells have none, just like root cells. Option D is the main distractor: chloroplasts are large enough to be seen with a light microscope (for example in <em>Spirogyra</em> or a leaf cell); the onion cells simply do not have them. Iodine does not destroy chloroplasts (B), and animal cells never have chloroplasts (C).",
      "src": "WAEC-style"
    },
    {
      "q": "Why should mitochondria NOT be labelled on a drawing of a cheek cell made from a school light-microscope slide?",
      "o": [
        "Cheek cells do not contain mitochondria",
        "On an iodine- or methylene-blue-stained slide at ×400, mitochondria are too small and unstained to be made out clearly, so they are not visible on the slide",
        "Methylene blue dissolves the mitochondria",
        "Mitochondria are found only in plant cells"
      ],
      "a": 1,
      "e": "You must label only what you can see. Keep two cases apart. Ribosomes (about 0.025 µm) are below the light microscope's resolving limit of about 0.2 µm, so no light microscope can ever show them. Mitochondria and Golgi bodies are larger (a few µm), but iodine and methylene blue do not colour them, so at ×400 they cannot be picked out; special stains or an electron microscope are needed. Option A is the main distractor: cheek cells <strong>do</strong> have mitochondria, as all living animal cells do; they are simply not visible. Mitochondria are found in both plant and animal cells (D is wrong), and the stain does not dissolve them (C).",
      "src": "WAEC-style"
    }
  ];
})();
