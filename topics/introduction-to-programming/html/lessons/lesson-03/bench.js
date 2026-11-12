/* ==========================================================
   StudyPipe — Lesson 03 3D Practical Bench: Iterative Loop Stepper
   Mounts ProgrammingBench (mode: "loop-stepper") on SceneKit stage.
   Exposes window.StudyScenes.bench.
   ========================================================== */
(function () {
  "use strict";
  var root = document.getElementById("bench-stage");
  var canvas = document.getElementById("bench-canvas");
  if (!root || !canvas || typeof THREE === "undefined") return;

  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var readoutEl = document.getElementById("bench-readout");
  var hintEl = document.getElementById("bench-hint");

  var state = { dataset: "solar", stepIndex: 0 };

  var kit = window.ProgrammingBench ? window.ProgrammingBench.create({
    mode: "loop-stepper",
    dataset: "solar",
    stepIndex: 0,
    onEvent: onKitEvent
  }) : null;

  var stage = window.SceneKit && SceneKit.createStage({
    root: root,
    canvas: canvas,
    fov: 36,
    target: new THREE.Vector3(0, 0.45, 0),
    pitch: 0.42,
    yaw: 0.06,
    minYaw: -0.95,
    maxYaw: 0.95,
    minHeight: 320,
    maxHeight: 450,
    onFrame: function (dt, t) { if (kit) kit.update(dt, t); }
  });

  if (stage && kit) {
    stage.rig.add(kit);
    if (typeof stage.addPart === "function" && kit.userData && kit.userData.parts) {
      Object.keys(kit.userData.parts).forEach(function (k) {
        stage.addPart(k, kit.userData.parts[k], k);
      });
    }
    stage.start();
  }

  function dsTitle(ds) {
    if (ds === "range5") return "range(1, 6)";
    if (ds === "infinite") return "while count < 5";
    return "solar [7 days]";
  }

  function paintReadout() {
    if (!readoutEl || !kit) return;
    var r = kit.reading() || {};
    var c = r.computed || r;
    var ds = c.dataset || state.dataset;
    var step = c.stepIndex != null ? c.stepIndex : state.stepIndex;
    var isWatchdog = !!c.watchdog;
    var isDone = !!c.terminated;
    var unit = ds === "solar" ? " kWh" : "";
    var valTxt = ds === "infinite" ? "0 (stuck)" : (step === 0 ? "–" : (c.currentVal + unit));
    var totTxt = ds === "infinite" ? "0" : (c.total + unit);
    var stTxt = isWatchdog ? "WATCHDOG!" : (isDone ? "EXIT (False)" : (step === 0 ? "READY" : "True · Step " + step));

    readoutEl.innerHTML =
      '<div><span>Counter / Step</span><b>' + (ds === "infinite" ? "count=1 (×" + step + ")" : ("i=" + c.i + " · #" + step)) + "</b></div>" +
      '<div><span>Value Added</span><b class="sm">' + valTxt + "</b></div>" +
      '<div><span>Accumulator</span><b>' + totTxt + "</b></div>" +
      '<div class="' + (isWatchdog ? "hot" : "") + '"><span>Condition</span><b class="sm">' + stTxt + "</b></div>";
  }

  var recordedCount = 0;
  function onKitEvent(name, detail) {
    if (name === "reading") {
      var c = (detail && detail.computed) ? detail.computed : (detail || {});
      state.stepIndex = c.stepIndex != null ? c.stepIndex : state.stepIndex;
      recordedCount++;
      syncSlider();
      paintReadout();
      paintHint();
      emit("l03:bench", c);
      if (recordedCount >= 5) {
        emit("l03:bench-done", { count: recordedCount, dataset: state.dataset, total: c.total });
      }
    } else if (name === "done") {
      emit("l03:bench-done", detail || { count: recordedCount });
    } else if (name === "reset") {
      recordedCount = 0;
      state.stepIndex = 0;
      syncSlider();
      paintReadout();
      paintHint();
      emit("l03:bench-reset", {});
    } else if (name === "state") {
      paintReadout();
    }
  }

  function paintHint() {
    if (!hintEl || !kit) return;
    var r = kit.reading() || {};
    var c = r.computed || r;
    var maxS = state.dataset === "infinite" ? 6 : (state.dataset === "range5" ? 5 : 7);
    if (c.watchdog) {
      hintEl.innerHTML = "<b>Watchdog tripped!</b> Loop halted after 6 runaway cycles.";
    } else {
      hintEl.innerHTML = "Mode: <b>" + dsTitle(state.dataset) + "</b> · Step <b>" + (c.stepIndex || 0) + " of " + maxS + "</b>";
    }
  }

  function syncSlider() {
    var sl = document.getElementById("bench-iter");
    if (!sl) return;
    var maxS = state.dataset === "infinite" ? 7 : (state.dataset === "range5" ? 5 : 7);
    sl.max = String(maxS);
    sl.value = String(Math.min(state.stepIndex, maxS));
  }

  function setDataset(ds) {
    state.dataset = ds;
    state.stepIndex = 0;
    root.querySelectorAll("#bench-ds [data-ds]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-ds") === ds));
    });
    if (kit) kit.setState({ dataset: ds, stepIndex: 0 });
    syncSlider();
    paintReadout();
    paintHint();
  }

  function setIter(idx) {
    state.stepIndex = Math.max(0, +idx || 0);
    if (kit) {
      kit.setState({ stepIndex: state.stepIndex });
      if (state.stepIndex > 0) kit.takeReading();
    }
    syncSlider();
    paintReadout();
    paintHint();
  }

  function stepNext() {
    if (!kit) return;
    var maxS = state.dataset === "infinite" ? 7 : (state.dataset === "range5" ? 5 : 7);
    var nextIdx = state.stepIndex >= maxS ? 1 : (state.stepIndex + 1);
    state.stepIndex = nextIdx;
    kit.setState({ stepIndex: nextIdx });
    kit.takeReading();
  }

  function runAll() {
    if (!kit) return;
    var maxS = state.dataset === "infinite" ? 6 : (state.dataset === "range5" ? 5 : 7);
    for (var s = 1; s <= maxS; s++) {
      state.stepIndex = s;
      kit.setState({ stepIndex: s });
      kit.takeReading();
    }
  }

  function reset() {
    state.dataset = "solar";
    state.stepIndex = 0;
    recordedCount = 0;
    root.querySelectorAll("#bench-ds [data-ds]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-ds") === "solar"));
    });
    if (kit) {
      kit.reset();
      kit.setState({ dataset: "solar", stepIndex: 0 });
    }
    syncSlider();
    paintReadout();
    paintHint();
  }

  // Wire controls
  root.querySelectorAll("#bench-ds [data-ds]").forEach(function (b) {
    b.addEventListener("click", function () { setDataset(b.getAttribute("data-ds")); });
  });
  var sl = document.getElementById("bench-iter");
  if (sl) sl.addEventListener("input", function () { setIter(+sl.value); });
  var btnStep = document.getElementById("bench-step");
  if (btnStep) btnStep.addEventListener("click", stepNext);
  var btnRun = document.getElementById("bench-run");
  if (btnRun) btnRun.addEventListener("click", runAll);
  var btnReset = document.getElementById("bench-reset");
  if (btnReset) btnReset.addEventListener("click", reset);

  window.StudyScenes = window.StudyScenes || {};
  window.StudyScenes.bench = {
    setDataset: setDataset,
    setIter: setIter,
    step: stepNext,
    takeReading: stepNext,
    runAll: runAll,
    reset: reset,
    highlight: function (p) { if (kit) kit.highlight(p || null); },
    rect: function (p) {
      var parts = kit && (kit.parts || (kit.userData && kit.userData.parts));
      return (stage && parts && parts[p]) ? stage.rectOf(parts[p], 14) : null;
    },
    reading: function () { return kit ? kit.reading() : null; }
  };

  syncSlider();
  paintReadout();
  paintHint();
})();
