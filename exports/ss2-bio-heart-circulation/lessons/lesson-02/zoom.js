/* Lesson 02 · 3D zoom (window.StudyScenes.zoom): one atrioventricular valve with chordae (HeartKit v2.1 chordaeCut), or the beating chambers */
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

  var state = { mode: "valve", cusps: 3, cut: false, open: 0.5, manual: false, hl: null };
  var stage = window.SceneKit && SceneKit.createStage({
    root: root, canvas: canvas, fov: 34,
    target: new THREE.Vector3(0, 0.05, 0), pitch: 0.22, yaw: 0.1, distance: 4.6, fitHeight: 2.3, fitWidth: 2.2,
    minYaw: -1.1, maxYaw: 1.1, onFrame: frame
  });

  var valve, chambers, highlighter, tmpV = new THREE.Vector3();
  if (stage) {
    valve = HeartKit.valve({ cusps: 3 });
    chambers = HeartKit.heart({ mode: "both", bpm: 72, labels: false });
    chambers.position.y = 0.15; chambers.visible = false;
    stage.rig.add(valve, chambers);
    highlighter = HeartKit.makeHighlighter(stage.rig);
    stage.start();
  }
  function frame(dt, t) {
    var g = state.mode === "valve" ? valve : chambers;
    if (g && g.userData.update) g.userData.update(dt, t);
    if (highlighter) highlighter.update(dt, t);
    paintCounters();
  }

  var cutBtn = document.getElementById("zoom-cut"), openIn = document.getElementById("zoom-open");
  var counters = document.getElementById("zoom-counters");
  function paintCounters() {
    if (!counters) return;
    var fl = counters.querySelector('[data-c="flaps"]'), lk = counters.querySelector('[data-c="leak"]');
    if (state.mode === "valve") {
      fl.textContent = String(state.cusps);
      var l = valve && valve.userData.leak || 0;
      lk.textContent = l < 0.05 ? "none" : l < 0.5 ? "slight" : "strong";
    } else { fl.textContent = "4 chambers"; lk.textContent = "none"; }
  }
  function setMode(m) {
    if (m !== "valve" && m !== "chambers") return;
    state.mode = m;
    if (valve) valve.visible = m === "valve";
    if (chambers) chambers.visible = m === "chambers";
    Array.prototype.forEach.call(document.querySelectorAll("#zoom-mode button"), function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-mode") === m)); });
    var chamberOnly = m === "chambers";
    Array.prototype.forEach.call(document.querySelectorAll("#zoom-cusps button"), function (b) { b.disabled = chamberOnly; });
    cutBtn.disabled = chamberOnly; openIn.disabled = chamberOnly;
    setHighlight(null);
    paintCounters();
    emit("l2:zoom", { mode: m });
  }
  function setCusps(n) {
    state.cusps = n === 2 ? 2 : 3;
    if (valve) valve.setCusps(state.cusps);
    Array.prototype.forEach.call(document.querySelectorAll("#zoom-cusps button"), function (b) { b.setAttribute("aria-pressed", String(+b.getAttribute("data-cusps") === state.cusps)); });
    if (valve && state.cut) valve.userData.setState({ chordaeCut: true });
    emit("l2:zoom", { mode: state.mode, cusps: state.cusps });
  }
  function setCut(on) {
    state.cut = !!on;
    cutBtn.setAttribute("aria-pressed", String(state.cut));
    cutBtn.textContent = state.cut ? "Rejoin the chordae" : "Cut the chordae";
    if (valve) {
      valve.userData.setState({ chordaeCut: state.cut });
      if (state.cut) { valve.userData.setState({ open: 0 }); openIn.value = "0"; }
      else { valve.userData.setState("auto"); openIn.value = "0.5"; state.manual = false; }
    }
    toast(state.cut ? "Cords cut: the flaps blow back into the atrium and blood leaks." : "Cords in place: the flaps shut and hold.");
    emit("l2:zoom", { mode: state.mode, cut: state.cut });
  }
  function setOpen(v) {
    state.open = Math.max(0, Math.min(1, +v)); state.manual = true;
    if (valve) valve.userData.setState({ open: state.open });
    openIn.value = String(state.open);
  }
  function setHighlight(name) {
    state.hl = name || null;
    var o = null, g = state.mode === "valve" ? valve : chambers;
    if (name && g && g.userData.parts) o = g.userData.parts[name] || null;
    if (highlighter) highlighter.set(o);
  }
  function reset() {
    state.cut = false; state.manual = false;
    cutBtn.setAttribute("aria-pressed", "false"); cutBtn.textContent = "Cut the chordae";
    if (valve) { valve.userData.setState({ chordaeCut: false }); valve.userData.setState("auto"); }
    openIn.value = "0.5"; setCusps(3); setMode("valve");
  }

  Array.prototype.forEach.call(document.querySelectorAll("#zoom-mode button"), function (b) { b.addEventListener("click", function () { setMode(b.getAttribute("data-mode")); }); });
  Array.prototype.forEach.call(document.querySelectorAll("#zoom-cusps button"), function (b) { b.addEventListener("click", function () { setCusps(+b.getAttribute("data-cusps")); }); });
  cutBtn.addEventListener("click", function () { setCut(!state.cut); });
  openIn.addEventListener("input", function () { setOpen(openIn.value); });
  document.getElementById("zoom-reset").addEventListener("click", reset);

  var api = {
    setMode: setMode, setCusps: setCusps, cut: setCut, open: setOpen, reset: reset,
    highlight: setHighlight,
    rect: function (p) {
      if (!stage) return null;
      var g = state.mode === "valve" ? valve : chambers;
      var o = g && g.userData.parts && g.userData.parts[p];
      return stage.rectOf(o || g, 12);
    },
    state: function () { return { mode: state.mode, cusps: state.cusps, cut: state.cut, leak: valve ? valve.userData.leak : 0 }; },
    valve: valve, chambers: chambers
  };
  window.StudyScenes = window.StudyScenes || {};
  window.StudyScenes.zoom = api;
  paintCounters();
})();
