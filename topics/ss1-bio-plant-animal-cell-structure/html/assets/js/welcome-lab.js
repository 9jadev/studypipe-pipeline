/* ==========================================================
   StudyPipe — Welcome Hub 3D Hero Lab · Plant and Animal Cells
   Built from the catalog kit `cell-bio` (assets/js/cell-kit.js, window.CellKit).
   Three modes:
     cells       plant cell beside animal cell; tap an organelle → name, membranes, job
     microscope  compound microscope; ×4 / ×10 / ×40 objective → total M and the eyepiece view
     osmosis     ugu leaf cell + red blood cell in pure water / 0.9% saline / salty water
   Exposes window.StudyLab for StudyNarrator:
     rect(part) · highlight(part) · setMode(m) · select(key) · objective(i) · solution(s) · state() · reset()
   Emits CustomEvent "lab:result" with { mode, ... } after every learner action.
   Classic script, no modules, fully offline.
   ========================================================== */
(function () {
  "use strict";

  var canvas = document.getElementById("lab-canvas");
  var labRoot = document.getElementById("lab");
  if (!canvas || !labRoot) return;

  var $ = function (id) { return document.getElementById(id); };
  var ui = {
    k1: $("hud-k1"), v1: $("hud-v1"), k2: $("hud-k2"), v2: $("hud-v2"), k3: $("hud-k3"), v3: $("hud-v3"),
    info: $("lab-info"), toast: $("endpoint-toast"), legend: $("lab-legend"),
    fov: $("lab-fov"), fovCap: $("lab-fov-cap"), fallback: $("lab-fallback")
  };
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function emit(detail) { document.dispatchEvent(new CustomEvent("lab:result", { detail: detail })); }
  function setHud(k1, v1, k2, v2, k3, v3) {
    ui.k1.textContent = k1; ui.v1.textContent = v1;
    ui.k2.textContent = k2; ui.v2.textContent = v2;
    ui.k3.textContent = k3; ui.v3.textContent = v3;
  }
  var toastTimer = null;
  function toast(html) {
    if (!ui.toast) return;
    ui.toast.innerHTML = html;
    ui.toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { ui.toast.classList.remove("show"); }, 4200);
  }

  /* ---------------- facts shown in the HUD (from 02-lesson.md, Lesson 02 Make Sense) ---------------- */
  var INFO = {
    wall:          { name: "Cell wall", ms: "It is not a membrane at all: it is cellulose", mem: "None (not a membrane)", where: "Plant only", job: "A stiff case of cellulose. It lets almost anything through and holds the plant cell's shape." },
    membrane:      { name: "Cell membrane", ms: "It is itself one membrane", mem: "It is one membrane", where: "Plant and animal", job: "A thin living skin of lipid and protein. It is selectively permeable: it chooses what enters and leaves." },
    nucleus:       { name: "Nucleus", ms: "It has two membranes, with pores", mem: "2 (with pores)", where: "Plant and animal", job: "Directs the cell and carries its inherited instructions. The dark nucleolus sits inside it." },
    chloroplast:   { name: "Chloroplast", ms: "It has two membranes", mem: "2", where: "Green plant cells only", job: "Stacks of grana hold chlorophyll, which traps light to make food." },
    mitochondrion: { name: "Mitochondrion", ms: "It has two membranes, and the inner one is folded", mem: "2 (inner one folded)", where: "Plant and animal", job: "The power station: releases energy (ATP) in aerobic respiration." },
    er:            { name: "Rough ER", ms: "It has one membrane", mem: "1", where: "Plant and animal", job: "Endoplasmic reticulum: a network of membrane channels that carries materials. Ribosomes stud the rough kind." },
    golgi:         { name: "Golgi body", ms: "It has one membrane", mem: "1", where: "Plant and animal", job: "A pile of flat pouches that sorts, packs and sends out the cell's products, and buds off lysosomes." },
    ribosome:      { name: "Ribosomes", ms: "It has no membrane at all", mem: "None", where: "All cells, even bacteria", job: "Tiny grains that build proteins. Too small for any light microscope to show." },
    vacuole:       { name: "Sap vacuole", ms: "It has one membrane, the tonoplast", mem: "1 (the tonoplast)", where: "Plant: one large, central", job: "A big store of cell sap that keeps the plant cell firm." },
    vacuoleA:      { name: "Small vacuole", ms: "It has one membrane", mem: "1", where: "Animal: small, short-lived", job: "A small temporary store. Animal cells have no large sap vacuole." },
    lysosome:      { name: "Lysosome", ms: "It has one membrane", mem: "1", where: "Mainly animal cells", job: "A bag of digestive enzymes that breaks down worn-out parts." },
    centrioles:    { name: "Centrioles", ms: "They have no membrane", mem: "None", where: "Animal (not flowering plants)", job: "Two tiny hollow rods that build the spindle when an animal cell divides." },
    glycogen:      { name: "Glycogen granules", ms: "They have no membrane", mem: "None", where: "Animal only", job: "Stored food in animal cells. Plant cells store starch instead." }
  };
  var OBJ = [
    { obj: 4, M: 40, field: 4.0, n: 80 },
    { obj: 10, M: 100, field: 1.6, n: 32 },
    { obj: 40, M: 400, field: 0.40, n: 8 }
  ];
  var SOL = {
    water:  { name: "Pure water", tone: "hypotonic", plant: 1, rbc: 1,
              plantTxt: "Turgid: the wall stops it bursting", rbcTxt: "Swells and bursts (haemolysis)",
              info: "Pure water is more dilute than the cell contents, so water enters both cells by osmosis. The ugu cell swells until its <b>cellulose wall</b> pushes back: it becomes turgid and crisp. The red cell has no wall, so it swells and <b>bursts</b>. That is why Dr Amaka never drips plain water into a vein." },
    saline: { name: "0.9% saline", tone: "isotonic", plant: 0, rbc: 0,
              plantTxt: "Flaccid: no net water movement", rbcTxt: "Normal biconcave shape",
              info: "0.9% saline has the same concentration as the inside of a red cell, so water enters and leaves at the same rate. The red cell keeps its normal shape. This is why a drip must be <b>isotonic</b> 0.9% saline." },
    salt:   { name: "Salty water", tone: "hypertonic", plant: -1, rbc: -1,
              plantTxt: "Plasmolysed: membrane pulls off the wall", rbcTxt: "Shrinks and crenates",
              info: "Salty water is more concentrated than the cell sap, so <b>water leaves</b> by osmosis. The ugu cell's membrane pulls away from the wall (plasmolysis) and the leaf wilts. The salt did not soak in: the leaf lost water. The red cell shrinks and wrinkles (crenation)." }
  };

  var state = { mode: "cells", objective: 0, solution: "saline", picked: null, picks: {} };

  /* ---------------- UI wiring (works even without WebGL) ---------------- */
  var modeTabs = labRoot.querySelectorAll(".lab-modes [data-mode]");
  var ctrls = labRoot.querySelectorAll(".lab-ctrl");
  modeTabs.forEach(function (b) { b.addEventListener("click", function () { setMode(b.getAttribute("data-mode"), true); }); });
  labRoot.querySelectorAll("[data-pick]").forEach(function (b) { b.addEventListener("click", function () { select(b.getAttribute("data-pick"), true); }); });
  labRoot.querySelectorAll("[data-objective]").forEach(function (b) { b.addEventListener("click", function () { setObjective(+b.getAttribute("data-objective"), true); }); });
  labRoot.querySelectorAll("[data-solution]").forEach(function (b) { b.addEventListener("click", function () { setSolution(b.getAttribute("data-solution"), true); }); });

  /* ---------------- 3D setup ---------------- */
  var gl = typeof THREE !== "undefined" && window.CellKit && window.SceneKit && SceneKit.hasWebGL();
  var renderer, scene, camera, groups = {}, parts = {}, partMode = {}, hiNarr, hiPick, pickLabel, tick = [];
  var view = { yaw: 0.0, pitch: 0.26, dist: 8, target: null, lastTouch: -1e9 };
  var visible = true;

  if (gl) {
    try { build3D(); } catch (err) { gl = false; if (window.console) console.warn("StudyLab: 3D disabled", err); }
  }
  if (!gl && ui.fallback) { ui.fallback.hidden = false; canvas.style.visibility = "hidden"; }

  function build3D() {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    if ("outputColorSpace" in renderer && THREE.SRGBColorSpace) renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    canvas.style.touchAction = "pan-y";

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(34, 1.6, 0.1, 100);
    view.target = new THREE.Vector3();
    scene.add(new THREE.HemisphereLight(0xdfeaff, 0x1a1424, 0.85));
    var key = new THREE.DirectionalLight(0xfff4e2, 1.25); key.position.set(3, 6, 5); scene.add(key);
    var rim = new THREE.DirectionalLight(0x7cc4ff, 0.7); rim.position.set(-4, 3, -4); scene.add(rim);
    var fill = new THREE.PointLight(0xffd8b0, 0.6, 20); fill.position.set(0, 1.5, 4); scene.add(fill);

    /* ---- mode 1: cells ---- */
    var g1 = new THREE.Group(); groups.cells = g1; scene.add(g1);
    var plant = CellKit.plantCell({ w: 2.2, h: 1.45, d: 1.25, chloroplasts: 12, tonicity: 1 });
    plant.position.set(-1.45, 0, 0); plant.rotation.set(0.22, 0.42, 0);
    var animal = CellKit.animalCell({ r: 0.95, seed: 9 });
    animal.position.set(1.5, 0, 0); animal.rotation.set(0.25, -0.3, 0);
    g1.add(plant, animal);
    tagParts(plant, "plant", { cellWall: "wall", membrane: "membrane", vacuole: "vacuole", nucleus: "nucleus", chloroplast: "chloroplast", mitochondrion: "mitochondrion", er: "er", golgi: "golgi", ribosome: "ribosome" });
    tagParts(animal, "animal", { membrane: "membrane", vacuole: "vacuoleA", nucleus: "nucleus", mitochondrion: "mitochondrion", centrioles: "centrioles", lysosome: "lysosome", golgi: "golgi", er: "er", glycogen: "glycogen", ribosome: "ribosome" });
    addLabel(g1, "Plant cell", -1.45, 1.22, 0);
    addLabel(g1, "Animal cell", 1.5, 1.22, 0);
    tick.push(plant, animal);
    reg("cells", g1); reg("plant", plant); reg("animal", animal);
    var P = plant.userData.parts, A = animal.userData.parts;
    reg("wall", P.cellWall); reg("vacuole", P.vacuole); reg("chloroplast", P.chloroplast); reg("nucleus", P.nucleus);
    reg("membrane", A.membrane); reg("mitochondrion", A.mitochondrion); reg("centrioles", A.centrioles);
    reg("lysosome", A.lysosome); reg("golgi", A.golgi); reg("er", A.er); reg("ribosome", P.ribosome); reg("glycogen", A.glycogen);
    reg("vacuoleA", A.vacuole);
    groups.cells.userData.pickTargets = [plant, animal];
    groups.cells.userData.pickMap = { plant: plant, animal: animal };

    /* ---- mode 2: microscope ---- */
    var g2 = new THREE.Group(); groups.microscope = g2; scene.add(g2);
    var scope = CellKit.microscope({ objective: 0 });
    scope.scale.setScalar(1.6); scope.position.set(0, -1.35, 0); scope.rotation.y = -0.5;
    g2.add(scope); tick.push(scope);
    groups.microscope.userData.scope = scope;
    var S = scope.userData.parts;
    reg("microscope", scope); reg("eyepiece", S.eyepiece); reg("objective", S.objective); reg("nosepiece", S.nosepiece);
    reg("stage", S.stage); reg("coarse", S.coarse); reg("fine", S.fine); reg("lamp", S.lamp); reg("slide", S.slide); reg("specimen", S.specimen);
    reg("tube", S.tube); reg("arm", S.arm);
    addLabel(g2, "Eyepiece ×10", 0.55, 1.45, 0.2);
    var objLabel = addLabel(g2, "Objective ×4", 0.75, 0.25, 0.2);
    g2.userData.objLabel = objLabel;

    /* ---- mode 3: osmosis ---- */
    var g3 = new THREE.Group(); groups.osmosis = g3; scene.add(g3);
    var plantO = CellKit.plantCell({ w: 1.9, h: 1.25, d: 1.1, chloroplasts: 10, tonicity: 0 });
    plantO.position.set(-1.4, 0, 0); plantO.rotation.set(0.2, 0.4, 0);
    var rbcO = CellKit.rbc({ size: 1.7 });
    rbcO.position.set(1.45, 0, 0);
    g3.add(plantO, rbcO); tick.push(plantO, rbcO);
    var bathGeo = new THREE.BoxGeometry(6.0, 2.3, 2.1);
    var bath = new THREE.Mesh(bathGeo, CellKit.glass(0x7dd3fc, 0.08));
    bath.renderOrder = -1; g3.add(bath);
    g3.add(new THREE.LineSegments(new THREE.EdgesGeometry(bathGeo), new THREE.LineBasicMaterial({ color: 0x7cc4ff, transparent: true, opacity: 0.35 })));
    // dissolved salt particles: how many are drawn shows how concentrated the solution is
    var sp = [], rr = seeded(5);
    for (var i = 0; i < 220; i++) sp.push((rr() - 0.5) * 5.8, (rr() - 0.5) * 2.1, (rr() - 0.5) * 1.9);
    var saltGeo = new THREE.BufferGeometry(); saltGeo.setAttribute("position", new THREE.Float32BufferAttribute(sp, 3));
    var salt = new THREE.Points(saltGeo, new THREE.PointsMaterial({ color: 0xf8fafc, size: 0.05, transparent: true, opacity: 0.9 }));
    g3.add(salt);
    // water molecules crossing each membrane
    var waterP = makeWater(new THREE.Vector3(-1.4, 0, 0), new THREE.Vector3(0.95, 0.62, 0.55), 18, 11);
    var waterR = makeWater(new THREE.Vector3(1.45, 0, 0), new THREE.Vector3(0.85, 0.85, 0.35), 16, 23);
    g3.add(waterP.group, waterR.group);
    var plantLab = addLabel(g3, "Ugu cell: flaccid", -1.4, 1.38, 0);
    var rbcLab = addLabel(g3, "Red cell: normal", 1.45, 1.38, 0);
    // a faded, burst red cell must not hide the solution behind it
    if (rbcO.userData.parts.rbc) rbcO.userData.parts.rbc.material.depthWrite = false;
    // membrane fragments ("ghost") that replace a red cell once it has burst
    var frags = new THREE.Group(), fr = seeded(31);
    var fragMat = new THREE.MeshStandardMaterial({ color: 0xd62839, emissive: 0x5a0a10, emissiveIntensity: 0.3, roughness: 0.5, transparent: true, opacity: 0.85, side: THREE.DoubleSide });
    for (var q = 0; q < 14; q++) {
      var a = q / 14 * Math.PI * 2 + fr() * 0.3;
      var piece = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 6, 0, 1.2 + fr(), 0, 1.1), fragMat);
      piece.userData.dir = new THREE.Vector3(Math.cos(a), (fr() - 0.5) * 0.8, Math.sin(a) * 0.6);
      piece.rotation.set(fr() * 3, fr() * 3, fr() * 3);
      frags.add(piece);
    }
    frags.position.copy(rbcO.position); frags.visible = false; g3.add(frags);
    g3.userData = { frags: frags, burstT: 0, plant: plantO, rbc: rbcO, bath: bath, salt: salt, water: [waterP, waterR], plantLab: plantLab, rbcLab: rbcLab };
    reg("osmosis", g3); reg("plantO", plantO); reg("rbc", rbcO); reg("bath", bath);

    hiNarr = CellKit.makeHighlighter(scene);
    hiPick = CellKit.makeHighlighter(scene);
    pickLabel = CellKit.label(" ", { h: 0.2 }); pickLabel.visible = false; scene.add(pickLabel);

    // pointer: horizontal drag turns the view; a tap picks an organelle
    var down = null;
    canvas.addEventListener("pointerdown", function (e) { down = { x: e.clientX, y: e.clientY, yaw: view.yaw, drag: false }; view.lastTouch = performance.now(); });
    canvas.addEventListener("pointermove", function (e) {
      if (!down) return;
      var dx = e.clientX - down.x, dy = e.clientY - down.y;
      if (!down.drag && Math.abs(dx) > 7 && Math.abs(dx) > Math.abs(dy)) down.drag = true;
      if (down.drag) { view.yaw = Math.max(-0.95, Math.min(0.95, down.yaw - dx * 0.008)); view.lastTouch = performance.now(); }
    });
    function up(e) {
      if (!down) return;
      var wasDrag = down.drag || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 8;
      down = null;
      if (!wasDrag && e.type === "pointerup") pickAt(e);
    }
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);
    canvas.addEventListener("pointerleave", function () { if (down && down.drag) down = null; });

    if (window.ResizeObserver) new ResizeObserver(resize).observe(canvas.parentElement);
    window.addEventListener("resize", resize);
    if (window.IntersectionObserver) new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }, { threshold: 0.01 }).observe(canvas);
    resize();
    requestAnimationFrame(frame);
  }

  function seeded(seed) { var s = seed; return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }
  function reg(name, obj) { if (obj) parts[name] = obj; }
  function addLabel(group, text, x, y, z) {
    var l = CellKit.label(text, { h: 0.2 });
    l.position.set(x, y, z); group.add(l); return l;
  }
  function tagParts(cell, cellName, map) {
    // generic shells first, specific organelles last, so the most specific tag wins
    ["cellWall", "membrane"].concat(Object.keys(map).filter(function (k) { return k !== "cellWall" && k !== "membrane"; })).forEach(function (k) {
      var obj = cell.userData.parts[k];
      if (!obj || !map[k]) return;
      obj.traverse(function (o) { o.userData.pk = { cell: cellName, key: map[k] }; });
    });
  }
  function makeWater(centre, semi, n, seed) {
    var group = new THREE.Group(), r = seeded(seed), mols = [];
    var mat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0ea5e9, emissiveIntensity: 0.55, roughness: 0.3 });
    var geo = new THREE.SphereGeometry(0.045, 10, 8);
    for (var i = 0; i < n; i++) {
      var th = r() * Math.PI * 2, ph = Math.acos(2 * r() - 1);
      var d = new THREE.Vector3(Math.sin(ph) * Math.cos(th), Math.cos(ph) * 0.8, Math.sin(ph) * Math.sin(th));
      var m = new THREE.Mesh(geo, mat);
      m.userData = { d: d.normalize(), ph: r(), alt: i % 2 };
      group.add(m); mols.push(m);
    }
    return { group: group, mols: mols, centre: centre, semi: semi, dir: 0 };
  }

  /* ---------------- camera framing ---------------- */
  var fitBox = null;
  function refit() {
    var g = groups[state.mode]; if (!g) return;
    var box = new THREE.Box3();
    g.traverse(function (o) { if (o.isMesh && !(o.userData && o.userData.isLabel)) { o.updateWorldMatrix(true, false); box.expandByObject(o); } });
    fitBox = box;
    resize();
  }
  function resize() {
    if (!renderer) return;
    var w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    if (!fitBox) return;
    var size = fitBox.getSize(new THREE.Vector3()), c = fitBox.getCenter(new THREE.Vector3());
    var vFov = THREE.MathUtils.degToRad(camera.fov), hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);
    var radiusXZ = Math.sqrt(size.x * size.x + size.z * size.z) / 2;
    var dH = (size.y / 2 + 0.25) / Math.tan(vFov / 2), dW = (Math.max(size.x / 2, radiusXZ * 0.92) + 0.15) / Math.tan(hFov / 2);
    view.dist = Math.max(dH, dW) * 1.04 + size.z * 0.35;
    view.target.copy(c);
  }

  /* ---------------- picking ---------------- */
  var ray = typeof THREE !== "undefined" ? new THREE.Raycaster() : null, ndc = typeof THREE !== "undefined" ? new THREE.Vector2() : null;
  if (ray) { ray.params.Points.threshold = 0.035; ray.params.Line.threshold = 0.01; }
  function pickAt(e) {
    if (state.mode !== "cells") return;
    var r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    var hits = ray.intersectObjects(groups.cells.userData.pickTargets, true).filter(function (h) { return h.object.userData.pk; });
    if (!hits.length) return;
    var GEN = { wall: 1, membrane: 1, ribosome: 1, glycogen: 1 };
    var best = null;
    hits.some(function (h) { if (!GEN[h.object.userData.pk.key]) { best = h; return true; } return false; });
    if (!best) hits.some(function (h) { var k = h.object.userData.pk.key; if (k === "wall" || k === "membrane") { best = h; return true; } return false; });
    if (!best) best = hits[0];
    var pk = best.object.userData.pk;
    // find the tagged root object for the glow (the part group, not one tiny child mesh)
    var cell = groups.cells.userData.pickMap[pk.cell];
    var srcKey = Object.keys(cell.userData.parts).filter(function (k) {
      var o = cell.userData.parts[k], found = false;
      if (!o) return false;
      o.traverse(function (c) { if (c === best.object) found = true; });
      return found && o.userData.pk && o.userData.pk.key === pk.key;
    })[0];
    showPick(pk.key, pk.cell, srcKey ? cell.userData.parts[srcKey] : best.object, true);
  }

  function showPick(key, cellName, obj, fromLearner) {
    var f = INFO[key]; if (!f) return;
    state.picked = key; state.picks[key] = true;
    var count = Object.keys(state.picks).length;
    setHud("Selected part", f.name, "Membranes", f.mem, "Found in", f.where);
    ui.info.innerHTML = "<b>" + f.name + "</b>" + (cellName ? '<span class="tagline">' + (cellName === "plant" ? "plant cell" : "animal cell") + "</span>" : "") + "<br>" + f.job;
    if (gl && obj) {
      hiPick.set(obj);
      CellKit.setLabelText(pickLabel, f.name, { h: 0.2 });
      pickLabel.userData.follow = obj; pickLabel.visible = true;
    }
    if (fromLearner) {
      toast("<b>" + f.name + "</b><span class=\"mono\">" + f.mem + " · " + f.where + "</span>");
      emit({ mode: "cells", part: key, name: f.name, membranes: f.mem, memSay: f.ms, where: f.where, cell: cellName || null, count: count });
    }
  }

  // select(): buttons + narrator. Chooses the cell that best shows the organelle.
  var PICK_SRC = {
    nucleus: ["plant", "nucleus"], chloroplast: ["plant", "chloroplast"], wall: ["plant", "cellWall"], vacuole: ["plant", "vacuole"],
    membrane: ["animal", "membrane"], mitochondrion: ["animal", "mitochondrion"], centrioles: ["animal", "centrioles"],
    lysosome: ["animal", "lysosome"], golgi: ["plant", "golgi"], er: ["animal", "er"], ribosome: ["animal", "ribosome"],
    glycogen: ["animal", "glycogen"], vacuoleA: ["animal", "vacuole"]
  };
  function select(key, fromLearner) {
    if (state.mode !== "cells") setMode("cells", false);
    var src = PICK_SRC[key]; if (!src) return;
    var obj = null;
    if (gl) { var cell = groups.cells.userData.pickMap[src[0]]; obj = cell.userData.parts[src[1]]; }
    showPick(key, src[0], obj, !!fromLearner);
  }

  /* ---------------- modes ---------------- */
  var LEGEND = {
    cells: '<span><i class="sw sw-plant"></i>Plant (ugu leaf) cell</span><span><i class="sw sw-animal"></i>Animal (cheek) cell</span>',
    microscope: '<span><i class="sw sw-scope"></i>Compound light microscope</span><span><i class="sw sw-plant"></i>Onion peel on the stage</span>',
    osmosis: '<span><i class="sw sw-water"></i>Water molecules</span><span><i class="sw sw-plant"></i>Ugu cell</span><span><i class="sw sw-animal"></i>Red cell</span>'
  };
  function setMode(m, fromLearner) {
    if (!LEGEND[m]) return;
    state.mode = m;
    modeTabs.forEach(function (b) { b.setAttribute("aria-selected", b.getAttribute("data-mode") === m ? "true" : "false"); });
    ctrls.forEach(function (c) { c.hidden = c.getAttribute("data-for") !== m; });
    if (ui.legend) ui.legend.innerHTML = LEGEND[m];
    if (ui.fov) ui.fov.hidden = m !== "microscope";
    if (ui.fovCap) ui.fovCap.hidden = m !== "microscope";
    if (ui.toast) ui.toast.classList.remove("show");
    if (gl) {
      Object.keys(groups).forEach(function (k) { groups[k].visible = k === m; });
      if (hiPick) hiPick.set(null);
      if (pickLabel) pickLabel.visible = false;
      refit();
    }
    if (m === "cells") {
      setHud("Mode", "Plant beside animal", "Selected part", "Tap an organelle", "Membranes", "—");
      ui.info.innerHTML = "Tap any part of either cell (or a button) to see its name, how many membranes wrap it, and its job.";
      state.picked = null;
    } else if (m === "microscope") {
      setObjective(state.objective, false);
    } else {
      setSolution(state.solution, false);
    }
    if (fromLearner) emit({ mode: m, switched: true });
  }

  function setObjective(i, fromLearner) {
    i = Math.max(0, Math.min(2, i | 0));
    state.objective = i;
    if (state.mode !== "microscope") setMode("microscope", false);
    var o = OBJ[i];
    labRoot.querySelectorAll("[data-objective]").forEach(function (b) { b.setAttribute("aria-pressed", +b.getAttribute("data-objective") === i ? "true" : "false"); });
    var width = o.field / o.n; // mm
    setHud("Lenses", "×10 eyepiece · ×" + o.obj + " objective", "Total magnification", "×" + o.M, "Field of view", o.field.toFixed(o.field < 1 ? 2 : 1) + " mm · " + o.n + " cells across");
    ui.info.innerHTML = "Total magnification = 10 × " + o.obj + " = <b>×" + o.M + "</b> (multiply, never add). The field is " + o.field.toFixed(o.field < 1 ? 2 : 1) + " mm wide and " + o.n +
      " onion cells fit across it, so one cell is " + o.field.toFixed(o.field < 1 ? 2 : 1) + " ÷ " + o.n + " = " + width.toFixed(3) + " mm = <b>" + Math.round(width * 1000) + " µm</b>." +
      (i === 2 ? " At ×40, focus only with the <b>fine</b> knob." : " The image grows at higher power; the cell does not.");
    if (gl) {
      var scope = groups.microscope.userData.scope;
      scope.userData.selectObjective(i);
      CellKit.setLabelText(groups.microscope.userData.objLabel, "Objective ×" + o.obj, { h: 0.2 });
    }
    fov.target = o.n;
    if (!fov.running) { fov.running = true; requestAnimationFrame(drawFov); }
    if (fromLearner) emit({ mode: "microscope", objective: o.obj, M: o.M, field: o.field, cells: o.n, width_um: Math.round(width * 1000) });
  }

  function setSolution(s, fromLearner) {
    var d = SOL[s]; if (!d) return;
    state.solution = s;
    if (state.mode !== "osmosis") setMode("osmosis", false);
    labRoot.querySelectorAll("[data-solution]").forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-solution") === s ? "true" : "false"); });
    setHud("Solution", d.name + " (" + d.tone + ")", "Ugu leaf cell", d.plantTxt, "Red blood cell", d.rbcTxt);
    ui.info.innerHTML = d.info;
    if (gl) {
      var u = groups.osmosis.userData;
      u.plant.userData.setState({ tonicity: d.plant });
      u.rbc.userData.setState({ tonicity: d.rbc });
      u.salt.geometry.setDrawRange(0, s === "water" ? 0 : s === "saline" ? 40 : 220);
      u.bath.material.color.setHex(s === "water" ? 0x7dd3fc : s === "saline" ? 0xbae6fd : 0xe2e8f0);
      u.bath.material.opacity = s === "salt" ? 0.14 : 0.08;
      u.water.forEach(function (w) { w.dir = d.plant; });
      CellKit.setLabelText(u.plantLab, "Ugu cell: " + (s === "water" ? "turgid" : s === "saline" ? "flaccid" : "plasmolysed"), { h: 0.2 });
      CellKit.setLabelText(u.rbcLab, "Red cell: " + (s === "water" ? "burst" : s === "saline" ? "normal" : "crenated"), { h: 0.2 });
    }
    if (fromLearner) {
      toast("<b>" + d.name + "</b><span class=\"mono\">Ugu: " + d.plantTxt.split(":")[0] + " · Red cell: " + d.rbcTxt.split(" (")[0] + "</span>");
      emit({ mode: "osmosis", solution: s, name: d.name, tone: d.tone, plant: d.plantTxt, rbc: d.rbcTxt });
    }
  }

  /* ---------------- eyepiece view (2D canvas): onion epidermis stained with iodine ---------------- */
  var fov = { cur: 80, target: 80, running: false };
  function drawFov() {
    if (!ui.fov) { fov.running = false; return; }
    fov.cur += (fov.target - fov.cur) * (reduceMotion ? 1 : 0.14);
    if (Math.abs(fov.cur - fov.target) < 0.05) fov.cur = fov.target;
    var c = ui.fov, g = c.getContext("2d"), D = c.width, R = D / 2;
    g.clearRect(0, 0, D, D);
    g.save();
    g.beginPath(); g.arc(R, R, R - 1, 0, Math.PI * 2); g.clip();
    g.fillStyle = "#f6e7b8"; g.fillRect(0, 0, D, D);              // bright field, iodine-tinted
    var w = D / fov.cur, h = w * 2.6;                              // onion epidermal cells: long and narrow
    g.strokeStyle = "#8a5a1c"; g.lineWidth = Math.max(0.6, w * 0.09);
    var rows = Math.ceil(D / h) + 2;
    for (var row = -1; row < rows; row++) {
      var y = row * h, off = (row % 2) * w * 0.5;
      g.beginPath(); g.moveTo(0, y); g.lineTo(D, y); g.stroke();
      for (var x = -w + off; x < D + w; x += w) {
        g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + h); g.stroke();
        if (w > 9) { // nucleus visible at higher power, lying at the side of the cell
          g.fillStyle = "#6b3f12";
          g.beginPath(); g.ellipse(x + w * 0.3, y + h * 0.3, w * 0.13, w * 0.11, 0, 0, Math.PI * 2); g.fill();
        }
      }
    }
    var vg = g.createRadialGradient(R, R, R * 0.55, R, R, R);       // lens vignette
    vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,0.45)");
    g.fillStyle = vg; g.fillRect(0, 0, D, D);
    g.restore();
    if (ui.fovCap) ui.fovCap.textContent = "Eyepiece view · ×" + OBJ[state.objective].M;
    if (fov.cur !== fov.target) requestAnimationFrame(drawFov); else fov.running = false;
  }

  /* ---------------- frame loop ---------------- */
  var clock = typeof THREE !== "undefined" ? new THREE.Clock() : null, box3 = typeof THREE !== "undefined" ? new THREE.Box3() : null;
  function frame() {
    requestAnimationFrame(frame);
    var dt = Math.min(clock.getDelta(), 0.05), t = clock.elapsedTime;
    if (!visible || document.hidden) return;
    var g = groups[state.mode];
    tick.forEach(function (o) { if (o.parent === g || (o.parent && o.parent.parent === g)) { if (o.userData.update) o.userData.update(reduceMotion ? 0 : dt, t); } });
    if (state.mode === "osmosis") { animateWater(dt); animateBurst(dt); }
    // gentle sway when the learner is not touching the lab
    if (!reduceMotion && performance.now() - view.lastTouch > 4000) view.yaw += (Math.sin(t * 0.25) * 0.28 - view.yaw) * Math.min(1, dt * 0.6);
    var d = view.dist, T = view.target;
    camera.position.set(T.x + Math.sin(view.yaw) * Math.cos(view.pitch) * d, T.y + Math.sin(view.pitch) * d, T.z + Math.cos(view.yaw) * Math.cos(view.pitch) * d);
    camera.lookAt(T);
    if (pickLabel.visible && pickLabel.userData.follow) {
      box3.setFromObject(pickLabel.userData.follow);
      if (!box3.isEmpty()) { box3.getCenter(pickLabel.position); pickLabel.position.y = box3.max.y + 0.2; }
    }
    hiNarr.update(dt, t); hiPick.update(dt, t);
    renderer.render(scene, camera);
  }
  function animateBurst(dt) {
    var u = groups.osmosis.userData, burst = u.rbc.userData.isBurst && u.rbc.userData.isBurst();
    var mesh = u.rbc.userData.parts.rbc;
    if (!burst) { u.frags.visible = false; u.burstT = 0; if (mesh) mesh.visible = true; return; }
    u.burstT += dt;
    if (mesh) mesh.visible = u.burstT < 0.6;
    u.frags.visible = true;
    var k = Math.min(1, u.burstT / 1.6);
    u.frags.children.forEach(function (p) { p.position.copy(p.userData.dir).multiplyScalar(0.55 + 0.6 * k); p.rotation.y += dt * 0.4; });
  }
  function animateWater(dt) {
    groups.osmosis.userData.water.forEach(function (w) {
      w.mols.forEach(function (m) {
        var u = m.userData;
        u.ph = (u.ph + dt * 0.32) % 1;
        var dir = w.dir === 0 ? (u.alt ? 1 : -1) : w.dir;        // isotonic: equal numbers in and out
        var r = dir > 0 ? 1.45 - u.ph * 0.95 : 0.5 + u.ph * 0.95;   // >0: entering the cell, <0: leaving it
        m.position.set(w.centre.x + u.d.x * w.semi.x * r, w.centre.y + u.d.y * w.semi.y * r, w.centre.z + u.d.z * w.semi.z * r);
        m.scale.setScalar(Math.sin(u.ph * Math.PI) * 1.1 + 0.05);
      });
    });
  }

  /* ---------------- narrator hooks ---------------- */
  var PART_MODE = {
    cells: "cells", plant: "cells", animal: "cells", wall: "cells", vacuole: "cells", chloroplast: "cells", nucleus: "cells", membrane: "cells",
    mitochondrion: "cells", centrioles: "cells", lysosome: "cells", golgi: "cells", er: "cells", ribosome: "cells", glycogen: "cells", vacuoleA: "cells",
    microscope: "microscope", eyepiece: "microscope", objective: "microscope", nosepiece: "microscope", stage: "microscope", coarse: "microscope",
    fine: "microscope", lamp: "microscope", slide: "microscope", specimen: "microscope", tube: "microscope", arm: "microscope",
    osmosis: "osmosis", plantO: "osmosis", rbc: "osmosis", bath: "osmosis"
  };
  function rect(part) {
    var cr = canvas.getBoundingClientRect();
    var whole = { left: cr.left, top: cr.top, width: cr.width, height: cr.height };
    if (!gl || !part || !parts[part]) return whole;
    var obj = parts[part];
    obj.updateWorldMatrix(true, true);
    var b = new THREE.Box3().setFromObject(obj);
    if (b.isEmpty()) return whole;
    var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity, v = new THREE.Vector3();
    for (var i = 0; i < 8; i++) {
      v.set(i & 1 ? b.max.x : b.min.x, i & 2 ? b.max.y : b.min.y, i & 4 ? b.max.z : b.min.z).project(camera);
      var x = cr.left + (v.x * 0.5 + 0.5) * cr.width, y = cr.top + (-v.y * 0.5 + 0.5) * cr.height;
      minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y);
    }
    minX = Math.max(cr.left, minX - 8); minY = Math.max(cr.top, minY - 8);
    maxX = Math.min(cr.right, maxX + 8); maxY = Math.min(cr.bottom, maxY + 8);
    if (maxX - minX < 40) { var cx = (minX + maxX) / 2; minX = cx - 20; maxX = cx + 20; }
    if (maxY - minY < 40) { var cy = (minY + maxY) / 2; minY = cy - 20; maxY = cy + 20; }
    return { left: minX, top: minY, width: maxX - minX, height: maxY - minY };
  }
  function highlight(part) {
    if (!part) { if (hiNarr) hiNarr.set(null); return; }
    var m = PART_MODE[part];
    if (m && m !== state.mode) setMode(m, false);
    if (gl && hiNarr && part !== m) hiNarr.set(parts[part] || null);
    else if (hiNarr) hiNarr.set(null);
  }

  window.StudyLab = {
    rect: rect,
    highlight: highlight,
    setMode: function (m) { setMode(m, false); },
    select: function (k) { select(k, false); },
    objective: function (i) { setObjective(i, false); },
    solution: function (s) { setSolution(s, false); },
    state: function () { return { mode: state.mode, objective: OBJ[state.objective].obj, solution: state.solution, picked: state.picked, picks: Object.keys(state.picks).length, phase: "run" }; },
    reset: function () { state.picks = {}; state.objective = 0; state.solution = "saline"; setMode("cells", false); },
    openTapFor: function () {}
  };

  setMode("cells", false);
})();
