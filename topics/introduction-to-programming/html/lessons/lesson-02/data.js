/* Lesson 02 · Making Decisions — Conditional Logic, Boolean Operators & Branching
   Content data + the 12 WAEC/NECO/JAMB MCQs (window.LESSON_QUIZ) from 03-questions.md § Lesson 02. */
(function () {
  "use strict";

  window.L02 = {
    // ---- 2A Sort game · "Evaluates to True or False?" (2 bins, 8 items) ----
    bins: {
      true_bin: "Evaluates to True (1)",
      false_bin: "Evaluates to False (0)"
    },
    items: [
      { id: "s1", name: "(10 > 5) and (3 == 3)", emo: "🟢", bin: "true_bin", why: "10 > 5 is True and 3 == 3 is True; True and True evaluates to True." },
      { id: "s2", name: "not (4 < 2)", emo: "🔄", bin: "true_bin", why: "4 < 2 is False; applying not inverts False into True." },
      { id: "s3", name: "(8 == 8) or (2 > 10)", emo: "⚡", bin: "true_bin", why: "In an OR operation, since 8 == 8 is True, True or False evaluates to True." },
      { id: "s4", name: "100 >= 100", emo: "💯", bin: "true_bin", why: "100 is equal to 100, so >= (greater than or equal to) evaluates to True." },
      { id: "s5", name: "(15 > 10) and (4 == 9)", emo: "🔴", bin: "false_bin", why: "AND requires both sides to be True. Since 4 == 9 is False, True and False evaluates to False." },
      { id: "s6", name: "not (8 > 10 or 12 < 15)", emo: "🚫", bin: "false_bin", why: "Inside parentheses, False or True is True; applying not True gives False." },
      { id: "s7", name: "(8 == 9) or (5 > 10)", emo: "❌", bin: "false_bin", why: "Both 8 == 9 and 5 > 10 are False; False or False evaluates to False." },
      { id: "s8", name: "7 == \"7\"", emo: "🔤", bin: "false_bin", why: "An integer (7) is not strictly equal to a string (\"7\") in Python, so == returns False." }
    ],

    // ---- Make Sense · Multi-way Branching Explorer (JAMB & NEPA Tariff Bands) ----
    pins: [
      { score: 245, hours: 22, label: "JAMB 245 · 22h", cat: "Eligible (Merit) / Band A", branch: "if branch (1st condition)", note: "<code>score >= 200</code> is True (245 >= 200) and <code>hours >= 20</code> is True (22 >= 20). The very first <code>if</code> block runs and all <code>elif</code>/<code>else</code> branches are skipped." },
      { score: 200, hours: 20, label: "JAMB 200 · 20h", cat: "Eligible (Boundary) / Band A", branch: "if branch (boundary ==)", note: "Boundary test! Because the operator is <code>>=</code> (greater than or equal to), <code>200 >= 200</code> evaluates to True." },
      { score: 182, hours: 18, label: "JAMB 182 · 18h", cat: "Pre-Degree / Band B", branch: "1st elif branch", note: "<code>182 >= 200</code> is False, so Python tests the first <code>elif</code>: <code>182 >= 160</code> is True! It assigns Pre-Degree (and Band B for 18h) and skips the rest." },
      { score: 160, hours: 16, label: "JAMB 160 · 16h", cat: "Pre-Degree / Band B", branch: "1st elif (boundary)", note: "<code>160 >= 200</code> is False; <code>160 >= 160</code> is True. Inclusive <code>>=</code> catches the exact cut-off mark." },
      { score: 145, hours: 14, label: "JAMB 145 · 14h", cat: "Not Eligible / Band C", branch: "else / 2nd elif branch", note: "For JAMB, both <code>>= 200</code> and <code>>= 160</code> fail, so the catch-all <code>else</code> assigns Not Eligible. For NEPA, <code>14 >= 12</code> matches Band C." },
      { score: 110, hours: 8, label: "JAMB 110 · 8h", cat: "Not Eligible / Band D", branch: "else catch-all", note: "All preceding <code>if</code> and <code>elif</code> conditions evaluate to False, so the default <code>else</code> block executes safely." }
    ],
    refPin: 2,

    // ---- Apply · The Bridge (Repairing generator_control.py at Ikogosi) ----
    bridge: [
      {
        q: "In line 14 of generator_control.py, Amina sees: if battery_level < 20 and grid_online == True. When battery_level is 18% during a blackout (grid_online is False), what does this buggy expression evaluate to?",
        o: ["True — the generator starts", "False — because True and False is False", "SyntaxError"],
        a: 1,
        why: "battery_level < 20 is True (18 < 20), but grid_online == True is False during a blackout. In an AND gate, True and False evaluates to False, locking out the generator!"
      },
      {
        q: "Tari suggests replacing 'and' with 'or': if battery_level < 20 or not grid_online. What goes wrong when the battery is healthy at 85% during an evening grid outage?",
        o: ["The generator starts unnecessarily and wastes diesel fuel", "The generator never starts", "The solar panels shut down"],
        a: 0,
        why: "With OR, as soon as not grid_online is True, the whole condition becomes True even at 85% battery — burning expensive diesel when solar storage is full."
      },
      {
        q: "Which boolean condition safely starts the backup generator ONLY when the battery is below 20% AND the main grid is offline?",
        o: ["if battery_level < 20 or grid_online == False:", "if battery_level < 20 and not grid_online:", "if not (battery_level < 20 and grid_online):"],
        a: 1,
        why: "Both conditions must hold simultaneously: battery_level < 20 (True) AND not grid_online (not False = True), giving True and True = True."
      }
    ]
  };

  window.LESSON_QUIZ = [
    {
      q: "Which relational operator tests whether two values are strictly equal in Python and C?",
      o: ["=", "==", ":=", "<>"],
      a: 1,
      e: "<code>==</code> is the equality comparison operator. Single <code>=</code> is the variable assignment operator."
    },
    {
      q: "Evaluate the boolean expression: <code>(15 &gt; 10) and (4 == 9)</code>.",
      o: ["True", "False", "15", "Error"],
      a: 1,
      e: "In an <code>AND</code> operation, both operands must be true. Since <code>4 == 9</code> is <code>False</code>, <code>True and False</code> evaluates to <code>False</code>."
    },
    {
      q: "If <code>x = 8</code> and <code>y = 12</code>, what does <code>not (x &gt; 10 or y &lt; 15)</code> evaluate to?",
      o: ["True", "False", "None", "12"],
      a: 1,
      e: "<code>x &gt; 10</code> is <code>False</code>. <code>y &lt; 15</code> is <code>True</code>. <code>False or True</code> evaluates to <code>True</code>. Applying <code>not True</code> gives <code>False</code>."
    },
    {
      q: "Examine the conditional block:<br><code>score = 72<br>if score &gt;= 75: grade = \"A\"<br>elif score &gt;= 65: grade = \"B\"<br>elif score &gt;= 50: grade = \"C\"<br>else: grade = \"F\"</code><br>What value is assigned to <code>grade</code>?",
      o: ["\"A\"", "\"B\"", "\"C\"", "\"F\""],
      a: 1,
      e: "<code>score &gt;= 75</code> is false (72 &lt; 75). The next condition <code>score &gt;= 65</code> is true (72 &gt;= 65), so <code>\"B\"</code> is assigned and subsequent branches are skipped."
    },
    {
      q: "In the Ikogosi solar microgrid, the backup generator must start only when <code>battery &lt; 20</code> percent AND the main grid is offline (<code>grid_active == False</code>). Which expression correctly models this condition?",
      o: [
        "battery < 20 or grid_active == False",
        "battery < 20 and not grid_active",
        "not (battery < 20 and grid_active)",
        "battery < 20 and grid_active"
      ],
      a: 1,
      e: "Both conditions must hold simultaneously: battery must be critically low (<code>battery &lt; 20</code>) AND the grid must be inactive (<code>not grid_active</code>)."
    },
    {
      q: "In a flowchart, which geometric shape represents a conditional decision point with branching exit paths?",
      o: ["Rectangle", "Oval", "Diamond (Rhombus)", "Parallelogram"],
      a: 2,
      e: "The diamond represents a decision point and always has two or more labeled exit arrows (<code>True</code>/<code>False</code> or <code>Yes</code>/<code>No</code>)."
    },
    {
      q: "An <code>else</code> statement in a decision structure:",
      o: [
        "requires an explicit boolean test condition",
        "executes only when all preceding if and elif conditions evaluate to False",
        "executes before the if statement",
        "terminates the entire computer operating system"
      ],
      a: 1,
      e: "<code>else</code> takes no condition; it is a catch-all block that triggers when preceding tests fail."
    },
    {
      q: "What will the following code output?<br><code>balance = 5000<br>withdrawal = 5000<br>if withdrawal &lt;= balance:<br>&nbsp;&nbsp;balance -= withdrawal<br>&nbsp;&nbsp;print(\"Dispensed\")<br>else:<br>&nbsp;&nbsp;print(\"Declined\")</code>",
      o: ["Declined", "Dispensed", "Error: Zero balance", "None"],
      a: 1,
      e: "<code>5000 &lt;= 5000</code> evaluates to <code>True</code>, so <code>\"Dispensed\"</code> is printed."
    },
    {
      q: "In boolean algebra, the expression <code>A OR (NOT A)</code> always evaluates to:",
      o: ["True (1)", "False (0)", "A", "Undefined"],
      a: 0,
      e: "If A is true, <code>True or False = True</code>. If A is false, <code>False or True = True</code>. It is a tautology."
    },
    {
      q: "What is the main danger of omitting an <code>else</code> branch in an automated control system?",
      o: [
        "The CPU will overheat",
        "Unanticipated states or invalid input values may bypass control and leave outputs unhandled",
        "The program syntax becomes automatically invalid",
        "Variable names will be erased from RAM"
      ],
      a: 1,
      e: "An <code>else</code> catch-all guarantees that unexpected or edge-case conditions are safely handled."
    },
    {
      q: "If <code>age = 16</code> and <code>has_voters_card = True</code>, what is the result of <code>age &gt;= 18 and has_voters_card</code>?",
      o: ["True", "False", "16", "SyntaxError"],
      a: 1,
      e: "<code>age &gt;= 18</code> is <code>False</code>, so the <code>AND</code> expression immediately yields <code>False</code>."
    },
    {
      q: "Amina tests: <code>if x &gt; 5: print(\"High\") elif x &gt; 2: print(\"Med\") else: print(\"Low\")</code>. If <code>x = 10</code>, what is printed?",
      o: ["High", "High followed by Med", "Med", "Low"],
      a: 0,
      e: "In multi-way <code>elif</code> structures, once the first matching branch (<code>x &gt; 5</code>) executes, the remaining branches are ignored."
    }
  ];
})();
