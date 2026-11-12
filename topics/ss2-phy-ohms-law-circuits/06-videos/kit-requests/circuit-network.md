# Kit request: circuit-network
**Status: REQUESTED 2026-11-08** (ss2-phy-ohms-law-circuits, lesson-03 video). Build before the lesson-03 plan is written.
(02-lesson.md § 7 calls this gap "network-builder"; the reusable id is `circuit-network`.)

Needed for: lesson-03 video, chapters 1–6, 8 and 12 (series vs parallel resistors, current splitting at a junction, collapsing a
mixed network inside out, cells in series vs parallel, the power split `EI = I²R + I²r`, the hot worn battery).
Reusable for: any later DC-network video (lesson-04 shunt/multiplier networks can use `layout: 'parallel'` / `'series'`, potential
divider, Kirchhoff-style junction rule, house wiring in parallel, JSS "series vs parallel bulbs").
Note: the built-in `circuit` kit (one battery, one resistor, meters) stays as it is; this is a separate plug-in kit, not an extension.

## Must show

One schematic circuit in the WAEC textbook style (rectangular wiring, clean right angles), source block on the **left**,
external network on the **right**, wires closing the loop top and bottom.

**Source block (left).**
- `n` identical cells (1–6; the plan uses 1, 2, 3, 4), drawn with the standard cell symbol (long thin + plate, short thick − plate).
- `arr: 'series'`: cells stacked end to end in one vertical column (+ to −). `arr: 'parallel'`: cells side by side as `n` short
  vertical branches between two bus bars, all + plates joined to the same bar. Changing `arr` **animates**: the cells slide from the
  column into the side-by-side rack (and back) over the 1.4 s blend, wires redrawing to match, so the student *sees* "line vs side by side".
- `showr: 1`: each cell has a small internal resistor (zig-zag or box, `COLOR('r')`, red fallback) drawn **inside** a dashed cell
  outline, in series with that cell. `showr: 0`: plain cell symbols (an ideal supply).
- `cellLabel`: one short label (≤ 18 chars) beside the block, e.g. `'1.5 V · 2.0 Ω'`, `'E, r'`, `'12 V ideal'`, `'worn: big r'`.
- `badge`: an "equivalent cell" pill under the block (≤ 18 chars), e.g. `'3E, 3r'`, `'E, r/3'`, `'6.0 V · 8.0 Ω'`; `''` hides it.
  Fades in/out; text crossfades when it changes.
- `heat` 0–1: orange glow and rising heat shimmer on the cell(s) (like the `cell` kit's heat), strength ∝ `heat`.

**External network (right).**
- `layout: 'single'`: one load `R1`. `load` chooses its symbol: `'resistor'` (box/zig-zag), `'pump'` (circle with an M and a small
  impeller mark), `'lamp'` (circle with a cross).
- `layout: 'series'`: `R1` then `R2` (and `R3` if `R3 > 0`) in one line.
- `layout: 'parallel'`: `R1` and `R2` as two branches between two junction nodes (dots), `R1` on the top branch.
- `layout: 'mixed'`: `R1` in series, followed by the parallel pair `R2` (top branch) ∥ `R3` (bottom branch).
- Changing `layout` crossfades/morphs between arrangements (a fade is fine; resistors may glide).
- `L1`, `L2`, `L3`: resistor labels (≤ 10 chars, `COLOR('R')`, orange fallback) placed **beside** each resistor, never on a wire
  carrying moving dots.
- `stage` (mixed and parallel layouts): **0** full network · **1** the parallel pair shrinks/merges into **one** equivalent resistor
  labelled `Lp` (dashed outline to show it is equivalent) · **2** (mixed only) the whole external network merges into one resistor
  labelled `Lext`. Animated merge over the 1.4 s blend; going back to 0 re-opens the pair. This "collapse inside out" is the key visual.

**Charge flow.**
- `flow: 1`: small dots (`COLOR('I')`, green fallback) move round the loop, conventional current direction (out of + round to −).
- **Dot speed in every wire ∝ the current in that wire, computed by the kit** from `E`, `r`, `n`, `arr`, `R1`, `R2`, `R3`, `stage`:
  - series cells: `E_t = nE`, `r_t = nr`; identical parallel cells: `E_t = E`, `r_t = r/n`, each cell branch carries `I/n`.
  - external: single `R1`; series `R1 + R2 (+ R3)`; parallel `R1R2/(R1 + R2)`; mixed `R1 + R2R3/(R2 + R3)`.
  - `I = E_t/(R_ext + r_t)`; branch currents by current division (`I₂ = I·R3/(R2 + R3)` etc.).
  - Map current to speed with one scale per kit instance, clamped to a readable range (min visibly moving, max not a blur); same
    dot spacing everywhere, so speed alone shows "same current in series" and "bigger share through the smaller resistor".
- `split: 1`: pulse the first junction node and briefly fan the dots into the branches (a highlight, no extra physics).

**Tags (plan-supplied strings, so the plan's checks own the numbers).** Each `''` = hidden; fade in/out when set/cleared.
- Current tags (green pill with a small arrow): `Imain` (main wire, near the source), `I1`, `I2`, `I3` (next to each resistor's branch).
- P.d. tags (`COLOR('V')`, blue fallback, small double-headed bracket across the part): `V1`, `V2`, `V3`, `Vp` (across the parallel pair).
- Tags ≤ 10 chars (`'1.75 A'`, `'7.0 V'`), ≥ 12 units, never on top of moving dots or other labels.

**Power bar (optional overlay, bottom of the panel).**
- `bar: 1`: a horizontal bar "total power EI" split into a **useful** segment (`COLOR('P')`, purple fallback) and a **wasted/heat**
  segment (`COLOR('r')`, red fallback with a small flame/heat icon) in the ratio `Puse : Pwaste` (numbers, animate).
- `barLabels: 1`: show `PuseL` and `PwasteL` strings under the segments (e.g. `'4.5 W useful'`, `'0.5 W heat'`); `barLabels: 0`
  shows proportions only (used for the worn battery, which must carry no numbers).

## States

| State | Meaning |
|---|---|
| `n` | number of identical cells, 1–6 (default 1) |
| `arr` | `'series'` \| `'parallel'` (cell arrangement; animated) |
| `E`, `r` | EMF (V) and internal resistance (Ω) **per cell**, numbers for the flow physics only (r may be 0) |
| `showr` | 0/1 internal resistor drawn inside each cell |
| `cellLabel` | short label beside the source block |
| `badge` | equivalent-cell pill text, `''` hides |
| `heat` | 0–1 glow/shimmer on the cells |
| `layout` | `'single'` \| `'series'` \| `'parallel'` \| `'mixed'` |
| `load` | `'resistor'` \| `'pump'` \| `'lamp'` (symbol for `single`) |
| `R1`, `R2`, `R3` | resistances in Ω, numbers for the flow physics (R3 = 0 means absent in `series`) |
| `L1`, `L2`, `L3` | resistor labels |
| `stage` | 0 full · 1 parallel pair merged (`Lp`) · 2 whole external network merged (`Lext`, mixed only) |
| `Lp`, `Lext` | labels of the merged equivalent resistors |
| `flow` | 0/1 charge dots |
| `split` | 0/1 junction pulse + fan-out highlight |
| `Imain`, `I1`, `I2`, `I3` | current tag strings, `''` hides |
| `V1`, `V2`, `V3`, `Vp` | p.d. tag strings, `''` hides |
| `bar` | 0/1 power bar |
| `Puse`, `Pwaste` | bar segment sizes (any units; only the ratio matters; animate) |
| `barLabels` | 0/1 |
| `PuseL`, `PwasteL` | bar segment labels |
| `focus` | dashed pulsing ring on a part: `src`, `cells`, `badge`, `R1`, `R2`, `R3`, `pair`, `node`, `load`, `bar`, or `null` |

## Close-ups (camera `focus` regions)

`src` (whole source block + cellLabel), `cells` (the cell column/rack only, generous enough for both arrangements), `badge`,
`R1`, `R2`, `R3` (each resistor with its label and tags), `pair` (the parallel pair or its merged resistor, with `Vp`), `node`
(first junction and the start of both branches, with `I1`/`I2` tags visible), `load` (the whole external network), `bar`.

## Accuracy

- Cell symbol: long thin line = positive, short thick line = negative. Conventional current leaves the + terminal.
- Series cells: EMFs add, internal resistances add. Identical parallel cells: one EMF, internal resistance `r/n`; the badge text is
  the plan's, but the drawing must never show parallel cells stacked + to − (that would be series).
- Parallel branches share the same two nodes (the same p.d.); the current divides at the node and recombines at the second node.
- The kit's dot speeds must agree with the physics for every configuration the plan uses (relative only):
  - 12 V ideal (r = 0): series 4 + 6 Ω → same speed in both, 1.2 A; parallel 4 ∥ 6 → 3.0 A (faster) vs 2.0 A, main 5.0 A.
  - 14 V, r = 1, mixed 3 + (6 ∥ 12) → main 1.75 A; 6 Ω branch 1.17 A (faster) vs 12 Ω branch 0.58 A.
  - four cells 1.5 V, r = 2, 1.0 Ω pump: parallel 1.0 A (each cell branch 0.25 A) vs series 0.67 A (slower).
  - 5.0 V, r = 0.5, single 4.5 Ω → 1.0 A. Worn: 12 V, r = 1.2, 2.8 Ω → 3.0 A.
  - two cells 2.0 V, r = 0.25, series, 2 ∥ 6 → main 2.0 A; 2 Ω branch 1.5 A vs 6 Ω branch 0.50 A.
- Merged equivalent resistors (stage 1/2) carry the same main current as the network they replace.

## Numbers the plan will drive

```
{ n:3, arr:'series'→'parallel', cellLabel:'E, r', showr:1, E:1.5, r:1, layout:'single', load:'pump', L1:'pump', R1:1, flow:1, heat:0→1 }
{ n:1, cellLabel:'12 V ideal', showr:0, E:12, r:0, layout:'series', R1:4, R2:6, L1:'4.0 Ω', L2:'6.0 Ω', I1:'1.2 A', I2:'1.2 A', V1:'4.8 V', V2:'7.2 V' }
{ layout:'parallel', V1:'12 V', V2:'12 V', split:1, I1:'3.0 A', I2:'2.0 A', Imain:'5.0 A', stage:1, Lp:'2.4 Ω' }
{ n:1, cellLabel:'14.0 V · 1.0 Ω', showr:1, E:14, r:1, layout:'mixed', R1:3, R2:6, R3:12, L1:'3.0 Ω', L2:'6.0 Ω', L3:'12.0 Ω',
  stage:0→1 (Lp:'4.0 Ω')→2 (Lext:'7.0 Ω')→0, Imain:'1.75 A', Vp:'7.0 V', I2:'1.17 A', I3:'0.58 A' }
{ n:3, badge:'3E, 3r' → arr:'parallel', badge:'E, r/3' }
{ n:4, arr:'parallel'→'series', cellLabel:'1.5 V · 2.0 Ω', E:1.5, r:2, load:'pump', L1:'1.0 Ω pump', R1:1,
  badge:'1.5 V · 0.5 Ω' / '6.0 V · 8.0 Ω', Imain:'1.0 A' / '0.67 A' }
{ n:1, cellLabel:'5.0 V · 0.5 Ω', E:5, r:0.5, load:'resistor', R1:4.5, L1:'4.5 Ω', bar:1, Puse:4.5, Pwaste:0.5,
  barLabels:0→1, PuseL:'4.5 W useful', PwasteL:'0.5 W heat' }
{ cellLabel:'worn: big r', E:12, r:1.2, R1:2.8, L1:'2.8 Ω', Puse:25.2, Pwaste:10.8, barLabels:0, heat:1 }
{ n:2, arr:'series', cellLabel:'2.0 V · 0.25 Ω', E:2, r:0.25, layout:'parallel', R1:2, R2:6, L1:'2.0 Ω', L2:'6.0 Ω',
  stage:1, Lp:'1.5 Ω', badge:'4.0 V · 0.50 Ω', Imain:'2.0 A' }
```
Focus/camera regions used: `src`, `cells`, `badge`, `node`, `pair`, `load`, `bar`.

## Look like

The built-in `circuit` kit (`.agents/skills/explainer-video/runtime/runtime.js`) and `kits/video/heart`: dark card, soft walls, same
palette, wires in the same stroke weight. Role colours from the plan via `COLOR('I')`, `COLOR('V')`, `COLOR('R')`, `COLOR('r')`,
`COLOR('P')`, `COLOR('E')` with fallbacks green / blue / orange / red / purple / gold. All labels via `tx()`, ≤ 18 characters
(resistor and tag labels ≤ 10), ≥ 12 units, readable at a 270 px wide panel; with `n = 4` in parallel plus a mixed network the panel
must still not crowd (shrink spacing, never the text). Pure function of time; no randomness at draw time.
