/* Lesson 06 · Blood: Plasma, Cells and Clotting — sort items, explorer pins and the 12 quiz questions (03-questions.md § Lesson 06) */
(function () {
  "use strict";

  window.L06 = {
    // ---- 2A sort: which part of blood? ----
    items: [
      { id: "straw", name: "Pale yellow liquid, mostly water", emo: "P", bin: "plasma", why: "Plasma is the straw-coloured liquid, about nine-tenths water, in which the cells float." },
      { id: "urea", name: "Carries urea and hormones", emo: "P", bin: "plasma", why: "Urea, hormones, glucose, salts and heat are all carried dissolved in the plasma." },
      { id: "fibrinogen", name: "Fibrinogen and prothrombin dissolved here", emo: "P", bin: "plasma", why: "The clotting proteins are plasma proteins, made in the liver and dissolved in the liquid part." },
      { id: "disc", name: "Biconcave disc, no nucleus", emo: "R", bin: "rbc", why: "The dimpled disc with no nucleus is the red cell." },
      { id: "haemo", name: "Full of haemoglobin", emo: "R", bin: "rbc", why: "Haemoglobin, which carries oxygen as oxyhaemoglobin, fills the red cell." },
      { id: "life", name: "Lives about 120 days", emo: "R", bin: "rbc", why: "A red cell lasts about 120 days before the liver and spleen break it down." },
      { id: "engulf", name: "Engulfs bacteria", emo: "W", bin: "wbc", why: "Phagocytes are white cells that swallow and digest bacteria." },
      { id: "anti", name: "Makes antibodies", emo: "W", bin: "wbc", why: "Lymphocytes are white cells that make antibodies." },
      { id: "nucleus", name: "Has a nucleus and can change shape", emo: "W", bin: "wbc", why: "White cells have a nucleus and no fixed shape; red cells and platelets have no nucleus." },
      { id: "frag", name: "Tiny cell fragments", emo: "T", bin: "platelets", why: "Platelets are small fragments of cells, not whole cells." },
      { id: "start", name: "Start the clotting process", emo: "T", bin: "platelets", why: "Platelets (with damaged tissue) release thromboplastin, which begins the clotting chain." },
      { id: "count", name: "About 250 000 in each mm³", emo: "T", bin: "platelets", why: "A cubic millimetre holds about a quarter of a million platelets." }
    ],
    binNames: { plasma: "Plasma", rbc: "Red cells", wbc: "White cells", platelets: "Platelets" },

    // ---- explorer pins (the bench part each one lights) ----
    total_dm3: 5.0, plasma_pct: 55,
    pins: [
      { key: "plasma", label: "Plasma", focus: null, count: "55% of the blood", life: "continually replaced", job: "Carries dissolved food, salts, hormones, urea, most of the carbon dioxide, plasma proteins (including fibrinogen) and heat." },
      { key: "rbc", label: "Red cells", focus: "rbc", count: "about 5 000 000 per mm³", life: "about 120 days", job: "Carry oxygen as oxyhaemoglobin. Made in red bone marrow, broken down in the liver and spleen." },
      { key: "wbc", label: "White cells", focus: "phagocyte", count: "about 7000 to 8000 per mm³", life: "days to years", job: "Defence: phagocytes swallow bacteria and lymphocytes make antibodies. Each has a nucleus and no fixed shape." },
      { key: "platelets", label: "Platelets", focus: "platelet", count: "about 250 000 per mm³", life: "about 7 to 10 days", job: "Tiny cell fragments with no nucleus. They gather at a cut and help to start clotting." }
    ]
  };

  window.LESSON_QUIZ = [
 {
  "q": "In the UCH teaching lab, Dr Aisha leaves a tube of the rider's blood standing until a jelly-like lump forms at the bottom. She then pours off the clear, straw-coloured liquid above it. Compared with plasma, which substance is now missing from this liquid?",
  "o": [
   "Glucose",
   "Fibrinogen",
   "Urea",
   "Albumin"
  ],
  "a": 1,
  "e": "The lump is a clot, and making it used up the clotting proteins, chiefly fibrinogen, which became the fibrin threads of the clot. The liquid left behind is therefore serum: plasma with the clotting proteins taken out. Glucose (A) and urea (C) are small dissolved substances that play no part in clotting, so they stay in the serum. Albumin (D) is a plasma protein, but not a clotting one, so it also remains."
 },
 {
  "q": "In the sort game, Chidi drags a card that reads: \"no nucleus · about 250 000 in each mm³ · lasts roughly a week · made in red bone marrow\". Which bin is correct?",
  "o": [
   "Red blood cells",
   "Lymphocytes",
   "Phagocytes",
   "Platelets"
  ],
  "a": 3,
  "e": "Platelets are tiny cell fragments without a nucleus, number about a quarter of a million per mm³ and survive only about 7–10 days. Red cells (A) also lack a nucleus, but there are about 5 million per mm³ and each lasts about 120 days, so the count and life span on the card do not fit. Lymphocytes (B) and phagocytes (C) are white cells: both have a nucleus and number only about 7000–8000 per mm³ together."
 },
 {
  "q": "Which feature of a mature human red cell most directly raises the amount of oxygen it can carry?",
  "o": [
   "It has no nucleus, so more of its volume can be filled with haemoglobin.",
   "It contains carbonic anhydrase.",
   "It has a lobed nucleus that controls haemoglobin production.",
   "It is produced in the liver and spleen."
  ],
  "a": 0,
  "e": "Oxygen is carried by haemoglobin, so the more haemoglobin a cell holds, the more oxygen it can load; losing the nucleus frees room for it. Carbonic anhydrase (B) is a real red-cell enzyme, but it speeds up carbon dioxide carriage, not oxygen carriage. A lobed nucleus (C) belongs to a phagocyte, and mature red cells have no nucleus at all. The liver and spleen (D) are where old red cells are broken down; new ones are made in red bone marrow."
 },
 {
  "q": "On the ×400 smear, Dr Aisha's pointer rests on a cell that is larger than the red cells around it. Its nucleus has three or four lobes joined by thin strands, and its cytoplasm looks grainy. What is the main job of this cell?",
  "o": [
   "Making antibodies such as antitoxins",
   "Carrying oxygen as oxyhaemoglobin",
   "Engulfing and digesting bacteria",
   "Releasing thromboplastin to start a clot"
  ],
  "a": 2,
  "e": "A lobed nucleus with grainy cytoplasm marks a phagocyte (a neutrophil), which surrounds bacteria and digests them. Antibody production (A) is the job of a lymphocyte, which you would recognise by one large, round nucleus filling most of the cell; mixing these two is the commonest slip on smear questions. Oxygen carriage (B) belongs to red cells, which have no nucleus. Thromboplastin (D) comes from platelets and damaged tissue, and platelets are tiny fragments, not large nucleated cells."
 },
 {
  "q": "Which sequence shows the clotting steps at the rider's gash in the correct order?",
  "o": [
   "Fibrinogen → fibrin; then thromboplastin released; then prothrombin → thrombin; then red cells trapped",
   "Prothrombin → thrombin; then thromboplastin released; then fibrin → fibrinogen; then red cells trapped",
   "Thromboplastin released; then prothrombin → thrombin; then fibrinogen → fibrin; then red cells trapped",
   "Thromboplastin released; then fibrinogen → thrombin; then prothrombin → fibrin; then red cells trapped"
  ],
  "a": 2,
  "e": "The chain starts at the wound: platelets and torn tissue give out thromboplastin, which, helped by vitamin K and calcium ions, turns prothrombin into thrombin; thrombin then turns soluble fibrinogen into insoluble fibrin threads that snare red cells. Option A puts the last chemical step first. Option B starts in the middle and also writes fibrin → fibrinogen, which runs the reaction backwards. Option D pairs the wrong substances: fibrinogen becomes fibrin, and prothrombin becomes thrombin, not the other way round."
 },
 {
  "q": "The blood bank at UCH mixes every donated unit with sodium citrate, a chemical that takes calcium ions out of solution. Why does this keep the stored blood runny?",
  "o": [
   "Citrate destroys all the platelets in the bag.",
   "Citrate changes fibrin back into fibrinogen.",
   "Citrate removes the red cells that would be trapped in a clot.",
   "Without free calcium ions, prothrombin cannot be converted into thrombin, so fibrin never forms."
  ],
  "a": 3,
  "e": "Calcium ions are needed for the step in which thromboplastin turns prothrombin into thrombin; with calcium locked away, the chain stops before any fibrin is made. Citrate does not destroy platelets (A): the platelets are still there, but the step that needs calcium cannot run. Option B describes a reaction that does not happen; clotting only goes from fibrinogen to fibrin. Option C is wrong because the red cells stay in the bag, which is the whole reason the blood is worth transfusing."
 },
 {
  "q": "A lab scientist dilutes a blood sample 1 in 200 and counts 430 red cells in 5 squares of a haemocytometer. Each square measures 0.2 mm × 0.2 mm and the chamber is 0.1 mm deep. What is the red cell count per mm³ of undiluted blood?",
  "o": [
   "4.3 × 10⁶",
   "2.15 × 10⁴",
   "2.15 × 10⁷",
   "1.1 × 10²"
  ],
  "a": 0,
  "e": "Volume of one square = 0.2 × 0.2 × 0.1 = 0.004 mm³; five squares = 5 × 0.004 = 0.020 mm³. Diluted count = 430 ÷ 0.020 = 21 500 cells per mm³. Undo the dilution: 21 500 × 200 = 4 300 000 = 4.3 × 10⁶ cells per mm³. Option B stops at the diluted count (the ×200 step was forgotten). Option C divides by the volume of one square only (0.004 mm³) instead of all five, so it is five times too large. Option D divides by 200 instead of multiplying, undoing the dilution the wrong way."
 },
 {
  "q": "On a micrograph magnified ×1500, a lymphocyte measures 18 mm across. What is its real diameter?",
  "o": [
   "1.2 µm",
   "12 µm",
   "120 µm",
   "0.012 µm"
  ],
  "a": 1,
  "e": "Actual size = image size ÷ magnification = 18 mm ÷ 1500 = 0.012 mm. Convert: 0.012 mm × 1000 = 12 µm. Option D is 0.012 written with µm instead of mm (the mm-to-µm conversion was skipped, so it is 1000 times too small). Options A and C are ÷10 and ×10 slips. A sensible check: a lymphocyte is a little bigger than a red cell (about 7–8 µm), so 12 µm is reasonable."
 },
 {
  "q": "When counting cells in each haemocytometer square, Danjuma included every cell touching any of the four boundary lines. How did this affect his final count, and why?",
  "o": [
   "Too low, because cells on the lines are usually damaged and do not stain.",
   "No effect, because cells on the lines are part of the square.",
   "Too high, because cells on a shared line were also counted in the neighbouring square, so some cells were counted twice.",
   "Too high, because cells on the lines are larger than the others."
  ],
  "a": 2,
  "e": "Each boundary line is shared by two squares. The rule (count cells on the top and left lines, leave out those on the bottom and right lines) makes sure every cell is counted exactly once. Counting all four lines counts some cells twice, so the total and the final count come out too high. Option A gives the wrong direction and an invented reason. Option B ignores the double counting. Option D gets the direction right but gives a false reason: cell size has nothing to do with where the cell lies on the grid."
 },
 {
  "q": "Chidi asks why blood does not set solid inside his own arteries and veins, since it carries fibrinogen everywhere. Which answer is correct?",
  "o": [
   "The lining of healthy vessels is smooth, so platelets are not damaged, and the anticoagulant heparin is present in the blood.",
   "Blood inside vessels contains no platelets.",
   "Fibrinogen is only made at the site of a wound.",
   "Moving blood is too full of oxygen to clot."
  ],
  "a": 0,
  "e": "Clotting needs a trigger: damaged tissue or broken platelets releasing thromboplastin. A smooth, unbroken vessel lining gives no such trigger, and heparin keeps blood liquid. Platelets circulate in all blood (B is wrong), and fibrinogen is always dissolved in plasma, made by the liver (C is wrong). Oxygen content (D) has nothing to do with clotting; venous blood with less oxygen does not clot in healthy veins either."
 },
 {
  "q": "Dr Aisha spins 8.0 cm³ of Mama Bisi's blood in a centrifuge. Taking plasma as about 55% of blood by volume, with cells making up the rest, what volume of plasma should form the upper layer?",
  "o": [
   "3.6 cm³",
   "7.2 cm³",
   "0.44 cm³",
   "4.4 cm³"
  ],
  "a": 3,
  "e": "Plasma volume = 55% of 8.0 cm³ = 0.55 × 8.0 = 4.4 cm³. Option A (0.45 × 8.0 = 3.6 cm³) is the cell layer at the bottom, not the plasma. Option B (0.90 × 8.0) uses the \"plasma is about 90% water\" figure, which describes what plasma is made of, not how much of the blood is plasma. Option C is a ÷10 slip."
 },
 {
  "q": "Which statement correctly explains how the rider's gash finally stopped bleeding?",
  "o": [
   "Air dried the plasma at the wound, as palm oil hardens on a cold morning.",
   "A dissolved plasma protein was changed into solid threads that formed a net and trapped red cells.",
   "Antibodies made the red cells clump together, as happens when the wrong blood group is given.",
   "White cells crowded into the cut and blocked it like a cork."
  ],
  "a": 1,
  "e": "Soluble fibrinogen was turned into insoluble fibrin threads; the fibrin net caught red cells and became a clot, which later dried into a scab. Baba Sule's \"drying\" idea (A) leaves out the chemical chain entirely. Option C describes agglutination, which is clumping caused by an antigen meeting its matching antibody; clotting is not clumping. White cells (D) fight germs that enter the wound, but they do not form the plug."
 }
];
})();
