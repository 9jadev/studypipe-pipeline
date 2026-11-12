// Demo for video kit "shm-oscillator": every scene, state and close-up, so QA can prove the kit on phone and desktop.
// Build: node .agents/skills/explainer-video/scripts/build.cjs kits/video/shm-oscillator/demo.plan.cjs
// QA:    node .agents/skills/explainer-video/scripts/qa.cjs kits/video/shm-oscillator/demo.html
// Numbers: ss2-phy-simple-harmonic-motion lesson-02 (lab k = 24.5 N/m, okada model k = 3.16 × 10⁴ N/m) and lesson-07
// (Barton driver 0.60 m → 0.45 m; Ridge Road d = 2.5 m, Y = 1.0 cm, ζ 0.05 leaking / 0.30 healthy).
const K = 'shm-oscillator', g = 9.8, PI = Math.PI, KO = 4 * PI * PI * 2.00 * 2.00 * 200;   // okada model k: f0 = 2.00 Hz exactly
const T = (m, k) => 2 * PI * Math.sqrt(m / k);
const Tp = l => 2 * PI * Math.sqrt(l / g);
const ridgeA = (v, m, z, k = KO, d = 2.5, Y = 1.0) => { const w = 2 * PI * v / 3.6 / d, r = w / Math.sqrt(k / m), q = 2 * z * r; return Y * Math.sqrt(1 + q * q) / Math.sqrt((1 - r * r) ** 2 + q * q); };
const lift = v => g / (2 * PI * v / 3.6 / 2.5) ** 2 * 100;
const r2 = v => +v.toFixed(2), r1 = v => +v.toFixed(1), r3 = v => +v.toFixed(3);
module.exports = {
  meta: {
    title: 'SHM oscillator kit demo', subtitle: 'Kit demo · shm-oscillator', subject: 'Kit demo', level: 'QA', theme: 'classic',
    roles: { x: { color: 'blue', name: 'displacement' }, F: { color: 'red', name: 'restoring force' }, a: { color: 'purple', name: 'acceleration' }, k: { color: 'green', name: 'spring constant' }, T: { color: 'gold', name: 'period' } },
  },
  checks: [
    ['50 g stretch (cm)', r1(0.050 * g / 24.5 * 100), 2.0],
    ['100 g stretch (cm)', r1(0.100 * g / 24.5 * 100), 4.0],
    ['250 g stretch (cm)', r1(0.250 * g / 24.5 * 100), 10.0],
    ['200 g stretch (cm)', r1(0.200 * g / 24.5 * 100), 8.0],
    ['force at 2.0 cm (N)', r2(24.5 * 0.020), 0.49],
    ['force at 4.0 cm (N)', r2(24.5 * 0.040), 0.98],
    ['accel at 2.0 cm', r2(24.5 / 0.2 * 0.020), 2.45],
    ['lab period 200 g', r3(T(0.2, 24.5)), 0.568],
    ['okada sag 200 kg (cm)', r1(200 * g / KO * 100), 6.2],
    ['okada sag 250 kg (cm)', r1(250 * g / KO * 100), 7.8],
    ['okada T 200 kg', r2(T(200, KO)), 0.50],
    ['okada f0 200 kg (exact)', 1 / T(200, KO), 2.00, 1e-12],
    ['okada f0 250 kg', r2(1 / T(250, KO)), 1.79],
    ['okada T 250 kg', r2(T(250, KO)), 0.56],
    ['driver 0.60 m period', r3(Tp(0.60)), 1.555],
    ['driver 0.60 m frequency', r2(1 / Tp(0.60)), 0.64],
    ['driver 0.45 m period', r2(Tp(0.45)), 1.35],
    ['ridge f at 18 km/h', r1(18 / 3.6 / 2.5), 2.0],
    ['ridge A 10 km/h leaking', r2(ridgeA(10, 200, 0.05)), 1.44],
    ['ridge A 18 km/h leaking (3 s.f.)', +ridgeA(18, 200, 0.05).toPrecision(3), 10.0],
    ['ridge A 30 km/h leaking', r2(ridgeA(30, 200, 0.05)), 0.57],
    ['ridge A 18 km/h healthy', r1(ridgeA(18, 200, 0.30)), 1.9],
    ['lift-off line 18 km/h', r1(lift(18)), 6.2],
    ['okada force at 2.0 cm (N)', Math.round(KO * 0.02), 632],
    ['250 kg at 16 km/h', r1(ridgeA(16, 250, 0.05)), 10.0],
    ['lift-off line 16 km/h', r1(lift(16)), 7.9],
  ],
  chapters: [
    { title: "Hooke's law", cues: [
      { say: 'A spiral spring hangs from a clamp, with a pointer beside a metre rule.', ops: [{ clear: "Hooke's law" }, { panel: K, s: { scene: 'spring', skin: 'lab', n: 1, m: 0, k: 24.5, g: 9.8, scale: 9, ruler: 1, reading: '0.0 cm', eq: 0, osc: 0, x: 0, tag: '', focus: null }, fresh: 1 }, { camera: 'wide' }, { write: 'a', tex: '\\text{empty hanger}' }] },
      { say: 'Fifty grams pulls the pointer down two point zero centimetres.', ops: [{ panel: K, s: { m: 0.050, reading: '2.0 cm', focus: 'pointer' } }, { camera: 'wide', focus: 'pointer' }, { write: 'b', tex: '0.050\\ \\text{kg} \\to 2.0\\ \\text{cm}' }] },
      { say: 'One hundred grams, four point zero centimetres.', ops: [{ panel: K, s: { m: 0.100, reading: '4.0 cm' } }] },
      { say: 'Two hundred and fifty grams, ten centimetres. The coils spread evenly.', ops: [{ panel: K, s: { m: 0.250, reading: '10.0 cm', focus: 'spring' } }, { camera: 'wide', focus: 'spring' }] },
    ] },
    { title: 'Restoring force', cues: [
      { say: 'Two hundred grams at rest. The spring pull balances the weight.', ops: [{ clear: 'Restoring force' }, { panel: K, s: { m: 0.200, reading: '8.0 cm', eq: 1, balance: 1, x: 0, focus: 'eq' } }, { camera: 'wide', focus: 'eq' }, { write: 'a', tex: '\\text{spring pull} = mg' }] },
      { say: 'Pull it down two centimetres. The force points back up.', ops: [{ panel: K, s: { balance: 0, x: 0.020, xArrow: 1, xLabel: '2.0 cm', force: 1, forceLabel: '0.49 N', reading: '', focus: 'mass' } }, { camera: 'wide', focus: 'mass' }] },
      { say: 'Four centimetres down: double the force.', ops: [{ panel: K, s: { x: 0.040, xLabel: '4.0 cm', forceLabel: '0.98 N' } }] },
      { say: 'Two centimetres above: the force points down, back to equilibrium.', ops: [{ panel: K, s: { x: -0.020, xLabel: '2.0 cm', forceLabel: '0.49 N' } }] },
      { say: 'The acceleration arrow follows the same rule, on the other side.', ops: [{ panel: K, s: { x: 0.020, accel: 1, accelLabel: '2.45 m s⁻²' } }] },
      { say: 'Release it in slow motion. Longest arrows at the ends, none in the middle.', hold: 3, ops: [{ panel: K, s: { xArrow: 0, accel: 0, osc: 1, A: 0.040, x: 0.040, slow: 4, focus: null } }, { camera: 'kit', focus: 'mass' }] },
    ] },
    { title: 'Period and amplitude', cues: [
      { say: 'Two springs, two hundred grams each, pulled one and three centimetres.', ops: [{ clear: 'Same period' }, { panel: K, s: { n: 2, m2: 0.200, force: 0, osc: 1, osc2: 1, A: 0.010, A2: 0.030, x: 0, x2: 0, slow: 2, ruler: 0, tag: 'A = 1.0 cm', tag2: 'A = 3.0 cm', focus: null } }, { camera: 'wide', focus: 'both' }, { write: 'a', tex: 'T = 2\\pi\\sqrt{m/k}' }] },
      { say: 'They stay in step. Both take zero point five six eight seconds.', hold: 2, ops: [{ panel: K, s: { periodLabel: 'T = 0.568 s', periodLabel2: 'T = 0.568 s', force2: 1, forceLabel2: 'F ∝ x', focus: 'mass2' } }, { camera: 'wide', focus: 'mass2' }] },
    ] },
    { title: 'The okada model', cues: [
      { say: 'The okada model: two hundred kilograms and two hundred and fifty kilograms on the rear spring.', ops: [{ clear: 'Okada model' }, { panel: K, s: { skin: 'okada', n: 2, m: 200, m2: 250, k: KO, k2: KO, eq: 1, osc: 0, osc2: 0, x: 0, x2: 0, slow: 1, force2: 0, forceLabel2: '', tag: '200 kg (model)', tag2: '250 kg (model)', periodLabel: '', periodLabel2: '', focus: 'spring' } }, { camera: 'wide' }, { write: 'a', tex: 'k = 3.16\\times10^{4}\\ \\text{N m}^{-1}' }] },
      { say: 'Both bounce. The heavier one bounces more slowly and slips behind.', hold: 3, ops: [{ panel: K, s: { osc: 1, osc2: 1, A: 0.02, A2: 0.02, periodLabel: 'T = 0.50 s', periodLabel2: 'T = 0.56 s', focus: null } }, { camera: 'wide', focus: 'both' }] },
      { say: 'One okada alone, pressed down two centimetres, with its restoring force.', ops: [{ panel: K, s: { n: 1, osc: 0, x: 0.02, xArrow: 1, xLabel: '2.0 cm', force: 1, forceLabel: '632 N', periodLabel: '', tag: '200 kg (model)', focus: 'mass' } }, { camera: 'wide', focus: 'mass' }] },
    ] },
    { title: "Barton's pendulums", cues: [
      { say: 'A heavy driver and five paper cones hang from a taut cord.', ops: [{ clear: "Barton's pendulums" }, { panel: K, s: { scene: 'barton', driverL: 0.60, cones: [0.30, 0.45, 0.60, 0.75, 0.90], swing: 0, match: 0, labels: 1, readout: 0, slow: 1, focus: 'cord' }, fresh: 1 }, { camera: 'wide', focus: 'cord' }, { write: 'a', tex: '\\text{driver } 0.60\\ \\text{m}' }] },
      { say: 'The driver, close up.', ops: [{ panel: K, s: { focus: 'driver' } }, { camera: 'wide', focus: 'driver' }] },
      { say: 'Set it swinging and watch which cone answers.', hold: 6, ops: [{ panel: K, s: { swing: 1, focus: null } }, { camera: 'wide', focus: 'cones' }] },
      { say: 'The zero point six zero metre cone swings widest. It resonates.', hold: 2, ops: [{ panel: K, s: { match: 1, readout: 1, readoutT: 'T = 1.55 s', readoutF: 'f = 0.64 Hz', focus: 'matched' } }, { camera: 'wide', focus: 'matched' }] },
      { say: 'Shorten the driver to zero point four five metres. The widest swing moves.', hold: 6, ops: [{ panel: K, s: { driverL: 0.45, readoutT: 'T = 1.35 s', readoutF: 'f = 0.74 Hz', focus: 'readout' } }, { camera: 'wide' }] },
      { say: 'Now the zero point four five metre cone is the matched one, in slow motion.', hold: 2, ops: [{ panel: K, s: { slow: 2, focus: 'matched' } }, { camera: 'wide', focus: 'matched' }] },
    ] },
    { title: 'Ridge Road', cues: [
      { say: 'The okada on Ridge Road at ten kilometres per hour. Small bumps; the crates are fine.', hold: 1, ops: [{ clear: 'Ridge Road' }, { panel: K, s: { scene: 'ridge', v: 10, m: 200, k: KO, d: 2.5, Y: 1.0, damper: 'leaking', build: 0, labels: 1, trace: 0, gauge: 0, readout: 1, readoutV: 'v = 10 km/h', readoutF: 'f = 1.1 Hz', slow: 1, focus: null }, fresh: 1 }, { camera: 'wide' }, { write: 'a', tex: 'f = v/d' }] },
      { say: 'The ridges, two point five metres apart.', ops: [{ panel: K, s: { focus: 'ridges' } }, { camera: 'wide', focus: 'ridges' }] },
      { say: 'At eighteen, the bounce pumps higher and higher until the crate lifts and cracks.', hold: 8, ops: [{ panel: K, s: { v: 18, build: 1, trace: 1, gauge: 1, gaugeLabel: '10.0 cm', readoutV: 'v = 18 km/h', readoutF: 'f = 2.0 Hz', focus: 'crate' } }, { camera: 'wide', focus: 'crate' }] },
      { say: 'The trace: a tick at every ridge hit, in step with every bounce.', hold: 2, ops: [{ panel: K, s: { focus: 'trace' } }, { camera: 'wide', focus: 'trace' }] },
      { say: 'The gauge: about ten centimetres, past the six point two centimetre lift-off line.', ops: [{ panel: K, s: { focus: 'gauge' } }, { camera: 'wide', focus: 'gauge' }] },
      { say: 'The readout.', ops: [{ panel: K, s: { focus: 'readout' } }, { camera: 'wide', focus: 'readout' }] },
      { say: 'The leaking shock absorber: low oil, the piston moving through air.', ops: [{ panel: K, s: { focus: 'damper' } }, { camera: 'wide', focus: 'damper' }] },
      { say: 'A healthy damper: full of oil, it warms on every stroke. The bounce stays small.', hold: 5, ops: [{ panel: K, s: { damper: 'healthy', gaugeLabel: '1.9 cm', focus: null } }, { camera: 'wide', focus: 'rear' }] },
      { say: 'Five crates, two hundred and fifty kilograms, leaking damper, at sixteen.', hold: 8, ops: [{ panel: K, s: { damper: 'leaking', m: 250, v: 16, slow: 2, gaugeLabel: '10.0 cm', readoutV: 'v = 16 km/h', readoutF: 'f = 1.8 Hz', focus: null } }, { camera: 'wide' }] },
      { say: 'At thirty, the ticks fall all over the cycle and the bounce stays tiny.', hold: 4, ops: [{ panel: K, s: { m: 200, v: 30, slow: 1, gaugeLabel: '0.6 cm', readoutV: 'v = 30 km/h', readoutF: 'f = 3.3 Hz', labels: 0 } }, { camera: 'wide' }] },
    ] },
  ],
};
