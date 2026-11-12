/* Lesson 03 · 2D wheel-and-shadow bench (window.StudyScenes.bench) — rule 5b: a planar projection, so Paper.js.
   ShmKinematics2D v2 "wheel" scene: a side-view tyre with a mud lump, its radius and angle ωt, and the ground
   shadow with live v (teal) and a (amber, always towards O) arrows; optional x/v/a traces.
   Every number comes from the kit's reading() (ShmKinematics2D.model), never typed in.
   Emits l3:bench (detail = reading) for each recorded angle and l3:bench-done once 0°, 30°, 60° and 90° are in. */
(function () {
  "use strict";
  var root = document.getElementById("bench-stage");
  var canvas = document.getElementById("bench-canvas");
  var D = window.L03;
  if (!root || !canvas || !D) return;

  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var toastEl = $("#bench-toast"), toastT;
  function toast(m) {
    if (!toastEl) return;
    toastEl.textContent = m; toastEl.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove("show"); }, 3200);
  }

  var state = { A: D.lab.A, T: D.lab.T, graphs: false, rec: {}, done: false };

  // ---- kit (Paper.js) — fallback model only if the kit cannot start ----
  var kit = null;
  if (window.paper && window.ShmKinematics2D) {
    try {
      kit = ShmKinematics2D.create({ canvas: canvas, scene: "wheel", A: state.A, T: state.T, autoplay: false, labels: true, surface: "ink", onChange: onKit });
    } catch (e) { kit = null; if (window.console) console.warn("ShmKinematics2D failed:", e); }
  }
  if (!kit) {
    /* FALLBACK (no Paper.js kit): same physics, no drawing — the controls, table and readout still work */
    var fbAngle = 0;
    var fbSf = function (v) { if (Math.abs(v) < 1e-9) return "0"; return String(Number(v.toPrecision(3)) === 0 ? 0 : v.toPrecision(3)).replace(/-/g, "−"); };
    kit = {
      fallback: true,
      reading: function () {
        var w = 2 * Math.PI / state.T, th = fbAngle * Math.PI / 180, x = state.A * Math.sin(th), v = w * state.A * Math.cos(th), a = -w * w * x;
        return { A: state.A, T: state.T, w: w, angle_deg: fbAngle, x: x, v: v, a: a, v_max: w * state.A, a_max: w * w * state.A, a_over_x: x ? a / x : null,
          display: { angle: Math.round(fbAngle) + "°", x: fbSf(x), v: fbSf(v), a: fbSf(a) } };
      },
      setState: function (p) { if (p.angle_deg != null) fbAngle = p.angle_deg; onKit(kit.reading()); },
      step: function (d) { fbAngle = ((Math.round((fbAngle + d) / d) * d) % 360 + 360) % 360; onKit(kit.reading()); },
      play: function () {}, pause: function () {}, isPlaying: function () { return false; },
      reset: function () { fbAngle = 0; onKit(kit.reading()); },
      highlight: function () {}, rect: function () { var b = canvas.getBoundingClientRect(); return { left: b.left, top: b.top, width: b.width, height: b.height }; }
    };
    var fb = root.querySelector(".stage-fallback"); if (fb) fb.style.display = "flex";
  }

  // ---- DOM ----
  var readoutEl = $("#bench-readout"), hintEl = $("#bench-hint");
  var tbody = $("#results-table tbody"), lineEl = $("#route-line");
  var playBtn = $("#bench-play"), stepBtn = $("#bench-step"), recBtn = $("#bench-record"), resetBtn = $("#bench-reset");
  var graphsBtn = $("#bench-graphs");
  var aIn = $("#bench-A"), tIn = $("#bench-T"), aOut = $("#bench-A-val"), tOut = $("#bench-T-val");
  var cards = ["m1", "m2", "m3", "m4"].map(function (id) { return document.getElementById(id); });

  function cardState(done, now) {
    cards.forEach(function (c, i) { if (!c) return; c.classList.toggle("done", i < done); c.classList.toggle("now", i === now); });
  }
  function angleOf(r) { return Math.round(r.angle_deg) % 360; }

  var lastPaint = 0;
  function paintReadout(r) {
    if (!readoutEl) return;
    r = r || kit.reading();
    var d = r.display || {};
    readoutEl.innerHTML =
      '<div><span>ωt</span><b>' + d.angle + "</b></div>" +
      '<div><span>x / m</span><b>' + d.x + "</b></div>" +
      '<div><span>v / m s⁻¹</span><b>' + d.v + "</b></div>" +
      '<div class="hot"><span>a / m s⁻²</span><b>' + d.a + "</b></div>";
  }
  function onKit(r) {
    var now = Date.now();
    if (now - lastPaint < 60 && kit && kit.isPlaying && kit.isPlaying()) return;
    lastPaint = now; paintReadout(r);
  }
  // keep the readout live while the wheel spins (onChange only fires on input)
  setInterval(function () { if (kit && kit.isPlaying && kit.isPlaying() && !document.hidden) paintReadout(); }, 150);

  function count() { return D.targets.filter(function (a) { return state.rec[a]; }).length; }
  function paintLine() {
    if (lineEl) lineEl.innerHTML = "Angles recorded: <b>" + count() + " of 4</b> (0°, 30°, 60°, 90°) · A = <b>" + state.A.toFixed(2) + " m</b>, T = <b>" + state.T.toFixed(1) + " s</b>";
  }
  function fillRow(r) {
    if (!tbody) return;
    var ang = angleOf(r), tr = tbody.querySelector('tr[data-k="' + ang + '"]');
    if (!tr) {
      tr = document.createElement("tr"); tr.setAttribute("data-k", ang);
      tr.innerHTML = '<td data-c="ang"></td><td data-c="x"></td><td data-c="v"></td><td data-c="a"></td><td data-c="ax"></td>';
      var rows = Array.prototype.slice.call(tbody.children), before = null;
      rows.some(function (x) { if (+x.getAttribute("data-k") > ang) { before = x; return true; } return false; });
      tbody.insertBefore(tr, before);
    }
    var sf = (window.ShmKinematics2D && ShmKinematics2D.format) ? ShmKinematics2D.format.sf : function (v, n) { return v.toPrecision(n); };
    tr.querySelector('[data-c="ang"]').textContent = ang + "°";
    tr.querySelector('[data-c="x"]').textContent = r.display.x;
    tr.querySelector('[data-c="v"]').textContent = r.display.v;
    tr.querySelector('[data-c="a"]').textContent = r.display.a;
    tr.querySelector('[data-c="ax"]').textContent = r.a_over_x != null ? sf(r.a_over_x, 3) : "—";
    Array.prototype.forEach.call(tbody.children, function (x) { x.classList.toggle("fresh", x === tr); });
  }

  function record(quiet) {
    var r = kit.reading(), ang = angleOf(r);
    if (Math.abs(r.angle_deg - Math.round(r.angle_deg)) > 0.6) {
      if (!quiet) toast("Pause on a marked angle first: press Step 30°.");
      return null;
    }
    state.rec[ang] = true;
    fillRow(r); paintReadout(r); paintLine();
    var n = count();
    cardState(n >= 4 ? 3 : 2, n >= 4 ? 3 : 1);
    if (!quiet) toast("ωt = " + ang + "°: x = " + r.display.x + " m, v = " + r.display.v + " m/s, a = " + r.display.a + " m/s²");
    emit("l3:bench", r);
    if (n >= 4 && !state.done) {
      state.done = true; cardState(3, 3);
      toast("Four angles in. Fastest at 0°, greatest |a| at 90°. Now switch on the graphs.");
      if (hintEl) hintEl.textContent = "All four angles in · switch the graphs on";
      emit("l3:bench-done", { angles: D.targets.slice(), A: state.A, T: state.T });
    }
    return r;
  }

  function setPlaying(on) {
    if (on) kit.play(); else kit.pause();
    if (playBtn) { playBtn.textContent = on ? "❚❚ Pause" : "▶ Spin"; playBtn.setAttribute("aria-pressed", String(on)); }
    if (on) cardState(Math.min(1, count() ? 2 : 0), count() ? 1 : 0);
  }
  function step() {
    kit.step(30); setPlaying(false);
    var r = kit.reading(), ang = angleOf(r);
    if (D.targets.indexOf(ang) >= 0) record(false);
    else { paintReadout(r); toast("ωt = " + ang + "°. Keep stepping, or press Record."); }
  }
  function setGraphs(on) {
    state.graphs = !!on;
    if (kit.setState && !kit.fallback) kit.setState({ graphs: state.graphs });
    if (graphsBtn) { graphsBtn.setAttribute("aria-pressed", String(state.graphs)); graphsBtn.textContent = state.graphs ? "Graphs: on" : "Graphs: off"; }
    if (state.graphs) { cards.forEach(function (c, i) { if (c) c.classList.toggle("done", i < 3 || (i === 3 && state.done)); }); }
    emit("l3:graphs", { on: state.graphs });
  }
  function setAT(A, T, quiet) {
    state.A = A; state.T = T;
    if (aOut) aOut.textContent = A.toFixed(2) + " m";
    if (tOut) tOut.textContent = T.toFixed(1) + " s";
    if (aIn) aIn.value = A; if (tIn) tIn.value = T;
    if (!kit.fallback) kit.setState({ A: A, T: T, Amax: 0.40 });
    paintReadout(); paintLine();
    if (!quiet) cardState(count() ? 2 : 0, count() ? 1 : 0);
  }
  function reset() {
    state.rec = {}; state.done = false;
    if (tbody) tbody.innerHTML = "";
    setAT(D.lab.A, D.lab.T, true);
    kit.reset(); setPlaying(false);
    if (!kit.fallback) kit.setState({ angle_deg: 0, playing: false });
    setGraphs(false);
    paintReadout(); paintLine(); cardState(0, 0);
    if (hintEl) hintEl.textContent = "Step 30° records 0°–90° · drag the lump to turn";
    emit("l3:bench-reset", {});
  }

  if (playBtn) playBtn.addEventListener("click", function () { setPlaying(!kit.isPlaying()); });
  if (stepBtn) stepBtn.addEventListener("click", step);
  if (recBtn) recBtn.addEventListener("click", function () { record(false); });
  if (resetBtn) resetBtn.addEventListener("click", function () { reset(); toast("Bench reset: A = 0.30 m, T = 2.0 s, ωt = 0°."); });
  if (graphsBtn) graphsBtn.addEventListener("click", function () { setGraphs(!state.graphs); });
  if (aIn) aIn.addEventListener("input", function () { setAT(+aIn.value, state.T); });
  if (tIn) tIn.addEventListener("input", function () { setAT(state.A, +tIn.value); });

  // ---- scene API for the narrator ----
  var api = {
    setMode: function (m) { if (m === "graphs") setGraphs(true); else if (m === "wheel") setGraphs(false); },
    setAngle: function (deg) { setPlaying(false); kit.setState({ angle_deg: deg, playing: false }); paintReadout(); },
    record: record,
    step: step,
    spin: function (on) { setPlaying(on !== false); },
    graphs: setGraphs,
    setAT: setAT,
    reset: reset,
    highlight: function (p) { if (kit && kit.highlight) kit.highlight(p || null); },
    rect: function (p) { return kit && kit.rect ? kit.rect(p) : null; },
    reading: function () { return kit.reading(); },
    kit: kit, state: state
  };
  window.StudyScenes = window.StudyScenes || {};
  window.StudyScenes.bench = api;

  reset();
  setPlaying(true);
})();
