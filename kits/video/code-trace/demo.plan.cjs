// Demo for video kit "code-trace": exercises all 3 scenes ('memory', 'loop', 'array'), every state, and every close-up.
// Build: node .agents/skills/explainer-video/scripts/build.cjs kits/video/code-trace/demo.plan.cjs
// QA:    node .agents/skills/explainer-video/scripts/qa.cjs kits/video/code-trace/demo.html
const k = (r, s) => `\\htmlClass{role-${r}}{${s}}`;
const K = 'code-trace';

module.exports = {
  meta: {
    title: 'Code-trace kit demo',
    subtitle: 'Kit demo · code-trace',
    subject: 'Computer Studies',
    level: 'QA',
    theme: 'classic',
    roles: {
      code: { color: 'sky', name: 'code / index' },
      val: { color: 'green', name: 'valid value' },
      acc: { color: 'gold', name: 'accumulator / address' },
      err: { color: 'red', name: 'error / trap' },
    },
  },
  checks: [
    ['int("150") + 20', 150 + 20, 170],
    ['200 + 50', 200 + 50, 250],
    ['BODMAS: 12 + 8*2 - 6/2', 12 + 8 * 2 - 6 / 2, 25],
    ['7-day solar total', 45 + 52 + 60 + 58 + 49 + 63 + 55, 382],
    ['7-day solar mean (2 d.p.)', Math.round((382 / 7) * 100) / 100, 54.57],
    ['Index 3 offset (4B)', 0x1000 + 3 * 4, 0x100c],
    ['Index 7 offset (4B)', 0x1000 + 7 * 4, 0x101c],
    ['Index 8 OOB offset (4B)', 0x1000 + 8 * 4, 0x1020],
    ['Minimum cell voltage', Math.min(3.25, 3.18, 3.30, 2.95, 3.22, 3.15, 3.28, 3.20), 2.95],
  ],
  chapters: [
    {
      title: 'Memory: translators, types and precedence',
      cues: [
        {
          say: 'A compiler translates batch code; an interpreter runs line by line.',
          ops: [
            { clear: 'Translators & RAM' },
            { panel: K, s: { scene: 'memory', stage: 1, translator: 'compiler', cast: 0, prec: 0, labels: 1, focus: 'pipeline' }, fresh: 1 },
            { camera: 'wide', focus: 'pipeline' },
            { write: 'm1', tex: `${k('code', '\\text{Compiler}')} \\text{ vs } ${k('acc', '\\text{Interpreter}')}` },
          ],
        },
        {
          say: 'Switch to the interpreter and inspect the three RAM lockers.',
          ops: [
            { panel: K, s: { scene: 'memory', stage: 2, translator: 'interpreter', cast: 0, prec: 0, labels: 1, focus: 'ram' } },
            { camera: 'wide', focus: 'ram' },
            { write: 'm2', tex: `\\text{0x01: } ${k('err', '\\text{"150"}')},\\ \\text{0x02: } ${k('code', '20')}` },
          ],
        },
        {
          say: 'Adding text and integer triggers a TypeError in the ALU.',
          ops: [
            { panel: K, s: { scene: 'memory', stage: 3, translator: 'interpreter', cast: 0, prec: 0, labels: 1, focus: 'alu' } },
            { camera: 'wide', focus: 'alu' },
          ],
        },
        {
          say: 'Casting with int gives one hundred and seventy.',
          ops: [
            { panel: K, s: { scene: 'memory', stage: 4, translator: 'compiler', cast: 1, prec: 0, labels: 1, focus: 'alu' } },
            { write: 'm3', tex: `\\text{int("150")} + 20 = ${k('val', '170')}` },
          ],
        },
        {
          say: 'Operator precedence evaluates multiplication and division first to give twenty-five.',
          ops: [
            { panel: K, s: { scene: 'memory', stage: 4, translator: 'none', cast: 1, prec: 1, labels: 0, focus: null } },
            { camera: 'wide' },
            { write: 'm4', tex: `12 + 16 - 3 = ${k('acc', '25')}`, box: 'm4' },
          ],
        },
      ],
    },
    {
      title: 'Loops: flowchart, accumulator and bug trap',
      cues: [
        {
          say: 'The loop checks i less than seven and jumps back along the back-edge.',
          ops: [
            { clear: 'Loop accumulator' },
            { panel: K, s: { scene: 'loop', stage: 2, step: 0, bug: 0, labels: 1, focus: 'flowchart' }, fresh: 1 },
            { camera: 'wide', focus: 'flowchart' },
            { write: 'l1', tex: `${k('code', 'i = 0')} \\to \\text{total} = ${k('val', '45')}` },
          ],
        },
        {
          say: 'As i steps through the week, the accumulator adds each daily solar reading.',
          ops: [
            { panel: K, s: { scene: 'loop', stage: 3, step: 3, bug: 0, labels: 1, focus: 'trace' } },
            { camera: 'wide', focus: 'trace' },
            { write: 'l2', tex: `${k('code', 'i = 3')}:\\ \\text{total} = ${k('val', '215\\text{ kWh}')}` },
          ],
        },
        {
          say: 'At i equals seven the loop exits with three hundred and eighty-two kilowatt-hours.',
          ops: [
            { panel: K, s: { scene: 'loop', stage: 4, step: 7, bug: 0, labels: 1, focus: 'trace' } },
            { write: 'l3', tex: `\\bar{x} = \\frac{382}{7} = ${k('acc', '54.57\\text{ kWh}')}`, box: 'l3' },
          ],
        },
        {
          say: 'Leaving out the step update freezes count at one in an infinite loop.',
          ops: [
            { panel: K, s: { scene: 'loop', stage: 4, step: 0, bug: 1, labels: 1, focus: 'flowchart' } },
            { camera: 'wide', focus: 'flowchart' },
            { write: 'l4', tex: `${k('err', '\\text{count = 1 (stuck!)}')}` },
          ],
        },
      ],
    },
    {
      title: 'Arrays: zero-based rack, offset and bounds',
      cues: [
        {
          say: 'Eight battery cells sit in contiguous four-byte lockers from index zero to seven.',
          ops: [
            { clear: 'Array memory rack' },
            { panel: K, s: { scene: 'array', stage: 2, idx: 0, oob: 0, minTrack: 0, labels: 1, focus: 'rack' }, fresh: 1 },
            { camera: 'wide', focus: 'rack' },
            { write: 'a1', tex: `\\text{Addr} = \\text{0x1000} + 4i` },
          ],
        },
        {
          say: 'At index three we find the minimum voltage of two point nine five volts.',
          ops: [
            { panel: K, s: { scene: 'array', stage: 3, idx: 3, oob: 0, minTrack: 1, labels: 1, focus: 'offset' } },
            { camera: 'wide', focus: 'offset' },
            { write: 'a2', tex: `\\text{idx } 3 \\to ${k('acc', '\\text{0x100C}')},\\ ${k('val', '2.95\\text{ V}')}` },
          ],
        },
        {
          say: 'Reading index eight steps past index seven and triggers an IndexError.',
          ops: [
            { panel: K, s: { scene: 'array', stage: 4, idx: 8, oob: 1, minTrack: 1, labels: 1, focus: 'oob' } },
            { camera: 'wide', focus: 'oob' },
            { write: 'a3', tex: `${k('err', '\\text{idx 8} \\ge N \\to \\text{IndexError}')}`, box: 'a3' },
          ],
        },
      ],
    },
  ],
};
