// Lesson 01 explainer plan: Seeing the cell (from the approved direction script, 2026-11-07).
// Build + embed: node scripts/apply-video.mjs topics/ss1-bio-plant-animal-cell-structure --lesson lesson-01
const k = (r, s) => `\\htmlClass{role-${r}}{${s}}`;
const EY = s => k('eyepiece', s), OB = s => k('objective', s), M = s => k('M', s), F = s => k('field', s), S = s => k('size', s), IM = s => k('image', s);
const MS = 'microscope', CA = 'cell-anatomy';
const um = '\\ \\mu\\text{m}';

module.exports = {
  meta: {
    title: 'Seeing the Cell', subtitle: 'Lesson 01 · Microscopes, cell size and the cell theory', eq: 'M = eyepiece × objective',
    subject: 'Biology', level: 'SS1 · WAEC / NECO / JAMB', next: '#apply', nextLabel: 'Continue to Apply →',
    roles: {
      eyepiece: { color: 'amber', name: 'eyepiece power' }, objective: { color: 'sky', name: 'objective power' },
      M: { color: 'green', name: 'total magnification' }, field: { color: 'purple', name: 'field of view' },
      size: { color: 'orange', name: 'cell size' }, image: { color: 'pink', name: 'image size' },
    },
    captionFixes: {},
  },
  checks: [
    ['Dujardin after Hooke 1835 − 1665', 1835 - 1665, 170],
    ['Schwann a year after Schleiden', 1839 - 1838, 1],
    ['M at x40 objective 10 × 40', 10 * 40, 400],
    ['wrong added 10 + 40', 10 + 40, 50],
    ['M at x4 objective 10 × 4', 10 * 4, 40],
    ['M at x10 objective 10 × 10', 10 * 10, 100],
    ['width x40: 4.0 ÷ 80', 4.0 / 80, 0.05, 1e-9],
    ['width x100: 1.6 ÷ 32', 1.6 / 32, 0.05, 1e-9],
    ['width x400: 0.40 ÷ 8', 0.40 / 8, 0.05, 1e-9],
    { name: 'field × M constant at 160 mm', test: () => [4.0 * 40, 1.6 * 100, 0.40 * 400].every(v => Math.abs(v - 160) < 1e-9) },
    ['Example 1 µm: 0.050 × 1000', 0.050 * 1000, 50, 1e-9],
    ['Example 1 check: 8 × 0.050', 8 * 0.050, 0.40, 1e-9],
    ['Example 2 actual 24 ÷ 400', 24 / 400, 0.06, 1e-9],
    ['Example 2 µm: 0.060 × 1000', 0.060 * 1000, 60, 1e-9],
    { name: 'real cell smaller than photo', test: () => 0.060 < 24 },
    ['your turn M: 5 × 40', 5 * 40, 200],
    ['your turn width 0.80 ÷ 20', 0.80 / 20, 0.04, 1e-9],
    ['your turn µm 0.040 × 1000', 0.040 * 1000, 40, 1e-9],
    { name: 'kit counters 80, 32, 8, 20', test: () => [[4.0, 0.05], [1.6, 0.05], [0.40, 0.05], [0.80, 0.04]].map(([f, c]) => Math.round(f / c)).join() === '80,32,8,20' },
  ],
  chapters: [
    { title: 'A leaf and a drop of blood', cues: [
      { say: "At Mile 12 Market, Mama Ngozi's ugu leaves went limp after a wash in salty water. That evening, Dr Amaka refused to drip plain water into a patient's vein.", ops: [
        { clear: 'A leaf and a drop of blood' }, { panel: MS, s: { scene: 'scope', labels: 0, light: 0, readout: 0, objective: 4, eyepiece: 10, focus: null }, fresh: 1 },
        { write: 'h1', tex: '\\text{limp leaf, no plain water}' }] },
      { say: 'Dr Amaka says leaves and blood obey the same rule. But a green leaf and a red drop of blood look nothing alike. What could they share?', ops: [
        { write: 'h2', tex: '\\text{what do they share?}' }] },
      { say: 'To find out, we must see things far too small for the eye. We need a microscope.', ops: [{ panel: MS, s: { light: 1 } }] },
      { say: 'By the end of this video, you will find total magnification, work out a cell\'s real size in micrometres, and tell a prokaryote from a eukaryote.', ops: [
        { clear: 'By the end of this video' }, { write: 'o1', tex: `\\square\\ \\text{total magnification}` },
        { write: 'o2', tex: `\\square\\ \\text{real size in}${um}`, at: 4 }, { write: 'o3', tex: '\\square\\ \\text{prokaryote or eukaryote?}', at: 7 }] },
    ] },
    { title: "Hooke's empty boxes", cues: [
      { say: 'In sixteen sixty-five, Robert Hooke cut a thin slice of cork and looked at it through a microscope he had improved himself.', ops: [
        { clear: 'Who saw cells first?' }, { panel: MS, s: { scene: 'field', slide: 'cork', fov: 1.6, cell: 0.05, mag: 100, ruler: 0, count: 0, labels: 1, focus: null }, fresh: 1 },
        { write: 'w1', tex: '1665\\ \\text{Hooke: cork}' }] },
      { say: 'He saw rows of tiny box-like spaces, and he named them cells.', ops: [{ camera: 'wide', focus: 'cell' }] },
      { say: 'But here is the trap. Cork is dead bark. Hooke saw only the empty walls left behind, not living cells.', ops: [
        { camera: 'wide' }, { write: 'w2', tex: '\\text{dead walls, empty inside}', note: 'not living!' }] },
      { say: 'About a hundred and seventy years later, in eighteen thirty-five, Félix Dujardin described the living jelly that fills cells. He called it sarcode.', ops: [
        { clear: 'Living cells' }, { panel: MS, s: { slide: 'onion', fov: 0.4, mag: 400 } }, { write: 'w3', tex: '1835\\ \\text{Dujardin: living jelly}' }] },
      { say: 'Then, in eighteen thirty-eight, Schleiden concluded that every plant is made of cells. A year later, in eighteen thirty-nine, Schwann said the same for animals.', ops: [
        { write: 'w4', tex: '1838\\ \\text{Schleiden: plants}' }, { write: 'w5', tex: '1839\\ \\text{Schwann: animals}', at: 5 }] },
      { say: 'Remember the pairing. Schleiden, plants. Schwann, animals. Swapping them loses both marks.', ops: [{ write: 'w6', tex: '\\text{do not swap them!}' }] },
    ] },
    { title: 'The cell theory', cues: [
      { say: 'Their work grew into the cell theory. Learn its three statements the way the examiner words them.', ops: [
        { clear: 'The cell theory' }, { panel: MS, s: { slide: 'blood', cell: 0.008, fov: 0.4, mag: 400, labels: 0 } }] },
      { say: 'One. Every organism consists of one cell or of many cells.', ops: [{ write: 't1', tex: '1.\\ \\text{one cell or many cells}' }] },
      { say: 'Two. Organisms are built from cells, and cells carry out their life processes.', ops: [{ write: 't2', tex: '2.\\ \\text{built from cells}' }, { write: 't2b', tex: '\\quad \\text{cells do life processes}', at: 3 }] },
      { say: 'Three. New cells form only when existing cells divide. That idea came from Virchow, in eighteen fifty-five.', ops: [{ write: 't3', tex: '3.\\ \\text{new cells from cells}', note: 'Virchow 1855' }] },
      { say: 'So the blood on this slide is made of cells, just like the ugu leaf. That is what a leaf and a drop of blood share.', ops: [
        { panel: MS, s: { focus: 'cell' } }, { camera: 'wide', focus: 'cell' }] },
      { say: 'A cell is the basic unit of life. It is the smallest part of an organism that is both its building block and its working unit.', ops: [
        { clear: 'Cell and organelle' }, { camera: 'wide' }, { panel: MS, s: { focus: null } }, { write: 'd1', tex: '\\text{cell = unit of structure}' }, { write: 'd1b', tex: '\\qquad\\ \\ \\text{+ function}', at: 5 }, { box: 'd1b', at: 7 }] },
      { say: 'Inside the cytoplasm are tiny parts, each specialised to do one particular job for the cell. These are organelles.', ops: [{ write: 'd2', tex: '\\text{organelle = part, one job}' }] },
    ] },
    { title: 'Two lenses multiply', cues: [
      { say: 'Here is a compound microscope. Light from the mirror passes up through the slide, then through two lenses on its way to your eye.', ops: [
        { clear: 'How a microscope magnifies' }, { panel: MS, s: { scene: 'scope', labels: 1, light: 1, objective: 4, eyepiece: 10, readout: 0, focus: null }, fresh: 1 }, { camera: 'wide' }] },
      { say: 'The lens near the slide is the objective. Ours has three, times four, times ten and times forty.', ops: [
        { camera: 'wide', focus: 'objectives' }, { write: 'm1', tex: `\\text{objective: }${OB('\\times 4,\\ \\times 10,\\ \\times 40')}` }] },
      { say: 'The lens you look into is the eyepiece. Ours is times ten.', ops: [
        { camera: 'wide', focus: 'eyepiece' }, { write: 'm2', tex: `\\text{eyepiece: }${EY('\\times 10')}` }] },
      { say: 'The objective makes a magnified image. The eyepiece then magnifies that image again. So the two powers multiply.', ops: [
        { camera: 'wide' }, { write: 'm3', tex: `${M('M')} = ${EY('\\text{eyepiece}')} \\times ${OB('\\text{objective}')}` }, { box: 'm3', at: 6 }] },
      { say: 'Turn to the times forty objective. Total magnification is ten times forty, which is four hundred.', ops: [
        { clear: 'Total magnification' }, { panel: MS, s: { objective: 40, readout: 1 } }, { write: 'c1', tex: `${M('M')} = ${EY('10')} \\times ${OB('40')} = ${M('\\times 400')}` }, { box: 'c1', at: 5 }] },
      { say: 'Never add them. Ten plus forty is fifty, and that answer scores zero.', ops: [{ write: 'c2', tex: '10 + 40 = 50', note: 'wrong: never add' }] },
      { say: 'So our three objectives give total magnifications of times forty, times one hundred and times four hundred.', ops: [
        { clear: 'Three powers' }, { panel: MS, s: { objective: 4 }, at: 2.5 }, { panel: MS, s: { objective: 10 }, at: 4.3 }, { panel: MS, s: { objective: 40 }, at: 6.2 },
        { write: 'p1', tex: `${OB('\\times 4')} \\to ${M('\\times 40')}`, at: 2.5 }, { write: 'p2', tex: `${OB('\\times 10')} \\to ${M('\\times 100')}`, at: 4.3 }, { write: 'p3', tex: `${OB('\\times 40')} \\to ${M('\\times 400')}`, at: 6.2 }] },
    ] },
    { title: 'Same cell, smaller window', cues: [
      { say: "Now let's look down the eyepiece at Chinedu's onion peel. The bright circle you see is called the field of view.", ops: [
        { clear: 'Field of view' }, { panel: MS, s: { scene: 'field', slide: 'onion', fov: 4.0, cell: 0.05, mag: 40, ruler: 1, count: 0, labels: 1, readout: 0, focus: null }, fresh: 1 }, { camera: 'wide' }] },
      { say: 'At times forty, the field is four point zero millimetres across, and eighty cells lie side by side across it.', ops: [
        { panel: MS, s: { count: 1, labels: 0 } }, { camera: 'wide', focus: 'row' }, { write: 'f1', tex: `${OB('\\times 40')}:\\ ${F('4.0\\ \\text{mm}')},\\ 80\\ \\text{cells}` }] },
      { say: 'Switch to times one hundred. The field shrinks to one point six millimetres, and only thirty-two cells fit across.', ops: [
        { panel: MS, s: { fov: 1.6, mag: 100 } }, { write: 'f2', tex: `${OB('\\times 100')}:\\ ${F('1.6\\ \\text{mm}')},\\ 32\\ \\text{cells}` }] },
      { say: 'At times four hundred, the field is only zero point four zero millimetres, with eight cells across.', ops: [
        { panel: MS, s: { fov: 0.4, mag: 400 } }, { write: 'f3', tex: `${OB('\\times 400')}:\\ ${F('0.40\\ \\text{mm}')},\\ 8\\ \\text{cells}` }] },
      { say: 'Did the onion cells grow? No. The picture grew and the window got smaller. The real size of each cell never changes.', ops: [
        { camera: 'wide' }, { write: 'f4', tex: `\\text{real cell size: }${S('\\text{same}')}` }] },
      { say: 'So the width of one cell is the field diameter divided by the number of cells across it.', ops: [
        { clear: 'Cell width from the field' }, { write: 'g1', tex: `${S('\\text{width}')} = ${F('\\text{field}')} \\div \\text{number}` }, { box: 'g1', at: 5 }] },
      { say: 'Check it at every power. Four point zero over eighty, one point six over thirty-two, and zero point four zero over eight.', ops: [
        { write: 'g2', tex: '4.0 \\div 80 = 1.6 \\div 32' }, { write: 'g3', tex: '\\quad = 0.40 \\div 8', at: 6 }] },
      { say: 'All three give the same answer, zero point zero five zero millimetres. Magnifying changes the image, not the cell.', ops: [
        { write: 'g4', tex: `\\quad = ${S('0.050\\ \\text{mm}')}` }, { box: 'g4', at: 4 }] },
    ] },
    { title: 'Example 1: from mm to micrometres', cues: [
      { say: 'Here is the exam version. Eyepiece times ten, objective times forty. Eight onion cells lie across a field zero point four zero millimetres wide.', ops: [
        { clear: 'Example 1' }, { camera: 'board' }, { write: 'x1', tex: `${EY('\\times 10')},\\ ${OB('\\times 40')}` }, { write: 'x2', tex: `${F('0.40\\ \\text{mm}')},\\ 8\\ \\text{cells}`, at: 5 }] },
      { say: 'Find the total magnification, and the width of one cell in micrometres.', ops: [{ write: 'x3', tex: `\\text{find }M\\text{ and width in}${um}` }] },
      { say: 'Step one. Total magnification is ten times forty, which is times four hundred.', ops: [
        { clear: 'Example 1 · steps' }, { write: 's1', tex: `${M('M')} = ${EY('10')} \\times ${OB('40')} = ${M('\\times 400')}` }] },
      { say: 'Step two. Cell width is zero point four zero millimetres divided by eight, which is zero point zero five zero millimetres.', ops: [
        { write: 's2', tex: `${S('w')} = ${F('0.40')} \\div 8 = ${S('0.050\\ \\text{mm}')}` }] },
      { say: 'Step three. Examiners want micrometres. One millimetre is one thousand micrometres, so multiply by one thousand.', ops: [
        { write: 's3', tex: `1\\ \\text{mm} = 1000${um}`, note: '×1000, not ×100' }] },
      { say: 'Zero point zero five zero times one thousand gives fifty micrometres.', ops: [
        { write: 's4', tex: `0.050 \\times 1000 = ${S('50')}${um}` }, { box: 's4', at: 3 }] },
      { say: 'That matches the field. Eight cells, each fifty micrometres wide, fill zero point four zero millimetres.', ops: [
        { camera: 'wide', focus: 'row' }] },
    ] },
    { title: 'Example 2: from a photo to the real cell', cues: [
      { say: 'Dr Amaka shows a photo of a cheek cell, taken with a times ten eyepiece and a times forty objective. On the photo, the cell is twenty-four millimetres long.', ops: [
        { clear: 'Example 2' }, { panel: MS, s: { scene: 'photo', specimen: 'cheek', image: 24, mag: 400, shrink: 0, um: 0, labels: 1, focus: null }, fresh: 1 },
        { camera: 'wide', focus: 'bracket' }, { write: 'y1', tex: `${M('M')} = 10 \\times 40 = ${M('\\times 400')}` }, { write: 'y2', tex: `${IM('\\text{image}')} = ${IM('24\\ \\text{mm}')}`, at: 6 }] },
      { say: 'The photo is bigger than the real cell by the magnification. So to go back to the real cell, we divide.', ops: [
        { camera: 'wide' }, { write: 'y3', tex: `\\text{actual} = ${IM('\\text{image}')} \\div ${M('M')}` }, { box: 'y3', at: 5 }] },
      { say: 'Twenty-four millimetres divided by four hundred is zero point zero six zero millimetres.', ops: [
        { clear: 'Example 2 · steps' }, { panel: MS, s: { shrink: 1 } }, { camera: 'wide', focus: 'actual' }, { write: 'z1', tex: `${IM('24')} \\div ${M('400')} = ${S('0.060\\ \\text{mm}')}` }] },
      { say: 'Times one thousand gives sixty micrometres. That is the real length of the cheek cell.', ops: [
        { panel: MS, s: { um: 1 } }, { write: 'z2', tex: `0.060 \\times 1000 = ${S('60')}${um}` }, { box: 'z2', at: 3 }] },
      { say: 'Quick sense check. A real cell is always smaller than its photo. Sixty micrometres is far smaller than twenty-four millimetres. It works.', ops: [
        { camera: 'wide' }, { write: 'z3', tex: `60${um} < 24\\ \\text{mm}`, note: 'makes sense' }] },
    ] },
    { title: 'Two kinds of cell', cues: [
      { say: 'Every living thing is made of cells, but cells come in two great kinds. Here is a bacterium beside a plant cell.', ops: [
        { clear: 'Prokaryote or eukaryote?' }, { panel: CA, s: { scene: 'compare', left: 'bacterium', right: 'plant', scale: 'zoom', titles: 1, labels: 1, nucleus: 0, dna: 0, organelles: 0, ribosomes: 0, wall: 0, focus: null }, fresh: 1 }, { camera: 'wide' }] },
      { say: 'The plant cell keeps its DNA inside a nucleus, wrapped in a nuclear membrane. A cell with a true nucleus is a eukaryote.', ops: [
        { panel: CA, s: { nucleus: 1 } }, { camera: 'wide', focus: 'eukaryote' }, { write: 'e1', tex: '\\text{eukaryote: true nucleus}' }] },
      { say: "The bacterium has no nuclear membrane. Its single loop of circular DNA lies free in the cytoplasm. It is a prokaryote.", ops: [
        { panel: CA, s: { nucleus: 1, dna: 1 } }, { camera: 'wide', focus: 'prokaryote' }, { write: 'e2', tex: '\\text{prokaryote: no nucleus}' }] },
      { say: 'Eukaryotes also have membrane-bound organelles, such as mitochondria, endoplasmic reticulum and Golgi bodies. Prokaryotes have none.', ops: [
        { panel: CA, s: { nucleus: 0, dna: 0, organelles: 1 } }, { camera: 'wide' }, { write: 'e3', tex: '\\text{membrane organelles:}' }, { write: 'e3b', tex: '\\quad \\text{none vs many}', at: 4 }] },
      { say: "But both kinds have ribosomes, because every cell makes proteins. A prokaryote's ribosomes are smaller.", ops: [
        { clear: 'Prokaryote or eukaryote?' }, { panel: CA, s: { organelles: 0, ribosomes: 1 } }, { camera: 'wide', focus: 'ribosomes' }, { write: 'r1', tex: '\\text{ribosomes: both}' }, { write: 'r1b', tex: '\\quad \\text{(smaller in prokaryotes)}', at: 3 }] },
      { say: 'Bacteria and blue-green algae are prokaryotes. Plants, animals, fungi and protists are eukaryotes.', ops: [
        { clear: 'Examples' }, { panel: CA, s: { ribosomes: 0 } }, { camera: 'wide' }, { write: 'q1', tex: '\\text{prokaryotes:}' }, { write: 'q1b', tex: '\\quad \\text{bacteria, blue-green algae}', at: 1 },
        { write: 'q2', tex: '\\text{eukaryotes:}', at: 4 }, { write: 'q2b', tex: '\\quad \\text{plants, animals, fungi, protists}', at: 4.6 }] },
      { say: 'One warning. A cell wall does not tell them apart. Bacteria have walls, and so do plant cells.', ops: [
        { clear: 'Careful' }, { panel: CA, s: { wall: 1 } }, { write: 'k1', tex: '\\text{a cell wall is not a test}', note: 'both can have one' }] },
    ] },
    { title: 'Mistakes that cost marks', cues: [
      { say: 'Here are the mistakes examiners see every year.', ops: [{ clear: 'Mistakes that cost marks' }, { panel: null }, { camera: 'wide' }] },
      { say: 'One. Adding the lens powers. Ten plus forty is wrong. Multiply, ten times forty, times four hundred.', ops: [{ write: 'b1', tex: '10 + 40 \\to 10 \\times 40', note: 'multiply' }] },
      { say: 'Two. Multiplying by one hundred to get micrometres. One millimetre is one thousand micrometres.', ops: [{ write: 'b2', tex: '\\times 100 \\to \\times 1000', note: 'mm to µm' }] },
      { say: 'Three. Multiplying the image by the magnification. That makes the cell bigger than its own photo. Always divide.', ops: [{ write: 'b3', tex: '24 \\times 400 \\to 24 \\div 400', note: 'divide' }] },
      { say: 'Four. Saying Hooke saw living cells. He saw the empty walls of dead cork.', ops: [{ write: 'b4', tex: '\\text{living} \\to \\text{dead cork}', note: 'Hooke' }] },
    ] },
    { title: 'Summary', cues: [
      { say: "Let's pull it together. Total magnification is eyepiece times objective. Cell width is field diameter divided by the number of cells across.", ops: [
        { clear: 'Summary' }, { write: 'u1', tex: `${M('M')} = ${EY('\\text{eyepiece}')} \\times ${OB('\\text{objective}')}` }, { write: 'u2', tex: `${S('\\text{width}')} = ${F('\\text{field}')} \\div \\text{number}`, at: 4 }] },
      { say: 'Actual size is image size divided by magnification, and one millimetre is one thousand micrometres.', ops: [
        { write: 'u3', tex: `\\text{actual} = ${IM('\\text{image}')} \\div ${M('M')}` }, { write: 'u4', tex: `1\\ \\text{mm} = 1000${um}`, at: 3.5 }] },
      { say: 'Every living thing is made of cells. Prokaryotes have no nucleus, and eukaryotes do.', ops: [{ write: 'u5', tex: '\\text{prokaryote: no nucleus}' }] },
    ] },
    { title: 'Your turn', cues: [
      { say: 'Now it\'s your turn. A microscope has a times five eyepiece and a times forty objective. Twenty cells lie side by side across a field zero point eight zero millimetres wide.', ops: [
        { clear: 'Your turn' }, { panel: MS, s: { scene: 'field', slide: 'onion', fov: 0.8, cell: 0.04, mag: 200, ruler: 1, count: 1, labels: 0, focus: null }, fresh: 1 }, { camera: 'wide' },
        { write: 'p1', tex: `${EY('\\times 5')},\\ ${OB('\\times 40')}` }, { write: 'p2', tex: `${F('0.80\\ \\text{mm}')},\\ 20\\ \\text{cells}`, at: 5 }] },
      { say: 'Find the total magnification, and the width of one cell in micrometres. Pause the video and try it now.', hold: 15, ops: [
        { write: 'p3', tex: `\\text{find }M\\text{ and width in}${um}` }] },
      { say: "Here's the answer. Total magnification is five times forty, which is times two hundred.", ops: [
        { clear: 'Answer' }, { camera: 'board' }, { write: 'a1', tex: `${M('M')} = ${EY('5')} \\times ${OB('40')} = ${M('\\times 200')}` }] },
      { say: 'Cell width is zero point eight zero millimetres divided by twenty, which is zero point zero four zero millimetres.', ops: [
        { write: 'a2', tex: `${S('w')} = ${F('0.80')} \\div 20 = ${S('0.040\\ \\text{mm}')}` }] },
      { say: 'Times one thousand gives forty micrometres. If you got times two hundred and forty micrometres, well done.', ops: [
        { write: 'a3', tex: `0.040 \\times 1000 = ${S('40')}${um}` }, { box: 'a3', at: 3 }] },
      { say: "Now take these skills into Apply, where you'll solve the mystery of the two unlabelled slides from the story.", ops: [{ camera: 'wide' }] },
    ] },
  ],
};
