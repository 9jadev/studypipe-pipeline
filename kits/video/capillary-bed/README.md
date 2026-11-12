# Video kit · capillary-bed

One capillary between tissue cells: arteriole (left) → capillary → venule (right), wall one cell thick. Red cells and plasma
proteins flow inside and never leave. **Arrows are driven by the physics:** at five points along the capillary,
NFP = Pc − πc, with Pc falling linearly from `pcA` to `pcV` and πc constant. Arrows point out where NFP > 0 and in where
NFP < 0, with length ∝ |NFP|. Below: a blind-ended lymph capillary with one-way flap valves draining the extra tissue fluid.

## States (`{ panel: 'capillary-bed', s: { … } }`)

| State | Meaning |
|---|---|
| `labels` | 0/1: arteriole, venule, capillary wall, tissue fluid, tissue cell, lymph capillary |
| `cells` · `proteins` | 0/1: red cells in single file · plasma-protein dots (both stay inside) |
| `filtration` · `reabsorption` | 0/1: show the outward arrows (NFP > 0) · the inward arrows (NFP < 0) |
| `pcA` · `pcV` · `pi` | mmHg: blood pressure at the arterial end (35), venous end (15), osmotic pressure (25) |
| `gauges` | 0/1: Pc at both ends, πc, NFP at both ends (computed live) |
| `lymph` · `blocked` | 0/1: lymph capillary and drainage · lymph blocked (elephantiasis) |
| `oedema` | 0–1: tissue swelling with trapped fluid |
| `wall` | 0/1: highlight the one-cell-thick wall |
| `focus` | ring `arterial` · `venous` · `lymph` · `wall`, or `null` |

## Camera close-ups

`arterial` · `venous` · `lymph` · `wall` · `tube`

## Good for

Tissue fluid formation (ultrafiltration), osmotic reabsorption, net filtration pressure along a capillary, lymph formation and
return, oedema (kwashiorkor, standing still), elephantiasis, and why tissue fluid has no red cells or large proteins.

## Used in

- `ss2-bio-heart-circulation` lesson-04 video
- Demo: `kits/video/capillary-bed/demo.plan.cjs`
