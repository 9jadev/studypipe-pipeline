# Kit request: membrane-transport
**Status: REQUESTED 2026-11-07** (ss1-bio-plant-animal-cell-structure, lesson-04 video). Build before the lesson-04 plan is written.

Needed for: lesson-04 video, chapters 2–6 and 8 (diffusion, osmosis and active transport at a membrane; a plant cell and a red
blood cell in hypotonic, isotonic and hypertonic solutions; a potato strip gaining or losing mass in a sucrose tube).
Reusable for: any later video on diffusion (alveoli, root hairs, placenta), osmosis (root hair uptake, turgor and wilting, food
preservation with salt/sugar, kidney), active transport (mineral uptake, gut glucose), and every potato/yam/cocoyam osmometer
practical. The ss2 `capillary-bed` kit stays separate (tissue-fluid pressures); this kit is the general cell-membrane kit.

Three scenes in one kit (`scene`, cross-fade like `kits/video/blood`):

## Scene `membrane` (a vertical membrane splitting the panel into a left and a right compartment)

Must show:
- **diffusion** (`mode: 'diffusion'`): no membrane (or a dotted fully permeable line that particles pass freely); amber solute dots
  start crowded on the left and spread until evenly spread across both sides as `spread` goes 0 → 1. Dots keep jiggling at
  `spread = 1` (random motion continues; only the *net* movement stops). Optional net arrow left → right that fades as `spread` → 1.
- **osmosis** (`mode: 'osmosis'`): a **selectively permeable membrane** drawn as a wall with small pores. Small blue water
  molecules on both sides; bigger amber sugar/solute molecules (about 2.5× the water dot) only on the right (concentrated side),
  more water dots on the left (dilute side). Water dots pass through the pores **both ways**, but more cross left → right
  (net flow); solute dots bounce off the membrane and **never** cross. As `level` goes 0 → 1 the liquid level on the right side
  rises and the left falls (like a U-tube / osmometer), visibly.
- **active** (`mode: 'active'`): the membrane with one **carrier (pump) protein**; outside (left) has few purple ion dots, inside
  (right) has many. With `pump: 1` an ion enters the carrier from the scarce side, the carrier changes shape, and releases it on
  the plentiful side; each cycle a small **ATP → ADP** spark/label appears at the carrier (energy from respiration). With
  `pump: 0` (e.g. respiration stopped) nothing crosses. Ions never cross anywhere except through the carrier.

States (membrane):
- `mode` `'diffusion'` | `'osmosis'` | `'active'`
- `spread` 0–1 (diffusion progress: crowded → even)
- `level` 0–1 (osmosis: right-side level rise; 0 = equal levels)
- `flow` 0/1 molecules moving (0 freezes the net movement, for "predict first" moments)
- `arrows` 0/1 net-movement arrow (diffusion: high → low; osmosis: water arrow dilute → concentrated; active: low → high,
  labelled `against gradient`)
- `pump` 0/1 carrier cycling with ATP sparks (active only)
- `labels` 0/1: `dilute` / `concentrated` (osmosis), `crowded` / `fewer` (diffusion), `outside` / `inside` (active),
  `membrane`, `pore`, `water`, `sugar`, `carrier`, `ATP`

Close-ups: `membrane` (the membrane strip with pores), `pore` (one pore, water passing, sugar blocked), `pump` (carrier + ATP),
`left`, `right` (each compartment).

## Scene `cells` (a plant cell on the left and a red blood cell on the right, both sitting in the same bath)

Must show:
- **Plant cell**: rectangular cellulose **cell wall** (thick, green-brown, drawn separately from the membrane), cell membrane just
  inside it, cytoplasm, large central **vacuole** (cell sap) with a thin tonoplast, nucleus at the side, a few chloroplasts.
- **Red blood cell**: biconcave disc in face view (pale centre, no nucleus), membrane only, **no wall** (reuse the look of the
  `blood` kit red cell).
- The bath: tinted by `solution` (paler for hypotonic, mid for isotonic, darker/amber-speckled for hypertonic), with a short
  label at the top: `hypotonic` / `isotonic` / `hypertonic`.
- Small blue water arrows/dots crossing each membrane: **in** for hypotonic, **equal both ways** for isotonic (no net arrow),
  **out** for hypertonic.
- As `progress` goes 0 → 1 the cells change to their end state:
  | solution | plant cell (end state) | red cell (end state) |
  |---|---|---|
  | `hypo` | vacuole swells, membrane presses hard on the wall, wall bulges slightly but **never breaks**: `turgid` | swells into a sphere, then **bursts** (membrane tears, red haemoglobin spreads into the bath, cell outline gone): `haemolysis` |
  | `iso` | unchanged / slightly soft: `flaccid` (lesson wording: `normal / flaccid`) | unchanged biconcave disc: `normal` |
  | `hyper` | vacuole shrinks, **membrane and cytoplasm pull away from the wall** (gap at the corners filled with bath liquid), wall keeps its shape: `plasmolysed` | shrinks with a spiky, crinkled edge: `crenated` |
- With `terms: 1`, the state word appears under each cell (`turgid` / `flaccid` / `plasmolysed`; `burst` or `haemolysis` /
  `normal` / `crenated`).

States (cells):
- `solution` `'hypo'` | `'iso'` | `'hyper'` (a change resets the cells to normal and re-runs `progress` from 0 when `fresh`)
- `progress` 0–1 how far the change has gone (numeric so it animates smoothly; burst happens only above about 0.85)
- `plant` 0/1 · `rbc` 0/1 show each cell (so either can be shown alone)
- `arrows` 0/1 water arrows across the membranes
- `labels` 0/1 parts: `cell wall`, `membrane`, `vacuole`, `red cell`, `no wall`
- `terms` 0/1 state words under each cell

Close-ups: `plant`, `rbc`, `wall` (the plant cell's corner where the membrane meets/leaves the wall), `bath` (the solution label).

## Scene `strip` (one boiling tube of sucrose solution with a potato strip, and a top-pan balance beside it)

Must show: a boiling tube in a rack, solution tinted by `conc`, an Irish-potato strip (cream, cork-borer cylinder) inside it; a
top-pan balance with a digital display showing `mass` to 2 d.p. with `g`. The strip's length and plumpness follow `change`
(% change in mass): longer and firmer for +, shorter and limp (slight bend) for −. A small water arrow into/out of the strip
matches the sign of `change`.

States (strip):
- `conc` number, mol dm⁻³, shown on the tube label to 1 d.p. (`0.0 mol/dm³` … `1.0 mol/dm³`; the label may use `mol dm⁻³`)
- `mass` number shown on the balance, 2 d.p. (e.g. 2.50 → 2.85)
- `change` number, % (−20 … +20), drives strip size; 0 = unchanged
- `onBalance` 0/1 strip sits on the balance pan (for "weigh it") vs in the tube
- `arrows` 0/1 water arrow into / out of the strip · `labels` 0/1 (`potato strip`, `sucrose`, `balance`)

Close-ups: `tube`, `strip`, `balance` (the display must be readable on a phone at this close-up).

## All scenes

- `scene` `'membrane'` | `'cells'` | `'strip'` · `focus` dashed pulsing ring on any close-up name above, or `null`

## Accuracy

- Osmosis moves **water only**; solute (sugar/salt) dots never cross the selectively permeable membrane. Net water movement is from
  the dilute side (more water) to the concentrated side (less water). Water still crosses both ways; only the net is one way.
- Diffusion: net spreading from crowded to fewer until even; particles keep moving after equilibrium.
- Active transport: from scarce to plentiful (against the gradient), only through a carrier, only while ATP is supplied.
- The **cell wall is fully permeable** and never controls entry; the membrane does. In plasmolysis the wall keeps its shape and the
  gap between wall and membrane fills with the outside solution. A plant cell in water becomes turgid and **does not burst**.
- Red cells have **no wall**: they burst in hypotonic (haemolysis) and crenate in hypertonic. Never label a red cell "plasmolysed".
- The lesson's numbers the plan will drive (strip scene): 0.0 mol dm⁻³, 2.50 → 2.85 g, +14.0%; 0.6 mol dm⁻³, 2.50 → 2.30 g, −8.0%.

## Look like

`kits/video/blood` (red cell shape, palette, dark card, soft walls). Water = blue/sky, solute = amber, ions = purple, ATP spark =
gold, plant wall = green. Labels ≤ 18 characters, ≥ 12 units, never on top of moving dots; readable at 270 px.
