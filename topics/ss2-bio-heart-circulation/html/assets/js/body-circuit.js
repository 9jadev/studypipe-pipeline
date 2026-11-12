/* =========================================================
   StudyPipe · BodyCircuit v1 — 3D body, organs, named vessels and a red-blue route tracer
   Classic script (no modules), 100% offline, uses window.THREE only (labels draw their own canvas sprites).

   BodyCircuit.create(opts) -> THREE.Group g with
     g.group / g.parts / g.userData.parts      named parts (see README)
     g.tick / g.update / g.userData.update(dt, t)
     g.setState({ view, labels, skin, bpm, speed, blocked, storeFraction, onEvent })
     g.trace(path)        run the tracer: preset name | {from,to} | [edgeIds…]
     g.freeTrace(from,to) then g.tap(partId) to follow the route by hand
     g.reading()          { route, valves, passedLungs, … } computed from the model
     g.viewFor(name)      { target:[x,y,z], dist }     g.pickPart(raycaster) -> partId | null
     g.highlight(partId, on)   g.rect-free: use SceneKit / your own projection with g.parts
   Views: "body" (default) · "portal" (gut → hepatic portal vein → liver → hepatic vein) · "coronary" (aorta root + coronary arteries, `blocked`)
   Body orientation: the figure faces the viewer, so the PATIENT'S RIGHT is on the SCREEN LEFT (-x).
   Route model: the whole circulation is a directed graph of named vessels, capillary beds, chambers and valves;
   a route is the shortest directed path between two beds. Valves, lungs and vessels are COUNTED from that path.
   ========================================================= */
(function () {
  "use strict";
  if (typeof THREE === "undefined") return;
  var V3 = THREE.Vector3, TAU = Math.PI * 2;

  /* ---------------- helpers ---------------- */
  function rng(seed) { var s = (seed || 1) >>> 0; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  function srgb(tex) {
    if ("colorSpace" in tex && THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
    else if (THREE.sRGBEncoding) tex.encoding = THREE.sRGBEncoding;
    return tex;
  }
  function canvas(w, h) { var c = document.createElement("canvas"); c.width = w; c.height = h; return c; }
  function ctex(c, rx, ry) { var t = srgb(new THREE.CanvasTexture(c)); t.wrapS = t.wrapT = THREE.RepeatWrapping; if (rx) t.repeat.set(rx, ry || rx); return t; }
  function std(color, rough, extra) {
    var m = new THREE.MeshStandardMaterial({ color: color, roughness: rough == null ? 0.5 : rough, metalness: 0.02 });
    if (extra) for (var k in extra) m[k] = extra[k];
    return m;
  }
  function ghost(color, opacity, extra) {
    return std(color, 0.45, Object.assign({ transparent: true, opacity: opacity, depthWrite: false, side: THREE.DoubleSide }, extra || {}));
  }
  function tagPart(obj, key) {
    obj.userData = obj.userData || {};
    obj.userData.partId = key;
    obj.traverse(function (c) { c.userData = c.userData || {}; if (!c.userData.partId) c.userData.partId = key; });
    return obj;
  }
  function noPick(o) { o.raycast = function () {}; o.userData.noPick = true; return o; }
  function smooth(a, b, x) { var t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); }
  function v3(a) { return new V3(a[0], a[1], a[2]); }

  var C_DEOXY = new THREE.Color(0x3a4fc2), C_OXY = new THREE.Color(0xe4303c);
  function oxyColor(v, out) { return (out || new THREE.Color()).copy(C_DEOXY).lerp(C_OXY, Math.max(0, Math.min(1, v))); }

  /* tapered / coloured tube along any curve (arms, legs, vessels, bronchi, aorta root with sinuses) */
  function taperTube(curve, rFn, tSeg, rSeg, colFn) {
    var frames = curve.computeFrenetFrames(tSeg, false);
    var n = (tSeg + 1) * (rSeg + 1), pos = new Float32Array(n * 3), col = colFn ? new Float32Array(n * 3) : null, idx = [];
    var P = new V3(), c = new THREE.Color(), i, j, k = 0;
    for (i = 0; i <= tSeg; i++) {
      var u = i / tSeg; curve.getPointAt(u, P);
      var N = frames.normals[i], B = frames.binormals[i];
      if (colFn) colFn(u, c);
      for (j = 0; j <= rSeg; j++, k++) {
        var a = (j / rSeg) * TAU, r = rFn(u, a), ca = Math.cos(a) * r, sa = Math.sin(a) * r;
        pos[k * 3] = P.x + N.x * ca + B.x * sa; pos[k * 3 + 1] = P.y + N.y * ca + B.y * sa; pos[k * 3 + 2] = P.z + N.z * ca + B.z * sa;
        if (col) { col[k * 3] = c.r; col[k * 3 + 1] = c.g; col[k * 3 + 2] = c.b; }
      }
    }
    for (i = 0; i < tSeg; i++) for (j = 0; j < rSeg; j++) {
      var a0 = i * (rSeg + 1) + j, b0 = (i + 1) * (rSeg + 1) + j;
      idx.push(a0, b0, a0 + 1, b0, b0 + 1, a0 + 1);
    }
    var geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    if (col) geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
    geo.setIndex(idx); geo.computeVertexNormals();
    return geo;
  }
  function catmull(pts) { return new THREE.CatmullRomCurve3(pts, false, "centripetal"); }

  /* mirrored copy of a vector list about the body midline x = 0 */
  function mir(pts) { return pts.map(function (p) { return new V3(-p.x, p.y, p.z); }); }

  /* ---------------- canvas textures ---------------- */
  function noiseTex(base, speck, seed, n, w) {
    var c = canvas(128, 128), x = c.getContext("2d"), r = rng(seed), i;
    x.fillStyle = base; x.fillRect(0, 0, 128, 128);
    for (i = 0; i < (n || 260); i++) {
      x.fillStyle = speck[(r() * speck.length) | 0]; x.globalAlpha = 0.25 + r() * 0.4;
      x.beginPath(); x.arc(r() * 128, r() * 128, 1 + r() * (w || 3), 0, TAU); x.fill();
    }
    x.globalAlpha = 1; return ctex(c, 3, 3);
  }
  function hepatocyteTex() {
    var c = canvas(512, 512), x = c.getContext("2d"), r = rng(51), i, j;
    x.fillStyle = "#8c4a3a"; x.fillRect(0, 0, 512, 512);
    for (i = 0; i < 520; i++) {
      var cx = r() * 512, cy = r() * 512, rr = 16 + r() * 12;
      x.fillStyle = "rgba(" + (170 + r() * 40 | 0) + "," + (96 + r() * 30 | 0) + "," + (84 + r() * 24 | 0) + ",0.85)";
      x.strokeStyle = "rgba(70,25,20,0.5)"; x.lineWidth = 1.5;
      x.beginPath(); for (j = 0; j < 6; j++) { var a = j / 6 * TAU + r() * 0.2; x.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); } x.closePath(); x.fill(); x.stroke();
      x.fillStyle = "rgba(95,40,60,0.7)"; x.beginPath(); x.arc(cx, cy, 3.2, 0, TAU); x.fill();
    }
    return ctex(c, 1, 1);
  }
  function stripeTex(color, dark, n) {
    var c = canvas(64, 64), x = c.getContext("2d"), i;
    x.fillStyle = color; x.fillRect(0, 0, 64, 64);
    for (i = 0; i < n; i++) { x.fillStyle = dark; x.globalAlpha = 0.35; x.fillRect(0, i * 64 / n, 64, 3); }
    x.globalAlpha = 1; var t = ctex(c, 1, 1); return t;
  }
  function labelSprite(text, h) {
    var c = canvas(256, 64), x = c.getContext("2d");
    x.font = "600 30px system-ui, sans-serif"; var w = Math.min(244, x.measureText(text).width + 24);
    x.fillStyle = "rgba(10,15,29,0.88)"; x.beginPath();
    var rx = (256 - w) / 2; x.moveTo(rx + 14, 8); x.lineTo(rx + w - 14, 8); x.quadraticCurveTo(rx + w, 8, rx + w, 22); x.lineTo(rx + w, 42);
    x.quadraticCurveTo(rx + w, 56, rx + w - 14, 56); x.lineTo(rx + 14, 56); x.quadraticCurveTo(rx, 56, rx, 42); x.lineTo(rx, 22); x.quadraticCurveTo(rx, 8, rx + 14, 8); x.fill();
    x.fillStyle = "#fff"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText(text, 128, 33);
    var s = new THREE.Sprite(new THREE.SpriteMaterial({ map: srgb(new THREE.CanvasTexture(c)), transparent: true, depthWrite: false, depthTest: false }));
    s.scale.set((h || 0.13) * 4, (h || 0.13), 1); s.renderOrder = 20; noPick(s); return s;
  }

  /* =========================================================
     THE CIRCULATION GRAPH  (nodes = named points, edges = vessels / beds / chambers / valves)
     o0, o1 = oxygen level at the start / end of the edge (0 = deoxygenated, blue; 1 = oxygenated, red)
     ========================================================= */
  var NODES = {
    raIn: [-0.01, 2.38, 0.05], tri0: [0.0, 2.33, 0.065], tri1: [0.02, 2.30, 0.075], pv0: [0.045, 2.33, 0.11], pv1: [0.055, 2.37, 0.12],
    lungIn: [-0.22, 2.58, 0.06], lungOut: [-0.20, 2.40, -0.01], laIn: [0.12, 2.42, -0.03], bic0: [0.11, 2.33, 0.0], bic1: [0.115, 2.30, 0.01],
    av0: [0.085, 2.32, 0.035], av1: [0.075, 2.36, 0.04], aorRoot: [0.075, 2.40, 0.04], archTop: [0.02, 2.66, -0.02],
    aoDia: [0.04, 2.10, -0.12], aoCel: [0.04, 1.97, -0.12], aoRen: [0.04, 1.88, -0.12], aoBif: [0.04, 1.62, -0.12],
    brainIn: [-0.05, 3.10, 0.01], brainOut: [-0.08, 3.12, -0.03], svcTop: [-0.06, 2.80, 0.0], subV: [-0.32, 2.73, -0.02],
    armIn: [-0.72, 1.62, 0.02], armOut: [-0.74, 1.62, -0.02], gutIn: [0.02, 1.84, 0.04], gutOut: [-0.05, 1.88, 0.06],
    liverIn: [-0.12, 2.04, 0.07], liverOut: [-0.10, 2.14, 0.05], ivcLow: [-0.04, 1.62, -0.10], ivcRenal: [-0.06, 1.92, -0.09], ivcLiver: [-0.08, 2.20, -0.04],
    kidIn: [-0.12, 1.93, -0.10], kidOut: [-0.12, 1.86, -0.10], legIn: [-0.19, 0.62, 0.03], legOut: [-0.21, 0.62, -0.03],
    heartIn: [0.095, 2.36, 0.085], heartOut: [0.035, 2.31, 0.115]
  };

  /* small intestine centreline (also the gut capillary bed the tracer travels through) */
  function coilPoints() {
    var pts = [], rows = 6, i, r;
    for (r = 0; r < rows; r++) {
      var y = 1.86 - r * 0.052, dir = r % 2 === 0 ? 1 : -1, steps = 7;
      for (i = 0; i <= steps; i++) {
        var u = i / steps, xx = (dir > 0 ? -0.2 + 0.4 * u : 0.2 - 0.4 * u);
        pts.push(new V3(xx, y + 0.012 * Math.sin(u * TAU * 1.5 + r), 0.075 + 0.02 * Math.sin(u * TAU + r * 1.3)));
      }
    }
    return pts;
  }
  var COIL = coilPoints();

  var EDGES = [];
  function E(id, part, from, to, kind, o0, o1, pts, r, extra) {
    var e = { id: id, part: part, from: from, to: to, kind: kind, o0: o0, o1: o1, pts: pts || [from, to], r: r || 0, mirror: false };
    if (extra) for (var k in extra) e[k] = extra[k];
    EDGES.push(e); return e;
  }
  E("armCap", "arm", "armIn", "armOut", "C", 1, 0, ["armIn", [-0.74, 1.52, 0.03], [-0.72, 1.44, 0.0], [-0.76, 1.52, -0.03], "armOut"], 0.006, { label: "Capillaries of the arm" });
  E("forearmVein", "forearmVein", "armOut", "subV", "V", 0, 0, ["armOut", [-0.74, 1.85, -0.03], [-0.69, 2.15, -0.03], [-0.6, 2.45, -0.03], [-0.47, 2.65, -0.03], "subV"], 0.014, { label: "Forearm vein", mirror: true });
  E("subclavianV", "subclavianV", "subV", "svcTop", "V", 0, 0, ["subV", [-0.2, 2.77, -0.01], "svcTop"], 0.02, { label: "Subclavian vein", mirror: true });
  E("svc", "svc", "svcTop", "raIn", "V", 0, 0, ["svcTop", [-0.05, 2.62, 0.03], [-0.03, 2.48, 0.05], "raIn"], 0.028, { label: "Superior vena cava (SVC)", group: "venaCavae" });
  E("ra", "ra", "raIn", "tri0", "ch", 0, 0, ["raIn", [0.0, 2.36, 0.058], "tri0"], 0, { label: "Right atrium" });
  E("tricuspid", "tricuspid", "tri0", "tri1", "valve", 0, 0, null, 0, { label: "Tricuspid valve" });
  E("rv", "rv", "tri1", "pv0", "ch", 0, 0, ["tri1", [0.03, 2.25, 0.088], [0.045, 2.30, 0.105], "pv0"], 0, { label: "Right ventricle" });
  E("pulmValve", "pulmValve", "pv0", "pv1", "valve", 0, 0, null, 0, { label: "Pulmonary semilunar valve", group: "semilunar" });
  E("pulmonaryArtery", "pulmonaryArtery", "pv1", "lungIn", "A", 0, 0, ["pv1", [0.03, 2.5, 0.10], [-0.08, 2.56, 0.08], "lungIn"], 0.02, { label: "Pulmonary artery" });
  E("lungCap", "lungs", "lungIn", "lungOut", "C", 0, 1, ["lungIn", [-0.27, 2.50, 0.04], [-0.21, 2.46, 0.02], [-0.27, 2.43, 0.0], "lungOut"], 0.006, { label: "Lung capillaries", lung: true });
  E("pulmonaryVein", "pulmonaryVeins", "lungOut", "laIn", "V", 1, 1, ["lungOut", [-0.10, 2.42, -0.06], [0.0, 2.44, -0.06], [0.09, 2.43, -0.05], "laIn"], 0.015, { label: "Pulmonary vein", group: "pulmonaryVeins" });
  E("la", "la", "laIn", "bic0", "ch", 1, 1, ["laIn", [0.115, 2.37, -0.015], "bic0"], 0, { label: "Left atrium" });
  E("bicuspid", "bicuspid", "bic0", "bic1", "valve", 1, 1, null, 0, { label: "Bicuspid valve" });
  E("lv", "lv", "bic1", "av0", "ch", 1, 1, ["bic1", [0.125, 2.24, 0.02], [0.10, 2.27, 0.035], "av0"], 0, { label: "Left ventricle" });
  E("aorticValve", "aorticValve", "av0", "av1", "valve", 1, 1, null, 0, { label: "Aortic semilunar valve", group: "semilunar" });
  E("aortaRoot", "aorta", "av1", "aorRoot", "A", 1, 1, null, 0.03, { label: "Aorta", noMesh: true });
  E("aortaAsc", "aorta", "aorRoot", "archTop", "A", 1, 1, ["aorRoot", [0.07, 2.5, 0.03], [0.05, 2.6, 0.01], "archTop"], 0.03, { label: "Aorta" });
  E("aortaDesc1", "aorta", "archTop", "aoDia", "A", 1, 1, ["archTop", [0.0, 2.64, -0.06], [0.03, 2.56, -0.11], [0.04, 2.35, -0.12], "aoDia"], 0.028, { label: "Aorta" });
  E("aortaDesc2", "aorta", "aoDia", "aoCel", "A", 1, 1, null, 0.026, { label: "Aorta" });
  E("aortaDesc3", "aorta", "aoCel", "aoRen", "A", 1, 1, null, 0.025, { label: "Aorta" });
  E("aortaDesc4", "aorta", "aoRen", "aoBif", "A", 1, 1, null, 0.024, { label: "Aorta" });
  E("carotid", "carotid", "archTop", "brainIn", "A", 1, 1, ["archTop", [-0.03, 2.8, 0.02], [-0.06, 2.95, 0.02], "brainIn"], 0.011, { label: "Carotid artery", mirror: true });
  E("brainCap", "brain", "brainIn", "brainOut", "C", 1, 0, ["brainIn", [-0.02, 3.2, 0.04], [0.04, 3.25, 0.0], [-0.04, 3.2, -0.05], "brainOut"], 0.006, { label: "Capillaries of the brain" });
  E("jugular", "jugular", "brainOut", "svcTop", "V", 0, 0, ["brainOut", [-0.08, 3.0, -0.02], [-0.08, 2.9, 0.0], "svcTop"], 0.013, { label: "Jugular vein", mirror: true });
  E("subclavianA", "subclavianA", "archTop", "armIn", "A", 1, 1, ["archTop", [-0.2, 2.76, 0.02], [-0.45, 2.72, 0.02], [-0.6, 2.45, 0.02], [-0.67, 2.15, 0.02], [-0.71, 1.85, 0.02], "armIn"], 0.013, { label: "Subclavian artery", mirror: true });
  E("mesenteric", "mesenteric", "aoCel", "gutIn", "A", 1, 1, ["aoCel", [0.04, 1.92, -0.05], [0.03, 1.87, 0.0], "gutIn"], 0.011, { label: "Mesenteric artery" });
  E("gutCap", "gut", "gutIn", "gutOut", "C", 1, 0, ["gutIn"].concat(COIL).concat(["gutOut"]), 0, { label: "Capillaries of the gut wall", noMesh: true });
  E("hepaticPortal", "hepaticPortal", "gutOut", "liverIn", "V", 0, 0, ["gutOut", [-0.08, 1.96, 0.07], "liverIn"], 0.019, { label: "Hepatic portal vein", portal: true });
  E("hepaticArtery", "hepaticArtery", "aoCel", "liverIn", "A", 1, 1, ["aoCel", [0.0, 2.03, -0.03], [-0.07, 2.07, 0.04], "liverIn"], 0.008, { label: "Hepatic artery" });
  E("liverCap", "liver", "liverIn", "liverOut", "C", 1, 0, ["liverIn", [-0.2, 2.1, 0.07], [-0.25, 2.16, 0.05], [-0.15, 2.18, 0.08], "liverOut"], 0.006, { label: "Liver sinusoids" });
  E("hepaticVein", "hepaticVein", "liverOut", "ivcLiver", "V", 0, 0, ["liverOut", [-0.09, 2.17, 0.0], "ivcLiver"], 0.017, { label: "Hepatic vein" });
  E("renalA", "renalA", "aoRen", "kidIn", "A", 1, 1, ["aoRen", [-0.04, 1.9, -0.12], "kidIn"], 0.011, { label: "Renal artery", mirror: true });
  E("kidCap", "kidney", "kidIn", "kidOut", "C", 1, 0, ["kidIn", [-0.17, 1.92, -0.10], [-0.18, 1.86, -0.11], "kidOut"], 0.006, { label: "Capillaries of the kidney" });
  E("renalV", "renalV", "kidOut", "ivcRenal", "V", 0, 0, ["kidOut", [-0.09, 1.88, -0.10], "ivcRenal"], 0.012, { label: "Renal vein", mirror: true });
  E("femoralA", "femoralA", "aoBif", "legIn", "A", 1, 1, ["aoBif", [-0.10, 1.52, -0.02], [-0.19, 1.25, 0.03], [-0.20, 0.95, 0.03], "legIn"], 0.015, { label: "Femoral artery", mirror: true });
  E("legCap", "leg", "legIn", "legOut", "C", 1, 0, ["legIn", [-0.17, 0.4, 0.03], [-0.2, 0.25, 0.0], [-0.22, 0.4, -0.03], "legOut"], 0.006, { label: "Capillaries of the leg" });
  E("femoralV", "femoralV", "legOut", "ivcLow", "V", 0, 0, ["legOut", [-0.2, 1.0, -0.03], [-0.19, 1.3, -0.03], [-0.11, 1.54, -0.07], "ivcLow"], 0.019, { label: "Femoral vein", mirror: true });
  E("ivcA", "ivc", "ivcLow", "ivcRenal", "V", 0, 0, ["ivcLow", [-0.06, 1.75, -0.1], "ivcRenal"], 0.026, { label: "Inferior vena cava (IVC)", group: "venaCavae" });
  E("ivcB", "ivc", "ivcRenal", "ivcLiver", "V", 0, 0, ["ivcRenal", [-0.07, 2.05, -0.07], "ivcLiver"], 0.028, { label: "Inferior vena cava (IVC)", group: "venaCavae" });
  E("ivcC", "ivc", "ivcLiver", "raIn", "V", 0, 0, ["ivcLiver", [-0.07, 2.28, 0.0], "raIn"], 0.028, { label: "Inferior vena cava (IVC)", group: "venaCavae" });
  E("coronaryA", "coronary", "aorRoot", "heartIn", "A", 1, 1, ["aorRoot", [0.09, 2.40, 0.07], "heartIn"], 0.006, { label: "Coronary artery" });
  E("heartCap", "heartMuscle", "heartIn", "heartOut", "C", 1, 0, ["heartIn", [0.14, 2.26, 0.07], [0.15, 2.17, 0.04], [0.08, 2.17, 0.06], [0.04, 2.24, 0.1], "heartOut"], 0.005, { label: "Heart muscle capillaries" });
  E("coronaryV", "coronaryV", "heartOut", "raIn", "V", 0, 0, ["heartOut", [0.0, 2.33, 0.10], [-0.02, 2.37, 0.07], "raIn"], 0.006, { label: "Coronary vein" });

  var EDGE = {};
  EDGES.forEach(function (e) {
    EDGE[e.id] = e;
    e.pts = e.pts.map(function (p) { return typeof p === "string" ? v3(NODES[p]) : (p.isVector3 ? p : v3(p)); });
    e.curve = e.pts.length > 2 ? catmull(e.pts) : new THREE.LineCurve3(e.pts[0], e.pts[1]);
    e.len = Math.max(0.0001, e.curve.getLength());
  });
  /* the valve edges are very short: lengthen the tracer dwell instead */
  var BY_FROM = {};
  EDGES.forEach(function (e) { (BY_FROM[e.from] = BY_FROM[e.from] || []).push(e); });

  var PRESETS = {
    armBrain: { from: "forearmVein", to: "brainCap", label: "Arm vein → brain" },
    ileumBrain: { from: "gutCap", to: "brainCap", label: "Ileum → brain" },
    liverKidney: { from: "liverCap", to: "kidCap", label: "Liver → kidney" },
    lungsHeart: { from: "lungCap", to: "heartCap", label: "Lungs → heart muscle" }
  };

  /* shortest directed path: start edge … end edge */
  function findRoute(fromId, toId) {
    var s = EDGE[fromId], t = EDGE[toId];
    if (!s || !t) return null;
    if (s === t) return [s.id];
    var prev = {}, queue = [s.to], seen = {}, i;
    seen[s.to] = true;
    while (queue.length) {
      var n = queue.shift();
      var outs = BY_FROM[n] || [];
      for (i = 0; i < outs.length; i++) {
        var e = outs[i];
        if (seen[e.to] && e !== t) continue;
        prev[e.to] = prev[e.to] || { edge: e, node: n };
        if (e === t) {
          var path = [e.id], cur = n;
          while (cur !== s.to) { var p = prev[cur]; path.unshift(p.edge.id); cur = p.node; }
          path.unshift(s.id);
          return path;
        }
        if (!seen[e.to]) { seen[e.to] = true; queue.push(e.to); }
      }
    }
    return null;
  }

  /* ---------------- the kit ---------------- */
  function create(opts) {
    opts = opts || {};
    var state = {
      view: opts.view || "body", labels: opts.labels == null ? true : opts.labels, skin: opts.skin !== false,
      bpm: opts.bpm || 72, speed: opts.speed || 1, blocked: !!opts.blocked,
      storeFraction: opts.storeFraction != null ? opts.storeFraction : 0.6
    };
    var onEvent = opts.onEvent || null;
    function emit(n, d) { if (onEvent) { try { onEvent(n, d); } catch (e) { /* lesson code must not break the kit */ } } }

    var g = new THREE.Group(), parts = {};
    var bodyG = new THREE.Group(), portalG = new THREE.Group(), coronaryG = new THREE.Group();
    g.add(bodyG, portalG, coronaryG);
    var matVessel = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.38, metalness: 0.02, side: THREE.DoubleSide });
    var meshByPart = {};

    function addPart(name, obj) {
      if (!parts[name]) parts[name] = obj; else if (parts[name].isGroup) parts[name].add(obj.clone ? obj : obj);
      meshByPart[name] = meshByPart[name] || [];
      meshByPart[name].push(obj);
    }
    function group(name) { var gr = new THREE.Group(); parts[name] = gr; return gr; }

    /* ============ BODY ============ */
    /* silhouette: a smooth outline extruded to a translucent torso (with leg gap) */
    function bodyShape() {
      var R = new THREE.SplineCurve([
        new THREE.Vector2(0.0, 3.42), new THREE.Vector2(0.15, 3.37), new THREE.Vector2(0.2, 3.24), new THREE.Vector2(0.17, 3.07), new THREE.Vector2(0.09, 2.99),
        new THREE.Vector2(0.075, 2.91), new THREE.Vector2(0.2, 2.86), new THREE.Vector2(0.38, 2.81), new THREE.Vector2(0.47, 2.70),
        new THREE.Vector2(0.43, 2.5), new THREE.Vector2(0.37, 2.25), new THREE.Vector2(0.33, 1.98), new THREE.Vector2(0.36, 1.78), new THREE.Vector2(0.40, 1.6)
      ]).getPoints(46);
      var Lg = new THREE.SplineCurve([
        new THREE.Vector2(0.40, 1.6), new THREE.Vector2(0.37, 1.3), new THREE.Vector2(0.30, 0.95), new THREE.Vector2(0.23, 0.62), new THREE.Vector2(0.17, 0.3), new THREE.Vector2(0.15, 0.1)
      ]).getPoints(24);
      var s = new THREE.Shape(), i;
      s.moveTo(0, 3.42);
      for (i = 1; i < R.length; i++) s.lineTo(R[i].x, R[i].y);
      for (i = 1; i < Lg.length; i++) s.lineTo(Lg[i].x, Lg[i].y);
      s.lineTo(0.26, 0.0); s.lineTo(0.05, 0.0); s.lineTo(0.04, 0.16); s.lineTo(0.035, 1.5);
      s.lineTo(-0.035, 1.5); s.lineTo(-0.04, 0.16); s.lineTo(-0.05, 0.0); s.lineTo(-0.26, 0.0);
      s.lineTo(-0.15, 0.1);
      for (i = Lg.length - 2; i >= 0; i--) s.lineTo(-Lg[i].x, Lg[i].y);
      for (i = R.length - 2; i >= 1; i--) s.lineTo(-R[i].x, R[i].y);
      s.lineTo(0, 3.42);
      return { shape: s, outline: R.concat(Lg) };
    }
    var bs = bodyShape();
    var skinGeo = new THREE.ExtrudeGeometry(bs.shape, { depth: 0.34, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.04, bevelSegments: 3, curveSegments: 4 });
    skinGeo.translate(0, 0, -0.17);
    var skinMat = ghost(0x8fc7ff, 0.12, { roughness: 0.2 });
    var skin = noPick(new THREE.Mesh(skinGeo, skinMat)); skin.renderOrder = 8;
    skin.userData.partId = "skin"; parts.skin = skin;
    bodyG.add(skin);
    /* glowing outline (front and back) */
    var olPts = [], i;
    for (i = 0; i < bs.outline.length; i++) olPts.push(new V3(bs.outline[i].x, bs.outline[i].y, 0.21));
    var ol = noPick(new THREE.Line(new THREE.BufferGeometry().setFromPoints(olPts), new THREE.LineBasicMaterial({ color: 0x6fd3ff, transparent: true, opacity: 0.55 })));
    var ol2 = noPick(ol.clone()); ol2.scale.x = -1; var ol3 = noPick(ol.clone()); ol3.position.z = -0.42; var ol4 = noPick(ol2.clone()); ol4.position.z = -0.42;
    skin.add(ol, ol2, ol3, ol4);
    /* eyes-free face cue: nose ridge so the front is obvious */
    var nose = noPick(new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.07, 8), ghost(0x8fc7ff, 0.5))); nose.rotation.x = Math.PI / 2; nose.position.set(0, 3.2, 0.26); skin.add(nose);

    /* tissue tint for limbs */
    var limbMat = ghost(0xf4c8a8, 0.2, { roughness: 0.6 });
    function limb(name, pts, radii, cap) {
      var c = catmull(pts);
      var m = new THREE.Mesh(taperTube(c, function (u) { var f = u * (radii.length - 1), k = Math.min(radii.length - 2, f | 0); return radii[k] + (radii[k + 1] - radii[k]) * (f - k); }, 22, 14, null), limbMat);
      m.renderOrder = 4; tagPart(m, name); return m;
    }
    var armR = limb("arm", [v3([-0.54, 2.74, 0]), v3([-0.64, 2.2, 0]), v3([-0.71, 1.66, 0]), v3([-0.74, 1.44, 0])], [0.085, 0.075, 0.052, 0.036]);
    var armL = limb("arm", [v3([0.54, 2.74, 0]), v3([0.64, 2.2, 0]), v3([0.71, 1.66, 0]), v3([0.74, 1.44, 0])], [0.085, 0.075, 0.052, 0.036]);
    var legR = limb("leg", [v3([-0.2, 1.62, 0]), v3([-0.21, 1.0, 0]), v3([-0.2, 0.55, 0]), v3([-0.19, 0.08, 0])], [0.16, 0.11, 0.07, 0.05]);
    var legL = limb("leg", [v3([0.2, 1.62, 0]), v3([0.21, 1.0, 0]), v3([0.2, 0.55, 0]), v3([0.19, 0.08, 0])], [0.16, 0.11, 0.07, 0.05]);
    bodyG.add(armR, armL, legR, legL);
    parts.arm = armR; parts.leg = legR; parts.armLeft = armL; parts.legLeft = legL;
    var shoulderCap = new THREE.Mesh(new THREE.SphereGeometry(0.087, 12, 8), limbMat); shoulderCap.position.set(-0.54, 2.74, 0); tagPart(shoulderCap, "arm"); bodyG.add(shoulderCap);
    var shoulderCapL = shoulderCap.clone(); shoulderCapL.position.x = 0.54; bodyG.add(shoulderCapL);

    /* ---- brain with gyri ---- */
    var brainGeo = new THREE.SphereGeometry(1, 40, 28), bp = brainGeo.attributes.position, bcol = new Float32Array(bp.count * 3), tmpc = new THREE.Color();
    for (i = 0; i < bp.count; i++) {
      var nx = bp.getX(i), ny = bp.getY(i), nz = bp.getZ(i);
      var ridge = Math.abs(Math.sin(nx * 9.0 + Math.sin(ny * 6) * 1.3) * Math.sin(ny * 8.0 + nz * 5) + Math.sin(nz * 10 + nx * 4) * 0.5);
      var fis = Math.abs(nx) < 0.07 ? -0.1 * (1 - Math.abs(nx) / 0.07) : 0;
      var rad = 1 + 0.06 * ridge + fis;
      bp.setXYZ(i, nx * 0.125 * rad, ny * 0.105 * rad, nz * 0.145 * rad);
      tmpc.setRGB(0.80 - 0.24 * ridge, 0.58 - 0.22 * ridge, 0.60 - 0.2 * ridge);
      bcol[i * 3] = tmpc.r; bcol[i * 3 + 1] = tmpc.g; bcol[i * 3 + 2] = tmpc.b;
    }
    brainGeo.setAttribute("color", new THREE.BufferAttribute(bcol, 3)); brainGeo.computeVertexNormals();
    var brain = new THREE.Mesh(brainGeo, std(0xffffff, 0.55, { vertexColors: true })); brain.position.set(0, 3.22, 0.0); tagPart(brain, "brain"); bodyG.add(brain); parts.brain = brain;
    var cereb = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 12), std(0xb5757a, 0.6)); cereb.scale.set(1.2, 0.6, 0.9); cereb.position.set(0, 3.14, -0.1); tagPart(cereb, "brain"); bodyG.add(cereb);

    /* ---- lungs: extruded lobes with bronchi ---- */
    function lungShape(side) {
      var s = new THREE.Shape(), k = side;                 // side -1 = patient's right (screen left)
      var P = side < 0 ?
        [[0.04, 2.76], [0.12, 2.76], [0.28, 2.7], [0.34, 2.55], [0.34, 2.4], [0.3, 2.3], [0.2, 2.26], [0.08, 2.28], [0.04, 2.4], [0.035, 2.6]] :
        [[0.04, 2.76], [0.12, 2.76], [0.28, 2.7], [0.34, 2.55], [0.33, 2.4], [0.3, 2.3], [0.2, 2.26], [0.12, 2.28], [0.07, 2.36], [0.14, 2.42], [0.13, 2.52], [0.08, 2.55], [0.05, 2.65]];
      var pts = P.map(function (p) { return new THREE.Vector2(k * p[0], p[1]); });
      var curve = new THREE.SplineCurve(pts.concat([pts[0]])).getPoints(60);
      s.moveTo(curve[0].x, curve[0].y); for (var q = 1; q < curve.length; q++) s.lineTo(curve[q].x, curve[q].y);
      return s;
    }
    var lungTex = noiseTex("#e6a6a6", ["#f3c4c4", "#c97c82", "#f0b6b6"], 7, 300, 2.5); lungTex.repeat.set(5, 5);
    function lung(side) {
      var geo = new THREE.ExtrudeGeometry(lungShape(side), { depth: 0.12, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03, bevelSegments: 3, curveSegments: 2 });
      geo.translate(0, 0, -0.07);
      var m = new THREE.Mesh(geo, std(0xffffff, 0.7, { map: lungTex, transparent: true, opacity: 0.78 })); m.renderOrder = 2; tagPart(m, "lungs");
      /* fissures */
      var fis = [], f = new THREE.LineBasicMaterial({ color: 0xb06a74, transparent: true, opacity: 0.8 });
      fis.push([new V3(side * 0.34, 2.5, 0.1), new V3(side * 0.2, 2.5, 0.12), new V3(side * 0.08, 2.45, 0.1)]);
      if (side < 0) fis.push([new V3(side * 0.3, 2.35, 0.1), new V3(side * 0.18, 2.4, 0.12), new V3(side * 0.08, 2.42, 0.1)]);
      fis.forEach(function (a) { var ln = noPick(new THREE.Line(new THREE.BufferGeometry().setFromPoints(catmull(a).getPoints(14)), f)); m.add(ln); });
      return m;
    }
    var lungR = lung(-1), lungL = lung(1); bodyG.add(lungR, lungL); parts.lungs = lungR; parts.lungsLeft = lungL;
    var airMat = std(0xbfd4e8, 0.35);
    function airway(pts, r0, r1) { var m = new THREE.Mesh(taperTube(catmull(pts), function (u) { return r0 + (r1 - r0) * u; }, 12, 8, null), airMat); tagPart(m, "lungs"); return m; }
    bodyG.add(airway([v3([0, 3.0, 0.02]), v3([0, 2.82, 0.02]), v3([0, 2.66, 0.0])], 0.02, 0.018));
    [[-1, 0.19, 2.56], [1, 0.19, 2.56]].forEach(function (b) {
      var s = b[0];
      bodyG.add(airway([v3([0, 2.66, 0]), v3([s * 0.07, 2.62, 0.0]), v3([s * b[1], b[2], -0.01])], 0.016, 0.01));
      bodyG.add(airway([v3([s * 0.1, 2.61, 0]), v3([s * 0.16, 2.5, -0.01]), v3([s * 0.22, 2.4, -0.01])], 0.009, 0.005));
      bodyG.add(airway([v3([s * 0.14, 2.58, 0]), v3([s * 0.22, 2.64, -0.01]), v3([s * 0.27, 2.68, -0.01])], 0.008, 0.005));
    });

    /* ---- liver (extruded lobes, textured) ---- */
    var liverShape = new THREE.Shape();
    (function () {
      var pts = [[-0.38, 2.12], [-0.34, 2.22], [-0.22, 2.27], [-0.06, 2.26], [0.08, 2.2], [0.17, 2.13], [0.08, 2.08], [-0.02, 2.06], [-0.1, 2.0], [-0.24, 1.98], [-0.34, 2.03]].map(function (p) { return new THREE.Vector2(p[0], p[1]); });
      var c = new THREE.SplineCurve(pts.concat([pts[0]])).getPoints(48);
      liverShape.moveTo(c[0].x, c[0].y); for (var q = 1; q < c.length; q++) liverShape.lineTo(c[q].x, c[q].y);
    })();
    var liverGeo = new THREE.ExtrudeGeometry(liverShape, { depth: 0.1, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.04, bevelSegments: 4, curveSegments: 2 });
    liverGeo.translate(0, 0, 0.0);
    var liverTex = noiseTex("#8f3f30", ["#a8503e", "#6e2c22", "#b05e4a"], 11, 260, 3); liverTex.repeat.set(4, 4);
    var liver = new THREE.Mesh(liverGeo, std(0xffffff, 0.55, { map: liverTex })); liver.renderOrder = 1; tagPart(liver, "liver"); bodyG.add(liver); parts.liver = liver;
    var gall = new THREE.Mesh(new THREE.SphereGeometry(0.03, 12, 8), std(0x4f7a3a, 0.4)); gall.scale.set(0.8, 1.3, 0.8); gall.position.set(-0.18, 1.99, 0.13); tagPart(gall, "liver"); bodyG.add(gall);

    /* ---- gut: stomach, coiled small intestine (ridged), colon frame ---- */
    var gutG = group("gut");
    var stomach = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 14), std(0xd98f8a, 0.55)); stomach.scale.set(0.09, 0.07, 0.055);
    stomach.position.set(0.15, 1.97, 0.075); stomach.rotation.z = 0.5; tagPart(stomach, "gut");
    var siTex = stripeTex("#f0a9a2", "#c8736f", 3); siTex.wrapS = THREE.RepeatWrapping; siTex.repeat.set(1, 0);
    var siCurve = catmull(COIL);
    var si = new THREE.Mesh(taperTube(siCurve, function () { return 0.026; }, 150, 8, function (u, c) { c.setRGB(0.95, 0.62 + 0.06 * Math.sin(u * 160), 0.6); }), new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.5 }));
    tagPart(si, "gut");
    var colon = new THREE.Mesh(taperTube(catmull([v3([-0.27, 1.58, 0.05]), v3([-0.29, 1.78, 0.05]), v3([-0.26, 1.94, 0.05]), v3([-0.1, 1.99, 0.05]), v3([0.1, 1.98, 0.05]), v3([0.26, 1.94, 0.05]), v3([0.29, 1.78, 0.05]), v3([0.27, 1.58, 0.05])]),
      function (u, a) { return 0.034 * (1 + 0.14 * Math.cos(u * 100)); }, 80, 8, function (u, c) { c.setRGB(0.72, 0.5, 0.36); }), new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.6 }));
    tagPart(colon, "gut");
    gutG.add(stomach, si, colon); bodyG.add(gutG);

    /* ---- kidneys (bean) ---- */
    function kidneyMesh(side) {
      var geo = new THREE.SphereGeometry(1, 22, 16), p = geo.attributes.position;
      for (var q = 0; q < p.count; q++) {
        var x = p.getX(q), y = p.getY(q), z = p.getZ(q), med = Math.max(0, -x * side), f = 1 - 0.7 * med * Math.exp(-y * y * 7);
        p.setXYZ(q, x * 0.045 * f + 0, y * 0.08, z * 0.036);
      }
      geo.computeVertexNormals();
      var m = new THREE.Mesh(geo, std(0xa13a34, 0.5)); m.position.set(side * 0.15, 1.9, -0.1); tagPart(m, "kidney"); return m;
    }
    var kidR = kidneyMesh(-1), kidL = kidneyMesh(1); bodyG.add(kidR, kidL); parts.kidney = kidR; parts.kidneyLeft = kidL;

    /* ---- spine hint ---- */
    var spine = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.03, 0.034, 0.03, 10), std(0xdbe3ec, 0.6, { transparent: true, opacity: 0.6 }), 22);
    var mt = new THREE.Matrix4(); for (i = 0; i < 22; i++) { mt.makeTranslation(0.0, 2.8 - i * 0.052, -0.16); spine.setMatrixAt(i, mt); }
    noPick(spine); spine.renderOrder = 1; bodyG.add(spine);

    /* ---- heart (compact, in the chest): translucent myocardium, tinted chamber pools, valves ---- */
    var heartG = new THREE.Group(); heartG.position.set(0, 0, 0); bodyG.add(heartG); parts.heart = heartG;
    var shellGeo = new THREE.SphereGeometry(1, 22, 16), sp = shellGeo.attributes.position;
    function shellPt(nx, ny, nz, R, out) {
      var t = Math.max(0, -ny), k = 1 - 0.42 * t * t, x = nx * R[0] * k, y = ny * R[1], z = nz * R[2] * (1 - 0.25 * t), c = Math.cos(0.5), s = Math.sin(0.5);
      return out.set(x * c - y * s, x * s + y * c, z);
    }
    var tp = new V3();
    for (i = 0; i < sp.count; i++) { shellPt(sp.getX(i), sp.getY(i), sp.getZ(i), [0.115, 0.17, 0.088], tp); sp.setXYZ(i, tp.x + 0.075, tp.y + 2.31, tp.z + 0.05); }
    shellGeo.computeVertexNormals();
    var shell = new THREE.Mesh(shellGeo, ghost(0xb02a34, 0.36, { roughness: 0.6 })); shell.renderOrder = 6; tagPart(shell, "heartMuscle"); heartG.add(shell); parts.heartMuscle = shell;
    function pool(name, c, r, color) {
      var m = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), std(color, 0.4, { emissive: color, emissiveIntensity: 0.3 }));
      m.position.set(c[0], c[1], c[2]); m.scale.set(r[0], r[1], r[2]); tagPart(m, name); heartG.add(m); parts[name] = m; m.userData.base = m.scale.clone(); return m;
    }
    var pRA = pool("ra", [-0.01, 2.37, 0.05], [0.042, 0.048, 0.04], 0x3a4fc2);
    var pRV = pool("rv", [0.035, 2.27, 0.085], [0.05, 0.068, 0.04], 0x3a4fc2);
    var pLA = pool("la", [0.115, 2.39, -0.025], [0.04, 0.04, 0.036], 0xe4303c);
    var pLV = pool("lv", [0.105, 2.25, 0.025], [0.052, 0.085, 0.05], 0xe4303c);
    pLV.rotation.z = 0.5; pRV.rotation.z = 0.35;
    function valveMesh(name, a, b, n, r, color) {
      var A = v3(a), B = v3(b), dir = B.clone().sub(A).normalize(), grp = new THREE.Group(), mid = A.clone().add(B).multiplyScalar(0.5);
      var ring = new THREE.Mesh(new THREE.TorusGeometry(r, r * 0.16, 8, 20), std(0xf2ead2, 0.5)); grp.add(ring);
      var geo = n === 3 ? new THREE.SphereGeometry(r * 0.95, 12, 6, 0, TAU, 0, Math.PI * 0.5) : new THREE.ConeGeometry(r * 0.95, r * 1.2, 20, 1, true);
      var leaf = new THREE.Mesh(geo, std(color, 0.5, { side: THREE.DoubleSide, emissive: 0x000000 }));
      if (n === 3) leaf.scale.set(1, 0.8, 1); else leaf.rotation.x = Math.PI;
      leaf.position.y = n === 3 ? 0 : -r * 0.4;
      grp.add(leaf);
      grp.rotation.x = Math.PI / 2;     // torus axis z -> y
      var holder = new THREE.Group(); holder.add(grp); holder.position.copy(mid);
      holder.quaternion.setFromUnitVectors(new V3(0, 1, 0), dir);
      grp.rotation.set(0, 0, 0);
      tagPart(holder, name); heartG.add(holder); parts[name] = holder; return holder;
    }
    valveMesh("tricuspid", NODES.tri0, NODES.tri1, 6, 0.026, 0xe9d9a8);
    valveMesh("bicuspid", NODES.bic0, NODES.bic1, 2, 0.026, 0xe9d9a8);
    valveMesh("aorticValve", NODES.av0, NODES.av1, 3, 0.022, 0xf0e4c0);
    valveMesh("pulmValve", NODES.pv0, NODES.pv1, 3, 0.022, 0xf0e4c0);
    var semi = new THREE.Group(); semi.add(parts.aorticValve.clone(), parts.pulmValve.clone()); noPick(semi); semi.visible = false; parts.semilunar = parts.aorticValve;
    /* coronary arteries on the heart surface (thin; large version in the coronary view) */
    var corMat = matVessel;
    var corCurves = [
      [[0.095, 2.4, 0.075], [0.12, 2.37, 0.1], [0.135, 2.3, 0.1], [0.15, 2.2, 0.075], [0.15, 2.14, 0.05]],
      [[0.12, 2.38, 0.09], [0.15, 2.42, 0.03], [0.17, 2.36, -0.02]],
      [[0.07, 2.4, 0.07], [0.03, 2.42, 0.1], [-0.02, 2.4, 0.1], [-0.04, 2.32, 0.09], [-0.01, 2.22, 0.09]]
    ];
    corCurves.forEach(function (c) {
      var m = new THREE.Mesh(taperTube(catmull(c.map(v3)), function (u) { return 0.0055 * (1 - 0.5 * u); }, 14, 6, function (u, cc) { oxyColor(1, cc); }), corMat);
      tagPart(m, "coronary"); heartG.add(m); (parts._cor = parts._cor || []).push(m);
    });
    parts.coronary = parts._cor[0];

    /* ---- vessel tubes with per-vertex oxygen colour ---- */
    var vesselG = new THREE.Group(); bodyG.add(vesselG);
    var partGroupMap = { venaCavae: group("venaCavae"), pulmonaryVeins: group("pulmonaryVeins") };
    function vesselMesh(e, curve, mirrored) {
      var m = new THREE.Mesh(taperTube(curve, function () { return e.r; }, Math.max(8, Math.round(e.len * 38)), e.r > 0.012 ? 10 : 6,
        function (u, c) { oxyColor(e.o0 + (e.o1 - e.o0) * u, c); }), matVessel);
      m.userData.edgeId = e.id; tagPart(m, e.part); vesselG.add(m); return m;
    }
    EDGES.forEach(function (e) {
      if (e.noMesh || e.kind === "ch" || e.kind === "valve") return;
      var vm = vesselMesh(e, e.curve, false);
      e.mesh = vm;
      if (e.kind === "C") {
        /* capillary beds drawn finer and slightly translucent so the organ reads through */
        vm.material = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.4, transparent: true, opacity: 0.85, side: THREE.DoubleSide });
        e.r = Math.max(e.r, 0.005);
      }
      if (e.mirror) vesselMesh(e, catmull(mir(e.curve.getPoints(Math.max(4, e.pts.length * 4)))), true);
      if (e.group && partGroupMap[e.group] && !partGroupMap[e.group].userData.attached) { partGroupMap[e.group].userData.attached = true; }
      if (!parts[e.part]) parts[e.part] = vm;
    });
    parts.venaCavae = parts.svc; parts.pulmonaryVeins = parts.pulmonaryVein || parts.pulmonaryVeins;
    parts.pulmonaryVeins = EDGE.pulmonaryVein.mesh;
    parts.venaCavae = EDGE.svc.mesh;
    /* extra vessels that complete the picture (not on a tracer route) */
    function extraVessel(part, pts, r, o0, o1) {
      var m = new THREE.Mesh(taperTube(catmull(pts.map(v3)), function () { return r; }, 24, 8, function (u, c) { oxyColor(o0 + (o1 - o0) * u, c); }), matVessel); tagPart(m, part); vesselG.add(m); return m;
    }
    extraVessel("pulmonaryArtery", [[0.03, 2.5, 0.10], [0.14, 2.56, 0.08], [0.22, 2.58, 0.06]], 0.017, 0, 0);
    extraVessel("pulmonaryVeins", [[0.22, 2.40, -0.02], [0.16, 2.42, -0.05], NODES.laIn], 0.013, 1, 1);
    extraVessel("pulmonaryVeins", [[-0.22, 2.5, -0.04], [-0.12, 2.47, -0.07], [-0.02, 2.46, -0.06], [0.09, 2.44, -0.05], NODES.laIn], 0.012, 1, 1);
    extraVessel("pulmonaryVeins", [[0.24, 2.5, -0.03], [0.17, 2.47, -0.05], NODES.laIn], 0.012, 1, 1);
    /* hepatic portal vein glows amber: it is rich in absorbed food */
    if (EDGE.hepaticPortal.mesh) {
      var pc = EDGE.hepaticPortal.mesh.geometry.attributes.color, amber = new THREE.Color(0xd4903a);
      for (i = 0; i < pc.count; i++) { tmpc.setRGB(pc.getX(i), pc.getY(i), pc.getZ(i)).lerp(amber, 0.55); pc.setXYZ(i, tmpc.r, tmpc.g, tmpc.b); }
    }

    /* ---- labels ---- */
    var labelOrgans = new THREE.Group(), labelVessels = new THREE.Group(); bodyG.add(labelOrgans, labelVessels);
    [["Brain", [0.3, 3.32, 0.25]], ["Lungs", [-0.5, 2.62, 0.22]], ["Heart", [0.38, 2.32, 0.22]], ["Liver", [-0.52, 2.08, 0.22]], ["Gut", [0.45, 1.78, 0.22]],
     ["Kidney", [-0.42, 1.88, 0.0]], ["Arm", [-0.98, 2.0, 0.0]], ["Leg", [0.42, 0.9, 0.2]]].forEach(function (l) { var s = labelSprite(l[0]); s.position.set(l[1][0], l[1][1], l[1][2]); labelOrgans.add(s); });
    [["Aorta", [0.4, 2.12, 0.0]], ["IVC", [-0.5, 1.7, 0.0]], ["Carotid", [0.32, 2.92, 0.2]], ["Jugular", [-0.35, 2.98, 0.2]], ["SVC", [-0.35, 2.55, 0.25]],
     ["Portal vein", [-0.55, 1.9, 0.22]], ["Hepatic vein", [-0.62, 2.28, 0.22]], ["Renal artery", [0.5, 1.9, -0.1]], ["Femoral artery", [-0.52, 1.1, 0.0]]]
      .forEach(function (l) { var s = labelSprite(l[0], 0.11); s.position.set(l[1][0], l[1][1], l[1][2]); labelVessels.add(s); });

    /* ============ TRACER ============ */
    var tracer = new THREE.Group(); tracer.renderOrder = 15; bodyG.add(tracer);
    var tracerMat = new THREE.MeshBasicMaterial({ color: 0x3a4fc2, depthTest: false, transparent: true, opacity: 0.95 });
    var tHead = noPick(new THREE.Mesh(new THREE.SphereGeometry(0.03, 14, 10), tracerMat)); tHead.renderOrder = 15;
    var tHalo = noPick(new THREE.Mesh(new THREE.SphereGeometry(0.052, 14, 10), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.22, depthTest: false }))); tHalo.renderOrder = 14;
    tHead.add(tHalo); tracer.add(tHead);
    var TRAIL = 12, trail = [];
    for (i = 0; i < TRAIL; i++) { var tm = noPick(new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 6), tracerMat)); tm.renderOrder = 15; tm.scale.setScalar(1 - i / (TRAIL + 2)); trail.push(tm); tracer.add(tm); }
    tracer.visible = false;
    var T = { route: [], s: 0, total: 0, running: false, done: false, from: null, to: null, name: "", lastEdge: -1, free: null };
    var glow = {};   // partId -> level (valve / chamber flash)

    function routeMeta(ids) {
      var labels = [], valves = 0, lungs = false, k, prevL = null;
      for (k = 0; k < ids.length; k++) {
        var e = EDGE[ids[k]];
        if (e.kind === "valve") valves++;
        if (e.lung) lungs = true;
        if (e.label !== prevL) { labels.push(e.label); prevL = e.label; }
      }
      return { labels: labels, valves: valves, passedLungs: lungs };
    }
    function resolveRoute(path) {
      if (typeof path === "string") { var p = PRESETS[path]; if (!p) return null; T.name = p.label; return findRoute(p.from, p.to); }
      if (path && !Array.isArray(path) && path.from) { T.name = (EDGE[path.from] ? EDGE[path.from].label : path.from) + " → " + (EDGE[path.to] ? EDGE[path.to].label : path.to); return findRoute(path.from, path.to); }
      if (Array.isArray(path) && path.length) { T.name = "Custom route"; return path.filter(function (id) { return EDGE[id]; }); }
      return null;
    }
    function startRoute(ids) {
      T.route = ids; T.total = ids.reduce(function (a, id) { return a + dwellLen(EDGE[id]); }, 0); T.s = 0; T.done = false; T.running = true; T.lastEdge = -1;
      T.from = ids[0]; T.to = ids[ids.length - 1]; tracer.visible = true;
      emit("route-start", { name: T.name, from: T.from, to: T.to, length: ids.length });
    }
    /* the tracer lingers in valves and beds: edge "time length" */
    function dwellLen(e) { return e.kind === "valve" ? 0.16 : e.kind === "ch" ? Math.max(0.12, e.len * 1.6) : e.kind === "C" ? Math.max(0.3, e.len * 1.1) : e.len; }
    function locate(s) {
      var k = 0, acc = 0;
      for (; k < T.route.length; k++) { var dl = dwellLen(EDGE[T.route[k]]); if (s <= acc + dl || k === T.route.length - 1) { var e = EDGE[T.route[k]]; return { k: k, e: e, u: Math.max(0, Math.min(1, (s - acc) / dl)) }; } acc += dl; }
      return null;
    }
    function tracerPos(s, out) {
      var L = locate(Math.max(0, s)); if (!L) return null;
      if (L.e.kind === "valve") out.copy(L.e.curve.getPointAt(Math.min(0.999, Math.max(0.001, L.u)))); else out.copy(L.e.curve.getPointAt(Math.min(0.999, Math.max(0.001, L.u))));
      return L;
    }
    var tmpP = new V3(), tmpCol = new THREE.Color();

    function traceDone() {
      T.running = false; T.done = true; var r = reading(); emit("route-done", r);
    }
    function trace(path) {
      var ids = resolveRoute(path);
      if (!ids || !ids.length) return false;
      T.free = null; startRoute(ids); return true;
    }
    /* Free trace: tracer waits, the learner taps each vessel / chamber / valve in order */
    function freeTrace(from, to) {
      var ids = resolveRoute({ from: from, to: to }); if (!ids) return false;
      T.name = (EDGE[from].label || from) + " → " + (EDGE[to].label || to);
      T.free = { ids: ids, next: 0, wrong: 0 };
      T.route = []; T.s = 0; T.total = 0; T.running = false; T.done = false; T.from = from; T.to = to; tracer.visible = true;
      /* the first edge is the start: begin on it automatically */
      advanceFree(1);
      emit("free-start", { from: from, to: to, expected: hint(), steps: ids.length });
      return true;
    }
    function advanceFree(count) {
      var F = T.free; if (!F) return;
      var add = F.ids.slice(F.next, F.next + count); F.next += count;
      T.route = F.ids.slice(0, F.next);
      T.total = T.route.reduce(function (a, id) { return a + dwellLen(EDGE[id]); }, 0);
      T.running = true;
    }
    function hint() { var F = T.free; if (!F || F.next >= F.ids.length) return null; return EDGE[F.ids[F.next]].label; }
    function tap(partId) {
      var F = T.free; if (!F) return { ok: false, reason: "no free trace running" };
      if (F.next >= F.ids.length) return { ok: true, done: true };
      var want = EDGE[F.ids[F.next]];
      if (want.part !== partId && want.id !== partId && !(want.group && want.group === partId)) { F.wrong++; emit("tap-wrong", { tapped: partId, expected: want.label }); return { ok: false, expected: want.label, wrong: F.wrong }; }
      var n = 1; while (F.next + n < F.ids.length && EDGE[F.ids[F.next + n]].part === want.part && want.part === "aorta") n++;
      advanceFree(n);
      emit("tap-ok", { part: partId, label: want.label, next: hint() });
      return { ok: true, label: want.label, next: hint(), done: F.next >= F.ids.length && false };
    }

    /* ============ reading ============ */
    function reading() {
      var ids = T.route, upto = ids.length, L = null;
      if (T.running && !T.done) { L = locate(T.s); upto = L ? L.k : 0; }
      var shown = ids.slice(0, upto + (T.done ? 0 : (L ? 1 : 0)));
      if (T.done) shown = ids.slice();
      var done = ids.slice(0, T.done ? ids.length : upto);
      var m = routeMeta(shown), md = routeMeta(done);
      var out = {
        view: state.view, route: m.labels, routeName: T.name, valves: md.valves, passedLungs: md.passedLungs,
        complete: !!T.done || (!!T.free && T.free.next >= T.free.ids.length && !T.running),
        from: T.from, to: T.to, steps: shown.length, parts: shown.map(function (id) { return EDGE[id].part; }),
        bpm: state.bpm, cycle_s: Math.round(6000 / state.bpm) / 100
      };
      if (T.free) { out.free = { next: hint(), tapped: T.free.next, of: T.free.ids.length, wrong: T.free.wrong }; }
      if (T.done || (T.free && T.free.next >= T.free.ids.length)) {
        var fm = routeMeta(ids); out.valves = fm.valves; out.passedLungs = fm.passedLungs; out.route = fm.labels;
      }
      if (state.view === "portal") out.portal = portalReading();
      if (state.view === "coronary") out.coronary = coronaryReading();
      return out;
    }

    /* ============ PORTAL VIEW ============ */
    var PORTAL = null;
    function ensurePortal() { return PORTAL || (PORTAL = makePortal()); }
    function makePortal() { return (function () {
      var pg = portalG, R = rng(5), k;
      /* intestine wall piece (translucent) with villi and a capillary mesh */
      var gutCurve = catmull([v3([-1.7, 1.0, 0]), v3([-1.2, 1.18, 0.0]), v3([-0.7, 1.0, 0]), v3([-0.25, 1.18, 0])]);
      var wall = new THREE.Mesh(taperTube(gutCurve, function () { return 0.33; }, 40, 24, null), ghost(0xf2a39c, 0.3, { roughness: 0.5 }));
      wall.renderOrder = 3; tagPart(wall, "gut"); pg.add(wall);
      var villi = new THREE.InstancedMesh(new THREE.ConeGeometry(0.02, 0.1, 6), std(0xf6b9b2, 0.5), 170), mtx = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new V3(), pos = new V3();
      var fr = gutCurve.computeFrenetFrames(40, false);
      for (k = 0; k < 170; k++) {
        var u = R(), a = R() * TAU, P = gutCurve.getPointAt(u), fi = Math.min(40, Math.round(u * 40)), N = fr.normals[fi], B = fr.binormals[fi];
        var rad = new V3().copy(N).multiplyScalar(Math.cos(a)).addScaledVector(B, Math.sin(a));
        pos.copy(P).addScaledVector(rad, 0.3);
        q.setFromUnitVectors(new V3(0, 1, 0), rad.clone().negate());
        var s = 0.7 + R() * 0.6; sc.set(s, s, s);
        mtx.compose(pos, q, sc); villi.setMatrixAt(k, mtx);
      }
      noPick(villi); pg.add(villi);
      /* capillary mesh in the wall: fine tubes drawn on the lower wall that merge into venules */
      var M = v3([-0.3, 0.58, 0.0]), caps = [];
      var capMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.4 });
      for (k = 0; k < 10; k++) {
        var x0 = -1.65 + k * 0.14 + R() * 0.05, y0 = 0.82 + 0.1 * Math.sin(x0 * 2.2 + 1) , z0 = (R() - 0.5) * 0.3;
        var c = catmull([new V3(x0, y0 + 0.08, z0), new V3(x0 + 0.1, y0, z0 * 0.8), new V3(x0 + 0.05 + R() * 0.2, y0 - 0.1, z0 * 0.4), new V3((x0 + M.x) / 2, (y0 + M.y) / 2 + 0.03, 0), M.clone()]);
        caps.push(c);
        var cm = new THREE.Mesh(taperTube(c, function (uu) { return 0.012 + 0.012 * uu; }, 24, 6, function (uu, cc) { cc.setRGB(0.33 + 0.5 * (1 - uu) * 0.0 + 0.1, 0.34 + 0.25 * (1 - uu), 0.76 - 0.3 * (1 - uu)); }), capMat);
        tagPart(cm, "gut"); pg.add(cm);
      }
      /* the one big vein that collects them: hepatic portal vein (amber-purple) */
      var Lp = v3([0.42, 0.05, 0.0]);
      var portalC = catmull([M.clone(), v3([-0.12, 0.38, 0]), v3([0.1, 0.2, 0]), Lp]);
      var pvMesh = new THREE.Mesh(taperTube(portalC, function (u) { return 0.065; }, 30, 14, function (u, c) { c.setRGB(0.42, 0.30, 0.55).lerp(new THREE.Color(0xd4903a), 0.4 + 0.2 * Math.sin(u * 6)); }), matVessel);
      tagPart(pvMesh, "hepaticPortal"); pg.add(pvMesh);
      /* liver: big translucent lobed outline + hexagonal lobule slab */
      var ls = new THREE.Shape(), lp = [[-0.2, -0.1], [0.0, 0.25], [0.5, 0.45], [1.1, 0.4], [1.75, 0.2], [1.95, -0.2], [1.6, -0.7], [1.0, -1.15], [0.2, -1.2], [-0.15, -0.8]].map(function (a) { return new THREE.Vector2(a[0], a[1]); });
      var lc = new THREE.SplineCurve(lp.concat([lp[0]])).getPoints(70); ls.moveTo(lc[0].x, lc[0].y); for (k = 1; k < lc.length; k++) ls.lineTo(lc[k].x, lc[k].y);
      var lg = new THREE.ExtrudeGeometry(ls, { depth: 0.12, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.06, bevelSegments: 4, curveSegments: 2 }); lg.translate(0, 0, -0.32);
      var liverBig = new THREE.Mesh(lg, std(0xffffff, 0.6, { map: liverTex, transparent: true, opacity: 0.55 })); liverBig.renderOrder = 2; tagPart(liverBig, "liver"); pg.add(liverBig);
      var HC = new V3(0.95, -0.42, 0.0), HR = 0.62;
      var hexShape = new THREE.Shape(); for (k = 0; k < 6; k++) { var ang = Math.PI / 2 + k * TAU / 6; if (k === 0) hexShape.moveTo(Math.cos(ang) * HR, Math.sin(ang) * HR); else hexShape.lineTo(Math.cos(ang) * HR, Math.sin(ang) * HR); } hexShape.closePath();
      var hex = new THREE.Mesh(new THREE.ExtrudeGeometry(hexShape, { depth: 0.05, bevelEnabled: true, bevelSize: 0.015, bevelThickness: 0.015, bevelSegments: 2 }), std(0xffffff, 0.65, { map: hepatocyteTex() }));
      hex.position.copy(HC); hex.position.z = -0.03; tagPart(hex, "liver"); pg.add(hex);
      /* portal triads at three corners, central vein in the middle */
      var corners = [0, 2, 4].map(function (j) { var ang = Math.PI / 2 + j * TAU / 6; return new V3(HC.x + Math.cos(ang) * HR * 0.93, HC.y + Math.sin(ang) * HR * 0.93, 0.05); });
      var sinus = [], sinMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.35, transparent: true, opacity: 0.92 });
      var branchCurves = [];
      corners.forEach(function (cp, j) {
        var bc = catmull([Lp.clone(), new V3((Lp.x + cp.x) / 2, (Lp.y + cp.y) / 2 + 0.05, 0.04), cp.clone()]); branchCurves.push(bc);
        var bm = new THREE.Mesh(taperTube(bc, function () { return 0.034; }, 18, 10, function (u, c) { c.setRGB(0.42, 0.30, 0.55).lerp(new THREE.Color(0xd4903a), 0.45); }), matVessel); tagPart(bm, "hepaticPortal"); pg.add(bm);
        var am = new THREE.Mesh(taperTube(catmull([v3([0.1, 0.12, 0.02]), new V3((Lp.x + cp.x) / 2 - 0.1, (Lp.y + cp.y) / 2 + 0.12, 0.08), cp.clone().add(new V3(0.04, 0.03, 0.02))]), function () { return 0.01; }, 14, 6, function (u, c) { oxyColor(1, c); }), matVessel); tagPart(am, "hepaticArtery"); pg.add(am);
        for (var n = 0; n < 6; n++) {
          var off = (n - 2.5) * 0.045, dir = HC.clone().sub(cp).normalize(), perp = new V3(-dir.y, dir.x, 0);
          var st = cp.clone().addScaledVector(perp, off), ed = HC.clone().addScaledVector(perp, off * 0.12);
          var mid = st.clone().lerp(ed, 0.5).addScaledVector(perp, off * 0.8 + Math.sin(n + j) * 0.03);
          var sc = catmull([st, mid, ed]); sinus.push(sc);
          var sm = new THREE.Mesh(taperTube(sc, function () { return 0.011; }, 16, 6, function (uu, c) { c.setRGB(0.45, 0.3, 0.55).lerp(new THREE.Color(0x3a4fc2), uu); }), sinMat);
          sm.position.z = 0.03; tagPart(sm, "liver"); pg.add(sm);
        }
      });
      var cv = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.12, 18), std(0x3a4fc2, 0.4)); cv.rotation.x = Math.PI / 2; cv.position.set(HC.x, HC.y, 0.05); tagPart(cv, "hepaticVein"); pg.add(cv);
      var hvC = catmull([new V3(HC.x, HC.y, 0.05), new V3(HC.x + 0.4, HC.y + 0.1, 0.06), new V3(HC.x + 0.75, HC.y + 0.7, 0.04), new V3(1.65, 1.5, 0.0)]);
      var hv = new THREE.Mesh(taperTube(hvC, function () { return 0.06; }, 30, 14, function (u, c) { oxyColor(0, c); }), matVessel); tagPart(hv, "hepaticVein"); pg.add(hv);
      /* labels */
      var labs = [["Gut wall", [-1.6, 1.62, 0.3]], ["Capillaries", [-1.2, 0.5, 0.2]], ["Hepatic portal vein", [-0.15, 0.78, 0.2]], ["Liver", [1.5, -1.02, 0.25]], ["Hepatic vein", [1.5, 1.05, 0.25]]], pl = new THREE.Group();
      labs.forEach(function (l) { var s = labelSprite(l[0], 0.2); s.position.set(l[1][0], l[1][1], l[1][2]); pl.add(s); }); pg.add(pl);
      /* glucose particles and glycogen granules */
      function polyLane(curves) {
        var pts = [], k2; curves.forEach(function (c) { var arr = c.getPoints(14); for (k2 = 0; k2 < arr.length; k2++) pts.push(arr[k2]); });
        var cum = [0]; for (k2 = 1; k2 < pts.length; k2++) cum.push(cum[k2 - 1] + pts[k2].distanceTo(pts[k2 - 1]));
        return { pts: pts, cum: cum, len: cum[cum.length - 1] };
      }
      var lanes = [];
      for (k = 0; k < 18; k++) {
        var ci = caps[k % caps.length], bi = k % 3;
        var lane = polyLane([ci, portalC, branchCurves[bi], sinus[bi * 6 + (k % 6)], hvC]);
        var prefix = polyLane([ci, portalC, branchCurves[bi]]).len;
        lane.sinStart = prefix; lane.sinLen = sinus[bi * 6 + (k % 6)].getLength(); lanes.push(lane);
      }
      var GN = 26, glu = [], gmat = new THREE.MeshStandardMaterial({ color: 0xffd23a, emissive: 0xffb300, emissiveIntensity: 0.7, roughness: 0.3 });
      var gGeo = new THREE.SphereGeometry(0.03, 10, 8);
      for (k = 0; k < GN; k++) {
        var gm = noPick(new THREE.Mesh(gGeo, gmat)); gm.renderOrder = 12; pg.add(gm);
        glu.push({ mesh: gm, lane: lanes[k % lanes.length], d: -R() * lanes[0].len, speed: 0.5 + R() * 0.12, decided: false, store: false, fade: 1, life: 0 });
      }
      var GRAN_MAX = 48, granI = new THREE.InstancedMesh(new THREE.SphereGeometry(0.017, 8, 6), std(0xf6dfe8, 0.45, { emissive: 0xaa7788, emissiveIntensity: 0.35 }), GRAN_MAX * 4); noPick(granI); granI.count = 0; pg.add(granI);
      var gran = 0, seenCount = 0, stored = 0, passed = 0, mtx2 = new THREE.Matrix4();
      function spawnGranule(p) {
        if (gran >= GRAN_MAX) return false;
        var perp = (gran % 2 ? 1 : -1) * (0.055 + R() * 0.03);
        for (var s = 0; s < 4; s++) { mtx2.makeTranslation(p.x + perp + (R() - 0.5) * 0.045, p.y + (R() - 0.5) * 0.05 + (s - 1.5) * 0.008, 0.075 + R() * 0.02); granI.setMatrixAt(gran * 4 + s, mtx2); }
        gran++; granI.count = gran * 4; granI.instanceMatrix.needsUpdate = true; return true;
      }
      function laneAt(l, d, out) {
        if (d <= 0) { out.copy(l.pts[0]); return; }
        if (d >= l.len) { out.copy(l.pts[l.pts.length - 1]); return; }
        var j = 1; while (l.cum[j] < d) j++;
        var f = (d - l.cum[j - 1]) / Math.max(1e-6, l.cum[j] - l.cum[j - 1]); out.copy(l.pts[j - 1]).lerp(l.pts[j], f);
      }
      var tmp = new V3();
      return {
        update: function (dt) {
          for (var q2 = 0; q2 < glu.length; q2++) {
            var p = glu[q2], mdl = p.lane;
            p.d += dt * p.speed * state.speed;
            if (!p.decided && p.d >= mdl.sinStart + mdl.sinLen * 0.55) {
              p.decided = true; seenCount++;
              p.store = ((seenCount * 0.6180339887) % 1) < state.storeFraction;
              if (p.store) { laneAt(mdl, p.d, tmp); if (spawnGranule(tmp)) { stored++; p.fade = 0.999; } else p.store = false; }
              else passed++;
            }
            if (p.fade < 1) { p.fade -= dt * 3; if (p.fade <= 0) { p.d = -R() * 1.2; p.decided = false; p.fade = 1; p.store = false; p.lane = lanes[(q2 + seenCount) % lanes.length]; } }
            if (p.d >= mdl.len) { p.d = -R() * 1.2; p.decided = false; p.lane = lanes[(q2 + seenCount) % lanes.length]; }
            laneAt(p.lane, p.d, tmp); p.mesh.position.copy(tmp); p.mesh.position.z += 0.035;
            p.mesh.visible = p.d > 0; p.mesh.scale.setScalar(Math.max(0.01, p.fade));
            if (p.d > p.lane.sinStart + p.lane.sinLen) p.mesh.material = p.mesh.material; // keep colour
          }
        },
        reading: function () { return { glucoseSeen: seenCount, stored: stored, passedThrough: passed, glycogenGranules: gran, storeFraction: state.storeFraction }; },
        reset: function () { gran = 0; granI.count = 0; seenCount = 0; stored = 0; passed = 0; glu.forEach(function (p) { p.d = -R() * 3; p.decided = false; p.fade = 1; }); }
      };
    })(); }
    function portalReading() { return ensurePortal().reading(); }

    /* ============ CORONARY VIEW ============ */
    var CORO = null;
    function ensureCoro() { return CORO || (CORO = makeCoro()); }
    function makeCoro() { return (function () {
      var cg = coronaryG, k;
      var RAD = [0.62, 0.95, 0.5], th = 0.5;
      function shellVec(n, out, lift) {
        var l = Math.sqrt(n[0] * n[0] + n[1] * n[1] + n[2] * n[2]), nx = n[0] / l, ny = n[1] / l, nz = n[2] / l, t = Math.max(0, -ny), kk = 1 - 0.42 * t * t;
        var x = nx * RAD[0] * kk, y = ny * RAD[1], z = nz * RAD[2] * (1 - 0.25 * t), c = Math.cos(th), s = Math.sin(th);
        out.set(x * c - y * s, x * s + y * c, z);
        var len = out.length(); out.multiplyScalar(1 + (lift || 0) / len); return out;
      }
      var sg = new THREE.SphereGeometry(1, 36, 26), spp = sg.attributes.position, nrm = new Float32Array(spp.count * 3), col = new Float32Array(spp.count * 3), tv = new V3(), terr = new Float32Array(spp.count);
      var DT = new V3(0.30, -0.45, 0.85).normalize(), rr = rng(21);
      for (k = 0; k < spp.count; k++) {
        var x = spp.getX(k), y = spp.getY(k), z = spp.getZ(k);
        shellVec([x, y, z], tv, 0);
        spp.setXYZ(k, tv.x, tv.y, tv.z);
        var d = (x * DT.x + y * DT.y + z * DT.z); terr[k] = smooth(0.45, 0.65, d);
      }
      sg.computeVertexNormals();
      var baseCol = new Float32Array(spp.count * 3);
      for (k = 0; k < spp.count; k++) { var nz = 0.82 + (Math.sin(spp.getX(k) * 14) * Math.sin(spp.getY(k) * 11 + spp.getZ(k) * 6)) * 0.08; baseCol[k * 3] = 0.72 * nz; baseCol[k * 3 + 1] = 0.16 * nz; baseCol[k * 3 + 2] = 0.2 * nz; }
      sg.setAttribute("color", new THREE.BufferAttribute(col, 3));
      var shellM = new THREE.Mesh(sg, std(0xffffff, 0.55, { vertexColors: true })); tagPart(shellM, "heartMuscle"); cg.add(shellM);
      var DEAD = new THREE.Color(0x5e5750);
      var blockAmt = 0, terrSum = 0; for (k = 0; k < terr.length; k++) terrSum += terr[k];
      function paintShell() {
        var c = new THREE.Color();
        for (var q = 0; q < spp.count; q++) {
          c.setRGB(baseCol[q * 3], baseCol[q * 3 + 1], baseCol[q * 3 + 2]).lerp(DEAD, terr[q] * blockAmt * 0.92);
          col[q * 3] = c.r; col[q * 3 + 1] = c.g; col[q * 3 + 2] = c.b;
        }
        sg.attributes.color.needsUpdate = true;
      }
      /* atria appendages and great vessels */
      function blob(c, r, color, op, part) {
        var m = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 14), ghost(color, op, { roughness: 0.6 })); m.position.set(c[0], c[1], c[2]); m.scale.set(r[0], r[1], r[2]); tagPart(m, part); cg.add(m); return m;
      }
      blob([-0.44, 0.78, 0.0], [0.26, 0.3, 0.3], 0x9c2a3a, 0.85, "ra");
      blob([0.45, 0.82, -0.18], [0.26, 0.26, 0.3], 0x9c2a3a, 0.85, "la");
      var pt = new THREE.Mesh(taperTube(catmull([v3([0.3, 0.6, 0.3]), v3([0.3, 0.95, 0.3]), v3([0.25, 1.3, 0.25])]), function () { return 0.11; }, 16, 14, function (u, c) { oxyColor(0, c); }), matVessel); tagPart(pt, "pulmonaryArtery"); cg.add(pt);
      var rootC = catmull([v3([0.06, 0.62, 0.1]), v3([0.06, 0.8, 0.1]), v3([0.04, 1.02, 0.08]), v3([-0.12, 1.3, 0.0]), v3([-0.42, 1.38, -0.15]), v3([-0.64, 1.1, -0.2])]);
      var rootM = new THREE.Mesh(taperTube(rootC, function (u, a) { return 0.15 * (1 + 0.45 * Math.exp(-Math.pow((u - 0.07) / 0.06, 2)) * (0.5 + 0.5 * Math.cos(3 * a))); }, 44, 24, function (u, c) { oxyColor(1, c); }),
        new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.4, transparent: true, opacity: 0.55, side: THREE.DoubleSide, depthWrite: false }));
      tagPart(rootM, "aorta"); rootM.renderOrder = 5; cg.add(rootM);
      var cuspShape = new THREE.Shape(); cuspShape.moveTo(-0.11, 0); cuspShape.quadraticCurveTo(0, -0.17, 0.11, 0); cuspShape.quadraticCurveTo(0.0, 0.03, -0.11, 0);
      var cusps = new THREE.Group();
      for (k = 0; k < 3; k++) {
        var cm = new THREE.Mesh(new THREE.ExtrudeGeometry(cuspShape, { depth: 0.012, bevelEnabled: false }), std(0xf2ead2, 0.5, { side: THREE.DoubleSide }));
        var holder = new THREE.Group(); cm.position.set(0, 0, 0.1); cm.rotation.x = -0.35; holder.add(cm); holder.rotation.y = k * TAU / 3 + 0.5; cusps.add(holder);
      }
      cusps.position.set(0.06, 0.72, 0.1); tagPart(cusps, "aorticValve"); cg.add(cusps);
      /* coronary arteries and veins on the surface */
      var cv = new V3();
      function onShell(dirs, lift) { return dirs.map(function (d) { return shellVec(d, new V3(), lift == null ? 0.012 : lift); }); }
      var lmStart = v3([0.2, 0.78, 0.15]), rcStart = v3([-0.1, 0.76, 0.2]);
      var ladPts = [lmStart].concat(onShell([[0.45, 0.78, 0.42], [0.32, 0.66, 0.68], [0.3, 0.35, 0.9], [0.28, 0.0, 0.96], [0.22, -0.4, 0.9], [0.12, -0.75, 0.65], [0.0, -0.98, 0.2]]));
      var cxPts = [ladPts[1].clone()].concat(onShell([[0.62, 0.62, 0.5], [0.85, 0.45, 0.3], [0.97, 0.22, -0.05], [0.85, 0.1, -0.5], [0.55, 0.1, -0.82]]));
      var rcaPts = [rcStart].concat(onShell([[-0.2, 0.7, 0.68], [-0.65, 0.55, 0.55], [-0.95, 0.2, 0.2], [-0.88, -0.1, -0.45], [-0.45, -0.2, -0.86]]));
      var dgPts = [ladPts[3].clone()].concat(onShell([[0.55, -0.1, 0.82], [0.8, -0.35, 0.5]]));
      var vnPts = onShell([[0.12, -0.7, 0.7], [0.4, 0.0, 0.9], [0.55, 0.62, 0.55], [0.9, 0.5, 0.0], [0.4, 0.55, -0.75], [-0.35, 0.5, -0.75]], 0.012);
      var artMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.4 });
      var ladC = catmull(ladPts), cxC = catmull(cxPts), rcaC = catmull(rcaPts), dgC = catmull(dgPts), vnC = catmull(vnPts);
      var UB = 0.34;       // blockage position along the LAD
      function artCol(blockedFlag) { return function (u, c) { oxyColor(1, c); if (blockedFlag && u > UB) c.lerp(new THREE.Color(0xb9a79f), blockAmt * 0.9); }; }
      var ladM = null;
      function buildLad() {
        if (ladM) { cg.remove(ladM); ladM.geometry.dispose(); }
        ladM = new THREE.Mesh(taperTube(ladC, function (u) { return 0.05 - 0.024 * u; }, 60, 8, artCol(true)), artMat); tagPart(ladM, "coronary"); cg.add(ladM);
      }
      buildLad();
      [[cxC, 0.04], [rcaC, 0.044], [dgC, 0.02]].forEach(function (a) { var m = new THREE.Mesh(taperTube(a[0], function (u) { return a[1] * (1 - 0.5 * u); }, 40, 8, artCol(false)), artMat); tagPart(m, "coronary"); cg.add(m); });
      var vn = new THREE.Mesh(taperTube(vnC, function () { return 0.034; }, 50, 8, function (u, c) { oxyColor(0, c); }), artMat); tagPart(vn, "coronaryV"); cg.add(vn);
      /* the blockage: fatty plaque ring + dark clot */
      var bp2 = ladC.getPointAt(UB), plaque = new THREE.Group();
      var pl = new THREE.Mesh(new THREE.IcosahedronGeometry(0.052, 1), std(0xd8b04a, 0.6)); pl.scale.set(1.2, 0.8, 1); plaque.add(pl);
      var cl = new THREE.Mesh(new THREE.IcosahedronGeometry(0.04, 1), std(0x4a0f14, 0.7)); cl.position.set(0.012, 0.014, 0.025); plaque.add(cl);
      plaque.position.copy(bp2); tagPart(plaque, "coronary"); plaque.visible = false; cg.add(plaque);
      var lab = [["Aorta", [-0.5, 1.5, -0.1]], ["Coronary artery", [0.78, 0.2, 0.8]], ["Blockage", [bp2.x + 0.5, bp2.y + 0.2, bp2.z + 0.2]], ["Coronary vein", [-0.7, -0.4, 0.8]], ["Heart muscle", [0.9, -0.6, 0.4]]], lg2 = new THREE.Group();
      lab.forEach(function (l, i2) { var s = labelSprite(l[0], 0.14); s.position.set(l[1][0], l[1][1], l[1][2]); lg2.add(s); if (i2 === 2) { lg2.userData.block = s; } }); cg.add(lg2);
      /* flowing blood in the arteries */
      var flow = [], flowGeo = new THREE.SphereGeometry(0.03, 8, 6), flowMat = new THREE.MeshBasicMaterial({ color: 0xff5a4a });
      [[ladC, 7, true], [cxC, 5, false], [rcaC, 5, false], [vnC, 5, false, true]].forEach(function (a) {
        for (var n = 0; n < a[1]; n++) { var m = noPick(new THREE.Mesh(flowGeo, a[3] ? new THREE.MeshBasicMaterial({ color: 0x6a7fe8 }) : flowMat)); cg.add(m); flow.push({ m: m, c: a[0], u: n / a[1], lad: a[2], idx: n, vein: !!a[3] }); }
      });
      return {
        update: function (dt) {
          var tgt = state.blocked ? 1 : 0, prev = blockAmt;
          blockAmt += (tgt - blockAmt) * Math.min(1, dt * 1.1); if (Math.abs(tgt - blockAmt) < 0.003) blockAmt = tgt;
          if (blockAmt !== prev || prev === 0 && blockAmt === 0 && !CORO._init) { paintShell(); buildLad(); CORO._init = true; }
          plaque.visible = state.blocked || blockAmt > 0.01; if (lg2.userData.block) lg2.userData.block.visible = plaque.visible;
          for (var q = 0; q < flow.length; q++) {
            var f = flow[q]; f.u = (f.u + dt * 0.12 * state.speed) % 1; var u = f.u;
            if (f.lad && state.blocked) { u = Math.min(u, UB - 0.03 - f.idx * 0.012); if (blockAmt < 1 && f.u > UB) u = f.u; }
            f.m.position.copy(f.c.getPointAt(Math.max(0, Math.min(0.999, u))));
            f.m.visible = true;
          }
        },
        reading: function () { return coronaryReading2(); },
        blockAmt: function () { return blockAmt; },
        terrFraction: terrSum / terr.length
      };
    })(); }
    function coronaryReading2() {
      ensureCoro();
      return { blocked: !!state.blocked, blockage: "LAD (left anterior descending)", musclePctAtRisk: Math.round(CORO.terrFraction * 1000) / 10, musclePctStarved: Math.round(CORO.terrFraction * CORO.blockAmt() * 1000) / 10, bloodBeyondBlock: state.blocked ? "none" : "normal" };
    }
    function coronaryReading() { return coronaryReading2(); }

    /* ============ view / state ============ */
    function applyView() {
      bodyG.visible = state.view === "body"; portalG.visible = state.view === "portal"; coronaryG.visible = state.view === "coronary";
      if (state.view === "portal") ensurePortal(); if (state.view === "coronary") ensureCoro();
      labelOrgans.visible = state.labels === true; labelVessels.visible = state.labels === "vessels";
      skin.visible = state.skin;
    }
    applyView();
    function setState(o) {
      if (!o) return g;
      if ("onEvent" in o) onEvent = o.onEvent;
      ["labels", "skin", "bpm", "speed", "blocked", "storeFraction"].forEach(function (k) { if (k in o) state[k] = o[k]; });
      if (o.view && o.view !== state.view) { state.view = o.view; emit("view", { view: state.view }); }
      if (o.reset) reset();
      applyView(); return g;
    }
    function reset() { T.route = []; T.s = 0; T.total = 0; T.running = false; T.done = false; T.free = null; T.name = ""; tracer.visible = false; T.from = T.to = null; if (PORTAL) PORTAL.reset(); emit("reset", {}); }

    /* ============ highlight / pick / view ============ */
    var hi = {}, hiMats = [];
    function highlight(partId, on) {
      if (!partId) { for (var k in hi) clearHi(k); return; }
      if (on === false) { clearHi(partId); return; }
      hi[partId] = true;
      g.traverse(function (o) {
        if (o.isMesh && o.userData && o.userData.partId === partId && !o.userData.noPick && o.material && o.material.emissive) {
          if (!o.userData._own) { o.material = o.material.clone(); o.userData._own = true; o.userData._e = o.material.emissive.clone(); o.userData._ei = o.material.emissiveIntensity; }
        }
      });
    }
    function clearHi(id) {
      delete hi[id];
      g.traverse(function (o) { if (o.isMesh && o.userData._own && o.userData.partId === id) { o.material.emissive.copy(o.userData._e); o.material.emissiveIntensity = o.userData._ei; } });
    }
    function pulseHi(t) {
      for (var id in hi) { var pl = 0.5 + 0.35 * Math.sin(t * 6); g.traverse(function (o) { if (o.isMesh && o.userData._own && o.userData.partId === id) { o.material.emissive.setRGB(1, 0.78, 0.25); o.material.emissiveIntensity = pl; } }); }
    }
    function pickPart(ray) {
      var vis = state.view === "body" ? bodyG : state.view === "portal" ? portalG : coronaryG, hits = ray.intersectObject(vis, true);
      for (var q = 0; q < hits.length; q++) { var o = hits[q].object; if (o.userData && o.userData.noPick) continue; if (o.userData && o.userData.partId && o.userData.partId !== "skin") return o.userData.partId; }
      return null;
    }
    var VIEWS = {
      all: { target: [0, 1.72, 0], dist: 6.0 }, body: { target: [0, 1.72, 0], dist: 6.0 }, head: { target: [0, 3.05, 0], dist: 2.4 }, heart: { target: [0.06, 2.3, 0.05], dist: 1.9 },
      chest: { target: [0, 2.45, 0], dist: 3.2 }, gut: { target: [0, 1.85, 0], dist: 2.6 }, liver: { target: [-0.15, 2.05, 0], dist: 2.2 }, kidney: { target: [0, 1.88, -0.05], dist: 2.4 },
      arm: { target: [-0.6, 2.1, 0], dist: 3.0 }, leg: { target: [-0.2, 0.9, 0], dist: 3.6 }, portal: { target: [0.2, 0.55, 0], dist: 6.2 }, coronary: { target: [0, 0.3, 0], dist: 4.6 }
    };
    function viewFor(name) { var v = VIEWS[name] || (state.view === "portal" ? VIEWS.portal : state.view === "coronary" ? VIEWS.coronary : VIEWS.body); return { target: v.target.slice(), dist: v.dist }; }

    /* ============ update ============ */
    var phase = 0, beatPrev = 0;
    function update(dt, t) {
      dt = Math.min(dt || 0, 0.1);
      /* heartbeat of the compact heart (rate from bpm) */
      phase = (phase + dt * state.bpm / 60) % 1;
      if (state.view === "body") {
        var vs = smooth(0.12, 0.2, phase) * (1 - smooth(0.42, 0.52, phase)), as = smooth(0.0, 0.08, phase) * (1 - smooth(0.1, 0.14, phase));
        pRV.scale.copy(pRV.userData.base).multiplyScalar(1 - 0.22 * vs); pLV.scale.copy(pLV.userData.base).multiplyScalar(1 - 0.24 * vs);
        pRA.scale.copy(pRA.userData.base).multiplyScalar(1 - 0.18 * as); pLA.scale.copy(pLA.userData.base).multiplyScalar(1 - 0.18 * as);
        /* tracer */
        if (T.running && T.route.length) {
          var L0 = locate(T.s), spd = 0.6 * state.speed * (L0 && L0.e.kind === "valve" ? 0.5 : 1);
          T.s += dt * spd * (L0 && (L0.e.kind === "C") ? 0.6 : 1);
          if (T.s >= T.total) {
            T.s = T.total;
            if (T.free) { T.running = false; if (T.free.next >= T.free.ids.length) { T.done = true; emit("route-done", reading()); } }
            else traceDone();
          }
        }
        if (T.route.length) {
          var L = tracerPos(T.s, tmpP);
          if (L) {
            tHead.position.copy(tmpP);
            var e = L.e, ox = e.o0 + (e.o1 - e.o0) * (e.kind === "C" ? smooth(0.15, 0.85, L.u) : L.u);
            oxyColor(ox, tmpCol); tracerMat.color.copy(tmpCol); tHalo.material.color.copy(tmpCol).lerp(new THREE.Color(0xffffff), 0.5);
            if (L.k !== T.lastEdge) {
              T.lastEdge = L.k;
              glow[e.part] = 1;
              emit("step", { index: L.k, edge: e.id, part: e.part, label: e.label, oxy: Math.round(ox * 100) / 100, valve: e.kind === "valve", lungs: !!e.lung });
              if (e.kind === "valve") emit("valve", { part: e.part, label: e.label });
            }
            for (var q = 0; q < TRAIL; q++) {
              var s2 = T.s - (q + 1) * 0.06; if (s2 < 0 || !tracerPos(s2, tmpP)) { trail[q].visible = false; continue; }
              trail[q].visible = true; trail[q].position.copy(tmpP);
            }
          }
          tHead.scale.setScalar(1 + 0.15 * Math.sin(t * 9));
        }
        for (var id in glow) {
          var lv = glow[id]; if (lv <= 0) { delete glow[id]; continue; }
          (meshByPart[id] || []).forEach(function () {});
          var ms = parts[id]; if (ms) ms.traverse(function (o) { if (o.isMesh && o.material && o.material.emissive && !o.userData._own) { if (!o.userData._gm) { o.material = o.material.clone(); o.userData._gm = true; } o.material.emissive.setRGB(1, 0.85, 0.35); o.material.emissiveIntensity = lv * 0.7; } });
          glow[id] = lv - dt * 1.2; if (glow[id] <= 0) { glow[id] = 0; if (ms) ms.traverse(function (o) { if (o.isMesh && o.userData._gm) o.material.emissiveIntensity = 0; }); delete glow[id]; }
        }
      }
      if (state.view === "portal") PORTAL.update(dt);
      if (state.view === "coronary") CORO.update(dt);
      pulseHi(t || 0);
    }

    g.group = g; g.parts = parts; g.userData = g.userData || {}; g.userData.parts = parts; g.userData.update = update; g.userData.setState = setState;
    g.tick = update; g.update = update; g.setState = setState;
    g.trace = trace; g.freeTrace = freeTrace; g.tap = tap; g.hint = hint; g.reading = reading; g.reset = reset;
    g.viewFor = viewFor; g.pickPart = pickPart; g.highlight = highlight;
    g.route = function (a, b) { return findRoute(a, b); };
    g.presets = PRESETS;
    return g;
  }

  /* minimal highlighter (same contract as HeartKit.makeHighlighter, used if HeartKit is not loaded) */
  function makeHighlighter(scene) {
    if (window.HeartKit && window.HeartKit.makeHighlighter) return window.HeartKit.makeHighlighter(scene);
    var cur = null; return { set: function (o) { cur = o; }, update: function () {}, clear: function () { cur = null; } };
  }

  window.BodyCircuit = {
    create: create, makeHighlighter: makeHighlighter, version: 1,
    model: { nodes: NODES, edges: EDGES.map(function (e) { return { id: e.id, part: e.part, from: e.from, to: e.to, kind: e.kind, o0: e.o0, o1: e.o1, label: e.label }; }), presets: PRESETS, findRoute: findRoute }
  };
})();
