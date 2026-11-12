/* Lesson 04 · force zoom (window.StudyScenes.zoom)
   Rule 5b: the force resolution is planar, so it is the 2D Paper.js "pendulum-forces" scene of
   ShmKinematics2D in #zoom-canvas (thread at θ, mg, T, mg cos θ, mg sin θ, x/l triangle, a = g sin θ).
   A small 3D PendulumKit "forces" view in #zoom-canvas-3d swings alongside for context only.
   Every number comes from ShmKinematics2D.model (reading()). */
(function () {
  "use strict";
  var root = document.getElementById("zoom-stage");
  var canvas = document.getElementById("zoom-canvas");
  var canvas3 = document.getElementById("zoom-canvas-3d");
  if (!root || !canvas) return;

  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var $ = function (s) { return document.querySelector(s); };
  var toastEl = $("#zoom-toast"), toastT;
  function toast(m) {
    if (!toastEl) return;
    toastEl.textContent = m; toastEl.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove("show"); }, 3400);
  }

  var state = { theta: 20, mass: 50, swing: false };
  var readoutEl = $("#zoom-readout"), slider = $("#zoom-theta"), sliderV = $("#zoom-theta-v");
  var massBtns = Array.prototype.slice.call(document.querySelectorAll("#zoom-stage [data-mass]"));
  var swingBtn = $("#zoom-swing");

  // ---------- 2D Paper.js force diagram ----------
  var k2 = null;
  if (window.paper && window.ShmKinematics2D) {
    try {
      k2 = ShmKinematics2D.create({ canvas: canvas, scene: "pendulum-forces", theta_deg: 20, mass_g: 50, l: 0.5, g: 9.8, autoplay: false, labels: true, surface: "ink", onChange: onChange });
    } catch (e) { k2 = null; }
  }
  if (!k2) root.classList.add("no-webgl");   // clearly marked fallback: the stage shows its fallback text

  // ---------- small 3D context (PendulumKit "forces": bob + thread swinging, no force arrows) ----------
  var kit3 = null, stage3 = null, FOV = 32;
  if (canvas3 && window.PendulumKit && window.SceneKit && typeof THREE !== "undefined") {
    kit3 = PendulumKit.create({ mode: "forces", angle_deg: 20, l: 0.5, bob: 50, labels: false });
    stage3 = SceneKit.createStage({
      root: document.getElementById("zoom-ctx"), canvas: canvas3, fov: FOV, autoFit: false, zoomUi: false, portraitPitch: 0,
      target: new THREE.Vector3(0.1, 1.2, 0), pitch: 0.08, yaw: 0.25, distance: 1.6, noOrbit: true, onFrame: frame3
    });
    if (stage3) { stage3.rig.add(kit3); stage3.start(); }
  }
  var aimed = false;
  function frame3(dt, t) {
    if (!kit3) return;
    kit3.update(dt, t);
    if (!aimed && stage3) {
      aimed = true;
      var v = kit3.viewFor("all"), tn = Math.tan(FOV * Math.PI / 360), a = stage3.camera.aspect || 0.75;
      stage3.target.fromArray(v.target);
      stage3.dist = Math.max(v.size[1] / 2 / tn, v.size[0] / 2 / (tn * a)) * 1.05 + v.size[2] / 2;
    }
    if (stage3 && aimed) {
      // SceneKit.resize() resets dist; keep our framing
      var v2 = kit3.viewFor("all"), tn2 = Math.tan(FOV * Math.PI / 360), a2 = stage3.camera.aspect || 0.75;
      stage3.dist = Math.max(v2.size[1] / 2 / tn2, v2.size[0] / 2 / (tn2 * a2)) * 1.05 + v2.size[2] / 2;
    }
  }

  // ---------- readouts ----------
  function paint(r) {
    r = r || (k2 && k2.reading());
    if (!readoutEl || !r) return;
    var d = r.display || {};
    readoutEl.innerHTML =
      '<div><span>θ / rad</span><b>' + (d.rad || "—") + '</b></div>' +
      '<div><span>sin θ</span><b>' + (d.sin || "—") + '</b></div>' +
      '<div class="hot"><span>mg sin θ</span><b>' + (r.mg_sin != null ? Math.abs(r.mg_sin).toFixed(3) + " N" : "—") + '</b></div>' +
      '<div><span>a / m s⁻²</span><b>' + (r.a != null ? Math.abs(r.a).toFixed(2) : "—") + '</b></div>';
  }
  function onChange(r) {
    if (r && r.theta0_deg != null && !state.swing) {
      var th = Math.round(Math.abs(r.theta0_deg));
      if (th !== state.theta) { state.theta = th; syncSlider(); if (kit3) kit3.setState({ angle_deg: th }); }
    }
    paint(r);
  }
  function syncSlider() {
    if (slider) slider.value = String(state.theta);
    if (sliderV) sliderV.textContent = state.theta + "°";
  }

  function setTheta(th) {
    th = Math.max(2, Math.min(45, Math.round(+th)));
    state.theta = th; syncSlider();
    if (k2) k2.setState({ theta_deg: th });
    if (kit3) kit3.setState({ angle_deg: th });
    paint();
  }
  function setMass(m) {
    if (m !== 50 && m !== 100) return;
    state.mass = m;
    massBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(+b.getAttribute("data-mass") === m)); });
    if (k2) k2.setState({ mass_g: m });
    if (kit3) kit3.setState({ bob: m });
    paint();
    toast(m === 100 ? "100 g: mg, T and both components double — but a = g sin θ is unchanged." : "50 g: half the force, half the inertia — the same acceleration.");
    emit("l4:zoom", { mode: "pendulum-forces", mass: m, theta: state.theta });
  }
  function setSwing(on) {
    state.swing = !!on;
    if (swingBtn) { swingBtn.setAttribute("aria-pressed", String(state.swing)); swingBtn.textContent = state.swing ? "Hold" : "Swing"; }
    if (k2) { if (state.swing) k2.play(); else { k2.pause(); k2.setState({ theta_deg: state.theta, t: 0 }); } }
  }

  if (slider) slider.addEventListener("input", function () { setTheta(slider.value); });
  if (slider) slider.addEventListener("change", function () { emit("l4:zoom", { mode: "pendulum-forces", theta: state.theta, mass: state.mass }); });
  massBtns.forEach(function (b) { b.addEventListener("click", function () { setMass(+b.getAttribute("data-mass")); }); });
  if (swingBtn) swingBtn.addEventListener("click", function () { setSwing(!state.swing); });

  // ---------- scene API for narrator / tests ----------
  var api = {
    setMode: function (m) {
      // modes for the narrator: "theta:30", "mass:100", "swing", "hold"
      var p = String(m || "").split(":");
      if (p[0] === "theta") setTheta(+p[1]);
      else if (p[0] === "mass") setMass(+p[1]);
      else if (p[0] === "swing") setSwing(true);
      else if (p[0] === "hold") setSwing(false);
    },
    theta: setTheta, mass: setMass, swing: setSwing,
    reset: function () { setSwing(false); setTheta(20); setMass(50); },
    highlight: function (p) { if (k2) k2.highlight(p || null); },
    rect: function (p) {
      if (p === "context" || p === "3d") { var c = document.getElementById("zoom-ctx"); var b = c.getBoundingClientRect(); return { left: b.left, top: b.top, width: b.width, height: b.height }; }
      if (k2) return k2.rect(p);
      var r = canvas.getBoundingClientRect(); return { left: r.left, top: r.top, width: r.width, height: r.height };
    },
    reading: function () { return k2 ? k2.reading() : null; }, kit: k2, kit3: kit3
  };
  window.StudyScenes = window.StudyScenes || {};
  window.StudyScenes.zoom = api;

  syncSlider(); paint();
  setInterval(function () { if (state.swing) paint(); }, 300);
})();
