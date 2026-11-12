#!/usr/bin/env node
/**
 * StudyPipe · Scaffold a new explainer-video kit (generated on the fly when a video needs a visual no kit provides).
 *
 *   node scripts/new-video-kit.mjs <id> "<what it shows>"
 *
 * Creates kits/video/<id>/
 *   kit.js            the kit: declares its states and camera close-ups, draws into a 420×420 SVG (edit this)
 *   demo.plan.cjs     a small video that exercises every state and close-up (edit this; QA runs on it)
 *   README.md         state table + close-ups (edit this; the director reads it)
 * Then: build + QA the demo, look at the contact sheets, add a row to kits/catalog.md → Video kits.
 * Contract and rules: .agents/skills/explainer-video/references/adding-a-kit.md
 */
import fs from "node:fs";
import path from "node:path";

const [id, ...rest] = process.argv.slice(2);
const title = rest.join(" ") || "New kit";
if (!id || !/^[a-z][a-z0-9-]*$/.test(id)) { console.error('usage: node scripts/new-video-kit.mjs <id> "<what it shows>"   (id: lowercase, e.g. heart, capillary-bed)'); process.exit(2); }
const BUILTIN = ["circuit", "cell", "toll", "graph", "area"];
if (BUILTIN.includes(id)) { console.error(`"${id}" is a built-in kit`); process.exit(1); }
const dir = path.join(process.cwd(), "kits", "video", id);
if (fs.existsSync(dir)) { console.error(`kits/video/${id} already exists`); process.exit(1); }
fs.mkdirSync(dir, { recursive: true });
const js = (s) => JSON.stringify(s);

fs.writeFileSync(path.join(dir, "kit.js"), `/* =========================================================
   StudyPipe explainer-video kit · ${id} — ${title}
   Contract: .agents/skills/explainer-video/references/adding-a-kit.md
   - Draw in a 420×420 SVG. Every frame is a pure function of (t, P): no timers, no Math.random at draw time.
   - Plans set state with { panel: '${id}', s: { ... } }; numeric states blend over 1.4 s via api.mixN.
   - Use api.tx() for every label (phones boost it; the camera scales it gently).
   ========================================================= */
(window.VIDEO_KITS = window.VIDEO_KITS || {})[${js(id)}] = {
  title: ${js(title)},
  // Every state a plan may set: name → what it means. The build rejects anything else.
  states: {
    level: "0–1: how far the process has gone (animates smoothly)",
    labels: "0/1: show the part labels",
    focus: "name of a part to ring, or null",
  },
  // Camera close-ups: name → [x, y, w, h] in the 420×420 drawing.
  focus: {
    left: [20, 60, 200, 300],
    right: [200, 60, 200, 300],
  },
  create(svg, api) {
    const { el, tx, mixN, ease, PAL } = api;
    // ---- build once ----
    const box = el("rect", { x: 40, y: 60, width: 340, height: 300, rx: 18, fill: "#1b222d", stroke: "#5c6675", "stroke-width": 3 }, svg);
    const bar = el("rect", { x: 70, y: 300, width: 0, height: 30, rx: 8, fill: PAL.green }, svg);
    const labels = el("g", {}, svg);
    tx("start", 90, 380, 16, "#cfd8d3", labels); tx("end", 330, 380, 16, "#cfd8d3", labels);
    const ring = el("circle", { r: 40, fill: "none", stroke: "#ffe08a", "stroke-width": 3, "stroke-dasharray": "6 6", opacity: 0 }, svg);
    const SPOTS = { left: [110, 210], right: [310, 210] };
    // ---- draw every frame ----
    return {
      draw(t, P) {
        const s = P.s, p = P.p, u = P.u;
        const level = mixN(p, s, "level", u);
        bar.setAttribute("width", (280 * level).toFixed(1));
        labels.setAttribute("opacity", mixN(p, s, "labels", u));
        const at = SPOTS[s.focus];
        ring.setAttribute("opacity", at ? (0.6 + 0.4 * Math.sin(t * 5)).toFixed(2) : 0);
        if (at) { ring.setAttribute("cx", at[0]); ring.setAttribute("cy", at[1]); }
      },
    };
  },
};
`);

fs.writeFileSync(path.join(dir, "demo.plan.cjs"), `// Demo for kit "${id}": exercises every state and close-up so QA can prove the kit on phone and desktop.
// Build: node .agents/skills/explainer-video/scripts/build.cjs kits/video/${id}/demo.plan.cjs
// QA:    node .agents/skills/explainer-video/scripts/qa.cjs kits/video/${id}/demo.html
module.exports = {
  meta: { title: ${js(title)}, subtitle: "Kit demo · ${id}", subject: "Kit demo", level: "QA", theme: "classic" },
  checks: [["demo has no numbers", 1, 1]],
  chapters: [
    { title: "Every state", cues: [
      { say: "This is the ${id} kit at rest.", ops: [{ clear: "Kit ${id}" }, { panel: "${id}", s: { level: 0, labels: 0, focus: null }, fresh: 1 }, { write: "a", tex: "\\\\text{at rest}" }] },
      { say: "Labels on.", ops: [{ panel: "${id}", s: { labels: 1 } }] },
      { say: "Halfway through the process.", ops: [{ panel: "${id}", s: { level: 0.5 } }] },
      { say: "All the way.", ops: [{ panel: "${id}", s: { level: 1, focus: "right" } }] },
    ] },
    { title: "Every close-up", cues: [
      { say: "Close up on the left part.", ops: [{ camera: "wide", focus: "left" }] },
      { say: "Close up on the right part.", ops: [{ camera: "kit", focus: "right" }] },
      { say: "And back out.", ops: [{ camera: "wide" }] },
    ] },
  ],
};
`);

fs.writeFileSync(path.join(dir, "README.md"), `# Video kit · ${id}

${title}

## States (\`{ panel: '${id}', s: { … } }\`)

| State | Meaning |
|---|---|
| \`level\` | 0–1: how far the process has gone |
| \`labels\` | 0/1: part labels |
| \`focus\` | part to ring, or \`null\` |

## Camera close-ups (\`{ camera, focus: '…' }\`)

\`left\`, \`right\`

## Used in

- (topics and lessons that use it)
`);

console.log(`Created kits/video/${id}/ (kit.js, demo.plan.cjs, README.md)
Next:
  1. Draw the kit in kits/video/${id}/kit.js (contract: .agents/skills/explainer-video/references/adding-a-kit.md)
  2. Make demo.plan.cjs show every state and close-up; update README.md
  3. node .agents/skills/explainer-video/scripts/build.cjs kits/video/${id}/demo.plan.cjs
  4. node .agents/skills/explainer-video/scripts/qa.cjs kits/video/${id}/demo.html   (look at every contact sheet)
  5. Add a row to kits/catalog.md → Video kits`);
