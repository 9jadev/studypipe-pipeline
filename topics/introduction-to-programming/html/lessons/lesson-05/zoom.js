/* ==========================================================
   StudyPipe — Lesson 05 3D Concept Zoom (`window.StudyScenes.zoom`)
   Mounts `ProgrammingZoom` (mode: "stack-frame") on a SceneKit stage.
   Parts: globalBase, stackFrame, oneWayGlass, localVars, returnOrb
   Steps: 0 = Idle, 1 = Push Frame, 2 = Execute Local, 3 = Return & Pop
   ========================================================== */
(function () {
  "use strict";
  var root = document.getElementById("zoom-stage");
  var canvas = document.getElementById("zoom-canvas");
  if (!root || !canvas || typeof THREE === "undefined") return;

  var small = root.clientWidth < 560;
  var state = { step: 0, units: 85 };

  var z = window.ProgrammingZoom ? window.ProgrammingZoom.create({
    mode: "stack-frame",
    labels: !small
  }) : null;

  var stage = window.SceneKit && SceneKit.createStage({
    root: root,
    canvas: canvas,
    fov: 36,
    target: new THREE.Vector3(0, 1.35, 0),
    pitch: 0.22,
    yaw: 0.1,
    minYaw: -1.0,
    maxYaw: 1.0,
    minHeight: 300,
    maxHeight: 430,
    onFrame: function (dt, t) { if (z) z.update(dt, t); }
  });

  if (stage && z) {
    stage.rig.add(z);
    if (stage.addPart && z.parts) {
      Object.keys(z.parts).forEach(function (k) {
        stage.addPart(k, z.parts[k], k);
      });
    }
    stage.start();
  }

  var countEl = document.getElementById("zoom-counters");
  var PHASE_LABELS = {
    idle: "0 · Idle (No Frame)",
    push: "1 · Call & Push Frame",
    execute: "2 · Local Execution",
    return_pop: "3 · Return & Pop Frame"
  };

  function naira(v) {
    if (v == null) return "—";
    return "₦" + Number(v).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function paint() {
    if (!countEl || !z) return;
    var r = z.reading();
    var pLabel = PHASE_LABELS[r.phase] || r.phase;
    var locState = r.frameAllocated ? "Allocated (" + naira(r.local_total_bill) + ")" : (r.returnDelivered ? "Popped (Freed)" : "Unallocated");
    countEl.innerHTML =
      '<span class="counter"><i style="--c:#48bfe3"></i>Phase<b>' + pLabel + '</b></span>' +
      '<span class="counter"><i style="--c:#f59e0b"></i>Local Frame<b>' + locState + '</b></span>' +
      '<span class="counter"><i style="--c:#ffd166"></i>Return Value<b>' + naira(r.returnValue) + '</b></span>' +
      '<span class="counter"><i style="--c:#38ef7d"></i>Global Revenue<b>' + naira(r.global_total_revenue) + '</b></span>';
  }

  function setStep(st) {
    state.step = Math.max(0, Math.min(3, Math.round(+st || 0)));
    if (z) z.setState({ step: state.step, units: state.units });
    root.querySelectorAll("#zoom-steps [data-step]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(+b.getAttribute("data-step") === state.step));
    });
    paint();
    document.dispatchEvent(new CustomEvent("l05:zoom", { detail: { mode: "stack-frame", step: state.step, units: state.units } }));
  }

  function setUnits(u) {
    state.units = +u || 85;
    if (z) z.setState({ step: state.step, units: state.units });
    root.querySelectorAll("#zoom-units [data-units]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(+b.getAttribute("data-units") === state.units));
    });
    paint();
    document.dispatchEvent(new CustomEvent("l05:zoom", { detail: { mode: "stack-frame", step: state.step, units: state.units } }));
  }

  function nextStep() {
    setStep((state.step + 1) % 4);
  }

  function reset() {
    state.step = 0;
    state.units = 85;
    if (z) {
      z.reset();
      z.setState({ step: 0, units: 85 });
    }
    root.querySelectorAll("#zoom-steps [data-step]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(+b.getAttribute("data-step") === 0));
    });
    root.querySelectorAll("#zoom-units [data-units]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(+b.getAttribute("data-units") === 85));
    });
    paint();
  }

  root.querySelectorAll("#zoom-steps [data-step]").forEach(function (b) {
    b.addEventListener("click", function () { setStep(+b.getAttribute("data-step")); });
  });
  root.querySelectorAll("#zoom-units [data-units]").forEach(function (b) {
    b.addEventListener("click", function () { setUnits(+b.getAttribute("data-units")); });
  });
  var rst = document.getElementById("zoom-reset");
  if (rst) rst.addEventListener("click", reset);

  var PART_ALIASES = {
    globalBox: "globalBase",
    glassWall: "oneWayGlass",
    returnArrow: "returnOrb"
  };
  function resolvePart(p) {
    if (!p) return null;
    return PART_ALIASES[p] || p;
  }

  window.StudyScenes = window.StudyScenes || {};
  window.StudyScenes.zoom = {
    setMode: function () {},
    setStep: setStep,
    setUnits: setUnits,
    next: nextStep,
    reset: reset,
    reading: function () { return z ? z.reading() : null; },
    highlight: function (p) { if (z) z.highlight(resolvePart(p)); },
    rect: function (p) {
      var k = resolvePart(p);
      return (stage && z && z.parts && z.parts[k]) ? stage.rectOf(z.parts[k], 14) : null;
    }
  };

  paint();
})();
