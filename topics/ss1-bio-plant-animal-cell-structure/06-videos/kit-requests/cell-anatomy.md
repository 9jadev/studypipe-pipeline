# Kit request: cell-anatomy
**Status: REQUESTED 2026-11-07** (ss1-bio-plant-animal-cell-structure, lesson-01 video). Build before the lesson-01 plan is written.

Needed for: lesson-01 video, chapter 8 (prokaryote vs eukaryote: nuclear membrane, circular DNA, membrane-bound organelles,
ribosome size, cell wall is not a test).
Reusable for: any later video on cell structure (a plant cell vs an animal cell for lesson-02 if the cap is raised, organelle
functions, specialised cells), JAMB "prokaryote/eukaryote" drills, microbiology (bacteria) and genetics (where DNA sits).
Overlap note: the lesson-04 `membrane-transport` kit draws a plant cell and a red cell for osmosis; this kit is the
organelle-level anatomy kit. If convenient, share the plant-cell drawing code/look between the two, but keep them separate kits.

## Scene `compare` (two cells side by side, a left slot and a right slot)

Must show:
- `left`, `right` each one of `'bacterium'` | `'plant'` | `'animal'`. Lesson-01 uses `left: 'bacterium'`, `right: 'plant'`.
  - **bacterium** (prokaryote): rod-shaped; **cell wall** outside the **cell membrane**; cytoplasm; one **circular DNA loop**
    (nucleoid) lying free in the cytoplasm, **no nuclear membrane**; many tiny **ribosomes** (drawn smaller than the
    eukaryote's); optional flagellum and a small plasmid ring. No mitochondria, ER, Golgi, chloroplasts or vacuole.
  - **plant** (eukaryote): box-shaped; cellulose **cell wall**, membrane, cytoplasm, large central **vacuole**, **nucleus** with
    a visible double **nuclear membrane** (pores optional) and linear chromosomes/chromatin inside, **mitochondria** (with
    cristae), **chloroplasts** (with grana), **rough ER** with ribosomes, **Golgi body**, free ribosomes (larger dots).
  - **animal** (eukaryote, for reuse): rounded, membrane only (**no wall**), nucleus with nuclear membrane, mitochondria, ER,
    Golgi, centrosome, small vacuoles, ribosomes, no chloroplasts.
- **Scale:** real bacteria are about 1–5 µm and plant cells tens of µm. With `scale: 'true'` the bacterium is drawn tiny next to
  the plant cell (with a `≈ 2 µm` vs `≈ 50 µm` hint); with `scale: 'zoom'` (default) the bacterium is enlarged inside a circular
  magnifier inset with a small `enlarged` tag, so its parts are readable on a phone. Never imply they are the same size.
- **Highlights** (each 0/1; the highlighted structures glow/pulse and others dim slightly):
  - `nucleus`: the eukaryote's nuclear membrane glows; in the bacterium a dashed "no membrane" ring appears around the free DNA
    with the tag `no nucleus`.
  - `dna`: the bacterium's circular loop vs the eukaryote's linear chromosomes inside the nucleus (tags `circular`, `linear`).
  - `organelles`: membrane-bound organelles in the eukaryote glow (mitochondria, ER, Golgi, chloroplasts, vacuole); a counter
    under each cell: `membrane-bound organelles: 0` vs `: many`.
  - `ribosomes`: ribosomes in **both** cells glow; tags `smaller` (prokaryote) and `larger` (eukaryote).
  - `wall`: the wall glows on **both** the bacterium and the plant cell (and shows "no wall" on an animal cell) to make the
    point that a wall does not separate prokaryotes from eukaryotes.
- `titles` 0/1: `prokaryote` / `eukaryote` (or `plant cell` / `animal cell` when both slots are eukaryotes) above each cell.
- `labels` 0/1: part labels for the visible structures: `cell wall`, `membrane`, `cytoplasm`, `circular DNA`, `ribosomes`,
  `nucleus`, `nuclear membrane`, `mitochondrion`, `chloroplast`, `ER`, `Golgi body`, `vacuole`, `flagellum` (short, ruled
  horizontal leader lines; only the labels that fit; with a highlight on, only that highlight's labels show).

## States

`scene` ('compare') · `left`, `right` · `scale` ('zoom' | 'true') · `titles` · `labels` · `nucleus` · `dna` · `organelles` ·
`ribosomes` · `wall` · `focus` (dashed pulsing ring on a close-up, or `null`).

## Close-ups

`prokaryote` / `left` (the left cell or its inset), `eukaryote` / `right` (the right cell), `nucleus` (eukaryote nucleus),
`dna` (bacterial nucleoid), `organelles` (eukaryote cytoplasm with mitochondria, ER, Golgi), `ribosomes` (a cluster in each).
(`prokaryote`/`eukaryote` should alias whichever slot holds that kind, so the plan reads naturally.)

## The exact states the lesson-01 plan will drive (chapter 8)

| Line | State |
| --- | --- |
| 8.1 | `compare`, left bacterium, right plant, scale zoom, titles 1, labels 1 |
| 8.2 | nucleus 1; focus `eukaryote` |
| 8.3 | nucleus 1, dna 1; focus `prokaryote` |
| 8.4 | nucleus 0, dna 0, organelles 1 (counters 0 vs many) |
| 8.5 | organelles 0, ribosomes 1 |
| 8.7 | ribosomes 0, wall 1 |

## Accuracy

- Prokaryotes: no nuclear membrane, DNA a single circular loop free in the cytoplasm, **no membrane-bound organelles**,
  ribosomes **present but smaller**; usually much smaller cells. Examples: bacteria, blue-green algae.
- Eukaryotes: true nucleus with a nuclear membrane, linear chromosomes, membrane-bound organelles (mitochondria, ER, Golgi; plus
  chloroplasts and a large vacuole in plants), larger ribosomes. Examples: plants, animals, fungi, protists.
- Both bacteria and plant cells have walls (different materials); animal cells have none. A wall is never shown as a
  prokaryote-only feature.
- Ribosomes have no membrane; never draw a membrane around them.

## Look like

`kits/video/blood` and `kits/video/heart` (dark card, soft walls, palette). Conventional textbook colours: wall green-brown,
cytoplasm pale, nucleus purple, mitochondria orange, chloroplasts green, ER/Golgi blue-grey, DNA red/pink, ribosomes dark dots.
Labels ≤ 18 characters, ≥ 12 units, never over a highlighted part; readable on a 270 px panel.
