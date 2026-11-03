# 02-lesson.md template

Keep headings and block names exactly as below — the renderer parses them.

````markdown
---
slug: ss2-chem-acid-base-titration
title: Acid–Base Titration
subject: Chemistry
class: SS2
exams: [WAEC, NECO, JAMB]
duration_min: 40
version: 1
---

## Objectives
- [Apply] Calculate the concentration of an acid from titration results.
- ...

## Prerequisites
- Moles and molar mass — refresher: one short worked line.

## Section: Hook
Narration: (spoken text, ≤160 words)

## Section: Explore — <name>
Narration: ...
Scene:
  id: titration-bench
  kit_hint: titration-bench          # existing kit id from catalog, or NEW
  type: interactive-3d               # static-svg | stepped-svg | interactive-2d | interactive-3d
  student_does:
    1. Rinse and fill the burette ...
    2. ...
  shows:
    - colour change at end point (pink → colourless)
  params: { acid: "HCl", base: "NaOH", indicator: "phenolphthalein" }
  check: "Student records three titres"

## Section: Explain — <idea>
Narration: ...
Key terms:
- **End point**: the moment the indicator changes colour ...
Scene: (optional, same format)

## Worked example 1
Problem: ...
Steps:
1. ... — because ...
Answer: ...

## Guided practice
Q: ...
Hint: ...
Answer: ...

## Misconceptions
- Wrong idea: ... | Why it's wrong: ... | Correct idea: ... | Scene: (optional)

## Practical write-up            (practical topics only)
Apparatus: ...
Method: ...
Results table: | Titration | Rough | 1st | 2nd | 3rd | ...
Calculations: ...
Precautions: ...
Sources of error: ...

## Summary
- 3–6 bullet key points

## Recall quiz
- 3–5 quick questions with answers

## Spaced review
- 2–3 questions from earlier related topics (name the topic)
````
