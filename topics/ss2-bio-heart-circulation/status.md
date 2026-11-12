# ss2-bio-heart-circulation
state: DONE   # human approved 2026-11-11
theme: editorial-ink
videos: lesson-04,lesson-05,lesson-06   # confirmed 2026-11-07 (was auto)
video-cap: 3

| step | state | updated | note |
|---|---|---|---|
| 1 map | done | 2026-11-07 | 01-topic-map.md: Oja Oba screening Saturday mystery (Dr Aisha, UCH); 7 lessons (was 5); all [VERIFY] items resolved by review |
| 2 lesson | done | 2026-11-07 | 02-lesson.md: hub + 7 lessons; § 7 picks lesson-04, 05, 06 (01, 03, 07 dropped by cap); 0 seven-word source matches |
| 3 questions | done | 2026-11-07 | 03-questions.md: 84 MCQs (21/21/21/21 across A–D) + 7 home investigations + 7 × 30-mark papers; 0 seven-word source matches |
| 4 review | done | 2026-11-07 | round 1 FIX (2 blocking: Mama Bisi swelling cause; [VERIFY] tags) → fixed; round 2 **PASS** (0 blocking); human APPROVED 2026-11-07 ("all approved") |
| 5 render | done | 2026-11-07 | hub + 7 lessons + retrieval-bank.js; 7 new 3D kits + HeartKit v2.1; editorial-ink theme |
| 5v videos | done | 2026-11-07 | lessons 04, 05, 06 (human-approved picks): 9.8 / 8.8 / 8.4 min, QA clean on 3 screens, +115/108/103 KB; existing heart, capillary-bed, blood kits (no new video kits) |
| 6 kits | done | 2026-11-07 | agar-cube-bench v2, dissection-bench, body-circuit, pulse-bench, vessel-slide-bench, blood-count-bench, abo-typing-bench, HeartKit v2.1 |
| 7 qa | done | 2026-11-08 | 05-qa-report.md PASS, 0 issues (incl. the new layout-sanity check) |
| 8 package | done | 2026-11-08 | exports/ss2-bio-heart-circulation.zip re-packaged after the bench-tightening pass |

## Assumptions
- Using `editorial-ink` theme (kept from the previous run).
- Existing kits (`kits/heart-circulation/`, `kits/video/heart`, `capillary-bed`, `blood`) are reused where they fit; the previous run is backed up in git history and the session scratchpad.

## Human feedback log
- 2026-11-05/07: previous run completed and packaged (3 videos: lessons 03–05). Earlier feedback "fix them" (Lesson 04 numbers aligned).
- 2026-11-07: "rereun ss2-bio-heart-circulation" → full rerun from step 1 (human chose this scope).
- 2026-11-07: human approved 02-lesson.md + video plan (lesson-04, 05, 06) — "all approved".
- 2026-11-07: full rerun built (7 lessons). Known cosmetic items for human review: L06 video kit labels touch the dashed focus circle in 'Three kinds of cell'; L05 video 'Where is NFP zero?' crops graph edge labels in portrait; L06 clot zoom stages 2 and 3 look alike (caption only). Phone-performance risks to test on a real low-end Android: body-circuit (~80k triangles) and HeartKit v2.1 (~120k).
- 2026-11-08: human review — "the scientific kits are too stretched… should be much more concise". Fixed: a `.lab` class collision was stretching bench labels to 560px (heart L02/03/06/07), and every bench's controls, method cards and results tables were made compact on phones. scripts/qa.mjs now blocks on stretched elements and warns past the control-bar budget; the rule is in lesson-renderer/SKILL.md. Narrator now shows "No voice on this device" instead of falling back to captions silently.
- 2026-11-08: human report — the sort-game drag and drop froze, especially when dropping at the edge between two groups. Fixed with a shared drag module (assets/js/sort-dnd.js): auto-scrolls to reach bins below the fold, snaps to the nearest bin so the seam between groups is no longer a dead zone, and ignores a stray second touch. scripts/qa.mjs now has a drag-and-drop check. QA PASS, re-packaged.
