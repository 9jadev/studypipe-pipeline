# StudyPipe Studio

A Claude Code content studio that turns WAEC / NECO / JAMB topics into **offline, interactive,
narrated 3D HTML lessons**. You add sources for a topic and Claude runs the pipeline. You get a zip
in `exports/` to load into the StudyPipe distribution app.

```
sources ─► 1 map ─► 2 lesson ─► 3 questions ─► 4 review ─► 5 render ─► 6 kits ─► 7 QA ─► 8 package
          (markdown, reviewable)                (PASS/FIX)   (HTML)    (reused)  (phone)   (zip)
```

## 1. One-time setup (Mac)

1. Install **Node.js 18+** (https://nodejs.org).
2. Install **Claude Code**: use the Code section of the Claude desktop app (https://claude.ai/download),
   or the CLI with `curl -fsSL https://claude.ai/install.sh | bash`.
3. Unzip this folder, e.g. to `~/studypipe-studio`, then in Terminal:
   ```bash
   cd ~/studypipe-studio
   npm install
   npm run setup          # downloads the Chromium build that QA uses
   npm run qa:example     # should print "verdict: PASS"
   git init && git add -A && git commit -m "studio v0.1"   # optional but recommended
   ```
4. Open the folder in Claude Code (desktop app: choose the folder; CLI: run `claude` inside it).
   Claude reads `CLAUDE.md` and finds the skills in `.claude/skills/` automatically.

## 2. Producing a topic

```bash
bash scripts/new-topic.sh ss2-chem-acid-base-titration
```
Put the textbook pages, past questions and notes in `topics/ss2-chem-acid-base-titration/sources/`
(add links in `sources/links.md`). Then tell Claude:

> Run topic ss2-chem-acid-base-titration

In interactive mode it stops after the review so you can approve the lesson markdown before rendering.
To review, open `topics/<slug>/html/index.html` in Chrome (use DevTools phone view) or on your phone.

**Giving feedback:** send screenshots and notes ("the label covers the burette tap"). Claude fixes them,
re-runs QA and packaging, and adds any general lesson to the right skill's rules.

## 3. Batch / overnight

List topics in `queue.md`, then either tell Claude *"run the queue in batch mode"* or run it headless:
```bash
bash scripts/run-batch.sh
```
Results: `[x]` = done and awaiting review, `[!]` = needs you. See `run-log.md` and each topic's `status.md`.
See `docs/SERVER.md` for running batches on a VPS while your Mac is off.

## 4. What's inside

| Path | Purpose |
|---|---|
| `CLAUDE.md` | Studio rules Claude reads every session |
| `.claude/skills/run-topic` | Conductor: runs the whole pipeline, single topic or queue |
| `.claude/skills/curriculum-mapper` | 1 · syllabus → objectives, sub-topics, exam emphasis |
| `.claude/skills/lesson-designer` | 2 · the master lesson (teaching standards + template in `references/`) |
| `.claude/skills/assessment-builder` | 3 · original exam-style questions with explanations |
| `.claude/skills/content-reviewer` | 4 · strict accuracy/coverage/standards review, PASS/FIX |
| `.claude/skills/lesson-renderer` | 5 · markdown → offline HTML (lesson shell in `assets/`) |
| `.claude/skills/kit-builder` | 6 · new reusable 3D/SVG kits (contract in `references/`) |
| `.claude/skills/html-qa` | 7 · phone-sized offline test + visual review |
| `.claude/skills/packager` | 8 · zip + manifest for the app |
| `.claude/skills/localiser` | later: adapt lessons for Ghana or French-speaking Africa |
| `kits/` | Kit library + `catalog.md`; `pendulum` is the reference kit |
| `kits/_vendor/three-bundle.min.js` | three.js r160 + OrbitControls as one offline script |
| `topics/_example-simple-pendulum` | Tiny example of rendered output |
| `scripts/` | new-topic, QA (Playwright), package, manifest, batch runner |
| `docs/` | Server guide and the 8-topic demo pack list |

## 5. Making it yours

The skills are plain markdown, so edit them as you go. Tighten rules whenever you see the same mistake twice.
Your existing `sci-sim-3d` and `edu-svg-illustrator` skills can be merged into `kit-builder`
(copy their best rules and references into `.claude/skills/kit-builder/references/`).

## Important

- Sources are for understanding only. The pipeline writes original text and questions. Keep
  copyrighted PDFs out of Git (already in `.gitignore`).
- Check every lesson yourself before it ships. Accuracy is what you're selling.
