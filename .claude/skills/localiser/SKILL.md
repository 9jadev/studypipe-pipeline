---
name: localiser
description: Adapts an approved lesson to another country's curriculum and/or language (e.g. Ghana WASSCE, French-speaking Africa), producing a new topic folder that then goes through review, rendering, QA and packaging. Use when asked to localise or translate a topic.
---

# Localiser (optional, for expansion beyond Nigeria)

## Inputs
An APPROVED topic `topics/<slug>/`, a target (e.g. `gh` Ghana WASSCE, `fr-sn` Senegal in French),
and that country's syllabus (in `sources/` or found on the web).

## Procedure
1. Create `topics/<slug>--<target>/` with `bash scripts/new-topic.sh <slug>--<target>`.
2. Map the target syllabus against `01-topic-map.md`: what to add, drop or reorder. Write `01-topic-map.md`.
3. Adapt `02-lesson.md` and `03-questions.md`: local examples, exam style, units/notation, language.
   Translate meaning, not word for word; keep scenes and kit ids the same (kits are reused).
4. Hand over to `content-reviewer` → `lesson-renderer` → `html-qa` → `packager` as normal.
5. For non-English lessons set `lang` in lesson-data (e.g. `"fr-FR"`) so narration uses the right voice;
   kit labels that contain words must be passed as params, never hard-coded.
