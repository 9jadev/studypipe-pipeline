/* Lesson 04 · Blood Vessels, Capillary Exchange, the Lymphatic System & Cardiovascular Disorders — content data and 12 WAEC/NECO/JAMB quiz questions */
(function () {
  "use strict";

  window.L04 = {
    // ---- 1. Arteries, Capillaries & Veins/Lymphatics Sort items (12 cards across 3 bins) ----
    items: [
      { id: "art-wall", name: "Thick tunica media rich in smooth muscle and elastic fibres", emo: "🔴", bin: "shm", why: "Arteries & Arterioles: Thick muscular and elastic walls withstand high systolic surges (~120 mmHg) and recoil during diastole." },
      { id: "art-lumen", name: "Narrow circular lumen with NO internal valves along vessel length", emo: "⭕", bin: "shm", why: "Arteries & Arterioles: High pulsatile pressure drives blood rapidly away from the heart without needing pocket valves (except semilunar valves at the heart base)." },
      { id: "art-deep", name: "Usually located deep within body muscles and spurts rhythmically if cut", emo: "💥", bin: "shm", why: "Arteries & Arterioles: Deep placement protects high-pressure arteries; severing an artery causes bright-red pulsatile spurting." },
      { id: "arteriole", name: "Arterioles constrict or dilate (vasoconstriction / vasodilation) to regulate flow", emo: "🎛️", bin: "shm", why: "Arteries & Arterioles: Smooth muscle rings in arterioles control blood distribution to organs and cause the steepest pressure drop." },
      { id: "cap-wall", name: "Wall is ONE cell thick — a single layer of squamous endothelium", emo: "🔬", bin: "periodic", why: "Capillaries & Tissue Fluid: Lacking tunica media and externa reduces diffusion distance to ~1 µm for rapid gas and nutrient exchange." },
      { id: "cap-slow", name: "Huge total cross-sectional area (~4,500 cm²) slows velocity to ~0.03 cm/s", emo: "🐢", bin: "periodic", why: "Capillaries & Tissue Fluid: By continuity (v = Q ÷ A), branching into billions of capillaries slows blood flow 1,000-fold to maximise exchange time." },
      { id: "ultra-out", name: "Arterial end: hydrostatic pressure P_c (35 mmHg) > π_c (25 mmHg) forces fluid out", emo: "💧", bin: "periodic", why: "Capillaries & Tissue Fluid: Net Filtration Pressure NFP = +10 mmHg drives ultrafiltration of water, glucose, amino acids, and O₂ into intercellular spaces." },
      { id: "no-rbc-prot", name: "Tissue fluid lacks red blood cells, platelets, and large plasma proteins", emo: "🚫", bin: "periodic", why: "Capillaries & Tissue Fluid: Erythrocytes, platelets, albumin, and fibrinogen are too large to pass through normal capillary endothelial pores." },
      { id: "vein-lumen", name: "Thin, less elastic wall surrounding a wide, easily collapsible lumen", emo: "🔵", bin: "non", why: "Veins & Lymphatic System: Veins carry blood back toward the heart under very low hydrostatic pressure (~2–10 mmHg)." },
      { id: "vein-valves", name: "Internal pocket semilunar valves + skeletal muscle contraction prevent backflow", emo: "🚪", bin: "non", why: "Veins & Lymphatic System: Contracting leg muscles squeeze thin-walled veins and pocket valves ensure blood moves only uphill toward the heart." },
      { id: "lymph-return", name: "Blind-ended lymph capillaries drain excess 15% tissue fluid to subclavian veins", emo: "🟢", bin: "non", why: "Veins & Lymphatic System: While 85% of tissue fluid re-enters venules by osmosis (NFP = −10 mmHg), 15% drains as lymph via the thoracic duct into the subclavian veins." },
      { id: "lacteals", name: "Intestinal lacteals absorb fatty acids & glycerol; lymph nodes make lymphocytes", emo: "🛡️", bin: "non", why: "Veins & Lymphatic System: Lacteals in ileum villi absorb emulsified lipids, while lymph nodes filter bacteria and produce antibodies." }
    ],

    // ---- 2. 3D Starling Capillary Filtration Bench trials (Distance along capillary L in %, π_c = 25.0 mmHg) ----
    trials: [
      { label: "A", L: 0,   t: "35.0",  T: "25.0",  T2: "+10.0" },
      { label: "B", L: 25,  t: "30.0",  T: "25.0",  T2: "+5.0" },
      { label: "C", L: 50,  t: "25.0",  T: "25.0",  T2: "0.0" },
      { label: "D", L: 75,  t: "20.0",  T: "25.0",  T2: "-5.0" },
      { label: "E", L: 100, t: "15.0",  T: "25.0",  T2: "-10.0" }
    ],
    tOptions: ["35.0", "30.0", "25.0", "20.0", "15.0"],
    TOptions: ["10.0", "15.0", "25.0", "35.0", "45.0"],
    T2Options: ["+10.0", "+5.0", "0.0", "-5.0", "-10.0"],

    // ---- 3. Systemic Vascular Tree & Lymphatic Explorer pins ----
    pins: [
      { frac: -1.0, label: "1 · Elastic Aorta & Muscular Arteries", emo: "🔴", x: "P = 120/80 mmHg · v ≈ 35 cm/s", v: "Thick Tunica Media", a: "Narrow Lumen · No Valves", ke: "Elastic Recoil", pe: "Away from Heart", note: "Arteries carry blood away from the heart under high pulsatile pressure. Thick smooth muscle and elastic fibres prevent bursting and maintain diastolic flow." },
      { frac: -0.5, label: "2 · Arterioles & Pre-Capillary Sphincters", emo: "🎛️", x: "P drops 95 → 35 mmHg", v: "Smooth Muscle Rings", a: "Vasoconstriction / Dilation", ke: "Resistance Vessels", pe: "Shunts Blood to Organs", note: "Arterioles are the main resistance vessels of the body: they dilate in active skeletal muscles during exercise and constrict in the gut or skin during cold/fright." },
      { frac: 0.0,  label: "3 · Capillary Bed (Arterial End — Ultrafiltration)", emo: "💧", x: "P_c = 35 > π_c = 25 mmHg", v: "NFP = +10 mmHg (Outward)", a: "1-Cell Squamous Endothelium", ke: "Forms Tissue Fluid", pe: "No RBCs or Albumin", note: "At the arterial end of a capillary, outward hydrostatic pressure (35 mmHg) exceeds inward plasma protein osmotic pressure (25 mmHg), forcing water, glucose, amino acids, and O₂ out as tissue fluid." },
      { frac: 0.5,  label: "4 · Capillary Bed (Venous End — Osmotic Reabsorption)", emo: "🔄", x: "P_c = 15 < π_c = 25 mmHg", v: "NFP = −10 mmHg (Inward)", a: "85% Fluid Reabsorbed", ke: "Carries CO₂ & Urea", pe: "Drains to Venules", note: "By the venous end, friction has lowered hydrostatic pressure to 15 mmHg while retained plasma proteins still exert 25 mmHg osmotic pull (NFP = −10 mmHg), drawing ~85% of fluid and CO₂/urea back into the blood." },
      { frac: 1.0,  label: "5 · Veins (Pocket Valves) & Lymphatic Ducts", emo: "🟢", x: "P = 10 → 2 mmHg · 15% Lymph", v: "Wide Lumen + Pocket Valves", a: "Skeletal Muscle Pump", ke: "Lymph Nodes & Lacteals", pe: "Subclavian Vein Return", note: "The remaining 15% of tissue fluid (~3.0 L/day) enters blind-ended lymph capillaries, passes through lymph nodes (phagocytes + lymphocytes), and rejoins venous blood at the left and right subclavian veins." }
    ]
  };

  // ---- 4. 12 WAEC / NECO / JAMB Quiz Questions ----
  window.LESSON_QUIZ = [
    {
      q: "Which of the following structural features correctly distinguishes a mammalian <strong>artery</strong> from a <strong>vein</strong> in transverse section?",
      o: [
        "An artery has a thin muscular wall, a wide lumen, and internal pocket valves",
        "An artery has a thick muscular and elastic wall (tunica media), a relatively narrow circular lumen, and no valves along its length",
        "An artery has a wall that is only one endothelial cell thick",
        "An artery carries blood under low non-pulsatile pressure toward the heart"
      ],
      a: 1,
      e: "<strong>Arteries</strong> have a thick <strong>tunica media</strong> (elastic and smooth muscle fibres) and a <strong>narrow circular lumen</strong> without internal valves; <strong>veins</strong> have thin walls, a <strong>wide lumen</strong>, and <strong>semilunar pocket valves</strong>.",
      src: "WAEC-style"
    },
    {
      q: "Why do mammalian <strong>veins</strong> possess pocket (semilunar) valves at intervals along their length whereas arteries do not?",
      o: [
        "Because veins carry oxygenated blood at 120 mmHg",
        "Because blood in veins flows at very low pressure (often uphill against gravity), so valves are needed to prevent backflow",
        "To prevent red blood cells from entering the right atrium",
        "To slow down blood velocity inside the aorta"
      ],
      a: 1,
      e: "Venous blood pressure is very low (<code>2–10 mmHg</code>); <strong>pocket valves</strong> work with surrounding <strong>skeletal muscle contractions</strong> and respiratory movements to keep blood moving one-way toward the heart.",
      src: "WAEC-style"
    },
    {
      q: "How is the structure of a <strong>blood capillary</strong> specifically adapted for rapid exchange of oxygen, glucose, and carbon dioxide with surrounding tissue cells?",
      o: [
        "Its wall consists of three thick layers of collagen and smooth muscle",
        "Its wall is a single layer of flattened squamous endothelial cells (one cell thick) with microscopic pores and a very narrow lumen (~8 µm) through which red blood cells pass in single file",
        "It contains pocket valves every 10 micrometres",
        "Blood flows fastest in capillaries (~35 cm/s)"
      ],
      a: 1,
      e: "A <strong>one-cell-thick squamous endothelium</strong> minimises diffusion distance (~1 µm), and the 8 µm diameter forces biconcave RBCs to brush directly against the capillary wall in single file.",
      src: "JAMB-style"
    },
    {
      q: "Although an individual capillary is microscopic, why does blood flow <strong>slowest</strong> in the capillary beds (~0.03 cm/s) compared to the aorta (~35 cm/s)?",
      o: [
        "Because the heart stops beating whenever blood enters capillaries",
        "Because the combined total cross-sectional area of billions of parallel capillaries (~4,500 cm²) is over 1,000 times larger than the cross-sectional area of the aorta (~4.5 cm²), and v = Q ÷ A",
        "Because capillaries have the highest blood pressure in the body",
        "Because red blood cells solidify inside capillaries"
      ],
      a: 1,
      e: "By the law of continuity (<code>A₁v₁ = A₂v₂</code>), when total cross-sectional area <code>A</code> increases 1,000-fold in the capillary bed, flow velocity <code>v</code> drops 1,000-fold, giving ample time for diffusion.",
      src: "JAMB-style"
    },
    {
      q: "At the <strong>arterial end</strong> of a systemic capillary, blood hydrostatic pressure is <strong>P_c = 35 mmHg</strong> and plasma protein colloid osmotic pressure is <strong>π_c = 25 mmHg</strong>. What is the Net Filtration Pressure (NFP) and what process occurs?",
      o: [
        "NFP = +10 mmHg; ultrafiltration of water, glucose, amino acids, and oxygen outward to form tissue fluid",
        "NFP = −10 mmHg; osmotic reabsorption of fluid into the capillary",
        "NFP = +60 mmHg; bursting of red blood cells",
        "NFP = 0 mmHg; no movement of fluid"
      ],
      a: 0,
      e: "At the arterial end, <code>NFP = P_c − π_c = 35 − 25 = +10 mmHg</code> (outward), driving <strong>ultrafiltration</strong> to form interstitial <strong>tissue fluid</strong>.",
      src: "WAEC-style"
    },
    {
      q: "Which of the following components of whole mammalian blood are <strong>ABSENT</strong> from normal intercellular <strong>tissue fluid</strong> and <strong>lymph</strong>?",
      o: [
        "Water, glucose, and mineral ions",
        "Amino acids and dissolved oxygen",
        "Red blood cells (erythrocytes), platelets (thrombocytes), and large plasma proteins (such as albumin and fibrinogen)",
        "Leucocytes (lymphocytes) and urea"
      ],
      a: 2,
      e: "<strong>Erythrocytes, platelets, and large plasma proteins</strong> cannot pass through the tiny endothelial pores of normal capillary walls; phagocytes and lymphocytes can squeeze through by amoeboid movement.",
      src: "WAEC-style"
    },
    {
      q: "At the <strong>venous end</strong> of a capillary bed, hydrostatic pressure has fallen to <strong>P_c = 15 mmHg</strong> while plasma protein osmotic pressure remains <strong>π_c = 25 mmHg</strong>. What happens to the tissue fluid?",
      o: [
        "All tissue fluid remains permanently trapped between cells",
        "NFP = −10 mmHg (inward), so ~85% of the tissue fluid (carrying CO₂ and urea) is reabsorbed into the capillary by osmosis, while the remaining ~15% drains into blind-ended lymphatic capillaries",
        "Red blood cells are forced out of the venule",
        "Hydrostatic pressure rises back to 120 mmHg"
      ],
      a: 1,
      e: "Because <code>P_c (15) < π_c (25)</code>, <code>NFP = −10 mmHg</code> pulls ~85% of fluid back into the venule; the remaining ~15% enters <strong>lymphatic vessels</strong> as <strong>lymph</strong>.",
      src: "JAMB-style"
    },
    {
      q: "Through which major veins does <strong>lymph</strong> from the thoracic duct and right lymphatic duct finally return into the blood circulatory system?",
      o: [
        "Renal veins",
        "Pulmonary veins",
        "Left and right subclavian veins (near the collarbones)",
        "Hepatic portal vein"
      ],
      a: 2,
      e: "The lymphatic ducts empty lymph back into the venous bloodstream at the <strong>left and right subclavian veins</strong> just before they join the superior vena cava.",
      src: "NECO-style"
    },
    {
      q: "Which of the following is NOT a function of the mammalian <strong>lymphatic system</strong>?",
      o: [
        "Returning excess tissue fluid and leaked proteins to the bloodstream to prevent oedema",
        "Absorbing fatty acids and glycerol via lacteals in the intestinal villi",
        "Producing lymphocytes and filtering bacteria inside lymph nodes",
        "Transporting oxygen bound to haemoglobin from the lungs to the brain"
      ],
      a: 3,
      e: "Lymph contains <strong>no red blood cells or haemoglobin</strong>, so it does not transport oxygen from the lungs; its three roles are <strong>fluid return, lipid absorption (lacteals), and immune defence (lymph nodes)</strong>.",
      src: "WAEC-style"
    },
    {
      q: "Severe swelling (<strong>elephantiasis / lymphoedema</strong>) of the legs in tropical West Africa is caused when adult parasitic filarial worms (<em>Wuchereria bancrofti</em>, transmitted by mosquitoes) block the:",
      o: [
        "Coronary arteries",
        "Pulmonary veins",
        "Lymphatic vessels and lymph nodes, preventing drainage of excess tissue fluid",
        "Bicuspid valve"
      ],
      a: 2,
      e: "When <strong><em>Wuchereria bancrofti</em></strong> worms obstruct lymphatic vessels, the 15% excess tissue fluid (~3 L/day) cannot drain back to the subclavian veins, causing massive <strong>oedema (elephantiasis)</strong>.",
      src: "WAEC-style"
    },
    {
      q: "Why does a child suffering from severe protein malnutrition (<strong>kwashiorkor</strong>) develop a swollen abdomen and puffy ankles (<strong>oedema</strong>)?",
      o: [
        "High blood protein concentration pulls too much water into veins",
        "Deficiency of plasma proteins (especially albumin) lowers plasma colloid osmotic pressure (π_c), so water cannot be reabsorbed at the venous end of capillaries and accumulates in tissue spaces",
        "Excessive red blood cells block the aorta",
        "The tricuspid valve has four flaps"
      ],
      a: 1,
      e: "In <strong>kwashiorkor</strong>, low liver synthesis of <strong>albumin</strong> reduces inward osmotic pull <code>π_c</code> below 15 mmHg, crippling venous reabsorption and leaving excess fluid in the tissues.",
      src: "JAMB-style"
    },
    {
      q: "If <strong>20.0 L/day</strong> of fluid filters out at the arterial ends of systemic capillaries and <strong>85%</strong> is reabsorbed directly at the venous ends, what volume of <strong>lymph</strong> must be returned to the subclavian veins per day to prevent oedema?",
      o: ["1.5 L/day", "3.0 L/day", "17.0 L/day", "20.0 L/day"],
      a: 1,
      e: "Reabsorbed volume <code>V_reabs = 0.85 × 20.0 = 17.0 L/day</code>. Remaining lymph volume <code>V_lymph = 20.0 − 17.0 = 3.0 L/day</code> (15% of 20.0 L).",
      src: "JAMB-style"
    }
  ];
})();
