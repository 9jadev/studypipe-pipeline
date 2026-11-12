/* Lesson 05 · Live T²–l graph (StudyGraph). A point is plotted when the learner's T² for that row is accepted
   (lesson.js emits l5:row with the kit's T² for that length). Best-fit line through the origin, slope triangle
   on the drawn line, g = 4π²/slope. Class data: slope ≈ 4.03 s² m⁻¹ → g = 9.79 m s⁻². */
(function () {
  "use strict";
  var el = document.getElementById("graph-t2l");
  if (!el || !window.StudyGraph) return;
  var FOURPI2 = 4 * Math.PI * Math.PI;
  var rec = {}, last = null;

  var g = StudyGraph.create(el, {
    theme: "paper",
    x: { label: "Length l", unit: "m", min: 0, max: 1.1, step: 0.2, decimals: 1 },
    y: { label: "T²", unit: "s²", min: 0, max: 4.5, step: 1, decimals: 0 },
    ratio: 0.62,
    aria: "Graph of T squared (vertical) against effective length l (horizontal) for the pendulum readings"
  });

  function pts() { return Object.keys(rec).sort(function (a, b) { return +a - +b; }).map(function (k) { return rec[k]; }); }

  function paint() {
    var p = pts(), s = { id: "class", name: "Your readings", tone: "teal", points: p };
    if (p.length >= 2) { s.fit = "origin"; s.extend = true; s.slope = { dx: "Δl", dy: "ΔT²", name: "slope", unit: "s² m⁻¹", dxDec: 3, dyDec: 3 }; }
    g.set({ series: [s], marker: last ? { x: last[0], y: last[1], label: "l " + last[0].toFixed(3), tone: "amber" } : null });
    var fit = p.length >= 2 ? StudyGraph.leastSquares(p, true) : null;
    var badge = document.getElementById("graph-badge"), note = document.getElementById("graph-note");
    if (badge) {
      badge.textContent = fit ? "g = " + (FOURPI2 / fit.m).toFixed(2) + " m s⁻²" : p.length + (p.length === 1 ? " point" : " points");
      badge.classList.toggle("wait", !fit);
    }
    if (note) {
      if (!p.length) note.innerHTML = "Fill a row of the table correctly and its point lands here. Two or more points give a best-fit line through the origin.";
      else if (!fit) note.innerHTML = "One point. Complete another row to draw the line.";
      else {
        var dT = fit.m * 0.600;
        note.innerHTML = "Large triangle on the drawn line, l = 0.400 → 1.000 m: ΔT² = " + (fit.m * 1.0).toFixed(3) + " − " + (fit.m * 0.4).toFixed(3) +
          " = " + dT.toFixed(3) + " s², Δl = 0.600 m; slope = " + dT.toFixed(3) + " ÷ 0.600 = <b>" + fit.m.toFixed(2) + " s² m⁻¹</b>; g = 39.48 ÷ " + fit.m.toFixed(2) +
          " = <b>" + (FOURPI2 / fit.m).toFixed(2) + " m s⁻²</b>." + (p.length < 5 ? " Add all five lengths." : " T² ∝ l.");
      }
    }
    document.dispatchEvent(new CustomEvent("l5:graph", { detail: { n: p.length, slope: fit ? fit.m : null, g: fit ? FOURPI2 / fit.m : null } }));
  }

  document.addEventListener("l5:row", function (e) {
    var d = e.detail || {};
    if (d.l == null || d.T2 == null) return;
    rec[(+d.l).toFixed(3)] = [+d.l, +(+d.T2).toFixed(3)];
    last = rec[(+d.l).toFixed(3)];
    paint();
  });
  document.addEventListener("l5:table-reset", function () { rec = {}; last = null; paint(); });

  window.L05Graph = { paint: paint, points: pts };
  paint();
})();
