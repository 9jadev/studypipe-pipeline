// Demo for video kit "circuit-network": every state and close-up, so QA can prove the kit on phone and desktop.
// Numbers are the ss2-phy-ohms-law-circuits lesson-03 configurations from the kit request (the kit computes the same currents).
// Build: node .agents/skills/explainer-video/scripts/build.cjs kits/video/circuit-network/demo.plan.cjs
// QA:    node .agents/skills/explainer-video/scripts/qa.cjs kits/video/circuit-network/demo.html
const par = (a, b) => (a * b) / (a + b);
const k = (r, s) => `\\htmlClass{role-${r}}{${s}}`;
const K = 'circuit-network';
module.exports = {
  meta: {
    title: 'Circuit-network kit demo', subtitle: 'Kit demo · circuit-network', subject: 'Kit demo', level: 'QA', theme: 'classic',
    roles: { E: { color: 'gold', name: 'EMF' }, I: { color: 'green', name: 'current' }, V: { color: 'blue', name: 'p.d.' }, R: { color: 'orange', name: 'resistance' }, r: { color: 'red', name: 'internal resistance' }, P: { color: 'purple', name: 'power' } },
  },
  checks: [
    ['12 V across 4 + 6 Ω', 12 / (4 + 6), 1.2], ['V across 4 Ω', 1.2 * 4, 4.8], ['V across 6 Ω', 1.2 * 6, 7.2],
    ['4 ∥ 6 Ω', par(4, 6), 2.4], ['12 V / 4 Ω', 12 / 4, 3.0], ['12 V / 6 Ω', 12 / 6, 2.0], ['main current 4 ∥ 6', 12 / par(4, 6), 5.0],
    ['6 ∥ 12 Ω', par(6, 12), 4.0], ['3 + (6 ∥ 12)', 3 + par(6, 12), 7.0], ['14 V, r = 1, main', 14 / (7 + 1), 1.75], ['p.d. across pair', 1.75 * 4, 7.0],
    ['6 Ω branch', 1.75 * 12 / 18, 7 / 6], ['12 Ω branch', 1.75 * 6 / 18, 7 / 12],
    ['4 parallel cells: r/n', 2 / 4, 0.5], ['pump current, parallel', 1.5 / (1 + 0.5), 1.0], ['each cell branch', 1.0 / 4, 0.25], ['pump current, series', 6 / (1 + 8), 2 / 3],
    ['5 V, 0.5 Ω, 4.5 Ω', 5 / (4.5 + 0.5), 1.0], ['useful I²R', 1 * 4.5, 4.5], ['heat I²r', 1 * 0.5, 0.5],
    ['worn: 12 V, 1.2 + 2.8 Ω', 12 / 4, 3.0], ['worn useful', 9 * 2.8, 25.2], ['worn heat', 9 * 1.2, 10.8],
    ['two 2 V cells series, 2 ∥ 6', 4 / (0.5 + par(2, 6)), 2.0], ['2 Ω branch', 2 * 6 / 8, 1.5], ['6 Ω branch', 2 * 2 / 8, 0.5],
    ['9 V across 2 + 3 + 4 Ω', 9 / (2 + 3 + 4), 1.0],
  ],
  chapters: [
    { title: 'Cells: line or side by side', cues: [
      { say: 'Three identical cells in a line, each with its own internal resistance, driving a pump.', ops: [{ clear: 'Cells in series and parallel' }, { panel: K, s: { n: 3, arr: 'series', E: 1.5, r: 1, showr: 1, cellLabel: 'E, r', badge: '', heat: 0, layout: 'single', load: 'pump', R1: 1, L1: 'pump', flow: 1, focus: null, bar: 0 }, fresh: 1 }, { write: 'a', tex: `\\text{series: } ${k('E', '3E')},\\ ${k('r', '3r')}` }] },
      { say: 'In series the EMFs add and the internal resistances add.', ops: [{ panel: K, s: { badge: '3E, 3r', focus: 'badge' } }, { camera: 'wide', focus: 'badge' }] },
      { say: 'Now the same cells slide side by side.', ops: [{ panel: K, s: { arr: 'parallel', badge: 'E, r/3', focus: 'cells' } }, { camera: 'wide', focus: 'cells' }, { write: 'b', tex: `\\text{parallel: } ${k('E', 'E')},\\ ${k('r', 'r/3')}` }] },
      { say: 'Pushed hard, the cells warm up.', ops: [{ panel: K, s: { heat: 1, focus: 'src' } }, { camera: 'wide', focus: 'src' }] },
      { say: 'An ideal supply has no internal resistance drawn.', ops: [{ panel: K, s: { n: 1, arr: 'series', showr: 0, heat: 0, badge: '', cellLabel: '12 V ideal', E: 12, r: 0, load: 'lamp', L1: 'lamp', R1: 4, focus: 'load' } }, { camera: 'wide' }] },
    ] },
    { title: 'Series and parallel resistors', cues: [
      { say: 'Four ohms and six ohms in series: the same current in both.', ops: [{ clear: 'Resistors' }, { panel: K, s: { layout: 'series', load: 'resistor', R1: 4, R2: 6, R3: 0, L1: '4.0 Ω', L2: '6.0 Ω', I1: '1.2 A', I2: '1.2 A', focus: 'R1' } }, { write: 'a', tex: `${k('I', 'I')} = \\frac{12}{4+6} = ${k('I', '1.2\\,A')}` }] },
      { say: 'The p.d.s share the twelve volts.', ops: [{ panel: K, s: { V1: '4.8 V', V2: '7.2 V', focus: 'R2' } }, { camera: 'wide', focus: 'R2' }] },
      { say: 'Now the same two side by side. The current splits at the junction.', ops: [{ panel: K, s: { layout: 'parallel', V1: '12 V', V2: '12 V', I1: '3.0 A', I2: '2.0 A', Imain: '5.0 A', split: 1, focus: 'node' } }, { camera: 'wide', focus: 'node' }, { write: 'b', tex: `${k('I', '5.0\\,A')} = ${k('I', '3.0')} + ${k('I', '2.0')}` }] },
      { say: 'Close up on the junction: the smaller resistor takes the bigger share.', ops: [{ panel: K, s: { split: 0, focus: 'R1' } }, { camera: 'kit', focus: 'R1' }] },
      { say: 'The pair merges into one equivalent resistor.', ops: [{ panel: K, s: { stage: 1, Lp: '2.4 Ω', V1: '', V2: '', focus: 'pair' } }, { camera: 'wide', focus: 'pair' }] },
    ] },
    { title: 'A mixed network, inside out', cues: [
      { say: 'Three ohms in series with six parallel to twelve, on a fourteen volt cell.', ops: [{ clear: 'Mixed network' }, { panel: K, s: { stage: 0, layout: 'mixed', n: 1, cellLabel: '14.0 V · 1.0 Ω', showr: 1, E: 14, r: 1, R1: 3, R2: 6, R3: 12, L1: '3.0 Ω', L2: '6.0 Ω', L3: '12.0 Ω', Lp: '4.0 Ω', Lext: '7.0 Ω', I1: '', I2: '1.17 A', I3: '0.58 A', Imain: '1.75 A', Vp: '7.0 V', focus: 'R3' } }, { camera: 'wide', focus: 'R3' }, { write: 'a', tex: `${k('R', '3')} + ${k('R', '6')}\\parallel ${k('R', '12')}` }] },
      { say: 'First collapse the pair.', ops: [{ panel: K, s: { stage: 1, I2: '', I3: '', focus: 'pair' } }, { camera: 'wide', focus: 'pair' }] },
      { say: 'Then the whole outside network becomes seven ohms.', ops: [{ panel: K, s: { stage: 2, Vp: '', focus: 'load' } }, { camera: 'wide', focus: 'load' }, { write: 'b', tex: `${k('R', 'R')} = ${k('R', '7.0\\,\\Omega')}` }] },
      { say: 'And open it out again.', ops: [{ panel: K, s: { stage: 0, I2: '1.17 A', I3: '0.58 A', V2: '7.0 V', V3: '7.0 V', V1: '5.25 V', Vp: '', focus: null } }, { camera: 'wide' }] },
      { say: 'Three resistors in a line: one current through all three.', ops: [{ panel: K, s: { layout: 'series', E: 9, r: 0, showr: 0, cellLabel: '9 V ideal', R1: 2, R2: 3, R3: 4, L1: '2.0 Ω', L2: '3.0 Ω', L3: '4.0 Ω', I1: '1.0 A', I2: '', I3: '1.0 A', V1: '', V2: '', V3: '4.0 V', Imain: '', focus: 'R3' } }, { camera: 'wide', focus: 'R3' }] },
    ] },
    { title: 'Four cells and the pump', cues: [
      { say: 'Four cells side by side drive the one ohm pump with one amp.', ops: [{ clear: 'Four cells' }, { panel: K, s: { n: 4, arr: 'parallel', showr: 1, E: 1.5, r: 2, cellLabel: '1.5 V · 2.0 Ω', layout: 'single', load: 'pump', R1: 1, L1: '1.0 Ω pump', I1: '', I3: '', V3: '', badge: '1.5 V · 0.5 Ω', Imain: '1.0 A', focus: 'cells' } }, { camera: 'wide', focus: 'cells' }] },
      { say: 'In a line the EMF is six volts but r is eight ohms: the pump slows.', ops: [{ panel: K, s: { arr: 'series', badge: '6.0 V · 8.0 Ω', Imain: '0.67 A', focus: 'src' } }, { camera: 'wide' }] },
    ] },
    { title: 'Where the power goes', cues: [
      { say: 'Five volts, half an ohm inside, four point five ohms outside.', ops: [{ clear: 'Power split' }, { panel: K, s: { n: 1, arr: 'series', cellLabel: '5.0 V · 0.5 Ω', E: 5, r: 0.5, load: 'resistor', R1: 4.5, L1: '4.5 Ω', badge: '', Imain: '1.0 A', bar: 1, Puse: 4.5, Pwaste: 0.5, barLabels: 0, PuseL: '4.5 W useful', PwasteL: '0.5 W heat', focus: 'bar' } }, { camera: 'wide', focus: 'bar' }, { write: 'a', tex: `${k('P', 'EI')} = I^2R + ${k('r', 'I^2r')}` }] },
      { say: 'Four point five watts useful, half a watt of heat.', ops: [{ panel: K, s: { barLabels: 1 } }] },
      { say: 'A worn battery: big r, hot, and a big heat share.', ops: [{ panel: K, s: { cellLabel: 'worn: big r', E: 12, r: 1.2, R1: 2.8, L1: '2.8 Ω', Imain: '', Puse: 25.2, Pwaste: 10.8, barLabels: 0, heat: 1, focus: null } }, { camera: 'wide' }] },
      { say: 'Two cells in series feed two parallel to six.', ops: [{ panel: K, s: { n: 2, heat: 0, bar: 0, cellLabel: '2.0 V · 0.25 Ω', E: 2, r: 0.25, layout: 'parallel', R1: 2, R2: 6, L1: '2.0 Ω', L2: '6.0 Ω', stage: 1, Lp: '1.5 Ω', badge: '4.0 V · 0.50 Ω', Imain: '2.0 A', focus: null } }] },
      { say: 'Open the pair: one and a half amps and half an amp.', ops: [{ panel: K, s: { stage: 0, I1: '1.5 A', I2: '0.50 A', flow: 1 } }, { camera: 'wide' }] },
    ] },
  ],
};
