/* ==========================================================
   StudyPipe — Welcome Hub 3D Hero Lab (Twin Plant & Animal Cell + Osmosis Bench)
   Exposes window.StudyLab for StudyNarrator 3D spotlighting & actions
   ========================================================== */
(function () {
  "use strict";
  var canvas = document.getElementById("lab-canvas");
  if (!canvas || typeof THREE === "undefined" || !window.CellKit) return;

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(36, 1, 0.1, 50);
  camera.position.set(0.0, 1.85, 3.85);

  var controls = THREE.OrbitControls ? new THREE.OrbitControls(camera, canvas) : null;
  if (controls) {
    controls.target.set(0, 0.45, 0);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 2.2;
    controls.maxDistance = 5.6;
    controls.maxPolarAngle = Math.PI * 0.48;
    controls.update();
  }

  scene.add(new THREE.HemisphereLight(0xeef6ff, 0x101828, 0.95));
  var key = new THREE.DirectionalLight(0xfff5e4, 1.35);
  key.position.set(2.8, 4.5, 3.2);
  scene.add(key);
  var rim = new THREE.DirectionalLight(0x3ee6c4, 0.7);
  rim.position.set(-2.8, 2.5, -2.2);
  scene.add(rim);

  // Dark optical glass stage platform
  var baseMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.35, metalness: 0.4 });
  var base = new THREE.Mesh(new THREE.CylinderGeometry(2.1, 2.25, 0.12, 40), baseMat);
  base.position.set(0, -0.06, 0);
  scene.add(base);

  var ring = new THREE.Mesh(
    new THREE.TorusGeometry(2.05, 0.025, 10, 64),
    new THREE.MeshBasicMaterial({ color: 0x3ee6c4 })
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.01;
  scene.add(ring);

  // Left: 3D Plant Palisade Cell (-0.92, 0.58, 0)
  var plantGroup = CellKit.plantCell({ w: 1.55, h: 1.05, d: 0.95, tonicity: 1 });
  plantGroup.position.set(-0.92, 0.58, 0);
  scene.add(plantGroup);

  var plantLbl = CellKit.label("Plant Cell (Cellulose Wall + Vacuole)", { size: 30, bg: "rgba(22,163,74,0.92)", h: 0.17 });
  plantLbl.position.set(-0.92, 1.32, 0);
  scene.add(plantLbl);

  // Right: 3D Animal Cell + Red Blood Cell (+0.95, 0.58, 0)
  var animalGroup = CellKit.animalCell({ r: 0.62 });
  animalGroup.position.set(0.95, 0.58, 0);
  scene.add(animalGroup);

  var rbcGroup = CellKit.rbc({ size: 0.55 });
  rbcGroup.position.set(0.95, 0.18, 0.55);
  scene.add(rbcGroup);

  var animalLbl = CellKit.label("Animal Cell (No Wall · Centrioles)", { size: 30, bg: "rgba(225,29,72,0.92)", h: 0.17 });
  animalLbl.position.set(0.95, 1.32, 0);
  scene.add(animalLbl);

  var hl = CellKit.makeHighlighter(scene);

  var state = {
    mode: "isotonic", // "isotonic" (0.9% / normal), "hypotonic" (pure water), "hypertonic" (1.0 M salt)
    tonicity: 0.2
  };

  var elVol = document.getElementById("val-medium");
  var elPh = document.getElementById("val-plant");
  var elStatus = document.getElementById("val-animal");
  var elToast = document.getElementById("endpoint-toast");

  function syncUI() {
    if (state.mode === "hypotonic") {
      plantGroup.userData.setState({ tonicity: 1.0 });
      animalGroup.userData.setState({ tonicity: 1.0 });
      rbcGroup.userData.setState({ tonicity: 1.0 });
      if (elVol) elVol.textContent = "Distilled water (hypotonic)";
      if (elPh) elPh.textContent = "Plant: Turgid · wall stops it bursting";
      if (elStatus) elStatus.textContent = "Animal / RBC: swells and bursts (haemolysis)";
      if (elToast) {
        elToast.hidden = false;
        elToast.innerHTML = "<strong>Hypotonic Test:</strong> Plant cell becomes <strong>Turgid</strong> · Red blood cell undergoes <strong>Haemolysis</strong>";
      }
    } else if (state.mode === "hypertonic") {
      plantGroup.userData.setState({ tonicity: -1.0 });
      animalGroup.userData.setState({ tonicity: -1.0 });
      rbcGroup.userData.setState({ tonicity: -1.0 });
      if (elVol) elVol.textContent = "Strong salt solution (hypertonic)";
      if (elPh) elPh.textContent = "Plant: plasmolysed (protoplasm pulls away from wall)";
      if (elStatus) elStatus.textContent = "Animal / RBC: shrinks and wrinkles (crenation)";
      if (elToast) {
        elToast.hidden = false;
        elToast.innerHTML = "<strong>Hypertonic Test:</strong> Plant protoplast pulls away from wall (<strong>Plasmolysis</strong>) · RBC <strong>crenates</strong>";
      }
    } else {
      plantGroup.userData.setState({ tonicity: 0.25 });
      animalGroup.userData.setState({ tonicity: 0.0 });
      rbcGroup.userData.setState({ tonicity: 0.0 });
      if (elVol) elVol.textContent = "Isotonic (normal) medium";
      if (elPh) elPh.textContent = "Plant: wall + chloroplasts + central vacuole";
      if (elStatus) elStatus.textContent = "Animal: flexible membrane + centrioles";
      if (elToast) elToast.hidden = true;
    }
  }

  var btnDrop = document.getElementById("btn-water");
  var btnStream = document.getElementById("btn-salt");
  var btnReset = document.getElementById("btn-reset");

  if (btnDrop) {
    btnDrop.addEventListener("click", function () {
      state.mode = state.mode === "hypotonic" ? "isotonic" : "hypotonic";
      syncUI();
    });
  }
  if (btnStream) {
    btnStream.addEventListener("click", function () {
      state.mode = state.mode === "hypertonic" ? "isotonic" : "hypertonic";
      syncUI();
    });
  }
  if (btnReset) {
    btnReset.addEventListener("click", function () {
      state.mode = "isotonic";
      syncUI();
    });
  }

  function resize() {
    var parent = canvas.parentElement;
    if (!parent) return;
    var w = parent.clientWidth || 360;
    var h = parent.clientHeight || 300;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize);
  resize();

  var clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    var dt = Math.min(clock.getDelta(), 0.05);
    var t = clock.elapsedTime;
    if (controls) controls.update();
    plantGroup.userData.update(dt, t);
    animalGroup.userData.update(dt, t);
    rbcGroup.userData.update(dt, t);
    hl.update(dt, t);
    renderer.render(scene, camera);
  }
  syncUI();
  animate();

  // Project 3D part for StudyNarrator spotlighting
  var box = new THREE.Box3(), v = new THREE.Vector3();
  function rectOf(obj) {
    if (!obj) return canvas.getBoundingClientRect();
    var cr = canvas.getBoundingClientRect();
    obj.updateWorldMatrix(true, true);
    box.setFromObject(obj);
    if (box.isEmpty()) return cr;
    var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (var i = 0; i < 8; i++) {
      v.set(i & 1 ? box.max.x : box.min.x, i & 2 ? box.max.y : box.min.y, i & 4 ? box.max.z : box.min.z).project(camera);
      var x = cr.left + (v.x * 0.5 + 0.5) * cr.width;
      var y = cr.top + (-v.y * 0.5 + 0.5) * cr.height;
      minX = Math.min(minX, x); maxX = Math.max(maxX, x);
      minY = Math.min(minY, y); maxY = Math.max(maxY, y);
    }
    return { left: minX - 12, top: minY - 12, width: maxX - minX + 24, height: maxY - minY + 24 };
  }

  var partMap = {
    plantCell: plantGroup,
    animalCell: animalGroup,
    rbc: rbcGroup,
    vacuole: plantGroup.userData.parts.vacuole,
    chloroplast: plantGroup.userData.parts.chloroplast,
    centrioles: animalGroup.userData.parts.centrioles
  };

  window.StudyLab = {
    state: function () { return { phase: "run", mode: state.mode }; },
    reset: function () { state.mode = "isotonic"; syncUI(); },
    openTapFor: function () { state.mode = "hypotonic"; syncUI(); },
    setMode: function (m) { state.mode = m || "isotonic"; syncUI(); },
    rectFor: function (part) { return rectOf(partMap[part] || plantGroup); },
    highlight: function (part) { hl.set(partMap[part] || null); }
  };
  window.StudyScenes = window.StudyScenes || {};
  window.StudyScenes.lab = {
    rect: function (part) { return window.StudyLab.rectFor(part); },
    highlight: function (part) { window.StudyLab.highlight(part); }
  };
})();
