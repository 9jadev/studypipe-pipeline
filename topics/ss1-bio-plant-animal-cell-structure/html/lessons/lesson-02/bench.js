/* Lesson 02 · 3D organelle dissector — CellKit.plantCell (cut-away wall) beside CellKit.animalCell.
   Tap an organelle to identify it; every card, count and "school slide?" verdict is computed from the model in data.js. */
(function () {
  "use strict";
  var root = document.getElementById("bench-stage");
  var canvas = document.getElementById("bench-canvas");
  var D = window.L02;
  if (!root || !canvas || !D) return;

  var NEED = 8; // distinct organelles to tap before the bench is "done"
  var toastEl = document.getElementById("bench-toast");
  var cardEl = document.getElementById("org-card");
  var readoutEl = document.getElementById("bench-readout");
  var hintEl = document.getElementById("bench-hint");
  var toastT;
  function toast(m) {
    if (!toastEl) return;
    toastEl.innerHTML = m;
    toastEl.classList.add("show");
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.classList.remove("show"); }, 3400);
  }
  function emit(n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); }

  var state = { view: "both", picked: null, cell: null, tapped: {}, done: false, lit: null };

  // which cell shows each part best (same rule as the Welcome Hub lab)
  var PICK_SRC = {
    nucleus: "plant", chloroplast: "plant", wall: "plant", vacuole: "plant", golgi: "plant", membrane: "animal",
    mitochondrion: "animal", centrioles: "animal", lysosome: "animal", er: "animal", ribosome: "animal",
    glycogen: "animal", vacuoleA: "animal"
  };
  var PLANT_MAP = { cellWall: "wall", membrane: "membrane", vacuole: "vacuole", nucleus: "nucleus", chloroplast: "chloroplast", mitochondrion: "mitochondrion", er: "er", golgi: "golgi", ribosome: "ribosome" };
  var ANIMAL_MAP = { membrane: "membrane", vacuole: "vacuoleA", nucleus: "nucleus", mitochondrion: "mitochondrion", centrioles: "centrioles", lysosome: "lysosome", golgi: "golgi", er: "er", glycogen: "glycogen", ribosome: "ribosome" };
  var KIT_KEY = { // organelle key -> part name on each cell
    plant: { wall: "cellWall", membrane: "membrane", vacuole: "vacuole", nucleus: "nucleus", chloroplast: "chloroplast", mitochondrion: "mitochondrion", er: "er", golgi: "golgi", ribosome: "ribosome" },
    animal: { membrane: "membrane", vacuole: "vacuole", vacuoleA: "vacuole", nucleus: "nucleus", mitochondrion: "mitochondrion", centrioles: "centrioles", lysosome: "lysosome", golgi: "golgi", er: "er", glycogen: "glycogen", ribosome: "ribosome" }
  };

  function whereShort(w) { return w === "both" ? "both" : w; }
  function countKey(k) { return D.ORG[k] && D.ORG[k].count !== undefined ? D.ORG[k].count : k; }
  function tappedCount() { return Object.keys(state.tapped).length; }

  function paintReadout(m) {
    if (!readoutEl) return;
    if (!m) { readoutEl.innerHTML = ""; return; }
    readoutEl.innerHTML =
      "<div><span>Membranes</span><b>" + m.membranes + "</b></div>" +
      "<div><span>Found in</span><b>" + whereShort(m.where) + "</b></div>" +
      '<div class="' + (m.slideVisible ? "" : "hot") + '"><span>School slide?</span><b>' + (m.slideVisible ? "yes" : "no") + "</b></div>" +
      "<div><span>Tapped</span><b>" + tappedCount() + " / " + D.PARTS.length + "</b></div>";
  }
  function paintCard(m, cellName) {
    if (!cardEl) return;
    cardEl.innerHTML = "<b>" + m.name + "</b>" + (cellName ? '<span class="tagline">' + (cellName === "plant" ? "plant cell" : "animal cell") + "</span>" : "") +
      "<br>" + m.structure + " <b>Membranes:</b> " + m.envNote + ". <b>Job:</b> " + m.job +
      " <b>School slide?</b> " + m.slideWhy;
  }
  function paintHint() {
    var n = tappedCount();
    if (hintEl) hintEl.innerHTML = "Tapped <b>" + n + " of " + NEED + "</b> organelles" + (n >= NEED ? " ✓" : "");
    root.querySelectorAll("#bench-parts [data-part]").forEach(function (b) {
      b.setAttribute("aria-pressed", state.tapped[b.getAttribute("data-part")] ? "true" : "false");
    });
  }

  /* ---------- the public scene API (used by the narrator, lesson.js and the hub-style table) ---------- */
  var api = {
    pick: pick, setView: setView, setMode: setView, reset: reset, lightMembranes: lightMembranes,
    rect: function () { return null; },
    highlight: function (p) { narrKey = p || null; applyNarr(); },
    reading: function () { return state.picked ? Object.assign(D.modelFor(state.picked), { tapped: tappedCount(), total: D.PARTS.length, done: state.done }) : null; },
    state: function () { return { view: state.view, picked: state.picked, tapped: tappedCount(), done: state.done }; }
  };
  window.StudyScenes = window.StudyScenes || {};
  window.StudyScenes.bench = api;

  var stage = window.SceneKit && window.CellKit && window.SceneKit.createStage({
    root: root, canvas: canvas, fov: 34, target: new THREE.Vector3(0, 0.1, 0),
    pitch: 0.2, yaw: 0.0, distance: 6, fitWidth: 6, minYaw: -0.9, maxYaw: 0.9, onFrame: frame
  });

  var plant, animal, plantLab, animalLab, hiNarr, hiPool = [], pickLabel, narrKey = null;
  var ray = typeof THREE !== "undefined" ? new THREE.Raycaster() : null, ndc = typeof THREE !== "undefined" ? new THREE.Vector2() : null;
  var box = typeof THREE !== "undefined" ? new THREE.Box3() : null;
  if (ray) { ray.params.Points.threshold = 0.035; ray.params.Line.threshold = 0.01; }

  if (stage) build();
  buildChips();
  wireButtons();
  paintHint();

  function tagParts(cell, cellName, map) {
    // generic shells first, specific organelles last, so the most specific tag wins
    ["cellWall", "membrane"].concat(Object.keys(map).filter(function (k) { return k !== "cellWall" && k !== "membrane"; })).forEach(function (k) {
      var obj = cell.userData.parts[k];
      if (!obj || !map[k]) return;
      obj.traverse(function (o) { o.userData.pk = { cell: cellName, key: map[k] }; });
    });
  }

  function build() {
    var scene = stage.rig;
    plant = CellKit.plantCell({ w: 2.2, h: 1.45, d: 1.25, chloroplasts: 12, tonicity: 1 });
    plant.position.set(-1.45, 0, 0); plant.rotation.set(0.22, 0.42, 0);
    animal = CellKit.animalCell({ r: 0.95, seed: 9 });
    animal.position.set(1.5, 0, 0); animal.rotation.set(0.25, -0.3, 0);
    scene.add(plant, animal);
    tagParts(plant, "plant", PLANT_MAP);
    tagParts(animal, "animal", ANIMAL_MAP);
    plantLab = CellKit.label("Plant cell", { h: 0.2 }); plantLab.position.set(-1.45, 1.22, 0); scene.add(plantLab);
    animalLab = CellKit.label("Animal cell", { h: 0.2 }); animalLab.position.set(1.5, 1.22, 0); scene.add(animalLab);

    hiNarr = CellKit.makeHighlighter(stage.scene);
    for (var i = 0; i < 14; i++) hiPool.push(CellKit.makeHighlighter(stage.scene));
    pickLabel = CellKit.label(" ", { h: 0.2 }); pickLabel.visible = false; stage.scene.add(pickLabel);

    // tap to identify (a drag only turns the view)
    var down = null;
    canvas.addEventListener("pointerdown", function (e) { down = { x: e.clientX, y: e.clientY }; });
    canvas.addEventListener("pointerup", function (e) {
      if (!down) return;
      var moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
      down = null;
      if (moved <= 8) pickAt(e);
    });
    canvas.addEventListener("pointercancel", function () { down = null; });

    api.rect = function (part) {
      var o = objFor(part);
      return o ? stage.rectOf(o, 12) : stage.rectOf([plant, animal], 10);
    };
    stage.start();
  }

  function cellObj(name) { return name === "animal" ? animal : plant; }
  function objFor(part) {
    if (!stage) return null;
    if (part === "plant") return plant;
    if (part === "animal") return animal;
    if (part === "cells") return [plant, animal];
    var src = PICK_SRC[part];
    if (!src) return null;
    var cell = cellObj(src);
    return cell.userData.parts[KIT_KEY[src][part]] || null;
  }

  /* ---------- picking ---------- */
  function pickAt(e) {
    var r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, stage.camera);
    var targets = [];
    if (plant.visible) targets.push(plant);
    if (animal.visible) targets.push(animal);
    var hits = ray.intersectObjects(targets, true).filter(function (h) { return h.object.userData.pk; });
    if (!hits.length) return;
    var GEN = { wall: 1, membrane: 1, ribosome: 1, glycogen: 1 };
    var best = null;
    hits.some(function (h) { if (!GEN[h.object.userData.pk.key]) { best = h; return true; } return false; });
    if (!best) hits.some(function (h) { var k = h.object.userData.pk.key; if (k === "wall" || k === "membrane") { best = h; return true; } return false; });
    if (!best) best = hits[0];
    var pk = best.object.userData.pk;
    var cell = cellObj(pk.cell);
    var srcKey = Object.keys(cell.userData.parts).filter(function (k) {
      var o = cell.userData.parts[k], found = false;
      if (!o) return false;
      o.traverse(function (c) { if (c === best.object) found = true; });
      return found && o.userData.pk && o.userData.pk.key === pk.key;
    })[0];
    show(pk.key, pk.cell, srcKey ? cell.userData.parts[srcKey] : best.object);
  }

  function modelKey(k) { return k === "vacuoleA" ? "vacuoleA" : k; }

  function show(key, cellName, obj) {
    if (!D.ORG[key]) return;
    var m = D.modelFor(modelKey(key));
    state.picked = key; state.cell = cellName;
    var ck = countKey(key), fresh = false;
    if (ck && D.PARTS.indexOf(ck) >= 0 && !state.tapped[ck]) { state.tapped[ck] = true; fresh = true; }
    paintCard(m, cellName);
    paintReadout(m);
    paintHint();
    if (stage && obj) {
      hiNarr.set(obj);
      CellKit.setLabelText(pickLabel, m.short, { h: 0.2 });
      pickLabel.userData.follow = obj; pickLabel.visible = true;
    }
    toast("<b>" + m.name + "</b> · " + m.membranes + (m.membranes === 1 ? " membrane" : " membranes") + " · " + (m.where === "both" ? "plant and animal" : m.where + " cell"));
    var rd = Object.assign({}, m, { tapped: tappedCount(), total: D.PARTS.length, cell: cellName, fresh: fresh, count: tappedCount() });
    emit("l2:bench", rd);
    if (tappedCount() >= NEED && fresh) {
      state.done = true;
      emit("l2:bench-done", { count: tappedCount() });
    }
  }

  function pick(key) {
    if (!D.ORG[key]) return;
    var src = PICK_SRC[key] || "plant";
    // make sure the cell that shows this part is on screen
    if (state.view !== "both" && state.view !== src) setView(src, true);
    var obj = null;
    if (stage) obj = objFor(key);
    show(key, src, obj);
  }

  /* ---------- views ---------- */
  function setView(v, quiet) {
    if (v !== "plant" && v !== "animal") v = "both";
    state.view = v;
    root.querySelectorAll("#bench-view [data-view]").forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-view") === v ? "true" : "false"); });
    if (!stage) return;
    plant.visible = v !== "animal"; plantLab.visible = plant.visible;
    animal.visible = v !== "plant"; animalLab.visible = animal.visible;
    plant.position.x = v === "both" ? -1.45 : 0; plantLab.position.x = plant.position.x;
    animal.position.x = v === "both" ? 1.5 : 0; animalLab.position.x = animal.position.x;
    if (v === "plant") { plant.scale.setScalar(1.15); plantLab.position.y = 1.5; } else { plant.scale.setScalar(1); plantLab.position.y = 1.22; }
    if (v === "animal") { animal.scale.setScalar(1.2); animalLab.position.y = 1.5; } else { animal.scale.setScalar(1); animalLab.position.y = 1.22; }
    hiNarr.set(null); pickLabel.visible = false;
    clearLit();
    stage.refit();
    if (!quiet) { emit("l2:view", { view: v }); }
  }

  /* ---------- membrane-count highlight (used by the Make Sense explorer) ---------- */
  function clearLit() { hiPool.forEach(function (h) { h.set(null); }); state.lit = null; }
  function lightMembranes(n) {
    if (!stage) return;
    clearLit();
    if (n == null) return;
    if (state.view !== "both") setView("both", true);
    hiNarr.set(null); pickLabel.visible = false;
    state.lit = n;
    var idx = 0;
    D.PARTS.forEach(function (k) {
      var o = D.ORG[k];
      if (o.sort === undefined || o.env.length !== n) return;
      ["plant", "animal"].forEach(function (c) {
        var nm = KIT_KEY[c][k];
        var obj = nm && cellObj(c).userData.parts[nm];
        if (obj && idx < hiPool.length) hiPool[idx++].set(obj);
      });
    });
  }

  function applyNarr() {
    if (!stage || !hiNarr) return;
    if (!narrKey) { if (!state.picked) hiNarr.set(null); return; }
    var o = objFor(narrKey);
    if (o && !Array.isArray(o)) hiNarr.set(o);
  }

  function reset() {
    state.tapped = {}; state.done = false; state.picked = null; state.cell = null;
    if (stage) { hiNarr.set(null); pickLabel.visible = false; clearLit(); }
    setView("both", true);
    if (cardEl) cardEl.innerHTML = "Tap any part of either cell to see its name, its membranes and its job.";
    paintReadout(null);
    paintHint();
    emit("l2:bench-reset");
    toast("Dissector reset. Tap an organelle to begin.");
  }

  /* ---------- buttons ---------- */
  function buildChips() {
    var holder = document.getElementById("bench-parts");
    if (!holder) return;
    D.PARTS.forEach(function (k) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "vt-btn"; b.setAttribute("data-part", k); b.setAttribute("aria-pressed", "false");
      b.textContent = D.ORG[k].short;
      holder.appendChild(b);
    });
  }
  function wireButtons() {
    root.querySelectorAll("#bench-parts [data-part]").forEach(function (b) {
      b.addEventListener("click", function () { pick(b.getAttribute("data-part")); });
    });
    root.querySelectorAll("#bench-view [data-view]").forEach(function (b) {
      b.addEventListener("click", function () { setView(b.getAttribute("data-view")); });
    });
    var r = document.getElementById("bench-reset");
    if (r) r.addEventListener("click", reset);
  }

  /* ---------- frame ---------- */
  function frame(dt, t) {
    if (!plant) return;
    if (plant.visible && plant.userData.update) plant.userData.update(dt, t);
    if (animal.visible && animal.userData.update) animal.userData.update(dt, t);
    hiNarr.update(dt, t);
    hiPool.forEach(function (h) { h.update(dt, t); });
    if (pickLabel.visible && pickLabel.userData.follow) {
      box.setFromObject(pickLabel.userData.follow);
      if (!box.isEmpty()) { box.getCenter(pickLabel.position); pickLabel.position.y = box.max.y + 0.2; }
    }
  }
})();
