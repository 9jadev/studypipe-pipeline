# Video kit · microscope

Three scenes in one kit (`scene`, cross-fades): **scope** (a school compound light microscope, side view: eyepiece, body tube,
revolving nosepiece with ×4 / ×10 / ×40 objectives of increasing length and DIN colour bands red / yellow / blue, stage +
slide + two clips, condenser with diaphragm lever, concave mirror, arm, base, coarse and fine knobs), **field** (the view down
the eyepiece, cells drawn to scale) and **photo** (a photomicrograph with a measured cell that shrinks to its real size).
Every number on screen comes from the state: total = eyepiece × objective (never a sum), cells across = round(fov ÷ cell),
actual = image ÷ mag (2 s.f.), µm = mm × 1000.

## States (`{ panel: 'microscope', s: { … } }`)

| State | Scene | Meaning |
|---|---|---|
| `scene` | all | `'scope'` · `'field'` · `'photo'` |
| `labels` | all | 0/1 part labels |
| `focus` | all | dashed ring on a close-up name below, or `null` |
| `objective` | scope | 4 · 10 · 40: the nosepiece swings it onto the slide; the active one glows; ×40 sits closest to the slide |
| `eyepiece` | scope | eyepiece power (default 10), engraved on the eyepiece |
| `light` | scope | 0/1 beam: mirror → slide → objective → tube → eyepiece → eye |
| `readout` | scope | 0/1 card `×10 × ×40 = ×400`, computed. Colours use plan roles `eyepiece` / `objective` / `M` if defined (else amber / sky / green) |
| `knob` | scope | `null` · `'coarse'` (large stage travel, downward only) · `'fine'` (tiny travel) |
| `slide` | field | `'cork'` (empty walls) · `'onion'` (iodine, box cells, nucleus, no chloroplasts) · `'blood'` (biconcave anucleate red cells + one white cell) · `'cheek'` (flat, irregular, nucleus, no wall) |
| `fov` | field | field diameter in mm (zoom animates, label to 2 s.f.) |
| `cell` | field | real cell width in mm (default 0.05). For blood use the red-cell diameter, e.g. 0.008 |
| `mag` | field, photo | magnification badge |
| `ruler` | field | 0/1 diameter dimension line with `fov` label |
| `count` | field | 0/1 highlighted row along the diameter + `N cells`, N = round(fov ÷ cell) |
| `specimen` | photo | `'cheek'` · `'onion'` |
| `image` | photo | measured image length in mm |
| `shrink` | photo | 0–1: cell lifts off and shrinks onto a 1 mm scale (100 units = 1 mm) |
| `um` | photo | 0/1: add `= 60 µm` |

## Camera close-ups

scope: `eyepiece` `objectives` `stage` `mirror` `knobs` `readout` · field: `field` `row` `ruler` `cell` · photo: `bracket` `actual`.
`cell` and `row` follow the current zoom (the region is recomputed every frame, so `cell` always frames one whole cell with its labels).

## Good for

Parts of the microscope, total magnification, low-to-high power procedure (fine knob at ×40), field of view vs magnification
(field × M constant), estimating cell size from a field count, actual size = image ÷ magnification, mm ↔ µm; slides of cork,
onion epidermis, blood smear, cheek cells (plant vs animal cells, Hooke's cork).

## Used in

- `ss1-bio-plant-animal-cell-structure` lesson-01 video
- Demo: `kits/video/microscope/demo.plan.cjs`
