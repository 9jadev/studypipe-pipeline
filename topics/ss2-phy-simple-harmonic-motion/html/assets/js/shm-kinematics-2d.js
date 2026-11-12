/* ==========================================================
   StudyPipe kit · shm-kinematics-2d v2 · window.ShmKinematics2D
   Planar SHM scenes drawn with Paper.js (rule 5b: projections, graphs, planar force diagrams).
   Classic script, offline, needs window.paper (assets/js/paper-core.min.js). No modules, no fetch.
   Colours and fonts are read from the theme's CSS variables at draw time (no literals).

   Scenes (opts.scene / setState({ scene })):
     wheel           okada rear tyre on its centre stand, mud lump, radius, angle arc ωt, ground
                     shadow (x = A sin ωt) with v (teal) and a (amber, always towards O) arrows;
                     optional x/v/a traces (graphs: true)                                   [L03 bench]
     circle          reference circle + projection on a diameter + synced x, v, a traces, cursor,
                     optional g line (preset "okada": ω² = k/m = 158 s⁻²)                   [L03 zoom]
     graphs          the three traces only (optional g line)
     energy          spring-mass track, PE/KE/total against x and against t (E = ½kA²)    [L06]
     damping-trace   x–t decay: set "kinds" (light / critical / heavy) or "shock" (healthy ζ 0.30 /
                     leaking ζ 0.05), optional forced: true (ten pushes at f₀)              [L06 zoom]
     resonance       A against driving f (base-excitation model), ζ, load 200/250 kg, operating
                     point from speed, dashed lift-off threshold g/(2πf)², carrier gauge      [L07 zoom]
     pendulum-forces thread at θ, mg, T, mg cos θ, mg sin θ, a = g sin θ, x/l triangle       [L04 zoom]
     phase-strip     A → O → B → O → A strip under a swinging pendulum, cycle fractions     [L01]

   Physics lives in ShmKinematics2D.model; every number the kit shows comes from it.
   ========================================================== */
(function (global) {
  "use strict";

  var VERSION = 2;
  var G = 9.8;
  var PI = Math.PI;
  // Story model is defined by f₀ = 2.00 Hz exactly at 200 kg: k = 4π²f₀²m ≈ 31 583 N m⁻¹ (quoted as 3.16 × 10⁴ N m⁻¹)
  var OKADA = { f0: 2.0, mass: 200, k: 4 * Math.PI * Math.PI * 2.0 * 2.0 * 200, kLabel: "3.16 × 10⁴ N m⁻¹", d: 2.5, Y: 0.010, zeta: { healthy: 0.30, leaking: 0.05 } };

  /* ---------------------------------------------------------------- model */
  function zap(v) { return Math.abs(v) < 1e-12 ? 0 : v; }

  var model = {
    G: G,
    OKADA: OKADA,
    /** SHM from the reference circle: x = A sin θ, v = ωA cos θ, a = −ω²x (θ = ωt). */
    shm: function (A, T, thetaRad) {
      var w = 2 * PI / T, x = zap(A * Math.sin(thetaRad)), v = zap(w * A * Math.cos(thetaRad)), a = zap(-w * w * x);
      return { A: A, T: T, w: w, f: 1 / T, theta: thetaRad, x: x, v: v, a: a, v_max: w * A, a_max: w * w * A };
    },
    /** v = ω√(A² − x²) (speed at displacement x). */
    speedAt: function (A, w, x) { return w * Math.sqrt(Math.max(0, A * A - x * x)); },
    /** Spring energy: PE = ½kx², KE = ½k(A² − x²), E = ½kA². */
    energy: function (k, m, A, x) {
      var E = 0.5 * k * A * A, PE = 0.5 * k * x * x, KE = Math.max(0, E - PE);
      return { k: k, m: m, A: A, x: x, E: E, PE: PE, KE: KE, sum: PE + KE, v: Math.sqrt(2 * KE / m), w: Math.sqrt(k / m), x_equal: A / Math.SQRT2 };
    },
    /** Free decay released from rest at A0 (x(0) = A0, v(0) = 0). */
    decay: function (zeta, w0, t, A0) {
      A0 = A0 == null ? 1 : A0;
      if (zeta < 1 - 1e-9) {
        var wd = w0 * Math.sqrt(1 - zeta * zeta);
        return A0 * Math.exp(-zeta * w0 * t) * (Math.cos(wd * t) + zeta / Math.sqrt(1 - zeta * zeta) * Math.sin(wd * t));
      }
      if (zeta <= 1 + 1e-9) return A0 * Math.exp(-w0 * t) * (1 + w0 * t);
      var s = Math.sqrt(zeta * zeta - 1), r1 = -w0 * (zeta - s), r2 = -w0 * (zeta + s);
      return A0 * (r2 * Math.exp(r1 * t) - r1 * Math.exp(r2 * t)) / (r2 - r1);
    },
    /** Envelope A0·e^(−ζω₀t) and amplitude ratio per cycle e^(−2πζ/√(1−ζ²)). */
    envelope: function (zeta, w0, t, A0) { return (A0 == null ? 1 : A0) * Math.exp(-zeta * w0 * t); },
    ratioPerCycle: function (zeta) { return zeta >= 1 ? 0 : Math.exp(-2 * PI * zeta / Math.sqrt(1 - zeta * zeta)); },
    /** Base-excitation response (absolute): A = Y√(1+(2ζr)²)/√((1−r²)²+(2ζr)²), r = f/f₀. */
    response: function (f, f0, zeta, Y) {
      var r = f / f0, q = Math.pow(2 * zeta * r, 2);
      return (Y == null ? OKADA.Y : Y) * Math.sqrt(1 + q) / Math.sqrt(Math.pow(1 - r * r, 2) + q);
    },
    /** Lift-off threshold with the driving frequency: A ≥ g/(2πf)² (metres). */
    threshold: function (f, g) { var w = 2 * PI * f; return w > 0 ? (g || G) / (w * w) : Infinity; },
    /** Ridge Road story model (02-lesson.md): speed → f = v/d, response, threshold, lift-off. */
    okada: function (speed_kmh, mass, zeta, opt) {
      opt = opt || {};
      var k = opt.k || OKADA.k, d = opt.d || OKADA.d, Y = opt.Y == null ? OKADA.Y : opt.Y, g = opt.g || G;
      var v = speed_kmh / 3.6, f = v / d, w0 = Math.sqrt(k / mass), f0 = w0 / (2 * PI);
      var A = model.response(f, f0, zeta, Y), th = model.threshold(f, g);
      return { speed_kmh: speed_kmh, v: v, f: f, f0: f0, w0: w0, T0: 1 / f0, r: f / f0, zeta: zeta, mass: mass, k: k, d: d, Y: Y,
        A: A, th: th, th0: g / (w0 * w0), sag: mass * g / k, v_res: d * f0, kmh_res: d * f0 * 3.6, lift: A >= th };
    },
    /** Highest point of the response curve (numerical). */
    peak: function (f0, zeta, Y) {
      var best = 0, fb = f0;
      for (var i = 0; i <= 4000; i++) { var f = f0 * (0.6 + 0.8 * i / 4000), a = model.response(f, f0, zeta, Y); if (a > best) { best = a; fb = f; } }
      return { f: fb, A: best };
    },
    /** Base-excited oscillator driven at f (default f₀) from rest, RK4. Returns samples [t, x] (m). */
    forced: function (zeta, w0, Y, tEnd, f, n) {
      var wf = 2 * PI * (f || w0 / (2 * PI)); n = n || 2000; Y = Y == null ? OKADA.Y : Y;
      var dt = tEnd / n, x = 0, v = 0, out = [[0, 0]];
      function acc(t, x, v) { var y = Y * Math.sin(wf * t), yd = Y * wf * Math.cos(wf * t); return -2 * zeta * w0 * (v - yd) - w0 * w0 * (x - y); }
      for (var i = 0; i < n; i++) {
        var t = i * dt;
        var k1x = v, k1v = acc(t, x, v);
        var k2x = v + 0.5 * dt * k1v, k2v = acc(t + dt / 2, x + 0.5 * dt * k1x, v + 0.5 * dt * k1v);
        var k3x = v + 0.5 * dt * k2v, k3v = acc(t + dt / 2, x + 0.5 * dt * k2x, v + 0.5 * dt * k2v);
        var k4x = v + dt * k3v, k4v = acc(t + dt, x + dt * k3x, v + dt * k3v);
        x += dt / 6 * (k1x + 2 * k2x + 2 * k3x + k4x); v += dt / 6 * (k1v + 2 * k2v + 2 * k3v + k4v);
        out.push([t + dt, x]);
      }
      return out;
    },
    /** Simple pendulum forces at angle θ (released from θ0): T = m(g cos θ + v²/l). */
    pendulum: function (theta_deg, mass_kg, l, g, theta0_deg) {
      g = g || G; var th = theta_deg * PI / 180, th0 = (theta0_deg == null ? theta_deg : theta0_deg) * PI / 180;
      var v2 = Math.max(0, 2 * g * l * (Math.cos(th) - Math.cos(th0))), mg = mass_kg * g;
      return { theta_deg: theta_deg, theta_rad: th, sin: Math.sin(th), cos: Math.cos(th), mass: mass_kg, l: l, g: g, mg: mg,
        mg_cos: mg * Math.cos(th), mg_sin: mg * Math.sin(th), a: g * Math.sin(th), tension: mass_kg * (g * Math.cos(th) + v2 / l),
        x: l * Math.sin(th), x_over_l: Math.sin(th), arc: l * th, diff_pct: th === 0 ? 0 : 100 * (th - Math.sin(th)) / th,
        T_small: 2 * PI * Math.sqrt(l / g), v: Math.sqrt(v2) };
    },
    /** Ordinary single rounding to dp decimal places (10.0499 → 10.0). */
    round: function (x, dp) {
      var p = Math.pow(10, dp);
      return Math.round(x * p) / p;
    }
  };

  /* --------------------------------------------------------------- formatting */
  function minus(s) { return String(s).replace(/-/g, "−"); }
  function sf(v, n) {
    if (!isFinite(v)) return "∞";
    if (Math.abs(v) < 1e-9) return "0";
    var s = Number(v).toPrecision(n || 3);
    if (/e/.test(s)) s = String(Number(s));
    return minus(s);
  }
  function fx(v, d) { if (!isFinite(v)) return "∞"; var r = model.round(v, d); if (Math.abs(r) < 1e-12) r = 0; return minus(r.toFixed(d)); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function deg(r) { return r * 180 / PI; }
  function wrap360(d) { d = d % 360; return d < 0 ? d + 360 : d; }

  /* --------------------------------------------------------------- defaults */
  var SCENES = ["wheel", "circle", "graphs", "energy", "damping-trace", "resonance", "pendulum-forces", "phase-strip"];
  var defaults = {
    scene: "wheel", autoplay: true, labels: true, surface: "ink", timeScale: 1, onChange: null
  };
  var SCENE_DEFAULTS = {
    "wheel": { A: 0.30, T: 2.0, Amax: 0.40, graphs: false, timeScale: 1 },
    "circle": { preset: "lab", A: 0.30, T: 2.0, Amax: 0.40, gLine: false, timeScale: 1 },
    "graphs": { preset: "lab", A: 0.30, T: 2.0, Amax: 0.40, gLine: false, timeScale: 1 },
    "energy": { k: 50, m: 0.50, A: 0.10, view: "both", timeScale: 0.25 },
    "damping-trace": { set: "kinds", show: null, forced: false, T: 1.0, A0: 0.05, tEnd: null, timeScale: 1 },
    "resonance": { load_kg: 200, zeta: 0.05, speed_kmh: 18, Y: 0.010, d: 2.5, kSpring: OKADA.k, timeScale: 0.5 },
    "pendulum-forces": { theta_deg: 20, mass_g: 50, l: 0.50, g: G, timeScale: 0.5, autoplay: false },
    "phase-strip": { A: 0.10, T: 1.80, l: 0.80, timeScale: 0.5 }
  };
  var PRESETS = {
    okada: { A: 0.03, T: 2 * PI / Math.sqrt(OKADA.k / OKADA.mass), Amax: 0.08, gLine: true, timeScale: 0.25 },
    lab: { A: 0.30, T: 2.0, Amax: 0.40, gLine: false, timeScale: 1 }
  };
  var PARTS = {
    "wheel": ["wheel", "lump", "radius", "angle", "shadow", "v-arrow", "a-arrow", "centre", "trace-x", "trace-v", "trace-a", "cursor"],
    "circle": ["circle", "point", "radius", "angle", "shadow", "v-arrow", "a-arrow", "centre", "trace-x", "trace-v", "trace-a", "cursor", "g-line"],
    "graphs": ["trace-x", "trace-v", "trace-a", "cursor", "g-line"],
    "energy": ["mass", "spring", "track", "pe-curve", "ke-curve", "total-line", "crossover", "cursor", "pe-t", "ke-t"],
    "damping-trace": ["light", "critical", "heavy", "healthy", "leaking", "envelope", "lift-line", "pen"],
    "resonance": ["curve", "leaking", "healthy", "threshold", "f0-line", "point", "peak", "gauge", "danger"],
    "pendulum-forces": ["pivot", "thread", "bob", "angle", "mg", "tension", "mg-cos", "mg-sin", "triangle", "a-arrow"],
    "phase-strip": ["thread", "bob", "A", "O", "B", "ruler", "ghosts", "progress"]
  };
  var DAMP_SETS = {
    kinds: { light: { zeta: 0.05, role: "x", label: "light" }, critical: { zeta: 1.0, role: "v", label: "critical" }, heavy: { zeta: 3.0, role: "accent2", label: "heavy" } },
    shock: { healthy: { zeta: 0.30, role: "v", label: "healthy ζ 0.30" }, leaking: { zeta: 0.05, role: "danger", label: "leaking ζ 0.05" } }
  };

  function assign(t) { for (var i = 1; i < arguments.length; i++) { var s = arguments[i]; if (s) for (var k in s) if (Object.prototype.hasOwnProperty.call(s, k)) t[k] = s[k]; } return t; }

  /* =============================================================== create */
  function create(opts) {
    opts = opts || {};
    if (!global.paper) throw new Error("ShmKinematics2D needs window.paper (load paper-core.min.js first)");
    var canvas = opts.canvas;
    if (typeof canvas === "string") canvas = document.querySelector(canvas);
    if (canvas && canvas.tagName !== "CANVAS") { var host = canvas; canvas = document.createElement("canvas"); canvas.style.cssText = "display:block;width:100%;height:100%"; host.appendChild(canvas); }
    if (!canvas) throw new Error("ShmKinematics2D.create needs { canvas }");

    var scene0 = opts.scene || opts.mode || defaults.scene;
    var S = assign({}, defaults, SCENE_DEFAULTS[scene0] || {}, opts.preset && PRESETS[opts.preset] ? PRESETS[opts.preset] : {}, opts);
    S.scene = SCENES.indexOf(scene0) >= 0 ? scene0 : "wheel";
    delete S.canvas; delete S.mode;

    var ps = new global.paper.PaperScope();
    ps.setup(canvas);
    var base = new ps.Layer(), live = new ps.Layer(), over = new ps.Layer();
    var parts = {}, liveParts = {}, hl = null, dirty = true, playing = S.autoplay !== false, t = 0, last = 0, raf = 0, dead = false;
    var W = 320, H = 300, FS = 1, visible = true, C = {}, FONT = "monospace", geo = {}, dragging = false;

    /* ---------- theme tokens (read at draw time) ---------- */
    var ROLE = {
      ink: { fg: "--fg", soft: "--fg-soft", muted: "--muted", line: "--line", lineStrong: "--line-strong", bg: "--ink-950", bg2: "--ink-800", tyre: "--ink-700",
        x: "--sky", v: "--teal", a: "--amber", danger: "--crimson", accent2: "--violet", lime: "--lime", pink: "--pink-soft", wood: "--on-ink-soft", brass: "--amber", mud: "--orange", sun: "--amber" },
      paper: { fg: "--paper-ink", soft: "--paper-text", muted: "--paper-muted", line: "--paper-line", lineStrong: "--paper-faint", bg: "--paper-card", bg2: "--paper-2", tyre: "--paper-ink",
        x: "--info", v: "--ok", a: "--warn", danger: "--crimson", accent2: "--violet", lime: "--ok-deep", pink: "--crimson", wood: "--paper-2", brass: "--warn", mud: "--orange", sun: "--warn" }
    };
    function readTheme() {
      var cs = getComputedStyle(document.documentElement), fb = getComputedStyle(document.body).color, map = ROLE[S.surface] || ROLE.ink;
      C = {};
      for (var r in map) { var v = cs.getPropertyValue(map[r]).trim(); C[r] = v || fb; }
      FONT = (cs.getPropertyValue("--font-mono").trim().split(",")[0] || "").replace(/["']/g, "").trim() || "monospace";
    }
    function col(role, alpha) { var c = new ps.Color(C[role] || C.fg); if (alpha != null) c.alpha = alpha; return c; }
    function P(x, y) { return new ps.Point(x, y); }

    /* ---------- drawing helpers ---------- */
    function txt(pt, str, role, size, just, weight, alpha) {
      return new ps.PointText({ point: pt, content: str, fillColor: col(role, alpha), fontFamily: FONT, fontSize: (size || 11) * FS, fontWeight: weight || "normal", justification: just || "left" });
    }
    function pill(pt, str, role, size, just) {
      var t1 = txt(pt, str, role, size || 11, just, "bold");
      var b = t1.bounds.expand(6, 3);
      var r = new ps.Path.Rectangle({ rectangle: b, radius: 5, fillColor: col("bg", 0.78), strokeColor: col(role, 0.55), strokeWidth: 1 });
      r.insertBelow(t1);
      return new ps.Group([r, t1]);
    }
    function line(a, b, role, w, dash, alpha) {
      var l = new ps.Path.Line({ from: a, to: b, strokeColor: col(role, alpha), strokeWidth: w || 1, strokeCap: "round" });
      if (dash) l.dashArray = dash;
      return l;
    }
    function arrow(from, to, role, w, dash, alpha) {
      w = w || 3; var v = to.subtract(from), len = v.length, g = new ps.Group();
      if (len < 3) { g.addChild(new ps.Path.Circle({ center: from, radius: w * 0.9, fillColor: col(role, alpha) })); return g; }
      var u = v.normalize(), hl2 = Math.min(8 + w * 1.6, len * 0.5), b = to.subtract(u.multiply(hl2)), n = P(-u.y, u.x).multiply(hl2 * 0.52);
      var shaft = line(from, b.add(u.multiply(0.5)), role, w, dash, alpha); shaft.strokeCap = "butt";
      g.addChild(shaft);
      g.addChild(new ps.Path({ segments: [to, b.add(n), b.subtract(n)], closed: true, fillColor: col(role, alpha) }));
      return g;
    }
    function arc(c, r, a0, a1, role, w, dash, alpha) { // angles in screen radians (0 = +x, clockwise positive since y is down)
      var am = (a0 + a1) / 2;
      var pa = c.add(P(Math.cos(a0), Math.sin(a0)).multiply(r)), pm = c.add(P(Math.cos(am), Math.sin(am)).multiply(r)), pb = c.add(P(Math.cos(a1), Math.sin(a1)).multiply(r));
      if (Math.abs(a1 - a0) < 1e-3) return new ps.Path.Circle({ center: pa, radius: 0.5 });
      var p = new ps.Path.Arc({ from: pa, through: pm, to: pb, strokeColor: col(role, alpha), strokeWidth: w || 1.5 });
      if (dash) p.dashArray = dash;
      return p;
    }
    function reg(map, id, item) { if (item) map[id] = item; return item; }
    function axisBox(r) { return new ps.Path.Rectangle({ rectangle: new ps.Rectangle(r.x, r.y, r.w, r.h), strokeColor: col("line"), strokeWidth: 1 }); }

    /* ---------- time / phase ---------- */
    function period() { return S.T; }
    function omega() { return 2 * PI / S.T; }

    /* =========================================================== TRACES (x, v, a against t) */
    function traceGeo(r) {
      var gut = 24, top = r.y + 4, axisH = 16, n = 3, gap = 6, sh = (r.h - axisH - gap * (n - 1) - 4) / n;
      var strips = [];
      for (var i = 0; i < n; i++) strips.push({ x: r.x + gut, y: top + i * (sh + gap), w: r.w - gut - 4, h: sh });
      return { r: r, strips: strips, span: 2 * period(), axisY: top + n * sh + (n - 1) * gap + 12 };
    }
    var TR = [{ id: "trace-x", key: "x", role: "x", unit: "m" }, { id: "trace-v", key: "v", role: "v", unit: "m/s" }, { id: "trace-a", key: "a", role: "a", unit: "m/s²" }];
    function traceScale(i) { var w = omega(), A = Math.max(S.Amax || S.A, S.A); return i === 0 ? A : i === 1 ? w * A : w * w * A; }
    function traceVal(i, tt) { var s = model.shm(S.A, S.T, omega() * tt); return i === 0 ? s.x : i === 1 ? s.v : s.a; }
    function stripY(st, val, sc) { return st.y + st.h / 2 - clamp(val / sc, -1.08, 1.08) * (st.h / 2 - 3); }
    function drawTracesBase(tg) {
      var span = tg.span;
      tg.strips.forEach(function (st, i) {
        var d = TR[i], sc = traceScale(i);
        axisBox({ x: st.x, y: st.y, w: st.w, h: st.h });
        line(P(st.x, st.y + st.h / 2), P(st.x + st.w, st.y + st.h / 2), "lineStrong", 1);
        txt(P(st.x - 8, st.y + st.h / 2 + 4), d.key, d.role, 13, "right", "bold");
        var ghost = new ps.Path({ strokeColor: col(d.role, 0.25), strokeWidth: 1.4 });
        for (var k = 0; k <= 160; k++) { var tt = span * k / 160; ghost.add(P(st.x + st.w * k / 160, stripY(st, traceVal(i, tt), sc))); }
        if (i === 2 && S.gLine) {
          var gy = stripY(st, -G, sc);
          if (gy <= st.y + st.h) {
            reg(parts, "g-line", line(P(st.x, gy), P(st.x + st.w, gy), "danger", 1.3, [5, 4]));
            txt(P(st.x + st.w - 3, gy - 3), "−g", "danger", 10.5, "right", "bold");
          } else txt(P(st.x + st.w - 3, st.y + st.h - 4), "−g below", "danger", 10, "right");
        }
      });
      for (var q = 0; q <= 4; q++) {
        var xx = tg.strips[0].x + tg.strips[0].w * q / 4;
        txt(P(xx, tg.axisY), fx(span * q / 4, span < 2 ? 2 : 1), "muted", 10, q === 0 ? "left" : q === 4 ? "right" : "center");
      }
      txt(P(tg.strips[0].x - 6, tg.axisY), "t/s", "muted", 9.5, "right");
    }
    function drawTracesLive(tg, tt) {
      var span = tg.span, tau = ((tt % span) + span) % span, u = tau / span;
      var st0 = tg.strips[0], cx = st0.x + st0.w * u;
      reg(liveParts, "cursor", line(P(cx, st0.y), P(cx, tg.strips[2].y + tg.strips[2].h), "soft", 1, [3, 3], 0.7));
      tg.strips.forEach(function (st, i) {
        var d = TR[i], sc = traceScale(i), N = Math.max(2, Math.round(160 * u));
        var p = new ps.Path({ strokeColor: col(d.role), strokeWidth: 2.4, strokeCap: "round", strokeJoin: "round" });
        for (var k = 0; k <= N; k++) { var tk = tau * k / N; p.add(P(st.x + st.w * (tk / span), stripY(st, traceVal(i, tk), sc))); }
        if (i === 2 && S.gLine) { // the part of the a trace beyond −g (lift-off) turns red
          var red = null;
          for (var k2 = 0; k2 <= 160; k2++) {
            var t2 = span * k2 / 160, a2 = traceVal(2, t2);
            if (a2 < -G) { if (!red) red = new ps.Path({ strokeColor: col("danger"), strokeWidth: 3.2, strokeCap: "round" }); red.add(P(st.x + st.w * k2 / 160, stripY(st, a2, sc))); }
            else red = null;
          }
        }
        var val = traceVal(i, tau);
        new ps.Path.Circle({ center: P(cx, stripY(st, val, sc)), radius: 4.2, fillColor: col(d.role), strokeColor: col("bg"), strokeWidth: 1.5 });
        var g = new ps.Group([p]);
        reg(liveParts, d.id, g);
        if (S.labels) txt(P(st.x + st.w - 4, st.y + 12), sf(val, 3) + " " + d.unit, d.role, 10.5, "right", "bold");
      });
    }

    /* =========================================================== WHEEL */
    function wheelGeo() {
      var hw = S.graphs ? Math.round(H * 0.55) : H;
      var groundY = hw - 34, Rmax = Math.max(40, Math.min((groundY - 34) / 2 - 8, W * 0.34));
      var c = P(W / 2, groundY - Rmax - 18);
      return { hw: hw, groundY: groundY, Rmax: Rmax, c: c, R: Rmax * S.A / S.Amax, scale: Rmax / S.Amax,
        tg: S.graphs ? traceGeo({ x: 8, y: hw + 4, w: W - 16, h: H - hw - 8 }) : null };
    }
    var LUMP = [1.0, 0.82, 1.12, 0.9, 1.05, 0.78, 1.0, 0.95];
    function drawWheelBase() {
      var g = geo, c = g.c, R = g.R;
      // sun cue + rays
      var sun = P(22, 22);
      new ps.Path.Circle({ center: sun, radius: 7, fillColor: col("sun", 0.55) });
      for (var i = 0; i < 8; i++) { var an = i * PI / 4; line(sun.add(P(Math.cos(an), Math.sin(an)).multiply(10)), sun.add(P(Math.cos(an), Math.sin(an)).multiply(14)), "sun", 1.4, null, 0.55); }
      txt(P(40, 26), "sun overhead", "muted", 10);
      // ground, O and ±A ticks
      line(P(12, g.groundY), P(W - 12, g.groundY), "lineStrong", 2);
      for (var h = 16; h < W - 12; h += 12) line(P(h, g.groundY + 1), P(h - 6, g.groundY + 7), "line", 1);
      reg(parts, "centre", new ps.Group([line(P(c.x, g.groundY - 6), P(c.x, g.groundY + 6), "fg", 2), txt(P(c.x, g.groundY + 26), "O", "fg", 12, "center", "bold")]));
      [-1, 1].forEach(function (s) {
        line(P(c.x + s * R, g.groundY - 4), P(c.x + s * R, g.groundY + 4), "soft", 1.5);
        txt(P(c.x + s * R, g.groundY + 26), s < 0 ? "−A" : "+A", "soft", 11, "center");
      });
      // centre stand (okada parked on it)
      var foot = g.groundY;
      new ps.Path({ segments: [c.add(P(-6, 6)), P(c.x - 26, foot), P(c.x - 34, foot)], strokeColor: col("muted"), strokeWidth: 3, strokeJoin: "round" });
      new ps.Path({ segments: [c.add(P(6, 6)), P(c.x + 26, foot), P(c.x + 34, foot)], strokeColor: col("muted"), strokeWidth: 3, strokeJoin: "round" });
      // swing-arm towards the frame (context)
      line(c, P(c.x - Math.min(W * 0.45, g.Rmax * 1.9), c.y - g.Rmax * 0.35), "muted", 5, null, 0.6);
      // dashed vertical reference (ωt measured from the top)
      line(c, P(c.x, c.y - R - 12), "muted", 1, [3, 4]);
      txt(P(W - 10, 16), "A = " + fx(S.A, 2) + " m · T = " + fx(S.T, 1) + " s", "soft", 10.5, "right");
      if (g.tg) drawTracesBase(g.tg);
    }
    function drawWheelLive(tt) {
      var g = geo, c = g.c, R = g.R, w = omega(), th = w * tt, s = model.shm(S.A, S.T, th);
      var tw = Math.max(7, R * 0.17), rim = R - tw - 1.5;
      // tyre with rotating tread blocks
      var tyre = new ps.Path.Circle({ center: c, radius: R - tw / 2, strokeColor: col("tyre"), strokeWidth: tw });
      var outline = new ps.Path.Circle({ center: c, radius: R, strokeColor: col("muted", 0.8), strokeWidth: 1 });
      var inner = new ps.Path.Circle({ center: c, radius: R - tw, strokeColor: col("muted", 0.6), strokeWidth: 1 });
      var treads = new ps.Group(), nT = Math.max(16, Math.round(R / 3.2));
      for (var i = 0; i < nT; i++) {
        var an = th + i * 2 * PI / nT - PI / 2, d = P(Math.cos(an), Math.sin(an));
        treads.addChild(line(c.add(d.multiply(R - 1)), c.add(d.multiply(R - tw * 0.55)), "muted", Math.max(1.5, tw * 0.35), null, 0.55));
      }
      var rimC = new ps.Path.Circle({ center: c, radius: rim, strokeColor: col("soft"), strokeWidth: 2.4 });
      var spokes = new ps.Group(), hubR = Math.max(6, R * 0.13), nS = 18;
      for (var k = 0; k < nS; k++) {
        var a0 = th + k * 2 * PI / nS - PI / 2, off = (k % 2 ? 1 : -1) * 0.5;
        var p0 = c.add(P(Math.cos(a0 + off), Math.sin(a0 + off)).multiply(hubR * 0.8)), p1 = c.add(P(Math.cos(a0), Math.sin(a0)).multiply(rim));
        spokes.addChild(line(p0, p1, "muted", 1, null, 0.9));
      }
      var hub = new ps.Group([new ps.Path.Circle({ center: c, radius: hubR, fillColor: col("bg2"), strokeColor: col("soft"), strokeWidth: 2 }),
        new ps.Path.Circle({ center: c, radius: hubR * 0.38, fillColor: col("soft") })]);
      reg(liveParts, "wheel", new ps.Group([tyre, outline, inner, treads, rimC, spokes, hub]));
      // lump on the tyre: angle from the top, clockwise; x = A sin ωt
      var L = P(c.x + R * Math.sin(th), c.y - R * Math.cos(th));
      // projection (shadow ray)
      line(L, P(L.x, g.groundY), "sun", 1.2, [4, 4], 0.6);
      reg(liveParts, "radius", new ps.Group([line(c, L, "fg", 1.6), txt(c.add(L.subtract(c).multiply(0.55)).add(P(Math.cos(th) * 10, Math.sin(th) * 10)), "A", "fg", 11, "center", "bold")]));
      var a0d = -PI / 2, a1d = th - PI / 2, dd = wrap360(deg(th));
      var arcR = Math.max(16, R * 0.32);
      var angG = new ps.Group();
      if (dd > 0.5) angG.addChild(arc(c, arcR, a0d, a0d + dd * PI / 180, "lime", 2));
      var lm = a0d + (dd * PI / 180) / 2;
      angG.addChild(txt(c.add(P(Math.cos(lm), Math.sin(lm)).multiply(arcR + 14)).add(P(0, 4)), "ωt", "lime", 11, "center", "bold"));
      reg(liveParts, "angle", angG);
      var blob = new ps.Path({ closed: true, fillColor: col("mud"), strokeColor: col("bg", 0.6), strokeWidth: 1 }), lr = Math.max(5, R * 0.1);
      for (var b = 0; b < LUMP.length; b++) { var ab = th + b * 2 * PI / LUMP.length; blob.add(L.add(P(Math.cos(ab), Math.sin(ab)).multiply(lr * LUMP[b]))); }
      blob.smooth();
      reg(liveParts, "lump", blob);
      // shadow on the ground + arrows
      var Sx = c.x + s.x * g.scale, sy = g.groundY;
      reg(liveParts, "shadow", new ps.Path.Ellipse({ center: P(Sx, sy), radius: [7, 3.5], fillColor: col("bg"), strokeColor: col("fg"), strokeWidth: 1.5 }));
      var kv = 0.55 * g.Rmax / (PI * 0.30), ka = 0.42 * g.Rmax / (PI * PI * 0.30), lim = W / 2 - 14;
      var vl = clamp(s.v * kv, -lim, lim), al = clamp(s.a * ka, -lim, lim);
      reg(liveParts, "v-arrow", new ps.Group([arrow(P(Sx, sy - 13), P(Sx + vl, sy - 13), "v", 3), txt(P(Sx + vl + (vl >= 0 ? 6 : -6), sy - 9), "v", "v", 12, vl >= 0 ? "left" : "right", "bold")]));
      reg(liveParts, "a-arrow", new ps.Group([arrow(P(Sx, sy + 11), P(Sx + al, sy + 11), "a", 3), txt(P(Sx + al + (al >= 0 ? 6 : -6), sy + 15), "a", "a", 12, al >= 0 ? "left" : "right", "bold")]));
      if (S.labels) txt(P(10, 46), "ωt = " + Math.round(dd) + "°", "lime", 11, "left", "bold");
      if (S.labels) txt(P(10, 60), "x = " + sf(s.x, 3) + " m", "x", 11, "left", "bold");
      if (g.tg) drawTracesLive(g.tg, tt);
    }

    /* =========================================================== CIRCLE + GRAPHS */
    function circleGeo() {
      var side = Math.min(H - 40, W * 0.40), Rmax = side / 2 - 8;
      var c = P(10 + side / 2, H / 2 + 6);
      return { side: side, c: c, Rmax: Rmax, R: Rmax * S.A / (S.Amax || S.A), tg: traceGeo({ x: side + 18, y: 22, w: W - side - 24, h: H - 30 }) };
    }
    function drawCircleBase() {
      var g = geo, c = g.c, R = g.R;
      reg(parts, "circle", new ps.Path.Circle({ center: c, radius: R, strokeColor: col("soft", 0.8), strokeWidth: 1.6 }));
      line(P(c.x, c.y - g.Rmax - 4), P(c.x, c.y + g.Rmax + 4), "lineStrong", 1.2);
      line(P(c.x - g.Rmax - 4, c.y), P(c.x + g.Rmax + 4, c.y), "line", 1, [3, 3]);
      reg(parts, "centre", new ps.Group([new ps.Path.Circle({ center: c, radius: 2.6, fillColor: col("fg") }), txt(c.add(P(-7, 15)), "O", "fg", 11, "right", "bold")]));
      txt(P(10, 16), S.preset === "okada" ? "okada: ω = " + fx(omega(), 2) + " rad/s" : "A = " + fx(S.A, 2) + " m · T = " + fx(S.T, 1) + " s", "soft", 10.5);
      drawTracesBase(g.tg);
    }
    function drawCircleLive(tt) {
      var g = geo, c = g.c, R = g.R, th = omega() * tt, s = model.shm(S.A, S.T, th);
      var Pp = P(c.x + R * Math.cos(th), c.y - R * Math.sin(th)), N = P(c.x, Pp.y);
      reg(liveParts, "radius", line(c, Pp, "fg", 1.5));
      var dd = wrap360(deg(th)), angG = new ps.Group();
      if (dd > 0.5) angG.addChild(arc(c, Math.max(12, R * 0.3), 0, -dd * PI / 180, "lime", 2));
      angG.addChild(txt(c.add(P(Math.max(12, R * 0.3) + 6, -6)), "ωt", "lime", 10.5, "left", "bold"));
      reg(liveParts, "angle", angG);
      line(Pp, N, "soft", 1.2, [3, 3], 0.8);
      // the point's own velocity and centripetal acceleration (faint) — their vertical parts are the shadow's
      var kv = 0.5 * g.Rmax / (omega() * (S.Amax || S.A)), ka = 0.42 * g.Rmax / (omega() * omega() * (S.Amax || S.A));
      arrow(Pp, Pp.add(P(-Math.sin(th), -Math.cos(th)).multiply(omega() * S.A * kv)), "v", 1.6, [4, 3], 0.45);
      arrow(Pp, Pp.add(c.subtract(Pp).normalize().multiply(omega() * omega() * S.A * ka)), "a", 1.6, [4, 3], 0.45);
      reg(liveParts, "point", new ps.Path.Circle({ center: Pp, radius: 5.5, fillColor: col("fg"), strokeColor: col("bg"), strokeWidth: 1.5 }));
      reg(liveParts, "shadow", new ps.Path.Circle({ center: N, radius: 5, fillColor: col("x"), strokeColor: col("bg"), strokeWidth: 1.5 }));
      var vy = -s.v * kv, ay = -s.a * ka;
      reg(liveParts, "v-arrow", arrow(N.add(P(-9, 0)), N.add(P(-9, vy)), "v", 2.6));
      reg(liveParts, "a-arrow", arrow(N.add(P(9, 0)), N.add(P(9, ay)), "a", 2.6));
      if (S.labels) {
        var y0 = H - 6;
        var aTxt = S.gLine ? "aₘₐₓ = " + fx(s.a_max, 1) + (s.a_max >= G ? " > g" : " < g") : "ωt = " + Math.round(dd) + "°";
        txt(P(10, y0), aTxt, S.gLine && s.a_max >= G ? "danger" : "fg", 10.5, "left", "bold");
        if (S.gLine) txt(P(10, y0 - 14), "A = " + fx(S.A * 100, 1) + " cm", "soft", 10.5);
      }
      drawTracesLive(g.tg, tt);
    }
    function graphsGeo() { return { tg: traceGeo({ x: 8, y: 22, w: W - 16, h: H - 26 }) }; }
    function drawGraphsBase() {
      txt(P(10, 15), "x, v, a against t", "soft", 10.5);
      drawTracesBase(geo.tg);
    }
    function drawGraphsLive(tt) {
      drawTracesLive(geo.tg, tt);
      if (S.gLine && S.labels) { var s = model.shm(S.A, S.T, 0); txt(P(W - 10, 15), "A " + fx(S.A * 100, 1) + " cm · aₘₐₓ " + fx(s.a_max, 1), s.a_max >= G ? "danger" : "fg", 10.5, "right", "bold"); }
    }

    /* =========================================================== ENERGY */
    function energyGeo() {
      var trackH = 66, rest = H - trackH - 8, both = S.view === "both";
      var pxH = both ? Math.round(rest * 0.52) : rest, ptH = both ? rest - pxH : rest;
      var g = { track: { x: 10, y: 4, w: W - 20, h: trackH } };
      if (S.view !== "t") g.px = { x: 46, y: trackH + 12, w: W - 58, h: pxH - 30 };
      if (S.view !== "x") g.pt = { x: 46, y: trackH + 12 + (S.view === "both" ? pxH : 0), w: W - 58, h: ptH - 30 };
      return g;
    }
    function eModel() { return model.energy(S.k, S.m, S.A, 0); }
    function plotFrame(r, xr, yr, xl, yl, xt, xtl) {
      var X = function (x) { return r.x + (x - xr[0]) / (xr[1] - xr[0]) * r.w; }, Y = function (y) { return r.y + r.h - (y - yr[0]) / (yr[1] - yr[0]) * r.h; };
      axisBox(r);
      (xt || []).forEach(function (v, i) { line(P(X(v), r.y), P(X(v), r.y + r.h), "line", 1); txt(P(X(v), r.y + r.h + 12), xtl ? xtl[i] : String(v), "muted", 9.5, "center"); });
      txt(P(r.x + r.w, r.y + r.h + 24), xl, "soft", 10, "right");
      var yy = txt(P(0, 0), yl, "soft", 10, "center"); yy.rotate(-90); yy.position = P(r.x - 34, r.y + r.h / 2);
      return { X: X, Y: Y, r: r };
    }
    function drawEnergyBase() {
      var g = geo, e = eModel(), E = e.E, tr = g.track;
      // track: wall, frictionless rail, O and ±A
      var cx = tr.x + tr.w * 0.58, Rp = Math.min(tr.w * 0.3, 110);
      g.cx = cx; g.Rp = Rp; g.railY = tr.y + tr.h - 14;
      var wallX = tr.x + 4;
      line(P(wallX, tr.y + 6), P(wallX, g.railY + 4), "soft", 3);
      for (var h = tr.y + 10; h < g.railY; h += 8) line(P(wallX, h), P(wallX - 6, h + 6), "line", 1);
      reg(parts, "track", line(P(wallX, g.railY + 2), P(tr.x + tr.w, g.railY + 2), "lineStrong", 2));
      [[-1, "−A"], [0, "O"], [1, "+A"]].forEach(function (m) { line(P(cx + m[0] * Rp, g.railY - 2), P(cx + m[0] * Rp, g.railY + 6), "soft", 1.4); txt(P(cx + m[0] * Rp, g.railY + 16), m[1], m[0] ? "soft" : "fg", 10, "center", "bold"); });
      txt(P(tr.x + tr.w, tr.y + 12), "E = ½kA² = " + fx(E, 3) + " J", "fg", 10.5, "right", "bold");
      g.wallX = wallX;
      if (g.px) {
        var m = plotFrame(g.px, [-S.A, S.A], [0, E * 1.18], "x / m", "energy / J", [-S.A, -S.A / 2, 0, S.A / 2, S.A], [fx(-S.A, 2), fx(-S.A / 2, 3), "0", fx(S.A / 2, 3), fx(S.A, 2)]);
        g.mx = m;
        var pe = new ps.Path({ strokeColor: col("a"), strokeWidth: 2.6 }), ke = new ps.Path({ strokeColor: col("v"), strokeWidth: 2.6 });
        for (var i = 0; i <= 120; i++) { var x = -S.A + 2 * S.A * i / 120, en = model.energy(S.k, S.m, S.A, x); pe.add(P(m.X(x), m.Y(en.PE))); ke.add(P(m.X(x), m.Y(en.KE))); }
        reg(parts, "pe-curve", pe); reg(parts, "ke-curve", ke);
        reg(parts, "total-line", line(P(m.X(-S.A), m.Y(E)), P(m.X(S.A), m.Y(E)), "soft", 1.6, [6, 4]));
        var xo = e.x_equal, cg = new ps.Group();
        [-xo, xo].forEach(function (x) { cg.addChild(line(P(m.X(x), m.Y(0)), P(m.X(x), m.Y(E / 2)), "accent2", 1.1, [3, 3])); });
        cg.addChild(txt(P(m.X(xo) + 3, m.Y(E / 2) - 5), "KE = PE", "accent2", 9.5, "left"));
        reg(parts, "crossover", cg);
        txt(P(g.px.x + 4, g.px.y + 11), "PE", "a", 10.5, "left", "bold"); txt(P(g.px.x + 26, g.px.y + 11), "KE", "v", 10.5, "left", "bold"); txt(P(g.px.x + 48, g.px.y + 11), "total", "soft", 10.5, "left");
      }
      if (g.pt) {
        var T = 2 * PI / e.w, span = 2 * T;
        var mt = plotFrame(g.pt, [0, span], [0, E * 1.18], "t / s", "energy / J", [0, span / 4, span / 2, 3 * span / 4, span], [0, span / 4, span / 2, 3 * span / 4, span].map(function (v) { return fx(v, 2); }));
        g.mt = mt; g.span = span;
        var pt = new ps.Path({ strokeColor: col("a", 0.35), strokeWidth: 1.4 }), kt = new ps.Path({ strokeColor: col("v", 0.35), strokeWidth: 1.4 });
        for (var j = 0; j <= 160; j++) { var tt = span * j / 160, x2 = S.A * Math.sin(e.w * tt), en2 = model.energy(S.k, S.m, S.A, x2); pt.add(P(mt.X(tt), mt.Y(en2.PE))); kt.add(P(mt.X(tt), mt.Y(en2.KE))); }
        line(P(mt.X(0), mt.Y(E)), P(mt.X(span), mt.Y(E)), "soft", 1.4, [6, 4]);
      }
    }
    function drawEnergyLive(tt) {
      var g = geo, e = eModel(), w = e.w, x = S.A * Math.sin(w * tt), en = model.energy(S.k, S.m, S.A, x);
      var bx = g.cx + x / S.A * g.Rp, by = g.railY, bw = 34, bh = 26;
      // spring zigzag wall → block
      var sp = new ps.Path({ strokeColor: col("soft"), strokeWidth: 1.8, strokeJoin: "round" }), x0 = g.wallX + 2, x1 = bx - bw / 2, cy = by - bh / 2, nz = 14;
      sp.add(P(x0, cy)); sp.add(P(x0 + 8, cy));
      for (var i = 1; i < nz; i++) sp.add(P(x0 + 8 + (x1 - x0 - 16) * i / nz, cy + (i % 2 ? -8 : 8)));
      sp.add(P(x1 - 8, cy)); sp.add(P(x1, cy));
      reg(liveParts, "spring", sp);
      reg(liveParts, "mass", new ps.Group([new ps.Path.Rectangle({ rectangle: new ps.Rectangle(bx - bw / 2, by - bh, bw, bh), radius: 4, fillColor: col("bg2"), strokeColor: col("fg"), strokeWidth: 1.6 }), txt(P(bx, by - bh / 2 + 4), "m", "fg", 11, "center", "bold")]));
      // bars (mini) above the block: KE / PE share of E
      var barW = 46, bxl = bx - barW / 2, byy = by - bh - 10;
      new ps.Path.Rectangle({ rectangle: new ps.Rectangle(bxl, byy, barW * en.PE / en.E, 5), fillColor: col("a") });
      new ps.Path.Rectangle({ rectangle: new ps.Rectangle(bxl + barW * en.PE / en.E, byy, barW * en.KE / en.E, 5), fillColor: col("v") });
      if (g.mx) {
        var m = g.mx;
        reg(liveParts, "cursor", line(P(m.X(x), m.r.y), P(m.X(x), m.r.y + m.r.h), "fg", 1, [3, 3], 0.6));
        new ps.Path.Circle({ center: P(m.X(x), m.Y(en.PE)), radius: 5, fillColor: col("a"), strokeColor: col("bg"), strokeWidth: 1.5 });
        new ps.Path.Circle({ center: P(m.X(x), m.Y(en.KE)), radius: 5, fillColor: col("v"), strokeColor: col("bg"), strokeWidth: 1.5 });
        if (S.labels) txt(P(m.r.x + m.r.w - 4, m.r.y + 11), "PE " + fx(en.PE, 3) + " + KE " + fx(en.KE, 3) + " = " + fx(en.sum, 3) + " J", "fg", 9.5, "right", "bold");
      }
      if (g.mt) {
        var mt = g.mt, tau = ((tt % g.span) + g.span) % g.span, N = Math.max(2, Math.round(160 * tau / g.span));
        var pp = new ps.Path({ strokeColor: col("a"), strokeWidth: 2.4 }), kp = new ps.Path({ strokeColor: col("v"), strokeWidth: 2.4 });
        for (var j = 0; j <= N; j++) { var tj = tau * j / N, xj = S.A * Math.sin(w * tj), ej = model.energy(S.k, S.m, S.A, xj); pp.add(P(mt.X(tj), mt.Y(ej.PE))); kp.add(P(mt.X(tj), mt.Y(ej.KE))); }
        reg(liveParts, "pe-t", pp); reg(liveParts, "ke-t", kp);
        line(P(mt.X(tau), mt.r.y), P(mt.X(tau), mt.r.y + mt.r.h), "fg", 1, [3, 3], 0.5);
      }
    }

    /* =========================================================== DAMPING TRACE */
    function dampSet() { return DAMP_SETS[S.set] || DAMP_SETS.kinds; }
    function dampKeys() { var ds = dampSet(), ks = Object.keys(ds); return S.show && S.show.length ? ks.filter(function (k) { return S.show.indexOf(k) >= 0; }) : ks; }
    function dampW0() { return S.set === "shock" ? Math.sqrt(OKADA.k / (S.load_kg || OKADA.mass)) : 2 * PI / S.T; }
    function dampSpan() { return S.tEnd || (S.set === "shock" ? (S.forced ? 5.0 : 3.0) : 4 * S.T); }
    var forcedCache = {};
    function dampSeries(key) {
      var z = dampSet()[key].zeta, w0 = dampW0(), span = dampSpan();
      if (S.set === "shock" && S.forced) {
        var ck = key + ":" + w0 + ":" + span;
        if (!forcedCache[ck]) forcedCache[ck] = model.forced(z, w0, OKADA.Y, span, null, 2000);
        return function (t) { var arr = forcedCache[ck], i = clamp(Math.round(t / span * 2000), 0, 2000); return arr[i][1] * 100; };
      }
      var A0 = S.set === "shock" ? S.A0 * 100 : 1;
      return function (t) { return model.decay(z, w0, t, A0); };
    }
    function dampYR() { return S.set === "shock" ? (S.forced ? [-12, 12] : [-S.A0 * 120, S.A0 * 120]) : [-1.15, 1.15]; }
    function dampGeo() { return { r: { x: 44, y: 34, w: W - 54, h: H - 74 } }; }
    function drawDampBase() {
      var g = geo, span = dampSpan(), yr = dampYR();
      var stp = span <= 1.2 ? 0.25 : span <= 3.2 ? 0.5 : 1, tks = [];
      for (var tv = 0; tv <= span + 1e-9; tv += stp) tks.push(tv);
      var m = plotFrame(g.r, [0, span], yr, "t / s", S.set === "shock" ? "x / cm" : "x ÷ A₀", tks, tks.map(function (v) { return fx(v, stp < 0.5 ? 2 : 1); }));
      g.m = m;
      line(P(g.r.x, m.Y(0)), P(g.r.x + g.r.w, m.Y(0)), "lineStrong", 1.2);
      (S.set === "shock" ? (S.forced ? [-10, -5, 0, 5, 10] : [-5, -2.5, 0, 2.5, 5].map(function (v) { return v * S.A0 / 0.05; })) : [-1, -0.5, 0, 0.5, 1]).forEach(function (v) {
        line(P(g.r.x, m.Y(v)), P(g.r.x + g.r.w, m.Y(v)), "line", 1);
        txt(P(g.r.x - 4, m.Y(v) + 3), minus(String(+v.toFixed(2))), "muted", 9, "right");
      });
      if (S.set === "shock" && S.forced) {
        var thr = model.threshold(dampW0() / (2 * PI)) * 100;
        reg(parts, "lift-line", new ps.Group([line(P(g.r.x, m.Y(thr)), P(g.r.x + g.r.w, m.Y(thr)), "danger", 1.3, [6, 4]), line(P(g.r.x, m.Y(-thr)), P(g.r.x + g.r.w, m.Y(-thr)), "danger", 1, [6, 4], 0.5),
          txt(P(g.r.x + 4, m.Y(thr) - 4), "lift-off " + fx(thr, 1) + " cm", "danger", 9.5, "left", "bold")]));
      }
      var env = new ps.Group(), legX = g.r.x - 30;
      dampKeys().forEach(function (k, i) {
        var d = dampSet()[k], fn = dampSeries(k), gp = new ps.Path({ strokeColor: col(d.role, 0.22), strokeWidth: 1.3 });
        for (var j = 0; j <= 240; j++) { var tj = span * j / 240; gp.add(P(m.X(tj), m.Y(fn(tj)))); }
        if (d.zeta < 1 && !(S.set === "shock" && S.forced)) {
          var A0 = S.set === "shock" ? S.A0 * 100 : 1, w0 = dampW0();
          [1, -1].forEach(function (sg) { var ep = new ps.Path({ strokeColor: col(d.role, 0.45), strokeWidth: 1, dashArray: [2, 4] }); for (var q = 0; q <= 60; q++) { var tq = span * q / 60; ep.add(P(m.X(tq), m.Y(sg * model.envelope(d.zeta, w0, tq, A0)))); } env.addChild(ep); });
        }
        var lg = txt(P(legX, 18), "— " + d.label, d.role, 10.5, "left", "bold"); legX = lg.bounds.right + 12;
      });
      if (env.children.length) reg(parts, "envelope", env);
      if (S.set === "shock" && S.forced) txt(P(W - 8, 30), "ten pushes at f₀ (Y = 1 cm)", "muted", 9.5, "right");
    }
    function drawDampLive(tt) {
      var g = geo, m = g.m, span = dampSpan(), loop = span * 1.18, tau = ((tt % loop) + loop) % loop, tc = Math.min(tau, span);
      var N = Math.max(2, Math.round(240 * tc / span));
      dampKeys().forEach(function (k) {
        var d = dampSet()[k], fn = dampSeries(k), p = new ps.Path({ strokeColor: col(d.role), strokeWidth: 2.6, strokeJoin: "round" });
        for (var j = 0; j <= N; j++) { var tj = tc * j / N; p.add(P(m.X(tj), m.Y(fn(tj)))); }
        reg(liveParts, k, p);
        new ps.Path.Circle({ center: P(m.X(tc), m.Y(fn(tc))), radius: 4.5, fillColor: col(d.role), strokeColor: col("bg"), strokeWidth: 1.5 });
      });
      reg(liveParts, "pen", line(P(m.X(tc), g.r.y), P(m.X(tc), g.r.y + g.r.h), "fg", 1, [3, 3], 0.45));
    }

    /* =========================================================== RESONANCE */
    function resGeo() { var top = Math.round(42 * FS); return { r: { x: 40, y: top, w: W - 40 - 44, h: H - top - 40 }, xr: [0, 4], yr: [0, 12] }; }
    function resModel(speed) { return model.okada(speed == null ? S.speed_kmh : speed, S.load_kg, S.zeta, { k: S.kSpring, d: S.d, Y: S.Y }); }
    function drawResBase() {
      var g = geo, r = g.r, mo = resModel(), f0 = mo.f0;
      var X = function (f) { return r.x + (f - g.xr[0]) / (g.xr[1] - g.xr[0]) * r.w; }, Y = function (a) { return r.y + r.h - clamp(a, g.yr[0], g.yr[1] * 1.04) / g.yr[1] * r.h; };
      g.X = X; g.Y = Y;
      axisBox(r);
      [0, 2, 4, 6, 8, 10, 12].forEach(function (v) { line(P(r.x, Y(v)), P(r.x + r.w, Y(v)), "line", 1); txt(P(r.x - 5, Y(v) + 3.5), String(v), "muted", 9.5, "right"); });
      [0, 1, 2, 3, 4].forEach(function (f) { line(P(X(f), r.y), P(X(f), r.y + r.h), "line", 1); txt(P(X(f), r.y + r.h + 12), String(f), "muted", 9.5, "center"); txt(P(X(f), r.y - 5), fx(f * S.d * 3.6, 0), "muted", 9, "center"); });
      txt(P(r.x + r.w, r.y + r.h + 25), "driving f / Hz", "soft", 10, "right");
      txt(P(r.x, r.y - 17), "speed / km h⁻¹", "soft", 9.5, "left");
      var yl = txt(P(0, 0), "amplitude A / cm", "soft", 10, "center"); yl.rotate(-90); yl.position = P(r.x - 28, r.y + r.h / 2);
      function curve(z, role, w, alpha, dash) {
        var p = new ps.Path({ strokeColor: col(role, alpha), strokeWidth: w, strokeJoin: "round" });
        if (dash) p.dashArray = dash;
        for (var i = 1; i <= 800; i++) { var f = g.xr[1] * i / 800, a = model.response(f, f0, z, S.Y) * 100; p.add(P(X(f), Y(a))); }
        return p;
      }
      var showRef = Math.abs(S.zeta - 0.05) > 1e-6, showRef2 = Math.abs(S.zeta - 0.30) > 1e-6;
      if (showRef) reg(parts, "leaking", curve(0.05, "pink", 1.5, 0.55, [5, 3]));
      if (showRef2) reg(parts, "healthy", curve(0.30, "v", 1.5, 0.55, [5, 3]));
      var liveRole = !showRef ? "pink" : !showRef2 ? "v" : "a";
      var main = curve(S.zeta, liveRole, 3, 1);
      reg(parts, "curve", main);
      if (!showRef) parts.leaking = main;
      if (!showRef2) parts.healthy = main;
      // danger: where the live curve is above the threshold
      var dg = new ps.Group(), seg = null;
      for (var i = 1; i <= 800; i++) {
        var f = g.xr[1] * i / 800, a = model.response(f, f0, S.zeta, S.Y), th = model.threshold(f);
        if (a >= th) { if (!seg) { seg = new ps.Path({ strokeColor: col("danger"), strokeWidth: 4, strokeCap: "round", strokeJoin: "round" }); dg.addChild(seg); } seg.add(P(X(f), Y(a * 100))); } else seg = null;
      }
      if (dg.children.length) reg(parts, "danger", dg);
      // lift-off threshold g/(2πf)²
      var tp = new ps.Path({ strokeColor: col("danger"), strokeWidth: 1.8, dashArray: [6, 4] }), started = false;
      for (var j = 1; j <= 300; j++) { var fj = g.xr[1] * j / 300, tj = model.threshold(fj) * 100; if (tj > g.yr[1] * 1.04) continue; tp.add(P(X(fj), Y(tj))); started = true; }
      if (started) { reg(parts, "threshold", tp); txt(P(X(2.45), Y(model.threshold(2.45) * 100) - 8), "lift-off threshold", "danger", 9.5, "left", "bold"); }
      // f₀
      reg(parts, "f0-line", new ps.Group([line(P(X(f0), r.y), P(X(f0), r.y + r.h), "x", 1.2, [4, 4]), txt(P(X(f0) + 4, r.y + r.h - 6), "f₀ = " + fx(f0, 2) + " Hz", "x", 9.5, "left", "bold")]));
      // peak marker
      var pk = model.peak(f0, S.zeta, S.Y);
      var tri = new ps.Path.RegularPolygon({ center: P(X(pk.f), Y(pk.A * 100) - 9), sides: 3, radius: 4.5, fillColor: col(liveRole) });
      tri.rotate(180);
      reg(parts, "peak", new ps.Group([tri,
        txt(P(X(pk.f) + 10, Math.max(r.y + 50, Y(pk.A * 100) - 12)), "at f₀ " + fx(model.response(f0, f0, S.zeta, S.Y) * 100, 1) + " cm", liveRole, 9.5, "left", "bold")]));
      // legend
      txt(P(r.x + 2, 13 * FS), "ζ = " + fx(S.zeta, 2) + (S.zeta <= 0.06 ? " leaking" : S.zeta >= 0.29 ? " healthy" : "") + " · " + S.load_kg + " kg", liveRole, 10.5, "left", "bold");
      // gauge rail
      var gx = r.x + r.w + 24, gc = r.y + r.h / 2, gs = (r.h / 2 - 4) / 12;
      g.gauge = { x: gx, c: gc, s: gs };
      line(P(gx, r.y + 2), P(gx, r.y + r.h - 2), "lineStrong", 2);
      var cl = txt(P(0, 0), "carrier", "muted", 8.5, "center"); cl.rotate(-90); cl.position = P(gx + 13, r.y + 26);
    }
    function drawResLive(tt) {
      var g = geo, mo = resModel(), X = g.X, Y = g.Y, Acm = mo.A * 100, thc = mo.th * 100, lift = mo.lift;
      var pt = P(X(mo.f), Y(Acm)), role = lift ? "danger" : "fg";
      var pulse = 1 + 0.18 * Math.sin(tt * 6);
      var grp = new ps.Group([line(P(pt.x, pt.y), P(pt.x, g.r.y + g.r.h), role, 1, [3, 3], 0.7),
        new ps.Path.Circle({ center: pt, radius: 6.5 * pulse, fillColor: col(role), strokeColor: col("bg"), strokeWidth: 2 })]);
      reg(liveParts, "point", grp);
      if (S.labels) {
        pill(P(g.r.x + 8, g.r.y + 15), fx(mo.speed_kmh, 1) + " km/h → A " + fx(Acm, 1) + " cm", role, 10, "left");
        if (lift) pill(P(g.r.x + 8, g.r.y + 35), "crates lift off", "danger", 10, "left");
      }
      // carrier gauge: y = A sin(2πft), threshold ticks ±g/ω²
      var ga = g.gauge, yv = Acm * Math.sin(2 * PI * mo.f * tt), cy = ga.c - clamp(yv, -12.5, 12.5) * ga.s;
      var tk = new ps.Group();
      if (thc < 13) [1, -1].forEach(function (s) { tk.addChild(line(P(ga.x - 7, ga.c - s * thc * ga.s), P(ga.x + 7, ga.c - s * thc * ga.s), "danger", 2)); });
      tk.addChild(new ps.Path.Rectangle({ rectangle: new ps.Rectangle(ga.x - 8, cy - 5, 16, 10), radius: 2, fillColor: col(lift && Math.abs(yv) >= thc ? "danger" : "brass"), strokeColor: col("bg"), strokeWidth: 1 }));
      reg(liveParts, "gauge", tk);
    }

    /* =========================================================== PENDULUM FORCES */
    function pfGeo() {
      // fit the widest case for this θ₀ with the 100 g arrows, so the 50 g ↔ 100 g swap keeps one scale
      var th0 = Math.min(45, Math.abs(S.theta_deg)) * PI / 180, need = Math.sin(th0) + 0.62 * Math.cos(th0) * Math.sin(th0) + 0.02;
      var Lp = Math.max(80, Math.min((H - 78) / 1.62, (W / 2 - (th0 >= 28 * PI / 180 ? 40 : 72)) / need));
      return { pivot: P(W / 2, 26), Lp: Lp };
    }
    function pfTheta(tt) {
      if (!playing && !dragging) return S.theta_deg;
      var w = Math.sqrt(S.g / S.l);
      return S.theta_deg * Math.cos(w * tt);
    }
    function drawPfBase() {
      var g = geo, pv = g.pivot, Lp = g.Lp;
      // support + pivot
      line(P(pv.x - 46, pv.y - 6), P(pv.x + 46, pv.y - 6), "soft", 3);
      for (var h = pv.x - 44; h < pv.x + 46; h += 8) line(P(h, pv.y - 7), P(h + 6, pv.y - 13), "line", 1);
      reg(parts, "pivot", new ps.Path.Circle({ center: pv, radius: 3.5, fillColor: col("fg") }));
      line(pv, P(pv.x, pv.y + Lp + 26), "muted", 1, [4, 4]);
      var a0 = PI / 2 + S.theta_deg * PI / 180, a1 = PI / 2 - S.theta_deg * PI / 180;
      arc(pv, Lp, a0, a1, "muted", 1, [2, 4], 0.8);
      txt(P(pv.x, pv.y + Lp + 38), "lowest point", "muted", 9, "center");
    }
    function drawPfLive(tt) {
      var g = geo, pv = g.pivot, Lp = g.Lp, thd = pfTheta(tt), mo = model.pendulum(thd, S.mass_g / 1000, S.l, S.g, S.theta_deg);
      var th = mo.theta_rad, u = P(Math.sin(th), Math.cos(th)), B = pv.add(u.multiply(Lp));
      var fScale = 0.62 * Lp / (0.100 * 9.8), aScale = 0.50 * Lp / 9.8, br = 10, sg = th >= 0 ? 1 : -1;
      // x/l triangle
      var F = P(pv.x, B.y);
      var tri = new ps.Path({ segments: [pv, F, B], closed: true, fillColor: col("accent2", 0.14), strokeColor: col("accent2", 0.7), strokeWidth: 1 });
      var triG = new ps.Group([tri]);
      if (Math.abs(B.x - F.x) > 14) {
        triG.addChild(txt(P(F.x * 0.62 + B.x * 0.38, F.y - 6), "x", "accent2", 11, "center", "bold"));
      }
      triG.addChild(txt(pv.add(u.multiply(Lp * 0.42)).add(P(u.y * 10 * (th >= 0 ? 1 : -1), -u.x * 10 * (th >= 0 ? 1 : -1))).add(P(th >= 0 ? 4 : -4, 0)), "l", "accent2", 12, th >= 0 ? "left" : "right", "bold"));
      reg(liveParts, "triangle", triG);
      reg(liveParts, "thread", line(pv, B, "fg", 1.6));
      var angG = new ps.Group();
      if (Math.abs(thd) > 0.3) angG.addChild(arc(pv, Math.min(46, Lp * 0.24), PI / 2, PI / 2 - th, "lime", 2));
      angG.addChild(txt(pv.add(P(Math.sin(th / 2), Math.cos(th / 2)).multiply(Math.min(46, Lp * 0.24) + 12)).add(P(0, 4)), "θ", "lime", 12, "center", "bold"));
      reg(liveParts, "angle", angG);
      // bob (brass 100 g / wood 50 g, same size)
      var brass = S.mass_g >= 100, bc = col(brass ? "brass" : "wood");
      var bob = new ps.Path.Circle({ center: B, radius: br, strokeColor: col("bg"), strokeWidth: 1.5 });
      bob.fillColor = { gradient: { stops: [[col("fg"), 0], [bc, 0.35], [col(brass ? "mud" : "muted"), 1]], radial: true }, origin: B.add(P(-br * 0.4, -br * 0.4)), destination: B.add(P(br, br)) };
      reg(liveParts, "bob", new ps.Group([bob, txt(B.add(P(sg * (br + 5), 4)), S.mass_g + " g", "soft", 9.5, sg > 0 ? "left" : "right")]));
      // forces from the bob centre
      var mg = P(0, mo.mg * fScale), tn = P(-u.x, -u.y).multiply(mo.tension * fScale);
      var cosV = u.multiply(mo.mg_cos * fScale), tH = P(Math.cos(th), -Math.sin(th)), sinV = tH.multiply(-mo.mg_sin * fScale);
      // parallelogram construction lines
      line(B.add(mg), B.add(cosV), "muted", 1, [2, 3], 0.8); line(B.add(mg), B.add(sinV), "muted", 1, [2, 3], 0.8);
      reg(liveParts, "tension", new ps.Group([arrow(B, B.add(tn), "x", 2.6), txt(B.add(tn.multiply(0.6)).add(P(th >= 0 ? 9 : -9, 0)), "T", "x", 12, th >= 0 ? "left" : "right", "bold")]));
      reg(liveParts, "mg-cos", new ps.Group([arrow(B, B.add(cosV), "accent2", 2.2, [5, 3]), (Math.abs(thd) >= 28 ? txt(B.add(cosV).add(P(sg * 4, 18)), "mg cos θ", "accent2", 10, "center", "bold") : txt(B.add(cosV).add(u.multiply(12)).add(P(sg * 4, 4)), "mg cos θ", "accent2", 10, sg > 0 ? "left" : "right", "bold"))]));
      reg(liveParts, "mg-sin", new ps.Group([arrow(B, B.add(sinV), "a", 2.8), txt(B.add(sinV).add(P(-sg * 5, 14)), "mg sin θ", "a", 10, sg > 0 ? "right" : "left", "bold")]));
      reg(liveParts, "mg", new ps.Group([arrow(B, B.add(mg), "pink", 2.8), txt(B.add(mg).add(P(0, 14)), "mg", "pink", 11, "center", "bold")]));
      // acceleration g sin θ (independent of mass), drawn just outside the bob along the tangent
      // acceleration a = g sin θ along the arc: an inset in the free lower-left corner, same scale for every mass
      var aV = tH.multiply(-mo.a * aScale), aO = P(Math.max(86, 0.5 * Lp * 0.75 + 24), H - 66);
      reg(liveParts, "a-arrow", new ps.Group([new ps.Path.Circle({ center: aO, radius: 5, strokeColor: col("lime"), strokeWidth: 1.5 }), arrow(aO, aO.add(aV), "lime", 2.6),
        txt(aO.add(P(sg > 0 ? 10 : -10, -10)), "a = g sin θ", "lime", 10, sg > 0 ? "left" : "right", "bold"),
        txt(aO.add(P(sg > 0 ? 10 : -10, 4)), "same for 50 g and 100 g", "muted", 9, sg > 0 ? "left" : "right")]));
      if (S.labels) {
        var y0 = H - 22, x0 = 10;
        txt(P(x0, y0), "θ = " + fx(Math.abs(thd), 1) + "° = " + fx(Math.abs(th), 3) + " rad · sin θ = x/l = " + fx(Math.abs(mo.sin), 3), "accent2", 10, "left", "bold");
        txt(P(x0, y0 + 14), "mg sin θ = " + fx(Math.abs(mo.mg_sin), 3) + " N · a = " + fx(Math.abs(mo.a), 2) + " m/s²", "fg", 10, "left", "bold");
      }
    }

    /* =========================================================== PHASE STRIP */
    function psGeo() {
      var Ap = Math.min(W * 0.36, 150), Lp = Math.max(60, Math.min(H * 0.48, 220, H - 16 - 30 - 70 - 50 * FS)), pv = P(W / 2, 16); // leave rows for strip, cycle bar and caption
      if (Ap / Lp > 0.75) Ap = Lp * 0.75;
      var th0 = Math.asin(Ap / Lp), stripY = pv.y + Lp + 30;
      return { Ap: Ap, Lp: Lp, pv: pv, th0: th0, stripY: stripY, barY: stripY + 70, capY: stripY + 70 + 24 * FS + 22 * FS };
    }
    var FR = [["0", -1], ["¼", 0], ["½", 1], ["¾", 0], ["1", -1]];
    function drawPsBase() {
      var g = geo, cx = g.pv.x, y = g.stripY;
      line(P(cx - 50, g.pv.y - 6), P(cx + 50, g.pv.y - 6), "soft", 3);
      arc(g.pv, g.Lp, PI / 2 + g.th0, PI / 2 - g.th0, "muted", 1, [2, 4]);
      line(P(cx - g.Ap - 16, y), P(cx + g.Ap + 16, y), "lineStrong", 2);
      [["A", -1], ["O", 0], ["B", 1]].forEach(function (m) {
        reg(parts, m[0], new ps.Group([line(P(cx + m[1] * g.Ap, y - 7), P(cx + m[1] * g.Ap, y + 7), "fg", 2), txt(P(cx + m[1] * g.Ap, y + 22), m[0], "fg", 13, "center", "bold")]));
      });
      var ry = y + 36;
      reg(parts, "ruler", new ps.Group([arrow(P(cx, ry), P(cx - g.Ap, ry), "x", 1.6), line(P(cx, ry - 5), P(cx, ry + 5), "x", 1.4), txt(P(cx - g.Ap / 2, ry + 13), "amplitude = OA", "x", 9.5, "center")]));
      var bw = 2 * g.Ap;
      new ps.Path.Rectangle({ rectangle: new ps.Rectangle(cx - g.Ap, g.barY, bw, 8), radius: 4, fillColor: col("bg2"), strokeColor: col("line") });
      FR.forEach(function (fr, i) { var xx = cx - g.Ap + bw * i / 4; line(P(xx, g.barY - 3), P(xx, g.barY + 11), "soft", 1); txt(P(xx, g.barY + 24), fr[0], "soft", 11, "center", "bold"); });
      txt(P(cx + g.Ap + 8, g.barY + 8), "cycle", "muted", 9.5, "left");
    }
    function drawPsLive(tt) {
      var g = geo, cx = g.pv.x, w = 2 * PI / S.T, ph = w * tt, frac = ((ph / (2 * PI)) % 1 + 1) % 1;
      var x = -Math.cos(ph), th = Math.asin(x * Math.sin(g.th0)), B = g.pv.add(P(Math.sin(th), Math.cos(th)).multiply(g.Lp)), sx = cx + x * g.Ap;
      reg(liveParts, "thread", line(g.pv, B, "fg", 1.4));
      line(B, P(sx, g.stripY), "x", 1, [3, 3], 0.5);
      var gh = new ps.Group();
      FR.forEach(function (fr, i) {
        var reached = frac >= i / 4 - 1e-9 || (i === 4 && frac > 0.97), xx = cx + fr[1] * g.Ap, lift = i === 3 ? 18 : i === 4 ? 18 : 0;
        if (i === 0 || reached) {
          gh.addChild(new ps.Path.Circle({ center: P(xx, g.stripY - 14 - lift), radius: 8, fillColor: col("lime", reached ? 0.28 : 0.1), strokeColor: col("lime", reached ? 0.9 : 0.3), strokeWidth: 1.2 }));
          gh.addChild(txt(P(xx, g.stripY - 10 - lift), fr[0], "lime", 10, "center", "bold"));
        }
      });
      reg(liveParts, "ghosts", gh);
      reg(liveParts, "bob", new ps.Group([new ps.Path.Circle({ center: B, radius: 10, fillColor: col("brass"), strokeColor: col("bg"), strokeWidth: 1.5 }), new ps.Path.Circle({ center: P(sx, g.stripY), radius: 5, fillColor: col("x"), strokeColor: col("bg"), strokeWidth: 1.2 })]));
      reg(liveParts, "progress", new ps.Path.Rectangle({ rectangle: new ps.Rectangle(cx - g.Ap, g.barY, Math.max(1, 2 * g.Ap * frac), 8), radius: 4, fillColor: col("lime") }));
      if (S.labels) txt(P(cx, g.capY), "t = " + fx(frac * S.T, 2) + " s of T = " + fx(S.T, 2) + " s", "fg", 10.5, "center", "bold");
    }

    /* =========================================================== dispatch */
    var R = {
      "wheel": { geo: wheelGeo, base: drawWheelBase, live: drawWheelLive },
      "circle": { geo: circleGeo, base: drawCircleBase, live: drawCircleLive },
      "graphs": { geo: graphsGeo, base: drawGraphsBase, live: drawGraphsLive },
      "energy": { geo: energyGeo, base: drawEnergyBase, live: drawEnergyLive },
      "damping-trace": { geo: dampGeo, base: drawDampBase, live: drawDampLive },
      "resonance": { geo: resGeo, base: drawResBase, live: drawResLive },
      "pendulum-forces": { geo: pfGeo, base: drawPfBase, live: drawPfLive },
      "phase-strip": { geo: psGeo, base: drawPsBase, live: drawPsLive }
    };

    function measure() {
      var host = canvas.parentElement, w = (host && host.clientWidth) || canvas.clientWidth || 320, h = (host && host.clientHeight) || canvas.clientHeight || 0;
      if (h < 120) h = Math.round(clamp(w * 0.8, 260, 460));
      return { w: Math.max(240, Math.floor(w)), h: Math.max(200, Math.floor(h)) };
    }
    function layout() {
      var s = measure();
      if (s.w !== W || s.h !== H || !ps.view.viewSize || ps.view.viewSize.width !== s.w) { W = s.w; H = s.h; ps.view.viewSize = new ps.Size(W, H); }
      FS = clamp(Math.min(W / 520, H / 380), 1, 1.3); // larger labels on desktop stages
      dirty = true;
    }
    function render() {
      if (dead) return;
      ps.activate();
      var r = R[S.scene];
      if (dirty) {
        readTheme();
        base.activate(); base.removeChildren(); parts = {};
        geo = r.geo();
        r.base();
        dirty = false;
      }
      live.activate(); live.removeChildren(); liveParts = {};
      r.live(t);
      over.activate(); over.removeChildren();
      if (hl) {
        var it = liveParts[hl] || parts[hl];
        if (it && it.bounds && it.bounds.width + it.bounds.height > 0) {
          var b = it.bounds.expand(12), a = 0.55 + 0.4 * Math.sin(performance.now() / 180);
          new ps.Path.Rectangle({ rectangle: b, radius: 10, strokeColor: col("a", a), strokeWidth: 2.4, dashArray: [6, 4], fillColor: col("a", 0.07) });
        }
      }
      base.activate();
      ps.view.update();
    }
    function frame(now) {
      if (dead) return;
      raf = requestAnimationFrame(frame);
      var dt = last ? Math.min(0.05, (now - last) / 1000) : 0; last = now;
      if (playing && !dragging) t += dt * (S.timeScale || 1);
      if (visible && !document.hidden) render();
    }

    /* ---------- pointer: drag / tap sets the state on canvas ---------- */
    function local(e) { var b = canvas.getBoundingClientRect(); return P(e.clientX - b.left, e.clientY - b.top); }
    function setPhaseFor(theta) { t = theta / omega(); }
    function onDrag(p) {
      var g = geo, s = S.scene;
      if (s === "wheel") {
        if (g.tg && p.y > g.hw) return dragTrace(g.tg, p);
        var d = p.subtract(g.c), th = Math.atan2(d.x, -d.y); if (th < 0) th += 2 * PI; setPhaseFor(th);
      } else if (s === "circle") {
        if (p.x > g.side + 12) return dragTrace(g.tg, p);
        var d2 = p.subtract(g.c), th2 = Math.atan2(-d2.y, d2.x); if (th2 < 0) th2 += 2 * PI; setPhaseFor(th2);
      } else if (s === "graphs") dragTrace(g.tg, p);
      else if (s === "energy") {
        var e = eModel(), x;
        if (g.mx && p.y > g.mx.r.y && p.y < g.mx.r.y + g.mx.r.h) x = -S.A + 2 * S.A * clamp((p.x - g.mx.r.x) / g.mx.r.w, 0, 1);
        else if (g.mt && p.y > g.mt.r.y) { t = g.span * clamp((p.x - g.mt.r.x) / g.mt.r.w, 0, 1); emit(); return; }
        else x = clamp((p.x - g.cx) / g.Rp, -1, 1) * S.A;
        t = Math.asin(clamp(x / S.A, -1, 1)) / e.w;
      } else if (s === "damping-trace") { t = dampSpan() * clamp((p.x - g.r.x) / g.r.w, 0, 1); }
      else if (s === "resonance") {
        var f = clamp((p.x - g.r.x) / g.r.w, 0, 1) * g.xr[1], kmh = clamp(Math.round(f * S.d * 3.6 * 2) / 2, 2, 36);
        if (kmh !== S.speed_kmh) { S.speed_kmh = kmh; }
      } else if (s === "pendulum-forces") {
        var d3 = p.subtract(g.pivot), a3 = deg(Math.atan2(d3.x, Math.max(1, d3.y))), sg = a3 < 0 ? -1 : 1;
        S.theta_deg = sg * clamp(Math.round(Math.abs(a3)), 2, 45); t = 0; dirty = true;
      } else if (s === "phase-strip") {
        var xx = clamp((p.x - g.pv.x) / g.Ap, -1, 1); t = Math.acos(-xx) / (2 * PI / S.T);
      }
      emit();
    }
    function dragTrace(tg, p) { var st = tg.strips[0], u = clamp((p.x - st.x) / st.w, 0, 1), span = tg.span, base0 = Math.floor(t / span) * span; t = base0 + u * span; emit(); }
    function down(e) { if (e.button != null && e.button > 0) return; dragging = true; try { canvas.setPointerCapture(e.pointerId); } catch (x) { /* ignore */ } onDrag(local(e)); }
    function move(e) { if (dragging) onDrag(local(e)); }
    function up(e) { if (!dragging) return; dragging = false; try { canvas.releasePointerCapture(e.pointerId); } catch (x) { /* ignore */ } if (S.scene !== "pendulum-forces") playing = false; else t = 0; emit(); }
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", function () { dragging = false; });

    function emit() { if (typeof S.onChange === "function") { try { S.onChange(reading()); } catch (e) { if (global.console) console.warn(e); } } }

    /* ---------- reading(): every number from the model ---------- */
    function reading() {
      var s = S.scene, out = { scene: s, mode: s, t: t, playing: playing };
      if (s === "wheel" || s === "circle" || s === "graphs") {
        var th = omega() * t, m = model.shm(S.A, S.T, th), dg = wrap360(deg(th));
        assign(out, { A: S.A, T: S.T, w: m.w, f: m.f, angle_deg: Math.round(dg * 1000) / 1000, x: m.x, v: m.v, a: m.a, v_max: m.v_max, a_max: m.a_max,
          a_over_x: m.x !== 0 ? m.a / m.x : null, g_over_w2: G / (m.w * m.w), lift: m.a_max >= G,
          display: { angle: Math.round(dg) + "°", x: sf(m.x, 3), v: sf(m.v, 3), a: sf(m.a, 3), a_max: fx(m.a_max, 1), g_over_w2_cm: fx(100 * G / (m.w * m.w), 1), A_cm: fx(S.A * 100, 1) } });
      } else if (s === "energy") {
        var e0 = eModel(), x = S.A * Math.sin(e0.w * t), en = model.energy(S.k, S.m, S.A, x);
        assign(out, en, { T: 2 * PI / en.w, display: { x: fx(x, 3), PE: fx(en.PE, 3), KE: fx(en.KE, 3), E: fx(en.E, 3), v: fx(en.v, 2) } });
      } else if (s === "damping-trace") {
        var span = dampSpan(), loop = span * 1.18, tc = Math.min(((t % loop) + loop) % loop, span), cs = {};
        dampKeys().forEach(function (k) {
          var d = dampSet()[k], fn = dampSeries(k), c = { zeta: d.zeta, x: fn(tc), ratioPerCycle: model.ratioPerCycle(d.zeta), oscillates: d.zeta < 1 };
          if (S.set === "shock" && S.forced) { var mx = 0, T0 = 2 * PI / dampW0(); for (var q = 0; q <= 200; q++) mx = Math.max(mx, Math.abs(fn(span - T0 + T0 * q / 200))); c.finalAmp_cm = mx; c.display = fx(mx, 1) + " cm"; }
          cs[k] = c;
        });
        assign(out, { set: S.set, forced: !!S.forced, w0: dampW0(), span: span, tc: tc, unit: S.set === "shock" ? "cm" : "x/A0", curves: cs });
      } else if (s === "resonance") {
        var mo = resModel(), pk = model.peak(mo.f0, S.zeta, S.Y), lA = model.response(mo.f, mo.f0, 0.05, S.Y), hA = model.response(mo.f, mo.f0, 0.30, S.Y);
        assign(out, mo, { load_kg: S.load_kg, A_cm: mo.A * 100, th_cm: mo.th * 100, th0_cm: mo.th0 * 100, A_leaking_cm: lA * 100, A_healthy_cm: hA * 100,
          peak: { f: pk.f, kmh: pk.f * S.d * 3.6, A_cm: pk.A * 100 }, at_f0_cm: model.response(mo.f0, mo.f0, S.zeta, S.Y) * 100,
          display: { speed: fx(mo.speed_kmh, 1) + " km/h", v: fx(mo.v, 2) + " m/s", f: fx(mo.f, 2) + " Hz", f0: fx(mo.f0, 2) + " Hz", A: fx(mo.A * 100, 1) + " cm", threshold: fx(mo.th * 100, 1) + " cm", threshold_f0: fx(mo.th0 * 100, 1) + " cm", curve_max: fx(pk.A * 100, 1) + " cm", peak: fx(model.response(mo.f0, mo.f0, S.zeta, S.Y) * 100, 1) + " cm", at_f0: fx(model.response(mo.f0, mo.f0, S.zeta, S.Y) * 100, 1) + " cm", verdict: mo.lift ? "crates lift off" : "crates stay on" } });
      } else if (s === "pendulum-forces") {
        var thd = pfTheta(t), pm = model.pendulum(thd, S.mass_g / 1000, S.l, S.g, S.theta_deg);
        assign(out, pm, { theta0_deg: S.theta_deg, mass_g: S.mass_g, display: { theta: fx(Math.abs(thd), 1) + "°", rad: fx(Math.abs(pm.theta_rad), 3), sin: fx(Math.abs(pm.sin), 3), mg_sin: fx(Math.abs(pm.mg_sin), 3) + " N", a: fx(Math.abs(pm.a), 2) + " m/s²", x_over_l: fx(Math.abs(pm.x_over_l), 3), diff: fx(pm.diff_pct, 2) + " %" } });
      } else if (s === "phase-strip") {
        var w2 = 2 * PI / S.T, fr = ((w2 * t / (2 * PI)) % 1 + 1) % 1;
        assign(out, { A: S.A, T: S.T, fraction: fr, x: -S.A * Math.cos(w2 * t), at: fr < 0.02 || fr > 0.98 ? "A" : Math.abs(fr - 0.25) < 0.02 || Math.abs(fr - 0.75) < 0.02 ? "O" : Math.abs(fr - 0.5) < 0.02 ? "B" : "" });
      }
      return out;
    }

    /* ---------- public API ---------- */
    var ro = null, io = null;
    function onResize() { layout(); }
    if (global.ResizeObserver && canvas.parentElement) { ro = new ResizeObserver(function () { var s = measure(); if (s.w !== W || s.h !== H) { layout(); render(); } }); ro.observe(canvas.parentElement); }
    else global.addEventListener("resize", onResize);
    if (global.IntersectionObserver) { io = new IntersectionObserver(function (en) { visible = en[0] ? en[0].isIntersecting : true; }); io.observe(canvas); }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { dirty = true; });

    var api = {
      version: VERSION,
      canvas: canvas,
      scope: ps,
      setState: function (patch) {
        patch = patch || {};
        var ns = patch.scene || patch.mode;
        if (ns && ns !== S.scene && R[ns]) { var keep = { surface: S.surface, labels: S.labels, onChange: S.onChange }; S = assign({}, defaults, SCENE_DEFAULTS[ns], keep); S.scene = ns; t = 0; playing = S.autoplay !== false; }
        if (patch.preset && PRESETS[patch.preset]) assign(S, PRESETS[patch.preset], { preset: patch.preset });
        for (var k in patch) if (k !== "scene" && k !== "mode" && k !== "preset" && k !== "canvas") S[k] = patch[k];
        if (patch.A != null && S.Amax != null && S.A > S.Amax) S.Amax = S.A;
        if (patch.angle_deg != null && omega()) t = (patch.angle_deg * PI / 180) / omega();
        if (patch.t != null) t = patch.t;
        if (patch.playing != null) playing = !!patch.playing;
        dirty = true; render(); emit();
        return api;
      },
      setMode: function (m) { return api.setState({ scene: m }); },
      reading: reading,
      state: function () { var o = assign({}, S); delete o.onChange; return o; },
      parts: function () { return (PARTS[S.scene] || []).slice(); },
      rect: function (part) {
        var b = canvas.getBoundingClientRect();
        var it = part ? (liveParts[part] || parts[part]) : null;
        if (!it || !it.bounds || it.bounds.width + it.bounds.height === 0) return { left: b.left, top: b.top, width: b.width, height: b.height };
        var r = it.bounds.expand(8);
        var sx = b.width / W, sy = b.height / H;
        return { left: b.left + r.x * sx, top: b.top + r.y * sy, width: r.width * sx, height: r.height * sy };
      },
      highlight: function (part) { hl = part || null; render(); return api; },
      play: function () { playing = true; return api; },
      pause: function () { playing = false; render(); return api; },
      toggle: function () { playing = !playing; return api; },
      isPlaying: function () { return playing; },
      step: function (stepDeg) {
        playing = false;
        var d = stepDeg == null ? 30 : stepDeg;
        if (S.scene === "wheel" || S.scene === "circle" || S.scene === "graphs") {
          var cur = wrap360(deg(omega() * t)), nx = Math.round((cur + d) / d) * d; // snap onto the grid of steps
          if (Math.abs(nx - cur) < 1e-6) nx = cur + d;
          t = (wrap360(nx) * PI / 180) / omega();
        } else if (S.scene === "phase-strip") { t += S.T * (d / 360); }
        else t += (d / 360) * (S.T || 1);
        render(); emit();
        return api;
      },
      reset: function () { t = 0; playing = S.autoplay !== false; dirty = true; render(); emit(); return api; },
      resize: function () { layout(); render(); return api; },
      refreshTheme: function () { dirty = true; render(); return api; },
      destroy: function () {
        dead = true; cancelAnimationFrame(raf);
        if (ro) ro.disconnect(); else global.removeEventListener("resize", onResize);
        if (io) io.disconnect();
        canvas.removeEventListener("pointerdown", down); canvas.removeEventListener("pointermove", move); canvas.removeEventListener("pointerup", up);
        try { ps.project.remove(); } catch (e) { /* ignore */ }
      }
    };
    layout();
    render();
    raf = requestAnimationFrame(frame);
    return api;
  }

  global.ShmKinematics2D = {
    version: VERSION,
    create: create,
    model: model,
    defaults: defaults,
    sceneDefaults: SCENE_DEFAULTS,
    presets: PRESETS,
    modes: SCENES.slice(),
    scenes: SCENES.slice(),
    parts: PARTS,
    format: { sf: sf, fx: fx }
  };
})(window);
