# ss2-phy-ohms-law-circuits
state: DONE   # human approved 2026-11-11
theme: editorial-ink
videos: lesson-02,lesson-03,lesson-04   # confirmed 2026-11-08 (was auto)
video-cap: 3

| step | state | updated | note |
|---|---|---|---|
| 1 map | done | 2026-11-08 | 01-topic-map.md: Ngwa Road Keke Battery Drop mystery (Engr. Nkechi, Aba); 5 lessons; kit gap: dc-circuit-bench is only part-builders (full model bench to build in step 6) |
| 2 lesson | done | 2026-11-08 | 02-lesson.md: hub + 5 lessons; § 7 picks lesson-02, 03, 04 (05, 01 dropped by cap); 0 prose 7-gram source matches |
| 3 questions | done | 2026-11-08 | 03-questions.md: 60 MCQs (15/15/15/15 across A–D) + 5 home investigations + 5 × 30-mark papers; 0 seven-word source matches. Setters' checks fixed 5 physics errors in 02-lesson.md (L05 exit ticket copied a source item; L05 warmed-wire and driver-cell error directions; L01 filament curve direction; L04 shunt error directions) |
| 4 review | done | 2026-11-08 | round 1 FIX (8 blocking) → fixed; round 2 FIX (2 blocking, both L01) → fixed by author; PASS under human blanket approval |
| 5 render | done | 2026-11-08 | hub + 5 lessons + retrieval-bank.js; dc-circuit-bench v2, dc-concept-zoom, auto-workshop-props kits; editorial-ink theme |
| 5v videos | done | 2026-11-08 | lessons 02, 03, 04 embedded (12.4 / 11.9 / 10.6 min); new video kits circuit-network, galvanometer built on the fly; lesson-02 reused circuit/cell/toll/graph |
| 6 kits | done | 2026-11-08 | dc-circuit-bench v2 (5 modes), dc-concept-zoom (5 modes), auto-workshop-props; video kits circuit-network, galvanometer; study-graph reused |
| 7 qa | done | 2026-11-08 | 05-qa-report.md PASS: 5 lessons, 61 sections, 0 issues (incl. layout + drag-and-drop checks) |
| 8 package | done | 2026-11-08 | exports/ss2-phy-ohms-law-circuits.zip (1.3 MB); no asset over 1 MB |

## Assumptions
- Using `editorial-ink` theme (kept from the previous run).
- Target: Nigerian SS2 Physics students (WAEC/NECO/JAMB). en-NG narration priority.
- Existing kits (`kits/dc-circuit-bench/`, `kits/study-graph/`, video kits cell/circuit/graph/toll) reused where they fit; previous run backed up in git and the session scratchpad.

## Human feedback log
- 2026-11-03/04: previous run completed and packaged (936 KB, 1 video: lesson-02 lead-acid cell).
- 2026-11-08: QA with the new layout-sanity check flagged stretched readouts (28px text in ~101px columns, wrapping to 5 lines) in lessons 01 and 02 — a shared `.vt-cups` grid kept two cards side by side on phones. To be fixed as part of this rerun.
- 2026-11-08: "start it all up from the very beginning" → full rerun from step 1 (human chose this scope).
- 2026-11-08: human gave blanket approval to finish the unit end to end — "Whatever you do for now is fine… you are getting my automatic approval… generate everything till the end". Plan, questions and video picks (lesson-02, 03, 04) treated as approved; human will judge the finished unit.
- 2026-11-08: full rerun completed. Built under two weekly-limit outages (Opus 5.5, then Opus 4.8; reset Nov 11). Lesson builders finished their files before the 429s; the local pipeline steps (apply-math/theme/video, qa, package) were run directly. Known teaching-value notes for human review: constantan α set small so L01 warming-wire error barely shows on the default wire; filament-lamp and jumper-cable heat models are display approximations; cells described as polarising (not warming) as the cause of rising r.
