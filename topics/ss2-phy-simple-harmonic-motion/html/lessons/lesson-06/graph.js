/* Lesson 06 · Live graph (window.StudyGraph): amplitude A (y) against cycle number (x).
   One series per medium, dots joined in order (no fit) — three decaying curves.
   Driven by l6:bench (detail.amps from MassSpringKit.recordAmplitude()) and l6:bench-reset. */
(function () {
  "use strict";
  var el = document.getElementById("graph-decay");
  if (!el || !window.StudyGraph) return;

  var SER = {
    air: { name: "Air (×0.97 per cycle)", tone: "sky" },
    water: { name: "Water (×0.75 per cycle)", tone: "teal" },
    oil: { name: "Oil (×0.40 per cycle)", tone: "amber" }
  };
  var rec = {}, A0 = 5;

  var g = StudyGraph.create(el, {
    theme: "paper",
    x: { label: "Cycle number", unit: "", min: 0, max: 5, step: 1 },
    y: { label: "Amplitude A", unit: "cm", min: 0, max: 6, step: 1 },
    aria: "Graph of amplitude in centimetres (vertical) against cycle number (horizontal) for air, water and oil"
  });

  function paint() {
    var series = [], keys = Object.keys(rec);
    ["air", "water", "oil"].forEach(function (m) {
      if (!rec[m]) return;
      series.push({ id: m, name: SER[m].name, tone: SER[m].tone, join: true, points: rec[m].map(function (a, i) { return [i, a]; }) });
    });
    var top = Math.max(6, Math.ceil(A0 + 0.5));
    g.set({ y: { label: "Amplitude A", unit: "cm", min: 0, max: top, step: 1 }, series: series });
    var badge = document.getElementById("graph-badge");
    if (badge) { badge.textContent = keys.length + " of 3 media"; badge.classList.toggle("wait", !keys.length); }
    var note = document.getElementById("graph-note");
    if (!note) return;
    if (!keys.length) note.innerHTML = "Choose <b>Damping</b>, release in a medium, then <b>Record</b>. Each medium lands here as a joined line of six points.";
    else if (keys.length < 3) note.innerHTML = "Each curve falls by the <b>same ratio every cycle</b>, so it drops steeply at first and then levels towards zero. Record the other " + (3 - keys.length) + " medium" + (3 - keys.length > 1 ? "s" : "") + " to compare.";
    else note.innerHTML = "Three decaying curves: air hardly loses anything (light damping), water loses a quarter of the amplitude each cycle, oil kills the motion in three or four cycles. Energy goes as A², so after one cycle in water only 0.75² ≈ 56 % of the energy is left; the rest became heat in the liquid.";
  }

  document.addEventListener("l6:bench", function (e) {
    var d = e.detail || {};
    if (!d.amps || !d.medium || !SER[d.medium]) return;
    rec[d.medium] = d.amps.slice(0, 6);
    if (d.A0) A0 = +d.A0;
    paint();
  });
  document.addEventListener("l6:bench-reset", function () { rec = {}; A0 = 5; paint(); });

  paint();
})();
