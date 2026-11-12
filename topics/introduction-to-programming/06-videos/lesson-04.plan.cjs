// Lesson 04 explainer plan: Contiguous Arrays & Zero-Based Indexing
// Verified plan for topics/introduction-to-programming/06-videos/lesson-04-direction-script.md
// Build + check: node .agents/skills/explainer-video/scripts/build.cjs topics/introduction-to-programming/06-videos/lesson-04.plan.cjs --check-only
const k = (r, s) => `\\htmlClass{role-${r}}{${s}}`;
const code = s => k('code', s);
const val = s => k('val', s);
const acc = s => k('acc', s);
const err = s => k('err', s);

const K = 'code-trace';

// Numerical data & verified constants
const CELLS = [3.25, 3.18, 3.30, 2.95, 3.22, 3.15, 3.28, 3.20];
const N = CELLS.length;
const BASE = 0x1000;
const ITEM_SIZE = 4;
const MIN_VOLTAGE = Math.min(...CELLS);
const MIN_INDEX = CELLS.indexOf(MIN_VOLTAGE);
const ORDINAL_POS = MIN_INDEX + 1;
const SUM_VOLTAGE = CELLS.reduce((a, b) => a + b, 0);
const MEAN_VOLTAGE = Math.round((SUM_VOLTAGE / N) * 100) / 100;

// Your turn data
const YT_SENSORS = [12.4, 12.1, 11.8, 12.6, 11.5, 12.2];
const YT_N = YT_SENSORS.length;
const YT_BASE = 0x2000;
const YT_TARGET_POS = 5;
const YT_TARGET_IDX = YT_TARGET_POS - 1;
const YT_TARGET_ADDR = YT_BASE + YT_TARGET_IDX * ITEM_SIZE;

module.exports = {
  meta: {
    title: 'Contiguous Arrays & Zero-Based Indexing',
    subtitle: 'Lesson 04 · Memory lockers, address offsets and boundary rules',
    eq: 'Address = Base + (i × Size) · Max Index = N − 1',
    subject: 'Computer Studies',
    level: 'SS2 · WAEC / NECO / JAMB',
    next: '#apply',
    nextLabel: 'Continue to Apply →',
    roles: {
      code: { color: 'sky', name: 'code / index' },
      val: { color: 'green', name: 'value / voltage' },
      acc: { color: 'gold', name: 'address / offset' },
      err: { color: 'red', name: 'error / trap' },
    },
    captionFixes: {
      'R A M': 'RAM',
      'C P U': 'CPU',
      'O O B': 'OOB',
      'dot py': '.py',
      'battery check': 'battery_check',
      'hex one thousand and twenty': '0x1020',
      'hex one thousand and one C': '0x101C',
      'hex one thousand and C': '0x100C',
      'hex one thousand and four': '0x1004',
      'hex one thousand': '0x1000',
      'hex two thousand and ten': '0x2010',
      'hex two thousand': '0x2000',
      'hex ten': '0x10',
    },
  },
  checks: [
    ['Array length N', N, 8],
    ['Max valid index N - 1', N - 1, 7],
    ['Bytes per element', ITEM_SIZE, 4],
    ['Total array bytes 8 x 4', N * ITEM_SIZE, 32],
    ['Index 0 address', BASE + 0 * ITEM_SIZE, 0x1000],
    ['Index 1 address', BASE + 1 * ITEM_SIZE, 0x1004],
    ['Index 3 address (0x100C)', BASE + 3 * ITEM_SIZE, 0x100c],
    ['Index 7 address (0x101C)', BASE + 7 * ITEM_SIZE, 0x101c],
    ['Index 8 OOB address (0x1020)', BASE + 8 * ITEM_SIZE, 0x1020],
    ['Cell voltages count', CELLS.length, 8],
    ['Minimum voltage value', MIN_VOLTAGE, 2.95],
    ['Minimum voltage index', MIN_INDEX, 3],
    ['Ordinal position of weakest cell', ORDINAL_POS, 4],
    ['Sum of 8 cell voltages', SUM_VOLTAGE, 25.53],
    ['Mean cell voltage (2 d.p.)', MEAN_VOLTAGE, 3.19],
    ['Buggy range stop value', 9 - 1, 8],
    ['Your turn sensor count N', YT_N, 6],
    ['Your turn max valid index', YT_N - 1, 5],
    ['Your turn 5th sensor index', YT_TARGET_IDX, 4],
    ['Your turn byte offset 4 x 4', YT_TARGET_IDX * ITEM_SIZE, 16],
    ['Your turn 5th sensor address (0x2010)', YT_TARGET_ADDR, 0x2010],
    ['Your turn minimum sensor voltage', Math.min(...YT_SENSORS), 11.5],
    ['Your turn minimum sensor index', YT_SENSORS.indexOf(11.5), 4],
  ],
  chapters: [
    {
      title: 'Hook: The Ikogosi Clinic cold-chain crash',
      cues: [
        {
          say: "At the Ikogosi Warm Springs clinic, Doctor Folake's vaccine refrigerator temperature alarm suddenly triggers. The cooling system has stopped cold.",
          ops: [
            { clear: 'The Ikogosi Clinic cold chain' },
            { panel: K, s: { scene: 'array', stage: 1, idx: 0, oob: 0, minTrack: 0, labels: 1, focus: null }, fresh: 1 },
            { write: 'h1', tex: `\\text{Vaccine fridge: } ${err('\\text{OFFLINE}')}` },
          ],
        },
        {
          say: 'Tari checks the telemetry script, battery check dot py. On line thirty-four, the Python interpreter has crashed with a fatal IndexError.',
          ops: [
            { write: 'h2', tex: `${code('\\text{battery\\_check.py:34}')}` },
            { write: 'h3', tex: `${err('\\text{IndexError: out of range}')}` },
          ],
        },
        {
          say: 'Line thirty-four runs a loop: for i in range one to nine, check cell i. There are eight battery cells in the rack.',
          ops: [
            { write: 'h4', tex: `${code('\\text{for } i \\text{ in range}(1, 9):')}` },
            { write: 'h5', tex: `\\text{cells in rack: } ${val('N = 8')}` },
          ],
        },
        {
          say: 'Tari counted one to eight like a human. But when i reached eight, Python could not find cell eight, and the entire monitoring system halted.',
          ops: [
            { panel: K, s: { scene: 'array', stage: 2, idx: 8, oob: 1, minTrack: 0, labels: 1, focus: 'oob' } },
            { camera: 'wide', focus: 'oob' },
            { write: 'h6', tex: `${err('i = 8 \\to \\text{CRASH}')}` },
          ],
        },
        {
          say: 'Amina discovers two errors. The first battery was never checked, and asking for index eight crashed the clinic. By the end of this video, you will master zero-based indexing and memory bounds.',
          ops: [
            { panel: K, s: { scene: 'array', stage: 2, idx: 0, oob: 0, minTrack: 0, labels: 1, focus: null } },
            { camera: 'wide' },
            { clear: 'By the end of this video' },
            { write: 'o1', tex: '\\square\\ \\text{contiguous RAM lockers}', at: 1.5 },
            { write: 'o2', tex: '\\square\\ \\text{hardware address formula}', at: 3.0 },
            { write: 'o3', tex: `\\square\\ \\text{bounds rule: } ${val('0 \\text{ to } N - 1')}`, at: 4.5 },
            { write: 'o4', tex: '\\square\\ \\text{linear search for minimum}', at: 6.0 },
          ],
        },
      ],
    },

    {
      title: 'Contiguous RAM and zero-based indexing',
      cues: [
        {
          say: 'An array is a collection of data elements stored in contiguous memory lockers under a single variable name.',
          ops: [
            { clear: 'Contiguous RAM lockers' },
            { panel: K, s: { scene: 'array', stage: 2, idx: 0, oob: 0, minTrack: 0, labels: 1, focus: 'rack' } },
            { camera: 'wide', focus: 'rack' },
            { write: 'b1', tex: '\\text{Array: contiguous RAM lockers}' },
          ],
        },
        {
          say: 'Contiguous means strictly side by side in RAM. There are no gaps between lockers, so the CPU never needs to search through memory.',
          ops: [
            { write: 'b2', tex: '\\text{No gaps between lockers}' },
            { write: 'b3', tex: `\\text{Access time: } ${acc('O(1) \\text{ instant}')}` },
          ],
        },
        {
          say: 'Why do programmers start counting at index zero instead of one? Because in computer memory, an index is not a count. It is an offset.',
          ops: [
            { clear: 'Index is an offset' },
            { write: 'b4', tex: `${code('\\text{Index}')} = ${acc('\\text{Offset from start}')}` },
          ],
        },
        {
          say: 'Humans count ordinal positions starting at one: first, second, third. But computers calculate distance from the start: zero lockers away, one locker away.',
          ops: [
            { write: 'b4a', tex: `\\text{Human: } 1\\text{st}, 2\\text{nd}, 3\\text{rd} \\dots 8\\text{th}` },
            { write: 'b4b', tex: `\\text{Machine: } ${code('0, 1, 2 \\dots 7')}`, at: 3.5 },
          ],
        },
        {
          say: 'Offset means how many lockers to skip from the start. To read the very first locker, you skip zero lockers. So the first element sits at index zero.',
          ops: [
            { clear: 'Skipping lockers' },
            { panel: K, s: { scene: 'array', stage: 2, idx: 0, oob: 0, minTrack: 0, labels: 1, focus: 'rack' } },
            { write: 'b5', tex: `\\text{1st cell: skip } 0 \\to ${code('\\text{cells}[0]')}` },
            { write: 'b6', tex: `\\phantom{\\text{1st cell: }} = ${val('3.25\\text{ V}')}`, at: 3.5 },
          ],
        },
        {
          say: 'To read the second locker, you skip one locker forward. So the second element sits at index one.',
          ops: [
            { panel: K, s: { scene: 'array', stage: 2, idx: 1, oob: 0, minTrack: 0, labels: 1, focus: 'rack' } },
            { write: 'b7', tex: `\\text{2nd cell: skip } 1 \\to ${code('\\text{cells}[1]')}` },
            { write: 'b8', tex: `\\phantom{\\text{2nd cell: }} = ${val('3.18\\text{ V}')}`, at: 3.0 },
          ],
        },
        {
          say: 'To reach the eighth and final locker, you skip seven lockers forward. So the eighth cell sits at index seven.',
          ops: [
            { panel: K, s: { scene: 'array', stage: 2, idx: 7, oob: 0, minTrack: 0, labels: 1, focus: 'rack' } },
            { write: 'b9', tex: `\\text{8th cell: skip } 7 \\to ${code('\\text{cells}[7]')}` },
            { write: 'b10', tex: `\\phantom{\\text{8th cell: }} = ${val('3.20\\text{ V}')}`, at: 3.0 },
          ],
        },
      ],
    },

    {
      title: 'Hardware address offset formula',
      cues: [
        {
          say: "Inside the hardware memory controller, calculating an element's RAM address requires only a single multiplication and addition.",
          ops: [
            { clear: 'Hardware address formula' },
            { panel: K, s: { scene: 'array', stage: 3, idx: 0, oob: 0, minTrack: 0, labels: 1, focus: 'offset' } },
            { camera: 'wide', focus: 'offset' },
            { write: 'c1', tex: `${acc('\\text{Address}')} = \\text{Base} + (i \\times \\text{Size})` },
            { box: 'c1' },
          ],
        },
        {
          say: 'Here, each floating-point voltage occupies four bytes in RAM. The battery array begins at base address hex one thousand.',
          ops: [
            { write: 'c2', tex: `\\text{Base} = ${acc('\\text{0x1000}')},\\ \\text{Size} = 4\\text{ B}` },
            { write: 'c3', tex: `\\text{Total span: } 8 \\times 4 = ${acc('32\\text{ bytes}')}`, at: 3.5 },
          ],
        },
        {
          say: 'For the first element at index zero: hex one thousand plus zero times four bytes equals hex one thousand.',
          ops: [
            { clear: 'Calculating addresses' },
            { camera: 'board' },
            { panel: K, s: { scene: 'array', stage: 3, idx: 0, oob: 0, minTrack: 0, labels: 1, focus: 'offset' } },
            { write: 'c4', tex: `${code('i = 0')}:\\ ${acc('\\text{Addr}')} = \\text{0x1000} + (0 \\times 4)` },
            { write: 'c5', tex: `\\phantom{i = 0:\\text{Addr}} = ${acc('\\text{0x1000}')}\\ \\to ${val('3.25\\text{ V}')}`, at: 3.0 },
          ],
        },
        {
          say: 'For the second element at index one: hex one thousand plus one times four bytes gives hex one thousand and four, holding three point one eight volts.',
          ops: [
            { panel: K, s: { scene: 'array', stage: 3, idx: 1, oob: 0, minTrack: 0, labels: 1, focus: 'offset' } },
            { write: 'c5a', tex: `${code('i = 1')}:\\ ${acc('\\text{Addr}')} = \\text{0x1000} + (1 \\times 4)` },
            { write: 'c5b', tex: `\\phantom{i = 1:\\text{Addr}} = ${acc('\\text{0x1004}')}\\ \\to ${val('3.18\\text{ V}')}`, at: 3.0 },
          ],
        },
        {
          say: 'For the fourth element at index three: hex one thousand plus three times four bytes is hex one thousand plus twelve bytes, which is hex one thousand and C.',
          ops: [
            { panel: K, s: { scene: 'array', stage: 3, idx: 3, oob: 0, minTrack: 0, labels: 1, focus: 'offset' } },
            { write: 'c6', tex: `${code('i = 3')}:\\ ${acc('\\text{Addr}')} = \\text{0x1000} + (3 \\times 4)` },
            { write: 'c7', tex: `\\phantom{i = 3:\\text{Addr}} = \\text{0x1000} + 12 = ${acc('\\text{0x100C}')}`, at: 3.5 },
          ],
        },
        {
          say: 'For the eighth element at index seven: hex one thousand plus seven times four bytes is hex one thousand plus twenty-eight bytes, giving hex one thousand and one C.',
          ops: [
            { panel: K, s: { scene: 'array', stage: 3, idx: 7, oob: 0, minTrack: 0, labels: 1, focus: 'offset' } },
            { write: 'c8', tex: `${code('i = 7')}:\\ ${acc('\\text{Addr}')} = \\text{0x1000} + (7 \\times 4)` },
            { write: 'c9', tex: `\\phantom{i = 7:\\text{Addr}} = \\text{0x1000} + 28 = ${acc('\\text{0x101C}')}`, at: 3.5 },
          ],
        },
        {
          say: 'All eight cells occupy exactly thirty-two bytes, spanning from hex one thousand to hex one thousand and one C.',
          ops: [
            { camera: 'wide', focus: 'offset' },
            { clear: 'Memory block allocation' },
            { write: 'c10', tex: `\\text{Block: } ${acc('\\text{0x1000}')} \\text{ to } ${acc('\\text{0x101C}')}` },
            { write: 'c11', tex: `\\text{Capacity: } ${val('8\\text{ cells}')} \\times 4\\text{ B} = ${acc('32\\text{ B}')}`, at: 3.0 },
            { box: 'c10' },
          ],
        },
      ],
    },

    {
      title: 'The bounds rule and off-by-one errors',
      cues: [
        {
          say: 'This brings us to the foundational rule of array indexing in modern programming.',
          ops: [
            { clear: 'The bounds rule' },
            { camera: 'wide' },
            { panel: K, s: { scene: 'array', stage: 2, idx: 7, oob: 0, minTrack: 0, labels: 1, focus: 'rack' } },
            { write: 'b_rule1', tex: `\\text{Length: } ${val('N')}` },
          ],
        },
        {
          say: 'If an array has length N, the valid indices run from zero up to N minus one. The maximum valid index is always N minus one.',
          ops: [
            { write: 'b_rule2', tex: `\\text{Valid indices: } ${code('0')} \\le i \\le ${code('N - 1')}` },
            { write: 'b_rule3', tex: `${code('\\text{Max Index}')} = ${val('N - 1')}`, at: 3.5 },
            { box: 'b_rule3' },
          ],
        },
        {
          say: 'For our eight battery cells, N equals eight. The maximum valid index is eight minus one, which is seven.',
          ops: [
            { write: 'b_rule4', tex: `N = 8 \\implies ${code('\\text{Max Index}')} = 8 - 1 = ${val('7')}` },
          ],
        },
        {
          say: 'Python also allows negative indexing to count backward from the end. Index minus one accesses the very last locker, cells at index seven.',
          ops: [
            { write: 'b_neg1', tex: `\\text{Negative index: } ${code('\\text{cells}[-1]')}` },
            { write: 'b_neg2', tex: `\\phantom{\\text{Negative index: }} = ${code('\\text{cells}[7]')}\\ (${val('3.20\\text{ V}')})`, at: 3.5 },
          ],
        },
        {
          say: "Now look at what happened when Tari's loop executed check cell for index eight.",
          ops: [
            { clear: 'Index 8 out of bounds' },
            { panel: K, s: { scene: 'array', stage: 4, idx: 8, oob: 1, minTrack: 0, labels: 1, focus: 'oob' } },
            { camera: 'wide', focus: 'oob' },
            { write: 'oob1', tex: `\\text{Requested: } ${code('\\text{cells}[8]')}` },
          ],
        },
        {
          say: 'The address formula calculated hex one thousand plus eight times four bytes, which is hex one thousand and twenty.',
          ops: [
            { write: 'oob2', tex: `${acc('\\text{Addr}')} = \\text{0x1000} + (8 \\times 4) = ${err('\\text{0x1020}')}` },
          ],
        },
        {
          say: "Hex one thousand and twenty is thirty-two bytes beyond the base address. It lies completely outside the array's allocated memory block.",
          ops: [
            { write: 'oob3', tex: `${err('\\text{0x1020 is OUTSIDE block!}')}` },
            { write: 'oob4', tex: `${err('\\text{IndexError: out of range}')}`, at: 3.0 },
            { box: 'oob4' },
          ],
        },
        {
          say: "This is the classic off-by-one bug. Tari's range one to nine stopped before nine at index eight, which is beyond the array.",
          ops: [
            { clear: 'The off-by-one error' },
            { camera: 'wide' },
            { write: 'obo1', tex: `${err('\\text{range}(1, 9) \\to 1, 2, \\dots, 8')}` },
            { write: 'obo2', tex: `${err('\\text{Bug 1: skipped index 0 (1st cell)}')}`, at: 3.0 },
            { write: 'obo3', tex: `${err('\\text{Bug 2: crashed at index 8}')}`, at: 6.0 },
          ],
        },
      ],
    },

    {
      title: 'Finding the weakest battery cell',
      cues: [
        {
          say: "Let us fix the program and find the clinic's degraded battery cell using a linear traversal algorithm.",
          ops: [
            { clear: 'Linear search for minimum' },
            { camera: 'board' },
            { panel: K, s: { scene: 'array', stage: 3, idx: 0, oob: 0, minTrack: 0, labels: 1, focus: null } },
            { write: 't1', tex: '\\text{Goal: find lowest voltage}' },
            { write: 't2', tex: `${code('\\text{cells} = [3.25, 3.18, \\dots, 3.20]')}`, at: 3.0 },
          ],
        },
        {
          say: 'Step one. Initialize the minimum tracker to the first element: min voltage equals cells at index zero, three point two five volts.',
          ops: [
            { write: 't3', tex: `${code('\\text{min\\_voltage}')} = ${code('\\text{cells}[0]')}` },
            { write: 't4', tex: `\\phantom{\\text{min\\_voltage}} = ${val('3.25\\text{ V}')},\\ ${code('\\text{min\\_idx} = 0')}`, at: 3.5 },
          ],
        },
        {
          say: 'Step two. Iterate through the array using range len cells. This generates the correct indices, zero through seven.',
          ops: [
            { write: 't5', tex: `${code('\\text{for } i \\text{ in range}(\\text{len}(\\text{cells})):')}` },
            { write: 't6', tex: `\\text{generates } i = ${code('0, 1, 2, 3, 4, 5, 6, 7')}`, at: 3.0 },
          ],
        },
        {
          say: 'At index one, three point one eight volts is less than three point two five. The minimum updates to three point one eight volts at index one.',
          ops: [
            { clear: 'Stepping through cells' },
            { panel: K, s: { scene: 'array', stage: 3, idx: 1, oob: 0, minTrack: 0, labels: 1, focus: 'rack' } },
            { camera: 'wide', focus: 'rack' },
            { write: 't7', tex: `i = 1:\\ ${val('3.18')} < 3.25 \\implies ${code('\\text{update}')}` },
            { write: 't8', tex: `${code('\\text{min\\_val}')} = ${val('3.18\\text{ V}')},\\ ${code('\\text{min\\_idx} = 1')}`, at: 3.5 },
          ],
        },
        {
          say: 'At index two, three point three zero volts is greater than three point one eight. The condition is false, so the tracker remains unchanged.',
          ops: [
            { panel: K, s: { scene: 'array', stage: 3, idx: 2, oob: 0, minTrack: 0, labels: 1, focus: 'rack' } },
            { write: 't8a', tex: 'i = 2:\\ 3.30 > 3.18 \\implies \\text{no change}' },
          ],
        },
        {
          say: 'At index three, the sensor reads two point nine five volts. That is lower than three point one eight, so the tracker updates again.',
          ops: [
            { panel: K, s: { scene: 'array', stage: 3, idx: 3, oob: 0, minTrack: 1, labels: 1, focus: 'offset' } },
            { camera: 'wide', focus: 'offset' },
            { write: 't9', tex: `i = 3:\\ ${val('2.95')} < 3.18 \\implies ${code('\\text{update}')}` },
            { write: 't10', tex: `${code('\\text{min\\_val}')} = ${val('2.95\\text{ V}')},\\ ${code('\\text{min\\_idx} = 3')}`, at: 3.5 },
          ],
        },
        {
          say: 'The loop checks indices four through seven. None are below two point nine five volts, so the loop finishes.',
          ops: [
            { panel: K, s: { scene: 'array', stage: 3, idx: 7, oob: 0, minTrack: 1, labels: 1, focus: 'offset' } },
            { write: 't11', tex: 'i = 4..7:\\ \\text{all } > 2.95\\text{ V}' },
            { write: 't12', tex: '\\text{search complete!}', at: 3.0 },
          ],
        },
        {
          say: 'Step three. Report the physical battery cell. In human ordinal terms, the cell position is min index plus one, which is cell four.',
          ops: [
            { clear: 'Weakest cell identified' },
            { camera: 'wide' },
            { write: 't13', tex: `\\text{Weakest: } ${val('2.95\\text{ V}')} \\text{ at } ${code('\\text{idx } 3')}` },
            { write: 't14', tex: `\\text{Cell Number} = 3 + 1 = ${val('\\text{Cell 4}')}`, at: 3.5 },
            { box: 't14' },
          ],
        },
        {
          say: "Cell four is below three point zero volts, dragging the battery pack down. Tari replaces cell four, restoring power to Doctor Folake's vaccine refrigerator.",
          ops: [
            { write: 't15', tex: `\\text{Cell 4: } ${err('< 3.0\\text{ V}')} \\to \\text{Replace!}` },
            { write: 't16', tex: `\\text{Vaccine cooling: } ${val('\\text{RESTORED}')}`, at: 3.5 },
            { box: 't16' },
          ],
        },
      ],
    },

    {
      title: 'WAEC array indexing and summary',
      cues: [
        {
          say: 'Let us examine the common array mistakes that cost marks in WAEC and NECO examinations.',
          ops: [
            { clear: 'Common exam mistakes' },
            { panel: null },
            { camera: 'wide' },
            { write: 'm1', tex: '\\text{Mistake 1: Off-by-one bounds}' },
            { write: 'm2', tex: `${err('\\text{range}(1, N + 1) \\to \\text{IndexError}')}`, at: 3.0 },
          ],
        },
        {
          say: 'Mistake one. Iterating from one to N instead of zero to N minus one. You miss element zero and trigger an IndexError at N.',
          ops: [
            { write: 'm3', tex: `${val('\\text{Correct: range}(N) \\text{ or range}(0, N)')}` },
          ],
        },
        {
          say: 'Mistake two. Confusing index with position. The k-th element is stored at index k minus one, not index k.',
          ops: [
            { clear: 'Mistake 2: Index vs position' },
            { write: 'm4', tex: `${err('k\\text{-th item } \\ne \\text{array}[k]')}` },
            { write: 'm5', tex: `${val('k\\text{-th item } = \\text{array}[k - 1]')}`, at: 3.0 },
            { box: 'm5' },
          ],
        },
        {
          say: 'Mistake three. Initializing the minimum tracker to zero. If all array values are positive, zero falsely remains the minimum forever. Always initialize to array at index zero.',
          ops: [
            { clear: 'Mistake 3: Initializing trackers' },
            { write: 'm6', tex: `${err('\\text{min\\_val} = 0\\ \\text{(fails for positives)}')}` },
            { write: 'm7', tex: `${val('\\text{min\\_val} = \\text{array}[0]\\ \\text{(guaranteed)}')}`, at: 3.5 },
          ],
        },
        {
          say: 'Here is the entire topic on one summary board. Arrays store contiguous elements. The hardware address equals base plus index times element size.',
          ops: [
            { clear: 'Array summary' },
            { write: 's1', tex: `${acc('\\text{Addr}')} = \\text{Base} + (i \\times \\text{Size})` },
            { write: 's2', tex: `\\text{Valid indices: } ${code('0')} \\le i \\le ${code('N - 1')}`, at: 3.0 },
          ],
        },
        {
          say: 'An array of length N has valid indices from zero to N minus one. Accessing index N triggers an out-of-bounds IndexError.',
          ops: [
            { write: 's3', tex: `${code('\\text{Max Index}')} = ${val('N - 1')}` },
            { write: 's4', tex: `i \\ge N \\implies ${err('\\text{IndexError}')}`, at: 3.0 },
            { box: 's3' },
          ],
        },
        {
          say: 'Your turn. An inverter monitor stores six sensor voltages at base address hex two thousand, with four bytes per reading. Find the address of the fifth sensor, and state what occurs if code queries index six.',
          ops: [
            { clear: 'Your turn: Inverter sensors' },
            { write: 'y1', tex: 'N = 6,\\ \\text{Base} = \\text{0x2000},\\ 4\\text{ B/item}' },
            { write: 'y2', tex: '\\text{(a) Address of 5th sensor?}', at: 5.0 },
            { write: 'y3', tex: `\\text{(b) Result of } ${code('\\text{sensors}[6]')}\\text{?}`, at: 9.0 },
          ],
        },
        {
          say: 'Pause the video and calculate both parts. Remember to convert the fifth position to its zero-based index first.',
          hold: 15,
          ops: [
            { write: 'y4', tex: `${val('\\text{pause and try (15 s)}')}` },
          ],
        },
        {
          say: 'Part a. The fifth sensor sits at index five minus one, which is index four. Four times four bytes is sixteen bytes, which is hex ten.',
          ops: [
            { clear: 'Solution (a)' },
            { camera: 'board' },
            { write: 'y5', tex: `\\text{5th sensor} \\implies ${code('i = 5 - 1 = 4')}` },
            { write: 'y6', tex: `${acc('\\text{Addr}')} = \\text{0x2000} + (4 \\times 4)`, at: 3.5 },
            { write: 'y7', tex: `\\phantom{\\text{Addr}} = \\text{0x2000} + 16_{10} = ${acc('\\text{0x2010}')}`, at: 7.0 },
            { box: 'y7' },
          ],
        },
        {
          say: 'Adding hex ten to hex two thousand gives hex two thousand and ten as the memory address.',
          ops: [
            { write: 'y8', tex: `${acc('\\text{Address} = \\text{0x2010}')}` },
          ],
        },
        {
          say: 'Part b. For six sensors, valid indices run from zero to five. Index six is greater than or equal to N, triggering an IndexError out of range.',
          ops: [
            { clear: 'Solution (b)' },
            { write: 'y9', tex: `N = 6 \\implies \\text{valid: } ${code('0..5')}` },
            { write: 'y10', tex: `i = 6 \\ge N \\implies ${err('\\text{IndexError}')}`, at: 3.5 },
            { write: 'y11', tex: `${err('\\text{list index out of range}')}`, at: 7.0 },
            { box: 'y11' },
          ],
        },
        {
          say: 'Excellent work. You have mastered array memory architecture and zero-based indexing. Continue to Apply to test your skills.',
          ops: [
            { camera: 'wide' },
          ],
        },
      ],
    },
  ],
};
