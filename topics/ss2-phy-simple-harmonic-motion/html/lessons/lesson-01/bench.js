/* Lesson 01 · 3D timing bench (window.StudyScenes.bench).
   Three rigs on one SceneKit stage:
     pendulum → PendulumKit v3 "trace" (l = 0.80 m)        model: 20 osc → 35.90 s (T 1.795 s)
     spring   → MassSpringKit v2 "period" (0.20 kg, 24.5 N/m) model: 20 osc → 11.35 s (T 0.568 s)
     okada    → MassSpringKit v2 "okada", parked, 200 kg     model: 20 bounces → 10.0 s (T0 0.500 s)
   "Time n" = the kit's own stopwatch (starts at the rest mark counting zero, lands on the model time).
   "Start / Stop" = hand timing with a modelled reaction delay of 0.1–0.3 s at each press (pendulum: kit-seeded;
   spring / okada: seeded here and passed to the kit). Every number shown comes from kit.reading() / Kit.model. */
(function () {
  "use strict";
  var root = document.getElementById("bench-stage");
  var canvas = document.getElementById("bench-canvas");
  if (!root || !canvas) return;

  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var readoutEl = document.getElementById("bench-readout");
  var hintEl = document.getElementById("bench-hint");
  var small = root.clientWidth < 560;

  var state = { rig: "pendulum", n: 20, fast: false, hand: false };
  var done = { pendulum: false, spring: false }, doneSent = false;
  var handRig = null;            // rig whose hand timing is running

  // seeded reaction delays for the mass-spring kit (0.1–0.3 s), deterministic per page load
  var seed = 11;
  function rand() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
  function delay() { return 0.1 + 0.2 * rand(); }

  // ---------- kits ----------
  var pend = window.PendulumKit ? PendulumKit.create({ mode: "trace", l: 0.80, speed: 1, labels: !small, onEvent: onPend }) : null;
  var ms = window.MassSpringKit ? MassSpringKit.create({ mode: "period", m: 0.20, k: 24.5, labels: !small, onEvent: onMs }) : null;

  var stage = (typeof THREE !== "undefined") && window.SceneKit && SceneKit.createStage({
    root: root, canvas: canvas, fov: 34,
    target: new THREE.Vector3(0, 0.6, 0), pitch: 0.16, yaw: 0.1,
    minYaw: -0.9, maxYaw: 0.9, minHeight: 300, maxHeight: 440,
    onFrame: function (dt, t) {
      var k = active(); if (k) k.update(dt, t);
      paintTick += dt; if (paintTick > 0.1) { paintTick = 0; paintReadout(); }
    }
  });
  var paintTick = 0;
  if (stage) {
    if (pend) stage.rig.add(pend);
    if (ms) stage.rig.add(ms);
    applyRig(); stage.start();
  } else if (!pend && !ms) {
    root.classList.add("no-webgl");
  }

  function active() { return state.rig === "pendulum" ? pend : ms; }
  function rigName(r) { return r === "pendulum" ? "Pendulum" : r === "spring" ? "Spring" : "Okada"; }

  function applyRig() {
    if (pend) pend.visible = state.rig === "pendulum";
    if (ms) {
      ms.visible = state.rig !== "pendulum";
      if (state.rig === "spring") ms.setState({ mode: "period", m: 0.20, k: 24.5, reset: true });
      else if (state.rig === "okada") ms.setState({ mode: "okada", view: "bench", parked: true, mass: 200, reset: true });
      ms.setState({ labels: !small, timeScale: state.fast ? 4 : 1 });
    }
    if (pend) pend.setState({ speed: state.fast ? 4 : 1, labels: !small });
    if (stage) stage.refit();
  }

  // ---------- readout (one row, four tiles) ----------
  function live() {
    var k = active(); if (!k) return null;
    var r = k.reading();
    if (state.rig === "pendulum") {
      var w = r.watch || {};
      return { t: w.display || "0.00", n: w.n || 0, T: r.T };
    }
    var W = r.watch || { t: 0, count: 0 };
    return { t: (W.t || 0).toFixed(2), n: W.count || 0, T: r.T };
  }
  function paintReadout() {
    if (!readoutEl) return;
    var L = live();
    if (!L) { readoutEl.innerHTML = '<div><span>Bench</span><b class="sm">kit loading</b></div>'; return; }
    readoutEl.innerHTML =
      '<div><span>Count</span><b>' + L.n + "</b></div>" +
      '<div class="hot"><span>t / s</span><b>' + L.t + "</b></div>" +
      '<div><span>T (model)</span><b>' + L.T.toFixed(3) + "</b></div>" +
      '<div><span>f / Hz</span><b>' + (1 / L.T).toFixed(3) + "</b></div>";
  }
  function paintHint(msg) {
    if (!hintEl) return;
    if (msg) { hintEl.innerHTML = msg; return; }
    hintEl.innerHTML = "Timed with n = 20: pendulum " + (done.pendulum ? "✓" : "–") + " · spring " + (done.spring ? "✓" : "–");
  }

  // ---------- results → lesson events ----------
  function record(rig, how, n, t, extra) {
    if (!n || !t) return;
    var T = t / n;
    var row = { rig: rig, how: how, n: n, t: t, T: T, f: 1 / T, w: 2 * Math.PI / T };
    if (extra) for (var k in extra) row[k] = extra[k];
    emit("l1:bench", row);
    if (n === 20 && (rig === "pendulum" || rig === "spring")) done[rig] = true;
    paintHint();
    if (!doneSent && done.pendulum && done.spring) { doneSent = true; emit("l1:bench-done", { pendulum: true, spring: true }); }
    setHand(false);
  }
  function onPend(name, d) {
    if (name !== "timed" || !d) return;
    var rows = d.rows || [], last = rows[rows.length - 1];
    if (!last) return;
    if (last.manual) record("pendulum", "hand", last.n, last.t, { delayStart: last.delayStart, delayStop: last.delayStop });
    else record("pendulum", "auto", last.n, last.t);
  }
  function onMs(name, d) {
    if (name !== "timed" || !d) return;
    var rig = state.rig === "okada" ? "okada" : "spring";
    if (d.manual) record(rig, "hand", d.n, d.t, handDelays);
    else record(rig, "auto", d.n, d.t);
  }
  var handDelays = null;

  // ---------- controls ----------
  function setRig(r) {
    state.rig = r; setHand(false);
    root.querySelectorAll("#bench-rig [data-rig]").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-rig") === r)); });
    applyRig(); paintReadout();
  }
  function setN(n) {
    state.n = n;
    root.querySelectorAll("#bench-n [data-n]").forEach(function (b) { b.setAttribute("aria-pressed", String(+b.getAttribute("data-n") === n)); });
  }
  function setFast(on) {
    state.fast = !!on;
    var b = document.getElementById("bench-fast"); if (b) b.setAttribute("aria-pressed", String(state.fast));
    if (pend) pend.setState({ speed: state.fast ? 4 : 1 });
    if (ms) ms.setState({ timeScale: state.fast ? 4 : 1 });
  }
  function release() {
    if (state.rig === "pendulum") { if (pend) pend.release(); }
    else if (ms) { if (state.rig === "okada") ms.press(0.03); else ms.release(0.03); }
  }
  function timeN(n) {
    n = n || state.n; setHand(false);
    if (state.rig === "pendulum") { if (pend) pend.time(n); }
    else if (ms) {
      if (state.rig === "okada") { ms.press(0.03); ms.timeN(n, 0); }
      else ms.timeN(n, 0);
    }
    paintHint("Timing " + n + (state.rig === "okada" ? " bounces" : " oscillations") + " from the rest mark…");
  }
  function setHand(on) {
    state.hand = !!on;
    var b = document.getElementById("bench-hand");
    if (b) { b.textContent = state.hand ? "■ Stop" : "▶ Start"; b.setAttribute("aria-pressed", String(state.hand)); }
  }
  function handToggle() {
    if (!state.hand) {
      handRig = state.rig;
      if (state.rig === "pendulum") { if (pend) pend.startWatch(); }
      else if (ms) {
        if (state.rig === "okada") ms.press(0.03); else ms.release(0.03);
        handDelays = { delayStart: delay() };
        ms.startWatch(handDelays.delayStart);
      }
      setHand(true);
      paintHint("Count the passes, then press Stop.");
    } else {
      if (handRig === "pendulum") { if (pend) pend.stopWatch(); }
      else if (ms) { handDelays = handDelays || {}; handDelays.delayStop = delay(); ms.stopWatch(handDelays.delayStop); }
      setHand(false);
    }
  }
  function reset() {
    setHand(false);
    if (pend) { pend.reset(); pend.setState({ mode: "trace", l: 0.80, speed: state.fast ? 4 : 1, labels: !small }); }
    done = { pendulum: false, spring: false }; doneSent = false;
    applyRig();
    emit("l1:bench-reset");
    paintHint(); paintReadout();
  }

  function wire() {
    root.querySelectorAll("#bench-rig [data-rig]").forEach(function (b) { b.addEventListener("click", function () { setRig(b.getAttribute("data-rig")); }); });
    root.querySelectorAll("#bench-n [data-n]").forEach(function (b) { b.addEventListener("click", function () { setN(+b.getAttribute("data-n")); }); });
    var on = function (id, fn) { var el = document.getElementById(id); if (el) el.addEventListener("click", fn); };
    on("bench-release", release);
    on("bench-time", function () { timeN(); });
    on("bench-hand", handToggle);
    on("bench-reset", reset);
    on("bench-fast", function () { setFast(!state.fast); });
  }

  /* Bridge helper: hand-time the parked okada (200 kg) n bounces. The true time is n·T0 from
     MassSpringKit.model.okadaParked; each press adds a modelled reaction delay of 0.1–0.3 s. */
  function handTimeOkada(n) {
    if (!window.MassSpringKit || !MassSpringKit.model || !MassSpringKit.model.okadaParked) return null;
    var P = MassSpringKit.model.okadaParked(200, n);
    var d1 = delay(), d2 = delay();
    var t = P.t - d1 + d2;
    if (state.rig === "okada" && ms) ms.press(0.03);
    return { n: n, t: t, T: t / n, Ttrue: P.T, delayStart: d1, delayStop: d2 };
  }

  function partOf(p) {
    var k = active();
    if (k && k.parts && k.parts[p]) return k.parts[p];
    return null;
  }

  // ---------- public API for narration + widgets ----------
  window.StudyScenes = window.StudyScenes || {};
  window.StudyScenes.bench = {
    setMode: setRig, setRig: setRig, setN: setN, setFast: setFast, release: release, timeN: timeN,
    hand: handToggle, reset: reset, handTimeOkada: handTimeOkada,
    highlight: function (p) { var k = active(); if (k && k.highlight) k.highlight(p || null); },
    rect: function (p) { var o = partOf(p); return (stage && o) ? stage.rectOf(o, 14) : null; },
    reading: function () { var k = active(); return k ? k.reading() : null; },
    rig: function () { return state.rig; }
  };

  wire(); setN(20); paintHint(); paintReadout();
})();
