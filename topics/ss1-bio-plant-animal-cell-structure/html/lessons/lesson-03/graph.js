/* Lesson 03 · Live graph: SA:V against cube side L. Plots each calculated cube and draws the smooth 6 / L curve through them (never a straight line). */
(function () {
  "use strict";
  var el = document.getElementById("sv-graph");
  if (!el || !window.StudyGraph) return;

  var rec = {}, last = null;

  var g = StudyGraph.create(el, {
    theme: "paper",
    x: { label: "Cube side L", unit: "mm", min: 0, max: 7, step: 1 },
    y: { label: "SA : V", unit: "mm⁻¹", min: 0, max: 7, step: 1 },
    aria: "Graph of surface area to volume ratio against cube side L for the cubes you have calculated, with the smooth curve 6 divided by L"
  });

  function pts() { return Object.keys(rec).map(Number).sort(function (a, b) { return a - b; }).map(function (k) { return [k, rec[k]]; }); }

  function paint() {
    var p = pts(), series = [];
    if (p.length >= 3) series.push({ id: "curve", name: "Smooth curve: SA : V = 6 ÷ L", tone: "sky", fn: function (x) { return 6 / x; }, fnRange: [0.9, 6.7] });
    series.push({ id: "pts", name: "Your cubes", tone: "teal", points: p });
    g.set({ series: series, marker: last ? { x: last.L, y: last.ratio, label: "L = " + last.L, tone: "amber" } : null });

    var badge = document.getElementById("sv-badge");
    if (badge) { badge.textContent = p.length + (p.length === 1 ? " point" : " points"); badge.classList.toggle("wait", !p.length); }

    var stats = document.getElementById("sv-stats");
    if (stats) {
      stats.innerHTML = p.map(function (q) { return '<div class="gc-stat"><span>L = ' + q[0] + ' mm</span><b>' + q[1].toFixed(1) + ' mm⁻¹</b></div>'; }).join("");
    }

    var note = document.getElementById("sv-note");
    if (note) {
      var msg;
      if (!p.length) msg = "On the <b>cube bench</b>, pick a side L and press <b>Calculate</b>. Each cube lands here as a dot.";
      else if (p.length < 3) msg = "Keep going. A smooth <b>curve</b> (not a straight line) appears after three cubes.";
      else {
        var big = p[p.length - 1], small = p[0];
        msg = "The dots fall on a <b>smooth curve</b> that drops steeply at first and then flattens. As L grows, SA : V = 6 ÷ L gets smaller: " +
          small[1].toFixed(1) + " mm⁻¹ at " + small[0] + " mm down to " + big[1].toFixed(1) + " mm⁻¹ at " + big[0] + " mm. Doubling L halves SA : V. A straight line would be wrong here.";
      }
      note.innerHTML = msg;
    }
  }

  document.addEventListener("l3:bench", function (e) {
    var d = e.detail || {};
    if (d.L == null) return;
    rec[d.L] = d.ratio;
    last = { L: d.L, ratio: d.ratio };
    paint();
  });
  document.addEventListener("l3:bench-reset", function () { rec = {}; last = null; paint(); });

  paint();
})();
