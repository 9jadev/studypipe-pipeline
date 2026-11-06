/* Lesson 01 · Need for Transport — Open vs Closed & Single vs Double Circulation — content data and 12 WAEC/NECO/JAMB quiz questions */
(function () {
  "use strict";

  window.L01 = {
    // ---- 1. Circulatory Systems Sort items (12 cards across 3 bins) ----
    items: [
      { id: "haemocoel", name: "Colourless haemolymph bathes organs directly in a haemocoel", emo: "🪳", bin: "shm", why: "Open Circulation: In arthropods (cockroach, grasshopper), haemolymph leaves the dorsal tubular heart and fills open body sinuses (haemocoel)." },
      { id: "ostia", name: "13-chambered dorsal tubular heart with paired lateral ostia", emo: "🚪", bin: "shm", why: "Open Circulation: Cockroaches pump haemolymph forward through a 13-chambered dorsal vessel that refills via valved ostia." },
      { id: "trachea-o2", name: "Haemolymph lacks haemoglobin — tracheal tubes deliver O₂ directly", emo: "🌬️", bin: "shm", why: "Open Circulation: Insect haemolymph transports food and waste only; spiracles and tracheoles deliver oxygen directly to tissues." },
      { id: "low-p", name: "Very low hydrostatic pressure & slow return of fluid to heart", emo: "🐢", bin: "shm", why: "Open Circulation: Because fluid empties into a wide body cavity, hydrostatic pressure drops near zero." },
      { id: "fish-2ch", name: "2-chambered heart (1 atrium + 1 ventricle) pumping deoxygenated blood", emo: "🐟", bin: "periodic", why: "Single Closed Circulation: Bony fishes (Tilapia) have a two-chambered heart that receives and pumps only deoxygenated blood." },
      { id: "gill-drop", name: "Blood passes through the heart ONCE per complete body circuit", emo: "🔄", bin: "periodic", why: "Single Closed Circulation: Heart → Gill capillaries → Dorsal aorta → Body capillaries → Heart (one heart passage per lap)." },
      { id: "gill-p", name: "Systemic arterial pressure drops sharply across gill capillaries", emo: "📉", bin: "periodic", why: "Single Closed Circulation: Narrow gill capillaries create high resistance, so blood flows sluggishly to the rest of the fish's body." },
      { id: "sinus-conus", name: "Venous blood enters via sinus venosus and exits via conus arteriosus to gills", emo: "🌊", bin: "periodic", why: "Single Closed Circulation: In fish, deoxygenated blood flows Sinus venosus → Atrium → Ventricle → Conus arteriosus → Ventral aorta → Gills." },
      { id: "double-pass", name: "Blood passes through the heart TWICE per complete circuit (pulmonary + systemic)", emo: "🫀", bin: "non", why: "Double Closed Circulation: The right side pumps to the lungs (pulmonary) and the left side repumps oxygenated blood to the body (systemic)." },
      { id: "toad-3ch", name: "3-chambered heart (2 atria + 1 ventricle) in toad & most lizards", emo: "🐸", bin: "non", why: "Double Closed Circulation: Amphibians and most reptiles have incomplete double circulation with two atria and one undivided or partially divided ventricle." },
      { id: "mammal-4ch", name: "4-chambered heart with complete interventricular septum in birds & mammals", emo: "🦅", bin: "non", why: "Double Closed Circulation: Complete separation of oxygenated and deoxygenated blood supports high pressure and endothermy (warm-bloodedness)." },
      { id: "croc-exc", name: "Crocodile exception — the only reptile with a complete 4-chambered heart", emo: "🐊", bin: "non", why: "Double Closed Circulation: Unlike lizards and snakes, crocodiles possess a completely divided four-chambered heart." }
    ],

    // ---- 2. 3D SA/V Cube & Diffusion Distance Practical trials (Cube side length L in mm) ----
    trials: [
      { label: "A", L: 0.2,  t: "0.24",   T: "0.008",  T2: "30.00" },
      { label: "B", L: 1.0,  t: "6.00",   T: "1.000",  T2: "6.00" },
      { label: "C", L: 2.0,  t: "24.00",  T: "8.000",  T2: "3.00" },
      { label: "D", L: 5.0,  t: "150.0",  T: "125.0",  T2: "1.20" },
      { label: "E", L: 10.0, t: "600.0",  T: "1000",   T2: "0.60" }
    ],
    tOptions: ["0.24", "6.00", "24.00", "150.0", "600.0"],
    TOptions: ["0.008", "1.000", "8.000", "125.0", "1000"],
    T2Options: ["30.00", "6.00", "3.00", "1.20", "0.60"],

    // ---- 3. Comparative Transport Scale Explorer pins ----
    pins: [
      { frac: -1.0, label: "Amoeba proteus (Unicellular)", emo: "🦠", x: "L = 0.1 mm · SA/V = 60 mm⁻¹", v: "Simple Diffusion + Cyclosis", a: "0 Heart Chambers", ke: "Huge SA/V Ratio", pe: "Diffusion < 0.05 mm", note: "Every point inside Amoeba is within 0.05 mm of pond water, so simple diffusion and cytoplasmic streaming suffice without any circulatory system." },
      { frac: -0.5, label: "Cockroach (Periplaneta americana)", emo: "🪳", x: "Open System · Haemocoel", v: "13-Chamber Dorsal Tube", a: "Low Hydrostatic Pressure", ke: "Colourless Haemolymph", pe: "Tracheae Carry O₂", note: "Haemolymph lacks haemoglobin and bathes organs directly in the haemocoel; gaseous O₂ is delivered separately by spiracles and tracheoles." },
      { frac: 0.0,  label: "Tilapia (Bony Fish)", emo: "🐟", x: "Closed Single Circulation", v: "2 Chambers (1A + 1V)", a: "1 Heart Pass / Lap", ke: "Gill Capillary Drop", pe: "Low Systemic Pressure", note: "Deoxygenated blood is pumped to the gills, oxygenated there, and flows directly to body tissues at low pressure before returning to the heart." },
      { frac: 0.5,  label: "Bufo regularis (African Toad)", emo: "🐸", x: "Closed Incomplete Double", v: "3 Chambers (2A + 1V)", a: "Pulmocutaneous + Systemic", ke: "Single Ventricle", pe: "Partial Mixing", note: "Right atrium receives deoxygenated blood and left atrium receives oxygenated blood from lungs/skin, both emptying into a single ventricle with spiral ridges." },
      { frac: 1.0,  label: "Human, Bird & Crocodile", emo: "🫀", x: "Closed Complete Double", v: "4 Chambers (2A + 2V)", a: "Zero Mixing · 120 mmHg", ke: "Pulmonary (25 mmHg)", pe: "Systemic (120 mmHg)", note: "Complete interventricular septum separates deoxygenated and oxygenated blood, allowing high systemic pressure and high metabolic rate." }
    ]
  };

  // ---- 4. 12 WAEC / NECO / JAMB Quiz Questions ----
  window.LESSON_QUIZ = [
    {
      q: "Why does a microscopic organism such as <em>Amoeba proteus</em> NOT require a specialised blood circulatory system, whereas a human being does?",
      o: [
        "Amoeba has a thick cellulose cell wall that pumps water actively",
        "Amoeba has a very large surface-area-to-volume ratio (SA/V = 6/L) and a tiny diffusion distance, whereas a human has a very small SA/V ratio",
        "Amoeba does not carry out aerobic cellular respiration",
        "Amoeba possesses a two-chambered heart hidden inside its contractile vacuole"
      ],
      a: 1,
      e: "For a cube of side <code>L</code>, <code>SA/V = 6 ÷ L</code>. As organism size <code>L</code> increases from <code>0.1 mm</code> to <code>100 mm</code>, <code>SA/V</code> drops 1,000-fold and diffusion distance grows far too large for simple diffusion.",
      src: "WAEC-style"
    },
    {
      q: "A cubic block of living tissue has a side length of <strong>L = 2.0 mm</strong>, while a smaller cubic cell has a side length of <strong>L = 0.2 mm</strong>. How many times larger is the surface-area-to-volume ratio of the smaller cell compared to the tissue block?",
      o: ["2 times", "5 times", "10 times", "100 times"],
      a: 2,
      e: "Using <code>SA/V = 6 ÷ L</code>: for the small cell <code>R₁ = 6 ÷ 0.2 = 30 mm⁻¹</code>; for the tissue block <code>R₂ = 6 ÷ 2.0 = 3.0 mm⁻¹</code>. Ratio <code>F = 30 ÷ 3.0 = 10 times</code>.",
      src: "JAMB-style"
    },
    {
      q: "Why does the colourless haemolymph of a cockroach (<em>Periplaneta americana</em>) play NO role in transporting oxygen to its flight and leg muscles?",
      o: [
        "Cockroaches respire only anaerobically throughout their lives",
        "Insect haemolymph lacks haemoglobin (respiratory pigment), and oxygen is delivered directly to tissues by the tracheal system",
        "Cockroaches have a closed circulatory system with thick arteries",
        "Oxygen is transported exclusively by the Malpighian tubules"
      ],
      a: 1,
      e: "Insect haemolymph contains no haemoglobin; it transports digested food, hormones, and uric acid waste, while gaseous <strong>O₂ and CO₂ diffuse directly through spiracles, tracheae, and tracheoles</strong>.",
      src: "WAEC-style"
    },
    {
      q: "In the open circulatory system of an insect, haemolymph returns from the haemocoel into the 13-chambered dorsal tubular heart through paired valved openings called:",
      o: ["Spiracles", "Ostia", "Venae cavae", "Nephridiopores"],
      a: 1,
      e: "Each chamber of the cockroach's dorsal tubular heart has a pair of lateral valved openings called <strong>ostia</strong> that admit haemolymph from the pericardial sinus during relaxation.",
      src: "JAMB-style"
    },
    {
      q: "Which of the following invertebrates possesses a <strong>closed circulatory system</strong> in which red haemoglobin is dissolved directly in the plasma rather than packed inside red blood cells?",
      o: [
        "Cockroach (Periplaneta)",
        "Earthworm (Lumbricus terrestris)",
        "Grasshopper (Valanga)",
        "Freshwater Hydra"
      ],
      a: 1,
      e: "Annelids such as the <strong>earthworm (<em>Lumbricus</em>)</strong> have a closed vascular system (dorsal and ventral vessels linked by 5 pairs of pseudohearts) with haemoglobin dissolved in plasma.",
      src: "JAMB-style"
    },
    {
      q: "In a bony fish such as <em>Tilapia</em>, how many chambers does the heart possess and what type of blood flows through it?",
      o: [
        "2 chambers (1 atrium, 1 ventricle) containing only deoxygenated blood",
        "2 chambers (1 atrium, 1 ventricle) containing only oxygenated blood",
        "3 chambers (2 atria, 1 ventricle) containing mixed blood",
        "4 chambers (2 atria, 2 ventricles) containing separated blood"
      ],
      a: 0,
      e: "A fish heart has <strong>2 chambers (one atrium and one ventricle)</strong> that receive deoxygenated venous blood from the body and pump it to the gills for oxygenation (<strong>single circulation</strong>).",
      src: "WAEC-style"
    },
    {
      q: "Why is systemic arterial blood pressure significantly lower in a bony fish than in a mammal?",
      o: [
        "Fish blood contains no water",
        "In fish single circulation, blood passes through narrow gill capillaries first, losing most of its hydrostatic pressure before reaching the dorsal aorta and body organs",
        "Fish have four ventricles that cancel each other's pressure",
        "Fish arteries have pocket valves every 2 mm that slow blood down"
      ],
      a: 1,
      e: "Passing through the fine capillary network of the gills causes a steep resistance pressure drop; in mammals, oxygenated blood returns from the lungs to the <strong>left ventricle to be re-pumped at high pressure (~120 mmHg)</strong>.",
      src: "NECO-style"
    },
    {
      q: "Which of the following reptiles is an exception to the general rule that reptiles have an incompletely divided three-chambered heart, possessing instead a <strong>complete four-chambered heart</strong>?",
      o: ["Agama lizard", "Cobra", "Crocodile", "Tortoise"],
      a: 2,
      e: "<strong>Crocodiles</strong> (and alligators) are the only living reptiles with a completely divided <strong>four-chambered heart</strong> (2 atria, 2 ventricles).",
      src: "JAMB-style"
    },
    {
      q: "In the incomplete double circulation of an adult toad (<em>Bufo regularis</em>), the left atrium receives oxygenated blood from the:",
      o: [
        "Gills only",
        "Lungs and skin via the pulmonary veins",
        "Posterior vena cava only",
        "Hepatic portal vein"
      ],
      a: 1,
      e: "In amphibians, the <strong>right atrium</strong> receives deoxygenated systemic blood from the sinus venosus/venae cavae, while the <strong>left atrium</strong> receives oxygenated blood from the lungs.",
      src: "WAEC-style"
    },
    {
      q: "How many times does a single red blood cell pass through the mammalian heart during ONE complete circuit from the left ventricle to the toe capillaries and back to the left ventricle?",
      o: ["Once", "Twice", "Three times", "Four times"],
      a: 1,
      e: "In <strong>double circulation</strong>, blood passes through the heart <strong>twice</strong> per complete circuit: once through the right side (to the lungs) and once through the left side (to the systemic body).",
      src: "WAEC-style"
    },
    {
      q: "A resting student has a heart rate of <strong>75 beats/min</strong> and a stroke volume of <strong>70 mL/beat</strong>. If his total blood volume is <strong>5,250 mL</strong>, calculate his cardiac output (CO) and the time taken to circulate his entire blood volume once.",
      o: [
        "CO = 5,250 mL/min (5.25 L/min); Circulation time = 1.0 min (60 s)",
        "CO = 1,450 mL/min; Circulation time = 3.6 min",
        "CO = 7,500 mL/min; Circulation time = 0.5 min",
        "CO = 525 mL/min; Circulation time = 10 min"
      ],
      a: 0,
      e: "Cardiac output <code>CO = HR × SV = 75 × 70 = 5,250 mL/min = 5.25 L/min</code>. Full circulation time <code>t = V_blood ÷ CO = 5,250 ÷ 5,250 = 1.0 min (60 s)</code>.",
      src: "JAMB-style"
    },
    {
      q: "Which of the following is a major functional advantage of <strong>complete double circulation</strong> in birds and mammals over incomplete double circulation in amphibians?",
      o: [
        "It mixes oxygenated and deoxygenated blood to cool the brain",
        "It prevents any mixing of oxygenated and deoxygenated blood and maintains high systemic pressure to sustain a high metabolic rate and constant body temperature (endothermy)",
        "It eliminates the need for capillaries in skeletal muscles",
        "It allows blood to flow directly into the haemocoel"
      ],
      a: 1,
      e: "Complete separation by the <strong>interventricular septum</strong> ensures tissues receive 100% oxygenated blood at high systemic pressure while protecting delicate lung capillaries at lower pulmonary pressure.",
      src: "WAEC-style"
    }
  ];
})();
