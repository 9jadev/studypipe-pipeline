/* Lesson 04 · The Beating Heart — sort items, cycle-explorer pins and the 12 quiz questions (03-questions.md § Lesson 04) */
(function () {
  "use strict";

  window.L04 = {
    // ---- 2A sort: speeds it up or slows it down? ----
    items: [
      { id: "exercise", name: "Exercise", emo: "↑", bin: "faster", why: "Working muscles need more oxygen and make more carbon dioxide, so the cardiac centre speeds up the SAN." },
      { id: "fear", name: "Fear or excitement (adrenaline)", emo: "↑", bin: "faster", why: "Adrenaline acts on the SAN and raises the rate." },
      { id: "fever", name: "Fever", emo: "↑", bin: "faster", why: "A raised body temperature speeds up the heart's activity." },
      { id: "co2", name: "High carbon dioxide in the blood", emo: "↑", bin: "faster", why: "The cardiac centre senses the extra carbon dioxide and speeds the heart up." },
      { id: "coffee", name: "Strong coffee (caffeine)", emo: "↑", bin: "faster", why: "Caffeine is a stimulant and raises the heart rate." },
      { id: "sleep", name: "Sleep", emo: "↓", bin: "slower", why: "The body needs little oxygen at rest, so the vagus nerve keeps the rate low." },
      { id: "rest", name: "Rest after exercise", emo: "↓", bin: "slower", why: "Once the muscles stop working, the rate glides back towards the resting value." },
      { id: "fit", name: "Long-term athletic fitness (resting rate)", emo: "↓", bin: "slower", why: "A trained heart pumps more blood per beat, so it needs fewer beats at rest." },
      { id: "vagus", name: "Impulses in the vagus nerve", emo: "↓", bin: "slower", why: "The vagus nerve carries the cardiac centre's slow-down signal to the SAN." },
      { id: "still", name: "Lying still and calm", emo: "↓", bin: "slower", why: "A calm, still body asks for little blood flow, so the rate is low." }
    ],

    // ---- cycle explorer: six time pins; each maps to a heart phase (0..1) of the HeartKit beat model ----
    // time t (s) is read on a clock where one cycle at 75 beats per minute lasts 0.8 s;
    // the six phases are chosen so the 3D heart shows: filling, filling, atria squeezing, lub, ejecting, dub.
    cycleBpm: 75,
    pins: [
      { t: 0.0, ph: 0.64, label: "0.0 s" },
      { t: 0.1, ph: 0.80, label: "0.1 s" },
      { t: 0.2, ph: 0.93, label: "0.2 s" },
      { t: 0.4, ph: 0.08, label: "0.4 s" },
      { t: 0.6, ph: 0.22, label: "0.6 s" },
      { t: 0.8, ph: 0.57, label: "0.8 s" }
    ],

    quizNote: "03-questions.md § Lesson 04"
  };

  window.LESSON_QUIZ = [
 {
  "q": "Chidi listens through Dr Aisha's stethoscope after his sprint. Baba Sule insists the \"lub\" is the heart muscle clapping as it squeezes. What really produces the \"lub\"?",
  "o": [
   "The semilunar valves snapping shut as the ventricles relax",
   "The tricuspid and bicuspid valves shutting as the ventricles begin to contract",
   "The atria contracting and blood striking the ventricle walls",
   "Blood rushing into the aorta as the semilunar valves open"
  ],
  "a": 1,
  "e": "When ventricular pressure climbs above atrial pressure, the two atrioventricular (AV) valves, the tricuspid and the bicuspid, are forced shut; that closure is the first sound, \"lub\". Option A describes the second sound, \"dub\", so it swaps the two sounds. Option C is Baba Sule's slip in another form: a heart sound comes from valves closing, not from a chamber squeezing. Option D names a valve opening, and valves make their sound when they close, not when they open."
 },
 {
  "q": "At the screening tent, Dr Aisha counts 25 beats at a volunteer's wrist in 15 seconds. What are the volunteer's heart rate and the length of one cardiac cycle?",
  "o": [
   "100 beats min⁻¹; 1.67 s",
   "25 beats min⁻¹; 2.4 s",
   "375 beats min⁻¹; 0.16 s",
   "100 beats min⁻¹; 0.60 s"
  ],
  "a": 3,
  "e": "Heart rate = beats in t × 60/t = 25 × 60/15 = 25 × 4 = 100 beats min⁻¹. Cycle time T = 60 s ÷ heart rate = 60 ÷ 100 = 0.60 s. Option A has the right rate but turns the division upside down (100 ÷ 60 = 1.67). Option B forgets to scale the 15 s count up to one minute. Option C multiplies by 15 instead of by 60/15 = 4, a scaling slip that gives an impossible rate."
 },
 {
  "q": "Which sequence shows the correct path of the electrical impulse that starts each heartbeat?",
  "o": [
   "Sinoatrial node → atrioventricular node → bundle of His → Purkinje fibres",
   "Atrioventricular node → sinoatrial node → Purkinje fibres → bundle of His",
   "Sinoatrial node → bundle of His → atrioventricular node → Purkinje fibres",
   "Medulla oblongata → sinoatrial node → atrioventricular node → bundle of His"
  ],
  "a": 0,
  "e": "The SAN in the right atrium wall fires first and the wave crosses both atria; the AVN holds it for a moment, then the bundle of His carries it down the septum and the Purkinje fibres spread it through the ventricle walls. Option B starts at the wrong node and reverses the last two steps. Option C places the bundle of His before the AVN, but the bundle can only receive the impulse after the AVN has passed it on. Option D is Baba Sule's myth: heart muscle is myogenic, and the brain only changes the rate; it does not start each beat."
 },
 {
  "q": "Chidi's heart rate after his sprint was 132, 116, 96, 80, 72 and 68 beats min⁻¹ at 0, 1, 2, 3, 4 and 5 minutes. Between which two readings did his heart rate fall by the largest amount?",
  "o": [
   "0 and 1 minute",
   "3 and 4 minutes",
   "1 and 2 minutes",
   "4 and 5 minutes"
  ],
  "a": 2,
  "e": "The falls are 132 − 116 = 16, 116 − 96 = 20, 96 − 80 = 16, 80 − 72 = 8 and 72 − 68 = 4 beats min⁻¹, so the biggest drop (20) is between 1 and 2 minutes. Option A is the tempting guess \"the first minute always falls most\", but it fell by 16, not 20. Options B and D are the smallest drops, where the curve is flattening out as it nears the resting rate, which is why the points are joined with a smooth curve, not a straight line."
 },
 {
  "q": "While the ventricles are contracting and blood is being driven into the aorta and pulmonary artery, which statement about the valves is correct?",
  "o": [
   "The AV valves are shut and the semilunar valves are open.",
   "The AV valves are open and the semilunar valves are shut.",
   "The AV valves and the semilunar valves are both open.",
   "The AV valves and the semilunar valves are both shut."
  ],
  "a": 0,
  "e": "To push blood out into the arteries, the semilunar valves must be open; at the same moment the AV valves must be shut, or blood would be forced back up into the atria. Option B is the state while the heart is relaxed and filling, the reverse of this stage. Option C would let blood escape backwards into the atria. Option D can only last an instant at the very start of contraction, before ventricular pressure passes arterial pressure; while blood is actually flowing out, the semilunar valves are open."
 },
 {
  "q": "Dr Aisha's own resting heart rate is 64 beats min⁻¹ and her stroke volume is 75 cm³. What is her cardiac output?",
  "o": [
   "4800 dm³ min⁻¹",
   "0.48 dm³ min⁻¹",
   "4.80 dm³ min⁻¹",
   "1.17 dm³ min⁻¹"
  ],
  "a": 2,
  "e": "Cardiac output = heart rate × stroke volume = 64 × 75 cm³ = 4800 cm³ min⁻¹; then 4800 ÷ 1000 = 4.80 dm³ min⁻¹. Option A keeps the cm³ number but writes the dm³ unit (forgot to divide by 1000). Option B is a ÷10 slip in the conversion (dividing by 10 000). Option D divides the stroke volume by the rate (75 ÷ 64) instead of multiplying."
 },
 {
  "q": "Where in the heart is the natural pacemaker (sinoatrial node) found?",
  "o": [
   "In the wall of the left atrium",
   "In the septum between the two ventricles",
   "In the medulla oblongata of the brain",
   "In the right atrium's wall"
  ],
  "a": 3,
  "e": "The SAN is a small patch of special muscle set into the right atrium's wall, close to where the venae cavae enter. Option A puts it on the wrong side. Option B is where the bundle of His runs, not where the beat begins. Option C is the cardiac centre, which only adjusts the rate through nerves; it is not part of the heart."
 },
 {
  "q": "After a full school football match, Chidi's heart rate rose from a resting 70 to 154 beats min⁻¹. By what percentage did it rise?",
  "o": [
   "54.5%",
   "120%",
   "220%",
   "84%"
  ],
  "a": 1,
  "e": "% change = (new − old)/old × 100 = (154 − 70)/70 × 100 = 84/70 × 100 = 120%. Option A divides the rise by the new value (84/154) instead of the old one. Option C gives the new rate as a percentage of the old one (154/70 × 100), forgetting to subtract the starting value first. Option D stops at the rise in beats (84) and never divides by the old value."
 },
 {
  "q": "In the pulse-rate practical, a learner waited about 20 seconds after the step-ups before starting the first count. How did this affect the peak heart rate she recorded?",
  "o": [
   "It made the peak too high, because the heart keeps speeding up after exercise stops.",
   "It had no effect, because the rate stays steady for the first minute after exercise.",
   "It made the peak too low, because the heart had already begun to slow down during the delay.",
   "It made the peak too high, because multiplying by 4 doubles any error."
  ],
  "a": 2,
  "e": "Recovery starts the moment exercise stops, so a delayed count catches the rate after it has already dropped and the recorded peak is too low. Option A gets the direction wrong: the rate falls, not rises, once the step-ups end. Option B ignores the recovery curve, which is falling steeply in the first minutes. Option D confuses two different errors: the ×4 step magnifies a miscount by four, it does not double it, and it does not push the reading in one fixed direction."
 },
 {
  "q": "Which of the following slows the heart rate?",
  "o": [
   "Impulses travelling along the vagus nerve",
   "Release of adrenaline into the blood",
   "A rise in the carbon dioxide level of the blood",
   "A fever"
  ],
  "a": 0,
  "e": "The cardiac centre in the medulla slows the SAN by sending impulses down the vagus nerve; this is how Chidi's rate glided back to 68. Options B, C and D all raise the rate: adrenaline (fear, excitement) acts directly on the SAN, extra carbon dioxide from busy muscles signals the cardiac centre to speed the heart up, and a fever speeds up the heart's activity."
 },
 {
  "q": "A resting heart beats at 60 beats min⁻¹, and ventricular contraction lasts 0.30 s in each cycle. What percentage of every cycle do the ventricles spend relaxed?",
  "o": [
   "30%",
   "0.70%",
   "43%",
   "70%"
  ],
  "a": 3,
  "e": "Cycle time = 60 ÷ 60 = 1.0 s. Relaxed time = 1.0 − 0.30 = 0.70 s. Percentage = 0.70/1.0 × 100 = 70%. Option A gives the contracting fraction, not the relaxed one. Option B is the fraction 0.70 with a % sign added but never multiplied by 100. Option C divides contracting time by relaxed time (0.30/0.70) instead of relaxed time by the whole cycle. The long rest in each cycle is why heart muscle does not tire."
 },
 {
  "q": "Mama Bisi's blood pressure reading is 160/100 mmHg. What does the figure 100 represent?",
  "o": [
   "The pressure in the arteries while the ventricles are contracting",
   "The pressure in the arteries while the ventricles are relaxed",
   "Her pulse rate in beats per minute",
   "The pressure of blood in her veins as it returns to the heart"
  ],
  "a": 1,
  "e": "A reading is written as pressure during ventricular contraction over pressure during ventricular relaxation, both measured in a large artery (usually the upper arm) with a sphygmomanometer. The lower figure, 100, is therefore the pressure while the ventricles relax; a healthy young adult would read about 80 here. Option A describes the upper figure, 160. Option C confuses pressure (mmHg) with rate (beats per minute). Option D is wrong because venous pressure is far lower, only a few mmHg near the heart, and is not what the cuff measures."
 }
];
})();
