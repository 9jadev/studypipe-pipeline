/* Lesson 03 · 3D Forms of Living Cells & Tissue-Level Hydra Zoom — Free-Living (Euglena/Amoeba), Colonial (Volvox), Filamentous (Spirogyra) & Tissue-Level (Hydra) */
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
    mode: "mix", // "mix" = Euglena & Volvox, "acid" = Spirogyra Filament, "base" = Hydra (Tissue Level)
    highV: false
  };

  var highlightPart = null;
  var api = {
    setMode: setMode,
    add: toggleLightAndOsmosis,
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

  var leftGroup, rightGroup, midGroup, keBar, peBar, totBar, eugApi, volvApi, spiroApi, hydraApi;

  if (stage) build();
  wireButtons();

  function build() {
    var scene = stage.rig;

    leftGroup = new THREE.Group();
    leftGroup.position.set(-1.35, 0.90, 0);
    scene.add(leftGroup);

    rightGroup = new THREE.Group();
    rightGroup.position.set(0.15, 0.90, 0);
    scene.add(rightGroup);

    midGroup = new THREE.Group();
    midGroup.position.set(-0.55, 0.90, 0);
    midGroup.visible = false;
    scene.add(midGroup);

    if (window.CellKit) {
      eugApi = CellKit.protist({ type: "euglena", scale: 0.76 });
      leftGroup.add(eugApi.group);
      var eTag = CellKit.label("Euglena (Mixotrophic Single Cell)", { bg: "rgba(34,197,94,0.92)" });
      eTag.position.set(0, 0.82, 0);
      leftGroup.add(eTag);

      volvApi = CellKit.protist({ type: "volvox", scale: 0.76 });
      rightGroup.add(volvApi.group);
      var vTag = CellKit.label("Volvox (Hollow Colony · Bridges)", { bg: "rgba(13,156,126,0.92)" });
      vTag.position.set(0, 0.86, 0);
      rightGroup.add(vTag);

      spiroApi = CellKit.protist({ type: "spirogyra", scale: 0.82 });
      midGroup.add(spiroApi.group);

      hydraApi = CellKit.protist({ type: "hydra", scale: 0.82 });
      hydraApi.group.visible = false;
      midGroup.add(hydraApi.group);
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

    keBar  = makeBar(1.30, 0x3ee6c4, "SA ÷ V");
    peBar  = makeBar(1.75, 0xffb23f, "Cell Count");
    totBar = makeBar(2.20, 0xf43f5e, "Specialis.");

    api.rect = function (part) {
      if (part === "bars") return stage.rectOf([keBar, peBar, totBar], 14);
      if (state.mode !== "mix") return stage.rectOf(midGroup, 16);
      return stage.rectOf([leftGroup, rightGroup], 16);
    };

    stage.start();
  }

  function setMode(m) {
    state.mode = m;
    root.querySelectorAll(".seg [data-mode]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-mode") === m ? "true" : "false");
    });
    if (m === "acid") {
      leftGroup.visible = false;
      rightGroup.visible = false;
      midGroup.visible = true;
      if (spiroApi) spiroApi.group.visible = true;
      if (hydraApi) hydraApi.group.visible = false;
      toast("Spirogyra (Unbranched Filament): Cylindrical cells joined end-to-end with spiral ribbon chloroplasts, pyrenoids & mucilage sheath!");
    } else if (m === "base") {
      leftGroup.visible = false;
      rightGroup.visible = false;
      midGroup.visible = true;
      if (spiroApi) spiroApi.group.visible = false;
      if (hydraApi) hydraApi.group.visible = true;
      toast("Hydra (Tissue Level): Diploblastic cnidarian with ectoderm and endoderm layers around an enteron, but no true organs!");
    } else {
      leftGroup.visible = true;
      rightGroup.visible = true;
      midGroup.visible = false;
      toast("Euglena (mixotrophic single cell) & Volvox (hollow colony linked by cytoplasmic strands).");
    }
  }

  function toggleLightAndOsmosis() {
    state.highV = !state.highV;
    toast(state.highV ? "Sunlight ON: Euglena swims toward light using its stigma (eyespot) & flagellum while contractile vacuoles pump water!" : "Darkness mode: Euglena switches to saprophytic/holozoic nutrition.");
  }

  function reset() {
    state.highV = false;
    setMode("mix");
    toast("Stage reset to Euglena & Volvox view.");
  }

  function wireButtons() {
    root.querySelectorAll(".seg [data-mode]").forEach(function (b) {
      b.addEventListener("click", function () { setMode(b.getAttribute("data-mode")); });
    });
    var addBtn = document.getElementById("zoom-add");
    if (addBtn) addBtn.addEventListener("click", toggleLightAndOsmosis);
    var rstBtn = document.getElementById("zoom-reset");
    if (rstBtn) rstBtn.addEventListener("click", reset);
  }

  function frame(dt, t) {
    if (eugApi && eugApi.tick) eugApi.tick(dt, t);
    if (volvApi && volvApi.tick) volvApi.tick(dt, t);
    if (spiroApi && spiroApi.tick) spiroApi.tick(dt, t);
    if (hydraApi && hydraApi.tick) hydraApi.tick(dt, t);

    var sav = state.mode === "base" ? 2.0 : state.mode === "acid" ? 4.5 : 6.0;
    var cells = state.mode === "base" ? "100,000" : state.mode === "acid" ? "Chain" : "1 / 5,000";
    var level = state.mode === "base" ? "Tissue" : state.mode === "acid" ? "Filament" : "Cell/Colony";

    if (keBar) keBar.scale.y = Math.max(0.15, sav / 6.5);
    if (peBar) peBar.scale.y = state.mode === "base" ? 0.95 : state.mode === "acid" ? 0.55 : 0.40;
    if (totBar) totBar.scale.y = state.mode === "base" ? 0.85 : state.mode === "acid" ? 0.30 : 0.45;

    var cV = document.querySelector('#zoom-counters [data-c="h"]');
    var cI = document.querySelector('#zoom-counters [data-c="oh"]');
    var cR = document.querySelector('#zoom-counters [data-c="na"]');
    var cT = document.querySelector('#zoom-counters [data-c="cl"]');
    var cP = document.querySelector('#zoom-counters [data-c="w"]');
    if (cV) cV.textContent = level;
    if (cI) cI.textContent = cells;
    if (cR) cR.textContent = sav.toFixed(1) + " mm⁻¹";
    if (cT) cT.textContent = state.highV ? "Autotrophic" : "Mixotrophic";
    if (cP) cP.textContent = "Contractile Vac.";
  }
})();
