---
name: assessment-builder
description: Writes 12 original WAEC/NECO/JAMB-style interactive MCQs (for window.LESSON_QUIZ) plus a 30-mark structured written & practical assignment (with locked solutions and marking schemes) into 03-questions.md. Step 3 of the StudyPipe pipeline.
---

# Assessment Builder

Goal: write a complete, exam-rigorous assessment suite that tests every learning objective, teaches through rich explanatory feedback, and includes both instant-feedback MCQs and a 30-mark structured written assignment.

## Inputs
`01-topic-map.md`, `02-lesson.md`, past questions in `sources/` (used for exam style and difficulty calibration only).

## Non-Negotiable Copyright & Paraphrasing Rule
- **100% Original Questions Only.** Study the structure, concepts, and common examiner traps in past WAEC/NECO/JAMB papers, then **invent brand-new scenarios, fresh numbers, and original stems**.
- Never copy or lightly edit a copyrighted past question or online reference problem.

## Output Structure in `03-questions.md`

### Part 1: 12 Interactive Quiz Questions (`window.LESSON_QUIZ`)
- 12 four-option (`A`–`D`) multiple-choice questions that populate `#quiz-list` via `LessonKit`.
- Every learning objective in `01-topic-map.md` must be tested by at least 2 questions.
- Bloom spread: max 3 `Remember` questions; at least 9 `Understand`, `Apply`, and `Analyse` questions (including calculations, experimental error directions, graph interpretation, and phenomenon application).
- Each question specifies:
  - `q`: question stem (may use `<strong>`, `<sub>`, `<sup>`)
  - `o`: array of 4 concise options
  - `a`: 0-based index of the correct option (`0`–`3`)
  - `e`: clear explanation of *why* the correct answer is right and why the main distractor is wrong. For every calculation question, include the full equation chain (`LHS = Formula = Substitution = Intermediate = Final Unit`) so `StudyMath` (`math-kit.js`) renders a step-by-step LaTeX calculation card with an explainer note underneath each step.
  - `src`: exam style tag (`"WAEC-style"`, `"NECO-style"`, `"JAMB-style"`, `"WAEC Practical"`)

### Part 2: Home Investigation & 30-Mark Written Assignment
Used to populate `#assignment` in the rendered lesson (with locked-until-attempted solutions):
- **Part A · Practical Home / Everyday Investigation:** A safe, hands-on observation or measurement task using everyday Nigerian household items, with a sample results table and marking guidance.
- **Part B · Written Exam Questions (30 marks total across 8 questions `b1`–`b8`):**
  - Mix of definitions (`3–4 marks`), conceptual explanations (`3–4 marks`), derivations/equations (`4–6 marks`), multi-step numerical calculations (`4–6 marks`), practical data/graph/error analysis (`4–6 marks`), and safety/precautions written in the **past tense** (`2–3 marks`).
  - Every question includes:
    - Question heading + mark badge (`e.g. 4 marks`)
    - Full step-by-step model solution with mark points `<b>(1)</b>`
    - Examiner's `mark-scheme` note highlighting common candidate errors to avoid.
