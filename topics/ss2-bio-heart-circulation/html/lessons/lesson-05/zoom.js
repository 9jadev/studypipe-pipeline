/* Lesson 05 · 3D Stained Blood Smear (RBCs, WBCs, Platelets), Fibrin Meshwork Clot & WAEC Paper 3 Heart Dissection Zoom */
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
    mode: "mix", // "mix" = Smear + Paper 3 Heart, "acid" = Blood Smear & Clot, "base" = Dissected Paper 3 Heart
    highV: false // Fibrin Clot Meshwork Active
  };

  var highlightPart = null;
  var api = {
    setMode: setMode,
    add: toggleClot,
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
    pitch: 0.14,
    portraitPitch: 0.06,
    yaw: 0.08,
    fitWidth: 6.2,
    minHeight: 340,
    distance: 6.0,
    onFrame: frame
  });

  var smearGroup, heartGroup, smearApi, heartApi, keBar, peBar, totBar;

  if (stage) build();
  wireButtons();

  function build() {
    var scene = stage.rig;

    smearGroup = new THREE.Group();
    smearGroup.position.set(-1.15, 0.88, 0);
    scene.add(smearGroup);

    heartGroup = new THREE.Group();
    heartGroup.position.set(0.25, 0.88, 0);
    scene.add(heartGroup);

    if (window.HeartKit) {
      smearApi = HeartKit.bloodSmear({ scale: 0.78, clot: false });
      smearGroup.add(smearApi.group);
      var vTag = HeartKit.label("Blood smear", { bg: "rgba(225,29,72,0.92)", h: 0.13 });
      vTag.position.set(0, 1.08, 0);
      smearGroup.add(vTag);

      heartApi = HeartKit.heart({ scale: 0.8, mode: "dissect", labels: true });
      heartGroup.add(heartApi.group);
      var cTag = HeartKit.label("Paper 3 heart: draw 80 mm → 120 mm (×1.5)", { bg: "rgba(13,156,126,0.92)", h: 0.12 });
      cTag.position.set(0, 1.28, 0);
      heartGroup.add(cTag);
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

    keBar  = makeBar(1.30, 0x3ee6c4, "Hb O₂");
    peBar  = makeBar(1.75, 0xffb23f, "Fibrin");
    totBar = makeBar(2.20, 0xf43f5e, "Mag M");
    [keBar, peBar, totBar].forEach(function (b) { b.parent.visible = false; });
    barBase.visible = false;

    api.rect = function (part) {
      if (part === "bars") return stage.rectOf([keBar, peBar, totBar], 14);
      return stage.rectOf([smearGroup, heartGroup], 16);
    };

    layout();
    stage.start();
  }

  function layout() {
    if (!smearGroup) return;
    var both = state.mode !== "acid" && state.mode !== "base";
    smearGroup.visible = state.mode !== "base";
    heartGroup.visible = state.mode !== "acid";
    smearGroup.position.set(both ? -1.05 : 0, 1.0, 0);
    heartGroup.position.set(both ? 1.1 : 0, 0.7, 0);
    // Paper 3 view shows the outside of the specimen first (coronary groove), the side-by-side shows it cut open
    if (heartApi) heartApi.userData.setState({ mode: state.mode === "base" ? "specimen" : "dissect" });
    if (stage && stage.refit) stage.refit();
  }

  function setMode(m) {
    state.mode = m;
    layout();
    root.querySelectorAll(".seg [data-mode]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-mode") === m ? "true" : "false");
    });
    if (m === "acid") toast("3D Blood Smear: Enucleated biconcave RBCs (~5M/mm³), lobed-nucleus phagocytes, round-nucleus lymphocytes, and platelets!");
    else if (m === "base") toast("WAEC Paper 3 Dissected Heart: Orient the diagonal coronary groove, confirm the 3× thicker left ventricular wall, and draw at ×1.5 magnification with zero shading!");
    else toast("Side-by-side view: Stained Blood Smear (left) and WAEC Paper 3 Dissected Heart Specimen (right).");
  }

  function toggleClot() {
    state.highV = !state.highV;
    if (smearApi && smearApi.setClot) smearApi.setClot(state.highV);
    toast(state.highV
      ? "4-Step Clotting Cascade: Thromboplastin + Ca²⁺ + Vitamin K convert prothrombin to thrombin, spinning fibrinogen into an insoluble golden fibrin mesh!"
      : "Unclotted Whole Blood in Plasma (Heparin prevents intravascular clotting).");
  }

  function reset() {
    state.highV = false;
    if (smearApi && smearApi.setClot) smearApi.setClot(false);
    setMode("mix");
    toast("Stage reset to side-by-side blood smear and Paper 3 heart specimen view.");
  }

  function wireButtons() {
    root.querySelectorAll(".seg [data-mode]").forEach(function (b) {
      b.addEventListener("click", function () { setMode(b.getAttribute("data-mode")); });
    });
    var addBtn = document.getElementById("zoom-add");
    if (addBtn) addBtn.addEventListener("click", toggleClot);
    var rstBtn = document.getElementById("zoom-reset");
    if (rstBtn) rstBtn.addEventListener("click", reset);
  }

  function frame(dt, t) {
    if (!smearGroup || !heartGroup) return;
    if (smearApi && smearApi.tick) smearApi.tick(dt, t);
    if (heartApi && heartApi.tick) heartApi.tick(dt, t);


    var o2Idx = 0.85;
    var fibIdx = state.highV ? 0.92 : 0.12;
    var magIdx = 0.75;

    if (keBar) keBar.scale.y = o2Idx;
    if (peBar) peBar.scale.y = fibIdx;
    if (totBar) totBar.scale.y = magIdx;

    var cV = document.querySelector('#zoom-counters [data-c="h"]');
    var cI = document.querySelector('#zoom-counters [data-c="oh"]');
    var cR = document.querySelector('#zoom-counters [data-c="na"]');
    var cT = document.querySelector('#zoom-counters [data-c="cl"]');
    var cP = document.querySelector('#zoom-counters [data-c="w"]');
    if (cV) cV.textContent = "5M RBC/mm³";
    if (cI) cI.textContent = state.highV ? "Fibrin Mesh" : "Fibrinogen";
    if (cR) cR.textContent = state.highV ? "Serum Left" : "Plasma 55%";
    if (cT) cT.textContent = "O⁻ / AB⁺";
    if (cP) cP.textContent = "M = ×1.5";
  }
})();
