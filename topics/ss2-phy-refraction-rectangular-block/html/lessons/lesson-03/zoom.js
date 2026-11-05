/* Lesson 03 · 3D Virtual-Image Ray Cone & Multi-Layer Apparent Depth Zoom */
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
    mode: "mix", // "mix" = Crown Glass (R=6 cm, A=4 cm), "acid" = Water (R=6 cm, A=4.5 cm), "base" = 2-Layer (6 cm Glass + 8 cm Water -> A=10 cm)
    thickSlab: false
  };

  var highlightPart = null;
  var api = {
    setMode: setMode,
    add: toggleSlabThickness,
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

  var coneGroup, slabMesh, topWaterMesh, rayHolder, keBar, peBar, totBar;

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

    coneGroup = new THREE.Group();
    coneGroup.position.set(-0.75, 0.78, 0);
    scene.add(coneGroup);

    slabMesh = new THREE.Mesh(
      new THREE.BoxGeometry(2.1, 1.1, 0.75),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.26, roughness: 0.14, depthWrite: false })
    );
    slabMesh.position.set(0, -0.15, 0);
    coneGroup.add(slabMesh);

    topWaterMesh = new THREE.Mesh(
      new THREE.BoxGeometry(2.1, 0.45, 0.75),
      new THREE.MeshStandardMaterial({ color: 0x818cf8, transparent: true, opacity: 0.26, roughness: 0.14, depthWrite: false })
    );
    topWaterMesh.position.set(0, 0.625, 0);
    topWaterMesh.visible = false;
    coneGroup.add(topWaterMesh);

    rayHolder = new THREE.Group();
    coneGroup.add(rayHolder);

    var lTag = SceneKit.labelTexture("Ray Cone: Real Object O → Refracted Rays → Virtual Image I", { size: 26, bg: "rgba(13,156,126,0.92)" });
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

    keBar  = makeBar(1.05, 0x38bdf8, "Real R");
    peBar  = makeBar(1.55, 0x3ee6c4, "App A");
    totBar = makeBar(2.05, 0xf43f5e, "Shift d_v");

    rebuildCone();
    stage.start();
  }

  function rebuildCone() {
    while (rayHolder.children.length) rayHolder.remove(rayHolder.children[0]);

    var n = state.mode === "acid" ? 1.333 : 1.50;
    var R = state.mode === "base" ? 14.0 : (state.thickSlab ? 9.0 : 6.0);
    var A = state.mode === "base" ? 10.0 : (R / n);
    var dv = R - A;

    topWaterMesh.visible = (state.mode === "base");
    slabMesh.material.color.setHex(state.mode === "acid" ? 0x67e8f9 : 0x38bdf8);

    var yBot = -0.68;
    var yTop = state.mode === "base" ? 0.85 : 0.40;
    var fracA = A / R;
    var yVirt = yTop - (yTop - yBot) * fracA;

    var pO = new THREE.Vector3(0, yBot, 0);
    var pI = new THREE.Vector3(0, yVirt, 0);
    var pSurfL = new THREE.Vector3(-0.36, yTop, 0);
    var pSurfR = new THREE.Vector3(0.36, yTop, 0);
    var pEyeL = new THREE.Vector3(-0.68, yTop + 0.48, 0);
    var pEyeR = new THREE.Vector3(0.68, yTop + 0.48, 0);

    // Real object sphere O (amber) and Virtual image sphere I (cyan)
    var oSphere = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 14), new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 0.7 }));
    oSphere.position.copy(pO);
    var iSphere = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 14), new THREE.MeshStandardMaterial({ color: 0x3ee6c4, emissive: 0x0d9c7e, emissiveIntensity: 0.9 }));
    iSphere.position.copy(pI);
    rayHolder.add(oSphere, iSphere);

    // Real rays inside slab (amber)
    rayHolder.add(makeBeam(pO, pSurfL, 0.022, 0xf59e0b, 1.0));
    rayHolder.add(makeBeam(pO, pSurfR, 0.022, 0xf59e0b, 1.0));
    // Refracted rays bending AWAY from normal into air (green)
    rayHolder.add(makeBeam(pSurfL, pEyeL, 0.024, 0x10b981, 1.0));
    rayHolder.add(makeBeam(pSurfR, pEyeR, 0.024, 0x10b981, 1.0));
    // Backward virtual extensions meeting at I (cyan)
    rayHolder.add(makeBeam(pI, pSurfL, 0.016, 0x3ee6c4, 0.65));
    rayHolder.add(makeBeam(pI, pSurfR, 0.016, 0x3ee6c4, 0.65));
    // Vertical shift segment O -> I (pink/red)
    rayHolder.add(makeBeam(pO, pI, 0.024, 0xf43f5e, 0.95));

    var ctrs = document.getElementById("zoom-counters");
    if (ctrs) {
      var setC = function (k, v) {
        var el = ctrs.querySelector('[data-c="' + k + '"]');
        if (el) el.textContent = v;
      };
      setC("h", R.toFixed(1) + " cm");
      setC("oh", A.toFixed(2) + " cm");
      setC("na", dv.toFixed(2) + " cm");
      setC("cl", state.mode === "base" ? "2 Layers" : ("n = " + n.toFixed(2)));
      setC("w", (A / R * 100).toFixed(0) + "% R");
    }

    if (keBar && peBar && totBar) {
      keBar.scale.y = Math.min(1.15, R / 10);
      keBar.position.y = keBar.scale.y * 0.5;
      peBar.scale.y = Math.min(1.15, A / 10);
      peBar.position.y = peBar.scale.y * 0.5;
      totBar.scale.y = Math.min(1.15, dv / 5);
      totBar.position.y = totBar.scale.y * 0.5;
    }
  }

  function setMode(mode) {
    state.mode = mode || "mix";
    root.querySelectorAll("[data-mode]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-mode") === state.mode ? "true" : "false");
    });
    rebuildCone();
    if (state.mode === "acid") {
      toast("Water (n = 4/3 = 1.33): Apparent depth A = ¾ R, and upward shift d_v = ¼ R.");
    } else if (state.mode === "base") {
      toast("2-Layer Tank (6 cm Glass + 8 cm Water): A_total = 6.0/1.50 + 8.0/1.333 = 4.0 + 6.0 = 10.0 cm!");
    } else {
      toast("Crown Glass (n = 3/2 = 1.50): Apparent depth A = ⅔ R, and upward shift d_v = ⅓ R.");
    }
  }

  function toggleSlabThickness() {
    state.thickSlab = !state.thickSlab;
    var btn = document.getElementById("zoom-add");
    if (btn) btn.textContent = state.thickSlab ? "Switch to R = 6.0 cm Slab" : "Increase Real Depth R (6.0 → 9.0 cm)";
    rebuildCone();
    toast(state.thickSlab
      ? "Real depth R increased to 9.0 cm: Apparent depth A = 6.0 cm and upward shift d_v = 3.0 cm!"
      : "Real depth R = 6.0 cm restored: Apparent depth A = 4.0 cm and upward shift d_v = 2.0 cm.");
  }

  function reset() {
    state.mode = "mix";
    state.thickSlab = false;
    var btn = document.getElementById("zoom-add");
    if (btn) btn.textContent = "Increase Real Depth R (6.0 → 9.0 cm)";
    setMode("mix");
  }

  function wireButtons() {
    root.querySelectorAll("[data-mode]").forEach(function (b) {
      b.addEventListener("click", function () { setMode(b.getAttribute("data-mode")); });
    });
    var addBtn = document.getElementById("zoom-add");
    var resBtn = document.getElementById("zoom-reset");
    if (addBtn) addBtn.addEventListener("click", toggleSlabThickness);
    if (resBtn) resBtn.addEventListener("click", reset);
  }

  function frame() {}
})();
