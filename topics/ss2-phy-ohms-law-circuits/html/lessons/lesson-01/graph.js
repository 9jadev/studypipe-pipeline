/* Lesson 01 · Live V–I graph — plots every bench reading, fits a straight line through the origin
   for a wire (gradient = R) and joins the lamp's points into a smooth rising curve. */
(function () {
  "use strict";
  var el = document.getElementById("vi-graph");
  if (!el || !window.StudyGraph) return;

  var COMP = {
    constantan: { name: "Constantan wire", tone: "teal", wire: true },
    copper: { name: "Copper wire", tone: "sky", wire: true },
    lamp: { name: "Filament lamp", tone: "pink", wire: false }
  };
  var rec = { constantan: {}, copper: {}, lamp: {} };
  var active = "constantan", last = null;

  var g = StudyGraph.create(el, {
    theme: "paper",
    x: { label: "Current I", unit: "A", min: 0, max: 1.2, step: 0.2 },
    y: { label: "P.d. V", unit: "V", min: 0, max: 3, auto: true },
    aria: "Graph of potential difference V (vertical) against current I (horizontal) for the bench readings"
  });

  function pts(c) { return Object.keys(rec[c]).map(Number).sort(function (a, b) { return a - b; }).map(function (k) { return rec[c][k]; }); }
  function count(c) { return Object.keys(rec[c]).length; }
  function gradText(c) { var f = StudyGraph.leastSquares(pts(c), true); return f ? f.m.toFixed(2) + " Ω" : "–"; }

  function paint() {
    var series = [];
    ["constantan", "copper", "lamp"].forEach(function (c) {
      var p = pts(c);
      if (!p.length && c !== active) return;
      var s = { id: c, name: COMP[c].name, tone: COMP[c].tone, points: p };
      if (!COMP[c].wire) {
        s.join = p.length > 1;
        if (p.length >= 3) s.note = "curves up";
      } else if (p.length >= 2) {
        s.fit = "origin"; s.extend = true;
        if (c === active) s.slope = { dx: "ΔI", dy: "ΔV", name: "gradient R", unit: "Ω" };
        else s.note = "R = " + gradText(c);
      }
      series.push(s);
    });
    g.set({ series: series, marker: last ? { x: last.I, y: last.V, label: last.lab, tone: "amber" } : null });

    var total = count("constantan") + count("copper") + count("lamp");
    var badge = document.getElementById("vi-badge");
    if (badge) { badge.textContent = total + (total === 1 ? " point" : " points"); badge.classList.toggle("wait", !total); }

    var note = document.getElementById("vi-note");
    if (note) {
      var msg;
      if (!total) msg = "Tap <b>Take reading</b> on the bench. Each reading lands here as a dot; two or more give you a best-fit line through the origin.";
      else if (count("lamp") >= 3) msg = "The lamp's points <b>curve upwards</b>: V ÷ I keeps growing because the filament heats up as the current rises, so the lamp is <b>non-ohmic</b>.";
      else if (count("constantan") >= 2) msg = "A <b>straight line through the origin</b>: V ∝ I, so the gradient ΔV ÷ ΔI is the resistance, <b>R ≈ " + gradText("constantan") + "</b>. Now try copper or the filament lamp.";
      else if (count("copper") >= 2) msg = "Copper's line is almost flat: its resistance is tiny (<b>R ≈ " + gradText("copper") + "</b>), so the same current needs only a small p.d.";
      else msg = "Keep recording. A straight line needs at least two points.";
      note.innerHTML = msg;
    }
  }

  document.addEventListener("l1:bench", function (e) {
    var d = e.detail || {};
    if (d.I == null || !d.comp || !rec[d.comp]) return;
    rec[d.comp][+d.I.toFixed(3)] = [d.I, +(+d.V).toFixed(3)];
    active = d.comp;
    last = { I: d.I, V: d.V, lab: COMP[d.comp].name.split(" ")[0] };
    paint();
  });
  document.addEventListener("l1:bench-reset", function () {
    rec = { constantan: {}, copper: {}, lamp: {} }; active = "constantan"; last = null; paint();
  });

  paint();
})();
