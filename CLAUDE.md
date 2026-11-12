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
| `themes/` | Visual templates (fonts, colours, shape). **`themes/catalog.md` lists them; `themes/gallery.html` previews them.** `themes/_fonts/` is the offline font library |
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
| 5 | `lesson-renderer` (+ `story-builder`, `narration-choreographer`) | approved `02`, `03`, `kits/catalog.md`, theme from `status.md` | `html/` (`index.html` Welcome Hub, `assets/`, `retrieval-bank.js`, `lessons/lesson-01/` … `lesson-0N/`) |
| 5v | `explainer-director` → `explainer-video` | approved `02`, `03` | `06-videos/lesson-0X-direction-script.md` + `.plan.cjs` → `html/lessons/lesson-0X/video.html` (embedded, via `scripts/apply-video.mjs`) |
| 6 | `kit-builder` | 3D `SceneKit` lab & zoom specs | `bench.js`, `zoom.js` / `kits/<kit-id>/` |
| 7 | `html-qa` | `html/` | `05-qa-report.md` + `qa/` screenshots |
| 8 | `packager` | `html/` | `exports/<slug>.zip` |

Every topic folder has `status.md` showing the current step, state and `theme:`.

**Explainer videos:** each lesson can carry a narrated, animated explainer video in its Make Sense phase
(`explainer-director` plans it and a human approves the direction script; `explainer-video` builds and proves it on phone
portrait, phone landscape and desktop). Which lessons get one is scored by the lesson designer (`02-lesson.md` § 7, rubric in
`lesson-designer/references/video-criteria.md`; ≥ 5 points, at most 3 per topic) and resolved by `scripts/video-picks.mjs`;
`status.md` → `videos: auto` (default) or the human's `all | none | lesson-02,…`. Details: `docs/VIDEOS.md`.

**Themes:** every unit is styled by one theme from `themes/`. The human picks it per topic (interactive), or
`queue.md` / `themes/default.txt` decides (batch). The `theme-designer` skill interviews the human and designs
new themes. Switch any topic with `node scripts/apply-theme.mjs topics/<slug> <theme-id>`.

## Agent team (subagents)

`.agents/agents/` defines a **studio-director** (main agent) and specialist subagents:
`curriculum-analyst`, `lesson-architect`, `exam-setter`, `accuracy-reviewer`, `unit-renderer`, `kit-engineer`,
`lesson-builder`, `code-snippet-builder`, `video-director`, `video-builder`, `qa-inspector` and `release-packager`. The director delegates each step with a self-contained brief
(subagents do not see the chat), runs kits and lessons **in parallel**, routes review/QA fixes back to the owner,
and is the only one that writes `status.md` / `run-log.md` / `queue.md` / `kits/catalog.md`.
Start it with `agy --agent studio-director` (or pick it in the app). Without it, the single-agent `run-topic` flow still works.
Details: `docs/AGENT-TEAM.md`.

## Non-negotiable rules

1. **Never copy — always paraphrase.** Never copy textbook, syllabus, online reference, past-question, or video-transcript text word for word. Read sources for conceptual understanding only, then paraphrase everything into 100% original explanations and brand-new exam-style questions to prevent any copyright issues.
2. **Multi-lesson phenomenon-based 5-phase inquiry unit.** Break every syllabus topic into a **Unit Welcome Hub (`html/index.html`) + 4–10 progressive 5-phase lessons (`html/lessons/lesson-01/` … `lesson-0N/`)** connected by a unit-wide Nigerian mystery thread and spaced retrieval (`retrieval-bank.js`). Inside every lesson, follow the 5-phase inquiry standard (*0. Do Now → 1. Wonder → 2. Investigate → 3. Make sense → 4. Apply → 5. Reflect & Assignment*), with 7 Transversal Competences (`L1`–`L7`), an active movement break at 45 min, low-stakes self-rating (`1–4`), and locked-until-attempted solutions — without naming any external national curriculum.
3. **Show, don't write on the side (with Nigerian English `en-NG` voice priority).** Every key idea, process, or phenomenon must be represented visually in 3D/interactive stages (`StoryStage`, `SceneKit`, `StudyLab`) and choreographed with `StudyNarrator` spotlighting, pointer cues, actions, and `"Your turn!"` interactive waits — with **Nigerian English (`en-NG`)** ranked `#1` in voice selection.
4. **Fully offline.** No CDN links, no external web fonts (only the theme's bundled `.woff2` files from `themes/_fonts/`, installed into `assets/fonts/` by `apply-theme.mjs`; style with theme tokens, never literal colours or font names), no `fetch()` of local files, no ES modules (`type="module"` breaks on `file://` in Android WebView). Inline data as classic JS scripts.
4. **Phone first.** Design for a 360×740 screen, touch input, low-end Android. Keep each lesson
   page light; no single asset over 1 MB without a reason written in `status.md`.
5. **Reuse before you build — and build every 3D kit to `HeartKit v2` anatomical/laboratory fidelity.** Check `kits/catalog.md` first. Build a new kit only when nothing fits, and then make it parametric so the next topic can reuse it. **Never approximate organs, cells, or lab apparatus as crude primitive stacks ("a group of cones for a heart" or generic cylinders for electrodes).** Study `kits/heart-circulation/heart-kit.js` (`HeartKit v2`) and `.agents/skills/kit-builder/SKILL.md`: use analytical shell deformation, `THREE.Shape` + `ExtrudeGeometry` with cavity holes for cut-aways, `CatmullRomCurve3` + `TubeGeometry` for vessels/tubing/leads, `LatheGeometry` for glassware/cells, procedural `CanvasTexture` + bump maps, and unmistakable subject-specific details (e.g., distinct anode vs. cathode plates with live copper deposition, $2:1$ $\text{H}_2:\text{O}_2$ gas bubble collection, and polarity wiring in electrolysis; real 3:1 LV/RV wall thickness and articulating valve cusps in cardiology).
5b. **Dimensionality Rule (3D Three.js vs. 2D Paper.js):**
    - **Volumetric / Spatial 3D Systems $\to$ Three.js (`window.THREE` + `window.SceneKit`):** Anatomical organs (heart, eye, kidney), volumetric lab apparatus (titration glassware, distillation, electrolytic cells), and spatial mechanical setups requiring orbit/rotation.
    - **Planar Surfaces & Mathematics $\to$ 2D Paper.js (`window.paper` via offline `assets/js/paper-core.min.js`):** Never force planar concepts into 3D meshes. All planar geometry, mathematics (**plane geometry, Euclidean proofs, triangle drawing and construction, circle theorems, coordinate geometry, vectors, angles**), 2D ray optics, and the **Welcome Hub Explore and Curve (`welcome-explorer.js` / `#combo-curve`)** MUST be rendered in 2D with Paper.js.
    - **Interactive Sorting:** Keep as pure HTML/CSS/DOM drag-and-drop (`sort-dnd.js`). Do not replace with Paper.js.
    - **100% Offline:** Paper.js is bundled offline at `kits/_vendor/paper-core.min.js` and copied to `html/assets/js/paper-core.min.js`. Zero CDN or external network requests.
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
