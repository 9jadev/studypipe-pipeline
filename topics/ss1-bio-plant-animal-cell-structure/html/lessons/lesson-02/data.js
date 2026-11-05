/* Lesson 02 · Inside the Eukaryotic Cell — Organelles & Plant vs Animal Cells — content data and 12 WAEC/NECO/JAMB quiz questions */
(function () {
  "use strict";

  window.L02 = {
    // ---- 1. Organelle Classification Sort (Plant-Only, Shared Eukaryotic, Animal-Typical) ----
    items: [
      { id: "cellwall", name: "Rigid non-living cellulose cell wall with plasmodesmata", emo: "🧱", bin: "shm", why: "Plant-Only Feature: Secreted outside the plasma membrane; made of β-glucose cellulose microfibrils that prevent bursting." },
      { id: "chloroplast", name: "Double-membrane chloroplast with thylakoid grana & stroma", emo: "🌿", bin: "shm", why: "Plant-Only Feature: Contains chlorophyll to trap solar energy and synthesise glucose during photosynthesis." },
      { id: "vacuole", name: "Large permanent central sap vacuole bounded by a tonoplast", emo: "💧", bin: "shm", why: "Plant-Only Feature: Occupies up to 80% of mature plant cell volume, storing cell sap and maintaining turgor pressure." },
      { id: "starch", name: "Polysaccharide food reserve stored as insoluble starch grains", emo: "🌾", bin: "shm", why: "Plant-Only Feature: Plants polymerise excess glucose into amylose and amylopectin starch grains inside plastids." },
      { id: "nucleus", name: "Double-membrane nucleus containing chromatin & nucleolus", emo: "🎯", bin: "periodic", why: "Shared Eukaryotic Organelle: Present in both plant and animal cells; controls cell activities and makes ribosomal RNA." },
      { id: "mito", name: "Mitochondrion with folded inner cristae & 70S ribosomes", emo: "⚡", bin: "periodic", why: "Shared Eukaryotic Organelle: Both plant and animal cells require mitochondria for aerobic respiration (ATP synthesis)." },
      { id: "rer", name: "Rough endoplasmic reticulum (RER) studded with 80S ribosomes", emo: "🧵", bin: "periodic", why: "Shared Eukaryotic Organelle: Synthesises and transports proteins toward the Golgi apparatus in both plants and animals." },
      { id: "golgi", name: "Golgi apparatus (dictyosome) modifying & packaging vesicles", emo: "📦", bin: "periodic", why: "Shared Eukaryotic Organelle: Modifies, sorts, and packages glycoproteins and cell-wall pectins into secretory vesicles." },
      { id: "centriole", name: "Paired cylindrical centrioles (9+0 microtubule triplets) in centrosome", emo: "🎡", bin: "non", why: "Animal-Typical Feature: Present in animal cells to organise spindle fibres during mitosis; absent in higher flowering plants." },
      { id: "lysosome", name: "Lysosomes (" + "suicide bags" + ") rich in acidic hydrolytic enzymes", emo: "🧪", bin: "non", why: "Animal-Typical Feature: Digest worn-out organelles (autophagy) and engulfed pathogens; plant vacuoles perform this role." },
      { id: "glycogen", name: "Carbohydrate food reserve stored as cytoplasmic glycogen granules", emo: "🥩", bin: "non", why: "Animal-Typical Feature: Animals and fungi store excess glucose as highly branched glycogen granules rather than starch." },
      { id: "irregular", name: "Flexible outer plasma membrane only (irregular, changeable shape)", emo: "🫧", bin: "non", why: "Animal-Typical Feature: Lacking a rigid cellulose wall, animal cells have a flexible boundary and burst in pure water." }
    ],

    // ---- 2. 3D Organelle & Mitochondrial Cristae Energetics Bench trials (ATP Rate = 0.45 × Cristae Index) ----
    trials: [
      { label: "A", L: 100, t: "Adipose (Fat)",   T: "45.0",  T2: "0.45" },
      { label: "B", L: 200, t: "Cheek Epithelium", T: "90.0",  T2: "0.45" },
      { label: "C", L: 300, t: "Leaf Palisade",    T: "135.0", T2: "0.45" },
      { label: "D", L: 400, t: "Liver Hepatocyte", T: "180.0", T2: "0.45" },
      { label: "E", L: 500, t: "Flight Muscle",    T: "225.0", T2: "0.45" }
    ],
    tOptions: ["Adipose (Fat)", "Cheek Epithelium", "Leaf Palisade", "Liver Hepatocyte", "Flight Muscle"],
    TOptions: ["45.0", "90.0", "135.0", "180.0", "225.0"],
    T2Options: ["0.25", "0.45", "0.75", "1.10", "1.50"],

    // ---- 3. Endomembrane Secretory Pathway & Organelle Explorer pins ----
    pins: [
      { frac: -1.0, label: "1. Nucleus & Nucleolus", emo: "🟣", x: "Double envelope + Nuclear pores", v: "DNA → mRNA transcription", a: "Nucleolus builds rRNA subunits", ke: "Control Centre", pe: "Chromatin (DNA + Histones)", note: "Genetic instructions in DNA are transcribed into messenger RNA (mRNA), which exits through nuclear pores into the cytoplasm." },
      { frac: -0.5, label: "2. Rough ER & 80S Ribosomes", emo: "🔵", x: "Cisternae studded with 80S ribosomes", v: "mRNA → Polypeptide synthesis", a: "Folds proteins inside ER lumen", ke: "Protein Factory", pe: "Buds transport vesicles", note: "Ribosomes on the Rough ER translate mRNA into polypeptide chains, which fold inside the ER lumen and bud off in transport vesicles." },
      { frac: 0.0,  label: "3. Smooth ER & Lipids", emo: "🟢", x: "Tubular membranes (no ribosomes)", v: "Phospholipid & steroid synthesis", a: "Detoxifies drugs in liver cells", ke: "Lipid Builder", pe: "Stores Ca²⁺ in muscle", note: "Smooth ER synthesises membrane phospholipids, steroid hormones (testosterone/oestrogen), and detoxifies poisons in liver hepatocytes." },
      { frac: 0.5,  label: "4. Golgi Apparatus", emo: "🟠", x: "Cis face → Cisternae → Trans face", v: "Glycosylation & sorting", a: "Forms secretory vesicles & lysosomes", ke: "Post Office", pe: "Builds acrosome & cell plate", note: "Transport vesicles fuse at the cis face; the Golgi attaches carbohydrate tags (glycoproteins) and pinches off secretory vesicles at the trans face." },
      { frac: 1.0,  label: "5. Mitochondria & Chloroplasts", emo: "⚡", x: "Semi-autonomous double-membrane", v: "Circular DNA + 70S ribosomes", a: "Cristae (ATP) & Grana (Glucose)", ke: "Energy Converters", pe: "Endosymbiotic origin", note: "Both mitochondria and chloroplasts possess their own circular DNA and 70S ribosomes, dividing by binary fission inside the eukaryotic cell!" }
    ]
  };

  // ---- 4. 12 WAEC / NECO / JAMB Quiz Questions ----
  window.LESSON_QUIZ = [
    {
      q: "Which eukaryotic organelle is known as the <strong>'powerhouse of the cell'</strong> because it is the site of the Krebs cycle and oxidative phosphorylation (aerobic ATP synthesis)?",
      o: [
        "Golgi apparatus",
        "Mitochondrion",
        "Lysosome",
        "Smooth endoplasmic reticulum"
      ],
      a: 1,
      e: "The <strong>mitochondrion</strong> carries out aerobic cellular respiration, oxidising pyruvate to generate <strong>36–38 ATP</strong> per glucose molecule.",
      src: "WAEC-style"
    },
    {
      q: "How does the <strong>inner membrane of a mitochondrion</strong> structurally adapt the organelle for rapid ATP synthesis?",
      o: [
        "It is completely smooth and impermeable to all ions",
        "It is folded into numerous shelf-like cristae that greatly increase the surface area for electron-transport chains and ATP synthase enzymes",
        "It contains chlorophyll pigments stacked into grana",
        "It is made of rigid non-living cellulose microfibrils"
      ],
      a: 1,
      e: "Infoldings called <strong>cristae</strong> multiply the inner-membrane surface area so thousands of ATP synthase complexes can operate simultaneously.",
      src: "JAMB-style"
    },
    {
      q: "Why are <strong>mitochondria and chloroplasts</strong> described as <strong>semi-autonomous organelles</strong>?",
      o: [
        "They can survive indefinitely in boiling distilled water outside the cell",
        "They possess their own circular DNA, 70S ribosomes, and double membranes, allowing them to synthesise some of their own proteins and divide by binary fission",
        "They lack any nucleic acids or enzymes",
        "They are bounded by a single peptidoglycan wall"
      ],
      a: 1,
      e: "Both mitochondria and chloroplasts contain <strong>circular naked DNA</strong> and <strong>70S ribosomes</strong>, supporting the endosymbiotic theory.",
      src: "JAMB-style"
    },
    {
      q: "What is the primary function of the <strong>nucleolus</strong> located inside the eukaryotic nucleus?",
      o: [
        "Synthesis of ribosomal RNA (rRNA) and assembly of ribosome subunits",
        "Digestion of worn-out organelles by hydrolytic enzymes",
        "Storage of starch grains in root tubers",
        "Pumping sodium ions out of the cell"
      ],
      a: 0,
      e: "The dense, non-membranous <strong>nucleolus</strong> transcribes ribosomal RNA (<strong>rRNA</strong>) and combines it with proteins to assemble ribosomal subunits.",
      src: "WAEC-style"
    },
    {
      q: "Which sequence correctly traces the <strong>secretory pathway</strong> of a digestive enzyme (protein) from synthesis to exocytosis?",
      o: [
        "Lysosome → Nucleus → Smooth ER → Mitochondrion",
        "80S Ribosome on Rough ER → Transport Vesicle → Golgi Apparatus → Secretory Vesicle → Plasma Membrane",
        "Chloroplast → Tonoplast → Cell Wall → Centriole",
        "Golgi Apparatus → Nucleolus → Rough ER → Vacuole"
      ],
      a: 1,
      e: "Secreted proteins are synthesised on <strong>Rough ER ribosomes</strong>, carried in <strong>transport vesicles</strong> to the <strong>Golgi apparatus</strong> for modification/packaging, and exported via <strong>secretory vesicles</strong>.",
      src: "JAMB-style"
    },
    {
      q: "Which organelle is referred to as the <strong>'suicide bag'</strong> of an animal cell because rupture of its single membrane releases acidic hydrolytic enzymes that digest the cell (autolysis)?",
      o: [
        "Ribosome",
        "Centriole",
        "Lysosome",
        "Peroxisome"
      ],
      a: 2,
      e: "<strong>Lysosomes</strong> contain acid hydrolases (proteases, lipases, nucleases) that perform intracellular digestion, autophagy, and autolysis (e.g., reabsorption of a tadpole's tail during metamorphosis).",
      src: "WAEC-style"
    },
    {
      q: "A student wants to distinguish a <strong>green palisade mesophyll cell</strong> from a <strong>human cheek epithelial cell</strong> under a microscope. Which trio of structures is present ONLY in the palisade cell?",
      o: [
        "Plasma membrane, cytoplasm, and nucleus",
        "Mitochondria, 80S ribosomes, and Golgi body",
        "Cellulose cell wall, chloroplasts, and a large permanent central sap vacuole bounded by a tonoplast",
        "Centrioles, lysosomes, and glycogen granules"
      ],
      a: 2,
      e: "Plant cells possess a <strong>cellulose cell wall</strong>, <strong>chloroplasts</strong> (in green tissues), and a <strong>large central sap vacuole</strong> bounded by a <strong>tonoplast</strong>.",
      src: "NECO-style"
    },
    {
      q: "In which specific part of the <strong>chloroplast</strong> do the <strong>light-dependent reactions</strong> (photolysis of water) and the <strong>light-independent reactions</strong> (Calvin cycle carbon fixation) take place respectively?",
      o: [
        "Light stage in the stroma; dark stage in the outer membrane",
        "Light stage in the thylakoid membranes (grana); dark stage in the aqueous stroma",
        "Light stage in the cristae; dark stage in the matrix",
        "Light stage in the tonoplast; dark stage in the nucleoplasm"
      ],
      a: 1,
      e: "Chlorophyll is embedded in the <strong>thylakoid membranes (grana)</strong> for the light stage, while RuBisCO enzymes for the Calvin cycle are dissolved in the <strong>stroma</strong>.",
      src: "JAMB-style"
    },
    {
      q: "Excess glucose is stored as insoluble <strong>starch grains</strong> in plant cells, whereas in animal liver and muscle cells it is stored as:",
      o: [
        "Cellulose microfibrils",
        "Chitin fibres",
        "Glycogen granules",
        "Pectin lamellae"
      ],
      a: 2,
      e: "Animals and fungi store excess carbohydrate as cytoplasmic <strong>glycogen granules</strong>; plants store carbohydrate as <strong>starch</strong>.",
      src: "WAEC-style"
    },
    {
      q: "Which plastid type is responsible for the bright red, orange, and yellow colours of ripe tomato fruits, carrot roots, and flower petals?",
      o: [
        "Amyloplast (leucoplast)",
        "Chromoplast",
        "Chloroplast",
        "Elaioplast"
      ],
      a: 1,
      e: "<strong>Chromoplasts</strong> contain carotenoid pigments (carotene and xanthophyll) that give ripe fruits and petals bright colours to attract pollinators and seed dispersers.",
      src: "JAMB-style"
    },
    {
      q: "When <strong>15 molecules of glucose</strong> are completely oxidised via aerobic respiration inside a cell's mitochondria (yielding 38 ATP per glucose), how many more ATP molecules are produced than if the same 15 glucose molecules underwent anaerobic glycolysis in the cytoplasm (2 ATP per glucose)?",
      o: ["30 ATP", "36 ATP", "540 ATP", "570 ATP"],
      a: 2,
      e: "Aerobic ATP = <code>15 × 38 = 570 ATP</code>. Anaerobic ATP = <code>15 × 2 = 30 ATP</code>. Net gain from mitochondria = <code>570 − 30 = 540 ATP</code>.",
      src: "WAEC-style"
    },
    {
      q: "Microscopic cytoplasmic channels that pass through pits in adjacent plant cell walls, linking the living cytoplasm of neighbouring cells into a continuous <strong>symplast</strong>, are called:",
      o: [
        "Cristae",
        "Plasmodesmata",
        "Centrioles",
        "Microvilli"
      ],
      a: 1,
      e: "<strong>Plasmodesmata</strong> (singular: plasmodesma) are fine cytoplasmic strands threading through pores in the cellulose cell wall and middle lamella.",
      src: "NECO-style"
    }
  ];
})();
