---
name: explainer-video
description: Builds StudyPipe explainer "videos": single offline HTML files that play like a video (narration, captions, chapters, animated LaTeX board, science kits, themes, mascot) from a director plan (*.plan.cjs). Use after the explainer-director skill has produced an approved plan, or to rebuild, fix, re-theme or QA an existing explainer. It never draws visuals freehand; every visual comes from the runtime's tested kits.
---

# Explainer video generator

You turn an approved plan into a finished video file, prove it is correct, and hand it back. The plan carries all the teaching decisions. Your job is to validate, build, check and report, and to send problems back to the director rather than inventing content.

## What the output is

One self-contained `.html` file (about 0.6 MB) that works offline and drops anywhere: a StudyPipe lesson zip, a Flutter WebView, or a browser.

- A video player: big play button, overlay controls that hide while playing, seek bar with chapter ticks, previous/next line, captions, mute, theme button, fullscreen. Keyboard: Space/K, ←/→, C, M, F, T.
- A narrated board: LaTeX lines that animate in, colour roles, highlights, boxed answers, notes, auto-fit for long lines.
- A kit panel on the right (graph, area model, circuit bench, battery cross-section, tollgate).
- A theme world (Safari Sunset, Green Vegetation, Ankara Fiesta, Classic) with mascot.
- Narration from the device's speech engine, preferring a Nigerian English voice, falling back to British then American English. The timeline waits for each spoken line, so picture and voice stay in sync.
- Host events via `postMessage`: `{ type: 'studypipe:video', event: 'play' | 'complete' | 'continue', next }`.

## Setup (once)

```bash
cd explainer-video
npm install                       # installs KaTeX (pinned). Playwright is optional, for QA
npx playwright install chromium   # only if you will run QA
```

Everything runs offline after installation.

## Workflow

### 1. Validate and verify

```bash
node scripts/build.cjs path/to/lesson.plan.cjs --check-only
```

This renders every LaTeX line, checks the plan against the schema, and runs every numeric check. If anything fails, **stop**: report the exact messages to the director (or the user) and wait for a corrected plan. Never change numbers, answers or narration yourself to make a check pass.

### 2. Build

```bash
node scripts/build.cjs path/to/lesson.plan.cjs [--out path/to/lesson.html]
```

### 3. QA

```bash
node scripts/qa.cjs path/to/lesson.html [--theme safari|vegetation|fiesta|classic]
# set CHROME_PATH=/path/to/chrome if Playwright's browser is not installed
```

It screenshots every moment that boxes an answer, changes a panel, or ends a chapter, checks for console errors, overflowing board lines and off-screen labels, and writes `qa-<name>/contact-sheet.png` and `report.json`.

**Always look at the contact sheet.** Automated checks catch overflow and errors; only looking catches a label sitting on a line, a graph that doesn't show what the narration says, or a board that says something different from the voice.

### 4. Fix loop

| Problem | Fix |
| --- | --- |
| Check failed, wrong number, wrong science | Back to the director. Do not edit |
| Board too crowded, scrolls too early | Add a `clear` and split the step across lines (plan edit) |
| Visual says something different from the narration | Adjust `at` timings or the kit state in the plan |
| Graph labels collide | Adjust item `pos`, `labelAt` or axis ranges in the plan |
| Kit renders wrongly for valid state | Runtime bug: fix the kit in `runtime/runtime.js`, then re-run QA on every example in `examples/` |
| Plan needs a kit that doesn't exist | Report the kit gap with the fallback the director chose. Build a kit only when asked (`references/adding-a-kit.md`) |

Rebuild and re-run QA until the report is clean and the contact sheet looks right.

### 5. Deliver

Return the `.html` file, the QA contact sheet, the running time, and any warnings. Mention which theme it uses and that viewers can switch themes.

## Hard rules

- All visuals come from `runtime/` kits and themes. Plans contain data only.
- The runtime is shared by every video. Change it only to fix a kit bug or add a kit or theme, and re-run QA on all examples afterwards.
- Everything on screen is a pure function of video time: pausing freezes it and scrubbing reproduces it exactly. No wall-clock timers or CSS transitions for timeline-driven content.
- The output must work offline: no network requests, no external scripts or fonts.

## References

- `references/plan-schema.md`: plan format, ops, checks, what validation rejects
- `references/kits.md`: every kit's state fields and example ops; kit gaps
- `references/themes.md`: the four themes and how to add one
- `references/adding-a-kit.md`: how to build a new kit
- `examples/completing-the-square.plan.cjs` (maths, area model, graph) and `examples/lesson-02.plan.cjs` (physics, circuit bench, cell, tollgate, graphs), with their built `.html` files
