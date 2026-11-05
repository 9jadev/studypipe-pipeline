/* Lesson 05 · 3D Pin-Base vs Pin-Top & Right-Triangle LN₀E Decoder Zoom */
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
    mode: "mix", // "mix" = Triangle LN₀E (w, LE = w tan r, LN = w sec r), "acid" = Pin Base vs Tilted Pin Top, "base" = Curved cos i vs cos r Point (x₁, y₁)
    showSecant: false
  };

  var highlightPart = null;
  var api = {
    setMode: setMode,
    add: toggleSecantMode,
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
    yaw: 0.06,
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

    var lTag = SceneKit.labelTexture("Triangle LN₀E (LE = w tan r, LN = w sec r) & Pin-Base Alignment", { size: 26, bg: "rgba(13,156,126,0.92)" });
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

    keBar  = makeBar(1.05, 0x38bdf8, "w (6.0 cm)");
    peBar  = makeBar(1.55, 0xf59e0b, "LE (tan r)");
    totBar = makeBar(2.05, 0x10b981, "LN (sec r)");

    rebuildScene();
    stage.start();
  }

  function rebuildScene() {
    while (rayHolder.children.length) rayHolder.remove(rayHolder.children[0]);

    if (state.mode === "acid") {
      // Pin Base vs Tilted Pin Top comparison
      var board = new THREE.Mesh(
        new THREE.BoxGeometry(2.1, 0.10, 0.8),
        new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 })
      );
      board.position.set(0, -0.45, 0);
      rayHolder.add(board);

      // True optical ray line on paper
      rayHolder.add(makeBeam(new THREE.Vector3(-0.95, -0.39, 0), new THREE.Vector3(0.95, -0.39, 0), 0.024, 0x22c55e, 1.0));

      // Upright Pin P3 vs Tilted Pin P4 (showing base on green line, top off line)
      var pinUpright = makeBeam(new THREE.Vector3(-0.45, -0.39, 0), new THREE.Vector3(-0.45, 0.45, 0), 0.022, 0x38bdf8, 1.0);
      var pinTilted  = makeBeam(new THREE.Vector3(0.35, -0.39, 0), new THREE.Vector3(0.72, 0.42, 0), 0.022, 0xf43f5e, 1.0);
      rayHolder.add(pinUpright, pinTilted);
    } else if (state.mode === "base") {
      // Variant C: Non-linear Curve cos i vs cos r
      var axesX = makeBeam(new THREE.Vector3(-0.95, -0.45, 0), new THREE.Vector3(0.95, -0.45, 0), 0.018, 0x94a3b8, 0.9);
      var axesY = makeBeam(new THREE.Vector3(-0.95, -0.45, 0), new THREE.Vector3(-0.95, 0.65, 0), 0.018, 0x94a3b8, 0.9);
      rayHolder.add(axesX, axesY);

      var cPts = [
        new THREE.Vector3(-0.95, 0.18, 0),
        new THREE.Vector3(-0.45, 0.25, 0),
        new THREE.Vector3(0.05, 0.36, 0),
        new THREE.Vector3(0.50, 0.50, 0),
        new THREE.Vector3(0.85, 0.65, 0)
      ];
      for (var i = 0; i < cPts.length - 1; i++) {
        rayHolder.add(makeBeam(cPts[i], cPts[i + 1], 0.028, 0xf59e0b, 1.0));
      }
      var ptMarker = new THREE.Mesh(
        new THREE.SphereGeometry(0.065, 16, 14),
        new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x10b981, emissiveIntensity: 0.8 })
      );
      ptMarker.position.copy(cPts[2]);
      rayHolder.add(ptMarker);
    } else {
      // Internal Right-Angled Triangle LN0E inside rectangular glass block
      var slab = new THREE.Mesh(
        new THREE.BoxGeometry(2.0, 1.15, 0.45),
        new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.28, roughness: 0.14 })
      );
      slab.position.set(0, 0.0, 0);
      rayHolder.add(slab);

      var vL = new THREE.Vector3(-0.45, 0.55, 0);
      var vN0 = new THREE.Vector3(-0.45, -0.55, 0);
      var vE = new THREE.Vector3(0.45, -0.55, 0);

      rayHolder.add(makeBeam(vL, vN0, 0.032, 0x38bdf8, 1.0)); // w = LN0
      rayHolder.add(makeBeam(vN0, vE, 0.032, 0xf59e0b, 1.0)); // LE = w tan r
      rayHolder.add(makeBeam(vL, vE, 0.036, 0x10b981, 1.0));  // LN = w sec r
    }

    var ctrs = document.getElementById("zoom-counters");
    if (ctrs) {
      var setC = function (k, v) {
        var el = ctrs.querySelector('[data-c="' + k + '"]');
        if (el) el.textContent = v;
      };
      setC("h", "w = 6.0 cm");
      setC("oh", state.showSecant ? "LE = 3.56 cm" : "LE = 2.12 cm");
      setC("na", state.showSecant ? "LN = 6.98 cm" : "LN = 6.36 cm");
      setC("cl", state.showSecant ? "LE/LN = 0.511" : "LE/LN = 0.333");
      setC("w", state.mode === "acid" ? "Align Bases!" : state.mode === "base" ? "Curve (x₁,y₁)" : "Slope = w");
    }

    if (keBar && peBar && totBar) {
      keBar.scale.y = 0.85;
      keBar.position.y = 0.425;
      peBar.scale.y = state.showSecant ? 0.62 : 0.38;
      peBar.position.y = peBar.scale.y * 0.5;
      totBar.scale.y = state.showSecant ? 1.02 : 0.92;
      totBar.position.y = totBar.scale.y * 0.5;
    }
  }

  function setMode(mode) {
    state.mode = mode || "mix";
    root.querySelectorAll("[data-mode]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-mode") === state.mode ? "true" : "false");
    });
    rebuildScene();
    if (state.mode === "acid") {
      toast("Pin-Base vs Tilted Top: Even when a pin tilts, its base on the paper stays on the green ray path!");
    } else if (state.mode === "base") {
      toast("Variant C (cos i vs cos r): Non-linear curve! Read a point (x₁, y₁) and use n = √[(1 − x₁²)/(1 − y₁²)].");
    } else {
      toast("Internal Right-Angled Triangle LN₀E: LE = w tan r, LN = w sec r, and LE / LN = sin r!");
    }
  }

  function toggleSecantMode() {
    state.showSecant = !state.showSecant;
    var btn = document.getElementById("zoom-add");
    if (btn) btn.textContent = state.showSecant ? "Switch to i = 30° (r = 19.5°)" : "Switch to i = 50° (r = 30.7°)";
    rebuildScene();
    toast(state.showSecant
      ? "At i = 50° (r = 30.7°): LE = 6.0 tan 30.7° = 3.56 cm, LN = 6.0 sec 30.7° = 6.98 cm, LE/LN = 0.511 = sin r!"
      : "At i = 30° (r = 19.5°): LE = 6.0 tan 19.5° = 2.12 cm, LN = 6.0 sec 19.5° = 6.36 cm, LE/LN = 0.333 = sin r!");
  }

  function reset() {
    state.mode = "mix";
    state.showSecant = false;
    var btn = document.getElementById("zoom-add");
    if (btn) btn.textContent = "Switch to i = 50° (r = 30.7°)";
    setMode("mix");
  }

  function wireButtons() {
    root.querySelectorAll("[data-mode]").forEach(function (b) {
      b.addEventListener("click", function () { setMode(b.getAttribute("data-mode")); });
    });
    var addBtn = document.getElementById("zoom-add");
    var resBtn = document.getElementById("zoom-reset");
    if (addBtn) addBtn.addEventListener("click", toggleSecantMode);
    if (resBtn) resBtn.addEventListener("click", reset);
  }

  function frame() {}
})();
