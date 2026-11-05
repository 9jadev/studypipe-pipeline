/* Lesson 03 · Inside a Parallel Junction & the Power Efficiency Split
   Left: a real junction — 4 A arrives, splits through a 4 Ω and a 12 Ω colour-banded resistor
   (3 A and 1 A, shown by charge-dot speed) and rejoins.
   Right: a labelled bar chart of where the cell's energy goes (useful in the load vs wasted
   inside the cells) for each cell arrangement. */
(function () {
  "use strict";
  var root = document.getElementById("zoom-stage");
  var canvas = document.getElementById("zoom-canvas");
  if (!root || !canvas || typeof THREE === "undefined" || !window.Apparatus) return;
  var A = window.Apparatus;
  var V = THREE.Vector3;

  var state = {
    mode: "parallel-4-12",
    I_top: 3.0,
    I_bot: 1.0,
    eff: 75.0,
    label: "Parallel 4 Ω ∥ 12 Ω · 3:1 Current Split"
  };

  var juncGroup, loadBar, lossBar, loadTag, lossTag, chartTitle, flows = [];
  var barH = 1.3, curLoad = 0.75, curLoss = 0.25;

  var api = {
    rect: function () { return stage ? stage.rectOf(juncGroup) : null; },
    highlight: function () {},
    setMode: applyMode
  };
  window.StudyScenes = window.StudyScenes || {};
  window.StudyScenes.zoom = api;

  var stage = window.SceneKit && window.SceneKit.createStage({
    root: root,
    canvas: canvas,
    fov: 34,
    target: new V(0, 0.75, 0),
    pitch: 0.16,
    yaw: 0.0,
    fitWidth: 5.4,
    distance: 5.2,
    minYaw: -0.6,
    maxYaw: 0.6,
    onFrame: frame
  });

  if (stage) { build(); stage.start(); }

  function build() {
    var scene = stage.rig;
    scene.add(A.benchTop(6.2, 3));

    // ---- left: the junction ----
    juncGroup = new THREE.Group();
    scene.add(juncGroup);
    var yT = 1.25, yB = 0.45, yM = 0.85, xL = -1.45, xR = 0.15;
    var rTop = A.resistorBody(4, 0.34); rTop.scale.setScalar(1.7); rTop.position.set(-0.65, yT, 0);
    var rBot = A.resistorBody(12, 0.34); rBot.scale.setScalar(1.7); rBot.position.set(-0.65, yB, 0);
    juncGroup.add(rTop, rBot);
    var nodeMat = A.mat("brass");
    [xL, xR].forEach(function (x) {
      var n = new THREE.Mesh(new THREE.SphereGeometry(0.06, 20, 16), nodeMat); n.position.set(x, yM, 0); juncGroup.add(n);
    });
    var hl = 0.34 * 1.7 / 2;
    function wireAlong(points, color) {
      var w = A.wire(points[0], points[points.length - 1], { color: color, lift: 0, via: points.slice(1, -1), r: 0.02 });
      juncGroup.add(w);
      return w.userData.curve;
    }
    var red = 0xc0392b;
    var cIn = wireAlong([new V(-2.45, yM, 0), new V(-2.0, yM, 0), new V(xL, yM, 0)], red);
    var cT1 = wireAlong([new V(xL, yM, 0), new V(xL + 0.08, yT - 0.15, 0), new V(-0.65 - hl - 0.12, yT, 0), new V(-0.65 - hl, yT, 0)], red);
    var cT2 = wireAlong([new V(-0.65 + hl, yT, 0), new V(-0.65 + hl + 0.12, yT, 0), new V(xR - 0.08, yT - 0.15, 0), new V(xR, yM, 0)], red);
    var cB1 = wireAlong([new V(xL, yM, 0), new V(xL + 0.08, yB + 0.15, 0), new V(-0.65 - hl - 0.12, yB, 0), new V(-0.65 - hl, yB, 0)], red);
    var cB2 = wireAlong([new V(-0.65 + hl, yB, 0), new V(-0.65 + hl + 0.12, yB, 0), new V(xR - 0.08, yB + 0.15, 0), new V(xR, yM, 0)], red);
    var cOut = wireAlong([new V(xR, yM, 0), new V(0.35, yM, 0), new V(0.55, yM, 0)], red);
    var bodyT = [new V(-0.65 - hl, yT, 0.11), new V(-0.65 + hl, yT, 0.11)];
    var bodyB = [new V(-0.65 - hl, yB, 0.11), new V(-0.65 + hl, yB, 0.11)];
    function f(curve, key, color, spacing) {
      var d = A.flow(curve, { color: color, spacing: spacing || 0.16 });
      juncGroup.add(d);
      flows.push({ dots: d, key: key });
    }
    f(cIn, "main", 0x7cf7d4); f(cOut, "main", 0x7cf7d4);
    f(cT1, "top", 0x7cf7d4); f(cT2, "top", 0x7cf7d4); f(bodyT, "top", 0xffd36b, 0.12);
    f(cB1, "bot", 0x7cf7d4); f(cB2, "bot", 0x7cf7d4); f(bodyB, "bot", 0xffd36b, 0.12);
    var tIn = A.tag("I = 4 A", { h: 0.12 }); tIn.position.set(-2.1, yM + 0.2, 0); juncGroup.add(tIn);
    var tT = A.tag("4 Ω takes 3 A", { h: 0.12, border: "rgba(62,230,196,.8)" }); tT.position.set(-0.65, yT + 0.3, 0); juncGroup.add(tT);
    var tB = A.tag("12 Ω takes 1 A", { h: 0.12, border: "rgba(255,178,63,.8)" }); tB.position.set(-0.65, yB - 0.3, 0); juncGroup.add(tB);
    var tOut = A.tag("4 A", { h: 0.12 }); tOut.position.set(0.45, yM + 0.2, 0); juncGroup.add(tOut);

    // ---- right: energy split chart ----
    var cx = 1.75;
    var board = A.canvasTex(512, 600, function (g, w, h) {
      g.fillStyle = "#f4eedb"; g.fillRect(0, 0, w, h);
      var top = 60, bot = h - 40;
      g.font = "700 26px Manrope, sans-serif"; g.fillStyle = "#3d362c"; g.textAlign = "right"; g.textBaseline = "middle";
      for (var p = 0; p <= 100; p += 25) {
        var y = bot - (bot - top) * p / 100;
        g.strokeStyle = p === 0 ? "#3d362c" : "rgba(61,54,44,0.25)"; g.lineWidth = p === 0 ? 3 : 2;
        g.beginPath(); g.moveTo(80, y); g.lineTo(w - 20, y); g.stroke();
        g.fillText(p + "%", 70, y);
      }
    });
    var bw = 1.5, bh = 1.6;
    var backboard = new THREE.Mesh(new THREE.PlaneGeometry(bw, bh), new THREE.MeshStandardMaterial({ map: board, roughness: 0.7 }));
    backboard.position.set(cx, 0.05 + bh / 2, -0.3);
    scene.add(backboard);
    var frameMat = A.mat("wood");
    scene.add(new THREE.Mesh(new THREE.BoxGeometry(bw + 0.08, bh + 0.08, 0.04), frameMat).translateX(cx).translateY(0.05 + bh / 2).translateZ(-0.33));
    // chart geometry maps: 0% at y = 0.05 + bh*(40/600), 100% at 0.05 + bh*(1 - 60/600)
    var y0 = 0.05 + bh * (40 / 600), y100 = 0.05 + bh * (1 - 60 / 600);
    barH = y100 - y0;
    loadBar = new THREE.Mesh(A.roundedBox(0.36, 1, 0.24, 0.03), A.std(0x2fb344, 0.4, 0.1));
    lossBar = new THREE.Mesh(A.roundedBox(0.36, 1, 0.24, 0.03), A.std(0xe0414f, 0.4, 0.1));
    loadBar.position.set(cx - 0.12, y0, -0.12); lossBar.position.set(cx + 0.42, y0, -0.12);
    loadBar.userData.y0 = lossBar.userData.y0 = y0;
    scene.add(loadBar, lossBar);
    loadTag = A.tag("75%", { h: 0.12, bg: "rgba(31,138,53,.95)" });
    lossTag = A.tag("25%", { h: 0.12, bg: "rgba(190,40,55,.95)" });
    scene.add(loadTag, lossTag);
    var l1 = A.tag("Useful (in load)", { h: 0.09 }); l1.position.set(cx - 0.12, 0.02, 0.1); scene.add(l1);
    var l2 = A.tag("Wasted (in cells)", { h: 0.09 }); l2.position.set(cx + 0.42, -0.09, 0.1); scene.add(l2);
    chartTitle = A.tag("Where the energy goes", { h: 0.11 });
    chartTitle.position.set(cx, 0.05 + bh + 0.14, -0.3);
    scene.add(chartTitle);
  }

  function setBars(load, loss) {
    [[loadBar, load, loadTag], [lossBar, loss, lossTag]].forEach(function (b) {
      var h = Math.max(0.02, b[1] * barH);
      b[0].scale.y = h;
      b[0].position.y = b[0].userData.y0 + h / 2;
      b[2].position.set(b[0].position.x, b[0].userData.y0 + h + 0.12, -0.05);
    });
  }

  // Energy split for each mode, from I = E/(R + r), P_load = I²R, P_lost = I²r, η = R/(R + r)
  //  parallel-4-12  : Trial 2 — 12 V accumulator (r ≈ 0) on 4 Ω ∥ 12 Ω = 3 Ω → 4 A, split 3 A : 1 A
  //  series-cells   : 6.0 V, r 4.5 Ω on 1.5 Ω → 1.00 A, 1.50 W useful, 4.50 W lost, 25 %
  //  parallel-cells : 2.0 V, r 0.5 Ω on 1.5 Ω → 1.00 A, 1.50 W useful, 0.50 W lost, 75 %
  //  max-power      : series cells on matched R = r = 4.5 Ω → 0.67 A, 2.00 W useful, 2.00 W lost, 50 %
  var MODES = {
    "parallel-4-12":  { E: 12, r: 0,   R: 3,   label: "12 V, r ≈ 0, on 4 Ω ∥ 12 Ω · η ≈ 100 %", title: "12 V accumulator (r ≈ 0)" },
    "series-cells":   { E: 6,  r: 4.5, R: 1.5, label: "3 series cells on 1.5 Ω · η = 25 %",     title: "3 cells in series on 1.5 Ω" },
    "parallel-cells": { E: 2,  r: 0.5, R: 1.5, label: "3 parallel cells on 1.5 Ω · η = 75 %",   title: "3 cells in parallel on 1.5 Ω" },
    "max-power":      { E: 6,  r: 4.5, R: 4.5, label: "Matched load R = r = 4.5 Ω · η = 50 %",  title: "Matched load R = r" }
  };

  function paintReadout(d) {
    var box = document.getElementById("zoom-readout");
    if (!box) return;
    var I = d.E / (d.R + d.r), Pl = I * I * d.R, Pw = I * I * d.r;
    function w(v) { return (v >= 10 ? v.toFixed(0) : v.toFixed(2)) + " W"; }
    box.innerHTML =
      "<div><span>EMF E</span><b>" + d.E.toFixed(1) + " V</b></div>" +
      "<div><span>Internal r</span><b>" + (d.r ? d.r.toFixed(1) + " Ω" : "≈ 0") + "</b></div>" +
      "<div><span>Load R</span><b>" + d.R.toFixed(1) + " Ω</b></div>" +
      "<div><span>Current I</span><b>" + I.toFixed(2) + " A</b></div>" +
      "<div><span>Useful I²R</span><b>" + w(Pl) + "</b></div>" +
      "<div class=\"hot\"><span>Lost I²r</span><b>" + w(Pw) + "</b></div>" +
      "<div><span>η</span><b>" + (100 * d.R / (d.R + d.r)).toFixed(0) + " %</b></div>";
  }

  function applyMode(m) {
    if (!MODES[m]) m = "parallel-4-12";
    state.mode = m;
    var d = MODES[m];
    state.eff = 100 * d.R / (d.R + d.r);
    state.label = d.label;
    paintReadout(d);
    if (loadTag) {
      loadTag.userData.setText(state.eff.toFixed(0) + "%");
      lossTag.userData.setText((100 - state.eff).toFixed(0) + "%");
      chartTitle.userData.setText(d.title);
    }

    var pills = document.querySelectorAll("[data-zmode]");
    pills.forEach(function (b) {
      b.classList.toggle("on", b.getAttribute("data-zmode") === m);
    });
    var status = document.getElementById("zoom-status");
    if (status) {
      status.textContent = state.label;
    }
    document.dispatchEvent(new CustomEvent("zoom:mode", { detail: { mode: m } }));
  }

  function frame(dt) {
    if (!loadBar) return;
    curLoad += (state.eff / 100 - curLoad) * Math.min(1, dt * 4);
    curLoss += ((100 - state.eff) / 100 - curLoss) * Math.min(1, dt * 4);
    setBars(curLoad, curLoss);
    var sp = { main: 4 * 0.22, top: state.I_top * 0.22, bot: state.I_bot * 0.22 };
    for (var i = 0; i < flows.length; i++) flows[i].dots.userData.update(dt, sp[flows[i].key]);
  }

  document.querySelectorAll("[data-zmode]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      applyMode(btn.getAttribute("data-zmode"));
    });
  });

  applyMode("parallel-4-12");
})();
