# QA report: topics/ss2-phy-simple-harmonic-motion
date: 2026-11-12 11:58
verdict: PASS
theme: editorial-ink
lessons checked: 7
sections checked: 97

## Issues
- none

## Notes
- [lesson-02:video] explainer video OK: 61 lines, world unit, iframe 639px. Deep checks: node .agents/skills/explainer-video/scripts/qa.cjs topics/ss2-phy-simple-harmonic-motion/html/lessons/lesson-02/video.html
- [lesson-03:video] explainer video OK: 66 lines, world unit, iframe 639px. Deep checks: node .agents/skills/explainer-video/scripts/qa.cjs topics/ss2-phy-simple-harmonic-motion/html/lessons/lesson-03/video.html
- [lesson-07:video] explainer video OK: 69 lines, world unit, iframe 639px. Deep checks: node .agents/skills/explainer-video/scripts/qa.cjs topics/ss2-phy-simple-harmonic-motion/html/lessons/lesson-07/video.html

## Post-QA fixes (2026-11-12)
- Lesson-02 video: five final-answer lines had the second set in math italic with no space (`0.49s`, `T₁ = 0.50s`, `T₂ = 0.56s`, `T = 0.568s`, `T = 0.44s`). They now use `\text{ s}`; plan and `video.html` rebuilt. Video QA re-run clean on portrait 360×740, landscape 740×360 and desktop 1152×700 (50 moments each).
- Lesson-02 expected-results table: added the note that T and T² are worked from unrounded times (0.2839 s → 0.0806 s²; 8.028 s → 0.401 s). Lesson-01's note now covers ω (3.49 from the rounded T, 3.50 from 1.795 s) and correctly says the table checks only the typed f.
- Lesson-02 load explorer: lab frequency bar maximum widened from 3.5 to 3.6 Hz so the 50 g pin (3.52 Hz) is not clamped.
- StudyMath Do Now breakdown: the plain-text fallback was splitting decimals at the dot (`12.0` → `12`, `0.60` → `0` + `60`), producing fake steps. It now splits on semicolons/sentence periods only, handles decimals and slash fractions, and runs only on `.dn-a` Do Now answers; quiz explanations and assignment solutions keep their `<code>`-based chains. Fixed in the topic copy, `kits/math-solver` and the lesson-renderer shell. Re-checked every Do Now card in all seven lessons; the Lesson 2 “20 oscillations in 12.0 s” card now reads `T = 12.0/20`, `T = 0.60 s`, `f = 1/0.60`, `f = 1.67 Hz`.
- Full `qa.mjs` re-run after the fixes: PASS, 0 issues.

## Screenshots (review these visually)
- topics/ss2-phy-simple-harmonic-motion/qa/welcome-00-hero.png
- topics/ss2-phy-simple-harmonic-motion/qa/welcome-mystery.png
- topics/ss2-phy-simple-harmonic-motion/qa/welcome-journey.png
- topics/ss2-phy-simple-harmonic-motion/qa/welcome-explorer.png
- topics/ss2-phy-simple-harmonic-motion/qa/welcome-master.png
- topics/ss2-phy-simple-harmonic-motion/qa/welcome-method.png
- topics/ss2-phy-simple-harmonic-motion/qa/welcome-99-narrator.png
- topics/ss2-phy-simple-harmonic-motion/qa/lesson-01-00-hero.png
- topics/ss2-phy-simple-harmonic-motion/qa/lesson-01-02-story.png
- topics/ss2-phy-simple-harmonic-motion/qa/lesson-01-04-sort.png
- topics/ss2-phy-simple-harmonic-motion/qa/lesson-01-07-concepts.png
- topics/ss2-phy-simple-harmonic-motion/qa/lesson-01-08-zoom.png
- topics/ss2-phy-simple-harmonic-motion/qa/lesson-01-09-examples.png
- topics/ss2-phy-simple-harmonic-motion/qa/lesson-01-10-bridge.png
- topics/ss2-phy-simple-harmonic-motion/qa/lesson-01-11-quiz.png
- topics/ss2-phy-simple-harmonic-motion/qa/lesson-01-99-narrator-spotlight.png
- topics/ss2-phy-simple-harmonic-motion/qa/lesson-02-00-hero.png
- topics/ss2-phy-simple-harmonic-motion/qa/lesson-02-02-story.png
- topics/ss2-phy-simple-harmonic-motion/qa/lesson-02-04-sort.png
- topics/ss2-phy-simple-harmonic-motion/qa/lesson-02-07-concepts.png
- topics/ss2-phy-simple-harmonic-motion/qa/lesson-02-08-zoom.png
- topics/ss2-phy-simple-harmonic-motion/qa/lesson-02-09-examples.png
- topics/ss2-phy-simple-harmonic-motion/qa/lesson-02-10-bridge.png
- topics/ss2-phy-simple-harmonic-motion/qa/lesson-02-11-quiz.png
- topics/ss2-phy-simple-harmonic-motion/qa/lesson-02-99-narrator-spotlight.png
- topics/ss2-phy-simple-harmonic-motion/qa/lesson-03-00-hero.png
- topics/ss2-phy-simple-harmonic-motion/qa/lesson-03-02-story.png
- topics/ss2-phy-simple-harmonic-motion/qa/lesson-03-04-sort.png
- topics/ss2-phy-simple-harmonic-motion/qa/lesson-03-07-concepts.png
- topics/ss2-phy-simple-harmonic-motion/qa/lesson-03-08-zoom.png
- topics/ss2-phy-simple-harmonic-motion/qa/lesson-03-09-examples.png
- topics/ss2-phy-simple-harmonic-motion/qa/lesson-03-10-bridge.png
- topics/ss2-phy-simple-harmonic-motion/qa/lesson-03-11-quiz.png
- topics/ss2-phy-simple-harmonic-motion/qa/lesson-03-99-narrator-spotlight.png
- topics/ss2-phy-simple-harmonic-motion/qa/lesson-04-00-hero.png
- topics/ss2-phy-simple-harmonic-motion/qa/lesson-04-02-story.png
- topics/ss2-phy-simple-harmonic-motion/qa/lesson-04-04-sort.png
- topics/ss2-phy-simple-harmonic-motion/qa/lesson-04-07-concepts.png
- topics/ss2-phy-simple-harmonic-motion/qa/lesson-04-08-zoom.png
- topics/ss2-phy-simple-harmonic-motion/qa/lesson-04-09-examples.png
- topics/ss2-phy-simple-harmonic-motion/qa/lesson-04-10-bridge.png
- topics/ss2-phy-simple-harmonic-motion/qa/lesson-04-11-quiz.png
- topics/ss2-phy-simple-harmonic-motion/qa/lesson-04-99-narrator-spotlight.png
- topics/ss2-phy-simple-harmonic-motion/qa/lesson-05-00-hero.png
- topics/ss2-phy-simple-harmonic-motion/qa/lesson-05-02-story.png
- topics/ss2-phy-simple-harmonic-motion/qa/lesson-05-04-sort.png
- topics/ss2-phy-simple-harmonic-motion/qa/lesson-05-07-concepts.png
- topics/ss2-phy-simple-harmonic-motion/qa/lesson-05-08-zoom.png
- topics/ss2-phy-simple-harmonic-motion/qa/lesson-05-09-examples.png
- topics/ss2-phy-simple-harmonic-motion/qa/lesson-05-10-bridge.png
- topics/ss2-phy-simple-harmonic-motion/qa/lesson-05-11-quiz.png
- topics/ss2-phy-simple-harmonic-motion/qa/lesson-05-99-narrator-spotlight.png
- topics/ss2-phy-simple-harmonic-motion/qa/lesson-06-00-hero.png
- topics/ss2-phy-simple-harmonic-motion/qa/lesson-06-02-story.png
- topics/ss2-phy-simple-harmonic-motion/qa/lesson-06-04-sort.png
- topics/ss2-phy-simple-harmonic-motion/qa/lesson-06-07-concepts.png
- topics/ss2-phy-simple-harmonic-motion/qa/lesson-06-08-zoom.png
- topics/ss2-phy-simple-harmonic-motion/qa/lesson-06-09-examples.png
- topics/ss2-phy-simple-harmonic-motion/qa/lesson-06-10-bridge.png
- topics/ss2-phy-simple-harmonic-motion/qa/lesson-06-11-quiz.png
- topics/ss2-phy-simple-harmonic-motion/qa/lesson-06-99-narrator-spotlight.png
- topics/ss2-phy-simple-harmonic-motion/qa/lesson-07-00-hero.png
- topics/ss2-phy-simple-harmonic-motion/qa/lesson-07-02-story.png
- topics/ss2-phy-simple-harmonic-motion/qa/lesson-07-04-sort.png
- topics/ss2-phy-simple-harmonic-motion/qa/lesson-07-07-concepts.png
- topics/ss2-phy-simple-harmonic-motion/qa/lesson-07-08-zoom.png
- topics/ss2-phy-simple-harmonic-motion/qa/lesson-07-09-examples.png
- topics/ss2-phy-simple-harmonic-motion/qa/lesson-07-10-bridge.png
- topics/ss2-phy-simple-harmonic-motion/qa/lesson-07-11-quiz.png
- topics/ss2-phy-simple-harmonic-motion/qa/lesson-07-99-narrator-spotlight.png
- topics/ss2-phy-simple-harmonic-motion/qa/lesson-02-video.png
- topics/ss2-phy-simple-harmonic-motion/qa/lesson-03-video.png
- topics/ss2-phy-simple-harmonic-motion/qa/lesson-07-video.png
