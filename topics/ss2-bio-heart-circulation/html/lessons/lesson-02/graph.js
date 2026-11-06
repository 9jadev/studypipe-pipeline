/* Lesson 02 · Live Peak Systolic Pressure P (mmHg) against Chamber Wall Thickness w (mm) graph — simple bench model P = 8 × w */
(function () {
  "use strict";
  var el = document.getElementById("vi-graph");
  if (!el || !window.StudyGraph) return;

  var COND = {
    std: { name: "Normal myocardium (P = 8w)", tone: "teal" },
    heavy: { name: "Athletic heart (P = 10w)", tone: "sky" },
    wide: { name: "Valve regurgitation loss", tone: "pink" }
  };
  var rec = { std: {}, heavy: {}, wide: {} };
  var cond = "std", last = null;

  var g = StudyGraph.create(el, {
    theme: "paper",
    x: { label: "Myocardial Wall Thickness w", unit: "mm", min: 0, max: 16, step: 2 },
    y: { label: "Peak Systolic Pressure P", unit: "mmHg", min: 0, max: 160, step: 20 },
    aria: "Graph of peak chamber systolic pressure P (mmHg) against myocardial wall thickness w (mm)"
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
        if (p.length >= 3) s.note = "backflow leak";
      } else if (p.length >= 2) {
        s.fit = "origin";
        s.extend = true;
        if (c === cond) s.slope = { dx: "Δw", dy: "ΔP", name: "slope k", unit: "mmHg/mm" };
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
        var val = c === "wide" ? (lastP[1] / lastP[0]).toFixed(1) + " mmHg/mm" : count(c) >= 2 ? gradText({ id: c }) : "need 2 pts";
        h += '<div class="gc-stat"><span>' + COND[c].name + "</span><b>" + val + "</b></div>";
      });
      stats.innerHTML = h;
    }

    var note = document.getElementById("vi-note");
    if (note) {
      var msg;
      if (!total) msg = "Tap <b>Trials A–E</b> on the 3D Heart Dissector. Each reading plots Peak Pressure <b>P (mmHg)</b> against Wall Thickness <b>w (mm)</b>.";
      else if (count("std") === 1 && total === 1) msg = "One chamber recorded. Tap another chamber trial so we can fit a straight line through the origin.";
      else if (count("wide") >= 3) msg = "Notice how ruptured chordae tendineae allow blood to leak backward into the atrium, reducing net systolic pressure.";
      else if (count("std") >= 2) msg = "A <b>straight line through the origin</b>: Peak pressure <b>P = 8 × w</b>! Because the Left Ventricle wall (<b>15 mm</b>) is <b>3× thicker</b> than the Right Ventricle (<b>5 mm</b>), it generates <b>120 mmHg</b> for systemic circulation!";
      else msg = "Keep recording chamber trials to complete the wall-thickness pressure line.";
      note.innerHTML = msg;
    }
  }

  function gradText(s) {
    var f = StudyGraph.leastSquares(pts(s.id), true);
    return f ? f.m.toFixed(1) + " mmHg/mm" : "–";
  }

  document.addEventListener("l1:bench", function (e) {
    var d = e.detail || {};
    if (d.I == null) return;
    var c = d.cond || "std";
    rec[c][d.trial] = [d.I, +d.V.toFixed(1)];
    cond = c;
    last = { I: d.I, V: d.V, label: "ABCDE".charAt(d.trial) };
    paint();
  });
  document.addEventListener("l1:bench-cond", function (e) { cond = (e.detail || {}).cond || "std"; last = null; paint(); });
  document.addEventListener("l1:bench-reset", function () { rec = { std: {}, heavy: {}, wide: {} }; cond = "std"; last = null; paint(); });

  paint();
})();
