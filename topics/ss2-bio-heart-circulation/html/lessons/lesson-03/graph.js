/* Lesson 03 · Live Cardiac Output CO (L/min) against Heart Rate HR (bpm) graph — slope = Stroke Volume SV (L/beat) */
(function () {
  "use strict";
  var el = document.getElementById("vi-graph");
  if (!el || !window.StudyGraph) return;

  var COND = {
    std: { name: "Normal SV (0.075 L = 75 mL)", tone: "teal" },
    heavy: { name: "Adrenaline SV (0.110 L = 110 mL)", tone: "sky" },
    wide: { name: "Impaired filling drift", tone: "pink" }
  };
  var rec = { std: {}, heavy: {}, wide: {} };
  var cond = "std", last = null;

  var g = StudyGraph.create(el, {
    theme: "paper",
    x: { label: "Heart Rate HR", unit: "bpm", min: 0, max: 165, step: 30 },
    y: { label: "Cardiac Output CO", unit: "L/min", min: 0, max: 18, step: 3 },
    aria: "Graph of Cardiac Output CO (L/min) against Heart Rate HR (bpm)"
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
        if (p.length >= 3) s.note = "incomplete filling";
      } else if (p.length >= 2) {
        s.fit = "origin";
        s.extend = true;
        if (c === cond) s.slope = { dx: "ΔHR", dy: "ΔCO", name: "slope SV", unit: "L" };
        else s.note = "SV = " + gradText(s);
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
        var val = c === "wide" ? (lastP[1] / lastP[0]).toFixed(3) + " L" : count(c) >= 2 ? gradText({ id: c }) : "need 2 pts";
        h += '<div class="gc-stat"><span>' + COND[c].name + "</span><b>" + val + "</b></div>";
      });
      stats.innerHTML = h;
    }

    var note = document.getElementById("vi-note");
    if (note) {
      var msg;
      if (!total) msg = "Tap <b>Trials A–E</b> on the Pacemaker Bench. Each reading plots Cardiac Output <b>CO (L/min)</b> against Heart Rate <b>HR (bpm)</b>.";
      else if (count("std") === 1 && total === 1) msg = "One heart rate recorded. Tap another trial so we can fit a straight line through the origin.";
      else if (count("heavy") >= 2 && count("std") >= 2) msg = "Notice how adrenaline increases stroke volume from <b>0.075 L (75 mL)</b> to <b>0.110 L (110 mL)</b>, making the slope <b>ΔCO ÷ ΔHR</b> steeper!";
      else if (count("std") >= 2) msg = "A <b>straight line through the origin</b>: <b>CO = HR × SV</b>. The slope <b>ΔCO ÷ ΔHR = " + gradText({ id: "std" }) + " (75 mL/beat)</b> is the stroke volume!";
      else msg = "Keep recording heart rate trials to complete the cardiac output line.";
      note.innerHTML = msg;
    }
  }

  function gradText(s) {
    var f = StudyGraph.leastSquares(pts(s.id), true);
    return f ? f.m.toFixed(3) + " L" : "–";
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
