// Lesson 02 explainer plan (director output, schema v1). Build: node scripts/build.cjs examples/lesson-02.plan.cjs
// DIRECTOR AGENT OUTPUT: Lesson 02 explainer (from the approved direction script)
// Colour roles are declared in meta.roles; wrap LaTeX with \htmlClass{role-<name>}{...}
const k = (r, s) => `\\htmlClass{role-${r}}{${s}}`;
const E = s => k('E', s), Vt = s => k('V', s), lv = s => k('v', s), ri = s => k('r', s), Ic = s => k('I', s);
const OHM = '\\,\\Omega';

const ABA = { id: 'aba', x: [0, 11, 2], y: [0, 14, 2], xlabel: 'I (A)', ylabel: 'V (V)', xcolor: 'I', ycolor: 'V', items: [
  { id: 'pts', type: 'points', pts: [[0, 12], [3, 8.4]], labels: [null, '(3, 8.4)'], hollow: true, color: 'amber', labelColor: 'white' },
  { id: 'line', type: 'line', from: [0, 12], to: [10, 0], color: 'amber' },
  { id: 'E', type: 'point', at: [0, 12], color: 'E', label: 'E = 12.0 V', pos: 'ne' },
  { id: 'grad', type: 'triangle', from: [0, 12], to: [3, 8.4], dx: '3.0 A', dy: '−3.6 V' },
  { id: 'gradtxt', type: 'text', at: [8.2, 11.4], text: ['gradient = −1.2', 'so r = 1.2 Ω'], color: 'red' },
  { id: 'isc', type: 'point', at: [10, 0], color: 'I', label: 'I(sc) = 10 A', pos: 'n' }] };
const EX23 = { id: 'ex23', x: [0, 5, 1], y: [0, 7, 1], xlabel: 'I (A)', ylabel: 'V (V)', xcolor: 'I', ycolor: 'V', items: [
  { id: 'line', type: 'line', from: [0, 6], to: [4, 0], color: 'amber' },
  { id: 'E', type: 'point', at: [0, 6], color: 'E', label: 'E = 6.0 V', pos: 'ne' },
  { id: 'isc', type: 'point', at: [4, 0], color: 'I', label: 'I(sc) = 4.0 A', pos: 'n' },
  { id: 'guide', type: 'guide', at: [1.2, 4.2], color: 'V' },
  { id: 'pt', type: 'point', at: [1.2, 4.2], color: 'V', label: '(1.2, 4.2)', pos: 'ne' }] };

module.exports = {
  meta: {
    title: 'EMF, Terminal P.D. & Internal Resistance', subtitle: 'Lesson 02 · Where do the lost volts go?', eq: 'E = V + v = I(R + r)',
    subject: 'Physics', level: 'SS2–SS3 · WAEC / NECO / JAMB', theme: 'safari', next: '#apply', nextLabel: 'Continue to Apply →',
    roles: { E: { color: 'gold', name: 'EMF' }, V: { color: 'blue', name: 'terminal p.d.' }, v: { color: 'red', name: 'lost volts' }, r: { color: 'red', name: 'internal resistance' }, I: { color: 'green', name: 'current' } },
    captionFixes: { 'E M F': 'EMF', 'V I graph': 'V–I graph', 'I s c': 'I(sc)' }
  },
    checks: [
    ['Aba current 8.4/2.8', 8.4 / 2.8, 3.0], ['Aba lost volts', 12.0 - 8.4, 3.6], ['Aba r = 3.6/3.0', 3.6 / 3.0, 1.2],
    ['Aba I = 12/(2.8+1.2)', 12 / (2.8 + 1.2), 3.0], ['Aba energy 3.6+8.4', 3.6 + 8.4, 12.0],
    ['Aba line at I=3', 12 - 1.2 * 3, 8.4], ['Aba short circuit 12/1.2', 12 / 1.2, 10],
    ['Ex2.3 r = 6/4', 6 / 4, 1.5], ['Ex2.3 V at 1.2 A', 6 - 1.2 * 1.5, 4.2],
    ['Ex2.2 r from equation', (0.5 * 7 - 0.8 * 4) / (0.8 - 0.5), 1.0], ['Ex2.2 E reading 1', 0.8 * (4 + 1), 4.0], ['Ex2.2 E reading 2', 0.5 * (7 + 1), 4.0],
    ['Ex2.2 expansions', 0.8 * 4, 3.2], ['Ex2.2 expansions', 0.5 * 7, 3.5],
    ['Practice I', 9 / 4.5, 2.0], ['Practice V', 2 * 4, 8.0], ['Practice v', 2 * 0.5, 1.0], ['Practice V+v', 8 + 1, 9.0],
    ['Ex2.2 voltmeter reading 1 (IR)', 0.8 * 4, 3.2], ['Ex2.2 voltmeter reading 2 (IR)', 0.5 * 7, 3.5]
  ],
  chapters: [
    { title: 'The Aba mystery', cues: [
      { say: "Welcome back to Chinedu's workshop in Aba. Chinedu is testing an old car battery that customers say keeps failing.", ops: [{ clear: "Chinedu's workshop, Aba" }, { panel: 'circuit', s: { sw: 0, A: 0, V: 12, R: '2.8 Ω', bat: '12 V', amax: 5, vmax: 15 } }, { write: 'h1', tex: '\\text{An old 12 V car battery}' }] },
      { say: "With the switch open, no current flows. The voltmeter across the battery reads twelve point zero volts.", ops: [{ panel: 'circuit', s: { focus: 'V' } }, { write: 'h2', tex: `\\text{Switch open: } ${Ic('I = 0')}` }, { write: 'h3', tex: `\\text{voltmeter} = 12.0\\text{ V}`, at: 3 }] },
      { say: "Now Chinedu closes the switch. Current flows through the two point eight ohm load, and the ammeter reads three point zero amps.", ops: [{ panel: 'circuit', s: { sw: 1, A: 3.0, focus: 'A' } }, { write: 'h4', tex: `\\text{Switch closed: } ${Ic('I = 3.0\\text{ A}')}` }] },
      { say: "But look at the voltmeter. It has dropped to eight point four volts.", ops: [{ panel: 'circuit', s: { V: 8.4, ghost: 1, ghostTo: 12, focus: 'V' }, at: .6 }, { write: 'h5', tex: '\\text{voltmeter} = 8.4\\text{ V}' }, { camera: 'wide', focus: 'V', dur: 1.4 }] },
      { say: "The battery didn't change. The wires didn't change. So where did three point six volts go?", ops: [{ write: 'h6', tex: `12.0 - 8.4 = ${lv('3.6\\text{ V}')}\\ \\ ?` }, { box: 'h6' }, { hl: ['v'] }, { camera: 'wide' }] },
      { say: "By the end of this video, you'll be able to find those missing volts, and calculate the battery's hidden internal resistance, without ever cutting it open.", ops: [{ clear: 'By the end of this video' }, { panel: null }, { write: 'o1', tex: '\\square\\ \\ \\text{Find the lost volts}' }, { write: 'o2', tex: `\\square\\ \\ \\text{Find } ${E('E')} \\text{ and } ${ri('r')} \\text{ from two readings}`, at: 3.5 }] }
    ] },
    { title: 'EMF and terminal p.d.', cues: [
      { say: "To solve this, we need two different ideas of voltage.", ops: [{ clear: 'Two kinds of voltage' }] },
      { say: "The first is the electromotive force, or E M F, written as capital E. It is the energy the battery gives to each coulomb of charge that passes through it.", ops: [{ write: 'd1', tex: `${E('E')} = \\text{energy per coulomb}`, note: 'unit: J/C = V' }, { hl: ['E'] }] },
      { say: "For this battery, E is twelve volts. Every coulomb leaving the chemical reactions carries twelve joules of energy.", ops: [{ panel: 'toll', s: { stage: 1, nums: 0 }, fresh: 1 }, { write: 'd2', tex: `${E('E')} = 12\\text{ J per coulomb} = 12\\text{ V}` }] },
      { say: "The second idea is the terminal potential difference, written as capital V. It is the voltage across the battery's terminals, the voltage the outside circuit actually receives.", ops: [{ panel: 'circuit', s: { sw: 0, A: 0, V: 12, ghost: 0, focus: 'term' } }, { write: 'd3', tex: `${Vt('V')} = \\text{p.d. across the terminals}` }, { hl: ['V'] }] },
      { say: "When no current flows, nothing is lost inside the battery, so the terminal p.d. equals the E M F. That's why the voltmeter read twelve volts with the switch open.", ops: [{ panel: 'circuit', s: { focus: 'V' } }, { write: 'd4', tex: `I = 0 \\implies ${Vt('V')} = ${E('E')} = 12.0\\text{ V}` }] },
      { say: "This gives the exam definition. The E M F of a cell is the potential difference across its terminals when it is not delivering current.", ops: [{ write: 'd5', tex: '\\text{EMF} = \\text{terminal p.d. on open circuit}' }, { box: 'd5' }] },
      { say: "When current flows, the terminal p.d. is less than the E M F. Something inside the battery takes a share.", ops: [{ panel: 'circuit', s: { sw: 1, A: 3.0, V: 8.4, focus: 'bat' } }, { write: 'd6', tex: `I > 0 \\implies ${Vt('V')} < ${E('E')}` }, { camera: 'wide', focus: 'bat', at: 2 }] }
    ] },
    { title: 'Inside the battery', cues: [
      { say: "Let's go inside the battery.", ops: [{ clear: 'Inside the battery' }, { panel: 'cell', s: { labels: 0, ions: 0, drag: 0, rlabel: 0, worn: 0, heat: 0 }, fresh: 1 }, { camera: 'kit', drift: .6 }] },
      { say: "A car battery contains lead plates standing in sulfuric acid. The chemical reactions at the plates are what give the charges their energy.", ops: [{ panel: 'cell', s: { labels: 1 } }, { write: 'c1', tex: '\\text{lead plates in sulfuric acid}' }, { camera: 'wide' }] },
      { say: "But to complete the circuit, current must also flow through the battery itself: through the acid and the plates.", ops: [{ panel: 'cell', s: { ions: 1 } }, { write: 'c2', tex: '\\text{current flows } \\textit{through} \\text{ the battery too}' }] },
      { say: "That material resists the flow, just like any resistor. We call this the internal resistance of the battery, written as small r.", ops: [{ panel: 'cell', s: { drag: 1, rlabel: 1 } }, { write: 'c3', tex: `\\text{internal resistance: } ${ri('r')}` }, { hl: ['r'] }] },
      { say: "In an old, worn-out battery like Chinedu's, the plates are damaged, so the internal resistance becomes much larger.", ops: [{ panel: 'cell', s: { worn: 1 } }, { write: 'c4', tex: `\\text{worn plates} \\implies \\text{large } ${ri('r')}` }, { camera: 'wide', focus: 'neg' }] },
      { say: "Pushing current through this internal resistance uses up some of each coulomb's energy, and it becomes heat. That's why a battery gets warm when it delivers a large current.", ops: [{ panel: 'cell', s: { heat: 1 } }, { write: 'c5', tex: '\\text{energy lost inside} \\to \\text{heat}' }, { camera: 'wide', focus: 'acid' }] },
      { say: "The voltage used up inside the battery is called the lost volts, small v. Like any resistor, it follows Ohm's law: v equals I times r.", ops: [{ write: 'c6', tex: `${lv('v')} = I${ri('r')}`, note: 'lost volts' }, { box: 'c6' }, { hl: ['v', 'r'] }, { camera: 'wide' }] },
      { say: "Here's a way to picture it. Think of each coulomb as a traveller on a toll road.", ops: [{ clear: 'The energy tollgate' }, { panel: 'toll', s: { stage: 0, nums: 0 }, fresh: 1 }, { camera: 'kit' }] },
      { say: "At the source, every coulomb receives twelve joules. That's the E M F.", ops: [{ panel: 'toll', s: { stage: 1 } }, { write: 't1', tex: `\\text{receives at the source: } ${E('E')}` }, { camera: 'wide', focus: 'source' }] },
      { say: "Before it can leave the battery, it pays a toll at the internal gate. That toll is the lost volts.", ops: [{ panel: 'toll', s: { stage: 2 } }, { write: 't2', tex: `\\text{pays a toll inside: } ${lv('Ir')}` }, { camera: 'wide', focus: 'toll' }] },
      { say: "Whatever is left, it spends in the external circuit, lighting lamps or running motors. That's the terminal p.d.", ops: [{ panel: 'toll', s: { stage: 3 } }, { write: 't3', tex: `\\text{spends outside: } ${Vt('IR')}` }, { camera: 'wide', focus: 'load' }] },
      { say: "Every joule is accounted for. What the source gives equals the toll, plus what is spent outside.", ops: [{ panel: 'toll', s: { stage: 4 } }, { write: 't4', tex: `${E('12\\text{ J}')} = ${lv('\\text{toll}')} + ${Vt('\\text{spent outside}')}` }, { box: 't4' }, { camera: 'wide', dur: 1.6 }] }
    ] },
    { title: 'The complete circuit equation', cues: [
      { say: "Now let's turn the toll road into an equation.", ops: [{ clear: 'The complete circuit equation' }, { panel: null }] },
      { say: "The E M F equals the terminal p.d. plus the lost volts. E equals V plus small v.", ops: [{ write: 'q1', tex: `${E('E')} = ${Vt('V')} + ${lv('v')}` }] },
      { say: "The terminal p.d. drives current through the external load, so V equals I times capital R. The lost volts drive the same current through the internal resistance, so small v equals I times small r.", ops: [{ write: 'q2', tex: `${E('E')} = ${Vt('IR')} + ${lv('Ir')}` }, { hl: ['V', 'v'] }] },
      { say: "Notice the same current flows through both. So we can factorise. E equals I, times R plus r.", ops: [{ write: 'q3', tex: `${E('E')} = ${Ic('I')}(R + r)` }, { hl: ['I'] }] },
      { say: "Rearranging gives the current. I equals E, divided by R plus r.", ops: [{ write: 'q4', tex: `${Ic('I')} = \\dfrac{${E('E')}}{R + r}` }, { box: 'q4' }] },
      { say: "Think of it this way: the battery sees a total resistance of R plus r, the outside load plus its own inside.", ops: [{ panel: 'circuit', s: { sw: 1, A: 3, V: 8.4, ghost: 0, focus: null, showr: 1, bracket: 1, loss: '' }, fresh: 1 }] },
      { say: "And one more form you'll use often. Since V equals E minus the lost volts, V equals E minus I r.", ops: [{ write: 'q5', tex: `${Vt('V')} = ${E('E')} - I${ri('r')}` }, { box: 'q5' }] }
    ] },
    { title: 'Solving the Aba mystery', cues: [
      { say: "Back to Chinedu's battery. We know E is twelve point zero volts, the terminal p.d. is eight point four volts, and the load is two point eight ohms.", ops: [{ clear: 'Example 2.1: the Aba mystery' }, { panel: 'circuit', s: { sw: 1, A: 3, V: 8.4, R: '2.8 Ω', bat: '12 V', amax: 5, vmax: 15, showr: 0, bracket: 0, focus: null, ghost: 0, loss: '', tickA: 0 }, fresh: 1 }, { write: 'x1', tex: `${E('E')} = 12.0\\text{ V},\\ \\ ${Vt('V')} = 8.4\\text{ V},\\ \\ R = 2.8${OHM}` }] },
      { say: "Step one. Find the current from the external load. I equals V over R, eight point four over two point eight, which is three point zero amps.", ops: [{ write: 'x2', tex: `I = \\dfrac{V}{R} = \\dfrac{8.4}{2.8} = ${Ic('3.0\\text{ A}')}`, note: 'step 1' }, { camera: 'board' }] },
      { say: "That matches the ammeter reading. Good.", ops: [{ panel: 'circuit', s: { focus: 'A', tickA: 1 } }, { camera: 'wide', focus: 'A' }] },
      { say: "Step two. Find the lost volts. v equals E minus V, twelve point zero minus eight point four, which is three point six volts.", ops: [{ write: 'x3', tex: `${lv('v')} = E - V = 12.0 - 8.4 = ${lv('3.6\\text{ V}')}`, note: 'step 2' }, { panel: 'circuit', s: { focus: null, tickA: 0 } }, { camera: 'board' }] },
      { say: "There they are: the missing three point six volts were used up inside the battery.", ops: [{ panel: 'circuit', s: { loss: '3.6 V lost inside', focus: 'bat' } }, { hl: ['v'] }, { camera: 'kit', focus: 'bat', dur: 1.3 }] },
      { say: "Step three. Find the internal resistance. r equals v over I, three point six over three point zero, which is one point two ohms.", ops: [{ write: 'x4', tex: `${ri('r')} = \\dfrac{v}{I} = \\dfrac{3.6}{3.0} = ${ri('1.2' + OHM)}`, note: 'step 3' }, { box: 'x4' }, { camera: 'board' }] },
      { say: "Let's check with the complete circuit equation. I equals E over R plus r: twelve over two point eight plus one point two, which is twelve over four, three amps. It works.", ops: [{ write: 'x5', tex: 'I = \\dfrac{12.0}{2.8 + 1.2} = \\dfrac{12.0}{4.0} = 3.0\\text{ A}\\ \\checkmark' }] },
      { say: "Each coulomb gets twelve joules, pays three point six joules as heat inside the battery, and delivers eight point four joules to the load.", ops: [{ panel: 'toll', s: { stage: 4, nums: 1 }, fresh: 1 }, { write: 'x6', tex: `${E('12\\text{ J}')} = ${lv('3.6\\text{ J}')} + ${Vt('8.4\\text{ J}')}` }, { box: 'x6' }, { camera: 'wide' }] }
    ] },
    { title: 'The V–I graph', cues: [
      { say: "Look at V equals E minus I r again. Does it remind you of a straight line, y equals m x plus c?", ops: [{ clear: 'The V–I graph' }, { panel: null }, { write: 'g1', tex: `${Vt('V')} = ${E('E')} - ${ri('r')}I` }, { write: 'g2', tex: 'y = mx + c', at: 3.2 }] },
      { say: "Rewrite it as V equals minus r times I, plus E. If we plot V on the vertical axis against I on the horizontal axis, we get a straight line.", ops: [{ write: 'g3', tex: `V = -${ri('r')}\\,I + ${E('E')}` }, { panel: 'graph', s: { spec: ABA, show: [] }, fresh: 1, at: 2.5 }] },
      { say: "Here is Chinedu's battery. When no current flows, V is twelve volts. At three amps, V is eight point four volts.", ops: [{ panel: 'graph', s: { show: ['pts'] } }, { panel: 'graph', s: { show: ['pts', 'line'] }, at: 4 }] },
      { say: "The vertical intercept, where I is zero, is the E M F. Twelve volts.", ops: [{ panel: 'graph', s: { show: ['pts', 'line', 'E'] } }, { write: 'g4', tex: `\\text{vertical intercept} = ${E('E')} = 12.0\\text{ V}` }, { camera: 'wide', focus: 'E' }] },
      { say: "The gradient is minus r. The line falls three point six volts over three amps, so the gradient is minus one point two. The internal resistance is one point two ohms. Same answer as before.", ops: [{ panel: 'graph', s: { show: ['pts', 'line', 'E', 'grad', 'gradtxt'] } }, { write: 'g5', tex: `\\text{gradient} = \\dfrac{-3.6}{3.0} = -1.2 \\implies ${ri('r = 1.2' + OHM)}` }, { camera: 'wide', focus: ['grad', 'gradtxt'] }] },
      { say: "Where the line meets the horizontal axis, V is zero. That's the short-circuit current, when the terminals are joined by a wire with almost no resistance. I equals E over r, twelve over one point two, ten amps.", ops: [{ panel: 'graph', s: { show: ['pts', 'line', 'E', 'grad', 'gradtxt', 'isc'] } }, { write: 'g6', tex: 'I_{\\text{sc}} = \\dfrac{E}{r} = \\dfrac{12.0}{1.2} = 10\\text{ A}' }, { camera: 'wide', focus: 'isc' }] },
      { say: "Never short-circuit a battery. All of that energy turns to heat inside it.", ops: [{ write: 'g7', tex: '\\text{Never short-circuit a battery!}', note: 'safety' }, { camera: 'wide' }] },
      { say: "Now Example 2.3. A cell's V I graph has a vertical intercept of six point zero volts, and a horizontal intercept of four point zero amps. Find r, and the terminal p.d. when the current is one point two amps.", ops: [{ clear: 'Example 2.3' }, { panel: 'graph', s: { spec: EX23, show: ['line', 'E', 'isc'] }, fresh: 1 }, { write: 'e1', tex: '\\text{intercepts: } V = 6.0\\text{ V},\\ \\ I = 4.0\\text{ A}' }, { write: 'e2', tex: '\\text{Find } r, \\text{ and } V \\text{ when } I = 1.2\\text{ A}', at: 7 }] },
      { say: "The vertical intercept gives E equals six point zero volts. The horizontal intercept is the short-circuit current, so r equals E over I s c: six over four, one point five ohms.", ops: [{ write: 'e3', tex: `${E('E')} = 6.0\\text{ V}` }, { write: 'e4', tex: `${ri('r')} = \\dfrac{E}{I_{\\text{sc}}} = \\dfrac{6.0}{4.0} = ${ri('1.5' + OHM)}`, at: 4 }] },
      { say: "Now the terminal p.d. at one point two amps. V equals E minus I r: six minus one point two times one point five, which is six minus one point eight, four point two volts.", ops: [{ write: 'e5', tex: `V = 6.0 - (1.2)(1.5) = 6.0 - 1.8 = ${Vt('4.2\\text{ V}')}` }, { box: 'e5' }, { panel: 'graph', s: { show: ['line', 'E', 'isc', 'guide', 'pt'], pulse: 'pt' }, at: 6 }, { camera: 'wide', focus: 'pt', at: 3 }] },
      { say: "And the point one point two, four point two lies exactly on the line, as it should.", ops: [{ write: 'e6', tex: '(1.2,\\ 4.2) \\text{ lies on the line}\\ \\checkmark' }, { camera: 'wide' }] }
    ] },
    { title: 'Two readings, same cell', cues: [
      { say: "Remember the question from the start: how can we find E and r without cutting the battery open? Here's the method examiners love.", ops: [{ clear: 'Two readings, same cell' }, { panel: 'circuit', s: { sw: 1, A: 0.8, V: 3.2, R: '4.0 Ω', bat: 'cell', amax: 1, vmax: 5, showr: 0, bracket: 0, focus: null, ghost: 0, loss: '', tickA: 0 }, fresh: 1 }] },
      { say: "Connect the same cell to two different resistors, one at a time, and measure the current each time.", ops: [{ panel: 'circuit', s: { focus: 'A' } }, { panel: 'circuit', s: { R: '7.0 Ω', A: 0.5, V: 3.5 }, at: 3.5 }, { camera: 'wide', focus: 'A' }] },
      { say: "Example 2.2. A cell supplies zero point eight zero amps to a four point zero ohm resistor, and zero point five zero amps to a seven point zero ohm resistor. Find r and E.", ops: [{ write: 'w1', tex: `I_1 = 0.80\\text{ A},\\ \\ R_1 = 4.0${OHM}` }, { write: 'w2', tex: `I_2 = 0.50\\text{ A},\\ \\ R_2 = 7.0${OHM}`, at: 4.5 }, { panel: 'circuit', s: { focus: null } }, { camera: 'wide' }] },
      { say: "The key idea: it's the same cell, so E and r are the same both times. Only R and I change.", ops: [{ write: 'w3', tex: `\\text{same cell} \\implies ${E('E')} \\text{ and } ${ri('r')} \\text{ do not change}`, note: 'the key idea' }, { hl: ['E', 'r'] }] },
      { say: "Write E equals I, times R plus r, for each reading. Since both equal E, we can set them equal to each other.", ops: [{ clear: 'Example 2.2' }, { write: 'w4', tex: 'E = 0.80(4.0 + r)' }, { write: 'w5', tex: 'E = 0.50(7.0 + r)', at: 2.2 }, { write: 'w6', tex: '0.80(4.0 + r) = 0.50(7.0 + r)', at: 5 }, { camera: 'board' }] },
      { say: "Expand both sides. Three point two plus zero point eight r equals three point five plus zero point five r.", ops: [{ write: 'w7', tex: '3.2 + 0.8r = 3.5 + 0.5r' }] },
      { say: "Collect the r terms on one side and the numbers on the other. Zero point three r equals zero point three.", ops: [{ write: 'w8', tex: '0.8r - 0.5r = 3.5 - 3.2' }, { write: 'w9', tex: '0.3r = 0.3', at: 3.5 }] },
      { say: "So r equals one point zero ohm.", ops: [{ write: 'w10', tex: ri('r = 1.0' + OHM) }, { box: 'w10' }] },
      { say: "Now substitute back to find E. E equals zero point eight zero, times four point zero plus one point zero, which is four point zero volts.", ops: [{ write: 'w11', tex: `E = 0.80(4.0 + 1.0) = 0.80 \\times 5.0 = ${E('4.0\\text{ V}')}` }, { box: 'w11' }] },
      { say: "Always check with the other reading: zero point five zero times seven point zero plus one point zero is also four point zero volts. Both readings agree.", ops: [{ write: 'w12', tex: '0.50(7.0 + 1.0) = 4.0\\text{ V}\\ \\checkmark' }] },
      { say: "If you prefer a formula, rearranging gives r equals I two R two, minus I one R one, all over I one minus I two. Use it to check, but in exams, show the simultaneous equation working.", ops: [{ write: 'w13', tex: `r = \\dfrac{I_2R_2 - I_1R_1}{I_1 - I_2}`, note: 'check only' }, { write: 'w13b', tex: `\\phantom{r} = \\dfrac{3.5 - 3.2}{0.30} = 1.0${OHM}`, at: 6 }] }
    ] },
    { title: 'Mistakes, summary and your turn', cues: [
      { say: "Here are the mistakes that cost students marks in WAEC and NECO.", ops: [{ clear: 'Common mistakes' }, { panel: null }, { camera: 'wide' }] },
      { say: "One. Using I equals E over R, and forgetting the internal resistance. The current is E over R plus r.", ops: [{ write: 'm1', tex: '\\times\\ \\ I = \\dfrac{E}{R} \\qquad \\checkmark\\ \\ I = \\dfrac{E}{R + r}' }] },
      { say: "Two. Assuming a voltmeter across a battery always reads the E M F. It only reads E when no current flows.", ops: [{ write: 'm2', tex: '\\text{voltmeter reads } E \\text{ only when } I = 0' }] },
      { say: "Three. Getting the sign of the gradient wrong. The V I line slopes down, so the gradient is minus r, and r itself is positive.", ops: [{ write: 'm3', tex: '\\text{gradient} = -r, \\quad r > 0' }] },
      { say: "Four. Mixing up capital V and small v. Capital V is what the load gets. Small v is what's lost inside.", ops: [{ write: 'm4', tex: `${Vt('V')}: \\text{ outside} \\qquad ${lv('v')}: \\text{ lost inside}` }] },
      { say: "To sum up. E M F is the energy given to each coulomb, and it equals the terminal p.d. on open circuit.", ops: [{ clear: 'Summary' }, { write: 's1', tex: `${E('E')} = \\text{energy per coulomb} = V \\text{ on open circuit}` }] },
      { say: "When current flows, E equals V plus v, so E equals I, times R plus r.", ops: [{ write: 's2', tex: `${E('E')} = ${Vt('V')} + ${lv('v')} = I(R + r)` }] },
      { say: "The terminal p.d. is V equals E minus I r. On a V I graph, the intercept is E and the gradient is minus r.", ops: [{ write: 's3', tex: `${Vt('V')} = ${E('E')} - I${ri('r')}: \\ \\ \\text{intercept} = E,\\ \\text{gradient} = -r` }] },
      { say: "And with two readings from the same cell, solve simultaneous equations to find both E and r.", ops: [{ write: 's4', tex: '\\text{two readings} \\to \\text{simultaneous equations} \\to E,\\ r' }] },
      { say: "Now it's your turn. A cell of E M F nine point zero volts and internal resistance zero point five ohms is connected to a four point zero ohm resistor. Find the current, the terminal p.d., and the lost volts. Pause the video and try it.", hold: 15, ops: [{ clear: 'Your turn' }, { write: 'y1', tex: `E = 9.0\\text{ V},\\ \\ r = 0.5${OHM},\\ \\ R = 4.0${OHM}` }, { write: 'y2', tex: '\\text{Find } I,\\ V \\text{ and } v', at: 7 }] },
      { say: "Here's the solution. I equals E over R plus r: nine over four point five, which is two point zero amps.", ops: [{ write: 'y3', tex: `I = \\dfrac{9.0}{4.0 + 0.5} = ${Ic('2.0\\text{ A}')}` }] },
      { say: "The terminal p.d. is I R: two times four, which is eight point zero volts.", ops: [{ write: 'y4', tex: `${Vt('V')} = IR = 2.0 \\times 4.0 = ${Vt('8.0\\text{ V}')}` }] },
      { say: "And the lost volts are I r: two times zero point five, one point zero volt. Check: eight plus one is nine. It works.", ops: [{ write: 'y5', tex: `${lv('v')} = Ir = 2.0 \\times 0.5 = ${lv('1.0\\text{ V}')}` }, { write: 'y6', tex: '8.0 + 1.0 = 9.0\\text{ V} = E\\ \\checkmark', at: 5 }, { box: 'y6' }] },
      { say: "Well done. Next, try the Bridge Challenge and the quiz to lock it in.", ops: [] }
    ] }
  ]
};
