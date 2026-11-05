/* Lesson 01 · Discovery of the Cell, Cell Theory & Prokaryotes vs Eukaryotes — content data and 12 WAEC/NECO/JAMB quiz questions */
(function () {
  "use strict";

  window.L01 = {
    // ---- 1. Cell Pioneers & Prokaryote vs Eukaryote Sort items ----
    items: [
      { id: "hooke", name: "Robert Hooke (1665) — honeycomb 'cellulae' in cork", emo: "🔬", bin: "shm", why: "Cell Theory Pioneer: Hooke coined the term 'cell' in 1665 after viewing dead suberised cork cell walls." },
      { id: "schleiden", name: "Matthias Schleiden (1838) — all plants are built of cells", emo: "🌿", bin: "shm", why: "Cell Theory Pioneer: German botanist who established that all plant tissues originate from cells." },
      { id: "schwann", name: "Theodor Schwann (1839) — all animals are built of cells", emo: "🦌", bin: "shm", why: "Cell Theory Pioneer: German zoologist who unified botany and zoology into the classical Cell Theory." },
      { id: "virchow", name: "Rudolf Virchow (1855) — Omnis cellula e cellula", emo: "🧬", bin: "shm", why: "Cell Theory Pioneer: Proved that every new cell arises only by division of a pre-existing living cell." },
      { id: "nucleoid", name: "Circular naked DNA in a cytoplasmic nucleoid (no envelope)", emo: "🦠", bin: "periodic", why: "Prokaryotic Feature: Bacteria and cyanobacteria lack a nuclear membrane; their circular DNA lies in the nucleoid." },
      { id: "ribo70", name: "70S ribosomes & peptidoglycan (murein) cell wall", emo: "🧱", bin: "periodic", why: "Prokaryotic Feature: Prokaryotes synthesise proteins on smaller 70S ribosomes and have a peptidoglycan wall." },
      { id: "no-mito", name: "Respiration on mesosomes (no mitochondria or chloroplasts)", emo: "⚡", bin: "periodic", why: "Prokaryotic Feature: Prokaryotes have zero membrane-bound organelles; respiratory enzymes sit on plasma-membrane infoldings." },
      { id: "plasmid", name: "Small accessory plasmid DNA rings in Escherichia coli", emo: "⭕", bin: "periodic", why: "Prokaryotic Feature: Bacteria frequently carry extra-chromosomal circular plasmid rings alongside their nucleoid DNA." },
      { id: "nucleus", name: "True nucleus bounded by a double-membrane nuclear envelope", emo: "🎯", bin: "non", why: "Eukaryotic Feature: Protists, fungi, plants, and animals enclose linear chromosomes inside a perforated nuclear envelope." },
      { id: "ribo80", name: "80S cytoplasmic ribosomes & linear DNA bound to histones", emo: "🧵", bin: "non", why: "Eukaryotic Feature: Eukaryotes have larger 80S cytoplasmic ribosomes and linear chromosomes wrapped around histone proteins." },
      { id: "organelles", name: "Membrane-bound mitochondria, ER, Golgi & chloroplasts", emo: "🔋", bin: "non", why: "Eukaryotic Feature: Internal compartmentalisation into membrane-bound organelles is the hallmark of eukaryotic cells." },
      { id: "cellulose", name: "Cellulose cell wall (in plants) or chitin cell wall (in fungi)", emo: "🌳", bin: "non", why: "Eukaryotic Feature: When eukaryotic cells have a cell wall, it is made of cellulose (plants) or chitin (fungi), never peptidoglycan." }
    ],

    // ---- 2. 3D Compound Microscope Magnification Practical trials (Onion Epidermal Cell actual length A = 0.060 mm = 60 µm) ----
    trials: [
      { label: "A", L: 40,  t: "4×",  T: "2.40",  T2: "0.060" },
      { label: "B", L: 100, t: "10×", T: "6.00",  T2: "0.060" },
      { label: "C", L: 200, t: "20×", T: "12.00", T2: "0.060" },
      { label: "D", L: 400, t: "40×", T: "24.00", T2: "0.060" },
      { label: "E", L: 600, t: "60×", T: "36.00", T2: "0.060" }
    ],
    tOptions: ["4×", "10×", "20×", "40×", "60×"],
    TOptions: ["2.40", "6.00", "12.00", "24.00", "36.00"],
    T2Options: ["0.002", "0.015", "0.060", "0.240", "0.600"],

    // ---- 3. Biological Scale & Resolution Explorer pins (1 mm = 1000 µm) ----
    pins: [
      { frac: -1.0, label: "Virus Particle (T4 Phage)", emo: "👾", x: "A = 0.10 µm (100 nm)", v: "Electron Microscope Only", a: "Acelluar (Non-living outside host)", ke: "DNA/RNA + Capsid", pe: "No Protoplasm", note: "At 0.10 µm (below the 0.20 µm light resolution limit), viruses require an electron microscope and crystallise outside living hosts." },
      { frac: -0.5, label: "Escherichia coli Bacterium", emo: "🦠", x: "A = 2.0 µm (0.002 mm)", v: "M = 1000× oil immersion", a: "Prokaryote (70S, Nucleoid)", ke: "Peptidoglycan Wall", pe: "No Nucleus", note: "At 2.0 µm, bacteria are just visible under a 100× oil-immersion objective (M = 1000×), giving an image I = 2.0 mm." },
      { frac: 0.0,  label: "Human Red Blood Cell", emo: "🩸", x: "A = 7.5 µm (0.0075 mm)", v: "M = 400× → I = 3.0 mm", a: "Specialized Eukaryote", ke: "Biconcave Disc", pe: "Haemoglobin Packed", note: "At 7.5 µm diameter, a mature mammalian erythrocyte lacks a nucleus to maximise room for oxygen-carrying haemoglobin." },
      { frac: 0.5,  label: "Human Cheek Epithelial Cell", emo: "🧬", x: "A = 45 µm (0.045 mm)", v: "M = 400× → I = 18.0 mm", a: "Animal Eukaryote (80S)", ke: "Flexible Membrane", pe: "Central Nucleus", note: "A classic WAEC animal wet-mount specimen stained with methylene blue: irregular shape, central nucleus, no cell wall." },
      { frac: 1.0,  label: "Allium cepa Onion Epidermal Cell", emo: "🧅", x: "A = 60 µm (0.060 mm)", v: "M = 400× → I = 24.0 mm", a: "Plant Eukaryote (80S)", ke: "Cellulose Wall", pe: "Large Sap Vacuole", note: "Brick-shaped plant epidermal cell stained with iodine solution; rigid cellulose wall keeps regular hexagonal geometry." }
    ]
  };

  // ---- 4. 12 WAEC / NECO / JAMB Quiz Questions ----
  window.LESSON_QUIZ = [
    {
      q: "When Robert Hooke examined thin slices of bottle cork under his compound microscope in 1665, what structure did he actually observe?",
      o: [
        "Living protoplasm streaming around a central nucleus",
        "Empty dead suberised plant cell walls lacking living protoplasm",
        "Dividing bacterial cells undergoing binary fission",
        "Chloroplasts arranged around a large sap vacuole"
      ],
      a: 1,
      e: "Bottle cork is dead bark tissue; Hooke observed only the <strong>hollow box-like non-living cell walls</strong> ('cellulae'), not the living protoplasm inside.",
      src: "WAEC-style"
    },
    {
      q: "Which of the following scientists introduced the term <strong>'sarcode'</strong> in 1835 before Purkinje (1839) and von Mohl (1846) established the term <strong>'protoplasm'</strong>?",
      o: [
        "Félix Dujardin",
        "Antonie van Leeuwenhoek",
        "Rudolf Virchow",
        "Robert Brown"
      ],
      a: 0,
      e: "<strong>Félix Dujardin (1835)</strong> studied the jelly-like living substance inside single-celled animals and named it <em>sarcode</em>; Purkinje and von Mohl later renamed it <strong>protoplasm</strong>.",
      src: "JAMB-style"
    },
    {
      q: "The statement <em>'Omnis cellula e cellula'</em> (every cell arises from a pre-existing living cell) was added to the Cell Theory in 1855 by:",
      o: [
        "Matthias Schleiden",
        "Theodor Schwann",
        "Rudolf Virchow",
        "Louis Pasteur"
      ],
      a: 2,
      e: "<strong>Rudolf Virchow (1855)</strong> corrected Schleiden and Schwann's earlier belief in free-cell formation by proving that cells arise only by division of pre-existing cells.",
      src: "WAEC-style"
    },
    {
      q: "Why are <strong>viruses</strong> regarded as the borderline between living and non-living matter and an exception to the classical Cell Theory?",
      o: [
        "They possess both a cellulose cell wall and a chitin cell wall",
        "They have 80S ribosomes instead of 70S ribosomes",
        "They are acellular (lack protoplasm and plasma membrane), can be crystallised outside a host, and reproduce only inside a living host cell",
        "They carry out aerobic respiration inside mitochondria"
      ],
      a: 2,
      e: "Viruses consist only of a nucleic acid core (<strong>DNA or RNA, never both</strong>) inside a protein coat (<strong>capsid</strong>); they have no protoplasm or metabolism outside a living host cell.",
      src: "JAMB-style"
    },
    {
      q: "A biological specimen is examined under a compound light microscope fitted with a <strong>×10 eyepiece</strong> and a <strong>×40 high-power objective lens</strong>. What is the total linear magnification?",
      o: ["×4", "×50", "×400", "×4000"],
      a: 2,
      e: "Total magnification is the product of the lens powers: <code>M = M_eyepiece × M_objective = 10 × 40 = 400×</code>.",
      src: "NECO-style"
    },
    {
      q: "A student makes a biological drawing of an onion epidermal cell that measures <strong>48 mm</strong> in length. If the actual length of the cell is <strong>60 µm</strong>, calculate the linear magnification of the drawing.",
      o: ["×80", "×800", "×1.25", "×2880"],
      a: 1,
      e: "Convert units to µm first: <code>I = 48 mm × 1000 = 48000 µm</code>. Then <code>M = I ÷ A = 48000 ÷ 60 = 800×</code>.",
      src: "WAEC Practical"
    },
    {
      q: "Which of the following features is present in a <strong>prokaryotic bacterial cell</strong> such as <em>Escherichia coli</em>?",
      o: [
        "Double-membrane nuclear envelope surrounding linear chromosomes",
        "Membrane-bound mitochondria with cristae",
        "Circular naked DNA located in a nucleoid region and 70S ribosomes",
        "80S ribosomes attached to rough endoplasmic reticulum"
      ],
      a: 2,
      e: "Prokaryotes lack a nuclear envelope and membrane-bound organelles; they have <strong>circular naked DNA in a nucleoid</strong>, <strong>70S ribosomes</strong>, and a <strong>peptidoglycan cell wall</strong>.",
      src: "JAMB-style"
    },
    {
      q: "The cell wall of a typical bacterium is strengthened by <strong>peptidoglycan (murein)</strong>, whereas the cell wall of a fungus such as <em>Rhizopus</em> or yeast is strengthened by:",
      o: ["Cellulose", "Chitin", "Starch", "Glycogen"],
      a: 1,
      e: "Bacterial cell walls contain <strong>peptidoglycan</strong>, fungal cell walls contain <strong>chitin</strong>, and plant cell walls contain <strong>cellulose</strong>.",
      src: "WAEC-style"
    },
    {
      q: "Under a compound microscope at <strong>×400</strong> magnification, the image of a rod-shaped bacterium measures <strong>0.8 mm</strong> in length. What is the actual length of the bacterium in micrometres (µm)?",
      o: ["0.002 µm", "2.0 µm", "20 µm", "320 µm"],
      a: 1,
      e: "Convert image size to µm: <code>I = 0.8 mm × 1000 = 800 µm</code>. Then actual size <code>A = I ÷ M = 800 ÷ 400 = 2.0 µm</code>.",
      src: "JAMB-style"
    },
    {
      q: "Which of the following eukaryotic cell types is an exception to the rule that every living cell contains a single nucleus at maturity?",
      o: [
        "Onion epidermal cell",
        "Palisade mesophyll cell",
        "Mature mammalian red blood cell (erythrocyte) and coenocytic Rhizopus hyphae",
        "Human cheek epithelial cell"
      ],
      a: 2,
      e: "Mature mammalian red blood cells and phloem sieve tube elements are <strong>anucleate</strong> (0 nuclei), while skeletal muscle fibres and <em>Rhizopus</em> hyphae are <strong>multinucleate / coenocytic</strong>.",
      src: "WAEC-style"
    },
    {
      q: "Who discovered and named the <strong>cell nucleus</strong> in 1831 while examining orchid epidermal cells?",
      o: [
        "Robert Brown",
        "Robert Hooke",
        "Theodor Schwann",
        "Johannes Purkinje"
      ],
      a: 0,
      e: "Scottish botanist <strong>Robert Brown (1831)</strong> identified and named the constant spherical structure inside plant cells the <strong>nucleus</strong>.",
      src: "NECO-style"
    },
    {
      q: "Why can an electron microscope resolve ribosomes (25 nm) and viral capsids that are completely invisible under a school light microscope?",
      o: [
        "Electron beams have a much shorter wavelength than visible light, giving a ~1000× finer resolution limit (0.2 nm vs 200 nm)",
        "Electron microscopes use iodine stain instead of methylene blue",
        "Visible light travels faster through a vacuum than electrons",
        "Glass lenses magnify specimens more than electromagnetic lenses"
      ],
      a: 0,
      e: "Resolution depends on wavelength. Electrons have a wavelength thousands of times shorter than visible light, lowering the resolution limit from <strong>200 nm (0.2 µm)</strong> to <strong>0.2 nm</strong>.",
      src: "JAMB-style"
    }
  ];
})();
