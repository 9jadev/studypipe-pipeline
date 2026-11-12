// Lesson 02 explainer: restoring force, the SHM condition and the loaded spring.
// Direction script: 06-videos/lesson-02-direction-script.md (approved). Kits: shm-oscillator (plug-in, scene spring), graph (built-in).
const k_ = (r, s) => `\\htmlClass{role-${r}}{${s}}`;
const X = s => k_('x', s), F = s => k_('F', s), Aa = s => k_('a', s), M = s => k_('m', s), K = s => k_('k', s), Tt = s => k_('T', s);
const T = s => `\\text{${s}}`;
const OSC = 'shm-oscillator';
const PI2 = 4 * Math.PI * Math.PI;

// Graph specs (lab spring k = 24.5 N/m; story-model okada not graphed)
const FX = { id: 'fx', x: [0, 0.12, 0.02], y: [0, 3, 0.5], xlabel: 'x (m)', ylabel: 'F (N)', xcolor: 'x', ycolor: 'F', items: [
  { id: 'pts', type: 'points', pts: [[0.02, 0.49], [0.04, 0.98], [0.06, 1.47], [0.08, 1.96], [0.10, 2.45]], hollow: true, color: 'F' },
  { id: 'line', type: 'line', from: [0, 0], to: [0.11, 2.695], color: 'k' },
  { id: 'tri', type: 'triangle', from: [0, 0], to: [0.10, 2.45], dx: '0.100 m', dy: '2.45 N', color: 'k' }] };
const AX = { id: 'ax', x: [-0.05, 0.05, 0.025], y: [-12, 12, 6], xlabel: 'x (m)', ylabel: 'a (m/s²)', xcolor: 'x', ycolor: 'a', items: [
  { id: 'spring', type: 'fn', fn: '-122.5*x', domain: [-0.045, 0.045], color: 'a', label: 'spring: a = −122.5x', labelAt: [0.002, 10] },
  { id: 'pt', type: 'point', at: [0.02, -2.45], color: 'a', label: '−2.45', pos: 'sw' },
  { id: 'ball', type: 'line', from: [-0.045, -9.8], to: [0.045, -9.8], color: 'F' },
  { id: 'balltxt', type: 'text', at: [-0.045, -8.2], text: 'ball (between bounces)', color: 'F', anchor: 'start' }] };
const TM = { id: 'tm', x: [0, 0.30, 0.05], y: [0, 0.5, 0.1], xlabel: 'm (kg)', ylabel: 'T² (s²)', xcolor: 'm', ycolor: 'T', items: [
  { id: 'pts', type: 'points', pts: [[0.05, 0.0806], [0.10, 0.161], [0.15, 0.242], [0.20, 0.322], [0.25, 0.403]], hollow: true, color: 'T' },
  { id: 'line', type: 'line', from: [0, 0], to: [0.28, 0.451], color: 'k' },
  { id: 'tri', type: 'triangle', from: [0, 0], to: [0.25, 0.403], dx: '0.250 kg', dy: '0.403 s²', color: 'k' }] };

const per = m => 2 * Math.PI * Math.sqrt(m / 24.5);

module.exports = {
  meta: {
    title: 'The Pull Back to the Middle', subtitle: 'Lesson 02 · Restoring force, the SHM condition and the loaded spring',
    eq: 'a = −ω²x   T = 2π√(m/k)', subject: 'Physics', level: 'SS2 · WAEC / NECO / JAMB',
    next: '#apply', nextLabel: 'Continue to Apply →',
    roles: {
      x: { color: 'blue', name: 'displacement' }, F: { color: 'red', name: 'force' }, a: { color: 'purple', name: 'acceleration' },
      m: { color: 'orange', name: 'mass' }, k: { color: 'green', name: 'spring constant' }, T: { color: 'gold', name: 'period' }
    },
    captionFixes: { 'S H M': 'SHM', 'F x graph': 'F–x graph', 'a x graph': 'a–x graph', 'T squared m graph': 'T²–m graph' }
  },
  checks: [
    // Chapter 2: bench
    { name: 'bench weights', approx: [[0.050 * 9.8, 0.490, 3], [0.100 * 9.8, 0.980, 3], [0.150 * 9.8, 1.47, 2]] },
    { name: 'bench extensions cm', approx: [[100 * 0.050 * 9.8 / 24.5, 2.0, 1], [100 * 0.100 * 9.8 / 24.5, 4.0, 1], [100 * 0.150 * 9.8 / 24.5, 6.0, 1], [100 * 0.200 * 9.8 / 24.5, 8.0, 1], [100 * 0.250 * 9.8 / 24.5, 10.0, 1]] },
    ['F–x gradient', 2.45 / 0.100, 24.5],
    // Chapter 3: restoring force
    ['static stretch 0.200 kg (m)', 0.200 * 9.8 / 24.5, 0.080],
    ['restoring force 2.0 cm', 24.5 * 0.020, 0.49], ['restoring force 4.0 cm', 24.5 * 0.040, 0.98], ['force doubles', 24.5 * 0.040 / (24.5 * 0.020), 2],
    // Chapter 4: SHM condition
    ['k/m bench 200 g', 24.5 / 0.200, 122.5], ['a at 2.0 cm', 122.5 * 0.020, 2.45], ['a–x line end', 122.5 * 0.040, 4.9],
    { name: 'a–x spring fn matches formula', same: [x => -122.5 * x, x => -(24.5 / 0.200) * x], range: [-0.045, 0.045] },
    ['ball a at every height', -9.8, -9.8],
    // Chapter 5: period
    { name: 'period 200 g, amplitude-independent', approx: [[per(0.200), 0.568, 3]] },
    ['omega² = k/m (bench)', 122.5, 24.5 / 0.200],
    // Chapter 6: WE1
    ['WE1 F', 0.30 * 9.8, 2.94, 1e-9], ['WE1 x metres', 6.0 / 100, 0.060], ['WE1 k', 2.94 / 0.060, 49],
    { name: 'WE1 m/k', approx: [[0.30 / 49, 0.00612, 5]] },
    { name: 'WE1 root', approx: [[Math.sqrt(0.30 / 49), 0.0782, 4]] },
    { name: 'WE1 T', approx: [[2 * Math.PI * Math.sqrt(0.30 / 49), 0.49, 2], [2 * 3.142 * 0.0782, 0.49, 2]] },
    { name: 'WE1 check m/k = x/g', approx: [[Math.sqrt(0.060 / 9.8), 0.0782, 4]] },
    // Chapter 7: okada (story model; k = 3.16 × 10⁴ as shown on the board, kit uses the exact f0 = 2.00 Hz value)
    { name: 'okada m/k 200 kg', approx: [[200 / 31600, 6.33e-3, 5]] },
    { name: 'okada root 200 kg', approx: [[Math.sqrt(200 / 31600), 0.0796, 4]] },
    { name: 'okada T1', approx: [[2 * Math.PI * Math.sqrt(200 / 31600), 0.50, 2], [2 * 3.142 * 0.0796, 0.50, 2]] },
    { name: 'okada f1', approx: [[1 / (2 * Math.PI * Math.sqrt(200 / 31600)), 2.0, 1]] },
    ['Lesson 01 link 10.0/20', 10.0 / 20, 0.50],
    { name: 'okada m/k 250 kg', approx: [[250 / 31600, 7.91e-3, 5]] },
    { name: 'okada root 250 kg', approx: [[Math.sqrt(250 / 31600), 0.0889, 4]] },
    { name: 'okada T2', approx: [[2 * Math.PI * Math.sqrt(250 / 31600), 0.56, 2], [2 * 3.142 * 0.0889, 0.56, 2]] },
    { name: 'okada f2', approx: [[1 / (2 * Math.PI * Math.sqrt(250 / 31600)), 1.79, 2]] },
    { name: 'okada ratio', approx: [[Math.sqrt(250 / 200), 1.12, 2], [0.56 / 0.50, 1.12, 2]] },
    // Chapter 8: T²–m graph
    { name: 'T² points', approx: [[PI2 * 0.050 / 24.5, 0.0806, 4], [PI2 * 0.100 / 24.5, 0.161, 3], [PI2 * 0.150 / 24.5, 0.242, 3], [PI2 * 0.200 / 24.5, 0.322, 3], [PI2 * 0.250 / 24.5, 0.403, 3]] },
    { name: 'T²–m gradient', approx: [[0.403 / 0.250, 1.61, 2]] },
    { name: '4π²', approx: [[PI2, 39.5, 1]] },
    { name: 'k from graph', approx: [[39.5 / 1.61, 24.5, 1], [PI2 / 1.61, 24.5, 1]] },
    { name: 'best-fit line end', approx: [[1.61 * 0.28, 0.451, 3]] },
    // Chapter 11: your turn
    ['YT F', 0.40 * 9.8, 3.92, 1e-9], ['YT x metres', 4.9 / 100, 0.049], ['YT k', 3.92 / 0.049, 80],
    ['YT m/k', 0.40 / 80, 0.005], { name: 'YT root', approx: [[Math.sqrt(0.005), 0.0707, 4]] },
    { name: 'YT T', approx: [[2 * Math.PI * Math.sqrt(0.005), 0.44, 2]] },
    { name: 'YT check', approx: [[Math.sqrt(0.049 / 9.8), 0.0707, 4]] }
  ],
  chapters: [
    { title: 'Heavier means steadier?', cues: [
      { say: "Dayo has loaded two extra crates for Hajia Ramatu. Tunde is sure about it. Heavy things don't bounce, so a heavier okada should ride steadier.", ops: [
        { clear: 'Heavier = steadier?' },
        { panel: OSC, s: { scene: 'spring', skin: 'okada', n: 1, m: 200, tag: '200 kg (model)', eq: 1, osc: 1, A: 0.02 }, fresh: 1 },
        { write: 'h1', tex: `${T('Tunde: heavy → no bounce?')}` }] },
      { say: "But Zainab presses the loaded carrier and watches. It still bounces. It just looks lazier. So who is right?", ops: [
        { panel: OSC, s: { n: 2, m2: 250, tag2: '250 kg (model)', osc2: 1, A2: 0.02 } }, { camera: 'wide', focus: 'both' },
        { write: 'h2', tex: `${T('Zainab: still bounces, slower?')}` }] },
      { say: "A quick note. These okada numbers are a teaching model, not measurements from a real motorcycle.", ops: [
        { camera: 'wide' }, { write: 'h3', tex: `${T('okada numbers = model')}`, note: 'not measured' }] },
      { say: "By the end of this video, you will find a spring constant, state the condition for S H M, use T equals two pi root m over k, and find k from a graph.", ops: [
        { clear: 'By the end of this video' },
        { write: 'o1', tex: `\\square\\ ${T('find ')}${K('k')}${T(' from ')}${F('F')} = ${K('k')}${X('x')}` },
        { write: 'o2', tex: `\\square\\ ${T('state the SHM condition')}`, at: 3 },
        { write: 'o3', tex: `\\square\\ ${T('use ')}${Tt('T')} = 2\\pi\\sqrt{${M('m')}/${K('k')}}`, at: 5.5 },
        { write: 'o4', tex: `\\square\\ ${K('k')}${T(' from a ')}${Tt('T')}^2${T('–')}${M('m')}${T(' graph')}`, at: 8 }] }
    ] },

    { title: 'An even pull: Hooke\'s law', cues: [
      { say: "Now to Mrs Okafor's lab. A spiral spring hangs from a clamp, with a pointer beside a metre rule.", ops: [
        { clear: "Hooke's law" },
        { panel: OSC, s: { scene: 'spring', skin: 'lab', n: 1, m: 0, k: 24.5, ruler: 1, eq: 0, osc: 0, tag: '', reading: '' }, fresh: 1 },
        { camera: 'wide' }] },
      { say: "She adds fifty grams. Its weight, zero point four nine zero newtons, pulls the pointer down two point zero centimetres.", ops: [
        { panel: OSC, s: { m: 0.050, reading: '2.0 cm' } }, { camera: 'wide', focus: 'pointer' },
        { write: 'b1', tex: `${M('0.050')}${T(' kg')} \\to ${F('0.490')}${T(' N, ')}${X('2.0')}${T(' cm')}`, at: 2 }] },
      { say: "Another fifty grams, another two point zero centimetres. A third, and the same again. Equal steps of load give equal steps of stretch.", ops: [
        { panel: OSC, s: { m: 0.100, reading: '4.0 cm' } },
        { write: 'b2', tex: `${M('0.100')}${T(' kg')} \\to ${X('4.0')}${T(' cm')}`, at: 0.8 },
        { panel: OSC, s: { m: 0.150, reading: '6.0 cm' }, at: 3.2 },
        { write: 'b3', tex: `${M('0.150')}${T(' kg')} \\to ${X('6.0')}${T(' cm')}`, at: 3.8 }] },
      { say: "This is Hooke's law. Provided the elastic limit is not exceeded, the extension is directly proportional to the stretching force.", ops: [
        { camera: 'wide' }, { write: 'b4', tex: `${F('F')} = ${K('k')}${X('x')}`, note: 'within elastic limit', at: 2.5 }, { box: 'b4' }] },
      { say: "Plot all five loads, up to two hundred and fifty grams. The F x graph is a straight line through the origin. Its gradient is the spring constant, k.", ops: [
        { clear: 'The spring constant' }, { panel: 'graph', s: { spec: FX, show: ['pts'] }, fresh: 1 },
        { panel: 'graph', s: { show: ['pts', 'line'] }, at: 3.5 },
        { write: 'g1', tex: `${F('F')}\\text{–}${X('x')}${T(': straight line through 0')}`, at: 4 }] },
      { say: "Gradient: two point four five newtons over zero point one zero zero metres. That is twenty-four point five newtons per metre.", ops: [
        { panel: 'graph', s: { show: ['pts', 'line', 'tri'], pulse: 'tri' } }, { camera: 'wide', focus: 'tri' },
        { write: 'g2', tex: `${K('k')} = 2.45/0.100` },
        { write: 'g3', tex: `\\phantom{k} = ${K('24.5')}${T(' N m')}^{-1}`, at: 3.5 }, { box: 'g3' }] },
      { say: "So k is the force needed for each metre of extension. Always change centimetres to metres before you divide.", ops: [
        { camera: 'wide' }, { write: 'g4', tex: `${K('k')} = ${F('F')}/${X('x')}`, note: 'x in metres' }] }
    ] },

    { title: 'The pull back to the middle', cues: [
      { say: "Hang two hundred grams and let it settle. This resting point is the equilibrium position. Here the spring's pull exactly balances the weight.", ops: [
        { clear: 'Restoring force' },
        { panel: OSC, s: { scene: 'spring', skin: 'lab', n: 1, m: 0.200, reading: '8.0 cm', eq: 1, balance: 1, x: 0 }, fresh: 1 },
        { camera: 'wide', focus: 'mass' }, { write: 'r1', tex: `${T('at rest: spring pull = ')}${F('mg')}`, at: 2 }] },
      { say: "Pull the mass down two point zero centimetres more. The spring stretches further and pulls back with an extra zero point four nine newtons, upwards.", ops: [
        { panel: OSC, s: { balance: 0, x: 0.020, xArrow: 1, xLabel: '2.0 cm', force: 1, forceLabel: '0.49 N' } },
        { write: 'r2', tex: `${X('x')} = 2.0${T(' cm')} \\to ${F('F')} = 0.49${T(' N up')}`, at: 2 }] },
      { say: "Pull it four point zero centimetres down. The pull back doubles, to zero point nine eight newtons. Double the displacement, double the force.", ops: [
        { panel: OSC, s: { x: 0.040, xLabel: '4.0 cm', forceLabel: '0.98 N' } },
        { write: 'r3', tex: `${X('x')} = 4.0${T(' cm')} \\to ${F('F')} = 0.98${T(' N up')}`, at: 1.5 },
        { write: 'r4', tex: `${F('F')} \\propto ${X('x')}`, at: 5 }] },
      { say: "Now push it two point zero centimetres above the middle. The net force now acts downwards. Either way, it points back to the equilibrium position.", ops: [
        { panel: OSC, s: { x: -0.020, xLabel: '2.0 cm', forceLabel: '0.49 N' } },
        { write: 'r5', tex: `${T('above → ')}${F('F')}${T(' down')}`, at: 2.5 }] },
      { say: "This is the restoring force. F equals minus k x. The minus sign means the force is always opposite to the displacement.", ops: [
        { clear: 'F = −kx' }, { camera: 'wide' },
        { write: 'r6', tex: `${F('F')} = -${K('k')}${X('x')}` }, { box: 'r6' },
        { write: 'r7', tex: `${T('minus = opposite direction')}`, at: 4 }] },
      { say: "Now release it and watch the red arrow. Longest at the ends, zero as the mass passes the middle, then growing again on the other side.", ops: [
        { panel: OSC, s: { xArrow: 0, osc: 1, A: 0.040, slow: 4 } }, { camera: 'kit', focus: 'mass', drift: 0.5 }] },
      { say: "Remember, x is measured from the equilibrium position, not from the spring's natural length. The weight is already balanced there.", ops: [
        { camera: 'wide' }, { write: 'r8', tex: `${X('x')}${T(' from equilibrium')}`, note: 'not natural length' }] }
    ] },

    { title: 'The SHM condition', cues: [
      { say: "Newton's second law turns force into acceleration. a equals F over m, so a equals minus k over m, times x.", ops: [
        { clear: 'The SHM condition' },
        { panel: OSC, s: { osc: 0, x: 0, slow: 1, force: 0, xArrow: 0 } },
        { write: 's1', tex: `${Aa('a')} = ${F('F')}/${M('m')}` },
        { write: 's2', tex: `${Aa('a')} = -(${K('k')}/${M('m')})${X('x')}`, at: 3 }] },
      { say: "For our spring, k over m is twenty-four point five over zero point two zero zero. That is one hundred and twenty-two point five per second squared, a constant.", ops: [
        { write: 's3', tex: `${K('k')}/${M('m')} = 24.5/0.200` },
        { write: 's4', tex: `\\phantom{k/m} = 122.5${T(' s')}^{-2}`, at: 3.5 }] },
      { say: "So two point zero centimetres below the middle, the acceleration is one hundred and twenty-two point five times zero point zero two zero. That is two point four five metres per second squared, upwards.", ops: [
        { clear: 'At 2.0 cm below' },
        { panel: OSC, s: { x: 0.020, accel: 1, accelLabel: '2.45 m/s²' } }, { camera: 'wide', focus: 'mass' },
        { write: 's5', tex: `${Aa('a')} = -122.5 \\times 0.020`, at: 1.5 },
        { write: 's6', tex: `\\phantom{a} = ${Aa('-2.45')}${T(' m s')}^{-2}`, note: 'upwards', at: 5 }] },
      { say: "Any motion where the acceleration is minus a constant times x is simple harmonic. We call that constant omega squared.", ops: [
        { clear: 'Definition' }, { camera: 'wide' },
        { write: 's7', tex: `${Aa('a')} = -\\omega^2${X('x')}` }, { box: 's7' }] },
      { say: "In words, as examiners want it. The acceleration is directly proportional to the displacement from a fixed point, and always directed towards that point.", ops: [
        { write: 's8', tex: `${Aa('a')} \\propto ${X('x')}${T(' from a fixed point')}` },
        { write: 's9', tex: `${Aa('a')}${T(' always towards that point')}`, at: 4 }] },
      { say: "Plot a against x for the spring. You get a straight line through the origin, sloping downwards. Its gradient is minus omega squared.", ops: [
        { clear: 'a against x' }, { panel: 'graph', s: { spec: AX, show: ['spring', 'pt'] }, fresh: 1 },
        { write: 's10', tex: `${Aa('a')}\\text{–}${X('x')}${T(': line through 0')}` },
        { write: 's11', tex: `${T('gradient = ')}-\\omega^2`, at: 4 }] },
      { say: "A ball bouncing on a floor repeats too. But between bounces its acceleration is g, nine point eight metres per second squared downwards, at every height. A flat line. So it is not simple harmonic.", ops: [
        { panel: 'graph', s: { show: ['spring', 'pt', 'ball', 'balltxt'], pulse: 'ball' } }, { camera: 'wide', focus: 'ball' },
        { write: 's12', tex: `${T('ball: ')}${Aa('a')} = -9.8${T(' at all heights')}`, at: 1 },
        { write: 's13', tex: `${T('not ')}\\propto ${X('x')}${T(' → not SHM')}`, at: 8 }] }
    ] },

    { title: 'From the condition to the period', cues: [
      { say: "Compare the two equations. Minus omega squared x, and minus k over m x. So omega squared equals k over m.", ops: [
        { clear: "The spring's period" }, { camera: 'wide' },
        { panel: OSC, s: { scene: 'spring', skin: 'lab', n: 1, m: 0.200, x: 0, accel: 0, force: 0, osc: 0 }, fresh: 1 },
        { write: 'p1', tex: `\\omega^2 = ${K('k')}/${M('m')}` },
        { write: 'p2', tex: `\\omega = \\sqrt{${K('k')}/${M('m')}}`, at: 3.5 }] },
      { say: "One full oscillation takes T equals two pi over omega. Put in omega, and you get T equals two pi root m over k.", ops: [
        { write: 'p3', tex: `${Tt('T')} = 2\\pi/\\omega` },
        { write: 'p4', tex: `${Tt('T')} = 2\\pi\\sqrt{${M('m')}/${K('k')}}`, at: 3.2 }, { box: 'p4' }] },
      { say: "Read it. A bigger mass gives a longer period. A stiffer spring gives a shorter period. Frequency is one over T.", ops: [
        { clear: 'Reading the formula' },
        { write: 'p5', tex: `${M('m')} \\uparrow \\to ${Tt('T')} \\uparrow` },
        { write: 'p6', tex: `${K('k')} \\uparrow \\to ${Tt('T')} \\downarrow`, at: 2.2 },
        { write: 'p7', tex: `${Tt('f')} = 1/${Tt('T')}`, at: 5 }] },
      { say: "And notice what is missing: the amplitude. Here is the same two hundred grams, pulled down one point zero centimetre and three point zero centimetres.", ops: [
        { panel: OSC, s: { n: 2, m2: 0.200, osc: 1, A: 0.010, osc2: 1, A2: 0.030, slow: 2, tag: 'A = 1.0 cm', tag2: 'A = 3.0 cm', ruler: 0 } },
        { camera: 'wide', focus: 'both' }, { write: 'p8', tex: `${T('amplitude is not in ')}${Tt('T')}`, at: 5 }] },
      { say: "They stay in step. Both take zero point five six eight seconds per oscillation. A bigger pull just means a bigger swing, in the same time.", ops: [
        { panel: OSC, s: { periodLabel: 'T = 0.568 s', periodLabel2: 'T = 0.568 s' } },
        { write: 'p9', tex: `${T('both: ')}${Tt('T = 0.568')}${T(' s')}` }] }
    ] },

    { title: 'Worked example: k, then T', cues: [
      { say: "Worked example. A zero point three zero kilogram load stretches a spring by six point zero centimetres. Find k, and the period when the load bounces. Take g as nine point eight.", ops: [
        { clear: 'Example 1' }, { panel: null }, { camera: 'board' },
        { write: 'e1', tex: `${M('m')} = 0.30${T(' kg')},\\ ${X('x')} = 6.0${T(' cm')}` },
        { write: 'e2', tex: `g = 9.8${T(' m s')}^{-2}`, at: 3.5 },
        { write: 'e3', tex: `${K('k')} = ?\\quad ${Tt('T')} = ?`, at: 5.5 }] },
      { say: "Step one. The stretching force is the weight. Zero point three zero times nine point eight is two point nine four newtons. And six point zero centimetres is zero point zero six zero metres.", ops: [
        { hl: ['F'] },
        { write: 'e4', tex: `${F('F')} = mg = 0.30 \\times 9.8` },
        { write: 'e5', tex: `\\phantom{F} = ${F('2.94')}${T(' N')}`, at: 4 },
        { write: 'e6', tex: `${X('x')} = 0.060${T(' m')}`, note: 'cm → m', at: 6 }] },
      { say: "Step two. k equals F over x. Two point nine four over zero point zero six zero is forty-nine newtons per metre.", ops: [
        { hl: ['k'] }, { write: 'e7', tex: `${K('k')} = 2.94/0.060 = ${K('49')}${T(' N m')}^{-1}` }, { box: 'e7' }] },
      { say: "Step three. T equals two pi root m over k. Zero point three zero over forty-nine is zero point zero zero six one two.", ops: [
        { clear: 'Step 3: the period' },
        { write: 'e8', tex: `${Tt('T')} = 2\\pi\\sqrt{0.30/49}` },
        { write: 'e9', tex: `\\phantom{T} = 2\\pi\\sqrt{0.00612}`, at: 3 }] },
      { say: "Its square root is zero point zero seven eight two. Two times three point one four two times zero point zero seven eight two gives zero point four nine seconds.", ops: [
        { hl: ['T'] }, { write: 'e10', tex: `= 2 \\times 3.142 \\times 0.0782` },
        { write: 'e11', tex: `= ${Tt('0.49')}${T(' s')}`, at: 4 }, { box: 'e11' }] },
      { say: "Check. Because k x equals m g, m over k equals x over g. Root of zero point zero six zero over nine point eight is zero point zero seven eight two again. It works.", ops: [
        { clear: 'Check' },
        { write: 'e12', tex: `${M('m')}/${K('k')} = ${X('x')}/g`, note: 'kx = mg' },
        { write: 'e13', tex: `\\sqrt{0.060/9.8} = 0.0782\\ \\checkmark`, at: 4.5 }] }
    ] },

    { title: 'The okada: 200 kg, then 250 kg', cues: [
      { say: "Now Dayo's okada. In our model, the rear spring has k equals three point one six times ten to the four newtons per metre. Find the bounce period with two hundred kilograms, then two hundred and fifty.", ops: [
        { clear: 'Example 2: the okada' },
        { panel: OSC, s: { scene: 'spring', skin: 'okada', n: 2, m: 200, m2: 250, tag: '200 kg (model)', tag2: '250 kg (model)', osc: 0, osc2: 0, x: 0, x2: 0, eq: 1, xArrow: 0, force: 0, accel: 0, periodLabel: '', periodLabel2: '', slow: 1 }, fresh: 1 },
        { camera: 'wide' },
        { write: 'o1', tex: `${K('k')} = 3.16 \\times 10^4${T(' N m')}^{-1}`, note: 'model', at: 3 },
        { write: 'o2', tex: `${M('m')} = 200${T(' kg, then ')}250${T(' kg')}`, at: 7 }] },
      { say: "Step one. Two hundred over thirty-one thousand six hundred is six point three three times ten to the minus three. Its square root is zero point zero seven nine six.", ops: [
        { clear: 'Step 1: 200 kg' }, { camera: 'board' },
        { write: 'o3', tex: `${Tt('T_1')} = 2\\pi\\sqrt{200/31\\,600}` },
        { write: 'o4', tex: `\\phantom{T_1} = 2\\pi\\sqrt{6.33 \\times 10^{-3}}`, at: 3 },
        { write: 'o5', tex: `\\phantom{T_1} = 2 \\times 3.142 \\times 0.0796`, at: 6 }] },
      { say: "So T one is zero point five zero seconds, a frequency of two point zero hertz. That matches Zainab's twenty bounces in ten point zero seconds.", ops: [
        { write: 'o6', tex: `${Tt('T_1 = 0.50')}${T(' s')},\\ ${Tt('f')} = 2.0${T(' Hz')}` }, { box: 'o6' },
        { write: 'o7', tex: `10.0\\,\\text{s} \\div 20 = 0.50\\,\\text{s}\\ \\checkmark`, at: 4.5 }] },
      { say: "Step two. Two hundred and fifty over thirty-one thousand six hundred is seven point nine one times ten to the minus three. Its square root is zero point zero eight eight nine.", ops: [
        { clear: 'Step 2: 250 kg' },
        { write: 'o8', tex: `${Tt('T_2')} = 2\\pi\\sqrt{7.91 \\times 10^{-3}}` },
        { write: 'o9', tex: `\\phantom{T_2} = 2 \\times 3.142 \\times 0.0889`, at: 4.5 }] },
      { say: "So T two is zero point five six seconds, and the frequency falls to one point seven nine hertz.", ops: [
        { write: 'o10', tex: `${Tt('T_2 = 0.56')}${T(' s')},\\ ${Tt('f')} = 1.79${T(' Hz')}` }, { box: 'o10' }] },
      { say: "Watch them side by side. The heavier okada still bounces. It just bounces more slowly, and slips behind.", ops: [
        { panel: OSC, s: { osc: 1, osc2: 1, A: 0.02, A2: 0.02, slow: 4, periodLabel: '0.50 s', periodLabel2: '0.56 s' } },
        { camera: 'kit', focus: 'both', drift: 0.5 }] },
      { say: "Check with a ratio. T is proportional to root m, so T two over T one should be root one point two five, one point one two. And zero point five six over zero point five zero is one point one two. It works.", ops: [
        { clear: 'Check' }, { camera: 'wide' },
        { write: 'o11', tex: `${Tt('T')} \\propto \\sqrt{${M('m')}}` },
        { write: 'o12', tex: `\\sqrt{250/200} = 1.12`, at: 4 },
        { write: 'o13', tex: `0.56/0.50 = 1.12\\ \\checkmark`, at: 7 }] },
      { say: "So, sorry Tunde. Extra crates do not stop the bounce. They slow it, from two point zero to one point seven nine hertz. Heavier is slower, not steadier.", ops: [
        { camera: 'wide', focus: 'both' },
        { write: 'o14', tex: `${T('heavier = slower, not steadier')}`, at: 5 }, { box: 'o14' }] }
    ] },

    { title: 'k from a T²–m graph', cues: [
      { say: "In the practical, examiners want k from a graph. Square both sides of T equals two pi root m over k.", ops: [
        { clear: 'k from a graph' }, { panel: null }, { camera: 'wide' },
        { write: 'k1', tex: `${Tt('T')}^2 = (4\\pi^2/${K('k')}) \\times ${M('m')}`, at: 2.5 }] },
      { say: "So T squared against m is a straight line through the origin, with gradient four pi squared over k. That is why we plot T squared, not T.", ops: [
        { panel: 'graph', s: { spec: TM, show: [] }, fresh: 1 },
        { write: 'k2', tex: `${T('gradient = ')}4\\pi^2/${K('k')}`, note: 'plot T², not T', at: 3 }] },
      { say: "Here are the bench results, from fifty to two hundred and fifty grams. Draw the best straight line through the origin.", ops: [
        { panel: 'graph', s: { show: ['pts'] } }, { panel: 'graph', s: { show: ['pts', 'line'] }, at: 4 }] },
      { say: "Gradient: zero point four zero three over zero point two five zero. That is one point six one seconds squared per kilogram.", ops: [
        { panel: 'graph', s: { show: ['pts', 'line', 'tri'], pulse: 'tri' } }, { camera: 'wide', focus: 'tri' },
        { write: 'k3', tex: `${T('gradient = ')}0.403/0.250` },
        { write: 'k4', tex: `\\phantom{g} = 1.61\\text{ s}^2\\text{ kg}^{-1}`, at: 3.5 }] },
      { say: "So k equals four pi squared over the gradient. Thirty-nine point five over one point six one is twenty-four point five newtons per metre.", ops: [
        { clear: 'Find k' }, { camera: 'wide' },
        { write: 'k5', tex: `${K('k')} = 4\\pi^2/${T('gradient')}` },
        { write: 'k6', tex: `\\phantom{k} = 39.5/1.61 = ${K('24.5')}${T(' N m')}^{-1}`, at: 3.5 }, { box: 'k6' }] },
      { say: "That is exactly what Hooke's law gave us. Two methods, one spring, one answer.", ops: [
        { write: 'k7', tex: `${T("Hooke's law: 24.5 N m")}^{-1}\\ \\checkmark` }] }
    ] },

    { title: 'Mistakes that cost marks', cues: [
      { say: "Mistake one. Using the mass as the force. To find k, the force is the weight, m g, in newtons.", ops: [
        { clear: 'Common mistakes' }, { panel: null }, { camera: 'wide' },
        { write: 'x1', tex: `\\times\\ ${K('k')} = ${M('m')}/${X('x')}` },
        { write: 'x2', tex: `\\checkmark\\ ${K('k')} = ${M('m')}g/${X('x')}`, at: 3 }] },
      { say: "Mistake two. Leaving the extension in centimetres. Change it to metres before you divide.", ops: [
        { write: 'x3', tex: `\\times\\ 2.94/6.0` }, { write: 'x4', tex: `\\checkmark\\ 2.94/0.060`, at: 3 }] },
      { say: "Mistake three. Turning the root upside down. If a heavier load gives you a shorter period, you have used k over m.", ops: [
        { clear: 'More mistakes' },
        { write: 'x5', tex: `\\times\\ ${Tt('T')} = 2\\pi\\sqrt{${K('k')}/${M('m')}}` },
        { write: 'x6', tex: `\\checkmark\\ ${Tt('T')} = 2\\pi\\sqrt{${M('m')}/${K('k')}}`, at: 3.5 }] },
      { say: "Mistake four. Thinking a bigger pull changes the period. Amplitude is not in the formula. And the S H M definition needs both parts: proportional, and towards the fixed point.", ops: [
        { write: 'x7', tex: `\\times\\ ${T('bigger A → longer ')}${Tt('T')}` },
        { write: 'x8', tex: `\\checkmark\\ ${Tt('T')}${T(' does not depend on A')}`, at: 3.5 }] }
    ] },

    { title: 'Summary', cues: [
      { say: "To sum up. Hooke's law, F equals k x, holds within the elastic limit. The restoring force, minus k x, always points back to equilibrium.", ops: [
        { clear: 'Summary' }, { camera: 'wide' },
        { write: 'u1', tex: `${F('F')} = ${K('k')}${X('x')}` },
        { write: 'u2', tex: `${F('F')} = -${K('k')}${X('x')}`, at: 3 }] },
      { say: "S H M means a equals minus omega squared x. For a spring, T equals two pi root m over k, and the T squared m graph has gradient four pi squared over k. More crates, slower bounce.", ops: [
        { write: 'u3', tex: `${Aa('a')} = -\\omega^2${X('x')}` },
        { write: 'u4', tex: `${Tt('T')} = 2\\pi\\sqrt{${M('m')}/${K('k')}}`, at: 3 },
        { write: 'u5', tex: `${Tt('T')}^2\\text{–}${M('m')}${T(': gradient 4π²/')}${K('k')}`, at: 7 }, { box: 'u4' }] }
    ] },

    { title: 'Your turn', cues: [
      { say: "Your turn. A zero point four zero kilogram load stretches a spring by four point nine centimetres. Find k, and the period of its bounce. Take g as nine point eight.", ops: [
        { clear: 'Your turn' },
        { write: 'y1', tex: `${M('m')} = 0.40${T(' kg')},\\ ${X('x')} = 4.9${T(' cm')}` },
        { write: 'y2', tex: `g = 9.8${T(' m s')}^{-2}`, at: 4 },
        { write: 'y3', tex: `${T('find ')}${K('k')}${T(' and ')}${Tt('T')}`, at: 6 }] },
      { say: "Pause and try it now.", hold: 15, ops: [] },
      { say: "Step one. F equals zero point four zero times nine point eight, three point nine two newtons. k equals three point nine two over zero point zero four nine, which is eighty newtons per metre.", ops: [
        { clear: 'Solution' }, { camera: 'board' },
        { write: 'y4', tex: `${F('F')} = 0.40 \\times 9.8 = ${F('3.92')}${T(' N')}` },
        { write: 'y5', tex: `${K('k')} = 3.92/0.049 = ${K('80')}${T(' N m')}^{-1}`, at: 4.5 }, { box: 'y5' }] },
      { say: "Step two. T equals two pi root zero point four zero over eighty. That is two pi root zero point zero zero five, or two pi times zero point zero seven zero seven.", ops: [
        { write: 'y6', tex: `${Tt('T')} = 2\\pi\\sqrt{0.40/80}` },
        { write: 'y7', tex: `\\phantom{T} = 2\\pi\\sqrt{0.005}`, at: 2.5 },
        { write: 'y8', tex: `\\phantom{T} = 2\\pi \\times 0.0707`, at: 5 }] },
      { say: "So T is zero point four four seconds. Check: root of zero point zero four nine over nine point eight is zero point zero seven zero seven too. Well done.", ops: [
        { camera: 'wide' }, { write: 'y9', tex: `${Tt('T = 0.44')}${T(' s')}` }, { box: 'y9' },
        { write: 'y10', tex: `\\sqrt{0.049/9.8} = 0.0707\\ \\checkmark`, at: 4 }] }
    ] }
  ]
};
