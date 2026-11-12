/* ==========================================================
   StudyPipe — Spaced Retrieval Bank · Introduction to Computer Programming (L1–L6)
   Read by LessonKit in lessons/lesson-01 .. lesson-06 (classic script, offline).
   donow  : the 4 Do Now cards of each lesson in 02-lesson.md (from: 0 = prerequisite,
            from: N = Lesson N; sec = the section id in that earlier lesson the "Revisit" link opens)
   quiz   : 2 original review MCQs from earlier lessons (l02 onward), appended after the lesson's own quiz
   recall : blank-page recall prompt + the key points to tick off (02-lesson.md § 5 Recall)
   ========================================================== */
window.RETRIEVAL_BANK = {
  l01: {
    title: "From Logic to Code — Programming Languages, Translators & Memory Variables",
    donow: [
      {
        from: 0, sec: "concepts", where: "Binary digits",
        q: "What are the two binary digits used by digital computers, and what physical states do they represent?",
        a: "The digits are <strong>0</strong> and <strong>1</strong>, representing low voltage (off / 0 V) and high voltage (on / +3.3 V or +5 V)."
      },
      {
        from: 0, sec: "examples", where: "Algebraic substitution",
        q: "In basic algebra, if <code>x = 15</code> and <code>y = 4</code>, evaluate the expression <code>z = (2 × x) + y</code>.",
        a: "z = (2 × 15) + 4 = 30 + 4 = <strong>34</strong>."
      },
      {
        from: 0, sec: "practical", where: "Computer RAM",
        q: "What is the primary function of computer RAM?",
        a: "<strong>Random Access Memory (RAM)</strong> temporarily holds active program instructions and data currently being processed by the CPU; it is volatile memory."
      },
      {
        from: 0, sec: "examples", where: "Binary conversion",
        q: "Convert the integer 13 into a 4-bit binary number.",
        a: "13 = 8 + 4 + 0 + 1 = <strong>1101₂</strong>."
      }
    ],
    quiz: [],
    recall: {
      prompt: "Close your notes. Write down everything you remember from Lesson 1, then tick each point below that you wrote, even in your own words:",
      points: [
        "A computer program is a structured sequence of instructions executed by hardware to perform a task.",
        "Machine language is raw binary (0s and 1s) executed directly by the CPU; assembly uses mnemonics (LOAD, ADD) translated by an assembler.",
        "A compiler translates the entire source program into object code before execution; an interpreter translates and executes line by line at runtime.",
        "A variable is a named memory container whose value can change; a constant holds a fixed value throughout execution.",
        "The four fundamental scalar data types are integer (int), floating-point (float), string (str), and boolean (bool).",
        "Quotation marks create text strings: \"150\" + \"20\" concatenates to \"15020\", whereas int(\"150\") + 20 adds to 170."
      ]
    }
  },

  l02: {
    title: "Making Decisions — Conditional Logic, Boolean Operators & Branching",
    donow: [
      {
        from: 1, sec: "concepts", where: "Boolean data type",
        q: "What data type results from evaluating the expression <code>45 &gt; 30</code>?",
        a: "A <strong>Boolean</strong> (<code>bool</code>), which evaluates to <strong>True</strong>."
      },
      {
        from: 1, sec: "concepts", where: "Assignment vs equality",
        q: "Why does <code>x = 10</code> differ from <code>x == 10</code> in programming?",
        a: "<code>x = 10</code> is an <strong>assignment</strong> statement storing 10 in variable <code>x</code>; <code>x == 10</code> is an <strong>equality comparison</strong> testing whether <code>x</code> equals 10."
      },
      {
        from: 1, sec: "examples", where: "String literals",
        q: "In Python, what is the output of <code>type(\"250.5\")</code>?",
        a: "<strong>&lt;class 'str'&gt;</strong> (string), because of the quotation marks."
      },
      {
        from: 1, sec: "concepts", where: "Language translators",
        q: "Which translator converts the entire source code into machine code before running: a compiler or an interpreter?",
        a: "A <strong>compiler</strong>."
      }
    ],
    quiz: [
      {
        from: 1,
        q: "In Python, what is the value and data type of \"40\" + \"60\"?",
        o: ["100 (int)", "\"4060\" (str)", "4060 (int)", "TypeError"],
        a: 1,
        e: "Quotation marks define string literals; the + operator concatenates them into \"4060\"."
      },
      {
        from: 1,
        q: "Which of the following is an invalid variable identifier in Python?",
        o: ["_rate", "total_cost", "3rd_item", "score2"],
        a: 2,
        e: "Variable identifiers cannot begin with a numeric digit (3rd_item)."
      }
    ],
    recall: {
      prompt: "Close your notes. Write down everything you remember from Lesson 2, then tick each point below that you wrote:",
      points: [
        "Relational operators (==, !=, >, <, >=, <=) compare two values and return a boolean (True or False).",
        "Logical AND is True only when both inputs are True; OR is True when at least one input is True; NOT inverts the truth value.",
        "Operator precedence evaluates NOT first, then AND, and finally OR unless parentheses override the order.",
        "In an IF-ELIF-ELSE chain, conditions are tested top-to-bottom and at most one branch executes.",
        "The ELSE clause never takes a condition; it runs only when all preceding IF and ELIF conditions are False.",
        "In standard ISO flowcharts, a decision point is drawn as a diamond with labelled True/False exit arrows."
      ]
    }
  },

  l03: {
    title: "The Power of Repetition — Counter & Conditional Loops",
    donow: [
      {
        from: 2, sec: "concepts", where: "Boolean truth tables",
        q: "What is the output of <code>not (True and False)</code>?",
        a: "<strong>True</strong> (since <code>True and False</code> is <code>False</code>, <code>not False</code> is <code>True</code>)."
      },
      {
        from: 2, sec: "concepts", where: "IF-ELIF-ELSE branches",
        q: "In an <code>if-elif-else</code> statement, how many code blocks can execute on a single run?",
        a: "At most <strong>one</strong> block executes; once a condition is met, all remaining branches are skipped."
      },
      {
        from: 1, sec: "concepts", where: "Numeric data types",
        q: "Which data type would you use to store a student's examination percentage score of <code>78.4%</code>?",
        a: "<strong>Float</strong> (floating-point number)."
      },
      {
        from: 1, sec: "examples", where: "Modulus arithmetic",
        q: "Evaluate <code>(12 % 5) + 3</code>.",
        a: "<code>12 % 5 = 2</code> (remainder of 12 divided by 5); <code>2 + 3 = <strong>5</strong></code>."
      }
    ],
    quiz: [
      {
        from: 2,
        q: "Evaluate the boolean expression: (10 > 5) and not (3 == 3).",
        o: ["True", "False", "10", "SyntaxError"],
        a: 1,
        e: "10 > 5 is True, and 3 == 3 is True so not (3 == 3) is False. True and False evaluates to False."
      },
      {
        from: 1,
        q: "What is the result of 23 // 5 in Python?",
        o: ["4.6", "4", "3", "5"],
        a: 1,
        e: "Floor division // divides and truncates the decimal fraction: 23 ÷ 5 = 4 remainder 3, so 23 // 5 = 4."
      }
    ],
    recall: {
      prompt: "Close your notes. Write down everything you remember from Lesson 3, then tick each point below that you wrote:",
      points: [
        "Iteration (looping) repeats a block of instructions automatically without duplicating lines of code.",
        "A FOR loop is counter-controlled; in Python, range(start, stop, step) generates values from start up to (but excluding) stop.",
        "A WHILE loop is condition-controlled and repeats as long as its boolean test remains True.",
        "An infinite loop happens when the loop condition never becomes False (for example, omitting the counter update inside a WHILE loop).",
        "The accumulator pattern initialises a variable (such as total = 0) before the loop and updates it (total += item) on each pass.",
        "break exits a loop immediately, whereas continue skips the rest of the current pass and jumps to the next iteration."
      ]
    }
  },

  l04: {
    title: "Organising Data — Arrays, Collections & Indexing",
    donow: [
      {
        from: 3, sec: "concepts", where: "Python range()",
        q: "What values does <code>range(1, 5)</code> generate in Python?",
        a: "The integers <strong>1, 2, 3, 4</strong> (it stops strictly before the upper bound 5)."
      },
      {
        from: 3, sec: "practical", where: "Loop execution count",
        q: "If a loop starts with <code>count = 0</code> and increments <code>count += 2</code> while <code>count &lt; 10</code>, how many times does it execute?",
        a: "<strong>5 times</strong> (for <code>count = 0, 2, 4, 6, 8</code>)."
      },
      {
        from: 2, sec: "concepts", where: "Compound boolean logic",
        q: "What is the truth value of <code>(5 &gt; 2) and (10 &lt; 4)</code>?",
        a: "<strong>False</strong> (because <code>10 &lt; 4</code> is <code>False</code>)."
      },
      {
        from: 1, sec: "examples", where: "String casting",
        q: "What is the output of <code>print(\"Score: \" + str(95))</code>?",
        a: "<code>Score: 95</code>."
      }
    ],
    quiz: [
      {
        from: 3,
        q: "How many numbers are printed by: for k in range(2, 10, 2): print(k)?",
        o: ["3", "4", "5", "8"],
        a: 1,
        e: "range(2, 10, 2) generates 2, 4, 6, 8 (stops before 10), which is 4 iterations."
      },
      {
        from: 2,
        q: "Which flowchart shape represents a conditional decision branch?",
        o: ["Rectangle", "Parallelogram", "Diamond", "Oval"],
        a: 2,
        e: "A diamond represents a decision condition with labelled True/False exit paths."
      }
    ],
    recall: {
      prompt: "Close your notes. Write down everything you remember from Lesson 4, then tick each point below that you wrote:",
      points: [
        "An array (or list) stores an ordered collection of elements under a single identifier in contiguous memory.",
        "Zero-based indexing means the first element is at index 0 and the Nth (last) element is at index N − 1.",
        "Memory address offset formula: Address(i) = Base_Address + i × Element_Size.",
        "Attempting to read or write at index N (or higher) on an N-element array triggers an IndexError (Out of Bounds).",
        "A FOR loop over range(len(arr)) safely visits every valid index from 0 to len(arr) − 1.",
        "Tracking a running minimum or maximum starts by setting min_val = arr[0] and comparing each element in a loop."
      ]
    }
  },

  l05: {
    title: "Modular Architecture — Functions, Scope & Reusability",
    donow: [
      {
        from: 4, sec: "concepts", where: "Zero-based bounds",
        q: "If an array <code>scores</code> contains 6 numbers, what is the index of the last element?",
        a: "<strong>5</strong> (last valid index = <code>N − 1 = 6 − 1 = 5</code>)."
      },
      {
        from: 4, sec: "concepts", where: "Array length",
        q: "What built-in function returns the number of elements in a Python list?",
        a: "<code>len()</code>."
      },
      {
        from: 3, sec: "concepts", where: "Infinite loops",
        q: "What happens if a loop's condition never becomes <code>False</code>?",
        a: "It forms an <strong>infinite loop</strong>, freezing or crashing the program."
      },
      {
        from: 1, sec: "examples", where: "String concatenation",
        q: "Why does <code>a = \"10\"</code> and <code>b = \"20\"</code> result in <code>a + b == \"1020\"</code>?",
        a: "The <code>+</code> operator <strong>concatenates</strong> (joins) text strings instead of performing mathematical addition."
      }
    ],
    quiz: [
      {
        from: 4,
        q: "Given cells = [3.2, 3.1, 3.4, 2.9, 3.3], what is the value of cells[3]?",
        o: ["3.4", "2.9", "3.3", "IndexError"],
        a: 1,
        e: "Counting from index 0: cells[0]=3.2, cells[1]=3.1, cells[2]=3.4, cells[3]=2.9."
      },
      {
        from: 3,
        q: "What is the final value of total after running: total = 0; for i in range(1, 5): total += i?",
        o: ["6", "10", "15", "4"],
        a: 1,
        e: "range(1, 5) yields 1, 2, 3, 4. Their sum is 1 + 2 + 3 + 4 = 10."
      }
    ],
    recall: {
      prompt: "Close your notes. Write down everything you remember from Lesson 5, then tick each point below that you wrote:",
      points: [
        "A function is a named, reusable block of code defined with def that performs a specific task (the DRY principle).",
        "Parameters are the input variables listed in the function header; arguments are the actual values passed when calling the function.",
        "The return statement sends a computed result back to the caller and immediately exits the function.",
        "Variables created inside a function have local scope: they live in a temporary stack frame and are destroyed when the function returns.",
        "Global variables are declared outside all functions and can be read across the file, but local variables cannot be read from outside.",
        "Default parameter values (such as tariff_rate=68.0) are used automatically when the caller omits that argument."
      ]
    }
  },

  l06: {
    title: "Silicon Roots & Exam Clinic — Binary, Hexadecimal, Dry-Run Traces & System Recovery",
    donow: [
      {
        from: 5, sec: "concepts", where: "Defining functions",
        q: "What keyword in Python is used to define a reusable function?",
        a: "<code>def</code>."
      },
      {
        from: 5, sec: "zoom", where: "Local stack scope",
        q: "What happens to variables created inside a function after the function finishes executing?",
        a: "They are <strong>destroyed</strong> (deallocated from the stack frame) because they have local scope."
      },
      {
        from: 4, sec: "examples", where: "Array element lookup",
        q: "If <code>arr = [10, 20, 30, 40]</code>, evaluate <code>arr[1] + arr[3]</code>.",
        a: "<code>arr[1] = 20</code> and <code>arr[3] = 40</code>; <code>20 + 40 = <strong>60</strong></code>."
      },
      {
        from: 2, sec: "concepts", where: "Relational negation",
        q: "Write the boolean negation of <code>temperature &gt;= 35</code>.",
        a: "<code>temperature &lt; 35</code>."
      }
    ],
    quiz: [
      {
        from: 5,
        q: "What happens if you try to print a local variable outside the function where it was created?",
        o: ["It prints 0", "It raises a NameError because the variable is out of scope", "It prints the function name", "It automatically becomes global"],
        a: 1,
        e: "Local variables exist only inside their function's stack frame; referencing them outside raises a NameError."
      },
      {
        from: 4,
        q: "An array has 8 elements. What is the valid range of indices in zero-based indexing?",
        o: ["1 to 8", "0 to 8", "0 to 7", "1 to 7"],
        a: 2,
        e: "Zero-based indices start at 0 and end at N − 1 = 7."
      }
    ],
    recall: {
      prompt: "Close your notes. Write down everything you remember from Lesson 6, then tick each point below that you wrote:",
      points: [
        "Binary (base 2) uses digits 0–1 with place values 128, 64, 32, 16, 8, 4, 2, 1; hexadecimal (base 16) uses 0–9 and A–F (10–15).",
        "Each hex digit maps to a 4-bit binary nibble: 0x7E = 0111 1110₂ = (7 × 16) + 14 = 126₁₀.",
        "Syntax errors break language grammar (e.g. missing colon); runtime errors crash during execution (e.g. IndexError, ZeroDivisionError); logic errors run without crashing but produce wrong output.",
        "A WAEC dry-run trace table tracks each variable's value, condition evaluation, and output in chronological columns step by step.",
        "Combining typed variables, boolean gates, bounded loops, 0-based arrays, and modular functions builds reliable automation software."
      ]
    }
  }
};
