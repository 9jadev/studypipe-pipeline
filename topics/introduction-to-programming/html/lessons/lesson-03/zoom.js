/* ==========================================================
   StudyPipe — Lesson 03 3D Concept Zoom: Execution Step & Back-Edge Tracer
   Mounts ProgrammingZoom (mode: "loop-jump") on SceneKit stage.
   Parts: initNode, condNode, bodyNode, stepNode, backEdgeArc, exitChute, pulseOrb
   Exposes window.StudyScenes.zoom.
   ========================================================== */
(function () {
  "use strict";
  var root = document.getElementById("zoom-stage");
  var canvas = document.getElementById("zoom-canvas");
  if (!root || !canvas || typeof THREE === "undefined") return;

  var small = root.clientWidth < 560;
  var state = { step: 0, iter: 1, stop: 6 };

  var z = window.ProgrammingZoom ? window.ProgrammingZoom.create({
    mode: "loop-jump",
    labels: !small
  }) : null;

  var stage = window.SceneKit && SceneKit.createStage({
    root: root,
    canvas: canvas,
    fov: 36,
    target: new THREE.Vector3(0, 1.65, 0),
    pitch: 0.14,
    yaw: 0.10,
    minYaw: -1.0,
    maxYaw: 1.0,
    minHeight: 300,
    maxHeight: 430,
    onFrame: function (dt, t) { if (z) z.update(dt, t); }
  });

  if (stage && z) {
    stage.rig.add(z);
    var parts = z.parts || (z.userData && z.userData.parts) || {};
    if (typeof stage.addPart === "function") {
      Object.keys(parts).forEach(function (k) {
        stage.addPart(k, parts[k], k);
      });
    }
    stage.start();
  }

  var countEl = document.getElementById("zoom-counters");
  var STAGE_LABELS = [
    "1. Init (i = 1)",
    "2. Test (i < 6)",
    "3. Body (total += kwh)",
    "4. Step & Back-Edge Jump"
  ];

  function paint() {
    if (!countEl || !z) return;
    var r = z.reading() || {};
    var stLabel = r.exitChuteActive ? "EXIT (i = 6 → False)" : STAGE_LABELS[state.step];
    countEl.innerHTML =
      '<span class="counter"><i style="--c:#ffb703"></i>Stage<b>' + stLabel + "</b></span>" +
      '<span class="counter"><i style="--c:#38bdf8"></i>Counter<b>i = ' + r.iter + " (stop=6)</b></span>" +
      '<span class="counter"><i style="--c:#10b981"></i>Condition<b>' + r.conditionExpr + " → " + (r.conditionResult ? "True" : "False") + "</b></span>" +
      '<span class="counter"><i style="--c:#a855f7"></i>Accumulator<b>' + r.total + " kWh</b></span>";
  }

  function applyState(emitEvt) {
    if (z) z.setState({ step: state.step, iter: state.iter, stop: state.stop });
    root.querySelectorAll("#zoom-steps [data-step]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(+b.getAttribute("data-step") === state.step));
    });
    var sl = document.getElementById("zoom-iter");
    if (sl) sl.value = String(state.iter);
    var lbl = document.getElementById("zoom-iter-val");
    if (lbl) lbl.textContent = "i = " + state.iter + (state.iter >= 6 ? " (Exit)" : "");
    paint();
    if (emitEvt) {
      document.dispatchEvent(new CustomEvent("l03:zoom", {
        detail: { mode: "loop-jump", step: state.step, iter: state.iter }
      }));
    }
  }

  function setStep(s) {
    state.step = Math.max(0, Math.min(3, +s || 0));
    applyState(true);
  }

  function setIter(it) {
    state.iter = Math.max(1, Math.min(6, +it || 1));
    applyState(true);
  }

  function nextStep() {
    if (state.iter >= 6) {
      state.iter = 1;
      state.step = 0;
    } else if (state.step < 3) {
      state.step++;
    } else {
      state.step = 1;
      state.iter = Math.min(6, state.iter + 1);
    }
    applyState(true);
  }

  function reset() {
    state.step = 0;
    state.iter = 1;
    if (z) z.reset();
    applyState(false);
  }

  root.querySelectorAll("#zoom-steps [data-step]").forEach(function (b) {
    b.addEventListener("click", function () { setStep(+b.getAttribute("data-step")); });
  });
  var isl = document.getElementById("zoom-iter");
  if (isl) isl.addEventListener("input", function () { setIter(+isl.value); });
  var nxt = document.getElementById("zoom-next");
  if (nxt) nxt.addEventListener("click", nextStep);
  var rst = document.getElementById("zoom-reset");
  if (rst) rst.addEventListener("click", reset);

  window.StudyScenes = window.StudyScenes || {};
  window.StudyScenes.zoom = {
    setMode: function () {},
    setStep: setStep,
    setIter: setIter,
    next: nextStep,
    reset: reset,
    highlight: function (p) { if (z) z.highlight(p || null); },
    rect: function (p) {
      var parts = z && (z.parts || (z.userData && z.userData.parts));
      return (stage && parts && parts[p]) ? stage.rectOf(parts[p], 14) : null;
    },
    reading: function () { return z ? z.reading() : null; }
  };

  applyState(false);
})();
