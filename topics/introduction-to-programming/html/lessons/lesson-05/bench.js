/* ==========================================================
   StudyPipe — Lesson 05 3D Lab Bench (`window.StudyScenes.bench`)
   Mounts `ProgrammingBench` (mode: "function-factory") on a SceneKit stage.
   Parts: chamber, hopper, localDome, returnChute, globalPillar, display
   Presets: 85 kWh -> ₦7,713.50, 120 kWh -> ₦10,272.00, 210 kWh -> ₦16,851.00, 45 kWh -> ₦4,789.50
   ========================================================== */
(function () {
  "use strict";
  var root = document.getElementById("bench-stage");
  var canvas = document.getElementById("bench-canvas");
  if (!root || !canvas || typeof THREE === "undefined") return;

  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var readoutEl = document.getElementById("bench-readout");
  var hintEl = document.getElementById("bench-hint");

  var PRESETS = [85, 120, 210, 45];
  var STAGES = ["input", "local", "return"];
  var state = { units: 85, unitsIdx: 0, stage: "return" };

  var kit = window.ProgrammingBench ? window.ProgrammingBench.create({
    mode: "function-factory",
    onEvent: onKitEvent
  }) : null;

  var stage = window.SceneKit && SceneKit.createStage({
    root: root,
    canvas: canvas,
    fov: 36,
    target: new THREE.Vector3(0, 0.55, 0),
    pitch: 0.48,
    yaw: 0.08,
    minYaw: -0.95,
    maxYaw: 0.95,
    minHeight: 300,
    maxHeight: 430,
    onFrame: function (dt, t) { if (kit) kit.update(dt, t); }
  });

  if (stage && kit) {
    stage.rig.add(kit);
    if (stage.addPart && kit.userData && kit.userData.parts) {
      Object.keys(kit.userData.parts).forEach(function (k) {
        stage.addPart(k, kit.userData.parts[k], k);
      });
    }
    stage.start();
  }

  function naira(v) {
    var n = Number(v || 0);
    return "₦" + n.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function paintReadout() {
    if (!readoutEl || !kit) return;
    var r = kit.reading();
    var stLabel = r.stage === "input" ? "Hopper (Args)" : r.stage === "local" ? "Inside Local" : "Returned";
    readoutEl.innerHTML =
      '<div><span>Arguments</span><b class="sm">' + r.units + ' kWh · ₦68</b></div>' +
      '<div><span>Local Frame</span><b class="sm">' + naira(r.energy_cost) + ' + VAT</b></div>' +
      '<div class="hot"><span>Return Bill</span><b>' + naira(r.total_bill) + '</b></div>' +
      '<div><span>Global Scope</span><b class="sm">Safe (' + stLabel + ')</b></div>';
  }

  function syncMethodCards() {
    var count = countRows();
    var m1 = document.getElementById("m1");
    var m2 = document.getElementById("m2");
    var m3 = document.getElementById("m3");
    var m4 = document.getElementById("m4");
    [m1, m2, m3, m4].forEach(function (el) { if (el) el.classList.remove("now", "done"); });
    if (count === 0) {
      if (state.stage === "input" && m1) m1.classList.add("now");
      else if (state.stage === "local") { if (m1) m1.classList.add("done"); if (m2) m2.classList.add("now"); }
      else { if (m1) m1.classList.add("now"); }
    } else if (count < 3) {
      if (m1) m1.classList.add("done");
      if (m2) m2.classList.add("done");
      if (m3) m3.classList.add("now");
    } else {
      [m1, m2, m3, m4].forEach(function (el) { if (el) el.classList.add("done"); });
    }
  }

  function countRows() {
    var r = kit ? kit.reading() : null;
    return r && r.rows ? r.rows.length : 0;
  }

  function paintHint() {
    if (!hintEl) return;
    var c = countRows();
    hintEl.innerHTML = "Recorded <b>" + c + " of 3+</b> calls · Global revenue untouched";
    syncMethodCards();
  }

  function onKitEvent(name, detail) {
    if (name === "reading") {
      emit("l05:bench", detail);
      paintReadout();
      paintHint();
    } else if (name === "done") {
      emit("l05:bench-done", { count: countRows(), reading: detail });
      paintHint();
    } else if (name === "reset") {
      emit("l05:bench-reset", {});
      paintReadout();
      paintHint();
    } else if (name === "state") {
      paintReadout();
      syncMethodCards();
    }
  }

  function setUnits(u) {
    var idx = PRESETS.indexOf(+u);
    if (idx >= 0) state.unitsIdx = idx;
    state.units = +u;
    if (kit) kit.setState({ units: state.units });
    root.querySelectorAll("#bench-units [data-units]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(+b.getAttribute("data-units") === state.units));
    });
    paintReadout();
  }

  function setUnitsIdx(idx) {
    var i = Math.max(0, Math.min(PRESETS.length - 1, +idx || 0));
    setUnits(PRESETS[i]);
  }

  function setStage(st) {
    if (STAGES.indexOf(st) < 0) st = "return";
    state.stage = st;
    if (kit) kit.setState({ stage: st });
    root.querySelectorAll("#bench-phase [data-stage]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-stage") === st));
    });
    paintReadout();
    syncMethodCards();
  }

  function take() {
    setStage("return");
    if (kit) kit.takeReading();
  }

  function stepNext() {
    if (kit) {
      kit.step();
      var r = kit.reading();
      state.units = r.units;
      state.unitsIdx = PRESETS.indexOf(r.units);
      root.querySelectorAll("#bench-units [data-units]").forEach(function (b) {
        b.setAttribute("aria-pressed", String(+b.getAttribute("data-units") === state.units));
      });
    }
  }

  function reset() {
    state.units = 85;
    state.unitsIdx = 0;
    state.stage = "return";
    root.querySelectorAll("#bench-units [data-units]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(+b.getAttribute("data-units") === 85));
    });
    root.querySelectorAll("#bench-phase [data-stage]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-stage") === "return"));
    });
    if (kit) kit.reset();
    paintReadout();
    paintHint();
  }

  // Bind UI buttons
  root.querySelectorAll("#bench-units [data-units]").forEach(function (b) {
    b.addEventListener("click", function () { setUnits(+b.getAttribute("data-units")); });
  });
  root.querySelectorAll("#bench-phase [data-stage]").forEach(function (b) {
    b.addEventListener("click", function () { setStage(b.getAttribute("data-stage")); });
  });
  var btnTake = document.getElementById("bench-take");
  var btnStep = document.getElementById("bench-step");
  var btnReset = document.getElementById("bench-reset");
  if (btnTake) btnTake.addEventListener("click", take);
  if (btnStep) btnStep.addEventListener("click", stepNext);
  if (btnReset) btnReset.addEventListener("click", reset);

  var PART_ALIASES = {
    localFrame: "localDome",
    globalBoard: "globalPillar",
    chute: "returnChute",
    console: "display"
  };
  function resolvePart(p) {
    if (!p) return null;
    return PART_ALIASES[p] || p;
  }

  window.StudyScenes = window.StudyScenes || {};
  window.StudyScenes.bench = {
    setMode: function () {},
    setUnits: setUnits,
    setUnitsIdx: setUnitsIdx,
    setStage: setStage,
    take: take,
    takeReading: take,
    step: stepNext,
    reset: reset,
    reading: function () { return kit ? kit.reading() : null; },
    highlight: function (p) { if (kit) kit.highlight(resolvePart(p)); },
    rect: function (p) {
      var k = resolvePart(p);
      return (stage && kit && kit.parts && kit.parts[k]) ? stage.rectOf(kit.parts[k], 14) : null;
    }
  };

  paintReadout();
  paintHint();
})();
