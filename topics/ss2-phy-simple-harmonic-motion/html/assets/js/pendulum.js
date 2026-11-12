/* =========================================================
   StudyPipe · PendulumKit v3 — the simple pendulum as a real school-lab apparatus
   Classic script (no modules), 100 % offline, uses window.THREE only (r160 bundle).
   1 scene unit = 1 metre. Viewer on +z, y up. Bench top / floor at y = 0.

   PendulumKit.create(opts) -> THREE.Group g
     g.parts                 { partId: Object3D }   (every mesh tagged userData.partId)
     g.update(dt, t)         (= g.tick = g.userData.update)
     g.setState(patch)       (= g.userData.setState)
     g.reading()             every number from PendulumKit.model
     g.highlight(part|null)  pulsing emissive highlight      g.viewFor(part|"all") camera hint
     g.release() g.time(n, {instant}) g.startWatch() g.stopWatch() g.measure() g.start() g.reset()
     g.pickPart(raycaster)   g.setMode(m) g.getMode() g.triangles()
   Modes: trace | laws | forces | practical | ceiling | energy | barton
   The legacy v2 widget (kits/pendulum/kit.js, window.StudyPipeKits.pendulum) is untouched.
   ========================================================= */
(function (global) {
  "use strict";
  if (typeof global.THREE === "undefined") return;
  var THREE = global.THREE;
  var TAU = Math.PI * 2, D2R = Math.PI / 180, R2D = 180 / Math.PI;

  /* =========================================================
     1. MODEL — the only source of numbers
     ========================================================= */
  function round(x, d) { var p = Math.pow(10, d); return Math.round((x + (x >= 0 ? 1e-10 : -1e-10)) * p) / p; }
  function agm(a, b) { for (var i = 0; i < 40 && Math.abs(a - b) > 1e-15; i++) { var an = (a + b) / 2; b = Math.sqrt(a * b); a = an; } return a; }

  var PRACTICAL_PRESETS = [0.400, 0.550, 0.700, 0.850, 1.000];
  /* L05 composite table (02-lesson.md): fixed class readings, g = 9.79, small-angle model */
  var PRACTICAL_TIMES = { "0.400": [25.36, 25.44], "0.550": [29.82, 29.76], "0.700": [33.57, 33.63], "0.850": [37.06, 37.00], "1.000": [40.13, 40.19] };
  var FAULTS = ["none", "count-from-1", "time-from-extreme", "length-to-top", "wide-angle", "conical", "draught"];

  var model = {
    gEarth: 9.8, gMoon: 1.6, gClass: 9.79,
    /* small-angle period T = 2π√(l/g) */
    periodSmall: function (l, g) { return TAU * Math.sqrt(l / g); },
    /* exact large-angle factor T/T₀ = 1 / AGM(1, cos(θ₀/2)) (complete elliptic integral) */
    exactFactor: function (deg) { return 1 / agm(1, Math.cos(deg * D2R / 2)); },
    /* the same factor as the textbook series 1 + θ²/16 + 11θ⁴/3072 + 173θ⁶/737280 (for checking) */
    seriesFactor: function (deg) { var t = deg * D2R, t2 = t * t; return 1 + t2 / 16 + 11 * t2 * t2 / 3072 + 173 * t2 * t2 * t2 / 737280; },
    period: function (l, g, deg, periodModel) {
      var T = model.periodSmall(l, g);
      return periodModel === "exact" ? T * model.exactFactor(deg || 0) : T;
    },
    /* conical pendulum: T = 2π√(l cos α / g) — shorter than the plane swing */
    conicalPeriod: function (l, g, alphaDeg) { return TAU * Math.sqrt(l * Math.cos(alphaDeg * D2R) / g); },
    /* n oscillations, rounded like a stopwatch (2 d.p.) */
    timeFor: function (n, l, g, deg, periodModel) { return round(n * model.period(l, g, deg, periodModel), 2); },
    summary: function (l, g, deg, periodModel) {
      var T = model.period(l, g, deg, periodModel);
      return { T: T, f: 1 / T, w: TAU / T, T2: T * T };
    },
    /* L01: a reaction error e (s) on n oscillations → % error of T */
    reactionError: function (T, n, e) { return 100 * e / (n * T); },
    /* pendulum length that keeps a given period (e.g. okada T₀ = 0.50 s → 6.2 cm) */
    lengthFor: function (T, g) { return g * T * T / (4 * Math.PI * Math.PI); },
    /* g from one reading */
    gFrom: function (l, T) { return 4 * Math.PI * Math.PI * l / (T * T); },
    /* Paper 3 practical. Fixed class readings for the five presets (g 9.79, r 2.0 cm); other lengths use
       20·2π√(l/g) ± a deterministic 0.03 s. Faults change the readings the physically correct way. */
    practical: function (l, o) {
      o = o || {};
      var g = o.g != null ? o.g : 9.79, n = o.n || 20, r = o.r_bob != null ? o.r_bob : 0.020;
      var fault = o.fault || "none", cone = o.coneAngle_deg || 15;
      var key = l.toFixed(3), fixed = PRACTICAL_TIMES[key];
      var base;
      if (fixed && Math.abs(g - 9.79) < 1e-9 && n === 20 && Math.abs(l - +key) < 1e-9) base = fixed.slice();
      else {
        var b = n * model.periodSmall(l, g), s = Math.round(l * 1000) % 2 === 0 ? 1 : -1;
        base = [round(b - s * 0.03, 2), round(b + s * 0.03, 2)];
      }
      var t = base.slice(), lRec = l, Tphys = model.periodSmall(l, g), amp = o.angle_deg || 10, note = "";
      if (fault === "count-from-1") { t = t.map(function (x) { return round(x * (n - 1) / n, 2); }); note = "only " + (n - 1) + " oscillations timed"; }
      else if (fault === "time-from-extreme") { t = [round(t[0] + 0.34, 2), round(t[1] - 0.27, 2)]; note = "start/stop judged at the extreme"; }
      else if (fault === "length-to-top") { lRec = l - r; note = "l measured to the top of the bob"; }
      else if (fault === "wide-angle") { var k = model.exactFactor(40); t = t.map(function (x) { return round(x * k, 2); }); Tphys *= k; amp = 40; note = "40° swing runs slow"; }
      else if (fault === "conical") { var c = Math.sqrt(Math.cos(cone * D2R)); t = t.map(function (x) { return round(x * c, 2); }); Tphys *= c; note = "conical path is quicker"; }
      else if (fault === "draught") { t = [round(t[0] + 0.21, 2), round(t[1] - 0.18, 2)]; note = "draught pushes the bob"; }
      var tmean = (t[0] + t[1]) / 2, T = tmean / n;
      return { l: lRec, l_true: l, r_bob: r, g: g, n: n, fault: fault, t1: t[0], t2: t[1], tmean: tmean, T: T, T2: T * T,
        g_from_T: model.gFrom(lRec, T), Tphys: Tphys, angle: amp, note: note, preset: !!fixed };
    },
    /* ceiling variant: bob centre y above the floor, ceiling H → l = H − y, T² = (4π²/g)(H − y) */
    ceiling: function (H, y, g, n) {
      n = n || 20; var l = H - y, T = model.periodSmall(l, g), t = round(n * T, 2);
      return { H: H, y: y, l: l, g: g, n: n, t: t, T: T, T2: T * T, slope: -4 * Math.PI * Math.PI / g };
    },
    /* energy at angle θ for a bob released from θ₀ (E = mgh₀ = ½mv²_max) */
    energy: function (m, l, g, deg0, deg) {
      var h0 = l * (1 - Math.cos(deg0 * D2R)), h = l * (1 - Math.cos(deg * D2R));
      var E = m * g * h0, PE = m * g * h, KE = Math.max(0, E - PE);
      return { m: m, l: l, g: g, h0: h0, h: h, E: E, PE: PE, KE: KE, v: Math.sqrt(2 * KE / m), vmax: Math.sqrt(2 * g * h0) };
    },
    angleForHeight: function (l, h0) { return Math.acos(Math.max(-1, Math.min(1, 1 - h0 / l))) * R2D; },
    /* Barton's pendulums: light pendulums on a cord moved by the driver (support displacement S cos ωt).
       θᵢ'' + 2ζωᵢθᵢ' + ωᵢ²θᵢ = (ω²S/lᵢ) cos ωt  →  Aᵢ = (ω²S/lᵢ)/√((ωᵢ² − ω²)² + (2ζωᵢω)²),
       phase lag φᵢ = atan2(2ζωᵢω, ωᵢ² − ω²): short cones in step (≈0°), equal length ¼ cycle behind (90°),
       long cones nearly opposite (≈180°). S = κ·l_d·θ_d (κ = 0.30 cord coupling). */
    barton: function (o) {
      o = o || {};
      var g = o.g || 9.8, L = o.driverL || 0.60, cones = o.cones || [0.30, 0.45, 0.60, 0.75, 0.90];
      var z = o.zeta != null ? o.zeta : 0.06, th = (o.driverAngle_deg || 8) * D2R, kap = o.kappa != null ? o.kappa : 0.30;
      var w = Math.sqrt(g / L), S = kap * L * th;
      var amps = [], phases = [], wi = [];
      cones.forEach(function (li) {
        var w0 = Math.sqrt(g / li), den = Math.sqrt(Math.pow(w0 * w0 - w * w, 2) + Math.pow(2 * z * w0 * w, 2));
        amps.push((w * w * S / li) / den * R2D);
        phases.push(Math.atan2(2 * z * w0 * w, w0 * w0 - w * w) * R2D);
        wi.push(w0);
      });
      var widest = 0; amps.forEach(function (a, i) { if (a > amps[widest]) widest = i; });
      var mx = amps[widest];
      return { g: g, driverL: L, T: TAU / w, fDriver: w / TAU, w: w, S: S, zeta: z, cones: cones.slice(), amps: amps,
        ampsRel: amps.map(function (a) { return a / mx; }), phases: phases, w0: wi, widest: widest + 1, widestL: cones[widest],
        tau: wi.map(function (x) { return 1 / (z * x); }) };
    },
    round: round, presets: PRACTICAL_PRESETS, practicalTimes: PRACTICAL_TIMES, faults: FAULTS
  };

  /* =========================================================
     2. MATERIALS & PROCEDURAL TEXTURES (deterministic)
     ========================================================= */
  function rng(seed) { var s = (seed || 1) >>> 0; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  function srgb(t) {
    if ("colorSpace" in t && THREE.SRGBColorSpace) t.colorSpace = THREE.SRGBColorSpace;
    else if ("encoding" in t && THREE.sRGBEncoding) t.encoding = THREE.sRGBEncoding;
    return t;
  }
  function canvasTex(w, h, draw, rx, ry, linear) {
    var c = document.createElement("canvas"); c.width = w; c.height = h;
    draw(c.getContext("2d"), w, h);
    var t = new THREE.CanvasTexture(c);
    if (!linear) srgb(t);
    t.anisotropy = 4;
    if (rx || ry) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rx || 1, ry || 1); }
    t.userData = { canvas: c };
    return t;
  }
  function grain(g, w, h, base, dark, n, seed) {
    var r = rng(seed); g.fillStyle = base; g.fillRect(0, 0, w, h);
    for (var i = 0; i < n; i++) {
      g.strokeStyle = dark; g.globalAlpha = 0.08 + r() * 0.22; g.lineWidth = 0.6 + r() * 2.2;
      var p = r() * h, a = r() * 6; g.beginPath();
      for (var q = 0; q <= w; q += 10) { var off = Math.sin(q * 0.013 + a) * 4 + Math.sin(q * 0.05 + a * 2) * 1.2; if (!q) g.moveTo(q, p + off); else g.lineTo(q, p + off); }
      g.stroke();
    }
    g.globalAlpha = 1;
  }
  function speckle(g, w, h, base, cols, n, seed, size) {
    var r = rng(seed); g.fillStyle = base; g.fillRect(0, 0, w, h);
    for (var i = 0; i < n; i++) {
      g.fillStyle = cols[Math.floor(r() * cols.length)]; g.globalAlpha = 0.25 + r() * 0.6;
      var s = (size || 2) * (0.4 + r()); g.beginPath(); g.arc(r() * w, r() * h, s, 0, TAU); g.fill();
    }
    g.globalAlpha = 1;
  }
  function brushed(g, w, h, base, seed) {
    var r = rng(seed); g.fillStyle = base; g.fillRect(0, 0, w, h);
    for (var i = 0; i < 260; i++) { g.strokeStyle = r() > 0.5 ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.10)"; g.lineWidth = 0.5 + r(); var y = r() * h; g.beginPath(); g.moveTo(0, y); g.lineTo(w, y + (r() - 0.5) * 3); g.stroke(); }
  }
  /* metre-rule face: mm / cm / 5 cm ticks, numbers each 10 cm. startCm..startCm+lenCm, 0 at the top end. */
  var _ruleCache = {};
  function ruleTexture(startCm, lenCm, horizontal) {
    var key = startCm + "|" + lenCm + "|" + !!horizontal;
    if (_ruleCache[key]) return _ruleCache[key];
    var L = Math.round(20.48 * lenCm), W = 112;
    var t = canvasTex(horizontal ? L : W, horizontal ? W : L, function (g, cw, ch) {
      g.fillStyle = "#f1dfa8"; g.fillRect(0, 0, cw, ch);
      var r = rng(5); g.globalAlpha = 0.12; g.strokeStyle = "#8a6a2c";
      for (var i = 0; i < 40; i++) { g.lineWidth = 1 + r() * 2; var p = r() * W; g.beginPath(); if (horizontal) { g.moveTo(0, p); g.lineTo(cw, p + 2); } else { g.moveTo(p, 0); g.lineTo(p + 2, ch); } g.stroke(); }
      g.globalAlpha = 1; g.fillStyle = "#15120c"; g.font = "bold 30px sans-serif";
      for (var mm = 0; mm <= lenCm * 10; mm++) {
        var s = 4 + mm / (lenCm * 10) * (L - 8);
        var len = mm % 100 === 0 ? 62 : mm % 50 === 0 ? 46 : mm % 10 === 0 ? 34 : 16, th = mm % 10 === 0 ? 3 : 1.6;
        if (horizontal) g.fillRect(s - th / 2, 0, th, len); else g.fillRect(0, s - th / 2, len, th);
        if (mm % 100 === 0 && mm > 0 && mm < lenCm * 10 || (mm % 100 === 0 && mm === 0 && startCm > 0)) {
          var lab = String(startCm + mm / 10);
          if (horizontal) { g.textAlign = "center"; g.fillText(lab, s, 96); } else { g.save(); g.translate(70, s); g.rotate(Math.PI / 2); g.textAlign = "center"; g.fillText(lab, 0, -8); g.restore(); }
        }
      }
      g.font = "bold 22px sans-serif"; g.fillStyle = "#7a2014";
      if (!horizontal) { g.save(); g.translate(92, ch - 90); g.rotate(Math.PI / 2); g.fillText("cm", 0, 0); g.restore(); }
    }, 0, 0);
    _ruleCache[key] = t; return t;
  }
  function protractorTexture() {
    return canvasTex(1024, 512, function (g, w, h) {
      g.clearRect(0, 0, w, h);
      var cx = w / 2, cy = 0, R = 500;
      g.strokeStyle = "rgba(20,30,40,0.95)"; g.fillStyle = "rgba(20,30,40,0.95)"; g.font = "bold 26px sans-serif"; g.textAlign = "center";
      for (var d = -90; d <= 90; d++) {
        var a = d * D2R, sx = Math.sin(a), cy2 = Math.cos(a);
        var len = d % 10 === 0 ? 60 : d % 5 === 0 ? 40 : 22;
        g.lineWidth = d % 10 === 0 ? 3 : 1.5;
        g.beginPath(); g.moveTo(cx + sx * R, cy + cy2 * R); g.lineTo(cx + sx * (R - len), cy + cy2 * (R - len)); g.stroke();
        if (d % 10 === 0 && Math.abs(d) <= 80) { g.save(); g.translate(cx + sx * (R - 88), cy + cy2 * (R - 88)); g.rotate(-a); g.fillText(String(Math.abs(d)), 0, 10); g.restore(); }
      }
      g.lineWidth = 2; g.beginPath(); g.arc(cx, cy, R - 120, 0, Math.PI); g.stroke();
      g.setLineDash([10, 8]); g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx, cy + R - 2); g.stroke();
    });
  }

  var _tex = null;
  function textures() {
    if (_tex) return _tex;
    _tex = {
      bench: canvasTex(512, 256, function (g, w, h) { grain(g, w, h, "#8a5a33", "#3d2312", 70, 7); }, 2, 1),
      cork: canvasTex(128, 128, function (g, w, h) { speckle(g, w, h, "#b98b55", ["#7a5530", "#d9b27e", "#5d3e20", "#a0703c"], 700, 3, 1.5); }),
      wood: canvasTex(256, 128, function (g, w, h) { grain(g, w, h, "#b07a42", "#4a2a12", 46, 11); }),
      post: canvasTex(128, 512, function (g, w, h) { g.save(); g.translate(w, 0); g.rotate(Math.PI / 2); grain(g, h, w, "#7b4f2a", "#2f1a0c", 30, 17); g.restore(); }),
      brass: canvasTex(256, 64, function (g, w, h) { brushed(g, w, h, "#c9a14a", 9); }),
      steel: canvasTex(256, 64, function (g, w, h) { brushed(g, w, h, "#b9c0ca", 13); }),
      paper: canvasTex(256, 128, function (g, w, h) { speckle(g, w, h, "#f3efe2", ["#e2dccb", "#fbf8ef", "#d8d0bc"], 900, 23, 1.1); }),
      plaster: canvasTex(256, 256, function (g, w, h) { speckle(g, w, h, "#e9e4d8", ["#d6d0c2", "#f4f0e6", "#cfc8b8"], 1400, 29, 1.6); }, 4, 4),
      tiles: canvasTex(256, 256, function (g, w, h) {
        speckle(g, w, h, "#b9b2a4", ["#a39c8e", "#cbc4b6", "#8f897c"], 1600, 31, 1.4);
        g.strokeStyle = "rgba(60,55,48,0.7)"; g.lineWidth = 3; for (var i = 0; i <= 2; i++) { g.beginPath(); g.moveTo(i * 128, 0); g.lineTo(i * 128, h); g.stroke(); g.beginPath(); g.moveTo(0, i * 128); g.lineTo(w, i * 128); g.stroke(); }
      }, 6, 6),
      protractor: protractorTexture()
    };
    return _tex;
  }
  function std(color, rough, metal, extra) {
    var o = { color: color, roughness: rough == null ? 0.6 : rough, metalness: metal || 0 };
    if (extra) for (var k in extra) o[k] = extra[k];
    return new THREE.MeshStandardMaterial(o);
  }
  function makeMaterials() {
    var T = textures();
    return {
      bench: std(0xffffff, 0.75, 0, { map: T.bench }),
      paint: std(0x1f3550, 0.55, 0.3),
      steel: std(0xffffff, 0.32, 0.6, { map: T.steel }),
      darkSteel: std(0x3a3f48, 0.45, 0.7),
      brass: std(0xffffff, 0.34, 0.55, { map: T.brass, bumpMap: T.brass, bumpScale: 0.0004, emissive: 0x2a1c04, emissiveIntensity: 0.35 }),
      wood: std(0xffffff, 0.65, 0, { map: T.wood }),
      post: std(0xffffff, 0.7, 0, { map: T.post }),
      cork: std(0xffffff, 0.95, 0, { map: T.cork, bumpMap: T.cork, bumpScale: 0.0006 }),
      felt: std(0x2b2b2b, 1, 0),
      blackPlastic: std(0x16181d, 0.5, 0.1),
      chrome: std(0xe4e8ee, 0.15, 1),
      thread: std(0xf2efe6, 0.9, 0),
      cord: std(0xd9c9a3, 0.95, 0),
      chalk: std(0xf7f5ee, 0.95, 0),
      rule: std(0xead6a0, 0.7, 0),
      setSquare: std(0xff9a3c, 0.25, 0, { transparent: true, opacity: 0.55, side: THREE.DoubleSide, depthWrite: false }),
      protractor: std(0xdfeef7, 0.1, 0, { transparent: true, opacity: 0.32, side: THREE.DoubleSide, depthWrite: false }),
      protractorScale: new THREE.MeshBasicMaterial({ map: T.protractor, transparent: true, side: THREE.DoubleSide, depthWrite: false }),
      paper: std(0xffffff, 0.9, 0, { map: T.paper, side: THREE.DoubleSide }),
      plaster: std(0xffffff, 0.95, 0, { map: T.plaster }),
      tiles: std(0xffffff, 0.8, 0, { map: T.tiles }),
      ghost: std(0xffd27a, 0.4, 0.2, { transparent: true, opacity: 0.32, emissive: 0xffb23f, emissiveIntensity: 0.35, depthWrite: false }),
      ke: std(0xe8743b, 0.45, 0.1, { emissive: 0x3a1203, emissiveIntensity: 0.4 }),
      pe: std(0x3b7fe8, 0.45, 0.1, { emissive: 0x06183a, emissiveIntensity: 0.4 }),
      total: std(0x3fae5a, 0.45, 0.1, { emissive: 0x08260f, emissiveIntensity: 0.4 }),
      panel: std(0x22262e, 0.7, 0.1),
      dash: new THREE.LineDashedMaterial({ color: 0xffffff, dashSize: 0.012, gapSize: 0.008, transparent: true, opacity: 0.75 }),
      dashAmber: new THREE.LineDashedMaterial({ color: 0xffb23f, dashSize: 0.015, gapSize: 0.01 }),
      arcLine: new THREE.LineBasicMaterial({ color: 0xffb23f }),
      wind: new THREE.LineBasicMaterial({ color: 0xa8e1ff, transparent: true, opacity: 0.6 }),
      dim: std(0xffd27a, 0.5, 0.1, { emissive: 0x6a4a10, emissiveIntensity: 0.4 })
    };
  }

  /* =========================================================
     3. GEOMETRY HELPERS
     ========================================================= */
  function v3(x, y, z) { return new THREE.Vector3(x, y, z || 0); }
  function roundedRect(w, d, r) {
    var s = new THREE.Shape(), x = -w / 2, y = -d / 2;
    s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + d - r); s.quadraticCurveTo(x + w, y + d, x + w - r, y + d);
    s.lineTo(x + r, y + d); s.quadraticCurveTo(x, y + d, x, y + d - r);
    s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
    return s;
  }
  /* rounded, bevelled block; bottom face at y = 0 */
  function slab(w, h, d, r, mat) {
    var bev = Math.min(0.004, h / 4, r / 2);
    var g = new THREE.ExtrudeGeometry(roundedRect(w - 2 * bev, d - 2 * bev, Math.max(0.0005, r - bev)), { depth: h - 2 * bev, bevelEnabled: true, bevelThickness: bev, bevelSize: bev, bevelSegments: 2, curveSegments: 6 });
    g.rotateX(-Math.PI / 2); g.translate(0, bev, 0);
    var m = new THREE.Mesh(g, mat); m.castShadow = m.receiveShadow = true; return m;
  }
  function tube(points, r, mat, seg, radial, closed) {
    var c = new THREE.CatmullRomCurve3(points, !!closed, "catmullrom", 0.3);
    var m = new THREE.Mesh(new THREE.TubeGeometry(c, seg || 40, r, radial || 10, !!closed), mat);
    m.userData.curve = c; return m;
  }
  var _up = v3(0, 1, 0), _dir = new THREE.Vector3();
  /* unit cylinder stretched between two points */
  function between(mesh, a, b) {
    _dir.subVectors(b, a); var len = _dir.length();
    mesh.position.addVectors(a, b).multiplyScalar(0.5);
    mesh.scale.set(1, Math.max(1e-4, len), 1);
    if (len > 1e-6) mesh.quaternion.setFromUnitVectors(_up, _dir.divideScalar(len));
    return mesh;
  }
  function rod(a, b, r, mat, seg) { return between(new THREE.Mesh(new THREE.CylinderGeometry(r, r, 1, seg || 14), mat), a, b); }
  function dashedLine(pts, mat) {
    var g = new THREE.BufferGeometry().setFromPoints(pts);
    var l = new THREE.Line(g, mat); l.computeLineDistances(); l.userData.noPick = true; return l;
  }
  function setLine(line, pts) {
    var pos = line.geometry.attributes.position;
    for (var i = 0; i < pts.length && i < pos.count; i++) pos.setXYZ(i, pts[i].x, pts[i].y, pts[i].z);
    pos.needsUpdate = true; line.computeLineDistances(); line.geometry.computeBoundingSphere();
  }

  /* text sprites (no SceneKit dependency) */
  function labelCanvas(text, o) {
    o = o || {};
    var fs = o.size || 40, pad = 14, c = document.createElement("canvas"), g = c.getContext("2d");
    g.font = "600 " + fs + "px sans-serif";
    var w = Math.ceil(g.measureText(text).width) + pad * 2, h = fs + pad * 1.4;
    c.width = Math.max(8, w); c.height = Math.ceil(h);
    g.font = "600 " + fs + "px sans-serif";
    g.fillStyle = o.bg || "rgba(10,15,29,0.86)";
    var r = Math.min(16, c.height / 2);
    g.beginPath(); g.moveTo(r, 0); g.lineTo(c.width - r, 0); g.quadraticCurveTo(c.width, 0, c.width, r); g.lineTo(c.width, c.height - r);
    g.quadraticCurveTo(c.width, c.height, c.width - r, c.height); g.lineTo(r, c.height); g.quadraticCurveTo(0, c.height, 0, c.height - r);
    g.lineTo(0, r); g.quadraticCurveTo(0, 0, r, 0); g.fill();
    g.fillStyle = o.color || "#ffffff"; g.textBaseline = "middle"; g.textAlign = "center";
    g.fillText(text, c.width / 2, c.height / 2 + 1);
    return c;
  }
  function label(text, h, o) {
    var c = labelCanvas(text, o), t = srgb(new THREE.CanvasTexture(c));
    t.userData = { aspect: c.width / c.height };
    var s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false, depthTest: false }));
    s.userData.h = h || 0.04; s.userData.isLabel = true; s.userData.noFit = true; s.userData.text = text; s.userData.opts = o;
    s.scale.set(s.userData.h * t.userData.aspect, s.userData.h, 1);
    s.renderOrder = 12; s.center.set(0.5, 0.5);
    return s;
  }
  function setLabel(s, text) {
    if (!s || s.userData.text === text) return;
    s.userData.text = text;
    var c = labelCanvas(text, s.userData.opts), old = s.material.map;
    var t = srgb(new THREE.CanvasTexture(c)); t.userData = { aspect: c.width / c.height };
    s.material.map = t; s.material.needsUpdate = true; if (old) old.dispose();
    var k = s.userData._boost || 1;
    s.scale.set(s.userData.h * t.userData.aspect * k, s.userData.h * k, 1);
  }

  /* bob: lathe profile (sphere with a turned equator groove and a neck), centre band, hook eye, centre punch */
  function bobGeometry(r) {
    var p = [], N = 28;
    for (var i = 0; i <= N; i++) {
      var a = -Math.PI / 2 + Math.PI * i / N, y = Math.sin(a) * r, rad = Math.cos(a) * r;
      rad *= 1 - 0.035 * Math.exp(-Math.pow(y / (0.09 * r), 2));
      p.push(new THREE.Vector2(Math.max(0.0004, rad), y));
    }
    p[p.length - 1] = new THREE.Vector2(0.26 * r, r * 0.99);
    p.push(new THREE.Vector2(0.24 * r, r * 1.14), new THREE.Vector2(0.0004, r * 1.16));
    return new THREE.LatheGeometry(p, 36);
  }
  function makeBob(M, r, heavy) {
    var g = new THREE.Group();
    var geo = bobGeometry(r);
    var brass = new THREE.Mesh(geo, M.brass), wood = new THREE.Mesh(geo, M.wood);
    brass.castShadow = wood.castShadow = true;
    g.add(brass, wood);
    var band = new THREE.Mesh(new THREE.TorusGeometry(r * 1.003, r * 0.035, 6, 48), M.blackPlastic); band.rotation.x = Math.PI / 2;
    var punch = new THREE.Mesh(new THREE.CircleGeometry(r * 0.12, 16), M.blackPlastic); punch.position.z = r * 1.004;
    var centre = new THREE.Group(); centre.add(band, punch);
    g.add(centre);
    var eye = new THREE.Mesh(new THREE.TorusGeometry(r * 0.22, r * 0.05, 8, 18), M.steel); eye.position.y = r * 1.3;
    g.add(eye);
    g.userData = { brass: brass, wood: wood, centre: centre, r: r };
    if (heavy) wood.visible = false;
    return g;
  }
  /* split cork: two tapered D-section halves (extruded) with the thread between, gripped by clamp jaws */
  function splitCork(M, h, R) {
    var grp = new THREE.Group();
    var half = new THREE.Shape(); half.absarc(0, 0, R, -Math.PI / 2, Math.PI / 2, false); half.lineTo(0, -R);
    var hg = new THREE.ExtrudeGeometry(half, { depth: h, bevelEnabled: true, bevelThickness: 0.0012, bevelSize: 0.001, bevelSegments: 2, curveSegments: 18 });
    hg.rotateX(Math.PI / 2); hg.translate(0, h, 0);
    var pos = hg.attributes.position;
    for (var i = 0; i < pos.count; i++) { var y = pos.getY(i), k = 0.86 + 0.14 * Math.max(0, Math.min(1, y / h)); pos.setX(i, pos.getX(i) * k); pos.setZ(i, pos.getZ(i) * k); }
    hg.computeVertexNormals();
    var c1 = new THREE.Mesh(hg, M.cork); c1.position.x = 0.0008;
    var c2 = new THREE.Mesh(hg, M.cork); c2.rotation.y = Math.PI; c2.position.x = -0.0008;
    grp.add(c1, c2);
    var knot = new THREE.Mesh(new THREE.SphereGeometry(0.0022, 10, 8), M.thread); knot.position.y = h + 0.003; grp.add(knot);
    var tail = rod(v3(0, h, 0), v3(0.004, h + 0.012, 0.002), 0.0007, M.thread, 6); grp.add(tail);
    var inner = rod(v3(0, 0, 0), v3(0, h, 0), 0.0007, M.thread, 6); grp.add(inner);
    return grp;
  }
  function clampJaws(M, h, R) {
    var g = new THREE.Group();
    [-1, 1].forEach(function (s) {
      var jaw = slab(0.006, h * 0.72, 0.028, 0.002, M.darkSteel); jaw.position.set(s * (R + 0.0035), h * 0.14, 0); g.add(jaw);
      var lining = slab(0.0016, h * 0.66, 0.024, 0.0007, M.felt); lining.position.set(s * (R + 0.0003), h * 0.17, 0); g.add(lining);
    });
    var bridge = slab(0.006, 0.006, 0.028, 0.002, M.darkSteel); bridge.scale.x = (2 * R + 0.013) / 0.006; bridge.position.set(0, h * 0.86, 0); g.add(bridge);
    var screw = rod(v3(R + 0.006, h * 0.5, 0), v3(R + 0.03, h * 0.5, 0), 0.0024, M.steel, 10); g.add(screw);
    var wing = new THREE.Mesh(new THREE.BoxGeometry(0.003, 0.016, 0.004), M.steel); wing.position.set(R + 0.031, h * 0.5, 0); g.add(wing);
    var nut = new THREE.Mesh(new THREE.CylinderGeometry(0.0045, 0.0045, 0.004, 6), M.steel); nut.rotation.z = Math.PI / 2; nut.position.set(R + 0.027, h * 0.5, 0); g.add(nut);
    return g;
  }
  function retortStand(M, height, x) {
    var g = new THREE.Group();
    var base = slab(0.34, 0.022, 0.2, 0.025, M.paint); base.position.set(x + 0.12, 0, 0); g.add(base);
    var rodM = new THREE.Mesh(new THREE.CylinderGeometry(0.0075, 0.0075, height, 18), M.steel);
    rodM.position.set(x, height / 2 + 0.02, 0); g.add(rodM);
    var cap = new THREE.Mesh(new THREE.SphereGeometry(0.0085, 12, 8), M.steel); cap.position.set(x, height + 0.02, 0); g.add(cap);
    var foot = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.02, 0.03, 18), M.darkSteel); foot.position.set(x, 0.035, 0); g.add(foot);
    return g;
  }
  function bossHead(M, x, y, armTo) {
    var g = new THREE.Group();
    var boss = slab(0.034, 0.03, 0.03, 0.006, M.darkSteel); boss.position.set(x, y - 0.015, 0); g.add(boss);
    g.add(rod(v3(x, y, 0.015), v3(x, y, 0.045), 0.0035, M.steel));
    var knob = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.008, 14), M.blackPlastic); knob.rotation.x = Math.PI / 2; knob.position.set(x, y, 0.05); g.add(knob);
    g.add(rod(v3(x + 0.015, y, 0), v3(armTo, y, 0), 0.0055, M.steel));
    return g;
  }
  /* metre rule: rounded wooden strip, face texture, brass end caps. Top end (0 cm) at local y = 0, hangs down. */
  function metreRule(M, startCm, lenCm, width) {
    var g = new THREE.Group(), L = lenCm / 100, w = width || 0.028;
    var bodyG = new THREE.ExtrudeGeometry(roundedRect(w, 0.006, 0.0015), { depth: L, bevelEnabled: false, curveSegments: 4 });
    bodyG.rotateX(Math.PI / 2); // extrude along -y from 0
    var body = new THREE.Mesh(bodyG, M.rule); g.add(body);
    var face = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.96, L), new THREE.MeshStandardMaterial({ map: ruleTexture(startCm, lenCm, false), roughness: 0.7 }));
    face.position.set(0, -L / 2, 0.0031); g.add(face);
    [0, -L].forEach(function (y) { var cap = new THREE.Mesh(new THREE.BoxGeometry(w * 1.02, 0.004, 0.0068), M.brass); cap.position.y = y + (y ? 0.002 : -0.002); g.add(cap); });
    g.userData.L = L;
    return g;
  }
  /* set-square: extruded right triangle with its triangular window */
  function setSquare(M, a, b) {
    var s = new THREE.Shape(); s.moveTo(0, 0); s.lineTo(-a, 0); s.lineTo(0, -b); s.lineTo(0, 0);
    var k = 0.28, hole = new THREE.Path(); hole.moveTo(-a * k * 0.55, -b * k * 0.5); hole.lineTo(-a * (1 - k * 1.2), -b * k * 0.5); hole.lineTo(-a * k * 0.55, -b * (1 - k * 1.2)); hole.lineTo(-a * k * 0.55, -b * k * 0.5);
    s.holes.push(hole);
    var g = new THREE.ExtrudeGeometry(s, { depth: 0.0025, bevelEnabled: false });
    var m = new THREE.Mesh(g, M.setSquare); m.renderOrder = 3; return m;
  }
  /* protractor: half-ring (extruded with the inner window) + printed scale, centre at the pivot, opening downwards */
  function protractor(M, R) {
    var g = new THREE.Group();
    var s = new THREE.Shape(); s.absarc(0, 0, R, Math.PI, TAU, false); s.lineTo(R * 0.55, 0); s.absarc(0, 0, R * 0.55, TAU, Math.PI, true); s.lineTo(-R, 0);
    var body = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: 0.002, bevelEnabled: false, curveSegments: 40 }), M.protractor);
    body.renderOrder = 2; g.add(body);
    var faceS = new THREE.Shape(); faceS.absarc(0, 0, R, Math.PI, TAU, false); faceS.lineTo(-R, 0);
    var fg = new THREE.ShapeGeometry(faceS, 48), pos = fg.attributes.position, uv = fg.attributes.uv;
    for (var i = 0; i < pos.count; i++) uv.setXY(i, (pos.getX(i) + R) / (2 * R), 1 + pos.getY(i) / R);
    var face = new THREE.Mesh(fg, M.protractorScale); face.position.z = 0.0022; face.renderOrder = 4; g.add(face);
    return g;
  }
  /* stopwatch: lathe case, knurled crown + ring, start/lap buttons, live LCD face */
  function stopwatch(M) {
    var g = new THREE.Group();
    var prof = [v3(0.0005, -0.008), v3(0.034, -0.008), v3(0.039, -0.004), v3(0.04, 0.0), v3(0.039, 0.004), v3(0.035, 0.008), v3(0.0005, 0.008)]
      .map(function (p) { return new THREE.Vector2(p.x, p.y); });
    var body = new THREE.Mesh(new THREE.LatheGeometry(prof, 48), M.blackPlastic); body.rotation.x = Math.PI / 2; g.add(body);
    var bezel = new THREE.Mesh(new THREE.TorusGeometry(0.0345, 0.0022, 8, 48), M.chrome); bezel.position.z = 0.008; g.add(bezel);
    var crown = new THREE.Mesh(new THREE.CylinderGeometry(0.0065, 0.0065, 0.012, 16), M.chrome); crown.position.y = 0.045; g.add(crown);
    for (var i = 0; i < 12; i++) { var k = new THREE.Mesh(new THREE.BoxGeometry(0.0012, 0.011, 0.0012), M.darkSteel); var a = i / 12 * TAU; k.position.set(Math.cos(a) * 0.0068, 0.045, Math.sin(a) * 0.0068); g.add(k); }
    var ring = new THREE.Mesh(new THREE.TorusGeometry(0.009, 0.0017, 8, 20), M.chrome); ring.position.y = 0.057; g.add(ring);
    [-1, 1].forEach(function (s) { var b = new THREE.Mesh(new THREE.CylinderGeometry(0.0042, 0.0042, 0.008, 14), M.chrome); b.position.set(s * 0.027, 0.03, 0); b.rotation.z = -s * 0.75; g.add(b); });
    var c = document.createElement("canvas"); c.width = 256; c.height = 256;
    var tex = srgb(new THREE.CanvasTexture(c)); tex.userData = { canvas: c };
    var face = new THREE.Mesh(new THREE.CircleGeometry(0.0335, 40), new THREE.MeshBasicMaterial({ map: tex }));
    face.position.z = 0.0082; g.add(face);
    var glassM = new THREE.Mesh(new THREE.CircleGeometry(0.0335, 40), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.05, metalness: 0, transparent: true, opacity: 0.12, depthWrite: false }));
    glassM.position.z = 0.0086; g.add(glassM);
    var last = "";
    g.userData.draw = function (main, sub, sub2, running) {
      var key = main + "|" + sub + "|" + sub2 + "|" + running; if (key === last) return; last = key;
      var x = c.getContext("2d");
      x.fillStyle = "#26292f"; x.fillRect(0, 0, 256, 256);
      x.fillStyle = "#c9d6c1"; x.beginPath(); x.roundRect ? x.roundRect(28, 70, 200, 116, 14) : x.rect(28, 70, 200, 116); x.fill();
      x.fillStyle = "#18200f"; x.textAlign = "center"; x.font = "bold 62px monospace"; x.fillText(main, 128, 128);
      x.font = "bold 22px monospace"; x.fillText(sub || "", 128, 158); if (sub2) x.fillText(sub2, 128, 180);
      x.fillStyle = running ? "#d22e2e" : "#5d6b52"; x.beginPath(); x.arc(128, 214, 8, 0, TAU); x.fill();
      x.fillStyle = "#9aa3ad"; x.font = "bold 18px sans-serif"; x.fillText("START", 62, 52); x.fillText("LAP", 194, 52);
      tex.needsUpdate = true;
    };
    g.userData.draw("0.00", "", "", false);
    return g;
  }
  /* rest marker: a pin on a small weighted foot with a chalk tip, behind the rest position */
  function restMarker(M) {
    var g = new THREE.Group();
    var foot = slab(0.05, 0.012, 0.036, 0.008, M.darkSteel); g.add(foot);
    var post = new THREE.Mesh(new THREE.CylinderGeometry(0.0022, 0.0022, 1, 10), M.steel); post.position.y = 0.5; g.add(post);
    var tip = new THREE.Mesh(new THREE.ConeGeometry(0.004, 0.02, 12), M.chalk); g.add(tip);
    g.userData = { post: post, tip: tip };
    g.userData.setTop = function (y) { var h = Math.max(0.03, y - 0.01); post.scale.y = h; post.position.y = h / 2; tip.position.y = h + 0.01; };
    return g;
  }
  /* paper cone (Barton): thin lathe shell hung apex-up, rolled rim, paper seam */
  function paperCone(M, rc, hc) {
    var g = new THREE.Group();
    var p = [new THREE.Vector2(0.0006, 0), new THREE.Vector2(rc * 0.35, -hc * 0.35), new THREE.Vector2(rc, -hc)];
    var shell = new THREE.Mesh(new THREE.LatheGeometry(p, 32), M.paper); g.add(shell);
    var rim = new THREE.Mesh(new THREE.TorusGeometry(rc, 0.0012, 6, 36), M.paper); rim.rotation.x = Math.PI / 2; rim.position.y = -hc; g.add(rim);
    var seam = rod(v3(0, 0, 0.0005), v3(0, -hc, rc + 0.0004), 0.0006, M.cord, 4); g.add(seam);
    return g;
  }

  /* a swinging pendulum: pivot group → thread (unit cylinder scaled) + bob (or any hanging body) */
  function makeSwing(M, body, threadR) {
    var pivot = new THREE.Group();
    var thread = new THREE.Mesh(new THREE.CylinderGeometry(threadR || 0.0007, threadR || 0.0007, 1, 6), M.thread);
    pivot.add(body); pivot.add(thread);
    var dirV = new THREE.Vector3();
    return {
      pivot: pivot, thread: thread, body: body, len: 1,
      set: function (threadLen, bodyY) { thread.scale.y = Math.max(0.001, threadLen); thread.position.y = -threadLen / 2; body.position.y = bodyY; },
      /* plane swing angle θx in the xy plane (+x), optional sideways θz (conical path) */
      angle: function (ax, az) {
        if (!az) { pivot.quaternion.identity(); pivot.rotation.set(0, 0, ax); return; }
        dirV.set(Math.sin(ax), -Math.sqrt(Math.max(0, 1 - Math.sin(ax) * Math.sin(ax) - Math.sin(az) * Math.sin(az))), Math.sin(az)).normalize();
        pivot.quaternion.setFromUnitVectors(v3(0, -1, 0), dirV);
      }
    };
  }

  function tagPart(obj, key, parts) {
    obj.userData.partId = key;
    obj.traverse(function (c) { if (!c.userData.partId) c.userData.partId = key; });
    if (parts) parts[key] = obj;
    return obj;
  }
  function attachCompat(g, parts, updateFn, setStateFn) {
    g.userData.parts = parts; g.userData.update = updateFn; g.userData.setState = setStateFn;
    g.group = g; g.parts = parts; g.tick = updateFn; g.update = updateFn; g.setState = setStateFn;
    return g;
  }
  function makeHighlighter(scene) {
    var saved = [];
    function clear() { saved.forEach(function (s) { s.mesh.material = s.orig; }); saved.length = 0; }
    function highlight(part, colorHex) {
      clear(); if (!part || !scene) return;
      var col = new THREE.Color(colorHex != null ? colorHex : 0xffd166);
      scene.traverse(function (o) {
        if (o.isMesh && o.userData && o.userData.partId === part && o.material && !Array.isArray(o.material) && o.material.emissive) {
          var c = o.material.clone(); c.emissive.copy(col); c.emissiveIntensity = 0.65;
          saved.push({ mesh: o, orig: o.material }); o.material = c;
        }
      });
    }
    return { highlight: highlight, clear: clear };
  }

  /* =========================================================
     4. DEFAULTS
     ========================================================= */
  var MODES = ["trace", "laws", "forces", "practical", "ceiling", "energy", "barton"];
  var COMMON = { l: 0.80, angle_deg: 10, g: 9.8, bob: 100, r_bob: 0.020, periodModel: "small", n: 20, speed: 1, labels: true, fault: "none", coneAngle_deg: 15, decay: 1, seed: 7 };
  var DEFAULTS = {
    trace: { l: 0.80, angle_deg: 10, g: 9.8, periodModel: "small", speed: 0.35, n: 20, reactionError: 0.2 },
    laws: { l: 0.50, angle_deg: 10, g: 9.8, bob: 100, periodModel: "exact", n: 20 },
    forces: { l: 0.50, angle_deg: 20, g: 9.8, bob: 100, periodModel: "exact", speed: 0.6 },
    practical: { l: 0.400, angle_deg: 10, g: 9.79, bob: 100, periodModel: "small", n: 20, fault: "none" },
    ceiling: { H: 2.80, y: 1.80, angle_deg: 8, g: 9.8, periodModel: "small", n: 20 },
    energy: { l: 0.80, angle_deg: null, h0: 0.05, g: 9.8, bob: 100, periodModel: "small", speed: 0.6, decay: 1 },
    barton: { driverL: 0.60, cones: [0.30, 0.45, 0.60, 0.75, 0.90], g: 9.8, zeta: 0.06, driverAngle_deg: 8, kappa: 0.30, speed: 1 }
  };
  function settingsFor(mode, extra) {
    var s = {}, k;
    for (k in COMMON) s[k] = COMMON[k];
    for (k in DEFAULTS[mode]) s[k] = Array.isArray(DEFAULTS[mode][k]) ? DEFAULTS[mode][k].slice() : DEFAULTS[mode][k];
    if (extra) for (k in extra) if (extra[k] !== undefined && k !== "mode" && k !== "onEvent") s[k] = extra[k];
    if (mode === "energy" && s.angle_deg == null) s.angle_deg = model.angleForHeight(s.l, s.h0);
    return s;
  }

  /* =========================================================
     5. CREATE
     ========================================================= */
  function create(opts) {
    opts = opts || {};
    var M = makeMaterials();
    var g = new THREE.Group(); g.name = "PendulumKit";
    var parts = {};
    var onEvent = typeof opts.onEvent === "function" ? opts.onEvent : function () {};
    var mode = MODES.indexOf(opts.mode) >= 0 ? opts.mode : "laws";
    var S = {};
    MODES.forEach(function (m) { S[m] = settingsFor(m, m === mode ? opts : (opts.shared ? opts : null)); });
    var labels = [];
    function addLabel(parent, text, x, y, z, h) { var s = label(text, (h || 0.032) * 1.45); s.position.set(x, y, z || 0); parent.add(s); labels.push(s); return s; }

    /* ---------------- A. the stand rig (trace / laws / forces / practical / energy) ---------------- */
    var PIV = { x: 0.12, y: 1.42 }, CORK_H = 0.04, CORK_R = 0.011;
    var stand = new THREE.Group(); stand.name = "stand-rig"; g.add(stand);
    var bench = slab(1.0, 0.04, 0.5, 0.02, M.bench); bench.position.set(0.18, -0.04, 0); bench.userData.noFit = true; stand.add(bench);
    var standParts = new THREE.Group(); stand.add(standParts);
    var standBody = retortStand(M, 1.52, -0.08); standParts.add(standBody); tagPart(standBody, "stand", parts);
    var clamp = new THREE.Group(); clamp.add(bossHead(M, -0.08, PIV.y + 0.022, PIV.x - CORK_R - 0.006));
    var jaws = clampJaws(M, CORK_H, CORK_R); jaws.position.set(PIV.x, PIV.y, 0); clamp.add(jaws);
    standParts.add(clamp); tagPart(clamp, "clamp", parts);
    var cork = splitCork(M, CORK_H, CORK_R); cork.position.set(PIV.x, PIV.y, 0); stand.add(cork); tagPart(cork, "cork", parts);
    var bob = makeBob(M, 0.020);
    var swing = makeSwing(M, bob); swing.pivot.position.set(PIV.x, PIV.y, 0); stand.add(swing.pivot);
    tagPart(bob.userData.centre, "bob-centre", parts); tagPart(bob, "bob", parts); tagPart(swing.thread, "thread", parts);
    var marker = restMarker(M); marker.position.set(PIV.x, 0, -0.07); standParts.add(marker); tagPart(marker, "marker", parts);
    var rule = metreRule(M, 0, 100); rule.position.set(PIV.x + 0.045, PIV.y, -0.032); standParts.add(rule); tagPart(rule, "ruler", parts);
    var sq = setSquare(M, 0.065, 0.09); sq.position.set(PIV.x + 0.031, 1, -0.0285); standParts.add(sq); tagPart(sq, "set-square", parts);
    var prot = protractor(M, 0.11); prot.position.set(PIV.x, PIV.y, -0.016); standParts.add(prot); tagPart(prot, "protractor", parts);
    var sw = stopwatch(M); sw.position.set(0.42, 0.05, 0.12); sw.rotation.set(-0.3, -0.35, 0); stand.add(sw); tagPart(sw, "stopwatch", parts);
    var swStand = slab(0.05, 0.012, 0.03, 0.006, M.blackPlastic); swStand.position.set(0.42, 0, 0.12); stand.add(swStand);
    /* count overlay + callouts (sprites; never over the bob) */
    var countLbl = addLabel(stand, "0", PIV.x + 0.16, PIV.y - 0.16, 0.02, 0.05);
    var calloutLbl = addLabel(stand, "", PIV.x + 0.2, 1.0, 0.02, 0.032);
    var lCork = addLabel(standParts, "split cork", PIV.x + 0.12, PIV.y + 0.07, 0, 0.03);
    var lClamp = addLabel(standParts, "clamp", -0.02, PIV.y + 0.07, 0, 0.03);
    var lRule = addLabel(standParts, "metre rule", PIV.x + 0.12, PIV.y - 0.62, -0.03, 0.03);
    var lMarker = addLabel(standParts, "rest mark", PIV.x - 0.12, 0.25, -0.07, 0.03);
    var lWatch = addLabel(stand, "stopwatch", 0.42, 0.14, 0.12, 0.03);
    /* trace extras: ghost bobs at A, O, B with fraction tags, amplitude ruler O → A */
    var traceG = new THREE.Group(); stand.add(traceG);
    var ghostGeo = bobGeometry(0.02), ghosts = {}, ghostLbl = {};
    ["A", "O", "B"].forEach(function (k) {
      var m = new THREE.Mesh(ghostGeo, M.ghost); m.renderOrder = 5; traceG.add(m); ghosts[k] = m;
      ghostLbl[k] = addLabel(traceG, k, 0, 0, 0.03, 0.034);
    });
    tagPart(traceG, "ghosts", parts);
    var ampRule = new THREE.Group();
    var arBody = new THREE.Mesh(new THREE.BoxGeometry(1, 0.012, 0.004), M.rule); arBody.position.x = 0.5; ampRule.add(arBody);
    var arFace = new THREE.Mesh(new THREE.PlaneGeometry(1, 0.0115), new THREE.MeshStandardMaterial({ map: ruleTexture(0, 30, true), roughness: 0.7 }));
    arFace.position.set(0.5, 0, 0.0021); ampRule.add(arFace);
    traceG.add(ampRule); tagPart(ampRule, "amp-ruler", parts);
    var ampLbl = addLabel(traceG, "A", 0, 0, 0.03, 0.03);
    /* forces extras: dashed vertical, angle arc */
    var forcesG = new THREE.Group(); stand.add(forcesG);
    var vLine = dashedLine([v3(PIV.x, PIV.y, 0.001), v3(PIV.x, PIV.y - 0.6, 0.001)], M.dash); forcesG.add(vLine);
    var arcPts = []; for (var ai = 0; ai <= 24; ai++) arcPts.push(v3(PIV.x, PIV.y - 0.1, 0));
    var arcLine = dashedLine(arcPts, M.dashAmber); forcesG.add(arcLine);
    var pathPts = []; for (ai = 0; ai <= 40; ai++) pathPts.push(v3(0, 0, 0));
    var pathLine = dashedLine(pathPts, M.dash); stand.add(pathLine);
    /* energy extras: KE / PE / total bars, lowest-point level, h */
    var energyG = new THREE.Group(); stand.add(energyG);
    var EP = { x: 0.62, w: 0.045, max: 0.5 };
    var panel = slab(0.24, 0.62, 0.012, 0.01, M.panel); panel.position.set(EP.x, 0, -0.03); energyG.add(panel);
    var bars = {};
    [["ke-bar", M.ke, -0.07, "KE"], ["pe-bar", M.pe, 0, "PE"], ["total-bar", M.total, 0.07, "Total"]].forEach(function (b) {
      var m = slab(EP.w, 1, 0.02, 0.006, b[1]); m.position.set(EP.x + b[2], 0.03, -0.012); energyG.add(m); bars[b[0]] = m; tagPart(m, b[0], parts);
      addLabel(energyG, b[3], EP.x + b[2], 0.01, 0.03, 0.028);
    });
    var lowLine = dashedLine([v3(PIV.x - 0.3, 0, 0.002), v3(PIV.x + 0.32, 0, 0.002)], M.dash); energyG.add(lowLine);
    var hBar = rod(v3(0, 0, 0), v3(0, 1, 0), 0.0016, M.dim, 6); energyG.add(hBar); tagPart(hBar, "h-marker", parts);
    var hLbl = addLabel(energyG, "h", 0, 0, 0.03, 0.03);
    /* draught streaks */
    var windG = new THREE.Group(); stand.add(windG);
    for (var wi = 0; wi < 6; wi++) { var wp = []; for (var q = 0; q <= 10; q++) wp.push(v3(q * 0.02, Math.sin(q * 0.8 + wi) * 0.004, 0)); var wl = new THREE.Line(new THREE.BufferGeometry().setFromPoints(wp), M.wind); wl.userData.noPick = true; wl.userData.noFit = true; windG.add(wl); }

    /* ---------------- B. ceiling rig ---------------- */
    var ceil = new THREE.Group(); ceil.name = "ceiling-rig"; g.add(ceil);
    var floor = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.04, 1.0), M.tiles); floor.position.set(0.1, -0.02, 0); floor.userData.noFit = true; ceil.add(floor);
    var ceilSlab = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.08, 1.0), M.plaster); ceilSlab.userData.noFit = true; ceil.add(ceilSlab);
    var wall = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 3.2), M.plaster); wall.position.set(0.1, 1.5, -0.42); wall.userData.noFit = true; ceil.add(wall);
    var hook = new THREE.Group();
    var plate = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.006, 24), M.steel); plate.position.y = -0.003; hook.add(plate);
    var hookRing = new THREE.Mesh(new THREE.TorusGeometry(0.008, 0.0022, 8, 20), M.steel); hookRing.position.y = -0.016; hook.add(hookRing);
    ceil.add(hook); tagPart(hook, "hook", parts);
    var cbob = makeBob(M, 0.020);
    var cswing = makeSwing(M, cbob); ceil.add(cswing.pivot);
    tagPart(cbob.userData.centre, "bob-centre", null); tagPart(cbob, "bob", null); tagPart(cswing.thread, "thread", null);
    var cRules = new THREE.Group(); ceil.add(cRules);
    [[0, 100], [100, 100], [200, 50]].forEach(function (r) { var m = metreRule(M, r[0], r[1]); m.position.set(0, (r[0] + r[1]) / 100, 0); cRules.add(m); });
    cRules.position.set(0.05, 0, -0.03); tagPart(cRules, "ruler", null);
    var csq = setSquare(M, 0.065, 0.09); ceil.add(csq); tagPart(csq, "set-square", null);
    var dimH = new THREE.Group(); ceil.add(dimH);
    var dimHRod = rod(v3(0, 0, 0), v3(0, 1, 0), 0.0025, M.dim, 6); dimH.add(dimHRod);
    var cone1 = new THREE.Mesh(new THREE.ConeGeometry(0.012, 0.03, 12), M.dim), cone2 = cone1.clone(); cone2.rotation.z = Math.PI; dimH.add(cone1, cone2);
    var dimY = new THREE.Group(); ceil.add(dimY);
    var dimYRod = rod(v3(0, 0, 0), v3(0, 1, 0), 0.0025, M.dim, 6); dimY.add(dimYRod);
    var cone3 = cone1.clone(), cone4 = cone2.clone(); dimY.add(cone3, cone4);
    var lH = addLabel(ceil, "H = 2.80 m", -0.36, 1.4, 0.05, 0.06), lY = addLabel(ceil, "y", 0.24, 0.9, 0.05, 0.06), lL = addLabel(ceil, "l = H − y", 0.26, 2.3, 0.05, 0.06);
    var cMarkG = restMarker(M); ceil.add(cMarkG); tagPart(cMarkG, "marker", null);

    /* ---------------- C. Barton's pendulums ---------------- */
    var bart = new THREE.Group(); bart.name = "barton-rig"; g.add(bart);
    var BT = { x0: -0.72, x1: 0.72, y: 1.18, driverX: -0.56, coneX: [-0.34, -0.14, 0.06, 0.26, 0.46], rc: 0.028, hc: 0.065 };
    var bBase = slab(1.62, 0.04, 0.32, 0.02, M.wood); bBase.position.y = 0; bart.add(bBase);
    var bBench = slab(1.9, 0.04, 0.6, 0.02, M.bench); bBench.position.y = -0.04; bBench.userData.noFit = true; bart.add(bBench);
    [BT.x0 - 0.02, BT.x1 + 0.02].forEach(function (x) {
      var post = slab(0.04, BT.y + 0.05, 0.04, 0.006, M.post); post.position.set(x, 0.04, 0); bart.add(post);
      var peg = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.06, 10), M.steel); peg.rotation.x = Math.PI / 2; peg.position.set(x, BT.y, 0.02); bart.add(peg);
      var knot = new THREE.Mesh(new THREE.TorusGeometry(0.008, 0.0025, 8, 16), M.cord); knot.position.set(x, BT.y, 0.024); bart.add(knot);
    });
    function cordY(x) { var u = (x - BT.x0) / (BT.x1 - BT.x0); return BT.y - 0.012 * Math.sin(Math.PI * u); }
    function cordShape(x) { var u = (x - BT.x0) / (BT.x1 - BT.x0); return Math.sin(Math.PI * Math.max(0, Math.min(1, u))); }
    var cordPts = []; for (var ci = 0; ci <= 30; ci++) { var cx = BT.x0 + (BT.x1 - BT.x0) * ci / 30; cordPts.push(v3(cx, cordY(cx), 0)); }
    var cord = tube(cordPts, 0.0018, M.cord, 90, 6); bart.add(cord); tagPart(cord, "cord", parts);
    var cordBase = Float32Array.from(cord.geometry.attributes.position.array);
    var dbob = makeBob(M, 0.034, true);
    var dswing = makeSwing(M, dbob, 0.0011); bart.add(dswing.pivot); tagPart(dbob, "driver", parts); tagPart(dswing.thread, "driver", null);
    var dTag = addLabel(bart, "driver", BT.driverX - 0.04, BT.y + 0.15, 0, 0.04);
    var cones = [], coneTags = [];
    BT.coneX.forEach(function (x, i) {
      var body = paperCone(M, BT.rc, BT.hc);
      var s = makeSwing(M, body, 0.0006); bart.add(s.pivot);
      tagPart(body, "cone-" + (i + 1), parts); tagPart(s.thread, "cone-" + (i + 1), null);
      cones.push(s); coneTags.push(addLabel(bart, "", x, BT.y + 0.075, 0, 0.032));
    });
    var bRule = metreRule(M, 0, 100); bRule.position.set(BT.x1 - 0.08, BT.y - 0.004, -0.03); bart.add(bRule); tagPart(bRule, "ruler", null);
    var bLeg = addLabel(bart, "", 0, 0.12, 0.2, 0.04);

    /* materials: one clone per mesh so a highlight only lights its own part */
    g.traverse(function (o) { if (o.isMesh && o.material && !Array.isArray(o.material) && !o.userData.shareMat) o.material = o.material.clone(); });

    /* =========================================================
       6. SIMULATION STATE
       ========================================================= */
    var sim, watch, meas, rows, flags, bartonSim, simT = 0, rand = rng(opts.seed || 7);
    function T_phys() {
      var s = S[mode];
      if (mode === "practical") return model.practical(s.l, s).Tphys;
      if (mode === "ceiling") return model.periodSmall(s.H - s.y, s.g);
      return model.period(s.l, s.g, s.angle_deg, s.periodModel);
    }
    function amp0() { var s = S[mode]; if (mode === "practical" && s.fault === "wide-angle") return 40; return s.angle_deg; }
    function resetSim(keepRows) {
      sim = { state: mode === "forces" ? "swing" : "rest", tPull: 0, tSwing: 0, th: 0, thz: 0, from: 0 };
      if (mode === "forces") sim.th = amp0() * D2R;
      watch = { state: "idle", t: 0, n: 0, start: 0, stopAt: 0, target: 0, nTarget: 0, countFrom: 0, display: "0.00", manual: null, pending: null, lap: "" };
      meas = { state: mode === "practical" ? "idle" : "done", u: mode === "practical" ? 0 : 1 };
      if (!keepRows) { rows = []; flags = { changed: {}, done: false, timings: 0 }; }
      bartonSim = { running: false, t: 0 };
    }
    resetSim();

    function emit(name, detail) { try { onEvent(name, detail); } catch (e) { /* caller errors must not stop the kit */ } }

    /* ---------- release / timing ---------- */
    function release() {
      if (mode === "barton") { start(); return; }
      if (sim.state === "swing") return;
      sim.state = "pull"; sim.tPull = 0; sim.from = sim.th;
      emit("release", { mode: mode });
    }
    function swingTheta(ts) {
      var T = T_phys(), w = TAU / T, a = amp0() * D2R, s = S[mode];
      var dec = s.decay != null && s.decay < 1 ? Math.pow(s.decay, ts / T) : 1;
      if (mode === "practical" && s.fault === "draught") dec *= Math.pow(0.96, ts / T);
      var th = a * dec * Math.cos(w * ts), thz = 0;
      if (mode === "practical" && s.fault === "conical") { var c = s.coneAngle_deg * D2R; th = c * Math.cos(w * ts); thz = c * Math.sin(w * ts); }
      else if (mode === "practical" && s.fault === "draught") thz = 0.06 * a * Math.sin(w * ts * 0.37);
      return { th: th, thz: thz, w: w, T: T };
    }
    /* model time for this timing run */
    function modelTime(n) {
      var s = S[mode];
      if (mode === "practical") { var P = model.practical(s.l, s); return watch.trial === 2 ? P.t2 : P.t1; }
      if (mode === "ceiling") return model.ceiling(s.H, s.y, s.g, n).t;
      return model.timeFor(n, s.l, s.g, s.angle_deg, s.periodModel);
    }
    function time(n, o) {
      o = o || {};
      if (mode === "barton" || mode === "energy" || mode === "forces") return null;
      var s = S[mode]; n = n || s.n || 20;
      if (mode === "practical") watch.trial = (watch.trial === 1 && watch.lastL === s.l && watch.lastFault === s.fault) ? 2 : 1;
      watch.nTarget = n; watch.target = modelTime(n);
      watch.countFrom = (mode === "practical" && s.fault === "count-from-1") ? 1 : 0;
      watch.fromExtreme = mode === "practical" && s.fault === "time-from-extreme";
      watch.manual = null;
      if (o.instant) { finishTiming(); return reading(); }
      watch.state = "armed"; watch.t = 0; watch.n = watch.countFrom;
      if (sim.state === "rest") release();
      emit("timing", { mode: mode, n: n });
      return null;
    }
    function nextEventAfter(ts, T, extreme) {
      // θ = A cos(ωt): rest mark at ωt = π/2 + kπ, extremes at ωt = kπ
      var w = TAU / T, ph = w * ts, k = extreme ? Math.ceil(ph / Math.PI + 1e-9) : Math.ceil((ph - Math.PI / 2) / Math.PI + 1e-9);
      return extreme ? k * Math.PI / w : (Math.PI / 2 + k * Math.PI) / w;
    }
    function finishTiming() {
      var s = S[mode];
      watch.state = "stopped"; watch.t = watch.target; watch.n = watch.nTarget;
      watch.display = watch.target.toFixed(2);
      flags.timings++;
      var rec;
      if (mode === "practical") {
        var P = model.practical(s.l, s);
        if (watch.trial === 1) { watch.t1 = P.t1; watch.t2 = null; } else { watch.t1 = P.t1; watch.t2 = P.t2; }
        watch.lastL = s.l; watch.lastFault = s.fault;
        if (watch.trial === 2) {
          rec = { l: round(P.l, 3), t1: P.t1, t2: P.t2, tmean: round(P.tmean, 2), T: round(P.T, 3), T2: round(P.T2, 3), fault: P.fault, g_from_T: round(P.g_from_T, 2) };
          rows = rows.filter(function (r) { return !(r.l === rec.l && r.fault === rec.fault); }); rows.push(rec);
          rows.sort(function (a, b) { return a.l - b.l; });
        }
        watch.lap = watch.trial === 1 ? "t1 " + P.t1.toFixed(2) : "t2 " + P.t2.toFixed(2);
      } else if (mode === "ceiling") {
        var C = model.ceiling(s.H, s.y, s.g, watch.nTarget);
        rec = { y: s.y, l: round(C.l, 3), t: C.t, T: round(C.T, 3), T2: round(C.T2, 3) };
        rows = rows.filter(function (r) { return r.y !== rec.y; }); rows.push(rec);
      } else {
        var T = watch.target / watch.nTarget;
        rec = { mode: mode, l: s.l, angle: s.angle_deg, g: s.g, bob: s.bob, n: watch.nTarget, t: watch.target, T: round(T, 3), f: round(1 / T, 3), w: round(TAU / T, 2) };
        rows.push(rec);
        watch.lap = "n " + watch.nTarget;
      }
      var R = reading();
      emit("timed", R);
      emit("reading", R);
      checkDone();
    }
    function checkDone() {
      if (flags.done) return;
      var ok = false, s = S[mode];
      if (mode === "practical") { var ls = {}; rows.forEach(function (r) { if (r.fault === "none") ls[r.l] = 1; }); ok = Object.keys(ls).length >= 5; }
      else if (mode === "laws") ok = flags.changed.bob && flags.changed.angle_deg && flags.changed.l && flags.changed.g && flags.timings > 0;
      else if (mode === "trace") ok = rows.some(function (r) { return r.n === 20; });
      else if (mode === "ceiling") ok = rows.length >= 2;
      if (ok) { flags.done = true; emit("done", reading()); }
      void s;
    }
    /* L01 manual stopwatch with modelled reaction delays (0.1–0.3 s, seeded) */
    function startWatch() {
      if (sim.state === "rest") release();
      var d = 0.1 + 0.2 * rand();
      watch.manual = { pressStart: simT, delayStart: d, startAt: simT + d, delayStop: null, stopAt: null };
      watch.state = "manual"; watch.t = 0; watch.n = 0; watch.lap = "";
      emit("watch-start", { delay: d });
    }
    function stopWatch() {
      if (!watch.manual || watch.manual.stopAt != null) return null;
      var d = 0.1 + 0.2 * rand();
      watch.manual.delayStop = d; watch.manual.stopAt = simT + d;
      return null;
    }
    function measure() {
      if (mode !== "practical" && mode !== "ceiling") return;
      meas.state = "run"; meas.u = 0;
      if (sim.state !== "rest") { resetSim(true); }
    }
    function start() {
      if (mode !== "barton") { release(); return; }
      bartonSim.running = true; bartonSim.t = 0; bartonSim.steadyEmitted = false;
      emit("release", { mode: "barton" });
    }

    /* =========================================================
       7. READING
       ========================================================= */
    function reading() {
      var s = S[mode], out;
      if (mode === "barton") {
        var B = model.barton(s);
        var steady = bartonSim.running && bartonSim.t > 3 * Math.max.apply(null, B.tau);
        out = { mode: mode, driverL: B.driverL, T: B.T, fDriver: B.fDriver, w: B.w, g: B.g, cones: B.cones,
          amps: B.amps.map(function (a) { return round(a, 1); }), ampsRel: B.ampsRel.map(function (a) { return round(a, 3); }),
          phases: B.phases.map(function (p) { return round(p, 0); }), widest: B.widest, widestPart: "cone-" + B.widest, widestL: B.widestL,
          running: bartonSim.running, steady: steady, t: bartonSim.t,
          live: cones.map(function (c, i) { return round(bartonLive[i] * R2D, 1); }) };
        out.rows = rows.slice(); out.done = flags.done; out.watch = { state: "idle", display: "", n: 0 };
        return out;
      }
      if (mode === "ceiling") {
        var C = model.ceiling(s.H, s.y, s.g, s.n);
        out = { mode: mode, H: s.H, y: s.y, l: C.l, g: s.g, n: s.n, T: C.T, T2: C.T2, t: watch.state === "stopped" ? C.t : null, slope: C.slope };
      } else if (mode === "practical") {
        var P = model.practical(s.l, s);
        out = { mode: mode, l: P.l, l_true: P.l_true, r_bob: s.r_bob, thread: round(s.l - s.r_bob, 3), angle: P.angle, g: s.g, bob: s.bob, n: s.n,
          t1: watch.t1 != null && watch.lastL === s.l && watch.lastFault === s.fault ? watch.t1 : null,
          t2: watch.t2 != null && watch.lastL === s.l && watch.lastFault === s.fault ? watch.t2 : null,
          fault: s.fault, note: P.note, periodModel: "small", measured: meas.state === "done" };
        if (out.t1 != null && out.t2 != null) { out.tmean = P.tmean; out.T = P.T; out.T2 = P.T2; out.g_from_T = P.g_from_T; }
        else { out.tmean = null; out.T = null; out.T2 = null; out.g_from_T = null; }
        out.expected = { t1: P.t1, t2: P.t2, tmean: P.tmean, T: P.T, T2: P.T2, g_from_T: P.g_from_T };
      } else {
        var Sm = model.summary(s.l, s.g, s.angle_deg, s.periodModel);
        out = { mode: mode, l: s.l, angle: s.angle_deg, g: s.g, bob: s.bob, periodModel: s.periodModel, n: watch.nTarget || s.n,
          T: Sm.T, f: Sm.f, w: Sm.w, T2: Sm.T2, t: watch.state === "stopped" ? watch.target : null,
          fault: "none", g_from_T: model.gFrom(s.l, Sm.T) };
        if (mode === "trace") {
          var e = s.reactionError || 0.2, ts = sim.state === "swing" ? sim.tSwing : 0, frac = ((ts / Sm.T) % 1 + 1) % 1;
          out.fraction = round(frac, 3); out.phase = frac < 0.125 || frac >= 0.875 ? "A" : frac < 0.375 ? "O" : frac < 0.625 ? "B" : "O";
          out.A_cm = round(100 * s.l * Math.sin(s.angle_deg * D2R), 1);
          out.reactionError = e; out.errOne_pct = model.reactionError(Sm.T, 1, e); out.errTwenty_pct = model.reactionError(Sm.T, 20, e);
          out.pins = [0, 0.25, 0.5, 0.75, 1].map(function (k, i) { return { at: "AOBOA"[i], frac: k, t: round(k * Sm.T, 2) }; });
        }
        if (mode === "energy") {
          var th = sim.state === "swing" ? sim.th * R2D : s.angle_deg, a0 = currentAmp() * R2D;
          var E = model.energy(s.bob / 1000, s.l, s.g, a0, Math.min(Math.abs(th), a0));
          out.h0 = E.h0; out.h = E.h; out.E = E.E; out.KE = E.KE; out.PE = E.PE; out.v = E.v; out.vmax = E.vmax; out.E0 = model.energy(s.bob / 1000, s.l, s.g, s.angle_deg, 0).E;
        }
      }
      if (watch.manual) {
        var m = watch.manual;
        out.manual = { delayStart: m.delayStart, delayStop: m.delayStop, t: m.stopAt != null ? round(m.stopAt - m.startAt, 2) : null, n: watch.n };
      }
      out.rows = rows.slice(); out.done = flags.done; out.watch = { state: watch.state, display: watch.display, n: watch.n };
      return out;
    }
    function currentAmp() {
      var s = S[mode], T = T_phys(), ts = sim.state === "swing" ? sim.tSwing : 0;
      return amp0() * D2R * (s.decay != null && s.decay < 1 ? Math.pow(s.decay, ts / T) : 1);
    }

    /* =========================================================
       8. LAYOUT per mode
       ========================================================= */
    var bartonLive = [0, 0, 0, 0, 0];
    function layout() {
      var s = S[mode];
      stand.visible = mode !== "ceiling" && mode !== "barton";
      ceil.visible = mode === "ceiling"; bart.visible = mode === "barton";
      var lab = s.labels !== false;
      labels.forEach(function (l) { l.visible = lab; });
      if (stand.visible) {
        var full = mode !== "forces";
        standParts.visible = true; standBody.visible = full; marker.visible = full; bench.visible = full; sw.visible = full; swStand.visible = full;
        rule.visible = full && mode !== "energy"; sq.visible = mode === "practical" || mode === "laws";
        prot.visible = mode === "laws" || mode === "practical";
        traceG.visible = mode === "trace"; forcesG.visible = mode === "forces"; energyG.visible = mode === "energy";
        pathLine.visible = mode === "trace" || mode === "forces" || (mode === "practical" && (s.fault === "conical" || s.fault === "wide-angle"));
        windG.visible = mode === "practical" && s.fault === "draught";
        countLbl.userData.allowed = lab && (mode === "practical" || mode === "laws" || mode === "trace");
        countLbl.visible = false;
        calloutLbl.visible = lab && mode === "practical";
        lWatch.visible = lab && full; lClamp.visible = lab && full; lRule.visible = lab && rule.visible; lMarker.visible = lab && full; lCork.visible = lab && full;
        var heavy = s.bob === 100;
        bob.userData.brass.visible = heavy; bob.userData.wood.visible = !heavy;
        var L = s.l, threadLen = L - s.r_bob * 1.16;
        swing.set(Math.max(0.01, threadLen), -L);
        marker.userData.setTop(PIV.y - L);
        // set-square at the bob centre (or top for the length-to-top fault)
        var toTop = mode === "practical" && s.fault === "length-to-top";
        sq.userData.targetY = PIV.y - L + (toTop ? s.r_bob : 0);
        if (mode !== "practical") sq.position.y = sq.userData.targetY;
        // ghosts
        if (mode === "trace") {
          var a = s.angle_deg * D2R;
          [["A", a], ["O", 0], ["B", -a]].forEach(function (k) {
            var gx = PIV.x + Math.sin(k[1]) * L, gy = PIV.y - Math.cos(k[1]) * L;
            ghosts[k[0]].position.set(gx, gy, 0);
            ghostLbl[k[0]].position.set(gx + (k[0] === "A" ? 0.09 : k[0] === "B" ? -0.07 : 0), gy + (k[0] === "O" ? -0.075 : 0.045), 0.03);
          });
          ampRule.position.set(PIV.x, PIV.y - L - 0.034, 0.012); ampRule.scale.x = Math.max(0.01, Math.sin(a) * L);
          arFace.material.map.repeat.set(1, 1);
          ampLbl.position.set(PIV.x + Math.sin(a) * L / 2 + 0.04, PIV.y - L - 0.125, 0.03);
          setLabel(ampLbl, "A = " + (100 * Math.sin(a) * L).toFixed(1) + " cm");
        }
        // swing path arc
        var pa = (mode === "practical" && s.fault === "wide-angle") ? 40 * D2R : s.angle_deg * D2R, pp = [];
        for (var i = 0; i <= 40; i++) {
          if (mode === "practical" && s.fault === "conical") { var ca = s.coneAngle_deg * D2R, ph = i / 40 * TAU; pp.push(v3(PIV.x + Math.sin(ca) * L * Math.cos(ph), PIV.y - Math.cos(ca) * L, Math.sin(ca) * L * Math.sin(ph))); }
          else { var u = -pa + 2 * pa * i / 40; pp.push(v3(PIV.x + Math.sin(u) * L, PIV.y - Math.cos(u) * L, 0)); }
        }
        setLine(pathLine, pp);
        setLine(vLine, [v3(PIV.x, PIV.y, 0.001), v3(PIV.x, PIV.y - L - 0.05, 0.001)]);
        if (mode === "forces") updateArc();
        // energy
        if (mode === "energy") {
          lowLine.position.y = PIV.y - L;
        }
        windG.children.forEach(function (w, i) { w.position.set(PIV.x - 0.25, PIV.y - L - 0.06 + i * 0.024, 0.03); });
        countLbl.position.set(PIV.x - 0.17, PIV.y - L * 0.55, 0.03);
        lRule.position.y = PIV.y - 0.62;
      }
      if (ceil.visible) {
        var H = s.H, y = s.y, lc = H - y;
        ceilSlab.position.set(0.1, H + 0.04, 0);
        hook.position.set(0, H, 0);
        cswing.pivot.position.set(0, H - 0.022, 0);
        cswing.set(lc - 0.022 - 0.026, -(lc - 0.022));
        cbob.userData.brass.visible = true; cbob.userData.wood.visible = false;
        csq.position.set(0.05 - 0.014 + 0.0, y, -0.03 + 0.004);
        csq.userData.targetY = y;
        cMarkG.position.set(0, 0, -0.08); cMarkG.userData.setTop(y);
        dimHRod.position.set(0, 0, 0); between(dimHRod, v3(0, 0.03, 0), v3(0, H - 0.03, 0));
        cone1.position.set(0, H - 0.015, 0); cone2.position.set(0, 0.015, 0); dimH.position.set(-0.3, 0, 0.05);
        between(dimYRod, v3(0, 0.03, 0), v3(0, y - 0.03, 0)); cone3.position.set(0, y - 0.015, 0); cone4.position.set(0, 0.015, 0); dimY.position.set(0.17, 0, 0.05);
        setLabel(lH, "H = " + H.toFixed(2) + " m"); lH.position.set(-0.3, H * 0.5, 0.06);
        setLabel(lY, "y = " + y.toFixed(2) + " m"); lY.position.set(0.3, y * 0.5, 0.06);
        setLabel(lL, "l = H − y = " + lc.toFixed(2) + " m"); lL.position.set(0.3, y + lc * 0.5, 0.06);
      }
      if (bart.visible) {
        var B = model.barton(s);
        dswing.pivot.position.set(BT.driverX, cordY(BT.driverX), 0);
        dswing.set(s.driverL - 0.034 * 1.3, -s.driverL);
        cones.forEach(function (c, i) {
          var li = s.cones[i] != null ? s.cones[i] : 0.5, x = BT.coneX[i];
          c.pivot.position.set(x, cordY(x), 0);
          c.set(li - BT.hc * 2 / 3, -(li - BT.hc * 2 / 3));
          setLabel(coneTags[i], li.toFixed(2) + " m");
        });
        setLabel(dTag, "driver " + s.driverL.toFixed(2) + " m");
        setLabel(bLeg, "T = " + B.T.toFixed(3) + " s · f = " + B.fDriver.toFixed(2) + " Hz");
      }
    }

    /* =========================================================
       9. UPDATE
       ========================================================= */
    var hl = { part: null, mats: [] };
    function update(dt, t) {
      dt = Math.min(0.1, Math.max(0, dt || 0));
      var s = S[mode], sp = s.speed != null ? s.speed : 1, sdt = dt * sp;
      simT += sdt;
      if (mode === "barton") updateBarton(sdt);
      else if (mode === "ceiling") updateSwing(sdt, cswing);
      else updateSwing(sdt, swing);
      updateMeasure(dt);
      if (mode !== "barton") updateWatchFace();
      // highlight pulse
      if (hl.part) { var p = 0.35 + 0.35 * Math.sin((t || simT) * 6); hl.mats.forEach(function (m) { m.mat.emissive.setHex(0xffb23f); m.mat.emissiveIntensity = p; }); }
      // draught streaks drift
      if (windG.visible) windG.children.forEach(function (w, i) { w.position.x = PIV.x - 0.3 + ((simT * 0.25 + i * 0.17) % 0.6); });
    }
    function updateSwing(sdt, sw_) {
      var s = S[mode];
      if (sim.state === "pull") {
        sim.tPull += sdt; var u = Math.min(1, sim.tPull / 0.6), e = u * u * (3 - 2 * u);
        sim.th = sim.from + (amp0() * D2R - sim.from) * e; sim.thz = 0;
        if (mode === "practical" && s.fault === "conical") sim.th = s.coneAngle_deg * D2R * e;
        if (u >= 1) { sim.state = "swing"; sim.tSwing = 0; }
      } else if (sim.state === "swing") {
        sim.tSwing += sdt;
        var st = swingTheta(sim.tSwing); sim.th = st.th; sim.thz = st.thz;
        // timing
        var T = st.T;
        if (watch.state === "armed") {
          watch.start = nextEventAfter(sim.tSwing - sdt, T, watch.fromExtreme); watch.state = "running";
        }
        if (watch.state === "running") {
          var el = sim.tSwing - watch.start;
          if (el < 0) { watch.display = "0.00"; watch.n = watch.countFrom; }
          else if (el >= watch.target) finishTiming();
          else { watch.t = el; watch.display = el.toFixed(2); watch.n = Math.min(watch.nTarget, watch.countFrom + Math.floor(el / T + 1e-6)); }
        }
        if (watch.state === "manual" && watch.manual) {
          var m = watch.manual, now = simT;
          var end = m.stopAt != null ? Math.min(now, m.stopAt) : now;
          var e2 = Math.max(0, end - m.startAt);
          watch.t = e2; watch.display = e2.toFixed(2); watch.n = Math.floor(e2 / T + 1e-6);
          if (m.stopAt != null && now >= m.stopAt && !m.reported) {
            m.reported = true; watch.state = "stopped-manual";
            var Tm = (m.stopAt - m.startAt);
            rows.push({ mode: mode, manual: true, n: watch.n, t: round(Tm, 2), delayStart: round(m.delayStart, 2), delayStop: round(m.delayStop, 2) });
            var R = reading(); emit("timed", R); emit("reading", R);
          }
        }
      }
      sw_.angle(sim.th, sim.thz);
      if (mode === "trace") {
        var cyc = sim.state === "swing" ? sim.tSwing / T_phys() : -1, lab = s.labels !== false;
        ghosts.A.visible = cyc >= 0; ghosts.O.visible = cyc >= 0.25; ghosts.B.visible = cyc >= 0.5;
        setLabel(ghostLbl.A, cyc >= 1 ? "A · 0 and 1" : "A · 0");
        setLabel(ghostLbl.O, cyc >= 0.75 ? "O · ¼ and ¾" : "O · ¼");
        setLabel(ghostLbl.B, "B · ½");
        ghostLbl.A.visible = lab && ghosts.A.visible; ghostLbl.O.visible = lab && ghosts.O.visible; ghostLbl.B.visible = lab && ghosts.B.visible;
      }
      if (mode === "energy" && stand.visible) updateEnergyBars();
      if (mode === "forces") updateArc();
    }
    function updateArc() {
      var L = Math.min(0.14, S[mode].l * 0.35), th = sim.th, pts = [];
      for (var i = 0; i <= 24; i++) { var u = th * i / 24; pts.push(v3(PIV.x + Math.sin(u) * L, PIV.y - Math.cos(u) * L, 0.002)); }
      setLine(arcLine, pts);
    }
    function updateEnergyBars() {
      var s = S[mode], a0 = s.angle_deg, E0 = model.energy(s.bob / 1000, s.l, s.g, a0, 0).E;
      var amp = currentAmp() * R2D, th = sim.state === "rest" ? a0 : Math.min(Math.abs(sim.th * R2D), amp);
      var E = model.energy(s.bob / 1000, s.l, s.g, sim.state === "rest" ? a0 : amp, th);
      function set(b, v) { var h = Math.max(0.002, EP.max * v / E0); bars[b].scale.y = h; }
      set("ke-bar", E.KE); set("pe-bar", E.PE); set("total-bar", E.E);
      var bx = PIV.x + Math.sin(sim.th) * s.l, by = PIV.y - Math.cos(sim.th) * s.l, low = PIV.y - s.l;
      between(hBar, v3(bx + 0.03, low, 0.01), v3(bx + 0.03, Math.max(low + 0.0005, by), 0.01));
      hLbl.position.set(bx + 0.06, (low + by) / 2 + 0.005, 0.03);
      setLabel(hLbl, "h " + (100 * E.h).toFixed(1) + " cm");
      hLbl.visible = (s.labels !== false) && E.h > 0.004;
    }
    function updateBarton(sdt) {
      var s = S[mode], B = model.barton(s);
      var th = 0, ph = 0;
      if (bartonSim.running) {
        bartonSim.t += sdt; var tt = bartonSim.t;
        ph = B.w * tt; th = s.driverAngle_deg * D2R * Math.cos(ph);
        cones.forEach(function (c, i) {
          var env = 1 - Math.exp(-tt / B.tau[i]);
          bartonLive[i] = B.amps[i] * D2R * env * Math.cos(ph - B.phases[i] * D2R);
        });
        if (!bartonSim.steadyEmitted && tt > 3 * Math.max.apply(null, B.tau)) {
          bartonSim.steadyEmitted = true;
          rows = rows.filter(function (r) { return r.driverL !== s.driverL; });
          rows.push({ driverL: s.driverL, T: round(B.T, 3), f: round(B.fDriver, 2), widest: "cone-" + B.widest, amps: B.amps.map(function (a) { return round(a, 1); }).join("/") });
          var R = reading(); emit("reading", R); emit("steady", R); if (!flags.done) { flags.done = true; emit("done", R); } }
      } else cones.forEach(function (c, i) { bartonLive[i] = 0; });
      // swings are perpendicular to the cord (z)
      dswing.pivot.rotation.set(th, 0, 0);
      var Sx = bartonSim.running ? B.S * 0.5 * Math.cos(ph) : 0;
      cones.forEach(function (c, i) {
        var x = BT.coneX[i]; c.pivot.position.z = -Sx * cordShape(x); c.pivot.rotation.set(bartonLive[i], 0, 0);
      });
      dswing.pivot.position.z = -Sx * cordShape(BT.driverX);
      // flex the cord with the support motion
      var pos = cord.geometry.attributes.position;
      for (var k = 0; k < pos.count; k++) { var x0 = cordBase[k * 3]; pos.setZ(k, cordBase[k * 3 + 2] - Sx * cordShape(x0)); }
      pos.needsUpdate = true;
    }
    function updateMeasure(dt) {
      if (mode === "practical") {
        var s = S[mode], L = s.l, restY = 0.12;
        if (meas.state === "run") { meas.u = Math.min(1, meas.u + dt / 2.6); if (meas.u >= 1) { meas.state = "done"; var R = reading(); emit("measured", { thread: R.thread, r_bob: s.r_bob, l: R.l, fault: s.fault }); } }
        var u = meas.u;
        var ru = Math.min(1, u / 0.38), re = ru * ru * (3 - 2 * ru);
        rule.position.y = (meas.state === "idle" ? 1.0 + 0.0 : 1.0 + (PIV.y - 1.0) * re);
        if (meas.state === "idle") rule.position.y = 1.0;
        var topY = PIV.y - L + s.r_bob, cenY = PIV.y - L, toTop = s.fault === "length-to-top";
        var su = Math.max(0, Math.min(1, (u - 0.38) / 0.3)), se = su * su * (3 - 2 * su);
        var sy = restY + (topY - restY) * se;
        if (u > 0.72 && !toTop) { var cu = Math.min(1, (u - 0.72) / 0.28); sy = topY + (cenY - topY) * cu * cu * (3 - 2 * cu); }
        sq.position.y = meas.state === "idle" ? restY : sy;
        var txt = "";
        if (meas.state !== "idle" && u > 0.5) txt = "thread " + (L - s.r_bob).toFixed(3) + " m";
        if (u > 0.8) txt = toTop ? "l = " + (L - s.r_bob).toFixed(3) + " m (no + r)" : "+ r 2.0 cm → l " + L.toFixed(3) + " m";
        if (s.r_bob !== 0.02 && u > 0.8 && !toTop) txt = "+ r " + (100 * s.r_bob).toFixed(1) + " cm → l " + L.toFixed(3) + " m";
        setLabel(calloutLbl, txt || " ");
        calloutLbl.visible = (s.labels !== false) && !!txt;
        calloutLbl.position.set(PIV.x + 0.22, sq.position.y + 0.03, 0.03);
      } else if (mode === "laws") {
        rule.position.y = PIV.y;
      } else if (mode === "trace" || mode === "energy") {
        rule.position.y = PIV.y;
      }
    }
    function updateWatchFace() {
      var s = S[mode], sub = "", sub2 = "";
      if (mode === "trace") {
        var T = model.period(s.l, s.g, s.angle_deg, s.periodModel), e = s.reactionError || 0.2;
        sub = "1 osc " + model.reactionError(T, 1, e).toFixed(1) + "%"; sub2 = "20 osc " + model.reactionError(T, 20, e).toFixed(1) + "%";
        if (watch.state === "stopped" || watch.state === "running") sub2 = "n " + watch.n + "  " + sub2;
      } else if (mode === "practical") {
        sub = watch.t1 != null && watch.lastL === s.l ? "t1 " + watch.t1.toFixed(2) : "n " + watch.n;
        sub2 = watch.t2 != null && watch.lastL === s.l ? "t2 " + watch.t2.toFixed(2) : (watch.state === "running" ? "n " + watch.n : "");
      } else sub = "n " + watch.n;
      sw.userData.draw(watch.display, sub, sub2, watch.state === "running" || watch.state === "manual");
      var showCount = watch.state === "running" || watch.state === "stopped" || watch.state === "manual" || watch.state === "stopped-manual";
      if (showCount) setLabel(countLbl, "count " + watch.n);
      countLbl.visible = !!countLbl.userData.allowed && showCount;
    }

    /* =========================================================
       10. STATE / API
       ========================================================= */
    function setState(patch) {
      patch = patch || {};
      if (patch.mode && patch.mode !== mode && MODES.indexOf(patch.mode) >= 0) {
        mode = patch.mode; resetSim(); emit("mode", { mode: mode });
      }
      var s = S[mode], changedSwing = false;
      ["l", "angle_deg", "g", "bob", "periodModel", "fault", "H", "y", "driverL", "h0", "coneAngle_deg", "decay", "r_bob"].forEach(function (k) {
        if (patch[k] !== undefined && patch[k] !== s[k]) { flags.changed[k] = true; changedSwing = true; }
      });
      for (var k in patch) if (k !== "mode" && k !== "onEvent" && patch[k] !== undefined) s[k] = Array.isArray(patch[k]) ? patch[k].slice() : patch[k];
      if (patch.h0 !== undefined && mode === "energy") s.angle_deg = model.angleForHeight(s.l, s.h0);
      if (patch.reset) { resetSim(); }
      else if (changedSwing && mode !== "forces") {
        var wasRunning = bartonSim && bartonSim.running;
        resetSim(true);
        if (mode === "barton" && wasRunning) bartonSim.running = true;
      }
      layout();
      emit("state", { mode: mode, settings: JSON.parse(JSON.stringify(s)) });
    }
    function reset() { S[mode] = settingsFor(mode, null); resetSim(); layout(); emit("reset", { mode: mode }); }

    function highlight(part) {
      hl.mats.forEach(function (m) { m.mat.emissive.setHex(m.e); m.mat.emissiveIntensity = m.i; });
      hl.mats = []; hl.part = part || null;
      if (!part) return;
      var root = activeRoot();
      root.traverse(function (o) {
        if (o.isMesh && o.userData.partId === part && o.material && o.material.emissive) hl.mats.push({ mat: o.material, e: o.material.emissive.getHex(), i: o.material.emissiveIntensity });
      });
    }
    function activeRoot() { return mode === "ceiling" ? ceil : mode === "barton" ? bart : stand; }
    var _box = new THREE.Box3(), _b2 = new THREE.Box3();
    function visibleBox(root, part) {
      _box.makeEmpty(); g.updateMatrixWorld(true);
      root.traverse(function (o) {
        if (!(o.isMesh || o.isLine) || o.userData.noFit || o.userData.isLabel) return;
        var p = o, vis = true; while (p) { if (!p.visible) { vis = false; break; } if (p === root) break; p = p.parent; }
        if (!vis) return;
        if (part && o.userData.partId !== part) return;
        o.geometry.computeBoundingBox(); _b2.copy(o.geometry.boundingBox).applyMatrix4(o.matrixWorld); _box.union(_b2);
      });
      return _box;
    }
    function viewFor(part) {
      var root = activeRoot(), all = !part || part === "all";
      if (part === "conical") {
        var cb = new THREE.Box3().setFromObject(pathLine), cc = cb.getCenter(new THREE.Vector3()), cs = cb.getSize(new THREE.Vector3()).max(v3(0.15, 0.15, 0.15));
        var cd = Math.max(cs.x, cs.z) * 1.6 / 2 / Math.tan(20 * D2R);
        return { target: [cc.x, cc.y, cc.z], dist: cd, size: [cs.x * 1.6, cs.z * 1.6, 0], pitch: 1.25, yaw: 0, yawPortrait: 0 };
      }
      var b = visibleBox(root, all ? null : part);
      if (b.isEmpty()) b = visibleBox(root, null);
      var c = b.getCenter(new THREE.Vector3()), sz = b.getSize(new THREE.Vector3());
      if (!all) sz.multiplyScalar(1.8).max(v3(0.12, 0.12, 0.05));
      var h = Math.max(sz.y, sz.x * 0.75), dist = (h / 2) / Math.tan(20 * D2R) * 1.12 + sz.z / 2;
      var yaw = mode === "barton" ? 0.62 : 0, pitch = mode === "barton" ? 0.2 : mode === "ceiling" ? 0.05 : 0.1;
      if (part === "conical") { yaw = 0; pitch = 1.2; }
      return { target: [c.x, c.y, c.z], dist: dist, size: [sz.x, sz.y, sz.z], pitch: pitch, yaw: yaw, yawPortrait: yaw };
    }
    function pickPart(ray) {
      var hits = ray.intersectObject(activeRoot(), true);
      for (var i = 0; i < hits.length; i++) {
        var o = hits[i].object, vis = true, p = o;
        while (p) { if (!p.visible) { vis = false; break; } p = p.parent; }
        if (vis && o.isMesh && o.userData.partId && !o.userData.isLabel) return o.userData.partId;
      }
      return null;
    }
    function triangles() {
      var n = 0, root = activeRoot();
      root.traverse(function (o) {
        if (!o.isMesh) return; var p = o, vis = true; while (p) { if (!p.visible) { vis = false; break; } p = p.parent; }
        if (!vis) return; var gg = o.geometry; n += (gg.index ? gg.index.count : gg.attributes.position.count) / 3;
      });
      return Math.round(n);
    }

    var partsByMode = {
      trace: ["bob", "thread", "cork", "clamp", "marker", "ruler", "stopwatch", "ghosts", "amp-ruler"],
      laws: ["bob", "thread", "cork", "clamp", "marker", "protractor", "ruler", "set-square", "stopwatch"],
      forces: ["bob", "thread", "cork"],
      practical: ["cork", "clamp", "thread", "bob", "bob-centre", "ruler", "set-square", "marker", "stopwatch", "protractor"],
      ceiling: ["hook", "thread", "bob", "ruler", "set-square", "marker"],
      energy: ["bob", "thread", "cork", "ke-bar", "pe-bar", "total-bar", "h-marker"],
      barton: ["driver", "cord", "cone-1", "cone-2", "cone-3", "cone-4", "cone-5", "ruler"]
    };
    /* parts map follows the active mode for ceiling / barton duplicates */
    function refreshParts() {
      var root = activeRoot(), map = {};
      root.traverse(function (o) { var id = o.userData.partId; if (id && !map[id] && o.userData.partId === id && (!o.parent || o.parent.userData.partId !== id)) map[id] = o; });
      Object.keys(parts).forEach(function (k) { delete parts[k]; });
      Object.keys(map).forEach(function (k) { parts[k] = map[k]; });
    }

    attachCompat(g, parts, update, function (patch) { setState(patch); refreshParts(); });
    g.reading = reading; g.highlight = function (p) { highlight(p); }; g.clearHighlight = function () { highlight(null); };
    g.viewFor = viewFor; g.pickPart = pickPart; g.triangles = triangles;
    g.release = function () { release(); }; g.time = time; g.startWatch = startWatch; g.stopWatch = stopWatch;
    g.measure = measure; g.start = start; g.reset = function () { reset(); refreshParts(); };
    g.setMode = function (m) { g.setState({ mode: m }); }; g.getMode = function () { return mode; };
    g.partsFor = function (m) { return (partsByMode[m || mode] || []).slice(); };
    g.settings = function () { return JSON.parse(JSON.stringify(S[mode])); };
    g.model = model;

    layout(); refreshParts();
    if (opts.autoRelease || mode === "forces") release();
    return g;
  }

  global.PendulumKit = {
    create: create,
    model: model,
    defaults: { common: COMMON, modes: DEFAULTS },
    modes: MODES.slice(),
    faults: FAULTS.slice(),
    makeHighlighter: makeHighlighter,
    builders: { bob: makeBob, splitCork: splitCork, metreRule: metreRule, protractor: protractor, stopwatch: stopwatch, paperCone: paperCone, setSquare: setSquare },
    version: 3
  };
})(window);
