/* ==========================================================
   StudyPipe — Welcome Hub 3D Hero Lab (Simple Pendulum & SHM)
   Exposes window.StudyLab for StudyNarrator 3D spotlighting & actions
   ========================================================== */
(function () {
  "use strict";
  var canvas = document.getElementById("lab-canvas");
  if (!canvas || typeof THREE === "undefined") return;

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(36, 1, 0.1, 50);
  camera.position.set(1.6, 1.35, 3.35);

  var controls = THREE.OrbitControls ? new THREE.OrbitControls(camera, canvas) : null;
  if (controls) {
    controls.target.set(0, 0.95, 0);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 2.0;
    controls.maxDistance = 5.2;
    controls.maxPolarAngle = Math.PI * 0.52;
    controls.update();
  }

  // Studio lights
  scene.add(new THREE.HemisphereLight(0xeef6ff, 0x1a2234, 0.9));
  var key = new THREE.DirectionalLight(0xfff5e4, 1.35);
  key.position.set(2.8, 4.5, 3.2);
  key.castShadow = true;
  scene.add(key);
  var rim = new THREE.DirectionalLight(0x22d3ee, 0.55);
  rim.position.set(-2.5, 2.2, -2.0);
  scene.add(rim);

  // Materials
  var woodMat = new THREE.MeshStandardMaterial({ color: 0x3b2618, roughness: 0.72, metalness: 0.05 });
  var metalMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.3, metalness: 0.8 });
  var brassMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.22, metalness: 0.88 });
  var corkMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.85, metalness: 0.05 });
  var stringMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5, metalness: 0.1 });
  var fidMat = new THREE.MeshStandardMaterial({ color: 0x14b8a6, emissive: 0x0d9488, emissiveIntensity: 0.35, roughness: 0.3 });

  // Bench top
  var table = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.12, 1.8), woodMat);
  table.position.set(0, -0.06, 0);
  table.receiveShadow = true;
  scene.add(table);

  // Retort stand
  var standGroup = new THREE.Group();
  var base = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.06, 0.45), metalMat);
  base.position.set(-0.55, 0.03, 0);
  standGroup.add(base);
  var rod = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 2.05, 20), metalMat);
  rod.position.set(-0.55, 1.05, 0);
  standGroup.add(rod);
  var bossArm = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.62, 16), metalMat);
  bossArm.rotation.z = Math.PI / 2;
  bossArm.position.set(-0.26, 1.88, 0);
  standGroup.add(bossArm);
  scene.add(standGroup);

  // Split cork at pivot (0, 1.88, 0)
  var PIVOT_Y = 1.88;
  var corkGroup = new THREE.Group();
  corkGroup.position.set(0, PIVOT_Y, 0);
  var corkL = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.11, 0.09), corkMat);
  corkL.position.x = -0.03;
  var corkR = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.11, 0.09), corkMat);
  corkR.position.x = 0.03;
  corkGroup.add(corkL, corkR);
  scene.add(corkGroup);

  // Fiducial mark at x = 0
  var fidGroup = new THREE.Group();
  var fidBase = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 0.03, 18), metalMat);
  fidBase.position.set(0, 0.015, -0.18);
  var fidLine = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.95, 0.022), fidMat);
  fidLine.position.set(0, 0.48, -0.18);
  fidGroup.add(fidBase, fidLine);
  scene.add(fidGroup);

  // Stopwatch on bench right
  var swGroup = new THREE.Group();
  swGroup.position.set(0.72, 0.08, 0.25);
  var swBody = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.06, 28), metalMat);
  swBody.rotation.x = -Math.PI * 0.32;
  var swFace = new THREE.Mesh(
    new THREE.CylinderGeometry(0.15, 0.15, 0.065, 28),
    new THREE.MeshStandardMaterial({ color: 0x0f172a, emissive: 0x0ea5e9, emissiveIntensity: 0.22 })
  );
  swFace.rotation.x = -Math.PI * 0.32;
  swGroup.add(swBody, swFace);
  scene.add(swGroup);

  // Pendulum assembly
  var pendPivot = new THREE.Group();
  pendPivot.position.set(0, PIVOT_Y, 0);
  scene.add(pendPivot);

  var stringMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 1.0, 12), stringMat);
  pendPivot.add(stringMesh);

  var bobMesh = new THREE.Mesh(new THREE.SphereGeometry(0.095, 28, 22), brassMat);
  bobMesh.castShadow = true;
  pendPivot.add(bobMesh);

  // Equilibrium arc indicator
  var arcMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.35, side: THREE.DoubleSide });
  var arcMesh = new THREE.Mesh(new THREE.RingGeometry(1.12, 1.145, 32, 1, -Math.PI * 0.62, Math.PI * 0.24), arcMat);
  arcMesh.position.set(0, PIVOT_Y, -0.02);
  scene.add(arcMesh);

  var parts = {
    stand: standGroup,
    cork: corkGroup,
    string: stringMesh,
    bob: bobMesh,
    fiducial: fidGroup,
    stopwatch: swGroup
  };

  // Simulation state
  var lengths = [0.50, 0.80, 1.00];
  var lenIdx = 1; // default 0.80 m
  var G_LAGOS = 9.78;
  var state = {
    L: lengths[lenIdx],
    running: true,
    timing: false,
    swings: 0,
    targetSwings: 20,
    elapsed: 0,
    theta0: 0.22, // ~12.6 deg visual
    phase: 0,
    completedOnce: false
  };

  var elVol = document.getElementById("val-vol");
  var elPh = document.getElementById("val-ph");
  var elStatus = document.getElementById("val-status");
  var elToast = document.getElementById("endpoint-toast");
  var btnRelease = document.getElementById("btn-drop");
  var btnLength = document.getElementById("btn-stream");
  var btnReset = document.getElementById("btn-reset");

  function syncPendulumGeometry() {
    var visualLen = 0.72 + state.L * 0.68; // maps 0.50..1.00 m nicely inside 1.88 m stand
    stringMesh.scale.set(1, visualLen, 1);
    stringMesh.position.set(0, -visualLen / 2, 0);
    bobMesh.position.set(0, -visualLen, 0);
  }
  syncPendulumGeometry();

  function periodFor(L) {
    return 2 * Math.PI * Math.sqrt(L / G_LAGOS);
  }

  function updateHUD() {
    var T = periodFor(state.L);
    if (elVol) elVol.textContent = (state.L * 100).toFixed(0) + " cm (" + state.L.toFixed(2) + " m)";
    if (elPh) elPh.textContent = T.toFixed(2) + " s";
    if (elStatus) {
      if (state.timing) {
        elStatus.textContent = "Timing: " + state.swings + " / 20 (" + state.elapsed.toFixed(1) + " s)";
        elStatus.className = "hud-v status-near";
      } else if (state.completedOnce) {
        elStatus.textContent = "g = " + G_LAGOS.toFixed(2) + " m s⁻² · T = " + T.toFixed(2) + " s";
        elStatus.className = "hud-v status-end";
      } else {
        elStatus.textContent = "Swinging freely (θ < 10°)";
        elStatus.className = "hud-v status-acid";
      }
    }
  }
  updateHUD();

  function startTimingRun() {
    state.running = true;
    state.timing = true;
    state.swings = 0;
    state.elapsed = 0;
    state.phase = 0;
    if (elToast) elToast.hidden = true;
    updateHUD();
  }

  function cycleLength() {
    lenIdx = (lenIdx + 1) % lengths.length;
    state.L = lengths[lenIdx];
    syncPendulumGeometry();
    startTimingRun();
  }

  function resetLab() {
    lenIdx = 1;
    state.L = lengths[lenIdx];
    state.running = true;
    state.timing = false;
    state.swings = 0;
    state.elapsed = 0;
    state.completedOnce = false;
    if (elToast) elToast.hidden = true;
    syncPendulumGeometry();
    updateHUD();
  }

  if (btnRelease) btnRelease.addEventListener("click", startTimingRun);
  if (btnLength) btnLength.addEventListener("click", cycleLength);
  if (btnReset) btnReset.addEventListener("click", resetLab);

  function resize() {
    var w = canvas.clientWidth || 480;
    var h = canvas.clientHeight || 360;
    renderer.setSize(w, h, false);
    camera.aspect = w / Math.max(1, h);
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener("resize", resize);

  var highlightedPart = null;
  function setHighlight(partName) {
    highlightedPart = partName;
    Object.keys(parts).forEach(function (k) {
      var obj = parts[k];
      var on = k === partName;
      obj.traverse(function (m) {
        if (m.isMesh && m.material && m.material.emissive) {
          if (k === "fiducial") {
            m.material.emissiveIntensity = on ? 0.9 : 0.35;
          } else {
            m.material.emissive.setHex(on ? 0xf59e0b : 0x000000);
            m.material.emissiveIntensity = on ? 0.55 : 0;
          }
        }
      });
    });
  }

  function rectOfPart(partName) {
    var obj = parts[partName];
    if (!obj) return canvas.getBoundingClientRect();
    var box = new THREE.Box3().setFromObject(obj);
    if (box.isEmpty()) return canvas.getBoundingClientRect();
    var cRect = canvas.getBoundingClientRect();
    var pts = [
      new THREE.Vector3(box.min.x, box.min.y, box.min.z),
      new THREE.Vector3(box.max.x, box.min.y, box.min.z),
      new THREE.Vector3(box.min.x, box.max.y, box.min.z),
      new THREE.Vector3(box.max.x, box.max.y, box.max.z)
    ];
    var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    pts.forEach(function (p) {
      p.project(camera);
      var sx = cRect.left + (p.x * 0.5 + 0.5) * cRect.width;
      var sy = cRect.top + (-p.y * 0.5 + 0.5) * cRect.height;
      if (sx < minX) minX = sx;
      if (sy < minY) minY = sy;
      if (sx > maxX) maxX = sx;
      if (sy > maxY) maxY = sy;
    });
    var pad = 16;
    return {
      left: minX - pad,
      top: minY - pad,
      right: maxX + pad,
      bottom: maxY + pad,
      width: Math.max(44, maxX - minX + pad * 2),
      height: Math.max(44, maxY - minY + pad * 2)
    };
  }

  var lastTime = performance.now();
  function animate(now) {
    requestAnimationFrame(animate);
    var dt = Math.min(0.05, (now - lastTime) / 1000);
    lastTime = now;

    var T = periodFor(state.L);
    var omega = (2 * Math.PI) / T;

    if (state.running) {
      // Speed up visual time slightly during 20-swing timing so student doesn't wait 36 real seconds
      var simDt = state.timing ? dt * 4.5 : dt * 1.35;
      var prevCycles = Math.floor(state.phase / (2 * Math.PI));
      state.phase += omega * simDt;
      var curCycles = Math.floor(state.phase / (2 * Math.PI));

      pendPivot.rotation.z = state.theta0 * Math.cos(state.phase);

      // Pulse fiducial line when crossing x = 0
      var nearZero = Math.abs(Math.cos(state.phase)) < 0.14;
      fidMat.emissiveIntensity = nearZero ? 0.95 : (highlightedPart === "fiducial" ? 0.85 : 0.3);

      if (state.timing) {
        state.elapsed += simDt;
        if (curCycles > prevCycles) {
          state.swings = Math.min(state.targetSwings, curCycles);
          updateHUD();
          if (state.swings >= state.targetSwings) {
            state.timing = false;
            state.completedOnce = true;
            var measT = periodFor(state.L);
            if (elToast) {
              elToast.hidden = false;
              elToast.innerHTML = "<strong>20 swings timed!</strong> t = " + (measT * 20).toFixed(1) + " s · Period T = <strong>" + measT.toFixed(2) + " s</strong> · g = <strong>9.78 m s⁻²</strong>";
            }
            updateHUD();
            document.dispatchEvent(new CustomEvent("lab:result", {
              detail: {
                phase: "endpoint",
                titre: measT,
                length: state.L,
                period: measT,
                g: G_LAGOS
              }
            }));
          }
        } else {
          updateHUD();
        }
      }
    }

    if (controls) controls.update();
    renderer.render(scene, camera);
  }
  requestAnimationFrame(animate);

  window.StudyLab = {
    rect: rectOfPart,
    highlight: setHighlight,
    reset: resetLab,
    drop: startTimingRun,
    demoEndpoint: function () {
      state.L = 0.80;
      syncPendulumGeometry();
      startTimingRun();
    }
  };
})();
