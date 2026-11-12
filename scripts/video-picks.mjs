#!/usr/bin/env node
/**
 * StudyPipe · Which lessons get an explainer video?
 *
 *   node scripts/video-picks.mjs topics/<slug>            -> the scored table from 02-lesson.md + the resolved list
 *   node scripts/video-picks.mjs topics/<slug> --list     -> only the resolved list, e.g. "lesson-02,lesson-04" (for agents)
 *   node scripts/video-picks.mjs topics/<slug> --freeze   -> write the resolved list into status.md (after human approval)
 *
 * Resolution (status.md `videos:`):
 *   auto (default, or no line)  -> lessons recommended in 02-lesson.md "## 7. Explainer Video Plan":
 *                                  score >= 5, highest first, at most video_cap (status.md `video-cap:` > table > 3)
 *   all | none | lesson-02,...  -> exactly that (a human decision)
 * Every score must equal the sum of its +N/−N reasons; mismatches are reported (exit 1), never silently fixed.
 * Rubric: .agents/skills/lesson-designer/references/video-criteria.md
 */
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const topicArg = args.find((a) => !a.startsWith("--"));
if (!topicArg) { console.error("usage: node scripts/video-picks.mjs topics/<slug> [--list|--freeze]"); process.exit(2); }
const topic = path.resolve(topicArg);
const statusF = path.join(topic, "status.md"), lessonF = path.join(topic, "02-lesson.md");
const THRESHOLD = 5;

const status = fs.existsSync(statusF) ? fs.readFileSync(statusF, "utf8") : "";
const mode = ((status.match(/^videos:\s*([^\n#]*)/m) || [])[1] || "auto").trim() || "auto";
const capStatus = +((status.match(/^video-cap:\s*(\d+)/m) || [])[1] || 0);

// ---- parse the plan table
const md = fs.existsSync(lessonF) ? fs.readFileSync(lessonF, "utf8") : "";
const sec = md.split(/^## +7\.\s*Explainer Video Plan.*$/m)[1];
const rows = [], problems = [];
let capTable = 0;
if (sec) {
  const body = sec.split(/^## /m)[0];
  capTable = +((body.match(/^video_cap:\s*(\d+)/m) || [])[1] || 0);
  for (const line of body.split("\n")) {
    const c = line.split("|").map((x) => x.trim());
    if (c.length < 6 || !/^lesson-\d+$/.test(c[1])) continue;
    const [, lesson, score, rec, reasons, cover] = c;
    const pts = [...reasons.matchAll(/([+\-−])\s*(\d+)/g)].reduce((s, m) => s + (m[1] === "+" ? 1 : -1) * +m[2], 0);
    if (+score !== pts) problems.push(`${lesson}: score ${score} but its reasons add up to ${pts}`);
    const yes = /^(yes|y|✓|recommend)/i.test(rec);
    if (yes && pts < THRESHOLD) problems.push(`${lesson}: recommended with ${pts} points (needs ≥ ${THRESHOLD})`);
    if (!yes && pts >= THRESHOLD) problems.push(`${lesson}: scores ${pts} (≥ ${THRESHOLD}) but is not recommended — say why in its reasons or recommend it`);
    rows.push({ lesson, score: pts, yes, reasons, cover, examples: (cover.match(/example/gi) || []).length });
  }
}
const cap = capStatus || capTable || 3;

// ---- resolve
let picks, why;
if (/^none$/i.test(mode)) { picks = []; why = "status.md says none"; }
else if (/^all$/i.test(mode)) {
  const lessons = fs.existsSync(path.join(topic, "html", "lessons")) ? fs.readdirSync(path.join(topic, "html", "lessons")).filter((d) => /^lesson-\d+$/.test(d)) : rows.map((r) => r.lesson);
  picks = lessons.sort(); why = "status.md says all";
} else if (/^auto$/i.test(mode)) {
  if (!sec) { picks = []; why = `no "## 7. Explainer Video Plan" in 02-lesson.md yet — the lesson designer adds it (video-criteria.md)`; }
  else {
    const ranked = rows.filter((r) => r.yes && r.score >= THRESHOLD).sort((a, b) => b.score - a.score || b.examples - a.examples || a.lesson.localeCompare(b.lesson));
    picks = ranked.slice(0, cap).map((r) => r.lesson).sort();
    why = `auto: recommended lessons (score ≥ ${THRESHOLD}), top ${cap}` + (ranked.length > cap ? ` — dropped by the cap: ${ranked.slice(cap).map((r) => `${r.lesson} (${r.score})`).join(", ")}` : "");
  }
} else { picks = mode.split(/[,\s]+/).filter((x) => /^lesson-\d+$/.test(x)).sort(); why = "status.md lists them (human decision)"; }

if (args.includes("--list")) { console.log(picks.join(",")); process.exit(problems.length ? 1 : 0); }

if (args.includes("--freeze")) {
  if (problems.length) { console.error("Not frozen: fix the video plan first\n  " + problems.join("\n  ")); process.exit(1); }
  if (!fs.existsSync(statusF)) { console.error("no status.md"); process.exit(1); }
  const line = `videos: ${picks.length ? picks.join(",") : "none"}   # confirmed ${new Date().toISOString().slice(0, 10)} (was ${mode})`;
  const s = /^videos:.*$/m.test(status) ? status.replace(/^videos:.*$/m, line) : status.replace(/^(state:.*)$/m, `$1\n${line}`);
  fs.writeFileSync(statusF, s);
  console.log(line);
  process.exit(0);
}

console.log(`Explainer videos for ${path.basename(topic)}  ·  videos: ${mode}  ·  cap ${cap}\n`);
if (rows.length) {
  console.log("lesson     score  rec  reasons");
  for (const r of rows) console.log(`${r.lesson.padEnd(10)} ${String(r.score).padStart(5)}  ${r.yes ? "yes" : " no"}  ${r.reasons}${picks.includes(r.lesson) ? "   ← video" : ""}`);
  console.log("");
}
console.log(`Videos: ${picks.length ? picks.join(", ") : "none"}\n(${why})`);
if (problems.length) { console.log("\nProblems in the video plan:\n  " + problems.join("\n  ")); process.exit(1); }
