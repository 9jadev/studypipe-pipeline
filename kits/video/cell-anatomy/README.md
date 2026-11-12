# Video kit · cell-anatomy

Scene **compare**: two cells side by side, a left and a right slot, each a `bacterium`, `plant` or `animal` cell.

- **bacterium** (prokaryote): rod; cell wall (not cellulose) outside the membrane; one circular DNA loop free in the cytoplasm
  (nucleoid, **no nuclear membrane**); a plasmid ring; many **small** ribosomes; a flagellum. No membrane-bound organelles.
- **plant** (eukaryote): box shape; cellulose wall; membrane; large central vacuole lined by the tonoplast; nucleus pushed to the
  side (double membrane with pores, nucleolus, **linear** chromosomes); mitochondria with cristae; chloroplasts with grana;
  rough ER studded with ribosomes; Golgi body; **larger** free ribosomes.
- **animal** (eukaryote): rounded, membrane only (**no wall**); central nucleus; mitochondria; rough ER; Golgi body;
  centrosome (two centrioles at right angles); lysosomes; small vacuoles; ribosomes; no chloroplasts.

Scale is never faked: `scale: 'zoom'` shows the bacterium in a magnifier inset tagged **enlarged**, joined to its real-size
dot (≈ 2 µm). `scale: 'true'` shrinks it to that dot beside the plant cell, which gets a "≈ 50 µm wide" ruler.
Highlights make their parts glow (gold halo, pulsing) and dim everything else. With a highlight on, only that highlight's
labels show. Tags (gold) appear with their highlight even when labels are off.

## States (`{ panel: 'cell-anatomy', s: { … } }`)

| State | Meaning |
|---|---|
| `scene` | `'compare'` |
| `left` · `right` | `'bacterium'` · `'plant'` · `'animal'` (defaults: bacterium, plant). Cross-fades when changed |
| `scale` | `'zoom'` (default) · `'true'` |
| `titles` | 0/1: `prokaryote` / `eukaryote` (or `plant cell` / `animal cell` when both are eukaryotes) |
| `labels` | 0/1: part labels (cell wall, membrane, cytoplasm, circular DNA, ribosomes, flagellum, nucleus, nuclear membrane, mitochondrion, chloroplast, ER, Golgi body, vacuole, centrosome) |
| `nucleus` | 0/1: nuclear membrane glows; bacterium: dashed "no membrane" ring round its DNA + tag `no nucleus` |
| `dna` | 0/1: circular loop + plasmid (tag `circular`) vs linear chromosomes in the nucleus (tag `linear`) |
| `organelles` | 0/1: mitochondria, chloroplasts, ER, Golgi, vacuole(s), lysosomes glow; counters `membrane-bound organelles: 0` vs `: many` |
| `ribosomes` | 0/1: ribosomes glow in both cells (also those on the rough ER); tags `smaller` / `larger` |
| `wall` | 0/1: walls glow on bacterium (`no cellulose`) **and** plant (`cellulose`); animal shows `no wall` / `membrane only` |
| `focus` | ring: `left` `right` `prokaryote` `eukaryote` `nucleus` `dna` `organelles` `ribosomes` (resolved against what each slot holds), or `null` |

## Camera close-ups (`{ camera, focus: '…' }`)

`left` · `right` · `prokaryote` (left slot: inset and real-size dot) · `eukaryote` (right slot) · `nucleus` (nucleus of a
**plant** cell in the right slot) · `dna` (bacterial nucleoid, left slot) · `organelles` (plant top-right: ER, Golgi,
chloroplasts, mitochondria) · `ribosomes` (a cluster in each cell).
The camera regions are fixed, so put the bacterium on the **left** and the plant on the **right** when using them. For an animal
cell in the right slot use `eukaryote` or a raw `[x, y, w, h]` (its nucleus is about `[262, 136, 100, 92]`).

## Extending (the plant/animal lesson, organelle close-ups)

Every organelle is drawn by a stand-alone helper in `ORG` (`mito`, `chloro`, `nucleus`, `chromosomes`, `dnaLoop`, `rer`,
`golgi`, `centrosome`, `lysosome`). Each takes a position, rotation and size, so a new scene (for example `scene: 'organelle'`
with one big mitochondrion or chloroplast, or `scene: 'cell'` with a single enlarged cell) can reuse them. Add that scene's
groups next to `slots` and switch scenes as the `blood` kit does. Cell kinds are built by `buildBacterium` / `buildPlant` /
`buildAnimal`. Parts register a highlight membership (`part(inst, key, hls)`) and a glow outline (`halo`). Labels and tags are
`item(...)` rows with a mode list, so a new highlight (for example `membranes: 2`) only needs new rows and a key in `HL`.

## Good for

Prokaryote vs eukaryote, where DNA sits, membrane-bound organelles, ribosome size, "a wall is not a prokaryote test",
plant vs animal cell, true size of bacteria vs plant cells, JAMB/WAEC cell-structure drills.

## Used in

- `ss1-bio-plant-animal-cell-structure` lesson-01 video (chapter 8)
- Demo: `kits/video/cell-anatomy/demo.plan.cjs` (every state, cell kind, scale and close-up)
