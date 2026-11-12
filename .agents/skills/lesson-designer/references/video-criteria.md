# Explainer video criteria

A narrated explainer video is the most expensive thing a lesson can have (a director, a builder, a human approval and
about 10 minutes of a student's time), so it goes only where a moving, narrated picture teaches something the lesson page
alone teaches less well. The lesson designer scores **every** lesson with this rubric and records the result in
`02-lesson.md` → `## 7. Explainer Video Plan`. `scripts/video-picks.mjs` reads that table.

## Score each lesson

Add the points that apply. Write each one in the *reasons* column as `+N label` / `−N label`, so the total can be checked.

| Points | Criterion | How to tell |
|---|---|---|
| **+3** | Multi-step calculations | The lesson has ≥ 2 worked examples with ≥ 3 steps each (substitution, rearranging, simultaneous equations, unit conversion) |
| **+2** | Frequently examined | It teaches a question type that `01-topic-map.md` marks as high weight / recurring in WAEC, NECO or JAMB |
| **+2** | Misconception to undo | There's a common wrong idea or examiner-reported pitfall the lesson must correct (e.g. "a voltmeter across a battery always reads the EMF") |
| **+2** | Invisible mechanism | The key idea happens where students can't see it: charges, ions, energy transfer, fields, particles, inside a cell or organ. A moving picture shows it |
| **+1** | Graph reading | Students must read or interpret a graph: gradient, intercepts, area, shape |
| **+1** | Staged process | An ordered sequence students mix up (a cycle, a procedure, stages of a reaction or of growth) |
| **+1** | Derivation | A formula is built or rearranged step by step and students must follow each line |
| **−3** | Practical-led | The lesson is mainly the 3D practical/bench, and a video would repeat what the student just did |
| **−2** | Recall or revision | Mostly vocabulary, definitions to memorise, or revision of earlier lessons |
| **−2** | Repeats another video | Same concept chain as a video already recommended for an earlier lesson in this unit |

## Decide

1. **Recommend** a lesson when its score is **≥ 5**.
2. **Cap:** keep only the highest-scoring `video_cap` lessons (default **3** per topic; the human may raise it in `status.md`).
   Ties go to the lesson with more worked examples, then the earlier lesson.
3. **At least one** video per unit when any lesson scores ≥ 5; **zero** is fine when none does.
4. **Feasibility:** note the kit the video would use (`kits/catalog.md` → *Video kits*) or "board only". A missing kit is not
   a reason to skip (the director uses a fallback and records a kit gap), but say so in *video would cover*.
5. For every lesson, recommended or not, write one line on **what the video would cover** (or why not), so the human can
   overrule you quickly.

## Format in `02-lesson.md`

```markdown
## 7. Explainer Video Plan
video_cap: 3

| lesson | score | recommend | reasons | video would cover |
|---|---|---|---|---|
| lesson-01 | 1 | no | +2 invisible mechanism · +2 misconception · −3 practical-led | — the bench already shows Ohm's law live |
| lesson-02 | 9 | yes | +3 multi-step calculations · +2 frequently examined · +2 misconception · +2 invisible mechanism | lost volts, E = I(R + r), V–I graph, two-readings method · kits: circuit, cell, toll, graph |
```

`node scripts/video-picks.mjs topics/<slug>` checks that every score equals the sum of its reasons, applies the cap, and
prints the resolved list.

## How the pipeline uses it

| `videos:` in `status.md` | Lessons that get a video |
|---|---|
| `auto` (default) | The recommended lessons from this table (score ≥ 5, top `video_cap`) |
| `all` · `none` · `lesson-02,lesson-04` | Exactly that: a human decision that overrides the table |

In interactive mode the table is shown at the lesson approval gate. The human confirms or edits it, and the director freezes
the confirmed list into `status.md` with `node scripts/video-picks.mjs topics/<slug> --freeze`.
