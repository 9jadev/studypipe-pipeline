---
name: html-qa
description: Tests a rendered multi-lesson unit offline in a phone-sized browser (Playwright) — verifying the Unit Welcome Hub (html/index.html) and every individual lesson (html/lessons/lesson-0X/index.html), checking Nigerian English (en-NG) StudyNarrator choreography, local fonts, LessonKit widgets, and 3D SceneKit canvases, and writing 05-qa-report.md with PASS or FAIL. Step 7 of the StudyPipe pipeline.
---

# HTML QA

## Procedure
1. Run `node scripts/qa.mjs topics/<slug>`. It tests the **Unit Welcome Hub (`html/index.html`)** and **every lesson in `html/lessons/lesson-0X/index.html`**, writing `05-qa-report.md` and screenshots in `qa/`.
   Automatic checks performed by `scripts/qa.mjs`:
   - Zero console errors or uncaught page errors across the Welcome Hub and all lessons
   - Zero network requests (100% offline; local `.woff2` fonts and assets only)
   - Welcome Hub (`html/index.html`) renders its 3D Hero Lab (`#lab-canvas`), Lesson Journey links (`lessons/lesson-0X/index.html`), Interactive Explorer tabs, Myth cards, and Welcome Narrator tour (`StudyNarrator`)
   - Every lesson (`html/lessons/lesson-0X/index.html`) mounts `StudyNarrator` (`.narr-dock`), `window.NARRATION.script`, word spans (`.w`), spotlight (`.narr-spot`), `window.StudyMath` offline LaTeX rendering (`.sp-math[data-latex]`) and step-by-step calculation explainer notes (`.m-step-note`, `.m-eq-note`), `LessonKit` interactive quiz cards in `#quiz-list`, `.l-sec` sections, and 3D `SceneKit` / `StoryStage` canvases without collapsing or overflowing horizontally at `360×740`.
2. **Look at key screenshots yourself** and append a `## Visual review` section to `05-qa-report.md`:
   - Editorial typography (`Fraunces` serif headings, `Manrope` body, `JetBrains Mono` readouts) aligned cleanly
   - Dark-ink Welcome Hub & 3D stages contrast sharply with warm-paper lesson reading sections
   - 3D StoryStage and 3D Lab Bench canvases show well-lit apparatus and clear labels that do not cover moving parts
   - Narrator spotlight frames the target cleanly with the cue pointer badge.
3. Verdict: **PASS** only if `scripts/qa.mjs` passed and visual review found no blocking issue.
