# The agent team

StudyPipe can run as one agent using all the skills (`run-topic`), or as a **team**: a director that delegates each
pipeline step to a specialist subagent. Each specialist starts with a clean context that holds only its own job, so it goes
deeper on that job. Independent work (kits, lessons) runs in parallel.

Definitions live in `.agents/agents/*.md` (Antigravity custom agents: YAML frontmatter + system prompt).

## Who does what

| Agent | Role | Skills it reads | Model | Writes |
|---|---|---|---|---|
| `studio-director` | Main agent. Plans, delegates, enforces gates, talks to you | run-topic, theme-designer | inherit | `status.md`, `run-log.md`, `queue.md`, `kits/catalog.md` |
| `curriculum-analyst` | 1 · syllabus → topic map | curriculum-mapper | pro | `01-topic-map.md` |
| `lesson-architect` | 2 · lesson design (+ review fixes) | lesson-designer | pro | `02-lesson.md` |
| `exam-setter` | 3 · questions (+ review fixes) | assessment-builder, math-solver | pro | `03-questions.md` |
| `accuracy-reviewer` | 4 · independent review, new each round | content-reviewer, math-solver | pro | `04-review.md` |
| `unit-renderer` | 5 · shell, Welcome Hub, retrieval bank, **build plan**; then math + theme | lesson-renderer, narration-choreographer, math-solver | inherit | `html/index.html`, `html/assets/**`, `05-build-plan.md` |
| `kit-engineer` ×K | 6 · one new reusable kit each, **parallel** | kit-builder | inherit | `kits/<kit-id>/**` |
| `code-snippet-builder` | 5c · code snippets & interactive traces | code-snippet-builder | inherit | `kits/code-snippet/**`, lesson code snippets |
| `lesson-builder` ×N | 5 · one lesson folder each, **parallel** | lesson-renderer, story-builder, narration-choreographer, math-solver, kit-builder, code-snippet-builder | inherit | `html/lessons/lesson-0X/**` |
| `video-director` ×V | 5v · direction script, then checked plan, one lesson each, **parallel** | explainer-director | pro | `06-videos/lesson-0X-direction-script.md`, `.plan.cjs` |
| `video-kit-engineer` ×K | 5v · builds a missing video kit on the fly from a kit request, **parallel** | explainer-video | inherit | `kits/video/<id>/**` |
| `video-builder` ×V | 5v · build, embed, 3-screen QA, one lesson each, **parallel** | explainer-video | inherit | `html/lessons/lesson-0X/video.html` + embed, plan layout only |
| `qa-inspector` | 7 · QA + visual review + fix routing | html-qa | inherit | `05-qa-report.md`, `qa/` |
| `release-packager` | 8 · zip + manifest | packager | flash | `exports/<slug>.zip` |

## Flow of one topic

```
director ─► curriculum-analyst ─► lesson-architect ─► exam-setter ─► accuracy-reviewer
                                        ▲                  ▲              │ FIX (max 2 loops)
                                        └──── fixes ───────┴──────────────┘
         ─► [you approve, interactive mode]
         ─► unit-renderer (phase A: shell + hub + 05-build-plan.md)
         ─► kit-engineer × new kits        (all at once)
         ─► lesson-builder × lessons       (all at once, each self-checks with qa.mjs --lesson)
         ─► unit-renderer (phase B: apply-math, apply-theme, navigation)
         ─► video-director × lessons (scripts start right after review; approved with the lesson)
         ─► video-builder × lessons (all at once: apply-video + 3-screen video QA)
         ─► qa-inspector ─ FAIL → issues routed to the owning lesson-builder / unit-renderer → QA again (max 2)
         ─► release-packager
```

Three design rules make parallel work safe:
1. **Files are the handoff.** Subagents never see the chat. The director's brief names exactly what to read and what to write.
2. **One owner per file.** Each lesson-builder owns only its `lessons/lesson-0X/`. Shared files belong to the unit-renderer
   or the director. `05-build-plan.md` fixes shared DOM ids and event names before anyone builds.
3. **Fixes go back to the author.** Finished subagents sit idle with their context, so the director *messages* the same
   lesson-builder with its QA issues instead of starting over. The reviewer is the exception: it is new every round, so it stays independent.

## Running it

```bash
~/.gemini/bin/agy --agent studio-director --model gemini-3.8-flash-medium   # then: "Run topic <slug>"
AGY_MODEL=gemini-3.8-flash-medium bash scripts/run-batch.sh   # overnight; uses the director automatically
STUDIO_SOLO=1 bash scripts/run-batch.sh            # old single-agent flow
node scripts/qa.mjs topics/<slug> --lesson lesson-03   # QA one lesson (what lesson-builders use)
```
In the Antigravity app, choose **studio-director** in the agent picker. The specialists don't appear there or in
`agy agents` because they are `mainAgent: false`; only the director can call them.

## Cost

A team uses more tokens than one agent: every subagent re-reads its skill and the relevant files, and a 5-lesson unit
spawns about 12–15 subagents. Content steps use `pro` because accuracy matters most there; packaging uses `flash`.
To economise, change `model:` in the specialist files (e.g. builders to `flash`). Parallelism stays inside one
topic; the queue is processed one topic at a time.

## Antigravity behaviour checked on this machine (agy 1.4.12)

- ✅ The director loads, lists all nine specialists, and successfully invoked one and relayed its reply.
- ⚠️ `skills:` in the frontmatter does **not** restrict skills: subagents see every workspace skill (name + description,
  full text loaded on demand). That is why each specialist's prompt starts with "read `.agents/skills/<x>/SKILL.md` first".
  The right skill is loaded either way.
- ✅ Builder subagents can create and edit files: `kit-engineer` reported `read_file`, `write_file`, `edit_file`, `run_command`
  (Antigravity's internal names for `view_file`, `write_to_file`, `replace_file_content`). Search tools are not exposed;
  subagents use `run_command` (`ls`, `grep`) instead.
- ✅ Specialists pinned to `model: pro` (e.g. `accuracy-reviewer`) also run, with their own quota.
- ⚠️ The CLI does **not** follow the model picked in the Antigravity app. It defaulted to Gemini 4 Argon. Pass `--model`
  (see `agy models`), e.g. `agy --agent studio-director --model gemini-3.8-flash-medium`, or set `AGY_MODEL` for `run-batch.sh`.
  `inherit` specialists use that model; `pro`/`flash` ones use their pinned tier.
