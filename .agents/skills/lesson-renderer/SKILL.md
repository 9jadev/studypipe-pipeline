---
name: lesson-renderer
description: Renders an approved 02-lesson.md and 03-questions.md into an offline, phone-first, narrated HTML lesson in topics/<slug>/html/, reusing kits from kits/catalog.md and calling kit-builder only for missing visuals. Step 5 of the StudyPipe pipeline.
---

# Lesson Renderer

Goal: a lesson folder that opens from `index.html` on a cheap Android phone with no internet.

Read first: `references/html-standards.md` (required) and `../kit-builder/references/kit-contract.md`.

## Procedure
1. Only render if `04-review.md` says `verdict: PASS`.
2. Copy the shell: `assets/lesson-shell/` → `topics/<slug>/html/` (index.html, lesson.css, player.js).
3. Build `html/lesson-data.js` = `window.LESSON = {...}` converted from `02-lesson.md` and
   `03-questions.md` (structure documented in html-standards.md). Narration text goes in
   each section's `narration` field — the shell speaks it with the Web Speech API.
4. For every Scene:
   - Look it up in `kits/catalog.md` by `kit_hint` or by concept.
   - **Found:** copy `kits/<kit-id>/` into `html/kits/<kit-id>/` and reference it in the section
     with the scene's `params`.
   - **Not found / can't be reached by params:** call the `kit-builder` skill with the Scene
     block. It creates `kits/<new-id>/` and a catalog row; then copy it in as above.
   - Simple static diagrams that are truly one-off may be inline SVG in the section `html`.
5. Copy `kits/_vendor/three-bundle.min.js` into `html/vendor/` if any 3D kit is used.
6. Open nothing from the internet. Run `node scripts/qa.mjs topics/<slug>` yourself once before
   handing over to `html-qa`, and fix obvious errors.
7. Update `status.md` with kits reused vs created.

## Rules
- Do not rewrite the teaching content; render it faithfully. If something can't be shown as
  specified, write it in `status.md` and choose the closest faithful visual.
- Labels must sit next to what they label and must never cover moving parts.
- Every interactive scene has an obvious first action ("Tap the tap to open it") and a reset button.
- Respect the student's phone: target total lesson size < 3 MB excluding the three.js bundle.
