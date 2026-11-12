#!/usr/bin/env node
/**
 * StudyPipe · compile-math (scripts/compile-math.mjs)
 *
 * Makes every calculation in a unit typeset correctly and checked:
 *   1. installs KaTeX (assets/katex/) and the StudyMath v3 runtime (assets/js/study-math.js),
 *      and links them in each page (replacing the old regex math-kit.js);
 *   2. opens each page in Chromium and asks the runtime which chains it shows
 *      (worked-example <code>, solutions, quiz explanations, Do Now answers, banners, answers);
 *   3. parses each chain with scripts/lib/math-chain.mjs, checks every "=" numerically,
 *      renders every line with KaTeX (throwOnError), builds the step notes;
 *   4. writes <page dir>/math.js (window.STUDY_MATH) and topics/<slug>/qa/math-report.md.
 *
 * Usage:
 *   node scripts/compile-math.mjs topics/<slug> [--pages lesson-02,hub] [--check]
 * Exit code 1 when any chain has a wrong value or LaTeX that does not render (BLOCKING).
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { tryChain, chainsInProse } from "./lib/math-chain.mjs";

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const katex = require("katex");
const { chromium } = require("playwright");

const args = process.argv.slice(2);
const topic = path.resolve(args.find((a) => !a.startsWith("--")) || "");
const pagesArg = (args[args.indexOf("--pages") + 1] || "").split(",").filter(Boolean);
const checkOnly = args.includes("--check");
const html = path.join(topic, "html");
if (!fs.existsSync(path.join(html, "index.html"))) { console.error("usage: node scripts/compile-math.mjs topics/<slug> [--pages lesson-02,hub] [--check]"); process.exit(2); }

// ------------------------------------------------------------ pages
const pages = [{ id: "hub", file: path.join(html, "index.html"), rel: "" }];
const ldir = path.join(html, "lessons");
if (fs.existsSync(ldir)) for (const d of fs.readdirSync(ldir).sort()) {
  const f = path.join(ldir, d, "index.html");
  if (fs.existsSync(f)) pages.push({ id: d, file: f, rel: "../../" });
}
const chosen = pagesArg.length ? pages.filter((p) => pagesArg.includes(p.id)) : pages;

// ------------------------------------------------------------ install + link
function install() {
  const kdir = path.join(html, "assets", "katex");
  fs.mkdirSync(path.join(kdir, "fonts"), { recursive: true });
  const kdist = path.join(path.dirname(require.resolve("katex/package.json")), "dist");
  fs.copyFileSync(path.join(kdist, "katex.min.js"), path.join(kdir, "katex.min.js"));
  // woff2 only (Android WebView reads woff2); drop the woff/ttf fallbacks from the CSS
  const css = fs.readFileSync(path.join(kdist, "katex.min.css"), "utf8")
    .replace(/src:url\(fonts\/([^)]+)\.woff2\) format\("woff2"\)[^;}]*/g, 'src:url(fonts/$1.woff2) format("woff2")');
  fs.writeFileSync(path.join(kdir, "katex.min.css"), css);
  for (const f of fs.readdirSync(path.join(kdist, "fonts"))) if (f.endsWith(".woff2")) fs.copyFileSync(path.join(kdist, "fonts", f), path.join(kdir, "fonts", f));
  fs.copyFileSync(path.join(ROOT, "kits", "math-solver", "study-math.js"), path.join(html, "assets", "js", "study-math.js"));
  fs.copyFileSync(path.join(ROOT, "kits", "math-solver", "math.css"), path.join(html, "assets", "css", "math.css"));
}

function link(p) {
  let s = fs.readFileSync(p.file, "utf8");
  const before = s;
  const tags = `<script src="${p.rel}assets/katex/katex.min.js"></script>\n  <script src="math.js"></script>\n  <script src="${p.rel}assets/js/study-math.js"></script>`;
  if (!s.includes("assets/js/study-math.js")) {
    if (/<script[^>]+assets\/js\/math-kit\.js[^>]*><\/script>/.test(s)) s = s.replace(/<script[^>]+assets\/js\/math-kit\.js[^>]*><\/script>/, tags);
    else s = s.replace(/<\/body>/i, `  ${tags}\n</body>`);
  }
  if (!s.includes("assets/katex/katex.min.css")) {
    const l = `<link rel="stylesheet" href="${p.rel}assets/katex/katex.min.css">`;
    if (/<link[^>]+assets\/css\/math\.css[^>]*>/.test(s)) s = s.replace(/(<link[^>]+assets\/css\/math\.css[^>]*>)/, `${l}\n  $1`);
    else s = s.replace(/<\/head>/i, `  ${l}\n  <link rel="stylesheet" href="${p.rel}assets/css/math.css">\n</head>`);
  }
  if (s !== before) fs.writeFileSync(p.file, s);
}

// ------------------------------------------------------------ compile
const MATHY = /[0-9=÷×√²³⁻πθωλρΔΩ^_]|\b(sin|cos|tan)\b/;
function kcheck(tex, where, issues) {
  try { katex.renderToString(tex, { throwOnError: true, strict: "ignore" }); return true; }
  catch (e) { issues.push({ level: "error", where, msg: `LaTeX does not render: ${e.message}` }); return false; }
}

function compileEntry(text, where, issues, forceSteps) {
  const r = tryChain(text);
  if (!r || r.error) return { miss: r ? r.error : "unreadable" };
  const steps = (forceSteps || r.rels.length >= 2) && !r.equation && r.lines.length >= 2;
  const e = { t: r.tex };
  kcheck(r.tex, where, issues);
  if (steps) {
    e.s = r.lines.map((l) => ({ g: l.tag, x: l.tex, n: l.note }));
    for (const l of r.lines) { kcheck(l.tex, where, issues); for (const n of l.note) if (n[0] === "m") kcheck(n[1], where, issues); }
  }
  for (const i of r.issues) issues.push({ ...i, where, chain: text });
  // single-"=" numeric statements are still checked
  return { e };
}

const browser = await chromium.launch();
const report = [];
let blocking = 0;
if (!checkOnly) install();
for (const p of chosen) {
  if (!checkOnly) link(p);
  const page = await browser.newPage({ viewport: { width: 360, height: 740 } });
  const errs = [];
  page.on("pageerror", (e) => errs.push(String(e)));
  await page.goto(pathToFileURL(p.file).href + "?mathcollect", { waitUntil: "load" });
  await page.waitForTimeout(600);
  const got = await page.evaluate(() => (window.StudyMath && window.StudyMath.collect ? window.StudyMath.collect() : null));
  await page.close();
  if (!got) { report.push({ p, fatal: "StudyMath v3 is not loaded on this page" }); blocking++; continue; }

  const issues = [], misses = [], data = { c: {}, p: {} };
  for (const text of got.c) {
    if (!text || !MATHY.test(text)) continue;
    const r = compileEntry(text, p.id, issues, false);
    if (r.e) data.c[text] = r.e; else misses.push({ text, why: r.miss });
  }
  for (const text of got.p) {
    const found = chainsInProse(text);
    data.p[text] = found.map((f) => f.text);
    for (const f of found) {
      const r = compileEntry(f.text, p.id + " (prose)", issues, true);
      if (r.e) data.c[f.text] = r.e;
    }
  }
  for (const tex of got.l) kcheck(tex, p.id + " (authored LaTeX)", issues);

  const out = path.join(path.dirname(p.file), "math.js");
  if (!checkOnly) {
    fs.writeFileSync(out, "/* GENERATED by scripts/compile-math.mjs — do not edit. Every chain here was parsed and\n" +
      "   checked numerically at build time; edit the lesson text and re-run the script instead. */\n" +
      "window.STUDY_MATH = " + JSON.stringify(data) + ";\n");
  }
  const nErr = issues.filter((i) => i.level === "error").length;
  blocking += nErr;
  report.push({ p, issues, misses, chains: Object.keys(data.c).length, cards: Object.values(data.c).filter((e) => e.s).length, prose: got.p.length, errs, size: checkOnly ? 0 : fs.statSync(out).size });
}
await browser.close();

// ------------------------------------------------------------ report
const L = [`# Math report: ${path.relative(ROOT, topic)}`, `date: ${new Date().toISOString().slice(0, 16).replace("T", " ")}`,
  `verdict: ${blocking ? "FAIL" : "PASS"} (${blocking} wrong value or LaTeX error)`, "",
  "Levels: **error** = a value or LaTeX is wrong (BLOCKING) · **warn** = rounding drift up to 1 % · **jump** = more than three operations in one step (add a step) · **not typeset** = the parser could not read it, so it stays as plain text.", ""];
for (const r of report) {
  L.push(`## ${r.p.id}`);
  if (r.fatal) { L.push(`- **error**: ${r.fatal}`, ""); continue; }
  L.push(`- chains: ${r.chains} (step cards: ${r.cards}) · prose blocks scanned: ${r.prose} · math.js ${(r.size / 1024).toFixed(1)} KB`);
  for (const i of r.issues) L.push(`- **${i.level}**: ${i.msg}${i.chain ? `  \n  chain: \`${i.chain}\`` : ""}`);
  for (const m of r.misses) L.push(`- **not typeset**: \`${m.text}\` (${m.why})`);
  for (const e of r.errs) L.push(`- page error: ${e}`);
  L.push("");
}
fs.mkdirSync(path.join(topic, "qa"), { recursive: true });
fs.writeFileSync(path.join(topic, "qa", "math-report.md"), L.join("\n"));
console.log(L.join("\n"));
process.exit(blocking ? 1 : 0);
