#!/usr/bin/env node
// Visual QA for an explainer video, on the screens StudyPipe students actually use.
// Screenshots every key moment on each viewport, checks console errors and layout, and writes
// contact-sheet-<viewport>.png + report.json. Exit code 0 = clean.
//
// Usage: node scripts/qa.cjs <video.html> [--dir qa-out] [--theme unit|safari|vegetation|fiesta|classic]
//                                         [--viewports portrait,landscape,desktop]   (default: all three)
const fs = require('fs'), path = require('path');
let chromium;
try { ({ chromium } = require(require.resolve('playwright', { paths: [path.join(__dirname, '..'), process.cwd()] }))); }
catch (e) { console.error('Playwright not installed. Run: npm i playwright && npx playwright install chromium'); process.exit(2); }
const args = process.argv.slice(2);
const opt = k => (args.includes(k) ? args[args.indexOf(k) + 1] : null);
const file = path.resolve(args.find((a, i) => !a.startsWith('--') && !['--dir', '--theme', '--viewports'].includes(args[i - 1])) || '');
if (!fs.existsSync(file)) { console.error('Usage: node scripts/qa.cjs <video.html> [--dir out] [--theme id] [--viewports portrait,landscape,desktop]'); process.exit(2); }
const dir = path.resolve(opt('--dir') || path.join(path.dirname(file), 'qa-' + path.basename(file, '.html')));
const theme = opt('--theme');
const VIEWPORTS = {
  portrait: { viewport: { width: 360, height: 740 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, phone: true },
  landscape: { viewport: { width: 740, height: 360 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, phone: true },
  desktop: { viewport: { width: 1152, height: 700 }, deviceScaleFactor: 1 },
};
const which = (opt('--viewports') || 'portrait,landscape,desktop').split(',').map(s => s.trim()).filter(v => VIEWPORTS[v]);

// Readability floors on phones (CSS px)
const MIN_BOARD_PX = 12, MIN_KIT_LABEL_PX = 8.5, MIN_CAPTION_PX = 12;

(async () => {
  fs.mkdirSync(dir, { recursive: true });
  const b = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
  const report = { file, theme: theme || 'plan default', viewports: {}, ok: true };

  for (const name of which) {
    const V = VIEWPORTS[name];
    const ctx = await b.newContext({ viewport: V.viewport, deviceScaleFactor: V.deviceScaleFactor, isMobile: !!V.isMobile, hasTouch: !!V.hasTouch });
    const pg = await ctx.newPage();
    const errs = []; pg.on('pageerror', e => errs.push(String(e))); pg.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    await pg.goto('file://' + file); await pg.waitForTimeout(1200);
    if (theme) await pg.evaluate(th => { let n = 0; while (document.getElementById('frame').dataset.theme !== th && n++ < 6) document.getElementById('themeBtn').click(); }, theme);
    await pg.waitForTimeout(300);
    // key moments: the end of every line that boxes an answer or changes a panel, plus every chapter end
    const moments = await pg.evaluate(() => {
      const out = [], C = DATA.cues;
      C.forEach((c, i) => { const last = i === C.length - 1 || C[i + 1].ch !== c.ch; if (last || c.ops.some(o => o.box || 'panel' in o || 'camera' in o)) out.push({ i, t: c.start + c.dur - .3, label: `${i + 1}. ${c.ch}` }); });
      return out;
    });
    const shots = [], problems = [];
    // Tap targets: after the title card has faded, every control must be the element actually under the finger.
    // (An invisible layer over the control bar made every tap pause the video in the original runtime.)
    {
      await pg.evaluate(() => { document.getElementById('bigplay').hidden = true; window.__seek(8); document.getElementById('frame').classList.add('ctl'); document.getElementById('frame').classList.remove('idle'); });
      await pg.waitForTimeout(500);
      const blocked = await pg.evaluate(() => ['play', 'prev', 'next', 'cc', 'mute', 'fs', 'scrub'].map(id => {
        const el = document.getElementById(id), r = el.getBoundingClientRect();
        if (getComputedStyle(el).display === 'none') return null;
        const x = r.left + r.width / 2, y = r.top + r.height / 2;
        if (x < 0 || y < 0 || x > innerWidth || y > innerHeight) return `${id}: off screen`;
        const hit = document.elementFromPoint(x, y);
        return hit && (hit === el || el.contains(hit)) ? null : `${id}: covered by ${hit ? (hit.id || hit.className || hit.tagName) : 'nothing'}`;
      }).filter(Boolean));
      blocked.forEach(b => problems.push(`control not tappable — ${b}`));
    }
    for (const m of moments) {
      await pg.evaluate(t => { document.getElementById('bigplay').hidden = true; window.__seek(t); }, m.t); await pg.waitForTimeout(V.phone ? 700 : 900);
      await pg.evaluate(t => window.__seek(t), m.t); await pg.waitForTimeout(80);
      const p = await pg.evaluate(({ phone, MIN_BOARD_PX, MIN_KIT_LABEL_PX, MIN_CAPTION_PX }) => {
        const out = [], $ = id => document.getElementById(id), R = e => e.getBoundingClientRect();
        const vp = $('lines').parentElement, vr = R(vp), fr = R($('frame'));
        const overlap = (a, b) => Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top)) > 40;
        document.querySelectorAll('#lines .ln').forEach(ln => {
          if (+getComputedStyle(ln).opacity <= .5 || R(ln).top < vr.top - 2) return;
          const mm = ln.firstChild, n = ln.querySelector('.note'), k = mm.querySelector('.katex') || mm;
          const wraps = getComputedStyle(ln).flexWrap === 'wrap';
          const w = k.scrollWidth + 20 + (n && !wraps ? n.offsetWidth + 18 : 0);
          if (w > vp.clientWidth + 4) out.push('board line overflows: ' + ln.textContent.slice(0, 50));
          if (phone && parseFloat(getComputedStyle(mm).fontSize) < MIN_BOARD_PX) out.push(`board line shrunk to ${parseFloat(getComputedStyle(mm).fontSize).toFixed(1)}px (min ${MIN_BOARD_PX}): split it across lines — ` + ln.textContent.slice(0, 40));
        });
        document.querySelectorAll('.tag').forEach(tg => { if (+tg.style.opacity > .5) { const r = R(tg); if (r.left < fr.left || r.right > fr.right || r.top < fr.top) out.push('label off screen: ' + tg.textContent); } });
        const cap = $('cap'), capT = $('capText');
        if (phone && capT.textContent) {
          const fs = parseFloat(getComputedStyle(cap).fontSize), lh = parseFloat(getComputedStyle(cap).lineHeight) || fs * 1.4, lines = Math.round(R(capT).height / lh);
          if (fs < MIN_CAPTION_PX) out.push(`caption ${fs.toFixed(1)}px (min ${MIN_CAPTION_PX})`);
          const maxLines = window.matchMedia('(max-width: 619px)').matches ? 2 : 1;
          if (lines > maxLines) out.push(`caption shows ${lines} lines (max ${maxLines}): "${capT.textContent.slice(0, 50)}"`);
          if ($('frame').classList.contains('ctl') && overlap(R(capT), R($('controls').querySelector('.seek')))) out.push('caption overlaps the seek bar');
        }
        if (phone) {
          const panel = $('panel');
          if (+getComputedStyle(panel).opacity > .5 && panel.offsetHeight > 20) {
            if (!panel.style.transform && overlap(R($('board')), R(panel)) && window.matchMedia('(max-width: 619px)').matches) out.push('board and kit panel overlap');   // a camera kit shot overlaps on purpose
            const seen = t => { let o = 1; for (let e = t; e && e !== panel; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden') return 0; o *= +cs.opacity; } return o; };   // effective visibility, through parent groups
            let small = Infinity, which = '';
            panel.querySelectorAll('text').forEach(t => { if (!t.textContent.trim() || /^[+\-−±·•]$/.test(t.textContent.trim()) || seen(t) < .3) return; const h = R(t).height; if (h > 0 && h < small) { small = h; which = t.textContent; } });
            if (small < MIN_KIT_LABEL_PX * 1.15) out.push(`kit label too small (${(small / 1.15).toFixed(1)}px): "${which.slice(0, 30)}"`);
            // overlapping kit labels (the label boost on phones, or a camera push-in, can make neighbours collide)
            const pr = R(panel), boxes = [...panel.querySelectorAll('text')].filter(t => t.textContent.trim().length > 1 && seen(t) > .3)
              .map(t => ({ t: t.textContent.trim(), r: R(t) })).filter(b => b.r.width > 0 && b.r.right > pr.left && b.r.left < pr.right && b.r.bottom > pr.top && b.r.top < pr.bottom);
            for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
              const a = boxes[i].r, c = boxes[j].r, ix = Math.min(a.right, c.right) - Math.max(a.left, c.left), iy = Math.min(a.bottom, c.bottom) - Math.max(a.top, c.top);
              if (ix > 2 && iy > 2 && ix * iy > .25 * Math.min(a.width * a.height, c.width * c.height)) out.push(`kit labels overlap: "${boxes[i].t.slice(0, 20)}" × "${boxes[j].t.slice(0, 20)}"`);
            }
          }
        }
        return out;
      }, { phone: !!V.phone, MIN_BOARD_PX, MIN_KIT_LABEL_PX, MIN_CAPTION_PX });
      p.forEach(x => problems.push(`${m.label}: ${x}`));
      const f = path.join(dir, `${name}-${String(m.i + 1).padStart(3, '0')}.png`);
      await pg.locator('#frame').screenshot({ path: f }); shots.push({ f, label: m.label });
    }
    const cols = name === 'portrait' ? 5 : 3;
    const cells = shots.map(s => `<figure><img src="data:image/png;base64,${fs.readFileSync(s.f).toString('base64')}"><figcaption>${s.label}</figcaption></figure>`).join('');
    const sheet = await b.newPage({ viewport: { width: 1500, height: 800 } });
    await sheet.setContent(`<style>body{margin:0;background:#111;color:#ddd;font:13px system-ui;display:grid;grid-template-columns:repeat(${cols},1fr);gap:8px;padding:8px}img{width:100%;display:block;border-radius:6px}figure{margin:0}figcaption{padding:4px 2px}</style>${cells}`);
    await sheet.waitForTimeout(300);
    const sheetPath = path.join(dir, `contact-sheet-${name}.png`);
    await sheet.screenshot({ path: sheetPath, fullPage: true }); await sheet.close();
    const uniq = [...new Set(problems)];
    report.viewports[name] = { size: V.viewport, shots: shots.length, errors: errs, problems: uniq, sheet: sheetPath };
    if (errs.length || uniq.length) report.ok = false;
    console.log(`\n[${name} ${V.viewport.width}×${V.viewport.height}] ${shots.length} moments → ${sheetPath}`);
    console.log(errs.length ? '  Console errors:\n    ' + errs.join('\n    ') : '  No console errors.');
    console.log(uniq.length ? '  Layout problems:\n    ' + uniq.join('\n    ') : '  No layout problems found.');
    await ctx.close();
  }
  fs.writeFileSync(path.join(dir, 'report.json'), JSON.stringify(report, null, 2));
  await b.close(); process.exit(report.ok ? 0 : 1);
})();
