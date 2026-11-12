// Lesson 01 explainer plan (explainer-director output, schema v1).
// Topic: introduction-to-programming · From Logic to Code: Programming Languages, Translators & Memory Variables.
// Approved direction script: 06-videos/lesson-01-direction-script.md (same chapter and line order).
// Check: node scripts/apply-video.mjs topics/introduction-to-programming --lesson lesson-01 --check-only
const k = (r, s) => `\\htmlClass{role-${r}}{${s}}`;
const C = s => k('code', s);
const V = s => k('val', s);
const S = s => k('str', s);
const E = s => k('err', s);
const R = s => k('res', s);
const T = s => `\\text{${s}}`;
const K = 'code-trace';

module.exports = {
  meta: {
    title: 'Languages, Translators & Memory Variables',
    subtitle: 'Lesson 01 · The Ikogosi String Trap "150" + 20',
    eq: 'int("150") + 20 = 170',
    subject: 'Computer Studies',
    level: 'SS1 · WAEC / NECO / JAMB',
    next: '#apply',
    nextLabel: 'Continue to Apply →',
    roles: {
      code: { color: 'sky', name: 'code / keyword' },
      val: { color: 'green', name: 'valid value / int' },
      str: { color: 'amber', name: 'string literal' },
      err: { color: 'red', name: 'error / trap' },
      res: { color: 'gold', name: 'evaluated result' },
    },
    captionFixes: {
      'BODMAS': 'BODMAS',
      'int': 'int',
      'str': 'str',
      'float': 'float',
      'bool': 'bool',
      'RAM': 'RAM',
      'CPU': 'CPU',
      'ALU': 'ALU',
    },
  },

  checks: [
    // Chapter 1 & 4 · Ikogosi trap, string concatenation & type casting
    ['int("150") + 20', 150 + 20, 170],
    { name: 'string concat "200" + "50"', test: () => ('200' + '50') === '20050' },
    ['integer addition 200 + 50', 200 + 50, 250],
    ['cast addition int("200") + int("50")', 200 + 50, 250],
    // Chapter 5 · BODMAS precedence
    ['mult: 8 * 2', 8 * 2, 16],
    ['div: 6 / 2', 6 / 2, 3],
    ['add: 12 + 16', 12 + 16, 28],
    ['sub: 28 - 3', 28 - 3, 25],
    ['BODMAS: 12 + 8*2 - 6/2', 12 + 8 * 2 - 6 / 2, 25],
    // Chapter 5 · Recharge bonus & division operators
    ['bonus amount: 1500 * 0.20', 1500 * 0.20, 300],
    ['total credit: 1500 + 300', 1500 + 300, 1800],
    ['floor division 19 // 4', Math.floor(19 / 4), 4],
    ['modulus 19 % 4', 19 % 4, 3],
    // Chapter 6 · Trap comparisons
    { name: 'trap string concat "50" + "50"', test: () => ('50' + '50') === '5050' },
    ['trap cast addition 50 + 50', 50 + 50, 100],
    ['trap precedence wrong (12+8)*2', (12 + 8) * 2, 40],
    ['trap precedence right 12+(8*2)', 12 + 8 * 2, 28],
    // Chapter 6 · Your Turn
    { name: 'YT string concat "400" + "25"', test: () => ('400' + '25') === '40025' },
    ['YT mult: 25 * 4', 25 * 4, 100],
    ['YT div: 30 / 3', 30 / 3, 10],
    ['YT sum: 400 + 100', 400 + 100, 500],
    ['YT final: 500 - 10', 500 - 10, 490],
    ['YT expression: 400 + 25*4 - 30/3', 400 + 25 * 4 - 30 / 3, 490],
  ],

  chapters: [
    {
      title: 'The Ikogosi string trap',
      cues: [
        {
          say: 'At the Ikogosi solar microgrid in Ekiti State, an evening storm triggers an emergency shutdown. The clinic backup power cuts out, and the maintenance terminal flashes an error.',
          ops: [
            { clear: 'Ikogosi Microgrid, Ekiti' },
            { panel: K, s: { scene: 'memory', stage: 1, translator: 'none', cast: 0, prec: 0, labels: 1, focus: null }, fresh: 1 },
            { camera: 'wide' },
            { write: 'h1', tex: T('Ikogosi Solar Microgrid Terminal') },
          ],
        },
        {
          say: 'Chief Babatunde points his multimeter at the solar inverter, worried the hardware has burned out. But Amina inspects the terminal log and finds a software crash.',
          ops: [
            { write: 'h2', tex: E(T('SYSTEM ERROR: TypeError')) },
            { camera: 'wide' },
          ],
        },
        {
          say: 'Tari reads the offending code line: total power equals quote one hundred and fifty unquote, plus twenty. He asks why a superfast processor cannot add two simple numbers.',
          ops: [
            { write: 'h3', tex: `\\text{total} = ${S(T('"150"'))} + ${V('20')}` },
            { box: 'h3' },
            { hl: ['str', 'err'] },
          ],
        },
        {
          say: 'Amina smiles. The hardware is fine. The computer saw the quotation marks and treated one hundred and fifty as text letters, not a numeric quantity.',
          ops: [
            { clear: 'Text or Number?' },
            { write: 'h4', tex: `${S(T('"150"'))} \\ne ${V('150')}`, note: 'quotes mean text' },
            { write: 'h5', tex: T('quotes create a text string'), at: 3 },
            { camera: 'wide' },
          ],
        },
        {
          say: 'By the end of this video, you will trace code through the CPU pipeline, inspect RAM memory lockers, cast data types, and conquer operator precedence for your exam.',
          ops: [
            { clear: 'By the end of this video' },
            { panel: null },
            { write: 'o1', tex: `\\square\\ \\ ${C(T('Translators: compiler vs interpreter'))}` },
            { write: 'o2', tex: `\\square\\ \\ ${V(T('RAM lockers and data types'))}`, at: 3 },
            { write: 'o3', tex: `\\square\\ \\ ${S(T('String concatenation vs casting'))}`, at: 6 },
            { write: 'o4', tex: `\\square\\ \\ ${R(T('BODMAS operator precedence'))}`, at: 9 },
            { camera: 'wide' },
          ],
        },
      ],
    },

    {
      title: 'Language generations and translators',
      cues: [
        {
          say: 'At the silicon level, digital computers only understand electrical voltages: high voltage for one, and low voltage for zero. This raw binary stream is machine language.',
          ops: [
            { clear: 'Language Generations' },
            { panel: K, s: { scene: 'memory', stage: 1, translator: 'none', cast: 0, prec: 0, labels: 1, focus: 'pipeline' }, fresh: 1 },
            { camera: 'wide', focus: 'pipeline' },
            { write: 'g1', tex: `${V(T('Machine Code'))}:\\ ${C(T('10110001'))}`, note: '1st generation' },
          ],
        },
        {
          say: 'Writing raw binary is tedious. Second generation assembly language introduced mnemonic words like move and add, which an assembler converts into binary.',
          ops: [
            { write: 'g2', tex: `${C(T('Assembly'))}:\\ \\text{ADD, MOV}`, note: '2nd generation' },
            { camera: 'wide' },
          ],
        },
        {
          say: 'To write complex software quickly, we use third generation high level languages like Python and BASIC. They use English-like statements that humans read easily.',
          ops: [
            { write: 'g3', tex: `${C(T('High-Level'))}:\\ \\text{Python, BASIC}`, note: '3rd generation' },
            { hl: ['code'] },
          ],
        },
        {
          say: 'Because the central processor cannot read high level code directly, a translator program must convert source code into machine instructions.',
          ops: [
            { clear: 'Compiler vs Interpreter' },
            { panel: K, s: { stage: 1, translator: 'compiler', focus: 'pipeline' } },
            { camera: 'wide', focus: 'pipeline' },
            { write: 't1', tex: `${C(T('Source Code'))} \\to ${R(T('Machine Code'))}` },
          ],
        },
        {
          say: 'A compiler translates the entire source code in one batch before running, creating an independent machine code file. Languages like C and Java use compilers.',
          ops: [
            { write: 't2', tex: `${C(T('Compiler'))}:\\ \\text{entire program in 1 batch}` },
            { write: 't2b', tex: `\\text{produces } ${V(T('.exe object file'))}`, at: 4 },
          ],
        },
        {
          say: 'An interpreter translates and executes code line by line at runtime. Python uses an interpreter. It halts the very instant it encounters an error.',
          ops: [
            { clear: 'Interpreter: Line-by-Line' },
            { panel: K, s: { stage: 1, translator: 'interpreter', focus: 'pipeline' } },
            { camera: 'wide', focus: 'pipeline' },
            { write: 't3', tex: `${R(T('Interpreter'))}:\\ \\text{line-by-line at runtime}` },
            { write: 't3b', tex: E(T('halts immediately on error')), at: 4 },
          ],
        },
        {
          say: 'In WAEC and NECO, remember: compilers give fast execution from a standalone file, while interpreters let you test code quickly line by line.',
          ops: [
            { clear: 'Exam Summary: Translators' },
            { write: 't4', tex: `${C(T('Compiler'))}:\\ \\text{batch} \\implies \\text{fast execution}` },
            { write: 't5', tex: `${R(T('Interpreter'))}:\\ \\text{line-by-line} \\implies \\text{halts at error}`, at: 3 },
            { box: 't5' },
            { camera: 'wide' },
          ],
        },
      ],
    },

    {
      title: 'RAM memory lockers and data types',
      cues: [
        {
          say: 'When a program runs, where do the values live? In Random Access Memory, or RAM. Think of RAM as a wall of numbered post office lockers.',
          ops: [
            { clear: 'RAM: Addressed Lockers' },
            { panel: K, s: { scene: 'memory', stage: 2, translator: 'interpreter', cast: 0, prec: 0, labels: 1, focus: 'ram' }, fresh: 1 },
            { camera: 'wide', focus: 'ram' },
            { write: 'r1', tex: `${V(T('RAM'))}:\\ \\text{addressed memory lockers}` },
          ],
        },
        {
          say: 'Every locker has an address, like hex zero x zero one, a variable name chosen by the programmer, a data type tag, and a stored value.',
          ops: [
            { write: 'r2', tex: `\\text{Locker: } [\\text{Addr},\\ \\text{Name},\\ \\text{Type},\\ \\text{Value}]` },
            { camera: 'wide', focus: 'ram' },
          ],
        },
        {
          say: 'A variable is a named memory location whose value can change during execution. A constant stores a fixed value that never changes.',
          ops: [
            { clear: 'Variables vs Constants' },
            { write: 'v1', tex: `${C(T('Variable'))}:\\ \\text{value can change}` },
            { write: 'v2', tex: `${R(T('Constant'))}:\\ \\text{fixed, immutable value}`, at: 4 },
            { camera: 'wide' },
          ],
        },
        {
          say: 'Four core data types fill these lockers. Integers, or int, store positive or negative whole numbers with no decimal point, such as voltage equals two hundred and thirty.',
          ops: [
            { clear: 'Standard Data Types' },
            { write: 'd1', tex: `${V(T('int'))}:\\ \\text{whole numbers, e.g. } ${V('230')}` },
            { hl: ['val'] },
          ],
        },
        {
          say: 'Floating point numbers, or float, store real numbers with fractional decimal parts, such as tariff equals sixty-eight point five.',
          ops: [
            { write: 'd2', tex: `${V(T('float'))}:\\ \\text{decimal values, e.g. } ${V('68.50')}` },
          ],
        },
        {
          say: 'Strings, or str, store textual sequences enclosed in quotes, such as the location name Ikogosi. Booleans, or bool, store logical truth: True or False.',
          ops: [
            { write: 'd3', tex: `${S(T('str'))}:\\ \\text{text in quotes, e.g. } ${S(T('"Ikogosi"'))}` },
            { write: 'd4', tex: `${C(T('bool'))}:\\ ${C(T('True'))} \\text{ or } ${E(T('False'))}`, at: 4 },
          ],
        },
        {
          say: 'Exam rule for variable names: identifiers must start with a letter or underscore, never with a digit, and cannot contain spaces or reserved keywords.',
          ops: [
            { clear: 'Variable Naming Rules' },
            { write: 'n1', tex: `\\checkmark\\ \\ \\text{\\_student\\_age},\\ \\ \\text{user\\_total}` },
            { write: 'n2', tex: `\\times\\ \\ 2\\text{nd\\_score},\\ \\ \\text{total bill},\\ \\ \\text{class}`, at: 4 },
            { box: 'n1' },
            { camera: 'wide' },
          ],
        },
      ],
    },

    {
      title: 'String concatenation vs type casting',
      cues: [
        {
          say: 'Now let us resolve the Ikogosi trap. What happens when the plus operator meets two text strings? It concatenates them, joining the characters end to end.',
          ops: [
            { clear: 'String Concatenation' },
            { panel: K, s: { scene: 'memory', stage: 2, translator: 'interpreter', cast: 0, prec: 0, labels: 1, focus: 'ram' } },
            { camera: 'wide', focus: 'ram' },
            { write: 'c1', tex: `${S(T('"200"'))} + ${S(T('"50"'))} = ${S(T('"20050"'))}` },
            { box: 'c1' },
            { hl: ['str'] },
          ],
        },
        {
          say: 'Notice that quote two hundred unquote plus quote fifty unquote is quote twenty thousand and fifty unquote, not two hundred and fifty. Strings join; they do not calculate.',
          ops: [
            { write: 'c2', tex: `${S(T('"20050"'))} \\ne ${V('250')}`, note: 'joins, no math' },
            { camera: 'wide' },
          ],
        },
        {
          say: 'In the Ikogosi controller, locker zero x zero one held text string quote one hundred and fifty unquote. Locker zero x zero two held numeric integer twenty.',
          ops: [
            { panel: K, s: { scene: 'memory', stage: 2, translator: 'interpreter', cast: 0, prec: 0, labels: 1, focus: 'ram' } },
            { camera: 'wide', focus: 'ram' },
            { write: 'c3', tex: `\\text{0x01: } ${S(T('"150"'))}\\ \\text{(str)},\\ \\ \\text{0x02: } ${V('20')}\\ \\text{(int)}` },
          ],
        },
        {
          say: 'When the Arithmetic Logic Unit tried to add string to integer without casting, it threw a Type Error. Python refuses to add letters to numbers.',
          ops: [
            { clear: 'The Type Collision' },
            { panel: K, s: { stage: 3, translator: 'interpreter', cast: 0, prec: 0, labels: 1, focus: 'alu' } },
            { camera: 'wide', focus: 'alu' },
            { write: 'c4', tex: `${S(T('"150"'))} + ${V('20')} \\implies ${E(T('TypeError'))}` },
            { box: 'c4' },
            { hl: ['err'] },
          ],
        },
        {
          say: 'The fix is type casting: explicitly converting data from one type to another. We wrap the text string in the int function.',
          ops: [
            { clear: 'Type Casting with int()' },
            { write: 'c5', tex: `${C(T('int'))}(${S(T('"150"'))}) \\implies ${V('150')}`, note: 'str to int' },
            { camera: 'wide' },
          ],
        },
        {
          say: 'Now both operands are integers. One hundred and fifty plus twenty evaluates to one hundred and seventy. The microgrid sensor reads true power.',
          ops: [
            { clear: 'Type Casting: The Fix' },
            { panel: K, s: { stage: 4, translator: 'compiler', cast: 1, prec: 0, labels: 1, focus: 'alu' } },
            { camera: 'wide', focus: 'alu' },
            { write: 'c6', tex: `${C(T('int'))}(${S(T('"150"'))}) + ${V('20')}` },
            { write: 'c6b', tex: `\\phantom{\\text{int}} = 150 + 20 = ${R('170')}`, at: 4 },
            { box: 'c6b' },
            { hl: ['res'] },
          ],
        },
        {
          say: 'Likewise, converting both strings gives integer two hundred plus fifty, which equals two hundred and fifty. Casting turns text digits into math.',
          ops: [
            { write: 'c7', tex: `${C(T('int'))}(${S(T('"200"'))}) + ${C(T('int'))}(${S(T('"50"'))}) = ${R('250')}` },
            { camera: 'wide' },
          ],
        },
      ],
    },

    {
      title: 'BODMAS precedence and recharge bonus',
      cues: [
        {
          say: 'When an expression has multiple operators, computers follow strict operator precedence: B O D M A S, brackets, powers, multiplication and division, then addition and subtraction.',
          ops: [
            { clear: 'Operator Precedence (BODMAS)' },
            { panel: null },
            { write: 'p1', tex: `${C(T('1. Brackets'))}\\ \\ (\\ )` },
            { write: 'p2', tex: `${C(T('2. Multiply / Divide'))}\\ \\ *,\\ /`, at: 3 },
            { write: 'p3', tex: `${C(T('3. Add / Subtract'))}\\ \\ +,\\ -`, at: 6 },
            { camera: 'wide' },
          ],
        },
        {
          say: 'Worked example one from JAMB. Evaluate result equals twelve plus eight times two, minus six divided by two.',
          ops: [
            { clear: 'Worked Example 1: Precedence' },
            { panel: K, s: { scene: 'memory', stage: 4, translator: 'none', cast: 1, prec: 1, labels: 0, focus: null }, fresh: 1 },
            { camera: 'wide' },
            { write: 'e1', tex: `\\text{result} = 12 + 8 \\times 2 - 6 / 2` },
          ],
        },
        {
          say: 'Step one: multiplication and division first. Eight times two is sixteen. Six divided by two is three. The line becomes twelve plus sixteen minus three.',
          ops: [
            { write: 'e2', tex: `8 \\times 2 = ${V('16')},\\ \\ 6 / 2 = ${V('3')}`, note: 'step 1: * and /' },
            { write: 'e3', tex: `\\text{result} = 12 + ${V('16')} - ${V('3')}`, at: 5 },
            { camera: 'board' },
          ],
        },
        {
          say: 'Step two: addition and subtraction from left to right. Twelve plus sixteen is twenty-eight. Twenty-eight minus three equals twenty-five.',
          ops: [
            { clear: 'Worked Example 1: Step 2' },
            { write: 'e4', tex: `12 + 16 = ${V('28')},\\ \\ 28 - 3 = ${R('25')}`, note: 'step 2: + and -' },
            { write: 'e5', tex: `\\text{result} = ${R('25')}`, at: 5 },
            { box: 'e5' },
            { hl: ['res'] },
            { camera: 'board' },
          ],
        },
        {
          say: 'Now examine Worked Example two: an airtime recharge script. A customer buys one thousand five hundred naira airtime with a twenty percent promo bonus.',
          ops: [
            { clear: 'Worked Example 2: Recharge Bonus' },
            { panel: null },
            { camera: 'wide' },
            { write: 'b1', tex: `\\text{recharge} = ${V('1500')},\\ \\ \\text{bonus\\_rate} = ${V('0.20')}` },
          ],
        },
        {
          say: 'Bonus amount is recharge times bonus rate: one thousand five hundred times zero point two zero, which equals three hundred naira.',
          ops: [
            { write: 'b2', tex: `\\text{bonus} = 1500 \\times 0.20 = ${V('300')}`, note: 'bonus calc' },
            { camera: 'wide' },
          ],
        },
        {
          say: 'Total credit is recharge plus bonus: one thousand five hundred plus three hundred, giving one thousand eight hundred naira airtime.',
          ops: [
            { write: 'b3', tex: `\\text{total} = 1500 + 300 = ${R('1800')}` },
            { box: 'b3' },
            { hl: ['res'] },
          ],
        },
        {
          say: 'Two special division operators also feature in exams: double slash is floor division, discarding decimals so nineteen floor four is four. Percent is modulus, giving the remainder: three.',
          ops: [
            { clear: 'Division Operators' },
            { write: 'div1', tex: `19 // 4 = ${V('4')}`, note: 'integer quotient' },
            { write: 'div2', tex: `19 \\% 4 = ${V('3')}`, note: 'remainder', at: 4 },
            { camera: 'wide' },
          ],
        },
      ],
    },

    {
      title: 'Mistakes, summary and your turn',
      cues: [
        {
          say: 'Here are four common traps that cost students marks in WAEC, NECO, and JAMB.',
          ops: [
            { clear: 'Common Exam Traps' },
            { panel: null },
            { camera: 'wide' },
          ],
        },
        {
          say: 'Trap one: adding quoted numbers. Quote fifty unquote plus quote fifty unquote is fifty-fifty as text, never one hundred. For math, cast with int first.',
          ops: [
            { write: 'm1', tex: `\\times\\ ${S(T('"50"'))} + ${S(T('"50"'))} = ${S(T('"5050"'))}` },
            { write: 'm1b', tex: `\\checkmark\\ ${C(T('int'))}(${S(T('"50"'))}) + ${C(T('int'))}(${S(T('"50"'))}) = ${V('100')}`, at: 4 },
          ],
        },
        {
          say: 'Trap two: confusing single equals with double equals. Single equals is assignment, storing a value into a variable. Double equals is comparison, testing if two values match.',
          ops: [
            { write: 'm2', tex: `${C(T('x = 10'))}\\ \\text{(assignment)}` },
            { write: 'm2b', tex: `${C(T('x == 10'))}\\ \\text{(equality test)}`, at: 4 },
          ],
        },
        {
          say: 'Trap three: evaluating addition before multiplication. In twelve plus eight times two, multiply eight by two first, giving twenty-eight, not forty.',
          ops: [
            { clear: 'Trap 3: Precedence Failure' },
            { write: 'm3', tex: `\\times\\ (12 + 8) \\times 2 = 40` },
            { write: 'm3b', tex: `\\checkmark\\ 12 + (8 \\times 2) = 28`, note: 'follow BODMAS', at: 4 },
          ],
        },
        {
          say: 'To sum up: compilers translate programs in batch; interpreters translate line by line. Variables store typed data in RAM lockers. Use type casting to prevent type errors.',
          ops: [
            { clear: 'Summary' },
            { write: 's1', tex: `\\text{Compiler: batch} \\mid \\text{Interpreter: line-by-line}` },
            { write: 's2', tex: `\\text{RAM lockers: } ${V(T('int'))},\\ ${V(T('float'))},\\ ${S(T('str'))},\\ ${C(T('bool'))}`, at: 3 },
            { write: 's3', tex: `\\text{Casting: } ${C(T('int()'))} \\text{ converts text to number}`, at: 6 },
            { camera: 'wide' },
          ],
        },
        {
          say: 'Your turn. Evaluate two problems. Part one: what is quote four hundred unquote plus quote twenty-five unquote? Part two: evaluate int quote four hundred unquote, plus twenty-five times four, minus thirty divided by three. Pause and try.',
          hold: 15,
          ops: [
            { clear: 'Your Turn!' },
            { write: 'y1', tex: `\\text{Part 1: } ${S(T('"400"'))} + ${S(T('"25"'))} = \\text{ ?}`, at: 2 },
            { write: 'y2', tex: `\\text{Part 2: } ${C(T('int'))}(${S(T('"400"'))}) + 25 \\times 4 - 30 / 3`, at: 6 },
            { write: 'y3', tex: T('Pause and calculate! (15 s)'), note: 'your turn', at: 9 },
          ],
        },
        {
          say: 'Here is the solution. Part one: adding two strings concatenates them into quote forty thousand and twenty-five unquote, of data type string.',
          ops: [
            { clear: 'Solution' },
            { write: 'y4', tex: `${S(T('"400"'))} + ${S(T('"25"'))} = ${S(T('"40025"'))}` },
            { write: 'y4b', tex: `\\text{Data Type: } ${S(T('str (string)'))}`, at: 3 },
            { box: 'y4' },
          ],
        },
        {
          say: 'Part two: cast quote four hundred unquote to integer four hundred. Next, twenty-five times four is one hundred, and thirty divided by three is ten. Four hundred plus one hundred minus ten gives four hundred and ninety.',
          ops: [
            { clear: 'Solution: Part 2' },
            { write: 'y5', tex: `400 + ${V('100')} - ${V('10')}` },
            { write: 'y6', tex: `\\phantom{400} = 500 - 10 = ${R('490')}`, at: 4 },
            { box: 'y6' },
            { hl: ['res'] },
          ],
        },
        {
          say: 'The software bugs are resolved, and the Ikogosi microgrid terminal hums happily. Next, take control of decision making with conditional branches in Apply!',
          ops: [
            { panel: K, s: { scene: 'memory', stage: 4, translator: 'compiler', cast: 1, prec: 0, labels: 1, focus: null }, fresh: 1 },
            { camera: 'wide' },
            { write: 'y7', tex: R(T('Ikogosi Microgrid: Ready!')) },
          ],
        },
      ],
    },
  ],
};
