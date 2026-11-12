// Demo for video kit "membrane-transport": every scene, state and close-up, so QA can prove the kit on phone and desktop.
// Build: node .agents/skills/explainer-video/scripts/build.cjs kits/video/membrane-transport/demo.plan.cjs
// QA:    node .agents/skills/explainer-video/scripts/qa.cjs kits/video/membrane-transport/demo.html
const pct = (i, f) => (f - i) / i * 100;
const K = 'membrane-transport';
module.exports = {
  meta: { title: 'Membrane transport kit demo', subtitle: 'Kit demo · membrane-transport', subject: 'Kit demo', level: 'QA', theme: 'classic' },
  checks: [
    ['0.0 mol strip: 2.50 to 2.85 g is +14.0%', pct(2.50, 2.85), 14.0, 0.05],
    ['0.6 mol strip: 2.50 to 2.30 g is -8.0%', pct(2.50, 2.30), -8.0, 0.05],
    { name: 'gain means water entered (hypotonic)', test: () => pct(2.50, 2.85) > 0 },
    { name: 'loss means water left (hypertonic)', test: () => pct(2.50, 2.30) < 0 },
  ],
  chapters: [
    { title: 'Diffusion', cues: [
      { say: 'Particles start crowded on the left.', ops: [{ clear: 'Diffusion' }, { panel: K, s: { scene: 'membrane', mode: 'diffusion', spread: 0, flow: 1, arrows: 1, labels: 1, focus: null }, fresh: 1 }, { write: 'a', tex: '\\text{crowded} \\to \\text{fewer}' }] },
      { say: 'They spread out from crowded to fewer.', ops: [{ panel: K, s: { spread: 0.5, focus: 'left' } }, { camera: 'wide', focus: 'left' }] },
      { say: 'Now they are evenly spread, but they keep moving.', ops: [{ panel: K, s: { spread: 1, focus: 'right' } }, { camera: 'wide', focus: 'right' }] },
    ] },
    { title: 'Osmosis', cues: [
      { say: 'A selectively permeable membrane. Predict first.', ops: [{ clear: 'Osmosis' }, { panel: K, s: { mode: 'osmosis', level: 0, flow: 0, focus: 'membrane' } }, { camera: 'wide', focus: 'membrane' }, { write: 'b', tex: '\\text{water only}' }] },
      { say: 'Water crosses both ways, but sugar is too big for the pores.', ops: [{ panel: K, s: { flow: 1, focus: 'pore' } }, { camera: 'kit', focus: 'pore' }] },
      { say: 'More water moves into the concentrated side, so its level rises.', ops: [{ panel: K, s: { level: 1, focus: null } }, { camera: 'wide' }] },
    ] },
    { title: 'Active transport', cues: [
      { say: 'Few ions outside, many inside. With no energy, nothing crosses.', ops: [{ clear: 'Active transport' }, { panel: K, s: { mode: 'active', pump: 0 } }, { write: 'c', tex: '\\text{needs ATP}' }] },
      { say: 'With A T P, the carrier pumps ions against the gradient.', ops: [{ panel: K, s: { pump: 1, focus: 'pump' } }, { camera: 'kit', focus: 'pump' }] },
      { say: 'One ion each cycle.', ops: [{ camera: 'wide' }, { panel: K, s: { focus: null } }] },
    ] },
    { title: 'Hypotonic', cues: [
      { say: 'Both cells in a hypotonic solution.', ops: [{ clear: 'Cells in solutions' }, { panel: K, s: { scene: 'cells', solution: 'hypo', progress: 0, plant: 1, rbc: 1, arrows: 1, labels: 1, terms: 1, focus: 'bath' }, fresh: 1 }, { camera: 'wide', focus: 'bath' }, { write: 'd', tex: '\\text{hypotonic}' }] },
      { say: 'Water enters. The red cell swells.', ops: [{ panel: K, s: { progress: 0.8, focus: 'rbc' } }, { camera: 'wide', focus: 'rbc' }] },
      { say: 'The plant cell becomes turgid, the red cell bursts.', ops: [{ panel: K, s: { progress: 1, focus: null } }, { camera: 'wide' }] },
    ] },
    { title: 'Isotonic', cues: [
      { say: 'In an isotonic solution water moves in and out equally.', ops: [{ panel: K, s: { solution: 'iso', progress: 1, focus: 'plant' } }, { camera: 'wide', focus: 'plant' }, { clear: "Isotonic" }, { write: "h", tex: "\\text{isotonic}" }] },
    ] },
    { title: 'Hypertonic', cues: [
      { say: 'In a hypertonic solution water leaves both cells.', ops: [{ panel: K, s: { solution: 'hyper', progress: 0, focus: null } }, { camera: 'wide' }, { clear: "Hypertonic" }, { write: "i", tex: "\\text{hypertonic}" }] },
      { say: 'The plant cell is plasmolysed, the red cell is crenated.', ops: [{ panel: K, s: { progress: 1, focus: 'wall' } }, { camera: 'wide', focus: 'wall' }] },
      { say: 'The plant cell alone.', ops: [{ panel: K, s: { rbc: 0, focus: null } }, { camera: 'wide' }] },
      { say: 'The red cell alone.', ops: [{ panel: K, s: { rbc: 1, plant: 0 } }] },
    ] },
    { title: 'Potato strip', cues: [
      { say: 'A strip weighed before, two point five zero grams.', ops: [{ clear: 'Potato strip' }, { panel: K, s: { scene: 'strip', conc: 0, mass: 2.50, change: 0, onBalance: 1, arrows: 1, labels: 1, focus: 'balance' }, fresh: 1 }, { camera: 'kit', focus: 'balance' }, { write: 'e', tex: '0.0\\ \\text{mol dm}^{-3}' }] },
      { say: 'In water for thirty minutes, it takes in water.', ops: [{ panel: K, s: { onBalance: 0, change: 14, focus: 'strip' } }, { camera: 'wide', focus: 'strip' }] },
      { say: 'Now it weighs two point eight five grams.', ops: [{ panel: K, s: { onBalance: 1, mass: 2.85, focus: null } }, { camera: 'wide' }, { write: 'f', tex: '+14.0\\%' }] },
      { say: 'A fresh strip in zero point six sucrose.', ops: [{ panel: K, s: { conc: 0.6, mass: 2.50, change: 0, onBalance: 0, focus: 'tube' } }, { camera: 'wide', focus: 'tube' }] },
      { say: 'It loses water and goes limp.', ops: [{ panel: K, s: { change: -8, focus: 'strip' } }, { camera: 'kit', focus: 'strip' }] },
      { say: 'Two point three zero grams.', ops: [{ panel: K, s: { onBalance: 1, mass: 2.30, focus: 'balance' } }, { camera: 'wide', focus: 'balance' }, { write: 'g', tex: '-8.0\\%' }] },
      { say: 'And back out.', ops: [{ camera: 'wide' }, { panel: K, s: { focus: null } }] },
    ] },
  ],
};
