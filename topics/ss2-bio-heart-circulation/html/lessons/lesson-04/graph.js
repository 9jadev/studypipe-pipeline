/* Lesson 04 · Live Starling Net Filtration Pressure NFP (mmHg) against Capillary Position (%) graph — crosses 0 mmHg at 50% */
(function () {
  "use strict";
  var el = document.getElementById("vi-graph");
  if (!el || !window.StudyGraph) return;

  var COND = {
    std: { name: "Normal (π_c = 25 mmHg)", tone: "teal" },
    heavy: { name: "Kwashiorkor (π_c = 15 mmHg)", tone: "sky" },
    wide: { name: "Venous congestion", tone: "pink" }
  };
  var rec = { std: {}, heavy: {}, wide: {} };
  var cond = "std", last = null;

  var g = StudyGraph.create(el, {
    theme: "paper",
    x: { label: "Distance Along Capillary", unit: "%", min: 0, max: 105, step: 25 },
    y: { label: "Net Filtration Pressure NFP", unit: "mmHg", min: -15, max: 25, step: 5 },
    aria: "Graph of Net Filtration Pressure NFP (mmHg) against distance along the capillary bed (%)"
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
      guides: [{ axis: "y", value: 0, tone: "lime" }, { axis: "x", value: 50, tone: "amber" }],
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
        h += '<div class="gc-stat"><span>' + COND[c].name + "</span><b>" + (lastP[1] >= 0 ? "+" : "") + lastP[1].toFixed(1) + " mmHg at " + lastP[0] + "%</b></div>";
      });
      stats.innerHTML = h;
    }

    var note = document.getElementById("vi-note");
    if (note) {
      var msg;
      if (!total) msg = "Tap <b>Trials A–E</b> on the Capillary Bench. Each reading plots <b>NFP = P_c − π_c (mmHg)</b> from the arterial end (0%) to the venous end (100%).";
      else if (count("std") === 1 && total === 1) msg = "Arterial end recorded (<b>+10.0 mmHg ultrafiltration</b>). Tap Trials B–E to find the zero-filtration equilibrium point and venous reabsorption zone!";
      else if (count("heavy") >= 2) msg = "In <b>kwashiorkor</b> (low plasma albumin, <b>π_c = 15 mmHg</b>), the entire line shifts upward so fluid is never reabsorbed — causing tissue swelling (<b>oedema</b>)!";
      else if (count("std") >= 4) msg = "Look at the zero crossing at <b>50%</b>: from <b>0–50%</b> (<b>NFP &gt; 0</b>) ultrafiltration forms tissue fluid; from <b>50–100%</b> (<b>NFP &lt; 0</b>) osmosis reabsorbs 85% of fluid while lymph vessels drain the remaining 15%!";
      else msg = "Keep recording capillary trials to complete the Starling filtration profile.";
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
