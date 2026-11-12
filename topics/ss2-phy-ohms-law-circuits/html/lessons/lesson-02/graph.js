/* Lesson 02 · Live V–I graph — plots each recorded terminal p.d. against current,
   fits a straight line, and reads E (vertical intercept) and r (magnitude of the gradient). */
(function () {
  "use strict";
  var el = document.getElementById("vi-graph");
  if (!el || !window.StudyGraph) return;

  var rec = {};     // keyed by R so re-taking a load overwrites, not duplicates
  var last = null;

  var g = StudyGraph.create(el, {
    theme: "paper",
    x: { label: "Current I", unit: "A", min: 0, max: 3.0, step: 0.5 },
    y: { label: "Terminal p.d. V", unit: "V", min: 0, max: 6.5, step: 1.0 },
    aria: "Graph of terminal potential difference V against current I for the cell"
  });

  function pts() { return Object.keys(rec).sort(function (a, b) { return rec[a][0] - rec[b][0]; }).map(function (k) { return rec[k]; }); }

  function paint() {
    var p = pts();
    var series = [{
      id: "cell", name: "Cell E = 6.0 V, r = 1.5 Ω", tone: "teal", points: p
    }];
    if (p.length >= 2) {
      series[0].fit = "line";
      series[0].extend = true;
      series[0].yIntercept = "E";
      series[0].slope = { dy: "ΔV", dx: "ΔI", name: "gradient = −r", unit: "Ω", dec: 2 };
    }
    g.set({
      series: series,
      marker: last ? { x: last.I, y: last.V, label: "I = " + last.I.toFixed(2) + " A", tone: "amber", labelPos: "below" } : null
    });

    var badge = document.getElementById("vi-badge");
    if (badge) { badge.textContent = p.length + (p.length === 1 ? " point" : " points"); badge.classList.toggle("wait", !p.length); }

    var stats = document.getElementById("vi-stats");
    if (stats) {
      var f = p.length >= 2 ? StudyGraph.leastSquares(p, false) : null;
      var h = "";
      if (f) {
        h += '<div class="gc-stat"><span>Intercept E</span><b>' + f.c.toFixed(2) + ' V</b></div>';
        h += '<div class="gc-stat"><span>Gradient</span><b>' + f.m.toFixed(2).replace("-", "−") + ' V A⁻¹</b></div>';
        h += '<div class="gc-stat"><span>Internal r = |gradient|</span><b>' + Math.abs(f.m).toFixed(2) + ' Ω</b></div>';
      }
      stats.innerHTML = h;
    }

    var note = document.getElementById("vi-note");
    if (note) {
      var msg;
      if (!p.length) msg = "Take readings on the bench. Each closed-key reading lands here as a dot (I, V). Two or more give a best-fit line.";
      else if (p.length === 1) msg = "One point plotted. Record another load: a straight line needs at least two.";
      else {
        var f2 = StudyGraph.leastSquares(p, false);
        msg = "A <b>straight line that slopes downward</b>: V = E − rI. Extended back to I = 0 it cuts the V axis at the <b>EMF, E ≈ " + (f2 ? f2.c.toFixed(1) : "6.0") + " V</b>, and the magnitude of its gradient is the <b>internal resistance, r ≈ " + (f2 ? Math.abs(f2.m).toFixed(1) : "1.5") + " Ω</b>.";
      }
      note.innerHTML = msg;
    }
  }

  document.addEventListener("l2:bench", function (e) {
    var r = e.detail || {};
    if (!r.rows) return;
    rec = {};
    r.rows.forEach(function (row) {
      if (row.R == null) return;                 // skip the open-circuit row (I = 0, V = E)
      rec[row.R] = [row.I, +row.V.toFixed(3)];
    });
    last = r.key && r.R != null ? { I: r.I, V: r.V } : null;
    paint();
  });
  document.addEventListener("l2:bench-reset", function () { rec = {}; last = null; paint(); });
  document.addEventListener("l2:pin", function (e) {
    var d = e.detail || {};
    last = (d.I != null && d.R != null) ? { I: d.I, V: d.V } : null;
    paint();
  });

  paint();
})();
