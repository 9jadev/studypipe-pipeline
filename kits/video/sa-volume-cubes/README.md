# Video kit · sa-volume-cubes

One or two cubes in a clean 3-face (cabinet) view for **surface area to volume ratio**: SA = 6L², V = L³, SA:V = 6/L.
Every number is **computed by the kit from L** (SA, V up to 3 s.f. with trailing zeros dropped, 1000+ in full; SA:V with one
decimal below 10, whole from 10 up; units always shown: mm² / mm³ / mm⁻¹, or cm with `unit: 'cm'`).
The agar/zobo **dye test**: cubes cut in half, dye soaks in from every face by the same distance (`depth × dye`), leaving a pale
centre square of side `max(0, L − 2·depth·dye)`; each cut face is labelled `dyed through` or `pale centre` from that rule.
Role colours come from the plan via `COLOR('L' | 'SA' | 'V' | 'SAV')` (fallbacks gold / orange / blue / green).

## States (`{ panel: 'sa-volume-cubes', s: { … } }`)

| State | Meaning |
|---|---|
| `L` | side of cube A (animates; 0.1 … 40), in the current unit |
| `L2` | side of cube B (0 = no cube B); B sits to the right on the same baseline |
| `scale` | `'fit'` (default; teaching size, grows gently with L) · `'true'` (both to one scale; a tiny cube becomes a dot with a gold finder ring) |
| `unit` | `'mm'` (default) · `'cm'` |
| `faces` | 0/1: front, top, side, then the 3 hidden faces (dashed) light up one by one (~0.55 s each), `L²` on each visible face, counter `L² × 6` |
| `fill` | 0/1: unit cubes fill layer by layer with counter `n × n × layers` (whole L 1–4); otherwise a blue fill rises, counter `L × L × L` |
| `readout` | 0/1: SA · V · SA:V table under each cube |
| `readoutA` · `readoutB` | optional override `['24 mm²', '8 mm³', '3.0 mm⁻¹']`, or `null` |
| `cut` | 0/1: each cube shown cut in half (cut face to the viewer, half depth) |
| `dye` | 0–1: soaking progress; a change runs over ~4.5 s per full soak (give the line ≥ 11 words) |
| `depth` | dye penetration at `dye = 1`, same unit as L (default 0.5) |
| `arrows` | 0/1: four equal inward arrows per cut face, length = depth on that cube's scale (min 14 px; hidden on cubes < 40 px); `too far` marks the centre when depth ≤ L/4 |
| `tagA` · `tagB` | short tag under each cube (≤ 18 chars), e.g. `Amoeba model`, `frog model` |
| `focus` | ring `cubeA` · `cubeB` · `readout` · `centre`, or `null` |

Timing: `faces` needs ~3.6 s and `fill` ~0.6 s per layer after the cue starts; give those lines ≥ 10 words.

## Camera close-ups (`{ camera, focus: '…' }`)

`cubeA` · `cubeB` · `readout` · `centre` (cube B's cut face if B is present, else A's). The regions **follow the cubes** (the kit
updates them each frame as L, L2 and scale change), so `cubeA` frames the dot and its tag generously in true scale.

## Good for

SA:V and 6/L calculations, why big organisms need transport systems (Amoeba vs frog/human), gas-exchange surfaces, villi and root
hairs, heat loss in small vs large animals, rate of reaction (powder vs lumps: cut the same volume into smaller cubes), and the
agar/dye or yam/zobo home practical.

## Used in

- `ss1-bio-plant-animal-cell-structure` lesson-03 video (chapters 5–8)
- Demo: `kits/video/sa-volume-cubes/demo.plan.cjs`
