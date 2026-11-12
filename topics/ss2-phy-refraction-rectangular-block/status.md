theme: editorial-ink
# Status: ss2-phy-refraction-rectangular-block

- **subject:** Physics
- **level:** SS2
- **title:** Refraction of Light Through a Rectangular Glass Block
- **exam:** WAEC, NECO, JAMB
- **state:** DONE
- **current_step:** 8
- **updated:** 2026-11-04

## Step log

| Step | Skill | Status | Notes |
|---|---|---|---|
| 1 | `curriculum-mapper` | done | Mapped 22-page source PDF + WAEC/NECO/JAMB syllabus into 5-lesson unit (`01-topic-map.md`) |
| 2 | `lesson-designer` | done | Authored full 5-phase inquiry unit plan (`02-lesson.md`) covering Welcome Hub + Lessons 01–05 |
| 3 | `assessment-builder` | done | Authored 60 original MCQs (12 per lesson) + five 30-mark structured/practical assignments (`03-questions.md`) |
| 4 | `content-reviewer` | done | Independent audit passed (`verdict: PASS` in `04-review.md`, 0 issues, 0 `[VERIFY]` flags) |
| 5 | `lesson-renderer` | done | Rendered Welcome Hub (`html/index.html`), `retrieval-bank.js`, and Lessons 01–05 (`html/lessons/lesson-01/` .. `lesson-05/`) |
| 6 | `kit-builder` | done | Built parametric 3D kit `kits/refraction-glass-block/` (`window.RefractionBlockKit`) and registered in `kits/catalog.md` |
| 7 | `html-qa` | done | `verdict: PASS` across Welcome Hub + 5 lessons (65 sections checked, 0 issues, 47 screenshots in `qa/`) |
| 8 | `packager` | done | Packaged 57 files into `exports/ss2-phy-refraction-rectangular-block.zip` (784 KB) |

- 2026-11-08: fixed the sort-game drag-and-drop freeze (same bug the human reported on the biology units): all 5 lessons now use the shared assets/js/sort-dnd.js (auto-scroll to bins below the fold, snap to nearest bin, survives a stray second touch). QA re-run PASS (0 blocking; only tall-control-bar WARNs remain, non-blocking). Re-packaged (0.8 MB). Not done: tightening the tall bench control bars (optional); a full rerun from step 1 would need the Opus weekly limit to reset (Nov 11).
