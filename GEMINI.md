# StudyPipe Studio

A content studio that turns WAEC / NECO / JAMB syllabus topics into **offline, interactive,
narrated 3D HTML lessons** for Nigerian secondary school students (JSS1–SS3).
The output of every run is a zip in `exports/` that the StudyPipe distribution app loads
into a phone WebView. Nothing here is a web app; we only produce content.

## Folder map

| Path | What lives there |
|---|---|
| `.agents/skills/` | The pipeline skills (one folder per skill) |
| `topics/<slug>/` | One folder per topic. `sources/` holds what the human uploads |
| `topics/_template/` | Copied by `scripts/new-topic.sh` to start a topic |
| `kits/` | Reusable 3D/SVG kits. **`kits/catalog.md` is the index — read it before building anything visual** |
| `kits/_vendor/three-bundle.min.js` | three.js r160 + OrbitControls as one classic script exposing `window.THREE` |
| `exports/` | Final zips, one per topic |
| `queue.md` | Topics waiting to be produced (batch runs read this) |
| `run-log.md` | Append-only log of every pipeline run |
| `scripts/` | Plain code: new topic, QA (Playwright), packaging, batch runner |
| `docs/` | Guides for the human (setup, server, demo-pack topic list) |

## The pipeline (skill `run-topic` conducts it)

Each step reads files and writes a file. Never rely on chat history between steps.

| Step | Skill | Reads | Writes |
|---|---|---|---|
| 1 | `curriculum-mapper` | `sources/`, syllabus (web) | `01-topic-map.md` |
| 2 | `lesson-designer` | `01`, `sources/` | `02-lesson.md` |
| 3 | `assessment-builder` | `01`, `02`, past questions | `03-questions.md` |
| 4 | `content-reviewer` | `01`, `02`, `03` | `04-review.md` (PASS / FIX) |
| 5 | `lesson-renderer` (+ `story-builder`, `narration-choreographer`) | approved `02`, `03`, `kits/catalog.md` | `html/` (`index.html` Welcome Hub, `assets/`, `retrieval-bank.js`, `lessons/lesson-01/` … `lesson-0N/`) |
| 6 | `kit-builder` | 3D `SceneKit` lab & zoom specs | `bench.js`, `zoom.js` / `kits/<kit-id>/` |
| 7 | `html-qa` | `html/` | `05-qa-report.md` + `qa/` screenshots |
| 8 | `packager` | `html/` | `exports/<slug>.zip` |

Every topic folder has `status.md` showing the current step and state.

## Non-negotiable rules

1. **Never copy — always paraphrase.** Never copy textbook, syllabus, online reference, past-question, or video-transcript text word for word. Read sources for conceptual understanding only, then paraphrase everything into 100% original explanations and brand-new exam-style questions to prevent any copyright issues.
2. **Multi-lesson phenomenon-based 5-phase inquiry unit.** Break every syllabus topic into a **Unit Welcome Hub (`html/index.html`) + 4–10 progressive 5-phase lessons (`html/lessons/lesson-01/` … `lesson-0N/`)** connected by a unit-wide Nigerian mystery thread and spaced retrieval (`retrieval-bank.js`). Inside every lesson, follow the 5-phase inquiry standard (*0. Do Now → 1. Wonder → 2. Investigate → 3. Make sense → 4. Apply → 5. Reflect & Assignment*), with 7 Transversal Competences (`L1`–`L7`), an active movement break at 45 min, low-stakes self-rating (`1–4`), and locked-until-attempted solutions — without naming any external national curriculum.
3. **Show, don't write on the side (with Nigerian English `en-NG` voice priority).** Every key idea, process, or phenomenon must be represented visually in 3D/interactive stages (`StoryStage`, `SceneKit`, `StudyLab`) and choreographed with `StudyNarrator` spotlighting, pointer cues, actions, and `"Your turn!"` interactive waits — with **Nigerian English (`en-NG`)** ranked `#1` in voice selection.
4. **Fully offline.** No CDN links, no external web fonts (use the bundled local `.woff2` `Fraunces`, `Manrope`, and `JetBrains Mono` in `assets/fonts/`), no `fetch()` of local files, no ES modules (`type="module"` breaks on `file://` in Android WebView). Inline data as classic JS scripts.
4. **Phone first.** Design for a 360×740 screen, touch input, low-end Android. Keep each lesson
   page light; no single asset over 1 MB without a reason written in `status.md`.
5. **Reuse before you build.** Check `kits/catalog.md` first. Build a new kit only when nothing fits,
   and then make it parametric so the next topic can reuse it.
6. **Nigerian context.** Use local examples (NEPA light, generator, garri, okada, market, kitchen).
   British spelling and SI units, as WAEC uses.
7. **Accuracy beats beauty.** If unsure of a fact, mark it `[VERIFY]` in the markdown and list it in
   `04-review.md`; never invent a value, date or reaction.
8. **Fail forward in batch mode.** If a step fails twice, write the reason in `status.md` and
   `run-log.md`, mark the topic `NEEDS-HUMAN`, and move to the next topic in `queue.md`.

## Human review points

- After step 4 (interactive mode): stop and ask the human to approve `02-lesson.md`.
- In batch mode do **not** stop; finish to step 8 and mark the topic `AWAITING-REVIEW`.
- When the human sends screenshots/feedback, fix the topic, re-run steps 7–8, and if the
  feedback is a general lesson ("labels must never cover moving parts") add it to the
  relevant skill's rules so it never happens again.
