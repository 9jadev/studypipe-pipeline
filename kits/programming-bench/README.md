# `programming-bench` (v1) — `window.ProgrammingBench`

Parametric 6-mode 3D Computer Science & Programming hardware bench for `introduction-to-programming` (Lessons 01–06 and Unit Welcome Hub). Classic script, 100% offline, powered by Three.js (`kits/_vendor/three-bundle.min.js`). Every value, memory address, truth-table state, accumulator trace, and NEPA tariff calculation is computed deterministically by `ProgrammingBench.model`.

## Usage
```js
var kit = ProgrammingBench.create({
  mode: "memory-stage",
  onEvent: function (name, detail) {}
});
scene.add(kit);
// Every frame:
kit.update(dt, t);
```

## Methods on the returned `THREE.Group`
| Method | Description |
|---|---|
| `update(dt, t)` (`tick`, `userData.update`) | Advances animations (signal pulses, generator flywheel, brass stepper gear, sliding array pointer, local scope orbs, highlight pulse) |
| `setState(patch)` (`userData.setState`) | Switches `mode` or updates mode-specific parameters and repaints live 3D CanvasTextures |
| `reading()` | Returns deterministic model readout for the active mode + `rows`, `done`, `controls` |
| `takeReading()` | Appends a current measurement/trace row to `rows` and emits `'reading'` (and `'done'` at 3 rows) |
| `step()` | Steps forward one iteration / index / truth-table row / expression and records a reading |
| `highlight(partId, colorHex)` / `clearHighlight()` | Pulses emissive highlight on the named 3D sub-part |
| `viewFor(partId)` | Returns `{ target:[x,y,z], dist, pitch, yawPortrait }` camera framing for any named part or `"all"` |
| `pickPart(raycaster)` | Raycasts visible meshes and returns `partId` or `null` |
| `triangles()` | Returns visible triangle count |
| `reset()` | Resets active mode state and recorded table rows |

## Modes, Parts & Model Verification

### 1. `"memory-stage"` (Lesson 01 — Variables, Data Types & Type Casting)
- **3D Apparatus:** Extruded green FR-4 PCB with mounting holes and 20 gold edge fingers, CPU IC package with gull-wing pins, trapezoid ALU co-processor, spline data bus traces with animated signal pulses, 6 vertical RAM modules (`0x01`–`0x06`) with ejector latches, OLED screen, and status LED beacon.
- **Parts:** `pcb, cpu, alu, bus, slot1, slot2, slot3, slot4, slot5, slot6, display, led`
- **Model (`solveMemory`):**
  - Default slots: `voltage = 230` (`int`, 2B at `0x01`), `tariff = 68.5` (`float`, 4B at `0x02`), `location = "Ikogosi"` (`str`, 7B at `0x03`), `active = True` (`bool`, 1B at `0x04`), `a = "150"` (`str`, 3B at `0x05`), `b = 20` (`int`, 2B at `0x06`).
  - `exprMode`: `"mismatch"` (`"150" + 20` $\to$ `TypeError`, red alarm LED), `"cast"` (`int("150") + 20 = 170`, green LED), `"concat"` (`"200" + "50" = "20050"`), `"precedence"` (`12 + 8 * 2 - 6 / 2 = 25.0`), `"bonus"` (`1500 + 1500 * 0.20 = 1800`).

### 2. `"logic-switchboard"` (Lesson 02 — Boolean Operators & Conditional Branching)
- **3D Apparatus:** Industrial relay switchboard with rotary `Battery Level` dial (`0–100%`), `Mains Grid Status` toggle switch (`Online/Offline`), extruded IEEE logic gate housings (`NOT` triangle + inversion bubble, `AND` D-shape, `OR` curved shield), copper-coil contactor relay with moving armature, and diesel generator unit with spinning spoked flywheel.
- **Parts:** `board, batteryDial, gridSwitch, andGate, orGate, notGate, relay, generator, led`
- **Model (`solveLogic`):**
  - Compares faulty `battery < 20 and grid_online` (`logicMode: "buggy"`) vs fixed `battery < 20 and not grid_online` (`logicMode: "fixed"`) across all 4 truth-table states (`15%` vs `85%`, `Online` vs `Offline`).

### 3. `"loop-stepper"` (Lesson 03 — Counter & Conditional Loops)
- **3D Apparatus:** 16-tooth extruded brass stepper gear with central bore and steel axle, Counter register `i` 7-segment panel, Accumulator `total` register panel, Flowchart condition diamond, backward-jump spline bus tube, Watchdog interrupt beacon, and trace screen.
- **Parts:** `base, gear, counterReg, accumReg, condDiamond, watchdog, bus, display`
- **Model (`solveLoop`):**
  - `dataset: "solar"` steps through `daily_readings = [45, 52, 60, 58, 49, 63, 55]` kWh (`i = 0..6`, cumulative `total = 45, 97, 157, 215, 264, 327, 382`, mean `54.57` kWh).
  - `dataset: "range5"` steps through `range(1, 6)` (`total = 15`).
  - `dataset: "infinite"` models `while count < 5` without increment $\to$ triggers Watchdog Emergency Halt at step 6.

### 4. `"array-rack"` (Lesson 04 — Contiguous Arrays, Zero-Based Indexing & Bounds)
- **3D Apparatus:** 8-slot contiguous battery-cell memory rack (`Index 0`..`Index 7` at `0x1000`..`0x101C`, 4 bytes per float), cylindrical lithium cells with lathe brass terminals, motorized pointer carriage on a steel guide rail with laser cone needle, and red `Index 8` (`0x1020`) out-of-bounds hazard zone with alarm beacon.
- **Parts:** `rack, pointer, slot0, slot1, slot2, slot3, slot4, slot5, slot6, slot7, oobZone, alarm, display`
- **Model (`solveArray`):**
  - Cells: `[3.25, 3.18, 3.30, 2.95, 3.22, 3.15, 3.28, 3.20]` V.
  - Address formula: $\text{Base } 0\text{x}1000 + (\text{Index} \times 4)$.
  - Minimum scan identifies `min_voltage = 2.95 V` at `Index 3` (4th cell). Dialing `index: 8` triggers `IndexError`.

### 5. `"function-factory"` (Lesson 05 — Modular Functions & Variable Scope)
- **3D Apparatus:** Lathe parameter input hopper (`units`, `tariff_rate`, `vat_rate`), translucent "One-Way Glass" local scope processing dome with orbiting local variable octahedra (`energy_cost`, `vat_amount`, `fixed_charge`), return value conveyor chute (`total_bill`), and isolated global scope memory pillar (`total_revenue`).
- **Parts:** `chamber, hopper, localDome, returnChute, globalPillar, display`
- **Model (`solveFunction`):**
  - `calculate_nepa_bill(units, tariff_rate=68.0, vat_rate=0.075)` with `fixed_charge = 1500.0`:
    - `85 kWh` $\to$ `energy_cost = ₦5,780.00`, `vat = ₦433.50`, `total_bill = ₦7,713.50`
    - `120 kWh` $\to$ `₦10,272.00`
    - `210 kWh` $\to$ `₦16,851.00`
    - `45 kWh` $\to$ `₦4,789.50`

### 6. `"trace-console"` (Lesson 06 — Binary, Hexadecimal & WAEC Dry-Run Trace)
- **3D Apparatus:** 8-bit silicon toggle-switch register bank (`b7`..`b0`) with physical flip levers and green bit LEDs, dual 7-segment Hexadecimal decoder (`0x00`..`0xFF`, highlighting `0x7E = 01111110_2 = 126_10`), WAEC dry-run trace screen, heavy microgrid contactor with moving bridge bar, copper busbars, and recovery beacon.
- **Parts:** `console, switches, hexDisplay, traceScreen, contactor, busbar, statusBeacon`
- **Model (`solveTrace`):**
  - Converts any byte `0..255` between binary, hex, and decimal; verifies `0x7E = 01111110_2 = 126_10`.
  - Traces `readings = [12, 15, 20]`, filtering even values (`12 + 20 = 32`, `evenCount = 2`) and closing the main microgrid contactor when `authOk && traceDone`.
