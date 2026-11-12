/* Lesson 02 · Inside the Cell: Organelles, Plant vs Animal Cells — content data, organelle model and 12 exam-style quiz questions */
(function () {
  "use strict";

  /* ---------------------------------------------------------------
     Structural model of every part on the dissector.
     env   = the membranes that wrap the part (so membranes = env.length, never typed)
     size_um = a size taken from this unit's worked examples (null where the lesson gives none)
     contrast = what a school slide gives you: "stain" (iodine / methylene blue takes up), "colour" (natural green),
                "outline" (seen only as an edge or a clear space), "none" (nothing makes it show)
     On a school light microscope a detail is seen only if it is resolved (size_um >= LIMIT_UM or no size given)
     AND something makes it show (contrast is not "none"). This is the model behind the "school slide?" column.
     --------------------------------------------------------------- */
  var LIMIT_UM = 0.2;

  var ORG = {
    wall: {
      name: "Cell wall", short: "Cell wall",
      env: [], envNote: "None: it is cellulose, not a membrane",
      where: "plant", whereTxt: "Plant only",
      structure: "A stiff outer case of cellulose fibres outside the cell membrane.",
      job: "Holds the plant cell's shape and stops it bursting. It lets almost anything through (fully permeable).",
      size_um: null, contrast: "outline", slideNote: "its thick double outline shows clearly on an onion or cork slide",
      sort: "none"
    },
    membrane: {
      name: "Cell membrane", short: "Cell membrane",
      env: ["plasma"], envNote: "It is itself one membrane",
      where: "both", whereTxt: "Plant and animal",
      structure: "A thin living skin of lipid and protein just inside the wall (plant) or around the whole cell (animal).",
      job: "Chooses what enters and leaves the cell (selectively permeable).",
      size_um: null, contrast: "outline", slideNote: "you see only the edge of the cell, never the membrane itself"
    },
    nucleus: {
      name: "Nucleus", short: "Nucleus",
      env: ["outer", "inner"], envNote: "Two membranes with pores (the nuclear envelope)",
      where: "both", whereTxt: "Plant and animal",
      structure: "A round body wrapped in two membranes with pores; holds the nucleolus and chromatin.",
      job: "Directs the cell and carries its inherited instructions.",
      size_um: 10, contrast: "stain", slideNote: "iodine and methylene blue stain it, so it is the easiest organelle to label",
      sort: "double"
    },
    mitochondrion: {
      name: "Mitochondrion", short: "Mitochondrion",
      env: ["outer", "inner"], envNote: "Two membranes; the inner one is folded into cristae",
      where: "both", whereTxt: "Plant and animal",
      structure: "A rod or oval with two membranes. The inner membrane folds into cristae around the matrix.",
      job: "The power station: releases energy (ATP) in aerobic respiration.",
      size_um: 1, contrast: "none", slideNote: "it is bigger than the 0.2 µm limit, but no school stain colours it",
      sort: "double"
    },
    chloroplast: {
      name: "Chloroplast", short: "Chloroplast",
      env: ["outer", "inner"], envNote: "Two membranes around a stroma",
      where: "plant", whereTxt: "Green plant cells only",
      structure: "Two membranes around a stroma that holds stacks of grana containing chlorophyll.",
      job: "Captures light to make food (photosynthesis).",
      size_um: 5, contrast: "colour", slideNote: "chlorophyll makes it naturally green in a leaf cell (onion bulb cells have none)",
      sort: "double"
    },
    vacuole: {
      name: "Sap vacuole", short: "Sap vacuole",
      env: ["tonoplast"], envNote: "One membrane, the tonoplast",
      where: "both", whereTxt: "Plant: one large, central. Animal: small, short-lived",
      structure: "In plants one large space of cell sap lined by the tonoplast; in animals small and temporary.",
      job: "Keeps the plant cell firm. In freshwater protozoa such as Amoeba a contractile vacuole pumps out excess water.",
      size_um: null, contrast: "outline", slideNote: "a large clear space pushes the nucleus to the side in a plant cell",
      sort: "single"
    },
    er: {
      name: "Endoplasmic reticulum", short: "Rough ER",
      env: ["single"], envNote: "One membrane",
      where: "both", whereTxt: "Plant and animal",
      structure: "A network of flattened membrane channels, rough where ribosomes stud it.",
      job: "Carries materials through the cell; rough ER takes in new proteins made on its ribosomes.",
      size_um: null, contrast: "none", slideNote: "its fine membranes are not stained and are lost in the cytoplasm",
      sort: "single"
    },
    golgi: {
      name: "Golgi body", short: "Golgi body",
      env: ["single"], envNote: "One membrane",
      where: "both", whereTxt: "Plant and animal",
      structure: "A pile of flat membrane pouches with swollen ends.",
      job: "Sorts, packs and sends out the cell's products, and buds off lysosomes.",
      size_um: null, contrast: "none", slideNote: "it is not stained, so it cannot be told apart from the cytoplasm",
      sort: "single"
    },
    ribosome: {
      name: "Ribosome", short: "Ribosomes",
      env: [], envNote: "No membrane at all",
      where: "both", whereTxt: "All cells, even bacteria",
      structure: "A tiny grain of RNA and protein with no membrane; some float free, some stud the rough ER.",
      job: "Assembles proteins.",
      size_um: 0.025, contrast: "none", slideNote: "it is about 8 times below the 0.2 µm limit of a light microscope",
      sort: "none"
    },
    lysosome: {
      name: "Lysosome", short: "Lysosome",
      env: ["single"], envNote: "One membrane",
      where: "animal", whereTxt: "Common in animal cells, rare in plants",
      structure: "A small bag wrapped in one membrane, full of digestive enzymes.",
      job: "Breaks down worn-out parts and engulfed material.",
      size_um: null, contrast: "none", slideNote: "it is small, unstained and invisible on a school slide",
      sort: "single"
    },
    centrioles: {
      name: "Centrioles", short: "Centrioles",
      env: [], envNote: "No membrane",
      where: "animal", whereTxt: "Animal (flowering plants lack them)",
      structure: "A pair of tiny hollow rods lying at right angles near the nucleus.",
      job: "Build the spindle when an animal cell divides.",
      size_um: null, contrast: "none", slideNote: "they are too small and unstained to see on a school slide",
      sort: "none"
    },
    vacuoleA: {
      name: "Small vacuole", short: "Small vacuole",
      env: ["single"], envNote: "One membrane",
      where: "animal", whereTxt: "Animal: small, short-lived",
      structure: "A small temporary bubble in the cytoplasm.",
      job: "A short-term store. Animal cells have no large sap vacuole.",
      size_um: null, contrast: "none", slideNote: "too small to notice on a cheek-cell slide",
      count: "vacuole"
    },
    glycogen: {
      name: "Glycogen granules", short: "Glycogen",
      env: [], envNote: "No membrane",
      where: "animal", whereTxt: "Animal only",
      structure: "Tiny granules of stored carbohydrate in the cytoplasm.",
      job: "Stored food in animal cells (plant cells store starch instead).",
      size_um: null, contrast: "none", slideNote: "tiny and unstained",
      count: null
    }
  };

  // the 11 parts of the dissector that count towards the "8 organelles" target
  var PARTS = ["wall", "membrane", "nucleus", "mitochondrion", "chloroplast", "vacuole", "er", "golgi", "ribosome", "lysosome", "centrioles"];

  function modelFor(key) {
    var o = ORG[key];
    var membranes = o.env.length;
    var resolved = o.size_um == null ? true : o.size_um >= LIMIT_UM;
    var shows = o.contrast !== "none";
    var visible = resolved && shows;
    var why;
    if (o.size_um != null && !resolved) why = "No: " + o.slideNote + ".";
    else if (!shows) why = "No: " + o.slideNote + ".";
    else why = "Yes: " + o.slideNote + ".";
    return {
      key: key, name: o.name, short: o.short, membranes: membranes, envNote: o.envNote,
      where: o.where, whereTxt: o.whereTxt, structure: o.structure, job: o.job,
      slideVisible: visible, slideWhy: why, size_um: o.size_um
    };
  }

  window.L02 = {
    LIMIT_UM: LIMIT_UM,
    ORG: ORG,
    PARTS: PARTS,
    modelFor: modelFor,

    // ---- 2A sort: how many membranes? (10 items) ----
    items: [
      { id: "nucleus", name: "Nucleus", emo: "🧬", bin: "double", why: "The nuclear envelope is two membranes with pores." },
      { id: "mito", name: "Mitochondrion", emo: "🔋", bin: "double", why: "An outer membrane plus an inner membrane folded into cristae." },
      { id: "chloro", name: "Chloroplast", emo: "🌿", bin: "double", why: "Two membranes around the stroma and its grana." },
      { id: "lyso", name: "Lysosome", emo: "🧪", bin: "single", why: "A single membrane around digestive enzymes." },
      { id: "vac", name: "Vacuole with tonoplast", emo: "💧", bin: "single", why: "The sap vacuole is bounded by one membrane, the tonoplast." },
      { id: "er", name: "Endoplasmic reticulum", emo: "🕸️", bin: "single", why: "A network of channels made of one membrane." },
      { id: "golgi", name: "Golgi body", emo: "📚", bin: "single", why: "A pile of flat pouches, each made of one membrane." },
      { id: "ribo", name: "Ribosome", emo: "⚫", bin: "none", why: "A grain of RNA and protein with no membrane, so even bacteria have them." },
      { id: "centri", name: "Centrioles", emo: "🥢", bin: "none", why: "Hollow protein rods with no membrane." },
      { id: "wall", name: "Cell wall", emo: "🧱", bin: "none", why: "It is not a membrane at all: it is cellulose." }
    ],
    binLabels: { double: "Double membrane (2)", single: "Single membrane (1)", none: "No membrane (0)" },

    // ---- explorer pins: how many membranes? (computed from the model above) ----
    pins: [0, 1, 2].map(function (n) {
      var list = [];
      Object.keys(ORG).forEach(function (k) {
        var o = ORG[k];
        if (o.sort === undefined) return; // only the ten items from the sort game
        if (o.env.length === n) list.push(k);
      });
      return { n: n, list: list };
    }),

    // ---- table rows: plant / animal presence ----
    // P / A: "yes" present, "no" absent, "small" small or rare
    rows: [
      { k: "wall", P: "yes", A: "no" },
      { k: "membrane", P: "yes", A: "yes" },
      { k: "nucleus", P: "yes", A: "yes" },
      { k: "mitochondrion", P: "yes", A: "yes" },
      { k: "chloroplast", P: "yes", A: "no" },
      { k: "vacuole", P: "yes", A: "small" },
      { k: "er", P: "yes", A: "yes" },
      { k: "golgi", P: "yes", A: "yes" },
      { k: "ribosome", P: "yes", A: "yes" },
      { k: "lysosome", P: "small", A: "yes" },
      { k: "centrioles", P: "no", A: "yes" }
    ]
  };

  // ---- 12 exam-style quiz questions (03-questions.md, Lesson 02, Part 1) ----
  window.LESSON_QUIZ = [
    {
      q: "Coach Danjuma trains sprinters at the Teslim Balogun Stadium. A thigh-muscle cell of one of his athletes contracts many times a minute during a race. Which organelle would you expect to find in unusually large numbers in this cell?",
      o: ["Mitochondria", "Lysosomes", "Centrioles", "Chloroplasts"],
      a: 0,
      e: "Muscle contraction needs a constant supply of energy. Mitochondria carry out aerobic respiration and release that energy as ATP, so very active cells such as muscle cells are packed with them. Lysosomes hold digestive enzymes for breaking down worn-out parts; they do not supply energy. Chloroplasts are never found in animal cells.",
      src: "WAEC-style · Apply"
    },
    {
      q: "Which of the following cell structures is NOT bounded by any membrane?",
      o: ["Lysosome", "Mitochondrion", "Ribosome", "Golgi body"],
      a: 2,
      e: "A ribosome is a tiny granule of RNA and protein with no membrane at all, which is why ribosomes are found even in prokaryotes. The lysosome and Golgi body each have one membrane; the mitochondrion has two (an outer membrane and an inner one folded into cristae).",
      src: "JAMB-style · Remember"
    },
    {
      q: "In which of the following pairs is EACH organelle bounded by a double membrane?",
      o: ["Nucleus and lysosome", "Mitochondrion and endoplasmic reticulum", "Chloroplast and ribosome", "Nucleus and chloroplast"],
      a: 3,
      e: "The nucleus (nuclear envelope with pores), the mitochondrion and the chloroplast are the three double-membrane organelles. Option A fails because the lysosome has a single membrane; B fails because the ER is single-membraned; C fails because the ribosome has no membrane.",
      src: "NECO-style · Understand"
    },
    {
      q: "At Mama Ngozi's stall, Chinedu drew up this comparison table for his homework. Which row contains an error?",
      o: ["Cell wall: plant cell present | animal cell absent", "Food stored as: plant cell starch | animal cell glycogen", "Position of nucleus: plant cell central | animal cell at the side", "Centrioles: plant cell absent | animal cell present"],
      a: 2,
      e: "The row is reversed. In a mature plant cell the large central sap vacuole pushes the nucleus and cytoplasm to the side; in an animal cell the nucleus is usually central. Rows A, B and D are all correct. Row D is a common worry, but centrioles are absent from flowering-plant cells and present in animal cells.",
      src: "WAEC-style · Analyse"
    },
    {
      q: "Mama Ngozi's nephew soaked ugu leaves in salty water. The salt solution passed straight through the outer layer of each leaf cell and reached the layer beneath it. Which statement correctly explains this?",
      o: ["The cell membrane is fully permeable, while the cell wall is selectively permeable.", "The cellulose cell wall is fully permeable; it is the cell membrane beneath it that controls entry and exit.", "The cell wall is made of lipoprotein, which dissolves in salt water.", "The tonoplast lies outside the cell wall and lets salt in."],
      a: 1,
      e: "The cell wall is non-living cellulose with large gaps, so it is fully permeable and is not a membrane. The living lipoprotein cell membrane is selectively permeable and is the real “gatekeeper”. Option A reverses the two; C gives the wall the wrong chemical make-up; D puts the tonoplast in the wrong place (it surrounds the sap vacuole, deep inside the cell).",
      src: "WAEC-style · Understand"
    },
    {
      q: "A cell in the pancreas makes a digestive enzyme (a protein) and releases it out of the cell. Which sequence correctly traces the enzyme from where it is made to where it leaves?",
      o: ["Nucleus → ribosome → lysosome → cell membrane", "Ribosome → rough endoplasmic reticulum → Golgi body → cell membrane", "Golgi body → rough endoplasmic reticulum → ribosome → cell membrane", "Ribosome → mitochondrion → Golgi body → cell wall"],
      a: 1,
      e: "Proteins are built on ribosomes attached to the rough ER, carried along the ER channels, sent in vesicles to the Golgi body to be modified and packaged, and released when the vesicle fuses with the cell membrane. Option C runs the route backwards. The nucleus holds the instructions but does not make the protein, and an animal cell has no cell wall (option D).",
      src: "NECO-style · Apply"
    },
    {
      q: "Dr Amaka examines electron micrographs of a cell from a salivary gland, which secretes large amounts of the enzyme amylase. Which pair of organelles would be most abundant in this cell?",
      o: ["Rough endoplasmic reticulum and Golgi bodies", "Chloroplasts and sap vacuoles", "Centrioles and lysosomes", "Smooth endoplasmic reticulum and chloroplasts"],
      a: 0,
      e: "Amylase is a protein made for export, so a secretory cell needs lots of rough ER (ribosomes making and transporting protein) and many Golgi bodies (packaging and secreting it). Centrioles work in cell division, and lysosomes digest worn-out parts, so neither is linked to secretion. Chloroplasts are not found in human cells.",
      src: "JAMB-style · Analyse"
    },
    {
      q: "An electron micrograph at a magnification of ×40 000 shows a chloroplast with an image length of 200 mm. What is the actual length of the chloroplast?",
      o: ["0.5 µm", "50 µm", "5 mm", "5 µm"],
      a: 3,
      e: "Actual size = image size ÷ magnification = 200 mm ÷ 40 000 = 0.005 mm. Convert: 0.005 mm × 1000 = 5 µm. Option C is 0.005 mm wrongly written as 5 mm (the mm-to-µm conversion was skipped, so it is 1000 times too large); option B is a ×10 slip (50 µm) and option A a ÷10 slip (0.5 µm). Always change mm to µm (× 1000) after dividing.",
      src: "WAEC-style · Apply"
    },
    {
      q: "Chinedu's school microscope has a ×10 eyepiece and a ×10 objective. A mitochondrion in a cheek cell is 0.8 µm wide. The unaided eye can just make out a detail of about 0.1 mm. What is the width of the mitochondrion's image, and can he see it?",
      o: ["8 µm; visible", "0.08 mm; not visible", "0.8 mm; visible", "0.008 mm; not visible"],
      a: 1,
      e: "Total magnification = eyepiece × objective = 10 × 10 = ×100. Image size = actual size × magnification = 0.8 µm × 100 = 80 µm. Convert: 80 µm ÷ 1000 = 0.08 mm. Since 0.08 mm is less than 0.1 mm, the image is too small to see. Option A (and D, which is the same 8 µm written in mm) uses only one lens, 0.8 × 10, instead of the total magnification 10 × 10 = ×100; option C slips a factor of ten in the conversion.",
      src: "WAEC Practical · Apply"
    },
    {
      q: "Chinedu says, “If I keep turning to higher-power lenses on the school light microscope, I will eventually see ribosomes.” Which statement best explains why he is wrong?",
      o: ["Ribosomes are found only in prokaryotes, not in the cells used on school slides.", "Ribosomes are destroyed by the stain used on slides.", "Ribosomes are hidden behind the cell wall in every cell.", "A light microscope cannot separate details smaller than about 0.2 µm, and a ribosome (about 0.025 µm) is about 8 times smaller than that limit."],
      a: 3,
      e: "Magnifying a blurred image only makes a bigger blur. The limit is resolving power: about 0.2 µm for a light microscope, and 0.2 µm ÷ 0.025 µm = 8, so a ribosome is about eight times below the limit. An electron microscope is needed. Option A is false because ribosomes are found in both prokaryotes and eukaryotes. Option C is false because animal cells have no wall and the wall is not opaque anyway.",
      src: "JAMB-style · Analyse"
    },
    {
      q: "An organelle has a double membrane and contains stacks called grana surrounded by a fluid stroma. Which option names the organelle and its function correctly?",
      o: ["Mitochondrion; aerobic respiration", "Golgi body; packaging and secretion", "Chloroplast; photosynthesis", "Nucleus; control of cell activities"],
      a: 2,
      e: "Grana (stacks of thylakoids holding chlorophyll) in a stroma are found only in the chloroplast, which carries out photosynthesis. The mitochondrion also has two membranes, but its inner membrane is folded into cristae around a matrix, not grana in a stroma.",
      src: "WAEC-style · Remember"
    },
    {
      q: "Which of the following statements about cell structures is correct?",
      o: ["The tonoplast is a single membrane that surrounds the sap vacuole of a plant cell.", "Ribosomes are surrounded by a double membrane.", "The cell wall is a selectively permeable lipoprotein membrane.", "Cilia and flagella arise from mitochondria."],
      a: 0,
      e: "The large central vacuole of a plant cell is bounded by one membrane, the tonoplast. Ribosomes have no membrane (B); the cell wall is cellulose, fully permeable and not a membrane (C). Cilia and flagella arise from basal bodies, not mitochondria (D). Several online keys print D, but it is wrong.",
      src: "NECO-style · Understand"
    }
  ];
})();
