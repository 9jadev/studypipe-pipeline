/* Lesson 03 · 3D Network & Cell Array Builder Bench
   Real apparatus: dry cells in holders (single / series / parallel) or a lead-acid accumulator,
   colour-banded resistors on terminal boards (series / parallel / combo / single load), plug key,
   0–5 A ammeter and PVC wiring with charge dots whose speed follows the current in each part.
   Trial buttons T1–T6 set the bench to exactly the six lab-notebook circuits in data.js.

   Events:  bench:config  (topology / supply changed — detail: state)
            bench:record  (Log reading — detail: state; the narrator waits on this)
            l3:bench-live (every recompute — detail: snapshot())
            l3:bench      (Log reading with the key closed — detail: snapshot()) */
(function () {
  "use strict";
  var root = document.getElementById("bench-stage");
  var canvas = document.getElementById("bench-canvas");

  // Supplies: E and r of the whole source. Cells are 2.0 V, 1.5 Ω each.
  var SUPPLY = {
    single:    { E: 2.0,  r: 1.5, tag: "1 cell · 2.0 V, r 1.5 Ω",          ro: "1 cell" },
    series3:   { E: 6.0,  r: 4.5, tag: "3 in series · 6.0 V, r 4.5 Ω",     ro: "3 in series" },
    parallel3: { E: 2.0,  r: 0.5, tag: "3 in parallel · 2.0 V, r 0.5 Ω",   ro: "3 in parallel" },
    acc12:     { E: 12.0, r: 0.0, tag: "12 V accumulator · r ≈ 0",          ro: "12 V acc." },
    bat14:     { E: 14.0, r: 1.0, tag: "14 V battery · r 1.0 Ω",            ro: "14 V batt." }
  };
  // The six lab-notebook trials (data.js t1–t6) as bench settings
  var TRIALS = {
    t1: { cellArray: "acc12",     topology: "series",   r1: 4, r2: 12, chip: "T1 · 4 Ω + 12 Ω in series on 12 V" },
    t2: { cellArray: "acc12",     topology: "parallel", r1: 4, r2: 12, chip: "T2 · 4 Ω ∥ 12 Ω on 12 V" },
    t3: { cellArray: "bat14",     topology: "combo",    r1: 4, r2: 12, chip: "T3 · 3 Ω + (4 Ω ∥ 12 Ω), r = 1 Ω" },
    t4: { cellArray: "series3",   topology: "load",     rLoad: 1.5,    chip: "T4 · series cells on R = 1.5 Ω" },
    t5: { cellArray: "parallel3", topology: "load",     rLoad: 1.5,    chip: "T5 · parallel cells on R = 1.5 Ω" },
    t6: { cellArray: "parallel3", topology: "load",     rLoad: 0.3,    chip: "T6 · parallel cells on 0.3 Ω starter" }
  };

  var state = {
    topology: "parallel", // "series", "parallel", "combo", "load"
    cellArray: "parallel3", // "single", "series3", "parallel3", "acc12", "bat14"
    r1: 4.0,
    r2: 12.0,
    r3: 3.0,
    rLoad: 1.5,
    cellE: 2.0,
    cellR: 1.5,
    switchClosed: true,
    trial: null,
    E_eq: 2.0,
    r_eq: 0.5,
    R_eq: 3.0,
    I_main: 0.57,
    I1: 0.43,
    I2: 0.14,
    V_term: 1.71,
    P_load: 0.98,
    P_lost: 0.16,
    eff: 85.7
  };

  var topSel = document.getElementById("ctl-topology");
  var cellSel = document.getElementById("ctl-cells");
  var r1Slider = document.getElementById("ctl-r1");
  var r2Slider = document.getElementById("ctl-r2");
  var rlSlider = document.getElementById("ctl-rl");
  var r1Val = document.getElementById("ctl-r1-val");
  var r2Val = document.getElementById("ctl-r2-val");
  var rlVal = document.getElementById("ctl-rl-val");
  var btnKey = document.getElementById("bench-key");
  var btnRecord = document.getElementById("bench-record");
  var chip = document.getElementById("bench-instruction");

  var battGroup, netGroup, acc, holders = [], links = [], busbars = [];
  var boardR1, boardR2, boardR3, key, ammeter, wires, flows = [];
  var tagPack, tagR1, tagR2, tagR3, tagAmm, tagKey;

  var api = {
    rect: function (part) {
      if (!stage) return null;
      var obj = part === "bob" ? battGroup : (part === "ruler" ? netGroup : null);
      return obj ? stage.rectOf(obj) : null;
    },
    highlight: function () {},
    state: function () { return state; },
    setConfig: function (opts) {
      if (!opts) return;
      if (opts.topology) state.topology = opts.topology;
      if (opts.cellArray) state.cellArray = opts.cellArray;
      if (typeof opts.r1 === "number") state.r1 = opts.r1;
      if (typeof opts.r2 === "number") state.r2 = opts.r2;
      if (typeof opts.rLoad === "number") state.rLoad = opts.rLoad;
      syncControls();
      computePhysics();
    },
    loadTrial: loadTrial
  };
  window.StudyScenes = window.StudyScenes || {};
  window.StudyScenes.bench = api;

  var has3D = root && canvas && typeof THREE !== "undefined" && window.Apparatus && window.SceneKit;
  var A = window.Apparatus;
  var stage = has3D && window.SceneKit.createStage({
    root: root,
    canvas: canvas,
    fov: 34,
    target: new THREE.Vector3(0, 0.3, 0.1),
    pitch: 0.5,
    yaw: 0.0,
    fitWidth: 4.9,
    distance: 5.0,
    minYaw: -0.7,
    maxYaw: 0.7,
    onFrame: frame
  });

  if (stage) { build(); stage.start(); }

  function build() {
    var scene = stage.rig;
    scene.add(A.benchTop(6.4, 3.8));

    // Cell pack: three 2.0 V cells in holders
    battGroup = new THREE.Group();
    battGroup.position.set(-1.85, 0, 0.0);
    scene.add(battGroup);
    for (var i = 0; i < 3; i++) {
      var h = A.cellHolder({ text: "2.0 V" });
      h.rotation.y = Math.PI / 2;            // (+) end towards the back
      battGroup.add(h);
      holders.push(h);
    }
    for (var s = 0; s < 2; s++) {           // series links between neighbouring cells
      var lk = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.02, 0.07), A.mat("brass"));
      battGroup.add(lk); links.push(lk);
    }
    for (var b = 0; b < 2; b++) {           // parallel busbars
      var bb = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.018, 0.035), A.mat("copper"));
      battGroup.add(bb); busbars.push(bb);
    }
    // lead-acid accumulator for the resistor-network trials (T1–T3)
    acc = A.accumulator({ text: "12 V" });
    acc.position.set(-1.85, 0, 0.0);
    scene.add(acc);

    netGroup = new THREE.Group();
    netGroup.position.set(0.3, 0, 0.05);
    scene.add(netGroup);
    boardR1 = A.resistorBoard({ ohms: state.r1 });
    boardR2 = A.resistorBoard({ ohms: state.r2 });
    boardR3 = A.resistorBoard({ ohms: state.r3 });
    netGroup.add(boardR1, boardR2, boardR3);

    key = A.plugKey();
    key.position.set(-0.75, 0, 1.15);
    scene.add(key);

    ammeter = A.meter({ unit: "A", majors: [0, 1, 2, 3, 4, 5], minor: 5, sub: "d.c. ammeter", label: "0 – 5 A", size: 1.2 });
    ammeter.position.set(1.95, 0, -0.95);
    ammeter.rotation.y = -0.3;
    scene.add(ammeter);

    wires = A.wireSet(scene);

    tagPack = A.tag("Cells", { h: 0.12, border: "rgba(124,247,212,.6)" });
    tagR1 = A.tag("R₁", { h: 0.11, border: "rgba(62,230,196,.7)" });
    tagR2 = A.tag("R₂", { h: 0.11, border: "rgba(255,178,63,.7)" });
    tagR3 = A.tag("R₃ = 3 Ω", { h: 0.11, border: "rgba(192,132,252,.7)" });
    tagAmm = A.tag("I = 0.57 A", { h: 0.12, border: "rgba(124,247,212,.6)" });
    tagKey = A.tag("Key closed", { h: 0.1 });
    tagKey.position.set(-0.75, 0.48, 1.15);
    tagAmm.position.set(1.95, 1.22, -0.95);
    scene.add(tagPack, tagR1, tagR2, tagR3, tagAmm, tagKey);
  }

  function isCellArray(m) { return m === "single" || m === "series3" || m === "parallel3"; }

  function layoutCells() {
    var mode = state.cellArray, cells = isCellArray(mode);
    holders.forEach(function (h, i) {
      h.visible = cells && (mode !== "single" || i === 1);
      if (mode === "series3") h.position.set(0, 0, 0.5 - i * 0.5);
      else if (mode === "parallel3") h.position.set(-0.3 + i * 0.3, 0, 0);
      else h.position.set(0, 0, 0);
    });
    links.forEach(function (lk, i) { lk.visible = mode === "series3"; lk.position.set(0, 0.22, 0.25 - i * 0.5); });
    busbars.forEach(function (bb, i) { bb.visible = mode === "parallel3"; bb.position.set(0, 0.22, i === 0 ? -0.23 : 0.23); });
    acc.visible = !cells;
    if (!cells) acc.userData.setText(mode === "acc12" ? "12 V" : "14 V");
    battGroup.userData.ports = mode === "series3"
      ? { pos: new THREE.Vector3(0, 0.21, -0.73), neg: new THREE.Vector3(0, 0.21, 0.73) }
      : mode === "parallel3"
        ? { pos: new THREE.Vector3(0.3, 0.22, -0.23), neg: new THREE.Vector3(0.3, 0.22, 0.23) }
        : { pos: new THREE.Vector3(0, 0.21, -0.23), neg: new THREE.Vector3(0, 0.21, 0.23) };
    tagPack.userData.setText(SUPPLY[mode].tag);
    tagPack.position.set(-1.85, mode === "series3" ? 0.62 : cells ? 0.55 : 0.78, mode === "series3" ? -0.15 : -0.05);
  }

  function layoutNetwork() {
    var t = state.topology;
    boardR1.visible = boardR2.visible = t !== "load";
    boardR3.visible = t === "combo" || t === "load";
    if (t === "series") {
      boardR1.position.set(-0.42, 0, 0); boardR2.position.set(0.42, 0, 0);
    } else if (t === "parallel") {
      boardR1.position.set(0, 0, -0.4); boardR2.position.set(0, 0, 0.4);
    } else if (t === "load") {
      boardR3.position.set(0, 0, 0);
    } else {
      boardR3.position.set(-0.68, 0, 0); boardR1.position.set(0.32, 0, -0.4); boardR2.position.set(0.32, 0, 0.4);
    }
    boardR1.userData.setOhms(state.r1);
    boardR2.userData.setOhms(state.r2);
    boardR3.userData.setOhms(t === "load" ? state.rLoad : state.r3);
    function above(board) { return board.position.clone().add(netGroup.position).add(new THREE.Vector3(0, 0.46, 0)); }
    tagR1.visible = tagR2.visible = t !== "load";
    tagR1.userData.setText("R₁ = " + state.r1.toFixed(0) + " Ω"); tagR1.position.copy(above(boardR1));
    tagR2.userData.setText("R₂ = " + state.r2.toFixed(0) + " Ω"); tagR2.position.copy(above(boardR2));
    tagR3.visible = boardR3.visible;
    tagR3.userData.setText(t === "load" ? "Load R = " + state.rLoad.toFixed(1) + " Ω" : "R₃ = 3 Ω");
    tagR3.position.copy(above(boardR3));
  }

  function rewire() {
    if (!wires) return;
    wires.clear();
    flows = [];
    var P = A.worldPort, V = THREE.Vector3;
    function add(a, b, color, current, opt) {
      var w = wires.add(A.wire(a, b, Object.assign({ color: color }, opt || {})));
      var f = wires.add(A.flow(w.userData.curve, { color: 0x7cf7d4 }));
      flows.push({ dots: f, current: current });
    }
    function body(board, current) {
      var pts = board.userData.bodyPath.map(function (p) { return p.clone().applyMatrix4(board.matrixWorld); });
      flows.push({ dots: wires.add(A.flow(pts, { color: 0xffd36b, spacing: 0.12 })), current: current });
    }
    battGroup.updateWorldMatrix(true, true);
    netGroup.updateWorldMatrix(true, true);
    var src = isCellArray(state.cellArray) ? battGroup : acc;
    var t = state.topology, inPort, outPort;
    var main = function () { return state.I_main; }, i1 = function () { return state.I1; }, i2 = function () { return state.I2; };
    if (t === "series") {
      inPort = P(boardR1, "a"); outPort = P(boardR2, "b");
      add(P(boardR1, "b"), P(boardR2, "a"), 0xf3c13a, main, { lift: 0.12 });
      body(boardR1, main); body(boardR2, main);
    } else if (t === "parallel") {
      inPort = P(boardR1, "a"); outPort = P(boardR1, "b");
      add(P(boardR1, "a"), P(boardR2, "a"), 0xf3c13a, i2, { lift: 0.12 });
      add(P(boardR2, "b"), P(boardR1, "b"), 0xf3c13a, i2, { lift: 0.12 });
      body(boardR1, i1); body(boardR2, i2);
    } else if (t === "load") {
      inPort = P(boardR3, "a"); outPort = P(boardR3, "b");
      body(boardR3, main);
    } else {
      inPort = P(boardR3, "a"); outPort = P(boardR1, "b");
      add(P(boardR3, "b"), P(boardR1, "a"), 0xf3c13a, main, { lift: 0.14 });
      add(P(boardR1, "a"), P(boardR2, "a"), 0xf3c13a, i2, { lift: 0.12 });
      add(P(boardR2, "b"), P(boardR1, "b"), 0xf3c13a, i2, { lift: 0.12 });
      body(boardR3, main); body(boardR1, i1); body(boardR2, i2);
    }
    // main loop: source (+) → network → ammeter (+ → −) → key → source (−)
    add(P(src, "pos"), inPort, 0xc0392b, main, { lift: 0.3 });
    add(outPort, P(ammeter, "pos"), 0xc0392b, main, { lift: 0.3 });
    add(P(ammeter, "neg"), P(key, "b"), 0x1d1d22, main, {
      via: [new V(1.2, 0.28, 0.1), new V(0.6, 0.12, 1.55), new V(0.0, 0.12, 1.5)]
    });
    add(P(key, "a"), P(src, "neg"), 0x1d1d22, main, { lift: 0.25 });
  }

  function matchTrial() {
    var ids = Object.keys(TRIALS);
    for (var i = 0; i < ids.length; i++) {
      var c = TRIALS[ids[i]];
      if (c.cellArray !== state.cellArray || c.topology !== state.topology) continue;
      if (c.topology === "load" ? Math.abs(c.rLoad - state.rLoad) < 1e-6 : (c.r1 === state.r1 && c.r2 === state.r2)) return ids[i];
    }
    return null;
  }

  function snapshot() {
    return {
      trial: state.trial, cellArray: state.cellArray, topology: state.topology, closed: state.switchClosed,
      E: state.E_eq, r: state.r_eq, R: state.R_eq, I: state.I_main, I1: state.I1, I2: state.I2,
      V: state.V_term, P: state.P_load, Plost: state.P_lost, eff: state.eff,
      r1: state.r1, r2: state.r2, r3: state.r3
    };
  }

  function computePhysics() {
    var sup = SUPPLY[state.cellArray] || SUPPLY.parallel3;
    state.E_eq = sup.E;
    state.r_eq = sup.r;

    var r1 = state.r1, r2 = state.r2, r3 = state.r3;
    if (state.topology === "series") state.R_eq = r1 + r2;
    else if (state.topology === "parallel") state.R_eq = (r1 * r2) / (r1 + r2);
    else if (state.topology === "load") state.R_eq = state.rLoad;
    else state.R_eq = r3 + (r1 * r2) / (r1 + r2);

    if (!state.switchClosed) {
      // no current: terminal p.d. = EMF, no power, efficiency undefined
      state.I_main = 0; state.I1 = 0; state.I2 = 0;
      state.V_term = state.E_eq;
      state.P_load = 0; state.P_lost = 0;
      state.eff = null;
    } else {
      state.I_main = state.E_eq / (state.R_eq + state.r_eq);
      state.V_term = state.I_main * state.R_eq;
      state.P_load = state.I_main * state.I_main * state.R_eq;
      state.P_lost = state.I_main * state.I_main * state.r_eq;
      state.eff = (state.R_eq / (state.R_eq + state.r_eq)) * 100.0;
      if (state.topology === "series" || state.topology === "load") {
        state.I1 = state.I_main;
        state.I2 = state.I_main;
      } else {
        state.I1 = state.I_main * (r2 / (r1 + r2));
        state.I2 = state.I_main * (r1 / (r1 + r2));
      }
    }
    state.trial = matchTrial();

    if (stage && battGroup) {
      layoutCells();
      layoutNetwork();
      rewire();
      key.userData.setClosed(state.switchClosed);
      tagKey.userData.setText(state.switchClosed ? "Key closed" : "Key open");
      ammeter.userData.setFraction(state.I_main / 5.0);
      tagAmm.userData.setText("I = " + state.I_main.toFixed(2) + " A");
    }
    paintReadout();
    paintTrials();
    document.dispatchEvent(new CustomEvent("l3:bench-live", { detail: snapshot() }));
  }

  function setText(id, txt) { var el = document.getElementById(id); if (el) el.textContent = txt; }
  function paintReadout() {
    setText("ro-req", fmt(state.R_eq) + " Ω");
    setText("ro-cell", state.E_eq.toFixed(1) + " V / " + fmt(state.r_eq) + " Ω");
    setText("ro-imain", state.I_main.toFixed(2) + " A");
    setText("ro-branch", state.topology === "series" ? "one path: " + state.I1.toFixed(2) + " A"
      : state.topology === "load" ? "one path"
      : state.I1.toFixed(2) + " A, " + state.I2.toFixed(2) + " A");
    setText("ro-v", state.V_term.toFixed(2) + " V");
    setText("ro-p", state.P_load.toFixed(2) + " W");
    setText("ro-lost", state.P_lost.toFixed(2) + " W");
    setText("ro-eff", state.eff == null ? "— (no current)" : state.eff.toFixed(1) + " %");
    if (chip) {
      chip.textContent = state.trial ? TRIALS[state.trial].chip
        : SUPPLY[state.cellArray].tag + " · R = " + fmt(state.R_eq) + " Ω";
    }
  }
  function fmt(v) { return Math.abs(v - Math.round(v)) < 1e-9 ? v.toFixed(1) : v.toFixed(2); }

  function paintTrials() {
    document.querySelectorAll("#bench-trials [data-trial]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-trial") === state.trial));
    });
  }

  function syncControls() {
    if (topSel) topSel.value = state.topology;
    if (cellSel) cellSel.value = state.cellArray;
    if (r1Slider) r1Slider.value = String(state.r1);
    if (r2Slider) r2Slider.value = String(state.r2);
    if (rlSlider) rlSlider.value = String(state.rLoad);
    if (r1Val) r1Val.textContent = state.r1.toFixed(1) + " Ω";
    if (r2Val) r2Val.textContent = state.r2.toFixed(1) + " Ω";
    if (rlVal) rlVal.textContent = state.rLoad.toFixed(1) + " Ω";
    var load = state.topology === "load";
    document.querySelectorAll("[data-ctl-net]").forEach(function (el) { el.hidden = load; });
    document.querySelectorAll("[data-ctl-load]").forEach(function (el) { el.hidden = !load; });
  }

  function loadTrial(id) {
    var c = TRIALS[id];
    if (!c) return;
    state.cellArray = c.cellArray;
    state.topology = c.topology;
    if (c.r1 != null) { state.r1 = c.r1; state.r2 = c.r2; }
    if (c.rLoad != null) state.rLoad = c.rLoad;
    if (!state.switchClosed) setKey(true);
    syncControls();
    computePhysics();
    document.dispatchEvent(new CustomEvent("bench:config", { detail: state }));
  }

  function setKey(closed) {
    state.switchClosed = closed;
    if (btnKey) btnKey.textContent = closed ? "🔑 Open key (break circuit)" : "🔑 Close key (measure)";
  }

  function frame(dt) {
    if (ammeter) ammeter.userData.update(dt);
    for (var i = 0; i < flows.length; i++) {
      var f = flows[i];
      f.dots.visible = state.switchClosed;
      f.dots.userData.update(dt, state.switchClosed ? Math.min(1.8, Math.max(0.06, f.current() * 0.55)) : 0);
    }
  }

  function changed() {
    syncControls();
    computePhysics();
    document.dispatchEvent(new CustomEvent("bench:config", { detail: state }));
  }

  if (topSel) topSel.addEventListener("change", function () { state.topology = topSel.value; changed(); });
  if (cellSel) cellSel.addEventListener("change", function () { state.cellArray = cellSel.value; changed(); });
  if (r1Slider) r1Slider.addEventListener("input", function () { state.r1 = parseFloat(r1Slider.value); syncControls(); computePhysics(); });
  if (r2Slider) r2Slider.addEventListener("input", function () { state.r2 = parseFloat(r2Slider.value); syncControls(); computePhysics(); });
  if (rlSlider) rlSlider.addEventListener("input", function () { state.rLoad = parseFloat(rlSlider.value); syncControls(); computePhysics(); });
  document.querySelectorAll("#bench-trials [data-trial]").forEach(function (b) {
    b.addEventListener("click", function () { loadTrial(b.getAttribute("data-trial")); });
  });
  if (btnKey) {
    btnKey.addEventListener("click", function () {
      setKey(!state.switchClosed);
      computePhysics();
    });
  }
  if (btnRecord) {
    btnRecord.addEventListener("click", function () {
      document.dispatchEvent(new CustomEvent("bench:record", { detail: state }));
      var toast = window.LessonKit && window.LessonKit.toast;
      if (!state.switchClosed) {
        if (toast) toast("The key is open, so no current flows. Close the key, then log the reading.");
        return;
      }
      document.dispatchEvent(new CustomEvent("l3:bench", { detail: snapshot() }));
      if (toast) {
        toast("Logged" + (state.trial ? " " + state.trial.toUpperCase() : "") + ": R = " + fmt(state.R_eq) + " Ω, I = " + state.I_main.toFixed(2) + " A, P = " + state.P_load.toFixed(2) + " W, η = " + state.eff.toFixed(1) + " %");
      }
    });
  }

  syncControls();
  computePhysics();
})();
