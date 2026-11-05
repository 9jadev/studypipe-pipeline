/* Lesson 02 · 3D Semi-Autonomous Organelle Ultrastructure Zoom — Mitochondrion (Cristae & Matrix) vs Chloroplast (Grana & Stroma) */
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
    mode: "mix", // "mix" = Both Organelles, "acid" = Mitochondrion (Cristae), "base" = Chloroplast (Grana)
    highV: false
  };

  var highlightPart = null;
  var api = {
    setMode: setMode,
    add: toggleSunlightAndO2,
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
    pitch: 0.24,
    yaw: 0.08,
    fitWidth: 6.2,
    distance: 6.0,
    onFrame: frame
  });

  var mitoGroup, chloroGroup, keBar, peBar, totBar;

  if (stage) build();
  wireButtons();

  function build() {
    var scene = stage.rig;

    mitoGroup = new THREE.Group();
    mitoGroup.position.set(-1.35, 0.90, 0);
    scene.add(mitoGroup);

    chloroGroup = new THREE.Group();
    chloroGroup.position.set(0.15, 0.90, 0);
    scene.add(chloroGroup);

    if (window.CellKit) {
      var mApi = CellKit.mitochondrion({ scale: 0.78 });
      mitoGroup.add(mApi.group);
      var mTag = CellKit.label("Mitochondrion (Cristae · 38 ATP)", { bg: "rgba(244,63,94,0.92)" });
      mTag.position.set(0, 0.78, 0);
      mitoGroup.add(mTag);

      var cApi = CellKit.chloroplast({ scale: 0.78 });
      chloroGroup.add(cApi.group);
      var cTag = CellKit.label("Chloroplast (Grana · Stroma)", { bg: "rgba(34,197,94,0.92)" });
      cTag.position.set(0, 0.78, 0);
      chloroGroup.add(cTag);
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

    keBar  = makeBar(1.30, 0xf43f5e, "ATP / Glc");
    peBar  = makeBar(1.75, 0x22c55e, "O₂ / NADPH");
    totBar = makeBar(2.20, 0xffb23f, "Ribosome S");

    api.rect = function (part) {
      if (part === "bars") return stage.rectOf([keBar, peBar, totBar], 14);
      if (state.mode === "acid") return stage.rectOf(mitoGroup, 16);
      if (state.mode === "base") return stage.rectOf(chloroGroup, 16);
      return stage.rectOf([mitoGroup, chloroGroup], 16);
    };

    stage.start();
  }

  function setMode(m) {
    state.mode = m;
    root.querySelectorAll(".seg [data-mode]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-mode") === m ? "true" : "false");
    });
    if (m === "acid") toast("Mitochondrion: Folded inner cristae carry electron transport chains; aqueous matrix hosts Krebs cycle enzymes, circular DNA & 70S ribosomes!");
    else if (m === "base") toast("Chloroplast: Thylakoid stacks (grana) trap light for photolysis; aqueous stroma hosts Calvin cycle (RuBisCO), circular DNA & 70S ribosomes!");
    else toast("Side-by-side: Mitochondrion (left, respiration) and Chloroplast (right, photosynthesis).");
  }

  function toggleSunlightAndO2() {
    state.highV = !state.highV;
    toast(state.highV ? "Bright Sunlight + High O₂: Grana split water rapidly while cristae synthesise 38 ATP per glucose!" : "Basal metabolic rate restored.");
  }

  function reset() {
    state.highV = false;
    setMode("mix");
    toast("Ultrastructure view reset.");
  }

  function wireButtons() {
    root.querySelectorAll(".seg [data-mode]").forEach(function (b) {
      b.addEventListener("click", function () { setMode(b.getAttribute("data-mode")); });
    });
    var addBtn = document.getElementById("zoom-add");
    if (addBtn) addBtn.addEventListener("click", toggleSunlightAndO2);
    var rstBtn = document.getElementById("zoom-reset");
    if (rstBtn) rstBtn.addEventListener("click", reset);
  }

  function frame(dt, t) {
    if (!mitoGroup || !chloroGroup) return;
    mitoGroup.rotation.y = Math.sin(t * 0.55) * 0.22;
    chloroGroup.rotation.y = Math.cos(t * 0.50) * 0.22;

    mitoGroup.visible = state.mode !== "base";
    chloroGroup.visible = state.mode !== "acid";
    mitoGroup.position.x = state.mode === "acid" ? -0.45 : -1.35;
    chloroGroup.position.x = state.mode === "base" ? -0.45 : 0.15;

    var atpPerGlc = state.highV ? 38 : 36;
    var photoRate = state.mode === "acid" ? 0 : state.highV ? 100 : 60;

    if (keBar) keBar.scale.y = Math.max(0.1, atpPerGlc / 40.0);
    if (peBar) peBar.scale.y = Math.max(0.08, (photoRate + 10) / 110.0);
    if (totBar) totBar.scale.y = 0.70;

    var cV = document.querySelector('#zoom-counters [data-c="h"]');
    var cI = document.querySelector('#zoom-counters [data-c="oh"]');
    var cR = document.querySelector('#zoom-counters [data-c="na"]');
    var cT = document.querySelector('#zoom-counters [data-c="cl"]');
    var cP = document.querySelector('#zoom-counters [data-c="w"]');
    if (cV) cV.textContent = atpPerGlc + " ATP";
    if (cI) cI.textContent = "70S";
    if (cR) cR.textContent = "Circular";
    if (cT) cT.textContent = "2 membranes";
    if (cP) cP.textContent = state.mode === "base" ? "Grana/Stroma" : state.mode === "acid" ? "Cristae/Matrix" : "Both";
  }
})();
