// Lesson 06 explainer plan: What sealed the rider's cut, and what did he lose? (blood composition, cells, clotting, counts)
// Direction script: lesson-06-direction-script.md (rendered from this plan, plus review notes)
// Build + embed: node scripts/apply-video.mjs topics/ss2-bio-heart-circulation --lesson lesson-06
const k = (r, s) => `\\htmlClass{role-${r}}{${s}}`;
const P = s => k('P', s), C = s => k('C', s), F = s => k('F', s), N = s => k('N', s);
const BL = 'blood';

// Worked Example 1: haemocytometer
const sq = [98, 92, 101, 95, 94], total = sq.reduce((a, b) => a + b, 0);
const vSq = 0.2 * 0.2 * 0.1, v5 = 5 * vSq, dil = total / v5, undil = dil * 200;
// Worked Example 2: micrograph
const real1 = 15 / 2000, um1 = real1 * 1000;
// Worked Example 3: whole body
const body = 5.0e6 * (5.0 * 1e6);
// Bridge and your turn
const lost = 1.5 / 5.0 * 100, real2 = 40 / 4000, um2 = real2 * 1000;

module.exports = {
  meta: {
    title: 'What Sealed the Rider\'s Cut?', subtitle: 'Lesson 06 · Blood: plasma, cells and clotting', eq: 'prothrombin → thrombin, fibrinogen → fibrin',
    subject: 'Biology', level: 'SS2 · WAEC / NECO / JAMB', next: '#apply', nextLabel: 'Continue to Apply →',
    roles: { P: { color: 'gold', name: 'plasma' }, C: { color: 'red', name: 'cells' }, F: { color: 'sky', name: 'clotting chain' }, N: { color: 'green', name: 'answers' } },
    captionFixes: { 'haemoglobin': 'haemoglobin', 'one in two hundred': '1 in 200' },
  },
  checks: [
    ['plasma 55% + cells 45%', 55 + 45, 100],
    ['plasma in 5.0 dm3 = 2.75', 0.55 * 5.0, 2.75],
    ['cells in 5.0 dm3 = 2.25', 0.45 * 5.0, 2.25],
    ['plasma + cells volumes = 5.0', 0.55 * 5.0 + 0.45 * 5.0, 5.0],
    ['5 squares total = 480', total, 480],
    ['one square = 0.004 mm3', vSq, 0.004, 1e-12],
    ['five squares = 0.020 mm3', v5, 0.020, 1e-12],
    ['diluted = 24 000 per mm3', dil, 24000, 1e-6],
    ['undiluted = 4 800 000 per mm3', undil, 4.8e6, 1e-3],
    ['undiluted = 4.8 x 10^6', undil / 1e6, 4.8, 1e-9],
    ['image 15 mm / 2000 = 0.0075 mm', real1, 0.0075, 1e-12],
    ['0.0075 mm = 7.5 um', um1, 7.5, 1e-9],
    ['5.0 dm3 = 5.0 x 10^6 mm3', 5.0 * 1e6, 5.0e6],
    ['body red cells = 2.5 x 10^13', body / 1e13, 2.5, 1e-9],
    ['25 x 10^12 = 2.5 x 10^13', 25e12, 2.5e13],
    ['blood lost 1.5 of 5.0 = 30%', lost, 30, 1e-9],
    ['your turn: 40 mm / 4000 = 0.010 mm', real2, 0.010, 1e-12],
    ['your turn: 0.010 mm = 10 um', um2, 10, 1e-9],
    { name: 'four clotting steps in order', test: () => ['thromboplastin', 'thrombin', 'fibrin', 'clot'].length === 4 },
    { name: 'normal red count is about 5 million, 4.8 million is in range', test: () => undil > 4.5e6 && undil < 5.5e6 },
  ],
  chapters: [
    { title: 'What sealed the cut?', cues: [
      { say: 'At the health tent, the okada rider\'s gash was bleeding badly. Dr Aisha pressed a pad on it, and after some minutes, it slowed, and then it stopped. Nobody stitched it. What sealed it?', ops: [{ clear: 'What sealed it?' }, { panel: BL, s: { scene: 'clot', stage: 1, labels: 0, focus: null }, fresh: 1 }, { write: 'h1', tex: '\\text{nobody stitched it}' }, { write: 'h2', tex: '\\text{so what sealed it?}', at: 6 }] },
      { say: 'Baba Sule says, the air dries it, like palm oil, and you can rub salt on top. Is he right? And how much blood did the rider lose?', ops: [{ write: 'h3', tex: '\\text{Baba Sule: air dries it}' }, { write: 'h4', tex: '\\text{and what did he lose?}', at: 5 }] },
      { say: 'By the end, you will describe what blood is made of, compare its cells, explain clotting, and do two counting calculations.', ops: [{ clear: 'By the end' }, { write: 'o1', tex: '\\square\\ \\text{what blood is made of}' }, { write: 'o2', tex: '\\square\\ \\text{how blood clots}', at: 3 }, { write: 'o3', tex: '\\square\\ \\text{count cells, size a cell}', at: 5 }] },
    ] },
    { title: 'Plasma and cells', cues: [
      { say: 'Spin a tube of blood in a centrifuge and it separates. About fifty-five percent is pale, straw-coloured plasma. About forty-five percent is cells.', ops: [{ clear: 'Plasma and cells' }, { panel: BL, s: { scene: 'cells', labels: 1, plasma: 1, rbc: 0, wbc: 0, platelets: 0, focus: 'tube' }, fresh: 1 }, { camera: 'wide', focus: 'tube' }, { write: 'p1', tex: `${P('\\text{plasma } 55\\%')},\\ ${C('\\text{cells } 45\\%')}` }] },
      { say: 'An adult carries about five point zero decimetres cubed of blood. So fifty-five percent gives two point seven five decimetres cubed of plasma, and two point two five of cells.', ops: [{ write: 'p2', tex: '5.0\\ \\text{dm}^3\\ \\text{blood}' }, { write: 'p3', tex: `${P('2.75\\ \\text{dm}^3')}\\ +\\ ${C('2.25\\ \\text{dm}^3')}`, at: 4.5 }] },
      { say: 'Plasma is about nine-tenths water. It carries dissolved food, salts, hormones, urea, most of the carbon dioxide, heat, and plasma proteins such as fibrinogen and prothrombin.', ops: [{ clear: 'Inside plasma' }, { write: 'q1', tex: `${P('\\text{plasma}')}:\\ \\text{90\\% water}` }, { write: 'q2', tex: '\\text{food, salts, hormones}', at: 3.5 }, { write: 'q3', tex: '\\text{urea, CO}_2\\text{, heat}', at: 5.5 }, { write: 'q4', tex: '\\text{proteins: fibrinogen\\ldots}', at: 7.5 }] },
      { say: 'Take out fibrinogen and the other clotting proteins, and what is left is called serum. Plasma with the clotting proteins removed is serum.', ops: [{ write: 'q5', tex: '\\text{plasma} - \\text{clotting proteins}' }, { write: 'q6', tex: '= \\text{serum}', at: 4 }, { box: 'q6', at: 6 }] },
    ] },
    { title: 'Three kinds of cell', cues: [
      { say: 'Most cells are red cells, or erythrocytes. Each is a dimpled disc with no nucleus, and there are about five million in every cubic millimetre.', ops: [{ clear: 'Red cells' }, { panel: BL, s: { rbc: 1, focus: 'rbc' } }, { camera: 'wide', focus: 'rbc' }, { write: 'r1', tex: `${C('\\text{red cell}')}:\\ \\text{biconcave disc}` }, { write: 'r2', tex: '\\text{no nucleus; 5 million/mm}^3', at: 4.5 }] },
      { say: 'They are made in red bone marrow, live about one hundred and twenty days, and are broken down in the liver and spleen. They carry oxygen as oxyhaemoglobin.', ops: [{ write: 'r3', tex: '\\text{made: red bone marrow}' }, { write: 'r4', tex: '\\text{lives about 120 days}', at: 3.5 }] },
      { say: 'Four adaptations. The dimpled shape gives a big surface for oxygen. No nucleus leaves room for extra haemoglobin. Small, bendy cells squeeze through capillaries. And the enzyme carbonic anhydrase speeds carbon dioxide carriage.', ops: [{ clear: 'Four adaptations' }, { write: 'a1', tex: '1.\\ \\text{dimpled: large surface}' }, { write: 'a2', tex: '2.\\ \\text{no nucleus: more Hb}', at: 4 }, { write: 'a3', tex: '3.\\ \\text{small, bendy: capillaries}', at: 7 }, { write: 'a4', tex: '4.\\ \\text{carbonic anhydrase: CO}_2', at: 10 }] },
      { say: 'White cells, or leucocytes, have a nucleus and no fixed shape. There are only about seven to eight thousand per cubic millimetre, and they defend the body.', ops: [{ clear: 'White cells' }, { panel: BL, s: { wbc: 1, focus: 'wbc' } }, { camera: 'wide', focus: 'wbc' }, { write: 'w1', tex: '\\text{white cell: has a nucleus}' }, { write: 'w2', tex: '7000\\text{--}8000/\\text{mm}^3', at: 4.5 }] },
      { say: 'Two kinds to name. A phagocyte has a lobed nucleus and swallows bacteria. A lymphocyte has one big round nucleus filling most of the cell, and makes antibodies.', ops: [{ write: 'w3', tex: '\\text{phagocyte: lobed; engulfs}' }, { write: 'w4', tex: '\\text{lymphocyte: round; antibodies}', at: 5 }] },
      { say: 'Platelets, or thrombocytes, are small cell fragments with no nucleus. There are about two hundred and fifty thousand per cubic millimetre, they last seven to ten days, and they help blood to clot.', ops: [{ clear: 'Platelets' }, { panel: BL, s: { platelets: 1, focus: 'platelets' } }, { camera: 'wide', focus: 'platelets' }, { write: 't1', tex: '\\text{platelet: cell fragment}' }, { write: 't2', tex: '250\\,000/\\text{mm}^3\\text{; 7--10 days}', at: 4.5 }] },
    ] },
    { title: 'How blood clots', cues: [
      { say: 'Now back to the rider\'s gash. Here is a vessel, and here is the cut. Red cells leak out.', ops: [{ clear: 'How blood clots' }, { panel: BL, s: { scene: 'clot', stage: 1, labels: 1, focus: 'cut' }, fresh: 1 }, { camera: 'wide', focus: 'cut' }, { write: 'k1', tex: '1.\\ \\text{cut: blood leaks}' }] },
      { say: 'Step one. Damaged tissue and platelets release thromboplastin.', ops: [{ panel: BL, s: { stage: 2 } }, { write: 'k2', tex: `2.\\ ${F('\\text{thromboplastin}')}` }] },
      { say: 'Step two. Helped by calcium ions and vitamin K, thromboplastin turns inactive prothrombin into active thrombin.', ops: [{ panel: BL, s: { stage: 3, focus: 'cascade' } }, { camera: 'wide', focus: 'cascade' }, { write: 'k3', tex: `3.\\ \\text{prothrombin} \\to ${F('\\text{thrombin}')}`, note: 'Ca²⁺, vit K' }] },
      { say: 'Step three. Thrombin changes dissolved fibrinogen into solid fibrin threads.', ops: [{ write: 'k4', tex: `4.\\ \\text{fibrinogen} \\to ${F('\\text{fibrin}')}` }] },
      { say: 'Step four. The fibrin net snares red cells. The tangle is a clot, and later it dries into a scab. The leak stops, and germs are kept out.', ops: [{ panel: BL, s: { stage: 4, focus: 'cut' } }, { camera: 'wide', focus: 'cut' }, { write: 'k5', tex: '5.\\ \\text{net traps cells = clot}' }, { box: 'k5', at: 3 }] },
      { say: 'So why does blood not clot inside healthy vessels? The lining is smooth, so nothing is torn, and the anticoagulant heparin is present. In haemophilia, an inherited sex-linked condition, clotting fails.', ops: [{ clear: 'Why not inside?' }, { camera: 'wide' }, { write: 'b1', tex: '\\text{smooth lining: no trigger}' }, { write: 'b2', tex: '\\text{heparin keeps it liquid}', at: 4 }, { write: 'b3', tex: '\\text{haemophilia: clotting fails}', at: 7 }] },
    ] },
    { title: 'Example 1: counting red cells', cues: [
      { say: 'Worked example one. A blood sample is diluted one in two hundred. In five haemocytometer squares, each point two by point two millimetres and point one deep, four hundred and eighty red cells are counted. Find the count in whole blood.', ops: [{ clear: 'Example 1: cell count' }, { panel: null }, { camera: 'board' }, { write: 'e1', tex: '480\\ \\text{cells, 5 squares}' }, { write: 'e2', tex: '0.2 \\times 0.2 \\times 0.1\\ \\text{mm}', at: 4.5 }, { write: 'e3', tex: '\\text{diluted 1 in 200}', at: 8 }] },
      { say: 'Step one. The volume of one square is point two times point two times point one. That is point zero zero four cubic millimetres.', ops: [{ write: 'e4', tex: '\\text{1 square} = 0.004\\ \\text{mm}^3' }] },
      { say: 'Step two. Five squares hold five times that, so point zero two zero cubic millimetres.', ops: [{ clear: 'Example 1: steps' }, { write: 'e5', tex: '5 \\times 0.004 = 0.020\\ \\text{mm}^3' }] },
      { say: 'Step three. Divide the cells by the volume. Four hundred and eighty over point zero two zero is twenty-four thousand cells per cubic millimetre, in the diluted blood.', ops: [{ write: 'e6', tex: '480 / 0.020' }, { write: 'e7', tex: '= 24\\,000\\ \\text{mm}^{-3}', at: 4.5 }] },
      { say: 'Step four. Undo the dilution. The blood was diluted two hundred times, so multiply by two hundred. Twenty-four thousand times two hundred is four point eight million.', ops: [{ write: 'e8', tex: '24\\,000 \\times 200' }, { write: 'e9', tex: `= ${N('4.8 \\times 10^6\\ \\text{mm}^{-3}')}`, at: 5 }, { box: 'e9', at: 8 }] },
      { say: 'That is close to the normal five million, so the answer makes sense. The two classic slips are forgetting to multiply by the dilution, and dividing by one square instead of five.', ops: [{ clear: 'Count: sense check' }, { write: 'm1', tex: '\\approx 5\\ \\text{million: normal}' }, { write: 'm2', tex: '\\text{keep the}\\ \\times 200', at: 4 }, { write: 'm3', tex: '\\text{divide by all 5 squares}', at: 7 }] },
      { say: 'And remember, cells touching the top and left lines are counted, but cells on the bottom and right lines are left out. Counting all four lines counts some twice, so the answer comes out too high.', ops: [{ write: 'm4', tex: '\\text{top, left: count}' }, { write: 'm5', tex: '\\text{bottom, right: skip}', at: 3.5 }, { write: 'm6', tex: '\\text{all four: count too high}', at: 6.5 }] },
    ] },
    { title: 'Example 2: size from a micrograph', cues: [
      { say: 'Worked example two. On a micrograph magnified two thousand times, a red cell measures fifteen millimetres across. What is its real diameter, in micrometres?', ops: [{ clear: 'Example 2: real size' }, { write: 'z1', tex: '\\text{image} = 15\\ \\text{mm}' }, { write: 'z2', tex: '\\text{magnification} = \\times 2000', at: 3.5 }] },
      { say: 'Actual size equals image size divided by magnification. Fifteen millimetres over two thousand is point zero zero seven five millimetres.', ops: [{ write: 'z3', tex: '\\text{actual} = \\dfrac{\\text{image}}{M}' }, { write: 'z4', tex: '= 15 / 2000 = 0.0075\\ \\text{mm}', at: 4.5 }] },
      { say: 'Now change the unit. One millimetre is one thousand micrometres, so multiply by one thousand. The red cell is seven point five micrometres across.', ops: [{ clear: 'Example 2: units' }, { write: 'z5', tex: '0.0075 \\times 1000' }, { write: 'z6', tex: `= ${N('7.5\\ \\mu\\text{m}')}`, at: 3.5 }, { box: 'z6', at: 5.5 }] },
    ] },
    { title: 'Example 3: red cells in the body', cues: [
      { say: 'Worked example three. With five million red cells in each cubic millimetre, and five decimetres cubed of blood, how many red cells are in the whole body?', ops: [{ clear: 'Example 3: whole body' }, { write: 'b1', tex: '5.0 \\times 10^6\\ \\text{cells/mm}^3' }, { write: 'b2', tex: '5.0\\ \\text{dm}^3\\ \\text{of blood}', at: 4 }] },
      { say: 'The units must match. One decimetre cubed is one million cubic millimetres, so five decimetres cubed is five times ten to the six cubic millimetres.', ops: [{ clear: 'Example 3: units' }, { write: 'b3', tex: '1\\ \\text{dm}^3 = 10^6\\ \\text{mm}^3' }, { write: 'b4', tex: '5.0\\ \\text{dm}^3 = 5.0 \\times 10^6\\ \\text{mm}^3', at: 4 }] },
      { say: 'Now multiply. Five times ten to the six, times five times ten to the six, is twenty-five times ten to the twelve. In standard form, that is two point five times ten to the thirteen red cells.', ops: [{ write: 'b5', tex: '(5.0 \\times 10^6)^2 = 25 \\times 10^{12}' }, { write: 'b6', tex: `= ${N('2.5 \\times 10^{13}\\ \\text{cells}')}`, at: 5 }, { box: 'b6', at: 8 }] },
    ] },
    { title: 'Back to the rider', cues: [
      { say: 'So what sealed the rider\'s gash? Not air, and salt would only sting and bring germs. Platelets and torn tissue started the chain: thromboplastin, thrombin, fibrin. The fibrin mesh trapped cells and sealed the wound.', ops: [{ clear: 'The verdict' }, { panel: BL, s: { scene: 'clot', stage: 4, labels: 1, focus: null }, fresh: 1 }, { camera: 'wide' }, { write: 'v1', tex: `${F('\\text{thromboplastin}')}\\to${F('\\text{thrombin}')}` }, { write: 'v2', tex: `\\to ${F('\\text{fibrin mesh}')}\\to\\text{seal}`, at: 4.5 }] },
      { say: 'But he had already lost about one point five decimetres cubed of his five point zero. One point five over five point zero, times one hundred, is thirty percent of his blood. That is why he needs red cells by transfusion.', ops: [{ clear: 'What he lost' }, { write: 'v3', tex: '1.5 / 5.0 \\times 100' }, { write: 'v4', tex: `= ${N('30\\%\\ \\text{of his blood}')}`, at: 4.5 }, { box: 'v4', at: 7 }] },
    ] },
    { title: 'Mistakes, summary and your turn', cues: [
      { say: 'Here are the mistakes that cost marks.', ops: [{ clear: 'Common mistakes' }, { panel: null }, { camera: 'wide' }] },
      { say: 'One. Saying serum is the same as plasma. Serum is plasma without the clotting proteins.', ops: [{ write: 'x1', tex: '1.\\ \\text{serum} \\neq \\text{plasma}' }] },
      { say: 'Two. Saying red cells have a nucleus, or mixing up a phagocyte and a lymphocyte. Mature red cells have none.', ops: [{ write: 'x2', tex: '2.\\ \\text{red cell: no nucleus}' }] },
      { say: 'Three. Forgetting the dilution, or leaving out the millimetre to micrometre step.', ops: [{ write: 'x3', tex: '3.\\ \\text{dilution; mm to}\\ \\mu\\text{m}' }] },
      { say: 'Four. Saying air dries the cut. A chain of plasma proteins makes the seal.', ops: [{ write: 'x4', tex: '4.\\ \\text{not air: fibrin}' }] },
      { say: 'To sum up. Blood is plasma plus red cells, white cells and platelets. A chain of plasma proteins turns it solid where it must stop flowing.', ops: [{ clear: 'Summary' }, { write: 's1', tex: `${P('\\text{plasma}')}+${C('\\text{3 kinds of cell}')}` }, { write: 's2', tex: `${F('\\text{thrombin}')}\\to${F('\\text{fibrin}')}\\to\\text{clot}`, at: 4.5 }] },
      { say: 'Your turn. On a micrograph magnified four thousand times, a phagocyte measures forty millimetres across. What is its real diameter in micrometres?', hold: 15, ops: [{ clear: 'Your turn' }, { write: 'y1', tex: '\\text{image} = 40\\ \\text{mm}' }, { write: 'y2', tex: '\\text{magnification} = \\times 4000', at: 3.5 }] },
      { say: 'Image over magnification. Forty over four thousand is point zero one zero millimetres. Times one thousand, that is ten micrometres.', ops: [{ write: 'y3', tex: '40 / 4000 = 0.010\\ \\text{mm}' }, { write: 'y4', tex: `\\times 1000 = ${N('10\\ \\mu\\text{m}')}`, at: 5 }, { box: 'y4', at: 7 }] },
      { say: 'A little bigger than a red cell, as a phagocyte should be, so it makes sense. Well done. Now try the worked questions.', ops: [{ write: 'y5', tex: '\\text{bigger than 7.5 }\\mu\\text{m: sensible}' }] },
    ] },
  ],
};
