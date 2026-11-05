/* Lesson 01 · Live V–I graph — plots every bench reading, fits a line, shows the gradient = R */
(function () {
  "use strict";
  var el = document.getElementById("vi-graph");
  if (!el || !window.StudyGraph) return;

  var COND = {
    std: { name: "Constantan d₀, key opened", tone: "teal" },
    heavy: { name: "Double diameter 2d₀", tone: "sky" },
    wide: { name: "Key left closed (heating)", tone: "pink" }
  };
  var rec = { std: {}, heavy: {}, wide: {} };
  var cond = "std", last = null;

  var g = StudyGraph.create(el, {
    theme: "paper",
    x: { label: "Current I", unit: "A", min: 0, max: 1.4, step: 0.2 },
    y: { label: "P.d. V", unit: "V", min: 0, max: 3.6, step: 0.5 },
    aria: "Graph of potential difference V against current I for the bench readings"
  });

  function pts(c) { return Object.keys(rec[c]).sort().map(function (k) { return rec[c][k]; }); }
  function count(c) { return Object.keys(rec[c]).length; }

  function paint() {
    var series = [];
    ["std", "heavy", "wide"].forEach(function (c) {
      var p = pts(c);
      if (!p.length && c !== cond) return;
      var s = { id: c, name: COND[c].name, tone: COND[c].tone, points: p };
      if (c === "wide") {
        s.join = p.length > 1;
        if (p.length >= 3) s.note = "curves up";
      } else if (p.length >= 2) {
        s.fit = "origin";
        s.extend = true;
        // one slope triangle at a time keeps a phone-sized plot readable; other lines show R in the legend
        if (c === cond) s.slope = { dx: "ΔI", dy: "ΔV", name: "gradient R", unit: "Ω" };
        else s.note = "R = " + gradText(s);
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
        var val = c === "wide" ? (lastP[1] / lastP[0]).toFixed(2) + " Ω at " + lastP[0].toFixed(2) + " A" : count(c) >= 2 ? gradText({ id: c }) : "need 2 pts";
        h += '<div class="gc-stat"><span>' + (c === "std" ? "Constantan R" : c === "heavy" ? "2d₀ wire R" : "Hot wire V÷I") + "</span><b>" + val + "</b></div>";
      });
      stats.innerHTML = h;
    }

    var note = document.getElementById("vi-note");
    if (note) {
      var msg;
      if (!total) msg = "Tap <b>Trials A–E</b> on the bench. Each reading lands here as a dot. Two or more give you a best-fit line through the origin.";
      else if (count("std") === 1 && total === 1) msg = "One point plotted. Record another trial: a straight line needs at least two.";
      else if (count("wide") >= 3) msg = "The pink points <b>curve upwards</b>: V ÷ I keeps growing because the wire heats up while the key stays closed. A non-straight V–I graph means Ohm's law no longer holds.";
      else if (count("heavy") >= 2 && count("std") >= 2) msg = "Both lines pass through the origin, so both wires obey Ohm's law. Doubling the diameter makes A four times bigger, so the gradient (R) falls to <b>one-quarter</b>: 2.20 Ω → 0.55 Ω.";
      else if (count("std") >= 2) msg = "A <b>straight line through the origin</b>: V ∝ I. The gradient ΔV ÷ ΔI is the resistance, <b>R ≈ " + gradText({ id: "std" }) + "</b>. Now try <b>Double Diameter</b> or <b>Key Left Closed</b> and record again.";
      else msg = "Keep recording. More points make the best-fit line more reliable.";
      note.innerHTML = msg;
    }
  }

  function gradText(s) {
    var f = StudyGraph.leastSquares(pts(s.id), true);
    return f ? f.m.toFixed(2) + " Ω" : "–";
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
