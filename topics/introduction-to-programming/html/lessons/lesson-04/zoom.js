/* Lesson 04 · 3D Concept Zoom: The Memory Offset Inspector (window.StudyScenes.zoom).
   Mounts the shared programming-zoom kit (mode "memory-offset") on a SceneKit stage.
   Visualises Address(i) = Base (0x1000) + i × 4 bytes across 8 contiguous 4-byte RAM slots
   and the red boundary wall at Index 8 (0x1020 Out of Bounds). */
(function () {
  "use strict";
  var root = document.getElementById("zoom-stage");
  var canvas = document.getElementById("zoom-canvas");
  if (!root || !canvas || typeof THREE === "undefined") return;

  var CELLS = [3.25, 3.18, 3.30, 2.95, 3.22, 3.15, 3.28, 3.20];
  var state = { index: 0 };

  var z = window.ProgrammingZoom
    ? window.ProgrammingZoom.create({
        mode: "memory-offset",
        labels: window.innerWidth >= 560
      })
    : null;

  var stage =
    window.SceneKit &&
    SceneKit.createStage({
      root: root,
      canvas: canvas,
      fov: 36,
      target: new THREE.Vector3(0.2, 0.55, 0),
      pitch: 0.22,
      yaw: 0.06,
      minYaw: -1.0,
      maxYaw: 1.0,
      minHeight: 300,
      maxHeight: 430,
      onFrame: function (dt, t) {
        if (z && z.update) z.update(dt, t);
      }
    });

  if (stage && z) {
    stage.rig.add(z);
    var parts = z.parts || (z.userData && z.userData.parts) || {};
    Object.keys(parts).forEach(function (k) {
      if (stage.addPart) stage.addPart(k, parts[k], k);
    });
    z.setState({ index: 0, values: CELLS });
    stage.start();
  }

  var countEl = document.getElementById("zoom-counters");

  function paint() {
    if (!countEl || !z) return;
    var r = z.reading();
    var valText = r.inBounds && CELLS[r.index] != null
      ? CELLS[r.index].toFixed(2) + " V"
      : "IndexError!";
    countEl.innerHTML =
      '<span class="counter"><i style="--c:#ffb703"></i>Base<b>' + r.baseAddress + "</b></span>" +
      '<span class="counter"><i style="--c:#38ef7d"></i>Offset<b>+' + r.offsetBytes + " B (" + r.index + "×4)</b></span>" +
      '<span class="counter"><i style="--c:#48bfe3"></i>Addr<b>' + r.addressHex + "</b></span>" +
      '<span class="counter"><i style="--c:' + (r.inBounds ? "#3ee6c4" : "#f43f5e") + '"></i>cells[' + r.index + "]<b>" + valText + "</b></span>";
  }

  function syncUI() {
    root.querySelectorAll("#zoom-idx [data-zidx]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(+b.getAttribute("data-zidx") === state.index));
    });
    var sl = document.getElementById("zoom-slider");
    if (sl) sl.value = state.index;
    var lbl = document.getElementById("zoom-idx-val");
    if (lbl) lbl.textContent = "[" + state.index + "]";
  }

  function setIndex(idx) {
    idx = Math.max(0, Math.min(8, Math.round(+idx || 0)));
    state.index = idx;
    if (z) z.setState({ index: idx, values: CELLS });
    syncUI();
    paint();
    document.dispatchEvent(
      new CustomEvent("l04:zoom", { detail: { mode: "memory-offset", index: idx } })
    );
  }

  function reset() {
    state.index = 0;
    if (z) {
      z.reset();
      z.setState({ index: 0, values: CELLS });
    }
    syncUI();
    paint();
  }

  root.querySelectorAll("#zoom-idx [data-zidx]").forEach(function (b) {
    b.addEventListener("click", function () {
      setIndex(+b.getAttribute("data-zidx"));
    });
  });
  var sl = document.getElementById("zoom-slider");
  if (sl) {
    sl.addEventListener("input", function () {
      setIndex(+sl.value);
    });
  }
  var rst = document.getElementById("zoom-reset");
  if (rst) rst.addEventListener("click", reset);

  window.StudyScenes = window.StudyScenes || {};
  window.StudyScenes.zoom = {
    setMode: function (m) {
      if (z && z.setMode) z.setMode(m);
    },
    setIndex: setIndex,
    next: function () {
      setIndex((state.index + 1) % 9);
    },
    reset: reset,
    highlight: function (p) {
      if (z && z.highlight) z.highlight(p || null);
    },
    rect: function (p) {
      var parts = (z && (z.parts || (z.userData && z.userData.parts))) || null;
      return stage && parts && parts[p] ? stage.rectOf(parts[p], 14) : null;
    },
    reading: function () {
      return z ? z.reading() : null;
    }
  };

  syncUI();
  paint();
})();
