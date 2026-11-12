/* =========================================================
   StudyPipe explainer-video kit · reference-circle
   SHM as the shadow of steady circular motion. Four scenes (state `scene`, cross-fades), all driven by ONE angle θ:
   - wheel:   okada rear wheel on its centre stand, a mud lump on the tyre, sun overhead; the lump's shadow slides on the
              ground as a true projection (x = A sin θ, θ timed from the top so the shadow starts at the middle moving +).
   - circle:  the abstract reference circle: radius A, centre O, P on the circle, angle arc θ = ωt from the horizontal
              radius, projection P → N on the vertical diameter; on N the displacement bracket x, velocity arrow v
              (∝ cos θ, flips) and acceleration arrow a (always towards O, ∝ |x|); P's tangent velocity / centripetal
              acceleration with their vertical components; pins; readouts x, v, a computed from A, ω, θ (3 s.f.).
   - traces:  small reference circle + three strips x–t (sine), v–t (cosine, ¼ cycle ahead), a–t (x inverted) on one
              time axis (2 cycles), cursor through all three, optional dashed −g line on the a-strip (scale from ω, A, g).
   - carrier: okada carrier on a coil spring driven by the circle; an egg crate sits loosely on it. Lift-off is COMPUTED:
              the crate leaves where the carrier's downward acceleration ω²x first exceeds g, flies under gravity alone
              (initial upward speed ω√(A² − x²)) and lands where the paths meet again. Push R = m(g + a) ≥ 0.
   Angles: P turns at ω·slow rad per video second (spin: 1) or eases to `theta` (spin: 0, the short way; 180° goes forwards).
   Contract: .agents/skills/explainer-video/references/adding-a-kit.md · every frame is a pure function of (t, P).
   ========================================================= */
(window.VIDEO_KITS = window.VIDEO_KITS || {})["reference-circle"] = {
  title: "Reference circle: SHM as a circle's shadow (okada wheel, reference circle, x/v/a traces, crate lift-off)",
  states: {
    scene: "'wheel' | 'circle' | 'traces' | 'carrier' (cross-fades)",
    A: "amplitude as a number in `unit` (default 0.30); circle/wheel/traces radius is fixed, carrier uses 12 px per cm (radius capped at 96)",
    unit: "'m' | 'cm' (default 'm'): labels and readouts",
    omega: "angular frequency ω in rad/s (default π): spin rate, v, a, lift-off, trace scales",
    spin: "0 = hold at theta · 1 = P turns steadily at omega × slow",
    theta: "angle in degrees when spin: 0 (eases to it over 1.4 s, the short way; 180° goes forwards)",
    slow: "slow-motion factor for spin (default 1; e.g. 0.25 for the 2.0 Hz okada)",
    labels: "0/1: O, P, N, A, θ = ωt (circle) · tyre, hub, mud lump, sun, stand… (wheel) · carrier, spring, egg crate (carrier)",
    sun: "0/1 (wheel): sun, faint overhead rays and the dashed drop line lump → shadow",
    bracket: "0/1: amplitude bracket: wheel ground path = 2A with A = radius; circle: 2A beside the diameter",
    xbar: "0/1 (circle, traces): displacement bracket x from O to N",
    varrow: "0/1 (circle, traces): velocity arrow on N (∝ cos θ, flips sign)",
    aarrow: "0/1 (circle, traces): acceleration arrow on N (always towards O, ∝ |x|)",
    components: "0 none · 1 P's tangent velocity ωA + its vertical component · 2 P's centripetal ω²A + its vertical component (circle)",
    pins: "array of angles in degrees, e.g. [0, 30, 60, 90]: dots on the circle and matching shadow ticks; [] hides (circle)",
    readout: "0/1 (circle): x, v, a values at the current θ (3 s.f., plan unit)",
    show: "traces: array from ['x', 'v', 'a'] (strips fade in/out)",
    cursor: "0/1 (traces): vertical cursor through the strips + faint line from N to the x-strip",
    g: "g in m/s² (default 9.8): −g line, lift-off, carrier arrows",
    gline: "0/1 (traces): dashed −g line on the a-strip (a-strip scale from ω²A and g)",
    forces: "0/1 (carrier): weight mg (constant) and push R (≥ 0) on the crate, carrier acceleration a, reference g",
    verdict: "0/1 (carrier): 'stays on' / 'lifts off' computed from ω²A vs g, with ω²A",
    focus: "dashed pulsing ring: 'lump' | 'shadow' | 'centre' | 'angle' | 'crate' | 'carrier' | null",
  },
  focus: {
    lump: [40, 14, 340, 322], shadow: [146, 40, 168, 300], centre: [160, 120, 140, 130], angle: [196, 96, 176, 140],
    ground: [24, 262, 384, 158],
    "traces-x": [126, 26, 294, 116], "traces-v": [126, 146, 294, 116], "traces-a": [126, 266, 294, 116], gline: [126, 296, 294, 104],
    carrier: [176, 8, 236, 200], crate: [176, 8, 236, 330],
  },
  create(svg, api) {
    const { el, tx, mixN, lerp, ease, seg, clamp, PAL, COLOR, meta } = api;
    const roles = (meta && meta.roles) || {};
    const role = (names, fb) => { for (const n of names) if (roles[n]) return COLOR(n); return fb; };
    const CX = role(["x"], PAL.green), CV = role(["v"], PAL.sky), CA = role(["a"], PAL.amber), CG = role(["g"], PAL.red),
      CW = role(["omega", "ω", "w"], PAL.purple);
    const TXT = "#e8efe9", DIM = "#9fb3a8", LINE = "#c9d6cf", FAINT = "rgba(232,239,233,.35)", SOFT = "#5c6675", GOOD = PAL.green, BAD = PAL.red;
    const TWO_PI = 2 * Math.PI, DEG = Math.PI / 180;
    const f1 = v => (+v).toFixed(1);
    const wrapPi = d => d - TWO_PI * Math.floor((d + Math.PI) / TWO_PI);   // → [−π, π)
    const mod = (a, m) => a - m * Math.floor(a / m);
    const num = (v, d) => (v != null && v !== "" && isFinite(+v) ? +v : d);
    const inM = st => num(st.A, 0.30) / ((st.unit || "m") === "cm" ? 100 : 1);
    const sf3 = (v, scale) => { if (!isFinite(v) || Math.abs(v) < 1e-9 * Math.max(1e-12, scale)) return "0"; const s = (+v.toPrecision(3)).toString() === "0" ? "0" : v.toPrecision(3); return s.replace("-", "−"); };
    const setTx = (e, str, op) => { str = str == null ? "" : String(str); if (e.textContent !== str) e.textContent = str; e.setAttribute("opacity", (str ? op : 0).toFixed(3)); };
    const show = (e, op) => e.setAttribute("opacity", Math.max(0, Math.min(1, op)).toFixed(3));
    const has = (st, k, v) => (Array.isArray(st[k]) ? st[k] : k === "show" && st[k] == null ? ["x", "v", "a"] : []).map(String).indexOf(v) >= 0;

    // arrow: line + head; set(x1, y1, x2, y2, opacity); hidden when shorter than 3 units
    function arrow(parent, color, w, dash) {
      const g = el("g", {}, parent);
      const ln = el("line", { stroke: color, "stroke-width": w || 4, "stroke-linecap": "round" }, g);
      if (dash) ln.setAttribute("stroke-dasharray", dash);
      const hd = el("path", { fill: color }, g);
      return { g, set(x1, y1, x2, y2, op) {
        const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy);
        if (L < 3 || op < .01) { g.setAttribute("opacity", 0); return; }
        g.setAttribute("opacity", op.toFixed(3));
        const ux = dx / L, uy = dy / L, hl = Math.min(13, L * .55), hw = hl * .55, bx = x2 - ux * hl, by = y2 - uy * hl;
        ln.setAttribute("x1", f1(x1)); ln.setAttribute("y1", f1(y1)); ln.setAttribute("x2", f1(bx + ux * 1)); ln.setAttribute("y2", f1(by + uy * 1));
        hd.setAttribute("d", `M${f1(x2)} ${f1(y2)} L${f1(bx - uy * hw)} ${f1(by + ux * hw)} L${f1(bx + uy * hw)} ${f1(by - ux * hw)} Z`);
      } };
    }
    const arcPath = (cx, cy, r, a0, a1) => {   // math angles (rad, counter-clockwise, y up) from a0 to a1 > a0
      if (a1 - a0 < 1e-3) return "";
      const span = Math.min(a1 - a0, TWO_PI - 1e-3), p0 = [cx + r * Math.cos(a0), cy - r * Math.sin(a0)], p1 = [cx + r * Math.cos(a0 + span), cy - r * Math.sin(a0 + span)];
      return `M${f1(p0[0])} ${f1(p0[1])} A${r} ${r} 0 ${span > Math.PI ? 1 : 0} 0 ${f1(p1[0])} ${f1(p1[1])}`;
    };
    const vBracket = (parent, color) => el("path", { fill: "none", stroke: color, "stroke-width": 2.6, "stroke-linejoin": "round" }, parent);
    const setVB = (b, x, y0, y1, dir) => b.setAttribute("d", `M${f1(x + 7 * dir)} ${f1(y0)} H${f1(x)} V${f1(y1)} H${f1(x + 7 * dir)}`);

    // ---------- the one angle (radians), pure in t ----------
    const wEff = st => num(st.omega, Math.PI) * num(st.slow, 1);
    const target = (st, t) => (+st.spin ? wEff(st) * t : num(st.theta, 0) * DEG);
    const thetaAt = (t, P) => target(P.s, t) + (1 - P.u) * wrapPi(target(P.p, P.t0 || 0) - target(P.s, P.t0 || 0));

    // ---------- lift-off model (steady periodic state, as a function of carrier phase φ) ----------
    // carrier y = A sin φ (m, up +), φ = ωt. Separation where ω²y first exceeds g on the way up: φs = asin(g / ω²A).
    // Free flight from (ys, vs = ωA cos φs) under g only; landing where the crate meets the carrier again.
    let flightKey = "", FL = null;
    function flight(A, w, g) {
      const key = A.toFixed(6) + "|" + w.toFixed(5) + "|" + g;
      if (key === flightKey) return FL;
      flightKey = key; FL = null;
      const am = w * w * A; if (!(am > g) || A <= 0 || w <= 0) return null;
      const ps = Math.asin(g / am), ys = A * Math.sin(ps), vs = w * A * Math.cos(ps), T = TWO_PI / w;
      const gap = tau => ys + vs * tau - .5 * g * tau * tau - A * Math.sin(ps + w * tau);
      let land = T, N = 400;
      for (let i = 1; i <= N; i++) {
        const tau = i * T / N;
        if (gap(tau) < 0) { let lo = (i - 1) * T / N, hi = tau; for (let k = 0; k < 40; k++) { const m = (lo + hi) / 2; if (gap(m) < 0) hi = m; else lo = m; } land = lo; break; }
      }
      FL = { ps, ys, vs, land, pl: ps + w * Math.min(land, T * .999) };
      return FL;
    }
    // crate height (m) and contact flag at carrier phase φ
    function crateAt(phi, A, w, g) {
      const F = flight(A, w, g), yc = A * Math.sin(phi);
      if (!F) return { y: yc, on: true, yc };
      let q = mod(phi, TWO_PI); if (q < F.ps) q += TWO_PI;
      if (q <= F.pl) { const tau = (q - F.ps) / w; return { y: Math.max(yc, F.ys + F.vs * tau - .5 * g * tau * tau), on: false, yc }; }
      return { y: yc, on: true, yc };
    }

    const scenes = { wheel: el("g", {}, svg), circle: el("g", {}, svg), traces: el("g", {}, svg), carrier: el("g", {}, svg) };

    // =====================================================================
    // scene: wheel — okada rear wheel on its centre stand, sun overhead
    // =====================================================================
    const W = {}, WG = scenes.wheel, WX = 200, WY = 160, RT = 106, RL = 118, GY = 316;
    W.sunG = el("g", {}, WG);
    for (let x = 14; x < 420; x += 28) el("line", { x1: x, y1: 0, x2: x, y2: GY, stroke: PAL.gold, "stroke-width": 1.2, opacity: .14 }, W.sunG);
    el("circle", { cx: 378, cy: 30, r: 15, fill: PAL.gold }, W.sunG);
    for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; el("line", { x1: f1(378 + 20 * Math.cos(a)), y1: f1(30 + 20 * Math.sin(a)), x2: f1(378 + 27 * Math.cos(a)), y2: f1(30 + 27 * Math.sin(a)), stroke: PAL.gold, "stroke-width": 2.4, "stroke-linecap": "round" }, W.sunG); }
    // ground (laterite) and the stand / swing-arm
    el("rect", { x: 0, y: GY, width: 420, height: 420 - GY, fill: "#5e4130" }, WG);
    el("line", { x1: 0, y1: GY, x2: 420, y2: GY, stroke: "#9a6a4a", "stroke-width": 3 }, WG);
    el("path", { d: `M372 150 L350 ${GY} M372 150 L396 ${GY}`, stroke: "#7d8796", "stroke-width": 7, "stroke-linecap": "round", fill: "none" }, WG);
    el("rect", { x: 338, y: GY - 5, width: 70, height: 6, rx: 3, fill: "#7d8796" }, WG);
    el("path", { d: `M${WX} ${WY} L420 118`, stroke: "#4a5260", "stroke-width": 18, "stroke-linecap": "round" }, WG);
    el("path", { d: `M${WX} ${WY} L420 118`, stroke: "#6b7482", "stroke-width": 10, "stroke-linecap": "round" }, WG);
    // the wheel (rotates as a group): tyre + tread, rim, spokes, hub
    W.wheel = el("g", {}, WG);
    el("circle", { cx: WX, cy: WY, r: RT, fill: "none", stroke: "#1f232a", "stroke-width": 22 }, W.wheel);
    for (let k = 0; k < 40; k++) { const a = k * TWO_PI / 40; el("line", { x1: f1(WX + 109 * Math.cos(a)), y1: f1(WY + 109 * Math.sin(a)), x2: f1(WX + 117 * Math.cos(a)), y2: f1(WY + 117 * Math.sin(a)), stroke: "#3a414d", "stroke-width": 5 }, W.wheel); }
    el("circle", { cx: WX, cy: WY, r: 94, fill: "none", stroke: "#a7b2bd", "stroke-width": 5 }, W.wheel);
    for (let k = 0; k < 12; k++) { const a = k * TWO_PI / 12, b = a + .5; el("line", { x1: f1(WX + 15 * Math.cos(a)), y1: f1(WY + 15 * Math.sin(a)), x2: f1(WX + 92 * Math.cos(b)), y2: f1(WY + 92 * Math.sin(b)), stroke: "#b8c2cc", "stroke-width": 1.6 }, W.wheel); }
    el("circle", { cx: WX, cy: WY, r: 17, fill: "#7d8796", stroke: "#c3cad3", "stroke-width": 2 }, WG);
    el("circle", { cx: WX, cy: WY, r: 5, fill: "#2b313b" }, WG);
    // amplitude bracket (ground) + radius line
    W.brk = el("g", {}, WG);
    W.rad = el("line", { x1: WX, y1: WY, x2: WX + RL, y2: WY, stroke: CX, "stroke-width": 2.4, "stroke-dasharray": "6 5" }, W.brk);
    el("path", { d: `M${WX - RL} ${GY + 4} V${GY + 28} M${WX + RL} ${GY + 4} V${GY + 66}`, stroke: FAINT, "stroke-width": 1.2, "stroke-dasharray": "3 4" }, W.brk);
    el("path", { d: `M${WX - RL} ${GY + 22} V${GY + 30} H${WX + RL} V${GY + 22} M${WX} ${GY + 30} V${GY + 24}`, fill: "none", stroke: TXT, "stroke-width": 2.4 }, W.brk);
    tx("path = 2A", WX, GY + 46, 14, TXT, W.brk, "middle", 800);
    el("path", { d: `M${WX} ${GY + 58} V${GY + 66} H${WX + RL} V${GY + 58}`, fill: "none", stroke: CX, "stroke-width": 2.6 }, W.brk);
    tx("A", WX + RL / 2, GY + 82, 15, CX, W.brk, "middle", 900);
    tx("A", WX + RL / 2, WY - 12, 15, CX, W.brk, "middle", 900);
    // drop line, lump, shadow
    W.drop = el("line", { stroke: PAL.gold, "stroke-width": 1.8, "stroke-dasharray": "5 5", opacity: .8 }, WG);
    W.shadow = el("ellipse", { rx: 15, ry: 5, fill: "#120d0a", stroke: "#2b201a", "stroke-width": 1 }, WG);
    W.lump = el("g", {}, WG);
    el("path", { d: "M-11 2 C-12 -7 -4 -12 3 -10 C10 -9 13 -2 11 4 C9 10 -8 11 -11 2 Z", fill: "#8a4b2a", stroke: "#c07a4f", "stroke-width": 1.5 }, W.lump);
    el("circle", { cx: -3, cy: -4, r: 2.5, fill: "#b9714a" }, W.lump);
    // labels
    W.labs = el("g", {}, WG);
    W.lumpLead = el("line", { stroke: FAINT, "stroke-width": 1.2 }, W.labs);
    tx("mud lump", 12, 24, 14, "#e0a07a", W.labs, "start", 800);
    tx("tyre", 48, 160, 14, TXT, W.labs, "middle", 800);
    tx("hub", WX, WY + 32, 13, TXT, W.labs, "middle", 800);
    tx("swing-arm", 352, 104, 13, DIM, W.labs, "middle", 800);
    tx("stand", 404, 214, 13, DIM, W.labs, "end", 800);
    W.sunLab = tx("sun", 378, 64, 13, PAL.gold, W.labs, "middle", 800);
    W.shLab = tx("shadow", 0, GY + 13, 13, TXT, W.labs, "start", 800);

    // =====================================================================
    // scene: circle — the abstract reference circle (vertical projection axis)
    // =====================================================================
    const R = {}, RG = scenes.circle, OX = 230, OY = 185, RR = 125, LV = .55 * RR, LA = .55 * RR;
    el("circle", { cx: OX, cy: OY, r: RR, fill: "rgba(195,155,255,.05)", stroke: LINE, "stroke-width": 2.6 }, RG);
    el("line", { x1: OX, y1: OY - RR - 14, x2: OX, y2: OY + RR + 14, stroke: DIM, "stroke-width": 2 }, RG);   // projection axis (vertical diameter)
    el("line", { x1: OX, y1: OY, x2: OX + RR, y2: OY, stroke: SOFT, "stroke-width": 1.6, "stroke-dasharray": "4 5" }, RG);   // θ = 0 radius
    R.brk = el("g", {}, RG);
    el("path", { d: `M${OX - RR - 14} ${OY - RR} H${OX - RR - 26} V${OY + RR} H${OX - RR - 14}`, fill: "none", stroke: TXT, "stroke-width": 2.4 }, R.brk);
    el("path", { d: `M${OX - RR - 14} ${OY - RR} H${OX}  M${OX - RR - 14} ${OY + RR} H${OX}`, stroke: FAINT, "stroke-width": 1, "stroke-dasharray": "3 4" }, R.brk);
    tx("2A", OX - RR - 46, OY, 15, TXT, R.brk, "middle", 900);
    R.pins = el("g", {}, RG); R.pinKey = "";
    R.arc = el("path", { fill: "none", stroke: CW, "stroke-width": 3 }, RG);
    R.rad = el("line", { x1: OX, y1: OY, stroke: LINE, "stroke-width": 3 }, RG);
    R.proj = el("line", { stroke: LINE, "stroke-width": 1.8, "stroke-dasharray": "6 5" }, RG);
    R.xbar = vBracket(RG, CX);
    R.comp = el("g", {}, RG);
    R.cTan = arrow(R.comp, CV, 3.4); R.cTanV = arrow(R.comp, CV, 2.6, "5 4");
    R.cCen = arrow(R.comp, CA, 3.4); R.cCenV = arrow(R.comp, CA, 2.6, "5 4");
    R.cLink = el("line", { stroke: FAINT, "stroke-width": 1.2, "stroke-dasharray": "3 4" }, R.comp);
    R.cLab = tx("", 0, 0, 14, CV, R.comp, "middle", 900);
    R.v = arrow(RG, CV, 4.2); R.a = arrow(RG, CA, 4.2);
    el("circle", { cx: OX, cy: OY, r: 4.5, fill: TXT }, RG);
    R.P = el("circle", { r: 8, fill: CW, stroke: "#fff", "stroke-width": 2 }, RG);
    R.N = el("circle", { r: 7, fill: CX, stroke: "#10151c", "stroke-width": 2 }, RG);
    R.labs = el("g", {}, RG);
    R.lO = tx("O", OX + 16, OY + 17, 15, TXT, R.labs, "middle", 900);
    R.lP = tx("P", 0, 0, 15, CW, R.labs, "middle", 900);
    R.lN = tx("N", 0, 0, 15, CX, R.labs, "middle", 900);
    R.lA = tx("A", 0, 0, 15, TXT, R.labs, "middle", 900);
    R.lTh = tx("θ = ωt", 0, 0, 14, CW, R.labs, "middle", 900);
    R.lx = tx("x", 0, 0, 16, CX, RG, "middle", 900);
    R.lv = tx("v", 0, 0, 16, CV, RG, "middle", 900);
    R.la = tx("a", 0, 0, 16, CA, RG, "middle", 900);
    R.ro = el("g", {}, RG);
    R.rx = tx("", 14, 342, 15, CX, R.ro, "start", 800);
    R.rv = tx("", 14, 366, 15, CV, R.ro, "start", 800);
    R.ra = tx("", 14, 390, 15, CA, R.ro, "start", 800);

    // =====================================================================
    // scene: traces — small circle + x–t, v–t, a–t strips on one time axis (2 cycles)
    // =====================================================================
    const T = {}, TG = scenes.traces, TCX = 66, TH = 46, X0 = 150, X1 = 400, YS = { x: 84, v: 204, a: 324 }, NPTS = 160;
    el("circle", { cx: TCX, cy: YS.x, r: TH, fill: "rgba(195,155,255,.05)", stroke: LINE, "stroke-width": 2.2 }, TG);
    el("line", { x1: TCX, y1: YS.x - TH - 8, x2: TCX, y2: YS.x + TH + 8, stroke: DIM, "stroke-width": 1.6 }, TG);
    T.rad = el("line", { stroke: LINE, "stroke-width": 2.4 }, TG);
    T.proj = el("line", { stroke: LINE, "stroke-width": 1.5, "stroke-dasharray": "5 4" }, TG);
    T.arc = el("path", { fill: "none", stroke: CW, "stroke-width": 2.4 }, TG);
    T.xbar = vBracket(TG, CX);
    T.v = arrow(TG, CV, 3.4); T.a = arrow(TG, CA, 3.4);
    T.P = el("circle", { r: 6.5, fill: CW, stroke: "#fff", "stroke-width": 1.8 }, TG);
    T.N = el("circle", { r: 5.5, fill: CX, stroke: "#10151c", "stroke-width": 1.6 }, TG);
    T.link = el("line", { stroke: CX, "stroke-width": 1.4, "stroke-dasharray": "3 4", opacity: .5 }, TG);
    T.labs = el("g", {}, TG);
    tx("P", 0, 0, 13, CW, T.labs, "middle", 900); T.lP = T.labs.lastChild;
    tx("N", TCX - 16, 0, 13, CX, T.labs, "middle", 900); T.lN = T.labs.lastChild;
    T.strips = {};
    for (const k of ["x", "v", "a"]) {
      const g = el("g", {}, TG), y = YS[k], col = k === "x" ? CX : k === "v" ? CV : CA;
      el("rect", { x: X0 - 6, y: y - TH - 10, width: X1 - X0 + 14, height: 2 * TH + 20, rx: 10, fill: "rgba(255,255,255,.03)", stroke: "rgba(255,255,255,.08)" }, g);
      el("line", { x1: X0, y1: y, x2: X1 + 4, y2: y, stroke: SOFT, "stroke-width": 1.4 }, g);
      el("line", { x1: X0, y1: y - TH - 6, x2: X0, y2: y + TH + 6, stroke: SOFT, "stroke-width": 1.4 }, g);
      for (let c = 1; c <= 4; c++) el("line", { x1: X0 + c * (X1 - X0) / 4, y1: y - 3, x2: X0 + c * (X1 - X0) / 4, y2: y + 3, stroke: SOFT, "stroke-width": 1.4 }, g);
      tx(k, X0 - 18, y, 17, col, g, "middle", 900);
      tx("t", X1 + 8, y + 14, 13, DIM, g, "middle", 800);
      const ghost = el("path", { fill: "none", stroke: col, "stroke-width": 2.4, opacity: .22 }, g);
      const live = el("path", { fill: "none", stroke: col, "stroke-width": 3.2, "stroke-linejoin": "round" }, g);
      const dot = el("circle", { r: 5, fill: col, stroke: "#10151c", "stroke-width": 1.5 }, g);
      T.strips[k] = { g, ghost, live, dot, y };
    }
    T.gl = el("g", {}, TG);
    T.gline = el("line", { x1: X0, x2: X1 + 4, stroke: CG, "stroke-width": 2.2, "stroke-dasharray": "7 5" }, T.gl);
    T.glab = tx("−g", X0 - 18, 0, 15, CG, T.gl, "middle", 900);
    T.cursor = el("line", { y1: YS.x - TH - 10, y2: YS.a + TH + 10, stroke: "#fff", "stroke-width": 1.6, opacity: .55 }, TG);

    // =====================================================================
    // scene: carrier — okada carrier on a coil spring, egg crate sitting loosely on it
    // =====================================================================
    const K = {}, KG = scenes.carrier, KCX = 100, KY0 = 215, PL0 = 200, PL1 = 330, PCX = 265, BASE = 370, CRW = 66, CRH = 40;
    el("line", { x1: 8, y1: KY0, x2: 412, y2: KY0, stroke: SOFT, "stroke-width": 1.6, "stroke-dasharray": "8 6" }, KG);   // centre line
    K.circ = el("circle", { cx: KCX, cy: KY0, fill: "rgba(195,155,255,.05)", stroke: LINE, "stroke-width": 2.2 }, KG);
    K.axis = el("line", { x1: KCX, x2: KCX, stroke: DIM, "stroke-width": 1.4 }, KG);
    K.rad = el("line", { x1: KCX, y1: KY0, stroke: LINE, "stroke-width": 2.4 }, KG);
    el("circle", { cx: KCX, cy: KY0, r: 3.5, fill: TXT }, KG);
    K.link = el("line", { stroke: LINE, "stroke-width": 1.6, "stroke-dasharray": "6 5", opacity: .8 }, KG);
    K.P = el("circle", { r: 6.5, fill: CW, stroke: "#fff", "stroke-width": 1.8 }, KG);
    // base (swing-arm block) and the spring
    el("rect", { x: PCX - 46, y: BASE, width: 92, height: 16, rx: 5, fill: "#4a5260", stroke: "#7d8796", "stroke-width": 1.5 }, KG);
    el("line", { x1: PCX - 80, y1: BASE + 24, x2: PCX + 80, y2: BASE + 24, stroke: "#9a6a4a", "stroke-width": 3 }, KG);
    K.springB = el("path", { fill: "none", stroke: "#6c7684", "stroke-width": 3.4, "stroke-linejoin": "round" }, KG);
    K.springF = el("path", { fill: "none", stroke: "#c3cad3", "stroke-width": 3.4, "stroke-linejoin": "round" }, KG);
    // carrier plate (rack) and crate
    K.plate = el("g", {}, KG);
    el("rect", { x: PL0, y: 0, width: PL1 - PL0, height: 9, rx: 3, fill: "#9aa4b0", stroke: "#d4dae1", "stroke-width": 1.4 }, K.plate);
    el("rect", { x: PCX - 12, y: 9, width: 24, height: 8, rx: 2, fill: "#7d8796" }, K.plate);
    for (const x of [PL0 + 6, PL1 - 6]) el("rect", { x: x - 3, y: -10, width: 6, height: 12, rx: 2, fill: "#9aa4b0" }, K.plate);
    K.crate = el("g", {}, KG);
    el("rect", { x: PCX - CRW / 2, y: -CRH, width: CRW, height: CRH, rx: 3, fill: "#d9c08a", stroke: "#8a6d3b", "stroke-width": 2 }, K.crate);
    for (let i = 1; i < 4; i++) el("line", { x1: PCX - CRW / 2 + 2, y1: -CRH + i * 10, x2: PCX + CRW / 2 - 2, y2: -CRH + i * 10, stroke: "#a8884f", "stroke-width": 1.4 }, K.crate);
    for (let i = 0; i < 4; i++) el("ellipse", { cx: PCX - 24 + i * 16, cy: -CRH - 2, rx: 6.5, ry: 5, fill: "#f4ead6", stroke: "#cdbb98", "stroke-width": 1 }, K.crate);
    // force and acceleration arrows
    K.forces = el("g", {}, KG);
    K.Rr = arrow(K.forces, PAL.blue, 4.2); K.Wt = arrow(K.forces, CG, 4.2); K.Ac = arrow(K.forces, CA, 4.2); K.Gr = arrow(K.forces, CG, 3.4);
    K.lR = tx("R", 0, 0, 15, PAL.blue, K.forces, "end", 900);
    K.lW = tx("mg", 0, 0, 15, CG, K.forces, "start", 900);
    K.lA = tx("a", 0, 0, 15, CA, K.forces, "start", 900);
    tx("g", 384, 96, 15, CG, K.forces, "end", 900);
    // labels, verdict, model badge
    K.labs = el("g", {}, KG);
    K.lCrate = tx("egg crate", PCX, 0, 13, "#e8d6ae", K.labs, "middle", 800);
    K.lCar = tx("carrier", PL0 - 6, 0, 13, TXT, K.labs, "end", 800);
    tx("spring", PCX - 30, 352, 13, DIM, K.labs, "end", 800);
    tx("centre", 8, KY0 - 10, 12, DIM, K.labs, "start", 800);
    K.ver = el("g", {}, KG);
    K.verT = tx("", PCX, 22, 17, GOOD, K.ver, "middle", 900);
    K.verV = tx("", PCX, 44, 13, TXT, K.ver, "middle", 800);
    tx("model", 10, 408, 12, DIM, KG, "start", 800);

    // focus ring (all scenes)
    const ring = el("circle", { fill: "none", stroke: "#ffe08a", "stroke-width": 3, "stroke-dasharray": "7 6", opacity: 0 }, svg);

    return {
      draw(t, P) {
        const s = P.s, p = P.p, u = P.u, cur = s.scene || "circle", prev = p.scene || cur;
        for (const k in scenes) scenes[k].setAttribute("opacity", (k === cur ? (prev === cur ? 1 : u) : k === prev ? 1 - u : 0).toFixed(3));
        const vis = k => k === cur || k === prev;
        const th = thetaAt(t, P), sn = Math.sin(th), cs = Math.cos(th);
        const labels = mixN(p, s, "labels", u), g = num(s.g, 9.8);
        const unit = s.unit || "m", Au = num(s.A, .30), w = num(s.omega, Math.PI);
        let F = null;   // focus ring target [x, y, r]

        if (vis("wheel")) {
          // lump on the tyre, θ clockwise from the top: shadow x = A sin θ, starts at the middle moving + (right)
          const lx = WX + RL * sn, ly = WY - RL * cs, sun = mixN(p, s, "sun", u);
          W.wheel.setAttribute("transform", `rotate(${(th / DEG).toFixed(2)} ${WX} ${WY})`);
          W.lump.setAttribute("transform", `translate(${f1(lx)} ${f1(ly)}) rotate(${(th / DEG).toFixed(1)})`);
          W.shadow.setAttribute("cx", f1(lx)); W.shadow.setAttribute("cy", GY);
          W.drop.setAttribute("x1", f1(lx)); W.drop.setAttribute("y1", f1(ly + 11)); W.drop.setAttribute("x2", f1(lx)); W.drop.setAttribute("y2", GY - 4);
          show(W.drop, .85 * sun); show(W.sunG, sun); show(W.shadow, .35 + .65 * sun);
          show(W.brk, mixN(p, s, "bracket", u));
          show(W.labs, labels); W.sunLab.setAttribute("opacity", sun.toFixed(3));
          W.shLab.setAttribute("x", f1(lx + 12));
          W.lumpLead.setAttribute("x1", 52); W.lumpLead.setAttribute("y1", 32); W.lumpLead.setAttribute("x2", f1(lx - 9 * (lx > 52 ? 1 : -1))); W.lumpLead.setAttribute("y2", f1(ly - 4));
          if (cur === "wheel") { if (s.focus === "lump") F = [lx, ly, 22]; else if (s.focus === "shadow") F = [lx, GY, 24]; else if (s.focus === "centre") F = [WX, WY, 26]; }
        }

        if (vis("circle")) {
          const px = OX + RR * cs, py = OY - RR * sn, ny = py;
          R.P.setAttribute("cx", f1(px)); R.P.setAttribute("cy", f1(py)); R.N.setAttribute("cx", OX); R.N.setAttribute("cy", f1(ny));
          R.rad.setAttribute("x2", f1(px)); R.rad.setAttribute("y2", f1(py));
          R.proj.setAttribute("x1", f1(px)); R.proj.setAttribute("y1", f1(py)); R.proj.setAttribute("x2", OX); R.proj.setAttribute("y2", f1(ny));
          const tm = mod(th, TWO_PI);
          R.arc.setAttribute("d", arcPath(OX, OY, 32, 0, tm));
          show(R.brk, mixN(p, s, "bracket", u));
          // displacement bracket x (O → N), left of the axis
          const xb = mixN(p, s, "xbar", u), xo = Math.abs(sn) > .06 ? 1 : Math.abs(sn) / .06;
          setVB(R.xbar, OX - 40, OY, ny, 1); show(R.xbar, xb * xo);
          R.lx.setAttribute("x", OX - 54); R.lx.setAttribute("y", f1((OY + ny) / 2)); show(R.lx, xb * clamp((Math.abs(sn) - .12) / .15, 0, 1));
          // velocity of N: vertical component of P's velocity (ωA along the tangent) → length LV·cos θ, up when cos θ > 0
          const va = mixN(p, s, "varrow", u), vtip = ny - LV * cs;
          R.v.set(OX + 13, ny, OX + 13, vtip, va);
          R.lv.setAttribute("x", OX + 27); R.lv.setAttribute("y", f1(vtip + (cs >= 0 ? -2 : 4))); show(R.lv, va * clamp((Math.abs(cs) - .2) / .15, 0, 1));
          // acceleration of N: vertical component of the centripetal ω²A (towards O) → length LA·|sin θ|, always towards O
          const aa = mixN(p, s, "aarrow", u), atip = ny + LA * sn;
          R.a.set(OX - 13, ny, OX - 13, atip, aa);
          R.la.setAttribute("x", OX - 26); R.la.setAttribute("y", f1(atip)); show(R.la, aa * clamp((Math.abs(sn) - .3) / .15, 0, 1));
          // P's own velocity / centripetal acceleration and their vertical components
          const comp = num(s.components, 0), pc = num(p.components, comp), cOp = comp === pc ? 1 : u;
          const cShow = comp || pc, cAmt = comp ? cOp : 1 - cOp;
          show(R.comp, cAmt);
          if (cShow === 1) {
            const ex = px - LV * sn, ey = py - LV * cs;     // tangent (counter-clockwise motion)
            R.cTan.set(px, py, ex, ey, 1); R.cTanV.set(px, py, px, ey, 1); R.cCen.set(0, 0, 0, 0, 0); R.cCenV.set(0, 0, 0, 0, 0);
            R.cLink.setAttribute("x1", f1(ex)); R.cLink.setAttribute("y1", f1(ey)); R.cLink.setAttribute("x2", f1(px)); R.cLink.setAttribute("y2", f1(ey));
            setTx(R.cLab, "ωA", 1); R.cLab.setAttribute("fill", CV);
            R.cLab.setAttribute("x", f1(ex - 16 * sn + (cs >= 0 ? 0 : 0))); R.cLab.setAttribute("y", f1(ey - 14 * cs - (Math.abs(cs) < .3 ? 12 : 0)));
          } else if (cShow === 2) {
            const ex = px - LA * cs, ey = py + LA * sn;     // towards O
            R.cCen.set(px, py, ex, ey, 1); R.cCenV.set(px, py, px, ey, 1); R.cTan.set(0, 0, 0, 0, 0); R.cTanV.set(0, 0, 0, 0, 0);
            R.cLink.setAttribute("x1", f1(ex)); R.cLink.setAttribute("y1", f1(ey)); R.cLink.setAttribute("x2", f1(px)); R.cLink.setAttribute("y2", f1(ey));
            setTx(R.cLab, "ω²A", 1); R.cLab.setAttribute("fill", CA);
            R.cLab.setAttribute("x", f1(px - .5 * LA * cs - 22 * sn)); R.cLab.setAttribute("y", f1(py + .5 * LA * sn - 16 * cs));
          }
          // pins: dots on the circle + matching shadow ticks on the diameter
          const pins = Array.isArray(s.pins) ? s.pins : [], pk = pins.join(",");
          if (pk !== R.pinKey) {
            R.pinKey = pk; while (R.pins.firstChild) R.pins.removeChild(R.pins.firstChild);
            pins.forEach(d => { const a = +d * DEG, qx = OX + RR * Math.cos(a), qy = OY - RR * Math.sin(a);
              el("line", { x1: f1(qx), y1: f1(qy), x2: OX, y2: f1(qy), stroke: CW, "stroke-width": 1, "stroke-dasharray": "2 4", opacity: .6 }, R.pins);
              el("circle", { cx: f1(qx), cy: f1(qy), r: 5, fill: "none", stroke: CW, "stroke-width": 2.4 }, R.pins);
              el("line", { x1: OX - 8, y1: f1(qy), x2: OX + 8, y2: f1(qy), stroke: CX, "stroke-width": 2.6 }, R.pins);
              tx(`${+d}°`, f1(OX + (RR + 40) * Math.cos(a)), f1(OY - (RR + 36) * Math.sin(a)), 13, CW, R.pins, "middle", 800); });
          }
          show(R.pins, pk === (Array.isArray(p.pins) ? p.pins.join(",") : pk) ? 1 : u);
          // labels: P inside the circle, N left of the axis, A along OP, θ = ωt by the arc
          show(R.labs, labels);
          R.lP.setAttribute("x", f1(OX + (RR + 17) * cs)); R.lP.setAttribute("y", f1(OY - (RR + 17) * sn));
          R.lN.setAttribute("x", OX - 24); R.lN.setAttribute("y", f1(ny + (Math.abs(sn) < .3 ? -16 : 1)));
          R.lA.setAttribute("x", f1(OX + .62 * RR * cs - 13 * sn)); R.lA.setAttribute("y", f1(OY - .62 * RR * sn - 13 * cs));
          const hm = tm / 2; R.lTh.setAttribute("x", f1(OX + 62 * Math.cos(hm) + 8)); R.lTh.setAttribute("y", f1(OY - 50 * Math.sin(hm) + (tm < .35 ? 14 : 0)));
          R.lTh.setAttribute("opacity", (tm > .12 ? 1 : 0));
          // readouts x = A sin θ, v = ωA cos θ, a = −ω²x (plan unit, 3 s.f.)
          const ro = mixN(p, s, "readout", u);
          show(R.ro, ro);
          if (ro > .01) {
            const xv = Au * sn, vv = w * Au * cs, av = -w * w * xv;
            setTx(R.rx, `x = ${sf3(xv, Au)} ${unit}`, 1); setTx(R.rv, `v = ${sf3(vv, w * Au)} ${unit}/s`, 1); setTx(R.ra, `a = ${sf3(av, w * w * Au)} ${unit}/s²`, 1);
          }
          if (cur === "circle") { const f = s.focus; if (f === "lump") F = [px, py, 22]; else if (f === "shadow") F = [OX, ny, 24]; else if (f === "centre") F = [OX, OY, 24]; else if (f === "angle") F = [OX + 30 * Math.cos(Math.min(tm, Math.PI) / 2), OY - 30 * Math.sin(Math.min(tm, Math.PI) / 2), 40]; }
        }

        if (vis("traces")) {
          const px = TCX + TH * cs, py = YS.x - TH * sn;
          T.P.setAttribute("cx", f1(px)); T.P.setAttribute("cy", f1(py)); T.N.setAttribute("cx", TCX); T.N.setAttribute("cy", f1(py));
          T.rad.setAttribute("x1", TCX); T.rad.setAttribute("y1", YS.x); T.rad.setAttribute("x2", f1(px)); T.rad.setAttribute("y2", f1(py));
          T.proj.setAttribute("x1", f1(px)); T.proj.setAttribute("y1", f1(py)); T.proj.setAttribute("x2", TCX); T.proj.setAttribute("y2", f1(py));
          T.arc.setAttribute("d", arcPath(TCX, YS.x, 16, 0, mod(th, TWO_PI)));
          setVB(T.xbar, TCX - 22, YS.x, py, 1); show(T.xbar, mixN(p, s, "xbar", u) * Math.min(1, Math.abs(sn) / .06));
          T.v.set(TCX + 10, py, TCX + 10, py - .5 * TH * cs, mixN(p, s, "varrow", u));
          T.a.set(TCX - 10, py, TCX - 10, py + .5 * TH * sn, mixN(p, s, "aarrow", u));
          show(T.labs, labels);
          T.lP.setAttribute("x", f1(TCX + (TH + 14) * cs)); T.lP.setAttribute("y", f1(YS.x - (TH + 14) * sn));
          T.lN.setAttribute("x", TCX - 34); T.lN.setAttribute("y", f1(py));
          // strips: phase φ = θ mod 4π across the window; live up to the cursor, last sweep faint ahead of it
          const phi = mod(th, 2 * TWO_PI), W4 = X1 - X0, cxp = X0 + W4 * phi / (2 * TWO_PI);
          const am = w * w * num(s.A, .30) / (unit === "cm" ? 100 : 1), glOn = mixN(p, s, "gline", u);
          const aScale = lerp(1, am / Math.max(am, g), glOn), gY = YS.a + TH * g / Math.max(am, g);
          const fns = { x: q => -Math.sin(q), v: q => -Math.cos(q), a: q => aScale * Math.sin(q) };
          for (const k of ["x", "v", "a"]) {
            const S = T.strips[k], op = lerp(has(p, "show", k) ? 1 : 0, has(s, "show", k) ? 1 : 0, u);
            show(S.g, op); if (op < .01) continue;
            let dl = "", dg = "";
            for (let i = 0; i <= NPTS; i++) { const q = i / NPTS * 2 * TWO_PI, X = X0 + W4 * i / NPTS, Y = S.y + TH * fns[k](q);
              if (q <= phi) dl += (dl ? "L" : "M") + f1(X) + " " + f1(Y); else dg += (dg ? "L" : "M") + f1(X) + " " + f1(Y); }
            dl += (dl ? "L" : "M") + f1(cxp) + " " + f1(S.y + TH * fns[k](phi));
            S.live.setAttribute("d", dl); S.ghost.setAttribute("d", dg);
            S.dot.setAttribute("cx", f1(cxp)); S.dot.setAttribute("cy", f1(S.y + TH * fns[k](phi)));
          }
          T.gline.setAttribute("y1", f1(gY)); T.gline.setAttribute("y2", f1(gY)); T.glab.setAttribute("y", f1(gY));
          show(T.gl, glOn * lerp(has(p, "show", "a") ? 1 : 0, has(s, "show", "a") ? 1 : 0, u));
          const cu = mixN(p, s, "cursor", u);
          T.cursor.setAttribute("x1", f1(cxp)); T.cursor.setAttribute("x2", f1(cxp)); show(T.cursor, .55 * cu);
          T.link.setAttribute("x1", TCX); T.link.setAttribute("y1", f1(py)); T.link.setAttribute("x2", f1(cxp)); T.link.setAttribute("y2", f1(py)); show(T.link, .55 * cu);
          if (cur === "traces") { const f = s.focus; if (f === "lump") F = [px, py, 16]; else if (f === "shadow") F = [TCX, py, 16]; else if (f === "centre") F = [TCX, YS.x, 16]; }
        }

        if (vis("carrier")) {
          const Am = lerp(inM(p), inM(s), u), wm = lerp(num(p.omega, Math.PI), num(s.omega, Math.PI), u);
          const sc = Math.min(1200, 96 / Math.max(Am, 1e-6));       // px per metre: 12 px/cm, radius capped at 96
          const rA = Am * sc, px = KCX + rA * cs, py = KY0 - rA * sn;
          K.circ.setAttribute("r", f1(rA)); K.axis.setAttribute("y1", f1(KY0 - rA - 8)); K.axis.setAttribute("y2", f1(KY0 + rA + 8));
          K.rad.setAttribute("x2", f1(px)); K.rad.setAttribute("y2", f1(py)); K.P.setAttribute("cx", f1(px)); K.P.setAttribute("cy", f1(py));
          const C = crateAt(th, Am, wm, g), plY = KY0 - C.yc * sc, crY = KY0 - C.y * sc;
          K.link.setAttribute("x1", f1(px)); K.link.setAttribute("y1", f1(py)); K.link.setAttribute("x2", PL0); K.link.setAttribute("y2", f1(plY));
          K.plate.setAttribute("transform", `translate(0 ${f1(plY)})`);
          K.crate.setAttribute("transform", `translate(0 ${f1(crY)})`);
          // coil spring from the plate (+17) down to the base: 8 coils, pitch stretches evenly
          const top = plY + 17, n = 8, hw = 22; let dB = "", dF = "";
          for (let i = 0; i < n; i++) { const y0 = top + (BASE - top) * i / n, y1 = top + (BASE - top) * (i + .5) / n, y2 = top + (BASE - top) * (i + 1) / n;
            dB += `M${PCX - hw} ${f1(y0)} L${PCX + hw} ${f1(y1)} `; dF += `M${PCX + hw} ${f1(y1)} L${PCX - hw} ${f1(y2)} `; }
          K.springB.setAttribute("d", dB); K.springF.setAttribute("d", dF);
          // arrows: 32 units ≡ g. Weight mg constant; push R = m(g − ω²y) while in contact, 0 in flight (never down)
          const fo = mixN(p, s, "forces", u), U = 32, aCar = -wm * wm * C.yc;      // carrier acceleration (up +)
          const Rn = C.on ? Math.max(0, g + aCar) / g : 0, cMid = crY - CRH / 2;
          show(K.forces, fo);
          K.Rr.set(PCX - CRW / 2 - 12, plY - 1, PCX - CRW / 2 - 12, plY - 1 - U * Rn, 1);
          K.lR.setAttribute("x", PCX - CRW / 2 - 20); K.lR.setAttribute("y", f1(plY - 8 - U * Rn)); K.lR.setAttribute("opacity", Rn > .12 ? 1 : 0);
          K.Wt.set(PCX + CRW / 2 + 12, cMid, PCX + CRW / 2 + 12, cMid + U, 1);
          K.lW.setAttribute("x", PCX + CRW / 2 + 20); K.lW.setAttribute("y", f1(cMid + U - 4));
          const aLen = U * aCar / g;
          K.Ac.set(PL1 + 30, plY + 4, PL1 + 30, plY + 4 - aLen, 1);
          K.lA.setAttribute("x", PL1 + 40); K.lA.setAttribute("y", f1(plY + 4 - aLen)); K.lA.setAttribute("opacity", Math.abs(aLen) > 8 ? 1 : 0);
          K.Gr.set(396, 80, 396, 80 + U, 1);
          show(K.labs, labels);
          K.lCrate.setAttribute("y", f1(crY - CRH - 18)); K.lCar.setAttribute("y", f1(plY + 18));
          const vd = mixN(p, s, "verdict", u), amax = num(s.omega, Math.PI) ** 2 * inM(s), lifts = amax >= g;
          show(K.ver, vd);
          setTx(K.verT, lifts ? "lifts off" : "stays on", 1); K.verT.setAttribute("fill", lifts ? BAD : GOOD);
          setTx(K.verV, `ω²A = ${sf3(amax, 1)} ${lifts ? "≥" : "<"} ${+g.toPrecision(3)}`, 1);
          if (cur === "carrier") { const f = s.focus; if (f === "crate") F = [PCX, crY - CRH / 2, 50]; else if (f === "carrier") F = [PCX, plY + 4, 74]; else if (f === "lump") F = [px, py, 16]; else if (f === "centre") F = [KCX, KY0, 16]; }
        }

        const fIn = p.focus === s.focus ? 1 : ease(seg(t, P.t0 || 0, (P.t0 || 0) + .6));
        ring.setAttribute("opacity", F ? ((.65 + .35 * Math.sin(t * 5)) * fIn).toFixed(2) : 0);
        if (F) { ring.setAttribute("cx", f1(F[0])); ring.setAttribute("cy", f1(F[1])); ring.setAttribute("r", f1(F[2])); ring.setAttribute("stroke-dashoffset", ((t * 20) % 13).toFixed(1)); }
      },
    };
  },
};
