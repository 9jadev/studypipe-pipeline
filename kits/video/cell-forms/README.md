# Video kit · cell-forms

Forms of life drawn the WAEC way (outline + key features). Three scenes (`scene`, cross-fade):

- **gallery**: a pond-water drop under the microscope with 1–4 organisms (1 = centred and large, 2 = side by side, 3–4 = 2 × 2).
  *Amoeba* (pseudopodia, nucleus, contractile vacuole, food vacuoles; `engulf` = two pseudopodia flow round a particle and close
  over it as a new food vacuole, every 6 s), *Paramecium* (slipper, cilia beating in a wave, oral groove, macro- + micronucleus, two
  star-shaped contractile vacuoles), *Euglena* (spindle, ONE flagellum, red eyespot, chloroplasts, flexible pellicle, no wall),
  *Chlamydomonas* (cellulose wall, TWO equal flagella, ONE cup-shaped chloroplast with pyrenoid, eyespot, nucleus in the cup).
  *Volvox*, *Spirogyra* and *Hydra* can be listed too (compare drawings, scaled). Nutrition badges follow `light`: in the dark,
  *Euglena* turns **saprophytic** (dissolved food diffuses in through its surface, it never engulfs) and *Chlamydomonas* (and
  Volvox, Spirogyra) shows **no food made** with a dulled chloroplast.
- **compare**: *Volvox* (colony: hollow ball of identical cells joined by cytoplasmic strands, two daughter colonies), *Spirogyra*
  (filament: identical cells with spiral ribbon chloroplasts), *Hydra* (tissue level: tentacles round the mouth, basal disc,
  cut-away of ectoderm + mesoglea + endoderm round the enteron).
- **levels**: the ladder organelle → cell → tissue → organ → system → organism with icons and examples (animal: mitochondrion ·
  heart muscle cell · heart muscle · heart · circulatory sys. · Chinedu; plant: chloroplast · palisade cell · palisade layer ·
  leaf · shoot system · ugu plant), arrow `more complex`.

## States (`{ panel: 'cell-forms', s: { … } }`)

| State | Scene | Meaning |
|---|---|---|
| `scene` | all | `'gallery'` · `'compare'` · `'levels'` |
| `labels` | all | 0/1: gallery part labels + italic names · compare names, form words, `strands`, `spiral chloroplast`, `ectoderm`, `endoderm` · levels examples (level words always on) |
| `move` | gallery, compare | 0/1: cilia/flagella/pseudopodia animate · Volvox rolls, Hydra tentacles sway |
| `show` | gallery | array of 1–4 ids (`amoeba` `paramecium` `euglena` `chlamydomonas` `volvox` `spirogyra` `hydra`) in grid order; new ids fade in 0.4 s apart, kept ids glide to their new slot |
| `engulf` | gallery | 0/1 Amoeba feeding loop |
| `nutrition` | gallery | 0/1 badges: holozoic (Amoeba, Paramecium, Hydra) · autotrophic (Chlamydomonas, Volvox, Spirogyra, Euglena in light) · saprophytic (Euglena in dark) · no food made |
| `light` | gallery | 1 (default) bright field + lamp · 0 dark field |
| `jobs` | compare | 0/1 Hydra cells by job (stinging cells amber `catch food`, endoderm orange-pink `digest`, ectoderm sky `cover`) + 3-line key; Volvox/Spirogyra `all alike` |
| `separate` | compare | 0/1 one cell lifted out of each over ~3 s: Volvox cell swims off ✓ lives alone · Spirogyra cell ✓ lives alone · Hydra stinging cell greys and fades ✗ can't live alone |
| `example` | levels | `'animal'` (default) · `'plant'` |
| `level` | levels | 0–6 (default 6) rungs from the bottom; newest rung glows |
| `swap` | levels | 0/1 organ ↔ system with ✗ wrong order; back to 0 slides home with ✓ right order |
| `focus` | all | ring a close-up name below, or `null` |

## Camera close-ups

- gallery: `amoeba` `paramecium` `euglena` `chlamydomonas` (also `volvox` `spirogyra` `hydra`) **follow the organism wherever it sits
  in `show`**; an id not shown falls back to the whole field. `field` = the whole drop.
- compare: `volvox` `spirogyra` `hydra` `layers` (Hydra's two-layer cut-away with its labels).
- levels: `low` (organelle → tissue) · `high` (organ → organism) · `ladder` (all six).

Close-up regions are live getters (scene- and `show`-aware); a name used in the wrong scene frames the whole kit.

## Good for

Free-living protists and their features (WAEC drawings), nutrition types (autotrophic, holozoic, saprophytic), Euglena as
plant-like/animal-like, colony vs filament vs tissue and division of labour, levels of organisation (JSS basic science living
things, SS1 Protoctista / Thallophyta / Coelenterata, cell structure units).

## Used in

- `ss1-bio-plant-animal-cell-structure` lesson-03 video (kit request `06-videos/kit-requests/cell-forms.md`)
- Demo: `kits/video/cell-forms/demo.plan.cjs` (every scene, state and close-up; QA clean on portrait, landscape, desktop)
