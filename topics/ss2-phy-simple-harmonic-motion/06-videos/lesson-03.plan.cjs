// Lesson 03 explainer: SHM as a circle's shadow (x = A sin wt, v, a = -w^2 x, crate lift-off w^2 A >= g).
// Direction script: 06-videos/lesson-03-direction-script.md (approved). Kit: reference-circle (plug-in), board for the rest.
// Story numbers (okada, w = 12.57 rad/s, 6.2 cm threshold) are a labelled teaching model.
const k = (r, s) => `\\htmlClass{role-${r}}{${s}}`;
const X = s => k('x', s), Vv = s => k('v', s), Aa = s => k('a', s), Om = s => k('omega', s), G = s => k('g', s);
const T = s => `\\text{${s}}`;
const RC = 'reference-circle';
const D = Math.PI / 180;
const r3 = v => +v.toPrecision(3);

// full default state, so every scene change starts clean
const BASE = { scene: 'circle', A: 0.30, unit: 'm', omega: Math.PI, slow: 1, spin: 0, theta: 0, labels: 1, sun: 0, bracket: 0, xbar: 0,
  varrow: 0, aarrow: 0, components: 0, pins: [], readout: 0, show: [], cursor: 0, g: 9.8, gline: 0, forces: 0, verdict: 0, focus: null };
const P = (s, extra) => Object.assign({ panel: RC, s }, extra || {});
const F = s => P(Object.assign({}, BASE, s), { fresh: 1 });
const W = (id, tex, note, at) => { const o = { write: id, tex }; if (note) o.note = note; if (at !== undefined) o.at = at; return o; };
const wide = focus => (focus ? { camera: 'wide', focus } : { camera: 'wide' });
const WK = 12.57; // okada model omega (rad/s)

module.exports = {
  meta: {
    title: "SHM as a Circle's Shadow", subtitle: 'Lesson 03 · Displacement, velocity, acceleration and when the crates leave',
    eq: 'x = A sin ωt   v = ω√(A² − x²)   a = −ω²x', subject: 'Physics', level: 'SS2 · WAEC / NECO / JAMB',
    next: '#apply', nextLabel: 'Continue to Apply →',
    roles: {
      x: { color: 'green', name: 'displacement' }, v: { color: 'sky', name: 'velocity / speed' }, a: { color: 'amber', name: 'acceleration' },
      omega: { color: 'purple', name: 'angular frequency' }, g: { color: 'red', name: 'gravity' }
    },
    captionFixes: { 'm g over k': 'mg/k', 'V max': 'v max', 'A max': 'a max', 'a max': 'a max' }
  },
  checks: [
    // Ch 3: lab wheel
    ['lab omega 2π/2.0', 2 * Math.PI / 2.0, 3.14, 0.005], ['30° in rad (π/6)', 30 * D, 0.524, 0.001], ['90° in rad', 90 * D, Math.PI / 2],
    ['lab x at 30°', 0.30 * Math.sin(30 * D), 0.150, 1e-9],
    // Ch 4-5: lab v and a
    ['lab v_max', r3(Math.PI * 0.30), 0.942], ['lab a_max', r3(Math.PI ** 2 * 0.30), 2.96], ['lab a at 30°', r3(-(Math.PI ** 2) * 0.30 * Math.sin(30 * D)), -1.48],
    ['lab a/x at 30°', r3(-1.48 / 0.150), -9.87, 0.005], ['-π²', r3(-(Math.PI ** 2)), -9.87],
    ['kit lab x at 60°', r3(0.30 * Math.sin(60 * D)), 0.26], ['kit lab v at 30°', r3(Math.PI * 0.30 * Math.cos(30 * D)), 0.816],
    // Ch 7: WE1
    ['WE1 A²', 0.10 ** 2, 0.010], ['WE1 x²', 0.060 ** 2, 0.0036], ['WE1 A²−x²', 0.10 ** 2 - 0.060 ** 2, 0.0064, 1e-12], ['WE1 root', Math.sqrt(0.0064), 0.080],
    ['WE1 v', 5.0 * Math.sqrt(0.10 ** 2 - 0.060 ** 2), 0.40], ['WE1 ω²', 5.0 ** 2, 25], ['WE1 a', -(5.0 ** 2) * 0.060, -1.5], ['WE1 v_max', 5.0 * 0.10, 0.50],
    { name: 'WE1 v below v_max', test: () => 0.40 < 0.50 },
    // Ch 8: WE2
    ['WE2 ω = 2πf', 2 * Math.PI * 2.0, 4 * Math.PI], ['WE2 ω ≈ 12.57', r3(2 * Math.PI * 2.0), 12.6, 0.05], ['WE2 ωt', 4 * Math.PI * 0.0625, Math.PI / 4],
    ['WE2 sin(π/4)', r3(Math.sin(Math.PI / 4)), 0.707], ['WE2 x', 5.0 * Math.sin(Math.PI / 4), 3.5, 0.04],
    ['WE2 degree-mode slip (cm)', 5.0 * Math.sin((Math.PI / 4) * D), 0.069, 0.0005],
    // Ch 9-10: okada model, lift-off
    ['okada ω from k, m', r3(Math.sqrt(3.16e4 / 200)), 12.6, 0.05], ['okada ω² (3 s.f.)', r3(WK * WK), 158],
    ['WE3 a_max', 158 * 0.030, 4.7, 0.05], ['WE3 v_max', 12.6 * 0.030, 0.38, 0.005],
    { name: 'WE3 below g', test: () => 158 * 0.030 < 9.8 },
    ['WE4 threshold A = g/ω²', 9.8 / 158, 0.062, 0.0005], ['WE4 threshold (cm)', +(100 * 9.8 / 158).toPrecision(2), 6.2],
    ['8 cm bounce a_max', 158 * 0.080, 12.6, 0.05], { name: '8 cm above g', test: () => 158 * 0.080 > 9.8 },
    ['static sag mg/k (cm)', +(100 * 200 * 9.8 / 31600).toPrecision(2), 6.2], ['sag equals g/ω²', 200 * 9.8 / 31600, 9.8 / 158, 0.0003],
    // Ch 13: your turn
    ['YT ω', 2 * Math.PI * 4.0, 25.1, 0.05], ['YT ω²', (2 * Math.PI * 4.0) ** 2, 632, 0.5], ['YT A (m)', 9.8 / 632, 0.0155, 0.00005],
    ['YT A (cm)', +(100 * 9.8 / (2 * Math.PI * 4.0) ** 2).toPrecision(2), 1.6]
  ],
  chapters: [
    // ---------------------------------------------------------------- 1
    { title: 'When do the crates jump?', cues: [
      { say: 'Dayo rides his okada over the ridges, and the egg crates rattle on the carrier. Sometimes they jump clean off. But at what moment, exactly?', ops: [
        { clear: 'When do the crates jump?' },
        F({ scene: 'carrier', A: 3.0, unit: 'cm', omega: WK, slow: 0.25, spin: 1 }),
        W('q', T('At what moment?')) ] },
      { say: 'Tunde is sure. He says they jump where the bike is moving fastest. Zainab is not so sure.', ops: [
        W('t', T('Tunde: where it\'s fastest?'), 'Zainab: not sure') ] },
      { say: 'Mrs Okafor puts the okada on its stand and spins the back wheel. Watch the shadow of a mud lump on the tyre.', ops: [
        F({ scene: 'wheel', spin: 1, sun: 1 }), wide('lump') ] },
      { say: 'By the end, you will use x equals A sine omega t, find speed and acceleration anywhere in the bounce, and predict when the crates leave.', ops: [
        { clear: 'By the end of this video' }, wide(),
        W('o1', T('SHM = a circle\'s shadow')), W('o2', `${X('x')} = A\\sin ${Om('\\omega t')}`, '', 2),
        W('o3', `${Vv('v')}\\ \\text{and}\\ ${Aa('a')}\\ \\text{anywhere}`, '', 4), W('o4', `${T('lift-off: ')}${Om('\\omega')}^2A \\ge ${G('g')}`, '', 6) ] },
    ] },
    // ---------------------------------------------------------------- 2
    { title: "The mud lump's shadow", cues: [
      { say: 'The lump goes round the wheel at a steady rate. The midday sun is overhead, so its shadow falls straight down onto the ground.', ops: [
        { clear: "The lump's shadow" }, P({ focus: 'lump' }), W('s1', T('steady circle above')) ] },
      { say: "Now watch only the shadow. It slows and stops at each end, and rushes through the middle. That is the carrier's bounce: simple harmonic motion.", ops: [
        P({ focus: 'shadow' }), wide('ground'), W('s2', T('shadow slides to and fro')), W('s3', T('shadow → SHM'), '', 5) ] },
      { say: "Two things to notice. The shadow's path is one diameter long, so its amplitude equals the radius of the wheel.", ops: [
        P({ focus: null, bracket: 1 }), wide(), W('s4', T('amplitude A = radius')) ] },
      { say: 'And one turn of the wheel is one full oscillation of the shadow. So they share the same period, and the same omega.', ops: [
        W('s5', `${T('same ')}T${T(', same ')}${Om('\\omega')}`), { box: 's5' } ] },
    ] },
    // ---------------------------------------------------------------- 3
    { title: 'The reference circle and x = A sin ωt', cues: [
      { say: 'Now shine the light from the side instead. The shadow climbs and falls on a wall, up and down, just like the carrier.', ops: [
        { clear: 'The reference circle' }, P({ scene: 'circle', spin: 1, bracket: 0, sun: 0, focus: null }), wide() ] },
      { say: 'This is the reference circle. Its radius is the amplitude, A. The point P goes round at a steady angular speed, omega.', ops: [
        W('c1', T('radius = A')), W('c2', `${T('P turns at steady ')}${Om('\\omega')}`, '', 2.5), { hl: ['omega'], at: 2.5 } ] },
      { say: 'We start the clock when P is level with the centre, so the shadow N starts at the middle, moving up.', ops: [
        P({ spin: 0, theta: 0, xbar: 1 }), wide('shadow'), W('c3', `t = 0:\\ ${X('x')} = 0`) ] },
      { say: 'After a time t, the radius has turned through an angle omega t. The height of P, and of its shadow, is A sine omega t.', ops: [
        P({ theta: 30 }), wide('angle'), W('c4', `${T('angle turned = ')}${Om('\\omega t')}`), W('c5', `${X('x')} = A\\sin ${Om('\\omega t')}`, '', 3), { box: 'c5', at: 5 } ] },
      { say: 'Omega t is an angle in radians. Ninety degrees is pi over two, and thirty degrees is pi over six, about zero point five two four radians.', ops: [
        { clear: 'Angles in radians' }, wide(), W('r1', '90^\\circ = \\pi/2\\ \\text{rad}'), W('r2', '30^\\circ = \\pi/6 = 0.524\\ \\text{rad}', 'RAD mode', 2.5) ] },
      { say: 'Try the lab wheel: radius zero point three zero metres, period two point zero seconds. Omega is two pi over two point zero, about three point one four radians per second.', ops: [
        W('l1', 'A = 0.30\\ \\text{m},\\ T = 2.0\\ \\text{s}'), W('l2', `${Om('\\omega')} = 2\\pi/2.0 = 3.14\\ \\text{rad/s}`, '', 3) ] },
      { say: 'At thirty degrees, x is zero point three zero times sine thirty degrees, which is zero point one five zero metres, as in the lab table.', ops: [
        P({ theta: 30, pins: [30], readout: 1 }), W('l3', `${X('x')} = 0.30\\sin 30^\\circ = 0.150\\ \\text{m}`) ] },
    ] },
    // ---------------------------------------------------------------- 4
    { title: 'Where is the shadow fastest?', cues: [
      { say: 'Pause and predict. Where does the shadow move fastest, at the middle, or at the ends?', hold: 5, ops: [
        { clear: 'Where is it fastest?' }, P({ spin: 1, readout: 0, pins: [] }), wide(), W('f1', T('middle or ends?')) ] },
      { say: 'P always moves at the same speed, omega A, along the circle. But only the up and down part of that velocity moves the shadow.', ops: [
        P({ spin: 0, theta: 30, components: 1, varrow: 1 }), wide('lump'), W('f2', `${T('P: speed ')}${Om('\\omega')}A${T(', always')}`) ] },
      { say: 'At the middle, P is moving straight up, so the shadow gets all of omega A. At the top, P moves sideways, and the shadow stops.', ops: [
        P({ theta: 0 }), wide('shadow'), W('f3', `${T('middle: ')}${Vv('v')} = ${Om('\\omega')}A`),
        P({ theta: 90 }, { at: 5 }), W('f4', `${T('top: ')}${Vv('v')} = 0`, '', 5) ] },
      { say: 'In between, the shadow\'s velocity is omega A cos omega t. Using sine squared plus cos squared equals one, its speed is omega root A squared minus x squared.', ops: [
        { clear: 'Speed anywhere' }, P({ theta: 60, components: 0 }), wide(),
        W('v1', `${Vv('v')} = ${Om('\\omega')}A\\cos ${Om('\\omega t')}`), W('v2', `${Vv('v')} = ${Om('\\omega')}\\sqrt{A^2 - ${X('x')}^2}`, '', 4), { box: 'v2', at: 7 } ] },
      { say: 'So the speed is greatest at the centre, where x is zero. V max equals omega A, zero point nine four two metres per second for the lab wheel.', ops: [
        P({ theta: 0, readout: 1 }), wide(), W('v3', `${Vv('v')}_{max} = ${Om('\\omega')}A\\ (x = 0)`), W('v4', `= 3.14 \\times 0.30 = 0.942\\ \\text{m/s}`, '', 4), { hl: ['v'], at: 4 } ] },
      { say: "Tunde's idea fails already. The ends are where the carrier is momentarily still, not fastest.", ops: [
        P({ theta: 90 }), W('v5', `${T('ends: ')}${Vv('v')} = 0`, 'not fastest!') ] },
    ] },
    // ---------------------------------------------------------------- 5
    { title: 'Acceleration always points home', cues: [
      { say: 'The shadow speeds up towards the middle and slows down away from it. So its acceleration always points back to the centre.', ops: [
        { clear: 'Acceleration' }, P({ spin: 1, varrow: 1, aarrow: 1, readout: 0, components: 0 }), wide('shadow'), W('a1', `${Aa('a')}\\ \\text{always towards O}`) ] },
      { say: 'P is in circular motion, so it has a centripetal acceleration of omega squared A, towards the centre. The shadow gets only its up and down part.', ops: [
        P({ spin: 0, theta: 60, components: 2 }), wide(), W('a2', `${T('P: ')}${Om('\\omega')}^2A${T(' towards O')}`) ] },
      { say: 'That part is minus omega squared x. It is the SHM condition from lesson two: acceleration proportional to displacement, and opposite to it.', ops: [
        W('a3', `${Aa('a')} = -${Om('\\omega')}^2${X('x')}`), { box: 'a3', at: 3 }, { hl: ['a'], at: 1 } ] },
      { say: 'So the acceleration is zero at the centre, and greatest at the ends, where its size is omega squared A.', ops: [
        P({ components: 0, theta: 0 }), P({ theta: 90 }, { at: 3 }), W('a4', `${Aa('a')}_{max} = ${Om('\\omega')}^2A`, 'at x = ±A', 3) ] },
      { say: 'On the lab wheel, a max is pi squared times zero point three zero, which is two point nine six metres per second squared.', ops: [
        { clear: 'Check with the lab' }, P({ readout: 1 }), wide(), W('b1', `${Aa('a')}_{max} = \\pi^2 \\times 0.30`), W('b2', '= 2.96\\ \\text{m/s}^2', '', 3) ] },
      { say: 'At thirty degrees, a over x is minus one point four eight over zero point one five zero. That is minus nine point eight seven, which is minus pi squared, minus omega squared.', ops: [
        P({ theta: 30, pins: [30, 60] }), wide(), W('b3', `${Aa('a')}/${X('x')} = -1.48 \\div 0.150`), W('b4', `= -9.87 = -\\pi^2 = -${Om('\\omega')}^2`, '', 4) ] },
      { say: 'So speed peaks at the centre, and acceleration peaks at the ends. Never in the same place.', ops: [
        P({ pins: [0, 90], readout: 0 }), W('b5', `${Vv('v')}\\ \\text{at centre},\\ ${Aa('a')}\\ \\text{at ends}`), { box: 'b5', at: 3 } ] },
    ] },
    // ---------------------------------------------------------------- 6
    { title: 'Three graphs, one motion', cues: [
      { say: 'Let the wheel turn, and plot all three against time on one time line.', ops: [
        { clear: 'x, v, a against t' }, P({ scene: 'traces', spin: 1, show: [], cursor: 1, pins: [], xbar: 0, varrow: 0, aarrow: 0 }), wide() ] },
      { say: 'Displacement is a sine curve, starting at zero and rising.', ops: [
        P({ show: ['x'] }), wide('traces-x'), W('g1', `${X('x')}:\\ \\text{sine, starts at 0}`) ] },
      { say: 'Velocity is a cosine curve. It is a quarter of a cycle ahead, at its peak whenever x passes through zero.', ops: [
        P({ show: ['x', 'v'] }), wide('traces-v'), W('g2', `${Vv('v')}:\\ \\text{cosine, }\\tfrac14\\ \\text{cycle ahead}`) ] },
      { say: 'Acceleration is x turned upside down, half a cycle out of step. Where x is greatest, a is most negative.', ops: [
        P({ show: ['x', 'v', 'a'] }), wide('traces-a'), W('g3', `${Aa('a')}:\\ ${X('x')}\\ \\text{upside down}`) ] },
    ] },
    // ---------------------------------------------------------------- 7
    { title: 'Speed and acceleration at a point', cues: [
      { say: 'Worked example. A body in SHM has amplitude zero point one zero metres and omega five point zero radians per second. Find its speed and acceleration when x is zero point zero six zero metres.', ops: [
        { clear: 'Example 1' }, { panel: null }, { camera: 'board' },
        W('e1', `A = 0.10\\ \\text{m},\\ ${Om('\\omega')} = 5.0\\ \\text{rad/s}`), W('e2', `${X('x')} = 0.060\\ \\text{m}:\\ ${Vv('v')} = ?\\ ${Aa('a')} = ?`, '', 5) ] },
      { say: 'Step one, the speed. V equals omega root A squared minus x squared. Square first, then subtract: zero point zero one zero minus zero point zero zero three six.', ops: [
        W('e3', `${Vv('v')} = 5.0\\sqrt{0.010 - 0.0036}`, 'square first') ] },
      { say: 'That leaves zero point zero zero six four. Its root is zero point zero eight zero, and five point zero times that is zero point four zero metres per second.', ops: [
        W('e4', `= 5.0 \\times 0.080 = 0.40\\ \\text{m/s}`), { box: 'e4', at: 4 } ] },
      { say: 'Step two, the acceleration. Minus omega squared x is minus twenty-five times zero point zero six zero, which is minus one point five metres per second squared. The minus sign means it points towards the centre.', ops: [
        { clear: 'Example 1 (continued)' }, W('e5', `${Aa('a')} = -25 \\times 0.060 = -1.5\\ \\text{m/s}^2`), W('e6', T('1.5 m/s² towards centre'), '', 5) ] },
      { say: 'Step three. The maximum speed is omega A, five point zero times zero point one zero, which is zero point five zero metres per second. Our zero point four zero is less. It works.', ops: [
        W('e7', `${Vv('v')}_{max} = 5.0 \\times 0.10 = 0.50\\ \\text{m/s}`), W('e8', '0.40 < 0.50\\ \\checkmark', '', 5), { box: 'e8', at: 6 }, { camera: 'wide' } ] },
    ] },
    // ---------------------------------------------------------------- 8
    { title: 'Radians, not degrees', cues: [
      { say: 'Example two, on the okada model. The carrier bounces with amplitude five point zero centimetres at two point zero hertz, timed from the centre. Find x at zero point zero six two five seconds.', ops: [
        { clear: 'Example 2 (model)' }, F({ scene: 'circle', A: 5.0, unit: 'cm', omega: WK, xbar: 1 }), wide(),
        W('m1', 'A = 5.0\\ \\text{cm},\\ f = 2.0\\ \\text{Hz}'), W('m2', `t = 0.0625\\ \\text{s}:\\ ${X('x')} = ?`, '', 5) ] },
      { say: 'Step one. Omega is two pi f, which is four pi radians per second.', ops: [
        W('m3', `${Om('\\omega')} = 2\\pi f = 4\\pi\\ \\text{rad/s}`) ] },
      { say: 'Step two. Omega t is four pi times zero point zero six two five, which is pi over four radians. Put your calculator in radian mode.', ops: [
        P({ theta: 45 }), wide('angle'), W('m4', `${Om('\\omega t')} = 4\\pi \\times 0.0625 = \\pi/4`, 'RAD mode') ] },
      { say: 'Step three. x is five point zero times sine pi over four. That is five point zero times zero point seven zero seven, about three point five centimetres.', ops: [
        { clear: 'Example 2: step 3' }, P({ readout: 1 }), wide(), W('m5', `${X('x')} = 5.0\\sin(\\pi/4)`), W('m6', '= 5.0 \\times 0.707 \\approx 3.5\\ \\text{cm}', '', 3), { box: 'm6', at: 5 } ] },
      { say: 'In degree mode, the same keys give about zero point zero six nine centimetres. A shadow that has hardly moved. That is the classic radian slip.', ops: [
        W('m7', 'DEG\\ \\text{mode: } 0.069\\ \\text{cm}\\ \\times') ] },
    ] },
    // ---------------------------------------------------------------- 9
    { title: 'Why the crates lift off', cues: [
      { say: 'Now the real question. In our story model, omega is twelve point five seven radians per second, so omega squared is one hundred and fifty-eight. Teaching numbers, shown in slow motion.', ops: [
        { clear: 'The crate on the carrier' }, F({ scene: 'carrier', A: 3.0, unit: 'cm', omega: WK, slow: 0.25, spin: 1 }), wide(),
        W('k1', `${Om('\\omega')} = 12.57\\ \\text{rad/s}`, 'model'), W('k2', `${Om('\\omega')}^2 = 158\\ \\text{s}^{-2}`, '', 4) ] },
      { say: 'Look at the forces on a crate. Gravity pulls it down. The carrier pushes it up. But the carrier cannot pull it down. It can only push.', ops: [
        P({ forces: 1 }), wide('crate'), W('k3', T('weight ↓, carrier\'s push ↑'), 'no pull down') ] },
      { say: 'So nothing can make the crate accelerate downwards faster than g, nine point eight metres per second squared. Only gravity pulls it down.', ops: [
        { clear: 'The limit' }, wide(), W('k4', `\\text{crate: }a\\downarrow\\ \\le ${G('g')}`), W('k5', `${G('g')} = 9.8\\ \\text{m/s}^2`, '', 4), { hl: ['g'], at: 4 } ] },
      { say: 'Near the top of the bounce, the carrier is almost still, but it accelerates downwards hardest, at omega squared A.', ops: [
        { clear: 'At the top' }, P({ spin: 0, theta: 90 }), wide('carrier'), W('k6', `${T('carrier: ')}${Aa('a')} = ${Om('\\omega')}^2A${T(' down')}`) ] },
      { say: 'If omega squared A is bigger than g, the carrier drops away faster than the crate can fall. The crate is left in the air.', ops: [
        P({ A: 8.0, spin: 1 }), wide('crate'), W('k7', `${Om('\\omega')}^2A > ${G('g')}:\\ \\text{drops away}`), W('k8', `${T('lift-off: ')}${Om('\\omega')}^2A \\ge ${G('g')}`, '', 4), { box: 'k8', at: 6 } ] },
      { say: 'So Tunde was wrong. The crates leave where the carrier is almost still but accelerating down hardest, not where it moves fastest.', ops: [
        P({ A: 3.0 }), wide(), W('k9', T('not fastest: biggest a ↓')) ] },
    ] },
    // ---------------------------------------------------------------- 10
    { title: 'Stay on or fly?', cues: [
      { say: 'Example three. A gentle bounce of amplitude three point zero centimetres. A max is one hundred and fifty-eight times zero point zero three zero, which is four point seven metres per second squared.', ops: [
        { clear: 'Example 3: A = 3.0 cm' }, P({ verdict: 1, forces: 0 }), W('h1', `${Aa('a')}_{max} = 158 \\times 0.030`), W('h2', '= 4.7\\ \\text{m/s}^2', '', 4) ] },
      { say: 'Four point seven is less than nine point eight. The carrier never falls away faster than the crate. The crates stay on.', ops: [
        wide('crate'), W('h3', `4.7 < 9.8:\\ \\text{crates stay}\\ \\checkmark`) ] },
      { say: 'Its top speed, omega A, is twelve point six times zero point zero three zero, only about zero point three eight metres per second.', ops: [
        wide(), W('h4', `${Vv('v')}_{max} = 12.6 \\times 0.030 \\approx 0.38\\ \\text{m/s}`) ] },
      { say: 'Example four. What is the smallest amplitude that throws the crates? Set omega squared A equal to g, so A equals g over omega squared.', ops: [
        { clear: 'Example 4: threshold' }, W('t1', `${Om('\\omega')}^2A = ${G('g')} \\Rightarrow A = ${G('g')}/${Om('\\omega')}^2`) ] },
      { say: 'A is nine point eight over one hundred and fifty-eight, which is zero point zero six two metres, or six point two centimetres.', ops: [
        W('t2', 'A = 9.8/158 = 0.062\\ \\text{m}'), W('t3', '\\phantom{A} = 6.2\\ \\text{cm}', '', 4), { box: 't3', at: 5 } ] },
      { say: 'Watch an eight centimetre bounce. A max is about twelve point six metres per second squared, more than g. Up goes the crate.', ops: [
        P({ A: 8.0, spin: 1, verdict: 1 }), wide('crate'), W('t4', `A = 8\\ \\text{cm}:\\ 12.6 > 9.8,\\ \\text{lifts}`) ] },
      { say: "Notice: six point two centimetres is also the okada's static sag, since m g over k equals g over omega squared. What pumps the bounce that big? A later lesson.", ops: [
        { clear: 'A clue' }, P({ A: 3.0 }), wide(), W('s1', `\\text{sag} = mg/k = ${G('g')}/${Om('\\omega')}^2`), W('s2', '= 6.2\\ \\text{cm}', '', 4) ] },
    ] },
    // ---------------------------------------------------------------- 11
    { title: 'Common mistakes', cues: [
      { say: 'Mistake one. Fastest at the ends. No. At the ends the body stops and turns round. It is fastest at the centre.', ops: [
        { clear: 'Common mistakes' }, { panel: null }, W('x1', '\\times\\ \\text{fastest at ends}\\ \\to\\ \\checkmark\\ \\text{centre}') ] },
      { say: 'Mistake two. Acceleration is zero at the top because it stops. No. The speed is zero there, but the acceleration is greatest.', ops: [
        W('x2', `\\times\\ ${Aa('a')} = 0\\ \\text{at ends}\\ \\to\\ \\checkmark\\ ${Aa('a')} = ${Om('\\omega')}^2A`) ] },
      { say: 'Mistake three. Degree mode when omega t comes from a time. Omega t is in radians.', ops: [
        W('x3', `\\times\\ \\text{DEG mode}\\ \\to\\ \\checkmark\\ \\text{RAD for }${Om('\\omega t')}`) ] },
      { say: 'Mistake four. Amplitude left in centimetres. For metres per second, change A to metres first.', ops: [
        { clear: 'More mistakes' }, W('x4', '\\times\\ A\\ \\text{in cm}\\ \\to\\ \\checkmark\\ A\\ \\text{in metres}') ] },
      { say: 'Mistake five. Mixing them up. Omega A is the top speed; omega squared A is the top acceleration.', ops: [
        W('x5', `${Om('\\omega')}A = ${Vv('v')}_{max}`), W('x6', `${Om('\\omega')}^2A = ${Aa('a')}_{max}`, '', 3) ] },
    ] },
    // ---------------------------------------------------------------- 12
    { title: 'Summary', cues: [
      { say: "To sum up. SHM is the shadow of steady circular motion, with amplitude equal to the radius. Displacement is A sine omega t, with omega t in radians.", ops: [
        { clear: "Summary: a circle's shadow" }, W('u1', `${X('x')} = A\\sin ${Om('\\omega t')}\\ \\text{(radians)}`) ] },
      { say: 'Speed is omega root A squared minus x squared, greatest at the centre. Acceleration is minus omega squared x, greatest at the ends. And a loose load lifts off when omega squared A reaches g.', ops: [
        W('u2', `${Vv('v')} = ${Om('\\omega')}\\sqrt{A^2 - ${X('x')}^2}`, 'max ωA'), W('u3', `${Aa('a')} = -${Om('\\omega')}^2${X('x')}`, 'max ω²A', 4),
        W('u4', `${T('lift-off: ')}${Om('\\omega')}^2A \\ge ${G('g')}`, '', 8), { box: 'u4', at: 9 } ] },
    ] },
    // ---------------------------------------------------------------- 13
    { title: 'Your turn', cues: [
      { say: 'Your turn. A garri sieve shakes up and down in SHM at four point zero hertz. Taking g as nine point eight, what is the smallest amplitude that makes the grains hop? Pause and try.', hold: 15, ops: [
        { clear: 'Your turn' }, W('y1', `\\text{sieve: }f = 4.0\\ \\text{Hz}`), W('y2', `${G('g')} = 9.8\\ \\text{m/s}^2`, '', 3), W('y3', T('smallest A for hopping?'), '', 6) ] },
      { say: 'Omega is two pi times four point zero, about twenty-five point one radians per second. Omega squared is about six hundred and thirty-two.', ops: [
        W('y4', `${Om('\\omega')} = 2\\pi \\times 4.0 = 25.1\\ \\text{rad/s}`), W('y5', `${Om('\\omega')}^2 \\approx 632\\ \\text{s}^{-2}`, '', 4) ] },
      { say: 'A equals g over omega squared, nine point eight over six hundred and thirty-two. That is about zero point zero one five five metres, or one point six centimetres.', ops: [
        { clear: 'Your turn: answer' }, W('y6', 'A = 9.8/632 \\approx 0.0155\\ \\text{m}'), W('y7', '\\phantom{A} \\approx 1.6\\ \\text{cm}', '', 4), { box: 'y7', at: 5 } ] },
      { say: 'Any bigger, and the tray falls away faster than the grains can fall. Now go on to Apply.', ops: [
        W('y8', 'A > 1.6\\ \\text{cm}:\\ \\text{grains hop}') ] },
    ] },
  ]
};
