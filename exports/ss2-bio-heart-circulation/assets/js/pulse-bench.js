/* =========================================================
   StudyPipe · PulseBench v1 — radial pulse, exercise and blood-pressure practical (SS2 Lesson 04)
   Classic script (no modules), 100% offline, uses window.THREE. Optional: window.HeartKit (beating heart on a stand),
   window.SceneKit is not needed.

   PulseBench.create(opts) -> THREE.Group g with
     g.group / g.parts / g.userData.parts   { bench, arm, wrist, hand, radialArtery, fingers, stopwatch, step, mannequin,
                                              cuff, manometer, mercury, pump, aortaLine, heart, san, avn, his, purkinje }
     g.tick / g.update / g.userData.update(dt, t)
     g.setState(obj)   { speed, xray, bpmRest, onEvent, t_min, reset }
     g.reading()       numbers computed from the model (never typed text)
     g.restCount() g.countNow() g.exercise() g.nextMinute() g.measureBP() g.runAll() g.reset()
     g.viewFor(partName)  { target:[x,y,z], dist }   g.pickPart(raycaster) -> partId | null
   Model:  bpm(t) = Fritsch-Carlson monotone cubic through 132, 116, 96, 80, 72, 68 bpm at 0..5 min after exercise
           (the same curve as the hub explorer); resting 68 bpm; count15 = round(bpm * 15 / 60);
           repeated counts carry +/-1 beat of noise (first count in each context is exact); blood pressure 120/80 mmHg.
   ========================================================= */
(function () {
  "use strict";
  if (typeof THREE === "undefined") return;
  var V3 = THREE.Vector3, TAU = Math.PI * 2;

  /* ---------------- the model ---------------- */
  var KNOT_T = [0, 1, 2, 3, 4, 5];
  var KNOT_B = [132, 116, 96, 80, 72, 68];
  var REST_BPM = 68, PEAK_BPM = 132, COUNT_S = 15, EXERCISE_MIN = 2, BP_SYS = 120, BP_DIA = 80, BP_MAX = 300;

  function tangents(xs, ys) {
    var n = xs.length, d = [], m = [], k;
    for (k = 0; k < n - 1; k++) d[k] = (ys[k + 1] - ys[k]) / (xs[k + 1] - xs[k]);
    m[0] = d[0]; m[n - 1] = d[n - 2];
    for (k = 1; k < n - 1; k++) m[k] = (d[k - 1] * d[k] <= 0) ? 0 : (d[k - 1] + d[k]) / 2;
    for (k = 0; k < n - 1; k++) {
      if (d[k] === 0) { m[k] = 0; m[k + 1] = 0; continue; }
      var a = m[k] / d[k], b = m[k + 1] / d[k], s = a * a + b * b;
      if (s > 9) { var tau = 3 / Math.sqrt(s); m[k] = tau * a * d[k]; m[k + 1] = tau * b * d[k]; }
    }
    return m;
  }
  var KNOT_M = tangents(KNOT_T, KNOT_B);
  /* heart rate (beats per minute) t minutes after exercise stops */
  function bpmAt(t) {
    var n = KNOT_T.length;
    if (t <= KNOT_T[0]) return KNOT_B[0];
    if (t >= KNOT_T[n - 1]) return KNOT_B[n - 1];
    var k = 0; while (t > KNOT_T[k + 1]) k++;
    var h = KNOT_T[k + 1] - KNOT_T[k], u = (t - KNOT_T[k]) / h, u2 = u * u, u3 = u2 * u;
    return (2 * u3 - 3 * u2 + 1) * KNOT_B[k] + (u3 - 2 * u2 + u) * h * KNOT_M[k] + (-2 * u3 + 3 * u2) * KNOT_B[k + 1] + (u3 - u2) * h * KNOT_M[k + 1];
  }
  function count15(bpm, attempt, ctx) {
    var base = Math.round(bpm * COUNT_S / 60);
    if (!attempt) return base;                       // the first count in a context is exact
    return base + ((attempt + ctx) % 2 ? 1 : -1);    // repeats: +1 / -1 in turn, so a triple averages to the true value
  }
  function round1(x) { return Math.round(x * 10) / 10; }

  /* ---------------- helpers ---------------- */
  function rng(seed) { var s = (seed || 1) >>> 0; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  function srgb(tex) {
    if ("colorSpace" in tex && THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
    else if (THREE.sRGBEncoding) tex.encoding = THREE.sRGBEncoding;
    return tex;
  }
  function canvas(w, h) { var c = document.createElement("canvas"); c.width = w; c.height = h; return c; }
  function ctex(c, rx, ry) {
    var t = srgb(new THREE.CanvasTexture(c));
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    if (rx) t.repeat.set(rx, ry || rx);
    return t;
  }
  function std(color, rough, extra) {
    var m = new THREE.MeshStandardMaterial({ color: color, roughness: rough == null ? 0.5 : rough, metalness: 0.0 });
    if (extra) for (var k in extra) m[k] = extra[k];
    return m;
  }
  function steel(color, rough) { return std(color || 0xc9d0d6, rough == null ? 0.3 : rough, { metalness: 0.55 }); }
  function tagPart(obj, key) {
    if (!obj) return obj;
    obj.userData = obj.userData || {};
    obj.userData.partId = key;
    obj.traverse(function (c) { c.userData = c.userData || {}; if (!c.userData.partId) c.userData.partId = key; });
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
  /* flat slab lying on y=0, top at y = thick (+ bevel) */
  function slab(w, d, thick, r, bevel, shape) {
    var g = new THREE.ExtrudeGeometry(shape || rr(w, d, r), { depth: thick, bevelEnabled: true, bevelSize: bevel, bevelThickness: bevel, bevelSegments: 2, curveSegments: 10 });
    g.rotateX(-Math.PI / 2); g.translate(0, bevel, 0);
    return g;
  }
  function uvPlanar(geo, sx, sy) {
    var p = geo.attributes.position, uv = new Float32Array(p.count * 2);
    for (var i = 0; i < p.count; i++) { uv[i * 2] = p.getX(i) * sx; uv[i * 2 + 1] = p.getZ(i) * sy; }
    geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
    return geo;
  }
  function smooth(a, b, x) { var t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); }
  function capsule(len, r0, r1) {
    var pts = [], i, N = 7;
    for (i = 0; i <= N; i++) { var a = (i / N) * Math.PI / 2; pts.push(new THREE.Vector2(Math.sin(a) * r0, r0 - Math.cos(a) * r0)); }
    for (i = 0; i <= N; i++) { var b = (i / N) * Math.PI / 2; pts.push(new THREE.Vector2(Math.cos(b) * r1, len - r1 + Math.sin(b) * r1)); }
    return new THREE.LatheGeometry(pts, 16);
  }

  /* generic sweep of an elliptical cross-section along a path.
     pointFn(u) -> V3 · radFn(u) -> [a (sideways), b (up)] · cap0/cap1 = fraction of the length that is closed into a dome.
     Pass an existing geometry to refill its positions (used for the pulsing artery and the inflating cuff). */
  var _T = new V3(), _P0 = new V3(), _P1 = new V3(), _S = new V3(), _U = new V3(), _REF = new V3(0, 1, 0), _REF2 = new V3(1, 0, 0);
  function sweep(geo, pointFn, radFn, nU, nR, cap0, cap1, uvScale) {
    var fresh = !geo, i, j, cols = nR + 1, pos;
    if (fresh) { geo = new THREE.BufferGeometry(); pos = new Float32Array((nU + 1) * cols * 3); } else pos = geo.attributes.position.array;
    var uv = fresh ? new Float32Array((nU + 1) * cols * 2) : null;
    for (i = 0; i <= nU; i++) {
      var u = i / nU, e = 0.002;
      pointFn(u, _P0);
      pointFn(Math.min(1, u + e), _P1); pointFn(Math.max(0, u - e), _T);
      _T.subVectors(_P1, _T).normalize();
      var ref = Math.abs(_T.y) > 0.95 ? _REF2 : _REF;
      _S.crossVectors(_T, ref).normalize(); _U.crossVectors(_S, _T).normalize();
      var ab = radFn(u), f = 1;
      if (cap0 && u < cap0) f = Math.sqrt(Math.max(0, 1 - Math.pow(1 - u / cap0, 2)));
      if (cap1 && u > 1 - cap1) f = Math.sqrt(Math.max(0, 1 - Math.pow(1 - (1 - u) / cap1, 2)));
      for (j = 0; j < cols; j++) {
        var th = (j / nR) * TAU, c = Math.cos(th) * ab[0] * f, s = Math.sin(th) * ab[1] * f, k = (i * cols + j) * 3;
        pos[k] = _P0.x + _S.x * c + _U.x * s; pos[k + 1] = _P0.y + _S.y * c + _U.y * s; pos[k + 2] = _P0.z + _S.z * c + _U.z * s;
        if (uv) { uv[(i * cols + j) * 2] = u * (uvScale || 1); uv[(i * cols + j) * 2 + 1] = j / nR; }
      }
    }
    if (fresh) {
      var idx = [];
      for (i = 0; i < nU; i++) for (j = 0; j < nR; j++) {
        var a = i * cols + j, b = a + 1, c2 = a + cols, d = c2 + 1;
        idx.push(a, c2, b, b, c2, d);
      }
      geo.setIndex(idx);
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
    } else geo.attributes.position.needsUpdate = true;
    geo.computeVertexNormals();
    return geo;
  }
  function colorize(geo, fn) {
    var p = geo.attributes.position, n = geo.attributes.normal, col = new Float32Array(p.count * 3), c = [0, 0, 0];
    for (var i = 0; i < p.count; i++) { fn(p.getX(i), p.getY(i), p.getZ(i), n.getX(i), n.getY(i), n.getZ(i), i, c); col[i * 3] = c[0]; col[i * 3 + 1] = c[1]; col[i * 3 + 2] = c[2]; }
    geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
  }

  /* ---------------- procedural textures (seeded, offline) ---------------- */
  function skinTex() {
    var c = canvas(256, 128), x = c.getContext("2d"), r = rng(12), i;
    x.fillStyle = "#e9e9e9"; x.fillRect(0, 0, 256, 128);
    for (i = 0; i < 2600; i++) { x.fillStyle = "rgba(" + (r() < 0.5 ? "255,255,255" : "60,50,45") + "," + (0.04 + r() * 0.1) + ")"; x.fillRect(r() * 256, r() * 128, 1 + r() * 1.4, 1 + r() * 1.4); }
    x.strokeStyle = "rgba(70,55,50,.07)"; x.lineWidth = 1;
    for (i = 0; i < 40; i++) { x.beginPath(); var y0 = r() * 128; x.moveTo(0, y0); x.quadraticCurveTo(128, y0 + (r() - 0.5) * 12, 256, y0 + (r() - 0.5) * 8); x.stroke(); }
    return ctex(c, 5, 1);
  }
  function benchTex() {
    var c = canvas(256, 256), x = c.getContext("2d"), r = rng(77), i;
    x.fillStyle = "#cfd6d9"; x.fillRect(0, 0, 256, 256);
    for (i = 0; i < 1800; i++) { x.fillStyle = "rgba(" + (r() < 0.5 ? "255,255,255" : "70,85,95") + "," + (0.03 + r() * 0.06) + ")"; x.fillRect(r() * 256, r() * 256, 1 + r() * 2, 1 + r() * 2); }
    return ctex(c, 4, 2);
  }
  function woodTex(seed, base) {
    var c = canvas(256, 256), x = c.getContext("2d"), r = rng(seed), i;
    x.fillStyle = base || "#c89a62"; x.fillRect(0, 0, 256, 256);
    for (i = 0; i < 80; i++) {
      var y0 = r() * 256, a = 0.05 + r() * 0.12;
      x.strokeStyle = "rgba(" + (r() < 0.5 ? "80,48,20" : "235,200,150") + "," + a + ")";
      x.lineWidth = 0.5 + r() * 2.2; x.beginPath(); x.moveTo(0, y0);
      for (var u = 0; u <= 256; u += 32) x.lineTo(u, y0 + Math.sin(u * 0.03 + i) * 3 + (r() - 0.5) * 1.5);
      x.stroke();
    }
    return ctex(c, 1, 1);
  }
  function clothTex(base, seed) {
    var c = canvas(128, 128), x = c.getContext("2d"), r = rng(seed || 5), i;
    x.fillStyle = base; x.fillRect(0, 0, 128, 128);
    x.strokeStyle = "rgba(255,255,255,.08)"; x.lineWidth = 1;
    for (i = 0; i < 128; i += 3) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, 128); x.stroke(); x.beginPath(); x.moveTo(0, i); x.lineTo(128, i); x.stroke(); }
    for (i = 0; i < 500; i++) { x.fillStyle = "rgba(0,0,0," + (r() * 0.06) + ")"; x.fillRect(r() * 128, r() * 128, 1, 1); }
    return ctex(c, 2, 1);
  }
  function cuffTex() {
    var c = canvas(256, 128), x = c.getContext("2d"), i;
    x.fillStyle = "#1c3a63"; x.fillRect(0, 0, 256, 128);
    x.strokeStyle = "rgba(255,255,255,.06)"; x.lineWidth = 1;
    for (i = 0; i < 256; i += 3) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, 128); x.stroke(); }
    x.strokeStyle = "rgba(245,245,245,.85)"; x.setLineDash([6, 4]); x.lineWidth = 2;
    x.strokeRect(6, 6, 244, 116);
    x.setLineDash([]);
    x.fillStyle = "rgba(245,245,245,.9)"; x.beginPath(); x.moveTo(128, 18); x.lineTo(112, 42); x.lineTo(144, 42); x.closePath(); x.fill();
    return ctex(c, 1, 1);
  }
  function scaleCard() {
    var c = canvas(160, 640), x = c.getContext("2d"), p;
    x.fillStyle = "#f6f3ea"; x.fillRect(0, 0, 160, 640);
    x.fillStyle = "#14202b"; x.strokeStyle = "#14202b"; x.textBaseline = "middle";
    var y0 = 620, k = 600 / BP_MAX;
    x.font = "bold 17px monospace"; x.textAlign = "right";
    for (p = 0; p <= BP_MAX; p += 10) {
      var y = y0 - p * k, major = p % 50 === 0, mid = p % 20 === 0;
      x.lineWidth = major ? 2.4 : 1.2;
      x.beginPath(); x.moveTo(88, y); x.lineTo(88 + (major ? 36 : mid ? 26 : 16), y); x.stroke();
      x.beginPath(); x.moveTo(72, y); x.lineTo(72 - (major ? 36 : mid ? 26 : 16), y); x.stroke();
      if (mid) { x.fillText(String(p), 52, y); x.textAlign = "left"; x.fillText(String(p), 108, y); x.textAlign = "right"; }
    }
    x.fillStyle = "#b4561b"; x.font = "bold 14px monospace"; x.textAlign = "center"; x.fillText("mmHg", 80, 12);
    return ctex(c, 1, 1);
  }

  /* ---------------- layout constants ---------------- */
  var XK = [-3.5, -3.0, -2.5, -2.0, -1.0, -0.3, 0.0, 0.15, 0.55, 1.0, 1.12];
  var RWK = [0.62, 0.64, 0.52, 0.50, 0.40, 0.30, 0.29, 0.38, 0.50, 0.50, 0.46];
  var RHK = [0.58, 0.60, 0.50, 0.46, 0.34, 0.22, 0.19, 0.14, 0.13, 0.12, 0.10];
  function interp(arr, x) {
    var n = XK.length, k = 0;
    if (x <= XK[0]) return arr[0]; if (x >= XK[n - 1]) return arr[n - 1];
    while (x > XK[k + 1]) k++;
    var x0 = XK[k], x1 = XK[k + 1], u = (x - x0) / (x1 - x0);
    var m0 = k > 0 ? (arr[k + 1] - arr[k - 1]) / (XK[k + 1] - XK[k - 1]) : (arr[1] - arr[0]) / (XK[1] - XK[0]);
    var m1 = k < n - 2 ? (arr[k + 2] - arr[k]) / (XK[k + 2] - XK[k]) : (arr[n - 1] - arr[n - 2]) / (XK[n - 1] - XK[n - 2]);
    var h = x1 - x0, u2 = u * u, u3 = u2 * u;
    return (2 * u3 - 3 * u2 + 1) * arr[k] + (u3 - 2 * u2 + u) * h * m0 + (-2 * u3 + 3 * u2) * arr[k + 1] + (u3 - u2) * h * m1;
  }
  function rw(x) { return interp(RWK, x); }
  function rh(x) { return interp(RHK, x); }
  var ART_Z = 0.10, ART_R = 0.03;
  function topY(x, z) { var a = rw(x), b = rh(x); return b + b * Math.sqrt(Math.max(0, 1 - (z / a) * (z / a))); }
  var WR0 = -1.3, WR1 = 0.35, HAND1 = 1.12;
  var CUFF_X0 = -3.0, CUFF_X1 = -2.35;
  var BENCH_Y = 0;

  /* ---------------- arm, wrist, hand ---------------- */
  function limbSegment(x0, x1, nU, skinMat, caps, nR) {
    var geo = sweep(null,
      function (u, p) { var x = x0 + (x1 - x0) * u; p.set(x, rh(x), 0); },
      function (u) { var x = x0 + (x1 - x0) * u; return [rw(x), rh(x)]; }, nU, nR || 28, caps[0], caps[1], (x1 - x0));
    colorize(geo, function (x, y, z, nx, ny, nz, i, c) {
      var volar = smooth(0.15, 0.85, ny) * smooth(-2.2, -0.2, x) * 0.7;
      var t = Math.max(0, Math.min(1, volar));
      c[0] = 0.30 + 0.20 * t; c[1] = 0.155 + 0.14 * t; c[2] = 0.095 + 0.10 * t;
      if (x > 0.2 && ny > 0.4) { var cr = Math.exp(-Math.pow((x - 0.18) / 0.03, 2)) * 0.35; c[0] *= 1 - cr; c[1] *= 1 - cr; c[2] *= 1 - cr; }   // wrist crease
    });
    return new THREE.Mesh(geo, skinMat);
  }
  function fingerTube(pts, r0, r1, skinMat, creases) {
    var cv = new THREE.CatmullRomCurve3(pts.map(function (p) { return new V3(p[0], p[1], p[2]); }), false, "centripetal");
    var geo = sweep(null, function (u, p) { cv.getPointAt(u, p); },
      function (u) { var r = r0 + (r1 - r0) * u; return [r, r * 0.93]; }, 20, 14, 0.02, 0.10, 1);
    colorize(geo, function (x, y, z, nx, ny, nz, i, c) {
      var u = (i / 15) / 20; u = Math.floor(i / 15) / 20;
      var t = smooth(0.1, 0.8, ny) * 0.75, cr = 0;
      if (creases) cr = (Math.exp(-Math.pow((u - 0.36) / 0.025, 2)) + Math.exp(-Math.pow((u - 0.68) / 0.025, 2))) * 0.3 * smooth(0, 0.6, ny);
      c[0] = (0.30 + 0.20 * t) * (1 - cr); c[1] = (0.155 + 0.14 * t) * (1 - cr); c[2] = (0.095 + 0.10 * t) * (1 - cr);
    });
    return new THREE.Mesh(geo, skinMat);
  }

  function buildArm(parts) {
    var g = new THREE.Group();
    var skinMap = skinTex();
    var skinMat = new THREE.MeshStandardMaterial({ color: 0xffffff, vertexColors: true, map: skinMap, bumpMap: skinMap, bumpScale: 0.25, roughness: 0.62, metalness: 0 });
    var armM = limbSegment(-3.5, WR0, 36, skinMat, [0.05, 0], 40);
    var wristM = limbSegment(WR0, WR1, 70, skinMat, [0, 0], 48);
    var handM = limbSegment(WR1, HAND1, 26, skinMat, [0, 0.06], 48);
    parts.arm = tagPart(armM, "arm"); parts.wrist = tagPart(wristM, "wrist"); parts.hand = tagPart(handM, "hand");
    g.add(armM, wristM, handM);

    /* fingers and thumb (palm up, relaxed curl) */
    var fingers = new THREE.Group();
    [[0.36, 0.78, 0.095], [0.12, 0.86, 0.10], [-0.12, 0.80, 0.092], [-0.35, 0.60, 0.078]].forEach(function (f, i) {
      var z = f[0], L = f[1], r = f[2], sp = (z - 0.0) * 0.12;
      fingers.add(fingerTube([[0.98, 0.10, z], [0.98 + L * 0.35, 0.115, z + sp * 0.4], [0.98 + L * 0.7, 0.16, z + sp * 0.8], [0.98 + L, 0.25, z + sp]], r, r * 0.74, skinMat, true));
    });
    fingers.add(fingerTube([[0.32, 0.12, 0.40], [0.66, 0.15, 0.62], [1.02, 0.20, 0.79], [1.30, 0.27, 0.86]], 0.135, 0.085, skinMat, true));
    g.add(fingers);
    parts.restFingers = fingers;

    /* radial artery: a real tube under the skin, radius pulses with the live waveform */
    var N = 48, ax0 = WR0 + 0.05, ax1 = 0.32;
    var artMat = std(0x8f1d2e, 0.35, { emissive: new THREE.Color(0xb3101f), emissiveIntensity: 0.25 });
    var rScale = new Float32Array(N + 1);
    function artPoint(u, p) { var x = ax0 + (ax1 - ax0) * u; p.set(x, topY(x, ART_Z) - 0.012, ART_Z); }
    function artRad(u) { var r = ART_R * (1 + rScale[Math.round(u * N)]); return [r, r]; }
    var artGeo = sweep(null, artPoint, artRad, N, 10, 0.01, 0.01, 1);
    var artery = new THREE.Mesh(artGeo, artMat);
    parts.radialArtery = tagPart(artery, "radialArtery");
    g.add(artery);
    g.userData.art = { geo: artGeo, point: artPoint, rad: artRad, rScale: rScale, N: N, x0: ax0, x1: ax1 };

    /* skin bulge over the artery: vertices of the wrist sweep, rest positions remembered */
    var wp = wristM.geometry.attributes.position, wn = wristM.geometry.attributes.normal, aff = [], base = [];
    for (var i = 0; i < wp.count; i++) {
      var x = wp.getX(i), z = wp.getZ(i);
      if (x > -1.25 && x < 0.34 && Math.abs(z - ART_Z) < 0.32 && wn.getY(i) > 0.15) { aff.push(i); base.push(wp.getX(i), wp.getY(i), wp.getZ(i), wn.getX(i), wn.getY(i), wn.getZ(i)); }
    }
    g.userData.bulge = { geo: wristM.geometry, idx: aff, base: base };
    g.userData.skinMat = skinMat;
    return g;
  }

  /* examiner's index and middle fingers (with nails) resting on the artery */
  function buildExaminer(skinMat) {
    var g = new THREE.Group(), nailMat = std(0xf0c9b8, 0.3, { emissive: new THREE.Color(0x201010), emissiveIntensity: 0.15 });
    function one(xTip, zTip, r, dz) {
      var tip = new V3(xTip, topY(xTip, ART_Z) + r * 0.78, zTip);
      var pts = [[xTip + 0.78, tip.y + 0.42, zTip + 0.78 + dz], [xTip + 0.52, tip.y + 0.27, zTip + 0.52 + dz * 0.7], [xTip + 0.24, tip.y + 0.10, zTip + 0.24 + dz * 0.3], [tip.x, tip.y, tip.z]];
      var cv = new THREE.CatmullRomCurve3(pts.map(function (p) { return new V3(p[0], p[1], p[2]); }), false, "centripetal");
      var geo = sweep(null, function (u, p) { cv.getPointAt(u, p); }, function (u) { var rr2 = r * (1.08 - 0.26 * u); return [rr2, rr2 * 0.92]; }, 26, 14, 0.01, 0.07, 1);
      colorize(geo, function (x, y, z, nx, ny, nz, i, c) {
        var u = Math.floor(i / 15) / 26, t = smooth(0.0, 0.7, -ny) * 0.8, cr = (Math.exp(-Math.pow((u - 0.45) / 0.02, 2)) + Math.exp(-Math.pow((u - 0.75) / 0.02, 2))) * 0.28;
        c[0] = (0.30 + 0.20 * t) * (1 - cr); c[1] = (0.155 + 0.14 * t) * (1 - cr); c[2] = (0.095 + 0.10 * t) * (1 - cr);
      });
      g.add(new THREE.Mesh(geo, skinMat));
      // nail on the back of the fingertip
      var pn = new V3(), tg = new V3();
      cv.getPointAt(0.935, pn); cv.getTangentAt(0.935, tg);
      var nail = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10, 0, TAU, 0, Math.PI / 2), nailMat);
      nail.scale.set(r * 0.62, r * 0.16, r * 0.5);              // long axis = local x (along the finger), dome up
      nail.quaternion.setFromUnitVectors(new V3(1, 0, 0), tg.clone().multiplyScalar(-1).normalize());
      nail.position.copy(pn).add(new V3(0, r * 0.82, 0));
      g.add(nail);
    }
    one(0.10, ART_Z + 0.01, 0.07, 0.0); one(-0.12, ART_Z + 0.07, 0.072, 0.0);
    // the examiner's hand behind the fingers: knuckles and palm, a flattened rounded block sloping up and away
    var dirv = new V3(0.7, 0.42, 0.7).normalize(), p0 = new V3(0.12 + 0.78, topY(0.0, ART_Z) + 0.6 + 0.02, ART_Z + 0.84);
    var palm = sweep(null, function (u, p) { p.copy(p0).addScaledVector(dirv, u * 0.55); },
      function (u) { return [0.17 + 0.2 * Math.sin(Math.min(1, u * 1.4) * Math.PI / 2), 0.07 + 0.05 * u]; }, 12, 20, 0.0, 0.3, 1);
    colorize(palm, function (x, y, z, nx, ny, nz, i, c) { var t = smooth(0.0, 0.7, -ny) * 0.8; c[0] = 0.30 + 0.20 * t; c[1] = 0.155 + 0.14 * t; c[2] = 0.095 + 0.10 * t; });
    var pm = new THREE.Mesh(palm, skinMat); pm.position.set(0, 0, 0); g.add(pm);
    return g;
  }

  /* ---------------- stopwatch ---------------- */
  function buildStopwatch(parts) {
    var g = new THREE.Group();
    var chrome = steel(0xd8dde2, 0.22), dark = std(0x23282e, 0.5);
    // case: rolled lathe profile
    var pts = [[0, -0.14], [0.50, -0.14], [0.56, -0.10], [0.585, -0.04], [0.585, 0.06], [0.55, 0.115], [0.50, 0.12], [0.48, 0.09], [0.0, 0.09]].map(function (p) { return new THREE.Vector2(p[0], p[1]); });
    var body = new THREE.Mesh(new THREE.LatheGeometry(pts, 40), chrome);
    // face with live canvas
    var fc = canvas(256, 256), ftex = ctex(fc), face = new THREE.Mesh(new THREE.CircleGeometry(0.47, 40), new THREE.MeshBasicMaterial({ map: ftex }));
    face.rotation.x = -Math.PI / 2; face.position.y = 0.093;
    var gl = new THREE.Mesh(new THREE.SphereGeometry(0.48, 32, 8, 0, TAU, 0, 0.35), new THREE.MeshStandardMaterial({ color: 0xddeeff, roughness: 0.05, transparent: true, opacity: 0.13, depthWrite: false }));
    gl.scale.y = 0.22; gl.position.y = 0.095;
    // winder crown and button (turned lathe), bow ring
    var crownP = [[0, 0], [0.07, 0], [0.075, 0.03], [0.105, 0.04], [0.105, 0.12], [0.09, 0.14], [0.0, 0.14]].map(function (p) { return new THREE.Vector2(p[0], p[1]); });
    var crown = new THREE.Mesh(new THREE.LatheGeometry(crownP, 20), chrome); crown.position.set(0, 0.0, -0.58); crown.rotation.x = -Math.PI / 2;
    var stem = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.09, 12), chrome); stem.rotation.x = Math.PI / 2; stem.position.set(0, 0.0, -0.6);
    var side = new THREE.Mesh(new THREE.LatheGeometry(crownP, 20), chrome);
    var sideG = new THREE.Group(); sideG.add(side); sideG.position.set(0.40, 0.0, -0.42); sideG.rotation.y = -0.78; side.scale.set(0.8, 0.8, 0.8);
    side.rotation.set(-Math.PI / 2, 0, 0);
    var bow = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.025, 10, 24), chrome); bow.position.set(0, 0, -0.74); bow.rotation.set(Math.PI / 2, 0, 0);
    // cradle (extruded wedge) so the face tilts toward the viewer
    var ws = new THREE.Shape(); ws.moveTo(-0.5, 0); ws.lineTo(0.5, 0); ws.lineTo(0.5, 0.1); ws.lineTo(-0.5, 0.42); ws.lineTo(-0.5, 0);
    var wg = new THREE.ExtrudeGeometry(ws, { depth: 1.1, bevelEnabled: true, bevelSize: 0.015, bevelThickness: 0.015, bevelSegments: 1 });
    wg.translate(0, 0, -0.55);
    var cradle = new THREE.Mesh(wg, std(0x3a4750, 0.6));
    var watch = new THREE.Group();
    watch.add(body, face, gl, crown, stem, sideG, bow);
    watch.rotation.set(0, 0, 0);
    watch.position.set(0, 0.16, 0);
    cradle.visible = false;
    g.add(watch);
    // tilt the whole watch toward the camera, resting on its bow side
    watch.rotation.x = 0.0;
    g.userData.tilt = watch;
    // draw the face
    var lastKey = "";
    function draw(sec, text, running) {
      var key = Math.round(sec * 20) + text + running; if (key === lastKey) return; lastKey = key;
      var x = fc.getContext("2d"), i;
      x.fillStyle = "#f7f5ef"; x.fillRect(0, 0, 256, 256);
      x.strokeStyle = "#14202b"; x.fillStyle = "#14202b"; x.textAlign = "center"; x.textBaseline = "middle";
      for (i = 0; i < 60; i++) {
        var a = (i / 60) * TAU, big = i % 5 === 0;
        x.lineWidth = big ? 3 : 1.2;
        x.beginPath(); x.moveTo(128 + Math.sin(a) * (big ? 100 : 108), 128 - Math.cos(a) * (big ? 100 : 108)); x.lineTo(128 + Math.sin(a) * 118, 128 - Math.cos(a) * 118); x.stroke();
        if (big) { x.font = "bold 17px monospace"; x.fillText(String(i === 0 ? 60 : i), 128 + Math.sin(a) * 84, 128 - Math.cos(a) * 84); }
      }
      // 15 s sector
      x.fillStyle = "rgba(180,86,27,.18)"; x.beginPath(); x.moveTo(128, 128); x.arc(128, 128, 76, -Math.PI / 2, -Math.PI / 2 + (15 / 60) * TAU); x.closePath(); x.fill();
      x.fillStyle = "#14202b"; x.font = "bold 22px monospace"; x.fillText(text, 128, 168);
      var a2 = (sec % 60) / 60 * TAU;
      x.strokeStyle = running ? "#c0392b" : "#6b3b36"; x.lineWidth = 3; x.beginPath(); x.moveTo(128 - Math.sin(a2) * 22, 128 + Math.cos(a2) * 22); x.lineTo(128 + Math.sin(a2) * 100, 128 - Math.cos(a2) * 100); x.stroke();
      x.fillStyle = "#c0392b"; x.beginPath(); x.arc(128, 128, 6, 0, TAU); x.fill();
      ftex.needsUpdate = true;
    }
    draw(0, "00:00.0", false);
    g.userData.draw = draw;
    parts.stopwatch = tagPart(g, "stopwatch");
    return g;
  }

  /* ---------------- step stool and the stepping figure ---------------- */
  var STEP_H = 0.34;
  function buildStep(parts) {
    var g = new THREE.Group();
    var wood = std(0xffffff, 0.7, { map: woodTex(21), bumpMap: woodTex(21, "#888"), bumpScale: 0.5 });
    var woodD = std(0xffffff, 0.75, { map: woodTex(33, "#a47446") });
    var rubber = std(0x23272b, 0.9);
    // top: slab with a hand-grip slot
    var sh = rr(1.15, 0.66, 0.07), slot = new THREE.Path();
    slot.moveTo(-0.2, -0.04); slot.lineTo(0.2, -0.04); slot.lineTo(0.2, 0.04); slot.lineTo(-0.2, 0.04); slot.lineTo(-0.2, -0.04);
    var top = new THREE.Mesh(uvPlanar(slab(0, 0, 0.045, 0, 0.012, sh), 0.9, 0.9), wood); top.position.y = STEP_H - 0.045;
    g.add(top);
    // rubber tread strip across the front edge
    var tread = new THREE.Mesh(uvPlanar(slab(1.0, 0.1, 0.012, 0.02, 0.004), 1, 1), rubber); tread.position.set(0, STEP_H + 0.012, 0.23);
    g.add(tread);
    // legs, splayed and tapered (lathe), with cross rails
    [[-0.46, -0.24, 0.07, -0.07], [0.46, -0.24, -0.07, -0.07], [-0.46, 0.24, 0.07, 0.07], [0.46, 0.24, -0.07, 0.07]].forEach(function (l) {
      var lp = [[0, 0], [0.04, 0], [0.05, 0.02], [0.062, STEP_H - 0.045], [0, STEP_H - 0.045]].map(function (p) { return new THREE.Vector2(p[0], p[1]); });
      var leg = new THREE.Mesh(new THREE.LatheGeometry(lp, 10), woodD);
      leg.position.set(l[0] + l[2] * 0.3, 0, l[1] + l[3] * 0.3); leg.rotation.z = -l[2] * 0.8; leg.rotation.x = l[3] * 0.8;
      g.add(leg);
      var foot = new THREE.Mesh(new THREE.CylinderGeometry(0.047, 0.047, 0.012, 10), rubber); foot.position.set(l[0] + l[2] * 0.3 + l[2] * 0.0, 0.006, l[1] + l[3] * 0.3);
      g.add(foot);
    });
    [[-0.5, 0], [0.5, 0]].forEach(function (r) {
      var rail = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.05, 0.42), woodD); rail.position.set(r[0], STEP_H * 0.42, 0); g.add(rail);
    });
    parts.step = tagPart(g, "step");

    /* the stepping figure: a wooden manikin built from lathes */
    var f = new THREE.Group(), skin = std(0xc9895b, 0.6), shirt = std(0x2f7d4f, 0.7), shorts = std(0x2b3a55, 0.7), shoe = std(0xf0f0ee, 0.5);
    var hips = new THREE.Group(); f.add(hips);
    var torsoP = [[0, 0], [0.10, 0.0], [0.115, 0.06], [0.125, 0.2], [0.14, 0.3], [0.13, 0.36], [0.07, 0.40], [0.045, 0.42], [0.0, 0.42]].map(function (p) { return new THREE.Vector2(p[0], p[1]); });
    var torso = new THREE.Mesh(new THREE.LatheGeometry(torsoP, 18), shirt); torso.scale.z = 0.7; torso.position.y = 0.0; hips.add(torso);
    var head = new THREE.Mesh(new THREE.SphereGeometry(0.085, 18, 14), skin); head.position.y = 0.52; head.scale.set(0.95, 1.1, 0.95); hips.add(head);
    var hair = new THREE.Mesh(new THREE.SphereGeometry(0.088, 18, 8, 0, TAU, 0, Math.PI * 0.45), std(0x1b1716, 0.9)); hair.position.y = 0.53; hair.scale.set(0.97, 1.1, 0.97); hair.rotation.x = -0.25; hips.add(hair);
    var armL = [], legL = [];
    [-1, 1].forEach(function (sd) {
      var sh2 = new THREE.Group(); sh2.position.set(0, 0.34, sd * 0.14);
      var up = new THREE.Mesh(capsule(0.17, 0.034, 0.03), skin); up.rotation.x = Math.PI; sh2.add(up);
      var el = new THREE.Group(); el.position.y = -0.17; var lo = new THREE.Mesh(capsule(0.15, 0.03, 0.024), skin); lo.rotation.x = Math.PI; el.add(lo); sh2.add(el);
      hips.add(sh2); armL.push({ sh: sh2, el: el });
      var hp = new THREE.Group(); hp.position.set(0, 0.0, sd * 0.06);
      var th = new THREE.Mesh(capsule(0.22, 0.056, 0.042), shorts); th.rotation.x = Math.PI; hp.add(th);
      var kn = new THREE.Group(); kn.position.y = -0.22;
      var sk = new THREE.Mesh(capsule(0.2, 0.04, 0.03), skin); sk.rotation.x = Math.PI; kn.add(sk);
      var ft = new THREE.Mesh(slab(0.15, 0.06, 0.035, 0.025, 0.006), shoe); ft.position.set(0.03, -0.215, 0); kn.add(ft);
      hp.add(kn); hips.add(hp); legL.push({ hp: hp, kn: kn });
    });
    f.position.set(0.0, 0.0, 0.0);
    hips.position.y = 0.46;
    var fig = new THREE.Group(); fig.add(f); fig.position.set(0, 0, 0);
    fig.rotation.y = 0;
    fig.userData.fig = { group: fig, hips: hips, armL: armL, legL: legL };
    parts.mannequin = tagPart(fig, "mannequin");
    return { step: g, figure: fig };
  }

  /* ---------------- cuff, hoses, bulb, mercury manometer ---------------- */
  function buildCuffAndMeter(parts) {
    var g = new THREE.Group();
    var cuffMat = std(0xffffff, 0.8, { map: cuffTex(), bumpMap: clothTex("#888"), bumpScale: 0.4 });
    var yc = 0.52;       // local axis height for the cuff sweep
    var cuffGeo = null, lastS = -1;
    function cuffRad(s) {
      return function (u) {
        var x = CUFF_X0 + (CUFF_X1 - CUFF_X0) * u, edge = Math.pow(Math.abs(2 * u - 1), 6), t = (0.035 + 0.11 * s) * Math.sqrt(Math.max(0, 1 - edge)) + 0.004;
        return [rw(x) + t, rh(x) + t];
      };
    }
    function cuffPoint(u, p) { var x = CUFF_X0 + (CUFF_X1 - CUFF_X0) * u; p.set(x, rh(x) - yc, 0); }
    function setCuff(s) { // s 0..1 inflation
      if (Math.abs(s - lastS) < 0.002) return; lastS = s;
      cuffGeo = sweep(cuffGeo, cuffPoint, cuffRad(s), 18, 40, 0, 0, 1);
    }
    setCuff(0);
    var cuff = new THREE.Mesh(cuffGeo, cuffMat); cuff.position.y = yc;
    parts.cuff = tagPart(cuff, "cuff");
    g.add(cuff);

    /* manometer: base plate, upright, scale card, glass tube, mercury */
    var M = new THREE.Group(), H = 2.35;
    var chromeM = steel(0xc7ced4, 0.28), plastic = std(0x2b3640, 0.55), brass = std(0xcfa24f, 0.35, { metalness: 0.4 });
    var base = new THREE.Mesh(slab(0.9, 0.7, 0.07, 0.07, 0.02), plastic); M.add(base);
    var back = new THREE.Mesh(slab(0.52, 0.04, 0.04, 0.01, 0.004), plastic); back.rotation.x = Math.PI / 2; back.position.set(0, 0.1 + H / 2, -0.12);
    back.scale.set(1, 1, 1);
    // upright plate (extruded rounded rectangle, standing)
    var plate = new THREE.Mesh(new THREE.ExtrudeGeometry(rr(0.50, H + 0.16, 0.05), { depth: 0.035, bevelEnabled: true, bevelSize: 0.01, bevelThickness: 0.01, bevelSegments: 1, curveSegments: 6 }), std(0x39454f, 0.5));
    plate.position.set(0, 0.1 + (H + 0.16) / 2 - 0.02, -0.14);
    M.add(plate);
    var card = new THREE.Mesh(new THREE.PlaneGeometry(0.40, H), new THREE.MeshBasicMaterial({ map: scaleCard() }));
    card.position.set(0, 0.10 + H / 2 + 0.04, -0.092);
    M.add(card);
    // glass tube (thin-walled lathe) with brass caps
    var tubeP = [[0.035, 0], [0.035, H], [0.028, H], [0.028, 0]].map(function (p) { return new THREE.Vector2(p[0], p[1]); });
    var tube = new THREE.Mesh(new THREE.LatheGeometry(tubeP, 14), new THREE.MeshStandardMaterial({ color: 0xcfe6f2, roughness: 0.06, transparent: true, opacity: 0.32, depthWrite: false, side: THREE.DoubleSide }));
    tube.position.set(0.0, 0.14, -0.04);
    var topCap = new THREE.Mesh(new THREE.LatheGeometry([[0, 0], [0.05, 0], [0.05, 0.05], [0.036, 0.075], [0.0, 0.08]].map(function (p) { return new THREE.Vector2(p[0], p[1]); }), 14), brass); topCap.position.set(0, 0.14 + H, -0.04);
    var botCap = new THREE.Mesh(new THREE.LatheGeometry([[0, 0], [0.06, 0], [0.06, 0.05], [0.04, 0.09], [0.0, 0.09]].map(function (p) { return new THREE.Vector2(p[0], p[1]); }), 14), brass); botCap.position.set(0, 0.07, -0.04);
    M.add(tube, topCap, botCap);
    // mercury: unit-height lathe scaled in y, domed meniscus on top, reservoir below
    var hgMat = std(0xe9eef2, 0.1, { metalness: 0.85, emissive: new THREE.Color(0x9aa5ae), emissiveIntensity: 0.28 });
    var col = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 1, 14), hgMat); col.geometry.translate(0, 0.5, 0);
    var men = new THREE.Mesh(new THREE.SphereGeometry(0.026, 14, 8, 0, TAU, 0, Math.PI / 2), hgMat); men.scale.y = 0.55;
    var hg = new THREE.Group(); hg.add(col, men); hg.position.set(0.0, 0.14, -0.04);
    var res = new THREE.Mesh(new THREE.LatheGeometry([[0, 0], [0.12, 0.01], [0.15, 0.04], [0.15, 0.09], [0.1, 0.12], [0.0, 0.12]].map(function (p) { return new THREE.Vector2(p[0], p[1]); }), 18), hgMat);
    res.position.set(0.0, 0.0, 0.1); res.visible = false;
    M.add(hg);
    // control valve knob on the base
    var knob = new THREE.Mesh(new THREE.LatheGeometry([[0, 0], [0.05, 0], [0.055, 0.03], [0.04, 0.07], [0.0, 0.075]].map(function (p) { return new THREE.Vector2(p[0], p[1]); }), 14), chromeM); knob.position.set(0.28, 0.07, 0.14);
    M.add(knob);
    M.position.set(-3.55, 0, -1.55);
    parts.manometer = tagPart(M, "manometer");
    parts.mercury = tagPart(hg, "mercury");
    function setMercury(mm) { var h = Math.max(0.002, (mm / BP_MAX) * H * (600 / 600)); col.scale.y = h; men.position.y = h; }
    setMercury(0);
    // y of mercury scale zero must sit at scale card zero: card y = 0.10 + H/2 + 0.04 centre; 0 mmHg at (620/640 of card from top)
    var zeroY = 0.10 + 0.04 + H / 2 - H / 2 + H * (20 / 640) * 0.0;
    hg.position.y = 0.10 + 0.04 + H * (20 / 640) * 1.0 - 0.0;
    tube.position.y = hg.position.y - 0.0;

    /* hoses and bulb (CatmullRom tubes) */
    var rubber = std(0x1d2126, 0.55);
    function hose(pts, r) {
      var cv = new THREE.CatmullRomCurve3(pts.map(function (p) { return new V3(p[0], p[1], p[2]); }), false, "centripetal");
      return new THREE.Mesh(new THREE.TubeGeometry(cv, 40, r, 8, false), rubber);
    }
    var hose1 = hose([[-2.62, 0.95, 0.40], [-2.7, 1.25, 0.9], [-2.9, 0.5, 1.1], [-3.2, 0.12, 0.2], [-3.5, 0.12, -0.9], [-3.52, 0.14, -1.35]], 0.024);
    var hose2 = hose([[-2.45, 0.92, 0.43], [-2.3, 1.2, 1.0], [-2.1, 0.4, 1.35], [-1.9, 0.07, 1.45]], 0.024);
    var bulbP = [[0, 0], [0.09, 0.0], [0.15, 0.1], [0.18, 0.25], [0.14, 0.42], [0.07, 0.5], [0.03, 0.54], [0.0, 0.55]].map(function (p) { return new THREE.Vector2(p[0], p[1]); });
    var bulb = new THREE.Mesh(new THREE.LatheGeometry(bulbP, 20), rubber); bulb.rotation.z = Math.PI / 2; bulb.position.set(-1.65, 0.18, 1.5);
    var valve = new THREE.Mesh(new THREE.LatheGeometry([[0, 0], [0.04, 0], [0.05, 0.05], [0.03, 0.1], [0.0, 0.1]].map(function (p) { return new THREE.Vector2(p[0], p[1]); }), 12), chromeM);
    valve.rotation.z = -Math.PI / 2; valve.position.set(-1.92, 0.18, 1.5);
    g.add(M, hose1, hose2, bulb, valve);
    var pump = new THREE.Group(); pump.add(bulb, valve); g.add(pump);
    parts.pump = tagPart(pump, "pump");
    // cuff sound marker ring (flashes on each Korotkoff sound)
    var snd = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.012, 8, 40), new THREE.MeshBasicMaterial({ color: 0xffd166, transparent: true, opacity: 0 }));
    snd.rotation.y = Math.PI / 2; snd.position.set((CUFF_X0 + CUFF_X1) / 2, 0.5, 0);
    g.add(snd);
    return { group: g, setCuff: setCuff, setMercury: setMercury, snd: snd, cuff: cuff };
  }

  /* ---------------- bench top ---------------- */
  function buildBench(parts) {
    var g = new THREE.Group(), tex = benchTex();
    var top = new THREE.Mesh(uvPlanar(slab(9.6, 5.4, 0.12, 0.2, 0.03), 0.4, 0.4), std(0xffffff, 0.55, { map: tex, bumpMap: tex, bumpScale: 0.3 }));
    top.position.y = -0.17;
    var edge = new THREE.Mesh(uvPlanar(slab(9.5, 5.3, 0.05, 0.2, 0.01), 0.4, 0.4), std(0x2f3d47, 0.6)); edge.position.y = -0.27;
    g.add(top, edge);
    g.position.set(-0.7, 0.0, -0.1);
    parts.bench = tagPart(g, "bench");
    return g;
  }

  /* ---------------- the kit ---------------- */
  function create(opts) {
    opts = opts || {};
    var g = new THREE.Group(), parts = {};
    var bench = buildBench(parts); g.add(bench);
    var arm = buildArm(parts); g.add(arm);
    var A = arm.userData.art, B = arm.userData.bulge;
    var examiner = buildExaminer(arm.userData.skinMat); g.add(examiner);
    parts.fingers = tagPart(examiner, "fingers");
    var sw = buildStopwatch(parts); sw.position.set(1.95, 0, 1.15); sw.rotation.y = -0.5; g.add(sw);
    var st = buildStep(parts); st.step.position.set(2.45, 0, -1.25); st.step.rotation.y = 0.12; st.figure.position.set(1.35, 0, -1.25); g.add(st.step); g.add(st.figure);
    var BP = buildCuffAndMeter(parts); g.add(BP.group);

    /* heart on a stand: HeartKit.heart when present */
    var heartG = new THREE.Group(), heart = null;
    var stand = new THREE.Mesh(new THREE.LatheGeometry([[0, 0], [0.55, 0], [0.58, 0.03], [0.52, 0.07], [0.15, 0.12], [0.1, 0.5], [0.3, 0.55], [0.34, 0.6], [0.0, 0.6]].map(function (p) { return new THREE.Vector2(p[0], p[1]); }), 32), std(0x3b4650, 0.5, { metalness: 0.2 }));
    stand.scale.set(1, 0.5, 1);
    heartG.add(stand);
    if (window.HeartKit && HeartKit.heart) {
      heart = HeartKit.heart({ bpm: REST_BPM, mode: "pace", labels: false, scale: 1 });
      heart.scale.setScalar(0.62); heart.position.set(0, 0.62, 0);
      heartG.add(heart);
      parts.heart = heart;
      var hp = heart.userData.parts || {};
      parts.san = hp.san; parts.avn = hp.avn; parts.his = hp.his; parts.purkinje = hp.purkinje;
      tagPart(heart, "heart");
      ["san", "avn", "his", "purkinje"].forEach(function (k) { if (parts[k]) tagPart(parts[k], k); });
    } else {
      parts.heart = new THREE.Group(); parts.san = new THREE.Group(); parts.avn = new THREE.Group(); parts.his = new THREE.Group(); parts.purkinje = new THREE.Group();
    }
    heartG.position.set(-0.55, 0, -1.95); g.add(heartG);

    /* aorta line: a faint tube from the heart over to the wrist, with a bead that carries each beat */
    var aCurve = new THREE.CatmullRomCurve3([new V3(-0.55, 1.0, -1.95), new V3(-0.2, 1.1, -1.6), new V3(0.4, 0.9, -1.0), new V3(0.7, 0.55, -0.45), new V3(0.4, 0.42, 0.0), new V3(0.05, 0.38, ART_Z)], false, "centripetal");
    var line = new THREE.Mesh(new THREE.TubeGeometry(aCurve, 60, 0.014, 6, false), new THREE.MeshStandardMaterial({ color: 0xff8a95, emissive: new THREE.Color(0xb3101f), emissiveIntensity: 0.35, roughness: 0.4, transparent: true, opacity: 0.55 }));
    var bead = new THREE.Mesh(new THREE.SphereGeometry(0.05, 14, 10), new THREE.MeshBasicMaterial({ color: 0xffd166, transparent: true, opacity: 0 }));
    g.add(line, bead);
    parts.aortaLine = tagPart(line, "aortaLine");

    /* ---------- state ---------- */
    var S = {
      speed: opts.speed || 1, onEvent: opts.onEvent || null, xray: !!opts.xray,
      phase: "rest", t_min: 0, tween: null, ex: null, count: null, bp: null,
      rows: [], attempts: {}, restBpm: opts.bpmRest || REST_BPM, queue: [], clock: 0,
      bpm: opts.bpmRest || REST_BPM, ownPh: 0, prevV: 0, lastBeat: -9, beats: 0, lastCount: null, pressure: 0, occl: 1
    };
    function emit(n, d) { if (S.onEvent) S.onEvent(n, d); }
    function liveBpm() {
      if (S.phase === "rest") return S.restBpm;
      if (S.phase === "exercising") return S.restBpm + (PEAK_BPM - S.restBpm) * smooth(0, 1, S.ex.u);
      return bpmAt(S.t_min);
    }
    function busy() { return !!(S.ex || S.count || S.tween || S.bp); }
    function ctxKey() { return S.phase === "rest" ? "rest" : "m" + Math.round(S.t_min); }

    function restCount() { if (S.phase !== "rest") return false; return countNow(); }
    function countNow() {
      if (busy() || S.phase === "exercising") return false;
      var key = ctxKey(), at = S.attempts[key] || 0, bpm = liveBpm(), ctx = S.phase === "rest" ? 0 : Math.round(S.t_min);
      S.attempts[key] = at + 1;
      S.count = { u: 0, key: key, attempt: at, bpm: bpm, c15: count15(bpm, at, ctx), minute: S.phase === "rest" ? null : Math.round(S.t_min), startBeats: S.beats };
      emit("count-start", { context: key });
      return true;
    }
    function exercise() {
      if (busy() || S.phase !== "rest") return false;
      S.ex = { u: 0, dur: opts.exerciseSeconds || 6 };
      S.phase = "exercising";
      emit("exercise-start", { minutes: EXERCISE_MIN });
      return true;
    }
    function nextMinute() {
      if (busy() || S.phase !== "post" || S.t_min >= 5 - 1e-6) return false;
      S.tween = { from: S.t_min, to: Math.round(S.t_min) + 1, u: 0, dur: 2.4 };
      return true;
    }
    function measureBP() {
      if (busy()) return false;
      S.bp = { stage: "inflate", p: 0, firstSeen: false, lastSeen: false, sys: null, dia: null, beatsHeard: 0 };
      emit("bp-start", {});
      return true;
    }
    function reset() {
      S.phase = "rest"; S.t_min = 0; S.tween = null; S.ex = null; S.count = null; S.bp = null; S.rows = []; S.attempts = {}; S.queue = []; S.lastCount = null; S.pressure = 0;
      emit("reset", {});
    }
    function runAll() {
      reset();
      S.queue.push(function () { return restCount(); }, function () { return countNow(); }, function () { return countNow(); }, function () { return exercise(); }, function () { return countNow(); });
      for (var m = 1; m <= 5; m++) { S.queue.push(function () { return nextMinute(); }); S.queue.push(function () { return countNow(); }); }
      S.queue.push(function () { return measureBP(); });
    }

    function finishCount() {
      var c = S.count, row = { context: c.key, phase: S.phase === "rest" ? "rest" : "post", t_min: c.minute, attempt: c.attempt, count15: c.c15, bpm: c.c15 * 4, trueBpm: round1(c.bpm), cycle_s: round1(60 / (c.c15 * 4) * 100) / 100 };
      S.rows.push(row); S.lastCount = row; S.count = null;
      emit("counted", reading());
      if (nPost() >= 6) emit("done", reading());
    }
    function nPost() { var seen = {}; S.rows.forEach(function (r) { if (r.phase === "post") seen[r.t_min] = 1; }); return Object.keys(seen).length; }

    /* ---------- reading (the only source of numbers) ---------- */
    function table() {
      var by = {}; S.rows.forEach(function (r) { if (r.phase === "post") by[r.t_min] = r; });
      return [0, 1, 2, 3, 4, 5].map(function (m) { var r = by[m]; return { t_min: m, count15: r ? r.count15 : null, bpm: r ? r.bpm : null }; });
    }
    function reading() {
      var rest = S.rows.filter(function (r) { return r.phase === "rest"; }), sum = 0;
      rest.forEach(function (r) { sum += r.count15; });
      var lc = S.lastCount, bpmLive = liveBpm();
      return {
        t_min: S.phase === "rest" ? null : round1(S.t_min), count15: lc ? lc.count15 : null, bpm: lc ? lc.bpm : null,
        cycle_s: lc ? lc.cycle_s : round1(60 / bpmLive * 100) / 100, resting: S.phase === "rest",
        phase: S.phase, trueBpm: round1(bpmLive), model_count15: count15(bpmLive, 0, 0), nCounts: S.rows.length, nPost: nPost(),
        restMean: rest.length ? round1(sum / rest.length) : null, rows: S.rows.slice(), table: table(), counting: !!S.count,
        beats: S.count ? Math.min(S.count.c15, Math.floor(S.count.c15 * S.count.u)) : null, busy: busy(),
        bp: { sys: S.bp && S.bp.sys != null ? S.bp.sys : (S.lastBp ? S.lastBp.sys : null), dia: S.bp && S.bp.dia != null ? S.bp.dia : (S.lastBp ? S.lastBp.dia : null), pressure: Math.round(S.pressure), measuring: !!S.bp },
        allDone: nPost() >= 6
      };
    }

    /* ---------- frame update ---------- */
    var xraySet = null;
    function update(dt, t) {
      dt = Math.min(dt || 0.016, 0.05); S.clock += dt;
      var sdt = dt * S.speed;
      // queue
      if (S.queue.length && !busy() && S.phase !== "exercising") { var r = S.queue[0](); if (r !== false) S.queue.shift(); }
      // phase machines
      if (S.ex) { S.ex.u = Math.min(1, S.ex.u + sdt / S.ex.dur); if (S.ex.u >= 1) { S.ex = null; S.phase = "post"; S.t_min = 0; emit("exercise-done", { bpm: PEAK_BPM }); } }
      if (S.tween) { S.tween.u = Math.min(1, S.tween.u + sdt / S.tween.dur); S.t_min = S.tween.from + (S.tween.to - S.tween.from) * smooth(0, 1, S.tween.u); if (S.tween.u >= 1) { S.t_min = S.tween.to; S.tween = null; emit("minute", { t_min: S.t_min }); } }
      if (S.count) { S.count.u = Math.min(1, S.count.u + sdt / COUNT_S); if (S.count.u >= 1) finishCount(); }
      // blood pressure machine (cuff pressure in mmHg)
      if (S.bp) {
        var b = S.bp;
        if (b.stage === "inflate") { b.p += dt * 55; if (b.p >= 160) { b.p = 160; b.stage = "hold"; b.hold = 0.6; } }
        else if (b.stage === "hold") { b.hold -= dt; if (b.hold <= 0) b.stage = "deflate"; }
        else if (b.stage === "deflate") {
          var pPrev = b.p; b.p -= dt * 12 * S.speed;
          if (!b.firstSeen && b.p <= BP_SYS) { b.firstSeen = true; b.sys = BP_SYS; emit("korotkoff-first", { pressure: BP_SYS }); }
          if (!b.lastSeen && b.p <= BP_DIA) { b.lastSeen = true; b.dia = BP_DIA; emit("korotkoff-last", { pressure: BP_DIA }); }
          if (b.p <= 40) { S.lastBp = { sys: b.sys, dia: b.dia }; S.bp = null; S.pressure = 0; emit("bp", { sys: BP_SYS, dia: BP_DIA, reading: reading() }); }
        }
        if (S.bp) S.pressure = S.bp.p;
      }
      var p = S.pressure;
      BP.setMercury(p); BP.setCuff(Math.min(1, p / 160));
      var occl = p > BP_SYS ? 0 : 1; S.occl += (occl - S.occl) * Math.min(1, dt * 14);

      // heart rate follows the model; the heart (or a fallback metronome) generates the beats
      S.bpm = liveBpm();
      var vNow;
      if (heart) { heart.userData.setState({ bpm: S.bpm }); heart.userData.update(dt, t); vNow = heart.userData.beat.vSys; }
      else { S.ownPh = (S.ownPh + dt * S.bpm / 60) % 1; vNow = (S.ownPh > 0.2 && S.ownPh < 0.56) ? Math.sin(((S.ownPh - 0.2) / 0.36) * Math.PI) : 0; }
      if (vNow > 0.08 && S.prevV <= 0.08) { S.lastBeat = S.clock; S.beats++; if (S.bp && S.bp.stage === "deflate" && S.bp.p < BP_SYS && S.bp.p > BP_DIA) { S.sndT = S.clock; S.bp.beatsHeard++; } }
      S.prevV = vNow;

      // pulse waveform at the wrist: sharp rise, slow fall, dicrotic notch
      var DELAY = 0.2;
      function wave(tt) {
        if (tt < 0) return 0;
        var a = tt < 0.1 ? Math.sin(tt / 0.1 * Math.PI / 2) : Math.exp(-(tt - 0.1) / 0.13);
        return a + 0.22 * Math.exp(-Math.pow((tt - 0.40) / 0.045, 2)) * (tt > 0.3 ? 1 : 0);
      }
      var since = S.clock - S.lastBeat - DELAY, dtB = 60 / S.bpm;
      var amp = wave(since) * (since > dtB ? 0 : 1) * S.occl;
      var k, N = A.N, rs = A.rScale;
      for (k = 0; k <= N; k++) { var xk = A.x0 + (A.x1 - A.x0) * (k / N); rs[k] = 0.55 * wave(since - (xk - A.x0) * 0.012) * S.occl - (S.occl < 0.5 ? 0.35 : 0); }
      sweep(A.geo, A.point, A.rad, N, 10, 0.01, 0.01, 1);
      var art = parts.radialArtery.material; art.emissiveIntensity = 0.22 + 0.7 * amp; art.color.setRGB(0.56 + 0.2 * amp, 0.11, 0.18 - 0.05 * amp);
      // skin bulge
      var bp = B.geo.attributes.position, bb = B.base, ids = B.idx, ia;
      for (ia = 0; ia < ids.length; ia++) {
        var bx = bb[ia * 6], by = bb[ia * 6 + 1], bz = bb[ia * 6 + 2], bny = bb[ia * 6 + 4];
        var gz = Math.exp(-Math.pow((bz - ART_Z) / 0.09, 2)), w = wave(since - (bx - A.x0) * 0.012) * S.occl * gz * smooth(-1.2, -0.7, bx) * (1 - smooth(0.2, 0.34, bx));
        bp.setY(ia * 0 + ids[ia], by + bny * 0.028 * w); bp.setZ(ids[ia], bz + bb[ia * 6 + 5] * 0.028 * w);
      }
      bp.needsUpdate = true;
      if (Math.floor(S.clock * 30) % 2 === 0) B.geo.computeVertexNormals();

      // examiner's fingertips press with the pulse
      examiner.position.y = -0.012 * amp + (S.count ? -0.004 : 0);

      // travelling bead from the heart to the wrist
      var bu = (S.clock - S.lastBeat) / DELAY;
      if (bu >= 0 && bu <= 1) { aCurve.getPointAt(bu, bead.position); bead.material.opacity = Math.sin(bu * Math.PI) * 0.95; } else bead.material.opacity = 0;

      // stopwatch
      var secShow = 0, label = "00:00.0", running = false;
      if (S.count) { secShow = S.count.u * COUNT_S; running = true; }
      else if (S.ex) { secShow = S.ex.u * EXERCISE_MIN * 60; running = true; }
      else if (S.lastCount) secShow = COUNT_S * (S.phase === "post" && !S.tween ? 1 : 0) * (S.count ? 1 : 0);
      var mm = Math.floor(secShow / 60), ss = secShow - mm * 60;
      label = (mm < 10 ? "0" : "") + mm + ":" + (ss < 10 ? "0" : "") + ss.toFixed(1);
      sw.userData.draw(secShow, label, running);
      sw.userData.tilt.rotation.x = 0;

      // step-ups: the manikin steps on and off the stool while exercising
      var F = st.figure.userData.fig;
      if (S.ex) {
        var c = (S.clock * 0.55) % 1;                  // one up-and-down cycle every ~1.8 s
        var up = c < 0.5, pr = up ? smooth(0, 0.34, c) : 1 - smooth(0.5, 0.84, c), mv = up ? c > 0 && c < 0.34 : c > 0.5 && c < 0.84;
        var q = up ? smooth(0, 0.34, c) : smooth(0.5, 0.84, c);
        var lead = Math.sin(Math.PI * Math.min(1, q * 1.7)), trail = Math.sin(Math.PI * Math.max(0, (q - 0.35) / 0.65));
        if (!mv) { lead = 0; trail = 0; }
        var a0 = up ? lead : trail, a1 = up ? trail : lead;   // leg 0 leads going up, leg 1 leads going down
        st.figure.position.x = 1.35 + 0.85 * pr; st.figure.position.y = STEP_H * pr;
        [a0, a1].forEach(function (a, i) { var lg = F.legL[i]; lg.hp.rotation.z = 0.08 + 0.95 * a; lg.kn.rotation.z = -0.1 - 1.15 * a; });
        F.hips.position.y = 0.46 + 0.02 * Math.sin(S.clock * 9);
        F.armL.forEach(function (ar, i) { ar.sh.rotation.z = (i ? 1 : -1) * 0.5 * Math.sin(Math.PI * q) * (mv ? 1 : 0); ar.el.rotation.z = -0.4; });
      } else {
        st.figure.position.x += (1.35 - st.figure.position.x) * Math.min(1, dt * 4); st.figure.position.y += (0 - st.figure.position.y) * Math.min(1, dt * 4);
        F.hips.position.y += (0.46 - F.hips.position.y) * Math.min(1, dt * 6);
        F.legL.forEach(function (lg) { lg.hp.rotation.z *= 0.85; lg.kn.rotation.z *= 0.85; });
        F.armL.forEach(function (ar) { ar.sh.rotation.z *= 0.85; ar.el.rotation.z *= 0.85; });
      }

      // korotkoff flash on the cuff
      var flash = Math.max(0, 1 - (S.clock - (S.sndT || -9)) / 0.25); BP.snd.material.opacity = flash * 0.9;

      // x-ray: make skin see-through to show the artery
      if (xraySet !== S.xray) { xraySet = S.xray; var sm = arm.userData.skinMat; sm.transparent = S.xray; sm.opacity = S.xray ? 0.32 : 1; sm.depthWrite = !S.xray; sm.needsUpdate = true; }
    }

    function viewFor(name) {
      var T = { all: [-0.5, 0.55, -0.2, 9.0], bench: [-0.5, 0.5, 0, 9.5], arm: [-1.5, 0.4, 0.0, 5.2], wrist: [-0.2, 0.35, 0.1, 2.5], radialArtery: [-0.2, 0.35, 0.1, 2.2], fingers: [-0.1, 0.45, 0.4, 2.2],
        hand: [0.6, 0.2, 0.2, 2.8], stopwatch: [1.95, 0.25, 1.15, 2.3], step: [2.2, 0.35, -1.25, 3.6], mannequin: [2.2, 0.4, -1.25, 3.6], heart: [-0.55, 0.9, -1.95, 3.1], san: [-0.55, 0.9, -1.95, 2.3], avn: [-0.55, 0.9, -1.95, 2.3], his: [-0.55, 0.9, -1.95, 2.3], purkinje: [-0.55, 0.9, -1.95, 2.3],
        cuff: [-2.7, 0.5, 0.0, 3.2], manometer: [-3.55, 1.3, -1.55, 4.4], mercury: [-3.55, 1.3, -1.55, 4.4], pump: [-1.8, 0.2, 1.4, 2.5], aortaLine: [-0.1, 0.8, -0.8, 4.2] };
      var v = T[name] || T.all;
      return { target: [v[0], v[1], v[2]], dist: v[3], yawPortrait: (name === "all" || name === "bench" || name === "arm" || !T[name]) ? -Math.PI / 2 : 0 };
    }
    function pickPart(raycaster) {
      var hits = raycaster.intersectObjects(g.children, true);
      for (var k = 0; k < hits.length; k++) { var o = hits[k].object; if (o.userData && o.userData.partId && o.userData.partId !== "bench" && o.material && !(o.material.opacity < 0.05)) return o.userData.partId; }
      return null;
    }
    function setState(o) {
      o = o || {};
      if (o.speed != null) S.speed = Math.max(0.2, o.speed);
      if (o.xray != null) S.xray = !!o.xray;
      if (o.onEvent) S.onEvent = o.onEvent;
      if (o.bpmRest != null) S.restBpm = o.bpmRest;
      if (o.t_min != null) { S.phase = "post"; S.t_min = Math.max(0, Math.min(5, o.t_min)); }
      if (o.reset) reset();
    }

    g.userData.parts = parts; g.userData.update = update; g.userData.setState = setState; g.userData.heart = heart;
    g.group = g; g.parts = parts; g.tick = update; g.update = update; g.setState = setState;
    g.reading = reading; g.restCount = restCount; g.countNow = countNow; g.exercise = exercise; g.nextMinute = nextMinute; g.measureBP = measureBP;
    g.runAll = runAll; g.reset = reset; g.viewFor = viewFor; g.pickPart = pickPart;
    update(0.016, 0);
    return g;
  }

  /* pulsing emissive highlight on named parts (partId) */
  function makeHighlighter(scene) {
    var saved = [];
    function clear() { saved.forEach(function (s) { s.mesh.material = s.orig; }); saved.length = 0; }
    function highlight(name, colorHex) {
      clear(); if (!name || !scene) return;
      var col = new THREE.Color(colorHex != null ? colorHex : 0xffd166);
      scene.traverse(function (o) {
        if (o.isMesh && o.userData && o.userData.partId === name && o.material && !Array.isArray(o.material) && o.material.emissive) {
          var c = o.material.clone(); saved.push({ mesh: o, orig: o.material }); c.emissive.copy(col); c.emissiveIntensity = 0.55; o.material = c;
        }
      });
    }
    return { highlight: highlight, clear: clear };
  }

  window.PulseBench = {
    create: create, makeHighlighter: makeHighlighter, version: 1,
    model: { bpmAt: bpmAt, count15: count15, knots: { t: KNOT_T.slice(), bpm: KNOT_B.slice() }, REST_BPM: REST_BPM, PEAK_BPM: PEAK_BPM, BP: { sys: BP_SYS, dia: BP_DIA } }
  };
})();
