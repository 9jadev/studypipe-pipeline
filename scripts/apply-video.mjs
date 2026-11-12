#!/usr/bin/env node
/**
 * StudyPipe · Build and embed explainer videos for a topic.
 *
 *   node scripts/apply-video.mjs topics/<slug>                    -> every plan in topics/<slug>/06-videos/
 *   node scripts/apply-video.mjs topics/<slug> --lesson lesson-02 -> one lesson
 *   node scripts/apply-video.mjs topics/<slug> --check-only       -> validate + verify plans, build nothing
 *
 * For each approved plan  topics/<slug>/06-videos/lesson-0X.plan.cjs  (written by the explainer-director):
 *   1. builds html/lessons/lesson-0X/video.html in --unit mode (shared html/assets/video/, unit fonts + theme)
 *   2. installs assets/js/video-embed.js + assets/css/lesson-video.css and gives StudyNarrator a pause() API
 *   3. embeds the video in the lesson's Make Sense section (or meta.section) between <!-- studypipe:video --> markers
 * Idempotent. A lesson whose plan was removed loses its embed and video.html.
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const ROOT = process.cwd();
const SKILL = path.join(ROOT, ".agents", "skills", "explainer-video");
const SHELL = path.join(ROOT, ".agents", "skills", "lesson-renderer", "assets", "lesson-shell", "assets");
const args = process.argv.slice(2);
const topicArg = args.find((a, i) => !a.startsWith("--") && args[i - 1] !== "--lesson");
const only = args.includes("--lesson") ? args[args.indexOf("--lesson") + 1] : null;
const checkOnly = args.includes("--check-only");
const die = (m) => { console.error("apply-video: " + m); process.exit(1); };
if (!topicArg) die("usage: node scripts/apply-video.mjs topics/<slug> [--lesson lesson-0X] [--check-only]");

const topic = path.resolve(topicArg), html = path.join(topic, "html"), vdir = path.join(topic, "06-videos");
if (!fs.existsSync(path.join(html, "assets", "css", "theme.css"))) die(`${topicArg}: render the unit and run apply-theme first (no html/assets/css/theme.css)`);
const plans = fs.existsSync(vdir) ? fs.readdirSync(vdir).filter((f) => /^lesson-\d+\.plan\.cjs$/.test(f)).filter((f) => !only || f.startsWith(only + ".")) : [];

const START = "<!-- studypipe:video -->", END = "<!-- /studypipe:video -->";
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const stripBlock = (s) => s.replace(new RegExp(`\\s*${START}[\\s\\S]*?${END}`, "g"), "");

function embed(lessonHtml, meta, durSec) {
  let s = stripBlock(lessonHtml);
  // where: meta.section (an id) or the first section whose phase label says "Make sense"
  let at = -1;
  const secRe = /<section[^>]*class="[^"]*\bl-sec\b[^"]*"[^>]*id="([^"]+)"[^>]*>([\s\S]*?)(?=<section\b|<\/main>|$)/g;
  for (let m; (m = secRe.exec(s));) {
    const isTarget = meta.section ? m[1] === meta.section.replace(/^#/, "") : /class="phase"[^>]*>[\s\S]{0,80}?Make sense/i.test(m[2].slice(0, 600));
    if (!isTarget) continue;
    const body = m[0], h2 = body.indexOf("</h2>");
    if (h2 < 0) continue;
    let off = h2 + 5;
    const intro = body.slice(off).match(/^\s*<p class="intro">[\s\S]*?<\/p>/);
    if (intro) off += intro[0].length;
    at = m.index + off;
    break;
  }
  if (at < 0) return { html: s, placed: false };
  const mins = Math.max(1, Math.round(durSec / 60));
  const block = `
        ${START}
        <figure class="lesson-video" id="lesson-video">
          <figcaption class="lesson-video-cap"><span class="chip" style="--c:var(--violet)"><i></i>Explainer video</span><b>${esc(meta.title)}</b><span class="lv-time">${mins} min · narrated · captions</span><span class="lv-done">Watched ✓</span></figcaption>
          <iframe class="lesson-video-frame" src="video.html" title="Explainer video: ${esc(meta.title)}" allow="fullscreen; autoplay" allowfullscreen loading="lazy"></iframe>
        </figure>
        ${END}`;
  s = s.slice(0, at) + block + s.slice(at);
  // stylesheet before theme.css (theme stays last), script after the narrator
  if (!s.includes("assets/css/lesson-video.css")) {
    const link = `<link rel="stylesheet" href="../../assets/css/lesson-video.css">`;
    s = /<link[^>]+assets\/css\/theme\.css[^>]*>/.test(s) ? s.replace(/(\s*)(<link[^>]+assets\/css\/theme\.css[^>]*>)/, `$1${link}$1$2`) : s.replace(/<\/head>/i, `  ${link}\n</head>`);
  }
  if (!s.includes("assets/js/video-embed.js")) s = s.replace(/<\/body>/i, `  <script src="../../assets/js/video-embed.js"></script>\n</body>`);
  return { html: s, placed: true };
}

let built = 0, failed = 0;
for (const f of plans) {
  const lesson = f.replace(".plan.cjs", ""), lessonDir = path.join(html, "lessons", lesson), page = path.join(lessonDir, "index.html");
  if (!fs.existsSync(page)) { console.error(`✗ ${lesson}: no html/lessons/${lesson}/index.html`); failed++; continue; }
  const out = path.join(lessonDir, "video.html");
  const r = spawnSync(process.execPath, [path.join(SKILL, "scripts", "build.cjs"), path.join(vdir, f), "--unit", html, "--out", out, ...(checkOnly ? ["--check-only"] : [])], { stdio: ["ignore", "pipe", "pipe"], encoding: "utf8" });
  const log = (r.stdout + r.stderr).trim().split("\n");
  if (r.status !== 0) { console.error(`✗ ${lesson}: build stopped (send to the explainer-director)\n  ` + log.filter((l) => /✗|error|stopped/i.test(l)).join("\n  ")); failed++; continue; }
  if (checkOnly) { console.log(`✓ ${lesson}: plan valid, all checks pass`); continue; }
  const data = JSON.parse(fs.readFileSync(out, "utf8").match(/const DATA = ([\s\S]*?);<\/script>/)[1]);
  delete require.cache[require.resolve(path.join(vdir, f))];
  const meta = require(path.join(vdir, f)).meta || {};
  const res = embed(fs.readFileSync(page, "utf8"), meta, data.dur);
  if (!res.placed) { console.error(`✗ ${lesson}: no "Make sense" section found (set meta.section to a section id)`); failed++; continue; }
  fs.writeFileSync(page, res.html);
  console.log(`✓ ${lesson}: video.html (${(fs.statSync(out).size / 1024).toFixed(0)} KB, ${(data.dur / 60).toFixed(1)} min) embedded`);
  built++;
}

if (!checkOnly) {
  // lessons that lost their plan: remove embed + video
  if (!only && fs.existsSync(path.join(html, "lessons"))) {
    for (const lesson of fs.readdirSync(path.join(html, "lessons"))) {
      if (plans.includes(lesson + ".plan.cjs")) continue;
      const page = path.join(html, "lessons", lesson, "index.html");
      if (fs.existsSync(page) && fs.readFileSync(page, "utf8").includes(START)) { fs.writeFileSync(page, stripBlock(fs.readFileSync(page, "utf8"))); fs.rmSync(path.join(html, "lessons", lesson, "video.html"), { force: true }); console.log(`- ${lesson}: plan removed, video unembedded`); }
    }
  }
  if (built) {
    fs.copyFileSync(path.join(SHELL, "js", "video-embed.js"), path.join(html, "assets", "js", "video-embed.js"));
    fs.copyFileSync(path.join(SHELL, "css", "lesson-video.css"), path.join(html, "assets", "css", "lesson-video.css"));
    const narr = path.join(html, "assets", "js", "narrator.js");
    if (fs.existsSync(narr)) {
      const s = fs.readFileSync(narr, "utf8");
      if (!/pause:\s*function/.test(s) && s.includes("close: close, minimize: minimize")) fs.writeFileSync(narr, s.replace("close: close, minimize: minimize", "pause: function () { stopSpeech(); setPlaying(false); },\n    isPlaying: function () { return !!state.playing; },\n    close: close, minimize: minimize"));
    }
  }
}
if (!plans.length) console.log(`no plans in ${path.relative(ROOT, vdir) || vdir}/ (lesson-0X.plan.cjs), nothing to build`);
process.exit(failed ? 1 : 0);
