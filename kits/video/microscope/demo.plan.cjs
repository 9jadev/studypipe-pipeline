// Demo for video kit "microscope": every scene, state and close-up, so QA can prove the kit on phone and desktop.
// Build: node .agents/skills/explainer-video/scripts/build.cjs kits/video/microscope/demo.plan.cjs
// QA:    node .agents/skills/explainer-video/scripts/qa.cjs kits/video/microscope/demo.html
const M = (e, o) => e * o;                                   // total magnification (the kit computes the same)
const N = (fov, cell) => Math.round(fov / cell);             // cells across the field (the kit computes the same)
const sig2 = v => v.toPrecision(2);
const k = (r, s) => `\\htmlClass{role-${r}}{${s}}`;
module.exports = {
  meta: {
    title: 'Microscope kit demo', subtitle: 'Kit demo · microscope', subject: 'Kit demo', level: 'QA', theme: 'classic',
    roles: { eyepiece: { color: 'amber', name: 'eyepiece' }, objective: { color: 'sky', name: 'objective' }, M: { color: 'green', name: 'total magnification' } },
  },
  checks: [
    ['x10 eyepiece, x4 objective', M(10, 4), 40], ['x10 eyepiece, x10 objective', M(10, 10), 100], ['x10 eyepiece, x40 objective', M(10, 40), 400],
    ['field x magnification constant (x4)', 4.0 * 40, 160], ['field x magnification constant (x10)', 1.6 * 100, 160], ['field x magnification constant (x40)', 0.40 * 400, 160],
    ['cells across 4.0 mm', N(4.0, 0.05), 80], ['cells across 1.6 mm', N(1.6, 0.05), 32], ['cells across 0.40 mm', N(0.40, 0.05), 8], ['cells across 0.80 mm (0.040 cell)', N(0.80, 0.040), 20],
    ['red cells across 0.40 mm', N(0.40, 0.008), 50],
    ['actual size of 24 mm image at x400 (mm)', 24 / 400, 0.06], ['actual size in micrometres', 24 / 400 * 1000, 60],
    { name: '2 s.f. labels', test: () => sig2(4.0) === '4.0' && sig2(0.4) === '0.40' && sig2(0.06) === '0.060' && sig2(1.6) === '1.6' },
  ],
  chapters: [
    { title: 'The instrument', cues: [
      { say: 'A school compound light microscope, standing on the bench.', ops: [{ clear: 'Microscope kit' }, { panel: 'microscope', s: { scene: 'scope', labels: 0, light: 0, objective: 4, eyepiece: 10, readout: 0, knob: null, focus: null }, fresh: 1 }, { write: 'a', tex: '\\text{scope}' }] },
      { say: 'Light from the mirror passes up through the slide, the objective, the tube and the eyepiece to your eye.', ops: [{ panel: 'microscope', s: { light: 1 } }] },
      { say: 'Here are its parts.', ops: [{ panel: 'microscope', s: { labels: 1 } }] },
      { say: 'The eyepiece is marked times ten.', ops: [{ panel: 'microscope', s: { focus: 'eyepiece' } }, { camera: 'wide', focus: 'eyepiece' }] },
      { say: 'The mirror sends light up through the stage.', ops: [{ panel: 'microscope', s: { focus: 'mirror' } }, { camera: 'wide', focus: 'mirror' }] },
      { say: 'The stage holds the slide under two clips, above the condenser.', ops: [{ panel: 'microscope', s: { focus: 'stage' } }, { camera: 'wide', focus: 'stage' }] },
    ] },
    { title: 'Objectives and magnification', cues: [
      { say: 'Low power first: times ten eyepiece and times four objective.', ops: [{ panel: 'microscope', s: { readout: 1, focus: 'objectives' } }, { camera: 'wide', focus: 'objectives' }, { write: 'm', tex: `${k('eyepiece', '\\times10')}\\times${k('objective', '\\times4')} = ${k('M', '\\times40')}` }] },
      { say: 'Turn the nosepiece to the times ten objective.', ops: [{ panel: 'microscope', s: { objective: 10 } }] },
      { say: 'Then the times forty objective, the longest, closest to the slide.', ops: [{ panel: 'microscope', s: { objective: 40 } }] },
      { say: 'The readout multiplies: times four hundred.', ops: [{ panel: 'microscope', s: { focus: 'readout' } }, { camera: 'wide', focus: 'readout' }] },
      { say: 'The coarse knob moves the stage a long way.', ops: [{ panel: 'microscope', s: { knob: 'coarse', objective: 4, focus: 'knobs' } }, { camera: 'wide', focus: 'knobs' }] },
      { say: 'At high power, only the fine knob, a tiny movement.', ops: [{ panel: 'microscope', s: { knob: 'fine', objective: 40 } }] },
      { say: 'A times fifteen eyepiece gives times six hundred.', ops: [{ panel: 'microscope', s: { knob: null, eyepiece: 15, focus: null } }, { camera: 'wide' }] },
    ] },
    { title: 'Down the eyepiece', cues: [
      { say: 'Cork: empty boxes with thick walls.', ops: [{ panel: 'microscope', s: { scene: 'field', slide: 'cork', fov: 1.6, cell: 0.05, mag: 100, labels: 1, ruler: 0, count: 0, focus: null }, fresh: 1 }] },
      { say: 'Close up on one cork cell.', ops: [{ panel: 'microscope', s: { focus: 'cell' } }, { camera: 'wide', focus: 'cell' }] },
      { say: 'Onion skin: box cells, each with a nucleus.', ops: [{ panel: 'microscope', s: { slide: 'onion' } }] },
      { say: 'Blood: round red cells with no nucleus, and one white cell.', ops: [{ panel: 'microscope', s: { slide: 'blood' } }] },
      { say: 'Cheek cells: flat, with a nucleus and no wall.', ops: [{ panel: 'microscope', s: { slide: 'cheek', fov: 0.80, mag: 200 } }] },
      { say: 'The whole field of view.', ops: [{ panel: 'microscope', s: { focus: 'field' } }, { camera: 'wide', focus: 'field' }] },
    ] },
    { title: 'Counting cells', cues: [
      { say: 'Onion at times forty: the field is four millimetres across.', ops: [{ panel: 'microscope', s: { scene: 'field', slide: 'onion', fov: 4.0, cell: 0.05, mag: 40, labels: 0, ruler: 1, count: 1, focus: 'ruler' }, fresh: 1 }, { camera: 'wide', focus: 'ruler' }] },
      { say: 'Times one hundred: one point six millimetres, thirty-two cells.', ops: [{ panel: 'microscope', s: { fov: 1.6, mag: 100, focus: 'row' } }, { camera: 'wide', focus: 'row' }] },
      { say: 'Times four hundred: eight cells. The cell has not changed.', ops: [{ panel: 'microscope', s: { fov: 0.40, mag: 400 } }] },
      { say: 'A smaller cell at times two hundred: twenty across.', ops: [{ panel: 'microscope', s: { cell: 0.040, fov: 0.80, mag: 200, focus: null } }, { camera: 'wide' }] },
      { say: 'Blood at times four hundred: fifty red cells across.', ops: [{ panel: 'microscope', s: { slide: 'blood', cell: 0.008, fov: 0.40, mag: 400 } }] },
    ] },
    { title: 'Actual size', cues: [
      { say: 'A photo of a cheek cell, twenty-four millimetres long at times four hundred.', ops: [{ panel: 'microscope', s: { scene: 'photo', specimen: 'cheek', image: 24, mag: 400, shrink: 0, um: 0, labels: 1, focus: 'bracket' }, fresh: 1 }, { camera: 'wide', focus: 'bracket' }] },
      { say: 'Divide by the magnification to find its real size.', ops: [{ panel: 'microscope', s: { shrink: 1, focus: null } }, { camera: 'wide' }] },
      { say: 'Point zero six millimetres is sixty micrometres.', ops: [{ panel: 'microscope', s: { um: 1, focus: 'actual' } }, { camera: 'wide', focus: 'actual' }] },
      { say: 'An onion cell photo works the same way.', ops: [{ panel: 'microscope', s: { specimen: 'onion', image: 25, mag: 100, shrink: 0, um: 0, focus: null } }, { camera: 'wide' }] },
      { say: 'Real size: a quarter of a millimetre.', ops: [{ panel: 'microscope', s: { shrink: 1, um: 1 } }] },
    ] },
  ],
};
