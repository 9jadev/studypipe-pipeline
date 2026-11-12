---
name: run-topic
description: Conducts the full StudyPipe pipeline for one topic or a batch from queue.md — mapping, lesson design, questions, review, rendering, kits, QA and packaging. Use when asked to "run topic", "produce", "run the pipeline" or "run the queue".
---

# Run Topic (pipeline conductor)

You coordinate the other skills. You do not write lesson content yourself.

> When you are running as the **studio-director** agent (`.agents/agents/studio-director.md`), keep this procedure but
> delegate each step to the specialist subagent named there, instead of running the skill yourself.

## Inputs

- A topic slug, e.g. `ss2-chem-acid-base-titration`, or the instruction "run the queue".
- Mode: **interactive** (default when a human is chatting) or **batch** (headless run, or the
  human says "batch"/"overnight").

## Procedure for one topic

1. If `topics/<slug>/` does not exist, run `bash scripts/new-topic.sh <slug>` and stop to ask the
   human for sources (interactive) or mark `NEEDS-HUMAN: no sources` (batch).
2. **Theme (visual template).** If `status.md` has no `theme:` line:
   - Interactive: run `node scripts/apply-theme.mjs --list`, point the human to `themes/gallery.html`, recommend one
     for the audience in a sentence, and ask which to use, or whether they want a new one designed (then follow the
     `theme-designer` skill before rendering). Record the choice as `theme: <id>` under `state:` in `status.md`.
   - Batch: use the `theme:` on the topic's `queue.md` line, else `themes/default.txt`. Never design a theme in batch mode.
   The human can switch later at any time: `node scripts/apply-theme.mjs topics/<slug> <id>`, then re-run QA + packaging.
3. Read `topics/<slug>/status.md`. Resume from the first step not marked done. Never redo a
   finished step unless the human asks or a later step sent it back.
4. Run each step by following that skill's SKILL.md exactly:
   1. `curriculum-mapper` → `01-topic-map.md` (Anchor phenomenon, 5-phase inquiry arc, L1–L7 competences, paraphrased syllabus scope)
   2. `lesson-designer` → `02-lesson.md` (Full 5-phase phenomenon-based lesson, 3D story beats, sort, 3D lab, concept zoom, worked examples, bridge, self-rating, 30-mark assignment)
   3. `assessment-builder` → `03-questions.md` (12 interactive MCQs + Part A home investigation + Part B 30-mark written paper with locked solutions)
   4. `content-reviewer` → `04-review.md`
      - If verdict is **FIX**: send the listed fixes back to `lesson-designer` / `assessment-builder`,
        then review again. Maximum 2 fix loops, then `NEEDS-HUMAN`.
      - Interactive mode: after PASS, show the human a 10-line summary and wait for approval.
   5. `lesson-renderer` → `html/` (uses `story-builder` for `story.js`, `kit-builder` for `bench.js`/`zoom.js`, and `narration-choreographer` for `narration.js`)
   5v. **Explainer videos** for the lessons resolved by `node scripts/video-picks.mjs topics/<slug> --list`.
      `videos:` in `status.md` is `auto` by default (the lesson designer's scored *Explainer Video Plan* in `02-lesson.md`:
      score ≥ 5, at most `video-cap`), or the human's `all` / `none` / `lesson-02,lesson-04`. Interactive: show the plan table
      at the lesson approval gate; after the human confirms or edits it, freeze it with `--freeze`. For each resolved lesson:
      `explainer-director` → `06-videos/lesson-0X-direction-script.md` (approved with the lesson in interactive mode) →
      `lesson-0X.plan.cjs`. If a script needs a visual no kit provides, the director writes `06-videos/kit-requests/<id>.md` and the kit is
      built on the fly first (`.agents/skills/explainer-video/references/adding-a-kit.md`: scaffold, draw, demo, three-screen QA) before
      the plan is written. Then `node scripts/apply-video.mjs topics/<slug>` builds and embeds them, and the
      `explainer-video` skill's three-screen QA proves them. Failed checks go back to the director, never edited by the builder.
   6. `html-qa` → `05-qa-report.md`. If it fails, send issues to `lesson-renderer`
      (max 2 loops), then `NEEDS-HUMAN`.
   7. `packager` → `exports/<slug>.zip`
5. After each step update `status.md` (step, state, time, one-line note) and run `node scripts/render-status.mjs topics/<slug>` so `status.html` updates automatically.
6. At the end append one line to `run-log.md`:
   `YYYY-MM-DD HH:MM | <slug> | AWAITING-REVIEW / NEEDS-HUMAN | theme: <id> | kits reused: n | kits new: n | note`

## Batch mode ("run the queue")

- Read `queue.md`. Process every line `- [ ] <slug>` top to bottom. An optional `theme: <id>` on the line picks the theme.
- Change `[ ]` to `[x]` when packaged, or `[!]` when `NEEDS-HUMAN`.
- Never stop to ask questions. Make the most reasonable choice and write it in `status.md`
  under **Assumptions**.

## status.md format

```
# <slug>
state: IN-PROGRESS | AWAITING-REVIEW | NEEDS-HUMAN | APPROVED
theme: editorial-ink
videos: auto
video-cap: 3
| step | state | updated | note |
|---|---|---|---|
| 1 map | done | 2026-11-01 22:10 | 6 sub-topics, WAEC+NECO+JAMB |
...
## Assumptions
## Human feedback log
```
