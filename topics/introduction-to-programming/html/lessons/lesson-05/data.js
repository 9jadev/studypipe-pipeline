/* ==========================================================
   StudyPipe — Lesson 05 Data (`window.L05` + `window.LESSON_QUIZ`)
   Modular Architecture — Functions, Scope & Reusability
   Source of truth: 02-lesson.md § Lesson 05 & 03-questions.md § Lesson 05
   ========================================================== */
(function () {
  "use strict";

  var TARIFF = 68.0;
  var VAT_RATE = 0.075;
  var FIXED_CHARGE = 1500.0;

  function calcBill(units, rate, vatRate, fixed) {
    var u = Number(units || 0);
    var r = rate != null ? Number(rate) : TARIFF;
    var v = vatRate != null ? Number(vatRate) : VAT_RATE;
    var f = fixed != null ? Number(fixed) : FIXED_CHARGE;
    var energy = Math.round(u * r * 100) / 100;
    var vat = Math.round(energy * v * 100) / 100;
    var total = Math.round((energy + vat + f) * 100) / 100;
    return { units: u, rate: r, vatRate: v, fixed: f, energy: energy, vat: vat, total: total };
  }

  window.L05 = {
    TARIFF: TARIFF,
    VAT_RATE: VAT_RATE,
    FIXED_CHARGE: FIXED_CHARGE,
    calcBill: calcBill,

    // ---- 2A Sort game · "Anatomy of a Function" (3 bins, 8 items) ----
    bins: {
      header: "Function Header / Parameters",
      body: "Function Body / Local Logic",
      ret: "Return Statement / Caller"
    },
    items: [
      {
        id: "s1",
        emo: "🏷️",
        name: "def calculate_nepa_bill(units, tariff=68.0):",
        bin: "header",
        why: "Uses the def keyword to declare the function name and its formal parameters (including a default parameter)."
      },
      {
        id: "s2",
        emo: "🌡️",
        name: "def celsius_to_fahrenheit(c):",
        bin: "header",
        why: "Declares the function signature and the formal input parameter c."
      },
      {
        id: "s3",
        emo: "⚙️",
        name: "energy_cost = units * tariff_rate",
        bin: "body",
        why: "Computes an intermediate result inside the function's isolated local variable scope."
      },
      {
        id: "s4",
        emo: "🧾",
        name: "vat_amount = energy_cost * 0.075",
        bin: "body",
        why: "Calculates the 7.5% VAT using a local variable inside the function body."
      },
      {
        id: "s5",
        emo: "🔒",
        name: "total_bill = energy_cost + vat_amount + 1500.0",
        bin: "body",
        why: "Combines local variables inside the stack frame without touching global variables."
      },
      {
        id: "s6",
        emo: "📤",
        name: "return round(total_bill, 2)",
        bin: "ret",
        why: "Passes the computed output value back to the caller and exits the function stack frame."
      },
      {
        id: "s7",
        emo: "📞",
        name: "household_1 = calculate_nepa_bill(85)",
        bin: "ret",
        why: "Invokes (calls) the function with actual argument 85 and stores the returned value."
      },
      {
        id: "s8",
        emo: "🎯",
        name: "return (c * 9 / 5) + 32",
        bin: "ret",
        why: "Evaluates the expression and returns the final Fahrenheit temperature to the caller."
      }
    ],

    // ---- 3 Make Sense · One-Way Scope & Tariff Pin Explorer (#pos-explorer) ----
    pins: [
      {
        units: 85,
        label: "Meter 101 · 85 kWh",
        scopeNote: "Inside stack frame: local <code>energy_cost = 5780.00</code>, <code>vat_amount = 433.50</code>, <code>total_bill = 7713.50</code>. Outer global <code>total_revenue</code> is untouched until the caller adds the return value."
      },
      {
        units: 120,
        label: "Meter 102 · 120 kWh",
        scopeNote: "Inside stack frame: local <code>energy_cost = 8160.00</code>, <code>vat_amount = 612.00</code>, <code>total_bill = 10272.00</code>. Previous frame for 85 kWh was already popped from RAM."
      },
      {
        units: 210,
        label: "Meter 103 · 210 kWh",
        scopeNote: "Inside stack frame: local <code>energy_cost = 14280.00</code>, <code>vat_amount = 1071.00</code>, <code>total_bill = 16851.00</code>. Same 6-line function handles any household argument (DRY)."
      },
      {
        units: 45,
        label: "Clinic Kiosk · 45 kWh",
        scopeNote: "Inside stack frame: local <code>energy_cost = 3060.00</code>, <code>vat_amount = 229.50</code>, <code>total_bill = 4789.50</code>. Trying to read <code>vat_amount</code> outside raises <code>NameError</code>."
      },
      {
        units: 150,
        label: "School Lab · 150 kWh",
        scopeNote: "Inside stack frame: local <code>energy_cost = 10200.00</code>, <code>vat_amount = 765.00</code>, <code>total_bill = 12465.00</code>. One-Way Glass lets the function read global constants without leaking locals."
      },
      {
        units: 300,
        label: "Water Pump · 300 kWh",
        scopeNote: "Inside stack frame: local <code>energy_cost = 20400.00</code>, <code>vat_amount = 1530.00</code>, <code>total_bill = 23430.00</code>. Updating VAT once in the function updates all 250 meters."
      }
    ],
    refPin: 0,

    // ---- 4 Apply · The Bridge (Refactoring billing.py, 3 steps) ----
    bridge: [
      {
        q: "In the broken billing.py, 3 of the 12 copy-pasted tariff blocks still used 5% VAT instead of 7.5% for an 85 kWh meter. How much was each affected bill undercharged?",
        o: [
          "₦144.50 (₦7,569.00 instead of ₦7,713.50)",
          "₦1,644.50 (because the fixed charge was also dropped)",
          "₦0.00 (VAT does not affect the total bill)"
        ],
        a: 0,
        why: "For 85 units at ₦68/kWh, energy = ₦5,780.00. At 7.5% VAT is ₦433.50 (bill ₦7,713.50); at 5% VAT is ₦289.00 (bill ₦7,569.00) — a ₦144.50 discrepancy (or ₦1,644.50 when the ₦1,500 fixed charge was also omitted in one copy!)."
      },
      {
        q: "Why did writing total = energy + vat + 1500 inside a copy-pasted block corrupt the station's daily revenue counter?",
        o: [
          "Python cannot multiply floats without a function",
          "The block ran in global scope and overwrote the global variable total on every household",
          "The variable name total is a reserved Python keyword"
        ],
        a: 1,
        why: "Without a function's isolated local stack frame, assigning to total in the main script overwrote the global variable in RAM."
      },
      {
        q: "Which refactored design fixes all 250 smart meters while protecting global memory?",
        o: [
          "Copy-paste the 7.5% formula into all 12 blocks and use global total",
          "def calculate_nepa_bill(units, tariff_rate=68.0, vat_rate=0.075): compute in local scope and return round(total_bill, 2)",
          "def calculate_nepa_bill(): print(85 * 68.0) with no parameters or return"
        ],
        a: 1,
        why: "A single parameterized function with local variables and an explicit return statement obeys DRY and isolates local memory inside its call-stack frame."
      }
    ]
  };

  // Alias for compatibility
  window.DATA = window.L05;

  // ---- 12 WAEC / NECO / JAMB MCQs (03-questions.md § Lesson 05 Part 1, keys unchanged) ----
  window.LESSON_QUIZ = [
    {
      q: "In computer programming, a function is:",
      o: [
        "a physical component of the power supply",
        "a self-contained, named block of code that performs a specific task and can be reused",
        "a computer virus",
        "an operating system update"
      ],
      a: 1,
      e: "Functions encapsulate reusable code routines that take inputs, perform operations, and return results."
    },
    {
      q: "The software engineering principle \"DRY\" stands for:",
      o: [
        "Data Recovery Yield",
        "Don't Repeat Yourself",
        "Digital Routing Yard",
        "Direct RAM Yield"
      ],
      a: 1,
      e: "DRY advocates eliminating duplicate code by packaging repeated logic into reusable functions."
    },
    {
      q: "In Python, which keyword is used to declare a function?",
      o: ["function", "def", "sub", "void"],
      a: 1,
      e: "Python uses <code>def</code> (define) to declare a function."
    },
    {
      q: "What is the output of the following code? <code>def square(n): return n * n</code> then <code>result = square(6); print(result)</code>",
      o: ["12", "36", "6", "n * n"],
      a: 1,
      e: "<code>square(6)</code> calculates <span class=\"sp-math\" data-latex=\"6 \\times 6 = 36\"></span> and returns <code>36</code>."
    },
    {
      q: "Values passed into a function when calling it are called:",
      o: [
        "Arguments (or actual parameters)",
        "Keywords",
        "Globals",
        "Operators"
      ],
      a: 0,
      e: "Arguments are the actual values passed to function parameters during invocation."
    },
    {
      q: "Examine the script: <code>def calculate_bill(): tax = 500; print(\"Inside:\", tax)</code> followed by <code>calculate_bill(); print(\"Outside:\", tax)</code>. What happens when this script executes?",
      o: [
        "Prints Inside: 500 then Outside: 500",
        "Prints Inside: 500, then crashes with NameError: name 'tax' is not defined",
        "Prints Outside: 500",
        "Prints nothing"
      ],
      a: 1,
      e: "<code>tax</code> is declared locally inside <code>calculate_bill()</code>. Once the function finishes, <code>tax</code> ceases to exist and cannot be accessed in the outer global scope."
    },
    {
      q: "A variable declared outside of all functions has:",
      o: [
        "Local scope",
        "Global scope",
        "Block scope",
        "Invisible scope"
      ],
      a: 1,
      e: "Variables defined outside any function belong to global scope and can be read throughout the file."
    },
    {
      q: "What is returned by a Python function that reaches the end of its code block without an explicit <code>return</code> statement?",
      o: ["0", "None", "False", "Error"],
      a: 1,
      e: "In Python, functions without an explicit <code>return</code> statement return <code>None</code> by default."
    },
    {
      q: "What is the output of: <code>def add_bonus(score, bonus=10): return score + bonus</code> followed by <code>print(add_bonus(70))</code>?",
      o: ["70", "80", "10", "Error: missing argument"],
      a: 1,
      e: "<code>bonus=10</code> is a default parameter. When omitted, it defaults to 10: <span class=\"sp-math\" data-latex=\"70 + 10 = 80\"></span>."
    },
    {
      q: "Why is modular programming with functions easier to test and maintain?",
      o: [
        "Functions can be independently tested, debugged, and modified without risking unwanted side effects in the rest of the codebase.",
        "Functions make code run twice as fast on all hardware.",
        "Functions eliminate the need for variables.",
        "Functions compile into analog voltages."
      ],
      a: 0,
      e: "Encapsulation and modularity allow unit testing of individual components in isolation."
    },
    {
      q: "What does the function <code>def is_even(num): return num % 2 == 0</code> return for <code>is_even(7)</code>?",
      o: ["True", "False", "1", "7"],
      a: 1,
      e: "<code>7 % 2 = 1</code>. <code>1 == 0</code> evaluates to <code>False</code>."
    },
    {
      q: "What is the \"call stack\" in program execution?",
      o: [
        "A battery charging rack in the solar inverter.",
        "A memory structure that keeps track of active function calls and their local variables.",
        "A list of syntax errors in a program.",
        "The physical hard disk drive."
      ],
      a: 1,
      e: "The call stack tracks function invocation frames, local variable allocation, and return addresses."
    }
  ];
})();
