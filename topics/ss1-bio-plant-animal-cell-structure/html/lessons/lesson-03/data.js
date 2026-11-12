/* Lesson 03 · Forms of Cells and Levels of Organisation — content data, SA:V model and the 12 quiz questions */
(function () {
  "use strict";

  // ---- SA:V model (same equations as AgarCubeKit.model; dye depth 1.0 mm leaves the 1 mm and 2 mm cubes fully dyed) ----
  var DYE_DEPTH = 1.0, DYE_MIN = 30, TAU = 3;
  function model(L) {
    var depth = Math.min(DYE_DEPTH * (1 - Math.exp(-DYE_MIN / TAU)), L / 2);
    var core = Math.max(0, L - 2 * depth);
    var SA = 6 * L * L, V = L * L * L;
    return { L: L, L_mm: L, SA: SA, V: V, ratio: SA / V, depth_mm: depth, core_mm: core, undyedFraction: Math.pow(core / L, 3) };
  }
  function fmtRatio(r) { return r.toFixed(r >= 10 ? 1 : 1); }

  window.L03 = {
    DYE_DEPTH: DYE_DEPTH, DYE_MIN: DYE_MIN, TAU: TAU,
    model: model,
    cubes: [1, 2, 3, 4, 6],
    pins: [1, 2, 3, 4, 5, 6],

    // ---- 2A sort: How does it live? ----
    bins: {
      free: "Free-living single cell",
      "colony-filament": "Colony or filament",
      tissue: "Tissue level"
    },
    items: [
      { id: "amoeba", name: "Amoeba", emo: "A", bin: "free", why: "One cell that lives alone and does every job itself: it feeds, gets rid of water and moves with pseudopodia." },
      { id: "paramecium", name: "Paramecium", emo: "P", bin: "free", why: "A single slipper-shaped cell, swimming alone with its cilia." },
      { id: "euglena", name: "Euglena", emo: "E", bin: "free", why: "One complete cell with a flagellum, an eyespot and chloroplasts; it never needs partner cells." },
      { id: "chlamydomonas", name: "Chlamydomonas", emo: "C", bin: "free", why: "A single green cell with two flagella and a cup-shaped chloroplast." },
      { id: "volvox", name: "Volvox (hollow ball of similar cells)", emo: "V", bin: "colony-filament", why: "A colony: the cells are copies of one another and each can still feed, respire and move by itself." },
      { id: "spirogyra", name: "Spirogyra (unbranched chain of cells)", emo: "S", bin: "colony-filament", why: "A filament: identical cells joined end to end, with little sharing of jobs." },
      { id: "hydra", name: "Hydra (two cell layers)", emo: "H", bin: "tissue", why: "Cells have different jobs (catching food, digesting, covering) and could not survive apart: a tissue level." },
      { id: "epithelium", name: "Epithelium lining the cheek", emo: "e", bin: "tissue", why: "Similar cells working together as a covering layer: a tissue." },
      { id: "blood", name: "Blood", emo: "B", bin: "tissue", why: "A fluid tissue of different cells (red cells, white cells) with different jobs." }
    ],

    // ---- 2B station A: the seven pond organisms ----
    orgs: [
      { id: "amoeba", name: "Amoeba", form: "Free-living", nut: "Holozoic", tag: "Amoeba",
        info: "No fixed shape: pseudopodia flow out and wrap round food to make a food vacuole. A contractile vacuole pumps out excess water.",
        draw: "Draw an uneven outline, pseudopodia, nucleus, food vacuole, contractile vacuole." },
      { id: "paramecium", name: "Paramecium", form: "Free-living", nut: "Holozoic", tag: "Paramecium",
        info: "Slipper-shaped and covered in cilia. Cilia sweep food into the oral groove. It has a large macronucleus and a small micronucleus.",
        draw: "Draw the slipper outline, cilia, oral groove, two nuclei, two contractile vacuoles." },
      { id: "euglena", name: "Euglena", form: "Free-living", nut: "Autotrophic in light, saprophytic in darkness", tag: "Euglena",
        info: "A spindle with one whip-like flagellum, a red eyespot and chloroplasts. In light it makes its own food; in darkness it absorbs dissolved food. That mix puzzles classifiers.",
        draw: "Draw the spindle, flagellum, eyespot, chloroplasts, nucleus." },
      { id: "chlamydomonas", name: "Chlamydomonas", form: "Free-living", nut: "Autotrophic", tag: "Chlamydomonas",
        info: "A tiny green cell with two flagella, one cup-shaped chloroplast and a cellulose wall.",
        draw: "Draw the oval cell, two flagella, cup-shaped chloroplast, nucleus, wall." },
      { id: "volvox", name: "Volvox", form: "Colony", nut: "Autotrophic", tag: "Volvox",
        info: "A hollow sphere of Chlamydomonas-like cells linked by thin strands. The cells are alike and each can live a life of its own, so this is a colony.",
        draw: "Draw the hollow ball, the ring of cells, the strands, a daughter colony inside." },
      { id: "spirogyra", name: "Spirogyra", form: "Filament", nut: "Autotrophic", tag: "Spirogyra",
        info: "An unbranched chain of identical cylindrical cells. Each cell holds a spiral ribbon-shaped chloroplast.",
        draw: "Draw a few cells end to end, the spiral chloroplast, the nucleus, the cross-walls." },
      { id: "hydra", name: "Hydra", form: "Tissue level", nut: "Holozoic", tag: "Hydra",
        info: "A tube with two layers: an outer ectoderm and an inner endoderm. Cells have different jobs (catching food, digesting, covering) and cannot live apart.",
        draw: "Draw the tube, tentacles, ectoderm, endoderm, basal disc." }
    ],

    // ---- 2B station B: results table (computed from the model, not typed) ----
    SAoptions: ["6", "12", "24", "36", "54", "96", "144", "216"],
    Voptions: ["1", "4", "8", "16", "27", "64", "125", "216"],
    RatioOptions: ["1.0", "1.5", "2.0", "3.0", "4.0", "6.0", "12.0"],

    // ---- Make sense: level ladder ----
    levels: [
      { k: "Organelle", eg: "nucleus, chloroplast, mitochondrion" },
      { k: "Cell", eg: "Euglena, palisade cell, red blood cell" },
      { k: "Tissue", eg: "Hydra's two layers, epithelium, blood" },
      { k: "Organ", eg: "onion bulb, heart, leaf" },
      { k: "System", eg: "digestive system, excretory system" },
      { k: "Organism", eg: "Chinedu, an ugu plant, an Amoeba" }
    ],

    // ---- Bridge: scaling up ----
    bridgeSizes: [
      { id: "amoeba", name: "Amoeba", L: 0.1 },
      { id: "grain", name: "Sand grain", L: 1 },
      { id: "mouse", name: "Mouse", L: 10 },
      { id: "frog", name: "Small frog", L: 30 }
    ],
    bridge: {
      q: "Dr Amaka's patient needs blood to carry water and food to every cell. Why can the body not simply rely on diffusion from the skin?",
      o: [
        "The body is big, so its SA:V is small and most cells are far from the surface",
        "Skin is waterproof, so no substance can ever pass through it",
        "Body cells are too small to take in materials by diffusion",
        "Blood is needed only to keep the body warm"
      ],
      a: 0,
      why: "A big body has a small SA:V (6 ÷ L falls as L grows), so most cells sit far from the surface and diffusion alone is far too slow. The blood system moves materials the long way."
    }
  };

  // ---- 12 MCQs (03-questions.md § Lesson 03, keys unchanged) ----
  window.LESSON_QUIZ = [
    {
      q: "At the LUTH lab, Dr Amaka shows Chinedu a green thread from a pond. Under the microscope it is an unbranched chain of identical cylindrical cells, each with ribbon-shaped chloroplasts coiled like a spring. The organism is",
      o: ["<em>Volvox</em>", "<em>Chlamydomonas</em>", "<em>Spirogyra</em>", "<em>Hydra</em>"],
      a: 2,
      e: "An unbranched filament of similar cells with spiral ribbon chloroplasts is the mark of <em>Spirogyra</em>, the filamentous form. <em>Volvox</em> (the main distractor) is also many-celled and green, but its cells form a hollow sphere, not a thread, and each cell has a cup-shaped chloroplast like <em>Chlamydomonas</em>."
    },
    {
      q: "A drop of green drain water from beside Mile 12 Market contains a single-celled organism that is spindle-shaped, swims with one long flagellum, has a red eyespot near the front and contains many chloroplasts. Which organism is it, and which form of existence does it show?",
      o: ["<em>Euglena</em>; free-living single cell", "<em>Chlamydomonas</em>; free-living single cell", "<em>Euglena</em>; colony", "<em>Paramecium</em>; free-living single cell"],
      a: 0,
      e: "Spindle shape, a single flagellum, an eyespot and chloroplasts identify <em>Euglena</em>, which lives alone as one complete cell. <em>Chlamydomonas</em> (main distractor) is also green and free-living, but it has <strong>two</strong> flagella, one cup-shaped chloroplast and a cellulose wall. <em>Paramecium</em> is slipper-shaped and covered in cilia, with no chloroplasts."
    },
    {
      q: "Coach Danjuma insists that <em>Volvox</em> is a tissue \"because it is made of many cells\". The best reason for classifying <em>Volvox</em> as a colony and not a tissue is that its cells",
      o: ["are joined to one another by cytoplasmic strands", "contain chloroplasts and make their own food", "are arranged in a hollow sphere", "are alike, and each carries out nearly all life processes by itself"],
      a: 3,
      e: "What separates a colony from a tissue is the lack of division of labour: every <em>Volvox</em> cell looks alike and is nearly self-sufficient. In a tissue, by contrast, the jobs are shared out: each cell does one task well and could not survive on its own. Option A (main distractor) is a true feature of <em>Volvox</em>, but being linked by strands does not make the cells specialised, so it is not the reason it is a colony. B and C are true but do not separate a colony from a tissue."
    },
    {
      q: "Which pair of organisms shows the colonial level and the tissue level of organisation respectively?",
      o: ["<em>Spirogyra</em> and <em>Chlamydomonas</em>", "<em>Volvox</em> and <em>Hydra</em>", "<em>Hydra</em> and <em>Volvox</em>", "<em>Paramecium</em> and <em>Hydra</em>"],
      a: 1,
      e: "<em>Volvox</em> is a colony (a hollow ball of similar cells); <em>Hydra</em> is at the tissue level, with two specialised cell layers, the ectoderm and endoderm. Option C (main distractor) names the right organisms in the wrong order; read \"respectively\" carefully. <em>Paramecium</em> is a single free-living cell, not a colony, and <em>Chlamydomonas</em> is a single cell, not a tissue."
    },
    {
      q: "Chinedu puts two jars of pond water rich in rotting leaves and dissolved organic matter in a dark cupboard at home. After three weeks the <em>Chlamydomonas</em> in one jar have died, but the <em>Euglena</em> in the other jar are still alive. The most likely explanation is that <em>Euglena</em>",
      o: ["photosynthesises using light stored in its eyespot", "engulfs other organisms with pseudopodia, as <em>Amoeba</em> does", "switches to saprophytic nutrition, absorbing dissolved organic food through its surface", "carries out holozoic nutrition through its oral groove"],
      a: 2,
      e: "In light <em>Euglena</em> is autotrophic, but in darkness its chloroplasts cannot work and it survives by <strong>saprophytic</strong> nutrition, absorbing dissolved organic substances. <em>Chlamydomonas</em> is only autotrophic, so it dies without light. Option D (main distractor) describes <em>Paramecium</em>: <em>Euglena</em> has no oral groove and is not described as holozoic. The eyespot detects light; it cannot store it (A), and pseudopodia belong to <em>Amoeba</em> (B)."
    },
    {
      q: "Which of the following pairs of organisms are both holozoic?",
      o: ["<em>Amoeba</em> and <em>Paramecium</em>", "<em>Chlamydomonas</em> and <em>Spirogyra</em>", "<em>Euglena</em> in light and <em>Amoeba</em>", "<em>Volvox</em> and <em>Paramecium</em>"],
      a: 0,
      e: "Holozoic organisms take in solid food and digest it inside the body: <em>Amoeba</em> surrounds food with pseudopodia to form a food vacuole, and <em>Paramecium</em> sweeps food into its oral groove with cilia. Option C (main distractor) fails because <em>Euglena</em> in light is autotrophic. <em>Chlamydomonas</em>, <em>Spirogyra</em> and <em>Volvox</em> all photosynthesise (autotrophic)."
    },
    {
      q: "Which of the following shows the correct sequence of levels of organisation from the simplest to the most complex?",
      o: ["Cell → organ → tissue → system → organism", "Tissue → cell → organ → system → organism", "Cell → tissue → system → organ → organism", "Cell → tissue → organ → system → organism"],
      a: 3,
      e: "Cells of one kind form a tissue; tissues together form an organ; organs working together form a system; systems together make the organism. Option C (main distractor) swaps organ and system: a system (e.g. the digestive system) is <strong>made of</strong> organs (stomach, liver), so it must come after the organ."
    },
    {
      q: "Which list is arranged in order of increasing complexity?",
      o: ["Palisade cell, chloroplast, leaf, palisade mesophyll, ugu plant, shoot system", "Chloroplast, palisade cell, palisade mesophyll, leaf, shoot system, ugu plant", "Chloroplast, palisade mesophyll, palisade cell, shoot system, leaf, ugu plant", "Ugu plant, shoot system, leaf, palisade mesophyll, palisade cell, chloroplast"],
      a: 1,
      e: "Chloroplast = organelle → palisade cell = cell → palisade mesophyll = tissue → leaf = organ → shoot system = system → ugu plant = organism. Option D (main distractor) is the correct ladder written backwards (decreasing complexity). Option C puts the tissue (palisade mesophyll) before the cell (palisade cell) and the system before the organ; option A starts with the cell instead of the organelle and swaps organ/tissue and organism/system."
    },
    {
      q: "Chinedu cuts a cube of agar with sides of 8 mm. What is its surface area to volume ratio?",
      o: ["1.33 mm⁻¹", "8.0 mm⁻¹", "0.75 mm⁻¹", "48 mm⁻¹"],
      a: 2,
      e: "SA = 6L² = 6 × 8² = 6 × 64 = 384 mm². V = L³ = 8³ = 512 mm³. SA:V = SA ÷ V = 384 ÷ 512 = 0.75 mm⁻¹ (check: 6/L = 6/8 = 0.75 mm⁻¹). Option A (main distractor) is V ÷ SA = 512 ÷ 384 = 1.33, the ratio upside down. Option D is 6 × L, which multiplies instead of dividing."
    },
    {
      q: "Two agar cubes have sides of 0.5 mm and 10 mm. How many times greater is the surface area to volume ratio of the smaller cube than that of the larger cube?",
      o: ["0.05", "400", "5", "20"],
      a: 3,
      e: "Small cube: SA:V = 6/L = 6/0.5 = 12 mm⁻¹ (SA = 6 × 0.5² = 1.5 mm², V = 0.5³ = 0.125 mm³, 1.5 ÷ 0.125 = 12 mm⁻¹). Large cube: SA:V = 6/L = 6/10 = 0.6 mm⁻¹ (SA = 600 mm², V = 1000 mm³). Comparison = 12 ÷ 0.6 = 20 times. Because SA:V = 6/L, the ratio scales by the side ratio, 10 ÷ 0.5 = 20. Option B (main distractor) is (10 ÷ 0.5)² = 400, which compares surface areas only, not SA:V. Option A is the comparison written the wrong way round (0.6 ÷ 12)."
    },
    {
      q: "In the cube bench, a yam cube soaked in dye records a surface area to volume ratio of 0.4 mm⁻¹. Using SA:V = 6/L, what is the length of one side of the cube?",
      o: ["15 mm", "2.4 mm", "0.067 mm", "37.5 mm"],
      a: 0,
      e: "SA:V = 6/L, so L = 6 ÷ SA:V = 6 ÷ 0.4 mm⁻¹ = 15 mm. Check: SA = 6 × 15² = 1350 mm², V = 15³ = 3375 mm³, 1350 ÷ 3375 = 0.4 mm⁻¹. Option B (main distractor) multiplies 6 × 0.4 = 2.4 instead of dividing. Option C is 0.4 ÷ 6, the formula inverted."
    },
    {
      q: "A goat needs a heart and blood vessels to supply its body with oxygen, but a <em>Paramecium</em> does not. The main reason is that the goat",
      o: ["has more mitochondria in each of its cells than <em>Paramecium</em>", "has a small surface area to volume ratio, so diffusion alone is too slow to reach cells deep inside its body", "lives on land, where there is less oxygen than in water", "has a large surface area to volume ratio, so it loses oxygen too quickly"],
      a: 1,
      e: "As an organism gets bigger, its volume grows faster than its surface, so SA:V falls. Most goat cells are far from the body surface and diffusion over such distances is far too slow, so a transport system (heart, blood, vessels) is needed. <em>Paramecium</em>'s large SA:V and tiny size mean diffusion across its membrane is enough. Option D (main distractor) has the ratio the wrong way round: a large animal has a <strong>small</strong> SA:V. Air actually holds more oxygen than water, so C is false."
    }
  ];
})();
