/* Lesson 05 · graphs.
   1. Live graph: capillary blood pressure Pc (y) against position along the capillary (x). Each recorded probe point lands as a dot.
      In the lesson's teaching model Pc falls evenly, so the five points lie on a straight line; the protein pull (pi c) is a flat guide at 25 mmHg
      and NFP = 0 is marked where the line meets it (55% of the way along).
   2. Make Sense: mean blood pressure along the circuit (aorta to venae cavae) as a smooth curve of approximate teaching values. */
(function () {
  "use strict";
  if (!window.StudyGraph) return;
  var D = window.L05;

  // ---------- 1. Pc against position ----------
  var el = document.getElementById("pc-graph");
  var rec = {}, last = null;
  var g1 = null;
  if (el) g1 = StudyGraph.create(el, {
    theme: "paper",
    x: { label: "Position along the capillary (0 = arterial end, 1 = venous end)", unit: "", min: 0, max: 1, step: 0.5 },
    y: { label: "Capillary pressure Pc", unit: "mmHg", min: 0, max: 40, step: 10 },
    aria: "Graph of capillary blood pressure against position along the capillary, falling in a straight line from 36 to 16 millimetres of mercury, with the protein pull flat at 25"
  });

  function pts() {
    return Object.keys(rec).map(function (k) { return rec[k]; }).sort(function (a, b) { return a[0] - b[0]; });
  }
  function paint1() {
    if (!g1) return;
    var p = pts();
    var series = [{ id: "pc", name: "Pc (blood pressure)", tone: "crimson", points: p, fit: p.length >= 2 ? "line" : null, extend: false }];
    var showZero = !!rec[0.5] && !!rec[0.75];
    if (showZero) series.push({ id: "zero", name: "NFP = 0", tone: "amber", points: [[D.zero("normal"), D.PI]] });
    g1.set({
      series: series,
      guides: [{ axis: "y", value: D.PI, label: "πc = 25 mmHg", tone: "teal" }],
      marker: last ? { x: last[0], y: last[1], label: "Pc = " + last[1], tone: "amber" } : null
    });

    var badge = document.getElementById("pc-badge");
    if (badge) { badge.textContent = p.length + (p.length === 1 ? " point" : " points"); badge.classList.toggle("wait", !p.length); }

    var stats = document.getElementById("pc-stats");
    if (stats) {
      var h = "";
      if (rec[0]) h += '<div class="gc-stat"><span>Arterial end</span><b>Pc ' + rec[0][1] + ' → NFP ' + D.sgn(rec[0][1] - D.PI) + ' mmHg</b></div>';
      if (rec[1]) h += '<div class="gc-stat"><span>Venous end</span><b>Pc ' + rec[1][1] + ' → NFP ' + D.sgn(rec[1][1] - D.PI) + ' mmHg</b></div>';
      if (showZero) h += '<div class="gc-stat"><span>NFP = 0 at</span><b>' + D.zero("normal").toFixed(2) + ' of the way along</b></div>';
      stats.innerHTML = h;
    }

    var note = document.getElementById("pc-note");
    if (note) {
      var msg;
      if (!p.length) msg = "Slide the probe on Station 2 and record Pc. Each reading lands here as a dot: position along the bottom, pressure up the side. The flat line is the pull of the plasma proteins, πc.";
      else if (p.length < 3) msg = "Keep recording. Three or more points show the pattern clearly.";
      else if (!showZero) msg = "The dots fall along a <b>straight line</b> in this teaching model. Record 0.50 and 0.75 to see where the blood pressure drops below the protein pull.";
      else msg = "Pc falls <b>evenly</b>, so the points lie on a straight line (a teaching model). Above the flat πc line, NFP is positive and fluid is pushed <b>out</b>; below it, NFP is negative and fluid is drawn <b>in</b>. The two cross at <b>0.55</b> of the way along.";
      note.innerHTML = msg;
    }
  }
  document.addEventListener("l5:bench", function (e) {
    var d = e.detail || {};
    if (d.station !== 2 || d.pos == null) return;
    rec[d.pos] = [+d.pos, +d.pc];
    last = [+d.pos, +d.pc];
    paint1();
  });
  document.addEventListener("l5:bench-reset", function (e) {
    var d = e.detail || {};
    if (d.station === 1) return;
    rec = {}; last = null; paint1();
  });
  paint1();

  // ---------- 2. Pressure along the circuit: smooth curve ----------
  var el2 = document.getElementById("circuit-graph");
  if (el2) {
    var c = D.circuit.map(function (r) { return [r.x, r.p]; });
    // Fritsch-Carlson monotone cubic interpolation: smooth, passes through every point, never overshoots
    var monotone = function (p) {
      var n = p.length, d = [], m = [], i;
      for (i = 0; i < n - 1; i++) d.push((p[i + 1][1] - p[i][1]) / (p[i + 1][0] - p[i][0]));
      m[0] = d[0]; m[n - 1] = d[n - 2];
      for (i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
      for (i = 0; i < n - 1; i++) {
        if (d[i] === 0) { m[i] = 0; m[i + 1] = 0; continue; }
        var a = m[i] / d[i], b = m[i + 1] / d[i], s = a * a + b * b;
        if (s > 9) { var t = 3 / Math.sqrt(s); m[i] = t * a * d[i]; m[i + 1] = t * b * d[i]; }
      }
      return function (x) {
        if (x <= p[0][0]) return p[0][1];
        if (x >= p[n - 1][0]) return p[n - 1][1];
        var k = 0;
        while (k < n - 2 && x > p[k + 1][0]) k++;
        var h = p[k + 1][0] - p[k][0], u = (x - p[k][0]) / h;
        var h00 = 2 * u * u * u - 3 * u * u + 1, h10 = u * u * u - 2 * u * u + u, h01 = -2 * u * u * u + 3 * u * u, h11 = u * u * u - u * u;
        return h00 * p[k][1] + h10 * h * m[k] + h01 * p[k + 1][1] + h11 * h * m[k + 1];
      };
    };
    var g2 = StudyGraph.create(el2, {
      theme: "paper",
      x: { label: "Stage of the circuit (0 aorta → 7 venae cavae)", unit: "", min: 0, max: 7, step: 1 },
      y: { label: "Mean pressure", unit: "mmHg", min: 0, max: 110, step: 20 },
      aria: "Graph of mean blood pressure along the circuit, falling smoothly from about 100 millimetres of mercury in the aorta to about 2 in the venae cavae, with the largest fall in the arterioles"
    });
    g2.set({
      series: [{ id: "circ", name: "Mean pressure (approximate)", tone: "crimson", points: c, fn: monotone(c), fnRange: [0, 7] }],
      guides: [{ axis: "y", value: 25, label: "πc = 25 mmHg", tone: "teal" }]
    });
    var note2 = document.getElementById("circuit-note");
    if (note2) note2.innerHTML = "Stages: " + D.circuit.map(function (r) { return "<b>" + r.x + "</b> " + r.name + " (about " + r.p + ")"; }).join(" · ") + ". The curve falls fastest across the arterioles. At the capillary the pressure moves from about 35 to about 15 mmHg, crossing the 25 mmHg protein pull. These are approximate teaching values.";
  }
})();
