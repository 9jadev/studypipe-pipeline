/* Lesson 04 · 3D Galvanometer Shunt & Multiplier Conversion Bench
   Real apparatus: moving-coil galvanometer (printed mA dial), manganin ammeter shunt on brass
   terminal blocks, wire-wound multiplier coil on a ceramic bobbin, PVC leads to the circuit
   and charge dots showing how the current divides (shunt) or stays the same (multiplier). */
(function () {
  "use strict";
  var root = document.getElementById("bench-stage");
  var canvas = document.getElementById("bench-canvas");
  if (!root || !canvas || typeof THREE === "undefined" || !window.Apparatus) return;
  var A = window.Apparatus;

  var state = {
    mode: "ammeter", // "ammeter" or "voltmeter"
    Rg: 20.0,
    Ig_mA: 10.0,
    targetI: 5.0,
    targetV: 15.0,
    Vg: 0.20,
    Rs: 0.0401,
    Rm: 1480.0,
    Rtot: 1500.0,
    bypassPct: 99.8,
    valid: true,
    trial: null
  };

  // The six lab-notebook designs (same numbers as L01.trials in data.js)
  var PRESETS = {
    t1: { mode: "ammeter", Rg: 20, Ig_mA: 10, targetI: 5.0 },
    t2: { mode: "ammeter", Rg: 50, Ig_mA: 20, targetI: 2.0 },
    t3: { mode: "ammeter", Rg: 9.9, Ig_mA: 100, targetI: 10.0 },
    t4: { mode: "voltmeter", Rg: 20, Ig_mA: 10, targetV: 15.0 },
    t5: { mode: "voltmeter", Rg: 5.0, Ig_mA: 50, targetV: 10.0 },
    t6: { mode: "voltmeter", Rg: 25, Ig_mA: 5, targetV: 100 }
  };

  // number formatter: values >= 100 to the nearest unit (19975 -> "19 975"), smaller ones to n s.f.
  // keeping trailing zeros (0.04008 -> "0.0401", 0.1 -> "0.100")
  function sig(v, n) {
    if (!isFinite(v)) return "–";
    if (Math.abs(v) >= 100) {
      var r = Math.round(v).toString();
      return Math.abs(v) >= 10000 ? r.replace(/\B(?=(\d{3})+(?!\d))/g, "\u2009") : r;
    }
    var q = +v.toPrecision(n);   // 99.99 → 1.0e+2 otherwise
    return Math.abs(q) >= 100 ? String(Math.round(q)) : v.toPrecision(n);
  }
  function fmtRange(mode, v) { return mode === "ammeter" ? v.toFixed(1) + " A" : (v < 100 ? v.toFixed(1) : v.toFixed(0)) + " V"; }
  function fmtA(I) { return I < 1 ? (I * 1000).toFixed(0) + " mA" : sig(I, 3) + " A"; }

  var galvGroup, shuntGroup, multGroup, wires, flows = [];
  var tagG, tagS, tagM, tagIn, tagOut;

  var api = {
    rect: function (part) {
      if (!stage) return null;
      var obj = part === "bob" ? galvGroup : (part === "ruler" ? (state.mode === "ammeter" ? shuntGroup : multGroup) : null);
      return obj ? stage.rectOf(obj) : null;
    },
    highlight: function () {},
    state: function () { return state; },
    setConfig: function (opts) { setConfig(opts); },
    loadTrial: function (id) { if (PRESETS[id]) setConfig(PRESETS[id]); }
  };
  window.StudyScenes = window.StudyScenes || {};
  window.StudyScenes.bench = api;

  var stage = window.SceneKit && window.SceneKit.createStage({
    root: root,
    canvas: canvas,
    fov: 34,
    target: new THREE.Vector3(0, 0.35, 0.1),
    pitch: 0.42,
    yaw: 0.0,
    fitWidth: 4.8,
    distance: 5.0,
    minYaw: -0.8,
    maxYaw: 0.8,
    onFrame: frame
  });

  if (stage) { build(); stage.start(); }

  function build() {
    var scene = stage.rig;
    scene.add(A.benchTop(6.2, 3.6));

    galvGroup = A.meter({ unit: "G", majors: [0, 2, 4, 6, 8, 10], minor: 5, sub: "full scale I_g = 10 mA", label: "GALVANOMETER", size: 1.45 });
    galvGroup.position.set(-0.35, 0, -0.75);
    scene.add(galvGroup);

    shuntGroup = A.shunt();
    shuntGroup.position.set(-0.35, 0, 0.7);
    shuntGroup.scale.setScalar(1.4);
    scene.add(shuntGroup);

    multGroup = A.multiplierCoil();
    multGroup.position.set(1.45, 0, 0.25);
    multGroup.rotation.y = -0.35;
    scene.add(multGroup);

    wires = A.wireSet(scene);

    tagG = A.tag("G · 20 Ω, 10 mA", { h: 0.12, border: "rgba(255,178,63,.7)" });
    tagG.position.set(-0.35, 1.3, -0.2);
    tagS = A.tag("Shunt R_s (parallel)", { h: 0.11, border: "rgba(62,230,196,.7)" });
    tagS.position.set(-0.35, 0.12, 1.32);
    tagM = A.tag("Multiplier R_m (series)", { h: 0.11, border: "rgba(192,132,252,.7)" });
    tagM.position.set(1.45, 0.62, 0.25);
    tagIn = A.tag("from circuit", { h: 0.1 });
    tagOut = A.tag("to circuit", { h: 0.1 });
    tagIn.position.set(-2.05, 0.25, 1.3);
    tagOut.position.set(1.95, 0.25, 1.3);
    scene.add(tagG, tagS, tagM, tagIn, tagOut);
  }

  function rewire() {
    if (!wires) return;
    wires.clear();
    flows = [];
    var P = A.worldPort, V = THREE.Vector3;
    var leftEnd = new V(-2.3, 0.03, 1.15), rightEnd = new V(2.3, 0.03, 1.15);
    function add(a, b, color, speed, opt) {
      var w = wires.add(A.wire(a, b, Object.assign({ color: color }, opt || {})));
      flows.push({ dots: wires.add(A.flow(w.userData.curve, { color: 0x7cf7d4 })), speed: speed });
      return w;
    }
    function plug(at, color) {   // banana plug at the loose end of a lead
      var p = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.09, 16), A.std(color, 0.4));
      p.rotation.z = Math.PI / 2; p.position.copy(at).add(new V(0, 0.03, 0));
      wires.add(p);
    }
    galvGroup.updateWorldMatrix(true, true);
    if (state.mode === "ammeter") {
      shuntGroup.updateWorldMatrix(true, true);
      // the galvanometer and shunt are joined side by side (in parallel)
      add(P(galvGroup, "neg"), P(shuntGroup, "a"), 0x1d1d22, 0.18, { lift: 0.18 });
      add(P(shuntGroup, "b"), P(galvGroup, "pos"), 0xc0392b, 0.18, { lift: 0.18 });
      var body = shuntGroup.userData.bodyPath.map(function (p) { return p.clone().applyMatrix4(shuntGroup.matrixWorld); });
      flows.push({ dots: wires.add(A.flow(body, { color: 0x3ee6c4, spacing: 0.08 })), speed: 1.4 });
      add(leftEnd, P(shuntGroup, "a"), 0x1d1d22, 1.5, { lift: 0.2 });
      add(P(shuntGroup, "b"), rightEnd, 0xc0392b, 1.5, { lift: 0.2 });
    } else {
      multGroup.updateWorldMatrix(true, true);
      // the galvanometer and multiplier are joined end to end (in series)
      add(P(galvGroup, "pos"), P(multGroup, "a"), 0xc0392b, 0.25, { lift: 0.22 });
      var mb = multGroup.userData.bodyPath.map(function (p) { return p.clone().applyMatrix4(multGroup.matrixWorld); });
      flows.push({ dots: wires.add(A.flow(mb, { color: 0xc084fc, spacing: 0.12 })), speed: 0.25 });
      add(P(multGroup, "b"), rightEnd, 0xc0392b, 0.25, { lift: 0.2 });
      add(leftEnd, P(galvGroup, "neg"), 0x1d1d22, 0.25, { lift: 0.25 });
    }
    plug(leftEnd, 0x1d1d22);
    plug(rightEnd, 0xc0392b);
  }

  function computePhysics() {
    var Ig = state.Ig_mA / 1000.0;
    state.Vg = Ig * state.Rg;
    var amm = state.mode === "ammeter";

    if (amm) {
      var I = state.targetI;
      var Is = I - Ig;
      state.valid = Is > 0;
      state.Rs = state.valid ? (Ig * state.Rg) / Is : NaN;               // I_g R_g = (I − I_g) R_s
      state.Rtot = state.valid ? (state.Rg * state.Rs) / (state.Rg + state.Rs) : NaN; // R_g ∥ R_s
      state.bypassPct = state.valid ? (Is / I) * 100.0 : NaN;              // share of I through the shunt
    } else {
      var V = state.targetV;
      state.valid = V > state.Vg;
      state.Rtot = V / Ig;                                                 // whole voltmeter = V / I_g
      state.Rm = state.valid ? state.Rtot - state.Rg : NaN;                // R_m = V/I_g − R_g
      state.bypassPct = state.valid ? ((V - state.Vg) / V) * 100.0 : NaN;  // share of V across R_m
    }
    state.trial = matchTrial();

    if (stage && galvGroup) {
      shuntGroup.visible = amm;
      multGroup.visible = !amm;
      tagS.visible = amm;
      tagM.visible = !amm;
      // A converted meter keeps the same coil but gets a new printed scale: full deflection now
      // means the design range (I or V), still with exactly I_g in the coil.
      var range = amm ? state.targetI : state.targetV;
      var majors = [];
      for (var k = 0; k <= 5; k++) majors.push(+(range * k / 5).toPrecision(3));
      galvGroup.userData.redraw({
        unit: state.valid ? (amm ? "A" : "V") : "G",
        majors: state.valid ? majors : [0, 0.2, 0.4, 0.6, 0.8, 1],
        sub: "coil I_g = " + state.Ig_mA.toFixed(0) + " mA"
      });
      galvGroup.userData.setFraction(state.valid ? 1 : 1.1);   // design gives exactly full scale; an impossible design pins past it
      tagG.userData.setText("G · " + state.Rg.toFixed(1) + " Ω, " + state.Ig_mA.toFixed(0) + " mA");
      if (amm) {
        tagS.userData.setText(state.valid ? "R_s = " + sig(state.Rs, 3) + " Ω" : "R_s: impossible");
        tagIn.userData.setText(fmtRange("ammeter", state.targetI) + " in");
        tagOut.userData.setText(fmtRange("ammeter", state.targetI) + " out");
      } else {
        tagM.userData.setText(state.valid ? "R_m = " + sig(state.Rm, 3) + " Ω" : "R_m: impossible");
        tagIn.userData.setText("− lead");
        tagOut.userData.setText("+ lead");
      }
      rewire();
    }

    var chip = document.getElementById("bench-instruction");
    if (chip) chip.innerHTML = amm ? "Ammeter: small R<sub>s</sub> in parallel" : "Voltmeter: large R<sub>m</sub> in series";

    var elVg = document.getElementById("ro-vg");
    var elConv = document.getElementById("ro-conv");
    var elRtot = document.getElementById("ro-rtot");
    var elSplit = document.getElementById("ro-split");
    var elPlace = document.getElementById("ro-place");
    var warn = document.getElementById("bench-warn");

    if (elVg) elVg.textContent = sig(state.Vg, 3) + " V";
    if (amm) {
      if (elConv) elConv.textContent = state.valid ? "R_s = " + sig(state.Rs, 3) + " Ω" : "–";
      if (elRtot) elRtot.textContent = state.valid ? sig(state.Rtot, 3) + " Ω" : "–";
      if (elSplit) elSplit.textContent = state.valid ? state.bypassPct.toFixed(1) + "% of I" : "–";
      if (elPlace) elPlace.textContent = "In SERIES with load";
      if (warn) warn.textContent = state.valid ? "" : "Range I must be bigger than I_g = " + fmtA(Ig) + ".";
    } else {
      if (elConv) elConv.textContent = state.valid ? "R_m = " + sig(state.Rm, 3) + " Ω" : "–";
      if (elRtot) elRtot.textContent = state.valid ? sig(state.Rtot, 3) + " Ω" : "–";
      if (elSplit) elSplit.textContent = state.valid ? state.bypassPct.toFixed(1) + "% of V" : "–";
      if (elPlace) elPlace.textContent = "In PARALLEL across load";
      if (warn) warn.textContent = state.valid ? "" : "No multiplier possible: range V must be bigger than V_g = I_g R_g = " + sig(state.Vg, 3) + " V. Raise V or use a smaller I_g or R_g.";
    }
    if (rgVal) rgVal.textContent = state.Rg.toFixed(1) + " Ω";
    if (igVal) igVal.textContent = state.Ig_mA.toFixed(0) + " mA";
    if (presetBtns) presetBtns.forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-trial") === state.trial ? "true" : "false"); });

    document.dispatchEvent(new CustomEvent("l4:bench", { detail: snapshot() }));
  }

  function matchTrial() {
    for (var id in PRESETS) {
      var p = PRESETS[id];
      if (p.mode !== state.mode || Math.abs(p.Rg - state.Rg) > 1e-9 || Math.abs(p.Ig_mA - state.Ig_mA) > 1e-9) continue;
      if (p.mode === "ammeter" ? Math.abs(p.targetI - state.targetI) < 1e-9 : Math.abs(p.targetV - state.targetV) < 1e-9) return id;
    }
    return null;
  }

  function snapshot() {
    return {
      mode: state.mode, Rg: state.Rg, Ig: state.Ig_mA / 1000, Vg: state.Vg,
      range: state.mode === "ammeter" ? state.targetI : state.targetV,
      Rs: state.Rs, Rm: state.Rm, Rtot: state.Rtot, share: state.bypassPct, valid: state.valid, trial: state.trial
    };
  }

  function frame(dt) {
    if (galvGroup) galvGroup.userData.update(dt);
    for (var i = 0; i < flows.length; i++) flows[i].dots.userData.update(dt, flows[i].speed);
  }

  var modeSel = document.getElementById("ctl-mode");
  var rgSlider = document.getElementById("ctl-rg");
  var igSlider = document.getElementById("ctl-ig");
  var rangeSlider = document.getElementById("ctl-range");
  var rgVal = document.getElementById("ctl-rg-val");
  var igVal = document.getElementById("ctl-ig-val");
  var rangeLabel = document.getElementById("ctl-range-label");
  var btnRecord = document.getElementById("bench-record");
  var presetBtns = Array.prototype.slice.call(document.querySelectorAll("#bench-trials [data-trial]"));

  // set the range slider's limits for the current mode (ammeter 1–10 A, voltmeter 5–100 V)
  function syncRangeSlider() {
    if (!rangeSlider) return;
    if (state.mode === "ammeter") {
      rangeSlider.min = "1.0"; rangeSlider.max = "10.0"; rangeSlider.step = "0.5";
      rangeSlider.value = String(state.targetI);
    } else {
      rangeSlider.min = "5.0"; rangeSlider.max = "100.0"; rangeSlider.step = "5.0";
      rangeSlider.value = String(state.targetV);
    }
  }
  function syncRangeLabel() {
    if (!rangeLabel) return;
    if (state.mode === "ammeter") rangeLabel.innerHTML = 'New ammeter range I: <strong id="ctl-range-val">' + fmtRange("ammeter", state.targetI) + "</strong>";
    else rangeLabel.innerHTML = 'New voltmeter range V: <strong id="ctl-range-val">' + fmtRange("voltmeter", state.targetV) + "</strong>";
  }

  function setConfig(opts) {
    if (!opts) return;
    var modeChanged = false;
    if (opts.mode && opts.mode !== state.mode) { state.mode = opts.mode; modeChanged = true; }
    if (typeof opts.Rg === "number") state.Rg = opts.Rg;
    if (typeof opts.Ig_mA === "number") state.Ig_mA = opts.Ig_mA;
    if (typeof opts.targetI === "number") state.targetI = opts.targetI;
    if (typeof opts.targetV === "number") state.targetV = opts.targetV;
    if (modeSel) modeSel.value = state.mode;
    if (rgSlider) rgSlider.value = String(state.Rg);
    if (igSlider) igSlider.value = String(state.Ig_mA);
    syncRangeSlider();
    syncRangeLabel();
    computePhysics();
    if (modeChanged) document.dispatchEvent(new CustomEvent("bench:mode", { detail: state }));
  }

  if (modeSel) modeSel.addEventListener("change", function () { setConfig({ mode: modeSel.value }); });
  if (rgSlider) rgSlider.addEventListener("input", function () { state.Rg = parseFloat(rgSlider.value); computePhysics(); });
  if (igSlider) igSlider.addEventListener("input", function () { state.Ig_mA = parseFloat(igSlider.value); computePhysics(); });
  if (rangeSlider) {
    rangeSlider.addEventListener("input", function () {
      var v = parseFloat(rangeSlider.value);
      if (state.mode === "ammeter") state.targetI = v;
      else state.targetV = v;
      syncRangeLabel();
      computePhysics();
    });
  }
  presetBtns.forEach(function (b) {
    b.addEventListener("click", function () { api.loadTrial(b.getAttribute("data-trial")); });
  });
  if (btnRecord) {
    btnRecord.addEventListener("click", function () {
      var toast = window.LessonKit && window.LessonKit.toast;
      if (!state.valid) {
        if (toast) toast(state.mode === "ammeter" ? "Not a working design: range I must exceed I_g." : "Not a working design: range V must exceed V_g = I_g R_g.");
        return;
      }
      document.dispatchEvent(new CustomEvent("bench:record", { detail: state }));
      document.dispatchEvent(new CustomEvent("l4:bench-record", { detail: snapshot() }));
      if (toast) {
        if (state.mode === "ammeter") toast("Logged ammeter: R_s = " + sig(state.Rs, 3) + " Ω (" + state.bypassPct.toFixed(1) + "% of I through the shunt)");
        else toast("Logged voltmeter: R_m = " + sig(state.Rm, 3) + " Ω (whole meter " + sig(state.Rtot, 3) + " Ω)");
      }
    });
  }

  syncRangeSlider();
  syncRangeLabel();
  computePhysics();
})();
