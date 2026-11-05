/* Lesson 05 · Potentiometer null point, up close
   The 100 cm board with its driver accumulator, the test cell E_x, a centre-zero galvanometer
   and the knife-edge jockey. At the null point the galvanometer branch dots stand still and the
   needle reads zero; either side of it they flow one way or the other and the needle swings. */
(function () {
  "use strict";
  var root = document.getElementById("zoom-stage");
  var canvas = document.getElementById("zoom-canvas");
  if (!root || !canvas || typeof THREE === "undefined" || !window.Apparatus) return;
  var A = window.Apparatus;
  var V = THREE.Vector3;

  var state = {
    mode: "null-point",
    label: "Exact Null Point (V_AJ = E_x) · Galvanometer Current I_g = 0 · Lost Volts Ir = 0!"
  };

  var board, topWire, jock, galv, cell, acc, wires, halo, tagJ, tagG, tagState;
  var flows = [], galvSpeed = 0, galvColor = 0x2fb344;
  var L_NULL = 50, jockeyL = 50, jockeyTarget = 50;

  var api = {
    rect: function () { return stage ? stage.rectOf(topWire || board) : null; },
    highlight: function () {},
    setMode: applyMode
  };
  window.StudyScenes = window.StudyScenes || {};
  window.StudyScenes.zoom = api;

  var stage = window.SceneKit && window.SceneKit.createStage({
    root: root,
    canvas: canvas,
    fov: 34,
    target: new V(0, 0.3, 0.0),
    pitch: 0.55,
    yaw: 0.0,
    fitWidth: 4.7,
    distance: 5.2,
    minYaw: -0.6,
    maxYaw: 0.6,
    onFrame: frame
  });

  if (stage) { build(); stage.start(); }

  function build() {
    var scene = stage.rig;
    scene.add(A.benchTop(6, 4));

    board = A.metreBridgeBoard();
    board.position.set(0, 0, 0.25);
    scene.add(board);
    var wd = board.userData.wire;
    topWire = new THREE.Group();
    topWire.position.set(0, wd.y, wd.z + 0.25);
    scene.add(topWire);

    jock = A.jockey();
    halo = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.012, 10, 32), new THREE.MeshStandardMaterial({ color: 0x2fb344, emissive: 0x2fb344, emissiveIntensity: 1 }));
    halo.rotation.x = Math.PI / 2;
    jock.add(halo);
    scene.add(jock);

    galv = A.meter({ unit: "G", majors: [30, 20, 10, 0, 10, 20, 30], minor: 5, zero: true, sub: "centre-zero", size: 1.15 });
    galv.position.set(0.45, 0, -1.15);
    scene.add(galv);
    cell = A.cellHolder({ text: "E_x", color: "#2e9d3c" });
    cell.position.set(-1.25, 0, -1.05);
    scene.add(cell);
    acc = A.accumulator({ text: "2 V" });
    acc.position.set(-1.95, 0, 1.15);
    acc.scale.setScalar(0.85);
    scene.add(acc);

    wires = A.wireSet(scene);

    tagJ = A.tag("Jockey", { h: 0.11, border: "rgba(124,247,212,.8)" });
    tagG = A.tag("Galvanometer reads 0", { h: 0.11, border: "rgba(47,179,68,.9)" });
    tagG.position.set(0.45, 1.05, -1.0);
    var tCell = A.tag("Test cell E_x", { h: 0.1, border: "rgba(47,179,68,.8)" }); tCell.position.set(-1.25, 0.45, -1.05);
    var tAcc = A.tag("Driver cell", { h: 0.1 }); tAcc.position.set(-1.95, 0.6, 1.15);
    tagState = A.tag("", { h: 0.12 });
    tagState.position.set(0, 0.05, 1.05);
    scene.add(tagJ, tagG, tCell, tAcc, tagState);

    // driver circuit + current along the wire (always flowing)
    [board, acc, cell, galv].forEach(function (o) { o.updateWorldMatrix(true, true); });
    var P = A.worldPort;
    var d1 = A.wire(P(acc, "pos"), P(board, "A"), { color: 0xc0392b, lift: 0.22 });
    var d2 = A.wire(P(acc, "neg"), P(board, "C"), { color: 0x1d1d22, via: [new V(-1.4, 0.15, 1.55), new V(1.0, 0.1, 1.5), new V(2.0, 0.2, 0.9)] });
    scene.add(d1, d2);
    var wl = [new V(wd.x0, wd.y + 0.012, wd.z), new V(wd.x1, wd.y + 0.012, wd.z)].map(function (p) { return p.applyMatrix4(board.matrixWorld); });
    [d1.userData.curve, wl, d2.userData.curve].forEach(function (c, i) {
      var f = A.flow(c, { color: i === 1 ? 0xffd36b : 0x7cf7d4, spacing: 0.22 });
      scene.add(f);
      flows.push({ dots: f, speed: i === 2 ? -0.45 : 0.45, fixed: true });
    });
  }

  function rewireGalv() {
    wires.clear();
    flows = flows.filter(function (f) { return f.fixed; });
    var P = A.worldPort;
    jock.updateWorldMatrix(true, true);
    var w1 = wires.add(A.wire(P(cell, "pos"), P(board, "A2"), { color: 0xc0392b, lift: 0.2 }));
    var w2 = wires.add(A.wire(P(cell, "neg"), P(galv, "neg"), { color: 0x2f62d6, lift: 0.2 }));
    var w3 = wires.add(A.wire(P(galv, "pos"), P(jock, "top"), { color: 0x2f62d6, lift: 0.3 }));
    [w3, w2, w1].forEach(function (w) {
      var f = wires.add(A.flow(w.userData.curve, { color: galvColor, spacing: 0.14 }));
      flows.push({ dots: f, galv: true });
    });
  }

  function applyMode(m) {
    state.mode = m;
    if (m === "null-point") {
      jockeyTarget = L_NULL; galvSpeed = 0; galvColor = 0x2fb344;
      state.label = "Exact Null Point (V_AJ = E_x) · Test Branch Current I_g = 0 (Static Green Charges, Ir = 0!)";
    } else if (m === "left-of-null") {
      jockeyTarget = 32; galvSpeed = 0.4; galvColor = 0xffb23f;
      state.label = "Jockey Too Far Left (V_AJ < E_x) · Test Cell Discharges (I_g Flows Right, Lost Volts Ir > 0)";
    } else {
      jockeyTarget = 68; galvSpeed = -0.4; galvColor = 0xf43f5e;
      state.label = "Jockey Too Far Right (V_AJ > E_x) · Driver Forces Current Back Into Test Cell (I_g Reverses!)";
    }
    if (galv) {
      galv.userData.setFraction(m === "null-point" ? 0 : (m === "left-of-null" ? -0.65 : 0.65));
      galv.userData.needleMat.color.setHex(m === "null-point" ? 0x1f8a35 : 0x111111);
      halo.visible = m === "null-point";
      tagG.userData.setText(m === "null-point" ? "Galvanometer reads 0" : (m === "left-of-null" ? "Needle swings left" : "Needle swings right"));
      tagState.userData.setText(m === "null-point" ? "V_AJ = E_x → no current in the test cell" : (m === "left-of-null" ? "V_AJ < E_x → test cell pushes current" : "V_AJ > E_x → current forced back into test cell"));
    }

    var pills = document.querySelectorAll("[data-zmode]");
    pills.forEach(function (b) {
      b.classList.toggle("on", b.getAttribute("data-zmode") === m);
    });
    var status = document.getElementById("zoom-status");
    if (status) status.textContent = state.label;
    document.dispatchEvent(new CustomEvent("zoom:mode", { detail: { mode: m } }));
  }

  var lastL = -1;
  function frame(dt, t) {
    if (!jock) return;
    jockeyL += (jockeyTarget - jockeyL) * Math.min(1, dt * 4);
    var wd = board.userData.wire;
    jock.position.set(board.userData.xAt(jockeyL), wd.y, wd.z + 0.25);
    tagJ.userData.setText("Jockey · l = " + Math.round(jockeyL) + " cm");
    tagJ.position.set(jock.position.x, 0.62, jock.position.z + 0.05);
    if (Math.abs(jockeyL - lastL) > 0.05) { lastL = jockeyL; rewireGalv(); flows.forEach(function (f) { if (f.galv) f.dots.userData.setColor(galvColor); }); }
    if (halo.visible) halo.scale.setScalar(1 + Math.sin((t || 0) * 4) * 0.12);
    galv.userData.update(dt);
    for (var i = 0; i < flows.length; i++) {
      var f = flows[i];
      f.dots.userData.update(dt, f.galv ? galvSpeed : f.speed);
    }
  }

  document.querySelectorAll("[data-zmode]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      applyMode(btn.getAttribute("data-zmode"));
    });
  });

  applyMode("null-point");
})();
