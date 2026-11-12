/* Lesson 03 · The Double Circuit — sort cards, organ pins, route labels and the 12 quiz questions (03-questions.md § Lesson 03) */
(function () {
  "use strict";

  window.L03 = {
    // ---- 2A sort: put the journey in order (13 steps + 1 distractor) ----
    steps: [
      { id: "cavae", name: "Venae cavae" },
      { id: "ra", name: "Right atrium" },
      { id: "tri", name: "Tricuspid valve" },
      { id: "rv", name: "Right ventricle" },
      { id: "pvalve", name: "Pulmonary semilunar valve" },
      { id: "pa", name: "Pulmonary artery" },
      { id: "lungs", name: "Lung capillaries" },
      { id: "pv", name: "Pulmonary veins" },
      { id: "la", name: "Left atrium" },
      { id: "bic", name: "Bicuspid valve" },
      { id: "lv", name: "Left ventricle" },
      { id: "avalve", name: "Aortic semilunar valve" },
      { id: "aorta", name: "Aorta" }
    ],
    distractor: { id: "portal", name: "Hepatic portal vein" },

    // ---- explorer pins: organ → artery in, vein out; "lit" = BodyCircuit part ids lit on the 3D body ----
    pins: [
      { key: "brain", label: "Brain and head", inV: "a carotid artery", outV: "a jugular vein", lit: ["carotid", "jugular", "brain"], note: "The carotids climb the neck; the jugulars bring blood back down to the superior vena cava." },
      { key: "arm", label: "Arm", inV: "a subclavian artery", outV: "a subclavian vein", lit: ["subclavianA", "subclavianV", "arm"], note: "The rider's drip enters a forearm vein that drains into the subclavian vein." },
      { key: "lungs", label: "Lungs", inV: "the pulmonary artery", outV: "the pulmonary veins", lit: ["pulmonaryArtery", "pulmonaryVeins", "lungs"], note: "The exception: the artery carries oxygen-poor blood and the veins carry oxygen-rich blood." },
      { key: "liver", label: "Liver", inV: "the hepatic artery (and the hepatic portal vein)", outV: "the hepatic vein", lit: ["hepaticArtery", "hepaticPortal", "hepaticVein", "liver"], note: "Two supplies: oxygen-rich blood from the aorta and food-rich blood from the gut." },
      { key: "gut", label: "Gut", inV: "a mesenteric artery", outV: "the hepatic portal vein, which goes to the liver", lit: ["mesenteric", "hepaticPortal", "gut"], note: "Gut blood does not go straight to the heart: the liver checks it first." },
      { key: "kidney", label: "Kidney", inV: "a renal artery", outV: "a renal vein", lit: ["renalA", "renalV", "kidney"], note: "The kidneys filter urea out of this blood." },
      { key: "leg", label: "Leg", inV: "an iliac / femoral artery", outV: "an iliac / femoral vein", lit: ["femoralA", "femoralV", "leg"], note: "The longest trip back up to the heart is the one from the feet." },
      { key: "heart", label: "Heart muscle", inV: "the coronary arteries", outV: "the coronary veins", lit: ["coronary", "coronaryV", "heartMuscle"], note: "The first branches off the aorta, feeding the heart wall itself. The coronary veins empty into the right atrium." }
    ],

    // route presets: label and the order of results table rows
    presets: {
      armBrain: "Forearm vein → brain",
      ileumBrain: "Ileum → brain",
      liverKidney: "Liver → kidney",
      lungsHeart: "Lungs → heart muscle"
    },
    expected: {
      armBrain: { valves: 4, lungs: "yes" },
      ileumBrain: { valves: 4, lungs: "yes" },
      liverKidney: { valves: 4, lungs: "yes" },
      lungsHeart: { valves: 2, lungs: "starts there" }
    }
  };

  window.LESSON_QUIZ = [
 {
  "q": "On the route-tracer bench, blood has just left the right ventricle. Which three structures does it meet next, in order?",
  "o": [
   "Aorta → body organs → venae cavae",
   "Bicuspid valve → left ventricle → aorta",
   "Pulmonary veins → lungs → left atrium",
   "Pulmonary semilunar valve → pulmonary artery → lung capillaries"
  ],
  "a": 3,
  "e": "When the right ventricle squeezes, blood pushes open the pulmonary semilunar valve, enters the pulmonary artery and is then divided among the capillaries of the lungs. A starts from the <em>left</em> ventricle. B belongs to the left side of the heart, which this blood cannot reach until it has been to the lungs. C puts the pulmonary veins before the lungs; they carry blood <em>from</em> the lungs, so the order is reversed."
 },
 {
  "q": "The pulmonary circulation begins in the _____ and ends in the _____.",
  "o": [
   "left ventricle; right atrium",
   "right ventricle; left atrium",
   "right atrium; left ventricle",
   "left atrium; right ventricle"
  ],
  "a": 1,
  "e": "The lung loop runs right ventricle → pulmonary semilunar valve → pulmonary artery → lung capillaries → pulmonary veins → left atrium. A is the start and end of the <em>systemic</em> loop. C and D pair an atrium with a ventricle on the opposite side, which never happens directly, because the septum keeps the halves apart."
 },
 {
  "q": "As the okada rider's blood flows through the capillaries of his lungs, which change takes place in it?",
  "o": [
   "It loses carbon dioxide and gains oxygen",
   "It gains carbon dioxide and loses oxygen",
   "It gains glucose from the air in the lungs",
   "It loses urea, which is breathed out"
  ],
  "a": 0,
  "e": "In the lungs, carbon dioxide diffuses out of the blood into the air sacs and oxygen diffuses in, so dark oxygen-poor blood becomes bright oxygen-rich blood. B is what happens in the capillaries of body organs, not the lungs. C is wrong: air contains no glucose; glucose enters the blood in the gut. D is wrong: urea is removed by the kidneys, not breathed out."
 },
 {
  "q": "Why is the vessel that carries blood from the intestine to the liver called a <em>portal</em> vein?",
  "o": [
   "It carries oxygenated blood, unlike other veins",
   "It carries blood straight to the heart",
   "It begins in the capillaries of the gut and ends in the capillaries of the liver",
   "It has semilunar valves at both ends"
  ],
  "a": 2,
  "e": "A portal vein links two capillary beds instead of draining a capillary bed into the heart. A is wrong: gut blood has already given up much of its oxygen. B is the classic trap: the hepatic portal vein ends in the <em>liver</em>, not the heart. D is wrong: semilunar valves guard the exits of the two ventricles, not the hepatic portal vein."
 },
 {
  "q": "Mama Bisi eats a large plate of amala at noon. Half an hour later, which blood vessel holds blood with the highest concentration of glucose?",
  "o": [
   "Hepatic vein",
   "Hepatic portal vein",
   "Hepatic artery",
   "Renal vein"
  ],
  "a": 1,
  "e": "Starch from the amala is digested to glucose and absorbed into the gut capillaries, which drain into the hepatic portal vein, so its blood is the richest in glucose after a meal. A carries blood <em>after</em> the liver has stored the extra glucose as glycogen, so it holds less. C brings oxygen-rich blood from the aorta, with ordinary glucose levels. D drains the kidney, which has taken glucose out of its blood to use, not added any."
 },
 {
  "q": "A drip is placed in a vein in the okada rider's forearm. Which named vein does the fluid enter before it reaches the superior vena cava?",
  "o": [
   "Jugular vein",
   "Hepatic vein",
   "Inferior vena cava",
   "Subclavian vein"
  ],
  "a": 3,
  "e": "Blood from the arm drains into the subclavian vein, which joins the superior vena cava. A drains the head and brain, not the arm. B drains the liver into the <em>inferior</em> vena cava. C collects blood from the trunk and legs and enters the right atrium separately from the superior vena cava."
 },
 {
  "q": "How does the muscle of the heart wall get its oxygen and food?",
  "o": [
   "From the coronary arteries, the first branches of the aorta",
   "By absorbing blood directly from inside the chambers through the endocardium",
   "From the pulmonary artery as it leaves the heart",
   "From the carotid arteries in the neck"
  ],
  "a": 0,
  "e": "The coronary arteries leave the aorta just beyond the aortic valve and spread over the heart surface, feeding the muscle. B is the misconception the lesson corrects: the wall is too thick for diffusion from the chambers to reach all its cells, and half the heart holds oxygen-poor blood anyway. C carries deoxygenated blood to the lungs. D supply the head and brain."
 },
 {
  "q": "A clot blocks a branch of one coronary artery. What is the most likely result?",
  "o": [
   "Brain cells die from lack of oxygen",
   "The lungs can no longer exchange gases",
   "The patch of heart muscle beyond the blockage is starved of oxygen and dies, causing a heart attack",
   "Blood flows backwards from the left ventricle into the right atrium"
  ],
  "a": 2,
  "e": "A coronary artery supplies only heart muscle, so blocking it starves the muscle downstream of the clot. A describes a stroke, caused by a blocked vessel to the brain. B would follow damage to the lungs or their vessels, not a coronary blockage. D is impossible: the ventricle and the opposite atrium are not connected, and the problem is starved muscle, not backflow."
 },
 {
  "q": "Carbon dioxide made by Chidi's brain cells must reach his lungs. Which route is correct?",
  "o": [
   "Jugular vein → inferior vena cava → right atrium → tricuspid valve → right ventricle → pulmonary artery → lung capillaries",
   "Carotid artery → superior vena cava → right atrium → tricuspid valve → right ventricle → pulmonary vein → lung capillaries",
   "Jugular vein → superior vena cava → left atrium → bicuspid valve → left ventricle → pulmonary artery → lung capillaries",
   "Jugular vein → superior vena cava → right atrium → tricuspid valve → right ventricle → pulmonary artery → lung capillaries"
  ],
  "a": 3,
  "e": "Blood leaves the brain in the jugular vein, reaches the right atrium by way of the superior vena cava, and the right ventricle sends it to the lungs in the pulmonary artery. A uses the inferior vena cava, which drains the lower body, not the head. B starts in the carotid <em>artery</em>, which brings blood <em>to</em> the brain, and uses the pulmonary vein, which carries blood <em>from</em> the lungs. C sends it to the left side, which receives only blood that has already been to the lungs."
 },
 {
  "q": "A drug is injected into a vein in a patient's leg. How many heart valves does it pass before it reaches the kidney?",
  "o": [
   "4",
   "2",
   "3",
   "8"
  ],
  "a": 0,
  "e": "Leg vein → inferior vena cava → right atrium → **tricuspid** → right ventricle → **pulmonary semilunar** → pulmonary artery → lung capillaries → pulmonary veins → left atrium → **bicuspid** → left ventricle → **aortic semilunar** → aorta → renal artery → kidney: four valves. B counts only the left side, as if the drug skipped the lungs. C forgets one of the semilunar valves. D counts every valve twice."
 },
 {
  "q": "Which organ is correctly matched with the vessel that brings blood to it and the vessel that drains blood from it?",
  "o": [
   "Kidney: renal vein in, renal artery out",
   "Gut: hepatic portal vein in, mesenteric artery out",
   "Brain: carotid artery in, jugular vein out",
   "Lungs: pulmonary vein in, pulmonary artery out"
  ],
  "a": 2,
  "e": "Arteries carry blood to an organ and veins carry it away; the carotid supplies the brain and the jugular drains it. A, B and D all have the right pair of vessels but swap their directions: the renal <em>artery</em> enters the kidney, the mesenteric <em>artery</em> enters the gut (and the hepatic portal vein drains it), and the pulmonary <em>artery</em> enters the lungs."
 },
 {
  "q": "Baba Sule insists that the drip in the rider's arm \"goes straight up the vein to the brain\". Which statement best corrects him?",
  "o": [
   "He is right, because the subclavian vein joins the carotid artery in the neck",
   "Veins carry blood towards the heart, so the drip passes the right side of the heart, the lungs and the left side before the aorta and carotid artery take it to the brain",
   "The drip reaches the brain through the jugular vein, which carries blood upwards",
   "The drip is carried to the liver by the hepatic portal vein before anything else"
  ],
  "a": 1,
  "e": "Every vein ends at the heart, and every body-to-body trip must cross the lungs, so the drip makes a full double loop before reaching the brain. A is wrong: no vein joins an artery directly; they are linked only through capillaries. C reverses the jugular vein, which drains blood <em>from</em> the brain. D wrongly sends arm blood to the liver; only blood from the gut takes the hepatic portal route."
 }
];
})();
