# Video kit · heart

Front (ventral) view of the mammalian heart, drawn the WAEC way: the **patient's right side is on the viewer's left**.
Four chambers with septum (left-ventricle wall ≈ 3× the right), the venae cavae, pulmonary artery, pulmonary veins and aorta,
four valves that open and close on real cardiac-cycle timing, "LUB"/"DUB", the conduction wave, and blue/red blood flow.

## States (`{ panel: 'heart', s: { … } }`)

| State | Meaning |
|---|---|
| `beat` | 0/1: beats through the cardiac cycle at `hr` |
| `hr` | heart rate in bpm (default 75 → 0.8 s cycle: 0.1 s atrial systole · 0.3 s ventricular systole · 0.4 s diastole) |
| `phase` | freeze one phase for teaching: `'atrial'` · `'ventricular'` · `'diastole'` · `null` (live) |
| `flow` | 0/1: blood flows, blue (deoxygenated) on the right side, red (oxygenated) on the left |
| `conduct` | 0/1: conduction system and its wave, SAN → AVN (with the ~0.1 s delay) → Bundle of His → Purkinje fibres |
| `labels` | 0/1: RA, RV, LA, LV, vena cava, to/from lungs, aorta (and the conduction labels when `conduct` is on) |
| `valveLabels` | 0/1: tricuspid, bicuspid, semilunar |
| `sounds` | 0/1: "LUB" as the AV valves close (start of ventricular systole), "DUB" as the semilunar valves close (start of diastole) |
| `walls` | 0/1: thin-wall / thick-wall ≈ 3× callout |
| `focus` | ring one part: `RA` `RV` `LA` `LV` `SAN` `AVN` `tricuspid` `bicuspid` `aortic` `pulmonary` `septum`, or `null` |

## Camera close-ups (`{ camera, focus: '…' }`)

`RA` `RV` `LA` `LV` · `right` `left` (each side of the heart) · `valves` `tricuspid` `bicuspid` · `conduction` `SAN` · `arteries`

## Good for

Heart structure and the left/right diagram trap, the double-circulation route through the heart, valves and one-way flow,
the cardiac cycle and heart sounds, the myogenic heartbeat and conduction system, heart rate and cardiac output.

## Used in

- `ss2-bio-heart-circulation` lesson-03 video (lesson-02 candidate)
- Demo: `kits/video/heart/demo.plan.cjs`
