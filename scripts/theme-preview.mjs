#!/usr/bin/env node
/**
 * StudyPipe · Theme preview + gallery.
 *
 *   node scripts/theme-preview.mjs <theme-id> [--topic <slug>]   -> screenshots one theme
 *   node scripts/theme-preview.mjs --all [--topic <slug>]         -> screenshots every theme
 *   node scripts/theme-preview.mjs --gallery                      -> only rebuild themes/gallery.html
 *
 * A copy of a real rendered topic (default: ss2-phy-ohms-law-circuits) is themed in a temp folder
 * (the topic itself is never modified) and captured on a 360×740 phone and a 1280×800 desktop.
 * Output: themes/<id>/preview/*.png, then themes/gallery.html is rebuilt so the human can compare
 * all themes side by side and pick one.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { applyTheme, listThemes, defaultTheme } from "./apply-theme.mjs";

const ROOT = process.cwd();
const THEMES = path.join(ROOT, "themes");
const args = process.argv.slice(2);
const opt = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };
const topic = opt("--topic") || "ss2-phy-ohms-law-circuits";

const SHOTS = [
  { name: "phone-hub", page: "index.html", vp: "phone", scroll: 0 },
  { name: "phone-hub-journey", page: "index.html", vp: "phone", sel: "#journey" },
  { name: "phone-lesson-hero", page: "lessons/lesson-01/index.html", vp: "phone", scroll: 0 },
  { name: "phone-lesson-paper", page: "lessons/lesson-01/index.html", vp: "phone", sel: ".l-sec" },
  { name: "phone-lesson-quiz", page: "lessons/lesson-01/index.html", vp: "phone", sel: ".quiz, .donow, .callout" },
  { name: "desktop-hub", page: "index.html", vp: "desktop", scroll: 0 },
  { name: "desktop-lesson", page: "lessons/lesson-01/index.html", vp: "desktop", sel: ".l-sec" },
];

async function capture(ids) {
  const { chromium } = await import("playwright");
  const src = path.join(ROOT, "topics", topic, "html");
  if (!fs.existsSync(src)) { console.error(`theme-preview: topics/${topic}/html not found (use --topic <slug>)`); process.exit(1); }
  const browser = await chromium.launch({ args: ["--use-gl=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"] });
  const phone = await browser.newContext({ viewport: { width: 360, height: 740 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const desk = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
  for (const id of ids) {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), `theme-${id}-`));
    fs.cpSync(src, tmp, { recursive: true });
    applyTheme(tmp, id);
    const out = path.join(THEMES, id, "preview");
    fs.mkdirSync(out, { recursive: true });
    for (const s of SHOTS) {
      const page = await (s.vp === "phone" ? phone : desk).newPage();
      await page.goto(pathToFileURL(path.join(tmp, s.page)).href);
      await page.evaluate(() => document.fonts && document.fonts.ready);
      await page.waitForTimeout(1300);
      // reveal-on-scroll content must be visible in stills
      await page.addStyleTag({ content: ".reveal{opacity:1!important;transform:none!important}" });
      if (s.sel) {
        await page.evaluate((sel) => {
          const el = document.querySelector(sel);
          if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 70);
        }, s.sel);
        await page.waitForTimeout(600);
      }
      await page.screenshot({ path: path.join(out, s.name + ".png") });
      await page.close();
    }
    fs.rmSync(tmp, { recursive: true, force: true });
    console.log(`preview: themes/${id}/preview/ (${SHOTS.length} shots, sample topic ${topic})`);
  }
  await browser.close();
}

function esc(s) { return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }

export function buildGallery() {
  const fontsJson = JSON.parse(fs.readFileSync(path.join(THEMES, "_fonts", "fonts.json"), "utf8"));
  const def = defaultTheme();
  const cards = listThemes().map((t) => {
    const shots = ["phone-hub", "phone-lesson-hero", "phone-lesson-paper", "phone-lesson-quiz"]
      .filter((n) => fs.existsSync(path.join(THEMES, t.id, "preview", n + ".png")))
      .map((n) => `<img loading="lazy" src="${t.id}/preview/${n}.png" alt="${esc(t.name)} — ${n}">`).join("");
    const fonts = Object.entries(t.fonts).map(([role, id]) => `<span><b>${role}</b> ${esc(fontsJson[id]?.family || id)}</span>`).join("");
    const kb = [...new Set(Object.values(t.fonts))].reduce((a, id) => a + (fontsJson[id]?.kb || 0), 0);
    return `<section class="card">
  <header><h2>${esc(t.name)} ${t.id === def ? '<em>default</em>' : ""}</h2><code>${t.id}</code></header>
  <p>${esc(t.description)}</p>
  <div class="meta">${fonts}<span><b>fonts</b> ${kb} KB</span><span><b>for</b> ${esc(t.audience || "")}</span></div>
  <div class="shots">${shots || "<p class=none>No preview yet — run <code>node scripts/theme-preview.mjs " + t.id + "</code></p>"}</div>
  <p class="use">Use it: <code>node scripts/apply-theme.mjs topics/&lt;slug&gt; ${t.id}</code></p>
</section>`;
  }).join("\n");
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>StudyPipe Themes</title>
<style>
:root{--bg:#f4f2ee;--fg:#1b1813;--mut:#6b6253;--card:#fff;--line:#e2ddd3}
@media (prefers-color-scheme:dark){:root{--bg:#0e1015;--fg:#eceef3;--mut:#9aa1b2;--card:#171a22;--line:#272b36}}
body{margin:0;background:var(--bg);color:var(--fg);font:16px/1.55 system-ui,-apple-system,"Segoe UI",sans-serif;padding:28px 16px 60px}
main{max-width:1200px;margin:0 auto}h1{margin:0 0 4px;font-size:28px}.sub{color:var(--mut);margin:0 0 28px}
.card{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:20px;margin-bottom:24px}
.card header{display:flex;align-items:baseline;justify-content:space-between;gap:12px;flex-wrap:wrap}
.card h2{margin:0;font-size:21px}.card h2 em{font-style:normal;font-size:12px;background:#1b7f5f;color:#fff;border-radius:99px;padding:2px 9px;vertical-align:middle}
.card p{margin:8px 0 0;color:var(--mut)}code{font:13px ui-monospace,Menlo,monospace}
.meta{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}.meta span{font-size:13px;border:1px solid var(--line);border-radius:99px;padding:3px 10px}.meta b{color:var(--mut);font-weight:600;margin-right:4px}
.shots{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:10px}.shots img{width:100%;border-radius:10px;border:1px solid var(--line);display:block}
.use{font-size:14px}
</style></head><body><main>
<h1>StudyPipe themes</h1>
<p class="sub">Phone previews (360×740) of the same lesson in each theme. Pick one per topic; design new ones with the <code>theme-designer</code> skill.</p>
${cards}
</main></body></html>
`;
  fs.writeFileSync(path.join(THEMES, "gallery.html"), html);

  const rows = listThemes().map((t) => {
    const f = t.fonts || {};
    const fam = (id) => fontsJson[id]?.family || id || "—";
    return `| \`${t.id}\`${t.id === def ? " (default)" : ""} | ${t.name} | ${(t.mood || []).join(", ")} | ${t.audience || ""} | ${fam(f.display)} / ${fam(f.body)} / ${fam(f.mono)} | ${t.description} |`;
  });
  fs.writeFileSync(path.join(THEMES, "catalog.md"), [
    "# Theme catalog",
    "",
    "Generated by `node scripts/theme-preview.mjs`. Do not edit by hand. Visual comparison: open `themes/gallery.html`.",
    "Contract and font library: `themes/README.md`. Design a new one: skill `theme-designer`.",
    "",
    "| id | name | mood | audience | display / body / mono | description |",
    "|---|---|---|---|---|---|",
    ...rows,
    "",
  ].join("\n"));
  console.log("gallery: themes/gallery.html, catalog: themes/catalog.md");
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname);
if (isMain) {
  if (!args[0]) { console.error("usage: node scripts/theme-preview.mjs <theme-id>|--all|--gallery [--topic <slug>]"); process.exit(1); }
  if (args[0] !== "--gallery") {
    const ids = args[0] === "--all" ? listThemes().map((t) => t.id) : [args[0]];
    await capture(ids);
  }
  buildGallery();
}
