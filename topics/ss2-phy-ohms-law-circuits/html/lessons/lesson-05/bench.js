/* Lesson 05 · 3D Metre Bridge & Potentiometer Null-Balance Bench
   Real apparatus: metre-bridge board (brass strips, 100 cm resistance wire, printed metre rule),
   knife-edge jockey, centre-zero galvanometer, accumulator + plug key driver circuit,
   unknown coil X and plug-type resistance box (bridge) or test cell + series resistor R_s
   (potentiometer). The galvanometer needle and charge dots follow the balance state. */
(function () {
  "use strict";
  var root = document.getElementById("bench-stage");
  var canvas = document.getElementById("bench-canvas");
  if (!root || !canvas || typeof THREE === "undefined" || !window.Apparatus) return;
  var A = window.Apparatus;

  var state = {
    mode: "metre-bridge", // "metre-bridge" or "potentiometer"
    jockeyL: 40.0,
    stdR2: 6.0,
    unknownX: 4.0,
    driverRs: 2.0,
    testEx: 1.25,
    nullL: 40.0,
    Ig_mA: 0.0,
    V_AB: 2.50,
    balanced: true
  };

  var boardGroup, jockeyGroup, galvGroup, nullHalo;
  var coilX, rBox, testCell, rsBoard, acc, key, wires, flows = [];
  var tagBoard, tagJ, tagG, tagX, tagBox, tagAcc, tagTest, tagRs;

  var api = {
    rect: function (part) {
      if (!stage) return null;
      var obj = part === "bob" ? galvGroup : (part === "ruler" ? jockeyGroup : null);
      return obj ? stage.rectOf(obj) : null;
    },
    highlight: function () {},
    state: function () { return state; },
    setConfig: function () {} // replaced below, once the controls exist
  };
  window.StudyScenes = window.StudyScenes || {};
  window.StudyScenes.bench = api;

  var stage = window.SceneKit && window.SceneKit.createStage({
    root: root,
    canvas: canvas,
    fov: 34,
    target: new THREE.Vector3(0, 0.25, 0.15),
    pitch: 0.62,
    yaw: 0.0,
    fitWidth: 4.9,
    distance: 5.0,
    minYaw: -0.8,
    maxYaw: 0.8,
    onFrame: frame
  });

  if (stage) { build(); stage.start(); }

  function build() {
    var scene = stage.rig;
    scene.add(A.benchTop(6.6, 4.2));

    boardGroup = A.metreBridgeBoard();
    boardGroup.position.set(0, 0, 0.15);
    scene.add(boardGroup);

    jockeyGroup = A.jockey();
    nullHalo = new THREE.Mesh(
      new THREE.TorusGeometry(0.07, 0.012, 10, 32),
      new THREE.MeshStandardMaterial({ color: 0x2fb344, emissive: 0x2fb344, emissiveIntensity: 1.0 })
    );
    nullHalo.rotation.x = Math.PI / 2;
    jockeyGroup.add(nullHalo);
    scene.add(jockeyGroup);

    galvGroup = A.meter({ unit: "G", majors: [30, 20, 10, 0, 10, 20, 30], minor: 5, zero: true, sub: "centre-zero (mA)", label: "GALVANOMETER", size: 1.05 });
    galvGroup.position.set(-0.1, 0, -1.2);
    scene.add(galvGroup);

    // bridge-only apparatus
    coilX = A.resistanceCoil({ length: 0.62 });
    coilX.position.set(-0.8, 0.3, -0.21);
    scene.add(coilX);
    rBox = A.resistanceBox({ text: "R₂ = 6 Ω" });
    rBox.position.set(1.35, 0, -1.15);
    rBox.rotation.y = -0.2;
    scene.add(rBox);

    // potentiometer-only apparatus
    testCell = A.cellHolder({ text: "E_x", color: "#2e9d3c" });
    testCell.position.set(-1.45, 0, -1.15);
    scene.add(testCell);
    rsBoard = A.resistorBoard({ ohms: 2 });
    rsBoard.position.set(-0.2, 0, 1.5);
    scene.add(rsBoard);

    // driver circuit
    acc = A.accumulator({ text: "2 V" });
    acc.position.set(-1.55, 0, 1.45);
    scene.add(acc);
    key = A.plugKey();
    key.position.set(1.0, 0, 1.5);
    scene.add(key);

    wires = A.wireSet(scene);

    tagBoard = A.tag("Metre bridge · 100 cm wire", { h: 0.11 });
    tagBoard.position.set(1.95, 0.35, 0.75);
    tagJ = A.tag("Jockey", { h: 0.11, border: "rgba(124,247,212,.7)" });
    tagG = A.tag("Galvanometer G", { h: 0.11, border: "rgba(47,179,68,.8)" });
    tagG.position.set(-0.1, 0.98, -0.75);
    tagX = A.tag("Unknown X", { h: 0.1, border: "rgba(62,230,196,.7)" });
    tagX.position.set(-0.8, 0.5, -0.21);
    tagBox = A.tag("Resistance box R₂", { h: 0.1, border: "rgba(255,178,63,.7)" });
    tagBox.position.set(1.35, 0.5, -1.15);
    tagAcc = A.tag("Driver cell", { h: 0.1 });
    tagAcc.position.set(-1.55, 0.72, 1.45);
    tagTest = A.tag("Test cell E_x", { h: 0.1, border: "rgba(47,179,68,.8)" });
    tagTest.position.set(-1.45, 0.42, -1.15);
    tagRs = A.tag("R_s", { h: 0.1, border: "rgba(244,63,94,.7)" });
    tagRs.position.set(-0.2, 0.45, 1.5);
    scene.add(tagBoard, tagJ, tagG, tagX, tagBox, tagAcc, tagTest, tagRs);
  }

  function rewire() {
    if (!wires) return;
    wires.clear();
    flows = [];
    var P = A.worldPort, V = THREE.Vector3;
    var bridge = state.mode === "metre-bridge";
    function add(a, b, color, speed, opt) {
      var w = wires.add(A.wire(a, b, Object.assign({ color: color }, opt || {})));
      flows.push({ dots: wires.add(A.flow(w.userData.curve, { color: 0x7cf7d4 })), speed: speed });
    }
    [boardGroup, galvGroup, acc, key, rBox, testCell, rsBoard, jockeyGroup].forEach(function (o) { o.updateWorldMatrix(true, true); });
    var drive = function () { return 0.45; };
    var galv = function () { return state.balanced ? 0 : Math.max(-0.6, Math.min(0.6, state.Ig_mA * 0.04)); };

    // driver circuit: accumulator (+) → A … wire … C → key → (−)
    add(P(boardGroup, "A"), P(acc, "pos"), 0xc0392b, drive, { lift: 0.25 });
    if (bridge) {
      add(P(acc, "neg"), P(key, "a"), 0x1d1d22, drive, { lift: 0.2, bend: new V(0, 0, 0.2) });
    } else {
      add(P(acc, "neg"), P(rsBoard, "a"), 0x1d1d22, drive, { lift: 0.18 });
      add(P(rsBoard, "b"), P(key, "a"), 0x1d1d22, drive, { lift: 0.18 });
    }
    add(P(key, "b"), P(boardGroup, "C"), 0x1d1d22, drive, { lift: 0.25 });
    // current along the 100 cm wire itself
    var wd = boardGroup.userData.wire;
    var wireLine = [new V(wd.x0, wd.y + 0.012, wd.z), new V(wd.x1, wd.y + 0.012, wd.z)].map(function (p) { return p.applyMatrix4(boardGroup.matrixWorld); });
    flows.push({ dots: wires.add(A.flow(wireLine, { color: 0xffd36b, spacing: 0.22 })), speed: drive });

    // galvanometer branch
    var jTop = P(jockeyGroup, "top");
    if (bridge) {
      add(P(boardGroup, "L1"), coilX.position.clone().add(new V(-0.31, 0, 0)), 0xc0c6cf, drive, { lift: 0.02, r: 0.006 });
      add(coilX.position.clone().add(new V(0.31, 0, 0)), P(boardGroup, "L2"), 0xc0c6cf, drive, { lift: 0.02, r: 0.006 });
      add(P(boardGroup, "R1"), P(rBox, "a"), 0xf3c13a, drive, { lift: 0.22 });
      add(P(rBox, "b"), P(boardGroup, "R2"), 0xf3c13a, drive, { lift: 0.22 });
      add(P(boardGroup, "B"), P(galvGroup, "neg"), 0x2f62d6, galv, { lift: 0.2 });
    } else {
      add(P(testCell, "pos"), P(boardGroup, "A2"), 0xc0392b, galv, { lift: 0.2 });
      add(P(galvGroup, "neg"), P(testCell, "neg"), 0x2f62d6, galv, { lift: 0.18 });
    }
    add(P(galvGroup, "pos"), jTop, 0x2f62d6, galv, { lift: 0.3 });
  }

  /* ---------- circuit model ----------
     Every mode uses one honest d.c. model, so I_g is exactly 0 at the true balance length and
     changes sign either side of it (the curve the live graph draws is this same function).
     Values marked (illustrative) are typical school-lab figures, not measured data.
       metre bridge : ideal 2.0 V driver across A–C; X (left gap) and R₂ (right gap) in series
                      from A to C; G joins their junction B to the jockey J.
                      V_A − V_B = E·X/(X + R₂) (p.d. across X), V_A − V_J = E·l/100.
                      I_g = E(l/100 − X/(X+R₂)) ÷ (R_G + X∥R₂ + R_AJ∥R_JC)
                      → zero at l₀ = 100X/(X + R₂), i.e. X = R₂·l/(100 − l).
       potentiometer: ideal 3.0 V driver, series R_s, wire R_w = 10 Ω.
                      V_AB = 3.0·R_w/(R_w + R_s), k = V_AB/100, V_AJ = k·l.
                      Cell (+) to A, (−) through G to J:  I_g = (k·l − E_th) ÷ (R_G + R_cell + R_AJ∥(R_JB + R_s))
                      → zero at l₀ = E_th/k. With a shunt R across the cell, E_th = E·R/(R + r).
     Sign: I_g < 0 with the jockey left of l₀, I_g > 0 right of it. */
  var E_BRIDGE = 2.0, E_DRV = 3.0, R_W = 10.0;
  var R_G = 50.0;     // galvanometer + protective resistor, Ω (illustrative)
  var G_RES = 0.05;   // smallest deflection you can see on G, mA (illustrative)
  var MODES = {
    "metre-bridge": { kind: "bridge" },
    "potentiometer": { kind: "pot", E: 1.25, r: 0.5, sym: "Eₓ", cell: "Test cell Eₓ" },
    "pot-e1": { kind: "pot", E: 1.50, r: 0.5, sym: "E₁", cell: "Standard cell E₁ = 1.50 V" },
    "pot-e2": { kind: "pot", E: 2.10, r: 0.5, sym: "E₂", cell: "Cell E₂ (unknown)" },
    "pot-open": { kind: "pot", E: 2.25, r: 1.0, sym: "E", cell: "Cell E alone (K₂ open)" },
    "pot-shunt": { kind: "pot", E: 2.25, r: 1.0, shunt: 4.0, sym: "V", cell: "Cell + 4.0 Ω across it (K₂ closed)" }
  };
  var E1_STD = 1.50, SHUNT_R = 4.0;

  function modeInfo(m) { return MODES[m || state.mode] || MODES["metre-bridge"]; }

  // Snapshot of the model for the current settings; Ig(l) in mA, vWire(l) in V.
  function model() {
    var mi = modeInfo();
    var o = { mode: state.mode, kind: mi.kind, info: mi };
    if (mi.kind === "bridge") {
      var X = state.unknownX, R2 = state.stdR2, par = X * R2 / (X + R2);
      o.k = E_BRIDGE / 100;
      o.vRef = E_BRIDGE * X / (X + R2);          // p.d. across X
      o.l0 = 100 * X / (X + R2);
      o.Ig = function (l) { var x = l / 100; return 1000 * E_BRIDGE * (x - X / (X + R2)) / (R_G + par + R_W * x * (1 - x)); };
      o.vWire = function (l) { return E_BRIDGE * l / 100; };
      o.setting = R2;
    } else {
      var Rs = state.driverRs, sh = mi.shunt || 0;
      var VAB = E_DRV * R_W / (R_W + Rs), k = VAB / 100;
      var Eth = sh ? mi.E * sh / (sh + mi.r) : mi.E;
      var Rc = sh ? mi.r * sh / (mi.r + sh) : mi.r;
      o.VAB = VAB; o.k = k; o.vRef = Eth; o.l0 = Eth / k;
      o.Ig = function (l) { var x = l / 100; return 1000 * (k * l - Eth) / (R_G + Rc + (R_W * x) * (R_W * (1 - x) + Rs) / (R_W + Rs)); };
      o.vWire = function (l) { return k * l; };
      o.setting = Rs;
      o.l1 = mi.shunt ? mi.E / k : E1_STD / k;   // E₁ balance (compare) or cell-alone balance (r)
    }
    o.onWire = o.l0 >= 0 && o.l0 <= 100;
    return o;
  }

  function resultFor(md, l) {
    var mi = md.info;
    if (md.kind === "bridge") {
      return { label: "Result X = R₂·l ÷ (100 − l)", text: "X = " + (state.stdR2 * l / (100 - l)).toFixed(2) + " Ω" };
    }
    if (state.mode === "potentiometer") return { label: "Result Eₓ = k·l", text: "Eₓ = " + (md.k * l).toFixed(2) + " V" };
    if (state.mode === "pot-e1") return { label: "Calibrate k = E₁ ÷ l", text: "k = " + (E1_STD / l).toFixed(4) + " V cm⁻¹" };
    if (state.mode === "pot-e2") return { label: "Result E₂ = E₁·l ÷ l₁ (l₁ = " + md.l1.toFixed(1) + " cm)", text: "E₂ = " + (E1_STD * l / md.l1).toFixed(2) + " V" };
    if (state.mode === "pot-open") return { label: "Result E = k·l  (this l is l₁)", text: "E = " + (md.k * l).toFixed(2) + " V" };
    return { label: "Result r = R(l₁ − l₂) ÷ l₂ (l₁ = " + md.l1.toFixed(1) + " cm)", text: "r = " + (SHUNT_R * (md.l1 - l) / l).toFixed(2) + " Ω" };
  }

  function fmtIg(v) {
    if (Math.abs(v) < 0.005) return "0.00 mA";
    return (v > 0 ? "+" : "−") + Math.abs(v).toFixed(2) + " mA";
  }

  function snapshot() {
    var md = model();
    var res = resultFor(md, state.jockeyL);
    return {
      mode: state.mode, kind: md.kind, l: state.jockeyL, l0: md.l0, onWire: md.onWire, Ig: state.Ig_mA,
      balanced: state.balanced, k: md.k, VAB: md.VAB, vRef: md.vRef, l1: md.l1, setting: md.setting,
      stdR2: state.stdR2, driverRs: state.driverRs, sym: md.info.sym, cell: md.info.cell,
      result: res.text, resultLabel: res.label, model: md, gRes: G_RES
    };
  }
  api.model = model;
  api.snapshot = snapshot;

  function setText(id, t) { var el = document.getElementById(id); if (el) el.textContent = t; }

  function computePhysics() {
    var md = model();
    var bridge = md.kind === "bridge";
    state.nullL = md.l0;
    if (!bridge) state.V_AB = md.VAB;
    state.Ig_mA = md.Ig(state.jockeyL);
    if (Math.abs(state.jockeyL - md.l0) < 1e-9) state.Ig_mA = 0;
    state.balanced = Math.abs(state.Ig_mA) < G_RES;

    if (stage && boardGroup) {
      var mi = md.info;
      var wd = boardGroup.userData.wire;
      jockeyGroup.position.set(boardGroup.userData.xAt(state.jockeyL), wd.y, wd.z + boardGroup.position.z);
      nullHalo.visible = state.balanced;
      galvGroup.userData.setFraction(state.Ig_mA / 30); // dial is ±30 mA full scale
      galvGroup.userData.needleMat.color.setHex(state.balanced ? 0x1f8a35 : 0x111111);
      coilX.visible = rBox.visible = tagX.visible = tagBox.visible = bridge;
      testCell.visible = rsBoard.visible = tagTest.visible = tagRs.visible = !bridge;
      tagBoard.userData.setText(bridge ? "Metre bridge · 100 cm wire" : "Potentiometer · 100 cm wire");
      tagAcc.userData.setText(bridge ? "Driver cell 2 V" : "Driver cell 3 V");
      acc.userData.setText(bridge ? "2 V" : "3 V");
      tagJ.userData.setText("Jockey · l = " + state.jockeyL.toFixed(1) + " cm" + (state.balanced ? " · NULL" : ""));
      tagJ.position.set(jockeyGroup.position.x, 0.62, jockeyGroup.position.z + 0.05);
      tagG.userData.setText(state.balanced ? "Galvanometer · reads 0 (balanced)" : "Galvanometer · " + fmtIg(state.Ig_mA));
      if (bridge) {
        rBox.userData.setText("R₂ = " + state.stdR2.toFixed(0) + " Ω");
        tagBox.userData.setText("Resistance box R₂ = " + state.stdR2.toFixed(0) + " Ω");
      } else {
        rsBoard.userData.setOhms(Math.max(0.5, state.driverRs));
        tagRs.userData.setText("Series resistor R_s = " + state.driverRs.toFixed(1) + " Ω");
        tagTest.userData.setText(mi.cell);
      }
      rewire();
    }

    var res = resultFor(md, state.jockeyL);
    setText("ro-l", state.jockeyL.toFixed(1) + " cm");
    setText("ro-comp-lbl", bridge ? "Other side (100 − l)" : "Gradient k = V_AB ÷ 100");
    setText("ro-comp", bridge ? (100.0 - state.jockeyL).toFixed(1) + " cm" : md.k.toFixed(4) + " V cm⁻¹");
    setText("ro-ig", fmtIg(state.Ig_mA) + (state.balanced ? " · NULL" : ""));
    var igBox = document.getElementById("ro-ig");
    if (igBox && igBox.parentNode) igBox.parentNode.classList.toggle("is-null", state.balanced);
    setText("ro-calc-lbl", res.label);
    setText("ro-calc", res.text);
    setText("ro-null-lbl", bridge ? "True balance point l₀" : "True balance l₀ (V_AJ = " + mi.sym + ")");
    setText("ro-null", md.onWire ? "l₀ = " + md.l0.toFixed(1) + " cm" : "None: V_AB < " + mi.sym);

    document.dispatchEvent(new CustomEvent("l5:bench", { detail: snapshot() }));
  }

  function frame(dt, t) {
    if (galvGroup) galvGroup.userData.update(dt);
    if (nullHalo && nullHalo.visible) nullHalo.scale.setScalar(1 + Math.sin((t || 0) * 4) * 0.12);
    for (var i = 0; i < flows.length; i++) {
      var sp = flows[i].speed();
      flows[i].dots.visible = sp !== 0;
      flows[i].dots.userData.update(dt, sp);
    }
  }

  var modeSel = document.getElementById("ctl-mode");
  var lSlider = document.getElementById("ctl-l");
  var r2Slider = document.getElementById("ctl-r2");
  var lVal = document.getElementById("ctl-l-val");
  var r2Label = document.getElementById("ctl-r2-label");
  var btnSnap = document.getElementById("bench-snap");
  var btnRecord = document.getElementById("bench-record");

  function syncLabels() {
    if (lVal) lVal.textContent = state.jockeyL.toFixed(1) + " cm";
    if (!r2Label || !r2Slider) return;
    if (state.mode === "metre-bridge") {
      r2Label.innerHTML = 'Box R₂ (X = 4.0 Ω) <strong id="ctl-r2-val">' + state.stdR2.toFixed(1) + " Ω</strong>";
    } else {
      r2Label.innerHTML = 'Driver series R_s (3.0 V, R_w = 10 Ω) <strong id="ctl-r2-val">' + state.driverRs.toFixed(1) + " Ω</strong>";
    }
  }

  // one place that switches apparatus, so the narrator (setConfig) and the <select> agree
  function applyMode(m) {
    if (!MODES[m]) return;
    var wasBridge = state.mode === "metre-bridge";
    state.mode = m;
    if (modeSel && modeSel.value !== m) modeSel.value = m;
    if (r2Slider) {
      if (m === "metre-bridge") {
        r2Slider.min = "2"; r2Slider.max = "12"; r2Slider.step = "1";
        r2Slider.value = String(state.stdR2);
      } else {
        r2Slider.min = "0"; r2Slider.max = "5"; r2Slider.step = "0.5";
        r2Slider.value = String(state.driverRs);
      }
    }
    if (stage && stage.refit && wasBridge !== (m === "metre-bridge")) {
      computePhysics();
      stage.refit();
    }
  }

  api.setConfig = function (opts) {
    if (!opts) return;
    if (opts.mode) {
      applyMode(opts.mode);
      // the narrator sets the bench up from its default apparatus (null at 40 cm / 50 cm)
      if (typeof opts.stdR2 !== "number" && opts.mode === "metre-bridge") state.stdR2 = 6.0;
      if (typeof opts.driverRs !== "number" && opts.mode !== "metre-bridge") state.driverRs = 2.0;
    }
    if (typeof opts.stdR2 === "number") state.stdR2 = opts.stdR2;
    if (typeof opts.driverRs === "number") state.driverRs = opts.driverRs;
    if (r2Slider) r2Slider.value = String(state.mode === "metre-bridge" ? state.stdR2 : state.driverRs);
    if (typeof opts.jockeyL === "number") { state.jockeyL = opts.jockeyL; if (lSlider) lSlider.value = String(opts.jockeyL); }
    syncLabels();
    computePhysics();
  };

  if (modeSel) {
    modeSel.addEventListener("change", function () {
      applyMode(modeSel.value);
      syncLabels();
      computePhysics();
    });
  }
  if (lSlider) {
    lSlider.addEventListener("input", function () {
      state.jockeyL = parseFloat(lSlider.value);
      syncLabels();
      computePhysics();
    });
  }
  if (r2Slider) {
    r2Slider.addEventListener("input", function () {
      var v = parseFloat(r2Slider.value);
      if (state.mode === "metre-bridge") state.stdR2 = v;
      else state.driverRs = v;
      syncLabels();
      computePhysics();
    });
  }
  var toast = function (t) { if (window.LessonKit && window.LessonKit.toast) window.LessonKit.toast(t); };
  if (btnSnap) {
    btnSnap.addEventListener("click", function () {
      var md = model();
      var lo = lSlider ? parseFloat(lSlider.min) : 1, hi = lSlider ? parseFloat(lSlider.max) : 99;
      if (md.l0 < lo || md.l0 > hi) {
        toast(md.kind === "pot" && md.l0 > 100
          ? "No null point on the wire: V_AB = " + md.VAB.toFixed(2) + " V is less than " + md.info.sym + " = " + md.vRef.toFixed(2) + " V. Reduce R_s."
          : "The null point is too close to the end of the wire. Change the standard resistance.");
        return;
      }
      state.jockeyL = md.l0;
      if (lSlider) lSlider.value = String(md.l0);
      syncLabels();
      computePhysics();
      toast("Jockey at the null point: l = " + md.l0.toFixed(1) + " cm, I_g = 0.00 mA");
    });
  }
  if (btnRecord) {
    btnRecord.addEventListener("click", function () {
      var snap = snapshot();
      document.dispatchEvent(new CustomEvent("bench:record", { detail: snap }));
      toast("Logged l = " + state.jockeyL.toFixed(1) + " cm, I_g = " + fmtIg(state.Ig_mA) + (state.balanced ? " (null)" : " (not balanced yet)"));
    });
  }

  syncLabels();
  computePhysics();
})();
