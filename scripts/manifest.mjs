// Writes manifest.json into a lesson build folder.  Used by package.sh.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import vm from "node:vm";

const [slug, dir] = process.argv.slice(2);
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(dir, "lesson-data.js"), "utf8"), sandbox);
const L = sandbox.window.LESSON || {};

const files = [];
(function walk(d) {
  for (const f of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, f.name);
    if (f.isDirectory()) walk(p);
    else files.push({ path: path.relative(dir, p), bytes: fs.statSync(p).size,
      sha256: crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex") });
  }
})(dir);

const manifest = {
  format: "studypipe-lesson/1", slug, title: L.title, subject: L.subject, class: L.class,
  exams: L.exams, lang: L.lang || "en-GB", version: L.version || 1, kits: L.kits || [],
  entry: "index.html", built_at: new Date().toISOString(), files,
};
fs.writeFileSync(path.join(dir, "manifest.json"), JSON.stringify(manifest, null, 2));
console.log(`manifest.json: ${files.length} files`);
