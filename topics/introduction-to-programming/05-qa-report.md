# QA report: topics/introduction-to-programming
date: 2026-11-11 11:04
verdict: PASS
theme: green-lab
lessons checked: 6
sections checked: 72

## Issues
- none

## Notes
- [lesson-01:video] explainer video OK: 43 lines, world unit, iframe 639px. Deep checks: node .agents/skills/explainer-video/scripts/qa.cjs topics/introduction-to-programming/html/lessons/lesson-01/video.html
- [lesson-03:video] explainer video OK: 39 lines, world unit, iframe 639px. Deep checks: node .agents/skills/explainer-video/scripts/qa.cjs topics/introduction-to-programming/html/lessons/lesson-03/video.html
- [lesson-04:video] explainer video OK: 48 lines, world unit, iframe 639px. Deep checks: node .agents/skills/explainer-video/scripts/qa.cjs topics/introduction-to-programming/html/lessons/lesson-04/video.html

## Screenshots (review these visually)
- topics/introduction-to-programming/qa/welcome-00-hero.png
- topics/introduction-to-programming/qa/welcome-mystery.png
- topics/introduction-to-programming/qa/welcome-journey.png
- topics/introduction-to-programming/qa/welcome-explorer.png
- topics/introduction-to-programming/qa/welcome-master.png
- topics/introduction-to-programming/qa/welcome-method.png
- topics/introduction-to-programming/qa/welcome-99-narrator.png
- topics/introduction-to-programming/qa/lesson-01-00-hero.png
- topics/introduction-to-programming/qa/lesson-01-02-story.png
- topics/introduction-to-programming/qa/lesson-01-04-sort.png
- topics/introduction-to-programming/qa/lesson-01-06-concepts.png
- topics/introduction-to-programming/qa/lesson-01-07-zoom.png
- topics/introduction-to-programming/qa/lesson-01-08-examples.png
- topics/introduction-to-programming/qa/lesson-01-09-bridge.png
- topics/introduction-to-programming/qa/lesson-01-10-quiz.png
- topics/introduction-to-programming/qa/lesson-01-99-narrator-spotlight.png
- topics/introduction-to-programming/qa/lesson-02-00-hero.png
- topics/introduction-to-programming/qa/lesson-02-02-story.png
- topics/introduction-to-programming/qa/lesson-02-04-sort.png
- topics/introduction-to-programming/qa/lesson-02-06-concepts.png
- topics/introduction-to-programming/qa/lesson-02-07-zoom.png
- topics/introduction-to-programming/qa/lesson-02-08-examples.png
- topics/introduction-to-programming/qa/lesson-02-09-bridge.png
- topics/introduction-to-programming/qa/lesson-02-10-quiz.png
- topics/introduction-to-programming/qa/lesson-02-99-narrator-spotlight.png
- topics/introduction-to-programming/qa/lesson-03-00-hero.png
- topics/introduction-to-programming/qa/lesson-03-02-story.png
- topics/introduction-to-programming/qa/lesson-03-04-sort.png
- topics/introduction-to-programming/qa/lesson-03-06-concepts.png
- topics/introduction-to-programming/qa/lesson-03-07-zoom.png
- topics/introduction-to-programming/qa/lesson-03-08-examples.png
- topics/introduction-to-programming/qa/lesson-03-09-bridge.png
- topics/introduction-to-programming/qa/lesson-03-10-quiz.png
- topics/introduction-to-programming/qa/lesson-03-99-narrator-spotlight.png
- topics/introduction-to-programming/qa/lesson-04-00-hero.png
- topics/introduction-to-programming/qa/lesson-04-02-story.png
- topics/introduction-to-programming/qa/lesson-04-04-sort.png
- topics/introduction-to-programming/qa/lesson-04-06-concepts.png
- topics/introduction-to-programming/qa/lesson-04-07-zoom.png
- topics/introduction-to-programming/qa/lesson-04-08-examples.png
- topics/introduction-to-programming/qa/lesson-04-09-bridge.png
- topics/introduction-to-programming/qa/lesson-04-10-quiz.png
- topics/introduction-to-programming/qa/lesson-04-99-narrator-spotlight.png
- topics/introduction-to-programming/qa/lesson-05-00-hero.png
- topics/introduction-to-programming/qa/lesson-05-02-story.png
- topics/introduction-to-programming/qa/lesson-05-04-sort.png
- topics/introduction-to-programming/qa/lesson-05-06-concepts.png
- topics/introduction-to-programming/qa/lesson-05-07-zoom.png
- topics/introduction-to-programming/qa/lesson-05-08-examples.png
- topics/introduction-to-programming/qa/lesson-05-09-bridge.png
- topics/introduction-to-programming/qa/lesson-05-10-quiz.png
- topics/introduction-to-programming/qa/lesson-05-99-narrator-spotlight.png
- topics/introduction-to-programming/qa/lesson-06-00-hero.png
- topics/introduction-to-programming/qa/lesson-06-02-story.png
- topics/introduction-to-programming/qa/lesson-06-04-sort.png
- topics/introduction-to-programming/qa/lesson-06-06-concepts.png
- topics/introduction-to-programming/qa/lesson-06-07-zoom.png
- topics/introduction-to-programming/qa/lesson-06-08-examples.png
- topics/introduction-to-programming/qa/lesson-06-09-bridge.png
- topics/introduction-to-programming/qa/lesson-06-10-quiz.png
- topics/introduction-to-programming/qa/lesson-06-99-narrator-spotlight.png
- topics/introduction-to-programming/qa/lesson-01-video.png
- topics/introduction-to-programming/qa/lesson-03-video.png
- topics/introduction-to-programming/qa/lesson-04-video.png

## Visual review
verdict: PASS (Round 2 re-inspection at `360×740` — all 6 Round 1 issues verified fixed; `scripts/qa.mjs` passed 0 console/network/overflow errors across Welcome Hub + 6 lessons)

### Round 2 Verification Summary
- **LaTeX & `StudyMath` hydration (`lesson-01`..`lesson-06`)**: Confirmed 0 raw `$$...$$` or `\(...\)` strings across all 6 lessons (`rawCount: 0`), and all `.sp-math[data-latex]` elements hydrate offline via `StudyMath.upgradeSpMath` (`lesson-01`: 101/101, `lesson-02`: 170/170, `lesson-03`: 129/129, `lesson-04`: 188/188, `lesson-05`: 116/116, `lesson-06`: 155/155; `spEmpty: 0` on all 6). Verified visually in `inspect-r2-lesson-02-math.png`, `inspect-r2-lesson-04-math.png`, `inspect-r2-lesson-05-math.png`, `inspect-r2-lesson-06-math.png`.
- **`.m-step-note` flow**: Confirmed `stepNoteFlex: 0` across all 6 lessons; inline `<code>` and `<strong>` elements flow naturally inside block/grid notes without vertical column fragmentation or right-edge clipping (`inspect-r2-lesson-02-math.png`, `inspect-r2-lesson-06-math.png`).
- **`.sort-item` wrapping (`lesson-01`..`lesson-06`)**: Confirmed `sortSplit: 0` across all 6 lessons; `lesson-06-04-sort.png` (`"Writing and grid_online instead of and not grid_online"`), `lesson-02-04-sort.png`, and `lesson-05-04-sort.png` wrap cleanly inside `.sort-lbl` with zero clipping.
- **`.bench-readout` 2×2 mobile grid (`lesson-02`..`lesson-05`)**: Confirmed 2-column grid at `360×740` with zero box overflow or text collisions (`inspect-r2-lesson-02-bench.png`, `inspect-r2-lesson-03-bench.png`, `inspect-r2-lesson-04-bench.png`, `inspect-r2-lesson-05-bench.png`).
- **`StudyCode` header & `.code-step-note` (`lesson-01`..`lesson-06`)**: Confirmed `PYTHON 3` badge stays single-line, titles ellipsize cleanly, and the `Copy` button is 100% visible and unclipped across all 6 lessons (`lesson-01-08-examples.png`..`lesson-06-08-examples.png`). `.code-step-note` wraps inside `.study-code-body` (`white-space: normal`), which scrolls horizontally alongside wide code lines without page overflow.
- **`lesson-01` typo**: Confirmed `"A telecom promo awards a 15% airtime bonus"` in `lesson-01-08-examples.png`.
- **3D stages, explainer videos, typography (`green-lab`)**: Welcome Hub `#lab-canvas`, all 6 `#story-stage`, `#bench-canvas`, and `#zoom-canvas` stages, `lesson-01`/`03`/`04` explainer video embeds, and `StudyNarrator` spotlighting all render cleanly offline with zero primitive placeholders.

## Fix routing
- none (PASS)
