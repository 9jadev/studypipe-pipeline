/* Lesson 05 · 3D Light vs Electron Microscopy Resolution & WAEC Biological Drawing Audit Stage */
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
    mode: "mix", // "mix" = Onion Drawing (Double Wall), "acid" = Cheek Drawing (Single Line), "base" = EM Ultrastructure (0.2 nm)
    highV: false
  };

  var highlightPart = null;
  var api = {
    setMode: setMode,
    add: toggleRulerGuidelines,
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

  var onionGroup, cheekGroup, emGroup, keBar, peBar, totBar;

  if (stage) build();
  wireButtons();

  function build() {
    var scene = stage.rig;

    onionGroup = new THREE.Group();
    onionGroup.position.set(-0.65, 0.90, 0);
    scene.add(onionGroup);

    cheekGroup = new THREE.Group();
    cheekGroup.position.set(-0.65, 0.90, 0);
    cheekGroup.visible = false;
    scene.add(cheekGroup);

    emGroup = new THREE.Group();
    emGroup.position.set(-0.65, 0.90, 0);
    emGroup.visible = false;
    scene.add(emGroup);

    if (window.CellKit) {
      var oApi = CellKit.plantCell({ onion: true, scale: 0.88 });
      onionGroup.add(oApi.group);
      var oTag = CellKit.label("Onion Wet Mount (Iodine · Double Wall · ×1200)", { bg: "rgba(217,138,0,0.92)" });
      oTag.position.set(0, 0.94, 0);
      onionGroup.add(oTag);

      var cApi = CellKit.animalCell({ cheek: true, scale: 0.88 });
      cheekGroup.add(cApi.group);
      var cTag = CellKit.label("Cheek Wet Mount (Methylene Blue · Single Line · ×1000)", { bg: "rgba(59,108,246,0.92)" });
      cTag.position.set(0, 0.94, 0);
      cheekGroup.add(cTag);

      var eApi = CellKit.plantCell({ scale: 0.88 });
      emGroup.add(eApi.group);
      var eTag = CellKit.label("TEM Ultrastructure (0.2 nm · Cristae, Grana, 80S Ribosomes)", { bg: "rgba(13,156,126,0.92)" });
      eTag.position.set(0, 0.94, 0);
      emGroup.add(eTag);
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

    keBar  = makeBar(1.30, 0x3ee6c4, "Max Mag.");
    peBar  = makeBar(1.75, 0xffb23f, "Res. Power");
    totBar = makeBar(2.20, 0x22c55e, "WAEC Score");

    api.rect = function (part) {
      if (part === "bars") return stage.rectOf([keBar, peBar, totBar], 14);
      return stage.rectOf(onionGroup, 16);
    };

    stage.start();
  }

  function setMode(m) {
    state.mode = m;
    root.querySelectorAll(".seg [data-mode]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-mode") === m ? "true" : "false");
    });
    onionGroup.visible = m === "mix";
    cheekGroup.visible = m === "acid";
    emGroup.visible = m === "base";

    if (m === "acid") toast("Human Cheek Cell (Methylene Blue): Draw a single continuous outline for the plasma membrane, central nucleus, and granular cytoplasm!");
    else if (m === "base") toast("Transmission Electron Microscope (×500,000, 0.2 nm): Resolves ribosomes, ER, Golgi, and cristae invisible under light microscopy!");
    else toast("Onion Epidermal Cell (Iodine Stain): Draw a double line for the cellulose cell wall, peripheral nucleus, and large central vacuole!");
  }

  function toggleRulerGuidelines() {
    state.highV = !state.highV;
    toast(state.highV ? "WAEC Rubric Check ON: Horizontal ruled label lines without arrowheads + Title + Magnification = 10/10 marks!" : "Standard view restored.");
  }

  function reset() {
    state.highV = false;
    setMode("mix");
    toast("Stage reset to Iodine-stained Onion Epidermal view.");
  }

  function wireButtons() {
    root.querySelectorAll(".seg [data-mode]").forEach(function (b) {
      b.addEventListener("click", function () { setMode(b.getAttribute("data-mode")); });
    });
    var addBtn = document.getElementById("zoom-add");
    if (addBtn) addBtn.addEventListener("click", toggleRulerGuidelines);
    var rstBtn = document.getElementById("zoom-reset");
    if (rstBtn) rstBtn.addEventListener("click", reset);
  }

  function frame(dt, t) {
    onionGroup.rotation.y = Math.sin(t * 0.45) * 0.18;
    cheekGroup.rotation.y = Math.sin(t * 0.45) * 0.18;
    emGroup.rotation.y = Math.sin(t * 0.45) * 0.18;

    var isEM = state.mode === "base";
    if (keBar) keBar.scale.y = isEM ? 0.98 : 0.35;
    if (peBar) peBar.scale.y = isEM ? 0.98 : 0.28;
    if (totBar) totBar.scale.y = state.highV ? 1.0 : 0.85;

    var cV = document.querySelector('#zoom-counters [data-c="h"]');
    var cI = document.querySelector('#zoom-counters [data-c="oh"]');
    var cR = document.querySelector('#zoom-counters [data-c="na"]');
    var cT = document.querySelector('#zoom-counters [data-c="cl"]');
    var cP = document.querySelector('#zoom-counters [data-c="w"]');
    if (cV) cV.textContent = isEM ? "×500,000" : "×1,500";
    if (cI) cI.textContent = isEM ? "0.2 nm" : "200 nm";
    if (cR) cR.textContent = isEM ? "Lead/OsO₄" : state.mode === "acid" ? "Meth. Blue" : "Iodine";
    if (cT) cT.textContent = isEM ? "Dead/Vac." : "Living/Wet";
    if (cP) cP.textContent = state.mode === "acid" ? "Single Line" : "Double Line";
  }
})();
