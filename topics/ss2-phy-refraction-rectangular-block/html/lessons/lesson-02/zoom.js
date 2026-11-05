/* Lesson 02 · 3D Parallel-Normal & Red/Violet Dispersion Zoom (Rectangular Block vs Triangular Prism) */
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
    mode: "mix", // "mix" = Monochromatic Parallel Normals (e=i), "acid" = White Light in Rect Block (Parallel Red/Violet), "base" = White Light in 60° Prism (Angular Fan)
    thickMode: false
  };

  var highlightPart = null;
  var api = {
    setMode: setMode,
    add: toggleThickness,
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
    yaw: 0.05,
    fitWidth: 6.2,
    distance: 6.0,
    onFrame: frame
  });

  var opticsGroup, blockMesh, prismMesh, rayHolder, keBar, peBar, totBar;

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

    opticsGroup = new THREE.Group();
    opticsGroup.position.set(-0.75, 0.85, 0);
    scene.add(opticsGroup);

    blockMesh = new THREE.Mesh(
      new THREE.BoxGeometry(2.2, 0.95, 0.7),
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.28, roughness: 0.14, depthWrite: false })
    );
    opticsGroup.add(blockMesh);

    prismMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.95, 0.95, 0.7, 3),
      new THREE.MeshStandardMaterial({ color: 0xa5b4fc, transparent: true, opacity: 0.30, roughness: 0.14, depthWrite: false })
    );
    prismMesh.rotation.x = Math.PI / 2;
    prismMesh.visible = false;
    opticsGroup.add(prismMesh);

    rayHolder = new THREE.Group();
    opticsGroup.add(rayHolder);

    var lTag = SceneKit.labelTexture("Parallel Normals (e = i) & Red/Violet Paths", { size: 28, bg: "rgba(13,156,126,0.92)" });
    var lSpr = new THREE.Sprite(new THREE.SpriteMaterial({ map: lTag, transparent: true, depthWrite: false }));
    lSpr.scale.set(0.21 * lTag.userData.aspect, 0.21, 1);
    lSpr.position.set(-0.75, 1.82, 0);
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

    keBar  = makeBar(1.05, 0xf43f5e, "Shift d_r");
    peBar  = makeBar(1.55, 0xa855f7, "Shift d_v");
    totBar = makeBar(2.05, 0x3ee6c4, "Ang Dev");

    rebuildRays();
    stage.start();
  }

  function rebuildRays() {
    while (rayHolder.children.length) rayHolder.remove(rayHolder.children[0]);
    var hScale = state.thickMode ? 1.35 : 1.0;
    blockMesh.scale.set(1, hScale, 1);

    if (state.mode === "base") {
      // 60° Triangular Prism angular dispersion
      blockMesh.visible = false;
      prismMesh.visible = true;
      var pIn = new THREE.Vector3(-1.35, -0.25, 0);
      var pHit = new THREE.Vector3(-0.35, 0.12, 0);
      var pRedMid = new THREE.Vector3(0.35, 0.04, 0);
      var pVioMid = new THREE.Vector3(0.35, -0.08, 0);
      var pRedOut = new THREE.Vector3(1.35, -0.32, 0);
      var pVioOut = new THREE.Vector3(1.35, -0.72, 0);
      rayHolder.add(makeBeam(pIn, pHit, 0.032, 0xfef08a, 1.0));
      rayHolder.add(makeBeam(pHit, pRedMid, 0.024, 0xef4444, 1.0));
      rayHolder.add(makeBeam(pHit, pVioMid, 0.024, 0xa855f7, 1.0));
      rayHolder.add(makeBeam(pRedMid, pRedOut, 0.028, 0xef4444, 1.0));
      rayHolder.add(makeBeam(pVioMid, pVioOut, 0.028, 0xa855f7, 1.0));
    } else {
      blockMesh.visible = true;
      prismMesh.visible = false;
      var topY = 0.475 * hScale;
      var botY = -0.475 * hScale;
      var pStart = new THREE.Vector3(-1.15, topY + 0.55, 0);
      var pO = new THREE.Vector3(-0.45, topY, 0);
      rayHolder.add(makeBeam(pStart, pO, 0.032, 0xfef08a, 1.0));

      if (state.mode === "acid") {
        // White light splitting into parallel Red (n=1.51) and Violet (n=1.53) rays
        var pNRed = new THREE.Vector3(0.18 * hScale, botY, 0);
        var pNVio = new THREE.Vector3(0.05 * hScale, botY, 0);
        rayHolder.add(makeBeam(pO, pNRed, 0.024, 0xef4444, 1.0));
        rayHolder.add(makeBeam(pO, pNVio, 0.024, 0xa855f7, 1.0));
        rayHolder.add(makeBeam(pNRed, new THREE.Vector3(pNRed.x + 0.70, botY - 0.55, 0), 0.026, 0xef4444, 1.0));
        rayHolder.add(makeBeam(pNVio, new THREE.Vector3(pNVio.x + 0.70, botY - 0.55, 0), 0.026, 0xa855f7, 1.0));
      } else {
        // Single monochromatic ray with parallel normals and alternate angles r1 = i2
        var pN = new THREE.Vector3(0.12 * hScale, botY, 0);
        var pEnd = new THREE.Vector3(pN.x + 0.70, botY - 0.55, 0);
        var pGhost = new THREE.Vector3(-0.45 + 1.85, topY - 1.45, 0);
        rayHolder.add(makeBeam(pO, pN, 0.030, 0x38bdf8, 1.0));
        rayHolder.add(makeBeam(pN, pEnd, 0.030, 0x10b981, 1.0));
        rayHolder.add(makeBeam(pO, pGhost, 0.014, 0xfbbf24, 0.4));
      }
    }

    var tCm = state.thickMode ? 9.0 : 6.0;
    var dRed = (tCm * 0.330).toFixed(2);
    var dVio = (tCm * 0.342).toFixed(2);
    var devTxt = state.mode === "base" ? "42.5° Fan" : "0.0° (e=i)";

    var ctrs = document.getElementById("zoom-counters");
    if (ctrs) {
      var setC = function (k, v) {
        var el = ctrs.querySelector('[data-c="' + k + '"]');
        if (el) el.textContent = v;
      };
      setC("h", tCm.toFixed(1) + " cm");
      setC("oh", dRed + " cm");
      setC("na", dVio + " cm");
      setC("cl", devTxt);
      setC("w", state.mode === "base" ? "Diverging" : "Parallel");
    }

    if (keBar && peBar && totBar) {
      keBar.scale.y = state.thickMode ? 0.95 : 0.65;
      keBar.position.y = keBar.scale.y * 0.5;
      peBar.scale.y = state.thickMode ? 1.05 : 0.72;
      peBar.position.y = peBar.scale.y * 0.5;
      totBar.scale.y = state.mode === "base" ? 0.95 : 0.08;
      totBar.position.y = totBar.scale.y * 0.5;
    }
  }

  function setMode(mode) {
    state.mode = mode || "mix";
    root.querySelectorAll("[data-mode]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-mode") === state.mode ? "true" : "false");
    });
    rebuildRays();
    if (state.mode === "acid") {
      toast("White Light in Rectangular Block: Violet (n_v = 1.53) shifts slightly more than Red (n_r = 1.51), but both emerge parallel!");
    } else if (state.mode === "base") {
      toast("60° Triangular Prism: Inclined faces bend red and violet towards the base twice, creating a diverging rainbow fan!");
    } else {
      toast("Parallel Normals in Rectangular Block: Alternate interior angles r₁ = i₂ force e = i (zero net angular deviation).");
    }
  }

  function toggleThickness() {
    state.thickMode = !state.thickMode;
    var btn = document.getElementById("zoom-add");
    if (btn) btn.textContent = state.thickMode ? "Switch to t = 6.0 cm Block" : "Increase Thickness t (6.0 → 9.0 cm)";
    rebuildRays();
    toast(state.thickMode
      ? "Thickness increased to 9.0 cm: Lateral displacement d increases proportionally from 1.98 cm to 2.97 cm!"
      : "Standard 6.0 cm thickness restored (d = 1.98 cm at i = 45°).");
  }

  function reset() {
    state.mode = "mix";
    state.thickMode = false;
    var btn = document.getElementById("zoom-add");
    if (btn) btn.textContent = "Increase Thickness t (6.0 → 9.0 cm)";
    setMode("mix");
  }

  function wireButtons() {
    root.querySelectorAll("[data-mode]").forEach(function (b) {
      b.addEventListener("click", function () { setMode(b.getAttribute("data-mode")); });
    });
    var addBtn = document.getElementById("zoom-add");
    var resBtn = document.getElementById("zoom-reset");
    if (addBtn) addBtn.addEventListener("click", toggleThickness);
    if (resBtn) resBtn.addEventListener("click", reset);
  }

  function frame() {}
})();
