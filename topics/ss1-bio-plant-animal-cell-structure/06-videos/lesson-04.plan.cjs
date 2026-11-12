// Lesson 04 explainer plan: Which way does the water go? (from the approved direction script, 2026-11-07).
// Build + embed: node scripts/apply-video.mjs topics/ss1-bio-plant-animal-cell-structure --lesson lesson-04
const k = (r, s) => `\\htmlClass{role-${r}}{${s}}`;
const W = s => k('water', s), S = s => k('solute', s), A = s => k('atp', s), G = s => k('gain', s), Lo = s => k('loss', s), I = s => k('iso', s);
const M = 'membrane-transport';
const T = s => `\\text{${s.replace(/%/g, '\\%')}}`;

// Smooth monotone curve (Fritsch-Carlson / PCHIP) passing exactly through the six bench points; it crosses 0 at about 0.337.
const CURVE_EXPR = '(x<0.2?(14*(2*((x-0)/0.2)*((x-0)/0.2)*((x-0)/0.2)-3*((x-0)/0.2)*((x-0)/0.2)+1)+-10.40000*(((x-0)/0.2)*((x-0)/0.2)*((x-0)/0.2)-2*((x-0)/0.2)*((x-0)/0.2)+((x-0)/0.2))+4.8*(-2*((x-0)/0.2)*((x-0)/0.2)*((x-0)/0.2)+3*((x-0)/0.2)*((x-0)/0.2))+-7.82000*(((x-0)/0.2)*((x-0)/0.2)*((x-0)/0.2)-((x-0)/0.2)*((x-0)/0.2))):(x<0.4?(4.8*(2*((x-0.2)/0.2)*((x-0.2)/0.2)*((x-0.2)/0.2)-3*((x-0.2)/0.2)*((x-0.2)/0.2)+1)+-7.82000*(((x-0.2)/0.2)*((x-0.2)/0.2)*((x-0.2)/0.2)-2*((x-0.2)/0.2)*((x-0.2)/0.2)+((x-0.2)/0.2))+-2*(-2*((x-0.2)/0.2)*((x-0.2)/0.2)*((x-0.2)/0.2)+3*((x-0.2)/0.2)*((x-0.2)/0.2))+-6.37500*(((x-0.2)/0.2)*((x-0.2)/0.2)*((x-0.2)/0.2)-((x-0.2)/0.2)*((x-0.2)/0.2))):(x<0.6?(-2*(2*((x-0.4)/0.2)*((x-0.4)/0.2)*((x-0.4)/0.2)-3*((x-0.4)/0.2)*((x-0.4)/0.2)+1)+-6.37500*(((x-0.4)/0.2)*((x-0.4)/0.2)*((x-0.4)/0.2)-2*((x-0.4)/0.2)*((x-0.4)/0.2)+((x-0.4)/0.2))+-8*(-2*((x-0.4)/0.2)*((x-0.4)/0.2)*((x-0.4)/0.2)+3*((x-0.4)/0.2)*((x-0.4)/0.2))+-4.94118*(((x-0.4)/0.2)*((x-0.4)/0.2)*((x-0.4)/0.2)-((x-0.4)/0.2)*((x-0.4)/0.2))):(x<0.8?(-8*(2*((x-0.6)/0.2)*((x-0.6)/0.2)*((x-0.6)/0.2)-3*((x-0.6)/0.2)*((x-0.6)/0.2)+1)+-4.94118*(((x-0.6)/0.2)*((x-0.6)/0.2)*((x-0.6)/0.2)-2*((x-0.6)/0.2)*((x-0.6)/0.2)+((x-0.6)/0.2))+-12.2*(-2*((x-0.6)/0.2)*((x-0.6)/0.2)*((x-0.6)/0.2)+3*((x-0.6)/0.2)*((x-0.6)/0.2))+-4.24941*(((x-0.6)/0.2)*((x-0.6)/0.2)*((x-0.6)/0.2)-((x-0.6)/0.2)*((x-0.6)/0.2))):(-12.2*(2*((x-0.8)/0.2)*((x-0.8)/0.2)*((x-0.8)/0.2)-3*((x-0.8)/0.2)*((x-0.8)/0.2)+1)+-4.24941*(((x-0.8)/0.2)*((x-0.8)/0.2)*((x-0.8)/0.2)-2*((x-0.8)/0.2)*((x-0.8)/0.2)+((x-0.8)/0.2))+-16.5*(-2*((x-0.8)/0.2)*((x-0.8)/0.2)*((x-0.8)/0.2)+3*((x-0.8)/0.2)*((x-0.8)/0.2))+-4.35000*(((x-0.8)/0.2)*((x-0.8)/0.2)*((x-0.8)/0.2)-((x-0.8)/0.2)*((x-0.8)/0.2)))))))';
const CURVE = new Function('x', 'return ' + CURVE_EXPR);
const GP = { id: 'iso', x: [0, 1, 0.2], y: [-20, 20, 5], xlabel: 'sucrose (mol/dm³)', ylabel: '% change in mass', items: [
  { id: 'zero', type: 'line', from: [0, 0], to: [1, 0], color: 'purple' },
  { id: 'pts', type: 'points', pts: [[0, 14.0], [0.2, 4.8], [0.4, -2.0], [0.6, -8.0], [0.8, -12.2], [1.0, -16.5]], color: 'sky', pos: 'ne' },
  { id: 'curve', type: 'fn', fn: CURVE_EXPR, domain: [0, 1], color: 'amber', width: 3 },
  { id: 'gain', type: 'text', at: [0.62, 13], text: 'gained water', color: 'green', size: 15 },
  { id: 'lose', type: 'text', at: [0.2, -12], text: 'lost water', color: 'red', size: 15 },
  { id: 'a', type: 'point', at: [0.2, 4.8], color: 'green', label: '+4.8', pos: 'ne' },
  { id: 'b', type: 'point', at: [0.4, -2.0], color: 'red', label: '−2.0', pos: 'ne' },
  { id: 'cross', type: 'point', at: [0.337, 0], color: 'purple', label: 'isotonic', pos: 'nw' },
  { id: 'cg', type: 'guide', at: [0.337, 0], color: 'purple' },
] };
const all = ['zero', 'pts', 'curve', 'gain', 'lose'];

module.exports = {
  meta: {
    title: 'Which Way Does the Water Go?', subtitle: 'Lesson 04 · Diffusion, osmosis and active transport', eq: '% change = (final − initial) / initial × 100',
    subject: 'Biology', level: 'SS1 · WAEC / NECO / JAMB', next: '#apply', nextLabel: 'Continue to Apply →',
    roles: {
      water: { color: 'sky', name: 'water' }, solute: { color: 'amber', name: 'sugar / salt' }, atp: { color: 'gold', name: 'ATP energy' },
      gain: { color: 'green', name: 'gain, water in' }, loss: { color: 'red', name: 'loss, water out' }, iso: { color: 'purple', name: 'isotonic' },
    },
    captionFixes: { 'A T P': 'ATP', 'zero point nine percent': '0.9%' },
  },
  checks: [
    ['0.0 tube change 2.85 − 2.50', 2.85 - 2.50, 0.35, 1e-9],
    ['0.0 tube % change', (0.35 / 2.50) * 100, 14.0, 1e-9],
    ['0.6 tube change 2.30 − 2.50', 2.30 - 2.50, -0.20, 1e-9],
    ['0.6 tube % change', (-0.20 / 2.50) * 100, -8.0, 1e-9],
    { name: 'table rows on the graph (to 1 d.p.)', approx: [[(0.12 / 2.48) * 100, 4.8, 1], [(-0.05 / 2.52) * 100, -2.0, 1], [(-0.30 / 2.46) * 100, -12.2, 1], [(-0.42 / 2.54) * 100, -16.5, 1]] },
    ['gap 4.8 + 2.0', 4.8 + 2.0, 6.8, 1e-9],
    { name: 'fraction 4.8 / 6.8 = 0.71', approx: [[4.8 / 6.8, 0.71, 2]] },
    { name: 'isotonic 0.2 + 0.71 × 0.2 = 0.34', approx: [[0.2 + 0.71 * 0.2, 0.34, 2]] },
    { name: 'curve passes through all six points', test: () => [[0, 14.0], [0.2, 4.8], [0.4, -2.0], [0.6, -8.0], [0.8, -12.2], [1.0, -16.5]].every(([x, y]) => Math.abs(CURVE(x) - y) < 0.01) },
    { name: 'curve crosses zero between 0.335 and 0.34 (about 0.34)', test: () => CURVE(0.335) > 0 && CURVE(0.34) < 0 },
    { name: 'curve and the estimate agree to 0.02', test: () => Math.abs(0.337 - (0.2 + 0.71 * 0.2)) < 0.02 },
    ['saline in 500 cm³: 0.9 × 500 / 100', (0.9 * 500) / 100, 4.5, 1e-9],
    { name: 'wrong divisor 0.35 / 2.85 × 100 = 12.3', approx: [[(0.35 / 2.85) * 100, 12.3, 1]] },
    ['your turn change 2.10 − 2.40', 2.10 - 2.40, -0.30, 1e-9],
    ['your turn % change', (-0.30 / 2.40) * 100, -12.5, 1e-9],
  ],
  chapters: [
    { title: 'The limp ugu and the drip', cues: [
      { say: "At Mile 12 Market, Mama Ngozi's nephew washed her ugu in salty water to chase flies. One hour later, the leaves were limp.", ops: [{ clear: 'The limp ugu' }, { panel: M, s: { scene: 'cells', plant: 1, rbc: 0, solution: 'iso', progress: 1, labels: 0, terms: 0, arrows: 0, focus: null }, fresh: 1 }, { write: 'h1', tex: T('ugu in salty water') }, { write: 'h2', tex: T('one hour: limp') }] },
      { say: 'Coach Danjuma was sure. The salt soaked into the leaves and made them heavy. Keep that idea in mind. We will test it.', ops: [{ write: 'h3', tex: T('Coach: "salt soaked in"?') }] },
      { say: 'That same evening at LUTH, Dr Amaka refused to drip plain water into a thirsty patient. She asked for zero point nine percent saline.', ops: [{ write: 'h4', tex: `${T('drip: water')}\\ ${Lo('\\times')}` }, { write: 'h5', tex: `${T('drip: 0.9% saline')}\\ ${G('\\checkmark')}`, at: 4 }] },
      { say: 'By the end of this video, you will explain both, and you will calculate the percentage change in mass of a potato strip.', ops: [{ clear: 'By the end of this video' }, { write: 'o1', tex: `\\square\\ ${T('3 ways in and out')}` }, { write: 'o2', tex: `\\square\\ ${T('cells in 3 solutions')}`, at: 3 }, { write: 'o3', tex: `\\square\\ ${T('% change, isotonic point')}`, at: 5 }] },
    ] },
    { title: 'Diffusion: spreading out', cues: [
      { say: 'Start with something you already know. Fry akara in the kitchen, and soon the whole house can smell it.', ops: [{ clear: 'Diffusion' }, { panel: M, s: { scene: 'membrane', mode: 'diffusion', spread: 0, flow: 0, arrows: 0, labels: 1, pump: 0, level: 0, focus: null }, fresh: 1 }, { camera: 'wide' }, { write: 'd1', tex: T('akara smell fills the house') }] },
      { say: 'The smell particles move from where they are crowded to where they are fewer.', ops: [{ panel: M, s: { flow: 1, spread: 0.6, arrows: 1 } }, { write: 'd2', tex: `${T('crowded')} \\to ${T('fewer')}` }] },
      { say: 'They keep spreading until they are evenly spread. That overall spreading is called diffusion.', ops: [{ panel: M, s: { spread: 1, arrows: 0 } }, { write: 'd3', tex: `${T('diffusion: crowded')} \\to ${T('fewer')}` }, { write: 'd4', tex: T('until evenly spread'), at: 3 }, { box: 'd3' }, { box: 'd4' }] },
      { say: 'Oxygen enters a cheek cell this way, and carbon dioxide leaves a leaf cell this way. No energy is needed.', ops: [{ write: 'd5', tex: `\\text{e.g. } \\text{O}_2 ${T('into cells')}` }, { write: 'd6', tex: T('no energy needed'), at: 3 }] },
    ] },
    { title: 'Osmosis: water on the move', cues: [
      { say: 'Now put a membrane in the middle. On the left, a dilute solution. On the right, a concentrated sugar solution.', ops: [{ clear: 'Osmosis' }, { panel: M, s: { mode: 'osmosis', level: 0, flow: 0, arrows: 0, labels: 1 } }, { camera: 'wide' }, { write: 'o1', tex: `${T('left: dilute')}` }, { write: 'o2', tex: `${T('right: concentrated')}\\ ${S('\\text{sugar}')}`, at: 3 }] },
      { say: 'Look closely at a pore. The small water molecules slip through. The big sugar molecules cannot.', ops: [{ panel: M, s: { flow: 1 } }, { camera: 'wide', focus: 'pore' }, { write: 'o3', tex: `${W('\\text{water}')}\\ ${T('passes through')}` }, { write: 'o4', tex: `${S('\\text{sugar}')}\\ ${T('is blocked')}`, at: 3 }] },
      { say: 'We call this membrane selectively permeable. It lets some molecules through and stops others.', ops: [{ camera: 'wide' }, { write: 'o5', tex: T('selectively permeable') }, { box: 'o5' }] },
      { say: 'Water crosses both ways, but more water crosses from the dilute side to the concentrated side. Watch the level rise.', ops: [{ clear: 'Net movement' }, { panel: M, s: { arrows: 1, level: 1 } }, { write: 'n1', tex: `${W('\\text{water}')}${T(': both ways')}` }, { write: 'n2', tex: `${T('more: dilute')} \\to ${T('concentrated')}`, at: 3 }] },
      { say: 'That is osmosis. Water moves across a selectively permeable membrane, from a dilute solution to a concentrated one.', ops: [{ clear: 'Osmosis is...' }, { write: 'm1', tex: `${W('\\text{osmosis}')}${T(': movement of')}\\ ${W('\\text{water}')}` }, { write: 'm2', tex: T('across a selectively'), at: 3 }, { write: 'm3', tex: T('permeable membrane,'), at: 4.5 }, { write: 'm4', tex: `${T('dilute')}\\to${T('concentrated')}`, at: 6 }, { box: 'm1' }, { box: 'm4' }] },
      { say: 'Notice what moved. Water. The sugar stayed where it was. So, Coach, salt does not soak in. Water comes out.', ops: [{ write: 'm5', tex: `${W('\\text{water}')}\\ ${T('moves, not')}\\ ${S('\\text{salt}')}` }, { box: 'm5' }, { hl: ['water', 'solute'] }] },
    ] },
    { title: 'Active transport: pumping uphill', cues: [
      { say: 'Sometimes a cell needs something that is already more plentiful inside than outside. Like root hairs taking in mineral ions from dilute soil water.', ops: [{ clear: 'Active transport' }, { panel: M, s: { mode: 'active', pump: 0, arrows: 0, labels: 1, flow: 1 } }, { camera: 'wide' }, { write: 'a1', tex: T('root hair: ions in') }, { write: 'a2', tex: T('few outside, many inside'), at: 3 }] },
      { say: 'Diffusion would carry the ions the wrong way. So the cell pumps them in, through a carrier in the membrane.', ops: [{ panel: M, s: { pump: 1, arrows: 1 } }, { camera: 'wide', focus: 'pump' }, { write: 'a3', tex: T('carrier pumps them in') }] },
      { say: 'Every pump costs energy, as A T P from respiration. That is active transport: from scarce to plentiful, using energy.', ops: [{ camera: 'wide' }, { write: 'a4', tex: `${T('active transport:')}` }, { write: 'a5', tex: `${T('scarce')}\\to${T('plentiful')}`, at: 3 }, { write: 'a6', tex: `${T('uses')}\\ ${A('\\text{ATP}')}`, at: 4.5 }, { box: 'a5' }, { box: 'a6' }] },
      { say: 'Stop respiration, and the pump stops at once. Diffusion and osmosis would carry on, because they need no energy.', ops: [{ panel: M, s: { pump: 0, arrows: 0 } }, { write: 'a7', tex: `${T('no respiration')}\\to${T('no')}\\ ${A('\\text{ATP}')}` }, { write: 'a8', tex: `\\to ${T('no pumping')}`, at: 3 }] },
    ] },
    { title: 'Two cells, three solutions', cues: [
      { say: 'Now the real question. What happens to a whole cell in different solutions? Here is a plant cell, and here is a red blood cell.', ops: [{ clear: 'Cells in solutions' }, { panel: M, s: { scene: 'cells', plant: 1, rbc: 1, solution: 'iso', progress: 1, labels: 1, terms: 0, arrows: 0 }, fresh: 1 }, { camera: 'wide' }, { write: 'c1', tex: T('plant cell, red cell') }] },
      { say: 'Spot the difference. The plant cell has a stiff cellulose wall around its membrane. The red cell has only a membrane.', ops: [{ camera: 'wide', focus: 'wall' }, { write: 'c2', tex: T('plant: wall + membrane') }, { write: 'c3', tex: T('red cell: membrane only'), at: 3.5 }] },
      { say: 'First, pure water. It is more dilute than the cell contents, so we call it hypotonic. Water rushes into both cells.', ops: [{ clear: 'Hypotonic' }, { camera: 'wide' }, { panel: M, s: { solution: 'hypo', progress: 0.5, arrows: 1, terms: 0 } }, { write: 'p1', tex: `${T('hypotonic:')}\\ ${W('\\text{water in}')}` }] },
      { say: 'The plant cell swells until its membrane presses on the wall. The wall holds it. The cell is firm, or turgid. It does not burst.', ops: [{ panel: M, s: { progress: 0.7, terms: 1 } }, { camera: 'wide', focus: 'plant' }, { write: 'p2', tex: T('plant cell: turgid') }, { write: 'p3', tex: T('wall: it does not burst'), at: 3.5 }] },
      { say: 'The red cell has no wall to hold it. It swells and swells, and bursts. That is haemolysis.', ops: [{ panel: M, s: { progress: 1 } }, { camera: 'wide', focus: 'rbc' }, { write: 'p4', tex: T('red cell: bursts') }, { write: 'p5', tex: T('(haemolysis)'), at: 3 }, { box: 'p4' }] },
      { say: 'Next, a solution with the same concentration as the cells. It is isotonic. Water goes in and out equally, so there is no net change.', ops: [{ clear: 'Isotonic' }, { camera: 'wide' }, { panel: M, s: { solution: 'iso', progress: 1, arrows: 1, terms: 0 } }, { write: 'i1', tex: `${I('\\text{isotonic}')}${T(': same concentration')}` }, { write: 'i2', tex: T('water in = water out'), at: 3.5 }] },
      { say: 'The plant cell stays flaccid, neither firm nor shrunken. The red cell keeps its normal disc shape.', ops: [{ panel: M, s: { terms: 1 } }, { write: 'i3', tex: T('plant cell: flaccid') }, { write: 'i4', tex: T('red cell: normal'), at: 3 }] },
      { say: 'Last, a very salty solution, more concentrated than the cells. It is hypertonic. Now water leaves both cells by osmosis.', ops: [{ clear: 'Hypertonic' }, { panel: M, s: { solution: 'hyper', progress: 0.5, arrows: 1, terms: 0 } }, { write: 'y1', tex: `${T('hypertonic:')}\\ ${W('\\text{water out}')}` }] },
      { say: 'In the plant cell, the vacuole shrinks and the membrane pulls away from the wall. The cell is plasmolysed.', ops: [{ panel: M, s: { progress: 1, terms: 1 } }, { camera: 'wide', focus: 'wall' }, { write: 'y2', tex: T('membrane pulls from wall') }, { write: 'y3', tex: T('plant cell: plasmolysed'), at: 3 }, { box: 'y3' }] },
      { say: 'The red cell shrinks and its edge wrinkles. That is crenation. Never call a red cell plasmolysed; it has no wall to pull away from.', ops: [{ camera: 'wide', focus: 'rbc' }, { write: 'y4', tex: T('red cell: crenated') }, { write: 'y5', tex: `${Lo('\\text{not}')}\\ ${T('plasmolysed')}`, at: 3.5 }, { box: 'y4' }] },
    ] },
    { title: 'Measuring osmosis with a potato', cues: [
      { say: 'We cannot weigh one cell, but we can weigh millions of them together, in a potato strip. Remember your bench.', ops: [{ clear: '% change in mass' }, { camera: 'wide' }, { panel: M, s: { scene: 'strip', conc: 0.0, mass: 2.50, change: 0, onBalance: 1, arrows: 0, labels: 1 }, fresh: 1 }, { write: 's1', tex: T('potato strip, bench') }] },
      { say: 'The strip in pure water started at two point five zero grams. After thirty minutes, it weighed two point eight five grams.', ops: [{ panel: M, s: { onBalance: 0, change: 14, arrows: 1, conc: 0.0 } }, { panel: M, s: { mass: 2.85 }, at: 3 }, { write: 's2', tex: '0.0\\ \\text{mol/dm}^3' }, { write: 's3', tex: `2.50\\ \\text{g} \\to 2.85\\ \\text{g}`, at: 3.5 }] },
      { say: 'Strips start at slightly different masses, so we compare them with percentage change. Final minus initial, over initial, times one hundred.', ops: [{ clear: 'The formula' }, { camera: 'board' }, { write: 'f1', tex: `\\%\\ T{}`.replace('T{}', '\\text{change}') }, { write: 'f2', tex: '= \\dfrac{\\text{final} - \\text{initial}}{\\text{initial}} \\times 100', at: 2.5 }, { box: 'f2' }] },
      { say: 'Step one. Two point eight five minus two point five zero is plus zero point three five grams.', ops: [{ write: 'f3', tex: `2.85 - 2.50 = ${G('+0.35\\ \\text{g}')}` }] },
      { say: 'Step two. Zero point three five over two point five zero, times one hundred, is plus fourteen point zero percent.', ops: [{ write: 'f4', tex: `\\dfrac{0.35}{2.50} \\times 100 = ${G('+14.0\\%')}` }, { box: 'f4' }] },
      { say: 'Plus means it gained water. Pure water is hypotonic, so water entered the cells by osmosis.', ops: [{ camera: 'wide' }, { write: 'f5', tex: `${G('+')}\\to ${W('\\text{water in}')}` }, { write: 'f6', tex: T('(hypotonic)'), at: 3 }] },
      { say: 'In the zero point six tube, a strip went from two point five zero to two point three zero grams. Change, minus zero point two zero grams.', ops: [{ clear: '0.6 mol/dm³ tube' }, { panel: M, s: { conc: 0.6, mass: 2.30, change: -8, arrows: 1 } }, { write: 'g1', tex: `2.50\\ \\text{g} \\to 2.30\\ \\text{g}` }, { write: 'g2', tex: `2.30 - 2.50 = ${Lo('-0.20\\ \\text{g}')}`, at: 3 }] },
      { say: 'Minus zero point two zero over two point five zero, times one hundred, is minus eight point zero percent. Water left. The cells plasmolysed.', ops: [{ write: 'g3', tex: `\\dfrac{-0.20}{2.50} \\times 100 = ${Lo('-8.0\\%')}` }, { box: 'g3' }, { write: 'g4', tex: `${Lo('-')}\\to ${W('\\text{water out}')}`, at: 4 }] },
    ] },
    { title: 'Finding the isotonic point', cues: [
      { say: 'Now plot all six results. Percentage change goes up the side. Sucrose concentration goes along the bottom.', ops: [{ clear: 'Isotonic point' }, { panel: 'graph', s: { spec: GP, show: ['zero', 'pts'] }, fresh: 1 }, { camera: 'wide' }, { write: 'x1', tex: T('% change up the side') }, { write: 'x2', tex: T('sucrose along the bottom'), at: 3 }] },
      { say: 'Join them with a smooth curve, not a ruler line. The points do not lie on a straight line.', ops: [{ panel: 'graph', s: { show: ['zero', 'pts', 'curve'] } }, { write: 'x3', tex: T('smooth curve, not ruler') }] },
      { say: 'Above the zero line, strips gained water. Below it, they lost water. Where the curve crosses zero, the strip neither gained nor lost.', ops: [{ panel: 'graph', s: { show: all, pulse: 'zero' } }, { camera: 'wide', focus: { x: [0.1, 0.8], y: [-14, 14] } }, { write: 'x4', tex: `${G('\\text{above 0: gain}')}` }, { write: 'x5', tex: `${Lo('\\text{below 0: loss}')}`, at: 3.5 }] },
      { say: 'That crossing is the isotonic point. The solution there has the same concentration as the potato cell sap.', ops: [{ clear: 'Isotonic point' }, { camera: 'wide' }, { panel: 'graph', s: { show: [...all, 'cross', 'cg'], pulse: 'cross' } }, { write: 'z1', tex: `${I('\\text{isotonic point}')}` }, { write: 'z2', tex: `${T('% change')} = 0`, at: 2.5 }, { box: 'z2' }] },
      { say: 'The curve crosses between zero point two, at plus four point eight, and zero point four, at minus two point zero.', ops: [{ panel: 'graph', s: { show: [...all, 'cross', 'cg', 'a', 'b'], pulse: 'a' } }, { write: 'z3', tex: `0.2\\to ${G('+4.8\\%')}` }, { write: 'z4', tex: `0.4\\to ${Lo('-2.0\\%')}`, at: 3.5 }] },
      { say: 'To estimate it, find how far along the gap. Four point eight over six point eight is zero point seven one.', ops: [{ camera: 'board' }, { write: 'z5', tex: '\\dfrac{4.8}{4.8 + 2.0} = 0.71' }] },
      { say: 'So the concentration is zero point two plus zero point seven one times zero point two. About zero point three four moles per decimetre cubed.', ops: [{ write: 'z6', tex: '0.2 + 0.71 \\times 0.2' }, { write: 'z7', tex: `\\approx ${I('0.34\\ \\text{mol/dm}^3')}`, at: 3.5 }, { box: 'z7' }] },
      { say: 'Check it on the curve. It crosses zero at about zero point three four. The sum and the graph agree.', ops: [{ camera: 'wide', focus: { x: [0.1, 0.8], y: [-14, 14] } }, { panel: 'graph', s: { pulse: 'cg' } }, { write: 'z8', tex: `${T('curve: about')}\\ 0.34` }] },
    ] },
    { title: 'The mystery, solved', cues: [
      { say: 'Back to Mile 12. The salty water was hypertonic to the ugu cell sap. So water left the leaf cells by osmosis.', ops: [{ clear: 'Solved' }, { camera: 'wide' }, { panel: M, s: { scene: 'cells', plant: 1, rbc: 0, solution: 'hyper', progress: 1, labels: 1, terms: 1, arrows: 1 }, fresh: 1 }, { write: 'v1', tex: T('salty water: hypertonic') }, { write: 'v2', tex: `${W('\\text{water out}')}${T(' by osmosis')}`, at: 3 }] },
      { say: 'The cells plasmolysed, lost their firmness, and the leaves went limp. Salt did not soak in. Water came out.', ops: [{ write: 'v3', tex: `\\to ${T('plasmolysed')} \\to ${T('limp')}` }, { box: 'v3' }] },
      { say: 'Now the drip. Plain water is hypotonic to red cells. Water would rush in, and the cells would burst.', ops: [{ clear: 'The drip' }, { panel: M, s: { plant: 0, rbc: 1, solution: 'hypo', progress: 1 } }, { camera: 'wide', focus: 'rbc' }, { write: 'r1', tex: `${T('plain water: hypotonic')}` }, { write: 'r2', tex: `${T('haemolysis')}\\ ${Lo('\\times')}`, at: 3 }] },
      { say: 'Zero point nine percent saline is isotonic with blood, so red cells keep their shape.', ops: [{ panel: M, s: { solution: 'iso', progress: 1 } }, { camera: 'wide' }, { write: 'r3', tex: `${I('0.9\\%\\ \\text{saline}')}${T(': isotonic')}` }, { write: 'r4', tex: `${T('red cells keep shape')}\\ ${G('\\checkmark')}`, at: 3 }] },
      { say: 'Zero point nine percent means zero point nine grams of salt in every hundred centimetres cubed. A five hundred centimetre cubed bag holds four point five grams.', ops: [{ camera: 'board' }, { write: 'r5', tex: '0.9\\ \\text{g per } 100\\ \\text{cm}^3' }, { write: 'r6', tex: `0.9 \\times \\dfrac{500}{100} = ${I('4.5\\ \\text{g}')}`, at: 3.5 }, { box: 'r6' }] },
    ] },
    { title: 'Mistakes, summary and your turn', cues: [
      { say: 'Here are the mistakes that cost marks.', ops: [{ clear: 'Common mistakes' }, { panel: null }, { camera: 'wide' }] },
      { say: 'One. Saying salt or sugar moves in osmosis. Only water moves across the membrane.', ops: [{ write: 'e1', tex: `${Lo('\\times')}\\ ${T('salt moves in')}` }, { write: 'e2', tex: `${G('\\checkmark')}\\ ${T('water moves')}`, at: 3 }] },
      { say: 'Two. Dividing by the final mass. Zero point three five over two point eight five gives twelve point three, which is wrong. Always divide by the initial mass.', ops: [{ write: 'e3', tex: `${Lo('\\times')}\\ 0.35 / 2.85 = 12.3\\%` }, { write: 'e4', tex: `${G('\\checkmark')}\\ T{}`.replace('T{}', '\\text{divide by initial}'), at: 4 }] },
      { say: 'Three. Saying a plant cell bursts in water. Its wall makes it turgid. Only the red cell bursts.', ops: [{ write: 'e5', tex: `${Lo('\\times')}\\ ${T('plant cell bursts')}` }, { write: 'e6', tex: `${G('\\checkmark')}\\ ${T('turgid')}`, at: 3 }] },
      { say: 'To sum up. Osmosis moves water from dilute to concentrated. Diffusion needs no energy. Active transport uses A T P.', ops: [{ clear: 'Summary' }, { write: 'u1', tex: `${W('\\text{osmosis}')}${T(': water, dilute')}\\to${T('conc.')}` }, { write: 'u2', tex: T('diffusion: no energy'), at: 3 }, { write: 'u3', tex: `${T('active transport:')}\\ ${A('\\text{ATP}')}`, at: 5 }] },
      { say: 'Percentage change is final minus initial, over initial, times one hundred. Where it is zero, the solution is isotonic.', ops: [{ write: 'u4', tex: '\\%\\ \\text{change} = \\dfrac{\\Delta m}{m_{\\text{initial}}} \\times 100' }, { write: 'u5', tex: `${T('zero change:')}\\ ${I('\\text{isotonic}')}`, at: 4 }] },
      { say: 'Your turn. A yam strip went from two point four zero grams to two point one zero grams in a sugar solution. Find the percentage change, and name the solution.', hold: 15, ops: [{ clear: 'Your turn' }, { write: 't1', tex: '\\text{yam strip: } 2.40\\ \\text{g} \\to 2.10\\ \\text{g}' }, { write: 't2', tex: T('% change?'), at: 4 }, { write: 't3', tex: T('which solution?'), at: 5.5 }] },
      { say: 'Change is minus zero point three zero grams. Over two point four zero, times one hundred, is minus twelve point five percent. It lost water, so the solution was hypertonic.', ops: [{ write: 't4', tex: `\\dfrac{-0.30}{2.40} \\times 100 = ${Lo('-12.5\\%')}` }, { box: 't4' }, { write: 't5', tex: `${T('water out:')}\\ ${T('hypertonic')}`, at: 5 }, { box: 't5' }] },
      { say: 'Well done. Now try the worked examples in Apply, starting with the strip in the zero point eight tube.', ops: [] },
    ] },
  ],
};
