#!/usr/bin/env node
// Visual QA: screenshots every key moment, checks for console errors and layout problems,
// writes contact-sheet.png + report.json. Exit code 0 = clean.
// Usage: node scripts/qa.cjs <video.html> [--dir qa-out] [--theme safari|vegetation|fiesta|classic]
const fs = require('fs'), path = require('path');
let chromium;
try { ({ chromium } = require(require.resolve('playwright', { paths: [path.join(__dirname, '..'), process.cwd()] }))); }
catch (e) { console.error('Playwright not installed. Run: npm i playwright && npx playwright install chromium'); process.exit(2); }
const args = process.argv.slice(2);
const file = path.resolve(args.find((a, i) => !a.startsWith('--') && !['--dir', '--theme'].includes(args[i - 1])) || '');
const dir = path.resolve(args.includes('--dir') ? args[args.indexOf('--dir') + 1] : path.join(path.dirname(file), 'qa-' + path.basename(file, '.html')));
const theme = args.includes('--theme') ? args[args.indexOf('--theme') + 1] : null;

(async () => {
  fs.mkdirSync(dir, { recursive: true });
  const b = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}); const pg = await b.newPage({ viewport: { width: 1152, height: 700 } });
  const errs = []; pg.on('pageerror', e => errs.push(String(e))); pg.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await pg.goto('file://' + file); await pg.waitForTimeout(1200);
  if (theme) await pg.evaluate(th => { let n = 0; while (document.getElementById('frame').dataset.theme !== th && n++ < 6) document.getElementById('themeBtn').click(); }, theme);
  await pg.waitForTimeout(300);
  // key moments: the end of every line that boxes an answer or changes a panel, plus every chapter end
  const moments = await pg.evaluate(() => {
    const out = [], C = DATA.cues;
    C.forEach((c, i) => { const last = i === C.length - 1 || C[i + 1].ch !== c.ch; if (last || c.ops.some(o => o.box || 'panel' in o)) out.push({ i, t: c.start + c.dur - .3, label: `${i + 1}. ${c.ch}` }); });
    return out;
  });
  const shots = [], problems = [];
  for (const m of moments) {
    await pg.evaluate(t => { document.getElementById('bigplay').hidden = true; window.__seek(t); }, m.t); await pg.waitForTimeout(900);
    await pg.evaluate(t => window.__seek(t), m.t); await pg.waitForTimeout(80);
    const p = await pg.evaluate(() => {
      const out = [], vp = document.querySelector('#lines').parentElement, vr = vp.getBoundingClientRect(), fr = document.getElementById('frame').getBoundingClientRect();
      document.querySelectorAll('#lines .ln').forEach(ln => {
        const r = ln.getBoundingClientRect(), mm = ln.firstChild, n = ln.querySelector('.note');
        const k = mm.querySelector('.katex') || mm, w = k.scrollWidth + 20 + (n ? n.offsetWidth + 18 : 0);
        if (+getComputedStyle(ln).opacity > .5 && r.top >= vr.top - 2 && w > vp.clientWidth + 4) out.push('board line overflows: ' + ln.textContent.slice(0, 50));
      });
      document.querySelectorAll('.tag').forEach(tg => { if (+tg.style.opacity > .5) { const r = tg.getBoundingClientRect(); if (r.left < fr.left || r.right > fr.right || r.top < fr.top) out.push('label off screen: ' + tg.textContent); } });
      return out;
    });
    p.forEach(x => problems.push(`${m.label}: ${x}`));
    const f = path.join(dir, `shot-${String(m.i + 1).padStart(3, '0')}.png`);
    await pg.locator('#frame').screenshot({ path: f }); shots.push({ f, label: m.label });
  }
  const cells = shots.map(s => `<figure><img src="data:image/png;base64,${fs.readFileSync(s.f).toString('base64')}"><figcaption>${s.label}</figcaption></figure>`).join('');
  const sheet = await b.newPage({ viewport: { width: 1500, height: 800 } });
  await sheet.setContent(`<style>body{margin:0;background:#111;color:#ddd;font:13px system-ui;display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding:8px}img{width:100%;display:block;border-radius:6px}figure{margin:0}figcaption{padding:4px 2px}</style>${cells}`);
  await sheet.waitForTimeout(300);
  await sheet.screenshot({ path: path.join(dir, 'contact-sheet.png'), fullPage: true });
  const report = { file, theme: theme || 'plan default', shots: shots.length, errors: errs, problems, ok: !errs.length && !problems.length };
  fs.writeFileSync(path.join(dir, 'report.json'), JSON.stringify(report, null, 2));
  console.log(`${shots.length} moments captured → ${path.join(dir, 'contact-sheet.png')}`);
  console.log(errs.length ? 'Console errors:\n  ' + errs.join('\n  ') : 'No console errors.');
  console.log(problems.length ? 'Layout problems:\n  ' + problems.join('\n  ') : 'No layout problems found.');
  await b.close(); process.exit(report.ok ? 0 : 1);
})();
