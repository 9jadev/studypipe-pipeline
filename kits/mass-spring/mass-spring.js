/* ==========================================================
   StudyPipe Kit: mass-spring (v2) · window.MassSpringKit
   Vertical mass on a helical spring + okada rear coil-over shock, for SHM lessons.
   Classic script (no modules), 100 % offline, three.js only (window.THREE), no fetch, no image files.

   MassSpringKit.create(opts) -> THREE.Group g with
     g.group / g.parts / g.userData.parts   named parts of the CURRENT mode/view (meshes tagged userData.partId)
     g.tick / g.update / g.userData.update(dt, t)
     g.setState(patch) (= userData.setState)   mode, m, k, A, medium, view, mass, kOkada, zeta, leak,
                                               speed_kmh, d, Y, parked, labels, n, timeScale, tubeMass ...
     g.reading()            every number from MassSpringKit.model (never typed text)
     g.highlight(part)      pulsing emissive highlight (null clears)
     g.viewFor(part)        { target:[x,y,z], dist, pitch, yawPortrait }  camera framing hint ("all" = whole mode)
     g.pickPart(raycaster)  -> partId | null
     g.action(name, payload)  narrator hook: add-mass, remove-mass, release, time, start-watch, stop-watch,
                              record, press, push, push-train, ride, stop, reset
     g.addMass() g.removeMass() g.release(A) g.timeN(n, reaction) g.startWatch(delay) g.stopWatch(delay)
     g.recordAmplitude() g.press(A) g.push() g.pushTrain(n, interval) g.reset()
   Modes: hooke · period · forces · energy · damping · testtube · okada (view "bench" = riding / parked bike,
          view "shock" = cut-away coil-over shock absorber)
   Okada body: window.RidgeRoadProps.okada() if loaded first (setBounce, setWheelBump, setSpeed, liftCrate, crack);
               otherwise a built-in stand-in okada (lifted from the hub's welcome-lab.js geometry).

   Scale: 1 scene unit = 1 m. y up, viewer on +z. Lab bench top at y = 0; road at y = 0.
   ========================================================== */
(function (global) {
  "use strict";
  if (typeof THREE === "undefined") return;
  var V3 = THREE.Vector3, TAU = Math.PI * 2;

  /* ===================================================================
     1. THE PHYSICS MODEL (pure functions; every reading comes from here)
     =================================================================== */
  var G = 9.8;
  var MEDIA = {                 // amplitude ratio per cycle (02-lesson.md L06), added-mass factor for the vane
    air:   { ratio: 0.97, added: 1.000 },
    water: { ratio: 0.75, added: 1.003 },
    oil:   { ratio: 0.40, added: 1.003 }
  };
  /* okada rear: k is defined by f0 = 2.00 Hz exactly at 200 kg (k = 4π²f0²m ≈ 31 583 N/m; labels may say 3.16 × 10⁴) */
  var STORY = { f0: 2.00, mRef: 200, kOkada: 4 * Math.PI * Math.PI * 2.00 * 2.00 * 200, kLabel: "3.16 × 10⁴ N m⁻¹", d: 2.5, Y: 0.010, zeta: { healthy: 0.30, leaking: 0.05 }, pushDv: 0.326, pushEvery: 0.5 };
  var DEFAULTS = {
    mode: "period", view: "bench", m: 0.20, k: 24.5, A: null, medium: "air", n: 20, g: G,
    mass: 200, kOkada: STORY.kOkada, zeta: null, leak: true, speed_kmh: 10, d: STORY.d, Y: STORY.Y, parked: false,
    tubeMass: 0.030, tubeR: 0.0095, rho: 1000, labels: true, timeScale: 1
  };
  var MODES = ["hooke", "period", "forces", "energy", "damping", "testtube", "okada"];
  var A_DEFAULT = { hooke: 0, period: 0.03, forces: 0.05, energy: 0.05, damping: 0.05, testtube: 0.02, okada: 0.03 };

  function r(x, d) { var p = Math.pow(10, d); return Math.round(x * p) / p; }
  function sf(x, n) { if (!isFinite(x) || x === 0) return x; var p = Math.pow(10, n - 1 - Math.floor(Math.log10(Math.abs(x)))); return Math.round(x * p) / p; }

  function spring(m, k, g) {
    g = g || G;
    var w = Math.sqrt(k / m), T = TAU / w;
    return { m: m, k: k, w: w, T: T, f: 1 / T, T2: T * T, x0: m * g / k };
  }
  function hooke(m, k, g, p0) {
    var s = spring(m, k, g), F = m * (g || G);
    return { m: m, F: F, x: s.x0, x_cm: s.x0 * 100, pointer_cm: (p0 == null ? LAB.p0cm : p0) + s.x0 * 100,
      display: { m: m.toFixed(3), F: sf(F, 3), x_cm: r(s.x0 * 100, 1).toFixed(1), pointer_cm: r((p0 == null ? LAB.p0cm : p0) + s.x0 * 100, 1).toFixed(1) } };
  }
  function period(m, k, n, reaction) {
    var s = spring(m, k), t = n * s.T + (reaction || 0);
    return { m: m, k: k, n: n, t: t, T: t / n, f: n / t, w: TAU * n / t, T2: Math.pow(t / n, 2), Tmodel: s.T,
      display: { t: t.toFixed(2), T: (t / n).toFixed(3), f: (n / t).toFixed(2), w: (TAU * n / t).toFixed(1), T2: String(sf(Math.pow(t / n, 2), 3)) } };
  }
  function energy(k, A, x) {
    var E = 0.5 * k * A * A, PE = 0.5 * k * x * x;
    return { E: E, PE: Math.min(E, PE), KE: Math.max(0, E - PE) };
  }
  function damping(medium, A0, m, k, cycles) {
    var M = MEDIA[medium] || MEDIA.air, s = spring(m, k);
    var delta = Math.log(1 / M.ratio), zeta = delta / Math.sqrt(TAU * TAU + delta * delta);
    var Td = s.T * M.added / Math.sqrt(1 - zeta * zeta), amps = [];
    for (var i = 0; i <= (cycles == null ? 5 : cycles); i++) amps.push(r(A0 * 100 * Math.pow(M.ratio, i), 2));
    return { medium: medium, ratio: M.ratio, zeta: zeta, delta: delta, T0: s.T, Td: Td, t10: 10 * Td, amps: amps, E0: 0.5 * k * A0 * A0 };
  }
  function testtube(mTube, rTube, rho, g) {
    g = g || G;
    var area = Math.PI * rTube * rTube, k = rho * g * area, w = Math.sqrt(k / mTube), T = TAU / w;
    return { m: mTube, r: rTube, rho: rho, area: area, k: k, w: w, T: T, f: 1 / T, depth: mTube / (rho * area) };
  }
  function zetaFor(leak, zeta) { return zeta != null ? zeta : (leak ? STORY.zeta.leaking : STORY.zeta.healthy); }
  function okada(speed_kmh, mass, zeta, kOk, d, Y) {
    kOk = kOk || STORY.kOkada; d = d || STORY.d; Y = Y == null ? STORY.Y : Y; zeta = zeta == null ? STORY.zeta.leaking : zeta;
    var v = speed_kmh / 3.6, f = v / d, w0 = Math.sqrt(kOk / mass), f0 = w0 / TAU, rr = f / f0;
    var A = Y * Math.sqrt(1 + Math.pow(2 * zeta * rr, 2)) / Math.sqrt(Math.pow(1 - rr * rr, 2) + Math.pow(2 * zeta * rr, 2));
    var wd = TAU * f, th = wd > 0 ? G / (wd * wd) : Infinity;
    var phase = Math.atan2(2 * zeta * rr * rr * rr, 1 - rr * rr + Math.pow(2 * zeta * rr, 2));
    return { speed_kmh: speed_kmh, v: v, f: f, f0: f0, w0: w0, T0: 1 / f0, r: rr, zeta: zeta, mass: mass, A: A, th: th, th0: G / (w0 * w0),
      lift: A >= th, phase: phase, sag: mass * G / kOk,
      display: { v: v.toFixed(2), f: f.toFixed(2), f0: f0.toFixed(2), A_cm: (A * 100).toFixed(1), th_cm: isFinite(th) ? (th * 100).toFixed(1) : "–" } };
  }
  function okadaParked(mass, n, kOk) {
    var w0 = Math.sqrt((kOk || STORY.kOkada) / mass), T = TAU / w0;
    return { mass: mass, n: n, T: T, f: 1 / T, t: n * T, display: { T: T.toFixed(2), t: (n * T).toFixed(1) } };
  }
  /* fixed-step integrator shared by the live shock view and the model check (h = 0.5 ms) */
  var SH_H = 1 / 2000;
  function shockStep(st, zeta, w0, h) {
    var a = -2 * zeta * w0 * st.v - w0 * w0 * st.x;
    st.v += a * h; st.x += st.v * h;
    return a;
  }
  function shockPushes(zeta, mass, n, dv, interval, kOk) {
    var w0 = Math.sqrt((kOk || STORY.kOkada) / mass), st = { x: 0, v: 0 }, peaks = [], steps = Math.round((interval || STORY.pushEvery) / SH_H);
    dv = dv || STORY.pushDv; n = n || 10;
    for (var p = 0; p < n; p++) {
      st.v -= dv; var mx = 0;
      for (var i = 0; i < steps; i++) { shockStep(st, zeta, w0, SH_H); mx = Math.max(mx, Math.abs(st.x)); }
      peaks.push(r(mx * 100, 2));
    }
    return peaks;
  }

  var model = {
    G: G, MEDIA: MEDIA, STORY: STORY,
    spring: spring, hooke: hooke, period: period, energy: energy, damping: damping, testtube: testtube,
    okada: okada, okadaParked: okadaParked, shockPushes: shockPushes, zetaFor: zetaFor,
    liftOff: function (A, f) { var w = TAU * f; return A * w * w >= G; }
  };

  /* ===================================================================
     2. HELPERS
     =================================================================== */
  function rng(seed) { var s = (seed || 1) >>> 0; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  function srgb(tex) {
    if ("colorSpace" in tex && THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
    else if (THREE.sRGBEncoding) tex.encoding = THREE.sRGBEncoding;
    return tex;
  }
  function canvas(w, h) { var c = document.createElement("canvas"); c.width = w; c.height = h; return c; }
  function ctex(c, rx, ry, noColor) {
    var t = new THREE.CanvasTexture(c); if (!noColor) srgb(t);
    if (rx || ry) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rx || 1, ry || 1); }
    t.anisotropy = 4; return t;
  }
  function std(color, rough, metal, extra) {
    var o = { color: color, roughness: rough == null ? 0.6 : rough, metalness: metal || 0 };
    if (extra) for (var k in extra) o[k] = extra[k];       // constructor params (hex colours become THREE.Color)
    return new THREE.MeshStandardMaterial(o);
  }
  function tagPart(obj, key) {
    if (!obj) return obj;
    obj.userData.partId = key;
    obj.traverse(function (c) { if (!c.userData.partId) c.userData.partId = key; });
    return obj;
  }
  function v3(x, y, z) { return new V3(x, y, z || 0); }
  function roundedRect(w, d, rad) {
    var s = new THREE.Shape(), x = -w / 2, y = -d / 2;
    s.moveTo(x + rad, y); s.lineTo(x + w - rad, y); s.quadraticCurveTo(x + w, y, x + w, y + rad);
    s.lineTo(x + w, y + d - rad); s.quadraticCurveTo(x + w, y + d, x + w - rad, y + d);
    s.lineTo(x + rad, y + d); s.quadraticCurveTo(x, y + d, x, y + d - rad);
    s.lineTo(x, y + rad); s.quadraticCurveTo(x, y, x + rad, y);
    return s;
  }
  /* rounded, bevelled block lying on y = 0 (w along x, d along z, height h) */
  function slab(w, h, d, rad, mat) {
    var bev = Math.min(0.004, h / 4);
    var g = new THREE.ExtrudeGeometry(roundedRect(w, d, Math.min(rad, w / 2 - 0.001, d / 2 - 0.001)), { depth: Math.max(0.0005, h - 2 * bev), bevelEnabled: true, bevelThickness: bev, bevelSize: Math.min(bev, rad / 2), bevelSegments: 2, curveSegments: 6 });
    g.rotateX(-Math.PI / 2); g.translate(0, bev, 0);
    return new THREE.Mesh(g, mat);
  }
  function tube(points, rad, mat, seg, radSeg, closed) {
    var c = new THREE.CatmullRomCurve3(points, !!closed, "catmullrom", 0.2);
    var m = new THREE.Mesh(new THREE.TubeGeometry(c, seg || 40, rad, radSeg || 10, !!closed), mat);
    m.userData.curve = c; return m;
  }
  var _up = new V3(0, 1, 0), _dir = new V3();
  function rod(a, b, rad, mat, seg) {
    var m = new THREE.Mesh(new THREE.CylinderGeometry(rad, rad, 1, seg || 12), mat);
    return between(m, a, b);
  }
  function between(mesh, p1, p2) {
    _dir.subVectors(p2, p1); var len = _dir.length();
    mesh.position.addVectors(p1, p2).multiplyScalar(0.5);
    mesh.scale.set(1, Math.max(0.0001, len), 1);
    if (len > 1e-6) mesh.quaternion.setFromUnitVectors(_up, _dir.divideScalar(len));
    return mesh;
  }
  function lathe(pts, segs, mat, phiStart, phiLength) {
    return new THREE.Mesh(new THREE.LatheGeometry(pts.map(function (p) { return new THREE.Vector2(p[0], p[1]); }), segs || 32, phiStart || 0, phiLength == null ? TAU : phiLength), mat);
  }

  /* helical spring hanging DOWN from y = 0.
     o: { R coil radius, turns, len (coil length), wire (tube radius), loops (end loops for hooks), lead (loop height),
          closedEnds (ground ends of a coil-over spring) }  returns geometry with userData.bottom (> 0) */
  function helixGeometry(o) {
    var R = o.R, turns = o.turns, len = Math.max(o.len, turns * o.wire * 2.05), lead = o.loops ? (o.lead || 0.016) : 0;
    var pts = [], N = Math.round(turns * 14), i;
    var e = o.closedEnds ? 0.85 : 0, pc = o.wire * 2.15;
    var mid = Math.max(0.0001, len - 2 * e * pc);
    function yAt(tau) {
      if (!e) return tau / turns * len;
      if (tau < e) return tau * pc;
      if (tau > turns - e) return e * pc + mid + (tau - (turns - e)) * pc;
      return e * pc + (tau - e) / (turns - 2 * e) * mid;
    }
    var rl = R * 0.62;
    if (o.loops) {   // top loop (in the x-y plane), wire then drops into the first coil
      var cTop = -lead + rl + 0.0015;
      for (i = 0; i <= 10; i++) { var a = Math.PI * 1.5 - 0.35 - i / 10 * (TAU - 0.7); pts.push(v3(Math.cos(a) * rl, cTop + Math.sin(a) * rl, 0)); }
      pts.push(v3(R * 0.55, -lead + 0.002, R * 0.2));
    }
    for (i = 0; i <= N; i++) {
      var tau = i / N * turns, ang = tau * TAU;
      pts.push(v3(Math.cos(ang) * R, -lead - yAt(tau), Math.sin(ang) * R));
    }
    var bottom = lead + len;
    if (o.loops) {
      var endA = turns * TAU;
      pts.push(v3(Math.cos(endA) * R * 0.55, -bottom - 0.002, Math.sin(endA) * R * 0.2));
      var cBot = -bottom - rl - 0.0015;
      for (i = 0; i <= 10; i++) { var b = Math.PI * 0.5 - 0.35 - i / 10 * (TAU - 0.7); pts.push(v3(Math.cos(b) * rl, cBot + Math.sin(b) * rl, 0)); }
      bottom += lead;
    }
    var curve = new THREE.CatmullRomCurve3(pts, false, "centripetal");
    var g = new THREE.TubeGeometry(curve, Math.round(turns * 18) + (o.loops ? 40 : 0), o.wire, o.radSeg || 6, false);
    g.userData = { bottom: bottom };
    return g;
  }
  /* 50 g slotted mass: a brass disc with a real radial slot (THREE.Shape + ExtrudeGeometry) */
  function slottedDiscGeometry(R, h, slotHalf) {
    var s = new THREE.Shape(), sw = slotHalf || 0.0034, a0 = Math.asin(sw / R);
    s.absarc(0, 0, R, a0, TAU - a0, false);
    s.lineTo(0.0035, -sw); s.absarc(0.0035, 0, sw, -Math.PI / 2, -Math.PI * 1.5, true); s.lineTo(R * Math.cos(a0), sw);
    var g = new THREE.ExtrudeGeometry(s, { depth: h, bevelEnabled: true, bevelThickness: 0.0006, bevelSize: 0.0006, bevelSegments: 1, curveSegments: 28 });
    g.rotateX(-Math.PI / 2);
    return g;
  }

  /* ---------------- procedural textures (seeded, offline) ---------------- */
  var TEX = {};
  function grainTex(key, base, dark, n, seed, rx) {
    if (TEX[key]) return TEX[key];
    var c = canvas(512, 256), g = c.getContext("2d"), rr = rng(seed), i;
    g.fillStyle = base; g.fillRect(0, 0, 512, 256);
    for (i = 0; i < n; i++) {
      g.strokeStyle = dark; g.globalAlpha = 0.08 + rr() * 0.22; g.lineWidth = 0.6 + rr() * 2.2;
      var p = rr() * 256, a = rr() * 6; g.beginPath();
      for (var q = 0; q <= 512; q += 12) { var off = Math.sin(q * 0.013 + a) * 4 + Math.sin(q * 0.05 + a * 2) * 1.2; if (!q) g.moveTo(q, p + off); else g.lineTo(q, p + off); }
      g.stroke();
    }
    g.globalAlpha = 1;
    return (TEX[key] = ctex(c, rx || 1, 1));
  }
  function speckleTex(key, base, cols, n, seed, size, rx) {
    if (TEX[key]) return TEX[key];
    var c = canvas(512, 256), g = c.getContext("2d"), rr = rng(seed);
    g.fillStyle = base; g.fillRect(0, 0, 512, 256);
    for (var i = 0; i < n; i++) { g.fillStyle = cols[Math.floor(rr() * cols.length)]; g.globalAlpha = 0.25 + rr() * 0.6; var s = size * (0.4 + rr()); g.beginPath(); g.arc(rr() * 512, rr() * 256, s, 0, TAU); g.fill(); }
    g.globalAlpha = 1;
    return (TEX[key] = ctex(c, rx || 1, 1));
  }
  function brushedBump() {
    if (TEX.brush) return TEX.brush;
    var c = canvas(128, 128), x = c.getContext("2d"), rr = rng(5);
    x.fillStyle = "#808080"; x.fillRect(0, 0, 128, 128);
    for (var i = 0; i < 260; i++) { x.fillStyle = "rgba(" + (rr() < 0.5 ? "255,255,255" : "0,0,0") + "," + (0.05 + rr() * 0.12) + ")"; x.fillRect(0, rr() * 128, 128, 0.6 + rr()); }
    return (TEX.brush = ctex(c, 1, 1, true));
  }
  /* vertical metre rule: 0 cm at the TOP, mm ticks, numbers every cm (readable on a phone close-up) */
  function ruleTex() {
    if (TEX.rule) return TEX.rule;
    var W = 128, H = 4096, c = canvas(W, H), g = c.getContext("2d");
    g.fillStyle = "#f3e7c6"; g.fillRect(0, 0, W, H);
    g.fillStyle = "#1b1813"; g.textBaseline = "middle";
    var m0 = 20, span = H - 40;
    for (var mm = 0; mm <= 1000; mm++) {
      var y = m0 + mm / 1000 * span;
      var len = mm % 100 === 0 ? 64 : mm % 10 === 0 ? 40 : mm % 5 === 0 ? 28 : 16;
      g.fillRect(0, y - (mm % 10 === 0 ? 1.4 : 0.7), len, mm % 10 === 0 ? 2.8 : 1.4);
      if (mm % 10 === 0) { g.font = (mm % 100 === 0 ? "bold 30px" : "22px") + " sans-serif"; g.fillText(String(mm / 10), 70, y); }
    }
    var t = ctex(c); t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping; return (TEX.rule = t);
  }
  function cardTex() {
    if (TEX.card) return TEX.card;
    var c = canvas(256, 160), g = c.getContext("2d"), rr = rng(9);
    g.fillStyle = "#efe6cf"; g.fillRect(0, 0, 256, 160);
    for (var i = 0; i < 500; i++) { g.fillStyle = "rgba(120,96,60," + rr() * 0.12 + ")"; g.fillRect(rr() * 256, rr() * 160, 2, 1); }
    g.strokeStyle = "#8a6a3a"; g.lineWidth = 6; g.strokeRect(3, 3, 250, 154);
    g.fillStyle = "rgba(60,60,60,.55)"; g.font = "bold 24px sans-serif"; g.textAlign = "center"; g.fillText("card vane", 128, 86);
    return (TEX.card = ctex(c));
  }
  function gradTex() {     // beaker graduations on a transparent band
    if (TEX.grad) return TEX.grad;
    var c = canvas(256, 512), g = c.getContext("2d");
    g.clearRect(0, 0, 256, 512); g.fillStyle = "rgba(255,255,255,.92)"; g.font = "bold 30px sans-serif"; g.textBaseline = "middle";
    for (var i = 0; i <= 10; i++) {
      var y = 500 - i * 48;
      g.fillRect(70, y - 2, i % 2 ? 50 : 90, 4);
      if (i % 2 === 0 && i) g.fillText(String(i * 50), 168, y);
    }
    g.font = "bold 26px sans-serif"; g.fillText("ml", 168, 20);
    var t = ctex(c); t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping; return (TEX.grad = t);
  }
  function tubeScaleTex() {
    if (TEX.tscale) return TEX.tscale;
    var c = canvas(64, 512), g = c.getContext("2d");
    g.fillStyle = "#f6f1e2"; g.fillRect(0, 0, 64, 512); g.fillStyle = "#222";
    for (var mm = 0; mm <= 100; mm++) { var y = 6 + mm * 5; g.fillRect(0, y, mm % 10 === 0 ? 34 : mm % 5 === 0 ? 24 : 14, mm % 10 === 0 ? 2 : 1); if (mm % 10 === 0) { g.font = "bold 16px sans-serif"; g.fillText(String(mm / 10), 38, y + 6); } }
    var t = ctex(c); t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping; return (TEX.tscale = t);
  }
  /* board behind the energy bars, with the bar captions printed on it */
  function energyBoardTex() {
    if (TEX.eboard) return TEX.eboard;
    var c = canvas(256, 512), g = c.getContext("2d");
    g.fillStyle = "#f7f4ea"; g.fillRect(0, 0, 256, 512);
    g.strokeStyle = "#c9c1aa"; g.lineWidth = 2;
    for (var y = 40; y <= 440; y += 40) { g.beginPath(); g.moveTo(16, y); g.lineTo(240, y); g.stroke(); }
    g.fillStyle = "#1d2430"; g.font = "bold 40px sans-serif"; g.textAlign = "center";
    g.fillText("KE", 52, 486); g.fillText("PE", 128, 486); g.fillText("E", 204, 486);
    g.font = "bold 26px sans-serif"; g.fillText("energy (J)", 128, 26);
    return (TEX.eboard = ctex(c));
  }
  function labelSprite(text, scale) {      // pill label; canvas sized to the text so nothing is clipped
    var m = canvas(8, 8).getContext("2d"); m.font = "bold 32px sans-serif";
    var w = Math.ceil(m.measureText(text).width + 30), c = canvas(w, 64), x = c.getContext("2d");
    x.font = "bold 32px sans-serif";
    x.fillStyle = "rgba(14,22,32,.80)"; x.beginPath();
    x.moveTo(14, 4); x.arcTo(w - 2, 4, w - 2, 60, 14); x.arcTo(w - 2, 60, 2, 60, 14); x.arcTo(2, 60, 2, 4, 14); x.arcTo(2, 4, w - 2, 4, 14); x.fill();
    x.fillStyle = "#f4f7fa"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText(text, w / 2, 33);
    var t = ctex(c); t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping; t.minFilter = THREE.LinearFilter; t.generateMipmaps = false;
    var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false, depthTest: false }));
    var h = (scale || 0.12) / 4; sp.scale.set(h * w / 64, h, 1); sp.userData.isLabel = true; sp.renderOrder = 9;
    return sp;
  }
  /* live canvas display (stopwatch / speedometer) */
  function liveFace(w, h, draw) {
    var c = canvas(w, h), t = ctex(c); t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
    var last = "";
    return { tex: t, paint: function (key, a, b, cc) { if (key === last) return; last = key; draw(c.getContext("2d"), w, h, a, b, cc); t.needsUpdate = true; } };
  }

  /* shared materials (lazily created) */
  var MAT = null;
  function mats() {
    if (MAT) return MAT;
    var bump = brushedBump();
    MAT = {
      bench: std(0xffffff, 0.75, 0, { map: grainTex("bench", "#8a5a33", "#3d2312", 70, 7, 2) }),
      wood: std(0xffffff, 0.7, 0, { map: grainTex("wood", "#b8834a", "#4a2a12", 46, 11) }),
      steel: std(0xc8ced8, 0.32, 0.65, { bumpMap: bump, bumpScale: 0.0006 }),
      darkSteel: std(0x4a505a, 0.45, 0.55, { bumpMap: bump, bumpScale: 0.0006 }),
      paint: std(0x1f3550, 0.55, 0.3),
      springSteel: std(0xc4cad4, 0.28, 0.7),
      brass: std(0xd4ab52, 0.34, 0.6, { bumpMap: bump, bumpScale: 0.0004 }),
      blackPlastic: std(0x16181d, 0.5, 0.1),
      chrome: std(0xe4e8ee, 0.18, 0.8),
      rule: std(0xffffff, 0.6, 0, { map: ruleTex() }),
      ruleEdge: std(0xd9c79b, 0.7, 0),
      pointer: std(0xd22e56, 0.4, 0.2),
      card: std(0xffffff, 0.85, 0, { map: cardTex(), side: THREE.DoubleSide }),
      glass: new THREE.MeshPhysicalMaterial({ color: 0xe6f0f6, roughness: 0.05, metalness: 0, transparent: true, opacity: 0.28, side: THREE.DoubleSide, depthWrite: false }),
      grad: new THREE.MeshBasicMaterial({ map: gradTex(), transparent: true, depthWrite: false, side: THREE.FrontSide }),
      water: std(0x6fb7e6, 0.1, 0, { transparent: true, opacity: 0.38, depthWrite: false, side: THREE.DoubleSide }),
      oilLiquid: std(0xc98a1c, 0.15, 0, { transparent: true, opacity: 0.62, depthWrite: false, side: THREE.DoubleSide }),
      lead: std(0x5d6168, 0.55, 0.6),
      paper: std(0xffffff, 0.8, 0, { map: tubeScaleTex() }),
      bungRubber: std(0x8a2a1d, 0.85, 0),
      fArrow: std(0xd8343b, 0.4, 0.1, { emissive: 0x5a0d10, emissiveIntensity: 0.6 }),
      vArrow: std(0x1aa39a, 0.4, 0.1, { emissive: 0x08403c, emissiveIntensity: 0.6 }),
      aArrow: std(0xe09a1a, 0.4, 0.1, { emissive: 0x5a3a05, emissiveIntensity: 0.6 }),
      ke: std(0x1aa39a, 0.45, 0.1), pe: std(0xe09a1a, 0.45, 0.1), tot: std(0x2b3346, 0.45, 0.1),
      eqPlane: new THREE.MeshBasicMaterial({ color: 0x7fb2ff, transparent: true, opacity: 0.14, side: THREE.DoubleSide, depthWrite: false }),
      eqLine: new THREE.LineDashedMaterial({ color: 0x2d6fd6, dashSize: 0.008, gapSize: 0.006 }),
      board: std(0xffffff, 0.8, 0, { map: energyBoardTex() }),
      laterite: std(0xffffff, 0.95, 0, { map: speckleTex("lat", "#9c4a22", ["#6e2e12", "#c06a3a", "#7d3a1a", "#b8794a"], 2600, 21, 2.2, 3) }),
      concrete: std(0xffffff, 0.9, 0, { map: speckleTex("conc", "#9a9a92", ["#6f6f69", "#c1c1b8", "#85857d"], 900, 5, 1.4) }),
      grass: std(0x3d6b2a, 1, 0),
      tyre: std(0x111214, 0.85, 0),
      redPaint: std(0xa3141f, 0.35, 0.35),
      seat: std(0x1a1a1c, 0.7, 0.05),
      engine: std(0x5b616b, 0.5, 0.6),
      springRed: std(0xd23a1d, 0.4, 0.5),
      oilStain: std(0x24160a, 0.15, 0.2),
      crate: std(0xffffff, 0.8, 0, { map: grainTex("crate", "#c89a5c", "#6a4320", 26, 31) }),
      tray: std(0xd8cdb4, 0.95, 0),
      egg: std(0xf1e2c6, 0.6, 0),
      cutFace: std(0xb3342a, 0.6, 0.2, { side: THREE.DoubleSide }),
      shockOil: std(0xb8741a, 0.2, 0, { transparent: true, opacity: 0.55, depthWrite: false, side: THREE.DoubleSide, emissive: 0x000000 }),
      bore: std(0xb9c0ca, 0.35, 0.4, { side: THREE.DoubleSide }),
      shockBody: std(0x3a404a, 0.4, 0.75, { side: THREE.DoubleSide, bumpMap: bump, bumpScale: 0.0005 }),
      jet: new THREE.MeshBasicMaterial({ color: 0xffb347, transparent: true, opacity: 0.9, depthWrite: false }),
      bubble: std(0xffffff, 0.1, 0, { transparent: true, opacity: 0.45, depthWrite: false })
    };
    return MAT;
  }
  /* coloured arrow (shaft + cone head) along +y; set(len) points it up (len > 0) or down (len < 0) */
  function arrow(mat, rad) {
    var g = new THREE.Group(), shaft = new THREE.Mesh(new THREE.CylinderGeometry(rad, rad, 1, 10), mat);
    var head = new THREE.Mesh(new THREE.ConeGeometry(rad * 2.6, rad * 7, 14), mat);
    g.add(shaft, head);
    g.set = function (len) {
      var L = Math.abs(len), hl = Math.min(rad * 7, L * 0.6), sgn = len < 0 ? -1 : 1;
      g.visible = L > 0.002;
      shaft.scale.y = Math.max(0.0001, L - hl); shaft.position.y = sgn * (L - hl) / 2;
      head.scale.set(1, hl / (rad * 7), 1); head.position.y = sgn * (L - hl / 2); head.rotation.z = sgn < 0 ? Math.PI : 0;
    };
    return g;
  }
  function fitBox(x0, x1, y0, y1, z0, z1) {
    var m = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0, y1 - y0, (z1 || 0.05) - (z0 || -0.05)), new THREE.MeshBasicMaterial({ visible: false }));
    m.position.set((x0 + x1) / 2, (y0 + y1) / 2, ((z0 || -0.05) + (z1 || 0.05)) / 2); m.userData.fitHelper = true; m.raycast = function () {};
    return m;
  }

  /* ===================================================================
     3. LAB RIG (hooke · period · forces · energy · damping · testtube)
     =================================================================== */
  var LAB = { rodX: -0.08, x: 0.10, ruleX: -0.045, yTop: 0.965, L0: 0.14, lead: 0.016, R: 0.016, wire: 0.0016, turns: 24,
    ptrY0: 0.75, p0cm: 25.0, hookToBase: 0.115, discR: 0.019, discH: 0.0055, discStep: 0.0068, vaneDrop: 0.19,
    beakerR: 0.055, beakerH: 0.20, liquid: 0.17 };
  LAB.bottom0 = LAB.yTop - (LAB.L0 + 2 * LAB.lead);       // spring's lower loop at natural length
  LAB.ptrOff = LAB.bottom0 - LAB.ptrY0;                     // pointer sits this far below the lower loop

  function retortStand(M, height) {
    var g = new THREE.Group();
    var base = slab(0.34, 0.022, 0.2, 0.025, M.paint); base.position.set(0.04, 0, 0); g.add(base);
    var rodM = new THREE.Mesh(new THREE.CylinderGeometry(0.0075, 0.0075, height, 18), M.steel); rodM.position.set(LAB.rodX, height / 2 + 0.02, 0); g.add(rodM);
    var cap = new THREE.Mesh(new THREE.SphereGeometry(0.0085, 12, 8), M.steel); cap.position.set(LAB.rodX, height + 0.02, 0); g.add(cap);
    var foot = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.02, 0.03, 18), M.darkSteel); foot.position.set(LAB.rodX, 0.035, 0); g.add(foot);
    [[-0.11, -0.08], [0.19, -0.08], [-0.11, 0.08], [0.19, 0.08]].forEach(function (p) { var f = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.009, 0.004, 12), M.blackPlastic); f.position.set(p[0], -0.001, p[1]); g.add(f); });
    return g;
  }
  function bossClamp(M, y, armLen) {   // boss head on the rod + clamp arm reaching +x, with the spring hook
    var g = new THREE.Group();
    var boss = slab(0.034, 0.03, 0.03, 0.006, M.darkSteel); boss.position.set(LAB.rodX, y - 0.015, 0); g.add(boss);
    g.add(rod(v3(LAB.rodX, y, 0.015), v3(LAB.rodX, y, 0.045), 0.0035, M.steel));
    var knob = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.008, 14), M.blackPlastic); knob.rotation.x = Math.PI / 2; knob.position.set(LAB.rodX, y, 0.05); g.add(knob);
    g.add(rod(v3(LAB.rodX + 0.015, y, 0), v3(LAB.rodX + armLen, y, 0), 0.0055, M.steel));
    // jaws at the arm end
    var jaw = slab(0.03, 0.014, 0.02, 0.004, M.darkSteel); jaw.position.set(LAB.x, y - 0.007, 0); g.add(jaw);
    var hook = new THREE.Mesh(new THREE.TorusGeometry(0.006, 0.0014, 8, 18, Math.PI * 1.4), M.steel);
    hook.position.set(LAB.x, y - 0.012, 0); hook.rotation.z = Math.PI * 0.8; g.add(hook);
    return g;
  }
  function stopwatch(M, face) {
    var sw = new THREE.Group();
    var prof = [[0.0005, -0.007], [0.034, -0.007], [0.038, -0.003], [0.038, 0.003], [0.034, 0.007], [0.0005, 0.007]];
    var body = lathe(prof, 40, M.blackPlastic); body.rotation.x = Math.PI / 2; sw.add(body);
    var bezel = new THREE.Mesh(new THREE.TorusGeometry(0.034, 0.0022, 8, 40), M.chrome); bezel.position.z = 0.007; sw.add(bezel);
    var crown = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.012, 14), M.chrome); crown.position.y = 0.044; sw.add(crown);
    var ring = new THREE.Mesh(new THREE.TorusGeometry(0.008, 0.0016, 6, 16), M.chrome); ring.position.y = 0.054; sw.add(ring);
    [-1, 1].forEach(function (s) { var b = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.008, 10), M.chrome); b.position.set(s * 0.026, 0.032, 0); b.rotation.z = -s * 0.7; sw.add(b); });
    var scr = new THREE.Mesh(new THREE.PlaneGeometry(0.052, 0.027), new THREE.MeshBasicMaterial({ map: face.tex }));
    scr.position.z = 0.0075; sw.add(scr);
    return sw;
  }
  function drawWatch(g, w, h, t, n, run) {
    g.fillStyle = "#c9d6c1"; g.fillRect(0, 0, w, h);
    g.fillStyle = "rgba(0,0,0,.08)"; g.fillRect(0, h - 8, w, 8);
    g.fillStyle = "#18200f"; g.textAlign = "center"; g.font = "bold 66px monospace";
    g.fillText(t.toFixed(2), w / 2, 76);
    g.font = "bold 24px monospace"; g.fillText("n = " + n + (run ? "  RUN" : ""), w / 2, 114);
  }
  /* scissor lab jack (height h): base plate, top plate, crossed bars and the screw */
  function labJack(M) {
    var g = new THREE.Group();
    var base = slab(0.13, 0.008, 0.13, 0.008, M.steel); g.add(base);
    var top = slab(0.13, 0.008, 0.13, 0.008, M.steel); g.add(top);
    var bars = [];
    for (var i = 0; i < 4; i++) { var b = new THREE.Mesh(new THREE.BoxGeometry(1, 0.006, 0.006), M.darkSteel); g.add(b); bars.push(b); }
    var screw = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.16, 8), M.steel); screw.rotation.z = Math.PI / 2; g.add(screw);
    var knob = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.012, 14), M.blackPlastic); knob.rotation.z = Math.PI / 2; g.add(knob);
    g.setHeight = function (h) {
      h = Math.max(0.03, h); top.position.y = h - 0.008;
      var span = 0.11, inner = h - 0.016, L = Math.sqrt(span * span + inner * inner);
      bars.forEach(function (b, i) {
        var z = i < 2 ? -0.058 : 0.058, s = i % 2 ? 1 : -1;
        b.scale.x = L; b.position.set(0, 0.008 + inner / 2, z); b.rotation.set(0, 0, s * Math.atan2(inner, span));
      });
      screw.position.set(0, 0.008 + inner / 2, 0); knob.position.set(0.085, 0.008 + inner / 2, 0);
    };
    g.setHeight(0.2);
    return g;
  }
  function beaker(M) {
    var g = new THREE.Group(), R = LAB.beakerR, H = LAB.beakerH, t = 0.0025;
    var prof = [[0.0005, 0], [R - 0.006, 0], [R, 0.006], [R, H - 0.004], [R + 0.004, H], [R + 0.0035, H + 0.002], [R - t, H - 0.002], [R - t, t + 0.004], [R - t - 0.005, t], [0.0005, t]];
    var glass = lathe(prof, 48, M.glass); glass.renderOrder = 3; g.add(glass);
    var spout = new THREE.Mesh(new THREE.TorusGeometry(0.007, 0.002, 6, 12, Math.PI), M.glass); spout.position.set(R + 0.002, H, 0); spout.rotation.set(Math.PI / 2, 0, -Math.PI / 2); g.add(spout);
    var band = new THREE.Mesh(new THREE.CylinderGeometry(R + 0.0006, R + 0.0006, 0.16, 32, 1, true, -0.55, 1.1), M.grad);
    band.position.y = 0.012 + 0.08; band.renderOrder = 4; g.add(band);
    var liquid = new THREE.Mesh(new THREE.CylinderGeometry(R - t - 0.0005, R - t - 0.0005, 1, 40), M.water);
    liquid.geometry.translate(0, 0.5, 0); liquid.position.y = t; liquid.renderOrder = 2; g.add(liquid);
    g.userData.liquid = liquid;
    return g;
  }
  function testTube(M, rTube) {
    var g = new THREE.Group(), L = 0.15, t = 0.0008, i;
    var prof = [];
    for (i = 0; i <= 10; i++) { var a = -Math.PI / 2 + i / 10 * Math.PI / 2; prof.push([Math.max(0.0004, Math.cos(a) * rTube), rTube + Math.sin(a) * rTube]); }
    prof.push([rTube, L - 0.002], [rTube + 0.0012, L], [rTube - t, L]);
    for (i = 10; i >= 0; i--) { var b = -Math.PI / 2 + i / 10 * Math.PI / 2; prof.push([Math.max(0.0004, Math.cos(b) * (rTube - t)), rTube + Math.sin(b) * (rTube - t)]); }
    var glass = lathe(prof, 32, M.glass); glass.renderOrder = 5; g.add(glass);
    // lead shot heaped in the round bottom
    var shot = new THREE.InstancedMesh(new THREE.SphereGeometry(0.0021, 8, 6), M.lead, 26), mtx = new THREE.Matrix4(), rr = rng(17), k = 0;
    for (i = 0; i < 26; i++) {
      var layer = Math.floor(i / 7), rad = (rTube - 0.0032) * Math.sqrt(rr()), an = rr() * TAU;
      var yy = 0.0028 + layer * 0.0036 + (rTube - Math.sqrt(Math.max(0, rTube * rTube - rad * rad))) * 0.8;
      mtx.makeTranslation(Math.cos(an) * rad, yy, Math.sin(an) * rad); shot.setMatrixAt(k++, mtx);
    }
    g.add(shot); g.userData.shot = shot;
    // paper scale strip inside the tube, and a cotton-wool plug above the shot
    var paper = new THREE.Mesh(new THREE.PlaneGeometry(rTube * 1.1, 0.1), M.paper); paper.position.set(0, 0.035 + 0.05, rTube * 0.15); g.add(paper);
    var plug = new THREE.Mesh(new THREE.SphereGeometry(rTube * 0.82, 12, 8), std(0xf4f1ea, 1, 0)); plug.scale.y = 0.45; plug.position.y = 0.024; g.add(plug);
    return g;
  }

  function buildLab(M, P, D) {
    var rig = new THREE.Group(); rig.name = "mass-spring-lab";
    var bench = slab(0.9, 0.04, 0.5, 0.02, M.bench); bench.position.set(0.04, -0.04, 0); bench.userData.noFit = true; rig.add(bench);
    var stand = retortStand(M, 1.0); stand.userData.noFit = true; rig.add(tagPart(stand, "stand")); P.stand = stand;
    var clamp = bossClamp(M, LAB.yTop + 0.012, LAB.x - LAB.rodX + 0.012); clamp.userData.noFit = true; rig.add(tagPart(clamp, "clamp")); P.clamp = clamp;

    // the helical spring (geometry rebuilt as it stretches)
    var springG = new THREE.Group(); springG.position.set(LAB.x, LAB.yTop, 0);
    var sp = new THREE.Mesh(helixGeometry({ R: LAB.R, turns: LAB.turns, len: LAB.L0, wire: LAB.wire, loops: true, lead: LAB.lead }), M.springSteel);
    springG.add(sp); rig.add(tagPart(springG, "spring")); P.spring = springG; D.spring = sp;

    // the load: hanger (hook, stem, base), slotted masses, pointer, vane
    var load = new THREE.Group(); load.position.set(LAB.x, LAB.bottom0, 0);
    var hanger = new THREE.Group();
    var hk = new THREE.Mesh(new THREE.TorusGeometry(0.0065, 0.0015, 8, 18, Math.PI * 1.5), M.steel); hk.rotation.z = -Math.PI * 0.25; hk.position.y = -0.0055; hanger.add(hk);
    hanger.add(rod(v3(0, -0.012, 0), v3(0, -LAB.hookToBase, 0), 0.0024, M.steel));
    var plate = lathe([[0.0005, -0.004], [LAB.discR - 0.001, -0.004], [LAB.discR, -0.003], [LAB.discR, 0.0015], [LAB.discR - 0.001, 0.0025], [0.0005, 0.0025]], 32, M.darkSteel);
    plate.position.y = -LAB.hookToBase - 0.0025; hanger.add(plate);
    load.add(tagPart(hanger, "hanger")); P.hanger = hanger;
    var discs = new THREE.Group(), discGeo = slottedDiscGeometry(LAB.discR, LAB.discH);
    D.discs = [];
    for (var i = 0; i < 9; i++) {
      var d = new THREE.Mesh(discGeo, M.brass); d.position.y = -LAB.hookToBase + 0.0008 + i * LAB.discStep; d.rotation.y = 0.4 + i * 0.55;
      d.visible = false; discs.add(d); D.discs.push(d);
    }
    load.add(tagPart(discs, "slotted-mass")); P["slotted-mass"] = discs;
    var ptr = new THREE.Group(), reach = LAB.x - LAB.ruleX - 0.017;
    ptr.add(rod(v3(0, 0, 0.006), v3(-reach + 0.012, 0, 0.006), 0.0013, M.pointer));
    var tip = new THREE.Mesh(new THREE.ConeGeometry(0.0034, 0.013, 10), M.pointer); tip.rotation.z = Math.PI / 2; tip.position.set(-reach + 0.006, 0, 0.006); ptr.add(tip);
    var collar = new THREE.Mesh(new THREE.CylinderGeometry(0.0045, 0.0045, 0.006, 12), M.pointer); ptr.add(collar);
    ptr.position.y = -LAB.ptrOff; load.add(tagPart(ptr, "pointer")); P.pointer = ptr;
    var vane = new THREE.Group();
    vane.add(rod(v3(0, -LAB.hookToBase - 0.005, 0), v3(0, -LAB.vaneDrop + 0.02, 0), 0.0016, M.steel));
    var card = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.05, 0.0012), M.card); card.position.y = -LAB.vaneDrop; vane.add(card);
    var clip = slab(0.012, 0.012, 0.004, 0.002, M.darkSteel); clip.position.y = -LAB.vaneDrop + 0.019; vane.add(clip);
    load.add(tagPart(vane, "vane")); P.vane = vane;
    rig.add(tagPart(load, "mass")); P.mass = load; D.load = load;

    // vertical metre rule (0 cm at the top, y = 1.00 m), clamped to the rod
    var rule = new THREE.Group();
    var rb = new THREE.Mesh(new THREE.BoxGeometry(0.032, 1.0, 0.006), [M.ruleEdge, M.ruleEdge, M.ruleEdge, M.ruleEdge, M.rule, M.ruleEdge]);
    rb.position.set(LAB.ruleX, 0.5 + 0.0, 0); rule.add(rb);
    var rc = slab(0.05, 0.02, 0.02, 0.004, M.darkSteel); rc.position.set((LAB.ruleX + LAB.rodX) / 2, 0.93, -0.004); rule.add(rc);
    rule.userData.noFit = true; rig.add(tagPart(rule, "ruler")); P.ruler = rule;

    // stopwatch on the bench
    D.watch = liveFace(256, 128, drawWatch);
    var sw = stopwatch(M, D.watch); sw.position.set(0.27, 0.07, 0.11); sw.rotation.set(-0.5, -0.35, 0);
    rig.add(tagPart(sw, "stopwatch")); P.stopwatch = sw;

    // beaker on a lab jack (damping, testtube)
    var jack = labJack(M); jack.position.set(LAB.x, 0.022, 0); rig.add(tagPart(jack, "jack")); P.jack = jack; D.jack = jack;
    var bk = beaker(M); bk.position.set(LAB.x, 0.2, 0); rig.add(tagPart(bk, "beaker")); P.beaker = bk; D.beaker = bk;
    var ripple = new THREE.Mesh(new THREE.RingGeometry(0.012, 0.0135, 32), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.0, depthWrite: false, side: THREE.DoubleSide }));
    ripple.rotation.x = -Math.PI / 2; bk.add(ripple); D.ripple = ripple;

    // weighted test-tube (floats in the beaker)
    var tt = testTube(M, DEFAULTS.tubeR); rig.add(tagPart(tt, "testtube")); P.testtube = tt; D.tube = tt;

    // force arrows + dashed equilibrium plane (forces / testtube)
    var arrows = new THREE.Group();
    D.fArrow = arrow(M.fArrow, 0.0028); D.vArrow = arrow(M.vArrow, 0.0022); D.aArrow = arrow(M.aArrow, 0.0022);
    D.fArrow.position.x = 0.045; D.vArrow.position.x = 0.075; D.aArrow.position.x = 0.1;
    arrows.add(tagPart(D.fArrow, "f-arrow"), tagPart(D.vArrow, "v-arrow"), tagPart(D.aArrow, "a-arrow"));
    D.fLab = labelSprite("F", 0.06); D.vLab = labelSprite("v", 0.06); D.aLab = labelSprite("a", 0.06);
    arrows.add(D.fLab, D.vLab, D.aLab);
    rig.add(arrows); D.arrows = arrows; P["f-arrow"] = D.fArrow; P["v-arrow"] = D.vArrow; P["a-arrow"] = D.aArrow;
    var eq = new THREE.Group();
    var eqP = new THREE.Mesh(new THREE.PlaneGeometry(0.26, 0.14), M.eqPlane); eqP.rotation.x = -Math.PI / 2; eq.add(eqP);
    var pts = [v3(-0.13, 0, -0.07), v3(0.13, 0, -0.07), v3(0.13, 0, 0.07), v3(-0.13, 0, 0.07), v3(-0.13, 0, -0.07)];
    var ln = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), M.eqLine); ln.computeLineDistances(); eq.add(ln);
    D.eqLab = labelSprite("equilibrium", 0.08); D.eqLab.position.set(-0.16, 0.012, 0); eq.add(D.eqLab);
    eq.position.x = LAB.x + 0.03; rig.add(tagPart(eq, "equilibrium")); P.equilibrium = eq; D.eq = eq;

    // energy bars on a board beside the spring
    var eb = new THREE.Group();
    var board = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.32, 0.006), [M.wood, M.wood, M.wood, M.wood, M.board, M.wood]); board.position.set(0, 0.16, -0.004); eb.add(board);
    eb.add(rod(v3(0, -0.3, -0.004), v3(0, 0.0, -0.004), 0.004, M.steel));
    var foot = slab(0.08, 0.01, 0.06, 0.01, M.darkSteel); foot.position.set(0, -0.31, -0.004); eb.add(foot);
    function bar(mat, x, id) {
      var b = slab(0.03, 1, 0.012, 0.004, mat); b.position.set(x, 0.042, 0.004);
      var holder = new THREE.Group(); holder.add(b); eb.add(tagPart(holder, id)); D[id] = b; P[id] = holder; return b;
    }
    bar(M.ke, -0.05, "ke-bar"); bar(M.pe, 0.0, "pe-bar"); bar(M.tot, 0.05, "total-bar");
    eb.position.set(0.31, 0.33, 0.0); rig.add(eb); D.ebars = eb;

    // labels (beside static parts only)
    D.labels = [];
    function lab(text, x, y, z, s) { var l = labelSprite(text, s); l.position.set(x, y, z); rig.add(l); D.labels.push(l); return l; }
    D.lSpring = lab("spiral spring", LAB.x + 0.085, LAB.yTop - 0.05, 0.02, 0.09);
    D.lRule = lab("metre rule", LAB.ruleX + 0.058, 0.9, 0.01, 0.09);
    D.lWatch = lab("stopwatch", 0.27, 0.13, 0.11, 0.09);
    D.lBeaker = lab("beaker", LAB.x - 0.1, 0.3, 0.03, 0.09);
    D.lTube = lab("weighted test-tube", LAB.x + 0.1, 0.3, 0.03, 0.09);

    D.fit = {};
    return rig;
  }

  /* ===================================================================
     4. OKADA RIG (riding over ridges / parked) — body from RidgeRoadProps if loaded
     =================================================================== */
  var OK = { rearX: -0.66, frontX: 0.66, wheelR: 0.3, ridgeW: 0.36, roadLen: 10 };

  function propsOkada() {
    var R = global.RidgeRoadProps;
    if (!R || typeof R.okada !== "function") return null;
    var o;
    try { o = R.okada({ rider: false, crate: true }); } catch (e) { return null; }
    if (!o) return null;
    var obj = o.isObject3D ? o : (o.group || o.root || o.object3d || o.mesh);
    if (!obj || !obj.isObject3D) return null;
    function fn(name) {
      var f = o[name] || (obj[name]) || (obj.userData && obj.userData[name]);
      return typeof f === "function" ? function () { try { return f.apply(o, arguments); } catch (e) { return null; } } : null;
    }
    return { obj: obj, api: o, setBounce: fn("setBounce"), setWheelBump: fn("setWheelBump"), setSpeed: fn("setSpeed"),
      liftCrate: fn("liftCrate"), crack: fn("crack"), update: fn("update") || fn("tick"),
      parts: o.parts || obj.parts || (obj.userData && obj.userData.parts) || {} };
  }

  function wheel(M) {
    var g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.TorusGeometry(OK.wheelR - 0.045, 0.045, 14, 48), M.tyre));
    g.add(new THREE.Mesh(new THREE.TorusGeometry(OK.wheelR - 0.085, 0.011, 8, 48), M.chrome));
    var hub = lathe([[0.0005, -0.05], [0.03, -0.05], [0.045, -0.03], [0.05, 0], [0.045, 0.03], [0.03, 0.05], [0.0005, 0.05]], 20, M.engine); hub.rotation.x = Math.PI / 2; g.add(hub);
    for (var i = 0; i < 18; i++) {
      var a = i / 18 * TAU, side = i % 2 ? 0.035 : -0.035;
      g.add(rod(v3(Math.cos(a) * 0.035, Math.sin(a) * 0.035, side), v3(Math.cos(a + 0.35) * (OK.wheelR - 0.09), Math.sin(a + 0.35) * (OK.wheelR - 0.09), 0), 0.0018, M.chrome, 5));
    }
    return g;
  }
  function coilOver(M) {     // compact coil-over for the bike (spring red coil around a damper body)
    var sg = new THREE.Group();
    var body = new THREE.Mesh(new THREE.CylinderGeometry(0.019, 0.019, 0.17, 16), M.darkSteel); sg.add(body);
    var rd = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.2, 10), M.chrome); sg.add(rd);
    var eyeT = new THREE.Mesh(new THREE.TorusGeometry(0.014, 0.006, 8, 16), M.darkSteel); sg.add(eyeT);
    var eyeB = new THREE.Mesh(new THREE.TorusGeometry(0.014, 0.006, 8, 16), M.darkSteel); sg.add(eyeB);
    var coil = new THREE.Mesh(helixGeometry({ R: 0.03, turns: 8, len: 0.26, wire: 0.0055, closedEnds: true, radSeg: 8 }), M.springRed); sg.add(coil);
    var stain = new THREE.Mesh(new THREE.CylinderGeometry(0.0195, 0.0195, 0.06, 16, 1, true, 0, 1.4), M.oilStain); sg.add(stain);
    return { g: sg, body: body, rod: rd, eyeT: eyeT, eyeB: eyeB, coil: coil, stain: stain, len: -1 };
  }
  function crate(M) {
    var c = new THREE.Group(), CW = 0.44, CH = 0.24, CD = 0.34, s;
    for (s = 0; s < 3; s++) {
      [-1, 1].forEach(function (sz) { var sl = new THREE.Mesh(new THREE.BoxGeometry(CW, 0.05, 0.012), M.crate); sl.position.set(0, 0.03 + s * 0.08, sz * CD / 2); c.add(sl); });
      [-1, 1].forEach(function (sx) { var sl = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.05, CD), M.crate); sl.position.set(sx * CW / 2, 0.03 + s * 0.08, 0); c.add(sl); });
    }
    [[-1, -1], [-1, 1], [1, -1], [1, 1]].forEach(function (p) { var post = new THREE.Mesh(new THREE.BoxGeometry(0.025, CH, 0.025), M.crate); post.position.set(p[0] * (CW / 2 - 0.01), CH / 2, p[1] * (CD / 2 - 0.01)); c.add(post); });
    var floor = new THREE.Mesh(new THREE.BoxGeometry(CW, 0.01, CD), M.crate); floor.position.y = 0.005; c.add(floor);
    var tray = new THREE.Mesh(new THREE.BoxGeometry(CW - 0.03, 0.015, CD - 0.03), M.tray); tray.position.y = CH - 0.01; c.add(tray);
    var eggProf = [];
    for (var e = 0; e <= 10; e++) { var t = e / 10, ang = -Math.PI / 2 + Math.PI * t; eggProf.push(new THREE.Vector2(Math.max(0.0004, Math.cos(ang) * 0.019 * (1 - 0.12 * Math.sin(ang))), Math.sin(ang) * 0.025)); }
    var eggs = new THREE.InstancedMesh(new THREE.LatheGeometry(eggProf, 12), M.egg, 30), mtx = new THREE.Matrix4();
    for (var ex = 0; ex < 6; ex++) for (var ez = 0; ez < 5; ez++) { mtx.makeTranslation(-0.175 + ex * 0.07, CH + 0.02, -0.12 + ez * 0.06); eggs.setMatrixAt(ex * 5 + ez, mtx); }
    c.add(eggs);
    var crackMat = new THREE.MeshBasicMaterial({ color: 0xff3b30, transparent: true, opacity: 0, depthWrite: false });
    var flash = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 10), crackMat); flash.position.y = CH; flash.scale.y = 0.4; c.add(flash);
    c.userData.flash = flash;
    return c;
  }
  function speedoFace(g, w, h, kmh) {
    g.clearRect(0, 0, w, h);
    var cx = w / 2, cy = h / 2, R = w / 2 - 6;
    g.fillStyle = "#101418"; g.beginPath(); g.arc(cx, cy, R, 0, TAU); g.fill();
    g.strokeStyle = "#e8eef5"; g.fillStyle = "#e8eef5"; g.textAlign = "center"; g.textBaseline = "middle";
    var a0 = Math.PI * 0.75, span = Math.PI * 1.5, max = 60;
    for (var v = 0; v <= max; v += 5) {
      var a = a0 + span * v / max, big = v % 10 === 0;
      g.lineWidth = big ? 4 : 2; g.beginPath(); g.moveTo(cx + Math.cos(a) * (R - 4), cy + Math.sin(a) * (R - 4)); g.lineTo(cx + Math.cos(a) * (R - (big ? 22 : 14)), cy + Math.sin(a) * (R - (big ? 22 : 14))); g.stroke();
      if (big) { g.font = "bold 22px sans-serif"; g.fillText(String(v), cx + Math.cos(a) * (R - 42), cy + Math.sin(a) * (R - 42)); }
    }
    g.font = "bold 18px sans-serif"; g.fillText("km/h", cx, cy + 40);
    g.font = "bold 30px monospace"; g.fillStyle = "#ffcf6a"; g.fillText(String(Math.round(kmh)), cx, cy + 70);
    var an = a0 + span * Math.min(max, kmh) / max;
    g.strokeStyle = "#ff5a3c"; g.lineWidth = 6; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(an) * (R - 26), cy + Math.sin(an) * (R - 26)); g.stroke();
    g.fillStyle = "#cfd6de"; g.beginPath(); g.arc(cx, cy, 10, 0, TAU); g.fill();
  }

  function buildOkada(M, P, D) {
    var rig = new THREE.Group(); rig.name = "mass-spring-okada";
    // road, verges and moving ridges (not used for framing)
    var road = new THREE.Group(); road.userData.noFit = true;
    var lat = new THREE.Mesh(new THREE.PlaneGeometry(OK.roadLen, 2.2), M.laterite); lat.rotation.x = -Math.PI / 2; road.add(lat);
    D.roadTex = M.laterite.map;
    [-1.35, 1.35].forEach(function (z) { var vg = new THREE.Mesh(new THREE.PlaneGeometry(OK.roadLen, 0.5), M.grass); vg.rotation.x = -Math.PI / 2; vg.position.set(0, -0.004, z); road.add(vg); });
    rig.add(road);
    var H = 2 * STORY.Y, w = OK.ridgeW, prof = new THREE.Shape();
    prof.moveTo(-w / 2, 0);
    for (var i = 0; i <= 16; i++) { var u = -w / 2 + w * i / 16; prof.lineTo(u, H * Math.pow(Math.cos(Math.PI * u / w), 2)); }
    prof.lineTo(-w / 2, 0);
    var rg = new THREE.ExtrudeGeometry(prof, { depth: 1.9, bevelEnabled: false }); rg.translate(0, 0, -0.95);
    var ridges = new THREE.Group(); ridges.userData.noFit = true; D.ridges = []; D.ridgeH = H;
    for (var q = 0; q < 4; q++) { var rm = new THREE.Mesh(rg, M.concrete); ridges.add(rm); D.ridges.push(rm); }
    rig.add(tagPart(ridges, "ridges")); P.ridges = ridges;

    var okadaRoot = new THREE.Group(); rig.add(okadaRoot);
    var props = propsOkada();
    D.props = props;
    if (props && typeof global.RidgeRoadProps.road === "function") {     // the story's own road + ridges (treadmill)
      try {
        var pr = global.RidgeRoadProps.road({ length: 12, width: 3.2, d: STORY.d });
        if (pr && pr.isObject3D && typeof pr.scroll === "function" && typeof pr.bumpAt === "function") {
          road.visible = false; ridges.visible = false; pr.userData.noFit = true;
          rig.add(tagPart(pr, "ridges")); P.ridges = pr; D.propRoad = pr;
          var dfl = global.RidgeRoadProps.defaults || {}; D.propWheelX = [dfl.rearX != null ? dfl.rearX : OK.rearX, dfl.frontX != null ? dfl.frontX : OK.frontX];
        }
      } catch (e) { D.propRoad = null; }
    }
    if (props) {
      okadaRoot.add(props.obj);
      tagPart(props.obj, "okada"); P.okada = props.obj;
      ["carrier", "crate", "rear-shock"].forEach(function (k) { var o = props.parts[k]; if (o && o.isObject3D) { o.userData.partId = k; o.traverse(function (c) { c.userData.partId = k; }); P[k] = o; } });
      if (props.parts.speedometer && props.parts.speedometer.isObject3D) { P.speedometer = props.parts.speedometer; D.ownSpeedo = false; }
      if (!P.carrier) P.carrier = props.obj;
      if (!P.crate) P.crate = props.obj;
      if (!P["rear-shock"]) P["rear-shock"] = props.obj;
    } else {
      buildStandIn(M, P, D, okadaRoot);
    }
    // speedometer on a little stalk at the handlebar
    D.speedo = liveFace(256, 256, speedoFace);
    var sp = new THREE.Group();
    var bez = lathe([[0.0005, -0.02], [0.06, -0.02], [0.068, -0.01], [0.068, 0.012], [0.062, 0.016], [0.0005, 0.016]], 32, M.chrome); bez.rotation.x = Math.PI / 2; sp.add(bez);
    var dial = new THREE.Mesh(new THREE.CircleGeometry(0.06, 40), new THREE.MeshBasicMaterial({ map: D.speedo.tex, transparent: true })); dial.position.z = 0.017; sp.add(dial);
    sp.position.set(0.47, 1.16, 0.05); sp.rotation.set(-0.15, 0.25, 0);
    if (D.ownSpeedo === false) sp.visible = false;
    else { rig.add(tagPart(sp, "speedometer")); P.speedometer = sp; }
    D.okLabels = [];
    var l1 = labelSprite("drainage ridge", 0.3); l1.position.set(1.7, 0.18, 0.75); rig.add(l1); D.okLabels.push(l1); D.ridgeLabel = l1;
    var l2 = labelSprite("rear shock", 0.3); l2.position.set(-0.45, 0.25, 0.45); rig.add(l2); D.okLabels.push(l2);
    rig.add(fitBox(-1.25, 1.0, 0, 1.45, -0.4, 0.4));
    return rig;
  }

  function buildStandIn(M, P, D, root) {
    var okadaG = new THREE.Group(); root.add(okadaG);
    var front = wheel(M); front.position.set(OK.frontX, OK.wheelR, 0); okadaG.add(front); D.frontWheel = front;
    var rear = wheel(M); rear.position.set(OK.rearX, OK.wheelR, 0); okadaG.add(rear); D.rearWheel = rear;
    var body = new THREE.Group(); body.position.set(OK.frontX, OK.wheelR, 0); okadaG.add(body); D.body = body;
    function B(x, y, z) { return v3(x - OK.frontX, y - OK.wheelR, z || 0); }
    [-0.06, 0.06].forEach(function (z) { body.add(rod(B(0.66, 0.3, z), B(0.5, 0.92, z * 0.8), 0.016, M.chrome)); });
    body.add(rod(B(0.5, 0.92, 0), B(0.47, 1.02, 0), 0.03, M.redPaint));
    body.add(tube([B(0.43, 1.05, -0.34), B(0.47, 1.05, -0.18), B(0.49, 1.03, 0), B(0.47, 1.05, 0.18), B(0.43, 1.05, 0.34)], 0.011, M.chrome, 30));
    [-0.34, 0.34].forEach(function (z) { var gr = new THREE.Mesh(new THREE.CylinderGeometry(0.017, 0.017, 0.1, 12), M.seat); gr.rotation.x = Math.PI / 2; gr.position.copy(B(0.42, 1.05, z + (z > 0 ? 0.03 : -0.03))); body.add(gr); });
    var lamp = lathe([[0.0005, 0], [0.07, 0.01], [0.075, 0.05], [0.065, 0.07], [0.0005, 0.07]], 24, M.chrome); lamp.rotation.z = -Math.PI / 2; lamp.position.copy(B(0.53, 0.9, 0)); body.add(lamp);
    var lens = new THREE.Mesh(new THREE.CircleGeometry(0.064, 24), std(0xfff4c8, 0.1, 0, { emissive: 0x332a10 })); lens.rotation.y = Math.PI / 2; lens.position.copy(B(0.602, 0.9, 0)); body.add(lens);
    body.add(tube([B(0.48, 0.95, 0), B(0.3, 0.85, 0), B(0.05, 0.62, 0), B(-0.15, 0.45, 0)], 0.022, M.redPaint, 30));
    [-0.07, 0.07].forEach(function (z) { body.add(tube([B(0.05, 0.78, z), B(-0.3, 0.8, z), B(-0.62, 0.84, z)], 0.013, M.darkSteel, 20)); });
    var tk = new THREE.Shape(); tk.moveTo(0.42, 0.9); tk.quadraticCurveTo(0.3, 1.0, 0.1, 0.96); tk.quadraticCurveTo(0.0, 0.93, 0.02, 0.84); tk.lineTo(0.36, 0.82); tk.quadraticCurveTo(0.44, 0.84, 0.42, 0.9);
    var tank = new THREE.Mesh(new THREE.ExtrudeGeometry(tk, { depth: 0.16, bevelEnabled: true, bevelThickness: 0.035, bevelSize: 0.03, bevelSegments: 4, curveSegments: 16 }), M.redPaint);
    tank.position.set(-OK.frontX, -OK.wheelR, -0.08); body.add(tank);
    var st = new THREE.Shape(); st.moveTo(0.05, 0.86); st.quadraticCurveTo(-0.1, 0.92, -0.4, 0.9); st.lineTo(-0.48, 0.86); st.lineTo(0.05, 0.84);
    var seat = new THREE.Mesh(new THREE.ExtrudeGeometry(st, { depth: 0.18, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.025, bevelSegments: 4, curveSegments: 12 }), M.seat);
    seat.position.set(-OK.frontX, -OK.wheelR, -0.09); body.add(seat);
    var eng = new THREE.Group();
    var crank = slab(0.26, 0.16, 0.2, 0.04, M.engine); crank.position.set(0.0, 0.3, 0); eng.add(crank);
    for (var f = 0; f < 6; f++) { var fin = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.008, 20), M.engine); fin.rotation.z = -0.35; fin.position.set(0.08 + f * 0.014, 0.5 + f * 0.032, 0); eng.add(fin); }
    eng.position.copy(B(0, 0, 0)); body.add(eng);
    body.add(tube([B(0.16, 0.48, 0.1), B(0.2, 0.3, 0.14), B(0.0, 0.2, 0.16), B(-0.45, 0.28, 0.16), B(-0.75, 0.38, 0.15)], 0.022, M.chrome, 40));
    var carrier = new THREE.Group();
    [-0.13, 0.13].forEach(function (z) { carrier.add(tube([B(-0.4, 0.9, z), B(-0.6, 0.92, z), B(-0.98, 0.92, z)], 0.009, M.darkSteel, 16)); });
    for (var c = 0; c < 4; c++) carrier.add(rod(B(-0.55 - c * 0.13, 0.92, -0.13), B(-0.55 - c * 0.13, 0.92, 0.13), 0.007, M.darkSteel, 8));
    carrier.add(rod(B(-0.98, 0.92, -0.13), B(-0.98, 0.92, 0.13), 0.009, M.darkSteel, 8));
    [-0.13, 0.13].forEach(function (z) { carrier.add(rod(B(-0.9, 0.92, z), B(-0.62, 0.8, z), 0.007, M.darkSteel, 8)); });
    body.add(tagPart(carrier, "carrier")); P.carrier = carrier;
    D.carrierTop = B(-0.77, 0.93, 0);
    var tail = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.03, 0.08), std(0xc0101a, 0.3, 0, { emissive: 0x400005 })); tail.position.copy(B(-1.0, 0.88, 0)); body.add(tail);
    var cr = crate(M); root.add(tagPart(cr, "crate")); P.crate = cr; D.crate = cr;
    var shock = new THREE.Group(); D.shocks = [];
    [-0.11, 0.11].forEach(function (z) { var co = coilOver(M); co.z = z; shock.add(co.g); D.shocks.push(co); });
    okadaG.add(tagPart(shock, "rear-shock")); P["rear-shock"] = shock;
    D.swing = [];
    [-0.08, 0.08].forEach(function (z) { var sa = new THREE.Mesh(new THREE.BoxGeometry(1, 0.035, 0.022), M.darkSteel); okadaG.add(sa); D.swing.push({ m: sa, z: z }); });
    tagPart(okadaG, "okada"); P.okada = okadaG;
  }

  /* ===================================================================
     5. SHOCK RIG (okada view "shock"): cut-away coil-over shock absorber
     =================================================================== */
  var SH = { rIn: 0.0205, rOut: 0.0235, y0: 0.03, y1: 0.255, pistonY: 0.14, rodTop: 0.39, holes: 6, holeR: 0.0021, holeRing: 0.0125 };
  function buildShock(M, P, D) {
    var rig = new THREE.Group(); rig.name = "mass-spring-shock";
    var cut0 = Math.PI * 0.42, cutLen = TAU - Math.PI * 0.84;        // window of ~150° facing the viewer (+z)
    // display plinth + swingarm stub (bottom) + frame bracket (top)
    var plinth = slab(0.22, 0.02, 0.14, 0.012, M.wood); plinth.position.y = -0.06; plinth.userData.noFit = true; rig.add(plinth);
    var post = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.05, 0.05), M.darkSteel); post.position.y = -0.016; rig.add(post);
    var eyeB = new THREE.Mesh(new THREE.TorusGeometry(0.014, 0.0065, 10, 24), M.darkSteel); eyeB.position.y = 0.012; rig.add(eyeB);
    var boltB = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.06, 10), M.steel); boltB.rotation.x = Math.PI / 2; boltB.position.y = 0.012; rig.add(boltB);

    var bodyG = new THREE.Group();
    // body: thick-walled tube, cut away so the inside shows (LatheGeometry, partial sweep) + red section faces
    var prof = [[SH.rIn, SH.y0 + 0.006], [SH.rIn, SH.y1 - 0.004], [SH.rOut - 0.001, SH.y1], [SH.rOut, SH.y1 - 0.003], [SH.rOut, SH.y0], [SH.rOut - 0.003, SH.y0 - 0.006], [0.004, SH.y0 - 0.008], [0.004, SH.y0 + 0.002], [SH.rIn - 0.002, SH.y0 + 0.004]];
    var bodyM = lathe(prof, 48, M.shockBody, cut0, cutLen); bodyG.add(bodyM);
    var bore = lathe([[SH.rIn - 0.0003, SH.y0 + 0.005], [SH.rIn - 0.0003, SH.y1 - 0.004]], 48, M.bore, cut0, cutLen); bodyG.add(bore);   // honed bore, lit inside
    [cut0, cut0 + cutLen].forEach(function (phi) {
      var face = new THREE.Mesh(new THREE.PlaneGeometry(SH.rOut - SH.rIn, SH.y1 - SH.y0), M.cutFace);
      face.position.set(Math.sin(phi) * (SH.rIn + SH.rOut) / 2, (SH.y0 + SH.y1) / 2, Math.cos(phi) * (SH.rIn + SH.rOut) / 2);
      face.rotation.y = phi - Math.PI / 2; bodyG.add(face);
    });
    var seal = lathe([[0.0045, SH.y1 - 0.012], [SH.rIn, SH.y1 - 0.012], [SH.rIn, SH.y1 + 0.004], [0.0045, SH.y1 + 0.004]], 32, M.blackPlastic, cut0, cutLen); bodyG.add(seal);
    var seatB = lathe([[SH.rOut, 0.07], [0.038, 0.07], [0.038, 0.078], [SH.rOut, 0.082]], 40, M.steel); bodyG.add(seatB);
    rig.add(tagPart(bodyG, "damper-body")); P["damper-body"] = bodyG;

    // oil column (unit height, scaled to the oil level) with a partial surface disc
    var oil = new THREE.Group();
    var oilCol = lathe([[0.0005, 0], [SH.rIn - 0.0006, 0], [SH.rIn - 0.0006, 1], [0.0005, 1]], 40, M.shockOil, cut0, cutLen);
    oil.add(oilCol); oil.position.y = SH.y0 + 0.004; D.oilCol = oilCol; oilCol.renderOrder = 2;
    rig.add(tagPart(oil, "oil")); P.oil = oil; D.oil = oil;
    // air bubbles above a low oil level (leaking)
    var bub = new THREE.InstancedMesh(new THREE.SphereGeometry(0.0016, 8, 6), M.bubble, 30); bub.frustumCulled = false; rig.add(bub); D.bubbles = bub;
    D.bubbleSeeds = []; var rb = rng(44); for (var b = 0; b < 30; b++) D.bubbleSeeds.push([rb(), rb(), rb()]);

    // moving part: piston with real orifices (Shape + holes, extruded), rod, top seat, top eye
    var mover = new THREE.Group();
    var ps = new THREE.Shape(); ps.absarc(0, 0, SH.rIn - 0.0008, 0, TAU, false);
    var orificeRings = new THREE.Group();
    for (var h = 0; h < SH.holes; h++) {
      var a = h / SH.holes * TAU, hx = Math.cos(a) * SH.holeRing, hz = Math.sin(a) * SH.holeRing;
      var hole = new THREE.Path(); hole.absarc(hx, hz, SH.holeR, 0, TAU, true); ps.holes.push(hole);
      var ringM = new THREE.Mesh(new THREE.TorusGeometry(SH.holeR + 0.0004, 0.0005, 6, 16), M.blackPlastic); ringM.rotation.x = Math.PI / 2; ringM.position.set(hx, 0.0081, -hz); orificeRings.add(ringM);
    }
    var pg = new THREE.ExtrudeGeometry(ps, { depth: 0.008, bevelEnabled: true, bevelThickness: 0.0006, bevelSize: 0.0005, bevelSegments: 1, curveSegments: 24 });
    pg.rotateX(-Math.PI / 2);
    var piston = new THREE.Group(); piston.add(new THREE.Mesh(pg, M.brass));
    var band = new THREE.Mesh(new THREE.TorusGeometry(SH.rIn - 0.0008, 0.0009, 6, 32), M.blackPlastic); band.rotation.x = Math.PI / 2; band.position.y = 0.004; piston.add(band);
    piston.position.y = SH.pistonY; mover.add(tagPart(piston, "piston")); P.piston = piston;
    orificeRings.position.y = SH.pistonY; mover.add(tagPart(orificeRings, "orifices")); P.orifices = orificeRings;
    var prod = new THREE.Mesh(new THREE.CylinderGeometry(0.0045, 0.0045, SH.rodTop - SH.pistonY, 16), M.chrome); prod.position.y = (SH.rodTop + SH.pistonY) / 2 + 0.008; mover.add(prod);
    var seatT = lathe([[0.006, SH.rodTop - 0.03], [0.038, SH.rodTop - 0.03], [0.038, SH.rodTop - 0.022], [0.012, SH.rodTop - 0.016]], 40, M.steel); mover.add(seatT);
    var dust = lathe([[0.024, SH.rodTop - 0.03], [0.026, SH.rodTop - 0.03], [0.026, SH.rodTop - 0.1], [0.024, SH.rodTop - 0.1]], 32, M.blackPlastic, cut0, cutLen); mover.add(dust);
    var eyeT = new THREE.Mesh(new THREE.TorusGeometry(0.014, 0.0065, 10, 24), M.darkSteel); eyeT.position.y = SH.rodTop + 0.012; mover.add(eyeT);
    var bracket = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.16, 16), M.redPaint); bracket.rotation.x = Math.PI / 2; bracket.position.y = SH.rodTop + 0.012; mover.add(bracket);
    var mass = slab(0.2, 0.05, 0.12, 0.01, M.darkSteel); mass.position.y = SH.rodTop + 0.03; mover.add(mass);
    var ml = labelSprite("sprung mass", 0.08); ml.position.set(0, SH.rodTop + 0.1, 0.07); mover.add(ml); D.massLabel = ml;
    rig.add(mover); D.mover = mover;

    // coil spring between the seats (rebuilt with length)
    var coil = new THREE.Mesh(helixGeometry({ R: 0.033, turns: 7, len: 0.2, wire: 0.005, closedEnds: true, radSeg: 8 }), M.springRed);
    rig.add(tagPart(coil, "coil")); P.coil = coil; D.coil = coil;

    // oil jets through the orifices (instanced droplets), warm with heat
    var jets = new THREE.InstancedMesh(new THREE.SphereGeometry(0.0013, 6, 5), M.jet, 72); jets.frustumCulled = false; rig.add(jets); D.jets = jets;
    D.jetP = []; for (var j = 0; j < 72; j++) D.jetP.push({ life: 0, x: 0, y: 0, z: 0, vy: 0 });
    // weeping oil on the outside (leaking): streak + falling drip
    var streak = new THREE.Mesh(new THREE.CylinderGeometry(SH.rOut + 0.0004, SH.rOut + 0.0004, 0.11, 24, 1, true, -0.2, 0.8), M.oilStain);
    streak.position.y = SH.y1 - 0.07; rig.add(streak); D.streak = streak;
    var drip = new THREE.Mesh(new THREE.SphereGeometry(0.0028, 10, 8), M.oilStain); drip.scale.y = 1.4; rig.add(drip); D.drip = drip;

    D.shLabels = [];
    var la = labelSprite("piston + orifices", 0.08); la.position.set(-0.13, SH.pistonY, 0.03); rig.add(la); D.shLabels.push(la);
    var lb = labelSprite("oil", 0.08); lb.position.set(0.1, 0.07, 0.03); rig.add(lb); D.shLabels.push(lb);
    var lc = labelSprite("coil spring", 0.08); lc.position.set(0.12, 0.2, 0.03); rig.add(lc); D.shLabels.push(lc);
    rig.add(fitBox(-0.12, 0.12, -0.06, 0.5, -0.06, 0.06));
    return rig;
  }

  /* ===================================================================
     6. CREATE
     =================================================================== */
  function create(opts) {
    opts = opts || {};
    var M = mats();
    var g = new THREE.Group(); g.name = "MassSpringKit";
    var S = {};
    Object.keys(DEFAULTS).forEach(function (k) { S[k] = opts[k] !== undefined ? opts[k] : DEFAULTS[k]; });
    if (MODES.indexOf(S.mode) < 0) S.mode = "period";
    var onEvent = typeof opts.onEvent === "function" ? opts.onEvent : null;
    function emit(name, detail) { if (onEvent) { try { onEvent(name, detail); } catch (e) { /* caller's problem */ } } }

    var PL = {}, PO = {}, PS = {}, D = {};
    var RIG = { lab: buildLab(M, PL, D), okada: buildOkada(M, PO, D), shock: buildShock(M, PS, D) };
    // each mesh gets its own material copy so a highlight glows on that part only
    // (RidgeRoadProps objects keep their own materials: they animate them themselves)
    function cloneMats(o) {
      if (o.userData.keepMaterials) return;
      if ((o.isMesh || o.isInstancedMesh) && o.material && !Array.isArray(o.material) && !o.userData.fitHelper) o.material = o.material.clone();
      for (var i = 0; i < o.children.length; i++) cloneMats(o.children[i]);
    }
    if (D.props) D.props.obj.userData.keepMaterials = true;
    if (D.propRoad) D.propRoad.userData.keepMaterials = true;
    Object.keys(RIG).forEach(function (k) { cloneMats(RIG[k]); g.add(RIG[k]); });
    // the clones broke shared references needed later: re-point live materials
    D.liquidMat = D.beaker.userData.liquid.material;
    D.oilMat = D.oilCol.material;
    D.jetMat = D.jets.material;
    D.flashMat = D.crate ? D.crate.userData.flash.material : null;

    var parts = {};
    var sim = { t: 0 };
    var L = { t0: 0, A0: 0, released: false, trans: null, watch: { run: false, t: 0, start: 0, n: 0, target: 0, auto: false, reaction: 0, result: null, startDelay: 0 },
      amps: [], recorded: [] };
    var O = { s: 0, Acur: 0, crate: { y: 0, v: 0, on: true }, cracks: 0, lastCrack: -9, lifted: false, press: null, x: 0, v: 0, a: 0 };
    var SHK = { st: { x: 0, v: 0 }, acc: 0, t: 0, pushes: [], peaks: [], curMax: 0, heat: 0, env: 0, envT: 0, lastPushT: -9, nextPush: null, pushesLeft: 0, interval: STORY.pushEvery };

    function curA() { return S.A != null ? S.A : A_DEFAULT[S.mode]; }
    function view() { return S.mode === "okada" ? (S.view === "shock" ? "shock" : "bench") : "lab"; }
    function zeta() { return zetaFor(S.leak, S.zeta); }
    function rigKey() { var v = view(); return v === "bench" ? "okada" : v; }
    function w0Ok() { return Math.sqrt(S.kOkada / S.mass); }

    /* ---------------- visibility per mode ---------------- */
    function applyMode() {
      var v = view();
      RIG.lab.visible = v === "lab"; RIG.okada.visible = v === "bench"; RIG.shock.visible = v === "shock";
      var m = S.mode, lab = v === "lab", tt = m === "testtube";
      if (lab) {
        PL.spring.visible = !tt; PL.mass.visible = !tt; PL.stand.visible = !tt; PL.clamp.visible = !tt; PL.ruler.visible = !tt;
        PL.stopwatch.visible = m === "period" || m === "hooke" || m === "damping";
        PL.vane.visible = m === "damping";
        PL.beaker.visible = m === "damping" || tt; PL.jack.visible = m === "damping";
        PL.testtube.visible = tt;
        D.arrows.visible = m === "forces" || tt; PL.equilibrium.visible = m === "forces" || tt;
        D.ebars.visible = m === "energy";
        D.lSpring.userData.want = !tt; D.lRule.userData.want = !tt && m !== "energy"; D.lWatch.userData.want = PL.stopwatch.visible;
        D.lBeaker.userData.want = m === "damping"; D.lTube.userData.want = tt;
        D.labels.forEach(function (l) { l.visible = !!(S.labels && l.userData.want); });
        D.fLab.visible = D.eqLab.visible = !!S.labels;
        var liq = D.liquidMat;
        if (tt) { liq.color.setHex(0x6fb7e6); liq.opacity = 0.38; D.beaker.userData.liquid.visible = true; }
        else if (S.medium === "air") D.beaker.userData.liquid.visible = false;
        else { D.beaker.userData.liquid.visible = true; liq.color.setHex(S.medium === "oil" ? 0xc98a1c : 0x6fb7e6); liq.opacity = S.medium === "oil" ? 0.62 : 0.38; }
        D.beaker.userData.liquid.scale.y = LAB.liquid;
      }
      D.okLabels.forEach(function (l) { l.visible = !!S.labels; });
      D.shLabels.forEach(function (l) { l.visible = !!S.labels; }); D.massLabel.visible = !!S.labels;
      var src = v === "lab" ? PL : v === "bench" ? PO : PS;
      Object.keys(parts).forEach(function (k) { delete parts[k]; });
      Object.keys(src).forEach(function (k) { parts[k] = src[k]; });
      // the shock view also answers to the okada names used by narration
      if (v === "shock") { parts["rear-shock"] = RIG.shock; }
      if (v === "lab" && tt) { parts.mass = PL.testtube; }
      setupMassDiscs();
      placeBeaker();
      if (v === "shock") { var lvl = S.leak ? 0.28 : 0.86; D.oil.scale.y = (SH.y1 - SH.y0 - 0.02) * lvl; D.oilLevel = lvl; }
    }
    function setupMassDiscs() {
      var n = Math.max(0, Math.min(9, Math.round(S.m / 0.05) - 1));
      for (var i = 0; i < D.discs.length; i++) D.discs[i].visible = i < n;
      var shotN = Math.max(6, Math.min(26, Math.round(S.tubeMass / 0.03 * 20)));
      D.tube.userData.shot.count = shotN;
    }
    function placeBeaker() {
      if (S.mode === "testtube") { D.beaker.position.set(LAB.x, 0.0, 0); D.lTube.position.set(LAB.x, -0.02, 0.07); return; }
      // damping: raise the jack so the vane sits at mid-depth of the liquid at equilibrium
      var x0 = spring(S.m, S.k).x0;
      var vaneY = LAB.bottom0 - x0 - LAB.vaneDrop;
      var beakerBase = vaneY - (0.0025 + LAB.liquid / 2);
      var h = Math.max(0.03, beakerBase - 0.022);
      D.jack.setHeight(h); D.beaker.position.set(LAB.x, 0.022 + h, 0);
      D.lBeaker.position.set(LAB.x - 0.1, 0.022 + h + 0.06, 0.03);
    }

    /* ---------------- spring geometry ---------------- */
    var lastLen = -1;
    function setSpringExt(x) {
      var len = LAB.L0 + x;
      if (Math.abs(len - lastLen) > 0.0004) {
        lastLen = len;
        var geo = helixGeometry({ R: LAB.R, turns: LAB.turns, len: len, wire: LAB.wire, loops: true, lead: LAB.lead });
        D.spring.geometry.dispose(); D.spring.geometry = geo;
      }
      D.load.position.y = LAB.yTop - (len + 2 * LAB.lead);
    }

    /* ---------------- lab motion ---------------- */
    function labX() {     // displacement below equilibrium (+ = down), from the model
      var m = S.mode, s = spring(S.m, S.k), tau = sim.t - L.t0;
      if (m === "testtube") {
        var tm = testtube(S.tubeMass, S.tubeR, S.rho);
        return L.released ? L.A0 * Math.pow(0.9, tau / tm.T) * Math.cos(tm.w * tau) : 0;
      }
      if (!L.released) {
        if (L.trans) { var tt = sim.t - L.trans.t0; return L.trans.dx * Math.exp(-3 * tt) * Math.cos(s.w * tt); }
        return 0;
      }
      if (m === "damping" || m === "energy") {
        var dm = damping(S.medium, L.A0, S.m, S.k);
        return L.A0 * Math.pow(dm.ratio, tau / dm.Td) * Math.cos(TAU * tau / dm.Td);
      }
      return L.A0 * Math.cos(s.w * tau);
    }
    function labV() { var h = 1e-3, x1 = labX(); sim.t += h; var x2 = labX(); sim.t -= h; return (x2 - x1) / h; }

    function updateWatch() {
      var W = L.watch, s = spring(S.m, S.k);
      if (W.run) {
        var el = sim.t - W.start;
        W.n = Math.max(0, Math.floor(el / s.T + 1e-9));
        if (W.auto && el >= W.target * s.T) {
          W.run = false; W.n = W.target; W.t = W.target * s.T + W.reaction;
          W.result = period(S.m, S.k, W.target, W.reaction);
          emit("timed", W.result);
        } else W.t = Math.max(0, el);
      }
      var shown = W.result && !W.run ? W.result.t : W.t;
      D.watch.paint(shown.toFixed(2) + "|" + W.n + "|" + W.run, shown, W.n, W.run);
    }

    function stepLab() {
      var x = labX(), m = S.mode;
      if (m === "testtube") {
        var tm = testtube(S.tubeMass, S.tubeR, S.rho);
        var surf = D.beaker.position.y + 0.0025 + LAB.liquid;
        D.tube.position.set(LAB.x, surf - tm.depth - x, 0);
        D.eq.position.set(LAB.x + 0.03, surf, 0); D.eqLab.position.x = 0.05;  D.eqLab.position.y = 0.014;
        D.arrows.position.set(LAB.x, D.tube.position.y + 0.02, 0);
        var F = -tm.k * x;                        // +x is down, so F > 0 means upward here (push back up)
        D.fArrow.set(x * 2.4); D.vArrow.visible = false; D.aArrow.visible = false; D.vLab.visible = D.aLab.visible = false;
        D.fLab.position.set(0.045, x * 2.4 + (x >= 0 ? 0.012 : -0.012), 0); void F;
        var amp = Math.abs(x), rp = D.ripple; rp.position.y = 0.0025 + LAB.liquid + 0.001;
        var ph = (sim.t * 1.6) % 1; rp.scale.setScalar(1 + ph * 3); rp.material.opacity = L.released ? (1 - ph) * Math.min(0.6, amp * 40) : 0;
        return;
      }
      D.ripple.material.opacity = 0;
      var s = spring(S.m, S.k), ext = s.x0 + x;
      setSpringExt(ext);
      if (m === "forces") {
        var eqY = LAB.bottom0 - s.x0 - LAB.hookToBase;
        D.eq.position.set(LAB.x + 0.03, eqY, 0); D.eqLab.position.x = -0.16; D.eqLab.position.y = 0.012;
        D.arrows.position.set(LAB.x, D.load.position.y - LAB.hookToBase, 0);
        var v = labV(), a = -(S.k / S.m) * x;
        D.fArrow.set(x * 1.6);                    // restoring force kx, drawn towards equilibrium (+x down → arrow up)
        D.vArrow.set(-v * 0.16); D.aArrow.set(-a * 0.012);
        D.vLab.visible = D.aLab.visible = !!S.labels;
        D.fLab.position.set(0.045, x * 1.6 + (x >= 0 ? 0.012 : -0.012), 0);
        D.vLab.position.set(0.075, -v * 0.16 + (v < 0 ? 0.012 : -0.012), 0);
        D.aLab.position.set(0.1, -a * 0.012 + (a < 0 ? 0.012 : -0.012), 0);
      }
      if (m === "energy" || (m === "damping" && L.released)) {
        var dm = damping(S.medium, L.released ? L.A0 : curA(), S.m, S.k);
        var tau = Math.max(0, sim.t - L.t0), Anow = L.released ? L.A0 * Math.pow(dm.ratio, tau / dm.Td) : 0;
        var en = energy(S.k, Anow, x), E0 = Math.max(1e-6, 0.5 * S.k * Math.pow(L.released ? L.A0 : curA(), 2));
        var hmax = 0.25;
        D["ke-bar"].scale.y = Math.max(0.001, en.KE / E0 * hmax); D["pe-bar"].scale.y = Math.max(0.001, en.PE / E0 * hmax); D["total-bar"].scale.y = Math.max(0.001, en.E / E0 * hmax);
        if (!L.released) { D["ke-bar"].scale.y = 0.001; D["pe-bar"].scale.y = 0.001; D["total-bar"].scale.y = 0.001; }
      }
      updateWatch();
    }

    /* ---------------- okada motion ---------------- */
    var lastShockLen = -1;
    function stepOkada(dt) {
      var mod = okada(S.parked ? 0 : S.speed_kmh, S.mass, zeta(), S.kOkada, S.d, S.Y);
      var w0 = mod.w0, z = zeta(), yBody = 0, vBody = 0, aBody = 0;
      if (S.parked) {
        if (O.press) {
          var tau = sim.t - O.press.t0, wd = w0 * Math.sqrt(1 - z * z), env = O.press.A * Math.exp(-z * w0 * tau);
          yBody = -env * Math.cos(wd * tau);
          vBody = O.press.A * Math.exp(-z * w0 * tau) * (z * w0 * Math.cos(wd * tau) + wd * Math.sin(wd * tau));
          aBody = -w0 * w0 * yBody - 2 * z * w0 * vBody;
        }
        O.Acur = 0;
      } else {
        O.s += mod.v * dt;
        var tc = 1 / Math.max(0.05, z * w0);
        O.Acur += (mod.A - O.Acur) * Math.min(1, dt / tc);
        var ph = TAU * O.s / S.d - mod.phase, wdr = TAU * mod.f;
        yBody = O.Acur * Math.sin(ph); vBody = O.Acur * wdr * Math.cos(ph); aBody = -O.Acur * wdr * wdr * Math.sin(ph);
      }
      O.x = yBody; O.v = vBody; O.a = aBody;
      // ridges scroll under the bike
      if (D.roadTex) D.roadTex.offset.x = (O.s / (OK.roadLen / 3)) % 1;
      var span = S.d * 4;
      function wrapX(x) { return ((x % span) + span) % span - span / 2; }
      D.ridges.forEach(function (rm, i) { rm.position.x = wrapX(OK.rearX - O.s + i * S.d + 0.0001); });
      function bumpAt(x) { var h = 0; D.ridges.forEach(function (rm) { var u = x - rm.position.x; if (Math.abs(u) < OK.ridgeW / 2) h = Math.max(h, D.ridgeH * Math.pow(Math.cos(Math.PI * u / OK.ridgeW), 2)); }); return h; }
      var yR, yF;
      if (D.propRoad) { D.propRoad.scroll(O.s); yR = D.propRoad.bumpAt(D.propWheelX[0]); yF = D.propRoad.bumpAt(D.propWheelX[1]); }
      else { yR = bumpAt(OK.rearX); yF = bumpAt(OK.frontX); }
      // crate: a free body the carrier can push up but never pull down (1-D, relative to the carrier)
      var c = O.crate, sub = 4, h = dt / sub;
      for (var i = 0; i < sub; i++) {
        if (c.on) { c.y = yBody; c.v = vBody; if (aBody < -G) { c.on = false; O.lifted = true; emit("lift", { speed_kmh: S.speed_kmh, A: O.Acur }); } }
        else {
          c.v -= G * h; c.y += c.v * h;
          if (c.y <= yBody) {
            var rel = vBody - c.v; c.y = yBody; c.on = true;
            if (rel > 0.12 && sim.t - O.lastCrack > 0.6) { O.cracks++; O.lastCrack = sim.t; emit("crack", { speed_kmh: S.speed_kmh, cracks: O.cracks, rel: rel }); if (D.props && D.props.crack) D.props.crack(); }
          }
        }
      }
      var dy = c.y - yBody;
      if (D.props) {
        if (D.props.setSpeed) D.props.setSpeed(S.parked ? 0 : S.speed_kmh);
        if (D.lastLeak !== !!S.leak && D.props.api && typeof D.props.api.setLeak === "function") { D.lastLeak = !!S.leak; try { D.props.api.setLeak(D.lastLeak); } catch (e) { /* optional */ } }
        if (D.props.setWheelBump) D.props.setWheelBump(yF, yR);
        if (D.props.setBounce) D.props.setBounce(yBody);
        if (D.props.liftCrate) D.props.liftCrate(dy);
        if (D.props.update) D.props.update(dt, sim.t);
      } else poseStandIn(yBody, yF, yR, dy);
      D.speedo.paint(String(Math.round(S.parked ? 0 : S.speed_kmh)), S.parked ? 0 : S.speed_kmh);
      if (D.flashMat) D.flashMat.opacity = Math.max(0, 0.55 - (sim.t - O.lastCrack) * 1.2);
      updateOkadaWatch();
    }
    function poseStandIn(yBody, yF, yR, dy) {
      D.rearWheel.position.y = OK.wheelR + yR; D.frontWheel.position.y = OK.wheelR + yF;
      var spin = -O.s / OK.wheelR; D.rearWheel.rotation.z = spin; D.frontWheel.rotation.z = spin;
      D.body.position.y = OK.wheelR + yF;
      // the carrier (1.43 m behind the front axle) follows the sprung motion yBody
      D.body.rotation.z = -Math.atan2(yBody + yR * 0.4 - yF, OK.frontX + 0.77);
      D.body.updateMatrix();
      var pivotW = new V3(-0.15 - OK.frontX, 0.45 - OK.wheelR, 0).applyMatrix4(D.body.matrix);
      var axle = new V3(OK.rearX, OK.wheelR + yR, 0);
      D.swing.forEach(function (s) {
        var a = pivotW.clone(); a.z = s.z; var b = axle.clone(); b.z = s.z;
        var dir = new V3().subVectors(b, a); s.m.position.copy(a).addScaledVector(dir, 0.5);
        s.m.scale.x = dir.length(); s.m.rotation.set(0, 0, Math.atan2(dir.y, dir.x));
      });
      var lowW = axle.clone().lerp(pivotW, 0.12); lowW.y += 0.04;
      var upW = new V3(-0.5 - OK.frontX, 0.84 - OK.wheelR, 0).applyMatrix4(D.body.matrix);
      var len = upW.distanceTo(lowW);
      D.shocks.forEach(function (sh) {
        var a = lowW.clone(); a.z = sh.z; var b = upW.clone(); b.z = sh.z;
        sh.g.position.copy(a);
        sh.g.quaternion.setFromUnitVectors(_up, new V3().subVectors(b, a).normalize());
        sh.eyeB.position.set(0, 0, 0); sh.eyeT.position.set(0, len, 0);
        sh.body.position.y = 0.1; sh.rod.position.y = len - 0.1;
        sh.stain.position.y = 0.13; sh.stain.visible = !!S.leak;
      });
      if (Math.abs(len - lastShockLen) > 0.002) {
        lastShockLen = len;
        D.shocks.forEach(function (sh) {
          var geo = helixGeometry({ R: 0.03, turns: 8, len: len - 0.07, wire: 0.0055, closedEnds: true, radSeg: 8 });
          sh.coil.geometry.dispose(); sh.coil.geometry = geo; sh.coil.position.y = len - 0.035;
        });
      }
      var top = D.carrierTop.clone().applyMatrix4(D.body.matrix);
      D.crate.position.set(top.x, top.y + dy, 0); D.crate.rotation.z = D.body.rotation.z;
    }
    function updateOkadaWatch() {
      var W = L.watch;
      if (!W.run) return;
      var T = okadaParked(S.mass, 1, S.kOkada).T, el = sim.t - W.start;
      W.n = Math.max(0, Math.floor(el / T + 1e-9));
      if (W.auto && el >= W.target * T) {
        W.run = false; W.n = W.target; W.result = okadaParked(S.mass, W.target, S.kOkada); W.result.t += W.reaction; W.t = W.result.t;
        emit("timed", W.result);
      } else W.t = el;
    }

    /* ---------------- shock (cut-away) ---------------- */
    var lastCoil = -1;
    function stepShock(dt) {
      var z = zeta(), w0 = w0Ok(), st = SHK.st;
      SHK.acc += Math.min(dt, 0.1);
      var c = 2 * z * w0;           // damping per unit mass
      while (SHK.acc >= SH_H) {
        SHK.acc -= SH_H;
        if (SHK.pushesLeft > 0 && SHK.t >= SHK.nextPush - 1e-9) {
          if (SHK.pushes.length) SHK.peaks.push(r(SHK.curMax * 100, 2));
          SHK.curMax = 0; st.v -= STORY.pushDv; SHK.pushesLeft--; SHK.nextPush += SHK.interval; SHK.pushes.push(SHK.t);
          emit("push", { n: SHK.pushes.length, leak: !!S.leak });
          if (SHK.pushesLeft === 0) SHK.finalAt = SHK.nextPush;
        }
        shockStep(st, z, w0, SH_H); SHK.t += SH_H;
        SHK.curMax = Math.max(SHK.curMax, Math.abs(st.x));
        SHK.heat += c * st.v * st.v * SH_H;            // energy per kg turned into heat in the oil
        if (SHK.finalAt != null && SHK.t >= SHK.finalAt - 1e-9) { SHK.peaks.push(r(SHK.curMax * 100, 2)); SHK.finalAt = null; emit("pushes-done", { peaks: SHK.peaks.slice(), leak: !!S.leak }); }
      }
      SHK.heat *= Math.exp(-dt / 6);
      // envelope (largest |x| over the last natural period)
      if (Math.abs(st.x) > SHK.env || sim.t - SHK.envT > 1 / (w0 / TAU)) { SHK.env = Math.abs(st.x); SHK.envT = sim.t; }
      var x = Math.max(-0.1, Math.min(0.1, st.x));
      D.mover.position.y = x;
      var lo = 0.082, hi = SH.rodTop - 0.03 + x, clen = hi - lo;
      if (Math.abs(clen - lastCoil) > 0.0006) {
        lastCoil = clen;
        var geo = helixGeometry({ R: 0.033, turns: 7, len: clen, wire: 0.005, closedEnds: true, radSeg: 8 });
        D.coil.geometry.dispose(); D.coil.geometry = geo;
      }
      D.coil.position.y = hi;
      // oil warms (colour + glow) with dissipated energy
      var heat = Math.min(1, SHK.heat / 0.6);
      var oc = new THREE.Color(0xb8741a).lerp(new THREE.Color(0xff5a1f), heat);
      D.oilMat.color.copy(oc); D.oilMat.emissive.setHex(0xff4a10); D.oilMat.emissiveIntensity = heat * 0.55;
      D.jetMat.color.copy(new THREE.Color(0xffc56a).lerp(new THREE.Color(0xff3d12), heat));
      // jets: oil squirts through the orifices, opposite to the piston motion, only where the piston is in oil
      var oilTop = SH.y0 + 0.004 + D.oil.scale.y, pistonY = SH.pistonY + x, inOil = pistonY + 0.004 < oilTop;
      var dirJ = st.v < 0 ? 1 : -1, sp = Math.abs(st.v), mtx = new THREE.Matrix4(), k = 0;
      D.jetP.forEach(function (p, i) {
        if (p.life <= 0 && inOil && sp > 0.03 && Math.random() < sp * dt * 60) {
          var hh = i % SH.holes, a = hh / SH.holes * TAU;
          p.x = Math.cos(a) * SH.holeRing; p.z = -Math.sin(a) * SH.holeRing; p.y = pistonY + (dirJ > 0 ? 0.009 : -0.001);
          p.vy = dirJ * (0.08 + sp * 1.4); p.life = 0.25 + Math.random() * 0.15;
        }
        if (p.life > 0) { p.life -= dt; p.y += p.vy * dt; p.vy *= Math.exp(-dt * 6); if (p.y > oilTop) p.life = 0; }
        if (p.life > 0) { mtx.makeTranslation(p.x, p.y, p.z); D.jets.setMatrixAt(k++, mtx); }
      });
      D.jets.count = k; D.jets.instanceMatrix.needsUpdate = true;
      // bubbles in the air space above a low oil level
      var nb = 0;
      if (S.leak) {
        D.bubbleSeeds.forEach(function (s) {
          var yy = oilTop - 0.012 + ((s[2] + sim.t * (0.04 + s[0] * 0.05)) % 1) * 0.02, rr2 = (SH.rIn - 0.003) * Math.sqrt(s[0]), aa = s[1] * TAU;
          mtx.makeTranslation(Math.sin(aa) * rr2, Math.min(yy, oilTop), Math.cos(aa) * rr2); D.bubbles.setMatrixAt(nb++, mtx);
        });
      }
      D.bubbles.count = nb; D.bubbles.instanceMatrix.needsUpdate = true;
      D.streak.visible = !!S.leak; D.drip.visible = !!S.leak;
      if (S.leak) { var dp = (sim.t * 0.6) % 1; D.drip.position.set(Math.sin(0.2) * (SH.rOut + 0.002), SH.y1 - 0.12 - dp * dp * 0.22, Math.cos(0.2) * (SH.rOut + 0.002)); }
    }

    /* ---------------- highlight ---------------- */
    var hi = null;
    var propHL = [];
    function within(o, root) { for (var q = o; q; q = q.parent) if (q === root) return true; return false; }
    function highlight(part) {
      if (hi) hi.mats.forEach(function (m) { m.mat.emissive.setHex(m.e); m.mat.emissiveIntensity = m.i; });
      hi = null;
      propHL.forEach(function (h) { h.clear(); }); propHL = [];
      if (!part) return;
      var obj = parts[part]; if (!obj) return;
      // RidgeRoadProps shares materials between parts: let its own highlighter clone them per mesh
      var RP = global.RidgeRoadProps, roots = [D.props && D.props.obj, D.propRoad].filter(Boolean);
      for (var r0 = 0; r0 < roots.length; r0++) {
        if (RP && typeof RP.makeHighlighter === "function" && obj !== roots[r0] && within(obj, roots[r0])) {
          try { var h = RP.makeHighlighter(roots[r0]); h.highlight(obj.userData.partId || part, 0xffb23f); propHL.push(h); } catch (e) { /* optional */ }
          return;
        }
      }
      var list = [], seen = [];
      function take(o) { if ((o.isMesh || o.isInstancedMesh) && o.material && !Array.isArray(o.material) && o.material.emissive && seen.indexOf(o.material) < 0) { seen.push(o.material); list.push({ mat: o.material, e: o.material.emissive.getHex(), i: o.material.emissiveIntensity }); } }
      obj.traverse(take);
      RIG[rigKey()].traverse(function (o) { if (o.userData.partId === part) take(o); });   // parts spread over batched meshes (RidgeRoadProps)
      hi = { part: part, mats: list };
    }

    /* ---------------- main update ---------------- */
    function update(dt, t) {
      dt = Math.min(0.05, Math.max(0, dt || 0));
      var sdt = dt * (S.timeScale || 1);
      sim.t += sdt;
      var v = view();
      if (v === "lab") stepLab();
      else if (v === "bench") stepOkada(sdt);
      else stepShock(sdt);
      if (hi) { var p = 0.35 + 0.35 * Math.sin((t != null ? t : sim.t) * 6); hi.mats.forEach(function (m) { m.mat.emissive.setHex(0xffb23f); m.mat.emissiveIntensity = p; }); }
    }

    /* ---------------- actions ---------------- */
    function resetDyn() {
      L.released = false; L.trans = null; L.A0 = 0; L.t0 = sim.t;
      L.watch = { run: false, t: 0, start: 0, n: 0, target: 0, auto: false, reaction: 0, result: null };
      L.recorded = [];
      O.s = 0; O.Acur = 0; O.crate = { y: 0, v: 0, on: true }; O.cracks = 0; O.lifted = false; O.press = null; O.lastCrack = -9;
      SHK.st = { x: 0, v: 0 }; SHK.acc = 0; SHK.t = 0; SHK.pushes = []; SHK.peaks = []; SHK.curMax = 0; SHK.heat = 0; SHK.env = 0; SHK.pushesLeft = 0; SHK.finalAt = null;
      lastLen = -1;
    }
    function setMass(mkg) {
      var old = S.m, nm = Math.max(0.05, Math.min(0.5, Math.round(mkg * 20) / 20));
      if (nm === old) return;
      S.m = nm;
      if (!L.released) { L.trans = { t0: sim.t, dx: spring(old, S.k).x0 - spring(nm, S.k).x0 }; }
      setupMassDiscs(); placeBeaker();
      var h = hooke(S.m, S.k, S.g); emit("mass", h);
    }
    function addMass(dm) { setMass(S.m + (dm || 0.05)); }
    function removeMass(dm) { setMass(S.m - (dm || 0.05)); }
    function release(A) {
      var v = view();
      if (v === "bench") return press(A);
      if (v === "shock") return push();
      L.A0 = A != null ? A : curA(); if (!L.A0) L.A0 = A_DEFAULT.period;
      L.released = true; L.t0 = sim.t; L.trans = null; L.watch.result = null;
      emit("release", { mode: S.mode, A: L.A0 });
    }
    function timeN(n, reaction) {
      n = n || S.n;
      var W = L.watch;
      if (view() === "bench") {
        if (!S.parked) return;
        if (!O.press) press();
        W.run = true; W.auto = true; W.target = n; W.reaction = reaction || 0; W.start = sim.t; W.result = null; W.n = 0; return;
      }
      if (!L.released) release();
      // start at the next pass through the rest position (the pointer at equilibrium)
      var s = spring(S.m, S.k), tau = sim.t - L.t0, q = s.T / 4, k = Math.ceil((tau - q) / (s.T / 2) + 1e-9);
      W.start = L.t0 + q + Math.max(0, k) * s.T / 2;
      W.run = true; W.auto = true; W.target = n; W.reaction = reaction || 0; W.result = null; W.n = 0;
      // the display stays at 0 until the first pass
      W.t = 0;
    }
    function startWatch(delay) { var W = L.watch; W.run = true; W.auto = false; W.start = sim.t + (delay || 0); W.result = null; W.n = 0; W.t = 0; }
    function stopWatch(delay) {
      var W = L.watch; if (!W.run) return null;
      W.run = false; var t = Math.max(0, sim.t + (delay || 0) - W.start);
      var T = view() === "bench" ? okadaParked(S.mass, 1, S.kOkada).T : spring(S.m, S.k).T;
      W.t = t; W.n = Math.round(t / T); W.result = { manual: true, t: t, n: W.n, T: W.n ? t / W.n : null };
      emit("timed", W.result); return W.result;
    }
    function recordAmplitude() {
      if (!L.released) return null;
      var dm = damping(S.medium, L.A0, S.m, S.k), n = Math.floor((sim.t - L.t0) / dm.Td + 1e-9);
      var amps = damping(S.medium, L.A0, S.m, S.k, n).amps;
      L.recorded = amps;
      var out = { medium: S.medium, cycles: n, amps: amps, ratio: dm.ratio };
      emit("amplitude", out); return out;
    }
    function press(A) {
      if (view() !== "bench") return release(A);
      S.parked = true; O.press = { t0: sim.t, A: A != null ? A : 0.03 };
      emit("press", { mass: S.mass, T0: okadaParked(S.mass, 1, S.kOkada).T });
    }
    function push() {
      if (view() !== "shock") return;
      if (SHK.pushesLeft <= 0) SHK.nextPush = SHK.t;
      SHK.pushesLeft = Math.max(SHK.pushesLeft, 0) + 1;
    }
    function pushTrain(n, interval) {
      if (view() !== "shock") return;
      SHK.st = { x: 0, v: 0 }; SHK.pushes = []; SHK.peaks = []; SHK.curMax = 0; SHK.finalAt = null;
      SHK.interval = interval || STORY.pushEvery; SHK.pushesLeft = n || 10; SHK.nextPush = SHK.t;
    }

    /* ---------------- reading (from the model only) ---------------- */
    function reading() {
      var m = S.mode, v = view(), out = { mode: m, view: v === "lab" ? "bench" : v };
      if (v === "lab") {
        var s = spring(S.m, S.k), x = labX();
        if (m === "hooke") {
          var h = hooke(S.m, S.k, S.g); for (var k in h) out[k] = h[k];
          out.k = S.k; out.p0_cm = LAB.p0cm; out.slotted = Math.max(0, Math.round(S.m / 0.05) - 1);
        } else if (m === "period") {
          var W = L.watch, p = period(S.m, S.k, W.result && W.result.n ? W.result.n : S.n, W.result && W.result.manual ? 0 : (W.result ? W.reaction : 0));
          out.m = S.m; out.k = S.k; out.n = p.n; out.t = W.result ? W.result.t : p.t; out.T = W.result && W.result.T ? W.result.T : p.T;
          out.f = 1 / out.T; out.w = TAU / out.T; out.T2 = out.T * out.T; out.Tmodel = s.T;
          out.display = { t: out.t.toFixed(2), T: out.T.toFixed(3), f: out.f.toFixed(2), w: out.w.toFixed(1), T2: String(sf(out.T2, 3)) };
          out.watch = { running: W.run, t: W.result && !W.run ? W.result.t : W.t, count: W.n, timed: !!W.result };
          out.x = x; out.released = L.released;
        } else if (m === "forces") {
          var vv = labV();
          out.m = S.m; out.k = S.k; out.x = x; out.x_cm = x * 100; out.F = -S.k * x; out.a = -(S.k / S.m) * x; out.v = vv; out.A = L.released ? L.A0 : 0;
          out.note = "x measured downward from equilibrium; F and a always point back towards it";
        } else if (m === "energy" || m === "damping") {
          var A0 = L.released ? L.A0 : curA(), dm = damping(S.medium, A0, S.m, S.k);
          var tau = Math.max(0, sim.t - L.t0), An = L.released ? A0 * Math.pow(dm.ratio, tau / dm.Td) : 0, en = energy(S.k, An, x);
          out.m = S.m; out.k = S.k; out.medium = S.medium; out.ratio = dm.ratio; out.A0 = A0; out.A = An; out.x = x;
          out.E0 = dm.E0; out.E = en.E; out.KE = en.KE; out.PE = en.PE;
          out.T = dm.Td; out.T0 = dm.T0; out.t10 = dm.t10; out.cycles = L.released ? Math.floor(tau / dm.Td + 1e-9) : 0;
          out.amps = L.released ? damping(S.medium, A0, S.m, S.k, Math.min(out.cycles, 50)).amps : [];
          out.ampsModel = dm.amps; out.recorded = L.recorded.slice();
          out.display = { E0: dm.E0.toFixed(4), t10: dm.t10.toFixed(2), T: dm.Td.toFixed(3) };
        } else if (m === "testtube") {
          var tm = testtube(S.tubeMass, S.tubeR, S.rho);
          out.m = tm.m; out.r = tm.r; out.rho = tm.rho; out.k = tm.k; out.T = tm.T; out.f = tm.f; out.depth_cm = tm.depth * 100;
          out.x = x; out.F = -tm.k * x; out.note = "restoring force = extra upthrust ρgAx";
        }
      } else if (v === "bench") {
        var mod = okada(S.parked ? 0 : S.speed_kmh, S.mass, zeta(), S.kOkada, S.d, S.Y);
        for (var kk in mod) out[kk] = mod[kk];
        out.speed_kmh = S.parked ? 0 : S.speed_kmh; out.leak = !!S.leak; out.damper = S.leak ? "leaking" : "healthy"; out.parked = !!S.parked;
        out.Acur = O.Acur; out.crateOff = !O.crate.on; out.lifted = O.lifted; out.cracks = O.cracks; out.y = O.x;
        if (S.parked) {
          var pk = okadaParked(S.mass, S.n, S.kOkada), W2 = L.watch;
          out.T = pk.T; out.n = W2.result && W2.result.n ? W2.result.n : S.n; out.t = W2.result ? W2.result.t : pk.t;
          out.watch = { running: W2.run, t: W2.result && !W2.run ? W2.result.t : W2.t, count: W2.n, timed: !!W2.result };
          out.display = { T: pk.T.toFixed(2), t: out.t.toFixed(1), f0: mod.f0.toFixed(2) };
        }
      } else {
        var z = zeta(), w0 = w0Ok(), dl = TAU * z / Math.sqrt(1 - z * z), env = SHK.env;
        var E = 0.5 * S.kOkada * env * env, frac = 1 - Math.exp(-2 * dl);
        out.leak = !!S.leak; out.damper = S.leak ? "leaking" : "healthy"; out.zeta = z; out.mass = S.mass; out.f0 = w0 / TAU;
        out.x = SHK.st.x; out.A = env; out.A_cm = env * 100; out.E = E; out.E_removed_per_cycle = E * frac; out.removedFrac = frac;
        out.oilLevel = D.oilLevel; out.heat = SHK.heat; out.pushes = SHK.pushes.length; out.peaks = SHK.peaks.slice();
        out.peaksModel = shockPushes(z, S.mass, 10, STORY.pushDv, STORY.pushEvery, S.kOkada);
      }
      return out;
    }

    /* ---------------- setState ---------------- */
    function setState(patch) {
      if (!patch) return;
      var modeChanged = false, resetNeeded = false;
      if (patch.reset) { resetDyn(); }
      Object.keys(patch).forEach(function (k) {
        if (k === "reset" || !(k in DEFAULTS)) return;
        var val = patch[k];
        if (k === "mode") { if (MODES.indexOf(val) < 0 || val === S.mode) return; modeChanged = true; }
        if (k === "m") { setMass(val); return; }
        if (k === "leak" || k === "zeta" || k === "mass" || k === "k" || k === "medium" || k === "view" || k === "parked" || k === "tubeMass" || k === "tubeR") resetNeeded = resetNeeded || S[k] !== val;
        if (k === "speed_kmh") val = Math.max(0, Math.min(60, +val));
        S[k] = val;
      });
      if ("leak" in patch && !("zeta" in patch)) S.zeta = null;
      if (modeChanged || resetNeeded) resetDyn();
      applyMode();
    }
    function reset() { resetDyn(); applyMode(); emit("reset", { mode: S.mode }); }

    /* ---------------- framing / picking ---------------- */
    var _box = new THREE.Box3(), _tmp = new THREE.Box3();
    function viewFor(part) {
      g.updateMatrixWorld(true);
      var rig = RIG[rigKey()], obj = part && part !== "all" ? parts[part] : null;
      _box.makeEmpty();
      if (obj) _box.setFromObject(obj);
      else if (view() === "lab") {
        // frame the spring's travel + whatever the mode adds (not the tall stand)
        var tt = S.mode === "testtube";
        if (tt) { _box.setFromObject(PL.beaker); _tmp.setFromObject(PL.testtube); _box.union(_tmp); }
        else {
          var ext = spring(0.5, S.k).x0;
          _box.set(new V3(LAB.ruleX - 0.03, Math.max(0.0, LAB.bottom0 - ext - 0.2), -0.05), new V3(LAB.x + 0.12, LAB.yTop + 0.03, 0.05));
          _box.applyMatrix4(rig.matrixWorld);
          if (S.mode === "energy") { _tmp.setFromObject(D.ebars); _box.union(_tmp); }
          if (S.mode === "damping") { _tmp.setFromObject(PL.beaker); _box.union(_tmp); _tmp.setFromObject(PL.jack); _box.union(_tmp); }
          if (S.mode === "period") { _tmp.setFromObject(PL.stopwatch); _box.union(_tmp); }
        }
      } else rig.traverse(function (o) { if (o.userData.fitHelper) { _tmp.setFromObject(o); _box.union(_tmp); } });
      if (_box.isEmpty()) _box.setFromObject(rig);
      var c = _box.getCenter(new V3()), sz = _box.getSize(new V3());
      var span = Math.max(sz.x, sz.y * 1.05, sz.z * 0.6, 0.05) * (!obj && S.mode === "testtube" ? 1.35 : 1);
      return { target: [c.x, c.y, c.z], dist: span / (2 * Math.tan(20 * Math.PI / 180)) * (obj ? 1.4 : 1.25), pitch: view() === "bench" ? 0.25 : 0.12, yawPortrait: 0 };
    }
    function pickPart(raycaster) {
      var rig = RIG[rigKey()];
      var hits = raycaster.intersectObject(rig, true);
      for (var i = 0; i < hits.length; i++) {
        var o = hits[i].object; if (!o.visible || o.userData.isLabel || o.userData.fitHelper) continue;
        var vis = true; for (var q = o; q; q = q.parent) if (!q.visible) { vis = false; break; }
        if (!vis) continue;
        var id = o.userData.partId; if (id && parts[id]) return id;
      }
      return null;
    }
    function triangles() {
      var n = 0;
      RIG[rigKey()].traverseVisible(function (o) {
        if (!o.isMesh || !o.geometry) return;
        var gg = o.geometry, c = gg.index ? gg.index.count / 3 : gg.attributes.position.count / 3;
        n += o.isInstancedMesh ? c * o.count : c;
      });
      return Math.round(n);
    }
    function action(name, p) {
      p = p || {};
      switch (name) {
        case "add-mass": return addMass(p.dm);
        case "remove-mass": return removeMass(p.dm);
        case "release": case "pull-release": return release(p.A);
        case "time": return timeN(p.n, p.reaction);
        case "start-watch": return startWatch(p.delay);
        case "stop-watch": return stopWatch(p.delay);
        case "record": return recordAmplitude();
        case "press": return press(p.A);
        case "push": return push();
        case "push-train": return pushTrain(p.n, p.interval);
        case "ride": setState({ parked: false, speed_kmh: p.speed_kmh != null ? p.speed_kmh : S.speed_kmh }); return;
        case "stop": setState({ parked: true }); return;
        case "reset": return reset();
        case "mode": return setState({ mode: p.mode });
        default: return undefined;
      }
    }

    // initial pose
    if (S.zeta != null && opts.leak === undefined) S.leak = S.zeta < 0.15;
    resetDyn(); applyMode();
    update(0, 0);

    g.parts = parts; g.userData.parts = parts; g.group = g;
    g.update = g.tick = g.userData.update = update;
    g.setState = g.userData.setState = setState;
    g.reading = reading; g.highlight = highlight; g.clearHighlight = function () { highlight(null); };
    g.viewFor = viewFor; g.pickPart = pickPart; g.triangles = triangles; g.action = action; g.reset = reset;
    g.addMass = addMass; g.removeMass = removeMass; g.release = release; g.timeN = timeN; g.startWatch = startWatch; g.stopWatch = stopWatch;
    g.recordAmplitude = recordAmplitude; g.press = press; g.push = push; g.pushTrain = pushTrain;
    g.getState = function () { var o = {}; for (var k in S) o[k] = S[k]; return o; };
    g.usesProps = !!D.props;
    g.dispose = function () { g.traverse(function (o) { if (o.geometry) o.geometry.dispose(); }); };
    return g;
  }

  /* ---------------- highlighter for any scene (kit contract) ---------------- */
  function makeHighlighter(scene) {
    var saved = [];
    function clear() {
      for (var i = 0; i < saved.length; i++) { var s = saved[i]; s.mesh.material = s.orig; }
      saved.length = 0;
    }
    function highlight(partName, colorHex) {
      clear();
      if (!partName || !scene) return;
      var col = new THREE.Color(colorHex != null ? colorHex : 0xffd166);
      scene.traverse(function (o) {
        if (o.isMesh && o.userData && o.userData.partId === partName && o.material && !Array.isArray(o.material) && o.material.emissive) {
          var c = o.material.clone(); c.emissive.copy(col); c.emissiveIntensity = 0.65;
          saved.push({ mesh: o, orig: o.material }); o.material = c;
        }
      });
    }
    return { highlight: highlight, clear: clear };
  }

  global.MassSpringKit = {
    version: 2, create: create, model: model, defaults: DEFAULTS, modes: MODES.slice(),
    parts: ["spring", "hanger", "slotted-mass", "mass", "pointer", "ruler", "clamp", "stand", "stopwatch", "vane", "beaker", "jack",
      "ke-bar", "pe-bar", "total-bar", "testtube", "equilibrium", "f-arrow", "v-arrow", "a-arrow",
      "okada", "rear-shock", "carrier", "crate", "ridges", "speedometer", "piston", "orifices", "oil", "coil", "damper-body"],
    makeHighlighter: makeHighlighter, helixGeometry: helixGeometry, slottedDiscGeometry: slottedDiscGeometry
  };
})(window);
