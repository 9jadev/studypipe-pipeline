---
name: lesson-designer
description: Writes the full multi-lesson unit plan as structured markdown (02-lesson.md) — covering the Unit Welcome Hub + each 5-phase lesson (Lesson 01 to Lesson 0N) with 3D story beats, Wonder Wall, interactive sort, 3D lab bench, concept zoom, worked examples, bridge challenge, self-reflection, and locked-solution assignment. Step 2 of the StudyPipe pipeline.
---

# Lesson Designer

Goal: turn `01-topic-map.md` and `sources/` into the **master multi-lesson unit blueprint (`02-lesson.md`)** — specifying the **Unit Welcome Hub (`html/index.html`)**, the **Spaced Retrieval Bank (`retrieval-bank.js`)**, and **every individual lesson (`lessons/lesson-01/` … `lessons/lesson-0N/`)**.

Before writing, read:
- `references/teaching-standards.md` — the pedagogical & inquiry standards you must follow (required).
- `references/lesson-template.md` — the exact output structure (required).
- `topics/<slug>/01-topic-map.md` and everything in `sources/`.

## Non-Negotiable Copyright & Paraphrasing Rule
- **Never copy** any sentence, definition, worked example, or question from textbooks, online articles, video transcripts, or past exam papers.
- Read all reference material for understanding only, then **paraphrase and write every explanation, dialogue line, worked example, and problem in fresh, original prose** so there is zero copyright or legal risk.
- **Never mention** any foreign national curriculum by name while following the 5-phase phenomenon-based inquiry standard.

## Procedure
1. Read `01-topic-map.md` and `sources/` thoroughly. Note physical/chemical constants, apparatus, experimental procedures, equations, and examiner pitfalls.
2. Design **Part I — The Unit Welcome Hub (`html/index.html`)**:
   - **Hero Section:** Eyebrow, unit display title, lede, **"Start guided tour"** (`[data-tour]`), **"Begin Lesson 1"** CTA, `.hero-meta` (`N lessons`, `practicals`, `3D labs`, `WAEC · NECO · JAMB`), and the live **3D Hero Lab (`#lab-canvas` / `window.StudyLab`)** with interactive HUD buttons and live readouts.
   - **Marquee:** 12 scrolling key terms/constants for the unit.
   - **Section 01 (`#mystery`):** The Unit Mystery Case File (narrative card + `.case-card` clues) and 3 Exam Weight `.stat` cards (`Marks at stake`, `Exam boards`, `Core laws`).
   - **Section 02 (`#journey`):** The Multi-Lesson Journey list (`<article class="lesson reveal is-live">` cards linking to `lessons/lesson-01/index.html` … `lessons/lesson-0N/index.html`, showing duration, tags, description, and `"Start lesson →"` CTA) + `.thread-note` explaining how spaced retrieval connects every lesson.
   - **Section 03 (`#explorer`):** Interactive Concept Sneak-Preview with 4 `.combo-tab` switcher buttons, dynamic SVG curve (`#combo-curve` + `#combo-marker`), and detail readout card (`#combo-title`, `#combo-jump`, `#combo-eq`, `#combo-ind`, `#combo-why`).
   - **Section 04 (`#master`):** 6 outcomes cards (`01`–`06`) + **6 Calculation Archetypes (`#archetypes`)** + `.formula-strip` of the unit's core equations + **3 Common Myths (`#myths`)** interactive 3D flip cards.
   - **Section 05 (`#method`):** The 5-Step Inquiry Loop (`1. Wonder → 2. Investigate → 3. Make sense → 4. Apply → 5. Reflect`) + What's inside every lesson (`#kit`) + Finale CTA.
3. Design **Part II — The Multi-Lesson Sequence (`Lesson 01` … `Lesson 0N`)**:
   Each lesson in the unit is a complete, self-contained **80-minute 5-Phase Phenomenon-Based Inquiry Lesson** (`lessons/lesson-0X/index.html`):
   - **Top Nav & Lesson Switcher:** Breadcrumb back to `../../index.html` (*Unit Overview*), links to sibling lessons (`L1`–`LN`), and prev/next lesson navigation in the footer.
   - **Phase 0 · Warm-up (`#donow` · 5 min):** 4 spaced-retrieval cards pulled from `retrieval-bank.js` (`l01` uses prerequisite cards `from: 0`; `l02`–`l0N` pull cards from earlier lessons `from: 1 .. k-1` with revisit links).
   - **Phase 1 · Wonder (`#story` & `#wonder` · 8–10 min):**
     - **3D Story Scene (`StoryStage`):** 5–6 animated 3D story beats advancing the Nigerian mystery thread for that lesson, plus collapsible transcript.
     - **Wonder Wall:** Guiding prediction prompt + 4 student seed questions.
   - **Phase 2 · Investigate (`#sort` & `#practical` · 25 min):**
     - **Interactive Sort / Classify Game:** 8–12 items sorted into 2–3 category bins.
     - **3D Virtual Lab Bench (`SceneKit`):** Step-by-step `.method` cards, interactive 3D apparatus (`#bench-stage`), interactive `#results-table`, collapsible `#expected` results & graph, and locked `.aq` Analysis Questions.
   - **Phase 3 · Make sense (`#concepts` & `#zoom` · 15 min):**
     - Definitions, `.eq` formula blocks, `.callout.big` rules, comparison tables (`.tbl`), interactive Pin/Scale Explorer (`#ph-explorer`), and **Second 3D Zoom Stage (`#zoom-stage`)** with live `.counters`.
   - **Phase 4 · Apply (`#examples`, `#bridge`, `#quiz` · 20 min):**
     - **3–4 Worked Examples (`.example`)**, **The Bridge (`#bridge`)** two-sample/mystery test + `.callout.big#big-idea`, and **Instant-Feedback Quiz (`#quiz`)**.
   - **Phase 5 · Reflect & Assignment (`#reflect` & `#assignment` · 10 min + 40 min home):**
     - **Self-Assessment Rubric (`1`–`4`)**, **Exit Ticket (`.aq`)**, **Blank-Page Recall (`#recall-box`)**, **Home Assignment** (Part A practical + Part B 30-mark structured questions with locked solutions), and collapsible **Teacher Notes (`#teacher-notes`)** with the 80-minute timetable (including the **5-minute active movement break** at `45–50 min`) and **Transversal Competences (`L1`–`L7`)**.
4. Outline the **Narrator Choreography Plan** (in Nigerian English `en-NG`) for the Welcome Hub (`welcome-narration.js`) and for each lesson (`lessons/lesson-0X/narration.js`).
5. Run the self-check in `references/teaching-standards.md` before saving `02-lesson.md`.
