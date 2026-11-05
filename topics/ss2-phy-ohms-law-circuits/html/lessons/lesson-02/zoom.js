/* Lesson 02 · 3D Inside the Cell Electrolyte Zoom — ions migrating between lead plates and internal voltage drop Ir */
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
    mode: "mix", // "mix" = Starter Load (I = 3.0 A, V = 8.4 V, Ir = 3.6 V), "acid" = Open Circuit (I = 0, V = 12.0 V), "base" = Short Circuit (I = 10.0 A, V = 0 V)
    freshAcid: false
  };

  var highlightPart = null;
  var api = {
    setMode: setMode,
    add: toggleAcid,
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
    yaw: 0.05,
    fitWidth: 6.2,
    distance: 6.0,
    onFrame: frame
  });

  var tankGroup, ions = [], keBar, peBar, totBar;

  if (stage) build();
  wireButtons();

  function build() {
    var scene = stage.rig;

    tankGroup = new THREE.Group();
    tankGroup.position.set(-0.75, 0.90, 0);
    scene.add(tankGroup);

    // Translucent acid tank
    var tank = new THREE.Mesh(
      new THREE.BoxGeometry(2.2, 1.25, 0.9),
      new THREE.MeshStandardMaterial({ color: 0x0ea5e9, transparent: true, opacity: 0.16, roughness: 0.2, depthWrite: false })
    );
    tankGroup.add(tank);

    // Positive PbO2 plate (left, red-brown) and Negative Pb plate (right, slate)
    var platePos = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 1.15, 0.72),
      new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.4, metalness: 0.5 })
    );
    platePos.position.x = -0.82;
    tankGroup.add(platePos);

    var plateNeg = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 1.15, 0.72),
      new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.4, metalness: 0.5 })
    );
    plateNeg.position.x = 0.82;
    tankGroup.add(plateNeg);

    // Migrating electrolyte ions (amber H+ and teal SO4^2-)
    var posIonMat = new THREE.MeshStandardMaterial({ color: 0xffb23f, emissive: 0xd97706, emissiveIntensity: 0.65 });
    var negIonMat = new THREE.MeshStandardMaterial({ color: 0x3ee6c4, emissive: 0x0d9488, emissiveIntensity: 0.65 });
    for (var i = 0; i < 16; i++) {
      var isPos = i % 2 === 0;
      var m = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 12), isPos ? posIonMat : negIonMat);
      var ix = -0.65 + (i / 16) * 1.30;
      var iy = -0.40 + ((i * 3) % 5) * 0.20;
      var iz = -0.22 + ((i * 7) % 3) * 0.22;
      m.position.set(ix, iy, iz);
      tankGroup.add(m);
      ions.push({ mesh: m, u: i / 16, dir: isPos ? 1 : -1, iy: iy, seed: i * 1.9 });
    }

    var tTag = SceneKit.labelTexture("Cell Electrolyte (Internal r)", { size: 30, bg: "rgba(200,38,74,0.92)" });
    var tSpr = new THREE.Sprite(new THREE.SpriteMaterial({ map: tTag, transparent: true, depthWrite: false }));
    tSpr.scale.set(0.21 * tTag.userData.aspect, 0.21, 1);
    tSpr.position.set(-0.75, 1.72, 0);
    scene.add(tSpr);

    // 3D Live Voltage Partition Pillars on the right: E (12 V), Terminal V (IR), Lost v (Ir)
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

    totBar = makeBar(1.10, 0x7cc4ff, "E");
    keBar  = makeBar(1.55, 0x3ee6c4, "V");
    peBar  = makeBar(2.00, 0xf43f5e, "Ir");

    api.rect = function (part) {
      if (part === "bars") return stage.rectOf([totBar, keBar, peBar], 14);
      return stage.rectOf(tankGroup, 16);
    };

    stage.start();
  }

  function setMode(m) {
    state.mode = m;
    root.querySelectorAll(".seg [data-mode]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-mode") === m ? "true" : "false");
    });
    var r = state.freshAcid ? 0.6 : 1.2;
    if (m === "acid") toast("Open Circuit (I = 0 A): No ion drift, Lost Volts Ir = 0 V, so Terminal V = E = 12.0 V!");
    else if (m === "base") toast("Short Circuit (R = 0 Ω): Current surges to I_max = E/r = " + (12 / r).toFixed(1) + " A, Terminal V = 0 V, all 12.0 V becomes internal heat!");
    else { var I = 12 / (2.8 + r); toast("Starter Load (R = 2.8 Ω): Terminal V = " + (I * 2.8).toFixed(2) + " V + Lost Ir = " + (I * r).toFixed(2) + " V = 12.0 V EMF."); }
  }

  function toggleAcid() {
    state.freshAcid = !state.freshAcid;
    var r = state.freshAcid ? 0.6 : 1.2, I = 12 / (2.8 + r);
    var tail = state.mode === "acid" ? " (Key open: I = 0, so V = E either way.)" : state.mode === "base" ? " Short-circuit current I_max = E/r = " + (12 / r).toFixed(1) + " A." : " Starter load: I = " + I.toFixed(2) + " A, lost Ir = " + (I * r).toFixed(2) + " V, terminal V = " + (I * 2.8).toFixed(2) + " V.";
    toast((state.freshAcid ? "Fresh electrolyte (r halved to 0.6 Ω)." : "Standard workshop battery (r = 1.2 Ω).") + tail);
  }

  function reset() {
    state.freshAcid = false;
    setMode("mix");
    toast("Electrolyte zoom reset to E = 12.0 V, r = 1.2 Ω.");
  }

  function wireButtons() {
    root.querySelectorAll(".seg [data-mode]").forEach(function (b) {
      b.addEventListener("click", function () { setMode(b.getAttribute("data-mode")); });
    });
    var addBtn = document.getElementById("zoom-add");
    if (addBtn) addBtn.addEventListener("click", toggleAcid);
    var rstBtn = document.getElementById("zoom-reset");
    if (rstBtn) rstBtn.addEventListener("click", reset);
  }

  function frame(dt, t) {
    if (!tankGroup) return;

    var E = 12.0;
    var r = state.freshAcid ? 0.60 : 1.20;
    var R = 2.80;
    var I = 0;

    if (state.mode === "acid") {
      I = 0;
    } else if (state.mode === "base") {
      R = 0;
      I = E / r;
    } else {
      R = 2.80;
      I = E / (R + r);
    }

    var V = I * R;
    var lost = I * r;

    var speed = 0.08 * I;
    for (var i = 0; i < ions.length; i++) {
      var ion = ions[i];
      ion.u = (ion.u + speed * dt * ion.dir + 1) % 1;
      ion.mesh.position.x = -0.65 + ion.u * 1.30;
      ion.mesh.position.y = ion.iy + Math.sin(t * 6 + ion.seed) * 0.03;
    }

    if (totBar) totBar.scale.y = 1.0;
    if (keBar) keBar.scale.y = Math.max(0.03, V / E);
    if (peBar) peBar.scale.y = Math.max(0.03, lost / E);

    var cE = document.querySelector('#zoom-counters [data-c="h"]');
    var cV = document.querySelector('#zoom-counters [data-c="oh"]');
    var cLost = document.querySelector('#zoom-counters [data-c="na"]');
    var cI = document.querySelector('#zoom-counters [data-c="cl"]');
    var cr = document.querySelector('#zoom-counters [data-c="w"]');
    if (cE) cE.textContent = E.toFixed(1);
    if (cV) cV.textContent = V.toFixed(2);
    if (cLost) cLost.textContent = lost.toFixed(2);
    if (cI) cI.textContent = I.toFixed(2);
    if (cr) cr.textContent = r.toFixed(2);
  }
})();
