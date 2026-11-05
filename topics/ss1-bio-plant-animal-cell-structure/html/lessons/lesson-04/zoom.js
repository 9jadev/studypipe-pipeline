/* Lesson 04 · 3D Phospholipid Bilayer, Aquaporin Osmosis & ATP Active Transport Pump Zoom */
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
    mode: "mix", // "mix" = Osmosis via Aquaporin, "acid" = Active Transport (ATP Pump), "base" = Cyanide / Boiled Membrane Block
    highV: false
  };

  var highlightPart = null;
  var api = {
    setMode: setMode,
    add: toggleGradientOrATP,
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

  var bilayerGroup, bilayerApi, keBar, peBar, totBar;

  if (stage) build();
  wireButtons();

  function build() {
    var scene = stage.rig;

    bilayerGroup = new THREE.Group();
    bilayerGroup.position.set(-0.65, 0.90, 0);
    scene.add(bilayerGroup);

    if (window.CellKit) {
      bilayerApi = CellKit.bilayer({ scale: 0.95 });
      bilayerGroup.add(bilayerApi.group);
      var bTag = CellKit.label("Selectively Permeable Phospholipid Bilayer (Aquaporin & ATP Pump)", { bg: "rgba(13,156,126,0.92)" });
      bTag.position.set(0, 0.88, 0);
      bilayerGroup.add(bTag);
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

    keBar  = makeBar(1.30, 0x38bdf8, "H₂O Flux");
    peBar  = makeBar(1.75, 0xf59e0b, "ATP Used");
    totBar = makeBar(2.20, 0x22c55e, "Ion Pump");

    api.rect = function (part) {
      if (part === "bars") return stage.rectOf([keBar, peBar, totBar], 14);
      return stage.rectOf(bilayerGroup, 16);
    };

    stage.start();
  }

  function setMode(m) {
    state.mode = m;
    root.querySelectorAll(".seg [data-mode]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-mode") === m ? "true" : "false");
    });
    if (bilayerApi && bilayerApi.setMode) {
      bilayerApi.setMode(m === "acid" ? "active" : m === "base" ? "diffusion" : "osmosis");
    }
    if (m === "acid") toast("Active Transport: Carrier pump hydrolyses mitochondrial ATP to pump ions AGAINST their concentration gradient (low → high)!");
    else if (m === "base") toast("Cyanide / Hypoxia Block: Without O₂ and ATP, the active transport carrier pump stalls while passive diffusion continues!");
    else toast("Osmosis: Water molecules (cyan) stream passively down their water-potential gradient through aquaporin channels (0 ATP used).");
  }

  function toggleGradientOrATP() {
    state.highV = !state.highV;
    toast(state.highV ? "Steep Gradient + High Temperature: Kinetic energy increases molecular speed, doubling transport rate!" : "Standard physiological gradient restored.");
  }

  function reset() {
    state.highV = false;
    setMode("mix");
    toast("Membrane zoom reset to passive osmosis.");
  }

  function wireButtons() {
    root.querySelectorAll(".seg [data-mode]").forEach(function (b) {
      b.addEventListener("click", function () { setMode(b.getAttribute("data-mode")); });
    });
    var addBtn = document.getElementById("zoom-add");
    if (addBtn) addBtn.addEventListener("click", toggleGradientOrATP);
    var rstBtn = document.getElementById("zoom-reset");
    if (rstBtn) rstBtn.addEventListener("click", reset);
  }

  function frame(dt, t) {
    if (!bilayerGroup) return;
    if (bilayerApi && bilayerApi.tick && state.mode !== "base") bilayerApi.tick(dt, t);
    bilayerGroup.rotation.y = Math.sin(t * 0.4) * 0.12;

    var h2oFlux = state.highV ? 90 : 60;
    var atpUsed = state.mode === "acid" ? (state.highV ? 95 : 70) : 0;
    var ionPump = state.mode === "acid" ? (state.highV ? 95 : 75) : 5;

    if (keBar) keBar.scale.y = Math.max(0.08, h2oFlux / 100.0);
    if (peBar) peBar.scale.y = Math.max(0.06, (atpUsed + 5) / 100.0);
    if (totBar) totBar.scale.y = Math.max(0.06, ionPump / 100.0);

    var cV = document.querySelector('#zoom-counters [data-c="h"]');
    var cI = document.querySelector('#zoom-counters [data-c="oh"]');
    var cR = document.querySelector('#zoom-counters [data-c="na"]');
    var cT = document.querySelector('#zoom-counters [data-c="cl"]');
    var cP = document.querySelector('#zoom-counters [data-c="w"]');
    if (cV) cV.textContent = state.mode === "acid" ? "Low → High" : "High → Low";
    if (cI) cI.textContent = state.mode === "acid" ? "Required" : "0 ATP";
    if (cR) cR.textContent = state.mode === "acid" ? "Carrier Pump" : "Aquaporin";
    if (cT) cT.textContent = state.mode === "base" ? "Inhibited!" : "Active";
    if (cP) cP.textContent = "Selective";
  }
})();
