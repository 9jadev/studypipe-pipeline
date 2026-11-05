/* Lesson 03 · Forms in Which Living Cells Exist & Levels of Biological Organisation — content data and 12 WAEC/NECO/JAMB quiz questions */
(function () {
  "use strict";

  window.L03 = {
    // ---- 1. Forms of Living Cells & Levels of Organisation Sort ----
    items: [
      { id: "amoeba", name: "Amoeba proteus — pseudopodia & contractile vacuole", emo: "🦠", bin: "shm", why: "Single Free-Living Cell: Unicellular rhizopod protozoan using pseudopodia for locomotion and phagocytosis." },
      { id: "paramecium", name: "Paramecium caudatum — cilia, oral groove & 2 nuclei", emo: "👟", bin: "shm", why: "Single Free-Living Cell: Slipper-shaped ciliate with macronucleus (metabolism) and micronucleus (conjugation)." },
      { id: "euglena", name: "Euglena viridis — mixotrophic flagellate with pellicle & eyespot", emo: "🌿", bin: "shm", why: "Single Free-Living Cell: Shares plant traits (chloroplasts, paramylon) and animal traits (flagellum, pellicle, gullet, no cellulose wall)." },
      { id: "chlamy", name: "Chlamydomonas — cup-shaped chloroplast, pyrenoid & 2 flagella", emo: "🟢", bin: "shm", why: "Single Free-Living Cell: Motile unicellular green alga with cellulose wall, stigma (eyespot), and two anterior flagella." },
      { id: "volvox", name: "Volvox aureus — hollow sphere of 500–50,000 cells linked by strands", emo: "🌐", bin: "periodic", why: "Colony or Filament: Colonial green alga with cytoplasmic bridges and somatic vs gonidia reproductive division of labour." },
      { id: "pandorina", name: "Pandorina & Eudorina — 16 to 32 flagellated cells in mucilage", emo: "🫧", bin: "periodic", why: "Colony or Filament: Simpler colonial green algae where similar Chlamydomonas-like cells are embedded in a mucilage matrix." },
      { id: "spirogyra", name: "Spirogyra — unbranched filament of cylindrical cells with spiral chloroplasts", emo: "🎗️", bin: "periodic", why: "Colony or Filament: Unbranched filamentous green alga; identical cells joined end-to-end with mucilage sheath and pyrenoids." },
      { id: "oscillatoria", name: "Oscillatoria / Nostoc — filamentous chains of photosynthetic cells", emo: "⛓️", bin: "periodic", why: "Colony or Filament: Cells arranged end-to-end in unbranched chains resulting from cell division in a single plane." },
      { id: "epidermis", name: "Onion scale epidermis / xylem / blood — Tissue Level", emo: "🧱", bin: "non", why: "Tissue, Organ or System: A group of similar or coordinated cells with a common origin performing a specific function." },
      { id: "onionbulb", name: "Onion bulb / hibiscus flower / mammalian eye, heart, skin — Organ Level", emo: "🧅", bin: "non", why: "Tissue, Organ or System: Different tissues (epidermis, parenchyma, xylem, phloem) grouped together for a major function." },
      { id: "hydra", name: "Hydra viridissima — diploblastic animal at the Tissue Level (no organs)", emo: "🐙", bin: "non", why: "Tissue, Organ or System: Multicellular cnidarian with ectoderm and endoderm tissues separated by mesoglea, lacking true organs." },
      { id: "shoot", name: "Plant shoot system / human digestive & circulatory systems", emo: "🌳", bin: "non", why: "Tissue, Organ or System: Multiple organs cooperating to carry out a major physiological process in a multicellular organism." }
    ],

    // ---- 2. 3D Surface-Area-to-Volume (SA/V = 6/L) Scaling Bench trials ----
    trials: [
      { label: "A", L: 1.0, t: "6.0",   T: "1.0",   T2: "6.00" },
      { label: "B", L: 2.0, t: "24.0",  T: "8.0",   T2: "3.00" },
      { label: "C", L: 3.0, t: "54.0",  T: "27.0",  T2: "2.00" },
      { label: "D", L: 4.0, t: "96.0",  T: "64.0",  T2: "1.50" },
      { label: "E", L: 6.0, t: "216.0", T: "216.0", T2: "1.00" }
    ],
    tOptions: ["6.0", "24.0", "54.0", "96.0", "216.0"],
    TOptions: ["1.0", "8.0", "27.0", "64.0", "216.0"],
    T2Options: ["6.00", "3.00", "2.00", "1.50", "1.00"],

    // ---- 3. Levels of Biological Organisation Explorer pins ----
    pins: [
      { frac: -1.0, label: "Level 1 · Cell", emo: "🔬", x: "Smallest living functional unit", v: "Plant: Palisade, Root hair, Guard cell", a: "Animal: RBC, Neurone, Sperm, Ovum", ke: "SA/V = 6 ÷ L (High)", pe: "Direct diffusion works", note: "At the cellular level (Amoeba, Chlamydomonas, or a single specialised cell), surface-area-to-volume ratio is huge so simple diffusion suffices." },
      { frac: -0.5, label: "Level 2 · Tissue", emo: "🧱", x: "Similar cells + intercellular matrix", v: "Plant: Epidermis, Parenchyma, Xylem, Phloem", a: "Animal: Epithelial, Muscle, Nerve, Blood", ke: "Hydra stops here", pe: "Division of labour begins", note: "A tissue groups similar cells to perform one task (e.g., blood transports O₂; xylem conducts water). Hydra is organised at the tissue level." },
      { frac: 0.0,  label: "Level 3 · Organ", emo: "🧅", x: "Multiple tissues working together", v: "Plant: Onion bulb, Leaf, Root, Stem, Flower", a: "Animal: Heart, Eye, Kidney, Skin, Stomach", ke: "Onion Bulb = Organ!", pe: "Epidermis + Mesophyll + Vascular", note: "WAEC favourite: An onion bulb, yam tuber, or leaf is an ORGAN because it combines epidermal, storage parenchyma, xylem, and phloem tissues." },
      { frac: 0.5,  label: "Level 4 · Organ System", emo: "🫀", x: "Coordinated organs for a major process", v: "Plant: Shoot system & Root system", a: "Animal: Digestive, Circulatory, Excretory", ke: "Mass transport needed", pe: "Overcomes low SA/V", note: "As body size L grows, SA/V = 6/L drops sharply; circulatory and respiratory systems overcome the long diffusion distance." },
      { frac: 1.0,  label: "Level 5 · Organism", emo: "🌳", x: "Complete independent multicellular individual", v: "Plant: Maize plant, Hibiscus, Iroko tree", a: "Animal: Tilapia, Agama lizard, Human", ke: "Highest efficiency", pe: "Low energy per gram", note: "Integrated organ systems give multicellular organisms high physiological efficiency, homeostatic independence, and longer lifespan." }
    ]
  };

  // ---- 4. 12 WAEC / NECO / JAMB Quiz Questions ----
  window.LESSON_QUIZ = [
    {
      q: "Why is <strong><em>Euglena viridis</em></strong> classified by biologists as a <strong>mixotrophic organism</strong> sharing both plant and animal characteristics?",
      o: [
        "It has both a cellulose cell wall and a chitin cell wall",
        "It possesses chloroplasts and pyrenoids for photosynthesis in light (plant-like), yet has a flexible proteinaceous pellicle, flagellum, gullet, and contractile vacuole for holozoic/saprophytic nutrition in darkness (animal-like)",
        "It is a multicellular organ with xylem and phloem",
        "It reproduces only inside a living host cell like a virus"
      ],
      a: 1,
      e: "<em>Euglena</em> has <strong>plant features</strong> (chloroplasts, pyrenoids, paramylon starch) and <strong>animal features</strong> (no cellulose cell wall, protein pellicle, flagellum, eyespot/stigma, gullet, contractile vacuole).",
      src: "WAEC-style"
    },
    {
      q: "Which of the following pairs correctly matches a <strong>colonial organism</strong> and an <strong>unbranched filamentous organism</strong> respectively?",
      o: [
        "Amoeba and Paramecium",
        "Volvox and Spirogyra",
        "Spirogyra and Euglena",
        "Hydra and Chlamydomonas"
      ],
      a: 1,
      e: "<strong><em>Volvox</em></strong> (along with <em>Pandorina</em> and <em>Eudorina</em>) exists as a spherical <strong>colony</strong>, whereas <strong><em>Spirogyra</em></strong> exists as an unbranched <strong>filament</strong> of cylindrical cells joined end-to-end.",
      src: "JAMB-style"
    },
    {
      q: "What structural feature distinguishes a true <strong>colony</strong> like <em>Volvox</em> from a simple cluster of independent cells?",
      o: [
        "Volvox cells are connected by fine cytoplasmic strands, coordinate their flagellar beating, and show reproductive division of labour between somatic cells and gonidia",
        "Volvox has a four-chambered heart and blood vessels",
        "Volvox cells have no nuclei or chloroplasts",
        "Volvox cells are joined end-to-end in a single unbranched chain"
      ],
      a: 0,
      e: "In <em>Volvox</em>, thousands of <em>Chlamydomonas</em>-like cells are linked by <strong>cytoplasmic bridges</strong> so their flagella beat in a coordinated wave, and only specialized <strong>gonidia</strong> reproduce.",
      src: "JAMB-style"
    },
    {
      q: "In the biological hierarchy of organisation, at what level is a complete <strong>onion bulb</strong> (or a <strong>hibiscus flower</strong>) classified?",
      o: [
        "Cell level",
        "Tissue level",
        "Organ level",
        "Cell organelle level"
      ],
      a: 2,
      e: "An <strong>onion bulb</strong> is an <strong>organ</strong> because it consists of several distinct tissues working together: scale-leaf epidermis, fleshy storage parenchyma, vascular bundles (xylem &amp; phloem), and a stem disc.",
      src: "WAEC-style"
    },
    {
      q: "Which of the following structures is at the <strong>tissue level</strong> of biological organisation?",
      o: [
        "Mammalian kidney",
        "Human blood (or plant xylem)",
        "Spermatozoon",
        "Mango leaf"
      ],
      a: 1,
      e: "<strong>Blood</strong> is a liquid connective <strong>tissue</strong> (and <strong>xylem</strong> is a vascular plant tissue), whereas a kidney and a leaf are organs and a spermatozoon is a single cell.",
      src: "NECO-style"
    },
    {
      q: "What is the primary function of the <strong>contractile vacuole</strong> in freshwater unicellular organisms such as <em>Amoeba</em>, <em>Paramecium</em>, and <em>Chlamydomonas</em>?",
      o: [
        "Photosynthesis of glucose from carbon dioxide",
        "Osmoregulation — collecting and actively expelling excess water that enters the cell by osmosis from the hypotonic freshwater habitat",
        "Locomotion through the water",
        "Storage of starch grains"
      ],
      a: 1,
      e: "Freshwater protozoans are hypertonic to pond water; the <strong>contractile vacuole</strong> prevents osmotic bursting (lysis) by rhythmically pumping out excess water.",
      src: "WAEC-style"
    },
    {
      q: "A cuboidal microscopic cell has side length <strong>L = 1 mm</strong>, while a larger cuboidal organism has side length <strong>L = 6 mm</strong>. How do their <strong>surface-area-to-volume ratios (SA ÷ V = 6 ÷ L)</strong> compare?",
      o: [
        "Both have SA ÷ V = 6 mm⁻¹",
        "The 1 mm cell has SA ÷ V = 6.0 mm⁻¹, whereas the 6 mm organism has SA ÷ V = 1.0 mm⁻¹ (one-sixth as much surface area per unit volume)",
        "The 6 mm organism has six times higher SA ÷ V than the 1 mm cell",
        "Surface-area-to-volume ratio increases linearly with side length L"
      ],
      a: 1,
      e: "For a cube, <code>SA = 6L²</code> and <code>V = L³</code>, so <code>SA ÷ V = 6 ÷ L</code>. At <code>L = 1 mm</code>, <code>SA/V = 6.0 mm⁻¹</code>; at <code>L = 6 mm</code>, <code>SA/V = 6 ÷ 6 = 1.0 mm⁻¹</code>.",
      src: "JAMB-style"
    },
    {
      q: "Why can an <em>Amoeba</em> rely on simple diffusion across its plasma membrane for gas exchange, whereas a Tilapia fish or human requires specialized gills or lungs and a circulatory system?",
      o: [
        "Amoeba does not use oxygen for respiration",
        "Amoeba has a very large surface-area-to-volume ratio (SA/V) and a tiny diffusion distance, whereas large multicellular animals have a small SA/V ratio and long internal diffusion paths",
        "Amoeba has haemoglobin inside its contractile vacuole",
        "Diffusion only occurs in unicellular organisms"
      ],
      a: 1,
      e: "As organism size <code>L</code> increases, volume <code>L³</code> (metabolic demand) grows much faster than surface area <code>6L²</code> (supply), so large organisms require specialized exchange surfaces and mass-transport systems.",
      src: "WAEC-style"
    },
    {
      q: "In <strong><em>Paramecium caudatum</em></strong>, what are the respective functions of the large kidney-shaped <strong>macronucleus</strong> and the small spherical <strong>micronucleus</strong>?",
      o: [
        "Macronucleus controls daily metabolic/vegetative activities; micronucleus controls sexual reproduction (conjugation) and heredity",
        "Macronucleus beats the cilia; micronucleus expels water",
        "Macronucleus performs photosynthesis; micronucleus stores starch",
        "Both nuclei digest bacteria inside food vacuoles"
      ],
      a: 0,
      e: "Ciliates are nuclear dimorphic: the polyploid <strong>macronucleus</strong> governs routine metabolism, while the diploid <strong>micronucleus</strong> exchanges genetic material during <strong>conjugation</strong>.",
      src: "JAMB-style"
    },
    {
      q: "At which level of biological organisation does the freshwater cnidarian <strong><em>Hydra</em></strong> exist?",
      o: [
        "Cellular level",
        "Tissue level (diploblastic: ectoderm and endoderm separated by non-cellular mesoglea, with no true organs)",
        "Organ system level",
        "Unicellular colonial level"
      ],
      a: 1,
      e: "<strong><em>Hydra</em></strong> has two organized cell layers (<strong>ectoderm</strong> and <strong>endoderm</strong>) forming tissues, but lacks true organs or organ systems.",
      src: "WAEC-style"
    },
    {
      q: "In <strong><em>Spirogyra</em></strong> and <strong><em>Chlamydomonas</em></strong>, small dense proteinaceous bodies embedded on the chloroplast that serve as centres for converting glucose into <strong>starch</strong> are called:",
      o: [
        "Pyrenoids",
        "Centrioles",
        "Lysosomes",
        "Trichocysts"
      ],
      a: 0,
      e: "<strong>Pyrenoids</strong> are dense bodies on algal chloroplasts associated with carbon fixation (RuBisCO) and rings of stored starch grains.",
      src: "NECO-style"
    },
    {
      q: "Which of the following is a <strong>disadvantage</strong> of increasing multicellular complexity and cell specialization?",
      o: [
        "Individual specialized cells lose their independence and cannot survive on their own if isolated from the organism",
        "The organism becomes unable to live in terrestrial habitats",
        "Division of labour reduces physiological efficiency",
        "The organism can no longer grow larger than 10 µm"
      ],
      a: 0,
      e: "While multicellularity brings high efficiency and division of labour, <strong>differentiated cells lose autonomy</strong> and depend entirely on the whole organism's internal environment.",
      src: "WAEC-style"
    }
  ];
})();
