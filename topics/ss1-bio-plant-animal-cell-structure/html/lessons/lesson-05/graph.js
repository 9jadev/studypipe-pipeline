/* Lesson 05 · Live Field-of-View Diameter D_FOV (µm) against Total Magnification M_total graph */
(function () {
  "use strict";
  var el = document.getElementById("vi-graph");
  if (!el || !window.StudyGraph) return;

  var COND = {
    std: { name: "Onion slide (D = 180,000/M)", tone: "teal" },
    heavy: { name: "Cheek smear (N = D ÷ 45 µm)", tone: "sky" },
    wide: { name: "Air bubble artefact", tone: "pink" }
  };
  var rec = { std: {}, heavy: {}, wide: {} };
  var cond = "std", last = null;

  var g = StudyGraph.create(el, {
    theme: "paper",
    x: { label: "Total Magnification M", unit: "×", min: 0, max: 650, step: 100 },
    y: { label: "FOV Diameter D", unit: "µm", min: 0, max: 4800, step: 900 },
    aria: "Graph of microscope field-of-view diameter D (µm) against total magnification M (×)"
  });

  function pts(c) { return Object.keys(rec[c]).sort(function (a, b) { return a - b; }).map(function (k) { return rec[c][k]; }); }
  function count(c) { return Object.keys(rec[c]).length; }

  function paint() {
    var series = [];
    ["std", "heavy", "wide"].forEach(function (c) {
      var p = pts(c);
      if (!p.length && c !== cond) return;
      var s = { id: c, name: COND[c].name, tone: COND[c].tone, points: p, join: p.length > 1 };
      if (p.length >= 2) s.note = "D ∝ 1 ÷ M";
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
        h += '<div class="gc-stat"><span>' + (c === "std" ? "Onion A = D÷N" : c === "heavy" ? "Cheek A = D÷N" : "FOV at ×" + lastP[0]) + "</span><b>" + (c === "heavy" ? "45 µm" : "75 µm") + " (D=" + lastP[1] + " µm)</b></div>";
      });
      stats.innerHTML = h;
    }

    var note = document.getElementById("vi-note");
    if (note) {
      var msg;
      if (!total) msg = "Tap <b>Trials A–E</b> on the wet-mount bench to plot Field-of-View Diameter <b>D (µm)</b> against Total Magnification <b>M</b>.";
      else if (total === 1) msg = "One magnification recorded. Tap more trials to see the inverse relationship <b>D₂ = D₁ × (M₁ ÷ M₂)</b>.";
      else msg = "Inverse curve <b>D × M = 180,000 µm</b>! Quadrupling magnification from <b>×100 to ×400</b> divides the field diameter by 4 (<b>1800 µm → 450 µm</b>), reducing the number of 75 µm onion cells across the diameter from <b>24 to 6</b>.";
      note.innerHTML = msg;
    }
  }

  document.addEventListener("l5:bench", function (e) {
    var d = e.detail || {};
    if (d.I == null) return;
    var c = d.cond || "std";
    rec[c][d.trial] = [d.I, +d.V.toFixed(0)];
    cond = c;
    last = { I: d.I, V: d.V, label: "ABCDE".charAt(d.trial) };
    paint();
  });
  document.addEventListener("l5:bench-cond", function (e) { cond = (e.detail || {}).cond || "std"; last = null; paint(); });
  document.addEventListener("l5:bench-reset", function () { rec = { std: {}, heavy: {}, wide: {} }; cond = "std"; last = null; paint(); });

  paint();
})();
