/* Lesson 02 · Live ATP Output vs Mitochondrial Cristae Surface Area graph */
(function () {
  "use strict";
  var el = document.getElementById("vi-graph");
  if (!el || !window.StudyGraph) return;

  var COND = {
    std: { name: "Aerobic mitochondria (k = 0.45)", tone: "teal" },
    heavy: { name: "Dense cristae folding (1.5× k)", tone: "sky" },
    wide: { name: "Hypoxic / inhibited cristae", tone: "pink" }
  };
  var rec = { std: {}, heavy: {}, wide: {} };
  var cond = "std", last = null;

  var g = StudyGraph.create(el, {
    theme: "paper",
    x: { label: "Cristae Surface Area C", unit: "µm²", min: 0, max: 550, step: 100 },
    y: { label: "ATP Output Rate", unit: "u", min: 0, max: 350, step: 50 },
    aria: "Graph of cellular ATP synthesis rate against mitochondrial cristae surface area across five tissues"
  });

  function pts(c) { return Object.keys(rec[c]).sort(function (a, b) { return a - b; }).map(function (k) { return rec[c][k]; }); }
  function count(c) { return Object.keys(rec[c]).length; }

  function paint() {
    var series = [];
    ["std", "heavy", "wide"].forEach(function (c) {
      var p = pts(c);
      if (!p.length && c !== cond) return;
      var s = { id: c, name: COND[c].name, tone: COND[c].tone, points: p };
      if (c === "wide") {
        s.join = p.length > 1;
        if (p.length >= 3) s.note = "O₂ limited";
      } else if (p.length >= 2) {
        s.fit = "origin";
        s.extend = true;
        if (c === cond) s.slope = { dx: "ΔC", dy: "ΔATP", name: "slope k", unit: "" };
        else s.note = "k = " + gradText(s);
      }
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
        var val = c === "wide" ? (lastP[1] / lastP[0]).toFixed(2) : count(c) >= 2 ? gradText({ id: c }) : "need 2 pts";
        h += '<div class="gc-stat"><span>' + (c === "std" ? "Normal ATP÷C" : c === "heavy" ? "Dense Cristae k" : "Hypoxic ATP÷C") + "</span><b>" + val + "</b></div>";
      });
      stats.innerHTML = h;
    }

    var note = document.getElementById("vi-note");
    if (note) {
      var msg;
      if (!total) msg = "Tap <b>Trials A–E</b> on the bench to compare Adipose, Cheek, Palisade, Liver, and Flight Muscle cells.";
      else if (count("std") === 1 && total === 1) msg = "One tissue plotted. Record another tissue trial to fit the straight line.";
      else if (count("wide") >= 3) msg = "When oxygen is scarce or cytochrome oxidase is inhibited, the pink curve flattens because oxidative phosphorylation stalls.";
      else if (count("heavy") >= 2 && count("std") >= 2) msg = "Look at the steeper blue slope: packing more ATP synthase complexes onto folded inner cristae increases ATP output per µm²!";
      else if (count("std") >= 2) msg = "A <b>straight line through the origin</b>: tissues with higher metabolic demand (liver, sperm midpiece, flight muscle) pack far more mitochondrial cristae area (<b>slope k = " + gradText({ id: "std" }) + "</b>).";
      else msg = "Keep recording tissue trials.";
      note.innerHTML = msg;
    }
  }

  function gradText(s) {
    var f = StudyGraph.leastSquares(pts(s.id), true);
    return f ? f.m.toFixed(2) : "–";
  }

  document.addEventListener("l2:bench", function (e) {
    var d = e.detail || {};
    if (d.I == null) return;
    var c = d.cond || "std";
    rec[c][d.trial] = [d.I, +d.V.toFixed(2)];
    cond = c;
    last = { I: d.I, V: d.V, label: "ABCDE".charAt(d.trial) };
    paint();
  });
  document.addEventListener("l2:bench-cond", function (e) { cond = (e.detail || {}).cond || "std"; last = null; paint(); });
  document.addEventListener("l2:bench-reset", function () { rec = { std: {}, heavy: {}, wide: {} }; cond = "std"; last = null; paint(); });

  paint();
})();
