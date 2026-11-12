#!/usr/bin/env node
/**
 * StudyPipe QA — opens a multi-lesson unit (Welcome Hub + lessons/lesson-0X/) or single lesson
 * offline in a phone-sized Chromium, steps through sections and StudyNarrator spotlight choreography,
 * and reports console errors, network attempts, horizontal overflow, missing widgets,
 * and collapsed 3D canvases. Saves screenshots in qa/.
 *
 * Usage:
 *   node scripts/qa.mjs topics/<slug>              → checks Welcome Hub + all lessons in topics/<slug>/html/
 *   node scripts/qa.mjs topics/<slug> --lesson lesson-03 → checks only that lesson (no Welcome Hub);
 *                                                     report goes to qa/lesson-03/report.md, never 05-qa-report.md,
 *                                                     so parallel lesson-builders can self-check safely
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
const lessonFlag = process.argv.indexOf("--lesson");
const onlyLesson = lessonFlag > 0 ? process.argv[lessonFlag + 1] : null;
if (lessonFlag > 0 && !/^lesson-\d+$/.test(onlyLesson || "")) { console.error("--lesson needs a folder name like lesson-03"); process.exit(2); }
const htmlFile = path.resolve(isTopic ? path.join(arg, "html", "index.html") : arg);
const outDir = path.resolve(isTopic ? path.join(arg, "qa", ...(onlyLesson ? [onlyLesson] : [])) : path.join(path.dirname(arg), "qa"));
if (!fs.existsSync(htmlFile)) { console.error("Not found: " + htmlFile); process.exit(2); }
fs.mkdirSync(outDir, { recursive: true });

const issues = [];   // { level: "BLOCKING"|"WARN", where, msg }
const add = (level, where, msg) => issues.push({ level, where, msg });
let themeId = "n/a";

const browser = await chromium.launch({ args: ["--use-gl=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"] });
const context = await browser.newContext({
  viewport: { width: 360, height: 740 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true,
});
const page = await context.newPage();
page.setDefaultTimeout(120000);        // page.goto/screenshot default is 30 s, which fails when the machine is busy
page.setDefaultNavigationTimeout(120000);

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


// Layout sanity (phone width): catches stretched controls, e.g. a short label that is hundreds of px tall because a
// lesson class name collides with a shared stylesheet rule (the `.lab` hero-stage clash found in heart lessons 02/03/06/07).
async function checkLayoutSanity(prefix) {
  where = `${prefix}:layout`;
  const found = await page.evaluate(() => {
    const out = { tall: [], bars: [], long: [], bench: null };
    const skip = /^(CANVAS|IFRAME|SVG|TEXTAREA|VIDEO|IMG|PATH|G|CIRCLE|RECT|HTML|BODY)$/i;
    const label = (el) => (el.tagName.toLowerCase() + (el.className && typeof el.className === "string" ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".") : "") + (el.id ? "#" + el.id : ""));
    const visible = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.display !== "none" && cs.visibility !== "hidden"; };
    // 1. a leaf element with a few words of text must never be taller than ~160px
    for (const el of document.querySelectorAll("body *")) {
      if (skip.test(el.tagName) || el.closest("svg, canvas, .narr-dock, .narr-spot, .stage-canvas, .lab-fallback")) continue;
      if (el.children.length) continue;
      const t = (el.textContent || "").trim();
      if (!t || t.length > 40 || !visible(el)) continue;
      const h = el.getBoundingClientRect().height;
      if (h > 160) out.tall.push(`${label(el)} "${t.slice(0, 24)}" is ${Math.round(h)}px tall in a ${Math.round(el.getBoundingClientRect().width)}px-wide box (font ${getComputedStyle(el).fontSize})`);
    }
    // 2. control bars and readouts: blocking when a bar holds a lot of EMPTY space (children occupy far less than the
    //    bar), warning when it is simply long (many buttons wrapping) so the author can tighten it
    for (const el of document.querySelectorAll(".stage-bar, .bench-mode, .seg, .chips, .bench-readout, .stage-hint")) {
      if (!visible(el)) continue;
      const r = el.getBoundingClientRect();
      let top = Infinity, bottom = -Infinity;
      for (const k of el.querySelectorAll("*")) {
        if (!visible(k)) continue;
        const kr = k.getBoundingClientRect();
        if (kr.height > 0.9 * r.height && k.children.length) continue;   // a big wrapper is not "content"
        top = Math.min(top, kr.top); bottom = Math.max(bottom, kr.bottom);
      }
      const used = bottom > top ? bottom - top : 0;
      const empty = Math.round(r.height - used);
      if (used && empty > 120) out.bars.push(`${label(el)} is ${Math.round(r.height)}px tall but its content only needs ${Math.round(used)}px`);
      else if (r.height > 260) out.long.push(`${label(el)} is ${Math.round(r.height)}px tall`);
    }
    // 3. everything under the 3D canvas in the bench stage (controls, readouts) should stay short on a phone
    const st = document.querySelector("#bench-stage");
    const cv = st && st.querySelector(".stage-canvas");
    if (st && cv && visible(st)) {
      const total = st.getBoundingClientRect().height, canvasH = cv.getBoundingClientRect().height;
      out.bench = { controls: Math.round(total - canvasH), canvas: Math.round(canvasH) };
    }
    return out;
  });
  for (const m of found.tall.slice(0, 5)) add("BLOCKING", where, "stretched element: " + m + " — usually a class name colliding with a shared stylesheet rule (.lab/.stage/.hud/.hero), or large text wrapping in a narrow column");
  for (const m of found.bars.slice(0, 5)) add("BLOCKING", where, "stretched control bar: " + m);
  for (const m of found.long.slice(0, 3)) add("WARN", where, "tall control bar: " + m + " at 360px width; consider tightening");
  if (found.bench && found.bench.controls > 900) add("WARN", where, `controls under the 3D bench take ${found.bench.controls}px at 360px width (canvas ${found.bench.canvas}px); consider tightening`);
}


// Drag-and-drop sanity for the sort game (human report, 2026-11-08: "the drag and drop
// gets frozen, especially when you drag it at the edge of two particular groups").
// The bins usually sit far below the tray on a phone, so a drag can only reach them if
// the shared module auto-scrolls; and the seam between two bins must not be a dead zone.
async function checkSortDnD(prefix) {
  where = `${prefix}:sort`;
  const info = await page.evaluate(() => {
    const item = document.querySelector(".sort-item");
    const bins = Array.prototype.slice.call(document.querySelectorAll(".bin"));
    if (!item || bins.length < 2) return null;              // this lesson has no bin sort
    const wired = typeof window.SortDnD === "object" && typeof window.SortDnD.attach === "function";
    const ta = getComputedStyle(item).touchAction;
    // how far the learner must travel from the tray to the first bin
    const gap = Math.round(bins[0].getBoundingClientRect().top - item.getBoundingClientRect().bottom);
    // the widest seam between two neighbouring bins
    let seam = 0;
    for (let i = 1; i < bins.length; i++) {
      const a = bins[i - 1].getBoundingClientRect(), b = bins[i].getBoundingClientRect();
      seam = Math.max(seam, Math.round(b.top - a.bottom));
    }
    return { wired, ta, gap, seam, snap: (window.SortDnD && window.SortDnD.SNAP) || 0, vh: window.innerHeight };
  });
  if (!info) return;
  if (!info.wired) add("BLOCKING", where, "sort game found but window.SortDnD is missing — the per-lesson drag code froze when the bins were below the fold; load assets/js/sort-dnd.js before lesson.js");
  if (info.ta !== "none") add("BLOCKING", where, `.sort-item has touch-action: ${info.ta} (must be "none", or the browser steals the drag gesture)`);
  if (info.gap > info.vh && !info.wired) add("BLOCKING", where, `the first bin is ${info.gap}px below the tray (screen is ${info.vh}px) and nothing auto-scrolls, so a drag can never reach it`);
  if (info.seam > info.snap) add("BLOCKING", where, `the gap between two bins is ${info.seam}px but drops only snap within ${info.snap}px, so releasing between two groups silently does nothing`);
}

async function checkEditorialLesson(lessonHtmlPath, prefix) {
  where = `${prefix}:load`;
  await page.goto(pathToFileURL(lessonHtmlPath).href);
  await page.waitForTimeout(1200);

  const engineCheck = await page.evaluate(() => ({
    hasNarrator: Boolean(window.StudyNarrator && document.querySelector(".narr-dock")),
    hasNarrationScript: Boolean(window.NARRATION && Array.isArray(window.NARRATION.script) && window.NARRATION.script.length >= 4),
    hasLessonKit: Boolean(window.LessonKit),
    hasStudyMath: Boolean(window.StudyMath && document.querySelectorAll(".sp-math[data-latex]").length > 0),
    mathStepsCount: document.querySelectorAll(".m-step-note, .m-eq-note").length,
    quizRendered: document.querySelectorAll("#quiz-list .qcard").length,
    secCount: document.querySelectorAll(".l-sec").length
  }));
  if (!engineCheck.hasNarrator) add("BLOCKING", where, "StudyNarrator dock (.narr-dock) did not mount");
  if (!engineCheck.hasNarrationScript) add("BLOCKING", where, "window.NARRATION.script is missing or has fewer than 4 chapters");
  if (!engineCheck.hasLessonKit) add("BLOCKING", where, "window.LessonKit is missing");
  if (!engineCheck.hasStudyMath) add("BLOCKING", where, "window.StudyMath or rendered LaTeX (.sp-math[data-latex]) is missing");
  if (engineCheck.mathStepsCount < 3) add("BLOCKING", where, `StudyMath rendered only ${engineCheck.mathStepsCount} calculation explainer notes (expected >= 3)`);
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
    if (prefix === "lesson" || ["story", "sort", "concepts", "neutralise", "zoom", "examples", "bridge", "quiz"].includes(s.id)) {
      if (s.id === "examples") {
        await page.evaluate(() => {
          const calc = document.querySelector("#examples .m-calc-wrap, #examples .example");
          if (calc) calc.scrollIntoView({ behavior: "instant", block: "start" });
        });
        await page.waitForTimeout(250);
      } else if (s.id === "concepts") {
        await page.evaluate(() => {
          const eq = document.querySelector("#concepts .eq");
          if (eq) eq.scrollIntoView({ behavior: "instant", block: "center" });
        });
        await page.waitForTimeout(250);
      }
      shots.push(await checkScreen(`${prefix}-${String(i + 1).padStart(2, "0")}-${s.id}`, `#${s.id}`));
    }
  }

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  await checkLayoutSanity(prefix);
  await checkSortDnD(prefix);

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
    if (!onlyLesson) {
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
    // Theme fonts must actually load from assets/fonts (a typo in fonts.css silently falls back to system fonts).
    const fontCheck = await page.evaluate(async () => {
      const cs = getComputedStyle(document.documentElement);
      const out = [];
      for (const v of ["--font-display", "--font-body", "--font-mono"]) {
        const fam = cs.getPropertyValue(v).split(",")[0].trim().replace(/^["']|["']$/g, "");
        // Force-load: resolves [] when no @font-face matches; faces end "error" when the .woff2 is missing.
        const faces = fam ? await document.fonts.load(`16px "${fam}"`).catch(() => []) : [];
        out.push({ v, fam, ok: faces.length > 0 && faces.every((f) => f.status === "loaded") });
      }
      return out;
    });
    for (const f of fontCheck) if (!f.ok) add("BLOCKING", "theme", `${f.v} font "${f.fam || "(unset)"}" did not load — re-run node scripts/apply-theme.mjs ${arg}`);
    if (!welcomeCheck.hasHeroLab) add("BLOCKING", "welcome", "Welcome Hub 3D Hero Lab (window.StudyLab / #lab-canvas) missing");
    if (welcomeCheck.lessonCards < 2) add("BLOCKING", "welcome", `Welcome Hub #journey has only ${welcomeCheck.lessonCards} lesson cards`);
    if (welcomeCheck.comboTabs < 2) add("BLOCKING", "welcome", "Welcome Hub #explorer tabs missing");
    if (welcomeCheck.mythCards < 2) add("BLOCKING", "welcome", "Welcome Hub #myths flip cards missing");
    if (!welcomeCheck.hasNarrator || !welcomeCheck.hasNarrationScript) add("BLOCKING", "welcome", "Welcome Hub StudyNarrator tour missing");

    shots.push(await checkScreen("welcome-00-hero", ".hero"));
    await checkLayoutSanity("welcome");

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

    }

    // 2. Check each lesson in html/lessons/lesson-XX/index.html
    const lessonFolders = fs.readdirSync(lessonsDir)
      .filter((f) => fs.statSync(path.join(lessonsDir, f)).isDirectory())
      .filter((f) => !onlyLesson || f === onlyLesson)
      .sort();
    if (onlyLesson && !lessonFolders.length) add("BLOCKING", onlyLesson, `lessons/${onlyLesson}/ does not exist`);

    for (const folder of lessonFolders) {
      const lFile = path.join(lessonsDir, folder, "index.html");
      if (!fs.existsSync(lFile)) {
        add("BLOCKING", folder, `Missing index.html in lessons/${folder}/`);
        continue;
      }
      await checkEditorialLesson(lFile, folder);
    }

    // 3. Explainer videos (06-videos/lesson-0X.plan.cjs → lessons/lesson-0X/video.html, see scripts/apply-video.mjs)
    const plansDir = path.resolve(arg, "06-videos");
    for (const folder of lessonFolders) {
      const lFile = path.join(lessonsDir, folder, "index.html"), vFile = path.join(lessonsDir, folder, "video.html");
      const hasPlan = fs.existsSync(path.join(plansDir, `${folder}.plan.cjs`)), hasVideo = fs.existsSync(vFile);
      if (!hasPlan && !hasVideo) continue;
      where = `${folder}:video`;
      if (hasPlan && !hasVideo) { add("BLOCKING", where, `06-videos/${folder}.plan.cjs is not built — run node scripts/apply-video.mjs ${arg}`); continue; }
      if (!fs.existsSync(lFile) || !fs.readFileSync(lFile, "utf8").includes("<!-- studypipe:video -->")) { add("BLOCKING", where, `video.html exists but is not embedded in ${folder}/index.html — run node scripts/apply-video.mjs ${arg}`); continue; }
      await page.goto(pathToFileURL(lFile).href);
      await page.waitForTimeout(900);
      await page.evaluate(() => { const v = document.getElementById("lesson-video"); if (v) v.scrollIntoView({ block: "start" }); });
      await page.waitForTimeout(2600);
      const vf = page.frames().find((f) => f.url().endsWith(`${folder}/video.html`));
      if (!vf) { add("BLOCKING", where, "video iframe did not load"); continue; }
      const v = await vf.evaluate(() => ({ embedded: document.documentElement.classList.contains("embedded"), cues: (typeof DATA !== "undefined" && DATA.cues ? DATA.cues.length : 0), world: (document.getElementById("frame") || {}).dataset?.theme }))
        .catch((e) => ({ error: e.message }));
      const h = await page.evaluate(() => { const f = document.querySelector(".lesson-video-frame"); return f ? f.getBoundingClientRect().height : 0; });
      if (v.error) add("BLOCKING", where, "video page failed: " + v.error);
      else {
        if (!v.embedded) add("BLOCKING", where, "video never completed the handshake with the lesson (assets/js/video-embed.js missing or broken): speech would not use the app's TTS path");
        if (!v.cues) add("BLOCKING", where, "video has no narration cues");
        if (h < 200) add("BLOCKING", where, `video iframe is only ${Math.round(h)}px tall (size message not applied)`);
      }
      shots.push(await checkScreen(`${folder}-video`, "#lesson-video"));
      add("INFO", where, `explainer video OK: ${v.cues} lines, world ${v.world}, iframe ${Math.round(h)}px. Deep checks: node .agents/skills/explainer-video/scripts/qa.cjs ${path.relative(process.cwd(), vFile)}`);
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

  // Theme wiring: theme.css installed and linked last on every page (see themes/README.md).
  const unitDir = path.dirname(htmlFile);
  if (!fs.existsSync(path.join(unitDir, "assets", "css", "theme.css"))) {
    add("BLOCKING", "theme", `assets/css/theme.css missing — run node scripts/apply-theme.mjs ${arg}`);
  } else {
    const pages = [htmlFile, ...(fs.existsSync(path.join(unitDir, "lessons")) ? fs.readdirSync(path.join(unitDir, "lessons")).map((d) => path.join(unitDir, "lessons", d, "index.html")).filter((p) => fs.existsSync(p)) : [])];
    for (const p of pages) {
      const links = [...fs.readFileSync(p, "utf8").matchAll(/<link[^>]+rel="stylesheet"[^>]*href="([^"]+)"/gi)].map((m) => m[1]);
      if (!links.some((h) => h.endsWith("assets/css/theme.css"))) add("BLOCKING", "theme", `${path.relative(unitDir, p)} does not link assets/css/theme.css`);
      else if (!links[links.length - 1].endsWith("assets/css/theme.css")) add("WARN", "theme", `${path.relative(unitDir, p)}: theme.css is not the last stylesheet, so later CSS can override the theme`);
    }
    const themeLine = fs.readFileSync(path.join(unitDir, "assets", "css", "theme.css"), "utf8").match(/theme: ([a-z0-9-]+)/);
    if (themeLine) themeId = themeLine[1];
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
  `theme: ${themeId}`,
  `lessons checked: ${lessonsChecked || 1}`,
  `sections checked: ${sectionCount || "n/a"}`,
  "",
  "## Issues",
  issues.filter((i) => i.level !== "INFO").length ? issues.filter((i) => i.level !== "INFO").map((i) => `- **${i.level}** [${i.where}] ${i.msg}`).join("\n") : "- none",
  ...(issues.some((i) => i.level === "INFO") ? ["", "## Notes", issues.filter((i) => i.level === "INFO").map((i) => `- [${i.where}] ${i.msg}`).join("\n")] : []),
  "",
  "## Screenshots (review these visually)",
  shots.map((s) => `- ${path.relative(process.cwd(), s)}`).join("\n"),
  "",
].join("\n");

if (isTopic && onlyLesson) fs.writeFileSync(path.join(outDir, "report.md"), report);
else if (isTopic) fs.writeFileSync(path.join(arg, "05-qa-report.md"), report);
console.log(report);
process.exit(blocking.length ? 1 : 0);
