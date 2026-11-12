#!/usr/bin/env node
// Explainer video build: validate plan → verify checks → render LaTeX → assemble one offline HTML file.
// Usage: node scripts/build.cjs <plan.cjs> [--out file.html] [--check-only]
const fs = require('fs'), path = require('path');
const SKILL = path.join(__dirname, '..');
const katex = require(require.resolve('katex', { paths: [SKILL, process.cwd()] }));
const args = process.argv.slice(2);
const planArg = args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--out');
const planPath = planArg ? path.resolve(planArg) : '';
if (!planPath || !fs.existsSync(planPath)) { console.error('Usage: node scripts/build.cjs <plan.cjs> [--out file.html] [--check-only]'); process.exit(2); }
const outArg = args.includes('--out') ? args[args.indexOf('--out') + 1] : null;
const plan = require(planPath);
const KITS = ['circuit', 'cell', 'toll', 'graph', 'area'];
const THEMES = ['safari', 'vegetation', 'fiesta', 'classic'];
const errors = [], warnings = [];
const err = m => errors.push(m), warn = m => warnings.push(m);

// ---------- 1. validate the plan ----------
const meta = plan.meta || {};
if (!meta.title) err('meta.title is required');
if (meta.theme && !THEMES.includes(meta.theme)) err(`meta.theme "${meta.theme}" is not one of ${THEMES.join(', ')}`);
const roles = meta.roles || {};
if (!Array.isArray(plan.chapters) || !plan.chapters.length) err('chapters[] is required');
const render = tex => katex.renderToString(tex, { displayMode: true, throwOnError: true, trust: c => c.command === '\\htmlClass', strict: 'ignore' });
let boardIds = new Set();
(plan.chapters || []).forEach((ch, ci) => {
  if (!ch.title) err(`chapter ${ci + 1}: title missing`);
  (ch.cues || []).forEach((c, k) => {
    const where = `chapter ${ci + 1} ("${ch.title}") line ${k + 1}`;
    if (!c.say || typeof c.say !== 'string') { err(`${where}: say is required`); return; }
    const words = c.say.split(/\s+/).length;
    if (words > 48) warn(`${where}: ${words} words; split lines over ~45 words (some browsers cut long speech)`);
    if (/\\|\$|\^|_\{/.test(c.say)) err(`${where}: say contains LaTeX or symbols; write it as spoken words`);
    for (const o of c.ops || []) {
      if ('clear' in o) boardIds = new Set();
      if (o.write) {
        if (boardIds.has(o.write)) err(`${where}: line id "${o.write}" reused on the same board`);
        boardIds.add(o.write);
        try { o.html = render(o.tex); } catch (e) { err(`${where}: LaTeX error in "${o.write}": ${e.message}`); }
        for (const m of (o.tex || '').matchAll(/\\htmlClass\{role-([\w-]+)\}/g)) if (!roles[m[1]]) err(`${where}: role "${m[1]}" used but not defined in meta.roles`);
      }
      if (o.box && !boardIds.has(o.box)) err(`${where}: box "${o.box}" refers to a line not on this board`);
      if (o.hl) o.hl.forEach(r => { if (!roles[r]) err(`${where}: hl role "${r}" not defined in meta.roles`); });
      if ('panel' in o && o.panel !== null && !KITS.includes(o.panel)) err(`${where}: panel "${o.panel}" is not a kit (${KITS.join(', ')}). Flag the gap instead of improvising.`);
      if (o.panel === 'graph' && o.s && o.s.spec) {
        const S = o.s.spec;
        if (!S.id || !S.x || !S.y || !Array.isArray(S.items)) err(`${where}: graph spec needs id, x:[min,max,step], y:[min,max,step], items[]`);
        for (const it of S.items || []) if (it.type === 'fn' && !it.pts) {
          try {
            const f = new Function('x', `with (Math) { return (${it.fn}); }`), [a, b] = it.domain || [S.x[0], S.x[1]];
            it.pts = [];
            for (let i = 0; i <= 240; i++) { const x = a + (b - a) * i / 240, y = f(x); if (Number.isFinite(y)) it.pts.push([+x.toFixed(5), +y.toFixed(5)]); }
          } catch (e) { err(`${where}: graph fn "${it.fn}" failed: ${e.message}`); }
        }
      }
      if (o.panel === 'graph' && o.s && o.s.show) {
        // show ids must exist in the spec active at this point (this op's spec or the last one)
        const S = (o.s.spec) || lastGraphSpec;
        if (S) { const ids = new Set(S.items.map(i => i.id)); for (const id of o.s.show) if (!ids.has(id)) err(`${where}: graph show "${id}" is not an item in spec "${S.id}"`); }
      }
      if (o.panel === 'graph' && o.s && o.s.spec) lastGraphSpec = o.s.spec;
      if (o.at != null && (o.at < 0 || o.at > 30)) warn(`${where}: at=${o.at}s looks wrong`);
    }
  });
});
var lastGraphSpec;

// ---------- 2. verify every number ----------
let failed = 0;
const ok = (cond, msg) => { console.log((cond ? '  ✓ ' : '  ✗ ') + msg); if (!cond) failed++; };
console.log('Verifying checks…');
for (const c of plan.checks || []) {
  if (Array.isArray(c)) { const [name, got, want, tol = 1e-9] = c; ok(Math.abs(got - want) <= tol, `${name}: ${+(+got).toFixed(6)} vs ${want}`); continue; }
  if (c.roots) c.roots.forEach(r => ok(Math.abs(c.f(r)) < (c.tol || 1e-9), `${c.name}: f(${r.toFixed(4)}) = ${c.f(r).toExponential(1)}`));
  if (c.approx) c.approx.forEach(([v, a, dp = 2]) => ok(Math.abs(v - a) <= .5 * Math.pow(10, -dp) + 1e-12, `${c.name}: ${v.toFixed(dp + 2)} ≈ ${a}`));
  if (c.same) { let worst = 0; const [lo, hi] = c.range || [-10, 10]; for (let x = lo; x <= hi; x += (hi - lo) / 57) worst = Math.max(worst, Math.abs(c.same[0](x) - c.same[1](x))); ok(worst < (c.tol || 1e-9), `${c.name}: identical on test points`); }
  if (c.test) ok(!!c.test(), c.name);
}
if (!(plan.checks || []).length) warn('no checks: every number shown or spoken should have a check');
warnings.forEach(w => console.log('  ! ' + w));
if (errors.length) console.error('\nPlan errors:\n' + errors.map(e => '  ✗ ' + e).join('\n'));
if (failed || errors.length) { console.error(`\nBuild stopped: ${failed} failed check(s), ${errors.length} plan error(s). Send these back to the director.`); process.exit(1); }
if (args.includes('--check-only')) { console.log('\nPlan valid, all checks pass.'); process.exit(0); }

// ---------- 3. timeline ----------
const fixes = meta.captionFixes || {};
const caption = s => Object.entries(fixes).reduce((a, [k, v]) => a.split(k).join(v), s);
const cues = [], chapters = []; let T = 0;
const rate = meta.wordsPerSecond || 2.4;
for (const ch of plan.chapters) {
  chapters.push({ title: ch.title, idx: cues.length, start: +T.toFixed(3) });
  for (const c of ch.cues) {
    const speech = c.say.split(/\s+/).length / rate + 1.0, hold = c.hold || 0;
    cues.push({ say: c.say, caption: c.caption || caption(c.say), ch: ch.title, start: +T.toFixed(3), speech: +speech.toFixed(3), dur: +(speech + hold).toFixed(3), hold,
      ops: (c.ops || []).map(o => { const x = Object.assign({}, o); delete x.tex; return x; }) });
    T += speech + hold;
  }
}
const DATA = { meta: Object.assign({}, meta), cues, chapters, dur: +(T + 2.5).toFixed(2) };
console.log(`\nTimeline: ${cues.length} lines, ${chapters.length} chapters, ~${(T / 60).toFixed(1)} min`);

// ---------- 4. assemble one offline file ----------
const kdir = path.dirname(require.resolve('katex/dist/katex.min.css', { paths: [SKILL, process.cwd()] }));
const kcss = fs.readFileSync(path.join(kdir, 'katex.min.css'), 'utf8').replace(/src:url\(fonts\/([^)]+)\.woff2\) format\("woff2"\)[^;}]*/g,
  (m, f) => `src:url(data:font/woff2;base64,${fs.readFileSync(path.join(kdir, 'fonts', f + '.woff2')).toString('base64')}) format("woff2")`);
const esc = s => s.replace(/<\/script/gi, '<\\/script');
const html = fs.readFileSync(path.join(SKILL, 'runtime', 'player.html'), 'utf8')
  .replace('/*KATEX_CSS*/', () => kcss).replace('/*DATA*/', () => esc(JSON.stringify(DATA)))
  .replace('/*RUNTIME*/', () => fs.readFileSync(path.join(SKILL, 'runtime', 'runtime.js'), 'utf8')).replace('%TITLE%', meta.title.replace(/</g, '&lt;'));
const out = path.resolve(outArg || plan.out || planPath.replace(/\.plan\.c?js$/, '').replace(/\.c?js$/, '') + '.html');
fs.writeFileSync(out, html);
console.log(`Built ${out} (${(fs.statSync(out).size / 1024).toFixed(0)} KB)`);
