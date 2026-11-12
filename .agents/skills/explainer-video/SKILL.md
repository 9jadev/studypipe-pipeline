---
name: explainer-video
description: Builds StudyPipe explainer "videos" (offline HTML pages that play like a video, with narration, captions, chapters, an animated LaTeX board, science kits, themes and a mascot) from an approved director plan (topics/<slug>/06-videos/lesson-0X.plan.cjs), embeds them in the lesson, and proves them on phone portrait, phone landscape and desktop. Use after the explainer-director has an approved plan, or to rebuild, fix, re-theme or QA an existing explainer. It never draws visuals freehand; every visual comes from the runtime's tested kits.
---

# Explainer video generator

You turn an approved plan into a finished video, prove it is correct on the screens students use, and hand it back. The plan carries all the teaching decisions. Your job is to validate, build, check and report, and to send problems back to the director rather than inventing content.

## What the output is

- **In a unit (normal)**: `topics/<slug>/html/lessons/lesson-0X/video.html` (~170 KB), embedded in the lesson's Make Sense section. The heavy parts (KaTeX, the player runtime and CSS) are shared once per unit in `html/assets/video/`. The video uses the unit's bundled fonts and theme tokens (`assets/css/fonts.css`, `theme.css`), so it matches the lesson and follows a theme switch without a rebuild.
- **Standalone** (outside a unit): one self-contained `.html` (~650 KB) with KaTeX, the runtime and a rounded font inlined.

The player:
- **Phone upright (< 620 px wide)**: a column of board, kit panel, caption, then an always-visible control bar. Minimum sizes are fixed in px: maths 17 px, captions 14.5 px, kit labels boosted.
- **Phone sideways and desktop**: the 16:9 frame, with the board and kit side by side. Short screens use the full height; captions stay on one line above the controls.
- **Captions** show long lines in timed chunks, never more than two lines on screen.
- **Controls**: big play button, overlay controls (hidden while playing, in landscape), seek bar with chapter ticks, previous/next line, captions, mute, theme, fullscreen. Keyboard: Space/K, ←/→, C, M, F, T.
- **Narration**: Nigerian English voice first. The timeline waits for each spoken line, so picture and voice stay in sync. When embedded, the video asks the lesson page to speak for it (speech relay). That is the same speech path as StudyNarrator, which the StudyPipe app routes to native TTS.
- **Host protocol** (`postMessage`): the video sends `{ type: 'studypipe:video', event }` with `hello`, `size`, `play`, `pause`, `speak`, `cancel`, `fullscreen`, `complete` and `continue`. The lesson's `assets/js/video-embed.js` replies with `{ type: 'studypipe:video-host', cmd }`: `host`, `spoken`, `pause` or `play`. It resizes the iframe, pauses the narrator and other videos, ticks "Watched ✓" and scrolls to Apply on continue.
- **Fullscreen in a lesson** is owned by the lesson page: ⛶ asks the host, which pins the iframe over the whole screen (real fullscreen + landscape lock where allowed; otherwise, on an upright phone, the iframe is rotated 90° so the video plays landscape). Back/Esc/⛶ exit. Never make the video request iframe fullscreen by itself when embedded.

## Setup (once, at the studio root)

`npm install` at the studio root installs KaTeX (pinned) and Playwright (for QA). Nothing is installed inside this skill folder.

## Workflow (StudyPipe)

### 1. Validate and verify

```bash
node scripts/apply-video.mjs topics/<slug> --lesson lesson-0X --check-only
```

This renders every LaTeX line, checks the plan against the schema, and runs every numeric check. If anything fails, **stop**: send the exact messages to the director and wait for a corrected plan. Never change numbers, answers or narration yourself to make a check pass.

### 2. Build and embed

```bash
node scripts/apply-video.mjs topics/<slug> --lesson lesson-0X     # or without --lesson for all plans
```

It runs `scripts/build.cjs <plan> --unit topics/<slug>/html --out html/lessons/lesson-0X/video.html` and embeds the video. Re-running is safe. The unit must already be rendered and themed (`apply-theme.mjs`).

### 3. QA on all three screens

```bash
node .agents/skills/explainer-video/scripts/qa.cjs topics/<slug>/html/lessons/lesson-0X/video.html --dir topics/<slug>/qa/video-lesson-0X
```

It runs on phone portrait 360×740, phone landscape 740×360 and desktop 1152×700, and captures every moment that boxes an answer, changes a panel or ends a chapter. It reports:
- console errors and overflowing board lines
- board lines shrunk below 12 px on phones
- kit labels under 8.5 px
- captions over their line limit
- captions touching the seek bar
- board/panel overlap

It writes `contact-sheet-<viewport>.png` and `report.json`. Then `node scripts/qa.mjs topics/<slug>` checks that the embed, handshake and iframe sizing work inside the lesson.

**Always look at the portrait contact sheet.** Automated checks catch overflow and errors. Only looking catches a label sitting on a line, a graph that doesn't show what the narration says, or a board that says something different from the voice.

### 4. Fix loop

| Problem | Fix |
| --- | --- |
| Check failed, wrong number, wrong science | Back to the director. Do not edit |
| "Board line shrunk / overflows" on phones | Split the step across two `write`s (`\phantom{x} = …` with a later `at`) or shorten the board words: a plan edit, keeping the maths identical. Tell the director what you changed |
| Board too crowded, scrolls too early | Add a `clear` and split the step across lines (plan edit) |
| Visual says something different from the narration | Adjust `at` timings or the kit state in the plan |
| Graph labels collide / "kit labels overlap" | Adjust item `pos`, `labelAt`, text `at` or axis ranges in the plan |
| A camera close-up crowds or crops labels | Widen the `focus` region, frame several graph items together (`focus: ['a', 'b']`), or use a data box. Camera *choices* are the director's: tell them if a shot can't work |
| Kit renders wrongly for valid state, or a kit label too small | Runtime bug: fix the kit in `runtime/runtime.js`, then re-run QA on both `examples/` plans (standalone) and every unit video |
| Plan needs a kit that doesn't exist | It is built on the fly from the director's kit request (`references/adding-a-kit.md`, video-kit-engineer), then the plan is rebuilt |

Rebuild and re-run QA until every viewport's report is clean and the contact sheets look right.

### 5. Deliver

Report the video path, running time, QA result per viewport (and contact sheet paths), warnings, and that it follows the unit's theme.

## Standalone use (outside a unit)

```bash
node .agents/skills/explainer-video/scripts/build.cjs <plan.cjs> [--out file.html] [--check-only]
node .agents/skills/explainer-video/scripts/qa.cjs <file.html> [--theme unit|safari|vegetation|fiesta|classic] [--viewports portrait,landscape,desktop]
```

## Hard rules

- All visuals come from `runtime/` kits and themes. Plans contain data only.
- The runtime is shared by every video. Change it only to fix a kit bug or add a kit or theme, then rebuild and re-QA the examples and every unit video. Each topic gets a fresh copy in `html/assets/video/` on its next `apply-video` run.
- Everything on screen is a pure function of video time: pausing freezes it and scrubbing reproduces it exactly. No wall-clock timers or CSS transitions for timeline-driven content.
- The output must work offline: no network requests, no external scripts or fonts. Unit videos use only the unit's bundled fonts.
- **Controls must always be tappable.** Any layer over the picture that fades out (title card, end card, toasts) gets `pointer-events: none` while invisible, and the control bar stays the top layer. QA's "control not tappable" check enforces this on every screen; never weaken it.
- **Touch rules.** On a phone, a tap while the controls are hidden only reveals them; it never presses a hidden button or pauses. A tap on the picture never pauses (only the Play button does). In portrait the controls never auto-hide. Mouse users can click the picture to play or pause.
- Plans are executable JavaScript: only build plans written by the studio's director agent, never an untrusted file.

## References

- `references/plan-schema.md`: plan format, ops, checks, what validation rejects (the single shared copy; the director uses it too)
- `references/kits.md`: every kit's state fields and example ops; kit gaps (also indexed in `kits/catalog.md`)
- `references/themes.md`: the unit world, the four classic worlds, and how to add one
- `references/adding-a-kit.md`: building a kit on the fly (kit request → `node scripts/new-video-kit.mjs` → demo → QA); plug-in kits live in `kits/video/<id>/`
- `examples/completing-the-square.plan.cjs` (maths: area model, graph) and `examples/lesson-02.plan.cjs` (physics: circuit bench, cell, tollgate, graphs), with their built standalone `.html` files
