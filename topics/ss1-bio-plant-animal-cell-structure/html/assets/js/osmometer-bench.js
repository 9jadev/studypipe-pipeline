/* =========================================================
   StudyPipe · OsmometerKit v1 — potato-strip osmometer practical (WAEC Paper 3 style)
   Classic script (no modules), 100% offline, uses window.THREE only.

   OsmometerKit.create(opts) -> THREE.Group g with
     g.group / g.parts / g.userData.parts   { rack, tube, strip, borer, potato, balance, pan, lcd, tile, blotter, bench,
                                              tube0..tube5, strip0..strip5 }
     g.tick / g.update / g.userData.update(dt, t)
     g.setState(obj)  { errors:{unblotted,overBlotted,evaporation}, minutes, speed, selected, onEvent }
     g.reading()      table rows computed from the model (never typed text)
     g.select(i) g.weigh(i) g.leave(minutes) g.reweigh(i) g.runAll() g.reset()
     g.viewFor(partName)  { target:[x,y,z], dist }  (camera framing helper)
     g.pickPart(raycaster) -> partId | null
   Model:  m1 = m0 (1 + p(c)/100)   p(c) = Fritsch-Carlson monotone cubic through the
           02-lesson Lesson 04 table (+14.0, +4.8, -2.0, -8.0, -12.2, -16.5 % at 0.0..1.0 mol dm^-3).
   ========================================================= */
(function () {
  "use strict";
  if (typeof THREE === "undefined") return;
  var V3 = THREE.Vector3, TAU = Math.PI * 2;

  /* ---------------- the model ---------------- */
  var KNOT_C = [0.0, 0.2, 0.4, 0.6, 0.8, 1.0];
  var KNOT_P = [14.0, 4.8, -2.0, -8.0, -12.2, -16.5];
  var T_REF = 30;      // minutes to (near) equilibrium: phi(30) = 1 exactly
  var TAU_MIN = 9;     // time constant of water uptake/loss, minutes
  var ERR = {
    FILM_G: 0.08,      // unblotted: surface water left on the strip raises the final mass (g)
    SQUEEZE_G: -0.06,  // over-blotted: sap pressed out of cut cells lowers the final mass (g)
    TILE_G: -0.03,     // strip left on the tile: evaporation lowers the final mass (g)
    CONC_UP: 0.08      // evaporation from open tubes: solution ~8 % more concentrated
  };

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
  var KNOT_M = tangents(KNOT_C, KNOT_P);

  /* percentage change in mass after full soak at concentration c (mol dm^-3) */
  function pct(c) {
    var n = KNOT_C.length;
    if (c <= KNOT_C[0]) return KNOT_P[0] + KNOT_M[0] * (c - KNOT_C[0]);
    if (c >= KNOT_C[n - 1]) return KNOT_P[n - 1] + KNOT_M[n - 1] * (c - KNOT_C[n - 1]);
    var k = 0;
    while (c > KNOT_C[k + 1]) k++;
    var h = KNOT_C[k + 1] - KNOT_C[k], t = (c - KNOT_C[k]) / h, t2 = t * t, t3 = t2 * t;
    return (2 * t3 - 3 * t2 + 1) * KNOT_P[k] + (t3 - 2 * t2 + t) * h * KNOT_M[k] +
           (-2 * t3 + 3 * t2) * KNOT_P[k + 1] + (t3 - t2) * h * KNOT_M[k + 1];
  }
  function isotonic() {
    var lo = 0, hi = 1, i;
    for (i = 0; i < 50; i++) { var mid = (lo + hi) / 2; if (pct(mid) > 0) lo = mid; else hi = mid; }
    return (lo + hi) / 2;
  }
  function phi(minutes) {
    if (minutes <= 0) return 0;
    return Math.min(1, (1 - Math.exp(-minutes / TAU_MIN)) / (1 - Math.exp(-T_REF / TAU_MIN)));
  }
  function round2(x) { return Math.round(x * 100 + (x >= 0 ? 1e-9 : -1e-9)) / 100; }
  function round1(x) { return Math.round(x * 10 + (x >= 0 ? 1e-9 : -1e-9)) / 10; }
  function firmness(p) { return p > 6 ? "very firm, turgid" : p > 0 ? "firm" : p > -4 ? "slightly soft" : p > -10 ? "limp" : "very limp, flaccid"; }

  /* balance reading (g, 2 d.p.) for the final weighing */
  function finalMass(m0, c, minutes, errs) {
    errs = errs || {};
    var ceff = c * (errs.evaporation ? 1 + ERR.CONC_UP : 1);
    var m = m0 * (1 + pct(ceff) / 100 * phi(minutes));
    if (errs.unblotted) m += ERR.FILM_G;
    if (errs.overBlotted) m += ERR.SQUEEZE_G;
    if (errs.evaporation) m += ERR.TILE_G;
    return round2(m);
  }

  /* ---------------- helpers ---------------- */
  function rng(seed) { var s = (seed || 1) >>> 0; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  function srgb(tex) {
    if ("colorSpace" in tex && THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
    else if (THREE.sRGBEncoding) tex.encoding = THREE.sRGBEncoding;
    return tex;
  }
  function canvas(w, h) { var c = document.createElement("canvas"); c.width = w; c.height = h; return c; }
  function ctex(c, repX, repY) {
    var t = srgb(new THREE.CanvasTexture(c));
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    if (repX) t.repeat.set(repX, repY || repX);
    return t;
  }
  function std(color, rough, extra) {
    var m = new THREE.MeshStandardMaterial({ color: color, roughness: rough == null ? 0.5 : rough, metalness: 0.0 });
    if (extra) for (var k in extra) m[k] = extra[k];
    return m;
  }
  function shade(m, mesh) { mesh.castShadow = false; mesh.receiveShadow = false; return mesh; }
  function tagPart(obj, key, group) {
    if (!obj) return obj;
    obj.userData = obj.userData || {};
    obj.userData.partId = key;
    if (group) obj.userData.partGroup = group;
    obj.traverse(function (c) {
      c.userData = c.userData || {};
      if (!c.userData.partId) c.userData.partId = key;
      if (group && !c.userData.partGroup) c.userData.partGroup = group;
    });
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
  /* flat slab (rounded rectangle) lying on y=0 with its top at y = depth */
  function slab(w, d, thick, r, bevel) {
    var g = new THREE.ExtrudeGeometry(rr(w, d, r), { depth: thick, bevelEnabled: true, bevelSize: bevel, bevelThickness: bevel, bevelSegments: 2, curveSegments: 8 });
    g.rotateX(-Math.PI / 2);
    g.translate(0, bevel, 0);
    return g;
  }
  function uvPlanar(geo, sx, sy) {
    var p = geo.attributes.position, uv = new Float32Array(p.count * 2);
    for (var i = 0; i < p.count; i++) { uv[i * 2] = p.getX(i) * sx; uv[i * 2 + 1] = p.getZ(i) * sy + p.getY(i) * 0.0; }
    geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
    return geo;
  }

  /* ---------------- procedural textures (seeded, offline) ---------------- */
  function woodTex(seed, base) {
    var c = canvas(256, 256), x = c.getContext("2d"), r = rng(seed), i;
    x.fillStyle = base || "#b98a5c"; x.fillRect(0, 0, 256, 256);
    for (i = 0; i < 70; i++) {
      var y0 = r() * 256, a = 0.05 + r() * 0.12;
      x.strokeStyle = "rgba(" + (r() < 0.5 ? "70,40,18" : "230,190,140") + "," + a + ")";
      x.lineWidth = 0.5 + r() * 2.2; x.beginPath(); x.moveTo(0, y0);
      for (var u = 0; u <= 256; u += 32) x.lineTo(u, y0 + Math.sin(u * 0.03 + i) * 3 + (r() - 0.5) * 1.5);
      x.stroke();
    }
    return ctex(c);
  }
  function benchTex() {
    var c = canvas(256, 256), x = c.getContext("2d"), r = rng(77), i;
    x.fillStyle = "#6f7d86"; x.fillRect(0, 0, 256, 256);
    for (i = 0; i < 1400; i++) { x.fillStyle = "rgba(" + (r() < 0.5 ? "255,255,255" : "20,30,40") + "," + (0.03 + r() * 0.07) + ")"; x.fillRect(r() * 256, r() * 256, 1 + r() * 2, 1 + r() * 2); }
    return ctex(c, 3, 2);
  }
  function glazeTex() {
    var c = canvas(128, 128), x = c.getContext("2d"), r = rng(5), i;
    x.fillStyle = "#f4f4f1"; x.fillRect(0, 0, 128, 128);
    for (i = 0; i < 260; i++) { x.fillStyle = "rgba(120,120,120," + (0.04 + r() * 0.06) + ")"; x.fillRect(r() * 128, r() * 128, 1, 1); }
    return ctex(c);
  }
  function brushedBump(seed) {
    var c = canvas(128, 128), x = c.getContext("2d"), r = rng(seed), i;
    x.fillStyle = "#808080"; x.fillRect(0, 0, 128, 128);
    for (i = 0; i < 220; i++) { var g = 90 + r() * 90 | 0; x.strokeStyle = "rgb(" + g + "," + g + "," + g + ")"; x.lineWidth = 0.6; var y = r() * 128; x.beginPath(); x.moveTo(0, y); x.lineTo(128, y + (r() - 0.5) * 2); x.stroke(); }
    return ctex(c);
  }
  function potatoFleshTex() {
    var c = canvas(128, 128), x = c.getContext("2d"), r = rng(31), i;
    x.fillStyle = "#efe2b4"; x.fillRect(0, 0, 128, 128);
    for (i = 0; i < 320; i++) { x.fillStyle = "rgba(" + (r() < 0.6 ? "255,250,225" : "205,185,125") + "," + (0.1 + r() * 0.25) + ")"; x.beginPath(); x.arc(r() * 128, r() * 128, 0.6 + r() * 1.8, 0, TAU); x.fill(); }
    x.strokeStyle = "rgba(190,165,100,.25)"; x.lineWidth = 1;
    for (i = 0; i < 6; i++) { x.beginPath(); x.moveTo(0, i * 22 + 6); x.lineTo(128, i * 22 + 10 + r() * 6); x.stroke(); }
    return ctex(c);
  }
  function fibreTex() {
    var c = canvas(256, 192), x = c.getContext("2d"), r = rng(9), i;
    x.fillStyle = "#f2ecdf"; x.fillRect(0, 0, 256, 192);
    for (i = 0; i < 900; i++) { x.strokeStyle = "rgba(" + (r() < 0.5 ? "170,150,120" : "255,255,250") + "," + (0.08 + r() * 0.14) + ")"; x.lineWidth = 0.5; var a = r() * 256, b = r() * 192, t = r() * TAU; x.beginPath(); x.moveTo(a, b); x.lineTo(a + Math.cos(t) * 6, b + Math.sin(t) * 6); x.stroke(); }
    return c;
  }
  function labelTex(txt, hue) {
    var c = canvas(160, 128), x = c.getContext("2d");
    x.fillStyle = "#fbfaf4"; x.fillRect(0, 0, 160, 128);
    x.fillStyle = "hsl(" + hue + ",70%,42%)"; x.fillRect(0, 0, 160, 26);
    x.fillStyle = "#14202b"; x.font = "bold 62px monospace"; x.textAlign = "center"; x.textBaseline = "middle";
    x.fillText(txt, 80, 80);
    return ctex(c);
  }

  /* ---------------- parts ---------------- */
  var TUBE_H = 1.5, TUBE_R = 0.125, TUBE_T = 0.013, FLOOR = 0.125;
  var STRIP_L = 0.40, STRIP_R = 0.04, VIS_GAIN = 2.2;
  var TUBE_Z = -0.2;

  function tubeGeometry() {
    var pts = [], i, R = TUBE_R, ri = R - TUBE_T;
    for (i = 0; i <= 8; i++) { var a = (i / 8) * Math.PI / 2; pts.push(new THREE.Vector2(Math.sin(a) * R, R - Math.cos(a) * R)); }
    pts.push(new THREE.Vector2(R, TUBE_H - 0.03));
    pts.push(new THREE.Vector2(R + 0.009, TUBE_H - 0.018));
    pts.push(new THREE.Vector2(R + 0.011, TUBE_H - 0.004));
    pts.push(new THREE.Vector2(R - TUBE_T * 0.4, TUBE_H));
    pts.push(new THREE.Vector2(ri, TUBE_H - 0.03));
    for (i = 8; i >= 0; i--) { var b = (i / 8) * Math.PI / 2; pts.push(new THREE.Vector2(Math.sin(b) * ri, R - Math.cos(b) * R + TUBE_T * 0.9)); }
    return new THREE.LatheGeometry(pts, 28);
  }
  function liquidGeometry(level) {
    var ri = TUBE_R - TUBE_T - 0.002, pts = [], i, bot = TUBE_T * 0.9 + 0.003;
    for (i = 0; i <= 8; i++) { var a = (i / 8) * Math.PI / 2; pts.push(new THREE.Vector2(Math.sin(a) * ri, (TUBE_R - TUBE_T * 0.1) - Math.cos(a) * (TUBE_R - TUBE_T * 0.1) + bot)); }
    pts.push(new THREE.Vector2(ri, level + 0.014));
    for (i = 1; i <= 6; i++) { var u = i / 6; pts.push(new THREE.Vector2(ri * (1 - u), level - 0.004 * Math.sin(u * Math.PI / 2) + 0.014 * (1 - Math.pow(u, 0.5)))); }
    return new THREE.LatheGeometry(pts, 28);
  }

  function buildRack(parts) {
    var g = new THREE.Group(), n = 6, sp = 0.4, L = 2.3, D = 0.34, i;
    var woodMat = std(0xffffff, 0.75, { map: woodTex(11), bumpMap: woodTex(11, "#888"), bumpScale: 0.6 });
    var woodDark = std(0xe0c4a4, 0.8, { map: woodTex(23, "#a97c52") });
    var base = new THREE.Mesh(uvPlanar(slab(L + 0.3, D + 0.06, FLOOR - 0.02, 0.03, 0.01), 1.4, 1.4), woodMat);
    g.add(base);
    function shelf(y, th) {
      var sh = rr(L, D, 0.03), hi;
      for (hi = 0; hi < n; hi++) { var hp = new THREE.Path(); hp.absarc((hi - 2.5) * sp, 0, TUBE_R + 0.004, 0, TAU, true); sh.holes.push(hp); }
      var geo = new THREE.ExtrudeGeometry(sh, { depth: th, bevelEnabled: true, bevelSize: 0.006, bevelThickness: 0.006, bevelSegments: 2, curveSegments: 20 });
      geo.rotateX(-Math.PI / 2);
      geo.translate(0, 0, TUBE_Z * 0);
      uvPlanar(geo, 1.4, 1.4);
      var m = new THREE.Mesh(geo, woodDark); m.position.y = y; return m;
    }
    g.add(shelf(0.95, 0.04));
    g.add(shelf(0.30, 0.035));
    // end plates: trapezoid with handle slot
    [-1, 1].forEach(function (s) {
      var sh = new THREE.Shape();
      sh.moveTo(-D / 2 + 0.01, 0); sh.lineTo(D / 2 - 0.01, 0); sh.lineTo(D / 2 - 0.05, 1.0); sh.lineTo(-D / 2 + 0.05, 1.0); sh.lineTo(-D / 2 + 0.01, 0);
      var hp = new THREE.Path(); hp.moveTo(-0.05, 0.62); hp.lineTo(0.05, 0.62); hp.lineTo(0.05, 0.78); hp.lineTo(-0.05, 0.78); hp.lineTo(-0.05, 0.62); sh.holes.push(hp);
      var geo = new THREE.ExtrudeGeometry(sh, { depth: 0.05, bevelEnabled: true, bevelSize: 0.005, bevelThickness: 0.005, bevelSegments: 1 });
      geo.rotateY(Math.PI / 2);
      var m = new THREE.Mesh(geo, woodMat); m.position.set(s * (L / 2 + 0.0) - (s > 0 ? 0 : 0.05), FLOOR - 0.02, 0);
      g.add(m);
    });
    // plaque with unit + timer (canvas, redrawn by update)
    var pc = canvas(512, 56), plaqueTex = ctex(pc);
    var plaque = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 0.075), new THREE.MeshBasicMaterial({ map: plaqueTex }));
    plaque.position.set(0, 0.052, (D + 0.06) / 2 + 0.012);
    g.add(plaque);
    function drawPlaque(min) {
      var x = pc.getContext("2d");
      x.fillStyle = "#12202b"; x.fillRect(0, 0, 512, 56);
      x.fillStyle = "#f2e8c8"; x.font = "bold 26px monospace"; x.textBaseline = "middle"; x.textAlign = "left";
      x.fillText("sucrose, mol dm⁻³", 14, 29);
      x.textAlign = "right"; x.fillText("t = " + (Math.round(min * 10) / 10) + " min", 498, 29);
      plaqueTex.needsUpdate = true;
    }
    drawPlaque(0);
    g.position.z = TUBE_Z;
    parts.rack = tagPart(g, "rack");
    return { group: g, drawPlaque: drawPlaque };
  }

  function buildBorer() {
    var g = new THREE.Group(), ro = 0.03, ri = 0.0235, L = 0.62;
    var brass = std(0xe2bb62, 0.38, { metalness: 0.3, bumpMap: brushedBump(3), bumpScale: 0.5 });
    var steel = std(0xc9d0d6, 0.35, { metalness: 0.3, bumpMap: brushedBump(4), bumpScale: 0.4 });
    var pts = [new THREE.Vector2(ri, 0), new THREE.Vector2(ro * 0.78, 0.002), new THREE.Vector2(ro, 0.02), new THREE.Vector2(ro, L - 0.03),
      new THREE.Vector2(ro + 0.006, L - 0.026), new THREE.Vector2(ro + 0.006, L - 0.004), new THREE.Vector2(ri, L)];
    var tubeM = new THREE.Mesh(new THREE.LatheGeometry(pts, 28), brass); tubeM.material.side = THREE.DoubleSide;
    var inner = new THREE.Mesh(new THREE.CylinderGeometry(ri, ri, L, 20, 1, true), std(0x3a2d14, 0.8, { side: THREE.BackSide }));
    inner.position.y = L / 2;
    g.add(tubeM); g.add(inner);
    // T-handle: stem through collar + two turned ends
    var stem = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.011, 0.26, 14), steel); stem.rotation.z = Math.PI / 2; stem.position.y = L + 0.0;
    g.add(stem);
    [-1, 1].forEach(function (s) {
      var kp = [new THREE.Vector2(0, 0), new THREE.Vector2(0.016, 0.004), new THREE.Vector2(0.021, 0.02), new THREE.Vector2(0.019, 0.045), new THREE.Vector2(0.012, 0.06), new THREE.Vector2(0, 0.062)];
      var k = new THREE.Mesh(new THREE.LatheGeometry(kp, 16), std(0x2a2f36, 0.5)); k.rotation.z = -s * Math.PI / 2; k.position.set(s * 0.13, L, 0); g.add(k);
    });
    // pusher rod lying alongside
    var rod = new THREE.Group();
    var shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.6, 12), steel); shaft.position.y = 0.3;
    var kn = new THREE.Mesh(new THREE.LatheGeometry([new THREE.Vector2(0, 0), new THREE.Vector2(0.026, 0.004), new THREE.Vector2(0.028, 0.026), new THREE.Vector2(0.012, 0.038), new THREE.Vector2(0, 0.04)], 16), std(0x2a2f36, 0.5));
    kn.position.y = 0.6;
    rod.add(shaft); rod.add(kn); rod.position.x = 0.1;
    g.add(rod);
    g.rotation.x = -Math.PI / 2; // lies along z, handle at the far end
    var w = new THREE.Group(); w.add(g); w.rotation.y = -0.2;
    g.position.y = 0; w.position.y = ro + 0.002;
    g.rotation.z = 0;
    // tilt rod flat: rod & tube are children of g which lies along -z/+z
    return w;
  }

  function buildPotato() {
    var geo = new THREE.SphereGeometry(0.17, 40, 28), p = geo.attributes.position, cols = new Float32Array(p.count * 3), r = rng(41), i;
    var skin = new THREE.Color(0xa77a4a), flesh = new THREE.Color(0xefe2b4), cut = 0.11;
    for (i = 0; i < p.count; i++) {
      var x = p.getX(i), y = p.getY(i), z = p.getZ(i);
      var nz = Math.sin(x * 21 + 1.3) * Math.sin(y * 17 + 0.4) * Math.sin(z * 19) * 0.012 + Math.sin(x * 7) * 0.015;
      x = x * 1.1 + nz; y = y * 1.0 + nz; z = z * 0.95 + nz * 0.8;
      var onCut = false;
      if (y > cut) { y = cut; onCut = true; }
      p.setXYZ(i, x, y, z);
      var c = onCut ? flesh : skin.clone().multiplyScalar(0.85 + r() * 0.3);
      cols[i * 3] = c.r; cols[i * 3 + 1] = c.g; cols[i * 3 + 2] = c.b;
    }
    geo.setAttribute("color", new THREE.BufferAttribute(cols, 3));
    geo.computeVertexNormals();
    var g = new THREE.Group();
    g.add(new THREE.Mesh(geo, std(0xffffff, 0.8, { vertexColors: true })));
    // bore holes drilled in the cut face (dark pits, flesh rims)
    var holeMat = std(0x5a4a2a, 0.9);
    [[-0.1, 0.0], [-0.03, 0.04], [0.04, -0.01], [0.1, 0.03], [-0.05, -0.05], [0.0, 0.0]].forEach(function (h) {
      var d = new THREE.Mesh(new THREE.CircleGeometry(0.016, 16), holeMat);
      d.rotation.x = -Math.PI / 2; d.position.set(h[0], cut + 0.001, h[1]); g.add(d);
    });
    g.position.y = 0.17;
    return g;
  }

  function buildTile() {
    var g = new THREE.Group();
    var m = new THREE.Mesh(uvPlanar(slab(0.82, 0.58, 0.025, 0.03, 0.005), 1.2, 1.2), std(0xffffff, 0.2, { map: glazeTex() }));
    g.add(m);
    var edge = new THREE.Mesh(new THREE.PlaneGeometry(0.72, 0.48), new THREE.MeshBasicMaterial({ color: 0xe6e6e1 }));
    edge.rotation.x = -Math.PI / 2; edge.position.y = 0.0305; edge.visible = false; g.add(edge);
    return g;
  }

  function buildBlotter() {
    var g = new THREE.Group(), fc = fibreTex(), wetC = canvas(256, 192), wx = wetC.getContext("2d");
    var wetTex = ctex(wetC);
    function paintBase() { wx.drawImage(fc, 0, 0); }
    paintBase(); wetTex.needsUpdate = true;
    var topMat = std(0xffffff, 0.95, { map: wetTex });
    var sheetMat = std(0xf2ecdf, 0.95);
    for (var i = 0; i < 3; i++) {
      var geo = slab(0.58, 0.44, 0.004, 0.012, 0.0015);
      var m = new THREE.Mesh(geo, i === 2 ? topMat : sheetMat);
      m.position.y = i * 0.0065; m.rotation.y = (i - 1) * 0.05; g.add(m);
    }
    var top = g.children[2];
    // top face UVs map wetTex
    uvPlanar(top.geometry, 1 / 0.58, 1 / 0.44);
    var uvAttr = top.geometry.attributes.uv;
    for (var k = 0; k < uvAttr.count; k++) { uvAttr.setXY(k, uvAttr.getX(k) + 0.5, uvAttr.getY(k) + 0.5); }
    function stain(amount) {
      var x = 128 + (Math.random() - 0.5) * 70, y = 96 + (Math.random() - 0.5) * 50;
      var gr = wx.createRadialGradient(x, y, 2, x, y, 18 + amount * 14);
      gr.addColorStop(0, "rgba(140,125,95," + (0.28 * amount) + ")"); gr.addColorStop(1, "rgba(140,125,95,0)");
      wx.fillStyle = gr; wx.fillRect(0, 0, 256, 192); wetTex.needsUpdate = true;
    }
    function clear() { paintBase(); wetTex.needsUpdate = true; }
    return { group: g, stain: stain, clear: clear };
  }

  function buildBalance() {
    var g = new THREE.Group();
    var bodyMat = std(0xe4e6e8, 0.45), dark = std(0x2b3036, 0.5);
    var body = new THREE.Mesh(slab(0.66, 0.5, 0.1, 0.07, 0.012), bodyMat); g.add(body);
    // raised rear housing holding the load-cell spindle
    var rear = new THREE.Mesh(slab(0.4, 0.2, 0.07, 0.05, 0.01), bodyMat); rear.position.set(0, 0.112, -0.12); g.add(rear);
    // sloped front console (extruded wedge) carrying the display
    var wsh = new THREE.Shape(); wsh.moveTo(0, 0); wsh.lineTo(0.24, 0); wsh.lineTo(0.24, 0.02); wsh.lineTo(0, 0.075); wsh.lineTo(0, 0);
    var wg = new THREE.ExtrudeGeometry(wsh, { depth: 0.5, bevelEnabled: true, bevelSize: 0.004, bevelThickness: 0.004, bevelSegments: 1 });
    wg.rotateY(-Math.PI / 2); wg.translate(0.25, 0, 0);
    var wedge = new THREE.Mesh(wg, bodyMat); wedge.position.set(0, 0.112, 0.0); g.add(wedge);
    var lc = canvas(256, 96), lx = lc.getContext("2d"), lcdTex = ctex(lc);
    var scr = new THREE.Group();
    var bez = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.15), new THREE.MeshStandardMaterial({ color: 0x23282e, roughness: 0.4 }));
    var lcd = new THREE.Mesh(new THREE.PlaneGeometry(0.36, 0.135), new THREE.MeshBasicMaterial({ map: lcdTex }));
    lcd.position.z = 0.0015; scr.add(bez); scr.add(lcd);
    var slope = Math.atan2(0.055, 0.24);
    scr.rotation.x = -Math.PI / 2 + slope; scr.position.set(0, 0.112 + 0.0475 + 0.003, 0.12);
    g.add(scr);
    // buttons
    var btnProf = [new THREE.Vector2(0, 0), new THREE.Vector2(0.026, 0), new THREE.Vector2(0.026, 0.01), new THREE.Vector2(0.02, 0.015), new THREE.Vector2(0, 0.015)];
    [-1, 1].forEach(function (sd, k) {
      var b = new THREE.Mesh(new THREE.LatheGeometry(btnProf, 18), std(k ? 0x2d9d5a : 0x59606a, 0.4));
      b.position.set(sd * 0.29, 0.112, 0.1); g.add(b);
    });
    // load-cell spindle + weighing pan (lathe dish with raised rim)
    var spindle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.026, 0.07, 16), std(0xa4abb2, 0.4, { metalness: 0.3 }));
    spindle.position.set(0, 0.215, -0.12); g.add(spindle);
    var pp = [new THREE.Vector2(0, 0), new THREE.Vector2(0.09, 0), new THREE.Vector2(0.17, 0.004), new THREE.Vector2(0.185, 0.012), new THREE.Vector2(0.19, 0.022), new THREE.Vector2(0.182, 0.022), new THREE.Vector2(0.176, 0.01), new THREE.Vector2(0.09, 0.006), new THREE.Vector2(0, 0.006)];
    var pan = new THREE.Mesh(new THREE.LatheGeometry(pp, 36), std(0xd2d8dd, 0.35, { metalness: 0.25, bumpMap: brushedBump(8), bumpScale: 0.3, side: THREE.DoubleSide }));
    pan.position.set(0, 0.25, -0.12); g.add(pan);
    // rubber feet
    [[-0.28, -0.2], [0.28, -0.2], [-0.28, 0.2], [0.28, 0.2]].forEach(function (f) {
      var ft = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.035, 0.014, 14), std(0x1b1d20, 0.9)); ft.position.set(f[0], 0.007, f[1]); g.add(ft);
    });
    function drawLCD(text, stable, tare) {
      lx.fillStyle = "#b9c8a8"; lx.fillRect(0, 0, 256, 96);
      lx.fillStyle = "#1c2a16"; lx.font = "bold 58px monospace"; lx.textAlign = "right"; lx.textBaseline = "middle";
      lx.fillText(text, 196, 50);
      lx.font = "bold 28px monospace"; lx.textAlign = "left"; lx.fillText("g", 206, 62);
      lx.font = "bold 16px monospace"; if (stable) lx.fillText("● STABLE", 10, 14); if (tare) lx.fillText("ZERO", 190, 14);
      lcdTex.needsUpdate = true;
    }
    drawLCD("0.00", true, true);
    return { group: g, pan: pan, lcd: scr, drawLCD: drawLCD, panPos: new V3(0, 0.256, -0.12) };
  }

  function makeStrip(i) {
    var geo = new THREE.CylinderGeometry(STRIP_R, STRIP_R, STRIP_L, 16, 18, false);
    var base = new Float32Array(geo.attributes.position.array);
    var sideMat = std(0xf1e3b0, 0.6, { map: potatoFleshTex(), bumpMap: potatoFleshTex(), bumpScale: 0.3 });
    var capMat = std(0xf6ecc8, 0.7);
    var mesh = new THREE.Mesh(geo, [sideMat, capMat, capMat]);
    var film = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: 0xcfe9ff, roughness: 0.05, transparent: true, opacity: 0.34, depthWrite: false }));
    film.scale.set(1.2, 1.01, 1.2); film.visible = false;
    var g = new THREE.Group(); g.add(mesh); g.add(film);
    g.userData.set = function (sr, sl, bend) {
      var pos = geo.attributes.position, h = STRIP_L / 2;
      for (var k = 0; k < pos.count; k++) {
        var x0 = base[k * 3], y0 = base[k * 3 + 1], z0 = base[k * 3 + 2], u = y0 / h;
        pos.setXYZ(k, x0 * sr + bend * STRIP_L * 0.26 * (u * u - 0.33), y0 * sl, z0 * sr);
      }
      pos.needsUpdate = true; geo.computeVertexNormals();
    };
    g.userData.sideMat = sideMat; g.userData.film = film; g.userData.mesh = mesh;
    return g;
  }

  /* ---------------- the kit ---------------- */
  function create(opts) {
    opts = opts || {};
    var concs = (opts.concs || KNOT_C).slice(0, 6);
    var masses = (opts.initialMasses || [2.50, 2.48, 2.52, 2.50, 2.46, 2.54]).slice(0, 6);
    var N = Math.min(concs.length, masses.length);
    var S = {
      minutes: opts.minutes == null ? 30 : opts.minutes,
      speed: opts.speed || 1,
      errors: { unblotted: false, overBlotted: false, evaporation: false },
      sel: 0, elapsed: 0, soakT: -1, soakDur: 3.2, soaked: false, text: "0.00", queue: [], onEvent: opts.onEvent || null
    };
    if (opts.errors) for (var ek in opts.errors) S.errors[ek] = !!opts.errors[ek];

    var g = new THREE.Group(), parts = {}, i;

    // bench top
    var bench = new THREE.Mesh(new THREE.BoxGeometry(9, 0.1, 6), std(0xffffff, 0.8, { map: benchTex() }));
    bench.position.set(0, -0.05, 1.6); g.add(bench); parts.bench = tagPart(bench, "bench");

    var rackB = buildRack(parts); g.add(rackB.group);
    var borer = buildBorer(); borer.position.set(-1.0, 0, 1.15); g.add(borer); parts.borer = tagPart(borer, "borer");
    var potato = buildPotato(); potato.position.set(-1.38, 0, 0.35); potato.rotation.y = 0.6; g.add(potato); parts.potato = tagPart(potato, "potato");
    var tile = buildTile(); tile.position.set(0.28, 0, 0.82); g.add(tile); parts.tile = tagPart(tile, "tile");
    var blot = buildBlotter(); blot.group.position.set(-0.45, 0, 0.82); g.add(blot.group); parts.blotter = tagPart(blot.group, "blotter");
    var bal = buildBalance(); bal.group.position.set(1.1, 0, 0.7); g.add(bal.group);
    parts.balance = tagPart(bal.group, "balance"); parts.pan = tagPart(bal.pan, "pan", "balance"); parts.lcd = tagPart(bal.lcd, "lcd", "balance");

    // tubes, liquids, labels, strips, water-flow particles
    var glassMat = new THREE.MeshStandardMaterial({ color: 0xdff1f7, roughness: 0.08, metalness: 0.0, transparent: true, opacity: 0.24, depthWrite: false, side: THREE.DoubleSide });
    var tubeGeo = tubeGeometry(), levelNorm = FLOOR + 0.62;
    var liqMat = new THREE.MeshStandardMaterial({ color: 0xa9d6ee, roughness: 0.1, transparent: true, opacity: 0.42, depthWrite: false });
    var tubes = [], tubeGroup = new THREE.Group(), stripGroup = new THREE.Group(), flowGroup = new THREE.Group();
    var ringMat = new THREE.MeshBasicMaterial({ color: 0xffc84a, transparent: true, opacity: 0.9, side: THREE.DoubleSide });
    var ring = new THREE.Mesh(new THREE.RingGeometry(TUBE_R + 0.012, TUBE_R + 0.03, 32), ringMat);
    ring.rotation.x = -Math.PI / 2; g.add(ring);

    for (i = 0; i < N; i++) {
      var xi = (i - (N - 1) / 2) * 0.4, T = {
        i: i, c: concs[i], m0: masses[i], x: xi, weighed: false, inTube: false, done: false, m1: null, firm: "", pNow: 0, strip: null, slotX: 0
      };
      var tg = new THREE.Group(); tg.position.set(xi, FLOOR, TUBE_Z);
      var tm = new THREE.Mesh(tubeGeo, glassMat); tg.add(tm);
      var liq = new THREE.Mesh(liquidGeometry(0.62), liqMat); tg.add(liq);
      T.liq = liq;
      var lab = new THREE.Mesh(new THREE.CylinderGeometry(TUBE_R + 0.003, TUBE_R + 0.003, 0.2, 24, 1, true, -0.85, 1.7), new THREE.MeshBasicMaterial({ map: labelTex(String(concs[i].toFixed(1)), 215 - (concs[i] / 1) * 215), side: THREE.DoubleSide }));
      lab.position.y = 1.07 - FLOOR; tg.add(lab);
      tubeGroup.add(tagPart(tg, "tube" + i, "tube"));
      T.tubeG = tg;
      parts["tube" + i] = tg;
      var st = makeStrip(i); T.strip = st;
      st.position.set(xi - 0.25 + 0 * i, 0.18, 0.82); // placeholder, set by slot below
      T.slotX = tile.position.x + (i - (N - 1) / 2) * 0.1;
      st.userData.set(1, 1, 0);
      stripGroup.add(tagPart(st, "strip" + i, "strip"));
      parts["strip" + i] = st;
      // water particles
      var pg = new THREE.BufferGeometry(), pp = new Float32Array(14 * 3); pg.setAttribute("position", new THREE.BufferAttribute(pp, 3));
      var pts = new THREE.Points(pg, new THREE.PointsMaterial({ color: 0x2b86e0, size: 0.03, transparent: true, opacity: 0.0, depthWrite: false }));
      pts.userData.ph = []; for (var q = 0; q < 14; q++) pts.userData.ph.push({ a: Math.random() * TAU, t: Math.random(), y: Math.random() });
      pts.frustumCulled = false;
      flowGroup.add(pts); T.flow = pts;
      tubes.push(T);
    }
    g.add(tubeGroup); g.add(stripGroup); g.add(flowGroup);
    parts.tube = tubeGroup; parts.strip = stripGroup;
    tagPart(tubeGroup, "tube"); tagPart(stripGroup, "strip");

    /* ---------- motion of strips ---------- */
    var stripR = STRIP_R;
    function slotPos(T) { return { p: new V3(T.slotX, 0.025 + stripR * 1.02 + 0.006, 0.82), rx: Math.PI / 2, rz: 0 }; }
    function blotPos(T) { return { p: new V3(-0.45, 0.026 + stripR, 0.82), rx: Math.PI / 2, rz: 0 }; }
    function panPos(T) { return { p: new V3(bal.group.position.x, 0.256 + stripR * 1.05 + 0.006, bal.group.position.z - 0.12), rx: 0, rz: Math.PI / 2 }; }
    function tubePos(T) { return { p: new V3(T.x - 0.012, FLOOR + 0.02 + STRIP_L / 2 * 0.99, TUBE_Z + 0.006), rx: 0, rz: 0.06 }; }
    function lifted(T) { return { p: new V3(T.x, 1.8, TUBE_Z + 0.02), rx: 0, rz: 0 }; }

    function placeNow(T, d) { T.strip.position.copy(d.p); T.strip.rotation.set(d.rx, 0, d.rz); T.cur = d; }
    for (i = 0; i < N; i++) { placeNow(tubes[i], slotPos(tubes[i])); }

    function addMove(T, dest, dur, hold, lift, cb) { T.mq = T.mq || []; T.mq.push({ d: dest, dur: dur, hold: hold || 0, lift: lift || 0, cb: cb, start: null, t: 0 }); }
    function stepMoves(T, dt) {
      if (!T.mq || !T.mq.length) return false;
      var m = T.mq[0];
      if (!m.start) m.start = { p: T.strip.position.clone(), rx: T.strip.rotation.x, rz: T.strip.rotation.z };
      m.t += dt * S.speed;
      var u = Math.min(1, m.t / m.dur), e = u * u * (3 - 2 * u);
      T.strip.position.lerpVectors(m.start.p, m.d.p, e);
      T.strip.position.y += m.lift * Math.sin(Math.PI * e);
      T.strip.rotation.x = m.start.rx + (m.d.rx - m.start.rx) * e;
      T.strip.rotation.z = m.start.rz + (m.d.rz - m.start.rz) * e;
      if (u >= 1 && m.t >= m.dur + m.hold) {
        T.mq.shift(); T.cur = m.d;
        if (m.cb) m.cb();
      }
      return true;
    }

    /* ---------- state helpers ---------- */
    function emit(name, detail) { if (S.onEvent) { try { S.onEvent(name, detail); } catch (e) {} } }
    function setLCD(text, stable) { S.text = text; bal.drawLCD(text, stable !== false, text === "0.00"); }
    function sorted() { return tubes.filter(function (T) { return T.weighed; }); }
    function elapsedPhi() { return phi(S.elapsed); }
    function ceffOf(T) { return T.c * (S.errors.evaporation ? 1 + ERR.CONC_UP : 1); }
    function strainOf(T) { return (T.inTube || T.done) ? pct(ceffOf(T)) * elapsedPhi() : 0; }
    function busyNow() { for (var b = 0; b < N; b++) if (tubes[b].mq && tubes[b].mq.length) return true; return false; }
    function select(i) { if (i < 0 || i >= N) return false; S.sel = i; emit("select", { i: i, conc: tubes[i].c }); return true; }

    function weigh(i) {
      i = i == null ? S.sel : i; var T = tubes[i];
      if (!T || busyNow() || T.weighed || T.inTube || T.done) return false;
      S.sel = i; setLCD("0.00");
      addMove(T, blotPos(T), 0.7, 0.25, 0.14, function () { blot.stain(0.8); });
      addMove(T, panPos(T), 0.7, 0.2, 0.16, function () { setLCD(T.m0.toFixed(2)); });
      addMove(T, slotPos(T), 0.7, 0.35, 0.12, function () { T.weighed = true; setLCD("0.00"); emit("weighed", { i: i, phase: "initial", conc: T.c, mass_g: T.m0 }); });
      return true;
    }
    function leave(minutes) {
      if (busyNow() || S.soakT >= 0 || S.pendingSoak) return false;
      var w = sorted().filter(function (T) { return !T.inTube && !T.done; });
      if (!w.length) return false;
      if (minutes != null) S.minutes = minutes;
      w.forEach(function (T, k) {
        addMove(T, { p: new V3(T.x, 1.75, TUBE_Z + 0.02), rx: 0, rz: 0.06 }, 0.75 + k * 0.12, 0, 0.1, null);
        addMove(T, tubePos(T), 0.7, 0.05, 0, function () { T.inTube = true; });
      });
      S.pendingSoak = true;
      return true;
    }
    function reweigh(i) {
      i = i == null ? S.sel : i; var T = tubes[i];
      if (!T || busyNow() || !T.inTube || !S.soaked || T.done) return false;
      S.sel = i;
      var er = S.errors;
      var msg = finalMass(T.m0, T.c, S.elapsed, er);
      addMove(T, lifted(T), 0.7, 0.1, 0, function () { T.inTube = false; });
      if (!er.unblotted) addMove(T, blotPos(T), 0.7, er.overBlotted ? 0.9 : 0.3, 0.12, function () { blot.stain(er.overBlotted ? 1.4 : 0.9); T.strip.userData.film.visible = false; if (er.overBlotted) T.squash = 0.93; });
      else T.strip.userData.film.visible = true;
      if (er.evaporation) addMove(T, slotPos(T), 0.7, 1.4, 0.12, null);
      addMove(T, panPos(T), 0.7, 0.2, 0.16, function () { setLCD(msg.toFixed(2)); });
      addMove(T, slotPos(T), 0.7, 0.35, 0.12, function () {
        T.m1 = msg; T.done = true; T.firm = firmness(pct(ceffOf(T)));
        setLCD("0.00");
        var row = rowOf(T); emit("reweighed", row);
        if (tubes.every(function (X) { return X.done || !X.weighed; }) && tubes.some(function (X) { return X.done; })) emit("done", reading());
      });
      return true;
    }
    function rowOf(T) {
      var ch = T.m1 == null ? null : round2(T.m1 - T.m0), pc = T.m1 == null ? null : round1((T.m1 - T.m0) / T.m0 * 100);
      return { i: T.i, conc: T.c, m0: T.m0, m1: T.m1, change_g: ch, pct: pc, weighed: T.weighed, done: T.done, inTube: T.inTube,
               firmness: T.done ? T.firm : (T.inTube ? firmness(strainOf(T)) : ""), state: T.done ? "done" : T.inTube ? (S.soaked ? "soaked" : "soaking") : T.weighed ? "weighed" : "ready" };
    }
    function reading() {
      var rows = tubes.map(rowOf), pcs = [], cs = [];
      rows.forEach(function (r) { if (r.pct != null) { pcs.push(r.pct); cs.push(r.conc); } });
      var iso = null;
      for (var k = 0; k + 1 < cs.length; k++) if (pcs[k] > 0 && pcs[k + 1] <= 0) { iso = cs[k] + (cs[k + 1] - cs[k]) * pcs[k] / (pcs[k] - pcs[k + 1]); break; }
      return {
        rows: rows, selected: S.sel, minutes: S.minutes, elapsed_min: Math.round(S.elapsed * 10) / 10, soaked: S.soaked, soaking: S.soakT >= 0 && !S.soaked,
        balance_g: S.text, busy: busyNow() || (S.soakT >= 0 && !S.soaked), nWeighed: tubes.filter(function (T) { return T.weighed || T.inTube || T.done; }).length,
        nDone: tubes.filter(function (T) { return T.done; }).length, n: N, allDone: tubes.every(function (T) { return T.done; }),
        isotonic_est: iso == null ? null : Math.round(iso * 100) / 100, isotonic_model: Math.round(isotonic() * 100) / 100,
        errors: { unblotted: S.errors.unblotted, overBlotted: S.errors.overBlotted, evaporation: S.errors.evaporation },
        error_effects: { unblotted_g: ERR.FILM_G, overBlotted_g: ERR.SQUEEZE_G, evaporation_g: ERR.TILE_G, evaporation_conc: ERR.CONC_UP }
      };
    }
    function reset() {
      S.queue.length = 0; S.elapsed = 0; S.soakT = -1; S.soaked = false; S.pendingSoak = false;
      tubes.forEach(function (T) { T.mq = []; T.weighed = T.inTube = T.done = false; T.m1 = null; T.squash = 1; T.strip.userData.film.visible = false; placeNow(T, slotPos(T)); });
      blot.clear(); setLCD("0.00"); rackB.drawPlaque(0); emit("reset", {});
    }
    function runAll() {
      reset(); S.queue = [];
      for (var k = 0; k < N; k++) (function (k) { S.queue.push(function () { return weigh(k); }); })(k);
      S.queue.push(function () { return leave(S.minutes); });
      S.queue.push(function () { return S.soaked ? true : null; });
      for (var j = 0; j < N; j++) (function (j) { S.queue.push(function () { return reweigh(j); }); })(j);
    }

    /* ---------- update ---------- */
    var lastPlaque = -1, clock = 0;
    function update(dt, t) {
      dt = Math.min(dt || 0.016, 0.05); clock += dt;
      var k, T;
      for (k = 0; k < N; k++) stepMoves(tubes[k], dt);
      if (S.pendingSoak && !busyNow()) { S.pendingSoak = false; S.soakT = 0; S.elapsed = 0; S.soaked = false; emit("soak-start", { minutes: S.minutes }); }
      if (S.soakT >= 0 && !S.soaked) {
        S.soakT += dt * S.speed;
        var u = Math.min(1, S.soakT / S.soakDur);
        S.elapsed = S.minutes * (u * u * (3 - 2 * u));
        if (u >= 1) { S.soaked = true; S.elapsed = S.minutes; emit("soaked", { minutes: S.minutes }); }
      }
      if (S.queue.length && !busyNow() && !S.pendingSoak) {
        var r = S.queue[0]();
        if (r !== null) S.queue.shift();
      }
      // strips: size, firmness, bend from the model
      for (k = 0; k < N; k++) {
        T = tubes[k];
        var p = strainOf(T);
        var lin = 1 + VIS_GAIN * (Math.pow(Math.max(0.2, 1 + p / 100), 1 / 3) - 1);
        var bend = Math.max(0, Math.min(1.25, -p / 16.5)) * (T.squash ? 1 : 1);
        var sq = T.squash || 1;
        if (T.lastP !== p || T.lastSq !== sq) { T.strip.userData.set(lin * sq, lin, bend); T.lastP = p; T.lastSq = sq; }
        var tint = Math.max(0, Math.min(1, -p / 16.5));
        T.strip.userData.sideMat.color.setRGB(0.945 - tint * 0.1, 0.89 - tint * 0.1, 0.69 - tint * 0.12);
        T.pNow = p;
        // water particles drift into (gain) or out of (loss) the strip while soaking
        var fl = T.flow, act = T.inTube && !T.done && S.soakT >= 0 && !S.soaked, arr = fl.geometry.attributes.position.array, dir = p >= 0 ? 1 : -1;
        fl.material.opacity += ((act ? 0.9 : 0) - fl.material.opacity) * Math.min(1, dt * 5);
        if (fl.material.opacity > 0.02) {
          for (var q = 0; q < 14; q++) {
            var f = fl.userData.ph[q]; f.t = (f.t + dt * 0.5 * S.speed * (0.4 + Math.min(1.5, Math.abs(p) / 8))) % 1;
            var rad = dir > 0 ? 0.105 - f.t * 0.06 : 0.045 + f.t * 0.06;
            arr[q * 3] = T.x + Math.cos(f.a) * rad; arr[q * 3 + 1] = FLOOR + 0.06 + f.y * 0.32; arr[q * 3 + 2] = TUBE_Z + Math.sin(f.a) * rad;
          }
          fl.geometry.attributes.position.needsUpdate = true;
        }
        // liquid level (evaporation lowers it)
        var lv = S.errors.evaporation ? 0.96 : 1; if (T.lastLv !== lv) { T.liq.scale.y = lv; T.lastLv = lv; }
      }
      // selection ring on the top shelf
      var Ts = tubes[S.sel]; ring.position.set(Ts.x, 0.99 + 0.02 * Math.sin(clock * 4), TUBE_Z); ringMat.opacity = 0.65 + 0.3 * Math.sin(clock * 4);
      if (Math.abs(lastPlaque - S.elapsed) > 0.05) { rackB.drawPlaque(S.elapsed); lastPlaque = S.elapsed; }
    }

    function viewFor(name) {
      var tgt = { rack: [0, 0.8, TUBE_Z], tubes: [0, 0.8, TUBE_Z], tube: [0, 0.8, TUBE_Z], balance: [1.1, 0.25, 0.65], tile: [0.28, 0.05, 0.82], blotter: [-0.45, 0.05, 0.82],
        borer: [-1.0, 0.05, 0.9], potato: [-1.38, 0.1, 0.35], strip: [0, 0.3, 0.3], all: [0, 0.7, 0.35] };
      var dist = { rack: 4.3, tubes: 4.3, tube: 4.3, balance: 1.9, tile: 1.9, blotter: 1.8, borer: 1.8, potato: 1.5, strip: 3.2, all: 5.4 };
      var key = tgt[name] ? name : "all";
      if (name && name.indexOf("tube") === 0 && name.length > 4) { var ti = +name.slice(4); return { target: [tubes[ti].x, 0.45, TUBE_Z], dist: 2.2 }; }
      if (name && name.indexOf("strip") === 0 && name.length > 5) { var si = +name.slice(5); return { target: [tubes[si].x, 0.3, TUBE_Z], dist: 1.6 }; }
      return { target: tgt[key], dist: dist[key] };
    }
    function pickPart(raycaster) {
      var hits = raycaster.intersectObjects(g.children, true);
      for (var k = 0; k < hits.length; k++) { var o = hits[k].object; if (o.userData && o.userData.partId && hits[k].object.type !== "Points" && o !== bench) return o.userData.partId; }
      return null;
    }
    function setState(o) {
      o = o || {};
      if (o.errors) for (var key in o.errors) S.errors[key] = !!o.errors[key];
      if (o.minutes != null) S.minutes = o.minutes;
      if (o.speed != null) S.speed = o.speed;
      if (o.selected != null) select(o.selected);
      if (o.onEvent) S.onEvent = o.onEvent;
      if (o.reset) reset();
    }

    parts.rackPlaque = rackB.drawPlaque;
    delete parts.rackPlaque;
    g.userData.parts = parts; g.userData.update = update; g.userData.setState = setState;
    g.group = g; g.parts = parts; g.tick = update; g.update = update; g.setState = setState;
    g.reading = reading; g.select = select; g.weigh = weigh; g.leave = leave; g.reweigh = reweigh; g.reset = reset; g.runAll = runAll;
    g.viewFor = viewFor; g.pickPart = pickPart;
    reset();
    return g;
  }

  /* pulsing emissive highlight on named parts (partId or partGroup) */
  function makeHighlighter(scene) {
    var saved = [];
    function clear() { saved.forEach(function (s) { s.mesh.material = s.orig; }); saved.length = 0; }
    function highlight(name, colorHex) {
      clear(); if (!name || !scene) return;
      var col = new THREE.Color(colorHex != null ? colorHex : 0xffd166);
      scene.traverse(function (o) {
        if (o.isMesh && o.userData && (o.userData.partId === name || o.userData.partGroup === name) && o.material && !Array.isArray(o.material) && o.material.emissive) {
          var c = o.material.clone(); saved.push({ mesh: o, orig: o.material }); c.emissive.copy(col); c.emissiveIntensity = 0.55; o.material = c;
        }
      });
    }
    return { highlight: highlight, clear: clear };
  }

  window.OsmometerKit = {
    create: create, makeHighlighter: makeHighlighter, version: 1,
    model: { pct: pct, isotonic: isotonic, phi: phi, finalMass: finalMass, firmness: firmness, knots: { c: KNOT_C.slice(), p: KNOT_P.slice() }, errors: ERR, T_REF: T_REF }
  };
})();
