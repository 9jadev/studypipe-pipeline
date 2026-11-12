/* ==========================================================
   StudyPipe — Lesson 01 Data (window.L01 & window.LESSON_QUIZ)
   From Logic to Code: Programming Languages, Translators & Memory Variables
   ========================================================== */
window.L01 = {
  bins: {
    high: "High-Level Languages",
    trans: "Language Translators",
    low: "Low-Level Code"
  },

  items: [
    {
      id: "python", emo: "🐍", name: "Python", bin: "high",
      why: "Uses English-like keywords (print, if, def) independent of CPU hardware architecture."
    },
    {
      id: "basic", emo: "💻", name: "BASIC (LET, PRINT, INPUT)", bin: "high",
      why: "Beginner's All-purpose Symbolic Instruction Code is a human-readable high-level language."
    },
    {
      id: "java", emo: "☕", name: "Java", bin: "high",
      why: "Object-oriented high-level language compiled to portable bytecode."
    },
    {
      id: "cpp", emo: "⚙️", name: "C++", bin: "high",
      why: "High-level compiled systems language using structured human-readable syntax."
    },
    {
      id: "compiler", emo: "📦", name: "Compiler", bin: "trans",
      why: "Translates an entire high-level source program into standalone machine object code before execution."
    },
    {
      id: "interpreter", emo: "🔍", name: "Interpreter", bin: "trans",
      why: "Translates and executes high-level source code statement-by-statement at runtime."
    },
    {
      id: "assembler", emo: "🔧", name: "Assembler", bin: "trans",
      why: "Translates low-level assembly mnemonics (MOV, ADD) into binary machine code."
    },
    {
      id: "machine", emo: "⚡", name: "Machine Language (0s & 1s)", bin: "low",
      why: "Raw binary voltage instructions executed directly by the CPU without any translator."
    },
    {
      id: "assembly", emo: "🧩", name: "Assembly Language (MOV, ADD)", bin: "low",
      why: "Second-generation low-level code using symbolic mnemonics tied to specific processor registers."
    }
  ],

  refPin: 0,
  pins: [
    {
      label: "Type Mismatch Trap",
      code: '"150" + 20',
      type: "TypeError",
      result: "Crash (str + int)",
      bytes: "5 B + 2 B",
      note: "Quotation marks make <code>\"150\"</code> a 3-character text string. Python refuses to add a raw integer to text without explicit casting."
    },
    {
      label: "Explicit Integer Cast",
      code: 'int("150") + 20',
      type: "int",
      result: "170",
      bytes: "2 B (int)",
      note: "<code>int(\"150\")</code> converts the ASCII characters into the binary integer <code>150</code>, so the ALU computes <code>150 + 20 = 170</code>."
    },
    {
      label: "String Concatenation",
      code: '"150" + "20"',
      type: "str",
      result: '"15020"',
      bytes: "5 B (5 chars)",
      note: "When both operands are strings, the <code>+</code> operator joins (concatenates) their characters end-to-end instead of adding numerically."
    },
    {
      label: "Floor Division (//)",
      code: "19 // 4",
      type: "int",
      result: "4",
      bytes: "2 B (int)",
      note: "Integer floor division <code>//</code> divides 19 by 4 (= 4.75) and truncates the decimal fraction, leaving the whole quotient <code>4</code>."
    },
    {
      label: "Modulus Remainder (%)",
      code: "19 % 4",
      type: "int",
      result: "3",
      bytes: "2 B (int)",
      note: "Modulus <code>%</code> returns the whole-number remainder after integer division: <code>19 = (4 × 4) + 3</code>, so <code>19 % 4 = 3</code>."
    },
    {
      label: "Operator Precedence",
      code: "12 + 8 * 2 - 6 / 2",
      type: "float",
      result: "25.0",
      bytes: "4 B (float)",
      note: "Multiplication and division run before addition/subtraction: <code>8 * 2 = 16</code> and <code>6 / 2 = 3.0</code>, then <code>12 + 16 - 3.0 = 25.0</code>."
    }
  ],

  bridge: [
    {
      q: "Bug 1 (Identifier Syntax): Line 1 of sensor_log.py reads `2nd_panel_kw = \"150\"`. Why does the interpreter halt with a SyntaxError before running a single line?",
      o: [
        "Variable names cannot begin with a numeric digit (`2`); rename it to `panel_2_kw`",
        "Python variables cannot contain underscores (`_`)",
        "The number 150 is too large for an 8-bit register"
      ],
      a: 0,
      why: "Identifiers must begin with a letter (a–z, A–Z) or underscore (_), never a digit. Renaming `2nd_panel_kw` to `panel_2_kw` fixes the SyntaxError."
    },
    {
      q: "Bug 2 (Data Type Mismatch): Line 2 reads `total_power = panel_2_kw + 20`, where `panel_2_kw = \"150\"`. How should Amina rewrite this line so `total_power` stores the integer `170`?",
      o: [
        "total_power = panel_2_kw + \"20\"",
        "total_power = int(panel_2_kw) + 20",
        "total_power = str(panel_2_kw + 20)"
      ],
      a: 1,
      why: "Casting with `int(panel_2_kw)` converts the string `\"150\"` into the integer `150` before adding `20`, giving `170` instead of `" + "15020" + "` or a TypeError."
    },
    {
      q: "Bug 3 (Log Output String Building): Line 3 prints the log banner: `print(\"Grid Output: \" + total_power + \" kW\")`. Why does this raise another TypeError, and what fixes it?",
      o: [
        "Wrap `total_power` in `str(total_power)` so all three parts joined by `+` are strings",
        "Replace `print` with `INPUT`",
        "Remove the quotation marks around `Grid Output:`"
      ],
      a: 0,
      why: "Because `total_power` is now an integer (`170`), concatenating it directly to `\"Grid Output: \"` raises a TypeError. `str(total_power)` converts `170` to `\"170\"` cleanly."
    }
  ]
};

window.DATA = {
  sortItems: window.L01.items,
  sortBins: [
    { id: "high", title: "High-Level Languages", desc: "Human-readable English syntax" },
    { id: "trans", title: "Language Translators", desc: "Converts source code to machine form" },
    { id: "low", title: "Low-Level Code", desc: "Hardware-specific binary & assembly" }
  ]
};

window.LESSON_QUIZ = [
  {
    q: "A computer program is best defined as:",
    o: [
      "a set of physical electrical wires inside the CPU",
      "a sequence of logical instructions executed by a computer to perform a specific task",
      "an electronic spreadsheet used for calculating examination results",
      "a collection of computer hardware peripherals"
    ],
    a: 1,
    e: "A program is a structured set of coded instructions directing a computer's hardware. A describes circuitry; C describes application software; D refers to hardware devices."
  },
  {
    q: "Which programming language generation is directly executed by the central processing unit without translation?",
    o: [
      "High-level language (Python)",
      "Assembly language",
      "Machine language (binary 0s and 1s)",
      "Fourth-generation language (SQL)"
    ],
    a: 2,
    e: "Machine code consists of raw binary digits (voltage states) and is the only language natively understood by digital hardware without a translator. Assembly requires an assembler; high-level code requires a compiler or interpreter."
  },
  {
    q: "Amina writes a script in Python, while Tari compiles a program in C. What is the fundamental difference in how their source code is translated?",
    o: [
      "Python translates the entire file at once into object code, whereas C interprets line by line.",
      "Python interprets source code line by line at runtime, whereas C compiles the entire code into machine language beforehand.",
      "Python does not require translation to execute on hardware.",
      "C code runs inside a web browser, while Python runs only in binary ROM."
    ],
    a: 1,
    e: "Compilers (C) translate whole programs into standalone executable object files prior to execution; interpreters (Python) translate and execute statements line by line at runtime."
  },
  {
    q: 'In Python, evaluate the expression: <code>total = "200" + "50"</code>. What is the value and data type of <code>total</code>?',
    o: [
      "250 (Integer)",
      '"20050" (String)',
      "20050 (Integer)",
      "Error: Cannot add numbers"
    ],
    a: 1,
    e: 'Quoted values are string literals. The + operator concatenates (joins) textual strings rather than performing arithmetic addition, resulting in "20050".'
  },
  {
    q: "Which of the following is a valid variable identifier according to standard high-level programming conventions?",
    o: [
      "<code>2nd_score</code>",
      "<code>total bill</code>",
      "<code>_student_age</code>",
      "<code>class</code>"
    ],
    a: 2,
    e: "Variable names cannot begin with digits (A), cannot contain spaces (B), and cannot be reserved language keywords (D). An identifier may begin with an underscore or letter (C)."
  },
  {
    q: "Tari declares <code>voltage = 220.75</code>. What fundamental data type is assigned to <code>voltage</code>?",
    o: [
      "Integer (<code>int</code>)",
      "Floating-point number (<code>float</code>)",
      "Character (<code>char</code>)",
      "Boolean (<code>bool</code>)"
    ],
    a: 1,
    e: "Numbers with decimal fractional parts are classified as floating-point numbers (float). Integers represent whole numbers."
  },
  {
    q: 'Amina executes <code>units = input("Enter consumed units: "); rate = 68; bill = units * rate</code> in the solar controller terminal. If the user types <code>10</code>, what does <code>bill</code> evaluate to?',
    o: [
      "<code>680</code>",
      '<code>"101010..."</code> (the string <code>"10"</code> repeated 68 times)',
      "<code>TypeError: cannot multiply</code>",
      "<code>0</code>"
    ],
    a: 1,
    e: "In Python, input() returns a string. Multiplying a string by an integer repeats the string 68 times. To perform arithmetic, type casting is required: int(units) * rate = 680."
  },
  {
    q: "A value in a program that cannot be reassigned or modified during program execution is called a:",
    o: [
      "variable",
      "literal pointer",
      "constant",
      "operator"
    ],
    a: 2,
    e: "A constant stores an immutable data value that remains fixed throughout execution."
  },
  {
    q: "What is the result of integer division <code>19 // 4</code> in Python?",
    o: [
      "4.75",
      "4",
      "3",
      "5"
    ],
    a: 1,
    e: "The integer floor division operator // divides and truncates the fractional decimal portion, yielding 4. 19 % 4 = 3 (the remainder)."
  },
  {
    q: "Which language translator halts execution the very instant it encounters a syntax error?",
    o: [
      "Compiler",
      "Interpreter",
      "Linker",
      "Operating system loader"
    ],
    a: 1,
    e: "An interpreter parses line-by-line and halts immediately upon encountering an invalid instruction. Compilers parse the entire program and report all errors together."
  },
  {
    q: "Evaluate the arithmetic expression following standard operator precedence: <code>result = 12 + 8 * 2 - 6 / 2</code>.",
    o: [
      "17",
      "25",
      "14",
      "20"
    ],
    a: 1,
    e: "Multiplication and division precede addition and subtraction: 8 * 2 = 16 and 6 / 2 = 3. Then 12 + 16 - 3 = 28 - 3 = 25."
  },
  {
    q: "An SS1 apprentice writes <code>recharge = 1500; bonus = 0.20; total = recharge + (recharge * bonus)</code>. What value is stored in <code>total</code>?",
    o: [
      "₦1,500.00",
      "₦1,800.00",
      "₦300.00",
      "₦3,000.00"
    ],
    a: 1,
    e: "bonus_amount = 1500 * 0.20 = 300. total = 1500 + 300 = 1800."
  }
];
