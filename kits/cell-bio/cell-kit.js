/* =========================================================
   StudyPipe · CellKit v2 — parametric 3D cell-biology builders (HeartKit v2 fidelity for cells, scope, mitochondrion)
   Classic script (no modules), fully offline, needs window.THREE + window.SceneKit.

   Every builder returns a THREE.Group with:
     g.userData.parts  -> { name: Object3D }  (for narrator rect()/highlight())
     g.userData.update(dt, t)                 (optional per-frame animation)
     g.userData.setState(obj)                 (optional live state, e.g. { tonicity: -1..1 })

   Builders:
     CellKit.plantCell(o)     turgid/flaccid/plasmolysed palisade or onion cell
     CellKit.animalCell(o)    cheek / liver cell (swell → haemolysis, shrink → crenation)
     CellKit.rbc(o)           biconcave red blood cell (haemolysis / crenation)
     CellKit.bacterium(o)     prokaryote: nucleoid, plasmids, 70S ribosomes, wall, capsule, flagellum
     CellKit.microscope(o)    compound light microscope: C-arm, horseshoe foot, engraved objectives, aperture stage, iris, plane/concave mirror (o.mirror) or lamp
     CellKit.protist(type,o)  amoeba | paramecium | euglena | chlamydomonas | volvox | spirogyra | hydra
     CellKit.cube(L,o)        SA/V scaling cube with live label
     CellKit.slide(o)         glass slide + drop + coverslip (angle) + air bubbles
     CellKit.mitochondrion(o) cut-away: outer membrane, cristae, matrix
     CellKit.chloroplast(o)   cut-away: envelope, grana stacks, stroma, starch grain
     CellKit.bilayer(o)       phospholipid bilayer patch + protein channels (aquaporin, ATP pump)
     CellKit.label(text,o)    crisp sprite label pill
     CellKit.glowOn(stage, parts, name) helper for highlight rings
   ========================================================= */
(function () {
  "use strict";
  if (typeof THREE === "undefined") return;

  var TAU = Math.PI * 2;

  function std(color, rough, extra) {
    var m = new THREE.MeshStandardMaterial({ color: color, roughness: rough == null ? 0.45 : rough, metalness: 0.02 });
    if (extra) for (var k in extra) { if (m[k] && m[k].isColor) m[k].set(extra[k]); else m[k] = extra[k]; }
    return m;
  }
  function glass(color, opacity) {
    return new THREE.MeshStandardMaterial({ color: color, roughness: 0.18, metalness: 0, transparent: true, opacity: opacity == null ? 0.25 : opacity, depthWrite: false, side: THREE.DoubleSide });
  }
  function glowMat(color, intensity) {
    return new THREE.MeshStandardMaterial({ color: color, emissive: color, emissiveIntensity: intensity == null ? 0.45 : intensity, roughness: 0.35 });
  }

  function label(text, o) {
    o = o || {};
    var tex = window.SceneKit ? SceneKit.labelTexture(text, { size: o.size || 34, bg: o.bg || "rgba(10,15,29,0.88)", color: o.color || "#ffffff" }) : null;
    if (!tex) return new THREE.Group();
    var s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, depthTest: o.depthTest === true }));
    var h = o.h || 0.16;
    s.scale.set(h * tex.userData.aspect, h, 1);
    s.renderOrder = 10;
    s.userData.isLabel = true;
    return s;
  }
  function setLabelText(sprite, text, o) {
    if (!sprite || !sprite.material || !window.SceneKit) return;
    o = o || {};
    var tex = SceneKit.labelTexture(text, { size: o.size || 34, bg: o.bg || "rgba(10,15,29,0.88)", color: o.color || "#ffffff" });
    if (sprite.material.map) sprite.material.map.dispose();
    sprite.material.map = tex; sprite.material.needsUpdate = true;
    var h = o.h || sprite.scale.y;
    sprite.scale.set(h * tex.userData.aspect, h, 1);
  }

  function rnd(seed) { var s = seed || 1; return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }

  /* ---------- v2 helpers ---------- */
  function canvasTex(w, h, draw, srgb) {
    var c = document.createElement("canvas"); c.width = w; c.height = h;
    draw(c.getContext("2d"), w, h);
    var t = new THREE.CanvasTexture(c);
    if (srgb !== false && THREE.SRGBColorSpace && "colorSpace" in t) t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 2;
    return t;
  }
  function rrPath(P, w, h, r) {
    var x = -w / 2, y = -h / 2;
    r = Math.min(r, w / 2 - 1e-3, h / 2 - 1e-3);
    P.moveTo(x + r, y); P.lineTo(x + w - r, y); P.quadraticCurveTo(x + w, y, x + w, y + r);
    P.lineTo(x + w, y + h - r); P.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    P.lineTo(x + r, y + h); P.quadraticCurveTo(x, y + h, x, y + h - r);
    P.lineTo(x, y + r); P.quadraticCurveTo(x, y, x + r, y);
    return P;
  }
  function rrShape(w, h, r) { return rrPath(new THREE.Shape(), w, h, r); }
  function fibrilTex() {
    var t = canvasTex(128, 128, function (c, w, h) {
      c.fillStyle = "#808080"; c.fillRect(0, 0, w, h);
      var R = rnd(5); c.strokeStyle = "rgba(255,255,255,0.4)"; c.lineWidth = 1.3;
      for (var i = 0; i < 90; i++) {
        var x = R() * w, y = R() * h, a = R() * 0.5 + (i % 2 ? 0.8 : -0.35), l = 18 + R() * 26;
        c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); c.stroke();
      }
    }, false);
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(1.3, 1.3);
    return t;
  }
  function knurlTex() {
    var t = canvasTex(256, 32, function (c, w, h) {
      c.fillStyle = "#777"; c.fillRect(0, 0, w, h);
      for (var i = 0; i < 48; i++) { c.fillStyle = i % 2 ? "#fff" : "#222"; c.fillRect(i * w / 48, 0, w / 96, h); }
    }, false);
    t.wrapS = THREE.RepeatWrapping;
    return t;
  }
  function bandTex(text, sub, bg, fg) {
    return canvasTex(256, 64, function (c, w, h) {
      c.fillStyle = bg; c.fillRect(0, 0, w, h);
      c.fillStyle = fg; c.textAlign = "center"; c.textBaseline = "middle";
      c.font = "bold 34px sans-serif"; c.fillText(text, w * 0.25, h * 0.52);
      c.fillText(text, w * 0.75, h * 0.52);
      if (sub) { c.font = "bold 14px sans-serif"; c.fillText(sub, w * 0.5, h * 0.86); }
    });
  }

  /* ---------- small organelle meshes (v2) ---------- */
  // Mitochondrion: outer membrane + inner membrane (lathe, optionally cut away) + cristae folds (extruded plates)
  var _mitoCache = {};
  function mitoGeo(cut, seg) {
    var key = (cut ? 1 : 0) + ":" + seg;
    if (_mitoCache[key]) return _mitoCache[key];
    var N = 26, pOut = [], pIn = [], i;
    function prof(Hh, Rr) {
      var pts = [];
      for (i = 0; i <= N; i++) {
        var y = Math.sin((i / N - 0.5) * Math.PI);
        pts.push(new THREE.Vector2(Math.max(0.002, Rr * Math.pow(Math.max(0, 1 - Math.pow(Math.abs(y), 3)), 1 / 3)), y * Hh));
      }
      return pts;
    }
    var H = 1.2, R = 0.5, Hi = 1.08, Ri = 0.4;
    pOut = prof(H, R); pIn = prof(Hi, Ri);
    var ch = cut ? 0.95 : 0;
    var set = {
      outer: new THREE.LatheGeometry(pOut, seg, ch, Math.PI * 2 - 2 * ch),
      inner: new THREE.LatheGeometry(pIn, seg, ch, Math.PI * 2 - 2 * ch),
      Hi: Hi, Ri: Ri, crista: []
    };
    // crista plate: wall arc on one side + wavy inner edge, extruded thin (shape y -> world -z after rotateX)
    [1, -1].forEach(function (side) {
      var s = new THREE.Shape(), a0 = -0.45, a1 = 1.2, k, a, steps = 28;
      function P(rad, ang) { var cx = Math.cos(ang) * rad, cy = Math.sin(ang) * rad; return side > 0 ? [cx, cy] : [-cx, cy]; }
      var p = P(Ri * 0.97, a0); s.moveTo(p[0], p[1]);
      for (k = 1; k <= steps; k++) { a = a0 + (a1 - a0) * k / steps; p = P(Ri * 0.97, a); s.lineTo(p[0], p[1]); }
      for (k = steps; k >= 0; k--) { a = a0 + (a1 - a0) * k / steps; p = P(Ri * (0.38 + 0.07 * Math.sin(8 * a + 1)), a); s.lineTo(p[0], p[1]); }
      var g = new THREE.ExtrudeGeometry(s, { depth: 0.045, bevelEnabled: false, curveSegments: 4 });
      g.translate(0, 0, -0.0225);
      g.rotateX(-Math.PI / 2);
      set.crista.push(g);
    });
    _mitoCache[key] = set;
    return set;
  }
  function mitoBuild(o) {
    var set = mitoGeo(o.cut, o.seg || 28);
    var g = new THREE.Group(), body = new THREE.Group(), i;
    var outerMat = glass(o.color || 0xff6b4a, o.cut ? 0.2 : 0.26);
    var innerMat = glass(0xfca5a5, o.cut ? 0.34 : 0.3);
    var outer = new THREE.Mesh(set.outer, outerMat);
    var inner = new THREE.Mesh(set.inner, innerMat);
    var cr = new THREE.Group(), cm = std(0xf97316, 0.5, { emissive: 0xf97316, emissiveIntensity: 0.3 });
    var n = o.n || 8;
    for (i = 0; i < n; i++) {
      var y = -0.86 + 1.72 * i / (n - 1);
      var k = Math.pow(Math.max(0.05, 1 - Math.pow(Math.abs(y / set.Hi), 3)), 1 / 3);
      var m = new THREE.Mesh(set.crista[i % 2], cm);
      m.position.y = y; m.scale.set(k, 1, k);
      cr.add(m);
    }
    body.add(outer, inner, cr);
    body.rotation.z = -Math.PI / 2;      // lathe axis y -> world x
    g.add(body);
    g.userData.parts = { outer: outer, inner: inner, cristae: cr };
    g.userData.body = body;
    return g;
  }
  function mitochondrionMesh(len, color) {
    var g = mitoBuild({ cut: false, seg: 14, n: 5, color: color });
    g.scale.setScalar(len * 0.525);
    return g;
  }

  // Chloroplast: double-membrane lens, grana stacks of thylakoid discs (instanced), stroma lamellae, starch grain
  var _chl = null;
  function chloroplastMesh(size) {
    if (!_chl) {
      var disc = new THREE.CylinderGeometry(1, 1, 1, 14);
      var lam = new THREE.CylinderGeometry(1, 1, 1, 6); lam.rotateZ(Math.PI / 2);
      _chl = {
        shell: new THREE.SphereGeometry(1, 18, 12), disc: disc, lam: lam,
        outer: glass(0x4ade80, 0.2), innerM: glass(0xa7f3b0, 0.22),
        thy: glowMat(0x14532d, 0.28), lamM: glowMat(0x22c55e, 0.3), starch: std(0xfef9c3, 0.6)
      };
    }
    var g = new THREE.Group(), d = new THREE.Object3D(), i, j;
    var o1 = new THREE.Mesh(_chl.shell, _chl.outer); o1.scale.set(1.5, 0.62, 1.0);
    var o2 = new THREE.Mesh(_chl.shell, _chl.innerM); o2.scale.set(1.4, 0.55, 0.92);
    var xs = [-0.62, 0, 0.62], zs = [0.1, -0.12, 0.08], nd = 5;
    var gr = new THREE.InstancedMesh(_chl.disc, _chl.thy, xs.length * nd);
    for (i = 0; i < xs.length; i++) for (j = 0; j < nd; j++) {
      d.position.set(xs[i], (j - (nd - 1) / 2) * 0.1, zs[i]);
      d.scale.set(0.22, 0.066, 0.22); d.updateMatrix(); gr.setMatrixAt(i * nd + j, d.matrix);
    }
    var la = new THREE.InstancedMesh(_chl.lam, _chl.lamM, 4);
    var lp = [[-0.31, 0.02, 0.1, 0.4], [0.31, -0.03, -0.02, 0.4], [-0.31, -0.06, -0.01, 0.4], [0.31, 0.05, 0.0, 0.4]];
    for (i = 0; i < 4; i++) { d.position.set(lp[i][0], lp[i][1], lp[i][2]); d.scale.set(0.46, 0.022, 0.022); d.updateMatrix(); la.setMatrixAt(i, d.matrix); }
    gr.frustumCulled = false; la.frustumCulled = false;
    var st = new THREE.Mesh(_chl.shell, _chl.starch); st.scale.set(0.16, 0.1, 0.12); st.position.set(0.95, -0.12, 0.35);
    g.add(o1, o2, gr, la, st);
    g.scale.setScalar(size);
    g.userData.parts = { envelope: o1, grana: gr, lamellae: la, starch: st };
    return g;
  }

  // Golgi: stack of curved extruded cisternae (cis -> trans) with budding vesicles
  var _golgiMat = null;
  function golgiMesh(r) {
    var g = new THREE.Group(), n = 5, i;
    var m = _golgiMat || (_golgiMat = glowMat(0xffc94a, 0.3));
    var Ro = r * 1.15, t = r * 0.1, gap = r * 0.2, cy = -r * 0.62;
    for (i = 0; i < n; i++) {
      var A = 2.05 - i * 0.14, a0 = Math.PI / 2 - A / 2, a1 = Math.PI / 2 + A / 2;
      var s = new THREE.Shape();
      s.absarc(0, cy, Ro, a0, a1, false);
      s.absarc(0, cy, Ro - t * (1 + 0.15 * i), a1, a0, true);
      var geo = new THREE.ExtrudeGeometry(s, { depth: r * 0.8, bevelEnabled: true, bevelThickness: t * 0.3, bevelSize: t * 0.3, bevelSegments: 2, curveSegments: 14 });
      geo.translate(0, 0, -r * 0.4);
      var mesh = new THREE.Mesh(geo, m);
      mesh.position.y = i * gap - (n - 1) * gap / 2;
      g.add(mesh);
    }
    var vg = new THREE.SphereGeometry(r * 0.075, 8, 6);
    [[1, 0.92, 0], [0.88, 0.2, 0.15], [-0.95, -0.95, 0.1], [1.06, -0.3, -0.2], [-0.78, 0.4, -0.1]].forEach(function (p) {
      var v = new THREE.Mesh(vg, m); v.position.set(p[0] * r * 0.95, p[1] * r * 0.5, p[2] * r); g.add(v);
    });
    return g;
  }

  // Endoplasmic reticulum: folded cisternal sheets wrapped round the nucleus (+ ribosomes on rough faces)
  function erSheet(r, h, a0, da, amp, phase, rough, mat) {
    var geo = new THREE.PlaneGeometry(1, 1, 24, 7), p = geo.attributes.position, i;
    var rib = [];
    for (i = 0; i < p.count; i++) {
      var u = p.getX(i) + 0.5, v = p.getY(i) + 0.5, th = a0 + u * da;
      var rad = r * (1 + amp * Math.sin(u * Math.PI * 6 + phase) * (0.55 + 0.45 * Math.sin(v * Math.PI * 2 + phase * 1.7)));
      var yy = (v - 0.5) * h + 0.1 * h * Math.sin(u * 9 + phase);
      p.setXYZ(i, Math.cos(th) * rad, yy, -Math.sin(th) * rad);
      if (rough && i % 2 === 0) { var rr = rad + r * 0.03; rib.push(Math.cos(th) * rr, yy, -Math.sin(th) * rr); }
    }
    geo.computeVertexNormals();
    var g = new THREE.Group();
    g.add(new THREE.Mesh(geo, mat));
    if (rough) {
      var pg = new THREE.BufferGeometry(); pg.setAttribute("position", new THREE.Float32BufferAttribute(rib, 3));
      g.add(new THREE.Points(pg, new THREE.PointsMaterial({ color: 0x1e3a8a, size: r * 0.1 })));
    }
    return g;
  }
  function erMesh(r, rough) {
    var g = new THREE.Group();
    var m = new THREE.MeshStandardMaterial({ color: 0x7cc4ff, emissive: 0x3b82f6, emissiveIntensity: 0.2, roughness: 0.5, transparent: true, opacity: 0.6, side: THREE.DoubleSide, depthWrite: false });
    for (var i = 0; i < 3; i++) g.add(erSheet(r * (1 + i * 0.2), r * 1.1, Math.PI * (0.5 + i * 0.07), Math.PI * (1.15 - i * 0.12), 0.09, i * 1.9, rough, m));
    if (!rough) {
      var R = rnd(4);
      for (var k = 0; k < 3; k++) {
        var pts = [];
        for (var q = 0; q < 6; q++) pts.push(new THREE.Vector3((R() - 0.5) * r * 2.2, (R() - 0.5) * r, (R() - 0.5) * r * 2.2));
        g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 24, r * 0.04, 5), m));
      }
    }
    return g;
  }
  function ribosomeCloud(n, sx, sy, sz, seed, color) {
    var pts = [], R = rnd(seed || 3);
    for (var i = 0; i < n; i++) pts.push((R() - 0.5) * sx, (R() - 0.5) * sy, (R() - 0.5) * sz);
    var geo = new THREE.BufferGeometry(); geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return new THREE.Points(geo, new THREE.PointsMaterial({ color: color || 0x334155, size: 0.025 }));
  }

  // Nucleus: double envelope with instanced nuclear pores, chromatin strands, nucleolus
  var _pore = null;
  function nucleusMesh(r) {
    var g = new THREE.Group(), i;
    var env = new THREE.Mesh(new THREE.SphereGeometry(r, 26, 18), glass(0x9b6bff, 0.4));
    var env2 = new THREE.Mesh(new THREE.SphereGeometry(r * 0.92, 22, 16), glass(0xc4b5fd, 0.28));
    g.add(env, env2);
    if (!_pore) _pore = { geo: new THREE.TorusGeometry(1, 0.3, 6, 10), mat: std(0x4c1d95, 0.5) };
    var np = r > 0.12 ? 46 : 16, pores = new THREE.InstancedMesh(_pore.geo, _pore.mat, np), d = new THREE.Object3D();
    for (i = 0; i < np; i++) {
      var y = 1 - (i + 0.5) * 2 / np, rad = Math.sqrt(1 - y * y), th = i * 2.399963;
      var nx = Math.cos(th) * rad, nz = Math.sin(th) * rad;
      d.position.set(nx * r * 0.96, y * r * 0.96, nz * r * 0.96);
      d.lookAt(nx * r * 2, y * r * 2, nz * r * 2);
      d.scale.setScalar(r * 0.06); d.updateMatrix(); pores.setMatrixAt(i, d.matrix);
    }
    pores.frustumCulled = false;
    g.add(pores);
    var R = rnd(13), cm = glowMat(0x6d28d9, 0.3);
    for (var k = 0; k < 3; k++) {
      var pts = [];
      for (i = 0; i < 6; i++) pts.push(new THREE.Vector3((R() - 0.5) * r * 1.0, (R() - 0.5) * r * 1.0, (R() - 0.5) * r * 1.0));
      g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 20, r * 0.022, 4), cm));
    }
    var nl = new THREE.Mesh(new THREE.SphereGeometry(r * 0.34, 16, 12), glowMat(0x5b21b6, 0.4));
    nl.position.set(r * 0.25, r * 0.1, r * 0.1);
    g.add(nl);
    g.userData.nucleolus = nl; g.userData.envelope = env; g.userData.pores = pores;
    return g;
  }

  /* ---------- PLANT CELL (v2) ---------- */
  function gammaFn(z) {   // Lanczos, for superellipsoid volume
    var g = 7, c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
    z -= 1; var x = c[0];
    for (var i = 1; i < g + 2; i++) x += c[i] / (z + i);
    var t = z + g + 0.5;
    return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
  }
  function superVol(n) { return 8 * Math.pow(gammaFn(1 + 1 / n), 3) / gammaFn(1 + 3 / n); }   // unit superellipsoid volume

  function plantCell(o) {
    o = o || {};
    var W = o.w || 2.4, H = o.h || 1.4, D = o.d || 1.2;
    var front = o.cutaway === false;                       // true plant cells are closed boxes; default shows the cut-away face
    var T = Math.min(W, H, D) * 0.085;                      // total wall thickness
    var t1 = T * 0.5, tl = T * 0.12, cr = Math.min(W, H) * 0.12;
    var g = new THREE.Group(), parts = {}, i;

    /* --- cellulose wall: primary + middle lamella + secondary layers, extruded rounded frames with a cut-away rim --- */
    var wall = new THREE.Group(), fib = fibrilTex();
    function frame(wo, ho, wi, hi, rOut, rIn, mat, edgeCol) {
      var s = rrShape(wo, ho, rOut); s.holes.push(rrPath(new THREE.Path(), wi, hi, rIn));
      var geo = new THREE.ExtrudeGeometry(s, { depth: D, bevelEnabled: false, curveSegments: 6 });
      geo.translate(0, 0, -D / 2);
      var m = new THREE.Mesh(geo, mat);
      var e = new THREE.LineSegments(new THREE.EdgesGeometry(geo, 25), new THREE.LineBasicMaterial({ color: edgeCol }));
      var gg = new THREE.Group(); gg.add(m, e); return gg;
    }
    function wmat(color, op) { var m = glass(color, op); m.bumpMap = fib; m.bumpScale = 1.2; return m; }
    var primary = frame(W, H, W - 2 * t1, H - 2 * t1, cr, cr - t1, wmat(0x3f9a3a, 0.2), 0x86efac);
    var lamella = frame(W - 2 * t1, H - 2 * t1, W - 2 * (t1 + tl), H - 2 * (t1 + tl), cr - t1, cr - t1 - tl, glass(0xd9a441, 0.55), 0xfde68a);
    var secondary = frame(W - 2 * (t1 + tl), H - 2 * (t1 + tl), W - 2 * T, H - 2 * T, cr - t1 - tl, Math.max(0.02, cr - T), wmat(0x22c55e, 0.3), 0x16a34a);
    wall.add(primary, lamella, secondary);
    function plate(z) {
      var geo = new THREE.ExtrudeGeometry(rrShape(W, H, cr), { depth: T, bevelEnabled: false, curveSegments: 6 });
      geo.translate(0, 0, z);
      return new THREE.Mesh(geo, wmat(0x3f9a3a, 0.22));
    }
    var back = plate(-D / 2); wall.add(back);
    if (front) wall.add(plate(D / 2 - T));
    g.add(wall);
    parts.cellWall = wall; parts.middleLamella = lamella; parts.cutFace = primary;

    /* plasmodesmata: dark channels through the wall (back plate and side walls) */
    var pd = new THREE.InstancedMesh(new THREE.CylinderGeometry(1, 1, 1, 8), std(0x4a3b1e, 0.6), 17), dm = new THREE.Object3D(), pn = 0;
    function addPd(x, y, z, ax) {
      dm.position.set(x, y, z); dm.rotation.set(ax === "z" ? Math.PI / 2 : 0, 0, ax === "x" ? Math.PI / 2 : 0);
      dm.scale.set(T * 0.16, T * 1.02, T * 0.16); dm.updateMatrix(); pd.setMatrixAt(pn++, dm.matrix);
    }
    for (i = 0; i < 9; i++) addPd(((i % 3) - 1) * W * 0.28, (Math.floor(i / 3) - 1) * H * 0.26, -D / 2 + T / 2, "z");
    for (i = 0; i < 3; i++) { addPd(W / 2 - T / 2, (i - 1) * H * 0.26, (i - 1) * D * 0.12 - D * 0.05, "x"); addPd(-W / 2 + T / 2, (i - 1) * H * 0.26 + H * 0.06, -(i - 1) * D * 0.12 - D * 0.05, "x"); }
    for (i = 0; i < 2; i++) addPd(((i * 2) - 1) * W * 0.2, H / 2 - T / 2, -D * 0.05, "y");
    pd.count = pn; pd.frustumCulled = false; wall.add(pd);
    parts.plasmodesmata = pd;

    /* interior box (cytoplasm lives here) */
    var iw = W - 2 * T, ih = H - 2 * T, id = D - T - (front ? T : 0), zc = (front ? 0 : T / 2);
    var ax = iw / 2, ay = ih / 2, az = id / 2;

    /* --- protoplast: plasma membrane as a live superellipsoid (corners peel first on plasmolysis) --- */
    var proto = new THREE.Group(); proto.position.z = zc; g.add(proto);
    var memGeo = new THREE.SphereGeometry(1, 40, 26), mp = memGeo.attributes.position, dirs = new Float32Array(mp.array.length);
    dirs.set(mp.array);
    var membrane = new THREE.Mesh(memGeo, glass(0xfff1c7, 0.22));
    g.add(membrane); membrane.position.z = zc;
    parts.membrane = membrane; parts.cytoplasm = membrane;
    var v = new THREE.Vector3();
    function shapeMembrane(sx, sy, sz, n) {
      for (var q = 0; q < mp.count; q++) {
        var dx = dirs[q * 3], dy = dirs[q * 3 + 1], dz = dirs[q * 3 + 2];
        var s = Math.pow(Math.pow(Math.abs(dx / sx), n) + Math.pow(Math.abs(dy / sy), n) + Math.pow(Math.abs(dz / sz), n), -1 / n);
        mp.setXYZ(q, dx * s, dy * s, dz * s);
      }
      mp.needsUpdate = true; memGeo.computeVertexNormals();
    }
    // Hechtian strands (membrane threads that stay stuck to the wall)
    var hd = [[1, 0.35, 0.15], [-1, -0.3, 0.2], [1, -0.4, -0.3], [-1, 0.4, -0.2], [0.2, 1, 0.3], [-0.3, 1, -0.2], [0.25, -1, 0.2], [-0.2, -1, -0.3]].map(function (a) { return new THREE.Vector3(a[0], a[1], a[2]).normalize(); });
    var hpos = new Float32Array(hd.length * 6);
    var hgeo = new THREE.BufferGeometry(); hgeo.setAttribute("position", new THREE.BufferAttribute(hpos, 3));
    var hech = new THREE.LineSegments(hgeo, new THREE.LineBasicMaterial({ color: 0xfde68a, transparent: true, opacity: 0 }));
    hech.frustumCulled = false; hech.position.z = zc; g.add(hech); parts.hechtian = hech;

    /* vacuole: sap + tonoplast (a distinct membrane shell) */
    var vac = new THREE.Group();
    var sap = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 20), glass(0x60a5fa, 0.34));
    var tono = new THREE.Mesh(new THREE.SphereGeometry(1.045, 28, 20), new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.3, transparent: true, opacity: 0.2, side: THREE.DoubleSide, depthWrite: false, bumpMap: fib, bumpScale: 0.8 }));
    vac.add(sap, tono); vac.position.x = -iw * 0.04; proto.add(vac);
    parts.vacuole = vac; parts.tonoplast = tono; parts.sap = sap;

    /* organelles (sizes fixed, positions follow the shrinking protoplast) */
    var orgs = [];
    function place(obj, fx, fy, fz) { obj.userData.p0 = new THREE.Vector3(fx * iw, fy * ih, fz * id); proto.add(obj); orgs.push(obj); return obj; }
    var mn = Math.min(ih, id);
    var nuc = place(nucleusMesh(mn * 0.17), 0.36, -0.18, 0.18);
    parts.nucleus = nuc; parts.nucleolus = nuc.userData.nucleolus;

    var chl = new THREE.Group(); proto.add(chl);
    var chlList = [];
    if (!o.onion) {
      var n = o.chloroplasts || 12;
      for (var c = 0; c < n; c++) {
        var cp = chloroplastMesh(mn * 0.08), a = (c / n) * TAU;
        cp.rotation.set(0, c * 1.3, a); cp.userData.a = a; cp.userData.zs = (c % 2 ? 1 : -1) * 0.36;
        chl.add(cp); chlList.push(cp);
      }
    }
    parts.chloroplast = chl;

    var mito = new THREE.Group(); proto.add(mito);
    [[-0.4, 0.36, 0.3], [0.1, -0.38, -0.34], [0.38, 0.32, -0.32], [-0.36, -0.34, 0.34]].forEach(function (p, k) {
      var m = mitochondrionMesh(mn * 0.15);
      m.userData.p0 = new THREE.Vector3(p[0] * iw, p[1] * ih, p[2] * id);
      m.rotation.set(k, k * 0.6, k * 1.1);
      mito.add(m); orgs.push(m);
    });
    parts.mitochondrion = mito;

    var er = erMesh(mn * 0.2, true);
    er.userData.p0 = nuc.userData.p0.clone(); er.userData.p0.x -= 0.02; proto.add(er); orgs.push(er);
    parts.er = er;
    var golgi = place(golgiMesh(mn * 0.13), 0.2, 0.28, -0.2);
    parts.golgi = golgi;
    var rib = ribosomeCloud(140, iw * 0.9, ih * 0.84, id * 0.84, 11);
    proto.add(rib);
    parts.ribosome = rib;

    var state = { tonicity: o.tonicity == null ? 1 : o.tonicity, cur: o.tonicity == null ? 1 : o.tonicity, last: 9 };
    var info = { sOrg: 1, frac: 1 };
    function apply(t) {
      // t: +1 turgid (membrane pressed on the wall), 0 flaccid, -1 plasmolysed
      var s = t >= 0 ? 0.94 + 0.056 * t : 0.94 + 0.3 * t;
      var nExp = t >= 0 ? 5 + t : Math.max(2, 5 + 3.2 * t);
      var sy = t >= 0 ? s : Math.max(0.62, s + 0.04 * t);
      var sx = ax * s, sY = ay * sy, sz = az * s;
      if (Math.abs(t - state.last) > 0.0004) {
        shapeMembrane(sx, sY, sz, nExp);
        state.last = t;
        // Hechtian strands appear once the membrane has pulled away
        var open = Math.max(0, Math.min(1, -t * 2.2));
        hech.material.opacity = open * 0.8;
        for (var q = 0; q < hd.length; q++) {
          var d = hd[q];
          var sm = Math.pow(Math.pow(Math.abs(d.x / sx), nExp) + Math.pow(Math.abs(d.y / sY), nExp) + Math.pow(Math.abs(d.z / sz), nExp), -1 / nExp);
          var sw = 1 / Math.max(Math.abs(d.x) / ax, Math.abs(d.y) / ay, Math.abs(d.z) / az);
          hpos.set([d.x * sm, d.y * sm, d.z * sm, d.x * sw, d.y * sw, d.z * sw], q * 6);
        }
        hgeo.attributes.position.needsUpdate = true;
        info.frac = superVol(nExp) * sx * sY * sz / (8 * ax * ay * az);
      }
      var so = t >= 0 ? 1 : Math.max(0.5, 1 + 0.5 * t);
      info.sOrg = so;
      for (var k = 0; k < orgs.length; k++) { var ob = orgs[k]; ob.position.copy(ob.userData.p0).multiplyScalar(so); }
      rib.scale.setScalar(so);
      var vs = t >= 0 ? 1 + 0.12 * t : 1 + 0.5 * t;
      vac.scale.set(iw * 0.34 * vs, ih * 0.3 * vs, id * 0.3 * vs);
      wall.scale.set(1 + 0.012 * Math.max(0, t), 1 + 0.012 * Math.max(0, t), 1);
      membrane.material.opacity = 0.22 + (t < 0 ? 0.12 * -t : 0);
    }
    function stream() {
      var so = info.sOrg;
      for (var k = 0; k < chlList.length; k++) {
        var cp = chlList[k], a = cp.userData.a;
        cp.position.set(Math.cos(a) * iw * 0.42 * so, Math.sin(a) * ih * 0.38 * so, cp.userData.zs * id * so);
      }
    }
    apply(state.cur); stream();

    g.userData.parts = parts;
    g.userData.proto = proto;
    g.userData.setState = function (st) { if (st && st.tonicity != null) state.tonicity = st.tonicity; };
    g.setTonicity = function (ton01) { state.tonicity = (ton01 - 0.5) * 2; };
    g.userData.reading = function () {
      var t = state.cur;
      return { tonicity: +t.toFixed(2), state: t > 0.6 ? "turgid" : t > -0.12 ? "flaccid" : "plasmolysed", protoplastFraction: +info.frac.toFixed(2) };
    };
    g.userData.update = function (dt, t) {
      state.cur += (state.tonicity - state.cur) * Math.min(1, dt * 1.6);
      apply(state.cur);
      for (var k = 0; k < chlList.length; k++) chlList[k].userData.a += dt * 0.12;   // cytoplasmic streaming
      stream();
      nuc.userData.nucleolus.material.emissiveIntensity = 0.35 + 0.1 * Math.sin(t * 2);
    };
    return attachCompat(g, o);
  }

  /* ---------- ANIMAL CELL ---------- */
  function blobGeometry(r, seed, amp) {
    var geo = new THREE.IcosahedronGeometry(r, 4);
    var p = geo.attributes.position, v = new THREE.Vector3();
    var base = new Float32Array(p.array.length); base.set(p.array);
    var R = rnd(seed || 5), f1 = 1 + R() * 2, f2 = 1 + R() * 3;
    for (var i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i);
      var n = 1 + (amp || 0.08) * (Math.sin(v.x * f1 * 3) * Math.cos(v.y * f2 * 3) + Math.sin(v.z * 4));
      p.setXYZ(i, v.x * n, v.y * n * 0.82, v.z * n);
    }
    geo.computeVertexNormals();
    geo.userData.base = new Float32Array(p.array);
    return geo;
  }
  function animalCell(o) {
    o = o || {};
    var R0 = o.r || 0.9;
    var g = new THREE.Group(), parts = {};
    var geo = blobGeometry(R0, o.seed || 9, o.cheek ? 0.12 : 0.07);
    var mem = new THREE.Mesh(geo, glass(o.color || 0xff9ec4, 0.28));
    if (o.cheek) mem.scale.set(1.25, 0.55, 1.1);
    g.add(mem);
    parts.membrane = mem; parts.cytoplasm = mem;
    var inside = new THREE.Group(); g.add(inside);
    var nuc = nucleusMesh(R0 * 0.27);
    inside.add(nuc);
    parts.nucleus = nuc; parts.nucleolus = nuc.userData.nucleolus;
    if (!o.simple) {
      var mito = new THREE.Group(); inside.add(mito);
      for (var i = 0; i < 6; i++) {
        var m = mitochondrionMesh(R0 * 0.17);
        var a = i / 6 * TAU;
        m.position.set(Math.cos(a) * R0 * 0.6, Math.sin(a * 2) * R0 * 0.22, Math.sin(a) * R0 * 0.55);
        m.rotation.set(a, a * 0.5, a * 1.3);
        mito.add(m);
      }
      parts.mitochondrion = mito;
      var cen = new THREE.Group();
      var cm = glowMat(0x3ee6c4, 0.5);
      var c1 = new THREE.Mesh(new THREE.CylinderGeometry(R0 * 0.045, R0 * 0.045, R0 * 0.2, 9), cm);
      var c2 = c1.clone(); c2.rotation.z = Math.PI / 2; c2.position.set(R0 * 0.1, R0 * 0.08, 0);
      cen.add(c1, c2); cen.position.set(R0 * 0.36, R0 * 0.3, R0 * 0.1);
      inside.add(cen);
      parts.centrioles = cen;
      var lys = new THREE.Group(); var lm = glowMat(0xa3e635, 0.4);
      [[-0.45, 0.25, 0.3], [0.2, -0.4, 0.35], [-0.2, -0.3, -0.45]].forEach(function (p) {
        var s = new THREE.Mesh(new THREE.SphereGeometry(R0 * 0.07, 10, 8), lm); s.position.set(p[0] * R0, p[1] * R0, p[2] * R0); lys.add(s);
      });
      inside.add(lys); parts.lysosome = lys;
      var vac = new THREE.Group(); var vm = glass(0x60a5fa, 0.45);
      [[0.5, -0.1, -0.3], [-0.55, 0.05, -0.15]].forEach(function (p) {
        var s = new THREE.Mesh(new THREE.SphereGeometry(R0 * 0.09, 12, 10), vm); s.position.set(p[0] * R0, p[1] * R0, p[2] * R0); vac.add(s);
      });
      inside.add(vac); parts.vacuole = vac;
      var golgi = golgiMesh(R0 * 0.16); golgi.position.set(-R0 * 0.35, R0 * 0.32, R0 * 0.05); inside.add(golgi); parts.golgi = golgi;
      var er = erMesh(R0 * 0.32, true); inside.add(er); parts.er = er;
      var gly = ribosomeCloud(40, R0 * 1.1, R0 * 0.6, R0 * 1.0, 21, 0xfbbf24); inside.add(gly); parts.glycogen = gly;
      var rib = ribosomeCloud(120, R0 * 1.3, R0 * 0.9, R0 * 1.3, 17); inside.add(rib); parts.ribosome = rib;
    }
    if (o.cheek) inside.scale.set(1.1, 0.6, 1);

    var base = geo.userData.base, p = geo.attributes.position, vv = new THREE.Vector3();
    var state = { tonicity: 0, cur: 0, burst: false, burstT: 0 };
    function apply(t, time) {
      // t: +1 strongly hypotonic (swell), 0 isotonic, -1 hypertonic (crenate)
      var sw = t > 0 ? 1 + 0.28 * t : 1 + 0.18 * t;
      for (var i = 0; i < p.count; i++) {
        vv.set(base[i * 3], base[i * 3 + 1], base[i * 3 + 2]);
        var spike = t < 0 ? 1 + (-t) * 0.12 * Math.max(0, Math.sin(vv.x * 18) * Math.sin(vv.y * 18) * Math.sin(vv.z * 18 + 1)) * 3 : 1;
        var k = sw * spike;
        p.setXYZ(i, vv.x * k, vv.y * k, vv.z * k);
      }
      p.needsUpdate = true; geo.computeVertexNormals();
      inside.scale.setScalar((o.cheek ? 1 : 1) * (1 + 0.12 * t));
      if (o.cheek) inside.scale.y *= 0.6;
    }
    apply(0, 0);
    g.userData.parts = parts;
    g.userData.setState = function (st) {
      if (!st) return;
      if (st.tonicity != null) { state.tonicity = st.tonicity; if (st.tonicity < 0.95) { state.burst = false; mem.visible = true; mem.material.opacity = 0.28; } }
    };
    g.setTonicity = function (ton01) { g.userData.setState({ tonicity: (ton01 - 0.5) * 2 }); };
    g.userData.update = function (dt, t) {
      state.cur += (state.tonicity - state.cur) * Math.min(1, dt * 1.4);
      if (state.tonicity >= 0.95 && state.cur > 0.9 && !state.burst) { state.burst = true; state.burstT = 0; }
      if (state.burst) {
        state.burstT += dt;
        mem.material.opacity = Math.max(0.03, 0.28 - state.burstT * 0.25);
      }
      apply(state.cur, t);
      if (parts.nucleolus) parts.nucleolus.material.emissiveIntensity = 0.35 + 0.1 * Math.sin(t * 2.2);
    };
    g.userData.isBurst = function () { return state.burst; };
    return attachCompat(g, o);
  }

  /* ---------- RED BLOOD CELL ---------- */
  function rbcGeometry() {
    var pts = [];
    for (var i = 0; i <= 24; i++) {
      var x = i / 24; // 0..1 radius
      var r = x * 0.5;
      var y = 0.5 * Math.sqrt(Math.max(0, 1 - x * x)) * (0.1 + 1.0 * x * x - 0.72 * x * x * x * x) ;
      pts.push(new THREE.Vector2(r, y));
    }
    for (var j = 24; j >= 0; j--) pts.push(new THREE.Vector2(pts[j].x, -pts[j].y));
    return new THREE.LatheGeometry(pts, 40);
  }
  function rbc(o) {
    o = o || {};
    var g = new THREE.Group();
    var geo = rbcGeometry();
    var base = new Float32Array(geo.attributes.position.array);
    var mat = std(0xd62839, 0.42, { emissive: 0x5a0a10, emissiveIntensity: 0.25, transparent: true, opacity: 1 });
    var m = new THREE.Mesh(geo, mat);
    m.scale.setScalar(o.size || 1);
    m.rotation.x = Math.PI / 2.4;
    g.add(m);
    var p = geo.attributes.position, v = new THREE.Vector3();
    var state = { tonicity: 0, cur: 0, burst: false, t: 0 };
    function apply(t) {
      for (var i = 0; i < p.count; i++) {
        v.set(base[i * 3], base[i * 3 + 1], base[i * 3 + 2]);
        if (t > 0) { // swell to a sphere
          var r = Math.sqrt(v.x * v.x + v.z * v.z);
          var sph = Math.sqrt(Math.max(0, 0.25 - r * r)) * Math.sign(v.y || 1);
          v.y = v.y + (sph - v.y) * t;
          v.x *= 1 - 0.1 * t; v.z *= 1 - 0.1 * t;
        } else if (t < 0) { // crenate: spiky rim, shrink
          var ang = Math.atan2(v.z, v.x);
          var sp = 1 + (-t) * 0.18 * Math.max(0, Math.sin(ang * 11));
          v.x *= (1 + 0.15 * t) * sp; v.z *= (1 + 0.15 * t) * sp; v.y *= 1 + 0.3 * t;
        }
        p.setXYZ(i, v.x, v.y, v.z);
      }
      p.needsUpdate = true; geo.computeVertexNormals();
    }
    g.userData.parts = { rbc: m, membrane: m };
    g.userData.setState = function (st) { if (st && st.tonicity != null) { state.tonicity = st.tonicity; if (st.tonicity < 0.95) { state.burst = false; mat.opacity = 1; m.visible = true; } } };
    g.setTonicity = function (ton01) { g.userData.setState({ tonicity: (ton01 - 0.5) * 2 }); };
    g.userData.update = function (dt, t) {
      state.cur += (state.tonicity - state.cur) * Math.min(1, dt * 1.4);
      apply(state.cur);
      if (state.tonicity >= 0.95 && state.cur > 0.88 && !state.burst) { state.burst = true; state.t = 0; }
      if (state.burst) { state.t += dt; mat.opacity = Math.max(0.08, 1 - state.t * 0.9); }
      m.rotation.z += dt * 0.25;
    };
    g.userData.isBurst = function () { return state.burst; };
    return attachCompat(g, o);
  }

  /* ---------- BACTERIUM (prokaryote) ---------- */
  function bacterium(o) {
    o = o || {};
    var g = new THREE.Group(), parts = {};
    var L = o.len || 1.6, r = o.r || 0.36;
    var capsule = new THREE.Mesh(new THREE.CapsuleGeometry(r * 1.18, L, 8, 20), glass(0xc4b5fd, 0.14));
    capsule.rotation.z = Math.PI / 2; g.add(capsule); parts.capsule = capsule;
    var wall = new THREE.Mesh(new THREE.CapsuleGeometry(r * 1.06, L, 8, 20), glass(0xf59e0b, 0.22));
    wall.rotation.z = Math.PI / 2; g.add(wall); parts.cellWall = wall;
    var mem = new THREE.Mesh(new THREE.CapsuleGeometry(r, L, 8, 20), glass(0xfde68a, 0.3));
    mem.rotation.z = Math.PI / 2; g.add(mem); parts.membrane = mem;
    // nucleoid: tangled circular DNA loop
    var curvePts = [];
    for (var i = 0; i < 80; i++) {
      var a = i / 80 * TAU;
      curvePts.push(new THREE.Vector3(Math.cos(a) * L * 0.28 + Math.sin(a * 5) * 0.08, Math.sin(a * 3) * r * 0.35, Math.sin(a) * r * 0.45 + Math.cos(a * 4) * 0.05));
    }
    var dna = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(curvePts, true), 160, 0.018, 6, true), glowMat(0x3ee6c4, 0.6));
    g.add(dna); parts.nucleoid = dna;
    var plas = new THREE.Group(); var pm = glowMat(0xff3d8b, 0.6);
    [[-L * 0.42, 0.12, 0.1], [L * 0.45, -0.1, -0.12]].forEach(function (p) {
      var t = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.012, 6, 20), pm); t.position.set(p[0], p[1], p[2]); t.rotation.x = 1; plas.add(t);
    });
    g.add(plas); parts.plasmid = plas;
    var rib = ribosomeCloud(160, L * 1.1, r * 1.3, r * 1.3, 31, 0x1e293b); g.add(rib); parts.ribosome = rib;
    var fpts = [];
    for (var k = 0; k < 30; k++) fpts.push(new THREE.Vector3(-L * 0.5 - r - k * 0.06, Math.sin(k * 0.7) * 0.1, Math.cos(k * 0.5) * 0.05));
    var flag = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(fpts), 60, 0.014, 5), std(0xe2e8f0, 0.5));
    g.add(flag); parts.flagellum = flag;
    g.userData.parts = parts;
    g.userData.update = function (dt, t) {
      flag.rotation.x = t * 6;
      dna.rotation.x = Math.sin(t * 0.7) * 0.15;
    };
    return attachCompat(g, o);
  }

  /* ---------- COMPOUND LIGHT MICROSCOPE (v2) ---------- */
  function microscope(o) {
    o = o || {};
    var useMirror = !!o.mirror;
    var eyeM = o.eyepiece || 10, FN = o.fieldNumber || 16;
    var g = new THREE.Group(), parts = {}, i;
    var X0 = 0.05, STAGE_TOP = 0.665, BETA = 0.32, RHO = 0.085;
    var enamel = std(0xe9e2d2, 0.38, { metalness: 0.2 });
    var black = std(0x1b2230, 0.35, { metalness: 0.4 });
    var chrome = std(0xdbe3ee, 0.22, { metalness: 0.55, emissive: 0x222b38, side: THREE.DoubleSide });
    var rubber = std(0x0f131b, 0.8);
    function lathe(pts, seg, mat) { return new THREE.Mesh(new THREE.LatheGeometry(pts.map(function (p) { return new THREE.Vector2(p[0], p[1]); }), seg || 24), mat); }

    /* --- foot: horseshoe (mirror model) or solid base with built-in lamp --- */
    var fs;
    if (useMirror) {
      fs = new THREE.Shape();
      fs.moveTo(0.55, -0.2); fs.lineTo(-0.1, -0.2); fs.absarc(-0.1, 0, 0.2, -Math.PI / 2, -Math.PI * 1.5, true);
      fs.lineTo(0.55, 0.2); fs.lineTo(0.55, 0.24); fs.quadraticCurveTo(0.55, 0.4, 0.39, 0.4);
      fs.lineTo(-0.39, 0.4); fs.quadraticCurveTo(-0.55, 0.4, -0.55, 0.24); fs.lineTo(-0.55, -0.24);
      fs.quadraticCurveTo(-0.55, -0.4, -0.39, -0.4); fs.lineTo(0.39, -0.4); fs.quadraticCurveTo(0.55, -0.4, 0.55, -0.24); fs.lineTo(0.55, -0.2);
    } else fs = rrShape(1.1, 0.78, 0.22);
    var footGeo = new THREE.ExtrudeGeometry(fs, { depth: 0.06, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 2, curveSegments: 10 });
    footGeo.rotateX(-Math.PI / 2); footGeo.translate(0, 0.02, 0);
    var foot = new THREE.Mesh(footGeo, enamel); g.add(foot); parts.foot = foot; parts.base = foot;
    [[-0.45, -0.3], [-0.45, 0.3], [0.42, -0.3], [0.42, 0.3]].forEach(function (p) {
      var ft = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.045, 0.02, 12), rubber); ft.position.set(p[0], 0.01, p[1]); g.add(ft);
    });

    /* --- C-shaped arm: offset ribbon along a curve, bevel-extruded --- */
    var curve = new THREE.CatmullRomCurve3([[-0.43, 0.06], [-0.47, 0.4], [-0.47, 0.82], [-0.39, 1.16], [-0.2, 1.37], [0.05, 1.44]].map(function (p) { return new THREE.Vector3(p[0], p[1], 0); }));
    var as = new THREE.Shape(), Lp = [], Rp = [], N = 44;
    for (i = 0; i <= N; i++) {
      var tt = i / N, pt = curve.getPoint(tt), tg = curve.getTangent(tt), hw = 0.115 - 0.05 * Math.sin(Math.PI * Math.min(1, tt * 1.1)) + 0.012 * tt;
      Lp.push([pt.x - tg.y * hw, pt.y + tg.x * hw]); Rp.push([pt.x + tg.y * hw, pt.y - tg.x * hw]);
    }
    as.moveTo(Lp[0][0], Lp[0][1]);
    for (i = 1; i <= N; i++) as.lineTo(Lp[i][0], Lp[i][1]);
    for (i = N; i >= 0; i--) as.lineTo(Rp[i][0], Rp[i][1]);
    var armGeo = new THREE.ExtrudeGeometry(as, { depth: 0.14, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 3, curveSegments: 6 });
    armGeo.translate(0, 0, -0.07);
    var arm = new THREE.Mesh(armGeo, enamel); g.add(arm); parts.arm = arm;
    var head = lathe([[0, 1.36], [0.1, 1.36], [0.105, 1.4], [0.09, 1.46], [0, 1.46]], 22, enamel); head.position.x = X0; g.add(head);

    /* --- optical axis: body tube, inclined eyepiece tube, eyepiece with engraved collar --- */
    var tube = lathe([[0, 1.04], [0.072, 1.04], [0.082, 1.07], [0.082, 1.34], [0.074, 1.37], [0, 1.37]], 22, enamel);
    tube.position.x = X0; g.add(tube); parts.tube = tube;
    var epG = new THREE.Group(); epG.position.set(X0, 1.44, 0); epG.rotation.z = -0.28; g.add(epG);
    var etube = lathe([[0, 0], [0.07, 0], [0.07, 0.15], [0.058, 0.17], [0, 0.17]], 20, enamel);
    var eye = new THREE.Group();
    eye.add(lathe([[0, 0.16], [0.054, 0.16], [0.054, 0.3], [0.046, 0.318], [0, 0.318]], 20, black));
    var ering = lathe([[0.055, 0.17], [0.062, 0.17], [0.062, 0.19], [0.055, 0.19]], 20, chrome); eye.add(ering);
    var eband = new THREE.Mesh(new THREE.CylinderGeometry(0.0555, 0.0555, 0.05, 24, 1, true), new THREE.MeshStandardMaterial({ map: bandTex("×" + eyeM, "", "#111827", "#f8fafc"), roughness: 0.5, side: THREE.DoubleSide }));
    eband.position.y = 0.235; eye.add(eband);
    var cup = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.011, 8, 18), rubber); cup.rotation.x = Math.PI / 2; cup.position.y = 0.318; eye.add(cup);
    var lens = new THREE.Mesh(new THREE.CircleGeometry(0.038, 18), new THREE.MeshStandardMaterial({ color: 0x93c5fd, emissive: 0x60a5fa, emissiveIntensity: 0.35, roughness: 0.05, transparent: true, opacity: 0.8 }));
    lens.rotation.x = -Math.PI / 2; lens.position.y = 0.321; eye.add(lens);
    epG.add(etube, eye); parts.eyepiece = eye; parts.eyeLens = lens; parts.eyeTube = etube;

    /* --- revolving nosepiece with three engraved, colour-banded objectives --- */
    var nose = new THREE.Group(); nose.rotation.z = -BETA; g.add(nose);
    var turret = lathe([[0, -0.05], [0.12, -0.05], [0.145, -0.02], [0.13, 0.04], [0.09, 0.05], [0, 0.05]], 28, chrome);
    var spin = new THREE.Group(); spin.add(turret);
    var defs = [
      { L: 0.2, col: "#dc2626", txt: "×4", na: "0.10", hex: 0xdc2626 },
      { L: 0.235, col: "#eab308", txt: "×10", na: "0.25", hex: 0xeab308 },
      { L: 0.27, col: "#2563eb", txt: "×40", na: "0.65", hex: 0x2563eb }
    ];
    var bumpK = knurlTex();
    defs.forEach(function (d, k) {
      var L = d.L, ob = new THREE.Group();
      ob.add(lathe([[0, -L], [0.013, -L], [0.016, -L + 0.012], [0.024, -L + 0.045], [0.034, -0.12], [0.036, -0.06], [0.046, -0.058], [0.046, 0], [0, 0]], 20, chrome));
      var bm = new THREE.MeshStandardMaterial({ map: bandTex(d.txt, d.na, d.col, k === 1 ? "#111827" : "#ffffff"), emissive: d.hex, emissiveIntensity: 0.12, roughness: 0.5, side: THREE.DoubleSide });
      var band = new THREE.Mesh(new THREE.CylinderGeometry(0.0475, 0.0475, 0.038, 28, 1, true), bm); band.position.y = -0.02; ob.add(band);
      var kn = new THREE.Mesh(new THREE.CylinderGeometry(0.0485, 0.0485, 0.022, 28, 1, true), new THREE.MeshStandardMaterial({ color: 0x9aa7b8, bumpMap: bumpK, bumpScale: 1.2, roughness: 0.4, metalness: 0.5, side: THREE.DoubleSide })); kn.position.y = -0.052; ob.add(kn);
      var tip = new THREE.Mesh(new THREE.SphereGeometry(0.011, 8, 6), glowMat(0xbfdbfe, 0.5)); tip.position.y = -L; ob.add(tip);
      var holder = new THREE.Group(); holder.position.set(RHO, -0.035, 0); holder.rotation.z = BETA; holder.add(ob);
      var wrap = new THREE.Group(); wrap.rotation.y = k * TAU / 3; wrap.add(holder);
      spin.add(wrap);
    });
    nose.add(spin);
    var off = new THREE.Vector3(RHO, -0.035, 0).applyAxisAngle(new THREE.Vector3(0, 0, 1), -BETA);
    nose.position.set(X0 - off.x, 0.705 + defs[2].L - off.y, 0);
    parts.nosepiece = turret; parts.turret = turret; parts.objective = spin;

    /* --- stage: extruded plate with a real aperture, slide, spring clips (moves with focus) --- */
    var stageG = new THREE.Group(); g.add(stageG);
    var ss = rrShape(0.66, 0.56, 0.06); ss.holes.push(new THREE.Path().absarc(0, 0, 0.075, 0, TAU, true));
    var sGeo = new THREE.ExtrudeGeometry(ss, { depth: 0.03, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.01, bevelSegments: 2, curveSegments: 18 });
    sGeo.rotateX(-Math.PI / 2);
    var stage = new THREE.Mesh(sGeo, black); stage.position.set(X0, STAGE_TOP - 0.04, 0); stageG.add(stage); parts.stage = stage;
    var bracket = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.07, 0.16), enamel); bracket.position.set(-0.36, STAGE_TOP - 0.06, 0); stageG.add(bracket);
    var sl = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.013, 0.15), glass(0xe0f2fe, 0.5)); sl.position.set(X0, STAGE_TOP + 0.0065, 0); stageG.add(sl); parts.slide = sl;
    var lab = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.0142, 0.15), std(0xf8fafc, 0.8)); lab.position.set(X0 - 0.18, STAGE_TOP + 0.0071, 0); stageG.add(lab);
    var cov = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.004, 0.1), glass(0xffffff, 0.35)); cov.position.set(X0, STAGE_TOP + 0.0155, 0); stageG.add(cov);
    var spec = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.036, 0.004, 20), glowMat(0xfbbf24, 0.45)); spec.position.set(X0, STAGE_TOP + 0.0145, 0); stageG.add(spec); parts.specimen = spec;
    var clips = new THREE.Group();
    [[-1, 1], [1, -1]].forEach(function (c) {
      var cx = X0 + c[0] * 0.265, cz = c[1] * 0.14;
      var pts = [[cx, STAGE_TOP, cz], [cx, STAGE_TOP + 0.05, cz], [cx - c[0] * 0.03, STAGE_TOP + 0.05, cz - c[1] * 0.03], [cx - c[0] * 0.05, STAGE_TOP + 0.03, c[1] * 0.07], [cx - c[0] * 0.05, STAGE_TOP + 0.016, c[1] * 0.07]].map(function (p) { return new THREE.Vector3(p[0], p[1], p[2]); });
      clips.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 20, 0.0075, 6), chrome));
    });
    stageG.add(clips); parts.clips = clips;

    /* --- condenser + iris diaphragm --- */
    var cond = lathe([[0, 0.5], [0.07, 0.5], [0.078, 0.53], [0.078, 0.6], [0.06, 0.625], [0, 0.625]], 24, chrome);
    cond.position.x = X0; g.add(cond); parts.condenser = cond;
    var iris = new THREE.Group(); iris.position.set(X0, 0.495, 0); g.add(iris);
    var ring = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.011, 8, 28), black); ring.rotation.x = Math.PI / 2; iris.add(ring);
    var leafG = new THREE.BoxGeometry(0.075, 0.003, 0.035), leafM = std(0x0b0f17, 0.5), leaves = [];
    for (i = 0; i < 7; i++) { var lf = new THREE.Mesh(leafG, leafM); iris.add(lf); leaves.push(lf); }
    var lever = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.12, 8), chrome); lever.rotation.x = Math.PI / 2; lever.position.set(0, 0, 0.14); iris.add(lever);
    var irisV = o.iris == null ? 0.7 : o.iris;
    function setIris(v) {
      irisV = Math.max(0, Math.min(1, v));
      var ri = 0.012 + irisV * 0.05;
      for (var q = 0; q < 7; q++) {
        var a = q / 7 * TAU, rr = ri + 0.032;
        leaves[q].position.set(Math.cos(a) * rr, 0, Math.sin(a) * rr);
        leaves[q].rotation.y = -a + 0.5 * (1 - irisV);
      }
      lever.position.x = -0.04 + 0.08 * irisV;
    }
    setIris(irisV);
    parts.iris = iris;

    /* --- illumination: mirror on a swivel fork, or built-in lamp --- */
    var mirrorAng = o.mirrorAngle_deg == null ? 45 : o.mirrorAngle_deg, mirrorMode = o.mirrorFace === "concave" ? "concave" : "plane", flipT = mirrorMode === "concave" ? 1 : 0, flipC = flipT;
    var lamp, mirror = null, tilt = null, flip = null;
    var beamMat = new THREE.MeshBasicMaterial({ color: 0xfff7c2, transparent: true, opacity: 0.2, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
    var MY = 0.27;
    if (useMirror) {
      var stem = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.4, 10), chrome); stem.rotation.z = Math.PI / 2; stem.position.set(-0.22, MY, 0); g.add(stem);
      var fork = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([[X0 - 0.03, MY, 0.12], [X0 + 0.0, MY - 0.12, 0.1], [X0 + 0.02, MY - 0.14, 0], [X0 + 0.0, MY - 0.12, -0.1], [X0 - 0.03, MY, -0.12]].map(function (p) { return new THREE.Vector3(p[0], p[1], p[2]); })), 24, 0.011, 6), chrome);
      g.add(fork);
      mirror = new THREE.Group(); mirror.position.set(X0, MY, 0); g.add(mirror);
      tilt = new THREE.Group(); mirror.add(tilt);
      flip = new THREE.Group(); tilt.add(flip);
      flip.add(new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.095, 0.02, 30), black));
      var planeF = new THREE.Mesh(new THREE.CircleGeometry(0.086, 30), std(0xeef2f7, 0.04, { metalness: 0.9, emissive: 0x3b4a5e, side: THREE.DoubleSide }));
      planeF.rotation.x = -Math.PI / 2; planeF.position.y = 0.0105; flip.add(planeF);
      var Rs = (0.086 * 0.086 + 0.012 * 0.012) / (2 * 0.012);
      var capG = new THREE.SphereGeometry(Rs, 28, 6, 0, TAU, 0, Math.asin(0.086 / Rs));
      capG.translate(0, -Rs + 0.0015, 0);
      var conc = new THREE.Mesh(capG, std(0xdfe6ef, 0.04, { metalness: 0.9, emissive: 0x3b4a5e, side: THREE.DoubleSide }));
      flip.add(conc);
      parts.mirror = mirror; parts.planeFace = planeF; parts.concaveFace = conc;
      lamp = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 12), glowMat(0xfff7c2, 0.95)); lamp.position.set(1.05, MY, 0); g.add(lamp);
      var ray = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.05 - X0, 16, 1, true), beamMat); ray.rotation.z = Math.PI / 2; ray.position.set((1.05 + X0) / 2, MY, 0); g.add(ray);
    } else {
      lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.1, 0.018, 24), glowMat(0xfff7c2, 0.9)); lamp.position.set(X0, 0.118, 0); g.add(lamp);
      var lring = new THREE.Mesh(new THREE.TorusGeometry(0.105, 0.012, 8, 28), chrome); lring.rotation.x = Math.PI / 2; lring.position.set(X0, 0.118, 0); g.add(lring);
    }
    parts.lamp = lamp;

    /* --- light path: illumination cone + the path up the tube to the eye --- */
    var lightPath = new THREE.Group(); g.add(lightPath);
    var y0 = useMirror ? MY + 0.02 : 0.13;
    var beam = new THREE.Mesh(new THREE.CylinderGeometry(0.03, useMirror ? 0.06 : 0.09, (STAGE_TOP + 0.02) - y0, 20, 1, true), beamMat);
    beam.position.set(X0, (y0 + STAGE_TOP + 0.02) / 2, 0); lightPath.add(beam);
    var upCurve = new THREE.CatmullRomCurve3([[X0, STAGE_TOP + 0.02], [X0, 1.40], [X0 + Math.sin(0.28) * 0.31, 1.44 + Math.cos(0.28) * 0.31]].map(function (p) { return new THREE.Vector3(p[0], p[1], 0); }), false, "catmullrom", 0.05);
    var up = new THREE.Mesh(new THREE.TubeGeometry(upCurve, 30, 0.009, 6), new THREE.MeshBasicMaterial({ color: 0xfff7c2, transparent: true, opacity: 0.35, depthWrite: false, blending: THREE.AdditiveBlending }));
    lightPath.add(up);
    parts.beam = beam; parts.lightPath = lightPath;

    /* --- focus knobs: knurled coarse + fine pairs on both sides of the arm --- */
    function knob(r, w, mat) {
      var pts = [[0, -w / 2], [r - 0.012, -w / 2], [r, -w / 2 + 0.012], [r, w / 2 - 0.012], [r - 0.012, w / 2], [0, w / 2]];
      var m = lathe(pts, 36, mat); m.geometry.rotateX(Math.PI / 2); return m;
    }
    var kmat = function (c) { return new THREE.MeshStandardMaterial({ color: c, roughness: 0.55, metalness: 0.3, bumpMap: bumpK, bumpScale: 1.6 }); };
    var coarse = new THREE.Group(), fine = new THREE.Group();
    coarse.position.set(-0.47, 0.64, 0); fine.position.set(-0.47, 0.64, 0);
    var shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.52, 14), chrome); shaft.rotation.x = Math.PI / 2; shaft.position.set(-0.47, 0.64, 0); g.add(shaft);
    [-1, 1].forEach(function (s) {
      var c = knob(0.115, 0.07, kmat(0x2b3445)); c.position.set(0, 0, s * 0.155); coarse.add(c);
      var f = knob(0.07, 0.055, kmat(0xcbd5e1)); f.position.set(0, 0, s * 0.225); fine.add(f);
    });
    g.add(coarse, fine); parts.coarse = coarse; parts.fine = fine; parts.knob = coarse;

    /* --- state --- */
    var curObj = 1, target = 0, focusT = o.focus == null ? 0.5 : o.focus, focusC = focusT;
    var mags = [4, 10, 40];
    function selectObjective(k) { curObj = Math.max(0, Math.min(2, k | 0)); target = -curObj * TAU / 3; spin.rotation.y = target; }
    selectObjective(o.objective == null ? 1 : o.objective);
    function lightOn() { return !useMirror || Math.abs(mirrorAng - 45) < 9; }
    g.userData.parts = parts;
    g.userData.selectObjective = selectObjective;
    g.setObjective = selectObjective;
    g.userData.setState = function (st) {
      if (!st) return;
      if (st.objective != null) selectObjective(st.objective);
      if (st.focus != null) focusT = Math.max(0, Math.min(1, st.focus));
      if (st.iris != null) setIris(st.iris);
      if (st.mirror === "plane" || st.mirror === "concave") { mirrorMode = st.mirror; flipT = st.mirror === "concave" ? 1 : 0; }
      if (st.mirrorAngle_deg != null) mirrorAng = st.mirrorAngle_deg;
    };
    g.userData.reading = function () {
      var M = mags[curObj] * eyeM;
      return { objective: curObj, M_obj: mags[curObj], eyepiece: eyeM, M: M, field_mm: +(FN / mags[curObj]).toFixed(2), iris: +irisV.toFixed(2), mirror: useMirror ? mirrorMode : null, lit: lightOn(), focus: +focusT.toFixed(2) };
    };
    var nrm = new THREE.Vector3(), up0 = new THREE.Vector3(0, 1, 0);
    g.userData.update = function (dt, t) {
      spin.rotation.y += (target - spin.rotation.y) * Math.min(1, dt * 4);
      focusC += (focusT - focusC) * Math.min(1, dt * 5);
      stageG.position.y = (0.5 - focusC) * 0.04;
      coarse.rotation.z = focusC * 14; fine.rotation.z = focusC * 56;
      var on = lightOn();
      beamMat.opacity = on ? 0.11 + 0.04 * Math.sin(t * 3) : 0.0;
      up.material.opacity = on ? 0.32 : 0.0;
      if (useMirror) {
        flipC += (flipT - flipC) * Math.min(1, dt * 6);
        // normal points up and toward the light; 45 degrees sends horizontal light straight up the tube
        nrm.set(Math.cos(mirrorAng * Math.PI / 180), Math.sin(mirrorAng * Math.PI / 180), 0);
        tilt.quaternion.setFromUnitVectors(up0, nrm);
        flip.rotation.z = flipC * Math.PI;
      }
    };
    g.userData.update(0, 0);
    return attachCompat(g, o);
  }

  /* ---------- PROTISTS & SIMPLE ORGANISMS ---------- */
  function protist(type, o) {
    if (typeof type === "object" && type !== null) { o = type; type = o.type || "euglena"; }
    o = o || {};
    var g = new THREE.Group(), parts = {}, upd = null;
    if (type === "amoeba") {
      var geo = blobGeometry(0.55, 4, 0.22);
      var base = new Float32Array(geo.attributes.position.array);
      var body = new THREE.Mesh(geo, glass(0xa5b4fc, 0.45)); body.scale.y = 0.5; g.add(body); parts.body = body; parts.pseudopodia = body;
      var n = nucleusMesh(0.12); n.position.set(0.1, 0, 0.05); g.add(n); parts.nucleus = n;
      var cv = new THREE.Mesh(new THREE.SphereGeometry(0.08, 14, 10), glass(0x38bdf8, 0.7)); cv.position.set(-0.25, 0.02, 0.1); g.add(cv); parts.contractileVacuole = cv;
      var fv = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 10), glowMat(0xfbbf24, 0.4)); fv.position.set(0.25, 0.02, -0.12); g.add(fv); parts.foodVacuole = fv;
      var p = geo.attributes.position, v = new THREE.Vector3();
      upd = function (dt, t) {
        for (var i = 0; i < p.count; i++) {
          v.set(base[i * 3], base[i * 3 + 1], base[i * 3 + 2]);
          var k = 1 + 0.18 * Math.sin(Math.atan2(v.z, v.x) * 3 + t * 1.2) * Math.max(0, 1 - Math.abs(v.y) * 3);
          p.setXYZ(i, v.x * k, v.y, v.z * k);
        }
        p.needsUpdate = true; geo.computeVertexNormals();
        var c = (t * 0.5) % 1; cv.scale.setScalar(c < 0.85 ? 0.5 + c * 0.7 : 0.3);
      };
    } else if (type === "paramecium") {
      var bodyP = new THREE.Mesh(new THREE.CapsuleGeometry(0.22, 0.75, 8, 18), glass(0xfde68a, 0.42));
      bodyP.rotation.z = Math.PI / 2; bodyP.scale.set(1, 1, 0.75); g.add(bodyP); parts.body = bodyP; parts.pellicle = bodyP;
      var cil = new THREE.Group(); var cm = std(0xfef3c7, 0.5);
      for (var i = 0; i < 70; i++) {
        var a = i / 70 * TAU * 3, x = -0.55 + (i / 70) * 1.1;
        var hair = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.08, 3), cm);
        var ang = a;
        hair.position.set(x, Math.cos(ang) * 0.23, Math.sin(ang) * 0.17);
        hair.lookAt(new THREE.Vector3(x, Math.cos(ang) * 0.5, Math.sin(ang) * 0.4)); hair.rotateX(Math.PI / 2);
        cil.add(hair);
      }
      g.add(cil); parts.cilia = cil;
      var mac = new THREE.Mesh(new THREE.SphereGeometry(0.1, 14, 10), glass(0x9b6bff, 0.7)); mac.scale.set(1.4, 0.8, 0.8); g.add(mac); parts.macronucleus = mac;
      var mic = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 8), glowMat(0x5b21b6, 0.5)); mic.position.set(0.13, 0.05, 0.05); g.add(mic); parts.micronucleus = mic;
      var cvs = new THREE.Group();
      [-0.35, 0.35].forEach(function (x) { var s = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 10), glass(0x38bdf8, 0.75)); s.position.set(x, 0.08, 0); cvs.add(s); });
      g.add(cvs); parts.contractileVacuole = cvs;
      var og = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.02, 6, 16, Math.PI), std(0xd97706, 0.5)); og.position.set(-0.05, -0.15, 0.08); g.add(og); parts.oralGroove = og;
      upd = function (dt, t) { cil.rotation.x = Math.sin(t * 8) * 0.06; cvs.children.forEach(function (c, k) { var ph = (t * 0.6 + k * 0.5) % 1; c.scale.setScalar(ph < 0.8 ? 0.5 + ph * 0.7 : 0.25); }); };
    } else if (type === "euglena") {
      var bodyE = new THREE.Mesh(new THREE.SphereGeometry(0.2, 18, 14), glass(0x86efac, 0.5)); bodyE.scale.set(3, 1, 1); g.add(bodyE); parts.body = bodyE; parts.pellicle = bodyE;
      var chlE = new THREE.Group();
      for (var c = 0; c < 9; c++) { var cp = chloroplastMesh(0.04); cp.position.set(-0.35 + c * 0.09, (c % 2 ? 0.06 : -0.06), (c % 3 - 1) * 0.06); chlE.add(cp); }
      g.add(chlE); parts.chloroplast = chlE;
      var eye = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 8), glowMat(0xef4444, 0.9)); eye.position.set(0.48, 0.06, 0.06); g.add(eye); parts.eyespot = eye;
      var nE = nucleusMesh(0.07); nE.position.set(0.0, 0, 0.02); g.add(nE); parts.nucleus = nE;
      var cvE = new THREE.Mesh(new THREE.SphereGeometry(0.04, 10, 8), glass(0x38bdf8, 0.8)); cvE.position.set(0.42, -0.04, 0); g.add(cvE); parts.contractileVacuole = cvE;
      var fpts = []; for (var k = 0; k < 24; k++) fpts.push(new THREE.Vector3(0.58 + k * 0.035, Math.sin(k * 0.6) * 0.05, 0));
      var flE = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(fpts), 40, 0.01, 5), std(0xdcfce7, 0.5)); g.add(flE); parts.flagellum = flE;
      upd = function (dt, t) { flE.rotation.x = t * 5; flE.rotation.z = Math.sin(t * 6) * 0.2; bodyE.scale.y = 1 + 0.06 * Math.sin(t * 2); };
    } else if (type === "chlamydomonas") {
      var wallC = new THREE.Mesh(new THREE.SphereGeometry(0.3, 20, 16), glass(0x4ade80, 0.25)); wallC.scale.set(1, 1.3, 1); g.add(wallC); parts.cellWall = wallC; parts.body = wallC;
      var cup = new THREE.Mesh(new THREE.SphereGeometry(0.26, 20, 14, 0, TAU, Math.PI * 0.35, Math.PI * 0.65), glowMat(0x16a34a, 0.35)); cup.material.side = THREE.DoubleSide; cup.scale.set(1, 1.3, 1); g.add(cup); parts.chloroplast = cup;
      var pyr = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 10), glowMat(0xfef08a, 0.5)); pyr.position.y = -0.22; g.add(pyr); parts.pyrenoid = pyr;
      var nC = nucleusMesh(0.07); nC.position.y = 0.05; g.add(nC); parts.nucleus = nC;
      var eyeC = new THREE.Mesh(new THREE.SphereGeometry(0.03, 10, 8), glowMat(0xef4444, 0.9)); eyeC.position.set(0.2, 0.18, 0.12); g.add(eyeC); parts.eyespot = eyeC;
      var fl = new THREE.Group();
      [-1, 1].forEach(function (s) { var pts = []; for (var k = 0; k < 18; k++) pts.push(new THREE.Vector3(s * (0.04 + k * 0.03), 0.4 + Math.sin(k * 0.4) * 0.08 + k * 0.02, 0)); fl.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 30, 0.008, 5), std(0xdcfce7, 0.5))); });
      g.add(fl); parts.flagellum = fl;
      upd = function (dt, t) { fl.children[0].rotation.z = Math.sin(t * 7) * 0.3; fl.children[1].rotation.z = -Math.sin(t * 7) * 0.3; };
    } else if (type === "volvox") {
      var sph = new THREE.Mesh(new THREE.SphereGeometry(0.6, 28, 20), glass(0x86efac, 0.16)); g.add(sph); parts.body = sph; parts.colony = sph;
      var cells = new THREE.InstancedMesh(new THREE.SphereGeometry(0.035, 8, 6), glowMat(0x16a34a, 0.45), 160);
      var dummy = new THREE.Object3D();
      for (var i2 = 0; i2 < 160; i2++) {
        var phi = Math.acos(1 - 2 * (i2 + 0.5) / 160), th = Math.PI * (1 + Math.sqrt(5)) * i2;
        dummy.position.set(Math.cos(th) * Math.sin(phi) * 0.6, Math.cos(phi) * 0.6, Math.sin(th) * Math.sin(phi) * 0.6);
        dummy.updateMatrix(); cells.setMatrixAt(i2, dummy.matrix);
      }
      g.add(cells); parts.cells = cells;
      var dau = new THREE.Group();
      [[0.18, 0.1, 0.05], [-0.15, -0.12, 0.1], [0.02, 0.2, -0.2]].forEach(function (p) { var d = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 12), glowMat(0x22c55e, 0.3)); d.position.set(p[0], p[1], p[2]); dau.add(d); });
      g.add(dau); parts.daughterColony = dau;
      upd = function (dt) { g.rotation.y += dt * 0.35; g.rotation.x += dt * 0.12; };
    } else if (type === "spirogyra") {
      var fil = new THREE.Group(), cellsS = o.cells || 5;
      for (var s = 0; s < cellsS; s++) {
        var cell = new THREE.Group(); cell.position.x = (s - (cellsS - 1) / 2) * 0.5;
        var cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.48, 18, 1, true), glass(0x4ade80, 0.25)); cyl.rotation.z = Math.PI / 2; cell.add(cyl);
        var cw = new THREE.Mesh(new THREE.CylinderGeometry(0.152, 0.152, 0.012, 18), std(0x166534, 0.5)); cw.rotation.z = Math.PI / 2; cw.position.x = 0.245; cell.add(cw);
        var hpts = []; for (var k2 = 0; k2 <= 40; k2++) { var a2 = k2 / 40 * TAU * 1.5; hpts.push(new THREE.Vector3(-0.22 + k2 / 40 * 0.44, Math.cos(a2) * 0.12, Math.sin(a2) * 0.12)); }
        var rib2 = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(hpts), 60, 0.022, 6), glowMat(0x15803d, 0.4)); cell.add(rib2);
        var nS = new THREE.Mesh(new THREE.SphereGeometry(0.03, 10, 8), glowMat(0x7c3aed, 0.5)); cell.add(nS);
        fil.add(cell);
        if (s === 1) { parts.chloroplast = rib2; parts.nucleus = nS; parts.cell = cell; }
      }
      var sheath = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, cellsS * 0.5, 18, 1, true), glass(0xd1fae5, 0.1)); sheath.rotation.z = Math.PI / 2; fil.add(sheath); parts.sheath = sheath;
      g.add(fil); parts.body = fil; parts.filament = fil;
      upd = function (dt, t) { fil.rotation.x = Math.sin(t * 0.5) * 0.2; };
    } else if (type === "hydra") {
      var col = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.9, 18), glass(0xfdba74, 0.6)); col.position.y = 0.45; g.add(col); parts.body = col;
      var endo = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.1, 0.86, 14), glowMat(0xc2410c, 0.25)); endo.position.y = 0.45; g.add(endo); parts.endoderm = endo; parts.ectoderm = col;
      var tent = new THREE.Group();
      for (var tt = 0; tt < 6; tt++) {
        var tpts = []; var ta = tt / 6 * TAU;
        for (var k3 = 0; k3 < 14; k3++) tpts.push(new THREE.Vector3(Math.cos(ta) * (0.1 + k3 * 0.035), 0.9 + k3 * 0.04 - k3 * k3 * 0.004, Math.sin(ta) * (0.1 + k3 * 0.035)));
        tent.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(tpts), 24, 0.02, 5), glass(0xfdba74, 0.75)));
      }
      g.add(tent); parts.tentacles = tent;
      var foot = new THREE.Mesh(new THREE.SphereGeometry(0.17, 14, 10), std(0x9a3412, 0.5)); foot.scale.y = 0.4; g.add(foot); parts.basalDisc = foot;
      upd = function (dt, t) { tent.rotation.y = Math.sin(t * 0.8) * 0.2; tent.children.forEach(function (c, k) { c.rotation.x = Math.sin(t * 1.5 + k) * 0.08; }); };
    }
    g.userData.parts = parts;
    g.userData.update = upd || function () {};
    return attachCompat(g, o);
  }

  /* ---------- SA/V CUBE ---------- */
  function cube(L, o) {
    if (typeof L === "object" && L !== null) { o = L; L = o.size || 0.65; }
    o = o || {};
    var g = new THREE.Group();
    var size = o.size || L || 0.65;
    var geo = new THREE.BoxGeometry(size, size, size);
    var m = new THREE.Mesh(geo, glass(o.color || 0xffb23f, 0.4));
    var e = new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color: o.edge || 0xffd36b }));
    var core = new THREE.Mesh(new THREE.BoxGeometry(size, size, size), std(0x1e293b, 0.6));
    core.scale.setScalar(0.001);
    g.add(core, m, e);
    g.userData.parts = { cube: m, core: core };
    g.userData.setDiffusion = function (frac) { // fraction of volume reached by diffusion (0..1)
      var unreached = Math.max(0.001, Math.cbrt(Math.max(0, 1 - frac)));
      core.scale.setScalar(unreached);
    };
    g.setL = function (newL) {
      var s = Math.max(0.45, Math.min(1.35, 0.55 + newL * 0.12));
      g.scale.setScalar(s);
      g.userData.setDiffusion(Math.min(1, 2.0 / Math.max(1, newL)));
    };
    return attachCompat(g, o);
  }

  /* ---------- WET-MOUNT SLIDE ---------- */
  function slide(o) {
    o = o || {};
    var g = new THREE.Group(), parts = {};
    var s = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.05, 0.75), glass(0xe0f2fe, 0.45)); g.add(s); parts.slide = s;
    var drop = new THREE.Mesh(new THREE.SphereGeometry(0.22, 24, 12, 0, TAU, 0, Math.PI / 2), glass(o.stain || 0xb45309, 0.55)); drop.scale.y = 0.35; drop.position.y = 0.025; g.add(drop); parts.drop = drop;
    var spec = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.004, 0.24), glass(o.specimen || 0xfde68a, 0.75)); spec.position.y = 0.03; g.add(spec); parts.specimen = spec;
    var pivot = new THREE.Group(); pivot.position.set(-0.3, 0.035, 0); g.add(pivot);
    var cs = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.008, 0.6), glass(0xffffff, 0.35)); cs.position.x = 0.3; pivot.add(cs); parts.coverslip = cs;
    var needle = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.8, 8), std(0xcbd5e1, 0.2, { metalness: 0.9 })); needle.position.set(0.62, 0.3, 0); needle.rotation.z = 0.6; pivot.add(needle); parts.needle = needle;
    var bubbles = new THREE.Group();
    [[0.1, 0.05], [-0.08, -0.08], [0.02, 0.12]].forEach(function (p) {
      var b = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.012, 8, 20), std(0x0f172a, 0.3)); b.rotation.x = Math.PI / 2; b.position.set(p[0], 0.038, p[1]); bubbles.add(b);
    });
    bubbles.visible = false; g.add(bubbles); parts.bubbles = bubbles;
    var state = { angle: 0.8, target: 0.8 };
    g.userData.parts = parts;
    g.userData.lower = function (flat) { state.target = 0; bubbles.visible = false; g.userData._flat = !!flat; };
    g.userData.raise = function () { state.target = 0.8; bubbles.visible = false; };
    g.setStep = function (st) { if (st >= 2) g.userData.lower(false); else g.userData.raise(); };
    g.userData.update = function (dt) {
      var sp = g.userData._flat ? 8 : 1.6;
      state.angle += (state.target - state.angle) * Math.min(1, dt * sp);
      pivot.rotation.z = state.angle;
      needle.visible = state.angle > 0.05 || !g.userData._flat;
      if (state.target === 0 && state.angle < 0.02 && g.userData._flat) bubbles.visible = true;
      drop.scale.x = drop.scale.z = 1 + (0.8 - state.angle) * 0.6;
    };
    return attachCompat(g, o);
  }

  /* ---------- ULTRASTRUCTURE CUT-AWAYS ---------- */
  function mitochondrion(o) {
    o = o || {};
    var g = mitoBuild({ cut: o.cut !== false, seg: 36, n: 8, color: 0xff6b4a }), parts = g.userData.parts, body = g.userData.body;
    var P = { outer: parts.outer, matrix: parts.inner, innerMembrane: parts.inner, cristae: parts.cristae };
    // mtDNA loop + matrix granules (inside the inner membrane, in body frame: axis = lathe y)
    var dna = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.012, 6, 20), glowMat(0x7c3aed, 0.5));
    dna.position.set(0.1, 0.1, -0.05); dna.rotation.x = 0.6; body.add(dna);
    var gr = ribosomeCloud(40, 0.5, 2.0, 0.5, 8, 0xbe123c); gr.material.size = 0.03; body.add(gr);
    P.mtDNA = dna; P.granules = gr;
    var atp = new THREE.Group(); var am = glowMat(0xfde047, 0.9);
    for (var k = 0; k < 24; k++) { var s = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 6), am); s.userData.ph = k / 24; atp.add(s); }
    g.add(atp); P.atp = atp;
    g.userData.parts = P;
    g.userData.update = function (dt, t) {
      atp.children.forEach(function (s, k) { var ph = (s.userData.ph + t * 0.15) % 1; s.position.set(-1.1 + ph * 2.2, Math.sin(ph * 20 + k) * 0.32, Math.cos(ph * 15 + k) * 0.32); s.scale.setScalar(0.6 + 0.4 * Math.sin(t * 4 + k)); });
    };
    return attachCompat(g, o);
  }
  function chloroplast(o) {
    o = o || {};
    var g = new THREE.Group(), parts = {};
    var env = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32, 20), glass(0x4ade80, 0.2)); env.scale.set(1.6, 0.6, 1); g.add(env); parts.envelope = env;
    var stroma = new THREE.Mesh(new THREE.SphereGeometry(0.74, 28, 18), glass(0xbbf7d0, 0.25)); stroma.scale.set(1.6, 0.56, 0.95); g.add(stroma); parts.stroma = stroma;
    var grana = new THREE.Group(); var gm = glowMat(0x15803d, 0.4);
    [[-0.75, 0], [-0.25, 0.15], [0.25, -0.1], [0.75, 0.05], [0, -0.3]].forEach(function (p) {
      var stack = new THREE.Group();
      for (var i = 0; i < 6; i++) { var disc = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.035, 20), gm); disc.position.y = -0.11 + i * 0.045; stack.add(disc); }
      stack.position.set(p[0], 0, p[1]); grana.add(stack);
    });
    g.add(grana); parts.grana = grana; parts.thylakoid = grana;
    var lam = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.012, 0.06), gm); g.add(lam);
    var starch = new THREE.Mesh(new THREE.SphereGeometry(0.13, 14, 10), std(0xfef9c3, 0.6)); starch.scale.set(1.3, 0.7, 1); starch.position.set(0.5, -0.05, 0.35); g.add(starch); parts.starch = starch;
    var photons = new THREE.Group(); var pm = glowMat(0xfde047, 1.0);
    for (var k = 0; k < 10; k++) { var s = new THREE.Mesh(new THREE.SphereGeometry(0.025, 6, 6), pm); s.userData.ph = k / 10; photons.add(s); }
    g.add(photons); parts.light = photons;
    g.userData.parts = parts;
    g.userData.update = function (dt, t) {
      photons.children.forEach(function (s, k) { var ph = (s.userData.ph + t * 0.3) % 1; s.position.set(-1 + (k % 5) * 0.5, 1.2 - ph * 1.2, (k < 5 ? 0.2 : -0.2)); s.visible = ph < 0.92; });
    };
    return attachCompat(g, o);
  }
  function bilayer(o) {
    o = o || {};
    var g = new THREE.Group(), parts = {};
    var heads = new THREE.InstancedMesh(new THREE.SphereGeometry(0.06, 8, 6), std(0x60a5fa, 0.4), 2 * 15 * 7);
    var tails = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.012, 0.012, 0.2, 4), std(0xfde68a, 0.6), 2 * 15 * 7 * 2);
    var d = new THREE.Object3D(), hi = 0, ti = 0;
    for (var x = 0; x < 15; x++) for (var z = 0; z < 7; z++) {
      [1, -1].forEach(function (s) {
        var px = -1.4 + x * 0.2, pz = -0.6 + z * 0.2;
        if (Math.abs(px) < 0.25 && Math.abs(pz) < 0.25) return;
        if (Math.abs(px - 0.9) < 0.25 && Math.abs(pz) < 0.25) return;
        d.position.set(px, s * 0.3, pz); d.rotation.set(0, 0, 0); d.scale.setScalar(1); d.updateMatrix(); heads.setMatrixAt(hi++, d.matrix);
        [-0.025, 0.025].forEach(function (off) { d.position.set(px + off, s * 0.15, pz); d.updateMatrix(); tails.setMatrixAt(ti++, d.matrix); });
      });
    }
    heads.count = hi; tails.count = ti;
    g.add(heads, tails); parts.bilayer = heads;
    var aqua = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.8, 16, 1, true), glowMat(0x3ee6c4, 0.35)); aqua.material.side = THREE.DoubleSide; g.add(aqua); parts.aquaporin = aqua;
    var pump = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.85, 14), glowMat(0xff3d8b, 0.35)); pump.position.x = 0.9; g.add(pump); parts.atpPump = pump;
    var water = new THREE.Group(); var wm = std(0x38bdf8, 0.3);
    for (var k = 0; k < 14; k++) { var w = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 6), wm); w.userData.ph = k / 14; water.add(w); }
    g.add(water); parts.water = water;
    var ions = new THREE.Group(); var im = glowMat(0xa855f7, 0.6);
    for (var j = 0; j < 6; j++) { var io = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 6), im); io.userData.ph = j / 6; ions.add(io); }
    g.add(ions); parts.ions = ions;
    var flow = { dir: 1, rate: 1, pumpOn: true };
    g.userData.parts = parts;
    g.userData.setFlow = function (dir, rate) { flow.dir = dir; flow.rate = rate == null ? 1 : rate; };
    g.userData.setPump = function (on) { flow.pumpOn = !!on; };
    g.setMode = function (m) {
      if (m === "active") { g.userData.setPump(true); g.userData.setFlow(1, 0.6); }
      else if (m === "diffusion") { g.userData.setPump(false); g.userData.setFlow(1, 0.3); }
      else { g.userData.setPump(false); g.userData.setFlow(1, 1.0); }
    };
    g.userData.update = function (dt, t) {
      water.children.forEach(function (w, k) {
        w.userData.ph = (w.userData.ph + dt * 0.25 * flow.rate) % 1;
        var ph = w.userData.ph, y = flow.dir >= 0 ? 0.9 - ph * 1.8 : -0.9 + ph * 1.8;
        var inChan = Math.abs(y) < 0.4;
        w.position.set(inChan ? Math.sin(k) * 0.06 : Math.sin(k * 2.3) * 0.5, y, inChan ? Math.cos(k) * 0.06 : Math.cos(k * 1.7) * 0.4);
        w.visible = flow.rate > 0.02;
      });
      ions.children.forEach(function (io, k) {
        if (flow.pumpOn) io.userData.ph = (io.userData.ph + dt * 0.18) % 1;
        var ph = io.userData.ph, y = -0.9 + ph * 1.8, inC = Math.abs(y) < 0.42;
        io.position.set(0.9 + (inC ? 0 : Math.sin(k * 3) * 0.3), y, inC ? 0 : Math.cos(k * 2) * 0.3);
      });
      pump.material.emissiveIntensity = flow.pumpOn ? 0.35 + 0.25 * Math.sin(t * 6) : 0.08;
    };
    return attachCompat(g, o);
  }

  function attachCompat(g, o) {
    if (o && o.scale) g.scale.setScalar(o.scale);
    g.group = g;
    g.parts = g.userData.parts || {};
    g.tick = g.userData.update || function () {};
    g.update = g.userData.update || function () {};
    if (g.userData.setState) g.setState = g.userData.setState;
    if (g.userData.reading) g.reading = g.userData.reading;
    return g;
  }

  /* ---------- highlight helper ---------- */
  function makeHighlighter(scene) {
    var glow = window.SceneKit ? SceneKit.glowSprite("rgba(255,178,63,0.9)", 1) : null;
    if (glow) { glow.material.opacity = 0; scene.add(glow); }
    var cur = null, box = new THREE.Box3(), size = new THREE.Vector3();
    return {
      set: function (obj) { cur = obj || null; },
      update: function (dt, t) {
        if (!glow) return;
        if (cur) {
          box.setFromObject(cur); box.getCenter(glow.position); box.getSize(size);
          glow.scale.setScalar(Math.max(0.4, Math.max(size.x, size.y, size.z) * 1.8));
        }
        var target = cur ? 0.55 + 0.25 * Math.sin(t * 5) : 0;
        glow.material.opacity += (target - glow.material.opacity) * Math.min(1, dt * 6);
      }
    };
  }

  window.CellKit = {
    std: std, glass: glass, glowMat: glowMat, label: label, setLabelText: setLabelText,
    plantCell: plantCell, animalCell: animalCell, rbc: rbc, bacterium: bacterium, microscope: microscope,
    protist: protist, cube: cube, slide: slide, mitochondrion: mitochondrion, chloroplast: chloroplast, bilayer: bilayer,
    mitochondrionMesh: mitochondrionMesh, chloroplastMesh: chloroplastMesh, nucleusMesh: nucleusMesh,
    canvasTex: canvasTex, makeHighlighter: makeHighlighter, version: 2
  };
})();
