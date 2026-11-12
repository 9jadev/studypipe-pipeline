// Demo for video kit "reference-circle": every scene, state and close-up, so QA can prove the kit on phone and desktop.
// Build: node .agents/skills/explainer-video/scripts/build.cjs kits/video/reference-circle/demo.plan.cjs
// QA:    node .agents/skills/explainer-video/scripts/qa.cjs kits/video/reference-circle/demo.html
// Numbers: ss2-phy-simple-harmonic-motion (lab wheel A = 0.30 m, T = 2.0 s, ω = π; okada model ω = 12.57 rad/s, g = 9.8).
const A = 0.30, w = Math.PI, g = 9.8, wk = 12.57;
const r3 = v => +v.toPrecision(3);
const D = Math.PI / 180;
module.exports = {
  meta: {
    title: 'Reference circle kit demo', subtitle: 'Kit demo · reference-circle', subject: 'Kit demo', level: 'QA', theme: 'classic',
    roles: { x: { color: 'green', name: 'displacement' }, v: { color: 'sky', name: 'velocity' }, a: { color: 'amber', name: 'acceleration' }, omega: { color: 'purple', name: 'angle' }, g: { color: 'red', name: 'gravity' } },
  },
  checks: [
    ['x at 30° (m)', r3(A * Math.sin(30 * D)), 0.15],
    ['x at 60° (m)', r3(A * Math.sin(60 * D)), 0.26],
    ['v at 0° (m/s)', r3(w * A), 0.942],
    ['v at 30° (m/s)', r3(w * A * Math.cos(30 * D)), 0.816],
    ['v at 60° (m/s)', r3(w * A * Math.cos(60 * D)), 0.471],
    ['a at 30° (m/s²)', r3(-w * w * A * Math.sin(30 * D)), -1.48],
    ['a at 60° (m/s²)', r3(-w * w * A * Math.sin(60 * D)), -2.56],
    ['a at 90° (m/s²)', r3(-w * w * A), -2.96],
    ['okada ω² (3 s.f.)', r3(wk * wk), 158],
    ['threshold g/ω² (cm, 2 s.f.)', +(100 * g / (wk * wk)).toPrecision(2), 6.2],
    ['a_max at 3 cm', r3(wk * wk * 0.03), 4.74],
    ['a_max at 8 cm', r3(wk * wk * 0.08), 12.6],
    ['x at 45°, A = 5 cm', r3(5 * Math.sin(45 * D)), 3.54],
  ],
  chapters: [
    { title: 'The wheel and its shadow', cues: [
      { say: 'An okada back wheel spins on its stand. A mud lump rides on the tyre.', ops: [{ clear: 'The wheel' }, { panel: 'reference-circle', s: { scene: 'wheel', A: 0.30, unit: 'm', omega: w, slow: 1, spin: 1, theta: 0, labels: 1, sun: 0, bracket: 0, xbar: 0, varrow: 0, aarrow: 0, components: 0, pins: [], readout: 0, show: [], cursor: 0, g: 9.8, gline: 0, forces: 0, verdict: 0, focus: null }, fresh: 1 }, { write: 'a', tex: '\\text{wheel}' }] },
      { say: 'With the midday sun overhead, its shadow falls straight down onto the ground.', ops: [{ panel: 'reference-circle', s: { sun: 1, focus: 'lump' } }, { camera: 'wide', focus: 'lump' }] },
      { say: 'Watch the shadow. It slows and stops at each end, and rushes through the middle.', ops: [{ panel: 'reference-circle', s: { focus: 'shadow' } }, { camera: 'wide', focus: 'ground' }] },
      { say: 'Its path is one diameter long. The amplitude equals the radius of the wheel.', ops: [{ panel: 'reference-circle', s: { focus: null, bracket: 1, spin: 0, theta: 60 } }, { camera: 'wide' }] },
      { say: 'The centre of the wheel is the centre of the motion.', ops: [{ panel: 'reference-circle', s: { focus: 'centre', labels: 0 } }] },
    ] },
    { title: 'The reference circle', cues: [
      { say: 'Turn the picture upright. Here is the reference circle, with P going round and its shadow N on the diameter.', ops: [{ clear: 'Reference circle' }, { panel: 'reference-circle', s: { scene: 'circle', spin: 1, bracket: 1, labels: 1, focus: null } }, { camera: 'wide' }, { write: 'a', tex: '\\text{circle}' }] },
      { say: 'Start the clock when P is level with the centre. The shadow starts at the middle.', ops: [{ panel: 'reference-circle', s: { spin: 0, theta: 0, bracket: 0, xbar: 1, focus: 'centre' } }, { camera: 'wide', focus: 'centre' }] },
      { say: 'At thirty degrees, x is zero point one five zero metres.', ops: [{ panel: 'reference-circle', s: { theta: 30, pins: [30], readout: 1, focus: 'angle' } }, { camera: 'wide', focus: 'angle' }] },
      { say: 'Pins at zero, thirty, sixty and ninety degrees, with their shadows.', ops: [{ panel: 'reference-circle', s: { theta: 60, pins: [0, 30, 60, 90], focus: null } }, { camera: 'wide' }] },
      { say: 'P moves at omega A along the circle. Only the upward part moves the shadow.', ops: [{ panel: 'reference-circle', s: { theta: 30, pins: [], readout: 0, components: 1, varrow: 1, focus: 'lump' } }, { camera: 'wide', focus: 'lump' }] },
      { say: 'At the middle the shadow gets all of omega A.', ops: [{ panel: 'reference-circle', s: { theta: 0, components: 0, readout: 1, focus: 'shadow' } }, { camera: 'wide', focus: 'shadow' }] },
      { say: 'At the top, P moves sideways, and the shadow stops.', ops: [{ panel: 'reference-circle', s: { theta: 90 } }] },
    ] },
    { title: 'Acceleration', cues: [
      { say: 'The acceleration of the shadow always points back to the centre.', ops: [{ clear: 'Acceleration' }, { panel: 'reference-circle', s: { spin: 1, aarrow: 1, readout: 0, focus: null } }, { camera: 'wide' }, { write: 'a', tex: '\\text{acceleration}' }] },
      { say: 'P has a centripetal acceleration omega squared A. The shadow gets its vertical part.', ops: [{ panel: 'reference-circle', s: { spin: 0, theta: 60, components: 2 } }] },
      { say: 'At sixty degrees, a is minus two point five six metres per second squared.', ops: [{ panel: 'reference-circle', s: { components: 0, readout: 1 } }] },
      { say: 'Below the centre, x is negative and a points up.', ops: [{ panel: 'reference-circle', s: { theta: 210, readout: 1 } }] },
      { say: 'Example two: A is five point zero centimetres at forty-five degrees.', ops: [{ panel: 'reference-circle', s: { A: 5.0, unit: 'cm', omega: wk, theta: 45, varrow: 0, aarrow: 0 } }] },
    ] },
    { title: 'Three graphs in step', cues: [
      { say: 'Now plot x, v and a against time on one time line.', ops: [{ clear: 'Traces' }, { panel: 'reference-circle', s: { scene: 'traces', A: 0.30, unit: 'm', omega: w, spin: 1, show: [], cursor: 1, xbar: 0, readout: 0, labels: 1 } }, { camera: 'wide' }, { write: 'a', tex: '\\text{traces}' }] },
      { say: 'Displacement is a sine curve, starting at zero and rising.', ops: [{ panel: 'reference-circle', s: { show: ['x'], xbar: 1 } }, { camera: 'wide', focus: 'traces-x' }] },
      { say: 'Velocity is a cosine, a quarter cycle ahead.', ops: [{ panel: 'reference-circle', s: { show: ['x', 'v'], varrow: 1 } }, { camera: 'wide', focus: 'traces-v' }] },
      { say: 'Acceleration is x upside down.', ops: [{ panel: 'reference-circle', s: { show: ['x', 'v', 'a'], aarrow: 1 } }, { camera: 'wide', focus: 'traces-a' }] },
      { say: 'Freeze at sixty degrees. The cursor runs through all three strips.', ops: [{ panel: 'reference-circle', s: { spin: 0, theta: 60 } }, { camera: 'wide' }] },
      { say: 'On the okada model with eight centimetres, the acceleration dips below minus g.', ops: [{ panel: 'reference-circle', s: { A: 8, unit: 'cm', omega: wk, slow: 0.25, spin: 1, gline: 1 } }, { camera: 'wide', focus: 'gline' }] },
      { say: 'With the lab wheel, the minus g line sits far below the trough.', ops: [{ panel: 'reference-circle', s: { A: 0.30, unit: 'm', omega: w, slow: 1, cursor: 0 } }, { camera: 'wide' }] },
    ] },
    { title: 'The crate on the carrier', cues: [
      { say: 'The crate sits loosely on the carrier. A gentle bounce of three centimetres.', ops: [{ clear: 'Carrier' }, { panel: 'reference-circle', s: { scene: 'carrier', A: 3.0, unit: 'cm', omega: wk, slow: 0.25, spin: 1, forces: 0, verdict: 0, gline: 0, labels: 1, focus: null } }, { camera: 'wide' }, { write: 'a', tex: '\\text{carrier}' }] },
      { say: 'Gravity pulls the crate down. The carrier can only push it up.', ops: [{ panel: 'reference-circle', s: { forces: 1, focus: 'crate' } }, { camera: 'wide', focus: 'crate' }] },
      { say: 'At the top the carrier accelerates downwards hardest.', ops: [{ panel: 'reference-circle', s: { spin: 0, theta: 90, focus: 'carrier' } }, { camera: 'wide', focus: 'carrier' }] },
      { say: 'Three centimetres: omega squared A is four point seven four. It stays on.', ops: [{ panel: 'reference-circle', s: { verdict: 1, focus: null } }, { camera: 'wide' }] },
      { say: 'Eight centimetres: twelve point six, more than g. The crate leaves near the top.', ops: [{ panel: 'reference-circle', s: { A: 8.0, spin: 1 } }] },
      { say: 'Frozen as the carrier falls away: the crate is still in the air, and the push is zero.', ops: [{ panel: 'reference-circle', s: { spin: 0, theta: 160, focus: 'crate' } }, { camera: 'wide', focus: 'crate' }] },
      { say: 'Without labels or arrows, the scene stays clean.', ops: [{ panel: 'reference-circle', s: { spin: 1, labels: 0, forces: 0, verdict: 0, focus: null } }, { camera: 'wide' }] },
    ] },
  ],
};
