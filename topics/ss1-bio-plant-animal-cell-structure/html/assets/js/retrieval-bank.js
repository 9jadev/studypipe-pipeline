/* ==========================================================
   StudyPipe — Spaced Retrieval Bank for Plant & Animal Cell Structure (L1–L5)
   Used by LessonKit across lessons/lesson-01 .. lesson-05
   ========================================================== */
window.RETRIEVAL_BANK = {
  l01: {
    title: "Discovery of the Cell, Cell Theory & Prokaryotes vs Eukaryotes",
    donow: [
      {
        from: 0, sec: "concepts", where: "Characteristics of Living Things",
        q: "What do the letters in MR NIGER D stand for in Biology, and what is the smallest structural unit that performs all of them?",
        a: "<strong>Movement, Respiration, Nutrition, Irritability, Growth, Excretion, Reproduction, Death</strong> — and the <strong>cell</strong> is the smallest structural and functional unit of life."
      },
      {
        from: 0, sec: "concepts", where: "Microscopy Unit Conversion",
        q: "How many millimetres (mm) are in 1 centimetre (cm), and how many micrometres (μm) are in 1 mm and in 1 cm?",
        a: "<code>1 cm = 10 mm</code> and <code>1 mm = 1000 μm</code>. Therefore <code>1 cm = 10 × 1000 = 10000 μm</code>."
      },
      {
        from: 0, sec: "practical", where: "Simple Magnification Ratio",
        q: "A student draws a 2.0 cm beetle with a drawing length of 10.0 cm. What is the magnification M of the drawing?",
        a: "<code>M = I ÷ A = 10.0 ÷ 2.0 = ×5</code> (written with a multiplication sign and no units)."
      },
      {
        from: 0, sec: "practical", where: "Compound Microscope Lenses",
        q: "How do you calculate the total magnification of a compound light microscope from its eyepiece and objective lenses?",
        a: "Multiply the two lens powers: <code>M_total = M_eyepiece × M_objective</code> (for example, <code>×10 × ×40 = ×400</code>)."
      }
    ],
    recall: {
      prompt: "Without looking back at the notes, tick off every core idea from Lesson 1 you can state from memory:",
      points: [
        "Robert Hooke (1665) examined thin slices of dead oak cork and named the empty cellulose chambers 'cells', while Félix Dujardin (1835) discovered the living jelly inside cells ('sarcode' / protoplasm).",
        "Matthias Schleiden (1838, plants) and Theodor Schwann (1839, animals) formulated the Cell Theory, and Rudolf Virchow (1855) added that all cells arise from pre-existing living cells.",
        "Prokaryotic cells (bacteria, blue-green algae) lack a nuclear envelope and membrane-bound organelles, have naked circular DNA and 70S ribosomes; eukaryotic cells have a double-membrane nucleus, linear DNA, 80S ribosomes, and mitochondria/ER/Golgi.",
        "Drawing magnification is M = I ÷ A (in identical units: 1 cm = 10 mm = 10,000 μm) and compound microscope magnification is M_total = M_eyepiece × M_objective."
      ]
    }
  },

  l02: {
    title: "Inside the Eukaryotic Cell — Organelles & Plant vs Animal Cells",
    donow: [
      {
        from: 1, sec: "concepts", where: "Hooke vs Dujardin",
        q: "Why did Robert Hooke see only empty box-like walls in 1665 cork, and who discovered the living protoplasm inside cells in 1835?",
        a: "Cork is dead bark tissue, so Hooke saw only empty <strong>cellulose cell walls</strong>. <strong>Félix Dujardin (1835)</strong> discovered the living jelly (<em>sarcode</em> / protoplasm)."
      },
      {
        from: 1, sec: "concepts", where: "Prokaryote vs Eukaryote",
        q: "Which protein-synthesising organelle is present in BOTH a bacterial cell and a human liver cell?",
        a: "The <strong>ribosome</strong> (70S in prokaryotes, 80S in eukaryotes). Bacteria have no nuclear membrane and no mitochondria or chloroplasts."
      },
      {
        from: 1, sec: "examples", where: "Drawing Magnification",
        q: "An onion cell of actual length A = 150 μm is drawn I = 7.5 cm long. What is the drawing magnification M?",
        a: "Convert to μm: <code>I = 7.5 × 10000 = 75000 μm</code>. Then <code>M = I ÷ A = 75000 ÷ 150 = ×500</code>."
      },
      {
        from: 1, sec: "concepts", where: "Viruses & Cell Theory",
        q: "Why are viruses considered exceptions to the Cell Theory?",
        a: "Viruses are acellular nucleoprotein particles (DNA or RNA inside a protein capsid) with no plasma membrane, cytoplasm, or ribosomes; they crystallise outside host cells."
      }
    ],
    recall: {
      prompt: "Close your notes and recall the organelle functions, membrane counts, and plant vs animal cell differences:",
      points: [
        "Double-membrane organelles: Nucleus (controls cell & holds DNA), Mitochondrion (folded inner cristae & matrix; aerobic respiration producing ATP), and Chloroplast (thylakoid grana & stroma; photosynthesis).",
        "Single-membrane organelles: Rough ER (protein transport), Smooth ER (lipid synthesis), Golgi body (packages & secretes macromolecules, forms lysosomes), Lysosome ('suicide bag' with hydrolytic enzymes), and Vacuole (bounded by tonoplast).",
        "Non-membranous organelles: Ribosomes (protein synthesis) and Centrioles/Centrosome (spindle fibre formation in animal cells).",
        "Plant cells have a rigid freely permeable cellulose cell wall, chloroplasts, large central permanent vacuole, and store starch; animal cells have no cell wall, have centrioles, small temporary vacuoles, and store glycogen."
      ]
    }
  },

  l03: {
    title: "Forms of Living Cells & Levels of Biological Organisation",
    donow: [
      {
        from: 2, sec: "concepts", where: "Membrane Count Trap",
        q: "Classify ribosome, mitochondrion, lysosome, and cellulose cell wall by whether they have 0, 1, or 2 membranes.",
        a: "<strong>Ribosome:</strong> 0 membranes · <strong>Lysosome:</strong> 1 membrane · <strong>Mitochondrion:</strong> 2 membranes · <strong>Cellulose cell wall:</strong> non-living structural wall (not a membrane!)."
      },
      {
        from: 2, sec: "concepts", where: "Cell Wall vs Cell Membrane",
        q: "Contrast the permeability and chemical composition of the plant cell wall vs the plasma membrane.",
        a: "<strong>Cell wall:</strong> cellulose, rigid, non-living, <strong>freely permeable</strong>. <strong>Cell membrane:</strong> lipoprotein bilayer, flexible, living, <strong>selectively permeable</strong>."
      },
      {
        from: 2, sec: "concepts", where: "Plant vs Animal Storage",
        q: "In what carbohydrate form do plant cells store excess glucose, and in what form do animal cells (and fungi) store it?",
        a: "Plant cells store carbohydrate as <strong>starch</strong> (in plastids); animal cells and fungi store carbohydrate as <strong>glycogen</strong> granules."
      },
      {
        from: 1, sec: "examples", where: "Actual Size Calculation",
        q: "Under ×400 magnification, a Chlamydomonas image measures 16 mm across. What is its actual diameter in μm?",
        a: "<code>I = 16 × 1000 = 16000 μm</code>. Actual size <code>A = I ÷ M = 16000 ÷ 400 = 40 μm</code>."
      }
    ],
    recall: {
      prompt: "Without looking back, recall the four forms of living cells, the levels of organisation, and SA/V scaling:",
      points: [
        "Living cells exist as: (1) Single free-living cells (Amoeba, Paramecium, Euglena, Chlamydomonas), (2) Colonies (Volvox), (3) Filaments (Spirogyra), and (4) Specialised cells in multicellular tissues (palisade, cheek, neurone).",
        "Euglena shares plant features (chloroplasts for photosynthesis in light) and animal features (pellicle, flagellum, eyespot, gullet, contractile vacuole, saprophytic feeding in dark).",
        "In a colony (Volvox) or filament (Spirogyra), cells are alike and independent; in a true tissue (Hydra), cells are specialised and interdependent.",
        "Hierarchy: Organelle → Cell → Tissue (Hydra, blood) → Organ (onion bulb, rhizome, leaf, heart) → System → Organism. Small unicellular organisms have a huge SA/V ratio (6/L) so simple diffusion suffices."
      ]
    }
  },

  l04: {
    title: "The Cell & Its Environment — Diffusion, Osmosis, Turgor & Haemolysis",
    donow: [
      {
        from: 3, sec: "concepts", where: "Euglena & Protozoan Osmoregulation",
        q: "Which organelle prevents freshwater Amoeba, Paramecium, and Euglena from bursting by expelling excess water?",
        a: "The <strong>contractile vacuole</strong> (osmoregulation)."
      },
      {
        from: 3, sec: "concepts", where: "Colony vs Tissue & Onion Bulb",
        q: "At what level of organisation is an onion bulb or ginger rhizome classified, and why?",
        a: "At the <strong>organ level</strong>, because it consists of several different tissues (epidermis, storage parenchyma, xylem and phloem) working together."
      },
      {
        from: 3, sec: "examples", where: "Surface-Area-to-Volume Ratio",
        q: "How many times larger is the SA/V ratio (6/L) of a 0.1 mm Amoeba cube compared to a 10 mm tissue cube?",
        a: "<code>R_1 = 6 ÷ 0.1 = 60 mm⁻¹</code> and <code>R_2 = 6 ÷ 10 = 0.6 mm⁻¹</code>. Ratio <code>F = 60 ÷ 0.6 = 100 times</code> larger!"
      },
      {
        from: 2, sec: "concepts", where: "Vacuole & Tonoplast",
        q: "What is the name of the selectively permeable membrane surrounding a plant cell's central sap vacuole?",
        a: "The <strong>tonoplast</strong>."
      }
    ],
    recall: {
      prompt: "Close your notes and recall diffusion, osmosis, active transport, turgidity, plasmolysis, and haemolysis:",
      points: [
        "Diffusion is passive movement down a concentration gradient; Osmosis is net movement of water from a dilute (hypotonic) to a concentrated (hypertonic) solution across a selectively permeable membrane; Active transport moves ions against a gradient using ATP.",
        "In distilled water (hypotonic), a plant cell swells until its rigid cellulose cell wall exerts opposing turgor pressure (turgidity — never bursts), whereas a red blood cell has no cell wall so it swells and bursts (haemolysis).",
        "In concentrated salt/sugar (hypertonic), a plant cell loses water and its protoplasm pulls away from the cell wall (plasmolysis), whereas a red blood cell shrinks and wrinkles (crenation).",
        "Percentage mass change is %Δm = ((m_f − m_i) ÷ m_i) × 100%, and plant water potential is Ψ_w = Ψ_s + Ψ_p."
      ]
    }
  },

  l05: {
    title: "WAEC Paper 3 Practical — Wet-Mount Microscopy & Biological Drawing Clinic",
    donow: [
      {
        from: 4, sec: "concepts", where: "Turgidity vs Haemolysis",
        q: "Why does a red blood cell burst (haemolyse) in distilled water whereas an onion epidermal cell becomes turgid without bursting?",
        a: "Water enters both by osmosis, but the onion cell has a rigid <strong>cellulose cell wall</strong> that resists bursting, whereas the red blood cell has <strong>no cell wall</strong>."
      },
      {
        from: 4, sec: "examples", where: "Plant Water Potential",
        q: "Cell X has Ψ_s = −500 kPa and Ψ_p = +300 kPa; adjacent Cell Y has Ψ_s = −900 kPa and Ψ_p = +450 kPa. Which way does water move?",
        a: "<code>Ψ_wX = -500 + 300 = -200 kPa</code> and <code>Ψ_wY = -900 + 450 = -450 kPa</code>. Water moves from higher (less negative) <strong>Cell X (−200 kPa) to Cell Y (−450 kPa)</strong>."
      },
      {
        from: 2, sec: "concepts", where: "Plastids in Underground Organs",
        q: "Why do fleshy onion bulb scale leaves contain leucoplasts instead of green chloroplasts?",
        a: "Because the onion bulb grows <strong>underground without sunlight</strong> and stores food rather than photosynthesising."
      },
      {
        from: 1, sec: "examples", where: "Magnification Formula",
        q: "A specimen of actual length A = 4.0 mm is drawn I = 8.0 cm long. What is the magnification M of the drawing?",
        a: "Convert to mm: <code>I = 8.0 × 10 = 80.0 mm</code>. Then <code>M = I ÷ A = 80.0 ÷ 4.0 = ×20</code>."
      }
    ],
    recall: {
      prompt: "Without looking back, recall the WAEC Paper 3 slide staining protocol, observable differences, and 9 drawing rules:",
      points: [
        "Stain onion epidermis (Specimen A) with iodine solution and cheek cells (Specimen B) with methylene blue; lower the coverslip at a 45° angle with a mounting needle to prevent trapping air bubbles.",
        "Focus under low power (×4 or ×10) first before switching to high power (×40) using the fine adjustment knob only.",
        "Do NOT label chloroplasts in an onion bulb cell (grows underground), do NOT label the cell membrane separately unless plasmolysed, and do NOT label mitochondria/ER/ribosomes on light-microscope drawings.",
        "WAEC Chief Examiner 9 Drawing Rules: Title, Magnification (×100), specified size (6–8 cm), sharp HB continuous unshaded lines, double lines for cell walls/cut surfaces, horizontal parallel ruled guidelines touching parts without crossing, singular labels, correct spelling & capitalised Genus names."
      ]
    }
  }
};
