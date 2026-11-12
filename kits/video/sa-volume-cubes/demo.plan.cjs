// Demo for video kit "sa-volume-cubes": every state and close-up, so QA can prove the kit on phone and desktop.
// Build: node .agents/skills/explainer-video/scripts/build.cjs kits/video/sa-volume-cubes/demo.plan.cjs
// QA:    node .agents/skills/explainer-video/scripts/qa.cjs kits/video/sa-volume-cubes/demo.html
const K = 'sa-volume-cubes';
const REST = { L: 2, L2: 0, scale: 'fit', unit: 'mm', faces: 0, fill: 0, readout: 0, readoutA: null, readoutB: null, cut: 0, dye: 0, depth: 0.5, arrows: 0, tagA: '', tagB: '', focus: null };
module.exports = {
  meta: {
    title: 'SA:V cubes kit demo', subtitle: 'Kit demo · sa-volume-cubes', subject: 'Kit demo', level: 'QA', theme: 'classic',
    roles: { L: { color: 'gold' }, SA: { color: 'orange' }, V: { color: 'blue' }, SAV: { color: 'green' } },
  },
  checks: [
    ['SA of a 2 mm cube', 6 * 2 * 2, 24], ['V of a 2 mm cube', 2 ** 3, 8], ['SA:V of a 2 mm cube', 6 / 2, 3],
    ['SA:V of a 6 mm cube', 6 / 6, 1], ['SA of a 6 mm cube', 6 * 36, 216],
    ['1 mm cube pale side after soaking', Math.max(0, 1 - 2 * 0.5), 0], ['6 mm cube pale side', 6 - 2 * 0.5, 5],
    ['Amoeba model SA:V', 6 / 0.1, 60], ['frog model SA:V', 6 / 30, 0.2], ['ratio of ratios', (6 / 0.1) / (6 / 30), 300],
    ['SA:V of a 2 cm cube', 6 / 2, 3], ['SA:V of a 3 cm cube', 6 / 3, 2],
  ],
  chapters: [
    { title: 'Surface area and volume', cues: [
      { say: 'Here is a cube with sides of two millimetres.', ops: [{ clear: 'Cube, L = 2 mm' }, { panel: K, s: REST, fresh: 1 }, { write: 'a', tex: 'L = 2\\text{ mm}' }] },
      { say: 'A cube has six faces. Count them as they light up: front, top, side, and the three hidden faces behind.', ops: [{ panel: K, s: { faces: 1 } }, { write: 'b', tex: '\\text{SA} = 6L^2 = 24\\text{ mm}^2' }] },
      { say: 'Now fill it with small one millimetre cubes, layer by layer: two by two by two makes eight.', ops: [{ panel: K, s: { faces: 0, fill: 1 } }, { write: 'c', tex: 'V = L^3 = 8\\text{ mm}^3' }] },
      { say: 'The table works out surface area, volume and their ratio from the side length.', ops: [{ panel: K, s: { fill: 0, readout: 1, focus: 'readout' } }, { camera: 'wide', focus: 'readout' }, { write: 'd', tex: '\\text{SA:V} = 6/L = 3.0\\text{ mm}^{-1}' }] },
      { say: 'Let the cube grow to six millimetres. The ratio falls to one point nought.', ops: [{ panel: K, s: { L: 6, focus: 'cubeA' } }, { camera: 'wide', focus: 'cubeA' }] },
      { say: 'Fill the big cube too: too many little cubes to count, so it fills with blue.', ops: [{ panel: K, s: { fill: 1, focus: null } }, { camera: 'wide' }] },
    ] },
    { title: 'The dye test', cues: [
      { say: 'Two agar cubes drawn to the same scale: one millimetre and six millimetres.', ops: [{ clear: 'Dye test' }, { panel: K, s: Object.assign({}, REST, { L: 1, L2: 6, scale: 'true', readout: 1 }), fresh: 1 }, { write: 'a', tex: '1\\text{ mm vs } 6\\text{ mm}' }] },
      { say: 'Cut each cube in half so we can see inside before the dye goes in.', ops: [{ panel: K, s: { cut: 1, focus: 'cubeB' } }, { camera: 'wide', focus: 'cubeB' }] },
      { say: 'Soak them in zobo dye. The dye moves in the same distance from every face of both cubes, half a millimetre.', ops: [{ panel: K, s: { dye: 1, focus: null } }, { camera: 'wide' }, { write: 'b', tex: '\\text{depth} = 0.5\\text{ mm}' }] },
      { say: 'The small cube is dyed right through. The big one keeps a pale centre five millimetres wide.', ops: [{ panel: K, s: { focus: 'centre', arrows: 1 } }, { camera: 'kit', focus: 'centre' }] },
      { say: 'Close up on the small cube.', ops: [{ panel: K, s: { focus: 'cubeA' } }, { camera: 'wide', focus: 'cubeA' }] },
    ] },
    { title: 'Amoeba and frog', cues: [
      { say: 'An Amoeba modelled as a cube one tenth of a millimetre wide, beside a frog modelled as a thirty millimetre cube.', ops: [{ clear: 'Amoeba vs frog' }, { panel: K, s: Object.assign({}, REST, { L: 0.1, L2: 30, scale: 'true', tagA: 'Amoeba model', tagB: 'frog model', readout: 1 }), fresh: 1 }, { camera: 'wide' }, { write: 'a', tex: '60 \\div 0.2 = 300' }] },
      { say: 'Cut open and soaked, the diffusion arrows are all the same length, far too short to reach the middle of the frog.', ops: [{ panel: K, s: { cut: 1, dye: 1, arrows: 1, focus: 'cubeB' } }, { camera: 'wide', focus: 'cubeB' }] },
      { say: 'The Amoeba is so small it is just a dot at this scale.', ops: [{ panel: K, s: { focus: 'cubeA' } }, { camera: 'kit', focus: 'cubeA' }] },
      { say: 'The plan may also write its own table text.', ops: [{ panel: K, s: { readoutA: ['0.06 mm²', '0.001 mm³', '60 mm⁻¹'], focus: 'readout' } }, { camera: 'wide', focus: 'readout' }] },
    ] },
    { title: 'Centimetres', cues: [
      { say: 'The same rule works in centimetres: two centimetre and three centimetre cubes.', ops: [{ clear: 'In centimetres' }, { panel: K, s: Object.assign({}, REST, { unit: 'cm', L: 2, L2: 3, readout: 1 }), fresh: 1 }, { camera: 'wide' }, { write: 'a', tex: '3.0 \\text{ and } 2.0\\text{ cm}^{-1}' }] },
      { say: 'Fill both: two by two by two, and three by three by three.', ops: [{ panel: K, s: { fill: 1, focus: 'cubeB' } }, { camera: 'wide', focus: 'cubeB' }] },
      { say: 'Light up the faces of both cubes, and count all six on each.', ops: [{ panel: K, s: { fill: 0, faces: 1, focus: null } }, { camera: 'wide' }] },
    ] },
  ],
};
