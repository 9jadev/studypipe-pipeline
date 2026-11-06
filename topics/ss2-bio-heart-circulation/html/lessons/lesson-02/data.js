/* Lesson 02 · Structure of the Mammalian Heart & The Double-Circulation Pathway — content data and 12 WAEC/NECO/JAMB quiz questions */
(function () {
  "use strict";

  window.L02 = {
    // ---- 1. Heart Chambers, Great Vessels & Valves Sort items (12 cards across 3 bins) ----
    items: [
      { id: "vcava", name: "Superior & inferior venae cavae emptying into the right atrium", emo: "🔵", bin: "shm", why: "Right / Pulmonary (Deoxygenated): Venae cavae return deoxygenated venous blood from the head, arms, and lower body into the right atrium." },
      { id: "rv-5mm", name: "Right ventricle (5 mm wall) pumping blood at ~25 mmHg to the lungs", emo: "🫁", bin: "shm", why: "Right / Pulmonary (Deoxygenated): The right ventricle has a moderately thin wall (~5 mm) because the lungs are right next to the heart." },
      { id: "pulm-art", name: "Pulmonary artery — the ONLY artery carrying deoxygenated blood", emo: "⚠️", bin: "shm", why: "Right / Pulmonary (Deoxygenated): Leaves the right ventricle and branches to the left and right lungs carrying deoxygenated blood." },
      { id: "cor-sinus", name: "Coronary sinus returning deoxygenated cardiac venous blood to right atrium", emo: "💙", bin: "shm", why: "Right / Pulmonary (Deoxygenated): After feeding the myocardium, deoxygenated coronary blood drains into the right atrium via the coronary sinus." },
      { id: "pulm-vein", name: "Pulmonary veins — the ONLY veins carrying oxygenated blood", emo: "🩸", bin: "periodic", why: "Left / Systemic (Oxygenated): Four pulmonary veins bring freshly oxygenated blood from the lungs into the left atrium." },
      { id: "lv-15mm", name: "Left ventricle (15 mm wall — 3× thicker than RV) pumping at ~120 mmHg", emo: "💪", bin: "periodic", why: "Left / Systemic (Oxygenated): Generates ~120 mmHg to propel oxygenated blood through the entire systemic circuit from head to toes." },
      { id: "aorta", name: "Arch of the aorta — largest elastic artery supplying the systemic body", emo: "🚀", bin: "periodic", why: "Left / Systemic (Oxygenated): Receives high-pressure oxygenated blood from the left ventricle and distributes it to all systemic arteries." },
      { id: "cor-art", name: "Left & right coronary arteries branching off the base of the aorta", emo: "❤️", bin: "periodic", why: "Left / Systemic (Oxygenated): First branches of the ascending aorta that supply oxygenated blood and glucose directly to cardiac muscle." },
      { id: "tricuspid", name: "Tricuspid valve (3 flaps) guarding the right atrioventricular opening", emo: "3️⃣", bin: "non", why: "Valves & Septum: Prevents backflow of deoxygenated blood from the right ventricle into the right atrium during ventricular systole." },
      { id: "bicuspid", name: "Bicuspid / Mitral valve (2 flaps) guarding the left atrioventricular opening", emo: "2️⃣", bin: "non", why: "Valves & Septum: Prevents backflow of oxygenated blood from the left ventricle into the left atrium during ventricular systole." },
      { id: "chordae", name: "Chordae tendineae ('heart strings') anchored to papillary muscles", emo: "🪢", bin: "non", why: "Valves & Septum: Inelastic collagen cords that prevent the bicuspid and tricuspid valve cusps from inverting into the atria." },
      { id: "septum", name: "Muscular interventricular septum & double-walled pericardial sac", emo: "🛡️", bin: "non", why: "Valves & Septum: The septum prevents mixing of right and left blood, while pericardial fluid reduces friction and prevents over-expansion." }
    ],

    // ---- 2. 3D Chamber Wall-Thickness & Pressure Bench trials (Wall thickness w in mm, Peak pressure P = 8w in mmHg) ----
    trials: [
      { label: "A", L: 1.5,  t: "Right Atrium",     T: "12.0",   T2: "0.30" },
      { label: "B", L: 2.0,  t: "Left Atrium",      T: "16.0",   T2: "0.40" },
      { label: "C", L: 5.0,  t: "Right Ventricle",  T: "40.0",   T2: "1.00" },
      { label: "D", L: 10.0, t: "Mid Septum",       T: "80.0",   T2: "2.00" },
      { label: "E", L: 15.0, t: "Left Ventricle",   T: "120.0",  T2: "3.00" }
    ],
    tOptions: ["Right Atrium", "Left Atrium", "Right Ventricle", "Mid Septum", "Left Ventricle"],
    TOptions: ["12.0", "16.0", "40.0", "80.0", "120.0"],
    T2Options: ["0.30", "0.40", "1.00", "2.00", "3.00"],

    // ---- 3. Double-Circulation Pathway Explorer pins ----
    pins: [
      { frac: -1.0, label: "1 · Venae Cavae → Right Atrium → Tricuspid Valve", emo: "🔵", x: "Deoxygenated Venous Return", v: "Wall w ≈ 2 mm · P ≈ 5 mmHg", a: "Tricuspid Valve (3 flaps)", ke: "Superior & Inferior Vena Cava", pe: "Coronary Sinus Drains Here", note: "Deoxygenated blood from the head/arms (superior vena cava), lower body (inferior vena cava), and heart wall (coronary sinus) fills the thin-walled right atrium and flows through the 3-flap tricuspid valve." },
      { frac: -0.5, label: "2 · Right Ventricle → Pulmonary Semilunar → Pulmonary Artery", emo: "🫁", x: "Pulmonary Outflow Tract", v: "Wall w = 5 mm · P = 25 mmHg", a: "Pulmonary SL Valve", ke: "Only Deoxygenated Artery!", pe: "Short Hop to Lungs", note: "The right ventricle contracts with moderate pressure (~25 mmHg), snapping the tricuspid valve shut and forcing open the pulmonary semilunar valve into the pulmonary artery." },
      { frac: 0.0,  label: "3 · Lung Alveoli → Pulmonary Veins → Left Atrium → Bicuspid Valve", emo: "🩸", x: "Oxygenated Pulmonary Return", v: "Hb + 4O₂ ⇌ HbO₈", a: "Bicuspid / Mitral (2 flaps)", ke: "Only Oxygenated Veins!", pe: "Enters Left Atrium", note: "In the alveolar capillaries, CO₂ diffuses out and O₂ binds haemoglobin to form bright-red oxyhaemoglobin. Four pulmonary veins deliver this oxygenated blood into the left atrium and through the 2-flap bicuspid (mitral) valve." },
      { frac: 0.5,  label: "4 · Left Ventricle (15 mm) → Aortic Semilunar → Arch of Aorta", emo: "🚀", x: "High-Pressure Systemic Pump", v: "Wall w = 15 mm (3× RV)", a: "P = 120 mmHg · Aortic SL", ke: "Chordae Hold Mitral Taut", pe: "Pumps to Whole Body", note: "The thick muscular left ventricle (3× thicker than the right ventricle) generates ~120 mmHg, snapping the mitral valve shut and ejecting blood past the aortic semilunar valve into the aorta." },
      { frac: 1.0,  label: "5 · Coronary Arteries & Hepatic Portal Vein Special Pathways", emo: "❤️", x: "Heart Nutrition & Gut-to-Liver Link", v: "Coronary off Base of Aorta", a: "Hepatic Portal: Gut → Liver", ke: "Blocks = Heart Attack", pe: "Regulates Blood Glucose", note: "Coronary arteries branch off the ascending aorta to supply oxygen to cardiac muscle; the hepatic portal vein carries nutrient-rich blood from the ileum villi directly to the liver before the hepatic vein joins the inferior vena cava." }
    ]
  };

  // ---- 4. 12 WAEC / NECO / JAMB Quiz Questions ----
  window.LESSON_QUIZ = [
    {
      q: "The tough, double-walled membranous sac that encloses the mammalian heart and secretes fluid to reduce friction during heartbeat is the:",
      o: ["Pleural membrane", "Peritoneum", "Pericardium", "Endocardium"],
      a: 2,
      e: "The <strong>pericardium</strong> surrounds the heart; <strong>pericardial fluid</strong> between its inner visceral and outer parietal membranes lubricates every contraction and prevents over-distension.",
      src: "WAEC-style"
    },
    {
      q: "Why is the muscular wall of the <strong>left ventricle</strong> approximately three times thicker than the wall of the <strong>right ventricle</strong>?",
      o: [
        "The left ventricle pumps three times more volume of blood per beat than the right ventricle",
        "The left ventricle must generate much higher pressure (~120 mmHg) to pump blood around the entire systemic body, whereas the right ventricle pumps blood only a short distance to the lungs (~25 mmHg)",
        "The left ventricle contains deoxygenated blood which is heavier than oxygenated blood",
        "The right ventricle has no valves at its exit"
      ],
      a: 1,
      e: "Both ventricles pump the <strong>exact same stroke volume (~70 mL)</strong>, but the left ventricle must overcome the high resistance of the long systemic circuit from head to toes.",
      src: "WAEC-style"
    },
    {
      q: "Which valve prevents the backflow of oxygenated blood from the <strong>left ventricle</strong> into the <strong>left atrium</strong> during ventricular contraction?",
      o: [
        "Tricuspid valve",
        "Bicuspid (mitral) valve",
        "Pulmonary semilunar valve",
        "Aortic semilunar valve"
      ],
      a: 1,
      e: "The <strong>bicuspid (mitral) valve</strong> has two flaps between the left atrium and left ventricle; the <strong>tricuspid valve</strong> (three flaps) lies on the right side.",
      src: "JAMB-style"
    },
    {
      q: "What is the exact function of the <strong>chordae tendineae</strong> and <strong>papillary muscles</strong> inside the ventricles of the mammalian heart?",
      o: [
        "To initiate the electrical pacemaker impulse of the heart",
        "To pull the semilunar valves open during diastole",
        "To hold the bicuspid and tricuspid valve flaps taut during ventricular systole so they do not invert (turn inside out) into the atria",
        "To pump blood into the coronary arteries"
      ],
      a: 2,
      e: "When the ventricles contract powerfully, <strong>papillary muscles</strong> contract and pull on the inelastic <strong>chordae tendineae</strong>, preventing the AV valve cusps from prolapsing into the atria.",
      src: "WAEC-style"
    },
    {
      q: "Identify the ONLY artery in an adult mammal that carries <strong>deoxygenated blood</strong> and the ONLY vein that carries <strong>oxygenated blood</strong>:",
      o: [
        "Aorta and Inferior vena cava",
        "Coronary artery and Hepatic portal vein",
        "Pulmonary artery and Pulmonary vein",
        "Renal artery and Renal vein"
      ],
      a: 2,
      e: "Arteries carry blood <em>away</em> from the heart and veins carry blood <em>towards</em> the heart: thus the <strong>pulmonary artery</strong> carries deoxygenated blood to the lungs, and the <strong>pulmonary vein</strong> returns oxygenated blood to the left atrium.",
      src: "WAEC-style"
    },
    {
      q: "Trace the correct sequential pathway of a red blood cell travelling from the <strong>inferior vena cava</strong> to the <strong>aorta</strong>:",
      o: [
        "Right atrium → Bicuspid valve → Right ventricle → Pulmonary vein → Lungs → Pulmonary artery → Left atrium → Tricuspid valve → Left ventricle → Aorta",
        "Right atrium → Tricuspid valve → Right ventricle → Pulmonary artery → Lungs → Pulmonary vein → Left atrium → Bicuspid valve → Left ventricle → Aorta",
        "Left atrium → Tricuspid valve → Left ventricle → Pulmonary artery → Lungs → Right atrium → Right ventricle → Aorta",
        "Right ventricle → Tricuspid valve → Right atrium → Aorta"
      ],
      a: 1,
      e: "Right side (deoxygenated): <strong>Vena cava → RA → Tricuspid → RV → Pulmonary SL → Pulmonary artery → Lungs</strong>. Left side (oxygenated): <strong>Pulmonary vein → LA → Bicuspid → LV → Aortic SL → Aorta</strong>.",
      src: "JAMB-style"
    },
    {
      q: "Which blood vessel branches directly off the base of the ascending aorta to supply oxygenated blood and glucose to the contracting cardiac muscle itself?",
      o: [
        "Carotid artery",
        "Coronary artery",
        "Subclavian artery",
        "Pulmonary artery"
      ],
      a: 1,
      e: "The left and right <strong>coronary arteries</strong> branch from the root of the aorta; blockage of a coronary artery by a blood clot (thrombus) causes a <strong>myocardial infarction (heart attack)</strong>.",
      src: "NECO-style"
    },
    {
      q: "Why is the <strong>hepatic portal vein</strong> unique among veins in the mammalian systemic circulation?",
      o: [
        "It connects the right ventricle directly to the lungs",
        "It begins in capillaries of the small intestine (ileum) and ends in capillaries (sinusoids) of the liver without passing through the heart in between",
        "It carries blood at a higher pressure than the aorta",
        "It contains no red blood cells"
      ],
      a: 1,
      e: "A <strong>portal vein</strong> connects two capillary beds in series: the <strong>hepatic portal vein</strong> transports newly absorbed glucose and amino acids from intestinal villi directly to the liver for regulation and detoxification.",
      src: "JAMB-style"
    },
    {
      q: "During echocardiogram examination of a healthy athlete, the left ventricular end-diastolic volume (EDV) is <strong>125 mL</strong> and the end-systolic volume (ESV) is <strong>50 mL</strong>. Calculate the stroke volume (SV) and ejection fraction (EF%).",
      o: [
        "SV = 75 mL; EF = 60.0%",
        "SV = 175 mL; EF = 40.0%",
        "SV = 75 mL; EF = 150.0%",
        "SV = 50 mL; EF = 40.0%"
      ],
      a: 0,
      e: "Stroke volume <code>SV = EDV − ESV = 125 − 50 = 75 mL</code>. Ejection fraction <code>EF% = (SV ÷ EDV) × 100% = (75 ÷ 125) × 100% = 60.0%</code>.",
      src: "JAMB-style"
    },
    {
      q: "What structural wall separates the left side of the mammalian heart completely from the right side, preventing any mixing of oxygenated and deoxygenated blood?",
      o: [
        "Chordae tendineae",
        "Interatrial and interventricular septum",
        "Pericardial membrane",
        "Sinoatrial node"
      ],
      a: 1,
      e: "The muscular <strong>septum</strong> (interatrial and interventricular septum) forms an impermeable wall between the right and left pumps.",
      src: "WAEC-style"
    },
    {
      q: "In a WAEC Paper 3 practical, a candidate makes a labelled drawing of a longitudinal section of a sheep's heart measuring <strong>9.6 cm</strong> in length. If the actual specimen length is <strong>12.0 cm</strong>, what is the linear magnification of the drawing?",
      o: ["×0.8", "×1.25", "×8.0", "×21.6"],
      a: 0,
      e: "Using identical units (cm): <code>M = I ÷ A = 9.6 cm ÷ 12.0 cm = ×0.8</code>.",
      src: "WAEC Practical"
    },
    {
      q: "Which of the following correctly lists the four chambers of the mammalian heart in descending order of myocardial wall thickness?",
      o: [
        "Right ventricle > Left ventricle > Right atrium > Left atrium",
        "Left ventricle > Right ventricle > Atria (Left & Right)",
        "Left atrium > Right atrium > Left ventricle > Right ventricle",
        "All four chambers have identical wall thickness"
      ],
      a: 1,
      e: "The <strong>left ventricle (~15 mm)</strong> is thickest, followed by the <strong>right ventricle (~5 mm)</strong>, while the <strong>atria (~2 mm)</strong> have the thinnest walls because they pump blood only into the adjacent ventricles.",
      src: "WAEC-style"
    }
  ];
})();
