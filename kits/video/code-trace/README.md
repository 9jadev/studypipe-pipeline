# Video kit · code-trace

Three-scene 2D explainer-video kit (`window.VIDEO_KITS['code-trace']`) for introductory programming, execution tracing, and memory model visualisation:

1. **`scene: 'memory'` (Translators, RAM Lockers & ALU Type-Casting / Precedence):**
   - **Pipeline (`pipeline`):** High-level Python (`"150" + 20`, `int("150") + 20`, or `12 + 8*2 - 6/2`) → Translator (`Compiler` batch scan vs `Interpreter` line-by-line scan) → CPU Machine Binary (`10110001`).
   - **RAM Memory Lockers (`ram`):** Three addressed variable lockers (`0x01: raw_str`, `0x02: offset`, `0x03: total`) with data-type badges (`str`, `int`) and live values.
   - **ALU Operation Box (`alu`):** Shows the uncast `TypeError` / string concatenation trap (`"150" + 20`, `"200" + "50" = "20050"`) when `cast: 0`, integer addition (`int("150") + 20 = 170`, `200 + 50 = 250`) when `cast: 1`, or operator precedence evaluation (`12 + 8×2 − 6÷2 = 12 + 16 − 3 = 25`) when `prec: 1`.
2. **`scene: 'loop'` (FOR/WHILE Loop Flowchart, Back-Edge Jump & Solar Accumulator Trace):**
   - **Flowchart (`flowchart`):** Initialiser (`total=0, i=0`), condition diamond (`i < 7 ?` or `count <= 5 ?`), loop body (`total += read[i]`), step box (`i = i + 1` or missing step when `bug: 1`), and an animated curved back-edge arrow with a travelling pulse dot.
   - **Trace & 7-Day Solar Strip (`trace`):** 7-day solar bar chart (`[45, 52, 60, 58, 49, 63, 55]` kWh), live iteration counter `i`, current reading, running accumulator `total` (`45 → 97 → 157 → 215 → 264 → 327 → 382` kWh, mean `54.57` kWh), or the runaway infinite-loop alarm (`count = 1` stuck, `CPU 99% · FROZEN`) when `bug: 1`.
3. **`scene: 'array'` (Contiguous 0-Based Array Lockers, Offset Formula & Out-of-Bounds):**
   - **Contiguous Rack (`rack`) & Out-of-Bounds Zone (`oob`):** 8 contiguous 4-byte RAM slots (`Index 0` .. `Index 7`, `0x1000` to `0x101C`) holding the 8 Ikogosi clinic battery cell voltages `[3.25, 3.18, 3.30, 2.95, 3.22, 3.15, 3.28, 3.20]` V, plus a red cross-hatched out-of-bounds slot at `Index 8` (`0x1020`) and an animated pointer needle tracking `idx`.
   - **Offset & Minimum Tracker (`offset`):** Live address calculation `Addr = 0x1000 + idx × 4`, minimum-voltage tracker badge (`min = 2.95V @ idx 3` when `minTrack: 1`), and `IndexError` alarm when `idx: 8` (`oob: 1`).

## States (`{ panel: 'code-trace', s: { … } }`)

| State | Meaning |
|---|---|
| `scene` | `'memory'` \| `'loop'` \| `'array'` (cross-fades cleanly) |
| `stage` | `0..4` progressive reveal within the active scene |
| `translator` | `'none'` \| `'compiler'` \| `'interpreter'` (`memory` scene) |
| `cast` | `0 \| 1` (`0` = uncast string trap, `1` = `int()` cast fixed) |
| `prec` | `0 \| 1` (`1` = show operator precedence `12 + 8*2 - 6/2 = 25`) |
| `step` | `0..7` loop iteration index (`loop` scene) |
| `bug` | `0 \| 1` (`1` = missing increment infinite-loop alarm in `loop` scene) |
| `idx` | `0..8` array pointer index (`array` scene, animates smoothly) |
| `oob` | `0 \| 1` (`1` = highlight `Index 8` out-of-bounds `IndexError`) |
| `minTrack` | `0 \| 1` (`1` = show `min=2.95V @ idx 3` tracker badge) |
| `labels` | `0 \| 1` show/hide secondary descriptive labels |
| `focus` | `null` \| `'pipeline'` \| `'ram'` \| `'alu'` \| `'flowchart'` \| `'trace'` \| `'rack'` \| `'offset'` \| `'oob'` |

## Camera close-ups (`{ camera, focus: '…' }`)

- `pipeline`: `[16, 16, 388, 120]` (top translator pipeline bar in `memory`)
- `ram`: `[16, 130, 388, 150]` (middle 3 RAM lockers in `memory`)
- `alu`: `[16, 270, 388, 134]` (bottom ALU evaluation box in `memory`)
- `flowchart`: `[14, 30, 200, 360]` (left loop flowchart & back-edge in `loop`)
- `trace`: `[206, 30, 200, 360]` (right 7-day solar bars & accumulator registers in `loop`)
- `rack`: `[14, 40, 392, 200]` (contiguous 8-slot array locker rack in `array`)
- `offset`: `[14, 240, 392, 160]` (address offset formula & minimum tracker in `array`)
- `oob`: `[260, 40, 150, 200]` (right-hand `Index 7` boundary & `Index 8` out-of-bounds zone in `array`)

## Good for

High-level vs machine code translation (compiler vs interpreter), RAM variable lockers and data types (`str`, `int`, `float`), string concatenation vs integer addition (`int()`), operator precedence (BODMAS), `FOR` vs `WHILE` loop flowcharts, accumulator trace tables, infinite loop bugs, zero-based 1D array indexing, memory offset address calculation (`Base + Index × Size`), linear minimum search, and `IndexError` boundary errors.

## Used in

- `introduction-to-programming` (lesson-01, lesson-03, lesson-04 explainer videos)
- Demo: `kits/video/code-trace/demo.plan.cjs`
