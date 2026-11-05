/* Lesson 01 · Live I–M Magnification graph — plots Image Size I (mm) against Total Magnification M, showing gradient = Actual Size A (mm) */
(function () {
  "use strict";
  var el = document.getElementById("vi-graph");
  if (!el || !window.StudyGraph) return;

  var COND = {
    std: { name: "Onion cell (A = 0.060 mm)", tone: "teal" },
    heavy: { name: "Cheek cell (A = 0.030 mm)", tone: "sky" },
    wide: { name: "Coarse knob blur (distorted)", tone: "pink" }
  };
  var rec = { std: {}, heavy: {}, wide: {} };
  var cond = "std", last = null;

  var g = StudyGraph.create(el, {
    theme: "paper",
    x: { label: "Total Magnification M", unit: "×", min: 0, max: 650, step: 100 },
    y: { label: "Image Size I", unit: "mm", min: 0, max: 40, step: 5 },
    aria: "Graph of measured image size I (mm) against total magnification M for the microscope bench readings"
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
        if (p.length >= 3) s.note = "blur drift";
      } else if (p.length >= 2) {
        s.fit = "origin";
        s.extend = true;
        if (c === cond) s.slope = { dx: "ΔM", dy: "ΔI", name: "slope A", unit: "mm" };
        else s.note = "A = " + gradText(s);
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
        var val = c === "wide" ? (lastP[1] / lastP[0]).toFixed(3) + " mm" : count(c) >= 2 ? gradText({ id: c }) : "need 2 pts";
        h += '<div class="gc-stat"><span>' + (c === "std" ? "Onion A (I÷M)" : c === "heavy" ? "Cheek A (I÷M)" : "Blurred I÷M") + "</span><b>" + val + "</b></div>";
      });
      stats.innerHTML = h;
    }

    var note = document.getElementById("vi-note");
    if (note) {
      var msg;
      if (!total) msg = "Tap <b>Trials A–E</b> on the microscope bench. Each reading plots Image Size <b>I (mm)</b> against Total Magnification <b>M</b>.";
      else if (count("std") === 1 && total === 1) msg = "One lens recorded. Tap another objective lens trial so we can fit a straight line through the origin.";
      else if (count("wide") >= 3) msg = "Notice how using the coarse knob at high power blurs the cell boundary and distorts the linear <b>I = M × A</b> graph.";
      else if (count("heavy") >= 2 && count("std") >= 2) msg = "Both lines pass through the origin! Because the cheek cell is half as wide (<b>30 µm</b> vs <b>60 µm</b>), its slope <b>A = ΔI ÷ ΔM</b> is half as steep.";
      else if (count("std") >= 2) msg = "A <b>straight line through the origin</b>: Image size <b>I = M × A</b>. The slope <b>ΔI ÷ ΔM = " + gradText({ id: "std" }) + " (60 µm)</b> is the true cell length!";
      else msg = "Keep recording lens trials to complete the magnification line.";
      note.innerHTML = msg;
    }
  }

  function gradText(s) {
    var f = StudyGraph.leastSquares(pts(s.id), true);
    return f ? f.m.toFixed(3) + " mm" : "–";
  }

  document.addEventListener("l1:bench", function (e) {
    var d = e.detail || {};
    if (d.I == null) return;
    var c = d.cond || "std";
    rec[c][d.trial] = [d.I, +d.V.toFixed(3)];
    cond = c;
    last = { I: d.I, V: d.V, label: "ABCDE".charAt(d.trial) };
    paint();
  });
  document.addEventListener("l1:bench-cond", function (e) { cond = (e.detail || {}).cond || "std"; last = null; paint(); });
  document.addEventListener("l1:bench-reset", function () { rec = { std: {}, heavy: {}, wide: {} }; cond = "std"; last = null; paint(); });

  paint();
})();
