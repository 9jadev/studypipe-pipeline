/* Lesson 05 · Composition of Blood, Clotting Cascade, ABO/Rhesus Blood Groups & WAEC Paper 3 Heart Practical — content data and 12 WAEC/NECO/JAMB quiz questions */
(function () {
  "use strict";

  window.L05 = {
    // ---- 1. Haematology, Clotting & Paper 3 Sort items (12 cards across 3 bins) ----
    items: [
      { id: "plasma-55", name: "Plasma (~55% of blood volume): straw-coloured fluid carrying glucose, amino acids, urea, hormones & HCO₃⁻", emo: "🧪", bin: "shm", why: "Plasma, RBCs & WBCs: Liquid matrix of mammalian blood (~90% water, ~10% dissolved solutes and plasma proteins)." },
      { id: "rbc-biconcave", name: "Erythrocytes (RBCs): biconcave discs with NO nucleus at maturity, packed with haemoglobin", emo: "🔴", bin: "shm", why: "Plasma, RBCs & WBCs: Losing the nucleus and mitochondria maximises internal space for iron-containing haemoglobin and increases SA:V ratio." },
      { id: "phagocyte", name: "Phagocytes (neutrophils/monocytes): lobed nucleus; engulf and digest bacteria by phagocytosis", emo: "🦠", bin: "shm", why: "Plasma, RBCs & WBCs: Non-specific white blood cells that squeeze through capillary pores (diapedesis) to engulf pathogens." },
      { id: "lymphocyte", name: "Lymphocytes: large rounded nucleus; secrete specific antibodies and antitoxins for immunity", emo: "🛡️", bin: "shm", why: "Plasma, RBCs & WBCs: Adaptive white blood cells formed in bone marrow and lymph nodes." },
      { id: "platelets", name: "Platelets (thrombocytes): non-nucleated cell fragments that release thromboplastin when a vessel is cut", emo: "🩹", bin: "periodic", why: "Platelets & Clotting Cascade: Ruptured platelets and damaged tissue release thromboplastin (thrombokinase) to start coagulation." },
      { id: "prothrombin", name: "Thromboplastin + Ca²⁺ ions convert inactive prothrombin (made in liver with Vitamin K) into active thrombin", emo: "⚡", bin: "periodic", why: "Platelets & Clotting Cascade: Calcium ions (Ca²⁺) and hepatic Vitamin K are essential cofactors for thrombin activation." },
      { id: "fibrin-mesh", name: "Active thrombin converts soluble plasma fibrinogen into insoluble fibrin threads that trap RBCs", emo: "🕸️", bin: "periodic", why: "Platelets & Clotting Cascade: Insoluble fibrin fibres weave a meshwork clot (thrombus) that seals the wound." },
      { id: "serum-def", name: "Serum: pale-yellow fluid remaining after fibrinogen and clotting factors are removed in a clot", emo: "💧", bin: "periodic", why: "Platelets & Clotting Cascade: Serum = Blood Plasma − Fibrinogen." },
      { id: "group-o", name: "Blood Group O (Universal Donor of packed RBCs): lacks both Antigen A and Antigen B on red cell membranes", emo: "🅾️", bin: "non", why: "ABO/Rhesus & WAEC Paper 3: Because Group O RBCs have neither A nor B surface antigens, recipient anti-A or anti-B antibodies cannot clump them." },
      { id: "group-ab", name: "Blood Group AB (Universal Recipient): lacks both anti-A and anti-B antibodies in blood plasma", emo: "🆎", bin: "non", why: "ABO/Rhesus & WAEC Paper 3: Having no anti-A or anti-B plasma antibodies allows Group AB to receive packed RBCs from A, B, AB, or O." },
      { id: "rhesus-hdn", name: "Erythroblastosis fetalis: Rh⁻ mother sensitised by first Rh⁺ baby makes anti-D antibodies attacking later Rh⁺ fetus", emo: "🤰", bin: "non", why: "ABO/Rhesus & WAEC Paper 3: Maternal anti-D IgG antibodies cross the placenta unless prevented by anti-D (RhoGAM) injection." },
      { id: "paper3-rules", name: "WAEC Paper 3 Heart Drawing: sharp HB pencil, zero shading, horizontal uncrossed label lines & M = Drawing ÷ Actual", emo: "✏️", bin: "non", why: "ABO/Rhesus & WAEC Paper 3: WAEC Chief Examiners strictly penalise shading, sketchy lines, crossed label lines, and missing magnification." }
    ],

    // ---- 2. 3D Haematology & Oxygen Capacity Bench trials ([Hb] in g/100 mL, C_O2 = 1.34 × [Hb] mL O2/100 mL) ----
    trials: [
      { label: "A", L: 8.0,  t: "10.7", T: "536",  T2: "×1.2" },
      { label: "B", L: 10.0, t: "13.4", T: "670",  T2: "×1.3" },
      { label: "C", L: 12.0, t: "16.1", T: "804",  T2: "×1.4" },
      { label: "D", L: 15.0, t: "20.1", T: "1005", T2: "×1.5" },
      { label: "E", L: 18.0, t: "24.1", T: "1206", T2: "×1.7" }
    ],
    tOptions: ["10.7", "13.4", "16.1", "20.1", "24.1"],
    TOptions: ["536", "670", "804", "1005", "1206"],
    T2Options: ["×1.2", "×1.3", "×1.4", "×1.5", "×1.7"],

    // ---- 3. Haematology, Clotting, ABO & WAEC Paper 3 Explorer pins ----
    pins: [
      { frac: -1.0, label: "1 · Blood Plasma (55%) vs Serum", emo: "🧪", x: "90% Water + 10% Solutes", v: "Albumin, Globulins, Fibrinogen", a: "CO₂ as HCO₃⁻ (70–85%)", ke: "Serum = Plasma − Fibrinogen", pe: "Nutrients, Urea, Hormones & Heat", note: "Straw-coloured plasma transports digested food (glucose, amino acids), excretory urea, hormones, heat, and ~70–85% of CO₂ as bicarbonate ions (HCO₃⁻). Serum is plasma left after fibrinogen clots." },
      { frac: -0.5, label: "2 · Erythrocytes (RBCs) & Leucocytes (WBCs)", emo: "🔴", x: "RBC ~5M/mm³ · WBC ~7,000/mm³", v: "Biconcave · Enucleated (Mammals)", a: "C_O2 = 1.34 × [Hb] mL/dL", ke: "Phagocytes (Lobed Nucleus)", pe: "Lymphocytes (Antibodies)", note: "Mature mammalian RBCs lack a nucleus and mitochondria to pack haemoglobin (Hb + 4O₂ ⇌ HbO₈) and lived ~120 days before destruction in liver/spleen. Nucleated WBCs defend via phagocytosis and antibodies." },
      { frac: 0.0,  label: "3 · Platelets & 4-Step Clotting Cascade", emo: "🕸️", x: "250,000–400,000/mm³ · Ca²⁺ + Vit K", v: "Thromboplastin (Thrombokinase)", a: "Prothrombin → Thrombin", ke: "Fibrinogen → Fibrin Mesh", pe: "Heparin Prevents Intravascular Clots", note: "At a cut vessel, platelets release thromboplastin, which uses Ca²⁺ ions to convert prothrombin (made in liver using Vitamin K) into thrombin. Thrombin converts soluble fibrinogen into insoluble fibrin threads." },
      { frac: 0.5,  label: "4 · ABO Cross-Matching, Rhesus & Sickle-Cell", emo: "🧬", x: "Group O = Donor · AB = Recipient", v: "Antigens on RBC vs Antibodies in Plasma", a: "Rh⁻ Mother + Rh⁺ Fetus", ke: "Erythroblastosis Fetalis", pe: "Sickle-Cell (Hb^S Hb^S) & Haemophilia", note: "Agglutination occurs if donor RBC antigens meet matching recipient antibodies. Group O lacks A & B antigens (Universal Donor); Group AB lacks anti-A & anti-B antibodies (Universal Recipient)." },
      { frac: 1.0,  label: "5 · WAEC Paper 3 Heart Dissection & 9 Drawing Rules", emo: "✏️", x: "M = Drawing (120 mm) ÷ Actual (80 mm) = ×1.5", v: "Diagonal Coronary Sulcus (Ventral)", a: "LV Wall 3× Thicker than RV", ke: "Sharp HB Pencil · Zero Shading", pe: "Horizontal Uncrossed Label Lines", note: "In WAEC Paper 3, orient the heart by the diagonal coronary groove, pinch the 3× thicker left ventricle, draw 8–12 cm long with single sharp lines, zero shading, horizontal ruled labels, and state magnification M = ×1.5." }
    ]
  };

  // ---- 4. 12 WAEC / NECO / JAMB Quiz Questions ----
  window.LESSON_QUIZ = [
    {
      q: "Which structural feature of mature mammalian <strong>erythrocytes (red blood cells)</strong> directly increases the internal volume available for packing haemoglobin molecules?",
      o: [
        "Presence of a large multi-lobed nucleus",
        "Absence of a nucleus and mitochondria at maturity, combined with a biconcave disc shape",
        "Presence of a rigid cellulose cell wall",
        "Ability to perform amoeboid movement across capillary walls"
      ],
      a: 1,
      e: "During maturation in the red bone marrow, mammalian erythrocytes extrude their <strong>nucleus and mitochondria</strong> so over 95% of cell dry weight is occupied by oxygen-carrying <strong>haemoglobin</strong>, while the <strong>biconcave shape</strong> maximises surface-area-to-volume ratio.",
      src: "WAEC-style"
    },
    {
      q: "The majority (approximately <strong>70%–85%</strong>) of carbon dioxide (<strong>CO₂</strong>) produced by respiring tissues is transported in mammalian blood as:",
      o: [
        "Carboxyhaemoglobin inside platelets",
        "Hydrogen carbonate (bicarbonate, HCO₃⁻) ions carried mainly in the blood plasma",
        "Insoluble calcium carbonate crystals in lymph nodes",
        "Oxyhaemoglobin inside lymphocytes"
      ],
      a: 1,
      e: "Carbonic anhydrase inside erythrocytes catalyses <code>CO₂ + H₂O ⇌ H₂CO₃ ⇌ H⁺ + HCO₃⁻</code>; the <strong>bicarbonate ions (HCO₃⁻)</strong> diffuse into the plasma to transport 70–85% of blood CO₂ to the lungs.",
      src: "JAMB-style"
    },
    {
      q: "Given that <strong>1 g of haemoglobin binds 1.34 mL of O₂</strong> at full saturation, calculate the total volume of oxygen carried by <strong>5.0 L (50 dL)</strong> of arterial blood in a healthy student with <strong>[Hb] = 15.0 g per 100 mL (1 dL)</strong>:",
      o: ["20.1 mL O₂", "536 mL O₂", "1,005 mL O₂", "1,500 mL O₂"],
      a: 2,
      e: "Oxygen capacity per 100 mL (1 dL): <code>C_O2 = 1.34 × 15.0 = 20.1 mL O₂/dL</code>. In <code>5.0 L = 50 dL</code> of blood, total oxygen = <code>20.1 × 50 = 1,005 mL O₂</code>.",
      src: "JAMB-style"
    },
    {
      q: "Which mineral ion and fat-soluble vitamin are both essential for the conversion of <strong>prothrombin to active thrombin</strong> during mammalian blood clotting?",
      o: [
        "Sodium ions (Na⁺) and Vitamin C",
        "Calcium ions (Ca²⁺) and Vitamin K",
        "Iron(II) ions (Fe²⁺) and Vitamin A",
        "Potassium ions (K⁺) and Vitamin D"
      ],
      a: 1,
      e: "<strong>Vitamin K</strong> is required by the liver to synthesise <strong>prothrombin</strong>, and <strong>calcium ions (Ca²⁺)</strong> are required as a cofactor for <strong>thromboplastin (thrombokinase)</strong> to convert prothrombin into active <strong>thrombin</strong>.",
      src: "WAEC-style"
    },
    {
      q: "In the final enzymatic step of blood coagulation, active <strong>thrombin</strong> directly catalyses the conversion of:",
      o: [
        "Insoluble fibrin into soluble prothrombin",
        "Soluble plasma fibrinogen into insoluble fibrin threads that form a meshwork clot",
        "Platelets into red blood cells",
        "Thromboplastin into heparin"
      ],
      a: 1,
      e: "<strong>Thrombin</strong> cleaves soluble plasma <strong>fibrinogen</strong> into sticky, insoluble <strong>fibrin</strong> fibres that trap blood cells to seal the wound.",
      src: "WAEC-style"
    },
    {
      q: "How does <strong>blood serum</strong> differ chemically from <strong>blood plasma</strong>?",
      o: [
        "Serum contains red blood cells whereas plasma does not",
        "Serum lacks fibrinogen and consumed clotting factors, whereas plasma contains fibrinogen (Serum = Plasma − Fibrinogen)",
        "Plasma lacks water whereas serum is 100% water",
        "Serum contains platelets whereas plasma lacks antibodies"
      ],
      a: 1,
      e: "When blood clots, soluble <strong>fibrinogen</strong> is converted into insoluble fibrin and removed with the clot, leaving pale-yellow <strong>serum</strong>.",
      src: "NECO-style"
    },
    {
      q: "Why is an individual with <strong>Blood Group O Rhesus-negative (O⁻)</strong> referred to as the <strong>Universal Donor</strong> of packed red blood cells?",
      o: [
        "Their plasma contains neither anti-A nor anti-B antibodies",
        "Their red blood cell membranes lack Antigen A, Antigen B, and Rhesus D antigen, so recipient plasma antibodies cannot agglutinate them",
        "Their red blood cells contain nuclei that destroy recipient antibodies",
        "Their blood clots immediately inside any vein"
      ],
      a: 1,
      e: "Transfusion clumping (<strong>agglutination</strong>) occurs when recipient antibodies attack donor RBC antigens. Because <strong>Group O⁻ red cells have no A, B, or Rh-D surface antigens</strong>, they are safe against anti-A, anti-B, and anti-D.",
      src: "WAEC-style"
    },
    {
      q: "If a recipient of <strong>Blood Group B</strong> is accidentally transfused with red blood cells from a donor of <strong>Blood Group A</strong>, what life-threatening reaction occurs?",
      o: [
        "Anti-A antibodies present in the Group B recipient's plasma bind to Antigen A on the donor red cells, causing agglutination (clumping) and haemolysis",
        "The donor red blood cells transform into lymphocytes",
        "The recipient's platelets dissolve into glucose",
        "No reaction occurs because Group A and Group B are identical"
      ],
      a: 0,
      e: "A <strong>Group B</strong> individual naturally has <strong>anti-A antibodies</strong> in plasma, which cross-link <strong>Antigen A</strong> on the donor Group A red cells, causing fatal intravascular <strong>agglutination</strong>.",
      src: "JAMB-style"
    },
    {
      q: "<strong>Erythroblastosis fetalis</strong> (haemolytic disease of the newborn) is a clinical risk when:",
      o: [
        "A Rhesus-positive (Rh⁺) mother carries a Rhesus-negative (Rh⁻) fetus",
        "A Rhesus-negative (Rh⁻) mother carries a second or subsequent Rhesus-positive (Rh⁺) fetus after prior sensitisation",
        "Both parents are Rhesus-negative (Rh⁻)",
        "Both parents belong to Blood Group O⁻"
      ],
      a: 1,
      e: "Fetal Rh⁺ red cells entering an <strong>Rh⁻ mother's blood</strong> during a first Rh⁺ birth sensitise her to produce <strong>anti-D IgG antibodies</strong>, which cross the placenta in subsequent Rh⁺ pregnancies and destroy fetal RBCs.",
      src: "WAEC-style"
    },
    {
      q: "A couple who both carry the <strong>sickle-cell trait (genotype Hb^A Hb^S)</strong> are expecting a child. What is the probability that the child will inherit <strong>sickle-cell anaemia (Hb^S Hb^S)</strong>?",
      o: ["0%", "25% (1/4)", "50% (1/2)", "75% (3/4)"],
      a: 1,
      e: "From <code>Hb^A Hb^S × Hb^A Hb^S</code>, the offspring genotypic ratio is <code>1 Hb^A Hb^A : 2 Hb^A Hb^S : 1 Hb^S Hb^S</code>, giving <code>1/4 = 25%</code> probability of <code>Hb^S Hb^S</code>.",
      src: "JAMB-style"
    },
    {
      q: "In a WAEC Paper 3 Biology practical, a student measures an actual dissected goat heart as <strong>80 mm</strong> long and makes a biological drawing that measures <strong>120 mm</strong> long. What is the correct magnification to record beside the title?",
      o: ["×0.67", "×1.5", "×40", "×9,600 mm"],
      a: 1,
      e: "Magnification <code>M = Length of Drawing ÷ Actual Length of Specimen = 120 mm ÷ 80 mm = ×1.5</code> (no units, preceded by <code>×</code>).",
      src: "WAEC-style"
    },
    {
      q: "Which of the following practices causes an automatic loss of marks in a <strong>WAEC/NECO Paper 3 biological drawing</strong> of the mammalian heart?",
      o: [
        "Drawing with a sharp HB pencil using single, continuous, unshaded lines",
        "Artistic shading or stippling of the ventricular wall and crossing freehand label lines with arrowheads",
        "Using a ruler to draw horizontal, parallel, uncrossed guide lines that touch the structures",
        "Writing the full title, view, and magnification below the drawing"
      ],
      a: 1,
      e: "WAEC Chief Examiner reports repeatedly penalise <strong>shading/stippling, woolly/sketchy lines, arrowheads on label lines, and crossed guide lines</strong>.",
      src: "WAEC-style"
    }
  ];
})();
