/* Lesson 04 · 3D 45°–45°–90° Prism Periscope vs Thick Mirror Ghost Images & Mirage Zoom */
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
    mode: "mix", // "mix" = 45° Prism Periscope (90° Turn, 100% TIR), "acid" = Thick Silvered Mirror (Multiple Ghost Images!), "base" = Hot-Asphalt Mirage (Curved TIR)
    turn180: false
  };

  var highlightPart = null;
  var api = {
    setMode: setMode,
    add: togglePrismMode,
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
    pitch: 0.20,
    yaw: 0.05,
    fitWidth: 6.2,
    distance: 6.0,
    onFrame: frame
  });

  var stageGroup, rayHolder, keBar, peBar, totBar;

  if (stage) build();
  wireButtons();

  function makeBeam(p1, p2, radius, colorHex, opacity) {
    var dir = new THREE.Vector3().subVectors(p2, p1);
    var len = dir.length();
    if (len < 0.001) return new THREE.Group();
    var geom = new THREE.CylinderGeometry(radius, radius, len, 12);
    var mat = new THREE.MeshStandardMaterial({
      color: colorHex,
      emissive: colorHex,
      emissiveIntensity: 0.65,
      transparent: opacity < 1,
      opacity: opacity || 1,
      roughness: 0.2
    });
    var mesh = new THREE.Mesh(geom, mat);
    var mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
    mesh.position.copy(mid);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
    return mesh;
  }

  function build() {
    var scene = stage.rig;

    stageGroup = new THREE.Group();
    stageGroup.position.set(-0.75, 0.85, 0);
    scene.add(stageGroup);

    rayHolder = new THREE.Group();
    stageGroup.add(rayHolder);

    var lTag = SceneKit.labelTexture("45° Prism TIR (100% Single Image) vs Thick Mirror Ghosts", { size: 26, bg: "rgba(13,156,126,0.92)" });
    var lSpr = new THREE.Sprite(new THREE.SpriteMaterial({ map: lTag, transparent: true, depthWrite: false }));
    lSpr.scale.set(0.21 * lTag.userData.aspect, 0.21, 1);
    lSpr.position.set(-0.75, 1.85, 0);
    scene.add(lSpr);

    var barBase = new THREE.Mesh(
      new THREE.BoxGeometry(1.65, 0.06, 0.5),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 })
    );
    barBase.position.set(1.55, 0.22, 0);
    scene.add(barBase);

    function makeBar(xPos, colorHex, label) {
      var g = new THREE.Group();
      g.position.set(xPos, 0.25, 0);
      var m = new THREE.Mesh(
        new THREE.BoxGeometry(0.32, 1.0, 0.28),
        new THREE.MeshStandardMaterial({ color: colorHex, emissive: colorHex, emissiveIntensity: 0.35, roughness: 0.3 })
      );
      m.position.y = 0.5;
      g.add(m);
      var t = SceneKit.labelTexture(label, { size: 28, bg: "rgba(10,15,29,0.88)" });
      var s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false }));
      s.scale.set(0.18 * t.userData.aspect, 0.18, 1);
      s.position.set(0, -0.16, 0.18);
      g.add(s);
      scene.add(g);
      return m;
    }

    keBar  = makeBar(1.05, 0x10b981, "Brightness");
    peBar  = makeBar(1.55, 0xf43f5e, "Ghosts");
    totBar = makeBar(2.05, 0x38bdf8, "Angle i");

    rebuildScene();
    stage.start();
  }

  function rebuildScene() {
    while (rayHolder.children.length) rayHolder.remove(rayHolder.children[0]);

    if (state.mode === "acid") {
      // Thick silvered glass mirror producing multiple ghost reflections
      var mirrorGlass = new THREE.Mesh(
        new THREE.BoxGeometry(1.9, 0.45, 0.6),
        new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.28 })
      );
      mirrorGlass.position.set(0, -0.25, 0);
      var silverBack = new THREE.Mesh(
        new THREE.BoxGeometry(1.9, 0.05, 0.62),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.15 })
      );
      silverBack.position.set(0, -0.49, 0);
      rayHolder.add(mirrorGlass, silverBack);

      // Incident beam + Front ghost reflection + Main reflection + Second ghost reflection
      var pIn = new THREE.Vector3(-0.95, 0.55, 0);
      var pHit1 = new THREE.Vector3(-0.35, -0.025, 0);
      var pBot1 = new THREE.Vector3(-0.05, -0.46, 0);
      var pTop2 = new THREE.Vector3(0.25, -0.025, 0);
      var pBot2 = new THREE.Vector3(0.55, -0.46, 0);
      var pTop3 = new THREE.Vector3(0.85, -0.025, 0);

      rayHolder.add(makeBeam(pIn, pHit1, 0.032, 0xf59e0b, 1.0));
      rayHolder.add(makeBeam(pHit1, new THREE.Vector3(0.15, 0.55, 0), 0.015, 0xf43f5e, 0.55)); // Ghost 1
      rayHolder.add(makeBeam(pHit1, pBot1, 0.028, 0x38bdf8, 0.9));
      rayHolder.add(makeBeam(pBot1, pTop2, 0.028, 0x10b981, 0.9));
      rayHolder.add(makeBeam(pTop2, new THREE.Vector3(0.75, 0.55, 0), 0.028, 0x10b981, 0.85)); // Main image
      rayHolder.add(makeBeam(pTop2, pBot2, 0.014, 0xf43f5e, 0.5));
      rayHolder.add(makeBeam(pBot2, pTop3, 0.014, 0xf43f5e, 0.5));
      rayHolder.add(makeBeam(pTop3, new THREE.Vector3(1.25, 0.55, 0), 0.014, 0xf43f5e, 0.5)); // Ghost 2
    } else if (state.mode === "base") {
      // Hot-asphalt Mirage: upward curved TIR above hot road
      var road = new THREE.Mesh(
        new THREE.BoxGeometry(2.3, 0.12, 0.7),
        new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 })
      );
      road.position.set(0, -0.55, 0);
      rayHolder.add(road);

      var mPts = [
        new THREE.Vector3(-1.05, 0.55, 0),
        new THREE.Vector3(-0.55, 0.08, 0),
        new THREE.Vector3(0.0, -0.32, 0),
        new THREE.Vector3(0.55, 0.08, 0),
        new THREE.Vector3(1.05, 0.55, 0)
      ];
      for (var i = 0; i < mPts.length - 1; i++) {
        rayHolder.add(makeBeam(mPts[i], mPts[i + 1], 0.030, i < 2 ? 0xf59e0b : 0x3ee6c4, 1.0));
      }
      // Virtual pool reflection below road
      rayHolder.add(makeBeam(new THREE.Vector3(0, -0.32, 0), new THREE.Vector3(-0.65, -0.75, 0), 0.016, 0x38bdf8, 0.55));
    } else {
      // 45°–45°–90° Crown Glass Prism (90° periscope turn or 180° binocular turn)
      var prism = new THREE.Mesh(
        new THREE.CylinderGeometry(0.75, 0.75, 0.55, 3),
        new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.34, roughness: 0.14 })
      );
      prism.rotation.x = Math.PI / 2;
      rayHolder.add(prism);

      if (state.turn180) {
        var p1 = new THREE.Vector3(-1.15, 0.22, 0);
        var p2 = new THREE.Vector3(0.15, 0.22, 0);
        var p3 = new THREE.Vector3(0.15, -0.22, 0);
        var p4 = new THREE.Vector3(-1.15, -0.22, 0);
        rayHolder.add(makeBeam(p1, p2, 0.030, 0xf59e0b, 1.0));
        rayHolder.add(makeBeam(p2, p3, 0.030, 0x3ee6c4, 1.0));
        rayHolder.add(makeBeam(p3, p4, 0.030, 0x10b981, 1.0));
      } else {
        var q1 = new THREE.Vector3(-1.15, 0.10, 0);
        var q2 = new THREE.Vector3(0.05, 0.10, 0);
        var q3 = new THREE.Vector3(0.05, -0.85, 0);
        rayHolder.add(makeBeam(q1, q2, 0.032, 0xf59e0b, 1.0));
        rayHolder.add(makeBeam(q2, q3, 0.032, 0x10b981, 1.0));
      }
    }

    var ctrs = document.getElementById("zoom-counters");
    if (ctrs) {
      var setC = function (k, v) {
        var el = ctrs.querySelector('[data-c="' + k + '"]');
        if (el) el.textContent = v;
      };
      setC("h", state.mode === "acid" ? "~80%" : "100% TIR");
      setC("oh", state.mode === "acid" ? "3 Ghosts!" : "0 Ghosts");
      setC("na", state.mode === "base" ? "i > c (Air)" : "i = 45° > c");
      setC("cl", "c = 41.8°");
      setC("w", state.turn180 ? "180° Turn" : "90° Turn");
    }

    if (keBar && peBar && totBar) {
      keBar.scale.y = state.mode === "acid" ? 0.72 : 1.05;
      keBar.position.y = keBar.scale.y * 0.5;
      peBar.scale.y = state.mode === "acid" ? 0.95 : 0.06;
      peBar.position.y = peBar.scale.y * 0.5;
      totBar.scale.y = 0.85;
      totBar.position.y = 0.425;
    }
  }

  function setMode(mode) {
    state.mode = mode || "mix";
    root.querySelectorAll("[data-mode]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-mode") === state.mode ? "true" : "false");
    });
    rebuildScene();
    if (state.mode === "acid") {
      toast("Thick Silvered Mirror: Front glass surface + back silver coating create blurred multiple ghost images!");
    } else if (state.mode === "base") {
      toast("Hot-Asphalt Mirage: Sky rays bend through warm low-density air layers until i > c and reflect upward by TIR!");
    } else {
      toast("45°–45°–90° Crown-Glass Prism: Since i = 45° > c = 41.8°, 100% TIR occurs with zero ghost images!");
    }
  }

  function togglePrismMode() {
    state.turn180 = !state.turn180;
    var btn = document.getElementById("zoom-add");
    if (btn) btn.textContent = state.turn180 ? "Switch to 90° Periscope Turn" : "Switch to 180° Binocular Double-TIR";
    rebuildScene();
    toast(state.turn180
      ? "180° Binocular Prism Mode: Two successive 45° Total Internal Reflections turn the ray through 180°!"
      : "90° Periscope Prism Mode: Single 45° Total Internal Reflection turns the ray through 90°.");
  }

  function reset() {
    state.mode = "mix";
    state.turn180 = false;
    var btn = document.getElementById("zoom-add");
    if (btn) btn.textContent = "Switch to 180° Binocular Double-TIR";
    setMode("mix");
  }

  function wireButtons() {
    root.querySelectorAll("[data-mode]").forEach(function (b) {
      b.addEventListener("click", function () { setMode(b.getAttribute("data-mode")); });
    });
    var addBtn = document.getElementById("zoom-add");
    var resBtn = document.getElementById("zoom-reset");
    if (addBtn) addBtn.addEventListener("click", togglePrismMode);
    if (resBtn) resBtn.addEventListener("click", reset);
  }

  function frame() {}
})();
