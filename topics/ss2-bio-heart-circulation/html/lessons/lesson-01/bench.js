/* Lesson 01 · 3D agar-cube acid bench (AgarCubeKit v2, mode "acid"): four cubes, one beaker, 8 minutes.
   Emits l1:bench on every kit `measure` event (detail = kit.reading()) and l1:bench-done on `measure-done`. */
(function () {
  "use strict";
  var root = document.getElementById("bench-stage");
  var canvas = document.getElementById("bench-canvas");
  var D = window.L01;
  if (!root || !canvas || !D) return;

  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var toastEl = document.getElementById("bench-toast"), toastT;
  function toast(m) {
    if (!toastEl) return;
    toastEl.textContent = m; toastEl.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove("show"); }, 3400);
  }
  var readoutEl = document.getElementById("bench-readout");
  var clockEl = document.getElementById("bench-clock");
  var hintEl = document.getElementById("bench-hint");
  var btnDrop = document.getElementById("bench-drop"), btnSkip = document.getElementById("bench-skip");
  var btnMeasure = document.getElementById("bench-measure"), btnReset = document.getElementById("bench-reset");

  var state = { L: 30, phase: "idle", measured: {}, tech: "ok", reading: null };
  var highlightPart = null;

  var api = {
    drop: drop, skip: skip, select: select, measure: measure, reset: reset, tech: setTech,
    setMode: function () {},
    rect: function () { return null; },
    highlight: function (p) { highlightPart = p || null; },
    state: function () { return { phase: state.phase, L: state.L, measured: Object.keys(state.measured).length, tech: state.tech }; }
  };
  window.StudyScenes = window.StudyScenes || {};
  window.StudyScenes.bench = api;

  var stage = window.SceneKit && window.SceneKit.createStage({
    root: root, canvas: canvas, fov: 34, target: new THREE.Vector3(0.3, 0.6, 0.3), pitch: 0.5, yaw: 0.32,
    distance: 11.5, minYaw: -0.9, maxYaw: 0.9, onFrame: frame
  });

  var kit = null, hl = null, glow = null, fallback = false;

  if (stage && window.AgarCubeKit && window.AgarCubeKit.version >= 2) build();
  else fallback = true;
  buildControls();
  paintAll();

  function build() {
    kit = window.AgarCubeKit.create({
      mode: "acid", sides: D.SIDES, acidDepth_mm: D.ACID_DEPTH, t_min: 0, cutaway: true, labels: root.clientWidth >= 560,
      errors: { lateLift: false, flatOnFloor: false, oversizedCube: false }
    });
    kit.select(state.L);
    stage.rig.add(kit);
    hl = window.AgarCubeKit.makeHighlighter(stage.scene);

    kit.addEventListener("acid-start", function () { state.phase = "running"; paintAll(); });
    kit.addEventListener("acid-done", function () { finishWait(); });
    kit.addEventListener("measure", function (e) {
      var r = e.reading, n = (e.measured || []).length;
      state.measured[r.L_mm] = true;
      state.reading = r;
      var detail = {};
      for (var k in r) detail[k] = r[k];
      detail.count = n; detail.L = r.L_mm; detail.tech = state.tech;
      emit("l1:bench", detail);
    });
    kit.addEventListener("measure-done", function () { emit("l1:bench-done", { count: D.SIDES.length, tech: state.tech }); });

    glow = SceneKit.glowSprite("rgba(255,178,63,0.92)", 1.6);
    glow.material.opacity = 0; glow.userData.noFit = true; stage.rig.add(glow);

    api.rect = function (part) {
      var obj = null;
      if (kit.parts) obj = part === "cube" ? kit.parts.cubes[String(state.L)] : kit.parts[part];
      return stage.rectOf(obj || kit, 12);
    };
    stage.start();
  }

  function finishWait() {
    state.phase = "done";
    paintAll();
    toast("8 minutes are up. Pick a cube and tap Cut and measure.");
  }

  // ---------- actions ----------
  function drop() {
    if (!kit || state.phase === "running") { if (!kit) fallbackNote(); return; }
    resetMeasures(false);
    kit.setState({ t_min: 8, errors: techErrors(false) });
    kit.play();
    state.phase = "running";
    toast("All four cubes went into the acid at the same moment. The clock is running.");
    paintAll();
  }
  function skip() {
    if (!kit) { fallbackNote(); return; }
    if (state.phase === "running" || state.phase === "idle") {
      kit.setState({ t_min: 8, errors: techErrors(false) });
      finishWait();
    }
  }
  function select(L) {
    L = +L;
    if (D.SIDES.indexOf(L) < 0) return;
    state.L = L;
    if (kit) kit.select(L);
    state.reading = kit && state.measured[L] ? kit.reading(L) : null;
    paintAll();
  }
  function measure(L) {
    if (L != null) select(L);
    if (!kit) { fallbackNote(); return; }
    if (state.phase !== "done") { toast("Drop the cubes in the acid and wait the 8 minutes first."); return; }
    var r = kit.measure(state.L);
    toast("Cut open the " + state.L + " mm cube: the acid went in " + r.acidDepth_mm.toFixed(1) + " mm, and " + D.fmtPct(r.pctColourless) + " % of its volume is colourless.");
    paintAll();
  }
  function techErrors(on) {
    return { lateLift: on && state.tech === "late", flatOnFloor: on && state.tech === "flat", oversizedCube: false };
  }
  function setTech(t) {
    if (t !== "ok" && t !== "late" && t !== "flat") return;
    state.tech = t;
    if (kit && state.phase === "done") {
      // a fresh run with that technique: the cubes finish straight away, measurements start again
      resetMeasures(true);
      kit.setState({ errors: techErrors(true) });
      emit("l1:bench-reset", { tech: t });
      toast(t === "ok" ? "Careful technique: lifted at 8 minutes, cubes surrounded by acid."
        : t === "late" ? "Lifted 4 minutes late: the acid went deeper, so % colourless reads too high. Measure the cubes again."
        : "Cube lying flat: its floor face was shielded from acid, so % colourless reads too low. Measure the cubes again.");
    }
    paintAll();
  }
  function resetMeasures(keepDone) {
    if (kit) kit.reset();
    state.measured = {}; state.reading = null;
    if (!keepDone) state.phase = "idle";
  }
  function reset() {
    state.tech = "ok"; state.L = 30;
    if (kit) { resetMeasures(false); kit.setState({ errors: techErrors(false), t_min: 0 }); kit.select(30); }
    state.phase = "idle"; state.measured = {}; state.reading = null;
    emit("l1:bench-reset", {});
    toast("Bench reset. Drop the four cubes in the acid to begin.");
    paintAll();
  }
  function fallbackNote() { toast("The 3D bench is not available on this device. Use the expected results below the table."); }

  // ---------- controls ----------
  function buildControls() {
    root.querySelectorAll("#cube-pick [data-L]").forEach(function (b) {
      b.addEventListener("click", function () { select(b.getAttribute("data-L")); });
    });
    root.querySelectorAll("#bench-tech [data-tech]").forEach(function (b) {
      b.addEventListener("click", function () { setTech(b.getAttribute("data-tech")); });
    });
    btnDrop.addEventListener("click", drop);
    btnSkip.addEventListener("click", skip);
    btnMeasure.addEventListener("click", function () { measure(); });
    btnReset.addEventListener("click", reset);
  }

  // ---------- painting ----------
  function paintAll() { paintReadout(); paintButtons(); paintClock(); }

  function paintReadout() {
    if (!readoutEl) return;
    var m = D.model(state.L);
    var r = state.reading, done = !!state.measured[state.L] && r;
    var moved = done ? r.acidDepth_mm * Math.sqrt(r.t_min / 8) : null;
    readoutEl.innerHTML =
      '<div><span>L /mm</span><b>' + state.L + '</b></div>' +
      '<div><span>SA:V /mm⁻¹</span><b>' + (done ? D.fmtRatio(r.ratio) : D.fmtRatio(m.ratio)) + '</b></div>' +
      '<div><span>Moved /mm</span><b>' + (done ? moved.toFixed(1) : "?") + '</b></div>' +
      '<div><span>Pink /mm³</span><b>' + (done ? D.fmtInt(r.pinkVolume) : "?") + '</b></div>' +
      '<div class="' + (done && r.pctColourless < 99.9 ? "hot" : "") + '"><span>% clear</span><b>' + (done ? D.fmtPct(r.pctColourless) : "?") + '</b></div>';
  }
  function paintButtons() {
    root.querySelectorAll("#cube-pick [data-L]").forEach(function (b) {
      var L = +b.getAttribute("data-L");
      b.setAttribute("aria-pressed", L === state.L ? "true" : "false");
      b.classList.toggle("seen", !!state.measured[L]);
    });
    root.querySelectorAll("#bench-tech [data-tech]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-tech") === state.tech ? "true" : "false");
      b.disabled = state.phase !== "done";
    });
    btnDrop.disabled = state.phase === "running";
    btnSkip.disabled = state.phase === "done";
    btnMeasure.disabled = state.phase !== "done" || !!state.measured[state.L];
    btnMeasure.textContent = state.measured[state.L] ? "Measured ✓" : "2 · Cut & measure";
  }
  function paintClock() {
    var n = Object.keys(state.measured).length;
    var t = kit ? kit.getState().t_now : 0;
    if (clockEl) clockEl.innerHTML = "Clock <b>" + t.toFixed(1) + "</b> min · cubes measured <b>" + n + "</b> of " + D.SIDES.length;
    if (hintEl) hintEl.textContent = state.phase === "idle" ? "Drop the cubes in the acid to begin"
      : state.phase === "running" ? "Waiting for the 8 minutes…"
      : n < D.SIDES.length ? "Pick a cube, then cut and measure it" : "All four measured: fill in the table";
  }

  // ---------- frame ----------
  var lastHl = null, tmpBox, tmpV, clockT = 0;
  function frame(dt, t) {
    if (!kit) return;
    kit.update(dt, t);
    if (state.phase === "running") { clockT += dt; if (clockT > 0.12) { clockT = 0; paintClock(); } }
    if (hl) {
      var want = highlightPart && kit.parts && kit.parts[highlightPart] ? highlightPart : null;
      if (want !== lastHl) { hl.highlight(want); lastHl = want; }
    }
    if (glow) {
      var target = highlightPart && kit.parts && kit.parts[highlightPart] ? (highlightPart === "cube" ? kit.parts.cubes[String(state.L)] : kit.parts[highlightPart]) : null;
      if (target) {
        tmpBox = tmpBox || new THREE.Box3(); tmpV = tmpV || new THREE.Vector3();
        tmpBox.setFromObject(target);
        tmpBox.getCenter(glow.position);
        stage.rig.worldToLocal(glow.position);
        glow.scale.setScalar(Math.max(1.8, tmpBox.getSize(tmpV).length() * 0.9));
      }
      glow.material.opacity += ((target ? 0.4 + 0.2 * Math.sin(t * 5) : 0) - glow.material.opacity) * Math.min(1, dt * 8);
    }
  }
})();
