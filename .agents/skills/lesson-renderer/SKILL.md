---
name: lesson-renderer
description: Renders an approved 02-lesson.md and 03-questions.md into a Multi-Lesson Unit in topics/<slug>/html/ — including the Unit Welcome Hub (html/index.html with 3D Hero Lab & Welcome Tour), shared Spaced Retrieval Bank (retrieval-bank.js), and individual 5-phase lessons (html/lessons/lesson-01/ … lesson-0N/) with Nigerian English (en-NG) StudyNarrator choreography. Step 5 of the StudyPipe pipeline.
---

# Lesson Renderer

Goal: transform an approved `02-lesson.md` and `03-questions.md` into a production-grade, 100% offline **Multi-Lesson Unit** in `topics/<slug>/html/` using the StudyPipe Editorial Design System, 3D `SceneKit`/`StoryStage` engines, and Nigerian English (`en-NG`) `StudyNarrator`.

Read first:
- `references/html-standards.md` (required)
- `../kit-builder/references/kit-contract.md` (required)
- `../story-builder/SKILL.md` (required)
- `../narration-choreographer/SKILL.md` (required)

## Multi-Lesson Directory Architecture (`topics/<slug>/html/`)

Every rendered topic MUST follow this exact multi-lesson unit layout (matching the reference `studypipe-titration 2` architecture):

```text
topics/<slug>/html/
├── index.html                        # Unit Welcome Hub (Hero 3D Lab, Mystery, Lesson Journey cards, Explorer, Archetypes, Myths, Method)
├── assets/
│   ├── fonts/                        # Bundled offline Fraunces, Manrope, JetBrains Mono (.woff2)
│   ├── css/
│   │   ├── fonts.css
│   │   ├── style.css                 # Unit Welcome Hub & shared editorial tokens
│   │   ├── lesson.css                # 5-phase lesson layout & inquiry widgets
│   │   └── narrator.css              # Spotlight, pointer cue, sparkles, dock UI
│   └── js/
│       ├── three.min.js              # three.js r160 + OrbitControls
│       ├── scene-kit.js              # Shared 3D studio lighting, procedural textures, label pills
│       ├── story-scene.js            # Shared 3D Nigerian character & story stage builder
│       ├── lesson-kit.js             # Shared inquiry widgets (Do Now, Wonder Wall, Quiz, Rubric, Locked Solutions)
│       ├── narrator.js               # Nigerian English (en-NG priority) spotlight narrator engine
│       ├── welcome.js                # Welcome Hub tabs, scroll-reveal, myth flip cards
│       ├── welcome-lab.js            # Welcome Hub Hero 3D Lab (window.StudyLab)
│       ├── welcome-narration.js      # Welcome Hub guided tour script (window.NARRATION)
│       └── retrieval-bank.js         # Shared spaced-retrieval bank (window.RETRIEVAL_BANK.l01 .. l0N)
└── lessons/
    ├── lesson-01/
    │   ├── index.html                # Lesson 1 editorial 5-phase page
    │   ├── data.js                   # Lesson 1 items, lab trials, explorer pins, LESSON_QUIZ
    │   ├── story.js                  # Lesson 1 3D StoryStage beats
    │   ├── bench.js                  # Lesson 1 3D Virtual Lab (window.StudyScenes.bench)
    │   ├── zoom.js                   # Lesson 1 3D Concept Zoom (window.StudyScenes.zoom)
    │   ├── lesson.js                 # Lesson 1 interactive widgets & LessonKit.boot
    │   └── narration.js              # Lesson 1 StudyNarrator choreography (window.NARRATION)
    ├── lesson-02/
    │   └── ... (same 7 files for Lesson 2)
    └── lesson-0N/
        └── ... (same 7 files for Lesson N)
```

## Procedure
1. Verify that `topics/<slug>/04-review.md` has `verdict: PASS`.
2. Copy the shared design system & engine into `topics/<slug>/html/assets/`:
   - Copy `.agents/skills/lesson-renderer/assets/lesson-shell/assets/` → `topics/<slug>/html/assets/` (`fonts/`, `css/`, `js/scene-kit.js`, `js/lesson-kit.js`, `js/story-scene.js`, `js/narrator.js`, `js/welcome.js`).
   - Copy `kits/_vendor/three-bundle.min.js` → `topics/<slug>/html/assets/js/three.min.js`.
3. Build the **Unit Welcome Hub (`topics/<slug>/html/index.html`)** + `assets/js/welcome-lab.js` + `assets/js/welcome-narration.js`:
   - Top `.nav` with unit brand, anchor links (`#mystery`, `#journey`, `#explorer`, `#master`, `#method`), and `Offline ready` pill.
   - `.hero` with unit title, `[data-tour]` button, `"Begin Lesson 1"` link (`lessons/lesson-01/index.html`), `.hero-meta`, and the live 3D Hero Lab (`#lab`, `#lab-canvas`, `.hud` readouts & buttons) powered by `assets/js/welcome-lab.js` (`window.StudyLab`).
   - `.marquee` scrolling key terms.
   - `#mystery` Unit Case File + `.stats` exam weight cards.
   - `#journey` Lesson Roadmap cards (`<article class="lesson reveal is-live">`) linking to `lessons/lesson-01/index.html` through `lessons/lesson-0N/index.html`.
   - `#explorer` interactive concept tab switcher (`window.WELCOME_COMBOS`) + SVG curve (`#combo-curve`).
   - `#master` outcomes grid + `#archetypes` calculation cards + `.formula-strip` + `#myths` 3D flip cards.
   - `#method` 5-step inquiry loop + `#kit` summary + `.finale` CTA to `lessons/lesson-01/index.html`.
4. Build the shared **Spaced Retrieval Bank (`topics/<slug>/html/assets/js/retrieval-bank.js`)**:
   - Exposes `window.RETRIEVAL_BANK = { l01: { title, donow, quiz, recall }, l02: { ... }, ... }` so every lesson can pull *Do Now* retrieval questions from prerequisites (`from: 0`) and earlier lessons (`from: 1`, `from: 2`, etc.).
5. Build **every individual lesson (`topics/<slug>/html/lessons/lesson-01/` … `lesson-0N/`)**:
   - Each lesson folder contains `index.html`, `data.js`, `story.js`, `bench.js`, `zoom.js`, `lesson.js`, and `narration.js`.
   - Inside `lessons/lesson-0X/index.html`, reference shared assets via `../../assets/css/*.css` and `../../assets/js/*.js` (`three.min.js`, `scene-kit.js`, `story-scene.js`, `lesson-kit.js`, `retrieval-bank.js`, `narrator.js`), and link the top nav & footer prev/next buttons to `../../index.html` and sibling lessons (`../lesson-0Y/index.html`).
6. Run `node scripts/qa.mjs topics/<slug>` to verify the Unit Welcome Hub and all `lessons/lesson-0X/index.html` pages pass offline, font, 3D canvas, and narrator checks.
