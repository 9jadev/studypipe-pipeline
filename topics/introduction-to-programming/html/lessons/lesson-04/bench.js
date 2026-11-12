/* Lesson 04 · 3D Contiguous Array Locker Rack Bench (window.StudyScenes.bench).
   Mounts the shared programming-bench kit (mode "array-rack") on a SceneKit stage.
   Cells: [3.25, 3.18, 3.30, 2.95, 3.22, 3.15, 3.28, 3.20] V at 0x1000..0x101C;
   Index 3 holds 2.95 V (weakest, 4th cell); Index 8 (0x1020) triggers IndexError. */
(function () {
  "use strict";
  var root = document.getElementById("bench-stage");
  var canvas = document.getElementById("bench-canvas");
  if (!root || !canvas || typeof THREE === "undefined") return;

  var emit = function (n, d) {
    document.dispatchEvent(new CustomEvent(n, { detail: d || {} }));
  };
  var readoutEl = document.getElementById("bench-readout");
  var hintEl = document.getElementById("bench-hint");

  var state = { index: 0, seen0: false, seen7: false, seen8: false, scanned: false };
  var recordedCount = 0;

  var kit = window.ProgrammingBench
    ? window.ProgrammingBench.create({
        mode: "array-rack",
        onEvent: onKitEvent
      })
    : null;

  var stage =
    window.SceneKit &&
    SceneKit.createStage({
      root: root,
      canvas: canvas,
      fov: 36,
      target: new THREE.Vector3(0, 0.45, 0),
      pitch: 0.42,
      yaw: 0.04,
      minYaw: -0.95,
      maxYaw: 0.95,
      minHeight: 320,
      maxHeight: 440,
      onFrame: function (dt, t) {
        if (kit && kit.update) kit.update(dt, t);
      }
    });

  if (stage && kit) {
    stage.rig.add(kit);
    var parts = (kit.userData && kit.userData.parts) || kit.parts || {};
    Object.keys(parts).forEach(function (k) {
      if (stage.addPart) stage.addPart(k, parts[k], k);
    });
    kit.setState({ index: 0 });
    stage.start();
  }

  function updateMethodCards() {
    var m1 = document.getElementById("m1");
    var m2 = document.getElementById("m2");
    var m3 = document.getElementById("m3");
    var m4 = document.getElementById("m4");
    if (!m1) return;
    [m1, m2, m3, m4].forEach(function (el) {
      if (el) el.classList.remove("now", "done");
    });
    if (state.seen0) m1.classList.add("done");
    if (state.seen7) m2.classList.add("done");
    if (state.seen8) m3.classList.add("done");
    if (state.scanned) m4.classList.add("done");

    if (!state.seen0) m1.classList.add("now");
    else if (!state.seen7) m2.classList.add("now");
    else if (!state.seen8) m3.classList.add("now");
    else m4.classList.add("now");
  }

  function paintReadout() {
    if (!readoutEl || !kit) return;
    var r = kit.reading();
    var oob = !!r.outOfBounds;
    var valStr = oob ? "IndexError" : r.value != null ? r.value.toFixed(2) + " V" : "–";
    var statusStr = oob
      ? "OUT OF BOUNDS"
      : r.index === 3
      ? "WEAK (Cell 4)"
      : "OK (Cell " + (r.index + 1) + ")";
    readoutEl.innerHTML =
      '<div><span>Index [i]</span><b>[' + r.index + "]</b></div>" +
      '<div><span>Address</span><b class="sm">' + r.address + " (+" + r.offset + "B)</b></div>" +
      '<div class="' + (oob || r.index === 3 ? "hot" : "") + '"><span>cells[i]</span><b>' + valStr + "</b></div>" +
      '<div class="' + (oob ? "hot" : "") + '"><span>Status</span><b class="sm">' + statusStr + "</b></div>";
  }

  function paintHint() {
    if (!hintEl) return;
    var r = kit ? kit.reading() : null;
    if (r && r.outOfBounds) {
      hintEl.innerHTML = '<b>IndexError!</b> Index 8 is outside 0..7 (' + recordedCount + " logged)";
    } else {
      hintEl.innerHTML = "Recorded <b>" + recordedCount + "</b> reading" + (recordedCount === 1 ? "" : "s") + " · Weakest: cells[3] = 2.95 V";
    }
  }

  function onKitEvent(name, detail) {
    if (name === "reading") {
      recordedCount++;
      var idx = detail && detail.index != null ? detail.index : state.index;
      if (idx === 0) state.seen0 = true;
      if (idx === 7) state.seen7 = true;
      if (idx === 8) state.seen8 = true;
      updateMethodCards();
      paintReadout();
      paintHint();
      emit("l04:bench", detail);
      if (recordedCount >= 4 || (state.seen0 && state.seen8) || state.scanned) {
        emit("l04:bench-done", { count: recordedCount, reading: detail });
      }
    } else if (name === "done") {
      emit("l04:bench-done", { count: recordedCount, reading: detail });
    } else if (name === "reset") {
      recordedCount = 0;
      state.seen0 = false;
      state.seen7 = false;
      state.seen8 = false;
      state.scanned = false;
      updateMethodCards();
      paintReadout();
      paintHint();
      emit("l04:bench-reset", {});
    } else if (name === "state") {
      paintReadout();
    }
  }

  function syncButtons() {
    root.querySelectorAll("#bench-idx [data-idx]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(+b.getAttribute("data-idx") === state.index));
    });
  }

  function setIndex(idx) {
    idx = Math.max(0, Math.min(8, Math.round(+idx || 0)));
    state.index = idx;
    if (kit) kit.setState({ index: idx });
    syncButtons();
    paintReadout();
  }

  function take() {
    if (!kit) return;
    kit.takeReading();
  }

  function scanMin() {
    if (!kit) return;
    state.scanned = true;
    // Log key boundary & minimum slots if not yet logged, then focus on weakest cell (index 3)
    var order = [0, 3, 7];
    order.forEach(function (idx) {
      state.index = idx;
      kit.setState({ index: idx, scanStep: 8 });
      kit.takeReading();
    });
    setIndex(3);
    updateMethodCards();
    emit("l04:bench-done", { count: recordedCount, reading: kit.reading(), scanned: true });
  }

  function reset() {
    state.index = 0;
    recordedCount = 0;
    state.seen0 = false;
    state.seen7 = false;
    state.seen8 = false;
    state.scanned = false;
    if (kit) {
      kit.reset();
      kit.setState({ index: 0, scanStep: 8 });
    }
    syncButtons();
    updateMethodCards();
    paintReadout();
    paintHint();
  }

  function wire() {
    root.querySelectorAll("#bench-idx [data-idx]").forEach(function (b) {
      b.addEventListener("click", function () {
        setIndex(+b.getAttribute("data-idx"));
      });
    });
    var tk = document.getElementById("bench-take");
    if (tk) tk.addEventListener("click", take);
    var sc = document.getElementById("bench-scan");
    if (sc) sc.addEventListener("click", scanMin);
    var rs = document.getElementById("bench-reset");
    if (rs) rs.addEventListener("click", reset);
  }

  window.StudyScenes = window.StudyScenes || {};
  window.StudyScenes.bench = {
    setMode: function (m) {
      if (kit && kit.setMode) kit.setMode(m);
    },
    setIndex: setIndex,
    take: take,
    takeReading: take,
    scan: scanMin,
    step: function () {
      if (kit && kit.step) {
        var row = kit.step();
        state.index = kit.reading().index;
        syncButtons();
        return row;
      }
    },
    reset: reset,
    highlight: function (p) {
      if (kit && kit.highlight) kit.highlight(p || null);
    },
    rect: function (p) {
      var parts = (kit && ((kit.userData && kit.userData.parts) || kit.parts)) || null;
      return stage && parts && parts[p] ? stage.rectOf(parts[p], 14) : null;
    },
    reading: function () {
      return kit ? kit.reading() : null;
    }
  };

  wire();
  syncButtons();
  updateMethodCards();
  paintReadout();
  paintHint();
})();
