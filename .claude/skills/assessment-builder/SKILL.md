---
name: assessment-builder
description: Writes original WAEC/NECO/JAMB-style questions with answers, explanations for every option, and Bloom levels into 03-questions.md. Step 3 of the StudyPipe pipeline.
---

# Assessment Builder

Goal: a question bank that checks every objective, matches exam style, and teaches through feedback.

## Inputs
`01-topic-map.md`, `02-lesson.md`, past questions in `sources/` (style reference only).

## Rules
- **Original questions only.** Study past-question style, numbers and traps, then write new ones.
  Never reproduce a past question's wording or exact numbers.
- Every objective in the map is covered by ≥2 questions.
- Mix: ~60% objective (4 options A–D), ~25% theory/short answer, ~15% practical/data
  (tables, graphs, readings) for practical topics.
- Bloom spread: ≤30% Remember; the rest Understand/Apply/Analyse (a few Evaluate).
- Every option gets a one-line explanation. Wrong options target real misconceptions.
- Calculations: show full working in the answer, with units and significant figures as WAEC expects.
- Total 12–20 questions per topic; mark 5 as `exam_ready: true` for the end-of-lesson test.

## Output: `03-questions.md`
Each question as a fenced block the renderer can parse:

````markdown
```question
id: q1
type: mcq            # mcq | short | practical
bloom: apply
objective: 1
exam_style: WAEC
exam_ready: true
stem: 25.0 cm3 of 0.10 mol/dm3 NaOH needed 20.0 cm3 of HCl. What is the concentration of the HCl?
options:
  A: 0.080 mol/dm3 | Divided the wrong way round.
  B: 0.125 mol/dm3 | Correct: moles NaOH = 0.0025; ratio 1:1; 0.0025 / 0.020 = 0.125.
  C: 0.20 mol/dm3 | Forgot to convert cm3 to dm3 correctly.
  D: 1.25 mol/dm3 | Decimal-place error.
answer: B
working: |
  n(NaOH) = 0.10 × 25.0/1000 = 0.0025 mol ...
```
````
