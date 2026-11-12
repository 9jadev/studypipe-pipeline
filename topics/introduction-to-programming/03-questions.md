# 03 · Assessment Suite: Introduction to Computer Programming (`introduction-to-programming`)

Six lessons × (12 interactive MCQs for `window.LESSON_QUIZ` + Part A home investigation + Part B 30-mark written paper with model solutions and examiner mark-scheme notes). All stems, algorithms, scenarios, and numbers are 100% original and verified; answers are worked out from computational logic. The checkmark (✓) indicates the correct option.

---

## Lesson 01 · From Logic to Code — Programming Languages, Translators & Variables

### Part 1 · 12 Interactive MCQs (`window.LESSON_QUIZ`)

1. **[WAEC-style · Remember]** A computer program is best defined as:
   - **A.** a set of physical electrical wires inside the CPU
   - **B.** a sequence of logical instructions executed by a computer to perform a specific task ✓
   - **C.** an electronic spreadsheet used for calculating examination results
   - **D.** a collection of computer hardware peripherals
   - *Explanation:* A program is a structured set of coded instructions directing a computer's hardware. A describes circuitry; C describes application software; D refers to hardware devices.

2. **[JAMB-style · Understand]** Which programming language generation is directly executed by the central processing unit without translation?
   - **A.** High-level language (Python)
   - **B.** Assembly language
   - **C.** Machine language (binary 0s and 1s) ✓
   - **D.** Fourth-generation language (SQL)
   - *Explanation:* Machine code consists of raw binary digits (voltage states) and is the only language natively understood by digital hardware without a translator. Assembly requires an assembler; high-level code requires a compiler or interpreter.

3. **[NECO-style · Understand]** Amina writes a script in Python, while Tari compiles a program in C. What is the fundamental difference in how their source code is translated?
   - **A.** Python translates the entire file at once into object code, whereas C interprets line by line.
   - **B.** Python interprets source code line by line at runtime, whereas C compiles the entire code into machine language beforehand. ✓
   - **C.** Python does not require translation to execute on hardware.
   - **D.** C code runs inside a web browser, while Python runs only in binary ROM.
   - *Explanation:* Compilers (C) translate whole programs into standalone executable object files prior to execution; interpreters (Python) translate and execute statements line by line at runtime.

4. **[WAEC-style · Apply]** In Python, evaluate the expression: `total = "200" + "50"`. What is the value and data type of `total`?
   - **A.** 250 (Integer)
   - **B.** "20050" (String) ✓
   - **C.** 20050 (Integer)
   - **D.** Error: Cannot add numbers
   - *Explanation:* Quoted values are string literals. The `+` operator concatenates (joins) textual strings rather than performing arithmetic addition, resulting in `"20050"`.

5. **[JAMB-style · Apply]** Which of the following is a valid variable identifier according to standard high-level programming conventions?
   - **A.** `2nd_score`
   - **B.** `total bill`
   - **C.** `_student_age` ✓
   - **D.** `class`
   - *Explanation:* Variable names cannot begin with digits (A), cannot contain spaces (B), and cannot be reserved language keywords (D). An identifier may begin with an underscore or letter (C).

6. **[WAEC-style · Apply]** Tari declares `voltage = 220.75`. What fundamental data type is assigned to `voltage`?
   - **A.** Integer (`int`)
   - **B.** Floating-point number (`float`) ✓
   - **C.** Character (`char`)
   - **D.** Boolean (`bool`)
   - *Explanation:* Numbers with decimal fractional parts are classified as floating-point numbers (`float`). Integers represent whole numbers.

7. **[WAEC Practical · Analyse]** Amina executes the following code in the solar controller terminal:
   ```python
   units = input("Enter consumed units: ")
   rate = 68
   bill = units * rate
   ```
   If the user types `10`, what does the terminal display?
   - **A.** `680`
   - **B.** `1010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010` (the string "10" repeated 68 times) ✓
   - **C.** `TypeError: cannot multiply`
   - **D.** `0`
   - *Explanation:* In Python, `input()` returns a string. Multiplying a string by an integer repeats the string 68 times. To perform arithmetic, type casting is required: `int(units) * rate = 680`.

8. **[JAMB-style · Remember]** A value in a program that cannot be reassigned or modified during program execution is called a:
   - **A.** variable
   - **B.** literal pointer
   - **C.** constant ✓
   - **D.** operator
   - *Explanation:* A constant stores an immutable data value that remains fixed throughout execution.

9. **[NECO-style · Apply]** What is the result of integer division `19 // 4` in Python?
   - **A.** 4.75
   - **B.** 4 ✓
   - **C.** 3
   - **D.** 5
   - *Explanation:* The integer floor division operator `//` divides and truncates the fractional decimal portion, yielding `4`. `19 % 4 = 3` (the remainder).

10. **[WAEC-style · Understand]** Which language translator halts execution the very instant it encounters a syntax error?
    - **A.** Compiler
    - **B.** Interpreter ✓
    - **C.** Linker
    - **D.** Operating system loader
    - *Explanation:* An interpreter parses line-by-line and halts immediately upon encountering an invalid instruction. Compilers parse the entire program and report all errors together.

11. **[JAMB-style · Apply]** Evaluate the arithmetic expression following standard operator precedence: `result = 12 + 8 * 2 - 6 / 2`.
    - **A.** 17
    - **B.** 25 ✓
    - **C.** 14
    - **D.** 20
    - *Explanation:* Multiplication and division precede addition and subtraction: `8 * 2 = 16` and `6 / 2 = 3`. Then `12 + 16 - 3 = 28 - 3 = 25`.

12. **[WAEC Practical · Analyse]** An SS1 apprentice writes `recharge = 1500; bonus = 0.20; total = recharge + (recharge * bonus)`. What value is stored in `total`?
    - **A.** ₦1,500.00
    - **B.** ₦1,800.00 ✓
    - **C.** ₦300.00
    - **D.** ₦3,000.00
    - *Explanation:* `bonus_amount = 1500 * 0.20 = 300`. `total = 1500 + 300 = 1800`.

---

### Part 2 · Home Investigation & 30-Mark Written Assignment

#### Part A · Practical Home Investigation (Household Data Audit)
- **Task:** Locate two electrical utility or digital service receipts (e.g. an Ikeja/Eko Electric prepaid token receipt and an MTN/Airtel airtime recharge SMS). Identify 5 distinct data items across both documents and classify each into: Identifier Name, Data Type (`int`, `float`, `str`, `bool`), and whether it represents a Variable or Constant.
- **Sample Results Table:**
  | Data Item | Example Value | Proposed Identifier | Data Type | Mutability |
  |---|---|---|---|---|
  | Customer Name | "Babatunde Adeleke" | `customer_name` | String (`str`) | Variable |
  | Meter Number | "45021899321" | `meter_number` | String (`str`) | Constant |
  | Tariff Rate | 68.00 | `tariff_rate` | Float (`float`) | Constant |
  | Units Consumed | 145 | `units_kwh` | Integer (`int`) | Variable |
  | Debt Cleared | True | `is_debt_free` | Boolean (`bool`) | Variable |
- **Marking Guidance:** Award 2 marks for realistic item selection, 2 marks for correct data type classification, 1 mark for valid identifier naming.

#### Part B · 30-Mark Written Examination Paper
- **b1 (4 marks):** Define *computer programming* **(1)** and distinguish between *source code* **(1)** and *object code* **(2)**.
  - *Model Solution:* Computer programming is the process of designing, writing, testing, and maintaining instructions for a computer to execute **(1)**. Source code is human-readable code written in a high-level language **(1)**. Object code is machine-readable binary code generated after translation by a compiler or assembler **(2)**.
- **b2 (4 marks):** State three major differences between a *compiler* and an *interpreter*.
  - *Model Solution:* (1) A compiler translates the entire source code into machine code in one single batch before execution, whereas an interpreter translates and executes instruction line-by-line **(2)**. (2) A compiler produces an independent executable object file (`.exe`), whereas an interpreter does not save object code and requires source code on every run **(1)**. (3) A compiler lists all syntax errors at the end of compilation, whereas an interpreter stops immediately at the first error encountered **(1)**.
- **b3 (4 marks):** Identify whether each identifier is valid or invalid in standard Python, stating the reason: (i) `2nd_test`, (ii) `user_total`, (iii) `for`, (iv) `total-score`.
  - *Model Solution:* (i) Invalid: starts with a digit **(1)**. (ii) Valid: uses letters and underscore **(1)**. (iii) Invalid: reserved keyword **(1)**. (iv) Invalid: contains a hyphen/minus operator **(1)**.
- **b4 (4 marks):** State the exact data type and evaluated result for: (i) `x = 15 > 8`, (ii) `y = "50" + "50"`, (iii) `z = 25 / 2`, (iv) `w = 25 // 2`.
  - *Model Solution:* (i) `bool`, `True` **(1)**; (ii) `str`, `"5050"` **(1)**; (iii) `float`, `12.5` **(1)**; (iv) `int`, `12` **(1)**.
- **b5 (4 marks):** Write a 4-line Python script that prompts the user for their name and birth year, calculates their current age in 2026, and prints: `"Hello [Name], you are [Age] years old."`
  - *Model Solution:*
    ```python
    name = input("Enter your name: ")              # (1)
    birth_year = int(input("Enter birth year: "))   # (1)
    age = 2026 - birth_year                         # (1)
    print("Hello " + name + ", you are " + str(age) + " years old.") # (1)
    ```
- **b6 (4 marks):** Explain what a *type mismatch error* is and demonstrate how to resolve it when adding `cost = "4500"` and `vat = 337.5`.
  - *Model Solution:* A type mismatch error occurs when an operation is attempted on incompatible data types, such as attempting to add a text string and a numeric float **(2)**. It is resolved by casting the string to a numeric float before adding: `total = float(cost) + vat` **(2)**.
- **b7 (3 marks):** Draw the standard flowchart symbols for: (i) Start/Terminal, (ii) Input/Output, (iii) Processing step.
  - *Model Solution:* (i) Oval / Rounded rectangle **(1)**; (ii) Parallelogram **(1)**; (iii) Rectangle **(1)**.
- **b8 (3 marks):** Name two low-level languages and one reason programmers prefer high-level languages.
  - *Model Solution:* Low-level languages: Machine language and Assembly language **(2)**. High-level languages are preferred because they use human-readable English syntax, are easier to debug, and are machine-independent **(1)**.

---

## Lesson 02 · Making Decisions — Conditional Logic & Branching

### Part 1 · 12 Interactive MCQs (`window.LESSON_QUIZ`)

1. **[WAEC-style · Understand]** Which relational operator tests whether two values are strictly equal in Python and C?
   - **A.** `=`
   - **B.** `==` ✓
   - **C.** `:=`
   - **D.** `<>`
   - *Explanation:* `==` is the equality comparison operator. Single `=` is the assignment operator.

2. **[JAMB-style · Apply]** Evaluate the boolean expression: `(15 > 10) and (4 == 9)`.
   - **A.** `True`
   - **B.** `False` ✓
   - **C.** `15`
   - **D.** `Error`
   - *Explanation:* In an `AND` operation, both operands must be true. Since `4 == 9` is `False`, `True and False` evaluates to `False`.

3. **[NECO-style · Apply]** If `x = 8` and `y = 12`, what does `not (x > 10 or y < 15)` evaluate to?
   - **A.** `True`
   - **B.** `False` ✓
   - **C.** `None`
   - **D.** `12`
   - *Explanation:* `x > 10` is `False`. `y < 15` is `True`. `False or True` evaluates to `True`. Applying `not True` gives `False`.

4. **[WAEC-style · Apply]** Examine the conditional block:
   ```python
   score = 72
   if score >= 75:
       grade = "A"
   elif score >= 65:
       grade = "B"
   elif score >= 50:
       grade = "C"
   else:
       grade = "F"
   ```
   What value is assigned to `grade`?
   - **A.** "A"
   - **B.** "B" ✓
   - **C.** "C"
   - **D.** "F"
   - *Explanation:* `score >= 75` is false (72 < 75). The next condition `score >= 65` is true (72 >= 65), so `"B"` is assigned and subsequent branches are skipped.

5. **[WAEC Practical · Analyse]** In the Ikogosi solar microgrid, the backup generator must start only when `battery < 20` percent AND the main grid is offline (`grid_active == False`). Which expression correctly models this condition?
   - **A.** `battery < 20 or grid_active == False`
   - **B.** `battery < 20 and not grid_active` ✓
   - **C.** `not (battery < 20 and grid_active)`
   - **D.** `battery < 20 and grid_active`
   - *Explanation:* Both conditions must hold simultaneously: battery must be critically low (`battery < 20`) AND the grid must be inactive (`not grid_active`).

6. **[JAMB-style · Remember]** In a flowchart, which geometric shape represents a conditional decision point with branching exit paths?
   - **A.** Rectangle
   - **B.** Oval
   - **C.** Diamond (Rhombus) ✓
   - **D.** Parallelogram
   - *Explanation:* The diamond represents a decision point and always has two or more labeled exit arrows (`True`/`False` or `Yes`/`No`).

7. **[NECO-style · Understand]** An `else` statement in a decision structure:
   - **A.** requires an explicit boolean test condition
   - **B.** executes only when all preceding `if` and `elif` conditions evaluate to `False` ✓
   - **C.** executes before the `if` statement
   - **D.** terminates the entire computer operating system
   - *Explanation:* `else` takes no condition; it is a catch-all block that triggers when preceding tests fail.

8. **[WAEC-style · Apply]** What will the following code output?
   ```python
   balance = 5000
   withdrawal = 5000
   if withdrawal <= balance:
       balance -= withdrawal
       print("Dispensed")
   else:
       print("Declined")
   ```
   - **A.** Declined
   - **B.** Dispensed ✓
   - **C.** Error: Zero balance
   - **D.** None
   - *Explanation:* `5000 <= 5000` evaluates to `True`, so `"Dispensed"` is printed.

9. **[JAMB-style · Apply]** In boolean algebra, the expression `A OR (NOT A)` always evaluates to:
   - **A.** `True` (1) ✓
   - **B.** `False` (0)
   - **C.** `A`
   - **D.** Undefined
   - *Explanation:* If $A$ is true, `True or False = True`. If $A$ is false, `False or True = True`. It is a tautology.

10. **[WAEC-style · Understand]** What is the main danger of omitting an `else` branch in an automated control system?
    - **A.** The CPU will overheat
    - **B.** Unanticipated states or invalid input values may bypass control and leave outputs unhandled ✓
    - **C.** The program syntax becomes automatically invalid
    - **D.** Variable names will be erased from RAM
    - *Explanation:* An `else` catch-all guarantees that unexpected or edge-case conditions are safely handled.

11. **[NECO-style · Apply]** If `age = 16` and `has_voters_card = True`, what is the result of `age >= 18 and has_voters_card`?
    - **A.** `True`
    - **B.** `False` ✓
    - **C.** `16`
    - **D.** `SyntaxError`
    - *Explanation:* `age >= 18` is `False`, so the `AND` expression immediately yields `False`.

12. **[WAEC Practical · Analyse]** Amina tests: `if x > 5: print("High") elif x > 2: print("Med") else: print("Low")`. If `x = 10`, what is printed?
    - **A.** High ✓
    - **B.** High followed by Med
    - **C.** Med
    - **D.** Low
    - *Explanation:* In multi-way `elif` structures, once the first matching branch (`x > 5`) executes, the remaining branches are ignored.

---

### Part 2 · Home Investigation & 30-Mark Written Assignment

#### Part A · Practical Home Investigation (Decision Tree Mapping)
- **Task:** Create a decision flowchart for an everyday Nigerian automated or commercial transaction (e.g. an ATM withdrawing ₦20,000, or a mobile phone USSD airtime purchase `*312#`). Map at least three conditional decision diamonds (e.g. "Is PIN correct?", "Is Balance >= Requested?", "Is Daily Limit Exceeded?").
- **Marking Guidance:** Award 2 marks for standard flowchart symbols, 2 marks for mutually exclusive labeled branches (`Yes`/`No`), 1 mark for terminating states.

#### Part B · 30-Mark Written Examination Paper
- **b1 (4 marks):** Distinguish between single-alternative (`IF`), dual-alternative (`IF-ELSE`), and multiple-alternative (`IF-ELIF-ELSE`) branching structures.
  - *Model Solution:* Single-alternative executes a code block only if a condition is true, doing nothing otherwise **(1)**. Dual-alternative provides two paths: one for true, another for false **(1)**. Multiple-alternative tests a sequence of conditions in order until one matches, with an optional catch-all `else` **(2)**.
- **b2 (4 marks):** Construct a complete truth table for the logical expression: $Y = A \text{ AND } (\text{NOT } B)$.
  - *Model Solution:*
    | $A$ | $B$ | $\text{NOT } B$ | $Y = A \text{ AND } (\text{NOT } B)$ |
    |:---:|:---:|:---:|:---:|
    | 0 | 0 | 1 | 0 **(1)** |
    | 0 | 1 | 0 | 0 **(1)** |
    | 1 | 0 | 1 | 1 **(1)** |
    | 1 | 1 | 0 | 0 **(1)** |
- **b3 (4 marks):** Identify the bug in this Python snippet and write the corrected version:
  ```python
  temperature = 38.5
  if temperature = 37.0:
      print("Normal")
  ```
  - *Model Solution:* The bug is using the assignment operator `=` instead of the equality comparison operator `==` in the `if` condition **(2)**. Corrected code:
    ```python
    temperature = 38.5
    if temperature == 37.0: # (2)
        print("Normal")
    ```
- **b4 (4 marks):** Write a Python conditional structure that takes a student's JAMB score and assigns `"Eligible"` if score $\ge 200$, `"Pre-Degree"` if between $160$ and $199$, and `"Not Eligible"` if below $160$.
  - *Model Solution:*
    ```python
    score = int(input("Enter score: ")) # (1)
    if score >= 200:
        print("Eligible")               # (1)
    elif score >= 160:
        print("Pre-Degree")             # (1)
    else:
        print("Not Eligible")           # (1)
    ```
- **b5 (4 marks):** Draw the flowchart for the JAMB score eligibility algorithm specified in question b4.
  - *Model Solution:* Terminal Start oval **(1)** $\to$ Input parallelogram **(1)** $\to$ Decision diamond `score >= 200` with branches **(1)** $\to$ Decision diamond `score >= 160` with branches leading to Output and Terminal End oval **(1)**.
- **b6 (4 marks):** What is *short-circuit evaluation* in boolean expressions? Illustrate with `False and (x / 0 == 1)`.
  - *Model Solution:* Short-circuit evaluation occurs when a programming language evaluates a compound boolean expression from left to right and stops as soon as the outcome is determined without evaluating the remaining operands **(2)**. In `False and (x / 0 == 1)`, because the first operand is `False`, the `AND` expression must be `False`; the division by zero `x / 0` is never evaluated, avoiding a runtime crash **(2)**.
- **b7 (3 marks):** Differentiate between relational operators and logical operators, giving two examples of each.
  - *Model Solution:* Relational operators compare two values (e.g. `>`, `==`, `<=`) **(1.5)**. Logical operators combine or negate boolean truth values (e.g. `AND`, `OR`, `NOT`) **(1.5)**.
- **b8 (3 marks):** Why must nested `if` statements be indented properly in modern languages like Python?
  - *Model Solution:* In languages like Python, indentation defines block scope and hierarchy **(1.5)**. Incorrect indentation leads to `IndentationError` or logic errors where statements execute under the wrong condition **(1.5)**.

---

## Lesson 03 · The Power of Repetition — Counter & Conditional Loops

### Part 1 · 12 Interactive MCQs (`window.LESSON_QUIZ`)

1. **[WAEC-style · Remember]** Which loop structure is best suited for executing a block of code a known, predetermined number of times?
   - **A.** Infinite loop
   - **B.** `FOR` loop (counter-controlled) ✓
   - **C.** `WHILE` loop
   - **D.** `IF-ELSE` branch
   - *Explanation:* A `FOR` loop specifies a definite sequence or count range. `WHILE` loops run until an external condition changes.

2. **[JAMB-style · Apply]** In Python, how many iterations are performed by the loop: `for i in range(2, 10, 2):`?
   - **A.** 8
   - **B.** 4 ✓
   - **C.** 5
   - **D.** 3
   - *Explanation:* The values generated are `2, 4, 6, 8` (stopping before 10). That is exactly 4 iterations.

3. **[NECO-style · Apply]** What is the final value of `total` after executing:
   ```python
   total = 0
   for i in range(1, 5):
       total += i
   ```
   - **A.** 15
   - **B.** 10 ✓
   - **C.** 5
   - **D.** 4
   - *Explanation:* `range(1, 5)` yields `1, 2, 3, 4`. `total = 0 + 1 + 2 + 3 + 4 = 10`.

4. **[WAEC-style · Understand]** An infinite loop occurs when:
   - **A.** the computer runs out of physical disk space
   - **B.** the loop termination condition never evaluates to `False` ✓
   - **C.** the loop contains more than 10 lines of code
   - **D.** the programmer uses integer variables
   - *Explanation:* If the loop condition remains perpetually true (e.g. counter is not updated), execution repeats indefinitely.

5. **[WAEC Practical · Analyse]** Examine the following loop:
   ```python
   count = 1
   while count <= 5:
       print(count)
   ```
   What issue will occur upon execution?
   - **A.** It prints 1 to 5 correctly.
   - **B.** It creates an infinite loop printing `1` endlessly because `count` is never incremented. ✓
   - **C.** It throws a `SyntaxError`.
   - **D.** It prints nothing.
   - *Explanation:* `count` remains 1 forever, so `1 <= 5` remains perpetually true.

6. **[JAMB-style · Apply]** What is printed by this countdown loop?
   ```python
   for k in range(5, 0, -1):
       pass
   print(k)
   ```
   - **A.** 5
   - **B.** 1 ✓
   - **C.** 0
   - **D.** -1
   - *Explanation:* `range(5, 0, -1)` generates `5, 4, 3, 2, 1`. The last assigned value to `k` is 1.

7. **[NECO-style · Remember]** In the accumulator pattern (`sum = sum + x`), what initial value is typically assigned to `sum` before the loop begins?
   - **A.** 1
   - **B.** 0 ✓
   - **C.** 100
   - **D.** -1
   - *Explanation:* The additive identity is 0; initializing to 0 ensures prior memory garbage does not contaminate the sum.

8. **[WAEC-style · Apply]** What is the output of the following nested loop?
   ```python
   for i in range(2):
       for j in range(3):
           print("*", end="")
   ```
   - **A.** `***`
   - **B.** `******` (6 asterisks) ✓
   - **C.** `**`
   - **D.** `*****`
   - *Explanation:* The outer loop runs 2 times; for each iteration, the inner loop runs 3 times: $2 \times 3 = 6$ asterisks.

9. **[JAMB-style · Understand]** Which statement immediately terminates loop execution and transfers control to the statement after the loop?
   - **A.** `continue`
   - **B.** `break` ✓
   - **C.** `pass`
   - **D.** `return`
   - *Explanation:* `break` exits the enclosing loop immediately. `continue` skips only the current iteration.

10. **[WAEC Practical · Analyse]** Tari writes a loop to calculate the average of 4 test scores:
    ```python
    scores = [70, 80, 90, 100]
    total = 0
    for s in scores:
        total += s
    avg = total / len(scores)
    ```
    What is the value of `avg`?
    - **A.** 75.0
    - **B.** 85.0 ✓
    - **C.** 340.0
    - **D.** 90.0
    - *Explanation:* `total = 70 + 80 + 90 + 100 = 340`. `len(scores) = 4`. `340 / 4 = 85.0`.

11. **[NECO-style · Apply]** What does `range(5)` produce in Python?
    - **A.** 1, 2, 3, 4, 5
    - **B.** 0, 1, 2, 3, 4 ✓
    - **C.** 0, 1, 2, 3, 4, 5
    - **D.** 5, 4, 3, 2, 1, 0
    - *Explanation:* A single argument `range(n)` generates integers starting at 0 up to $n-1$.

12. **[WAEC-style · Understand]** What is a *sentinel value* in conditional loops?
    - **A.** A special predetermined input value used to signal the end of data entry and terminate the loop. ✓
    - **B.** The hardware clock speed of the processor.
    - **C.** A variable that counts from 1 to 10.
    - **D.** A syntax error generated by an unclosed loop.
    - *Explanation:* A sentinel (e.g. entering `-1` to finish entering student marks) signals loop termination.

---

### Part 2 · Home Investigation & 30-Mark Written Assignment

#### Part A · Practical Home Investigation (Trace Table Construction)
- **Task:** Perform a manual dry-run trace table on paper for an algorithm that calculates the total amount of fuel consumed by a generator running for 5 hours, consuming 1.5 litres during the first hour and increasing by 0.2 litres each subsequent hour.
- **Trace Table Template:**
  | Iteration (`hour`) | Fuel Added (`rate`) | Accumulator (`total_fuel`) | Condition (`hour <= 5`) |
  |:---:|:---:|:---:|:---:|
  | 1 | 1.5 L | 1.5 L | True |
  | 2 | 1.7 L | 3.2 L | True |
  | 3 | 1.9 L | 5.1 L | True |
  | 4 | 2.1 L | 7.2 L | True |
  | 5 | 2.3 L | 9.5 L | True |
  | Post-loop | — | **9.5 L** | False |
- **Marking Guidance:** Award 3 marks for correct step-by-step variable values, 2 marks for final sum.

#### Part B · 30-Mark Written Examination Paper
- **b1 (4 marks):** Differentiate between counter-controlled loops and condition-controlled loops with examples.
  - *Model Solution:* A counter-controlled loop repeats a specific, known number of times, governed by an index variable (e.g. `for i in range(10)`) **(2)**. A condition-controlled loop executes as long as a boolean condition remains true, where the number of iterations is not known in advance (e.g. `while sensor_val > 0`) **(2)**.
- **b2 (4 marks):** Complete the dry-run trace table for:
  ```python
  p = 1
  for i in range(1, 5):
      p = p * i
  ```
  - *Model Solution:*
    | Step | `i` | Calculation | `p` |
    |:---:|:---:|:---:|:---:|
    | Init | — | — | 1 **(1)** |
    | 1 | 1 | $1 \times 1$ | 1 **(1)** |
    | 2 | 2 | $1 \times 2$ | 2 **(1)** |
    | 3 | 3 | $2 \times 3$ | 6 **(0.5)** |
    | 4 | 4 | $6 \times 4$ | 24 **(0.5)** |
- **b3 (4 marks):** Explain what an *infinite loop* is, give code demonstrating one, and show how to fix it.
  - *Model Solution:* An infinite loop is a loop whose exit condition is never satisfied, causing it to execute without terminating **(1)**.
    ```python
    # Infinite loop
    x = 1
    while x <= 5:
        print(x) # (1)
    ```
    Fix: Increment the control variable inside the loop body:
    ```python
    x = 1
    while x <= 5:
        print(x)
        x += 1   # (2)
    ```
- **b4 (4 marks):** Write a Python program using a `for` loop to compute the sum of all odd integers from 1 to 19 inclusive.
  - *Model Solution:*
    ```python
    total = 0                      # (1)
    for num in range(1, 20, 2):    # (2)
        total += num               # (1)
    print("Sum:", total)
    ```
- **b5 (4 marks):** Explain the difference between `break` and `continue` statements inside a loop.
  - *Model Solution:* `break` terminates the entire loop immediately, jumping to the code directly after the loop **(2)**. `continue` skips the remainder of the current iteration only and jumps directly to the next iteration test **(2)**.
- **b6 (4 marks):** Draw the flowchart representation of a `while` loop that reads a sensor value until `sensor_value == 0`.
  - *Model Solution:* Start oval **(1)** $\to$ Input sensor value **(1)** $\to$ Decision diamond `sensor_value != 0` **(1)** $\to$ Loop body process with arrow looping back to input; False branch leading to End **(1)**.
- **b7 (3 marks):** What is the output of `for x in range(3, 15, 3): print(x, end=" ")`?
  - *Model Solution:* `3 6 9 12` **(3 marks)** (1 mark per correct value; 0 if 15 is included).
- **b8 (3 marks):** Why must the accumulator variable be initialized outside the loop rather than inside?
  - *Model Solution:* If initialized inside the loop, the accumulator resets to zero on every iteration, destroying the running total and leaving only the value of the final iteration **(3)**.

---

## Lesson 04 · Organising Data — Arrays, Collections & Indexing

### Part 1 · 12 Interactive MCQs (`window.LESSON_QUIZ`)

1. **[WAEC-style · Remember]** An array (or list) in computer programming is:
   - **A.** a single variable that can only hold one character
   - **B.** a collection of data elements stored in contiguous memory locations under a single identifier ✓
   - **C.** a hardware expansion card for gaming
   - **D.** an operating system error file
   - *Explanation:* An array stores multiple sequential elements accessible via index numbers under a unified identifier.

2. **[JAMB-style · Apply]** In Python, given `devices = ["Inverter", "Battery", "Panel", "Sensor"]`, what is the value of `devices[0]`?
   - **A.** Inverter ✓
   - **B.** Battery
   - **C.** Panel
   - **D.** Error
   - *Explanation:* Standard high-level languages use zero-based indexing; the first element is at index `0`.

3. **[NECO-style · Apply]** For the list `voltages = [220, 230, 240, 215, 225]`, what is `len(voltages)` and what is the index of the last element?
   - **A.** Length = 5, Last Index = 5
   - **B.** Length = 5, Last Index = 4 ✓
   - **C.** Length = 4, Last Index = 4
   - **D.** Length = 5, Last Index = 0
   - *Explanation:* `len()` returns the total element count (5). In zero-based indexing, valid indices are `0, 1, 2, 3, 4`. Last index is `len - 1 = 4`.

4. **[WAEC Practical · Analyse]** Tari writes:
   ```python
   meters = ["M1", "M2", "M3"]
   print(meters[3])
   ```
   What occurs when this code runs?
   - **A.** Prints M3
   - **B.** Prints None
   - **C.** `IndexError: list index out of range` ✓
   - **D.** Prints M1
   - *Explanation:* The list has 3 elements at indices `0, 1, 2`. Index `3` is out of bounds and triggers an `IndexError`.

5. **[JAMB-style · Apply]** If `marks = [65, 80, 45, 90]`, what is the result of `marks[1] + marks[3]`?
   - **A.** 110
   - **B.** 170 ✓
   - **C.** 125
   - **D.** 155
   - *Explanation:* `marks[1] = 80` (second item) and `marks[3] = 90` (fourth item). `80 + 90 = 170`.

6. **[WAEC-style · Understand]** Which statement replaces the second element of `names = ["Amina", "Tari", "Emeka"]` with `"Chinedu"`?
   - **A.** `names[2] = "Chinedu"`
   - **B.** `names[1] = "Chinedu"` ✓
   - **C.** `names(1) = "Chinedu"`
   - **D.** `names.replace("Tari", "Chinedu")`
   - *Explanation:* The second element is at index `1`. Assignment is `names[1] = "Chinedu"`.

7. **[NECO-style · Apply]** In Python, what does negative indexing `items[-1]` access?
   - **A.** The first element
   - **B.** The very last element in the collection ✓
   - **C.** A random element
   - **D.** Triggers an error
   - *Explanation:* Negative index `-1` accesses the final item from the end of the collection.

8. **[WAEC-style · Apply]** What is the value of `total` after this loop completes?
   ```python
   nums = [2, 4, 6]
   total = 1
   for n in nums:
       total *= n
   ```
   - **A.** 12
   - **B.** 48 ✓
   - **C.** 24
   - **D.** 8
   - *Explanation:* `total = 1 * 2 = 2`; `2 * 4 = 8`; `8 * 6 = 48`.

9. **[JAMB-style · Understand]** What is the time efficiency advantage of accessing an array element by its index?
   - **A.** The computer must search from the start of the list every time.
   - **B.** Direct memory access via address calculation ($\text{Base} + \text{Index} \times \text{Size}$) allows instantaneous $O(1)$ access. ✓
   - **C.** It consumes half the battery power of a variable.
   - **D.** It automatically sorts the list.
   - *Explanation:* Because arrays occupy contiguous memory, the memory address is calculated directly via simple arithmetic, allowing instant retrieval.

10. **[WAEC Practical · Analyse]** Amina needs to find the largest value in an array `readings`. Which algorithm strategy is correct?
    - **A.** Set `max_val = 0`, then compare each element; if element > `max_val`, update `max_val`. (May fail for all-negative lists).
    - **B.** Set `max_val = readings[0]`, iterate through `readings`, and if `item > max_val`, update `max_val = item`. ✓
    - **C.** Sum all numbers and divide by count.
    - **D.** Print `readings[len(readings)]`.
    - *Explanation:* Initializing `max_val` to `readings[0]` guarantees correct comparison across positive and negative values.

11. **[NECO-style · Apply]** What method appends a new element to the end of an existing Python list?
    - **A.** `list.add(item)`
    - **B.** `list.push(item)`
    - **C.** `list.append(item)` ✓
    - **D.** `list.insert_end(item)`
    - *Explanation:* In Python, `.append()` adds an element to the end of a list.

12. **[WAEC-style · Understand]** Why is an off-by-one error so common when working with arrays?
    - **A.** Programmers confuse natural 1-based human counting with 0-based machine offset indexing. ✓
    - **B.** Arrays cannot hold odd numbers.
    - **C.** Compilers randomly delete the last item.
    - **D.** Integers cannot be used as indices.
    - *Explanation:* Humans count starting from 1, while computer memory offsets start from index 0.

---

### Part 2 · Home Investigation & 30-Mark Written Assignment

#### Part A · Practical Home Investigation (Array Inventory Audit)
- **Task:** Create an inventory list of 6 electrical or computer appliances in your house (e.g. `["Fan", "TV", "Refrigerator", "Laptop", "Router", "Bulb"]`). Draw the memory representation showing: Item Value, 1-based Human Position, 0-based Machine Index, and Python Negative Index (`-1` to `-6`).
- **Marking Guidance:** Award 2 marks for complete table, 2 marks for correct 0-based and negative indices, 1 mark for clear labeling.

#### Part B · 30-Mark Written Examination Paper
- **b1 (4 marks):** Explain what an *array* is and describe how array elements are stored in physical computer memory.
  - *Model Solution:* An array is an ordered data structure holding multiple values under one identifier **(2)**. In physical RAM, elements are stored in contiguous (adjoining) memory blocks of equal size, allowing instant address calculation **(2)**.
- **b2 (4 marks):** Given the Python list: `tariffs = [45.0, 52.5, 68.0, 72.0, 85.0]`, write expressions to:
  (i) Access the first element.
  (ii) Access the last element using length.
  (iii) Change `52.5` to `55.0`.
  (iv) Add `90.0` to the end of the list.
  - *Model Solution:* (i) `tariffs[0]` **(1)**; (ii) `tariffs[len(tariffs) - 1]` **(1)**; (iii) `tariffs[1] = 55.0` **(1)**; (iv) `tariffs.append(90.0)` **(1)**.
- **b3 (4 marks):** Explain what an *off-by-one error* is and identify the error in this code:
  ```python
  cells = [3.2, 3.3, 3.1, 3.4]
  for i in range(1, 5):
      print(cells[i])
  ```
  - *Model Solution:* An off-by-one error occurs when an iterative loop executes one time too many or one time too few due to incorrect boundary conditions **(2)**. In this code, `range(1, 5)` starts at index 1 (skipping index 0) and attempts to access index 4, which is out of range for a 4-item list (valid indices 0..3), causing an `IndexError` **(2)**.
- **b4 (4 marks):** Write a complete Python program that calculates both the sum and the average of all numbers in `scores = [55, 70, 82, 64, 90, 75]`.
  - *Model Solution:*
    ```python
    scores = [55, 70, 82, 64, 90, 75]
    total = 0                            # (1)
    for score in scores:                 # (1)
        total += score                   # (1)
    average = total / len(scores)        # (1)
    print("Sum:", total, "Average:", average)
    ```
- **b5 (4 marks):** Write an algorithm in pseudocode to find the maximum number in an array `arr` of size $N$.
  - *Model Solution:*
    ```text
    SET max_val = arr[0]                 // (1)
    FOR i = 1 TO N - 1 DO                // (1)
        IF arr[i] > max_val THEN         // (1)
            SET max_val = arr[i]
        ENDIF
    ENDFOR
    OUTPUT max_val                       // (1)
    ```
- **b6 (4 marks):** Differentiate between a *one-dimensional array* and a *two-dimensional array*, giving an everyday example of each.
  - *Model Solution:* A one-dimensional array is a linear list with a single index representing a row of items (e.g. list of daily rainfall) **(2)**. A two-dimensional array has rows and columns accessed via two indices `[row][col]` (e.g. a timetable or spreadsheet grid) **(2)**.
- **b7 (3 marks):** What is the result of `len(["Lagos", "Abuja", "Kano", "Enugu"])` and what is the index of `"Enugu"`?
  - *Model Solution:* `len = 4` **(1.5)**; Index of `"Enugu"` = `3` **(1.5)**.
- **b8 (3 marks):** Why is zero-based indexing mathematically more natural for memory address calculation than one-based indexing?
  - *Model Solution:* The index represents the direct *offset* (distance) from the start address. The first element is located exactly at the base address ($\text{offset} = 0$), so $\text{Address} = \text{Base} + (0 \times \text{size}) = \text{Base}$ **(3)**.

---

## Lesson 05 · Modular Architecture — Functions, Scope & Reusability

### Part 1 · 12 Interactive MCQs (`window.LESSON_QUIZ`)

1. **[WAEC-style · Remember]** In computer programming, a function is:
   - **A.** a physical component of the power supply
   - **B.** a self-contained, named block of code that performs a specific task and can be reused ✓
   - **C.** a computer virus
   - **D.** an operating system update
   - *Explanation:* Functions encapsulate reusable code routines that take inputs, perform operations, and return results.

2. **[JAMB-style · Understand]** The software engineering principle "DRY" stands for:
   - **A.** Data Recovery Yield
   - **B.** Don't Repeat Yourself ✓
   - **C.** Digital Routing Yard
   - **D.** Direct RAM Yield
   - *Explanation:* DRY advocates eliminating duplicate code by packaging repeated logic into reusable functions.

3. **[NECO-style · Apply]** In Python, which keyword is used to declare a function?
   - **A.** `function`
   - **B.** `def` ✓
   - **C.** `sub`
   - **D.** `void`
   - *Explanation:* Python uses `def` (define) to declare a function.

4. **[WAEC-style · Apply]** What is the output of the following code?
   ```python
   def square(n):
       return n * n

   result = square(6)
   print(result)
   ```
   - **A.** 12
   - **B.** 36 ✓
   - **C.** 6
   - **D.** n * n
   - *Explanation:* `square(6)` calculates $6 \times 6 = 36$ and returns `36`.

5. **[JAMB-style · Understand]** Values passed into a function when calling it are called:
   - **A.** Arguments (or actual parameters) ✓
   - **B.** Keywords
   - **C.** Globals
   - **D.** Operators
   - *Explanation:* Arguments are the actual values passed to function parameters during invocation.

6. **[WAEC Practical · Analyse]** Examine the following script:
   ```python
   def calculate_bill():
       tax = 500
       print("Inside:", tax)

   calculate_bill()
   print("Outside:", tax)
   ```
   What happens when this script executes?
   - **A.** Prints Inside: 500 then Outside: 500
   - **B.** Prints Inside: 500, then crashes with `NameError: name 'tax' is not defined` ✓
   - **C.** Prints Outside: 500
   - **D.** Prints nothing
   - *Explanation:* `tax` is declared locally inside `calculate_bill()`. Once the function finishes, `tax` ceases to exist and cannot be accessed in the outer global scope.

7. **[NECO-style · Understand]** A variable declared outside of all functions has:
   - **A.** Local scope
   - **B.** Global scope ✓
   - **C.** Block scope
   - **D.** Invisible scope
   - *Explanation:* Variables defined outside any function belong to global scope and can be read throughout the file.

8. **[WAEC-style · Apply]** What is returned by a Python function that reaches the end of its code block without an explicit `return` statement?
   - **A.** `0`
   - **B.** `None` ✓
   - **C.** `False`
   - **D.** `Error`
   - *Explanation:* In Python, functions without an explicit `return` statement return `None` by default.

9. **[JAMB-style · Apply]** What is the output of:
   ```python
   def add_bonus(score, bonus=10):
       return score + bonus

   print(add_bonus(70))
   ```
   - **A.** 70
   - **B.** 80 ✓
   - **C.** 10
   - **D.** Error: missing argument
   - *Explanation:* `bonus=10` is a default parameter. When omitted, it defaults to 10: $70 + 10 = 80$.

10. **[WAEC Practical · Analyse]** Why is modular programming with functions easier to test and maintain?
    - **A.** Functions can be independently tested, debugged, and modified without risking unwanted side effects in the rest of the codebase. ✓
    - **B.** Functions make code run twice as fast on all hardware.
    - **C.** Functions eliminate the need for variables.
    - **D.** Functions compile into analog voltages.
    - *Explanation:* Encapsulation and modularity allow unit testing of individual components in isolation.

11. **[NECO-style · Apply]** What does the following function return?
    ```python
    def is_even(num):
        return num % 2 == 0
    ```
    For `is_even(7)`, what is returned?
    - **A.** `True`
    - **B.** `False` ✓
    - **C.** `1`
    - **D.** `7`
    - *Explanation:* `7 % 2 = 1`. `1 == 0` evaluates to `False`.

12. **[WAEC-style · Understand]** What is the "call stack" in program execution?
    - **A.** A battery charging rack in the solar inverter.
    - **B.** A memory structure that keeps track of active function calls and their local variables. ✓
    - **C.** A list of syntax errors in a program.
    - **D.** The physical hard disk drive.
    - *Explanation:* The call stack tracks function invocation frames, local variable allocation, and return addresses.

---

### Part 2 · Home Investigation & 30-Mark Written Assignment

#### Part A · Practical Home Investigation (Modular Tariff Blueprint)
- **Task:** Design a modular algorithm on paper that calculates the total monthly electricity bill for a household. Decompose the problem into three separate functions:
  1. `calculate_energy_cost(units, rate)`
  2. `calculate_vat(energy_cost, vat_rate)`
  3. `generate_final_bill(units, rate, fixed_charge)` which calls the previous two functions and adds the fixed charge.
- **Marking Guidance:** Award 2 marks for clear function signatures, 2 marks for proper parameter and return usage, 1 mark for modular composition.

#### Part B · 30-Mark Written Examination Paper
- **b1 (4 marks):** Define *modular programming* and state three benefits of using functions in software development.
  - *Model Solution:* Modular programming is a software design technique that separates program functionality into independent, interchangeable modules or functions **(1)**. Benefits: (1) Reusability (DRY principle) **(1)**; (2) Easier debugging and testing **(1)**; (3) Improved code readability and maintainability **(1)**.
- **b2 (4 marks):** Differentiate between *formal parameters* and *actual arguments* with a code example.
  - *Model Solution:* Formal parameters are the placeholder variable names listed in the function definition header **(1)**. Actual arguments are the concrete values passed into the function when calling it **(1)**.
    ```python
    def greet(name):       # 'name' is the formal parameter (1)
        print("Hello", name)

    greet("Amina")         # '"Amina"' is the actual argument (1)
    ```
- **b3 (4 marks):** Explain the difference between *local scope* and *global scope*, and describe what happens when a local variable has the same name as a global variable.
  - *Model Solution:* Global scope variables are declared outside functions and are accessible throughout the program **(1)**. Local scope variables are created inside a function and are accessible only while that function executes **(1)**. When a local variable shares the name of a global variable, the local variable *shadows* (takes precedence over) the global variable within the function, without modifying the global variable's value outside **(2)**.
- **b4 (4 marks):** Write a Python function `celsius_to_fahrenheit(c)` that converts temperature using $F = (C \times 9/5) + 32$ and returns the result rounded to 1 decimal place. Include a test call with $C = 37.0$.
  - *Model Solution:*
    ```python
    def celsius_to_fahrenheit(c):              # (1)
        f = (c * 9 / 5) + 32                   # (1)
        return round(f, 1)                     # (1)

    print(celsius_to_fahrenheit(37.0))         # Output: 98.6 (1)
    ```
- **b5 (4 marks):** Trace this code and state its exact output:
  ```python
  x = 10
  def modify(x):
      x = x + 5
      return x

  print(modify(x))
  print(x)
  ```
  - *Model Solution:* Inside `modify(10)`, local `x = 10 + 5 = 15`, which is returned **(1)**. First print outputs `15` **(1)**. The global variable `x` remains unchanged at `10` **(1)**. Second print outputs `10` **(1)**.
- **b6 (4 marks):** What is a *fruitful function* compared to a *void (procedure) function*? Give one example of each.
  - *Model Solution:* A fruitful function computes and returns a specific value to the caller via a `return` statement (e.g. `len("Ikogosi")` returns 7) **(2)**. A void function (procedure) performs an action (such as printing to screen or writing to a file) without returning a value (e.g. `print("Hello")`) **(2)**.
- **b7 (3 marks):** What does the `return` statement do besides passing a value back to the caller?
  - *Model Solution:* It immediately terminates function execution, exiting the function and returning control back to the point where the function was called **(3)**.
- **b8 (3 marks):** Why is relying heavily on global variables considered poor programming practice?
  - *Model Solution:* It creates hidden dependencies, makes code difficult to debug because any part of the program can unexpectedly modify the global variable, and makes functions difficult to reuse in other programs **(3)**.

---

## Lesson 06 · Silicon Roots & Exam Clinic — Binary, Hex & Dry-Run Traces

### Part 1 · 12 Interactive MCQs (`window.LESSON_QUIZ`)

1. **[WAEC-style · Remember]** The hexadecimal number system uses which base?
   - **A.** Base-2
   - **B.** Base-8
   - **C.** Base-10
   - **D.** Base-16 ✓
   - *Explanation:* Hexadecimal is base-16 and uses digits 0–9 and letters A–F (where A=10, B=11, C=12, D=13, E=14, F=15).

2. **[JAMB-style · Apply]** Convert the binary byte `01010011` to its decimal equivalent.
   - **A.** 75
   - **B.** 83 ✓
   - **C.** 91
   - **D.** 64
   - *Explanation:* $01010011_2 = (64 \times 1) + (16 \times 1) + (2 \times 1) + (1 \times 1) = 64 + 16 + 2 + 1 = 83$.

3. **[NECO-style · Apply]** What is the hexadecimal equivalent of the decimal integer 255?
   - **A.** `0xFF` ✓
   - **B.** `0xAA`
   - **C.** `0x100`
   - **D.** `0xFE`
   - *Explanation:* $255 = (15 \times 16) + 15 = \text{FF}_{16}$.

4. **[WAEC Practical · Analyse]** In the Ikogosi microgrid, status code `0x7E` is received. What is `0x7E` in 8-bit binary?
   - **A.** `11100111`
   - **B.** `01111110` ✓
   - **C.** `01111111`
   - **D.** `10000001`
   - *Explanation:* Split hex digits: $7 = 0111_2$ and $E (14) = 1110_2$. Joining them yields `01111110`.

5. **[WAEC-style · Understand]** A programmer types `prnt("Hello")` instead of `print("Hello")`. What type of error is this?
   - **A.** Run-time error
   - **B.** Logic error
   - **C.** Syntax error ✓
   - **D.** Hardware failure
   - *Explanation:* Violating the grammatical rules and keywords of a programming language is a syntax error.

6. **[JAMB-style · Understand]** A program runs to completion without crashing, but calculates a student's grade as `F` when their score was `85`. What kind of error has occurred?
   - **A.** Syntax error
   - **B.** Logic error ✓
   - **C.** Compilation crash
   - **D.** Type error
   - *Explanation:* A logic error occurs when the code runs without halting, but produces an incorrect result due to flawed reasoning.

7. **[NECO-style · Apply]** Which error type causes a program to halt abruptly during execution when attempting to divide by zero?
   - **A.** Run-time error (`ZeroDivisionError`) ✓
   - **B.** Syntax error
   - **C.** Logic error
   - **D.** Linker error
   - *Explanation:* A run-time error occurs while the program is running when an illegal mathematical or memory operation is attempted.

8. **[WAEC-style · Remember]** Why do computer programmers and hardware engineers use hexadecimal rather than binary strings?
   - **A.** Hexadecimal is understood natively by CPU transistors.
   - **B.** Hexadecimal provides a concise, human-readable representation where one hex digit directly represents four binary bits (a nibble). ✓
   - **C.** Hexadecimal numbers consume half the electrical power of binary.
   - **D.** Hexadecimal eliminates logic errors.
   - *Explanation:* 1 hex digit represents 4 bits; a byte (8 bits) is cleanly written as 2 hex digits (e.g. `0xFF`), making memory addresses compact and readable.

9. **[JAMB-style · Apply]** Complete the trace:
   ```python
   a = 4
   b = 3
   a = a + b
   b = a - b
   a = a - b
   ```
   What are the final values of `a` and `b`?
   - **A.** `a = 4, b = 3`
   - **B.** `a = 3, b = 4` ✓
   - **C.** `a = 7, b = 7`
   - **D.** `a = 1, b = 1`
   - *Explanation:* Step 1: `a = 4 + 3 = 7`. Step 2: `b = 7 - 3 = 4`. Step 3: `a = 7 - 4 = 3`. This is the classic variable swap without a temporary variable!

10. **[WAEC Practical · Analyse]** In a WAEC algorithm trace table, what is recorded in the table columns?
    - **A.** Only the final answer
    - **B.** Program line numbers, condition evaluations, intermediate variable values, and console outputs at each execution step. ✓
    - **C.** The physical room temperature
    - **D.** The programmer's name and school address
    - *Explanation:* A trace table records the state of all variables and outputs chronologically line by line.

11. **[NECO-style · Apply]** Convert binary `1100` to decimal.
    - **A.** 10
    - **B.** 12 ✓
    - **C.** 14
    - **D.** 8
    - *Explanation:* $8 + 4 + 0 + 0 = 12$.

12. **[WAEC-style · Understand]** Which logic gate outputs `1` only when both of its inputs are `1`?
    - **A.** OR gate
    - **B.** AND gate ✓
    - **C.** NOT gate
    - **D.** XOR gate
    - *Explanation:* An AND gate requires all inputs to be high (1) to produce a high output.

---

### Part 2 · Home Investigation & 30-Mark Written Assignment

#### Part A · Practical Home Investigation (Digital Status Decoder)
- **Task:** Research hex color codes used in web design (e.g. `#FF0000` for Red, `#00FF00` for Green, `#38BDF8` for Sky Blue). Deconstruct one hex color into its three 8-bit RGB components (Red, Green, Blue) and convert each 2-digit hex byte into its decimal equivalent (0–255).
- **Marking Guidance:** Award 2 marks for correct hex-to-decimal conversion, 2 marks for binary mapping, 1 mark for clear presentation.

#### Part B · 30-Mark Written Examination Paper
- **b1 (4 marks):** Differentiate clearly between *syntax errors*, *run-time errors*, and *logic errors*, providing one concrete example of each.
  - *Model Solution:* Syntax error: violation of language grammatical rules detected before or during translation (e.g. `prnt("Hi")`) **(1.5)**. Run-time error: occurs during execution causing abrupt termination (e.g. dividing by zero `10 / 0` or accessing index out of bounds) **(1.5)**. Logic error: program runs to completion without crashing but produces incorrect output due to faulty reasoning (e.g. using `+` instead of `*`) **(1)**.
- **b2 (4 marks):** Convert the following number representations:
  (i) Decimal `43` to 8-bit binary.
  (ii) Binary `11100101` to decimal.
  (iii) Decimal `188` to hexadecimal.
  (iv) Hexadecimal `0x2C` to decimal.
  - *Model Solution:*
    (i) $43 = 32 + 8 + 2 + 1 = \mathbf{00101011_2}$ **(1)**.
    (ii) $128 + 64 + 32 + 0 + 0 + 4 + 0 + 1 = \mathbf{229}$ **(1)**.
    (iii) $188 / 16 = 11$ remainder $12 \implies B$ and $C \implies \mathbf{0xBC}$ **(1)**.
    (iv) $(2 \times 16) + 12 = 32 + 12 = \mathbf{44}$ **(1)**.
- **b3 (6 marks):** Complete the WAEC trace table for the following algorithm:
  ```python
  values = [14, 7, 22, 9]
  count = 0
  sum_even = 0
  for v in values:
      if v % 2 == 0:
          sum_even += v
          count += 1
  ```
  - *Model Solution:*
    | Step | `v` | Condition (`v % 2 == 0`) | `sum_even` | `count` | Output / State |
    |:---:|:---:|:---:|:---:|:---:|:---:|
    | Init | — | — | 0 | 0 | Start **(1)** |
    | 1 | 14 | $14 \% 2 == 0 \implies \text{True}$ | 14 | 1 | Even added **(1)** |
    | 2 | 7 | $7 \% 2 == 1 \implies \text{False}$ | 14 | 1 | Odd skipped **(1)** |
    | 3 | 22 | $22 \% 2 == 0 \implies \text{True}$ | 36 | 2 | Even added **(1)** |
    | 4 | 9 | $9 \% 2 == 1 \implies \text{False}$ | 36 | 2 | Odd skipped **(1)** |
    | End | — | Loop Terminated | **36** | **2** | Final: sum=36, count=2 **(1)** |
- **b4 (4 marks):** Draw the circuit diagram of a 2-input digital logic circuit that evaluates the boolean expression $Z = (A \text{ AND } B) \text{ OR } (\text{NOT } A)$.
  - *Model Solution:* AND gate with inputs $A$ and $B$ **(1)**; NOT gate with input $A$ yielding $\text{NOT } A$ **(1)**; OR gate taking output of AND gate and NOT gate to produce output $Z$ **(2)**.
- **b5 (4 marks):** What is a *dry run* (desk check) and why is it considered the most powerful debugging skill for a programmer?
  - *Model Solution:* A dry run is a manual, step-by-step mental or written trace of an algorithm using pencil and paper without running it on a computer **(2)**. It allows programmers to catch logical flaws, understand edge cases, and verify boundary conditions before writing code or deploying to hardware **(2)**.
- **b6 (4 marks):** A school grading system has a bug: any score $\ge 70$ receives an `"A"`, but scores of exactly 70 receive `"B"`. Inspect this code, identify the bug, and write the correction:
  ```python
  if score > 70:
      grade = "A"
  else:
      grade = "B"
  ```
  - *Model Solution:* Bug: The relational operator `>` (strictly greater than) was used instead of `>=` (greater than or equal to) **(2)**. When score is 70, `70 > 70` evaluates to `False`, incorrectly falling into the `else` branch.
    Correction:
    ```python
    if score >= 70: # (2)
        grade = "A"
    else:
        grade = "B"
    ```
- **b7 (2 marks):** State two advantages of writing comments (`#` or `REM`) in computer programs.
  - *Model Solution:* (1) Explains algorithm purpose to human developers; (2) Improves software maintenance and team collaboration **(2)**.
- **b8 (2 marks):** What is the result of applying De Morgan's Law to $\text{NOT } (A \text{ AND } B)$?
  - *Model Solution:* $(\text{NOT } A) \text{ OR } (\text{NOT } B)$ **(2 marks)**.
