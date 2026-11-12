// Demo for video kit "cell-anatomy": every state, cell kind and close-up, so QA can prove the kit on phone and desktop.
// Build: node .agents/skills/explainer-video/scripts/build.cjs kits/video/cell-anatomy/demo.plan.cjs
// QA:    node .agents/skills/explainer-video/scripts/qa.cjs kits/video/cell-anatomy/demo.html
const K = 'cell-anatomy';
const OFF = { nucleus: 0, dna: 0, organelles: 0, ribosomes: 0, wall: 0 };
module.exports = {
  meta: { title: 'Cell anatomy kit demo', subtitle: 'Kit demo · cell-anatomy', subject: 'Kit demo', level: 'QA', theme: 'classic' },
  checks: [
    ['1 mm = 1000 µm', 0.05 * 1000, 50],
    { name: 'a 2 µm bacterium is 25 times shorter than a 50 µm plant cell', test: () => 50 / 2 === 25 },
    { name: 'prokaryotic (70S) ribosomes are smaller than eukaryotic (80S)', test: () => 70 < 80 },
  ],
  chapters: [
    { title: 'Prokaryote vs eukaryote', cues: [
      { say: 'A bacterium, enlarged, beside a plant cell.', ops: [{ clear: 'Cell kit' }, { panel: K, s: { scene: 'compare', left: 'bacterium', right: 'plant', scale: 'zoom', titles: 1, labels: 1, ...OFF, focus: null }, fresh: 1 }, { write: 'a', tex: '\\text{two cells}' }] },
      { say: 'The plant cell has a true nucleus, wrapped in a nuclear membrane.', ops: [{ panel: K, s: { nucleus: 1, focus: 'eukaryote' } }] },
      { say: 'The bacterium has no nucleus. Its single circular loop of D N A lies free in the cytoplasm.', ops: [{ panel: K, s: { dna: 1, focus: 'prokaryote' } }] },
      { say: 'Membrane-bound organelles: none in the bacterium, many in the plant cell.', ops: [{ panel: K, s: { nucleus: 0, dna: 0, organelles: 1, focus: null } }] },
      { say: 'Both have ribosomes, but the bacterium\'s are smaller.', ops: [{ panel: K, s: { organelles: 0, ribosomes: 1 } }] },
      { say: 'And both have a cell wall, made of different materials.', ops: [{ panel: K, s: { ribosomes: 0, wall: 1 } }] },
    ] },
    { title: 'Close-ups', cues: [
      { say: 'The nucleus, close up.', ops: [{ panel: K, s: { wall: 0, nucleus: 1, dna: 1, focus: 'nucleus' } }, { camera: 'wide', focus: 'nucleus' }] },
      { say: 'The bacterium\'s circular D N A.', ops: [{ panel: K, s: { focus: 'dna' } }, { camera: 'wide', focus: 'dna' }] },
      { say: 'Organelles in the plant cell.', ops: [{ panel: K, s: { nucleus: 0, dna: 0, organelles: 1, focus: 'organelles' } }, { camera: 'wide', focus: 'organelles' }] },
      { say: 'Ribosomes in each cell.', ops: [{ panel: K, s: { organelles: 0, ribosomes: 1, focus: 'ribosomes' } }, { camera: 'wide', focus: 'ribosomes' }] },
      { say: 'The whole prokaryote.', ops: [{ panel: K, s: { ribosomes: 0, focus: 'left' } }, { camera: 'kit', focus: 'prokaryote' }] },
      { say: 'The whole eukaryote.', ops: [{ panel: K, s: { focus: 'right' } }, { camera: 'kit', focus: 'eukaryote' }] },
      { say: 'Left slot.', ops: [{ panel: K, s: { focus: null } }, { camera: 'wide', focus: 'left' }] },
      { say: 'Right slot.', ops: [{ camera: 'wide', focus: 'right' }] },
      { say: 'Back out.', ops: [{ camera: 'wide' }] },
    ] },
    { title: 'True scale', cues: [
      { say: 'At true scale the bacterium is tiny: about two micrometres beside fifty.', ops: [{ panel: K, s: { scale: 'true', labels: 0, focus: 'prokaryote' } }] },
      { say: 'Back to the enlarged view.', ops: [{ panel: K, s: { scale: 'zoom', labels: 1, focus: null } }] },
    ] },
    { title: 'Plant vs animal', cues: [
      { say: 'A plant cell beside an animal cell.', ops: [{ panel: K, s: { left: 'plant', right: 'animal', ...OFF, labels: 1 } }] },
      { say: 'Only the plant cell has a wall.', ops: [{ panel: K, s: { wall: 1 } }] },
      { say: 'Both have a nucleus with linear chromosomes.', ops: [{ panel: K, s: { wall: 0, nucleus: 1, dna: 1, focus: 'nucleus' } }] },
      { say: 'Both have many membrane-bound organelles.', ops: [{ panel: K, s: { nucleus: 0, dna: 0, organelles: 1, focus: 'organelles' } }] },
      { say: 'Both have ribosomes.', ops: [{ panel: K, s: { organelles: 0, ribosomes: 1, focus: 'ribosomes' } }] },
      { say: 'A bacterium beside an animal cell.', ops: [{ panel: K, s: { left: 'bacterium', ribosomes: 0, wall: 1, focus: null } }] },
      { say: 'Labels off, titles off.', ops: [{ panel: K, s: { wall: 0, labels: 0, titles: 0 } }] },
    ] },
  ],
};
