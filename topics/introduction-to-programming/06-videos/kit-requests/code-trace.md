# Kit request: code-trace
Needed for:
- lesson-01 video (Translators, RAM Memory Variables, String vs Integer Type Casting, Operator Precedence)
- lesson-03 video (Counter FOR vs Conditional WHILE Loops, Accumulator Pattern, Back-Edge Execution Jump, Infinite Loop Trap)
- lesson-04 video (Contiguous Array Memory Lockers, Zero-Based Offset Address = Base + Index × Size, Linear Minimum Search, IndexError Boundary)

Must show (3 scenes selected by `scene: 'memory' | 'loop' | 'array'`):
1. `scene: 'memory'` (Lesson 01):
   - Top translation pipeline bar: High-Level Python (`"150" + 20`) → Translator (`Compiler` batch vs `Interpreter` line-by-line) → Machine Binary (`10110001`).
   - Middle RAM memory bank: 3 labelled memory lockers (`0x01: raw_str`, `0x02: offset`, `0x03: total`) with data-type badges (`str`, `int`, `float`) and stored values.
   - Bottom ALU operation box: shows either the red `TypeError / String Concatenation` trap (`"150" + 20` or `"200" + "50" = "20050"`) when `cast: 0`, or the green type-cast arithmetic (`int("150") + 20 = 170` or `200 + 50 = 250`) when `cast: 1`, plus optional precedence mode (`prec: 1` showing `12 + 8 × 2 − 6 ÷ 2 = 12 + 16 − 3 = 25`).
2. `scene: 'loop'` (Lesson 03):
   - Left code & flowchart loop block: header diamond (`i < 7` or `count <= 5`), body box (`total += reading[i]`), step box (`i = i + 1`), and an animated curved back-edge arrow jumping from bottom of loop back to condition diamond.
   - Right trace register & 7-day solar bar strip (`[45, 52, 60, 58, 49, 63, 55]` kWh): highlights current index `step` (0–7), shows live counter `i`, current reading, and running accumulator `total` (`0 → 45 → 97 → 157 → 215 → 264 → 327 → 382 kWh`, mean `54.57 kWh`), or when `bug: 1` shows the red runaway infinite-loop warning (`count = 1` frozen, CPU 99%).
3. `scene: 'array'` (Lesson 04):
   - Contiguous 8-slot RAM locker rack (`Index 0` .. `Index 7`) at base address `0x1000` (4 bytes per slot: `0x1000` to `0x101C`), holding the 8 Ikogosi clinic battery cell voltages `[3.25, 3.18, 3.30, 2.95, 3.22, 3.15, 3.28, 3.20]` V, plus a red cross-hatched out-of-bounds zone at `Index 8` (`0x1020`).
   - Animated pointer needle aimed at slot `idx` (0–8), live offset calculation box `Addr = 0x1000 + idx × 4`, minimum-tracker badge (`min_val = 2.95 V at idx 3`), and red `IndexError` alarm when `idx: 8` (`oob: 1`).

States it needs:
- `scene`: `'memory' | 'loop' | 'array'`
- `stage`: `0..4` (progressive reveal within a scene)
- `translator`: `'none' | 'compiler' | 'interpreter'` (memory scene)
- `cast`: `0 | 1` (0 = uncast string trap, 1 = `int()` cast fixed)
- `prec`: `0 | 1` (show operator precedence evaluation `12 + 8*2 - 6/2 = 25`)
- `step`: `0..7` (loop iteration index 0..7 in loop scene)
- `bug`: `0 | 1` (1 = missing increment infinite loop alarm in loop scene)
- `idx`: `0..8` (array pointer index 0..8 in array scene)
- `oob`: `0 | 1` (1 = highlight Index 8 out-of-bounds crash)
- `minTrack`: `0 | 1` (1 = show `min_voltage` & `min_index` tracker badge)
- `labels`: `0 | 1`
- `focus`: `null | 'pipeline' | 'ram' | 'alu' | 'flowchart' | 'trace' | 'rack' | 'offset' | 'oob'`

Close-ups (`focus` regions in 420×420 space):
- `pipeline`: `[16, 16, 388, 120]`
- `ram`: `[16, 130, 388, 150]`
- `alu`: `[16, 270, 388, 134]`
- `flowchart`: `[14, 30, 200, 360]`
- `trace`: `[206, 30, 200, 360]`
- `rack`: `[14, 40, 392, 200]`
- `offset`: `[14, 240, 392, 160]`
- `oob`: `[260, 40, 150, 200]`

Accuracy:
- Lesson 01 numbers: `"150" + 20` → TypeError, `int("150") + 20 = 170`, `"200" + "50" = "20050"`, `12 + 8 * 2 - 6 / 2 = 25`.
- Lesson 03 numbers: `daily_readings = [45, 52, 60, 58, 49, 63, 55]`, cumulative sums `45, 97, 157, 215, 264, 327, 382`, count `7`, average `382 / 7 = 54.57` kWh.
- Lesson 04 numbers: `cells = [3.25, 3.18, 3.30, 2.95, 3.22, 3.15, 3.28, 3.20]`, length `N = 8`, valid indices `0..7`, `min_voltage = 2.95` V at `Index 3` (4th cell), `Index 8` at `0x1020` = `IndexError`.
- Labels short (≤ 18 characters), font size ≥ 12 units via `tx()`, pure function of `t` and state.
