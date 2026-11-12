// Lesson 03 explainer: series & parallel networks, cell arrays, power & efficiency.
// Direction script: 06-videos/lesson-03-direction-script.md (approved). Kits: circuit-network (plug-in), graph (built-in).
const k = (r, s) => `\\htmlClass{role-${r}}{${s}}`;
const E = s => k('E', s), I = s => k('I', s), V = s => k('V', s), R = s => k('R', s), r = s => k('r', s), P = s => k('P', s);
const O = '\\,\\Omega', A = '\\text{ A}', VV = '\\text{ V}', W = '\\text{ W}', PC = '\\,\\%';
const T = s => `\\text{${s}}`;
const NET = 'circuit-network';

// P–R and η–R for E = 5.0 V, r = 0.5 Ω: smooth curves computed from the formulas (never straight lines).
const Pfn = R_ => 25 * R_ / ((R_ + 0.5) * (R_ + 0.5));
const Efn = R_ => 100 * R_ / (R_ + 0.5);
const PR = { id: 'pr', x: [0, 4.5, 0.5], y: [0, 14, 2], xlabel: 'R (Ω)', ylabel: 'P (W)', xcolor: 'R', ycolor: 'P', items: [
  { id: 'pts', type: 'points', pts: [[0.1, 6.94], [0.5, 12.5], [1.0, 11.1], [2.0, 8.00], [4.0, 4.94]], hollow: true, color: 'P' },
  { id: 'curve', type: 'fn', fn: '25*x/((x+0.5)*(x+0.5))', domain: [0.01, 4.5], color: 'P' },
  { id: 'pguide', type: 'guide', at: [0.5, 12.5], color: 'r' },
  { id: 'peak', type: 'point', at: [0.5, 12.5], color: 'r', label: 'max 12.5 W at R = r', pos: 'e' }] };
const ETA = { id: 'eta', x: [0, 4.5, 0.5], y: [0, 120, 20], xlabel: 'R (Ω)', ylabel: 'η (%)', xcolor: 'R', ycolor: 'P', items: [
  { id: 'curve', type: 'fn', fn: '100*x/(x+0.5)', domain: [0.01, 4.5], color: 'P' },
  { id: 'pts', type: 'points', pts: [[0.1, 16.7], [0.5, 50.0], [1.0, 66.7], [2.0, 80.0], [4.0, 88.9]], hollow: true, color: 'P' },
  { id: 'g50', type: 'guide', at: [0.5, 50], color: 'r' },
  { id: 'p50', type: 'point', at: [0.5, 50], color: 'r', label: 'R = r: 50 %', pos: 'e' },
  { id: 'limit', type: 'line', from: [0, 100], to: [4.5, 100], color: 'white' },
  { id: 'limtxt', type: 'text', at: [2.3, 110], text: '100 % never reached', color: 'white' },
  { id: 'p4', type: 'point', at: [4.0, 88.9], color: 'P', label: '88.9 %', pos: 's' }] };

module.exports = {
  meta: {
    title: 'Networks, Cell Arrays, Power & Efficiency', subtitle: 'Lesson 03 · Line or side by side, and why the worn battery runs hot',
    eq: 'P = IV = I²R = V²/R   η = R/(R + r)', subject: 'Physics', level: 'SS2 · WAEC / NECO / JAMB',
    next: '#apply', nextLabel: 'Continue to Apply →',
    roles: {
      E: { color: 'gold', name: 'EMF' }, I: { color: 'green', name: 'current' }, V: { color: 'blue', name: 'p.d.' },
      R: { color: 'orange', name: 'resistance' }, r: { color: 'red', name: 'internal resistance / heat' }, P: { color: 'purple', name: 'power and efficiency' }
    },
    captionFixes: { 'E M Fs': 'EMFs', 'E M F': 'EMF', 'p d s': 'p.d.s', 'p d': 'p.d.', 'NEPA': 'NEPA/PHCN' }
  },
  checks: [
    // Chapter 2: series, ideal 12 V supply
    ['series R 4.0+6.0', 4.0 + 6.0, 10], ['series I 12/10', 12 / 10, 1.2], ['V1 1.2×4.0', 1.2 * 4.0, 4.8], ['V2 1.2×6.0', 1.2 * 6.0, 7.2],
    ['p.d.s add', 4.8 + 7.2, 12],
    // Chapter 3: parallel
    ['I1 12/4.0', 12 / 4.0, 3.0], ['I2 12/6.0', 12 / 6.0, 2.0], ['I total', 3.0 + 2.0, 5.0], ['R = 12/5.0', 12 / 5.0, 2.4],
    ['product 4×6', 4 * 6, 24], ['sum 4+6', 4 + 6, 10], ['product over sum', 24 / 10, 2.4], ['reciprocal rule', 1 / (1 / 4 + 1 / 6), 2.4],
    { name: 'parallel R below smaller branch', test: () => 2.4 < 4.0 },
    // Chapter 4: WE1 mixed network
    ['WE1 6×12', 6.0 * 12.0, 72], ['WE1 6+12', 6.0 + 12.0, 18], ['WE1 Rp', 72 / 18, 4.0], ['WE1 Rext', 3.0 + 4.0, 7.0],
    ['WE1 R+r', 7.0 + 1.0, 8.0], ['WE1 I', 14.0 / 8.0, 1.75], ['WE1 Vp', 1.75 * 4.0, 7.0],
    { name: 'WE1 branch currents', approx: [[7.0 / 6.0, 1.17, 2], [7.0 / 12.0, 0.58, 2]] },
    ['WE1 branches add back', 1.17 + 0.58, 1.75],
    // Chapter 6: WE2 cell arrays
    ['WE2 parallel r', 2.0 / 4, 0.5], ['WE2 parallel R+r', 1.0 + 0.5, 1.5], ['WE2 parallel I', 1.5 / (1.0 + 0.5), 1.0],
    ['WE2 series E', 4 * 1.5, 6.0], ['WE2 series r', 4 * 2.0, 8.0], ['WE2 series R+r', 1.0 + 8.0, 9.0],
    { name: 'WE2 series I', approx: [[6.0 / 9.0, 0.67, 2]] },
    { name: 'parallel wins for 1.0 Ω pump', test: () => 1.0 > 6.0 / 9.0 },
    { name: 'series wins for high-R loads (crossover 2.0 Ω, 0.60 A)', test: () => Math.abs(6 / (2 + 8) - 1.5 / (2 + 0.5)) < 1e-12 && 6 / (10 + 8) > 1.5 / (10 + 0.5) },
    // Chapter 7: power and kWh
    ['kWh in J', 1000 * 3600, 3.6e6], ['freezer kW', 750 / 1000, 0.75], ['freezer kWh', 0.75 * 8.0, 6.0], ['freezer J', 6.0 * 3.6e6, 2.16e7],
    // Chapter 8: WE3 power split
    ['WE3 R+r', 4.5 + 0.5, 5.0], ['WE3 I', 5.0 / (4.5 + 0.5), 1.0], ['WE3 load P', 1.0 ** 2 * 4.5, 4.5], ['WE3 total EI', 5.0 * 1.0, 5.0],
    ['WE3 wasted I²r', 1.0 ** 2 * 0.5, 0.5], ['WE3 split adds', 4.5 + 0.5, 5.0], ['WE3 η', 4.5 / 5.0 * 100, 90], ['WE3 η short cut', 4.5 / (4.5 + 0.5) * 100, 90],
    ['WE3 η = V/E', (5.0 - 1.0 * 0.5) / 5.0 * 100, 90],
    ['worn bar useful', 3.0 ** 2 * 2.8, 25.2], ['worn bar heat', 3.0 ** 2 * 1.2, 10.8], ['worn I', 12 / (2.8 + 1.2), 3.0],
    // Chapter 9: curves
    { name: 'P–R points', approx: [[Pfn(0.1), 6.94, 2], [Pfn(0.5), 12.5, 1], [Pfn(1.0), 11.1, 1], [Pfn(2.0), 8.00, 2], [Pfn(4.0), 4.94, 2]] },
    { name: 'η–R points', approx: [[Efn(0.1), 16.7, 1], [Efn(0.5), 50.0, 1], [Efn(1.0), 66.7, 1], [Efn(2.0), 80.0, 1], [Efn(4.0), 88.9, 1]] },
    { name: 'P peaks at R = r = 0.5', test: () => { let best = 0, bx = 0; for (let x = 0.01; x <= 4.5; x += 0.001) { const p = Pfn(x); if (p > best) { best = p; bx = x; } } return Math.abs(bx - 0.5) < 0.002 && Math.abs(best - 12.5) < 1e-4; } },
    ['η at R = r', 0.5 / 1.0 * 100, 50], ['R + r at peak', 0.5 + 0.5, 1.0],
    { name: 'η below 100 everywhere', test: () => Efn(1e6) < 100 },
    { name: 'graph fn strings match formulas', same: [x => 25 * x / ((x + 0.5) * (x + 0.5)), Pfn], range: [0.01, 4.5] },
    // Chapter 10: mistakes
    ['1/R = 0.50 → R', 1 / 0.50, 2.0],
    // Chapter 12: your turn (fresh numbers)
    ['YT 2×6', 2.0 * 6.0, 12], ['YT 2+6', 2.0 + 6.0, 8], ['YT Rp', 12 / 8, 1.5], ['YT E_t', 2 * 2.0, 4.0], ['YT r_t', 2 * 0.25, 0.50],
    ['YT R+r', 1.5 + 0.50, 2.0], ['YT I', 4.0 / (1.5 + 0.50), 2.0], ['YT P', 2.0 ** 2 * 1.5, 6.0], ['YT η', 1.5 / 2.0 * 100, 75],
    ['YT EI', 4.0 * 2.0, 8.0], ['YT check', 6.0 / 8.0 * 100, 75], ['YT branch 2 Ω (kit)', 3.0 / 2.0, 1.5], ['YT Vp', 2.0 * 1.5, 3.0]
  ],
  chapters: [
    { title: "Emeka's backup pump", cues: [
      { say: "Emeka's shop needs a backup pump, and he has three cells. Should he join them in a line, or side by side?", ops: [
        { clear: 'Line or side by side?' },
        { panel: NET, s: { n: 3, arr: 'series', cellLabel: 'E, r', showr: 1, E: 1.5, r: 1, layout: 'single', load: 'pump', L1: 'pump', R1: 1, flow: 1 }, fresh: 1 },
        { write: 'h1', tex: `3\\ ${T('cells')} \\to 1\\ ${T('pump')}` }] },
      { say: "Tobe says side by side gives more voltage. But the pump has a low resistance and pulls a big current.", ops: [
        { panel: NET, s: { arr: 'parallel' } },
        { write: 'h2', tex: `${T('Tobe: side by side = more ')}${V('V')}\\,?` }] },
      { say: "And why was the worn battery hot after the last test?", ops: [
        { panel: NET, s: { heat: 1 } }, { camera: 'wide', focus: 'src' },
        { write: 'h3', tex: `${T('worn battery runs ')}${r(T('hot'))}${T('. Why?')}` }] },
      { say: "By the end, you will reduce networks, combine cells, and calculate power, energy and efficiency.", ops: [
        { clear: 'By the end of this video' }, { panel: NET, s: { heat: 0 } }, { camera: 'wide' },
        { write: 'o1', tex: `\\square\\ ${T('series and parallel ')}${R('R')}` },
        { write: 'o2', tex: `\\square\\ ${T('mixed networks')}`, at: 2 },
        { write: 'o3', tex: `\\square\\ ${T('cells in series / parallel')}`, at: 3.5 },
        { write: 'o4', tex: `\\square\\ ${P(T('power, kWh, efficiency'))}`, at: 5 }] }
    ] },
    { title: 'One path: series', cues: [
      { say: "Here are four point zero and six point zero ohm resistors in series, on an ideal twelve volt supply with no internal resistance.", ops: [
        { clear: 'Series: one path' },
        { panel: NET, s: { n: 1, cellLabel: '12 V ideal', showr: 0, E: 12, r: 0, layout: 'series', R1: 4, R2: 6, R3: 0, L1: '4.0 Ω', L2: '6.0 Ω', flow: 1 }, fresh: 1 },
        { write: 's1', tex: `${R('4.0' + O)}${T(' and ')}${R('6.0' + O)}${T(', ')}${E('12' + VV)}` }] },
      { say: "There is only one path, so the current is the same everywhere in a series circuit.", ops: [
        { panel: NET, s: { focus: 'load' } }, { hl: ['I'] },
        { write: 's2', tex: `${T('same ')}${I('I')}${T(' everywhere')}` }] },
      { say: "The resistances simply add. Four point zero plus six point zero gives ten ohms.", ops: [
        { hl: ['R'] }, { write: 's3', tex: `${R('R')} = ${R('R_1')} + ${R('R_2')}` },
        { write: 's4', tex: `\\phantom{R} = 4.0 + 6.0 = ${R('10' + O)}`, at: 2.2 }] },
      { say: "So the current is twelve over ten, which is one point two amps, through both resistors.", ops: [
        { panel: NET, s: { focus: null, I1: '1.2 A', I2: '1.2 A' } },
        { write: 's5', tex: `${I('I')} = 12/10 = ${I('1.2' + A)}` }] },
      { say: "Each resistor takes its share of the p d. Four point eight volts across the first, seven point two volts across the second.", ops: [
        { clear: 'P.d.s add' }, { panel: NET, s: { V1: '4.8 V', V2: '7.2 V' } },
        { write: 'p1', tex: `${V('V_1')} = 1.2 \\times 4.0 = ${V('4.8' + VV)}` },
        { write: 'p2', tex: `${V('V_2')} = 1.2 \\times 6.0 = ${V('7.2' + VV)}`, at: 3.5 }] },
      { say: "Together they make the whole twelve volts. Series rule: one current, the p d s add, and the resistances add.", ops: [
        { write: 'p3', tex: `${V('4.8')} + ${V('7.2')} = ${E('12' + VV)}` },
        { write: 'p4', tex: `${R('R')} = ${R('R_1')} + ${R('R_2')} + \\dots`, at: 3 }, { box: 'p4' }] }
    ] },
    { title: 'Side by side: parallel', cues: [
      { say: "Now put the same two resistors side by side, across the same twelve volt supply.", ops: [
        { clear: 'Parallel: shared p.d.' },
        { panel: NET, s: { layout: 'parallel', I1: '', I2: '', V1: '', V2: '' } },
        { write: 'q1', tex: `${R('4.0' + O)} \\parallel ${R('6.0' + O)}${T(' on ')}${E('12' + VV)}` }] },
      { say: "Each branch sits straight across the supply, so each gets the full twelve volts. In parallel, the p d is the same.", ops: [
        { panel: NET, s: { V1: '12 V', V2: '12 V' } }, { hl: ['V'] },
        { write: 'q2', tex: `${T('same ')}${V('V')}${T(' across each branch')}` }] },
      { say: "At the junction the current splits. Twelve over four point zero is three point zero amps. Twelve over six point zero is two point zero amps.", ops: [
        { panel: NET, s: { split: 1, I1: '3.0 A', I2: '2.0 A' } }, { camera: 'wide', focus: 'node' },
        { write: 'q3', tex: `${I('I_1')} = 12/4.0 = ${I('3.0' + A)}`, at: 3 },
        { write: 'q4', tex: `${I('I_2')} = 12/6.0 = ${I('2.0' + A)}`, at: 6 }] },
      { say: "The branch currents add up. Three point zero plus two point zero is five point zero amps from the supply.", ops: [
        { panel: NET, s: { split: 0, Imain: '5.0 A' } }, { camera: 'wide' },
        { write: 'q5', tex: `${I('I')} = 3.0 + 2.0 = ${I('5.0' + A)}` }] },
      { say: "So the whole network behaves like twelve over five point zero, which is two point four ohms.", ops: [
        { clear: 'Equivalent resistance' }, { panel: NET, s: { stage: 1, Lp: '2.4 Ω', V1: '', V2: '', I1: '', I2: '' } },
        { write: 'e1', tex: `${R('R')} = 12/5.0 = ${R('2.4' + O)}` }] },
      { say: "The rule is one over R equals one over R one plus one over R two. For two resistors, use product over sum: twenty-four over ten, two point four ohms again.", ops: [
        { write: 'e2', tex: `1/${R('R')} = 1/${R('R_1')} + 1/${R('R_2')}` },
        { write: 'e3', tex: `${R('R')} = ${R('R_1R_2')}/(${R('R_1')} + ${R('R_2')})`, at: 5 },
        { write: 'e4', tex: `\\phantom{R} = 24/10 = ${R('2.4' + O)}`, at: 8.5 }, { box: 'e3' }] },
      { say: "Notice. Two point four ohms is smaller than the smaller branch. An extra path lets more current through.", ops: [
        { panel: NET, s: { stage: 0 } },
        { write: 'e5', tex: `${R('2.4' + O)} < ${R('4.0' + O)}`, note: 'extra path' }] }
    ] },
    { title: 'Collapsing a mixed network', cues: [
      { say: "Worked example. A fourteen point zero volt battery with internal resistance one point zero ohm feeds three point zero ohms, in series with six point zero and twelve point zero ohms in parallel.", ops: [
        { clear: 'Mixed network' },
        { panel: NET, s: { n: 1, cellLabel: '14.0 V · 1.0 Ω', showr: 1, E: 14, r: 1, layout: 'mixed', R1: 3, R2: 6, R3: 12, L1: '3.0 Ω', L2: '6.0 Ω', L3: '12.0 Ω', flow: 1 }, fresh: 1 },
        { write: 'm1', tex: `${E('E = 14.0' + VV)},\\ ${r('r = 1.0' + O)}` },
        { write: 'm2', tex: `${R('3.0' + O)} + (${R('6.0' + O)} \\parallel ${R('12.0' + O)})`, at: 6 }] },
      { say: "Find the total current and the current in the six point zero ohm branch. Collapse the network from the inside out.", ops: [
        { camera: 'wide', focus: 'pair', at: 3 },
        { write: 'm3', tex: `${I('I')} = ?\\quad ${I('I_6')} = ?` }] },
      { say: "Step one. Reduce the parallel pair. Six point zero times twelve point zero, over their sum. Seventy-two over eighteen is four point zero ohms.", ops: [
        { clear: 'Step 1: the pair' }, { camera: 'wide' },
        { write: 'm4', tex: `${R('R_p')} = (6.0 \\times 12.0)/(6.0 + 12.0)` },
        { panel: NET, s: { stage: 1, Lp: '4.0 Ω' }, at: 6 },
        { write: 'm5', tex: `\\phantom{R_p} = 72/18 = ${R('4.0' + O)}`, at: 6 }] },
      { say: "Step two. Now the outside is all in series. Three point zero plus four point zero is seven point zero ohms.", ops: [
        { panel: NET, s: { stage: 2, Lext: '7.0 Ω' } },
        { write: 'm6', tex: `${R('R_{ext}')} = 3.0 + 4.0 = ${R('7.0' + O)}` }] },
      { say: "Step three. Add the internal resistance. Fourteen point zero over eight point zero is one point seven five amps.", ops: [
        { clear: 'Step 3: total current' }, { hl: ['r'] },
        { write: 'm7', tex: `${I('I')} = ${E('E')}/(${R('R_{ext}')} + ${r('r')})` },
        { write: 'm8', tex: `\\phantom{I} = 14.0/8.0 = ${I('1.75' + A)}`, at: 6 }, { box: 'm8' },
        { panel: NET, s: { Imain: '1.75 A' }, at: 7 }] },
      { say: "Step four. Open the pair back up. The p d across it is one point seven five times four point zero, which is seven point zero volts.", ops: [
        { clear: 'Step 4: the branches' }, { panel: NET, s: { stage: 0, Vp: '7.0 V' } }, { camera: 'wide', focus: 'pair' },
        { write: 'm9', tex: `${V('V_p')} = 1.75 \\times 4.0 = ${V('7.0' + VV)}` }] },
      { say: "So the six ohm branch takes seven point zero over six point zero, one point one seven amps.", ops: [
        { panel: NET, s: { I2: '1.17 A' } },
        { write: 'm10', tex: `${I('I_6')} = 7.0/6.0 = ${I('1.17' + A)}` }, { box: 'm10' }] },
      { say: "Check. The twelve ohm branch takes seven point zero over twelve point zero, zero point five eight amps. Together, one point seven five amps. It works. The smaller resistance takes the bigger share.", ops: [
        { panel: NET, s: { I3: '0.58 A' } }, { camera: 'wide', focus: 'node' },
        { write: 'm11', tex: `${I('I_{12}')} = 7.0/12.0 = ${I('0.58' + A)}` },
        { write: 'm12', tex: `1.17 + 0.58 = ${I('1.75' + A)}\\ \\checkmark`, at: 6 },
        { camera: 'wide', at: 9 }, { write: 'm13', tex: `${T('smaller ')}${R('R')} \\to ${T('bigger share of ')}${I('I')}`, at: 10 }] }
    ] },
    { title: 'Cells in series and in parallel', cues: [
      { say: "Back to Emeka's three cells. Each cell has an E M F, capital E, and an internal resistance, small r.", ops: [
        { clear: 'Cell arrays' },
        { panel: NET, s: { n: 3, arr: 'series', cellLabel: 'E, r', showr: 1, E: 1.5, r: 1, layout: 'single', load: 'pump', L1: 'pump', R1: 1, flow: 1 }, fresh: 1 },
        { camera: 'wide', focus: 'cells' },
        { write: 'c1', tex: `${T('each cell: ')}${E('E')}${T(' and ')}${r('r')}` }] },
      { say: "In series, the E M Fs add, but so do the internal resistances. Three cells give three E and three r.", ops: [
        { panel: NET, s: { badge: '3E, 3r' } }, { camera: 'wide', focus: 'badge', at: 4 },
        { write: 'c2', tex: `${T('series: ')}${E('E_t = nE')},\\ ${r('r_t = nr')}` }] },
      { say: "In parallel, the E M F stays that of one cell. Sorry Tobe, side by side does not add voltage.", ops: [
        { panel: NET, s: { arr: 'parallel', badge: 'E, r/3' } }, { camera: 'wide' },
        { write: 'c3', tex: `${T('parallel: ')}${E('E_t = E')}`, note: 'Tobe ✗' }] },
      { say: "But the internal resistances divide. Three identical cells give r over three. Less resistance inside means more current.", ops: [
        { hl: ['r'] }, { write: 'c4', tex: `\\phantom{\\text{parallel: }}${r('r_t = r/n')}` }, { box: 'c4' }] }
    ] },
    { title: 'Which array drives the pump?', cues: [
      { say: "Worked example. Four identical cells, each one point five volts with internal resistance two point zero ohms, feed a one point zero ohm pump. Compare parallel with series.", ops: [
        { clear: 'Four cells, one pump' },
        { panel: NET, s: { n: 4, arr: 'parallel', cellLabel: '1.5 V · 2.0 Ω', showr: 1, E: 1.5, r: 2, layout: 'single', load: 'pump', L1: '1.0 Ω pump', R1: 1, flow: 1 }, fresh: 1 },
        { write: 'w1', tex: `${T('each cell: ')}${E('1.5' + VV)},\\ ${r('2.0' + O)}` },
        { write: 'w2', tex: `${T('pump: ')}${R('1.0' + O)}`, at: 6 }] },
      { say: "Step one, parallel. The E M F stays one point five volts. The internal resistance is two point zero over four, zero point five ohm.", ops: [
        { clear: 'Step 1: parallel' }, { panel: NET, s: { badge: '1.5 V · 0.5 Ω' } },
        { write: 'w3', tex: `${E('E_t = 1.5' + VV)}` },
        { write: 'w4', tex: `${r('r_t')} = 2.0/4 = ${r('0.5' + O)}`, at: 3.5 }] },
      { say: "The current is one point five over one point zero plus zero point five, which is one point zero amp.", ops: [
        { write: 'w5', tex: `${I('I')} = 1.5/(1.0 + 0.5)` },
        { write: 'w6', tex: `\\phantom{I} = ${I('1.0' + A)}`, at: 5 }, { box: 'w6' },
        { panel: NET, s: { Imain: '1.0 A' }, at: 5 }] },
      { say: "Step two, series. The E M Fs add to six point zero volts, but the internal resistances add to eight point zero ohms.", ops: [
        { clear: 'Step 2: series' }, { panel: NET, s: { arr: 'series', badge: '6.0 V · 8.0 Ω', Imain: '' } },
        { write: 'w7', tex: `${E('E_t')} = 4 \\times 1.5 = ${E('6.0' + VV)}` },
        { write: 'w8', tex: `${r('r_t')} = 4 \\times 2.0 = ${r('8.0' + O)}`, at: 3 }] },
      { say: "The current is six point zero over one point zero plus eight point zero, only zero point six seven amps.", ops: [
        { camera: 'wide', focus: 'load' },
        { write: 'w9', tex: `${I('I')} = 6.0/(1.0 + 8.0)` },
        { write: 'w10', tex: `\\phantom{I} = ${I('0.67' + A)}`, at: 5 }, { panel: NET, s: { Imain: '0.67 A' }, at: 5 }] },
      { say: "One point zero amp beats zero point six seven amps. For a low resistance pump, parallel wins. Tobe's extra voltage was eaten inside the cells.", ops: [
        { clear: 'Verdict' }, { camera: 'wide' },
        { write: 'w11', tex: `${I('1.0' + A)} > ${I('0.67' + A)}` },
        { write: 'w12', tex: T('parallel wins here'), at: 4 }, { box: 'w12' }] },
      { say: "For a high resistance load, series would win instead. It depends on the load.", ops: [
        { write: 'w13', tex: `${T('high-')}${R('R')}${T(' load')} \\to ${T('series')}` }] }
    ] },
    { title: 'Power and the kilowatt-hour', cues: [
      { say: "Electrical power is the rate at which electrical energy changes into other forms, in watts, or joules per second.", ops: [
        { clear: 'Electrical power' }, { panel: null }, { camera: 'wide' }, { hl: ['P'] },
        { write: 'k1', tex: `${P('P')} = ${I('I')}${V('V')}`, note: '1 W = 1 J/s' }] },
      { say: "Using V equals I R gives two more forms: I squared R, and V squared over R. Pick the one that fits your data.", ops: [
        { write: 'k2', tex: `${P('P')} = ${I('I')}${V('V')} = ${I('I')}^2${R('R')} = ${V('V')}^2/${R('R')}` }, { box: 'k2' }] },
      { say: "Energy is power multiplied by time, so W equals I V t.", ops: [
        { write: 'k3', tex: `W = ${P('P')}t = ${I('I')}${V('V')}t` }] },
      { say: "On a NEPA prepaid meter, one unit is one kilowatt-hour. That is one thousand watts for three thousand six hundred seconds, which is three point six million joules.", ops: [
        { clear: 'The kilowatt-hour' },
        { write: 'k4', tex: `1\\ ${T('kWh')} = 1000${W} \\times 3600\\ ${T('s')}` },
        { write: 'k5', tex: `\\phantom{1\\ \\text{kWh}} = ${P('3.6 \\times 10^6\\ \\text{J}')}`, at: 7 }, { box: 'k5' }] },
      { say: "A seven hundred and fifty watt freezer runs for eight point zero hours. Zero point seven five kilowatts times eight point zero hours is six point zero kilowatt-hours.", ops: [
        { write: 'k6', tex: `0.75\\ ${T('kW')} \\times 8.0\\ ${T('h')} = ${P('6.0\\ \\text{kWh}')}` }] },
      { say: "That is two point one six times ten to the seven joules. The kilowatt-hour is energy, never power.", ops: [
        { write: 'k7', tex: `= ${P('2.16 \\times 10^7\\ \\text{J}')}`, note: 'energy, not power' }, { box: 'k7' }] }
    ] },
    { title: 'Where the power goes', cues: [
      { say: "The cell's total power, E times I, splits. The load gets I squared R. The rest, I squared r, heats the cell.", ops: [
        { clear: 'The power split' },
        { panel: NET, s: { n: 1, cellLabel: '5.0 V · 0.5 Ω', showr: 1, E: 5, r: 0.5, layout: 'single', load: 'resistor', R1: 4.5, L1: '4.5 Ω', flow: 1, bar: 1, Puse: 4.5, Pwaste: 0.5, barLabels: 0 }, fresh: 1 },
        { camera: 'wide', focus: 'bar', at: 3 }, { hl: ['P', 'r'] },
        { write: 'x1', tex: `${E('E')}${I('I')} = ${P('I^2R')} + ${r('I^2r')}` }] },
      { say: "Worked example. A five point zero volt cell with zero point five ohm internal resistance drives four point five ohms. Find the load power and efficiency.", ops: [
        { camera: 'wide' },
        { write: 'x2', tex: `${E('5.0' + VV)},\\ ${r('0.5' + O)},\\ ${R('4.5' + O)}` }] },
      { say: "Step one. The current is five point zero over four point five plus zero point five, which is one point zero amp.", ops: [
        { clear: 'Steps 1 and 2' }, { camera: 'board' },
        { write: 'x3', tex: `${I('I')} = 5.0/(4.5 + 0.5) = ${I('1.0' + A)}` }] },
      { say: "Step two. Load power, I squared R, is one point zero squared times four point five, four point five watts. Total power, E times I, is five point zero watts.", ops: [
        { write: 'x4', tex: `${P('P')} = 1.0^2 \\times 4.5 = ${P('4.5' + W)}` },
        { write: 'x5', tex: `${E('E')}${I('I')} = 5.0 \\times 1.0 = 5.0${W}`, at: 6 }] },
      { say: "So zero point five watts is lost inside as heat. That is I squared r, one point zero squared times zero point five.", ops: [
        { camera: 'wide', focus: 'bar' },
        { panel: NET, s: { barLabels: 1, PuseL: '4.5 W useful', PwasteL: '0.5 W heat' } },
        { write: 'x6', tex: `${r('I^2r')} = 1.0^2 \\times 0.5 = ${r('0.5' + W)}` }] },
      { say: "Step three. Efficiency is useful power over total power. Four point five over five point zero is ninety percent. The short cut, R over R plus r, gives the same.", ops: [
        { clear: 'Step 3: efficiency' }, { camera: 'wide' },
        { write: 'x7', tex: `\\eta = 4.5/5.0 \\times 100 = ${P('90' + PC)}` }, { box: 'x7' },
        { write: 'x8', tex: `\\eta = ${R('R')}/(${R('R')} + ${r('r')}) = ${V('V')}/${E('E')}`, at: 7 }] },
      { say: "Emeka's worn battery has a bigger internal resistance, so a much bigger share of its power burns inside as I squared r. That is why it runs hot.", ops: [
        { panel: NET, s: { cellLabel: 'worn: big r', E: 12, r: 1.2, R1: 2.8, L1: '2.8 Ω', Puse: 25.2, Pwaste: 10.8, barLabels: 0, heat: 1 } },
        { camera: 'wide', focus: 'src', at: 2 },
        { write: 'x9', tex: `${T('bigger ')}${r('r')} \\to ${T('more ')}${r('I^2r')}${T(' heat')}` }] }
    ] },
    { title: 'Maximum power is not maximum efficiency', cues: [
      { say: "Keep the same cell and change the load. Load power is E squared R over R plus r, all squared.", ops: [
        { clear: 'Power against load' }, { panel: 'graph', s: { spec: PR, show: ['pts'] }, fresh: 1 }, { camera: 'wide' },
        { write: 'g1', tex: `${P('P')} = ${E('E')}^2${R('R')}/(${R('R')} + ${r('r')})^2` }] },
      { say: "Tiny R gives almost no p d across the load. Huge R gives almost no current. In between, the power peaks.", ops: [
        { panel: 'graph', s: { show: ['pts', 'curve'] } },
        { write: 'g2', tex: T('smooth curve, one peak') }] },
      { say: "The peak is at R equals r, zero point five ohm: twelve point five watts. Maximum power comes when the load matches the internal resistance.", ops: [
        { panel: 'graph', s: { show: ['pts', 'curve', 'pguide', 'peak'], pulse: 'peak' } }, { camera: 'wide', focus: ['peak', 'pguide'] },
        { write: 'g3', tex: `${T('max ')}${P('P')}${T(' when ')}${R('R')} = ${r('r')}` }, { box: 'g3' },
        { write: 'g4', tex: `${P('12.5' + W)}${T(' at ')}${R('0.5' + O)}`, at: 4 }] },
      { say: "But at that peak, the efficiency is zero point five over one point zero, only fifty percent. Half the power heats the cell.", ops: [
        { clear: 'Efficiency against load' }, { camera: 'wide' },
        { panel: 'graph', s: { spec: ETA, show: ['curve', 'g50', 'p50'] } },
        { write: 'g5', tex: `${R('R')} = ${r('r')}:\\ \\eta = 0.5/1.0 = ${P('50' + PC)}` }] },
      { say: "As R grows, efficiency climbs towards one hundred percent. At four point zero ohms it is eighty-eight point nine percent, but the power is only four point nine four watts.", ops: [
        { panel: 'graph', s: { show: ['curve', 'g50', 'p50', 'pts', 'limit', 'limtxt', 'p4'], pulse: 'p4' } },
        { write: 'g6', tex: `${R('4.0' + O)}:\\ \\eta = ${P('88.9' + PC)}` },
        { write: 'g7', tex: `${T('but ')}${P('P')} = ${P('4.94' + W)}`, at: 7 }] },
      { say: "So, maximum power needs R equal to r. High efficiency needs R much bigger than r. Draw both graphs as smooth curves, never straight lines.", ops: [
        { clear: 'The trade-off' },
        { write: 'g8', tex: `${T('high ')}\\eta${T(' needs ')}${R('R')} \\gg ${r('r')}` }, { box: 'g8' },
        { write: 'g9', tex: T('smooth curves, not lines'), at: 5 }] }
    ] },
    { title: 'Mistakes that cost marks', cues: [
      { say: "First mistake: adding the E M Fs of parallel cells. They keep one E M F; only r divides.", ops: [
        { clear: 'Common mistakes' }, { panel: null },
        { write: 'z1', tex: `\\times\\ ${T('parallel: ')}${E('E_t = nE')}` },
        { write: 'z2', tex: `\\checkmark\\ ${T('parallel: ')}${E('E_t = E')},\\ ${r('r_t = r/n')}`, at: 4 }] },
      { say: "Second: stopping at one over R. If one over R is zero point five zero, R is two point zero ohms.", ops: [
        { write: 'z3', tex: `\\times\\ ${T('stop at ')}1/${R('R')}` },
        { write: 'z4', tex: `\\checkmark\\ 1/${R('R')} = 0.50 \\to ${R('R = 2.0' + O)}`, at: 3 }] },
      { say: "Third. Calling the kilowatt-hour a unit of power. It is a unit of energy, three point six million joules.", ops: [
        { clear: 'More mistakes' },
        { write: 'z5', tex: `\\times\\ ${T('kWh = power')}` },
        { write: 'z6', tex: `\\checkmark\\ ${T('kWh = energy')} = ${P('3.6 \\times 10^6\\ \\text{J}')}`, at: 3 }] },
      { say: "Fourth: maximum power is not one hundred percent efficient. At R equals r, it is fifty percent. And never leave out small r.", ops: [
        { write: 'z7', tex: `\\times\\ ${T('max ')}${P('P')} \\to 100${PC}` },
        { write: 'z8', tex: `\\checkmark\\ ${R('R')} = ${r('r')} \\to \\eta = ${P('50' + PC)}`, at: 4 },
        { write: 'z9', tex: `\\checkmark\\ ${I('I')} = ${E('E')}/(${R('R')} + ${r('r')})`, at: 8 }] }
    ] },
    { title: 'Summary', cues: [
      { say: "To sum up. Series: one current, resistances add. Parallel: one p d, one over R adds. Cells: n E and n r in series, E and r over n in parallel.", ops: [
        { clear: 'Summary' },
        { write: 'u1', tex: `${T('series: same ')}${I('I')},\\ ${R('R = \\Sigma R')}` },
        { write: 'u2', tex: `${T('parallel: same ')}${V('V')},\\ 1/${R('R')} = \\Sigma 1/${R('R')}`, at: 3 },
        { write: 'u3', tex: `${T('cells: ')}${E('nE')}, ${r('nr')}\\ /\\ ${E('E')}, ${r('r/n')}`, at: 7 }] },
      { say: "Power is I V, I squared R, or V squared over R. Maximum power at R equals r; high efficiency needs R much bigger than r. So Emeka's pump cells go in parallel, and his worn battery wastes I squared r as heat.", ops: [
        { write: 'u4', tex: `${P('P')} = ${I('I')}${V('V')} = ${I('I')}^2${R('R')} = ${V('V')}^2/${R('R')}` },
        { write: 'u5', tex: `${T('max ')}${P('P')}: ${R('R')} = ${r('r')};\\ ${T('high ')}\\eta: ${R('R')} \\gg ${r('r')}`, at: 6 }, { box: 'u5' }] }
    ] },
    { title: 'Your turn', cues: [
      { say: "Your turn. Two cells in series, each two point zero volts and zero point two five ohm, feed two point zero and six point zero ohms in parallel.", ops: [
        { clear: 'Your turn' },
        { panel: NET, s: { n: 2, arr: 'series', cellLabel: '2.0 V · 0.25 Ω', showr: 1, E: 2, r: 0.25, layout: 'parallel', R1: 2, R2: 6, L1: '2.0 Ω', L2: '6.0 Ω', flow: 1 }, fresh: 1 },
        { write: 'y1', tex: `${T('2 cells in series: ')}${E('2.0' + VV)},\\ ${r('0.25' + O)}` },
        { write: 'y2', tex: `${R('2.0' + O)} \\parallel ${R('6.0' + O)}`, at: 7 }] },
      { say: "Find the current from the cells, the power delivered to the pair, and the efficiency. Pause and try it now.", hold: 15, ops: [
        { write: 'y3', tex: `${T('find ')}${I('I')},\\ ${P('P')}${T(' and ')}\\eta` }] },
      { say: "Step one. The pair is twelve over eight, one point five ohms. The cells give four point zero volts and zero point five zero ohm.", ops: [
        { clear: 'Solution' }, { panel: NET, s: { stage: 1, Lp: '1.5 Ω', badge: '4.0 V · 0.50 Ω' } },
        { write: 'y4', tex: `${R('R_p')} = 12/8 = ${R('1.5' + O)}` },
        { write: 'y5', tex: `${E('E_t = 4.0' + VV)},\\ ${r('r_t = 0.50' + O)}`, at: 4.5 }] },
      { say: "Step two. The current is four point zero over one point five plus zero point five zero, which is two point zero amps.", ops: [
        { panel: NET, s: { Imain: '2.0 A' }, at: 4 },
        { write: 'y6', tex: `${I('I')} = 4.0/2.0 = ${I('2.0' + A)}` }, { box: 'y6' }] },
      { say: "Step three. Power to the pair is two point zero squared times one point five, six point zero watts. Efficiency is one point five over two point zero, seventy-five percent.", ops: [
        { write: 'y7', tex: `${P('P')} = 2.0^2 \\times 1.5 = ${P('6.0' + W)}` },
        { write: 'y8', tex: `\\eta = 1.5/2.0 = ${P('75' + PC)}`, at: 6 }, { box: 'y8' }] },
      { say: "Check. E times I is eight point zero watts, and six point zero over eight point zero is seventy-five percent. Well done.", ops: [
        { clear: 'Check' },
        { write: 'y9', tex: `${E('E')}${I('I')} = 4.0 \\times 2.0 = 8.0${W}` },
        { write: 'y10', tex: `6.0/8.0 = ${P('75' + PC)}\\ \\checkmark`, at: 4 }] }
    ] }
  ]
};
