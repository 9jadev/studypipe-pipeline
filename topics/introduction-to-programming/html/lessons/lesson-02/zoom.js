/* Lesson 02 · 3D concept zoom (window.StudyScenes.zoom): Decision Tree Visualizer.
   Mounts the shared programming-zoom kit (mode "decision-tree") on a SceneKit stage.
   Parts: rootDiamond, secondDiamond, trueBranch, falseBranch, genAction, solarAction. */
(function () {
  "use strict";
  var root = document.getElementById("zoom-stage");
  var canvas = document.getElementById("zoom-canvas");
  if (!root || !canvas || typeof THREE === "undefined") return;

  var small = window.innerWidth < 560;
  var state = { step: 0, battery: 15, grid_online: false };

  var z = window.ProgrammingZoom ? window.ProgrammingZoom.create({
    mode: "decision-tree",
    labels: !small
  }) : null;

  var stage = window.SceneKit && SceneKit.createStage({
    root: root, canvas: canvas, fov: 36,
    target: new THREE.Vector3(0, 0.25, 0), pitch: 0.26, yaw: 0.08,
    minYaw: -1.0, maxYaw: 1.0, minHeight: 300, maxHeight: 430,
    onFrame: function (dt, t) { if (z) z.update(dt, t); }
  });

  if (stage && z) {
    stage.rig.add(z);
    if (stage.addPart && z.parts) {
      Object.keys(z.parts).forEach(function (k) {
        stage.addPart(k, z.parts[k], k);
      });
    }
    z.setState({ step: state.step, battery: state.battery, grid_online: state.grid_online });
    stage.start();
  }

  var countEl = document.getElementById("zoom-counters");
  function paint() {
    if (!countEl) return;
    var r = z ? z.reading() : {
      stageName: ["sensor_input", "root_battery_check", "second_grid_check", "action_terminal"][state.step] || "sensor_input",
      cond1_val: state.battery < 20,
      cond2_val: !state.grid_online,
      activeAction: (state.battery < 20 && !state.grid_online) ? "activate_generator()" : "maintain_solar_charge()"
    };
    countEl.innerHTML =
      '<span class="counter"><i style="--c:#3ee6c4"></i>Stage<b>' + r.stageName + '</b></span>' +
      '<span class="counter"><i style="--c:#ffb23f"></i>battery &lt; 20<b>' + (r.cond1_val ? "True" : "False") + '</b></span>' +
      '<span class="counter"><i style="--c:#7cc4ff"></i>not grid_online<b>' + (r.cond2_val ? "True" : "False") + '</b></span>' +
      '<span class="counter"><i style="--c:#f43f5e"></i>Branch<b>' + r.activeAction + '</b></span>';
  }

  function syncButtons() {
    root.querySelectorAll("#zoom-steps [data-step]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(+b.getAttribute("data-step") === state.step));
    });
    root.querySelectorAll("#zoom-scenarios [data-bat]").forEach(function (b) {
      var bat = +b.getAttribute("data-bat");
      var grd = b.getAttribute("data-grid") === "true";
      b.setAttribute("aria-pressed", String(bat === state.battery && grd === state.grid_online));
    });
  }

  function setStep(st) {
    state.step = Math.max(0, Math.min(3, Number(st) || 0));
    if (z) z.setState({ step: state.step });
    syncButtons();
    paint();
    document.dispatchEvent(new CustomEvent("l02:zoom", { detail: { mode: "decision-tree", step: state.step } }));
  }

  function setScenario(bat, grid) {
    state.battery = Number(bat);
    state.grid_online = Boolean(grid);
    if (z) z.setState({ battery: state.battery, grid_online: state.grid_online });
    syncButtons();
    paint();
    document.dispatchEvent(new CustomEvent("l02:zoom", { detail: { mode: "decision-tree", battery: state.battery, grid_online: state.grid_online } }));
  }

  function next() {
    setStep((state.step + 1) % 4);
  }

  function reset() {
    state.step = 0;
    state.battery = 15;
    state.grid_online = false;
    if (z) {
      z.reset();
      z.setState({ step: 0, battery: 15, grid_online: false });
    }
    syncButtons();
    paint();
  }

  root.querySelectorAll("#zoom-steps [data-step]").forEach(function (b) {
    b.addEventListener("click", function () { setStep(+b.getAttribute("data-step")); });
  });
  root.querySelectorAll("#zoom-scenarios [data-bat]").forEach(function (b) {
    b.addEventListener("click", function () {
      setScenario(+b.getAttribute("data-bat"), b.getAttribute("data-grid") === "true");
    });
  });
  var rst = document.getElementById("zoom-reset");
  if (rst) rst.addEventListener("click", reset);

  window.StudyScenes = window.StudyScenes || {};
  window.StudyScenes.zoom = {
    setMode: function () {},
    setStep: setStep,
    setScenario: setScenario,
    next: next,
    reset: reset,
    reading: function () { return z ? z.reading() : state; },
    highlight: function (p) {
      if (z && z.highlight) z.highlight(p || null);
      if (stage && stage.highlight) stage.highlight(p || null);
    },
    rect: function (p) {
      if (stage && z && z.parts && z.parts[p]) {
        return stage.rectOf(z.parts[p], 14);
      }
      return z && z.rect ? z.rect(p) : null;
    }
  };

  paint();
})();
