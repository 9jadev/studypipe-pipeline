/* Lesson 01 · live graph: % of volume colourless (y) against SA : V (x).
   Every bench measurement lands as a dot; with three or more dots a smooth curve of best fit is drawn
   (monotone cubic through the points, never a straight regression line, because the data level off). */
(function () {
  "use strict";
  var el = document.getElementById("sav-graph");
  if (!el || !window.StudyGraph) return;

  var rec = {};      // L -> [ratio, pct]
  var last = null;

  var g = StudyGraph.create(el, {
    theme: "paper",
    x: { label: "SA : V", unit: "mm⁻¹", min: 0, max: 1.4, step: 0.2 },
    y: { label: "% colourless", unit: "%", min: 0, max: 110, step: 20 },
    aria: "Graph of the percentage of cube volume that turned colourless against SA : V for the agar cubes"
  });

  function pts() {
    return Object.keys(rec).map(function (k) { return rec[k]; }).sort(function (a, b) { return a[0] - b[0]; });
  }

  // Fritsch-Carlson monotone cubic interpolation: smooth, passes through every point, never overshoots
  function monotone(p) {
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
  }

  function paint() {
    var p = pts();
    var s = { id: "sav", name: "Agar cubes", tone: "crimson", points: p };
    if (p.length >= 3) {
      s.fn = monotone(p);
      s.fnRange = [p[0][0], p[p.length - 1][0]];
    }
    g.set({
      series: [s],
      guides: [{ axis: "y", value: 100, label: "fully colourless", tone: "teal" }],
      marker: last ? { x: last[0], y: last[1], label: "L = " + last[2] + " mm", tone: "amber" } : null
    });

    var badge = document.getElementById("sav-badge");
    if (badge) { badge.textContent = p.length + (p.length === 1 ? " point" : " points"); badge.classList.toggle("wait", !p.length); }

    var stats = document.getElementById("sav-stats");
    if (stats) {
      var h = "";
      if (p.length) {
        var lo = p[0], hi = p[p.length - 1];
        h += '<div class="gc-stat"><span>Lowest SA : V</span><b>' + lo[0].toFixed(2) + ' → ' + lo[1].toFixed(1) + ' %</b></div>';
        if (p.length > 1) h += '<div class="gc-stat"><span>Highest SA : V</span><b>' + hi[0].toFixed(2) + ' → ' + hi[1].toFixed(1) + ' %</b></div>';
      }
      stats.innerHTML = h;
    }

    var note = document.getElementById("sav-note");
    if (note) {
      var msg;
      if (!p.length) msg = "Cut and measure a cube on the bench. Each cube lands here as a dot: SA : V along the bottom, the share of its volume that turned colourless up the side.";
      else if (p.length < 3) msg = "Keep measuring. At least three points are needed before a smooth curve can be drawn.";
      else if (p.length < 4) msg = "A <b>smooth curve</b> is forming. It climbs steeply and then flattens. One more cube to go.";
      else msg = "The points rise steeply and then <b>level off at 100 %</b>, so a <b>smooth curve of best fit</b> is the right line, not a straight one. Cubes with a high SA : V (small cubes) are cleared completely; cubes with a low SA : V keep a pink core.";
      note.innerHTML = msg;
    }
  }

  document.addEventListener("l1:bench", function (e) {
    var d = e.detail || {};
    if (d.L_mm == null) return;
    rec[d.L_mm] = [+d.ratio, +d.pctColourless];
    last = [+d.ratio, +d.pctColourless, d.L_mm];
    paint();
  });
  document.addEventListener("l1:bench-reset", function () { rec = {}; last = null; paint(); });

  paint();
})();
