/* Lesson 05 · WAEC Paper 3 Practical — Wet-Mount Microscopy, Cytological Staining & Biological Drawing Clinic — content data and 12 WAEC/NECO/JAMB quiz questions */
(function () {
  "use strict";

  window.L05 = {
    // ---- 1. Cytological Staining, Wet-Mount Protocol & WAEC Drawing Rule Sort ----
    items: [
      { id: "iodine", name: "Iodine solution (I₂/KI) — stains onion nucleus yellowish-brown & starch blue-black", emo: "🧅", bin: "shm", why: "Wet-Mount & Staining Rule: Standard WAEC stain for plant epidermal wet mounts and starch grains." },
      { id: "methblue", name: "Methylene blue — stains animal cheek cell nuclei dark blue", emo: "🧪", bin: "shm", why: "Wet-Mount & Staining Rule: Basic dye that binds strongly to negatively charged DNA/RNA in animal cell nuclei." },
      { id: "acetocarmine", name: "Acetocarmine / aceto-orcein — stains dividing chromosomes crimson red", emo: "🧬", bin: "shm", why: "Wet-Mount & Staining Rule: Used in root-tip squash preparations to make mitotic and meiotic chromosomes visible." },
      { id: "angle45", name: "Lowering the coverslip gently at a 45° angle with a mounting needle", emo: "📐", bin: "shm", why: "Wet-Mount & Staining Rule: Drives out air sideways so no dark-rimmed air bubbles are trapped over the specimen." },
      { id: "hbpencil", name: "Drawing clear, single, continuous outlines with a sharp HB/2H pencil", emo: "✏️", bin: "periodic", why: "WAEC Biological Drawing Rule: Mandatory for earning clarity-of-line (CL) marks in WAEC Paper 3." },
      { id: "rulerguide", name: "Ruling horizontal, uncrossed label lines WITHOUT arrowheads", emo: "📏", bin: "periodic", why: "WAEC Biological Drawing Rule: Guideline lines must touch the exact structure, never cross each other, and never carry arrowheads." },
      { id: "doublewall", name: "Drawing a double line to represent the thickness of a plant cell wall", emo: "🧱", bin: "periodic", why: "WAEC Biological Drawing Rule: Plant cell walls have measurable thickness; animal plasma membranes are drawn as a single line." },
      { id: "titlemag", name: "Writing the full title and linear magnification (e.g., ×400) below the drawing", emo: "🏷️", bin: "periodic", why: "WAEC Biological Drawing Rule: Every biological drawing must state what specimen view is shown and at what magnification." },
      { id: "shading", name: "Artistic shading, painting, or cross-hatching inside the vacuole or cytoplasm", emo: "🎨", bin: "non", why: "Disallowed WAEC Drawing Fault: Shading or colouring is strictly penalized in biological drawings (only sparse stippling if needed)." },
      { id: "feathery", name: "Sketchy, broken, feathery, or overlapping woollen outline strokes", emo: "〰️", bin: "non", why: "Disallowed WAEC Drawing Fault: Costs the candidate all Clarity of Line (CL) marks in WAEC Paper 3." },
      { id: "arrowheads", name: "Putting arrowheads on label lines or crossing two label lines", emo: "🏹", bin: "non", why: "Disallowed WAEC Drawing Fault: Arrowheads and crossed guidelines lose Neatness of Labels (NL) marks." },
      { id: "airbubble", name: "Dropping the coverslip flat from above & drawing dark-rimmed air bubbles", emo: "🫧", bin: "non", why: "Disallowed WAEC Drawing Fault: Dropping a coverslip flat traps round air bubbles with thick black rings; never draw air bubbles as cells!" }
    ],

    // ---- 2. 3D Wet-Mount & Field-of-View Calibration Bench trials (D_FOV = 180,000 ÷ M µm; Onion cell length A = 75 µm) ----
    trials: [
      { label: "A", L: 40,  t: "4500", T: "60.0", T2: "75.0" },
      { label: "B", L: 100, t: "1800", T: "24.0", T2: "75.0" },
      { label: "C", L: 200, t: "900",  T: "12.0", T2: "75.0" },
      { label: "D", L: 400, t: "450",  T: "6.0",  T2: "75.0" },
      { label: "E", L: 600, t: "300",  T: "4.0",  T2: "75.0" }
    ],
    tOptions: ["300", "450", "900", "1800", "4500"],
    TOptions: ["4.0", "6.0", "12.0", "24.0", "60.0"],
    T2Options: ["25.0", "50.0", "75.0", "100.0", "150.0"],

    // ---- 3. Light vs Electron Microscopy & Cytological Staining Explorer pins ----
    pins: [
      { frac: -1.0, label: "1. Wet-Mount Coverslip (45°)", emo: "📐", x: "Mounting needle at 45° angle", v: "Expels air bubbles", a: "Blot excess stain with filter paper", ke: "No dark rings", pe: "Flat coverslip", note: "Rest one edge of the glass coverslip in the drop of stain and lower it slowly at 45° with a mounting needle to avoid trapping air bubbles." },
      { frac: -0.5, label: "2. Iodine vs Methylene Blue", emo: "🧪", x: "Vital & Differential Stains", v: "Iodine → Onion (Yellow-brown / Blue-black)", a: "Methylene Blue → Cheek (Dark blue nucleus)", ke: "Increases contrast", pe: "Reveals transparent nuclei", note: "Unstained cytoplasm and nuclei are nearly transparent; iodine stains plant walls/nuclei amber and starch blue-black, while methylene blue stains animal nuclei deep blue." },
      { frac: 0.0,  label: "3. Field-of-View Calibration", emo: "🔬", x: "D₂ = D₁ × (M₁ ÷ M₂)", v: "×100 → D₁ = 1800 µm", a: "×400 → D₂ = 450 µm (¼ width)", ke: "A = D_FOV ÷ N_cells", pe: "450 ÷ 6 = 75 µm", note: "Increasing magnification 4× from ×100 to ×400 divides the field-of-view diameter by 4 (1800 µm → 450 µm)." },
      { frac: 0.5,  label: "4. WAEC Drawing Rubric", emo: "✏️", x: "CL + Sz + NL + Title + Mag", v: "Sharp HB pencil, single continuous lines", a: "Horizontal ruled guidelines, no arrows", ke: "Double line = Cell wall", pe: "Zero shading!", note: "WAEC Paper 3 awards marks for Clarity of Lines (CL), Size ≥ 6–8 cm (Sz), Neatness of Labels (NL), Title, and Magnification (M = I ÷ A)." },
      { frac: 1.0,  label: "5. Light vs Electron Scope", emo: "⚡", x: "Optical (×1500) vs EM (×500,000)", v: "Light: Living or dead, colour, 200 nm", a: "TEM/SEM: Dead in vacuum, B&W, 0.2 nm", ke: "1000× finer resolution", pe: "Electromagnet lenses", note: "Light microscopes use glass lenses and visible light (can view living cells in colour); Electron microscopes use electromagnetic lenses in a vacuum (dead specimens only, 0.2 nm resolution)." }
    ]
  };

  // ---- 4. 12 WAEC / NECO / JAMB Quiz Questions ----
  window.LESSON_QUIZ = [
    {
      q: "When preparing a temporary wet-mount slide of onion epidermis, why must the coverslip be lowered gently at a <strong>45° angle using a mounting needle</strong> rather than dropped flat from above?",
      o: [
        "To increase the magnification of the objective lens",
        "To prevent trapping air bubbles beneath the coverslip that would obscure the specimen as dark-rimmed circles",
        "To crush the cellulose cell walls so the nuclei spill out",
        "To convert iodine solution into methylene blue"
      ],
      a: 1,
      e: "Lowering the coverslip at a <strong>45° angle</strong> allows the liquid front to push air out sideways, preventing <strong>air bubbles</strong>.",
      src: "WAEC Practical"
    },
    {
      q: "Which pair of cytological stains is most appropriate for staining (i) an <strong>onion scale-leaf epidermal peel</strong> and (ii) a <strong>human cheek epithelial smear</strong> respectively in a school laboratory?",
      o: [
        "Sudan III for onion epidermis; Benedict's solution for cheek cells",
        "Iodine solution for onion epidermis; methylene blue for human cheek cells",
        "Million's reagent for onion epidermis; distilled water for cheek cells",
        "Fehling's solution for both specimens"
      ],
      a: 1,
      e: "<strong>Iodine solution</strong> stains plant cell walls/nuclei yellowish-brown and starch grains blue-black, while <strong>methylene blue</strong> stains animal cell nuclei dark blue.",
      src: "WAEC Practical"
    },
    {
      q: "Why do we peel the <strong>thin translucent inner epidermis</strong> from a fleshy onion scale leaf rather than slicing a thick chunk of the bulb for light microscopy?",
      o: [
        "The inner epidermis is a single layer of cells (one cell thick), allowing light from the microscope mirror/illuminator to pass clearly through the specimen without overlapping cell layers",
        "The inner epidermis contains no cell walls",
        "Thick chunks of onion dissolve the glass slide",
        "Only the inner epidermis contains DNA"
      ],
      a: 0,
      e: "A compound light microscope transmits light through the specimen; a <strong>single-cell-thick monolayer</strong> prevents overlapping shadows and brings individual cells into crisp focus.",
      src: "WAEC Practical"
    },
    {
      q: "Which of the following practices will cause a candidate to <strong>lose marks</strong> in a WAEC Biology Paper 3 biological drawing?",
      o: [
        "Using a sharp HB pencil to draw clear, single, continuous outlines",
        "Drawing a double line to represent the thickness of the plant cell wall",
        "Shading the nucleus with pencil strokes and putting arrowheads at the ends of crossed label lines",
        "Writing the title and linear magnification below the drawing"
      ],
      a: 2,
      e: "WAEC Paper 3 strictly penalises <strong>artistic shading</strong>, <strong>feathery/broken lines</strong>, <strong>crossed label lines</strong>, and <strong>arrowheads on guidelines</strong>.",
      src: "WAEC Practical"
    },
    {
      q: "At a total magnification of <strong>×100</strong>, the diameter of the circular field of view of a microscope is measured with a transparent ruler as <strong>1.8 mm (1800 µm)</strong>. What is the diameter of the field of view when the student switches to high power (<strong>×400</strong>)?",
      o: ["7200 µm", "1800 µm", "450 µm", "180 µm"],
      a: 2,
      e: "Field-of-view diameter is inversely proportional to magnification: <code>D_2 = D_1 × (M_1 ÷ M_2) = 1800 × (100 ÷ 400) = 1800 ÷ 4 = 450 µm</code>.",
      src: "JAMB-style"
    },
    {
      q: "Across the <strong>450 µm</strong> high-power (×400) field of view of a microscope, <strong>6 onion epidermal cells</strong> fit end-to-end along the diameter. What is the mean actual length of one onion cell?",
      o: ["7.5 µm", "75 µm", "270 µm", "2700 µm"],
      a: 1,
      e: "Mean cell length <code>A = D_FOV ÷ N_cells = 450 µm ÷ 6 = 75 µm</code>.",
      src: "WAEC Practical"
    },
    {
      q: "A student draws one of these <strong>75 µm</strong> onion cells so that her biological drawing is <strong>90 mm</strong> long on the exam script. What magnification should she write beside her title?",
      o: ["×1.2", "×120", "×1200", "×6750"],
      a: 2,
      e: "Convert drawing length to µm: <code>I = 90 mm × 1000 = 90000 µm</code>. Then <code>M = I ÷ A = 90000 ÷ 75 = ×1200</code>.",
      src: "WAEC Practical"
    },
    {
      q: "If a student notices a perfectly circular structure with a thick, dark black rim and a bright featureless centre under the microscope, what is she looking at?",
      o: [
        "A dividing nucleus in metaphase",
        "A trapped air bubble under the coverslip (an artefact that must NOT be drawn)",
        "A giant mitochondrion",
        "A starch grain stained with iodine"
      ],
      a: 1,
      e: "A <strong>trapped air bubble</strong> appears as a sharp circle with a heavy black refractive border and an empty bright centre.",
      src: "WAEC Practical"
    },
    {
      q: "Which statement accurately contrasts a <strong>Compound Light Microscope</strong> with a <strong>Transmission Electron Microscope (TEM)</strong>?",
      o: [
        "A light microscope requires a high vacuum and kills all specimens, whereas a TEM can view living swimming Paramecium in natural colour",
        "A light microscope uses glass lenses, visible light, and can view living or dead cells in colour (resolution ~200 nm), whereas a TEM uses electromagnetic lenses and an electron beam in a vacuum on dead ultrathin sections (resolution ~0.2 nm)",
        "A light microscope has a higher resolving power than an electron microscope",
        "Both microscopes use electromagnetic lenses and require gold-coated specimens"
      ],
      a: 1,
      e: "Light microscopes view <strong>living or dead specimens in colour</strong> using glass lenses (<code>200 nm</code> resolution), whereas electron microscopes require <strong>dead dehydrated specimens in a vacuum</strong> using electromagnetic lenses (<code>0.2 nm</code> resolution).",
      src: "JAMB-style"
    },
    {
      q: "Which cytological stain is specifically used on root-tip squash preparations to stain <strong>chromosomes</strong> deep red during mitosis studies?",
      o: [
        "Acetocarmine (or aceto-orcein)",
        "Sudan III",
        "Biuret reagent",
        "Cobalt chloride"
      ],
      a: 0,
      e: "<strong>Acetocarmine</strong> and <strong>aceto-orcein</strong> bind selectively to chromatin/chromosomes in dividing cells.",
      src: "NECO-style"
    },
    {
      q: "When representing a <strong>plant epidermal cell</strong> versus a <strong>human cheek cell</strong> in a WAEC Paper 3 drawing, how should their outer boundaries be drawn?",
      o: [
        "Both with shaded thick borders",
        "The plant cell with a double line to show the thickness of the cellulose cell wall; the cheek cell with a single continuous line for the thin plasma membrane",
        "The plant cell with a dotted line; the cheek cell with a double line",
        "Both with freehand wavy cross-hatched lines"
      ],
      a: 1,
      e: "In WAEC biological drawings, a <strong>plant cell wall</strong> is drawn with a <strong>double line</strong>, whereas an <strong>animal plasma membrane</strong> is drawn with a <strong>single continuous line</strong>.",
      src: "WAEC Practical"
    },
    {
      q: "Why should excess stain around the edges of a coverslip be blotted gently with a strip of <strong>filter paper</strong> before placing the slide on the microscope stage?",
      o: [
        "To prevent the stain from wetting the objective lens or sticking the slide to the stage, and to pull the coverslip flat for a sharp image",
        "To remove all water so the cells dry out completely",
        "To wash away the nucleus from the cytoplasm",
        "To turn the glass slide into a mirror"
      ],
      a: 0,
      e: "Blotting excess liquid keeps the microscope stage and objective lenses clean and draws stain evenly across the specimen under the coverslip.",
      src: "WAEC Practical"
    }
  ];
})();
