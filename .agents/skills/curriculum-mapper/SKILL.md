---
name: curriculum-mapper
description: Maps a WAEC/NECO/JAMB topic into a Multi-Lesson Unit with a Welcome Hub, unit-wide Nigerian anchor mystery thread, 4–10 progressive 5-phase inquiry lessons, spaced-retrieval map, transversal competences, and exam emphasis, writing 01-topic-map.md. Step 1 of the StudyPipe pipeline.
---

# Curriculum Mapper

Goal: decide **what** must be taught and tested, break the syllabus topic down into a **Multi-Lesson Unit (Unit Welcome Hub + 4 to 10 focused 80-minute lessons)**, and anchor the entire unit in a compelling **real-world Nigerian phenomenon or mystery** before anyone writes a lesson.

## Inputs
- `topics/<slug>/sources/` — textbook pages, past questions, syllabus extracts, notes, video links (`sources/links.md`).
- Official WAEC, NECO and JAMB syllabuses. If not in `sources/`, search the web for the syllabus requirements. If you cannot verify a point, mark it `[VERIFY]`.

## Non-Negotiable Copyright & Paraphrasing Rule
- **Never copy** syllabus bullet points, textbook sentences, online reference text, or past-question wording verbatim.
- Read external references and syllabuses for *conceptual scope only*, then **paraphrase and synthesise every objective, prerequisite, misconception, and scenario in 100% original language** to avoid any copyright or legal issues.

## Course Planning Standard (Multi-Lesson Phenomenon-Based Inquiry Unit)
Every syllabus topic is planned as a **complete multi-lesson unit** (modelled on a holistic, student-centred inquiry standard — never name any foreign national curriculum):
1. **Unit Welcome Hub (`html/index.html`):**
   - Introduces the unit with an interactive **3D Hero Lab** (`window.StudyLab`), the **Unit Mystery Case File**, **WAEC/NECO/JAMB Exam Weight stats**, the **Lesson-by-Lesson Journey Roadmap**, an **Interactive Concept Explorer** (tab switcher + dynamic SVG curve), **6 Calculation Archetypes**, **3 Myth-Buster 3D Flip Cards**, the **5-Step Inquiry Method**, and a guided **Welcome Narrator Tour** (`welcome-narration.js`).
2. **Multi-Lesson Breakdown (`lessons/lesson-01/` … `lessons/lesson-0N/`):**
   - Break the topic into **4 to 10 progressive lessons** (typically 5–6 lessons for a core Physics/Chemistry/Biology topic) so each lesson teaches **one focused conceptual + experimental arc** in 80 minutes without overwhelming the student:
     - **Lesson 01:** Opening the Unit Mystery + Foundational Concepts & Classification + First 3D Discovery Bench
     - **Lesson 02:** Quantitative Laws, Equations, Vector/Micro 3D Zoom & Foundational Calculations
     - **Lesson 03:** The Core WAEC/NECO Practical — Apparatus, Technique, 3D Virtual Bench & Tabulation Rules
     - **Lesson 04:** Data Analysis, Graphs, Slopes, Deductions, Precautions & Error Detective
     - **Lesson 05+:** Energy/Extensions, Real-World Applications, Solving the Unit Mystery & WAEC Paper 3 Exam Clinic
3. **Spaced Retrieval Thread (`retrieval-bank.js`):**
   - Lesson 1's *Do Now* retrieves prerequisite knowledge (`from: 0`).
   - Lesson $k$'s *Do Now* (`k ≥ 2`) pulls spaced-retrieval questions directly from Lessons $1 \dots k-1$ (`from: 1`, `from: 2`, etc.) with one-tap *"Revisit Lesson X →"* links.
4. **5-Phase Inquiry Arc inside EVERY Lesson (80-minute lesson blueprint):**
   - **0. Warm-up (Do Now · 5 min):** 4 spaced-retrieval flashcards from prerequisites or earlier lessons in the unit.
   - **1. Wonder (8–10 min):** 3D Story Scene advancing the unit's Nigerian mystery thread + *Wonder Wall* where students pin predictions before being told any answers.
   - **2. Investigate (20–25 min):** Hands-on classification/sort/match game + interactive 3D Virtual Lab Bench where students collect data first, record in a table, and answer locked analysis questions. *(Includes a 5-minute active movement break in the teacher timetable at the 45-minute mark).*
   - **3. Make sense (15 min):** Formal definitions, particle/vector 3D zoom-in model, comparison tables, and highlighted `.callout` rules connecting the student's lab observations to theory.
   - **4. Apply (20 min):** Step-by-step Worked Examples → returning to the Anchor Phenomenon (*The Bridge* interactive challenge) → WAEC/NECO/JAMB instant-feedback quiz questions.
   - **5. Reflect & Assignment (10 min + 40 min home):** Low-stakes self-rating rubric (`1 = Not yet`, `2 = With help`, `3 = On my own`, `4 = I could teach it`), Exit Ticket, Blank-Page Recall, and a two-part Home Assignment (Part A: practical home/community investigation; Part B: 30-mark structured exam paper with locked-until-attempted model solutions).
5. **Transversal Competences (select 2–3 per lesson from L1–L7):**
   - `L1` Thinking and learning to learn
   - `L2` Cultural interaction and self-expression
   - `L3` Managing daily life and safety
   - `L4` Multiliteracy (tables, graphs, instruments, symbols, and 3D models)
   - `L5` Digital and simulation competence
   - `L6` Working-life skills and entrepreneurship
   - `L7` Building a sustainable future

## Output: `01-topic-map.md`

```markdown
---
slug: ...
subject: Physics
class: SS2
exams: [WAEC, NECO, JAMB]
practical: true
lessons_count: 5
duration_per_lesson_min: 80
---
# Topic Map: <Title>
## 1. Paraphrased Syllabus Scope (WAEC | NECO | JAMB)
## 2. Unit Mystery Thread & 3D Story Cast
## 3. Unit Welcome Hub Specification (Hero 3D Lab, Explorer Tabs, 6 Calculation Archetypes, 3 Myths)
## 4. Multi-Lesson Breakdown (Lesson 01 to Lesson 0N — Title, Question, 3D Lab, 3D Zoom, Bridge, Spaced Retrieval Links)
## 5. Unit Learning Objectives (with Bloom level)
## 6. Prerequisites & Spaced Retrieval Matrix (Lesson 1 → Lesson N)
## 7. Transversal Competences (L1–L7)
## 8. Exam Emphasis & Chief Examiner Traps
## 9. Known Misconceptions
## 10. Sources Consulted (paraphrased)
```

Keep it concise (~3–4 pages) and 100% original.
