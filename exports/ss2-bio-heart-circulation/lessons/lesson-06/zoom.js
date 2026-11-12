/* Lesson 06 · 3D zoom (window.StudyScenes.zoom): HeartKit.bloodSmear v2.1 — platelets gather, the fibrin net weaves, and citrate (no calcium) stops it */
(function () {
  "use strict";
  var root = document.getElementById("zoom-stage");
  var canvas = document.getElementById("zoom-canvas");
  if (!root || !canvas || typeof THREE === "undefined" || !window.HeartKit) return;

  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var toastEl = document.getElementById("zoom-toast"), toastT;
  function toast(m) {
    if (!toastEl) return;
    toastEl.textContent = m; toastEl.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove("show"); }, 3000);
  }

  var NOTES = [
    "Stage 1: blood leaks from the cut. Nothing has started yet, and red cells, a phagocyte and a lymphocyte drift in the plasma.",
    "Stage 2: platelets stick at the torn edge and gather in a plug. Damaged tissue and platelets release thromboplastin.",
    "Stage 3: with calcium ions and vitamin K, thromboplastin turns prothrombin into thrombin. Thrombin is the trigger for the next step.",
    "Stage 4: thrombin turns dissolved fibrinogen into solid fibrin threads. The net weaves across and snares red cells: a clot."
  ];
  var state = { step: 0, citrate: false, sickle: false, hl: null };

  var stage = window.SceneKit && SceneKit.createStage({
    root: root, canvas: canvas, fov: 34,
    target: new THREE.Vector3(0, 0, 0), pitch: 0.12, yaw: 0, distance: 3.6, fitHeight: 2.2, fitWidth: 2.2,
    minYaw: -0.9, maxYaw: 0.9, onFrame: frame
  });
  var smear, highlighter;
  if (stage) {
    smear = HeartKit.bloodSmear({ labels: false });
    stage.rig.add(smear);
    highlighter = HeartKit.makeHighlighter(stage.rig);
    stage.start();
  }
  function frame(dt, t) {
    if (smear && smear.userData.update) smear.userData.update(dt, t);
    if (highlighter) highlighter.update(dt, t);
  }

  var counters = document.getElementById("zoom-counters");
  var noteEl = document.getElementById("zoom-note");
  var stepBtns = Array.prototype.slice.call(document.querySelectorAll("#zoom-steps button"));
  var citBtn = document.getElementById("zoom-citrate"), sickBtn = document.getElementById("zoom-sickle");

  function paint() {
    if (counters) {
      var plt = counters.querySelector('[data-c="plt"]'), fib = counters.querySelector('[data-c="fib"]');
      plt.textContent = state.step === 0 ? "scattered" : "gathered";
      fib.textContent = state.step < 3 && !(state.step >= 1 && state.citrate) ? (state.step === 0 ? "none" : "none yet") : (state.citrate ? "short stubs only" : "net woven");
    }
    if (noteEl) {
      var t = NOTES[state.step];
      if (state.citrate && state.step >= 1) t = "Citrate removes the calcium ions. Platelets still gather, but prothrombin cannot become thrombin, so only short broken stubs appear and no net forms. This is how the blood bank keeps stored blood runny.";
      noteEl.textContent = t;
    }
    stepBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(+b.getAttribute("data-step") === state.step)); });
    if (citBtn) { citBtn.setAttribute("aria-pressed", String(state.citrate)); citBtn.textContent = state.citrate ? "Calcium back (remove citrate)" : "Add sodium citrate (no calcium)"; }
  }
  function apply() {
    if (!smear) { paint(); return; }
    var clot = state.step >= 1;
    var cit = state.citrate || state.step < 3;       // stages 2 and 3: platelets gather, the net has not woven yet
    smear.userData.setState({ clot: clot, citrate: clot ? cit : false });
    var stubs = smear.userData.parts && smear.userData.parts.fibrinStubs;
    if (stubs && state.step < 3) stubs.visible = false;          // no stubs before the net stage
    setHighlight(state.step === 1 || state.step === 2 ? "platelets" : state.step === 3 && !state.citrate ? "fibrin" : null);
    paint();
  }
  function setStep(n) {
    state.step = Math.max(0, Math.min(3, n | 0));
    apply();
    emit("l6:zoom", { mode: "step", step: state.step, citrate: state.citrate });
  }
  function setCitrate(on) {
    state.citrate = !!on;
    if (state.citrate && state.step < 1) state.step = 3;       // show the failed clot straight away
    if (!state.citrate && state.step === 0) state.step = 0;
    apply();
    toast(state.citrate ? "Sodium citrate: calcium removed, so no fibrin net." : "Calcium restored: the chain can finish.");
    emit("l6:zoom", { mode: "citrate", step: state.step, citrate: state.citrate });
  }
  function setSickle(on) {
    state.sickle = !!on;
    if (smear) smear.userData.setState({ sickle: state.sickle });
    if (sickBtn) sickBtn.setAttribute("aria-pressed", String(state.sickle));
  }
  function setHighlight(name) {
    state.hl = name || null;
    var o = null;
    if (name && smear && smear.userData.parts) o = smear.userData.parts[name] || smear.userData.parts[name + "s"] || null;
    if (highlighter) highlighter.set(o);
  }
  function play() {
    state.citrate = false; setSickle(false); setStep(0);
    var k = 0;
    clearInterval(play._t);
    play._t = setInterval(function () { k++; setStep(k); if (k >= 3) clearInterval(play._t); }, 1800);
  }
  function reset() {
    clearInterval(play._t);
    state.citrate = false; state.step = 0; setSickle(false); apply();
    emit("l6:zoom", { mode: "reset", step: 0, citrate: false });
  }

  stepBtns.forEach(function (b) { b.addEventListener("click", function () { setStep(+b.getAttribute("data-step")); }); });
  if (citBtn) citBtn.addEventListener("click", function () { setCitrate(!state.citrate); });
  if (sickBtn) sickBtn.addEventListener("click", function () { setSickle(!state.sickle); });
  var rb = document.getElementById("zoom-reset"); if (rb) rb.addEventListener("click", reset);

  var api = {
    setMode: function (m) { if (m === "clot") play(); else if (m === "citrate") setCitrate(true); else if (m === "reset") reset(); },
    step: setStep, citrate: setCitrate, sickle: setSickle, play: play, reset: reset,
    highlight: setHighlight,
    rect: function (p) {
      if (!stage) return null;
      var o = smear && smear.userData.parts && (smear.userData.parts[p] || smear.userData.parts[p + "s"]);
      return stage.rectOf(o || smear, 12);
    },
    state: function () { return { step: state.step, citrate: state.citrate, sickle: state.sickle }; },
    smear: smear
  };
  window.StudyScenes = window.StudyScenes || {};
  window.StudyScenes.zoom = api;
  apply();
})();
