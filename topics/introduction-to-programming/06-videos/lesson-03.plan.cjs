// Lesson 03 explainer: The Power of Repetition — Counter & Conditional Loops
// Direction script: 06-videos/lesson-03-direction-script.md (approved).
// Kits: code-trace (plug-in, scene: 'loop'), graph (built-in).
const k = (r, s) => `\\htmlClass{role-${r}}{${s}}`;
const C = s => k('code', s);
const V = s => k('val', s);
const A = s => k('acc', s);
const E = s => k('err', s);
const F = s => k('flow', s);
const T = s => `\\text{${s}}`;

const SOLAR_GRAPH = {
  id: 'solar-cum',
  x: [0, 8, 1],
  y: [0, 420, 50],
  xlabel: 'Day',
  ylabel: 'Cumulative (kWh)',
  xcolor: 'code',
  ycolor: 'acc',
  items: [
    { id: 'pts', type: 'points', pts: [[1, 45], [2, 97], [3, 157], [4, 215], [5, 264], [6, 327], [7, 382]], hollow: true, color: 'acc' },
    { id: 'line', type: 'line', from: [0, 0], to: [7, 382], color: 'val' },
    { id: 'g7', type: 'guide', at: [7, 382], color: 'acc' },
    { id: 'p7', type: 'point', at: [7, 382], color: 'acc', label: '382 kWh', pos: 'nw' },
  ],
};

module.exports = {
  meta: {
    title: 'The Power of Repetition — Counter & Conditional Loops',
    subtitle: 'Lesson 03 · Breaking free from infinite loops, mastering range(), and building accumulators',
    eq: 'total = Σ xᵢ · range(start, stop, step)',
    subject: 'Computer Studies',
    level: 'SS2 · WAEC / NECO / JAMB',
    next: '#apply',
    nextLabel: 'Continue to Apply →',
    roles: {
      code: { color: 'sky', name: 'loop variable / index' },
      val: { color: 'green', name: 'sensor reading / data' },
      acc: { color: 'gold', name: 'accumulator / sum' },
      err: { color: 'red', name: 'error / runaway bug' },
      flow: { color: 'purple', name: 'condition / control flow' },
    },
    captionFixes: {
      'k W h': 'kWh',
      'W A E C': 'WAEC',
      'N E C O': 'NECO',
      'J A M B': 'JAMB',
      'C P U': 'CPU',
      'F O R': 'FOR',
      'W H I L E': 'WHILE',
    },
  },
  checks: [
    ['CPU freeze load', 99, 99],
    ['Ikogosi panel count', 12, 12],
    ['Ikogosi exit index', 12 + 1, 13],
    ['range(2, 10, 2) iterations', (10 - 2) / 2, 4],
    ['range(2, 10, 2) values sum', 2 + 4 + 6 + 8, 20],
    ['range(1, 5) count', 5 - 1, 4],
    ['range(1, 5) sum', 1 + 2 + 3 + 4, 10],
    ['range(5) count', 5, 5],
    ['7-day solar total', 45 + 52 + 60 + 58 + 49 + 63 + 55, 382],
    ['7-day solar mean (2 d.p.)', Math.round((382 / 7) * 100) / 100, 54.57],
    ['cumulative day 1', 45, 45],
    ['cumulative day 2', 45 + 52, 97],
    ['cumulative day 3', 45 + 52 + 60, 157],
    ['cumulative day 4', 45 + 52 + 60 + 58, 215],
    ['cumulative day 5', 45 + 52 + 60 + 58 + 49, 264],
    ['cumulative day 6', 45 + 52 + 60 + 58 + 49 + 63, 327],
    ['cumulative day 7', 45 + 52 + 60 + 58 + 49 + 63 + 55, 382],
    ['WAEC step 1', 0 + 1, 1],
    ['WAEC step 2', 1 + 2, 3],
    ['WAEC step 3', 3 + 3, 6],
    ['WAEC step 4', 6 + 4, 10],
    ['WAEC off-by-one trap', 10 + 5, 15],
    { name: 'mean formula accuracy', test: () => Math.abs(382 / 7 - 54.57142857) < 1e-6 },
    { name: 'range stop exclusivity', test: () => ![2, 4, 6, 8].includes(10) },
  ],
  chapters: [
    {
      title: 'Hook: The Ikogosi Runaway Loop',
      cues: [
        {
          say: 'At the Ikogosi Warm Springs clinic, cooling fans roar as the computer processor freezes at ninety-nine percent.',
          ops: [
            { clear: 'Ikogosi solar freeze' },
            { panel: 'code-trace', s: { scene: 'loop', stage: 1, step: 0, bug: 1, labels: 1, focus: 'flowchart' }, fresh: 1 },
            { camera: 'wide', focus: 'flowchart' },
            { write: 'h1', tex: `${T('Ikogosi clinic: ')}${E('99\\%\\text{ CPU}')}` },
          ],
        },
        {
          say: 'Tari inspects the monitor and finds identical log messages flooding the console: checking solar panel one, over and over.',
          ops: [
            { write: 'h2', tex: `${F('\\text{while }')}${C('panel\\_idx')} \\le 12:` },
            { write: 'h3', tex: `\\quad ${T('print(')}${C('panel\\_idx')}${T(')')}`, at: 3 },
          ],
        },
        {
          say: 'The variable panel index is never incremented inside the loop. It stays at one forever, trapped in an infinite cycle.',
          ops: [
            { write: 'h4', tex: `${C('panel\\_idx = 1')}\\ ${E('(\\text{stuck!})')}`, note: 'never updates' },
          ],
        },
        {
          say: 'Chief Babatunde asks how a computer knows when to repeat tasks and when to stop cleanly without crashing the clinic.',
          ops: [
            { clear: 'The mystery' },
            { panel: 'code-trace', s: { scene: 'loop', stage: 1, step: 0, bug: 1, labels: 1, focus: null } },
            { camera: 'wide' },
            { write: 'h5', tex: `${T('Chief: how to stop cleanly?')}` },
          ],
        },
        {
          say: 'By the end of this video, you will command counted loops, trace execution back-edges, build accumulators, and write foolproof while loops.',
          ops: [
            { clear: 'Objectives' },
            { panel: 'code-trace', s: { scene: 'loop', stage: 1, step: 0, bug: 0, labels: 1, focus: null } },
            { write: 'o1', tex: `\\square\\ ${T('counted ')}${C('\\text{FOR}')}${T(' loops and ')}${C('\\text{range()}')}` },
            { write: 'o2', tex: `\\square\\ ${T('flowcharts and back-edges')}`, at: 2.2 },
            { write: 'o3', tex: `\\square\\ ${T('the accumulator pattern')}`, at: 4.2 },
            { write: 'o4', tex: `\\square\\ ${T('safe ')}${F('\\text{WHILE}')}${T(' loops and traces')}`, at: 6.2 },
          ],
        },
      ],
    },
    {
      title: 'Counter-Controlled FOR Loops & range()',
      cues: [
        {
          say: 'Repetition in programming is called iteration. When you know in advance how many times an action must repeat, use a counter-controlled loop.',
          ops: [
            { clear: 'Counter-controlled loops' },
            { panel: null },
            { camera: 'wide' },
            { write: 'c1', tex: `${C('\\text{FOR}')}${T(' loop: known count')}` },
          ],
        },
        {
          say: 'In Python, the range function generates a sequence of integers from start up to stop minus one, increasing by step.',
          ops: [
            { write: 'c2', tex: `${C('\\text{range(start, stop, step)}')}` },
            { write: 'c3', tex: `${T('stop is strictly excluded!')}`, note: 'stop - 1', at: 3 },
          ],
        },
        {
          say: 'Let us examine range two comma ten comma two. We start at two, increment by two, and stop strictly before ten.',
          ops: [
            { clear: 'Worked example: range()' },
            { write: 'c4', tex: `${C('\\text{for } i \\text{ in range}(2, 10, 2):')}` },
            { write: 'c5', tex: `${C('i')} \\in \\{${V('2')}, ${V('4')}, ${V('6')}, ${V('8')}\\}`, at: 3 },
          ],
        },
        {
          say: 'The values generated are two, four, six, and eight. That gives exactly four iterations, never reaching ten.',
          ops: [
            { write: 'c6', tex: `N = \\frac{10 - 2}{2} = ${C('4\\text{ iterations}')}` },
            { box: 'c6' },
          ],
        },
        {
          say: 'If you omit step, Python increments by one. Range one comma five gives one, two, three, and four: four iterations.',
          ops: [
            { clear: 'Default parameters' },
            { write: 'c7', tex: `${C('\\text{range}(1, 5)')} \\to \\{${V('1, 2, 3, 4')}\\}` },
            { write: 'c8', tex: `N = 5 - 1 = ${C('4\\text{ iterations}')}`, at: 3 },
          ],
        },
        {
          say: 'If you also omit start, Python starts at zero. Range five gives zero, one, two, three, and four: five iterations.',
          ops: [
            { write: 'c9', tex: `${C('\\text{range}(5)')} \\to \\{${V('0, 1, 2, 3, 4')}\\}` },
            { write: 'c10', tex: `${T('starts at 0')} \\to ${C('5\\text{ iterations}')}`, at: 3 },
            { box: 'c10' },
          ],
        },
      ],
    },
    {
      title: 'The Back-Edge Execution Jump',
      cues: [
        {
          say: 'How does the processor actually carry out a loop in memory? Look at the execution flowchart on the left.',
          ops: [
            { clear: 'The loop engine' },
            { panel: 'code-trace', s: { scene: 'loop', stage: 2, step: 0, bug: 0, labels: 1, focus: 'flowchart' }, fresh: 1 },
            { camera: 'wide', focus: 'flowchart' },
            { write: 'f1', tex: `1.\\ ${T('Initialize: ')}${A('total=0')},\\ ${C('i=0')}` },
          ],
        },
        {
          say: 'First, the processor tests the condition diamond. Is i less than seven? Zero is less than seven, so condition is true.',
          ops: [
            { write: 'f2', tex: `2.\\ ${T('Test: ')}${F('i < 7')} \\to ${V('\\text{True}')}` },
          ],
        },
        {
          say: 'Next, execution enters the loop body and adds the reading, then advances the counter i by one.',
          ops: [
            { write: 'f3', tex: `3.\\ ${T('Body: ')}${A('\\text{total} \\mathrel{+}= \\text{read}[i]')}` },
            { write: 'f4', tex: `4.\\ ${T('Step: ')}${C('i = i + 1')}`, at: 3 },
          ],
        },
        {
          say: 'Now observe the curved feedback path on the left. This is the back-edge execution jump.',
          ops: [
            { clear: 'The back-edge jump' },
            { write: 'f5', tex: `5.\\ ${F('\\text{Back-edge: jump to test}')}` },
            { write: 'f6', tex: `${T('CPU branches back to condition')}`, note: 'back-edge', at: 3 },
          ],
        },
        {
          say: 'As long as the condition evaluates to true, execution circles along this back-edge path again and again.',
          ops: [
            { panel: 'code-trace', s: { scene: 'loop', stage: 2, step: 1, bug: 0, labels: 1, focus: 'flowchart' } },
            { write: 'f7', tex: `${T('repeat while ')}${F('i < 7 \\text{ is True}')}` },
          ],
        },
        {
          say: 'When i finally reaches seven, seven less than seven is false. The condition fails, and execution breaks out of the loop.',
          ops: [
            { panel: 'code-trace', s: { scene: 'loop', stage: 2, step: 7, bug: 0, labels: 1, focus: 'flowchart' } },
            { write: 'f8', tex: `${C('i = 7')}:\\ ${F('7 < 7')} \\to ${E('\\text{False}')}` },
            { write: 'f9', tex: `${T('Exit loop cleanly')}`, at: 3 },
            { box: 'f9' },
          ],
        },
      ],
    },
    {
      title: 'The Accumulator Pattern: 7-Day Solar Readings',
      cues: [
        {
          say: 'Worked example. Chief Babatunde needs the total weekly energy and daily average generated by Ikogosi clinic over seven days.',
          ops: [
            { clear: 'Accumulator pattern' },
            { panel: 'code-trace', s: { scene: 'loop', stage: 3, step: 0, bug: 0, labels: 1, focus: 'trace' }, fresh: 1 },
            { camera: 'wide', focus: 'trace' },
            { write: 'a1', tex: `${T('7-day solar readings (kWh):')}` },
            { write: 'a2', tex: `[${V('45, 52, 60, 58, 49, 63, 55')}]`, at: 3 },
          ],
        },
        {
          say: 'An accumulator is a variable initialized outside the loop, typically to zero, which collects values by adding to itself on each pass.',
          ops: [
            { write: 'a3', tex: `${A('\\text{total} = 0')} \\quad ${T('(init outside)')}` },
            { write: 'a4', tex: `${A('\\text{total} \\mathrel{+}= \\text{reading}')}`, at: 3 },
          ],
        },
        {
          say: 'In step zero, we add forty-five kilowatt-hours. The running total becomes forty-five.',
          ops: [
            { clear: 'Tracing the sum' },
            { write: 'a5', tex: `${C('i = 0')}:\\ ${A('\\text{total}')} = 0 + 45 = ${A('45\\text{ kWh}')}` },
          ],
        },
        {
          say: 'In step one, adding fifty-two brings total to ninety-seven. In step two, sixty brings total to one hundred and fifty-seven.',
          ops: [
            { panel: 'code-trace', s: { scene: 'loop', stage: 3, step: 2, bug: 0, labels: 1, focus: 'trace' } },
            { write: 'a6', tex: `${C('i = 1')}:\\ ${A('\\text{total}')} = 45 + 52 = ${A('97\\text{ kWh}')}` },
            { write: 'a7', tex: `${C('i = 2')}:\\ ${A('\\text{total}')} = 97 + 60 = ${A('157\\text{ kWh}')}`, at: 3.5 },
          ],
        },
        {
          say: 'By step three, adding fifty-eight gives two hundred and fifteen. Each iteration accumulates one more day onto the pile.',
          ops: [
            { panel: 'code-trace', s: { scene: 'loop', stage: 3, step: 3, bug: 0, labels: 1, focus: 'trace' } },
            { write: 'a8', tex: `${C('i = 3')}:\\ ${A('\\text{total}')} = 157 + 58 = ${A('215\\text{ kWh}')}` },
          ],
        },
        {
          say: 'After all seven days, the final reading brings the total to three hundred and eighty-two kilowatt-hours.',
          ops: [
            { clear: 'Weekly totals' },
            { panel: 'code-trace', s: { scene: 'loop', stage: 4, step: 7, bug: 0, labels: 1, focus: 'trace' } },
            { write: 'a9', tex: `${A('\\Sigma')} = 45+52+60+58+49+63+55` },
            { write: 'a10', tex: `${A('\\text{total} = 382\\text{ kWh}')}`, at: 3 },
            { box: 'a10' },
          ],
        },
        {
          say: 'Dividing three hundred and eighty-two by seven gives an average daily generation of fifty-four point five seven kilowatt-hours.',
          ops: [
            { write: 'a11', tex: `\\bar{x} = \\frac{382}{7} = ${A('54.57\\text{ kWh}')}` },
            { box: 'a11' },
          ],
        },
        {
          say: 'Plotting cumulative solar energy day by day reveals a steady climbing curve, rising from zero up to three hundred and eighty-two.',
          ops: [
            { clear: 'Cumulative yield graph' },
            { panel: 'graph', s: { spec: SOLAR_GRAPH, show: ['pts', 'line', 'g7', 'p7'] }, fresh: 1 },
            { camera: 'wide' },
            { write: 'a12', tex: `${T('Accumulator trajectory')}` },
            { write: 'a13', tex: `${T('Day 7: ')}${A('382\\text{ kWh}')}`, at: 3 },
          ],
        },
      ],
    },
    {
      title: 'Condition-Controlled WHILE Loops & Infinite Loops',
      cues: [
        {
          say: 'When repetition depends on an ongoing condition or unknown count, use a condition-controlled WHILE loop.',
          ops: [
            { clear: 'Condition-controlled loops' },
            { panel: null },
            { camera: 'wide' },
            { write: 'w1', tex: `${F('\\text{WHILE}')}${T(' loop: conditional repetition')}` },
            { write: 'w2', tex: `${F('\\text{while }')}\\langle${F('\\text{condition}')}\\rangle:`, at: 2.5 },
          ],
        },
        {
          say: 'Every safe while loop requires three pillars: initialization outside, a condition check at the top, and step progression inside.',
          ops: [
            { write: 'w3', tex: `1.\\ ${T('Initialize variable outside')}`, at: 1 },
            { write: 'w4', tex: `2.\\ ${T('Test condition at top')}`, at: 3 },
            { write: 'w5', tex: `3.\\ ${T('Update variable in body')}`, at: 5 },
          ],
        },
        {
          say: 'Watch what happens when a programmer forgets the third pillar: the step update. Look at the red alarm in our code tracer!',
          ops: [
            { clear: 'The runaway bug' },
            { panel: 'code-trace', s: { scene: 'loop', stage: 4, step: 0, bug: 1, labels: 1, focus: 'flowchart' }, fresh: 1 },
            { camera: 'wide', focus: 'flowchart' },
            { write: 'w6', tex: `${C('count = 1')}` },
            { write: 'w7', tex: `${F('\\text{while }')}${C('count')} \\le 5:`, at: 2 },
            { write: 'w8', tex: `\\quad ${T('print(')}${C('count')}${T(')')}`, at: 3.5 },
          ],
        },
        {
          say: 'Count stays stuck at one forever. One less than or equal to five is always true, locking the system in an infinite loop!',
          ops: [
            { write: 'w9', tex: `${C('1')} \\le 5 \\to ${E('\\text{Always True!}')}`, note: 'CPU frozen' },
            { write: 'w10', tex: `${E('\\text{Missing: }')}${C('count \\mathrel{+}= 1')}`, at: 3 },
            { box: 'w10' },
          ],
        },
        {
          say: 'To fix Tari\'s Ikogosi code, add panel index plus equals one inside the loop block. It checks panels one to twelve, and stops at thirteen.',
          ops: [
            { clear: 'The Ikogosi fix' },
            { panel: 'code-trace', s: { scene: 'loop', stage: 4, step: 0, bug: 0, labels: 1, focus: 'flowchart' } },
            { write: 'w11', tex: `${F('\\text{while }')}${C('panel\\_idx')} \\le 12:` },
            { write: 'w12', tex: `\\quad ${C('panel\\_idx \\mathrel{+}= 1')}`, at: 2 },
            { write: 'w13', tex: `${T('Stops at ')}${C('panel\\_idx = 13')}`, at: 4 },
            { box: 'w13' },
          ],
        },
        {
          say: 'For sensor reading until an external stop signal, programmers use a sentinel value, such as entering minus one to terminate.',
          ops: [
            { clear: 'Sentinel values' },
            { write: 'w14', tex: `${T('Sentinel: exit signal flag')}` },
            { write: 'w15', tex: `${F('\\text{while }')}${V('sensor')} \\ne -1:`, at: 2.5 },
          ],
        },
      ],
    },
    {
      title: 'WAEC Trace Table Practice & Summary',
      cues: [
        {
          say: 'Now it is your turn. A classic WAEC question asks for the final value of total after this loop executes.',
          ops: [
            { clear: 'WAEC practice' },
            { panel: null },
            { camera: 'wide' },
            { write: 'y1', tex: `${A('\\text{total} = 0')}` },
            { write: 'y2', tex: `${C('\\text{for } i \\text{ in range}(1, 5):')}`, at: 2 },
            { write: 'y3', tex: `\\quad ${A('\\text{total} \\mathrel{+}= ')}${C('i')}`, at: 4 },
          ],
        },
        {
          say: 'Construct a trace table on paper and find the final total. Pause the video and calculate now.',
          hold: 15,
          ops: [
            { write: 'y4', tex: `${T('Find final value of ')}${A('\\text{total}')}` },
          ],
        },
        {
          say: 'Let us trace it step by step. Range one comma five generates integers one, two, three, and four, stopping before five.',
          ops: [
            { clear: 'Step-by-step trace' },
            { write: 'y5', tex: `${C('i')} \\in \\{${V('1, 2, 3, 4')}\\}` },
          ],
        },
        {
          say: 'At step one, total is one. At step two, one plus two is three. At step three, three plus three is six.',
          ops: [
            { write: 'y6', tex: `${C('i = 1')}:\\ ${A('\\text{total}')} = 0 + 1 = ${A('1')}` },
            { write: 'y7', tex: `${C('i = 2')}:\\ ${A('\\text{total}')} = 1 + 2 = ${A('3')}`, at: 2.5 },
            { write: 'y8', tex: `${C('i = 3')}:\\ ${A('\\text{total}')} = 3 + 3 = ${A('6')}`, at: 5 },
          ],
        },
        {
          say: 'At step four, six plus four gives ten. The loop ends, and the final value of total is ten.',
          ops: [
            { write: 'y9', tex: `${C('i = 4')}:\\ ${A('\\text{total}')} = 6 + 4 = ${A('10')}` },
            { write: 'y10', tex: `${T('Final total')} = ${A('10')}`, at: 3 },
            { box: 'y10' },
          ],
        },
        {
          say: 'Beware the off-by-one trap: range one to five does not include five. Adding five would wrongly give fifteen.',
          ops: [
            { clear: 'Common mistakes' },
            { write: 'm1', tex: `\\times\\ ${T('include 5')} \\to ${E('15')}` },
            { write: 'm2', tex: `\\checkmark\\ ${T('stop at 4')} \\to ${A('10')}`, at: 3 },
          ],
        },
        {
          say: 'And never initialize your accumulator inside the loop, or it will reset to zero on every single pass!',
          ops: [
            { write: 'm3', tex: `\\times\\ ${A('\\text{total} = 0')}${T(' inside loop')}` },
            { write: 'm4', tex: `\\checkmark\\ ${T('initialize outside loop')}`, at: 3 },
          ],
        },
        {
          say: 'To summarize: use FOR for counted iteration, while for conditions, step your variables to avoid infinite loops, and trace your steps carefully. Well done!',
          ops: [
            { clear: 'Summary' },
            { write: 'u1', tex: `${C('\\text{FOR}')}:\\ ${T('counted repetition')}` },
            { write: 'u2', tex: `${F('\\text{WHILE}')}:\\ ${T('conditional repetition')}`, at: 2.5 },
            { write: 'u3', tex: `${A('\\text{Accumulator}')}:\\ ${T('init outside to 0')}`, at: 5 },
            { write: 'u4', tex: `${F('\\text{Back-edge}')}:\\ ${T('jump to condition test')}`, at: 7.5 },
            { box: 'u4' },
          ],
        },
      ],
    },
  ],
};
