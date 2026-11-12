/* ==========================================================
   StudyPipe — Lesson 06 Data (window.L06 + window.LESSON_QUIZ)
   Silicon Roots & Exam Clinic — Binary, Hexadecimal, Dry-Run Traces & System Recovery
   ========================================================== */
(function () {
  "use strict";

  var ITEMS = [
    {
      id: "s1", emo: "📝",
      name: "Missing colon after condition: <code>if x &gt; 5</code>",
      bin: "syntax",
      why: "Violates Python's grammar rules; the parser stops with a SyntaxError before execution begins."
    },
    {
      id: "s2", emo: "🔤",
      name: "Misspelled keyword: <code>whle count &lt; 10:</code>",
      bin: "syntax",
      why: "The translator does not recognise 'whle' as a valid language keyword and halts at compile/parse time."
    },
    {
      id: "s3", emo: "🧩",
      name: "Unmatched parenthesis: <code>print(calc(5)</code>",
      bin: "syntax",
      why: "An unclosed bracket violates statement structure and raises a SyntaxError before any line runs."
    },
    {
      id: "s4", emo: "💥",
      name: "Dividing by zero: <code>avg = total / 0</code>",
      bin: "runtime",
      why: "Grammatically legal code that crashes during execution with a ZeroDivisionError."
    },
    {
      id: "s5", emo: "📦",
      name: "Out-of-bounds index: <code>cells[8]</code> on an 8-item list",
      bin: "runtime",
      why: "Valid indices are 0..7; requesting index 8 aborts execution with an IndexError."
    },
    {
      id: "s6", emo: "⚡",
      name: "Incompatible types: <code>\"150\" + 20</code>",
      bin: "runtime",
      why: "Adding an integer to a string without casting raises a TypeError while the statement executes."
    },
    {
      id: "s7", emo: "🧭",
      name: "Using <code>score &gt; 70</code> instead of <code>score &gt;= 70</code> for grade A",
      bin: "logic",
      why: "The program runs without crashing, but a student who scores 70 is wrongly given grade B."
    },
    {
      id: "s8", emo: "🔄",
      name: "Forgetting to update the loop counter inside a <code>while</code> loop",
      bin: "logic",
      why: "Valid syntax that never reaches its termination condition, causing an infinite loop."
    },
    {
      id: "s9", emo: "🔀",
      name: "Writing <code>and grid_online</code> instead of <code>and not grid_online</code>",
      bin: "logic",
      why: "The boolean expression evaluates cleanly, but keeps the backup generator off during a blackout."
    }
  ];

  var BINS = {
    syntax: "Syntax error (grammar)",
    runtime: "Run-time error (crash)",
    logic: "Logic error (wrong result)"
  };

  var PINS = [
    {
      hex: "0x7E", byteVal: 126, bin: "01111110",
      hiHex: "7", hiBin: "0111", hiDec: 7,
      loHex: "E", loBin: "1110", loDec: 14,
      label: "Master Parity Unlock (Ikogosi Inverter)",
      weights: "64 + 32 + 16 + 8 + 4 + 2 = 126",
      note: "Upper nibble <code>7 = 0111₂</code>, lower nibble <code>E (14) = 1110₂</code>. Authenticates the central inverter and closes the 50 Hz town contactor."
    },
    {
      hex: "0x4A", byteVal: 74, bin: "01001010",
      hiHex: "4", hiBin: "0100", hiDec: 4,
      loHex: "A", loBin: "1010", loDec: 10,
      label: "Worked Example 6.2 · Telemetry Packet",
      weights: "64 + 8 + 2 = 74",
      note: "Upper nibble <code>4 = 0100₂</code>, lower nibble <code>A (10) = 1010₂</code>. Decimal value is <code>(4 × 16) + 10 = 74₁₀</code>."
    },
    {
      hex: "0x53", byteVal: 83, bin: "01010011",
      hiHex: "5", hiBin: "0101", hiDec: 5,
      loHex: "3", loBin: "0011", loDec: 3,
      label: "Solar Array Ready Flag",
      weights: "64 + 16 + 2 + 1 = 83",
      note: "Upper nibble <code>5 = 0101₂</code>, lower nibble <code>3 = 0011₂</code>. Decimal value is <code>(5 × 16) + 3 = 83₁₀</code>."
    },
    {
      hex: "0xFF", byteVal: 255, bin: "11111111",
      hiHex: "F", hiBin: "1111", hiDec: 15,
      loHex: "F", loBin: "1111", loDec: 15,
      label: "Maximum 8-Bit Unsigned Register",
      weights: "128 + 64 + 32 + 16 + 8 + 4 + 2 + 1 = 255",
      note: "All 8 bits are high (<code>11111111₂</code>). In hexadecimal, <code>(15 × 16) + 15 = 255₁₀ = 0xFF</code>."
    },
    {
      hex: "0x2C", byteVal: 44, bin: "00101100",
      hiHex: "2", hiBin: "0010", hiDec: 2,
      loHex: "C", loBin: "1100", loDec: 12,
      label: "Clinic Cold-Chain Status Byte",
      weights: "32 + 8 + 4 = 44",
      note: "Upper nibble <code>2 = 0010₂</code>, lower nibble <code>C (12) = 1100₂</code>. Decimal value is <code>(2 × 16) + 12 = 44₁₀</code>."
    },
    {
      hex: "0xBC", byteVal: 188, bin: "10111100",
      hiHex: "B", hiBin: "1011", hiDec: 11,
      loHex: "C", loBin: "1100", loDec: 12,
      label: "Sub-Station Feeder Relay Byte",
      weights: "128 + 32 + 16 + 8 + 4 = 188",
      note: "Dividing 188 by 16 gives quotient <code>11 (B)</code> and remainder <code>12 (C)</code>, so <code>188₁₀ = 0xBC = 10111100₂</code>."
    }
  ];

  var BRIDGE = [
    {
      q: "Step 1 · Hardware Parity Check: The inverter controller requests the 8-bit binary form and decimal value of hex register 0x7E. Which pair is correct?",
      o: [
        "01111110₂ and 126₁₀ (since 7 = 0111₂, E = 1110₂, and 7×16 + 14 = 126)",
        "11100111₂ and 231₁₀ (nibbles reversed)",
        "01111111₂ and 127₁₀ (E treated as 15 instead of 14)"
      ],
      a: 0,
      why: "Hex 7 is 0111₂ and hex E (14) is 1110₂, giving 01111110₂ = (7 × 16) + 14 = 126₁₀."
    },
    {
      q: "Step 2 · Dry-Run Trace Verification: The boot script runs the even-number filter on values = [14, 7, 22, 9], adding v to sum_even and incrementing count whenever v % 2 == 0. What are the final values?",
      o: [
        "sum_even = 52, count = 4 (all elements added)",
        "sum_even = 36, count = 2 (14 and 22 pass v % 2 == 0; 7 and 9 are skipped)",
        "sum_even = 16, count = 2 (only odd numbers 7 and 9 added)"
      ],
      a: 1,
      why: "Only 14 (i=0) and 22 (i=2) have remainder 0 when divided by 2, so sum_even = 14 + 22 = 36 and count = 2."
    },
    {
      q: "Step 3 · Full Unit Integration: Why did dry-running all 5 patched modules (int('150')+20, 'and not grid_online', bounded loops, 0..7 indexing, and local function scope) matter before closing the 50 Hz contactor?",
      o: [
        "Because a dry run catches logic errors and boundary bugs on paper before faulty code can trip physical relays or corrupt billing data",
        "Because dry-run tables automatically compile Python into C++",
        "Because hardware relays do not use binary voltages"
      ],
      a: 0,
      why: "A desk check (dry run) proves that every variable state, branch, loop boundary, array index, and return value is valid before energizing physical hardware."
    }
  ];

  window.L06 = {
    items: ITEMS,
    bins: BINS,
    pins: PINS,
    refPin: 0,
    bridge: BRIDGE
  };

  window.DATA = {
    sortItems: ITEMS,
    sortBins: [
      { id: "syntax", title: BINS.syntax, desc: "Violates language grammar rules; caught before execution" },
      { id: "runtime", title: BINS.runtime, desc: "Legal grammar that crashes abruptly during execution" },
      { id: "logic", title: BINS.logic, desc: "Runs without crashing, but produces wrong output" }
    ]
  };

  window.LESSON_QUIZ = [
    {
      q: "The hexadecimal number system uses which base?",
      o: ["Base-2", "Base-8", "Base-10", "Base-16"],
      a: 3,
      e: "Hexadecimal is base-16 and uses digits 0–9 and letters A–F (where A=10, B=11, C=12, D=13, E=14, F=15)."
    },
    {
      q: "Convert the binary byte <code>01010011</code> to its decimal equivalent.",
      o: ["75", "83", "91", "64"],
      a: 1,
      e: "01010011₂ = (64 × 1) + (16 × 1) + (2 × 1) + (1 × 1) = 64 + 16 + 2 + 1 = 83."
    },
    {
      q: "What is the hexadecimal equivalent of the decimal integer 255?",
      o: ["0xFF", "0xAA", "0x100", "0xFE"],
      a: 0,
      e: "255 = (15 × 16) + 15 = FF₁₆ (written as 0xFF)."
    },
    {
      q: "In the Ikogosi microgrid, status code <code>0x7E</code> is received. What is <code>0x7E</code> in 8-bit binary?",
      o: ["11100111", "01111110", "01111111", "10000001"],
      a: 1,
      e: "Split the hex digits into 4-bit nibbles: 7 = 0111₂ and E (14) = 1110₂. Joining them yields 01111110₂."
    },
    {
      q: "A programmer types <code>prnt(\"Hello\")</code> instead of <code>print(\"Hello\")</code>. What type of error is this?",
      o: ["Run-time error", "Logic error", "Syntax error", "Hardware failure"],
      a: 2,
      e: "Violating the grammatical rules and keywords of a programming language is a syntax error."
    },
    {
      q: "A program runs to completion without crashing, but calculates a student's grade as <code>F</code> when their score was <code>85</code>. What kind of error has occurred?",
      o: ["Syntax error", "Logic error", "Compilation crash", "Type error"],
      a: 1,
      e: "A logic error occurs when the code runs without halting, but produces an incorrect result due to flawed reasoning."
    },
    {
      q: "Which error type causes a program to halt abruptly during execution when attempting to divide by zero?",
      o: ["Run-time error (ZeroDivisionError)", "Syntax error", "Logic error", "Linker error"],
      a: 0,
      e: "A run-time error occurs while the program is running when an illegal mathematical or memory operation is attempted."
    },
    {
      q: "Why do computer programmers and hardware engineers use hexadecimal rather than binary strings?",
      o: [
        "Hexadecimal is understood natively by CPU transistors.",
        "Hexadecimal provides a concise, human-readable representation where one hex digit directly represents four binary bits (a nibble).",
        "Hexadecimal numbers consume half the electrical power of binary.",
        "Hexadecimal eliminates logic errors."
      ],
      a: 1,
      e: "1 hex digit represents 4 bits; a byte (8 bits) is cleanly written as 2 hex digits (e.g. 0xFF), making memory addresses compact and readable."
    },
    {
      q: "Complete the trace: <code>a = 4; b = 3; a = a + b; b = a - b; a = a - b</code>. What are the final values of <code>a</code> and <code>b</code>?",
      o: ["a = 4, b = 3", "a = 3, b = 4", "a = 7, b = 7", "a = 1, b = 1"],
      a: 1,
      e: "Step 1: a = 4 + 3 = 7. Step 2: b = 7 - 3 = 4. Step 3: a = 7 - 4 = 3. This is the classic variable swap without a temporary variable!"
    },
    {
      q: "In a WAEC algorithm trace table, what is recorded in the table columns?",
      o: [
        "Only the final answer",
        "Program line numbers, condition evaluations, intermediate variable values, and console outputs at each execution step.",
        "The physical room temperature",
        "The programmer's name and school address"
      ],
      a: 1,
      e: "A trace table records the state of all variables and outputs chronologically line by line."
    },
    {
      q: "Convert binary <code>1100</code> to decimal.",
      o: ["10", "12", "14", "8"],
      a: 1,
      e: "1100₂ = 8 + 4 + 0 + 0 = 12₁₀."
    },
    {
      q: "Which logic gate outputs <code>1</code> only when both of its inputs are <code>1</code>?",
      o: ["OR gate", "AND gate", "NOT gate", "XOR gate"],
      a: 1,
      e: "An AND gate requires all inputs to be high (1) to produce a high (1) output."
    }
  ];
})();
