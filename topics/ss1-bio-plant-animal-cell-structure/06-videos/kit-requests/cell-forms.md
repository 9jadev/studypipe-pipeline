# Kit request: cell-forms
**Status: REQUESTED 2026-11-07** (ss1-bio-plant-animal-cell-structure, lesson-03 video). Build before the lesson-03 plan is written.

Needed for: lesson-03 video, chapters 1–4 (free-living single cells and their nutrition; colony vs filament vs tissue and division
of labour; the six levels of organisation).
Reusable for: any later video on protists and simple organisms (JSS basic science "living things", SS1 classification of
Protoctista / Thallophyta / Coelenterata), nutrition types (autotrophic, holozoic, saprophytic), and levels of organisation.

Three scenes in one kit (`scene`, cross-fade like `kits/video/blood`).

## Scene `gallery` (a pond-water "drop": a pale circular microscope field holding up to four organisms in a 2 × 2 grid)

Must show, each drawn the way WAEC biological drawings show them (outline, key features, not cartoons):
- `amoeba`: irregular outline that slowly changes shape, 2–3 blunt **pseudopodia**, one nucleus, one clear **contractile vacuole**,
  1–2 **food vacuoles**. With `engulf: 1`: two pseudopodia flow round a small food particle and close over it, leaving it inside a
  new food vacuole (loop the cycle smoothly every ~6 s).
- `paramecium`: slipper shape, fringe of short **cilia** all round (they beat in a wave when `move: 1`), an **oral groove** on one side,
  a large **macronucleus** and small **micronucleus**, two star-shaped contractile vacuoles.
- `euglena`: spindle shape, **one** long **flagellum** from the front (whips when `move: 1`), red **eyespot** near the front, several
  oval green **chloroplasts**, nucleus. No cell wall (thin flexible pellicle outline).
- `chlamydomonas`: oval cell with a clear **cellulose wall**, **two** equal flagella at the front, one large **cup-shaped chloroplast**
  (with a pyrenoid dot), red eyespot, nucleus inside the cup.
- `volvox` (gallery thumbnail only, for the chapter 1 reveal): small hollow green ball of many dots (full drawing is in `compare`).
- `spirogyra`, `hydra` may also be listed in `show` (use the `compare` drawings scaled into the grid cell).
- Nutrition badges (`nutrition: 1`): a short pill under each organism: `holozoic` (Amoeba, Paramecium, Hydra), `autotrophic`
  (Chlamydomonas, Volvox, Spirogyra, Euglena in light), `saprophytic` (Euglena when `light: 0`).
- `light` 0/1: 1 = bright field with a small sun/lamp icon; 0 = the field dims to dark. In the dark: Euglena's badge changes to
  `saprophytic` and small dissolved-food dots drift into its surface (absorption, **not** engulfing); Chlamydomonas's badge
  changes to `no food made` and its chloroplast dulls (it does **not** die instantly on screen).

States (gallery):
- `show` array of ids from `amoeba` `paramecium` `euglena` `chlamydomonas` `volvox` `spirogyra` `hydra`, in grid order (1–4 items;
  items fade in in the order listed, ~0.4 s apart, so the plan can reveal them one by one by growing the array)
- `move` 0/1 cilia, flagella and pseudopodia animate · `engulf` 0/1 the Amoeba feeding loop
- `labels` 0/1 part labels (≤ 18 chars: `pseudopodium`, `food vacuole`, `contractile vac.`, `cilia`, `oral groove`, `macronucleus`,
  `flagellum`, `eyespot`, `chloroplast`, `cell wall`, `cup chloroplast`) and organism names (italic) under each
- `nutrition` 0/1 badges · `light` 0/1

Close-ups: `amoeba`, `paramecium`, `euglena`, `chlamydomonas` (the four grid cells, wherever each sits in `show` order: focus by
organism id, not by grid position; if the id is not shown, fall back to the whole field), `field` (the whole drop).

## Scene `compare` (three organisms side by side: Volvox, Spirogyra, Hydra, each with its form word underneath)

Must show:
- `volvox`: hollow sphere, outline of many small identical green cells round the surface, thin **cytoplasmic strands** joining
  neighbours, 1–2 daughter colonies inside. Form word: `colony`.
- `spirogyra`: an unbranched filament of 4–5 identical cylindrical cells joined end to end, each with a **spiral ribbon chloroplast**
  and central nucleus. Form word: `filament`.
- `hydra`: upright tube-shaped body on a basal disc, a mouth with 5–6 tentacles; a cut-away strip of the body wall shows **two cell
  layers**, `ectoderm` (outer) and `endoderm` (inner). Form word: `tissue level`.
- `jobs` 0/1: colour-code cells by job. Hydra: stinging cells on the tentacles (with a small coiled thread, `catch food`),
  endoderm cells (`digest`), ectoderm covering cells (`cover`) in three distinct colours with a 3-line mini-key. Volvox and
  Spirogyra cells stay one single colour (`all alike`), so the contrast is unmistakable.
- `separate` 0/1: one cell is lifted out of each organism. The Volvox cell (two flagella) swims away and a green ✓ `lives alone`
  appears; the Spirogyra cell stays green with ✓ `lives alone`; the Hydra stinging cell drifts out, greys and fades with a red ✗
  `can't live alone`. Animate over ~3 s after the state turns on, then hold the end state.

States (compare): `labels` 0/1 (organism names, form words, `ectoderm`, `endoderm`, `strands`, `spiral chloroplast`) · `jobs` 0/1 ·
`separate` 0/1 · `move` 0/1 (Volvox rolls slowly, Hydra tentacles sway).

Close-ups: `volvox`, `spirogyra`, `hydra`, `layers` (Hydra's two-layer cut-away).

## Scene `levels` (a vertical ladder of six rungs, simplest at the bottom, each rung = a small icon + level word + example)

Must show: rungs from bottom to top: `organelle` → `cell` → `tissue` → `organ` → `system` → `organism`, an upward arrow beside them
marked `more complex`. Each rung has a small, recognisable icon and a short example (≤ 18 chars).

| rung | `example: 'animal'` (default) | `example: 'plant'` |
|---|---|---|
| organelle | `mitochondrion` (bean with cristae) | `chloroplast` |
| cell | `heart muscle cell` (branched, striated) | `palisade cell` |
| tissue | `heart muscle` (sheet of those cells) | `palisade layer` |
| organ | `heart` (simple front-view heart outline) | `leaf` |
| system | `circulatory sys.` (heart + vessel loop) | `shoot system` |
| organism | `Chinedu` (simple student silhouette) | `ugu plant` |

States (levels):
- `example` `'animal'` | `'plant'`
- `level` 0–6: number of rungs shown from the bottom (numeric, animates: each new rung slides up and fades in; the newest rung
  glows briefly)
- `swap` 0/1: shows the classic wrong order: the `organ` and `system` rungs visibly trade places, a red ✗ and `wrong order` appear;
  turning `swap` back to 0 slides them back with a green ✓
- `labels` 0/1 example text beside each rung (level words always on)

Close-ups: `low` (organelle → tissue), `high` (organ → organism), `ladder` (all six).

## All scenes

- `scene` `'gallery'` | `'compare'` | `'levels'` · `focus` dashed pulsing ring on any close-up name above, or `null`

## Accuracy

- *Euglena*: **one** emergent flagellum, eyespot, chloroplasts, **no** cellulose wall; autotrophic in light, **saprophytic** in the dark
  (absorbs dissolved organic food; never draw it engulfing). *Chlamydomonas*: **two** flagella, **one cup-shaped** chloroplast, cellulose
  wall; autotrophic only.
- *Amoeba* and *Paramecium* are holozoic. *Paramecium* has cilia (never pseudopodia), an oral groove, macro- and micronucleus.
- *Volvox* cells are alike and each nearly self-sufficient (colony); *Spirogyra* is an unbranched filament of identical cells with spiral
  ribbon chloroplasts; *Hydra* has two cell layers (ectoderm, endoderm) with specialised cells → tissue level.
- Ladder order is fixed: organelle, cell, tissue, organ, system, organism. A system is made of organs.

## Numbers the plan will drive
None on screen from this kit (no numeric readouts). The plan drives `show` lists, `level` 0 → 2 → 4 → 6, and the 0/1 switches.

## Look like
`kits/video/blood` and `kits/video/heart` (dark card, soft walls, same palette). Chloroplast green, eyespot red, nucleus purple-grey,
stinging cells amber, digestive cells orange-pink, covering cells sky. Labels ≤ 18 characters, ≥ 12 units, never on top of moving
cilia/flagella; readable at 270 px (the kit panel width on a phone). Organism names in italics.
