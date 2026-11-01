---
name: html-qa
description: Tests a rendered lesson offline in a phone-sized browser (Playwright), then visually reviews the screenshots and writes 05-qa-report.md with PASS or FAIL. Step 7 of the StudyPipe pipeline.
---

# HTML QA

## Procedure
1. Run `node scripts/qa.mjs topics/<slug>`. It writes `05-qa-report.md` and screenshots in `qa/`.
   (Automatic checks: console errors, network attempts, missing kits, collapsed 3D canvas,
   horizontal overflow, package size.)
2. **Look at every screenshot yourself** and append a `## Visual review` section to the report:
   - Text readable, nothing cut off, nothing overlapping
   - Labels beside what they label; not covering moving parts
   - Colours realistic for the science (indicators, precipitates, tissues)
   - The first action in each interactive scene is obvious
   - Matches what the Scene block in `02-lesson.md` asked for
3. Verdict: **PASS** only if the script passed and the visual review found no blocking issue.
   On FAIL, list each fix for `lesson-renderer` (or `kit-builder` if the kit itself is wrong).

## Notes
- First-time setup on a new machine: `npm install` then `npx playwright install chromium`.
- Narration (speech) cannot be heard in headless tests; the human checks it during review.
