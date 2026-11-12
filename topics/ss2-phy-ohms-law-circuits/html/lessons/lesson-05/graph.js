/* Lesson 05 · live graph: p.d. along the potentiometer wire against jockey length.
   V = kl is a straight line through the origin (k = 0.0200 V cm⁻¹ on the school driver), so a 1.50 V cell
   balances at 75.0 cm. The marker follows the jockey whenever the bench is in potentiometer mode.
   Model values only (k from the bench reading); no typed numbers plotted. */
(function () {
  "use strict";
  var el = document.getElementById("pot-graph");
  if (!el || !window.StudyGraph) return;

  var K = 0.0200;                         // school driver gradient, V cm⁻¹
  var PTS = [20, 40, 60, 75, 80, 100].map(function (l) { return [l, +(K * l).toFixed(3)]; });
  var marker = null;                      // live jockey point when on the potentiometer

  var g = StudyGraph.create(el, {
    theme: "paper",
    x: { label: "Jockey length l", unit: "cm", min: 0, max: 100, step: 20 },
    y: { label: "p.d. V_AJ", unit: "V", min: 0, max: 2, step: 0.5 },
    aria: "Graph of the potential difference along the wire against the jockey length; a straight line through the origin"
  });

  function paint() {
    g.set({
      series: [{
        id: "vkl", name: "V = kl (k = 0.0200 V cm⁻¹)", tone: "teal",
        points: PTS, fit: "origin", extend: true,
        slope: { dx: "Δl", dy: "ΔV", unit: "V cm⁻¹", name: "k" }
      }],
      guides: [{ axis: "x", value: 75, tone: "lime", label: "1.50 V at 75.0 cm" }],
      marker: marker
    });
    var note = document.getElementById("graph-note");
    if (note) {
      note.innerHTML = marker
        ? "The jockey is at <b>" + marker.x.toFixed(1) + " cm</b>, where V_AJ = <b>" + marker.y.toFixed(2) + " V</b>. The line is straight through the origin, so V ∝ l. At balance the wire p.d. equals the cell's EMF and no current is drawn."
        : "A steady current in a uniform wire makes V = kl, a straight line through the origin. The school driver gives k = 0.0200 V cm⁻¹, so a 1.50 V cell balances at 75.0 cm.";
    }
  }

  document.addEventListener("l5:bench", function (e) {
    var d = e.detail || {};
    if (d.sub === "potentiometer" && d.k_cal) {
      var k = d.k_cal, l = d.l != null ? d.l : 0, v = k * l;
      marker = { x: l, y: +v.toFixed(3), label: v.toFixed(2) + " V", tone: d.balanced ? "lime" : "amber" };
    } else {
      marker = null;                      // bridge mode: show the plain V = kl reference line
    }
    paint();
  });
  document.addEventListener("l5:bench-reset", function () { marker = null; paint(); });

  paint();
})();
