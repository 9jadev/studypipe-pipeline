#!/usr/bin/env node
/**
 * StudyPipe · Theme checker.   node scripts/check-theme.mjs <theme-id> | --all
 *
 * FAIL if: a required token is missing, a font id is not in themes/_fonts, a --font-* token does not
 * name the family its theme.json font provides, or a text/background pair is below its contrast floor.
 * The required token list is whatever themes/editorial-ink/theme.css defines (the reference theme).
 */
import fs from "node:fs";
import path from "node:path";

const THEMES = path.join(process.cwd(), "themes");
const fonts = JSON.parse(fs.readFileSync(path.join(THEMES, "_fonts", "fonts.json"), "utf8"));

function tokens(css) {
  const root = (css.match(/:root\s*\{([\s\S]*?)\n\}/) || [])[1] || "";
  const out = {};
  for (const m of root.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/g)) out[m[1]] = m[2].trim();
  return out;
}
const required = Object.keys(tokens(fs.readFileSync(path.join(THEMES, "editorial-ink", "theme.css"), "utf8")));

function hexRgb(v) {
  const m = /^#([0-9a-f]{6})$/i.exec(v.trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function lum([r, g, b]) {
  const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
function ratio(a, b) { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); }

// [foreground, background, minimum, what it is]
const PAIRS = [
  ["--fg", "--ink-950", 7, "hub/hero body text on ink"],
  ["--fg-soft", "--ink-950", 4.5, "soft text on ink"],
  ["--muted", "--ink-950", 3, "muted labels on ink"],
  ["--on-ink-soft", "--ink-800", 4.5, "text in dark cards"],
  ["--amber", "--ink-950", 4.5, "eyebrow / highlight on ink"],
  ["--paper-ink", "--paper", 7, "headings on paper"],
  ["--paper-text", "--paper-card", 4.5, "body text in paper cards"],
  ["--paper-muted", "--paper", 4.5, "muted text on paper"],
  ["--crimson", "--paper", 3, "accent heading words on paper"],
  ["--on-amber", "--amber", 4.5, "text on amber buttons"],
  ["#ffffff", "--ok", 3, "white on success badge"],
  ["#ffffff", "--crimson", 3, "white on error/tag badge"],
  ["#ffffff", "--info", 3, "white on info badge"],
  ["#ffffff", "--warn", 2.5, "white on warning badge"],
  ["--paper-ink", "--ok-tint", 7, "text on correct-answer tint"],
  ["--paper-ink", "--bad-tint-2", 7, "text on wrong-answer tint"],
];

function check(id) {
  const dir = path.join(THEMES, id);
  const problems = [], notes = [];
  if (!fs.existsSync(path.join(dir, "theme.json"))) return { id, problems: ["missing theme.json"], notes };
  if (!fs.existsSync(path.join(dir, "theme.css"))) return { id, problems: ["missing theme.css"], notes };
  const meta = JSON.parse(fs.readFileSync(path.join(dir, "theme.json"), "utf8"));
  const t = tokens(fs.readFileSync(path.join(dir, "theme.css"), "utf8"));

  if (meta.id !== id) problems.push(`theme.json id "${meta.id}" ≠ folder "${id}"`);
  for (const k of ["name", "description", "fonts"]) if (!meta[k]) problems.push(`theme.json missing "${k}"`);
  for (const k of required) if (!(k in t)) problems.push(`missing token ${k}`);

  for (const [role, fid] of Object.entries(meta.fonts || {})) {
    if (!fonts[fid]) { problems.push(`font "${fid}" (${role}) not in themes/_fonts`); continue; }
    const tok = t[`--font-${role}`] || "";
    if (!tok.includes(fonts[fid].family)) problems.push(`--font-${role} does not name "${fonts[fid].family}" (theme.json says ${role} = ${fid})`);
  }
  for (const role of ["display", "body", "mono"]) if (!(meta.fonts || {})[role]) problems.push(`theme.json fonts.${role} is required`);

  for (const [k, v] of Object.entries(t)) {
    if (!k.endsWith("-rgb")) continue;
    const base = hexRgb(t[k.slice(0, -4)] || "");
    const trip = v.split(",").map((s) => Number(s.trim()));
    if (base && trip.join() !== base.join()) problems.push(`${k} (${v}) does not match ${k.slice(0, -4)} (${t[k.slice(0, -4)]})`);
  }

  for (const [fg, bg, min, what] of PAIRS) {
    const a = hexRgb(fg.startsWith("#") ? fg : t[fg] || ""), b = hexRgb(bg.startsWith("#") ? bg : t[bg] || "");
    if (!a || !b) { notes.push(`skip contrast ${fg} on ${bg} (not plain #rrggbb)`); continue; }
    const r = ratio(a, b);
    if (r < min) problems.push(`contrast ${r.toFixed(2)} < ${min}: ${what} (${fg} on ${bg})`);
  }

  const kb = [...new Set(Object.values(meta.fonts || {}))].reduce((s, f) => s + (fonts[f]?.kb || 0), 0);
  if (kb > 450) problems.push(`fonts weigh ${kb} KB (budget 450 KB per unit)`);
  else notes.push(`fonts ${kb} KB`);
  return { id, problems, notes };
}

const arg = process.argv[2];
if (!arg) { console.error("usage: node scripts/check-theme.mjs <theme-id> | --all"); process.exit(1); }
const ids = arg === "--all"
  ? fs.readdirSync(THEMES).filter((d) => !d.startsWith("_") && !d.startsWith(".") && fs.existsSync(path.join(THEMES, d, "theme.json")))
  : [arg];
let failed = 0;
for (const id of ids) {
  const r = check(id);
  console.log(`${r.problems.length ? "FAIL" : "PASS"}  ${id}${r.notes.length ? "  (" + r.notes.join("; ") + ")" : ""}`);
  for (const p of r.problems) console.log("   - " + p);
  if (r.problems.length) failed++;
}
process.exit(failed ? 1 : 0);
