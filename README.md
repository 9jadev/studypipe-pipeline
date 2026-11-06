# StudyPipe Studio

An Antigravity content studio that turns WAEC / NECO / JAMB topics into **offline, interactive,
narrated 3D HTML lessons**. You add sources for a topic and the Antigravity agent runs the pipeline. You get a zip
in `exports/` to load into the StudyPipe distribution app.

```
sources ─► 1 map ─► 2 lesson ─► 3 questions ─► 4 review ─► 5 render ─► 6 kits ─► 7 QA ─► 8 package
          (markdown, reviewable)                (PASS/FIX)   (HTML)    (reused)  (phone)   (zip)
```

## 1. One-time setup (Mac)

1. Install **Node.js 18+** (https://nodejs.org).
2. Install **Antigravity** (https://antigravity.google): the desktop app/IDE, and the `agy` CLI
   if you want headless batch runs.
3. Unzip this folder, e.g. to `~/studypipe-studio`, then in Terminal:
   ```bash
   cd ~/studypipe-studio
   npm install
   npm run setup          # downloads the Chromium build that QA uses
   npm run qa:example     # should print "verdict: PASS"
   git init && git add -A && git commit -m "studio v0.1"   # optional but recommended
   ```
4. Open the folder as a workspace in Antigravity (app/IDE: open the folder; CLI: run `agy` inside it).
   The agent reads `GEMINI.md` and discovers the skills in `.agents/skills/` automatically.

## 2. Producing a topic

```bash
bash scripts/new-topic.sh ss2-chem-acid-base-titration
```
Put the textbook pages, past questions and notes in `topics/ss2-chem-acid-base-titration/sources/`
(add links in `sources/links.md`). Then tell the agent:

> Run topic ss2-chem-acid-base-titration

In interactive mode it stops after the review so you can approve the lesson markdown before rendering.
To review, open `topics/<slug>/html/index.html` in Chrome (use DevTools phone view) or on your phone.

**Giving feedback:** send screenshots and notes ("the label covers the burette tap"). The agent fixes them,
re-runs QA and packaging, and adds any general lesson to the right skill's rules.

## 3. Templates (themes)

Every unit uses one **theme**: fonts, colours and corner shape. The lesson structure is the same in every theme.
Open `themes/gallery.html` to compare them on a real lesson.

| Theme | Feel |
|---|---|
| `editorial-ink` (default) | Dark ink hub, warm paper, Fraunces/Manrope: magazine-like |
| `exam-classic` | Navy + white paper, red-pen accent, Source Serif/Atkinson Hyperlegible: WAEC revision |
| `green-lab` | Deep green console, lime highlights, Space Grotesk: bold science lab |
| `junior-play` | Indigo + sunny cream, Baloo 2/Nunito, bubbly corners: JSS |

```bash
node scripts/apply-theme.mjs --list                                # list themes
node scripts/apply-theme.mjs topics/<slug> green-lab               # switch a topic's theme
bash scripts/new-topic.sh <slug> junior-play                       # pick it at creation
node scripts/theme-preview.mjs --all                               # refresh previews + gallery
```
In `queue.md`: `- [ ] ss1-bio-cell-structure theme: junior-play`.

**New theme:** tell the agent *"design a new template"*. The `theme-designer` skill asks about audience, mood,
colours, fonts and shape, builds `themes/<id>/`, checks contrast, screenshots it on a real lesson and iterates
with you. Details: `themes/README.md`.

## 4. Batch / overnight

List topics in `queue.md`, then either tell the agent *"run the queue in batch mode"* or run it headless:
```bash
bash scripts/run-batch.sh
```
Results: `[x]` = done and awaiting review, `[!]` = needs you. See `run-log.md` and each topic's `status.md`.
See `docs/SERVER.md` for running batches on a VPS while your Mac is off.

## 5. What's inside

| Path | Purpose |
|---|---|
| `GEMINI.md` | Studio rules the agent reads every session |
| `.agents/skills/run-topic` | Conductor: runs the whole pipeline, single topic or queue |
| `.agents/skills/curriculum-mapper` | 1 · syllabus → objectives, sub-topics, exam emphasis |
| `.agents/skills/lesson-designer` | 2 · the master lesson (teaching standards + template in `references/`) |
| `.agents/skills/assessment-builder` | 3 · original exam-style questions with explanations |
| `.agents/skills/content-reviewer` | 4 · strict accuracy/coverage/standards review, PASS/FIX |
| `.agents/skills/lesson-renderer` | 5 · markdown → offline HTML (lesson shell in `assets/`) |
| `.agents/skills/theme-designer` | designs/edits visual themes with you; lists and switches them |
| `.agents/skills/kit-builder` | 6 · new reusable 3D/SVG kits (contract in `references/`) |
| `.agents/skills/html-qa` | 7 · phone-sized offline test + visual review |
| `.agents/skills/packager` | 8 · zip + manifest for the app |
| `.agents/skills/localiser` | later: adapt lessons for Ghana or French-speaking Africa |
| `themes/` | Visual templates + offline font library (`_fonts/`), `catalog.md`, `gallery.html` |
| `kits/` | Kit library + `catalog.md`; `pendulum` is the reference kit |
| `kits/_vendor/three-bundle.min.js` | three.js r160 + OrbitControls as one offline script |
| `topics/_example-simple-pendulum` | Tiny example of rendered output |
| `scripts/` | new-topic, QA (Playwright), package, manifest, batch runner |
| `docs/` | Server guide and the 8-topic demo pack list |

## 6. Making it yours

The skills are plain markdown, so edit them as you go. Tighten rules whenever you see the same mistake twice.
Your existing `sci-sim-3d` and `edu-svg-illustrator` skills can be merged into `kit-builder`
(copy their best rules and references into `.agents/skills/kit-builder/references/`).

## Important

- Sources are for understanding only. The pipeline writes original text and questions. Keep
  copyrighted PDFs out of Git (already in `.gitignore`).
- Check every lesson yourself before it ships. Accuracy is what you're selling.
