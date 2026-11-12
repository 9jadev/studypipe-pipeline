/* Lesson 04 · Organising Data — Arrays, Collections & Indexing
   Content data + the 12 WAEC/NECO/JAMB MCQs (window.LESSON_QUIZ) from 03-questions.md § Lesson 04.
   Live 3D bench numbers come from ProgrammingBench (mode "array-rack") and ProgrammingZoom (mode "memory-offset"). */
(function () {
  "use strict";

  var CELLS = [3.25, 3.18, 3.30, 2.95, 3.22, 3.15, 3.28, 3.20];
  var BASE_ADDR = 0x1000;
  var ELEM_SIZE = 4;

  function hexAddr(idx) {
    return "0x" + (BASE_ADDR + idx * ELEM_SIZE).toString(16).toUpperCase();
  }

  window.L04 = {
    CELLS: CELLS,
    BASE_ADDR: BASE_ADDR,
    ELEM_SIZE: ELEM_SIZE,
    hexAddr: hexAddr,

    // ---- 2A Sort game · "Read/Query vs Mutate/Update" (2 bins, 8 items) ----
    bins: {
      access: "Access & Query (reads without altering list)",
      mutate: "Mutate & Update (modifies or resizes list)"
    },
    items: [
      {
        id: "idx0",
        name: "cells[0] → read first element (3.25 V)",
        emo: "🎯",
        bin: "access",
        why: "Indexing with cells[0] reads the value at offset 0 without changing the list."
      },
      {
        id: "idxneg1",
        name: "cells[-1] → read last element from the end",
        emo: "🔚",
        bin: "access",
        why: "Negative index -1 reads the final item (cells[7] = 3.20 V) without mutating memory."
      },
      {
        id: "lenop",
        name: "len(cells) → return total item count (8)",
        emo: "📏",
        bin: "access",
        why: "len() queries the collection size N without modifying any stored element."
      },
      {
        id: "idx3",
        name: "cells[3] → inspect 4th cell voltage (2.95 V)",
        emo: "🔍",
        bin: "access",
        why: "Reading cells[3] fetches the 4th element at Base + 12 bytes without altering the array."
      },
      {
        id: "assign1",
        name: "cells[3] = 3.30 → replace weak cell reading",
        emo: "✏️",
        bin: "mutate",
        why: "Indexed assignment overwrites the value stored in slot 3 (4th element) in place."
      },
      {
        id: "appendop",
        name: "cells.append(3.26) → add new item to the end",
        emo: "➕",
        bin: "mutate",
        why: ".append() mutates the list by increasing its length N and storing a new element at the end."
      },
      {
        id: "popop",
        name: "cells.pop() → remove and return last item",
        emo: "📤",
        bin: "mutate",
        why: ".pop() mutates the collection by removing the final element and shrinking length N by 1."
      },
      {
        id: "insertop",
        name: "cells.insert(0, 3.29) → insert at start & shift",
        emo: "📥",
        bin: "mutate",
        why: ".insert() mutates the list by placing a new value at index 0 and shifting subsequent elements right."
      }
    ],

    // ---- Make Sense · Memory Offset & Index Explorer (#pos-explorer) ----
    pins: [
      {
        idx: 0,
        label: "Index 0 · 1st Cell (Base)",
        note: "Offset = 0 × 4 = 0 bytes. Because the 1st item sits right at Base Address 0x1000, its displacement is 0 — that is why indexing starts at 0!"
      },
      {
        idx: 1,
        label: "Index 1 · 2nd Cell",
        note: "Offset = 1 × 4 = +4 bytes → 0x1004. Stepping one index forward advances the memory pointer by exactly one 4-byte float slot."
      },
      {
        idx: 3,
        label: "Index 3 · 4th Cell (Weakest)",
        note: "Offset = 3 × 4 = +12 bytes → 0x100C. Holds 2.95 V — the weakest lithium cell in the Ikogosi clinic battery rack!"
      },
      {
        idx: 6,
        label: "Index 6 · 7th Cell",
        note: "Offset = 6 × 4 = +24 bytes → 0x1018. Second-to-last element; in Python it can also be read with negative index cells[-2]."
      },
      {
        idx: 7,
        label: "Index 7 · 8th Cell (N − 1)",
        note: "Offset = 7 × 4 = +28 bytes → 0x101C. For N = 8 items, the maximum valid index is N − 1 = 7 (or cells[-1])."
      },
      {
        idx: 8,
        label: "Index 8 · Out of Bounds!",
        note: "Offset = 8 × 4 = +32 bytes → 0x1020. Outside the 32-byte allocation (0x1000..0x101F)! Python halts with IndexError: list index out of range."
      }
    ],
    refPin: 2,

    // ---- Apply · The Bridge (Patching battery_check.py for the Ikogosi Clinic Fridge) ----
    bridge: [
      {
        q: "Tari's buggy loop in battery_check.py is: for i in range(1, 9): check_cell(battery_cells[i]). With 8 cells in battery_cells, what two errors does this cause?",
        o: [
          "It skips battery_cells[0] (1st cell) and crashes at battery_cells[8] with IndexError",
          "It checks battery_cells[0] twice and stops at index 7",
          "It sorts the battery cells in reverse order"
        ],
        a: 0,
        why: "range(1, 9) generates 1, 2, 3, 4, 5, 6, 7, 8. Starting at 1 skips index 0 (the 1st cell), and reaching 8 exceeds the last valid index (7), raising IndexError."
      },
      {
        q: "Which cell in cells = [3.25, 3.18, 3.30, 2.95, 3.22, 3.15, 3.28, 3.20] is failing (below 3.00 V), and what are its 0-based index and 1-based physical slot?",
        o: [
          "Index 4 (5th physical cell) at 3.22 V",
          "Index 3 (4th physical cell) at 2.95 V",
          "Index 2 (3rd physical cell) at 3.30 V"
        ],
        a: 1,
        why: "Counting from 0: cells[0]=3.25, cells[1]=3.18, cells[2]=3.30, cells[3]=2.95 V. Index 3 is the 4th physical battery slot."
      },
      {
        q: "Which patched Python loop safely scans all 8 cells (indices 0 to 7) and restores the clinic vaccine refrigerator to +4.1 °C?",
        o: [
          "for i in range(1, len(battery_cells) + 1): check_cell(battery_cells[i])",
          "for i in range(len(battery_cells)): check_cell(battery_cells[i])",
          "for i in range(0, 9): check_cell(battery_cells[i])"
        ],
        a: 1,
        why: "range(len(battery_cells)) is range(8), which yields 0, 1, 2, 3, 4, 5, 6, 7 — every valid index from 0 to N − 1 with zero off-by-one risk!"
      }
    ],

    quiz: []
  };

  window.LESSON_QUIZ = [
    {
      q: "An array (or list) in computer programming is:",
      o: [
        "a single variable that can only hold one character",
        "a collection of data elements stored in contiguous memory locations under a single identifier",
        "a hardware expansion card for gaming",
        "an operating system error file"
      ],
      a: 1,
      e: "An array stores multiple sequential elements in contiguous (adjoining) memory locations accessible via index numbers under a single unified identifier."
    },
    {
      q: "In Python, given <code>devices = [\"Inverter\", \"Battery\", \"Panel\", \"Sensor\"]</code>, what is the value of <code>devices[0]</code>?",
      o: ["Inverter", "Battery", "Panel", "Error"],
      a: 0,
      e: "Standard high-level languages use zero-based indexing; the first element is at index <code>0</code>, so <code>devices[0]</code> is <code>\"Inverter\"</code>."
    },
    {
      q: "For the list <code>voltages = [220, 230, 240, 215, 225]</code>, what is <code>len(voltages)</code> and what is the index of the last element?",
      o: [
        "Length = 5, Last Index = 5",
        "Length = 5, Last Index = 4",
        "Length = 4, Last Index = 4",
        "Length = 5, Last Index = 0"
      ],
      a: 1,
      e: "<code>len()</code> returns the total element count (5). In zero-based indexing, valid indices are <code>0, 1, 2, 3, 4</code>, so the last index is <code>len - 1 = 4</code>."
    },
    {
      q: "Tari writes:<br><code>meters = [\"M1\", \"M2\", \"M3\"]</code><br><code>print(meters[3])</code><br>What occurs when this code runs?",
      o: [
        "Prints M3",
        "Prints None",
        "IndexError: list index out of range",
        "Prints M1"
      ],
      a: 2,
      e: "The list has 3 elements at indices <code>0, 1, 2</code>. Index <code>3</code> is out of bounds and triggers an <code>IndexError: list index out of range</code>."
    },
    {
      q: "If <code>marks = [65, 80, 45, 90]</code>, what is the result of <code>marks[1] + marks[3]</code>?",
      o: ["110", "170", "125", "155"],
      a: 1,
      e: "<code>marks[1] = 80</code> (second item) and <code>marks[3] = 90</code> (fourth item). Therefore <code>80 + 90 = 170</code>."
    },
    {
      q: "Which statement replaces the second element of <code>names = [\"Amina\", \"Tari\", \"Emeka\"]</code> with <code>\"Chinedu\"</code>?",
      o: [
        "names[2] = \"Chinedu\"",
        "names[1] = \"Chinedu\"",
        "names(1) = \"Chinedu\"",
        "names.replace(\"Tari\", \"Chinedu\")"
      ],
      a: 1,
      e: "In zero-based indexing, the second element is at index <code>1</code>. Square-bracket assignment <code>names[1] = \"Chinedu\"</code> updates it in place."
    },
    {
      q: "In Python, what does negative indexing <code>items[-1]</code> access?",
      o: [
        "The first element",
        "The very last element in the collection",
        "A random element",
        "Triggers an error"
      ],
      a: 1,
      e: "Negative index <code>-1</code> counts backwards from the end of the list, accessing the final element (equivalent to <code>items[len(items) - 1]</code>)."
    },
    {
      q: "What is the value of <code>total</code> after this loop completes?<br><code>nums = [2, 4, 6]</code><br><code>total = 1</code><br><code>for n in nums: total *= n</code>",
      o: ["12", "48", "24", "8"],
      a: 1,
      e: "Tracing each iteration: <code>total = 1 * 2 = 2</code>; then <code>2 * 4 = 8</code>; then <code>8 * 6 = 48</code>."
    },
    {
      q: "What is the time efficiency advantage of accessing an array element by its index?",
      o: [
        "The computer must search from the start of the list every time.",
        "Direct memory access via address calculation (Base + Index × Size) allows instantaneous O(1) access.",
        "It consumes half the battery power of a variable.",
        "It automatically sorts the list."
      ],
      a: 1,
      e: "Because arrays occupy contiguous memory, the exact byte address is computed directly via <code>Base + Index × Size</code>, giving constant-time O(1) retrieval."
    },
    {
      q: "Amina needs to find the largest value in an array <code>readings</code>. Which algorithm strategy is correct?",
      o: [
        "Set max_val = 0, then compare each element; if element > max_val, update max_val.",
        "Set max_val = readings[0], iterate through readings, and if item > max_val, update max_val = item.",
        "Sum all numbers and divide by count.",
        "Print readings[len(readings)]."
      ],
      a: 1,
      e: "Initializing <code>max_val = readings[0]</code> guarantees a valid starting benchmark from the collection itself, working accurately for both positive and negative numbers."
    },
    {
      q: "What method appends a new element to the end of an existing Python list?",
      o: [
        "list.add(item)",
        "list.push(item)",
        "list.append(item)",
        "list.insert_end(item)"
      ],
      a: 2,
      e: "In Python, the <code>.append(item)</code> method adds a single new element to the end of a list."
    },
    {
      q: "Why is an off-by-one error so common when working with arrays?",
      o: [
        "Programmers confuse natural 1-based human counting with 0-based machine offset indexing.",
        "Arrays cannot hold odd numbers.",
        "Compilers randomly delete the last item.",
        "Integers cannot be used as indices."
      ],
      a: 0,
      e: "Humans naturally count items starting at 1 (1 to N), whereas computer memory offsets start at 0 (0 to N − 1), making boundary slips by ±1 very common."
    }
  ];

  window.L04.quiz = window.LESSON_QUIZ;
})();
