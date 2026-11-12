/* Lesson 05 · 3D Paper 3 bench (window.StudyScenes.bench)
   PendulumKit v3 "practical" mode: split cork, bob r = 2.0 cm, g = 9.79 m s⁻², periodModel "small".
   Every number (recorded l, t₁, t₂, the fault effects) comes from PendulumKit.model via kit.reading().
   Expected (02-lesson.md): 0.400 (25.36, 25.44) · 0.550 (29.82, 29.76) · 0.700 (33.57, 33.63) · 0.850 (37.06, 37.00) · 1.000 (40.13, 40.19);
   count-from-1 at 0.400 → 24.09 / 24.17 → g ≈ 10.85 m s⁻².
   Emits l5:bench (detail = reading()), l5:bench-done, l5:bench-reset. */
(function () {
  "use strict";
  var root = document.getElementById("bench-stage");
  var canvas = document.getElementById("bench-canvas");
  if (!root || !canvas) return;

  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var $ = function (s) { return document.querySelector(s); };
  var toastEl = $("#bench-toast"), toastT;
  function toast(m) {
    if (!toastEl) return;
    toastEl.textContent = m; toastEl.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove("show"); }, 3600);
  }

  var FAULT_TEXT = {
    "none": "No fault: the examiner's way.",
    "count-from-1": "Fault: counts \"one\" as the watch starts, so only 19 swings are timed.",
    "time-from-extreme": "Fault: starts and stops the watch at the end of the swing.",
    "length-to-top": "Fault: measures only to the top of the bob (r left out).",
    "wide-angle": "Fault: releases the bob from 40°, far outside small angles.",
    "conical": "Fault: the bob moves in a circle (conical swing), not one plane."
  };
  var G_CLASS = 9.79;

  // ---------- fallback (kit missing): never throws, numbers come from nowhere ----------
  if (typeof THREE === "undefined" || !window.PendulumKit || !window.SceneKit) {
    root.classList.add("no-webgl");
    var h = $("#bench-hint"); if (h) h.textContent = "The 3D bench needs the pendulum kit. Use the expected results below.";
    window.StudyScenes = window.StudyScenes || {};
    window.StudyScenes.bench = { rect: function () { return null; }, highlight: function () {}, setMode: function () {}, reset: function () {}, demo: function () {} };
    return;
  }

  var narrow = window.innerWidth < 560;
  var state = { l: 0.400, fault: "none", labels: !narrow, timing: false, faultLog: {} };

  var kit = PendulumKit.create({
    mode: "practical", g: G_CLASS, periodModel: "small", r_bob: 0.020, l: state.l, fault: "none",
    labels: state.labels, onEvent: onKitEvent
  });

  var stage = SceneKit.createStage({
    root: root, canvas: canvas, fov: 32,
    target: new THREE.Vector3(0, 0.7, 0), pitch: 0.1, yaw: 0, distance: 4, portraitPitch: 0.05,
    minYaw: -0.8, maxYaw: 0.8, onFrame: function (dt, t) { kit.update(dt, t); }
  });
  if (stage) { stage.rig.add(kit); stage.start(); }

  // ---------- DOM ----------
  var readoutEl = $("#bench-readout"), hintEl = $("#bench-hint"), logEl = $("#fault-log");
  var lenBtns = Array.prototype.slice.call(document.querySelectorAll("#bench-len [data-l]"));
  var faultSel = $("#bench-fault");
  var measureBtn = $("#bench-measure"), releaseBtn = $("#bench-release"), timeBtn = $("#bench-time"), resetBtn = $("#bench-reset");
  var cards = ["m1", "m2", "m3", "m4", "m5"].map(function (id) { return document.getElementById(id); });

  function cardState(done, now) {
    cards.forEach(function (c, i) { if (!c) return; c.classList.toggle("done", i < done); c.classList.toggle("now", i === now); });
  }
  function f2(v) { return v == null ? "–" : (+v).toFixed(2); }
  function f3(v) { return v == null ? "–" : (+v).toFixed(3); }

  function paintReadout() {
    if (!readoutEl) return;
    var r = kit.reading(), w = r.watch || {};
    readoutEl.innerHTML =
      '<div class="' + (r.fault === "length-to-top" ? "is-warn" : "") + '"><span>l / m</span><b>' + f3(r.l) + "</b></div>" +
      "<div><span>t₁ / s</span><b>" + f2(r.t1) + "</b></div>" +
      "<div><span>t₂ / s</span><b>" + f2(r.t2) + "</b></div>" +
      '<div class="' + (state.timing ? "is-live" : "") + '"><span>watch</span><b>' + (w.display || "0.00") + "</b></div>";
    if (timeBtn) timeBtn.textContent = (r.t1 != null && r.t2 == null) ? "Time 20 · t₂" : "Time 20 · t₁";
  }

  function paintLog() {
    if (!logEl) return;
    var keys = Object.keys(state.faultLog);
    var empty = document.getElementById("fault-empty");
    if (empty) empty.hidden = !!keys.length;
    if (!keys.length) { logEl.innerHTML = ""; logEl.hidden = true; return; }
    logEl.hidden = false;
    logEl.innerHTML = keys.map(function (k) {
      var e = state.faultLog[k], pct = 100 * (e.g - G_CLASS) / G_CLASS;
      return '<span class="pd-flt">' + e.label + " · l " + e.l.toFixed(3) + " m → g = " + e.g.toFixed(2) + " m s⁻² (" + (pct >= 0 ? "+" : "−") + Math.abs(pct).toFixed(1) + " %)</span>";
    }).join("");
  }

  function progress() {
    var rows = (kit.reading().rows || []).filter(function (r) { return r.fault === "none"; });
    var n = {}; rows.forEach(function (r) { n[r.l] = 1; });
    return Object.keys(n).length;
  }
  function paintCards() {
    var r = kit.reading(), n = progress();
    if (n >= 5) cardState(5, 4);
    else if (n > 0) cardState(3, 3);
    else if (r.t1 != null) cardState(2, 2);
    else if (r.measured) cardState(1, 1);
    else cardState(0, 0);
  }

  // ---------- kit events ----------
  function onKitEvent(name, d) {
    if (name === "timed") {
      state.timing = false;
      kit.setState({ speed: 1 });
      var r = kit.reading();
      if (r.t1 != null && r.t2 == null) toast("t₁ = " + f2(r.t1) + " s for 20 oscillations. Time it again for t₂.");
      else if (r.t2 != null) {
        if (r.fault !== "none") {
          state.faultLog[r.fault + "@" + r.l_true] = { label: (faultSel && faultSel.selectedOptions[0] ? faultSel.selectedOptions[0].textContent : r.fault), l: r.l, g: r.g_from_T };
          paintLog();
          var box = document.getElementById("fault-trials"); if (box) box.open = true;
          toast("With this fault, one reading gives g = " + r.g_from_T.toFixed(2) + " m s⁻². It is not entered in the table.");
        } else {
          toast("t₂ = " + f2(r.t2) + " s. Row added: now work out t̄, T and T² in the table.");
        }
      }
      paintReadout(); paintCards();
      emit("l5:bench", r);
    } else if (name === "measured") {
      toast(d.fault === "length-to-top"
        ? "Thread to the top of the bob = " + f3(d.l) + " m. The radius was left out!"
        : "Thread " + f3(d.thread) + " m + r " + (d.r_bob * 100).toFixed(1) + " cm → l = " + f3(d.l) + " m");
      paintCards(); emit("l5:bench", kit.reading());
    } else if (name === "done") {
      emit("l5:bench-done", kit.reading());
      toast("Five lengths timed. Finish the table and plot T² against l.");
    } else if (name === "state" || name === "reset") {
      paintReadout();
    }
  }

  // ---------- controls ----------
  function setLength(l) {
    if (state.timing) return;
    state.l = +l;
    lenBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(Math.abs(+b.getAttribute("data-l") - state.l) < 1e-6)); });
    kit.setState({ l: state.l });
    paintReadout(); paintCards();
    emit("l5:bench", kit.reading());
  }
  function setFault(f) {
    if (state.timing || !FAULT_TEXT[f]) return;
    state.fault = f;
    if (faultSel) faultSel.value = f;
    kit.setState({ fault: f });
    if (hintEl) hintEl.textContent = FAULT_TEXT[f];
    paintReadout();
    emit("l5:bench", kit.reading());
  }
  function measure() { if (!state.timing) kit.measure(); }
  function release() { if (!state.timing) kit.release(); }
  function time20() {
    if (state.timing) return;
    state.timing = true;
    kit.setState({ speed: 8 });           // fast-forward ×8; the stopwatch still lands exactly on the model time
    kit.time(20);
    paintReadout();
  }
  function reset() {
    state.timing = false; state.faultLog = {}; state.l = 0.400; state.fault = "none";
    kit.reset(); kit.setState({ mode: "practical", g: G_CLASS, periodModel: "small", r_bob: 0.020, l: 0.400, fault: "none", labels: state.labels, speed: 1 });
    lenBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(+b.getAttribute("data-l") === 0.4)); });
    if (faultSel) faultSel.value = "none";
    if (hintEl) hintEl.textContent = FAULT_TEXT.none;
    paintLog(); paintReadout(); cardState(0, 0);
    emit("l5:bench-reset", {});
  }

  lenBtns.forEach(function (b) { b.addEventListener("click", function () { setLength(b.getAttribute("data-l")); }); });
  if (faultSel) faultSel.addEventListener("change", function () { setFault(faultSel.value); });
  if (measureBtn) measureBtn.addEventListener("click", measure);
  if (releaseBtn) releaseBtn.addEventListener("click", release);
  if (timeBtn) timeBtn.addEventListener("click", time20);
  if (resetBtn) resetBtn.addEventListener("click", function () { reset(); toast("Bench reset."); });

  // tapping the 3D bench names the part
  if (stage) {
    var down = null, ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
    var NAMES = { cork: "split cork", clamp: "clamp and boss", thread: "thread", bob: "brass bob", "bob-centre": "centre of the bob", ruler: "metre rule", "set-square": "set-square", marker: "rest mark", stopwatch: "stopwatch", protractor: "protractor" };
    canvas.addEventListener("pointerdown", function (e) { down = { x: e.clientX, y: e.clientY }; });
    canvas.addEventListener("pointerup", function (e) {
      if (!down || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 6) { down = null; return; }
      down = null;
      var rct = canvas.getBoundingClientRect();
      ndc.set(((e.clientX - rct.left) / rct.width) * 2 - 1, -((e.clientY - rct.top) / rct.height) * 2 + 1);
      ray.setFromCamera(ndc, stage.camera);
      var id = kit.pickPart(ray);
      if (id) { toast(NAMES[id] || id); kit.highlight(id); setTimeout(function () { kit.highlight(null); }, 1600); }
    });
  }

  // ---------- scene API for the narrator and tests ----------
  var api = {
    setMode: function (m) { if (FAULT_TEXT[m]) setFault(m); },
    setLength: setLength, setFault: setFault, measure: measure, release: release, time: time20, reset: reset,
    demo: function () { setFault("none"); setLength(0.400); measure(); setTimeout(release, 2800); },
    highlight: function (p) { kit.highlight(p || null); },
    rect: function (p) {
      if (!stage) return null;
      var o = (p && kit.parts && kit.parts[p]) || kit;
      return stage.rectOf(o, 12);
    },
    reading: function () { return kit.reading(); },
    progress: progress,
    kit: kit, stage: stage, state: state
  };
  window.StudyScenes = window.StudyScenes || {};
  window.StudyScenes.bench = api;

  if (hintEl) hintEl.textContent = FAULT_TEXT.none;
  cardState(0, 0); paintReadout(); paintLog();
  setInterval(paintReadout, 200);
})();
