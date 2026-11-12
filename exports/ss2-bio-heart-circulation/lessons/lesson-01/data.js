/* Lesson 01 · Why Big Bodies Need a Transport System: content data, cube model, and the 12 WAEC/NECO/JAMB quiz questions */
(function () {
  "use strict";

  var SIDES = [5, 10, 20, 30];
  var ACID_DEPTH = 3.0;           // mm reached on every face after 8 min (matches AgarCubeKit.ACID_DEPTH_MM)

  function fmtInt(n) {
    n = Math.round(n);
    var s = String(n);
    return n >= 10000 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, " ") : s;
  }
  function fmtRatio(r) { return r >= 1 ? r.toFixed(1) : r.toFixed(2); }
  function fmtPct(p) { return p >= 99.95 ? "100" : p.toFixed(1); }

  // The same model the bench kit uses: depth = min(3.0, L / 2), pink core = L - 2 depth, % colourless = (V - core^3) / V
  function model(L) {
    var depth = Math.min(ACID_DEPTH, L / 2);
    var core = Math.max(0, L - 2 * depth);
    var V = L * L * L, SA = 6 * L * L, pink = core * core * core;
    return { L: L, SA: SA, V: V, ratio: SA / V, depth: depth, moved: ACID_DEPTH, core: core, pink: pink, pct: (V - pink) / V * 100 };
  }

  window.L01 = {
    SIDES: SIDES,
    ACID_DEPTH: ACID_DEPTH,
    model: model,
    fmtInt: fmtInt, fmtRatio: fmtRatio, fmtPct: fmtPct,

    // ---- 2A. Sort: how does it move its blood? ----
    bins: {
      none: "No transport system",
      open: "Open circulation",
      "closed-single": "Closed, single",
      "closed-double": "Closed, double"
    },
    items: [
      { id: "amoeba", name: "Amoeba", emo: "🦠", bin: "none", why: "One tiny cell. Oxygen and food diffuse in through the whole surface, so it needs no heart and no blood." },
      { id: "paramecium", name: "Paramecium", emo: "🔬", bin: "none", why: "Also a single cell, a fraction of a millimetre long, so diffusion alone serves it." },
      { id: "cockroach", name: "Cockroach", emo: "🪳", bin: "open", why: "A tube heart pumps haemolymph into the body cavity (haemocoel), where it bathes the organs at low pressure." },
      { id: "snail", name: "Garden snail", emo: "🐌", bin: "open", why: "Its blood leaves the vessels and pools around the organs, so the system is open." },
      { id: "grasshopper", name: "Grasshopper", emo: "🦗", bin: "open", why: "Like other insects, haemolymph flows through the haemocoel, not inside vessels all the way round." },
      { id: "tilapia", name: "Tilapia", emo: "🐟", bin: "closed-single", why: "Blood stays in vessels and goes heart, gills, body, heart: only one trip through its two-chambered heart per circuit." },
      { id: "catfish", name: "Catfish", emo: "🐠", bin: "closed-single", why: "Closed and single, exactly like the tilapia: the heart is passed once per full circuit." },
      { id: "earthworm", name: "Earthworm", emo: "🪱", bin: "closed-single", why: "The blood stays inside vessels, but there is no separate lung loop, so it is closed and single." },
      { id: "pigeon", name: "Pigeon", emo: "🕊️", bin: "closed-double", why: "A four-chambered heart sends blood to the lungs and back, then out to the body: two trips through the heart per circuit." },
      { id: "chidi", name: "Chidi", emo: "🏃🏾", bin: "closed-double", why: "Humans have a closed, double circulation with a four-chambered heart." }
    ],

    // ---- 2B. Bench: table answer choices (the expected values are computed from the model) ----
    ratioOptions: ["0.20", "0.30", "0.60", "1.2", "6.0"],
    pinkOptions: ["0", "64", "512", "2744", "13 824", "27 000"],
    pctOptions: ["34.3", "48.8", "65.7", "93.6", "100"],

    // ---- 3. Explorer pins (cube side L, 8 min, 3.0 mm penetration) ----
    pins: [1, 2, 5, 10, 20, 30],

    // ---- 3. Circuit zoom ----
    circuits: {
      open: { label: "Open (cockroach)", trips: "1", pressure: "low", note: "Haemolymph is pumped into the haemocoel and sloshes round the organs. Pressure is low and the flow is slow." },
      single: { label: "Closed, single (tilapia)", trips: "1", pressure: "reduced", note: "One pump pushes the blood through the gills and then on to the body. Pressure is lost across the fine gill capillaries, so it arrives at the body reduced." },
      double: { label: "Closed, double (Chidi)", trips: "2", pressure: "high", note: "The blood goes back to the heart after the lungs and is pumped a second time, so it reaches the body at high pressure. Oxygen-rich and oxygen-poor blood stay apart." }
    },

    // ---- 4. Bridge: three reasoning steps for Dr Aisha's first clue ----
    bridge: [
      {
        q: "Chidi's SA : V is about 0.015 mm⁻¹ and an Amoeba's is about 30 mm⁻¹. What does this tell you about supplying Chidi's leg muscle by diffusion through the skin?",
        o: ["His skin is too small in total, so he needs more of it", "The surface serves far too little volume, and the muscle is far from the skin, so diffusion is far too slow", "Diffusion works faster in large animals"],
        a: 1,
        why: "It is the surface per unit volume that is tiny, and the distance from skin to muscle is long, so only a pumped supply can keep up."
      },
      {
        q: "Chidi sprints. What does this do to the oxygen his leg muscles need, and what must the transport system do?",
        o: ["Demand falls, so the blood can slow down", "Demand rises sharply, so the heart must deliver blood much faster (his pulse nearly doubled)", "Nothing changes, because respiration is the same at rest and in a sprint"],
        a: 1,
        why: "Active muscles burn oxygen and glucose quickly, so the heart speeds up to move blood faster. That is the nearly doubled pulse Dr Aisha felt."
      },
      {
        q: "Which design can deliver oxygen to his muscles quickly enough, and why?",
        o: ["Open circulation, because blood bathes every cell directly", "Closed single circulation, because the blood passes the heart once", "Closed double circulation, because blood from the lungs is pumped again and arrives at high pressure with no mixing"],
        a: 2,
        why: "Only the closed, double plan keeps the pressure high and the oxygen-rich blood separate, so it can feed muscles in a hurry."
      }
    ]
  };

  window.LESSON_QUIZ = [
    { q: "At the Oja Oba screening tent, Dr Aisha points out that a pond <em>Amoeba</em> gets all its oxygen by diffusion through its surface, but Chidi could never live that way. Which reason best explains the difference?",
      o: ["Chidi's cells need no oxygen while he is resting","Most of Chidi's cells lie far from his body surface, and diffusion is far too slow over such distances","Diffusion can only happen in water, and Chidi lives on land","Chidi's body has a smaller total surface area than the <em>Amoeba</em>"],
      a: 1,
      e: "Diffusion is quick only over tiny distances; in a thick body most cells sit many millimetres or centimetres from the skin, so a pumped supply is needed. A is false: every living cell respires all the time, so it needs oxygen even at rest. C is false: gases diffuse through air as well as water (oxygen diffuses into the alveoli from air). D is the ratio trap: Chidi's <em>total</em> surface area is millions of times larger; it is his surface area <em>per unit volume</em> (SA : V) that is tiny." },
    { q: "Which list names the pump, the channels and the medium of the mammalian transport system, in that order?",
      o: ["Blood; heart; blood vessels","Heart; blood; blood vessels","Blood vessels; heart; blood","Heart; blood vessels; blood"],
      a: 3,
      e: "The heart pushes (pump), the arteries, capillaries and veins carry (channels), and blood is the fluid that holds the materials (medium). A, B and C contain the right three words but in the wrong slots: A calls blood the pump, B swaps channels and medium, and C makes the vessels the pump." },
    { q: "A block of agar is cut into a cube of side 0.40 cm. What is its surface area to volume ratio, expressed in mm⁻¹?",
      o: ["1.5 mm⁻¹","15 mm⁻¹","150 mm⁻¹","0.67 mm⁻¹"],
      a: 0,
      e: "Convert first: 0.40 cm × 10 = 4.0 mm. Then SA : V = 6L² ÷ L³ = 6 ÷ L = 6 ÷ 4.0 mm = 1.5 mm⁻¹. B (15) is 6 ÷ 0.40, which is the ratio in cm⁻¹ wrongly labelled mm⁻¹ (forgot to convert cm to mm). C (150) multiplies 15 cm⁻¹ by 10 instead of dividing; \"per mm\" must be a smaller number than \"per cm\". D (0.67) is L ÷ 6, the ratio turned upside down." },
    { q: "Chidi's class cuts two agar cubes, one of side 3.0 mm and one of side 12 mm. How many times larger is the SA : V of the small cube than that of the large cube?",
      o: ["16","64","4","1.5"],
      a: 2,
      e: "Small cube: 6 ÷ 3.0 = 2.0 mm⁻¹. Large cube: 6 ÷ 12 = 0.50 mm⁻¹. Ratio: 2.0 ÷ 0.50 = 4. SA : V varies as 1 ÷ L, so making the side four times longer makes the ratio four times smaller. A (16 = 4²) compares surface areas only, and B (64 = 4³) compares volumes only. D (2.0 − 0.50 = 1.5) subtracts the ratios when the question asks \"how many times\"." },
    { q: "In a repeat of the cube bench, the acid moves 2.0 mm into every face of a 12 mm cube in the time allowed. What percentage of the cube's volume has turned colourless?",
      o: ["70.4%","33.3%","29.6%","42.1%"],
      a: 0,
      e: "The pink centre loses 2.0 mm from <em>both</em> sides of every edge: 12 − (2 × 2.0) = 8.0 mm. Pink volume = 8.0³ = 512 mm³; whole cube = 12³ = 1728 mm³. Colourless = (1728 − 512) ÷ 1728 × 100 = 70.4%. B (4 ÷ 12) treats a volume as if it were a length. C (512 ÷ 1728 = 29.6%) is the share still <em>pink</em>, not the share cleared. D takes the 2.0 mm off only one side (centre 10 mm), forgetting that acid enters from opposite faces." },
    { q: "During the 8-minute wait, one cube lay flat on the floor of the beaker instead of being surrounded by acid. How did this affect its result?",
      o: ["Its % colourless was too high, because the beaker floor warmed the agar","Its % colourless was unaffected, because acid still reached the other five faces","Its % colourless was too low, because the face touching the floor was shielded from the acid","Its % colourless was too high, because extra acid collected under the cube"],
      a: 2,
      e: "With one face against the glass, acid could enter through only five faces, so less of the cube cleared and the reading came out too low for its true SA : V. A is wrong: the beaker floor is at room temperature and does not heat the cube. B ignores the lost face: the whole SA counted in SA : V was not exposed. D is wrong: a cube resting on the floor squeezes acid <em>out</em> from under it, not in." },
    { q: "Which statement correctly describes the circulation of a cockroach?",
      o: ["Blood stays inside vessels and moves at high pressure","A two-chambered heart pumps blood through gills","In each full circuit, blood goes through the heart two times","Haemolymph is pumped into a body cavity, the haemocoel, where it bathes the organs directly at low pressure"],
      a: 3,
      e: "Insects have an open system: the fluid (haemolymph) leaves the vessels and pools around the organs, so pressure and flow are low. A describes a closed system (earthworm, fish, mammal). B describes a fish. C describes double circulation, found in birds and mammals, not insects." },
    { q: "Which of these animals has a closed, single circulation?",
      o: ["Grasshopper","Catfish","Pigeon","Garden snail"],
      a: 1,
      e: "A catfish keeps its blood in vessels (closed) and the blood goes heart → gills → body → heart, passing the heart once per circuit (single). A grasshopper (A) and a snail (D) both have open systems. A pigeon (C) is closed but double, like Chidi." },
    { q: "In a tilapia, blood leaves the heart, passes through the gills and then flows on to the body. Why does this blood reach the body tissues at reduced pressure?",
      o: ["The tilapia heart has four chambers, so the blood mixes and slows down","Tilapia blood is haemolymph, which is too thick to flow fast","Pressure is lost as blood is forced through the narrow gill capillaries, and it is not pumped again before it reaches the body","Each lap sends the blood into the heart two times, so it loses pressure there"],
      a: 2,
      e: "In single circulation one pump must push blood through two capillary networks in a row (gills, then body); friction in the fine gill capillaries drains much of the pressure. A is wrong: a fish heart has two chambers, not four. B is wrong: fish have a closed system carrying true blood; haemolymph belongs to open systems. D describes double circulation, which actually <em>restores</em> pressure." },
    { q: "Which pair states two advantages of the double circulation found in mammals?",
      o: ["Blood returning from the lungs is pumped again, so it reaches the body at high pressure; oxygenated and deoxygenated blood are kept apart","Blood passes the heart only once, which saves energy; the lungs can be bypassed during rest","The heart needs fewer chambers; blood moves slowly so it has more time for exchange","Haemolymph bathes the organs directly; blood pressure stays low and safe"],
      a: 0,
      e: "Mammals pump the blood a second time after the lungs, so it leaves for the body at high pressure, and the four chambers with a septum stop oxygen-rich and oxygen-poor blood mixing. B describes single circulation, and no mammal bypasses its lungs. C is wrong: double circulation needs <em>more</em> chambers (four), and slow flow is a feature of capillaries, not an advantage of the double plan. D describes an open system." },
    { q: "Which of the following is NOT carried from place to place in mammalian blood?",
      o: ["Urea","Hormones","Heat","Starch"],
      a: 3,
      e: "Starch is too large to cross the gut wall; it is digested to glucose first, and glucose is what the blood carries. Urea (A) travels from the liver to the kidneys, hormones (B) travel from glands to their target organs, and heat (C) is spread from busy organs such as muscles and the liver to the rest of the body." },
    { q: "Dr Aisha models a <em>Paramecium</em> as a cube of side 0.12 mm and Baba Sule's goat as a cube of side 0.60 m. How many times larger is the <em>Paramecium</em>'s SA : V?",
      o: ["5","5000","500","0.0002"],
      a: 1,
      e: "Same units first: 0.60 m × 1000 = 600 mm. <em>Paramecium</em>: 6 ÷ 0.12 = 50 mm⁻¹. Goat: 6 ÷ 600 = 0.010 mm⁻¹. Ratio: 50 ÷ 0.010 = 5000. A (5) skips the conversion and divides 50 by 6 ÷ 0.60 = 10, mixing mm and m. C (500) uses 1 m = 100 mm, a ×10 slip. D divides the goat's ratio by the <em>Paramecium</em>'s, the comparison turned upside down. So the tiny protist has thousands of times more surface for each unit of volume, which is why diffusion alone serves it." }
  ];
})();
