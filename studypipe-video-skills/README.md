# StudyPipe explainer video skills

Two skills that turn a lesson plan into a narrated, animated, offline HTML "video":

```
lesson plan / topic / past question
        │
        ▼
explainer-director ──► direction script (markdown) ──► human approval in the studio
        │                                                   │
        └──────────── after approval ─────────► lesson.plan.cjs (data + checks)
                                                            │
                                                            ▼
                                   explainer-video: validate → verify checks → build → QA
                                                            │
                                                            ▼
                                 lesson.html (one offline file) + QA contact sheet
```

- **explainer-director** plans the teaching: story, chapters, every spoken line, every board line, kit states, colour roles, theme, and a check for every number. It stops for approval before writing the plan.
- **explainer-video** builds and proves the result. It never invents content or drawing code; every visual comes from tested kits in its runtime.

## Install

**Claude Code:** copy both folders into `.claude/skills/` in your studio project (or `~/.claude/skills/` for all projects).

**OpenCode or another harness:** place both folders where your harness loads skills. If it doesn't load `SKILL.md` files, reference them from `AGENTS.md` ("For explainer videos, follow skills/explainer-director/SKILL.md, then skills/explainer-video/SKILL.md").

Then, once, inside `explainer-video/`:

```bash
npm install                       # KaTeX (pinned) for maths rendering
npx playwright install chromium   # optional, for the QA screenshots
```

Everything runs offline after that. The director runs the video skill's validator, so keep both folders side by side.

## Try it

```bash
cd explainer-video
node scripts/build.cjs examples/lesson-02.plan.cjs                # validate, verify 20 checks, build
node scripts/qa.cjs examples/lesson-02.html                       # screenshots + layout report
node ../explainer-director/scripts/plan-to-script.cjs examples/lesson-02.plan.cjs   # plan → readable script
```

## In the studio

Run the director and the video skill as two agents (or two steps of one agent) with an approval gate between them:

1. Author attaches the lesson plan and asks for a video.
2. Director agent writes the direction script; the studio shows it for review and edits.
3. On approval, the director writes the plan and runs `build.cjs --check-only` until it passes.
4. Video agent builds, runs QA, looks at the contact sheet, fixes layout in the plan, and returns the HTML.
5. The studio attaches the HTML to the lesson as its video. It reports `play`, `complete` and `continue` to the host app through `postMessage`.

Model choice: planning benefits most from a strong model (it decides the teaching and the numbers). Building and QA are mechanical and work well with cheaper models, because the scripts do the heavy lifting.

## What's in the box

| Path | Contents |
| --- | --- |
| `explainer-director/SKILL.md` | Director workflow, self-review checklist, hard rules |
| `explainer-director/references/` | Pedagogy, narration (spoken maths, units, chemistry), script template, plan schema, kits, themes |
| `explainer-director/scripts/plan-to-script.cjs` | Renders any plan back into a readable script |
| `explainer-video/SKILL.md` | Build, QA and fix workflow, hard rules |
| `explainer-video/runtime/` | The player shell and runtime: board, kits, themes, mascot, voice, controls |
| `explainer-video/scripts/` | `build.cjs` (validate, check, render, assemble) and `qa.cjs` (screenshots, report) |
| `explainer-video/references/` | Plan schema, kit catalogue, themes, how to add a kit |
| `*/examples/` | Completing the square (maths) and Lesson 02 internal resistance (physics): plans, scripts, built videos |

## Known limits

- Narration uses the device's speech engine; a natural Nigerian voice depends on the device. Pre-recorded or offline-generated audio (Piper, Kokoro) is the planned upgrade.
- Kits today: graph, area model, circuit bench, lead–acid cell, energy tollgate. Titration, qualitative analysis, germination and others are on the backlog in `references/kits.md`.
