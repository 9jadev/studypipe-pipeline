---
name: lesson-designer
description: Writes the full lesson for a topic as structured markdown (02-lesson.md) using proven teaching standards — backward design, 5E, Gagné, cognitive load, worked examples, retrieval practice. Step 2 of the StudyPipe pipeline.
---

# Lesson Designer

Goal: turn the topic map and sources into the **master lesson** — the single source of truth that
every later format (HTML, print, Q&A context, translations) is generated from.

Before writing, read:
- `references/teaching-standards.md` — the standards you must follow (required).
- `references/lesson-template.md` — the exact output structure (required).
- `topics/<slug>/01-topic-map.md` and everything in `sources/`.

## Procedure
1. Read the sources for understanding. Note facts, apparatus, procedures, dates, values.
2. Plan backwards: objectives (from the map) → how they will be checked → what to teach.
3. Write the lesson following `lesson-template.md` section by section.
4. For every key idea write a **Scene** block (see template). A scene says what the student SEES
   and DOES, step by step, so the renderer can build it. Processes and histories are scenes too:
   e.g. "Hooke looks through his microscope at cork → zoom to the empty boxes he saw → label 'cells'".
   Never leave an important idea as text only.
5. Use Nigerian, everyday examples for hooks and applications.
6. Write narration as spoken English: short sentences, friendly, 120–160 words per section max.
7. Mark any fact you are not certain of with `[VERIFY]`.
8. Self-check against the checklist at the end of `teaching-standards.md` before saving.

## Rules
- Original wording only. No copied textbook paragraphs or transcript lines.
- One idea per section. If a section needs two scenes, split it.
- Define every new term the first time it appears (bold term + plain definition).
- Practical topics MUST include: apparatus, step-by-step method, results table format,
  calculations, precautions, sources of error — in the format WAEC/NECO expect.
- Reading level: a 14–17 year old Nigerian student; avoid idioms that don't translate.

## Output
`topics/<slug>/02-lesson.md` in the template structure. If sent back by the reviewer, fix only
the listed items and add a `## Revision notes` list at the bottom.
