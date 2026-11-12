/* =========================================================
   StudyPipe · MicroscopeBench v1 — Paper-3 compound-microscope practical
   Classic script (no modules), fully offline, needs window.THREE. Self-contained: it does NOT
   depend on kits/cell-bio. SceneKit is used only if present (for crisp label sprites).

   window.MicroscopeBench.create(opts) -> THREE.Group g
     g.parts                      named exam parts (see README): base arm stage clips aperture condenser iris
                                  mirror coarse fine nosepiece objective tube head eyepiece slide coverslip
                                  specimen lamp view
     g.update(dt, t)  (= g.tick)  per-frame animation (turret spin, stage travel, knobs, beams)
     g.setState(obj)              objective, slide, eyepiece, mirror, iris, focus, pan, wbc, labels, lightPath
     g.reading()                  { M, field_mm, cells, width_mm, width_um, ... } computed from the model
     g.coarse(steps) / g.fine(steps) / g.autoFocus() / g.measure() / g.tap(part) / g.highlight(part, on)
     g.on(name, fn)  events: objective slide mirror iris focus measure coarse-locked
     g.viewCanvas                 the 512 px eyepiece-view canvas (also mapped on the 3D disc)

   Pure model (no THREE needed): MicroscopeBench.compute({ objective, eyepiece, slide })
   2D view:                      MicroscopeBench.renderView(ctx, D, state)
   ========================================================= */
(function (global) {
  "use strict";
  if (typeof THREE === "undefined") return;
  var TAU = Math.PI * 2;

  /* ------------------------------ the model ------------------------------ */
  var OBJ = [
    { mag: 4,  na: 0.10, band: 0xd62828, bandCss: "#d62828", len: 0.292, tipR: 0.034, f0: 0.500, dof: 1.0 },
    { mag: 10, na: 0.25, band: 0xf2c200, bandCss: "#f2c200", len: 0.362, tipR: 0.030, f0: 0.504, dof: 1.9 },
    { mag: 40, na: 0.65, band: 0x1f62d6, bandCss: "#1f62d6", len: 0.412, tipR: 0.024, f0: 0.508, dof: 4.2 }
  ];
  var FIELD_K = 160;                 // field_mm = 160 / total magnification  (4.0 / 1.6 / 0.40 mm at eyepiece x10)
  var SLIDES = {
    cork:  { name: "Cork",        label: "Cork",  width_mm: 0.050, note: "dead cells: empty walls" },
    onion: { name: "Onion peel",  label: "Onion", width_mm: 0.050, note: "living cells, iodine stain" },
    blood: { name: "Blood smear", label: "Blood", width_mm: 0.008, note: "round, no wall, no nucleus" }
  };
  var SLIDE_ORDER = ["cork", "onion", "blood"];
  var F_MIN = 0.15, F_MAX = 0.88, COARSE_STEP = 0.05, FINE_STEP = 0.002, BLUR_K = 520, BLUR_MAX = 24;

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function brightnessOf(mirror, iris, objective) {
    var m = mirror === "concave" ? 1.0 : 0.72;
    var ir = 0.22 + 0.78 * iris * iris;
    var oc = [1, 0.88, 0.76][objective];
    return clamp(m * ir * oc * 1.5, 0.05, 1);
  }
  function blurOf(f, objective) {
    var o = OBJ[objective];
    return Math.min(BLUR_MAX, Math.abs(f - o.f0) * BLUR_K * o.dof);
  }
  /* readings computed from the model, never typed */
  function compute(s) {
    s = s || {};
    var oi = clamp(s.objective == null ? 0 : s.objective | 0, 0, 2);
    var ep = s.eyepiece || 10;
    var sl = SLIDES[s.slide] || SLIDES.onion;
    var M = ep * OBJ[oi].mag;
    var field = FIELD_K / M;
    var exact = field / sl.width_mm;
    var cells = Math.max(1, Math.round(exact));
    return {
      eyepiece: ep, objective: OBJ[oi].mag, objectiveIndex: oi, na: OBJ[oi].na, M: M,
      field_mm: field, cells: cells, cells_exact: exact,
      width_mm: sl.width_mm, width_um: Math.round(sl.width_mm * 1000 * 100) / 100,
      slide: s.slide in SLIDES ? s.slide : "onion"
    };
  }

  /* ------------------------------ helpers ------------------------------ */
  function rng(seed) { var s = (seed || 1) >>> 0; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  function hash(i, j, s) {
    var h = Math.imul(i | 0, 374761393) + Math.imul(j | 0, 668265263) + Math.imul(s | 0, 1442695041);
    h = Math.imul(h ^ (h >>> 13), 1274126177); h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  }
  function srgb(t) { if ("colorSpace" in t && THREE.SRGBColorSpace) t.colorSpace = THREE.SRGBColorSpace; else if ("encoding" in t && THREE.sRGBEncoding) t.encoding = THREE.sRGBEncoding; return t; }
  function canvasTex(w, h, draw, color) {
    var c = document.createElement("canvas"); c.width = w; c.height = h;
    draw(c.getContext("2d"), w, h);
    var t = new THREE.CanvasTexture(c);
    if (color !== false) srgb(t);
    t.anisotropy = 2;
    return t;
  }
  function std(color, rough, metal, extra) {
    var m = new THREE.MeshStandardMaterial({ color: color, roughness: rough == null ? 0.5 : rough, metalness: metal || 0 });
    if (extra) for (var k in extra) m[k] = extra[k];
    return m;
  }
  function tagPart(obj, key) {
    if (!obj) return obj;
    obj.userData = obj.userData || {};
    if (!obj.userData.partId) obj.userData.partId = key;
    obj.traverse(function (c) { c.userData = c.userData || {}; if (!c.userData.partId) c.userData.partId = key; });
    return obj;
  }
  function attachCompat(g, parts, updateFn, setStateFn) {
    g.userData = g.userData || {};
    g.userData.parts = parts; g.userData.update = updateFn; g.userData.setState = setStateFn || function () {};
    g.group = g; g.parts = parts; g.tick = updateFn; g.update = updateFn; g.setState = g.userData.setState;
    return g;
  }
  function mesh(geo, mat, x, y, z) {
    var m = new THREE.Mesh(geo, mat);
    if (x != null) m.position.set(x, y || 0, z || 0);
    return m;
  }
  function lathe(pts, segs, mat) {
    if (pts[0][1] > pts[pts.length - 1][1]) pts = pts.slice().reverse();   // keep the profile bottom -> top so normals face outward
    var v = pts.map(function (p) { return new THREE.Vector2(p[0], p[1]); });
    return new THREE.Mesh(new THREE.LatheGeometry(v, segs || 32), mat);
  }
  function smoothPts(pts, n) {
    var c = new THREE.SplineCurve(pts.map(function (p) { return new THREE.Vector2(p[0], p[1]); }));
    return c.getPoints(n || 12).map(function (p) { return [Math.max(0.0005, p.x), p.y]; });
  }
  function gearShape(R, teeth, depthFrac) {
    var s = new THREE.Shape(), n = teeth * 4;
    for (var i = 0; i < n; i++) {
      var a = i / n * TAU, ph = i % 4, r = (ph === 1 || ph === 2) ? R : R * (1 - depthFrac);
      var x = Math.cos(a) * r, y = Math.sin(a) * r;
      if (i === 0) s.moveTo(x, y); else s.lineTo(x, y);
    }
    s.closePath(); return s;
  }
  function roundedRect(shape, x0, y0, x1, y1, r) {
    shape.moveTo(x0 + r, y0); shape.lineTo(x1 - r, y0); shape.quadraticCurveTo(x1, y0, x1, y0 + r);
    shape.lineTo(x1, y1 - r); shape.quadraticCurveTo(x1, y1, x1 - r, y1);
    shape.lineTo(x0 + r, y1); shape.quadraticCurveTo(x0, y1, x0, y1 - r);
    shape.lineTo(x0, y0 + r); shape.quadraticCurveTo(x0, y0, x0 + r, y0);
    return shape;
  }
  function ribbonShape(pts, wFn) {
    var curve = new THREE.CatmullRomCurve3(pts.map(function (p) { return new THREE.Vector3(p[0], p[1], 0); }));
    var N = 56, L = [], R = [];
    for (var i = 0; i <= N; i++) {
      var t = i / N, p = curve.getPoint(t), tg = curve.getTangent(t), nx = -tg.y, ny = tg.x, w = wFn(t);
      L.push([p.x + nx * w, p.y + ny * w]); R.push([p.x - nx * w, p.y - ny * w]);
    }
    var s = new THREE.Shape();
    s.moveTo(L[0][0], L[0][1]);
    for (i = 1; i <= N; i++) s.lineTo(L[i][0], L[i][1]);
    for (i = N; i >= 0; i--) s.lineTo(R[i][0], R[i][1]);
    s.closePath();
    return s;
  }
  function sm(x) { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); }

  /* ------------------------------ specimen drawing (specimen space, mm) ------------------------------ */
  // px = (mm - origin) * ppm ; origin = centre of field minus half the disc.
  function drawOnion(c, D, ppm, cx, cy) {
    var Wm = 0.05, Hm = Wm * 2.6, W = Wm * ppm;
    var x0 = cx - D / 2 / ppm, y0 = cy - D / 2 / ppm, span = D / ppm;
    c.fillStyle = "#efd890"; c.fillRect(0, 0, D, D);
    var r0 = Math.floor(y0 / Hm) - 1, r1 = Math.ceil((y0 + span) / Hm) + 1;
    c.lineJoin = "round";
    for (var r = r0; r <= r1; r++) {
      var off = (r & 1) ? 0.5 * Wm : 0;
      var ya = (r * Hm + (hash(0, r, 2) - 0.5) * 0.07 * Hm - y0) * ppm, yb = ((r + 1) * Hm + (hash(0, r + 1, 2) - 0.5) * 0.07 * Hm - y0) * ppm;
      var c0 = Math.floor((x0 - off) / Wm) - 1, c1 = Math.ceil((x0 + span - off) / Wm) + 1;
      for (var k = c0; k <= c1; k++) {
        var xa = (k * Wm + off + (hash(k, r, 1) - 0.5) * 0.16 * Wm - x0) * ppm, xb = ((k + 1) * Wm + off + (hash(k + 1, r, 1) - 0.5) * 0.16 * Wm - x0) * ppm;
        var hv = hash(k, r, 3);
        c.fillStyle = "hsl(" + (44 + hv * 6) + "," + (62 + hv * 14) + "%," + (79 + hv * 7) + "%)";
        c.fillRect(xa, ya, xb - xa, yb - ya);
        if (W >= 14) {                                    // big central vacuole (clear), cytoplasm lining stays brownish
          c.fillStyle = "rgba(255,246,205,0.62)";
          roundRectPath(c, xa + (xb - xa) * 0.1, ya + (yb - ya) * 0.07, (xb - xa) * 0.8, (yb - ya) * 0.86, Math.min(10, (xb - xa) * 0.25));
          c.fill();
        }
        if (W >= 8) {                                      // nucleus at the side, brown with iodine
          var side = hash(k, r, 4) > 0.5 ? 0.24 : 0.74, vy = 0.16 + 0.68 * hash(k, r, 5);
          var nx = xa + (xb - xa) * side, ny = ya + (yb - ya) * vy, nr = Math.max(1.1, (xb - xa) * 0.14);
          if (W >= 40) {                                   // x400: strands, envelope, nucleolus
            c.strokeStyle = "rgba(150,100,40,0.45)"; c.lineWidth = 1;
            c.beginPath(); c.moveTo(nx, ny); c.lineTo(side < 0.5 ? xa : xb, ny + (vy > 0.5 ? 0.12 : -0.12) * (yb - ya)); c.stroke();
          }
          c.fillStyle = "#8a5518"; c.beginPath(); c.ellipse(nx, ny, nr, nr * 0.88, 0, 0, TAU); c.fill();
          if (W >= 40) { c.fillStyle = "#3d2208"; c.beginPath(); c.arc(nx + nr * 0.1, ny - nr * 0.05, nr * 0.3, 0, TAU); c.fill(); }
        }
        c.strokeStyle = "#8f5c1d"; c.lineWidth = Math.max(0.7, W * 0.075);
        c.strokeRect(xa, ya, xb - xa, yb - ya);
      }
    }
  }
  function roundRectPath(c, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    c.beginPath(); c.moveTo(x + r, y); c.lineTo(x + w - r, y); c.quadraticCurveTo(x + w, y, x + w, y + r);
    c.lineTo(x + w, y + h - r); c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    c.lineTo(x + r, y + h + 0); c.quadraticCurveTo(x, y + h, x, y + h - r);
    c.lineTo(x, y + r); c.quadraticCurveTo(x, y, x + r, y); c.closePath();
  }
  function drawCork(c, D, ppm, cx, cy) {
    var Wm = 0.05, Hm = 0.043, W = Wm * ppm;
    var x0 = cx - D / 2 / ppm, y0 = cy - D / 2 / ppm, span = D / ppm;
    c.fillStyle = "#cdb078"; c.fillRect(0, 0, D, D);
    var r0 = Math.floor(y0 / Hm) - 1, r1 = Math.ceil((y0 + span) / Hm) + 1;
    c.lineJoin = "round";
    for (var pass = 0; pass < 2; pass++) {
      for (var r = r0; r <= r1; r++) {
        var off = (r & 1) ? 0.5 * Wm : 0, c0 = Math.floor((x0 - off) / Wm) - 1, c1 = Math.ceil((x0 + span - off) / Wm) + 1;
        for (var k = c0; k <= c1; k++) {
          // jittered corners; the lower corners are offset so the rows interlock like bricks
          var vy0 = function (kk, rr) { return (rr * Hm + (hash(kk, rr, 12) - 0.5) * 0.2 * Hm - y0) * ppm; };
          var ax = ((k * Wm + off) + (hash(k, r, 11) - 0.5) * 0.2 * Wm - x0) * ppm, ay = vy0(k, r);
          var bx = (((k + 1) * Wm + off) + (hash(k + 1, r, 11) - 0.5) * 0.2 * Wm - x0) * ppm, by = vy0(k + 1, r);
          var dx = ax + (hash(k, r, 14) - 0.5) * 0.12 * W, dy = vy0(k, r + 1);
          var cx2 = bx + (hash(k, r, 13) - 0.5) * 0.12 * W, cy2 = vy0(k + 1, r + 1);
          c.beginPath(); c.moveTo(ax, ay); c.lineTo(bx, by); c.lineTo(cx2, cy2); c.lineTo(dx, dy); c.closePath();
          if (pass === 0) {
            var hv = hash(k, r, 15);
            c.fillStyle = "hsl(" + (40 + hv * 6) + "," + (46 + hv * 10) + "%," + (84 + hv * 7) + "%)"; c.fill();
            c.strokeStyle = "#5a3a18"; c.lineWidth = Math.max(0.9, W * 0.17); c.stroke();
          } else {
            c.strokeStyle = "#b99560"; c.lineWidth = Math.max(0.35, W * 0.045); c.stroke(); // lighter middle lamella: double line
          }
        }
      }
    }
  }
  function drawBlood(c, D, ppm, cx, cy, wbc) {
    var x0 = cx - D / 2 / ppm, y0 = cy - D / 2 / ppm, span = D / ppm;
    c.fillStyle = "#f4dadf"; c.fillRect(0, 0, D, D);
    var s = 0.0106, dy = s * 0.866, Rm = 0.004;
    var j0 = Math.floor(y0 / dy) - 1, j1 = Math.ceil((y0 + span) / dy) + 1;
    var dpx = Rm * 2 * ppm;
    for (var j = j0; j <= j1; j++) {
      var i0 = Math.floor(x0 / s) - 1, i1 = Math.ceil((x0 + span) / s) + 1;
      for (var i = i0; i <= i1; i++) {
        if (hash(i, j, 21) > 0.9) continue;                                 // thin areas of the smear
        var x = ((i + ((j & 1) ? 0.5 : 0)) * s + (hash(i, j, 22) - 0.5) * 0.45 * s - x0) * ppm;
        var y = (j * dy + (hash(i, j, 23) - 0.5) * 0.45 * dy - y0) * ppm;
        if (x < -dpx || y < -dpx || x > D + dpx || y > D + dpx) continue;
        var R = Rm * ppm * (0.9 + 0.2 * hash(i, j, 24));
        if (dpx < 2.4) { c.fillStyle = "rgba(205,95,108,0.78)"; c.fillRect(x, y, Math.max(1, R * 2), Math.max(1, R * 2)); }
        else if (dpx < 7) { c.fillStyle = "#d4616f"; c.beginPath(); c.arc(x, y, R, 0, TAU); c.fill(); }
        else {
          c.fillStyle = "#d9606e"; c.beginPath(); c.arc(x, y, R, 0, TAU); c.fill();
          c.fillStyle = "#f0adb4"; c.beginPath(); c.arc(x, y, R * 0.4, 0, TAU); c.fill();     // central pallor of the biconcave disc
          c.strokeStyle = "#ad3b49"; c.lineWidth = Math.max(0.8, R * 0.08); c.beginPath(); c.arc(x, y, R, 0, TAU); c.stroke();
        }
      }
    }
    if (wbc) {
      [[0.075, -0.06], [-0.55, 0.4], [0.9, -0.7], [-1.1, -0.9], [1.4, 0.9]].forEach(function (p, n) {
        var X = (p[0] - x0) * ppm, Y = (p[1] - y0) * ppm, R = 0.006 * ppm;
        if (X < -R || Y < -R || X > D + R || Y > D + R) return;
        c.fillStyle = "#e6dcef"; c.beginPath(); c.arc(X, Y, R, 0, TAU); c.fill();
        c.fillStyle = "#5c3d8e";
        for (var l = 0; l < 3; l++) { var a = l * 2.1 + n; c.beginPath(); c.arc(X + Math.cos(a) * R * 0.38, Y + Math.sin(a) * R * 0.38, Math.max(0.8, R * 0.42), 0, TAU); c.fill(); }
      });
    }
  }
  function drawSpecimen(c, D, kind, ppm, cx, cy, wbc) {
    if (kind === "cork") drawCork(c, D, ppm, cx, cy);
    else if (kind === "blood") drawBlood(c, D, ppm, cx, cy, wbc);
    else drawOnion(c, D, ppm, cx, cy);
  }

  /* eyepiece view: sharp specimen -> blur -> dim -> field stop -> guide -> caption */
  var _sharp = null;
  function renderView(ctx, D, s) {
    var M = (s.eyepiece || 10) * OBJ[s.objective || 0].mag;
    var field = FIELD_K / M, ppm = D / field;
    if (!s._sharp || s._sharpKey !== [s.slide, s.objective, s.eyepiece, s.px, s.py, s.wbc].join("|")) {
      if (!s._sharp) { s._sharp = document.createElement("canvas"); s._sharp.width = s._sharp.height = D; }
      drawSpecimen(s._sharp.getContext("2d"), D, s.slide, ppm, s.px || 0, s.py || 0, !!s.wbc);
      s._sharpKey = [s.slide, s.objective, s.eyepiece, s.px, s.py, s.wbc].join("|");
    }
    composeView(ctx, D, s, field);
  }
  function composeView(c, D, s, field) {
    var R = D / 2, blur = s.blur || 0;
    c.clearRect(0, 0, D, D);
    c.save();
    c.beginPath(); c.arc(R, R, R - 1, 0, TAU); c.clip();
    c.fillStyle = "#101214"; c.fillRect(0, 0, D, D);
    if (!s.blank) {
      if (blur < 0.7) c.drawImage(s._sharp, 0, 0);
      else {
        var f = Math.max(1.5, blur * 0.9), sw = Math.max(8, Math.round(D / f));       // blur = down-scale then up-scale (smooth, cheap)
        if (!s._tmp) { s._tmp = document.createElement("canvas"); }
        s._tmp.width = sw; s._tmp.height = sw;
        var tc = s._tmp.getContext("2d"); tc.imageSmoothingEnabled = true; tc.imageSmoothingQuality = "high";
        tc.drawImage(s._sharp, 0, 0, sw, sw);
        c.imageSmoothingEnabled = true; c.imageSmoothingQuality = "high";
        c.drawImage(s._tmp, 0, 0, D, D);
        c.fillStyle = "rgba(255,250,235," + Math.min(0.32, blur * 0.022).toFixed(3) + ")"; c.fillRect(0, 0, D, D);   // lost contrast
      }
      var B = s.brightness == null ? 1 : s.brightness;
      if (B < 1) { c.fillStyle = "rgba(6,8,10," + (Math.pow(1 - B, 1.15) * 0.82).toFixed(3) + ")"; c.fillRect(0, 0, D, D); }
      if (s.iris != null && s.iris > 0.8) { c.fillStyle = "rgba(255,255,245," + ((s.iris - 0.8) * 0.9).toFixed(3) + ")"; c.fillRect(0, 0, D, D); }   // flare, washed-out contrast
      if (s.guide !== false) {                                       // counting line across the diameter
        c.strokeStyle = "rgba(20,40,70,0.55)"; c.lineWidth = 1.2; c.setLineDash([7, 6]);
        c.beginPath(); c.moveTo(0, R); c.lineTo(D, R); c.stroke(); c.setLineDash([]);
        c.beginPath(); c.moveTo(3, R - 9); c.lineTo(3, R + 9); c.moveTo(D - 3, R - 9); c.lineTo(D - 3, R + 9); c.stroke();
      }
    }
    var vg = c.createRadialGradient(R, R, R * 0.68, R, R, R);
    vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,0.5)");
    c.fillStyle = vg; c.fillRect(0, 0, D, D);
    c.restore();
    c.strokeStyle = "rgba(0,0,0,0.9)"; c.lineWidth = 3; c.beginPath(); c.arc(R, R, R - 1.5, 0, TAU); c.stroke();
    // caption pill (all numbers from the model)
    var M = (s.eyepiece || 10) * OBJ[s.objective || 0].mag;
    var txt = "×" + M + "  ·  " + (field < 1 ? field.toFixed(2) : field.toFixed(1)) + " mm";
    c.font = "700 " + Math.round(D * 0.05) + "px Manrope, system-ui, sans-serif";
    var tw = c.measureText(txt).width + D * 0.06, th = D * 0.085, tx = R - tw / 2, ty = D * 0.865;
    c.fillStyle = "rgba(8,12,18,0.78)"; roundRectPath(c, tx, ty, tw, th, th / 2); c.fill();
    c.fillStyle = "#ffffff"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(txt, R, ty + th / 2 + 1);
  }

  /* ------------------------------ canvas textures for the apparatus ------------------------------ */
  function sleeveTex(lines, bandCss, bg) {
    return canvasTex(512, 128, function (c, w, h) {
      c.fillStyle = bg || "#121417"; c.fillRect(0, 0, w, h);
      c.fillStyle = bandCss; c.fillRect(0, 0, w, h * 0.2);
      c.fillStyle = "#f4f4ef"; c.textAlign = "center"; c.textBaseline = "middle";
      for (var k = 0; k < 4; k++) {
        var cx = w * (0.125 + 0.25 * k);
        c.font = "800 " + (lines[1] ? 50 : 66) + "px Manrope, Arial, sans-serif"; c.fillText(lines[0], cx, h * (lines[1] ? 0.43 : 0.6));
        if (lines[1]) { c.font = "600 30px Manrope, Arial, sans-serif"; c.fillText(lines[1], cx, h * 0.76); }
      }
    });
  }
  function knurlTex() {
    return canvasTex(256, 8, function (c, w, h) {
      c.fillStyle = "#808080"; c.fillRect(0, 0, w, h);
      for (var x = 0; x < w; x += 4) { c.fillStyle = (x / 4) % 2 ? "#ffffff" : "#000000"; c.fillRect(x, 0, 2, h); }
    }, false);
  }
  function grainTex(seed, base, spread) {
    var r = rng(seed);
    var t = canvasTex(128, 128, function (c, w, h) {
      c.fillStyle = base; c.fillRect(0, 0, w, h);
      for (var i = 0; i < 1400; i++) { var v = Math.floor(r() * spread); c.fillStyle = "rgba(" + v + "," + v + "," + v + ",0.5)"; c.fillRect(r() * w, r() * h, 1 + r() * 2, 1 + r() * 2); }
    }, false);
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(3, 3);
    return t;
  }
  function brushedTex() {
    var r = rng(77);
    var t = canvasTex(256, 64, function (c, w, h) {
      c.fillStyle = "#808080"; c.fillRect(0, 0, w, h);
      for (var i = 0; i < 220; i++) { var v = 90 + Math.floor(r() * 120); c.strokeStyle = "rgb(" + v + "," + v + "," + v + ")"; c.lineWidth = 0.6; var y = r() * h; c.beginPath(); c.moveTo(0, y); c.lineTo(w, y + (r() - 0.5) * 2); c.stroke(); }
    }, false);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    return t;
  }
  function labelSprite(text, h) {
    var c = document.createElement("canvas"), g = c.getContext("2d"), fs = 44;
    g.font = "700 " + fs + "px Manrope, system-ui, sans-serif";
    var w = Math.ceil(g.measureText(text).width) + fs; c.width = Math.max(64, w); c.height = Math.round(fs * 1.7);
    g = c.getContext("2d");
    var r = c.height / 2; g.fillStyle = "rgba(10,15,29,0.88)";
    g.beginPath(); g.moveTo(r, 0); g.lineTo(c.width - r, 0); g.arc(c.width - r, r, r, -Math.PI / 2, Math.PI / 2); g.lineTo(r, c.height); g.arc(r, r, r, Math.PI / 2, Math.PI * 1.5); g.fill();
    g.font = "700 " + fs + "px Manrope, system-ui, sans-serif"; g.fillStyle = "#fff"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(text, c.width / 2, c.height / 2 + 2);
    var t = srgb(new THREE.CanvasTexture(c)); t.userData = { aspect: c.width / c.height };
    var s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false, depthTest: false }));
    s.scale.set(h * t.userData.aspect, h, 1); s.renderOrder = 20; s.userData.isLabel = true; s.userData.noFit = false;
    return s;
  }
  function setSpriteText(s, text) {
    var n = labelSprite(text, s.scale.y);
    if (s.material.map) s.material.map.dispose();
    s.material.map = n.material.map; s.material.needsUpdate = true; s.scale.copy(n.scale);
  }
  function glowTex(inner) {
    return canvasTex(128, 128, function (c, w, h) {
      var gr = c.createRadialGradient(64, 64, 0, 64, 64, 64);
      gr.addColorStop(0, inner); gr.addColorStop(0.35, "rgba(255,230,140,0.5)"); gr.addColorStop(1, "rgba(255,220,120,0)");
      c.fillStyle = gr; c.fillRect(0, 0, w, h);
    });
  }

  /* ------------------------------ the builder ------------------------------ */
  var X0 = 0.1, STAGE_Y0 = 0.92, STAGE_T = 0.06, SLIDE_Y = 0.015, SOCKET_Y = 1.46, TILT = 0.35;

  function create(opts) {
    opts = opts || {};
    var g = new THREE.Group(), parts = {}, listeners = {};
    var st = {
      objective: clamp(opts.objective == null ? 0 : opts.objective | 0, 0, 2),
      slide: SLIDES[opts.slide] ? opts.slide : "onion",
      eyepiece: opts.eyepiece || 10,
      mirror: opts.mirror === "concave" ? "concave" : "plane",
      iris: opts.iris == null ? 0.85 : clamp(opts.iris, 0, 1),
      f: 0.5, px: 0, py: 0, wbc: !!opts.wbc,
      labels: !!opts.labels, lightPath: opts.lightPath === false ? false : true, guide: opts.guide !== false
    };
    if (typeof opts.focus === "number") st.f = clamp(opts.focus, F_MIN, F_MAX);
    else st.f = opts.startBlurred ? 0.3 : OBJ[st.objective].f0;
    if (opts.pan) { st.px = opts.pan[0] || 0; st.py = opts.pan[1] || 0; }
    function emit(name, detail) {
      (listeners[name] || []).forEach(function (fn) { try { fn(detail, name); } catch (e) { /* listener errors never break the kit */ } });
      if (typeof opts.onEvent === "function") { try { opts.onEvent(name, detail); } catch (e2) { /* ignore */ } }
    }

    /* ---- materials ---- */
    var enamelBump = grainTex(5, "#808080", 200);
    var enamel = new THREE.MeshPhysicalMaterial({ color: 0x3b4558, roughness: 0.38, metalness: 0.15, clearcoat: 0.55, clearcoatRoughness: 0.3, bumpMap: enamelBump, bumpScale: 0.35 });
    var enamelLite = std(0x4a5568, 0.42, 0.15);
    var chromeBump = brushedTex();
    var chrome = std(0xd7dde4, 0.28, 0.85, { bumpMap: chromeBump, bumpScale: 0.12 });
    var darkMetal = std(0x15181d, 0.45, 0.5);
    var anod = std(0x0f1216, 0.5, 0.55, { bumpMap: grainTex(9, "#808080", 230), bumpScale: 0.25 });
    var rubber = std(0x0b0c0e, 0.92, 0);
    var glassM = new THREE.MeshStandardMaterial({ color: 0xdff1f5, roughness: 0.08, metalness: 0, transparent: true, opacity: 0.5, depthWrite: false, side: THREE.DoubleSide });
    var lensM = new THREE.MeshStandardMaterial({ color: 0x2c5f70, roughness: 0.05, metalness: 0.3, emissive: 0x0a2430, emissiveIntensity: 0.5 });
    var knurlBump = knurlTex();

    /* ---- foot (horseshoe: THREE.Shape + ExtrudeGeometry, bevelled) ---- */
    var fs = new THREE.Shape();
    fs.moveTo(-0.6, -0.55); fs.lineTo(0.6, -0.55); fs.quadraticCurveTo(0.8, -0.55, 0.8, -0.35); fs.lineTo(0.8, -0.2); fs.lineTo(-0.1, -0.2);
    fs.quadraticCurveTo(-0.38, -0.2, -0.38, 0); fs.quadraticCurveTo(-0.38, 0.2, -0.1, 0.2); fs.lineTo(0.8, 0.2); fs.lineTo(0.8, 0.35);
    fs.quadraticCurveTo(0.8, 0.55, 0.6, 0.55); fs.lineTo(-0.6, 0.55); fs.quadraticCurveTo(-0.8, 0.55, -0.8, 0.35); fs.lineTo(-0.8, -0.35); fs.quadraticCurveTo(-0.8, -0.55, -0.6, -0.55);
    var fgeo = new THREE.ExtrudeGeometry(fs, { depth: 0.07, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.03, bevelSegments: 4, curveSegments: 14 });
    fgeo.rotateX(-Math.PI / 2); fgeo.translate(0, 0.055, 0);
    var foot = mesh(fgeo, enamel);
    var base = new THREE.Group(); base.add(foot);
    [[0.7, 0.45], [0.7, -0.45], [-0.62, 0.45], [-0.62, -0.45]].forEach(function (p) { base.add(mesh(new THREE.CylinderGeometry(0.075, 0.08, 0.04, 14), rubber, p[0], 0.02, p[1])); });
    g.add(base); parts.base = base;

    /* ---- C-arm: lofted ribbon extruded with bevel ---- */
    var armShape = ribbonShape([[-0.64, 0.1], [-0.72, 0.45], [-0.77, 0.95], [-0.72, 1.45], [-0.52, 1.85], [-0.22, 2.03], [0.05, 2.03]], function (t) {
      return 0.15 - 0.06 * sm(t / 0.4) + 0.035 * sm((t - 0.72) / 0.28);
    });
    var ageo = new THREE.ExtrudeGeometry(armShape, { depth: 0.2, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.025, bevelSegments: 4, curveSegments: 12 });
    ageo.translate(0, 0, -0.1);
    var arm = mesh(ageo, enamel); g.add(arm); parts.arm = arm;

    /* ---- head (prism housing) + body tube + inclined eyepiece tube ---- */
    var hs = roundedRect(new THREE.Shape(), -0.22, 1.88, 0.34, 2.16, 0.08);
    var hgeo = new THREE.ExtrudeGeometry(hs, { depth: 0.2, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.025, bevelSegments: 4, curveSegments: 10 });
    hgeo.translate(0, 0, -0.1);
    var head = mesh(hgeo, enamel); g.add(head); parts.head = head;
    var tubeG = new THREE.Group();
    tubeG.add(lathe(smoothPts([[0.0005, 1.58], [0.1, 1.58], [0.1, 1.62], [0.09, 1.64], [0.09, 1.86], [0.105, 1.88], [0.105, 1.93], [0.0005, 1.93]], 4), 32, darkMetal).translateX(X0));
    tubeG.add(mesh(new THREE.TorusGeometry(0.1, 0.012, 8, 32), chrome, X0, 1.6, 0).rotateX(Math.PI / 2));
    var TILTE = 0.6;                                     // eyepiece tube leans 34 deg toward the viewer's right
    var eyeG = new THREE.Group(); eyeG.position.set(X0 + 0.04, 2.14, 0); eyeG.rotation.z = -TILTE; tubeG.add(eyeG); g.add(tubeG);
    var eyeTube = lathe([[0.0005, -0.06], [0.09, -0.06], [0.09, 0.0], [0.082, 0.04], [0.082, 0.5], [0.0005, 0.5]], 28, darkMetal);
    eyeG.add(eyeTube);
    eyeG.add(mesh(new THREE.TorusGeometry(0.09, 0.011, 8, 28), chrome, 0, 0.02, 0).rotateX(Math.PI / 2));
    parts.tube = tubeG;
    // eyepiece: barrel + engraved sleeve + rubber eye-cup + top lens
    var eyepiece = new THREE.Group(); eyepiece.position.y = 0.44; eyeG.add(eyepiece);
    eyepiece.add(lathe([[0.0005, 0], [0.072, 0], [0.072, 0.03], [0.062, 0.04], [0.062, 0.36], [0.0005, 0.36]], 28, chrome));
    var epSleeve = mesh(new THREE.CylinderGeometry(0.0635, 0.0635, 0.1, 32, 1, true), std(0xffffff, 0.5, 0.1, { map: null }), 0, 0.17, 0);
    epSleeve.material.map = sleeveTex(["10×"], "#9aa3ad", "#14161a"); epSleeve.material.map.offset.x = 0.125; epSleeve.material.map.wrapS = THREE.RepeatWrapping;
    epSleeve.userData.eyeSleeve = true; eyepiece.add(epSleeve);
    eyepiece.add(lathe(smoothPts([[0.066, 0.3], [0.072, 0.34], [0.088, 0.4], [0.098, 0.455], [0.092, 0.468], [0.074, 0.45], [0.066, 0.41]], 10), 28, rubber).translateY(0.0));
    var topLens = mesh(new THREE.CircleGeometry(0.066, 28), lensM, 0, 0.42, 0); topLens.rotation.x = -Math.PI / 2; eyepiece.add(topLens);
    parts.eyepiece = eyepiece;
    // wire the eyepiece sleeve text to the real eyepiece power
    function updEyeSleeve() {
      var tex = sleeveTex([st.eyepiece + "×"], "#9aa3ad", "#14161a"); tex.offset.x = 0.125; tex.wrapS = THREE.RepeatWrapping;
      if (epSleeve.material.map) epSleeve.material.map.dispose();
      epSleeve.material.map = tex; epSleeve.material.needsUpdate = true;
    }
    updEyeSleeve();
    g.updateMatrixWorld(true);
    var eyeTop = eyeG.localToWorld(new THREE.Vector3(0, 0.44 + 0.46, 0));

    /* ---- revolving nosepiece (tilted axis) with 3 objectives ---- */
    var turretOrigin = new THREE.Vector3(X0 - 0.15 * Math.cos(TILT), SOCKET_Y + 0.15 * Math.sin(TILT), 0);
    var turretTilt = new THREE.Group(); turretTilt.position.copy(turretOrigin); turretTilt.rotation.z = -TILT; g.add(turretTilt);
    var spin = new THREE.Group(); turretTilt.add(spin);
    var gear = new THREE.ExtrudeGeometry(gearShape(0.25, 40, 0.035), { depth: 0.08, bevelEnabled: false }); gear.rotateX(-Math.PI / 2);
    var turretRim = mesh(gear, chrome, 0, 0.02, 0);
    var turretCone = lathe(smoothPts([[0.0005, 0.1], [0.23, 0.1], [0.21, 0.14], [0.15, 0.17], [0.0005, 0.175]], 6), 36, anod);
    var turretUnder = lathe([[0.0005, 0.015], [0.22, 0.015], [0.24, 0.025], [0.0005, 0.025]], 36, darkMetal);
    var nosepiece = new THREE.Group(); nosepiece.add(turretRim, turretCone, turretUnder);
    spin.add(nosepiece);
    var objWraps = [], objGroups = [];
    var RHO = 0.15;
    OBJ.forEach(function (d, i) {
      var holder = new THREE.Group(), wrap = new THREE.Group();
      var L = d.len;
      var prof = [[0.0005, 0], [0.072, 0], [0.072, -0.028], [0.06, -0.036], [0.06, -0.15]]
        .concat(smoothPts([[0.06, -0.15], [0.052, -0.19], [0.042, -(L - 0.09)], [d.tipR + 0.006, -(L - 0.025)], [d.tipR, -L + 0.004]], 10).slice(1))
        .concat([[d.tipR, -L], [0.0005, -L]]);
      var body = lathe(prof, 30, chrome); holder.add(body);
      var sleeve = mesh(new THREE.CylinderGeometry(0.0615, 0.0615, 0.095, 32, 1, true), std(0xffffff, 0.55, 0.1), 0, -0.098, 0);
      sleeve.material.map = sleeveTex([d.mag + "×/" + d.na.toFixed(2), "160/0.17"], d.bandCss); sleeve.material.map.offset.x = 0.125; sleeve.material.map.wrapS = THREE.RepeatWrapping;
      holder.add(sleeve);
      holder.add(mesh(new THREE.CylinderGeometry(0.0625, 0.0625, 0.014, 32), std(d.band, 0.35, 0.1, { emissive: d.band, emissiveIntensity: 0.18 }), 0, -0.052, 0));
      var lens = mesh(new THREE.CircleGeometry(d.tipR * 0.72, 20), lensM, 0, -L - 0.001, 0); lens.rotation.x = Math.PI / 2; holder.add(lens);
      if (i === 2) holder.add(lathe([[d.tipR + 0.004, -L + 0.07], [d.tipR + 0.004, -L + 0.008], [d.tipR + 0.0005, -L + 0.003], [d.tipR - 0.003, -L + 0.07]], 18, darkMetal)); // spring-loaded front tip
      holder.userData.idx = i;
      holder.traverse(function (c) { c.userData.objIndex = i; });
      holder.position.set(RHO, 0, 0); holder.rotation.z = TILT;
      wrap.rotation.y = i * TAU / 3; wrap.add(holder); spin.add(wrap);
      objWraps.push(wrap); objGroups.push(holder);
    });
    g.updateMatrixWorld(true);
    var objAnchor = mesh(new THREE.BoxGeometry(0.2, 0.34, 0.2), new THREE.MeshBasicMaterial({ visible: false }), X0, SOCKET_Y - 0.19, 0);
    g.add(objAnchor);
    parts.nosepiece = nosepiece; parts.objective = objAnchor;

    /* ---- stage group: plate with aperture, bracket, clips, condenser + iris, slide ---- */
    var stageG = new THREE.Group(); g.add(stageG);
    var ss = roundedRect(new THREE.Shape(), X0 - 0.55, -0.5, X0 + 0.55, 0.5, 0.09);
    var hole = new THREE.Path(); hole.absarc(X0, 0, 0.17, 0, TAU, true); ss.holes.push(hole);
    var sgeo = new THREE.ExtrudeGeometry(ss, { depth: STAGE_T - 0.02, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.012, bevelSegments: 3, curveSegments: 18 });
    sgeo.rotateX(-Math.PI / 2); sgeo.translate(0, STAGE_Y0 + 0.01, 0);
    var plate = mesh(sgeo, anod);
    var bs = roundedRect(new THREE.Shape(), -0.78, STAGE_Y0 - 0.16, X0 - 0.4, STAGE_Y0 + 0.01, 0.04);
    var bgeo = new THREE.ExtrudeGeometry(bs, { depth: 0.2, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.015, bevelSegments: 3 }); bgeo.translate(0, 0, -0.1);
    var bracket = mesh(bgeo, darkMetal);
    var stageGrp = new THREE.Group(); stageGrp.add(plate, bracket);
    stageG.add(stageGrp); parts.stage = stageGrp;
    var apRing = mesh(new THREE.TorusGeometry(0.17, 0.008, 8, 40), chrome, X0, STAGE_Y0 + STAGE_T, 0); apRing.rotation.x = Math.PI / 2; stageG.add(apRing); parts.aperture = apRing;
    // spring clips (bent steel wire tubes)
    var clips = new THREE.Group();
    [X0 - 0.3, X0 + 0.3].forEach(function (cx) {
      var pts = [[cx, STAGE_Y0 + 0.07, -0.44], [cx + 0.03, STAGE_Y0 + 0.11, -0.36], [cx + 0.05, STAGE_Y0 + 0.095, -0.26], [cx + 0.03, STAGE_Y0 + 0.075, -0.15], [cx, STAGE_Y0 + 0.068, -0.115]].map(function (p) { return new THREE.Vector3(p[0], p[1], p[2]); });
      var tb = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 24, 0.009, 8, false), chrome);
      var screw = mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.02, 14), chrome, cx, STAGE_Y0 + 0.07, -0.44);
      var tip = mesh(new THREE.SphereGeometry(0.014, 10, 8), chrome, cx, STAGE_Y0 + 0.068, -0.115);
      clips.add(tb, screw, tip);
    });
    stageG.add(clips); parts.clips = clips;
    // condenser (lathe), with iris housing and lever
    var cond = new THREE.Group();
    cond.add(lathe(smoothPts([[0.0005, 0], [0.16, 0], [0.165, 0.02], [0.165, 0.07], [0.13, 0.1], [0.105, 0.14], [0.105, 0.2], [0.14, 0.215], [0.14, 0.255], [0.125, 0.262], [0.0005, 0.262]], 5), 36, darkMetal));
    var cTop = mesh(new THREE.SphereGeometry(0.115, 24, 10, 0, TAU, 0, 0.55), lensM, 0, 0.215, 0); cTop.scale.y = 0.35; cond.add(cTop);
    cond.add(mesh(new THREE.TorusGeometry(0.165, 0.012, 8, 36), chrome, 0, 0.045, 0).rotateX(Math.PI / 2));
    cond.position.set(X0, STAGE_Y0 - 0.2, 0); stageG.add(cond); parts.condenser = cond;
    var irisG = new THREE.Group(); irisG.position.set(X0, STAGE_Y0 - 0.2 + 0.002, 0);
    var leaves = [];
    for (var lv = 0; lv < 8; lv++) {
      var lsh = new THREE.Shape(); lsh.moveTo(0, 0); lsh.lineTo(0.17, -0.02); lsh.quadraticCurveTo(0.12, 0.09, 0.02, 0.1); lsh.closePath();
      var lm = mesh(new THREE.ShapeGeometry(lsh), std(0x2b2f36, 0.5, 0.7, { side: THREE.DoubleSide }));
      lm.rotation.x = Math.PI / 2; lm.userData.base = lv * TAU / 8; irisG.add(lm); leaves.push(lm);
    }
    stageG.add(irisG);
    var lever = new THREE.Group();
    lever.add(mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.28, 10), chrome, 0, 0, 0.28).rotateX(Math.PI / 2));
    lever.add(mesh(new THREE.SphereGeometry(0.035, 14, 10), rubber, 0, 0, 0.42));
    lever.position.set(X0, STAGE_Y0 - 0.2 + 0.045, 0); stageG.add(lever);
    var irisPart = new THREE.Group(); irisPart.add(irisG); irisPart.add(lever); stageG.add(irisPart); parts.iris = irisPart;
    // slide
    var slideG = new THREE.Group(); slideG.position.set(X0, STAGE_Y0 + STAGE_T + SLIDE_Y, 0); stageG.add(slideG);
    var glassSlide = mesh(new THREE.BoxGeometry(0.75, 0.03, 0.25), glassM); slideG.add(glassSlide);
    var lblMat = new THREE.MeshStandardMaterial({ roughness: 0.8, metalness: 0 });
    var lblPlane = mesh(new THREE.PlaneGeometry(0.16, 0.23), lblMat, -0.285, 0.0165, 0); lblPlane.rotation.x = -Math.PI / 2; slideG.add(lblPlane);
    var cover = mesh(new THREE.BoxGeometry(0.22, 0.008, 0.22), new THREE.MeshStandardMaterial({ color: 0xe8f6fb, roughness: 0.05, transparent: true, opacity: 0.38, depthWrite: false }), 0, 0.019, 0);
    slideG.add(cover);
    var specMat = new THREE.MeshStandardMaterial({ roughness: 0.7, transparent: true, opacity: 0.94, depthWrite: false, side: THREE.DoubleSide });
    var specShapes = {
      onion: roundedRect(new THREE.Shape(), -0.075, -0.06, 0.075, 0.06, 0.012),
      cork: (function () { var s = new THREE.Shape(); s.moveTo(-0.07, -0.03); s.quadraticCurveTo(-0.03, -0.08, 0.04, -0.05); s.quadraticCurveTo(0.09, -0.01, 0.06, 0.05); s.quadraticCurveTo(0.0, 0.085, -0.06, 0.04); s.quadraticCurveTo(-0.09, 0.0, -0.07, -0.03); return s; })(),
      blood: (function () { var s = new THREE.Shape(); s.moveTo(-0.12, -0.085); s.lineTo(0.22, -0.075); s.quadraticCurveTo(0.31, -0.05, 0.3, -0.0); s.quadraticCurveTo(0.31, 0.04, 0.22, 0.075); s.lineTo(-0.12, 0.085); s.closePath(); return s; })()
    };
    var specMesh = new THREE.Mesh(new THREE.ShapeGeometry(specShapes.onion, 12), specMat);
    specMesh.rotation.x = -Math.PI / 2; specMesh.position.y = 0.0155; slideG.add(specMesh);
    slideG.userData.noFitGroup = true;
    parts.slide = slideG; parts.coverslip = cover; parts.specimen = specMesh;
    // frosted end label textures
    var patchTexCache = {};
    function patchTex(kind) {
      if (patchTexCache[kind]) return patchTexCache[kind];
      var t = canvasTex(128, 128, function (c) { drawSpecimen(c, 128, kind, 128 / 0.6, 0, 0, false); });
      patchTexCache[kind] = t; return t;
    }
    var lblTexCache = {};
    function lblTex(kind) {
      if (lblTexCache[kind]) return lblTexCache[kind];
      var t = canvasTex(128, 256, function (c, w, h) {
        c.fillStyle = "#f2efe6"; c.fillRect(0, 0, w, h);
        c.fillStyle = kind === "blood" ? "#c0392b" : kind === "cork" ? "#8a5a2b" : "#c9a227"; c.fillRect(0, 0, w, 26);
        c.save(); c.translate(w / 2, h / 2 + 10); c.rotate(-Math.PI / 2); c.fillStyle = "#1b1d22"; c.font = "800 44px Manrope, Arial, sans-serif"; c.textAlign = "center"; c.textBaseline = "middle";
        c.fillText(SLIDES[kind].label, 0, 0); c.restore();
      });
      lblTexCache[kind] = t; return t;
    }

    /* ---- coarse + fine focus knobs (true knurled gear geometry) ---- */
    var KX = -0.78, KY = 0.6;
    var coarseK = new THREE.Group(), fineK = new THREE.Group();
    [1, -1].forEach(function (sd) {
      var cg = new THREE.ExtrudeGeometry(gearShape(0.19, 30, 0.04), { depth: 0.1, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.006, bevelSegments: 2 });
      var cm = mesh(cg, std(0x1a1d23, 0.55, 0.35)); cm.position.z = sd > 0 ? 0.12 : -0.22;
      var cdish = mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.004, 28), std(0x2a2f38, 0.4, 0.6), 0, 0, 0); cdish.rotation.x = Math.PI / 2; cdish.position.z = sd * 0.222 + (sd > 0 ? 0.001 : -0.001);
      coarseK.add(cm, cdish);
      var fg = new THREE.ExtrudeGeometry(gearShape(0.105, 24, 0.05), { depth: 0.075, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.005, bevelSegments: 2 });
      var fm = mesh(fg, chrome); fm.position.z = sd > 0 ? 0.222 : -0.297;
      var cap = mesh(new THREE.CircleGeometry(0.04, 18), darkMetal); cap.position.z = sd > 0 ? 0.3 : -0.3; if (sd < 0) cap.rotation.y = Math.PI;
      fineK.add(fm, cap);
    });
    var axle = mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.7, 14), chrome); axle.rotation.x = Math.PI / 2;
    var knobsG = new THREE.Group(); knobsG.position.set(KX, KY, 0); knobsG.add(axle, coarseK, fineK); g.add(knobsG);
    parts.coarse = coarseK; parts.fine = fineK;

    /* ---- illumination: window light, plane / concave mirror on a swinging fork ---- */
    var M = new THREE.Vector3(X0, 0.4, 0), S = new THREE.Vector3(1.6, 1.15, 0);
    var mirrorG = new THREE.Group(); mirrorG.position.copy(M); g.add(mirrorG);
    var mTilt = new THREE.Group(); mirrorG.add(mTilt);
    var dIn = M.clone().sub(S).normalize(), nrm = new THREE.Vector3(0, 1, 0).sub(dIn).normalize();
    mTilt.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), nrm);
    var mirrorMat = std(0xe9f0f7, 0.05, 0.9, { side: THREE.DoubleSide, envMapIntensity: 1.5, emissive: 0x7f9bb8, emissiveIntensity: 0.7 });
    var planeDisc = mesh(new THREE.CircleGeometry(0.19, 40), mirrorMat);
    var cg2 = new THREE.SphereGeometry(0.55, 40, 12, 0, TAU, 0, Math.asin(0.19 / 0.55)); cg2.rotateX(-Math.PI / 2); cg2.translate(0, 0, 0.55);
    var concDisc = mesh(cg2, mirrorMat); concDisc.visible = false;
    var mFrame = mesh(new THREE.TorusGeometry(0.2, 0.02, 10, 44), chrome);
    var mBack = mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.02, 40), anod, 0, 0, -0.016); mBack.rotation.x = Math.PI / 2;
    mTilt.add(planeDisc, concDisc, mFrame, mBack);
    var forkPts = [[0, 0, 0.215], [-0.02, -0.12, 0.23], [-0.15, -0.2, 0.17], [-0.19, -0.2, 0.0], [-0.15, -0.2, -0.17], [-0.02, -0.12, -0.23], [0, 0, -0.215]].map(function (p) { return new THREE.Vector3(p[0], p[1], p[2]); });
    var fork = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(forkPts), 40, 0.014, 8, false), chrome);
    var pins = new THREE.Group(); [0.215, -0.215].forEach(function (z) { var pn = mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.03, 12), chrome, 0, 0, z); pn.rotation.x = Math.PI / 2; pins.add(pn); });
    mirrorG.add(fork, pins);
    var boomPts = [[-0.64, 0.3, 0], [-0.45, 0.24, 0], [-0.3, 0.2, 0], [M.x - 0.19 - X0 + X0, M.y - 0.2, 0]].map(function (p) { return new THREE.Vector3(p[0], p[1], p[2]); });
    g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(boomPts), 30, 0.018, 8, false), chrome));
    g.add(mesh(new THREE.SphereGeometry(0.045, 14, 10), chrome, -0.64, 0.3, 0));
    parts.mirror = mirrorG;
    // window light + beams
    var lampSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex("rgba(255,255,235,1)"), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    lampSprite.position.copy(S); lampSprite.scale.setScalar(0.62); g.add(lampSprite);
    var lampCore = mesh(new THREE.SphereGeometry(0.1, 16, 12), new THREE.MeshBasicMaterial({ color: 0xfff6c8, toneMapped: false }), S.x, S.y, S.z); g.add(lampCore);
    parts.lamp = lampCore; parts.light = lampCore;
    function beamMat(col, op) { return new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: op, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, toneMapped: false }); }
    function cyl(rt, rb) { return new THREE.CylinderGeometry(rt, rb, 1, 28, 1, true); }
    var beamIn = new THREE.Mesh(cyl(0.085, 0.085), beamMat(0xfff2b0, 0.2)); g.add(beamIn);
    var beamUpPlane = new THREE.Mesh(cyl(0.085, 0.085), beamMat(0xfff2b0, 0.24)); g.add(beamUpPlane);
    var beamUpConc = new THREE.Mesh(cyl(0.03, 0.17), beamMat(0xfff2b0, 0.3)); g.add(beamUpConc);
    var beamObj = new THREE.Mesh(cyl(0.04, 0.012), beamMat(0xfff2b0, 0.4)); g.add(beamObj); var beamObjGeo = [null, null, null], beamObjFor = -1;
    function placeBeam(m, a, b) {
      var d = b.clone().sub(a), len = d.length();
      m.position.copy(a).add(b).multiplyScalar(0.5); m.scale.set(1, len, 1);
      m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize());
    }
    placeBeam(beamIn, S, M);
    // faint ray through the tube to the eye (light path)
    var tracePts = [new THREE.Vector3(X0, 1.2, 0), new THREE.Vector3(X0, 2.1, 0), new THREE.Vector3(X0 + 0.04, 2.14, 0), eyeG.localToWorld(new THREE.Vector3(0, 0.46, 0)), eyeTop.clone()];
    var trace = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(tracePts, false, "catmullrom", 0.05), 40, 0.012, 8, false), new THREE.MeshBasicMaterial({ color: 0xfff2b0, transparent: true, opacity: 0.35, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending, toneMapped: false }));
    trace.renderOrder = 8; trace.userData.partId = "light-path"; g.add(trace);

    /* ---- eyepiece view disc (live CanvasTexture) ---- */
    var D = 512, viewCanvas = document.createElement("canvas"); viewCanvas.width = viewCanvas.height = D;
    var vctx = viewCanvas.getContext("2d");
    var viewTex = srgb(new THREE.CanvasTexture(viewCanvas));
    var viewG = new THREE.Group(); viewG.position.set(1.62, 2.28, 0.1);
    var VR = 0.56;
    var disc = mesh(new THREE.CircleGeometry(VR, 56), new THREE.MeshBasicMaterial({ map: viewTex, transparent: true, toneMapped: false })); viewG.add(disc);
    var bezel = mesh(new THREE.TorusGeometry(VR + 0.025, 0.04, 14, 64), anod, 0, 0, 0.005); viewG.add(bezel);
    var bezelIn = mesh(new THREE.TorusGeometry(VR, 0.012, 8, 64), chrome, 0, 0, 0.03); viewG.add(bezelIn);
    g.add(viewG); parts.view = viewG;
    var leader = new THREE.Line(new THREE.BufferGeometry().setFromPoints([eyeTop.clone().add(new THREE.Vector3(0.05, 0.02, 0)), new THREE.Vector3(viewG.position.x - VR * 0.8, viewG.position.y - VR * 0.1, viewG.position.z)]),
      new THREE.LineDashedMaterial({ color: 0xaeb6c2, dashSize: 0.05, gapSize: 0.04, transparent: true, opacity: 0.8 }));
    leader.computeLineDistances(); g.add(leader);
    if (opts.view === "none") { viewG.visible = false; leader.visible = false; }

    /* ---- optional short labels ---- */
    var labels = {};
    function addLabel(key, text, pos, follow) {
      var s = labelSprite(text, 0.15); s.position.copy(pos); s.userData.follow = follow || null; s.visible = st.labels; g.add(s); labels[key] = s;
    }
    addLabel("eyepiece", "Eyepiece", eyeTop.clone().add(new THREE.Vector3(0.38, 0.1, 0)));
    addLabel("tube", "Body tube", new THREE.Vector3(X0 + 0.45, 1.8, 0.2));
    addLabel("objective", "Objective", new THREE.Vector3(X0 + 0.5, 1.28, 0.15));
    addLabel("nosepiece", "Nosepiece", new THREE.Vector3(-0.8, 1.5, 0.25));
    addLabel("stage", "Stage", new THREE.Vector3(X0 + 0.78, STAGE_Y0 + 0.02, 0.3));
    addLabel("slide", "Slide", new THREE.Vector3(X0 + 0.25, STAGE_Y0 + 0.2, 0.42));
    addLabel("condenser", "Condenser", new THREE.Vector3(X0 + 0.6, STAGE_Y0 - 0.22, 0.3));
    addLabel("mirror", "Mirror", new THREE.Vector3(X0 + 0.45, 0.36, 0.45));
    addLabel("coarse", "Coarse", new THREE.Vector3(KX - 0.1, KY + 0.36, 0.34));
    addLabel("fine", "Fine", new THREE.Vector3(KX - 0.4, KY - 0.12, 0.34));
    addLabel("arm", "Arm", new THREE.Vector3(-0.98, 1.25, 0.1));
    addLabel("base", "Base", new THREE.Vector3(-0.2, 0.0, 0.7));
    var toast3d = labelSprite("Fine knob only at ×40", 0.17); toast3d.position.set(KX - 0.1, KY + 0.62, 0.35); toast3d.visible = false; g.add(toast3d);

    /* ---- tag exam parts (specific before general) for raycast / highlight ---- */
    objGroups.forEach(function (h) { tagPart(h, "objective"); });
    tagPart(parts.coarse, "coarse"); tagPart(parts.fine, "fine"); tagPart(irisPart, "iris"); tagPart(cond, "condenser");
    tagPart(apRing, "aperture"); tagPart(clips, "clips"); tagPart(cover, "coverslip"); tagPart(specMesh, "specimen"); tagPart(slideG, "slide");
    tagPart(parts.stage, "stage"); tagPart(nosepiece, "nosepiece"); tagPart(eyepiece, "eyepiece"); tagPart(tubeG, "tube"); tagPart(eyeTube, "tube");
    tagPart(head, "head"); tagPart(mirrorG, "mirror"); tagPart(lampCore, "lamp"); tagPart(viewG, "view"); tagPart(arm, "arm"); tagPart(base, "base");
    tagPart(objAnchor, "objective");
    mirrorG.parent.children.forEach(function (c) { if (c.isMesh && !c.userData.partId && c.geometry && c.geometry.type === "TubeGeometry") tagPart(c, "mirror"); });
    var pickables = [];
    g.traverse(function (c) { if (c.isMesh && c.userData && c.userData.partId && c.userData.partId !== "light-path" && c !== objAnchor && c !== disc) pickables.push(c); });
    pickables.push(disc);

    /* ---- state application ---- */
    var spinTarget = 0, spinCur = 0, spinInit = true, shake = 0, toastT = 0, fVis = st.f, viewDirty = true, sharpDirty = true, turning = 0;
    var vstate = { slide: st.slide, objective: st.objective, eyepiece: st.eyepiece, px: st.px, py: st.py, wbc: st.wbc, blur: 0, brightness: 1, iris: st.iris, blank: false, guide: st.guide };
    var blurNow = 0;
    function refreshViewState() {
      vstate.slide = st.slide; vstate.objective = st.objective; vstate.eyepiece = st.eyepiece; vstate.px = st.px; vstate.py = st.py; vstate.wbc = st.wbc; vstate.iris = st.iris; vstate.guide = st.guide;
      vstate.blur = blurOf(st.f, st.objective); vstate.brightness = brightnessOf(st.mirror, st.iris, st.objective);
    }
    function applySlide() {
      var k = st.slide;
      specMesh.geometry.dispose();
      specMesh.geometry = new THREE.ShapeGeometry(specShapes[k], 14);
      var bb = new THREE.Box3().setFromBufferAttribute(specMesh.geometry.attributes.position), sz = bb.getSize(new THREE.Vector3());
      var pos = specMesh.geometry.attributes.position, uv = new Float32Array(pos.count * 2);
      for (var i = 0; i < pos.count; i++) { uv[i * 2] = (pos.getX(i) - bb.min.x) / sz.x; uv[i * 2 + 1] = (pos.getY(i) - bb.min.y) / sz.y; }
      specMesh.geometry.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
      specMat.map = patchTex(k);
      specMat.color.set(k === "blood" ? 0xffd0d6 : 0xffffff);
      specMat.needsUpdate = true;
      lblMat.map = lblTex(k); lblMat.needsUpdate = true;
      cover.visible = k !== "blood";                           // smears are not covered
      slideG.position.x = X0 - st.px * 0.01; slideG.position.z = st.py * 0.01;
    }
    function applyMirror() {
      var conc = st.mirror === "concave";
      planeDisc.visible = !conc; concDisc.visible = conc;
      beamUpPlane.visible = !conc; beamUpConc.visible = conc;
    }
    function applyIris() {
      var r = 0.03 + 0.11 * st.iris;
      leaves.forEach(function (l) { var b = l.userData.base; l.position.set(Math.cos(b) * r, 0, Math.sin(b) * r); l.rotation.z = -b; });
      lever.rotation.y = (st.iris - 0.5) * 0.9;
    }
    function applyLabels() { Object.keys(labels).forEach(function (k) { labels[k].visible = st.labels; }); }
    function setSpinTarget(first) {
      var want = -st.objective * TAU / 3;
      if (first) { spinCur = spinTarget = want; spin.rotation.y = want; return; }
      var dlt = ((want - spinTarget + Math.PI) % TAU + TAU) % TAU - Math.PI;
      spinTarget += dlt;
    }
    setSpinTarget(true); applySlide(); applyMirror(); applyIris(); applyLabels(); refreshViewState();

    function fresh() { return compute({ objective: st.objective, eyepiece: st.eyepiece, slide: st.slide }); }
    function reading() {
      var r = fresh(); r.focused = vstate.blur < 1.4; r.blur = Math.round(vstate.blur * 10) / 10; r.brightness = Math.round(vstate.brightness * 100) / 100;
      r.focus = Math.round(st.f * 1000) / 1000; r.mirror = st.mirror; r.iris = st.iris; r.coarseLocked = st.objective === 2;
      r.slideName = SLIDES[st.slide].name; r.slideNote = SLIDES[st.slide].note;
      return r;
    }
    function markFocus() { refreshViewState(); viewDirty = true; emit("focus", { blur: vstate.blur, focused: vstate.blur < 1.4, focus: st.f }); }
    function flash(text) { setSpriteText(toast3d, text); toast3d.visible = true; toast3d.material.opacity = 1; toastT = 1.8; }

    g.coarse = function (steps) {
      if (st.objective === 2) { shake = 1; flash("Fine knob only at ×40"); emit("coarse-locked", { message: "At ×40 use the fine focus knob only: the coarse knob could crush the slide." }); return false; }
      st.f = clamp(st.f + (steps == null ? 1 : steps) * COARSE_STEP, F_MIN, F_MAX); markFocus(); return true;
    };
    g.fine = function (steps) { st.f = clamp(st.f + (steps == null ? 1 : steps) * FINE_STEP, F_MIN, F_MAX); markFocus(); return true; };
    g.autoFocus = function () { st.f = OBJ[st.objective].f0; markFocus(); return reading(); };
    g.setObjective = function (i) {
      i = clamp(i | 0, 0, 2); if (i === st.objective) return reading();
      var wasSharp = vstate.blur < 1.4;
      st.objective = i; setSpinTarget(false); turning = 0.5;
      // objectives are parfocal: a sharp image stays almost sharp, one fine-knob touch finishes it
      if (wasSharp && opts.parfocal !== false) st.f = OBJ[i].f0 + (i > 0 ? 0.004 : 0.003); refreshViewState(); sharpDirty = true; viewDirty = true;
      emit("objective", reading()); return reading();
    };
    g.setSlide = function (k) { if (!SLIDES[k] || k === st.slide) return reading(); st.slide = k; applySlide(); refreshViewState(); sharpDirty = true; viewDirty = true; emit("slide", reading()); return reading(); };
    g.setMirror = function (k) { k = k === "concave" ? "concave" : "plane"; if (k === st.mirror) return reading(); st.mirror = k; applyMirror(); refreshViewState(); viewDirty = true; emit("mirror", reading()); return reading(); };
    g.setIris = function (v) { st.iris = clamp(v, 0, 1); applyIris(); refreshViewState(); viewDirty = true; emit("iris", reading()); return reading(); };
    g.setEyepiece = function (e) { st.eyepiece = e; updEyeSleeve(); refreshViewState(); sharpDirty = true; viewDirty = true; return reading(); };
    g.setPan = function (px, py) { st.px = px; st.py = py; applySlide(); refreshViewState(); sharpDirty = true; viewDirty = true; };
    g.setLabels = function (on) { st.labels = !!on; applyLabels(); };
    g.measure = function () { var r = reading(); emit("measure", r); return r; };
    g.reading = reading;
    g.on = function (n, fn) { (listeners[n] = listeners[n] || []).push(fn); return g; };
    g.off = function (n, fn) { listeners[n] = (listeners[n] || []).filter(function (f) { return f !== fn; }); return g; };
    g.viewCanvas = viewCanvas;
    g.pickables = pickables;
    g.partOf = function (obj) { while (obj) { if (obj.userData && obj.userData.partId) return obj.userData.partId; obj = obj.parent; } return null; };
    g.tap = function (part) {
      if (part === "coarse") return g.coarse(1);
      if (part === "fine") return g.fine(1);
      if (part === "objective" || part === "nosepiece") return g.setObjective((st.objective + 1) % 3);
      if (part === "slide" || part === "specimen" || part === "coverslip") return g.setSlide(SLIDE_ORDER[(SLIDE_ORDER.indexOf(st.slide) + 1) % 3]);
      if (part === "mirror") return g.setMirror(st.mirror === "plane" ? "concave" : "plane");
      if (part === "iris" || part === "condenser") return g.setIris(st.iris > 0.9 ? 0.3 : st.iris + 0.3);
      return null;
    };
    /* highlight (emissive pulse on cloned materials; restores on clear) */
    var saved = [], hiPart = null, hiT = 0;
    function hiClear() {
      saved.forEach(function (s) { s.mesh.material = s.orig; s.clone.forEach(function (m) { m.dispose(); }); });
      saved = []; hiPart = null;
    }
    g.highlight = function (part, on) {
      hiClear();
      if (!part || on === false) return;
      hiPart = part; hiT = 0;
      pickables.forEach(function (m) {
        if (m.userData.partId !== part || !m.material) return;
        if (part === "objective" && m.userData.objIndex != null && m.userData.objIndex !== st.objective) return;
        var arr = Array.isArray(m.material) ? m.material : [m.material], cl = arr.map(function (x) { return x.clone(); });
        saved.push({ mesh: m, orig: m.material, clone: cl });
        m.material = Array.isArray(m.material) ? cl : cl[0];
      });
    };
    g.dispose = function () {
      hiClear();
      g.traverse(function (c) { if (c.geometry) c.geometry.dispose(); if (c.material) (Array.isArray(c.material) ? c.material : [c.material]).forEach(function (m) { if (m.map) m.map.dispose(); m.dispose(); }); });
      viewTex.dispose();
    };
    var camRef = null;
    g.setCamera = function (cam) { camRef = cam; };
    g.state = st;

    /* ---- frame update ---- */
    var tmpA = new THREE.Vector3(), tmpB = new THREE.Vector3(), lastKey = "";
    function update(dt, t) {
      dt = dt || 0;
      // turret spin
      var dsp = spinTarget - spinCur; spinCur += dsp * Math.min(1, dt * 7); spin.rotation.y = spinCur;
      if (turning > 0) { turning -= dt; if (turning <= 0) { viewDirty = true; } }
      var blank = turning > 0 && Math.abs(spinTarget - spinCur) > 0.12;
      if (blank !== vstate.blank) { vstate.blank = blank; viewDirty = true; }
      // stage travel, knob rotation (tied to the focus value)
      fVis += (st.f - fVis) * Math.min(1, dt * 9);
      var stageDy = (fVis - 0.5) * 0.3;
      stageG.position.y = stageDy;
      var jitter = shake > 0 ? Math.sin(t * 70) * 0.03 * shake : 0;
      coarseK.rotation.z = -st.f * 22 + jitter; fineK.rotation.z = -st.f * 230 + jitter * 2;
      arm.position.x = jitter * 0.1;
      if (shake > 0) shake = Math.max(0, shake - dt * 2.4);
      // objective anchor follows the active objective (for narrator rect())
      var L = OBJ[st.objective].len; objAnchor.scale.y = L / 0.34; objAnchor.position.y = SOCKET_Y - L / 2;
      // beams
      var slideTop = tmpA.set(X0, STAGE_Y0 + stageDy + STAGE_T + 0.04, 0);
      tmpB.set(X0, M.y + 0.04, 0);
      var lenB = slideTop.y - tmpB.y;
      var up = st.mirror === "plane" ? beamUpPlane : beamUpConc;
      up.position.set(X0, tmpB.y + lenB / 2, 0); up.scale.set(1, lenB, 1);
      var bright = vstate.brightness;
      beamIn.material.opacity = 0.06 + 0.1 * bright; up.material.opacity = (st.mirror === "plane" ? 0.08 : 0.12) + 0.14 * bright;
      var tipY = SOCKET_Y - L;
      var gap = Math.max(0.02, tipY - slideTop.y);
      var rTop = Math.max(0.02, gap * Math.tan(Math.asin(OBJ[st.objective].na))) + 0.015;
      if (beamObjFor !== st.objective) { if (!beamObjGeo[st.objective]) beamObjGeo[st.objective] = new THREE.CylinderGeometry(rTop, 0.01, 1, 20, 1, true); beamObj.geometry = beamObjGeo[st.objective]; beamObjFor = st.objective; }
      beamObj.position.set(X0, slideTop.y + gap / 2, 0); beamObj.scale.set(1, gap, 1);
      beamObj.material.opacity = 0.18 + 0.3 * bright;
      trace.visible = st.lightPath; beamObj.visible = true;
      trace.material.opacity = 0.06 + 0.16 * bright;
      lampSprite.material.opacity = 0.75 + 0.2 * Math.sin((t || 0) * 2);
      // labels that follow the active objective
      labels.objective.position.set(X0 + 0.5, SOCKET_Y - L * 0.55, 0.15);
      // toast
      if (toastT > 0) { toastT -= dt; toast3d.material.opacity = Math.min(1, toastT); if (toastT <= 0) toast3d.visible = false; }
      // billboard the view disc a little toward the camera
      if (camRef) { tmpA.copy(camRef.position); viewG.lookAt(tmpA); }
      // highlight pulse
      if (hiPart) { hiT += dt; var e = 0.35 + 0.35 * Math.sin(hiT * 6); saved.forEach(function (s) { s.clone.forEach(function (m) { if (m.emissive) { m.emissive.setHex(0xffd166); m.emissiveIntensity = e; } }); }); }
      // eyepiece view
      if (viewDirty) {
        refreshViewState();
        var key = [vstate.slide, vstate.objective, vstate.eyepiece, vstate.px, vstate.py, vstate.wbc].join("|");
        if (sharpDirty || key !== lastKey) {
          var M2 = vstate.eyepiece * OBJ[vstate.objective].mag, field = FIELD_K / M2;
          if (!vstate._sharp) { vstate._sharp = document.createElement("canvas"); vstate._sharp.width = vstate._sharp.height = D; }
          drawSpecimen(vstate._sharp.getContext("2d"), D, vstate.slide, D / field, vstate.px, vstate.py, vstate.wbc);
          lastKey = key; sharpDirty = false;
        }
        composeView(vctx, D, vstate, FIELD_K / (vstate.eyepiece * OBJ[vstate.objective].mag));
        viewTex.needsUpdate = true; viewDirty = false;
      }
      if (viewDirty === false && Math.abs(fVis - st.f) > 0.0005) { /* knob/stage easing only: image already uses st.f */ }
    }
    g.userData.sharpFromView = vstate;
    attachCompat(g, parts, update, function (o) {
      o = o || {};
      if (o.eyepiece != null) g.setEyepiece(o.eyepiece);
      if (o.slide) g.setSlide(o.slide);
      if (o.mirror) g.setMirror(o.mirror);
      if (o.iris != null) g.setIris(o.iris);
      if (o.objective != null) g.setObjective(o.objective);
      if (typeof o.focus === "number") { st.f = clamp(o.focus, F_MIN, F_MAX); markFocus(); }
      if (o.pan) g.setPan(o.pan[0] || 0, o.pan[1] || 0);
      if (o.wbc != null) { st.wbc = !!o.wbc; sharpDirty = true; viewDirty = true; }
      if (o.labels != null) g.setLabels(o.labels);
      if (o.lightPath != null) st.lightPath = !!o.lightPath;
      if (o.guide != null) { st.guide = !!o.guide; viewDirty = true; }
    });
    if (opts.scale) g.scale.setScalar(opts.scale);
    update(0, 0);
    return g;
  }

  function makeHighlighter(scene) {
    var saved = [];
    function clear() { saved.forEach(function (s) { s.mesh.material = s.orig; }); saved = []; }
    function highlight(part, colour) {
      clear(); if (!part || !scene) return;
      var col = new THREE.Color(colour != null ? colour : 0xffd166);
      scene.traverse(function (o) {
        if (o.isMesh && o.userData && o.userData.partId === part && o.material && !Array.isArray(o.material) && o.material.emissive) {
          var c = o.material.clone(); saved.push({ mesh: o, orig: o.material }); c.emissive.copy(col); c.emissiveIntensity = 0.6; o.material = c;
        }
      });
    }
    return { highlight: highlight, clear: clear };
  }

  global.MicroscopeBench = {
    version: 1, create: create, compute: compute, renderView: renderView, makeHighlighter: makeHighlighter,
    OBJECTIVES: OBJ.map(function (o) { return { mag: o.mag, na: o.na }; }), SLIDES: SLIDES, FIELD_K: FIELD_K
  };
})(window);
