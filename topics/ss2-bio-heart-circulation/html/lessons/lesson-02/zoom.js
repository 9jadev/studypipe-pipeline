/* Lesson 02 · 3D Atrioventricular Valve, Chordae Tendineae & Papillary Muscle Zoom — Diastolic Filling (AV Open) vs Ventricular Systole (AV Closed & Chordae Taut) */
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
    mode: "mix", // "mix" = Animated Beat Cycle, "acid" = Diastole (AV Open, SL Closed), "base" = Ventricular Systole (AV Closed, Chordae Taut)
    highV: false // Bicuspid (2 flaps) vs Tricuspid (3 flaps)
  };

  var highlightPart = null;
  var api = {
    setMode: setMode,
    add: toggleValveType,
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
    pitch: 0.16,
    portraitPitch: 0.08,
    yaw: 0.08,
    fitWidth: 6.2,
    minHeight: 340,
    distance: 6.0,
    onFrame: frame
  });

  var valveGroup, heartMiniGroup, valveApi, heartMiniApi, keBar, peBar, totBar, vTag2, vTag3;

  if (stage) build();
  wireButtons();

  function build() {
    var scene = stage.rig;

    valveGroup = new THREE.Group();
    valveGroup.position.set(-0.85, 0.66, 0);
    scene.add(valveGroup);

    heartMiniGroup = new THREE.Group();
    heartMiniGroup.position.set(0.95, 0.66, 0);
    scene.add(heartMiniGroup);

    if (window.HeartKit) {
      valveApi = HeartKit.valve({ open: 0.5, scale: 0.96, cusps: 2 });
      valveGroup.add(valveApi.group);
      vTag2 = HeartKit.label("Bicuspid (mitral) valve · 2 cusps", { bg: "rgba(190,24,45,0.92)", h: 0.13 });
      vTag3 = HeartKit.label("Tricuspid valve · 3 cusps", { bg: "rgba(37,72,190,0.92)", h: 0.13 });
      [vTag2, vTag3].forEach(function (t) { t.position.set(0, 1.0, 0); valveGroup.add(t); });
      vTag3.visible = false;
      var cTag = HeartKit.label("white cords = chordae tendineae", { bg: "rgba(10,15,29,0.85)", h: 0.1 });
      cTag.position.set(0, -0.82, 0.4);
      valveGroup.add(cTag);

      heartMiniApi = HeartKit.heart({ bpm: 60, mode: "both", scale: 0.78, labels: true });
      heartMiniGroup.add(heartMiniApi.group);
      var hTag = HeartKit.label("Same valves inside the heart", { bg: "rgba(225,29,72,0.92)", h: 0.13 });
      hTag.position.set(0, 1.25, 0);
      heartMiniGroup.add(hTag);
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

    keBar  = makeBar(1.30, 0x3ee6c4, "AV Open");
    peBar  = makeBar(1.75, 0xffb23f, "Chordae");
    totBar = makeBar(2.20, 0xf43f5e, "Vent. P");
    [keBar, peBar, totBar].forEach(function (b) { b.parent.visible = false; });
    barBase.visible = false;

    api.rect = function (part) {
      if (part === "bars") return stage.rectOf([keBar, peBar, totBar], 14);
      return stage.rectOf([valveGroup, heartMiniGroup], 16);
    };

    stage.start();
  }

  function setMode(m) {
    state.mode = m;
    root.querySelectorAll(".seg [data-mode]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-mode") === m ? "true" : "false");
    });
    if (m === "acid") toast("Ventricular Diastole (Filling): AV valve flaps open downward into ventricle; chordae tendineae are slack; semilunar valves closed!");
    else if (m === "base") toast("Ventricular Systole (Pumping): Ventricle contracts at 120 mmHg; AV flaps snap shut; papillary muscles pull chordae tendineae taut to prevent inversion!");
    else toast("Live Beat Cycle: watch the AV valve cusps and chordae tendineae alternate between filling and systolic lock.");
  }

  function toggleValveType() {
    state.highV = !state.highV;
    if (valveApi && valveApi.setCusps) valveApi.setCusps(state.highV ? 3 : 2);
    if (vTag2) { vTag2.visible = !state.highV; vTag3.visible = state.highV; }
    toast(state.highV
      ? "Tricuspid Valve (Right AV): 3 cusps between Right Atrium and Right Ventricle (25 mmHg)."
      : "Bicuspid / Mitral Valve (Left AV): 2 strong cusps between Left Atrium and Left Ventricle (120 mmHg).");
  }

  function reset() {
    state.highV = false;
    if (valveApi && valveApi.setCusps) valveApi.setCusps(2);
    if (vTag2) { vTag2.visible = true; vTag3.visible = false; }
    setMode("mix");
    toast("Stage reset to live AV valve and 4-chamber heart view.");
  }

  function wireButtons() {
    root.querySelectorAll(".seg [data-mode]").forEach(function (b) {
      b.addEventListener("click", function () { setMode(b.getAttribute("data-mode")); });
    });
    var addBtn = document.getElementById("zoom-add");
    if (addBtn) addBtn.addEventListener("click", toggleValveType);
    var rstBtn = document.getElementById("zoom-reset");
    if (rstBtn) rstBtn.addEventListener("click", reset);
  }

  function frame(dt, t) {
    if (!valveGroup) return;
    // diastole / systole buttons freeze the heart in that phase; live mode follows the beat
    if (heartMiniApi) {
      heartMiniApi.userData.setState({ hold: state.mode === "acid" ? 0.8 : state.mode === "base" ? 0.36 : null });
      heartMiniApi.tick(dt, t);
    }
    var target = heartMiniApi && heartMiniApi.userData.beat ? heartMiniApi.userData.beat.avOpen : 0.5;
    if (valveApi && valveApi.userData && valveApi.userData.setState) {
      valveApi.userData.setState({ open: target });
      valveApi.tick(dt, t);
    }
    var openVal = valveApi && valveApi.userData.open != null ? valveApi.userData.open : target;

    var tension = 1.0 - openVal;
    var ventP = state.highV ? Math.round(5 + tension * 20) : Math.round(8 + tension * 112);

    if (keBar) keBar.scale.y = Math.max(0.08, openVal);
    if (peBar) peBar.scale.y = Math.max(0.08, tension);
    if (totBar) totBar.scale.y = Math.max(0.08, ventP / 125.0);

    var cV = document.querySelector('#zoom-counters [data-c="h"]');
    var cI = document.querySelector('#zoom-counters [data-c="oh"]');
    var cR = document.querySelector('#zoom-counters [data-c="na"]');
    var cT = document.querySelector('#zoom-counters [data-c="cl"]');
    var cP = document.querySelector('#zoom-counters [data-c="w"]');
    if (cV) cV.textContent = state.highV ? "Tricuspid (3)" : "Bicuspid (2)";
    if (cI) cI.textContent = openVal > 0.5 ? "Open (filling)" : "Shut (pumping)";
    if (cR) cR.textContent = tension > 0.5 ? "Taut" : "Slack";
    if (cT) cT.textContent = ventP + " mmHg";
    if (cP) cP.textContent = openVal > 0.5 ? "Closed" : "Open";
  }
})();
