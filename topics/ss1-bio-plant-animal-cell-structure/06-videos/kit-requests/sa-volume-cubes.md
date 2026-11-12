# Kit request: sa-volume-cubes
**Status: REQUESTED 2026-11-07** (ss1-bio-plant-animal-cell-structure, lesson-03 video). Build before the lesson-03 plan is written.

Needed for: lesson-03 video, chapters 5–8 (SA = 6L², V = L³, SA:V = 6/L; bigger cube → smaller ratio; dye soaking into agar cubes
leaves a pale centre in big cubes; why a small organism manages with diffusion and a big one needs transport).
Reusable for: every later SA:V video (gas exchange surfaces, heat loss in small vs large animals, villi and root hairs), chemistry
rate of reaction (powder vs lumps: same volume cut smaller → more surface), and the yam/zobo or agar/dye home practical.

## Must show

- One or two **cubes** drawn in clean isometric (3-face) view, side length labelled on an edge (`L = 2 mm`, gold).
- **Cube A** always present; **cube B** present when `L2 > 0`, placed to its right on the same baseline.
- `scale: 'fit'` (default): each cube is drawn at a comfortable size regardless of L (sizes for teaching, not to scale).
  `scale: 'true'`: both cubes drawn to the **same scale** (the larger fills ~60% of the panel height), so 1 mm vs 6 mm looks 1 : 6
  and 0.1 mm vs 30 mm leaves the small cube as a tiny dot, with a short pointer line to its tag so it is still findable.
- `faces: 1`: the six faces light up one after another (orange, the SA role colour) with `L²` written on each visible face and a
  small `× 6` counter reaching 6 (three hidden faces indicated by dashed outlines and the counter).
- `fill: 1`: the cube fills with small unit cubes layer by layer (blue, the V role colour), with a counter `L × L × L`; for L ≤ 4
  draw real unit cubes; above 4 (or non-integer L) draw a translucent blue fill with no count.
- `readout: 1`: a small table under each cube: `SA` (orange) · `V` (blue) · `SA:V` (green), **computed by the kit from L**, with units
  `mm²`, `mm³`, `mm⁻¹` (use `unit` state for cm). Number format, exactly: SA:V with **one decimal place when below 10** (6.0, 3.0,
  2.0, 1.5, 1.2, 1.0, 0.5, 0.2) and a whole number from 10 up (60); SA and V as plain numbers up to 3 significant figures, trailing
  zeros dropped (24, 8, 216, 864, 1728 → may show `1728` in full; 0.06, 0.001). If unsure, the plan can override with
  `readoutA` / `readoutB` strings.
- **Dye test** (`cut: 1` and `dye` 0–1): each cube is shown **cut in half**, showing its square cut face. Dye (a red-purple tint,
  like zobo) soaks inward from **every face by the same distance** `depth` × `dye` (mm). The cut face therefore shows a dyed border
  and a **pale centre square** of side `max(0, L − 2 × depth × dye)`. A cube whose pale side reaches 0 is dyed right through.
  Small label under each cut face: `dyed through` or `pale centre`.
- `arrows: 1`: short inward diffusion arrows from the surface on all four sides of each cut face, all the **same length** (the
  dye depth); on a big cube they visibly stop far short of the centre, and a faint `too far` label marks the centre.
- `tagA` / `tagB`: optional short tag under each cube (≤ 18 chars), e.g. `Amoeba model`, `frog model`.

## States

| State | Meaning |
|---|---|
| `L` | side of cube A in mm (number, animates; 0.1 … 40) |
| `L2` | side of cube B (0 = no cube B) |
| `scale` | `'fit'` \| `'true'` |
| `unit` | `'mm'` (default) \| `'cm'` |
| `faces` | 0/1 face count → SA = 6L² |
| `fill` | 0/1 unit-cube fill → V = L³ |
| `readout` | 0/1 SA, V, SA:V table under each cube |
| `readoutA`, `readoutB` | optional override strings `['24 mm²', '8 mm³', '3.0 mm⁻¹']` |
| `cut` | 0/1 cubes shown cut open (cut face visible) |
| `dye` | 0–1 soaking progress (animates; 1 = full soaking time) |
| `depth` | dye penetration in mm at `dye = 1` (default 0.5) |
| `arrows` | 0/1 inward diffusion arrows on the cut faces |
| `tagA`, `tagB` | short tags under each cube, or `''` |
| `focus` | ring a part: `cubeA`, `cubeB`, `readout`, `centre`, or `null` |

## Close-ups

`cubeA`, `cubeB`, `readout` (the readout table(s)), `centre` (cube B's cut face and pale centre when B is present, else cube A's).
When `scale: 'true'` makes cube A a dot, `cubeA` frames the dot and its tag generously.

## Accuracy

- SA = 6L², V = L³, SA:V = 6/L; the kit's readout must agree with 6/L exactly for every L the plan uses
  (0.1 → 60, 1 → 6.0, 2 → 3.0, 3 → 2.0, 4 → 1.5, 5 → 1.2, 6 → 1.0, 12 → 0.5, 30 → 0.2 mm⁻¹).
- Dye depth is the same for every cube in the same time (diffusion distance does not depend on cube size). With depth 0.5 mm:
  1 mm cube → dyed through; 2 mm → pale side 1 mm; 6 mm → pale side 5 mm.
- Units: mm² for SA, mm³ for V, mm⁻¹ for SA:V. Never show SA:V without its unit.

## Numbers the plan will drive
`L: 2` (faces, fill, readout 24 / 8 / 3.0), `L: 2 → 6` (growing cube), `L: 1, L2: 6, scale: 'true', cut: 1, dye: 0 → 1`,
`L: 0.1, L2: 30, scale: 'true', tagA: 'Amoeba model', tagB: 'frog model', arrows: 1` (readouts 60 and 0.2).

## Look like
`kits/video/heart` / `kits/video/capillary-bed` (dark card, soft walls, same palette). Role colours from the plan via `COLOR('SA')`,
`COLOR('V')`, `COLOR('SAV')`, `COLOR('L')` with fallbacks orange / blue / green / gold. Labels ≤ 18 characters, ≥ 12 units, never on
top of the moving dye front; readable at 270 px.
