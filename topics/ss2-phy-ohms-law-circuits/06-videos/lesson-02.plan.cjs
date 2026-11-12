// Lesson 02 explainer plan (explainer-director output, schema v1).
// Topic: ss2-phy-ohms-law-circuits · EMF, terminal p.d., lost volts and internal resistance.
// Approved direction script: 06-videos/lesson-02-direction-script.md (same chapter and line order).
// Check: node scripts/apply-video.mjs topics/ss2-phy-ohms-law-circuits --lesson lesson-02 --check-only
const k = (r, s) => `\\htmlClass{role-${r}}{${s}}`;
const E = s => k('E', s), Vt = s => k('V', s), lv = s => k('v', s), ri = s => k('r', s), Ic = s => k('I', s);
const OHM = '\\,\\Omega';
const T = s => `\\text{${s}}`;

// Expected bench results from 02-lesson.md § Lesson 02 · 2B (E = 6.0 V, r = 1.5 Ω): V = E − Ir, a straight line.
const BE = 6.0, BR = 1.5;
const BENCH_PTS = [[0.50, 5.25], [1.00, 4.50], [1.50, 3.75], [2.00, 3.00], [2.50, 2.25]];
const BENCH = { id: 'bench', x: [0, 4.5, 1], y: [0, 7, 1], xlabel: 'I (A)', ylabel: 'V (V)', xcolor: 'I', ycolor: 'V', items: [
  { id: 'pts', type: 'points', pts: BENCH_PTS, labels: ['(0.50, 5.25)', null, null, null, '(2.50, 2.25)'], color: 'V', labelColor: 'white', pos: 'ne' },
  { id: 'line', type: 'line', from: [0, BE], to: [BE / BR, 0], color: 'amber' },
  { id: 'E', type: 'point', at: [0, BE], color: 'E', label: 'E = 6.0 V', pos: 'e' },
  { id: 'grad', type: 'triangle', from: [0.50, 5.25], to: [2.50, 2.25], dx: '2.0 A', dy: '−3.0 V' },
  { id: 'gradtxt', type: 'text', at: [2.7, 6.2], text: ['gradient = −1.5', 'so r = 1.5 Ω'], color: 'r' },
  { id: 'isc', type: 'point', at: [BE / BR, 0], color: 'I', label: 'I(sc) = 4.0 A', pos: 'n' },
  ] };

const MYSTERY = { sw: 1, A: 3.0, V: 8.4, R: '2.8 Ω', bat: '12 V', amax: 5, vmax: 15 };

module.exports = {
  meta: {
    title: 'EMF, Terminal P.D. & Internal Resistance',
    subtitle: 'Lesson 02 · The missing 3.6 V of the keke battery',
    eq: 'E = V + Ir = I(R + r)',
    subject: 'Physics', level: 'SS2 · WAEC / NECO / JAMB',
    next: '#apply', nextLabel: 'Continue to Apply →',
    roles: {
      E: { color: 'gold', name: 'EMF' },
      V: { color: 'blue', name: 'terminal p.d.' },
      v: { color: 'red', name: 'lost volts' },
      r: { color: 'orange', name: 'internal resistance' },
      I: { color: 'green', name: 'current' }
    },
    captionFixes: { 'E M F': 'EMF', 'V I graph': 'V–I graph', 'lead acid': 'lead–acid', 'short circuit current': 'short-circuit current' }
  },

  checks: [
    // Chapter 1 · the mystery
    ['mystery current 8.4/2.8', 8.4 / 2.8, 3.0],
    ['mystery missing volts 12.0 - 8.4', 12.0 - 8.4, 3.6],
    { name: 'realism: a real starter draws far more than the 3.0 A test current', test: () => 100 > 3.0 },
    // Chapter 2 · open circuit
    ['open circuit V = E - 0*r', 12.0 - 0 * 1.2, 12.0],
    ['EMF 12.0 V = 12.0 J per coulomb', 12.0 / 1, 12.0],
    // Chapter 5 · circuit equation on the mystery bench
    ['I = E/(R + r) = 12.0/(2.8 + 1.2)', 12.0 / (2.8 + 1.2), 3.0],
    ['V = E - Ir = 12.0 - 3.0*1.2', 12.0 - 3.0 * 1.2, 8.4],
    ['V = IR = 3.0*2.8', 3.0 * 2.8, 8.4],
    // Chapter 6 · worked example 1
    ['WE1 step 1 I = 8.4/2.8', 8.4 / 2.8, 3.0],
    ['WE1 step 2 v = 12.0 - 8.4', 12.0 - 8.4, 3.6],
    ['WE1 step 3 r = 3.6/3.0', 3.6 / 3.0, 1.2],
    ['WE1 check 2.8 + 1.2', 2.8 + 1.2, 4.0],
    ['WE1 check 3.0(2.8 + 1.2)', 3.0 * (2.8 + 1.2), 12.0],
    ['WE1 energy 3.6 + 8.4', 3.6 + 8.4, 12.0],
    { name: 'WE1 1.2 ohm is far above a healthy lead-acid battery (well under 0.1 ohm)', test: () => 1.2 > 0.1 },
    // Chapter 7 · V–I graph (bench cell) and worked example 3
    { name: 'bench points lie on V = 6.0 - 1.5 I', test: () => BENCH_PTS.every(([i, v]) => Math.abs(BE - BR * i - v) < 1e-9) },
    ['graph V at 0.50 A', BE - BR * 0.50, 5.25],
    ['graph V at 2.50 A', BE - BR * 2.50, 2.25],
    ['triangle rise 5.25 - 2.25', 5.25 - 2.25, 3.0],
    ['triangle run 2.50 - 0.50', 2.50 - 0.50, 2.0],
    ['gradient -3.0/2.0', -3.0 / 2.0, -1.5],
    ['intercept E (I = 0)', BE - BR * 0, 6.0],
    ['short-circuit current 6.0/1.5', 6.0 / 1.5, 4.0],
    // Chapter 8 · worked example 2 (two readings)
    ['WE2 expand 0.80*4.0', 0.80 * 4.0, 3.2],
    ['WE2 expand 0.50*7.0', 0.50 * 7.0, 3.5],
    ['WE2 collect 0.80 - 0.50', 0.80 - 0.50, 0.30],
    ['WE2 collect 3.5 - 3.2', 3.5 - 3.2, 0.30],
    ['WE2 r = 0.30/0.30', 0.30 / 0.30, 1.0],
    ['WE2 4.0 + 1.0', 4.0 + 1.0, 5.0],
    ['WE2 E = 0.80(4.0 + 1.0)', 0.80 * (4.0 + 1.0), 4.0],
    ['WE2 check 0.50(7.0 + 1.0)', 0.50 * (7.0 + 1.0), 4.0],
    ['WE2 bench voltmeter 1 = E - I1 r', 4.0 - 0.80 * 1.0, 3.2],
    ['WE2 bench voltmeter 2 = E - I2 r', 4.0 - 0.50 * 1.0, 3.5],
    // Chapter 9 · your turn (fresh numbers: 12.6 V, 11.2 V, 1.4 V, 0.35 ohm appear nowhere in 02-lesson.md or 03-questions.md)
    ['YT I = 11.2/2.8', 11.2 / 2.8, 4.0],
    ['YT v = 12.6 - 11.2', 12.6 - 11.2, 1.4],
    ['YT r = 1.4/4.0', 1.4 / 4.0, 0.35],
    ['YT check 2.8 + 0.35', 2.8 + 0.35, 3.15],
    ['YT check 4.0(2.8 + 0.35)', 4.0 * (2.8 + 0.35), 12.6],
    ['YT compare: old battery loses 3.6 V on the same load', 12.0 - 8.4, 3.6]
  ],

  chapters: [
    { title: 'The keke battery mystery', cues: [
      { say: "On Ngwa Road in Aba, Emeka the keke rider brings his battery to Engineer Nkechi's workshop. It was charged last week, but now the engine starts weakly.",
        ops: [{ clear: "Nkechi's workshop, Aba" }, { panel: 'circuit', s: { sw: 0, A: 0, V: 12, R: '2.8 Ω', bat: '12 V', amax: 5, vmax: 15 }, fresh: 1 }] },
      { say: "Chinedu clips a voltmeter across the resting battery. No current flows, and the meter reads twelve point zero volts.",
        ops: [{ panel: 'circuit', s: { focus: 'V' } }, { write: 'h1', tex: `${T('at rest: voltmeter')} = 12.0${T(' V')}` }, { camera: 'wide', focus: 'V' }] },
      { say: "Nkechi switches in her two point eight ohm starter test load. A real starter draws far more, but this keeps the numbers simple. The ammeter reads three point zero amps.",
        ops: [{ panel: 'circuit', s: { sw: 1, A: 3.0, focus: 'A' } }, { write: 'h2', tex: `${T('on load: ')} ${Ic('I = 3.0' + T(' A'))}` }, { camera: 'wide', focus: 'A' }] },
      { say: "Now look at the voltmeter. It crashes to eight point four volts, and the headlamp dims.",
        ops: [{ panel: 'circuit', s: { V: 8.4, ghost: 1, ghostTo: 12, focus: 'V' }, at: .6 }, { write: 'h3', tex: `${T('on load: voltmeter')} = 8.4${T(' V')}` }, { camera: 'wide', focus: 'V' }] },
      { say: "Twelve point zero minus eight point four is three point six volts. So where did those three point six volts go?",
        ops: [{ write: 'h4', tex: `12.0 - 8.4 = ${lv('3.6' + T(' V'))}\\ \\ ?` }, { box: 'h4' }, { hl: ['v'] }, { camera: 'wide' }] },
      { say: "Tobe says the battery has lost its voltage, so dump it. Nkechi says, measure it a cleverer way before you throw it away.",
        ops: [{ clear: 'Who is right?' }, { write: 't1', tex: T('Tobe: "it is finished"') }, { write: 't2', tex: T('Nkechi: "measure it first"'), at: 4 }] },
      { say: "By the end, you will find the missing volts, work out the battery's hidden internal resistance, and get E and r from a graph or from two readings.",
        ops: [{ clear: 'By the end of this video' }, { panel: null }, { write: 'o1', tex: `\\square\\ \\ ${T('find the lost volts')}` },
          { write: 'o2', tex: `\\square\\ \\ ${T('find ')}${ri('r')}${T(' of the battery')}`, at: 3 },
          { write: 'o3', tex: `\\square\\ \\ ${E('E')}${T(' and ')}${ri('r')}${T(' from a graph')}`, at: 6 },
          { write: 'o4', tex: `\\square\\ \\ ${E('E')}${T(' and ')}${ri('r')}${T(' from two readings')}`, at: 8 }] }
    ] },

    { title: 'Two kinds of voltage', cues: [
      { say: "We need two ideas of voltage. The first is the electromotive force, or E M F, capital E. It is the total energy the battery gives to each coulomb it drives round the whole circuit.",
        ops: [{ clear: 'Two kinds of voltage' }, { write: 'd1', tex: `${E('E')} = ${T('energy per coulomb')}`, note: 'J/C = V' }, { hl: ['E'] }] },
      { say: "For Emeka's battery, E is twelve point zero volts. Every coulomb gets twelve point zero joules from the chemical reactions inside.",
        ops: [{ panel: 'toll', s: { stage: 1, nums: 1, values: [12.0, 3.6, 8.4] }, fresh: 1 }, { write: 'd2', tex: `${E('E')} = 12.0${T(' J per coulomb')}` }, { camera: 'wide', focus: 'source' }] },
      { say: "The second is the terminal potential difference, capital V. It is the p.d. across the battery's terminals, the energy per coulomb left for the outside circuit.",
        ops: [{ panel: 'circuit', s: { sw: 0, A: 0, V: 12, R: '2.8 Ω', bat: '12 V', amax: 5, vmax: 15, focus: 'term' }, fresh: 1 }, { write: 'd3', tex: `${Vt('V')} = ${T('p.d. across the terminals')}` }, { hl: ['V'] }, { camera: 'wide' }] },
      { say: "With the switch open, no current flows, so nothing is used up inside, and the terminal p.d. equals the E M F, twelve point zero volts.",
        ops: [{ panel: 'circuit', s: { focus: 'V' } }, { write: 'd4', tex: `I = 0 \\implies ${Vt('V')} = ${E('E')} = 12.0${T(' V')}` }, { camera: 'wide', focus: 'V' }] },
      { say: "That gives the exam definition. The E M F of a cell is the p.d. across its terminals when it is not delivering current, that is, on open circuit.",
        ops: [{ clear: 'Open circuit vs on load' }, { write: 'd5', tex: T('EMF = terminal p.d. on open circuit') }, { box: 'd5' }, { camera: 'wide' }] },
      { say: "Close the switch and current flows. Now the terminal p.d. is less than the E M F. Something inside the battery takes a share.",
        ops: [{ panel: 'circuit', s: { sw: 1, A: 3.0, V: 8.4, focus: 'bat' } }, { write: 'd6', tex: `I > 0 \\implies ${Vt('V')} < ${E('E')}` }, { camera: 'wide', focus: 'bat' }] },
      { say: "So Tobe is wrong. The E M F has not fallen. The question is where part of it is spent.",
        ops: [{ write: 'd7', tex: `${E('E')}${T(' is still ')}12.0${T(' V')}`, note: 'Tobe is wrong' }, { hl: ['E'] }, { camera: 'wide' }] }
    ] },

    { title: 'Inside the battery', cues: [
      { say: "Let's go inside the battery.",
        ops: [{ clear: 'Inside the battery' }, { panel: 'cell', s: { labels: 0, ions: 0, drag: 0, rlabel: 0, worn: 0, heat: 0 }, fresh: 1 }, { camera: 'kit', drift: .6 }] },
      { say: "A lead acid cell has a lead plate and a lead dioxide plate in dilute sulfuric acid. Reactions at the plates give each coulomb its energy.",
        ops: [{ panel: 'cell', s: { labels: 1 } }, { write: 'c1', tex: T('plates in dilute sulfuric acid') }, { camera: 'wide' }] },
      { say: "But the current must also pass through the battery itself, through the acid and the plates. That material opposes it, like any resistor. This is the internal resistance, small r.",
        ops: [{ panel: 'cell', s: { ions: 1 } }, { write: 'c2', tex: T('current flows through it too') }, { panel: 'cell', s: { drag: 1, rlabel: 1 }, at: 5 }, { write: 'c3', tex: `${T('internal resistance: ')}${ri('r')}`, at: 7 }, { hl: ['r'] }, { camera: 'wide', focus: 'r', at: 7 }] },
      { say: "In a tired battery like Emeka's, the plates are worn and coated, so the internal resistance is much larger than in a new one.",
        ops: [{ panel: 'cell', s: { worn: 1 } }, { write: 'c4', tex: `${T('worn plates')} \\implies ${T('large ')}${ri('r')}` }, { camera: 'wide', focus: 'neg' }] },
      { say: "Pushing current through r costs energy, and that energy becomes heat inside. That is why a battery feels warm under heavy load.",
        ops: [{ panel: 'cell', s: { heat: 1 } }, { clear: 'Lost volts' }, { write: 'c5', tex: `${T('energy lost inside')} \\to ${T('heat')}` }, { camera: 'wide', focus: 'acid' }] },
      { say: "The p.d. used up inside is called the lost volts, small v. Like any resistor, r obeys Ohm's law, so small v equals I times small r.",
        ops: [{ write: 'c6', tex: `${lv('v')} = I${ri('r')}`, note: 'lost volts' }, { box: 'c6' }, { hl: ['v', 'r'] }, { camera: 'wide' }] },
      { say: "And the wires? Their resistance is tiny. The missing volts are spent inside the battery, not in the wires.",
        ops: [{ write: 'c7', tex: T('not in the wires: inside!') }] }
    ] },
    { title: 'The energy tollgate', cues: [
      { say: "Here is a picture. Think of each coulomb as a traveller on a toll road. At the source, it receives E joules. That is the E M F.",
        ops: [{ clear: 'The energy tollgate' }, { panel: 'toll', s: { stage: 0, nums: 0 }, fresh: 1 }, { panel: 'toll', s: { stage: 1 }, at: 4 },
          { write: 'k1', tex: `${T('receives at the source: ')}${E('E')}`, at: 4 }, { camera: 'wide', focus: 'source', at: 4 }] },
      { say: "Before it leaves the battery, it pays a toll at the internal gate, I r joules. That toll is the lost volts.",
        ops: [{ panel: 'toll', s: { stage: 2 } }, { write: 'k2', tex: `${T('pays inside: ')}${lv('Ir')}` }, { camera: 'wide', focus: 'toll' }] },
      { say: "Whatever is left, it spends in the outside circuit, on the headlamp or the starter. That is I times capital R, the terminal p.d.",
        ops: [{ panel: 'toll', s: { stage: 3 } }, { write: 'k3', tex: `${T('spends outside: ')}${Vt('IR')}` }, { camera: 'wide', focus: 'load' }] },
      { say: "Every joule is accounted for. What the source gives equals the toll plus what is spent outside. It is only a picture: charges carry energy, not coins.",
        ops: [{ panel: 'toll', s: { stage: 4 } }, { write: 'k4', tex: `${E('E')} = ${lv('Ir')} + ${Vt('IR')}` }, { box: 'k4' }, { camera: 'wide' }] }
    ] },

    { title: 'The complete circuit equation', cues: [
      { say: "Now turn the toll road into an equation. The E M F equals the terminal p.d. plus the lost volts.",
        ops: [{ clear: 'The circuit equation' }, { panel: null }, { write: 'q1', tex: `${E('E')} = ${Vt('V')} + ${lv('v')}` }] },
      { say: "Capital V drives the current through the outside load, so it is I R. Small v drives the same current through r, so it is I r.",
        ops: [{ write: 'q2', tex: `${E('E')} = ${Vt('IR')} + ${lv('Ir')}` }, { hl: ['V', 'v'] }] },
      { say: "The same current flows through both, so factorise. E equals I, times R plus r.",
        ops: [{ write: 'q3', tex: `${E('E')} = ${Ic('I')}(R + ${ri('r')})` }, { box: 'q3' }, { hl: ['I'] }] },
      { say: "Rearrange for the current. I equals E over R plus r: the load outside plus the battery's own inside.",
        ops: [{ write: 'q4', tex: `${Ic('I')} = \\dfrac{${E('E')}}{R + ${ri('r')}}` }, { box: 'q4' }, { panel: 'circuit', s: { ...MYSTERY, showr: 1, bracket: 1 }, fresh: 1, at: 4 }] },
      { say: "One more form you will use often. V equals E minus I r. So the bigger the current, the bigger the lost volts, and the smaller the terminal p.d.",
        ops: [{ clear: 'Terminal p.d.' }, { write: 'q5', tex: `${Vt('V')} = ${E('E')} - I${ri('r')}` }, { box: 'q5' }, { write: 'q6', tex: `${T('bigger ')}I \\implies ${T('smaller ')}${Vt('V')}`, at: 5 }, { camera: 'wide', focus: 'V', at: 5 }] },
    ] },

    { title: "Solving Emeka's mystery", cues: [
      { say: "Worked example one. Emeka's battery reads twelve point zero volts on open circuit, and eight point four volts on the two point eight ohm load. Find the current, the lost volts, and r.",
        ops: [{ clear: 'Example 1: the keke battery' }, { panel: 'circuit', s: { ...MYSTERY }, fresh: 1 }, { camera: 'wide' },
          { write: 'x1', tex: `${E('E')} = 12.0${T(' V')},\\ \\ ${Vt('V')} = 8.4${T(' V')}` }, { write: 'x2', tex: `R = 2.8${OHM}`, at: 7 }] },
      { say: "Step one. The current, from the load. I equals V over R, eight point four over two point eight, which is three point zero amps. That matches the ammeter.",
        ops: [{ write: 'x3', tex: `I = \\dfrac{V}{R} = \\dfrac{8.4}{2.8}`, note: 'step 1' }, { write: 'x3b', tex: `\\phantom{I} = ${Ic('3.0' + T(' A'))}`, at: 6 }, { panel: 'circuit', s: { focus: 'A', tickA: 1 }, at: 8 }, { camera: 'board' }] },
      { say: "Step two. The lost volts. Small v equals E minus V, twelve point zero minus eight point four, which is three point six volts.",
        ops: [{ clear: 'Example 1: steps 2 and 3' }, { panel: 'circuit', s: { focus: null, tickA: 0 } }, { write: 'x4', tex: `${lv('v')} = E - V`, note: 'step 2' },
          { write: 'x4b', tex: `\\phantom{v} = 12.0 - 8.4 = ${lv('3.6' + T(' V'))}`, at: 4 }, { camera: 'board' }] },
      { say: "There they are. The missing three point six volts were used up inside the battery, across its internal resistance.",
        ops: [{ panel: 'circuit', s: { showr: 1, loss: '3.6 V lost inside', focus: 'bat' } }, { hl: ['v'] }, { camera: 'kit', focus: 'bat', dur: 1.3 }] },
      { say: "Step three. The internal resistance. Small r equals v over I, three point six over three point zero, which is one point two ohms.",
        ops: [{ write: 'x5', tex: `${ri('r')} = \\dfrac{v}{I} = \\dfrac{3.6}{3.0}`, note: 'step 3' }, { write: 'x5b', tex: `\\phantom{r} = ${ri('1.2' + OHM)}`, at: 6 }, { box: 'x5b' }, { camera: 'board' }] },
      { say: "Check. Three point zero, times two point eight plus one point two, is three point zero times four point zero, twelve point zero volts. It works.",
        ops: [{ write: 'x6', tex: `3.0(2.8 + 1.2) = 12.0${T(' V')}\\ \\checkmark` }] },
      { say: "So each coulomb gets twelve point zero joules, pays three point six joules as heat inside, and delivers eight point four joules to the load.",
        ops: [{ clear: 'Where the energy goes' }, { panel: 'toll', s: { stage: 4, nums: 1, values: [12.0, 3.6, 8.4] }, fresh: 1 },
          { write: 'x7', tex: `${E('12.0' + T(' J'))} = ${lv('3.6' + T(' J'))} + ${Vt('8.4' + T(' J'))}` }, { box: 'x7' }, { camera: 'wide' }] },
      { say: "One point two ohms is huge; a healthy battery has a small fraction of an ohm. Nkechi's verdict: the E M F is fine, the inside is worn.",
        ops: [{ write: 'x8', tex: `${ri('r = 1.2' + OHM)}${T(': worn inside')}`, note: 'healthy: tiny r' }, { hl: ['r'] }] }
    ] },

    { title: 'The V–I graph', cues: [
      { say: "Look again at V equals E minus I r. Does it look like a straight line, y equals m x plus c? The intercept c is E, and the gradient m is minus r.",
        ops: [{ clear: 'The V–I graph' }, { panel: null }, { write: 'g1', tex: `${Vt('V')} = ${E('E')} - ${ri('r')}I` }, { write: 'g2', tex: 'y = c + mx', at: 4 },
          { write: 'g3', tex: `${T('intercept')} = ${E('E')},\\ \\ ${T('gradient')} = -${ri('r')}`, at: 8 }, { hl: ['E', 'r'] }] },
      { say: "Here are our virtual lab readings: one cell, five loads, V up the side, I along the bottom. Zero point five zero amps gives five point two five volts.",
        ops: [{ panel: 'graph', s: { spec: BENCH, show: ['pts'] }, fresh: 1 }, { camera: 'wide' }] },
      { say: "They lie on a straight line. Draw it and extend it back to the V axis.",
        ops: [{ panel: 'graph', s: { show: ['pts', 'line'] } }] },
      { say: "The vertical intercept, where I is zero, is the E M F. Six point zero volts.",
        ops: [{ clear: 'Reading the graph' }, { panel: 'graph', s: { show: ['pts', 'line', 'E'] } }, { write: 'g4', tex: `${E('E')} = 6.0${T(' V')}`, note: 'intercept' }, { camera: 'wide', focus: 'E' }] },
      { say: "For the gradient, use a big triangle. From zero point five zero to two point five zero amps, V falls by three point zero volts over two point zero amps. The gradient is minus one point five.",
        ops: [{ panel: 'graph', s: { show: ['pts', 'line', 'E', 'grad'] } }, { write: 'g5', tex: `${T('gradient')} = \\dfrac{-3.0}{2.0} = -1.5` }, { camera: 'wide', focus: 'grad' }] },
      { say: "So the internal resistance is one point five ohms. Notice that r is positive. Only the gradient is negative.",
        ops: [{ panel: 'graph', s: { show: ['pts', 'line', 'E', 'grad', 'gradtxt'] } }, { write: 'g6', tex: ri('r = 1.5' + OHM) }, { box: 'g6' }, { hl: ['r'] }, { camera: 'wide' }] },
      { say: "Where the line meets the I axis, V is zero. That is the short circuit current, E over r, six point zero over one point five, four point zero amps. Never short a battery: it overheats.",
        ops: [{ clear: 'Short-circuit current' }, { panel: 'graph', s: { show: ['pts', 'line', 'E', 'grad', 'gradtxt', 'isc'] } },
          { write: 'g7', tex: `I_{\\text{sc}} = \\dfrac{E}{r} = \\dfrac{6.0}{1.5}` }, { write: 'g7b', tex: `\\phantom{I_{\\text{sc}}} = ${Ic('4.0' + T(' A'))}`, at: 7 }, { write: 'g8', tex: T('never short-circuit a battery'), note: 'safety', at: 11 }, { camera: 'wide', focus: 'isc' }] }
    ] },

    { title: 'Two readings, same cell', cues: [
      { say: "No graph? Two readings are enough. Connect the same cell to two different lamps, one at a time, and read the current each time.",
        ops: [{ clear: 'Two readings, same cell' }, { panel: 'circuit', s: { sw: 1, A: 0.8, V: 3.2, R: '4.0 Ω', bat: 'cell', amax: 1, vmax: 5 }, fresh: 1 },
          { panel: 'circuit', s: { R: '7.0 Ω', A: 0.5, V: 3.5 }, at: 5 }, { camera: 'wide', focus: 'A' }] },
      { say: "Worked example two. A cell drives zero point eight zero amps through a four point zero ohm lamp, and zero point five zero amps through a seven point zero ohm lamp. Find r and E.",
        ops: [{ write: 'w1', tex: `I_1 = 0.80${T(' A')},\\ \\ R_1 = 4.0${OHM}` }, { write: 'w2', tex: `I_2 = 0.50${T(' A')},\\ \\ R_2 = 7.0${OHM}`, at: 6 }, { camera: 'wide' }] },
      { say: "The key idea: it is the same cell, so E and r do not change. Only the load and the current change.",
        ops: [{ write: 'w3', tex: `${T('same cell: ')}${E('E')}, ${ri('r')}${T(' fixed')}`, note: 'the key idea' }, { hl: ['E', 'r'] }] },
      { say: "So write E equals I, times R plus r, for each reading, and set the two equal.",
        ops: [{ clear: 'Example 2' }, { write: 'w4', tex: `${E('E')} = 0.80(4.0 + ${ri('r')})` }, { write: 'w5', tex: `${E('E')} = 0.50(7.0 + ${ri('r')})`, at: 2.5 },
          { write: 'w6', tex: `0.80(4.0 + r) = 0.50(7.0 + r)`, at: 5 }, { camera: 'board' }] },
      { say: "Expand both sides. Three point two plus zero point eight zero r equals three point five plus zero point five zero r.",
        ops: [{ clear: 'Example 2: solve for r' }, { write: 'w7', tex: '3.2 + 0.80r = 3.5 + 0.50r' }] },
      { say: "Collect like terms. Zero point three zero r equals zero point three zero, so r equals one point zero ohm.",
        ops: [{ write: 'w8', tex: '0.30r = 0.30' }, { write: 'w9', tex: ri('r = 1.0' + OHM), at: 4 }, { box: 'w9' }] },
      { say: "Substitute back. E equals zero point eight zero, times four point zero plus one point zero. That is zero point eight zero times five point zero, which is four point zero volts.",
        ops: [{ write: 'w10', tex: 'E = 0.80(4.0 + 1.0)' }, { write: 'w10b', tex: `\\phantom{E} = ${E('4.0' + T(' V'))}`, at: 7 }, { box: 'w10b' }] },
      { say: "Check the other reading: zero point five zero, times seven point zero plus one point zero, is also four point zero volts. And both voltmeter readings, three point two and three point five volts, sit below it.",
        ops: [{ write: 'w11', tex: `0.50(7.0 + 1.0) = 4.0${T(' V')}\\ \\checkmark` }, { panel: 'circuit', s: { focus: 'V' }, at: 6 }] },
    ] },

    { title: 'Mistakes, summary and your turn', cues: [
      { say: "Here are the mistakes that cost marks in WAEC and NECO.",
        ops: [{ clear: 'Common mistakes' }, { panel: null }, { camera: 'wide' }] },
      { say: "One. Writing I equals E over R and forgetting r. The current is E over R plus r.",
        ops: [{ write: 'm1', tex: '\\times\\ I = \\dfrac{E}{R} \\qquad \\checkmark\\ I = \\dfrac{E}{R + r}' }] },
      { say: "Two. Saying a voltmeter across a battery always reads the E M F. It reads E only when no current flows.",
        ops: [{ write: 'm2', tex: `${T('reads ')}${E('E')}${T(' only when ')}I = 0` }] },
      { say: "Three. Giving r as a negative number. The gradient is minus r, but r itself is positive.",
        ops: [{ write: 'm4', tex: `${T('gradient')} = -${ri('r')},\\ \\ ${ri('r')} > 0` }] },
      { say: "To sum up. The E M F is the energy per coulomb, and it equals the terminal p.d. on open circuit.",
        ops: [{ clear: 'Summary' }, { write: 's1', tex: `${E('E')} = ${Vt('V')}${T(' on open circuit')}` }] },
      { say: "On load, E equals V plus the lost volts, which is I times R plus r.",
        ops: [{ write: 's2', tex: `${E('E')} = ${Vt('V')} + ${lv('Ir')} = I(R + r)` }] },
      { say: "The terminal p.d. is E minus I r. On a V I graph, the intercept is E and the gradient is minus r. Or use two readings.",
        ops: [{ write: 's3', tex: `${Vt('V')} = ${E('E')} - I${ri('r')}` }, { write: 's4', tex: `${T('intercept ')}${E('E')},\\ \\ ${T('gradient ')}-${ri('r')}`, at: 4 }, { write: 's5', tex: `${T('two readings')} \\to ${E('E')},\\ ${ri('r')}`, at: 8 }] },
      { say: "Your turn. Nkechi fits a brand new battery. On open circuit it reads twelve point six volts. On the same two point eight ohm test load, it reads eleven point two volts. Find the current, the lost volts, and r. Pause and try.",
        hold: 15,
        ops: [{ clear: 'Your turn' }, { write: 'y1', tex: `${E('E')} = 12.6${T(' V')},\\ \\ ${Vt('V')} = 11.2${T(' V')}`, at: 3 }, { write: 'y2', tex: `R = 2.8${OHM}`, at: 8 },
          { write: 'y3', tex: `${T('Find ')}${Ic('I')},\\ ${lv('v')},\\ ${ri('r')}`, at: 11 }] },
      { say: "Here is the solution. I equals V over R, eleven point two over two point eight, which is four point zero amps.",
        ops: [{ clear: 'Solution' }, { write: 'y4', tex: `I = \\dfrac{11.2}{2.8} = ${Ic('4.0' + T(' A'))}` }] },
      { say: "The lost volts are twelve point six minus eleven point two, which is one point four volts.",
        ops: [{ write: 'y5', tex: `${lv('v')} = 12.6 - 11.2 = ${lv('1.4' + T(' V'))}` }] },
      { say: "So r is one point four over four point zero, which is zero point three five ohms. Check: four point zero, times three point one five, is twelve point six. It works.",
        ops: [{ write: 'y6', tex: `${ri('r')} = \\dfrac{1.4}{4.0} = ${ri('0.35' + OHM)}` }, { box: 'y6' }, { write: 'y7', tex: `4.0(2.8 + 0.35) = 12.6\\ \\checkmark`, at: 7 }] },
      { say: "Same load, but the new battery loses only one point four volts, against three point six for Emeka's. Smaller r, fewer lost volts. Next, rebuild Emeka's circuit in Apply.",
        ops: [{ panel: 'circuit', s: { sw: 1, A: 4.0, V: 11.2, R: '2.8 Ω', bat: '12.6 V', amax: 5, vmax: 15, showr: 1, loss: '1.4 V lost inside', focus: 'bat' }, fresh: 1 }, { camera: 'wide', focus: 'bat' }] }
    ] }
  ]
};
