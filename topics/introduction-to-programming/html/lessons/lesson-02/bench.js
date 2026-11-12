/* Lesson 02 · 3D Logic Switchboard practical bench (window.StudyScenes.bench).
   Mounts the shared programming-bench kit (mode "logic-switchboard") on a SceneKit stage.
   Expected 5 trials for `battery < 20 and not grid_online`:
   (18%, False) -> True (ON), (18%, True) -> False (OFF), (45%, False) -> False (OFF),
   (45%, True) -> False (OFF), (12%, False) -> True (ON). */
(function () {
  "use strict";
  var root = document.getElementById("bench-stage");
  var canvas = document.getElementById("bench-canvas");
  if (!root || !canvas || typeof THREE === "undefined") return;

  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var readoutEl = document.getElementById("bench-readout");
  var hintEl = document.getElementById("bench-hint");

  var state = { battery: 18, grid_online: false, logicMode: "fixed" };
  var TRIAL_PRESETS = [
    { battery: 18, grid_online: false },
    { battery: 18, grid_online: true },
    { battery: 45, grid_online: false },
    { battery: 45, grid_online: true },
    { battery: 12, grid_online: false }
  ];
  var presetIdx = 0;
  var recorded = 0;

  var kit = window.ProgrammingBench ? window.ProgrammingBench.create({
    mode: "logic-switchboard",
    onEvent: onKitEvent
  }) : null;

  var stage = window.SceneKit && SceneKit.createStage({
    root: root, canvas: canvas, fov: 36,
    target: new THREE.Vector3(0, 0.35, 0), pitch: 0.48, yaw: 0.06,
    minYaw: -0.95, maxYaw: 0.95, minHeight: 320, maxHeight: 450,
    onFrame: function (dt, t) { if (kit) kit.update(dt, t); }
  });

  if (stage && kit) {
    stage.rig.add(kit);
    if (stage.addPart && kit.userData && kit.userData.parts) {
      Object.keys(kit.userData.parts).forEach(function (k) {
        stage.addPart(k, kit.userData.parts[k], k);
      });
    }
    kit.setState({ battery: state.battery, grid_online: state.grid_online, logicMode: state.logicMode });
    stage.start();
  }

  function modeLabel(m) {
    if (m === "buggy") return "AND (Buggy)";
    if (m === "or_mode") return "OR Gate";
    return "AND NOT";
  }

  function paintReadout() {
    if (!readoutEl) return;
    var r = kit ? kit.reading() : {
      battery: state.battery,
      grid_online: state.grid_online,
      logicMode: state.logicMode,
      relay_on: state.logicMode === "buggy"
        ? (state.battery < 20 && state.grid_online)
        : (state.logicMode === "or_mode" ? (state.battery < 20 || !state.grid_online) : (state.battery < 20 && !state.grid_online))
    };
    var on = !!r.relay_on;
    readoutEl.innerHTML =
      '<div><span>Battery</span><b>' + r.battery + '%</b></div>' +
      '<div><span>Grid</span><b class="sm">' + (r.grid_online ? "True (ON)" : "False (OFF)") + '</b></div>' +
      '<div><span>Gate</span><b class="sm">' + modeLabel(r.logicMode) + '</b></div>' +
      '<div class="' + (on ? "hot" : "") + '"><span>Relay</span><b>' + (on ? "ON (True)" : "OFF (False)") + '</b></div>';
  }

  function paintHint() {
    if (!hintEl) return;
    hintEl.innerHTML = "Recorded <b>" + recorded + " of 5</b> trials";
    var cards = [
      document.getElementById("m1"),
      document.getElementById("m2"),
      document.getElementById("m3"),
      document.getElementById("m4")
    ];
    cards.forEach(function (c, i) {
      if (!c) return;
      c.classList.toggle("done", recorded > i);
      c.classList.toggle("now", recorded === i || (i === 3 && recorded >= 3 && recorded < 5));
    });
  }

  function onKitEvent(name, detail) {
    if (name === "reading") {
      recorded++;
      emit("l02:bench", detail);
      paintReadout();
      paintHint();
      if (recorded >= 5) {
        emit("l02:bench-done", { count: recorded });
      }
    } else if (name === "done") {
      if (recorded >= 3) {
        emit("l02:bench-done", { count: recorded });
      }
    } else if (name === "reset") {
      recorded = 0;
      presetIdx = 0;
      emit("l02:bench-reset", {});
      paintReadout();
      paintHint();
    } else if (name === "state") {
      paintReadout();
    }
  }

  function syncButtons() {
    root.querySelectorAll("#bench-mode [data-mode]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-mode") === state.logicMode));
    });
    root.querySelectorAll("#bench-inputs [data-bat]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(+b.getAttribute("data-bat") === state.battery));
    });
    root.querySelectorAll("#bench-inputs [data-grid]").forEach(function (b) {
      b.setAttribute("aria-pressed", String((b.getAttribute("data-grid") === "true") === state.grid_online));
    });
  }

  function setMode(m) {
    state.logicMode = m || "fixed";
    if (kit) kit.setState({ logicMode: state.logicMode });
    syncButtons();
    paintReadout();
  }

  function setBattery(bat) {
    state.battery = Number(bat);
    if (kit) kit.setState({ battery: state.battery });
    syncButtons();
    paintReadout();
  }

  function setGrid(g) {
    state.grid_online = Boolean(g);
    if (kit) kit.setState({ grid_online: state.grid_online });
    syncButtons();
    paintReadout();
  }

  function take() {
    if (kit) kit.takeReading();
  }

  function stepCombo() {
    presetIdx = (presetIdx + 1) % TRIAL_PRESETS.length;
    var p = TRIAL_PRESETS[presetIdx];
    state.battery = p.battery;
    state.grid_online = p.grid_online;
    if (kit) kit.setState({ battery: state.battery, grid_online: state.grid_online });
    syncButtons();
    take();
  }

  function reset() {
    state.battery = 18;
    state.grid_online = false;
    state.logicMode = "fixed";
    presetIdx = 0;
    recorded = 0;
    if (kit) {
      kit.reset();
      kit.setState({ battery: 18, grid_online: false, logicMode: "fixed" });
    }
    syncButtons();
    paintReadout();
    paintHint();
  }

  root.querySelectorAll("#bench-mode [data-mode]").forEach(function (b) {
    b.addEventListener("click", function () { setMode(b.getAttribute("data-mode")); });
  });
  root.querySelectorAll("#bench-inputs [data-bat]").forEach(function (b) {
    b.addEventListener("click", function () { setBattery(+b.getAttribute("data-bat")); });
  });
  root.querySelectorAll("#bench-inputs [data-grid]").forEach(function (b) {
    b.addEventListener("click", function () { setGrid(b.getAttribute("data-grid") === "true"); });
  });

  var btnTake = document.getElementById("bench-take");
  var btnStep = document.getElementById("bench-step");
  var btnReset = document.getElementById("bench-reset");
  if (btnTake) btnTake.addEventListener("click", take);
  if (btnStep) btnStep.addEventListener("click", stepCombo);
  if (btnReset) btnReset.addEventListener("click", reset);

  window.StudyScenes = window.StudyScenes || {};
  window.StudyScenes.bench = {
    setMode: setMode,
    setBattery: setBattery,
    setGrid: setGrid,
    take: take,
    takeReading: take,
    step: stepCombo,
    reset: reset,
    reading: function () { return kit ? kit.reading() : state; },
    highlight: function (p) {
      if (kit && kit.highlight) kit.highlight(p || null);
      if (stage && stage.highlight) stage.highlight(p || null);
    },
    rect: function (p) {
      if (stage && kit && kit.userData && kit.userData.parts && kit.userData.parts[p]) {
        return stage.rectOf(kit.userData.parts[p], 14);
      }
      return kit && kit.rect ? kit.rect(p) : null;
    }
  };

  paintReadout();
  paintHint();
})();
