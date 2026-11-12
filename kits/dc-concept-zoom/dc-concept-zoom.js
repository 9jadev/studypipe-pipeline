/* ==========================================================
   StudyPipe Kit: dc-concept-zoom (v1)
   Five 3D concept close-ups for current electricity (SS2 "Ohm's Law & Current Electricity").
   Classic script (no modules), 100 % offline, no fetch, no external textures. Needs window.THREE (r160 bundle);
   window.SceneKit is optional (mount the group on stage.rig).

   window.DcConceptZoom.create(opts) -> THREE.Group g with
     g.group / g.parts / g.userData.parts   named parts of the CURRENT mode (each mesh tagged userData.partId)
     g.tick / g.update / g.userData.update(dt, t)
     g.setState(obj)        { mode, labels, speed, onEvent, reset, ...mode params } (see README)
     g.setMode(mode)        "lattice" | "cell" | "node" | "coil" | "ramp"
     g.reading()            numbers of the current mode, computed from DcConceptZoom.model (never typed text)
     g.findBalance()        ramp: slide the jockey to the null point (emits "balance"); false if beyond the wire
     g.highlight(part)      pulsing emissive highlight (null clears)
     g.viewFor(part)        { target:[x,y,z], dist, pitch }  camera framing
     g.pickPart(raycaster)  -> partId | null
     g.triangles()          triangle count of the visible mode
     g.reset()
   Modes
     lattice  copper lattice cut-away: ions vibrate (amplitude grows with T), free electrons drift AGAINST the
              conventional current and collide with the ions (collision rate ∝ resistivity ρ(T)).
     cell     lead-acid battery cut-away (compartments in series, PbO2 + / Pb − plates, H+ and sulphate ions),
              external load and key, energy-per-coulomb bar  E = V + Ir.
     node     junction: tube-guided charge beads split I1 : I2 = R2 : R1 and rejoin (in = out at every node),
              power bar  EI = I1²R1 + I2²R2 (+ I²Rs) + I²r.
     coil     moving-coil galvanometer in a radial field (pole pieces, soft-iron core, coil on a former,
              hairsprings, pointer ∝ coil current) + copper shunt strip (ammeter) or multiplier bobbin (voltmeter).
     ramp     potentiometer slide wire under a sloping potential "ramp" (V_AJ = k l), EMF level line, centre-zero
              galvanometer ∝ (E − k l), test-cell bar E = V + Ir (Ir = 0 at the null point).
   ========================================================== */
(function () {
  "use strict";

  /* ===================================================================
     1. THE PHYSICS MODEL (pure functions; the only source of readings)
     =================================================================== */
  var CU = { rho20: 1.7e-8, alpha: 3.9e-3, n: 8.5e28 };   // copper: resistivity at 20 °C, temp. coeff., free electrons m^-3
  var QE = 1.60e-19, ME = 9.11e-31;
  var D_REF = 0.30;                                         // mm: R_rel is measured against a 0.30 mm wire at 20 °C
  var THETA_MAX = 100;                                      // degrees of full-scale deflection (coil mode)
  var CELL_EMF = 2.0;                                       // V per lead-acid cell (visual compartment count only)

  function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
  function sf(x, n) { if (!isFinite(x) || x === 0) return x; var p = Math.pow(10, (n || 3) - 1 - Math.floor(Math.log10(Math.abs(x)))); return Math.round(x * p) / p; }
  function rd(x, d) { var p = Math.pow(10, d); return Math.round(x * p) / p; }

  /* lattice: Drude picture. v = I/(nAe); collision rate 1/tau = n e² rho / m; R per metre = rho/A */
  function solveLattice(p) {
    var d = p.d_mm / 1000, A = Math.PI * d * d / 4, alpha = p.alpha != null ? p.alpha : CU.alpha;
    var rho = CU.rho20 * (1 + alpha * (p.T_C - 20));
    var Aref = Math.PI * Math.pow(D_REF / 1000, 2) / 4;
    var v = p.I_A / (CU.n * A * QE);                       // m/s
    var coll = CU.n * QE * QE * rho / ME;                  // per electron per second
    var Rpm = rho / A;
    return {
      mode: "lattice", d_mm: p.d_mm, T_C: p.T_C, I_A: p.I_A,
      drift_mm_s: sf(v * 1000, 3), collisions_per_s: sf(coll, 2), rho: sf(rho, 3),
      R_per_m: sf(Rpm, 3), R_rel: sf(Rpm / (CU.rho20 / Aref), 3), heat_W_per_m: sf(p.I_A * p.I_A * Rpm, 3),
      n_per_m3: CU.n, raw: { v: v, coll: coll, rho: rho, Rpm: Rpm, heat: p.I_A * p.I_A * Rpm }
    };
  }
  /* cell: open key -> I = 0, V = E; closed -> I = E/(R + r), V = E - Ir = IR */
  function solveCell(p) {
    var I = p.closed ? p.E / (p.R + p.r) : 0, V = p.E - I * p.r, lost = I * p.r;
    return {
      mode: "cell", E: p.E, r: p.r, R: p.R, closed: !!p.closed,
      I: rd(I, 2), V: rd(V, 2), lost: rd(lost, 2), V_check: rd(I * p.R, 2),
      P_total: sf(p.E * I, 3), P_ext: sf(I * I * p.R, 3), P_int: sf(I * I * p.r, 3),
      eta: p.closed ? rd(100 * p.R / (p.R + p.r), 1) : null,
      nCells: clamp(Math.round(p.E / CELL_EMF), 1, 6), raw: { I: I, V: V, lost: lost }
    };
  }
  /* node: cell (E, r) -> optional series Rs -> R1 // R2 */
  function solveNode(p) {
    var Rp = p.R1 * p.R2 / (p.R1 + p.R2), Rext = (p.Rs || 0) + Rp, I = p.E / (Rext + p.r);
    var I1 = I * p.R2 / (p.R1 + p.R2), I2 = I * p.R1 / (p.R1 + p.R2);
    var P1 = I1 * I1 * p.R1, P2 = I2 * I2 * p.R2, Ps = I * I * (p.Rs || 0), Pr = I * I * p.r;
    return {
      mode: "node", E: p.E, r: p.r, R1: p.R1, R2: p.R2, Rs: p.Rs || 0,
      R_par: sf(Rp, 3), R_ext: sf(Rext, 3), I: rd(I, 3), I1: rd(I1, 3), I2: rd(I2, 3),
      V_term: rd(p.E - I * p.r, 2), V_par: rd(I * Rp, 2),
      P_total: sf(p.E * I, 3), P1: sf(P1, 3), P2: sf(P2, 3), Ps: sf(Ps, 3), P_int: sf(Pr, 3),
      eta: rd(100 * Rext / (Rext + p.r), 1), raw: { I: I, I1: I1, I2: I2, P1: P1, P2: P2, Ps: Ps, Pr: Pr, EI: p.E * I }
    };
  }
  /* coil: ammeter shunt Rs = Ig Rg/(I - Ig); voltmeter multiplier Rm = V/Ig - Rg; deflection ∝ coil current */
  function solveCoil(p) {
    var Ig = p.I_g, Rg = p.R_g, conv = p.conversion, T = p.target, Rs = null, Rm = null, Rtot, fs, unit;
    if (conv === "ammeter" && T > Ig) { Rs = Ig * Rg / (T - Ig); Rtot = Rs * Rg / (Rs + Rg); fs = T; unit = "A"; }
    else if (conv === "voltmeter" && T > Ig * Rg) { Rm = T / Ig - Rg; Rtot = Rm + Rg; fs = T; unit = "V"; }
    else { conv = "none"; Rtot = Rg; fs = Ig; unit = "A"; }
    var x = p.value != null ? p.value : p.input * fs;      // applied current (A) or p.d. (V)
    var Ic, Iin, Ish = 0;
    if (conv === "ammeter") { Ic = x * Rs / (Rs + Rg); Iin = x; Ish = x - Ic; }
    else if (conv === "voltmeter") { Ic = x / (Rm + Rg); Iin = Ic; }
    else { Ic = x; Iin = x; }
    var frac = Ic / Ig;
    return {
      mode: "coil", conversion: conv, I_g: Ig, R_g: Rg, target: T, unit: unit, full_scale: fs,
      R_s: Rs == null ? null : sf(Rs, 3), R_m: Rm == null ? null : Math.round(Rm), R_m_3sf: Rm == null ? null : sf(Rm, 3),
      R_total: sf(Rtot, 4), applied: sf(x, 4), I_in: sf(Iin, 4), I_coil_mA: sf(Ic * 1000, 4), I_shunt: sf(Ish, 4),
      V_coil: sf(Ic * Rg, 3), shunt_pct: conv === "ammeter" && Iin > 0 ? rd(100 * Ish / Iin, 1) : 0,
      frac: rd(frac, 4), theta_deg: rd(clamp(frac, -0.03, 1.08) * THETA_MAX, 1), torque_rel: rd(frac, 3),
      scale_reading: sf(frac * fs, 3), over_range: frac > 1.0001, raw: { Rs: Rs, Rm: Rm, Ic: Ic, Iin: Iin, Ish: Ish, frac: frac }
    };
  }
  /* ramp: V_AJ = k l; galvanometer current I = (E - k l)/(r + Rg); null when k l = E */
  function solveRamp(p) {
    var Vl = p.k * p.l, diff = p.E_cell - Vl, I = diff / (p.r_cell + p.R_g), lbal = p.E_cell / p.k;
    return {
      mode: "ramp", k: p.k, E_cell: p.E_cell, l: rd(p.l, 1), V_l: sf(Vl, 3), diff: rd(diff, 3),
      I_g_mA: rd(I * 1000, 2), l_balance: lbal <= 100 ? rd(lbal, 1) : null, reachable: lbal <= 100,
      balanced: Math.abs(p.l - lbal) <= 0.05, V_wire: sf(p.k * 100, 3),
      V_terminal: rd(p.E_cell - I * p.r_cell, 3), lost: rd(I * p.r_cell, 3), raw: { Vl: Vl, diff: diff, I: I, lbal: lbal }
    };
  }

  var MODEL = { solveLattice: solveLattice, solveCell: solveCell, solveNode: solveNode, solveCoil: solveCoil, solveRamp: solveRamp,
    copper: CU, e: QE, m_e: ME, THETA_MAX: THETA_MAX, CELL_EMF: CELL_EMF };

  var DEFAULTS = {
    lattice: { d_mm: 0.30, T_C: 20, I_A: 1.0, alpha: CU.alpha },
    cell: { E: 12.0, r: 1.2, R: 2.8, closed: true },
    node: { E: 5.0, r: 0.5, R1: 6.0, R2: 12.0, Rs: 0 },
    coil: { I_g: 0.015, R_g: 18.0, conversion: "ammeter", target: 3.0, input: 1.0, value: null },
    ramp: { k: 0.0200, E_cell: 1.50, l: 50.0, r_cell: 1.0, R_g: 20.0, I_fs_mA: 10 }
  };
  var SOLVE = { lattice: solveLattice, cell: solveCell, node: solveNode, coil: solveCoil, ramp: solveRamp };

  if (typeof window !== "undefined") window.DcConceptZoom = { model: MODEL, defaults: DEFAULTS, version: 1 };
  if (typeof THREE === "undefined") return;
  var V3 = THREE.Vector3, TAU = Math.PI * 2;

  /* ===================================================================
     2. HELPERS (geometry, procedural textures, labels)
     =================================================================== */
  function rng(seed) { var s = (seed || 1) >>> 0; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  function srgb(tex) {
    if ("colorSpace" in tex && THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
    else if (THREE.sRGBEncoding) tex.encoding = THREE.sRGBEncoding;
    return tex;
  }
  function cnv(w, h) { var c = document.createElement("canvas"); c.width = w; c.height = h; return c; }
  function ctex(c, rx, ry) { var t = srgb(new THREE.CanvasTexture(c)); t.wrapS = t.wrapT = THREE.RepeatWrapping; if (rx) t.repeat.set(rx, ry || rx); return t; }
  function std(color, rough, extra) {
    var m = new THREE.MeshStandardMaterial({ color: color, roughness: rough == null ? 0.5 : rough, metalness: 0 });
    if (extra) for (var k in extra) m[k] = extra[k];
    return m;
  }
  function metal(color, rough, extra) { var m = std(color, rough == null ? 0.32 : rough, extra); m.metalness = 0.8; return m; }
  function glass(color, op) { return new THREE.MeshStandardMaterial({ color: color || 0xdfefff, roughness: 0.08, metalness: 0, transparent: true, opacity: op || 0.2, depthWrite: false, side: THREE.DoubleSide }); }
  function tagPart(obj, key) {
    if (!obj) return obj;
    obj.userData = obj.userData || {}; obj.userData.partId = key;
    if (obj.traverse) obj.traverse(function (c) { c.userData = c.userData || {}; if (!c.userData.partId) c.userData.partId = key; });
    return obj;
  }
  function mesh(geo, mat, x, y, z) { var m = new THREE.Mesh(geo, mat); if (x != null) m.position.set(x, y, z); return m; }
  function rrPath(P, cx, cy, w, h, r) {
    var x = cx - w / 2, y = cy - h / 2;
    P.moveTo(x + r, y); P.lineTo(x + w - r, y); P.quadraticCurveTo(x + w, y, x + w, y + r);
    P.lineTo(x + w, y + h - r); P.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    P.lineTo(x + r, y + h); P.quadraticCurveTo(x, y + h, x, y + h - r);
    P.lineTo(x, y + r); P.quadraticCurveTo(x, y, x + r, y);
    return P;
  }
  function rr(w, h, r) { return rrPath(new THREE.Shape(), 0, 0, w, h, r); }
  /* slab lying on y = 0 (shape x -> x, shape y -> -z), top at y = thick */
  function slab(shape, thick, bevel) {
    var b = bevel || 0;
    var g = new THREE.ExtrudeGeometry(shape, { depth: thick - 2 * b > 0.001 ? thick - 2 * b : 0.001, bevelEnabled: b > 0, bevelSize: b, bevelThickness: b, bevelSegments: 2, curveSegments: 8 });
    g.rotateX(-Math.PI / 2); g.translate(0, b, 0);
    return g;
  }
  /* front-facing plate: shape in xy, extruded along z, centred on z = 0 */
  function plate(shape, depth, bevel) {
    var b = bevel || 0;
    var g = new THREE.ExtrudeGeometry(shape, { depth: Math.max(0.001, depth - 2 * b), bevelEnabled: b > 0, bevelSize: b, bevelThickness: b, bevelSegments: 2, curveSegments: 18 });
    g.translate(0, 0, -depth / 2 + b);
    return g;
  }
  function planarUV(geo, axisA, axisB, sa, sb, oa, ob) {
    var p = geo.attributes.position, uv = new Float32Array(p.count * 2), ga = "get" + axisA.toUpperCase(), gb = "get" + axisB.toUpperCase();
    for (var i = 0; i < p.count; i++) { uv[i * 2] = (p[ga](i) - (oa || 0)) * sa; uv[i * 2 + 1] = (p[gb](i) - (ob || 0)) * sb; }
    geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
    return geo;
  }
  /* polyline with rounded corners as a Curve (straight runs stay straight) */
  function roundedPath(pts, rad) {
    var P = [], path = new THREE.CurvePath();
    pts.forEach(function (a) { var v = new V3(a[0], a[1], a[2]); if (!P.length || v.distanceTo(P[P.length - 1]) > 1e-4) P.push(v); });
    if (P.length < 2) P.push(P[0].clone().add(new V3(1e-3, 0, 0)));
    var cur = P[0].clone();
    for (var i = 1; i < P.length; i++) {
      var a = P[i - 1], b = P[i], c = P[i + 1];
      if (!c) { path.add(new THREE.LineCurve3(cur.clone(), b.clone())); break; }
      var d1 = new V3().subVectors(b, a), d2 = new V3().subVectors(c, b);
      var r = Math.min(rad, d1.length() / 2, d2.length() / 2);
      var p1 = b.clone().addScaledVector(d1.normalize(), -r), p2 = b.clone().addScaledVector(d2.normalize(), r);
      if (cur.distanceTo(p1) > 1e-4) path.add(new THREE.LineCurve3(cur.clone(), p1));
      path.add(new THREE.QuadraticBezierCurve3(p1, b.clone(), p2));
      cur = p2;
    }
    return path;
  }
  function tubeOn(curve, r, segs, radSegs, mat) { var m = new THREE.Mesh(new THREE.TubeGeometry(curve, segs || 48, r, radSegs || 8, false), mat); m.userData.curve = curve; return m; }
  function helixCurve(x0, x1, rad, turns, y, z) {
    var pts = [], N = Math.max(16, Math.round(turns * 14));
    for (var i = 0; i <= N; i++) { var u = i / N, a = u * turns * TAU; pts.push(new V3(x0 + (x1 - x0) * u, y + Math.cos(a) * rad, z + Math.sin(a) * rad)); }
    return new THREE.CatmullRomCurve3(pts);
  }
  function lathe(profile, segs) { return new THREE.LatheGeometry(profile.map(function (p) { return new THREE.Vector2(p[0], p[1]); }), segs || 24); }

  /* ---------- procedural textures (deterministic) ---------- */
  var TEX = {};
  function once(key, fn) { return TEX[key] || (TEX[key] = fn()); }
  function brushedTex(base, seed) {
    return once("brush" + base + seed, function () {
      var c = cnv(256, 64), x = c.getContext("2d"), R = rng(seed || 3);
      x.fillStyle = base; x.fillRect(0, 0, 256, 64);
      for (var i = 0; i < 220; i++) { var y = R() * 64; x.strokeStyle = "rgba(" + (R() < 0.5 ? "255,255,255," : "0,0,0,") + (0.05 + R() * 0.1) + ")"; x.lineWidth = 0.6 + R(); x.beginPath(); x.moveTo(0, y); x.lineTo(256, y + (R() - 0.5) * 2); x.stroke(); }
      return ctex(c, 2, 1);
    });
  }
  function woodTex() {
    return once("wood", function () {
      var c = cnv(512, 128), x = c.getContext("2d"), R = rng(11);
      x.fillStyle = "#9a6a3c"; x.fillRect(0, 0, 512, 128);
      for (var i = 0; i < 70; i++) {
        var y = R() * 128, a = 0.05 + R() * 0.12; x.strokeStyle = "rgba(60,30,10," + a + ")"; x.lineWidth = 0.8 + R() * 2.2;
        x.beginPath(); x.moveTo(0, y); for (var s = 0; s <= 512; s += 32) x.lineTo(s, y + Math.sin(s / 60 + i) * 3 + (R() - 0.5) * 2); x.stroke();
      }
      return ctex(c, 1, 1);
    });
  }
  function plusTex(sign, bg, fg) {
    return once("sign" + sign + bg, function () {
      var c = cnv(128, 64), x = c.getContext("2d"); x.fillStyle = bg; x.fillRect(0, 0, 128, 64);
      var g = x.createRadialGradient(32, 32, 2, 32, 32, 40); g.addColorStop(0, "rgba(255,255,255,0.35)"); g.addColorStop(1, "rgba(0,0,0,0.15)");
      x.fillStyle = g; x.fillRect(0, 0, 128, 64);
      x.fillStyle = fg; [32, 96].forEach(function (cx) { x.fillRect(cx - 11, 29, 22, 6); if (sign === "+") x.fillRect(cx - 3, 21, 6, 22); });
      return ctex(c);
    });
  }
  function plateTex(pos) {
    return once("plate" + pos, function () {
      var c = cnv(128, 128), x = c.getContext("2d"), R = rng(pos ? 21 : 22);
      x.fillStyle = pos ? "#4a2617" : "#7d848c"; x.fillRect(0, 0, 128, 128);
      for (var i = 0; i < 900; i++) { var v = R(); x.fillStyle = pos ? "rgba(" + (90 + v * 50 | 0) + "," + (45 + v * 25 | 0) + ",25,0.5)" : "rgba(" + (150 + v * 60 | 0) + "," + (155 + v * 60 | 0) + "," + (165 + v * 55 | 0) + ",0.45)"; x.fillRect(R() * 128, R() * 128, 2, 2); }
      x.strokeStyle = pos ? "#2b170e" : "#5a6066"; x.lineWidth = 4;     // cast lead-alloy grid
      for (var g = 0; g <= 128; g += 21.3) { x.beginPath(); x.moveTo(g, 0); x.lineTo(g, 128); x.stroke(); x.beginPath(); x.moveTo(0, g); x.lineTo(128, g); x.stroke(); }
      return ctex(c, 1, 1);
    });
  }
  /* wound wire: stripes that vary along the texture v axis (TubeGeometry: around the tube; LatheGeometry: along the axis) */
  function windTex(color, n) {
    var key = "wind" + color + n;
    if (TEX[key]) return TEX[key];
    var c = cnv(8, 32), x = c.getContext("2d"), g = x.createLinearGradient(0, 0, 0, 32);
    g.addColorStop(0, "#000"); g.addColorStop(0.5, color); g.addColorStop(1, "#000");
    x.fillStyle = color; x.fillRect(0, 0, 8, 32); x.globalAlpha = 0.55; x.fillStyle = g; x.fillRect(0, 0, 8, 32);
    x.globalAlpha = 0.35; x.fillStyle = "#fff"; x.fillRect(0, 13, 8, 3);
    var t = ctex(c, 1, n); TEX[key] = t; return t;
  }
  function glowTex(rgb) {
    return once("glow" + rgb, function () {
      var c = cnv(64, 64), x = c.getContext("2d"), g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, "rgba(" + rgb + ",1)"); g.addColorStop(0.35, "rgba(" + rgb + ",0.55)"); g.addColorStop(1, "rgba(" + rgb + ",0)");
      x.fillStyle = g; x.fillRect(0, 0, 64, 64); return srgb(new THREE.CanvasTexture(c));
    });
  }
  function rrCtx(x, X, Y, w, h, r) { x.beginPath(); x.moveTo(X + r, Y); x.arcTo(X + w, Y, X + w, Y + h, r); x.arcTo(X + w, Y + h, X, Y + h, r); x.arcTo(X, Y + h, X, Y, r); x.arcTo(X, Y, X + w, Y, r); x.closePath(); }

  /* short text sprite (≤ ~20 characters). sp.userData.setText(t) re-draws it */
  function makeLabel(text, color, size) {
    var c = cnv(400, 64), x = c.getContext("2d"), tex = srgb(new THREE.CanvasTexture(c));
    var mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false, depthWrite: false });
    var sp = new THREE.Sprite(mat); sp.renderOrder = 20; sp.userData.isLabel = true; sp.userData.partId = "label";
    var last = null, h = size || 0.3;
    function set(t) {
      if (t === last) return; last = t;
      x.clearRect(0, 0, 400, 64); x.font = "600 30px system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
      var w = Math.min(392, x.measureText(t).width + 24);
      x.fillStyle = "rgba(10,16,24,0.74)"; rrCtx(x, (400 - w) / 2, 8, w, 48, 12); x.fill();
      x.fillStyle = color || "#eef3f8"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText(t, 200, 33);
      tex.needsUpdate = true;
    }
    set(text); sp.scale.set(h * 6.25, h, 1); sp.userData.setText = set;
    return sp;
  }
  /* flat arrow pointing +x, length L, lying in the xy plane */
  function arrowGeo(L, w, head) {
    var s = new THREE.Shape(), hw = w / 2, hl = head || w * 1.8;
    s.moveTo(0, -hw); s.lineTo(L - hl, -hw); s.lineTo(L - hl, -hw * 2.3); s.lineTo(L, 0); s.lineTo(L - hl, hw * 2.3); s.lineTo(L - hl, hw); s.lineTo(0, hw); s.lineTo(0, -hw);
    return plate(s, 0.05, 0.012);
  }
  /* lathe binding post (brass, knurled cap) standing on y = 0 */
  function bindingPost(ringColor, scale) {
    var g = new THREE.Group(), s = scale || 1;
    var brass = metal(0xc9a24a, 0.3, { map: brushedTex("#c9a24a", 5) });
    g.add(mesh(lathe([[0, 0], [0.13, 0], [0.13, 0.05], [0.07, 0.07], [0.06, 0.24], [0.0, 0.24]].map(function (p) { return [p[0] * s, p[1] * s]; }), 20), brass));
    var cap = mesh(lathe([[0, 0], [0.11, 0], [0.12, 0.03], [0.12, 0.12], [0.1, 0.15], [0, 0.16]].map(function (p) { return [p[0] * s, p[1] * s]; }), 16), std(ringColor, 0.45));
    cap.position.y = 0.2 * s; g.add(cap);
    return g;
  }
  function countTris(obj) {
    var n = 0;
    obj.traverse(function (o) {
      if (!o.isMesh || !o.visible) return;
      var vis = true, p = o; while (p) { if (p.visible === false) { vis = false; break; } p = p.parent; } if (!vis) return;
      var g = o.geometry, t = g.index ? g.index.count / 3 : g.attributes.position.count / 3;
      n += t * (o.isInstancedMesh ? o.count : 1);
    });
    return Math.round(n);
  }
  function disposeTree(o) {
    o.traverse(function (c) { if (c.geometry) c.geometry.dispose(); });
  }
  /* flash pool (additive glow sprites that fade) */
  function flashPool(parent, n, rgb, size) {
    var mat = new THREE.SpriteMaterial({ map: glowTex(rgb), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
    var pool = [];
    for (var i = 0; i < n; i++) { var s = new THREE.Sprite(mat.clone()); s.visible = false; s.scale.setScalar(size); s.userData.life = 0; s.userData.partId = "flash"; parent.add(s); pool.push(s); }
    var k = 0;
    return {
      fire: function (x, y, z, sc) { var s = pool[k++ % n]; s.position.set(x, y, z); s.visible = true; s.userData.life = 1; s.userData.sc = sc || size; },
      update: function (dt) { pool.forEach(function (s) { if (!s.visible) return; s.userData.life -= dt * 3.2; if (s.userData.life <= 0) { s.visible = false; return; } s.material.opacity = s.userData.life; s.scale.setScalar(s.userData.sc * (1.4 - 0.5 * s.userData.life)); }); },
      clear: function () { pool.forEach(function (s) { s.visible = false; }); }
    };
  }
  /* instanced beads riding along curves */
  var _m4 = new THREE.Matrix4(), _q = new THREE.Quaternion(), _s1 = new V3(1, 1, 1), _p = new V3();
  function setInst(im, i, x, y, z, s) { _p.set(x, y, z); _s1.setScalar(s == null ? 1 : s); _m4.compose(_p, _q, _s1); im.setMatrixAt(i, _m4); }

  /* ===================================================================
     3. MODE "lattice" - cut-away copper wire: vibrating ions, drifting electrons
     =================================================================== */
  function buildLattice(ctx) {
    var G = new THREE.Group(), parts = {}, L = 6.0, X0 = -3.0, A = 0.40, WY = 1.25, MAXI = 420, MAXE = 90;
    var W = new THREE.Group(); W.position.y = WY; G.add(W);
    var shellMat = metal(0xd08a5a, 0.38, { map: brushedTex("#d08a5a", 7), side: THREE.DoubleSide, emissive: new THREE.Color(0xff3a10), emissiveIntensity: 0 });
    var faceMat = metal(0xc98050, 0.35, { map: brushedTex("#c98050", 9), side: THREE.DoubleSide });
    var pvcMat = std(0xb8322a, 0.62, { side: THREE.DoubleSide });
    var pvcCut = std(0xd9564a, 0.8, { side: THREE.DoubleSide });
    var ionMat = std(0xffffff, 0.4, { metalness: 0.25, map: plusTex("+", "#c27a45", "#fff6e6"), emissive: new THREE.Color(0xff4a1a), emissiveIntensity: 0 });
    var eMat = std(0x3d8bff, 0.3, { emissive: new THREE.Color(0x2a7bff), emissiveIntensity: 1.0 });
    var ions = new THREE.InstancedMesh(new THREE.SphereGeometry(0.1, 10, 7), ionMat, MAXI);
    var elec = new THREE.InstancedMesh(new THREE.SphereGeometry(0.055, 8, 6), eMat, MAXE);
    ions.frustumCulled = false; elec.frustumCulled = false;
    W.add(ions); W.add(elec);
    var shell = mesh(new THREE.BufferGeometry(), shellMat), face = mesh(new THREE.BufferGeometry(), faceMat), faceL = mesh(new THREE.BufferGeometry(), faceMat);
    var pvc = new THREE.Group(), pvcBody = mesh(new THREE.BufferGeometry(), pvcMat); pvc.add(pvcBody);
    W.add(shell); W.add(face); W.add(faceL); W.add(pvc);
    var flashes = flashPool(W, 18, "255,214,120", 0.36);

    /* conventional current arrow (+x) and electron drift arrow (-x), fixed above the wire */
    var arI = mesh(arrowGeo(2.0, 0.09), std(0xf59e0b, 0.4, { emissive: new THREE.Color(0xf59e0b), emissiveIntensity: 0.35 }));
    var arE = mesh(arrowGeo(2.0, 0.09), std(0x3d8bff, 0.4, { emissive: new THREE.Color(0x3d8bff), emissiveIntensity: 0.45 }));
    arE.rotation.z = Math.PI; G.add(arI); G.add(arE);
    var lbI = makeLabel("current I", "#ffd28a"), lbE = makeLabel("e⁻ drift", "#9cc6ff"), lbP = makeLabel("+ end", "#ff9c8f"), lbN = makeLabel("− end", "#cfd6de");
    [lbI, lbE, lbP, lbN].forEach(function (l) { G.add(l); ctx.labels.push(l); });

    var Rd = 0, ionList = [], eS = [], R = rng(5);
    function dispR(d) { return 0.5 + 0.55 * Math.sqrt(clamp((d - 0.3) / 0.9, 0, 1)); }
    function rebuild(d) {
      var r = dispR(d); if (Math.abs(r - Rd) < 1e-6) return; Rd = r;
      var g = new THREE.CylinderGeometry(Rd, Rd, L, 44, 1, true, Math.PI / 2, Math.PI); g.rotateZ(-Math.PI / 2);
      shell.geometry.dispose(); shell.geometry = g;
      var f = new THREE.CircleGeometry(Rd, 28, -Math.PI / 2, Math.PI); f.rotateY(Math.PI / 2); f.translate(L / 2, 0, 0);
      face.geometry.dispose(); face.geometry = f;
      var f2 = f.clone(); f2.translate(-L, 0, 0); faceL.geometry.dispose(); faceL.geometry = f2;
      /* PVC sleeve, stripped back 0.55 at each end so the bare copper shows */
      var t = 0.14, PL = L - 1.1;
      var pg = new THREE.CylinderGeometry(Rd + t, Rd + t, PL, 44, 1, true, Math.PI / 2, Math.PI); pg.rotateZ(-Math.PI / 2);
      pvcBody.geometry.dispose(); pvcBody.geometry = pg;
      while (pvc.children.length > 1) { var c = pvc.children.pop(); c.geometry.dispose(); }
      [-1, 1].forEach(function (s) {
        var ring = new THREE.RingGeometry(Rd, Rd + t, 26, 1, -Math.PI / 2, Math.PI); ring.rotateY(Math.PI / 2); ring.translate(s * PL / 2, 0, 0);
        pvc.add(mesh(ring, pvcCut));
        var strip = new THREE.PlaneGeometry(PL, t); strip.translate(0, s * (Rd + t / 2), 0); pvc.add(mesh(strip, pvcCut));
      });
      /* body-centred lattice inside the back half (z <= 0.06) */
      ionList = []; var rin = Rd - 0.08;
      for (var ix = 0; X0 + A / 2 + ix * A < X0 + L; ix++) {
        var x = X0 + A / 2 + ix * A, o = (ix % 2) * A / 2;
        for (var y = -rin + o; y <= rin; y += A) for (var z = -rin + o; z <= 0.06; z += A) {
          if (y * y + z * z > rin * rin || ionList.length >= MAXI) continue;
          ionList.push({ x: x, y: y, z: z, ph: [R() * TAU, R() * TAU, R() * TAU], w: [9 + R() * 4, 9 + R() * 4, 9 + R() * 4], k: new V3() });
        }
      }
      ions.count = ionList.length;
      var Ne = clamp(Math.round(70 * Rd * Rd), 18, MAXE); eS = [];
      for (var i = 0; i < Ne; i++) {
        var a = R() * Math.PI + Math.PI / 2, rr0 = Math.sqrt(R()) * (rin - 0.05);
        var e = { x: X0 + R() * L, y: Math.sin(a) * rr0, z: Math.min(0.03, Math.cos(a) * rr0), v: new V3() }; scatter(e); eS.push(e);
      }
      elec.count = eS.length;
      var top = WY + Rd + 0.16;
      arI.position.set(-2.7, top + 0.32, 0.1); arE.position.set(2.7, top + 0.32, 0.1);
      lbI.position.set(-1.7, top + 0.78, 0.1); lbE.position.set(1.7, top + 0.78, 0.1);
      lbP.position.set(-3.0, WY - Rd - 0.5, 0.1); lbN.position.set(3.0, WY - Rd - 0.5, 0.1);
    }
    function scatter(e) { var u = R() * 2 - 1, th = R() * TAU, s = Math.sqrt(1 - u * u); e.v.set(s * Math.cos(th), s * Math.sin(th), u); }

    var P = null, M = null, driftVis = 0.3, collVis = 1.6, amp = 0.03;
    function apply(p) {
      P = p; rebuild(p.d_mm); M = solveLattice(p);
      driftVis = clamp(0.5 * Math.sqrt(M.raw.v * 1000 / 1.04), 0.05, 1.3);            // visual drift ∝ sqrt(v) (thin wire is visibly faster)
      collVis = 1.6 * M.raw.rho / CU.rho20;                                          // collisions per electron per second ∝ rho(T)
      var TK = p.T_C + 273;
      amp = 0.03 * Math.pow(TK / 293, 2);                                            // physical amplitude ∝ sqrt(T); exaggerated so 20 -> 200 °C is visible
      var hot = clamp((p.T_C - 20) / 180, 0, 1), joule = clamp(M.raw.heat / 0.5, 0, 1);
      ionMat.emissiveIntensity = 0.18 * hot; shellMat.emissiveIntensity = 0.06 * hot + 0.06 * joule;   // a warm tint cue only: copper does not glow at 200 °C
    }
    var VT = 0.8, _k = new V3();
    function update(dt, t) {
      var rin = Rd - 0.12, i, e, n = ionList.length;
      for (i = 0; i < n; i++) {
        var io = ionList[i]; io.k.multiplyScalar(Math.exp(-6 * dt));
        setInst(ions, i, io.x + amp * Math.sin(io.w[0] * t + io.ph[0]) + io.k.x, io.y + amp * Math.sin(io.w[1] * t + io.ph[1]) + io.k.y, io.z + amp * Math.sin(io.w[2] * t + io.ph[2]) + io.k.z);
      }
      ions.instanceMatrix.needsUpdate = true;
      var pc = 1 - Math.exp(-collVis * dt);
      for (i = 0; i < eS.length; i++) {
        e = eS[i];
        e.x += (e.v.x * VT - driftVis) * dt; e.y += e.v.y * VT * dt; e.z += e.v.z * VT * dt;   // drift is towards -x: against the conventional current
        var rr2 = Math.sqrt(e.y * e.y + e.z * e.z);
        if (rr2 > rin) { var vn = (e.v.y * e.y + e.v.z * e.z) / rr2; e.y *= rin / rr2; e.z *= rin / rr2; if (vn > 0) { e.v.y -= 2 * vn * e.y / rin; e.v.z -= 2 * vn * e.z / rin; } }
        if (e.z > 0.05) { e.z = 0.05; e.v.z = -Math.abs(e.v.z); }
        if (e.x < X0) e.x += L; else if (e.x > X0 + L) e.x -= L;
        if (R() < pc && n) {                                                      // collision with the nearest ion
          var best = 0, bd = 1e9;
          for (var j = 0; j < n; j++) { var io2 = ionList[j], dx = io2.x - e.x, dy = io2.y - e.y, dz = io2.z - e.z, d2 = dx * dx + dy * dy + dz * dz; if (d2 < bd) { bd = d2; best = j; } }
          var hit = ionList[best]; _k.set(e.v.x - 0.6, e.v.y, e.v.z).multiplyScalar(0.05); hit.k.add(_k);
          flashes.fire(hit.x, hit.y, hit.z + 0.05, 0.34);
          scatter(e);
        }
        setInst(elec, i, e.x, e.y, e.z);
      }
      elec.instanceMatrix.needsUpdate = true;
      flashes.update(dt);
    }
    parts.wire = tagPart(new THREE.Group(), "wire"); [shell, face, faceL].forEach(function (m) { tagPart(m, "wire"); });
    parts.wire = shell; parts.insulation = tagPart(pvc, "insulation"); parts.ions = tagPart(ions, "ions"); parts.electrons = tagPart(elec, "electrons");
    parts.current = tagPart(arI, "current"); parts.drift = tagPart(arE, "drift");
    return {
      group: G, parts: parts, apply: apply, update: update, reading: function () { return solveLattice(P); },
      views: { all: [0, 1.3, 0, 8.6], wire: [0, 1.25, 0, 7.6], ions: [-0.6, 1.25, 0, 3.6], electrons: [0.6, 1.25, 0, 3.6], insulation: [2.4, 1.25, 0, 4.2], current: [-1.7, 2.3, 0, 4.6], drift: [1.7, 2.3, 0, 4.6] }
    };
  }

  /* ===================================================================
     4. Shared lead-acid battery (compartments in series), used by "cell", "node", "ramp"
        o.interior: plates, electrolyte and ions visible through a translucent case
     =================================================================== */
  function buildBattery(nC, o) {
    o = o || {};
    var g = new THREE.Group(), cw = 0.8, W = nC * cw + 0.2, D = 1.3, H = 1.9, parts = {};
    var caseMat = o.interior ? new THREE.MeshStandardMaterial({ color: 0xe4e9ee, roughness: 0.3, transparent: true, opacity: 0.15, depthWrite: false, side: THREE.DoubleSide })
                             : std(0x2b2f36, 0.55);
    var lidMat = std(0x24272d, 0.6), lead = metal(0x8d949c, 0.45, { map: brushedTex("#8d949c", 13) });
    var cs = rr(W, D, 0.1), cxs = [];
    for (var i = 0; i < nC; i++) { var cx = -W / 2 + 0.1 + cw * (i + 0.5); cxs.push(cx); if (o.interior) cs.holes.push(rrPath(new THREE.Path(), cx, 0, cw - 0.06, D - 0.12, 0.03)); }
    var caseM = mesh(slab(cs, H, 0.02), caseMat); caseM.renderOrder = 5; g.add(caseM);
    if (o.interior) g.add(mesh(slab(rr(W, D, 0.1), 0.08, 0.02), lidMat));
    var lid = mesh(slab(rr(W + 0.04, D + 0.04, 0.1), 0.14, 0.03), lidMat); lid.position.y = H; g.add(lid);
    if (!o.interior) {                                                     // moulded ribs and a label band on a closed case
      var band = mesh(new THREE.PlaneGeometry(W * 0.8, 0.5), std(0xd9c27a, 0.6)); band.position.set(0, H * 0.55, D / 2 + 0.006); g.add(band);
    }
    var capGeo = lathe([[0, 0], [0.12, 0], [0.13, 0.03], [0.12, 0.05], [0.13, 0.08], [0.12, 0.1], [0.09, 0.12], [0, 0.13]], 14);
    cxs.forEach(function (cx) { var c = mesh(capGeo, std(0x3a3f47, 0.5)); c.position.set(cx, H + 0.14, 0); g.add(c); });
    var postGeo = lathe([[0, 0], [0.12, 0], [0.11, 0.2], [0.09, 0.32], [0, 0.33]], 18);
    var xp = -W / 2 + 0.2, xn = W / 2 - 0.2;
    var pp = mesh(postGeo, lead), pn = mesh(postGeo, lead); pp.position.set(xp, H + 0.12, 0); pn.position.set(xn, H + 0.12, 0); g.add(pp); g.add(pn);
    var ringGeo = new THREE.TorusGeometry(0.15, 0.03, 8, 20); ringGeo.rotateX(Math.PI / 2);
    var rp = mesh(ringGeo, std(0xc0392b, 0.5)), rn = mesh(ringGeo, std(0x15171a, 0.5)); rp.position.set(xp, H + 0.16, 0); rn.position.set(xn, H + 0.16, 0); g.add(rp); g.add(rn);
    parts.case = tagPart(caseM, "case"); parts.plus = tagPart(pp, "plus"); parts.minus = tagPart(pn, "minus");
    var gaps = [];
    if (o.interior) {
      var pm = std(0xffffff, 0.85, { map: plateTex(true) }), nm = std(0xffffff, 0.6, { map: plateTex(false), metalness: 0.3 });
      var sepMat = new THREE.MeshStandardMaterial({ color: 0xf4f1e8, roughness: 0.9, transparent: true, opacity: 0.16, depthWrite: false });
      var elMat = new THREE.MeshStandardMaterial({ color: 0x8fc4e6, roughness: 0.1, transparent: true, opacity: 0.14, depthWrite: false });
      var ph = 1.35, pdep = D - 0.3, ys = 1.66, offs = [-0.27, -0.09, 0.09, 0.27];
      var plateGeo = new THREE.BoxGeometry(0.045, ph, pdep), sepGeo = new THREE.PlaneGeometry(pdep, ph * 0.98); sepGeo.rotateY(Math.PI / 2);
      var posG = new THREE.Group(), negG = new THREE.Group(), elG = new THREE.Group(), strapG = new THREE.Group();
      cxs.forEach(function (cx, ci) {
        offs.forEach(function (dx, k) {
          var pos = k % 2 === 0, m = mesh(plateGeo, pos ? pm : nm); m.position.set(cx + dx, 0.12 + ph / 2, 0); (pos ? posG : negG).add(m);
          var lug = mesh(new THREE.BoxGeometry(0.05, ys - (0.12 + ph), 0.09), lead); lug.position.set(cx + dx, (0.12 + ph + ys) / 2, pos ? 0.35 : -0.35); strapG.add(lug);
          if (k < 3) { var s = mesh(sepGeo, sepMat); s.position.set(cx + dx + 0.09, 0.12 + ph / 2, 0); elG.add(s);
            gaps.push({ ci: ci, xa: cx + dx + 0.03, xb: cx + dx + 0.15, posLeft: pos }); }
        });
        [[0.35, -0.27, 0.09], [-0.35, -0.09, 0.27]].forEach(function (sd) {   // + strap (front) and - strap (back)
          var st = mesh(new THREE.BoxGeometry(sd[2] - sd[1] + 0.08, 0.07, 0.1), lead); st.position.set(cx + (sd[1] + sd[2]) / 2, ys, sd[0]); strapG.add(st);
        });
        var el = mesh(new THREE.BoxGeometry(cw - 0.08, 1.48, D - 0.16), elMat); el.position.set(cx, 0.08 + 0.74, 0); el.renderOrder = 4; elG.add(el);
        if (ci < nC - 1) {                                                // series inter-cell connector through the partition: - of cell i to + of cell i+1
          strapG.add(tubeOn(new THREE.CatmullRomCurve3([new V3(cx + 0.27, ys, -0.35), new V3(cx + cw / 2, ys + 0.1, 0), new V3(cx + cw - 0.27, ys, 0.35)]), 0.035, 12, 6, lead));
        }
      });
      strapG.add(tubeOn(new THREE.CatmullRomCurve3([new V3(cxs[0] - 0.27, ys, 0.35), new V3(xp, ys + 0.08, 0.15), new V3(xp, H + 0.1, 0)]), 0.04, 10, 6, lead));
      strapG.add(tubeOn(new THREE.CatmullRomCurve3([new V3(cxs[nC - 1] + 0.27, ys, -0.35), new V3(xn, ys + 0.08, -0.15), new V3(xn, H + 0.1, 0)]), 0.04, 10, 6, lead));
      g.add(posG); g.add(negG); g.add(elG); g.add(strapG);
      parts.posPlate = tagPart(posG, "posPlate"); parts.negPlate = tagPart(negG, "negPlate"); parts.electrolyte = tagPart(elG, "electrolyte"); parts.straps = tagPart(strapG, "straps");
    }
    g.userData = { W: W, D: D, H: H, xp: xp, xn: xn, top: H + 0.45, gaps: gaps, parts: parts, nC: nC };
    return g;
  }

  /* ===================================================================
     5. MODE "cell" - inside the battery; energy per coulomb E = V + Ir
     =================================================================== */
  function buildCell(ctx) {
    var G = new THREE.Group(), C = new THREE.Group(), parts = {}; G.add(C);
    var bat = null, nCur = 0, P = null, M = null, beadPath = null, beadLen = 1, key = null, blade = null;
    var MAXION = 6 * 3 * 4, hMat = std(0xff5a6e, 0.3, { emissive: new THREE.Color(0xff3050), emissiveIntensity: 0.6 }), sMat = std(0xffd23f, 0.35, { emissive: new THREE.Color(0xe0a800), emissiveIntensity: 0.45 });
    var hIons = new THREE.InstancedMesh(new THREE.SphereGeometry(0.035, 8, 6), hMat, MAXION / 2), sIons = new THREE.InstancedMesh(new THREE.SphereGeometry(0.055, 8, 6), sMat, MAXION / 2);
    hIons.frustumCulled = sIons.frustumCulled = false;
    var beadMat = std(0xffb347, 0.3, { emissive: new THREE.Color(0xff9a1f), emissiveIntensity: 0.8 }), NB = 22;
    var beads = new THREE.InstancedMesh(new THREE.SphereGeometry(0.06, 8, 6), beadMat, NB); beads.frustumCulled = false;
    var flashes = null, ionS = [], R = rng(17);
    var wireMat = std(0xb8322a, 0.5), wireMatN = std(0x1d2026, 0.5), brass = metal(0xc9a24a, 0.3, { map: brushedTex("#c9a24a", 5) });
    /* energy-per-coulomb bar */
    var barG = new THREE.Group(), BH = 2.6, BW = 0.62;
    var env = mesh(new THREE.BoxGeometry(BW + 0.12, 1, 0.5), glass(0xdfefff, 0.14)); env.geometry.translate(0, 0.5, 0); env.scale.y = BH;
    var segV = mesh(new THREE.BoxGeometry(BW, 1, 0.36), std(0x3fae6a, 0.45, { emissive: new THREE.Color(0x1f7a44), emissiveIntensity: 0.35 })); segV.geometry.translate(0, 0.5, 0);
    var segL = mesh(new THREE.BoxGeometry(BW, 1, 0.36), std(0xd9534f, 0.45, { emissive: new THREE.Color(0x9a2420), emissiveIntensity: 0.4 })); segL.geometry.translate(0, 0.5, 0);
    var rise = mesh(arrowGeo(BH, 0.07), std(0x7fb6ff, 0.4, { emissive: new THREE.Color(0x3d7bd9), emissiveIntensity: 0.4 })); rise.rotation.z = Math.PI / 2;
    barG.add(env); barG.add(segV); barG.add(segL); barG.add(rise); G.add(barG);
    var lbE = makeLabel("E", "#cfe3ff", 0.27), lbV = makeLabel("V", "#bff0cf", 0.25), lbL = makeLabel("Ir", "#ffc2bf", 0.25), lbJ = makeLabel("energy per C", "#d7dee6", 0.24), lbR = makeLabel("load R", "#eef3f8", 0.26), lbK = makeLabel("key", "#eef3f8", 0.24);
    [lbE, lbV, lbL, lbJ, lbR, lbK].forEach(function (l) { G.add(l); ctx.labels.push(l); });
    var hV = 0, hL = 0, extent = { min: -3, max: 3 };

    function rebuild(nC) {
      if (nC === nCur) return; nCur = nC;
      if (bat) { C.remove(bat); disposeTree(bat); }
      while (C.children.length) { var c = C.children.pop(); if (c !== hIons && c !== sIons && c !== beads) disposeTree(c); }
      bat = buildBattery(nC, { interior: true }); C.add(bat);
      var u = bat.userData, Yt = 3.15, yb = u.top - 0.12, cL = Math.min(u.xp, -1.35), cR = Math.max(u.xn, 1.95), ym = 2.62;
      /* load resistor: wire-wound on a ceramic former */
      var res = new THREE.Group();
      res.add(mesh(lathe([[0, -0.9], [0.17, -0.9], [0.17, 0.9], [0, 0.9]], 22).rotateZ(Math.PI / 2), std(0xe9e1cf, 0.75)));
      res.add(tubeOn(helixCurve(-0.72, 0.72, 0.18, 14, 0, 0), 0.018, 240, 5, metal(0x9aa0a6, 0.4)));
      [-0.86, 0.86].forEach(function (x) { var cap = mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.12, 20).rotateZ(Math.PI / 2), brass); cap.position.x = x; res.add(cap); });
      res.position.set(0, Yt, 0); C.add(res);
      /* key: brass blade on an ebonite base, hinged at the right contact */
      key = new THREE.Group(); var kb = mesh(slab(rr(0.86, 0.36, 0.05), 0.1, 0.02), std(0x1b1d22, 0.4)); key.add(kb);
      [-0.3, 0.3].forEach(function (x) { var b = mesh(new THREE.BoxGeometry(0.14, 0.12, 0.2), brass); b.position.set(x, 0.16, 0); key.add(b); });
      var bs = new THREE.Shape(); bs.moveTo(0, -0.025); bs.lineTo(-0.62, -0.02); bs.lineTo(-0.7, 0.05); bs.lineTo(-0.62, 0.03); bs.lineTo(0, 0.03); bs.lineTo(0, -0.025);
      blade = new THREE.Group(); blade.add(mesh(plate(bs, 0.08, 0.01), brass)); var knob = mesh(new THREE.SphereGeometry(0.07, 12, 8), std(0x111317, 0.4)); knob.position.set(-0.6, 0.09, 0); blade.add(knob);
      blade.position.set(0.3, 0.25, 0); key.add(blade); key.position.set(1.35, Yt - 0.25, 0); C.add(key);
      /* leads */
      var plusPts = [[u.xp, yb, 0], [u.xp, ym, 0], [cL, ym, 0], [cL, Yt, 0], [-0.92, Yt, 0]];
      var minusPts = [[1.67, Yt, 0], [cR, Yt, 0], [cR, ym, 0], [u.xn, ym, 0], [u.xn, yb, 0]];
      C.add(tubeOn(roundedPath(plusPts, 0.18), 0.045, 60, 8, wireMat));
      C.add(tubeOn(roundedPath(minusPts, 0.18), 0.045, 60, 8, wireMatN));
      C.add(tubeOn(roundedPath([[0.92, Yt, 0], [1.03, Yt, 0], [1.03, Yt - 0.06, 0]], 0.05), 0.035, 8, 6, wireMatN));
      beadPath = roundedPath(plusPts.slice(0, 4).concat([[cR, Yt, 0]]).concat(minusPts.slice(2)), 0.18); beadLen = beadPath.getLength();
      C.add(hIons); C.add(sIons); C.add(beads);
      flashes = flashPool(C, 14, "255,150,70", 0.3);
      /* ions in every plate gap: H+ towards the PbO2 (+) plate, sulphate towards the Pb (-) plate (discharge) */
      ionS = []; u.gaps.forEach(function (gp) {
        for (var k = 0; k < 2; k++) { ionS.push({ g: gp, h: true, s: R(), y: 0.3 + R() * 1.05, z: (R() - 0.5) * 0.85 }); ionS.push({ g: gp, h: false, s: R(), y: 0.3 + R() * 1.05, z: (R() - 0.5) * 0.85 }); }
      });
      hIons.count = sIons.count = ionS.length / 2;
      /* bar + labels */
      var bx = cR + 0.95; barG.position.set(bx, 0, 0);
      lbR.position.set(0, Yt + 0.5, 0); lbK.position.set(1.35, Yt + 0.45, 0);
      lbJ.position.set(bx, -0.3, 0.3);
      extent = { min: cL - 0.4, max: bx + 0.75 };
      C.position.x = 0; G.position.x = -(extent.min + extent.max) / 2;
      parts.plus = bat.userData.parts.plus; parts.minus = bat.userData.parts.minus; parts.case = bat.userData.parts.case;
      parts.posPlate = bat.userData.parts.posPlate; parts.negPlate = bat.userData.parts.negPlate; parts.electrolyte = bat.userData.parts.electrolyte;
      parts.load = tagPart(res, "load"); parts.key = tagPart(key, "key"); parts.ions = tagPart(hIons, "ions"); tagPart(sIons, "ions");
      parts.charges = tagPart(beads, "charges"); parts.bar = tagPart(barG, "bar");
      ctx.partsChanged();
    }
    function apply(p) {
      P = p; M = solveCell(p); rebuild(M.nCells);
      lbE.userData.setText("E " + p.E.toFixed(1) + " V"); lbV.userData.setText("V " + M.V.toFixed(1) + " V"); lbL.userData.setText("Ir " + M.lost.toFixed(1) + " V");
    }
    var bu = 0, bladeA = 0;
    function update(dt, t) {
      if (!M) return;
      var I = M.raw.I, fV = M.raw.V / P.E, fL = M.raw.lost / P.E;
      hV += (fV * BH - hV) * Math.min(1, dt * 5); hL += (fL * BH - hL) * Math.min(1, dt * 5);
      segV.scale.y = Math.max(0.001, hV); segL.scale.y = Math.max(0.001, hL); segL.position.y = hV;
      rise.position.set(-0.55, 0, 0.0);
      lbE.position.set(barG.position.x, BH + 0.3, 0.3);
      lbV.position.set(barG.position.x, hV / 2, 0.32); lbV.visible = ctx.S.labels && hV > 0.3;
      lbL.position.set(barG.position.x, hV + hL / 2, 0.32); lbL.visible = ctx.S.labels && hL > 0.3;
      bladeA += ((P.closed ? 0 : 0.5) - bladeA) * Math.min(1, dt * 8); blade.rotation.z = -bladeA;
      /* ions: speed ∝ I; on open circuit they only jiggle */
      var vs = 0.55 * I / (I + 1.5), hi = 0, si = 0;
      for (var i = 0; i < ionS.length; i++) {
        var o = ionS[i], gp = o.g; o.s += vs * dt * (0.8 + 0.4 * ((i * 7) % 5) / 5); if (o.s > 1) { o.s -= 1; o.y = 0.3 + R() * 1.05; o.z = (R() - 0.5) * 0.85; }
        var toLeft = (o.h && gp.posLeft) || (!o.h && !gp.posLeft), x = toLeft ? gp.xb - (gp.xb - gp.xa) * o.s : gp.xa + (gp.xb - gp.xa) * o.s;
        var j = 0.012 * Math.sin(t * 13 + i);
        if (o.h) setInst(hIons, hi++, x + j, o.y + j, o.z); else setInst(sIons, si++, x - j, o.y, o.z + j);
      }
      hIons.instanceMatrix.needsUpdate = true; sIons.instanceMatrix.needsUpdate = true;
      /* heat inside the cell: flash rate ∝ I²r (the lost energy Ir per coulomb) */
      var gaps = bat.userData.gaps;
      if (R() < 1 - Math.exp(-1.1 * I * I * P.r * dt) && gaps.length) { var gp2 = gaps[(R() * gaps.length) | 0]; flashes.fire((gp2.xa + gp2.xb) / 2, 0.3 + R() * 1.1, (R() - 0.5) * 0.8, 0.28); }
      flashes.update(dt);
      /* conventional current outside: + post -> load -> key -> - post */
      bu = (bu + 1.6 * I / (I + 0.8) * dt / beadLen) % 1;
      for (var b = 0; b < NB; b++) { var u = (bu + b / NB) % 1, pt = beadPath.getPointAt(u); setInst(beads, b, pt.x, pt.y, pt.z, I > 0 ? 1 : 0.0001); }
      beads.instanceMatrix.needsUpdate = true;
    }
    return {
      group: G, parts: parts, apply: apply, update: update, reading: function () { return solveCell(P); },
      viewsFn: function () {
        var cx = (extent.min + extent.max) / 2 + G.position.x, w = extent.max - extent.min, bx = barG.position.x + G.position.x, u = bat.userData;
        return { all: [cx, 1.75, 0, Math.max(8.2, w * 1.12)], case: [G.position.x, 1.0, 0, 5.6], posPlate: [G.position.x - u.W / 2 + 0.6, 0.9, 0, 3.0], negPlate: [G.position.x - u.W / 2 + 0.6, 0.9, 0, 3.0],
          electrolyte: [G.position.x, 0.9, 0, 4.2], ions: [G.position.x - u.W / 2 + 0.6, 0.9, 0, 2.6], plus: [G.position.x + u.xp, 2.3, 0, 3.0], minus: [G.position.x + u.xn, 2.3, 0, 3.0],
          load: [G.position.x, 3.15, 0, 3.6], key: [G.position.x + 1.35, 3.0, 0, 2.4], charges: [cx, 2.4, 0, 7.0], bar: [bx, 1.4, 0, 4.2] };
      }
    };
  }

  /* ===================================================================
     6. Bead network: charge beads riding along a set of curve segments.
        segs[i] = { curve | null (hidden transit), len }; route(i) -> next segment index or null (leave)
     =================================================================== */
  function beadNet(parent, max, mat, radius) {
    var im = new THREE.InstancedMesh(new THREE.SphereGeometry(radius, 8, 6), mat, max); im.frustumCulled = false; im.count = 0; parent.add(im);
    var segs = [], beads = [], acc = 0;
    function step(dt, rate, speed, route) {
      acc += rate * dt;
      while (acc >= 1) { acc -= 1; if (beads.length < max) beads.push({ s: 0, d: 0 }); }
      var keep = [];
      for (var i = 0; i < beads.length; i++) {
        var b = beads[i], dead = false; b.d += speed * dt;
        while (b.d > segs[b.s].len) { b.d -= segs[b.s].len; var nx = route(b.s, b); if (nx == null) { dead = true; break; } b.s = nx; }
        if (!dead) keep.push(b);
      }
      beads = keep;
    }
    function draw() {
      var n = 0;
      for (var i = 0; i < beads.length; i++) {
        var b = beads[i], sg = segs[b.s]; if (!sg.curve) continue;
        var pt = sg.curve.getPointAt(Math.min(1, b.d / sg.len)); setInst(im, n++, pt.x, pt.y, pt.z);
      }
      im.count = n; im.instanceMatrix.needsUpdate = true;
    }
    return {
      mesh: im,
      setSegs: function (s) { segs = s.map(function (q) { return { curve: q.curve || null, len: q.curve ? q.curve.getLength() : q.len }; }); beads = []; acc = 0; },
      warm: function (rate, speed, route, secs) { for (var t = 0; t < secs; t += 0.1) step(0.1, rate, speed, route); draw(); },
      update: function (dt, rate, speed, route) { step(dt, rate, speed, route); draw(); },
      clear: function () { beads = []; acc = 0; im.count = 0; }
    };
  }
  /* wire-wound resistor along x (ceramic former, resistance-wire helix, brass end caps); more turns = more ohms */
  function wireWound(len, R, wireColor) {
    var g = new THREE.Group(), turns = clamp(Math.round(5 + R * 0.75), 5, 20), h = len / 2;
    g.add(mesh(lathe([[0, -h], [0.15, -h], [0.16, -h + 0.04], [0.16, h - 0.04], [0.15, h], [0, h]], 20).rotateZ(Math.PI / 2), std(0xece4d2, 0.8)));
    g.add(tubeOn(helixCurve(-h + 0.1, h - 0.1, 0.165, turns, 0, 0), 0.016, turns * 16, 5, metal(wireColor || 0xa3a8ad, 0.4)));
    var brass = metal(0xc9a24a, 0.3, { map: brushedTex("#c9a24a", 5) });
    [-h, h].forEach(function (x) { var c = mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.1, 20).rotateZ(Math.PI / 2), brass); c.position.x = x; g.add(c); });
    return g;
  }
  function stackBar(defs, BW) {
    var g = new THREE.Group(), segs = {};
    var env = mesh(new THREE.BoxGeometry(BW + 0.12, 1, 0.5), glass(0xdfefff, 0.14)); env.geometry.translate(0, 0.5, 0); g.add(env);
    defs.forEach(function (d) {
      var m = mesh(new THREE.BoxGeometry(BW, 1, 0.36), std(d.color, 0.45, { emissive: new THREE.Color(d.color), emissiveIntensity: 0.25 })); m.geometry.translate(0, 0.5, 0);
      m.scale.y = 0.001; m.userData.h = 0; g.add(m); segs[d.id] = m;
    });
    g.userData = { env: env, segs: segs };
    return g;
  }

  /* ===================================================================
     7. MODE "node" - current splitting at a junction and rejoining
     =================================================================== */
  function buildNode(ctx) {
    var G = new THREE.Group(), parts = {}, P = null, M = null, key = "";
    var XA = -2.2, XB = 2.2, YT = 2.95, YM = 1.9, YL = 1.0, glassM = glass(0xe3f2ff, 0.17), copper = metal(0xc77a45, 0.35);
    var brass = metal(0xc9a24a, 0.28, { map: brushedTex("#c9a24a", 5) });
    var circ = new THREE.Group(); G.add(circ);
    var beads = beadNet(G, 220, std(0xffb347, 0.3, { emissive: new THREE.Color(0xff9a1f), emissiveIntensity: 0.85 }), 0.055);
    var bar = stackBar([{ id: "P1", color: 0x4f8df5 }, { id: "P2", color: 0x2bb5a5 }, { id: "Ps", color: 0x9b6bd6 }, { id: "Pr", color: 0xd9534f }], 0.62);
    bar.position.set(3.45, 0, 0); G.add(bar);
    var lb = {}; [["EI", "#cfe3ff"], ["P1", "#c7dbff"], ["P2", "#bff3ea"], ["Ps", "#e3d2ff"], ["Pr", "#ffc2bf"], ["R1", "#eef3f8"], ["R2", "#eef3f8"], ["Rs", "#eef3f8"], ["I", "#ffd28a"], ["A", "#ffe7a6"], ["B", "#ffe7a6"], ["cnt", "#ffe7a6"]].forEach(function (d) {
      lb[d[0]] = makeLabel(d[0], d[1], 0.25); G.add(lb[d[0]]); ctx.labels.push(lb[d[0]]);
    });
    var cnt = { n: 0, n1: 0, n2: 0, acc: 0 }, barH = 2.6;
    function rebuild() {
      while (circ.children.length) { var c = circ.children.pop(); disposeTree(c); }
      var nC = clamp(Math.round(P.E / CELL_EMF), 1, 6), bat = buildBattery(nC, { interior: false }), s = 0.5;
      bat.scale.setScalar(s); bat.position.set(0, -0.62, 0); circ.add(bat);
      var u = bat.userData, xp = u.xp * s, xn = u.xn * s, yt = -0.62 + (u.top - 0.12) * s;
      var main = [[xp, yt, 0], [xp, YL, 0], [XA, YL, 0], [XA, YM, 0]], b1 = [[XA, YM, 0], [XA, YT, 0], [XB, YT, 0], [XB, YM, 0]], b2 = [[XA, YM, 0], [XB, YM, 0]], ret = [[XB, YM, 0], [XB, YL, 0], [xn, YL, 0], [xn, yt, 0]];
      if (xp < XA + 0.3) main = [[xp, yt, 0], [xp, YL, 0], [XA, YL, 0], [XA, YM, 0]];
      var curves = [main, b1, b2, ret].map(function (pts) { return roundedPath(pts, 0.2); });
      curves.forEach(function (cv) { var gt = tubeOn(cv, 0.085, 64, 8, glassM); gt.renderOrder = 3; circ.add(gt); circ.add(tubeOn(cv, 0.022, 64, 5, copper)); });
      var r1 = wireWound(1.3, P.R1, 0xa3a8ad); r1.position.set(0, YT, 0); circ.add(r1);
      var r2 = wireWound(1.3, P.R2, 0xa3a8ad); r2.position.set(0, YM, 0); circ.add(r2);
      var rs = null; if (P.Rs > 0) { rs = wireWound(0.75, P.Rs, 0xb08d57); rs.position.set((xp + XA) / 2, YL, 0); circ.add(rs); }
      var jGeo = lathe([[0, -0.17], [0.1, -0.15], [0.16, -0.06], [0.17, 0], [0.16, 0.06], [0.1, 0.15], [0, 0.17]], 18);
      var nA = mesh(jGeo, brass), nB = mesh(jGeo, brass); nA.position.set(XA, YM, 0); nB.position.set(XB, YM, 0); circ.add(nA); circ.add(nB);
      beads.setSegs(curves.map(function (c) { return { curve: c }; }));
      parts.cell = tagPart(bat, "cell"); parts.R1 = tagPart(r1, "R1"); parts.R2 = tagPart(r2, "R2"); if (rs) parts.Rs = tagPart(rs, "Rs"); else delete parts.Rs;
      parts.nodeA = tagPart(nA, "nodeA"); parts.nodeB = tagPart(nB, "nodeB"); parts.node = nA; parts.beads = tagPart(beads.mesh, "beads"); parts.bar = tagPart(bar, "bar");
      parts.tubes = circ.children.filter(function (c) { return c.userData.curve; })[0];
      circ.children.forEach(function (c) { if (c.userData.curve) tagPart(c, "tubes"); });
      tagPart(nB, "node"); tagPart(nA, "node"); nA.userData.partId = "nodeA"; nB.userData.partId = "nodeB";
      lb.R1.position.set(0, YT + 0.45, 0.1); lb.R2.position.set(0, YM - 0.42, 0.1); lb.Rs.position.set((xp + XA) / 2, YL - 0.42, 0.1); lb.Rs.visible = ctx.S.labels && P.Rs > 0;
      lb.I.position.set(XA - 0.72, (YL + YM) / 2 + 0.05, 0.1); lb.A.position.set(XA - 0.38, YM + 0.18, 0.1); lb.B.position.set(XB + 0.38, YM + 0.18, 0.1);
      lb.cnt.position.set(XA + 0.25, YT + 0.45 + 0.42, 0.1);
      cnt.n = cnt.n1 = cnt.n2 = 0; cnt.acc = 0;
      ctx.partsChanged();
    }
    function route(i) {
      if (i === 0) {                                     // node A: error-diffusion split, long-run ratio exactly I1 : I2
        cnt.n++; cnt.acc += M.raw.I1 / M.raw.I;
        if (cnt.acc >= 0.5) { cnt.acc -= 1; cnt.n1++; return 1; }
        cnt.n2++; return 2;
      }
      if (i === 1 || i === 2) return 3;                  // node B: everything rejoins
      return null;                                       // back into the cell
    }
    function rate() { return clamp(6 * M.raw.I, 1.5, 16); }
    function apply(p) {
      P = p; M = solveNode(p);
      var k = [clamp(Math.round(p.E / CELL_EMF), 1, 6), p.R1, p.R2, p.Rs].join("|");
      if (k !== key) { key = k; rebuild(); beads.warm(rate(), 1.25, route, 9); cnt.n = cnt.n1 = cnt.n2 = 0; cnt.acc = 0; }
      lb.R1.userData.setText("R₁ " + p.R1.toFixed(1) + " Ω · I₁ " + M.I1.toFixed(2) + " A");
      lb.R2.userData.setText("R₂ " + p.R2.toFixed(1) + " Ω · I₂ " + M.I2.toFixed(2) + " A");
      lb.Rs.userData.setText("Rₛ " + p.Rs.toFixed(1) + " Ω");
      lb.I.userData.setText("I " + M.I.toFixed(2) + " A");
      lb.EI.userData.setText("EI " + sf(M.raw.EI, 3) + " W");
      lb.P1.userData.setText("I₁²R₁ " + M.P1 + " W"); lb.P2.userData.setText("I₂²R₂ " + M.P2 + " W");
      lb.Ps.userData.setText("I²Rₛ " + M.Ps + " W"); lb.Pr.userData.setText("I²r " + M.P_int + " W");
    }
    function update(dt) {
      if (!M) return;
      beads.update(dt, rate(), 1.25, route);
      lb.cnt.userData.setText("in " + cnt.n + " = " + cnt.n1 + " + " + cnt.n2);
      var tot = M.raw.EI, y = 0, segs = bar.userData.segs, ids = ["P1", "P2", "Ps", "Pr"], vals = [M.raw.P1, M.raw.P2, M.raw.Ps, M.raw.Pr];
      bar.userData.env.scale.y = barH;
      ids.forEach(function (id, i) {
        var m = segs[id], h = tot > 0 ? barH * vals[i] / tot : 0; m.userData.h += (h - m.userData.h) * Math.min(1, dt * 5);
        m.scale.y = Math.max(0.001, m.userData.h); m.position.y = y;
        lb[id].position.set(bar.position.x, y + m.userData.h / 2, 0.32); lb[id].visible = ctx.S.labels && m.userData.h > 0.28; y += m.userData.h;
      });
      lb.EI.position.set(bar.position.x, barH + 0.3, 0.3); lb.Rs.visible = ctx.S.labels && P.Rs > 0;
    }
    G.position.x = -0.55;
    return {
      group: G, parts: parts, apply: apply, update: update, reading: function () { var r = solveNode(P); r.beads_in = cnt.n; r.beads_1 = cnt.n1; r.beads_2 = cnt.n2; return r; },
      resetCounts: function () { cnt.n = cnt.n1 = cnt.n2 = 0; cnt.acc = 0; },
      views: { all: [0.1, 1.25, 0, 9.2], nodeA: [XA - 0.55, YM, 0, 2.8], node: [XA - 0.55, YM, 0, 2.8], nodeB: [XB - 0.55, YM, 0, 2.8], R1: [-0.55, YT, 0, 3.2], R2: [-0.55, YM, 0, 3.2],
        Rs: [-2.2, YL, 0, 3.0], cell: [-0.55, -0.2, 0, 3.2], beads: [-0.55, 1.6, 0, 7.0], tubes: [-0.55, 1.6, 0, 7.0], bar: [2.9, 1.4, 0, 4.4] }
    };
  }

  /* ===================================================================
     8. MODE "coil" - moving-coil galvanometer, shunt and multiplier
     =================================================================== */
  function buildCoil(ctx) {
    var G = new THREE.Group(), parts = {}, P = null, M = null, Y0 = 0.85, RP = 0.70, RC = 0.55, RCOIL = 0.625, AH = 62 * Math.PI / 180;
    var brass = metal(0xc9a24a, 0.28, { map: brushedTex("#c9a24a", 5) }), iron = metal(0x8a9097, 0.55, { map: brushedTex("#8a9097", 19) });
    /* permanent magnet with concave pole pieces (two halves: N red, S blue) */
    function half(sgn) {
      var s = new THREE.Shape(), cx = RP * Math.cos(AH), cy = RP * Math.sin(AH);
      var RS = RP + 0.32;                                  // the magnet ends where the soft-iron pole shoe starts
      if (sgn < 0) {
        s.moveTo(-RS * Math.cos(AH), RS * Math.sin(AH)); s.lineTo(-RS * Math.cos(AH), 0.85); s.lineTo(-1.8, 0.85); s.lineTo(-1.8, -0.55);
        s.absarc(0, -0.55, 1.8, Math.PI, 1.5 * Math.PI, false); s.lineTo(0, -1.5); s.absarc(0, -0.55, 0.95, 1.5 * Math.PI, Math.PI * 1.5 - 1.2, true);
        s.lineTo(-RS * Math.cos(AH), -RS * Math.sin(AH)); s.absarc(0, 0, RS, Math.PI + AH, Math.PI - AH, true);
      } else {
        s.moveTo(RS * Math.cos(AH), RS * Math.sin(AH)); s.lineTo(RS * Math.cos(AH), 0.85); s.lineTo(1.8, 0.85); s.lineTo(1.8, -0.55);
        s.absarc(0, -0.55, 1.8, 0, -0.5 * Math.PI, true); s.lineTo(0, -1.5); s.absarc(0, -0.55, 0.95, -0.5 * Math.PI, -0.5 * Math.PI + 1.2, false);
        s.lineTo(RS * Math.cos(AH), -RS * Math.sin(AH)); s.absarc(0, 0, RS, -AH, AH, false);
      }
      return s;
    }
    function shoe(sgn) {                                   /* concave soft-iron pole shoe: annular sector RP..RP+0.32 */
      var s = new THREE.Shape(), RS = RP + 0.32;
      if (sgn < 0) { s.absarc(0, 0, RP, Math.PI - AH, Math.PI + AH, false); s.absarc(0, 0, RS, Math.PI + AH, Math.PI - AH, true); }
      else { s.absarc(0, 0, RP, -AH, AH, false); s.absarc(0, 0, RS, AH, -AH, true); }
      return s;
    }
    var mag = new THREE.Group(); mag.position.y = Y0; G.add(mag);
    var magN = mesh(plate(half(-1), 0.9, 0.03), std(0xb83228, 0.42, { metalness: 0.2 })), magS = mesh(plate(half(1), 0.9, 0.03), std(0x2f5fb0, 0.42, { metalness: 0.2 }));
    mag.add(magN); mag.add(magS);
    var shoeMat = std(0xc9cfd6, 0.4, { map: brushedTex("#c9cfd6", 29), metalness: 0.45 }), shoeN = mesh(plate(shoe(-1), 0.92, 0.015), shoeMat), shoeS = mesh(plate(shoe(1), 0.92, 0.015), shoeMat);
    mag.add(shoeN); mag.add(shoeS);
    var core = mesh(new THREE.CylinderGeometry(RC, RC, 0.8, 40).rotateX(Math.PI / 2), iron); mag.add(core);
    var bracket = mesh(plate(rr(0.5, 0.95, 0.04), 0.06, 0.01), brass); bracket.position.set(0, -0.85, -0.5); mag.add(bracket);
    /* radial field lines in the two gaps */
    var fl = [], fa;
    for (fa = -50; fa <= 50; fa += 12.5) [1, -1].forEach(function (sg) { var a = fa * Math.PI / 180, c = Math.cos(a) * sg, s2 = Math.sin(a); fl.push(c * RP * 0.99, s2 * RP * 0.99, 0.47, c * RC * 1.01, s2 * RC * 1.01, 0.47); });
    var flG = new THREE.BufferGeometry(); flG.setAttribute("position", new THREE.Float32BufferAttribute(fl, 3));
    var fieldLines = new THREE.LineSegments(flG, new THREE.LineBasicMaterial({ color: 0xffe28a, transparent: true, opacity: 0.8 })); mag.add(fieldLines);
    /* moving system: former + coil + spindle + pointer, rotating about z */
    var mov = new THREE.Group(); mov.position.y = Y0; G.add(mov);
    var fs = rr(1.18, 1.04, 0.07); fs.holes.push(rrPath(new THREE.Path(), 0, 0, 1.1, 0.96, 0.05));
    var former = mesh(slab(fs, 0.16, 0.008), metal(0xd5d9de, 0.35)); former.position.y = -0.08; mov.add(former);
    var coilPath = roundedPath([[-RCOIL, 0, 0], [-RCOIL, 0, 0.55], [RCOIL, 0, 0.55], [RCOIL, 0, -0.55], [-RCOIL, 0, -0.55], [-RCOIL, 0, 0.001]], 0.1);
    var coilM = tubeOn(coilPath, 0.058, 90, 10, std(0xffffff, 0.35, { map: windTex("#d0743a", 9), metalness: 0.5 })); mov.add(coilM);
    var spindle = mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.55, 10).rotateX(Math.PI / 2), metal(0xe0e4e8, 0.2)); spindle.position.z = 0.02; mov.add(spindle);
    var ps = new THREE.Shape(); ps.moveTo(-0.035, -0.32); ps.lineTo(0.035, -0.32); ps.lineTo(0.014, 1.95); ps.lineTo(0, 2.2); ps.lineTo(-0.014, 1.95); ps.lineTo(-0.035, -0.32);
    var pointer = new THREE.Group(), pm = mesh(plate(ps, 0.014), std(0x111418, 0.4)); pointer.add(pm);
    var cw = mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.5, 6).rotateZ(Math.PI / 2), brass); cw.position.y = -0.3; pointer.add(cw);
    [-0.25, 0.25].forEach(function (x) { var w = mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.06, 12).rotateZ(Math.PI / 2), brass); w.position.set(x, -0.3, 0); pointer.add(w); });
    pointer.position.z = 0.74; mov.add(pointer);
    var jewel = lathe([[0, 0], [0.05, 0], [0.03, 0.05], [0, 0.06]], 12);
    [0.79, -0.77].forEach(function (z) { var j = mesh(jewel, std(0xb0182b, 0.15, { metalness: 0.1 })); j.rotation.x = z > 0 ? -Math.PI / 2 : Math.PI / 2; j.position.set(0, Y0, z); G.add(j); });
    /* hairsprings: flat phosphor-bronze spiral ribbons, inner end turns with the coil */
    var springMat = metal(0xd2a35a, 0.3, { side: THREE.DoubleSide }), NS = 110, TURNS = 3.5;
    function makeSpring(z) {
      var geo = new THREE.BufferGeometry(), pos = new Float32Array((NS + 1) * 2 * 3), idx = [];
      for (var i = 0; i < NS; i++) { var a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3)); geo.setIndex(idx);
      var m = mesh(geo, springMat); m.position.set(0, Y0, z); G.add(m); m.userData.z = z; return m;
    }
    function shapeSpring(m, phi) {
      var pos = m.geometry.attributes.position.array, i;
      for (i = 0; i <= NS; i++) {
        var s = i / NS, r = 0.05 + 0.25 * s, a = -Math.PI / 2 + (1 - s) * TURNS * TAU + phi * (1 - s);
        var x = Math.cos(a) * r, y = Math.sin(a) * r;
        pos[i * 6] = x; pos[i * 6 + 1] = y; pos[i * 6 + 2] = -0.022; pos[i * 6 + 3] = x; pos[i * 6 + 4] = y; pos[i * 6 + 5] = 0.022;
      }
      m.geometry.attributes.position.needsUpdate = true; m.geometry.computeVertexNormals(); m.geometry.computeBoundingSphere();
    }
    var sprF = makeSpring(0.62), sprB = makeSpring(-0.62);
    /* scale plate (arc) with mirror strip; graduations drawn for the current conversion */
    var RI = 1.62, RO = 2.28, A0 = 40 * Math.PI / 180, y0 = RI * Math.sin(A0);
    var scGeo = new THREE.RingGeometry(RI, RO, 48, 2, A0, Math.PI - 2 * A0), sp = scGeo.attributes.position, suv = scGeo.attributes.uv;
    for (var q = 0; q < sp.count; q++) suv.setXY(q, (sp.getX(q) + RO) / (2 * RO), (sp.getY(q) - y0) / (RO - y0));
    var scCan = cnv(1024, 512), scTex = srgb(new THREE.CanvasTexture(scCan)); scTex.anisotropy = 4;
    var scale = mesh(scGeo, new THREE.MeshStandardMaterial({ map: scTex, roughness: 0.7, side: THREE.DoubleSide })); scale.position.set(0, Y0, 0.66); G.add(scale);
    function drawScale(r) {
      var x = scCan.getContext("2d"), Wd = 1024, Hd = 512;
      function P2(rad, th) { var px = Math.cos(th) * rad, py = Math.sin(th) * rad; return [(px + RO) / (2 * RO) * Wd, (1 - (py - y0) / (RO - y0)) * Hd]; }
      x.fillStyle = "#f2ead6"; x.fillRect(0, 0, Wd, Hd);
      var thA = Math.PI - A0 - 0.06, thB = A0 + 0.06;
      x.lineWidth = 16; x.strokeStyle = "#c7ccd2"; x.beginPath();                   // anti-parallax mirror strip
      for (var k = 0; k <= 60; k++) { var p = P2(RI + 0.12, thA + (thB - thA) * k / 60); if (k) x.lineTo(p[0], p[1]); else x.moveTo(p[0], p[1]); } x.stroke();
      x.strokeStyle = "#1d232b"; x.fillStyle = "#1d232b"; x.textAlign = "center"; x.textBaseline = "middle"; x.font = "600 30px system-ui, sans-serif";
      for (var j = 0; j <= 50; j++) {
        var th = Math.PI / 2 + (50 - j * 2) * Math.PI / 180, major = j % 5 === 0, a = P2(RI + 0.22, th), b = P2(RI + (major ? 0.42 : 0.33), th);
        x.lineWidth = major ? 4 : 2; x.beginPath(); x.moveTo(a[0], a[1]); x.lineTo(b[0], b[1]); x.stroke();
        if (major) { var v = r.full_scale * j / 50, txt = r.conversion === "none" ? String(Math.round(v * 1000 * 10) / 10) : String(sf(v, 3)); var c = P2(RI + 0.53, th); x.fillText(txt.replace(/^0\./, "0."), c[0], c[1]); }
      }
      x.font = "700 40px system-ui, sans-serif"; var u = P2(RI + 0.05, Math.PI / 2); x.fillText(r.conversion === "none" ? "mA" : r.unit, u[0], u[1] - 4);
      scTex.needsUpdate = true;
    }
    /* base, terminals, shunt strip, multiplier bobbin */
    var TY = -1.1, TZ = 0.75;
    var base = mesh(slab(rr(5.6, 2.3, 0.12), 0.14, 0.03), std(0x1c1e22, 0.45)); base.position.set(0, TY - 0.14, 0.15); G.add(base);
    var tP = bindingPost(0xc0392b, 1.2), tN = bindingPost(0x15171a, 1.2); tP.position.set(-2.35, TY, TZ); tN.position.set(2.35, TY, TZ); G.add(tP); G.add(tN);
    var shunt = new THREE.Group();
    var sStrip = mesh(slab(rr(2.9, 0.3, 0.04), 0.07, 0.012), metal(0xd8854c, 0.28, { map: brushedTex("#d8854c", 23) })); sStrip.position.set(0, TY + 0.27, TZ); shunt.add(sStrip);
    [-1.55, 1.55].forEach(function (x) { var blk = mesh(new THREE.BoxGeometry(0.3, 0.3, 0.3), brass); blk.position.set(x, TY + 0.15, TZ); shunt.add(blk);
      var sc = mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.05, 14), metal(0xd8dde2, 0.3)); sc.position.set(x, TY + 0.33, TZ); shunt.add(sc); });
    var wireRed = std(0xb8322a, 0.5), wireBlk = std(0x1d2026, 0.5);
    var pT = [-2.35, TY + 0.38, TZ], nT = [2.35, TY + 0.38, TZ];
    var cShIn = roundedPath([pT, [-1.55, TY + 0.38, TZ]], 0.1), cShOut = roundedPath([[1.55, TY + 0.38, TZ], nT], 0.1);
    shunt.add(tubeOn(cShIn, 0.035, 8, 6, wireRed)); shunt.add(tubeOn(cShOut, 0.035, 8, 6, wireBlk)); G.add(shunt);
    var cShunt = roundedPath([pT, [-1.55, TY + 0.38, TZ], [-1.45, TY + 0.3, TZ], [1.45, TY + 0.3, TZ], [1.55, TY + 0.38, TZ], nT], 0.06);
    var bob = new THREE.Group(), BL = 1.2;
    bob.add(mesh(lathe([[0, -BL / 2], [0.27, -BL / 2], [0.27, -BL / 2 + 0.06], [0.13, -BL / 2 + 0.07], [0.13, BL / 2 - 0.07], [0.27, BL / 2 - 0.06], [0.27, BL / 2], [0, BL / 2]], 24), std(0x2a2522, 0.5)));
    bob.add(mesh(lathe([[0.2, -BL / 2 + 0.07], [0.215, -BL / 2 + 0.1], [0.215, BL / 2 - 0.1], [0.2, BL / 2 - 0.07]], 28), std(0xffffff, 0.4, { map: windTex("#b56b34", 60), metalness: 0.45 })));
    bob.rotation.z = Math.PI / 2; bob.position.set(-1.0, TY + 0.36, TZ); G.add(bob);
    var cBobIn = roundedPath([pT, [-1.6, TY + 0.38, TZ]], 0.08); bob.userData.lead = tubeOn(cBobIn, 0.035, 8, 6, wireRed); G.add(bob.userData.lead);
    /* coil leads (fine wire) to the hairspring anchors; the multiplier feeds the front spring directly */
    var fine = std(0xc77a45, 0.4), FA = [0, Y0 - 0.3, 0.62], BA = [0, Y0 - 0.3, -0.62];
    var cFront = roundedPath([pT, [-2.35, TY + 0.62, 0.62], [-0.12, TY + 0.62, 0.62], [-0.12, FA[1], 0.62], FA], 0.12);
    var cFrontV = roundedPath([[-0.4, TY + 0.38, TZ], [-0.12, TY + 0.62, 0.62], [-0.12, FA[1], 0.62], FA], 0.12);
    var cBack = roundedPath([BA, [0.12, BA[1], -0.62], [0.12, TY + 0.62, -0.62], [2.35, TY + 0.62, -0.62], [2.35, TY + 0.62, 0.6], nT], 0.12);
    var leadF = tubeOn(cFront, 0.016, 60, 5, fine), leadFV = tubeOn(cFrontV, 0.016, 40, 5, fine), leadB = tubeOn(cBack, 0.016, 70, 5, fine);
    G.add(leadF); G.add(leadFV); G.add(leadB);
    var cIn = roundedPath([[-3.3, TY + 0.38, TZ], pT], 0.1), cOut = roundedPath([nT, [3.3, TY + 0.38, TZ]], 0.1);
    G.add(tubeOn(cIn, 0.04, 8, 6, wireRed)); G.add(tubeOn(cOut, 0.04, 8, 6, wireBlk));
    var cVolt = roundedPath([pT, [-1.6, TY + 0.38, TZ], [-0.4, TY + 0.38, TZ], [-0.12, TY + 0.62, 0.62], [-0.12, FA[1], 0.62], FA], 0.1);
    var beads = beadNet(G, 160, std(0xffb347, 0.3, { emissive: new THREE.Color(0xff9a1f), emissiveIntensity: 0.85 }), 0.05);
    beads.setSegs([{ curve: cIn }, { curve: cShunt }, { curve: cFront }, { len: 1.6 }, { curve: cBack }, { curve: cOut }, { curve: cVolt }]);
    var lbN = makeLabel("N", "#ffb3a8", 0.3), lbS = makeLabel("S", "#b8d0ff", 0.3), lbSh = makeLabel("shunt", "#ffd1a8", 0.26), lbMu = makeLabel("multiplier", "#ffd1a8", 0.26);
    lbN.position.set(-1.35, Y0 + 0.25, 0.6); lbS.position.set(1.35, Y0 + 0.25, 0.6); lbSh.position.set(0, TY - 0.05, TZ + 0.45); lbMu.position.set(-1.0, TY - 0.05, TZ + 0.45);
    [lbN, lbS, lbSh, lbMu].forEach(function (l) { G.add(l); ctx.labels.push(l); });
    var theta = 0, omega = 0, lastPhi = 99, ac = 0, sKey = "";
    function route(i) {
      if (i === 0) {
        if (M.conversion === "voltmeter") return 6;
        if (M.conversion === "none") return 2;
        ac += M.raw.Ic / (M.raw.Iin || 1); if (ac >= 1) { ac -= 1; return 2; } return 1;   // error diffusion: 1 bead in ~200 goes through the coil
      }
      return [null, 5, 3, 4, 5, null, 3][i];
    }
    function rateOf() { var f = M.conversion === "ammeter" ? M.raw.Iin / M.full_scale : M.raw.frac; return clamp(10 * Math.abs(f), 0, 14); }
    function apply(p) {
      P = p; M = solveCoil(p);
      var k = M.conversion + "|" + M.full_scale; if (k !== sKey) { sKey = k; drawScale(M); beads.clear(); ac = 0; }
      var am = M.conversion === "ammeter", vm = M.conversion === "voltmeter";
      shunt.visible = am; bob.visible = vm; bob.userData.lead.visible = vm; leadFV.visible = vm; leadF.visible = !vm;
      lbSh.visible = ctx.S.labels && am; lbMu.visible = ctx.S.labels && vm;
    }
    function update(dt) {
      if (!M) return;
      var tgt = clamp(M.raw.frac, -0.03, 1.08) * THETA_MAX * Math.PI / 180, w0 = 9;     // eddy-current damping in the aluminium former
      omega += (w0 * w0 * (tgt - theta) - 2 * 0.75 * w0 * omega) * Math.min(dt, 0.05); theta += omega * Math.min(dt, 0.05);
      var phi = (50 * Math.PI / 180) - theta; mov.rotation.z = phi;
      if (Math.abs(phi - lastPhi) > 0.002) { lastPhi = phi; shapeSpring(sprF, -theta); shapeSpring(sprB, -theta); }
      beads.update(dt, rateOf(), 1.2, route);
      lbSh.visible = ctx.S.labels && M.conversion === "ammeter"; lbMu.visible = ctx.S.labels && M.conversion === "voltmeter";
    }
    parts.magnet = tagPart(mag, "magnet"); tagPart(magN, "magnet"); tagPart(magS, "magnet"); magN.userData.partId = "north"; magS.userData.partId = "south"; parts.north = magN; parts.south = magS;
    shoeN.userData.partId = "poles"; shoeS.userData.partId = "poles"; parts.poles = shoeN;
    core.userData.partId = "core"; parts.core = core; fieldLines.userData.partId = "field"; parts.field = fieldLines; bracket.userData.partId = "core";
    parts.coil = tagPart(coilM, "coil"); tagPart(former, "coil"); parts.former = former; former.userData.partId = "former";
    parts.pointer = tagPart(pointer, "pointer"); parts.spindle = tagPart(spindle, "pointer");
    parts.hairspring = tagPart(sprF, "hairspring"); tagPart(sprB, "hairspring"); parts.scale = tagPart(scale, "scale");
    parts.shunt = tagPart(shunt, "shunt"); parts.multiplier = tagPart(bob, "multiplier"); tagPart(bob.userData.lead, "multiplier");
    parts.terminals = tagPart(tP, "terminals"); tagPart(tN, "terminals"); parts.base = tagPart(base, "base"); parts.beads = tagPart(beads.mesh, "beads");
    tagPart(leadF, "coilLeads"); tagPart(leadFV, "coilLeads"); tagPart(leadB, "coilLeads");
    return {
      group: G, parts: parts, apply: apply, update: update, reading: function () { var r = solveCoil(P); r.pointer_deg = rd(theta * 180 / Math.PI, 1); return r; },
      views: { all: [0, 0.55, 0.3, 8.0], magnet: [0, 0.6, 0, 5.2], poles: [0, 0.85, 0.3, 3.2], north: [-1.0, 0.6, 0, 4.2], south: [1.0, 0.6, 0, 4.2], core: [0, 0.85, 0.3, 2.8], field: [0, 0.85, 0.3, 2.8],
        coil: [0, 0.85, 0.3, 3.2], former: [0, 0.85, 0.3, 3.2], hairspring: [0, 0.85, 0.6, 2.0], pointer: [0, 1.9, 0.6, 4.4], scale: [0, 2.6, 0.6, 3.6],
        shunt: [0, -0.85, 0.75, 3.8], multiplier: [-1.0, -0.8, 0.75, 3.0], terminals: [0, -0.85, 0.75, 5.6], base: [0, -0.8, 0.3, 6.4], beads: [0, -0.4, 0.6, 6.4] }
    };
  }

  /* ===================================================================
     9. MODE "ramp" - potentiometer: potential falls along the slide wire
     =================================================================== */
  function buildRamp(ctx) {
    var G = new THREE.Group(), parts = {}, P = null, M = null, CMU = 0.064, XA = -3.2, XB = 3.2, WY = 0.27, WZ = 0.25, YB = 1.3, HR = 2.3;
    function xl(l) { return XA + l * CMU; }
    var brass = metal(0xc9a24a, 0.28, { map: brushedTex("#c9a24a", 5) });
    var board = mesh(slab(rr(7.6, 2.6, 0.08), 0.14, 0.02), std(0xffffff, 0.7, { map: woodTex() })); board.position.set(0, 0, -0.35); planarUV(board.geometry, "x", "z", 0.13, 0.4); G.add(board);
    /* metre rule with mm graduations */
    var rc = cnv(2048, 96), rx = rc.getContext("2d");
    rx.fillStyle = "#f4ecd6"; rx.fillRect(0, 0, 2048, 96); rx.fillStyle = "#1d232b"; rx.font = "600 26px system-ui, sans-serif"; rx.textAlign = "center";
    for (var mm = 0; mm <= 1000; mm++) { var px = 24 + mm * 2; var hh = mm % 100 === 0 ? 44 : mm % 10 === 0 ? 30 : mm % 5 === 0 ? 20 : 12; rx.fillRect(px - (mm % 10 === 0 ? 1 : 0.5), 0, mm % 10 === 0 ? 2 : 1, hh); if (mm % 100 === 0) rx.fillText(String(mm / 10), px, 76); }
    var rtex = srgb(new THREE.CanvasTexture(rc)); rtex.anisotropy = 4;
    var ruleGeo = new THREE.BoxGeometry(6.4 * 2048 / 2000, 0.03, 0.34); var rule = mesh(ruleGeo, [std(0xd8ccb0, 0.7), std(0xd8ccb0, 0.7), std(0xffffff, 0.6, { map: rtex }), std(0xd8ccb0, 0.7), std(0xd8ccb0, 0.7), std(0xd8ccb0, 0.7)]);
    rule.position.set(0, 0.155, 0.62); G.add(rule);
    /* thick brass end strips with terminal screws, constantan slide wire */
    var strips = new THREE.Group();
    [XA - 0.12, XB + 0.12].forEach(function (x) {
      var s = mesh(slab(rr(0.26, 1.0, 0.03), 0.09, 0.015), brass); s.position.set(x, 0.14, 0.0); strips.add(s);
      [0.25, -0.3].forEach(function (z) { var bp = bindingPost(0xc9a24a, 0.7); bp.position.set(x, 0.23, z); strips.add(bp); });
    });
    G.add(strips);
    var wire = tubeOn(new THREE.LineCurve3(new V3(XA - 0.1, WY, WZ), new V3(XB + 0.1, WY, WZ)), 0.016, 4, 8, metal(0xcfc8bb, 0.3)); G.add(wire);
    /* jockey: turned handle + knife edge */
    var jockey = new THREE.Group();
    jockey.add(mesh(lathe([[0, 0.12], [0.05, 0.12], [0.06, 0.2], [0.05, 0.28], [0.085, 0.42], [0.11, 0.6], [0.1, 0.72], [0.06, 0.78], [0, 0.79]], 18), std(0x1a1c20, 0.35)));
    var ks = new THREE.Shape(); ks.moveTo(-0.05, 0.13); ks.lineTo(0.05, 0.13); ks.lineTo(0.004, 0.0); ks.lineTo(-0.004, 0.0); ks.lineTo(-0.05, 0.13);
    jockey.add(mesh(plate(ks, 0.12, 0.004), metal(0xd0d5da, 0.2)));
    G.add(jockey);
    /* the potential ramp: wedge above the wire, height ∝ potential (A high, B low) */
    var rcv = cnv(16, 128), rcx = rcv.getContext("2d"), gr = rcx.createLinearGradient(0, 0, 0, 128);
    gr.addColorStop(0, "#ffb347"); gr.addColorStop(1, "#5a7bd6"); rcx.fillStyle = gr; rcx.fillRect(0, 0, 16, 128);
    var ws = new THREE.Shape(); ws.moveTo(XA, YB); ws.lineTo(XB, YB); ws.lineTo(XA, YB + HR); ws.lineTo(XA, YB);
    var wg = plate(ws, 0.3, 0); planarUV(wg, "x", "y", 1, 1 / HR, 0, YB);
    var rampM = mesh(wg, new THREE.MeshStandardMaterial({ map: srgb(new THREE.CanvasTexture(rcv)), transparent: true, opacity: 0.38, depthWrite: false, roughness: 0.4, side: THREE.DoubleSide }));
    rampM.position.z = WZ - 0.35; rampM.renderOrder = 6; G.add(rampM);
    var edge = tubeOn(new THREE.LineCurve3(new V3(XA, YB + HR, WZ - 0.2), new V3(XB, YB, WZ - 0.2)), 0.025, 4, 6, std(0xffc46b, 0.3, { emissive: new THREE.Color(0xff9a1f), emissiveIntensity: 0.6 })); G.add(edge);
    var topLine = mesh(new THREE.BoxGeometry(XB - XA, 0.012, 0.012), new THREE.MeshBasicMaterial({ color: 0xffe0b0, transparent: true, opacity: 0.5 })); topLine.position.set(0, YB + HR, WZ - 0.2); G.add(topLine);
    var dc = cnv(64, 4), dx = dc.getContext("2d"); dx.fillStyle = "#fff"; dx.fillRect(0, 0, 40, 4); var dtex = new THREE.CanvasTexture(dc); dtex.wrapS = THREE.RepeatWrapping; dtex.repeat.set(26, 1);
    var emfLine = mesh(new THREE.PlaneGeometry(XB - XA + 0.9, 0.05), new THREE.MeshBasicMaterial({ color: 0x5fe08a, alphaMap: dtex, transparent: true, depthWrite: false })); emfLine.position.z = WZ - 0.04; G.add(emfLine);
    var eBar = mesh(new THREE.BoxGeometry(0.08, 1, 0.08), std(0x3fae6a, 0.4, { emissive: new THREE.Color(0x1f7a44), emissiveIntensity: 0.5 })); eBar.geometry.translate(0, -0.5, 0); G.add(eBar);
    var klBar = mesh(new THREE.BoxGeometry(0.07, 1, 0.07), std(0xffb347, 0.4, { emissive: new THREE.Color(0xff8a00), emissiveIntensity: 0.5 })); klBar.geometry.translate(0, -0.5, 0); G.add(klBar);
    var gapBar = mesh(new THREE.BoxGeometry(0.07, 1, 0.07), std(0xff5a5a, 0.4, { emissive: new THREE.Color(0xd92a2a), emissiveIntensity: 0.6 })); gapBar.geometry.translate(0, -0.5, 0); G.add(gapBar);
    var nullRing = mesh(new THREE.TorusGeometry(0.14, 0.022, 8, 28), new THREE.MeshBasicMaterial({ color: 0x7dff9e, transparent: true, opacity: 0, depthWrite: false })); nullRing.renderOrder = 8; G.add(nullRing);
    var tick = mesh(new THREE.BoxGeometry(0.02, YB - WY - 0.05, 0.02), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.35 })); G.add(tick);
    /* driver accumulator, test dry cell, centre-zero galvanometer */
    var drv = null, drvKey = "", tbat = null;
    var cell = new THREE.Group(), cellCan = cnv(256, 128), cellTex = srgb(new THREE.CanvasTexture(cellCan));
    cell.add(mesh(lathe([[0, -0.45], [0.19, -0.45], [0.2, -0.43], [0.2, 0.43], [0.19, 0.45], [0, 0.45]], 26), std(0xffffff, 0.45, { map: cellTex, metalness: 0.2 })));
    cell.add(mesh(lathe([[0, 0.44], [0.07, 0.44], [0.07, 0.5], [0, 0.51]], 14), brass));
    cell.rotation.z = Math.PI / 2; cell.position.set(-0.1, 0.36, -1.05); G.add(cell);         // + cap points to -x (towards A)
    var gal = new THREE.Group(); gal.position.set(2.15, 0.62, -1.0); G.add(gal);
    gal.add(mesh(lathe([[0, -0.12], [0.46, -0.12], [0.48, -0.08], [0.48, 0.1], [0.44, 0.13], [0, 0.13]], 36).rotateX(Math.PI / 2), std(0x23262c, 0.4)));
    var gfc = cnv(256, 256), gx = gfc.getContext("2d");
    gx.fillStyle = "#f2ead6"; gx.beginPath(); gx.arc(128, 128, 128, 0, TAU); gx.fill(); gx.strokeStyle = "#1d232b"; gx.fillStyle = "#1d232b"; gx.lineWidth = 3;
    for (var gt = -10; gt <= 10; gt++) { var ga = -Math.PI / 2 + gt * 4.5 * Math.PI / 180, r0 = gt % 5 === 0 ? 70 : 82; gx.beginPath(); gx.moveTo(128 + Math.cos(ga) * r0, 150 + Math.sin(ga) * r0); gx.lineTo(128 + Math.cos(ga) * 98, 150 + Math.sin(ga) * 98); gx.stroke(); }
    gx.font = "700 30px system-ui, sans-serif"; gx.textAlign = "center"; gx.fillText("0", 128, 40); gx.fillText("G", 128, 205);
    var face = mesh(new THREE.CircleGeometry(0.42, 36), std(0xffffff, 0.6, { map: srgb(new THREE.CanvasTexture(gfc)) })); face.position.z = 0.135; gal.add(face);
    var needle = new THREE.Group(), ns = new THREE.Shape(); ns.moveTo(-0.012, 0); ns.lineTo(0.012, 0); ns.lineTo(0.003, 0.36); ns.lineTo(-0.003, 0.36); ns.lineTo(-0.012, 0);
    needle.add(mesh(plate(ns, 0.008), std(0xb0182b, 0.4))); needle.position.set(0, -0.09, 0.15); gal.add(needle);
    var gcover = mesh(new THREE.CircleGeometry(0.43, 36), glass(0xffffff, 0.12)); gcover.position.z = 0.17; gal.add(gcover);
    [-0.3, 0.3].forEach(function (x) { var bp = bindingPost(x < 0 ? 0xc0392b : 0x15171a, 0.6); bp.position.set(x, -0.48, 0.05); gal.add(bp); });
    var leads = new THREE.Group(); G.add(leads);
    var redM = std(0xb8322a, 0.5), blkM = std(0x1d2026, 0.5), yelM = std(0xd6a21e, 0.5);
    var beadM = std(0xffb347, 0.3, { emissive: new THREE.Color(0xff9a1f), emissiveIntensity: 0.85 }), NB = 12;
    var gb = new THREE.InstancedMesh(new THREE.SphereGeometry(0.045, 8, 6), beadM, NB); gb.frustumCulled = false; G.add(gb);
    var jLead = null, gPath = null, gLen = 1, gu = 0;
    /* test-cell energy bar: E = V + Ir (Ir -> 0 at the null point) */
    var cb = stackBar([{ id: "V", color: 0x3fae6a }, { id: "L", color: 0xd9534f }], 0.26); cb.position.set(1.0, 0.14, -1.05); cb.userData.env.scale.y = 0.95; G.add(cb);
    var lbA = makeLabel("A", "#ffe7a6", 0.28), lbB = makeLabel("B", "#ffe7a6", 0.28), lbE = makeLabel("E", "#bff0cf", 0.26), lbEL = makeLabel("cell EMF", "#bff0cf", 0.24), lbR = makeLabel("V falls A → B", "#ffd8a8", 0.26), lbD = makeLabel("driver", "#dfe5ea", 0.22), lbG = makeLabel("G", "#dfe5ea", 0.22);
    lbA.position.set(XA - 0.2, YB + HR + 0.3, WZ); lbB.position.set(XB + 0.15, YB - 0.3, WZ); lbR.position.set(0.9, YB + HR * 0.75, WZ); lbG.position.set(2.15, 1.32, -1.0);
    [lbA, lbB, lbE, lbEL, lbR, lbD, lbG].forEach(function (l) { G.add(l); ctx.labels.push(l); });
    function drawCell(E) {
      var x = cellCan.getContext("2d"); var g2 = x.createLinearGradient(0, 0, 256, 0); g2.addColorStop(0, "#1f4e8c"); g2.addColorStop(1, "#163a69");
      x.fillStyle = "#b9bec4"; x.fillRect(0, 0, 256, 128); x.fillStyle = g2; x.fillRect(0, 10, 256, 108); x.fillStyle = "#f2c94c"; x.fillRect(0, 54, 256, 6);
      x.save(); x.translate(128, 64); x.rotate(-Math.PI / 2); x.fillStyle = "#fff"; x.font = "700 30px system-ui, sans-serif"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText(E.toFixed(2) + " V", 0, 0); x.restore();
      cellTex.needsUpdate = true;
    }
    var lastE = null, lastL = null, jl = 50, seek = null, needleA = 0, ringT = 0, wasBal = false;
    /* the test source: a dry cell up to 2.2 V, otherwise a lead-acid battery of round(E/2) cells (e.g. Emeka's 12 V battery) */
    function rebuildStatic() {
      var nC = clamp(Math.ceil(P.k * 100 * 1.25 / CELL_EMF), 1, 6), nT = P.E_cell > 2.2 ? clamp(Math.round(P.E_cell / CELL_EMF), 2, 6) : 0, k2 = nC + "|" + nT;
      if (k2 !== drvKey) {
        drvKey = k2; if (drv) { G.remove(drv); disposeTree(drv); }
        if (tbat) { G.remove(tbat); disposeTree(tbat); tbat = null; }
        var px = -0.62, py = 0.36, mx = 0.42, my = 0.36;
        cell.visible = !nT;
        if (nT) {
          tbat = buildBattery(nT, { interior: false }); tbat.scale.setScalar(0.3); tbat.position.set(-0.1, 0.14, -1.05); G.add(tbat);
          var ut = tbat.userData; px = -0.1 + ut.xp * 0.3; mx = -0.1 + ut.xn * 0.3; py = my = 0.14 + (ut.top - 0.12) * 0.3;
          parts.cell = tagPart(tbat, "cell");
        } else parts.cell = cell;
        drv = buildBattery(nC, { interior: false }); drv.scale.setScalar(0.36); drv.position.set(-2.1, 0.14, -1.05); G.add(drv);
        var u = drv.userData;
        while (leads.children.length) disposeTree(leads.children.pop());
        var dpx = -2.1 + u.xp * 0.36, dnx = -2.1 + u.xn * 0.36, dy = 0.14 + (u.top - 0.12) * 0.36, dz = -1.05;
        leads.add(tubeOn(roundedPath([[dpx, dy, dz], [dpx, dy + 0.25, dz], [XA - 0.12, dy + 0.25, dz], [XA - 0.12, 0.42, -0.3]], 0.12), 0.03, 40, 6, redM));
        leads.add(tubeOn(roundedPath([[dnx, dy, dz], [dnx, dy + 0.18, dz], [dnx, dy + 0.18, -1.55], [XB + 0.12, dy + 0.18, -1.55], [XB + 0.12, 0.42, -0.3]], 0.12), 0.03, 60, 6, blkM));
        leads.add(tubeOn(roundedPath([[px, py, -1.05], [px, py + 0.12, -1.05], [-1.0, py + 0.12, -1.05], [-1.0, 0.36, -0.6], [XA - 0.12, 0.36, -0.6], [XA - 0.12, 0.42, 0.25]], 0.1), 0.03, 50, 6, redM));
        leads.add(tubeOn(roundedPath([[mx, my, -1.05], [mx, my + 0.12, -1.05], [mx + 0.1, 0.25, -1.4], [1.85, 0.25, -1.4], [1.85, 0.27, -0.95]], 0.1), 0.03, 50, 6, blkM));
        lbD.position.set(-2.1, 1.05, -1.05);
        parts.driver = tagPart(drv, "driver"); tagPart(leads, "leads"); parts.leads = leads; ctx.partsChanged();
      }
    }
    function rebuildJockeyLead(l) {
      if (jLead) { G.remove(jLead); jLead.geometry.dispose(); }
      var x = xl(l), pts = [[2.45, 0.27, -0.95], [2.6, 0.5, -0.55], [x + 0.35, 1.05, 0.05], [x, 0.98, WZ]];
      gPath = new THREE.CatmullRomCurve3(pts.map(function (a) { return new V3(a[0], a[1], a[2]); })); gLen = gPath.getLength();
      jLead = tubeOn(gPath, 0.026, 40, 6, yelM); tagPart(jLead, "leads"); G.add(jLead);
    }
    function apply(p) {
      P = p; jl = clamp(p.l, 0, 100); P.l = jl; M = solveRamp(P);
      rebuildStatic();
      if (p.E_cell !== lastE) { lastE = p.E_cell; drawCell(p.E_cell); }
      if (cb) cb.position.x = tbat ? 1.1 : 1.0;
      lbE.userData.setText("E " + p.E_cell.toFixed(2) + " V");
    }
    function placeJockey(dt) {
      M = solveRamp(P);
      var x = xl(jl), fA = YB + HR, yJ = YB + HR * (1 - jl / 100), yE = fA - HR * P.E_cell / (P.k * 100), yEc = Math.max(YB - 0.6, yE);
      jockey.position.set(x, WY - 0.005, WZ);
      if (Math.abs(jl - (lastL == null ? -9 : lastL)) > 0.05) { lastL = jl; rebuildJockeyLead(jl); }
      tick.position.set(x, (WY + YB) / 2 + 0.02, WZ - 0.2);
      klBar.position.set(x, fA, WZ - 0.02); klBar.scale.y = Math.max(0.001, fA - yJ);
      var top = Math.max(yJ, yEc), bot = Math.min(yJ, yEc); gapBar.position.set(x + 0.09, top, WZ - 0.02); gapBar.scale.y = Math.max(0.001, top - bot); gapBar.visible = !M.balanced;
      emfLine.position.set((XA + XB) / 2 + 0.2, yEc, WZ - 0.04); emfLine.visible = yE >= YB - 0.6;
      eBar.position.set(XA - 0.3, fA, WZ); eBar.scale.y = Math.max(0.001, fA - yEc);
      lbE.position.set(XA + 0.8, (fA + yEc) / 2, WZ + 0.3); lbEL.position.set(XB + 0.2, yEc + 0.25, WZ);
      nullRing.position.set(x, yJ, WZ - 0.02);
      if (M.balanced && !wasBal) ringT = 1.2; wasBal = M.balanced;
      ringT = Math.max(0, ringT - (dt || 0)); nullRing.visible = M.balanced; nullRing.material.opacity = 0.55 + 0.45 * Math.min(1, ringT); nullRing.scale.setScalar(1 + ringT * 0.6);
    }
    function update(dt) {
      if (!P) return;
      if (seek != null) {
        var d = seek - jl, st = 30 * dt;
        if (Math.abs(d) <= st) { jl = seek; P.l = seek; seek = null; M = solveRamp(P); ctx.emit("balance", solveRamp(P)); }
        else { jl += st * Math.sign(d); P.l = jl; }
      }
      placeJockey(dt);
      var I = M.raw.I * 1000, tgt = clamp(I / P.I_fs_mA, -1.1, 1.1) * 45 * Math.PI / 180;
      needleA += (tgt - needleA) * Math.min(1, dt * 6); needle.rotation.z = -needleA;
      /* galvanometer-branch charge: rate ∝ |I|, direction from the sign of (E - k l) */
      var sp2 = clamp(Math.abs(I) / (Math.abs(I) + 3), 0, 1) * 0.9 / gLen;
      gu = (gu + (I > 0 ? 1 : -1) * sp2 * dt + 1) % 1;
      for (var b = 0; b < NB; b++) { var u = (gu + b / NB) % 1, pt = gPath.getPointAt(u); setInst(gb, b, pt.x, pt.y, pt.z, Math.abs(I) > 0.005 ? 1 : 0.0001); }
      gb.instanceMatrix.needsUpdate = true;
      /* test-cell bar: V_terminal + |Ir| (E line at the top of the glass) */
      var hE = 0.95, sV = cb.userData.segs.V, sL = cb.userData.segs.L, vt = M.V_terminal, lo = Math.abs(M.raw.I * P.r_cell);
      sV.scale.y = Math.max(0.001, hE * Math.min(vt, P.E_cell) / P.E_cell); sL.position.y = sV.scale.y; sL.scale.y = Math.max(0.001, hE * lo / P.E_cell);
    }
    parts.wire = tagPart(wire, "wire"); parts.jockey = tagPart(jockey, "jockey"); parts.ramp = tagPart(rampM, "ramp"); tagPart(edge, "ramp"); tagPart(topLine, "ramp");
    parts.emf = tagPart(emfLine, "emf"); tagPart(eBar, "emf"); parts.kl = tagPart(klBar, "kl"); parts.gap = tagPart(gapBar, "gap");
    parts.galvanometer = tagPart(gal, "galvanometer"); parts.needle = tagPart(needle, "needle"); parts.cell = tagPart(cell, "cell"); parts.cellBar = tagPart(cb, "cellBar");
    parts.scale = tagPart(rule, "scale"); parts.strips = tagPart(strips, "strips"); parts.board = tagPart(board, "board"); parts.beads = tagPart(gb, "beads");
    return {
      group: G, parts: parts, apply: apply, update: update, reading: function () { var r = solveRamp(P); r.seeking = seek != null; return r; },
      findBalance: function () { var r = solveRamp(P); if (!r.reachable) return false; seek = r.raw.lbal; return true; },
      resetCounts: function () { seek = null; },
      views: { all: [0.1, 1.3, -0.2, 10.4], wire: [0, 0.4, 0.3, 7.4], jockey: [0, 0.6, 0.3, 3.0], ramp: [0, 2.2, 0, 7.2], emf: [-1.0, 2.0, 0, 6.4], kl: [0, 2.2, 0, 6.4], gap: [0, 2.2, 0, 6.4],
        galvanometer: [2.15, 0.6, -1.0, 2.4], needle: [2.15, 0.6, -1.0, 1.8], cell: [0.1, 0.5, -1.0, 2.6], cellBar: [0.6, 0.6, -1.0, 2.4], driver: [-2.1, 0.5, -1.0, 2.6],
        scale: [0, 0.2, 0.6, 7.0], strips: [-3.2, 0.3, 0, 2.6], board: [0, 0.2, -0.3, 8.0], leads: [0, 0.5, -0.6, 7.4], beads: [1.5, 0.7, -0.4, 4.4] }
    };
  }

  /* ===================================================================
     10. create(): one group, five lazily built modes
     =================================================================== */
  var BUILDERS = { lattice: buildLattice, cell: buildCell, node: buildNode, coil: buildCoil, ramp: buildRamp };
  function copyP(m, extra) { var o = {}, k; for (k in DEFAULTS[m]) o[k] = DEFAULTS[m][k]; if (extra) for (k in extra) o[k] = extra[k]; return o; }

  function create(opts) {
    opts = opts || {};
    var g = new THREE.Group(); g.name = "DcConceptZoom";
    var S = { mode: null, labels: opts.labels !== false, speed: opts.speed || 1, onEvent: opts.onEvent || null, t: 0 };
    var base = opts.params || {}, params = {}, built = {}, cur = null, listeners = {}, allLabels = [];
    Object.keys(BUILDERS).forEach(function (m) { params[m] = copyP(m, base[m]); });
    var startMode = BUILDERS[opts.mode] ? opts.mode : "lattice";
    Object.keys(opts).forEach(function (k) { if (k in DEFAULTS[startMode] && k !== "mode") params[startMode][k] = opts[k]; });

    function emit(name, detail) {
      if (S.onEvent) { try { S.onEvent(name, detail); } catch (e) { if (window.console) console.warn(e); } }
      (listeners[name] || []).forEach(function (f) { try { f(detail); } catch (e) {} });
    }
    function syncParts() { if (!cur) return; g.parts = cur.parts; g.userData.parts = cur.parts; }
    function ensure(m) {
      if (built[m]) return built[m];
      var ctx = { S: S, labels: [], emit: emit, partsChanged: syncParts };
      var b = BUILDERS[m](ctx); b.ctx = ctx; b.group.name = "mode-" + m; b.group.visible = false; g.add(b.group);
      ctx.labels.forEach(function (l) { l.visible = S.labels; allLabels.push(l); });
      built[m] = b; return b;
    }
    function setMode(m) {
      if (!BUILDERS[m]) return false;
      clearHL();
      Object.keys(built).forEach(function (k) { built[k].group.visible = false; });
      var b = ensure(m); S.mode = m; cur = b; b.group.visible = true;
      syncParts(); b.apply(params[m]); syncParts(); b.update(0.016, S.t);
      emit("mode", { mode: m });
      return true;
    }
    function setState(o) {
      o = o || {};
      if (o.onEvent) S.onEvent = o.onEvent;
      if (o.speed != null) S.speed = clamp(+o.speed, 0, 4);
      if (o.labels != null) { S.labels = !!o.labels; allLabels.forEach(function (l) { l.visible = S.labels; }); }
      if (o.mode && o.mode !== S.mode) setMode(o.mode);
      if (o.params) Object.keys(o.params).forEach(function (m) { if (params[m]) for (var k in o.params[m]) params[m][k] = o.params[m][k]; });
      var p = params[S.mode], touched = false;
      Object.keys(o).forEach(function (k) { if (k in p && k !== "mode") { p[k] = o[k]; touched = true; } });
      if (S.mode === "coil") { if (o.input != null && o.value == null) p.value = null; }
      if (o.reset) return reset();
      if (cur) cur.apply(p);
      if (touched || o.params) emit("state", reading());
      return reading();
    }
    function reset() {
      params[S.mode] = copyP(S.mode, base[S.mode]);
      if (cur.resetCounts) cur.resetCounts();
      cur.apply(params[S.mode]); clearHL();
      emit("reset", { mode: S.mode });
      return reading();
    }
    function reading() { return cur ? cur.reading() : null; }
    function findBalance() { if (!cur || !cur.findBalance) return false; return cur.findBalance(); }

    /* highlight: clone the materials of the named part, pulse their emissive glow */
    var hl = [];
    function clearHL() { hl.forEach(function (h) { h.mesh.material = h.orig; }); hl = []; }
    function highlight(name) {
      clearHL(); if (!name || !cur) return;
      var found = [];
      cur.group.traverse(function (o) { if (o.isMesh && o.userData && o.userData.partId === name) found.push(o); });
      if (!found.length && cur.parts[name]) cur.parts[name].traverse(function (o) { if (o.isMesh) found.push(o); });
      found.forEach(function (o) {
        if (!o.material || Array.isArray(o.material) || !o.material.emissive) return;
        var c = o.material.clone(); hl.push({ mesh: o, orig: o.material, mat: c }); c.emissive = new THREE.Color(0xffd166); o.material = c;
      });
    }
    function viewFor(name) {
      var tbl = cur ? (cur.viewsFn ? cur.viewsFn() : cur.views) : { all: [0, 1, 0, 8] }, v = tbl[name] || tbl.all;
      g.updateMatrixWorld(true);
      var t = g.localToWorld(new V3(v[0], v[1], v[2]));
      return { target: [t.x, t.y, t.z], dist: v[3] * g.scale.x, pitch: 0.16 };
    }
    function pickPart(raycaster) {
      if (!cur) return null;
      var hits = raycaster.intersectObjects(cur.group.children, true);
      for (var i = 0; i < hits.length; i++) {
        var o = hits[i].object, id = o.userData && o.userData.partId, vis = true, q = o;
        while (q) { if (q.visible === false) { vis = false; break; } q = q.parent; }
        if (vis && id && id !== "label" && id !== "flash" && !(o.material && o.material.opacity < 0.05)) return id;
      }
      return null;
    }
    function update(dt, t) {
      dt = Math.min(dt || 0.016, 0.05) * S.speed; S.t += dt;
      if (cur) cur.update(dt, S.t);
      if (hl.length) { var k = 0.35 + 0.3 * Math.sin(S.t * 6); hl.forEach(function (h) { h.mat.emissiveIntensity = k; }); }
    }

    g.group = g; g.tick = update; g.update = update; g.setState = setState; g.setMode = setMode; g.reading = reading; g.reset = reset;
    g.findBalance = findBalance; g.highlight = highlight; g.viewFor = viewFor; g.pickPart = pickPart;
    g.triangles = function () { return cur ? countTris(cur.group) : 0; };
    g.on = function (name, fn) { (listeners[name] = listeners[name] || []).push(fn); return g; };
    g.params = function () { return params[S.mode]; };
    g.modes = Object.keys(BUILDERS);
    g.userData.update = update; g.userData.setState = setState;
    setMode(startMode);
    return g;
  }

  /* pulsing emissive highlight on named parts (partId), for any scene */
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

  window.DcConceptZoom = { create: create, makeHighlighter: makeHighlighter, model: MODEL, defaults: DEFAULTS, modes: Object.keys(BUILDERS), version: 1 };
})();
