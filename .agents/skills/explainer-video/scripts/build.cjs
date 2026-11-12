#!/usr/bin/env node
// Explainer video build: validate plan → verify checks → render LaTeX → assemble one offline HTML file.
// Usage: node scripts/build.cjs <plan.cjs> [--out file.html] [--check-only] [--unit topics/<slug>/html]
//   (default)  one self-contained offline file (KaTeX, runtime and a rounded font inlined, ~0.6 MB)
//   --unit     a light page for a StudyPipe unit: shares assets/video/ (KaTeX + runtime, written once per unit)
//              and uses the unit's fonts.css + theme.css, so the video follows the unit's theme
const fs = require('fs'), path = require('path');
const SKILL = path.join(__dirname, '..');
const katex = require(require.resolve('katex', { paths: [SKILL, process.cwd()] }));
const args = process.argv.slice(2);
const planArg = args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--out' && args[i - 1] !== '--unit');
const planPath = planArg ? path.resolve(planArg) : '';
if (!planPath || !fs.existsSync(planPath)) { console.error('Usage: node scripts/build.cjs <plan.cjs> [--out file.html] [--check-only]'); process.exit(2); }
const outArg = args.includes('--out') ? args[args.indexOf('--out') + 1] : null;
const unitArg = args.includes('--unit') ? path.resolve(args[args.indexOf('--unit') + 1]) : null;
if (unitArg && !fs.existsSync(path.join(unitArg, 'assets', 'css', 'theme.css'))) { console.error(`--unit ${unitArg}: no assets/css/theme.css (run scripts/apply-theme.mjs on the topic first)`); process.exit(2); }
const plan = require(planPath);
const BUILTIN_KITS = ['circuit', 'cell', 'toll', 'graph', 'area'];
// Plug-in kits: <dir>/<id>/kit.js. The studio library is kits/video/ (built on the fly by the video-kit-engineer).
const vm = require('vm');
const KIT_DIRS = [...new Set([path.join(process.cwd(), 'kits', 'video'), path.join(SKILL, '..', '..', '..', 'kits', 'video'), path.join(SKILL, 'runtime', 'kits')].map(d => path.resolve(d)))];
const PLUGINS = {};
for (const dir of KIT_DIRS) {
  if (!fs.existsSync(dir)) continue;
  for (const id of fs.readdirSync(dir)) {
    const file = path.join(dir, id, 'kit.js');
    if (!fs.existsSync(file) || PLUGINS[id]) continue;
    const box = { window: { VIDEO_KITS: {} } }; box.window.window = box.window;
    try { vm.runInNewContext(fs.readFileSync(file, 'utf8'), box, { filename: file, timeout: 1000 }); }
    catch (e) { console.error(`kit ${id}: ${file} does not load: ${e.message}`); process.exit(2); }
    const K = box.window.VIDEO_KITS[id];
    if (!K || typeof K.create !== 'function') { console.error(`kit ${id}: ${file} must set (window.VIDEO_KITS = window.VIDEO_KITS || {}).${id} = { create(svg, api) {…} }`); process.exit(2); }
    PLUGINS[id] = { file, states: K.states || null, focus: K.focus || {} };
  }
}
const KITS = [...BUILTIN_KITS, ...Object.keys(PLUGINS)];
const THEMES = ['unit', 'safari', 'vegetation', 'fiesta', 'classic'];   // unit = follow the StudyPipe unit's theme tokens
const errors = [], warnings = [];
// Camera close-up regions, read from the runtime (single source of truth).
const RT_SRC = fs.readFileSync(path.join(SKILL, 'runtime', 'runtime.js'), 'utf8');
const FOCUS = Function('return ' + RT_SRC.match(/const FOCUS = (\{[\s\S]*?\}); \/\/ end FOCUS/)[1])();
for (const [id, K] of Object.entries(PLUGINS)) FOCUS[id] = K.focus;
const SHOTS = ['wide', 'kit', 'board'];
let curPanelB = null;
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
      if ('panel' in o && o.panel !== null && !KITS.includes(o.panel)) err(`${where}: panel "${o.panel}" is not a kit (${KITS.join(', ')}). Request it (06-videos/kit-requests/${o.panel}.md) so the video-kit-engineer builds it; never improvise drawing code in a plan.`);
      if (o.panel && PLUGINS[o.panel] && PLUGINS[o.panel].states && o.s) {
        for (const key of Object.keys(o.s)) if (!(key in PLUGINS[o.panel].states)) err(`${where}: kit "${o.panel}" has no state "${key}" (states: ${Object.keys(PLUGINS[o.panel].states).join(', ')})`);
      }
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
      if ('panel' in o) curPanelB = o.panel || null;
      if ('camera' in o) {
        if (!SHOTS.includes(o.camera)) err(`${where}: camera "${o.camera}" is not a shot (${SHOTS.join(', ')})`);
        if (o.camera === 'kit' && !curPanelB) warn(`${where}: camera 'kit' with no kit on screen does nothing`);
        if (o.focus != null) {
          if (!curPanelB) err(`${where}: camera focus "${o.focus}" needs a kit on screen`);
          else if (Array.isArray(o.focus) && o.focus.every(v => typeof v === 'string')) {
            if (curPanelB !== 'graph') err(`${where}: camera focus as a list of ids is only for the graph kit`);
            else { const S = lastGraphSpec; for (const id of o.focus) if (S && !(S.items || []).some(i => i.id === id)) err(`${where}: camera focus "${id}" is not an item in graph spec "${S.id}"`); }
          }
          else if (Array.isArray(o.focus)) { if (o.focus.length !== 4 || !o.focus.every(Number.isFinite)) err(`${where}: camera focus [x, y, w, h] needs 4 numbers (kit space 0–420)`); }
          else if (typeof o.focus === 'object') { if (curPanelB !== 'graph' || !Array.isArray(o.focus.x) || !Array.isArray(o.focus.y)) err(`${where}: camera focus {x:[a,b], y:[c,d]} (data units) is only for the graph kit`); }
          else if (curPanelB === 'graph') { const S = lastGraphSpec; if (S && !(S.items || []).some(i => i.id === o.focus)) err(`${where}: camera focus "${o.focus}" is not an item in graph spec "${S.id}"`); }
          else if (!FOCUS[curPanelB] || !FOCUS[curPanelB][o.focus]) err(`${where}: camera focus "${o.focus}" is not a region of kit "${curPanelB}" (${Object.keys(FOCUS[curPanelB] || {}).join(', ') || 'none'})`);
        }
        if (o.dur != null && !(o.dur >= 0 && o.dur <= 4)) err(`${where}: camera dur ${o.dur}s (0–4; use cut: true for a hard cut)`);
        if (o.drift != null && !(o.drift >= 0 && o.drift <= 1)) err(`${where}: camera drift ${o.drift} (0–1)`);
      }
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

// ---------- 4. assemble ----------
const kdir = path.dirname(require.resolve('katex/dist/katex.min.css', { paths: [SKILL, process.cwd()] }));
const kcssRaw = fs.readFileSync(path.join(kdir, 'katex.min.css'), 'utf8');
const WOFF2 = /src:url\(fonts\/([^)]+)\.woff2\) format\("woff2"\)[^;}]*/g;   // keep woff2 only (no missing-file requests offline)
const esc = s => s.replace(/<\/script/gi, '<\\/script');
const tpl = fs.readFileSync(path.join(SKILL, 'runtime', 'player.html'), 'utf8');
const playerCss = tpl.match(/<style>\s*(:root \{ color-scheme[\s\S]*?)<\/style>/)[1];
const runtimeJs = fs.readFileSync(path.join(SKILL, 'runtime', 'runtime.js'), 'utf8');
const out = path.resolve(outArg || plan.out || planPath.replace(/\.plan\.c?js$/, '').replace(/\.c?js$/, '') + '.html');
let html = tpl.replace('/*DATA*/', () => esc(JSON.stringify(DATA))).replace('%TITLE%', meta.title.replace(/</g, '&lt;'));

// plug-in kits this plan uses (only those are shipped)
const usedPlugins = [...new Set(plan.chapters.flatMap(ch => (ch.cues || []).flatMap(c => (c.ops || []).map(o => o.panel)).filter(id => id && PLUGINS[id])))];
if (usedPlugins.length) console.log(`Kits: ${usedPlugins.map(id => id + ' (' + path.relative(process.cwd(), PLUGINS[id].file) + ')').join(', ')}`);
if (unitArg) {
  // Shared once per unit: assets/video/{katex/, player.css, video-runtime.js}
  const vdir = path.join(unitArg, 'assets', 'video'), kout = path.join(vdir, 'katex');
  fs.mkdirSync(path.join(kout, 'fonts'), { recursive: true });
  const used = new Set();
  fs.writeFileSync(path.join(kout, 'katex.min.css'), kcssRaw.replace(WOFF2, (m, f) => { used.add(f); return `src:url(fonts/${f}.woff2) format("woff2")`; }));
  for (const f of used) fs.copyFileSync(path.join(kdir, 'fonts', f + '.woff2'), path.join(kout, 'fonts', f + '.woff2'));
  fs.writeFileSync(path.join(vdir, 'player.css'), playerCss);
  fs.writeFileSync(path.join(vdir, 'video-runtime.js'), runtimeJs);
  const rel = path.relative(path.dirname(out), unitArg).split(path.sep).join('/') || '.';
  html = html
    .replace('<style>/*KATEX_CSS*/</style>', `<link rel="stylesheet" href="${rel}/assets/video/katex/katex.min.css">`)
    .replace(/<style>\s*:root \{ color-scheme[\s\S]*?<\/style>/, () => [
      `<link rel="stylesheet" href="${rel}/assets/css/fonts.css">`,
      `<link rel="stylesheet" href="${rel}/assets/css/theme.css">`,
      `<link rel="stylesheet" href="${rel}/assets/video/player.css">`].join('\n'))
    .replace('<script>/*RUNTIME*/</script>', () => [
      ...usedPlugins.map(id => { fs.mkdirSync(path.join(vdir, 'kits'), { recursive: true }); fs.copyFileSync(PLUGINS[id].file, path.join(vdir, 'kits', id + '.js')); return `<script src="${rel}/assets/video/kits/${id}.js"></script>`; }),
      `<script src="${rel}/assets/video/video-runtime.js"></script>`].join('\n'));
} else {
  // Standalone: everything inline, including a rounded UI font (offline; no system-font lottery).
  const kcss = kcssRaw.replace(WOFF2, (m, f) => `src:url(data:font/woff2;base64,${fs.readFileSync(path.join(kdir, 'fonts', f + '.woff2')).toString('base64')}) format("woff2")`);
  let fontCss = '';
  for (const dir of [path.join(SKILL, '..', '..', '..', 'themes', '_fonts', 'nunito'), path.join(SKILL, 'runtime', 'fonts')]) {
    const f = path.join(dir, 'nunito-latin-wght-normal.woff2');
    if (fs.existsSync(f)) { fontCss = `@font-face{font-family:"Nunito";font-style:normal;font-weight:200 1000;font-display:swap;src:url(data:font/woff2;base64,${fs.readFileSync(f).toString('base64')}) format("woff2")}:root{--video-rounded:"Nunito",ui-rounded,system-ui,sans-serif}`; break; }
  }
  if (!fontCss) console.log('  ! rounded font not found (themes/_fonts/nunito); falling back to system fonts');
  html = html.replace('/*KATEX_CSS*/', () => kcss + fontCss).replace('/*RUNTIME*/', () => usedPlugins.map(id => esc(fs.readFileSync(PLUGINS[id].file, 'utf8'))).join('\n;\n') + '\n;\n' + runtimeJs);
}
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, html);
console.log(`Built ${out} (${(fs.statSync(out).size / 1024).toFixed(0)} KB${unitArg ? ', unit mode: shared assets in ' + path.relative(process.cwd(), path.join(unitArg, 'assets', 'video')) : ', standalone'})`);
