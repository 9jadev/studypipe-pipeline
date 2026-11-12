// Lesson 07 explainer: forced vibration, resonance, Barton's pendulums, and the Ridge Road verdict.
// Direction script: 06-videos/lesson-07-direction-script.md (approved). Kits: shm-oscillator (plug-in: scenes barton, ridge), graph (built-in).
// The kit's default okada k is 4π²·2.00²·200 (f0 = 2.00 Hz exactly), so `k` is left out of every ridge state.
const k = (r, s) => `\\htmlClass{role-${r}}{${s}}`;
const F = s => k('f', s), F0 = s => k('f0', s), Vv = s => k('v', s), D = s => k('d', s), AA = s => k('A', s), G = s => k('g', s);
const T = s => `\\text{${s}}`;
const K = 'shm-oscillator';
const PI = Math.PI, KO = 4 * PI * PI * 2.00 * 2.00 * 200;
const f0of = m => Math.sqrt(KO / m) / (2 * PI);
// base-excitation response in cm (Y = 1.0 cm); r = (v/3.6/2.5)/f0
const resp = (v, m, z) => { const r = v / 3.6 / 2.5 / f0of(m), q = 2 * z * r; return Math.sqrt(1 + q * q) / Math.sqrt((1 - r * r) ** 2 + q * q); };
const lift = v => 9.8 / (2 * PI * v / 3.6 / 2.5) ** 2 * 100;
const respStr = (f0, z) => { const r = `(x/${(9 * f0).toFixed(5)})`, q = `(${(2 * z).toFixed(2)}*${r})`; return `sqrt(1+${q}*${q})/sqrt((1-${r}*${r})*(1-${r}*${r})+${q}*${q})`; };
const evalFn = (s, x) => new Function('x', 'with(Math){return ' + s + '}')(x);
const F200L = respStr(2.0, 0.05), F200H = respStr(2.0, 0.30), F250L = respStr(f0of(250), 0.05), LIFT = '980/((2*PI*x/9)*(2*PI*x/9))';

const TRACE = { id: 'trace', x: [0, 2, 0.5], y: [-1.2, 1.2, 0.4], xlabel: 'time (s)', ylabel: 'displacement', xcolor: 'white', ycolor: 'A', items: [
  { id: 'free', type: 'fn', fn: 'sin(2*PI*2.0*x)', domain: [0, 2], color: 'f0', label: 'free: 2.0 Hz', labelAt: [0.05, 1.12] },
  { id: 'damped', type: 'fn', fn: 'exp(-1.5*x)*sin(2*PI*2.0*x)', domain: [0, 2], color: 'A', label: 'damped', labelAt: [0.6, 1.12] },
  { id: 'env', type: 'fn', fn: 'exp(-1.5*x)', domain: [0, 2], color: 'white', width: 2 },
  { id: 'forced', type: 'fn', fn: '0.3*sin(2*PI*3.33*x)', domain: [0, 2], color: 'f', label: "forced: driver's f", labelAt: [0.05, 0.62] }] };
const AV = { id: 'av', x: [8, 32, 4], y: [0, 12, 2], xlabel: 'v (km/h)', ylabel: 'A (cm)', xcolor: 'v', ycolor: 'A', items: [
  { id: 'pts', type: 'points', pts: [[10, 1.4], [14, 2.5], [16, 4.4], [18, 10.0], [20, 3.9], [30, 0.6]], hollow: true, color: 'A' },
  { id: 'leakc', type: 'fn', fn: F200L, domain: [8, 32], color: 'A' },
  { id: 'peakL', type: 'point', at: [18, 10.05], color: 'A', label: 'peak 10.0 cm', pos: 'e' },
  { id: 'lift', type: 'fn', fn: LIFT, domain: [12, 32], color: 'g', width: 2.5, label: 'lift-off line', labelAt: [22, 5.4] },
  { id: 'healthc', type: 'fn', fn: F200H, domain: [8, 32], color: 'sky' },
  { id: 'peakH', type: 'point', at: [16.7, 1.99], color: 'sky', label: 'healthy 2.0', pos: 'n' },
  { id: 'c250', type: 'fn', fn: F250L, domain: [8, 32], color: 'pink' },
  { id: 'peak250', type: 'point', at: [16, 10.03], color: 'pink', label: '250 kg: 10.0 cm', pos: 'n' }] };

const RB = { scene: 'ridge', m: 200, d: 2.5, Y: 1.0, damper: 'leaking', build: 1, slow: 3 };
const N = {
  "1.1": "Every dawn, Dayo carries Hajia Ramatu's eggs to Ogbomoso market. Halfway, the road crosses low concrete ridges, two point five metres apart in our teaching model.",
  "1.2": "At ten kilometres per hour, the carrier bumps a little at each ridge. The crates are fine.",
  "1.3": "At thirty kilometres per hour, the rear hardly moves at all. Fine again.",
  "1.4": "But at eighteen kilometres per hour, the rear pumps higher and higher, until a crate lifts off the carrier and cracks.",
  "1.5": "Tunde was sure that faster is always worse. The road says no. So why is one middle speed the dangerous one?",
  "1.6": "By the end, you will name three kinds of vibration, explain resonance with Barton's pendulums, and calculate the dangerous speed.",
  "2.1": "First, three kinds of vibration. Push the parked okada down once and let go. It bounces at its own natural frequency, two point zero hertz.",
  "2.2": "With no losses, that free vibration would keep the same amplitude for ever. No outside push is needed.",
  "2.3": "Real systems lose energy to air, friction or oil. The amplitude dies away, cycle after cycle. That is damped vibration.",
  "2.4": "Now ride over the ridges. The road pushes the rear again and again, and the rear is made to vibrate at the frequency of those pushes, not its own.",
  "2.5": "So in forced vibration, the driver sets the frequency. The natural frequency only decides how big the response is.",
  "3.1": "Think of pushing a friend on a swing. Push once per swing, just as it starts to move away, and every push adds energy.",
  "3.2": "Push at the wrong moments, and some pushes fight the motion and take energy out. The swing stays small.",
  "3.3": "On Ridge Road at eighteen, each ridge arrives just as the last bounce comes back. Every push lands in step.",
  "3.4": "Each ridge lifts the wheel only about one centimetre. Yet the carrier builds up to ten centimetres. Ten times bigger.",
  "3.5": "That has a name. Resonance is when the driving frequency equals the natural frequency, so the system vibrates with its greatest amplitude.",
  "4.1": "The classic laboratory proof is Barton's pendulums. A heavy driver hangs from a taut cord, beside five light paper cones of different lengths.",
  "4.2": "Set the driver swinging. Through the cord, it pushes every cone at the driver's own frequency. Watch which cone answers.",
  "4.3": "All five swing, but the zero point six zero metre cone swings widest. Its neighbours swing less, and the far ones least.",
  "4.4": "Why that one? Its length equals the driver's, so its natural frequency equals the driving frequency. It resonates.",
  "4.5": "Let's find that frequency. Step one. T equals two pi root L over g, so two pi times the root of zero point six zero over nine point eight.",
  "4.6": "The root is zero point two four seven four. Times two pi, that is one point five five seconds.",
  "4.7": "Step two. f equals one over T. Keep the unrounded period, one point five five five, and f is zero point six four hertz.",
  "4.8": "Shorten the driver to zero point four five metres, and the widest swing moves to the zero point four five metre cone. Match the length, match the frequency.",
  "5.1": "Back to Ridge Road. Here the ridges are the driver. How often do they push?",
  "5.2": "At speed v, the okada takes d over v seconds to get from one ridge to the next.",
  "5.3": "The number of ridges per second is the reciprocal. So the driving frequency is f equals v over d.",
  "5.4": "Speed must be in metres per second. At eighteen kilometres per hour, divide by three point six. That gives five point zero metres per second.",
  "5.5": "So f equals five point zero over two point five, which is two point zero hertz. One ridge every zero point five zero seconds.",
  "5.6": "That is exactly the okada's natural frequency. At ten kilometres per hour, the pushes come at one point one one hertz. At thirty, three point three three hertz. Both miss.",
  "6.1": "Worked example one. Ridges are two point five metres apart, and the loaded okada's natural frequency is two point zero hertz. Find the dangerous speed.",
  "6.2": "Step one. Resonance happens when the driving frequency equals the natural frequency. So v over d equals f nought.",
  "6.3": "Step two. Rearrange. v equals d times f nought, two point five times two point zero, which is five point zero metres per second.",
  "6.4": "Step three. Convert, times three point six. Five point zero times three point six is eighteen kilometres per hour.",
  "6.5": "Will the crates lift? From lesson three, they leave the carrier when omega squared A is at least g. At two point zero hertz, that needs six point two centimetres.",
  "6.6": "With the leaking damper, the bounce at eighteen reaches ten point zero centimetres. That is well past six point two. Off go the crates.",
  "7.1": "Zainab swept the speed on the ridge rig and plotted the bounce against speed. Look at the shape.",
  "7.2": "Small at low speed, a sharp peak at eighteen kilometres per hour, then small again. The peak sits where f equals f nought.",
  "7.3": "The red dashed line is the lift-off line. Only in a narrow band around eighteen does the curve climb above it.",
  "7.4": "Now Mallam Sule fits a healthy shock absorber. Its oil turns each bounce into heat, taking energy out every cycle.",
  "7.5": "The peak drops to about two point zero centimetres and spreads wider. It never reaches the lift-off line, at any speed.",
  "7.6": "Notice that the peak stays near the same speed. Damping changes how high the peak is. Mass and stiffness decide where it is.",
  "8.1": "Worked example two. Two extra crates raise the sprung load to two hundred and fifty kilograms, on the same spring, three point one six times ten to the four newtons per metre.",
  "8.2": "Step one. f nought equals one over two pi, times root k over m. Thirty-one thousand six hundred over two hundred and fifty is one hundred and twenty-six point four.",
  "8.3": "Its square root is eleven point two four. Divide by two pi, six point two eight three, and f nought is one point seven nine hertz.",
  "8.4": "Step two. v equals d f nought, two point five times one point seven nine, which is four point four seven metres per second.",
  "8.5": "Step three. Four point four seven times three point six is about sixteen kilometres per hour. More load, lower f nought, lower dangerous speed.",
  "8.6": "On the graph, the whole peak slides left to sixteen. It reaches ten point zero centimetres, past the line's seven point eight there. At eighteen it is only three point seven.",
  "9.1": "Case closed. At eighteen kilometres per hour, the ridges push at two point zero hertz, exactly the natural frequency. That is resonance.",
  "9.2": "The leaking damper lets the energy pile up until the bounce passes six point two centimetres, and the crates leave the carrier.",
  "9.3": "Tunde's rule fails. Thirty is safe because it is far from resonance, not because it is fast.",
  "9.4": "Now the advice for Dayo and Hajia Ramatu. One. Let Mallam Sule replace the rear shock absorber.",
  "9.5": "Two. Until then, cross the ridges at ten kilometres per hour or below. That is well under both danger speeds, whatever the load.",
  "9.6": "Why not just ride fast? To reach thirty, he must pass through sixteen and eighteen on the way, and that leaves no margin.",
  "10.1": "Resonance is not always the villain. A radio is tuned until its circuit resonates with one station. A guitar or talking drum body booms in resonance with the string or skin.",
  "10.2": "Harmful resonance must be prevented. Soldiers break step on a bridge, so their footsteps cannot match its natural frequency.",
  "10.3": "Engineers prevent it the same ways as Dayo. Add damping, change the mass or stiffness to move f nought, or avoid that driving frequency.",
  "11.1": "Mistake one. Resonance does not mean very fast vibration. The okada resonates at only two point zero hertz. Resonance means a frequency match.",
  "11.2": "Mistake two. Forgetting the units. Two point five times two point zero is five point zero metres per second, not five kilometres per hour.",
  "11.3": "Mistake three. Flipping the fraction. d over v is the time between ridges. The frequency is v over d.",
  "11.4": "Mistake four. A forced system does not vibrate at its own frequency; it follows the driver. And extra load does not steady it. It moves the danger lower.",
  "12.1": "To sum up. Free vibration is at f nought, damped vibration dies away, and forced vibration follows the driver.",
  "12.2": "Resonance is when the driving frequency equals f nought, giving the greatest amplitude. Barton's equal-length cone shows it.",
  "12.3": "Ridges push at f equals v over d, so the danger speed is v equals d f nought. Damping lowers the peak. More mass moves it lower.",
  "13.1": "Your turn. A loaded danfo's suspension has a natural frequency of one point two hertz. Speed bumps on an estate road are four point five metres apart.",
  "13.2": "Find the speed that causes resonance, in kilometres per hour. Then say what happens to it when more passengers board. Pause the video and try it now.",
  "13.3": "Here is the solution. v equals d f nought, four point five times one point two, which is five point four metres per second.",
  "13.4": "Times three point six gives nineteen point four four, about nineteen kilometres per hour.",
  "13.5": "More passengers mean more mass, a lower natural frequency, and so a lower dangerous speed. Now on to the Apply questions."
};
const c = (id, ops, extra) => Object.assign({ say: N[id], ops }, extra || {});

module.exports = {
  meta: {
    title: 'Resonance: Solving the Ridge Road Case', subtitle: 'Lesson 07 · Why exactly 18 km/h cracks the crates',
    eq: 'f = v/d   resonance: f = f₀', subject: 'Physics', level: 'SS2 · WAEC / NECO / JAMB',
    next: '#apply', nextLabel: 'Continue to Apply →',
    roles: {
      f: { color: 'blue', name: 'driving frequency' }, f0: { color: 'gold', name: 'natural frequency' }, v: { color: 'orange', name: 'speed' },
      d: { color: 'green', name: 'ridge spacing' }, A: { color: 'purple', name: 'amplitude' }, g: { color: 'red', name: 'lift-off threshold' }
    },
    captionFixes: { 'f nought': 'f₀', 'omega squared A': 'ω²A', 'p d': 'p.d.' }
  },
  checks: [
    // Story model and chapter 5
    { name: 'okada f0 = 2.0 Hz (T0 0.50 s)', approx: [[f0of(200), 2.0, 1], [1 / f0of(200), 0.50, 2]] },
    ['18 km/h in m/s', 18 / 3.6, 5.0], ['f at 18 km/h', 5.0 / 2.5, 2.0], ['gap time at 18 = T0', 2.5 / 5.0, 0.50],
    { name: 'f at 10 and 30 km/h', approx: [[10 / 3.6 / 2.5, 1.11, 2], [30 / 3.6 / 2.5, 3.33, 2]] },
    // Barton (chapter 4)
    { name: 'Barton sqrt', approx: [[Math.sqrt(0.60 / 9.8), 0.2474, 4]] },
    { name: 'Barton T and f', approx: [[2 * PI * Math.sqrt(0.60 / 9.8), 1.55, 2], [2 * PI * Math.sqrt(0.60 / 9.8), 1.555, 3], [1 / (2 * PI * Math.sqrt(0.60 / 9.8)), 0.64, 2], [1 / 1.555, 0.64, 2]] },
    { name: 'rounding trap: 1/1.55 would give 0.65', approx: [[1 / 1.55, 0.65, 2]] },
    { name: 'driver 0.45 m is a different length', test: () => 0.45 !== 0.60 },
    // WE1 (chapter 6)
    ['WE1 v = d f0', 2.5 * 2.0, 5.0], ['WE1 km/h', 5.0 * 3.6, 18],
    { name: 'lift-off threshold 6.2 cm', approx: [[9.8 / (4 * PI * PI * 2.0 * 2.0) * 100, 6.2, 1], [9.8 / 158 * 100, 6.2, 1]] },
    { name: 'bounce at 18 km/h = 10.0 cm', approx: [[resp(18, 200, 0.05), 10.0, 1]] },
    { name: '10.0 cm exceeds 6.2 cm; ten times the 1.0 cm ridge push', test: () => resp(18, 200, 0.05) > 6.2 && Math.abs(10.0 / 1.0 - 10) < 1e-9 },
    // Resonance curve (chapter 7)
    { name: 'bench points', approx: [[resp(10, 200, .05), 1.4, 1], [resp(14, 200, .05), 2.5, 1], [resp(16, 200, .05), 4.4, 1], [resp(18, 200, .05), 10.0, 1], [resp(20, 200, .05), 3.9, 1], [resp(30, 200, .05), 0.6, 1]] },
    { name: 'leaking peak at 18 km/h', test: () => { let b = 0, bx = 0; for (let v = 8; v <= 32; v += 0.01) { const a = resp(v, 200, .05); if (a > b) { b = a; bx = v; } } return Math.abs(bx - 18) < 0.1 && Math.abs(b - 10.05) < 0.03; } },
    { name: 'lift-off line 6.21 cm at 18 km/h', approx: [[lift(18), 6.2, 1]] },
    { name: 'leaking curve climbs above the line only in a narrow band', test: () => { let lo = 99, hi = 0; for (let v = 12; v <= 32; v += 0.05) if (resp(v, 200, .05) >= lift(v)) { lo = Math.min(lo, v); hi = Math.max(hi, v); } return lo > 16.5 && hi < 19.5; } },
    { name: 'healthy peak 2.0 cm and never lifts off (200 and 250 kg)', test: () => { let b = 0, ok = true; for (let v = 5; v <= 35; v += 0.01) for (const m of [200, 250]) { const a = resp(v, m, .30); if (m === 200) b = Math.max(b, a); if (a >= lift(v)) ok = false; } return ok && Math.abs(b - 1.99) < 0.02; } },
    { name: 'healthy peak value', approx: [[resp(16.7, 200, .30), 2.0, 1]] },
    { name: 'graph fn strings match formulas', test: () => { for (let x = 9; x <= 31; x += 0.5) { if (Math.abs(evalFn(F200L, x) - resp(x, 200, .05)) > 1e-3) return false; if (Math.abs(evalFn(F200H, x) - resp(x, 200, .30)) > 1e-3) return false; if (Math.abs(evalFn(F250L, x) - resp(x, 250, .05)) > 1e-3) return false; } for (let x = 12; x <= 32; x += 1) if (Math.abs(evalFn(LIFT, x) - lift(x)) > 1e-6) return false; return true; } },
    // WE2 (chapter 8)
    ['WE2 k/m', 31600 / 250, 126.4],
    { name: 'WE2 f0 and speed', approx: [[Math.sqrt(126.4), 11.24, 2], [11.24 / 6.283, 1.79, 2], [2.5 * 1.79, 4.47, 2], [4.47 * 3.6, 16, 0], [(1 / (2 * PI)) * Math.sqrt(31600 / 250), 1.79, 2]] },
    { name: '250 kg at 16 km/h is 10.0 cm, and the peak sits at about 16 km/h', test: () => { let b = 0, bx = 0; for (let v = 8; v <= 32; v += 0.01) { const a = resp(v, 250, .05); if (a > b) { b = a; bx = v; } } return Math.abs(resp(16, 250, .05) - 10.0) < 0.05 && Math.abs(bx - 16.06) < 0.1 && b < 10.1; } },
    { name: 'line at 250 kg resonance = 7.8 cm (250 kg sag)', approx: [[lift(f0of(250) * 9), 7.8, 1], [250 * 9.8 / 31600 * 100, 7.8, 1]] },
    { name: '250 kg at 18 km/h is only 3.7 cm', approx: [[resp(18, 250, .05), 3.7, 1]] },
    { name: '250 kg lifts at 16 km/h not 18 km/h', test: () => resp(16, 250, .05) > lift(16) && resp(18, 250, .05) < lift(18) },
    // Case closed (chapter 9)
    { name: 'healthy at 18 km/h: 1.9 cm, no lift-off', approx: [[resp(18, 200, .30), 1.9, 1]] },
    { name: 'verdict 10 km/h or below: small and far below the line', test: () => resp(10, 200, .05) < 1.5 && resp(10, 250, .05) < 1.7 && lift(10) > 20 },
    { name: 'verdict reading: 10 km/h bounce 1.4 cm', approx: [[resp(10, 200, .05), 1.4, 1]] },
    { name: 'ratio r at 10 km/h below resonance', test: () => (10 / 3.6 / 2.5) / f0of(200) < 0.6 && (10 / 3.6 / 2.5) / f0of(250) < 0.63 },
    { name: '30 km/h: 0.6 cm against line 2.2 cm', approx: [[resp(30, 200, .05), 0.6, 1], [lift(30), 2.2, 1]] },
    // Your turn (chapter 13)
    ['turn v = 4.5 × 1.2', 4.5 * 1.2, 5.4], { name: 'turn km/h', approx: [[5.4 * 3.6, 19.44, 2], [5.4 * 3.6, 19, 0]] }
  ],
  chapters: [
    { title: 'Three speeds on Ridge Road', cues: [
      c('1.1', [{ clear: 'The Cracked Crates' }, { panel: K, s: { ...RB, v: 10, labels: 1, trace: 0, gauge: 0, readout: 1, readoutV: 'v = 10 km/h', readoutF: 'f = 1.11 Hz', focus: null }, fresh: 1 },
        { write: 'd1', tex: `${T('ridges: ')}${D('d')} = 2.5\\,\\text{m}`, note: 'story model', at: 2 }]),
      c('1.2', [{ write: 'r10', tex: `${Vv('10')}${T(' km/h')} \\to ${T('fine')}\\ \\checkmark` }]),
      c('1.3', [{ panel: K, s: { v: 30, readoutV: 'v = 30 km/h', readoutF: 'f = 3.33 Hz' } }, { write: 'r30', tex: `${Vv('30')}${T(' km/h')} \\to ${T('fine')}\\ \\checkmark` }]),
      c('1.4', [{ panel: K, s: { v: 18, readoutV: 'v = 18 km/h', readoutF: 'f = 2.0 Hz', focus: 'crate' } }, { camera: 'wide', focus: 'crate' }, { write: 'r18', tex: `${Vv('18')}${T(' km/h')} \\to ${T('cracked')}\\ \\times`, at: 2 }]),
      c('1.5', [{ camera: 'wide' }, { panel: K, s: { focus: null } }, { write: 'why', tex: T('Why only 18 km/h?') }]),
      c('1.6', [{ clear: 'By the end of this video' }, { write: 'o1', tex: `\\square\\ ${T('free, damped, forced')}` }, { write: 'o2', tex: `\\square\\ ${T("resonance, Barton's")}`, at: 1.2 },
        { write: 'o3', tex: `\\square\\ f = v/d,\\ v = d f_0`, at: 2.4 }, { write: 'o4', tex: `\\square\\ ${T('damping and load')}`, at: 3.6 }])
    ] },
    { title: 'Free, damped, forced', cues: [
      c('2.1', [{ clear: 'Three kinds of vibration' }, { panel: 'graph', s: { spec: TRACE, show: ['free'] }, fresh: 1 }, { hl: ['f0'] }, { write: 'free', tex: `${T('free: at its own ')}${F0('f_0')}` }]),
      c('2.2', [{ write: 'nopush', tex: T('no outside push'), note: 'ideal, no losses' }]),
      c('2.3', [{ panel: 'graph', s: { show: ['damped', 'env'] } }, { hl: ['A'] }, { write: 'damp', tex: `${T('damped: ')}${AA('A')}${T(' dies away')}` }]),
      c('2.4', [{ panel: 'graph', s: { show: ['forced'] } }, { hl: ['f'] }, { write: 'forc', tex: `${T('forced: at the driving ')}${F('f')}` }]),
      c('2.5', [{ write: 'key', tex: `${F0('f_0')}${T(' decides how big')}` }, { box: 'key' }])
    ] },
    { title: 'Pushes in step', cues: [
      c('3.1', [{ clear: 'Pushes in step' }, { panel: K, s: { ...RB, v: 18, labels: 0, trace: 1, gauge: 0, readout: 0, focus: null }, fresh: 1 }, { camera: 'wide' }, { write: 'in', tex: T('in step → energy adds') }]),
      c('3.2', [{ panel: K, s: { v: 30 } }, { write: 'out', tex: T('out of step → stays small') }]),
      c('3.3', [{ panel: K, s: { v: 18, focus: 'trace' } }, { camera: 'wide', focus: 'trace', drift: 0.4 }]),
      c('3.4', [{ panel: K, s: { gauge: 1, gaugeLabel: '10.0 cm', focus: null } }, { camera: 'wide' }, { hl: ['A'] }, { write: 'push', tex: `${T('ridge push ≈ ')}1.0\\,\\text{cm}`, at: 1 }, { write: 'bnc', tex: `${T('bounce → ')}${AA('10.0')}\\,\\text{cm}`, at: 3 }]),
      c('3.5', [{ clear: 'Resonance' }, { write: 'drv', tex: `${F('f')}\\ ${T('(driving)')} = ${F0('f_0')}` }, { write: 'amp', tex: `\\to ${T('greatest amplitude')}`, at: 2.5 }, { box: 'amp', at: 4 }])
    ] },
    { title: "Barton's pendulums", cues: [
      c('4.1', [{ clear: "Barton's pendulums" }, { panel: K, s: { scene: 'barton', driverL: 0.60, cones: [0.30, 0.45, 0.60, 0.75, 0.90], swing: 0, match: 0, labels: 1, readout: 0, slow: 2, focus: null }, fresh: 1 },
        { write: 'drv', tex: `${T('driver: ')}0.60\\,\\text{m}`, at: 1.5 }, { write: 'cns', tex: `${T('cones: ')}0.30\\ ${T('to')}\\ 0.90\\,\\text{m}`, at: 4 }]),
      c('4.2', [{ panel: K, s: { swing: 1 } }, { camera: 'kit', drift: 0.5 }], { hold: 4 }),
      c('4.3', [{ panel: K, s: { match: 1, focus: 'matched' } }, { camera: 'wide', focus: 'matched' }, { write: 'wid', tex: `0.60\\,\\text{m}\\ ${T('cone swings widest')}` }]),
      c('4.4', [{ camera: 'wide' }, { panel: K, s: { focus: null } }, { hl: ['f0'] }, { write: 'same', tex: `${T('same ')}l \\to ${T('same ')}${F0('f_0')} \\to ${T('resonance')}` }]),
      c('4.5', [{ clear: 'Driver frequency' }, { camera: 'board' }, { write: 'T1', tex: 'T = 2\\pi\\sqrt{l/g}' }, { write: 'T2', tex: 'T = 2\\pi\\sqrt{0.60/9.8}', at: 2.5 }]),
      c('4.6', [{ write: 'T3', tex: '\\phantom{T} = 2\\pi \\times 0.2474' }, { write: 'T4', tex: '\\phantom{T} = 1.55\\text{ s}', at: 2.2 }]),
      c('4.7', [{ clear: 'Step 2: frequency' }, { write: 'f1', tex: `${F('f')} = 1/T = 1/1.555`, note: 'unrounded T' }, { write: 'f2', tex: `\\phantom{f} = 0.64\\text{ Hz}`, at: 3 }, { box: 'f2', at: 4 }]),
      c('4.8', [{ camera: 'wide' }, { panel: K, s: { driverL: 0.45 } }, { write: 'sh', tex: `${T('driver 0.45 m → 0.45 m cone')}` }], { hold: 3 })
    ] },
    { title: 'The ridges are the driver', cues: [
      c('5.1', [{ clear: 'How often do ridges push?' }, { panel: K, s: { ...RB, v: 18, labels: 1, trace: 0, gauge: 0, readout: 0, focus: 'ridges' }, fresh: 1 }, { camera: 'wide', focus: 'ridges' }, { hl: ['d'] },
        { write: 'dd', tex: `${D('d')} = 2.5\\,\\text{m}${T(' between ridges')}` }]),
      c('5.2', [{ camera: 'wide' }, { panel: K, s: { focus: null } }, { write: 'tb', tex: `${T('time between = ')}${D('d')}/${Vv('v')}` }]),
      c('5.3', [{ hl: ['f'] }, { write: 'fv', tex: `${F('f')} = ${Vv('v')}/${D('d')}` }, { box: 'fv', at: 4 }]),
      c('5.4', [{ clear: 'At 18 km/h' }, { hl: ['v'] }, { write: 'v18', tex: `${Vv('v')} = 18/3.6 = 5.0\\,\\text{m/s}` }]),
      c('5.5', [{ panel: K, s: { readout: 1, readoutV: 'v = 18 km/h', readoutF: 'f = 2.0 Hz', focus: 'readout' } }, { camera: 'wide' }, { write: 'f18', tex: `${F('f')} = 5.0/2.5 = 2.0\\text{ Hz}` }]),
      c('5.6', [{ panel: K, s: { focus: null } }, { camera: 'wide' }, { write: 'f10', tex: `${T('10 km/h → ')}${F('f')} = 1.11\\text{ Hz}`, at: 3 }, { write: 'f30', tex: `${T('30 km/h → ')}${F('f')} = 3.33\\text{ Hz}`, note: 'both miss 2.0', at: 6 }])
    ] },
    { title: 'Worked example 1: the dangerous speed', cues: [
      c('6.1', [{ clear: 'Worked example 1' }, { camera: 'board' }, { write: 'giv', tex: `${D('d')} = 2.5\\,\\text{m},\\ ${F0('f_0')} = 2.0\\text{ Hz}` }, { write: 'q', tex: `${Vv('v')} = ?`, at: 3 }]),
      c('6.2', [{ write: 's1', tex: `${F('f')} = ${F0('f_0')},\\ ${T('so ')}${Vv('v')}/${D('d')} = ${F0('f_0')}` }]),
      c('6.3', [{ write: 's2', tex: `${Vv('v')} = ${D('d')}${F0('f_0')} = 2.5 \\times 2.0` }, { write: 's2b', tex: `\\phantom{v} = 5.0\\text{ m/s}`, at: 3.5 }]),
      c('6.4', [{ write: 's3', tex: `5.0 \\times 3.6 = 18\\text{ km/h}` }, { box: 's3', at: 4 }]),
      c('6.5', [{ clear: 'Will the crates lift?' }, { hl: ['g'] }, { write: 'lo', tex: `\\omega^2 ${AA('A')} \\ge ${G('g')}` }, { write: 'lo2', tex: `${AA('A')} \\ge ${G('g')}/\\omega^2 = 6.2\\text{ cm}`, at: 3.5 }]),
      c('6.6', [{ panel: K, s: { gauge: 1, gaugeLabel: '10.0 cm', labels: 0, focus: 'crate' } }, { camera: 'wide', focus: 'crate' }, { write: 'cmp', tex: `${AA('10.0')}\\text{ cm} > 6.2\\text{ cm}`, note: 'lift-off', at: 2.5 }])
    ] },
    { title: 'The resonance curve and the damper', cues: [
      c('7.1', [{ clear: 'The resonance curve' }, { panel: 'graph', s: { spec: AV, show: ['pts'] }, fresh: 1 }, { camera: 'wide' }, { write: 'av', tex: `${AA('A')}${T(' against ')}${Vv('v')}`, note: 'leaking damper' }]),
      c('7.2', [{ panel: 'graph', s: { show: ['pts', 'leakc', 'peakL'], pulse: 'peakL' } }, { camera: 'wide' }, { write: 'pk', tex: `${T('peak at 18 km/h')}`, at: 3 }, { write: 'pk2', tex: `${F('f')} = ${F0('f_0')}`, at: 5 }]),
      c('7.3', [{ camera: 'wide' }, { panel: 'graph', s: { show: ['pts', 'leakc', 'peakL', 'lift'], pulse: 'lift' } }, { hl: ['g'] }, { write: 'ab', tex: `${T('above red line → lift-off')}` }]),
      c('7.4', [{ clear: 'A healthy damper' }, { panel: 'graph', s: { show: ['pts', 'leakc', 'peakL', 'lift', 'healthc'] } }, { write: 'dmp', tex: `${T('damper: energy → heat')}` }]),
      c('7.5', [{ panel: 'graph', s: { show: ['pts', 'leakc', 'peakL', 'lift', 'healthc', 'peakH'], pulse: 'peakH' } }, { camera: 'wide' },
        { write: 'hp', tex: `${T('peak ≈ ')}2.0\\text{ cm}`, at: 1 }, { write: 'hp2', tex: T('lower, broader'), at: 3 }, { write: 'hp3', tex: T('never lifts off'), at: 5 }]),
      c('7.6', [{ clear: 'Height or position?' }, { camera: 'wide' }, { write: 'h1', tex: `${T('damping → height')}` }, { write: 'h2', tex: `m\\ ${T('and')}\\ k \\to ${T('position')}`, at: 3.5 }])
    ] },
    { title: 'Worked example 2: two extra crates', cues: [
      c('8.1', [{ clear: 'Worked example 2' }, { camera: 'board' }, { write: 'm', tex: 'm = 250\\text{ kg}' }, { write: 'kk', tex: 'k = 3.16 \\times 10^{4}\\text{ N/m}', at: 3 }]),
      c('8.2', [{ hl: ['f0'] }, { write: 'e1', tex: `${F0('f_0')} = \\tfrac{1}{2\\pi}\\sqrt{k/m}` }, { write: 'e2', tex: 'k/m = 31\\,600/250 = 126.4', at: 4 }]),
      c('8.3', [{ write: 'e3', tex: `${F0('f_0')} = 11.24/6.283 = 1.79\\text{ Hz}` }]),
      c('8.4', [{ clear: 'Step 2: the new speed' }, { write: 'e4', tex: `${Vv('v')} = 2.5 \\times 1.79 = 4.47\\text{ m/s}` }]),
      c('8.5', [{ write: 'e5', tex: `4.47 \\times 3.6 \\approx 16\\text{ km/h}`, note: 'more m, lower f0' }, { box: 'e5', at: 3 }]),
      c('8.6', [{ panel: 'graph', s: { show: ['pts', 'leakc', 'peakL', 'lift', 'healthc', 'peakH', 'c250', 'peak250'], pulse: 'peak250' } }, { camera: 'wide' },
        { write: 'p1', tex: `250\\text{ kg: }${AA('10.0')}\\text{ cm} > 7.8\\text{ cm}`, at: 1 }, { write: 'p2', tex: `${T('at 18 km/h: only ')}3.7\\text{ cm}`, at: 6 }])
    ] },
    { title: 'Case closed', cues: [
      c('9.1', [{ clear: 'Case closed' }, { panel: K, s: { ...RB, v: 18, labels: 0, trace: 1, gauge: 1, gaugeLabel: '10.0 cm', readout: 1, readoutV: 'v = 18 km/h', readoutF: 'f = 2.0 Hz', focus: null }, fresh: 1 }, { camera: 'wide' },
        { write: 'cc', tex: `18\\text{ km/h: }${F('f')} = 2.0\\text{ Hz} = ${F0('f_0')}`, note: 'story model' }]),
      c('9.2', [{ panel: K, s: { focus: 'damper' } }, { camera: 'wide', focus: 'damper' }, { write: 'ld', tex: `${T('leaking damper → ')}${AA('A')} > 6.2\\text{ cm}` }]),
      c('9.3', [{ camera: 'wide' }, { panel: K, s: { v: 30, gaugeLabel: '0.6 cm', readoutV: 'v = 30 km/h', readoutF: 'f = 3.33 Hz', focus: null } }, { write: 'sf', tex: `30\\text{ km/h: far from }${F0('f_0')}`, note: 'not faster = worse' }]),
      c('9.4', [{ clear: 'Advice' }, { panel: K, s: { damper: 'healthy', v: 18, gaugeLabel: '1.9 cm', readoutV: 'v = 18 km/h', readoutF: 'f = 2.0 Hz' } }, { write: 'a1', tex: T('1. replace the damper') }]),
      c('9.5', [{ panel: K, s: { damper: 'leaking', v: 10, gaugeLabel: '1.4 cm', readoutV: 'v = 10 km/h', readoutF: 'f = 1.11 Hz' } }, { write: 'a2', tex: `${T('2. cross at ≤ 10 km/h')}`, note: 'below 16 and 18' }]),
      c('9.6', [{ write: 'a3', tex: T('fast = passing 16–18 km/h') }])
    ] },
    { title: 'Useful and harmful resonance', cues: [
      c('10.1', [{ panel: null }, { clear: 'Useful resonance' }, { write: 'u1', tex: T('tuning a radio') }, { write: 'u2', tex: T('guitar, talking drum body'), at: 3.5 }]),
      c('10.2', [{ clear: 'Harmful: prevent it' }, { write: 'h1', tex: T('soldiers break step on bridges') }]),
      c('10.3', [{ write: 'p1', tex: T('add damping') }, { write: 'p2', tex: `${T('move ')}${F0('f_0')}${T(' (change m or k)')}`, at: 2.5 }, { write: 'p3', tex: `${T('avoid that driving ')}${F('f')}`, at: 5.5 }])
    ] },
    { title: 'Common mistakes', cues: [
      c('11.1', [{ clear: 'Common mistakes' }, { write: 'x1', tex: `\\times\\ ${T('resonance = very fast')}` }, { write: 'y1', tex: `\\checkmark\\ ${T('resonance: ')}${F('f')} = ${F0('f_0')}`, at: 4 }]),
      c('11.2', [{ write: 'x2', tex: `\\times\\ ${Vv('v')} = 5.0\\text{ km/h}` }, { write: 'y2', tex: `\\checkmark\\ 5.0\\text{ m/s} = 18\\text{ km/h}`, at: 4 }]),
      c('11.3', [{ clear: 'More mistakes' }, { write: 'x3', tex: `\\times\\ ${F('f')} = ${D('d')}/${Vv('v')}` }, { write: 'y3', tex: `\\checkmark\\ ${F('f')} = ${Vv('v')}/${D('d')}`, at: 3.5 }]),
      c('11.4', [{ write: 'y4', tex: `\\checkmark\\ ${T('forced: at the driving ')}${F('f')}`, at: 1 }, { write: 'y5', tex: `\\checkmark\\ ${T('more load → lower danger speed')}`, at: 5 }])
    ] },
    { title: 'Summary', cues: [
      c('12.1', [{ clear: 'Summary' }, { write: 'm1', tex: `${T('free: ')}${F0('f_0')}` }, { write: 'm2', tex: `${T('damped: ')}${AA('A')}${T(' dies')}`, at: 1.5 }, { write: 'm3', tex: `${T('forced: at driving ')}${F('f')}`, at: 3 }]),
      c('12.2', [{ write: 'm4', tex: `${T('resonance: ')}${F('f')} = ${F0('f_0')}${T(', A greatest')}` }]),
      c('12.3', [{ clear: 'Ridges and damping' }, { write: 'n1', tex: `${F('f')} = ${Vv('v')}/${D('d')},\\ ${Vv('v')} = ${D('d')}${F0('f_0')}` }, { write: 'n2', tex: T('damping lowers the peak'), at: 3.5 }, { write: 'n3', tex: T('more mass moves it lower'), at: 6 }])
    ] },
    { title: 'Your turn', cues: [
      c('13.1', [{ clear: 'Your turn' }, { write: 't1', tex: `${F0('f_0')} = 1.2\\text{ Hz},\\ ${D('d')} = 4.5\\text{ m}` }]),
      c('13.2', [{ write: 't2', tex: T('(a) resonant v in km/h?') }, { write: 't3', tex: T('(b) more passengers?'), at: 2.5 }], { hold: 15 }),
      c('13.3', [{ clear: 'Solution' }, { write: 'u1', tex: `${Vv('v')} = 4.5 \\times 1.2 = 5.4\\text{ m/s}` }]),
      c('13.4', [{ write: 'u2', tex: `5.4 \\times 3.6 = 19.44` }, { write: 'u3', tex: `\\phantom{5.4} \\approx 19\\text{ km/h}`, at: 2 }, { box: 'u3', at: 3 }]),
      c('13.5', [{ write: 'u4', tex: `${T('more m → lower ')}${F0('f_0')}${T(' → lower v')}` }])
    ] }
  ]
};
