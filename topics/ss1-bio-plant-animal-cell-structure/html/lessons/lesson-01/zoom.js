/* Lesson 01 · 3D Prokaryotic vs Eukaryotic Cell Cut-Away Zoom — E. coli Bacterium (70S, Nucleoid, Peptidoglycan) vs Eukaryotic Cell (80S, True Nucleus, Mitochondria) */
(function () {
  "use strict";
  var root = document.getElementById("zoom-stage");
  var canvas = document.getElementById("zoom-canvas");
  if (!root || !canvas || typeof THREE === "undefined") return;

  var toastEl = document.getElementById("zoom-toast");
  var toastT;
  function toast(m) {
    if (!toastEl) return;
    toastEl.textContent = m;
    toastEl.classList.add("show");
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.classList.remove("show"); }, 3000);
  }

  var state = {
    mode: "mix", // "mix" = Side-by-Side Comparison, "acid" = Prokaryote (E. coli), "base" = Eukaryote (Animal/Plant)
    highV: false
  };

  var highlightPart = null;
  var api = {
    setMode: setMode,
    add: toggleElectronScope,
    reset: reset,
    rect: function () { return null; },
    highlight: function (p) { highlightPart = p || null; }
  };
  window.StudyScenes = window.StudyScenes || {};
  window.StudyScenes.zoom = api;

  var stage = window.SceneKit && window.SceneKit.createStage({
    root: root,
    canvas: canvas,
    fov: 34,
    target: new THREE.Vector3(0, 0.85, 0),
    pitch: 0.22,
    yaw: 0.08,
    fitWidth: 6.2,
    distance: 6.0,
    onFrame: frame
  });

  var prokGroup, eukGroup, keBar, peBar, totBar, prokApi, eukApi;

  if (stage) build();
  wireButtons();

  function build() {
    var scene = stage.rig;

    prokGroup = new THREE.Group();
    prokGroup.position.set(-1.35, 0.90, 0);
    scene.add(prokGroup);

    eukGroup = new THREE.Group();
    eukGroup.position.set(0.15, 0.90, 0);
    scene.add(eukGroup);

    if (window.CellKit) {
      prokApi = CellKit.bacterium({ scale: 0.72 });
      prokGroup.add(prokApi.group);
      var pTag = CellKit.label("Prokaryote (70S · Nucleoid)", { bg: "rgba(217,138,0,0.92)" });
      pTag.position.set(0, 0.78, 0);
      prokGroup.add(pTag);

      eukApi = CellKit.animalCell({ scale: 0.72 });
      eukGroup.add(eukApi.group);
      var eTag = CellKit.label("Eukaryote (80S · True Nucleus)", { bg: "rgba(13,156,126,0.92)" });
      eTag.position.set(0, 0.96, 0);
      eukGroup.add(eTag);
    }

    var barBase = new THREE.Mesh(
      new THREE.BoxGeometry(1.65, 0.06, 0.5),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 })
    );
    barBase.position.set(1.75, 0.22, 0);
    scene.add(barBase);

    function makeBar(xPos, colorHex, label) {
      var g = new THREE.Group();
      g.position.set(xPos, 0.25, 0);
      var geo = new THREE.BoxGeometry(0.28, 1.35, 0.28);
      geo.translate(0, 0.675, 0);
      var mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.3, metalness: 0.2 }));
      g.add(mesh);

      var t = SceneKit.labelTexture(label, { size: 30, bg: "rgba(10,15,29,0.88)" });
      var s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false }));
      s.scale.set(0.19 * t.userData.aspect, 0.19, 1);
      s.position.set(0, -0.18, 0.15);
      g.add(s);

      scene.add(g);
      return mesh;
    }

    keBar  = makeBar(1.30, 0x3ee6c4, "Size (µm)");
    peBar  = makeBar(1.75, 0xffb23f, "Ribosome S");
    totBar = makeBar(2.20, 0xf43f5e, "Organelles");

    api.rect = function (part) {
      if (part === "bars") return stage.rectOf([keBar, peBar, totBar], 14);
      if (state.mode === "acid") return stage.rectOf(prokGroup, 16);
      if (state.mode === "base") return stage.rectOf(eukGroup, 16);
      return stage.rectOf([prokGroup, eukGroup], 16);
    };

    stage.start();
  }

  function setMode(m) {
    state.mode = m;
    root.querySelectorAll(".seg [data-mode]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-mode") === m ? "true" : "false");
    });
    if (m === "acid") toast("Prokaryote (Escherichia coli): 2 µm long, circular naked DNA in nucleoid, 70S ribosomes, peptidoglycan wall, zero membrane-bound organelles!");
    else if (m === "base") toast("Eukaryote: 45 µm diameter, double-membrane nuclear envelope, linear DNA on histones, 80S ribosomes, and mitochondria!");
    else toast("Side-by-side comparison: Prokaryote (left) vs Eukaryote (right).");
  }

  function toggleElectronScope() {
    state.highV = !state.highV;
    toast(state.highV ? "Electron Microscope Mode (×50,000, resolution 0.2 nm): 70S vs 80S ribosomes and nuclear pores clearly resolved!" : "Light Microscope Mode (×400, resolution 200 nm).");
  }

  function reset() {
    state.highV = false;
    setMode("mix");
    toast("Stage reset to side-by-side prokaryote vs eukaryote view.");
  }

  function wireButtons() {
    root.querySelectorAll(".seg [data-mode]").forEach(function (b) {
      b.addEventListener("click", function () { setMode(b.getAttribute("data-mode")); });
    });
    var addBtn = document.getElementById("zoom-add");
    if (addBtn) addBtn.addEventListener("click", toggleElectronScope);
    var rstBtn = document.getElementById("zoom-reset");
    if (rstBtn) rstBtn.addEventListener("click", reset);
  }

  function frame(dt, t) {
    if (!prokGroup || !eukGroup) return;
    if (prokApi && prokApi.tick) prokApi.tick(dt, t);
    prokGroup.rotation.y = Math.sin(t * 0.5) * 0.18;
    eukGroup.rotation.y = Math.cos(t * 0.45) * 0.16;

    var sizeUm = state.mode === "acid" ? 2.0 : state.mode === "base" ? 45.0 : 25.0;
    var riboS = state.mode === "acid" ? 70 : 80;
    var orgCount = state.mode === "acid" ? 0 : 8;
    var resNm = state.highV ? 0.2 : 200;

    prokGroup.visible = state.mode !== "base";
    eukGroup.visible = state.mode !== "acid";
    prokGroup.position.x = state.mode === "acid" ? -0.45 : -1.35;
    eukGroup.position.x = state.mode === "base" ? -0.35 : 0.15;

    if (keBar) keBar.scale.y = Math.max(0.08, Math.min(1.0, sizeUm / 50.0));
    if (peBar) peBar.scale.y = Math.max(0.08, Math.min(1.0, riboS / 100.0));
    if (totBar) totBar.scale.y = Math.max(0.06, Math.min(1.0, (orgCount + 0.5) / 9.0));

    var cV = document.querySelector('#zoom-counters [data-c="h"]');
    var cI = document.querySelector('#zoom-counters [data-c="oh"]');
    var cR = document.querySelector('#zoom-counters [data-c="na"]');
    var cT = document.querySelector('#zoom-counters [data-c="cl"]');
    var cP = document.querySelector('#zoom-counters [data-c="w"]');
    if (cV) cV.textContent = sizeUm.toFixed(1) + " µm";
    if (cI) cI.textContent = riboS + "S";
    if (cR) cR.textContent = state.mode === "acid" ? "Nucleoid" : "Envelope";
    if (cT) cT.textContent = orgCount;
    if (cP) cP.textContent = resNm + " nm";
  }
})();
