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
   - Layout sanity at 360px (`[lesson-0X:layout]`): no short label or button is more than ~160 px tall, and no control bar (`.stage-bar`, `.bench-mode`, `.seg`, `.chips`, `.bench-readout`) holds more than ~120 px of empty space (BLOCKING, usually a lesson class name colliding with a shared stylesheet rule, e.g. `.lab`); control bars over 260 px and bench controls over 900 px below the canvas are WARNs to tighten
   - Explainer videos: every `06-videos/lesson-0X.plan.cjs` is built and embedded, its iframe loads, the video completes the handshake with the lesson (speech relay) and sizes itself. Deep video checks (3 screens) are `.agents/skills/explainer-video/scripts/qa.cjs`, run by the video-builder
   - Theme wiring: `assets/css/theme.css` exists and is the last stylesheet on every page; the theme's display, body and mono fonts actually load (fix: `node scripts/apply-theme.mjs topics/<slug>`)
   - Welcome Hub (`html/index.html`) renders its 3D Hero Lab (`#lab-canvas`), Lesson Journey links (`lessons/lesson-0X/index.html`), Interactive Explorer tabs, Myth cards, and Welcome Narrator tour (`StudyNarrator`)
   - Every lesson (`html/lessons/lesson-0X/index.html`) mounts `StudyNarrator` (`.narr-dock`), `window.NARRATION.script`, word spans (`.w`), spotlight (`.narr-spot`), `window.StudyMath` offline LaTeX rendering (`.sp-math[data-latex]`) and step-by-step calculation explainer notes (`.m-step-note`, `.m-eq-note`), `LessonKit` interactive quiz cards in `#quiz-list`, `.l-sec` sections, and 3D `SceneKit` / `StoryStage` canvases without collapsing or overflowing horizontally at `360×740`.
2. **Look at key screenshots yourself** and append a `## Visual review` section to `05-qa-report.md`:
   - Typography matches the topic's theme (`theme:` in the report header; fonts in `themes/catalog.md`): headings in the display face, body and readouts in the theme's body and mono faces, with no fallback system fonts and no awkward heading breaks at 360 px
   - Dark ink surfaces (hub, hero, 3D stages) contrast clearly with the light paper reading sections in the theme's palette
   - 3D StoryStage and 3D Lab Bench canvases show well-lit apparatus and clear labels that do not cover moving parts
   - **3D Anatomical, Chemical & Physical Fidelity Gate (Zero Primitive Placeholder Tolerance):** Verify that every 3D organ, organism, or laboratory apparatus passes the **Unlabeled Recognition Test** (`kits/heart-circulation/heart-kit.js` `HeartKit v2` standard). Reject (**FAIL**) any kit or stage that uses crude geometric primitive approximations (e.g., "a group of cones for a heart", "unnamed cylinders for electrolysis electrodes without distinct anode/cathode plates, polarity leads, bubble streams, or metal deposition", or "a plain sphere for a cell").
   - Narrator spotlight frames the target cleanly with the cue pointer badge.
3. Verdict: **PASS** only if `scripts/qa.mjs` passed and visual review found no blocking issue.
