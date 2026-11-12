# ss1-bio-plant-animal-cell-structure
state: DONE   # human approved 2026-11-11
theme: editorial-ink
videos: lesson-01,lesson-03,lesson-04   # confirmed 2026-11-07 (was auto)
video-cap: 3

| step | state | updated | note |
|---|---|---|---|
| 1 map | done | 2026-11-07 13:04 | 01-topic-map.md: 5 lessons, mystery 'The Wilting Ugu and the Saline Drip', 8 objectives, Paper 3 traps |
| 2 lesson | done | 2026-11-07 13:08 | 02-lesson.md: hub + 5 lessons, 15 worked examples, potato-strip osmosis practical, § 7 video plan (01, 03, 04) |
| 3 questions | done | 2026-11-07 13:12 | 03-questions.md: 60 MCQs (answers 15/15/15/15 across A–D) + 5 home investigations + 5 × 30-mark papers with model solutions |
| 4 review | done | 2026-11-07 | round 1 FIX (10 blocking) → fixed; round 2 FIX (1 blocking: mitochondria visibility reason) → fixed, keys/marks unchanged; human APPROVED 2026-11-07 ("am approving … build it all up") |
| 5 render | done | 2026-11-07 | hub + 5 lessons + retrieval-bank.js; cell-bio v2 + 6 new 3D kits; editorial-ink theme |
| 5v videos | done | 2026-11-07 | lessons 01, 03, 04 (human-confirmed picks): 9.7 / 10.7 / 9.5 min, QA clean on 3 screens, +103/118/126 KB; 5 video kits built on the fly |
| 6 kits | done | 2026-11-07 | cell-bio v2, microscope-bench, agar-cube-bench, osmometer-bench, slide-prep-bench, protein-route, slide-view (kits/); video kits in kits/video/ |
| 7 qa | done | 2026-11-08 | 05-qa-report.md PASS, 0 issues (incl. the new layout-sanity check) |
| 8 package | done | 2026-11-08 | exports/ss1-bio-plant-animal-cell-structure.zip re-packaged after the bench-tightening pass |

## Assumptions

## Human feedback log

- 2026-11-07: Full rerun from step 1 requested by the human ("rerun plant and animal cell structure"). Previous version: git fb60a4e; scratch backup made before the rerun.
- 2026-11-07: human approved 02-lesson.md + video plan (lesson-01, 03, 04) — "am approving ss1-bio-plant-animal-cell-structure built it all up".
- 2026-11-07: full rerun built. Known cosmetic items for human review: L04 video `rbc` close-up crops the plant cell/labels at left; graph labels `-2.0` and `isotonic` touch tick/curve in portrait. Machine-load note: stock qa.mjs has a fixed 30 s goto timeout that fails when the machine is busy.
- 2026-11-08: human review — "the scientific kits are too stretched… should be much more concise". Fixed: a `.lab` class collision was stretching bench labels to 560px (heart L02/03/06/07), and every bench's controls, method cards and results tables were made compact on phones. scripts/qa.mjs now blocks on stretched elements and warns past the control-bar budget; the rule is in lesson-renderer/SKILL.md. Narrator now shows "No voice on this device" instead of falling back to captions silently.
- 2026-11-08: human report — the sort-game drag and drop froze, especially when dropping at the edge between two groups. Fixed with a shared drag module (assets/js/sort-dnd.js): auto-scrolls to reach bins below the fold, snaps to the nearest bin so the seam between groups is no longer a dead zone, and ignores a stray second touch. scripts/qa.mjs now has a drag-and-drop check. QA PASS, re-packaged.
