/* =========================================================
   StudyPipe · BloodCountBench v1 — stained blood smear (x100 / x400) and Neubauer-style haemocytometer red cell count (Lesson 06)
   Classic script (no modules), fully offline, needs window.THREE (three.js r160 bundle). No SceneKit / HeartKit dependency.

   Units: 1 scene unit = 1 cm.   Y is up.   Bench top at y = 0.

   API
     var kit = BloodCountBench.create({ mode, view, sickle, clot, dilution, rbc_per_mm3, counts, focus });
     scene.add(kit);                    // kit is a THREE.Group
     kit.parts      -> { name: Object3D }  (also kit.userData.parts)
     kit.update(dt, t)  (also kit.tick)     call every frame
     kit.setState({ mode, view, sickle, clot, focus, square })
     kit.nextSquare()                       moves to the next of the 5 medium squares and returns its count + running reading
     kit.reading()                          computed from the model (never typed text)
     kit.reset()                            forgets the squares counted
     kit.onEvent = function (name, detail)  'count' | 'count-done' | 'state' | 'focus'
   Also: BloodCountBench.environment(renderer), .lights(scene), .fit(camera, controls, aspect), .model(params), .squareCounts(params)

   Parts (userData.partId set): slide, haemocytometer, grid, coverslip, pipette, tube, view,
     rbc, sickleCells, phagocyte, lymphocyte, platelet, fibrin
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

  /* ---------------------------------------------------------- model */
  var STD_COUNTS = [98, 92, 101, 95, 94];                  // five medium squares: four corners then the centre (sum 480)
  var SQ = [[-2, -2], [2, -2], [-2, 2], [2, 2], [0, 0]];   // medium-square grid positions (0.2 mm each), y down on screen
  var SQ_MM = 0.2, DEPTH_MM = 0.1, VOL_SQ = SQ_MM * SQ_MM * DEPTH_MM;     // 0.004 mm3 per medium square
  var FIELD_UM = { 100: 1800, 400: 360 };
  var DEFAULTS = { mode: "smear", view: 400, sickle: false, clot: 0, dilution: 200, rbc_per_mm3: 4.8e6, counts: null, focus: null, square: -1, counted: 0, annotate: false };

  function squareCounts(p) {
    if (p.counts && p.counts.length === 5) return p.counts.slice();
    var rbc = p.rbc_per_mm3 == null ? 4.8e6 : p.rbc_per_mm3;
    if (rbc === 4.8e6 && (p.dilution || 200) === 200) return STD_COUNTS.slice();
    var mean = rbc * VOL_SQ / (p.dilution || 200), R = rng(2024), out = [], sum = 0, target = Math.round(mean * 5);
    for (var i = 0; i < 5; i++) { var c = Math.max(0, Math.round(mean * (1 + (R() - 0.5) * 0.14))); out.push(c); sum += c; }
    out[4] = Math.max(0, out[4] + (target - sum));
    return out;
  }
  function model(p) {
    var counts = squareCounts(p), n = clamp(p.counted | 0, 0, 5), total = 0, i;
    for (i = 0; i < n; i++) total += counts[i];
    var vol = n * VOL_SQ, dil = p.dilution || 200;
    var diluted = vol > 0 ? total / vol : 0;
    return {
      counts: counts.slice(0, n), allCounts: counts, squares: n, total: total, volume_mm3: +vol.toFixed(4), dilution: dil,
      diluted: Math.round(diluted), undiluted: Math.round(diluted * dil), mean_per_square: n ? +(total / n).toFixed(1) : 0,
      current: p.square >= 0 && p.square < n ? counts[p.square] : null, done: n >= 5, field_um: FIELD_UM[p.view] || 360
    };
  }

  /* ---------------------------------------------------------- 2D painters */
  var VP = 768;
  function cellDraw(g, x, y, r, stained, rot) {
    g.fillStyle = stained ? "#e08a92" : "#e5b7ae"; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();
    g.strokeStyle = stained ? "rgba(168,66,86,.8)" : "rgba(160,92,86,.85)"; g.lineWidth = Math.max(1, r * 0.16); g.stroke();
    g.fillStyle = stained ? "#f6d2d4" : "#f7e6e1"; g.beginPath(); g.arc(x, y, r * 0.42, 0, TAU); g.fill();       // pale centre (biconcave)
  }
  function sickleDraw(g, x, y, r, rot) {
    g.save(); g.translate(x, y); g.rotate(rot); g.fillStyle = "#cf6a79"; g.strokeStyle = "rgba(130,40,70,.85)"; g.lineWidth = Math.max(1, r * 0.14);
    g.beginPath(); g.moveTo(-r * 1.45, 0.1 * r); g.quadraticCurveTo(0, -r * 1.7, r * 1.45, 0.1 * r); g.quadraticCurveTo(0, -r * 0.55, -r * 1.45, 0.1 * r); g.closePath(); g.fill(); g.stroke(); g.restore();
  }
  function plateletDraw(g, x, y, r) {
    g.fillStyle = "#a0509e"; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();
    g.fillStyle = "rgba(210,150,214,.9)"; g.beginPath(); g.arc(x - r * 0.2, y - r * 0.2, r * 0.45, 0, TAU); g.fill();
  }
  function phagocyteDraw(g, x, y, u) {                 // neutrophil-type phagocyte: pale granular cytoplasm, 3 to 4 lobed nucleus
    var r = 6.6 * u;
    g.fillStyle = "#dccde3"; g.strokeStyle = "rgba(120,80,150,.55)"; g.lineWidth = 1.2; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); g.stroke();
    var R = rng(5); g.fillStyle = "rgba(200,150,200,.6)";
    for (var i = 0; i < 26; i++) { var a = R() * TAU, d = R() * r * 0.9; g.beginPath(); g.arc(x + Math.cos(a) * d, y + Math.sin(a) * d, 0.7 * u, 0, TAU); g.fill(); }
    var lobes = [[-0.38, -0.22], [0.0, 0.26], [0.4, -0.1], [0.34, 0.4]];
    g.strokeStyle = "#4b2a86"; g.lineWidth = 1.8 * u; g.lineCap = "round"; g.beginPath();
    lobes.forEach(function (l, i) { var px = x + l[0] * r, py = y + l[1] * r; if (i) g.lineTo(px, py); else g.moveTo(px, py); }); g.stroke();
    g.fillStyle = "#4b2a86"; lobes.forEach(function (l) { g.beginPath(); g.ellipse(x + l[0] * r, y + l[1] * r, 2.7 * u, 2.2 * u, 0.5, 0, TAU); g.fill(); });
  }
  function lymphDraw(g, x, y, u) {                    // lymphocyte: round nucleus filling most of the cell, thin blue cytoplasm rim
    var r = 4.8 * u;
    g.fillStyle = "#9cc2e6"; g.strokeStyle = "rgba(70,100,160,.7)"; g.lineWidth = 1.2; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); g.stroke();
    g.fillStyle = "#3d2a86"; g.beginPath(); g.arc(x - 0.15 * u, y + 0.1 * u, r * 0.78, 0, TAU); g.fill();
    g.fillStyle = "rgba(120,100,200,.6)"; g.beginPath(); g.arc(x - r * 0.25, y - r * 0.2, r * 0.25, 0, TAU); g.fill();
  }
  function smearField(p) {                             // cell positions at x400 (pixels on the view canvas), deterministic
    var key = "s" + (p.sickle ? 1 : 0) + "|" + Math.round((p.clot || 0) * 10);
    if (smearField.k === key) return smearField.v;
    var S = VP, C = S / 2, u = S / FIELD_UM[400], r = 3.8 * u, R = rng(12), out = { rbc: [], plt: [], fib: [], wbc: { x: C - 125, y: C - 95 }, lym: { x: C + 150, y: C + 105 }, u: u };
    var tries = 0, cell, i;
    while (out.rbc.length < 270 && tries++ < 9000) {
      var x = C + (R() * 2 - 1) * (C - 8), y = C + (R() * 2 - 1) * (C - 8); if (Math.hypot(x - C, y - C) > C - r - 8) continue;
      if (Math.hypot(x - out.wbc.x, y - out.wbc.y) < 6.6 * u + r) continue; if (Math.hypot(x - out.lym.x, y - out.lym.y) < 4.8 * u + r) continue;
      var ok = true; for (i = 0; i < out.rbc.length; i++) { var o = out.rbc[i]; if (Math.hypot(x - o.x, y - o.y) < 2 * r * 0.82) { ok = false; break; } }
      if (ok) out.rbc.push({ x: x, y: y, sick: R() < 0.35, rot: R() * TAU });
    }
    var clot = p.clot || 0, cl = [[C - 190, C + 170], [C + 120, C - 170], [C + 30, C + 10]];
    for (i = 0; i < 9; i++) {
      var q = { x: 0, y: 0 }, x0 = C + (R() * 2 - 1) * (C - 20), y0 = C + (R() * 2 - 1) * (C - 20), c = cl[i % 3];
      if (Math.hypot(x0 - C, y0 - C) > C - 22) { x0 = C - 60 + i * 12; y0 = C + 60; }
      q.x = lerp(x0, c[0] + (R() - 0.5) * 34, clot); q.y = lerp(y0, c[1] + (R() - 0.5) * 34, clot); out.plt.push(q);
    }
    if (clot > 0.02) {                                  // fibrin: a tangled net of fine threads between the platelet clumps
      for (i = 0; i < 3; i++) for (var k = 0; k < 7; k++) { var a = k / 7 * TAU + R(), L = (80 + R() * 110) * clot, c0 = cl[i]; out.fib.push([c0[0], c0[1], c0[0] + Math.cos(a) * L, c0[1] + Math.sin(a) * L, (R() - 0.5) * 40]); }
      for (i = 0; i < 6; i++) { var A = cl[i % 3], B = cl[(i + 1) % 3]; out.fib.push([A[0], A[1], B[0] + (R() - 0.5) * 60, B[1] + (R() - 0.5) * 60, (R() - 0.5) * 50]); }
    }
    smearField.k = key; smearField.v = out; return out;
  }
  function paintSmear400(g, p, focus) {
    var S = VP, C = S / 2, F = smearField(p), u = F.u, r = 3.8 * u, i, clot = p.clot || 0;
    var bg = g.createRadialGradient(C, C, 30, C, C, C); bg.addColorStop(0, "#f9f1ee"); bg.addColorStop(1, "#efe3df"); g.fillStyle = bg; g.fillRect(0, 0, S, S);
    if (F.fib.length) {
      g.lineCap = "round";
      F.fib.forEach(function (f) { g.strokeStyle = "rgba(150,110,170," + (0.35 + 0.5 * clot) + ")"; g.lineWidth = 1.2 + 1.4 * clot; g.beginPath(); g.moveTo(f[0], f[1]); g.quadraticCurveTo((f[0] + f[2]) / 2 + f[4], (f[1] + f[3]) / 2 - f[4], f[2], f[3]); g.stroke(); });
    }
    F.rbc.forEach(function (c) { if (p.sickle && c.sick) sickleDraw(g, c.x, c.y, r, c.rot); else cellDraw(g, c.x, c.y, r, true); });
    F.plt.forEach(function (q) { plateletDraw(g, q.x, q.y, 1.5 * u); });
    phagocyteDraw(g, F.wbc.x, F.wbc.y, u); lymphDraw(g, F.lym.x, F.lym.y, u);
    function ring(x, y, rr, lab, lx, ly) {
      g.strokeStyle = "#ffb400"; g.lineWidth = 3.5; g.beginPath(); g.arc(x, y, rr, 0, TAU); g.stroke();
      if (lab) { g.font = "bold 20px Arial, sans-serif"; var w = g.measureText(lab).width + 14; g.fillStyle = "rgba(14,22,32,.9)"; g.fillRect(lx - w / 2, ly - 15, w, 28); g.fillStyle = "#ffcf66"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(lab, lx, ly); }
    }
    if (focus === "phagocyte") ring(F.wbc.x, F.wbc.y, 6.6 * u + 8, "phagocyte", F.wbc.x, F.wbc.y - 6.6 * u - 26);
    else if (focus === "lymphocyte") ring(F.lym.x, F.lym.y, 4.8 * u + 8, "lymphocyte", F.lym.x, F.lym.y - 4.8 * u - 26);
    else if (focus === "platelet") F.plt.forEach(function (q, i) { ring(q.x, q.y, 11, i === 0 ? "platelet" : null, q.x, q.y - 26); });
    else if (focus === "rbc") { for (i = 0; i < 5; i++) { var c = F.rbc[i * 9]; ring(c.x, c.y, r + 6, i === 0 ? "red cell" : null, c.x, c.y - r - 24); } }
    else if (focus === "fibrin" && F.fib.length) { g.strokeStyle = "rgba(255,180,0,.9)"; g.lineWidth = 4; F.fib.forEach(function (f) { g.beginPath(); g.moveTo(f[0], f[1]); g.quadraticCurveTo((f[0] + f[2]) / 2 + f[4], (f[1] + f[3]) / 2 - f[4], f[2], f[3]); g.stroke(); }); }
    if (p.annotate) { g.font = "bold 17px Arial, sans-serif"; g.fillStyle = "#3a1d4a"; g.textAlign = "center"; g.fillText("phagocyte", F.wbc.x, F.wbc.y - 6.6 * u - 8); g.fillText("lymphocyte", F.lym.x, F.lym.y - 4.8 * u - 8); }
  }
  function paintSmear100(g, p) {
    var S = VP, C = S / 2, R = rng(31), i;
    var bg = g.createRadialGradient(C, C, 30, C, C, C); bg.addColorStop(0, "#f7ece9"); bg.addColorStop(1, "#ecdcd8"); g.fillStyle = bg; g.fillRect(0, 0, S, S);
    for (i = 0; i < 3600; i++) {                      // red cells are only dots at this power
      var x = R() * S, y = R() * S, a = 0.45 + R() * 0.4;
      g.fillStyle = "rgba(214,98,112," + a + ")"; g.beginPath(); g.arc(x, y, 1.9, 0, TAU); g.fill();
    }
    for (i = 0; i < 16; i++) { g.fillStyle = "#4b2a86"; g.beginPath(); g.arc(R() * S, R() * S, 3.4, 0, TAU); g.fill(); }    // white cells
    g.font = "bold 17px Arial, sans-serif"; g.fillStyle = "rgba(60,30,80,.85)"; g.textAlign = "center"; g.fillText("dark purple dots: white cells", C, S - 52);
  }
  /* ruled grid: centre of the grid (mm 0,0) at canvas (ox, oy); visible region only */
  function paintGrid(g, ox, oy, ppm, W, H, tint) {
    var k, m = 1.5, lines = function (x0, y0, x1, y1) { g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); };
    g.lineCap = "butt";
    for (k = -30; k <= 30; k++) {
      var d = k * 0.05, X = ox + d * ppm, Y = oy + d * ppm, med = k % 4 === 0, tri = Math.abs(k) === 10, big = k % 20 === 0;
      if (tri) {
        [-1, 0, 1].forEach(function (s) {
          g.strokeStyle = tint || "#33403c"; g.lineWidth = Math.max(1.2, ppm * 0.003);
          lines(X + s * 0.012 * ppm, oy - m * ppm, X + s * 0.012 * ppm, oy + m * ppm); lines(ox - m * ppm, Y + s * 0.012 * ppm, ox + m * ppm, Y + s * 0.012 * ppm);
        });
      } else {
        g.strokeStyle = med ? "rgba(40,55,50,.85)" : "rgba(60,80,76,.38)"; g.lineWidth = med ? Math.max(1.2, ppm * 0.0025) : Math.max(0.6, ppm * 0.0012);
        lines(X, oy - m * ppm, X, oy + m * ppm); lines(ox - m * ppm, Y, ox + m * ppm, Y);
      }
    }
  }
  var cellCache = {};
  function mediumCells(gx, gy, p, counts) {
    var key = gx + "," + gy + "|" + counts.join("-"), c = cellCache[key]; if (c) return c;
    var idx = -1; for (var s = 0; s < 5; s++) if (SQ[s][0] === gx && SQ[s][1] === gy) idx = s;
    var R = rng((gx + 20) * 131 + (gy + 20) * 977 + 7), n = idx >= 0 ? counts[idx] : Math.round(95 + (R() - 0.5) * 14), out = [], m = 0.0058;
    var x0 = gx * SQ_MM - SQ_MM / 2, y0 = gy * SQ_MM - SQ_MM / 2;
    for (var i = 0; i < n; i++) {
      var best = null, bd = -1;
      for (var t = 0; t < 7; t++) { var x = x0 + m + R() * (SQ_MM - 2 * m), y = y0 + m + R() * (SQ_MM - 2 * m), dm = 1e9; for (var j = 0; j < out.length; j++) dm = Math.min(dm, Math.hypot(x - out[j].x, y - out[j].y)); if (dm > bd) { bd = dm; best = { x: x, y: y, sick: R() < 0.35, rot: R() * TAU }; } }
      out.push(best);
    }
    cellCache[key] = out; return out;
  }
  function paintCount(g, p) {
    var S = VP, C = S / 2, fu = FIELD_UM[p.view] || 360, ppm = S / (fu / 1000), counts = squareCounts(p), n = clamp(p.counted | 0, 0, 5);
    var sq = p.square >= 0 ? SQ[p.square] : [0, 0], cx = sq[0] * SQ_MM, cy = sq[1] * SQ_MM, ox = C - cx * ppm, oy = C - cy * ppm;
    var bg = g.createRadialGradient(C, C, 30, C, C, C); bg.addColorStop(0, "#fbf8ef"); bg.addColorStop(1, "#ece6d6"); g.fillStyle = bg; g.fillRect(0, 0, S, S);
    var rr = Math.max(1.3, 0.0037 * ppm), gxMin = Math.floor(sq[0] - fu / 1000 / SQ_MM / 2 - 1), gxMax = Math.ceil(sq[0] + fu / 1000 / SQ_MM / 2 + 1);
    var gyMin = Math.floor(sq[1] - fu / 1000 / SQ_MM / 2 - 1), gyMax = Math.ceil(sq[1] + fu / 1000 / SQ_MM / 2 + 1);
    for (var gx = Math.max(-7, gxMin); gx <= Math.min(7, gxMax); gx++) for (var gy = Math.max(-7, gyMin); gy <= Math.min(7, gyMax); gy++) {
      mediumCells(gx, gy, p, counts).forEach(function (c) {
        var x = ox + c.x * ppm, y = oy + c.y * ppm; if (x < -10 || y < -10 || x > S + 10 || y > S + 10) return;
        if (p.sickle && c.sick) sickleDraw(g, x, y, rr, c.rot); else cellDraw(g, x, y, rr, false);
      });
    }
    paintGrid(g, ox, oy, ppm, S, S, null);
    for (var s = 0; s < 5; s++) {                       // counted squares get a green tint; the current one an amber frame
      var X = ox + (SQ[s][0] * SQ_MM - SQ_MM / 2) * ppm, Y = oy + (SQ[s][1] * SQ_MM - SQ_MM / 2) * ppm, W = SQ_MM * ppm;
      if (s < n) { g.fillStyle = "rgba(60,170,90,.10)"; g.fillRect(X, Y, W, W); }
      if (s === p.square) { g.strokeStyle = "#ffb400"; g.lineWidth = 5; g.strokeRect(X + 2, Y + 2, W - 4, W - 4); }
    }
    g.font = "bold 18px Arial, sans-serif"; g.fillStyle = "rgba(40,50,60,.85)"; g.textAlign = "center"; g.textBaseline = "alphabetic";
    g.fillText(p.square >= 0 ? "square " + (p.square + 1) + " of 5 · 0.2 × 0.2 mm" : "ruled grid · tap Next square", C, S - 52);
  }
  function drawView(cv, p) {
    var S = cv.width, C = S / 2, g = cv.getContext("2d");
    g.save(); g.clearRect(0, 0, S, S); g.beginPath(); g.arc(C, C, C - 3, 0, TAU); g.clip();
    if (p.mode === "count") paintCount(g, p); else if (p.view === 100) paintSmear100(g, p); else paintSmear400(g, p, p.focus);
    g.font = "bold 18px Arial, sans-serif"; g.fillStyle = "rgba(40,50,60,.85)"; g.textAlign = "center"; g.textBaseline = "alphabetic";
    g.fillText("×" + p.view + " · field " + (FIELD_UM[p.view] >= 1000 ? (FIELD_UM[p.view] / 1000) + " mm" : FIELD_UM[p.view] + " µm"), C, S - 26);
    var vg = g.createRadialGradient(C, C, C * 0.8, C, C, C); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(20,25,30,.5)");
    g.fillStyle = vg; g.fillRect(0, 0, S, S); g.restore();
  }

  /* ---------------------------------------------------------- 3D pieces */
  function crescentGeo(r) {
    var pts = []; for (var i = 0; i <= 10; i++) { var a = -1.05 + i / 10 * 2.1; pts.push(new THREE.Vector3(Math.sin(a) * r * 1.5, (Math.cos(a) - 0.6) * r * 1.5, 0)); }
    var curve = new THREE.CatmullRomCurve3(pts), geo = new THREE.TubeGeometry(curve, 16, r * 0.42, 8, false);
    var pos = geo.attributes.position, T = new THREE.Vector3();                       // taper the tips
    var seg = 16 + 1;
    for (var j = 0; j <= 16; j++) { var t = j / 16, k = 0.35 + 0.65 * Math.sin(Math.PI * t), c = curve.getPoint(t); for (var m = 0; m <= 8; m++) { var id = j * 9 + m; T.set(pos.getX(id) - c.x, pos.getY(id) - c.y, pos.getZ(id) - c.z).multiplyScalar(k); pos.setXYZ(id, c.x + T.x, c.y + T.y, c.z + T.z); } }
    geo.computeVertexNormals(); return geo;
  }
  function buildSmearPlinth(p) {
    var grp = new THREE.Group(), R = rng(21), parts = {};
    var base = new THREE.Mesh(lathe([[0, 0], [3.5, 0], [3.5, 0.16], [3.3, 0.24], [0, 0.24]], 48), std(0x2a323c, 0.35, 0.6)); grp.add(base);
    var plate = new THREE.Mesh(new THREE.CylinderGeometry(3.25, 3.25, 0.06, 48), glass(0xcfe8ee, 0.32, 0.06)); plate.position.y = 0.27; grp.add(plate);
    var film = new THREE.Mesh(new THREE.CircleGeometry(3.2, 48), new THREE.MeshStandardMaterial({ color: 0xf1c9cc, transparent: true, opacity: 0.4, roughness: 0.4 })); film.rotation.x = -Math.PI / 2; film.position.y = 0.31; grp.add(film);
    // red cells (instanced) with a few swapped for sickle cells when p.sickle
    var N = 56, pos = [], tries = 0, rbcR = 0.36;
    while (pos.length < N && tries++ < 3000) {
      var a = R() * TAU, d = Math.sqrt(R()) * 2.95, x = Math.cos(a) * d, z = Math.sin(a) * d, ok = Math.hypot(x - 0.9, z + 1.2) > 0.9 && Math.hypot(x + 1.3, z - 1.1) > 0.8;
      for (var i = 0; i < pos.length && ok; i++) if (Math.hypot(x - pos[i].x, z - pos[i].z) < rbcR * 1.85) ok = false;
      if (ok) pos.push({ x: x, z: z, ry: R() * TAU, tilt: (R() - 0.5) * 0.35, sick: R() < 0.35 });
    }
    var rm = std(0xdc2f3a, 0.35, 0, { emissive: new THREE.Color(0x7f1d1d), emissiveIntensity: 0.3 });
    var rbc = new THREE.InstancedMesh(rbcGeometry(rbcR), rm, pos.length), sick = new THREE.InstancedMesh(crescentGeo(rbcR * 1.0), std(0xb8354f, 0.4, 0, { emissive: new THREE.Color(0x5a1030), emissiveIntensity: 0.3 }), pos.length);
    var mtx = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), sc = new THREE.Vector3(1, 1, 1), zero = new THREE.Vector3(0, 0, 0), v = new THREE.Vector3();
    function layout() {
      pos.forEach(function (c, i) {
        e.set(c.tilt, c.ry, c.tilt * 0.6); q.setFromEuler(e); v.set(c.x, 0.5, c.z);
        mtx.compose(v, q, p.sickle && c.sick ? zero : sc); rbc.setMatrixAt(i, mtx);
        e.set(0, c.ry, 0); q.setFromEuler(e); mtx.compose(v, q, p.sickle && c.sick ? sc : zero); sick.setMatrixAt(i, mtx);
      });
      rbc.instanceMatrix.needsUpdate = true; sick.instanceMatrix.needsUpdate = true;
    }
    grp.add(rbc, sick);
    // phagocyte: pale granular cytoplasm, lobed nucleus (tube through four lobes)
    var ph = new THREE.Group(); ph.position.set(0.9, 0.95, -1.2);
    var cyt = new THREE.Mesh(new THREE.SphereGeometry(0.62, 28, 20), new THREE.MeshStandardMaterial({
      color: 0xffffff, roughness: 0.55, transparent: true, opacity: 0.72, map: ctex(128, 64, function (g, w, h) { g.fillStyle = "#dccde3"; g.fillRect(0, 0, w, h); var r2 = rng(3); for (var i = 0; i < 160; i++) { g.fillStyle = "rgba(190,140,196," + (0.3 + r2() * 0.4) + ")"; g.fillRect(r2() * w, r2() * h, 2, 2); } })
    })); ph.add(cyt);
    var lobePts = [[-0.3, 0.12, 0.1], [-0.05, -0.18, 0.2], [0.24, 0.1, 0.05], [0.3, -0.2, -0.12]].map(function (a) { return new THREE.Vector3(a[0], a[1], a[2]); });
    var nuMat = std(0x4b2a86, 0.45); ph.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(lobePts), 24, 0.045, 8, false), nuMat));
    lobePts.forEach(function (lp) { var s = new THREE.Mesh(new THREE.SphereGeometry(0.15, 14, 10), nuMat); s.scale.set(1.0, 0.85, 0.85); s.position.copy(lp); ph.add(s); });
    grp.add(ph);
    // lymphocyte: thin pale-blue cytoplasm, big round nucleus
    var ly = new THREE.Group(); ly.position.set(-1.3, 0.78, 1.1);
    ly.add(new THREE.Mesh(new THREE.SphereGeometry(0.44, 24, 18), glass(0x8fb7e0, 0.7, 0.4)));
    var ln = new THREE.Mesh(new THREE.SphereGeometry(0.34, 22, 16), std(0x3d2a86, 0.45)); ln.position.set(-0.02, 0.02, 0.03); ly.add(ln); grp.add(ly);
    // platelets: small purple discs
    var pl = new THREE.Group(), pg = new THREE.CylinderGeometry(0.12, 0.12, 0.04, 12), pm = std(0xa0509e, 0.5, 0, { emissive: new THREE.Color(0x2a0a30), emissiveIntensity: 0.2 }), plts = [];
    for (var k = 0; k < 9; k++) { var d = new THREE.Mesh(pg, pm), a2 = R() * TAU, r2 = 0.6 + R() * 2.2; d.position.set(Math.cos(a2) * r2, 0.4 + R() * 0.15, Math.sin(a2) * r2); d.userData.home = d.position.clone(); d.userData.clump = new THREE.Vector3([-2, 1.9, 0.2][k % 3] + (R() - 0.5) * 0.4, 0.45, [1.9, -1.8, 0.2][k % 3] + (R() - 0.5) * 0.4); pl.add(d); plts.push(d); }
    grp.add(pl);
    // fibrin: fine threads, shown with clot
    var fib = new THREE.Group(), fm = std(0xe8dff0, 0.5, 0, { transparent: true, opacity: 0, emissive: new THREE.Color(0x9c7cc0), emissiveIntensity: 0.25 }), cl = [[-2, 1.9], [1.9, -1.8], [0.2, 0.2]];
    for (var f = 0; f < 21; f++) {
      var A = cl[f % 3], a3 = R() * TAU, L = 1.2 + R() * 1.5, B = f < 15 ? [A[0] + Math.cos(a3) * L, A[1] + Math.sin(a3) * L] : cl[(f + 1) % 3];
      var cv = new THREE.CatmullRomCurve3([new THREE.Vector3(A[0], 0.5, A[1]), new THREE.Vector3((A[0] + B[0]) / 2 + (R() - 0.5), 0.62, (A[1] + B[1]) / 2 + (R() - 0.5)), new THREE.Vector3(B[0], 0.5, B[1])]);
      fib.add(new THREE.Mesh(new THREE.TubeGeometry(cv, 14, 0.018, 4, false), fm));
    }
    grp.add(fib);
    return { group: grp, rbc: rbc, sick: sick, ph: ph, ly: ly, pl: pl, plts: plts, fib: fib, fibMat: fm, layout: layout, film: film };
  }
  function haemocytometerSlide() {
    var grp = new THREE.Group(), L = 7.6, W = 3.5;
    var base = new THREE.Mesh(slab(L, W, 0.38, 0.1, 0.04), glass(0xd6ecf0, 0.5, 0.06)); grp.add(base);
    // top glass plate with an engraved H-shaped moat (extruded Shape with a hole)
    var top = rrShape(L - 0.08, W - 0.08, 0.08), h = new THREE.Path(), a = 1.2, b = 1.35, g0 = 0.17, gm = 0.11;     // two cross moats at x = +-a, one centre moat along x (the H)
    h.moveTo(-a - g0, -b); h.lineTo(-a + g0, -b); h.lineTo(-a + g0, -gm); h.lineTo(a - g0, -gm); h.lineTo(a - g0, -b); h.lineTo(a + g0, -b);
    h.lineTo(a + g0, b); h.lineTo(a - g0, b); h.lineTo(a - g0, gm); h.lineTo(-a + g0, gm); h.lineTo(-a + g0, b); h.lineTo(-a - g0, b); h.closePath();
    top.holes.push(h);
    var tg = new THREE.ExtrudeGeometry(top, { depth: 0.07, bevelEnabled: false, curveSegments: 4 }); tg.rotateX(-Math.PI / 2); tg.translate(0, 0.38, 0); tg.computeVertexNormals();
    var topM = new THREE.Mesh(tg, glass(0xe2f2f6, 0.62, 0.05)); grp.add(topM);
    var moat = new THREE.Mesh(new THREE.ShapeGeometry(new THREE.Shape(h.getPoints())), new THREE.MeshStandardMaterial({ color: 0x9fb8bf, roughness: 0.3, transparent: true, opacity: 0.7 }));
    moat.rotation.x = -Math.PI / 2; moat.position.y = 0.39; grp.add(moat);
    // engraved edge labels
    var lab = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.45), new THREE.MeshBasicMaterial({ transparent: true, map: ctex(256, 100, function (c, w, hh) { c.clearRect(0, 0, w, hh); c.fillStyle = "rgba(40,55,60,.85)"; c.font = "bold 34px Arial"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("0.1 mm", w / 2, hh * 0.35); c.fillText("NEUBAUER", w / 2, hh * 0.75); }) }));
    lab.rotation.x = -Math.PI / 2; lab.position.set(-L / 2 + 0.75, 0.46, 0); grp.add(lab);
    return grp;
  }
  function gridTexture(p) {
    var tex = ctex(512, 512, function (g, w, h) { paintGridTex(g, w, h, p); });
    tex.userData = { p: p }; return tex;
  }
  function paintGridTex(g, w, h, p) {
    var ppm = w / 3, ox = w / 2, oy = h / 2;
    g.clearRect(0, 0, w, h); g.fillStyle = "rgba(246,250,248,.78)"; g.fillRect(0, 0, w, h);
    g.fillStyle = "rgba(226,140,140,.4)";
    var R = rng(2), i; for (i = 0; i < 1800; i++) { var x = ox + (R() - 0.5) * 1.0 * ppm, y = oy + (R() - 0.5) * 1.0 * ppm; g.fillRect(x, y, 1.6, 1.6); }
    paintGrid(g, ox, oy, ppm, w, h, "#1f3a33");
    var n = p.counted | 0;
    for (var s = 0; s < 5; s++) {
      var X = ox + (SQ[s][0] * SQ_MM - SQ_MM / 2) * ppm, Y = oy + (SQ[s][1] * SQ_MM - SQ_MM / 2) * ppm, W = SQ_MM * ppm;
      if (s < n) { g.fillStyle = "rgba(60,170,90,.28)"; g.fillRect(X, Y, W, W); }
      if (s === p.square) { g.strokeStyle = "#ff9d00"; g.lineWidth = 5; g.strokeRect(X + 2, Y + 2, W - 4, W - 4); }
    }
  }
  function smearSlide() {
    var grp = buildSlide(7.6, 2.6, 0.12, "BLOOD|FILM", "#e8efe6");
    var tex = ctex(512, 160, function (g, w, h) {
      g.clearRect(0, 0, w, h); var R = rng(8);
      g.fillStyle = "rgba(200,120,150,.85)"; g.beginPath(); g.moveTo(10, 30); g.lineTo(380, 24); g.lineTo(w - 20, 62);
      for (var i = 0; i < 9; i++) g.lineTo(w - 18 - R() * 8, 62 + i * 4.2 + (i % 2) * 5); g.lineTo(w - 20, 100); g.lineTo(380, 136); g.lineTo(10, 130); g.closePath(); g.fill();
      g.fillStyle = "rgba(255,255,255,.12)"; for (i = 0; i < 40; i++) g.fillRect(R() * 400, 30 + R() * 100, 50, 1.4);
    });
    var sm = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 1.45), new THREE.MeshBasicMaterial({ map: tex, transparent: true })); sm.rotation.x = -Math.PI / 2; sm.position.set(0.9, 0.13, 0); grp.add(sm);
    return grp;
  }
  function buildPipetteRig() {
    var grp = new THREE.Group();
    var tube = new THREE.Group();
    var gl = new THREE.Mesh(lathe([[0, 0.0], [0.5, 0.0], [0.58, 0.05], [0.58, 4.3], [0.62, 4.45], [0.62, 4.55], [0.5, 4.5], [0.5, 0.18], [0, 0.18]].slice(0, 9), 28), glass(0xdbeaf0, 0.35, 0.05)); tube.add(gl);
    var liq = new THREE.Mesh(lathe([[0, 0.06], [0.46, 0.06], [0.46, 2.6], [0.0, 2.6]], 24), liquid(0xe04a5a, 0.78)); tube.add(liq);
    var lbl = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.9), new THREE.MeshBasicMaterial({ transparent: true, map: ctex(64, 100, function (c, w, h) { c.fillStyle = "#f4efe2"; c.fillRect(0, 0, w, h); c.fillStyle = "#26323a"; c.font = "bold 17px Arial"; c.textAlign = "center"; c.fillText("1 : 200", w / 2, 40); c.fillText("blood", w / 2, 66); }) }));
    lbl.position.set(0, 1.5, 0.59); tube.add(lbl);
    var rack = new THREE.Mesh(lathe([[0, 0], [1.0, 0], [1.0, 0.2], [0.7, 0.28], [0.7, 0.9], [0.62, 0.95], [0.62, 0.1], [0, 0.1]].slice(0, 6), 24), std(0x2a323c, 0.4, 0.4)); rack.position.y = -0.0; grp.add(rack);
    tube.position.y = 0.2; grp.add(tube);
    var pip = new THREE.Group();
    var body = new THREE.Mesh(lathe([[0, 0], [0.05, 0.0], [0.1, 0.5], [0.22, 0.9], [0.22, 3.6], [0.17, 3.7], [0.17, 3.9], [0, 3.9]], 20), glass(0xdbeaf0, 0.45, 0.05)); pip.add(body);
    var teat = new THREE.Mesh(lathe([[0.17, 3.8], [0.28, 3.95], [0.34, 4.5], [0.3, 5.1], [0.12, 5.4], [0, 5.42]], 20), std(0xb8332f, 0.6)); pip.add(teat);
    var sample = new THREE.Mesh(lathe([[0, 0.02], [0.04, 0.02], [0.17, 1.0], [0.17, 1.9], [0, 1.9]], 18), liquid(0xe04a5a, 0.8)); pip.add(sample);
    pip.rotation.z = Math.PI / 2 - 0.03; pip.position.set(-1.4, 0.54, 1.9); grp.add(pip);
    return { group: grp, tube: tube, pipette: pip };
  }

  /* ---------------------------------------------------------- the kit */
  function create(opts) {
    var p = {}; for (var k in DEFAULTS) p[k] = DEFAULTS[k];
    if (opts) for (var k2 in opts) if (opts[k2] !== undefined) p[k2] = opts[k2];
    var g = new THREE.Group(), parts = {}, viewDirty = true, gridDirty = true, clock = 0, hl = [];

    g.add(buildBench());
    var tile = buildTile(13.4, 8.8); tile.position.set(0, 0, 3.6); g.add(tile);
    var tile2 = buildTile(23, 6.6); tile2.position.set(0, 0, -4.6); g.add(tile2);

    // haemocytometer: thick glass slide, H moat, two ruled chambers, cover slip
    var hc = haemocytometerSlide(); hc.position.set(-1.2, 0.3, 1.7); g.add(tag(hc, "haemocytometer")); parts.haemocytometer = hc;
    var gt = gridTexture(p), gridMat = new THREE.MeshStandardMaterial({ map: gt, transparent: true, roughness: 0.4, emissive: new THREE.Color(0x000000) });
    var gridG = new THREE.Group(); [-0.74, 0.74].forEach(function (z) { var pl = new THREE.Mesh(new THREE.PlaneGeometry(1.14, 1.14), gridMat); pl.rotation.x = -Math.PI / 2; pl.position.set(0, 0.452, z); gridG.add(pl); });
    hc.add(tag(gridG, "grid")); parts.grid = gridG;
    var cov = new THREE.Mesh(slab(2.5, 3.0, 0.05, 0.03, 0.015), glass(0xe4f4f8, 0.3, 0.05)); cov.position.set(0, 0.452, 0); hc.add(tag(cov, "coverslip")); parts.coverslip = cov;

    // blood film slide
    var sl = smearSlide(); sl.position.set(-1.2, 0.3, 5.2); g.add(tag(sl, "slide")); parts.slide = sl;
    // dilution tube + pipette
    var tr = buildPipetteRig(); tr.group.position.set(5.3, 0.3, 1.2); g.add(tag(tr.group, "tube")); parts.tube = tr.group;
    tr.pipette.position.set(6.4, 0.58 + 0.0, 6.7); tr.pipette.rotation.set(0, 0.1, Math.PI / 2 + 0.0);
    var pipWrap = new THREE.Group(); pipWrap.position.set(0, 0.3 - 0.0, 0); pipWrap.add(tr.pipette); g.add(tag(pipWrap, "pipette")); parts.pipette = pipWrap;

    // eyepiece view
    var vd = buildViewDisc(VP); g.add(tag(vd.group, "view")); parts.view = vd.group;

    // 3D reference smear plinth
    var sp = buildSmearPlinth(p); sp.group.position.set(-6.0, 0.3, -4.6); g.add(sp.group);
    tag(sp.rbc, "rbc"); parts.rbc = sp.rbc; tag(sp.sick, "sickleCells"); parts.sickleCells = sp.sick;
    tag(sp.ph, "phagocyte"); parts.phagocyte = sp.ph; tag(sp.ly, "lymphocyte"); parts.lymphocyte = sp.ly; tag(sp.pl, "platelet"); parts.platelet = sp.pl; tag(sp.fib, "fibrin"); parts.fibrin = sp.fib;
    function meshesOf(o) { var a = []; o.traverse(function (m) { if (m.isMesh && m.material && m.material.emissive) a.push(m); }); return a; }
    var focusMap = {
      rbc: [sp.rbc], phagocyte: meshesOf(sp.ph), lymphocyte: meshesOf(sp.ly), platelet: sp.plts, fibrin: meshesOf(sp.fib),
      grid: [gridMat], coverslip: [cov], haemocytometer: meshesOf(hc), slide: [], pipette: meshesOf(pipWrap), tube: meshesOf(tr.tube)
    };
    // gridMat is a material, wrap so pulseMeshes can treat it as a mesh
    focusMap.grid = [{ material: gridMat, userData: {} }];

    function layout3D() { sp.layout(); sp.fibMat.opacity = clamp(p.clot, 0, 1); sp.fib.visible = p.clot > 0.02;
      sp.plts.forEach(function (d) { d.position.lerpVectors(d.userData.home, d.userData.clump, clamp(p.clot, 0, 1)); }); }
    layout3D();

    function emit(name, detail) { if (typeof api.onEvent === "function") try { api.onEvent(name, detail); } catch (e) {} }
    function reading() {
      var m = model(p);
      return {
        mode: p.mode, view: p.view, field_um: m.field_um, square: p.square, squares: m.squares, counts: m.counts, count: m.current, total: m.total,
        volume_mm3: m.volume_mm3, dilution: m.dilution, diluted: m.diluted, undiluted: m.undiluted, mean_per_square: m.mean_per_square, done: m.done,
        unit: "cells per mm3", sickle: !!p.sickle, clot: p.clot, focus: p.focus
      };
    }
    function setFocus(f) { pulseMeshes(hl, false, 0); hl = f && focusMap[f] ? focusMap[f] : []; p.focus = f || null; viewDirty = true; emit("focus", { focus: p.focus }); }

    var api = g;
    api.parts = parts; g.userData.parts = parts; g.group = g; g.isKit = true; api.params = p; api.reading = reading;
    api.nextSquare = function () {
      if ((p.counted | 0) >= 5) { var r0 = reading(); emit("count-done", r0); return r0; }
      p.mode = "count"; p.square = p.counted | 0; p.counted = p.square + 1; viewDirty = gridDirty = true;
      var r = reading(); r.count = squareCounts(p)[p.square]; emit("count", r); if (p.counted >= 5) emit("count-done", r); return r;
    };
    api.reset = function () { p.counted = 0; p.square = -1; viewDirty = gridDirty = true; setFocus(null); emit("state", reading()); };
    api.highlight = function (f) { setFocus(f); };
    api.setState = function (o) {
      o = o || {};
      ["mode", "view", "sickle", "clot", "dilution", "rbc_per_mm3", "counts", "annotate"].forEach(function (k) { if (o[k] !== undefined) { p[k] = o[k]; if (k === "dilution" || k === "rbc_per_mm3" || k === "counts") { p.counted = 0; p.square = -1; } } });
      if (o.square !== undefined) { p.square = clamp(o.square | 0, -1, 4); if (p.square >= 0 && p.counted <= p.square) p.counted = p.square + 1; }
      if (o.counted !== undefined) p.counted = clamp(o.counted | 0, 0, 5);
      if (o.focus !== undefined) setFocus(o.focus);
      viewDirty = gridDirty = true; layout3D(); emit("state", reading());
    };
    g.setState = api.setState;
    api.update = function (dt, t) {
      dt = Math.min(dt || 0.016, 0.1); clock += dt; t = t == null ? clock : t;
      if (gridDirty) { var cv = gt.image, c2 = cv.getContext("2d"); paintGridTex(c2, cv.width, cv.height, p); gt.needsUpdate = true; gridDirty = false; }
      if (viewDirty) { drawView(vd.canvas, p); vd.tex.needsUpdate = true; viewDirty = false; }
      if (hl.length) pulseMeshes(hl, true, t);
      sp.ph.rotation.y = t * 0.35; sp.ph.position.y = 0.95 + 0.03 * Math.sin(t * 1.3);
    };
    api.settle = function (sec) { var n = Math.ceil((sec || 2) / 0.05); for (var i = 0; i < n; i++) api.update(0.05); };
    api.tick = api.update; g.userData.update = api.update; g.userData.setState = api.setState;
    api.dispose = function () { g.traverse(function (o) { if (o.geometry) o.geometry.dispose(); }); };
    setFocus(p.focus);
    api.update(0.016, 0);
    return g;
  }

  global.BloodCountBench = { version: 1, create: create, lights: lights, environment: environment, fit: fit, model: model, squareCounts: squareCounts, DEFAULTS: DEFAULTS, STD_COUNTS: STD_COUNTS };

  mountKit("blood-count-bench", create, DEFAULTS, {
    buttons: function (kit, btn) {
      var foci = [null, "rbc", "phagocyte", "lymphocyte", "platelet", "fibrin", "grid", "coverslip"], fi = 0;
      btn("×100 / ×400", function () { kit.setState({ view: kit.params.view === 100 ? 400 : 100 }); });
      btn("Smear / Count", function () { kit.setState({ mode: kit.params.mode === "smear" ? "count" : "smear" }); });
      btn("Next square", function () { kit.nextSquare(); });
      btn("Reset", function () { kit.reset(); });
      btn("Sickle", function () { kit.setState({ sickle: !kit.params.sickle }); });
      btn("Clot", function () { kit.setState({ clot: kit.params.clot > 0 ? 0 : 1 }); });
      btn("Focus", function () { fi = (fi + 1) % foci.length; kit.setState({ focus: foci[fi] }); });
    },
    refresh: function (kit) {
      var r = kit.reading();
      return r.mode + " ×" + r.view + " | field " + r.field_um + " µm" + (r.sickle ? " | sickle" : "") + (r.clot ? " | clot " + r.clot : "") + "\n" +
        "squares " + r.squares + "/5 | counts " + (r.counts.join(", ") || "-") + " | total " + r.total + "\n" +
        "volume " + r.volume_mm3 + " mm3 | diluted " + r.diluted + " per mm3 | undiluted (x" + r.dilution + ") " + r.undiluted + " per mm3";
    }
  });
})(window);
