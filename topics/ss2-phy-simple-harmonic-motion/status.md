# ss2-phy-simple-harmonic-motion
state: AWAITING-REVIEW
theme: editorial-ink
videos: lesson-02,lesson-03,lesson-07   # confirmed 2026-11-11 (was auto)
video-cap: 3

| step | state | updated | note |
|---|---|---|---|
| 1 map | done | 2026-11-11 | 01-topic-map.md: 7 lessons, mystery 'The Cracked Crates of Ridge Road' (okada egg crates, Ogbomoso; resonance); full rerun, v1 archived in archive/ss2-phy-simple-harmonic-motion-v1-2026-11-11/ |
| 2 lesson | done | 2026-11-11 | 02-lesson.md: hub + 7 lessons; § 7 picks lesson-07 (10), 02 (9), 03 (9); 06/05/04 dropped by cap; story numbers recomputed and consistent |
| 3 questions | done | 2026-11-11 | 03-questions.md: 84 MCQs (21/21/21/21 A–D) + 7 home investigations + 7 × 30-mark papers (L05 = WAEC Paper 3 practical); 0 seven-word source matches. Setter fixed 2 physics errors in 02 (L05 'counting from one' error direction; L04 bench times) |
| 4 review | done | 2026-11-11 | round 1 FIX (5 blocking, all 02) → fixed; round 2 **PASS** (0 blocking; 6 minor wording items being applied); 6 minor wording items applied; human APPROVED 2026-11-11 ("continue") incl. video picks 02/03/07 |
| 5 render | done | 2026-11-12 | hub + retrieval bank + 7 lessons; finishing pass done (apply-math, apply-theme editorial-ink, nav, one shared L1–L7 switcher + model-note rule); all hrefs resolve; full qa.mjs: only the 3 missing-video items left |
| 5v videos | done | 2026-11-12 | lessons 02, 03, 07 (human-approved picks and scripts): 12.0 / 12.7 / 12.3 min, video QA clean on phone portrait + landscape + desktop (L07 desktop to be re-checked at step 7), +188 / +168 / +183 KB; new video kits reference-circle, shm-oscillator built on the fly |
| 6 kits | done | 2026-11-12 | mass-spring v2, pendulum v3, shm-kinematics-2d v2 (Paper.js), ridge-road-props (new; phone LOD: Set 1 37k tris / 67 calls); video kits reference-circle, shm-oscillator; all catalogued, copied to html/assets/js |
| 7 qa | done | 2026-11-12 | 05-qa-report.md PASS: 7 lessons + hub, 97 sections, 0 BLOCKING; 3 of 5 WARNs fixed afterwards (SHM equation-guide notes + detached minus, hub subtitle, L05 footer), qa.mjs re-run PASS 0 issues; the other 2 WARNs are shared-shell items identical in approved units |
| 8 package | done | 2026-11-12 | exports/ss2-phy-simple-harmonic-motion.zip (1.5 MB, 139 files, manifest studypipe-unit/2, zip integrity OK, no external URLs, largest file 677 KB three.min.js); replaces the v1 zip (kept in archive/) |

## Post-QA fixes (2026-11-12)
- L02 video: 5 final-answer lines corrected from italic/tight units (`0.49s`, `T₁ = 0.50s`, `T₂ = 0.56s`, `T = 0.568s`, `T = 0.44s`) to `\text{ s}`; plan and video rebuilt; video QA clean on portrait/landscape/desktop.
- L02 expected table: note added that T/T² use unrounded times (`0.0806` and `0.401` remain the accurate values; squaring the displayed T gives `0.0807`/`0.402`). L01 note extended to ω (`3.49` rounded vs `3.50` unrounded).
- L02 load explorer: lab frequency bar max 3.5 → 3.6 Hz so the 50 g pin (3.52 Hz) is not clamped.
- StudyMath Do Now parser: plain-text fallback no longer splits decimals (`12.0` → `12`, `0.60` → `0` + `60`); it now splits on semicolons/sentence periods only and handles decimals/slash fractions. Restricted to `.dn-a` so quiz explanations and assignment solutions keep their `<code>` chains. Fixed in the topic copy, `kits/math-solver` and the lesson-renderer shell; all seven lessons' Do Now cards re-checked.
- Full `qa.mjs` re-run: PASS, 0 issues. Re-packaged after the fixes.

## Assumptions
- Theme kept as editorial-ink (the v1 theme).
- Hub explorer uses 5 tabs (topic map asks for 5; template default is 4) — accepted by director.
- Ridge-road story numbers (ridges 2.5 m, f0 2 Hz, damping ratios) are a constructed teaching model, labelled as such.
- Okada model is defined by f0 = 2.00 Hz exactly (k = 4π²f0²m ≈ 31 583 N/m for 200 kg; displayed as 3.16 × 10⁴). The 18 km/h leaking bounce is 10.0496 cm → shown as 10.0 cm everywhere (was 10.1 from double rounding; corrected 2026-11-11 in 02, 03, L07 script, hub, kits).
- Lab data graphs (T²–m, T²–l, amplitude decay, A–v) use the SVG study-graph kit, following the precedent from earlier topics; conceptual curves and the hub explorer use Paper.js (review minor 17).

- L06 ten-push demo (kit model: leaking damper passes 6.2 cm at push 4 and reaches 8.5 cm after ten pushes; healthy settles at 2.0 cm) is a MassSpringKit model value, not stated in 02-lesson.md; the 2D panel is driven from the same model so both agree.
- Shared page shell (math.css/lesson.css) still has literal hex/Georgia, same as the approved units: project-wide backlog, not changed here.

## Human feedback log
- 2026-11-11: "let's restart this ss2-phy-simple-harmonic-motion from ground up" — full rerun from step 1.
- 2026-11-11: approved 02-lesson.md, 03-questions.md and video picks lesson-02/03/07 ("continue" at the approval gate).
- 2026-11-12: approved the 3 video direction scripts (lesson-02, 03, 07) ("all approved").
