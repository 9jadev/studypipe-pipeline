---
slug: introduction-to-programming
title: Introduction to Computer Programming — Foundations, Logic, Control Structures, Arrays & Functions
subject: Computer Studies
class: SS1
exams: [WAEC, NECO, JAMB]
lessons: 6
duration_min: 80
version: 1
---

# Multi-Lesson Unit Plan: Introduction to Computer Programming (`introduction-to-programming`)

---

## Part I: Unit Welcome Hub (`html/index.html`)

### 1. Hero & 3D Hero Lab
- **Eyebrow:** `SS1 COMPUTER STUDIES · WAEC · NECO · JAMB · ALGORITHMS & PROGRAMMING`
- **Display title:** Introduction to Computer Programming: *The Ikogosi Smart Grid Detective*
- **Lede:** When an evening storm hits Ikogosi, the community solar microgrid locks down, the health clinic cooler flashes error codes, and smart meters deduct credits backwards. The hardware is fine—the failure is pure code. Trace machine instructions from silicon voltages to high-level Python, master variables, conditionals, loops, arrays, and functions, and repair the software before the power cuts out.
- **CTAs:** `Start guided tour (en-NG) ▷` (`data-tour`) · `Begin Lesson 1 →` (`lessons/lesson-01/index.html`)
- **Hero meta:** `6 lessons · ~8 h` · `6 Interactive Labs + 6 Concept Zooms` · `72 quiz questions + 6 × 30-mark papers` · `WAEC Practical: Flowcharts, Pseudocode & Dry-Run Traces`
- **3D Hero Lab (`#lab-canvas`, `window.StudyLab`):**
  - Interactive **Microcontroller & Memory Stage**:
    - Central Processor Unit (CPU) with Control Unit (CU), Arithmetic Logic Unit (ALU), and Instruction Register.
    - 8-slot Physical RAM rack with visual memory addresses (`0x00`–`0x07`), value registers, and floating data packets.
    - Three HUD Modes:
      - `high-level`: Select or edit a high-level statement (e.g. `energy = units * 68.0`); watch tokens highlight and parse.
      - `assembly-machine`: See the statement disassembled into assembly mnemonics (`LOAD`, `MULT`, `STORE`) and 8-bit binary voltage levels (`10110001`).
      - `memory-slots`: Watch variable containers allocate in RAM, seeing how integers, floats, strings, and booleans occupy memory blocks.
    - HUD readouts: Active Program Counter (PC), Accumulator register, Memory Bus state, Clock Cycle counter.

### 2. Marquee (12 terms)
Program · Machine Code · High-Level Language · Compiler vs Interpreter · Variable & Constant · Data Types · Boolean Logic · Conditional Branching (`IF`) · Iteration (`FOR`/`WHILE`) · Array Indexing (`0..N-1`) · Function & Scope · Dry-Run Trace Table

### 3. Unit Mystery Case File (`#mystery`)
- **Narrative:** In Ikogosi, Ekiti State, an automated community solar microgrid controls electricity distribution to the local cottage hospital, cold vaccine store, and 250 households. At 18:00 during a rainstorm, the backup diesel generator fails to start despite batteries dropping below 15%, the vaccine refrigerator enters an error loop (`Error 0x7E: Array Index Out of Range`), and the billing service charges ₦15,020 instead of ₦170 for a 20-unit recharge. The village council chairman wants to disconnect the expensive hardware. Amina and Tari connect their terminal to debug the software logic and prove the hardware is undamaged.
- **Realism note:** Modern microgrids, inverters, and telecom base stations across Nigeria run embedded microcontrollers (C/C++ or MicroPython) following these exact sequential, conditional, loop, and array control routines.
- **Clue cards:**
  - *Clue 1 (Data Types):* The sensor reading `"150"` was read as text string, so `"150" + 20` evaluated to `"15020"` rather than `170`.
  - *Clue 2 (Boolean Condition):* The generator trigger evaluated `battery < 20 AND grid_online` instead of `battery < 20 AND NOT grid_online`.
  - *Clue 3 (Runaway Loop):* A `WHILE` loop monitoring solar irradiance omitted the sensor increment step, causing an infinite loop that exhausted microcontroller memory.
  - *Clue 4 (Array Boundary):* The cell monitor scanned 8 lithium batteries from index `0` to `8`, crashing on index `8` because valid indices are `0..7`.
- **Exam-weight stats:**
  - `WAEC SSCE`: Computer programming, translators, flowcharts, and algorithms account for up to 35% of Paper 1 and Paper 2.
  - `WAEC Paper 3 / Practical`: Algorithm tracing, flowchart construction, and debugging appear consistently.
  - `JAMB UTME`: 10–12 questions annually test data types, operator precedence, loop outputs, array index math, and logic gates.

### 4. Lesson Journey (`#journey`)
Six cards linking to `lessons/lesson-01/` … `lesson-06/`, each with duration (80 min), key tags, and core mystery milestone. Spaced retrieval connects every lesson's Do Now to preceding lessons.

### 5. Explorer, Archetypes, Myths, Method
- **Interactive Concept Explorer (4 Tabs with SVG Curve & Visualizer):**
  1. *Language Abstraction Ladder:* Visual slider from Machine Code (raw binary switches) → Low-Level Assembly (hardware mnemonics) → High-Level Code (human-readable English statements).
  2. *Variable Memory Box:* Visual container showing variable name, data type tag, allocated memory address, and stored value.
  3. *Control Flow Pathways:* Animated diagram showing Sequential linear execution vs Conditional fork (`IF-ELSE`) vs Looping cycle (`WHILE`/`FOR`).
  4. *Array Contiguous Grid:* 8-cell memory locker grid demonstrating zero-based index math ($\text{index} = 0 \dots \text{length}-1$).
- **6 Computational Calculation Archetypes (`#archetypes`):**
  1. *Operator Precedence & Integer Arithmetic:* `result = 15 + 4 * 2 - (8 / 4)` and modulus `17 % 5 = 2`.
  2. *Data Type Casting & String Formatting:* Converting `str(150)` to `int("150")` and calculating `150 + 20 = 170`.
  3. *Compound Boolean Truth Evaluation:* Evaluating `(A AND B) OR (NOT C)` for sensor inputs.
  4. *Loop Counter & Accumulator Math:* Tracking `for i in range(1, 6): total += i` step-by-step ($1+2+3+4+5 = 15$).
  5. *Array Bounds & Index Offsets:* Calculating array length, first index `0`, last index `len - 1`, and step traversals.
  6. *Function Return & Scope Mapping:* Resolving `return (val * 1.075) + fee` with local vs global variable isolation.
- **3 Myth-Buster 3D Flip Cards (`#myths`):**
  1. *"Computers understand human words directly."* — Computers only process high/low electrical voltages (binary 0 and 1). All high-level languages must be translated by compilers or interpreters.
  2. *"An array of size 10 has an element at index 10."* — In zero-based indexing, a 10-item array spans indices `0` to `9`. Accessing index `10` causes an `IndexOutOfBounds` crash.
  3. *"Variables declared inside a function can be read anywhere in the program."* — Variables defined inside a function have local scope; they exist only while that function executes.
- **Method (`#method`):** 5-step inquiry arc (`0. Do Now → 1. Wonder → 2. Investigate → 3. Make sense → 4. Apply → 5. Reflect & Assignment`) · What's inside every lesson (`#kit`) · CTA to Lesson 1.

### 6. Spaced Retrieval Bank (`assets/js/retrieval-bank.js`)
`l01` … `l06`, each with `donow` (4 flashcards with `from`), `quiz` (6 interactive MCQs), and `recall` arrays. Do Now cards for Lessons 2–6 provide one-tap *"Revisit Lesson X →"* links to prior lessons.

---

## Part II: The Six Lessons

---

### LESSON 01: From Logic to Code — Programming Languages, Translators & Memory Variables
- **Folder:** `html/lessons/lesson-01/` · **Duration:** 80 min · **Competences:** L1, L4, L5
- **Guiding question:** How does a computer convert human instructions into physical machine action, and how does it store information?
- **Objectives:**
  1. **01** · Define a computer program and explain the concept of programming.
  2. **02** · Differentiate between machine language, low-level assembly language, and high-level languages.
  3. **03** · Compare compilers and interpreters (whole program vs line-by-line translation).
  4. **04** · Identify standard data types (integer, float, string, boolean) and distinguish variables from constants.
  5. **05** · Declare and assign variables in Python and BASIC, and resolve data type mismatch errors.

#### 0. Warm-up · Do Now (5 min, `from: 0`)
1. **Q:** What are the two binary digits used by digital computers, and what physical states do they represent? **A:** The digits are **0** and **1**, representing low voltage (off/0 V) and high voltage (on/+3.3 V or +5 V).
2. **Q:** In basic algebra, if $x = 15$ and $y = 4$, evaluate the expression $z = (2 \times x) + y$. **A:** $z = (2 \times 15) + 4 = 30 + 4 = \mathbf{34}$.
3. **Q:** What is the primary function of computer RAM? **A:** **Random Access Memory (RAM)** temporarily holds active program instructions and data currently being processed by the CPU; it is volatile memory.
4. **Q:** Convert the integer 13 into a 4-bit binary number. **A:** $13 = 8 + 4 + 0 + 1 = \mathbf{1101_2}$.

#### 1. Wonder (8–10 min)
- **3D Story Scene (`StoryStage`):**
  - Beat 1: Ikogosi Microgrid control room; thunder rumbles as Amina and Tari boot the maintenance terminal.
  - Beat 2: Amina plugs the serial cable into the solar controller box; the status screen flashes `SYSTEM ERROR: TypeError: can only concatenate str to str`.
  - Beat 3: Tari reads the code on screen: `total_power = "150" + 20`. He wonders why a computer with billions of transistors cannot add 150 and 20.
  - Beat 4: Amina points out quotation marks: the computer sees `"150"` as textual letters, not a number!
  - Beat 5: Chief Babatunde enters with a multimeter, worrying the solar inverter has burned out. Amina promises to trace the software logic.
- **Wonder Wall:**
  - *Prompt:* Why does writing `"50"` with quotes behave completely differently from writing `50` without quotes inside a computer program?
  - *Student Predictions:* (1) Quotes tell the computer to treat digits as text rather than a mathematical quantity; (2) Adding text strings joins them together instead of calculating a sum; (3) Computers lack common sense and follow exact data type definitions; (4) The computer needs a translator to convert text into binary numbers.

#### 2. Investigate (25 min)
- **Interactive Sort Game (`#sort`, `sort-dnd.js`):**
  Sort 9 programming items into three category bins:
  - *High-Level Languages:* Python, BASIC, Java, C++.
  - *Language Translators:* Compiler, Interpreter, Assembler.
  - *Low-Level Code:* Machine Language (binary 0s and 1s), Assembly Language (mnemonics like `MOV`, `ADD`).
- **Interactive Lab Bench (`#bench-stage` — Variable & Memory Allocation Simulator):**
  - Apparatus: 3D Memory Shelf with 6 labeled memory addresses (`0x01`–`0x06`), Data Type selector (int, float, str, bool), and Value input field.
  - Student Activity:
    1. Allocate variable `voltage = 230` (Type: Integer, 2 bytes). Watch it occupy address `0x01`.
    2. Allocate variable `tariff = 68.5` (Type: Float, 4 bytes). Watch it occupy address `0x02`.
    3. Allocate variable `location = "Ikogosi"` (Type: String, 7 bytes). Watch it span contiguous bytes.
    4. Test the string concatenation trap: enter `a = "150"` and `b = 20`. Click **Execute `a + b`**. The bench flags `TypeError: Mismatched types (string + integer)`.
    5. Apply type casting: enter `int(a) + b`. Click **Execute**. The bench outputs `170`.
  - Results Table: Variable Name, Declared Type, Memory Address, Raw Value, Memory Size.
  - Analysis Questions (`.aq`):
    - *AQ1:* What happened when attempting to add `"150"` and `20` without type casting?
    - *AQ2:* Why does an integer take less memory than a string containing the same digits?
    - *AQ3:* In the past tense, state how you resolved the data type error on the virtual bench.

#### 3. Make Sense (15 min)
- Formal definitions: Program, Source Code, Machine Code, Translators.
- Comparison Table: **Compiler vs. Interpreter** (Table comparing input, execution speed, error detection, output file, and example languages: Python vs C/Java).
- Code Structure Callout: Variable declaration rules (must start with letter or underscore, no spaces, cannot use reserved keywords).
- **Concept Zoom Stage (`#zoom-stage` — The Translation Pipeline):**
  Interactive zoom demonstrating how `total = units * 68` is converted by an interpreter line-by-line vs a compiler in one pass, showing the binary instruction stream delivered to the CPU bus.

#### 4. Apply (20 min)
- **Worked Examples (`StudyMath` & `StudyCode`):**
  - *Example 1.1:* Writing an airtime recharge bonus script in Python and BASIC:
    ```python
    recharge = 1000
    bonus_rate = 0.15
    bonus_amount = recharge * bonus_rate
    total_credit = recharge + bonus_amount
    print("Total Airtime: N" + str(total_credit))
    ```
    Includes line-by-line `.code-step-note` and variable watch table.
  - *Example 1.2:* Type conversion problem: Given `units_str = "85"`, convert to integer, multiply by tariff ₦68, and calculate VAT at 7.5%.
- **The Bridge Challenge (`#bridge`):**
  Amina opens the Ikogosi solar sensor script `sensor_log.py`. Fix 3 syntax and data type bugs to allow the sensor to log power output correctly.
- **Instant Quiz (`#quiz`):** 6 original WAEC/JAMB-style MCQs with detailed explanations.

#### 5. Reflect & Assignment (10 min + 40 min home)
- Self-assessment rubric (1–4) across 5 core criteria.
- Exit ticket: Explain the difference between `x = 5` and `x = "5"`.
- Blank-page recall (`#recall-box`).
- **Home Assignment:**
  - *Part A (Practical Investigation):* Inspect an electricity bill or airtime recharge receipt at home. Identify 3 variables (e.g. meter number, units consumed, tariff rate) and specify their appropriate programming data types.
  - *Part B (30-Mark Exam Paper):* Structured WAEC-style questions on language translators, variable naming rules, and flowchart symbols with model solutions.
- **Teacher Notes:** 80-minute schedule with 5-minute movement break at minute 45.

---

### LESSON 02: Making Decisions — Conditional Logic, Boolean Operators & Branching
- **Folder:** `html/lessons/lesson-02/` · **Duration:** 80 min · **Competences:** L1, L4, L5
- **Guiding question:** How does an automated system or ATM decide what action to take when conditions change?
- **Objectives:**
  1. **01** · Construct boolean expressions using relational operators (`==`, `!=`, `>`, `<`, `>=`, `<=`).
  2. **02** · Evaluate compound conditions using logical operators (`AND`, `OR`, `NOT`) and truth tables.
  3. **03** · Implement single-alternative (`IF`), dual-alternative (`IF-ELSE`), and multi-alternative (`IF-ELIF-ELSE`) branching structures.
  4. **04** · Draw flowchart decision diamonds with correctly labeled `True`/`False` exit branches.
  5. **05** · Debug conditional logic errors in automated switching systems.

#### 0. Warm-up · Do Now (5 min, `from: 1`)
1. **Q:** What data type results from evaluating the expression `45 > 30`? **A:** A **Boolean** (`bool`), which evaluates to `True`.
2. **Q:** Why does `x = 10` differ from `x == 10` in programming? **A:** `x = 10` is an **assignment** statement storing 10 in variable `x`; `x == 10` is an **equality comparison** evaluating whether `x` equals 10.
3. **Q:** In Python, what is the output of `type("250.5")`? **A:** `<class 'str'>` (string), because of the quotation marks.
4. **Q:** Revisit Lesson 1: Which translator converts the entire source code into machine code before running: a compiler or an interpreter? **A:** A **compiler**.

#### 1. Wonder (8–10 min)
- **3D Story Scene (`StoryStage`):**
  - Beat 1: Dark rain clouds gather over Ikogosi; the microgrid battery voltage sinks to 18%.
  - Beat 2: Tari notices the diesel generator remains silent despite the low battery level.
  - Beat 3: Amina opens `generator_control.py` and inspects line 14: `if battery_level < 20 and grid_power_active == True: start_generator()`.
  - Beat 4: Tari gasps: "It only starts if the grid power is *active*! But in a blackout, the grid is *down*!"
  - Beat 5: Chief Babatunde notes that the emergency clinic lights are flickering. The logical condition must be inverted immediately.
- **Wonder Wall:**
  - *Prompt:* How does a single logical word (`AND` vs `OR` vs `NOT`) change whether an emergency machine starts or stays off?

#### 2. Investigate (25 min)
- **Interactive Sort Game (`#sort`):**
  Sort 8 expressions into `Evaluates to True` vs `Evaluates to False` (e.g., `(10 > 5) and (3 == 3)`, `not (4 < 2)`, `(8 == 9) or (5 > 10)`).
- **Interactive Lab Bench (`#bench-stage` — Logic Gate & Decision Switchboard):**
  - Apparatus: Interactive dual-sensor control board with inputs for `Battery Level` (slider: 0–100%) and `Mains Grid Status` (toggle: Online/Offline).
  - Logic gate routing: Connect sensor signals through `AND`, `OR`, and `NOT` gates to the Generator Relay output.
  - Table of Readings: Test 5 combinations of battery level and grid status, recording output relay state (`ON` or `OFF`).
  - Analysis Questions: Formulate the exact boolean expression needed to safeguard the health clinic.

#### 3. Make Sense (15 min)
- Formal definitions: Relational operators, Boolean logic, Branching (`IF-THEN-ELSE`).
- Logic Truth Tables: Comprehensive tables for `AND`, `OR`, and `NOT`.
- Flowchart Decision Conventions: Diamond symbol rules, mutually exclusive paths.
- **Concept Zoom Stage (`#zoom-stage` — Decision Tree Visualizer):**
  Interactive tree showing multi-way selection (`IF-ELIF-ELSE`) evaluating candidate JAMB scores into university admission categories.

#### 4. Apply (20 min)
- **Worked Examples:**
  - *Example 2.1:* ATM cash withdrawal validation algorithm:
    ```python
    account_balance = 25000
    requested_amount = 10000
    daily_limit = 20000

    if requested_amount > account_balance:
        print("Error: Insufficient funds.")
    elif requested_amount > daily_limit:
        print("Error: Exceeds daily withdrawal limit.")
    else:
        account_balance -= requested_amount
        print("Dispensing N" + str(requested_amount))
        print("Remaining Balance: N" + str(account_balance))
    ```
    Includes `StudyCode` execution tracer and step-by-step state notes.
  - *Example 2.2:* NEPA Band tariff selection based on daily hours of electricity supply.
- **The Bridge Challenge (`#bridge`):**
  Repair the generator trigger script in `generator_control.py` by implementing correct boolean operators.
- **Instant Quiz (`#quiz`):** 6 original WAEC/NECO questions on conditional branches and truth tables.

#### 5. Reflect & Assignment (10 min + 40 min home)
- Self-assessment, exit ticket, recall box, Home Assignment (Part A: flowchart of ATM pin verification; Part B: 30-mark exam paper).

---

### LESSON 03: The Power of Repetition — Counter & Conditional Loops
- **Folder:** `html/lessons/lesson-03/` · **Duration:** 80 min · **Competences:** L1, L4, L5
- **Guiding question:** Why write hundreds of lines of code when three lines can automate repetitive tasks thousands of times?
- **Objectives:**
  1. **01** · Explain the purpose of iteration and identify tasks requiring loop structures.
  2. **02** · Construct counter-controlled loops (`FOR` loops with step, start, and stop parameters).
  3. **03** · Construct condition-controlled loops (`WHILE` loops) and guarantee loop termination.
  4. **04** · Implement the accumulator pattern (`total = total + value`) to calculate sums and averages.
  5. **05** · Detect and resolve infinite loop bugs in automated software systems.

#### 0. Warm-up · Do Now (5 min, `from: 2`)
1. **Q:** What is the output of `not (True and False)`? **A:** `True` (since `True and False` is `False`, `not False` is `True`).
2. **Q:** In an `if-elif-else` statement, how many code blocks can execute? **A:** At most **one** block executes; once a condition is met, subsequent branches are skipped.
3. **Q:** Revisit Lesson 1: Which data type would you use to store a student's examination percentage score of 78.4%? **A:** **Float** (floating-point number).
4. **Q:** Evaluate `(12 % 5) + 3`. **A:** `12 % 5 = 2` (remainder of 12 divided by 5); `2 + 3 = \mathbf{5}`.

#### 1. Wonder (8–10 min)
- **3D Story Scene (`StoryStage`):**
  - Beat 1: The terminal processor fans spin at maximum speed; the system memory usage creeps towards 99%.
  - Beat 2: Tari notices that the log console is scrolling millions of identical messages: `Checking solar array 1... Checking solar array 1...`.
  - Beat 3: Amina investigates `solar_monitor.py` line 22: `while solar_output > 0: print("Active")`.
  - Beat 4: Tari exclaims: "The variable `solar_output` never changes inside the loop! It's stuck in an infinite cycle!"
  - Beat 5: Chief Babatunde asks how to ensure the computer checks each panel once and stops cleanly.
- **Wonder Wall:**
  - *Prompt:* What prevents a computer loop from running forever and draining battery or processor resources?

#### 2. Investigate (25 min)
- **Interactive Sort Game (`#sort`):**
  Classify 8 computational scenarios into `Use FOR Loop (Counted)` vs `Use WHILE Loop (Conditional)` (e.g. print numbers 1 to 50, read sensor until temperature drops below 25°C).
- **Interactive Lab Bench (`#bench-stage` — Iterative Loop Stepper):**
  - Apparatus: 3D Mechanical Counter Stepper with interactive gear wheels, Loop Type selector (`FOR` vs `WHILE`), condition parameters, and Step Execution buttons.
  - Student Activity:
    1. Set up a `FOR i IN RANGE(1, 6)` loop with an accumulator `sum = sum + i`.
    2. Step forward line-by-line: record variable `i`, accumulator `sum`, and condition status in the results table.
    3. Simulate an infinite loop: configure `WHILE count < 5` without incrementing `count`. Watch the watchdog timer trigger an emergency interrupt!
  - Results Table: Step Number, Line Number, Loop Counter `i`, Accumulator `sum`, Condition Evaluated.
  - Analysis Questions: Why did the accumulator sum increase with each step? What statement was essential to prevent the loop from freezing?

#### 3. Make Sense (15 min)
- Formal definitions: Iteration, Counter, Accumulator, Sentinel Value, Infinite Loop.
- Flowchart Looping Constructs: Backward loop pathways with decision diamonds.
- Python vs BASIC Loop Syntax: `for i in range(start, stop, step)` vs `FOR I = 1 TO N STEP S ... NEXT I`.
- **Concept Zoom Stage (`#zoom-stage` — Execution Step Tracer):**
  Animated timeline tracing execution flow jump backwards from the end of the loop block to the loop condition header.

#### 4. Apply (20 min)
- **Worked Examples:**
  - *Example 3.1:* Accumulating daily power output from 7 solar arrays:
    ```python
    daily_readings = [45, 52, 60, 58, 49, 63, 55]
    total_kwh = 0

    for reading in daily_readings:
        total_kwh += reading

    average_kwh = total_kwh / len(daily_readings)
    print("Total Generation: " + str(total_kwh) + " kWh")
    print("Average Generation: " + str(round(average_kwh, 2)) + " kWh")
    ```
    Includes `StudyCode` step tracer and line notes.
  - *Example 3.2:* Countdown loop for diesel generator warm-up timer.
- **The Bridge Challenge (`#bridge`):**
  Rewrite `solar_monitor.py` to replace the broken `while` loop with a safe, bounded iteration across all solar arrays.
- **Instant Quiz (`#quiz`):** 6 original WAEC questions testing loop traces and outputs.

#### 5. Reflect & Assignment (10 min + 40 min home)
- Self-assessment rubric, exit ticket, recall box, Home Assignment (Part A: hand-trace table for a nested loop; Part B: 30-mark exam paper).

---

### LESSON 04: Organising Data — Arrays, Collections & Indexing
- **Folder:** `html/lessons/lesson-04/` · **Duration:** 80 min · **Competences:** L1, L4, L5
- **Guiding question:** How does a system track readings from 50 solar panels or 100 students without creating 100 separate variables?
- **Objectives:**
  1. **01** · Explain the concept of an array/list as a contiguous ordered collection of data elements.
  2. **02** · Access, update, and manipulate array elements using zero-based indexing (`0..N-1`).
  3. **03** · Calculate the relationship between array length, maximum valid index, and off-by-one errors.
  4. **04** · Traverse arrays using loops to search for values and find maximum/minimum elements.
  5. **05** · Resolve `IndexError / Out of Bounds` runtime exceptions in software applications.

#### 0. Warm-up · Do Now (5 min, `from: 3`)
1. **Q:** What values does `range(1, 5)` generate in Python? **A:** The integers `1, 2, 3, 4` (stops before 5).
2. **Q:** If a loop runs with `count = 0` and increments `count += 2` while `count < 10`, how many times does it execute? **A:** **5 times** (for values 0, 2, 4, 6, 8).
3. **Q:** Revisit Lesson 2: What is the truth value of `(5 > 2) and (10 < 4)`? **A:** `False` (since `10 < 4` is `False`).
4. **Q:** Revisit Lesson 1: What is the output of `print("Score: " + str(95))`? **A:** `Score: 95`.

#### 1. Wonder (8–10 min)
- **3D Story Scene (`StoryStage`):**
  - Beat 1: An alarm sounds at the Ikogosi Clinic; Dr. Folake warns that the vaccine refrigerator temperature sensor is offline.
  - Beat 2: Amina looks at the clinic telemetry dashboard: `Fatal Error: IndexError: list index out of range at line 34`.
  - Beat 3: Tari checks line 34 in `battery_check.py`: `for i in range(1, 9): check_cell(battery_cells[i])`.
  - Beat 4: Amina exclaims: "There are 8 battery cells in the rack! In zero-based indexing, their indices are 0 to 7! When `i` reaches 8, the program crashes!"
  - Beat 5: Chief Babatunde realizes: "So the 8th battery was never checked, and asking for index 8 crashed the whole clinic cooling unit!"
- **Wonder Wall:**
  - *Prompt:* Why do computer scientists start counting at zero instead of one, and why does this cause the most common bugs in software?

#### 2. Investigate (25 min)
- **Interactive Sort Game (`#sort`):**
  Match array operations to their outcomes (e.g. `items[0]`, `items[-1]`, `len(items)`, `items.append()`).
- **Interactive Lab Bench (`#bench-stage` — Contiguous Array Locker Rack):**
  - Apparatus: 8-slot physical memory locker rack (`Index 0` through `Index 7`), Pointer indicator needle, Data input panel, and Index dial.
  - Student Activity:
    1. Populate the 8 lockers with voltage readings: `[3.2, 3.3, 3.1, 3.2, 3.4, 3.0, 3.3, 3.2]`.
    2. Dial `Index = 0`: watch pointer target the first locker containing `3.2 V`.
    3. Dial `Index = 7`: watch pointer target the eighth locker containing `3.2 V`.
    4. Dial `Index = 8`: click **Read**. The bench triggers an animated boundary alarm: `IndexOutOfBoundsException: Index 8 is out of range for length 8`!
    5. Modify index bounds to `0..7` and run the automated battery health scan.
  - Results Table: Slot Position (1st–8th), Array Index (0–7), Stored Reading, Status.
  - Analysis Questions: Write out the mathematical formula linking array length $N$ to the maximum valid index.

#### 3. Make Sense (15 min)
- Formal definitions: Array, List, Element, Index, Contiguous Memory, Offset Model.
- Zero-Based Indexing Architecture: Explanation of memory pointer offsets ($\text{Address} = \text{Base} + (\text{Index} \times \text{Size})$).
- Array Traversal Patterns: Linear search and finding maximum/minimum values.
- **Concept Zoom Stage (`#zoom-stage` — The Memory Offset Inspector):**
  Visual microscope zooming into RAM showing why index 0 corresponds to zero byte offset from the array's base address.

#### 4. Apply (20 min)
- **Worked Examples:**
  - *Example 4.1:* Finding the lowest battery cell voltage in an array:
    ```python
    cells = [3.25, 3.18, 3.30, 2.95, 3.22, 3.15, 3.28, 3.20]
    min_voltage = cells[0]
    min_index = 0

    for i in range(len(cells)):
        if cells[i] < min_voltage:
            min_voltage = cells[i]
            min_index = i

    print("Weakest Cell: Cell " + str(min_index + 1))
    print("Voltage: " + str(min_voltage) + " V")
    ```
    Includes `StudyCode` step trace and variable watch table.
  - *Example 4.2:* Calculating average student score from a list of test marks.
- **The Bridge Challenge (`#bridge`):**
  Patch `battery_check.py` to fix the loop boundary condition and restore live monitoring to the vaccine refrigerator.
- **Instant Quiz (`#quiz`):** 6 original WAEC/JAMB questions testing array indexing and boundary conditions.

#### 5. Reflect & Assignment (10 min + 40 min home)
- Self-assessment rubric, exit ticket, recall box, Home Assignment (Part A: dry run of an array reversal algorithm; Part B: 30-mark exam paper).

---

### LESSON 05: Modular Architecture — Functions, Scope & Reusability
- **Folder:** `html/lessons/lesson-05/` · **Duration:** 80 min · **Competences:** L1, L4, L5, L6
- **Guiding question:** How do developers build complex software systems without repeating the same calculations dozens of times?
- **Objectives:**
  1. **01** · Define a function (subroutine) and explain the software engineering principle of DRY (Don't Repeat Yourself).
  2. **02** · Differentiate between function definition, parameters (arguments), and return values.
  3. **03** · Explain and trace the difference between local variable scope and global variable scope.
  4. **04** · Design modular functions that accept inputs, perform processing, and return validated outputs.
  5. **05** · Refactor repetitive, error-prone procedural code into structured, modular routines.

#### 0. Warm-up · Do Now (5 min, `from: 4`)
1. **Q:** If an array `scores` contains 6 numbers, what is the index of the last element? **A:** `5` ($\text{Index} = 6 - 1 = 5$).
2. **Q:** What built-in function returns the number of elements in a list? **A:** `len()`.
3. **Q:** Revisit Lesson 3: What happens if a loop's condition never becomes `False`? **A:** It forms an **infinite loop**, freezing or crashing the program.
4. **Q:** Revisit Lesson 1: Why does `a = "10"` and `b = "20"` result in `a + b == "1020"`? **A:** The `+` operator **concatenates** (joins) text strings instead of performing mathematical addition.

#### 1. Wonder (8–10 min)
- **3D Story Scene (`StoryStage`):**
  - Beat 1: Village elders gather outside the microgrid station; household smart meters are miscalculating electricity bills.
  - Beat 2: Amina examines `billing.py`: the exact same 15-line tariff calculation is copy-pasted 12 different times across the file.
  - Beat 3: Tari spots a discrepancy: "In one copy, the VAT rate is set to 7.5%, but in three other copies, an old rate of 5% was left untouched!"
  - Beat 4: Amina points out a variable name conflict: a variable named `total` inside a calculation overwrote the global `total_revenue` variable!
  - Beat 5: Amina announces: "We need a single, clean function with isolated local scope. If we update the function once, all 250 meters will be fixed instantly!"
- **Wonder Wall:**
  - *Prompt:* How does packaging code into independent functions protect variables from interfering with each other?

#### 2. Investigate (25 min)
- **Interactive Sort Game (`#sort`):**
  Categorize 8 code components into `Function Header / Parameters`, `Function Body / Local Logic`, and `Return Statement / Caller`.
- **Interactive Lab Bench (`#bench-stage` — The Modular Function Factory):**
  - Apparatus: 3D Function Transformation Core with Parameter Input Chutes (`Units`, `Tariff Band`), Internal Processing Chamber, and Return Value Output Conveyor.
  - Student Activity:
    1. Pass `units = 120` and `band = "A"` into the function hopper.
    2. Step inside the function chamber: watch local variables `base_cost`, `vat`, and `net_bill` calculate in isolated local memory.
    3. Inspect the Global Memory display: verify that global variables remain completely unaffected by internal local variables.
    4. Click **Return Value**: watch the final bill amount pass back to the calling script.
  - Results Table: Input Arguments, Local Variables Allocated, Return Value, Global Scope State.
  - Analysis Questions: Why did modifying the local variable `discount` inside the function have zero effect on the global variable of the same name?

#### 3. Make Sense (15 min)
- Formal definitions: Function, Subroutine, Argument/Parameter, Return Value, Scope (Global vs Local).
- The "One-Way Glass" Analogy of Variable Scope: Code inside a function can see outward to global constants, but code outside cannot peek into or tamper with local function variables.
- Modularity & Abstraction: Writing testable, reusable black-box routines.
- **Concept Zoom Stage (`#zoom-stage` — Stack Frame Lifetime):**
  Visual stack frame showing how local function memory is created when called and cleanly destroyed when the function returns.

#### 4. Apply (20 min)
- **Worked Examples:**
  - *Example 5.1:* Writing a modular microgrid tariff calculator function:
    ```python
    def calculate_nepa_bill(units, tariff_rate=68.0, vat_rate=0.075):
        energy_cost = units * tariff_rate
        vat_amount = energy_cost * vat_rate
        fixed_charge = 1500.0
        total_bill = energy_cost + vat_amount + fixed_charge
        return round(total_bill, 2)

    household_1 = calculate_nepa_bill(85)
    household_2 = calculate_nepa_bill(210)
    print("Meter 101 Bill: N" + str(household_1))
    print("Meter 102 Bill: N" + str(household_2))
    ```
    Includes `StudyCode` interactive trace, line notes, and parameter watch.
  - *Example 5.2:* Writing a temperature conversion function ($^\circ\text{F}$ to $^\circ\text{C}$) for the clinic sensor.
- **The Bridge Challenge (`#bridge`):**
  Refactor `billing.py` by replacing repetitive spaghetti code with a single modular function to correct all smart meter deductions.
- **Instant Quiz (`#quiz`):** 6 original WAEC questions on function parameters, return statements, and variable scope.

#### 5. Reflect & Assignment (10 min + 40 min home)
- Self-assessment rubric, exit ticket, recall box, Home Assignment (Part A: design a modular grading function; Part B: 30-mark exam paper).

---

### LESSON 06: Silicon Roots & Exam Clinic — Binary, Hexadecimal, Dry-Run Traces & System Recovery
- **Folder:** `html/lessons/lesson-06/` · **Duration:** 80 min · **Competences:** L1, L4, L5, L6, L7
- **Guiding question:** How do logic gates, truth tables, and hex codes translate to high-level mastery, and how do we ace the WAEC programming paper?
- **Objectives:**
  1. **01** · Convert numbers between decimal, binary, and hexadecimal numbering systems.
  2. **02** · Decode hex machine status codes (such as `0x7E`) and map them to binary flag registers.
  3. **03** · Construct and complete full WAEC examination dry-run trace tables for multi-step algorithms.
  4. **04** · Identify and classify syntax, run-time, and logic errors in given program snippets.
  5. **05** · Integrate all 5 core programming concepts to perform a complete system reboot and solve the unit mystery.

#### 0. Warm-up · Do Now (5 min, `from: 5`)
1. **Q:** What keyword in Python is used to define a reusable function? **A:** `def`.
2. **Q:** What happens to variables created inside a function after the function finishes executing? **A:** They are **destroyed** (deallocated from memory) because they have local scope.
3. **Q:** Revisit Lesson 4: If `arr = [10, 20, 30, 40]`, evaluate `arr[1] + arr[3]`. **A:** `arr[1] = 20`, `arr[3] = 40`; `20 + 40 = \mathbf{60}`.
4. **Q:** Revisit Lesson 2: Write the boolean negation of `temperature >= 35`. **A:** `temperature < 35`.

#### 1. Wonder (8–10 min)
- **3D Story Scene (`StoryStage`):**
  - Beat 1: The rain subsides over Ikogosi; the microgrid central console displays `SYSTEM STATUS: READY FOR REBOOT`.
  - Beat 2: Amina and Tari verify their patched code modules: variables fixed, conditionals corrected, loops bounded, arrays indexed, and functions modularized.
  - Beat 3: The system prompts for a master authentication parity check: decode hex status `0x7E` into an 8-bit binary register to unlock the central inverter switch.
  - Beat 4: Tari works out the binary conversion: $7 = 0111_2$ and $E = 1110_2$, giving byte `01111110`.
  - Beat 5: Amina executes the master boot script; the high-voltage relays click on, floodlights illuminate the town square, and steady power is restored to the clinic and school!
- **Wonder Wall:**
  - *Prompt:* How does mastering high-level code together with low-level binary representations make you an invincible software problem solver?

#### 2. Investigate (25 min)
- **Interactive Sort Game (`#sort`):**
  Sort 9 programming bugs into their correct diagnostic categories:
  - *Syntax Errors:* Missing colon, unmatched parenthesis, misspelled keyword (`whle`).
  - *Run-Time Errors:* `ZeroDivisionError`, `IndexError: out of range`, `TypeError: unsupported operand`.
  - *Logic Errors:* Using `>` instead of `<`, forgetting to increment loop counter, inverted boolean condition.
- **Interactive Lab Bench (`#bench-stage` — Full System Recovery & Trace Console):**
  - Apparatus: 8-bit Silicon Register Flip-Board, Hexadecimal Converter, and Master Dry-Run Trace Terminal.
  - Student Activity:
    1. Toggle the 8-bit register switches to match `0x7E` (`01111110`).
    2. Step through the comprehensive WAEC master trace table containing a loop, conditional branch, array lookup, and accumulator.
    3. Fill in intermediate variable values at each clock tick.
    4. Hit **Authenticate & Boot**. Watch the virtual microgrid sync frequency and power up!
  - Results Table: Full multi-column trace table with Step, Line, Variables (`i`, `val`, `total`, `flag`), and Console Output.
  - Analysis Questions: Explain how the trace table proved the algorithm's correctness before executing it on physical hardware.

#### 3. Make Sense (15 min)
- Low-Level Foundations: Binary (base-2), Hexadecimal (base-16), why hex is used for memory addresses and color codes (`#04AA6D`).
- The 3 Classes of Bugs: Syntax (grammar violation), Run-Time (crashes during execution), Logic (runs but gives incorrect answer).
- WAEC Chief Examiner Marking Schemes for Programming Questions: How marks are awarded for initialization, loop conditions, indentation, and trace tables.
- **Concept Zoom Stage (`#zoom-stage` — The Architecture Bridge):**
  Interactive zoom connecting high-level Python code down to logic gate voltage levels.

#### 4. Apply (20 min)
- **Worked Examples:**
  - *Example 6.1:* WAEC standard algorithm trace table:
    Tracing an algorithm that filters and sums even numbers from an array.
    Step-by-step LaTeX trace table with column tracking and plain-English notes under each row.
  - *Example 6.2:* Number base conversion: Converting `0x4A` to binary and decimal.
- **The Bridge Challenge (`#bridge`):**
  The Final Mystery Resolution: Perform the end-to-end dry run verification of the Ikogosi Microgrid Master Script.
- **Instant Quiz (`#quiz`):** 6 comprehensive exam questions covering the complete unit.

#### 5. Reflect & Assignment (10 min + 40 min home)
- Self-assessment rubric across the entire unit.
- Exit ticket, blank-page recall.
- **Home Assignment:**
  - *Part A (Practical Investigation):* Research how microcontrollers are used in an automated device in your community (e.g. traffic light, POS terminal, solar inverter). List its inputs, decisions, loops, and outputs.
  - *Part B (30-Mark Master Written Paper):* Comprehensive WAEC/NECO/JAMB past-question exam paper with locked model solutions.
- **Teacher Notes:** Comprehensive timetable and transversal competences review.

---

## Part III: Narrator Choreography Plan (`welcome-narration.js` & `narration.js`)

All voice choreography strictly follows the **Nigerian English (`en-NG`)** voice priority standard:
1. **Voice Selection:** Ranked `#1: en-NG` (Google or system Nigerian English), falling back to British English (`en-GB`).
2. **Style & Tone:** Warm, encouraging, authoritative Nigerian teacher voice ("Welcome, scholar!", "Well done, sharp mind!", "Let's inspect the code together!").
3. **Spotlight & Pointer Cues:** Active spotlight targets (`#bench-stage`, `#code-mount`, `#results-table`, `.var-watch`), bouncing cues pointing to specific code lines and variables during stepping.
4. **Interactive "Your Turn!" Waits:** Narrator pauses choreography during the sort game, virtual bench tests, and quiz questions, reacting dynamically to student scores with supportive feedback.

---

## 7. Explainer Video Plan

video_cap: 3

| lesson | score | recommend | reasons | what it covers |
|---|:---:|:---:|---|---|
| lesson-01 | 6 | yes | +2 invisible translation pipeline +2 high exam frequency +2 dynamic code execution | Visualizing the translation pipeline: from Python code to assembly mnemonics to binary electrical voltage pulses in memory containers. |
| lesson-02 | 2 | no | +2 flowchart decision paths +2 compound truth table logic -2 simple condition check | Tracing compound boolean conditions and IF-ELIF-ELSE branches. |
| lesson-03 | 7 | yes | +2 iterative loop visualization +2 high exam frequency +2 infinite loop memory leak +1 accumulator pattern | The mechanical stepper model of loops: watch counter increment, condition check, and accumulator build step-by-step, contrasting with an infinite loop. |
| lesson-04 | 6 | yes | +2 abstract zero-based offset +2 high exam trap +2 contiguous memory allocation | The memory locker offset model: explaining why the first element is index 0 and visualizing off-by-one boundary crashes in memory. |
| lesson-05 | 3 | no | +2 stack frame visualization +2 scope boundary -1 verbal explanation | Functions and scope boundaries. |
| lesson-06 | 4 | no | +2 number base conversion +2 trace table walkthrough | Binary, hex, and dry-run table clinic. |
