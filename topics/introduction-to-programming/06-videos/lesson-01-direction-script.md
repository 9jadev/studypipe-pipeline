# Direction Script: Lesson 01 · From Logic to Code — Programming Languages, Translators & Memory Variables

## Overview
The video opens the **Make Sense** phase of Lesson 01, resolving the Ikogosi solar microgrid mystery's opening failure: why the terminal crashed with `TypeError` on `total_power = "150" + 20` during the evening storm, and how to fix it. It takes the student from silicon voltage pulses (binary machine code) and low-level assembly to high-level Python, contrasts batch compilers with line-by-line interpreters, visualises RAM memory lockers with data types (`int`, `float`, `str`, `bool`), proves why `"200" + "50"` is `"20050"` and resolves it with `int()` type casting to get `170`, evaluates BODMAS operator precedence ($12 + 8 \times 2 - 6 \div 2 = 25$) alongside an airtime recharge bonus algorithm ($1500 \times 0.20 = 300 \to 1800$), and tests understanding with a pause-and-try challenge.

| Item | Decision |
| --- | --- |
| Running time | About 8.8 minutes on the build timeline (~1,230 words, 6 chapters, 43 narration lines, 15 s practice hold) |
| Narrator | One teacher voice, Nigerian English (`en-NG`) |
| Level | SS1 Computer Studies, WAEC / NECO / JAMB |
| Theme | Unit theme (`meta.theme` unset; follows unit `green-lab`) |
| Kits used | `code-trace` (`scene: 'memory'`, states: `stage, translator, cast, prec, labels, focus`; close-ups: `pipeline, ram, alu`). No kit gaps. |
| Camera | Wide by default; push-ins on `pipeline`, `ram`, and `alu`; dedicated board shots for multi-step calculations |
| End card | `next: '#apply'`, `nextLabel: 'Continue to Apply →'` |

**Colour roles:**
- `code`: sky (`#5ec4ff`) — keywords, identifiers, syntax operators
- `val`: green (`#4cd97b`) — numeric integers, floats, valid quantities
- `str`: amber (`#ffe08a`) — string literals, textual representations
- `err`: red (`#ff6464`) — syntax errors, `TypeError`, illegal identifiers
- `res`: gold (`#ff9f43`) — evaluated results, boxed answers, final outputs

**Accuracy notes:**
- Mystery numbers match `02-lesson.md` § Lesson 01 exactly: `"150" + 20`, `"200" + "50" = "20050"`, `int("150") + 20 = 170`, `200 + 50 = 250`.
- BODMAS worked example matches `03-questions.md` MCQ 11: `12 + 8 * 2 - 6 / 2 = 25`.
- Airtime recharge calculation matches `03-questions.md` MCQ 12: `1500 + (1500 * 0.20) = 1800`.
- Standard WAEC/NECO distinction maintained: Compilers generate standalone machine code object files (`.exe`) in one batch; interpreters execute source code line-by-line at runtime and halt immediately on the first error.
- Phone layout constraint: Board lines are restricted to $\le 30$ mathematical characters or $\le 36$ word characters, with board clearing every 3–4 lines.
- **Your-turn numbers are fresh:** Part 1 `"400" + "25" = "40025"` and Part 2 `int("400") + 25 * 4 - 30 / 3 = 490` were checked across `02-lesson.md`, `03-questions.md`, and `04-review.md` and appear nowhere else in the topic.

---

## Chapter 1: Hook — The Ikogosi String Trap (about 1 min 20 s)
Establishes the Ikogosi solar microgrid emergency, demonstrates that hardware is intact while software logic failed, and outlines the lesson's roadmap.

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 1.1 | At the Ikogosi solar microgrid in Ekiti State, an evening storm triggers an emergency shutdown. The clinic backup power cuts out, and the maintenance terminal flashes an error. | New board: "Ikogosi Microgrid, Ekiti"<br>Kit `code-trace`: `scene='memory', stage=1, translator='none', cast=0, prec=0, labels=1, focus=null`<br>Board: Ikogosi Solar Microgrid Terminal<br>📷 WIDE | Hook: Anchor narrative in Ikogosi solar microgrid |
| 1.2 | Chief Babatunde points his multimeter at the solar inverter, worried the hardware has burned out. But Amina inspects the terminal log and finds a software crash. | Board: SYSTEM ERROR: TypeError<br>📷 WIDE | Define the diagnostic tension: hardware vs code |
| 1.3 | Tari reads the offending code line: total power equals quote one hundred and fifty unquote, plus twenty. He asks why a superfast processor cannot add two simple numbers. | Board: total = "150" + 20<br>Box h3<br>Highlight `str`, `err` | Reveal the core mystery bug from the case file |
| 1.4 | Amina smiles. The hardware is fine. The computer saw the quotation marks and treated one hundred and fifty as text letters, not a numeric quantity. | New board: "Text or Number?"<br>Board: "150" ≠ 150 (note: quotes mean text)<br>Board: quotes create a text string<br>📷 WIDE | Contrast string literals with numeric integers |
| 1.5 | By the end of this video, you will trace code through the CPU pipeline, inspect RAM memory lockers, cast data types, and conquer operator precedence for your exam. | New board: "By the end of this video"<br>Kit panel off<br>Board: ☐ Translators: compiler vs interpreter<br>Board: ☐ RAM lockers and data types<br>Board: ☐ String concatenation vs casting<br>Board: ☐ BODMAS operator precedence<br>📷 WIDE | Roadmap of key exam competencies |

---

## Chapter 2: Language Generations & Translators: Compiler vs Interpreter (about 1 min 30 s)
Traces code from silicon voltage levels to high-level English statements, then contrasts batch compilers with line-by-line interpreters.

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 2.1 | At the silicon level, digital computers only understand electrical voltages: high voltage for one, and low voltage for zero. This raw binary stream is machine language. | New board: "Language Generations"<br>Kit `code-trace`: `stage=1, translator='none', cast=0, prec=0, labels=1, focus='pipeline'`<br>Board: Machine Code: 10110001 (note: 1st generation)<br>📷 WIDE → `pipeline` | Define 1st generation machine code & binary voltages |
| 2.2 | Writing raw binary is tedious. Second generation assembly language introduced mnemonic words like move and add, which an assembler converts into binary. | Board: Assembly: ADD, MOV (note: 2nd generation)<br>📷 WIDE | Introduce 2nd generation assembly & assemblers |
| 2.3 | To write complex software quickly, we use third generation high level languages like Python and BASIC. They use English-like statements that humans read easily. | Board: High-Level: Python, BASIC (note: 3rd generation)<br>Highlight `code` | Introduce 3rd generation high-level languages |
| 2.4 | Because the central processor cannot read high level code directly, a translator program must convert source code into machine instructions. | New board: "Translators: Compiler vs Interpreter"<br>Kit `code-trace`: `stage=1, translator='compiler', focus='pipeline'`<br>Board: Source Code → Machine Code<br>📷 WIDE → `pipeline` | Establish necessity of language translation |
| 2.5 | A compiler translates the entire source code in one batch before running, creating an independent machine code file. Languages like C and Java use compilers. | Board: Compiler: entire program in 1 batch<br>Board: produces .exe object file<br>📷 WIDE → `pipeline` | Define compiler (batch translation, `.exe` object file) |
| 2.6 | An interpreter translates and executes code line by line at runtime. Python uses an interpreter. It halts the very instant it encounters an error. | Kit `code-trace`: `stage=1, translator='interpreter', focus='pipeline'`<br>Board: Interpreter: line-by-line at runtime<br>Board: halts immediately on error<br>📷 WIDE → `pipeline` | Define interpreter (line-by-line, immediate stop) |
| 2.7 | In WAEC and NECO, remember: compilers give fast execution from a standalone file, while interpreters let you test code quickly line by line. | New board: "Exam Summary: Translators"<br>Board: Compiler: batch ⇒ fast execution<br>Board: Interpreter: line-by-line ⇒ halts at error<br>Box t5<br>📷 WIDE | Compare exam trade-offs of both translators |

---

## Chapter 3: RAM Memory Lockers & Data Types (`int`, `float`, `str`, `bool`) (about 1 min 30 s)
Visualises RAM storage as addressed lockers, defines the four fundamental data types, contrasts variables with constants, and details variable naming rules.

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 3.1 | When a program runs, where do the values live? In Random Access Memory, or RAM. Think of RAM as a wall of numbered post office lockers. | New board: "RAM: Addressed Lockers"<br>Kit `code-trace`: `stage=2, translator='interpreter', cast=0, prec=0, labels=1, focus='ram'`<br>Board: RAM: addressed memory lockers<br>📷 WIDE → `ram` | Anchor RAM locker mental model |
| 3.2 | Every locker has an address, like hex zero x zero one, a variable name chosen by the programmer, a data type tag, and a stored value. | Board: Locker: [Addr, Name, Type, Value]<br>📷 WIDE → `ram` | Component anatomy of a variable in memory |
| 3.3 | A variable is a named memory location whose value can change during execution. A constant stores a fixed value that never changes. | New board: "Variables vs Constants"<br>Board: Variable: value can change<br>Board: Constant: fixed, immutable value<br>📷 WIDE | Formal distinction: variable vs constant |
| 3.4 | Four core data types fill these lockers. Integers, or int, store positive or negative whole numbers with no decimal point, such as voltage equals two hundred and thirty. | New board: "Standard Data Types"<br>Board: int: whole numbers, e.g. 230<br>Highlight `val` | Define `int` data type with electrical example |
| 3.5 | Floating point numbers, or float, store real numbers with fractional decimal parts, such as tariff equals sixty-eight point five. | Board: float: decimal values, e.g. 68.50 | Define `float` data type with billing example |
| 3.6 | Strings, or str, store textual sequences enclosed in quotes, such as the location name Ikogosi. Booleans, or bool, store logical truth: True or False. | Board: str: text in quotes, e.g. "Ikogosi"<br>Board: bool: True or False | Define `str` and `bool` data types |
| 3.7 | Exam rule for variable names: identifiers must start with a letter or underscore, never with a digit, and cannot contain spaces or reserved keywords. | New board: "Variable Naming Rules"<br>Board: ✓ _student_age, user_total<br>Board: ✗ 2nd_score, total bill, class<br>Box n1<br>📷 WIDE | WAEC variable naming validation rules |

---

## Chapter 4: String Concatenation vs Type Casting (about 1 min 30 s)
Explains the mechanics of string concatenation (`"200" + "50" = "20050"`), demonstrates the `TypeError` collision in the ALU, and resolves it with `int()` type casting.

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 4.1 | Now let us resolve the Ikogosi trap. What happens when the plus operator meets two text strings? It concatenates them, joining the characters end to end. | New board: "String Concatenation"<br>Kit `code-trace`: `stage=2, translator='interpreter', cast=0, prec=0, labels=1, focus='ram'`<br>Board: "200" + "50" = "20050"<br>Box c1<br>Highlight `str`<br>📷 WIDE → `ram` | Define string concatenation using `"200" + "50"` |
| 4.2 | Notice that quote two hundred unquote plus quote fifty unquote is quote twenty thousand and fifty unquote, not two hundred and fifty. Strings join; they do not calculate. | Board: "20050" ≠ 250 (note: joins, no math)<br>📷 WIDE | Contrast text concatenation with arithmetic sum |
| 4.3 | In the Ikogosi controller, locker zero x zero one held text string quote one hundred and fifty unquote. Locker zero x zero two held numeric integer twenty. | Board: 0x01: "150" (str), 0x02: 20 (int)<br>📷 WIDE → `ram` | Map the Ikogosi variables to memory lockers |
| 4.4 | When the Arithmetic Logic Unit tried to add string to integer without casting, it threw a Type Error. Python refuses to add letters to numbers. | New board: "The Type Collision"<br>Kit `code-trace`: `stage=3, translator='interpreter', cast=0, prec=0, labels=1, focus='alu'`<br>Board: "150" + 20 ⇒ TypeError<br>Box c4<br>Highlight `err`<br>📷 WIDE → `alu` | Visualise ALU `TypeError` mismatch |
| 4.5 | The fix is type casting: explicitly converting data from one type to another. We wrap the text string in the int function. | New board: "Type Casting with int()"<br>Board: int("150") ⇒ 150 (note: str to int)<br>📷 WIDE | Introduce explicit type casting via `int()` |
| 4.6 | Now both operands are integers. One hundred and fifty plus twenty evaluates to one hundred and seventy. The microgrid sensor reads true power. | Kit `code-trace`: `stage=4, translator='compiler', cast=1, prec=0, labels=1, focus='alu'`<br>Board: int("150") + 20<br>Board: = 150 + 20 = 170<br>Box c6b<br>Highlight `res`<br>📷 WIDE → `alu` | Solve Ikogosi bug: $150 + 20 = 170$ |
| 4.7 | Likewise, converting both strings gives integer two hundred plus fifty, which equals two hundred and fifty. Casting turns text digits into math. | Board: int("200") + int("50") = 250<br>📷 WIDE | Reinforce casting with $200 + 50 = 250$ |

---

## Chapter 5: BODMAS / Operator Precedence & Recharge Bonus (about 1 min 40 s)
Details arithmetic operator precedence rules, calculates Worked Example 1 ($12 + 8 \times 2 - 6 \div 2 = 25$), steps through Worked Example 2 (Airtime Recharge Bonus $1500 \times 0.20 = 300 \to 1800$), and explains floor division (`//`) and modulo (`%`).

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 5.1 | When an expression has multiple operators, computers follow strict operator precedence: B O D M A S, brackets, powers, multiplication and division, then addition and subtraction. | New board: "Operator Precedence (BODMAS)"<br>Kit panel off<br>Board: 1. Brackets ( )<br>Board: 2. Multiply / Divide *, /<br>Board: 3. Add / Subtract +, -<br>📷 WIDE | Detail hierarchy of arithmetic operators |
| 5.2 | Worked example one from JAMB. Evaluate result equals twelve plus eight times two, minus six divided by two. | New board: "Worked Example 1: Precedence"<br>Kit `code-trace`: `stage=4, translator='none', cast=1, prec=1, labels=0, focus=null`<br>Board: result = 12 + 8 × 2 - 6 / 2<br>📷 WIDE | State Worked Example 1 from JAMB syllabus |
| 5.3 | Step one: multiplication and division first. Eight times two is sixteen. Six divided by two is three. The line becomes twelve plus sixteen minus three. | Board: 8 × 2 = 16, 6 / 2 = 3 (note: step 1: * and /)<br>Board: result = 12 + 16 - 3<br>📷 BOARD SHOT | Evaluate multiplication and division first |
| 5.4 | Step two: addition and subtraction from left to right. Twelve plus sixteen is twenty-eight. Twenty-eight minus three equals twenty-five. | Board: 12 + 16 = 28, 28 - 3 = 25 (note: step 2: + and -)<br>Board: result = 25<br>Box e5<br>Highlight `res`<br>📷 BOARD SHOT | Evaluate addition and subtraction to 25 |
| 5.5 | Now examine Worked Example two: an airtime recharge script. A customer buys one thousand five hundred naira airtime with a twenty percent promo bonus. | New board: "Worked Example 2: Recharge Bonus"<br>Kit panel off<br>Board: recharge = 1500, bonus_rate = 0.20<br>📷 WIDE | State Worked Example 2 (WAEC practical) |
| 5.6 | Bonus amount is recharge times bonus rate: one thousand five hundred times zero point two zero, which equals three hundred naira. | Board: bonus = 1500 × 0.20 = 300 (note: bonus calc)<br>📷 WIDE | Calculate bonus amount ($1500 \times 0.20 = 300$) |
| 5.7 | Total credit is recharge plus bonus: one thousand five hundred plus three hundred, giving one thousand eight hundred naira airtime. | Board: total = 1500 + 300 = 1800<br>Box b3<br>Highlight `res` | Sum total credit ($1500 + 300 = 1800$) |
| 5.8 | Two special division operators also feature in exams: double slash is floor division, discarding decimals so nineteen floor four is four. Percent is modulus, giving the remainder: three. | New board: "Division Operators"<br>Board: 19 // 4 = 4 (note: integer quotient)<br>Board: 19 % 4 = 3 (note: remainder)<br>📷 WIDE | Explain integer floor division and modulo |

---

## Chapter 6: Exam Summary & Check (Mistakes, Summary & "Your Turn") (about 1 min 50 s)
Summarises common student mistakes in WAEC/NECO/JAMB, consolidates core principles, presents a 15-second timed challenge with fresh numbers, reveals the worked solutions, and wraps up the narrative.

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 6.1 | Here are four common traps that cost students marks in WAEC, NECO, and JAMB. | New board: "Common Exam Traps"<br>Kit panel off<br>📷 WIDE | Introduce exam trap warning section |
| 6.2 | Trap one: adding quoted numbers. Quote fifty unquote plus quote fifty unquote is fifty-fifty as text, never one hundred. For math, cast with int first. | Board: ✗ "50" + "50" = "5050"<br>Board: ✓ int("50") + int("50") = 100 | Contrast string concatenation vs integer sum |
| 6.3 | Trap two: confusing single equals with double equals. Single equals is assignment, storing a value into a variable. Double equals is comparison, testing if two values match. | Board: x = 10 (assignment)<br>Board: x == 10 (equality test) | Contrast `=` (assignment) with `==` (comparison) |
| 6.4 | Trap three: evaluating addition before multiplication. In twelve plus eight times two, multiply eight by two first, giving twenty-eight, not forty. | New board: "Trap 3: Precedence Failure"<br>Board: ✗ (12 + 8) × 2 = 40<br>Board: ✓ 12 + (8 × 2) = 28 (note: follow BODMAS) | Illustrate BODMAS error prevention |
| 6.5 | To sum up: compilers translate programs in batch; interpreters translate line by line. Variables store typed data in RAM lockers. Use type casting to prevent type errors. | New board: "Summary"<br>Board: Compiler: batch ∣ Interpreter: line-by-line<br>Board: RAM lockers: int, float, str, bool<br>Board: Casting: int() converts text to number<br>📷 WIDE | Systematic consolidation of core concepts |
| 6.6 | Your turn. Evaluate two problems. Part one: what is quote four hundred unquote plus quote twenty-five unquote? Part two: evaluate int quote four hundred unquote, plus twenty-five times four, minus thirty divided by three. Pause and try. | New board: "Your Turn!"<br>Board: Part 1: "400" + "25" = ?<br>Board: Part 2: int("400") + 25 × 4 - 30 / 3<br>Board: Pause and calculate! (15 s) (note: your turn)<br>Pause-and-try countdown 15 s | Active student engagement / pause challenge |
| 6.7 | Here is the solution. Part one: adding two strings concatenates them into quote forty thousand and twenty-five unquote, of data type string. | New board: "Solution"<br>Board: "400" + "25" = "40025"<br>Board: Data Type: str (string)<br>Box y4 | Step-by-step resolution of Part 1 |
| 6.8 | Part two: cast quote four hundred unquote to integer four hundred. Next, twenty-five times four is one hundred, and thirty divided by three is ten. Four hundred plus one hundred minus ten gives four hundred and ninety. | Board: 400 + 100 - 10<br>Board: = 500 - 10 = 490<br>Box y6<br>Highlight `res` | Step-by-step resolution of Part 2 |
| 6.9 | The software bugs are resolved, and the Ikogosi microgrid terminal hums happily. Next, take control of decision making with conditional branches in Apply! | Kit `code-trace`: `stage=4, translator='compiler', cast=1, prec=0, labels=1, focus=null`<br>Board: Ikogosi Microgrid: Ready!<br>📷 WIDE | Resolution of mystery hook and handoff to Apply |

---

## Build checks and kit gaps

### Numerical Checks
Every number in narration and on the board is verified by build-time assertions:
1. `int("150") + 20 = 170` (Ikogosi bug fix)
2. `"200" + "50" === "20050"` (string concatenation)
3. `200 + 50 = 250` (integer addition)
4. `int("200") + int("50") = 250` (cast addition)
5. `8 * 2 = 16` (multiplication precedence step)
6. `6 / 2 = 3` (division precedence step)
7. `12 + 16 = 28` (addition precedence step)
8. `28 - 3 = 25` (subtraction precedence step)
9. `12 + 8 * 2 - 6 / 2 = 25` (Worked Example 1 total)
10. `1500 * 0.20 = 300` (recharge bonus calculation)
11. `1500 + 300 = 1800` (Worked Example 2 total credit)
12. `19 // 4 = 4` (floor division quotient)
13. `19 % 4 = 3` (modulus remainder)
14. `"50" + "50" === "5050"` (common trap comparison)
15. `50 + 50 = 100` (common trap integer sum)
16. `(12 + 8) * 2 = 40` (precedence error demonstration)
17. `12 + (8 * 2) = 28` (correct precedence demonstration)
18. `"400" + "25" === "40025"` (Your Turn Part 1 fresh concatenation)
19. `25 * 4 = 100` (Your Turn Part 2 multiplication)
20. `30 / 3 = 10` (Your Turn Part 2 division)
21. `400 + 100 = 500` (Your Turn Part 2 intermediate addition)
22. `500 - 10 = 490` (Your Turn Part 2 final subtraction)
23. `400 + 25 * 4 - 30 / 3 = 490` (Your Turn Part 2 full expression)

### Kit Gaps
- None. Uses `code-trace` (`kits/video/code-trace/`), which provides all required visualisations for translators (`pipeline`), RAM memory lockers (`ram`), and ALU type casting/precedence (`alu`).
