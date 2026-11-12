/* Lesson 04 · 3D zoom (window.StudyScenes.zoom): inside the moving-coil galvanometer.
   DcConceptZoom "coil" mode — the coil in its radial field with hairspring and pointer,
   a thick copper shunt carrying ~99 % of the current, and the tall series multiplier bobbin.
   Every number comes from the kit's model. */
(function () {
  "use strict";
  var root = document.getElementById("zoom-stage");
  var canvas = document.getElementById("zoom-canvas");
  var D = window.L04;
  if (!root || !canvas || !D || typeof THREE === "undefined" || !window.DcConceptZoom) return;

  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var $ = function (s) { return document.querySelector(s); };
  var toastEl = $("#zoom-toast"), toastT;
  function toast(m) {
    if (!toastEl) return;
    toastEl.textContent = m; toastEl.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove("show"); }, 3400);
  }
  var small = window.innerWidth < 560;
  var state = { view: "ammeter" };   // ammeter | voltmeter | bare

  var kit = DcConceptZoom.create({ mode: "coil", labels: !small });
  kit.setState({ conversion: "ammeter", target: 3.0, input: 0.8 });

  var goal = { target: new THREE.Vector3(0, 1, 0), dist: 6 };
  var stage = window.SceneKit && SceneKit.createStage({
    root: root, canvas: canvas, fov: 36, autoFit: false, zoomUi: true,
    target: new THREE.Vector3(0, 1, 0), pitch: 0.16, yaw: 0.12, distance: 6,
    minYaw: -0.9, maxYaw: 0.9, onFrame: frame
  });
  var snapped = false;
  if (stage) { stage.rig.add(kit); stage.start(); }
  function aim() { var v = kit.viewFor("all"); goal.target.fromArray(v.target); goal.dist = v.dist; }
  function frame(dt, t) {
    kit.update(dt, t);
    if (stage) {
      var a = stage.camera.aspect || 1, d = goal.dist * Math.max(1, Math.min(1.9, 0.7 / a));
      if (!snapped) { stage.target.copy(goal.target); stage.dist = d; snapped = true; }
      var k = Math.min(1, dt * 4);
      stage.target.lerp(goal.target, k); stage.dist += (d - stage.dist) * k;
    }
  }

  var readoutEl = $("#zoom-readout");
  var modeBtns = Array.prototype.slice.call(document.querySelectorAll("#zoom-mode [data-view]"));

  function paint() {
    if (!readoutEl) return;
    var r = kit.reading();
    if (state.view === "ammeter") {
      readoutEl.innerHTML =
        '<div><span>Shunt R_s</span><b class="sm">' + D.sf3(r.R_s) + ' Ω</b></div>' +
        '<div class="hot"><span>Through shunt</span><b class="sm">' + (r.shunt_pct != null ? r.shunt_pct.toFixed(1) : "99.5") + '%</b></div>' +
        '<div><span>Coil current</span><b class="sm">' + (r.I_coil_mA != null ? r.I_coil_mA.toFixed(1) : "15.0") + ' mA</b></div>' +
        '<div><span>Reads</span><b class="sm">3.0 A FSD</b></div>';
    } else if (state.view === "voltmeter") {
      readoutEl.innerHTML =
        '<div><span>Multiplier R_m</span><b class="sm">' + D.sf3(r.R_m) + ' Ω</b></div>' +
        '<div class="hot"><span>Whole meter R</span><b class="sm">' + D.sf3(r.R_total) + ' Ω</b></div>' +
        '<div><span>Coil current</span><b class="sm">' + (r.I_coil_mA != null ? r.I_coil_mA.toFixed(1) : "15.0") + ' mA</b></div>' +
        '<div><span>Reads</span><b class="sm">40 V FSD</b></div>';
    } else {
      readoutEl.innerHTML =
        '<div><span>Bare coil I_g</span><b class="sm">15 mA</b></div>' +
        '<div class="hot"><span>If 3 A pushed in</span><b class="sm">burns out</b></div>' +
        '<div><span>Coil R_g</span><b class="sm">18 Ω</b></div>' +
        '<div><span>Needs</span><b class="sm">a shunt!</b></div>';
    }
  }

  function setView(v) {
    if (v !== "ammeter" && v !== "voltmeter" && v !== "bare") return;
    state.view = v;
    modeBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-view") === v)); });
    if (v === "ammeter") kit.setState({ conversion: "ammeter", target: 3.0, input: 0.8 });
    else if (v === "voltmeter") kit.setState({ conversion: "voltmeter", target: 40, input: 0.8 });
    else kit.setState({ conversion: "none", input: 1.1 });
    aim(); paint();
    toast(v === "ammeter" ? "Ammeter: the thick copper shunt beside the coil carries about 99 % of the current."
      : v === "voltmeter" ? "Voltmeter: the tall multiplier bobbin in series drops the extra voltage; the coil still sees 15 mA."
      : "Bare coil: full scale at only 15 mA — push 3 A straight in and the fine winding burns out.");
    emit("l4:zoom", { mode: "coil", view: v });
  }

  modeBtns.forEach(function (b) { b.addEventListener("click", function () { setView(b.getAttribute("data-view")); }); });
  var resetBtn = $("#zoom-reset");
  if (resetBtn) resetBtn.addEventListener("click", function () { kit.reset(); setView("ammeter"); });

  var api = {
    setMode: function (m) { if (m === "ammeter" || m === "voltmeter" || m === "bare") setView(m); else setView("ammeter"); },
    view: setView,
    highlight: function (p) { kit.highlight(p || null); },
    rect: function (p) { if (!stage) return null; var o = (p && kit.parts && kit.parts[p]) || kit; return stage.rectOf(o, 14); },
    reading: function () { return kit.reading(); }, kit: kit, stage: stage
  };
  window.StudyScenes = window.StudyScenes || {};
  window.StudyScenes.zoom = api;

  aim(); setView("ammeter");
  setInterval(paint, 500);
})();
