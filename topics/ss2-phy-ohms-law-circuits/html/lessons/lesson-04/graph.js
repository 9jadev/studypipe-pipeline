/* Lesson 04 · live design graph (window.StudyGraph) — follows the bench.
   Ammeter: R_s = I_g R_g / (I − I_g) — a smooth curve that falls steeply as the range I rises.
   Voltmeter: R_m = V / I_g − R_g — a straight line, gradient 1/I_g.
   Driven by the l4:bench CustomEvent from bench.js. */
(function () {
  "use strict";
  var el = document.getElementById("rs-graph");
  var D = window.L04;
  if (!el || !window.StudyGraph || !D) return;

  var IG = D.IG, RG = D.RG, VG = IG * RG;
  var cur = { conv: "ammeter", target: 3.0 };

  var g = StudyGraph.create(el, {
    theme: "paper",
    x: { label: "Ammeter range I", unit: "A", min: 0, max: 5 },
    y: { label: "Shunt Rₛ", unit: "Ω", min: 0, max: 0.3 },
    aria: "Graph of the resistor needed against the meter range for a 15 mA, 18 ohm coil"
  });

  function num(v, n) { return isFinite(v) ? (+v.toPrecision(n || 3)).toString() : "–"; }

  function paint() {
    var amm = cur.conv === "ammeter";
    var series, marker, xMax, yMax, xLabel, yLabel, yUnit, k;
    if (amm) {
      xMax = 5; yMax = 0.3; xLabel = "Ammeter range I"; yLabel = "Shunt Rₛ"; yUnit = "Ω";
      series = [{
        id: "rs", name: "Shunt Rₛ needed (15 mA, 18 Ω coil)", tone: "teal",
        fn: function (I) { return I > IG ? IG * RG / (I - IG) : NaN; },
        fnRange: [IG + VG / yMax, xMax]
      }];
      marker = { x: cur.target, y: D.shunt(cur.target), label: "Rₛ = " + num(D.shunt(cur.target)) + " Ω", tone: "amber" };
    } else {
      xMax = 150; var top = xMax / IG - RG; k = 0.001;      // kΩ keeps the axis short
      yMax = Math.ceil(top * k / 2) * 2; xLabel = "Voltmeter range V"; yLabel = "Multiplier Rₘ"; yUnit = "kΩ";
      series = [{
        id: "rm", name: "Multiplier Rₘ needed (15 mA, 18 Ω coil)", tone: "violet",
        fn: function (V) { return k * (V / IG - RG); },
        fnRange: [VG, xMax],
        note: "gradient " + num(1 / IG) + " Ω per volt"
      }];
      marker = { x: cur.target, y: k * D.mult(cur.target), label: "Rₘ = " + num(D.mult(cur.target)) + " Ω", tone: "amber" };
    }
    g.set({
      x: { label: xLabel, unit: amm ? "A" : "V", min: 0, max: xMax },
      y: { label: yLabel, unit: yUnit, min: 0, max: yMax },
      series: series, marker: marker,
      aria: (amm ? "Shunt resistance against ammeter range" : "Multiplier resistance against voltmeter range") + " for a 15 milliamp, 18 ohm coil"
    });
    Array.prototype.forEach.call(document.querySelectorAll("#rs-card [data-gmode]"), function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-gmode") === cur.conv));
    });
    var title = document.getElementById("rs-title");
    if (title) title.innerHTML = amm ? "Shunt R<sub>s</sub> against ammeter range I" : "Multiplier R<sub>m</sub> against voltmeter range V";
    var note = document.getElementById("rs-note");
    if (note) {
      note.innerHTML = amm
        ? "The shunt is in <b>parallel</b> with the coil, so it carries the whole extra current (I − I<sub>g</sub>). The curve <b>falls steeply</b> as the range rises: a bigger ammeter needs a <b>smaller</b> shunt. At 3.0 A, R<sub>s</sub> = 0.0905 Ω."
        : "The multiplier is in <b>series</b>, carrying the same 15 mA as the coil. Straight line, gradient 1/I<sub>g</sub>: <b>each extra volt of range needs about 66.7 Ω more</b>. At 40 V, R<sub>m</sub> = 2 650 Ω.";
    }
  }

  Array.prototype.forEach.call(document.querySelectorAll("#rs-card [data-gmode]"), function (b) {
    b.addEventListener("click", function () {
      var m = b.getAttribute("data-gmode");
      var bench = window.StudyScenes && window.StudyScenes.bench;
      if (bench && bench.setConv) bench.setConv(m); else { cur.conv = m; cur.target = m === "ammeter" ? 3.0 : 40.0; paint(); }
    });
  });

  document.addEventListener("l4:bench", function (e) {
    var d = e.detail || {};
    if (d.conv) cur.conv = d.conv;
    if (d.controls) cur.target = d.conv === "ammeter" ? d.controls.rangeA : d.controls.rangeV;
    paint();
  });

  paint();
})();
