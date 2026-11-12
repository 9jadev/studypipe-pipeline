/* Lesson 02 · Live graphs from the spring bench (StudyGraph, two tabs)
   F (y) against x (x), fit through the origin → slope = k (24.5 N m⁻¹)
   T² (y) against m (x), fit through the origin → slope = 4π²/k (1.61 s² kg⁻¹) → k = 4π² ÷ slope. */
(function () {
  "use strict";
  var el = document.getElementById("graph-l2");
  if (!el || !window.StudyGraph) return;

  var tab = "fx", rows = [], cur = null;
  var FOUR_PI2 = 4 * Math.PI * Math.PI;

  var opts = {
    fx: {
      theme: "paper",
      x: { label: "Extension x", unit: "m", min: 0, max: 0.12, step: 0.02 },
      y: { label: "Force F", unit: "N", min: 0, max: 3.0, step: 0.5 },
      aria: "Graph of stretching force F against extension x for the spiral spring"
    },
    t2m: {
      theme: "paper",
      x: { label: "Mass m", unit: "kg", min: 0, max: 0.30, step: 0.05 },
      y: { label: "T²", unit: "s²", min: 0, max: 0.50, step: 0.1 },
      aria: "Graph of period squared T² against mass m for the spiral spring"
    }
  };
  var g = null;
  function make() { el.innerHTML = ""; g = StudyGraph.create(el, opts[tab]); }

  function pts() {
    if (tab === "fx") return rows.map(function (r) { return [+r.x.toFixed(4), +r.F.toFixed(3)]; });
    return rows.filter(function (r) { return r.T2 != null; }).map(function (r) { return [r.m, r.T2]; });
  }

  function paint() {
    var p = pts(), s = { id: tab, name: tab === "fx" ? "Spring, F against x" : "Spring, T² against m", tone: tab === "fx" ? "crimson" : "teal", points: p };
    if (p.length >= 2) {
      s.fit = "origin"; s.extend = true;
      s.slope = tab === "fx" ? { dy: "ΔF", dx: "Δx", name: "k", unit: "N m⁻¹", dec: 1 } : { dy: "ΔT²", dx: "Δm", name: "slope", unit: "s² kg⁻¹", dec: 2 };
    }
    var marker = null;
    if (cur && tab === "fx") marker = { x: cur.x, y: cur.F, label: "m = " + cur.m.toFixed(3) + " kg", tone: "amber", labelPos: "below" };
    if (cur && tab === "t2m" && cur.T2 != null) marker = { x: cur.m, y: cur.T2, label: "T² = " + cur.T2, tone: "amber", labelPos: "below" };
    g.set({ series: [s], marker: marker });

    var badge = document.getElementById("graph-l2-badge");
    if (badge) { badge.textContent = p.length + (p.length === 1 ? " point" : " points"); badge.classList.toggle("wait", !p.length); }
    var title = document.getElementById("graph-l2-title");
    if (title) title.textContent = tab === "fx" ? "Force F against extension x" : "T² against mass m";

    var fit = p.length >= 2 ? StudyGraph.leastSquares(p, true) : null;
    var stats = document.getElementById("graph-l2-stats"), note = document.getElementById("graph-l2-note");
    if (stats) {
      var h = "";
      if (fit && tab === "fx") h = '<div class="gc-stat"><span>slope = k</span><b>' + fit.m.toFixed(1) + " N m⁻¹</b></div>";
      if (fit && tab === "t2m") h = '<div class="gc-stat"><span>slope</span><b>' + fit.m.toFixed(2) + ' s² kg⁻¹</b></div><div class="gc-stat"><span>k = 4π² ÷ slope</span><b>' + (FOUR_PI2 / fit.m).toFixed(1) + " N m⁻¹</b></div>";
      stats.innerHTML = h;
    }
    if (note) {
      var msg;
      if (tab === "fx") {
        if (!p.length) msg = "Add slotted masses on the bench. Each load lands here as a dot (x, F = mg).";
        else if (p.length < 2) msg = "One point. Add another 50 g: equal steps of load should give equal steps of stretch.";
        else msg = "A <b>straight line through the origin</b>: F ∝ x, which is Hooke's law. Its slope is the spring constant, <b>k ≈ " + fit.m.toFixed(1) + " N m⁻¹</b>.";
      } else {
        if (!p.length) msg = "Switch to <b>Time it</b> and time 20 oscillations for each load. Each T² lands here against m.";
        else if (p.length < 2) msg = "One point. Time another load to draw the line.";
        else msg = "A <b>straight line through the origin</b>: T² = (4π²/k) m. Slope ≈ <b>" + fit.m.toFixed(2) + " s² kg⁻¹</b>, so k = 4π² ÷ slope ≈ <b>" + (FOUR_PI2 / fit.m).toFixed(1) + " N m⁻¹</b>, the same k as the F–x graph.";
      }
      note.innerHTML = msg;
    }
  }

  function setTab(t) {
    tab = t;
    Array.prototype.forEach.call(document.querySelectorAll("#graph-l2-tabs [data-tab]"), function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-tab") === t)); });
    make(); paint();
  }
  Array.prototype.forEach.call(document.querySelectorAll("#graph-l2-tabs [data-tab]"), function (b) {
    b.addEventListener("click", function () { setTab(b.getAttribute("data-tab")); });
  });

  document.addEventListener("l2:bench", function (e) {
    var d = e.detail || {};
    if (!d.rows) return;
    rows = d.rows;
    cur = null;
    if (d.rig === "lab" && d.m != null) rows.forEach(function (r) { if (Math.abs(r.m - d.m) < 1e-6) cur = r; });
    if (d.rig === "lab" && d.mode === "period" && cur && cur.T2 != null && tab !== "t2m") { setTab("t2m"); return; }
    paint();
  });
  document.addEventListener("l2:bench-reset", function () { rows = []; cur = null; setTab("fx"); });

  window.L02 = window.L02 || {};
  window.L02.graphTab = setTab;
  make(); paint();
})();
