# Direction Script: Lesson 03 · The Power of Repetition — Counter & Conditional Loops

## Overview
The video resolves Tari's runaway loop crisis at the Ikogosi Warm Springs clinic mini-grid (where cooling fans roar as a loop lacking variable progression freezes the computer at 99% CPU). It introduces counter-controlled `FOR` loops and the mechanics of Python's `range(start, stop, step)`, explains the hardware-level back-edge execution jump, traces the accumulator pattern across 7 days of solar readings (`[45, 52, 60, 58, 49, 63, 55] kWh` accumulating to `382 kWh`, daily average `54.57 kWh`), diagnoses condition-controlled `WHILE` loops and sentinel termination, and walks through a classic WAEC trace table practice question (`total = 1+2+3+4 = 10`). It opens the **Make Sense** phase of Lesson 03. Quizzes stay in Apply.

| Item | Decision |
| --- | --- |
| Running time | About 8.4 minutes, 6 chapters, 42 narration cues + 15 s student hold |
| Narrator | One teacher voice, Nigerian English (`en-NG`) |
| Level | Senior Secondary Computer Studies (SS2), WAEC / NECO / JAMB |
| Theme | Unit theme (`meta.theme` unset, follows `green-lab`) |
| Kits used | `code-trace` (`scene: 'loop'`) for loop flowcharts, back-edge pulses, 7-day solar bar chart, and infinite-loop bug alarm · `graph` for cumulative energy trajectory curve · animated LaTeX board for formulas and step tables |
| Camera | Wide by default; push-ins on flowchart and trace registers (`focus: 'flowchart'`, `focus: 'trace'`); camera wide for full board demonstrations |
| End card | `meta.next: '#apply'`, `nextLabel: 'Continue to Apply →'` |

**Colour roles:**

| Role | Meaning | Palette colour |
| --- | --- | --- |
| `code` | Loop variable, index, syntax keyword | sky |
| `val` | Sensor reading, data value | green |
| `acc` | Accumulator register, running sum | gold |
| `err` | Runaway loop, bug trap, off-by-one error | red |
| `flow` | Control flow decision, loop condition | purple |

**Accuracy notes:**
- **The Ikogosi Phenomenon:** Tari's loop `while panel_idx <= 12:` fails because `panel_idx` is never incremented inside the loop block. The CPU never exits, locking processor utilization at 99%. Incrementing `panel_idx += 1` allows the index to reach 13, cleanly failing `13 <= 12` after exactly 12 panels.
- **Python `range()` Exclusivity:** `range(start, stop, step)` generates values strictly strictly less than `stop` (`start <= i < stop`). In `range(2, 10, 2)`, the sequence is `2, 4, 6, 8` (4 iterations); 10 is the stop boundary and is never generated.
- **7-Day Solar Readings:** The 7-day generation readings are `[45, 52, 60, 58, 49, 63, 55] kWh`. The cumulative sum steps through `45, 97, 157, 215, 264, 327, 382 kWh`. The daily arithmetic mean is `382 / 7 = 54.5714... → 54.57 kWh` (rounded to 2 decimal places).
- **The Back-Edge Jump:** Under the hood, a loop is a backward control flow jump. The CPU executes the body, updates the counter, and executes an unconditional jump instruction back to the condition diamond.
- **WAEC Trace Table:** `total = 0; for i in range(1, 5): total += i`. The values generated are `1, 2, 3, 4`. Steps: `0+1=1`, `1+2=3`, `3+3=6`, `6+4=10`. Mistakenly including 5 gives 15 (a common exam trap).

---

## Chapter 1: Hook — The Ikogosi Runaway Loop (about 1 min 20 s)
Diagnoses the runaway loop freeze at Ikogosi clinic and outlines the video objectives.

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 1.1 | At the Ikogosi Warm Springs clinic, cooling fans roar as the computer processor freezes at ninety-nine percent. | New board: "Ikogosi solar freeze"<br>Kit code-trace: scene='loop', stage=1, step=0, bug=1, labels=1, focus='flowchart'<br>📷 WIDE → flowchart<br>Board: Ikogosi clinic: 99% CPU | Hook / opening phenomenon from 02-lesson.md |
| 1.2 | Tari inspects the monitor and finds identical log messages flooding the console: checking solar panel one, over and over. | Board: while panel_idx <= 12:<br>Board: print(panel_idx) (at 3s) | Show buggy while loop code |
| 1.3 | The variable panel index is never incremented inside the loop. It stays at one forever, trapped in an infinite cycle. | Board: panel_idx = 1 (stuck!) (note: never updates) | Diagnose omission of loop counter progression |
| 1.4 | Chief Babatunde asks how a computer knows when to repeat tasks and when to stop cleanly without crashing the clinic. | New board: "The mystery"<br>Kit code-trace: bug=1, focus=null<br>📷 WIDE<br>Board: Chief: how to stop cleanly? | Central inquiry question |
| 1.5 | By the end of this video, you will command counted loops, trace execution back-edges, build accumulators, and write foolproof while loops. | New board: "Objectives"<br>Kit code-trace: bug=0<br>Board: ☐ counted FOR loops and range()<br>Board: ☐ flowcharts and back-edges (at 2.2s)<br>Board: ☐ the accumulator pattern (at 4.2s)<br>Board: ☐ safe WHILE loops and traces (at 6.2s) | Video roadmap and learning outcomes |

---

## Chapter 2: Counter-Controlled `FOR` Loops & `range(start, stop, step)` (about 1 min 30 s)
Introduces counted loops, Python's `range()` parameters, and the stop exclusivity rule.

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 2.1 | Repetition in programming is called iteration. When you know in advance how many times an action must repeat, use a counter-controlled loop. | New board: "Counter-controlled loops"<br>Kit: none<br>📷 WIDE<br>Board: FOR loop: known count | Definition of counter-controlled loop |
| 2.2 | In Python, the range function generates a sequence of integers from start up to stop minus one, increasing by step. | Board: range(start, stop, step)<br>Board: stop is strictly excluded! (note: stop - 1, at 3s) | Syntax and mathematical boundary rule |
| 2.3 | Let us examine range two comma ten comma two. We start at two, increment by two, and stop strictly before ten. | New board: "Worked example: range()"<br>Board: for i in range(2, 10, 2):<br>Board: i in {2, 4, 6, 8} (at 3s) | Concrete execution values |
| 2.4 | The values generated are two, four, six, and eight. That gives exactly four iterations, never reaching ten. | Board: N = (10 - 2)/2 = 4 iterations<br>Box: N = 4 iterations | Formula for iteration count |
| 2.5 | If you omit step, Python increments by one. Range one comma five gives one, two, three, and four: four iterations. | New board: "Default parameters"<br>Board: range(1, 5) → {1, 2, 3, 4}<br>Board: N = 5 - 1 = 4 iterations (at 3s) | Default step = 1 rule |
| 2.6 | If you also omit start, Python starts at zero. Range five gives zero, one, two, three, and four: five iterations. | Board: range(5) → {0, 1, 2, 3, 4}<br>Board: starts at 0 → 5 iterations (at 3s)<br>Box: 5 iterations | Default start = 0 rule (WAEC favourite) |

---

## Chapter 3: The Back-Edge Execution Jump & Condition Testing (about 1 min 30 s)
Explains the loop flowchart cycle, condition diamonds, and the hardware back-edge jump.

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 3.1 | How does the processor actually carry out a loop in memory? Look at the execution flowchart on the left. | New board: "The loop engine"<br>Kit code-trace: scene='loop', stage=2, step=0, bug=0, labels=1, focus='flowchart'<br>📷 WIDE → flowchart<br>Board: 1. Initialize: total=0, i=0 | Step 1: memory initialization |
| 3.2 | First, the processor tests the condition diamond. Is i less than seven? Zero is less than seven, so condition is true. | Board: 2. Test: i < 7 → True | Step 2: boolean evaluation |
| 3.3 | Next, execution enters the loop body and adds the reading, then advances the counter i by one. | Board: 3. Body: total += read[i]<br>Board: 4. Step: i = i + 1 (at 3s) | Step 3 & 4: body execution and counter increment |
| 3.4 | Now observe the curved feedback path on the left. This is the back-edge execution jump. | New board: "The back-edge jump"<br>Board: 5. Back-edge: jump to test<br>Board: CPU branches back to condition (note: back-edge, at 3s) | Demystify the mechanical jump |
| 3.5 | As long as the condition evaluates to true, execution circles along this back-edge path again and again. | Kit code-trace: step=1<br>Board: repeat while i < 7 is True | Iterative looping animation |
| 3.6 | When i finally reaches seven, seven less than seven is false. The condition fails, and execution breaks out of the loop. | Kit code-trace: step=7<br>Board: i = 7: 7 < 7 → False<br>Board: Exit loop cleanly (at 3s)<br>Box: Exit loop cleanly | Loop termination condition |

---

## Chapter 4: The Accumulator Pattern across 7-Day Solar Readings (about 2 min)
Demonstrates the accumulator pattern (`total += val`) across the 7-day solar data and plots the trajectory curve with the `graph` kit.

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 4.1 | Worked example. Chief Babatunde needs the total weekly energy and daily average generated by Ikogosi clinic over seven days. | New board: "Accumulator pattern"<br>Kit code-trace: scene='loop', stage=3, step=0, bug=0, labels=1, focus='trace'<br>📷 WIDE → trace<br>Board: 7-day solar readings (kWh):<br>Board: [45, 52, 60, 58, 49, 63, 55] (at 3s) | Practical engineering context |
| 4.2 | An accumulator is a variable initialized outside the loop, typically to zero, which collects values by adding to itself on each pass. | Board: total = 0 (init outside)<br>Board: total += reading (at 3s) | Formal definition of accumulator |
| 4.3 | In step zero, we add forty-five kilowatt-hours. The running total becomes forty-five. | New board: "Tracing the sum"<br>Board: i = 0: total = 0 + 45 = 45 kWh | Trace iteration 0 |
| 4.4 | In step one, adding fifty-two brings total to ninety-seven. In step two, sixty brings total to one hundred and fifty-seven. | Kit code-trace: step=2<br>Board: i = 1: total = 45 + 52 = 97 kWh<br>Board: i = 2: total = 97 + 60 = 157 kWh (at 3.5s) | Trace iterations 1 & 2 |
| 4.5 | By step three, adding fifty-eight gives two hundred and fifteen. Each iteration accumulates one more day onto the pile. | Kit code-trace: step=3<br>Board: i = 3: total = 157 + 58 = 215 kWh | Trace iteration 3 (midpoint) |
| 4.6 | After all seven days, the final reading brings the total to three hundred and eighty-two kilowatt-hours. | New board: "Weekly totals"<br>Kit code-trace: stage=4, step=7<br>Board: Σ = 45+52+60+58+49+63+55<br>Board: total = 382 kWh (at 3s)<br>Box: total = 382 kWh | Final accumulated total |
| 4.7 | Dividing three hundred and eighty-two by seven gives an average daily generation of fifty-four point five seven kilowatt-hours. | Board: mean = 382 / 7 = 54.57 kWh<br>Box: mean = 54.57 kWh | Daily average calculation (2 d.p.) |
| 4.8 | Plotting cumulative solar energy day by day reveals a steady climbing curve, rising from zero up to three hundred and eighty-two. | New board: "Cumulative yield graph"<br>Kit graph: spec=SOLAR_GRAPH, show=[pts, line, g7, p7]<br>📷 WIDE<br>Board: Accumulator trajectory<br>Board: Day 7: 382 kWh (at 3s) | Graph representation of accumulation curve |

---

## Chapter 5: Condition-Controlled `WHILE` Loops & Preventing Infinite Loops (about 1 min 30 s)
Covers condition-controlled repetition, the 3 mandatory loop pillars, the runaway infinite-loop bug, and sentinel values.

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 5.1 | When repetition depends on an ongoing condition or unknown count, use a condition-controlled WHILE loop. | New board: "Condition-controlled loops"<br>Kit: none<br>📷 WIDE<br>Board: WHILE loop: conditional repetition<br>Board: while <condition>: (at 2.5s) | Definition of WHILE loop |
| 5.2 | Every safe while loop requires three pillars: initialization outside, a condition check at the top, and step progression inside. | Board: 1. Initialize variable outside (at 1s)<br>Board: 2. Test condition at top (at 3s)<br>Board: 3. Update variable in body (at 5s) | The 3 essential pillars of loop safety |
| 5.3 | Watch what happens when a programmer forgets the third pillar: the step update. Look at the red alarm in our code tracer! | New board: "The runaway bug"<br>Kit code-trace: scene='loop', stage=4, step=0, bug=1, labels=1, focus='flowchart'<br>📷 WIDE → flowchart<br>Board: count = 1<br>Board: while count <= 5: (at 2s)<br>Board: print(count) (at 3.5s) | Recreate runaway loop bug |
| 5.4 | Count stays stuck at one forever. One less than or equal to five is always true, locking the system in an infinite loop! | Board: 1 <= 5 → Always True! (note: CPU frozen)<br>Board: Missing: count += 1 (at 3s)<br>Box: Missing: count += 1 | Explain cause of processor lockup |
| 5.5 | To fix Tari's Ikogosi code, add panel index plus equals one inside the loop block. It checks panels one to twelve, and stops at thirteen. | New board: "The Ikogosi fix"<br>Kit code-trace: bug=0<br>Board: while panel_idx <= 12:<br>Board: panel_idx += 1 (at 2s)<br>Board: Stops at panel_idx = 13 (at 4s)<br>Box: Stops at panel_idx = 13 | Resolution of opening mystery |
| 5.6 | For sensor reading until an external stop signal, programmers use a sentinel value, such as entering minus one to terminate. | New board: "Sentinel values"<br>Board: Sentinel: exit signal flag<br>Board: while sensor != -1: (at 2.5s) | Introduce sentinel value concept |

---

## Chapter 6: WAEC Trace Table Practice & Summary (about 2 min)
Walks through an interactive WAEC trace table problem with a 15-second pause-and-try countdown, covers off-by-one and scoping pitfalls, and delivers the lesson summary.

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 6.1 | Now it is your turn. A classic WAEC question asks for the final value of total after this loop executes. | New board: "WAEC practice"<br>Kit: none<br>📷 WIDE<br>Board: total = 0<br>Board: for i in range(1, 5): (at 2s)<br>Board: total += i (at 4s) | Problem statement from 03-questions.md |
| 6.2 | Construct a trace table on paper and find the final total. Pause the video and calculate now. | Board: Find final value of total<br>⏱️ HOLD 15s | Pause-and-try prompt for active practice |
| 6.3 | Let us trace it step by step. Range one comma five generates integers one, two, three, and four, stopping before five. | New board: "Step-by-step trace"<br>Board: i in {1, 2, 3, 4} | Boundary review |
| 6.4 | At step one, total is one. At step two, one plus two is three. At step three, three plus three is six. | Board: i = 1: total = 0 + 1 = 1<br>Board: i = 2: total = 1 + 2 = 3 (at 2.5s)<br>Board: i = 3: total = 3 + 3 = 6 (at 5s) | Trace steps 1 to 3 |
| 6.5 | At step four, six plus four gives ten. The loop ends, and the final value of total is ten. | Board: i = 4: total = 6 + 4 = 10<br>Board: Final total = 10 (at 3s)<br>Box: Final total = 10 | Confirm correct answer |
| 6.6 | Beware the off-by-one trap: range one to five does not include five. Adding five would wrongly give fifteen. | New board: "Common mistakes"<br>Board: ✗ include 5 → 15<br>Board: ✓ stop at 4 → 10 (at 3s) | Caution against off-by-one trap |
| 6.7 | And never initialize your accumulator inside the loop, or it will reset to zero on every single pass! | Board: ✗ total = 0 inside loop<br>Board: ✓ initialize outside loop (at 3s) | Caution against accumulator scope reset |
| 6.8 | To summarize: use FOR for counted iteration, while for conditions, step your variables to avoid infinite loops, and trace your steps carefully. Well done! | New board: "Summary"<br>Board: FOR: counted repetition<br>Board: WHILE: conditional repetition (at 2.5s)<br>Board: Accumulator: init outside to 0 (at 5s)<br>Board: Back-edge: jump to condition test (at 7.5s)<br>Box: Back-edge | Summary recap and call to action |

---

## Build checks and kit gaps

### Numerical Checks
| Check Name | Formula / Test | Expected Value |
|---|---|---|
| `CPU freeze load` | `99` | `99` |
| `Ikogosi panel count` | `12` | `12` |
| `Ikogosi exit index` | `12 + 1` | `13` |
| `range(2, 10, 2) iterations` | `(10 - 2) / 2` | `4` |
| `range(2, 10, 2) values sum` | `2 + 4 + 6 + 8` | `20` |
| `range(1, 5) count` | `5 - 1` | `4` |
| `range(1, 5) sum` | `1 + 2 + 3 + 4` | `10` |
| `range(5) count` | `5` | `5` |
| `7-day solar total` | `45 + 52 + 60 + 58 + 49 + 63 + 55` | `382` |
| `7-day solar mean (2 d.p.)` | `Math.round((382 / 7) * 100) / 100` | `54.57` |
| `cumulative day 1` | `45` | `45` |
| `cumulative day 2` | `45 + 52` | `97` |
| `cumulative day 3` | `45 + 52 + 60` | `157` |
| `cumulative day 4` | `45 + 52 + 60 + 58` | `215` |
| `cumulative day 5` | `45 + 52 + 60 + 58 + 49` | `264` |
| `cumulative day 6` | `45 + 52 + 60 + 58 + 49 + 63` | `327` |
| `cumulative day 7` | `45 + 52 + 60 + 58 + 49 + 63 + 55` | `382` |
| `WAEC step 1` | `0 + 1` | `1` |
| `WAEC step 2` | `1 + 2` | `3` |
| `WAEC step 3` | `3 + 3` | `6` |
| `WAEC step 4` | `6 + 4` | `10` |
| `WAEC off-by-one trap` | `10 + 5` | `15` |

### Kit Gaps
*None.*
- `code-trace`: plug-in kit `kits/video/code-trace/` exists and is registered in `kits/catalog.md`.
- `graph`: built-in runtime kit.
