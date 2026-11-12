/* Lesson 07 · live graph: amplitude A (cm) against riding speed v (km/h) on the ridge rig.
   Points = rows recorded by bench.js (l7:bench, from MassSpringKit reading()), one series per setting.
   Theory curves = MassSpringKit.model.okada (200 kg leaking / healthy) and the dashed lift-off threshold
   g/(2πf)² with the driving f = v/d. No typed numbers are plotted. */
(function () {
  "use strict";
  var el = document.getElementById("graph-av");
  if (!el || !window.StudyGraph) return;

  var M = window.MassSpringKit && MassSpringKit.model && MassSpringKit.model.okada;
  var D = 2.5, G = 9.8;
  function A(kmh, mass, zeta) { return M ? M(kmh, mass, zeta).A * 100 : NaN; }
  function th(kmh) { var f = kmh / 3.6 / D; return f > 0 ? G / Math.pow(2 * Math.PI * f, 2) * 100 : Infinity; }

  var SERIES = {
    "200L": { name: "200 kg · leaking", tone: "crimson" },
    "200H": { name: "200 kg · healthy", tone: "teal" },
    "250L": { name: "250 kg · leaking", tone: "violet" },
    "250H": { name: "250 kg · healthy", tone: "sky" }
  };
  var pts = {}, marker = null;

  var g = StudyGraph.create(el, {
    theme: "paper",
    x: { label: "Speed v", unit: "km/h", min: 0, max: 36, step: 6 },
    y: { label: "Amplitude A", unit: "cm", min: 0, max: 12, step: 2 },
    aria: "Graph of bounce amplitude against riding speed over the ridges: a sharp peak at 18 km/h for the leaking damper, a low hump for the healthy damper, and a dashed lift-off threshold curve"
  });

  function paint() {
    var series = [
      { id: "th", name: "lift-off threshold g/(2πf)²", tone: "amber", fn: th, fnRange: [6, 36], dashed: true },
      { id: "tl", name: "model · leaking", tone: "crimson", fn: function (x) { return A(x, 200, 0.05); }, fnRange: [1, 36] },
      { id: "th2", name: "model · healthy", tone: "teal", fn: function (x) { return A(x, 200, 0.30); }, fnRange: [1, 36] }
    ];
    Object.keys(pts).forEach(function (k) {
      var s = SERIES[k] || { name: k, tone: "muted" };
      series.push({ id: "p" + k, name: s.name + " (your rides)", tone: s.tone, points: pts[k].slice(), join: pts[k].length > 1 });
    });
    g.set({ series: series, guides: [{ axis: "x", value: 18, tone: "crimson", label: "18 km/h" }], marker: marker });
  }

  document.addEventListener("l7:bench", function (e) {
    var d = e.detail || {};
    if (d.rig !== "ridge" || !d.row) return;
    var r = d.row;
    pts[r.cfg] = (pts[r.cfg] || []).filter(function (p) { return p[0] !== r.speed_kmh; });
    pts[r.cfg].push([r.speed_kmh, +(r.A_cm.toFixed(1))]);
    marker = { x: r.speed_kmh, y: +(r.A_cm.toFixed(1)), label: r.display.A + " cm" + (r.lift ? " · lifts!" : ""), tone: r.lift ? "crimson" : "amber" };
    var n = 0; Object.keys(pts).forEach(function (k) { n += pts[k].length; });
    var badge = document.getElementById("graph-badge");
    if (badge) { badge.textContent = n + " ride" + (n > 1 ? "s" : "") + " plotted"; badge.classList.remove("wait"); }
    var note = document.getElementById("graph-note");
    if (note) note.innerHTML = "At <b>" + r.speed_kmh + " km/h</b> the ridges push at f = " + r.display.f + " Hz (f₀ = " + r.f0.toFixed(2) + " Hz) and A = <b>" + r.display.A + " cm</b> against a threshold of " + r.th_cm.toFixed(1) + " cm, so the crates " + (r.lift ? "<b>lift off</b>" : "stay on") + ". " +
      (r.lift ? "The point sits above the dashed curve: resonance." : "The peak is where f = f₀; far from it the bounce is small, however fast you go.");
    paint();
  });
  document.addEventListener("l7:bench-reset", function () {
    pts = {}; marker = null;
    var badge = document.getElementById("graph-badge"); if (badge) { badge.textContent = "no rows yet"; badge.classList.add("wait"); }
    paint();
  });

  paint();
})();
