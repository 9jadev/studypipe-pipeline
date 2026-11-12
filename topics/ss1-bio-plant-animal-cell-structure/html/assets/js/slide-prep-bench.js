/* =========================================================
   StudyPipe · SlidePrepBench v1 — wet-mount slide preparation bench (onion epidermis + cheek cells)
   Classic script (no modules), fully offline, needs window.THREE (three.js r160 bundle). No SceneKit dependency.

   Units: 1 scene unit = 1 cm.   Y is up.   Bench top at y = 0.

   API
     var kit = SlidePrepBench.create({ specimen, stain, coverslipAngle_deg, folded, view, labels });
     scene.add(kit);                    // kit is a THREE.Group
     kit.parts      -> { name: Object3D }  (also kit.userData.parts)
     kit.update(dt, t)  (also kit.tick)    call every frame
     kit.setState(obj)                      any of the params above, plus step (0..5)
     kit.setStep(n) / kit.nextStep() / kit.play() / kit.pause() / kit.reset()
     kit.reading()                          computed from the model (never typed text)
     kit.onEvent = function (name, detail)  'step' | 'mounted' | 'state'
   Also: SlidePrepBench.environment(renderer), SlidePrepBench.lights(scene), SlidePrepBench.fit(camera, controls, aspect)

   Parts (userData.partId set): slide, stage, drop, film, specimen, peel, scale, bulb, coverslip, needle,
     forceps, spatula, smear, iodine, methylene, salt, disinfectant, bubbles, view
   ========================================================= */
(function (global) {
  "use strict";
  var THREE = global.THREE;
  if (!THREE) return;

  var TAU = Math.PI * 2;
  var SLIDE_TOP = 0.42;          // top surface of the glass slide (tile 0.30 + slide 0.12)
  var SLIDE_Z = 3.2;             // slide centre z
  var CS = 2.2;                  // cover slip side (22 x 22 mm)

  /* ---------------------------------------------------------- helpers */
  function rng(seed) { var a = seed >>> 0; return function () { a += 0x6D2B79F5; var t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function sstep(a, b, x) { var t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); }
  function ease(cur, tar, dt, rate) { return cur + (tar - cur) * (1 - Math.exp(-rate * dt)); }
  function ctex(w, h, draw, linear) {
    var c = document.createElement("canvas"); c.width = w; c.height = h;
    draw(c.getContext("2d"), w, h);
    var t = new THREE.CanvasTexture(c);
    if (!linear) t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4; t.wrapS = t.wrapT = THREE.RepeatWrapping;
    return t;
  }
  function std(color, rough, metal, extra) {
    var m = new THREE.MeshStandardMaterial({ color: color, roughness: rough == null ? 0.5 : rough, metalness: metal || 0 });
    if (extra) for (var k in extra) m[k] = extra[k];
    return m;
  }
  function glass(color, opacity, rough) {
    return new THREE.MeshStandardMaterial({ color: color, roughness: rough == null ? 0.08 : rough, metalness: 0.05, transparent: true, opacity: opacity, depthWrite: false, side: THREE.DoubleSide, envMapIntensity: 1.6 });
  }
  function liquid(color, opacity) {
    return new THREE.MeshStandardMaterial({ color: color, roughness: 0.05, metalness: 0, transparent: true, opacity: opacity, depthWrite: false, side: THREE.DoubleSide });
  }
  function tag(obj, id) { obj.userData.partId = id; return obj; }
  function lathe(pts, seg) {
    var v = pts.map(function (p) { return new THREE.Vector2(p[0], p[1]); });
    var g = new THREE.LatheGeometry(v, seg || 40); g.computeVertexNormals(); return g;
  }
  function rrShape(w, d, r) {
    var s = new THREE.Shape(), x = -w / 2, y = -d / 2;
    s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + d - r); s.quadraticCurveTo(x + w, y + d, x + w - r, y + d);
    s.lineTo(x + r, y + d); s.quadraticCurveTo(x, y + d, x, y + d - r);
    s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s;
  }
  /* rounded slab: width w (x), depth d (z), height h (y), sitting on y = 0 */
  function slab(w, d, h, r, bevel) {
    var b = Math.min(bevel == null ? h * 0.18 : bevel, h * 0.45);
    var g = new THREE.ExtrudeGeometry(rrShape(w - 2 * b, d - 2 * b, Math.max(0.01, r - b)), { depth: h - 2 * b, bevelEnabled: true, bevelThickness: b, bevelSize: b, bevelSegments: 2, curveSegments: 6 });
    g.rotateX(-Math.PI / 2); g.translate(0, b, 0); g.computeVertexNormals(); return g;
  }
  function labelTex(lines, o) {
    o = o || {};
    return ctex(o.w || 256, o.h || 128, function (g, w, h) {
      g.fillStyle = o.bg || "#f4efe2"; g.fillRect(0, 0, w, h);
      g.strokeStyle = o.rule || "rgba(60,40,20,.55)"; g.lineWidth = 4; g.strokeRect(6, 6, w - 12, h - 12);
      g.fillStyle = o.fg || "#2b2118"; g.textAlign = "center"; g.textBaseline = "middle";
      var n = lines.length;
      lines.forEach(function (ln, i) { g.font = (i === 0 ? "bold " : "") + (o.size || 34) + "px Arial, sans-serif"; g.fillText(ln, w / 2, h * (i + 1) / (n + 1)); });
    });
  }
  function pill(text, h) {
    var c = document.createElement("canvas"); c.width = 256; c.height = 64; var g = c.getContext("2d");
    g.fillStyle = "rgba(10,15,29,.88)"; g.beginPath(); g.moveTo(14, 0); g.arcTo(256, 0, 256, 64, 24); g.arcTo(256, 64, 0, 64, 24); g.arcTo(0, 64, 0, 0, 24); g.arcTo(0, 0, 256, 0, 24); g.fill();
    g.fillStyle = "#fff"; g.font = "bold 28px Arial, sans-serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(text, 128, 34);
    var t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
    var s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthTest: false, depthWrite: false }));
    s.scale.set(h * 4, h, 1); s.renderOrder = 20; return s;
  }

  /* ---------------------------------------------------------- stain / specimen model */
  var STAINS = {
    iodine:   { name: "iodine solution", colour: "yellow-brown", css: "#b9791f", liq: 0xa65a14, drop: 0xc88a2c, wall: "#7a5420", tint: "rgba(222,160,58,.42)", nuc: "rgba(122,66,10,.95)", contrast: 0.9 },
    methylene:{ name: "methylene blue",  colour: "blue",         css: "#2a45c0", liq: 0x16309e, drop: 0x3050d0, wall: "#2a3a8c", tint: "rgba(70,100,215,.34)", nuc: "rgba(24,36,150,.95)", contrast: 1.0 },
    none:     { name: "water only",      colour: "none",         css: "#9aa6ad", liq: 0xcfe6ee, drop: 0xdcecf2, wall: "#8d8d8d", tint: "rgba(255,255,255,0)",   nuc: null,                  contrast: 0.12 },
    salt:     { name: "strong salt solution", colour: "none",    css: "#b8c6cc", liq: 0xd8e6ea, drop: 0xe0eef0, wall: "#8d8d8d", tint: "rgba(255,255,255,0)",   nuc: null,                  contrast: 0.2 }
  };
  var FIELD_UM = { 100: 1600, 400: 400 };

  function model(p) {
    var st = STAINS[p.stain] || STAINS.none;
    var onion = p.specimen === "onion";
    var a = +p.coverslipAngle_deg;
    var bubbles = a >= 30 ? 0 : Math.min(8, 1 + Math.floor((30 - a) / 4));
    var layers = p.folded ? 2 : 1;
    var stained = p.stain === "iodine" || p.stain === "methylene";
    var contrast = st.contrast;
    if (stained && ((p.stain === "iodine" && !onion))) contrast = 0.4;   // iodine suits starch / onion; cheek is pale
    var plasmolysed = onion && p.stain === "salt";
    var crenated = !onion && p.stain === "salt";
    var nucleusVisible = stained && contrast >= 0.3;
    var faults = [];
    if (bubbles) faults.push("air-bubbles");
    if (p.folded) faults.push("folded-peel");
    if (!stained && !plasmolysed && !crenated) faults.push("no-stain");
    if (plasmolysed) faults.push("plasmolysed");
    if (crenated) faults.push("crenated");
    var wUm = onion ? 50 : 60;
    return {
      specimen: p.specimen, stain: p.stain, stain_colour: st.colour, angle_deg: a,
      bubbles: bubbles, layers: layers, nucleusVisible: nucleusVisible, contrast: +contrast.toFixed(2),
      cellWall: onion, nucleusPosition: onion ? "side" : "central", vacuoleVisible: onion,
      plasmolysed: plasmolysed, crenated: crenated, faults: faults,
      quality: faults.length === 0 ? "good" : "poor",
      view: p.view, magnification: p.view, field_um: FIELD_UM[p.view], width_um: wUm,
      cells_across: Math.round(FIELD_UM[p.view] / wUm * 10) / 10
    };
  }

  /* ---------------------------------------------------------- shared textures (built once) */
  var TEX = null;
  function textures() {
    if (TEX) return TEX;
    var R = rng(11);
    TEX = {};
    TEX.wood = ctex(512, 512, function (g, w, h) {
      g.fillStyle = "#9a6a38"; g.fillRect(0, 0, w, h);
      for (var i = 0; i < 160; i++) {
        var y = R() * h, a = 0.05 + R() * 0.14, dark = R() > 0.45;
        g.strokeStyle = dark ? "rgba(70,38,12," + a + ")" : "rgba(225,175,110," + a + ")";
        g.lineWidth = 0.6 + R() * 2.4; g.beginPath(); g.moveTo(0, y);
        for (var x = 0; x <= w; x += 64) g.lineTo(x, y + Math.sin(x * 0.012 + i) * (3 + R() * 5));
        g.stroke();
      }
      for (var k = 0; k < 3; k++) { var cx = R() * w, cy = R() * h; g.strokeStyle = "rgba(60,30,8,.2)"; for (var r = 4; r < 22; r += 4) { g.beginPath(); g.ellipse(cx, cy, r * 2.4, r, 0, 0, TAU); g.stroke(); } }
    });
    TEX.wood.repeat.set(2, 1.4);
    TEX.skin = ctex(256, 256, function (g, w, h) {      // dry onion skin: copper paper streaks (u = around, v = along)
      g.fillStyle = "#a9672a"; g.fillRect(0, 0, w, h);
      for (var i = 0; i < 90; i++) {
        var x = R() * w, a = 0.08 + R() * 0.22;
        g.strokeStyle = R() > 0.5 ? "rgba(235,170,80," + a + ")" : "rgba(80,38,10," + a + ")";
        g.lineWidth = 0.8 + R() * 3; g.beginPath(); g.moveTo(x, 0); g.bezierCurveTo(x + 12 * (R() - 0.5), h * 0.33, x + 16 * (R() - 0.5), h * 0.66, x + 8 * (R() - 0.5), h); g.stroke();
      }
    });
    TEX.skin.repeat.set(2, 1);
    TEX.flesh = ctex(256, 128, function (g, w, h) {      // fleshy scale: pale, fine parallel veins
      g.fillStyle = "#efe9d2"; g.fillRect(0, 0, w, h);
      for (var i = 0; i < 70; i++) { g.strokeStyle = "rgba(150,170,100," + (0.1 + R() * 0.18) + ")"; g.lineWidth = 0.6 + R(); g.beginPath(); var x = R() * w; g.moveTo(x, 0); g.lineTo(x + (R() - 0.5) * 6, h); g.stroke(); }
    });
    TEX.tile = ctex(256, 256, function (g, w, h) {
      g.fillStyle = "#f3f5f4"; g.fillRect(0, 0, w, h);
      for (var i = 0; i < 400; i++) { g.fillStyle = "rgba(160,170,170," + R() * 0.05 + ")"; g.fillRect(R() * w, R() * h, 2, 2); }
    });
    TEX.steel = ctex(128, 128, function (g, w, h) {
      g.fillStyle = "#b6bcc4"; g.fillRect(0, 0, w, h);
      for (var i = 0; i < 60; i++) { g.strokeStyle = "rgba(" + (R() > 0.5 ? "255,255,255" : "80,90,100") + "," + R() * 0.25 + ")"; g.lineWidth = 0.7; var y = R() * h; g.beginPath(); g.moveTo(0, y); g.lineTo(w, y + (R() - 0.5) * 3); g.stroke(); }
    });
    TEX.grad = ctex(64, 256, function (g, w, h) {         // beaker graduations (alpha used as colour on transparent plane)
      g.clearRect(0, 0, w, h); g.strokeStyle = "rgba(255,255,255,.9)"; g.fillStyle = "rgba(255,255,255,.95)"; g.font = "bold 14px Arial";
      for (var i = 0; i <= 10; i++) { var y = h - 12 - i * (h - 28) / 10; g.lineWidth = i % 5 === 0 ? 3 : 1.5; g.beginPath(); g.moveTo(0, y); g.lineTo(i % 5 === 0 ? 24 : 14, y); g.stroke(); if (i % 5 === 0 && i) g.fillText(String(i * 25), 28, y + 5); }
    }, true);
    return TEX;
  }
  function frostTex(letter) {
    return ctex(128, 128, function (g, w, h) {
      g.fillStyle = "#e9eef0"; g.fillRect(0, 0, w, h);
      var R = rng(5); for (var i = 0; i < 700; i++) { g.fillStyle = "rgba(170,185,190," + R() * 0.18 + ")"; g.fillRect(R() * w, R() * h, 2, 2); }
      g.fillStyle = "rgba(60,60,70,.78)"; g.font = "bold 70px Arial"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(letter, w / 2, h / 2 + 4);
    });
  }

  /* ---------------------------------------------------------- apparatus builders */
  function buildBench() {
    var T = textures(), g = new THREE.Group();
    var top = new THREE.Mesh(slab(25, 31, 1.2, 0.5, 0.15), std(0xffffff, 0.7, 0, { map: T.wood }));
    top.position.set(0, -1.2, 1.5); top.receiveShadow = true; g.add(top);
    return g;
  }

  function buildTile(w, d) {
    var T = textures();
    var m = new THREE.Mesh(slab(w, d, 0.3, 0.45, 0.07), std(0xffffff, 0.22, 0, { map: T.tile }));
    return m;
  }

  function buildSlide() {
    var g = new THREE.Group(), T = textures();
    var body = new THREE.Mesh(slab(7.6, 2.6, 0.12, 0.05, 0.03), glass(0xa8dcd6, 0.5, 0.04)); g.add(body);
    var eg = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(7.6, 0.12, 2.6)), new THREE.LineBasicMaterial({ color: 0x2f7f78, transparent: true, opacity: 0.9 })); g.add(eg);
    var f = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 2.5), std(0xffffff, 0.9, 0, { map: frostTex("A"), transparent: true, opacity: 0.96 }));
    f.rotation.x = -Math.PI / 2; f.position.set(-2.8, 0.121, 0); g.add(f);
    g.userData.frost = f;
    return { group: g, body: body, frost: f };
  }

  function buildCoverSlip() {      // pivot at hinge edge (x = 0), body extends along +x
    var g = new THREE.Group();
    var m = new THREE.Mesh(slab(CS, CS, 0.02, 0.02, 0.006), glass(0xcdeee8, 0.5, 0.03));
    m.position.set(CS / 2, 0, 0); g.add(m);
    var edge = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(CS, 0.02, CS)), new THREE.LineBasicMaterial({ color: 0xe8fffb, transparent: true, opacity: 1 }));
    edge.position.set(CS / 2, 0.01, 0); g.add(edge);
    g.userData.mesh = m;
    return g;
  }

  function buildNeedle() {      // mounted needle: wooden handle (lathe) + steel needle; origin = needle point, axis along +x
    var g = new THREE.Group(), T = textures();
    var steel = new THREE.Mesh(lathe([[0, 0], [0.012, 0.0], [0.03, 2.2], [0.03, 5]], 10), std(0xdfe3e8, 0.25, 0.6));
    steel.rotation.z = -Math.PI / 2; g.add(steel);
    var ferrule = new THREE.Mesh(lathe([[0, 0], [0.07, 0], [0.12, 0.2], [0.12, 1.0], [0.08, 1.15], [0, 1.15]], 14), std(0xcfd4da, 0.25, 0.9, { map: T.steel }));
    ferrule.rotation.z = -Math.PI / 2; ferrule.position.x = 4.9; g.add(ferrule);
    var handle = new THREE.Mesh(lathe([[0, 0], [0.12, 0], [0.2, 0.6], [0.25, 3.0], [0.3, 6.0], [0.32, 8.2], [0.22, 8.6], [0, 8.65]], 18), std(0xc89a62, 0.6, 0, { map: T.wood }));
    handle.rotation.z = -Math.PI / 2; handle.position.x = 6.0; g.add(handle);
    return g;
  }

  function buildForceps() {      // fine forceps: tip at origin, blades extend along +z, slightly raised
    var g = new THREE.Group(), T = textures();
    function blade(sign) {
      var s = new THREE.Shape();
      s.moveTo(0, 0); s.lineTo(0.28, 0); s.lineTo(0.5, 2.0); s.lineTo(0.6, 9.5); s.lineTo(0.0, 9.5); s.lineTo(0, 0);
      var geo = new THREE.ExtrudeGeometry(s, { depth: 0.05, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.012, bevelSegments: 1 });
      geo.rotateX(Math.PI / 2);          // length -> +z, thickness -> -y
      geo.translate(0, 0.025, 0);
      var m = new THREE.Mesh(geo, std(0xc9ced6, 0.3, 0.55, { map: T.steel }));
      m.scale.x = sign; m.position.x = sign * 0.02; return m;
    }
    var l = blade(1), r = blade(-1); g.add(l); g.add(r);
    // spring bow joining the blades at the rear
    var bow = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(0.58, 0, 9.4), new THREE.Vector3(0.45, 0, 10.2), new THREE.Vector3(0, 0, 10.6), new THREE.Vector3(-0.45, 0, 10.2), new THREE.Vector3(-0.58, 0, 9.4)]), 20, 0.05, 8), std(0xc9ced6, 0.25, 0.9));
    g.add(bow);
    g.userData.blades = [l, r];
    return g;
  }

  function buildSpatula() {      // steel micro-spatula: blade tip at origin, handle along +z
    var g = new THREE.Group(), T = textures();
    var s = new THREE.Shape();
    s.moveTo(0, 0); s.quadraticCurveTo(0.5, 0, 0.5, 0.5); s.lineTo(0.5, 2.2); s.lineTo(0.12, 3.3); s.lineTo(-0.12, 3.3); s.lineTo(-0.5, 2.2); s.lineTo(-0.5, 0.5); s.quadraticCurveTo(-0.5, 0, 0, 0);
    var geo = new THREE.ExtrudeGeometry(s, { depth: 0.06, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 2 });
    geo.rotateX(Math.PI / 2); geo.translate(0, 0.03, 0);
    var blade = new THREE.Mesh(geo, std(0xdde1e6, 0.25, 0.6, { map: T.steel })); g.add(blade);
    var shaft = new THREE.Mesh(lathe([[0, 0], [0.09, 0], [0.13, 1], [0.13, 5.5], [0.09, 6], [0, 6]], 10), std(0xcfd4da, 0.2, 0.9));
    shaft.rotation.x = Math.PI / 2; shaft.position.z = 3.1; g.add(shaft);
    var hp = []; for (var i = 0; i <= 24; i++) { var t = i / 24; hp.push([0.2 + 0.2 * Math.sin(Math.PI * Math.pow(t, 0.8)) + (i % 3 === 0 ? 0.03 : 0), t * 5.6]); }
    hp.unshift([0, 0]); hp.push([0, 5.6]);
    var handle = new THREE.Mesh(lathe(hp, 14), std(0x2a6d8f, 0.45, 0.2));
    handle.rotation.x = Math.PI / 2; handle.position.z = 8.6; g.add(handle);
    return { group: g, blade: blade };
  }

  function dropperBottle(opts) {
    var T = textures(), g = new THREE.Group(), R = 1.15;
    // glass bottle: one closed profile (outer wall up, lip, inner wall down)
    var prof = [[0, 0], [R * 0.78, 0], [R * 0.95, 0.12], [R, 0.4], [R, 3.1], [R * 0.9, 3.7], [R * 0.52, 4.15], [R * 0.45, 4.55], [R * 0.5, 4.62], [R * 0.5, 5.0],
      [R * 0.56, 5.05], [R * 0.56, 5.15], [R * 0.44, 5.2], [R * 0.44, 4.55], [R * 0.4, 4.5], [R * 0.45, 4.1], [R * 0.84, 3.65], [R * 0.93, 3.1], [R * 0.93, 0.5], [R * 0.7, 0.22], [0, 0.22]];
    var body = new THREE.Mesh(lathe(prof, 36), glass(opts.glassColor, opts.glassOpacity, 0.05)); g.add(body);
    var liqH = 2.3;
    var liq = new THREE.Mesh(lathe([[0, 0.24], [R * 0.68, 0.24], [R * 0.91, 0.55], [R * 0.91, liqH], [R * 0.86, liqH + 0.04], [0, liqH - 0.05]], 28), liquid(opts.liq, opts.liqOpacity)); g.add(liq);
    var lab = new THREE.Mesh(new THREE.CylinderGeometry(R * 1.012, R * 1.012, 1.55, 28, 1, true, -1.15, 2.3), std(0xffffff, 0.7, 0, { map: labelTex(opts.label, { size: 30, w: 256, h: 128, bg: "#f6f1e4" }), side: THREE.FrontSide }));
    lab.position.y = 1.55; lab.rotation.y = 0; g.add(lab);
    // dropper assembly (own group, origin = pipette tip)
    var d = new THREE.Group();
    var pipe = new THREE.Mesh(lathe([[0.0, 0], [0.04, 0], [0.09, 0.3], [0.2, 2.2], [0.24, 4.8], [0.17, 4.8], [0.12, 2.2], [0.04, 0.35], [0, 0.0]], 12), glass(0xe8f4f6, 0.45, 0.04)); d.add(pipe);
    var fill = new THREE.Mesh(lathe([[0, 0.02], [0.03, 0.05], [0.07, 0.3], [0.14, 2.0], [0.18, 3.0], [0, 3.0]], 10), liquid(opts.liq, 0.9)); d.add(fill);
    var collar = new THREE.Mesh(lathe([[0.0, 4.6], [0.62, 4.6], [0.66, 4.7], [0.66, 5.35], [0.5, 5.45], [0.34, 5.5], [0, 5.5]], 20), std(0x23262c, 0.55, 0.1)); d.add(collar);
    var teat = new THREE.Mesh(lathe([[0, 5.45], [0.34, 5.45], [0.34, 5.7], [0.5, 6.4], [0.52, 7.2], [0.36, 7.9], [0, 8.05]], 20), std(0x151619, 0.7, 0)); d.add(teat);
    var dropMesh = new THREE.Mesh(lathe([[0, 0], [0.04, 0.03], [0.1, 0.14], [0.12, 0.25], [0.09, 0.36], [0.03, 0.44], [0, 0.48]], 10), liquid(opts.dropColor, 0.85)); dropMesh.visible = false; d.add(dropMesh);
    g.add(d);
    // resting pose: pipette inside the bottle, collar on neck
    d.position.set(0, 0.6, 0);
    return { group: g, dropper: d, teat: teat, drop: dropMesh, fill: fill, bottle: body, liq: liq, height: 5.5 };
  }

  function buildBeaker() {
    var T = textures(), g = new THREE.Group(), R = 2.35, H = 6.0;
    var prof = [[0, 0], [R - 0.35, 0], [R - 0.12, 0.06], [R, 0.4], [R, H], [R + 0.1, H + 0.06], [R + 0.1, H + 0.12], [R - 0.12, H + 0.02], [R - 0.12, 0.5], [R - 0.3, 0.2], [0, 0.16]];
    var wall = new THREE.Mesh(lathe(prof, 48), glass(0xe5f4f2, 0.3, 0.04)); g.add(wall);
    var lh = 4.4, pts = [[0, 0.17], [R - 0.3, 0.2]];
    for (var i = 0; i <= 8; i++) { var t = i / 8, r = R - 0.13 + 0 * t; pts.push([R - 0.13, lerp(0.5, lh, t)]); }
    pts.push([R - 0.14, lh + 0.12]); pts.push([R - 0.6, lh + 0.02]); pts.push([0, lh - 0.04]);   // meniscus
    var liq = new THREE.Mesh(lathe(pts, 40), liquid(0xd2eaa0, 0.34)); g.add(liq);
    var grad = new THREE.Mesh(new THREE.CylinderGeometry(R + 0.015, R + 0.015, 5.2, 36, 1, true, 0.5, 1.2), new THREE.MeshBasicMaterial({ map: textures().grad, transparent: true, depthWrite: false, opacity: 0.9, side: THREE.FrontSide }));
    grad.position.y = 3.3; g.add(grad);
    var lab = new THREE.Mesh(new THREE.CylinderGeometry(R + 0.02, R + 0.02, 1.5, 36, 1, true, -1.55, 1.1), std(0xffffff, 0.7, 0, { map: labelTex(["DISINFECTANT"], { size: 25, w: 256, h: 96, bg: "#fff3d6", rule: "rgba(190,60,30,.8)", fg: "#b3321a" }) }));
    lab.position.y = 2.9; g.add(lab);
    g.userData.R = R; g.userData.H = H;
    return g;
  }

  function buildBulb() {      // whole onion bulb: lathe silhouette + ridge deformation + root plexus + dry neck
    var T = textures(), g = new THREE.Group(), Rr = 2.5, Hh = 5.4, pts = [];
    for (var i = 0; i <= 46; i++) {
      var t = i / 46, s = Math.pow(t, 0.78), r = Rr * Math.pow(Math.sin(Math.PI * s), 0.62);
      if (t > 0.72) r *= 1 - 0.55 * sstep(0.72, 1, t) * 0.0 - 0.0; // keep silhouette smooth; neck handled by profile power
      if (t < 0.03) r = Math.max(r, 0.35);
      pts.push([r, t * Hh]);
    }
    pts[pts.length - 1][0] = 0.05;
    var geo = lathe(pts, 56);
    var p = geo.attributes.position;
    for (var k = 0; k < p.count; k++) {
      var x = p.getX(k), y = p.getY(k), z = p.getZ(k), th = Math.atan2(z, x), ty = y / Hh;
      var m = 1 + 0.03 * Math.sin(th * 9 + ty * 4) * Math.sin(Math.PI * ty) + 0.018 * Math.sin(th * 17 - ty * 9);
      p.setX(k, x * m); p.setZ(k, z * m);
    }
    geo.computeVertexNormals();
    var skin = new THREE.Mesh(geo, std(0xffffff, 0.78, 0, { map: T.skin })); skin.position.y = 0; g.add(skin);
    var rm = std(0xe9dfc6, 0.9), R = rng(21);
    for (var j = 0; j < 22; j++) {
      var a = R() * TAU, rr = 0.15 + R() * 0.3;
      var c = new THREE.CatmullRomCurve3([new THREE.Vector3(Math.cos(a) * rr, 0.1, Math.sin(a) * rr), new THREE.Vector3(Math.cos(a) * (rr + 0.35), -0.3, Math.sin(a) * (rr + 0.35)), new THREE.Vector3(Math.cos(a + 0.4) * (rr + 0.8), -0.55 - R() * 0.4, Math.sin(a + 0.4) * (rr + 0.8))]);
      g.add(new THREE.Mesh(new THREE.TubeGeometry(c, 6, 0.018, 5), rm));
    }
    // dry papery neck tip
    var tip = new THREE.Mesh(lathe([[0, 0], [0.09, 0], [0.14, 0.5], [0.05, 0.9], [0, 1.0]], 8), std(0x8a5a26, 0.8)); tip.position.y = Hh - 0.05; g.add(tip);
    g.userData.height = Hh;
    return g;
  }

  function buildScale(len) {      // one fleshy scale, concave side up; peel patch is lifted from the concave face
    var T = textures(), R = 3.0, th = 0.32, sh = new THREE.Shape(), N = 14, a0 = 0.95;
    for (var i = 0; i <= N; i++) { var f = -a0 + 2 * a0 * i / N; var x = R * Math.sin(f), y = R - R * Math.cos(f); if (i === 0) sh.moveTo(x, y); else sh.lineTo(x, y); }
    var r2 = R - th;
    for (var j = N; j >= 0; j--) { var f2 = -a0 + 2 * a0 * j / N; sh.lineTo(r2 * Math.sin(f2), R - r2 * Math.cos(f2)); }
    var geo = new THREE.ExtrudeGeometry(sh, { depth: len, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 1, curveSegments: 4 });
    geo.translate(0, 0, -len / 2); geo.computeVertexNormals();
    var m = new THREE.Mesh(geo, std(0xffffff, 0.55, 0, { map: T.flesh }));
    m.userData.R = R; m.userData.th = th;
    return m;
  }

  /* ---------------------------------------------------------- eyepiece view (CanvasTexture) */
  function drawView(cv, rd, mounted) {
    var S = 512, g = cv.getContext("2d"), st = STAINS[rd.stain] || STAINS.none, C = S / 2;
    g.save(); g.clearRect(0, 0, S, S);
    g.beginPath(); g.arc(C, C, C - 4, 0, TAU); g.clip();
    var bg = g.createRadialGradient(C, C, 20, C, C, C);
    bg.addColorStop(0, "#fbf8ef"); bg.addColorStop(1, "#ece6d6"); g.fillStyle = bg; g.fillRect(0, 0, S, S);
    if (!mounted) {
      g.fillStyle = "rgba(60,60,70,.55)"; g.font = "bold 30px Arial"; g.textAlign = "center"; g.textBaseline = "middle";
      g.fillText("mount the slide", C, C - 12); g.fillText("to see the view", C, C + 26);
      finishView(g, S, rd); g.restore(); return;
    }
    var pxum = S / rd.field_um * 0.96;
    var R = rng(rd.specimen === "onion" ? 31 : 77);
    var cw = rd.width_um * pxum, onion = rd.specimen === "onion", al = Math.max(0.12, rd.contrast);
    function onionLayer(dx, dy, alphaMul) {
      var L = 250 * pxum, W = 50 * pxum, rr = rng(31), cols = Math.ceil(S / W) + 2, rows;
      g.save(); g.translate(dx, dy); g.globalAlpha = alphaMul;
      for (var c = -1; c < cols; c++) {
        var off = -rr() * L, x = c * W;
        for (var y = off; y < S + L; y += L) {
          var pad = Math.max(1.2, W * 0.1);
          g.fillStyle = rd.plasmolysed ? "rgba(255,255,255,.35)" : st.tint; g.fillRect(x, y, W, L);
          if (!rd.plasmolysed) {
            g.fillStyle = "rgba(250,246,230," + (0.55 * al + 0.3) + ")"; g.fillRect(x + pad * 1.4, y + pad * 1.4, W - pad * 2.8, L - pad * 2.8);   // large vacuole
          } else {
            var sh = 0.34; g.fillStyle = "rgba(170,120,170,.45)";
            g.beginPath(); roundRect(g, x + W * (0.5 - sh), y + L * (0.5 - sh * 1.4), W * sh * 2, L * sh * 2.8, W * 0.2); g.fill();
          }
          g.strokeStyle = rd.stain === "none" || rd.stain === "salt" ? "rgba(110,110,110,.5)" : st.wall; g.lineWidth = Math.max(1, W * 0.07);
          g.strokeRect(x, y, W, L);
          if (rd.nucleusVisible && st.nuc) {
            var nr = Math.max(2, 7.5 * pxum), side = rr() > 0.5 ? 1 : -1;
            g.fillStyle = st.nuc; g.beginPath(); g.ellipse(x + W / 2 + side * (W / 2 - nr - pad * 1.6), y + L * (0.25 + rr() * 0.5), nr, nr * 1.1, 0, 0, TAU); g.fill();
          } else rr();
        }
      }
      g.restore();
    }
    function cheekLayer(dx, dy, alphaMul) {
      var sz = rd.width_um * pxum, step = sz * 1.5, rr = rng(77);
      g.save(); g.translate(dx, dy); g.globalAlpha = alphaMul;
      for (var gy = -step; gy < S + step; gy += step) for (var gx = -step; gx < S + step; gx += step) {
        var cx = gx + (rr() - 0.5) * step * 0.75, cy = gy + (rr() - 0.5) * step * 0.75, rad = sz * (0.4 + rr() * 0.12), rot = rr() * TAU;
        g.beginPath();
        var NP = rd.crenated ? 20 : 18;
        for (var a = 0; a <= NP; a++) {
          var ang = rot + a / NP * TAU, rk = rd.crenated ? rad * (0.62 + 0.3 * (a % 2)) : rad * (0.9 + 0.1 * Math.sin(ang * 2 + cx));
          var x = cx + Math.cos(ang) * rk * 1.12, y = cy + Math.sin(ang) * rk * 0.92;
          if (a === 0) g.moveTo(x, y); else g.lineTo(x, y);
        }
        g.closePath();
        g.fillStyle = rd.stain === "none" || rd.stain === "salt" ? "rgba(235,235,235,.35)" : st.tint; g.fill();
        g.strokeStyle = rd.stain === "none" || rd.stain === "salt" ? "rgba(90,90,90,.75)" : st.wall; g.globalAlpha = alphaMul * (rd.stain === "none" || rd.stain === "salt" ? 0.8 : 0.35 + 0.5 * al); g.lineWidth = Math.max(1, sz * 0.05); g.stroke(); g.globalAlpha = alphaMul;
        if (rd.nucleusVisible && st.nuc) { var nr = Math.max(2, 4 * pxum); g.fillStyle = st.nuc; g.beginPath(); g.arc(cx, cy, nr, 0, TAU); g.fill(); }
      }
      g.restore();
    }
    if (onion) onionLayer(0, 0, 1); else cheekLayer(0, 0, 1);
    if (rd.layers > 1) {      // folded peel: a second, offset layer over a diagonal band, plus the fold line
      g.save(); g.beginPath(); g.moveTo(S * 0.38, 0); g.lineTo(S, 0); g.lineTo(S, S * 0.0 + S * 0.62); g.lineTo(S * 0.58, S); g.lineTo(0, S); g.lineTo(0, S * 0.7); g.closePath(); g.clip();
      g.globalCompositeOperation = "multiply"; if (onion) onionLayer(cw * 0.5, 28 * pxum * 2, 0.9); else cheekLayer(cw * 0.5, 20, 0.9);
      g.restore();
      g.strokeStyle = "rgba(60,40,20,.55)"; g.lineWidth = 4; g.beginPath(); g.moveTo(S * 0.38, 0); g.bezierCurveTo(S * 0.5, S * 0.3, S * 0.3, S * 0.6, S * 0.0, S * 0.7); g.stroke();
    }
    var Rb = rng(5), n = rd.bubbles;      // trapped air: dark thick ring, bright centre, specular
    for (var b = 0; b < n; b++) {
      var bx = C + (Rb() - 0.5) * S * 0.8, by = C + (Rb() - 0.5) * S * 0.8, br = (rd.view === 100 ? 16 + Rb() * 34 : 30 + Rb() * 60);
      var gr = g.createRadialGradient(bx - br * 0.3, by - br * 0.3, br * 0.1, bx, by, br);
      gr.addColorStop(0, "rgba(255,255,255,.95)"); gr.addColorStop(0.8, "rgba(235,240,240,.7)"); gr.addColorStop(1, "rgba(30,30,30,.9)");
      g.fillStyle = gr; g.beginPath(); g.arc(bx, by, br, 0, TAU); g.fill();
      g.strokeStyle = "rgba(20,20,20,.9)"; g.lineWidth = Math.max(3, br * 0.14); g.stroke();
    }
    finishView(g, S, rd); g.restore();
  }
  function roundRect(g, x, y, w, h, r) {
    g.moveTo(x + r, y); g.lineTo(x + w - r, y); g.quadraticCurveTo(x + w, y, x + w, y + r); g.lineTo(x + w, y + h - r); g.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    g.lineTo(x + r, y + h); g.quadraticCurveTo(x, y + h, x, y + h - r); g.lineTo(x, y + r); g.quadraticCurveTo(x, y, x + r, y);
  }
  function finishView(g, S, rd) {
    var C = S / 2, v = g.createRadialGradient(C, C, C * 0.7, C, C, C);
    v.addColorStop(0, "rgba(0,0,0,0)"); v.addColorStop(1, "rgba(0,0,0,.42)"); g.fillStyle = v; g.fillRect(0, 0, S, S);
    g.fillStyle = "rgba(30,30,40,.8)"; g.font = "bold 26px Arial"; g.textAlign = "center"; g.textBaseline = "alphabetic";
    g.fillText("×" + rd.view, C, S - 22);
  }

  /* ---------------------------------------------------------- main builder */
  var DEFAULTS = { specimen: "onion", stain: "iodine", coverslipAngle_deg: 45, folded: false, view: 100, labels: false, step: 0 };
  var PEEL_W = 2.0, PEEL_D = 1.3, PX = 18, PZ = 12;

  function create(opts) {
    var p = {}; for (var k in DEFAULTS) p[k] = DEFAULTS[k]; if (opts) for (var k2 in opts) if (opts[k2] !== undefined) p[k2] = opts[k2];
    var T = textures(), g = new THREE.Group(), parts = {};
    var S = { dropper: 0, dropAmt: 0, spec: 0, peel: 0, hold: 0, lower: 0, spat: 0, forceps: 0, film: 0, needleAway: 0, bubbles: 0, squeeze: 0 };
    var step = clamp(p.step | 0, 0, 5), playing = false, playT = 0, mounted = false, dirty = true, viewDirty = true, clock = 0;

    // bench + work surface
    g.add(buildBench());
    var tile = buildTile(11.6, 6.6); tile.position.set(0, 0, SLIDE_Z); g.add(tag(tile, "stage")); parts.stage = tile;
    var stageTile2 = buildTile(7.2, 5.2); stageTile2.position.set(-4.8, 0, -2.6); g.add(stageTile2);

    // slide
    var sl = buildSlide(); sl.group.position.set(0, 0.3 + 0.06, SLIDE_Z); g.add(tag(sl.group, "slide")); parts.slide = sl.group;

    // liquid on slide: drop (dome) and thin film under the cover slip
    var dropMat = liquid(0xc88a2c, 0.62);
    var drop = new THREE.Mesh(lathe([[0, 0.0], [0.95, 0.0], [1.0, 0.03], [0.9, 0.12], [0.55, 0.22], [0.0, 0.27]], 36), dropMat);
    drop.position.set(0, SLIDE_TOP, SLIDE_Z); drop.scale.set(0.001, 0.001, 0.001); g.add(tag(drop, "drop")); parts.drop = drop;
    var filmMat = liquid(0xc88a2c, 0.5);
    var film = new THREE.Mesh(slab(CS - 0.06, CS - 0.06, 0.05, 0.1, 0.02), filmMat);
    film.position.set(0, SLIDE_TOP, SLIDE_Z); film.visible = false; g.add(tag(film, "film")); parts.film = film;

    // cheek smear (rough translucent patch built from a noisy fan)
    var smearGeo = new THREE.CircleGeometry(0.75, 28), sp = smearGeo.attributes.position, Rs = rng(3);
    for (var si = 1; si < sp.count; si++) { var sx = sp.getX(si), sy = sp.getY(si), rr = 1 + (Rs() - 0.5) * 0.55; sp.setXY(si, sx * rr, sy * rr * 0.8); }
    var smear = new THREE.Mesh(smearGeo, new THREE.MeshStandardMaterial({ color: 0xe9d8bd, roughness: 0.4, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide }));
    smear.rotation.x = -Math.PI / 2; smear.position.set(0.0, SLIDE_TOP + 0.01, SLIDE_Z); g.add(tag(smear, "smear")); parts.smear = smear;

    // onion bulb, scale, peel
    var bulb = buildBulb(); bulb.position.set(-5.2, 0.12, -8.2); bulb.rotation.z = 0.0; g.add(tag(bulb, "bulb")); parts.bulb = bulb;
    var scaleLen = 4.6, scaleMesh = buildScale(scaleLen); scaleMesh.position.set(-4.8, 0.3, -2.6); scaleMesh.rotation.y = 0; g.add(tag(scaleMesh, "scale")); parts.scale = scaleMesh;
    var Rsc = scaleMesh.userData.R, thS = scaleMesh.userData.th;
    function scaleSurface(x) { var r = Rsc - thS; return 0.3 + (Rsc - Math.sqrt(Math.max(0.0001, r * r - x * x))) + 0.012; }

    var peelGeo = new THREE.PlaneGeometry(PEEL_W, PEEL_D, PX, PZ); peelGeo.rotateX(-Math.PI / 2);
    var base = peelGeo.attributes.position.array.slice(0);
    var peelMat = new THREE.MeshStandardMaterial({ color: 0xd2e3a6, roughness: 0.3, transparent: true, opacity: 0.8, side: THREE.DoubleSide, depthWrite: false });
    var peel = new THREE.Mesh(peelGeo, peelMat); g.add(tag(peel, "peel")); parts.peel = peel; parts.specimen = peel;
    var peelOutline = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(PEEL_W, PEEL_D)), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.0 }));

    // coverslip + needle
    var cs = buildCoverSlip(); g.add(tag(cs, "coverslip")); parts.coverslip = cs;
    var csRest = new THREE.Vector3(5.6, 0.34 + 0.01, SLIDE_Z + 1.6);
    // stack of spare cover slips (thin glass plates) at rest
    var spare = new THREE.Group(); for (var q = 0; q < 4; q++) { var sq = new THREE.Mesh(slab(CS, CS, 0.02, 0.02, 0.006), glass(0xe8f6f4, 0.35, 0.03)); sq.position.set(csRest.x + CS / 2 + 0.2, 0.30 + 0.011 + q * 0.021, csRest.z + 2.8); sq.rotation.y = (q - 1.5) * 0.06; spare.add(sq); } g.add(spare);
    var needle = buildNeedle(); g.add(tag(needle, "needle")); parts.needle = needle;

    // forceps + spatula
    var forceps = buildForceps(); forceps.scale.setScalar(0.8); g.add(tag(forceps, "forceps")); parts.forceps = forceps;
    var spat = buildSpatula(); spat.group.scale.setScalar(0.75); g.add(tag(spat.group, "spatula")); parts.spatula = spat.group;
    var spCream = new THREE.Mesh(new THREE.CircleGeometry(0.28, 14), new THREE.MeshStandardMaterial({ color: 0xf6ecd8, roughness: 0.4, transparent: true, opacity: 0.0, side: THREE.DoubleSide }));
    spCream.rotation.x = Math.PI / 2; spCream.position.set(0, 0.075, 0.5); spat.group.add(spCream);

    // dropper bottles
    var iod = dropperBottle({ glassColor: 0x8a4a12, glassOpacity: 0.62, liq: 0xa65a14, liqOpacity: 0.85, dropColor: 0xc88a2c, label: ["IODINE", "solution"] });
    var met = dropperBottle({ glassColor: 0xd6ece8, glassOpacity: 0.28, liq: 0x16309e, liqOpacity: 0.88, dropColor: 0x3050d0, label: ["METHYLENE", "BLUE"] });
    var slt = dropperBottle({ glassColor: 0xd6ece8, glassOpacity: 0.28, liq: 0xd8e6ea, liqOpacity: 0.55, dropColor: 0xe0eef0, label: ["SALT", "10 %"] });
    var bx = [-1.4, 2.0, 5.4]; [iod, met, slt].forEach(function (b, i) { b.group.position.set(bx[i], 0.12, -8.6); g.add(b.group); });
    tag(iod.group, "iodine"); tag(met.group, "methylene"); tag(slt.group, "salt");
    parts.iodine = iod.group; parts.methylene = met.group; parts.salt = slt.group;
    var bottles = { iodine: iod, methylene: met, salt: slt }, bpos = { iodine: bx[0], methylene: bx[1], salt: bx[2] };

    // disinfectant beaker
    var beaker = buildBeaker(); beaker.position.set(6.2, 0.12, -2.0); g.add(tag(beaker, "disinfectant")); parts.disinfectant = beaker;

    // eyepiece view disc, standing at the front, tilted toward the viewer
    var vcv = document.createElement("canvas"); vcv.width = vcv.height = 512;
    var vtex = new THREE.CanvasTexture(vcv); vtex.colorSpace = THREE.SRGBColorSpace; vtex.anisotropy = 4;
    var view = new THREE.Group(); view.position.set(0, 0, 10.4); g.add(tag(view, "view")); parts.view = view;
    var bez = new THREE.Mesh(lathe([[3.55, 0], [3.62, 0.04], [3.62, 0.34], [3.5, 0.42], [3.28, 0.42], [3.28, 0.3], [3.38, 0.3], [3.38, 0.06], [3.3, 0.0]], 56), std(0x1d2430, 0.35, 0.7));
    bez.rotation.x = Math.PI / 2; bez.position.set(0, 0, 0); view.add(bez);
    var vdisc = new THREE.Mesh(new THREE.CircleGeometry(3.32, 56), new THREE.MeshBasicMaterial({ map: vtex }));
    vdisc.position.z = 0.02; view.add(vdisc);
    var VZ = 11.8, VT = 1.2, VR = 3.4;
    view.position.set(0, 0.2 + VR * Math.cos(VT), VZ); view.rotation.x = -VT;
    var tri = new THREE.Shape(); tri.moveTo(VZ - VR * Math.sin(VT), 0); tri.lineTo(VZ + VR * Math.sin(VT), 0); tri.lineTo(VZ - VR * Math.sin(VT), 2 * VR * Math.cos(VT) - 0.1); tri.closePath();
    var tg = new THREE.ExtrudeGeometry(tri, { depth: 5.0, bevelEnabled: false }); tg.translate(0, 0, -2.5); tg.rotateY(-Math.PI / 2);
    var prop = new THREE.Mesh(tg, std(0x1d2430, 0.45, 0.4)); prop.position.y = 0.12; g.add(prop);
    // labels (optional)
    var labelSprites = [];
    function addLabels() {
      [["slide", "slide", sl.group, 1.1], ["peel", "peel", peel, 0.9], ["coverslip", "cover slip", cs, 1.0], ["spatula", "spatula", spat.group, 1.0], ["iodine", "iodine", iod.group, 7.0], ["methylene", "methylene blue", met.group, 7.0], ["disinfectant", "disinfectant", beaker, 7.4]].forEach(function (a) {
        var s = pill(a[1], 0.7); s.userData.follow = a[2]; s.userData.dy = a[3]; g.add(s); labelSprites.push(s);
      });
    }
    if (p.labels) addLabels();

    /* ---- apply specimen / stain visuals ---- */
    function applyLook() {
      var st = STAINS[p.stain] || STAINS.none, on = p.specimen === "onion";
      dropMat.color.setHex(st.drop); dropMat.opacity = p.stain === "none" || p.stain === "salt" ? 0.38 : 0.66;
      filmMat.color.setHex(st.drop); filmMat.opacity = p.stain === "none" || p.stain === "salt" ? 0.16 : 0.22;
      // methylene blue turns the cheek smear blue once the stain reaches it
      sl.frost.material.map = frostTex(on ? "A" : "B"); sl.frost.material.map.needsUpdate = true;
      peel.visible = on; bulb.visible = true; scaleMesh.visible = on;
      stageTile2.visible = on;
      iod.group.visible = true; met.group.visible = true; slt.group.visible = p.stain === "salt";
      dirty = true; viewDirty = true;
    }

    /* ---- targets from step ---- */
    function targets() {
      var on = p.specimen === "onion", d = {};
      var dropStep = on ? 1 : 2;
      d.drop = step >= dropStep ? 1 : 0;
      d.dropper = (step === dropStep) ? 2 : (step > dropStep ? 0 : 0);        // 0 in bottle, 1 lifted, 2 over slide
      d.peel = on ? (step >= 2 ? 2 : 0) : 0;
      d.spec = !on ? (step >= 1 ? 1 : 0) : 0;
      d.spat = on ? 0 : (step === 1 ? 1 : (step >= 5 ? 2 : (step >= 2 ? 0.0 : 0)));
      d.hold = step >= 3 ? 1 : 0;
      d.lower = step >= 4 ? 1 : 0;
      d.forceps = on && step === 2 ? 1 : 0;
      return d;
    }

    function useBottle() { return p.stain === "none" ? null : bottles[p.stain]; }

    /* ---- peel deformation: conform to scale -> lifted & drooping -> flat in the drop (with optional fold) ---- */
    function updatePeel(t) {
      var pos = peelGeo.attributes.position.array, ph = S.peel, lay = sstep(1.6, 2.0, ph);
      var lift = sstep(0.0, 1.0, ph) * (1 - sstep(1.0, 2.0, ph) * 0.0);
      var carrying = ph > 0.02 && ph < 1.98;
      var fold = p.folded && lay > 0.4 ? sstep(0.4, 1.0, lay) : 0;
      var cx, cy, cz;
      var A = new THREE.Vector3(-4.8, 0, -2.6), Bp = new THREE.Vector3(0, SLIDE_TOP + 1.7, SLIDE_Z - 0.2), Cp = new THREE.Vector3(0, SLIDE_TOP + 0.27 + 0.02, SLIDE_Z);
      if (ph < 1) { cx = A.x; cy = 0; cz = A.z; var u = sstep(0, 1, ph); cx = lerp(A.x, A.x + 0.6, u); cz = A.z; }
      else { var u2 = sstep(1, 2, ph); cx = lerp(A.x + 0.6, Cp.x, u2); cz = lerp(A.z, Cp.z, u2); }
      var hoverY = ph < 1 ? 1.8 * sstep(0, 1, ph) : lerp(2.1, 0, sstep(1.2, 2, ph));
      var Ry = rng(1);
      for (var i = 0; i < pos.length; i += 3) {
        var bx = base[i], bz = base[i + 2], u3 = (bx / PEEL_W + 0.5), y;
        var ycon = scaleSurface(bx + (-4.8 - scaleMesh.position.x));
        var ysl = SLIDE_TOP + 0.265 + 0.015;
        var flat = ph >= 2 ? 1 : 0;
        var ground = ph < 1 ? lerp(ycon, ycon + hoverY, 1) : lerp(ycon + 2.1, ysl, sstep(1.2, 2, ph));
        if (ph >= 1) ground = lerp(ycon + hoverY * 0 + 2.1, ysl, sstep(1.2, 2.0, ph)) + hoverY * 0;
        else ground = ycon + hoverY;
        var droop = carrying ? 0.26 * Math.pow(Math.abs(bx) / (PEEL_W / 2), 1.5) * (1 - lay) + 0.05 * Math.sin(t * 5 + bx * 4 + bz * 3) * (1 - lay) : 0;
        y = ground - droop;
        var xx = bx, zz = bz;
        if (fold > 0 && u3 > 0.58) {          // fold the right 42 % back over the rest
          var xf = (0.58 - 0.5) * PEEL_W, dx = bx - xf, ang = Math.PI * fold;
          xx = xf + dx * Math.cos(ang); y = y + Math.abs(dx) * Math.sin(ang) * 1.0 * (fold < 1 ? 1 : 0) + 0.035 * fold;
          if (fold >= 1) { xx = xf - dx; y = ysl + 0.04; }
        }
        pos[i] = cx + xx; pos[i + 1] = y; pos[i + 2] = cz + zz;
      }
      peelGeo.attributes.position.needsUpdate = true; peelGeo.computeVertexNormals();
      peelGeo.computeBoundingSphere();
      // tint by what the peel is sitting in
      var st = STAINS[p.stain] || STAINS.none, wet = sstep(1.5, 2.0, ph) * S.dropAmt;
      var c0 = new THREE.Color(0xd2e3a6), c1 = new THREE.Color(st.drop);
      peelMat.color.copy(c0).lerp(c1, wet * (p.stain === "none" || p.stain === "salt" ? 0.1 : 0.85));
      peelMat.opacity = lerp(0.8, 0.62, wet);
    }

    /* ---- pose helpers ---- */
    var tmpV = new THREE.Vector3();
    function poseDropper(t) {
      var b = useBottle(); [iod, met, slt].forEach(function (x) { x.dropper.position.set(0, 0.6, 0); x.dropper.rotation.set(0, 0, 0); x.drop.visible = false; x.teat.scale.y = 1; x.fill.visible = true; });
      if (!b) return;
      var x = bpos[p.stain], d = S.dropper, up = sstep(0, 1, Math.min(d, 1)), go = sstep(1, 2, d);
      // local to bottle group: lift out (y), then travel to above the slide (world -> local)
      var wx = lerp(x, 0.2, go), wy = lerp(0.12 + 0.6 + 0.0, 0.12 + 7.5, up) , wz = lerp(-8.6, SLIDE_Z + 0.0, go);
      var targetWorldY = lerp(wy, SLIDE_TOP + 4.3, go);
      b.dropper.position.set(wx - x, targetWorldY - 0.12, wz - (-8.6));
      b.dropper.rotation.x = go * 0.0;
      // drops fall while hovering
      var hov = go > 0.98 && S.dropAmt < 0.98;
      b.drop.visible = hov;
      b.squeeze = hov ? 0.5 + 0.5 * Math.sin(t * 9) : 0;
      b.teat.scale.set(1 - 0.12 * b.squeeze, 1 - 0.15 * b.squeeze, 1 - 0.12 * b.squeeze);
      if (hov) { var f = (t * 1.9) % 1; b.drop.position.set(0, lerp(0.0, -(SLIDE_TOP + 4.3 - SLIDE_TOP - 0.3), f * f), 0); b.drop.scale.setScalar(1 - 0.0 * f); }
      b.fill.visible = true;
    }

    function poseNeedle() {
      var a = (+p.coverslipAngle_deg) * Math.PI / 180, hold = sstep(0, 1, S.hold), ang = a * hold * (1 - sstep(0, 1, S.lower));
      var hinge = cs.position, edgeX = hinge.x + Math.cos(ang) * CS, edgeY = hinge.y + Math.sin(ang) * CS;
      var away = sstep(0.7, 1, S.lower);
      needle.position.set(edgeX + 0.15 + away * 2.4, edgeY - 0.12 + away * 2.6, hinge.z);
      needle.rotation.set(0, 0, 0.62 + away * 0.3);
      needle.visible = hold > 0.05 && away < 0.97;
    }

    function poseCover() {
      var a = (+p.coverslipAngle_deg) * Math.PI / 180, hold = sstep(0, 1, S.hold), low = sstep(0, 1, S.lower);
      var hingeX = lerp(csRest.x, -CS / 2, hold), hingeZ = lerp(csRest.z, SLIDE_Z, hold);
      var hy = lerp(csRest.y, SLIDE_TOP + 0.012, hold);
      cs.position.set(hingeX, hy + (hold > 0 && hold < 1 ? 0.9 * Math.sin(Math.PI * hold) : 0), hingeZ);
      cs.rotation.set(0, 0, a * hold * (1 - low));
      cs.rotation.y = (1 - hold) * -0.25;
      // drop spreads into a film under the cover slip; the drop dome flattens
      film.visible = S.lower > 0.5;
      var spread = sstep(0.5, 1.0, S.lower);
      film.scale.set(spread, 1, spread); film.position.y = SLIDE_TOP + 0.0;
    }

    function poseDrop() {
      var s = sstep(0, 1, S.dropAmt) * (1 - sstep(0.55, 1, S.lower));
      var on = p.specimen === "onion";
      drop.scale.set(Math.max(0.001, s), Math.max(0.001, s), Math.max(0.001, s));
      drop.visible = s > 0.01;
      smear.material.opacity = p.specimen === "cheek" ? sstep(0, 1, S.spec) * 0.85 : 0;
      var ms = STAINS[p.stain] || STAINS.none;
      smear.material.color.setHex(S.dropAmt > 0.6 && p.stain === "methylene" ? 0x8aa0e8 : (S.dropAmt > 0.6 && p.stain === "iodine" ? 0xdcc27c : 0xf1e7d6));
      smear.visible = p.specimen === "cheek" && S.lower < 0.5;
    }

    function poseForceps(t) {
      var w = sstep(0.02, 0.2, S.peel) * (1 - sstep(1.9, 2.0, S.peel));
      var rest = new THREE.Vector3(-8.3, 0.13, 3.4), tipX = -4.8 - PEEL_W / 2 + 0.2, tipY = 0, tipZ = -2.6;
      // grip the leading edge of the peel while carrying
      var corner = peelGeo.attributes.position, i0 = 0;
      var cx = corner.array[0] - 0.0, cy = corner.array[1], cz = corner.array[2];
      var tip = new THREE.Vector3(cx + 0.05, cy + 0.04, cz - 0.04);
      forceps.position.lerpVectors(rest, tip, w);
      forceps.rotation.set(-(0.42 * w), lerp(0.0, 0.25, w), 0, "YXZ");
      // blades squeeze (tips close) while holding the peel
      forceps.userData.blades[0].rotation.y = lerp(0.03, 0.0, w); forceps.userData.blades[1].rotation.y = lerp(-0.03, 0.0, w);
    }

    function poseSpatula() {
      var rest = new THREE.Vector3(8.6, 0.13, 13.8), over = new THREE.Vector3(0.4, SLIDE_TOP + 0.15, SLIDE_Z + 0.5);
      var bk = beaker.position, inB = new THREE.Vector3(bk.x - 0.4, 0.5, bk.z + 0.5);
      var a = S.spat, w1 = sstep(0, 1, Math.min(a, 1)), w2 = sstep(1, 2, a);
      var pos = new THREE.Vector3().lerpVectors(rest, over, w1).lerp(inB, w2);
      // arc up between stations
      pos.y += 1.4 * Math.sin(Math.PI * Math.min(1, w1)) * (1 - w2) + 2.5 * Math.sin(Math.PI * w2) * 1.0;
      spat.group.position.copy(pos);
      var yaw = lerp(lerp(-Math.PI / 2, 0.35, w1), 0.5, w2), pitch = lerp(lerp(0.0, -0.32, w1), -0.95, w2);
      spat.group.rotation.set(pitch, yaw, 0, "YXZ");
      spCream.material.opacity = (p.specimen === "cheek" && S.spat < 0.45 && step >= 1) ? 0.9 : 0;
    }

    /* ---- readout / events ---- */
    function emit(name, detail) { if (typeof api.onEvent === "function") try { api.onEvent(name, detail); } catch (e) {} }
    function reading() { var r = model(p); r.step = step; r.mounted = mounted; return r; }

    var api = g;
    function setStep(n, silent) {
      n = clamp(Math.round(n), 0, 5);
      var changed = n !== step; step = n; p.step = n;
      if (!silent) emit("step", { step: n });
      if (n < 4) mounted = false;
      return changed;
    }

    api.parts = parts; g.userData.parts = parts; g.group = g; g.isKit = true;
    api.params = p;
    api.reading = reading;
    api.setStep = function (n) { setStep(n); };
    api.nextStep = function () { setStep(step >= 5 ? 0 : step + 1); };
    api.maxStep = 5;
    api.play = function () { playing = true; playT = 0; if (step >= 5) setStep(0); };
    api.pause = function () { playing = false; };
    api.isPlaying = function () { return playing; };
    api.reset = function () { playing = false; setStep(0); };
    api.setState = function (o) {
      o = o || {}; var look = false;
      ["specimen", "stain", "coverslipAngle_deg", "folded", "view"].forEach(function (k) { if (o[k] !== undefined && o[k] !== p[k]) { p[k] = o[k]; look = true; } });
      if (o.specimen !== undefined && !STAINS[p.stain]) p.stain = "iodine";
      if (o.specimen !== undefined || o.stain !== undefined) { Object.keys(S).forEach(function (k) { S[k] = 0; }); mounted = false; if (o.step === undefined) setStep(0, true); }
      if (o.step !== undefined) setStep(o.step);
      if (look) { applyLook(); emit("state", reading()); }
      viewDirty = true; dirty = true;
    };
    g.setState = api.setState;

    var labelTmp = new THREE.Vector3();
    api.update = function (dt, t) {
      dt = Math.min(dt || 0.016, 0.1); clock += dt; t = t == null ? clock : t;
      if (playing) { playT += dt; if (playT > 1.9) { playT = 0; if (step < 5) setStep(step + 1); else playing = false; } }
      var d = targets();
      S.dropper = ease(S.dropper, d.dropper, dt, 2.2);
      S.peel = ease(S.peel, d.peel, dt, 1.6);
      S.spec = ease(S.spec, d.spec, dt, 1.8);
      S.spat = ease(S.spat, d.spat, dt, 1.7);
      S.hold = ease(S.hold, d.hold, dt, 2.2);
      S.lower = ease(S.lower, d.lower, dt, 1.4);
      // the drop only grows once the dropper hovers over the slide
      var dropStep = p.specimen === "onion" ? 1 : 2;
      var dTar = step === dropStep ? (S.dropper > 1.8 ? 1 : 0) : d.drop;
      S.dropAmt = ease(S.dropAmt, dTar, dt, 1.2);

            poseDrop(); poseDropper(t); if (p.specimen === "onion") updatePeel(t); poseCover(); poseNeedle(); poseForceps(t); poseSpatula();
      peel.visible = p.specimen === "onion" && !(S.peel < 0.001 && false);

      var nowMounted = S.lower > 0.97 && step >= 4;
      if (nowMounted !== mounted) { mounted = nowMounted; viewDirty = true; if (mounted) emit("mounted", reading()); }
      if (viewDirty) { drawView(vcv, model(p), mounted); vtex.needsUpdate = true; viewDirty = false; }
      labelSprites.forEach(function (s) { var o = s.userData.follow; o.getWorldPosition(labelTmp); s.position.set(labelTmp.x, labelTmp.y + s.userData.dy, labelTmp.z); });
    };
    api.settle = function (sec) { var n = Math.ceil((sec || 4) / 0.05); for (var i = 0; i < n; i++) api.update(0.05); };
    api.tick = api.update; g.userData.update = api.update; g.userData.setState = api.setState;
    api.dispose = function () { g.traverse(function (o) { if (o.geometry) o.geometry.dispose(); }); };

    applyLook();
    setStep(step, true);
    api.update(0.016, 0);
    return g;
  }

  /* ---------------------------------------------------------- scene helpers */
  function lights(scene) {
    scene.add(new THREE.HemisphereLight(0xdfe9ff, 0x3a2a1a, 0.7));
    var key = new THREE.DirectionalLight(0xffffff, 1.35); key.position.set(-8, 22, 12); scene.add(key);
    var rim = new THREE.DirectionalLight(0xbfd8ff, 0.55); rim.position.set(10, 12, -14); scene.add(rim);
  }
  function environment(renderer) {
    var es = new THREE.Scene();
    es.add(new THREE.Mesh(new THREE.BoxGeometry(60, 60, 60), new THREE.MeshBasicMaterial({ color: 0x8a949c, side: THREE.BackSide })));
    function panel(w, h, c, x, y, z, rx, ry) { var m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: c, side: THREE.DoubleSide })); m.position.set(x, y, z); m.rotation.set(rx || 0, ry || 0, 0); es.add(m); }
    panel(30, 10, new THREE.Color(5, 5, 5.2), 0, 28, 0, Math.PI / 2, 0);
    panel(8, 20, new THREE.Color(3.6, 3.7, 4), -28, 8, 6, 0, Math.PI / 2);
    panel(6, 18, new THREE.Color(2.6, 2.4, 2.2), 28, 6, -6, 0, -Math.PI / 2);
    var pm = new THREE.PMREMGenerator(renderer); var tex = pm.fromScene(es, 0.04).texture; pm.dispose(); return tex;
  }
  function fit(camera, controls, aspect) {
    var vf = camera.fov * Math.PI / 180, halfW = 10.6, halfH = 13.0;
    var dW = halfW / (Math.tan(vf / 2) * Math.max(0.3, aspect)), dH = halfH / Math.tan(vf / 2);
    var dist = Math.max(dW, dH * 0.8);
    var pitch = aspect < 0.8 ? 0.86 : 0.78;      // steeper from above on portrait phones
    var tgt = new THREE.Vector3(0, 0.5, 2.0);
    camera.position.set(0, tgt.y + Math.sin(pitch) * dist, tgt.z + Math.cos(pitch) * dist);
    camera.lookAt(tgt); if (controls) { controls.target.copy(tgt); controls.update(); }
    camera.aspect = aspect; camera.updateProjectionMatrix();
  }

  global.SlidePrepBench = { version: 1, create: create, lights: lights, environment: environment, fit: fit, model: model, STAINS: STAINS, DEFAULTS: DEFAULTS };
  global.StudyPipeKits = global.StudyPipeKits || {};

  /* ---------------------------------------------------------- mountable kit (StudyPipeKits convention, used by demo.html) */
  global.StudyPipeKits["slide-prep-bench"] = {
    mount: function (container, params, host) {
      host = host || { emit: function () {} };
      var p = {}; for (var k in DEFAULTS) p[k] = DEFAULTS[k]; if (params) for (var k2 in params) p[k2] = params[k2];
      container.style.cssText += ";display:flex;flex-direction:column;height:100%;background:#0e1620;color:#e8eef5;font:13px/1.35 system-ui,sans-serif";
      var stageBox = document.createElement("div"); stageBox.style.cssText = "flex:1 1 auto;min-height:200px;position:relative"; container.appendChild(stageBox);
      var canvas = document.createElement("canvas"); canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none"; stageBox.appendChild(canvas);
      var panel = document.createElement("div"); panel.style.cssText = "flex:0 0 auto;padding:6px 8px 8px;background:#101a26;border-top:1px solid rgba(255,255,255,.12)"; container.appendChild(panel);
      var readout = document.createElement("div"); readout.className = "bench-readout"; readout.style.cssText = "font:12px/1.35 ui-monospace,Menlo,monospace;padding:4px 6px 6px;min-height:50px"; panel.appendChild(readout);
      var row = document.createElement("div"); row.style.cssText = "display:flex;flex-wrap:wrap;gap:5px"; panel.appendChild(row);

      var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: false });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0;
      var scene = new THREE.Scene(); scene.background = new THREE.Color(0x0e1620);
      scene.environment = environment(renderer); lights(scene);
      var camera = new THREE.PerspectiveCamera(36, 1, 0.5, 300);
      var controls = new THREE.OrbitControls(camera, canvas); controls.enablePan = false; controls.enableDamping = true; controls.minDistance = 14; controls.maxDistance = 90; controls.maxPolarAngle = Math.PI * 0.47;
      var kit = create(p); scene.add(kit);
      kit.onEvent = function (n, d) { host.emit(n, d); refresh(); };
      window.__kit = kit; window.__cam = camera; window.__controls = controls;

      function btn(label, fn) { var b = document.createElement("button"); b.textContent = label; b.style.cssText = "min-height:44px;padding:0 10px;border-radius:22px;border:0;background:#1f5e8c;color:#fff;font:600 12px system-ui;cursor:pointer"; b.addEventListener("click", function () { fn(b); refresh(); }); row.appendChild(b); return b; }
      var angles = [45, 15, 60], ai = 0, stains = ["iodine", "methylene", "none", "salt"], si = 0;
      btn("Next step", function () { kit.pause(); kit.nextStep(); });
      var autoB = btn("Auto", function (b) { if (kit.isPlaying()) { kit.pause(); b.textContent = "Auto"; } else { kit.play(); b.textContent = "Pause"; } });
      btn("Reset", function () { kit.reset(); autoB.textContent = "Auto"; });
      btn("Onion / cheek", function () { var on = kit.params.specimen === "onion"; kit.setState({ specimen: on ? "cheek" : "onion", stain: on ? "methylene" : "iodine" }); });
      btn("Stain", function () { si = (stains.indexOf(kit.params.stain) + 1) % stains.length; kit.setState({ stain: stains[si] }); });
      btn("Angle", function () { ai = (angles.indexOf(+kit.params.coverslipAngle_deg) + 1) % angles.length; kit.setState({ coverslipAngle_deg: angles[ai] }); });
      btn("Fold", function () { kit.setState({ folded: !kit.params.folded }); });
      btn("×100 / ×400", function () { kit.setState({ view: kit.params.view === 100 ? 400 : 100 }); });

      function refresh() {
        var r = kit.reading();
        readout.textContent = r.specimen + " | stain: " + r.stain + " | slip " + r.angle_deg + "° | step " + r.step + "/5\n" +
          "bubbles " + r.bubbles + " | layers " + r.layers + " | nucleus " + (r.nucleusVisible ? "visible" : "not visible") + " | " + r.quality + (r.faults.length ? " (" + r.faults.join(", ") + ")" : "") + "\n" +
          "view ×" + r.view + " | field " + r.field_um + " µm | " + r.cells_across + " cells across";
        readout.style.whiteSpace = "pre-wrap";
      }
      function resize() {
        var w = stageBox.clientWidth || 360, h = stageBox.clientHeight || 400;
        renderer.setSize(w, h, false); fit(camera, controls, w / h);
      }
      window.addEventListener("resize", resize); resize(); refresh();
      var last = performance.now();
      (function loop(now) { var dt = Math.min(0.05, (now - last) / 1000); last = now; kit.update(dt, now / 1000); controls.update(); renderer.render(scene, camera); requestAnimationFrame(loop); })(last);
      return kit;
    }
  };
})(window);
