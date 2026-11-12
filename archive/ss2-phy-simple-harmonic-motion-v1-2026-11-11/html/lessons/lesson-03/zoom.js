/* Lesson 01 · 3D Vector & Energy Zoom Stage — live velocity vector (teal), acceleration vector (amber), and 3D KE/PE/Total Energy pillars */
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
    mode: "mix", // "mix" = Live SHM, "acid" = Freeze at Centre (x = 0), "base" = Freeze at Extreme (x = +A)
    damped: false,
    ampFactor: 1.0,
    phase: 0
  };

  var highlightPart = null;
  var api = {
    setMode: setMode,
    add: toggleDamping,
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
    yaw: 0,
    fitWidth: 6.2,
    distance: 6.2,
    onFrame: frame
  });

  var pivotGroup, bobGroup, vArrow, aArrow, keBar, peBar, totBar;
  var PIVOT_Y = 2.05;
  var ROD_LEN = 1.35;

  if (stage) build();
  wireButtons();

  function makeArrow(colorHex) {
    var g = new THREE.Group();
    var mat = new THREE.MeshBasicMaterial({ color: colorHex });
    var shaftGeo = new THREE.CylinderGeometry(0.028, 0.028, 1, 12);
    shaftGeo.translate(0, 0.5, 0);
    var shaft = new THREE.Mesh(shaftGeo, mat);
    shaft.rotation.z = -Math.PI / 2;
    g.add(shaft);

    var head = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.18, 16), mat);
    head.rotation.z = -Math.PI / 2;
    head.position.x = 1;
    g.add(head);

    g.userData.setVec = function (signedLen) {
      var abs = Math.abs(signedLen);
      if (abs < 0.03) {
        g.visible = false;
        return;
      }
      g.visible = true;
      var dir = signedLen >= 0 ? 1 : -1;
      g.scale.x = dir;
      shaft.scale.y = abs;
      head.position.x = abs;
    };
    return g;
  }

  function build() {
    var scene = stage.rig;

    // Reference equilibrium dashed vertical post at x = 0
    var eqLine = new THREE.Mesh(
      new THREE.CylinderGeometry(0.01, 0.01, 2.0, 8),
      new THREE.MeshBasicMaterial({ color: 0x3ee6c4, transparent: true, opacity: 0.35 })
    );
    eqLine.position.set(-0.7, 1.0, -0.15);
    scene.add(eqLine);

    var eqTag = SceneKit.labelTexture("x = 0 (equilibrium)", { size: 32, bg: "rgba(13,156,126,0.88)" });
    var eqSpr = new THREE.Sprite(new THREE.SpriteMaterial({ map: eqTag, transparent: true, depthWrite: false }));
    eqSpr.scale.set(0.21 * eqTag.userData.aspect, 0.21, 1);
    eqSpr.position.set(-0.7, 0.15, 0);
    scene.add(eqSpr);

    // Oscillator pivot at (-0.7, PIVOT_Y, 0)
    pivotGroup = new THREE.Group();
    pivotGroup.position.set(-0.7, PIVOT_Y, 0);
    scene.add(pivotGroup);

    var strGeo = new THREE.CylinderGeometry(0.012, 0.012, ROD_LEN, 12);
    strGeo.translate(0, -ROD_LEN / 2, 0);
    var str = new THREE.Mesh(strGeo, new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.4 }));
    pivotGroup.add(str);

    bobGroup = new THREE.Group();
    bobGroup.position.y = -ROD_LEN;
    var bob = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 32, 24),
      new THREE.MeshStandardMaterial({ color: 0xffb23f, roughness: 0.2, metalness: 0.85 })
    );
    bobGroup.add(bob);
    pivotGroup.add(bobGroup);

    // Velocity arrow (teal) and Acceleration arrow (amber) in world space following the bob
    vArrow = makeArrow(0x3ee6c4);
    aArrow = makeArrow(0xffb23f);
    scene.add(vArrow);
    scene.add(aArrow);

    var vTag = SceneKit.labelTexture("v (velocity)", { size: 30, bg: "rgba(13,156,126,0.92)" });
    var vSpr = new THREE.Sprite(new THREE.SpriteMaterial({ map: vTag, transparent: true, depthWrite: false }));
    vSpr.scale.set(0.19 * vTag.userData.aspect, 0.19, 1);
    vSpr.position.set(0, 0.22, 0);
    vArrow.add(vSpr);

    var aTag = SceneKit.labelTexture("a = −ω²x (restoring)", { size: 30, bg: "rgba(217,138,0,0.92)" });
    var aSpr = new THREE.Sprite(new THREE.SpriteMaterial({ map: aTag, transparent: true, depthWrite: false }));
    aSpr.scale.set(0.19 * aTag.userData.aspect, 0.19, 1);
    aSpr.position.set(0, -0.22, 0);
    aArrow.add(aSpr);

    // 3D Live Energy Pillars on the right (x = 1.1 to 2.1)
    var barBase = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.06, 0.5),
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

    keBar  = makeBar(1.10, 0x9b8cff, "KE");
    peBar  = makeBar(1.55, 0xc6f36b, "PE");
    totBar = makeBar(2.00, 0x7cc4ff, "Total E");

    api.rect = function (part) {
      if (part === "bob" || part === "vectors") return stage.rectOf([bobGroup, vArrow, aArrow], 16);
      if (part === "bars") return stage.rectOf([keBar, peBar, totBar], 14);
      return stage.rectOf(pivotGroup, 12);
    };

    stage.start();
  }

  function setMode(m) {
    state.mode = m;
    root.querySelectorAll(".seg [data-mode]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-mode") === m ? "true" : "false");
    });
    if (m === "acid") toast("Frozen at equilibrium (x = 0): Speed v and KE are MAXIMUM; acceleration a and PE are ZERO.");
    else if (m === "base") toast("Frozen at right extreme (x = +A): Speed v is ZERO; inward acceleration a and PE are MAXIMUM.");
    else toast("Live Simple Harmonic Motion: watch KE and PE trade places twice every cycle.");
  }

  function toggleDamping() {
    state.damped = !state.damped;
    if (!state.damped) state.ampFactor = 1.0;
    toast(state.damped ? "Air damping ON: amplitude and total energy decay gradually while period stays constant." : "Air damping OFF: undamped SHM with constant mechanical energy.");
  }

  function reset() {
    state.damped = false;
    state.ampFactor = 1.0;
    state.phase = 0;
    setMode("mix");
    toast("Oscillator reset to full amplitude (A = 0.10 m).");
  }

  function wireButtons() {
    root.querySelectorAll(".seg [data-mode]").forEach(function (b) {
      b.addEventListener("click", function () { setMode(b.getAttribute("data-mode")); });
    });
    var addBtn = document.getElementById("zoom-add");
    if (addBtn) addBtn.addEventListener("click", toggleDamping);
    var rstBtn = document.getElementById("zoom-reset");
    if (rstBtn) rstBtn.addEventListener("click", reset);
  }

  function frame(dt) {
    if (!pivotGroup) return;
    var omega = 2.6;
    if (state.mode === "mix") {
      state.phase += dt * omega;
      if (state.damped) {
        state.ampFactor = Math.max(0.15, state.ampFactor * (1 - 0.12 * dt));
      } else {
        state.ampFactor = 1.0;
      }
    } else if (state.mode === "acid") {
      // Equilibrium centre x = 0, moving rightward (cos = 1, sin = 0)
      state.phase = 0;
      state.ampFactor = 1.0;
    } else if (state.mode === "base") {
      // Right extreme x = +A (sin = 1, cos = 0)
      state.phase = Math.PI / 2;
      state.ampFactor = 1.0;
    }

    var s = Math.sin(state.phase) * state.ampFactor; // normalized displacement x / A0 in [-1, 1]
    var c = Math.cos(state.phase) * state.ampFactor; // normalized velocity v / vmax in [-1, 1]

    var maxAngle = 0.42;
    pivotGroup.rotation.z = s * maxAngle;

    var bobWorld = new THREE.Vector3();
    bobGroup.getWorldPosition(bobWorld);

    vArrow.position.set(bobWorld.x, bobWorld.y + 0.24, bobWorld.z + 0.18);
    aArrow.position.set(bobWorld.x, bobWorld.y - 0.24, bobWorld.z + 0.18);

    vArrow.userData.setVec(c * 0.95);
    aArrow.userData.setVec(-s * 0.95); // restoring acceleration always opposite to displacement s!

    var peFrac = s * s;
    var keFrac = c * c;
    var totFrac = peFrac + keFrac;

    if (keBar) keBar.scale.y = Math.max(0.03, keFrac);
    if (peBar) peBar.scale.y = Math.max(0.03, peFrac);
    if (totBar) totBar.scale.y = Math.max(0.03, totFrac);

    // Update live counters in .stage-bar (A = 0.10 m, ω = 4.0 rad/s => vmax = 0.40 m/s, amax = 1.60 m/s²)
    var cA = document.querySelector('#zoom-counters [data-c="h"]');
    var cV = document.querySelector('#zoom-counters [data-c="oh"]');
    var cKE = document.querySelector('#zoom-counters [data-c="na"]');
    var cPE = document.querySelector('#zoom-counters [data-c="cl"]');
    var cTot = document.querySelector('#zoom-counters [data-c="w"]');
    if (cA) cA.textContent = (Math.abs(s) * 1.60).toFixed(2);
    if (cV) cV.textContent = (Math.abs(c) * 0.40).toFixed(2);
    if (cKE) cKE.textContent = Math.round(keFrac * 100);
    if (cPE) cPE.textContent = Math.round(peFrac * 100);
    if (cTot) cTot.textContent = Math.round(totFrac * 100);
  }
})();
