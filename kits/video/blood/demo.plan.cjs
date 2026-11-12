// Demo for video kit "blood": every scene, state and close-up, so QA can prove the kit on phone and desktop.
// Build: node .agents/skills/explainer-video/scripts/build.cjs kits/video/blood/demo.plan.cjs
// QA:    node .agents/skills/explainer-video/scripts/qa.cjs kits/video/blood/demo.html
const ANT = { A: ['A'], B: ['B'], AB: ['A', 'B'], O: [] }, ABS = { A: ['b'], B: ['a'], AB: [], O: ['a', 'b'] };
const clumps = (d, r) => ANT[d].some(a => ABS[r].includes(a.toLowerCase()));
module.exports = {
  meta: { title: 'Blood kit demo', subtitle: 'Kit demo · blood', subject: 'Kit demo', level: 'QA', theme: 'classic' },
  checks: [
    ['plasma + cells', 55 + 45, 100],
    { name: 'A into B clumps', test: () => clumps('A', 'B') },
    { name: 'O into B is safe', test: () => !clumps('O', 'B') },
    { name: 'AB into O clumps', test: () => clumps('AB', 'O') },
    { name: 'B into AB is safe', test: () => !clumps('B', 'AB') },
    { name: 'O is the universal donor', test: () => ['A', 'B', 'AB', 'O'].every(r => !clumps('O', r)) },
    { name: 'AB is the universal recipient', test: () => ['A', 'B', 'AB', 'O'].every(d => !clumps(d, 'AB')) },
  ],
  chapters: [
    { title: 'Cells', cues: [
      { say: 'A centrifuged blood sample: plasma on top, cells below.', ops: [{ clear: 'Blood kit' }, { panel: 'blood', s: { scene: 'cells', labels: 1, plasma: 1, rbc: 0, wbc: 0, platelets: 0, focus: 'tube' }, fresh: 1 }, { write: 'a', tex: '\\text{cells}' }, { camera: 'wide', focus: 'tube', at: 2 }] },
      { say: 'A red cell, face and side view.', ops: [{ panel: 'blood', s: { rbc: 1, focus: 'rbc' } }, { camera: 'wide', focus: 'rbc' }] },
      { say: 'White cells and platelets.', ops: [{ panel: 'blood', s: { wbc: 1, platelets: 1, focus: null } }, { camera: 'wide' }] },
    ] },
    { title: 'Clotting', cues: [
      { say: 'An intact vessel.', ops: [{ panel: 'blood', s: { scene: 'clot', stage: 0, labels: 1 }, fresh: 1 }] },
      { say: 'A cut, and red cells leak out.', ops: [{ panel: 'blood', s: { stage: 1, focus: 'cut' } }, { camera: 'wide', focus: 'cut' }] },
      { say: 'Platelets and damaged tissue release thromboplastin.', ops: [{ panel: 'blood', s: { stage: 2 } }] },
      { say: 'Prothrombin becomes thrombin.', ops: [{ panel: 'blood', s: { stage: 3, focus: 'cascade' } }, { camera: 'wide', focus: 'cascade' }] },
      { say: 'Fibrin threads form a clot.', ops: [{ panel: 'blood', s: { stage: 4, focus: null } }, { camera: 'wide' }] },
    ] },
    { title: 'Cross-matching', cues: [
      { say: 'Group A cells into group B plasma.', ops: [{ panel: 'blood', s: { scene: 'match', donor: 'A', recipient: 'B', mix: 0, labels: 1 }, fresh: 1 }] },
      { say: 'They clump.', ops: [{ panel: 'blood', s: { mix: 1, focus: 'recipient' } }, { camera: 'wide', focus: 'recipient' }] },
      { say: 'Group O cells into group B plasma.', ops: [{ panel: 'blood', s: { donor: 'O', mix: 0, focus: null } }, { camera: 'wide' }] },
      { say: 'No clumping.', ops: [{ panel: 'blood', s: { mix: 1 } }] },
      { say: 'Group A B cells into group O plasma.', ops: [{ panel: 'blood', s: { donor: 'AB', recipient: 'O', mix: 0 } }] },
      { say: 'They clump.', ops: [{ panel: 'blood', s: { mix: 1 } }] },
      { say: 'Group B cells into group A B plasma.', ops: [{ panel: 'blood', s: { donor: 'B', recipient: 'AB', mix: 0 } }] },
      { say: 'No clumping.', ops: [{ panel: 'blood', s: { mix: 1 } }] },
    ] },
  ],
};
