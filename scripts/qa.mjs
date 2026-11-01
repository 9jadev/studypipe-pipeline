#!/usr/bin/env node
/**
 * StudyPipe QA — opens a lesson (or a kit demo) offline in a phone-sized Chromium,
 * steps through every section, and reports console errors, network attempts,
 * horizontal overflow, missing kits and blank 3D canvases. Saves screenshots.
 *
 * Usage:
 *   node scripts/qa.mjs topics/<slug>              → checks topics/<slug>/html/index.html
 *   node scripts/qa.mjs kits/<kit-id>/demo.html    → checks one kit demo
 *
 * Output: <target>/05-qa-report.md (topics) or printed report (kits) + qa/ screenshots.
 * Exit code 1 when blocking issues are found.
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const arg = process.argv[2];
if (!arg) { console.error("usage: node scripts/qa.mjs topics/<slug> | kits/<id>/demo.html"); process.exit(2); }

const isTopic = !arg.endsWith(".html");
const htmlFile = path.resolve(isTopic ? path.join(arg, "html", "index.html") : arg);
const outDir = path.resolve(isTopic ? path.join(arg, "qa") : path.join(path.dirname(arg), "qa"));
if (!fs.existsSync(htmlFile)) { console.error("Not found: " + htmlFile); process.exit(2); }
fs.mkdirSync(outDir, { recursive: true });

const issues = [];   // { level: "BLOCKING"|"WARN", where, msg }
const add = (level, where, msg) => issues.push({ level, where, msg });

const browser = await chromium.launch({ args: ["--use-gl=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"] });
const context = await browser.newContext({
  viewport: { width: 360, height: 740 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true,
});
const page = await context.newPage();

let where = "load";
page.on("console", (m) => { if (m.type() === "error") add("BLOCKING", where, "console error: " + m.text()); });
page.on("pageerror", (e) => add("BLOCKING", where, "uncaught: " + e.message));
await context.route("**/*", (route) => {
  const u = route.request().url();
  if (u.startsWith("file:") || u.startsWith("data:") || u.startsWith("blob:")) return route.continue();
  add("BLOCKING", where, "network request attempted (must be offline): " + u);
  return route.abort();
});

await page.goto(pathToFileURL(htmlFile).href);
await page.waitForTimeout(1500);

async function checkScreen(label) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  if (overflow) add("WARN", label, "horizontal overflow at 360px width");
  const canvasInfo = await page.evaluate(() => {
    const c = document.querySelector("canvas");
    if (!c) return null;
    return { w: c.clientWidth, h: c.clientHeight };
  });
  if (canvasInfo && (canvasInfo.w < 50 || canvasInfo.h < 50)) add("BLOCKING", label, "3D canvas is collapsed or hidden");
  const missing = await page.evaluate(() => /Activity missing|could not start/.test(document.body.innerText));
  if (missing) add("BLOCKING", label, "kit missing or failed to start");
  const shot = path.join(outDir, label.replace(/[^a-z0-9-]+/gi, "_") + ".png");
  await page.screenshot({ path: shot });
  return shot;
}

const shots = [];
const sectionCount = await page.evaluate(() => (window.LESSON && window.LESSON.sections ? window.LESSON.sections.length : 0));
if (isTopic) {
  if (!sectionCount) add("BLOCKING", "load", "window.LESSON missing or has no sections");
  for (let i = 0; i < sectionCount; i++) {
    const id = await page.evaluate((n) => window.LESSON.sections[n].id || "s" + n, i);
    where = `section ${i + 1} (${id})`;
    await page.evaluate((n) => window.StudyPipePlayer && window.StudyPipePlayer.show(n), i);
    await page.waitForTimeout(900);
    shots.push(await checkScreen(`${String(i + 1).padStart(2, "0")}-${id}`));
  }
  const size = dirSize(path.dirname(htmlFile));
  if (size > 6 * 1024 * 1024) add("WARN", "package", `lesson folder is ${(size / 1048576).toFixed(1)} MB (target < 4 MB incl. three.js)`);
} else {
  where = "kit demo";
  await page.waitForTimeout(1000);
  // try pressing every button once to surface runtime errors
  const n = await page.locator("button").count();
  for (let i = 0; i < n; i++) { try { await page.locator("button").nth(i).click({ timeout: 1000 }); await page.waitForTimeout(400); } catch {} }
  shots.push(await checkScreen("kit-demo"));
}
await browser.close();

function dirSize(d) {
  let t = 0;
  for (const f of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, f.name);
    t += f.isDirectory() ? dirSize(p) : fs.statSync(p).size;
  }
  return t;
}

const blocking = issues.filter((i) => i.level === "BLOCKING");
const report = [
  `# QA report: ${arg}`,
  `date: ${new Date().toISOString().slice(0, 16).replace("T", " ")}`,
  `verdict: ${blocking.length ? "FAIL" : "PASS"}`,
  `sections checked: ${sectionCount || "n/a"}`,
  "",
  "## Issues",
  issues.length ? issues.map((i) => `- **${i.level}** [${i.where}] ${i.msg}`).join("\n") : "- none",
  "",
  "## Screenshots (review these visually)",
  shots.map((s) => `- ${path.relative(process.cwd(), s)}`).join("\n"),
  "",
].join("\n");

if (isTopic) fs.writeFileSync(path.join(arg, "05-qa-report.md"), report);
console.log(report);
process.exit(blocking.length ? 1 : 0);
