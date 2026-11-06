#!/usr/bin/env node
/**
 * StudyPipe · Apply a theme (visual template) to a rendered topic.
 *
 *   node scripts/apply-theme.mjs topics/<slug>               -> theme from status.md (`theme:` line) or themes/default.txt
 *   node scripts/apply-theme.mjs topics/<slug> <theme-id>    -> switch the topic to <theme-id> and record it in status.md
 *   node scripts/apply-theme.mjs --tokenize <dir>            -> only rewrite literal colours/fonts in <dir>/**.css to tokens
 *   node scripts/apply-theme.mjs --list                      -> list installed themes
 *
 * What it does to topics/<slug>/html/ (idempotent, safe to re-run, never overwrites custom CSS rules):
 *   1. Tokenises assets/css/*.css in place (literal colours / fonts / radii -> var(--token)).
 *   2. Patches assets/js/scene-kit.js + lesson-kit.js so 3D labels and Wonder-Wall notes follow the theme.
 *   3. Copies the theme's font files from themes/_fonts into assets/fonts/ (and drops library fonts it no longer uses).
 *   4. Writes assets/css/fonts.css and assets/css/theme.css.
 *   5. Links assets/css/theme.css as the LAST stylesheet in every .html page and updates <meta name="theme-color">.
 */
import fs from "node:fs";
import path from "node:path";
import { tokenizeCss, themeJs } from "./lib/theme-tokens.mjs";

const ROOT = process.cwd();
const THEMES = path.join(ROOT, "themes");
const FONTS = path.join(THEMES, "_fonts");

function die(msg) { console.error("apply-theme: " + msg); process.exit(1); }
function walk(dir, ext, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, ext, out);
    else if (p.endsWith(ext)) out.push(p);
  }
  return out;
}
export function listThemes() {
  return fs.readdirSync(THEMES, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith("_") && !e.name.startsWith("."))
    .filter((e) => fs.existsSync(path.join(THEMES, e.name, "theme.json")))
    .map((e) => JSON.parse(fs.readFileSync(path.join(THEMES, e.name, "theme.json"), "utf8")));
}
export function defaultTheme() {
  const f = path.join(THEMES, "default.txt");
  return fs.existsSync(f) ? fs.readFileSync(f, "utf8").trim() : "editorial-ink";
}

export function tokenizeDir(dir) {
  let total = 0;
  for (const f of walk(dir, ".css")) {
    if (path.basename(f) === "fonts.css" || path.basename(f) === "theme.css") continue;
    const before = fs.readFileSync(f, "utf8");
    const { css, changes } = tokenizeCss(before, { mathFile: path.basename(f) === "math.css" });
    if (changes) { fs.writeFileSync(f, css); total += changes; }
  }
  for (const f of walk(dir, ".js")) {
    const name = path.basename(f);
    if (name !== "scene-kit.js" && name !== "lesson-kit.js") continue;
    const { src, changes } = themeJs(name, fs.readFileSync(f, "utf8"));
    if (changes) { fs.writeFileSync(f, src); total += changes; }
  }
  return total;
}

export function buildFontsCss(theme) {
  const manifest = JSON.parse(fs.readFileSync(path.join(FONTS, "fonts.json"), "utf8"));
  const ids = [...new Set(Object.values(theme.fonts || {}))];
  let css = `/* Fonts for theme "${theme.id}" — all bundled locally, no network. SIL OFL 1.1 (see assets/fonts/OFL-*.txt). */\n`;
  const files = [];
  for (const id of ids) {
    if (!manifest[id]) die(`theme "${theme.id}" uses font "${id}", which is not in themes/_fonts/fonts.json`);
    css += fs.readFileSync(path.join(FONTS, id, "font.css"), "utf8");
    for (const f of manifest[id].files) files.push({ id, file: f });
  }
  return { css, files, ids, manifest };
}

function readStatusTheme(topicDir) {
  const f = path.join(topicDir, "status.md");
  if (!fs.existsSync(f)) return null;
  const m = fs.readFileSync(f, "utf8").match(/^theme:\s*([a-z0-9-]+)/m);
  return m ? m[1] : null;
}
function writeStatusTheme(topicDir, id) {
  const f = path.join(topicDir, "status.md");
  if (!fs.existsSync(f)) return;
  let s = fs.readFileSync(f, "utf8");
  if (/^theme:/m.test(s)) s = s.replace(/^theme:.*$/m, `theme: ${id}`);
  else if (/^state:.*$/m.test(s)) s = s.replace(/^(state:.*)$/m, `$1\ntheme: ${id}`);
  else s = `theme: ${id}\n` + s;
  fs.writeFileSync(f, s);
}

export function applyTheme(htmlDir, themeId) {
  const themeDir = path.join(THEMES, themeId);
  if (!fs.existsSync(path.join(themeDir, "theme.json"))) {
    die(`unknown theme "${themeId}". Installed: ${listThemes().map((t) => t.id).join(", ")}`);
  }
  const theme = JSON.parse(fs.readFileSync(path.join(themeDir, "theme.json"), "utf8"));
  const cssDir = path.join(htmlDir, "assets", "css");
  const fontDir = path.join(htmlDir, "assets", "fonts");
  fs.mkdirSync(cssDir, { recursive: true });
  fs.mkdirSync(fontDir, { recursive: true });

  const changes = tokenizeDir(path.join(htmlDir, "assets"));

  // fonts: drop library fonts the new theme doesn't use, copy the ones it does
  const { css: fontsCss, files, ids, manifest } = buildFontsCss(theme);
  const libFiles = new Set(Object.values(manifest).flatMap((m) => m.files));
  const keep = new Set(files.map((f) => f.file));
  for (const f of fs.readdirSync(fontDir)) {
    if ((libFiles.has(f) && !keep.has(f)) || /^OFL.*\.txt$/.test(f)) fs.rmSync(path.join(fontDir, f));
  }
  for (const { id, file } of files) fs.copyFileSync(path.join(FONTS, id, file), path.join(fontDir, file));
  for (const id of ids) fs.copyFileSync(path.join(FONTS, id, "OFL.txt"), path.join(fontDir, `OFL-${id}.txt`));
  fs.writeFileSync(path.join(cssDir, "fonts.css"), fontsCss);

  fs.writeFileSync(path.join(cssDir, "theme.css"),
    `/* theme: ${theme.id} — installed by scripts/apply-theme.mjs from themes/${theme.id}/theme.css. Edit the source, not this copy. */\n`
    + fs.readFileSync(path.join(themeDir, "theme.css"), "utf8"));

  // link theme.css last in every page, fix theme-color
  let pages = 0;
  for (const page of walk(htmlDir, ".html")) {
    let html = fs.readFileSync(page, "utf8");
    if (!/<\/head>/i.test(html)) continue;
    const rel = path.relative(path.dirname(page), path.join(cssDir, "theme.css")).split(path.sep).join("/");
    html = html.replace(/\s*<link[^>]+assets\/css\/theme\.css[^>]*>/gi, "");
    html = html.replace(/<\/head>/i, `  <link rel="stylesheet" href="${rel}">\n</head>`);
    if (theme.themeColor) {
      if (/<meta name="theme-color"[^>]*>/i.test(html)) html = html.replace(/<meta name="theme-color"[^>]*>/i, `<meta name="theme-color" content="${theme.themeColor}">`);
    }
    fs.writeFileSync(page, html);
    pages++;
  }
  return { theme, changes, pages, fonts: ids };
}

// ---------------- CLI ----------------
const isMain = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname);
if (isMain) {
  const [a, b] = process.argv.slice(2);
  if (!a) die("usage: node scripts/apply-theme.mjs topics/<slug> [theme-id] | --tokenize <dir> | --list");
  if (a === "--list") {
    const def = defaultTheme();
    for (const t of listThemes()) console.log(`${t.id === def ? "*" : " "} ${t.id.padEnd(18)} ${t.name} — ${t.description}`);
    process.exit(0);
  }
  if (a === "--tokenize") {
    if (!b) die("--tokenize needs a directory");
    console.log(`tokenized ${tokenizeDir(path.resolve(b))} literals in ${b}`);
    process.exit(0);
  }
  const topicDir = path.resolve(a);
  const htmlDir = fs.existsSync(path.join(topicDir, "html")) ? path.join(topicDir, "html") : topicDir;
  if (!fs.existsSync(htmlDir)) die(`no html/ folder in ${a} — render the topic first`);
  const themeId = b || readStatusTheme(topicDir) || defaultTheme();
  const r = applyTheme(htmlDir, themeId);
  writeStatusTheme(topicDir, themeId);
  console.log(`theme "${r.theme.name}" (${themeId}) applied to ${path.relative(ROOT, htmlDir)}: ${r.pages} pages, ${r.changes} literals tokenised, fonts: ${r.fonts.join(", ")}`);
}
