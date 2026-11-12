/* ==========================================================
   StudyPipe — Lesson 06 Lab Bench: Full System Recovery & Trace Console
   Mounts ProgrammingBench (mode: "trace-console") on a SceneKit stage.
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

  var ARR = [14, 7, 22, 9];
  var state = { byteVal: 0x7E, traceStep: 0, recorded: 0 };

  var kit = (window.ProgrammingBench && ProgrammingBench.create)
    ? ProgrammingBench.create({ mode: "trace-console" })
    : null;

  var stage = window.SceneKit && SceneKit.createStage({
    root: root, canvas: canvas, fov: 36,
    target: new THREE.Vector3(0, 0.45, 0), pitch: 0.48, yaw: 0.06,
    minYaw: -0.95, maxYaw: 0.95, minHeight: 320, maxHeight: 440,
    onFrame: function (dt, t) { if (kit && kit.update) kit.update(dt, t); }
  });

  var PART_ALIASES = {
    bitSwitches: "switches",
    powerRelay: "contactor",
    townGrid: "statusBeacon"
  };

  if (stage && kit) {
    stage.rig.add(kit);
    if (stage.addPart) {
      var parts = (kit.userData && kit.userData.parts) || kit.parts || {};
      Object.keys(parts).forEach(function (k) {
        stage.addPart(k, parts[k], k);
      });
      Object.keys(PART_ALIASES).forEach(function (alias) {
        var target = parts[PART_ALIASES[alias]];
        if (target) stage.addPart(alias, target, alias);
      });
    }
    stage.start();
  }

  function applyState() {
    if (kit && kit.setState) {
      kit.setState({
        byteVal: state.byteVal,
        traceStep: state.traceStep,
        readings: ARR
      });
    }
    syncUi();
    paintReadout();
    paintHint();
  }

  function currentReading() {
    if (kit && kit.reading) return kit.reading();
    return {
      byteVal: state.byteVal,
      hex: "0x7E",
      binary: "01111110",
      decimal: 126,
      authOk: state.byteVal === 0x7E,
      traceStep: state.traceStep,
      evenSum: 36,
      evenCount: 2,
      contactorClosed: state.byteVal === 0x7E && state.traceStep >= ARR.length
    };
  }

  function paintReadout() {
    if (!readoutEl) return;
    var r = currentReading();
    var rows = r.traceRows || [];
    var lastRow = rows.length ? rows[rows.length - 1] : null;
    var stepTxt = state.traceStep === 0 ? "Init (0/4)" : ("i=" + (lastRow ? lastRow.i : 0) + " (" + state.traceStep + "/4)");
    var sumTxt = (r.evenSum != null ? r.evenSum : 0) + " (cnt " + (r.evenCount != null ? r.evenCount : 0) + ")";
    var statusTxt = r.contactorClosed ? "ONLINE 50Hz" : (r.authOk ? "0x7E AUTH OK" : "LOCKED");
    readoutEl.innerHTML =
      '<div><span>Register</span><b class="sm">' + r.hex + " · " + r.binary + "</b></div>" +
      "<div><span>Trace step</span><b>" + stepTxt + "</b></div>" +
      "<div><span>sum_even</span><b>" + sumTxt + "</b></div>" +
      '<div class="' + (r.contactorClosed ? "hot" : "") + '"><span>Grid status</span><b class="sm">' + statusTxt + "</b></div>";
  }

  function paintHint() {
    if (!hintEl) return;
    var r = currentReading();
    if (r.contactorClosed) {
      hintEl.innerHTML = "<b>Rebooted!</b> 0x7E matched &amp; trace verified (sum_even = 36, count = 2)";
    } else {
      hintEl.innerHTML = "Traced <b>" + state.traceStep + " of 4</b> on [14, 7, 22, 9] · Byte: <b>" + r.hex + "</b>";
    }
  }

  function syncUi() {
    root.querySelectorAll("#bench-hex [data-byte]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(+b.getAttribute("data-byte") === state.byteVal));
    });
    root.querySelectorAll("#bench-bits [data-bit]").forEach(function (b) {
      var bitIdx = +b.getAttribute("data-bit");
      var bitVal = (state.byteVal >> bitIdx) & 1;
      b.setAttribute("aria-pressed", String(bitVal === 1));
      var vEl = b.querySelector("b");
      if (vEl) vEl.textContent = String(bitVal);
    });
    var m1 = document.getElementById("m1"), m2 = document.getElementById("m2"),
        m3 = document.getElementById("m3"), m4 = document.getElementById("m4");
    var auth = state.byteVal === 0x7E;
    var done = auth && state.traceStep >= 4;
    if (m1) { m1.classList.toggle("done", auth); m1.classList.toggle("now", !auth); }
    if (m2) { m2.classList.toggle("done", state.traceStep >= 2); m2.classList.toggle("now", auth && state.traceStep < 2); }
    if (m3) { m3.classList.toggle("done", state.traceStep >= 4); m3.classList.toggle("now", auth && state.traceStep >= 2 && state.traceStep < 4); }
    if (m4) { m4.classList.toggle("done", done); m4.classList.toggle("now", false); }
  }

  function emitStepRow(stepNum) {
    var r = currentReading();
    var rows = r.traceRows || [];
    var row = rows[stepNum - 1] || {
      step: stepNum,
      i: stepNum - 1,
      val: ARR[stepNum - 1],
      isEven: ARR[stepNum - 1] % 2 === 0,
      total: r.evenSum,
      count: r.evenCount
    };
    state.recorded++;
    var detail = {
      n: state.recorded,
      step: row.step,
      i: row.i,
      val: row.val,
      isEven: row.isEven,
      cond: row.val + " % 2 == 0 -> " + (row.isEven ? "True" : "False"),
      total: row.total,
      count: row.count,
      hex: r.hex,
      binary: r.binary,
      decimal: r.decimal,
      authOk: r.authOk,
      contactorClosed: r.contactorClosed
    };
    emit("l06:bench", detail);
    if (state.traceStep >= ARR.length && r.authOk) {
      emit("l06:bench-done", { count: state.recorded, evenSum: r.evenSum, evenCount: r.evenCount, hex: r.hex });
    }
  }

  function setByte(val) {
    state.byteVal = Math.max(0, Math.min(255, Math.round(+val || 0)));
    applyState();
  }

  function toggleBit(bitIdx) {
    var mask = 1 << bitIdx;
    state.byteVal = (state.byteVal ^ mask) & 0xFF;
    applyState();
  }

  function stepTrace() {
    if (state.traceStep < ARR.length) {
      state.traceStep++;
    } else {
      state.traceStep = 1;
    }
    applyState();
    if (kit && kit.takeReading) kit.takeReading();
    emitStepRow(state.traceStep);
  }

  function authenticateAndBoot() {
    state.byteVal = 0x7E;
    if (state.traceStep < ARR.length) {
      while (state.traceStep < ARR.length) {
        state.traceStep++;
        applyState();
        if (kit && kit.takeReading) kit.takeReading();
        emitStepRow(state.traceStep);
      }
    } else {
      applyState();
      if (kit && kit.takeReading) kit.takeReading();
      emitStepRow(ARR.length);
    }
  }

  function reset() {
    state.byteVal = 0x7E;
    state.traceStep = 0;
    state.recorded = 0;
    if (kit && kit.reset) kit.reset();
    applyState();
    emit("l06:bench-reset", {});
  }

  function resolvePart(p) {
    return PART_ALIASES[p] || p;
  }

  function wire() {
    root.querySelectorAll("#bench-hex [data-byte]").forEach(function (b) {
      b.addEventListener("click", function () { setByte(+b.getAttribute("data-byte")); });
    });
    root.querySelectorAll("#bench-bits [data-bit]").forEach(function (b) {
      b.addEventListener("click", function () { toggleBit(+b.getAttribute("data-bit")); });
    });
    var stBtn = document.getElementById("bench-step");
    if (stBtn) stBtn.addEventListener("click", stepTrace);
    var tkBtn = document.getElementById("bench-take");
    if (tkBtn) tkBtn.addEventListener("click", authenticateAndBoot);
    var rsBtn = document.getElementById("bench-reset");
    if (rsBtn) rsBtn.addEventListener("click", reset);
  }

  window.StudyScenes = window.StudyScenes || {};
  window.StudyScenes.bench = {
    setByte: setByte,
    toggleBit: toggleBit,
    step: stepTrace,
    take: authenticateAndBoot,
    takeReading: stepTrace,
    reset: reset,
    highlight: function (p) { if (kit && kit.highlight) kit.highlight(resolvePart(p) || null); },
    rect: function (p) {
      var k = resolvePart(p);
      var parts = (kit && kit.userData && kit.userData.parts) || (kit && kit.parts) || {};
      return (stage && parts[k]) ? stage.rectOf(parts[k], 14) : null;
    },
    reading: currentReading
  };

  wire();
  applyState();
})();
