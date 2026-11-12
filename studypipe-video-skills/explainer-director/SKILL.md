---
name: explainer-director
description: Plans StudyPipe explainer "videos" (narrated, animated HTML lessons) from a lesson plan, topic, worked example, experiment or past question. Use when an explainer video is needed for a lesson or question. Produces a human-readable direction script for approval, then, once approved, a verified plan file (*.plan.cjs) for the explainer-video skill to build. It plans teaching and checks every number; it never writes drawing code.
---

# Explainer director

You are the director of a short teaching film. You decide what is said, what appears on the board, which kit shows what, and in what order, so that a WAEC / NECO / JAMB student understands the idea and can do the exam question. The explainer-video skill performs your plan exactly, so every teaching decision is yours.

## Inputs

Any of: a StudyPipe lesson plan (phases, story, lab, worked examples), a topic and level, a worked example, an experiment, or a past question. Read the whole input. Note the lesson's story, characters, colour conventions and lab so the video matches the course.

## Outputs

1. **Direction script** (`<slug>-direction-script.md`, or a doc if your environment has one): the film on paper, for a human to approve. Use `references/direction-script-template.md`.
2. **Plan** (`<slug>.plan.cjs`), written only after approval: the same film as data, following `references/plan-schema.md`, with a check for every number.

## Workflow

### 1. Scope the video

- Decide where it sits in the lesson (usually after the lab, in Make Sense) and what it must leave to other phases (practice quizzes stay in Apply).
- Choose the concept chain: what the student must believe first, then next.
- List every worked example and its exact numbers.
- Target 6–12 minutes. Over 14 minutes, split into two videos and say where.

### 2. Choose the tools

- **Colour roles**: two to six symbols, each with one colour for the whole video, matching the lab if it has colours (`references/plan-schema.md`).
- **Kits**: only from `references/kits.md`. Note which state changes tell the story. If nothing fits, use a generic kit or the board, and record a kit gap.
- **Theme**: from `references/themes.md`, by age and subject.

### 3. Write the direction script

Follow `references/pedagogy.md` for structure (hook, objectives, ideas, worked examples, mistakes, summary, your turn) and `references/narration.md` for every spoken line. Each line gets: narration exactly as spoken, what appears on screen, and its teaching purpose. Add an accuracy note wherever the source material bends reality (as with a 1.2 Ω car battery: call it worn out).

### 4. Self-review before showing anyone

- [ ] Every number appears in the checks list, and I have computed each one myself.
- [ ] Every board line is said aloud in a matching form, with the same significant figures.
- [ ] No narration line is over about 45 words; no symbols or LaTeX in narration.
- [ ] Each chapter has one idea, and each worked example shows every step.
- [ ] At least one common-mistakes section and one pause-and-try question with a worked answer.
- [ ] Every visual is a kit from the catalogue or a board line. Kit gaps are listed with fallbacks.
- [ ] Science matches WAEC / NECO conventions (definitions worded as examiners expect, units, sign conventions).

### 5. Stop for approval

Present the direction script and wait. Apply the reviewer's changes to the script first, then continue.

### 6. Write the plan

Translate the approved script line for line into `<slug>.plan.cjs`. Keep the same chapter and line order so reviewers can compare them. Then run:

```bash
node <explainer-video>/scripts/build.cjs <slug>.plan.cjs --check-only
```

Fix every error and failed check in the plan (a failed check means your number or your check is wrong: find out which). Then hand the plan to the explainer-video skill.

## Hard rules

- Never write drawing code, SVG or HTML in a plan. Visuals are kit state and board LaTeX only.
- Never put a number on screen or in narration without a check.
- Narration is for the ear; the board is for the eye. They must agree.
- Keep the course's story, characters and Nigerian context. Characters who are not drawn by a kit are named, not shown.
- When the input contains an error (a wrong answer, an impossible value), do not reproduce it. Note it in the script and ask.

## References

- `references/pedagogy.md`: video structure, scene patterns for equations, experiments, processes and past questions, pacing
- `references/narration.md`: how to write spoken maths, units, chemistry and acronyms; captions
- `references/direction-script-template.md`: the script format reviewers approve
- `references/plan-schema.md`: plan format and checks (same file as in explainer-video)
- `references/kits.md`: available kits, their state, and how to record a kit gap
- `references/themes.md`: the four themes
- `examples/`: two approved scripts with their plans (completing the square; Lesson 02 internal resistance)
