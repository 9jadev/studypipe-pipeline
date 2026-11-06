/* Lesson 01 · Live SA/V Ratio vs Organism Side Length L (mm) graph — shows hyperbolic drop SA/V = 6 ÷ L */
(function () {
  "use strict";
  var el = document.getElementById("vi-graph");
  if (!el || !window.StudyGraph) return;

  var COND = {
    std: { name: "Full cube (SA/V = 6 ÷ L)", tone: "teal" },
    heavy: { name: "Half-exposed cube (3 ÷ L)", tone: "sky" },
    wide: { name: "Stagnant open sinus", tone: "pink" }
  };
  var rec = { std: {}, heavy: {}, wide: {} };
  var cond = "std", last = null;

  var g = StudyGraph.create(el, {
    theme: "paper",
    x: { label: "Cube Side Length L", unit: "mm", min: 0, max: 11, step: 2 },
    y: { label: "SA/V Ratio (6 ÷ L)", unit: "mm⁻¹", min: 0, max: 32, step: 5 },
    aria: "Graph of Surface-Area-to-Volume ratio SA/V (mm⁻¹) against cube side length L (mm)"
  });

  function pts(c) { return Object.keys(rec[c]).sort(function (a, b) { return a - b; }).map(function (k) { return rec[c][k]; }); }
  function count(c) { return Object.keys(rec[c]).length; }

  function paint() {
    var series = [];
    ["std", "heavy", "wide"].forEach(function (c) {
      var p = pts(c);
      if (!p.length && c !== cond) return;
      var s = { id: c, name: COND[c].name, tone: COND[c].tone, points: p, join: p.length > 1 };
      series.push(s);
    });
    g.set({
      series: series,
      guides: [{ axis: "y", value: 6.0, tone: "amber" }],
      marker: last ? { x: last.I, y: last.V, label: "Trial " + last.label, tone: "amber" } : null
    });

    var total = count("std") + count("heavy") + count("wide");
    var badge = document.getElementById("vi-badge");
    if (badge) { badge.textContent = total + (total === 1 ? " point" : " points"); badge.classList.toggle("wait", !total); }

    var stats = document.getElementById("vi-stats");
    if (stats) {
      var h = "";
      ["std", "heavy", "wide"].forEach(function (c) {
        if (!count(c)) return;
        var p = pts(c), lastP = p[p.length - 1];
        h += '<div class="gc-stat"><span>' + COND[c].name + "</span><b>" + lastP[1].toFixed(2) + " mm⁻¹ at L=" + lastP[0] + " mm</b></div>";
      });
      stats.innerHTML = h;
    }

    var note = document.getElementById("vi-note");
    if (note) {
      var msg;
      if (!total) msg = "Tap <b>Trials A–E</b> on the 3D bench. Each reading plots <b>SA/V = 6 ÷ L (mm⁻¹)</b> against organism side length <b>L (mm)</b>.";
      else if (count("std") === 1 && total === 1) msg = "One cube size recorded. Tap more trials (B–E) to trace how steeply SA/V drops as L grows!";
      else if (count("std") >= 4) msg = "Notice the steep hyperbolic drop! Increasing <b>L</b> 50-fold (from <b>0.2 mm</b> to <b>10 mm</b>) slashes <b>SA/V</b> 50-fold (from <b>30.0 mm⁻¹</b> down to <b>0.60 mm⁻¹</b>) — proving why large animals need a heart and blood vessels!";
      else msg = "Keep recording cube trials to complete the SA/V scaling curve.";
      note.innerHTML = msg;
    }
  }

  document.addEventListener("l1:bench", function (e) {
    var d = e.detail || {};
    if (d.I == null) return;
    var c = d.cond || "std";
    rec[c][d.trial] = [d.I, +d.V.toFixed(2)];
    cond = c;
    last = { I: d.I, V: d.V, label: "ABCDE".charAt(d.trial) };
    paint();
  });
  document.addEventListener("l1:bench-cond", function (e) { cond = (e.detail || {}).cond || "std"; last = null; paint(); });
  document.addEventListener("l1:bench-reset", function () { rec = { std: {}, heavy: {}, wide: {} }; cond = "std"; last = null; paint(); });

  paint();
})();
