/* ==========================================================
   StudyPipe — Welcome Hub 3D Hero Lab (Beating 4-Chamber Mammalian Heart & Double Circulation)
   Exposes window.StudyLab & window.StudyScenes.lab for StudyNarrator spotlighting
   ========================================================== */
(function () {
  "use strict";
  var canvas = document.getElementById("lab-canvas");
  if (!canvas || typeof THREE === "undefined" || !window.HeartKit) return;

  var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  if ("outputColorSpace" in renderer && THREE.SRGBColorSpace) renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(34, 1, 0.1, 50);
  var TARGET = new THREE.Vector3(0.14, 1.12, 0);
  camera.position.set(0.12, 1.25, 4.2);

  var controls = THREE.OrbitControls ? new THREE.OrbitControls(camera, canvas) : null;
  if (controls) {
    controls.target.copy(TARGET);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 2.4;
    controls.maxDistance = 6.0;
    controls.minAzimuthAngle = -1.1;
    controls.maxAzimuthAngle = 1.1;
    controls.maxPolarAngle = Math.PI * 0.62;
    controls.update();
  } else {
    camera.lookAt(TARGET);
  }

  scene.add(new THREE.HemisphereLight(0xeef6ff, 0x1a1020, 1.0));
  var key = new THREE.DirectionalLight(0xfff5e4, 1.5);
  key.position.set(2.2, 4.0, 4.4);
  scene.add(key);
  var fill = new THREE.DirectionalLight(0xffd6dc, 0.45);
  fill.position.set(-3, 0.5, 3);
  scene.add(fill);
  var rim = new THREE.DirectionalLight(0x3ee6c4, 0.6);
  rim.position.set(-2.8, 2.5, -2.2);
  scene.add(rim);

  var heartGroup = HeartKit.heart({ bpm: 72, mode: "both", scale: 1.1, labels: true });
  heartGroup.position.set(0, 0.92, 0);
  scene.add(heartGroup);

  var hl = HeartKit.makeHighlighter(scene);

  // "rest" = blood-flow section, "sprint" = 150 bpm + conduction wave,
  // "cutaway" = 5 mm vs 15 mm wall callouts, "outside" = external view
  var state = { mode: "rest" };

  var elMedium = document.getElementById("val-medium");
  var elPlant = document.getElementById("val-plant");
  var elAnimal = document.getElementById("val-animal");
  var elToast = document.getElementById("endpoint-toast");
  var MODES = {
    rest: {
      heart: { bpm: 72, mode: "both" },
      medium: "Resting heart · 72 bpm (cut open to show blood flow)",
      plant: "Right side: vena cava → RA → tricuspid valve → RV → pulmonary artery → lungs",
      animal: "Left side: pulmonary vein → LA → bicuspid valve → LV → aorta → body",
      toast: null
    },
    sprint: {
      heart: { bpm: 150, mode: "pace" },
      medium: "400 m sprint · 150 bpm (SAN pacemaker firing faster)",
      plant: "One beat lasts 60 ÷ 150 = 0.40 s · cardiac output ≈ 16.5 L/min",
      animal: "Impulse: SAN → atria → AVN (0.1 s delay) → bundle of His → Purkinje fibres",
      toast: "<strong>Watch the yellow spark:</strong> it starts at the SAN, pauses at the AVN, then races down the septum and up the ventricle walls."
    },
    cutaway: {
      heart: { bpm: 72, mode: "sys" },
      medium: "Ventricle wall thickness (longitudinal section)",
      plant: "Left ventricle wall ≈ 15 mm → pumps to the whole body at about 120 mmHg",
      animal: "Right ventricle wall ≈ 5 mm → pumps only to the lungs at about 25 mmHg",
      toast: "<strong>3 : 1 wall ratio:</strong> the left ventricle wall (<strong>15 mm</strong>) is three times thicker than the right (<strong>5 mm</strong>)."
    },
    outside: {
      heart: { bpm: 72, mode: "exterior" },
      medium: "Outside view · front (sternocostal) surface",
      plant: "Coronary arteries on the surface feed the heart muscle itself",
      animal: "Apex points down and to the body's left; great vessels leave from the top",
      toast: null
    }
  };
  var btns = {
    sprint: document.getElementById("btn-water"),
    cutaway: document.getElementById("btn-salt"),
    outside: document.getElementById("btn-outside")
  };

  function syncUI() {
    var m = MODES[state.mode] || MODES.rest;
    heartGroup.userData.setState(m.heart);
    if (elMedium) elMedium.textContent = m.medium;
    if (elPlant) elPlant.textContent = m.plant;
    if (elAnimal) elAnimal.textContent = m.animal;
    if (elToast) {
      elToast.hidden = !m.toast;
      if (m.toast) elToast.innerHTML = m.toast;
    }
    Object.keys(btns).forEach(function (k) {
      if (btns[k]) btns[k].setAttribute("aria-pressed", state.mode === k ? "true" : "false");
    });
  }

  Object.keys(btns).forEach(function (k) {
    if (!btns[k]) return;
    btns[k].addEventListener("click", function () {
      state.mode = state.mode === k ? "rest" : k;
      syncUI();
    });
  });
  var btnReset = document.getElementById("btn-reset");
  if (btnReset) btnReset.addEventListener("click", function () { state.mode = "rest"; syncUI(); });

  function resize() {
    var w = canvas.clientWidth || (canvas.parentElement && canvas.parentElement.clientWidth) || 360;
    var h = canvas.clientHeight || 300;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // keep the whole heart (≈2.4 units wide incl. labels) in frame on narrow phones
    var tanH = 2 * Math.tan((camera.fov * Math.PI) / 360);
    var dist = Math.max(3.8, 2.75 / (tanH * camera.aspect), 2.75 / tanH);
    camera.position.sub(TARGET).setLength(dist).add(TARGET);
    if (controls) { controls.maxDistance = dist * 1.4; controls.update(); }
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize);
  resize();

  var visible = true;
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }).observe(canvas);
  }
  var clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    var dt = Math.min(clock.getDelta(), 0.05);
    var t = clock.elapsedTime;
    if (!visible) return;
    if (controls) controls.update();
    heartGroup.userData.update(dt, t);
    hl.update(dt, t);
    renderer.render(scene, camera);
  }
  syncUI();
  animate();

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

  var parts = heartGroup.userData.parts || {};
  var partMap = {
    heart: heartGroup,
    ra: parts.ra || heartGroup,
    rv: parts.rv || heartGroup,
    la: parts.la || heartGroup,
    lv: parts.lv || heartGroup,
    aorta: parts.aorta || heartGroup,
    pulmArtery: parts.pulmArtery || heartGroup,
    venaCava: parts.venaCava || heartGroup,
    septum: parts.septum || heartGroup,
    lvWall: parts.lvWall || heartGroup,
    rvWall: parts.rvWall || heartGroup,
    san: parts.san || heartGroup
  };

  window.StudyLab = {
    state: function () { return { phase: "run", mode: state.mode }; },
    reset: function () { state.mode = "rest"; syncUI(); },
    setMode: function (m) { state.mode = m || "rest"; syncUI(); },
    rectFor: function (part) { return rectOf(partMap[part] || heartGroup); },
    highlight: function (part) { hl.set(partMap[part] || null); }
  };
  window.StudyScenes = window.StudyScenes || {};
  window.StudyScenes.lab = {
    rect: function (part) { return window.StudyLab.rectFor(part); },
    highlight: function (part) { window.StudyLab.highlight(part); }
  };
})();
