// Demo for video kit "capillary-bed": every state and close-up, so QA can prove the kit on phone and desktop.
// Build: node .agents/skills/explainer-video/scripts/build.cjs kits/video/capillary-bed/demo.plan.cjs
// QA:    node .agents/skills/explainer-video/scripts/qa.cjs kits/video/capillary-bed/demo.html
module.exports = {
  meta: { title: 'Capillary bed kit demo', subtitle: 'Kit demo · capillary-bed', subject: 'Kit demo', level: 'QA', theme: 'classic' },
  checks: [['arterial NFP', 35 - 25, 10], ['venous NFP', 15 - 25, -10], ['kwashiorkor venous NFP', 15 - 15, 0]],
  chapters: [
    { title: 'Structure', cues: [
      { say: 'A capillary between tissue cells, with labels.', ops: [{ clear: 'Capillary bed' }, { panel: 'capillary-bed', s: { labels: 1, cells: 0, proteins: 0, filtration: 0, reabsorption: 0, gauges: 0, lymph: 0, blocked: 0, oedema: 0, wall: 0, focus: null }, fresh: 1 }, { write: 'a', tex: '\\text{capillary}' }] },
      { say: 'Red cells and proteins flow inside.', ops: [{ panel: 'capillary-bed', s: { cells: 1, proteins: 1 } }] },
      { say: 'The wall is one cell thick.', ops: [{ panel: 'capillary-bed', s: { wall: 1, focus: 'wall' } }, { camera: 'wide', focus: 'wall' }] },
    ] },
    { title: 'Pressures', cues: [
      { say: 'Fluid leaves at the arterial end.', ops: [{ panel: 'capillary-bed', s: { wall: 0, focus: 'arterial', filtration: 1, gauges: 1 } }, { camera: 'wide', focus: 'arterial' }] },
      { say: 'And returns at the venous end.', ops: [{ panel: 'capillary-bed', s: { focus: 'venous', reabsorption: 1 } }, { camera: 'wide', focus: 'venous' }] },
      { say: 'The extra drains into the lymph.', ops: [{ panel: 'capillary-bed', s: { focus: 'lymph', lymph: 1 } }, { camera: 'kit', focus: 'lymph' }] },
    ] },
    { title: 'When it goes wrong', cues: [
      { say: 'Low plasma protein: nothing pulls fluid back.', ops: [{ panel: 'capillary-bed', s: { focus: null, pi: 15, oedema: 1 } }, { camera: 'wide' }] },
      { say: 'Blocked lymph vessels.', ops: [{ panel: 'capillary-bed', s: { pi: 25, blocked: 1 } }] },
      { say: 'Back to normal.', ops: [{ panel: 'capillary-bed', s: { blocked: 0, oedema: 0 } }, { camera: 'wide', focus: 'tube' }] },
    ] },
  ],
};
