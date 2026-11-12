/* =========================================================
   StudyPipe · DissectionBench v1 — goat-heart dissection bench (WAEC Paper 3 style)
   Classic script (no modules), fully offline. Needs window.THREE (three.js r160 bundle) and window.HeartKit
   (kits/heart-circulation/heart-kit.js, v2 or later). SceneKit is NOT required.

   Units: 1 scene unit = 1 cm.   Y is up.   Board top at y = 0.   Heart lies front-side up, apex toward the viewer
   (the patient's right is on screen left, exactly as in the HeartKit diagrams).

   What it wraps: two HeartKit.heart() instances sharing one place on the board —
     "specimen" (exterior: fat, pericardium, groove, rubbery aorta, thinner pulmonary artery) and
     "dissect"  (longitudinal section with cavities, valves, chordae, papillary muscles).
   A clipping-plane sweep from the apex upwards (the scalpel follows the cut line) removes the specimen's exterior and
   reveals the section underneath. Clipping needs renderer.localClippingEnabled = true: the kit switches it on itself on the
   first frame it draws (board.onBeforeRender); hosts may also call DissectionBench.enableClipping(renderer).

   API
     var kit = DissectionBench.create({ length_cm, errors, labels, cut });
     scene.add(kit);                       // kit is a THREE.Group
     kit.parts  (= kit.userData.parts)     // name -> Object3D, each with userData.partId
     kit.update(dt, t)  (= kit.tick)       // call every frame
     kit.setState({ cut: 0..1, errors: {slantCut, papillaryIncluded, shrunken}, labels, length_cm })
     kit.cut(to = 1)  kit.settle(seconds)  kit.reset()
     kit.measure(part)   // 'ra'|'la'|'rv'|'lv'|'septum' -> { region, trial, value, r1, r2, mean, pumpsTo } | null (before the cut)
     kit.reading()       // { region, r1, r2, mean, pumpsTo, ratioLVRV, length_cm, cut, errors, table }
     kit.model(errors)   // pure model of all five regions
     kit.onEvent = function (name, detail)   // 'cut' | 'measure' | 'region-done' | 'bench-done' | 'blocked' | 'reset' | 'state'
   Static: DissectionBench.model(errors), DissectionBench.TRUE, DissectionBench.fit(camera, controls, aspect),
           DissectionBench.lights(scene), DissectionBench.environment(renderer), DissectionBench.enableClipping(renderer)

   Parts: ra, la, rv, lv, septum, tricuspid, bicuspid, chordae, papillary, aorta, pulmonaryArtery, pulmonaryVeins,
          venaeCavae, semilunar, scalpel, ruler  (+ board, specimen, section, cutPlane, callout, rvWall, lvWall, raWall, laWall)
   ========================================================= */
(function (global) {
  "use strict";
  var THREE = global.THREE;
  if (!THREE) return;

  /* ---------------------------------------------------------- biology model (02-lesson.md § L02) */
  var TRUE = {            // simulated specimen readings, mm [reading 1, reading 2]
    ra: [1.6, 1.4], la: [2.1, 1.9], rv: [4.2, 3.8], lv: [12.4, 11.6], septum: [10.8, 11.2]
  };
  var NAMES = { ra: "RA", la: "LA", rv: "RV", lv: "LV", septum: "Septum" };
  var PUMPS = { ra: "right ventricle", la: "left ventricle", rv: "lungs", lv: "whole body", septum: "divides the halves" };
  var ORDER = ["ra", "la", "rv", "lv", "septum"];
  var SLANT_DEG = 30, SHRINK = 0.85, PAP_MM = 1.8;
  function r1(x) { return Math.round(x * 10) / 10; }

  function model(errors) {
    errors = errors || {};
    var out = {};
    ORDER.forEach(function (k) {
      var f = 1, add = 0;
      if (errors.shrunken) f *= SHRINK;                                  // fridge-stored specimen: reads too low
      if (errors.slantCut) f /= Math.cos(SLANT_DEG * Math.PI / 180);     // oblique section: reads too high
      if (errors.papillaryIncluded && (k === "rv" || k === "lv")) add = PAP_MM;   // muscle that is not wall: too high
      var a = r1(TRUE[k][0] * f + add), b = r1(TRUE[k][1] * f + add);
      out[k] = { region: k, r1: a, r2: b, mean: r1((a + b) / 2), pumpsTo: PUMPS[k] };
    });
    out.ratioLVRV = r1(out.lv.mean / out.rv.mean);
    return out;
  }

  /* ---------------------------------------------------------- helpers */
  function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
  function ease(cur, tar, dt, rate) { return cur + (tar - cur) * (1 - Math.exp(-rate * dt)); }
  function ctex(w, h, draw) {
    var c = document.createElement("canvas"); c.width = w; c.height = h;
    draw(c.getContext("2d"), w, h);
    var t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
    t.wrapS = t.wrapT = THREE.RepeatWrapping; return t;
  }
  function std(color, rough, metal, extra) {
    var m = new THREE.MeshStandardMaterial({ color: color, roughness: rough == null ? 0.5 : rough, metalness: metal || 0 });
    if (extra) for (var k in extra) m[k] = extra[k];
    return m;
  }
  function tag(o, id) { o.userData.partId = id; return o; }
  function rng(seed) { var a = seed >>> 0; return function () { a += 0x6D2B79F5; var t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function lathe(pts, seg) {
    var g = new THREE.LatheGeometry(pts.map(function (p) { return new THREE.Vector2(p[0], p[1]); }), seg || 28); g.computeVertexNormals(); return g;
  }
  function rrShape(w, d, r) {
    var s = new THREE.Shape(), x = -w / 2, y = -d / 2;
    s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + d - r); s.quadraticCurveTo(x + w, y + d, x + w - r, y + d);
    s.lineTo(x + r, y + d); s.quadraticCurveTo(x, y + d, x, y + d - r);
    s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s;
  }
  function pill(text, h) {
    var c = document.createElement("canvas"); c.width = 256; c.height = 64; var g = c.getContext("2d");
    g.fillStyle = "rgba(10,15,29,.9)"; g.beginPath(); g.moveTo(14, 0); g.arcTo(256, 0, 256, 64, 24); g.arcTo(256, 64, 0, 64, 24); g.arcTo(0, 64, 0, 0, 24); g.arcTo(0, 0, 256, 0, 24); g.fill();
    g.fillStyle = "#fff"; g.font = "bold 28px Arial, sans-serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(text, 128, 34);
    var t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
    var s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthTest: false, depthWrite: false }));
    s.scale.set(h * 4, h, 1); s.renderOrder = 20; s.userData.canvas = c; s.userData.tex = t; return s;
  }
  function setPill(s, text) {
    var c = s.userData.canvas, g = c.getContext("2d");
    g.clearRect(0, 0, 256, 64);
    g.fillStyle = "rgba(10,15,29,.9)"; g.beginPath(); g.moveTo(14, 0); g.arcTo(256, 0, 256, 64, 24); g.arcTo(256, 64, 0, 64, 24); g.arcTo(0, 64, 0, 0, 24); g.arcTo(0, 0, 256, 0, 24); g.fill();
    g.fillStyle = "#fff"; g.font = "bold 28px Arial, sans-serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(text, 128, 34);
    s.userData.tex.needsUpdate = true;
  }

  /* ---------------------------------------------------------- textures (built once) */
  var TEX = null;
  function textures() {
    if (TEX) return TEX;
    var R = rng(7); TEX = {};
    TEX.board = ctex(512, 512, function (g, w, h) {      // pale plastic-wood chopping board, grain along x
      g.fillStyle = "#c9a36b"; g.fillRect(0, 0, w, h);
      for (var i = 0; i < 220; i++) {
        var y = R() * h, a = 0.05 + R() * 0.12, dark = R() < 0.6;
        g.strokeStyle = dark ? "rgba(90,55,20," + a + ")" : "rgba(235,205,150," + a + ")";
        g.lineWidth = 0.6 + R() * 2.2; g.beginPath(); g.moveTo(0, y);
        for (var x = 0; x <= w; x += 64) g.lineTo(x, y + Math.sin(x * 0.02 + i) * 3 + (R() - 0.5) * 2); g.stroke();
      }
      for (var k = 0; k < 14; k++) {                       // knife scars
        g.strokeStyle = "rgba(60,35,12,.28)"; g.lineWidth = 0.8; g.beginPath();
        var sx = R() * w, sy = R() * h; g.moveTo(sx, sy); g.lineTo(sx + (R() - 0.5) * 120, sy + (R() - 0.5) * 60); g.stroke();
      }
    });
    TEX.boardBump = ctex(256, 256, function (g, w, h) {
      g.fillStyle = "#808080"; g.fillRect(0, 0, w, h);
      for (var i = 0; i < 90; i++) { g.strokeStyle = "rgba(" + (R() < 0.5 ? "40,40,40" : "200,200,200") + ",.25)"; g.lineWidth = 1 + R() * 2; var y = R() * h; g.beginPath(); g.moveTo(0, y); g.lineTo(w, y + (R() - 0.5) * 6); g.stroke(); }
    });
    TEX.ruler = ctex(2048, 128, function (g, w, h) {      // 30 cm: 2048 px -> 30 cm, mm ticks, cm numbers
      var grd = g.createLinearGradient(0, 0, 0, h); grd.addColorStop(0, "#f6f1dc"); grd.addColorStop(1, "#e4dcc0");
      g.fillStyle = grd; g.fillRect(0, 0, w, h);
      var pxmm = (w - 40) / 300;
      g.strokeStyle = "#1c1c1c"; g.fillStyle = "#1c1c1c"; g.textAlign = "center"; g.textBaseline = "top";
      for (var mm = 0; mm <= 300; mm++) {
        var x = 20 + mm * pxmm, len = mm % 10 === 0 ? 46 : mm % 5 === 0 ? 32 : 20;
        g.lineWidth = mm % 10 === 0 ? 2.6 : 1.4; g.beginPath(); g.moveTo(x, 0); g.lineTo(x, len); g.stroke();
        if (mm % 10 === 0) { g.font = "bold 30px Arial, sans-serif"; g.fillText(String(mm / 10), x, 52); }
      }
      g.font = "bold 24px Arial, sans-serif"; g.textAlign = "left"; g.fillStyle = "#6a3a10"; g.fillText("cm", 30, 92);
    });
    TEX.steel = ctex(256, 64, function (g, w, h) {
      var grd = g.createLinearGradient(0, 0, w, 0);
      grd.addColorStop(0, "#bfc5cb"); grd.addColorStop(0.5, "#eef1f3"); grd.addColorStop(1, "#aab1b8");
      g.fillStyle = grd; g.fillRect(0, 0, w, h);
      for (var i = 0; i < 30; i++) { g.strokeStyle = "rgba(255,255,255," + (0.1 + R() * 0.2) + ")"; g.lineWidth = 1; var y = R() * h; g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
    });
    return TEX;
  }

  /* ---------------------------------------------------------- scalpel: lathe handle with grip, extruded blade. Tip at origin; handle toward +Y */
  function buildScalpel() {
    var T = textures();
    var grp = new THREE.Group();
    var steel = std(0xd8dde2, 0.28, 0.9, { map: T.steel });
    var BL = 3.4;
    var s = new THREE.Shape();                 // blade outline in (x = edge side, y = along blade); tip at (0,0)
    s.moveTo(0, 0);
    s.quadraticCurveTo(0.22, 0.45, 0.5, 0.9);  // curved cutting edge (belly)
    s.quadraticCurveTo(0.62, 1.8, 0.58, BL);
    s.lineTo(-0.30, BL);                       // spine
    s.lineTo(-0.30, 1.0);
    s.quadraticCurveTo(-0.16, 0.5, 0, 0);
    var bg = new THREE.ExtrudeGeometry(s, { depth: 0.045, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.012, bevelSegments: 1, curveSegments: 10 });
    bg.translate(0, 0, -0.022);
    bg.rotateY(Math.PI / 2);                   // edge (+x) now faces -Z: away from the user, toward the base of the heart
    bg.computeVertexNormals();
    var blade = new THREE.Mesh(bg, steel);
    var slot = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.9, 0.12), std(0x6a7077, 0.5, 0.8)); slot.position.set(0.0, BL - 0.8, -0.1); // spine groove
    blade.add(slot);
    grp.add(blade);
    var handle = new THREE.Mesh(lathe([                     // collar -> flat grip with ribs -> end cap
      [0.001, BL - 0.02], [0.12, BL - 0.02], [0.2, BL + 0.1], [0.34, BL + 0.5], [0.40, BL + 1.2],
      [0.46, BL + 2.4], [0.50, BL + 4.8], [0.50, BL + 7.0], [0.46, BL + 8.6], [0.36, BL + 9.6], [0.001, BL + 9.7]
    ], 24), steel);
    handle.scale.set(0.8, 1, 1.35);
    grp.add(handle);
    var gripMat = std(0x8a929a, 0.6, 0.7);
    for (var i = 0; i < 9; i++) {                           // grip ridges (torus rings)
      var ring = new THREE.Mesh(new THREE.TorusGeometry(0.505, 0.035, 6, 20), gripMat);
      ring.rotation.x = Math.PI / 2; ring.position.y = BL + 2.2 + i * 0.5; ring.scale.set(0.8, 1.35, 1); ring.scale.set(0.8, 1, 1.35);
      grp.add(ring);
    }
    var thumb = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 8), gripMat); thumb.scale.set(1, 1.5, 0.9); thumb.position.set(0, BL + 1.5, 0.55); grp.add(thumb); // thumb bump
    grp.userData.length = BL + 9.7;
    return grp;
  }

  /* ---------------------------------------------------------- the kit */
  var DEFAULTS = { length_cm: 8, errors: null, labels: false, cut: 0 };
  var ANATOMY = { yApex: -0.8, yTop: 0.5, nativeLen: 1.25 };   // HeartKit native units: muscle spans y -0.8 .. 0.5

  function create(opts) {
    var P = {}; for (var k in DEFAULTS) P[k] = DEFAULTS[k]; if (opts) for (var k2 in opts) P[k2] = opts[k2];
    P.errors = { slantCut: !!(P.errors && P.errors.slantCut), papillaryIncluded: !!(P.errors && P.errors.papillaryIncluded), shrunken: !!(P.errors && P.errors.shrunken) };
    var T = textures();
    var kit = new THREE.Group(); kit.name = "DissectionBench";
    var parts = {};
    var state = { cutTarget: clamp(+P.cut || 0, 0, 1), cut: 0, t: 0, counts: {}, done: {}, fired: false, last: null, calloutT: 0, cutDone: false };
    if (state.cutTarget > 0) state.cut = state.cutTarget;

    /* --- dissecting board: rounded extruded slab, bevelled, pinned corners --- */
    var BW = 40, BD = 28, BH = 1.4;
    var bgeo = new THREE.ExtrudeGeometry(rrShape(BW - 1.2, BD - 1.2, 2.2), { depth: BH - 0.6, bevelEnabled: true, bevelThickness: 0.3, bevelSize: 0.3, bevelSegments: 3, curveSegments: 8 });
    bgeo.rotateX(-Math.PI / 2); bgeo.translate(0, -BH + 0.3, 0);
    var uv = bgeo.attributes.uv, pos = bgeo.attributes.position;   // planar UVs so the grain runs along x on the top
    for (var i = 0; i < uv.count; i++) uv.setXY(i, pos.getX(i) / 30 + 0.5, pos.getZ(i) / 30 + 0.5);
    T.board.repeat.set(1, 1); T.boardBump.repeat.set(1, 1);
    var board = new THREE.Mesh(bgeo, std(0xffffff, 0.72, 0, { map: T.board, bumpMap: T.boardBump, bumpScale: 0.6 }));
    board.onBeforeRender = function (renderer) { if (renderer && !renderer.localClippingEnabled) renderer.localClippingEnabled = true; };
    kit.add(tag(board, "board")); parts.board = board;
    var feet = std(0x2c2a28, 0.9);
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (c) {          // rubber feet
      var f = new THREE.Mesh(lathe([[0.001, 0], [1.2, 0], [1.3, 0.2], [1.1, 0.5], [0.001, 0.5]], 14), feet);
      f.position.set(c[0] * (BW / 2 - 3), -BH - 0.5, c[1] * (BD / 2 - 3)); kit.add(f);
    });
    var pinSteel = std(0xc8ced4, 0.3, 0.9);
    var pinPts = [[-9.5, -6.6], [-3.8, 7.4], [10.2, 4.2], [9.4, -8.2]];  // dissecting pins around the heart
    pinPts.forEach(function (c, i) {
      var pin = new THREE.Group();
      var needle = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.4, 6), pinSteel); needle.position.y = 0.4;
      var head = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 8), std(i % 2 ? 0xd94d3b : 0x2f6fd0, 0.35, 0.1)); head.position.y = 1.7;
      pin.add(needle, head); pin.position.set(c[0], 0, c[1]); pin.rotation.z = (i - 1.5) * 0.08; kit.add(pin);
    });
    // water-stained mat patch under the heart
    var stain = new THREE.Mesh(new THREE.CircleGeometry(8.5, 28), new THREE.MeshBasicMaterial({ color: 0x8a5a3a, transparent: true, opacity: 0.16, depthWrite: false }));
    stain.rotation.x = -Math.PI / 2; stain.position.y = 0.01; kit.add(stain);

    /* --- the two hearts, sharing one root --- */
    var HK = global.HeartKit;
    var root = new THREE.Group(); root.name = "heartRoot";
    var specimen = HK ? HK.heart({ mode: "specimen", labels: false }) : new THREE.Group();
    var section = HK ? HK.heart({ mode: "dissect", labels: false }) : new THREE.Group();
    root.add(specimen, section);
    root.rotation.x = -Math.PI / 2;           // front side up, apex toward the viewer
    kit.add(root);
    function placeHeart() {
      var s = (P.length_cm / ANATOMY.nativeLen) * (P.errors.shrunken ? 0.9 : 1);
      root.scale.setScalar(s);
      root.position.set(0.5, 0.46 * s + 0.02, -0.5);
    }
    placeHeart();
    parts.specimen = specimen; parts.section = section;

    var sp = section.userData.parts || {};
    ["ra", "la", "rv", "lv", "septum", "tricuspid", "bicuspid", "chordae", "papillary", "aorta", "pulmonaryArtery", "pulmonaryVeins"].forEach(function (n) { if (sp[n]) parts[n] = sp[n]; });
    parts.venaeCavae = sp.venaCava; parts.venaCava = sp.venaCava;
    var semi = new THREE.Group(); semi.name = "semilunar";
    if (sp.aorticValve) semi.userData.members = [sp.aorticValve, sp.pulmValve];
    parts.semilunar = sp.aorticValve || semi;           // aortic pockets (the pulmonary pockets are parts.pulmValve)
    parts.aorticValve = sp.aorticValve; parts.pulmValve = sp.pulmValve;
    parts.rvWall = sp.rvWall; parts.lvWall = sp.lvWall;

    /* RA and LA wall anchors (thin walls, ~1.5 mm and 2.0 mm), in HeartKit-local coordinates on the cut face */
    function anchor(x, y, w, h, id) {
      var m = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.05), new THREE.MeshBasicMaterial({ visible: false }));
      m.position.set(x, y, 0); m.userData.partId = id; section.add(m); return m;
    }
    parts.raWall = anchor(-0.62, 0.27, 0.06, 0.26, "raWall");
    parts.laWall = anchor(0.58, 0.24, 0.07, 0.26, "laWall");
    var WALLS = { ra: parts.raWall, la: parts.laWall, rv: parts.rvWall, lv: parts.lvWall, septum: parts.septum };
    parts.ra = sp.ra; parts.la = sp.la; parts.rv = sp.rv; parts.lv = sp.lv;

    /* --- clipping planes (world space, refreshed each frame from the root matrix) --- */
    var planeSpec = new THREE.Plane(), planeSect = new THREE.Plane();
    function clipAll(obj, plane) {
      obj.traverse(function (m) {
        if (!m.material) return;
        (Array.isArray(m.material) ? m.material : [m.material]).forEach(function (mt) { mt.clippingPlanes = [plane]; mt.clipShadows = true; });
      });
    }
    clipAll(specimen, planeSpec); clipAll(section, planeSect);

    /* --- translucent cut plane + bright edge, showing where the blade has been --- */
    var cutPlane = new THREE.Group(); cutPlane.name = "cutPlane";
    var cpMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.0), new THREE.MeshBasicMaterial({ color: 0xffd9a0, transparent: true, opacity: 0.16, side: THREE.DoubleSide, depthWrite: false }));
    cpMesh.rotation.x = -Math.PI / 2;
    var cpEdge = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.012, 0.012), new THREE.MeshBasicMaterial({ color: 0xffb23f }));
    cpEdge.position.z = 0.42;
    cutPlane.add(cpMesh, cpEdge); cutPlane.visible = false; root.add(cutPlane); parts.cutPlane = cutPlane;

    /* --- ruler: 30 cm, graduated canvas texture, steel edge, on the near side of the board --- */
    var ruler = new THREE.Group();
    var rbody = new THREE.Mesh(new THREE.BoxGeometry(30.4, 0.16, 2.8), [std(0xe8e0c6, 0.5), std(0xe8e0c6, 0.5), std(0xffffff, 0.45, 0, { map: T.ruler }), std(0xcfc7ac, 0.6), std(0xe8e0c6, 0.5), std(0xe8e0c6, 0.5)]);
    rbody.geometry.attributes.uv.needsUpdate = true;
    var edge = new THREE.Mesh(new THREE.BoxGeometry(30.4, 0.18, 0.12), std(0xc0c6cc, 0.25, 0.9)); edge.position.set(0, 0.0, -1.38);
    ruler.add(rbody, edge);
    for (var h = 0; h < 2; h++) { var hole = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.18, 14), new THREE.MeshBasicMaterial({ color: 0x8a6a3a })); hole.position.set(h ? 13.6 : -13.6, 0.0, 0.0); ruler.add(hole); }
    ruler.position.set(0, 0.1, 9.2); ruler.userData.partId = "ruler";
    kit.add(ruler); parts.ruler = ruler;

    /* --- scalpel --- */
    var scalpel = buildScalpel(); scalpel.userData.partId = "scalpel"; scalpel.scale.setScalar(0.62);
    var scalpelRest = new THREE.Vector3(11.5, 0.3, 6.2);
    scalpel.rotation.set(Math.PI / 2 - 0.03, 0, 0.0); scalpel.rotation.order = "YXZ";
    scalpel.position.copy(scalpelRest);
    scalpel.rotation.y = -0.5;                // resting on the board beside the ruler, blade pointing away
    kit.add(scalpel); parts.scalpel = scalpel;

    /* --- measuring callout (arrow + graduated bar + pill) --- */
    var callout = new THREE.Group(); callout.visible = false; kit.add(callout); parts.callout = callout;
    var cBar = new THREE.Mesh(new THREE.BoxGeometry(1, 0.12, 0.34), new THREE.MeshBasicMaterial({ color: 0xffb23f, depthTest: false, transparent: true }));
    var cCapL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.12, 0.9), new THREE.MeshBasicMaterial({ color: 0xffffff, depthTest: false }));
    var cCapR = cCapL.clone();
    var cArrow = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.8, 12), new THREE.MeshBasicMaterial({ color: 0xffb23f, depthTest: false }));
    cArrow.rotation.x = Math.PI; cArrow.position.y = 1.5;
    var cStem = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.9, 6), new THREE.MeshBasicMaterial({ color: 0xffb23f, depthTest: false })); cStem.position.y = 2.2;
    var cPill = pill("", 0.9); cPill.position.y = 3.2; cPill.scale.set(4.4, 1.1, 1);
    [cBar, cCapL, cCapR, cArrow, cStem].forEach(function (m) { m.renderOrder = 18; });
    callout.add(cBar, cCapL, cCapR, cArrow, cStem, cPill);

    /* --- optional labels (short, 3D sprites; hide below 560 px in the host) --- */
    var labels = new THREE.Group(); labels.visible = !!P.labels; kit.add(labels);
    function L(text, x, y, z) { var s = pill(text, 0.9); s.scale.set(4.6, 1.15, 1); s.position.set(x, y, z); labels.add(s); return s; }
    L("Dissecting board", -12, 2.6, -10); L("30 cm ruler", -9, 2.2, 9.2); L("Scalpel", 11.5, 3.0, 5.4);

    var tmpV = new THREE.Vector3(), tmpP = new THREE.Vector3(), tmpN = new THREE.Vector3(), tmpQ = new THREE.Quaternion();
    var tilt = 0;

    function emit(name, detail) { if (typeof kit.onEvent === "function") { try { kit.onEvent(name, detail); } catch (e) {} } }

    /* ---- cut plane maths: plane in heart-local coords, then to world ---- */
    function setPlanes() {
      var cutY = ANATOMY.yApex + state.cut * (ANATOMY.yTop - ANATOMY.yApex);
      var tau = tilt * Math.PI / 180;
      var nLocal = new THREE.Vector3(Math.sin(tau), Math.cos(tau), 0);              // slant tilts the plane in the x-y plane
      var pLocal = new THREE.Vector3(0.05, cutY, 0);
      root.updateMatrixWorld(true);
      var nW = nLocal.clone().transformDirection(root.matrixWorld);
      var pW = pLocal.clone().applyMatrix4(root.matrixWorld);
      planeSpec.setFromNormalAndCoplanarPoint(nW, pW);                              // keep above the cut (base side)
      planeSect.setFromNormalAndCoplanarPoint(nW.clone().negate(), pW);             // keep below the cut (apex side)
      cutPlane.position.set(0.05, cutY, 0);
      cutPlane.rotation.set(0, 0, -tau);
      return { cutY: cutY, tau: tau };
    }

    function applyVisibility() {
      specimen.visible = state.cut < 0.999;
      section.visible = state.cut > 0.001;
      cutPlane.visible = state.cut > 0.001 && state.cut < 0.999;
    }

    function updateScalpel(dt, t) {
      var cutting = state.cut > 0.001 && state.cut < 0.999;
      var tip = tmpP;
      if (cutting) {
        var cutY = ANATOMY.yApex + state.cut * (ANATOMY.yTop - ANATOMY.yApex);
        var saw = 0.22 * Math.sin(t * 5.5);
        tip.set(0.05 + saw - tilt * 0.01, cutY - tilt * 0.01 * saw, 0.40);          // on the front surface, following the cut line
        root.localToWorld(tip);
        scalpel.position.lerp(tip, 1 - Math.exp(-14 * dt));
        // handle toward viewer and up, edge facing the base (away)
        scalpel.rotation.x = ease(scalpel.rotation.x, Math.PI * 0.30, dt, 8);
        scalpel.rotation.y = ease(scalpel.rotation.y, 0.55, dt, 8);
        scalpel.rotation.z = ease(scalpel.rotation.z, 0, dt, 8);
      } else {
        var rest = state.cut >= 0.999 ? scalpelRest : scalpelRest;
        scalpel.position.lerp(rest, 1 - Math.exp(-6 * dt));
        scalpel.rotation.x = ease(scalpel.rotation.x, Math.PI / 2 - 0.03, dt, 6);
        scalpel.rotation.y = ease(scalpel.rotation.y, -0.5, dt, 6);
      }
    }

    function updateCallout(dt) {
      if (!state.last) { callout.visible = false; return; }
      var tgt = WALLS[state.last.region]; if (!tgt) return;
      callout.visible = true;
      tgt.getWorldPosition(tmpV);
      callout.position.set(tmpV.x, Math.max(0.2, tmpV.y) + 0.35, tmpV.z);
      var mm = state.last.value;
      cBar.scale.x = Math.max(0.1, mm / 10); cCapL.position.x = -mm / 20; cCapR.position.x = mm / 20;
      callout.scale.setScalar(1);
    }

    kit.update = kit.tick = function (dt, t) {
      dt = Math.min(dt || 0.016, 0.1);
      state.t = t == null ? state.t + dt : t;
      var before = state.cut;
      if (state.cut !== state.cutTarget) {
        var step = 0.26 * dt;                                            // ~3.8 s for a full sweep
        state.cut = state.cut < state.cutTarget ? Math.min(state.cutTarget, state.cut + step) : Math.max(state.cutTarget, state.cut - step * 3);
      }
      tilt = P.errors.slantCut ? SLANT_DEG : 0;
      setPlanes(); applyVisibility();
      if (section.userData.update) section.userData.update(dt, state.t);
      if (specimen.userData.update && specimen.visible) specimen.userData.update(dt, state.t);
      updateScalpel(dt, state.t);
      updateCallout(dt);
      if (!state.cutDone && state.cut >= 0.999 && before < 0.999) { state.cutDone = true; emit("cut", { cut: 1 }); }
      if (state.cut < 0.999) state.cutDone = false;
    };
    kit.userData.update = kit.update;

    kit.cut = function (to) { state.cutTarget = clamp(to == null ? 1 : +to, 0, 1); if (state.cutTarget < 0.999) state.cutDone = false; };
    kit.settle = function (sec) { var n = Math.ceil((sec || 4) / 0.05); for (var i = 0; i < n; i++) kit.update(0.05, state.t + 0.05); };
    kit.setState = function (st) {
      if (!st) return;
      if (st.errors) {
        P.errors = { slantCut: !!st.errors.slantCut, papillaryIncluded: !!st.errors.papillaryIncluded, shrunken: !!st.errors.shrunken };
        placeHeart(); state.counts = {}; state.done = {}; state.last = null;
      }
      if (st.length_cm != null) { P.length_cm = clamp(+st.length_cm, 4, 14); placeHeart(); }
      if (st.labels != null) labels.visible = !!st.labels;
      if (st.cut != null) { state.cutTarget = clamp(+st.cut, 0, 1); state.cut = state.cutTarget; state.cutDone = state.cut >= 0.999; }
      emit("state", { cut: state.cut, errors: P.errors });
    };
    kit.reset = function () { state.cutTarget = 0; state.cut = 0; state.counts = {}; state.done = {}; state.last = null; state.cutDone = false; callout.visible = false; emit("reset", {}); };

    kit.model = function (errors) { return model(errors || P.errors); };

    kit.measure = function (part) {
      var key = String(part || "").replace(/Wall$/, "");
      if (!TRUE[key]) return null;
      if (state.cut < 0.999) { emit("blocked", { reason: "cut the heart open first", region: key }); return null; }
      var m = model(P.errors)[key];
      var n = state.counts[key] || 0;
      var trial = Math.min(2, n + 1);
      state.counts[key] = trial;
      var value = trial === 1 ? m.r1 : m.r2;
      state.last = { region: key, trial: trial, value: value };
      setPill(cPill, NAMES[key] + " " + value.toFixed(1) + " mm");
      var res = { region: key, trial: trial, value: value, r1: m.r1, r2: trial === 2 ? m.r2 : null, mean: trial === 2 ? m.mean : null, pumpsTo: m.pumpsTo };
      emit("measure", res);
      if (n === 1 && !state.done[key]) {                   // second reading just taken
        state.done[key] = true; emit("region-done", res);
        if (ORDER.every(function (k) { return state.done[k]; })) emit("bench-done", kit.reading());
      }
      return res;
    };

    kit.reading = function () {
      var md = model(P.errors), last = state.last;
      var table = ORDER.map(function (k) {
        var c = state.counts[k] || 0;
        return { region: k, name: NAMES[k], r1: c >= 1 ? md[k].r1 : null, r2: c >= 2 ? md[k].r2 : null, mean: c >= 2 ? md[k].mean : null, pumpsTo: PUMPS[k] };
      });
      var errs = Object.keys(P.errors).filter(function (e) { return P.errors[e]; });
      return {
        region: last ? last.region : null,
        r1: last ? md[last.region].r1 : null,
        r2: last && last.trial === 2 ? md[last.region].r2 : null,
        mean: last && last.trial === 2 ? md[last.region].mean : null,
        pumpsTo: last ? PUMPS[last.region] : null,
        ratioLVRV: md.ratioLVRV,
        length_cm: r1(P.length_cm * (P.errors.shrunken ? 0.9 : 1)),
        cut: +state.cut.toFixed(3), cutDone: state.cut >= 0.999,
        errors: errs, table: table, complete: ORDER.every(function (k) { return state.done[k]; })
      };
    };

    kit.params = P;
    kit.group = kit; kit.parts = parts; kit.userData.parts = parts;
    kit.userData.setState = kit.setState;
    kit.userData.heart = { specimen: specimen, section: section };
    setPlanes(); applyVisibility();
    return kit;
  }

  /* ---------------------------------------------------------- scene helpers (same shape as the other benches) */
  function lights(scene) {
    scene.add(new THREE.HemisphereLight(0xdfe9ff, 0x4a3a2c, 0.9));
    var key = new THREE.DirectionalLight(0xfff1de, 2.1); key.position.set(18, 38, 26); scene.add(key);
    var fill = new THREE.DirectionalLight(0xbcd2ff, 0.7); fill.position.set(-22, 18, 10); scene.add(fill);
    var rim = new THREE.DirectionalLight(0xffffff, 0.8); rim.position.set(-6, 22, -30); scene.add(rim);
  }
  function environment(renderer) {
    var s = new THREE.Scene(); s.background = new THREE.Color(0x7a8794);
    var top = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.MeshBasicMaterial({ color: 0xffffff })); top.position.y = 20; top.rotation.x = Math.PI / 2; s.add(top);
    var pm = new THREE.PMREMGenerator(renderer); var rt = pm.fromScene(s, 0.04); pm.dispose(); return rt.texture;
  }
  function enableClipping(renderer) { if (renderer) renderer.localClippingEnabled = true; }
  function fit(camera, controls, aspect) {
    var tgt = new THREE.Vector3(0, 0, 1.2);
    var dist = aspect < 0.8 ? 34 : 28;
    var pitch = 55 * Math.PI / 180;
    camera.position.set(0, tgt.y + Math.sin(pitch) * dist, tgt.z + Math.cos(pitch) * dist);
    camera.lookAt(tgt); if (controls) { controls.target.copy(tgt); controls.update(); }
    camera.aspect = aspect; camera.updateProjectionMatrix();
  }

  global.DissectionBench = { version: 1, create: create, model: model, TRUE: TRUE, lights: lights, environment: environment, fit: fit, enableClipping: enableClipping, DEFAULTS: DEFAULTS };
  global.StudyPipeKits = global.StudyPipeKits || {};

  /* ---------------------------------------------------------- mountable kit (StudyPipeKits convention, used by demo.html) */
  global.StudyPipeKits["dissection-bench"] = {
    mount: function (container, params, host) {
      host = host || { emit: function () {} };
      container.style.cssText += ";display:flex;flex-direction:column;height:100%;background:#0e1620;color:#e8eef5;font:13px/1.35 system-ui,sans-serif";
      var stageBox = document.createElement("div"); stageBox.style.cssText = "flex:1 1 auto;min-height:200px;position:relative"; container.appendChild(stageBox);
      var canvas = document.createElement("canvas"); canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none"; stageBox.appendChild(canvas);
      var panel = document.createElement("div"); panel.style.cssText = "flex:0 0 auto;padding:6px 8px 8px;background:#101a26;border-top:1px solid rgba(255,255,255,.12)"; container.appendChild(panel);
      var readout = document.createElement("div"); readout.className = "bench-readout"; readout.style.cssText = "font:12px/1.35 ui-monospace,Menlo,monospace;padding:4px 6px 6px;min-height:78px;white-space:pre-wrap"; panel.appendChild(readout);
      var row = document.createElement("div"); row.style.cssText = "display:flex;flex-wrap:wrap;gap:5px"; panel.appendChild(row);

      var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: false });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.localClippingEnabled = true;
      var scene = new THREE.Scene(); scene.background = new THREE.Color(0x0e1620);
      scene.environment = environment(renderer); lights(scene);
      var camera = new THREE.PerspectiveCamera(36, 1, 0.5, 400);
      var controls = new THREE.OrbitControls(camera, canvas); controls.enablePan = false; controls.enableDamping = true; controls.minDistance = 12; controls.maxDistance = 90; controls.maxPolarAngle = Math.PI * 0.47;
      var kit = create(params || {}); scene.add(kit);
      kit.onEvent = function (n, d) { host.emit(n, d); refresh(); };
      window.__kit = kit; window.__cam = camera; window.__controls = controls;

      function btn(label, fn) { var b = document.createElement("button"); b.textContent = label; b.style.cssText = "min-height:44px;padding:0 10px;border-radius:22px;border:0;background:#1f5e8c;color:#fff;font:600 12px system-ui;cursor:pointer"; b.addEventListener("click", function () { fn(b); refresh(); }); row.appendChild(b); return b; }
      btn("Cut section", function () { kit.cut(1); });
      ["ra", "la", "rv", "lv", "septum"].forEach(function (k) { btn("Measure " + NAMES[k], function () { kit.measure(k); }); });
      btn("Slant cut", function (b) { var on = !kit.params.errors.slantCut; kit.setState({ errors: { slantCut: on, papillaryIncluded: kit.params.errors.papillaryIncluded, shrunken: kit.params.errors.shrunken } }); });
      btn("Shrunken", function () { var e = kit.params.errors; kit.setState({ errors: { slantCut: e.slantCut, papillaryIncluded: e.papillaryIncluded, shrunken: !e.shrunken } }); });
      btn("Papilla", function () { var e = kit.params.errors; kit.setState({ errors: { slantCut: e.slantCut, papillaryIncluded: !e.papillaryIncluded, shrunken: e.shrunken } }); });
      btn("Reset", function () { kit.reset(); });

      function refresh() {
        var r = kit.reading();
        var lines = ["cut " + Math.round(r.cut * 100) + "%  | length " + r.length_cm.toFixed(1) + " cm | errors: " + (r.errors.join(", ") || "none")];
        r.table.forEach(function (t) { lines.push(t.name + (t.r1 != null ? "  " + t.r1.toFixed(1) : "") + (t.r2 != null ? " / " + t.r2.toFixed(1) + " -> mean " + t.mean.toFixed(1) + " mm, pumps to " + t.pumpsTo : "")); });
        lines.push("LV : RV = " + r.ratioLVRV.toFixed(1));
        readout.textContent = lines.join("\n");
      }
      function resize() {
        var w = stageBox.clientWidth || 360, h = stageBox.clientHeight || 400;
        renderer.setSize(w, h, false); fit(camera, controls, w / h);
      }
      window.addEventListener("resize", resize); resize(); refresh();
      var last = performance.now();
      (function loop(now) { var dt = Math.min(0.05, (now - last) / 1000); last = now; kit.update(dt, now / 1000); controls.update(); refresh(); renderer.render(scene, camera); requestAnimationFrame(loop); })(last);
      return kit;
    }
  };
})(window);
