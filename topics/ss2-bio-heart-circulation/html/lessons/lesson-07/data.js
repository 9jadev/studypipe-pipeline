/* Lesson 07 · Blood Groups, Rhesus, Transfusion and Disorders: Closing the Case
   Sort items, ABO table, results-table order, the three Oja Oba cases and the 12 quiz questions (03-questions.md § Lesson 07).
   All typing results and the transfusion verdicts come from AboTypingBench's model at run time, never from typed text. */
(function () {
  "use strict";

  window.L07 = {
    // ---- 2A sort: safe to give? (two rounds of four, one Check) ----
    items: [
      { id: "a-a", name: "Group A red cells", to: "to a group A patient", emo: "A", bin: "safe", why: "Same group. Group A plasma holds only anti-b, and group A cells carry no antigen B." },
      { id: "o-a", name: "Group O red cells", to: "to a group A patient", emo: "O", bin: "safe", why: "Group O cells carry neither A nor B, so none of his antibodies has anything to grip." },
      { id: "b-a", name: "Group B red cells", to: "to a group A patient", emo: "B", bin: "unsafe", why: "Antigen B meets his anti-b, and the cells clump." },
      { id: "ab-a", name: "Group AB red cells", to: "to a group A patient", emo: "AB", bin: "unsafe", why: "AB cells carry antigen B, which his anti-b attacks." },
      { id: "a-ab", name: "Group A red cells", to: "to a group AB patient", emo: "A", bin: "safe", why: "Group AB plasma holds neither anti-a nor anti-b, so nothing attacks." },
      { id: "b-ab", name: "Group B red cells", to: "to a group AB patient", emo: "B", bin: "safe", why: "No antibody in AB plasma matches antigen B." },
      { id: "ab-ab", name: "Group AB red cells", to: "to a group AB patient", emo: "AB", bin: "safe", why: "Same group, and AB plasma has no antibodies at all." },
      { id: "o-ab", name: "Group O red cells", to: "to a group AB patient", emo: "O", bin: "safe", why: "Group O cells carry no antigen, so they are safe for anyone (for ABO)." }
    ],

    // ---- bench ----
    order: ["rider", "donor1", "donor2", "donor3", "donor4"],
    names: { rider: "Rider", donor1: "Donor 1", donor2: "Donor 2", donor3: "Donor 3", donor4: "Donor 4" },
    patient: { abo: "B", rh: "-" },
    faultNote: {
      "false-negative": "A weak clump was missed, so a positive well was read as negative (false negative).",
      "read-too-soon": "The tile was read before the full 2 minutes.",
      "false-positive-stirrer": "One stirrer carried serum between wells, so a well clumped that should not (false positive).",
      "false-positive-drying": "A drying edge looked grainy and was mistaken for clumping (false positive)."
    },

    // ---- ABO groups for the explorer ----
    abo: ["A", "B", "AB", "O"],
    antigens: { A: "A", B: "B", AB: "A and B", O: "neither A nor B" },
    antibodies: { A: "anti-b", B: "anti-a", AB: "none", O: "anti-a and anti-b" },
    // serum that the patient's plasma holds for each antigen letter
    serumFor: { A: "anti-A", B: "anti-B", D: "anti-D" },

    // ---- the three Oja Oba cases (Bridge) ----
    cases: [
      { key: "chidi", who: "Case 1 · Chidi's pulse (Lesson 04)", opts: [["ok", "Healthy: the S A N pacemaker sped up, then recovered"], ["bad", "His heart is damaged"]], ans: "ok",
        fix: "Healthy. The pacemaker raised his rate to 132 beats per minute during the sprint and he recovered to about 68 within five minutes." },
      { key: "bisi", who: "Case 2 · Mama Bisi's ankles (Lesson 05)", opts: [["bad", "She drank too much water"], ["ok", "Long standing and leaky valves raised venous pressure: oedema"]], ans: "ok",
        fix: "Standing and failed vein valves raised the pressure at the venous end of the capillaries, so more fluid left than the lymph could drain. Separately, her 160/100 is hypertension." },
      { key: "rider", who: "Case 3 · The rider's bag (this lesson)", opts: [["bad", "AB-, because AB suits everybody"], ["ok", "B- first, O- if B- runs out"], ["bad", "O+, because O is the universal donor"]], ans: "ok",
        fix: "He is B, Rh-. B- matches exactly and O- carries no antigen for his anti-a. AB- carries antigen A, and O+ carries the Rhesus antigen." }
    ],

    // ---- Baba Sule's seven wrong claims, one per lesson ----
    claims: [
      { n: 1, said: "Small heart, small trouble!", fix: "A big body has too little surface for its volume, so diffusion alone is too slow. It needs a transport system." },
      { n: 2, said: "The thick side is the right side.", fix: "The thick wall is the left ventricle, because it drives blood round the whole body." },
      { n: 3, said: "Vein to brain, straight up!", fix: "Blood from an arm vein goes to the heart and through the lungs first, then back to the heart, and only then to the brain." },
      { n: 4, said: "His brain kicks the heart, and the noise is the muscle clapping.", fix: "The S A N pacemaker sets the rate. Lub and dub are the valves closing." },
      { n: 5, said: "Too much water in the blood. Stop drinking water!", fix: "Raised pressure at the venous end of the capillaries let fluid outrun the lymph. Water was not the cause." },
      { n: 6, said: "Blood dries in the air like palm oil. Rub some salt in.", fix: "Platelets plug the gash and fibrin threads weave a clot, with calcium and clotting factors." },
      { n: 7, said: "Take the AB! It has both letters, so it suits everybody.", fix: "AB is the universal recipient, not the universal donor. The rider needs B- or O-." }
    ]
  };

  window.LESSON_QUIZ =
[
 {
  "q": "A person's plasma carries both anti-a and anti-b antibodies. Which ABO group does this person belong to?",
  "o": [
   "AB",
   "O",
   "A",
   "B"
  ],
  "a": 1,
  "e": "Plasma holds the antibodies for whichever antigens the person's own red cells lack. Group O cells carry neither antigen A nor antigen B, so the plasma holds both anti-a and anti-b. Group AB (A) is the reverse: both antigens, no antibodies. Group A (C) has only anti-b, and group B (D) has only anti-a."
 },
 {
  "q": "On the typing tile, a donor's blood clumps in the anti-A well and in the anti-B well, but stays smooth in the anti-D well. What is the donor's blood group?",
  "o": [
   "O, Rh+",
   "AB, Rh+",
   "A, Rh−",
   "AB, Rh−"
  ],
  "a": 3,
  "e": "Clumping in a serum shows the matching antigen is on the cells. Clumping with anti-A and anti-B means antigens A and B are both present: group AB. No clumping with anti-D means no Rhesus antigen: Rh−. Option A reads clumping as \"absent\", which reverses the rule. Option B gets the ABO group right but misreads the smooth anti-D well. Option C ignores the clumping in the anti-B well."
 },
 {
  "q": "At Adeoyo hospital, a woman of group O, Rh+ is bleeding heavily after childbirth. The cool box holds O+, O−, A−, B+, B− and AB−. Which list contains **all** the bags that are compatible with her for both ABO and Rhesus?",
  "o": [
   "O− only",
   "O+, O−, A− and B−",
   "O+ and O−",
   "AB− only"
  ],
  "a": 2,
  "e": "Her plasma carries anti-a and anti-b, so any bag whose cells carry antigen A or B (A−, B+, B−, AB−) would clump. That leaves the two O bags. She is Rh+, so her cells already carry the D antigen and Rh+ blood will not sensitise her: O+ is safe, and O− is also safe. Option A is safe but incomplete, because it leaves out O+. Option B wrongly includes A− and B−, which carry antigens her antibodies attack. Option D is Baba Sule's \"AB suits everybody\" error: AB cells carry both antigens."
 },
 {
  "q": "Why is the AB− bag unsafe for the rider, who is group B, Rh−?",
  "o": [
   "AB cells carry antigen A, and the anti-a in the rider's plasma would clump them.",
   "AB plasma contains anti-a and anti-b, which would attack the rider's cells.",
   "The AB− bag is Rhesus positive.",
   "AB blood clots faster than group B blood."
  ],
  "a": 0,
  "e": "The rule is to check the donor's antigens against the patient's antibodies. The rider is group B, so his plasma holds anti-a; AB cells carry antigen A (as well as B), so they would be clumped. Having antigen B as well does not help. Option B is false: group AB plasma has no anti-a or anti-b at all. Option C misreads the label: the minus sign means Rh−. Option D confuses clotting with clumping; blood group does not change clotting speed."
 },
 {
  "q": "Hadiza writes that \"clotting and agglutination are the same thing\". Which statement correctly tells them apart?",
  "o": [
   "They are the same process, seen at a wound and in a test tube.",
   "Agglutination is red cells sticking together when an antigen comes into contact with the antibody that fits it; clotting is soluble fibrinogen being turned into fibrin threads at a wound.",
   "Agglutination needs thromboplastin and calcium ions; clotting needs anti-A and anti-B serum.",
   "Clotting happens when the wrong blood group is transfused; agglutination seals a cut."
  ],
  "a": 1,
  "e": "The two are different reactions with different triggers. Agglutination is an antigen–antibody reaction that sticks red cells together; clotting is the thromboplastin → thrombin → fibrin chain that seals a wound. Option A ignores this difference. Option C swaps what each process needs. Option D swaps the two outcomes."
 },
 {
  "q": "In which family is the **second** baby most at risk of haemolytic disease of the newborn?",
  "o": [
   "Rh+ mother; first baby Rh−; second baby Rh−",
   "Rh− mother; first baby Rh−; second baby Rh+",
   "Rh+ mother; first baby Rh+; second baby Rh+",
   "Rh− mother; first baby Rh+, with no anti-D injection given after the birth; second baby Rh+"
  ],
  "a": 3,
  "e": "The danger needs an Rh− mother who has already been sensitised. At the first Rh+ birth, some baby cells entered her blood; with no anti-D injection she made her own anti-D, which can pass across the placenta and break down the red cells of a second Rh+ baby. In A and C the mother is Rh+, so she never makes anti-D. In B the first baby was Rh−, so there was no Rhesus antigen to sensitise her before the second pregnancy."
 },
 {
  "q": "How does an anti-D injection given to an Rh− mother soon after delivering an Rh+ baby protect her next Rh+ baby?",
  "o": [
   "It gives the next baby the Rhesus antigen so it is not attacked.",
   "It turns the mother's blood Rh+ permanently.",
   "It destroys the baby's Rh+ red cells that entered her blood before her own immune system can learn to make anti-D.",
   "It thickens the placenta so that no antibodies can cross."
  ],
  "a": 2,
  "e": "The injected antibodies clear the stray Rh+ cells quickly, so her body never builds up its own long-lasting anti-D; with none of her own anti-D, the next Rh+ baby is safe. The next baby already has the antigen (A), which is the problem, not the cure. A mother's Rhesus group is inherited and cannot be changed (B). The injection has no effect on the placenta (D)."
 },
 {
  "q": "Dr Aisha uses 140/90 mmHg as her warning line for high blood pressure. Which reading is above the line for **both** numbers?",
  "o": [
   "152/96 mmHg",
   "150/86 mmHg",
   "132/94 mmHg",
   "138/88 mmHg"
  ],
  "a": 0,
  "e": "The systolic number (when the ventricles contract) is compared with 140 and the diastolic number (when they relax) with 90. For A, 152 ≥ 140 and 96 ≥ 90, so both are high. In B the systolic is high but 86 is below 90. In C the diastolic is high but 132 is below 140. In D both numbers are below the line. For the keyed reading, the pulse pressure is 152 − 96 = 56 mmHg, wider than the usual 120 − 80 = 40 mmHg."
 },
 {
  "q": "Which disorder is correctly matched with a way to prevent or control it?",
  "o": [
   "Haemophilia: eating iron-rich food such as ugu and beans",
   "Varicose veins: an anti-D injection after childbirth",
   "Thrombosis: genotype testing before marriage",
   "Sickle cell anaemia: genotype testing and counselling before marriage"
  ],
  "a": 3,
  "e": "Sickle cell anaemia is inherited, so couples who know their genotypes (for example, two AS carriers) can make an informed choice with a counsellor. Iron-rich food (A) helps iron-deficiency anaemia, not haemophilia, which is an inherited clotting failure managed by avoiding injury and giving clotting factor. Anti-D (B) prevents Rhesus disease of the newborn; varicose veins are helped by not standing still for hours and by exercise. Thrombosis (C) is a clot inside a vessel; it is reduced by moving about on long journeys and by anticoagulant drugs, not by genotype tests."
 },
 {
  "q": "Tobi typed a group A, Rh− sample but used one stirrer for all three wells, going from the anti-A well to the anti-B well. Slight clumping then appeared in the anti-B well. What is the best explanation?",
  "o": [
   "The sample really carries antigen B, so it is group AB.",
   "Anti-A serum and group A cells were carried into the anti-B well on the stirrer, giving a false positive that could make him misread the sample as AB.",
   "Anti-B serum always clumps a little after 2 minutes.",
   "The stirrer carried antigen D into the well, so the sample is Rh+."
  ],
  "a": 1,
  "e": "The stirrer brought group A cells and anti-A serum from the first well, so they reacted in the anti-B well. The clumping did not come from the anti-B serum, so it is a false positive. That is why a fresh stirrer is used for every well. Option A trusts a contaminated result. Option C is false: anti-B does not clump cells without antigen B. Option D is wrong because the Rhesus result is read only in the anti-D well, and anti-D serum was not involved here."
 },
 {
  "q": "A clot that forms inside an unbroken blood vessel and blocks it causes the condition called",
  "o": [
   "atherosclerosis",
   "haemophilia",
   "thrombosis",
   "leukaemia"
  ],
  "a": 2,
  "e": "Thrombosis is clotting inside a vessel, for example in a leg vein after long hours without moving. Atherosclerosis (A) is fatty deposits narrowing and stiffening arteries; it can lead to a clot but is not the clot itself. Haemophilia (B) is the opposite problem: blood fails to clot. Leukaemia (D) is a cancer of white cells."
 },
 {
  "q": "Dr Aisha's whiteboard holds four conclusions from health day. Which one is correct?",
  "o": [
   "Long hours of standing and faulty leg-vein valves raised the pressure at the venous end of her ankle capillaries, so more tissue fluid formed than could drain away, and her ankles swelled.",
   "The rider should receive the O+ bag, because O is the universal donor.",
   "Chidi's pulse of 132 after the sprint shows that his pacemaker is damaged.",
   "The rider's wound sealed because his red cells agglutinated at the cut."
  ],
  "a": 0,
  "e": "Raised pressure at the venous end of the capillaries weakens the return of fluid, so tissue fluid builds up as oedema; this is Case 2 solved (her high blood pressure is a separate risk, not the cause of the swelling). Option B ignores Rhesus: the rider is Rh−, so Rh+ cells could sensitise him, and B− or O− must be used. Option C mistakes a normal, healthy response to exercise for a fault; his pulse returned to resting within minutes. Option D confuses clumping with clotting; fibrin sealed the wound."
 }
];
})();
