# Video kit · circuit-network

One WAEC-style schematic loop (rectangular wiring): **source block on the left**, **external network on the right**, wires
closing the loop top and bottom. Same symbols and colour roles as the built-in `circuit` kit: cells gold (`E`, long thin plate
= +, short thick plate = −), current green (`I`), p.d. blue (`V`), resistors orange (`R`), internal resistance red (`r`),
power purple (`P`). Colours follow the plan's `meta.roles` when those keys are defined, else these fallbacks.

- **Cells:** `n` identical cells in a column (`arr: 'series'`) or side by side between two bus bars (`arr: 'parallel'`, every +
  plate on the top bar). Changing `arr` slides the cells between the two arrangements and the leads redraw.
- **Network:** `single` (resistor, pump or lamp) · `series` (R1, R2, optional R3) · `parallel` (R1 top branch ∥ R2 bottom) ·
  `mixed` (R1 then R2 ∥ R3). `stage` collapses it inside out: 1 = the pair merges into one dashed equivalent resistor (`Lp`),
  2 = (mixed) the whole network merges into one (`Lext`).
- **Charge flow (computed by the kit):** dots leave +, go round the loop, return to −. Speed in every wire = 30 px/s per ampere
  (clamped 9–165 px/s), same spacing everywhere, from `E`, `r`, `n`, `arr`, `R1–R3`: series cells nE, nr; identical parallel
  cells E, r/n with I/n in each cell branch (bus bars carry the running sum); `I = E_t/(R_ext + r_t)`; current division in the
  pair. Merged equivalents carry the same main current. Speed changes crossfade two dot streams, so dots never jump.
- **Tags are plan-supplied strings** (the plan's checks own the numbers): current pills and p.d. brackets fade in and out.

## States (`{ panel: 'circuit-network', s: { … } }`)

| State | Meaning |
|---|---|
| `n` | number of identical cells, 1–6 (default 1) |
| `arr` | `'series'` \| `'parallel'` (animated) |
| `E`, `r` | EMF (V) and internal resistance (Ω) per cell, physics only (default 1.5, 0) |
| `showr` | 0/1: internal resistor inside a dashed outline in each cell |
| `cellLabel` | short label above the source block (≤ 18 chars) |
| `badge` | equivalent-cell pill under the block, e.g. `'3E, 3r'`; `''` hides |
| `heat` | 0–1: orange glow and rising shimmer on the cells |
| `layout` | `'single'` \| `'series'` \| `'parallel'` \| `'mixed'` |
| `load` | `'resistor'` \| `'pump'` \| `'lamp'` (symbol for `single`) |
| `R1`, `R2`, `R3` | Ω, physics only (`R3 = 0`: absent in `series`) |
| `L1`, `L2`, `L3` | resistor labels (≤ 10 chars) |
| `stage` | 0 full · 1 pair merged (`Lp`) · 2 whole network merged (`Lext`, mixed only) |
| `Lp`, `Lext` | labels of the merged equivalents |
| `flow` | 0/1 charge dots |
| `split` | 0/1 pulse at the first junction + fan arrows into the branches |
| `Imain`, `I1`, `I2`, `I3` | current pills (main wire near the source; each resistor's branch); `''` hides |
| `V1`, `V2`, `V3`, `Vp` | p.d. brackets across each resistor; `Vp` node to node under the pair; `''` hides |
| `bar` | 0/1 power bar "total EI" = useful (purple) + heat (red, flame) |
| `Puse`, `Pwaste` | segment sizes (ratio only; animate) |
| `barLabels` | 0/1 show `PuseL` / `PwasteL` (0 = proportions only, e.g. the worn battery) |
| `PuseL`, `PwasteL` | bar labels |
| `focus` | dashed ring: `src` `cells` `badge` `R1` `R2` `R3` `pair` `node` `load` `bar`, or `null` |

Which resistor is where: `parallel` → R1 top branch, R2 bottom; `mixed` → R1 in series, R2 top branch, R3 bottom.
In `mixed`, `I1` equals the main current; prefer `Imain`.

## Camera close-ups (`{ camera, focus: '…' }`)

`src` (block + cellLabel) · `cells` (column or rack) · `badge` · `R1` `R2` `R3` · `pair` (pair or its merged resistor, with `Vp`) ·
`node` (first junction, both branch starts, `I` pills of the branches) · `load` (whole external network) · `bar`

## Good for

Series vs parallel resistors, current division at a junction, collapsing a mixed network to its equivalent resistance, cells
in series vs parallel (nE, nr vs E, r/n), the power split EI = I²R + I²r and efficiency, a worn battery heating up; later:
shunt / multiplier networks (`parallel` / `series`), potential dividers, house wiring in parallel, JSS series vs parallel bulbs.

## Used in

- `ss2-phy-ohms-law-circuits` lesson-03 video
- Demo: `kits/video/circuit-network/demo.plan.cjs` (every state and close-up, with lesson-03 numbers)
