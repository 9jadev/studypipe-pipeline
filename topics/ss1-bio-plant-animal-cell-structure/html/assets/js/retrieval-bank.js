/* ==========================================================
   StudyPipe — Spaced Retrieval Bank · Plant and Animal Cells (L1–L5)
   Read by LessonKit in lessons/lesson-01 .. lesson-05 (classic script, offline).
   donow  : 4 warm-up cards per lesson (from: 0 = prerequisite, from: N = Lesson N;
            sec = the section id in that earlier lesson the "Revisit" link opens)
   quiz   : review MCQs from earlier lessons, appended after the lesson's own quiz
   recall : blank-page recall prompt + the key points to tick off
   Content matches 02-lesson.md (Do Now and Recall lists) — all original wording.
   ========================================================== */
window.RETRIEVAL_BANK = {
  l01: {
    title: "Discovering the Cell: Microscopes, Cell Theory and Prokaryotes vs Eukaryotes",
    donow: [
      {
        from: 0, sec: "concepts", where: "Living things",
        q: "List four characteristics that every living thing shows.",
        a: "Any four of: <strong>nutrition, respiration, movement, growth, reproduction, excretion, irritability (sensitivity)</strong>."
      },
      {
        from: 0, sec: "concepts", where: "Units of length",
        q: "How many micrometres (µm) are in 1 millimetre?",
        a: "<strong>1 mm = 1000 µm</strong>, so to turn millimetres into micrometres you multiply by 1000."
      },
      {
        from: 0, sec: "examples", where: "Decimals",
        q: "Calculate 0.25 × 400 and 24 ÷ 400.",
        a: "<strong>0.25 × 400 = 100</strong> and <strong>24 ÷ 400 = 0.06</strong>."
      },
      {
        from: 0, sec: "practical", where: "Hand lens",
        q: "What does a hand lens do to an object's image?",
        a: "It makes the image <strong>appear larger</strong> (it magnifies it), so we can see more detail."
      }
    ],
    quiz: [],
    recall: {
      prompt: "Close your notes. Write down everything you remember from Lesson 1, then tick each point below that you wrote, even in your own words:",
      points: [
        "The cell theory: every organism is made of one cell or many cells; cells are the building blocks of organisms and carry out their life processes; new cells form only when existing cells divide.",
        "Hooke (1665) looked at cork and named the empty box-like walls of dead cells \"cells\".",
        "Dujardin (1835) described the living jelly inside cells; Schleiden (1838) said plants are made of cells and Schwann (1839) said animals are too.",
        "Total magnification = eyepiece × objective (multiply, never add).",
        "Actual size = image size ÷ magnification, and 1 mm = 1000 µm.",
        "A prokaryote (e.g. a bacterium) has no nucleus and no membrane-bound organelles; its DNA lies free in the cytoplasm."
      ]
    }
  },

  l02: {
    title: "Inside the Cell: Organelles, Plant vs Animal Cells",
    donow: [
      {
        from: 1, sec: "concepts", where: "Cell theory",
        q: "State the three ideas of the cell theory.",
        a: "(1) Every organism consists of <strong>one cell or many cells</strong>. (2) Organisms are <strong>built from cells</strong>, and cells carry out their life processes. (3) New cells form <strong>only when existing cells divide</strong>."
      },
      {
        from: 1, sec: "examples", where: "Total magnification",
        q: "What is the total magnification with a ×10 eyepiece and a ×40 objective?",
        a: "Multiply the two lenses: <strong>10 × 40 = ×400</strong> (never add them)."
      },
      {
        from: 1, sec: "concepts", where: "Prokaryotes",
        q: "Name one structure that a prokaryote lacks.",
        a: "A <strong>nuclear membrane</strong> (true nucleus), or any <strong>membrane-bound organelle</strong> such as a mitochondrion."
      },
      {
        from: 1, sec: "sort", where: "Hooke and cork",
        q: "What did Robert Hooke actually see in his slice of cork?",
        a: "The <strong>empty walls of dead cells</strong>. Cork is dead tissue, so there was no living material inside."
      }
    ],
    quiz: [
      {
        from: 1,
        q: "A student's microscope has a ×15 eyepiece and a ×10 objective. What is the total magnification?",
        o: ["×25", "×150", "×1.5", "×1500"],
        a: 1,
        e: "Total magnification = eyepiece × objective = 15 × 10 = ×150. Adding the powers (×25) is the classic trap."
      },
      {
        from: 1,
        q: "Which of these is found in a bacterium?",
        o: ["A nucleus with a nuclear membrane", "Mitochondria", "Ribosomes", "A Golgi body"],
        a: 2,
        e: "Ribosomes have no membrane, and prokaryotes such as bacteria have them (smaller ones). A true nucleus, mitochondria and a Golgi body are all membrane-bound, so bacteria lack them."
      }
    ],
    recall: {
      prompt: "Close your notes. Write down everything you remember from Lesson 2, then tick each point below that you wrote:",
      points: [
        "Nucleus: controls the cell and carries its inherited instructions. Mitochondrion: releases energy in aerobic respiration. Chloroplast: traps light to make food.",
        "Rough ER carries materials and is studded with ribosomes; ribosomes make proteins; the Golgi body sorts, packs and sends out products; lysosomes hold digestive enzymes.",
        "Double membrane: nucleus, mitochondrion, chloroplast. Single membrane: lysosome, vacuole (tonoplast), ER, Golgi body. No membrane: ribosome, centrioles. The cell wall is not a membrane.",
        "Plant-only: cellulose cell wall, chloroplasts, large central sap vacuole. Safest animal-only answers: centrioles and glycogen granules.",
        "Cell wall: cellulose, fully permeable, rigid, non-living, plants only. Cell membrane: lipid and protein, selectively permeable, flexible, living, in all cells.",
        "Ribosomes are too small for any light microscope to resolve; mitochondria are big enough but are not stained on a school slide."
      ]
    }
  },

  l03: {
    title: "Forms of Cells and Levels of Organisation",
    donow: [
      {
        from: 2, sec: "concepts", where: "Contractile vacuole",
        q: "What is the function of the contractile vacuole?",
        a: "It <strong>collects and pumps out excess water</strong> from a freshwater protozoan such as <em>Amoeba</em>."
      },
      {
        from: 2, sec: "concepts", where: "Plant-only structures",
        q: "Name the three structures found only in plant cells.",
        a: "The <strong>cellulose cell wall</strong>, <strong>chloroplasts</strong> and the <strong>large central sap vacuole</strong>."
      },
      {
        from: 2, sec: "concepts", where: "Organelle functions",
        q: "Which organelle releases energy in respiration?",
        a: "The <strong>mitochondrion</strong>, the cell's power station."
      },
      {
        from: 1, sec: "examples", where: "Actual size",
        q: "A cell's image is 30 mm long at ×600. What is its actual size?",
        a: "Actual = image ÷ magnification = 30 ÷ 600 = <strong>0.05 mm</strong>, and 0.05 × 1000 = <strong>50 µm</strong>."
      }
    ],
    quiz: [
      {
        from: 2,
        q: "Which organelle is bounded by a double membrane?",
        o: ["Lysosome", "Golgi body", "Ribosome", "Mitochondrion"],
        a: 3,
        e: "The mitochondrion has two membranes (the inner one folded into cristae). Lysosomes and the Golgi body have one membrane; ribosomes have none."
      },
      {
        from: 1,
        q: "A cell 0.04 mm long is shown 20 mm long in a photograph. What is the magnification?",
        o: ["×50", "×80", "×500", "×800"],
        a: 2,
        e: "Magnification = image ÷ actual = 20 mm ÷ 0.04 mm = ×500. Both lengths must be in the same unit first."
      }
    ],
    recall: {
      prompt: "Close your notes. Write down everything you remember from Lesson 3, then tick each point below that you wrote:",
      points: [
        "Free-living single cells: Amoeba, Paramecium, Euglena, Chlamydomonas. Colony: Volvox. Filament: Spirogyra. Tissue level: Hydra.",
        "Nutrition: autotrophic (Chlamydomonas, Spirogyra, Euglena in light); saprophytic (Euglena in darkness); holozoic (Amoeba, Paramecium).",
        "In a colony every cell is alike and nearly self-sufficient; in a tissue the cells are specialised and depend on one another.",
        "Levels of organisation: organelle → cell → tissue → organ → system → organism.",
        "Being big costs a transport system, more food and dependence of every cell on the whole; it gains specialised cells, larger size and life in many places.",
        "For a cube, SA : V = 6L² ÷ L³ = 6/L, so the ratio falls as the cube gets bigger."
      ]
    }
  },

  l04: {
    title: "The Cell and Its Environment: Diffusion, Osmosis and Active Transport",
    donow: [
      {
        from: 2, sec: "concepts", where: "Cell membrane",
        q: "What does \"selectively permeable\" mean?",
        a: "The membrane <strong>lets some substances pass through but holds others back</strong>, so it controls what enters and leaves the cell."
      },
      {
        from: 2, sec: "concepts", where: "Sap vacuole",
        q: "Name the membrane around the plant cell's sap vacuole.",
        a: "The <strong>tonoplast</strong>."
      },
      {
        from: 3, sec: "concepts", where: "Surface area : volume",
        q: "Why can an Amoeba rely on diffusion alone?",
        a: "It is tiny, so it has a <strong>large surface area to volume ratio</strong>: every part of the cell is close to the surface."
      },
      {
        from: 2, sec: "bridge", where: "Cell wall",
        q: "Which structure lets a plant cell resist bursting?",
        a: "The <strong>cellulose cell wall</strong>: it is strong enough to stop the cell swelling until it bursts."
      }
    ],
    quiz: [
      {
        from: 3,
        q: "What is the surface area to volume ratio of a cube with sides of 3 mm?",
        o: ["0.5 mm⁻¹", "2.0 mm⁻¹", "3.0 mm⁻¹", "18 mm⁻¹"],
        a: 1,
        e: "SA = 6 × 3² = 54 mm² and V = 3³ = 27 mm³, so SA : V = 54 ÷ 27 = 2.0 mm⁻¹ (check: 6 ÷ 3 = 2.0)."
      },
      {
        from: 2,
        q: "Which statement about the cell wall and the cell membrane is correct?",
        o: ["Both are selectively permeable", "The wall is fully permeable; the membrane is selectively permeable", "The wall is living; the membrane is non-living", "Only animal cells have a cell membrane"],
        a: 1,
        e: "The cellulose wall lets almost anything through; the living membrane chooses what passes. Every cell, plant or animal, has a cell membrane."
      }
    ],
    recall: {
      prompt: "Close your notes. Write down everything you remember from Lesson 4, then tick each point below that you wrote:",
      points: [
        "Diffusion: particles spread from where they are crowded to where they are fewer. Osmosis: water crosses a selectively permeable membrane from a dilute to a more concentrated solution. Active transport: the cell pumps substances against their gradient, using energy (ATP).",
        "Hypotonic solution: plant cell turgid (the wall stops it bursting); red cell swells and bursts (haemolysis).",
        "Isotonic solution: plant cell flaccid, red cell normal. Hypertonic solution: plant cell plasmolysed; red cell shrinks and crenates.",
        "% change in mass = (final − initial) ÷ initial × 100.",
        "The isotonic point is where the graph of % change crosses 0% (about 0.34 mol dm⁻³ for our potato).",
        "Salty water wilted the ugu by drawing water out (plasmolysis); plain water in a vein would burst red cells; 0.9% saline is isotonic with blood."
      ]
    }
  },

  l05: {
    title: "WAEC Paper 3 Clinic: Slides, Biological Drawing and Magnification",
    donow: [
      {
        from: 1, sec: "examples", where: "Actual size",
        q: "A cell's image is 36 mm long at ×400. What is its actual size?",
        a: "Actual = image ÷ magnification = 36 ÷ 400 = <strong>0.09 mm</strong>, and 0.09 × 1000 = <strong>90 µm</strong>."
      },
      {
        from: 2, sec: "concepts", where: "Plant vs animal",
        q: "Name two structures found only in plant cells.",
        a: "Any two of: <strong>cellulose cell wall</strong>, <strong>chloroplasts</strong>, <strong>large central sap vacuole</strong>."
      },
      {
        from: 4, sec: "concepts", where: "Plasmolysis",
        q: "What is plasmolysis?",
        a: "When a plant cell loses water by osmosis in a hypertonic solution, its <strong>membrane and cytoplasm pull away from the cell wall</strong>."
      },
      {
        from: 3, sec: "concepts", where: "Colony vs tissue",
        q: "Why is Volvox not a tissue?",
        a: "Its cells are <strong>all alike and each can feed, respire and move by itself</strong>; in a tissue the cells are specialised and depend on one another."
      }
    ],
    quiz: [
      {
        from: 4,
        q: "A potato strip changed from 2.00 g to 1.80 g in a sucrose solution. What was the percentage change in mass?",
        o: ["−0.20%", "−10.0%", "−11.1%", "+10.0%"],
        a: 1,
        e: "Change = 1.80 − 2.00 = −0.20 g; % change = −0.20 ÷ 2.00 × 100 = −10.0%. Always divide by the initial mass."
      },
      {
        from: 4,
        q: "Red blood cells are placed in distilled water. What happens to them?",
        o: ["They shrink and crenate", "They stay the same", "They swell and burst (haemolysis)", "They become turgid and stop swelling"],
        a: 2,
        e: "Distilled water is hypotonic to red cells, so water enters by osmosis. With no cell wall to resist, they swell and burst: haemolysis."
      }
    ],
    recall: {
      prompt: "Close your notes. Write down everything you remember from Lesson 5, then tick each point below that you wrote:",
      points: [
        "Onion slide: peel the thin inner epidermis, lay it flat in a drop of iodine, lower the cover slip at about 45° to keep out air bubbles, view on low power then high power.",
        "Cheek slide: scrape gently with a clean spatula, smear on the slide, add methylene blue, add a cover slip; put the used spatula in disinfectant.",
        "Drawing rules: title, magnification, correct size, clean lines with no shading, ruled horizontal guidelines that touch the part and never cross, singular labels in a column, correct spelling, double lines for cut surfaces, draw only what you see.",
        "Observable differences: onion cells are regular and box-like with a wall, a side nucleus and a visible vacuole (iodine, yellow-brown); cheek cells are irregular, with no wall and a central nucleus (methylene blue).",
        "Drawing magnification = drawing length ÷ actual length, in the same units, written with no unit (e.g. ×200)."
      ]
    }
  }
};
