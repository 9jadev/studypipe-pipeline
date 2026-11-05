#!/usr/bin/env node
/**
 * StudyPipe · Apply StudyMath Service (scripts/apply-math.mjs)
 * Installs kits/math-solver/math.css and kits/math-solver/math-kit.js into a topic's
 * html/assets/ folder and injects the <link> and <script> tags into the Unit Welcome Hub
 * and all lesson HTML files (idempotent).
 *
 * Usage:
 *   node scripts/apply-math.mjs                  -> upgrades all topics in topics/
 *   node scripts/apply-math.mjs topics/<slug>    -> upgrades a specific topic
 */
import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const srcCss = path.join(rootDir, "kits", "math-solver", "math.css");
const srcJs  = path.join(rootDir, "kits", "math-solver", "math-kit.js");

if (!fs.existsSync(srcCss) || !fs.existsSync(srcJs)) {
  console.error("Missing kits/math-solver/math.css or math-kit.js");
  process.exit(1);
}

const arg = process.argv[2];
const topicDirs = arg
  ? [path.resolve(arg)]
  : fs.readdirSync(path.join(rootDir, "topics"))
      .filter((d) => !d.startsWith("_") && !d.startsWith("."))
      .map((d) => path.join(rootDir, "topics", d))
      .filter((p) => fs.statSync(p).isDirectory());

function injectHtml(filePath, relPrefix) {
  if (!fs.existsSync(filePath)) return false;
  let html = fs.readFileSync(filePath, "utf8");
  const cssHref = `${relPrefix}assets/css/math.css`;
  const jsSrc   = `${relPrefix}assets/js/math-kit.js`;
  let changed = false;

  if (!html.includes("assets/css/math.css")) {
    if (html.includes("assets/css/narrator.css")) {
      html = html.replace(
        /(<link[^>]+assets\/css\/narrator\.css[^>]*>)/i,
        `$1\n  <link rel="stylesheet" href="${cssHref}">`
      );
    } else {
      html = html.replace(/<\/head>/i, `  <link rel="stylesheet" href="${cssHref}">\n</head>`);
    }
    changed = true;
  }

  if (!html.includes("assets/js/math-kit.js")) {
    if (html.includes("assets/js/narrator.js")) {
      html = html.replace(
        /(<script[^>]+assets\/js\/narrator\.js[^>]*><\/script>)/i,
        `$1\n  <script src="${jsSrc}"></script>`
      );
    } else {
      html = html.replace(/<\/body>/i, `  <script src="${jsSrc}"></script>\n</body>`);
    }
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, html, "utf8");
  }
  return changed;
}

for (const topicDir of topicDirs) {
  const htmlDir = path.join(topicDir, "html");
  if (!fs.existsSync(htmlDir)) continue;

  const cssDir = path.join(htmlDir, "assets", "css");
  const jsDir  = path.join(htmlDir, "assets", "js");
  fs.mkdirSync(cssDir, { recursive: true });
  fs.mkdirSync(jsDir, { recursive: true });

  fs.copyFileSync(srcCss, path.join(cssDir, "math.css"));
  fs.copyFileSync(srcJs,  path.join(jsDir, "math-kit.js"));

  let count = 0;
  if (injectHtml(path.join(htmlDir, "index.html"), "")) count++;

  const lessonsDir = path.join(htmlDir, "lessons");
  if (fs.existsSync(lessonsDir)) {
    for (const lFolder of fs.readdirSync(lessonsDir)) {
      const lIndex = path.join(lessonsDir, lFolder, "index.html");
      if (injectHtml(lIndex, "../../")) count++;
    }
  }
  console.log(`Updated ${path.basename(topicDir)}: copied math.css + math-kit.js (${count} HTML files newly linked)`);
}
