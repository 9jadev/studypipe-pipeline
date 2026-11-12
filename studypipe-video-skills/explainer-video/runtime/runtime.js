(() => {
  const { cues, chapters, meta, dur: DUR } = DATA;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const seg = (t, a, b) => clamp((t - a) / (b - a), 0, 1);
  const lerp = (a, b, u) => a + (b - a) * u;
  const easeOutQ = u => 1 - Math.pow(1 - u, 3);
  const ease = u => u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
  const frac = x => x - Math.floor(x);
  const backOut = u => { const c1 = 2.2, c3 = c1 + 1; return 1 + c3 * Math.pow(u - 1, 3) + c1 * Math.pow(u - 1, 2); };
  const bounceOut = x => { const n = 7.5625, d = 2.75; if (x < 1 / d) return n * x * x; if (x < 2 / d) return n * (x -= 1.5 / d) * x + .75; if (x < 2.5 / d) return n * (x -= 2.25 / d) * x + .9375; return n * (x -= 2.625 / d) * x + .984375; };
  const spring = x => x < 0 ? 0 : Math.exp(-5 * x) * Math.sin(16 * x);
  const $ = id => document.getElementById(id);
  const cueAt = t => { let i = 0; while (i < cues.length - 1 && cues[i + 1].start <= t) i++; return i; };
  const lastEnd = cues[cues.length - 1].start + cues[cues.length - 1].dur;

  // ---------- replay plan: board snapshots + panel keyframes ----------
  const snaps = [], PK = [], lastState = {};
  let st = { heading: '', headingT: 0, lines: [], boxed: {} };
  cues.forEach(c => {
    st = JSON.parse(JSON.stringify(st)); st.hl = [];
    for (const o of c.ops) {
      const at = c.start + (o.at != null ? o.at : .35);
      if ('clear' in o) { st.heading = o.clear; st.headingT = c.start + .05; st.lines = []; st.boxed = {}; }
      if (o.write) st.lines.push({ id: o.write, html: o.html, note: o.note || '', t0: at });
      if (o.box) st.boxed[o.box] = c.start + 1.8;
      if (o.hl) st.hl = o.hl;
      if ('panel' in o) {
        if (o.panel) { const s = Object.assign({}, o.fresh ? {} : (lastState[o.panel] || {}), o.s || {}); lastState[o.panel] = s; PK.push({ t: at, panel: o.panel, s }); }
        else PK.push({ t: at, panel: null });
      }
    }
    snaps.push(st);
  });
  function panelAt(t) {
    let k = -1; for (let i = 0; i < PK.length && PK[i].t <= t; i++) k = i;
    if (k < 0) return { panel: null };
    const cur = PK[k], prev = PK[k - 1];
    return { panel: cur.panel, s: cur.s, p: prev && prev.panel === cur.panel ? prev.s : cur.s, u: ease(seg(t, cur.t, cur.t + 1.4)), t0: cur.t };
  }
  const mixN = (p, s, key, u, d = 0) => lerp(p[key] != null ? +p[key] : d, s[key] != null ? +s[key] : d, u);

  // ---------- board ----------
  const stage = $('stage'), linesEl = $('lines'), headingEl = $('heading');
  let built = -1, lineEls = [], heights = [], stageCls = '';
  function buildBoard(i) {
    const s = snaps[i];
    headingEl.textContent = s.heading;
    linesEl.innerHTML = s.lines.map(l => `<div class="ln"><div class="m">${l.html}${s.boxed[l.id] != null ? '<i class="spk"></i>'.repeat(10) : ''}</div>${l.note ? `<div class="note">${l.note}</div>` : ''}</div>`).join('');
    lineEls = [...linesEl.children];
    fitLines(); built = i;
  }
  let fitW = -1;
  function fitLines() {
    const avail = linesEl.parentElement.clientWidth - 6; fitW = avail + 6;
    lineEls.forEach(ln => { const m = ln.firstChild, nt = ln.querySelector('.note'); m.style.fontSize = ''; const k = m.querySelector('.katex') || m, mw = k.scrollWidth + 20, w = mw + (nt ? nt.offsetWidth + parseFloat(getComputedStyle(ln).columnGap || 0) : 0); if (w > avail) { const base = parseFloat(getComputedStyle(m).fontSize); m.style.fontSize = Math.max(base * .62, base * (avail - (w - mw)) / mw * .98) + 'px'; } });
    heights = lineEls.map(e => e.offsetHeight);
  }
  function drawBoard(t, i) {
    const s = snaps[i];
    if (built !== i) buildBoard(i);
    if (linesEl.parentElement.clientWidth !== fitW) fitLines();
    if (heights.some(h => h === 0)) heights = lineEls.map(e => e.offsetHeight);
    let shown = 0;
    s.lines.forEach((l, k) => {
      const el = lineEls[k], q = seg(t, l.t0, l.t0 + .75), p = ease(q);
      if (motion === 'pop') {
        const b = backOut(q); el.style.clipPath = 'none';
        el.style.transform = q >= 1 ? '' : `translateY(${((1 - b) * 22).toFixed(1)}px) scale(${(.55 + .45 * b).toFixed(3)})`;
        el.style.opacity = Math.min(1, q * 2.5);
      } else { el.style.transform = ''; el.style.clipPath = p >= 1 ? 'none' : `inset(-30% ${(100 - p * 100).toFixed(1)}% -30% -3%)`; el.style.opacity = p > 0 ? 1 : 0; }
      const tb = s.boxed[l.id];
      if (tb != null) {
        const x = t - tb, m = el.firstChild;
        m.style.transform = x >= 0 && x < 1 && motion === 'pop' ? `scale(${(1 + .09 * spring(x * 1.2)).toFixed(3)})` : '';
        const sp = m.querySelectorAll('.spk');
        sp.forEach((e, j) => { const a = j / sp.length * 6.283 + .3, d = 14 + 70 * easeOutQ(seg(x, 0, .9)), o = x >= 0 && x < 1 ? 1 - x : 0;
          e.style.opacity = o.toFixed(2); if (!o) { e.style.transform = 'none'; return; } e.style.transform = `translate(${(Math.cos(a) * d).toFixed(1)}px, ${(Math.sin(a) * d * .7).toFixed(1)}px) rotate(${(x * 400 + j * 30).toFixed(0)}deg) scale(${(1.4 - x).toFixed(2)})`; });
      }
      el.classList.toggle('noted', t > l.t0 + 1.0);
      el.classList.toggle('boxed', s.boxed[l.id] != null && t >= s.boxed[l.id]);
      if (t >= l.t0) shown += heights[k];
    });
    const hx = seg(t, s.headingT, s.headingT + .9), hb = motion === 'pop' ? bounceOut(hx) : ease(hx);
    headingEl.style.transform = `translateY(${((1 - hb) * -40).toFixed(1)}px) rotate(${(motion === 'pop' ? spring(t - s.headingT) * -3 : 0).toFixed(2)}deg)`;
    headingEl.style.opacity = Math.min(1, hx * 3);
    const need = shown - linesEl.parentElement.clientHeight + 4; let off = 0;
    for (let k = 0; k < heights.length && off < need; k++) off += heights[k];
    linesEl.style.transform = `translateY(${-off}px)`;
  }

  // ---------- SVG helpers ----------
  const panel = $('panel'), pin = $('pin'), NS = 'http://www.w3.org/2000/svg';
  const el = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); parent && parent.appendChild(e); return e; };
  const tx = (s, x, y, size, fill, parent, anchor = 'middle', weight = 500) => { const e = el('text', { x, y, 'font-size': size, fill, 'text-anchor': anchor, 'dominant-baseline': 'middle', 'font-weight': weight }, parent); e.textContent = s; return e; };
  const PAL = { gold: '#ffd25e', amber: '#ffc061', blue: '#6fb7ff', sky: '#73d6ff', red: '#ff6b6b', green: '#7cf0a5', purple: '#c39bff', pink: '#ff8ad8', orange: '#ffa04d', white: '#f3f6f4' };
  const C = { E: PAL.gold, V: PAL.blue, v: PAL.red, I: PAL.green, R: PAL.purple, wire: '#c9d6cf', dim: '#9fb3a8' };
  (() => { const roles = meta.roles || {}; let css = '';
    for (const k in roles) { const c = PAL[roles[k].color] || roles[k].color; css += `.role-${k}{color:${c};display:inline-block;border-radius:.3em;transition:background .3s,box-shadow .3s}.hl-${k} .role-${k}{background:${c}2e;box-shadow:0 0 0 .18em ${c}2e;transform:rotate(var(--wig,0deg)) scale(1.08)}`; }
    const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st); })();
  const fmt1 = (n, d = 1) => n.toFixed(d);

  // ===== KIT: circuit bench =====
  const circ = el('svg', { viewBox: '0 0 420 420' }); const CB = {};
  (() => {
    const g = circ;
    CB.full = el('path', { d: 'M110 165 V70 H380 V350 H85 V285', fill: 'none', stroke: 'none' }, g);
    el('path', { d: 'M110 165 V70 H165', fill: 'none', stroke: C.wire, 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
    el('path', { d: 'M235 70 H380 V350 H300 M180 350 H85 V285', fill: 'none', stroke: C.wire, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    // resistor
    el('path', { d: 'M180 350 l8 -14 l14 28 l14 -28 l14 28 l14 -28 l14 28 l14 -28 l14 28 l8 -14', fill: 'none', stroke: C.R, 'stroke-width': 4, 'stroke-linejoin': 'round' }, g);
    CB.rlab = tx('2.8 Ω', 240, 388, 20, C.R, g, 'middle', 700);
    // switch
    el('circle', { cx: 170, cy: 70, r: 6, fill: '#d9b36a' }, g); el('circle', { cx: 230, cy: 70, r: 6, fill: '#d9b36a' }, g);
    CB.lever = el('line', { x1: 170, y1: 70, x2: 230, y2: 70, stroke: '#e3b65c', 'stroke-width': 6, 'stroke-linecap': 'round' }, g);
    tx('switch', 200, 44, 14, C.dim, g);
    // battery
    CB.bat = el('rect', { x: 40, y: 165, width: 90, height: 120, rx: 8, fill: '#232a36', stroke: '#5c6675', 'stroke-width': 2 }, g);
    el('rect', { x: 40, y: 200, width: 90, height: 18, fill: '#e3b02a' }, g);
    CB.batlab = tx('12 V', 85, 250, 20, '#e8efe9', g, 'middle', 700);
    CB.tp = el('rect', { x: 102, y: 155, width: 16, height: 12, rx: 2, fill: '#c0392b' }, g); tx('+', 120, 145, 18, '#ff8a7a', g, 'start', 800);
    CB.tn = el('rect', { x: 77, y: 285, width: 16, height: 10, rx: 2, fill: '#222' }, g); tx('−', 62, 300, 20, '#9fb3a8', g, 'middle', 800);
    CB.rin = el('g', {}, g);
    el('path', { d: 'M52 182 l6 -8 l8 16 l8 -16 l8 16 l8 -16 l8 16 l8 -16 l6 8', fill: 'none', stroke: C.v, 'stroke-width': 3 }, CB.rin);
    tx('r', 85, 160, 18, C.v, CB.rin, 'middle', 700);
    CB.brace = el('g', {}, g);
    tx('total resistance = R + r', 240, 22, 17, '#ffe08a', CB.brace, 'middle', 700);
    CB.loss = tx('', 85, 318, 15, C.v, g, 'middle', 700);
    // voltmeter (across the battery)
    el('path', { d: 'M130 190 C 160 190, 160 215, 186 215', fill: 'none', stroke: '#7a8a82', 'stroke-width': 2, 'stroke-dasharray': '5 4' }, g);
    el('path', { d: 'M130 262 C 165 262, 200 280, 230 272', fill: 'none', stroke: '#7a8a82', 'stroke-width': 2, 'stroke-dasharray': '5 4' }, g);
    const vx = 262, vy = 205, vr = 70; CB.vx = vx; CB.vy = vy; CB.vr = vr;
    el('circle', { cx: vx, cy: vy, r: vr + 6, fill: '#f1ecdf', stroke: '#8b8270', 'stroke-width': 3 }, g);
    CB.vticks = el('g', {}, g);
    CB.ghost = el('path', { fill: 'none', stroke: C.v, 'stroke-width': 9, 'stroke-linecap': 'round', opacity: 0 }, g);
    CB.vneedle = el('line', { x1: vx, y1: vy, x2: vx, y2: vy - vr + 8, stroke: '#c0392b', 'stroke-width': 3.5, 'stroke-linecap': 'round' }, g);
    el('circle', { cx: vx, cy: vy, r: 6, fill: '#333' }, g);
    tx('V', vx, vy + 26, 20, '#333', g, 'middle', 800);
    CB.vread = tx('12.0 V', vx, vy + 98, 22, C.V, g, 'middle', 800);
    // ammeter
    const ax = 380, ay = 195, ar = 30; CB.ax = ax; CB.ay = ay; CB.ar = ar;
    el('circle', { cx: ax, cy: ay, r: ar + 4, fill: '#f1ecdf', stroke: '#8b8270', 'stroke-width': 3 }, g);
    CB.aneedle = el('line', { x1: ax, y1: ay, x2: ax, y2: ay - ar + 5, stroke: '#c0392b', 'stroke-width': 2.5, 'stroke-linecap': 'round' }, g);
    tx('A', ax, ay + 13, 13, '#333', g, 'middle', 800);
    CB.aread = tx('0.0 A', ax, ay + 56, 18, C.I, g, 'middle', 800);
    CB.tick = tx('✓', ax + 2, ay - 52, 26, C.I, g, 'middle', 900);
    CB.focus = el('circle', { fill: 'none', stroke: '#ffe08a', 'stroke-width': 3, 'stroke-dasharray': '6 6', opacity: 0 }, g);
    CB.dots = []; for (let i = 0; i < 16; i++) CB.dots.push(el('circle', { r: 4.5, fill: '#ffe48a' }, g));
    CB.len = 0; CB.vmaxBuilt = 0;
  })();
  const ang = (val, max) => (-120 + 240 * clamp(val / max, 0, 1.05)) * Math.PI / 180;
  const arcPath = (cx, cy, r, a0, a1) => { const p = a => [cx + Math.sin(a) * r, cy - Math.cos(a) * r]; const [x0, y0] = p(a0), [x1, y1] = p(a1); return `M${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 ${Math.abs(a1 - a0) > Math.PI ? 1 : 0} ${a1 > a0 ? 1 : 0} ${x1.toFixed(1)} ${y1.toFixed(1)}`; };
  function buildVTicks(vmax) {
    CB.vticks.innerHTML = '';
    const step = vmax <= 5 ? 1 : 3;
    for (let v = 0; v <= vmax + 1e-9; v += step / 2) {
      const a = ang(v, vmax), major = Math.abs(v / step - Math.round(v / step)) < 1e-6, r1 = CB.vr - (major ? 12 : 7);
      el('line', { x1: CB.vx + Math.sin(a) * r1, y1: CB.vy - Math.cos(a) * r1, x2: CB.vx + Math.sin(a) * CB.vr, y2: CB.vy - Math.cos(a) * CB.vr, stroke: '#333', 'stroke-width': major ? 2.2 : 1.2 }, CB.vticks);
      if (major) tx(String(v), CB.vx + Math.sin(a) * (CB.vr - 24), CB.vy - Math.cos(a) * (CB.vr - 24), 12, '#333', CB.vticks, 'middle', 700);
    }
    CB.vmaxBuilt = vmax;
  }
  function drawCircuit(t, P) {
    const s = P.s, p = P.p, u = P.u;
    if (!CB.len) CB.len = CB.full.getTotalLength() || 900;
    const vmax = s.vmax || 15, amax = s.amax || 5;
    if (CB.vmaxBuilt !== vmax) buildVTicks(vmax);
    const sw = mixN(p, s, 'sw', u), V = mixN(p, s, 'V', u), A = mixN(p, s, 'A', u);
    const la = lerp(-0.62, 0, sw); CB.lever.setAttribute('x2', 170 + Math.cos(la) * 62); CB.lever.setAttribute('y2', 70 + Math.sin(la) * 62);
    const va = ang(V, vmax); CB.vneedle.setAttribute('x2', CB.vx + Math.sin(va) * (CB.vr - 10)); CB.vneedle.setAttribute('y2', CB.vy - Math.cos(va) * (CB.vr - 10));
    CB.vread.textContent = fmt1(V) + ' V';
    const aa = ang(A, amax); CB.aneedle.setAttribute('x2', CB.ax + Math.sin(aa) * (CB.ar - 5)); CB.aneedle.setAttribute('y2', CB.ay - Math.cos(aa) * (CB.ar - 5));
    CB.aread.textContent = (amax <= 1 ? fmt1(A, 2) : fmt1(A)) + ' A';
    const gh = mixN(p, s, 'ghost', u);
    CB.ghost.setAttribute('opacity', (gh * .75).toFixed(2));
    if (gh > 0) CB.ghost.setAttribute('d', arcPath(CB.vx, CB.vy, CB.vr - 4, ang(V, vmax), ang(s.ghostTo != null ? s.ghostTo : vmax, vmax)));
    CB.rlab.textContent = u > .5 ? (s.R || '') : (p.R || s.R || '');
    CB.batlab.textContent = s.bat || '12 V';
    CB.rin.style.opacity = mixN(p, s, 'showr', u); CB.brace.style.opacity = mixN(p, s, 'bracket', u);
    CB.loss.textContent = s.loss || ''; CB.loss.style.opacity = seg(t, P.t0 + .2, P.t0 + 1);
    CB.tick.style.opacity = mixN(p, s, 'tickA', u);
    const tg = s.focus === 'term' ? 1 : 0;
    CB.tp.setAttribute('fill', tg ? C.V : '#c0392b'); CB.tn.setAttribute('fill', tg ? C.V : '#222');
    const F = { V: [CB.vx, CB.vy, CB.vr + 16], A: [CB.ax, CB.ay, CB.ar + 14], bat: [85, 225, 78], term: [100, 225, 86] }[s.focus];
    if (F) { CB.focus.setAttribute('cx', F[0]); CB.focus.setAttribute('cy', F[1]); CB.focus.setAttribute('r', F[2]); CB.focus.setAttribute('opacity', (.5 + .5 * Math.sin(t * 5)) * seg(t, P.t0, P.t0 + .6)); CB.focus.setAttribute('stroke-dashoffset', (t * 20) % 12); } else CB.focus.setAttribute('opacity', 0);
    const speed = .09 * (A / Math.max(amax, .001)) * (amax <= 1 ? 3 : 1.8);
    CB.dots.forEach((d, i) => { const q = frac(i / CB.dots.length + t * speed), pt = CB.full.getPointAtLength(q * CB.len); d.setAttribute('cx', pt.x); d.setAttribute('cy', pt.y); d.setAttribute('opacity', (sw > .95 ? 1 : 0) * clamp(A * 4, 0, 1)); });
  }

  // ===== KIT: battery cross-section =====
  const cellSvg = el('svg', { viewBox: '0 0 420 420' }); const CS = {};
  (() => {
    const g = cellSvg;
    CS.heatGlow = el('rect', { x: 30, y: 60, width: 360, height: 320, rx: 26, fill: '#ff7a2a', opacity: 0 }, g);
    el('rect', { x: 40, y: 70, width: 340, height: 300, rx: 20, fill: '#1b222d', stroke: '#5c6675', 'stroke-width': 3 }, g);
    el('rect', { x: 56, y: 116, width: 308, height: 240, rx: 10, fill: 'rgba(255,214,120,.16)' }, g);
    el('line', { x1: 56, y1: 116, x2: 364, y2: 116, stroke: 'rgba(255,214,120,.5)', 'stroke-width': 2 }, g);
    el('rect', { x: 110, y: 52, width: 22, height: 20, rx: 3, fill: '#222', stroke: '#888' }, g); tx('−', 121, 38, 22, '#cfd8d3', g, 'middle', 800);
    el('rect', { x: 288, y: 52, width: 22, height: 20, rx: 3, fill: '#c0392b' }, g); tx('+', 299, 38, 22, '#ff8a7a', g, 'middle', 800);
    CS.pl = el('rect', { x: 106, y: 96, width: 30, height: 252, rx: 4, fill: '#8a929c' }, g);
    CS.pr = el('rect', { x: 284, y: 96, width: 30, height: 252, rx: 4, fill: '#7a4430' }, g);
    CS.worn = el('g', { opacity: 0 }, g);
    const r = (() => { let a = 7; return () => { a = (a * 9301 + 49297) % 233280; return a / 233280; }; })();
    for (let i = 0; i < 46; i++) { const left = i % 2 === 0; el('circle', { cx: (left ? 106 : 284) + r() * 30, cy: 104 + r() * 236, r: 2.5 + r() * 4.5, fill: i % 3 ? '#e6e2d6' : '#cfc8b0', opacity: .85 }, CS.worn); }
    CS.labels = el('g', {}, g);
    tx('lead (Pb)', 121, 386, 15, '#cfd8d3', CS.labels); tx('lead dioxide (PbO₂)', 299, 386, 15, '#e0b29a', CS.labels); tx('sulfuric acid', 210, 335, 15, '#ffd98a', CS.labels);
    CS.ions = [];
    for (let i = 0; i < 26; i++) { const pos = i % 2 === 0; const c = el('circle', { r: pos ? 6 : 8.5, fill: pos ? '#f4f4f4' : '#e8c547', stroke: 'rgba(0,0,0,.35)', 'stroke-width': 1 }, g); const tt = tx(pos ? '+' : '−', 0, 0, pos ? 10 : 13, '#222', g, 'middle', 900); CS.ions.push({ c, tt, pos, y: 135 + ((i * 37) % 190), sp: .07 + ((i * 13) % 7) / 100, off: (i * .137) % 1, ph: i * 1.7 }); }
    CS.rl = el('g', {}, g);
    el('path', { d: 'M160 96 l8 -12 l12 24 l12 -24 l12 24 l12 -24 l12 24 l12 -24 l8 12', fill: 'none', stroke: C.v, 'stroke-width': 4, 'stroke-linejoin': 'round' }, CS.rl);
    tx('internal resistance r', 210, 20, 18, C.v, CS.rl, 'middle', 700);
    CS.waves = el('g', { opacity: 0 }, g);
    for (const x0 of [64, 92, 330, 358]) el('path', { d: `M${x0} 64 q8 -10 0 -20 q-8 -10 0 -20`, fill: 'none', stroke: '#ff9a4a', 'stroke-width': 3, 'stroke-linecap': 'round' }, CS.waves);
  })();
  function drawCell(t, P) {
    const s = P.s, p = P.p, u = P.u;
    CS.labels.style.opacity = mixN(p, s, 'labels', u); CS.rl.style.opacity = mixN(p, s, 'rlabel', u);
    const worn = mixN(p, s, 'worn', u); CS.worn.setAttribute('opacity', worn);
    CS.pl.setAttribute('fill', worn > .5 ? '#6f747a' : '#8a929c'); CS.pr.setAttribute('fill', worn > .5 ? '#5c3a2c' : '#7a4430');
    const heat = mixN(p, s, 'heat', u); CS.heatGlow.setAttribute('opacity', (heat * (.22 + .06 * Math.sin(t * 6))).toFixed(3));
    CS.waves.setAttribute('opacity', heat); CS.waves.setAttribute('transform', `translate(0 ${(-((t * 18) % 12)).toFixed(1)})`);
    const ions = mixN(p, s, 'ions', u), drag = mixN(p, s, 'drag', u);
    CS.ions.forEach(o => {
      const sp = o.sp * (1 - .55 * drag), q = frac(o.off + t * sp), x = o.pos ? 150 + q * 120 : 270 - q * 120;
      const jit = 2 + drag * 7, y = o.y + Math.sin(t * 3 + o.ph) * 6 + Math.sin(t * 17 + o.ph) * jit * .5, xx = x + Math.sin(t * 13 + o.ph * 2) * jit;
      o.c.setAttribute('cx', xx); o.c.setAttribute('cy', y); o.tt.setAttribute('x', xx); o.tt.setAttribute('y', y + 1);
      o.c.setAttribute('opacity', ions); o.tt.setAttribute('opacity', ions);
    });
  }

  // ===== KIT: energy tollgate =====
  const toll = el('svg', { viewBox: '0 0 420 420' }); const TG = {}; TG.rowsBase = null;
  (() => {
    const g = toll;
    TG.road = el('path', { d: 'M90 100 H330 A50 50 0 0 1 380 150 V300 A50 50 0 0 1 330 350 H90 A50 50 0 0 1 40 300 V150 A50 50 0 0 1 90 100 Z', fill: 'none', stroke: '#3a4a44', 'stroke-width': 26, 'stroke-linejoin': 'round' }, g);
    el('path', { d: 'M90 100 H330 A50 50 0 0 1 380 150 V300 A50 50 0 0 1 330 350 H90 A50 50 0 0 1 40 300 V150 A50 50 0 0 1 90 100 Z', fill: 'none', stroke: '#6d7f77', 'stroke-width': 2, 'stroke-dasharray': '10 10' }, g);
    el('rect', { x: 8, y: 170, width: 64, height: 110, rx: 10, fill: '#2a2f3a', stroke: C.E, 'stroke-width': 2.5 }, g);
    tx('battery', 40, 296, 13, C.E, g, 'middle', 700); tx('source', 40, 205, 12, '#cfd8d3', g); TG.src = tx('+12 J', 40, 228, 15, C.E, g, 'middle', 800);
    TG.gate = el('g', {}, g);
    el('rect', { x: 100, y: 82, width: 8, height: 36, fill: '#888' }, TG.gate);
    TG.bar = el('rect', { x: 104, y: 96, width: 44, height: 7, rx: 3, fill: C.v }, TG.gate);
    tx('toll (inside battery)', 128, 66, 13, C.v, TG.gate, 'middle', 700);
    el('rect', { x: 352, y: 180, width: 60, height: 90, rx: 10, fill: '#2a2f3a', stroke: C.V, 'stroke-width': 2.5 }, g);
    tx('circuit', 382, 286, 12, C.V, g, 'middle', 700); tx('💡', 382, 222, 26, '#fff', g);
    TG.ledger = el('g', {}, g);
    const rows = [['E', 'received', C.E, 12], ['Ir', 'toll inside', C.v, 3.6], ['IR', 'spent outside', C.V, 8.4]];
    TG.rows = rows.map((r, i) => { const gg = el('g', {}, TG.ledger); const y = 165 + i * 46; tx(r[1], 112, y, 13, '#cfd8d3', gg, 'start'); const b = el('rect', { x: 112, y: y + 9, height: 16, rx: 3, width: 0, fill: r[2] }, gg); const v = tx('', 112, y + 17, 13, '#0b1714', gg, 'start', 800); return { gg, b, v, w: r[3] * 14.5, sym: r[0], num: r[3] }; });
    TG.total = tx('', 210, 312, 17, '#ffe08a', g, 'middle', 800);
    TG.token = el('g', {}, g);
    el('circle', { r: 17, fill: '#f4f1e6', stroke: '#333', 'stroke-width': 2 }, TG.token);
    tx('1 C', 0, 1, 12, '#222', TG.token, 'middle', 800);
    TG.purse = el('rect', { x: -16, y: 20, height: 7, rx: 3, width: 0, fill: C.E }, TG.token);
    TG.len = 0;
  })();
  const TPOS = [.84, .90, 1.035, 1.39, 1.72];
  function drawToll(t, P) {
    const s = P.s, p = P.p, u = P.u; if (!TG.len) TG.len = TG.road.getTotalLength() || 1000;
    const st = s.stage || 0, ps = p.stage != null ? p.stage : st;
    const pos = lerp(TPOS[ps], TPOS[st], u) + (st === 0 ? Math.sin(t) * .004 : 0);
    const pt = TG.road.getPointAtLength(frac(pos) * TG.len); TG.token.setAttribute('transform', `translate(${pt.x} ${pt.y})`);
    const energy = st === 0 ? 0 : st === 1 ? 1 : st === 2 ? .7 : 0, pe = ps === 0 ? 0 : ps === 1 ? 1 : ps === 2 ? .7 : 0;
    TG.purse.setAttribute('width', (lerp(pe, energy, u) * 32).toFixed(1));
    TG.bar.setAttribute('transform', st === 2 ? `rotate(${(-70 * Math.sin(Math.PI * u)).toFixed(1)} 104 99)` : '');
    const vals = s.values || [12, 3.6, 8.4], syms = s.symbols || ['E', 'Ir', 'IR'], unit = s.unit || 'J';
    TG.src.textContent = `+${vals[0]} ${unit}`;
    TG.rows.forEach((r, i) => { const on = st >= i + 1 ? 1 : 0, pon = ps >= i + 1 ? 1 : 0, w = lerp(pon, on, u); r.gg.style.opacity = w > 0 ? 1 : 0; r.b.setAttribute('width', (174 * vals[i] / vals[0] * w).toFixed(1)); r.v.textContent = w > .6 ? (s.nums ? vals[i] + ' ' + unit : syms[i]) : ''; r.v.setAttribute('x', 118); });
    TG.total.textContent = st >= 4 ? (s.nums ? `${vals[0]} ${unit} = ${vals[1]} ${unit} + ${vals[2]} ${unit}` : 'received = toll + spent outside') : '';
    TG.total.style.opacity = st >= 4 ? (ps >= 4 ? 1 : u) : 0;
  }

  // ===== KIT: graph (generic: functions, lines, points, gradient triangles, guides, text) =====
  const graph = el('svg', { viewBox: '0 0 420 420' }); const GR = { key: null, items: {} };
  const COLOR = n => PAL[n] || (meta.roles && meta.roles[n] && PAL[meta.roles[n].color]) || n || '#ffc061';
  function buildGraph(S) {
    graph.innerHTML = ''; GR.key = S.id; GR.items = {};
    const [x0, x1, xs] = S.x, [y0, y1, ys] = S.y;
    const gx = x => 60 + (x - x0) / (x1 - x0) * 330, gy = y => 360 - (y - y0) / (y1 - y0) * 320;
    const ax = el('g', {}, graph);
    for (let x = Math.ceil(x0 / xs) * xs; x <= x1 + 1e-9; x += xs) { el('line', { x1: gx(x), x2: gx(x), y1: 40, y2: 360, stroke: 'rgba(255,255,255,.07)' }, ax); }
    for (let y = Math.ceil(y0 / ys) * ys; y <= y1 + 1e-9; y += ys) { el('line', { x1: 60, x2: 390, y1: gy(y), y2: gy(y), stroke: 'rgba(255,255,255,.07)' }, ax); }
    const X0 = clamp(0, x0, x1), Y0 = clamp(0, y0, y1);
    el('line', { x1: 60, x2: 395, y1: gy(Y0), y2: gy(Y0), stroke: C.wire, 'stroke-width': 2 }, ax);
    el('line', { x1: gx(X0), x2: gx(X0), y1: 30, y2: 360, stroke: C.wire, 'stroke-width': 2 }, ax);
    const num = v => String(+v.toFixed(6)).replace('-', '−');
    for (let x = Math.ceil(x0 / xs) * xs; x <= x1 + 1e-9; x += xs) if (Math.abs(x) > 1e-9 || X0 !== 0) tx(num(x), gx(x), gy(Y0) + 15, 13, C.dim, ax);
    for (let y = Math.ceil(y0 / ys) * ys; y <= y1 + 1e-9; y += ys) if (Math.abs(y) > 1e-9 || Y0 !== 0) tx(num(y), gx(X0) - 8, gy(y), 13, C.dim, ax, 'end');
    if (S.xlabel) tx(S.xlabel, 395, gy(Y0) + 36 > 400 ? gy(Y0) - 14 : gy(Y0) + 36, 15, COLOR(S.xcolor || 'white'), ax, 'end', 700);
    if (S.ylabel) tx(S.ylabel, gx(X0) + 6, 22, 15, COLOR(S.ycolor || 'white'), ax, 'start', 700);
    const anchorOff = { ne: [12, -14, 'start'], nw: [-12, -14, 'end'], se: [12, 20, 'start'], sw: [-12, 20, 'end'], n: [0, -18, 'middle'], s: [0, 24, 'middle'], e: [14, 0, 'start'], w: [-14, 0, 'end'] };
    for (const it of S.items) {
      const g = el('g', {}, graph), col = COLOR(it.color), rec = { g, type: it.type };
      if (it.type === 'fn' || it.type === 'line' || it.type === 'polyline') {
        const pts = it.type === 'line' ? [it.from, it.to] : it.pts;
        let d = ''; pts.forEach(([x, y], k) => { d += (k ? 'L' : 'M') + gx(x).toFixed(1) + ' ' + gy(clamp(y, y0 - (y1 - y0), y1 + (y1 - y0))).toFixed(1); });
        const cp = el('clipPath', { id: 'gc' + it.id }, g); el('rect', { x: 60, y: 30, width: 335, height: 332 }, cp);
        rec.path = el('path', { d, fill: 'none', stroke: col, 'stroke-width': it.width || 3.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'clip-path': `url(#gc${it.id})` }, g);
        if (it.label) tx(it.label, gx(it.labelAt[0]), gy(it.labelAt[1]), 16, col, g, 'start', 800);
      } else if (it.type === 'point' || it.type === 'points') {
        const list = it.type === 'point' ? [{ at: it.at, label: it.label, pos: it.pos }] : it.pts.map((p, k) => ({ at: p, label: (it.labels || [])[k], pos: it.pos }));
        rec.dots = list.map(p => { const c = el('circle', { cx: gx(p.at[0]), cy: gy(p.at[1]), r: it.hollow ? 6.5 : 7.5, fill: it.hollow ? '#fff' : col, stroke: it.hollow ? col : 'none', 'stroke-width': 3 }, g);
          if (p.label) { const [dx, dy, an] = anchorOff[p.pos || 'ne']; tx(p.label, gx(p.at[0]) + dx, gy(p.at[1]) + dy, 15, it.labelColor ? COLOR(it.labelColor) : col, g, an, 800); } return c; });
      } else if (it.type === 'triangle') {
        const [[ax0, ay0], [ax1, ay1]] = [it.from, it.to];
        el('path', { d: `M${gx(ax0)} ${gy(ay0)} H${gx(ax1)} V${gy(ay1)}`, fill: 'none', stroke: COLOR(it.color || 'red'), 'stroke-width': 2.5, 'stroke-dasharray': '6 5' }, g);
        if (it.dx) tx(it.dx, (gx(ax0) + gx(ax1)) / 2, gy(ay0) + (ay1 < ay0 ? 16 : -12), 15, COLOR(it.dxColor || 'green'), g, 'middle', 800);
        if (it.dy) tx(it.dy, gx(ax1) + 8, (gy(ay0) + gy(ay1)) / 2, 15, COLOR(it.dyColor || 'red'), g, 'start', 800);
      } else if (it.type === 'guide') {
        el('path', { d: `M${gx(it.at[0])} ${gy(Y0)} V${gy(it.at[1])} H${gx(X0)}`, fill: 'none', stroke: col, 'stroke-width': 1.8, 'stroke-dasharray': '6 5' }, g);
      } else if (it.type === 'text') {
        (Array.isArray(it.text) ? it.text : [it.text]).forEach((line, k) => tx(line, gx(it.at[0]), gy(it.at[1]) + k * 22, it.size || 16, col, g, it.anchor || 'middle', 800));
      }
      g.style.opacity = 0; GR.items[it.id] = rec;
    }
    GR.items.__len = 0;
  }
  function drawGraph(t, P) {
    const s = P.s, p = P.p, u = P.u, S = s.spec;
    if (!S) return;
    if (GR.key !== S.id) buildGraph(S);
    const same = p.spec && p.spec.id === S.id, now = new Set(s.show || []), was = new Set(same ? (p.show || []) : []);
    for (const id in GR.items) {
      if (id === '__len') continue;
      const r = GR.items[id], a = now.has(id) ? (was.has(id) ? 1 : u) : (was.has(id) ? 1 - u : 0);
      r.g.style.opacity = r.path ? (a > 0 ? 1 : 0) : a;
      if (r.path) { if (!r.len) { r.len = r.path.getTotalLength() || 600; r.path.style.strokeDasharray = r.len; } r.path.style.strokeDashoffset = (r.len * (1 - a)).toFixed(1); }
      if (r.dots) r.dots.forEach(c => c.setAttribute('r', (s.pulse === id ? 7.5 + 3 * Math.max(0, Math.sin(t * 4)) : 7.5)));
    }
  }

  // ===== KIT: area model (completing the square: x² + bx + (b/2)²) =====
  const area = el('svg', { viewBox: '0 0 420 420' }); const AM = { g: el('g', {}, area) };
  AM.sq = el('rect', { fill: 'rgba(255,255,255,.1)', stroke: '#e8efe9', 'stroke-width': 2, rx: 2 }, AM.g);
  AM.s1 = el('rect', { fill: 'rgba(255,192,97,.28)', stroke: '#ffc061', 'stroke-width': 2, rx: 2 }, AM.g);
  AM.s2 = el('rect', { fill: 'rgba(255,192,97,.28)', stroke: '#ffc061', 'stroke-width': 2, rx: 2 }, AM.g);
  AM.cn = el('rect', { fill: 'rgba(124,240,165,0)', stroke: '#7cf0a5', 'stroke-width': 2.5, 'stroke-dasharray': '7 6', rx: 2 }, AM.g);
  AM.out = el('rect', { fill: 'none', stroke: '#ffe08a', 'stroke-width': 3, rx: 3 }, AM.g);
  AM.lx1 = tx('x', 155, 52, 26, '#e8efe9', AM.g); AM.lx2 = tx('x', 52, 155, 26, '#e8efe9', AM.g); tx('x²', 155, 155, 34, '#e8efe9', AM.g);
  AM.lb = tx('6', 314, 52, 24, '#ffc061', AM.g); AM.lh1 = tx('3', 0, 0, 24, '#73d6ff', AM.g); AM.lh2 = tx('3', 0, 0, 24, '#73d6ff', AM.g);
  AM.lsq = tx('9', 272, 272, 30, '#7cf0a5', AM.g); AM.lq1 = tx('x + 3', 187, 30, 26, '#ffe08a', AM.g); AM.lq2 = tx('x + 3', 30, 187, 26, '#ffe08a', AM.g);
  AM.lq2.setAttribute('transform', 'rotate(-90 30 187)');
  const AS = [
    { s1: [250, 70, 64, 170], s2: [314, 70, 64, 170], sv: 0, split: 0, cn: 0, done: 0 }, { s1: [250, 70, 64, 170], s2: [314, 70, 64, 170], sv: 1, split: 0, cn: 0, done: 0 },
    { s1: [250, 70, 64, 170], s2: [330, 70, 64, 170], sv: 1, split: 1, cn: 0, done: 0 }, { s1: [240, 70, 64, 170], s2: [70, 240, 170, 64], sv: 1, split: 1, cn: 0, done: 0 },
    { s1: [240, 70, 64, 170], s2: [70, 240, 170, 64], sv: 1, split: 1, cn: 1, done: 0 }, { s1: [240, 70, 64, 170], s2: [70, 240, 170, 64], sv: 1, split: 1, cn: 1, done: 1 }];
  const setR = (r, v) => { r.setAttribute('x', v[0]); r.setAttribute('y', v[1]); r.setAttribute('width', v[2]); r.setAttribute('height', v[3]); };
  function drawArea(t, P) {
    const s = P.s, p = P.p, u = P.u, F = AS[p.stage != null ? p.stage : (s.stage || 0)], T2 = AS[s.stage || 0], L = k => lerp(F[k], T2[k], u);
    const b = s.b != null ? s.b : 6, h = b / 2;
    AM.lb.textContent = String(b); AM.lh1.textContent = AM.lh2.textContent = String(h); AM.lsq.textContent = String(+(h * h).toFixed(4));
    AM.lq1.textContent = AM.lq2.textContent = `x + ${h}`;
    setR(AM.sq, [70, 70, 170, 170]);
    const r1 = F.s1.map((v, k) => lerp(v, T2.s1[k], u)), r2 = F.s2.map((v, k) => lerp(v, T2.s2[k], u));
    setR(AM.s1, r1); setR(AM.s2, r2); AM.s1.style.opacity = AM.s2.style.opacity = L('sv');
    setR(AM.cn, [240, 240, 64, 64]); AM.cn.style.opacity = L('cn'); AM.cn.setAttribute('fill', `rgba(124,240,165,${(.35 * L('done')).toFixed(3)})`);
    setR(AM.out, [70, 70, 234, 234]); AM.out.style.opacity = L('done');
    AM.lx1.style.opacity = AM.lx2.style.opacity = 1 - L('done'); AM.lb.style.opacity = L('sv') * (1 - L('split'));
    AM.lh1.setAttribute('x', r1[0] + r1[2] / 2); AM.lh1.setAttribute('y', r1[1] - 18);
    const vert = r2[2] < r2[3]; AM.lh2.setAttribute('x', vert ? r2[0] + r2[2] / 2 : r2[0] - 18); AM.lh2.setAttribute('y', vert ? r2[1] - 18 : r2[1] + r2[3] / 2);
    AM.lh1.style.opacity = AM.lh2.style.opacity = L('split') * (1 - L('done')); AM.lsq.style.opacity = L('cn'); AM.lq1.style.opacity = AM.lq2.style.opacity = L('done');
  }

  // kit registry: add new kits here (svg + draw(t, P))
  const KITS = { circuit: { svg: circ, draw: drawCircuit }, cell: { svg: cellSvg, draw: drawCell }, toll: { svg: toll, draw: drawToll }, graph: { svg: graph, draw: drawGraph }, area: { svg: area, draw: drawArea } };
  let shownPanel = null;
  function drawPanel(t) {
    const P = panelAt(t);
    const want = P.panel ? 'with-panel' : '';
    if (want !== stageCls) { stageCls = want; }
    if (P.panel && P.panel !== shownPanel) { pin.innerHTML = ''; pin.appendChild(KITS[P.panel].svg); shownPanel = P.panel; }
    if (P.panel) { const x = t - P.t0, sq = motion === 'pop' ? .05 * spring(x) : 0, bob = motion === 'pop' ? Math.sin(t * 1.6) * 4 : 0;
      pin.style.transform = `translateY(${bob.toFixed(1)}px) scale(${(1 + sq).toFixed(3)}, ${(1 - sq).toFixed(3)})`; }
    if (P.panel) KITS[P.panel].draw(t, P);
  }

  const frame = $('frame');
  // ================= THEMES: background worlds, mascot, motion =================
  const bgSvg = $('bg');
  const mk = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); parent && parent.appendChild(e); return e; };
  const grad = (id, stops, x2 = 0, y2 = 1) => { const d = bgSvg.querySelector('defs') || mk('defs', {}, bgSvg); const g = mk('linearGradient', { id, x1: 0, y1: 0, x2, y2 }, d); stops.forEach(([o, c]) => mk('stop', { offset: o, 'stop-color': c }, g)); return `url(#${id})`; };
  const rgrad = (id, stops) => { const d = bgSvg.querySelector('defs') || mk('defs', {}, bgSvg); const g = mk('radialGradient', { id }, d); stops.forEach(([o, c, op]) => mk('stop', { offset: o, 'stop-color': c, 'stop-opacity': op == null ? 1 : op }, g)); return `url(#${id})`; };

  const THEMES = {
    safari: { name: 'Safari Sunset', motion: 'pop', body: '#ffb347', belly: '#ffe2b0', hat: 'safari', build() {
      const U = [];
      mk('rect', { width: 1600, height: 900, fill: grad('sky', [[0, '#3b1d5a'], [.42, '#b8406a'], [.7, '#f07c3c'], [.9, '#ffc15e']]) }, bgSvg);
      const glow = mk('circle', { cx: 1180, cy: 600, r: 300, fill: rgrad('sg', [[0, '#ffe08a', .55], [1, '#ffb347', 0]]) }, bgSvg);
      const sun = mk('circle', { cx: 1180, cy: 600, r: 140, fill: '#ffd36b' }, bgSvg);
      U.push(t => { glow.setAttribute('r', 290 + Math.sin(t * .8) * 18); sun.setAttribute('cy', 600 + Math.sin(t * .2) * 6); });
      const birds = []; for (let k = 0; k < 6; k++) { const b = mk('path', { d: 'M-12 0 Q-6 -8 0 0 Q6 -8 12 0', fill: 'none', stroke: '#2b1028', 'stroke-width': 3, 'stroke-linecap': 'round' }, bgSvg); birds.push(b); }
      U.push(t => birds.forEach((b, k) => { const x = frac(t / 38 + k * .17) * 1900 - 150, y = 150 + k * 34 + Math.sin(t * .9 + k) * 14, f = .4 + .6 * Math.abs(Math.sin(t * 7 + k)); b.setAttribute('transform', `translate(${x} ${y}) scale(1 ${f})`); }));
      mk('path', { d: 'M0 600 Q220 545 440 590 T900 580 T1350 595 T1600 575 V900 H0Z', fill: '#7a3046' }, bgSvg);
      const acacia = (x, y, s, fill) => { const g = mk('g', { transform: `translate(${x} ${y}) scale(${s})`, fill }, bgSvg);
        mk('path', { d: 'M-8 0 L-4 -150 L-40 -190 L-34 -196 L0 -165 L30 -205 L38 -199 L6 -150 L10 0Z' }, g);
        mk('ellipse', { cx: -30, cy: -205, rx: 110, ry: 24 }, g); mk('ellipse', { cx: 50, cy: -222, rx: 90, ry: 20 }, g); mk('ellipse', { cx: 0, cy: -235, rx: 70, ry: 16 }, g); return g; };
      acacia(660, 615, .55, '#4a1c2a');
      // giraffe
      const gir = mk('g', { fill: '#3a160f' }, bgSvg);
      mk('ellipse', { cx: 0, cy: 0, rx: 46, ry: 22 }, gir); mk('path', { d: 'M28 -8 L62 -112 L76 -106 L44 4Z' }, gir);
      mk('ellipse', { cx: 76, cy: -114, rx: 18, ry: 9 }, gir); mk('rect', { x: 64, y: -134, width: 3, height: 14 }, gir); mk('rect', { x: 71, y: -134, width: 3, height: 14 }, gir);
      const gl = [-30, -18, 22, 34].map(x => mk('rect', { x: x - 3, y: 10, width: 6, height: 70, rx: 3 }, gir));
      mk('path', { d: 'M-44 -4 Q-62 10 -58 30', fill: 'none', stroke: '#3a160f', 'stroke-width': 3 }, gir);
      U.push(t => { const x = frac(t / 75) * 2000 - 200; gir.setAttribute('transform', `translate(${x} ${560 + Math.abs(Math.sin(t * 4)) * -3}) scale(.95)`); gl.forEach((l, i) => l.setAttribute('transform', `rotate(${(Math.sin(t * 4 + (i % 2) * Math.PI) * 14).toFixed(1)} ${l.getAttribute('x') * 1 + 3} 10)`)); });
      // elephant
      const ele = mk('g', { fill: '#4b2433' }, bgSvg);
      mk('ellipse', { cx: 0, cy: 0, rx: 70, ry: 44 }, ele); mk('circle', { cx: -66, cy: -12, r: 32 }, ele); mk('ellipse', { cx: -48, cy: -14, rx: 22, ry: 30, fill: '#5d2c40' }, ele);
      const trunk = mk('path', { d: 'M-92 -4 Q-108 30 -98 62', fill: 'none', stroke: '#4b2433', 'stroke-width': 14, 'stroke-linecap': 'round' }, ele);
      const el4 = [-46, -22, 22, 46].map(x => mk('rect', { x: x - 9, y: 26, width: 18, height: 44, rx: 6 }, ele));
      U.push(t => { const x = 1800 - frac(t / 95 + .45) * 2100; ele.setAttribute('transform', `translate(${x} ${650}) scale(.8)`); trunk.setAttribute('d', `M-92 -4 Q${-112 + Math.sin(t * 2) * 8} 30 ${-98 + Math.sin(t * 2) * 10} 62`); el4.forEach((l, i) => l.setAttribute('transform', `rotate(${(Math.sin(t * 3 + (i % 2) * Math.PI) * 8).toFixed(1)} ${l.getAttribute('x') * 1 + 9} 26)`)); });
      mk('path', { d: 'M0 650 Q400 615 800 648 T1600 636 V900 H0Z', fill: grad('gr', [[0, '#d9953f'], [1, '#9a5c24']]) }, bgSvg);
      acacia(130, 760, 1.35, '#2b0f12'); acacia(1480, 720, 1.0, '#2b0f12');
      const tufts = []; for (let k = 0; k < 16; k++) { const x = 40 + k * 100 + (k * 37) % 50, g = mk('path', { d: 'M0 0 l-10 -34 l6 2 l4 -40 l5 40 l8 -30 l2 34Z', fill: '#6b3c16' }, bgSvg); tufts.push([g, x, 860 - (k % 3) * 18]); }
      U.push(t => tufts.forEach(([g, x, y], k) => g.setAttribute('transform', `translate(${x} ${y}) rotate(${(Math.sin(t * 1.5 + k) * 5).toFixed(1)})`)));
      return U;
    } },
    vegetation: { name: 'Green Vegetation', motion: 'pop', body: '#ffd23f', belly: '#fff3b0', hat: 'leaf', build() {
      const U = [];
      mk('rect', { width: 1600, height: 900, fill: grad('vsky', [[0, '#e3fbd0'], [.55, '#8fe0a8'], [1, '#2f9a5c']]) }, bgSvg);
      const rays = mk('g', { opacity: .18 }, bgSvg); for (let k = 0; k < 7; k++) mk('path', { d: `M0 0 L${1700} ${k * 160 - 40} L${1700} ${k * 160 + 50}Z`, fill: '#fffbe0' }, rays);
      U.push(t => rays.setAttribute('transform', `rotate(${(Math.sin(t * .25) * 3).toFixed(2)})`));
      const bush = (x, y, s, c) => { const g = mk('g', { transform: `translate(${x} ${y}) scale(${s})`, fill: c }, bgSvg); [[0, 0, 90], [-80, 20, 70], [80, 20, 75], [-150, 50, 55], [150, 45, 60]].forEach(([cx, cy, r]) => mk('circle', { cx, cy, r }, g)); };
      bush(200, 720, 1.2, '#3fae64'); bush(800, 740, 1.0, '#48b86c'); bush(1400, 715, 1.3, '#3fae64');
      bush(520, 790, 1.1, '#2a8a4e'); bush(1150, 800, 1.2, '#2a8a4e');
      mk('rect', { y: 820, width: 1600, height: 80, fill: '#24783f' }, bgSvg);
      const blades = []; for (let k = 0; k < 70; k++) { const x = k * 23 + (k * 13) % 11, h = 40 + (k * 29) % 50; blades.push([mk('path', { d: `M-5 0 Q-2 ${-h / 2} 0 ${-h} Q4 ${-h / 2} 5 0Z`, fill: k % 2 ? '#3cba63' : '#2e9e55' }, bgSvg), x, h]); }
      U.push(t => blades.forEach(([b, x], k) => b.setAttribute('transform', `translate(${x} 900) rotate(${(Math.sin(t * 2 + k * .4) * 8).toFixed(1)})`)));
      const leaf = (x, y, rot, s, c) => { const g = mk('g', {}, bgSvg); const inner = mk('g', { transform: `scale(${s})` }, g); mk('path', { d: 'M0 0 C40 -70 170 -70 230 0 C170 70 40 70 0 0Z', fill: c }, inner); mk('path', { d: 'M0 0 L225 0', stroke: 'rgba(255,255,255,.35)', 'stroke-width': 4 }, inner); return [g, x, y, rot]; };
      const leaves = [leaf(-20, 60, 25, 1.3, '#1f7a3e'), leaf(-30, 160, 55, 1.0, '#2e9e55'), leaf(1620, 40, 150, 1.4, '#1f7a3e'), leaf(1630, 170, 125, 1.0, '#2e9e55'), leaf(1640, 880, 215, 1.5, '#1f7a3e')];
      U.push(t => leaves.forEach(([g, x, y, r], k) => g.setAttribute('transform', `translate(${x} ${y}) rotate(${(r + Math.sin(t * 1.2 + k) * 6).toFixed(1)})`)));
      const vines = [260, 760, 1250].map((x, k) => { const g = mk('g', {}, bgSvg); mk('path', { d: 'M0 0 Q14 80 0 160 Q-14 240 0 300', fill: 'none', stroke: '#2a7a3a', 'stroke-width': 5 }, g); [60, 140, 220, 290].forEach((y, i) => mk('ellipse', { cx: i % 2 ? 14 : -14, cy: y, rx: 18, ry: 9, fill: '#3cba63', transform: `rotate(${i % 2 ? 30 : -30} ${i % 2 ? 14 : -14} ${y})` }, g)); return [g, x, k]; });
      U.push(t => vines.forEach(([g, x, k]) => g.setAttribute('transform', `translate(${x} -20) rotate(${(Math.sin(t * .9 + k * 2) * 4).toFixed(2)})`)));
      const flies = [['#ff7ac3', '#ffb3dc'], ['#ffd23f', '#fff09a'], ['#6bd5ff', '#c4efff']].map(([a, b]) => { const g = mk('g', {}, bgSvg); const w1 = mk('ellipse', { cx: -10, cy: 0, rx: 13, ry: 18, fill: a }, g), w2 = mk('ellipse', { cx: 10, cy: 0, rx: 13, ry: 18, fill: b }, g); mk('rect', { x: -2, y: -14, width: 4, height: 28, rx: 2, fill: '#333' }, g); return [g, w1, w2]; });
      U.push(t => flies.forEach(([g, w1, w2], k) => { const x = 800 + Math.sin(t * .23 + k * 2.1) * 700, y = 300 + Math.sin(t * .41 + k * 1.3) * 180 + k * 40, f = .25 + .75 * Math.abs(Math.sin(t * 11 + k)); g.setAttribute('transform', `translate(${x} ${y}) rotate(${Math.sin(t + k) * 15})`); w1.setAttribute('rx', 13 * f); w2.setAttribute('rx', 13 * f); w1.setAttribute('cx', -2 - 10 * f); w2.setAttribute('cx', 2 + 10 * f); }));
      const pol = []; for (let k = 0; k < 26; k++) pol.push(mk('circle', { r: 3 + (k % 3), fill: '#fffbd0', opacity: .7 }, bgSvg));
      U.push(t => pol.forEach((c, k) => { const y = 900 - frac(t / (14 + k % 7) + k * .13) * 1000; c.setAttribute('cx', (k * 61) % 1600 + Math.sin(t + k) * 20); c.setAttribute('cy', y); }));
      return U;
    } },
    fiesta: { name: 'Ankara Fiesta', motion: 'pop', body: '#00c2b8', belly: '#b6fff6', hat: 'party', build() {
      const U = [];
      mk('rect', { width: 1600, height: 900, fill: grad('fsky', [[0, '#4a1fb8'], [.55, '#c2306f'], [1, '#ff8a3d']], 1, 1) }, bgSvg);
      const d = bgSvg.querySelector('defs'); const pat = mk('pattern', { id: 'ank', width: 120, height: 120, patternUnits: 'userSpaceOnUse' }, d);
      mk('circle', { cx: 30, cy: 30, r: 22, fill: 'none', stroke: '#ffd23f', 'stroke-width': 6 }, pat); mk('circle', { cx: 30, cy: 30, r: 8, fill: '#00c2b8' }, pat);
      mk('path', { d: 'M90 60 L110 90 L90 120 L70 90Z', fill: '#ff5fa2' }, pat); mk('path', { d: 'M90 0 L105 22 L90 44 L75 22Z', fill: '#ffd23f' }, pat); mk('circle', { cx: 30, cy: 95, r: 10, fill: '#ffffff', opacity: .7 }, pat);
      const pr = mk('rect', { width: 1600, height: 900, fill: 'url(#ank)', opacity: .13 }, bgSvg);
      U.push(t => pat.setAttribute('patternTransform', `translate(${(t * 12) % 120} ${(t * 6) % 120})`));
      const cols = ['#ffd23f', '#00c2b8', '#ff5fa2', '#7cf0a5', '#ff8a3d', '#6bd5ff'];
      const balloons = []; for (let k = 0; k < 9; k++) { const g = mk('g', {}, bgSvg); mk('path', { d: 'M0 46 Q8 80 -4 120', fill: 'none', stroke: 'rgba(255,255,255,.6)', 'stroke-width': 2 }, g); mk('ellipse', { cx: 0, cy: 0, rx: 34, ry: 42, fill: cols[k % cols.length] }, g); mk('ellipse', { cx: -12, cy: -14, rx: 8, ry: 13, fill: 'rgba(255,255,255,.45)' }, g); mk('path', { d: 'M-6 40 L6 40 L0 48Z', fill: cols[k % cols.length] }, g); balloons.push(g); }
      U.push(t => balloons.forEach((g, k) => { const y = 1050 - frac(t / (26 + k % 4 * 5) + k * .19) * 1300, x = ((k * 197) % 1500) + 50 + Math.sin(t * .8 + k) * 30; g.setAttribute('transform', `translate(${x} ${y}) rotate(${Math.sin(t + k) * 8})`); }));
      const conf = []; for (let k = 0; k < 50; k++) conf.push(mk('rect', { width: 10, height: 16, rx: 2, fill: cols[k % cols.length], opacity: .85 }, bgSvg));
      U.push(t => conf.forEach((c, k) => { const y = frac(t / (9 + k % 5) + k * .07) * 1000 - 50, x = (k * 131) % 1600 + Math.sin(t * 1.3 + k) * 40; c.setAttribute('transform', `translate(${x} ${y}) rotate(${(t * 120 + k * 40) % 360}) scale(1 ${Math.abs(Math.sin(t * 3 + k)).toFixed(2)})`); }));
      const stars = []; for (let k = 0; k < 14; k++) stars.push(mk('path', { d: 'M0 -14 L4 -4 L14 0 L4 4 L0 14 L-4 4 L-14 0 L-4 -4Z', fill: '#fff6c2' }, bgSvg));
      U.push(t => stars.forEach((s, k) => s.setAttribute('transform', `translate(${(k * 233) % 1600} ${(k * 151) % 820 + 40}) scale(${(.4 + .8 * Math.abs(Math.sin(t * 1.7 + k))).toFixed(2)})`)));
      return U;
    } },
    classic: { name: 'Classic', motion: 'wipe', body: '#7cf0a5', belly: '#d8ffe6', hat: 'grad', build() { mk('rect', { width: 1600, height: 900, fill: grad('csky', [[0, '#10251f'], [1, '#0a1613']], 1, 1) }, bgSvg); return []; } }
  };
  const ORDER = ['safari', 'vegetation', 'fiesta', 'classic'];
  let theme = THEMES[meta.theme] ? meta.theme : 'safari', bgUpdates = [], motion = 'pop';

  // ---------- mascot ----------
  const mascot = $('mascot'); const MS = {};
  function buildMascot() {
    const T = THEMES[theme]; mascot.innerHTML = '';
    const svg = mk('svg', { viewBox: '0 0 120 140' }, mascot); MS.root = mk('g', {}, svg);
    mk('ellipse', { cx: 60, cy: 134, rx: 30, ry: 5, fill: 'rgba(0,0,0,.25)' }, svg);
    MS.armL = mk('ellipse', { cx: 26, cy: 90, rx: 9, ry: 16, fill: T.body }, MS.root); MS.armR = mk('ellipse', { cx: 94, cy: 90, rx: 9, ry: 16, fill: T.body }, MS.root);
    mk('ellipse', { cx: 46, cy: 126, rx: 11, ry: 6, fill: '#3a2a20' }, MS.root); mk('ellipse', { cx: 74, cy: 126, rx: 11, ry: 6, fill: '#3a2a20' }, MS.root);
    mk('circle', { cx: 60, cy: 84, r: 40, fill: T.body }, MS.root); mk('ellipse', { cx: 60, cy: 98, rx: 24, ry: 20, fill: T.belly }, MS.root);
    MS.eyes = mk('g', {}, MS.root);
    [44, 76].forEach(x => { mk('ellipse', { cx: x, cy: 74, rx: 9, ry: 11, fill: '#fff' }, MS.eyes); mk('circle', { cx: x + 2, cy: 76, r: 5, fill: '#222' }, MS.eyes); mk('circle', { cx: x + 4, cy: 73, r: 1.8, fill: '#fff' }, MS.eyes); });
    mk('ellipse', { cx: 34, cy: 90, rx: 6, ry: 4, fill: '#ff7a9a', opacity: .6 }, MS.root); mk('ellipse', { cx: 86, cy: 90, rx: 6, ry: 4, fill: '#ff7a9a', opacity: .6 }, MS.root);
    MS.mouth = mk('ellipse', { cx: 60, cy: 92, rx: 8, ry: 3, fill: '#5a1f2a' }, MS.root);
    const H = mk('g', {}, MS.root);
    if (T.hat === 'safari') { mk('ellipse', { cx: 60, cy: 50, rx: 44, ry: 9, fill: '#d9bf85' }, H); mk('path', { d: 'M30 50 Q30 18 60 16 Q90 18 90 50Z', fill: '#e8d3a3' }, H); mk('rect', { x: 31, y: 41, width: 58, height: 7, fill: '#7a4b2a' }, H); }
    else if (T.hat === 'leaf') { [[-24, -30], [0, -40], [24, -30]].forEach(([dx, r]) => mk('path', { d: 'M0 0 C8 -18 22 -18 26 0 C22 18 8 18 0 0Z', fill: '#2e9e55', transform: `translate(${60 + dx - 4} 46) rotate(${r - 60})` }, H)); mk('circle', { cx: 78, cy: 40, r: 7, fill: '#ff7ac3' }, H); mk('circle', { cx: 78, cy: 40, r: 3, fill: '#ffd23f' }, H); }
    else if (T.hat === 'party') { mk('path', { d: 'M40 48 L60 4 L80 48Z', fill: '#ffd23f' }, H); mk('path', { d: 'M46 36 L74 36 L70 26 L50 26Z', fill: '#ff5fa2' }, H); mk('circle', { cx: 60, cy: 4, r: 7, fill: '#ff5fa2' }, H); }
    else { mk('path', { d: 'M24 40 L60 26 L96 40 L60 54Z', fill: '#1d2a26' }, H); mk('rect', { x: 46, y: 44, width: 28, height: 10, fill: '#1d2a26' }, H); mk('path', { d: 'M90 40 V60', stroke: '#ffd25e', 'stroke-width': 3 }, H); }
  }
  function drawMascot(t, talking, cheer) {
    const jump = cheer > 0 ? Math.sin(cheer * Math.PI) * 22 : 0;
    const bob = talking ? Math.abs(Math.sin(t * 6)) * 6 : Math.sin(t * 1.6) * 2;
    const sq = talking ? 1 + Math.sin(t * 12) * .03 : 1;
    MS.root.setAttribute('transform', `translate(60 130) scale(${(2 - sq).toFixed(3)} ${sq.toFixed(3)}) translate(-60 -130) translate(0 ${(-bob - jump).toFixed(1)})`);
    MS.mouth.setAttribute('ry', talking ? (2 + Math.abs(Math.sin(t * 15)) * 6).toFixed(1) : (cheer > 0 ? 6 : 3));
    MS.mouth.setAttribute('rx', talking ? 7 : (cheer > 0 ? 10 : 8));
    MS.eyes.setAttribute('transform', frac(t / 3.7) < .045 ? 'translate(0 74) scale(1 .1) translate(0 -74)' : '');
    const up = cheer > 0 ? -150 : (talking ? Math.sin(t * 3) * 18 : 0);
    MS.armL.setAttribute('transform', `rotate(${(cheer > 0 ? 150 : up)} 26 78)`); MS.armR.setAttribute('transform', `rotate(${(cheer > 0 ? -150 : -up)} 94 78)`);
  }

  // ---------- title letters ----------
  let everPlayed = false;
  function applyTheme(name, announce) {
    theme = name; const T = THEMES[name]; motion = T.motion;
    frame.dataset.theme = name; bgSvg.innerHTML = ''; bgUpdates = T.build(); buildMascot(); built = -1;
    if (announce) { const toast = $('toast'); toast.textContent = T.name; toast.classList.remove('show'); void toast.offsetWidth; toast.classList.add('show'); }
  }
  function drawTheme(t) {
    bgUpdates.forEach(f => f(t));
    const letters = title.querySelectorAll('h1 span');
    letters.forEach((s, i) => { const q = everPlayed ? seg(t, .1 + i * .035, .9 + i * .035) : 1, b = motion === 'pop' ? bounceOut(q) : ease(q); s.style.transform = `translateY(${((1 - b) * -120).toFixed(1)}px) rotate(${(motion === 'pop' ? Math.sin(t * 2 + i) * 3 : 0).toFixed(1)}deg)`; s.style.opacity = Math.min(1, q * 4); });
  }

  // ---------- frame ----------
  const chip = $('chip'), capText = $('capText'), title = $('title'), endEl = $('end'), count = $('count'), ring = $('ring'), countN = $('countN');
  title.innerHTML = `<div class="lvl">${meta.subject} · ${meta.level}</div><h1>${meta.title.split(' ').map(w => `<b class="word">${[...w].map(ch => `<span>${ch}</span>`).join('')}</b>`).join(' ')}</h1><p>${meta.subtitle}</p>${meta.eq ? `<div class="eq">${meta.eq}</div>` : ''}`;
  function render(t) {
    t = clamp(t, 0, DUR);
    const i = cueAt(t), c = cues[i], s = snaps[i];
    drawTheme(t); drawPanel(t);
    { const cls0 = 'stage' + (stageCls ? ' ' + stageCls : '') + s.hl.map(h => ' hl-' + h).join(''); if (stage.className !== cls0) stage.className = cls0; }
    drawBoard(t, i);
    let cheer = 0; for (const id in s.boxed) { const x = t - s.boxed[id]; if (x >= 0 && x < 1) cheer = x; }
    drawMascot(t, playing && speaking && !muted, cheer);
    const cls = 'stage' + (stageCls ? ' ' + stageCls : '') + s.hl.map(h => ' hl-' + h).join('');
    if (stage.className !== cls) stage.className = cls;
    stage.style.setProperty('--wig', motion === 'pop' ? (Math.sin(t * 9) * 4).toFixed(1) + 'deg' : '0deg');
    chip.textContent = c.ch;
    capText.textContent = t < lastEnd ? (c.caption || c.say) : '';
    capText.parentElement.style.opacity = t < lastEnd ? 1 : 0;
    const tv = 1 - seg(t, 3.4, 4.4); title.style.opacity = tv;
    const cv = (1 - tv).toFixed(3); $('board').style.opacity = cv; panel.style.opacity = ''; chip.style.opacity = cv; panel.style.visibility = tv > .99 ? 'hidden' : '';
    endEl.classList.toggle('on', t >= lastEnd + .3);
    if (c.hold) { const a = c.start + c.speech, rem = clamp(c.start + c.dur - t, 0, c.hold); count.style.opacity = t > a ? 1 : 0; countN.textContent = Math.ceil(rem); ring.style.strokeDashoffset = (94.25 * (1 - rem / c.hold)).toFixed(2); }
    else count.style.opacity = 0;
    return i;
  }

  // ---------- voice: natural Nigerian English first ----------
  const synth = window.speechSynthesis; let voice = null;
  function pickVoice() {
    if (!synth) return; const vs = synth.getVoices(); if (!vs.length) return;
    const score = v => { const L = (v.lang || '').toLowerCase().replace('_', '-'); let s = 0;
      if (L === 'en-ng' || /nigeria|ezinne|abeo/i.test(v.name)) s += 100; else if (L === 'en-gb') s += 30; else if (L === 'en-us') s += 25; else if (L.startsWith('en')) s += 15; else return -1;
      if (/natural|neural|online|premium|enhanced/i.test(v.name)) s += 12; if (v.localService) s += 2; return s; };
    voice = vs.map(v => [score(v), v]).filter(a => a[0] >= 0).sort((a, b) => b[0] - a[0]).map(a => a[1])[0] || null;
  }
  if (synth) { pickVoice(); synth.onvoiceschanged = pickVoice; }
  let muted = false, token = 0, speaking = false;
  function speak(i) {
    token++; speaking = false; if (!synth) return; synth.cancel(); if (muted) return; if (!voice) pickVoice();
    const my = token, u = new SpeechSynthesisUtterance(cues[i].say);
    if (voice) { u.voice = voice; u.lang = voice.lang; } else u.lang = 'en-NG';
    u.rate = .93; u.pitch = 1; u.onend = u.onerror = () => { if (my === token) speaking = false; };
    speaking = true; synth.speak(u);
  }

  // ---------- playback + controls ----------
  const playBtn = $('play'), big = $('bigplay'), scrub = $('scrub'), timeEl = $('time'), chname = $('chname'), muteBtn = $('mute'), ccBtn = $('cc');
  const ICON = { play: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M7 4l13 8-13 8z"/></svg>', pause: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>',
    vol: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M4 9h4l5-4v14l-5-4H4z"/><path fill="none" stroke="currentColor" stroke-width="2" d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12"/></svg>',
    mute: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M4 9h4l5-4v14l-5-4H4z"/><path stroke="currentColor" stroke-width="2" d="M16 9l5 6M21 9l-5 6"/></svg>' };
  scrub.max = DUR.toFixed(1);
  $('ticks').innerHTML = chapters.slice(1).map(c => `<i style="left:${(c.start / DUR * 100).toFixed(2)}%"></i>`).join('');
  let playing = false, t = 0, idx = -1, last = 0, hold = 0, dragging = false, wasPlaying = false, reported = false;
  const fmt = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  const post = (event, extra) => { try { window.parent && window.parent !== window && window.parent.postMessage(Object.assign({ type: 'studypipe:video', event, title: meta.title }, extra || {}), '*'); } catch (e) {} };
  function setIcons() { playBtn.innerHTML = playing ? ICON.pause : ICON.play; playBtn.setAttribute('aria-label', playing ? 'Pause' : 'Play'); muteBtn.innerHTML = muted ? ICON.mute : ICON.vol; muteBtn.setAttribute('aria-label', muted ? 'Unmute' : 'Mute'); }
  function startLine() { const i = cueAt(t); t = cues[i].start; idx = i; hold = 0; if (playing) speak(i); }
  function play() { if (t >= lastEnd) t = 0; everPlayed = true; playing = true; big.hidden = true; last = performance.now(); startLine(); setIcons(); poke(); post('play', { at: t }); }
  function pause() { playing = false; token++; speaking = false; if (synth) synth.cancel(); setIcons(); poke(); }
  function seek(x) { t = clamp(x, 0, DUR); if (playing) startLine(); else render(t); big.hidden = true; }
  playBtn.onclick = () => playing ? pause() : play(); big.onclick = play;
  $('again').onclick = () => { t = 0; play(); };
  if (!meta.next) $('continue').remove(); else { $('continue').textContent = meta.nextLabel || 'Continue →'; $('continue').onclick = () => post('continue', { next: meta.next }); }
  $('prev').onclick = () => { const i = cueAt(t); seek(cues[Math.max(0, t - cues[i].start > 1.5 ? i : i - 1)].start); };
  $('next').onclick = () => seek(cues[Math.min(cues.length - 1, cueAt(t) + 1)].start);
  scrub.addEventListener('input', () => { dragging = true; if (playing) { wasPlaying = true; pause(); } t = +scrub.value; big.hidden = true; });
  scrub.addEventListener('change', () => { dragging = false; t = cues[cueAt(+scrub.value)].start; if (wasPlaying) { wasPlaying = false; play(); } });
  $('themeBtn').onclick = () => applyTheme(ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length], true);
  muteBtn.onclick = () => { muted = !muted; setIcons(); if (playing) startLine(); };
  ccBtn.onclick = () => { frame.classList.toggle('caps-off'); ccBtn.classList.toggle('on'); ccBtn.setAttribute('aria-pressed', ccBtn.classList.contains('on')); };
  $('fs').onclick = () => {
    const d = document, inFs = d.fullscreenElement || d.webkitFullscreenElement || frame.classList.contains('pseudo-fs');
    if (inFs) { if (d.exitFullscreen && d.fullscreenElement) d.exitFullscreen(); else if (d.webkitExitFullscreen && d.webkitFullscreenElement) d.webkitExitFullscreen(); frame.classList.remove('pseudo-fs'); }
    else if (frame.requestFullscreen) frame.requestFullscreen().catch(() => frame.classList.add('pseudo-fs'));
    else if (frame.webkitRequestFullscreen) frame.webkitRequestFullscreen(); else frame.classList.add('pseudo-fs');
    setTimeout(() => { built = -1; }, 300);
  };
  window.addEventListener('resize', () => { built = -1; });
  let idleTimer = 0;
  function poke() { frame.classList.add('ctl'); frame.classList.remove('idle'); clearTimeout(idleTimer); idleTimer = setTimeout(() => { if (playing && !dragging) { frame.classList.remove('ctl'); frame.classList.add('idle'); } }, 2600); }
  frame.addEventListener('pointermove', poke);
  frame.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse' && !frame.classList.contains('ctl')) { poke(); e.preventDefault(); } else poke(); });
  $('stage').addEventListener('click', e => { if (e.target.closest('button')) return; if (!big.hidden) return; if (frame.classList.contains('idle')) return; playing ? pause() : play(); });
  window.addEventListener('keydown', e => {
    if (e.code === 'Space' || e.code === 'KeyK') { e.preventDefault(); playing ? pause() : play(); }
    else if (e.code === 'ArrowRight') $('next').click(); else if (e.code === 'ArrowLeft') $('prev').click();
    else if (e.code === 'KeyF') $('fs').click(); else if (e.code === 'KeyC') ccBtn.click(); else if (e.code === 'KeyM') muteBtn.click(); else if (e.code === 'KeyT') $('themeBtn').click();
    poke();
  });
  window.__seek = x => { t = x; render(t); };
  setIcons();
  function loop(now) {
    if (playing) {
      const dt = Math.min(.1, (now - last) / 1000); last = now;
      const i = cueAt(t), c = cues[i], end = c.start + c.dur;
      let nt = t + dt;
      if (nt >= end && speaking && !muted) { nt = end - .0005; hold += dt; if (hold > 9) speaking = false; } else hold = 0;
      t = nt;
      const j = cueAt(t); if (j !== idx && t < lastEnd) { idx = j; speak(j); }
      if (t >= lastEnd && !reported) { reported = true; post('complete', { next: meta.next }); }
      if (t >= DUR) { t = DUR; pause(); }
    } else last = now;
    const i = render(t);
    if (!dragging) scrub.value = t.toFixed(1);
    timeEl.textContent = `${fmt(t)} / ${fmt(DUR)}`;
    chname.textContent = cues[i].ch;
    requestAnimationFrame(loop);
  }
  applyTheme(theme, false);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { built = -1; });
  render(0); requestAnimationFrame(loop);
})();
