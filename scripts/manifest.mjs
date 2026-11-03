// Writes manifest.json into a lesson build folder. Used by package.sh.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import vm from "node:vm";

const [slug, dir] = process.argv.slice(2);
let L = {};

const legacyPath = path.join(dir, "lesson-data.js");
const lessonMdPath = path.resolve("topics", slug, "02-lesson.md");

if (fs.existsSync(legacyPath)) {
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(legacyPath, "utf8"), sandbox);
  L = sandbox.window.LESSON || {};
} else if (fs.existsSync(lessonMdPath)) {
  const md = fs.readFileSync(lessonMdPath, "utf8");
  const getField = (key) => {
    const m = new RegExp(`^${key}:\\s*(.+)$`, "m").exec(md);
    return m ? m[1].trim() : undefined;
  };
  const examsRaw = getField("exams");
  L = {
    title: getField("title") || slug,
    subject: getField("subject") || "Science",
    class: getField("class") || "SS2",
    exams: examsRaw ? examsRaw.replace(/^\[|\]$/g, "").split(",").map((s) => s.trim()) : ["WAEC", "NECO", "JAMB"],
    version: Number(getField("version") || 2),
    kits: ["StoryStage", "SceneKit", "LessonKit", "StudyNarrator"]
  };
}

const files = [];
(function walk(d) {
  for (const f of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, f.name);
    if (f.isDirectory()) walk(p);
    else files.push({
      path: path.relative(dir, p),
      bytes: fs.statSync(p).size,
      sha256: crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex")
    });
  }
})(dir);

const lessonsDir = path.join(dir, "lessons");
const lessonEntries = fs.existsSync(lessonsDir)
  ? fs.readdirSync(lessonsDir).filter((f) => fs.existsSync(path.join(lessonsDir, f, "index.html"))).sort().map((f) => `lessons/${f}/index.html`)
  : ["index.html"];

const manifest = {
  format: "studypipe-unit/2",
  slug,
  title: L.title || slug,
  subject: L.subject,
  class: L.class,
  exams: L.exams || ["WAEC", "NECO", "JAMB"],
  lang: L.lang || "en-NG",
  version: L.version || 2,
  kits: L.kits || [],
  entry: "index.html",
  lessons: lessonEntries,
  built_at: new Date().toISOString(),
  files,
};
fs.writeFileSync(path.join(dir, "manifest.json"), JSON.stringify(manifest, null, 2));
console.log(`manifest.json: ${files.length} files`);
