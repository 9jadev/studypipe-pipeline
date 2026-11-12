/* =========================================================
   StudyPipe · AboTypingBench v1 — ABO and Rhesus blood-typing tile, agglutination zoom and Rhesus sensitisation
   Classic script (no modules), fully offline, needs window.THREE (three.js r160 bundle).
   Optional: window.HeartKit (rbcGeo, makeHighlighter) and window.SceneKit (glow sprite). Falls back to its own code if absent.

   Units: 1 scene unit = 1 cm (bench view).   Y is up.   Bench top at y = 0.

   API
     var kit = AboTypingBench.create({ sample, abo, rh, patient, view, errors, labels });
     scene.add(kit);                    // kit is a THREE.Group
     kit.parts      -> { name: Object3D }  (also kit.userData.parts)
     kit.update(dt, t)  (also kit.tick)    call every frame
     kit.setState(obj)                      any of the params, plus step (0..5), rock_s, stage (0..3), agg (0..1)
     kit.setStep(n) / nextStep() / play() / pause() / reset() / settle(seconds) / fillAll()
     kit.reading()                          computed from the model (never typed text)
     kit.highlight(partId | null)           glow on a named part (HeartKit.makeHighlighter when present)
     kit.attachHighlighter(scene)           call once if you want the glow sprite in your scene
     kit.onEvent = function (name, detail)  'step' | 'sample' | 'done' | 'state' | 'view' | 'stage'
   Also: AboTypingBench.environment(renderer), .lights(scene), .fit(camera, controls, aspect, view),
         .model(sample|{abo,rh}, errors, rock_s), .compat(patient, donor), .bags(patient), .SAMPLES, .BAGS

   Parts (userData.partId set): tile, wells, antiA, antiB, antiD, stirrer, lancet, sharpsBin, sampleTube, timer
   ========================================================= */
(function (global) {
  "use strict";
  var THREE = global.THREE;
  if (!THREE) return;

  var TAU = Math.PI * 2;
  var V3 = THREE.Vector3;

  /* ---------------------------------------------------------- helpers */
  function rng(seed) { var a = seed >>> 0; return function () { a += 0x6D2B79F5; var t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function sstep(a, b, x) { var t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); }
  function ctex(w, h, draw, linear) {
    var c = document.createElement("canvas"); c.width = w; c.height = h;
    draw(c.getContext("2d"), w, h);
    var t = new THREE.CanvasTexture(c);
    if (!linear) t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
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
  function tag(obj, id) { obj.userData.partId = id; obj.traverse(function (c) { c.userData = c.userData || {}; if (!c.userData.partId) c.userData.partId = id; }); return obj; }
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
  function plate(text, w, h, o) {   // small canvas label plane (3D label plate, short text only)
    o = o || {};
    var t = ctex(256, Math.round(256 * h / w), function (g, cw, ch) {
      g.fillStyle = o.bg || "rgba(10,18,32,.86)";
      g.beginPath(); g.moveTo(16, 0); g.arcTo(cw, 0, cw, ch, 16); g.arcTo(cw, ch, 0, ch, 16); g.arcTo(0, ch, 0, 0, 16); g.arcTo(0, 0, cw, 0, 16); g.fill();
      g.fillStyle = o.fg || "#f4f7fb"; var fs = o.size || 34; g.font = "bold " + fs + "px Arial, sans-serif"; while (fs > 12 && g.measureText(text).width > cw - 30) { fs -= 2; g.font = "bold " + fs + "px Arial, sans-serif"; } g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(text, cw / 2, ch / 2 + 2);
    });
    var m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false }));
    m.renderOrder = 6; return m;
  }
  function noiseTex(w, h, base, spots, seed) {
    var R = rng(seed || 3);
    return ctex(w, h, function (g) {
      g.fillStyle = base; g.fillRect(0, 0, w, h);
      for (var i = 0; i < spots; i++) { var a = R() * 0.1; g.fillStyle = R() > 0.5 ? "rgba(255,255,255," + a + ")" : "rgba(0,0,0," + a + ")"; g.fillRect(R() * w, R() * h, 1 + R() * 3, 1 + R() * 3); }
    });
  }

  /* ---------------------------------------------------------- biological model (the single source of truth) */
  var ANT = { A: ["A"], B: ["B"], AB: ["A", "B"], O: [] };      // antigens on the red cells (same rules as kits/video/blood)
  var ABS = { A: ["b"], B: ["a"], AB: [], O: ["a", "b"] };      // antibodies in the plasma
  var MINUS = "−";
  var SERA = [
    { id: "antiA", ag: "A", name: "anti-A", rgb: [58, 110, 225], bottle: 0x2a62d8, cap: 0x2f6fd8, a: 0.78 },
    { id: "antiB", ag: "B", name: "anti-B", rgb: [244, 205, 52], bottle: 0xf0c020, cap: 0xe8b820, a: 0.82 },
    { id: "antiD", ag: "D", name: "anti-D", rgb: [226, 240, 246], bottle: 0xe9f1f4, cap: 0xf1f1ee, a: 0.5 }
  ];
  var AG_COL = { A: "#ffa04d", B: "#73d6ff", D: "#c58bff" };    // antigen / matching antibody colours in the zoom views
  var SAMPLES = {
    rider:  { abo: "B",  rh: "-", label: "Rider" },
    donor1: { abo: "O",  rh: "-", label: "Donor 1" },
    donor2: { abo: "A",  rh: "-", label: "Donor 2" },
    donor3: { abo: "B",  rh: "+", label: "Donor 3" },
    donor4: { abo: "AB", rh: "-", label: "Donor 4" }
  };
  var ORDER = ["rider", "donor1", "donor2", "donor3", "donor4"];
  var BAGS = [{ abo: "O", rh: "+" }, { abo: "O", rh: "-" }, { abo: "A", rh: "-" }, { abo: "B", rh: "+" }, { abo: "B", rh: "-" }, { abo: "AB", rh: "-" }];

  function antigens(abo, rh) { var a = (ANT[abo] || []).slice(); if (rh === "+") a.push("D"); return a; }
  function groupName(abo, rh) { return abo + " Rh" + (rh === "+" ? "+" : MINUS); }
  function bagName(b) { return b.abo + (b.rh === "+" ? "+" : MINUS); }

  /* donor red-cell antigens versus patient plasma antibodies (the rule of Lesson 07) */
  function compat(patient, donor) {
    var pab = ABS[patient.abo] || [], dag = ANT[donor.abo] || [], clash = [];
    dag.forEach(function (x) { if (pab.indexOf(x.toLowerCase()) >= 0) clash.push("antigen " + x + " meets anti-" + x.toLowerCase()); });
    var aboOK = clash.length === 0;
    var rhOK = !(patient.rh === "-" && donor.rh === "+");
    var reason = aboOK && rhOK ? "no antigen meets a matching antibody; Rh safe" : (aboOK ? "" : clash.join("; ")) + (!aboOK && !rhOK ? "; " : "") + (rhOK ? "" : "Rh+ cells could sensitise an Rh" + MINUS + " patient");
    return { aboOK: aboOK, rhOK: rhOK, safe: aboOK && rhOK, reason: reason };
  }
  function bags(patient) {
    patient = patient || { abo: "B", rh: "-" };
    return BAGS.map(function (b) { var c = compat(patient, b); return { bag: bagName(b), abo: b.abo, rh: b.rh, aboOK: c.aboOK, rhOK: c.rhOK, safe: c.safe, reason: c.reason }; });
  }

  function resolveSample(p) {
    var s = SAMPLES[p.sample];
    var abo = p.abo || (s && s.abo) || "O", rh = p.rh || (s && s.rh) || "-";
    return { abo: abo, rh: rh, label: s ? s.label : "Sample" };
  }

  /* typing(): which wells clump, what a student would read, and which mistakes bend the result */
  function typing(sp, err, rock_s) {
    err = err || {};
    var ag = antigens(sp.abo, sp.rh), wells = [], i;
    var strongT = sstep(15, 120, rock_s);
    for (i = 0; i < 3; i++) {
      var s = SERA[i], truth = ag.indexOf(s.ag) >= 0, carry = false;
      if (err.reusedStirrer && !truth) for (var j = 0; j < i; j++) if (ag.indexOf(SERA[j].ag) >= 0) carry = true;   // earlier serum dragged along with the cells
      wells.push({ serum: s.id, name: s.name, antigen: s.ag, truth: truth, carry: carry, grainy: false, amount: (truth || carry) ? strongT : 0 });
    }
    if (err.dryingEdge) {
      for (i = 2; i >= 0; i--) if (!wells[i].truth && !wells[i].carry) { wells[i].grainy = true; wells[i].amount = 0.6 * sstep(20, 60, rock_s); break; }
    }
    wells.forEach(function (w) { w.positive = w.amount >= 0.5; });
    var A = wells[0].positive, B = wells[1].positive, D = wells[2].positive;
    var abo = A && B ? "AB" : A ? "A" : B ? "B" : "O", rh = D ? "+" : "-";
    var faults = [];
    if (err.earlyRead && rock_s < 70 && wells.some(function (w) { return w.truth && !w.positive; })) faults.push("false-negative");
    if (wells.some(function (w) { return !w.truth && w.positive && w.carry; })) faults.push("false-positive-stirrer");
    if (wells.some(function (w) { return w.grainy && w.positive; })) faults.push("false-positive-drying");
    if (!err.earlyRead && rock_s < 70 && wells.some(function (w) { return w.truth && !w.positive; })) faults.push("read-too-soon");
    return { wells: wells, A: A, B: B, D: D, abo: abo, rh: rh, group: groupName(abo, rh), pattern: [A, B, D].map(function (x) { return x ? "+" : MINUS; }).join(" "),
      truth: { A: ag.indexOf("A") >= 0, B: ag.indexOf("B") >= 0, D: ag.indexOf("D") >= 0, abo: sp.abo, rh: sp.rh, group: groupName(sp.abo, sp.rh) },
      correct: abo === sp.abo && rh === sp.rh, faults: faults };
  }

  /* agglutination zoom model: a donor cell type meets a serum */
  function aggModel(donor, donorRh, serumName) {
    var ag = antigens(donor, donorRh), want = (serumName || "anti-B").replace("anti-", "").toUpperCase();
    var match = ag.indexOf(want) >= 0;
    var control = ["A", "B", "D"].filter(function (x) { return ag.indexOf(x) < 0; });
    var cSerum = control.length ? "anti-" + control[0] : "anti-A";
    return { donor: donor, donorRh: donorRh, serum: "anti-" + want, antigens: ag, clump: match, controlSerum: cSerum, controlClump: ag.indexOf(cSerum.replace("anti-", "")) >= 0,
      reason: match ? "antigen " + want + " on the cells meets anti-" + want + ": its Y arms bridge neighbouring cells, so they clump" : "no antigen " + want + " on these cells: the antibodies find nothing to hold, so the cells stay free" };
  }

  /* Rhesus staging model */
  var RH_CAPTIONS = ["Pregnancy 1: Rh+ baby, Rh" + MINUS + " mother, blood kept apart", "Birth: a few baby cells leak into the mother's blood",
    null, null];
  function rhModel(stage, prevent) {
    stage = clamp(Math.round(stage), 0, 3);
    var sens = stage >= 2 && !prevent;
    var cap = stage === 0 ? RH_CAPTIONS[0] : stage === 1 ? RH_CAPTIONS[1] :
      stage === 2 ? (prevent ? "Anti-D injection clears the baby cells before she can learn to make her own" : "Her body meets Rh+ cells and starts making anti-D (sensitised)") :
        (prevent ? "Pregnancy 2: no anti-D in her blood, so the new Rh+ baby is safe" : "Pregnancy 2: her anti-D crosses the placenta and attacks the baby's red cells");
    return { stage: stage, prevent: !!prevent, leaked: stage >= 1, motherAntiD: sens || (stage === 2 && prevent), sensitised: sens, babyAtRisk: stage >= 3 && sens, haemolytic: stage >= 3 && sens, caption: cap };
  }

  var DEFAULTS = { sample: "rider", abo: null, rh: null, patient: { abo: "B", rh: "-" }, view: "bench", step: 0, rock_s: null,
    errors: { earlyRead: false, reusedStirrer: false, dryingEdge: false },
    donor: "B", donorRh: "-", serum: "anti-B", agg: null, stage: 0, prevent: false, labels: false };

  /* ---------------------------------------------------------- geometry kits */
  var _rbc = {};
  function rbcGeo(R) {   // biconcave disc of outer radius R (lathe about Y); HeartKit's profile
    var s = R / 0.22;
    if (global.HeartKit && global.HeartKit.rbcGeo) return global.HeartKit.rbcGeo(s);
    if (_rbc[s]) return _rbc[s];
    var top = [], i, pts = [];
    for (i = 0; i <= 22; i++) { var x = i / 22, y = 0.22 * s * Math.sqrt(Math.max(0, 1 - x * x)) * (0.16 + 0.98 * x * x - 0.68 * x * x * x * x); top.push(new THREE.Vector2(Math.max(1e-4, x * 0.22 * s), y)); }
    for (i = 0; i < top.length; i++) pts.push(new THREE.Vector2(top[i].x, -top[i].y));
    for (i = top.length - 1; i >= 0; i--) pts.push(new THREE.Vector2(top[i].x, top[i].y));
    _rbc[s] = new THREE.LatheGeometry(pts, 30); return _rbc[s];
  }
  var yGeoCache = null;
  function yGeo() {      // extruded Y-shaped antibody, two arm tips span 1.5, stem 1.0 long, centred on the hinge
    if (yGeoCache) return yGeoCache;
    var s = new THREE.Shape();
    s.moveTo(-0.09, -1); s.lineTo(0.09, -1); s.lineTo(0.09, -0.04); s.lineTo(0.82, 0.894); s.lineTo(0.68, 1.006); s.lineTo(0, 0.145);
    s.lineTo(-0.68, 1.006); s.lineTo(-0.82, 0.894); s.lineTo(-0.09, -0.04); s.closePath();
    yGeoCache = new THREE.ExtrudeGeometry(s, { depth: 0.1, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.02, bevelSegments: 1, curveSegments: 4 });
    yGeoCache.translate(0, 0, -0.05); yGeoCache.computeVertexNormals(); return yGeoCache;
  }

  var _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _qf = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0)), _e = new THREE.Euler(), _p = new THREE.Vector3(), _s = new THREE.Vector3(), _z = new THREE.Vector3(0, 0, 1);
  var _qq = new THREE.Quaternion(), _v = new THREE.Vector3(), _qflip = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI), TYPES = ["A", "B", "D"];

  /* a field of red cells with antigen knobs (A cones, B spheres, D octahedra), one InstancedMesh per kind */
  function CellField(N, R, K, seed) {
    var f = { group: new THREE.Group(), N: N, R: R, K: K, cell: [] };
    var Rn = rng(seed || 5), i, k;
    var cells = new THREE.InstancedMesh(rbcGeo(R), std(0xffffff, 0.4, 0, { emissive: new THREE.Color(0x3a0508), emissiveIntensity: 0.45 }), N);
    cells.instanceMatrix.setUsage(THREE.DynamicDrawUsage); cells.frustumCulled = false; f.group.add(cells);
    var kr = R * 0.14;
    var kA = new THREE.InstancedMesh(new THREE.ConeGeometry(kr * 1.05, kr * 2.7, 8), std(0xffa04d, 0.4, 0, { emissive: new THREE.Color(0x7a3a00), emissiveIntensity: 0.4 }), N * K);
    var kB = new THREE.InstancedMesh(new THREE.SphereGeometry(kr * 1.2, 10, 8), std(0x73d6ff, 0.35, 0, { emissive: new THREE.Color(0x0a4a6a), emissiveIntensity: 0.4 }), N * K);
    var kD = new THREE.InstancedMesh(new THREE.OctahedronGeometry(kr * 1.45, 0), std(0xc58bff, 0.35, 0, { emissive: new THREE.Color(0x40206a), emissiveIntensity: 0.4 }), N * K);
    [kA, kB, kD].forEach(function (m) { m.instanceMatrix.setUsage(THREE.DynamicDrawUsage); m.frustumCulled = false; f.group.add(m); });
    f.kn = { A: kA, B: kB, D: kD };
    for (i = 0; i < N; i++) {
      var loc = [];
      for (k = 0; k < K; k++) {
        var th = k / K * TAU + Rn() * 0.5, x = 0.3 + 0.62 * Rn(), side = k < K - 2 ? 1 : -1;
        var hh = R * Math.sqrt(1 - x * x) * (0.16 + 0.98 * x * x - 0.68 * x * x * x * x) + kr * 0.6;
        loc.push(new V3(R * x * Math.cos(th), side * hh, R * x * Math.sin(th)));
      }
      f.cell.push({ pos: new V3(), tilt: new V3((Rn() - 0.5) * 1.5, (Rn() - 0.5) * 1.5, Rn() * TAU), ph: Rn() * TAU, s: 1, col: new THREE.Color(0xd9343f), ants: {}, loc: loc, quat: new THREE.Quaternion() });
      cells.setColorAt(i, f.cell[i].col);
    }
    f.cells = cells;
    f.commit = function (t) {
      for (var i = 0; i < N; i++) {
        var c = f.cell[i], w = 0.12 * Math.sin(t * 0.9 + c.ph);
        _e.set(c.tilt.x + w, c.tilt.y + w * 0.7, 0); _q.setFromEuler(_e); _qq.setFromEuler(_e.set(0, 0, c.tilt.z * 0.0)); c.quat.copy(_q).multiply(_qf);
        _s.setScalar(Math.max(1e-4, c.s)); _m.compose(c.pos, c.quat, _s); cells.setMatrixAt(i, _m);
        cells.setColorAt(i, c.col);
        for (var k = 0; k < K; k++) {
          var id = i * K + k, side = c.loc[k].y > 0 ? 1 : -1;
          _v.copy(c.loc[k]).multiplyScalar(c.s).applyQuaternion(c.quat).add(c.pos);
          _qq.copy(c.quat); if (side < 0) _qq.multiply(_qflip);
          for (var ti = 0; ti < 3; ti++) {
            var T = TYPES[ti]; _s.setScalar(c.ants[T] ? Math.max(1e-4, c.s) : 1e-4); _m.compose(_v, _qq, _s); f.kn[T].setMatrixAt(id, _m);
          }
        }
      }
      cells.instanceMatrix.needsUpdate = true; if (cells.instanceColor) cells.instanceColor.needsUpdate = true;
      ["A", "B", "D"].forEach(function (T) { f.kn[T].instanceMatrix.needsUpdate = true; });
    };
    return f;
  }

  /* a field of Y antibodies (InstancedMesh) */
  function YField(M, seed) {
    var f = { M: M, y: [], group: new THREE.Group() }, Rn = rng(seed || 9);
    var mesh = new THREE.InstancedMesh(yGeo(), std(0xffffff, 0.35, 0.05, { emissive: new THREE.Color(0x222222), emissiveIntensity: 0.4 }), M);
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); mesh.frustumCulled = false; f.group.add(mesh); f.mesh = mesh;
    for (var i = 0; i < M; i++) { f.y.push({ pos: new V3(), quat: new THREE.Quaternion(), s: 0, col: new THREE.Color(0xffffff), spin: (Rn() - 0.5) * 1.2, rot: Rn() * TAU }); mesh.setColorAt(i, f.y[i].col); }
    f.commit = function () {
      for (var i = 0; i < M; i++) { var y = f.y[i]; _s.setScalar(Math.max(1e-4, y.s)); _m.compose(y.pos, y.quat, _s); mesh.setMatrixAt(i, _m); mesh.setColorAt(i, y.col); }
      mesh.instanceMatrix.needsUpdate = true; mesh.instanceColor.needsUpdate = true;
    };
    return f;
  }

  /* ---------------------------------------------------------- BENCH apparatus */
  var TILE_TOP = 0.5, COLS = [-2.6, 0, 2.6], ROW0 = -4.2, ROWD = 2.1, TILE_W = 9.6, TILE_D = 12.6, TILE_Z = 1.0, WELL_R = 0.82;
  function rowZ(r) { return TILE_Z + ROW0 + ROWD * r; }

  function buildTile() {
    var g = new THREE.Group();
    var sh = rrShape(TILE_W, TILE_D, 0.9), i, j;
    for (i = 0; i < 5; i++) for (j = 0; j < 3; j++) { var h = new THREE.Path(); h.absarc(COLS[j], -(ROW0 + ROWD * i), WELL_R, 0, TAU, true); sh.holes.push(h); }
    var geo = new THREE.ExtrudeGeometry(sh, { depth: TILE_TOP - 0.1, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.06, bevelSegments: 2, curveSegments: 20 });
    geo.rotateX(-Math.PI / 2); geo.translate(0, 0.05, 0); geo.computeVertexNormals();
    var body = new THREE.Mesh(geo, std(0xf4f4ef, 0.22, 0.02)); g.add(body);
    var bowlGeo = lathe([[0.9, TILE_TOP], [WELL_R, TILE_TOP - 0.02], [0.8, 0.38], [0.7, 0.26], [0.52, 0.17], [0.27, 0.12], [0, 0.11]], 28);
    var bowlMat = std(0xfafaf5, 0.18, 0.02, { side: THREE.DoubleSide }), wells = new THREE.Group();
    wells.userData.cells = [];
    var discGeo = new THREE.CircleGeometry(0.66, 24); discGeo.rotateX(-Math.PI / 2);
    var capGeo = new THREE.SphereGeometry(2.23, 20, 5, 0, TAU, 0, 0.30);
    var capMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.04, metalness: 0, transparent: true, opacity: 0.2, depthWrite: false, envMapIntensity: 1.8 });
    for (i = 0; i < 5; i++) for (j = 0; j < 3; j++) {
      var w = new THREE.Group(); w.position.set(COLS[j], 0, -(-(ROW0 + ROWD * i)));
      w.position.z = ROW0 + ROWD * i;
      var bowl = new THREE.Mesh(bowlGeo, bowlMat); w.add(bowl);
      var cv = document.createElement("canvas"); cv.width = cv.height = 128;
      var tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
      var disc = new THREE.Mesh(discGeo, new THREE.MeshStandardMaterial({ map: tex, transparent: true, roughness: 0.3, metalness: 0, depthWrite: false })); disc.position.y = 0.27; disc.renderOrder = 2; w.add(disc);
      var cap = new THREE.Mesh(capGeo, capMat); cap.position.y = 0.27 + 0.1 - 2.23; cap.renderOrder = 3; w.add(cap);
      wells.add(w); wells.userData.cells.push({ group: w, cv: cv, tex: tex, disc: disc, cap: cap, key: "", row: i, col: j });
    }
    g.add(wells);
    var ov = document.createElement("canvas"); ov.width = 384; ov.height = 504;
    var ovTex = new THREE.CanvasTexture(ov); ovTex.colorSpace = THREE.SRGBColorSpace; ovTex.anisotropy = 4;
    var ovMesh = new THREE.Mesh(new THREE.PlaneGeometry(TILE_W, TILE_D), new THREE.MeshBasicMaterial({ map: ovTex, transparent: true, depthWrite: false }));
    ovMesh.rotation.x = -Math.PI / 2; ovMesh.position.y = TILE_TOP + 0.01; ovMesh.renderOrder = 4; g.add(ovMesh);
    g.userData = { wells: wells, ov: ov, ovTex: ovTex, body: body };
    return g;
  }

  function drawTileOverlay(tile, active, doneRows, labels) {
    var ud = tile.userData, g = ud.ov.getContext("2d"), W = ud.ov.width, H = ud.ov.height, pxcm = W / TILE_W;
    g.clearRect(0, 0, W, H);
    g.textAlign = "center"; g.textBaseline = "middle";
    SERA.forEach(function (s, j) {
      var x = (TILE_W / 2 + COLS[j]) * pxcm, y = 0.95 * pxcm;
      g.fillStyle = "rgb(" + s.rgb.join(",") + ")"; g.beginPath(); g.arc(x, y - 22, 7, 0, TAU); g.fill();
      g.fillStyle = "#2a3340"; g.font = "bold 24px Arial, sans-serif"; g.fillText(s.name, x, y + 6);
    });
    for (var r = 0; r < 5; r++) {
      var y2 = (TILE_D / 2 + ROW0 + ROWD * r) * pxcm;
      g.strokeStyle = "rgba(60,70,85,.35)"; g.lineWidth = 2;
      for (var j = 0; j < 3; j++) { g.beginPath(); g.arc((TILE_W / 2 + COLS[j]) * pxcm, y2, (WELL_R + 0.12) * pxcm, 0, TAU); g.stroke(); }
      g.fillStyle = r === active ? "#0e7a6a" : "#4a5563"; g.font = (r === active ? "bold " : "") + "22px Arial, sans-serif";
      g.fillText(["R", "D1", "D2", "D3", "D4"][r], 0.78 * pxcm, y2);
      if (doneRows[r]) { g.strokeStyle = "#1d9b5a"; g.lineWidth = 4; g.beginPath(); g.moveTo(TILE_W * pxcm - 0.95 * pxcm, y2); g.lineTo(TILE_W * pxcm - 0.78 * pxcm, y2 + 12); g.lineTo(TILE_W * pxcm - 0.45 * pxcm, y2 - 14); g.stroke(); }
      if (r === active) {
        g.strokeStyle = "rgba(14,160,140,.85)"; g.lineWidth = 3; g.beginPath();
        var x0 = 1.15 * pxcm, x1 = (TILE_W - 1.2) * pxcm, yy = y2 - 1.0 * pxcm, hh = 2.0 * pxcm;
        g.moveTo(x0 + 10, yy); g.arcTo(x1, yy, x1, yy + hh, 10); g.arcTo(x1, yy + hh, x0, yy + hh, 10); g.arcTo(x0, yy + hh, x0, yy, 10); g.arcTo(x0, yy, x1, yy, 10); g.stroke();
      }
    }
    ud.ovTex.needsUpdate = true;
  }

  /* well fluid texture: serum, blood, mixing and granular clumps, all from state numbers */
  function drawWell(cv, S, seed) {
    var g = cv.getContext("2d"), c = 64, R = 62, i;
    g.clearRect(0, 0, 128, 128);
    if (S.serum < 0.02 && S.blood < 0.02) return;
    var sr = SERA[S.col], rs = R * (0.42 + 0.58 * S.serum);
    var a = S.clump, rgb = sr.rgb;
    g.fillStyle = "rgba(" + rgb.join(",") + "," + (sr.a * (1 - 0.35 * a)) + ")"; g.beginPath(); g.arc(c, c, rs, 0, TAU); g.fill();
    g.strokeStyle = "rgba(255,255,255,.35)"; g.lineWidth = 2; g.beginPath(); g.arc(c, c, rs - 1, 0, TAU); g.stroke();
    if (S.blood > 0.02) {
      var rb = lerp(7 + 9 * S.blood, rs * 0.97, S.mix);
      var smooth = 1 - 0.9 * a;
      var gr = g.createRadialGradient(c - rb * 0.2, c - rb * 0.2, 1, c, c, rb);
      gr.addColorStop(0, "rgba(196,28,42," + 0.96 * smooth + ")"); gr.addColorStop(1, "rgba(222,66,78," + 0.9 * smooth + ")");
      g.fillStyle = gr; g.beginPath(); g.arc(c, c, rb, 0, TAU); g.fill();
      if (S.mix > 0.02 && S.mix < 0.98) {       // swirl streaks while the stirrer works
        g.strokeStyle = "rgba(255,230,230,.45)"; g.lineWidth = 2;
        for (i = 0; i < 3; i++) { g.beginPath(); g.arc(c, c, rb * (0.25 + i * 0.22), i, i + 1.6 + S.mix * 2); g.stroke(); }
      }
      if (a > 0.02 && S.mix > 0.9) {
        var R2 = rng(seed), n = Math.floor((S.grainy ? 150 : 300) * a), cx0 = 0, cy0 = 0;
        for (i = 0; i < n; i++) {
          if (i % 9 === 0) { var rr = S.grainy ? rb * (0.72 + 0.2 * R2()) : rb * 0.82 * Math.sqrt(R2()), th = R2() * TAU; cx0 = c + rr * Math.cos(th); cy0 = c + rr * Math.sin(th); }
          var d = (S.grainy ? 5 : 12) * Math.sqrt(R2()), th2 = R2() * TAU, x = cx0 + d * Math.cos(th2), y = cy0 + d * Math.sin(th2);
          if ((x - c) * (x - c) + (y - c) * (y - c) > rb * rb) continue;
          var rad = (S.grainy ? 1.2 : 1.7) + R2() * (S.grainy ? 1.8 : 3.0) * (0.5 + a * 0.6);
          g.fillStyle = "rgba(136,12,26,.96)"; g.beginPath(); g.arc(x, y, rad, 0, TAU); g.fill();
          g.fillStyle = "rgba(226,100,104,.7)"; g.beginPath(); g.arc(x - rad * 0.3, y - rad * 0.3, rad * 0.35, 0, TAU); g.fill();
        }
      }
    }
  }

  function buildBottle(o) {
    var g = new THREE.Group(), R = o.R || 1.0;
    var prof = [[0, 0], [R * 0.7, 0], [R * 0.93, 0.32], [R, 0.7], [R, 3.2], [R * 0.9, 3.9], [R * 0.5, 4.4], [R * 0.5, 5.3], [R * 0.58, 5.4],
      [R * 0.4, 5.4], [R * 0.4, 4.4], [R * 0.82, 3.85], [R * 0.9, 3.2], [R * 0.9, 0.7], [R * 0.82, 0.38], [R * 0.58, 0.08], [0, 0.08]];
    var body = new THREE.Mesh(lathe(prof, 36), glass(o.glassColor || 0xdde9ec, 0.34, 0.05)); g.add(body);
    var liqH = 2.5;
    var liq = new THREE.Mesh(lathe([[0, 0.09], [R * 0.66, 0.09], [R * 0.84, 0.4], [R * 0.9, 0.75], [R * 0.9, liqH], [R * 0.84, liqH + 0.03], [0, liqH - 0.05]], 28), liquid(o.liq, o.liqOpacity || 0.9)); g.add(liq);
    var lab = new THREE.Mesh(new THREE.CylinderGeometry(R * 1.015, R * 1.015, 1.7, 28, 1, true, -1.2, 2.4), std(0xffffff, 0.7, 0, { map: o.labelTex, side: THREE.FrontSide }));
    lab.position.y = 1.7; g.add(lab);
    var d = new THREE.Group();
    var pipe = new THREE.Mesh(lathe([[0, 0], [0.04, 0], [0.09, 0.3], [0.2, 2.2], [0.24, 4.8], [0.17, 4.8], [0.12, 2.2], [0.04, 0.35], [0, 0]], 12), glass(0xe8f4f6, 0.45, 0.04)); d.add(pipe);
    var fill = new THREE.Mesh(lathe([[0, 0.02], [0.03, 0.05], [0.07, 0.3], [0.14, 2.0], [0.18, 2.9], [0, 2.9]], 10), liquid(o.liq, 0.92)); d.add(fill);
    var collar = new THREE.Mesh(lathe([[0, 4.6], [R * 0.62, 4.6], [R * 0.66, 4.7], [R * 0.66, 5.35], [R * 0.5, 5.45], [0.34, 5.5], [0, 5.5]], 20), std(o.cap, 0.5, 0.05)); d.add(collar);
    var teat = new THREE.Mesh(lathe([[0, 5.45], [0.34, 5.45], [0.34, 5.7], [0.5, 6.4], [0.52, 7.2], [0.36, 7.9], [0, 8.05]], 20), std(o.cap, 0.65, 0)); d.add(teat);
    var dropMesh = new THREE.Mesh(lathe([[0, 0], [0.04, 0.03], [0.1, 0.14], [0.12, 0.25], [0.09, 0.36], [0.03, 0.44], [0, 0.48]], 10), liquid(o.dropColor || o.liq, 0.9)); dropMesh.visible = false; d.add(dropMesh);
    return { group: g, dropper: d, teat: teat, drop: dropMesh, lab: lab, height: 5.4 };
  }
  function bottleLabel(name, band) {
    return ctex(256, 128, function (g, w, h) {
      g.fillStyle = "#f7f3e8"; g.fillRect(0, 0, w, h); g.fillStyle = band; g.fillRect(0, 0, w, 30);
      g.fillStyle = "#222"; g.textAlign = "center"; g.textBaseline = "middle"; g.font = "bold 44px Arial, sans-serif"; g.fillText(name, w / 2, 76);
    });
  }
  function sampleLabel(name) {
    return ctex(256, 128, function (g, w, h) {
      g.fillStyle = "#fbf6ea"; g.fillRect(0, 0, w, h); g.fillStyle = "#b0202f"; g.fillRect(0, 0, w, 26);
      g.fillStyle = "#222"; g.textAlign = "center"; g.textBaseline = "middle"; g.font = "bold 40px Arial, sans-serif"; g.fillText(name, w / 2, 74);
      g.font = "22px Arial, sans-serif"; g.fillText("blood sample", w / 2, 108);
    });
  }

  function buildStirrer(tintHex) {
    var g = new THREE.Group();
    var sh = new THREE.Shape(); sh.moveTo(-0.22, 0); sh.lineTo(0.22, 0); sh.lineTo(0.3, 0.55); sh.lineTo(0.12, 0.9); sh.lineTo(-0.12, 0.9); sh.lineTo(-0.3, 0.55); sh.closePath();
    var pad = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: 0.07, bevelEnabled: false }), glass(tintHex, 0.8, 0.2)); pad.position.z = -0.035; g.add(pad);
    var rod = new THREE.Mesh(lathe([[0, 0.8], [0.07, 0.8], [0.08, 5.6], [0.1, 6.0], [0, 6.0]], 8), glass(tintHex, 0.8, 0.2)); g.add(rod);
    g.userData.length = 6;
    return g;
  }

  function buildLancet() {
    var g = new THREE.Group();
    var body = new THREE.Mesh(lathe([[0, 0], [0.34, 0], [0.4, 0.4], [0.42, 3.2], [0.32, 3.9], [0.22, 4.3], [0, 4.3]], 18), std(0xe9eef2, 0.35, 0.02)); g.add(body);
    var grip = new THREE.Mesh(lathe([[0.4, 1.0], [0.46, 1.1], [0.46, 2.3], [0.42, 2.4], [0.42, 1.0]], 18), std(0x2a8a9a, 0.6)); g.add(grip);
    var cap = new THREE.Mesh(lathe([[0, 4.2], [0.2, 4.2], [0.26, 4.5], [0.26, 5.0], [0.14, 5.3], [0, 5.35]], 12), std(0xc8283a, 0.5)); g.add(cap);
    var tip = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.6, 8), std(0xc0c8d0, 0.2, 0.9)); tip.position.y = 4.55; g.add(tip);
    g.userData.length = 5.3;
    return g;
  }

  function buildSharps() {
    var g = new THREE.Group(), W = 4.2, D = 3.0, H = 5.6;
    var body = new THREE.Mesh(new THREE.ExtrudeGeometry(rrShape(W, D, 0.5), { depth: H, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.1, bevelSegments: 2, curveSegments: 6 }), std(0xf3c21c, 0.45, 0.02));
    body.geometry.rotateX(-Math.PI / 2); body.position.y = 0.1; g.add(body);
    var ls = rrShape(W + 0.3, D + 0.3, 0.55), slot = new THREE.Path(); slot.moveTo(-1.3, -0.25); slot.lineTo(1.3, -0.25); slot.lineTo(1.3, 0.25); slot.lineTo(-1.3, 0.25); slot.closePath(); ls.holes.push(slot);
    var lid = new THREE.Mesh(new THREE.ExtrudeGeometry(ls, { depth: 0.55, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.08, bevelSegments: 2, curveSegments: 6 }), std(0xc8283a, 0.45, 0.02));
    lid.geometry.rotateX(-Math.PI / 2); lid.position.y = H + 0.1; g.add(lid);
    var tx = ctex(256, 200, function (c, w, h) {
      c.fillStyle = "#f3c21c"; c.fillRect(0, 0, w, h); c.fillStyle = "#b0182a"; c.beginPath(); c.moveTo(w / 2, 14); c.lineTo(w - 40, h - 70); c.lineTo(40, h - 70); c.closePath(); c.fill();
      c.fillStyle = "#fff"; c.font = "bold 70px Arial, sans-serif"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText("!", w / 2, h - 118);
      c.fillStyle = "#1b1b1b"; c.font = "bold 40px Arial, sans-serif"; c.fillText("SHARPS", w / 2, h - 34);
    });
    var face = new THREE.Mesh(new THREE.PlaneGeometry(W * 0.86, H * 0.64), new THREE.MeshBasicMaterial({ map: tx })); face.position.set(0, H * 0.46, D / 2 + 0.115); g.add(face);
    g.userData.slotY = H + 0.7;
    return g;
  }

  function buildTimer() {
    var g = new THREE.Group(), cv = document.createElement("canvas"); cv.width = cv.height = 192;
    var tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
    var body = new THREE.Mesh(lathe([[0, 0], [1.5, 0], [1.65, 0.1], [1.7, 0.45], [1.6, 0.7], [0, 0.7]], 32), std(0x2d3a4a, 0.4, 0.4)); g.add(body);
    var face = new THREE.Mesh(new THREE.CircleGeometry(1.45, 32), new THREE.MeshBasicMaterial({ map: tex })); face.rotation.x = -Math.PI / 2; face.position.y = 0.71; g.add(face);
    var btn = new THREE.Mesh(lathe([[0, 0], [0.28, 0], [0.3, 0.3], [0.2, 0.42], [0, 0.42]], 12), std(0xc0c8d0, 0.25, 0.8)); btn.position.set(0, 0.55, -1.8); btn.rotation.x = 0; g.add(btn);
    g.userData = { cv: cv, tex: tex, last: -1 };
    return g;
  }
  function drawTimer(t, secs) {
    var cv = t.userData.cv, g = cv.getContext("2d"), s = Math.round(secs);
    if (s === t.userData.last) return; t.userData.last = s;
    g.fillStyle = "#f4f6f0"; g.fillRect(0, 0, 192, 192);
    g.strokeStyle = "#2d3a4a"; g.lineWidth = 6; g.beginPath(); g.arc(96, 96, 88, 0, TAU); g.stroke();
    for (var i = 0; i < 12; i++) { var a = i / 12 * TAU; g.lineWidth = 3; g.beginPath(); g.moveTo(96 + Math.sin(a) * 78, 96 - Math.cos(a) * 78); g.lineTo(96 + Math.sin(a) * 86, 96 - Math.cos(a) * 86); g.stroke(); }
    g.fillStyle = s >= 120 ? "#1d9b5a" : "#1d2733"; g.font = "bold 50px Arial, sans-serif"; g.textAlign = "center"; g.textBaseline = "middle";
    g.fillText(Math.floor(s / 60) + ":" + ("0" + (s % 60)).slice(-2), 96, 100);
    var a2 = (clamp(s, 0, 120) / 60) * TAU; g.strokeStyle = "#c8283a"; g.lineWidth = 5; g.beginPath(); g.moveTo(96, 96); g.lineTo(96 + Math.sin(a2) * 66, 96 - Math.cos(a2) * 66); g.stroke();
    t.userData.tex.needsUpdate = true;
  }

  /* ---------------------------------------------------------- AGGLUTINATION panel (zoom view) */
  var PANEL_W = 18.4, PANEL_H = 10.6;
  function buildAggPanel(seed) {
    var P = { group: new THREE.Group(), seed: seed };
    var back = new THREE.Mesh(new THREE.ExtrudeGeometry(rrShape(PANEL_W, PANEL_H, 0.9), { depth: 0.5, bevelEnabled: true, bevelThickness: 0.12, bevelSize: 0.12, bevelSegments: 2, curveSegments: 8 }), std(0x16253a, 0.5, 0.05));
    back.position.z = -0.95; P.group.add(back);
    var fcv = document.createElement("canvas"); fcv.width = 256; fcv.height = 148;
    var ftex = new THREE.CanvasTexture(fcv); ftex.colorSpace = THREE.SRGBColorSpace;
    var fluid = new THREE.Mesh(new THREE.PlaneGeometry(PANEL_W - 0.5, PANEL_H - 0.5), new THREE.MeshBasicMaterial({ map: ftex })); fluid.position.z = -0.5; P.group.add(fluid);
    P.fcv = fcv; P.ftex = ftex;
    P.cf = CellField(14, 1.0, 8, seed);
    P.yf = YField(27, seed + 3);
    P.group.add(P.cf.group); P.group.add(P.yf.group);
    var Rn = rng(seed + 11), rows = [[5, 2.7], [4, 0], [5, -2.7]], idx = 0, i, j;
    P.cluster = []; P.free = []; P.fph = [];
    rows.forEach(function (r) { for (var k = 0; k < r[0]; k++) { P.cluster.push(new V3((k - (r[0] - 1) / 2) * 3.1, r[1], 0)); } });
    for (i = 0; i < 14; i++) { P.free.push(new V3((Rn() - 0.5) * 15.4, (Rn() - 0.5) * 8, (Rn() - 0.5) * 0.9)); P.fph.push(Rn() * TAU); }
    P.edges = [];
    for (i = 0; i < 14; i++) for (j = i + 1; j < 14; j++) if (P.cluster[i].distanceTo(P.cluster[j]) < 3.3) P.edges.push([i, j]);
    P.yfree = []; P.yph = []; P.ydelay = [];
    for (i = 0; i < 27; i++) { P.yfree.push(new V3((Rn() - 0.5) * 16, (Rn() - 0.5) * 8.4, (Rn() - 0.5) * 0.8 + 0.2)); P.yph.push(Rn() * TAU); P.ydelay.push(Rn() * 0.45); }
    P.label = null;
    P.set = function (donorAnt, serumAg, binds, serumRgb, labelText) {
      var ag = {}; donorAnt.forEach(function (a) { ag[a] = true; });
      P.cf.cell.forEach(function (c) { c.ants = ag; });
      P.binds = binds; P.ycol = new THREE.Color(AG_COL[serumAg] || "#ffffff");
      var g = fcv.getContext("2d"), gr = g.createRadialGradient(128, 74, 10, 128, 74, 150), c = serumRgb;
      gr.addColorStop(0, "rgba(" + c.join(",") + ",0.30)"); gr.addColorStop(1, "rgba(" + c.join(",") + ",0.12)");
      g.fillStyle = "#0e1a2b"; g.fillRect(0, 0, 256, 148); g.fillStyle = gr; g.fillRect(0, 0, 256, 148);
      ftex.needsUpdate = true;
      if (P.label) { P.group.remove(P.label); P.label.geometry.dispose(); }
      P.label = plate(labelText, 9.4, 1.5, { size: 38 }); P.label.position.set(-PANEL_W / 2 + 5.2, PANEL_H / 2 + 1.05, 0.2); P.group.add(P.label);
    };
    P.update = function (c, t) {
      var e = c * c * (3 - 2 * c), i, cells = P.cf.cell;
      for (i = 0; i < 14; i++) {
        var fp = P.free[i], dr = 0.35 + 0.1 * (i % 3);
        _p.set(fp.x + Math.sin(t * 0.55 + P.fph[i]) * dr * 1.6, fp.y + Math.cos(t * 0.47 + P.fph[i] * 1.3) * dr * 1.4, fp.z);
        var cl = P.cluster[i]; cells[i].pos.set(lerp(_p.x, cl.x, e), lerp(_p.y, cl.y, e), lerp(_p.z, 0, e));
        cells[i].s = 1;
        cells[i].col.setRGB(lerp(0.85, 0.62, e * 0.6), lerp(0.2, 0.1, e * 0.6), lerp(0.25, 0.14, e * 0.6));
      }
      P.cf.commit(t);
      var ys = P.yf.y, m = P.edges.length;
      for (i = 0; i < 27; i++) {
        var y = ys[i]; y.col.copy(P.ycol);
        var yf = P.yfree[i], fx = yf.x + Math.sin(t * 0.7 + P.yph[i]) * 1.1, fy = yf.y + Math.cos(t * 0.6 + P.yph[i] * 1.7) * 0.9;
        if (P.binds && i < m) {
          var ed = P.edges[i], a = cells[ed[0]].pos, b = cells[ed[1]].pos, f = sstep(P.ydelay[i], P.ydelay[i] + 0.5, c);
          y.pos.set(lerp(fx, (a.x + b.x) / 2, f), lerp(fy, (a.y + b.y) / 2, f), lerp(yf.z, 0.15, f));
          var ang = Math.atan2(b.y - a.y, b.x - a.x), free = (P.yph[i] + t * y.spin);
          _q.setFromAxisAngle(_z, lerp(free, ang + (i % 2 ? Math.PI : 0) * 0 , f));
          y.quat.copy(_q);
          var gapScale = clamp(a.distanceTo(b) - 2.0, 0.2, 2.2) / 1.5;
          y.s = lerp(0.8, 0.73 * Math.max(0.75, gapScale > 1.1 ? 1 : gapScale), f);
        } else {
          y.pos.set(fx, fy, yf.z); y.quat.setFromAxisAngle(_z, P.yph[i] + t * y.spin); y.s = i < 20 ? 0.8 : 0.0;
          if (P.binds && i >= m) y.s = 0;
        }
      }
      P.yf.commit();
    };
    return P;
  }

  /* ---------------------------------------------------------- RHESUS staged scene */
  function buildRhesus() {
    var G = { group: new THREE.Group() }, g = G.group, i;
    var skin = std(0xb98258, 0.6, 0, { emissive: new THREE.Color(0x3a2010), emissiveIntensity: 0.5, transparent: true, opacity: 0.78 });
    // mother figure (bust and belly) with uterus, baby, placenta, umbilical cord
    var fig = new THREE.Shape();
    fig.moveTo(-1.1, 10.4); fig.quadraticCurveTo(-1.2, 9.9, -2.5, 9.5); fig.quadraticCurveTo(-3.1, 8.4, -2.1, 7.0); fig.quadraticCurveTo(-3.0, 5.8, -2.7, 4.6);
    fig.quadraticCurveTo(-2.6, 3.6, -2.2, 3.2); fig.lineTo(2.2, 3.2); fig.quadraticCurveTo(2.6, 3.6, 2.7, 4.6); fig.quadraticCurveTo(3.0, 5.8, 2.1, 7.0);
    fig.quadraticCurveTo(3.1, 8.4, 2.5, 9.5); fig.quadraticCurveTo(1.2, 9.9, 1.1, 10.4); fig.closePath();
    var body = new THREE.Mesh(new THREE.ExtrudeGeometry(fig, { depth: 0.5, bevelEnabled: true, bevelThickness: 0.12, bevelSize: 0.12, bevelSegments: 2, curveSegments: 10 }), skin); body.position.z = -0.9; g.add(body);
    var neck = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.55, 1.1, 14), std(0xb98258, 0.6, 0, { emissive: new THREE.Color(0x3a2010), emissiveIntensity: 0.5 })); neck.position.set(0, 10.5, -0.65); g.add(neck);
    var head = new THREE.Mesh(new THREE.SphereGeometry(1.0, 20, 14), std(0xb98258, 0.6, 0, { emissive: new THREE.Color(0x3a2010), emissiveIntensity: 0.5 })); head.position.set(0, 11.6, -0.6); head.scale.set(0.92, 1.08, 0.9); g.add(head);
    var ut = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16), std(0xd88a8a, 0.55, 0, { transparent: true, opacity: 0.85 })); ut.scale.set(1.75, 1.6, 0.5); ut.position.set(0, 5.5, -0.35); g.add(ut);
    var baby = new THREE.Group();
    var bb = new THREE.Mesh(new THREE.SphereGeometry(1, 18, 12), std(0xb8825c, 0.6)); bb.scale.set(0.95, 0.65, 0.4); baby.add(bb);
    var bh = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 12), std(0xb8825c, 0.6)); bh.position.set(-0.85, 0.35, 0); baby.add(bh);
    var bl = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, 0.7, 4, 8), std(0xb8825c, 0.6)); bl.position.set(0.75, -0.35, 0.05); bl.rotation.z = 1.2; baby.add(bl);
    baby.position.set(-0.1, 5.5, -0.05); baby.rotation.z = 0.25; g.add(baby);
    var plac = new THREE.Mesh(new THREE.SphereGeometry(1, 18, 12), std(0x7a1f2a, 0.7)); plac.scale.set(0.38, 1.05, 0.38); plac.position.set(1.62, 5.5, -0.15); g.add(plac);
    var cord = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new V3(0.55, 5.45, 0), new V3(1.0, 5.1, 0.1), new V3(1.45, 5.35, 0)]), 12, 0.07, 6), std(0xe3d0b0, 0.6)); g.add(cord);
    var lb1 = plate("Mother Rh" + MINUS, 6.4, 1.3, { size: 40 }); lb1.position.set(-5.3, 2.0, 0.3); g.add(lb1);
    var lb2 = plate("Baby Rh+", 6.4, 1.3, { size: 40 }); lb2.position.set(5.3, 2.0, 0.3); g.add(lb2);
    // two blood zones and the placenta wall
    function zone(cx) {
      var m = new THREE.Mesh(new THREE.ExtrudeGeometry(rrShape(8.6, 11.0, 0.8), { depth: 0.3, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.08, bevelSegments: 2, curveSegments: 8 }), std(0x2a1016, 0.55, 0.05, { transparent: true, opacity: 0.9 }));
      m.position.set(cx, -4, -1.0); g.add(m);
    }
    zone(-5.15); zone(5.15);
    var wallMat = std(0xc9777f, 0.6);
    function wallSeg(y0, y1) { var h = y1 - y0, m = new THREE.Mesh(new THREE.ExtrudeGeometry(rrShape(1.0, h, 0.3), { depth: 0.9, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.06, bevelSegments: 1, curveSegments: 6 }), wallMat); m.position.set(0, (y0 + y1) / 2, -0.95); g.add(m); }
    wallSeg(-3.2, 1.5); wallSeg(-9.5, -5.8);
    var mem = new THREE.Mesh(new THREE.BoxGeometry(0.4, 2.6, 0.8), std(0xe9a5ab, 0.55, 0, { transparent: true, opacity: 0.85 })); mem.position.set(0, -4.5, -0.55); g.add(mem);
    G.mem = mem;
    var lbP = plate("placenta", 3.0, 1.0, { size: 40, bg: "rgba(120,30,40,.9)" }); lbP.position.set(0, 3.2 - 1.2, 0.3); lbP.position.y = 2.0; lbP.visible = false;
    // cells
    var cf = CellField(17, 0.62, 8, 31); G.cf = cf; g.add(cf.group);
    var yf = YField(10, 41); G.yf = yf; g.add(yf.group);
    var Rn = rng(77);
    G.mHome = []; G.bHome = []; G.bClump = [];
    var mpos = [[-8, -1], [-5.4, -0.2], [-3, -1.6], [-7.6, -3.6], [-4.4, -4], [-2.6, -6], [-7.8, -6.6], [-5, -7.9], [-3, -8.4]];
    mpos.forEach(function (p, k) { G.mHome.push(new V3(p[0] + (Rn() - 0.5) * 0.3, p[1], 0.1)); });
    var bpos = [[3, -0.8], [5.4, 0], [7.9, -1.2], [3.6, -3.4], [6.2, -3.6], [8.2, -5.6], [3.6, -6.4], [5.8, -7.4]];
    bpos.forEach(function (p) { G.bHome.push(new V3(p[0] + (Rn() - 0.5) * 0.3, p[1], 0.1)); });
    for (i = 0; i < 8; i++) G.bClump.push(new V3(5.4 + ((i % 3) - 1) * 1.15, -4.6 + (Math.floor(i / 3) - 1) * 1.15, 0.1));
    G.leakTarget = [new V3(-2.6, -3.3, 0.1), new V3(-3.8, -4.7, 0.1), new V3(-2.5, -5.2, 0.1), new V3(-4.2, -2.6, 0.1)];
    G.seedFloat = []; for (i = 0; i < 17; i++) G.seedFloat.push(Rn() * TAU);
    cf.cell.forEach(function (c, k) { c.ants = k < 9 ? {} : { D: true }; });
    // plasma cell (makes anti-D) and syringe (anti-D injection)
    var pc = new THREE.Group();
    var pcb = new THREE.Mesh(new THREE.SphereGeometry(0.95, 20, 14), std(0xe0d6f2, 0.5, 0, { transparent: true, opacity: 0.88 })); pc.add(pcb);
    var pcn = new THREE.Mesh(new THREE.SphereGeometry(0.62, 16, 12), std(0x6b3fb0, 0.6)); pcn.position.set(0.1, 0.05, 0.2); pc.add(pcn);
    pc.position.set(-6.2, -7.6, 0.2); pc.scale.setScalar(1e-4); g.add(pc); G.pc = pc;
    var sy = new THREE.Group();
    var barrel = new THREE.Mesh(lathe([[0, 0], [0.5, 0], [0.5, 4.2], [0.62, 4.2], [0.62, 4.45], [0, 4.45]], 20), glass(0xe8f3f6, 0.5, 0.05)); sy.add(barrel);
    var dose = new THREE.Mesh(lathe([[0, 0.05], [0.4, 0.05], [0.4, 3.6], [0, 3.6]], 16), liquid(0xc58bff, 0.85)); sy.add(dose); G.dose = dose;
    var plunger = new THREE.Mesh(lathe([[0, 4.4], [0.18, 4.4], [0.18, 7.0], [0.7, 7.0], [0.7, 7.2], [0, 7.2]], 12), std(0x2a8a9a, 0.5)); sy.add(plunger); G.plunger = plunger;
    var needle = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.8, 8), std(0xc8d0d8, 0.2, 0.9)); needle.position.y = -0.9; sy.add(needle);
    sy.scale.setScalar(0.85); sy.visible = false; g.add(sy); G.sy = sy;
    G.stageLabel = null;
    return G;
  }

  /* ---------------------------------------------------------- the kit */
  var texCache = {};
  function create(opts) {
    var p = {}, k;
    for (k in DEFAULTS) p[k] = DEFAULTS[k];
    p.errors = { earlyRead: false, reusedStirrer: false, dryingEdge: false };
    p.patient = { abo: "B", rh: "-" };
    if (opts) for (k in opts) { if (k === "errors") for (var e in opts.errors) p.errors[e] = !!opts.errors[e]; else if (k === "patient") p.patient = { abo: opts.patient.abo, rh: opts.patient.rh }; else p[k] = opts[k]; }

    var root = new THREE.Group(), parts = {}, i, j;
    var bench = new THREE.Group(), aggG = new THREE.Group(), rhG = new THREE.Group();
    root.add(bench); root.add(aggG); root.add(rhG);

    /* ---- bench scene ---- */
    var top = new THREE.Mesh(new THREE.BoxGeometry(22, 0.6, 28), std(0xffffff, 0.55, 0.02, { map: noiseTex(256, 256, "#3a4452", 900, 7) })); top.position.set(0, -0.3, 1.0); bench.add(top);
    var tile = buildTile(); tile.position.set(0, 0, TILE_Z); tag(tile, "tile"); bench.add(tile); parts.tile = tile;
    var wellsGroup = tile.userData.wells; parts.wells = wellsGroup;
    var wc = wellsGroup.userData.cells;

    var bottles = [], bx = [-4.6, 0, 4.6], bz = -9.2, bottleDefs = [];
    SERA.forEach(function (s, idx) {
      var b = buildBottle({ R: 1.0, liq: s.bottle, liqOpacity: idx === 2 ? 0.55 : 0.9, cap: s.cap, labelTex: bottleLabel(s.name.toUpperCase(), "rgb(" + s.rgb.join(",") + ")") });
      b.group.position.set(bx[idx], 0, bz); bench.add(b.group);
      b.dropper.position.set(bx[idx], 0.6, bz); bench.add(b.dropper);
      b.rest = new V3(bx[idx], 0.6, bz);
      tag(b.group, s.id); tag(b.dropper, s.id); bottles.push(b); parts[s.id] = b.group;
    });
    // sample tube with its own dropper
    var sampleTex = sampleLabel("Rider");
    var sBot = buildBottle({ R: 0.9, liq: 0xa81426, liqOpacity: 0.95, cap: 0x2a2a2e, labelTex: sampleTex, dropColor: 0xb0182a });
    sBot.group.position.set(7.4, 0, -4.2); bench.add(sBot.group); sBot.dropper.position.set(7.4, 0.6, -4.2); bench.add(sBot.dropper); sBot.rest = new V3(7.4, 0.6, -4.2);
    tag(sBot.group, "sampleTube"); tag(sBot.dropper, "sampleTube"); parts.sampleTube = sBot.group;
    // stirrer pot and three clear stirrers
    var pot = new THREE.Mesh(lathe([[0, 0], [1.3, 0], [1.45, 0.1], [1.5, 3.2], [1.58, 3.3], [1.42, 3.3], [1.34, 3.0], [1.2, 0.25], [0, 0.2]], 28), glass(0xcfe6ee, 0.4, 0.06)); pot.position.set(-7.6, 0, -1.2); bench.add(pot);
    var stirrers = [], stirTints = [0xcfe8f0, 0xcfe8f0, 0xcfe8f0], potLean = [[-0.2, 0.18], [0.0, -0.24], [0.22, 0.12]];
    var stirGroup = new THREE.Group(); bench.add(stirGroup);
    for (i = 0; i < 3; i++) {
      var st = buildStirrer(stirTints[i]); st.userData.restPos = new V3(-7.6 + potLean[i][0] * 1.4, 0.5, -1.2 + potLean[i][1] * 1.4); st.userData.restRot = new V3(potLean[i][1] * 0.35, 0, -potLean[i][0] * 0.45);
      st.position.copy(st.userData.restPos); st.rotation.set(st.userData.restRot.x, 0, st.userData.restRot.z); stirGroup.add(st); stirrers.push(st);
    }
    tag(stirGroup, "stirrer"); parts.stirrer = stirGroup;
    var lancet = buildLancet(); lancet.rotation.z = -Math.PI / 2; lancet.position.set(2.2, 0.42, 10.6); lancet.rotation.y = 0.15; bench.add(lancet); tag(lancet, "lancet"); parts.lancet = lancet;
    var sharps = buildSharps(); sharps.position.set(7.6, 0, 9.2); bench.add(sharps); tag(sharps, "sharpsBin"); parts.sharpsBin = sharps;
    var timer = buildTimer(); timer.position.set(-7.8, 0, -6.6); bench.add(timer); tag(timer, "timer"); parts.timer = timer;
    var labelPlates = [];
    if (p.labels) {
      [["anti-A", bottles[0].group, 6.4], ["anti-B", bottles[1].group, 6.4], ["anti-D", bottles[2].group, 6.4], ["tile", tile, 2.0], ["sharps", sharps, 7.4], ["lancet", lancet, 2.0]].forEach(function (a) {
        var pl = plate(a[0], 3.0, 0.9, { size: 36 }); pl.userData.follow = a[1]; pl.userData.dy = a[2]; pl.renderOrder = 20; pl.material.depthTest = false; bench.add(pl); labelPlates.push(pl);
      });
    }

    /* ---- agglutination scene ---- */
    var panTop = buildAggPanel(5), panBot = buildAggPanel(23);
    panTop.group.position.set(0, 6.3, 0); panBot.group.position.set(0, -6.3, 0); aggG.add(panTop.group); aggG.add(panBot.group);
    parts.agglutination = aggG; parts.antibody = aggG; parts.panelMatch = panTop.group; parts.panelControl = panBot.group;
    /* ---- rhesus scene ---- */
    var rh = buildRhesus(); rhG.add(rh.group); parts.rhesus = rhG; parts.mother = rh.group; parts.baby = rh.group; parts.placenta = rh.mem; parts.syringe = rh.sy;
    parts.bench = bench; parts.view = root;

    /* ---- state ---- */
    var step = clamp(p.step | 0, 0, 5), ph = step, playing = false, playT = 0, clock = 0, hold = 0;
    var active = ORDER.indexOf(p.sample); if (active < 0) active = 0;
    var rowState = [], done = [false, false, false, false, false], doneEmitted = false, finalRows = [];
    function blankRow() { var r = []; for (var c = 0; c < 3; c++) r.push({ col: c, serum: 0, blood: 0, mix: 0, clump: 0, grainy: false }); return r; }
    for (i = 0; i < 5; i++) rowState.push(blankRow());
    var overlayDirty = true, aggPh = 0, aggAuto = 0, aggHold = 0;
    var rhPh = clamp(p.stage, 0, 3), rhStage = Math.round(rhPh), rhPlaying = false, rhPlayT = 0;
    var highlightTarget = null, highlighter = null, pulse = 0;

    function emit(name, detail) { if (typeof api.onEvent === "function") try { api.onEvent(name, detail); } catch (er) {} }
    function curSample() { var s = resolveSample(p); s.index = active; return s; }
    function rockNow() {
      if (p.rock_s != null) return p.rock_s;
      var auto = 120 * clamp(ph - 3, 0, 1);
      return p.errors.earlyRead ? Math.min(auto, 45) : auto;
    }

    function applySampleLabel() {
      var s = curSample(), nm = s.label;
      if (!texCache[nm]) texCache[nm] = sampleLabel(nm);
      sBot.lab.material.map = texCache[nm]; sBot.lab.material.needsUpdate = true;
    }

    /* ---------------------------------------------------------- bench per-frame */
    function seg(base, kIdx, x) { return clamp((x - base) * 3 - kIdx, 0, 1); }   // sub-phase u of well kIdx inside step window starting at 'base'

    function dropperPose(d, u, rest, wx, wz, hoverY, squeezable) {
      var lift = 7.4, a = sstep(0, 0.22, u), b = sstep(0.22, 0.52, u), r1 = sstep(0.8, 0.9, u), r2 = sstep(0.9, 1.0, u);
      var x = lerp(rest.x, wx, b), z = lerp(rest.z, wz, b), y = lerp(rest.y, lift, a);
      y = lerp(y, hoverY, b);
      if (u > 0.8) { x = lerp(wx, rest.x, r1); z = lerp(wz, rest.z, r1); y = lerp(hoverY, lift, r1); y = lerp(y, rest.y, r2); }
      d.dropper.position.set(x, y, z);
      var s = (u - 0.52) / 0.28, hov = u > 0.52 && u < 0.8;
      var sq = hov ? 0.5 + 0.5 * Math.sin(clamp(s, 0, 1) * Math.PI * 3) : 0;
      d.teat.scale.set(1 - 0.14 * sq, 1 - 0.16 * sq, 1 - 0.14 * sq);
      d.drop.visible = hov && s > 0.3;
      if (d.drop.visible) { var f = clamp((s - 0.3) / 0.7, 0, 1); d.drop.position.set(0, -f * f * (hoverY - 0.75), 0); d.drop.scale.setScalar(1 - 0.35 * f * f); }
    }
    function resetDropper(d) { d.dropper.position.copy(d.rest); d.teat.scale.set(1, 1, 1); d.drop.visible = false; }

    function poseStirrers(t) {
      for (var i = 0; i < 3; i++) { var st = stirrers[i]; st.position.copy(st.userData.restPos); st.rotation.set(st.userData.restRot.x, 0, st.userData.restRot.z); }
      var base = 2, reuse = p.errors.reusedStirrer, ur = ph;
      for (var kk = 0; kk < 3; kk++) {
        var st2 = stirrers[reuse ? 0 : kk], u = seg(base, kk, ur);
        if (u <= 0) continue;
        var wx = COLS[kk], wz = rowZ(active) - 0 + 0, from = null, startPos;
        wz = rowZ(active);
        var pot0 = st2.userData.restPos, over = new V3(wx, 0, wz), usedPos = new V3(-8.0, 0.12, 8.4 + (reuse ? 0 : kk) * 0.9);
        var l1 = sstep(0, 0.2, u), l2 = sstep(0.2, 0.45, u), sw = sstep(0.45, 0.75, u), l3 = sstep(0.75, 0.9, u), l4 = sstep(0.9, 1, u);
        var sx, sy, sz, rx = 0, rz = 0;
        var startX = (reuse && kk > 0) ? COLS[kk - 1] : pot0.x, startZ = (reuse && kk > 0) ? wz : pot0.z, startY = (reuse && kk > 0) ? 2.2 : 0.5;
        var lastWell = !reuse || kk === 2;
        sy = lerp(startY, 6.0, l1); sx = startX; sz = startZ;
        sx = lerp(sx, wx, l2); sz = lerp(sz, wz, l2); sy = lerp(sy, TILE_TOP + 0.05, l2);
        var rad = 0.32 * sw; sx += Math.cos(t * 9 + kk) * rad; sz += Math.sin(t * 9 + kk) * rad;
        sy = lerp(sy, 2.2, l3);
        if (lastWell) {
          sx = lerp(sx, usedPos.x, l4); sz = lerp(sz, usedPos.z, l4); sy = lerp(sy, usedPos.y + 0.12, l4);
          rz = lerp(0, -Math.PI / 2, l4);
        }
        if (reuse && !lastWell && u >= 1) { sx = wx; sy = 2.2; sz = wz; }
        st2.position.set(sx, sy, sz);
        var tilt = lerp(lerp(0.12, 0, l2), 0.12, l3);
        st2.rotation.set(rz ? 0 : 0.12 * (1 - l2) + sw * 0.1 * Math.sin(t * 9), 0, rz || -tilt * 0.5);
        if (rz) { st2.rotation.set(0, 0, rz); }
      }
    }

    function poseLancet() {
      var u = sstep(1.0, 1.55, ph), rest = new V3(2.2, 0.42, 10.6);
      var sx = 7.6, sz = 9.2, slotY = sharps.userData.slotY;
      var a = sstep(0, 0.35, u), b = sstep(0.35, 0.75, u), c = sstep(0.75, 1, u);
      var x = lerp(rest.x, sx, b), z = lerp(rest.z, sz, b), y = lerp(rest.y, slotY + 3.4, a); y = lerp(y, slotY + 3.4, b); y = lerp(y, slotY - 2.6, c);
      lancet.position.set(x, y, z);
      var ang = lerp(-Math.PI / 2, Math.PI, a);
      lancet.rotation.set(0, lerp(0.15, 0, b), ang);
    }

    function rowFor(rowIdx) { return rowState[rowIdx]; }

    function benchStep(dt, t) {
      var target = step;
      if (ph < target) ph = Math.min(target, ph + dt * 0.8); else if (ph > target) ph = Math.max(target, ph - dt * 2.4);
      if (playing) { playT += dt; if (playT > 2.1 && Math.abs(ph - step) < 0.01) { playT = 0; if (step < 5) setStep(step + 1); else playing = false; } }
      var rk = rockNow(), ty = typing(curSample(), p.errors, rk), kIdx;
      // derive active-row well states from the phase
      if (!done[active] || ph < 5 - 1e-6 || step < 5) {
        var rs = rowState[active];
        for (kIdx = 0; kIdx < 3; kIdx++) {
          var w = rs[kIdx], a0 = kIdx / 3, a1 = (kIdx + 1) / 3 - 0.02;
          w.serum = sstep(a0, a1, clamp(ph, 0, 1)); w.blood = sstep(a0, a1, clamp(ph - 1, 0, 1)); w.mix = sstep(a0, a1, clamp(ph - 2, 0, 1));
          w.clump = ty.wells[kIdx].amount * w.mix; w.grainy = ty.wells[kIdx].grainy;
        }
      }
      if (step === 5 && ph >= 5 - 1e-6 && !done[active]) {
        done[active] = true; overlayDirty = true;
        finalRows[active] = ty;
        var rd = reading(); emit("sample", rd);
        if (done.every(Boolean) && !doneEmitted) { doneEmitted = true; emit("done", reading()); }
      }
      if (step < 5 && done[active] && ph < 4.9) { done[active] = false; doneEmitted = false; overlayDirty = true; }
      // redraw changed wells
      for (var r = 0; r < 5; r++) for (var c = 0; c < 3; c++) {
        var S = rowState[r][c], cell = wc[r * 3 + c], key = [Math.round(S.serum * 10), Math.round(S.blood * 10), Math.round(S.mix * 12), Math.round(S.clump * 10), S.grainy ? 1 : 0].join("|");
        if (key !== cell.key) { cell.key = key; drawWell(cell.cv, { col: c, serum: S.serum, blood: S.blood, mix: S.mix, clump: S.clump, grainy: S.grainy }, 100 + r * 7 + c * 3); cell.tex.needsUpdate = true; }
      }
      if (overlayDirty) { drawTileOverlay(tile, active, done, p.labels); overlayDirty = false; }
      drawTimer(timer, rk);
      // droppers
      for (var b = 0; b < 3; b++) {
        var u = seg(0, b, ph), bb = bottles[b];
        if (u > 0 && u < 1 && ph <= 1.0001) dropperPose(bb, u, bb.rest, COLS[b], rowZ(active), TILE_TOP + 2.9);
        else resetDropper(bb);
      }
      var us = 0, ub = 0;
      for (var s2 = 0; s2 < 3; s2++) { var uu = seg(1, s2, ph); if (uu > 0 && uu < 1 && ph > 1 && ph < 2.0001) { dropperPose(sBot, uu, sBot.rest, COLS[s2], rowZ(active), TILE_TOP + 2.9); ub = 1; } }
      if (!ub) resetDropper(sBot);
      poseStirrers(t); poseLancet();
      // rocking in step 4
      var rockAmt = sstep(3, 3.2, ph) * (1 - sstep(3.9, 4, ph));
      tile.rotation.z = Math.sin(t * 7) * 0.035 * rockAmt; tile.rotation.x = Math.cos(t * 5.5) * 0.02 * rockAmt;
      labelPlates.forEach(function (pl) { var o = pl.userData.follow; o.getWorldPosition(_v); pl.position.set(_v.x, _v.y + pl.userData.dy, _v.z); });
    }

    /* ---------------------------------------------------------- agglutination per-frame */
    function aggConfig() {
      var m = aggModel(p.donor, p.donorRh, p.serum), s1 = SERA.filter(function (s) { return s.name === m.serum; })[0] || SERA[1];
      var cs = SERA.filter(function (s) { return s.name === m.controlSerum; })[0] || SERA[0];
      panTop.set(m.antigens, m.serum.replace("anti-", "").toUpperCase(), m.clump, s1.rgb, p.donor + " cells + " + m.serum);
      panBot.set(m.antigens, m.controlSerum.replace("anti-", "").toUpperCase(), m.controlClump, cs.rgb, p.donor + " cells + " + m.controlSerum);
      aggModelCur = m;
    }
    var aggModelCur = null;
    function aggStep(dt, t) {
      var c;
      if (p.agg != null) c = clamp(p.agg, 0, 1);
      else { aggAuto += dt; var cyc = aggAuto % 11; c = sstep(1.0, 6.5, cyc) * (cyc < 9.5 ? 1 : 1 - sstep(9.5, 11, cyc)); }
      aggPh = c;
      panTop.update(aggModelCur.clump ? c : 0, t);
      panBot.update(aggModelCur.controlClump ? c : 0, t);
    }

    /* ---------------------------------------------------------- rhesus per-frame */
    function rhStep(dt, t) {
      if (rhPlaying) { rhPlayT += dt; if (rhPlayT > 2.6 && Math.abs(rhPh - p.stage) < 0.02) { rhPlayT = 0; if (p.stage < 3) { p.stage++; emit("stage", rhesusReading()); } else rhPlaying = false; } }
      if (rhPh < p.stage) rhPh = Math.min(p.stage, rhPh + dt * 0.5); else if (rhPh > p.stage) rhPh = Math.max(p.stage, rhPh - dt * 1.5);
      var S = rh, cf = S.cf, ph = rhPh, i, c, prevent = p.prevent, wob = function (k, a) { return Math.sin(t * 0.8 + S.seedFloat[k]) * a; };
      var leak = sstep(0.0, 1.0, ph), resp = clamp(ph - 1, 0, 1), atk = clamp(ph - 2, 0, 1);
      // mother cells 0..8
      for (i = 0; i < 9; i++) { c = cf.cell[i]; c.pos.set(S.mHome[i].x + wob(i, 0.35), S.mHome[i].y + Math.cos(t * 0.7 + S.seedFloat[i]) * 0.3, 0.1); c.s = 1; c.col.setRGB(0.85, 0.2, 0.25); }
      // baby cells 9..16: 0..3 of them leak at birth, are cleared in response, and come back as the new pregnancy's cells
      var leakIdx = [0, 1, 2, 3];
      for (i = 0; i < 8; i++) {
        c = cf.cell[9 + i]; var home = S.bHome[i], x = home.x + wob(9 + i, 0.35), y = home.y + Math.cos(t * 0.7 + S.seedFloat[9 + i]) * 0.3, sc = 1;
        c.col.setRGB(0.85, 0.2, 0.25);
        if (i < 4) {
          var a = sstep(0.0, 1.0, ph) * (1 - sstep(1.0, 1.0, ph)), L = S.leakTarget[i], G = new V3(0, -4.5, 0.1);
          if (ph < 1) { if (a < 0.5) { var f1 = sstep(0.1, 0.5, a); x = lerp(x, G.x, f1); y = lerp(y, G.y + (i - 1.5) * 0.4, f1); } else { var f2 = sstep(0.5, 0.95, a); x = lerp(G.x, L.x, f2); y = lerp(G.y + (i - 1.5) * 0.4, L.y, f2); } }
          else { x = L.x + Math.sin(t * 0.8 + i) * 0.2; y = L.y + Math.cos(t * 0.7 + i) * 0.2; }
          if (ph >= 1 && ph < 2) { sc = 1 - sstep(0.62, 0.95, resp) * 0.999; var darken = sstep(0.4, 0.8, resp); c.col.setRGB(lerp(0.85, 0.35, darken), lerp(0.2, 0.28, darken), lerp(0.25, 0.3, darken)); }
          if (ph >= 2) { // new pregnancy: fresh Rh+ cells arrive in the baby zone
            x = home.x + wob(9 + i, 0.35); y = home.y + Math.cos(t * 0.7 + S.seedFloat[9 + i]) * 0.3; sc = sstep(0.0, 0.2, atk);
          }
        }
        if (ph >= 2) {   // attack in pregnancy 2
          var hit = (!prevent) ? sstep(0.62, 0.98, atk) : 0;
          x = lerp(x, S.bClump[i].x, hit * 0.85); y = lerp(y, S.bClump[i].y, hit * 0.85);
          c.col.setRGB(lerp(0.85, 0.34, hit), lerp(0.2, 0.26, hit), lerp(0.25, 0.28, hit)); sc *= (1 - 0.18 * hit);
          if (hit > 0.05) { x += Math.sin(t * 18 + i) * 0.04 * hit; }
        }
        c.pos.set(x, y, 0.1); c.s = sc;
      }
      cf.commit(t);
      // plasma cell
      S.pc.scale.setScalar(Math.max(1e-4, !prevent ? sstep(1.05, 1.4, ph) : 0));
      // syringe
      var sy = S.sy, inj = prevent && ph > 1 && ph < 2;
      sy.visible = inj;
      if (inj) {
        var s1 = sstep(0.0, 0.3, resp), s2 = sstep(0.3, 0.6, resp), s3 = sstep(0.75, 1.0, resp);
        var tipx = lerp(-10.5, -7.0, s1) + s3 * -4, tipy = lerp(1.5, -1.8, s1) + s3 * 3.5;
        sy.position.set(tipx, tipy + 1.8 * 0.85, 0.35); sy.rotation.set(0, 0, 0.65); sy.scale.setScalar(0.85);
        S.plunger.position.y = -2.4 * s2; S.dose.scale.y = Math.max(0.02, 1 - s2);
      }
      // Y antibodies (10): colour = anti-D
      var yf = S.yf, ys = yf.y, ycol = new THREE.Color(AG_COL.D), pcPos = S.pc.position, G2 = new V3(0, -4.5, 0.2);
      for (i = 0; i < 10; i++) {
        var y = ys[i]; y.col.copy(ycol); var sc2 = 0, px = 0, py = 0, rot = y.rot + t * y.spin * 0.3;
        var leakSlot = S.leakTarget[i % 4], off = [[0.95, 0.55], [-0.95, -0.55]][i < 4 ? 0 : 1];
        var fl = new V3(S.leakTarget[i % 4].x - 1.2 + (i % 3) * 0.6, S.leakTarget[i % 4].y + 1.4 - (i % 2) * 2.4, 0.3);
        var babySlot = new V3(S.bClump[i % 8].x + (i < 8 ? 0.0 : 0), S.bClump[i % 8].y + 0.85, 0.3);
        if (i >= 8) { babySlot.set(S.bClump[(i - 8) * 3].x + 0.9, S.bClump[(i - 8) * 3].y - 0.5, 0.3); }
        if (!prevent) {
          if (ph > 1) {
            var born = sstep(0.05 + i * 0.015, 0.25 + i * 0.015, resp);
            var travel = sstep(0.25 + i * 0.015, 0.8, resp);
            sc2 = born * 0.7;
            px = lerp(pcPos.x, fl.x, travel); py = lerp(pcPos.y, fl.y, travel);
            if (ph > 2) {   // anti-D crosses the placenta in pregnancy 2
              var cr = sstep(0.18 + i * 0.01, 0.7, atk);
              if (cr < 0.5) { var q1 = cr * 2; px = lerp(fl.x, G2.x, q1); py = lerp(fl.y, G2.y + (i % 5 - 2) * 0.35, q1); }
              else { var q2 = (cr - 0.5) * 2; px = lerp(G2.x, babySlot.x, q2); py = lerp(G2.y + (i % 5 - 2) * 0.35, babySlot.y, q2); }
              if (cr > 0.9) rot = Math.atan2(0.4, 1) + i;
            }
            px += Math.sin(t * 0.9 + i) * 0.12 * (1 - sstep(0.8, 1, resp)); py += Math.cos(t * 0.8 + i) * 0.12;
          }
        } else if (ph > 1 && ph < 2) {   // injected anti-D: reaches leaked cells, clears them, then is gone
          var inj0 = sstep(0.22 + i * 0.02, 0.5, resp), fade = 1 - sstep(0.7, 0.96, resp);
          sc2 = inj0 * 0.7 * fade; var sx0 = -7.4, sy0 = -1.6;
          var tgt = new V3(S.leakTarget[i % 4].x + (i < 4 ? 0.95 : -0.95), S.leakTarget[i % 4].y + (i < 4 ? 0.5 : -0.5), 0.3);
          var tr = sstep(0.32 + i * 0.02, 0.62, resp); px = lerp(sx0, tgt.x, tr); py = lerp(sy0, tgt.y, tr);
        }
        y.pos.set(px, py, 0.4); y.quat.setFromAxisAngle(_z, rot); y.s = sc2;
      }
      yf.commit();
      // placenta membrane tears at birth then is a new one in the next pregnancy
      var tear = sstep(0.1, 0.5, ph) * (1 - sstep(1.0, 1.3, ph));
      S.mem.scale.set(1 - tear * 0.6, lerp(1, 0.5, tear), 1); S.mem.rotation.z = tear * 0.5; S.mem.material.opacity = lerp(0.85, 0.5, tear);
    }

    /* ---------------------------------------------------------- readings */
    function benchReading() {
      var s = curSample(), rk = rockNow(), ty = typing(s, p.errors, rk), pat = p.patient, cp = compat(pat, { abo: s.abo, rh: s.rh });
      var prog = done[active] ? 5 : step;
      var rd = step >= 5 || done[active], nul = function (v) { return rd ? v : null; };
      return { view: "bench", sample: p.sample, label: s.label, A: nul(ty.A), B: nul(ty.B), D: nul(ty.D), group: nul(ty.group), abo: nul(ty.abo), rh: nul(ty.rh), pattern: nul(ty.pattern),
        truth: ty.truth, correct: rd ? ty.correct : null, faults: rd ? ty.faults : [], wells: ty.wells.map(function (w) { return { serum: w.serum, name: w.name, clump: w.positive, amount: +w.amount.toFixed(2), truth: w.truth }; }),
        rock_s: Math.round(rk), step: step, read: rd,
        safeForPatient: cp.safe, safeForRider: cp.safe, aboOK: cp.aboOK, rhOK: cp.rhOK, safeReason: cp.reason,
        samplesDone: done.filter(Boolean).length, done: done.slice(), patient: group(p.patient) };
    }
    function group(pt) { return groupName(pt.abo, pt.rh); }
    function aggReading() {
      var m = aggModelCur || aggModel(p.donor, p.donorRh, p.serum);
      return { view: "agglutination", donor: p.donor, donorRh: p.donorRh, serum: m.serum, antigens: m.antigens, clump: m.clump, bridged: +(m.clump ? aggPh : 0).toFixed(2),
        controlSerum: m.controlSerum, controlClump: m.controlClump, reason: m.reason };
    }
    function rhesusReading() { var m = rhModel(p.stage, p.prevent); m.view = "rhesus"; m.prevent = !!p.prevent; return m; }
    function reading() { return p.view === "agglutination" ? aggReading() : p.view === "rhesus" ? rhesusReading() : benchReading(); }

    /* ---------------------------------------------------------- control */
    function setStep(n, silent) {
      n = clamp(Math.round(n), 0, 5);
      var changed = n !== step; step = n; p.step = n;
      if (changed && !silent) emit("step", { step: n, reading: benchReading() });
      return changed;
    }
    function setView(v) {
      p.view = v; bench.visible = v === "bench"; aggG.visible = v === "agglutination"; rhG.visible = v === "rhesus";
      if (v === "agglutination") aggConfig();
      emit("view", { view: v });
    }
    function resetActive() { rowState[active] = blankRow(); done[active] = false; doneEmitted = false; ph = 0; step = 0; p.step = 0; playing = false; overlayDirty = true; wc.forEach(function (c) { c.key = ""; }); }

    var api = root;
    api.parts = parts; root.userData.parts = parts; root.group = root; root.isKit = true;
    api.params = p;
    api.reading = reading;
    api.model = typing;
    api.setStep = function (n) { setStep(n); };
    api.nextStep = function () {
      if (p.view === "rhesus") { p.stage = p.stage >= 3 ? 0 : p.stage + 1; emit("stage", rhesusReading()); return; }
      setStep(step >= 5 ? 0 : step + 1);
    };
    api.maxStep = 5;
    api.play = function () { if (p.view === "rhesus") { rhPlaying = true; rhPlayT = 0; if (p.stage >= 3) p.stage = 0; } else { playing = true; playT = 0; if (step >= 5) setStep(0); } };
    api.pause = function () { playing = false; rhPlaying = false; };
    api.isPlaying = function () { return playing || rhPlaying; };
    api.reset = function () { playing = false; rhPlaying = false; if (p.view === "rhesus") { p.stage = 0; rhPh = 0; } else { resetActive(); } };
    api.fillAll = function () {   // run all five samples at once (demo, tests): marks every row complete
      var keep = p.sample;
      ORDER.forEach(function (key, idx) {
        var sp = resolveSample({ sample: key }), ty = typing(sp, p.errors, 120);
        rowState[idx] = [0, 1, 2].map(function (c) { return { col: c, serum: 1, blood: 1, mix: 1, clump: ty.wells[c].amount, grainy: ty.wells[c].grainy }; });
        done[idx] = true;
      });
      overlayDirty = true; active = ORDER.indexOf(keep); if (active < 0) active = 0; ph = 5; step = 5; p.step = 5;
    };
    api.setState = function (o) {
      o = o || {}; var changedSample = false;
      if (o.errors) for (var e in o.errors) p.errors[e] = !!o.errors[e];
      if (o.patient) p.patient = { abo: o.patient.abo, rh: o.patient.rh };
      ["sample", "abo", "rh"].forEach(function (k) { if (o[k] !== undefined && o[k] !== p[k]) { p[k] = o[k]; changedSample = true; } });
      if (changedSample || o.errors) {
        if (o.sample !== undefined && ORDER.indexOf(o.sample) >= 0) active = ORDER.indexOf(o.sample);
        resetActive(); applySampleLabel();
      }
      if (o.rock_s !== undefined) p.rock_s = o.rock_s;
      if (o.step !== undefined) { setStep(o.step); if (o.settle !== false && o.immediate) ph = step; }
      ["donor", "donorRh", "serum"].forEach(function (k) { if (o[k] !== undefined) { p[k] = o[k]; if (p.view === "agglutination") aggConfig(); } });
      if (o.agg !== undefined) p.agg = o.agg;
      if (o.prevent !== undefined) p.prevent = !!o.prevent;
      if (o.stage !== undefined) { p.stage = clamp(o.stage | 0, 0, 3); emit("stage", rhesusReading()); }
      if (o.view !== undefined && o.view !== p.view) setView(o.view);
      emit("state", reading());
    };
    root.setState = api.setState;

    function ensureHighlighter(scene) {
      if (highlighter) return highlighter;
      if (global.HeartKit && global.HeartKit.makeHighlighter && global.SceneKit && global.SceneKit.glowSprite) highlighter = global.HeartKit.makeHighlighter(scene);
      else {
        var cvx = document.createElement("canvas"); cvx.width = cvx.height = 64; var gx = cvx.getContext("2d"), gr = gx.createRadialGradient(32, 32, 2, 32, 32, 31);
        gr.addColorStop(0, "rgba(255,190,70,.95)"); gr.addColorStop(1, "rgba(255,190,70,0)"); gx.fillStyle = gr; gx.fillRect(0, 0, 64, 64);
        var glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(cvx), transparent: true, depthTest: false, depthWrite: false, opacity: 0 })); glow.renderOrder = 9; scene.add(glow);
        var cur = null, box = new THREE.Box3(), size = new V3();
        highlighter = { set: function (o) { cur = o || null; }, update: function (dt, t) {
          if (cur) { box.setFromObject(cur); box.getCenter(glow.position); box.getSize(size); glow.scale.setScalar(Math.max(0.8, Math.max(size.x, size.y, size.z) * 1.5)); }
          glow.material.opacity += ((cur ? 0.5 + 0.2 * Math.sin(t * 5) : 0) - glow.material.opacity) * Math.min(1, dt * 6);
        } };
      }
      return highlighter;
    }
    api.attachHighlighter = function (scene) { return ensureHighlighter(scene); };
    api.highlight = function (id) {
      highlightTarget = id ? (parts[id] || null) : null;
      if (highlighter) highlighter.set(highlightTarget);
    };

    var seen = false;
    api.update = function (dt, t) {
      dt = Math.min(dt || 0.016, 0.1); clock += dt; t = t == null ? clock : t;
      if (p.view === "bench") benchStep(dt, t); else if (p.view === "agglutination") aggStep(dt, t); else rhStep(dt, t);
      if (highlighter) highlighter.update(dt, t);
      if (highlightTarget && !highlighter) { pulse += dt; var sc = 1 + 0.02 * Math.sin(pulse * 8); highlightTarget.scale.setScalar(sc); }
    };
    api.settle = function (sec) { var n = Math.ceil((sec || 4) / 0.05); for (var i = 0; i < n; i++) api.update(0.05); };
    api.tick = api.update; root.userData.update = api.update; root.userData.setState = api.setState;
    api.dispose = function () { root.traverse(function (o) { if (o.geometry) o.geometry.dispose(); }); };

    // initial state
    applySampleLabel(); aggConfig(); setView(p.view);
    api.update(0.016, 0);
    return root;
  }

  /* ---------------------------------------------------------- scene helpers */
  function lights(scene) {
    scene.add(new THREE.HemisphereLight(0xdfe9ff, 0x3a2a1a, 0.75));
    var key = new THREE.DirectionalLight(0xffffff, 1.35); key.position.set(-8, 22, 12); scene.add(key);
    var rim = new THREE.DirectionalLight(0xbfd8ff, 0.5); rim.position.set(10, 12, -14); scene.add(rim);
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
  function fit(camera, controls, aspect, view) {
    var vf = camera.fov * Math.PI / 180, halfW, halfH, tgt, pitch;
    if (view === "agglutination") { halfW = 10.2; halfH = 13.8; tgt = new V3(0, 0.2, 0); pitch = 0.08; }
    else if (view === "rhesus") { halfW = 10.6; halfH = 14.0; tgt = new V3(0, 2.2, 0); pitch = 0.06; }
    else { halfW = 11.8; halfH = 13.6; tgt = new V3(0, 0.5, 1.2); pitch = aspect < 0.8 ? 0.9 : 0.8; }
    var dW = halfW / (Math.tan(vf / 2) * Math.max(0.3, aspect)), dH = halfH / Math.tan(vf / 2);
    var dist = Math.max(dW, dH * (view === "bench" || !view ? 0.8 : 1));
    camera.position.set(0, tgt.y + Math.sin(pitch) * dist, tgt.z + Math.cos(pitch) * dist);
    camera.lookAt(tgt); if (controls) { controls.target.copy(tgt); controls.update(); }
    camera.aspect = aspect; camera.updateProjectionMatrix();
  }

  global.AboTypingBench = { version: 1, create: create, lights: lights, environment: environment, fit: fit, model: typing, compat: compat, bags: bags, aggModel: aggModel, rhModel: rhModel,
    SAMPLES: SAMPLES, ORDER: ORDER, BAGS: BAGS, SERA: SERA, DEFAULTS: DEFAULTS };
  global.StudyPipeKits = global.StudyPipeKits || {};

  /* ---------------------------------------------------------- mountable kit (StudyPipeKits convention, used by demo.html) */
  global.StudyPipeKits["abo-typing-bench"] = {
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
      var controls = new THREE.OrbitControls(camera, canvas); controls.enablePan = false; controls.enableDamping = true; controls.minDistance = 14; controls.maxDistance = 110; controls.maxPolarAngle = Math.PI * 0.62;
      var kit = create(p); scene.add(kit);
      function refit() { var w = stageBox.clientWidth || 360, h = stageBox.clientHeight || 400; renderer.setSize(w, h, false); fit(camera, controls, w / h, kit.params.view); }
      kit.onEvent = function (n, d) { host.emit(n, d); if (n === "view") refit(); refresh(); };
      window.__kit = kit; window.__cam = camera; window.__controls = controls;

      function btn(label, fn) { var b = document.createElement("button"); b.textContent = label; b.style.cssText = "min-height:44px;padding:0 10px;border-radius:22px;border:0;background:#1f5e8c;color:#fff;font:600 12px system-ui;cursor:pointer"; b.addEventListener("click", function () { fn(b); refresh(); }); row.appendChild(b); return b; }
      var ord = AboTypingBench.ORDER, serums = ["anti-A", "anti-B", "anti-D"], donors = ["B", "A", "AB", "O"];
      btn("Bench / Y zoom / Rh", function () { var v = kit.params.view; kit.setState({ view: v === "bench" ? "agglutination" : v === "agglutination" ? "rhesus" : "bench" }); });
      btn("Next step", function () { kit.pause(); kit.nextStep(); });
      var autoB = btn("Auto", function (b) { if (kit.isPlaying()) { kit.pause(); b.textContent = "Auto"; } else { kit.play(); b.textContent = "Pause"; } });
      btn("Reset", function () { kit.reset(); autoB.textContent = "Auto"; });
      btn("Sample", function () { var i = (ord.indexOf(kit.params.sample) + 1) % 5; kit.setState({ sample: ord[i] }); });
      btn("Fill all", function () { kit.fillAll(); });
      btn("Early read", function () { kit.setState({ errors: { earlyRead: !kit.params.errors.earlyRead } }); });
      btn("One stirrer", function () { kit.setState({ errors: { reusedStirrer: !kit.params.errors.reusedStirrer } }); });
      btn("Dry edge", function () { kit.setState({ errors: { dryingEdge: !kit.params.errors.dryingEdge } }); });
      btn("Donor / serum", function () { var d = donors[(donors.indexOf(kit.params.donor) + 1) % 4]; kit.setState({ donor: d, serum: serums[(serums.indexOf(kit.params.serum) + 1) % 3] }); });
      btn("Anti-D shot", function () { kit.setState({ prevent: !kit.params.prevent }); });

      function refresh() {
        var r = kit.reading(), s;
        if (r.view === "bench") s = r.label + " | A " + r.A + " B " + r.B + " D " + r.D + " | " + r.pattern + " | group " + r.group + (r.correct ? "" : "  (WRONG, truth " + r.truth.group + ")") + "\nstep " + r.step + "/5 | " + r.rock_s + " s | safe for patient " + r.patient + ": " + r.safeForPatient + " | faults " + (r.faults.join(",") || "none") + " | done " + r.samplesDone + "/5";
        else if (r.view === "agglutination") s = r.donor + " cells in " + r.serum + ": " + (r.clump ? "CLUMP" : "free") + " (bridged " + r.bridged + ")\ncontrol " + r.controlSerum + ": " + (r.controlClump ? "clump" : "free") + "\n" + r.reason;
        else s = "stage " + r.stage + " | " + (r.prevent ? "with anti-D injection" : "no injection") + "\n" + r.caption;
        readout.textContent = s;
      }
      window.addEventListener("resize", refit); refit(); refresh();
      var last = performance.now(), nrf = 0;
      (function loop(now) { var dt = Math.min(0.05, (now - last) / 1000); last = now; kit.update(dt, now / 1000); controls.update(); renderer.render(scene, camera); if (++nrf % 20 === 0) refresh(); requestAnimationFrame(loop); })(last);
      return kit;
    }
  };
})(window);
