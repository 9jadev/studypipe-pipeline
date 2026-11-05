/* Lesson 04 · Live Osmosis Mass Change (%Δm) against Sucrose Molarity M (mol dm⁻³) graph */
(function () {
  "use strict";
  var el = document.getElementById("vi-graph");
  if (!el || !window.StudyGraph) return;

  var COND = {
    std: { name: "Fresh living yam (isotonic 0.30 M)", tone: "teal" },
    heavy: { name: "Halophyte tissue (isotonic 0.50 M)", tone: "sky" },
    wide: { name: "Boiled yam control (0% Δm)", tone: "pink" }
  };
  var rec = { std: {}, heavy: {}, wide: {} };
  var cond = "std", last = null;

  var g = StudyGraph.create(el, {
    theme: "paper",
    x: { label: "External Sucrose Molarity M", unit: "M", min: 0, max: 0.75, step: 0.15 },
    y: { label: "Mass Change %Δm", unit: "%", min: -22, max: 22, step: 5 },
    aria: "Graph of yam strip percentage mass change (%Δm) against external sucrose concentration M (mol dm⁻³)"
  });

  function pts(c) { return Object.keys(rec[c]).sort(function (a, b) { return a - b; }).map(function (k) { return rec[c][k]; }); }
  function count(c) { return Object.keys(rec[c]).length; }

  function paint() {
    var series = [];
    ["std", "heavy", "wide"].forEach(function (c) {
      var p = pts(c);
      if (!p.length && c !== cond) return;
      var s = { id: c, name: COND[c].name, tone: COND[c].tone, points: p, join: p.length > 1 };
      if (p.length >= 2) {
        s.note = c === "wide" ? "no osmosis (dead)" : c === "heavy" ? "isotonic = 0.50 M" : "isotonic = 0.30 M";
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
        var val = c === "wide" ? "None (boiled)" : c === "heavy" ? "0.50 M" : "0.30 M";
        h += '<div class="gc-stat"><span>' + (c === "std" ? "Yam Isotonic M" : c === "heavy" ? "Halophyte M" : "Boiled Control") + "</span><b>" + val + "</b></div>";
      });
      stats.innerHTML = h;
    }

    var note = document.getElementById("vi-note");
    if (note) {
      var msg;
      if (!total) msg = "Tap <b>Trials A–E</b> (0.00 M to 0.70 M) on the osmosis bench to plot percentage mass change <b>%Δm</b>.";
      else if (count("wide") >= 2) msg = "Look at the flat pink line at <b>0%</b>: boiling denatures the plasma membrane and tonoplast, destroying selective permeability so osmosis cannot occur!";
      else if (count("std") >= 3) msg = "Notice where the teal line crosses <b>%Δm = 0.0%</b> at <b>0.30 M</b>! Below 0.30 M (hypotonic), strips gain mass by endosmosis; above 0.30 M (hypertonic), strips lose mass by exosmosis.";
      else msg = "Keep recording sucrose baths to reveal the zero-crossing isotonic concentration.";
      note.innerHTML = msg;
    }
  }

  document.addEventListener("l4:bench", function (e) {
    var d = e.detail || {};
    if (d.I == null) return;
    var c = d.cond || "std";
    rec[c][d.trial] = [d.I, +d.V.toFixed(1)];
    cond = c;
    last = { I: d.I, V: d.V, label: "ABCDE".charAt(d.trial) };
    paint();
  });
  document.addEventListener("l4:bench-cond", function (e) { cond = (e.detail || {}).cond || "std"; last = null; paint(); });
  document.addEventListener("l4:bench-reset", function () { rec = { std: {}, heavy: {}, wide: {} }; cond = "std"; last = null; paint(); });

  paint();
})();
