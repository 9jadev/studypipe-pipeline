/* Lesson 05 · Live Oxygen-Carrying Capacity C_O2 (mL O2/100 mL) against Haemoglobin Concentration [Hb] (g/100 mL) graph */
(function () {
  "use strict";
  var el = document.getElementById("vi-graph");
  if (!el || !window.StudyGraph) return;

  var COND = {
    std: { name: "100% Arterial Sat (1.34×[Hb])", tone: "teal" },
    heavy: { name: "Fibrin Clot Active", tone: "amber" },
    wide: { name: "Hypoxia / Sickle Crisis (60%)", tone: "pink" }
  };
  var rec = { std: {}, heavy: {}, wide: {} };
  var cond = "std", last = null;

  var g = StudyGraph.create(el, {
    theme: "paper",
    x: { label: "Haemoglobin Concentration [Hb]", unit: "g/100 mL", min: 6, max: 20, step: 2 },
    y: { label: "O₂ Capacity C_O₂", unit: "mL O₂/100 mL", min: 0, max: 28, step: 4 },
    aria: "Graph of Blood Oxygen Capacity C_O2 (mL O2 per 100 mL) against Haemoglobin Concentration [Hb] (g per 100 mL)"
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
      guides: [{ axis: "x", value: 11, tone: "pink" }, { axis: "y", value: 20.1, tone: "lime" }],
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
        h += '<div class="gc-stat"><span>' + COND[c].name + "</span><b>" + lastP[1].toFixed(1) + " mL O₂/dL at " + lastP[0].toFixed(1) + " g/dL</b></div>";
      });
      stats.innerHTML = h;
    }

    var note = document.getElementById("vi-note");
    if (note) {
      var msg;
      if (!total) msg = "Tap <b>Trials A–E</b> on the Haematology Bench. Each reading plots <b>C_O₂ = 1.34 × [Hb] (mL O₂/100 mL)</b> from 8.0 g/dL (anaemia) to 18.0 g/dL.";
      else if (count("std") === 1 && total === 1) msg = "First haemoglobin trial recorded! Tap the remaining trials to reveal the linear proportionality <b>C_O₂ = 1.34 × [Hb]</b>.";
      else if (count("wide") >= 2) msg = "During a <b>sickle-cell hypoxia crisis</b> or CO exposure, arterial saturation drops sharply, shifting the oxygen delivery line downward!";
      else if (count("std") >= 4) msg = "Notice the straight line of slope <b>1.34 mL O₂ per g Hb</b>: at healthy <b>[Hb] = 15.0 g/dL</b>, 100 mL carries <b>20.1 mL O₂</b> (and 5 L carries <b>1,005 mL O₂</b>), whereas at <b>8.0 g/dL (anaemia)</b> capacity drops nearly in half!";
      else msg = "Keep recording haemoglobin trials to complete the oxygen-carrying capacity curve.";
      note.innerHTML = msg;
    }
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
