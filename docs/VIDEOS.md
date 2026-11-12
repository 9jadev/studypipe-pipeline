# Explainer videos

Each lesson can carry a **narrated, animated explainer video**: an offline HTML page that plays like a video, with a
teacher's voice, captions, an animated maths board and a science kit. It sits at the start of the lesson's **Make Sense**
phase (after the lab), styled like the rest of the unit.

## How a video is made

```
02-lesson.md (approved)
   │
   ▼  explainer-director (video-director agent)
06-videos/lesson-0X-direction-script.md   ← you approve this: every spoken line, what's on screen, why
   │
   ▼  explainer-director, after approval
06-videos/lesson-0X.plan.cjs              ← the same film as data; every number has a check
   │
   ▼  scripts/apply-video.mjs  (explainer-video / video-builder agent)
html/lessons/lesson-0X/video.html         ← embedded in the lesson, then QA on phone upright, sideways and desktop
```

- **Which lessons get one:** the lesson designer scores every lesson in `02-lesson.md` → *Explainer Video Plan*. It adds points
  for multi-step calculations (+3), frequently examined question types (+2), misconceptions (+2), invisible mechanisms (+2),
  graph reading, staged processes and derivations (+1 each), and subtracts points for practical-led (−3), recall/revision (−2)
  or repeat (−2) lessons. Lessons with **≥ 5 points** are recommended, **at most 3 per topic** (`video-cap:` in `status.md`).
  Full rubric: `.agents/skills/lesson-designer/references/video-criteria.md`.
- **Your say:** `videos: auto` (default) follows the recommendation; `all`, `none` or `lesson-02,lesson-04` overrides it.
  In interactive mode you see the scored table at the lesson approval and your confirmed choice is frozen into `status.md`.
  `node scripts/video-picks.mjs topics/<slug>` shows the scores and the result at any time.
- **Approval:** in interactive mode, direction scripts are shown at the same gate as the lesson. In batch mode they're
  built, and the topic waits as `AWAITING-REVIEW` with the scripts listed.
- **Accuracy:** a failed number check stops the build and goes back to the director. The builder may only change layout.

## Commands

```bash
node scripts/video-picks.mjs topics/<slug>                         # which lessons get a video, and why (--freeze after approval)
node scripts/apply-video.mjs topics/<slug>                         # build + embed every plan in 06-videos/
node scripts/apply-video.mjs topics/<slug> --lesson lesson-02      # one lesson
node scripts/apply-video.mjs topics/<slug> --check-only            # validate plans and number checks only
node .agents/skills/explainer-video/scripts/qa.cjs topics/<slug>/html/lessons/lesson-02/video.html   # 3-screen QA
node scripts/qa.mjs topics/<slug>                                  # unit QA, includes embed + handshake checks
node .agents/skills/explainer-director/scripts/plan-to-script.cjs <plan> --out script.md             # plan → script
```

## How it fits the unit

| Concern | How it's handled |
|---|---|
| **Phones** | Below 620 px wide the video becomes a column: board, kit, caption, controls, with fixed minimum sizes (maths 17 px, captions 14.5 px, boosted kit labels). Sideways and desktop use the 16:9 layout. QA checks all three screens. |
| **Look** | The video reads the unit's `theme.css` and bundled fonts. Its `unit` world is painted from the theme tokens, and `--video-world/-motion/-mascot` pick the world, motion and mascot. Switching the topic's theme restyles its videos with no rebuild. |
| **Weight** | KaTeX, the player runtime and CSS are shared once per unit in `html/assets/video/` (~400 KB). Each video is ~170 KB. |
| **Speech in the app** | The video asks the lesson page to speak for it (speech relay). That is the same path StudyNarrator uses, which the app's local server routes to native Flutter TTS. The lesson pauses its narrator while a video plays, and vice versa. |
| **Controls on phones** | While a video is on screen the lesson's floating narrator bar steps aside (it used to cover the video's control bar), and pressing Play scrolls the whole video into view below the top nav. A tap on hidden controls only reveals them; a tap on the picture never pauses. |
| **Camera** | Plans direct a virtual camera: `wide`, `kit` close-up, `board` shot, push-ins on parts of a kit (voltmeter, battery, a graph's gradient) and slow drifts. Shots are approved in the direction script (📷 lines) and are frame-exact when scrubbing. Guide: `.agents/skills/explainer-director/references/camera.md`. |
| **Fullscreen** | ⛶ makes the video take over the whole screen in landscape. The lesson page runs it: real fullscreen and a landscape lock where the device allows, otherwise the video is pinned over the screen and, on an upright phone, turned sideways. Exit with ⛶, Esc or the phone's Back button (stays in the lesson, same place). |
| **Lesson flow** | "Watched ✓" appears when the video completes (remembered on the device). The end card's *Continue to Apply* scrolls to the lesson's Apply phase. |
| **Kits on the fly** | When a video needs a visual no kit provides, the director writes a kit request and the `video-kit-engineer` builds it right then in `kits/video/<id>/` (`node scripts/new-video-kit.mjs <id>`), proves it with a demo video and three-screen QA, and the plan uses it. Kits are reusable and listed in `kits/catalog.md` → *Video kits*. First one: `heart`. |

## Still to check on a real device

The speech relay was tested in Chromium with a stand-in speech engine in the lesson page. On a phone, confirm in the
StudyPipe app that a video's narration is heard (en-NG voice) and that the lesson narrator stops when the video plays.
No app change should be needed: the app already injects its TTS shim into every lesson page it serves.
