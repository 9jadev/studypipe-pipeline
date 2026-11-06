/* Lesson 04 · 3D Artery vs Vein vs Capillary Wall Cut-Away & Starling Capillary-Lymphatic Bed Zoom */
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
    mode: "mix", // "mix" = Vessels + Capillary Bed, "acid" = Artery vs Vein Cut-Away, "base" = Capillary Bed & Lymph Vessel
    highV: false // Filarial Worm Lymphatic Blockage (Elephantiasis)
  };

  var highlightPart = null;
  var api = {
    setMode: setMode,
    add: toggleFilariasis,
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

  var vesselsGroup, capBedGroup, vesselsApi, capBedApi, keBar, peBar, totBar;

  if (stage) build();
  wireButtons();

  function build() {
    var scene = stage.rig;

    vesselsGroup = new THREE.Group();
    vesselsGroup.position.set(-1.15, 0.88, 0);
    scene.add(vesselsGroup);

    capBedGroup = new THREE.Group();
    capBedGroup.position.set(0.25, 0.88, 0);
    scene.add(capBedGroup);

    if (window.HeartKit) {
      vesselsApi = HeartKit.vessels({ scale: 1 });
      vesselsGroup.add(vesselsApi.group);

      capBedApi = HeartKit.capillaryBed({ scale: 1 });
      capBedGroup.add(capBedApi.group);
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

    keBar  = makeBar(1.30, 0x3ee6c4, "Wall");
    peBar  = makeBar(1.75, 0xffb23f, "P_c");
    totBar = makeBar(2.20, 0xf43f5e, "Lymph");
    [keBar, peBar, totBar].forEach(function (b) { b.parent.visible = false; });
    barBase.visible = false;

    api.rect = function (part) {
      if (part === "bars") return stage.rectOf([keBar, peBar, totBar], 14);
      return stage.rectOf([vesselsGroup, capBedGroup], 16);
    };

    layout();
    stage.start();
  }

  function layout() {
    if (!vesselsGroup) return;
    var both = state.mode !== "acid" && state.mode !== "base";
    vesselsGroup.visible = state.mode !== "base";
    capBedGroup.visible = state.mode !== "acid";
    // stacked (vessels above, capillary bed below) so both stay readable on a phone
    vesselsGroup.position.set(0, both ? 2.4 : 0.9, 0);
    vesselsGroup.scale.setScalar(both ? 0.72 : 1);
    capBedGroup.position.set(0, 0.95, 0);
    capBedGroup.scale.setScalar(both ? 0.82 : 1);
    if (capBedApi) capBedApi.userData.setState({ mode: state.highV ? "blocked" : "normal" });
    if (stage && stage.refit) stage.refit();
  }

  function setMode(m) {
    state.mode = m;
    layout();
    root.querySelectorAll(".seg [data-mode]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-mode") === m ? "true" : "false");
    });
    if (m === "acid") toast("Artery vs Vein vs Capillary: Arteries have a thick elastic/muscular tunica media and narrow lumen; veins have a wide lumen and pocket valves; capillaries are 1 endothelial cell thick!");
    else if (m === "base") toast("Starling Capillary Bed & Lymphatics: +10 mmHg forces tissue fluid out at the arterial end, −10 mmHg reabsorbs 85% at the venous end, and blind-ended lymphatics drain the remaining 15%!");
    else toast("Side-by-side view: Blood Vessel Wall Layers (left) and Capillary-Lymphatic Exchange Bed (right).");
  }

  function toggleFilariasis() {
    state.highV = !state.highV;
    layout();
    toast(state.highV
      ? "Filariasis / Elephantiasis (Wuchereria bancrofti): Parasitic worms block lymphatic drainage, trapping the 15% (3 L/day) tissue fluid and causing severe leg oedema!"
      : "Normal Lymphatic Return (3.0 L/day drained smoothly to subclavian veins).");
  }

  function reset() {
    state.highV = false;
    setMode("mix");
    toast("Stage reset to side-by-side vessel and capillary bed view.");
  }

  function wireButtons() {
    root.querySelectorAll(".seg [data-mode]").forEach(function (b) {
      b.addEventListener("click", function () { setMode(b.getAttribute("data-mode")); });
    });
    var addBtn = document.getElementById("zoom-add");
    if (addBtn) addBtn.addEventListener("click", toggleFilariasis);
    var rstBtn = document.getElementById("zoom-reset");
    if (rstBtn) rstBtn.addEventListener("click", reset);
  }

  function frame(dt, t) {
    if (!vesselsGroup || !capBedGroup) return;
    if (vesselsApi && vesselsApi.tick) vesselsApi.tick(dt, t);
    if (capBedApi && capBedApi.tick) capBedApi.tick(dt, t);


    var wallIdx = state.mode === "acid" ? 0.90 : state.mode === "base" ? 0.15 : 0.55;
    var pcVal = state.mode === "acid" ? 100 : 35;
    var lymphFlow = state.highV ? 0.08 : 0.85;

    if (keBar) keBar.scale.y = Math.max(0.08, wallIdx);
    if (peBar) peBar.scale.y = Math.max(0.08, pcVal / 120.0);
    if (totBar) totBar.scale.y = Math.max(0.08, lymphFlow);

    var cV = document.querySelector('#zoom-counters [data-c="h"]');
    var cI = document.querySelector('#zoom-counters [data-c="oh"]');
    var cR = document.querySelector('#zoom-counters [data-c="na"]');
    var cT = document.querySelector('#zoom-counters [data-c="cl"]');
    var cP = document.querySelector('#zoom-counters [data-c="w"]');
    if (cV) cV.textContent = state.mode === "base" ? "1-Cell Cap" : "3 Tunics";
    if (cI) cI.textContent = "+10 mmHg";
    if (cR) cR.textContent = "−10 mmHg";
    if (cT) cT.textContent = state.highV ? "Blocked!" : "3.0 L/day";
    if (cP) cP.textContent = state.highV ? "Oedema!" : "Normal";
  }
})();
