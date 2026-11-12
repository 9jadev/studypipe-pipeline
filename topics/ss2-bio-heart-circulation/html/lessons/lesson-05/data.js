/* Lesson 05 · Arteries, Veins, Capillaries, Tissue Fluid and Lymph: content data, capillary pressure model, vessel readings, and the 12 WAEC/NECO/JAMB quiz questions */
(function () {
  "use strict";

  // ---- The capillary pressure model (02-lesson: approximate textbook teaching values; tissue-side pressures taken as near zero) ----
  // Pc falls evenly along the capillary, so Pc against position is a straight line; the protein pull (pi c) is flat.
  var POSITIONS = [0, 0.25, 0.5, 0.75, 1];
  var MODES = {
    normal:  { label: "Normal leg", pa: 36, pv: 16, pi: 25 },
    congest: { label: "Mama Bisi's congested leg", pa: 36, pv: 30, pi: 25 },
    kwash:   { label: "Low plasma protein (kwashiorkor)", pa: 36, pv: 16, pi: 15 },
    blocked: { label: "Blocked lymph (filariasis)", pa: 36, pv: 16, pi: 25 }
  };
  function mode(m) { return MODES[m] || MODES.normal; }
  function pc(x, m) { var k = mode(m); return k.pa - (k.pa - k.pv) * x; }
  function nfp(x, m) { return pc(x, m) - mode(m).pi; }
  // fraction of the way along where Pc = pi c (NFP = 0); null when it never happens inside the capillary
  function zero(m) {
    var k = mode(m), z = (k.pa - k.pi) / (k.pa - k.pv);
    return z >= 0 && z <= 1 ? z : null;
  }
  function sgn(n) { return n > 0 ? "+" + n : n < 0 ? "−" + Math.abs(n) : "0"; }
  function dir(n) { return n > 0 ? "out" : n < 0 ? "in" : "balanced"; }
  function dirText(n) { return n > 0 ? "out of the capillary" : n < 0 ? "into the capillary" : "no net movement"; }

  // ---- Vessel slide (VesselSlideBench teaching values) ----
  var VESSEL = {
    artery: { wall: 0.90, lumen: 2.2 },
    vein: { wall: 0.40, lumen: 4.0 }
  };
  function ratio(v) { return VESSEL[v].wall / VESSEL[v].lumen; }

  window.L05 = {
    POSITIONS: POSITIONS, MODES: MODES, VESSEL: VESSEL,
    mode: mode, pc: pc, nfp: nfp, zero: zero, sgn: sgn, dir: dir, dirText: dirText, ratio: ratio,
    PI: 25,

    // ---- 2A. Sort: artery, vein or capillary? ----
    bins: { artery: "Artery", vein: "Vein", capillary: "Capillary" },
    items: [
      { id: "thick", name: "Thick wall, much muscle and elastic tissue", emo: "💪", bin: "artery", why: "A thick, elastic, muscular wall takes the surge from the ventricle and springs back. That is an artery." },
      { id: "valves", name: "Pocket valves along its length", emo: "🚪", bin: "vein", why: "Pocket valves let blood move only towards the heart. Veins carry blood at low pressure, so they need them." },
      { id: "onecell", name: "Wall only one cell thick", emo: "🔬", bin: "capillary", why: "A single flat layer of cells gives the shortest path for exchange." },
      { id: "spurt", name: "Blood spurts out bright red when cut", emo: "🩸", bin: "artery", why: "High pressure and usually oxygen-rich blood: a cut artery spurts in time with the heartbeat." },
      { id: "steady", name: "Dark red blood flows out steadily when cut", emo: "💧", bin: "vein", why: "Low pressure and a steady flow: a cut vein oozes dark red blood. It only looks blue through the skin." },
      { id: "single", name: "Red cells squeeze through one at a time", emo: "🔴", bin: "capillary", why: "The lumen is about one red cell wide, so cells pass in single file close to the wall." },
      { id: "narrow", name: "Narrow lumen, high pressure, a pulse", emo: "💓", bin: "artery", why: "A narrow lumen and high pressure; the wall bulges and springs back with every beat, felt as the pulse." },
      { id: "wide", name: "Wide lumen, low pressure, no pulse", emo: "📏", bin: "vein", why: "A wide lumen carries slow, steady, low-pressure flow. No pulse is felt." },
      { id: "exchange", name: "Site of exchange with the tissues", emo: "↔️", bin: "capillary", why: "Oxygen, glucose and wastes cross the thin capillary wall here, not in arteries or veins." },
      { id: "away", name: "Carries blood away from the heart", emo: "➡️", bin: "artery", why: "Arteries are named by direction: away from the heart." },
      { id: "pulmvein", name: "Pulmonary vein", emo: "🫁", bin: "vein", why: "A vein carries blood towards the heart. The pulmonary vein brings oxygen-rich blood from the lungs to the left atrium, yet it is still a vein." }
    ],

    // ---- 2B. Bench: table answer choices (the expected values are computed from the model) ----
    nfpOptions: ["+36", "+11", "+6", "+1", "−4", "−9", "−11", "61"],
    dirOptions: ["out of the capillary", "into the capillary", "no net movement"],

    // ---- 3. Explorer pins (position along the capillary) ----
    pins: POSITIONS,

    // ---- 3. Zoom (HeartKit.capillaryBed modes) ----
    zooms: {
      normal: { note: "Normal: fluid is pressed out at the arterial end, most is drawn back at the venous end, and a small surplus drains into the lymph capillary (it is then called lymph)." },
      congest: { note: "Congested (Mama Bisi): venous-end pressure is 30 mmHg, so NFP stays positive all along the capillary. Fluid keeps leaving, little returns, and the tissue swells." },
      kwash: { note: "Low plasma protein: the protein pull is weak (15 mmHg), so almost nothing is drawn back in and the tissue swells (oedema)." },
      blocked: { note: "Blocked lymph: pressures are normal, but the surplus cannot drain because filarial worms block the lymph vessel. The limb swells (elephantiasis)." }
    },

    // ---- 3. Pressure along the circuit (approximate teaching values, mmHg) ----
    circuit: [
      { x: 0, p: 100, name: "aorta" },
      { x: 1, p: 95, name: "large arteries" },
      { x: 2, p: 85, name: "small arteries" },
      { x: 3, p: 60, name: "arterioles (largest fall)" },
      { x: 4, p: 35, name: "capillary, arterial end" },
      { x: 5, p: 15, name: "capillary, venous end" },
      { x: 6, p: 8, name: "veins" },
      { x: 7, p: 2, name: "venae cavae" }
    ],

    // ---- 4. Bridge: three reasoning steps for Case 2 (Mama Bisi) ----
    bridge: [
      {
        q: "After hours of standing, the leaky valves in Mama Bisi's veins let blood pool and the venous-end capillary pressure Pc rises from 16 to 30 mmHg. With the protein pull at 25 mmHg, what is the NFP at the venous end now?",
        o: ["−9 mmHg: fluid is still drawn back in", "+5 mmHg: fluid is still pushed out", "+55 mmHg: fluid is pushed out very fast"],
        a: 1,
        why: "30 − 25 = +5 mmHg. A positive NFP means fluid leaves, so the venous end no longer reabsorbs."
      },
      {
        q: "What does a positive NFP along the whole capillary do to the amount of tissue fluid, compared with the lymph vessels' ability to drain it?",
        o: ["Fluid builds up faster than lymph can remove it", "The lymph vessels drain it all, so nothing changes", "The capillary wall becomes thinner"],
        a: 0,
        why: "There is no reabsorption zone, so the whole surplus goes to the lymph capillaries, which cannot keep up. The fluid collects: oedema."
      },
      {
        q: "Baba Sule says: “Too much water in the blood. Stop drinking water!” Which verdict is correct?",
        o: ["He is right: less water means less tissue fluid", "He is wrong: the cause is high venous pressure from pooled blood, so raise her feet and keep the calf muscles working", "He is wrong: the cause is a lack of salt"],
        a: 1,
        why: "Drinking water was not the cause. Standing still with leaky valves raised the venous pressure. Raising the feet and walking about to work the muscle pump help, and her high blood pressure needs treatment."
      }
    ]
  };

  window.LESSON_QUIZ = [
    { q: "Which row correctly matches a blood vessel with two of its features?",
      o: ["Artery: wide lumen; pocket valves all along its length","Vein: thick muscular wall; a pulse can be felt in it","Capillary: wall only one cell thick; site of exchange with body cells","Artery: low pressure; slow, steady flow"],
      a: 2,
      e: "A capillary wall is a single layer of flat cells, which gives a very short path for substances moving between blood and cells, so capillaries are where exchange takes place. Option A gives an artery two vein features (wide lumen, valves). Option B gives a vein two artery features (thick muscle, pulse). Option D gives an artery the low pressure and steady flow of a vein; arterial blood moves fast and in surges." },
    { q: "Which statement about the pulmonary vein is correct?",
      o: ["It carries oxygenated blood from the lungs to the left atrium.","It carries deoxygenated blood from the lungs to the right atrium.","It carries deoxygenated blood from the right ventricle to the lungs.","It carries oxygenated blood from the left ventricle to the body."],
      a: 0,
      e: "A vein is named by its direction, towards the heart; the pulmonary vein brings blood that has just picked up oxygen in the lungs back to the left atrium, so it is the vein that carries oxygen-rich blood. Option B follows the \"veins carry deoxygenated blood\" myth and sends it to the wrong side. Option C describes the pulmonary artery. Option D describes the aorta." },
    { q: "Near the venous end of a capillary, the blood pressure (Pc) is 19 mmHg and the osmotic pull of the plasma proteins (πc) is 25 mmHg. What is the net filtration pressure (NFP), and which way does fluid move?",
      o: ["+6 mmHg; out of the capillary","+44 mmHg; out of the capillary","−6 mmHg; out of the capillary","−6 mmHg; into the capillary"],
      a: 3,
      e: "NFP = Pc − πc = 19 − 25 = −6 mmHg. A negative value means the inward protein pull wins, so fluid is drawn back into the capillary by osmosis (reabsorption). Option A subtracts the wrong way round (25 − 19). Option B adds the two pressures instead of subtracting. Option C has the correct number but reads a negative NFP as outward movement." },
    { q: "Mama Bisi stands at her stall all day, yet blood in her feet still returns upwards to her heart. Which pair of features makes this possible?",
      o: ["Suction from the heart alone, pulling blood up the veins","Pocket valves in the veins and the squeezing of veins by contracting leg muscles","Thick elastic walls in the veins that recoil after each beat","High pressure left over from the arteries, so veins need no valves"],
      a: 1,
      e: "When leg muscles contract they squeeze the veins between them; the pocket valves open only towards the heart, so the blood can only be pushed upwards, and they shut if it starts to fall back. This muscle pump is why walking about helps her. Option A overstates the heart's pull, which cannot lift blood from the feet by itself. Option C describes an artery wall, not a vein. Option D is wrong because most of the pressure is lost in the arterioles and capillaries, which is exactly why veins need valves." },
    { q: "After a long day of standing, the pressure at the venous end of Mama Bisi's ankle capillaries rises to 31 mmHg, while πc stays at 25 mmHg. What is the most likely result?",
      o: ["Fluid is reabsorbed faster than normal, so her ankles shrink.","NFP at the venous end becomes −6 mmHg, so fluid is drawn back in.","Plasma proteins leave the capillary, so her blood becomes thicker.","NFP stays outward (+6 mmHg) along the whole capillary, so fluid collects in the tissues."],
      a: 3,
      e: "Venous-end NFP = 31 − 25 = +6 mmHg; since the arterial end is even higher, fluid is pushed out along the whole length and there is no reabsorption zone. The surplus outruns the lymph capillaries and builds up as oedema, the thumb dent Dr Aisha found. Option A reverses the effect. Option B makes a sign slip (subtracting 31 from 25). Option C is wrong because the large plasma proteins stay inside a normal capillary; the problem is pressure, not leaking proteins." },
    { q: "Blood leaves the aorta (cross-section 3.0 cm²) at 30 cm s⁻¹. All the capillaries together have a cross-section of 3000 cm². Using flow = area × speed, what is the speed of blood in the capillaries?",
      o: ["0.030 cm s⁻¹","0.30 cm s⁻¹","30 000 cm s⁻¹","90 cm s⁻¹"],
      a: 0,
      e: "Flow Q = A × v = 3.0 × 30 = 90 cm³ s⁻¹. The same flow passes through the capillaries, so v = Q/A = 90 ÷ 3000 = 0.030 cm s⁻¹, a thousand times slower than in the aorta, which gives time for exchange. Option B is a ×10 slip. Option C turns the area ratio upside down (3000/3 × 30), making capillary blood faster instead of slower. Option D stops at the flow (in cm³ s⁻¹) and reports it as a speed." },
    { q: "How does tissue fluid differ from the blood plasma it comes from?",
      o: ["It contains more red blood cells than plasma.","It contains more plasma proteins than plasma.","It contains no red cells and very few plasma proteins.","It is identical to plasma, only found outside the vessels."],
      a: 2,
      e: "Only water and small dissolved substances (oxygen, glucose, amino acids, salts) are squeezed out through the gaps in the capillary wall; red cells and most of the large protein molecules are too big and stay in the blood. Option A is wrong because red cells never leave a healthy capillary. Option B reverses the protein difference. Option D is the \"plasma, tissue fluid and lymph are the same\" myth." },
    { q: "Why does fluid leave a capillary near its arterial end?",
      o: ["The osmotic pull of the plasma proteins is greater than the blood pressure there.","The blood pressure there is greater than the osmotic pull of the plasma proteins.","The cells of the capillary wall actively pump the fluid out.","The lymph capillaries suck the fluid out of the blood."],
      a: 1,
      e: "Near the arterial end, Pc is still high and outweighs πc, so NFP is positive and fluid is pressed out between the wall cells (filtration). Option A describes the venous end, where fluid returns. Option C invents active pumping; the movement is driven by pressure. Option D is wrong because lymph capillaries only collect the surplus fluid that is already in the tissue spaces." },
    { q: "Where does lymph rejoin the blood?",
      o: ["In the subclavian veins near the neck","In the hepatic portal vein","Directly in the right atrium","In the renal vein"],
      a: 0,
      e: "Lymph collects into the thoracic duct and the right lymphatic duct, which empty into the subclavian veins under the collarbones. Option B confuses lymph with the gut-to-liver blood route from Lesson 03. Option C is wrong because no lymph vessel opens straight into the heart. Option D is a vein from the kidney and plays no part in lymph return." },
    { q: "A child with kwashiorkor has very little protein in the blood. Suppose πc falls to 15 mmHg, while Pc still falls from 36 to 16 mmHg along a capillary. Why does the child's body swell?",
      o: ["πc rises, so extra fluid is drawn back into the capillaries.","Pc falls to zero, so no fluid can leave the capillaries.","Red cells leak out of the capillaries into the tissues.","πc is lower, so NFP at the venous end is +1 mmHg and fluid is no longer drawn back in."],
      a: 3,
      e: "With less protein, the inward pull is weaker. Venous-end NFP = 16 − 15 = +1 mmHg, still outward, so there is no reabsorption anywhere along the capillary; the arterial end even rises to 36 − 15 = +21 mmHg. Fluid builds up faster than lymph can remove it, giving oedema. Option A reverses the change in πc. Option B is wrong because the child's blood pressure is unchanged. Option C is wrong because red cells cannot pass a capillary wall; the swelling is fluid, not blood. (The 15 mmHg is an illustrative teaching value.)" },
    { q: "A learner measured the wall of an artery on a slide using an eyepiece graticule, but the vessel had been cut at a slant, so it looked oval. How did this affect his reading of wall thickness?",
      o: ["It was too low, because a slanted cut makes the wall look thinner.","It was too high, because the cut passed through the wall at an angle and showed it longer than its true thickness.","It had no effect, because the graticule had been calibrated.","It was too high, because the vessel had collapsed during preparation."],
      a: 1,
      e: "A cut that is not at right angles slices the wall obliquely, so the wall seen on the slide is longer than its real thickness and the reading is too high. Option A gives the wrong direction. Option C confuses two separate things: calibration fixes the size of each division, but cannot correct a wall that was cut at a slant. Option D names a different error, which affects the width of a vein's lumen (making it too low), not an artery's wall." },
    { q: "Which of the following is NOT a function of the lymphatic system?",
      o: ["Returning surplus tissue fluid and leaked proteins to the blood","Carrying absorbed fat from the lacteals of the ileum","Pumping lymph around the body with a heart of its own","Filtering bacteria in lymph nodes and making lymphocytes"],
      a: 2,
      e: "The lymphatic system has no pump; lymph is squeezed along by skeletal muscles and breathing movements, and valves stop it flowing back. Options A, B and D are all genuine functions: returning fluid prevents oedema, lacteals carry fats from digested food, and lymph nodes (which swell during infection) trap germs and produce lymphocytes." }
  ];
})();
