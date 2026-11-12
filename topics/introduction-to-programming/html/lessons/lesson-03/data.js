/* ==========================================================
   StudyPipe — Lesson 03 Data
   The Power of Repetition — Counter & Conditional Loops
   ========================================================== */
window.L03 = {
  bins: {
    for_bin: "FOR Loop (Counter-Controlled)",
    while_bin: "WHILE Loop (Condition-Controlled)"
  },
  items: [
    { id: "s1", emo: "🔢", name: "Print numbers 1 to 50", bin: "for_bin", why: "The exact start (1) and stop (50) counts are known before the loop starts." },
    { id: "s2", emo: "☀️", name: "Sum kWh across 7 daily solar logs", bin: "for_bin", why: "Iterating over a fixed collection of 7 daily readings uses a definite counter loop." },
    { id: "s3", emo: "📅", name: "Iterate over 12 months of the year", bin: "for_bin", why: "There are always 12 months, so the iteration count is predetermined." },
    { id: "s4", emo: "🎓", name: "Compute average of 40 WAEC exam scores", bin: "for_bin", why: "The number of student scores (40) is fixed in advance." },
    { id: "s5", emo: "🌡️", name: "Read sensor until temp drops below 25°C", bin: "while_bin", why: "We do not know how many readings it will take for the inverter to cool down." },
    { id: "s6", emo: "🔐", name: "Prompt operator for PIN until correct", bin: "while_bin", why: "The loop depends on user input and repeats an unknown number of times." },
    { id: "s7", emo: "🔋", name: "Run backup load while battery > 11.5 V", bin: "while_bin", why: "Battery discharge duration varies with load; termination is condition-controlled." },
    { id: "s8", emo: "🛑", name: "Accept meter entries until '-1' is typed", bin: "while_bin", why: "Uses a sentinel value (-1) to end data entry whenever the operator finishes." }
  ],
  pins: [
    {
      label: "range(5)",
      code: "for i in range(5):",
      basic: "FOR I = 0 TO 4 STEP 1",
      seq: "0, 1, 2, 3, 4",
      iters: 5,
      sum: 10,
      note: "Single argument <code>range(stop)</code> starts at <b>0</b> by default and stops at <code>stop - 1</code> (5 is excluded)."
    },
    {
      label: "range(1, 6)",
      code: "for i in range(1, 6):",
      basic: "FOR I = 1 TO 5 STEP 1",
      seq: "1, 2, 3, 4, 5",
      iters: 5,
      sum: 15,
      note: "Starts at <b>1</b> and stops before <b>6</b>. Accumulating <code>sum += i</code> yields <b>1 + 2 + 3 + 4 + 5 = 15</b>."
    },
    {
      label: "range(2, 10, 2)",
      code: "for i in range(2, 10, 2):",
      basic: "FOR I = 2 TO 8 STEP 2",
      seq: "2, 4, 6, 8",
      iters: 4,
      sum: 20,
      note: "Starts at 2, increments by step <b>+2</b>, and stops before 10. Runs <b>4 iterations</b>."
    },
    {
      label: "range(1, 10, 2)",
      code: "for i in range(1, 10, 2):",
      basic: "FOR I = 1 TO 9 STEP 2",
      seq: "1, 3, 5, 7, 9",
      iters: 5,
      sum: 25,
      note: "Steps through odd integers from 1 to 9 inclusive. Runs <b>5 iterations</b>, sum = <b>25</b>."
    },
    {
      label: "range(5, 0, -1)",
      code: "for k in range(5, 0, -1):",
      basic: "FOR K = 5 TO 1 STEP -1",
      seq: "5, 4, 3, 2, 1",
      iters: 5,
      sum: 15,
      note: "Negative step <b>-1</b> counts backwards from 5 down to 1 (stopping before 0). Final value of <code>k</code> is <b>1</b>."
    },
    {
      label: "7-Day Solar List",
      code: "for x in [45,52,60,58,49,63,55]:",
      basic: "FOR D = 1 TO 7 : TOTAL = TOTAL + KWH(D)",
      seq: "45, 52, 60, 58, 49, 63, 55",
      iters: 7,
      sum: 382,
      note: "Iterates directly over the 7 daily solar readings. Accumulator <code>total_kwh = 382</code> kWh, mean = <b>54.57 kWh</b>."
    }
  ],
  refPin: 1,
  bridge: [
    {
      q: "Why did line 22 (<code>while solar_output &gt; 0: print('Active')</code>) freeze the Ikogosi Microgrid terminal at 99% CPU?",
      o: [
        "Because solar_output is never updated inside the loop body, so solar_output > 0 stays True forever",
        "Because Python cannot run while loops on solar inverters",
        "Because print('Active') deletes system memory"
      ],
      a: 0,
      why: "In daytime sunlight, solar_output > 0 is True. Without a state update or counter step inside the body, the condition never becomes False."
    },
    {
      q: "Chief Babatunde wants the script to check each of the 7 daily solar array logs exactly once and stop cleanly. Which loop header is safest?",
      o: [
        "while True: check_panel()",
        "for reading in daily_readings:",
        "while reading > 0:"
      ],
      a: 1,
      why: "A counter-controlled FOR loop over the 7-element list guarantees exactly 7 iterations and automatic termination."
    },
    {
      q: "When accumulating the 7 readings <code>[45, 52, 60, 58, 49, 63, 55]</code> with <code>total_kwh = 0</code> before the loop, what are the final total and average?",
      o: [
        "total_kwh = 264 kWh, average_kwh = 52.80 kWh",
        "total_kwh = 382 kWh, average_kwh = 54.57 kWh",
        "total_kwh = 55 kWh, average_kwh = 7.86 kWh"
      ],
      a: 1,
      why: "45 + 52 + 60 + 58 + 49 + 63 + 55 = 382 kWh. Dividing by 7 days gives 382 / 7 = 54.57 kWh."
    }
  ]
};

window.DATA = {
  sortItems: window.L03.items,
  sortBins: [
    { id: "for_bin", title: "FOR Loop (Counter-Controlled)", desc: "Known, predetermined number of iterations" },
    { id: "while_bin", title: "WHILE Loop (Condition-Controlled)", desc: "Repeats until condition becomes False" }
  ]
};

window.LESSON_QUIZ = [
  {
    q: "Which loop structure is best suited for executing a block of code a known, predetermined number of times?",
    o: ["Infinite loop", "FOR loop (counter-controlled)", "WHILE loop", "IF-ELSE branch"],
    a: 1,
    e: "A <code>FOR</code> loop specifies a definite sequence or count range. <code>WHILE</code> loops run until an external condition changes."
  },
  {
    q: "In Python, how many iterations are performed by the loop: <code>for i in range(2, 10, 2):</code>?",
    o: ["8", "4", "5", "3"],
    a: 1,
    e: "The values generated are <code>2, 4, 6, 8</code> (stopping before 10). That is exactly 4 iterations."
  },
  {
    q: "What is the final value of <code>total</code> after executing:<br><code>total = 0</code><br><code>for i in range(1, 5):</code><br><code>&nbsp;&nbsp;&nbsp;&nbsp;total += i</code>",
    o: ["15", "10", "5", "4"],
    a: 1,
    e: "<code>range(1, 5)</code> yields <code>1, 2, 3, 4</code>. <code>total = 0 + 1 + 2 + 3 + 4 = 10</code>."
  },
  {
    q: "An infinite loop occurs when:",
    o: [
      "the computer runs out of physical disk space",
      "the loop termination condition never evaluates to False",
      "the loop contains more than 10 lines of code",
      "the programmer uses integer variables"
    ],
    a: 1,
    e: "If the loop condition remains perpetually true (e.g. counter is not updated), execution repeats indefinitely."
  },
  {
    q: "Examine the following loop:<br><code>count = 1</code><br><code>while count &lt;= 5:</code><br><code>&nbsp;&nbsp;&nbsp;&nbsp;print(count)</code><br>What issue will occur upon execution?",
    o: [
      "It prints 1 to 5 correctly.",
      "It creates an infinite loop printing 1 endlessly because count is never incremented.",
      "It throws a SyntaxError.",
      "It prints nothing."
    ],
    a: 1,
    e: "<code>count</code> remains 1 forever, so <code>1 &lt;= 5</code> remains perpetually true."
  },
  {
    q: "What is printed by this countdown loop?<br><code>for k in range(5, 0, -1):</code><br><code>&nbsp;&nbsp;&nbsp;&nbsp;pass</code><br><code>print(k)</code>",
    o: ["5", "1", "0", "-1"],
    a: 1,
    e: "<code>range(5, 0, -1)</code> generates <code>5, 4, 3, 2, 1</code>. The last assigned value to <code>k</code> is 1."
  },
  {
    q: "In the accumulator pattern (<code>sum = sum + x</code>), what initial value is typically assigned to <code>sum</code> before the loop begins?",
    o: ["1", "0", "100", "-1"],
    a: 1,
    e: "The additive identity is 0; initializing to 0 ensures prior memory garbage does not contaminate the sum."
  },
  {
    q: "What is the output of the following nested loop?<br><code>for i in range(2):</code><br><code>&nbsp;&nbsp;&nbsp;&nbsp;for j in range(3):</code><br><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;print('*', end='')</code>",
    o: ["***", "****** (6 asterisks)", "**", "*****"],
    a: 1,
    e: "The outer loop runs 2 times; for each iteration, the inner loop runs 3 times: 2 × 3 = 6 asterisks."
  },
  {
    q: "Which statement immediately terminates loop execution and transfers control to the statement after the loop?",
    o: ["continue", "break", "pass", "return"],
    a: 1,
    e: "<code>break</code> exits the enclosing loop immediately. <code>continue</code> skips only the current iteration."
  },
  {
    q: "Tari writes a loop to calculate the average of 4 test scores:<br><code>scores = [70, 80, 90, 100]</code><br><code>total = 0</code><br><code>for s in scores: total += s</code><br><code>avg = total / len(scores)</code><br>What is the value of <code>avg</code>?",
    o: ["75.0", "85.0", "340.0", "90.0"],
    a: 1,
    e: "<code>total = 70 + 80 + 90 + 100 = 340</code>. <code>len(scores) = 4</code>. <code>340 / 4 = 85.0</code>."
  },
  {
    q: "What does <code>range(5)</code> produce in Python?",
    o: ["1, 2, 3, 4, 5", "0, 1, 2, 3, 4", "0, 1, 2, 3, 4, 5", "5, 4, 3, 2, 1, 0"],
    a: 1,
    e: "A single argument <code>range(n)</code> generates integers starting at 0 up to n - 1."
  },
  {
    q: "What is a sentinel value in conditional loops?",
    o: [
      "A special predetermined input value used to signal the end of data entry and terminate the loop.",
      "The hardware clock speed of the processor.",
      "A variable that counts from 1 to 10.",
      "A syntax error generated by an unclosed loop."
    ],
    a: 0,
    e: "A sentinel (e.g. entering -1 to finish entering student marks) signals loop termination."
  }
];
