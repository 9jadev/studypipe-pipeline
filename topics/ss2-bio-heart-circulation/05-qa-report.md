# QA report: topics/ss2-bio-heart-circulation
date: 2026-11-06 07:06
verdict: PASS
theme: editorial-ink
lessons checked: 5
sections checked: 60

## Issues
- none

## Screenshots (review these visually)
- topics/ss2-bio-heart-circulation/qa/welcome-00-hero.png
- topics/ss2-bio-heart-circulation/qa/welcome-mystery.png
- topics/ss2-bio-heart-circulation/qa/welcome-journey.png
- topics/ss2-bio-heart-circulation/qa/welcome-explorer.png
- topics/ss2-bio-heart-circulation/qa/welcome-master.png
- topics/ss2-bio-heart-circulation/qa/welcome-method.png
- topics/ss2-bio-heart-circulation/qa/welcome-99-narrator.png
- topics/ss2-bio-heart-circulation/qa/lesson-01-00-hero.png
- topics/ss2-bio-heart-circulation/qa/lesson-01-02-story.png
- topics/ss2-bio-heart-circulation/qa/lesson-01-04-sort.png
- topics/ss2-bio-heart-circulation/qa/lesson-01-06-concepts.png
- topics/ss2-bio-heart-circulation/qa/lesson-01-07-neutralise.png
- topics/ss2-bio-heart-circulation/qa/lesson-01-08-examples.png
- topics/ss2-bio-heart-circulation/qa/lesson-01-09-bridge.png
- topics/ss2-bio-heart-circulation/qa/lesson-01-10-quiz.png
- topics/ss2-bio-heart-circulation/qa/lesson-01-99-narrator-spotlight.png
- topics/ss2-bio-heart-circulation/qa/lesson-02-00-hero.png
- topics/ss2-bio-heart-circulation/qa/lesson-02-02-story.png
- topics/ss2-bio-heart-circulation/qa/lesson-02-04-sort.png
- topics/ss2-bio-heart-circulation/qa/lesson-02-06-concepts.png
- topics/ss2-bio-heart-circulation/qa/lesson-02-07-neutralise.png
- topics/ss2-bio-heart-circulation/qa/lesson-02-08-examples.png
- topics/ss2-bio-heart-circulation/qa/lesson-02-09-bridge.png
- topics/ss2-bio-heart-circulation/qa/lesson-02-10-quiz.png
- topics/ss2-bio-heart-circulation/qa/lesson-02-99-narrator-spotlight.png
- topics/ss2-bio-heart-circulation/qa/lesson-03-00-hero.png
- topics/ss2-bio-heart-circulation/qa/lesson-03-02-story.png
- topics/ss2-bio-heart-circulation/qa/lesson-03-04-sort.png
- topics/ss2-bio-heart-circulation/qa/lesson-03-06-concepts.png
- topics/ss2-bio-heart-circulation/qa/lesson-03-07-neutralise.png
- topics/ss2-bio-heart-circulation/qa/lesson-03-08-examples.png
- topics/ss2-bio-heart-circulation/qa/lesson-03-09-bridge.png
- topics/ss2-bio-heart-circulation/qa/lesson-03-10-quiz.png
- topics/ss2-bio-heart-circulation/qa/lesson-03-99-narrator-spotlight.png
- topics/ss2-bio-heart-circulation/qa/lesson-04-00-hero.png
- topics/ss2-bio-heart-circulation/qa/lesson-04-02-story.png
- topics/ss2-bio-heart-circulation/qa/lesson-04-04-sort.png
- topics/ss2-bio-heart-circulation/qa/lesson-04-06-concepts.png
- topics/ss2-bio-heart-circulation/qa/lesson-04-07-neutralise.png
- topics/ss2-bio-heart-circulation/qa/lesson-04-08-examples.png
- topics/ss2-bio-heart-circulation/qa/lesson-04-09-bridge.png
- topics/ss2-bio-heart-circulation/qa/lesson-04-10-quiz.png
- topics/ss2-bio-heart-circulation/qa/lesson-04-99-narrator-spotlight.png
- topics/ss2-bio-heart-circulation/qa/lesson-05-00-hero.png
- topics/ss2-bio-heart-circulation/qa/lesson-05-02-story.png
- topics/ss2-bio-heart-circulation/qa/lesson-05-04-sort.png
- topics/ss2-bio-heart-circulation/qa/lesson-05-06-concepts.png
- topics/ss2-bio-heart-circulation/qa/lesson-05-07-neutralise.png
- topics/ss2-bio-heart-circulation/qa/lesson-05-08-examples.png
- topics/ss2-bio-heart-circulation/qa/lesson-05-09-bridge.png
- topics/ss2-bio-heart-circulation/qa/lesson-05-10-quiz.png
- topics/ss2-bio-heart-circulation/qa/lesson-05-99-narrator-spotlight.png

## Visual review
- Verified with `HeartKit v2` (`kits/heart-circulation/heart-kit.js` / `html/assets/js/heart-kit.js`) across the Unit Welcome Hub and all 5 lessons (60 sections) at `360×740`:
  - `editorial-ink` theme fonts (Fraunces, Plus Jakarta Sans, JetBrains Mono) load cleanly offline with zero network calls and zero console errors.
  - 3D anatomical heart and circulation stages use `HeartKit v2` extruded chamber cavities, 3:1 LV/RV myocardium walls, procedural striated muscle textures, GLSL systole deformation, articulating valves/chordae tendineae, and Lathe biconcave RBCs.
- Final QA verdict: **PASS**.
