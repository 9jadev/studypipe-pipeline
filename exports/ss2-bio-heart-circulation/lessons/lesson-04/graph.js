/* Lesson 04 · live graph: heart rate (y) against minutes after exercise (x).
   Each post-exercise count from the bench lands as a dot; with three or more dots a smooth curve of best fit is drawn
   (monotone cubic through the points, never a straight line: the rate falls fast and then levels off).
   The dashed line is the resting rate; recovery is where the curve meets it. */
(function () {
  "use strict";
  var el = document.getElementById("hr-graph");
  if (!el || !window.StudyGraph) return;

  var REST = 68;
  var rec = {};      // minute -> [minute, bpm]
  var last = null;
  var restMean = null;

  var g = StudyGraph.create(el, {
    theme: "paper",
    x: { label: "Time after exercise", unit: "min", min: 0, max: 5.5, step: 1 },
    y: { label: "Heart rate", unit: "bpm", min: 60, max: 140, step: 20 },
    aria: "Graph of heart rate in beats per minute against minutes after exercise, falling in a smooth curve towards the resting rate"
  });

  function pts() {
    return Object.keys(rec).map(function (k) { return rec[k]; }).sort(function (a, b) { return a[0] - b[0]; });
  }

  // Fritsch-Carlson monotone cubic: smooth, passes through every point, never overshoots
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
    var s = { id: "hr", name: "Heart rate", tone: "crimson", points: p };
    if (p.length >= 3) { s.fn = monotone(p); s.fnRange = [p[0][0], p[p.length - 1][0]]; }
    var rest = restMean != null ? Math.round(restMean * 4) : REST;
    var recovered = p.length && p[p.length - 1][0] >= 4 && p[p.length - 1][1] <= rest + 1 ? p[p.length - 1] : null;
    g.set({
      series: [s],
      guides: [{ axis: "y", value: rest, label: "rest " + rest, tone: "teal" }],
      marker: recovered ? { x: recovered[0], y: recovered[1], label: "≈ " + recovered[0] + " min", tone: "amber" }
        : last ? { x: last[0], y: last[1], label: last[1] + " bpm", tone: "amber" } : null
    });

    var badge = document.getElementById("hr-badge");
    if (badge) { badge.textContent = p.length + (p.length === 1 ? " point" : " points"); badge.classList.toggle("wait", !p.length); }

    var stats = document.getElementById("hr-stats");
    if (stats) {
      var h = "";
      if (p.length) {
        var hi = p[0];
        h += '<div class="gc-stat"><span>First count (' + hi[0] + ' min)</span><b>' + hi[1] + ' bpm</b></div>';
        if (p.length > 1) { var lo = p[p.length - 1]; h += '<div class="gc-stat"><span>Latest (' + lo[0] + ' min)</span><b>' + lo[1] + ' bpm</b></div>'; }
        if (p.length > 1) h += '<div class="gc-stat"><span>Fall so far</span><b>' + (hi[1] - p[p.length - 1][1]) + ' bpm</b></div>';
      }
      stats.innerHTML = h;
    }

    var note = document.getElementById("hr-note");
    if (note) {
      var msg;
      if (!p.length) msg = "Count Chidi's pulse on the bench after the step-ups. Each count lands here as a dot: minutes after exercise along the bottom, heart rate up the side.";
      else if (p.length < 3) msg = "Keep going. At least three points are needed before a smooth curve can be drawn.";
      else if (p.length < 6) msg = "A <b>smooth curve</b> is forming. It falls steeply and then flattens towards the dashed resting line.";
      else msg = "The rate falls <b>steeply for the first 2 to 3 minutes and then levels off</b>, so a <b>smooth curve of best fit</b> is the right line, not a straight one. Recovery time is where the curve meets the dashed resting rate: about <b>5 minutes</b>.";
      note.innerHTML = msg;
    }
  }

  function take(d) {
    if (!d) return;
    if (d.restMean != null) restMean = d.restMean;
    (d.table || []).forEach(function (x) { if (x && x.count15 != null) rec[x.t_min] = [x.t_min, x.bpm]; });
    var rows = d.rows || [], lr = rows[rows.length - 1];
    last = lr && lr.phase === "post" ? [lr.t_min, lr.bpm] : last;
    paint();
  }
  document.addEventListener("l4:bench", function (e) { take(e.detail); });
  document.addEventListener("l4:bench-reset", function () { rec = {}; last = null; restMean = null; paint(); });

  paint();
})();
