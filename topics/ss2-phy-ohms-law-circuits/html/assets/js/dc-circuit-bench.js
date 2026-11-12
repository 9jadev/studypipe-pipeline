/* ==========================================================
   StudyPipe Kit: dc-circuit-bench (v2)
   Parametric 3D DC-electricity physics bench for three.js (window.THREE).
   Classic script (no modules), 100 % offline, no fetch, no external textures.

   window.DcCircuitBench.create(opts) -> THREE.Group g with
     g.group / g.parts / g.userData.parts   named parts of the CURRENT mode (each mesh tagged userData.partId)
     g.tick / g.update / g.userData.update(dt, t)
     g.setState(obj)        mode + every control (see README)
     g.reading()            numbers computed from the physics model (never typed text)
     g.takeReading()        record a row for the practical table (emits 'reading', later 'done')
     g.findBalance()        bridge / potentiometer: slide the jockey to the null point (emits 'balance')
     g.build()              galvanometer: build & test the converted meter (emits 'built')
     g.highlight(part)      pulsing emissive highlight (null clears)
     g.viewFor(part)        { target:[x,y,z], dist, yawPortrait, pitch }  camera framing (phones 360x740)
     g.pickPart(raycaster)  -> partId | null
     g.triangles()          triangle count of the visible bench
   Modes: ohms-law · internal-resistance · network-cells · galvanometer · bridge-potentiometer ("null" alias)
   window.DcCircuitBench.model  pure physics functions (wireR, solveOhms, solveIR, solveNetwork, solveGalv,
                                solveBridge, solvePot) - the only source of every reading.
   window.DCCircuitKit (v1 API kept): createAccumulatorCell(THREE, opts), createAnalogMeter(THREE, opts)

   Scale: 1 scene unit = 15.6 cm (the 100 cm bridge / potentiometer wire is 6.4 units long). Viewer on +z, y up.
   ========================================================== */
(function () {
  "use strict";
  if (typeof THREE === "undefined") return;
  var V3 = THREE.Vector3, TAU = Math.PI * 2;
  var WIRE_LEN = 6.4;            // scene length of 100 cm
  var CM = WIRE_LEN / 100;       // scene units per cm

  /* ===================================================================
     1. THE PHYSICS MODEL (pure functions; every reading comes from here)
     =================================================================== */
  var MATERIALS = {
    copper:     { id: "copper",     name: "copper",     rho: 1.7e-8, alpha: 3.9e-3, color: 0xc8743c },
    constantan: { id: "constantan", name: "constantan", rho: 4.9e-7, alpha: 1.0e-5, color: 0xc4bdb0 },
    nichrome:   { id: "nichrome",   name: "nichrome",   rho: 1.1e-6, alpha: 4.0e-4, color: 0x9aa0a6 }
  };
  var DIAMETERS = [0.30, 0.60, 1.20];
  var LAMP = { R0: 1.0, k: 9.77, alphaW: 4.5e-3, rating: "2.5 V 0.3 A" };   // tungsten torch bulb, cold R0 = 1.0 ohm
  var H_CONV = 60;   // W m^-2 K^-1, still-air heat loss from a thin wire (used only by the "warming" error)

  function areaOf(dmm) { var d = dmm / 1000; return Math.PI * d * d / 4; }
  function wireR(mat, Lcm, dmm) { var m = MATERIALS[mat] || MATERIALS.constantan; return m.rho * (Lcm / 100) / areaOf(dmm); }
  function par(a, b) { if (!isFinite(a)) return b; if (!isFinite(b)) return a; return a * b / (a + b); }
  /* filament: R^2 - R0 R - R0 k V^2 = 0  (resistance rises with the power it dissipates) */
  function lampR(V) { return (LAMP.R0 + Math.sqrt(LAMP.R0 * LAMP.R0 + 4 * LAMP.R0 * LAMP.k * V * V)) / 2; }
  function lampTemp(R) { return Math.min(3000, 293 + (R / LAMP.R0 - 1) / LAMP.alphaW); }
  function bisect(f, lo, hi) { for (var i = 0; i < 80; i++) { var m = (lo + hi) / 2; if (f(m) > 0) hi = m; else lo = m; } return (lo + hi) / 2; }
  function r2(x) { return Math.round(x * 100) / 100; }
  function r1(x) { return Math.round(x * 10) / 10; }
  function sf3(x) { if (!isFinite(x) || x === 0) return x; var p = Math.pow(10, 2 - Math.floor(Math.log10(Math.abs(x)))); return Math.round(x * p) / p; }

  /* --- mode 1: Ohm's law --- s: { E, r, RA, Rh, comp:'constantan'|'copper'|'nichrome'|'lamp', L, d, RV, Rc, dT, alpha, key } */
  function solveOhms(s) {
    var isLamp = s.comp === "lamp";
    var mat = isLamp ? null : MATERIALS[s.comp] || MATERIALS.constantan;
    var Rcold = isLamp ? LAMP.R0 : wireR(mat.id, s.L, s.d);
    var alpha = s.alpha != null ? s.alpha : (mat ? mat.alpha : 0);
    var Rw = isLamp ? null : Rcold * (1 + alpha * (s.dT || 0));
    var Rc = s.Rc || 0, RV = s.RV == null ? Infinity : s.RV;
    function iComp(V) { return isLamp ? V / lampR(V) : V / (Rw + Rc); }       // current in the component branch
    function iDut(V) { return iComp(V) + (isFinite(RV) ? V / RV : 0); }       // + the voltmeter's own current
    var out = { comp: s.comp, material: mat ? mat.id : "tungsten", L_cm: s.L, d_mm: s.d, A_m2: isLamp ? null : areaOf(s.d),
      rho: mat ? mat.rho : null, R_cold: Rcold, R_true: isLamp ? null : Rw, E: s.E, Rh: s.Rh, key: !!s.key };
    if (!s.key) { out.I = 0; out.V = 0; out.ratio = null; out.R_component = isLamp ? LAMP.R0 : Rw; out.P = 0; out.lampT = 293; return out; }
    var Rs = s.r + (s.RA || 0) + s.Rh;
    var V = bisect(function (v) { return iDut(v) * Rs + v - s.E; }, 0, s.E);
    var Ic = iComp(V), I = iDut(V);
    var Rcomp = isLamp ? lampR(V) : Rw;
    out.I = I; out.V = V; out.ratio = I > 0 ? V / I : null; out.R_component = Rcomp;
    var Vc = isLamp ? V : Ic * Rw;
    out.P = Vc * Ic; out.I_component = Ic;
    out.lampT = isLamp ? lampTemp(Rcomp) : 293 + (s.dT || 0);
    /* steady temperature rise the wire would reach (convective loss from its surface) */
    out.dT_ss = isLamp ? 0 : out.P / (H_CONV * Math.PI * (s.d / 1000) * (s.L / 100));
    return out;
  }

  /* --- mode 2: EMF and internal resistance --- s: { E, r, R, RA, RV, Rc, rWarm, key } */
  function solveIR(s) {
    var RV = s.RV == null ? Infinity : s.RV, RA = s.RA || 0;
    var rEff = s.r * (1 + (s.rWarm || 0)) + (s.Rc || 0);      // contact at the cell's own terminals counts as "inside"
    var Rext = s.key ? par(RV, RA + s.R) : RV;
    var Itot = isFinite(Rext) ? s.E / (Rext + rEff) : 0;
    var V = isFinite(Rext) ? Itot * Rext : s.E;               // voltmeter across the terminals
    var I = s.key ? V / (RA + s.R) : 0;                       // ammeter in the external loop
    return { E: s.E, r: s.r, r_eff: rEff, R: s.R, key: !!s.key, I: I, V: V, lost: s.E - V, I_cell: Itot,
      r_apparent: I > 1e-9 ? (s.E - V) / I : null, P_load: I * I * s.R, P_lost: Itot * Itot * rEff, eta: s.key ? V / s.E : null };
  }

  /* --- mode 3: networks and cell arrays --- s: { E, r, n, cells:'single'|'series'|'parallel', net:'load'|'series'|'parallel'|'mixed',
         R, R1, R2, R3, RA, rWarm, Rc } */
  function solveNetwork(s) {
    var n = s.cells === "single" ? 1 : (s.n || 3);
    var r = s.r * (1 + (s.rWarm || 0));
    var Et = s.cells === "parallel" ? s.E : n * s.E;
    var rt = s.cells === "parallel" ? r / n : n * r;
    var R1 = s.net === "load" ? s.R : s.R1, R2 = s.R2 + (s.Rc || 0), R3 = s.R3, Req, br;
    if (s.net === "load") Req = R1;
    else if (s.net === "series") Req = R1 + R2 + R3;
    else if (s.net === "parallel") Req = 1 / (1 / R1 + 1 / R2 + 1 / R3);
    else Req = R1 + par(R2, R3);
    var RA = s.RA || 0, I = Et / (Req + rt + RA), Vn = I * Req;
    if (s.net === "load") br = [I, 0, 0];
    else if (s.net === "series") br = [I, I, I];
    else if (s.net === "parallel") br = [Vn / R1, Vn / R2, Vn / R3];
    else { var v23 = I * par(R2, R3); br = [I, v23 / R2, v23 / R3]; }
    var P = I * I * Req, Ptot = Et * I;
    return { E_cell: s.E, r_cell: s.r, cells: s.cells, n: n, E_t: Et, r_t: rt, net: s.net, R_eq: Req, I: I, V: Vn,
      V_terminal: Et - I * rt, I1: br[0], I2: br[1], I3: br[2], P: P, P_total: Ptot, P_lost: I * I * rt, eta: Ptot > 0 ? P / Ptot : 0 };
  }

  /* --- mode 4: galvanometer conversion --- s: { Ig, Rg, conv:'ammeter'|'voltmeter'|'bare', range, test, Rc, shuntWarm, forgotRg } */
  function solveGalv(s) {
    var Ig = s.Ig, Rg = s.Rg, o = { Ig: Ig, Rg: Rg, conv: s.conv, range: s.range, test: s.test };
    if (s.conv === "ammeter") {
      var Rs = Ig * Rg / (s.range - Ig);
      var RsEff = Rs * (1 + (s.shuntWarm || 0)) + (s.Rc || 0);
      var icoil = s.test * RsEff / (RsEff + Rg);
      o.R_s = Rs; o.R_s_eff = RsEff; o.R_m = null; o.R_meter = par(Rs, Rg);
      o.I_coil = icoil; o.I_shunt = s.test - icoil; o.fraction_coil = Ig / s.range;
    } else if (s.conv === "voltmeter") {
      var Rm = s.range / Ig - Rg;
      var RmUsed = s.forgotRg ? s.range / Ig : Rm;            // error: R_total used as the multiplier
      o.R_m = Rm; o.R_m_used = RmUsed; o.R_s = null; o.R_meter = Rg + RmUsed; o.R_total = s.range / Ig;
      o.I_coil = s.test / (Rg + RmUsed); o.I_shunt = 0; o.V_coil = o.I_coil * Rg; o.V_mult = o.I_coil * RmUsed;
    } else {
      o.R_meter = Rg; o.I_coil = s.test; o.I_shunt = 0;
    }
    o.deflection = o.I_coil / Ig;                               // fraction of full scale (needle angle is proportional)
    o.indicated = o.deflection * (s.conv === "bare" ? Ig : s.range);
    o.overload = o.deflection > 1.0001;
    return o;
  }

  /* --- mode 5a: metre bridge (full nodal solution, C = 0 V) ---
     s: { Eb, rb, Rx (left gap), Ru (right gap, the unknown), Rwire, RG, l (cm), eL, eR (end corrections, cm), key } */
  function solve3(M, b) {
    var A = [M[0].slice(), M[1].slice(), M[2].slice()], x = b.slice(), i, j, k;
    for (i = 0; i < 3; i++) {
      var p = i; for (k = i + 1; k < 3; k++) if (Math.abs(A[k][i]) > Math.abs(A[p][i])) p = k;
      var t = A[i]; A[i] = A[p]; A[p] = t; var tb = x[i]; x[i] = x[p]; x[p] = tb;
      for (k = i + 1; k < 3; k++) { var f = A[k][i] / A[i][i]; for (j = i; j < 3; j++) A[k][j] -= f * A[i][j]; x[k] -= f * x[i]; }
    }
    var y = [0, 0, 0];
    for (i = 2; i >= 0; i--) { var sum = x[i]; for (j = i + 1; j < 3; j++) sum -= A[i][j] * y[j]; y[i] = sum / A[i][i]; }
    return y;
  }
  function bridgeBalance(Rx, Ru, eL, eR) { return (Rx * (100 + (eR || 0)) - Ru * (eL || 0)) / (Rx + Ru); }
  function solveBridge(s) {
    var l = Math.max(0, Math.min(100, s.l)), eL = s.eL || 0, eR = s.eR || 0;
    var Raj = s.Rwire * (l + eL) / 100 + 1e-6, Rjc = s.Rwire * (100 - l + eR) / 100 + 1e-6;
    var gAB = 1 / s.Rx, gBC = 1 / s.Ru, gAJ = 1 / Raj, gJC = 1 / Rjc, gBJ = 1 / s.RG, gD = s.key ? 1 / s.rb : 0, iD = s.key ? s.Eb / s.rb : 0;
    // unknowns VA, VB, VJ
    var M = [[gD + gAB + gAJ, -gAB, -gAJ], [-gAB, gAB + gBC + gBJ, -gBJ], [-gAJ, -gBJ, gAJ + gJC + gBJ]];
    var v = solve3(M, [iD, 0, 0]);
    var IG = (v[1] - v[2]) / s.RG;
    var lb = bridgeBalance(s.Rx, s.Ru, eL, eR);
    return { Rx: s.Rx, Ru: s.Ru, l: l, I_G: IG, l_balance: lb, deduced_R: l > 0 ? s.Rx * (100 - l) / l : null,
      deduced_at_balance: s.Rx * (100 - lb) / lb, V_A: v[0], key: !!s.key };
  }

  /* --- mode 5b: potentiometer --- s: { E0, r0, Rser, Rwire, E, r, Rshunt, k2 (shunt key), RG, l, kCal, key } */
  function potK(E0, r0, Rser, Rwire) { return E0 * Rwire / (Rwire + Rser + r0) / 100; }
  function solvePot(s) {
    var k = s.key ? potK(s.E0, s.r0, s.Rser, s.Rwire) : 0;
    var l = Math.max(0, Math.min(100, s.l));
    var Ep = s.k2 ? s.E * s.Rshunt / (s.Rshunt + s.r) : s.E;          // cell shunted by R: Thevenin EMF
    var rp = s.k2 ? par(s.r, s.Rshunt) : s.r;
    var Raj = s.Rwire * l / 100, Rth = par(Raj, s.Rwire * (100 - l) / 100 + s.Rser + s.r0);
    var IG = (k * l - Ep) / (Rth + rp + s.RG);
    var kCal = s.kCal != null ? s.kCal : k;
    var lb = k > 0 ? Ep / k : null;
    return { k: k, k_cal: kCal, V_wire: k * 100, l: l, E_test: s.E, r_test: s.r, k2: !!s.k2, I_G: IG,
      l_balance: lb, deduced: kCal * (lb || 0), deduced_at_l: kCal * l, V_AJ: k * l, key: !!s.key, E_effective: Ep };
  }

  var model = { MATERIALS: MATERIALS, DIAMETERS: DIAMETERS, LAMP: LAMP, areaOf: areaOf, wireR: wireR, lampR: lampR, par: par,
    solveOhms: solveOhms, solveIR: solveIR, solveNetwork: solveNetwork, solveGalv: solveGalv, solveBridge: solveBridge,
    bridgeBalance: bridgeBalance, solvePot: solvePot, potK: potK, round2: r2, round1: r1, sf3: sf3 };

  /* ===================================================================
     2. GEOMETRY + MATERIAL HELPERS
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
    t.wrapS = t.wrapT = THREE.RepeatWrapping; if (rx) t.repeat.set(rx, ry || rx);
    t.anisotropy = 4; return t;
  }
  function std(color, rough, extra) {
    var m = new THREE.MeshStandardMaterial({ color: color, roughness: rough == null ? 0.5 : rough, metalness: 0.0 });
    if (extra) for (var k in extra) m[k] = extra[k];
    return m;
  }
  function tagPart(obj, key) {
    if (!obj) return obj;
    obj.userData = obj.userData || {}; obj.userData.partId = key;
    obj.traverse(function (c) { c.userData = c.userData || {}; if (!c.userData.partId || c.userData.partId === "bench") c.userData.partId = key; });
    return obj;
  }
  function rr(w, h, r) {
    var s = new THREE.Shape(), x = -w / 2, y = -h / 2;
    s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
    return s;
  }
  function rrPath(w, h, r) { var p = new THREE.Path(), s = rr(w, h, r); p.curves = s.curves; p.currentPoint = s.currentPoint; return p; }
  /* rounded slab lying on y = 0 (top at y = thick + 2 bevel); w along x, d along z */
  function slab(w, d, thick, r, bevel, shape) {
    bevel = bevel == null ? 0.01 : bevel;
    var g = new THREE.ExtrudeGeometry(shape || rr(w, d, Math.min(r, w / 2 - 0.001, d / 2 - 0.001)), { depth: thick, bevelEnabled: bevel > 0, bevelSize: bevel, bevelThickness: bevel, bevelSegments: 2, curveSegments: 6 });
    g.rotateX(-Math.PI / 2); g.translate(0, bevel, 0);
    return g;
  }
  function uvPlanar(geo, sx, sy) {
    var p = geo.attributes.position, uv = new Float32Array(p.count * 2);
    for (var i = 0; i < p.count; i++) { uv[i * 2] = p.getX(i) * sx + 0.5; uv[i * 2 + 1] = -p.getZ(i) * sy + 0.5; }
    geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
    return geo;
  }
  function lathe(pts, segs, mat) {
    return new THREE.Mesh(new THREE.LatheGeometry(pts.map(function (p) { return new THREE.Vector2(p[0], p[1]); }), segs || 16), mat);
  }
  function tubeMesh(pts, r, segs, radSegs, mat, closed) {
    var curve = new THREE.CatmullRomCurve3(pts.map(function (a) { return Array.isArray(a) ? new V3(a[0], a[1], a[2]) : a; }), !!closed);
    var m = new THREE.Mesh(new THREE.TubeGeometry(curve, segs || 32, r, radSegs || 6, !!closed), mat);
    m.userData.curve = curve; return m;
  }
  /* flat strap (rectangular-ish cross-section) swept along a curve: copper shunts, spring fingers */
  function strap(pts, w, t, mat, segs) {
    var curve = new THREE.CatmullRomCurve3(pts.map(function (a) { return new V3(a[0], a[1], a[2]); }));
    var N = segs || 24, cols = 5, pos = [], idx = [], fr = curve.computeFrenetFrames(N, false), i, j;
    var sec = [[-w / 2, -t / 2], [w / 2, -t / 2], [w / 2, t / 2], [-w / 2, t / 2], [-w / 2, -t / 2]];
    var up = new V3(0, 1, 0);
    for (i = 0; i <= N; i++) {
      var p = curve.getPointAt(i / N), T = curve.getTangentAt(i / N);
      var S = new V3().crossVectors(T, up); if (S.lengthSq() < 1e-6) S.set(1, 0, 0); S.normalize();
      var U = new V3().crossVectors(S, T).normalize();
      for (j = 0; j < cols; j++) pos.push(p.x + S.x * sec[j][0] + U.x * sec[j][1], p.y + S.y * sec[j][0] + U.y * sec[j][1], p.z + S.z * sec[j][0] + U.z * sec[j][1]);
    }
    for (i = 0; i < N; i++) for (j = 0; j < cols - 1; j++) { var a = i * cols + j, b = a + 1, c = a + cols, d = c + 1; idx.push(a, c, b, b, c, d); }
    var geo = new THREE.BufferGeometry(); geo.setIndex(idx); geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); geo.computeVertexNormals();
    void fr; var sm = new THREE.Mesh(geo, mat); sm.userData.curve = curve; return sm;
  }
  function helixPts(radius, len, turns, perTurn) {
    var pts = [], n = Math.round(turns * perTurn);
    for (var i = 0; i <= n; i++) { var u = i / n, a = u * turns * TAU; pts.push(new V3(-len / 2 + u * len, Math.sin(a) * radius, Math.cos(a) * radius)); }
    return pts;
  }

  /* ---------------- procedural textures (seeded, offline) ---------------- */
  var TEX = {};
  function woodTex(seed, base) {
    var key = "wood" + seed + (base || ""); if (TEX[key]) return TEX[key];
    var c = canvas(256, 256), x = c.getContext("2d"), r = rng(seed), i;
    x.fillStyle = base || "#b98552"; x.fillRect(0, 0, 256, 256);
    for (i = 0; i < 90; i++) {
      var y0 = r() * 256, a = 0.05 + r() * 0.13;
      x.strokeStyle = "rgba(" + (r() < 0.5 ? "80,45,18" : "236,198,146") + "," + a + ")";
      x.lineWidth = 0.5 + r() * 2.2; x.beginPath(); x.moveTo(0, y0);
      for (var u = 0; u <= 256; u += 32) x.lineTo(u, y0 + Math.sin(u * 0.03 + i) * 3 + (r() - 0.5) * 1.5);
      x.stroke();
    }
    return (TEX[key] = ctex(c, 1, 1));
  }
  function brushedBump(seed) {
    var key = "brush" + seed; if (TEX[key]) return TEX[key];
    var c = canvas(128, 128), x = c.getContext("2d"), r = rng(seed), i;
    x.fillStyle = "#808080"; x.fillRect(0, 0, 128, 128);
    for (i = 0; i < 260; i++) { x.fillStyle = "rgba(" + (r() < 0.5 ? "255,255,255" : "0,0,0") + "," + (0.05 + r() * 0.12) + ")"; x.fillRect(0, r() * 128, 128, 0.6 + r()); }
    return (TEX[key] = ctex(c, 1, 1, true));
  }
  function knurlBump() {
    if (TEX.knurl) return TEX.knurl;
    var c = canvas(64, 16), x = c.getContext("2d"); x.fillStyle = "#777"; x.fillRect(0, 0, 64, 16);
    for (var i = 0; i < 64; i += 4) { x.fillStyle = "#fff"; x.fillRect(i, 0, 2, 16); }
    return (TEX.knurl = ctex(c, 6, 1, true));
  }
  function windingTex(base, line) {
    var key = "wind" + base + line; if (TEX[key]) return TEX[key];
    var c = canvas(32, 256), x = c.getContext("2d"); x.fillStyle = base; x.fillRect(0, 0, 32, 256);
    for (var i = 0; i < 256; i += 4) { x.fillStyle = line; x.fillRect(0, i, 32, 1.4); x.fillStyle = "rgba(255,255,255,.18)"; x.fillRect(0, i + 2, 32, 0.8); }
    return (TEX[key] = ctex(c, 1, 1));
  }
  function plateTex(seed, base) {
    var key = "plate" + seed; if (TEX[key]) return TEX[key];
    var c = canvas(128, 128), x = c.getContext("2d"), r = rng(seed); x.fillStyle = base; x.fillRect(0, 0, 128, 128);
    x.strokeStyle = "rgba(40,40,40,.55)"; x.lineWidth = 2;
    for (var i = 0; i <= 128; i += 16) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, 128); x.stroke(); x.beginPath(); x.moveTo(0, i); x.lineTo(128, i); x.stroke(); }
    for (i = 0; i < 400; i++) { x.fillStyle = "rgba(0,0,0," + r() * 0.15 + ")"; x.fillRect(r() * 128, r() * 128, 2, 2); }
    return (TEX[key] = ctex(c, 1, 1));
  }
  /* metre scale 0-100 cm, mm ticks, readable at phone size */
  function metreScaleTex() {
    if (TEX.metre) return TEX.metre;
    var W = 2048, H = 96, c = canvas(W, H), x = c.getContext("2d");
    x.fillStyle = "#f3ead2"; x.fillRect(0, 0, W, H);
    x.fillStyle = "#1c242c"; x.strokeStyle = "#1c242c"; x.textAlign = "center"; x.textBaseline = "alphabetic";
    var m0 = 24, span = W - 48;
    for (var mm = 0; mm <= 1000; mm++) {
      var px = m0 + span * mm / 1000, cmT = mm % 10 === 0, half = mm % 5 === 0;
      x.lineWidth = cmT ? 2.2 : 1; x.beginPath(); x.moveTo(px, 0); x.lineTo(px, cmT ? 34 : half ? 22 : 13); x.stroke();
      if (cmT && (mm / 10) % 10 === 0) { x.font = "bold 36px sans-serif"; x.fillText(String(mm / 10), px, 82); }
      else if (cmT && (mm / 10) % 5 === 0) { x.font = "24px sans-serif"; x.fillText(String(mm / 10), px, 70); }
    }
    x.font = "bold 22px sans-serif"; x.textAlign = "left"; x.fillText("cm", m0 + 6, 92);
    var t = ctex(c, 1, 1); t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping; return (TEX.metre = t);
  }
  function textPlate(lines, w, h, bg, fg) {
    var c = canvas(w, h), x = c.getContext("2d"); x.fillStyle = bg; x.fillRect(0, 0, w, h);
    x.strokeStyle = fg; x.globalAlpha = 0.5; x.lineWidth = 3; x.strokeRect(5, 5, w - 10, h - 10); x.globalAlpha = 1;
    x.fillStyle = fg; x.textAlign = "center"; x.textBaseline = "middle";
    lines.forEach(function (L, i) { x.font = (L.b ? "bold " : "") + L.s + "px sans-serif"; x.fillText(L.t, w / 2, h * (i + 1) / (lines.length + 1)); });
    var t = ctex(c, 1, 1); t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping; return t;
  }
  function fmtNum(v) { var s = (Math.abs(v) >= 100 ? v.toFixed(0) : Math.abs(v) >= 10 ? v.toFixed(1) : v.toFixed(2)); return s.replace(/\.?0+$/, "") || "0"; }

  /* short label sprite (kept above static housings, never over moving parts) */
  function labelSprite(text, scale) {
    var c = canvas(256, 64), x = c.getContext("2d");
    x.font = "bold 34px sans-serif"; var w = Math.min(248, x.measureText(text).width + 28);
    x.fillStyle = "rgba(14,22,32,.78)"; x.beginPath();
    var X = 128 - w / 2; x.moveTo(X + 14, 6); x.arcTo(X + w, 6, X + w, 58, 14); x.arcTo(X + w, 58, X, 58, 14); x.arcTo(X, 58, X, 6, 14); x.arcTo(X, 6, X + w, 6, 14); x.fill();
    x.fillStyle = "#f4f7fa"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText(text, 128, 33);
    var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: ctex(c, 1, 1), transparent: true, depthWrite: false }));
    var s = scale || 0.62; sp.scale.set(s, s / 4, 1); sp.userData.isLabel = true; sp.renderOrder = 5;
    return sp;
  }

  /* shared materials (created lazily so the file costs nothing until used) */
  var MAT = null;
  function mats() {
    if (MAT) return MAT;
    MAT = {
      wood: std(0xffffff, 0.72, { map: woodTex(11), bumpMap: woodTex(11, "#888"), bumpScale: 0.5 }),
      woodDark: std(0xffffff, 0.7, { map: woodTex(23, "#7a4526") }),
      brass: std(0xd9b25a, 0.34, { metalness: 0.75, bumpMap: brushedBump(3), bumpScale: 0.4 }),
      copper: std(0xc8743c, 0.32, { metalness: 0.75, bumpMap: brushedBump(5), bumpScale: 0.4 }),
      steel: std(0xc9d0d6, 0.3, { metalness: 0.7, bumpMap: brushedBump(4), bumpScale: 0.3 }),
      iron: std(0x3d434a, 0.55, { metalness: 0.5 }),
      ebonite: std(0x16181b, 0.38),
      redCap: std(0xc62828, 0.35, { bumpMap: knurlBump(), bumpScale: 0.6 }),
      blackCap: std(0x1d1f22, 0.35, { bumpMap: knurlBump(), bumpScale: 0.6 }),
      ceramic: std(0xf1eee4, 0.25),
      glass: new THREE.MeshPhysicalMaterial({ color: 0xdbeef2, roughness: 0.05, metalness: 0, transparent: true, opacity: 0.22, depthWrite: false, side: THREE.DoubleSide }),
      leadRed: std(0xb3261e, 0.45), leadBlack: std(0x1f2226, 0.45), leadYellow: std(0xd9a21b, 0.45), leadBlue: std(0x1e5aa8, 0.45), leadGreen: std(0x2e7d32, 0.45),
      bead: new THREE.MeshBasicMaterial({ color: 0xffd23f })
    };
    return MAT;
  }

  /* ===================================================================
     3. APPARATUS BUILDERS (each returns a Group; tips = lead attachment points in the group's space)
     =================================================================== */
  /* brass binding post with a knurled red / black insulated head */
  function post(color) {
    var M = mats(), g = new THREE.Group();
    g.add(lathe([[0, 0], [0.06, 0], [0.06, 0.012], [0.045, 0.014], [0, 0.014]], 12, M.brass));
    var nut = new THREE.Mesh(new THREE.CylinderGeometry(0.046, 0.046, 0.035, 6), M.brass); nut.position.y = 0.032; g.add(nut);
    var stem = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.07, 8), M.brass); stem.position.y = 0.085; g.add(stem);
    g.add(lathe([[0, 0.112], [0.042, 0.112], [0.046, 0.12], [0.046, 0.158], [0.036, 0.168], [0, 0.17]], 14, color === "red" ? M.redCap : color === "black" ? M.blackCap : M.brass));
    g.userData.tip = new V3(0, 0.1, 0);
    return g;
  }
  function addPost(parent, color, x, y, z) { var p = post(color); p.position.set(x, y, z); parent.add(p); return p; }

  /* analogue meter: wedge case, sloping dial (CanvasTexture scale, mirror strip), needle on a pivot, glass, posts.
     o: { unit:'A'|'V'|'mA'|'G', range, centreZero, width } */
  function drawDial(cv, unit, range, centreZero, sub) {
    var x = cv.getContext("2d"), W = cv.width, H = cv.height;
    x.fillStyle = "#f6f1e3"; x.fillRect(0, 0, W, H);
    var cx = W / 2, cy = H * 0.857, R = W * 0.418, A = 48 * Math.PI / 180;
    function at(a, rad) { return [cx + Math.sin(a) * rad, cy - Math.cos(a) * rad]; }
    // mirror strip (anti-parallax)
    x.lineWidth = 9; x.strokeStyle = "#b9c3cc"; x.beginPath(); x.arc(cx, cy, R * 0.86, -Math.PI / 2 - A, -Math.PI / 2 + A); x.stroke();
    x.lineWidth = 2; x.strokeStyle = "#1b232b"; x.beginPath(); x.arc(cx, cy, R, -Math.PI / 2 - A, -Math.PI / 2 + A); x.stroke();
    var m = range / Math.pow(10, Math.floor(Math.log10(range) + 1e-9));
    var nMaj = Math.abs(m - 1.5) < 0.01 || Math.abs(m - 3) < 0.01 ? 3 : Math.abs(m - 2) < 0.01 ? 4 : 5;
    var lo = centreZero ? -range : 0, majors = centreZero ? nMaj * 2 : nMaj, minorsPer = nMaj === 4 ? 5 : 10;
    x.fillStyle = "#1b232b"; x.textAlign = "center"; x.textBaseline = "middle"; x.font = "bold " + Math.round(W * 0.052) + "px sans-serif";
    for (var i = 0; i <= majors * minorsPer; i++) {
      var f = i / (majors * minorsPer), a = -A + 2 * A * f, maj = i % minorsPer === 0, half = i % (minorsPer / 2) === 0;
      var p0 = at(a, R), p1 = at(a, R + (maj ? W * 0.05 : half ? W * 0.034 : W * 0.022));
      x.lineWidth = maj ? 3 : 1.4; x.beginPath(); x.moveTo(p0[0], p0[1]); x.lineTo(p1[0], p1[1]); x.stroke();
      if (maj) { var v = lo + (range - lo) * f, pt = at(a, R + W * 0.09); x.fillText(fmtNum(Math.abs(v) < 1e-9 ? 0 : v), pt[0], pt[1]); }
    }
    x.font = "bold " + Math.round(W * 0.12) + "px serif"; x.fillStyle = unit === "G" ? "#8a1c1c" : "#1d3f6e";
    x.fillText(unit, cx, cy - R * 0.45);
    x.font = Math.round(W * 0.034) + "px sans-serif"; x.fillStyle = "#38434e";
    x.fillText(sub || (centreZero ? "centre zero" : "0 – " + fmtNum(range) + " " + unit), cx, cy - R * 0.2);
    // moving-coil symbol (horseshoe) bottom-left, class mark bottom-right
    x.strokeStyle = "#38434e"; x.lineWidth = 2; x.beginPath(); x.arc(W * 0.1, H * 0.86, W * 0.022, Math.PI, 0); x.moveTo(W * 0.078, H * 0.86); x.lineTo(W * 0.078, H * 0.9); x.moveTo(W * 0.122, H * 0.86); x.lineTo(W * 0.122, H * 0.9); x.stroke();
    x.font = Math.round(W * 0.03) + "px sans-serif"; x.fillText("cl 2.5", W * 0.88, H * 0.88);
  }
  function meter(o) {
    o = o || {};
    var M = mats(), g = new THREE.Group(), Wd = 1.0, dz = 0.2;
    var caseMat = std(o.caseColor || 0x232a31, 0.45, { metalness: 0.15 });
    // wedge profile (shape x = -z, shape y = y), extruded along x
    var prof = [[-0.36, 0], [0.36, 0], [0.36, 0.14], [0.2, 0.16], [-0.2, 0.74], [-0.36, 0.74]];
    var sh = new THREE.Shape(); sh.moveTo(-prof[0][0], prof[0][1]); for (var i = 1; i < prof.length; i++) sh.lineTo(-prof[i][0], prof[i][1]);
    var cg = new THREE.ExtrudeGeometry(sh, { depth: Wd, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02, bevelSegments: 2 });
    cg.rotateY(Math.PI / 2); cg.translate(-Wd / 2, 0.02, 0);
    g.add(new THREE.Mesh(cg, caseMat));
    // dial frame on the sloping face
    var th = Math.atan2(0.40, 0.58), frame = new THREE.Group();
    frame.position.set(0, 0.45 + 0.02 + Math.sin(th) * 0.026, 0 + Math.cos(th) * 0.026); frame.rotation.x = -th;
    g.add(frame);
    var cv = canvas(512, 336); drawDial(cv, o.unit || "A", o.range || 1, !!o.centreZero, o.sub);
    var dialTex = ctex(cv, 1, 1); dialTex.wrapS = dialTex.wrapT = THREE.ClampToEdgeWrapping;
    var face = new THREE.Mesh(new THREE.PlaneGeometry(0.86, 0.56), std(0xffffff, 0.6, { map: dialTex })); frame.add(face);
    var bez = new THREE.Shape(); var outer = rr(0.94, 0.64, 0.05); bez.curves = outer.curves; bez.holes.push(rrPath(0.86, 0.56, 0.03));
    var bg = new THREE.ExtrudeGeometry(bez, { depth: 0.035, bevelEnabled: false, curveSegments: 4 }); var bm = new THREE.Mesh(bg, std(0x111417, 0.4)); frame.add(bm);
    var gl = new THREE.Mesh(new THREE.PlaneGeometry(0.86, 0.56), M.glass); gl.position.z = 0.03; frame.add(gl);
    // needle on its pivot
    var pivot = new THREE.Group(); pivot.position.set(0, -0.2, 0.012); frame.add(pivot);
    var ns = new THREE.Shape(); ns.moveTo(-0.008, -0.02); ns.lineTo(0.008, -0.02); ns.lineTo(0.0018, 0.4); ns.lineTo(-0.0018, 0.4); ns.closePath();
    var needleMat = std(o.needleColor || 0x111111, 0.4, { emissive: new THREE.Color(o.needleColor || 0x000000), emissiveIntensity: o.needleColor ? 0.4 : 0 });
    var needle = new THREE.Mesh(new THREE.ExtrudeGeometry(ns, { depth: 0.004, bevelEnabled: false }), needleMat); pivot.add(needle);
    var hub = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.016, 16), std(0x2b2f33, 0.4, { metalness: 0.4 })); hub.rotation.x = Math.PI / 2; hub.position.z = 0.006; pivot.add(hub);
    var cw = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.01, 12), std(0x8c939a, 0.4, { metalness: 0.5 })); cw.rotation.x = Math.PI / 2; cw.position.set(0, -0.05, 0.004); pivot.add(cw);
    var zs = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.02, 14), std(0x0d0f11, 0.5)); zs.rotation.x = Math.PI / 2; zs.position.set(0, -0.3, 0.02); frame.add(zs);
    // posts on the front ledge
    var pNeg = addPost(g, "black", -0.28, 0.16, dz + 0.07), pPos = addPost(g, "red", 0.28, 0.16, dz + 0.07);
    var A = 48 * Math.PI / 180, st = { frac: 0, vel: 0, target: 0, range: o.range || 1, unit: o.unit || "A", cz: !!o.centreZero };
    function angle(f) { return st.cz ? f * A : -A + 2 * A * f; }
    g.userData = {
      kind: "meter", frame: frame, pivot: pivot, needle: needle, face: face, tips: { neg: pNeg, pos: pPos },
      setRange: function (range, unit, sub) { if (range === st.range && (unit || st.unit) === st.unit) return; st.range = range; if (unit) st.unit = unit; drawDial(cv, st.unit, range, st.cz, sub); dialTex.needsUpdate = true; },
      setValue: function (v) { st.target = Math.max(st.cz ? -1.06 : -0.03, Math.min(1.06, v / st.range)); },
      setFraction: function (f) { st.target = Math.max(-1, Math.min(1, f)); },
      snap: function () { st.frac = st.target; st.vel = 0; pivot.rotation.z = -angle(st.frac); },
      step: function (dt) {
        dt = Math.min(dt, 0.05); var w = 11, z = 0.5;
        st.vel += (-w * w * (st.frac - st.target) - 2 * z * w * st.vel) * dt; st.frac += st.vel * dt;
        pivot.rotation.z = -angle(st.frac);
      },
      state: st
    };
    g.userData.snap();
    return g;
  }

  /* school lead-acid accumulator: glass tank(s) showing brown PbO2 (+) and grey Pb (-) plates in acid; n cells in series */
  function glassAccumulator(n) {
    n = n || 1; var M = mats(), g = new THREE.Group(), W = 0.44, D = 0.36, H = 0.66, gap = 0.08;
    var posPlate = std(0xffffff, 0.8, { map: plateTex(7, "#6b3a22") }), negPlate = std(0xffffff, 0.7, { map: plateTex(9, "#7d858c") });
    var acid = std(0xbfe3e8, 0.1, { transparent: true, opacity: 0.32, depthWrite: false, emissive: new THREE.Color(0xff5a1f), emissiveIntensity: 0 });
    var x0 = -((n - 1) * (W + gap)) / 2, tips = {}, prevPos = null;
    for (var c = 0; c < n; c++) {
      var cx = x0 + c * (W + gap), cg = new THREE.Group(); cg.position.x = cx; g.add(cg);
      var tank = new THREE.Mesh(slab(W, D, H, 0.03, 0.006), M.glass); cg.add(tank);
      var liq = new THREE.Mesh(slab(W - 0.03, D - 0.03, H * 0.78, 0.02, 0.0), acid); liq.position.y = 0.01; cg.add(liq);
      for (var k = 0; k < 5; k++) {
        var pp = new THREE.Mesh(new THREE.BoxGeometry(W - 0.08, H * 0.7, 0.016), k % 2 ? posPlate : negPlate);
        pp.position.set(0, H * 0.4, -D / 2 + 0.06 + k * (D - 0.12) / 4); cg.add(pp);
      }
      var lid = new THREE.Mesh(slab(W + 0.03, D + 0.03, 0.045, 0.03, 0.008), M.ebonite); lid.position.y = H + 0.012; cg.add(lid);
      var vent = lathe([[0, 0], [0.04, 0], [0.042, 0.03], [0.03, 0.05], [0.012, 0.056], [0, 0.058]], 12, std(0xd7a21b, 0.5)); vent.position.set(0, H + 0.07, 0.05); cg.add(vent);
      var pNeg = addPost(cg, "black", -W / 2 + 0.09, H + 0.07, -0.04), pPos = addPost(cg, "red", W / 2 - 0.09, H + 0.07, -0.04);
      if (c === 0) tips.neg = pNeg;
      if (prevPos) { var strapM = strap([[prevPos.x + 0.0, H + 0.13, -0.04], [(prevPos.x + cx - W / 2 + 0.09) / 2, H + 0.2, -0.04], [cx - W / 2 + 0.09, H + 0.13, -0.04]], 0.05, 0.012, M.leadBlack, 10); g.add(strapM); }
      prevPos = new V3(cx + W / 2 - 0.09, 0, 0); tips.pos = pPos;
    }
    g.userData = { kind: "cell", tips: tips, heatMat: acid, rGlowMat: acid, setHeat: function (h) { acid.emissiveIntensity = Math.min(0.8, h); } };
    return g;
  }

  /* moulded block battery (keke / car 12 V, or a small "5 V" pack): ribbed case, lid, vent caps, tapered lead posts, label */
  function blockBattery(o) {
    o = o || {}; var M = mats(), g = new THREE.Group();
    var W = o.w || 1.3, D = o.d || 0.62, H = o.h || 0.78, caps = o.caps || 6;
    var caseMat = std(o.color || 0x22262b, 0.55);
    g.add(new THREE.Mesh(slab(W, D, H, 0.05, 0.015), caseMat));
    for (var i = 0; i < 7; i++) { var rib = new THREE.Mesh(slab(0.035, 0.02, H * 0.8, 0.008, 0.004), caseMat); rib.position.set(-W / 2 + 0.1 + i * (W - 0.2) / 6, H * 0.08, -D / 2 - 0.012); g.add(rib); }
    var lid = new THREE.Mesh(slab(W + 0.02, D + 0.02, 0.05, 0.05, 0.012), std(0x2f353b, 0.5)); lid.position.y = H; g.add(lid);
    var band = new THREE.Mesh(slab(W * 0.66, D * 0.36, 0.03, 0.03, 0.006), std(0x3a4148, 0.5)); band.position.set(0, H + 0.07, 0.04); g.add(band);
    for (var c = 0; c < caps; c++) {
      var cap = lathe([[0, 0], [0.04, 0], [0.042, 0.02], [0.036, 0.034], [0, 0.036]], 10, std(0x5d656e, 0.5));
      cap.position.set(-W * 0.3 + (caps > 1 ? c * (W * 0.6) / (caps - 1) : W * 0.3), H + 0.105, 0.04); g.add(cap);
    }
    var leadPost = std(0x9aa1a8, 0.45, { metalness: 0.5 }), tips = {};
    [["neg", -1, M.blackCap], ["pos", 1, M.redCap]].forEach(function (t) {
      var pg = new THREE.Group(); pg.position.set(t[1] * (W / 2 - 0.13), H + 0.07, -D / 2 + 0.15);
      pg.add(lathe([[0, 0], [0.075, 0], [0.075, 0.025], [0, 0.025]], 14, t[2]));
      pg.add(lathe([[0, 0.025], [0.05, 0.025], [0.042, 0.13], [0, 0.13]], 14, leadPost));
      var cl = new THREE.Mesh(new THREE.TorusGeometry(0.052, 0.014, 6, 16), M.brass); cl.rotation.x = Math.PI / 2; cl.position.y = 0.09; pg.add(cl);
      pg.userData.tip = new V3(0, 0.1, 0); g.add(pg); tips[t[0]] = pg;
    });
    var lab = new THREE.Mesh(new THREE.PlaneGeometry(W * 0.74, H * 0.5), std(0xffffff, 0.5, { map: textPlate([{ t: o.label || "12 V", s: 64, b: true }, { t: o.sub || "lead-acid", s: 30 }, { t: "−          +", s: 40, b: true }], 512, 256, "#c9d4dc", "#13202c") }));
    lab.position.set(0, H * 0.5, D / 2 + 0.017); g.add(lab);
    var heat = std(0xff5a1f, 0.5, { emissive: new THREE.Color(0xff3d00), emissiveIntensity: 0, transparent: true, opacity: 0 });
    var glow = new THREE.Mesh(slab(W + 0.04, D + 0.04, 0.03, 0.05, 0), heat); glow.position.y = H * 0.55; g.add(glow);
    g.userData = { kind: "cell", tips: tips, heatMat: heat, rGlowMat: heat, setHeat: function (h) { heat.opacity = Math.min(0.85, h); heat.emissiveIntensity = Math.min(1, h * 1.4); } };
    return g;
  }

  /* sliding rheostat: cast end stands, glazed ceramic former, helical bare-wire coil, brass slide bar, slider + spring finger */
  function rheostat(o) {
    o = o || {}; var M = mats(), g = new THREE.Group(), L = o.len || 2.6, Lc = L - 0.4, ay = 0.26, rc = 0.13;
    [-1, 1].forEach(function (s) {
      var p = new THREE.Shape(); p.moveTo(-0.2, 0); p.lineTo(0.2, 0); p.lineTo(0.2, 0.05); p.lineTo(0.07, 0.08); p.lineTo(0.07, 0.5); p.quadraticCurveTo(0.07, 0.6, 0, 0.6); p.quadraticCurveTo(-0.07, 0.6, -0.07, 0.5); p.lineTo(-0.07, 0.08); p.lineTo(-0.2, 0.05); p.closePath();
      var sg = new THREE.ExtrudeGeometry(p, { depth: 0.06, bevelEnabled: true, bevelSize: 0.006, bevelThickness: 0.006, bevelSegments: 1 }); sg.rotateY(Math.PI / 2); sg.translate(s * (L / 2 - 0.08) - 0.03, 0, 0);
      g.add(new THREE.Mesh(sg, M.iron));
    });
    var former = new THREE.Mesh(new THREE.CylinderGeometry(rc, rc, Lc + 0.1, 20, 1), M.ceramic); former.rotation.z = Math.PI / 2; former.position.y = ay; g.add(former);
    var coilMat = MATERIALS.constantan.color, coil = tubeMesh(helixPts(rc + 0.008, Lc, 58, 10), 0.008, 58 * 10, 4, std(coilMat, 0.35, { metalness: 0.7 }));
    coil.position.y = ay; g.add(coil);
    var barY = ay + rc + 0.12, bar = new THREE.Mesh(new THREE.BoxGeometry(L - 0.12, 0.045, 0.045), M.brass); bar.position.y = barY; g.add(bar);
    var slider = new THREE.Group(); slider.position.y = barY; g.add(slider);
    slider.add(new THREE.Mesh(slab(0.14, 0.1, 0.07, 0.02, 0.008).translate(0, -0.04, 0), M.brass));
    var knob = lathe([[0, 0], [0.03, 0], [0.035, 0.02], [0.045, 0.06], [0.04, 0.09], [0, 0.1]], 14, M.ebonite); knob.position.y = 0.04; slider.add(knob);
    var finger = strap([[0, -0.03, 0.03], [0, -0.07, 0.07], [0, -0.11, 0.04], [0, -0.12 + 0.005, 0.0]], 0.05, 0.008, std(0xc9a04a, 0.3, { metalness: 0.7 }), 10); slider.add(finger);
    var tA = addPost(g, "black", -L / 2 + 0.13, 0.05, 0.13), tB = addPost(g, "black", L / 2 - 0.13, 0.05, 0.13);
    var tC = addPost(g, "red", L / 2 - 0.08, barY + 0.025, 0); tC.scale.setScalar(0.8);
    var st = { f: 0.5, goal: 0.5 };
    g.userData = { kind: "rheostat", tips: { A: tA, B: tB, C: tC }, slider: slider, coil: coil,
      setFraction: function (f) { st.goal = Math.max(0, Math.min(1, f)); },
      snap: function () { st.f = st.goal; slider.position.x = -Lc / 2 + st.f * Lc; },
      step: function (dt) { st.f += (st.goal - st.f) * Math.min(1, dt * 6); slider.position.x = -Lc / 2 + st.f * Lc; } };
    g.userData.snap();
    return g;
  }

  /* plug key: ebonite base, two brass blocks, tapered brass plug with an ebonite head that lifts out when open */
  function plugKey() {
    var M = mats(), g = new THREE.Group();
    g.add(new THREE.Mesh(slab(0.62, 0.34, 0.04, 0.04, 0.008), M.ebonite));
    [-1, 1].forEach(function (s) { var b = new THREE.Mesh(slab(0.2, 0.18, 0.11, 0.015, 0.01), M.brass); b.position.set(s * 0.13, 0.056, 0); g.add(b); });
    var plug = new THREE.Group(); g.add(plug);
    plug.add(lathe([[0, -0.11], [0.02, -0.11], [0.034, 0.0], [0.04, 0.005], [0, 0.005]], 14, M.brass));
    plug.add(lathe([[0, 0.005], [0.06, 0.005], [0.064, 0.03], [0.05, 0.05], [0.025, 0.055], [0.03, 0.1], [0.045, 0.13], [0.03, 0.16], [0, 0.165]], 16, M.ebonite));
    var tA = addPost(g, "black", -0.17, 0.18, 0), tB = addPost(g, "black", 0.17, 0.18, 0); tA.scale.setScalar(0.85); tB.scale.setScalar(0.85);
    var st = { open: 0, goal: 0 };
    function place() { plug.position.set(0.0 + st.open * 0.02, 0.19 + st.open * 0.26, st.open * 0.12); plug.rotation.z = st.open * 0.5; }
    g.userData = { kind: "key", tips: { A: tA, B: tB }, plug: plug,
      setOpen: function (open) { st.goal = open ? 1 : 0; }, snap: function () { st.open = st.goal; place(); },
      step: function (dt) { st.open += (st.goal - st.open) * Math.min(1, dt * 7); place(); } };
    g.userData.snap();
    return g;
  }

  /* crocodile clip (two toothed jaws + spring + coloured sleeve), jaws pointing -y */
  function crocClip(color) {
    var M = mats(), g = new THREE.Group();
    var jaw = new THREE.Shape(); jaw.moveTo(0, 0); jaw.lineTo(0.2, 0.0); for (var i = 0; i < 5; i++) { jaw.lineTo(0.2 - i * 0.03 - 0.015, -0.012); jaw.lineTo(0.2 - (i + 1) * 0.03, 0); } jaw.lineTo(0.03, 0.03); jaw.lineTo(0, 0.03); jaw.closePath();
    var jg = new THREE.ExtrudeGeometry(jaw, { depth: 0.04, bevelEnabled: false }); jg.translate(0, 0, -0.02);
    var j1 = new THREE.Mesh(jg, M.steel); j1.rotation.z = -Math.PI / 2 - 0.08; j1.position.set(-0.012, 0.22, 0); g.add(j1);
    var j2 = new THREE.Mesh(jg, M.steel); j2.rotation.z = -Math.PI / 2 + 0.08; j2.scale.y = -1; j2.position.set(0.012, 0.22, 0); g.add(j2);
    var sp = new THREE.Mesh(new THREE.TorusGeometry(0.025, 0.006, 6, 12), M.steel); sp.rotation.y = Math.PI / 2; sp.position.y = 0.2; g.add(sp);
    var sl = lathe([[0, 0.17], [0.03, 0.18], [0.035, 0.26], [0.02, 0.33], [0, 0.34]], 10, std(color === "red" ? 0xc62828 : 0x1d1f22, 0.5)); sl.scale.z = 0.7; g.add(sl);
    g.userData.tip = new V3(0, 0.33, 0);
    return g;
  }

  /* test-wire board: wooden strip with a 0-100 cm scale, wire stretched between brass end blocks, sliding crocodile clip */
  function wireBoard() {
    var M = mats(), g = new THREE.Group(), x0 = -WIRE_LEN / 2;
    g.add(new THREE.Mesh(uvPlanar(slab(WIRE_LEN + 0.7, 0.62, 0.06, 0.04, 0.01), 1 / 7.2, 1 / 7.2), M.wood));
    var sc = new THREE.Mesh(new THREE.PlaneGeometry(WIRE_LEN + 0.15, 0.2), std(0xffffff, 0.7, { map: metreScaleTex() })); sc.rotation.x = -Math.PI / 2; sc.position.set(0, 0.082, 0.17); g.add(sc);
    [-1, 1].forEach(function (s) { var b = new THREE.Mesh(slab(0.2, 0.3, 0.1, 0.02, 0.01), M.brass); b.position.set(s * (WIRE_LEN / 2 + 0.12), 0.08, -0.06); g.add(b); });
    var tEnd0 = addPost(g, "black", x0 - 0.17, 0.2, -0.06), tEnd1 = addPost(g, "black", -x0 + 0.17, 0.2, -0.06);
    var wire = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, WIRE_LEN + 0.16, 10, 1), std(MATERIALS.constantan.color, 0.32, { metalness: 0.75, emissive: new THREE.Color(0xff3300), emissiveIntensity: 0 }));
    wire.rotation.z = Math.PI / 2; wire.position.set(0, 0.2, -0.06); g.add(wire);
    var clipA = crocClip("black"); clipA.position.set(x0, 0.2 - 0.03, -0.06); g.add(clipA);
    var clipB = crocClip("red"); g.add(clipB);
    var st = { L: 40, Lgoal: 40 };
    function placeB() { clipB.position.set(x0 + st.L * CM, 0.17, -0.06); }
    g.userData = { kind: "wire", tips: { end0: tEnd0, end1: tEnd1, clipA: clipA, clipB: clipB }, wire: wire, clipA: clipA, clipB: clipB,
      setWire: function (mat, dmm) { var m = MATERIALS[mat] || MATERIALS.constantan; wire.material.color.setHex(m.color); var r = dmm <= 0.35 ? 0.011 : dmm <= 0.7 ? 0.018 : 0.03; wire.scale.set(r, 1, r); },
      setLength: function (L) { st.Lgoal = L; }, snap: function () { st.L = st.Lgoal; placeB(); },
      step: function (dt) { st.L += (st.Lgoal - st.L) * Math.min(1, dt * 6); placeB(); },
      setGlow: function (h) { wire.material.emissiveIntensity = Math.min(1, h); } };
    g.userData.setWire("constantan", 0.3); g.userData.snap();
    return g;
  }

  /* filament lamp on a batten holder: lathe glass bulb, coiled tungsten filament that glows with temperature */
  function filamentLamp() {
    var M = mats(), g = new THREE.Group();
    g.add(new THREE.Mesh(slab(0.62, 0.42, 0.05, 0.04, 0.01), M.woodDark));
    var holder = lathe([[0, 0.06], [0.13, 0.06], [0.13, 0.1], [0.08, 0.14], [0.07, 0.22], [0, 0.22]], 18, std(0x2a2420, 0.45)); g.add(holder);
    g.add(lathe([[0, 0.22], [0.052, 0.22], [0.052, 0.3], [0.04, 0.31], [0, 0.31]], 16, M.brass));
    var prof = [], i; for (i = 0; i <= 16; i++) { var a = -Math.PI / 2 + Math.PI * 1.0 * i / 16, R = 0.16; prof.push([Math.max(0.045, Math.cos(a) * R * (i < 5 ? 0.6 + i * 0.08 : 1)), 0.31 + 0.18 + Math.sin(a) * R * 1.1]); }
    prof[0] = [0.045, 0.31]; prof.push([0, 0.49 + 0.176]);
    g.add(lathe(prof, 22, new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.02, transparent: true, opacity: 0.25, depthWrite: false, side: THREE.DoubleSide })));
    var filMat = new THREE.MeshBasicMaterial({ color: 0x55504a });
    var fil = tubeMesh(helixPts(0.012, 0.13, 9, 8), 0.0035, 72, 4, filMat); fil.position.y = 0.5; g.add(fil);
    [-1, 1].forEach(function (s) { g.add(tubeMesh([[s * 0.025, 0.31, 0], [s * 0.05, 0.42, 0], [s * 0.065, 0.5, 0]], 0.003, 8, 3, M.steel)); });
    var halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: (function () { var c = canvas(64, 64), x = c.getContext("2d"), gr = x.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, "rgba(255,230,160,1)"); gr.addColorStop(0.4, "rgba(255,190,90,.45)"); gr.addColorStop(1, "rgba(255,170,60,0)"); x.fillStyle = gr; x.fillRect(0, 0, 64, 64); return ctex(c); })(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 }));
    halo.position.y = 0.5; halo.scale.set(0.7, 0.7, 1); g.add(halo);
    var tA = addPost(g, "black", -0.22, 0.06, 0.1), tB = addPost(g, "red", 0.22, 0.06, 0.1);
    var cold = new THREE.Color(0x55504a), hot = new THREE.Color();
    g.userData = { kind: "lamp", tips: { A: tA, B: tB }, filament: fil,
      setTemp: function (T) { var f = Math.max(0, Math.min(1, (T - 700) / 2000)); hot.setRGB(1, 0.35 + 0.6 * f, 0.08 + 0.7 * f * f); filMat.color.copy(cold).lerp(hot, Math.min(1, f * 1.6)); halo.material.opacity = f * 0.95; halo.scale.setScalar(0.3 + 0.6 * f); } };
    return g;
  }

  /* resistance box: mahogany case, ebonite top, row of brass blocks with ebonite-headed plugs, value plate */
  function resistanceBox() {
    var M = mats(), g = new THREE.Group(), W = 1.15, D = 0.5, H = 0.3;
    g.add(new THREE.Mesh(uvPlanar(slab(W, D, H, 0.02, 0.01), 0.8, 0.8), M.woodDark));
    var top = new THREE.Mesh(slab(W - 0.04, D - 0.04, 0.02, 0.02, 0.004), M.ebonite); top.position.y = H + 0.02; g.add(top);
    for (var i = 0; i < 5; i++) { var b = new THREE.Mesh(slab(0.16, 0.14, 0.05, 0.01, 0.006), M.brass); b.position.set(-0.4 + i * 0.2, H + 0.048, -0.05); g.add(b); }
    for (i = 0; i < 4; i++) { var p = lathe([[0, 0], [0.035, 0], [0.04, 0.03], [0.026, 0.05], [0.03, 0.09], [0.022, 0.11], [0, 0.115]], 12, M.ebonite); p.position.set(-0.3 + i * 0.2, H + 0.11 + (i === 1 ? 0.07 : 0), -0.05); g.add(p); }
    var cv = canvas(256, 96), tex = ctex(cv, 1, 1); tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
    var plate = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.2), std(0xffffff, 0.5, { map: tex })); plate.position.set(0, H * 0.55, D / 2 + 0.012); g.add(plate);
    var tA = addPost(g, "black", -W / 2 + 0.08, H + 0.04, 0.13), tB = addPost(g, "black", W / 2 - 0.08, H + 0.04, 0.13);
    g.userData = { kind: "resbox", tips: { A: tA, B: tB },
      setValue: function (R, name) { var x = cv.getContext("2d"); x.fillStyle = "#e7dcc0"; x.fillRect(0, 0, 256, 96); x.fillStyle = "#231a10"; x.textAlign = "center"; x.textBaseline = "middle"; x.font = "bold 46px sans-serif"; x.fillText((name ? name + " " : "") + fmtNum(R) + " Ω", 128, 50); tex.needsUpdate = true; } };
    g.userData.setValue(1);
    return g;
  }

  /* standard resistance coil: flanged bobbin wound with silk-covered wire on a small base, value tag */
  function coilResistor(color) {
    var M = mats(), g = new THREE.Group();
    g.add(new THREE.Mesh(uvPlanar(slab(0.56, 0.4, 0.05, 0.03, 0.008), 1.5, 1.5), M.wood));
    var bob = lathe([[0, 0.07], [0.15, 0.07], [0.15, 0.1], [0.1, 0.1], [0.1, 0.42], [0.15, 0.42], [0.15, 0.45], [0, 0.45]], 22, std(0x231f1c, 0.45)); g.add(bob);
    var w = new THREE.Mesh(new THREE.CylinderGeometry(0.118, 0.118, 0.3, 22, 1, true), std(0xffffff, 0.6, { map: windingTex(color || "#2f6b3a", "rgba(0,0,0,.35)"), bumpMap: windingTex("#888", "#222"), bumpScale: 0.6 }));
    w.position.y = 0.26; g.add(w);
    var tA = addPost(g, "black", -0.2, 0.06, 0.1), tB = addPost(g, "black", 0.2, 0.06, 0.1);
    var cv = canvas(192, 64), tex = ctex(cv, 1, 1); tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
    var tag = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.1), std(0xffffff, 0.5, { map: tex, side: THREE.DoubleSide })); tag.position.set(0, 0.465, 0.0); tag.rotation.x = -Math.PI / 2 + 0.25; g.add(tag);
    g.userData = { kind: "coil", tips: { A: tA, B: tB }, winding: w,
      setValue: function (R, name) { var x = cv.getContext("2d"); x.fillStyle = "#f0e6c8"; x.fillRect(0, 0, 192, 64); x.fillStyle = "#1c1308"; x.textAlign = "center"; x.textBaseline = "middle"; x.font = "bold 30px sans-serif"; x.fillText((name ? name + " " : "") + fmtNum(R) + " Ω", 96, 34); tex.needsUpdate = true; },
      setGlow: function (h) { w.material.emissive = w.material.emissive || new THREE.Color(); w.material.emissive.setHex(0xff3d00); w.material.emissiveIntensity = Math.min(0.7, h); } };
    g.userData.setValue(1);
    return g;
  }

  /* brass junction strip (the "node" where branches meet): ebonite base, brass bar, three posts */
  function junction() {
    var M = mats(), g = new THREE.Group();
    g.add(new THREE.Mesh(slab(0.22, 0.62, 0.04, 0.03, 0.006), M.ebonite));
    var bar = new THREE.Mesh(slab(0.09, 0.54, 0.03, 0.01, 0.004), M.brass); bar.position.y = 0.05; g.add(bar);
    var p = [-0.2, 0, 0.2].map(function (z) { var q = addPost(g, "black", 0, 0.08, z); q.scale.setScalar(0.8); return q; });
    g.userData = { kind: "node", tips: { p0: p[0], p1: p[1], p2: p[2] } };
    return g;
  }

  /* metre bridge / potentiometer board: 100 cm constantan wire over a metre scale, thick copper L-strips (gaps for the bridge),
     knife-edge jockey */
  function bridgeBoard() {
    var M = mats(), g = new THREE.Group(), Z_W = 0.2, Z_B = -0.55, Y0 = 0.08, half = WIRE_LEN / 2;
    g.add(new THREE.Mesh(uvPlanar(slab(WIRE_LEN + 1.0, 1.9, 0.06, 0.05, 0.01), 1 / 7.4, 1 / 7.4), M.wood));
    var sc = new THREE.Mesh(new THREE.PlaneGeometry(WIRE_LEN + 0.15, 0.3), std(0xffffff, 0.7, { map: metreScaleTex() })); sc.rotation.x = -Math.PI / 2; sc.position.set(0, Y0 + 0.003, 0.52); g.add(sc);
    var wire = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, WIRE_LEN, 10, 1), std(MATERIALS.constantan.color, 0.3, { metalness: 0.75 }));
    wire.rotation.z = Math.PI / 2; wire.position.set(0, Y0 + 0.07, Z_W); g.add(wire);
    function piece(x0, x1, z0, z1) { var m = new THREE.Mesh(slab(Math.abs(x1 - x0), Math.abs(z1 - z0), 0.05, 0.01, 0.006), M.copper); m.position.set((x0 + x1) / 2, Y0, (z0 + z1) / 2); g.add(m); return m; }
    var ends = new THREE.Group(), arms = new THREE.Group(); g.add(ends); g.add(arms);
    var eL = piece(-half - 0.3, -half + 0.02, Z_B - 0.06, Z_W + 0.1), eR = piece(half - 0.02, half + 0.3, Z_B - 0.06, Z_W + 0.1);
    ends.add(eL); ends.add(eR);
    var aL = piece(-half - 0.3, -1.45, Z_B - 0.06, Z_B + 0.06), mid = piece(-1.05, 1.05, Z_B - 0.06, Z_B + 0.06), aR = piece(1.45, half + 0.3, Z_B - 0.06, Z_B + 0.06);
    arms.add(aL); arms.add(mid); arms.add(aR);
    var tA = addPost(ends, "black", -half - 0.15, Y0 + 0.06, -0.15), tC = addPost(ends, "black", half + 0.15, Y0 + 0.06, -0.15);
    var gl1 = addPost(arms, "black", -1.58, Y0 + 0.06, Z_B), gl2 = addPost(arms, "black", -0.92, Y0 + 0.06, Z_B);
    var gr1 = addPost(arms, "black", 0.92, Y0 + 0.06, Z_B), gr2 = addPost(arms, "black", 1.58, Y0 + 0.06, Z_B);
    var gM = addPost(arms, "red", 0, Y0 + 0.06, Z_B);
    var gapL = new THREE.Group(), gapR = new THREE.Group(); gapL.position.set(-1.25, Y0, Z_B); gapR.position.set(1.25, Y0, Z_B); arms.add(gapL); arms.add(gapR);
    gapL.add(new THREE.Mesh(new THREE.RingGeometry(0.1, 0.13, 20).rotateX(-Math.PI / 2).translate(0, 0.004, 0), new THREE.MeshBasicMaterial({ color: 0x4a2e12, transparent: true, opacity: 0.0 })));
    gapR.add(new THREE.Mesh(new THREE.RingGeometry(0.1, 0.13, 20).rotateX(-Math.PI / 2).translate(0, 0.004, 0), new THREE.MeshBasicMaterial({ color: 0x4a2e12, transparent: true, opacity: 0.0 })));
    // jockey: brass knife-edge body, knurled ebonite handle, side terminal
    var jockey = new THREE.Group(); g.add(jockey);
    jockey.add(lathe([[0, 0], [0.008, 0.0], [0.03, 0.05], [0.035, 0.12], [0.03, 0.14], [0, 0.14]], 14, M.brass));
    jockey.add(lathe([[0, 0.14], [0.045, 0.14], [0.05, 0.17], [0.045, 0.36], [0.05, 0.39], [0.035, 0.42], [0, 0.43]], 16, std(0x1c1e21, 0.4, { bumpMap: knurlBump(), bumpScale: 0.5 })));
    var jt = addPost(jockey, "red", 0.06, 0.04, 0); jt.scale.setScalar(0.6);
    var st = { l: 50, goal: 50, press: 0 };
    function placeJ() { jockey.position.set(-half + st.l * CM, Y0 + 0.07 + 0.012 + (1 - st.press) * 0.06, Z_W); }
    g.userData = { kind: "board", tips: { A: tA, C: tC, gl1: gl1, gl2: gl2, gr1: gr1, gr2: gr2, gM: gM, J: jt }, wire: wire, jockey: jockey, scale: sc,
      arms: arms, gapL: gapL, gapR: gapR, ends: ends,
      setBridge: function (on) { arms.visible = on; },
      setL: function (l) { st.goal = Math.max(0, Math.min(100, l)); }, getL: function () { return st.l; },
      setPress: function (p) { st.press = p; }, snap: function () { st.l = st.goal; placeJ(); },
      step: function (dt) { st.l += (st.goal - st.l) * Math.min(1, dt * 9); placeJ(); } };
    g.userData.snap();
    return g;
  }

  /* demonstration moving-coil galvanometer: red horseshoe magnet with concave pole pieces, soft-iron core, rectangular coil
     on a spindle, hairspring, long pointer over an arc scale (coil-current and converted scales), front terminals,
     copper shunt strap, multiplier bobbin */
  function drawArcScale(cv, Ig, conv, range) {
    var x = cv.getContext("2d"), S = cv.width, c = S / 2, Ro = 1.12;
    x.clearRect(0, 0, S, S);
    function P(phi, rho) { return [c + c * Math.sin(phi) * rho / Ro, c + c * Math.cos(phi) * rho / Ro]; }
    var A = 50 * Math.PI / 180, i;
    x.fillStyle = "#f4eedd"; x.beginPath();
    for (i = 0; i <= 40; i++) { var p = P(-A + 2 * A * i / 40, 1.12); if (i) x.lineTo(p[0], p[1]); else x.moveTo(p[0], p[1]); }
    for (i = 40; i >= 0; i--) { var q = P(-A + 2 * A * i / 40, 0.82); x.lineTo(q[0], q[1]); }
    x.fill();
    x.strokeStyle = "#1c242c"; x.fillStyle = "#1c242c"; x.textAlign = "center"; x.textBaseline = "middle";
    // inner scale: coil current 0..Ig (mA)
    for (i = 0; i <= 30; i++) {
      var f = i / 30, phi = -A + 2 * A * f, maj = i % 10 === 0, a0 = P(phi, 0.9), a1 = P(phi, maj ? 0.97 : i % 5 === 0 ? 0.95 : 0.93);
      x.lineWidth = maj ? 3 : 1.5; x.beginPath(); x.moveTo(a0[0], a0[1]); x.lineTo(a1[0], a1[1]); x.stroke();
      if (maj) { var tp = P(phi, 0.86); x.font = "bold 17px sans-serif"; x.fillText(fmtNum(Ig * 1000 * f), tp[0], tp[1]); }
    }
    var lp = P(0, 0.845); x.font = "13px sans-serif"; x.fillStyle = "#3a4651"; x.fillText("coil mA", lp[0], lp[1] - 12);
    if (conv !== "bare") {
      x.strokeStyle = conv === "ammeter" ? "#0e4a8a" : "#8a1c1c"; x.fillStyle = x.strokeStyle;
      for (i = 0; i <= 50; i++) {
        var g2 = i / 50, ph = -A + 2 * A * g2, mj = i % 10 === 0, b0 = P(ph, 0.99), b1 = P(ph, mj ? 1.06 : i % 5 === 0 ? 1.04 : 1.02);
        x.lineWidth = mj ? 3 : 1.5; x.beginPath(); x.moveTo(b0[0], b0[1]); x.lineTo(b1[0], b1[1]); x.stroke();
        if (mj) { var t2 = P(ph, 1.095); x.font = "bold 18px sans-serif"; x.fillText(fmtNum(range * g2), t2[0], t2[1]); }
      }
      var up = P(A * 0.62, 1.0); x.font = "bold 22px sans-serif"; x.fillText(conv === "ammeter" ? "A" : "V", up[0] + 16, up[1] + 18);
    }
  }
  function galvDemo() {
    var M = mats(), g = new THREE.Group();
    g.add(new THREE.Mesh(uvPlanar(slab(2.3, 1.75, 0.07, 0.06, 0.012), 1 / 2.3, 1 / 2.3), M.wood));
    var Y0 = 0.094;
    // horseshoe magnet (shape in x / -z, extruded up)
    var s = new THREE.Shape(), aa = 50 * Math.PI / 180, R = 0.4, i;
    s.moveTo(-0.72, -0.36); s.lineTo(-0.3, -0.36); s.lineTo(-R * Math.cos(aa), -R * Math.sin(aa));
    for (i = 1; i <= 12; i++) { var t = -aa + 2 * aa * i / 12; s.lineTo(-R * Math.cos(t), R * Math.sin(t)); }
    s.lineTo(-0.3, 0.36); s.lineTo(-0.3, 0.5); s.quadraticCurveTo(0, 0.7, 0.3, 0.5); s.lineTo(0.3, 0.36); s.lineTo(R * Math.cos(aa), R * Math.sin(aa));
    for (i = 1; i <= 12; i++) { var t2 = aa - 2 * aa * i / 12; s.lineTo(R * Math.cos(t2), R * Math.sin(t2)); }
    s.lineTo(0.3, -0.36); s.lineTo(0.72, -0.36); s.lineTo(0.72, 0.5); s.quadraticCurveTo(0.72, 1.12, 0, 1.12); s.quadraticCurveTo(-0.72, 1.12, -0.72, 0.5); s.closePath();
    var mg = new THREE.ExtrudeGeometry(s, { depth: 0.46, bevelEnabled: true, bevelSize: 0.015, bevelThickness: 0.015, bevelSegments: 2, curveSegments: 12 });
    mg.rotateX(-Math.PI / 2); mg.translate(0, Y0 + 0.02, 0);
    var magnet = new THREE.Mesh(mg, std(0xb3271f, 0.42, { metalness: 0.2 })); g.add(magnet);
    [[-1, "N"], [1, "S"]].forEach(function (q) { var sp = labelSprite(q[1], 0.55); sp.position.set(q[0] * 0.56, Y0 + 0.62, -0.1); g.add(sp); sp.userData.poleTag = true; });
    var core = new THREE.Mesh(new THREE.CylinderGeometry(0.29, 0.29, 0.42, 28), M.iron); core.position.set(0, Y0 + 0.27, 0); g.add(core);
    var CY = Y0 + 0.27;
    // moving system
    var mov = new THREE.Group(); mov.position.set(0, 0, 0); g.add(mov);
    var cp = [], hw = 0.35, hh = 0.3, rc = 0.07;
    [[hw, -hh], [hw, hh], [-hw, hh], [-hw, -hh]].forEach(function (c, k) {
      var cx = c[0] - Math.sign(c[0]) * rc, cy = c[1] - Math.sign(c[1]) * rc, a0 = [-Math.PI / 2, 0, Math.PI / 2, Math.PI][k];
      for (var j = 0; j <= 4; j++) { var a = a0 + (Math.PI / 2) * j / 4; cp.push(new V3(cx + Math.cos(a) * rc, CY + cy + Math.sin(a) * rc, 0)); }
    });
    var coilCurve = new THREE.CatmullRomCurve3(cp, true);
    var coilMesh = new THREE.Mesh(new THREE.TubeGeometry(coilCurve, 80, 0.035, 8, true), std(0xffffff, 0.4, { metalness: 0.5, map: windingTex("#c47a3e", "rgba(60,25,5,.55)") }));
    coilMesh.material.map.repeat.set(1, 30); mov.add(coilMesh);
    var spindle = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.5, 8), M.steel); spindle.position.y = CY + hh + 0.22; mov.add(spindle);
    var hsP = []; for (i = 0; i <= 64; i++) { var u = i / 64, a2 = u * 4 * TAU; hsP.push(new V3(Math.cos(a2) * (0.02 + 0.07 * u), CY + hh + 0.12, Math.sin(a2) * (0.02 + 0.07 * u))); }
    var hairspring = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(hsP), 96, 0.004, 4, false), std(0x5a4b2a, 0.35, { metalness: 0.7 })); mov.add(hairspring);
    var PY = CY + hh + 0.42;
    var ps = new THREE.Shape(); ps.moveTo(-0.018, 0.12); ps.lineTo(0.018, 0.12); ps.lineTo(0.005, -1.02); ps.lineTo(0, -1.08); ps.lineTo(-0.005, -1.02); ps.closePath();
    var pg = new THREE.ExtrudeGeometry(ps, { depth: 0.006, bevelEnabled: false }); pg.rotateX(-Math.PI / 2); pg.translate(0, PY, 0);
    var pointer = new THREE.Mesh(pg, std(0x111111, 0.4)); mov.add(pointer);
    var cwt = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.02, 12), M.brass); cwt.position.set(0, PY, -0.13); mov.add(cwt);
    // fixed upper bridge and arc scale
    var pillar1 = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, PY - Y0 - 0.02, 8), M.brass); pillar1.position.set(-0.86, (PY + Y0) / 2 - 0.02, 0.62); g.add(pillar1);
    var pillar2 = pillar1.clone(); pillar2.position.x = 0.86; g.add(pillar2);
    var cv = canvas(512, 512), stex = ctex(cv, 1, 1); stex.wrapS = stex.wrapT = THREE.ClampToEdgeWrapping;
    var ring = new THREE.Mesh(new THREE.RingGeometry(0.82, 1.12, 40, 1, -140 * Math.PI / 180, 100 * Math.PI / 180), std(0xffffff, 0.6, { map: stex, side: THREE.DoubleSide, transparent: true }));
    ring.rotation.x = -Math.PI / 2; ring.position.y = PY - 0.03; g.add(ring);
    var scaleLip = new THREE.Mesh(new THREE.TorusGeometry(1.12, 0.012, 4, 40, 100 * Math.PI / 180), M.brass); scaleLip.rotation.x = -Math.PI / 2; scaleLip.rotation.z = -140 * Math.PI / 180; scaleLip.position.y = PY - 0.03; void scaleLip;
    // terminals and the shunt strap (front)
    var terminals = new THREE.Group(); g.add(terminals);
    var tPos = addPost(terminals, "red", -0.55, Y0 + 0.01, 0.62), tNeg = addPost(terminals, "black", 0.55, Y0 + 0.01, 0.62);
    tPos.scale.setScalar(1.3); tNeg.scale.setScalar(1.3);
    var shunt = strap([[-0.55, Y0 + 0.14, 0.62], [-0.45, Y0 + 0.3, 0.74], [0, Y0 + 0.36, 0.8], [0.45, Y0 + 0.3, 0.74], [0.55, Y0 + 0.14, 0.62]], 0.1, 0.02, M.copper, 24);
    g.add(shunt);
    // fine coil leads (to the hairspring and the lower pivot)
    var fine = std(0xb36a35, 0.4, { metalness: 0.6 });
    var cl1 = tubeMesh([[-0.55, Y0 + 0.14, 0.62], [-0.62, Y0 + 0.5, 0.4], [-0.3, CY + hh + 0.2, 0.2], [-0.09, CY + hh + 0.12, 0.0]], 0.006, 24, 4, fine); g.add(cl1);
    var cl2 = tubeMesh([[0.55, Y0 + 0.14, 0.62], [0.5, Y0 + 0.06, 0.3], [0.2, Y0 + 0.04, 0.05], [0.0, CY - hh - 0.03, 0.0]], 0.006, 24, 4, fine); g.add(cl2);
    // multiplier bobbin (right, standing)
    var mult = new THREE.Group(); mult.position.set(-1.6, 0, 0.45); g.add(mult);
    mult.add(new THREE.Mesh(slab(0.5, 0.5, 0.05, 0.04, 0.008), M.ebonite));
    mult.add(lathe([[0, 0.07], [0.16, 0.07], [0.16, 0.1], [0.11, 0.1], [0.11, 0.84], [0.16, 0.84], [0.16, 0.87], [0, 0.87]], 22, std(0x231f1c, 0.45)));
    var mw = new THREE.Mesh(new THREE.CylinderGeometry(0.128, 0.128, 0.72, 22, 1, true), std(0xffffff, 0.6, { map: windingTex("#8a2f2a", "rgba(0,0,0,.35)") })); mw.material.map.repeat.set(1, 3); mw.position.y = 0.47; mult.add(mw);
    var mA = addPost(mult, "black", -0.16, 0.06, 0.16), mB = addPost(mult, "red", 0.16, 0.06, 0.16);
    var st = { psi: 0, vel: 0, target: 0 }, A = 50 * Math.PI / 180;
    g.userData = { kind: "galvanometer", mov: mov, coil: coilMesh, pointer: pointer, hairspring: hairspring, magnet: magnet, core: core, scale: ring, shunt: shunt,
      multiplier: mult, terminals: terminals, tips: { pos: tPos, neg: tNeg, mA: mA, mB: mB }, coilLeads: [cl1, cl2],
      setScale: function (Ig, conv, range) { drawArcScale(cv, Ig, conv, range); stex.needsUpdate = true; },
      setDeflection: function (f) { st.target = Math.max(-0.04, Math.min(1.06, f)); },
      snap: function () { st.psi = st.target; st.vel = 0; mov.rotation.y = -A + 2 * A * st.psi; },
      step: function (dt) { dt = Math.min(dt, 0.05); var w = 8, z = 0.45; st.vel += (-w * w * (st.psi - st.target) - 2 * z * w * st.vel) * dt; st.psi += st.vel * dt; mov.rotation.y = -(-A + 2 * A * st.psi); } };
    g.userData.setScale(0.015, "ammeter", 3);
    g.userData.snap();
    return g;
  }

  /* ===================================================================
     4. THE BENCH
     =================================================================== */
  var MODES = ["ohms-law", "internal-resistance", "network-cells", "galvanometer", "bridge-potentiometer"];
  var AMP_RANGES = [0.05, 0.1, 0.5, 1, 3, 5, 10, 15], VOLT_RANGES = [0.1, 0.5, 1, 3, 5, 10, 15, 30, 50];
  var DRIVERS = { workshop: { E0: 24.0, r0: 0.0, Rser: 3.0, Rwire: 5.0, label: "24 V" }, school: { E0: 2.0, r0: 0.0, Rser: 0.0, Rwire: 5.0, label: "2 V" } };
  var TEST_CELLS = { battery: { E: 12.0, r: 1.2, label: "12 V", sub: "keke battery" }, "dry-cell": { E: 1.5, r: 0.75, label: "1.5 V", sub: "dry cell" }, "cell-2": { E: 1.08, r: 0.5, label: "E₂", sub: "test cell" } };
  function pickRange(v, list) { v = Math.abs(v); for (var i = 0; i < list.length; i++) if (v <= list[i] * 1.0001) return list[i]; return list[list.length - 1]; }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  var DEFAULTS = {
    "ohms-law": { comp: "constantan", L: 40, d: 0.30, E: 4.0, r: 0.1, Rh: 4.0, RA: 0, key: true, alpha: null, errors: {} },
    "internal-resistance": { E: 6.0, r: 1.5, R: 4.5, RA: 0, key: false, errors: {} },
    "network-cells": { E: 5.0, r: 0.5, n: 3, cells: "single", net: "load", R: 0.5, R1: 2.0, R2: 3.0, R3: 6.0, key: true, errors: {} },
    "galvanometer": { Ig: 0.015, Rg: 18.0, conv: "ammeter", rangeA: 3.0, rangeV: 40.0, test: null, errors: {} },
    "bridge-potentiometer": { sub: "bridge", Rx: 7.0, Ru: 5.5, Eb: 2.0, rb: 0.2, RwireB: 2.0, RG: 50, l: 30, key: true,
      driver: "workshop", cell: "battery", E: null, r: null, k2: false, Rshunt: 2.8, errors: {} }
  };
  var PRESETS = {
    keke: { mode: "internal-resistance", E: 12.0, r: 1.2, R: 2.8 },
    "lesson-cell": { mode: "internal-resistance", E: 6.0, r: 1.5 },
    "cell-5v": { mode: "network-cells", E: 5.0, r: 0.5 },
    "keke-pot": { mode: "bridge-potentiometer", sub: "potentiometer", driver: "workshop", cell: "battery" },
    "school-pot": { mode: "bridge-potentiometer", sub: "potentiometer", driver: "school", cell: "dry-cell", Rshunt: 3.0 }
  };

  function create(opts) {
    opts = opts || {};
    var M = mats(), g = new THREE.Group(); g.name = "DcCircuitBench";
    var S = { mode: null, labels: opts.labels !== false, onEvent: opts.onEvent || null, t: 0, per: {}, rows: {}, doneSent: {}, busy: null, hl: null, hlSaved: [] };
    MODES.forEach(function (m) { S.per[m] = clone(DEFAULTS[m]); S.rows[m] = []; });
    var dyn = { dT: 0, rWarm: 0, netWarm: 0, shuntWarm: 0, ruWarm: 0, fall: 0, kCal: null, keyFlash: 0 };
    function emit(n, d) { if (S.onEvent) try { S.onEvent(n, d); } catch (e) { if (window.console) console.warn(e); } }

    var parts = {};
    var top = new THREE.Mesh(uvPlanar(slab(9.6, 5.6, 0.06, 0.08, 0.015), 1 / 9.6, 1 / 9.6), std(0xffffff, 0.8, { map: (function () {
      var c = canvas(256, 256), x = c.getContext("2d"), r = rng(77), i; x.fillStyle = "#d4d9db"; x.fillRect(0, 0, 256, 256);
      for (i = 0; i < 1800; i++) { x.fillStyle = "rgba(" + (r() < 0.5 ? "255,255,255" : "70,85,95") + "," + (0.03 + r() * 0.06) + ")"; x.fillRect(r() * 256, r() * 256, 1 + r() * 2, 1 + r() * 2); }
      return ctex(c, 3, 2); })() }));
    top.position.y = -0.09; tagPart(top, "bench"); g.add(top);

    var groups = {}, kits = {}, leadsGroup = null, labelGroup = null, flows = [];
    var beadGeo = new THREE.IcosahedronGeometry(0.026, 0), BEADS = 260;
    var beads = new THREE.InstancedMesh(beadGeo, M.bead, BEADS); beads.frustumCulled = false; beads.userData.partId = "current"; g.add(beads);
    var _m4 = new THREE.Matrix4(), _p = new V3(), _q = new THREE.Quaternion(), _s0 = new V3(0, 0, 0), _s1 = new V3(1, 1, 1);

    function tipPos(o) { g.updateMatrixWorld(true); var p = o.localToWorld((o.userData.tip || new V3()).clone()); return g.worldToLocal(p); }
    function lead(a, b, color, liftK, I) {
      var p1 = tipPos(a), p2 = tipPos(b), d = p1.distanceTo(p2), lift = 0.18 + 0.09 * d * (liftK || 1);
      var mid = p1.clone().add(p2).multiplyScalar(0.5); mid.y = Math.max(p1.y, p2.y) + lift;
      var pts = [p1, p1.clone().add(new V3(0, 0.12, 0)), mid, p2.clone().add(new V3(0, 0.12, 0)), p2];
      var m = tubeMesh(pts, 0.02, Math.max(16, Math.round(d * 10)), 6, color || M.leadYellow);
      m.castShadow = false; leadsGroup.add(m);
      if (I) flows.push({ curve: m.userData.curve, len: m.userData.curve.getLength(), I: I, phase: Math.random() });
      return m;
    }
    function flow(mesh, I) { flows.push({ curve: mesh.userData.curve, len: mesh.userData.curve.getLength(), I: I, phase: 0 }); }
    function clearLeads() {
      if (leadsGroup) { leadsGroup.traverse(function (o) { if (o.geometry) o.geometry.dispose(); }); g.remove(leadsGroup); }
      leadsGroup = new THREE.Group(); g.add(leadsGroup); flows = [];
    }
    function clearLabels() { if (labelGroup) g.remove(labelGroup); labelGroup = new THREE.Group(); labelGroup.visible = S.labels; g.add(labelGroup); }
    function label(text, obj, dy, dx, dz) {
      g.updateMatrixWorld(true); var b = new THREE.Box3().setFromObject(obj), c = b.getCenter(new V3());
      var sp = labelSprite(text, 0.95); g.worldToLocal(c); var yTop = g.worldToLocal(b.max.clone()).y;
      sp.position.set(c.x + (dx || 0), yTop + (dy || 0.2), c.z + (dz || 0)); labelGroup.add(sp); return sp;
    }
    function setParts(map) { for (var k in parts) delete parts[k]; parts.bench = top; for (var j in map) { parts[j] = map[j]; tagPart(map[j], j); } g.userData.parts = parts; }
    function P() { return S.per[S.mode]; }
    function E_() { return P().errors || {}; }

    /* ---------- mode 1: Ohm's law ---------- */
    function buildOhms() {
      var G = new THREE.Group(), k = {};
      k.board = wireBoard(); k.board.position.set(0, 0, -1.25); G.add(k.board);
      k.lamp = filamentLamp(); k.lamp.position.set(0, 0, -0.35); G.add(k.lamp);
      k.cell = glassAccumulator(2); k.cell.position.set(-2.75, 0, 0.35); G.add(k.cell);
      k.key = plugKey(); k.key.position.set(-1.45, 0, 0.55); G.add(k.key);
      k.rheo = rheostat({ len: 2.6 }); k.rheo.position.set(1.55, 0, 0.3); G.add(k.rheo);
      k.am = meter({ unit: "A", range: 1 }); k.am.position.set(-0.95, 0, 1.55); G.add(k.am);
      k.vm = meter({ unit: "V", range: 3 }); k.vm.position.set(1.15, 0, 1.55); G.add(k.vm);
      return { G: G, k: k };
    }
    function wireOhms() {
      var k = kits[S.mode], s = P(), lamp = s.comp === "lamp", sol = solveOhms(ohmArgs()), U = function (o) { return o.userData.tips; };
      k.lamp.visible = lamp; k.board.userData.wire.material.opacity = 1;
      var dut = lamp ? { a: U(k.lamp).A, b: U(k.lamp).B } : { a: U(k.board).clipA, b: U(k.board).clipB };
      var I = function () { return cur.I || 0; }, Iv = function () { return isFinite(cur.RV) ? (cur.V || 0) / cur.RV : 0; };
      lead(U(k.cell).pos, U(k.key).A, M.leadRed, 1, I);
      lead(U(k.key).B, U(k.am).pos, M.leadRed, 1, I);
      lead(U(k.am).neg, U(k.rheo).A, M.leadYellow, 1, I);
      lead(U(k.rheo).C, dut.b, M.leadYellow, 0.6, I);
      lead(dut.a, U(k.cell).neg, M.leadBlack, 0.5, I);
      lead(dut.b, U(k.vm).pos, M.leadRed, 0.7, Iv);
      lead(U(k.vm).neg, dut.a, M.leadBlack, 0.7, Iv);
      void sol;
      setParts({ cell: k.cell, key: k.key, ammeter: k.am, voltmeter: k.vm, rheostat: k.rheo, wire: k.board, lamp: k.lamp, leads: leadsGroup });
      clearLabels(); label("cell", k.cell); label("key", k.key, 0.42); label("A", k.am); label("V", k.vm); label("rheostat", k.rheo, 0.3);
      label(lamp ? "test wire (not used)" : "test wire", k.board, 0.55, -2.2); if (lamp) label("lamp", k.lamp, 0.12);
    }
    function ohmArgs() {
      var s = S.per["ohms-law"], e = s.errors || {};
      return { E: s.E, r: s.r, RA: s.RA, Rh: s.Rh, comp: s.comp, L: s.L, d: s.d, key: s.key || dyn.keyFlash > 0,
        RV: e.voltmeter ? 50 : Infinity, Rc: e.contact ? 0.25 : 0, dT: e.warming ? dyn.dT : 0, alpha: s.alpha };
    }

    /* ---------- mode 2: internal resistance ---------- */
    function buildIR() {
      var G = new THREE.Group(), k = {};
      k.rheo = rheostat({ len: 2.6 }); k.rheo.position.set(1.7, 0, -0.9); G.add(k.rheo);
      k.key = plugKey(); k.key.position.set(-0.3, 0, -0.75); G.add(k.key);
      k.am = meter({ unit: "A", range: 3 }); k.am.position.set(0.9, 0, 1.0); G.add(k.am);
      k.vm = meter({ unit: "V", range: 10 }); k.vm.position.set(-1.4, 0, 1.1); G.add(k.vm);
      return { G: G, k: k };
    }
    function irBattery() {
      var k = kits["internal-resistance"], s = S.per["internal-resistance"], key = s.E.toFixed(2);
      if (k.cell && k.cellKey === key) return;
      if (k.cell) groups["internal-resistance"].remove(k.cell);
      var caps = Math.max(1, Math.min(6, Math.round(s.E / 2)));
      k.cell = blockBattery({ caps: caps, label: fmtNum(s.E) + " V", sub: s.E >= 10 ? "keke battery" : "battery", w: 0.55 + caps * 0.13 });
      k.cell.position.set(-2.3, 0, -0.9); groups["internal-resistance"].add(k.cell); k.cellKey = key;
    }
    function wireIR() {
      irBattery();
      var k = kits[S.mode], U = function (o) { return o.userData.tips; };
      var I = function () { return cur.I || 0; }, Iv = function () { return isFinite(cur.RV) ? (cur.V || 0) / cur.RV : 0; };
      lead(U(k.cell).pos, U(k.key).A, M.leadRed, 1, I);
      lead(U(k.key).B, U(k.am).pos, M.leadRed, 1, I);
      lead(U(k.am).neg, U(k.rheo).C, M.leadYellow, 0.8, I);
      lead(U(k.rheo).A, U(k.cell).neg, M.leadBlack, 0.6, I);
      lead(U(k.cell).pos, U(k.vm).pos, M.leadRed, 0.8, Iv);
      lead(U(k.vm).neg, U(k.cell).neg, M.leadBlack, 0.8, Iv);
      setParts({ cell: k.cell, key: k.key, ammeter: k.am, voltmeter: k.vm, rheostat: k.rheo, leads: leadsGroup });
      clearLabels(); label("cell (E, r)", k.cell); label("key", k.key, 0.42); label("A", k.am); label("V", k.vm); label("load R", k.rheo, 0.3);
    }
    function irArgs() {
      var s = S.per["internal-resistance"], e = s.errors || {};
      return { E: s.E, r: s.r, R: s.R, RA: s.RA, key: s.key || dyn.keyFlash > 0, RV: e.voltmeter ? 50 : Infinity, Rc: e.contact ? 0.3 : 0, rWarm: e.warming ? dyn.rWarm : 0 };
    }

    /* ---------- mode 3: networks and cell arrays ---------- */
    function buildNet() {
      var G = new THREE.Group(), k = {};
      k.cells = [0, 1, 2].map(function (i) { var c = blockBattery({ caps: 3, label: "5.0 V", sub: "cell " + "ABC"[i], w: 0.7, d: 0.46, h: 0.5 }); c.position.set(-3.0 + i * 0.95, 0, -1.25); G.add(c); return c; });
      k.key = plugKey(); k.key.position.set(-0.8, 0, -1.0); G.add(k.key);
      k.R = [0, 1, 2].map(function (i) { var c = coilResistor(["#2f6b3a", "#2a4f7a", "#7a4a2a"][i]); c.position.set(1.75, 0, -1.25 + i * 0.95); G.add(c); return c; });
      k.nA = junction(); k.nA.position.set(0.75, 0, -0.3); G.add(k.nA);
      k.nB = junction(); k.nB.position.set(2.8, 0, -0.3); G.add(k.nB);
      k.am = meter({ unit: "A", range: 10 }); k.am.position.set(-2.2, 0, 1.25); G.add(k.am);
      k.vm = meter({ unit: "V", range: 5 }); k.vm.position.set(0.25, 0, 1.4); G.add(k.vm);
      return { G: G, k: k };
    }
    function wireNet() {
      var k = kits[S.mode], s = P(), U = function (o) { return o.userData.tips; }, C = k.cells, R = k.R, src = {};
      var I = function () { return cur.I || 0; };
      C.forEach(function (c, i) { c.userData.heatMat.opacity = 0; c.traverse(function (o) { if (o.material && o.material.userData) { /* noop */ } }); c.visible = true; void i; });
      if (s.cells === "single") { src.pos = U(C[0]).pos; src.neg = U(C[0]).neg; }
      else if (s.cells === "series") { lead(U(C[0]).pos, U(C[1]).neg, M.leadYellow, 0.6, I); lead(U(C[1]).pos, U(C[2]).neg, M.leadYellow, 0.6, I); src.pos = U(C[2]).pos; src.neg = U(C[0]).neg; }
      else {
        lead(U(C[0]).pos, U(C[1]).pos, M.leadRed, 0.9, function () { return (cur.I || 0) / 3; }); lead(U(C[1]).pos, U(C[2]).pos, M.leadRed, 0.9, function () { return 2 * (cur.I || 0) / 3; });
        lead(U(C[1]).neg, U(C[0]).neg, M.leadBlack, 0.5, function () { return (cur.I || 0) / 3; }); lead(U(C[2]).neg, U(C[1]).neg, M.leadBlack, 0.5, function () { return 2 * (cur.I || 0) / 3; });
        src.pos = U(C[2]).pos; src.neg = U(C[0]).neg;
      }
      lead(src.pos, U(k.key).A, M.leadRed, 0.6, I);
      lead(U(k.key).B, U(k.am).pos, M.leadRed, 0.5, I);
      lead(U(k.am).neg, U(k.nA).p0, M.leadYellow, 0.6, I);
      lead(U(k.nB).p0, src.neg, M.leadBlack, 0.35, I);
      var i1 = function () { return cur.I1 || 0; }, i2 = function () { return cur.I2 || 0; }, i3 = function () { return cur.I3 || 0; };
      R[1].visible = R[2].visible = s.net !== "load";
      if (s.net === "load") { lead(U(k.nA).p1, U(R[0]).A, M.leadYellow, 0.6, i1); lead(U(R[0]).B, U(k.nB).p1, M.leadYellow, 0.6, i1); }
      else if (s.net === "series") { lead(U(k.nA).p1, U(R[0]).A, M.leadYellow, 0.6, i1); lead(U(R[0]).B, U(R[1]).A, M.leadYellow, 0.6, i1); lead(U(R[1]).B, U(R[2]).A, M.leadYellow, 0.6, i1); lead(U(R[2]).B, U(k.nB).p1, M.leadYellow, 0.6, i1); }
      else if (s.net === "parallel") { [0, 1, 2].forEach(function (j) { var f = [i1, i2, i3][j]; lead(U(k.nA)["p" + Math.min(2, j + 0)], U(R[j]).A, M.leadYellow, 0.6, f); lead(U(R[j]).B, U(k.nB)["p" + Math.min(2, j + 0)], M.leadYellow, 0.6, f); }); }
      else { lead(U(k.nA).p1, U(R[0]).A, M.leadYellow, 0.6, i1); lead(U(R[0]).B, U(R[1]).A, M.leadYellow, 0.5, i2); lead(U(R[0]).B, U(R[2]).A, M.leadYellow, 0.5, i3); lead(U(R[1]).B, U(k.nB).p1, M.leadYellow, 0.6, i2); lead(U(R[2]).B, U(k.nB).p2, M.leadYellow, 0.6, i3); }
      lead(U(k.nA).p2, U(k.vm).pos, M.leadRed, 0.7, null); lead(U(k.vm).neg, U(k.nB).p2, M.leadBlack, 0.7, null);
      if (s.net === "load") R[0].userData.setValue(s.R, "R"); else { R[0].userData.setValue(s.R1, "R₁"); R[1].userData.setValue(s.R2, "R₂"); R[2].userData.setValue(s.R3, "R₃"); }
      C.forEach(function (c, i) { c.userData.used = s.cells !== "single" || i === 0; });
      setParts({ cellA: C[0], cellB: C[1], cellC: C[2], R1: R[0], R2: R[1], R3: R[2], ammeter: k.am, voltmeter: k.vm, node: k.nA, nodeB: k.nB, key: k.key, leads: leadsGroup });
      clearLabels(); C.forEach(function (c, i) { label("ABC"[i] + (c.userData.used ? "" : " (spare)"), c, 0.3); });
      label("A", k.am); label("V", k.vm); label("node", k.nA, 0.25, 0, 0.0);
    }
    function netArgs() {
      var s = S.per["network-cells"], e = s.errors || {};
      return { E: s.E, r: s.r, n: s.n, cells: s.cells, net: s.net, R: s.R, R1: s.R1, R2: s.R2, R3: s.R3, RA: e.ammeter ? 0.1 : 0, Rc: e.contact ? 0.5 : 0, rWarm: e.warming ? dyn.netWarm : 0, key: s.key };
    }

    /* ---------- mode 4: galvanometer conversion ---------- */
    function buildGalv() {
      var G = new THREE.Group(), k = {};
      k.gd = galvDemo(); k.gd.position.set(0.55, 0, -0.1); G.add(k.gd);
      k.src = blockBattery({ caps: 6, label: "12 V", sub: "test supply", w: 1.1, d: 0.55, h: 0.62 }); k.src.position.set(-2.55, 0, 1.35); G.add(k.src);
      k.rheo = rheostat({ len: 2.1 }); k.rheo.position.set(-2.3, 0, -1.3); G.add(k.rheo);
      return { G: G, k: k };
    }
    function wireGalv() {
      var k = kits[S.mode], s = P(), gd = k.gd.userData, T = gd.tips, U = function (o) { return o.userData.tips; };
      var I = function () { return cur.test_line || 0; }, Ic = function () { return cur.I_coil || 0; }, Is = function () { return cur.I_shunt || 0; };
      var amm = s.conv === "ammeter";
      gd.shunt.visible = amm; gd.multiplier.visible = s.conv === "voltmeter";
      lead(U(k.src).pos, U(k.rheo).A, M.leadRed, 0.6, I);
      if (s.conv === "voltmeter") { lead(U(k.rheo).C, T.mB, M.leadRed, 0.7, I); lead(T.mA, T.pos, M.leadYellow, 0.5, I); }
      else lead(U(k.rheo).C, T.pos, M.leadRed, 0.7, I);
      lead(T.neg, U(k.src).neg, M.leadBlack, 0.9, I);
      if (amm) flows.push({ curve: offsetCurve(gd.shunt.userData.curve, k.gd.position), len: 1.4, I: Is, phase: 0 });
      flows.push({ curve: offsetCurve(gd.coilLeads[0].userData.curve, k.gd.position), len: 1.2, I: Ic, phase: 0 });
      flows.push({ curve: offsetCurve(gd.coilLeads[1].userData.curve, k.gd.position, true), len: 1.2, I: Ic, phase: 0 });
      gd.setScale(s.Ig, s.conv, s.conv === "ammeter" ? s.rangeA : s.conv === "voltmeter" ? s.rangeV : s.Ig);
      setParts({ coil: gd.coil, pointer: gd.pointer, shunt: gd.shunt, multiplier: gd.multiplier, terminals: gd.terminals, scale: gd.scale, magnet: gd.magnet, core: gd.core, hairspring: gd.hairspring, source: k.src, rheostat: k.rheo, leads: leadsGroup });
      clearLabels(); label("magnet", gd.magnet, 0.12, -0.75, -0.3); label(amm ? "shunt Rs" : s.conv === "voltmeter" ? "multiplier Rm" : "bare coil", amm ? gd.shunt : s.conv === "voltmeter" ? gd.multiplier : gd.terminals, amm ? 0.08 : 0.15, 0, amm ? 0.25 : 0);
      label("supply", k.src);
    }
    function offsetCurve(curve, off, reverse) {
      var pts = curve.points.map(function (p) { return p.clone().add(off); }); if (reverse) pts.reverse();
      return new THREE.CatmullRomCurve3(pts);
    }
    function galvArgs() {
      var s = S.per.galvanometer, e = s.errors || {}, range = s.conv === "ammeter" ? s.rangeA : s.conv === "voltmeter" ? s.rangeV : s.Ig;
      return { Ig: s.Ig, Rg: s.Rg, conv: s.conv, range: range, test: s.test == null ? range * 0.8 : s.test, Rc: e.contact ? 0.02 : 0, shuntWarm: e.warming ? dyn.shuntWarm : 0, forgotRg: !!e.forgotRg };
    }

    /* ---------- mode 5: metre bridge and potentiometer ---------- */
    function buildNull() {
      var G = new THREE.Group(), k = {};
      k.board = bridgeBoard(); G.add(k.board);
      // bridge kit
      k.br = new THREE.Group(); G.add(k.br);
      k.box = resistanceBox(); k.box.position.set(-1.25, 0, -1.55); k.br.add(k.box);
      k.unk = coilResistor("#6a3d1f"); k.unk.position.set(1.25, 0, -1.5); k.br.add(k.unk);
      k.bcell = glassAccumulator(1); k.bcell.position.set(-3.0, 0, 1.75); k.br.add(k.bcell);
      k.bkey = plugKey(); k.bkey.position.set(-1.85, 0, 1.85); k.br.add(k.bkey);
      // potentiometer kit
      k.pt = new THREE.Group(); G.add(k.pt);
      k.rheo = rheostat({ len: 2.3 }); k.rheo.position.set(1.85, 0, -1.55); k.pt.add(k.rheo);
      k.pkey = plugKey(); k.pkey.position.set(-0.35, 0, -1.45); k.pt.add(k.pkey);
      k.k2 = plugKey(); k.k2.position.set(0.95, 0, 1.95); k.pt.add(k.k2);
      k.sbox = resistanceBox(); k.sbox.position.set(2.65, 0, 1.75); k.pt.add(k.sbox);
      k.gm = meter({ unit: "G", range: 1, centreZero: true, sub: "centre zero" }); k.gm.position.set(-0.45, 0, 1.75); G.add(k.gm);
      return { G: G, k: k };
    }
    function nullBatteries() {
      var k = kits["bridge-potentiometer"], s = S.per["bridge-potentiometer"], dv = DRIVERS[s.driver] || DRIVERS.workshop, tc = testCell();
      var key = s.driver + "|" + tc.label + "|" + tc.E;
      if (k.batKey === key) return;
      if (k.drv) k.pt.remove(k.drv); if (k.tc) k.pt.remove(k.tc);
      k.drv = s.driver === "school" ? glassAccumulator(1) : blockBattery({ caps: 6, label: dv.label, sub: "driver", w: 1.25, d: 0.6, h: 0.66 });
      k.drv.position.set(-2.3, 0, -1.55); k.pt.add(k.drv);
      k.tc = tc.E >= 6 ? blockBattery({ caps: Math.min(6, Math.round(tc.E / 2)), label: fmtNum(tc.E) + " V", sub: tc.sub, w: 1.15, d: 0.58, h: 0.64 })
        : blockBattery({ caps: 1, label: tc.label, sub: tc.sub, w: 0.55, d: 0.4, h: 0.5, color: 0x2a4d7a });
      k.tc.position.set(-2.55, 0, 1.75); k.pt.add(k.tc); k.batKey = key;
    }
    function testCell() { var s = S.per["bridge-potentiometer"], c = TEST_CELLS[s.cell] || TEST_CELLS.battery; return { E: s.E != null ? s.E : c.E, r: s.r != null ? s.r : c.r, label: c.label, sub: c.sub }; }
    function wireNull() {
      var k = kits[S.mode], s = P(), bridge = s.sub === "bridge", B = k.board.userData, T = B.tips, U = function (o) { return o.userData.tips; };
      k.br.visible = bridge; k.pt.visible = !bridge; B.setBridge(bridge);
      var Id = function () { return cur.I_driver || 0; }, Ig = function () { return cur.I_G || 0; };
      if (bridge) {
        k.box.userData.setValue(s.Rx, "R"); k.unk.userData.setValue(s.Ru, "X");
        lead(U(k.bcell).pos, U(k.bkey).A, M.leadRed, 0.5, Id); lead(U(k.bkey).B, T.A, M.leadRed, 0.4, Id); lead(T.C, U(k.bcell).neg, M.leadBlack, 0.35, Id);
        lead(T.gl1, U(k.box).A, M.leadYellow, 0.8, null); lead(U(k.box).B, T.gl2, M.leadYellow, 0.8, null);
        lead(T.gr1, U(k.unk).A, M.leadYellow, 0.8, null); lead(U(k.unk).B, T.gr2, M.leadYellow, 0.8, null);
        lead(T.gM, U(k.gm).pos, M.leadRed, 0.5, Ig);
      } else {
        nullBatteries();
        var tc = U(k.tc);
        lead(U(k.drv).pos, U(k.pkey).A, M.leadRed, 0.5, Id); lead(U(k.pkey).B, T.A, M.leadRed, 0.4, Id);
        lead(T.C, U(k.rheo).C, M.leadBlack, 0.5, Id); lead(U(k.rheo).A, U(k.drv).neg, M.leadBlack, 0.4, Id);
        lead(tc.pos, T.A, M.leadRed, 0.4, function () { return -(cur.I_G || 0); }); lead(tc.neg, U(k.gm).neg, M.leadBlack, 0.4, Ig);
        lead(tc.pos, U(k.k2).A, M.leadRed, 0.4, function () { return cur.I_shunt || 0; }); lead(U(k.k2).B, U(k.sbox).A, M.leadYellow, 0.4, function () { return cur.I_shunt || 0; });
        lead(U(k.sbox).B, tc.neg, M.leadBlack, 0.3, function () { return cur.I_shunt || 0; });
        k.sbox.userData.setValue(s.Rshunt, "R");
      }
      jockeyLead();
      var map = { slidewire: B.wire, jockey: B.jockey, galvanometer: k.gm, scale: B.scale, leads: leadsGroup, key: bridge ? k.bkey : k.pkey };
      if (bridge) { map.leftgap = B.gapL; map.rightgap = B.gapR; map.standard = k.box; map.unknown = k.unk; map.driver = k.bcell; }
      else { map.driver = k.drv; map.standard = k.sbox; map.testcell = k.tc; map.rheostat = k.rheo; map.key2 = k.k2; map.shuntR = k.sbox; }
      setParts(map);
      clearLabels(); label("G", k.gm); label(bridge ? "R (box)" : "driver", bridge ? k.box : k.drv, 0.25);
      label(bridge ? "X (unknown)" : "test cell", bridge ? k.unk : k.tc, 0.25); if (!bridge) label("R", k.sbox, 0.3);
      label("100 cm wire", B.scale, 0.1, 3.0, 0.42);
    }
    var jLead = null, jLeadL = -1;
    function jockeyLead() {
      var k = kits["bridge-potentiometer"], B = k.board.userData;
      if (jLead) { leadsGroup.remove(jLead); jLead.geometry.dispose(); flows = flows.filter(function (f) { return f.curve !== jLead.userData.curve; }); }
      var from = S.per["bridge-potentiometer"].sub === "bridge" ? k.gm.userData.tips.neg : k.gm.userData.tips.pos;
      jLead = lead(from, B.tips.J, M.leadGreen, 0.5, function () { return -(cur.I_G || 0); }); jLeadL = B.getL();
    }
    function nullArgs() {
      var s = S.per["bridge-potentiometer"], e = s.errors || {}, l = kits["bridge-potentiometer"] ? kits["bridge-potentiometer"].board.userData.getL() : s.l;
      if (s.sub === "bridge") return { Eb: s.Eb, rb: s.rb, Rx: s.Rx, Ru: s.Ru * (1 + (e.warming ? dyn.ruWarm : 0)), Rwire: s.RwireB, RG: s.RG, l: l, eL: e.ends ? 2.0 : 0, eR: e.ends ? 1.0 : 0, key: s.key };
      var dv = DRIVERS[s.driver] || DRIVERS.workshop, tc = testCell(), E0 = dv.E0 * (1 - (e.driverFall ? dyn.fall : 0));
      return { E0: E0, r0: dv.r0, Rser: dv.Rser, Rwire: dv.Rwire, E: tc.E, r: tc.r, Rshunt: s.Rshunt, k2: s.k2, RG: s.RG, l: l, key: s.key, kCal: potK(dv.E0, dv.r0, dv.Rser, dv.Rwire) };
    }

    /* ---------- current solution (refreshed every frame from the model) ---------- */
    var cur = {};
    function solve() {
      var m = S.mode;
      if (m === "ohms-law") { var a = ohmArgs(); cur = solveOhms(a); cur.RV = a.RV; }
      else if (m === "internal-resistance") { var b = irArgs(); cur = solveIR(b); cur.RV = b.RV; }
      else if (m === "network-cells") { var c = netArgs(); cur = solveNetwork(c); if (!c.key) { cur.I = cur.I1 = cur.I2 = cur.I3 = 0; cur.V = 0; cur.P = 0; } }
      else if (m === "galvanometer") { var d = galvArgs(); cur = solveGalv(d); cur.test_line = d.conv === "voltmeter" ? cur.I_coil : d.test; }
      else {
        var n = nullArgs();
        if (P().sub === "bridge") { cur = solveBridge(n); cur.sub = "bridge"; cur.I_driver = n.key ? n.Eb / (n.rb + par(n.Rx + n.Ru, n.Rwire)) : 0; }
        else { cur = solvePot(n); cur.sub = "potentiometer"; cur.I_driver = n.key ? n.E0 / (n.Rwire + n.Rser + n.r0) : 0; cur.I_shunt = n.k2 ? n.E / (n.r + n.Rshunt) : 0; }
      }
      return cur;
    }

    /* ---------- mode switching, wiring, static pose ---------- */
    var BUILD = { "ohms-law": buildOhms, "internal-resistance": buildIR, "network-cells": buildNet, galvanometer: buildGalv, "bridge-potentiometer": buildNull };
    var WIRE = { "ohms-law": wireOhms, "internal-resistance": wireIR, "network-cells": wireNet, galvanometer: wireGalv, "bridge-potentiometer": wireNull };
    var lastWireL = null;
    function setMode(m) {
      if (m === "null") m = "bridge-potentiometer";
      if (MODES.indexOf(m) < 0 || m === S.mode) return;
      if (!groups[m]) { var b = BUILD[m](); groups[m] = b.G; kits[m] = b.k; g.add(b.G); }
      for (var k in groups) groups[k].visible = (k === m);
      S.mode = m; clearHighlight(); applyStatic(true); rewire();
      emit("mode", { mode: m });
    }
    function rewire() { clearLeads(); jLead = null; WIRE[S.mode](); if (S.mode === "ohms-law") lastWireL = kits["ohms-law"].board.userData.clipB.position.x; }
    function applyStatic(snap) {
      var k = kits[S.mode], s = P();
      if (S.mode === "ohms-law") {
        k.board.userData.setWire(s.comp === "lamp" ? "constantan" : s.comp, s.d); k.board.userData.setLength(s.L);
        k.rheo.userData.setFraction(s.Rh / 30); k.key.userData.setOpen(!s.key);
      } else if (S.mode === "internal-resistance") { k.rheo.userData.setFraction(s.R / 30); k.key.userData.setOpen(!s.key); }
      else if (S.mode === "network-cells") { k.key.userData.setOpen(!s.key); }
      else if (S.mode === "galvanometer") { var ga = galvArgs(); k.rheo.userData.setFraction(0.15 + 0.8 * Math.min(1, ga.test / ga.range)); }
      else { k.board.userData.setL(s.l); k.bkey.userData.setOpen(!s.key); k.pkey.userData.setOpen(!s.key); k.k2.userData.setOpen(!s.k2); }
      if (snap) for (var n in k) { var o = k[n]; if (o && o.userData && o.userData.snap) o.userData.snap(); }
    }

    /* ---------- per-frame update ---------- */
    function update(dt, t) {
      dt = Math.min(Math.max(dt || 0, 0), 0.1); S.t += dt;
      var s = P(), e = E_(), k = kits[S.mode];
      if (dyn.keyFlash > 0) dyn.keyFlash -= dt;
      // error-mode dynamics (they only act when that error is switched on)
      if (S.mode === "ohms-law") {
        var on = (s.key || dyn.keyFlash > 0) && e.warming, tgt = on ? (cur.dT_ss || 0) : 0;
        dyn.dT += (tgt - dyn.dT) * Math.min(1, dt / (on ? 4 : 6));
      } else if (S.mode === "internal-resistance") {
        if (e.warming && s.key) dyn.rWarm = Math.min(0.6, dyn.rWarm + dt * 0.02 * Math.pow((cur.I || 0) / 2, 2)); else dyn.rWarm = Math.max(0, dyn.rWarm - dt * 0.004);
      } else if (S.mode === "network-cells") {
        if (e.warming && s.key) dyn.netWarm = Math.min(0.6, dyn.netWarm + dt * 0.004 * Math.pow((cur.I || 0) / 2, 2)); else dyn.netWarm = Math.max(0, dyn.netWarm - dt * 0.004);
      } else if (S.mode === "galvanometer") {
        var sw = e.warming ? 0.25 * Math.pow((cur.I_shunt || 0) / galvArgs().range, 2) : 0; dyn.shuntWarm += (sw - dyn.shuntWarm) * Math.min(1, dt / 5);
      } else {
        var kon = s.key && e.warming && s.sub === "bridge"; dyn.ruWarm += ((kon ? 0.05 : 0) - dyn.ruWarm) * Math.min(1, dt / (kon ? 6 : 10));
        if (s.key && e.driverFall && s.sub === "potentiometer") dyn.fall = Math.min(0.1, dyn.fall + dt * 0.004);
      }
      // balance search animation
      if (S.busy) stepBusy(dt);
      solve();
      // instruments
      if (S.mode === "ohms-law") {
        var cl = s.key || dyn.keyFlash > 0;
        if (cl) { k.am.userData.setRange(pickRange(cur.I, AMP_RANGES), "A"); k.vm.userData.setRange(pickRange(cur.V, VOLT_RANGES), "V"); }
        k.am.userData.setValue(cur.I || 0); k.vm.userData.setValue(cur.V || 0);
        k.key.userData.setOpen(!cl);
        k.lamp.userData.setTemp(s.comp === "lamp" ? cur.lampT : 293);
        k.board.userData.setGlow(s.comp === "lamp" ? 0 : Math.max(0, ((e.warming ? dyn.dT : cur.dT_ss || 0) - 60) / 500) * (cl ? 1 : 0));
        k.cell.userData.setHeat(0);
        var cx = k.board.userData.clipB.position.x; if (lastWireL != null && Math.abs(cx - lastWireL) > 0.03) rewire();
      } else if (S.mode === "internal-resistance") {
        var cl2 = s.key || dyn.keyFlash > 0;
        k.am.userData.setRange(pickRange(s.E / (s.r + 0.5), AMP_RANGES), "A"); k.vm.userData.setRange(pickRange(s.E, VOLT_RANGES), "V");
        k.am.userData.setValue(cur.I); k.vm.userData.setValue(cur.V); k.key.userData.setOpen(!cl2);
        k.cell.userData.setHeat(cur.P_lost ? 0.15 + 0.7 * cur.P_lost / (s.E * s.E / (4 * s.r)) : 0);
      } else if (S.mode === "network-cells") {
        k.am.userData.setRange(pickRange(Math.max(cur.I, 0.01), AMP_RANGES), "A"); k.vm.userData.setRange(pickRange(cur.E_t, VOLT_RANGES), "V");
        k.am.userData.setValue(cur.I); k.vm.userData.setValue(cur.V);
        var used = s.cells === "single" ? 1 : s.n, hp = s.key ? (cur.P_lost / used) / (s.E * s.E / (4 * s.r)) : 0;
        k.cells.forEach(function (c, i) { c.userData.setHeat(i < used && s.key ? 0.1 + 0.8 * hp : 0); });
      } else if (S.mode === "galvanometer") {
        k.gd.userData.setDeflection(cur.deflection);
        if (cur.overload && !S.overSent) { S.overSent = true; emit("overload", { deflection: cur.deflection }); } else if (!cur.overload) S.overSent = false;
      } else {
        k.gm.userData.setValue((cur.I_G || 0) * 1000);
        if (s.sub === "bridge") k.unk.userData.setGlow(dyn.ruWarm * 10);
        if (Math.abs(k.board.userData.getL() - jLeadL) > 0.25) jockeyLead();
      }
      for (var n in k) { var o = k[n]; if (o && o.userData && o.userData.step) o.userData.step(dt); }
      // current beads (conventional current, speed proportional to the branch current)
      var Iref = S.mode === "ohms-law" ? 1 : S.mode === "internal-resistance" ? 2 : S.mode === "network-cells" ? 4 :
        S.mode === "galvanometer" ? (s.conv === "voltmeter" ? s.Ig * 1.5 : galvArgs().range) : (s.sub === "bridge" ? 0.8 : 3);
      var bi = 0;
      for (var f = 0; f < flows.length; f++) {
        var F = flows[f], I = typeof F.I === "function" ? F.I() : F.I, a = Math.abs(I) / Iref, nb = Math.max(2, Math.min(12, Math.round(F.len / 0.3)));
        var vis = a > 0.0008;
        F.phase += (I >= 0 ? 1 : -1) * Math.min(1.8, a) * 1.3 * dt / F.len;
        for (var b = 0; b < nb && bi < BEADS; b++, bi++) {
          var u = ((F.phase + b / nb) % 1 + 1) % 1;
          F.curve.getPointAt(u, _p); _m4.compose(_p, _q, vis ? _s1 : _s0); beads.setMatrixAt(bi, _m4);
        }
      }
      for (; bi < BEADS; bi++) { _m4.compose(_p, _q, _s0); beads.setMatrixAt(bi, _m4); }
      beads.instanceMatrix.needsUpdate = true;
      // highlight pulse
      if (S.hlSaved.length) { var pulse = 0.35 + 0.3 * Math.sin(S.t * 6); S.hlSaved.forEach(function (h) { h.mesh.material.emissiveIntensity = pulse; }); }
      void t;
    }

    /* ---------- balance search (metre bridge / potentiometer) ---------- */
    function findBalance() {
      if (S.mode !== "bridge-potentiometer" || S.busy) return false;
      var s = P(); if (!s.key) return false;
      var a = nullArgs(), lb = s.sub === "bridge" ? bridgeBalance(a.Rx, a.Ru, a.eL, a.eR) : solvePot(a).l_balance;
      if (lb == null || lb <= 0 || lb >= 100) { emit("no-balance", { l_balance: lb }); return false; }
      var l0 = kits[S.mode].board.userData.getL(), seq = [];
      for (var i = 1; i <= 5; i++) seq.push(Math.max(0.5, Math.min(99.5, lb + (l0 - lb) * Math.pow(-0.45, i))));
      seq.push(Math.round(lb * 10) / 10);
      S.busy = { seq: seq, i: -1, t: 0 }; emit("search-start", { from: l0 });
      return true;
    }
    function stepBusy(dt) {
      var B = S.busy, board = kits["bridge-potentiometer"].board.userData;
      B.t -= dt;
      if (B.t > 0) { board.setPress(B.t < 0.2 ? 1 : 0); return; }
      B.i++;
      if (B.i >= B.seq.length) {
        S.busy = null; board.setPress(1);
        var s = P(), l = B.seq[B.seq.length - 1]; s.l = l; solve();
        var row;
        if (s.sub === "bridge") row = { kind: "bridge", Rx: s.Rx, l: r1(l), l_rest: r1(100 - l), R: r2(s.Rx * (100 - l) / l), I_G_uA: Math.round((cur.I_G || 0) * 1e6) };
        else { var tc = testCell(); row = { kind: "potentiometer", cell: tc.sub, k: Math.round(cur.k_cal * 10000) / 10000, k2: !!s.k2, R: s.k2 ? s.Rshunt : null, l: r1(l), E_deduced: r2(cur.k_cal * r1(l)) }; }
        record(row, "balance");
        return;
      }
      board.setL(B.seq[B.i]); board.setPress(0); B.t = 0.55;
    }

    /* ---------- readings, tables, events ---------- */
    function record(row, evName) {
      var rows = S.rows[S.mode]; row.n = rows.length + 1; rows.push(row);
      var rd = reading(); if (evName) emit(evName, row); emit("reading", rd);
      if (!S.doneSent[S.mode] && isDone()) { S.doneSent[S.mode] = true; emit("done", reading()); }
      return row;
    }
    function isDone() {
      var rows = S.rows[S.mode], s = P(), uniq = function (arr) { var o = {}; arr.forEach(function (x) { o[x] = 1; }); return Object.keys(o).length; };
      if (S.mode === "ohms-law") return rows.filter(function (r) { return r.comp === s.comp; }).length >= 5;
      if (S.mode === "internal-resistance") return uniq(rows.filter(function (r) { return r.R != null; }).map(function (r) { return r.R; })) >= 5;
      if (S.mode === "network-cells") return rows.some(function (r) { return r.cells === "series"; }) && rows.some(function (r) { return r.cells === "parallel"; }) && uniq(rows.map(function (r) { return r.R_eq; })) >= 4;
      if (S.mode === "galvanometer") return rows.some(function (r) { return r.conv === "ammeter"; }) && rows.some(function (r) { return r.conv === "voltmeter"; });
      return rows.some(function (r) { return r.kind === "bridge"; }) && rows.some(function (r) { return r.kind === "potentiometer"; });
    }
    function takeReading() {
      var s = P();
      if (S.mode === "ohms-law") {
        var o = solveOhms(Object.assign(ohmArgs(), { key: true }));
        if (!s.key) dyn.keyFlash = 1.2;
        return record({ comp: s.comp, L: s.L, d: s.d, Rh: s.Rh, I: r2(o.I), V: r2(o.V), ratio: r2(o.V / o.I) });
      }
      if (S.mode === "internal-resistance") {
        var q = solveIR(irArgs());
        return record(s.key ? { R: s.R, I: r2(q.I), V: r2(q.V), lost: r2(q.lost) } : { R: null, I: 0, V: r2(q.V), lost: r2(s.E - q.V), open: true });
      }
      if (S.mode === "network-cells") {
        var w = solveNetwork(netArgs());
        return record({ setup: (s.cells === "single" ? "1 cell" : s.n + " cells " + s.cells) + ", " + s.net, cells: s.cells, net: s.net, R_eq: r2(w.R_eq), I: r2(w.I), P: r2(w.P), eta: r1(w.eta * 100) });
      }
      if (S.mode === "galvanometer") return build();
      return findBalance();
    }
    function build() {
      if (S.mode !== "galvanometer") return false;
      var s = P(), a = galvArgs(), o = solveGalv(a);
      var row = { conv: s.conv, Ig_mA: s.Ig * 1000, Rg: s.Rg, range: a.range, unit: s.conv === "voltmeter" ? "V" : "A",
        R_s: o.R_s != null ? sf3(o.R_s) : null, R_m: o.R_m != null ? sf3(o.R_m) : null, R_meter: sf3(o.R_meter), test: a.test, indicated: Math.round(o.indicated * 1000) / 1000 };
      return record(row, "built");
    }
    function reading() {
      solve();
      var s = P(), base = { mode: S.mode, rows: S.rows[S.mode].slice(), done: isDone(), controls: clone(s), busy: !!S.busy }, c = cur, d = {};
      if (S.mode === "ohms-law") d = { comp: s.comp, material: c.material, L_cm: s.L, d_mm: s.d, rho: c.rho, A_m2: c.A_m2, R_wire: s.comp === "lamp" ? null : c.R_cold, R_component: c.R_component,
        E: s.E, r: s.r, Rh: s.Rh, key: !!(s.key || dyn.keyFlash > 0), I: c.I, V: c.V, ratio: c.ratio, P: c.P, lampT: c.lampT, dT: dyn.dT };
      else if (S.mode === "internal-resistance") d = { E: s.E, r: s.r, R: s.R, key: !!s.key, I: c.I, V: c.V, lost: c.lost, r_apparent: c.r_apparent, P_load: c.P_load, P_lost: c.P_lost };
      else if (S.mode === "network-cells") { d = Object.assign({}, c); d.eta_pct = c.eta * 100; d.key = s.key; }
      else if (S.mode === "galvanometer") d = Object.assign({}, c);
      else { d = Object.assign({}, c); d.l = kits[S.mode].board.userData.getL(); d.balanced = Math.abs(c.I_G || 0) < 2e-5; }
      d.errors = clone(s.errors || {});
      for (var key in d) base[key] = d[key];
      return base;
    }

    /* ---------- state ---------- */
    function setState(o) {
      o = o || {};
      if (o.onEvent) S.onEvent = o.onEvent;
      if (o.labels != null) { S.labels = !!o.labels; if (labelGroup) labelGroup.visible = S.labels; }
      if (o.preset && PRESETS[o.preset]) o = Object.assign({}, PRESETS[o.preset], o);
      if (o.mode) { if (o.mode === "null" && !o.sub) o.sub = "potentiometer"; setMode(o.mode); }
      if (o.reset) { reset(); return; }
      var s = P(), keyBefore = s.key;
      for (var k in o) {
        if (k === "mode" || k === "preset" || k === "onEvent" || k === "labels" || k === "reset") continue;
        if (k === "errors") { s.errors = Object.assign({}, s.errors, o.errors); continue; }
        if (!(k in s)) continue;
        s[k] = o[k];
      }
      if (S.mode === "ohms-law") { s.L = Math.max(20, Math.min(100, +s.L)); s.Rh = Math.max(0.5, Math.min(30, +s.Rh)); }
      if (S.mode === "internal-resistance") { s.R = Math.max(0.5, Math.min(30, +s.R)); }
      if (S.mode === "bridge-potentiometer") { s.l = Math.max(0, Math.min(100, +s.l)); if ("cell" in o && !("E" in o)) { s.E = null; s.r = null; } if ("driver" in o || "sub" in o) dyn.fall = 0; }
      if (S.mode === "galvanometer" && ("conv" in o || "rangeA" in o || "rangeV" in o) && !("test" in o)) s.test = null;
      if (s.key !== keyBefore) emit("key", { closed: !!s.key });
      applyStatic(false);
      var topo = ["comp", "E", "cells", "net", "conv", "sub", "driver", "cell", "R", "R1", "R2", "R3", "Rx", "Ru", "Rshunt", "Ig", "rangeA", "rangeV", "mode", "preset"];
      if (topo.some(function (t) { return t in o; })) rewire();
      emit("state", { mode: S.mode, controls: clone(s) });
    }
    function reset() {
      S.per[S.mode] = clone(DEFAULTS[S.mode]); S.rows[S.mode] = []; S.doneSent[S.mode] = false; S.busy = null;
      for (var k in dyn) dyn[k] = 0;
      applyStatic(true); rewire(); emit("reset", { mode: S.mode });
    }

    /* ---------- highlight, framing, picking ---------- */
    function clearHighlight() { S.hlSaved.forEach(function (h) { h.mesh.material = h.orig; }); S.hlSaved = []; S.hl = null; }
    function highlight(name, colorHex) {
      clearHighlight(); if (!name || !parts[name]) return false;
      var col = new THREE.Color(colorHex != null ? colorHex : 0xffd166);
      parts[name].traverse(function (o) {
        if (o.isMesh && o.material && !Array.isArray(o.material) && o.material.emissive && o !== top) {
          var c = o.material.clone(); S.hlSaved.push({ mesh: o, orig: o.material }); c.emissive = col.clone(); c.emissiveIntensity = 0.5; o.material = c;
        }
      });
      S.hl = name; return true;
    }
    function viewFor(name) {
      g.updateMatrixWorld(true);
      var obj = (name && name !== "all" && name !== "bench" && parts[name]) ? parts[name] : groups[S.mode];
      var box = visibleBox(obj), c = box.getCenter(new V3()), sz = box.getSize(new V3());
      g.worldToLocal(c);
      var all = obj === groups[S.mode];
      if (all) { var R = Math.max(sz.x, sz.z * 1.25) / 2; return { target: [c.x, 0.2, c.z + 0.1], dist: R * 2.3 + 0.5, pitch: 0.95, yawPortrait: 0 }; }
      var m = Math.max(sz.x, sz.y, sz.z);
      return { target: [c.x, c.y, c.z], dist: Math.max(1.3, m * 1.7 + 0.6), pitch: name === "coil" || name === "pointer" || name === "scale" || name === "hairspring" ? 1.05 : 0.62, yawPortrait: 0 };
    }
    function visibleBox(obj) {
      var box = new THREE.Box3(), tmp = new THREE.Box3();
      obj.traverseVisible(function (o) {
        if (!o.isMesh || o.isSprite || o === beads || o === top) return;
        var geo = o.geometry; if (!geo.boundingBox) geo.computeBoundingBox();
        tmp.copy(geo.boundingBox).applyMatrix4(o.matrixWorld); box.union(tmp);
      });
      if (box.isEmpty()) box.setFromObject(obj);
      return box;
    }
    function pickPart(raycaster) {
      var hits = raycaster.intersectObjects(g.children, true);
      for (var i = 0; i < hits.length; i++) {
        var o = hits[i].object; if (!o.visible || o.isSprite || o === beads) continue;
        var vis = true; o.traverseAncestors(function (a) { if (!a.visible) vis = false; }); if (!vis) continue;
        var id = o.userData && o.userData.partId; if (id && id !== "bench" && parts[id]) return id;
      }
      return null;
    }
    function triangles() {
      var n = 0; g.updateMatrixWorld(true);
      g.traverseVisible(function (o) {
        if (!o.isMesh || o.isSprite) return;
        var geo = o.geometry, tris = geo.index ? geo.index.count / 3 : geo.attributes.position.count / 3;
        n += o.isInstancedMesh ? tris * o.count : tris;
      });
      return Math.round(n);
    }

    g.userData.parts = parts; g.userData.update = update; g.userData.setState = setState;
    g.group = g; g.parts = parts; g.tick = update; g.update = update; g.setState = setState;
    g.reading = reading; g.takeReading = takeReading; g.findBalance = findBalance; g.build = build; g.reset = reset;
    g.highlight = highlight; g.clearHighlight = clearHighlight; g.viewFor = viewFor; g.pickPart = pickPart; g.triangles = triangles;
    g.setMode = function (m) { setState({ mode: m }); }; g.getMode = function () { return S.mode; };
    g.setKey = function (closed) { setState({ key: !!closed }); }; g.setJockey = function (l) { setState({ l: l }); };
    g.model = model;

    var init = Object.assign({}, opts); delete init.onEvent; delete init.labels;
    var m0 = opts.mode === "null" ? "bridge-potentiometer" : opts.mode;
    setMode(MODES.indexOf(m0) >= 0 ? m0 : "ohms-law");
    if (opts.mode === "null" && !init.sub) init.sub = "potentiometer";
    delete init.mode; if (Object.keys(init).length) setState(init);
    update(0.016, 0);
    return g;
  }

  /* pulsing emissive highlight on named parts (partId) anywhere in a scene */
  function makeHighlighter(scene) {
    var saved = [];
    function clear() { saved.forEach(function (s) { s.mesh.material = s.orig; }); saved.length = 0; }
    function highlight(name, colorHex) {
      clear(); if (!name || !scene) return;
      var col = new THREE.Color(colorHex != null ? colorHex : 0xffd166);
      scene.traverse(function (o) {
        if (o.isMesh && o.userData && o.userData.partId === name && o.material && !Array.isArray(o.material) && o.material.emissive) {
          var c = o.material.clone(); saved.push({ mesh: o, orig: o.material }); c.emissive = col.clone(); c.emissiveIntensity = 0.55; o.material = c;
        }
      });
    }
    return { highlight: highlight, clear: clear };
  }

  window.DcCircuitBench = {
    version: 2, create: create, makeHighlighter: makeHighlighter, model: model, modes: MODES.slice(), presets: PRESETS, drivers: DRIVERS, testCells: TEST_CELLS,
    builders: { meter: meter, glassAccumulator: glassAccumulator, blockBattery: blockBattery, rheostat: rheostat, plugKey: plugKey, wireBoard: wireBoard,
      filamentLamp: filamentLamp, resistanceBox: resistanceBox, coilResistor: coilResistor, bridgeBoard: bridgeBoard, galvanometer: galvDemo, junction: junction }
  };

  /* ---------- v1 API kept (same names, same return fields), now built from the v2 apparatus ---------- */
  function createAccumulatorCell(T, opts) {
    opts = opts || {};
    var b = blockBattery({ caps: 6, label: opts.label || "12 V", color: opts.caseColor || 0x1e293b });
    b.scale.setScalar(0.5);
    var hm = b.userData.heatMat; hm.opacity = 0.35; hm.emissiveIntensity = 0.25;
    b.userData.rGlowMat = hm;
    return b;
  }
  function createAnalogMeter(T, opts) {
    opts = opts || {};
    var m = meter({ unit: opts.unit || "A", range: opts.range || 1, needleColor: opts.needleColor || 0x3ee6c4, centreZero: !!opts.centreZero });
    m.scale.setScalar(0.58);
    var ud = m.userData, set = ud.setFraction;
    ud.setFraction = function (frac) { set(frac); ud.snap(); };
    return m;
  }
  window.DCCircuitKit = { version: 2, createAccumulatorCell: createAccumulatorCell, createAnalogMeter: createAnalogMeter, bench: window.DcCircuitBench };
})();
