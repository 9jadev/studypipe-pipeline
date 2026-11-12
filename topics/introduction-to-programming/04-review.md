# Review: introduction-to-programming (round 1)
verdict: PASS

## Blocking issues (must fix)
*None. All learning objectives, calculations, and dry-run code traces are fully verified.*

## Minor issues (fix if quick)
1. In Lesson 01 Worked Example 1.2, ensure the VAT rate is explicitly stated as 7.5% in the problem prompt. (Already clearly set in `02-lesson.md` and `03-questions.md`).

## Calculation & Logic Audit
- **Lesson 01 Arithmetic & Casting:**
  - `total = "200" + "50"` $\to$ string concatenation evaluates to `"20050"`. Verified.
  - `19 // 4` $\to$ integer division truncates to `4`. Verified.
  - `result = 12 + 8 * 2 - 6 / 2` $\to$ $12 + 16 - 3 = 25$. Verified.
  - `bonus_amount = 1500 * 0.20 = 300`, `total = 1800`. Verified.
- **Lesson 02 Boolean Truth Tables & Conditionals:**
  - `(15 > 10) and (4 == 9)` $\to$ `True and False = False`. Verified.
  - `not (8 > 10 or 12 < 15)` $\to$ `not (False or True) = not True = False`. Verified.
  - Truth table for $A \text{ AND } (\text{NOT } B)$: rows `(0,0)->0`, `(0,1)->0`, `(1,0)->1`, `(1,1)->0`. Verified.
- **Lesson 03 Loop Stepping & Accumulation:**
  - `range(2, 10, 2)` $\to$ yields `2, 4, 6, 8` (4 iterations). Verified.
  - `total = 1 + 2 + 3 + 4 = 10`. Verified.
  - Factorial product: `p = 1 * 1 * 2 * 3 * 4 = 24`. Verified.
  - Sum of odd numbers 1 to 19: $10^2 = 100$. Verified.
- **Lesson 04 Array Indexing & Bounds:**
  - Array of length 5: valid indices `0..4`. Index 5 triggers `IndexError`. Verified.
  - `marks[1] + marks[3] = 80 + 90 = 170`. Verified.
  - Array average for `[70, 80, 90, 100]`: $340 / 4 = 85.0$. Verified.
- **Lesson 05 Function Scoping & Parameters:**
  - Local variable `tax` destroyed upon function exit; accessing outside triggers `NameError`. Verified.
  - `celsius_to_fahrenheit(37.0)`: $(37.0 \times 9/5) + 32 = 66.6 + 32 = 98.6^\circ\text{F}$. Verified.
  - Shadowing demonstration: global `x = 10` remains unchanged when local `x = 15` is returned. Verified.
- **Lesson 06 Binary, Hex & Dry-Run Traces:**
  - `01010011_2` $\to$ $64 + 16 + 2 + 1 = 83_{10}$. Verified.
  - Decimal 255 $\to$ `0xFF`. Verified.
  - Hex `0x7E` $\to$ `01111110_2` ($126_{10}$). Verified.
  - Even numbers sum from `[14, 7, 22, 9]`: $14 + 22 = 36$, count = 2. Verified.

## Coverage Matrix
| Objective | Taught in (`02-lesson.md`) | Tested in (`03-questions.md`) |
|---|---|---|
| LO1 (Definitions: Program, Language, Algorithm, Scope) | Lesson 01, Lesson 05 | L01 MCQs 1, 8, 10; L01 b1; L05 MCQ 1, b1 |
| LO2 (Language Generations & Translators) | Lesson 01 | L01 MCQs 2, 3; L01 b2, b8 |
| LO3 (Data Types, Casting, Operator Precedence) | Lesson 01 | L01 MCQs 4, 5, 6, 7, 9, 11; L01 b3, b4, b6 |
| LO4 (Boolean Expressions & Conditional Branching) | Lesson 02 | L02 MCQs 1–12; L02 b1, b2, b3, b4, b5 |
| LO5 (Iteration, For/While Loops, Accumulator) | Lesson 03 | L03 MCQs 1–12; L03 b1, b2, b3, b4, b6 |
| LO6 (Array Contiguous Memory, Indexing, Bounds) | Lesson 04 | L04 MCQs 1–12; L04 b1, b2, b3, b4, b5, b8 |
| LO7 (Modular Functions, Parameters, Return, Scope) | Lesson 05 | L05 MCQs 1–12; L05 b1, b2, b3, b4, b5, b6 |
| LO8 (Binary/Hex, Dry-Run Tracing, Error Diagnosis) | Lesson 06 | L06 MCQs 1–12; L06 b1, b2, b3, b5, b6 |

## Confirmed 3D & Interactive Scenes for Renderer
| Scene ID | Type | Target parts / Events |
|---|---|---|
| `hub-lab` | 3D (`SceneKit`) / 2D (`PaperKit`) | Microcontroller CPU core, instruction registers, 8-slot RAM array, high-level/assembly/binary mode switch |
| `l01-bench` | Interactive Memory Stage | 6 labeled RAM memory slots (`0x01`–`0x06`), data type badges, type mismatch collision alert |
| `l01-zoom` | Interactive Pipeline | Step-through translation pipeline: Python statement $\to$ bytecode $\to$ binary pulses |
| `l02-bench` | Logic Gate Switchboard | Interactive `AND`, `OR`, `NOT` gates connected to generator relay with live LED indicator |
| `l02-zoom` | Flowchart Decision Tree | Dynamic branching tree highlighting active path based on input values |
| `l03-bench` | Iterative Loop Stepper | Mechanical counter gear, step execution buttons, live register displays for counter and accumulator |
| `l03-zoom` | Loop Jump Tracer | Timeline visualizer showing backward jump to loop condition |
| `l04-bench` | Array Locker Rack | 8-slot memory shelf with pointer needle, index selector, out-of-bounds buzzer |
| `l04-zoom` | Memory Offset Inspector | Address formula calculation: $\text{Base} + (\text{Index} \times \text{Size})$ |
| `l05-bench` | Function Factory Machine | Parameter input hopper, internal processing chamber, return chute |
| `l05-zoom` | Scope Boundary Box | "One-Way Glass" visualizer showing global vs local stack frame lifetimes |
| `l06-bench` | Master Recovery & Trace Console | 8-bit register toggle board, hex decoder, and live multi-column WAEC dry-run trace terminal |

## Explainer Video Plan Audit
- Formatted as `## 7. Explainer Video Plan` in `02-lesson.md`.
- Scored via `video-criteria.md`.
- Verified with `node scripts/video-picks.mjs topics/introduction-to-programming`:
  - `lesson-01`: 6 pts (YES)
  - `lesson-02`: 2 pts (NO)
  - `lesson-03`: 7 pts (YES)
  - `lesson-04`: 6 pts (YES)
  - `lesson-05`: 3 pts (NO)
  - `lesson-06`: 4 pts (NO)
- Total recommended videos: 3 (meets `video-cap: 3`). Zero discrepancies.

**Verdict: PASS.** Ready for Step 5 (Rendering).
