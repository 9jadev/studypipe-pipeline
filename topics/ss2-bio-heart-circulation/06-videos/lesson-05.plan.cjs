// Lesson 05 explainer plan: Why Mama Bisi's ankles swell (from 02-lesson.md lesson 05 + § 7, 2026-11-07).
// Direction script rendered from this plan: lesson-05-direction-script.md
// Build + embed: node scripts/apply-video.mjs topics/ss2-bio-heart-circulation --lesson lesson-05
const k = (r, s) => `\\htmlClass{role-${r}}{${s}}`;
const Pc = s => k('P', s), Pi = s => k('pi', s), N = s => k('N', s), L = s => k('L', s);
const CB = 'capillary-bed';

// Normal skeletal-muscle capillary (approximate textbook teaching values): Pc falls evenly 36 -> 16, pi_c flat at 25.
const G1 = { id: 'nfp', x: [0, 1, 0.25], y: [0, 40, 5], xlabel: 'along the capillary', ylabel: 'pressure (mmHg)', items: [
  { id: 'pc', type: 'fn', fn: '36 - 20*x', domain: [0, 1], color: 'P', label: 'Pc (pushes out)', labelAt: [0.4, 38] },
  { id: 'pi', type: 'line', from: [0, 25], to: [1, 25], color: 'pi' },
  { id: 'pilab', type: 'text', at: [0.03, 22.6], text: 'πc (pulls in)', color: 'pi', anchor: 'start', size: 14 },
  { id: 'art', type: 'point', at: [0, 36], color: 'P', label: '+11 out', pos: 'e' },
  { id: 'ven', type: 'point', at: [1, 16], color: 'P', label: '−9 in', pos: 'w' },
  { id: 'cross', type: 'point', at: [0.55, 25], color: 'N', label: 'NFP = 0', pos: 'n' },
  { id: 'outtxt', type: 'text', at: [0.22, 9], text: 'fluid out', color: 'orange', size: 15 },
  { id: 'intxt', type: 'text', at: [0.8, 9], text: 'fluid in', color: 'sky', size: 15 },
] };
// Mama Bisi after hours of standing: venous-end Pc rises to 30, so Pc stays above pi_c all along.
const G2 = { id: 'congest', x: [0, 1, 0.25], y: [0, 40, 5], xlabel: 'along the capillary', ylabel: 'pressure (mmHg)', items: [
  { id: 'pc2', type: 'fn', fn: '36 - 6*x', domain: [0, 1], color: 'P', label: 'Pc (congested)', labelAt: [0.3, 38] },
  { id: 'pi2', type: 'line', from: [0, 25], to: [1, 25], color: 'pi' },
  { id: 'pilab2', type: 'text', at: [0.03, 22.6], text: 'πc (pulls in)', color: 'pi', anchor: 'start', size: 14 },
  { id: 'art2', type: 'point', at: [0, 36], color: 'P', label: '+11 out', pos: 'e' },
  { id: 'ven2', type: 'point', at: [1, 30], color: 'N', label: '+5 still out', pos: 'w' },
  { id: 'none', type: 'text', at: [0.5, 12], text: 'no pull-back zone', color: 'N', size: 15 },
] };

module.exports = {
  meta: {
    title: "Why Mama Bisi's Ankles Swell", subtitle: 'Lesson 05 · Vessels, tissue fluid and lymph', eq: 'NFP = Pc − πc',
    subject: 'Biology', level: 'SS2 · WAEC / NECO / JAMB', next: '#apply', nextLabel: 'Continue to Apply →',
    roles: { P: { color: 'orange', name: 'blood (hydrostatic) pressure' }, pi: { color: 'blue', name: 'osmotic pressure of plasma proteins' }, N: { color: 'green', name: 'net filtration pressure' }, L: { color: 'purple', name: 'lymph' } },
    captionFixes: { 'P c': 'Pc', 'pi c': 'πc', 'N F P': 'NFP' },
  },
  checks: [
    ['flow Q = 2.4 x 35', 2.4 * 35, 84],
    ['Q per minute 84 x 60', 84 * 60, 5040],
    ['5040 cm3/min is about 5.0 dm3/min', 5040 / 1000, 5.04, 0.05],
    ['capillary speed 84 / 2400', 84 / 2400, 0.035, 1e-9],
    ['capillary speed in mm/s', 0.035 * 10, 0.35, 1e-9],
    ['aorta 1000 x faster: 35 / 0.035', 35 / 0.035, 1000, 1e-9],
    ['arterial NFP 36 - 25', 36 - 25, 11],
    ['venous NFP 16 - 25', 16 - 25, -9],
    ['Pc must fall by 36 - 25', 36 - 25, 11],
    ['total fall 36 - 16', 36 - 16, 20],
    ['crossing fraction 11 / 20', 11 / 20, 0.55, 1e-9],
    ['crossing 55 percent', 0.55 * 100, 55],
    ['graph Pc at crossing: 36 - 20 x 0.55', 36 - 20 * 0.55, 25, 1e-9],
    ['congested venous NFP 30 - 25', 30 - 25, 5],
    { name: 'congested Pc stays above pi_c all along', test: () => [0, .25, .5, .75, 1].every(x => 36 - 6 * x > 25) },
    ['graph congested Pc at venous end: 36 - 6', 36 - 6, 30],
    ['lymph left over 20 - 17', 20 - 17, 3],
    ['3 dm3 in cm3', 3 * 1000, 3000],
    ['lymph per hour 3000 / 24', 3000 / 24, 125],
    ['lymph share 3 / 20', 3 / 20 * 100, 15],
    ['your turn NFP 20 - 25', 20 - 25, -5],
  ],
  chapters: [
    { title: "Mama Bisi's ankles", cues: [
      { say: "By evening, Mama Bisi's sandals are tight. Dr Aisha presses a thumb on her ankle, and the dent stays. Mama Bisi has been standing all day.", ops: [{ clear: "Mama Bisi's ankles" }, { panel: CB, s: { labels: 1, cells: 1, proteins: 0, filtration: 0, reabsorption: 0, gauges: 0, lymph: 0, blocked: 0, oedema: 0.5, wall: 0, focus: null }, fresh: 1 }, { write: 'h1', tex: '\\text{swollen ankles by evening}' }] },
      { say: 'Baba Sule says, too much water in the blood. Stop drinking water! Is he right?', ops: [{ write: 'h2', tex: '\\text{Baba Sule: drink less water?}' }] },
      { say: 'By the end of this video you will compare the three blood vessels, explain how fluid leaves and returns, and see why Baba Sule is wrong.', ops: [{ clear: 'By the end of this video' }, { write: 'o1', tex: '\\square\\ \\text{the three vessels}' }, { write: 'o2', tex: '\\square\\ \\text{fluid out and back}', at: 3.5 }, { write: 'o3', tex: '\\square\\ \\text{why ankles swell}', at: 6 }] },
    ] },
    { title: 'Artery, vein or capillary?', cues: [
      { say: 'Arteries carry blood away from the heart. Their thick, elastic, muscular walls take the surge from the ventricle and spring back. That is what you feel as a pulse.', ops: [{ clear: 'Three vessels' }, { panel: CB, s: { oedema: 0, wall: 0 } }, { write: 'a1', tex: '\\text{artery: from the heart}' }, { write: 'a2', tex: '\\text{thick, elastic wall; pulse}', at: 5 }] },
      { say: 'Veins carry blood back to the heart. The wall is thinner, the lumen is wide, the pressure is low, and pocket valves let blood go one way only.', ops: [{ write: 'v1', tex: '\\text{vein: to the heart}' }, { write: 'v2', tex: '\\text{wide lumen; pocket valves}', at: 5 }] },
      { say: 'When you walk, your leg muscles squeeze the veins between them, and the valves push the blood up towards the heart. That is the muscle pump.', ops: [{ clear: 'Back up the leg' }, { write: 'm1', tex: '\\text{muscles squeeze veins}' }, { write: 'm2', tex: '\\text{valves: one way only}', at: 4 }, { write: 'm3', tex: '\\Rightarrow \\text{blood climbs to the heart}', at: 7 }] },
      { say: 'Capillaries join the smallest arteries to the smallest veins. The wall is a single layer of flat cells, and the lumen is about one red cell wide.', ops: [{ clear: 'Capillaries' }, { panel: CB, s: { wall: 1, focus: 'wall' } }, { camera: 'wide', focus: 'wall' }, { write: 'c1', tex: '\\text{wall: one cell thick}' }, { write: 'c2', tex: '\\text{lumen: one red cell wide}', at: 4.5 }] },
      { say: 'That thin wall gives a short path for oxygen and food to cross. And there are so many capillaries that the surface for exchange is huge.', ops: [{ panel: CB, s: { wall: 0, focus: null } }, { camera: 'wide' }, { write: 'c3', tex: '\\text{short path, huge surface}' }, { box: 'c3' }] },
    ] },
    { title: 'Why capillary blood is slow', cues: [
      { say: 'Blood is slowest in the capillaries, and that gives time for exchange. Why? Blood leaves the aorta at thirty-five centimetres per second. The aorta has a cross-section of two point four square centimetres.', ops: [{ clear: 'Why so slow?' }, { camera: 'board' }, { write: 'q1', tex: `\\text{aorta: } A = 2.4\\ \\text{cm}^2,\\ v = 35\\ \\text{cm/s}` }] },
      { say: 'All the capillaries together have a cross-section of about two thousand four hundred square centimetres. Find the speed in the capillaries.', ops: [{ write: 'q2', tex: `\\text{capillaries: } A = 2400\\ \\text{cm}^2` }, { write: 'q3', tex: '\\text{find } v', at: 4.5 }] },
      { say: 'Step one. The flow is area times speed. Two point four times thirty-five is eighty-four centimetres cubed per second.', ops: [{ clear: 'Flow = area x speed' }, { write: 'f1', tex: 'Q = A \\times v' }, { write: 'f2', tex: '\\phantom{Q} = 2.4 \\times 35', at: 3 }, { write: 'f3', tex: '\\phantom{Q} = 84\\ \\text{cm}^3\\text{/s}', at: 5.5 }] },
      { say: 'Does that make sense? Eighty-four times sixty is five thousand and forty centimetres cubed a minute, about five point zero decimetres cubed. That is a resting cardiac output.', ops: [{ write: 'f4', tex: '84 \\times 60 = 5040\\ \\text{cm}^3\\text{/min}', note: 'about 5.0 dm³' }] },
      { say: 'Step two. The same flow runs through the capillaries. So speed equals flow over area, eighty-four over two thousand four hundred.', ops: [{ clear: 'Speed in capillaries' }, { write: 'g1', tex: 'v = Q / A' }, { write: 'g2', tex: '\\phantom{v} = 84 / 2400', at: 3.5 }, { write: 'g3', tex: `\\phantom{v} = 0.035\\ \\text{cm/s}`, at: 6 }, { box: 'g3' }] },
      { say: 'That is zero point three five millimetres per second. Thirty-five divided by zero point zero three five is one thousand, so the aorta blood is a thousand times faster.', ops: [{ write: 'g4', tex: '35 / 0.035 = 1000', note: 'times slower' }] },
      { say: 'The reason is area. The same flow spread over a far larger total area must move far more slowly. Slow blood has time to swap oxygen and food with the cells.', ops: [{ clear: 'The big idea' }, { write: 'b1', tex: '\\text{same flow, bigger area}' }, { write: 'b2', tex: '\\Rightarrow \\text{slower blood}', at: 3.5 }, { box: 'b2' }] },
    ] },
    { title: 'Pushing fluid out', cues: [
      { say: 'Now to the fluid. Blood pressure inside the capillary is called P c, and it pushes fluid out through the thin wall. The numbers here are approximate textbook teaching values for a muscle capillary.', ops: [{ clear: 'Pushing out' }, { camera: 'wide' }, { panel: CB, s: { labels: 1, cells: 1, proteins: 0, filtration: 0, reabsorption: 0, pcA: 36, pcV: 16, pi: 25, gauges: 1, lymph: 0, blocked: 0, oedema: 0, wall: 0, focus: 'arterial' }, fresh: 1 }, { camera: 'wide', focus: 'arterial', at: 1 }, { write: 'p1', tex: `${Pc('P_c')}:\\ \\text{pushes out}` }, { hl: ['P'] }] },
      { say: 'At the arterial end, P c is thirty-six millimetres of mercury. It squeezes out water, oxygen, glucose, amino acids and salts.', ops: [{ panel: CB, s: { filtration: 1 } }, { write: 'p2', tex: `\\text{arterial end: } ${Pc('P_c = 36\\ \\text{mmHg}')}` }] },
      { say: 'Red cells and large proteins are too big to leave. They stay inside.', ops: [{ panel: CB, s: { proteins: 1 } }, { write: 'p3', tex: '\\text{cells, big proteins stay in}' }] },
      { say: 'The fluid that gets out is tissue fluid. It is plasma without the red cells and the big proteins. Cells take what they need and add carbon dioxide and wastes.', ops: [{ write: 'p4', tex: '\\text{tissue fluid = plasma}', note: 'no cells, proteins' }, { box: 'p4' }] },
    ] },
    { title: 'Pulling fluid back', cues: [
      { say: 'The proteins left inside pull water back by osmosis. This osmotic pressure is pi c, and it stays at twenty-five millimetres of mercury all along the capillary.', ops: [{ clear: 'Pulling back' }, { panel: CB, s: { focus: 'venous' } }, { camera: 'wide', focus: 'venous' }, { write: 'q4', tex: `${Pi('\\pi_c')}:\\ \\text{pulls in}` }, { hl: ['pi'] }, { write: 'q5', tex: `${Pi('\\pi_c = 25\\ \\text{mmHg}')}`, note: 'all along', at: 4 }] },
      { say: 'Meanwhile blood pressure falls as blood flows along. At the venous end, P c is down to sixteen. Now the pull beats the push, and most of the fluid goes back in.', ops: [{ panel: CB, s: { reabsorption: 1 } }, { write: 'q6', tex: `\\text{venous end: } ${Pc('P_c = 16\\ \\text{mmHg}')}`, at: 3 }] },
    ] },
    { title: 'Net filtration pressure', cues: [
      { say: 'Think of a tug of war. Net filtration pressure, N F P, is the push minus the pull. Positive means fluid moves out, and negative means in.', ops: [{ clear: 'Tug of war' }, { camera: 'wide' }, { panel: 'graph', s: { spec: G1, show: [] }, fresh: 1 }, { write: 'n1', tex: `${N('\\text{NFP}')} = ${Pc('P_c')} - ${Pi('\\pi_c')}` }, { box: 'n1' }, { hl: ['N'] }] },
      { say: 'At the arterial end, thirty-six minus twenty-five is plus eleven. Fluid moves out.', ops: [{ write: 'n2', tex: `\\text{arterial: } 36 - 25 = ${N('+11')}`, note: 'out' }, { panel: 'graph', s: { show: ['pc', 'pi', 'pilab', 'art'] } }] },
      { say: 'At the venous end, sixteen minus twenty-five is minus nine. Fluid moves in.', ops: [{ write: 'n3', tex: `\\text{venous: } 16 - 25 = ${N('-9')}`, note: 'in' }, { panel: 'graph', s: { show: ['pc', 'pi', 'pilab', 'art', 'ven'] } }] },
      { say: 'Somewhere between, the push equals the pull. How far along is that? P c must fall from thirty-six to twenty-five, a fall of eleven.', ops: [{ clear: 'Where is NFP zero?' }, { write: 'z1', tex: `${Pc('P_c')}\\ \\text{falls } 36 \\to 25: 11` }] },
      { say: 'The whole fall along the capillary is thirty-six minus sixteen, which is twenty. So eleven over twenty is zero point five five.', ops: [{ write: 'z2', tex: '\\text{whole fall: } 36 - 16 = 20' }, { write: 'z3', tex: '11 / 20 = 0.55', at: 4 }] },
      { say: 'Filtration turns into reabsorption fifty-five percent of the way along. On the graph, that is where the two lines cross.', ops: [{ panel: 'graph', s: { show: ['pc', 'pi', 'pilab', 'art', 'ven', 'cross', 'outtxt', 'intxt'], pulse: 'cross' } }, { camera: 'wide', focus: ['cross'] }, { write: 'z4', tex: `${N('\\text{NFP} = 0')}\\ \\text{at 55\\%}` }, { box: 'z4' }] },
    ] },
    { title: 'The lymph mops up', cues: [
      { say: 'Not all the fluid comes back into the capillary. The rest drains into lymph capillaries, which are closed at one end and have one-way valves.', ops: [{ clear: 'The lymph' }, { camera: 'wide' }, { panel: CB, s: { labels: 1, cells: 1, proteins: 1, filtration: 1, reabsorption: 1, pcA: 36, pcV: 16, pi: 25, gauges: 0, lymph: 1, blocked: 0, oedema: 0, wall: 0, focus: 'lymph' }, fresh: 1 }, { camera: 'wide', focus: 'lymph', at: 1 }, { write: 'l1', tex: '\\text{lymph capillary: closed end}', note: 'one-way valves' }] },
      { say: 'Once inside, the fluid is called lymph. It has no pump. Moving muscles and breathing squeeze it along, and valves stop it flowing back.', ops: [{ write: 'l2', tex: `\\text{inside: } ${L('\\text{lymph}')}` }, { write: 'l3', tex: '\\text{muscles + valves move it}', at: 4.5 }] },
      { say: 'Lymph passes through lymph nodes, which filter out germs. Then it joins the blood again through the thoracic duct or the right lymphatic duct, into veins near the neck.', ops: [{ panel: CB, s: { focus: null } }, { camera: 'wide' }, { write: 'l4', tex: '\\to \\text{nodes: filter germs}' }, { write: 'l5', tex: '\\to \\text{ducts} \\to \\text{subclavian veins}', at: 4.5 }] },
      { say: 'How much lymph is that? Suppose twenty decimetres cubed is filtered in a day and seventeen is reabsorbed. These are approximate textbook values. Twenty minus seventeen leaves three.', ops: [{ clear: 'How much lymph?' }, { camera: 'board' }, { write: 'x1', tex: '20 - 17 = 3\\ \\text{dm}^3\\text{/day}' }] },
      { say: 'Three decimetres cubed is three thousand centimetres cubed. Divide by twenty-four hours, and the lymph flow is one hundred and twenty-five centimetres cubed an hour. About fifteen percent of what was filtered.', ops: [{ write: 'x2', tex: '3\\ \\text{dm}^3 = 3000\\ \\text{cm}^3' }, { write: 'x3', tex: `3000 / 24 = ${L('125\\ \\text{cm}^3\\text{/h}')}`, at: 4.5 }, { box: 'x3' }, { hl: ['L'] }] },
    ] },
    { title: 'Back to Mama Bisi', cues: [
      { say: 'Back to Mama Bisi. After hours of standing, with leaky valves in her veins, blood pools in her lower legs. The pressure at the venous end of her ankle capillaries rises to thirty.', ops: [{ clear: 'Mama Bisi, standing' }, { camera: 'wide' }, { panel: CB, s: { labels: 1, cells: 1, proteins: 1, filtration: 1, reabsorption: 1, pcA: 36, pcV: 30, pi: 25, gauges: 1, lymph: 1, blocked: 0, oedema: 0, wall: 0, focus: 'venous' }, fresh: 1 }, { camera: 'wide', focus: 'venous', at: 1 }, { write: 'w1', tex: `\\text{venous end: } ${Pc('P_c = 30\\ \\text{mmHg}')}` }] },
      { say: 'Arterial end, thirty-six minus twenty-five is plus eleven, out. Venous end, thirty minus twenty-five is plus five. Still out.', ops: [{ panel: 'graph', s: { spec: G2, show: ['pc2', 'pi2', 'pilab2', 'art2', 'ven2'] }, fresh: 1 }, { camera: 'wide' }, { write: 'w2', tex: `36 - 25 = ${N('+11')}\\ \\text{(out)}` }, { write: 'w3', tex: `30 - 25 = ${N('+5')}\\ \\text{(still out)}`, at: 4 }] },
      { say: 'N F P is positive all along the capillary. There is no reabsorption zone at all, and the lymph cannot carry away so much extra fluid.', ops: [{ write: 'w4', tex: `${N('\\text{NFP}')} > 0\\ \\text{all along}` }, { box: 'w4' }] },
      { say: 'So fluid collects in the tissues. That is oedema, and it is why the thumb leaves a dent.', ops: [{ panel: CB, s: { oedema: 1 } }, { write: 'w5', tex: '\\Rightarrow \\text{oedema}' }] },
      { say: 'Drinking water was not the cause, so Baba Sule is wrong. Raise the feet, walk about to work the muscle pump, and have her high blood pressure treated.', ops: [{ clear: 'The verdict' }, { panel: CB, s: { oedema: 0, focus: null } }, { camera: 'wide' }, { write: 'r1', tex: '\\text{water is not the cause}' }, { write: 'r2', tex: '\\text{raise feet; walk; muscle pump}', at: 4.5 }] },
      { say: 'Other causes are possible too. Too little plasma protein makes pi c small, so little fluid is pulled back, and swelling follows. Blocked lymph vessels, from filarial worms, cause elephantiasis.', ops: [{ clear: 'Other oedema' }, { panel: CB, s: { pcV: 16, pi: 12, oedema: 0.8, focus: 'venous' } }, { camera: 'wide', focus: 'venous', at: 1 }, { write: 'u1', tex: `\\text{low protein: small } ${Pi('\\pi_c')}` }, { write: 'u2', tex: '\\text{blocked lymph: elephantiasis}', at: 5 }] },
    ] },
    { title: 'Mistakes, summary and your turn', cues: [
      { say: 'Here are the mistakes that cost marks.', ops: [{ clear: 'Common mistakes' }, { panel: null }, { camera: 'wide' }] },
      { say: 'One. Saying tissue fluid has red cells. It does not. They stay in the capillary.', ops: [{ write: 'e1', tex: '\\text{1. no red cells in tissue fluid}' }] },
      { say: 'Two. Mixing up the pressures. Blood pressure pushes out. Protein osmotic pressure pulls in.', ops: [{ write: 'e2', tex: `\\text{2. } ${Pc('P_c')}\\ \\text{out},\\ ${Pi('\\pi_c')}\\ \\text{in}` }] },
      { say: 'Three. Thinking veins are always blue and carry only oxygen-poor blood. Oxygen-poor blood is dark red, and the pulmonary vein carries oxygen-rich blood.', ops: [{ write: 'e3', tex: '\\text{3. pulmonary vein: oxygen-rich}' }] },
      { say: 'To sum up. Tissue fluid forms where blood pressure beats protein pull, and returns where it does not.', ops: [{ clear: 'Summary' }, { write: 's1', tex: `${N('\\text{NFP}')} = ${Pc('P_c')} - ${Pi('\\pi_c')}`, note: 'out, then in' }] },
      { say: 'Lymph mops up the rest. And the same flow through a far larger area means slow blood in the capillaries.', ops: [{ write: 's2', tex: `${L('\\text{lymph}')}\\ \\text{mops up the rest}` }, { write: 's3', tex: 'v = Q / A', note: 'big A, slow v', at: 4 }] },
      { say: 'Your turn. At one point in a capillary, P c is twenty millimetres of mercury and pi c is twenty-five. Find N F P, and say which way the fluid moves.', hold: 15, ops: [{ clear: 'Your turn' }, { write: 'y1', tex: `${Pc('P_c = 20')},\\ ${Pi('\\pi_c = 25')}` }, { write: 'y2', tex: '\\text{NFP? which way?}', at: 5 }] },
      { say: 'Twenty minus twenty-five is minus five. Negative means the fluid moves in, so this point is near the venous end. Well done. Now try the worked examples.', ops: [{ write: 'y3', tex: `20 - 25 = ${N('-5')}\\ \\text{(in)}` }, { box: 'y3' }] },
    ] },
  ],
};
