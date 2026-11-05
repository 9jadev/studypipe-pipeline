/* Lesson 01 · 3D Wavefront Pivoting & Wavelength Compression Zoom */
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
    mode: "mix", // "mix" = Crown Glass (n=1.50, i=45°), "acid" = Normal Incidence (i=0°), "base" = Diamond (n=2.42, i=45°)
    greenLaser: false
  };

  var highlightPart = null;
  var api = {
    setMode: setMode,
    add: toggleLaserColour,
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
    pitch: 0.24,
    yaw: 0.06,
    fitWidth: 6.2,
    distance: 6.0,
    onFrame: frame
  });

  var waveGroup, airFronts = [], glassFronts = [], glassBlockMesh, keBar, peBar, totBar;

  if (stage) build();
  wireButtons();

  function build() {
    var scene = stage.rig;

    waveGroup = new THREE.Group();
    waveGroup.position.set(-0.75, 0.85, 0);
    scene.add(waveGroup);

    // Boundary line (horizontal plane at y = 0 in waveGroup)
    var boundMesh = new THREE.Mesh(
      new THREE.BoxGeometry(2.6, 0.03, 0.9),
      new THREE.MeshBasicMaterial({ color: 0xfbbf24 })
    );
    waveGroup.add(boundMesh);

    // Lower half: Optically denser medium (Glass / Diamond)
    glassBlockMesh = new THREE.Mesh(
      new THREE.BoxGeometry(2.6, 1.05, 0.85),
      new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.25,
        roughness: 0.15,
        depthWrite: false
      })
    );
    glassBlockMesh.position.set(0, -0.54, 0);
    waveGroup.add(glassBlockMesh);

    // Marching wavefront bars in Air (top half) and Glass (bottom half)
    var airMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 0.65 });
    var glassMat = new THREE.MeshStandardMaterial({ color: 0x3ee6c4, emissive: 0x0d9c7e, emissiveIntensity: 0.75 });

    for (var i = 0; i < 6; i++) {
      var af = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.045, 0.55), airMat);
      waveGroup.add(af);
      airFronts.push({ mesh: af, u: i / 6 });

      var gf = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.045, 0.55), glassMat);
      waveGroup.add(gf);
      glassFronts.push({ mesh: gf, u: i / 6 });
    }

    var lTag = SceneKit.labelTexture("Wavefronts: Air (v = c, λ₀) → Glass (v = c/n, λ₀/n)", { size: 28, bg: "rgba(13,156,126,0.92)" });
    var lSpr = new THREE.Sprite(new THREE.SpriteMaterial({ map: lTag, transparent: true, depthWrite: false }));
    lSpr.scale.set(0.21 * lTag.userData.aspect, 0.21, 1);
    lSpr.position.set(-0.75, 1.82, 0);
    scene.add(lSpr);

    // 3D Live Pillars on the right (Speed v, Wavelength λ, Frequency f)
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

    keBar  = makeBar(1.05, 0x3ee6c4, "Speed v");
    peBar  = makeBar(1.55, 0xffb23f, "λ (nm)");
    totBar = makeBar(2.05, 0xa855f7, "Freq f");

    updateReadouts();
    stage.start();
  }

  function updateReadouts() {
    var n = state.mode === "base" ? 2.42 : 1.50;
    var iDeg = state.mode === "acid" ? 0 : 45;
    var rDeg = iDeg === 0 ? 0 : (Math.asin(Math.sin(iDeg * Math.PI / 180) / n) * 180 / Math.PI);
    var lamAir = state.greenLaser ? 540 : 600;
    var fTHz = state.greenLaser ? "556" : "500";
    var vGlass = (3.0 / n).toFixed(2);
    var lamGlass = Math.round(lamAir / n);

    var ctrs = document.getElementById("zoom-counters");
    if (ctrs) {
      var setC = function (k, v) {
        var el = ctrs.querySelector('[data-c="' + k + '"]');
        if (el) el.textContent = v;
      };
      setC("h", n.toFixed(2));
      setC("oh", vGlass + "e8");
      setC("na", lamGlass + " nm");
      setC("cl", fTHz + " THz");
      setC("w", rDeg.toFixed(1) + "°");
    }

    if (keBar && peBar && totBar) {
      keBar.scale.y = 1 / n;
      keBar.position.y = keBar.scale.y * 0.5;
      peBar.scale.y = (lamGlass / 600);
      peBar.position.y = peBar.scale.y * 0.5;
      totBar.scale.y = 1.0; // Frequency stays strictly constant!
      totBar.position.y = 0.5;
    }
  }

  function setMode(mode) {
    state.mode = mode || "mix";
    root.querySelectorAll("[data-mode]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-mode") === state.mode ? "true" : "false");
    });
    updateReadouts();
    if (state.mode === "acid") {
      toast("Normal Incidence (i = 0°): Whole wavefront enters glass together — speed and λ drop by 1.50×, but r = 0°!");
    } else if (state.mode === "base") {
      toast("Diamond (n = 2.42): Wavefronts slow to 1.24 × 10⁸ m s⁻¹ and pivot sharply to r = 17.0°!");
    } else {
      toast("Crown Glass (n = 1.50, i = 45°): Speed drops to 2.0 × 10⁸ m s⁻¹, λ compresses to 400 nm, and r = 28.1°.");
    }
  }

  function toggleLaserColour() {
    state.greenLaser = !state.greenLaser;
    var btn = document.getElementById("zoom-add");
    if (btn) btn.textContent = state.greenLaser ? "Switch to 600 nm Orange-Red Laser" : "Switch to 540 nm Green Laser";
    updateReadouts();
    toast(state.greenLaser
      ? "540 nm Green Laser (f = 5.56 × 10¹⁴ Hz): inside glass λ compresses to 360 nm while f stays constant!"
      : "600 nm Orange-Red Laser (f = 5.00 × 10¹⁴ Hz): inside glass λ compresses to 400 nm while f stays constant!");
  }

  function reset() {
    state.mode = "mix";
    state.greenLaser = false;
    var btn = document.getElementById("zoom-add");
    if (btn) btn.textContent = "Switch to 540 nm Green Laser";
    setMode("mix");
  }

  function wireButtons() {
    root.querySelectorAll("[data-mode]").forEach(function (b) {
      b.addEventListener("click", function () { setMode(b.getAttribute("data-mode")); });
    });
    var addBtn = document.getElementById("zoom-add");
    var resBtn = document.getElementById("zoom-reset");
    if (addBtn) addBtn.addEventListener("click", toggleLaserColour);
    if (resBtn) resBtn.addEventListener("click", reset);
  }

  function frame(dt) {
    var n = state.mode === "base" ? 2.42 : 1.50;
    var iRad = state.mode === "acid" ? 0 : (45 * Math.PI / 180);
    var rRad = iRad === 0 ? 0 : Math.asin(Math.sin(iRad) / n);

    for (var i = 0; i < airFronts.length; i++) {
      airFronts[i].u = (airFronts[i].u + dt * 0.42) % 1;
      var ua = airFronts[i].u;
      var distA = (1 - ua) * 0.92;
      airFronts[i].mesh.position.set(-distA * Math.sin(iRad), distA * Math.cos(iRad) + 0.05, 0);
      airFronts[i].mesh.rotation.z = -iRad;

      glassFronts[i].u = (glassFronts[i].u + dt * 0.42) % 1;
      var ug = glassFronts[i].u;
      // Compressed spacing by factor n inside the medium!
      var distG = ug * (0.92 / n);
      glassFronts[i].mesh.position.set(distG * Math.sin(rRad), -distG * Math.cos(rRad) - 0.05, 0);
      glassFronts[i].mesh.rotation.z = -rRad;
    }
  }
})();
