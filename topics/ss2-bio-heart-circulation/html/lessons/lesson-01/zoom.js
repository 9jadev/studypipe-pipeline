/* Lesson 01 · 3D Single vs Incomplete Double vs Complete Double Circulation Zoom — Fish (2-Chamber Single) vs Toad (3-Chamber Incomplete) vs Mammal/Crocodile (4-Chamber Double) */
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
    mode: "mix", // "mix" = Side-by-Side Single vs Double, "acid" = Fish Single (2 Chambers), "base" = Mammal Double (4 Chambers)
    highV: false // Toad 3-Chamber Incomplete Double toggle
  };

  var highlightPart = null;
  var api = {
    setMode: setMode,
    add: toggleAmphibian,
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
    target: new THREE.Vector3(0, 1.35, 0),
    pitch: 0.1,
    portraitPitch: 0.04,
    yaw: 0.08,
    fitWidth: 6.2,
    minHeight: 340,
    distance: 6.0,
    onFrame: frame
  });

  var circuitGroup, circuitApi, keBar, peBar, totBar;

  if (stage) build();
  wireButtons();

  function build() {
    var scene = stage.rig;

    circuitGroup = new THREE.Group();
    circuitGroup.position.set(0, 1.35, 0);
    scene.add(circuitGroup);

    if (window.HeartKit) {
      circuitApi = HeartKit.circuitCompare({ scale: 0.88, mode: "both" });
      circuitGroup.add(circuitApi.group);
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

    keBar  = makeBar(1.30, 0x3ee6c4, "Chambers");
    peBar  = makeBar(1.75, 0xffb23f, "Passes");
    totBar = makeBar(2.20, 0xf43f5e, "Sys. P");
    // the live counters under the stage carry these numbers; keep the 3D view for the circulation itself
    [keBar, peBar, totBar].forEach(function (b) { b.parent.visible = false; });
    barBase.visible = false;

    api.rect = function (part) {
      if (part === "bars") return stage.rectOf([keBar, peBar, totBar], 14);
      return stage.rectOf(circuitGroup, 16);
    };

    stage.start();
  }

  function setMode(m) {
    state.mode = m;
    state.highV = false;
    root.querySelectorAll(".seg [data-mode]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-mode") === m ? "true" : "false");
    });
    applyCircuit();
    if (m === "acid") toast("Bony Fish Single Circulation: 2 chambers (1 atrium + 1 ventricle), 1 heart pass per circuit, pressure drops across gill capillaries!");
    else if (m === "base") toast("Mammal/Bird/Crocodile Complete Double Circulation: 4 chambers (2A + 2V), 2 heart passes per circuit, zero mixing, 120 mmHg systemic pressure!");
    else toast("Side-by-side comparison: Single Circulation (Fish, left) vs Double Circulation (Mammal, right).");
  }

  function applyCircuit() {
    if (!circuitApi) return;
    var mode = state.highV ? "incomplete" : state.mode === "acid" ? "single" : state.mode === "base" ? "double" : "both";
    circuitApi.userData.setState({ mode: mode });
    if (stage && stage.refit) stage.refit();
  }

  function toggleAmphibian() {
    state.highV = !state.highV;
    applyCircuit();
    toast(state.highV
      ? "Amphibian / Lizard Incomplete Double Circulation: 3 chambers (2 atria + 1 shared ventricle) — partial mixing in the single ventricle!"
      : "Complete 4-chamber double circulation (no mixing across the interventricular septum).");
  }

  function reset() {
    state.highV = false;
    setMode("mix");
    toast("Stage reset to side-by-side vertebrate circulation loops.");
  }

  function wireButtons() {
    root.querySelectorAll(".seg [data-mode]").forEach(function (b) {
      b.addEventListener("click", function () { setMode(b.getAttribute("data-mode")); });
    });
    var addBtn = document.getElementById("zoom-add");
    if (addBtn) addBtn.addEventListener("click", toggleAmphibian);
    var rstBtn = document.getElementById("zoom-reset");
    if (rstBtn) rstBtn.addEventListener("click", reset);
  }

  function frame(dt, t) {
    if (!circuitGroup) return;
    if (circuitApi && circuitApi.tick) circuitApi.tick(dt, t);
    circuitGroup.rotation.y = Math.sin(t * 0.45) * 0.08;

    var ch = state.highV ? 3 : state.mode === "acid" ? 2 : 4;
    var passes = state.mode === "acid" && !state.highV ? 1 : 2;
    var sysP = state.highV ? 55 : state.mode === "acid" ? 28 : 120;
    var mixing = state.highV ? "Partial" : "Zero";

    if (keBar) keBar.scale.y = Math.max(0.15, ch / 4.0);
    if (peBar) peBar.scale.y = Math.max(0.15, passes / 2.0);
    if (totBar) totBar.scale.y = Math.max(0.15, sysP / 125.0);

    var cV = document.querySelector('#zoom-counters [data-c="h"]');
    var cI = document.querySelector('#zoom-counters [data-c="oh"]');
    var cR = document.querySelector('#zoom-counters [data-c="na"]');
    var cT = document.querySelector('#zoom-counters [data-c="cl"]');
    var cP = document.querySelector('#zoom-counters [data-c="w"]');
    if (cV) cV.textContent = ch + " chambers";
    if (cI) cI.textContent = passes + "× / lap";
    if (cR) cR.textContent = mixing;
    if (cT) cT.textContent = sysP + " mmHg";
    if (cP) cP.textContent = state.highV ? "Toad/Lizard" : state.mode === "acid" ? "Tilapia" : "Mammal/Croc";
  }
})();
