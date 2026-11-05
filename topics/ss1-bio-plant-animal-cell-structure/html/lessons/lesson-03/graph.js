/* Lesson 03 · Live Surface-Area-to-Volume Ratio (SA/V = 6/L) against Cube Side Length L (mm) graph */
(function () {
  "use strict";
  var el = document.getElementById("vi-graph");
  if (!el || !window.StudyGraph) return;

  var COND = {
    std: { name: "Smooth cube (SA/V = 6/L)", tone: "teal" },
    heavy: { name: "Microvilli folded (2× SA/V)", tone: "sky" },
    wide: { name: "Unfolded hypoxia zone", tone: "pink" }
  };
  var rec = { std: {}, heavy: {}, wide: {} };
  var cond = "std", last = null;

  var g = StudyGraph.create(el, {
    theme: "paper",
    x: { label: "Cube Side Length L", unit: "mm", min: 0, max: 6.5, step: 1 },
    y: { label: "Ratio SA ÷ V", unit: "mm⁻¹", min: 0, max: 12.5, step: 2 },
    aria: "Graph of surface-area-to-volume ratio SA/V (mm⁻¹) against side length L (mm)"
  });

  function pts(c) { return Object.keys(rec[c]).sort(function (a, b) { return a - b; }).map(function (k) { return rec[c][k]; }); }
  function count(c) { return Object.keys(rec[c]).length; }

  function paint() {
    var series = [];
    ["std", "heavy", "wide"].forEach(function (c) {
      var p = pts(c);
      if (!p.length && c !== cond) return;
      var s = { id: c, name: COND[c].name, tone: COND[c].tone, points: p, join: p.length > 1 };
      if (p.length >= 2) s.note = c === "heavy" ? "12 ÷ L" : "6 ÷ L";
      series.push(s);
    });
    g.set({
      series: series,
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
        h += '<div class="gc-stat"><span>' + (c === "std" ? "Cube SA÷V" : c === "heavy" ? "Folded SA÷V" : "Hypoxic SA÷V") + "</span><b>" + lastP[1].toFixed(2) + " mm⁻¹ at L=" + lastP[0] + "</b></div>";
      });
      stats.innerHTML = h;
    }

    var note = document.getElementById("vi-note");
    if (note) {
      var msg;
      if (!total) msg = "Tap <b>Trials A–E</b> on the bench to plot how <b>SA ÷ V = 6 ÷ L</b> drops as size <b>L</b> increases.";
      else if (total === 1) msg = "At <b>L = 1 mm</b>, SA/V is a huge <b>6.00 mm⁻¹</b>. Tap Trials B–E to see what happens as the organism grows!";
      else if (count("heavy") >= 2) msg = "Look at the blue curve: folding the membrane into microvilli, root hairs, or gill lamellae doubles surface area without increasing volume!";
      else msg = "Hyperbolic decay <b>SA ÷ V = 6 ÷ L</b>! When L grows 6× from 1 mm to 6 mm, surface area grows 36× (6 → 216 mm²) but volume grows 216× (1 → 216 mm³), cutting SA/V to one-sixth (<b>1.00 mm⁻¹</b>)!";
      note.innerHTML = msg;
    }
  }

  document.addEventListener("l3:bench", function (e) {
    var d = e.detail || {};
    if (d.I == null) return;
    var c = d.cond || "std";
    rec[c][d.trial] = [d.I, +d.V.toFixed(2)];
    cond = c;
    last = { I: d.I, V: d.V, label: "ABCDE".charAt(d.trial) };
    paint();
  });
  document.addEventListener("l3:bench-cond", function (e) { cond = (e.detail || {}).cond || "std"; last = null; paint(); });
  document.addEventListener("l3:bench-reset", function () { rec = { std: {}, heavy: {}, wide: {} }; cond = "std"; last = null; paint(); });

  paint();
})();
