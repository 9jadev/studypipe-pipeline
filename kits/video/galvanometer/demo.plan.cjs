// Demo for video kit "galvanometer": every scene, state and close-up, so QA can prove the kit on phone and desktop.
// Build: node .agents/skills/explainer-video/scripts/build.cjs kits/video/galvanometer/demo.plan.cjs
// QA:    node .agents/skills/explainer-video/scripts/qa.cjs kits/video/galvanometer/demo.html
// Numbers: one 15 mA, 18 Ω movement (ss2-phy-ohms-law-circuits 02-lesson.md, Lesson 04).
const Ig = 0.015, Rg = 18;
const Rs = Ig * Rg / (3 - Ig);                 // shunt for a 3 A ammeter
const Rtot = 40 / Ig, Rm = Rtot - Rg;          // multiplier for a 40 V voltmeter
const Ramm = 1 / (1 / Rg + 1 / Rs);            // finished ammeter
const r3 = v => +v.toPrecision(3);
module.exports = {
  meta: {
    title: 'Galvanometer kit demo', subtitle: 'Kit demo · galvanometer', subject: 'Kit demo', level: 'QA', theme: 'classic',
    roles: { I: { color: 'sky', name: 'line current' }, Ig: { color: 'gold', name: 'coil current' }, Rg: { color: 'pink', name: 'coil resistance' }, Rs: { color: 'green', name: 'shunt' }, Rm: { color: 'orange', name: 'multiplier' } },
  },
  checks: [
    ['coil p.d. at full scale (V)', Ig * Rg, 0.27],
    ['shunt R_s (3 s.f.)', r3(Rs), 0.0905],
    ['shunt current (A)', 3 - Ig, 2.985],
    ['ammeter total (3 s.f.)', r3(Ramm), 0.09],
    ['bare coil on 40 V (2 s.f.)', +(40 / Rg).toPrecision(2), 2.2],
    ['voltmeter total (nearest ohm)', Math.round(Rtot), 2667],
    ['multiplier R_m (nearest ohm)', Math.round(Rm), 2649],
    ['multiplier p.d. (V)', 40 - Ig * Rg, 39.73],
    ['loop current 12/(1.2+2.8)', 12 / (1.2 + 2.8), 3],
    ['ammeter in loop (2 s.f.)', +(12 / (4 + Ramm)).toPrecision(2), 2.9],
    ['aDefl on 3 A scale', +(12 / (4 + Ramm) / 3).toFixed(3), 0.978],
    ['18 ohm ammeter (2 s.f.)', +(12 / (4 + 18)).toPrecision(2), 0.55],
    ['aDefl 18 ohm', +(12 / 22 / 3).toFixed(2), 0.18],
    ['terminal p.d. 12 - 3x1.2', 12 - 3 * 1.2, 8.4],
    ['vDefl on 40 V scale', 8.4 / 40, 0.21],
  ],
  chapters: [
    { title: 'Inside the meter', cues: [
      { say: 'A moving-coil galvanometer. Its pointer swings across a fifteen milliamp scale.', ops: [{ clear: 'Galvanometer kit' }, { panel: 'galvanometer', s: { scene: 'dial', scaleMax: 15, unit: 'mA', defl: 0.6, inside: 0, labels: 0, burn: 0, rg: '', focus: null }, fresh: 1 }, { write: 'a', tex: '\\text{dial}' }] },
      { say: 'Push too much current through it and the pointer slams against the stop. The coil burns out.', ops: [{ panel: 'galvanometer', s: { defl: 1.2, burn: 1 } }] },
      { say: 'Here is the scale, close up.', ops: [{ panel: 'galvanometer', s: { defl: 0.6, burn: 0, focus: 'scale' } }, { camera: 'wide', focus: 'scale' }] },
      { say: 'Inside: a coil between curved magnet poles, a soft iron cylinder, and a hairspring.', ops: [{ panel: 'galvanometer', s: { inside: 1, labels: 1, focus: null } }, { camera: 'wide' }] },
      { say: 'Close up on the coil. It turns with the pointer and winds the hairspring.', ops: [{ panel: 'galvanometer', s: { defl: 1, focus: 'coil' } }, { camera: 'wide', focus: 'coil' }] },
      { say: 'Full scale is fifteen milliamps, and the coil resistance is eighteen ohms.', ops: [{ panel: 'galvanometer', s: { rg: 'R_g = 18 Ω', focus: 'dial' } }, { camera: 'wide', focus: 'dial' }] },
    ] },
    { title: 'Ammeter: shunt in parallel', cues: [
      { say: 'Now the meter box, with the coil and a short, thick shunt in parallel.', ops: [{ clear: 'Ammeter' }, { panel: 'galvanometer', s: { scene: 'convert', mode: 'ammeter', inside: 0, labels: 1, flow: 1, speed: 0.6, split: 1, iLine: '3.0 A', iCoil: 'I_g', iShunt: 'I − I_g', defl: 1, focus: null } }, { camera: 'wide' }, { write: 'a', tex: '\\text{shunt in parallel}' }] },
      { say: 'At the junction the line current splits. The coil takes only a little.', ops: [{ panel: 'galvanometer', s: { focus: 'junction' } }, { camera: 'wide', focus: 'junction' }] },
      { say: 'Both branches share the same potential difference.', ops: [{ panel: 'galvanometer', s: { pd: 1, vCoil: 'same p.d.', focus: 'pd' } }, { camera: 'wide', focus: 'pd' }] },
      { say: 'The shunt is point zero nine zero five ohms. It carries two point nine eight five amps.', ops: [{ panel: 'galvanometer', s: { pd: 0, rs: 'R_s = 0.0905 Ω', iCoil: '15 mA', iShunt: '2.985 A', focus: 'shunt' } }, { camera: 'wide', focus: 'shunt' }] },
      { say: 'Relabel the dial: full scale is now three amps.', ops: [{ panel: 'galvanometer', s: { scaleMax: 3, unit: 'A', focus: 'G' } }, { camera: 'wide', focus: 'G' }] },
      { say: 'The finished ammeter has a very small resistance.', ops: [{ panel: 'galvanometer', s: { box: 1, total: 'meter = 0.0900 Ω', focus: 'box' } }, { camera: 'wide', focus: 'box' }] },
    ] },
    { title: 'Voltmeter: multiplier in series', cues: [
      { say: 'Forty volts across the bare coil drives about two point two amps. It burns out.', ops: [{ clear: 'Voltmeter' }, { panel: 'galvanometer', s: { mode: 'bare', box: 0, total: '', rs: '', split: 1, iLine: '≈ 2.2 A', iCoil: '', iShunt: '', scaleMax: 15, unit: 'mA', burn: 1, defl: 1.2, focus: null } }, { camera: 'wide' }, { write: 'a', tex: '\\text{multiplier in series}' }] },
      { say: 'Add a long multiplier in series. One current flows through both.', ops: [{ panel: 'galvanometer', s: { mode: 'voltmeter', burn: 0, defl: 0.6, iLine: '15 mA', rm: 'R_m = ?', focus: 'multiplier' } }, { camera: 'wide', focus: 'multiplier' }] },
      { say: 'The potential differences add: point two seven volts plus thirty nine point seven three volts makes forty.', ops: [{ panel: 'galvanometer', s: { rm: 'R_m = 2 649 Ω', defl: 1, pd: 1, vCoil: '0.27 V', vOther: '39.73 V', vTotal: '40 V', scaleMax: 40, unit: 'V', focus: 'pd' } }, { camera: 'wide' }] },
      { say: 'The finished voltmeter has a large resistance.', ops: [{ panel: 'galvanometer', s: { box: 1, total: 'meter = 2 667 Ω', focus: 'box' } }, { camera: 'wide', focus: 'box' }] },
    ] },
    { title: 'Testing on the battery', cues: [
      { say: 'Emeka’s battery: twelve volts, internal resistance one point two ohms, and a two point eight ohm load.', ops: [{ clear: 'Test loop' }, { panel: 'galvanometer', s: { scene: 'test', bat: '12.0 V', r: 'r = 1.2 Ω', R: '2.8 Ω', I: 3.0, imax: 3, ammeter: 0, voltmeter: 0, verdict: null, labels: 1, focus: null } }, { camera: 'wide' }, { write: 'a', tex: '\\text{test}' }] },
      { say: 'The battery, close up.', ops: [{ panel: 'galvanometer', s: { focus: 'battery' } }, { camera: 'wide', focus: 'battery' }] },
      { say: 'The ammeter goes in series. It reads about two point nine amps.', ops: [{ panel: 'galvanometer', s: { ammeter: 1, aMax: 3, aDefl: 0.978, aRead: '≈ 2.9 A', aR: '0.0900 Ω', verdict: 'ok', focus: 'ammeter' } }, { camera: 'wide', focus: 'ammeter' }] },
      { say: 'With an eighteen ohm meter instead, the current drops to about point five five amps.', ops: [{ panel: 'galvanometer', s: { aR: '18 Ω', aDefl: 0.18, aRead: '≈ 0.55 A', I: 0.55, verdict: 'bad', focus: null } }, { camera: 'wide' }] },
      { say: 'The voltmeter goes in parallel across the battery. It reads eight point four volts.', ops: [{ panel: 'galvanometer', s: { ammeter: 0, I: 3.0, verdict: null, voltmeter: 1, vMax: 40, vDefl: 0.21, vRead: '8.4 V', vR: '2 667 Ω', focus: 'voltmeter' } }, { camera: 'wide', focus: 'voltmeter' }] },
      { say: 'And the load, close up.', ops: [{ panel: 'galvanometer', s: { focus: 'load' } }, { camera: 'wide', focus: 'load' }] },
    ] },
    { title: 'Swapped places', cues: [
      { say: 'Mistake: the shunt in series with the coil. All the current goes through the coil, and it burns out.', ops: [{ clear: 'Mistakes' }, { panel: 'galvanometer', s: { scene: 'convert', mode: 'ammeter', wrong: 'shunt-series', burn: 1, defl: 1.2, scaleMax: 3, unit: 'A', box: 0, total: '', pd: 0, split: 1, iLine: '3.0 A', iCoil: '3.0 A', iShunt: '', rs: 'R_s = 0.0905 Ω', rm: '', speed: 1, focus: null } }, { camera: 'wide' }, { write: 'a', tex: '\\text{wrong places}' }] },
      { say: 'Mistake: the multiplier across the coil. The coil still gets the full forty volts.', ops: [{ panel: 'galvanometer', s: { mode: 'voltmeter', wrong: 'multiplier-parallel', scaleMax: 40, unit: 'V', iLine: '≈ 2.2 A', iCoil: '', rs: '', rm: 'R_m = 2 649 Ω', speed: 0.6 } }] },
      { say: 'Without labels, the bare schematic stays clean.', ops: [{ panel: 'galvanometer', s: { wrong: null, mode: 'ammeter', burn: 0, defl: 1, scaleMax: 3, unit: 'A', labels: 0, split: 0, flow: 0, rm: '', rs: 'R_s = 0.0905 Ω' } }] },
    ] },
  ],
};
