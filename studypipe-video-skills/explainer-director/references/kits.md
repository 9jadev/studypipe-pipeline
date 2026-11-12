# Kit catalogue

Kits are tested, reusable visuals that sit in the right-hand panel. The director only sets their state; the runtime draws and animates them. Every numeric state field animates smoothly from its previous value over 1.4 seconds, so moving a needle is just setting a new number.

Registered kits: `graph`, `area`, `circuit`, `cell`, `toll`. Anything else is a kit gap (see the end of this file).

---

## graph — generic plotter (maths and physics)

Plots functions, straight lines, points, gradient triangles, guide lines and labels. Items appear when their id is added to `show` and fade or draw in; lines and curves draw progressively.

```js
const CS = { id: 'cs', x: [-8, 2, 2], y: [-16, 15, 4], xlabel: 'x', ylabel: 'y', items: [
  { id: 'curve', type: 'fn', fn: 'x*x + 6*x - 2', domain: [-8, 2], color: 'amber', label: 'y = x² + 6x − 2', labelAt: [-7.6, 13] },
  { id: 'vguide', type: 'guide', at: [-3, -11], color: 'green' },
  { id: 'vertex', type: 'point', at: [-3, -11], color: 'green', label: 'minimum (−3, −11)', pos: 's' },
  { id: 'roots', type: 'points', pts: [[-6.3166, 0], [0.3166, 0]], labels: ['≈ −6.32', '≈ 0.32'], color: 'sky', pos: 'n' }] };

{ panel: 'graph', s: { spec: CS, show: ['curve'] }, fresh: 1 }
{ panel: 'graph', s: { show: ['curve', 'vguide', 'vertex'] } }          // keeps the spec, adds items
{ panel: 'graph', s: { show: ['curve', 'vguide', 'vertex', 'roots'], pulse: 'roots' } }
```

| Spec field | Meaning |
| --- | --- |
| `id` | Unique per spec. A new id rebuilds the graph |
| `x`, `y` | `[min, max, tickStep]` |
| `xlabel`, `ylabel`, `xcolor`, `ycolor` | Axis titles and their colour (palette name or role) |

| Item type | Fields |
| --- | --- |
| `fn` | `fn` (JavaScript expression in `x`; `Math` functions allowed: `sin(x)`, `sqrt(x)`, `PI`), `domain`, `color`, `width`, `label`, `labelAt` |
| `line` | `from: [x, y]`, `to: [x, y]`, `color` |
| `polyline` | `pts: [[x, y], ...]` |
| `point` | `at`, `color`, `label`, `pos` (`n s e w ne nw se sw`), `hollow` |
| `points` | `pts`, `labels` (array, `null` to skip), `color`, `labelColor`, `pos`, `hollow` |
| `triangle` | `from`, `to` (rise/run triangle), `dx`, `dy` labels, `color` |
| `guide` | `at` — dashed lines from the point to both axes |
| `text` | `at`, `text` (string or array of lines), `color`, `size`, `anchor` |

State: `spec`, `show` (array of item ids), `pulse` (item id to pulse). Trig in degrees: write `sin(x*PI/180)`.

---

## area — completing-the-square area model

Shows x² + bx as a square plus a rectangle, splits the rectangle, moves the strips, reveals the missing (b/2)² corner, then the completed (x + b/2)² square.

State: `stage` (0 square only · 1 add bx rectangle · 2 split into two strips · 3 move strips · 4 show missing corner · 5 completed square), `b` (positive number, default 6). Labels update from `b`.

```js
{ panel: 'area', s: { stage: 0, b: 6 } }   ...   { panel: 'area', s: { stage: 5 } }
```

---

## circuit — circuit bench (electricity)

Battery, brass switch, resistor, analogue voltmeter across the battery, ammeter in series, and charge dots that flow when the switch is closed. Dot speed follows the current.

| State | Meaning |
| --- | --- |
| `sw` | 0 open, 1 closed |
| `V`, `vmax` | Voltmeter reading and full scale (scale ticks adapt: 5 or 15 V) |
| `A`, `amax` | Ammeter reading and full scale (use 1 for currents under 1 A) |
| `R` | Resistor label, e.g. `'2.8 Ω'` |
| `bat` | Battery label, e.g. `'12 V'` or `'cell'` |
| `focus` | Dashed pulsing ring: `'V'`, `'A'`, `'bat'`, `'term'` (terminals glow blue) or `null` |
| `ghost`, `ghostTo` | Red arc on the voltmeter from the current reading up to `ghostTo` (the "lost" volts) |
| `showr`, `bracket` | Internal resistor drawn inside the battery; "total resistance = R + r" label |
| `loss` | Red text under the battery, e.g. `'3.6 V lost inside'` |
| `tickA` | Green tick by the ammeter |

```js
{ panel: 'circuit', s: { sw: 0, A: 0, V: 12, R: '2.8 Ω', bat: '12 V', amax: 5, vmax: 15 }, fresh: 1 }
{ panel: 'circuit', s: { sw: 1, A: 3.0 } }
{ panel: 'circuit', s: { V: 8.4, ghost: 1, ghostTo: 12, focus: 'V' }, at: .6 }
```

---

## cell — lead–acid cell cross-section (internal resistance, electrochemistry)

Lead and lead dioxide plates in sulfuric acid with ions drifting between them.

State (all 0 or 1): `labels` (plate and acid labels), `ions` (moving ions), `drag` (ions slow and jostle), `rlabel` ("internal resistance r" with resistor symbol), `worn` (rough, coated plates), `heat` (orange glow and heat waves).

```js
{ panel: 'cell', s: { labels: 0, ions: 0, drag: 0, rlabel: 0, worn: 0, heat: 0 }, fresh: 1 }
{ panel: 'cell', s: { ions: 1 } }   { panel: 'cell', s: { drag: 1, rlabel: 1 } }
```

---

## toll — energy tollgate (energy per coulomb, EMF and lost volts)

A "1 C" coin travels a toll road: collects energy at the battery, pays a toll inside, spends the rest in the circuit. A ledger fills in.

State: `stage` (0 waiting · 1 receives · 2 pays toll · 3 spends outside · 4 totals), `nums` (0 symbols, 1 numbers), `values` (default `[12, 3.6, 8.4]`; must satisfy values[0] = values[1] + values[2]), `symbols` (default `['E', 'Ir', 'IR']`), `unit` (default `'J'`).

```js
{ panel: 'toll', s: { stage: 0, nums: 0 }, fresh: 1 }   ...   { panel: 'toll', s: { stage: 4, nums: 1, values: [9, 1, 8] }, fresh: 1 }
```

---

## When no kit fits

Do not improvise drawing code in the plan. In order:

1. **Use a generic kit.** Many ideas work as a graph (number lines, distance–time, rates, titration curves with `polyline`).
2. **Use the board alone.** Clear worked steps with roles, boxes and notes teach most maths well.
3. **Flag a kit gap** in the direction script's "Kit gaps" section:

```
KIT GAP: titration
Needed for: chapters 2–4 (burette reading, colour change at end point)
State it needs: burette volume (0–50 cm³, readable meniscus), drops falling, flask colour (indicator, pH), swirl
Fallback used meanwhile: graph of pH against volume added
```

A developer builds the kit once (see `adding-a-kit.md`), and every future video on that topic uses it.

## Kit backlog (planned)

Titration (burette, pipette, conical flask, indicator colours), qualitative analysis (test tubes, reagent drops, precipitate colours, gas tests), germination time-lapse, electrolysis cell (2D version of the electrolysis lesson), unit circle, number line, geometry triangle, vectors.
