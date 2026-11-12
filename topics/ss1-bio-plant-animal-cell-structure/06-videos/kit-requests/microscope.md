# Kit request: microscope
**Status: REQUESTED 2026-11-07** (ss1-bio-plant-animal-cell-structure, lesson-01 video). Build before the lesson-01 plan is written.

Needed for: lesson-01 video, chapters 1–7 and 11 (how a compound microscope magnifies; the field of view shrinking while the
cell stays the same; cell width = field diameter ÷ number of cells; actual size = image ÷ magnification).
Reusable for: every later microscopy video (lesson-05 Paper 3 clinic if it ever gets a video, plant/animal tissue slides,
stomata counts, pollen, protists, onion root-tip mitosis, blood smears), and any "magnification / actual size" exam drill in
Biology or Agric. The 3D `cell-bio` lesson kit has a microscope mode; this is its 2D video counterpart.

Three scenes in one kit (`scene`, cross-fade like `kits/video/blood`):

## Scene `scope` (a compound light microscope, side view, standing on the bench)

Must show (school microscope as WAEC draws it): **eyepiece** at the top of the body tube; **body tube**; **revolving nosepiece**
carrying three **objectives** of visibly different lengths (×4 short, ×10 medium, ×40 long, each engraved with its power);
**stage** with a glass **slide** held by two **stage clips**; **condenser/aperture** under the stage; a concave **mirror** at
the base; **arm**; **base**; a large **coarse adjustment knob** and a smaller **fine adjustment knob** on the arm.

- `objective` 4 | 10 | 40: the nosepiece rotates so that objective points down at the slide (animated swing); the active
  objective glows. The ×40 objective sits visibly close to the slide (short working distance).
- `eyepiece` number (default 10): engraved on the eyepiece as `×10`.
- `light` 0/1: a soft beam from the mirror up through the slide, the objective, the tube and the eyepiece to a small eye icon.
- `readout` 0/1: a card beside the microscope, `×10 × ×40 = ×400`, **computed by the kit** as eyepiece × objective
  (eyepiece colour amber, objective sky, total green via `COLOR('eyepiece'|'objective'|'M')` if the plan defines those roles).
  It must never show a sum.
- `knob` null | 'coarse' | 'fine': that knob turns and the stage moves (large travel for coarse, tiny for fine). Not needed by
  lesson-01, but cheap and wanted for reuse (the "fine knob at ×40" precaution).
- `labels` 0/1: `eyepiece`, `body tube`, `nosepiece`, `objective`, `stage`, `clip`, `mirror`, `coarse knob`, `fine knob`,
  `arm`, `base` (short, ruled horizontal leader lines, never across the beam or the turning nosepiece).

Close-ups: `eyepiece`, `objectives` (nosepiece + three objectives + slide), `stage` (slide, clips, condenser), `mirror`,
`knobs`, `readout`.

## Scene `field` (what you see down the eyepiece: a bright circle with the specimen)

Must show a large circular field of view (most of the panel) with a dark surround, and cells drawn **to scale** inside it:
the on-screen cell width = circle diameter × `cell` ÷ `fov`, so the number of cells across the diameter is `fov ÷ cell`.
Changing `fov` animates a zoom: the cells grow and fewer fit (the cell's real size, `cell`, does not change).

- `slide` 'cork' | 'onion' | 'blood' | 'cheek':
  - **cork**: a honeycomb of thick brown walls around **empty** (pale/air) spaces; no nucleus, no cytoplasm (dead tissue).
  - **onion** (iodine-stained, yellow-brown): long box-shaped cells in neat rows, long axis vertical so the width runs along
    the horizontal diameter; a clear wall around each, granular cytoplasm, one nucleus per cell; **no chloroplasts**.
  - **blood**: many round red cells (biconcave, pale centre, **no nucleus**, no wall) in a pale field, plus one occasional
    white cell with a lobed purple nucleus.
  - **cheek**: flat, irregular cells with a central nucleus, thin membrane, no wall, some folded/overlapping.
- `fov` number, mm: field diameter, shown as a ruler/diameter line labelled to 2 significant figures (`4.0 mm`, `1.6 mm`,
  `0.40 mm`, `0.80 mm`).
- `cell` number, mm, default 0.05: the real cell width that sets the drawing scale.
- `mag` number: total magnification badge in a corner (`×40`, `×100`, `×200`, `×400`).
- `ruler` 0/1: the labelled diameter line.
- `count` 0/1: one horizontal row of cells along the diameter is highlighted (alternating tint or tick marks) with a counter
  label `N cells`, where **N = round(fov ÷ cell), computed by the kit** (80 at 4.0/0.05, 32 at 1.6/0.05, 8 at 0.40/0.05,
  20 at 0.80/0.04). At 80 cells the row is a fine texture; the counter carries the number. For blood and cork the counter is
  hidden unless `count` is set explicitly.
- `labels` 0/1: `field of view`, `cell wall` / `empty space` (cork), `nucleus`, `cytoplasm` (onion/cheek), `red cell`
  (blood). No label may say which slide has walls unless `labels` is on for that slide (the lesson's Bridge depends on it).
- `focus` ring on any close-up below.

Close-ups: `field` (whole circle), `row` (the counted row, centre of the diameter), `ruler` (the diameter label), `cell`
(one cell near the centre, big enough to see nucleus/wall).

## Scene `photo` (a photomicrograph print with a measured cell, then the real size)

Must show a photo card (white border) with one large cell (`specimen` 'cheek' | 'onion'), a ruled bracket along its length
labelled with `image` in mm (`24 mm`), and a magnification badge (`×400`). With `shrink` 0 → 1 the cell lifts off the photo
and shrinks smoothly to a tiny "real size" cell beside a short scale bar, with the label `actual = 0.060 mm`
(**computed by the kit as image ÷ mag**, 2 significant figures), and with `um: 1` an extra line `= 60 µm`.

States (photo): `specimen`, `image` (mm), `mag`, `shrink` 0–1, `um` 0/1, `labels` 0/1 (`photo`, `image length`, `real size`).
Close-ups: `bracket` (the measured length + badge), `actual` (the shrunken real cell + its label).

## All scenes

- `scene` 'scope' | 'field' | 'photo' · `focus` dashed pulsing ring on any close-up name above, or `null`.

## The exact states the lesson-01 plan will drive

| Chapter | State |
| --- | --- |
| 1 | `scope`, labels 0, light 0 → light 1 |
| 2–3 | `field`, slide cork (fov 1.6, cell 0.05, mag 100) → onion → blood; labels 1; focus `cell` |
| 4 | `scope`, labels 1, light 1, eyepiece 10, objective 4 → 10 → 40, readout 1; focus `objectives`, `eyepiece` |
| 5–6 | `field`, slide onion, cell 0.05, ruler 1, count 1: (fov 4.0, mag 40) → (1.6, 100) → (0.40, 400); focus `row` |
| 7 | `photo`, specimen cheek, image 24, mag 400, shrink 0 → 1, um 1; focus `bracket` |
| 11 | `field`, slide onion, cell 0.040, fov 0.80, mag 200, ruler 1, count 1 |

## Accuracy

- Total magnification = eyepiece × objective (never +). The kit computes it; it never shows a sum.
- Field diameter × total magnification is constant for one microscope (4.0 × 40 = 1.6 × 100 = 0.40 × 400 = 160 mm): the
  field shrinks as magnification rises, the cells look bigger, the real cell size never changes.
- Cork cells are **dead and empty** (walls only). Onion bulb epidermis has **no chloroplasts**. Mature human red cells have
  **no nucleus** and no wall.
- Higher power objective = longer objective, closer to the slide.
- Units: field and sizes in mm on the field scene; µm only where the plan asks (`um`). 1 mm = 1000 µm.

## Look like

`kits/video/blood` (dark card, soft walls, palette). Microscope in neutral metal/black with brass knobs; the light beam soft
gold; stains as real slides look (iodine yellow-brown, blood pink-red). Labels ≤ 18 characters, ≥ 12 units, never on top of
moving parts or the beam; readable on a 270 px panel.
