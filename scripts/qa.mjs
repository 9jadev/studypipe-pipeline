#!/usr/bin/env node
/**
 * StudyPipe QA — opens a multi-lesson unit (Welcome Hub + lessons/lesson-0X/) or single lesson
 * offline in a phone-sized Chromium, steps through sections and StudyNarrator spotlight choreography,
 * and reports console errors, network attempts, horizontal overflow, missing widgets,
 * and collapsed 3D canvases. Saves screenshots in qa/.
 *
 * Usage:
 *   node scripts/qa.mjs topics/<slug>              → checks Welcome Hub + all lessons in topics/<slug>/html/
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

async function checkScreen(label, scopeSelector = null) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
  if (overflow) add("WARN", label, "horizontal overflow at 360px width");
  const canvasInfo = await page.evaluate((sel) => {
    const root = sel ? document.querySelector(sel) : document;
    if (!root) return null;
    const c = root.querySelector("canvas");
    if (!c) return null;
    return { w: c.clientWidth, h: c.clientHeight };
  }, scopeSelector);
  if (canvasInfo && (canvasInfo.w < 50 || canvasInfo.h < 50)) {
    add("BLOCKING", label, `3D canvas is collapsed or hidden (${canvasInfo.w}×${canvasInfo.h})`);
  }
  const missing = await page.evaluate(() => /Activity missing|could not start/.test(document.body.innerText));
  if (missing) add("BLOCKING", label, "kit missing or failed to start");
  const shot = path.join(outDir, label.replace(/[^a-z0-9-]+/gi, "_") + ".png");
  await page.screenshot({ path: shot });
  return shot;
}

const shots = [];
let sectionCount = 0;
let lessonsChecked = 0;

async function checkEditorialLesson(lessonHtmlPath, prefix) {
  where = `${prefix}:load`;
  await page.goto(pathToFileURL(lessonHtmlPath).href);
  await page.waitForTimeout(1200);

  const engineCheck = await page.evaluate(() => ({
    hasNarrator: Boolean(window.StudyNarrator && document.querySelector(".narr-dock")),
    hasNarrationScript: Boolean(window.NARRATION && Array.isArray(window.NARRATION.script) && window.NARRATION.script.length >= 4),
    hasLessonKit: Boolean(window.LessonKit),
    quizRendered: document.querySelectorAll("#quiz-list .qcard").length,
    secCount: document.querySelectorAll(".l-sec").length
  }));
  if (!engineCheck.hasNarrator) add("BLOCKING", where, "StudyNarrator dock (.narr-dock) did not mount");
  if (!engineCheck.hasNarrationScript) add("BLOCKING", where, "window.NARRATION.script is missing or has fewer than 4 chapters");
  if (!engineCheck.hasLessonKit) add("BLOCKING", where, "window.LessonKit is missing");
  if (engineCheck.quizRendered < 5) add("BLOCKING", where, `#quiz-list rendered only ${engineCheck.quizRendered} questions (expected 6–12)`);

  // Hero screenshot
  where = `${prefix}:hero`;
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  shots.push(await checkScreen(`${prefix}-00-hero`, ".l-hero"));

  // Check key sections (or all sections if single lesson)
  const sections = await page.evaluate(() =>
    Array.from(document.querySelectorAll(".l-sec")).map((el, idx) => ({
      id: el.id || `sec-${idx + 1}`,
      index: idx
    }))
  );
  sectionCount += sections.length;

  for (let i = 0; i < sections.length; i++) {
    const s = sections[i];
    where = `${prefix}:${s.id}`;
    await page.evaluate((id) => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "instant", block: "start" });
    }, s.id);
    await page.waitForTimeout(450);
    // Save screenshots for key interactive sections or all if single-lesson
    if (prefix === "lesson" || ["story", "sort", "concepts", "neutralise", "zoom", "bridge", "quiz"].includes(s.id)) {
      shots.push(await checkScreen(`${prefix}-${String(i + 1).padStart(2, "0")}-${s.id}`, `#${s.id}`));
    }
  }

  // Test Narrator spotlight choreography
  where = `${prefix}:narrator`;
  await page.evaluate(() => {
    if (window.StudyNarrator) window.StudyNarrator.goTo(0, 0);
  });
  await page.waitForTimeout(700);
  const spotCheck = await page.evaluate(() => {
    const words = document.querySelectorAll(".narr-caption .w").length;
    const spotOn = document.querySelector(".narr-spot.on") !== null;
    return { words, spotOn };
  });
  if (spotCheck.words < 3) add("BLOCKING", where, "Narrator word spans (.narr-caption .w) did not render");
  shots.push(await checkScreen(`${prefix}-99-narrator-spotlight`));
  await page.evaluate(() => { if (window.StudyNarrator && window.StudyNarrator.close) window.StudyNarrator.close(); });
  lessonsChecked++;
}

if (isTopic) {
  const lessonsDir = path.resolve(arg, "html", "lessons");
  const hasMultiLessons = fs.existsSync(lessonsDir) && fs.statSync(lessonsDir).isDirectory();

  if (hasMultiLessons) {
    // 1. Check Unit Welcome Hub (html/index.html)
    where = "welcome:load";
    await page.goto(pathToFileURL(htmlFile).href);
    await page.waitForTimeout(1400);

    const welcomeCheck = await page.evaluate(() => ({
      hasHeroLab: Boolean(window.StudyLab && document.querySelector("#lab-canvas")),
      lessonCards: document.querySelectorAll("#journey .lesson").length,
      comboTabs: document.querySelectorAll("#explorer .combo-tab").length,
      mythCards: document.querySelectorAll("#myths .myth-card").length,
      hasNarrator: Boolean(window.StudyNarrator && document.querySelector(".narr-dock")),
      hasNarrationScript: Boolean(window.NARRATION && Array.isArray(window.NARRATION.script) && window.NARRATION.script.length >= 4)
    }));
    if (!welcomeCheck.hasHeroLab) add("BLOCKING", "welcome", "Welcome Hub 3D Hero Lab (window.StudyLab / #lab-canvas) missing");
    if (welcomeCheck.lessonCards < 2) add("BLOCKING", "welcome", `Welcome Hub #journey has only ${welcomeCheck.lessonCards} lesson cards`);
    if (welcomeCheck.comboTabs < 2) add("BLOCKING", "welcome", "Welcome Hub #explorer tabs missing");
    if (welcomeCheck.mythCards < 2) add("BLOCKING", "welcome", "Welcome Hub #myths flip cards missing");
    if (!welcomeCheck.hasNarrator || !welcomeCheck.hasNarrationScript) add("BLOCKING", "welcome", "Welcome Hub StudyNarrator tour missing");

    shots.push(await checkScreen("welcome-00-hero", ".hero"));

    for (const secId of ["mystery", "journey", "explorer", "master", "method"]) {
      where = `welcome:${secId}`;
      await page.evaluate((id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "instant", block: "start" });
      }, secId);
      await page.waitForTimeout(500);
      shots.push(await checkScreen(`welcome-${secId}`, `#${secId}`));
    }

    where = "welcome:narrator";
    await page.evaluate(() => { if (window.StudyNarrator) window.StudyNarrator.goTo(0, 0); });
    await page.waitForTimeout(700);
    shots.push(await checkScreen("welcome-99-narrator"));
    await page.evaluate(() => { if (window.StudyNarrator && window.StudyNarrator.close) window.StudyNarrator.close(); });

    // 2. Check each lesson in html/lessons/lesson-XX/index.html
    const lessonFolders = fs.readdirSync(lessonsDir)
      .filter((f) => fs.statSync(path.join(lessonsDir, f)).isDirectory())
      .sort();

    for (const folder of lessonFolders) {
      const lFile = path.join(lessonsDir, folder, "index.html");
      if (!fs.existsSync(lFile)) {
        add("BLOCKING", folder, `Missing index.html in lessons/${folder}/`);
        continue;
      }
      await checkEditorialLesson(lFile, folder);
    }
  } else {
    await page.goto(pathToFileURL(htmlFile).href);
    await page.waitForTimeout(1200);
    const mode = await page.evaluate(() => {
      if (document.querySelectorAll(".l-sec").length > 0) return "editorial";
      if (window.LESSON && window.LESSON.sections) return "legacy";
      return "none";
    });
    if (mode === "editorial") {
      await checkEditorialLesson(htmlFile, "lesson");
    } else if (mode === "legacy") {
      sectionCount = await page.evaluate(() => window.LESSON.sections.length);
      for (let i = 0; i < sectionCount; i++) {
        const id = await page.evaluate((n) => window.LESSON.sections[n].id || "s" + n, i);
        where = `section ${i + 1} (${id})`;
        await page.evaluate((n) => window.StudyPipePlayer && window.StudyPipePlayer.show(n), i);
        await page.waitForTimeout(900);
        shots.push(await checkScreen(`${String(i + 1).padStart(2, "0")}-${id}`));
      }
    } else {
      add("BLOCKING", "load", "No .l-sec editorial sections or window.LESSON found on page");
    }
  }

  const size = dirSize(path.dirname(htmlFile));
  if (size > 10 * 1024 * 1024) add("WARN", "package", `unit folder is ${(size / 1048576).toFixed(1)} MB (target < 10 MB incl. three.js & fonts)`);
} else {
  await page.goto(pathToFileURL(htmlFile).href);
  where = "kit demo";
  await page.waitForTimeout(1000);
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
  `lessons checked: ${lessonsChecked || 1}`,
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
