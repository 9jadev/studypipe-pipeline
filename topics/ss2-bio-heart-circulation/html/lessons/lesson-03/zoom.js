/* Lesson 03 · 3D Myogenic Conduction System & Cardiac Cycle Phase Zoom — SAN → Atria (0.10 s) → AVN → Bundle of His → Purkinje Fibres (0.30 s) → General Diastole (0.40 s) */
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
    mode: "mix", // "mix" = Full 0.80 s Cycle, "acid" = Atrial Systole (0.10 s, SAN fires), "base" = Ventricular Systole (0.30 s, LUB + Ejection)
    highV: false // General Diastole (0.40 s, DUB + Refilling)
  };

  var highlightPart = null;
  var api = {
    setMode: setMode,
    add: toggleDiastole,
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

  var heartGroup, valveGroup, heartApi, valveApi, keBar, peBar, totBar;

  if (stage) build();
  wireButtons();

  function build() {
    var scene = stage.rig;

    heartGroup = new THREE.Group();
    heartGroup.position.set(-0.85, 0.74, 0);
    scene.add(heartGroup);

    valveGroup = new THREE.Group();
    valveGroup.position.set(1.1, 0.6, 0);
    scene.add(valveGroup);

    if (window.HeartKit) {
      heartApi = HeartKit.heart({ bpm: 75, mode: "pace", scale: 0.9, labels: true });
      heartGroup.add(heartApi.group);
      var hTag = HeartKit.label("SAN → AVN (0.1 s pause) → His → Purkinje", { bg: "rgba(217,138,0,0.92)", h: 0.13 });
      hTag.position.set(0, 1.45, 0);
      heartGroup.add(hTag);

      valveApi = HeartKit.valve({ open: 0.5, scale: 0.82, cusps: 2 });
      valveGroup.add(valveApi.group);
      var vTag = HeartKit.label("AV valve: shuts on 'LUB'", { bg: "rgba(225,29,72,0.92)", h: 0.13 });
      vTag.position.set(0, 0.95, 0);
      valveGroup.add(vTag);
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

    keBar  = makeBar(1.30, 0x3ee6c4, "Duration");
    peBar  = makeBar(1.75, 0xffb23f, "Aortic P");
    totBar = makeBar(2.20, 0xf43f5e, "Vent. P");
    [keBar, peBar, totBar].forEach(function (b) { b.parent.visible = false; });
    barBase.visible = false;

    api.rect = function (part) {
      if (part === "bars") return stage.rectOf([keBar, peBar, totBar], 14);
      return stage.rectOf([heartGroup, valveGroup], 16);
    };

    stage.start();
  }

  function setMode(m) {
    state.mode = m;
    state.highV = false;
    root.querySelectorAll(".seg [data-mode]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-mode") === m ? "true" : "false");
    });
    if (m === "acid") toast("Atrial Systole (0.10 s): SAN fires in right atrium → both atria contract → AV valves OPEN, Semilunar valves CLOSED!");
    else if (m === "base") toast("Ventricular Systole (0.30 s): Impulse sweeps up Purkinje fibres → AV valves snap shut ('LUB'!) → Semilunar valves forced OPEN at 120 mmHg!");
    else toast("Complete 0.80 s Cardiac Cycle at 75 bpm: Atrial Systole (0.10 s) → Ventricular Systole (0.30 s) → General Diastole (0.40 s).");
  }

  function toggleDiastole() {
    state.highV = !state.highV;
    toast(state.highV
      ? "General Diastole (0.40 s): Semilunar valves snap shut ('DUB'!) as ventricles relax; aortic elastic recoil sustains 80 mmHg diastolic pressure!"
      : "Live Pacemaker Cycle resumed.");
  }

  function reset() {
    state.highV = false;
    setMode("mix");
    toast("Stage reset to full 0.80 s cardiac cycle.");
  }

  function wireButtons() {
    root.querySelectorAll(".seg [data-mode]").forEach(function (b) {
      b.addEventListener("click", function () { setMode(b.getAttribute("data-mode")); });
    });
    var addBtn = document.getElementById("zoom-add");
    if (addBtn) addBtn.addEventListener("click", toggleDiastole);
    var rstBtn = document.getElementById("zoom-reset");
    if (rstBtn) rstBtn.addEventListener("click", reset);
  }

  function frame(dt, t) {
    if (!heartGroup) return;
    // phase buttons freeze the 75 bpm heart in that phase; "Full cycle" runs it live
    var hold = state.highV ? 0.75 : state.mode === "acid" ? 0.09 : state.mode === "base" ? 0.36 : null;
    if (heartApi) { heartApi.userData.setState({ hold: hold }); heartApi.tick(dt, t); }
    var ph = heartApi && heartApi.userData.phase != null ? heartApi.userData.phase : 0;
    var phase = ph >= 0.02 && ph < 0.17 ? "atrial" : ph >= 0.2 && ph < 0.56 ? "vent" : "diastole";
    var durS = phase === "atrial" ? 0.10 : phase === "vent" ? 0.30 : 0.40;
    var aortP = phase === "vent" ? 120 : 80;
    var ventP = phase === "vent" ? 120 : phase === "atrial" ? 12 : 8;
    var avOpen = heartApi && heartApi.userData.beat ? heartApi.userData.beat.avOpen : 0.5;

    if (valveApi && valveApi.userData && valveApi.userData.setState) {
      valveApi.userData.setState({ open: avOpen });
      valveApi.tick(dt, t);
    }

    if (keBar) keBar.scale.y = Math.max(0.10, durS / 0.85);
    if (peBar) peBar.scale.y = Math.max(0.10, aortP / 130.0);
    if (totBar) totBar.scale.y = Math.max(0.08, ventP / 130.0);

    var cV = document.querySelector('#zoom-counters [data-c="h"]');
    var cI = document.querySelector('#zoom-counters [data-c="oh"]');
    var cR = document.querySelector('#zoom-counters [data-c="na"]');
    var cT = document.querySelector('#zoom-counters [data-c="cl"]');
    var cP = document.querySelector('#zoom-counters [data-c="w"]');
    if (cV) cV.textContent = (hold == null ? "t = " + (ph * 0.8).toFixed(2) + " of 0.80 s" : durS.toFixed(2) + " s");
    if (cI) cI.textContent = phase === "atrial" ? "Atria contract (SAN)" : phase === "vent" ? "'LUB' then pumping" : "'DUB' · filling";
    if (cR) cR.textContent = avOpen > 0.5 ? "Open" : "Closed";
    if (cT) cT.textContent = phase === "vent" ? "Open" : "Closed";
    if (cP) cP.textContent = "120/80 mmHg";
  }
})();
