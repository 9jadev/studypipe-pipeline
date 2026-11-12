/* =========================================================
   StudyPipe · VesselSlideBench v1 — prepared artery + vein slide, eyepiece graticule and stage micrometre (Lesson 05, station 1)
   Classic script (no modules), fully offline, needs window.THREE (three.js r160 bundle). No SceneKit / HeartKit dependency.

   Units: 1 scene unit = 1 cm.   Y is up.   Bench top at y = 0.
   The 3D reference vessels are drawn at 0.9 cm per mm of tissue (teaching exaggeration).

   API
     var kit = VesselSlideBench.create({ calibrated, calibrating, errors, slant_deg, focus });
     scene.add(kit);                    // kit is a THREE.Group
     kit.parts      -> { name: Object3D }  (also kit.userData.parts)
     kit.update(dt, t)  (also kit.tick)     call every frame
     kit.setState({ calibrated, calibrating, errors:{slant,collapsedVein,noCalibration}, slant_deg, focus })
     kit.calibrate()                        stage micrometre against the graticule (calibrated = true)
     kit.measure("artery"|"vein")           place the graticule on the wall and lumen; returns reading()
     kit.reading()                          computed from the model (never typed text)
     kit.reset()                            clears calibration step and measurements
     kit.onEvent = function (name, detail)  'measure' | 'calibrate' | 'focus' | 'state'
   Also: VesselSlideBench.environment(renderer), .lights(scene), .fit(camera, controls, aspect), .model(params)

   Parts (userData.partId set): slide, coverslip, micrometre, graticule, view, artery, vein, tunicaMedia, veinMedia,
     lumen, valve, capillary
   ========================================================= */
(function (global) {
  "use strict";
  var THREE = global.THREE;
  if (!THREE) return;
  var TAU = Math.PI * 2;

  /* ---------------------------------------------------------- helpers (shared by both bench kits) */
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
  /* biconcave red cell (lathe) : r = radius in scene units */
  function rbcGeometry(r) {
    var pts = [], i, n = 14;
    for (i = 0; i <= n; i++) {
      var u = i / n, x = u * r;
      var y = 0.42 * r * Math.sqrt(Math.max(0, 1 - u * u)) * (0.18 + 1.35 * u * u - 0.55 * u * u * u * u) * 1.55 + 0.02 * r;
      pts.push([x, y]);
    }
    var up = pts.map(function (p) { return new THREE.Vector2(p[0], p[1]); });
    var lo = pts.slice().reverse().map(function (p) { return new THREE.Vector2(p[0], -p[1]); });
    var g = new THREE.LatheGeometry(up.concat(lo.slice(1)), 18); g.computeVertexNormals(); return g;
  }
  function ellipsePts(a, b, n, wob, k, ph) {
    var pts = [];
    for (var i = 0; i < n; i++) { var th = i / n * TAU, w = 1 + (wob || 0) * Math.sin((k || 0) * th + (ph || 0)); pts.push(new THREE.Vector2(a * w * Math.cos(th), b * w * Math.sin(th))); }
    return pts;
  }
  function wavyClosedCurve(a, b, n, wob, k, ph, z) {
    var pts = ellipsePts(a, b, n, wob, k, ph).map(function (p) { return new THREE.Vector3(p.x, p.y, z || 0); });
    return new THREE.CatmullRomCurve3(pts, true, "catmullrom", 0.5);
  }
  /* ring (annulus between two closed point lists) extruded along +z by depth */
  function ringGeo(outerPts, innerPts, depth) {
    var s = new THREE.Shape(outerPts); s.holes.push(new THREE.Path(innerPts.slice().reverse()));
    var g = new THREE.ExtrudeGeometry(s, { depth: depth, bevelEnabled: false, curveSegments: 4 });
    g.computeVertexNormals(); return g;
  }

  /* ---------------------------------------------------------- common bench pieces */
  var BTEX = null;
  function benchTextures() {
    if (BTEX) return BTEX;
    var R = rng(5); BTEX = {};
    BTEX.wood = ctex(512, 512, function (g, w, h) {
      g.fillStyle = "#9a6a38"; g.fillRect(0, 0, w, h);
      for (var i = 0; i < 150; i++) {
        var y = R() * h, a = 0.05 + R() * 0.14, dark = R() > 0.45;
        g.strokeStyle = dark ? "rgba(70,38,12," + a + ")" : "rgba(225,175,110," + a + ")";
        g.lineWidth = 0.6 + R() * 2.4; g.beginPath(); g.moveTo(0, y);
        for (var x = 0; x <= w; x += 64) g.lineTo(x, y + Math.sin(x * 0.012 + i) * (3 + R() * 5));
        g.stroke();
      }
    });
    BTEX.wood.repeat.set(2, 1.4);
    BTEX.tile = ctex(256, 256, function (g, w, h) {
      g.fillStyle = "#f3f5f4"; g.fillRect(0, 0, w, h);
      for (var i = 0; i < 400; i++) { g.fillStyle = "rgba(160,170,170," + R() * 0.05 + ")"; g.fillRect(R() * w, R() * h, 2, 2); }
    });
    return BTEX;
  }
  function buildBench() {
    var T = benchTextures();
    var m = new THREE.Mesh(new THREE.BoxGeometry(30, 0.8, 34), std(0xffffff, 0.7, 0, { map: T.wood }));
    m.position.set(0, -0.4, 2.0); return m;
  }
  function buildTile(w, d) {
    var T = benchTextures();
    var m = new THREE.Mesh(slab(w, d, 0.3, 0.5, 0.06), std(0xffffff, 0.35, 0, { map: T.tile })); return m;
  }
  /* glass slide with a frosted label end; returns Group (origin at slide centre, bottom face at y = 0) */
  function buildSlide(len, wid, th, labelText, labelColour) {
    var grp = new THREE.Group();
    var gl = new THREE.Mesh(slab(len, wid, th, 0.06, 0.03), glass(0xcfe8ee, 0.38, 0.06)); grp.add(gl);
    var lab = new THREE.Mesh(new THREE.PlaneGeometry(len * 0.2, wid * 0.94), new THREE.MeshStandardMaterial({
      roughness: 0.9, map: ctex(128, 192, function (g, w, h) {
        g.fillStyle = labelColour || "#e8efe6"; g.fillRect(0, 0, w, h);
        g.fillStyle = "rgba(255,255,255,.35)"; for (var i = 0; i < 300; i++) g.fillRect(Math.random() * w, Math.random() * h, 2, 2);
        g.save(); g.translate(w / 2, h / 2); g.rotate(-Math.PI / 2); g.fillStyle = "#26323a"; g.font = "bold 30px Arial, sans-serif"; g.textAlign = "center"; g.textBaseline = "middle";
        var ls = String(labelText || "").split("|"); ls.forEach(function (t, i) { g.fillText(t, 0, (i - (ls.length - 1) / 2) * 34); }); g.restore();
      })
    }));
    lab.rotation.x = -Math.PI / 2; lab.position.set(-len * 0.4, th + 0.004, 0); grp.add(lab);
    return grp;
  }
  /* eyepiece view disc standing at the front, tilted toward the viewer. Returns { group, canvas, tex } */
  function buildViewDisc(px) {
    var cv = document.createElement("canvas"); cv.width = cv.height = px;
    var tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
    var view = new THREE.Group();
    var bez = new THREE.Mesh(lathe([[3.55, 0], [3.62, 0.04], [3.62, 0.34], [3.5, 0.42], [3.28, 0.42], [3.28, 0.3], [3.38, 0.3], [3.38, 0.06], [3.3, 0.0]], 56), std(0x1d2430, 0.35, 0.7));
    bez.rotation.x = Math.PI / 2; view.add(bez);
    var vdisc = new THREE.Mesh(new THREE.CircleGeometry(3.32, 56), new THREE.MeshBasicMaterial({ map: tex }));
    vdisc.position.z = 0.02; view.add(vdisc);
    var VZ = 11.8, VT = 1.2, VR = 3.4;
    view.position.set(0, 0.2 + VR * Math.cos(VT), VZ); view.rotation.x = -VT;
    var holder = new THREE.Group(); holder.add(view);
    var tri = new THREE.Shape(); tri.moveTo(VZ - VR * Math.sin(VT), 0); tri.lineTo(VZ + VR * Math.sin(VT), 0); tri.lineTo(VZ - VR * Math.sin(VT), 2 * VR * Math.cos(VT) - 0.1); tri.closePath();
    var tg = new THREE.ExtrudeGeometry(tri, { depth: 5.0, bevelEnabled: false }); tg.translate(0, 0, -2.5); tg.rotateY(-Math.PI / 2);
    var prop = new THREE.Mesh(tg, std(0x1d2430, 0.45, 0.4)); prop.position.y = 0.12; holder.add(prop);
    return { group: holder, view: view, canvas: cv, tex: tex };
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
    var vf = camera.fov * Math.PI / 180, halfW = 10.8, halfH = 14.0;
    var dW = halfW / (Math.tan(vf / 2) * Math.max(0.3, aspect)), dH = halfH / Math.tan(vf / 2);
    var dist = Math.max(dW, dH * 0.8);
    var pitch = aspect < 0.8 ? 0.86 : 0.78;
    var tgt = new THREE.Vector3(0, 0.5, 2.6);
    camera.position.set(0, tgt.y + Math.sin(pitch) * dist, tgt.z + Math.cos(pitch) * dist);
    camera.lookAt(tgt); if (controls) { controls.target.copy(tgt); controls.update(); }
    camera.aspect = aspect; camera.updateProjectionMatrix();
  }
  /* emissive pulse helper: highlights = array of meshes (materials cloned lazily) */
  function pulseMeshes(list, on, t) {
    list.forEach(function (m) {
      if (!m.material || !m.material.emissive) return;
      if (!m.userData._e) m.userData._e = { c: m.material.emissive.clone(), i: m.material.emissiveIntensity };
      if (on) { m.material.emissive.setHex(0xffc23a); m.material.emissiveIntensity = 0.35 + 0.3 * Math.sin(t * 6); }
      else { m.material.emissive.copy(m.userData._e.c); m.material.emissiveIntensity = m.userData._e.i; }
    });
  }

  /* ---------------------------------------------------------- mountable page (StudyPipeKits convention, used by demo.html) */
  function mountKit(id, create, DEFAULTS, spec) {
    global.StudyPipeKits = global.StudyPipeKits || {};
    global.StudyPipeKits[id] = {
      mount: function (container, params, host) {
        host = host || { emit: function () {} };
        var p = {}; for (var k in DEFAULTS) p[k] = DEFAULTS[k]; if (params) for (var k2 in params) p[k2] = params[k2];
        container.style.cssText += ";display:flex;flex-direction:column;height:100%;background:#0e1620;color:#e8eef5;font:13px/1.35 system-ui,sans-serif";
        var stageBox = document.createElement("div"); stageBox.style.cssText = "flex:1 1 auto;min-height:200px;position:relative"; container.appendChild(stageBox);
        var canvas = document.createElement("canvas"); canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none"; stageBox.appendChild(canvas);
        var panel = document.createElement("div"); panel.style.cssText = "flex:0 0 auto;padding:6px 8px 8px;background:#101a26;border-top:1px solid rgba(255,255,255,.12)"; container.appendChild(panel);
        var readout = document.createElement("div"); readout.className = "bench-readout"; readout.style.cssText = "font:12px/1.35 ui-monospace,Menlo,monospace;padding:4px 6px 6px;min-height:50px;white-space:pre-wrap"; panel.appendChild(readout);
        var row = document.createElement("div"); row.style.cssText = "display:flex;flex-wrap:wrap;gap:5px"; panel.appendChild(row);
        var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: false });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0;
        var scene = new THREE.Scene(); scene.background = new THREE.Color(0x0e1620);
        scene.environment = environment(renderer); lights(scene);
        var camera = new THREE.PerspectiveCamera(36, 1, 0.5, 300);
        var controls = new THREE.OrbitControls(camera, canvas); controls.enablePan = false; controls.enableDamping = true; controls.minDistance = 14; controls.maxDistance = 90; controls.maxPolarAngle = Math.PI * 0.47;
        var kit = create(p); scene.add(kit);
        function refresh() { readout.textContent = spec.refresh(kit); }
        kit.onEvent = function (n, d) { host.emit(n, d); refresh(); };
        window.__kit = kit; window.__cam = camera; window.__controls = controls;
        function btn(label, fn) { var b = document.createElement("button"); b.textContent = label; b.style.cssText = "min-height:44px;padding:0 10px;border-radius:22px;border:0;background:#1f5e8c;color:#fff;font:600 12px system-ui;cursor:pointer"; b.addEventListener("click", function () { fn(b); refresh(); }); row.appendChild(b); return b; }
        spec.buttons(kit, btn);
        function resize() { var w = stageBox.clientWidth || 360, h = stageBox.clientHeight || 400; renderer.setSize(w, h, false); fit(camera, controls, w / h); }
        window.addEventListener("resize", resize); resize(); refresh();
        var last = performance.now();
        (function loop(now) { var dt = Math.min(0.05, (now - last) / 1000); last = now; kit.update(dt, now / 1000); controls.update(); renderer.render(scene, camera); requestAnimationFrame(loop); })(last);
        return kit;
      }
    };
  }

  /* ---------------------------------------------------------- tissue model (teaching values, all in mm unless stated) */
  var M = {
    artery: { lumen: 2.2, wall: 0.90 },
    vein: { lumen: 4.0, wall: 0.40, minor: 3.0 },          // lumen = long diameter; minor = short diameter of the oval
    capillary: { lumen_um: 8, wall_um: 0.5, rbc_um: 7 },
    mmPerDiv: 0.08,            // true size of one graticule division at this power (fixed by the optics)
    assumedMmPerDiv: 0.10,     // the "as printed" value a student assumes when the calibration step is skipped
    divisions: 100,            // graticule length in divisions
    fieldMm: 13,               // diameter of the field of view on the slide
    collapsedMinor: 0.7        // short diameter of a squashed vein
  };
  var K = 0.9;                 // cm of 3D model per mm of tissue
  var DEFAULTS = { calibrated: true, calibrating: false, errors: {}, slant_deg: 35, focus: null };

  function model(p) {
    var er = p.errors || {};
    var s = er.slant ? 1 / Math.cos((p.slant_deg || 35) * Math.PI / 180) : 1;
    var calibrated = !!p.calibrated && !er.noCalibration;
    var used = calibrated ? M.mmPerDiv : M.assumedMmPerDiv;
    var veinLumen = er.collapsedVein ? M.collapsedMinor : M.vein.lumen;
    function meas(app) {   // app = apparent size on the slide in mm; student counts divisions then multiplies by the factor in use
      var div = app / M.mmPerDiv; return { div: div, mm: div * used };
    }
    var a = { wall: meas(M.artery.wall * s), lumen: meas(M.artery.lumen * s) };
    var v = { wall: meas(M.vein.wall * s), lumen: meas(er.collapsedVein ? veinLumen : veinLumen * s) };   // collapsed: read across the slit (vertical, unaffected by slant)
    return {
      s: s, calibrated: calibrated, used_mm_per_div: used, true_mm_per_div: M.mmPerDiv, factor: used / M.mmPerDiv,
      artery: { wall_mm: a.wall.mm, lumen_mm: a.lumen.mm, wall_div: a.wall.div, lumen_div: a.lumen.div, outer_mm: a.lumen.mm + 2 * a.wall.mm },
      vein: { wall_mm: v.wall.mm, lumen_mm: v.lumen.mm, wall_div: v.wall.div, lumen_div: v.lumen.div, outer_mm: v.lumen.mm + 2 * v.wall.mm },
      truth: { artery: { wall_mm: M.artery.wall, lumen_mm: M.artery.lumen }, vein: { wall_mm: M.vein.wall, lumen_mm: M.vein.lumen } },
      capillary: { lumen_um: M.capillary.lumen_um, wall_um: M.capillary.wall_um, rbc_um: M.capillary.rbc_um, cellsWide: 1 },
      faults: Object.keys(er).filter(function (k) { return er[k]; })
    };
  }

  /* ---------------------------------------------------------- eyepiece view (CanvasTexture) */
  var VP = 640;
  function vessel(kind, p) {     // geometry in mm in the field: centre + lumen semi-axes
    var m = model(p), collapsed = p.errors && p.errors.collapsedVein;
    if (kind === "artery") return { kind: kind, cx: -3.4, cy: -0.3, al: M.artery.lumen / 2, bl: M.artery.lumen / 2, wall: M.artery.wall, s: m.s };
    return { kind: kind, cx: 3.3, cy: 0.2, al: M.vein.lumen / 2, bl: (collapsed ? M.collapsedMinor : M.vein.minor) / 2, wall: M.vein.wall, s: m.s };
  }
  function ellPath(g, ppm, C, V, f, wob, k, ph, dir) {
    var n = 110, a = V.al + f * V.wall, b = V.bl + f * V.wall;
    for (var i = 0; i < n; i++) {
      var th = (dir < 0 ? n - i : i) / n * TAU, w = 1 + wob * Math.sin(k * th + ph);
      var x = C + (V.cx + a * V.s * w * Math.cos(th)) * ppm, y = C + (V.cy + b * w * Math.sin(th)) * ppm;
      if (i === 0) g.moveTo(x, y); else g.lineTo(x, y);
    }
    g.closePath();
  }
  function ringFill(g, ppm, C, V, f0, f1, wob0, wob1, k, ph, fill) {
    g.beginPath(); ellPath(g, ppm, C, V, f1, wob1, k, ph, 1); ellPath(g, ppm, C, V, f0, wob0, k, ph, 1);
    g.fillStyle = fill; g.fill("evenodd");
  }
  function paintVessel(g, ppm, C, V, seed) {
    var R = rng(seed), art = V.kind === "artery";
    var fi = art ? 0.06 : 0.04, fm = art ? 0.72 : 0.36;                // intima edge, media outer edge (fractions of the wall)
    var wobL = art ? 0.05 : 0.07, kL = art ? 17 : 5, ph = art ? 0.4 : 1.3;
    function pt(f, th, ofs) { var a = V.al + f * V.wall, b = V.bl + f * V.wall; return [C + (V.cx + a * V.s * Math.cos(th)) * ppm, C + (V.cy + b * Math.sin(th)) * ppm]; }
    // adventitia: loose collagen, pale, fibres
    ringFill(g, ppm, C, V, fm, 1, 0.0, 0.02, 7, ph, art ? "#f1d6cf" : "#f3dcd5");
    g.save(); g.beginPath(); ellPath(g, ppm, C, V, 1, 0.02, 7, ph, 1); ellPath(g, ppm, C, V, fm, 0, 7, ph, 1); g.clip("evenodd");
    for (var i = 0; i < 230; i++) {
      var th = R() * TAU, f = fm + R() * (1 - fm), p0 = pt(f, th), len = (6 + R() * 16) * (ppm / 49);
      g.strokeStyle = "rgba(196,120,130," + (0.18 + R() * 0.3) + ")"; g.lineWidth = 1;
      g.beginPath(); g.moveTo(p0[0], p0[1]); g.lineTo(p0[0] + Math.cos(th + 1.57 + (R() - 0.5)) * len, p0[1] + Math.sin(th + 1.57 + (R() - 0.5)) * len); g.stroke();
    }
    var nv = art ? 5 : 3;                                   // vasa vasorum: tiny rings in the outer wall
    for (i = 0; i < nv; i++) { var q = pt(fm + (1 - fm) * (0.45 + R() * 0.3), R() * TAU); g.strokeStyle = "rgba(150,40,70,.8)"; g.lineWidth = 2; g.beginPath(); g.arc(q[0], q[1], 3.2 + R() * 3, 0, TAU); g.stroke(); }
    g.restore();
    // tunica media: smooth muscle + elastic laminae (artery thick, vein thin)
    ringFill(g, ppm, C, V, fi, fm, wobL * 0.6, 0.01, kL, ph, art ? "#d77a92" : "#e29aa8");
    g.save(); g.beginPath(); ellPath(g, ppm, C, V, fm, 0.01, kL, ph, 1); ellPath(g, ppm, C, V, fi, wobL * 0.6, kL, ph, 1); g.clip("evenodd");
    var nn = art ? 420 : 70;
    for (i = 0; i < nn; i++) {
      var t2 = R() * TAU, f2 = fi + R() * (fm - fi), q2 = pt(f2, t2);
      g.save(); g.translate(q2[0], q2[1]); g.rotate(t2 + 1.57 + (R() - 0.5) * 0.3); g.fillStyle = "rgba(78,30,100," + (0.55 + R() * 0.3) + ")";
      g.beginPath(); g.ellipse(0, 0, 4 + R() * 2.5, 1.5 + R() * 0.8, 0, 0, TAU); g.fill(); g.restore();
    }
    var nl = art ? 6 : 2;
    for (i = 0; i < nl; i++) {
      var ff = fi + (fm - fi) * (i + 0.7) / (nl + 0.3);
      g.beginPath(); ellPath(g, ppm, C, V, ff, art ? 0.045 : 0.03, kL - 1 + i % 3, ph + i, 1);
      g.strokeStyle = art ? "rgba(70,24,86,.85)" : "rgba(110,60,120,.45)"; g.lineWidth = art ? 1.7 : 1.1; g.stroke();
    }
    g.restore();
    // intima + endothelium
    ringFill(g, ppm, C, V, 0, fi, wobL, wobL * 0.7, kL, ph, "#efc3bf");
    // lumen
    g.beginPath(); ellPath(g, ppm, C, V, 0, wobL, kL, ph, 1); g.fillStyle = art ? "#fdf8f6" : "#f9f1f4"; g.fill();
    g.strokeStyle = "rgba(60,18,76,.95)"; g.lineWidth = art ? 2.6 : 1.5; g.stroke();                 // internal elastic lamina / endothelial edge
    g.save(); g.beginPath(); ellPath(g, ppm, C, V, 0, wobL, kL, ph, 1); g.clip();
    var nr = art ? 4 : 7;
    for (i = 0; i < nr; i++) {                                                                       // red cells left in the lumen
      var a2 = R() * TAU, rr = R() * 0.6, x = C + (V.cx + Math.cos(a2) * V.al * V.s * rr) * ppm, y = C + (V.cy + Math.sin(a2) * V.bl * rr) * ppm;
      g.fillStyle = "rgba(226,92,104,.9)"; g.beginPath(); g.ellipse(x, y, 5.5, 5.5, 0, 0, TAU); g.fill();
      g.fillStyle = "rgba(250,200,200,.9)"; g.beginPath(); g.ellipse(x, y, 2.2, 2.2, 0, 0, TAU); g.fill();
    }
    g.restore();
    g.beginPath(); ellPath(g, ppm, C, V, 1, 0.02, 7, ph, 1); g.strokeStyle = "rgba(120,50,80,.55)"; g.lineWidth = 1.2; g.stroke();
  }
  function arrowH(g, x0, x1, y, col) {
    g.strokeStyle = col; g.fillStyle = col; g.lineWidth = 3;
    g.beginPath(); g.moveTo(x0, y); g.lineTo(x1, y); g.stroke();
    [[x0, 1], [x1, -1]].forEach(function (e) {
      g.beginPath(); g.moveTo(e[0], y); g.lineTo(e[0] + e[1] * 9 * Math.sign(x1 - x0), y - 5); g.lineTo(e[0] + e[1] * 9 * Math.sign(x1 - x0), y + 5); g.closePath(); g.fill();
      g.beginPath(); g.moveTo(e[0], y - 9); g.lineTo(e[0], y + 9); g.stroke();
    });
  }
  function textPill(g, txt, x, y, col) {
    g.font = "bold 21px Arial, sans-serif"; var w = g.measureText(txt).width + 14;
    g.fillStyle = "rgba(14,22,32,.88)"; g.beginPath(); g.roundRect ? g.roundRect(x - w / 2, y - 14, w, 28, 9) : g.rect(x - w / 2, y - 14, w, 28); g.fill();
    g.fillStyle = col; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(txt, x, y + 1);
  }
  function paintCapillary(g, ppm, C, p, foc) {
    var cx = C, cy = C + 3.95 * ppm, r = 1.5 * ppm, upm = (2 * r) / 60;       // inset shows a field 60 micrometres wide
    var cap = M.capillary;
    g.save(); g.beginPath(); g.arc(cx, cy, r, 0, TAU); g.clip();
    g.fillStyle = "#f4e4e2"; g.fillRect(cx - r, cy - r, 2 * r, 2 * r);
    var R = rng(88);
    for (var i = 0; i < 22; i++) {                                              // pale tissue cells around the capillary
      var x = cx + (R() - 0.5) * 2 * r, y = cy + (R() - 0.5) * 2 * r;
      if (Math.abs(y - cy) < cap.lumen_um * upm * 0.9) continue;
      g.strokeStyle = "rgba(170,110,130,.55)"; g.lineWidth = 1.2; g.beginPath(); g.ellipse(x, y, 14 + R() * 8, 10 + R() * 6, R() * 3, 0, TAU); g.stroke();
      g.fillStyle = "rgba(112,60,140,.55)"; g.beginPath(); g.ellipse(x, y, 4.5, 3.5, R() * 3, 0, TAU); g.fill();
    }
    var h = cap.lumen_um * upm / 2, wt = Math.max(2.2, cap.wall_um * upm);
    g.fillStyle = "#fff6f4"; g.fillRect(cx - r, cy - h, 2 * r, 2 * h);          // lumen
    g.fillStyle = "rgba(116,50,120,.9)";                                         // one flat endothelial cell makes the wall
    g.fillRect(cx - r, cy - h - wt, 2 * r, wt); g.fillRect(cx - r, cy + h, 2 * r, wt);
    g.beginPath(); g.ellipse(cx + 0.15 * r, cy - h - wt * 0.4, 14, 5.5, 0, 0, TAU); g.fill();       // endothelial nucleus bulging in
    for (i = 0; i < 2; i++) {                                                    // red cells in single file, squeezed and folded
      var rx = cx - 0.38 * r + i * 0.78 * r, rw = cap.rbc_um * upm * 0.62, rh = Math.min(h * 0.92, cap.rbc_um * upm * 0.5);
      g.fillStyle = "rgba(222,76,92,.95)"; g.beginPath(); g.ellipse(rx, cy, rw * 1.05, rh, 0, 0, TAU); g.fill();
      g.fillStyle = "rgba(246,170,176,.9)"; g.beginPath(); g.ellipse(rx - 2, cy, rw * 0.38, rh * 0.5, 0, 0, TAU); g.fill();
    }
    g.fillStyle = "#2b3640"; g.fillRect(cx + r * 0.38, cy + r * 0.72, 10 * upm, 4);                  // 10 micrometre bar
    g.font = "bold 15px Arial, sans-serif"; g.textAlign = "left"; g.fillText("10 µm", cx + r * 0.38, cy + r * 0.62);
    g.restore();
    g.beginPath(); g.arc(cx, cy, r, 0, TAU); g.lineWidth = foc === "capillary" ? 7 : 3; g.strokeStyle = foc === "capillary" ? "#ffc23a" : "rgba(40,50,60,.9)"; g.stroke();
    g.font = "bold 16px Arial, sans-serif"; g.fillStyle = "#2b3640"; g.textAlign = "center"; g.textBaseline = "alphabetic"; g.fillText("capillary, zoomed", cx, cy - r - 6);
  }
  function paintGraticule(g, ppm, C) {
    var y = C - 4.2 * ppm, L = M.divisions * M.mmPerDiv * ppm, x0 = C - L / 2;
    g.strokeStyle = "#1c2630"; g.fillStyle = "#1c2630"; g.lineWidth = 1.6;
    g.beginPath(); g.moveTo(x0, y); g.lineTo(x0 + L, y); g.stroke();
    g.lineWidth = 1.1; g.font = "bold 14px Arial, sans-serif"; g.textAlign = "center"; g.textBaseline = "alphabetic";
    for (var i = 0; i <= M.divisions; i++) {
      var x = x0 + i * M.mmPerDiv * ppm, big = i % 10 === 0, mid = i % 5 === 0;
      g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + (big ? 15 : mid ? 11 : 7)); g.stroke();
      if (i % 20 === 0) g.fillText(String(i), x, y - 6);
    }
    g.font = "12px Arial, sans-serif"; g.fillText("graticule (eyepiece divisions)", C, y - 24);
  }
  function paintMicrometre(g, ppm, C, p, m) {
    var y = C - 3.45 * ppm, x0 = C - 4 * ppm;
    g.strokeStyle = "#a8460f"; g.fillStyle = "#a8460f"; g.lineWidth = 1.6;
    g.beginPath(); g.moveTo(x0, y); g.lineTo(x0 + 8 * ppm, y); g.stroke();
    g.font = "bold 14px Arial, sans-serif"; g.textAlign = "center"; g.textBaseline = "alphabetic"; g.lineWidth = 1.1;
    for (var i = 0; i <= 80; i++) {
      var x = x0 + i * 0.1 * ppm, big = i % 10 === 0;
      g.beginPath(); g.moveTo(x, y); g.lineTo(x, y - (big ? 15 : i % 5 === 0 ? 11 : 7)); g.stroke();
      if (big) g.fillText(String(i / 10), x, y + 18);
    }
    g.font = "12px Arial, sans-serif"; g.fillText("stage micrometre: one mark = 0.1 mm", C, y + 36);
    g.fillStyle = "#1c2630"; g.textAlign = "center";
    if (p.calibrated) {
      g.font = "bold 24px Arial, sans-serif"; g.fillText("1 mm covers " + (1 / M.mmPerDiv).toFixed(1) + " divisions", C, C + 0.2 * ppm);
      g.font = "bold 22px Arial, sans-serif"; g.fillText("1 division = " + M.mmPerDiv.toFixed(3) + " mm", C, C + 0.9 * ppm);
      g.font = "15px Arial, sans-serif"; g.fillStyle = "#5b6670"; g.fillText("calibrated: use this value", C, C + 1.6 * ppm);
    } else {
      g.font = "bold 22px Arial, sans-serif"; g.fillText("Line up the two scales", C, C + 0.2 * ppm);
      g.font = "bold 20px Arial, sans-serif"; g.fillText("How many divisions fit 1 mm?", C, C + 0.9 * ppm);
      g.font = "15px Arial, sans-serif"; g.fillStyle = "#5b6670"; g.fillText("then tap Calibrate", C, C + 1.6 * ppm);
    }
  }
  function drawView(cv, p, meas) {
    var S = cv.width, C = S / 2, ppm = S / M.fieldMm, g = cv.getContext("2d"), m = model(p), foc = p.focus;
    g.save(); g.clearRect(0, 0, S, S);
    g.beginPath(); g.arc(C, C, C - 3, 0, TAU); g.clip();
    var bg = g.createRadialGradient(C, C, 20, C, C, C); bg.addColorStop(0, "#fcf8f1"); bg.addColorStop(1, "#ebe3d5"); g.fillStyle = bg; g.fillRect(0, 0, S, S);
    if (p.calibrating) {
      paintMicrometre(g, ppm, C, p, m);
    } else {
      var A = vessel("artery", p), V = vessel("vein", p);
      paintVessel(g, ppm, C, A, 3); paintVessel(g, ppm, C, V, 9);
      g.font = "bold 26px Arial, sans-serif"; g.fillStyle = "#3a1d4a"; g.textAlign = "center"; g.textBaseline = "alphabetic";
      g.fillText("A", C + A.cx * ppm, C + (A.cy - A.bl - A.wall) * ppm - 14); g.fillText("V", C + V.cx * ppm, C + (V.cy - V.bl - V.wall) * ppm - 14);
      // focus highlight
      function ring(Vv, f0, f1) {
        g.beginPath(); ellPath(g, ppm, C, Vv, f1, 0.0, 0, 0, 1); ellPath(g, ppm, C, Vv, f0, 0.0, 0, 0, 1);
        g.fillStyle = "rgba(255,200,40,.38)"; g.fill("evenodd"); g.lineWidth = 4; g.strokeStyle = "#ffb400"; g.stroke();
      }
      if (foc === "artery") ring(A, 0, 1.0); else if (foc === "vein") ring(V, 0, 1.0);
      else if (foc === "media") ring(A, 0.06, 0.72);
      else if (foc === "lumen") { [A, V].forEach(function (Vv) { g.beginPath(); ellPath(g, ppm, C, Vv, 0, 0, 0, 0, 1); g.fillStyle = "rgba(255,200,40,.45)"; g.fill(); g.lineWidth = 4; g.strokeStyle = "#ffb400"; g.stroke(); }); }
      paintCapillary(g, ppm, C, p, foc);
      // graticule readings placed on measured vessels
      [["artery", A], ["vein", V]].forEach(function (e) {
        if (!meas[e[0]]) return;
        var Vv = e[1], r = m[e[0]], xo = C + (Vv.cx - (Vv.al + Vv.wall) * Vv.s) * ppm, xl = C + (Vv.cx - Vv.al * Vv.s) * ppm, xr = C + (Vv.cx + Vv.al * Vv.s) * ppm, y = C + Vv.cy * ppm;
        arrowH(g, xo, xl, y, "#ff9a1a");
        var slit = e[0] === "vein" && p.errors && p.errors.collapsedVein, xm = (xl + xr) / 2;
        if (slit) { g.save(); g.translate(xm, y); g.rotate(Math.PI / 2); arrowH(g, -Vv.bl * ppm, Vv.bl * ppm, 0, "#1fb5d4"); g.restore(); } else arrowH(g, xl + 6, xr, y, "#1fb5d4");
        textPill(g, "wall " + r.wall_mm.toFixed(2) + " mm", xo + 40, y - 30, "#ffb44d");
        textPill(g, "lumen " + r.lumen_mm.toFixed(2) + " mm", (xl + xr) / 2, y + 34, "#6fe0f6");
      });
    }
    paintGraticule(g, ppm, C);
    g.font = "bold 15px Arial, sans-serif"; g.fillStyle = "rgba(40,50,60,.8)"; g.textAlign = "center"; g.textBaseline = "alphabetic";
    g.fillText("low power, field " + M.fieldMm + " mm", C, S - 18);
    if (!p.calibrating && !m.calibrated) { g.fillStyle = "rgba(200,50,40,.9)"; g.fillText("graticule NOT calibrated", C, S - 38); }
    var vg = g.createRadialGradient(C, C, C * 0.8, C, C, C); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(20,25,30,.5)");
    g.fillStyle = vg; g.fillRect(0, 0, S, S);
    g.restore();
  }

  /* section sticker on the glass slide (tiny version of the same painter, transparent background) */
  function sectionTexture() {
    return ctex(512, 256, function (g, w, h) {
      var cv2 = document.createElement("canvas"); cv2.width = cv2.height = 256; var g2 = cv2.getContext("2d"), pp = 256 / 13;
      var p = { errors: {}, slant_deg: 35 }, A = vessel("artery", p), V = vessel("vein", p);
      paintVessel(g2, pp, 128, A, 3); paintVessel(g2, pp, 128, V, 9);
      g.clearRect(0, 0, w, h); g.drawImage(cv2, 0, 0, 256, 256, 128, 0, 256, 256);
    });
  }

  /* ---------------------------------------------------------- 3D reference vessels */
  function layerMesh(a0, b0, a1, b1, depth, col, wob, k) {
    var g = ringGeo(ellipsePts(a1, b1, 72, wob || 0, k || 0, 0.4), ellipsePts(a0, b0, 72, wob || 0, k || 0, 0.4), depth);
    return new THREE.Mesh(g, std(col, 0.55, 0, { emissive: new THREE.Color(0x000000) }));
  }
  function buildVesselSection(kind, depth) {
    var art = kind === "artery", grp = new THREE.Group(), meshes = [];
    var al = (art ? M.artery.lumen / 2 : M.vein.lumen / 2) * K, bl = (art ? M.artery.lumen / 2 : M.vein.minor / 2) * K, wall = (art ? M.artery.wall : M.vein.wall) * K;
    var fi = art ? 0.06 : 0.04, fm = art ? 0.72 : 0.36;
    function ab(f) { return [al + f * wall, bl + f * wall]; }
    var i0 = ab(0), i1 = ab(fi), m1 = ab(fm), o = ab(1);
    var intima = layerMesh(i0[0], i0[1], i1[0], i1[1], depth, 0xe9b6ae, 0.04, 15);
    var media = layerMesh(i1[0], i1[1], m1[0], m1[1], depth, art ? 0xb8465f : 0xd88a98);
    var adv = layerMesh(m1[0], m1[1], o[0], o[1], depth, 0xecd3c8);
    [adv, media, intima].forEach(function (m) { grp.add(m); meshes.push(m); });
    var nl = art ? 5 : 2, lam = std(0x45185a, 0.4);
    for (var i = 0; i < nl; i++) {
      var f = fi + (fm - fi) * (i + 0.7) / (nl + 0.3), q = ab(f);
      var tube = new THREE.Mesh(new THREE.TubeGeometry(wavyClosedCurve(q[0], q[1], 90, art ? 0.04 : 0.03, 13 + i, i, depth + 0.01), 120, 0.014, 4, true), lam); grp.add(tube);
    }
    var fluid = new THREE.Mesh(new THREE.ExtrudeGeometry(new THREE.Shape(ellipsePts(i0[0], i0[1], 64, 0.04, 15, 0.4)), { depth: depth * 0.96, bevelEnabled: false }), liquid(art ? 0xc02432 : 0x5a2f8c, 0.55));
    grp.add(fluid);
    return { group: grp, media: media, meshes: meshes, fluid: fluid, outerA: o[0], outerB: o[1] };
  }
  function buildValveStub() {
    var grp = new THREE.Group(), R = 1.15, L = 3.8, T = 0.12, meshes = [];
    // vein opened lengthways (back half kept): half-pipe lathe, lumen side pale, outside pink
    var prof = [[R - T, -L / 2], [R, -L / 2], [R, L / 2], [R - T, L / 2], [R - T, -L / 2]];
    var pg = new THREE.LatheGeometry(prof.map(function (q) { return new THREE.Vector2(q[0], q[1]); }), 40, Math.PI * 0.5, Math.PI);
    pg.rotateZ(-Math.PI / 2); pg.computeVertexNormals();
    var half = new THREE.Mesh(pg, std(0xd98f9c, 0.55, 0, { side: THREE.DoubleSide, emissive: new THREE.Color(0x000000) })); grp.add(half); meshes.push(half);
    var lg = new THREE.LatheGeometry([[R - T - 0.01, -L / 2 + 0.02], [R - T - 0.01, L / 2 - 0.02]].map(function (q) { return new THREE.Vector2(q[0], q[1]); }), 40, Math.PI * 0.5, Math.PI);
    lg.rotateZ(-Math.PI / 2); lg.computeVertexNormals();
    var lin = new THREE.Mesh(lg, std(0xf3cfc8, 0.45, 0, { side: THREE.DoubleSide, emissive: new THREE.Color(0x000000) })); grp.add(lin); meshes.push(lin);
    // blood left in the vein (back half of the lumen)
    var bg = new THREE.LatheGeometry([[0.0, -L / 2 + 0.05], [R * 0.7, -L / 2 + 0.05], [R * 0.7, -0.1], [0.0, -0.1]].map(function (q) { return new THREE.Vector2(q[0], q[1]); }), 28, Math.PI * 0.5, Math.PI);
    bg.rotateZ(-Math.PI / 2); var blood = new THREE.Mesh(bg, liquid(0x5a2f8c, 0.4)); blood.position.x = -0.0; grp.add(blood);
    // pocket valve: two thin crescent leaflets (cut face shown) leaning with the flow, free edges nearly meeting
    var sh = new THREE.Shape(); var r0 = R - T - 0.02;
    sh.moveTo(-0.9, r0); sh.bezierCurveTo(-0.5, 0.55, 0.3, 0.25, 1.0, 0.16); sh.bezierCurveTo(0.7, 0.55, 0.6, r0 - 0.35, 0.45, r0); sh.lineTo(-0.9, r0);
    var cuspMat = std(0xf8e0d8, 0.4, 0, { side: THREE.DoubleSide, emissive: new THREE.Color(0x000000) });
    [1, -1].forEach(function (sd) {
      var gg = new THREE.ExtrudeGeometry(sh, { depth: 0.55, bevelEnabled: false }); gg.translate(0, 0, -0.55);
      var c = new THREE.Mesh(gg, cuspMat); c.scale.y = sd; grp.add(c); meshes.push(c);
    });
    var arrow = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.5, 14), std(0x2b88c8, 0.4)); arrow.rotation.z = -Math.PI / 2; arrow.position.set(L / 2 + 0.5, 0.0, -0.3); grp.add(arrow);
    var shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.7, 10), std(0x2b88c8, 0.4)); shaft.rotation.z = Math.PI / 2; shaft.position.set(L / 2 + 0.1, 0, -0.3); grp.add(shaft);
    return { group: grp, meshes: meshes };
  }
  function buildCapillary() {
    var grp = new THREE.Group(), meshes = [];
    var pts = [[-1.9, 0, 0], [-1.0, 0.12, 0.05], [0, -0.1, -0.05], [1.0, 0.1, 0.05], [1.9, 0, 0]].map(function (a) { return new THREE.Vector3(a[0], a[1], a[2]); });
    var curve = new THREE.CatmullRomCurve3(pts);
    var wallM = new THREE.Mesh(new THREE.TubeGeometry(curve, 48, 0.3, 14, false), glass(0xe8bdd2, 0.32, 0.2)); grp.add(wallM); meshes.push(wallM);
    [0.1, 0.55].forEach(function (u) {                                      // endothelial nuclei bulging at the wall
      var p = curve.getPoint(u), n = new THREE.Mesh(new THREE.SphereGeometry(0.17, 12, 8), std(0x6a2d86, 0.5, 0, { emissive: new THREE.Color(0x000000) }));
      n.scale.set(1.6, 0.7, 0.9); n.position.set(p.x, p.y + 0.3, p.z); grp.add(n); meshes.push(n);
    });
    var rg = rbcGeometry(0.2), rm = std(0xdc2f3a, 0.35, 0, { emissive: new THREE.Color(0x7f1d1d), emissiveIntensity: 0.3 }), cells = [];
    for (var i = 0; i < 3; i++) { var c = new THREE.Mesh(rg, rm); c.userData.u0 = i / 3; grp.add(c); cells.push(c); }
    var stand = new THREE.Mesh(lathe([[0, 0], [0.7, 0], [0.7, 0.1], [0.2, 0.18], [0.12, 0.9], [0, 0.9]], 20), std(0x1d2430, 0.4, 0.5)); stand.position.y = -1.0; grp.add(stand);
    return { group: grp, curve: curve, cells: cells, meshes: meshes };
  }
  function graticuleDisc() {
    var grp = new THREE.Group();
    var rim = new THREE.Mesh(lathe([[1.15, 0], [1.2, 0.03], [1.2, 0.13], [1.1, 0.16], [1.1, 0.03]], 40), std(0x2a323c, 0.35, 0.8)); grp.add(rim);
    var gl = new THREE.Mesh(new THREE.CircleGeometry(1.1, 40), new THREE.MeshStandardMaterial({
      roughness: 0.1, transparent: true, side: THREE.DoubleSide, map: ctex(256, 256, function (g, w, h) {
        g.fillStyle = "rgba(210,235,240,.35)"; g.fillRect(0, 0, w, h); g.strokeStyle = "#101820"; g.lineWidth = 1.2;
        for (var i = 0; i <= 100; i++) { var x = 28 + i * 2, big = i % 10 === 0; g.beginPath(); g.moveTo(x, 128); g.lineTo(x, 128 + (big ? 14 : i % 5 === 0 ? 10 : 6)); g.stroke(); }
        g.beginPath(); g.moveTo(28, 128); g.lineTo(228, 128); g.stroke();
      })
    }));
    gl.rotation.x = -Math.PI / 2; gl.position.y = 0.1; grp.add(gl); return grp;
  }
  function micrometreSlide() {
    var grp = buildSlide(7.6, 2.6, 0.12, "STAGE|MICROMETRE", "#f0e6d2");
    var sc = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 0.9), new THREE.MeshBasicMaterial({
      transparent: true, map: ctex(512, 100, function (g, w, h) {
        g.clearRect(0, 0, w, h); g.strokeStyle = "#a8460f"; g.fillStyle = "#a8460f"; g.lineWidth = 2;
        g.beginPath(); g.moveTo(8, 60); g.lineTo(w - 8, 60); g.stroke(); g.font = "bold 20px Arial"; g.textAlign = "center";
        for (var i = 0; i <= 40; i++) { var x = 8 + i * (w - 16) / 40, big = i % 10 === 0; g.beginPath(); g.moveTo(x, 60); g.lineTo(x, 60 - (big ? 26 : i % 5 === 0 ? 18 : 12)); g.stroke(); if (big) g.fillText(String(i / 10), x, 92); }
      })
    }));
    sc.rotation.x = -Math.PI / 2; sc.position.set(0.8, 0.13, 0); grp.add(sc); return grp;
  }

  /* ---------------------------------------------------------- the kit */
  function create(opts) {
    var p = {}; for (var k in DEFAULTS) p[k] = DEFAULTS[k];
    if (opts) for (var k2 in opts) if (opts[k2] !== undefined) p[k2] = opts[k2];
    p.errors = JSON.parse(JSON.stringify(p.errors || {}));
    var g = new THREE.Group(), parts = {}, meas = { artery: false, vein: false }, dirty = true, clock = 0, hl = [];

    g.add(buildBench());
    var tile = buildTile(13.4, 8.6); tile.position.set(0, 0, 3.4); g.add(tile);
    var tile2 = buildTile(23, 6.6); tile2.position.set(0, 0, -4.6); g.add(tile2);

    // main slide with the artery + vein section, and its cover slip
    var slide = buildSlide(7.6, 2.6, 0.12, "ARTERY|VEIN", "#e8efe6"); slide.position.set(-1.6, 0.3, 1.5); g.add(tag(slide, "slide")); parts.slide = slide;
    var sec = new THREE.Mesh(new THREE.PlaneGeometry(4.0, 2.0), new THREE.MeshBasicMaterial({ map: sectionTexture(), transparent: true }));
    sec.rotation.x = -Math.PI / 2; sec.position.set(0.9, 0.128, 0); slide.add(sec);
    var cov = new THREE.Mesh(slab(2.4, 2.2, 0.06, 0.04, 0.02), glass(0xe4f4f8, 0.3, 0.05)); cov.position.set(0.9, 0.12, 0); slide.add(tag(cov, "coverslip")); parts.coverslip = cov;
    var mic = micrometreSlide(); mic.position.set(-1.6, 0.3, 4.8); g.add(tag(mic, "micrometre")); parts.micrometre = mic;
    var grat = graticuleDisc(); grat.position.set(4.9, 0.3, 3.2); g.add(tag(grat, "graticule")); parts.graticule = grat;

    // eyepiece view
    var vd = buildViewDisc(VP); g.add(tag(vd.group, "view")); parts.view = vd.group;

    // 3D reference: artery and vein cross-sections, opened vein with valve, capillary
    var depth = 1.1, tilt = -1.0;
    var art = buildVesselSection("artery", depth), vein = buildVesselSection("vein", depth);
    var artG = new THREE.Group(); artG.add(art.group); artG.position.set(-6.4, 2.7, -4.6); artG.rotation.x = tilt; art.group.position.z = -depth / 2; g.add(tag(artG, "artery")); parts.artery = artG;
    var veinG = new THREE.Group(); veinG.add(vein.group); veinG.position.set(-1.6, 2.7, -4.6); veinG.rotation.x = tilt; vein.group.position.z = -depth / 2; g.add(tag(veinG, "vein")); parts.vein = veinG;
    [-6.4, -1.6].forEach(function (x) { var st = new THREE.Mesh(lathe([[0, 0], [1.2, 0], [1.2, 0.12], [0.3, 0.2], [0.22, 1.4], [0, 1.4]], 24), std(0x1d2430, 0.4, 0.5)); st.position.set(x, 0.3, -4.9); g.add(st); });
    tag(art.media, "tunicaMedia"); parts.tunicaMedia = art.media; tag(vein.media, "veinMedia"); parts.veinMedia = vein.media;
    tag(art.fluid, "lumen"); parts.lumen = art.fluid; tag(vein.fluid, "veinLumen"); parts.veinLumen = vein.fluid;
    var vs = buildValveStub(); vs.group.position.set(3.1, 1.55, -4.6); g.add(tag(vs.group, "valve")); parts.valve = vs.group;
    var st2 = new THREE.Mesh(slab(4.6, 2.0, 0.3, 0.2, 0.05), std(0x1d2430, 0.4, 0.5)); st2.position.set(3.1, 0.3, -4.6); g.add(st2);
    var cap = buildCapillary(); cap.group.position.set(8.3, 1.7, -4.6); cap.group.scale.setScalar(0.8); g.add(tag(cap.group, "capillary")); parts.capillary = cap.group;

    var focusMap = {
      artery: art.meshes.concat([art.fluid]), vein: vein.meshes.concat([vein.fluid]), media: [art.media], lumen: [art.fluid, vein.fluid],
      valve: vs.meshes, capillary: cap.meshes
    };

    var vtex = vd.tex, vcv = vd.canvas;
    function emit(name, detail) { if (typeof api.onEvent === "function") try { api.onEvent(name, detail); } catch (e) {} }
    function reading() {
      var m = model(p);
      var sel = meas.vein && !meas.artery ? "vein" : "artery";
      var r = {
        part: sel, wall_mm: round(m[sel].wall_mm), lumen_mm: round(m[sel].lumen_mm), wall_div: round(m[sel].wall_div, 1), lumen_div: round(m[sel].lumen_div, 1),
        ratio: round(m[sel].wall_mm / m[sel].lumen_mm),
        artery: roundObj(m.artery), vein: roundObj(m.vein), capillary: m.capillary, truth: m.truth,
        calibrated: m.calibrated, calibrating: !!p.calibrating, mm_per_div_used: m.used_mm_per_div, mm_per_div_true: m.true_mm_per_div, factor: round(m.factor),
        measured: { artery: meas.artery, vein: meas.vein }, slantFactor: round(m.s), errors: m.faults, focus: p.focus,
        wallRatioVeinToArtery: round(m.vein.wall_mm / m.artery.wall_mm), lumenRatioVeinToArtery: round(m.vein.lumen_mm / m.artery.lumen_mm)
      };
      return r;
    }
    function round(x, d) { var f = Math.pow(10, d == null ? 2 : d); return Math.round(x * f) / f; }
    function roundObj(o) { var r = {}; for (var k in o) r[k] = round(o[k], k.indexOf("div") > 0 ? 1 : 2); return r; }

    function setFocus(f) {
      pulseMeshes(hl, false, 0); hl = f && focusMap[f] ? focusMap[f] : []; p.focus = f || null; dirty = true; emit("focus", { focus: p.focus });
    }
    var api = g;
    api.parts = parts; g.userData.parts = parts; g.group = g; g.isKit = true; api.params = p; api.reading = reading;
    api.measure = function (part) {
      if (part !== "artery" && part !== "vein") return reading();
      p.calibrating = false; meas[part] = true; dirty = true;
      var r = reading(); r.part = part; r.wall_mm = round(model(p)[part].wall_mm); r.lumen_mm = round(model(p)[part].lumen_mm);
      r.wall_div = round(model(p)[part].wall_div, 1); r.lumen_div = round(model(p)[part].lumen_div, 1); r.ratio = round(r.wall_mm / r.lumen_mm);
      emit("measure", r); return r;
    };
    api.calibrate = function () { p.calibrated = true; p.calibrating = false; dirty = true; var r = reading(); emit("calibrate", r); return r; };
    api.highlight = function (f) { setFocus(f); };
    api.reset = function () { meas.artery = meas.vein = false; p.calibrating = false; p.calibrated = DEFAULTS.calibrated; setFocus(null); dirty = true; emit("state", reading()); };
    api.setState = function (o) {
      o = o || {};
      ["calibrated", "calibrating", "slant_deg"].forEach(function (k) { if (o[k] !== undefined) p[k] = o[k]; });
      if (o.errors) p.errors = JSON.parse(JSON.stringify(o.errors));
      if (o.focus !== undefined) setFocus(o.focus);
      dirty = true; emit("state", reading());
    };
    g.setState = api.setState;
    api.update = function (dt, t) {
      dt = Math.min(dt || 0.016, 0.1); clock += dt; t = t == null ? clock : t;
      if (dirty) { drawView(vcv, p, meas); vtex.needsUpdate = true; dirty = false; }
      if (hl.length) pulseMeshes(hl, true, t);
      cap.cells.forEach(function (c) {                                      // red cells squeeze through one at a time
        var u = (c.userData.u0 + t * 0.07) % 1, pt = cap.curve.getPoint(u), tg = cap.curve.getTangent(u);
        c.position.copy(pt); c.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(-tg.y, tg.x, 0).normalize());
      });
    };
    api.settle = function (sec) { var n = Math.ceil((sec || 2) / 0.05); for (var i = 0; i < n; i++) api.update(0.05); };
    api.tick = api.update; g.userData.update = api.update; g.userData.setState = api.setState;
    api.dispose = function () { g.traverse(function (o) { if (o.geometry) o.geometry.dispose(); }); };
    setFocus(p.focus);
    api.update(0.016, 0);
    return g;
  }

  global.VesselSlideBench = { version: 1, create: create, lights: lights, environment: environment, fit: fit, model: model, MODEL: M, DEFAULTS: DEFAULTS };

  mountKit("vessel-slide-bench", create, DEFAULTS, {
    buttons: function (kit, btn) {
      var foci = [null, "artery", "vein", "media", "lumen", "valve", "capillary"], fi = 0;
      btn("Calibrate", function () { if (kit.params.calibrating) kit.calibrate(); else kit.setState({ calibrating: true, calibrated: false }); });
      btn("Measure artery", function () { kit.measure("artery"); });
      btn("Measure vein", function () { kit.measure("vein"); });
      btn("Focus", function () { fi = (fi + 1) % foci.length; kit.setState({ focus: foci[fi] }); });
      btn("Slant", function () { var e = kit.params.errors; kit.setState({ errors: { slant: !e.slant, collapsedVein: !!e.collapsedVein, noCalibration: !!e.noCalibration } }); });
      btn("Collapse vein", function () { var e = kit.params.errors; kit.setState({ errors: { slant: !!e.slant, collapsedVein: !e.collapsedVein, noCalibration: !!e.noCalibration } }); });
      btn("Skip calib.", function () { var e = kit.params.errors; kit.setState({ errors: { slant: !!e.slant, collapsedVein: !!e.collapsedVein, noCalibration: !e.noCalibration } }); });
      btn("Reset", function () { kit.reset(); kit.setState({ errors: {} }); });
    },
    refresh: function (kit) {
      var r = kit.reading();
      return "artery wall " + r.artery.wall_mm.toFixed(2) + " mm | lumen " + r.artery.lumen_mm.toFixed(2) + " mm\n" +
        "vein   wall " + r.vein.wall_mm.toFixed(2) + " mm | lumen " + r.vein.lumen_mm.toFixed(2) + " mm\n" +
        "graticule " + (r.calibrated ? "calibrated" : "NOT calibrated") + ", 1 division = " + r.mm_per_div_used.toFixed(3) + " mm (true " + r.mm_per_div_true.toFixed(3) + ")" +
        (r.errors.length ? "\nfaults: " + r.errors.join(", ") : "");
    }
  });
})(window);
