#!/usr/bin/env node
/**
 * StudyPipe · Apply StudyCode Service (scripts/apply-code.mjs)
 * Installs kits/code-snippet/code.css and kits/code-snippet/code-kit.js into a topic's
 * html/assets/ folder and injects the <link> and <script> tags into the Unit Welcome Hub
 * and all lesson HTML files (idempotent).
 *
 * Usage:
 *   node scripts/apply-code.mjs                  -> upgrades all topics in topics/
 *   node scripts/apply-code.mjs topics/<slug>    -> upgrades a specific topic
 */
import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const srcCss = path.join(rootDir, "kits", "code-snippet", "code.css");
const srcJs  = path.join(rootDir, "kits", "code-snippet", "code-kit.js");

if (!fs.existsSync(srcCss) || !fs.existsSync(srcJs)) {
  console.error("Missing kits/code-snippet/code.css or code-kit.js");
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
  const cssHref = `${relPrefix}assets/css/code.css`;
  const jsSrc   = `${relPrefix}assets/js/code-kit.js`;
  let changed = false;

  if (!html.includes("assets/css/code.css")) {
    if (html.includes("assets/css/math.css")) {
      html = html.replace(
        /(<link[^>]+assets\/css\/math\.css[^>]*>)/i,
        `$1\n  <link rel="stylesheet" href="${cssHref}">`
      );
    } else if (html.includes("assets/css/narrator.css")) {
      html = html.replace(
        /(<link[^>]+assets\/css\/narrator\.css[^>]*>)/i,
        `$1\n  <link rel="stylesheet" href="${cssHref}">`
      );
    } else {
      html = html.replace(/<\/head>/i, `  <link rel="stylesheet" href="${cssHref}">\n</head>`);
    }
    changed = true;
  }

  if (!html.includes("assets/js/code-kit.js")) {
    if (html.includes("assets/js/math-kit.js")) {
      html = html.replace(
        /(<script[^>]+assets\/js\/math-kit\.js[^>]*><\/script>)/i,
        `$1\n  <script src="${jsSrc}"></script>`
      );
    } else if (html.includes("assets/js/narrator.js")) {
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

let totalUpgraded = 0;

for (const topicDir of topicDirs) {
  const htmlDir = path.join(topicDir, "html");
  if (!fs.existsSync(htmlDir)) continue;

  const assetsCss = path.join(htmlDir, "assets", "css");
  const assetsJs  = path.join(htmlDir, "assets", "js");
  fs.mkdirSync(assetsCss, { recursive: true });
  fs.mkdirSync(assetsJs, { recursive: true });

  fs.copyFileSync(srcCss, path.join(assetsCss, "code.css"));
  fs.copyFileSync(srcJs,  path.join(assetsJs,  "code-kit.js"));

  let modifiedCount = 0;
  // Upgrade index.html
  const hubHtml = path.join(htmlDir, "index.html");
  if (injectHtml(hubHtml, "./")) modifiedCount++;

  // Upgrade lessons
  const lessonsDir = path.join(htmlDir, "lessons");
  if (fs.existsSync(lessonsDir)) {
    const lessonDirs = fs.readdirSync(lessonsDir)
      .map((d) => path.join(lessonsDir, d))
      .filter((p) => fs.statSync(p).isDirectory());

    for (const lDir of lessonDirs) {
      const lessonHtml = path.join(lDir, "index.html");
      if (injectHtml(lessonHtml, "../../")) modifiedCount++;
    }
  }

  console.log(`✓ Upgraded ${path.basename(topicDir)} (${modifiedCount} HTML files linked to StudyCode)`);
  totalUpgraded++;
}

console.log(`\nDone. StudyCode applied to ${totalUpgraded} topics.`);
