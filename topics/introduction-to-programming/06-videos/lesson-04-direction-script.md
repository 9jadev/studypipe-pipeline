# Direction Script: Lesson 04 · Organising Data — Arrays, Collections & Indexing

## Overview
This video resolves the critical cold-chain alarm at the Ikogosi Warm Springs health clinic: Tari's automated battery monitor script crashed with an `IndexError` on battery cell 8 because human counting starting at 1 was confused with computer memory offset indexing starting at 0. It visualises 8 battery cells in contiguous 4-byte RAM lockers, derives the hardware address offset formula $\text{Address} = \text{Base} + (\text{Index} \times \text{Size})$, proves the bounds rule $\text{Max Index} = N - 1 = 7$, traces the linear traversal algorithm that isolates the weakest cell ($2.95\text{ V}$ at index 3, the 4th cell), and warns against the classic off-by-one errors tested in WAEC and NECO. It opens the **Make Sense** phase of Lesson 04, after the Contiguous Array Locker Rack lab bench. Practice quizzes remain in Apply.

| Item | Decision |
| --- | --- |
| Running time | About 8.4 minutes, 6 chapters, 48 narration lines (well within the 14-minute limit) |
| Narrator | One teacher voice, Nigerian English |
| Level | Senior Secondary Computer Studies, WAEC / NECO / JAMB |
| Theme | Unit theme (`meta.theme` unset, follows `green-lab`) |
| Kits used | **`code-trace`** (`scene: 'array'`) — contiguous 8-slot array locker rack, animated pointer needle, out-of-bounds crash indicator, live memory offset address calculator, and minimum-tracker register. |
| Camera | Wide by default; kit close-ups on rack (`rack`), address calculation (`offset`), and out-of-bounds boundary (`oob`); board shots for the address formula derivations and worked linear traversal; smooth push-ins on active cells |
| End card | `meta.next: '#apply'`, `nextLabel: 'Continue to Apply →'` |

**Colour roles:**

| Symbol | Meaning | Colour |
| --- | --- | --- |
| `code` | array identifier, loop counter `i`, zero-based index | sky |
| `val` | stored cell voltage readings, valid count, cell number | green |
| `acc` | RAM memory addresses, base address, offset arithmetic | gold |
| `err` | out-of-bounds violations, `IndexError`, off-by-one bugs | red |

**Accuracy notes:**
- **Battery voltage numbers:** Exactly as established in `02-lesson.md` (Lesson 04, Worked Example 4.1): `cells = [3.25, 3.18, 3.30, 2.95, 3.22, 3.15, 3.28, 3.20]` V. Length $N = 8$. Valid index range: $0..7$.
- **Weakest cell:** Minimum voltage is $2.95\text{ V}$ at zero-based `Index 3`. In human ordinal position, this is the 4th cell ($\text{Index} + 1 = 3 + 1 = 4$).
- **Contiguous memory allocation:** Base address `0x1000`. Element data type is a 32-bit floating-point number (4 bytes per element). Total memory allocated: $8 \times 4 = 32\text{ bytes}$ spanning `0x1000` to `0x101C` inclusive (`0x1000`, `0x1004`, `0x1008`, `0x100C`, `0x1010`, `0x1014`, `0x1018`, `0x101C`).
- **Out-of-bounds crash:** Index 8 calculates address `0x1000 + (8 * 4) = 0x1020` (decimal 4128), which is 32 bytes past the base address and lies strictly beyond the allocated 32-byte array partition. In Python, this raises `IndexError: list index out of range`.
- **Tari's buggy loop:** `for i in range(1, 9): check_cell(battery_cells[i])`. In Python, `range(1, 9)` yields `1, 2, 3, 4, 5, 6, 7, 8`. This demonstrates both classic off-by-one bugs simultaneously: it omits index 0 (the 1st cell, 3.25 V is never inspected) and overshoots at index 8 ($8 \ge N$).
- **Your-turn practice numbers are fresh:** Sensor voltage list `sensors = [12.4, 12.1, 11.8, 12.6, 11.5, 12.2]` V ($N = 6$), base address `0x2000`, 4 bytes per float. The 5th sensor is at index $5 - 1 = 4$. Address: `0x2000 + (4 * 4) = 0x2010`. Querying index 6 triggers `IndexError` ($6 \ge 6$). Neither this specific sequence nor `0x2010` appears in `02-lesson.md` or `03-questions.md`.

---

## Chapter 1: Hook — The Ikogosi Clinic Cold-Chain `IndexError` on Battery Cell 8 (hook, about 1 min 05 s)
The emergency at the Ikogosi clinic: an unhandled `IndexError` shuts down vaccine refrigeration.

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 1.1 | At the Ikogosi Warm Springs clinic, Doctor Folake's vaccine refrigerator temperature alarm suddenly triggers. The cooling system has stopped cold. | New board: "The Ikogosi Clinic cold chain"<br>Kit code-trace: scene=array, stage=1, idx=0, oob=0, minTrack=0, labels=1, focus=null<br>Board: Vaccine fridge: OFFLINE (err) | hook, story context |
| 1.2 | Tari checks the telemetry script, battery check dot py. On line thirty-four, the Python interpreter has crashed with a fatal IndexError. | Board: battery_check.py:34 (code)<br>Board: IndexError: out of range (err) | the runtime error |
| 1.3 | Line thirty-four runs a loop: for i in range one to nine, check cell i. There are eight battery cells in the rack. | Board: for i in range(1, 9): (code)<br>Board: cells in rack: N = 8 (val) | the buggy code |
| 1.4 | Tari counted one to eight like a human. But when i reached eight, Python could not find cell eight, and the entire monitoring system halted. | Kit: stage=2, idx=8, oob=1, focus='oob'<br>📷 WIDE → oob<br>Board: i = 8 → CRASH (err) | visualising the crash |
| 1.5 | Amina discovers two errors. The first battery was never checked, and asking for index eight crashed the clinic. By the end of this video, you will master zero-based indexing and memory bounds. | Kit: stage=2, idx=0, oob=0, focus=null<br>📷 WIDE<br>New board: "By the end of this video"<br>Board: ☐ contiguous RAM lockers<br>Board: ☐ hardware address formula<br>Board: ☐ bounds rule: 0 to N - 1<br>Board: ☐ linear search for minimum | learning objectives |

---

## Chapter 2: Contiguous RAM Lockers & Why Zero-Based Indexing Starts at 0 (core idea, about 1 min 30 s)
Why arrays are stored contiguously in memory and why computer scientists index from 0.

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 2.1 | An array is a collection of data elements stored in contiguous memory lockers under a single variable name. | New board: "Contiguous RAM lockers"<br>Kit: stage=2, idx=0, oob=0, minTrack=0, labels=1, focus='rack'<br>📷 WIDE → rack<br>Board: Array: contiguous RAM lockers | formal definition |
| 2.2 | Contiguous means strictly side by side in RAM. There are no gaps between lockers, so the CPU never needs to search through memory. | Board: No gaps between lockers<br>Board: Access time: O(1) instant (acc) | physical RAM layout |
| 2.3 | Why do programmers start counting at index zero instead of one? Because in computer memory, an index is not a count. It is an offset. | New board: "Index is an offset"<br>Board: Index = Offset from start (code, acc) | core conceptual leap |
| 2.4 | Humans count ordinal positions starting at one: first, second, third. But computers calculate distance from the start: zero lockers away, one locker away. | Board: Human: 1st, 2nd, 3rd ... 8th<br>Board: Machine: 0, 1, 2 ... 7 (code) | ordinal vs offset |
| 2.5 | Offset means how many lockers to skip from the start. To read the very first locker, you skip zero lockers. So the first element sits at index zero. | New board: "Skipping lockers"<br>Kit: idx=0, focus='rack'<br>Board: 1st cell: skip 0 → cells[0] (code)<br>Board: = 3.25 V (val) | index 0 = 0 offset |
| 2.6 | To read the second locker, you skip one locker forward. So the second element sits at index one. | Kit: idx=1, focus='rack'<br>Board: 2nd cell: skip 1 → cells[1] (code)<br>Board: = 3.18 V (val) | index 1 = skip 1 |
| 2.7 | To reach the eighth and final locker, you skip seven lockers forward. So the eighth cell sits at index seven. | Kit: idx=7, focus='rack'<br>Board: 8th cell: skip 7 → cells[7] (code)<br>Board: = 3.20 V (val) | index 7 = 8th cell |

---

## Chapter 3: Hardware Offset Formula $\text{Address} = \text{Base} + (\text{Index} \times \text{Size})$ (`0x1000` to `0x101C`, 32 bytes) (derivation & formula, about 1 min 50 s)
How the CPU calculates direct physical memory addresses instantly.

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 3.1 | Inside the hardware memory controller, calculating an element's RAM address requires only a single multiplication and addition. | New board: "Hardware address formula"<br>Kit: stage=3, idx=0, oob=0, minTrack=0, labels=1, focus='offset'<br>📷 WIDE → offset<br>Board: Address = Base + (i × Size) (acc)<br>Box | master formula boxed |
| 3.2 | Here, each floating-point voltage occupies four bytes in RAM. The battery array begins at base address hex one thousand. | Board: Base = 0x1000, Size = 4 B (acc)<br>Board: Total span: 8 × 4 = 32 bytes (acc) | parameters & memory footprint |
| 3.3 | For the first element at index zero: hex one thousand plus zero times four bytes equals hex one thousand. | New board: "Calculating addresses"<br>📷 BOARD SHOT<br>Kit: idx=0, focus='offset'<br>Board: i = 0: Addr = 0x1000 + (0 × 4) (code, acc)<br>Board: = 0x1000 → 3.25 V (acc, val) | calculation step: index 0 |
| 3.4 | For the second element at index one: hex one thousand plus one times four bytes gives hex one thousand and four, holding three point one eight volts. | Kit: idx=1, focus='offset'<br>Board: i = 1: Addr = 0x1000 + (1 × 4) (code, acc)<br>Board: = 0x1004 → 3.18 V (acc, val) | calculation step: index 1 |
| 3.5 | For the fourth element at index three: hex one thousand plus three times four bytes is hex one thousand plus twelve bytes, which is hex one thousand and C. | Kit: idx=3, focus='offset'<br>Board: i = 3: Addr = 0x1000 + (3 × 4) (code, acc)<br>Board: = 0x1000 + 12 = 0x100C (acc) | calculation step: index 3 |
| 3.6 | For the eighth element at index seven: hex one thousand plus seven times four bytes is hex one thousand plus twenty-eight bytes, giving hex one thousand and one C. | Kit: idx=7, focus='offset'<br>Board: i = 7: Addr = 0x1000 + (7 × 4) (code, acc)<br>Board: = 0x1000 + 28 = 0x101C (acc) | calculation step: index 7 |
| 3.7 | All eight cells occupy exactly thirty-two bytes, spanning from hex one thousand to hex one thousand and one C. | 📷 WIDE → offset<br>New board: "Memory block allocation"<br>Board: Block: 0x1000 to 0x101C (acc)<br>Board: Capacity: 8 cells × 4 B = 32 B (val, acc)<br>Box | contiguous span confirmed |

---

## Chapter 4: The Bounds Rule $\text{Max Index} = N - 1 = 7$ & Off-By-One Crashes at `Index 8` (core concept & error trap, about 1 min 35 s)
The mathematical relationship between array length and maximum index, and why index 8 crashed the clinic.

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 4.1 | This brings us to the foundational rule of array indexing in modern programming. | New board: "The bounds rule"<br>📷 WIDE<br>Kit: stage=2, idx=7, oob=0, focus='rack'<br>Board: Length: N (val) | introducing bounds |
| 4.2 | If an array has length N, the valid indices run from zero up to N minus one. The maximum valid index is always N minus one. | Board: Valid indices: 0 ≤ i ≤ N - 1 (code)<br>Board: Max Index = N - 1 (code, val)<br>Box | fundamental theorem |
| 4.3 | For our eight battery cells, N equals eight. The maximum valid index is eight minus one, which is seven. | Board: N = 8 ⟹ Max Index = 8 - 1 = 7 (code, val) | clinic application |
| 4.4 | Python also allows negative indexing to count backward from the end. Index minus one accesses the very last locker, cells at index seven. | Board: Negative index: cells[-1] (code)<br>Board: = cells[7] (3.20 V) (code, val) | negative indexing |
| 4.5 | Now look at what happened when Tari's loop executed check cell for index eight. | New board: "Index 8 out of bounds"<br>Kit: stage=4, idx=8, oob=1, minTrack=0, labels=1, focus='oob'<br>📷 WIDE → oob<br>Board: Requested: cells[8] (code) | boundary violation |
| 4.6 | The address formula calculated hex one thousand plus eight times four bytes, which is hex one thousand and twenty. | Board: Addr = 0x1000 + (8 × 4) = 0x1020 (acc, err) | out-of-bounds address |
| 4.7 | Hex one thousand and twenty is thirty-two bytes beyond the base address. It lies completely outside the array's allocated memory block. | Board: 0x1020 is OUTSIDE block! (err)<br>Board: IndexError: out of range (err)<br>Box | the fatal exception |
| 4.8 | This is the classic off-by-one bug. Tari's range one to nine stopped before nine at index eight, which is beyond the array. | New board: "The off-by-one error"<br>📷 WIDE<br>Board: range(1, 9) → 1, 2, ..., 8 (err)<br>Board: Bug 1: skipped index 0 (1st cell) (err)<br>Board: Bug 2: crashed at index 8 (err) | error diagnosis |

---

## Chapter 5: Linear Traversal to Find the Weakest Cell `2.95 V` at `Index 3` (4th cell) (worked example, about 1 min 55 s)
Step-by-step trace of linear search to find the lowest voltage and fix the clinic refrigerator.

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 5.1 | Let us fix the program and find the clinic's degraded battery cell using a linear traversal algorithm. | New board: "Linear search for minimum"<br>📷 BOARD SHOT<br>Kit: stage=3, idx=0, oob=0, minTrack=0, labels=1, focus=null<br>Board: Goal: find lowest voltage<br>Board: cells = [3.25, 3.18, ..., 3.20] (code) | algorithm goal |
| 5.2 | Step one. Initialize the minimum tracker to the first element: min voltage equals cells at index zero, three point two five volts. | Board: min_voltage = cells[0] (code)<br>Board: = 3.25 V, min_idx = 0 (val, code) | initialisation pattern |
| 5.3 | Step two. Iterate through the array using range len cells. This generates the correct indices, zero through seven. | Board: for i in range(len(cells)): (code)<br>Board: generates i = 0, 1, 2, 3, 4, 5, 6, 7 (code) | correct loop construct |
| 5.4 | At index one, three point one eight volts is less than three point two five. The minimum updates to three point one eight volts at index one. | New board: "Stepping through cells"<br>Kit: idx=1, focus='rack'<br>📷 WIDE → rack<br>Board: i = 1: 3.18 < 3.25 ⟹ update (val, code)<br>Board: min_val = 3.18 V, min_idx = 1 (code, val) | iteration step: i = 1 |
| 5.5 | At index two, three point three zero volts is greater than three point one eight. The condition is false, so the tracker remains unchanged. | Kit: idx=2, focus='rack'<br>Board: i = 2: 3.30 > 3.18 ⟹ no change | iteration step: i = 2 (unchanged) |
| 5.6 | At index three, the sensor reads two point nine five volts. That is lower than three point one eight, so the tracker updates again. | Kit: idx=3, minTrack=1, focus='offset'<br>📷 WIDE → offset<br>Board: i = 3: 2.95 < 3.18 ⟹ update (val, code)<br>Board: min_val = 2.95 V, min_idx = 3 (code, val) | iteration step: i = 3 (minimum found) |
| 5.7 | The loop checks indices four through seven. None are below two point nine five volts, so the loop finishes. | Kit: idx=7, minTrack=1, focus='offset'<br>Board: i = 4..7: all > 2.95 V<br>Board: search complete! | traversal completion |
| 5.8 | Step three. Report the physical battery cell. In human ordinal terms, the cell position is min index plus one, which is cell four. | New board: "Weakest cell identified"<br>📷 WIDE<br>Board: Weakest: 2.95 V at idx 3 (val, code)<br>Board: Cell Number = 3 + 1 = Cell 4 (val)<br>Box | mapping index to position |
| 5.9 | Cell four is below three point zero volts, dragging the battery pack down. Tari replaces cell four, restoring power to Doctor Folake's vaccine refrigerator. | Board: Cell 4: < 3.0 V → Replace! (err)<br>Board: Vaccine cooling: RESTORED (val)<br>Box | problem resolved |

---

## Chapter 6: WAEC Array Indexing & Summary (exam clinic, summary & your turn, about 2 min 10 s)
Exam traps, unified summary on one board, and a student practice question with full solution.

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 6.1 | Let us examine the common array mistakes that cost marks in WAEC and NECO examinations. | New board: "Common exam mistakes"<br>Kit: panel=null<br>📷 WIDE<br>Board: Mistake 1: Off-by-one bounds<br>Board: range(1, N + 1) → IndexError (err) | mistake 1: loop bounds |
| 6.2 | Mistake one. Iterating from one to N instead of zero to N minus one. You miss element zero and trigger an IndexError at N. | Board: Correct: range(N) or range(0, N) (val) | correct alternative |
| 6.3 | Mistake two. Confusing index with position. The k-th element is stored at index k minus one, not index k. | New board: "Mistake 2: Index vs position"<br>Board: k-th item ≠ array[k] (err)<br>Board: k-th item = array[k - 1] (val)<br>Box | mistake 2: ordinal vs index |
| 6.4 | Mistake three. Initializing the minimum tracker to zero. If all array values are positive, zero falsely remains the minimum forever. Always initialize to array at index zero. | New board: "Mistake 3: Initializing trackers"<br>Board: min_val = 0 (fails for positives) (err)<br>Board: min_val = array[0] (guaranteed) (val) | mistake 3: tracker initialiser |
| 6.5 | Here is the entire topic on one summary board. Arrays store contiguous elements. The hardware address equals base plus index times element size. | New board: "Array summary"<br>Board: Addr = Base + (i × Size) (acc)<br>Board: Valid indices: 0 ≤ i ≤ N - 1 (code) | summary: formula & bounds |
| 6.6 | An array of length N has valid indices from zero to N minus one. Accessing index N triggers an out-of-bounds IndexError. | Board: Max Index = N - 1 (code, val)<br>Board: i ≥ N ⟹ IndexError (err)<br>Box | summary: max index boxed |
| 6.7 | Your turn. An inverter monitor stores six sensor voltages at base address hex two thousand, with four bytes per reading. Find the address of the fifth sensor, and state what occurs if code queries index six. | New board: "Your turn: Inverter sensors"<br>Board: N = 6, Base = 0x2000, 4 B/item<br>Board: (a) Address of 5th sensor?<br>Board: (b) Result of sensors[6]? | student practice question |
| 6.8 | Pause the video and calculate both parts. Remember to convert the fifth position to its zero-based index first. | Board: pause and try (15 s) (val)<br>Hold: 15 s | pause and try |
| 6.9 | Part a. The fifth sensor sits at index five minus one, which is index four. Four times four bytes is sixteen bytes, which is hex ten. | New board: "Solution (a)"<br>📷 BOARD SHOT<br>Board: 5th sensor ⟹ i = 5 - 1 = 4 (code)<br>Board: Addr = 0x2000 + (4 × 4) (acc)<br>Board: = 0x2000 + 16_10 = 0x2010 (acc)<br>Box | solution part (a) derivation |
| 6.10 | Adding hex ten to hex two thousand gives hex two thousand and ten as the memory address. | Board: Address = 0x2010 (acc) | solution part (a) final |
| 6.11 | Part b. For six sensors, valid indices run from zero to five. Index six is greater than or equal to N, triggering an IndexError out of range. | New board: "Solution (b)"<br>Board: N = 6 ⟹ valid: 0..5 (code)<br>Board: i = 6 ≥ N ⟹ IndexError (err)<br>Board: list index out of range (err)<br>Box | solution part (b) |
| 6.12 | Excellent work. You have mastered array memory architecture and zero-based indexing. Continue to Apply to test your skills. | 📷 WIDE | conclusion & call to action |

---

## Build checks and kit gaps

### Verification Table

| Check Name | Formula / Input | Expected Result | Status |
|---|---|---|---|
| Array length $N$ | `cells.length` | `8` | Verified |
| Max valid index $N - 1$ | `8 - 1` | `7` | Verified |
| Float byte size | 32-bit float | `4` bytes | Verified |
| Total array memory block | `8 * 4` | `32` bytes | Verified |
| Index 0 address | `0x1000 + 0 * 4` | `0x1000` (`4096`) | Verified |
| Index 1 address | `0x1000 + 1 * 4` | `0x1004` (`4100`) | Verified |
| Index 3 address | `0x1000 + 3 * 4` | `0x100C` (`4108`) | Verified |
| Index 7 address | `0x1000 + 7 * 4` | `0x101C` (`4124`) | Verified |
| Index 8 OOB address | `0x1000 + 8 * 4` | `0x1020` (`4128`) | Verified |
| Cell voltages count | `cells.length` | `8` | Verified |
| Minimum voltage value | `Math.min(3.25, 3.18, 3.30, 2.95, 3.22, 3.15, 3.28, 3.20)` | `2.95` V | Verified |
| Minimum voltage index | `cells.indexOf(2.95)` | `3` | Verified |
| Ordinal position of weakest cell | `3 + 1` | `4` (Cell 4) | Verified |
| Sum of 8 battery voltages | `3.25 + 3.18 + 3.30 + 2.95 + 3.22 + 3.15 + 3.28 + 3.20` | `25.53` V | Verified |
| Mean cell voltage (2 d.p.) | `Math.round((25.53 / 8) * 100) / 100` | `3.19` V | Verified |
| Buggy range stop value | `9 - 1` | `8` | Verified |
| Your-turn sensor count $N$ | `sensors.length` | `6` | Verified |
| Your-turn max valid index | `6 - 1` | `5` | Verified |
| Your-turn 5th sensor index | `5 - 1` | `4` | Verified |
| Your-turn byte offset | `4 * 4` | `16` bytes (`0x10`) | Verified |
| Your-turn 5th sensor address | `0x2000 + 4 * 4` | `0x2010` (`8208`) | Verified |
| Your-turn minimum sensor voltage | `Math.min(12.4, 12.1, 11.8, 12.6, 11.5, 12.2)` | `11.5` V | Verified |
| Your-turn minimum sensor index | `sensors.indexOf(11.5)` | `4` | Verified |

### Kit Gaps
- None. The `code-trace` kit (`scene: 'array'`) is fully implemented in `kits/video/code-trace/` and tested via `kits/video/code-trace/demo.plan.cjs`.
