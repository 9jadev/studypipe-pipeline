/* =========================================================
   StudyPipe explainer-video kit · galvanometer
   Moving-coil galvanometer and its conversion into an ammeter / voltmeter. Three scenes (state `scene`, cross-fades):
   - dial:    big meter face with a linear arc scale (ticks computed from scaleMax + unit), a pointer that follows `defl`
              (> 1 pins it against the end stop and it jitters), and a cut-away: curved N / S poles, soft-iron cylinder,
              radial field, the coil (rotates with the pointer) and a hairspring that winds up as it turns. Burn-out state.
   - convert: dashed meter box with the galvanometer G (same live pointer and scale) and either nothing (bare), a short thick
              shunt in PARALLEL (ammeter: line current splits, coil gets a thin sparse stream), or a long big multiplier in
              SERIES (voltmeter: one stream, p.d.s add); branch-current and p.d. labels, total-resistance tag, and the two
              "swapped places" mistakes (shunt in series, multiplier in parallel).
   - test:    the finished meters on a battery loop: ammeter IN SERIES in the top wire, voltmeter IN PARALLEL across the battery.
   Every number is a string or fraction from the plan: the kit never computes physics, so it cannot disagree with the board.
   Contract: .agents/skills/explainer-video/references/adding-a-kit.md · every frame is a pure function of (t, P).
   ========================================================= */
(window.VIDEO_KITS = window.VIDEO_KITS || {}).galvanometer = {
  title: "Moving-coil galvanometer: cut-away dial, shunt / multiplier conversion, meters tested on a battery loop",
  states: {
    scene: "'dial' | 'convert' | 'test' (cross-fades)",
    labels: "0/1: part labels (magnet N/S, coil, hairspring, soft iron in dial; coil, shunt, multiplier in convert; battery, starter load in test)",
    inside: "0/1: dial cut-away: N/S poles, soft-iron cylinder, radial field, coil, hairspring",
    defl: "pointer, fraction of full scale (animates; > 1 pins it against the end stop, where it jitters)",
    scaleMax: "scale end value, e.g. 15 | 3 | 40 (ticks and numbers computed with a tidy step)",
    unit: "scale unit written on the dial: 'mA' | 'A' | 'V'",
    burn: "0/1: coil glows orange-red, smoke, 'burnt out!' tag (dial, convert)",
    rg: "coil resistance tag, e.g. 'R_g = 18 Ω' (or '')",
    mode: "convert: 'bare' | 'ammeter' (shunt in parallel) | 'voltmeter' (multiplier in series)",
    rs: "shunt tag, e.g. 'R_s = 0.0905 Ω' (or '')",
    rm: "multiplier tag, e.g. 'R_m = 2 649 Ω' (or '')",
    flow: "0/1: moving charge dots, left → right through the meter box",
    speed: "dot speed 0–1 (default 0.6, animates)",
    split: "0/1: branch current labels iLine / iCoil / iShunt",
    iLine: "incoming line current string, e.g. '3.0 A'",
    iCoil: "coil-branch current string, e.g. '15 mA' or 'I_g'",
    iShunt: "shunt-branch current string, e.g. '2.985 A' or 'I − I_g'",
    pd: "0/1: p.d. brackets (ammeter: one bracket over the parallel pair; voltmeter: coil + multiplier brackets and a total under the box)",
    vCoil: "p.d. string over the coil (or the parallel pair), e.g. '0.27 V' or 'same p.d.'",
    vOther: "p.d. string over the multiplier, e.g. '39.73 V'",
    vTotal: "total p.d. string under the box, e.g. '40 V'",
    box: "0/1: highlight the finished meter box, show its letter (A / V) and total tag",
    total: "total-resistance string, e.g. 'meter = 0.0900 Ω'",
    wrong: "null | 'shunt-series' | 'multiplier-parallel': the resistor in the wrong place, red ✗",
    bat: "test: battery label, e.g. '12.0 V'",
    r: "test: internal-resistance tag, e.g. 'r = 1.2 Ω' (or '' to hide the internal resistor)",
    R: "test: load label, e.g. '2.8 Ω'",
    I: "test: loop current, sets the dot speed with imax (animates)",
    imax: "test: current for full dot speed (default 3)",
    ammeter: "0/1: ammeter in series in the top wire",
    aMax: "ammeter scale end (A), default 3",
    aDefl: "ammeter pointer 0–1 (animates)",
    aRead: "ammeter reading string, e.g. '≈ 2.9 A'",
    aR: "ammeter resistance string, e.g. '0.0900 Ω' or '18 Ω'",
    voltmeter: "0/1: voltmeter in parallel across the battery terminals",
    vMax: "voltmeter scale end (V), default 40",
    vDefl: "voltmeter pointer 0–1 (animates)",
    vRead: "voltmeter reading string, e.g. '8.4 V'",
    vR: "voltmeter resistance string, e.g. '2 667 Ω'",
    verdict: "null | 'ok' (green ✓ by the ammeter) | 'bad' (red ✗)",
    focus: "dashed pulsing ring: dial scale coil (dial) · G junction shunt multiplier pd box (convert) · ammeter voltmeter battery load (test) · null",
  },
  focus: {
    dial: [20, 12, 380, 228], scale: [56, 84, 308, 130], coil: [26, 226, 368, 170],
    G: [112, 104, 128, 160], junction: [0, 136, 196, 160], shunt: [150, 232, 176, 104], multiplier: [220, 136, 160, 136],
    pd: [40, 30, 340, 76], box: [30, 36, 360, 370],
    ammeter: [172, 18, 140, 150], voltmeter: [124, 140, 196, 120], battery: [6, 84, 170, 220], load: [262, 130, 158, 250],
  },
  create(svg, api) {
    const { el, tx, mixN, lerp, ease, seg, clamp, frac, PAL, COLOR, meta } = api;
    const role = (n, fb) => (meta && meta.roles && meta.roles[n] ? COLOR(n) : fb);
    const CI = role("I", PAL.sky), CIG = role("Ig", PAL.gold), CRG = role("Rg", PAL.pink), CRS = role("Rs", PAL.green),
      CRM = role("Rm", PAL.orange), CR = role("R", PAL.orange), CV = role("V", PAL.blue);
    const WIRE = "#c9d6cf", DIM = "#9fb3a8", INK = "#2b2b2b", FACE = "#f1ecdf", RIM = "#8b8270", CASE = "#232a36", EDGE = "#5c6675",
      COPPER = "#c8763a", BRASS = "#d9b36a", NEEDLE = "#c0392b", BAD = "#ff6b6b", GOOD = "#7cf0a5", TXT = "#e8efe9";
    const DEG = Math.PI / 180;
    const polar = (cx, cy, r, aDeg) => [cx + r * Math.sin(aDeg * DEG), cy - r * Math.cos(aDeg * DEG)];
    const f1 = v => v.toFixed(1);
    const num = v => String(+v.toFixed(3));

    // ---------- shared helpers ----------
    // tidy linear scale: 15 → 0 5 10 15 · 3 → 0 1 2 3 · 40 → 0 10 20 30 40 · 2.4 → 0 1 2 (+ end 2.4)
    const STEPS = []; for (let e = -3; e <= 4; e++) for (const m of [1, 2, 2.5, 5]) STEPS.push(m * Math.pow(10, e));
    function ticks(max) {
      max = Math.max(1e-6, +max || 1);
      for (const st of STEPS) { const n = max / st, k = Math.round(n); if (Math.abs(n - k) < 1e-6 && k >= 2 && k <= 5) return { step: st, majors: Array.from({ length: k + 1 }, (_, i) => i * st), end: null, max }; }
      for (const st of STEPS) if (max / st <= 4) { const k = Math.floor(max / st + 1e-9); return { step: st, majors: Array.from({ length: k + 1 }, (_, i) => i * st), end: max - k * st > st * .3 ? max : null, max }; }
      return { step: max, majors: [0, max], end: null, max };
    }
    // pointer angle (deg from vertical) for a deflection d: ±50° arc, end stop at +58°, jitter while pinned
    function angle(d, t) {
      d = Math.max(0, d); let a = -50 + 100 * Math.min(d, 1.08);
      const j = clamp((d - 1.06) / .06, 0, 1);
      if (j > 0) a = 58 - j * Math.abs(Math.sin(t * 19)) * (1.4 + .9 * Math.sin(t * 5.3));
      return a;
    }
    const pathOf = pts => { const segs = []; let L = 0; for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); segs.push(d); L += d; } return { pts, segs, L }; };
    const at = (P, q) => { let d = q * P.L; for (let i = 0; i < P.segs.length; i++) { const a = P.pts[i], b = P.pts[i + 1]; if (d <= P.segs[i] || i === P.segs.length - 1) { const u = Math.min(1, d / P.segs[i]), nx = -(b[1] - a[1]) / P.segs[i], ny = (b[0] - a[0]) / P.segs[i]; return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, nx, ny]; } d -= P.segs[i]; } return [0, 0, 0, 0]; };
    // a stream of charge dots along a polyline: lanes side by side, one dot every `spacing` units per lane
    function stream(parent, pts, color, lanes, spacing, r) {
      const P = pathOf(pts), n = Math.max(1, Math.round(P.L / spacing)), dots = [];
      for (let l = 0; l < lanes; l++) for (let i = 0; i < n; i++) dots.push({ c: el("circle", { r: r || 4.2, fill: color, stroke: "rgba(0,0,0,.35)", "stroke-width": 1 }, parent), off: (i + (l % 2) * .5) / n, lane: lanes > 1 ? (l - (lanes - 1) / 2) * 9 : 0 });
      return { P, dots, draw(phase) { dots.forEach(d => { const q = frac(d.off + phase / P.L), xy = at(P, q); d.c.setAttribute("cx", f1(xy[0] + xy[2] * d.lane)); d.c.setAttribute("cy", f1(xy[1] + xy[3] * d.lane)); }); } };
    }
    // distance travelled by a dot since t = 0 when its speed blends from vp to vs over 1.4 s starting at t0
    function travel(vp, vs, t, t0) {
      const T = t - t0; if (T <= 0) return vp * t;
      let A; if (T >= 1.4) A = .7 + (T - 1.4); else { A = 0; const N = 10, h = T / N; for (let i = 0; i < N; i++) A += ease(((i + .5) * h) / 1.4) * h; }
      return vp * t + (vs - vp) * A;
    }
    const setTx = (e, str, op) => { str = str == null ? "" : String(str); if (e.textContent !== str) e.textContent = str; e.setAttribute("opacity", (str ? op : 0).toFixed(3)); };
    const tagOp = (P, key) => { const s = P.s, p = P.p; return s[key] ? (p[key] === s[key] ? 1 : ease(seg(P.u, .2, 1))) : 0; };
    const bracket = (x0, x1, y, dir, color, parent) => el("path", { d: `M${x0} ${y + 8 * dir} V${y} H${x1} V${y + 8 * dir}`, fill: "none", stroke: color, "stroke-width": 2.5, "stroke-linejoin": "round" }, parent);
    // smoke: three wisps of puffs rising from (x, y)
    function smoke(parent) {
      const g = el("g", {}, parent), puffs = [];
      for (let w = 0; w < 3; w++) for (let k = 0; k < 3; k++) puffs.push({ c: el("circle", { fill: "#aab3bd" }, g), w, k });
      return { g, draw(t, x, y, k0) {
        g.setAttribute("opacity", k0.toFixed(3)); if (k0 < .01) return;
        puffs.forEach(p => { const ph = frac(t * .45 + p.k / 3 + p.w * .21), dx = (p.w - 1) * 16 + Math.sin(ph * 6 + p.w * 2) * 7;
          p.c.setAttribute("cx", f1(x + dx)); p.c.setAttribute("cy", f1(y - ph * 74)); p.c.setAttribute("r", f1(4 + ph * 11)); p.c.setAttribute("opacity", ((1 - ph) * .55).toFixed(3)); });
      } };
    }
    // small meter dial (convert G, test ammeter / voltmeter): face, scale from (max, unit), live pointer
    function dial(parent, cx, cy, R) {
      const g = el("g", {}, parent), py = cy + .42 * R, ra = .92 * R;
      const glow = el("circle", { cx, cy, r: R + 14, fill: "#ff6a2a", opacity: 0 }, g);
      const face = el("circle", { cx, cy, r: R + 4, fill: FACE, stroke: RIM, "stroke-width": 3 }, g);
      el("path", { d: arc(cx, py, ra, -50, 50), fill: "none", stroke: INK, "stroke-width": 1.6 }, g);
      const tk = el("g", {}, g);
      const lo = tx("0", ...polar(cx, py, ra * .8, -72), 12, INK, g, "middle", 700), hi = tx("", ...polar(cx, py, ra * .8, 72), 12, INK, g, "middle", 700);
      const unit = tx("", cx, py + 15, 14, INK, g, "middle", 800);
      el("circle", { cx: polar(cx, py, ra - 6, 59.5)[0], cy: polar(cx, py, ra - 6, 59.5)[1], r: 2.2, fill: "#555" }, g);   // end stop
      const needle = el("line", { x1: cx, y1: py, x2: cx, y2: py - ra, stroke: NEEDLE, "stroke-width": 2.6, "stroke-linecap": "round" }, g);
      el("circle", { cx, cy: py, r: 4, fill: "#333" }, g);
      let key = "";
      return { g, glow, face, tickG: tk,
        scale(max, un, op) {
          const k = max + "|" + un;
          if (k !== key) { key = k; tk.innerHTML = ""; const T = ticks(max), vals = T.majors.concat(T.end != null ? [T.end] : []);
            vals.forEach(v => { const a = -50 + 100 * v / T.max, p0 = polar(cx, py, ra - 6, a), p1 = polar(cx, py, ra, a); el("line", { x1: f1(p0[0]), y1: f1(p0[1]), x2: f1(p1[0]), y2: f1(p1[1]), stroke: INK, "stroke-width": 1.6 }, tk); });
            hi.textContent = num(+max); unit.textContent = un || ""; }
          tk.setAttribute("opacity", op.toFixed(3)); lo.setAttribute("opacity", op.toFixed(3)); hi.setAttribute("opacity", op.toFixed(3)); unit.setAttribute("opacity", op.toFixed(3));
        },
        point(d, t) { const a = angle(d, t), q = polar(cx, py, ra - 2, a); needle.setAttribute("x2", f1(q[0])); needle.setAttribute("y2", f1(q[1])); },
      };
    }
    function arc(cx, cy, r, a0, a1) { const p0 = polar(cx, cy, r, a0), p1 = polar(cx, cy, r, a1); return `M${f1(p0[0])} ${f1(p0[1])} A${r} ${r} 0 ${Math.abs(a1 - a0) > 180 ? 1 : 0} ${a1 > a0 ? 1 : 0} ${f1(p1[0])} ${f1(p1[1])}`; }
    // scale shown at blend u: (max, unit, opacity) – a relabel fades the old numbers out and the new ones in
    function scaleAt(P, kMax, kUnit, dMax, dUnit) {
      const s = P.s, p = P.p, sm = s[kMax] != null ? +s[kMax] : dMax, su = s[kUnit] != null ? s[kUnit] : dUnit;
      const pm = p[kMax] != null ? +p[kMax] : sm, pu = p[kUnit] != null ? p[kUnit] : su;
      if (pm === sm && pu === su) return [sm, su, 1];
      return P.u < .5 ? [pm, pu, 1 - 2 * P.u] : [sm, su, 2 * P.u - 1];
    }

    const scenes = { dial: el("g", {}, svg), convert: el("g", {}, svg), test: el("g", {}, svg) };

    // =====================================================================
    // scene: dial — the moving-coil galvanometer, big
    // =====================================================================
    const D = {}, DG = scenes.dial, PX = 210, PY = 292;
    el("rect", { x: 20, y: 12, width: 380, height: 374, rx: 26, fill: CASE, stroke: EDGE, "stroke-width": 3 }, DG);
    el("rect", { x: 34, y: 24, width: 352, height: 204, rx: 16, fill: FACE, stroke: RIM, "stroke-width": 3 }, DG);
    // scale arc, ticks, numbers (rebuilt from scaleMax / unit)
    el("path", { d: arc(PX, PY, 170, -50, 50), fill: "none", stroke: INK, "stroke-width": 2.2 }, DG);
    D.ticks = el("g", {}, DG); D.key = "";
    D.unit = tx("mA", 100, 210, 18, INK, DG, "end", 800);
    { const sp = polar(PX, PY, 156, 59.5); el("circle", { cx: f1(sp[0]), cy: f1(sp[1]), r: 4, fill: "#555" }, DG); }   // end stop pin
    D.burnt = tx("burnt out!", 210, 54, 18, BAD, DG, "middle", 900);
    // cut-away window (internals) and its cover
    D.inside = el("g", {}, DG);
    el("rect", { x: 34, y: 234, width: 352, height: 144, rx: 14, fill: "#141a22", stroke: EDGE, "stroke-width": 2, "stroke-dasharray": "6 5" }, D.inside);
    // permanent magnet: curved pole pieces (concave faces on a circle of r 56 round the pivot) joined by a yoke
    const PF = 56, a30 = polar(PX, PY, PF, 30), a150 = polar(PX, PY, PF, 150);
    el("path", { d: `M44 ${f1(a30[1])} H${f1(2 * PX - a30[0])} A${PF} ${PF} 0 0 0 ${f1(2 * PX - a150[0])} ${f1(a150[1])} H44 Z`, fill: "#c94a4a", stroke: "#ff9a8a", "stroke-width": 2 }, D.inside);
    el("path", { d: `M376 ${f1(a30[1])} H${f1(a30[0])} A${PF} ${PF} 0 0 1 ${f1(a150[0])} ${f1(a150[1])} H376 Z`, fill: "#3f69b8", stroke: "#8fb4ff", "stroke-width": 2 }, D.inside);
    el("rect", { x: 44, y: f1(a150[1]), width: 332, height: 16, rx: 4, fill: "#5a6170", stroke: "#7d8796", "stroke-width": 1.5 }, D.inside);
    tx("N", 99, 300, 28, "#fff", D.inside, "middle", 900); tx("S", 321, 300, 28, "#fff", D.inside, "middle", 900);
    // radial field: N pole → soft-iron cylinder → S pole (arrows show the direction)
    el("marker", { id: "galv-arr", viewBox: "0 0 6 6", refX: 3, refY: 3, markerWidth: 5, markerHeight: 5, orient: "auto" }, svg).appendChild(el("path", { d: "M0 0 L6 3 L0 6 Z", fill: "#73d6ff" }));
    for (let a = 40; a <= 140; a += 20) {
      const L0 = polar(PX, PY, PF - 2, -a), L1 = polar(PX, PY, 31, -a), R0 = polar(PX, PY, 31, a), R1 = polar(PX, PY, PF - 2, a);
      el("line", { x1: f1(L0[0]), y1: f1(L0[1]), x2: f1(L1[0]), y2: f1(L1[1]), stroke: "#73d6ff", "stroke-width": 1.5, opacity: .7, "marker-end": "url(#galv-arr)" }, D.inside);
      el("line", { x1: f1(R0[0]), y1: f1(R0[1]), x2: f1(R1[0]), y2: f1(R1[1]), stroke: "#73d6ff", "stroke-width": 1.5, opacity: .7, "marker-end": "url(#galv-arr)" }, D.inside);
    }
    el("circle", { cx: PX, cy: PY, r: 28, fill: "#8d96a3", stroke: "#c3cad3", "stroke-width": 2 }, D.inside);   // soft-iron cylinder
    // the coil (end-on): two winding blocks in the gap, joined by the front side across the cylinder; turns with the pointer
    D.coil = el("g", {}, D.inside);
    D.coilParts = [
      el("rect", { x: PX - 46, y: PY - 3, width: 92, height: 6, rx: 3, fill: COPPER }, D.coil),
      el("rect", { x: PX - 50, y: PY - 14, width: 14, height: 28, rx: 4, fill: COPPER, stroke: "#ffcf9e", "stroke-width": 1.2 }, D.coil),
      el("rect", { x: PX + 36, y: PY - 14, width: 14, height: 28, rx: 4, fill: COPPER, stroke: "#ffcf9e", "stroke-width": 1.2 }, D.coil),
    ];
    for (const sx of [-43, 43]) for (let k = -10; k <= 10; k += 4) el("line", { x1: PX + sx - 6, y1: PY + k, x2: PX + sx + 6, y2: PY + k, stroke: "#7a3f16", "stroke-width": 1 }, D.coil);
    D.spring = el("path", { fill: "none", stroke: "#f2c76a", "stroke-width": 1.8 }, D.inside);
    el("rect", { x: PX + 22, y: PY - 3, width: 8, height: 6, rx: 1, fill: BRASS }, D.inside);   // hairspring anchor lug
    D.labs = el("g", {}, D.inside);
    tx("magnet N", 99, 262, 13, "#fff", D.labs, "middle", 800); tx("magnet S", 321, 262, 13, "#fff", D.labs, "middle", 800);
    el("path", { d: `M112 358 L${PX - 44} ${PY + 18} M${PX} 358 V${PY + 30} M306 358 L${PX + 12} ${PY + 12}`, stroke: "#e8efe9", "stroke-width": 1.2, opacity: .7, fill: "none" }, D.labs);
    tx("coil", 108, 368, 13, "#ffb27a", D.labs, "middle", 800); tx("soft iron", PX, 368, 13, "#c3cad3", D.labs, "middle", 800); tx("hairspring", 312, 368, 13, "#f2c76a", D.labs, "middle", 800);
    D.cover = el("g", {}, DG);
    el("rect", { x: 34, y: 234, width: 352, height: 144, rx: 14, fill: "#2b3340", stroke: EDGE, "stroke-width": 2 }, D.cover);
    for (const x of [52, 368]) for (const y of [252, 360]) el("circle", { cx: x, cy: y, r: 4, fill: "#4a5465" }, D.cover);
    D.glow = el("circle", { cx: PX, cy: PY, r: 74, fill: "#ff6a2a", opacity: 0 }, DG);
    D.needle = el("line", { x1: PX, y1: PY, x2: PX, y2: PY - 176, stroke: NEEDLE, "stroke-width": 3.5, "stroke-linecap": "round" }, DG);
    el("circle", { cx: PX, cy: PY, r: 7, fill: "#333", stroke: "#888", "stroke-width": 1.5 }, DG);
    D.smoke = smoke(DG);
    // terminals on the base, coil-resistance tag under the meter
    el("circle", { cx: 56, cy: 397, r: 10, fill: "#c0392b", stroke: BRASS, "stroke-width": 3 }, DG); tx("+", 56, 397, 16, "#fff", DG, "middle", 900);
    el("circle", { cx: 364, cy: 397, r: 10, fill: "#1a1a1a", stroke: BRASS, "stroke-width": 3 }, DG); tx("−", 364, 396, 16, "#fff", DG, "middle", 900);
    D.rg = tx("", PX, 404, 15, CRG, DG, "middle", 800);
    function bigTicks(max, unit) {
      const k = max + "|" + unit; if (k === D.key) return; D.key = k; D.ticks.innerHTML = "";
      const T = ticks(max), minor = T.step / 5;
      for (let v = 0; v <= max + 1e-9; v += minor) { const a = -50 + 100 * v / max, mj = T.majors.some(m => Math.abs(m - v) < 1e-6); const p0 = polar(PX, PY, mj ? 154 : 162, a), p1 = polar(PX, PY, 170, a);
        el("line", { x1: f1(p0[0]), y1: f1(p0[1]), x2: f1(p1[0]), y2: f1(p1[1]), stroke: INK, "stroke-width": mj ? 2.4 : 1.2 }, D.ticks); }
      T.majors.concat(T.end != null ? [T.end] : []).forEach(v => { const a = -50 + 100 * v / max, q = polar(PX, PY, 190, a); tx(num(v), f1(q[0]), f1(q[1]), 16, INK, D.ticks, "middle", 800); });
      if (T.end != null) { const p0 = polar(PX, PY, 152, 50), p1 = polar(PX, PY, 170, 50); el("line", { x1: f1(p0[0]), y1: f1(p0[1]), x2: f1(p1[0]), y2: f1(p1[1]), stroke: INK, "stroke-width": 2.4 }, D.ticks); }
      D.unit.textContent = unit || "";
    }

    // =====================================================================
    // scene: convert — the conversion schematic (G is always at (176, 180))
    // =====================================================================
    const V = {}, VG = scenes.convert, GX = 176, GY = 180, GR = 42, JL = 96, JR = 330, LO = 286;
    V.boxR = el("rect", { x: 52, y: 96, width: 316, height: 240, rx: 22, fill: "rgba(255,255,255,.02)", stroke: EDGE, "stroke-width": 2.5, "stroke-dasharray": "9 7" }, VG);
    el("line", { x1: 6, y1: GY, x2: 52, y2: GY, stroke: WIRE, "stroke-width": 4, "stroke-linecap": "round" }, VG);
    el("line", { x1: 368, y1: GY, x2: 414, y2: GY, stroke: WIRE, "stroke-width": 4, "stroke-linecap": "round" }, VG);
    const shuntBar = (x, y, parent) => { const g = el("g", {}, parent); el("rect", { x, y: y - 12, width: 60, height: 24, rx: 4, fill: "#d98a4e", stroke: CRS, "stroke-width": 3 }, g); el("rect", { x: x + 4, y: y - 9, width: 52, height: 5, rx: 2, fill: "#ffd0a0", opacity: .6 }, g); return g; };
    const bobbin = (x, y, w, h, parent) => { const g = el("g", {}, parent); el("rect", { x, y: y - h / 2, width: w, height: h, rx: 8, fill: "#3a2a1c", stroke: CRM, "stroke-width": 3 }, g);
      for (let k = x + 6; k < x + w - 4; k += 4) el("line", { x1: k, y1: y - h / 2 + 5, x2: k + 2, y2: y + h / 2 - 5, stroke: "#d98a4e", "stroke-width": 1.3, opacity: .85 }, g); return g; };
    const LAY = {};
    function layout(id, def) {
      const g = el("g", {}, VG), L = { g, T: {} };
      def.wires.forEach(d => el("path", { d, fill: "none", stroke: WIRE, "stroke-width": 4, "stroke-linecap": "round", "stroke-linejoin": "round" }, g));
      L.dotG = el("g", {}, g);
      L.streams = def.streams.map(sd => stream(L.dotG, sd[0], sd[1], sd[2], sd[3]));
      if (def.shunt) L.shunt = shuntBar(def.shunt[0], def.shunt[1], g);
      if (def.mult) L.mult = bobbin(def.mult[0], def.mult[1], def.mult[2], def.mult[3], g);
      (def.junctions || []).forEach(j => el("circle", { cx: j, cy: GY, r: 6, fill: WIRE }, g));
      L.G = dial(g, GX, GY, GR);
      L.pd = el("g", {}, g);
      (def.brackets || []).forEach(b => bracket(b[0], b[1], b[2], b[3], b[4], L.pd));
      L.cross = def.cross ? tx("✗", def.cross[0], def.cross[1], 30, BAD, g, "middle", 900) : null;
      const C = { iLine: CI, iCoil: def.coilColor || CIG, iShunt: CI, rg: CRG, rs: CRS, rm: CRM, coil: "#ffb27a", shunt: CRS, multiplier: CRM, vCoil: CV, vOther: CV, vTotal: CV, note: DIM };
      for (const k in def.T) { const q = def.T[k]; L.T[k] = tx("", q[0], q[1], k === "note" ? 12 : 14, C[k], k === "vCoil" || k === "vOther" || k === "vTotal" || k === "note" ? L.pd : g, q[2] || "middle", k === "coil" || k === "shunt" || k === "multiplier" ? 700 : 800); }
      LAY[id] = L;
    }
    const inL = [[6, GY], [JL, GY]], outL = [[JR, GY], [414, GY]], loop = [[JL, GY], [JL, LO], [JR, LO], [JR, GY]];
    layout("bare", {
      wires: [`M52 ${GY} H368`], streams: [[[[6, GY], [414, GY]], CIG, 1, 26]],
      T: { iLine: [8, 160, "start"], rg: [GX, 244], coil: [GX, 266] },
    });
    layout("ammeter", {
      wires: [`M52 ${GY} H368`, `M${JL} ${GY} V${LO} H${JR} V${GY}`], shunt: [186, LO], junctions: [JL, JR],
      streams: [[inL, CI, 2, 20], [[[JL, GY], [JR, GY]], CIG, 1, 78], [loop, CI, 2, 20], [outL, CI, 2, 20]],
      brackets: [[JL, JR, 84, 1, CV]],
      T: { iLine: [8, 160, "start"], iCoil: [115, 162], iShunt: [141, 268], rg: [GX, 244], coil: [226, 206, "start"], shunt: [256, 262, "start"], rs: [216, 318], vCoil: [213, 68], note: [213, 46] },
    });
    layout("voltmeter", {
      wires: [`M52 ${GY} H368`], mult: [234, GY, 118, 56], streams: [[[[6, GY], [414, GY]], CIG, 1, 26]],
      brackets: [[GX - GR, GX + GR, 84, 1, CV], [234, 352, 84, 1, CV], [52, 368, 350, -1, CV]],
      T: { iLine: [8, 160, "start"], rg: [GX, 244], coil: [GX, 266], rm: [293, 236], multiplier: [293, 258], vCoil: [GX, 68], vOther: [293, 68], vTotal: [210, 370] },
    });
    layout("ss", {   // mistake: shunt in SERIES with the coil — no parallel path, all the current goes through the coil
      wires: [`M52 ${GY} H368`], shunt: [256, GY], streams: [[[[6, GY], [414, GY]], CI, 2, 20]], cross: [286, 140], coilColor: CI,
      T: { iLine: [8, 160, "start"], iCoil: [222, 162, "start"], rg: [GX, 244], coil: [GX, 266], rs: [286, 222], shunt: [286, 248] },
    });
    layout("mp", {   // mistake: multiplier ACROSS the coil — the coil still gets the full p.d.
      wires: [`M52 ${GY} H368`, `M${JL} ${GY} V${LO} H${JR} V${GY}`], mult: [150, LO, 140, 52], junctions: [JL, JR], cross: [312, 252], coilColor: CI,
      streams: [[inL, CI, 2, 20], [[[JL, GY], [JR, GY]], CI, 2, 20], [loop, CIG, 1, 150], [outL, CI, 2, 20]],
      T: { iLine: [8, 160, "start"], coil: [226, 206, "start"], rg: [226, 228, "start"], multiplier: [220, 248], rm: [220, 354] },
    });
    // box finish: total tag, meter letter; burn effects on G
    V.letter = el("g", {}, VG);
    el("circle", { cx: 368, cy: 96, r: 18, fill: "#1b222d", stroke: TXT, "stroke-width": 3 }, V.letter);
    V.letterT = tx("A", 368, 97, 20, TXT, V.letter, "middle", 900);
    V.total = tx("", 210, 394, 16, "#ffe08a", VG, "middle", 900);
    V.smoke = smoke(VG);
    V.burnt = tx("burnt out!", GX, 116, 16, BAD, VG, "middle", 900);

    // =====================================================================
    // scene: test — the finished meters on Emeka's battery
    // =====================================================================
    const E = {}, EG = scenes.test, XL = 96, XR = 352, YT = 90, YB = 340, AX = 240, VX = 186, VY = 214;
    el("path", { d: `M${XL} 164 V${YT} H${XR} V${YB} H${XL} V260`, fill: "none", stroke: WIRE, "stroke-width": 4, "stroke-linejoin": "round" }, EG);
    E.vLeads = el("g", {}, EG);
    el("path", { d: `M${XL} 124 H${VX} V${VY - 36} M${XL} 304 H${VX} V${VY + 36}`, fill: "none", stroke: WIRE, "stroke-width": 3, "stroke-linejoin": "round" }, E.vLeads);
    el("circle", { cx: XL, cy: 124, r: 5.5, fill: WIRE }, E.vLeads); el("circle", { cx: XL, cy: 304, r: 5.5, fill: WIRE }, E.vLeads);
    E.dotG = el("g", {}, EG);
    E.loop = stream(E.dotG, [[XL, 164], [XL, YT], [XR, YT], [XR, YB], [XL, YB], [XL, 164]], CI, 1, 30, 4.6);
    E.vDotG = el("g", {}, EG);
    E.trickle = stream(E.vDotG, [[XL, 124], [VX, 124], [VX, 304], [XL, 304]], CIG, 1, 170, 3.6);
    // battery (+ on top): conventional current leaves + and returns to −
    el("rect", { x: 61, y: 166, width: 70, height: 92, rx: 8, fill: CASE, stroke: EDGE, "stroke-width": 2 }, EG);
    el("rect", { x: 61, y: 196, width: 70, height: 12, fill: "#e3b02a" }, EG);
    el("rect", { x: 89, y: 158, width: 14, height: 10, rx: 2, fill: "#c0392b" }, EG); el("rect", { x: 89, y: 257, width: 14, height: 8, rx: 2, fill: "#222" }, EG);
    tx("+", 118, 152, 18, "#ff8a7a", EG, "middle", 900); tx("−", 118, 270, 18, DIM, EG, "middle", 900);
    E.bat = tx("12.0 V", XL, 232, 16, TXT, EG, "middle", 800);
    E.rin = el("path", { d: "M70 184 l5 -6 l8 12 l8 -12 l8 12 l8 -12 l8 12 l8 -12 l5 6", fill: "none", stroke: PAL.red, "stroke-width": 2.5 }, EG);
    E.r = tx("", 86, 140, 14, PAL.red, EG, "end", 800);
    // starter load
    el("rect", { x: XR - 2, y: 160, width: 4, height: 100, fill: "#1b222d" }, EG);
    el("path", { d: `M${XR} 160 l0 6 l-14 6 l28 12 l-28 12 l28 12 l-28 12 l28 12 l-28 12 l14 6 l0 4`, fill: "none", stroke: CR, "stroke-width": 4, "stroke-linejoin": "round" }, EG);
    E.R = tx("", 392, 212, 15, CR, EG, "middle", 800);
    // ammeter in the top wire (series), voltmeter across the battery (parallel)
    E.am = el("g", {}, EG); E.A = dial(E.am, AX, YT, 34);
    E.aR = tx("", AX, 40, 14, DIM, E.am, "middle", 800); E.aRead = tx("", AX, 146, 16, CI, E.am, "middle", 900);
    E.vm = el("g", {}, EG); E.Vd = dial(E.vm, VX, VY, 34);
    E.vRead = tx("", VX + 46, VY - 8, 16, CV, E.vm, "start", 900); E.vR = tx("", VX + 46, VY + 16, 14, DIM, E.vm, "start", 800);
    E.ok = tx("✓", AX + 56, 54, 30, GOOD, EG, "middle", 900); E.bad = tx("✗", AX + 56, 54, 30, BAD, EG, "middle", 900);
    E.labs = el("g", {}, EG);
    tx("battery", XL, 366, 14, TXT, E.labs, "middle", 800); tx("starter load", XR - 4, 366, 14, CR, E.labs, "middle", 800);

    // focus ring (all scenes)
    const ring = el("rect", { fill: "none", stroke: "#ffe08a", "stroke-width": 3, "stroke-dasharray": "7 6", opacity: 0 }, svg);
    const SPOT = {
      dial: [28, 18, 364, 214], scale: [58, 88, 304, 108], coil: [154, 238, 112, 108],
      G: [128, 132, 96, 96], junction: [72, 156, 48, 48], shunt: [176, 266, 80, 40], multiplier: [226, 146, 134, 68], pd: [84, 38, 262, 58], box: [46, 90, 328, 252],
      ammeter: [200, 50, 80, 80], voltmeter: [146, 174, 80, 80], battery: [52, 150, 88, 124], load: [332, 152, 40, 116],
    };

    return {
      draw(t, P) {
        const s = P.s, p = P.p, u = P.u, cur = s.scene || "dial", prev = p.scene || cur;
        for (const k in scenes) scenes[k].setAttribute("opacity", (k === cur ? (prev === cur ? 1 : u) : k === prev ? 1 - u : 0).toFixed(3));
        const labels = mixN(p, s, "labels", u), burn = mixN(p, s, "burn", u), defl = mixN(p, s, "defl", u);
        const flick = .8 + .2 * Math.sin(t * 13) * Math.sin(t * 4.1);
        const vis = k => k === cur || k === prev;

        if (vis("dial")) {
          const [mx, un, op] = scaleAt(P, "scaleMax", "unit", 15, "mA");
          bigTicks(mx, un); D.ticks.setAttribute("opacity", op.toFixed(3)); D.unit.setAttribute("opacity", op.toFixed(3));
          const a = angle(defl, t), tip = polar(PX, PY, 176, a);
          D.needle.setAttribute("x2", f1(tip[0])); D.needle.setAttribute("y2", f1(tip[1]));
          D.coil.setAttribute("transform", `rotate(${a.toFixed(2)} ${PX} ${PY})`);
          // hairspring: outer end fixed at the lug, inner end turns with the coil, so it winds up as the pointer moves
          let d = ""; const N = 90;
          for (let i = 0; i <= N; i++) { const f = i / N, ang = 90 + (1 - f) * (3.25 * 360 + (a + 50) * 1.0), r = 6 + 16 * f, q = polar(PX, PY, r, ang); d += (i ? "L" : "M") + f1(q[0]) + " " + f1(q[1]); }
          D.spring.setAttribute("d", d);
          const ins = mixN(p, s, "inside", u);
          D.inside.setAttribute("opacity", ins.toFixed(3)); D.cover.setAttribute("opacity", (1 - ins).toFixed(3));
          D.labs.setAttribute("opacity", (ins * labels).toFixed(3));
          const hot = burn * flick;
          D.coilParts.forEach(c => c.setAttribute("fill", burn > .05 ? `rgb(${Math.round(lerp(200, 255, hot))},${Math.round(lerp(118, 70, hot))},${Math.round(lerp(58, 30, hot))})` : COPPER));
          D.glow.setAttribute("opacity", (burn * (.22 + .1 * flick)).toFixed(3));
          D.smoke.draw(t, PX, PY - 10, burn);
          D.burnt.setAttribute("opacity", burn.toFixed(3));
          setTx(D.rg, s.rg, tagOp(P, "rg"));
        }

        if (vis("convert")) {
          const key = st => st.wrong === "shunt-series" ? "ss" : st.wrong === "multiplier-parallel" ? "mp" : (st.mode || "bare");
          const lk = key(s), lp = p.scene === "convert" ? key(p) : lk;
          const [mx, un, op] = scaleAt(P, "scaleMax", "unit", 15, "mA");
          const v = mixN(p, s, "speed", u, .6) * 110, vp = (p.speed != null ? +p.speed : .6) * 110, vs = (s.speed != null ? +s.speed : .6) * 110;
          const phase = travel(vp, vs, t, P.t0 || 0), flow = mixN(p, s, "flow", u), split = mixN(p, s, "split", u), pd = mixN(p, s, "pd", u);
          for (const id in LAY) {
            const L = LAY[id], o = id === lk ? (lp === lk ? 1 : u) : id === lp ? 1 - u : 0;
            L.g.setAttribute("opacity", o.toFixed(3)); if (o < .001) continue;
            L.G.scale(mx, un, op); L.G.point(defl, t);
            L.G.glow.setAttribute("opacity", (burn * (.35 + .15 * flick)).toFixed(3));
            L.G.face.setAttribute("fill", burn > .05 ? `rgb(241,${Math.round(lerp(236, 170, burn * flick))},${Math.round(lerp(223, 140, burn * flick))})` : FACE);
            L.dotG.setAttribute("opacity", flow.toFixed(3)); if (flow > .01) L.streams.forEach(S => S.draw(phase));
            L.pd.setAttribute("opacity", pd.toFixed(3));
            if (L.cross) L.cross.setAttribute("opacity", (.75 + .25 * Math.sin(t * 6)).toFixed(3));
            const T = L.T, sp = (k, base) => T[k] && setTx(T[k], s[k], tagOp(P, k) * base);
            sp("iLine", split); sp("iCoil", split); sp("iShunt", split); sp("rg", 1); sp("rs", 1); sp("rm", 1);
            sp("vCoil", 1); sp("vOther", 1); sp("vTotal", 1);
            if (T.note) setTx(T.note, s.vCoil && s.vCoil !== "same p.d." ? "same p.d." : "", 1);
            for (const k of ["coil", "shunt", "multiplier"]) if (T[k]) setTx(T[k], k, labels);
          }
          const bx = mixN(p, s, "box", u), mode = s.mode || "bare";
          V.boxR.setAttribute("stroke", bx > .5 ? "#ffe08a" : EDGE); V.boxR.setAttribute("fill", `rgba(255,224,138,${(.07 * bx).toFixed(3)})`);
          V.letterT.textContent = mode === "voltmeter" ? "V" : "A";
          V.letter.setAttribute("opacity", (mode === "bare" || s.wrong ? 0 : bx).toFixed(3));
          setTx(V.total, s.total, bx * tagOp(P, "total"));
          V.smoke.draw(t, GX, GY - 20, burn);
          V.burnt.setAttribute("opacity", burn.toFixed(3));
        }

        if (vis("test")) {
          const I = mixN(p, s, "I", u), imax = Math.max(.001, +(s.imax || 3));
          const vs = 70 * (s.I != null ? +s.I : 0) / imax, vp = 70 * (p.I != null ? +p.I : 0) / Math.max(.001, +(p.imax || imax));
          const phase = travel(vp, vs, t, P.t0 || 0);
          E.dotG.setAttribute("opacity", clamp(I * 6, 0, 1).toFixed(3)); E.loop.draw(phase);
          const vm = mixN(p, s, "voltmeter", u), am = mixN(p, s, "ammeter", u);
          E.vLeads.setAttribute("opacity", vm.toFixed(3)); E.vm.setAttribute("opacity", vm.toFixed(3));
          E.vDotG.setAttribute("opacity", (vm * clamp(I * 6, 0, 1)).toFixed(3)); E.trickle.draw(phase * .35);
          E.am.setAttribute("opacity", am.toFixed(3));
          const [am1, au, aop] = scaleAt(P, "aMax", "__a", 3, "A"); E.A.scale(am1, "A", aop); E.A.point(mixN(p, s, "aDefl", u), t);
          const [vm1, vu, vop] = scaleAt(P, "vMax", "__v", 40, "V"); E.Vd.scale(vm1, "V", vop); E.Vd.point(mixN(p, s, "vDefl", u), t);
          setTx(E.aRead, s.aRead, tagOp(P, "aRead")); setTx(E.aR, s.aR, tagOp(P, "aR"));
          setTx(E.vRead, s.vRead, tagOp(P, "vRead")); setTx(E.vR, s.vR, tagOp(P, "vR"));
          setTx(E.bat, s.bat || "12.0 V", 1); setTx(E.r, s.r, tagOp(P, "r")); E.rin.setAttribute("opacity", s.r ? 1 : 0); setTx(E.R, s.R, tagOp(P, "R"));
          const vk = s.verdict, vt = p.verdict === vk ? 1 : ease(seg(u, .2, 1));
          E.ok.setAttribute("opacity", (vk === "ok" ? vt * am : 0).toFixed(3)); E.bad.setAttribute("opacity", (vk === "bad" ? vt * am : 0).toFixed(3));
          E.labs.setAttribute("opacity", labels.toFixed(3));
        }

        const spot = SPOT[s.focus];
        ring.setAttribute("opacity", spot ? (.65 + .35 * Math.sin(t * 5)).toFixed(2) : 0);
        if (spot) { ring.setAttribute("x", spot[0]); ring.setAttribute("y", spot[1]); ring.setAttribute("width", spot[2]); ring.setAttribute("height", spot[3]); ring.setAttribute("rx", Math.min(spot[2], spot[3]) * .3); ring.setAttribute("stroke-dashoffset", ((t * 20) % 13).toFixed(1)); }
      },
    };
  },
};
