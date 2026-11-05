/* Lesson 04 · The Cell & Its Environment — Diffusion, Osmosis, Turgor, Plasmolysis, Haemolysis & Active Transport — content data and 12 WAEC/NECO/JAMB quiz questions */
(function () {
  "use strict";

  window.L04 = {
    // ---- 1. Membrane Transport Mechanism Sort (Diffusion, Osmosis/Tonicity, Active/Bulk Transport) ----
    items: [
      { id: "perfume", name: "Spread of perfume vapour or H₂S gas across a quiet classroom", emo: "💨", bin: "shm", why: "Simple Diffusion: Net movement of gas molecules down a concentration gradient without requiring a membrane or ATP." },
      { id: "alveoli", name: "Exchange of O₂ and CO₂ across mammalian alveoli & leaf stomata", emo: "🫁", bin: "shm", why: "Simple Diffusion: Respiratory gases diffuse passively down partial-pressure gradients across moist surfaces." },
      { id: "kmno4", name: "Purple KMnO₄ crystal dissolving & spreading through a beaker of water", emo: "🟣", bin: "shm", why: "Simple Diffusion: Solute ions move from high concentration at the crystal to low concentration throughout the liquid." },
      { id: "ugu-turgor", name: "Wilted ugu leaf becoming crisp and firm in fresh tap water", emo: "🥬", bin: "periodic", why: "Osmosis & Tonicity: Endosmosis into the hypertonic sap vacuole builds turgor pressure against the cellulose cell wall." },
      { id: "plasmolysis", name: "Shrinkage of Spirogyra or onion protoplasm away from the cell wall in 0.8 M salt", emo: "🥀", bin: "periodic", why: "Osmosis & Tonicity: Exosmosis in a hypertonic solution causes the vacuole to shrink and the plasma membrane to pull away (plasmolysis)." },
      { id: "haemolysis", name: "Bursting of mammalian red blood cells placed in distilled water", emo: "🩸", bin: "periodic", why: "Osmosis & Tonicity: Haemolysis — water enters by endosmosis and bursts the RBC because animal cells lack a rigid cellulose cell wall." },
      { id: "yam-osmometer", name: "Rise of sugar solution inside a hollowed living yam tuber cavity in water", emo: "🍠", bin: "periodic", why: "Osmosis & Tonicity: Living yam cells act as a selectively permeable barrier; boiled yam fails because heat denatures membranes." },
      { id: "crenation", name: "Shrivelling and notching of red blood cells in concentrated 2.0% NaCl brine", emo: "🌵", bin: "periodic", why: "Osmosis & Tonicity: Crenation — exosmosis of water out of the RBC into a hypertonic salt solution shrivels the cell." },
      { id: "nitrate", name: "Uptake of nitrate (NO₃⁻) & mineral ions by root hairs against a gradient", emo: "🌱", bin: "non", why: "Active / Bulk Transport: Requires carrier proteins, oxygen, and mitochondrial ATP; blocked by cyanide or lack of oxygen." },
      { id: "nakpump", name: "Sodium–potassium pump (Na⁺/K⁺-ATPase) in human nerve axons", emo: "⚡", bin: "non", why: "Active / Bulk Transport: Hydrolyses ATP to pump 3 Na⁺ out and 2 K⁺ in against their electrochemical gradients." },
      { id: "glucose-ileum", name: "Complete absorption of glucose into villi of the ileum against a gradient", emo: "🥖", bin: "non", why: "Active / Bulk Transport: Uses ATP-driven sodium co-transport so no digested glucose is wasted in faeces." },
      { id: "phago", name: "Amoeba or white blood cell engulfing a bacterium by phagocytosis", emo: "🫧", bin: "non", why: "Active / Bulk Transport: Endocytosis (cell eating) uses ATP and cytoskeleton movement to fold the plasma membrane into a vesicle." }
    ],

    // ---- 2. 3D Yam-Strip Osmosis & Tonicity Bench trials (Initial mass m_i = 2.50 g, Isotonic at 0.30 M) ----
    trials: [
      { label: "A", L: 0.00, t: "2.95", T: "+18.0", T2: "Turgid (Endosmosis)" },
      { label: "B", L: 0.15, t: "2.73", T: "+9.2",  T2: "Turgid (Endosmosis)" },
      { label: "C", L: 0.30, t: "2.50", T: "0.0",   T2: "Isotonic (No Net Flow)" },
      { label: "D", L: 0.50, t: "2.25", T: "-10.0", T2: "Plasmolysed (Exosmosis)" },
      { label: "E", L: 0.70, t: "2.05", T: "-18.0", T2: "Plasmolysed (Exosmosis)" }
    ],
    tOptions: ["2.05", "2.25", "2.50", "2.73", "2.95"],
    TOptions: ["-18.0", "-10.0", "0.0", "+9.2", "+18.0"],
    T2Options: ["Turgid (Endosmosis)", "Isotonic (No Net Flow)", "Plasmolysed (Exosmosis)", "Haemolysed (Burst)"],

    // ---- 3. Tonicity & Water Potential Spectrum Explorer pins ----
    pins: [
      { frac: -1.0, label: "Distilled Water (0.00 M)", emo: "💧", x: "Strongly Hypotonic (Ψ_w = 0 kPa)", v: "Plant: Fully Turgid (+18% mass)", a: "RBC: Haemolysis (Bursts!)", ke: "Endosmosis Inward", pe: "Wall Pressure = Osmotic P", note: "Pure water has the highest water potential (0 kPa). Plant cells swell until wall pressure stops further inflow; animal RBCs burst (haemolysis)." },
      { frac: -0.5, label: "Dilute Sucrose (0.15 M)", emo: "🟢", x: "Moderately Hypotonic", v: "Plant: Turgid (+9.2% mass)", a: "RBC: Swollen sphere", ke: "Net H₂O Inflow", pe: "Vacuole expands", note: "External water potential is still higher than cell sap (0.30 M equivalent), so water enters by endosmosis." },
      { frac: 0.0,  label: "Isotonic Point (0.30 M / 0.9% NaCl)", emo: "⚖️", x: "Equal Water Potential (ΔΨ_w = 0)", v: "Plant: Incipient Flaccidity (0% Δm)", a: "RBC: Normal Biconcave Disc", ke: "Inflow = Outflow", pe: "Hospital IV Saline (0.9%)", note: "At the isotonic concentration (0.30 M sucrose for yam; 0.9% NaCl for human blood), water enters and leaves at equal rates so mass change is 0.0%." },
      { frac: 0.5,  label: "Concentrated (0.50 M)", emo: "🟠", x: "Moderately Hypertonic", v: "Plant: Flaccid / Early Plasmolysis (−10%)", a: "RBC: Crenated (Notched)", ke: "Net H₂O Outflow", pe: "Turgor lost (wilting)", note: "External solution has lower water potential than cell sap; water leaves the vacuole by exosmosis and the stem wilts." },
      { frac: 1.0,  label: "Strong Brine / Syrup (0.70 M)", emo: "🥀", x: "Strongly Hypertonic", v: "Plant: Fully Plasmolysed (−18% mass)", a: "RBC: Severely Crenated", ke: "Protoplasm pulls from wall", pe: "Salting preserves fish/meat", note: "Severe exosmosis shrinks the vacuole and pulls the plasma membrane away from the cellulose wall (plasmolysis) — killing spoilage bacteria on salted fish!" }
    ]
  };

  // ---- 4. 12 WAEC / NECO / JAMB Quiz Questions ----
  window.LESSON_QUIZ = [
    {
      q: "Which statement accurately defines <strong>osmosis</strong>?",
      o: [
        "The movement of solute ions from a region of low concentration to high concentration using ATP",
        "The net movement of water (solvent) molecules from a dilute solution (higher water potential) to a more concentrated solution (lower water potential) across a selectively permeable membrane",
        "The random spreading of perfume molecules through air without a membrane",
        "The engulfing of solid food particles by pseudopodia"
      ],
      a: 1,
      e: "<strong>Osmosis</strong> is the net movement of <strong>water molecules</strong> down a water-potential gradient (from a hypotonic/dilute solution to a hypertonic/concentrated solution) across a <strong>selectively permeable membrane</strong>.",
      src: "WAEC-style"
    },
    {
      q: "What happens when a <strong>mammalian red blood cell</strong> and a <strong>green plant palisade cell</strong> are both placed in <strong>pure distilled water</strong> for 20 minutes?",
      o: [
        "Both cells swell and burst (haemolyse)",
        "Both cells shrink and undergo plasmolysis",
        "The red blood cell swells and bursts (haemolysis) because it lacks a cell wall, whereas the plant cell becomes fully turgid without bursting because its rigid cellulose cell wall exerts opposing wall pressure",
        "The plant cell bursts while the red blood cell becomes turgid"
      ],
      a: 2,
      e: "In hypotonic distilled water, endosmosis occurs in both cells: the <strong>RBC bursts (haemolysis)</strong> due to no cell wall, while the <strong>plant cell becomes turgid</strong> because the <strong>inelastic cellulose wall</strong> resists bursting.",
      src: "WAEC-style"
    },
    {
      q: "A fresh yam cylinder of initial mass <strong>2.50 g</strong> is immersed in distilled water for 45 minutes, blotted dry, and reweighed at <strong>2.95 g</strong>. Calculate the <strong>percentage change in mass</strong>.",
      o: ["+0.45%", "+15.3%", "+18.0%", "−18.0%"],
      a: 2,
      e: "Mass gain <code>Δm = 2.95 − 2.50 = +0.45 g</code>. Percentage change <code>%Δm = (0.45 ÷ 2.50) × 100 = +18.0%</code>.",
      src: "WAEC Practical"
    },
    {
      q: "In a yam-tuber osmometer experiment, why does the sugar solution level <strong>fail to rise</strong> when a <strong>boiled yam tuber</strong> is used instead of a fresh raw yam tuber?",
      o: [
        "Boiling converts the sucrose solution into pure water",
        "Boiling kills the yam cells and denatures their plasma membranes and tonoplasts, destroying selective permeability so the tissue becomes freely permeable to both sugar and water",
        "Boiling makes the cellulose cell wall thicker",
        "Boiling increases the rate of active transport"
      ],
      a: 1,
      e: "Osmosis requires a <strong>living, selectively permeable plasma membrane/tonoplast</strong>; boiling denatures membrane proteins and disrupts the lipid bilayer.",
      src: "WAEC Practical"
    },
    {
      q: "When a filament of <em>Spirogyra</em> or a strip of purple onion epidermis is immersed in a concentrated <strong>0.8 M salt solution</strong>, the vacuole shrinks and the protoplasm pulls away from the cell wall. This phenomenon is called:",
      o: [
        "Haemolysis",
        "Turgidity",
        "Plasmolysis",
        "Crenation"
      ],
      a: 2,
      e: "<strong>Plasmolysis</strong> is the shrinkage of the vacuole and pulling away of the living protoplasm (plasma membrane + cytoplasm) from the rigid cell wall due to <strong>exosmosis</strong> in a hypertonic solution.",
      src: "JAMB-style"
    },
    {
      q: "How can a <strong>plasmolysed plant cell</strong> be restored to its normal turgid state (<strong>deplasmolysis</strong>) before permanent death occurs?",
      o: [
        "By boiling the cell in water for 10 minutes",
        "By transferring the cell promptly into pure water or a hypotonic solution so water re-enters the vacuole by endosmosis",
        "By placing the cell in an even stronger salt solution",
        "By adding respiratory poison (cyanide)"
      ],
      a: 1,
      e: "Prompt transfer into <strong>hypotonic water</strong> causes endosmosis back into the sap vacuole, restoring turgor (<strong>deplasmolysis</strong>).",
      src: "NECO-style"
    },
    {
      q: "Why does rubbing <strong>common salt (NaCl)</strong> onto fresh Tilapia fish or meat preserve it from bacterial spoilage?",
      o: [
        "Salt provides energy for bacterial mitosis",
        "Salt forms a strongly hypertonic coating that draws water out of spoilage bacteria and fungi by exosmosis, causing plasmolysis and arresting microbial metabolism",
        "Salt causes bacterial cells to burst by haemolysis",
        "Salt converts bacterial peptidoglycan into cellulose"
      ],
      a: 1,
      e: "Salting creates a <strong>hypertonic environment</strong> that dehydrates and <strong>plasmolyses</strong> spoilage microorganisms by exosmosis.",
      src: "WAEC-style"
    },
    {
      q: "Which of the following conditions provides direct experimental evidence that <strong>mineral ion uptake by plant root hair cells</strong> occurs by <strong>active transport</strong> rather than simple diffusion?",
      o: [
        "Ion uptake continues normally when the root is boiled",
        "Ion uptake stops when oxygen is excluded or when a respiratory poison such as potassium cyanide (KCN) is added to inhibit mitochondrial ATP synthesis",
        "Ions move only from high soil concentration to low root concentration",
        "Ion uptake requires no carrier proteins"
      ],
      a: 1,
      e: "<strong>Active transport</strong> moves ions against a concentration gradient using <strong>ATP</strong> from aerobic respiration; depriving roots of <strong>$\text{O}_2$</strong> or adding <strong>cyanide</strong> halts ATP production and stops active uptake.",
      src: "JAMB-style"
    },
    {
      q: "On a graph of <strong>percentage change in mass ($\%\Delta m$)</strong> of yam strips plotted against <strong>external sucrose molarity ($M$)</strong>, what does the concentration where the line crosses the horizontal axis ($\%\Delta m = 0\%$) represent?",
      o: [
        "The point of complete haemolysis",
        "The isotonic concentration equal to the average osmotic concentration (water potential) of the yam cell sap",
        "The boiling point of the yam cytoplasm",
        "The maximum turgor pressure of pure water"
      ],
      a: 1,
      e: "When <code>%Δm = 0%</code>, there is no net gain or loss of water, meaning the external sucrose solution is <strong>isotonic</strong> to the yam cell sap.",
      src: "WAEC Practical"
    },
    {
      q: "Why must a nurse administer an intravenous (IV) drip using <strong>0.9% normal saline</strong> (isotonic to blood plasma) rather than pure distilled water?",
      o: [
        "Pure distilled water is hypotonic to blood plasma and would cause the patient's red blood cells to swell and burst (haemolysis)",
        "Distilled water is hypertonic and would crenate the red blood cells",
        "0.9% saline causes plasmolysis of red blood cells",
        "Distilled water cannot flow through a plastic cannula"
      ],
      a: 0,
      e: "Injecting hypotonic distilled water into the bloodstream lowers plasma osmolarity, driving rapid endosmosis and fatal <strong>haemolysis</strong> of red blood cells.",
      src: "JAMB-style"
    },
    {
      q: "A plant cell has an <strong>osmotic potential (solute pressure) of 12 atm</strong> and an inward <strong>turgor (wall) pressure of 12 atm</strong> when fully turgid. What is its net <strong>suction pressure (diffusion pressure deficit, DPD = OP − TP)</strong>?",
      o: ["24 atm", "12 atm", "0 atm", "144 atm"],
      a: 2,
      e: "At full turgidity, inward wall/turgor pressure equals osmotic pressure (<code>TP = OP = 12 atm</code>), so net suction pressure <code>SP = OP − TP = 12 − 12 = 0 atm</code> and net water inflow stops.",
      src: "JAMB-style"
    },
    {
      q: "According to Graham's law of diffusion, if Gas X has a relative molecular mass of <strong>4</strong> and Gas Y has a relative molecular mass of <strong>64</strong>, how many times faster does Gas X diffuse than Gas Y at the same temperature?",
      o: [
        "2 times faster",
        "4 times faster",
        "8 times faster",
        "16 times faster"
      ],
      a: 1,
      e: "Rate of diffusion is inversely proportional to the square root of relative molecular mass: <code>r_X ÷ r_Y = √(M_Y ÷ M_X) = √(64 ÷ 4) = √16 = 4</code>.",
      src: "JAMB-style"
    }
  ];
})();
