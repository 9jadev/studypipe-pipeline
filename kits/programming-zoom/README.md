# `programming-zoom` (`window.ProgrammingZoom`, v1)

Six 3D SceneKit concept close-ups for *Introduction to Programming* (`introduction-to-programming`, Lessons 01–06):
`translation-pipeline` (L01) · `decision-tree` (L02) · `loop-jump` (L03) · `memory-offset` (L04) · `stack-frame` (L05) · `silicon-bridge` (L06).
Classic script, 100% offline, no `fetch`, no ES modules, no external textures. Requires `window.THREE` (r160 bundle); `SceneKit` optional.

```html
<script src="three.min.js"></script><script src="scene-kit.js"></script><script src="programming-zoom.js"></script>
```
Lessons copy `kits/programming-zoom/kit.js` to `html/assets/js/programming-zoom.js`.

## Mount (`zoom.js`)
```js
var z = ProgrammingZoom.create({
  mode: "translation-pipeline",
  labels: window.innerWidth >= 560,
  onEvent: function (name, detail) {}
});
stage.rig.add(z);
Object.keys(z.parts).forEach(function (id) { stage.addPart(id, z.parts[id], id); });
var v = z.viewFor("all"); // { target:[x,y,z], dist, pitch }
```

## Methods on the returned `THREE.Group`
- `setMode(mode)` · `setState(patch)` (returns `reading()`) · `reading()` · `reset()` · `update(dt, t)` (`= tick`)
- `highlight(part)` (pulsing emissive highlight; `null` clears) · `viewFor(part)` · `pickPart(raycaster)` · `triangles()`
- `params()` · `on(event, fn)` · `modes` · `userData.parts` (`= parts`).
- `ProgrammingZoom.makeHighlighter(scene)` also provided.

## Modes, Parameters & `reading()`
Every reading is computed dynamically from `ProgrammingZoom.model`:

### 1. `"translation-pipeline"` (Lesson 01)
- **Defaults:** `{ step: 0, translator: "compiler", raw_str: "85", addend: 20 }`
- **Apparatus:** 4-stage 3D conveyor & biconvex optical lens pipeline transforming `total_kwh = int(raw_str) + 20` → Lexer/Parser AST token tree → Compiler (batch native binary) vs Interpreter (line-by-line bytecode) gate → glowing 0/1 voltage pulses entering the ALU silicon die (`105 kWh = 0x69 = 01101001₂`).
- **Parts:** `sourceStage, lexerStage, translatorGate, siliconDie, pulseStream`

### 2. `"decision-tree"` (Lesson 02)
- **Defaults:** `{ step: 0, battery: 15, grid_online: false }`
- **Apparatus:** 3D illuminated branching logic conduit with extruded diamond decision nodes (`battery < 20?`, `not grid_online?`), glowing green True and red False spline tube pathways, and energy beads routing dynamically down the active branch to `activate_generator()` or `maintain_solar_charge()`.
- **Parts:** `rootDiamond, secondDiamond, trueBranch, falseBranch, genAction, solarAction`

### 3. `"loop-jump"` (Lesson 03)
- **Defaults:** `{ step: 0, iter: 1, stop: 6, kwh: [0, 45, 52, 60, 58, 49] }`
- **Apparatus:** 3D vertical execution pipeline with 4 instruction stages (`Init: i = 1`, `Test: i < 6`, `Body: total += kwh[i]`, `Step: i = i + 1`), a glowing arched back-edge feedback tube launching the execution pulse orb back to the condition diamond on iterations `1..5`, and a red termination exit chute when `i = 6`.
- **Parts:** `initNode, condNode, bodyNode, stepNode, backEdgeArc, exitChute, pulseOrb`

### 4. `"memory-offset"` (Lesson 04)
- **Defaults:** `{ index: 0, base: 0x1000, elemSize: 4, length: 8, values: [3.2, 3.3, 3.1, 3.2, 3.4, 3.0, 3.3, 3.2] }`
- **Apparatus:** 3D microscopic RAM bus inspector showing 8 contiguous 4-byte memory blocks starting at `Base = 0x1000` (each housing 4 individual 1-byte lanes for a 32-bit float), a glowing caliper spanning `Offset = Index × 4 bytes`, and an overhead `Address = 0x1000 + (i × 4)` laser pointer targeting `Index 0..7` or colliding with the pulsing red boundary wall at `Index 8` (`0x1020`, `IndexError`).
- **Parts:** `baseMarker, caliper, byteBlocks, addressLaser, boundaryWall`

### 5. `"stack-frame"` (Lesson 05)
- **Defaults:** `{ step: 0, units: 85, tariff_rate: 68.0, vat_rate: 0.075, fixed_charge: 1500.0, global_revenue: 42000.0 }`
- **Apparatus:** 3D Call Stack tower with a permanent `Global Scope` base platform (`TARIFF = 68.0`, `total_revenue`) and an animated translucent `Stack Frame` elevator box (`calculate_nepa_bill`: local `units`, `energy_cost`, `vat_amount`, `total_bill`) enclosed in one-way scope glass that pushes onto the stack (`step: 1`), executes locally (`step: 2`), emits the return value orb (`7713.50`) down the return chute, and pops/dissolves (`step: 3`).
- **Parts:** `globalBase, stackFrame, oneWayGlass, localVars, returnOrb`

### 6. `"silicon-bridge"` (Lesson 06)
- **Defaults:** `{ tier: 0, byteVal: 0x7E, total: 36, threshold: 30, vdd: 3.3 }`
- **Apparatus:** 4-tier vertical architecture tower connecting Tier 1 (`Python: if total >= 30`) → Tier 2 (`Assembly: CMP R0, #30; BGE`) → Tier 3 (`Hex/Binary Register: 0x7E = 01111110₂`) → Tier 4 (`3D CMOS Silicon Logic Gate` with P-channel and N-channel MOSFETs and live voltage probe switching between `0.0 V Low` and `3.3 V High`).
- **Parts:** `pythonTier, asmTier, hexTier, cmosTier, voltageProbe`
