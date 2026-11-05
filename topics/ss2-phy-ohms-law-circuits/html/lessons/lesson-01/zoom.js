/* Lesson 01 · 3D Atomic Lattice & Electron Drift Zoom — free electrons colliding with vibrating metal ions */
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
    mode: "mix", // "mix" = Ohmic Wire (300 K), "acid" = Hot Tungsten (2200 K), "base" = Double Area (2× d)
    highV: false,
    phase: 0
  };

  var highlightPart = null;
  var api = {
    setMode: setMode,
    add: toggleVoltage,
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
    target: new THREE.Vector3(0, 0.9, 0),
    pitch: 0.18,
    yaw: 0.06,
    fitWidth: 6.2,
    distance: 6.0,
    onFrame: frame
  });

  var wireTubeGroup, latticeIons = [], electrons = [], keBar, peBar, totBar;

  if (stage) build();
  wireButtons();

  function build() {
    var scene = stage.rig;

    wireTubeGroup = new THREE.Group();
    wireTubeGroup.position.set(-0.75, 0.95, 0);
    scene.add(wireTubeGroup);

    // Translucent cylindrical conductor shell
    var cylGeo = new THREE.CylinderGeometry(0.55, 0.55, 2.3, 28, 1, true);
    cylGeo.rotateZ(Math.PI / 2);
    var cylMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.16,
      roughness: 0.2,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    var shell = new THREE.Mesh(cylGeo, cylMat);
    wireTubeGroup.add(shell);

    // 3D Lattice of positive metal ions (amber spheres)
    var ionMat = new THREE.MeshStandardMaterial({ color: 0xffb23f, emissive: 0xd97706, emissiveIntensity: 0.35, roughness: 0.25, metalness: 0.6 });
    var xs = [-0.85, -0.42, 0.0, 0.42, 0.85];
    var ys = [-0.24, 0.24];
    var zs = [-0.22, 0.22];
    xs.forEach(function (x, xi) {
      ys.forEach(function (y, yi) {
        zs.forEach(function (z, zi) {
          var m = new THREE.Mesh(new THREE.SphereGeometry(0.095, 18, 14), ionMat);
          m.position.set(x, y, z);
          wireTubeGroup.add(m);
          latticeIons.push({
            mesh: m,
            bx: x, by: y, bz: z,
            seed: (xi * 7 + yi * 13 + zi * 23)
          });
        });
      });
    });

    // Drifting free electrons (cyan spheres)
    var eMat = new THREE.MeshStandardMaterial({ color: 0x3ee6c4, emissive: 0x0d9c7e, emissiveIntensity: 0.85, roughness: 0.2 });
    for (var i = 0; i < 18; i++) {
      var eMesh = new THREE.Mesh(new THREE.SphereGeometry(0.048, 14, 12), eMat);
      var ex = -1.05 + (i / 18) * 2.1;
      var ey = (Math.sin(i * 2.3) * 0.32);
      var ez = (Math.cos(i * 3.1) * 0.32);
      eMesh.position.set(ex, ey, ez);
      wireTubeGroup.add(eMesh);
      electrons.push({ mesh: eMesh, u: i / 18, ey: ey, ez: ez, seed: i * 1.7 });
    }

    var lTag = SceneKit.labelTexture("Lattice Ions (+) & Free Electrons (e⁻)", { size: 30, bg: "rgba(13,156,126,0.92)" });
    var lSpr = new THREE.Sprite(new THREE.SpriteMaterial({ map: lTag, transparent: true, depthWrite: false }));
    lSpr.scale.set(0.21 * lTag.userData.aspect, 0.21, 1);
    lSpr.position.set(-0.75, 1.75, 0);
    scene.add(lSpr);

    // 3D Live Pillars on the right (Current I, Resistance R, Ion Vibration T)
    var barBase = new THREE.Mesh(
      new THREE.BoxGeometry(1.65, 0.06, 0.5),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 })
    );
    barBase.position.set(1.55, 0.22, 0);
    scene.add(barBase);

    function makeBar(xPos, colorHex, label) {
      var g = new THREE.Group();
      g.position.set(xPos, 0.25, 0);
      var geo = new THREE.BoxGeometry(0.28, 1.35, 0.28);
      geo.translate(0, 0.675, 0);
      var mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.3, metalness: 0.2 }));
      g.add(mesh);

      var t = SceneKit.labelTexture(label, { size: 32, bg: "rgba(10,15,29,0.88)" });
      var s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false }));
      s.scale.set(0.20 * t.userData.aspect, 0.20, 1);
      s.position.set(0, -0.18, 0.15);
      g.add(s);

      scene.add(g);
      return mesh;
    }

    keBar  = makeBar(1.10, 0x3ee6c4, "Current I");
    peBar  = makeBar(1.55, 0xffb23f, "Resist. R");
    totBar = makeBar(2.00, 0xf43f5e, "Temp T");

    api.rect = function (part) {
      if (part === "bars") return stage.rectOf([keBar, peBar, totBar], 14);
      return stage.rectOf(wireTubeGroup, 16);
    };

    stage.start();
  }

  function setMode(m) {
    state.mode = m;
    root.querySelectorAll(".seg [data-mode]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-mode") === m ? "true" : "false");
    });
    if (m === "acid") toast("Hot Filament (2200 K): Violent lattice ion vibrations scatter electrons and raise resistance R!");
    else if (m === "base") toast("Double Diameter (2d → 4× Area): Wider conductor channel slashes resistance R to one-quarter!");
    else toast("Constantan Wire (300 K): Steady lattice temperature keeps R constant so I is proportional to V.");
  }

  function toggleVoltage() {
    state.highV = !state.highV;
    toast(state.highV ? "Potential difference doubled (V = 4.4 V): Electric field doubles electron drift speed!" : "Potential difference set to V = 2.2 V.");
  }

  function reset() {
    state.highV = false;
    setMode("mix");
    toast("Lattice reset to 300 K constantan reference.");
  }

  function wireButtons() {
    root.querySelectorAll(".seg [data-mode]").forEach(function (b) {
      b.addEventListener("click", function () { setMode(b.getAttribute("data-mode")); });
    });
    var addBtn = document.getElementById("zoom-add");
    if (addBtn) addBtn.addEventListener("click", toggleVoltage);
    var rstBtn = document.getElementById("zoom-reset");
    if (rstBtn) rstBtn.addEventListener("click", reset);
  }

  function frame(dt, t) {
    if (!wireTubeGroup) return;

    var V = state.highV ? 4.40 : 2.20;
    var R = 2.20;
    var tempK = 300;
    var vibAmp = 0.015;

    if (state.mode === "acid") {
      // Hot tungsten filament: temperature rises, so R rises from 2.20 to 5.50 Ω
      R = state.highV ? 5.50 : 3.60;
      tempK = state.highV ? 2400 : 1600;
      vibAmp = 0.068;
      wireTubeGroup.scale.set(1, 1, 1);
    } else if (state.mode === "base") {
      // Double diameter: R drops to ¼ (0.55 Ω)
      R = 0.55;
      tempK = 300;
      vibAmp = 0.015;
      wireTubeGroup.scale.set(1, 1.32, 1.32);
    } else {
      R = 2.20;
      tempK = 300;
      vibAmp = 0.015;
      wireTubeGroup.scale.set(1, 1, 1);
    }

    var I = V / R;
    var driftSpeed = 0.22 * I;

    for (var i = 0; i < latticeIons.length; i++) {
      var ion = latticeIons[i];
      ion.mesh.position.x = ion.bx + Math.sin(t * 18 + ion.seed) * vibAmp;
      ion.mesh.position.y = ion.by + Math.cos(t * 21 + ion.seed) * vibAmp;
      ion.mesh.position.z = ion.bz + Math.sin(t * 15 + ion.seed * 0.5) * vibAmp;
    }

    for (var j = 0; j < electrons.length; j++) {
      var el = electrons[j];
      el.u = (el.u + driftSpeed * dt) % 1;
      el.mesh.position.x = -1.05 + el.u * 2.10;
      var jitter = state.mode === "acid" ? 0.08 : 0.02;
      el.mesh.position.y = el.ey + Math.sin(t * 14 + el.seed) * jitter;
    }

    if (keBar) keBar.scale.y = Math.max(0.05, Math.min(1.0, I / 8.0));
    if (peBar) peBar.scale.y = Math.max(0.05, Math.min(1.0, R / 6.0));
    if (totBar) totBar.scale.y = Math.max(0.05, Math.min(1.0, tempK / 2500));

    var cV = document.querySelector('#zoom-counters [data-c="h"]');
    var cI = document.querySelector('#zoom-counters [data-c="oh"]');
    var cR = document.querySelector('#zoom-counters [data-c="na"]');
    var cT = document.querySelector('#zoom-counters [data-c="cl"]');
    var cP = document.querySelector('#zoom-counters [data-c="w"]');
    if (cV) cV.textContent = V.toFixed(2);
    if (cI) cI.textContent = I.toFixed(2);
    if (cR) cR.textContent = R.toFixed(2);
    if (cT) cT.textContent = tempK;
    if (cP) cP.textContent = (V * I).toFixed(1);
  }
})();
