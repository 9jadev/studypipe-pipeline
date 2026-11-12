/* =========================================================
   StudyPipe explainer-video kit · shm-oscillator
   Simple harmonic motion, forced vibration and resonance. Three scenes (state `scene`, cross-fades):
   - spring: one or two vertical loaded springs. skin 'lab' (spiral spring on a retort-stand clamp, hanger with slotted 50 g
             discs, pointer on a metre rule) or skin 'okada' (model: carrier + egg crates on a compression coil, "model" badge).
             Static stretch x0 = mg/k (Hooke, the pitch grows evenly along the whole helix), held displacement x about the
             LOADED equilibrium, x bracket, restoring-force and acceleration arrows ∝ x always towards equilibrium, static
             balance (mg vs spring pull), oscillation x = A cos(ωt + φ) with T = 2π√(m/k) computed per spring (same slow-motion
             factor for both, so the period ratio stays true and amplitude never changes T).
   - barton: Barton's pendulums. Heavy driver + paper cones on a taut cord; the driver swings at T = 2π√(l/g); every cone is
             driven at the driver's frequency with steady-state amplitude ∝ 1/√((1−r²)² + (2ζr)²), phase lag atan2(2ζr, 1−r²)
             (short cones in step, matched cone a quarter cycle behind, long cones nearly opposite), building up from rest.
   - ridge:  the okada rear on Ridge Road: the ridges (spacing d) are the driver, f = v/d. Base-excited damped oscillator
             (m, k, ζ leaking 0.05 / healthy 0.30, base push Y) integrated in time, so the bounce really pumps up at resonance;
             crate lift-off computed (the carrier can only push up: the crate leaves when the carrier's downward acceleration
             exceeds g, flies under gravity, lands), crack after the first landing, bounce strip chart with ridge-hit ticks,
             amplitude gauge with the lift-off line g/ω² (driving ω).
   Motion that must not jump (phases, build-ups, the bounce ODE, the crate flight) is precomputed once from the video's own
   timeline (DATA.cues, replayed exactly like the runtime's panel keyframes) on a 1/120 s grid, so every frame is still a pure
   function of (t, P): pausing freezes it, scrubbing reproduces it. Without DATA it falls back to closed-form steady states.
   Contract: .agents/skills/explainer-video/references/adding-a-kit.md
   ========================================================= */
(window.VIDEO_KITS = window.VIDEO_KITS || {})["shm-oscillator"] = {
  title: "SHM oscillator: loaded springs (lab and okada model), Barton's pendulums, okada on Ridge Road (resonance, lift-off)",
  states: {
    scene: "'spring' | 'barton' | 'ridge' (cross-fades)",
    skin: "spring: 'lab' (spiral spring, hanger, 50 g discs, pointer, metre rule) | 'okada' (carrier + crates on a compression coil, model badge)",
    n: "spring: 1 or 2 springs side by side",
    m: "load in kg (spring: lab 0–0.30 → disc count round(m/0.050); okada 150–300) · ridge: sprung load (200 / 250; 3 crates at 200, 5 at 250)",
    m2: "spring 2 load in kg (defaults to m)",
    k: "spring constant N/m (spring: lab default 24.5, okada 4π²·2.00²·200 ≈ 31 583; ridge the same)",
    k2: "spring 2 constant N/m (defaults to k)",
    g: "gravitational field strength (default 9.8)",
    scale: "lab skin length scale, drawing units per cm (default 9: 10 cm of extension fits)",
    ruler: "0/1 metre rule + pointer (lab skin, n 1)",
    reading: "pointer label string (≤ 10 chars), e.g. '2.0 cm'",
    eq: "0/1 dashed equilibrium line(s) through each loaded resting position",
    x: "spring 1 held displacement from equilibrium, metres (+ below, − above); animates",
    x2: "spring 2 held displacement, metres",
    xArrow: "0/1 blue displacement bracket (spring 1), equilibrium line → load",
    xLabel: "bracket label, e.g. '2.0 cm'",
    force: "0/1 red restoring-force arrow on load 1, length ∝ |x| (one fixed scale), always towards equilibrium; follows the live x",
    forceLabel: "force label, e.g. '0.49 N'",
    force2: "0/1 restoring-force arrow on load 2",
    forceLabel2: "force label for load 2",
    accel: "0/1 purple acceleration arrow on load 1 (∝ |x|, towards equilibrium, other side of the load)",
    accelLabel: "acceleration label, e.g. '2.45 m s⁻²'",
    balance: "0/1 static balance on load 1: weight mg down (red) and spring pull up (green), equal",
    osc: "0 held · 1 spring 1 oscillates about equilibrium at T = 2π√(m/k) (released from its held x)",
    osc2: "0 held · 1 spring 2 oscillates",
    A: "spring 1 amplitude, metres",
    A2: "spring 2 amplitude, metres",
    slow: "slow-motion factor ≥ 1 (default 1), common to everything moving; 'slow motion' tag when > 1",
    tag: "label above spring 1 (≤ 18 chars), '' hides",
    tag2: "label above spring 2",
    periodLabel: "gold stopwatch pill under load 1, e.g. 'T = 0.568 s' ('' hides)",
    periodLabel2: "pill under load 2",
    driverL: "barton: driver length, m (default 0.60; animates)",
    cones: "barton: array of cone lengths, m (default [0.30, 0.45, 0.60, 0.75, 0.90])",
    swing: "barton: 0 still · 1 swinging (driver released, cones build up from rest)",
    match: "barton: 0/1 glow on the cone whose length equals driverL (±0.005 m)",
    v: "ridge: speed km/h (5–35; default 18)",
    d: "ridge: ridge spacing m (default 2.5)",
    Y: "ridge: base push (wheel lift amplitude) cm (default 1.0)",
    damper: "ridge: 'leaking' (ζ 0.05, oil streaks, low oil) | 'healthy' (ζ 0.30, full oil, warm on each stroke)",
    build: "ridge: 0 steady state at once · 1 bounce integrated in time (grows from rest / from the previous ride)",
    trace: "ridge: 0/1 bounce strip chart (carrier displacement vs time) with a tick at every ridge hit",
    gauge: "ridge: 0/1 amplitude gauge (0–12 cm) with the red dashed lift-off line g/ω²",
    gaugeLabel: "ridge: gauge label string, e.g. '10.0 cm'",
    readout: "barton / ridge: 0/1 readout pills",
    readoutV: "ridge pill, e.g. 'v = 18 km/h'",
    readoutF: "pill, e.g. 'f = 2.0 Hz'",
    readoutT: "pill, e.g. 'T = 1.55 s'",
    labels: "barton / ridge: 0/1 part labels (cord, driver, cone lengths · ridges, d = 2.5 m, shock absorber, carrier)",
    focus: "dashed pulsing ring: spring 'pointer' 'mass' 'mass2' 'eq' 'spring' · barton 'driver' 'matched' · ridge 'crate' 'damper' 'ridges' 'trace' 'gauge' 'readout' · null",
  },
  // Close-ups. spring and barton 'matched' regions are re-aimed every frame from the state (column layout, load, matched cone).
  focus: {
    pointer: [215, 120, 170, 110], mass: [55, 120, 200, 210], mass2: [210, 120, 200, 210], spring: [95, 40, 120, 190],
    both: [0, 8, 420, 412], eq: [0, 150, 420, 120],
    driver: [0, 34, 124, 250], cones: [84, 30, 336, 390], matched: [180, 40, 140, 270], cord: [0, 10, 420, 80],
    crate: [64, 20, 190, 190], damper: [40, 160, 170, 180], ridges: [150, 280, 230, 76], trace: [0, 340, 420, 80],
    gauge: [330, 56, 90, 280], readout: [236, 0, 184, 64], rear: [44, 40, 250, 316],
  },
  create(svg, api) {
    const { el, tx, lerp, ease, seg, clamp, PAL, COLOR, meta } = api;
    const ID = "shm-oscillator", KIT = window.VIDEO_KITS[ID], FOC = KIT.focus;
    const role = (n, fb) => (meta && meta.roles && meta.roles[n] ? COLOR(n) : fb);
    const CX = role("x", PAL.blue), CF = role("F", PAL.red), CA = role("a", PAL.purple), CK = role("k", PAL.green), CT = role("T", PAL.gold);
    const Cf = role("f", PAL.blue), Cv = role("v", PAL.orange), Cd = role("d", PAL.green), CAm = role("A", PAL.purple), Cg = role("g", PAL.red);
    const TXT = "#e8efe9", DIM = "#9fb3a8", STEEL = "#aeb9c6", STEEL_D = "#5f6b79", BRASS = "#c99a45", BRASS_D = "#7d5a1f", GLOW = "#ffe08a";
    const TAU = Math.PI * 2, DEG = 180 / Math.PI, f1 = v => (+v).toFixed(1), f2 = v => (+v).toFixed(2);
    const num = (v, d) => (v == null || v === "" || isNaN(+v) ? d : +v);

    // ---------------- per-state readers (shared by the precompute and the draw, so they always agree) ----------------
    const sceneOf = st => st.scene || "spring";
    const skinOf = st => st.skin === "okada" ? "okada" : "lab";
    const K_OKADA = 4 * Math.PI * Math.PI * 2.00 * 2.00 * 200;   // ≈ 31 583 N/m: f₀ = 2.00 Hz exactly with 200 kg
    const kDef = st => (sceneOf(st) === "spring" && skinOf(st) === "lab" ? 24.5 : K_OKADA);
    const mOf = (st, i) => (i === 2 && st.m2 != null ? +st.m2 : num(st.m, sceneOf(st) === "ridge" ? 200 : skinOf(st) === "okada" ? 200 : 0));
    const kOf = (st, i) => (i === 2 && st.k2 != null ? +st.k2 : num(st.k, kDef(st)));
    const gOf = st => num(st.g, 9.8);
    const slowOf = st => Math.max(1, num(st.slow, 1));
    const zetaOf = st => (st.damper === "healthy" ? 0.30 : 0.05);
    const LdOf = st => num(st.driverL, 0.60);
    const CONES = [0.30, 0.45, 0.60, 0.75, 0.90], MAXC = 8;
    const conesOf = st => (Array.isArray(st.cones) && st.cones.length ? st.cones.slice(0, MAXC).map(Number) : CONES);
    const sfx = i => (i === 2 ? "2" : "");
    const Tspring = (m, k) => TAU * Math.sqrt(Math.max(m, 1e-6) / Math.max(k, 1e-6));
    // Barton: driven-oscillator response of a cone (relative to the driver), light damping ζ_B
    const ZB = 0.06, THD = 10 / DEG, THM = 14 / DEG;
    const RB = r => 1 / Math.sqrt((1 - r * r) ** 2 + (2 * ZB * r) ** 2), RB1 = RB(1);
    const coneTarget = (l, Ld) => { const r = Math.sqrt(Math.max(l, 1e-3) / Math.max(Ld, 1e-3)), a = THM * Math.min(1.05, RB(r) / RB1), dl = Math.atan2(2 * ZB * r, 1 - r * r); return [a * Math.cos(dl), -a * Math.sin(dl)]; };
    // Ridge: steady-state carrier response to the base push Y cos φ (complex transmissibility H)
    function ridgeParams(st) {
      const v = num(st.v, 18), m = mOf(st, 1), k = kOf(st, 1), d = num(st.d, 2.5), Y = num(st.Y, 1.0) / 100, z = zetaOf(st), g = gOf(st);
      return { v, m, k, d, Y, z, g };
    }
    // ridge parameters blended between the previous and current state (the sprung mass never below 1 kg, spacing never 0)
    const ridgeBlend = bl => ({ v: bl(st => ridgeParams(st).v), m: Math.max(1, bl(st => ridgeParams(st).m)), k: Math.max(1, bl(st => ridgeParams(st).k)), d: Math.max(.1, bl(st => ridgeParams(st).d)), Y: bl(st => ridgeParams(st).Y), z: bl(zetaOf), g: bl(gOf) });
    function steady(R, phi) {   // R: blended params; returns y, yd, ydd (metres, up +) at phase phi
      const w = TAU * R.v / 3.6 / R.d, r = w / Math.sqrt(R.k / R.m), q = 2 * R.z * r, dr = 1 - r * r, den = dr * dr + q * q;
      const Hr = (dr + q * q) / den, Hi = (q * dr - q) / den, c = Math.cos(phi), s = Math.sin(phi);
      const y = R.Y * (Hr * c - Hi * s);
      return { y, yd: -w * R.Y * (Hr * s + Hi * c), ydd: -w * w * y, w };
    }

    // ---------------- timeline precompute (replays DATA exactly like the runtime's panelAt) ----------------
    const DT = 1 / 120;
    const SIM = (() => {
      let D; try { D = typeof DATA !== "undefined" ? DATA : null; } catch (e) { D = null; }
      if (!D || !Array.isArray(D.cues)) return null;
      const PK = [], last = {};
      for (const c of D.cues) for (const o of (c.ops || [])) {
        if (!("panel" in o)) continue;
        const at = c.start + (o.at != null ? o.at : .35);
        if (o.panel) { const s = Object.assign({}, o.fresh ? {} : (last[o.panel] || {}), o.s || {}); last[o.panel] = s; PK.push({ t: at, panel: o.panel, s }); }
        else PK.push({ t: at, panel: null });
      }
      const own = PK.filter(k => k.panel === ID); if (!own.length) return null;
      const t0 = Math.max(0, Math.min(...own.map(k => k.t)) - DT), t1 = Math.max(t0 + 1, (D.dur || 0) + 2);
      const N = Math.ceil((t1 - t0) / DT) + 2, F = () => new Float64Array(N);
      const A = { ph1: F(), ph2: F(), phd: F(), ad: F(), rphi: F(), ry: F(), rrel: F(), rh: F(), rck: F() }, CR = [], CI = [];
      for (let j = 0; j < MAXC; j++) { CR.push(F()); CI.push(F()); }
      let ki = -1, lastOwn = null, ph1 = 0, ph2 = 0, phd = 0, ad = 0, tOn = -1e9;
      const cz = new Float64Array(MAXC * 2);
      let rphi = 0, y = 0, yd = 0, h = 0, hv = 0, seated = true, rideKey = "", crackT = -1;
      for (let n = 0; n < N; n++) {
        const t = t0 + n * DT;
        let changed = false;
        while (ki + 1 < PK.length && PK[ki + 1].t <= t) { ki++; changed = true; }
        const cur = ki >= 0 ? PK[ki] : null, prev = ki > 0 ? PK[ki - 1] : null;
        let s, p, u;
        if (cur && cur.panel === ID) { s = cur.s; p = prev && prev.panel === ID ? prev.s : s; u = ease(seg(t, cur.t, cur.t + 1.4)); }
        else if (lastOwn) { s = p = lastOwn; u = 1; }
        else { s = p = {}; u = 1; }
        const bl = fn => lerp(fn(p), fn(s), u);
        const isNew = changed && cur && cur.panel === ID;
        const slow = bl(slowOf);
        // ---- spring phases (released from the held x when osc switches on) ----
        if (isNew) for (const i of [1, 2]) {
          const on = +s["osc" + sfx(i)] === 1 && sceneOf(s) === "spring";
          const was = lastOwn && +lastOwn["osc" + sfx(i)] === 1 && sceneOf(lastOwn) === "spring";
          if (on && !was) { const Am = num(s["A" + sfx(i)], 0), xh = num(s["x" + sfx(i)], 0), ph = Am > 0 ? -Math.acos(clamp(xh / Am, -1, 1)) : -Math.PI / 2; if (i === 1) ph1 = ph; else ph2 = ph; }
        }
        ph1 += TAU * DT / (Math.max(.05, Tspring(bl(st => mOf(st, 1)), bl(st => kOf(st, 1)))) * slow);
        ph2 += TAU * DT / (Math.max(.05, Tspring(bl(st => mOf(st, 2)), bl(st => kOf(st, 2)))) * slow);
        // ---- Barton: driver phase, driver amplitude, cone complex amplitudes (first-order build-up) ----
        const Ld = bl(LdOf), Td = TAU * Math.sqrt(Ld / bl(gOf));
        const on = +s.swing === 1 && sceneOf(s) === "barton";
        if (isNew && on && !(lastOwn && +lastOwn.swing === 1 && sceneOf(lastOwn) === "barton")) tOn = t;
        phd += TAU * DT / (Td * slow);
        ad += ((on ? THD : 0) - ad) * (1 - Math.exp(-DT / .5));
        const tauB = on ? (t - tOn < 9 * Td * slow ? 3 * Td * slow : .8) : 1.2, kB = 1 - Math.exp(-DT / tauB), Ls = conesOf(s);
        for (let j = 0; j < MAXC; j++) {
          const tg = on && j < Ls.length ? coneTarget(Ls[j], Ld) : [0, 0];
          cz[2 * j] += (tg[0] - cz[2 * j]) * kB; cz[2 * j + 1] += (tg[1] - cz[2 * j + 1]) * kB;
          CR[j][n] = cz[2 * j]; CI[j][n] = cz[2 * j + 1];
        }
        // ---- Ridge: road phase, carrier bounce (steady or integrated), crate contact / flight, crack ----
        const R = ridgeBlend(bl);
        const dtau = DT / slow, w = TAU * R.v / 3.6 / R.d;
        const key = [sceneOf(s), s.v, s.m, s.k, s.d, s.Y, s.damper || "leaking"].join("|");
        if (key !== rideKey) { rideKey = key; crackT = -1; }
        let ydd;
        if (+s.build === 1 && sceneOf(s) === "ridge" && sceneOf(p) === "ridge" && isFinite(y) && isFinite(yd)) {
          const c = 2 * R.z * Math.sqrt(R.k * R.m), SUB = 4, hh = dtau / SUB;
          for (let q = 0; q < SUB; q++) {
            const ph = rphi + w * hh * q, yb = R.Y * Math.cos(ph), ybd = -R.Y * w * Math.sin(ph);
            const a = (-R.k * (y - yb) - c * (yd - ybd)) / R.m;
            yd += a * hh; y += yd * hh;
          }
          rphi += w * dtau;
          const yb = R.Y * Math.cos(rphi), ybd = -R.Y * w * Math.sin(rphi);
          ydd = (-R.k * (y - yb) - c * (yd - ybd)) / R.m;
          if (!isFinite(y) || !isFinite(yd)) { y = yd = ydd = 0; }
        } else {
          rphi += w * dtau;
          const S = steady(R, rphi); y = S.y; yd = S.yd; ydd = S.ydd;
        }
        // crate: the carrier can only push up; contact is lost when the carrier accelerates downward faster than g
        if (seated) { h = y; hv = yd; if (ydd < -R.g && sceneOf(s) === "ridge") seated = false; }
        else {
          h += hv * dtau - .5 * R.g * dtau * dtau; hv -= R.g * dtau;   // exact free fall over the step
          if (h <= y) { h = y; hv = yd; seated = true; if (crackT < 0) crackT = t; }
        }
        A.ph1[n] = ph1; A.ph2[n] = ph2; A.phd[n] = phd; A.ad[n] = ad; A.rphi[n] = rphi; A.ry[n] = y; A.rh[n] = h;
        A.rrel[n] = yd + R.Y * w * Math.sin(rphi);
        A.rck[n] = crackT < 0 ? -1 : t - crackT;
        if (cur && cur.panel === ID) lastOwn = s;
      }
      const look = (arr, t) => { const x = clamp((t - t0) / DT, 0, N - 1), i = Math.floor(x), fr = x - i; return i + 1 < N ? arr[i] + (arr[i + 1] - arr[i]) * fr : arr[i]; };
      return { A, CR, CI, look, t0, N };
    })();
    const S_ = (k, t) => SIM.look(SIM.A[k], t);
    KIT.__sim = SIM;   // read-only handle for the kit's own physics tests

    // ---------------- drawing helpers ----------------
    const setTx = (e, str, op) => { str = str == null ? "" : String(str); if (e.textContent !== str) e.textContent = str; e.setAttribute("opacity", (str ? op : 0).toFixed(3)); };
    const show = (e, op) => { e.setAttribute("opacity", Math.max(0, op).toFixed(3)); e.style.display = op < .004 ? "none" : ""; };
    const tagOp = (P, key) => { const s = P.s, p = P.p; return s[key] ? (p[key] === s[key] ? 1 : ease(seg(P.u, .2, 1))) : 0; };
    const strFade = (P, key) => tagOp(P, key);
    const textW = (e, size) => { let w = 0; try { w = e.getComputedTextLength(); } catch (er) { w = 0; } return w > 0 ? w : (e.textContent.length * size * .6); };
    function pill(parent, color, size) {
      const g = el("g", {}, parent);
      const r = el("rect", { rx: 10, fill: "rgba(14,18,24,.86)", stroke: color, "stroke-width": 2 }, g);
      const t = tx("", 0, 0, size || 14, color, g, "middle", 800);
      return { g, set(str, x, y, anchor, op) {
        str = str == null ? "" : String(str); if (t.textContent !== str) t.textContent = str;
        if (!str || op < .004) { g.setAttribute("opacity", 0); g.style.display = "none"; return; }
        g.style.display = ""; g.setAttribute("opacity", op.toFixed(3));
        const w = textW(t, size || 14) + 18, h = (size || 14) * 1.25 + 8 * 1;
        const cx = anchor === "start" ? x + w / 2 : anchor === "end" ? x - w / 2 : x;
        t.setAttribute("x", f1(cx)); t.setAttribute("y", f1(y + 1));
        r.setAttribute("x", f1(cx - w / 2)); r.setAttribute("y", f1(y - h / 2)); r.setAttribute("width", f1(w)); r.setAttribute("height", f1(h));
      } };
    }
    function vArrow(parent, color, sw) {   // vertical arrow from (x, y0) to (x, y1), head at y1
      const g = el("g", {}, parent);
      const ln = el("line", { stroke: color, "stroke-width": sw || 5, "stroke-linecap": "round" }, g);
      const hd = el("path", { fill: color }, g);
      return { g, set(x, y0, y1, op) {
        const L = Math.abs(y1 - y0);
        if (L < 2.5 || op < .004) { g.style.display = "none"; return; }
        g.style.display = ""; g.setAttribute("opacity", op.toFixed(3));
        const dir = Math.sign(y1 - y0), hl = Math.min(13, L * .55), hw = 8;
        ln.setAttribute("x1", f1(x)); ln.setAttribute("x2", f1(x)); ln.setAttribute("y1", f1(y0)); ln.setAttribute("y2", f1(y1 - dir * hl * .8));
        hd.setAttribute("d", `M${f1(x)} ${f1(y1)} L${f1(x - hw)} ${f1(y1 - dir * hl)} L${f1(x + hw)} ${f1(y1 - dir * hl)} Z`);
      } };
    }
    function helix(parent, sw, front, back) {   // side view of a coil: front strokes bright, back strokes darker, equal pitch
      const b = el("path", { fill: "none", stroke: back, "stroke-width": sw * .75, "stroke-linecap": "round", "stroke-linejoin": "round" }, parent);
      const f = el("path", { fill: "none", stroke: front, "stroke-width": sw, "stroke-linecap": "round", "stroke-linejoin": "round" }, parent);
      return { set(cx, y0, y1, r, n, leadTop, leadBot) {
        const p = (y1 - y0) / n; let df = "", db = "";
        for (let i = 0; i < n; i++) {
          const a = y0 + i * p;
          for (let k = 0; k <= 6; k++) { const th = Math.PI * k / 6, X = cx - r * Math.cos(th), Y = a + p * k / 12; df += (k ? "L" : "M") + f1(X) + " " + f1(Y); }
          for (let k = 0; k <= 6; k++) { const th = Math.PI * k / 6, X = cx + r * Math.cos(th), Y = a + p / 2 + p * k / 12; db += (k ? "L" : "M") + f1(X) + " " + f1(Y); }
        }
        if (leadTop) df += `M${f1(cx)} ${f1(y0 - leadTop)} L${f1(cx - r)} ${f1(y0)}`;
        if (leadBot) df += `M${f1(cx - r)} ${f1(y1)} L${f1(cx)} ${f1(y1 + leadBot)}`;
        f.setAttribute("d", df); b.setAttribute("d", db);
      } };
    }
    function crateArt(parent, w, h) {   // plastic egg crate, side view, eggs showing through the slots
      const g = el("g", {}, parent);
      el("rect", { x: -w / 2, y: -h, width: w, height: h, rx: 3, fill: "#d98f2b", stroke: "#8a5310", "stroke-width": 1.6 }, g);
      el("rect", { x: -w / 2 + 3, y: -h + 3, width: w - 6, height: h * .62, rx: 2, fill: "#5a3510" }, g);
      const ne = Math.max(3, Math.round(w / 21));
      for (let i = 0; i < ne; i++) el("ellipse", { cx: -w / 2 + (i + .5) * w / ne, cy: -h + 3 + h * .34, rx: w / ne * .36, ry: h * .27, fill: "#f3e3c4" }, g);
      el("line", { x1: -w / 2, y1: -h * .3, x2: w / 2, y2: -h * .3, stroke: "#8a5310", "stroke-width": 1.2 }, g);
      return g;
    }
    const ringEl = () => el("rect", { fill: "none", stroke: GLOW, "stroke-width": 3, "stroke-dasharray": "7 6", opacity: 0 }, svg);

    const scenes = { spring: el("g", {}, svg), barton: el("g", {}, svg), ridge: el("g", {}, svg) };
    const slowPill = pill(svg, GLOW, 13);

    // =====================================================================
    // scene: spring
    // =====================================================================
    const SG = scenes.spring;
    const stand = el("g", {}, SG);
    el("rect", { x: 10, y: 44, width: 400, height: 7, rx: 3, fill: STEEL_D, stroke: STEEL, "stroke-width": 1 }, stand);
    el("rect", { x: 8, y: 40, width: 9, height: 368, rx: 3, fill: STEEL_D, stroke: STEEL, "stroke-width": 1 }, stand);
    el("rect", { x: 2, y: 404, width: 84, height: 10, rx: 3, fill: "#3a4250", stroke: STEEL_D, "stroke-width": 1.5 }, stand);
    const ground = el("g", {}, SG);   // okada skin: ground strip
    el("rect", { x: 0, y: 392, width: 420, height: 7, fill: "#8a4a22" }, ground);
    const badge = el("g", {}, SG);
    el("rect", { x: 4, y: 4, width: 52, height: 20, rx: 8, fill: "rgba(255,224,138,.14)", stroke: GLOW, "stroke-width": 1.4 }, badge);
    tx("model", 30, 14.5, 12, GLOW, badge, "middle", 800);
    // metre rule (spring 1, n = 1)
    const rule = el("g", {}, SG), ruleTicks = el("g", {}, rule); let ruleKey = "";
    const ruleBody = el("rect", { width: 36, rx: 3, fill: "#efe6cf", stroke: "#a8946a", "stroke-width": 1.5 }, rule);
    rule.insertBefore(ruleBody, ruleTicks);
    function buildRule(rx, y0, S) {
      const key = rx + "|" + y0 + "|" + S; if (key === ruleKey) return; ruleKey = key; ruleTicks.innerHTML = "";
      ruleBody.setAttribute("x", rx); ruleBody.setAttribute("y", f1(y0 - 1.5 * S)); ruleBody.setAttribute("height", f1(17.5 * S));
      for (let c = -1; c <= 16; c++) {
        const yy = y0 + c * S, major = c % 2 === 0;
        el("line", { x1: rx, x2: rx + (major ? 13 : 7), y1: f1(yy), y2: f1(yy), stroke: "#2b2b2b", "stroke-width": major ? 1.6 : 1 }, ruleTicks);
        if (major && c >= 0) tx(String(c), rx + 25, yy, 12, "#2b2b2b", ruleTicks, "middle", 700);
      }
      tx("cm", rx + 18, y0 - 26, 12, DIM, ruleTicks, "middle", 700);
    }
    const reading = tx("", 0, 0, 15, TXT, SG, "start", 800);
    function makeCol(i) {
      const g = el("g", {}, SG), C = { g, i };
      C.eqLine = el("line", { stroke: "#d8e2dc", "stroke-width": 1.8, "stroke-dasharray": "7 6", opacity: 0 }, g);
      C.eqLab = pill(g, "#d8e2dc", 12);
      // lab parts
      C.lab = el("g", {}, g);
      C.clamp = el("rect", { width: 22, height: 14, rx: 3, fill: "#3a4250", stroke: STEEL, "stroke-width": 1.4 }, C.lab);
      C.helix = helix(C.lab, 3.2, "#d7dee6", "#6d7886");
      C.hook = el("path", { fill: "none", stroke: STEEL, "stroke-width": 2.6, "stroke-linecap": "round" }, C.lab);
      C.rod = el("line", { stroke: STEEL, "stroke-width": 3 }, C.lab);
      C.discs = [];
      for (let j = 0; j < 6; j++) {
        const dg = el("g", {}, C.lab);
        el("rect", { x: -23, y: 0, width: 46, height: 6.4, rx: 2.4, fill: BRASS, stroke: BRASS_D, "stroke-width": 1.1 }, dg);
        el("rect", { x: -23, y: 0, width: 46, height: 1.8, rx: 1, fill: "#ecc77d" }, dg);
        el("rect", { x: j % 2 ? -3 : 1, y: 0, width: 11, height: 6.4, fill: "#2a1d08", opacity: .85 }, dg);   // the slot (staggered)
        C.discs.push(dg);
      }
      C.base = el("rect", { x: -25, width: 50, height: 5, rx: 2, fill: STEEL_D, stroke: STEEL, "stroke-width": 1.2 }, C.lab);
      C.pointer = el("g", {}, C.lab);
      C.pLine = el("line", { stroke: "#f3f6f4", "stroke-width": 2.4 }, C.pointer);
      C.pHead = el("path", { fill: "#f3f6f4" }, C.pointer);
      // okada parts
      C.ok = el("g", {}, g);
      C.block = el("g", {}, C.ok);
      el("rect", { x: -72, y: 360, width: 144, height: 32, rx: 6, fill: "#3a4250", stroke: STEEL_D, "stroke-width": 2 }, C.block);
      el("circle", { cx: 0, cy: 376, r: 9, fill: "#20252d", stroke: STEEL, "stroke-width": 2 }, C.block);
      C.coil = helix(C.ok, 6, "#c3ccd6", "#5f6b79");
      C.plate = el("rect", { x: -74, width: 148, height: 10, rx: 3, fill: "#59616e", stroke: STEEL, "stroke-width": 1.6 }, C.ok);
      C.crates = []; for (let j = 0; j < 6; j++) C.crates.push(crateArt(C.ok, 128, 22));
      // overlays
      C.bracket = el("path", { fill: "none", stroke: CX, "stroke-width": 3, "stroke-linejoin": "round" }, g);
      C.xLab = tx("", 0, 0, 14, CX, g, "end", 800);
      C.fArr = vArrow(g, CF); C.fLab = tx("", 0, 0, 14, CF, g, "start", 800);
      C.aArr = vArrow(g, CA); C.aLab = tx("", 0, 0, 14, CA, g, "end", 800);
      C.bUp = vArrow(g, CK); C.bDn = vArrow(g, CF);
      C.bUpLab = tx("spring pull", 0, 0, 14, CK, g, "end", 800); C.bDnLab = tx("mg", 0, 0, 14, CF, g, "start", 800);
      C.tag = tx("", 0, 30, 15, TXT, g, "middle", 800);
      C.pill = pill(g, CT, 14);
      return C;
    }
    const COLS = [makeCol(1), makeCol(2)];
    const springRing = ringEl(); SG.appendChild(springRing);

    // =====================================================================
    // scene: barton
    // =====================================================================
    const BG = scenes.barton, CORD_Y = 52, LSC = 320;   // drawing units per metre of pendulum length
    el("rect", { x: 6, y: 40, width: 10, height: 34, rx: 3, fill: "#3a4250", stroke: STEEL, "stroke-width": 1.4 }, BG);
    el("rect", { x: 404, y: 40, width: 10, height: 34, rx: 3, fill: "#3a4250", stroke: STEEL, "stroke-width": 1.4 }, BG);
    el("line", { x1: 14, y1: CORD_Y, x2: 406, y2: CORD_Y, stroke: "#e6dcc3", "stroke-width": 2.6 }, BG);
    const DRV_X = 42, coneX = (j, n) => n <= 1 ? 248 : 112 + j * (384 - 112) / (n - 1);
    const drv = el("g", {}, BG);
    const drvCord = el("line", { x1: DRV_X, y1: CORD_Y, x2: DRV_X, y2: 200, stroke: "#c9c1ad", "stroke-width": 2 }, drv);
    const drvBob = el("g", {}, drv);
    el("circle", { cx: 0, cy: 0, r: 16, fill: "#3b4250", stroke: "#9aa6b2", "stroke-width": 2 }, drvBob);
    el("circle", { cx: -5, cy: -5, r: 5, fill: "#c3ccd6", opacity: .55 }, drvBob);
    el("circle", { cx: DRV_X, cy: CORD_Y, r: 3.2, fill: "#e6dcc3" }, BG);
    const coneG = [];
    for (let j = 0; j < MAXC; j++) {
      const g = el("g", {}, BG), glow = el("circle", { r: 24, fill: GLOW, opacity: 0 }, g);
      const thread = el("line", { stroke: "#c9c1ad", "stroke-width": 1.6 }, g);
      const body = el("path", { d: "M0 -16 L12 10 Q0 15 -12 10 Z", fill: "#efe6cf", stroke: "#a8946a", "stroke-width": 1.4 }, g);
      el("ellipse", { cx: 0, cy: 10, rx: 12, ry: 3.4, fill: "#d8cba8", stroke: "#a8946a", "stroke-width": 1 }, g);
      const knot = el("circle", { r: 2.6, fill: "#e6dcc3" }, BG);
      const lab = tx("", 0, 394, 13, TXT, BG, "middle", 700);
      coneG.push({ g, glow, thread, body, knot, lab, bodyParts: g.children });
    }
    const drvLab = tx("", DRV_X, 394, 13, "#c3ccd6", BG, "middle", 800);
    const bLabs = el("g", {}, BG);
    tx("cord", 150, 38, 13, "#e6dcc3", bLabs, "middle", 700);
    const drvName = tx("driver", DRV_X, 372, 13, "#c3ccd6", bLabs, "middle", 800);
    const bPill = pill(BG, Cf, 14);
    const bartonRing = ringEl(); BG.appendChild(bartonRing);

    // =====================================================================
    // scene: ridge
    // =====================================================================
    const RG = scenes.ridge, WX = 150, YR = 342, RW = 26, AS = 400, SX = 50;   // AS: units per metre of bounce (4 per cm) · SX: road units per metre
    const AY0 = YR - RW, LS = 130, CB0 = AY0 - LS, BODY = 88, ROD = LS - BODY / 2;
    const road = el("path", { fill: "#a4582a", stroke: "#d08a52", "stroke-width": 2 }, RG);
    el("rect", { x: 0, y: 352, width: 420, height: 2, fill: "#6e3a1a" }, RG);
    const capsG = el("g", {}, RG), caps = [];
    for (let j = 0; j < 6; j++) caps.push(el("path", { fill: "#b9bcc0", stroke: "#7d8288", "stroke-width": 1.2 }, capsG));
    // swingarm + wheel (move with the axle)
    const arm = el("path", { fill: "none", stroke: "#2c323b", "stroke-width": 7, "stroke-linecap": "round" }, RG);
    const wheel = el("g", {}, RG);
    el("circle", { cx: 0, cy: 0, r: RW - 3, fill: "none", stroke: "#1a1d22", "stroke-width": 7 }, wheel);
    el("circle", { cx: 0, cy: 0, r: RW - 9, fill: "none", stroke: "#aeb9c6", "stroke-width": 2 }, wheel);
    const spokes = el("g", {}, wheel);
    for (let j = 0; j < 8; j++) el("line", { x1: 0, y1: 0, x2: f1((RW - 9) * Math.cos(j * Math.PI / 4)), y2: f1((RW - 9) * Math.sin(j * Math.PI / 4)), stroke: "#8a96a3", "stroke-width": 1.2 }, spokes);
    el("circle", { cx: 0, cy: 0, r: 5, fill: "#59616e", stroke: "#c3ccd6", "stroke-width": 1.4 }, wheel);
    // shock absorber: damper body on the axle (with a cut-away window), shroud + rod on the carrier, coil outside
    const shock = el("g", {}, RG);
    const body = el("rect", { width: 30, height: BODY, rx: 6, fill: "#7d8896", stroke: "#c3ccd6", "stroke-width": 1.6 }, shock);
    const streaks = el("g", {}, shock);
    for (let j = 0; j < 4; j++) el("path", { d: `M${j < 2 ? -13 + j * 3 : 9 + (j - 2) * 3} 0 q${j % 2 ? 2 : -2} 14 0 ${20 + j * 8}`, fill: "none", stroke: "#1a1206", "stroke-width": 2.6, "stroke-linecap": "round", opacity: .9 }, streaks);
    const win = el("rect", { width: 16, height: BODY - 16, rx: 2, fill: "#e9f1f6", stroke: "#0e1116", "stroke-width": 1.4 }, shock);
    const oil = el("rect", { width: 16, fill: "#c98a1e", opacity: .95 }, shock);
    const heat = el("rect", { width: 38, height: BODY, rx: 10, fill: "#ff7a3a", opacity: 0 }, shock);
    const rodL = el("line", { stroke: "#d7dee6", "stroke-width": 4 }, shock);
    const piston = el("rect", { width: 16, height: 5, fill: "#5f6b79", stroke: "#0e1116", "stroke-width": .8 }, shock);
    const shroud = el("rect", { width: 36, height: 34, rx: 4, fill: "#3a4250", stroke: "#8a96a3", "stroke-width": 1.4 }, shock);
    const coilR = helix(shock, 2.2, "rgba(224,164,58,.55)", "rgba(122,84,20,.45)");
    // carrier, frame stub, crates
    const carrier = el("g", {}, RG);
    el("path", { d: "M236 -14 L300 -24 L314 -6 L240 6 Z", fill: "#2c323b", stroke: "#59616e", "stroke-width": 1.6 }, carrier);   // seat / frame stub
    el("path", { d: "M244 -24 L292 -32 L302 -24 L250 -16 Z", fill: "#14171c" }, carrier);
    el("rect", { x: 78, y: -10, width: 164, height: 10, rx: 3, fill: "#59616e", stroke: STEEL, "stroke-width": 1.6 }, carrier);
    const crateG = el("g", {}, RG), crateList = [];
    for (let j = 0; j < 6; j++) { const c = crateArt(crateG, 132, 16); crateList.push(c); }
    const crack = el("g", { opacity: 0 }, crateG);
    el("path", { d: "M-6 -14 l5 6 l-4 4 l6 5", fill: "none", stroke: "#2a1d08", "stroke-width": 1.6 }, crack);
    el("path", { d: "M2 -6 q8 -4 12 2 q5 4 -1 9 q-3 6 -8 1 q-7 -1 -3 -12 Z", fill: "#ffc21a", stroke: "#e58f00", "stroke-width": 1 }, crack);
    el("path", { d: "M8 4 q1 6 -1 10", fill: "none", stroke: "#ffc21a", "stroke-width": 2.4, "stroke-linecap": "round" }, crack);
    const rBadge = el("g", {}, RG);
    el("rect", { x: 4, y: 4, width: 52, height: 20, rx: 8, fill: "rgba(255,224,138,.14)", stroke: GLOW, "stroke-width": 1.4 }, rBadge);
    tx("model", 30, 14.5, 12, GLOW, rBadge, "middle", 800);
    // labels
    const rLabs = el("g", {}, RG);
    const lShock = tx("shock absorber", WX - 32, 0, 13, "#e0a43a", rLabs, "end", 800);
    const lCarrier = tx("carrier", 74, 0, 13, TXT, rLabs, "end", 800);
    tx("ridges", 12, 318, 13, "#c3c7cc", rLabs, "start", 800);
    const dBar = el("g", {}, rLabs);
    el("path", { d: `M220 316 v8 M220 320 H${220 + 2.5 * SX} M${220 + 2.5 * SX} 316 v8`, fill: "none", stroke: Cd, "stroke-width": 2.2 }, dBar);
    const dLab = tx("d = 2.5 m", 220 + 1.25 * SX, 300, 13, Cd, dBar, "middle", 800);
    // trace strip
    const TR = { x0: 14, x1: 406, y: 392, top: 358, bot: 418, sc: 220 };   // sc: units per metre of bounce
    const trG = el("g", {}, RG);
    el("rect", { x: 6, y: TR.top - 2, width: 408, height: TR.bot - TR.top + 2, rx: 8, fill: "rgba(14,18,24,.7)", stroke: "#3c4552", "stroke-width": 1.4 }, trG);
    el("line", { x1: TR.x0, x2: TR.x1, y1: TR.y, y2: TR.y, stroke: "#4a5563", "stroke-width": 1, "stroke-dasharray": "4 4" }, trG);
    const trLine = el("path", { fill: "none", stroke: CAm, "stroke-width": 2.2, "stroke-linejoin": "round" }, trG);
    const trTicks = el("path", { fill: "none", stroke: Cd, "stroke-width": 2.4 }, trG);
    tx("bounce", 14, TR.top + 6, 12, CAm, trG, "start", 800);
    tx("| ridge hit", 404, TR.top + 6, 12, Cd, trG, "end", 800);
    // gauge
    const GA = { x: 384, w: 20, y0: 296, y1: 86, max: 12 };   // cm, bottom → top
    const gaG = el("g", {}, RG);
    el("rect", { x: GA.x, y: GA.y1, width: GA.w, height: GA.y0 - GA.y1, rx: 4, fill: "rgba(14,18,24,.8)", stroke: "#5c6675", "stroke-width": 1.5 }, gaG);
    for (let c = 0; c <= GA.max; c += 2) { const yy = GA.y0 - (GA.y0 - GA.y1) * c / GA.max; el("line", { x1: GA.x - 5, x2: GA.x, y1: f1(yy), y2: f1(yy), stroke: DIM, "stroke-width": 1.2 }, gaG); }
    const gaBar = el("rect", { x: GA.x + 3, width: GA.w - 6, rx: 2, fill: CAm }, gaG);
    const gaLine = el("line", { x1: GA.x - 8, x2: GA.x + GA.w + 4, stroke: Cg, "stroke-width": 2.6, "stroke-dasharray": "5 4" }, gaG);
    const gaUp = el("path", { fill: Cg }, gaG);
    const gaLift = tx("lift-off", GA.x - 10, 0, 12, Cg, gaG, "end", 800);
    tx("A", GA.x + GA.w / 2, GA.y1 - 12, 14, CAm, gaG, "middle", 800);
    const gaLab = tx("", 414, GA.y0 + 14, 13, CAm, gaG, "end", 800);
    const rPillV = pill(RG, Cv, 14), rPillF = pill(RG, Cf, 14);
    const ridgeRing = ringEl(); RG.appendChild(ridgeRing);

    // ---------------- shared ring ----------------
    function ring(R, spot, t) {
      if (!spot) { R.setAttribute("opacity", 0); return; }
      R.setAttribute("opacity", (.65 + .35 * Math.sin(t * 5)).toFixed(2));
      R.setAttribute("x", f1(spot[0])); R.setAttribute("y", f1(spot[1])); R.setAttribute("width", f1(spot[2])); R.setAttribute("height", f1(spot[3]));
      R.setAttribute("rx", f1(Math.min(spot[2], spot[3]) * .25)); R.setAttribute("stroke-dashoffset", ((t * 20) % 13).toFixed(1));
    }
    const setFoc = (name, r) => { const a = FOC[name]; for (let i = 0; i < 4; i++) a[i] = r[i]; };

    // ---------------- fallbacks without a timeline ----------------
    const fbPhase = (i, t, P) => { const s = P.s, Am = num(s["A" + sfx(i)], 0), xh = num(s["x" + sfx(i)], 0), T = Math.max(.05, Tspring(mOf(s, i), kOf(s, i))) * slowOf(s); return (Am > 0 ? -Math.acos(clamp(xh / Am, -1, 1)) : 0) + TAU * (t - (P.t0 || 0)) / T; };

    return {
      draw(t, P) {
        const s = P.s || {}, p = P.p || s, u = P.u;
        const bl = fn => lerp(fn(p), fn(s), u);
        const mixK = (key, d) => lerp(num(p[key], d), num(s[key], d), u);
        const sc = sceneOf(s), pc = sceneOf(p);
        const vis = name => (sc === pc ? (sc === name ? 1 : 0) : sc === name ? u : pc === name ? 1 - u : 0);
        for (const k in scenes) show(scenes[k], vis(k));
        const slow = bl(slowOf);
        slowPill.set(slow > 1.01 ? "slow motion" : "", sc === "barton" ? 8 : 210, 13, sc === "barton" ? "start" : "middle", clamp((slow - 1) * 4, 0, 1));
        const labels = mixK("labels", 0);

        // ===================== spring =====================
        if (vis("spring") > 0) {
          const sk = skinOf(s), pk = skinOf(p), skV = name => (sk === pk ? (sk === name ? 1 : 0) : sk === name ? u : pk === name ? 1 - u : 0);
          const labV = skV("lab"), okV = skV("okada");
          show(stand, labV); show(ground, okV); show(badge, okV);
          const nm = clamp(mixK("n", 1), 1, 2) - 1;
          const cxs = [lerp(155, 110, nm), 310];
          const S = mixK("scale", 9) * 100, SO = 1000;   // lab units per metre · okada units per metre
          const ruleOp = labV * mixK("ruler", 0) * (1 - nm);
          const eqOp = mixK("eq", 0), xA = mixK("xArrow", 0), acc = mixK("accel", 0), bal = mixK("balance", 0);
          let rest1 = null;
          for (const C of COLS) {
            const i = C.i, cx = cxs[i - 1], colOp = i === 1 ? 1 : nm;
            show(C.g, colOp); if (colOp < .004) continue;
            const m = bl(st => mOf(st, i)), k = bl(st => kOf(st, i)), g = bl(gOf);
            const x0 = m * g / Math.max(k, 1e-6);
            const xh = mixK("x" + sfx(i), 0), Am = mixK("A" + sfx(i), 0), om = mixK("osc" + sfx(i), 0);
            const ph = SIM ? S_(i === 1 ? "ph1" : "ph2", t) : fbPhase(i, t, P);
            const x = lerp(xh, Am * Math.cos(ph), om);
            // ---- lab geometry ----
            const yT = 60, L0 = 96;
            const sb = Math.max(yT + 20, yT + L0 + (x0 + x) * S), yP = sb + 10, eqL = yT + L0 + x0 * S + 10;
            // ---- okada geometry ----
            const yG = 360, Lc0 = 130, nCr = clamp(Math.round(3 + (m - 200) / 25), 1, 6);
            const cb = Math.min(yG - 24, yG - Lc0 + (x0 + x) * SO), refO = cb - 10, eqO = yG - Lc0 + x0 * SO - 10;
            const ref = lerp(yP, refO, okV), eqY = lerp(eqL, eqO, okV);
            const lcY = lerp(yP + 32, refO - nCr * 11, okV);   // load centre
            const xScale = lerp(1800, 2500, okV), xAx = lerp(40, 84, okV);   // arrow units per metre · arrow offset from the load axis
            if (i === 1) rest1 = { cx, eqY, crTop: eqO - nCr * 22 };
            // lab drawing
            show(C.lab, labV);
            if (labV > .004) {
              C.clamp.setAttribute("x", cx - 11); C.clamp.setAttribute("y", 44);
              C.helix.set(cx, yT + 6, sb - 4, 12, 11, 8, 4);
              C.hook.setAttribute("d", `M${cx} ${f1(sb)} q7 3 0 6 q-5 2 0 4`);
              C.rod.setAttribute("x1", cx); C.rod.setAttribute("x2", cx); C.rod.setAttribute("y1", f1(yP)); C.rod.setAttribute("y2", f1(yP + 52));
              C.base.setAttribute("x", cx - 25); C.base.setAttribute("y", f1(yP + 52));
              const nd = m / 0.050;
              C.discs.forEach((dg, j) => { const o = clamp(nd - j + .5, 0, 1); show(dg, o); dg.setAttribute("transform", `translate(${f1(cx)} ${f1(yP + 52 - (j + 1) * 7)})`); });
              const rx = cx + 150;
              show(C.pointer, i === 1 ? ruleOp : 0);
              C.pLine.setAttribute("x1", cx + 2); C.pLine.setAttribute("x2", rx - 8); C.pLine.setAttribute("y1", f1(yP)); C.pLine.setAttribute("y2", f1(yP));
              C.pHead.setAttribute("d", `M${rx - 1} ${f1(yP)} L${rx - 11} ${f1(yP - 5)} L${rx - 11} ${f1(yP + 5)} Z`);
              if (i === 1) {
                show(rule, ruleOp); buildRule(Math.round(rx), Math.round(yT + L0 + 10), S / 100);
                reading.setAttribute("x", rx + 44); reading.setAttribute("y", f1(yP)); setTx(reading, s.reading, ruleOp * strFade(P, "reading"));
                setFoc("pointer", [rx - 74, eqY - 56, 176, 112]);
              }
            }
            // okada drawing
            show(C.ok, okV);
            if (okV > .004) {
              C.block.setAttribute("transform", `translate(${f1(cx)} 0)`);
              C.coil.set(cx, cb, yG, 46, 7, 0, 0);
              C.plate.setAttribute("x", f1(cx - 74)); C.plate.setAttribute("y", f1(cb - 10));
              C.crates.forEach((cg, j) => { show(cg, j < nCr ? 1 : 0); cg.setAttribute("transform", `translate(${f1(cx)} ${f1(refO - j * 22)})`); });
            }
            // equilibrium line + label (label on the side away from the displacement)
            show(C.eqLine, eqOp); C.eqLine.setAttribute("x1", f1(cx - 98)); C.eqLine.setAttribute("x2", f1(cx + 98)); C.eqLine.setAttribute("y1", f1(eqY)); C.eqLine.setAttribute("y2", f1(eqY));
            const roomRight = okV > .5 && i === 1 && nm < .5;   // okada, one column: room beside the crates
            C.eqLab.set("equilibrium", roomRight ? cx + 100 : cx + 98, eqY - 13, roomRight ? "start" : "end", eqOp);   // always above the line: the force label sits below it when the load is above
            // displacement bracket (spring 1)
            const bx = cx - xAx;
            if (i === 1 && xA > .004 && Math.abs(ref - eqY) > 1.5) {
              const dir = Math.sign(ref - eqY);
              C.bracket.style.display = ""; C.bracket.setAttribute("opacity", xA.toFixed(3));
              C.bracket.setAttribute("d", `M${f1(bx + 7)} ${f1(eqY)} H${f1(bx)} V${f1(ref)} H${f1(bx + 7)} M${f1(bx - 5)} ${f1(ref - dir * 9)} L${f1(bx)} ${f1(ref)} L${f1(bx + 5)} ${f1(ref - dir * 9)} M${f1(bx - 5)} ${f1(eqY + dir * 9)} L${f1(bx)} ${f1(eqY)} L${f1(bx + 5)} ${f1(eqY + dir * 9)}`);
              C.xLab.setAttribute("text-anchor", "end"); C.xLab.setAttribute("x", f1(bx - 7)); C.xLab.setAttribute("y", f1(eqY - dir * 11)); setTx(C.xLab, s.xLabel, xA * strFade(P, "xLabel"));
            } else { C.bracket.style.display = "none"; setTx(C.xLab, "", 0); }
            // restoring force and acceleration: ∝ |x|, always towards equilibrium (the live x while oscillating)
            const L = -x * xScale;   // drawn vector (screen y): x > 0 (below) → negative y = up
            const fOp = mixK(i === 1 ? "force" : "force2", 0), fx = cx + xAx;
            C.fArr.set(fx, lcY, lcY + L, fOp);
            const fl = i === 1 ? "forceLabel" : "forceLabel2";
            if (fx + 12 + (String(s[fl] || "").length * 8.4) > 416) { C.fLab.setAttribute("text-anchor", "middle"); C.fLab.setAttribute("x", f1(fx)); C.fLab.setAttribute("y", f1(lcY + L + Math.sign(L || 1) * 13)); }
            else { C.fLab.setAttribute("text-anchor", "start"); C.fLab.setAttribute("x", f1(fx + 12)); C.fLab.setAttribute("y", f1(lcY + L / 2)); }
            setTx(C.fLab, Math.abs(L) > 3 ? s[fl] : "", fOp * strFade(P, fl));
            if (i === 1) {
              const ax = cx - xAx - (xA > .5 ? 34 : 0);
              C.aArr.set(ax, lcY, lcY + L, acc);
              const lbl = String(s.accelLabel || ""), wEst = lbl.length * 8.4;
              if (ax - 12 - wEst < 4) { C.aLab.setAttribute("text-anchor", "middle"); C.aLab.setAttribute("x", f1(Math.max(ax, 4 + wEst / 2))); C.aLab.setAttribute("y", f1(L < 0 ? lcY + 15 : lcY + L + 13)); }   // no room at the side: below the arrow
              else { C.aLab.setAttribute("text-anchor", "end"); C.aLab.setAttribute("x", f1(ax - 12)); C.aLab.setAttribute("y", f1(lcY + L / 2)); }
              setTx(C.aLab, Math.abs(L) > 3 ? s.accelLabel : "", acc * strFade(P, "accelLabel"));
              // static balance: equal and opposite at rest
              const bL = 56, bo = bal * clamp(1 - Math.abs(x) * 400, 0, 1);
              C.bDn.set(cx + xAx, lcY, lcY + bL, bo); C.bUp.set(cx - xAx, lcY, lcY - bL, bo);
              C.bDnLab.setAttribute("x", f1(cx + xAx + 12)); C.bDnLab.setAttribute("y", f1(lcY + bL / 2)); C.bDnLab.setAttribute("opacity", bo.toFixed(3));
              const upW = 11 * 8.4;
              if (cx - xAx - 12 - upW < 4) { C.bUpLab.setAttribute("text-anchor", "start"); C.bUpLab.setAttribute("x", f1(cx - xAx + 10)); C.bUpLab.setAttribute("y", f1(lcY - bL - 4)); }
              else { C.bUpLab.setAttribute("text-anchor", "end"); C.bUpLab.setAttribute("x", f1(cx - xAx - 12)); C.bUpLab.setAttribute("y", f1(lcY - bL / 2)); }
              C.bUpLab.setAttribute("opacity", bo.toFixed(3));
            } else { C.aArr.set(0, 0, 0, 0); setTx(C.aLab, "", 0); C.bDn.set(0, 0, 0, 0); C.bUp.set(0, 0, 0, 0); C.bDnLab.setAttribute("opacity", 0); C.bUpLab.setAttribute("opacity", 0); }
            // tag above, period pill below
            const tk = i === 1 ? "tag" : "tag2", pkey = i === 1 ? "periodLabel" : "periodLabel2";
            C.tag.setAttribute("x", f1(cx)); setTx(C.tag, s[tk], strFade(P, tk));
            C.pill.set(s[pkey], cx, 405, "middle", strFade(P, pkey));
            // camera regions follow the layout (rest positions only, so the camera never shakes)
            const top = okV > .5 ? eqO - nCr * 22 - 26 : eqY - 80, bot = okV > .5 ? eqY + 70 : eqY + 112;
            setFoc(i === 1 ? "mass" : "mass2", [cx - 150, top, okV > .5 && nm < .5 ? 414 - (cx - 150) : 290, bot - top]);
            if (i === 1) setFoc("spring", okV > .5 ? [cx - 84, eqO - 6, 168, 404 - eqO] : [cx - 64, 38, 128, eqY - 20]);
          }
          setFoc("eq", rest1 ? [0, rest1.eqY - 62, 420, 124] : [0, 150, 420, 120]);
          setFoc("both", [0, 8, 420, 412]);
          // ring
          const fs = s.focus, M = FOC;
          ring(springRing, fs && M[fs] && ["pointer", "mass", "mass2", "eq", "spring"].includes(fs) ? [M[fs][0] + 6, M[fs][1] + 6, M[fs][2] - 12, M[fs][3] - 12] : null, t);
        }

        // ===================== barton =====================
        if (vis("barton") > 0) {
          const Ld = bl(LdOf), g = bl(gOf), Ls = conesOf(s), n = Ls.length;
          // driver
          const ad = SIM ? S_("ad", t) : (+s.swing === 1 ? THD : 0), phd = SIM ? S_("phd", t) : TAU * (t - (P.t0 || 0)) / (TAU * Math.sqrt(Ld / g) * slow);
          const thD = ad * Math.cos(phd), LdU = Ld * LSC;
          drvCord.setAttribute("x2", f1(DRV_X + LdU * Math.sin(thD))); drvCord.setAttribute("y2", f1(CORD_Y + LdU * Math.cos(thD)));
          drvBob.setAttribute("transform", `translate(${f1(DRV_X + LdU * Math.sin(thD))} ${f1(CORD_Y + LdU * Math.cos(thD))})`);
          setTx(drvLab, labels > .004 ? `${f2(+s.driverL || 0.6)} m` : "", labels);
          drvName.setAttribute("opacity", labels.toFixed(3)); show(bLabs, labels);
          // cones
          const matchOn = mixK("match", 0), Lt = LdOf(s);
          let mj = -1; Ls.forEach((l, j) => { if (Math.abs(l - Lt) <= 0.005) mj = j; });
          for (let j = 0; j < MAXC; j++) {
            const C = coneG[j];
            if (j >= n) { show(C.g, 0); show(C.knot, 0); setTx(C.lab, "", 0); continue; }
            show(C.g, 1); show(C.knot, 1);
            const x0 = coneX(j, n), l = Ls[j], lu = l * LSC;
            let th;
            if (SIM) { const re = SIM.look(SIM.CR[j], t), im = SIM.look(SIM.CI[j], t); th = re * Math.cos(phd) - im * Math.sin(phd); }
            else { const tg = coneTarget(l, Ld), env = +s.swing === 1 ? (+p.swing === 1 ? 1 : 1 - Math.exp(-(t - (P.t0 || 0)) / (3 * TAU * Math.sqrt(Ld / g) * slow))) : 0; th = env * (tg[0] * Math.cos(phd) - tg[1] * Math.sin(phd)); }
            C.g.setAttribute("transform", `rotate(${f2(-th * DEG)} ${f1(x0)} ${CORD_Y})`);
            C.thread.setAttribute("x1", f1(x0)); C.thread.setAttribute("y1", CORD_Y); C.thread.setAttribute("x2", f1(x0)); C.thread.setAttribute("y2", f1(CORD_Y + lu - 14));
            for (const e of [C.body, C.g.children[3]]) e.setAttribute("transform", `translate(${f1(x0)} ${f1(CORD_Y + lu)})`);
            C.glow.setAttribute("cx", f1(x0)); C.glow.setAttribute("cy", f1(CORD_Y + lu));
            C.glow.setAttribute("opacity", (j === mj ? matchOn * (.28 + .1 * Math.sin(t * 4)) : 0).toFixed(3));
            C.body.setAttribute("fill", j === mj && matchOn > .5 ? "#fff3c4" : "#efe6cf");
            C.knot.setAttribute("cx", f1(x0)); C.knot.setAttribute("cy", CORD_Y);
            C.lab.setAttribute("x", f1(x0)); setTx(C.lab, `${f2(l)} m`, labels);
            C.lab.setAttribute("fill", j === mj && matchOn > .5 ? GLOW : TXT);
          }
          const ro = mixK("readout", 0);
          const rs = [s.readoutT, s.readoutF].filter(Boolean).join(", "), rsP = [p.readoutT, p.readoutF].filter(Boolean).join(", ");
          bPill.set(rs, 412, 18, "end", ro * (!rs ? 0 : rs === rsP ? 1 : ease(seg(u, .2, 1))));
          const mx = mj >= 0 ? coneX(mj, n) : 248, ml = mj >= 0 ? Ls[mj] * LSC : 192;
          setFoc("matched", [mx - 74, 40, 148, ml + 52]);
          const spots = { driver: [DRV_X - 34, CORD_Y + LdU - 30, 68, 60], matched: [mx - 30, CORD_Y + ml - 32, 60, 62], cones: FOC.cones, cord: [8, CORD_Y - 12, 404, 24], readout: [196, 2, 220, 34] };
          ring(bartonRing, spots[s.focus] || null, t);
        }

        // ===================== ridge =====================
        if (vis("ridge") > 0) {
          const R = ridgeBlend(bl);
          const w = TAU * R.v / 3.6 / R.d;
          let phi, y, h, rel, ck;
          if (SIM) { phi = S_("rphi", t); y = S_("ry", t); h = S_("rh", t); rel = S_("rrel", t); ck = S_("rck", t); }
          else { phi = w * (t - (P.t0 || 0)) / slow; const st = steady(R, phi); y = st.y; h = y; rel = st.yd + R.Y * w * Math.sin(phi); ck = -1; }
          // road: profile Y(1 + cos(φ + 2π(x − WX)/(SX d))), concrete caps on the crests
          const Ydraw = R.Y * AS, per = SX * R.d;
          let dr = `M0 360 `;
          for (let xx = 0; xx <= 420; xx += 6) dr += `L${xx} ${f1(YR - Ydraw * (1 + Math.cos(phi + TAU * (xx - WX) / per)))} `;
          road.setAttribute("d", dr + "L420 360 Z");
          const kc = Math.floor((phi + TAU * (0 - WX) / per) / TAU);
          caps.forEach((c, j) => {
            const nn = kc + j + 1, xc = WX + (nn * TAU - phi) / TAU * per;
            if (xc < -20 || xc > 440) { c.style.display = "none"; return; }
            c.style.display = ""; const top = YR - 2 * Ydraw;
            c.setAttribute("d", `M${f1(xc - 11)} ${f1(top + 6)} Q${f1(xc - 9)} ${f1(top - 3)} ${f1(xc)} ${f1(top - 3)} Q${f1(xc + 9)} ${f1(top - 3)} ${f1(xc + 11)} ${f1(top + 6)} Z`);
          });
          // wheel rides the profile; carrier = base mean + bounce
          const base = R.Y * (1 + Math.cos(phi)), ay = AY0 - base * AS, cy = CB0 - (R.Y + y) * AS;
          wheel.setAttribute("transform", `translate(${WX} ${f1(ay)})`);
          spokes.setAttribute("transform", `rotate(${f1(((phi / TAU) * per / RW) * DEG % 360)})`);
          arm.setAttribute("d", `M${WX} ${f1(ay)} L${WX + 120} ${f1(ay - 50)}`);
          // shock
          const bx = WX - 15, btop = ay - BODY, pist = clamp(cy + ROD, btop + 4, ay - 8);
          body.setAttribute("x", bx); body.setAttribute("y", f1(btop));
          win.setAttribute("x", WX - 8); win.setAttribute("y", f1(btop + 8));
          const leak = clamp(1 - (bl(zetaOf) - .05) / .25, 0, 1), oilFrac = lerp(.94, .26, leak), wy0 = btop + 8, wh = BODY - 16;
          oil.setAttribute("x", WX - 8); oil.setAttribute("y", f1(wy0 + wh * (1 - oilFrac))); oil.setAttribute("height", f1(wh * oilFrac));
          streaks.setAttribute("transform", `translate(${WX} ${f1(btop + 44)})`); streaks.setAttribute("opacity", (leak * .9).toFixed(3));
          heat.setAttribute("x", WX - 19); heat.setAttribute("y", f1(btop)); heat.setAttribute("opacity", ((1 - leak) * clamp(Math.abs(rel) / 0.25, 0, 1) * .35).toFixed(3));
          rodL.setAttribute("x1", WX); rodL.setAttribute("x2", WX); rodL.setAttribute("y1", f1(cy)); rodL.setAttribute("y2", f1(pist));
          piston.setAttribute("x", WX - 8); piston.setAttribute("y", f1(pist - 2.5));
          shroud.setAttribute("x", WX - 18); shroud.setAttribute("y", f1(cy));
          coilR.set(WX, cy + 6, ay - 18, 25, 7, 0, 0);
          carrier.setAttribute("transform", `translate(0 ${f1(cy)})`);
          // crates: stack on the carrier, or flying (h above the carrier)
          const nCr = clamp(Math.round(3 + (R.m - 200) / 25), 1, 6), crBase = CB0 - 10 - (R.Y + h) * AS;
          crateList.forEach((c, j) => { show(c, j < nCr ? 1 : 0); c.setAttribute("transform", `translate(160 ${f1(crBase - j * 16)})`); });
          crack.setAttribute("transform", `translate(176 ${f1(crBase - (nCr - 1) * 16)})`);
          crack.setAttribute("opacity", (ck >= 0 ? clamp(ck / .3, 0, 1) : 0).toFixed(3));
          // labels
          show(rLabs, labels);
          lShock.setAttribute("y", f1(ay - 58)); lCarrier.setAttribute("y", f1(cy - 5));
          setTx(dLab, `d = ${+(+s.d || 2.5).toFixed(2)} m`, 1);
          // trace: last 2.5 s (real) of bounce, ridge-hit ticks on the time axis
          const trOp = mixK("trace", 0); show(trG, trOp);
          if (trOp > .004) {
            const Wd = 2.5 * slow, NP = 140; let dl = "", dt2 = "", lastK = null;
            for (let q = 0; q <= NP; q++) {
              const tq = t - Wd + Wd * q / NP, X = TR.x0 + (TR.x1 - TR.x0) * q / NP;
              let yq, pq;
              if (SIM && tq >= SIM.t0) { yq = S_("ry", tq); pq = S_("rphi", tq); } else { pq = phi - w * (t - tq) / slow; yq = steady(R, pq).y; }
              dl += (q ? "L" : "M") + f1(X) + " " + f1(TR.y - clamp(yq * TR.sc, -32, 32));
              const kk = Math.floor(pq / TAU);
              if (lastK != null && kk !== lastK) dt2 += `M${f1(X)} ${TR.bot - 12} V${TR.bot - 2} `;
              lastK = kk;
            }
            trLine.setAttribute("d", dl); trTicks.setAttribute("d", dt2);
          }
          // gauge: current amplitude (largest |y| over the last driving period) and the lift-off line g/ω²
          const gaOp = mixK("gauge", 0); show(gaG, gaOp);
          if (gaOp > .004) {
            let amp = 0; const Tw = TAU / Math.max(w, .1) * slow;
            for (let q = 0; q <= 24; q++) { const tq = t - Tw * q / 24; const yq = SIM && tq >= SIM.t0 ? S_("ry", tq) : steady(R, phi - w * (t - tq) / slow).y; amp = Math.max(amp, Math.abs(yq)); }
            const cm2y = c => GA.y0 - (GA.y0 - GA.y1) * clamp(c / GA.max, 0, 1);
            const ampCm = amp * 100, lift = R.g / (w * w) * 100, ly = cm2y(lift);
            gaBar.setAttribute("y", f1(cm2y(ampCm))); gaBar.setAttribute("height", f1(Math.max(0, GA.y0 - cm2y(ampCm))));
            gaLine.setAttribute("y1", f1(ly)); gaLine.setAttribute("y2", f1(ly));
            gaUp.setAttribute("d", lift > GA.max ? `M${GA.x + GA.w / 2} ${GA.y1 - 30} l-6 9 h12 Z` : "");
            gaLift.setAttribute("y", f1(lift > GA.max ? GA.y1 - 2 : ly));
            gaLab.setAttribute("y", GA.y0 + 16); setTx(gaLab, s.gaugeLabel, strFade(P, "gaugeLabel"));
          }
          const ro = mixK("readout", 0);
          rPillV.set(s.readoutV, 414, 16, "end", ro * strFade(P, "readoutV"));
          rPillF.set(s.readoutF || s.readoutT, 414, 44, "end", ro * strFade(P, s.readoutF ? "readoutF" : "readoutT"));
          const top = CB0 - 10 - nCr * 16;
          const spots = { crate: [84, top - 50, 152, nCr * 16 + 66], damper: [WX - 24, CB0 + 4, 48, LS - 4], ridges: [170, 300, 196, 50], trace: [8, TR.top - 4, 404, TR.bot - TR.top + 6], gauge: [GA.x - 50, GA.y1 - 24, 86, GA.y0 - GA.y1 + 50], readout: [250, 2, 168, 58] };
          setFoc("crate", [16, top - 60, 250, nCr * 16 + 130]);
          ring(ridgeRing, spots[s.focus] || null, t);
        }
      },
    };
  },
};
