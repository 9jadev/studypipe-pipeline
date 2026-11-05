/* Lesson 04 · Inside a Moving-Coil Galvanometer — shunt bypass, multiplier drop and overload
   A real moving-coil mechanism: horseshoe magnet with curved soft-iron pole pieces, fixed
   soft-iron core, rectangular copper coil, hairspring, pointer and scale. The shunt or the
   multiplier coil is wired to its terminals, and charge dots show where the current goes. */
(function () {
  "use strict";
  var root = document.getElementById("zoom-stage");
  var canvas = document.getElementById("zoom-canvas");
  if (!root || !canvas || typeof THREE === "undefined" || !window.Apparatus) return;
  var A = window.Apparatus;
  var V = THREE.Vector3;

  var state = {
    mode: "shunt-bypass",
    label: "Ammeter Shunt Bypass · 4.99 A via R_s (0.0401 Ω) vs 0.010 A via R_g (20 Ω)"
  };

  var coilGroup, mech, rotor, coilMat, shuntApp, multApp, wires, flows = [];
  var tagShunt, tagMult, tagIn, tagOut, tagCoil;
  var pointerTarget = -0.8, pointerAngle = 0.8;

  var api = {
    rect: function () { return stage ? stage.rectOf(mech) : null; },
    highlight: function () {},
    setMode: applyMode
  };
  window.StudyScenes = window.StudyScenes || {};
  window.StudyScenes.zoom = api;

  var stage = window.SceneKit && window.SceneKit.createStage({
    root: root,
    canvas: canvas,
    fov: 34,
    target: new V(0.1, 1.0, 0.25),
    pitch: 0.28,
    yaw: 0.22,
    fitWidth: 5.3,
    distance: 5.2,
    minYaw: -0.6,
    maxYaw: 0.7,
    onFrame: frame
  });

  if (stage) { build(); stage.start(); }

  function poleShape() {
    var s = new THREE.Shape();
    var a = Math.asin(0.22 / 0.3);
    s.moveTo(0.54, -0.24); s.lineTo(0.54, 0.24); s.lineTo(Math.cos(a) * 0.3, 0.24);
    s.lineTo(Math.cos(a) * 0.3, 0.22);
    s.absarc(0, 0, 0.3, a, -a, true);
    s.lineTo(Math.cos(a) * 0.3, -0.24); s.lineTo(0.54, -0.24);
    return s;
  }

  function build() {
    var scene = stage.rig;
    scene.add(A.benchTop(6, 3.6));

    mech = new THREE.Group();
    mech.position.set(-0.55, 0.0, 0);
    scene.add(mech);
    coilGroup = mech;

    // base plate and terminals
    mech.add(new THREE.Mesh(A.roundedBox(1.7, 0.08, 1.1, 0.04), A.mat("bakelite")));
    mech.children[0].position.set(0, 0.04, 0.15);
    var tL = A.bindingPost("black", 1.3); tL.position.set(-0.55, 0.08, 0.55); mech.add(tL);
    var tR = A.bindingPost("red", 1.3); tR.position.set(0.55, 0.08, 0.55); mech.add(tR);
    mech.userData.ports = { neg: new V(-0.55, 0.08 + 0.16, 0.55), pos: new V(0.55, 0.08 + 0.16, 0.55) };

    var axisY = 1.27;
    var magnetMat = A.std(0xb3261e, 0.45, 0.25);
    // horseshoe magnet: one U-shaped piece whose arm tops carry the pole pieces
    var u = new THREE.Shape();
    u.moveTo(-0.7, 0.45); u.lineTo(-0.7, 0); u.absarc(0, 0, 0.7, Math.PI, Math.PI * 2, false);
    u.lineTo(0.7, 0.45); u.lineTo(0.5, 0.45); u.lineTo(0.5, 0); u.absarc(0, 0, 0.5, 0, -Math.PI, true);
    u.lineTo(-0.5, 0.45); u.lineTo(-0.7, 0.45);
    var uGeo = new THREE.ExtrudeGeometry(u, { depth: 0.44, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 2, curveSegments: 32 });
    uGeo.translate(0, 0, -0.22);
    var magnet = new THREE.Mesh(uGeo, magnetMat);
    magnet.position.y = axisY - 0.45;
    mech.add(magnet);
    // curved soft-iron pole pieces
    var poleGeo = new THREE.ExtrudeGeometry(poleShape(), { depth: 0.5, bevelEnabled: false, curveSegments: 24 });
    poleGeo.translate(0, 0, -0.25);
    var poleMat = A.std(0x9aa3ad, 0.32, 0.85);
    var pR = new THREE.Mesh(poleGeo, poleMat); pR.position.y = axisY; mech.add(pR);
    var pL = new THREE.Mesh(poleGeo, poleMat); pL.scale.x = -1; pL.position.y = axisY; mech.add(pL);
    // fixed soft-iron core
    var core = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.5, 40), A.std(0x7c858f, 0.4, 0.8));
    core.rotation.x = Math.PI / 2; core.position.y = axisY; mech.add(core);

    // rotating part: coil + pointer + counterweight
    rotor = new THREE.Group();
    rotor.position.set(0, axisY, 0);
    mech.add(rotor);
    var stripes = A.canvasTex(64, 256, function (g, w, h) {
      g.fillStyle = "#c8743a"; g.fillRect(0, 0, w, h);
      g.fillStyle = "rgba(60,25,5,0.45)";
      for (var y = 0; y < h; y += 6) g.fillRect(0, y, w, 2);
    });
    coilMat = A.std(0xffffff, 0.35, 0.7, { map: stripes, emissive: 0x000000 });
    [[0.245, 0, 0, 0.04, 0.2, 0.58], [-0.245, 0, 0, 0.04, 0.2, 0.58], [0, 0, 0.29, 0.53, 0.2, 0.04], [0, 0, -0.29, 0.53, 0.2, 0.04]].forEach(function (b) {
      var m = new THREE.Mesh(new THREE.BoxGeometry(b[3], b[4], b[5]), coilMat);
      m.position.set(b[0], b[1], b[2]); rotor.add(m);
    });
    var pg = new THREE.BoxGeometry(0.012, 0.98, 0.008); pg.translate(0, 0.49, 0);
    var pointer = new THREE.Mesh(pg, A.std(0x111111, 0.4)); pointer.position.z = 0.34; rotor.add(pointer);
    var tip = new THREE.Mesh(new THREE.ConeGeometry(0.012, 0.06, 8), A.std(0xd22d2d, 0.4)); tip.position.set(0, 1.0, 0.34); rotor.add(tip);
    var cw = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.03, 16), A.mat("brass")); cw.rotation.x = Math.PI / 2; cw.position.set(0, -0.12, 0.34); rotor.add(cw);
    var spindle = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.8, 10), A.mat("steel")); spindle.rotation.x = Math.PI / 2; rotor.add(spindle);
    // hairspring (fixed) — a flat spiral at the front
    var spiral = new THREE.Curve();
    spiral.getPoint = function (t, target) { var a = t * Math.PI * 2 * 4.5, r = 0.02 + t * 0.09; return (target || new V()).set(Math.cos(a) * r, Math.sin(a) * r, 0); };
    var spring = new THREE.Mesh(new THREE.TubeGeometry(spiral, 200, 0.004, 5, false), A.std(0xd9a441, 0.3, 0.9));
    spring.position.set(0, axisY, 0.38); mech.add(spring);
    // scale arc above the pointer
    var scaleMat = A.std(0xf4eedb, 0.6, 0, { side: THREE.DoubleSide });
    var arc = new THREE.Mesh(new THREE.RingGeometry(0.86, 1.06, 48, 1, Math.PI / 2 - 0.9, 1.8), scaleMat);
    arc.position.set(0, axisY, 0.33); mech.add(arc);
    for (var i = 0; i <= 10; i++) {
      var a = 0.8 - i * 0.16, big = i % 5 === 0;
      var tk = new THREE.Mesh(new THREE.BoxGeometry(0.008, big ? 0.09 : 0.05, 0.004), A.std(0x111111, 0.5));
      var rr = big ? 0.995 : 1.015;
      tk.position.set(-Math.sin(a) * rr, axisY + Math.cos(a) * rr, 0.335);
      tk.rotation.z = a;
      mech.add(tk);
    }
    var t0 = A.tag("0", { h: 0.09 }); t0.position.set(-Math.sin(0.8) * 1.16, axisY + Math.cos(0.8) * 1.16, 0.34); mech.add(t0);
    var t1 = A.tag("full scale", { h: 0.09 }); t1.position.set(Math.sin(0.8) * 1.2, axisY + Math.cos(0.8) * 1.2, 0.34); mech.add(t1);
    var tN = A.tag("N", { h: 0.12, bg: "rgba(179,38,30,.95)" }); tN.position.set(-0.75, axisY + 0.38, 0.3); mech.add(tN);
    var tS = A.tag("S", { h: 0.12, bg: "rgba(40,80,160,.95)" }); tS.position.set(0.75, axisY + 0.38, 0.3); mech.add(tS);
    tagCoil = A.tag("Moving coil (R_g = 20 Ω)", { h: 0.1, border: "rgba(255,178,63,.8)" });
    tagCoil.position.set(-0.55, 0.32, 0.75); scene.add(tagCoil);

    shuntApp = A.shunt();
    shuntApp.position.set(-0.55, 0, 1.25);
    shuntApp.scale.setScalar(1.3);
    scene.add(shuntApp);
    multApp = A.multiplierCoil();
    multApp.position.set(1.55, 0, 0.55);
    multApp.rotation.y = -0.4;
    scene.add(multApp);

    tagShunt = A.tag("Shunt R_s = 0.0401 Ω carries 4.99 A", { h: 0.1, border: "rgba(62,230,196,.8)" });
    tagShunt.position.set(-0.55, 0.06, 1.7);
    tagMult = A.tag("Multiplier R_m = 1480 Ω takes 14.8 V", { h: 0.1, border: "rgba(192,132,252,.8)" });
    tagMult.position.set(1.55, 0.62, 0.55);
    tagIn = A.tag("in", { h: 0.09 }); tagOut = A.tag("out", { h: 0.09 });
    scene.add(tagShunt, tagMult, tagIn, tagOut);

    wires = A.wireSet(scene);
  }

  function rewire() {
    wires.clear();
    flows = [];
    var P = A.worldPort;
    var L = new V(-2.2, 0.03, 1.3), R = new V(2.05, 0.03, 1.25);
    function add(a, b, color, speed, dotColor, opt) {
      var w = wires.add(A.wire(a, b, Object.assign({ color: color }, opt || {})));
      flows.push({ dots: wires.add(A.flow(w.userData.curve, { color: dotColor || 0x7cf7d4 })), speed: speed });
    }
    mech.updateWorldMatrix(true, true);
    var neg = P(mech, "neg"), pos = P(mech, "pos");
    // current through the coil itself: up one side, round the coil, down the other
    var coilPath = [neg, neg.clone().add(new V(0, 0.2, -0.15)), new V(-0.8, 1.27, 0.32), new V(-0.3, 1.27, 0.32), new V(0.2, 1.27, 0.32), pos.clone().add(new V(0, 0.2, -0.15)), pos];
    if (state.mode === "shunt-bypass") {
      shuntApp.updateWorldMatrix(true, true);
      add(neg, P(shuntApp, "a"), 0x1d1d22, 0.15, 0xffd36b, { lift: 0.12 });
      add(P(shuntApp, "b"), pos, 0xc0392b, 0.15, 0xffd36b, { lift: 0.12 });
      var sb = shuntApp.userData.bodyPath.map(function (p) { return p.clone().applyMatrix4(shuntApp.matrixWorld); });
      flows.push({ dots: wires.add(A.flow(sb, { color: 0x3ee6c4, spacing: 0.07 })), speed: 1.6 });
      add(L, P(shuntApp, "a"), 0x1d1d22, 1.6, 0x3ee6c4, { lift: 0.18 });
      add(P(shuntApp, "b"), R, 0xc0392b, 1.6, 0x3ee6c4, { lift: 0.18 });
      flows.push({ dots: wires.add(A.flow(coilPath, { color: 0xffd36b, spacing: 0.2 })), speed: 0.15 });
      tagIn.userData.setText("5.0 A in"); tagOut.userData.setText("5.0 A out");
    } else if (state.mode === "multiplier-drop") {
      multApp.updateWorldMatrix(true, true);
      add(pos, P(multApp, "a"), 0xc0392b, 0.25, 0xffd36b, { lift: 0.2 });
      var mb = multApp.userData.bodyPath.map(function (p) { return p.clone().applyMatrix4(multApp.matrixWorld); });
      flows.push({ dots: wires.add(A.flow(mb, { color: 0xc084fc, spacing: 0.12 })), speed: 0.25 });
      add(P(multApp, "b"), R, 0xc0392b, 0.25, 0xffd36b, { lift: 0.2 });
      add(L, neg, 0x1d1d22, 0.25, 0xffd36b, { lift: 0.2 });
      flows.push({ dots: wires.add(A.flow(coilPath, { color: 0xffd36b, spacing: 0.2 })), speed: 0.25 });
      tagIn.userData.setText("− (0 V)"); tagOut.userData.setText("+ (15 V)");
    } else {
      add(L, neg, 0x1d1d22, 1.6, 0xff6b6b, { lift: 0.2 });
      add(pos, R, 0xc0392b, 1.6, 0xff6b6b, { lift: 0.2 });
      flows.push({ dots: wires.add(A.flow(coilPath, { color: 0xff6b6b, spacing: 0.1 })), speed: 1.6 });
      tagIn.userData.setText("5.0 A in"); tagOut.userData.setText("5.0 A out");
    }
    tagIn.position.copy(L).add(new V(0.1, 0.22, 0));
    tagOut.position.copy(R).add(new V(-0.1, 0.22, 0));
  }

  function applyMode(m) {
    state.mode = m;
    if (shuntApp) {
      shuntApp.visible = tagShunt.visible = m === "shunt-bypass";
      multApp.visible = tagMult.visible = m === "multiplier-drop";
      coilMat.emissive.setHex(m === "overload" ? 0x8a1505 : 0x000000);
      tagCoil.userData.setText(m === "overload" ? "Coil overheating! 5 A ≫ 10 mA" : (m === "shunt-bypass" ? "Moving coil carries only 0.010 A" : "Moving coil: 0.010 A, 0.20 V"));
      rewire();
    }
    if (m === "shunt-bypass") {
      pointerTarget = -0.8;
      state.label = "Parallel Shunt (R_s = 0.0401 Ω) · 99.8% of Current (4.99 A) Bypasses Coil!";
    } else if (m === "multiplier-drop") {
      pointerTarget = -0.8;
      state.label = "Series Multiplier (R_m = 1480 Ω) · Absorbs 14.80 V so Coil Sees Only 0.20 V!";
    } else {
      pointerTarget = -1.25;
      state.label = "Unprotected Galvanometer · Overload Current Exceeds I_g (10 mA)!";
    }

    var pills = document.querySelectorAll("[data-zmode]");
    pills.forEach(function (b) {
      b.classList.toggle("on", b.getAttribute("data-zmode") === m);
    });
    // the 3D tags are tiny on a phone, so the key currents / p.d.s also go in an HTML readout
    var ro = document.getElementById("zoom-readout");
    if (ro) {
      var cells = m === "shunt-bypass" ? [["Meter I", "5.0 A"], ["Coil I_g", "10 mA"], ["Shunt I_s", "4.99 A"]]
        : m === "multiplier-drop" ? [["Meter V", "15.0 V"], ["Coil V_g", "0.20 V"], ["R_m drops", "14.8 V"]]
        : [["Meter I", "5.0 A"], ["Coil I", "5.0 A", "hot"], ["Safe I_g", "10 mA"]];
      ro.innerHTML = cells.map(function (c) { return '<div class="' + (c[2] || "") + '"><span>' + c[0] + "</span><b>" + c[1] + "</b></div>"; }).join("");
    }
    var status = document.getElementById("zoom-status");
    if (status) status.textContent = state.label;
    document.dispatchEvent(new CustomEvent("zoom:mode", { detail: { mode: m } }));
  }

  function frame(dt, t) {
    if (!rotor) return;
    var target = pointerTarget + (state.mode === "overload" ? Math.sin((t || 0) * 30) * 0.04 : 0);
    pointerAngle += (target - pointerAngle) * Math.min(1, dt * 5);
    rotor.rotation.z = pointerAngle;
    for (var i = 0; i < flows.length; i++) flows[i].dots.userData.update(dt, flows[i].speed);
  }

  document.querySelectorAll("[data-zmode]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      applyMode(btn.getAttribute("data-zmode"));
    });
  });

  applyMode("shunt-bypass");
})();
