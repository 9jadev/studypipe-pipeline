# 05 · Build Plan — `introduction-to-programming` (Introduction to Computer Programming)

Written by **unit-renderer** (step 5, Phase A) · 2026-11-11 · theme `green-lab` · source of truth: approved `02-lesson.md` (v1, 6 lessons) + `03-questions.md` (`04-review.md` PASS).

## Already built (shared, owned by unit-renderer — do not edit from a lesson)

| Path | What it is |
|---|---|
| `html/index.html` | Welcome Hub: hero + 3D Microcontroller & RAM Hero Lab, 12-term marquee, mystery case file (4 clue cards + realism note + 3 stats), 6 journey cards, 4-tab explorer, 8 outcomes, 6 calculation archetypes (`StudyMath`), 3 myth flip cards, 5-step method loop, finale |
| `html/assets/css/` | shell `style.css`, `lesson.css`, `narrator.css`, `math.css`, `code.css`, `lesson-video.css` + `hub.css` (hub only) + `fonts.css`/`theme.css` (`apply-theme.mjs` run with `green-lab`) |
| `html/assets/fonts/` | Space Grotesk, Plus Jakarta Sans, Space Mono, Source Serif 4 (`green-lab`) |
| `html/assets/js/three.min.js` | three.js r160 + OrbitControls (`window.THREE`) |
| `html/assets/js/paper-core.min.js` | Paper.js vector canvas runtime (`window.paper`) |
| `html/assets/js/scene-kit.js`, `study-graph.js`, `story-scene.js`, `lesson-kit.js`, `narrator.js`, `math-kit.js`, `code-kit.js`, `sort-dnd.js`, `welcome.js`, `video-embed.js` | shell engines (unchanged) |
| `html/assets/js/welcome-lab.js` | Hero Lab (`window.StudyLab`: modes `high-level` / `assembly-machine` / `memory-slots`; parts `board, cpu, cu, alu, clock, bus, ram, terminal`; deterministic model: `energy = units * 68.0` → `8160.0`, `"150" + 20` → `TypeError`, `int("150") + 20` → `170`; 4 machine cycles FETCH/DECODE/EXECUTE/STORE with `0x7E = 01111110₂`; 8 RAM slots `0x00..0x07` at indices `0..7`) |
| `html/assets/js/welcome-explorer.js` | Explorer SVG visualizers & curves (`hierarchy` 3-tier ladder, `variables` 4 RAM containers, `control` `range(1, 6)` accumulator sum = 15, `arrays` 8-cell grid `Addr = 1000 + 4i` + index 8 `IndexError`) + `window.WELCOME_COMBOS` + archetype `StudyMath` typesetting |
| `html/assets/js/welcome-narration.js` | Hub tour (10 chapters, 5 "Your turn" waits: `parse`, `cycle`, `slot` on `lab:result`; `tab` on `hub:tab`; `flip` on `hub:flip`) |
| `html/assets/js/retrieval-bank.js` | `window.RETRIEVAL_BANK.l01 … l06` — Do Now (4 cards = the `02-lesson.md` Do Now items with `from` and `sec`), 2 original review MCQs for `l02–l06` (with `from`), blank-page recall checklists |

**To copy in later (director → `html/assets/js/`):** `programming-bench.js` (from `kits/programming-bench/kit.js`), `programming-zoom.js` (from `kits/programming-zoom/kit.js`), and `microgrid-props.js` (from `kits/microgrid-props/kit.js`) once shipped.

Hub checked in Chromium (SwiftShader WebGL) at `360×740` and `1280×800`: 0 console errors, 0 network requests, no horizontal overflow, 3D lab renders in all three modes (`high-level`, `assembly-machine`, `memory-slots` with `0x7E = 01111110₂`), explorer draws all four visualizers, `StudyMath` typesets all 6 archetypes, guided tour starts cleanly.

## Cast mapping (StoryStage)

`02-lesson.md` beats use `who: "amina" | "tari" | "babatunde" | "folake" | "engr_idris"`. StoryStage looks up `people[who]` for speech bubbles, `rect()` and `highlight()`, so every `story.js` adds **aliases** in `opts.setup(api)`:

| 02 character | Set 1 (`market` = Ikogosi Microgrid Control Station) | Set 2 (`lab` = School Computer Studies & Clinic Telemetry Lab) |
|---|---|---|
| Amina (SS1 lead student debugger) | `api.people.amina = api.people.cust2` (Ankara wrapper + bun, holding maintenance laptop) | reparent or clone into `api.props.lab`, alias `api.people.amina` |
| Tari (SS1 classmate) | `api.people.tari = api.people.cust1` (blue shirt, short hair) | reparent or clone into `api.props.lab` (`x ≈ 0.85, z ≈ -0.9`), alias `api.people.tari` |
| Chief Babatunde (village council chairman) | `api.people.babatunde = api.people.ngozi` or new `StoryStage.person({ skin: "#4a2e1f", outfit: "#d9a441", pants: "#1c2433", cap: "#8c2d19" })` added to `market` and `api.people.babatunde` | same, added to `lab` when present |
| Dr. Folake (Ikogosi Clinic doctor, L04) | new `StoryStage.person({ skin: "#5a3825", outfit: "#0d9c7e", coat: true, hair: "bun", pants: "#2b3446" })` in `market`, `api.people.folake` | `api.people.folake = api.people.amaka` (white coat + goggles) |
| Engr. Idris (commissioning engineer) | new `StoryStage.person({ skin: "#3d2618", outfit: "#2b6cb0", pants: "#1c2433", cap: "#eab308" })` in `market`, `api.people.engr_idris` | same, added to `lab` when present |

`opts.names = { amina: "Amina", cust2: "Amina", tari: "Tari", cust1: "Tari", babatunde: "Chief Babatunde", ngozi: "Chief Babatunde", folake: "Dr. Folake", amaka: "Dr. Folake", engr_idris: "Engr. Idris" }`. Signs: `StoryStage.sign("IKOGOSI SMART SOLAR MICROGRID · EKITI", …)` for `mSign`, `StoryStage.sign("COMPUTER STUDIES & TELEMETRY LAB", …)` for `lSign`. Props per beat (inverter cabinet, 8-cell lithium battery rack, maintenance terminal laptop, vaccine refrigerator, diesel backup generator, smart meter board) come from the **`microgrid-props`** kit below; guard every call behind `if (window.MicrogridProps)`.

## Lessons

| lesson | title | story set + characters | bench: kit-id (reuse/new) | zoom: kit-id (reuse/new) | graph | prev / next |
|---|---|---|---|---|---|---|
| lesson-01 | From Logic to Code — Programming Languages, Translators & Memory Variables | Set 1 station · `amina`, `tari`, `babatunde` · 5 beats (`total_power = "150" + 20` `TypeError`) | **new `programming-bench`** `mode: "memory-variables"`. Controls: variable preset (`voltage = 230` int 2B at `0x01`, `tariff = 68.5` float 4B at `0x02`, `location = "Ikogosi"` str 7B at `0x03`, `a = "150", b = 20` trap, `int(a) + b` cast fix), **Allocate / Execute**, **Reset**. Parts `board, cpu, alu, slot1, slot2, slot3, slot4, slot5, slot6, bus, console`. Emits `l01:bench` per allocation/run, `l01:bench-done` after all 5 steps. Expected: `0x01: 230 (int, 2 B)`, `0x02: 68.5 (float, 4 B)`, `0x03: "Ikogosi" (str, 7 B)`, `"150" + 20 → TypeError`, `int("150") + 20 → 170 (int)` | **new `programming-zoom`** `mode: "translation-pipeline"` (source statement `total = units * 68` → lexer/parser tokens → compiler whole-file object code vs interpreter line-by-line execution → 8-bit binary pulses `10110001` on the CPU bus). Parts `source, compiler, interpreter, binary, cpu` | no (uses `StudyCode` trace + memory watch table) | ← Hub (`../../index.html`) · → lesson-02 (`../lesson-02/index.html`) |
| lesson-02 | Making Decisions — Conditional Logic, Boolean Operators & Branching | Set 1 station · `amina`, `tari`, `babatunde` · 5 beats (battery 18%, `battery_level < 20 and grid_power_active == True` keeps generator silent) | **`programming-bench`** `mode: "logic-switchboard"`. Controls: `battery_level` slider `0–100%` (default `18%`), `grid_online` toggle (`True`/`False`), gate mode (`AND` faulty / `AND NOT` fixed / `OR`), **Test relay**, **Reset**. Parts `batterySensor, gridSensor, notGate, andGate, orGate, relay, generator, led`. Emits `l02:bench`, `l02:bench-done` after 5 truth-table trials. Expected for `battery < 20 and not grid_online`: `(18%, False) → True (ON)`, `(18%, True) → False (OFF)`, `(45%, False) → False (OFF)`, `(45%, True) → False (OFF)`, `(12%, False) → True (ON)` | **`programming-zoom`** `mode: "decision-tree"` (3D diamond flowchart tree for multi-way `IF-ELIF-ELSE` grading/JAMB admission & NEPA tariff bands; animated token follows `True`/`False` branch). Parts `entry, diamond1, diamond2, branchA, branchB, branchC, elseBranch` | no (uses truth table & flowchart trace) | ← lesson-01 · → lesson-03 |
| lesson-03 | The Power of Repetition — Counter & Conditional Loops | Set 1 station · `amina`, `tari`, `babatunde` · 5 beats (`while solar_output > 0:` infinite loop at 99% RAM) | **`programming-bench`** `mode: "loop-stepper"`. Controls: loop preset (`FOR i IN range(1, 6)` accumulator `sum += i`, `FOR i IN range(2, 10, 2)`, `WHILE count < 5` with increment, `WHILE count < 5` runaway infinite loop with watchdog interrupt), **Step iteration**, **Run all**, **Reset**. Parts `gear, counterReg, accReg, condGate, watchdog, console`. Emits `l03:bench`, `l03:bench-done` after completing a full loop trace + testing the watchdog. Expected `range(1, 6)`: steps `i = 1..5`, `sum = 1, 3, 6, 10, 15`; exit when `i = 6` | **`programming-zoom`** `mode: "loop-tracer"` (3D timeline showing initialization → condition test diamond → body execution → counter increment → backward jump arc to condition). Parts `initBlock, condDiamond, bodyBlock, stepBlock, jumpArc, exitBlock` | **yes** (optional/recommended): `sum` (y) against iteration `i` (x) on `window.StudyGraph` | ← lesson-02 · → lesson-04 |
| lesson-04 | Organising Data — Arrays, Collections & Indexing | Set 1 & Clinic · `amina`, `tari`, `folake`, `babatunde` · 5 beats (`for i in range(1, 9): check_cell(battery_cells[i])` crashes at `i = 8`) | **`programming-bench`** `mode: "array-rack"`. Controls: 8-slot lithium cell rack `cells = [3.25, 3.18, 3.30, 2.95, 3.22, 3.15, 3.28, 3.20]`, index dial `0..8`, **Read index**, **Scan `0..7` (min search)**, **Reset**. Parts `rack, slot0, slot1, slot2, slot3, slot4, slot5, slot6, slot7, oobZone, pointer, alarm`. Emits `l04:bench`, `l04:bench-done` after reading `0`, `7`, triggering `8` (`IndexError`), and completing the `0..7` scan. Expected: `cells[0] = 3.25 V`, `cells[3] = 2.95 V` (weakest, cell #4), `cells[7] = 3.20 V`, `cells[8] → IndexError` | **`programming-zoom`** `mode: "memory-offset"` (visual RAM microscope showing `Address(i) = Base + i × Size` with `Base = 1000`, `Size = 4` bytes → `1000, 1004, ..., 1028`). Parts `baseMarker, strideBar, slotBlocks, addrReadout` | no | ← lesson-03 · → lesson-05 |
| lesson-05 | Modular Architecture — Functions, Scope & Reusability | Set 1 station · `amina`, `tari`, `babatunde`, `engr_idris` · 5 beats (12 copy-pasted tariff blocks in `billing.py` with 5% vs 7.5% VAT and overwritten global `total`) | **`programming-bench`** `mode: "function-factory"`. Controls: input arguments `units` (`85`, `120`, `210`), `tariff_rate` (`68.0`), `vat_rate` (`0.075`), `fixed_charge` (`1500.0`), **Call `calculate_nepa_bill()`**, **Step inside**, **Return value**, **Reset**. Parts `hopper, chamber, localFrame, globalBoard, chute, console`. Emits `l05:bench`, `l05:bench-done` after calling with 2 household inputs and inspecting local vs global scope. Expected (`fixed = 1500.0`, `rate = 68.0`, `vat = 7.5%`): `85 units` → `energy = 5780.0`, `vat = 433.5`, `total = ₦7,713.50`; `120 units` → `energy = 8160.0`, `vat = 612.0`, `total = ₦10,272.00`; `210 units` → `energy = 14280.0`, `vat = 1071.0`, `total = ₦16,851.00` | **`programming-zoom`** `mode: "scope-stack"` ("One-Way Glass" scope chamber & call-stack frame visualizer showing `localFrame` allocated on `call` and deallocated on `return` while `globalScope` stays untouched). Parts `globalBox, glassWall, stackFrame, returnArrow` | no | ← lesson-04 · → lesson-06 |
| lesson-06 | Silicon Roots & Exam Clinic — Binary, Hexadecimal, Dry-Run Traces & System Recovery | Set 1 station · `amina`, `tari`, `babatunde`, `engr_idris` · 5 beats (decode `0x7E` → `01111110₂` = `126₁₀`, run master dry-run trace, restore town power) | **`programming-bench`** `mode: "recovery-console"`. Controls: 8-bit register toggle switches `b7..b0` (target `0x7E = 01111110₂ = 126₁₀`), hex preset (`0x7E`, `0x4A = 01001010₂ = 74₁₀`, `0xFF = 11111111₂ = 255₁₀`), WAEC dry-run trace stepper (`arr = [14, 7, 22, 9]`, filter even numbers → `total = 36`, `count = 2`), **Step trace**, **Authenticate & Reboot**, **Reset**. Parts `bitSwitches, hexDisplay, traceScreen, powerRelay, townGrid`. Emits `l06:bench`, `l06:bench-done` after matching `0x7E` and completing the 4-element dry-run trace. Expected: `0x7E = 01111110₂ = 126₁₀`; trace on `[14, 7, 22, 9]`: `i=0 (14 even) → total=14, count=1`; `i=1 (7 odd) → total=14, count=1`; `i=2 (22 even) → total=36, count=2`; `i=3 (9 odd) → total=36, count=2` | **`programming-zoom`** `mode: "architecture-bridge"` (vertical silicon-to-Python bridge connecting transistor logic gates → 8-bit register byte `01111110₂` → hex `0x7E` → high-level Python dry-run trace). Parts `transistorGate, byteRegister, hexDecoder, pythonTrace` | no | ← lesson-05 · → Hub (`../../index.html`, "Back to the unit") |

Hub ↔ lesson links: the hub's journey cards and CTAs point at `lessons/lesson-0X/index.html`; every lesson's top nav links `../../index.html`.

## Kit audit

- `kits/code-snippet` (`window.StudyCode` in `html/assets/js/code-kit.js` + `html/assets/css/code.css`): **reuse** in every lesson (`lesson-01` .. `lesson-06`) for offline syntax-highlighted Python/BASIC/Pseudocode blocks, line-by-line `.code-step-note` explanations, interactive execution stepping, and variable watch tables.
- `kits/math-solver` (`window.StudyMath` in `html/assets/js/math-kit.js` + `html/assets/css/math.css`): **reuse** in every lesson for atomic step-by-step LaTeX calculations (precedence, floor/modulus, VAT billing, boolean truth algebra, loop sums, byte offsets `Base + i × S`, temperature conversion, binary/hex conversions) with a plain-English explainer note under every line.
- `kits/study-graph` (`window.StudyGraph` in `html/assets/js/study-graph.js`): **reuse** in Lesson 03 (optional accumulator curve `sum` vs `i`).
- No existing 3D catalog kit covers the 6 programming benches, the 6 concept zooms, or the Ikogosi microgrid story props → **3 new 3D kits** below.

## New kits (for kit-engineer, step 6) — HeartKit v2 fidelity (`.agents/skills/kit-builder/SKILL.md`)

Each lives in `kits/<id>/` with `README.md` + `demo.html`, a classic script exposing `window.<Name>`, `userData.parts`, `update(dt, t)`, `setState()`, `reading()` from a deterministic model, `highlight(part)`, `rect(part)`, offline with `window.THREE` + `window.SceneKit`. No primitive soup: use bevelled extrusions (`ExtrudeGeometry`), lathe-turned terminals/standoffs/crystals (`LatheGeometry`), curved wire/bus harnesses (`TubeGeometry`), and procedural canvas textures (`CanvasTexture`).

1. **`programming-bench`** — `window.ProgrammingBench.create(opts)` (`kits/programming-bench/kit.js` → copy to `html/assets/js/programming-bench.js`), 6 modes matching the lesson table above:
   - `memory-variables` (L01): 6 bevelled RAM slots (`0x01..0x06`), CPU/ALU core, data bus packets, type badge display, type-mismatch collision flash on `"150" + 20`, clean cast on `int("150") + 20`. Parts: `board, cpu, alu, slot1, slot2, slot3, slot4, slot5, slot6, bus, console`.
   - `logic-switchboard` (L02): industrial microgrid relay board with `batterySensor` dial, `gridSensor` breaker switch, sculpted 3D ANSI logic gate blocks (`andGate`, `orGate`, `notGate` with extruded D-shield, curved OR shield, and inverter triangle+bubble), glowing signal traces, `relay` contactor, and `generator` indicator. Parts: `batterySensor, gridSensor, notGate, andGate, orGate, relay, generator, led`.
   - `loop-stepper` (L03): lathe-turned & extruded mechanical counter gear wheel (`gear`) with indexed teeth, `counterReg` (`i`), `accReg` (`sum`), `condGate` comparator, `watchdog` emergency breaker, and `console`. Parts: `gear, counterReg, accReg, condGate, watchdog, console`.
   - `array-rack` (L04): 8-slot contiguous lithium battery telemetry rack (`slot0..slot7`), sliding motorised `pointer` needle on a rail, red `oobZone` at index `8` with `alarm` strobe beacon. Parts: `rack, slot0, slot1, slot2, slot3, slot4, slot5, slot6, slot7, oobZone, pointer, alarm`.
   - `function-factory` (L05): modular processing chamber (`chamber`) with parameter input hoppers (`hopper`), isolated local stack frame (`localFrame`), untouched `globalBoard`, and return output `chute`. Parts: `hopper, chamber, localFrame, globalBoard, chute, console`.
   - `recovery-console` (L06): 8-bit toggle switch bank (`bitSwitches` `b7..b0`), dual 7-segment/OLED `hexDisplay` (`0x7E`), multi-column `traceScreen`, high-voltage `powerRelay`, and miniature `townGrid` LED array that lights up on reboot. Parts: `bitSwitches, hexDisplay, traceScreen, powerRelay, townGrid`.

2. **`programming-zoom`** — `window.ProgrammingZoom.create(opts)` (`kits/programming-zoom/kit.js` → copy to `html/assets/js/programming-zoom.js`), 6 modes:
   - `translation-pipeline` (L01): `source, compiler, interpreter, binary, cpu`.
   - `decision-tree` (L02): `entry, diamond1, diamond2, branchA, branchB, branchC, elseBranch`.
   - `loop-tracer` (L03): `initBlock, condDiamond, bodyBlock, stepBlock, jumpArc, exitBlock`.
   - `memory-offset` (L04): `baseMarker, strideBar, slotBlocks, addrReadout`.
   - `scope-stack` (L05): `globalBox, glassWall, stackFrame, returnArrow`.
   - `architecture-bridge` (L06): `transistorGate, byteRegister, hexDecoder, pythonTrace`.

3. **`microgrid-props`** — `window.MicrogridProps` (`kits/microgrid-props/kit.js` → copy to `html/assets/js/microgrid-props.js`):
   - Story props for the Ikogosi Microgrid Control Station (Set 1) and Computer & Telemetry Lab (Set 2): solar inverter cabinet with status OLED (`setStatus("error" | "ok")`), 8-cell lithium battery rack (`0..7` with cell #8 gap marker), rugged maintenance laptop with serial cable, clinic cold-chain vaccine refrigerator with `0x7E` alarm display, backup diesel generator unit, and household smart meter board; `dressStation(market)` / `dressLab(lab)` helpers.

## Shared conventions (every lesson-builder must follow)

**Files per lesson:** `index.html`, `data.js`, `story.js`, `bench.js`, `zoom.js`, `lesson.js`, `narration.js` (plus optional `graph.js` in L03). Never edit `html/index.html` or `html/assets/**`.

**Script order** in `lessons/lesson-0X/index.html`:
`../../assets/js/three.min.js` → `paper-core.min.js` → `scene-kit.js` → (`programming-bench.js`, `programming-zoom.js`, `microgrid-props.js` once shipped and copied) → `retrieval-bank.js` → `data.js` → `lesson-kit.js` → `sort-dnd.js` → `story-scene.js` → `story.js` → `bench.js` → (`study-graph.js` → `graph.js` if used) → `zoom.js` → `lesson.js` → `narration.js` → `narrator.js` → `math-kit.js` → `code-kit.js`.
Guard every kit call: `if (window.ProgrammingBench) { … } else { /* self-contained SceneKit 3D fallback exposing the exact same part names and methods */ }` (same for `ProgrammingZoom`, `MicrogridProps`) so every lesson works immediately in parallel and upgrades seamlessly when the kit ships.

**CSS links** in `lessons/lesson-0X/index.html`:
`../../assets/css/fonts.css`, `style.css`, `lesson.css`, `narrator.css`, `math.css`, `code.css`, `lesson-video.css`, then `theme.css` **last**. Do **not** link `hub.css` on lesson pages.

**Body:** `<body class="lesson-page" data-lesson="l0X">` (`l01` … `l06`, matching the `RETRIEVAL_BANK` keys).

**Section ids (the retrieval bank's revisit links use `concepts`, `practical`, `examples`, `zoom` — keep all exactly):**
`#donow` (`#donow-list`), `#story` (`#story-stage`, `#story-text`), `#wonder`, `#sort`, `#practical` (`#method-cards` `#m1`–`#m4`, `#bench-stage`, `#bench-canvas`, `#bench-readout`, `#results-table`, `#expected`), `#concepts` (`#props-table`, `#pos-explorer`), `#zoom` (`#zoom-stage`, `#zoom-canvas`), `#examples` (`#ex1`–`#ex2`, `ol.steps-sol`), `#bridge` (`#big-idea`), `#quiz` (`#quiz-list`), `#reflect` (`#rate-list`), `#assignment`.

**Make Sense for explainer videos (lessons 01, 03, 04 — `apply-video.mjs`):** in **every** lesson `#concepts` must keep `<span class="phase">…Make sense…</span>` **and** an `<h2>` directly inside `#concepts`. Keep `StudyNarrator.pause()` untouched.

**Sort games:** `SortDnD.attach(item, { bins: bins, onDrop: place, onTap: pick })` with `assets/js/sort-dnd.js` loaded before `lesson.js`. **Never** hand-write pointer drag code. `lesson.js` emits `l0X:sort` (`{ correct, total }`) on *Check*.

**Compact benches at 360 px (standing human feedback, `lesson-renderer/SKILL.md` + `html-standards.md` § 4):**
- Every control bar (`.stage-bar`, `.bench-mode`, segmented controls, chip rows, `.bench-readout`) under **260 px** tall; everything below the canvas inside `#bench-stage` under **~600 px**; whole `#practical` under **~2300 px**.
- Method cards = number badge + heading + one line of **≤ 9 words** (tight list on phones, 2×2 on desktop).
- Readout = only the tiles needed (≤ 4 tiles), **one row** (or 2×2 on 360 px), short values (`font-size ≤ 15px`) that cannot overflow.
- Results table = **one compact row per trial** (`table.tbl` or `table.lab-table`).
- **Never reuse shared class names** `.lab`, `.stage`, `.hud`, `.hero`, `.tbl`, `.seg`, `.chips` for small lesson elements — prefix lesson classes (e.g. `.prog-blab`, `.l1-chip`).

**Narration actions:** `narrator.js` has no built-in `story:`, `open:` or `bench:` actions. Each `narration.js` defines its own in `NARRATION.actions` (`story`, `open`, `bench`, `zoom`, `code`, …). 24–28 steps per lesson, `en-NG`, symbols and operators spelled out in `say` ("double equals", "floor division", "zero x seven E", "zero one one one one one one zero base two", "index N minus one").

**CustomEvents** (`document.dispatchEvent(new CustomEvent(name, { detail }))`):
`l0X:bench` (detail = `reading()`), `l0X:bench-done`, `l0X:bench-reset`, `l0X:zoom` (`{ mode }`), `l0X:bridge` (`{ correct }`), `l0X:sort` (`{ correct, total }`), `l0X:pin` (explorer). LessonKit emits `kit:donow`, `kit:note`, `kit:quiz-done`, `kit:rated`, `kit:solution`. Hub-only events: `lab:result`, `hub:tab`, `hub:flip`.

**3D scene API** (`window.StudyScenes.bench` / `.zoom` / `.story`):
`rect(part)`, `highlight(part)`, `setMode(mode)`, `reset()`, plus lesson-specific methods. Bench and zoom stages use `SceneKit.createStage` with default auto-framing; story stages pass `autoFit: false, zoomUi: false, portraitPitch: 0`. Show live values in HTML `.bench-readout`; keep 3D labels ≤ ~20 characters; never `text-transform: uppercase` code identifiers where case matters (`True` ≠ `TRUE`, `int` ≠ `INT`).

**Data:** `window.LESSON_QUIZ` in `data.js` = the 12 MCQs of `03-questions.md` § Lesson 0X Part 1, `{ q, o: [4], a, e }`, keys unchanged. LessonKit automatically appends the retrieval bank's 2 review MCQs (`l02`–`l06`).

**Facts & numbers to keep 100% consistent across all 6 lessons and the hub:**
- **L01:** `"150" + 20` raises `TypeError` (or `"150" + "20" = "15020"`); `int("150") + 20 = 170`; `19 // 4 = 4`, `19 % 4 = 3`; `12 + 8 * 2 - 6 / 2 = 25`; airtime bonus `1000 * 0.15 = 150` → `1150` (WE 1.1) and `1500 * 0.20 = 300` → `1800` (MCQ 12); VAT rate explicitly `7.5%` (`85 * 68 = 5780`, VAT `433.50`, total `₦6,213.50` in WE 1.2).
- **L02:** Generator starts when `battery_level < 20 and not grid_online` (`18%` and `False` → `True`); `(15 > 10) and (4 == 9)` → `False`; `not (8 > 10 or 12 < 15)` → `False`; ATM balance `25000`, request `10000`, limit `20000` → dispenses `₦10,000`, remaining `₦15,000`.
- **L03:** `range(1, 6)` yields `1, 2, 3, 4, 5` (`sum = 15`); `range(2, 10, 2)` yields `2, 4, 6, 8` (4 iterations); 7-day solar readings `[45, 52, 60, 58, 49, 63, 55]` → `total_kwh = 382`, `average_kwh = 54.57`.
- **L04:** 8 lithium cells `cells = [3.25, 3.18, 3.30, 2.95, 3.22, 3.15, 3.28, 3.20]`, valid indices `0..7` (`N - 1 = 7`), `cells[8]` triggers `IndexError`; weakest cell is `cells[3] = 2.95 V` (4th cell); `marks = [70, 80, 90, 100]` → `marks[1] + marks[3] = 170`, average `85.0`.
- **L05:** `calculate_nepa_bill(units, tariff_rate=68.0, vat_rate=0.075)` with `fixed_charge = 1500.0`: `85 units` → `₦7,713.50`, `210 units` → `₦16,851.00`; `celsius_to_fahrenheit(37.0)` → `(37.0 * 9/5) + 32 = 98.6 °F`.
- **L06:** `0x7E = 01111110₂ = 126₁₀`; `0x4A = 01001010₂ = 74₁₀`; `01010011₂ = 83₁₀`; `255₁₀ = 0xFF`; WAEC even-number filter trace on `[14, 7, 22, 9]` → `total = 36`, `count = 2`.
