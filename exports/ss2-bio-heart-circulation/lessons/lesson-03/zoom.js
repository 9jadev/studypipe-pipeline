/* Lesson 03 · 3D zoom (window.StudyScenes.zoom): hepatic portal view and coronary view (with Block) from BodyCircuit,
   plus the beating heart (HeartKit "both" mode). All readings come from the kit's own model. */
(function () {
  "use strict";
  var root = document.getElementById("zoom-stage");
  var canvas = document.getElementById("zoom-canvas");
  if (!root || !canvas || typeof THREE === "undefined" || !window.BodyCircuit) return;

  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var $ = function (s) { return document.querySelector(s); };
  var toastEl = $("#zoom-toast"), toastT;
  function toast(m) {
    if (!toastEl) return;
    toastEl.textContent = m; toastEl.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove("show"); }, 3200);
  }

  var state = { mode: "portal", blocked: false, store: 0.6 };
  var kit = BodyCircuit.create({ view: "portal", labels: true, skin: false, bpm: 72, storeFraction: state.store });
  var heart = window.HeartKit ? HeartKit.heart({ mode: "both", bpm: 72, labels: false }) : null;
  if (heart) heart.visible = false;

  var goal = { target: new THREE.Vector3(), dist: 5 };
  var stage = window.SceneKit && SceneKit.createStage({
    root: root, canvas: canvas, fov: 36, autoFit: false, zoomUi: true,
    target: new THREE.Vector3(0, 1, 0), pitch: 0.12, yaw: 0, distance: 5,
    minYaw: -0.9, maxYaw: 0.9, onFrame: frame
  });
  if (stage) {
    stage.rig.add(kit);
    if (heart) { heart.position.set(0, 1.0, 0); heart.scale.setScalar(1.3); stage.rig.add(heart); }
    stage.start();
  }
  function aim(name) {
    if (state.mode === "heart") { goal.target.set(0, 1.0, 0); goal.dist = 4.2; return; }
    var v = kit.viewFor(name || state.mode);
    goal.target.fromArray(v.target); goal.dist = v.dist;
  }
  var snapped = false;
  function frame(dt, t) {
    if (state.mode === "heart") { if (heart && heart.userData.update) heart.userData.update(dt, t); }
    else kit.update(dt, t);
    if (stage) {
      var a = stage.camera.aspect || 1, d = goal.dist * Math.max(1, Math.min(1.9, 0.62 / a));
      if (!snapped) { stage.target.copy(goal.target); stage.dist = d; snapped = true; }
      var k = Math.min(1, dt * 4);
      stage.target.lerp(goal.target, k); stage.dist += (d - stage.dist) * k;
    }
  }

  // ---------- DOM ----------
  var readoutEl = $("#zoom-readout"), blockBtn = $("#zoom-block"), storeIn = $("#zoom-store"), storeWrap = $("#store-wrap");
  var modeBtns = Array.prototype.slice.call(document.querySelectorAll("#zoom-mode button"));
  function paint() {
    if (!readoutEl) return;
    var r = kit.reading();
    if (state.mode === "portal" && r.portal) {
      readoutEl.innerHTML = '<div><span>Glucose seen</span><b>' + r.portal.glucoseSeen + '</b></div><div class="hot"><span>Stored as glycogen</span><b>' + r.portal.stored + '</b></div><div><span>Granules</span><b>' + r.portal.glycogenGranules + '</b></div><div><span>Share stored</span><b>' + Math.round(state.store * 100) + '%</b></div>';
    } else if (state.mode === "coronary" && r.coronary) {
      readoutEl.innerHTML = '<div><span>Artery</span><b>' + (state.blocked ? "blocked" : "open") + '</b></div><div class="hot"><span>Muscle at risk</span><b>' + r.coronary.musclePctAtRisk + '%</b></div><div><span>Muscle starved now</span><b>' + r.coronary.musclePctStarved + '%</b></div>';
    } else if (state.mode === "heart") {
      readoutEl.innerHTML = '<div><span>Right side</span><b style="font-size:.8em">pump to lungs</b></div><div><span>Left side</span><b style="font-size:.8em">pump to body</b></div><div><span>Facing you</span><b style="font-size:.8em">right = your left</b></div>';
    }
  }
  function setMode(m) {
    if (m !== "portal" && m !== "coronary" && m !== "heart") return;
    state.mode = m;
    modeBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-mode") === m)); });
    kit.visible = m !== "heart"; if (heart) heart.visible = m === "heart";
    if (m !== "heart") kit.setState({ view: m, blocked: m === "coronary" ? state.blocked : false });
    blockBtn.disabled = m !== "coronary"; storeWrap.style.display = m === "portal" ? "" : "none";
    aim(m); if (stage) { stage.zoom = 1; stage.yaw = 0; }
    paint();
    toast(m === "portal" ? "Gut capillaries drain into the hepatic portal vein, which ends in the liver." : m === "coronary" ? "Coronary arteries leave the aorta just beyond the valve." : "The beating heart: right side pumps to the lungs, left side to the body.");
    emit("l3:zoom", { mode: m });
  }
  function setBlock(on) {
    state.blocked = !!on;
    blockBtn.setAttribute("aria-pressed", String(state.blocked));
    blockBtn.textContent = state.blocked ? "Clear the blockage" : "Block the artery";
    kit.setState({ blocked: state.blocked });
    if (state.blocked) toast("A clot blocks the artery: the muscle beyond it is starved of oxygen and dies. That is a heart attack.");
    paint();
    emit("l3:zoom", { mode: state.mode, blocked: state.blocked });
  }
  function setStore(v) {
    state.store = Math.max(0, Math.min(1, +v)); storeIn.value = String(state.store);
    kit.setState({ storeFraction: state.store }); paint();
  }
  function reset() {
    state.blocked = false; blockBtn.setAttribute("aria-pressed", "false"); blockBtn.textContent = "Block the artery";
    kit.setState({ blocked: false }); kit.reset(); setStore(0.6); setMode("portal");
  }

  modeBtns.forEach(function (b) { b.addEventListener("click", function () { setMode(b.getAttribute("data-mode")); }); });
  blockBtn.addEventListener("click", function () { setBlock(!state.blocked); });
  storeIn.addEventListener("input", function () { setStore(storeIn.value); });
  $("#zoom-reset").addEventListener("click", reset);

  var api = {
    setMode: setMode, block: setBlock, store: setStore, reset: reset,
    highlight: function (p) { kit.highlight(); if (p) kit.highlight(p, true); },
    rect: function (p) {
      if (!stage) return null;
      var o = kit.parts && kit.parts[p];
      if (state.mode === "heart" && heart) o = (heart.userData.parts && heart.userData.parts[p]) || heart;
      return stage.rectOf(o || (state.mode === "heart" ? heart : kit), 12);
    },
    state: function () { return { mode: state.mode, blocked: state.blocked, store: state.store, reading: kit.reading() }; },
    kit: kit, heart: heart, stage: stage
  };
  window.StudyScenes = window.StudyScenes || {};
  window.StudyScenes.zoom = api;
  aim("portal"); storeWrap.style.display = ""; paint();
  setInterval(paint, 500);
})();
