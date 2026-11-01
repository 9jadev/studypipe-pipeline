---
name: curriculum-mapper
description: Maps a WAEC/NECO/JAMB topic into objectives, sub-topics, prerequisites and exam emphasis, writing 01-topic-map.md. Step 1 of the StudyPipe pipeline.
---

# Curriculum Mapper

Goal: decide exactly **what** must be taught and tested for this topic before anyone writes a lesson.

## Inputs
- `topics/<slug>/sources/` — textbook pages, past questions, syllabus extracts, notes, video links
  (`sources/links.md`).
- The current WAEC, NECO and JAMB syllabuses. If not in `sources/`, search the web for the
  official syllabus. If you cannot access it, say so in the map and mark the coverage `[VERIFY]`.

## Procedure
1. Identify the class level (JSS1–SS3), subject and which exams test this topic.
2. List the syllabus wording for the topic from each exam body, side by side.
3. Merge into one list of **sub-topics** in teaching order (follow the recommended textbook order
   when it is sensible).
4. Write **learning objectives** with measurable Bloom verbs (state, identify, calculate, explain,
   plot, compare, predict, design). Tag each objective with its Bloom level.
5. List **prerequisites** the student must already know, each with a one-line refresher idea.
6. **Exam emphasis**: from past questions in `sources/` (and Chief Examiners' reports if supplied),
   note which sub-topics appear often, typical question types (objective, theory, practical),
   and where candidates commonly lose marks.
7. **Visual opportunities**: for each sub-topic, one sentence on what should be *seen or done*
   in 3D/SVG (feeds the renderer).
8. List known **misconceptions** for this topic.

## Output: `01-topic-map.md`

```
---
slug: ...
subject: Chemistry
class: SS2
exams: [WAEC, NECO, JAMB]
practical: true
---
# Topic map: <title>
## Syllabus coverage (WAEC | NECO | JAMB)
## Sub-topics (teaching order)
## Learning objectives (with Bloom level)
## Prerequisites + refresher ideas
## Exam emphasis and where marks are lost
## Visual opportunities per sub-topic
## Known misconceptions
## Sources used
```

Keep it under ~2 pages. No lesson prose here.
