# Video kit · membrane-transport

The general cell-membrane kit. It has three scenes (`scene`, cross-fading):

- **membrane**: a tank split by a membrane.
  - `diffusion`: no barrier. Solute dots spread from crowded to evenly spread and keep jiggling.
  - `osmosis`: a selectively permeable membrane with pores. Water crosses both ways, with more crossing left → right. Sugar is 2.5× the size of water, bounces off the membrane and never crosses. The concentrated side's level rises.
  - `active`: the pores are closed. One carrier protein changes shape and moves an ion from the scarce side to the plentiful side, with an ATP → ADP spark each cycle. Nothing crosses unless the pump is on.
- **cells**: a plant cell (cellulose wall, membrane, cytoplasm, sap vacuole with tonoplast, nucleus, chloroplasts) and a red cell (biconcave, no nucleus, **no wall**) in one bath. The bath's tint and label follow the solution.
  - hypo: the plant cell becomes turgid. Its wall bulges slightly and never breaks. The red cell swells, then bursts above progress 0.85 (haemolysis): haemoglobin spreads into the bath and the outline disappears.
  - iso: flaccid · normal.
  - hyper: the plant cell is plasmolysed. The membrane pulls away from the wall corners first, and the gap fills with bath liquid (amber specks). The red cell is crenated (shrunk, spiky edge).
- **strip**: a potato strip in a sucrose boiling tube in a rack, next to a top-pan balance. The tube label shows concentration (1 d.p.). The display shows mass (2 d.p.) and counts smoothly between readings. The strip is longer and firmer for +% and shorter and limp for −%. It can be lifted onto the pan.

Colours come from `api.PAL` / `api.C`: water `sky`, solute `amber`, ions `purple`, ATP `gold`, wall `green` mixed with `orange`, red cell `red`.

## States (`{ panel: 'membrane-transport', s: { … } }`)

| State | Scene | Meaning |
|---|---|---|
| `scene` | all | `'membrane'` · `'cells'` · `'strip'` |
| `labels` | all | 0/1: part labels |
| `arrows` | all | 0/1: net-movement arrows. membrane: left → right in every mode (`against gradient` in active, only while pumping). cells: water in / both ways / out. strip: water into or out of the strip. |
| `focus` | all | ring a part (names below), or `null` |
| `mode` | membrane | `'diffusion'` · `'osmosis'` · `'active'` |
| `spread` | membrane | 0–1: diffusion, crowded → even. Labels change from `crowded`/`fewer` to `evenly spread`. |
| `level` | membrane | 0–1: osmosis level on the right rises and the left falls (dashed line marks the start level) |
| `flow` | membrane | 0/1 (default 1): 0 freezes all motion and crossing, for a "predict first" moment |
| `pump` | membrane | 0/1 (default 0): carrier cycling with ATP. 0 = nothing crosses (e.g. respiration stopped). |
| `solution` | cells | `'hypo'` · `'iso'` · `'hyper'`. Changing it resets both cells and replays `progress` from 0. |
| `progress` | cells | 0–1: how far the change has gone (state words fade in after about 0.6; haemolysis after 0.85) |
| `plant` · `rbc` | cells | 0/1 (default 1): show each cell |
| `terms` | cells | 0/1: turgid / flaccid / plasmolysed · haemolysis / normal / crenated |
| `conc` | strip | mol dm⁻³ on the tube label; also tints the solution |
| `mass` | strip | g on the balance (2 d.p.) |
| `change` | strip | % change in mass, −20 … +20 |
| `onBalance` | strip | 0/1: strip on the pan (it arcs out of the tube) |

## Camera close-ups (`{ camera, focus: '…' }`)

- membrane: `membrane` `pore` (pore label, water through, sugar blocked) `pump` (carrier + ATP) `left` `right`
- cells: `plant` `rbc` `wall` (plant-cell corner where the membrane leaves the wall) `bath` (solution label)
- strip: `tube` `strip` (strip in the tube) `balance` (the display is readable on a phone)

## Good for

Diffusion (alveoli, root hairs, placenta), osmosis (root-hair uptake, turgor and wilting, salting/sugaring food, the kidney, the
0.9% saline drip), active transport (mineral-ion uptake, glucose in the gut), and potato/yam/cocoyam osmometer practicals and the isotonic point.

## Used in

- `ss1-bio-plant-animal-cell-structure` lesson-04 video (requested)
- Demo: `kits/video/membrane-transport/demo.plan.cjs` (checks: 2.50 → 2.85 g = +14.0%, 2.50 → 2.30 g = −8.0%)
