// Demo for video kit "cell-forms": every scene, state and close-up, so QA can prove the kit on phone and desktop.
// Build: node .agents/skills/explainer-video/scripts/build.cjs kits/video/cell-forms/demo.plan.cjs
// QA:    node .agents/skills/explainer-video/scripts/qa.cjs kits/video/cell-forms/demo.html
const LADDER = ['organelle', 'cell', 'tissue', 'organ', 'system', 'organism'];
const NUT = { amoeba: 'holozoic', paramecium: 'holozoic', hydra: 'holozoic', chlamydomonas: 'autotrophic', volvox: 'autotrophic', spirogyra: 'autotrophic' };
const P = 'cell-forms';
module.exports = {
  meta: { title: 'Cell forms kit demo', subtitle: 'Kit demo · cell-forms', subject: 'Kit demo', level: 'QA', theme: 'classic' },
  checks: [
    ['six levels', LADDER.length, 6],
    { name: 'a system is made of organs (organ below system)', test: () => LADDER.indexOf('organ') < LADDER.indexOf('system') },
    { name: 'tissue sits between cell and organ', test: () => LADDER.indexOf('cell') < LADDER.indexOf('tissue') && LADDER.indexOf('tissue') < LADDER.indexOf('organ') },
    { name: 'Amoeba and Paramecium are holozoic', test: () => NUT.amoeba === 'holozoic' && NUT.paramecium === 'holozoic' },
    ['Chlamydomonas flagella', 2, 2],
    ['Euglena flagella', 1, 1],
  ],
  chapters: [
    { title: 'Pond drop', cues: [
      { say: 'A drop of drain water under the microscope. First, an amoeba.', ops: [{ clear: 'Cell forms kit' }, { panel: P, s: { scene: 'gallery', show: ['amoeba'], labels: 1, move: 1, engulf: 0, nutrition: 0, light: 1, focus: null }, fresh: 1 }, { write: 'a', tex: '\\text{free-living cells}' }] },
      { say: 'Watch the pseudopodia flow round a food particle and trap it in a food vacuole.', ops: [{ panel: P, s: { engulf: 1 } }] },
      { say: 'Next to it, a paramecium with its cilia beating.', ops: [{ panel: P, s: { show: ['amoeba', 'paramecium'], engulf: 0 } }] },
      { say: 'Then euglena and chlamydomonas join them.', ops: [{ panel: P, s: { show: ['amoeba', 'paramecium', 'euglena', 'chlamydomonas'] } }] },
      { say: 'Close up on the amoeba, feeding.', ops: [{ panel: P, s: { engulf: 1, focus: 'amoeba' } }, { camera: 'wide', focus: 'amoeba' }] },
      { say: 'The paramecium: cilia, oral groove and a big macronucleus.', ops: [{ panel: P, s: { engulf: 0, focus: 'paramecium' } }, { camera: 'kit', focus: 'paramecium' }] },
      { say: 'Euglena has one flagellum, an eyespot and chloroplasts.', ops: [{ panel: P, s: { focus: 'euglena' } }, { camera: 'wide', focus: 'euglena' }] },
      { say: 'Chlamydomonas has two flagella and one cup-shaped chloroplast.', ops: [{ panel: P, s: { focus: 'chlamydomonas' } }, { camera: 'wide', focus: 'chlamydomonas' }] },
    ] },
    { title: 'Nutrition', cues: [
      { say: 'How does each one feed? Here are the badges.', ops: [{ panel: P, s: { nutrition: 1, labels: 0, focus: null } }, { camera: 'wide' }] },
      { say: 'Switch the light off. Euglena absorbs dissolved food and becomes saprophytic.', ops: [{ panel: P, s: { light: 0, focus: 'euglena' } }, { camera: 'wide', focus: 'euglena' }] },
      { say: 'Chlamydomonas can make no food in the dark.', ops: [{ panel: P, s: { focus: 'chlamydomonas' } }, { camera: 'wide', focus: 'chlamydomonas' }] },
      { say: 'Light back on, and the whole drop again.', ops: [{ panel: P, s: { light: 1, labels: 1, move: 0, focus: 'field' } }, { camera: 'wide', focus: 'field' }] },
      { say: 'Volvox, spirogyra and hydra can sit in the drop too.', ops: [{ panel: P, s: { show: ['volvox', 'spirogyra', 'hydra', 'euglena'], move: 1, focus: 'volvox' } }, { camera: 'wide' }] },
    ] },
    { title: 'Colony, filament, tissue', cues: [
      { say: 'Volvox is a colony, spirogyra a filament, hydra works at tissue level.', ops: [{ panel: P, s: { scene: 'compare', labels: 1, move: 1, jobs: 0, separate: 0, focus: null }, fresh: 1 }] },
      { say: 'Colour the cells by their jobs. Only hydra shares out the work.', ops: [{ panel: P, s: { jobs: 1, focus: 'hydra' } }, { camera: 'wide', focus: 'hydra' }] },
      { say: 'Hydra has two cell layers, ectoderm outside and endoderm inside.', ops: [{ panel: P, s: { focus: 'layers' } }, { camera: 'kit', focus: 'layers' }] },
      { say: 'Now lift one cell out of each. The volvox cell and the spirogyra cell can live alone, but the hydra stinging cell cannot.', ops: [{ panel: P, s: { separate: 1, focus: null } }, { camera: 'wide' }] },
      { say: 'The volvox cell swims away by itself.', ops: [{ panel: P, s: { focus: 'volvox' } }, { camera: 'wide', focus: 'volvox' }] },
      { say: 'The spirogyra cell stays green and alive.', ops: [{ panel: P, s: { focus: 'spirogyra' } }, { camera: 'wide', focus: 'spirogyra' }] },
      { say: 'Put them back.', ops: [{ panel: P, s: { separate: 0, jobs: 0, focus: null } }, { camera: 'wide' }] },
    ] },
    { title: 'Levels of organisation', cues: [
      { say: 'Now the ladder of organisation, starting from nothing.', ops: [{ panel: P, s: { scene: 'levels', level: 0, labels: 1, swap: 0, example: 'animal', focus: null }, fresh: 1 }] },
      { say: 'Organelle, then cell.', ops: [{ panel: P, s: { level: 2, focus: 'low' } }, { camera: 'wide', focus: 'low' }] },
      { say: 'Tissue, then organ.', ops: [{ panel: P, s: { level: 4, focus: null } }, { camera: 'wide' }] },
      { say: 'System, then the whole organism, Chinedu.', ops: [{ panel: P, s: { level: 6, focus: 'high' } }, { camera: 'wide', focus: 'high' }] },
      { say: 'A common mistake swaps organ and system.', ops: [{ panel: P, s: { swap: 1, focus: null } }, { camera: 'wide' }] },
      { say: 'But a system is made of organs, so they slide back.', ops: [{ panel: P, s: { swap: 0 } }] },
      { say: 'The same ladder for a plant: chloroplast up to an ugu plant.', ops: [{ panel: P, s: { example: 'plant', focus: 'ladder' } }, { camera: 'wide', focus: 'ladder' }] },
    ] },
  ],
};
