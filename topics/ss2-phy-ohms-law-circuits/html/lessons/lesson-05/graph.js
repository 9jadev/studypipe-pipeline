/* Lesson 05 · Live null-balance graph.
   Tab 1: galvanometer current I_g against jockey position l — the bench's own circuit model drawn
          as a curve, a live marker at the jockey, and the null point l₀ where the curve crosses zero.
   Tab 2: p.d. along the wire from A (V_AJ = k·l, a straight line through the origin) against the
          p.d. it must match (across X for the bridge, the cell for the potentiometer). They meet at l₀.
   Logged readings (📝 button) plot as dots. Redraws are throttled to one per animation frame.
   Note: SVG text must not contain "_" (notation.js would inject <sub> into the SVG). */
(function () {
  "use strict";
  var el = document.getElementById("nb-graph");
  var bench = window.StudyScenes && window.StudyScenes.bench;
  if (!el || !window.StudyGraph || !bench || !bench.snapshot) return;

  var tab = "ig";
  var logs = []; // { key, l, Ig, v }
  var snap = bench.snapshot();
  var raf = 0;

  var g = StudyGraph.create(el, {
    theme: "paper",
    x: { label: "Jockey position l", unit: "cm", min: 0, max: 100, step: 20 },
    y: { label: "Galvanometer current", unit: "mA", min: -30, max: 30, step: 10 },
    aria: "Graph of galvanometer current against jockey position"
  });

  function keyOf(s) { return s.mode + "|" + s.setting; }

  // symmetric y range that holds the whole curve
  function igRange(md) {
    var hi = 0;
    for (var l = 0; l <= 100; l += 2) hi = Math.max(hi, Math.abs(md.Ig(l)));
    var opts = [[5, 2.5], [10, 5], [20, 10], [30, 10], [40, 20], [50, 25]];
    for (var i = 0; i < opts.length; i++) if (hi <= opts[i][0]) return opts[i];
    return opts[opts.length - 1];
  }

  function f2(v) { return v.toFixed(2); }
  function f1(v) { return v.toFixed(1); }
  function igTxt(v) { return Math.abs(v) < 0.005 ? "0.00 mA" : (v > 0 ? "+" : "−") + Math.abs(v).toFixed(2) + " mA"; }

  function refName(s) {
    if (s.kind === "bridge") return "p.d. across X = " + f2(s.vRef) + " V";
    if (s.mode === "pot-e2") return "Cell E₂ (unknown)";
    if (s.mode === "pot-shunt") return "Cell terminal p.d. V (4.0 Ω across it)";
    return s.sym + " = " + f2(s.vRef) + " V";
  }

  function paint() {
    raf = 0;
    var s = snap, md = s.model, key = keyOf(s);
    var mine = logs.filter(function (r) { return r.key === key; });
    var series = [], guides = [], marker;

    if (tab === "ig") {
      var yr = igRange(md);
      series.push({ id: "ig", name: "Current in G (circuit model)", tone: "teal", fn: md.Ig, fnRange: [0, 100] });
      if (s.onWire) {
        series.push({ id: "null", name: "Null point l₀ = " + f1(s.l0) + " cm", tone: "lime", shape: "square", points: [[+s.l0.toFixed(2), 0]] });
        guides.push({ axis: "x", value: s.l0, tone: "lime", label: "l₀ = " + f1(s.l0) + " cm" });
      } else {
        series.push({ id: "none", name: "Never crosses zero: no null point", tone: "crimson", points: [] });
      }
      if (mine.length) series.push({ id: "log", name: "Logged readings", tone: "violet", points: mine.map(function (r) { return [r.l, +r.Ig.toFixed(3)]; }) });
      marker = { x: s.l, y: s.Ig, label: s.balanced ? "NULL" : igTxt(s.Ig), tone: s.balanced ? "lime" : "amber" };
      g.set({
        x: { label: "Jockey position l", unit: "cm", min: 0, max: 100, step: 20 },
        y: { label: "Galvanometer current", unit: "mA", min: -yr[0], max: yr[0], step: yr[1] },
        series: series, guides: guides, marker: marker,
        aria: "Galvanometer current against jockey position; null point at " + f1(s.l0) + " cm"
      });
    } else {
      var vmax = s.kind === "bridge" ? 2 : 3;
      series.push({ id: "vw", name: s.kind === "bridge" ? "Wire p.d. V_AJ = 2.0 V × l/100" : "Wire p.d. V_AJ = k·l (k = " + s.k.toFixed(4) + " V/cm)", tone: "sky", fn: md.vWire, fnRange: [0, 100] });
      series.push({ id: "ref", name: refName(s), tone: "pink", dashed: true, fn: function () { return s.vRef; }, fnRange: [0, 100] });
      if (s.onWire) {
        series.push({ id: "null", name: "They meet at l₀ = " + f1(s.l0) + " cm", tone: "lime", shape: "square", points: [[+s.l0.toFixed(2), +s.vRef.toFixed(4)]] });
        guides.push({ axis: "x", value: s.l0, tone: "lime", label: "l₀ = " + f1(s.l0) + " cm" });
      } else {
        series.push({ id: "none", name: "V_AB = " + f2(s.VAB) + " V is below the cell: lines never meet", tone: "crimson", points: [] });
      }
      if (mine.length) series.push({ id: "log", name: "Logged readings", tone: "violet", points: mine.map(function (r) { return [r.l, +r.v.toFixed(4)]; }) });
      var vNow = md.vWire(s.l);
      marker = { x: s.l, y: vNow, label: f2(vNow) + " V", tone: s.balanced ? "lime" : "amber" };
      g.set({
        x: { label: "Jockey position l", unit: "cm", min: 0, max: 100, step: 20 },
        y: { label: "p.d. from end A", unit: "V", min: 0, max: vmax, step: 0.5 },
        series: series, guides: guides, marker: marker,
        aria: "Potential difference along the wire against jockey position"
      });
    }

    var title = document.getElementById("nb-title");
    if (title) title.textContent = tab === "ig" ? "Galvanometer current against jockey position" : (s.kind === "bridge" ? "Wire p.d. V_AJ and p.d. across X against l" : "Wire p.d. V_AJ and cell p.d. against l");

    var badge = document.getElementById("nb-badge");
    if (badge) {
      badge.textContent = s.balanced ? "NULL · I_g = 0" : mine.length + " logged";
      badge.classList.toggle("wait", !s.balanced && !mine.length);
    }

    var stats = document.getElementById("nb-stats");
    if (stats) {
      var cells = [["l", f1(s.l) + " cm"]];
      if (s.kind === "bridge") cells.push(["100 − l", f1(100 - s.l) + " cm"]);
      else cells.push(["V_AJ = k·l", f2(md.vWire(s.l)) + " V"]);
      cells.push(["I_g", igTxt(s.Ig)]);
      cells.push([s.resultLabel.split(" ")[1] || "Result", s.result.replace(/^.*= /, "")]);
      stats.innerHTML = cells.map(function (c) { return '<div class="gc-stat"><span>' + c[0] + "</span><b>" + c[1] + "</b></div>"; }).join("");
    }

    var note = document.getElementById("nb-note");
    if (note) note.innerHTML = noteFor(s, md);
  }

  function noteFor(s, md) {
    var bridge = s.kind === "bridge";
    if (!s.onWire) {
      return "No balance anywhere: the whole wire only has <b>V_AB = " + f2(s.VAB) + " V</b>, less than the " + (s.mode === "pot-shunt" ? "cell's p.d." : "cell's EMF") + ", so I_g never changes sign. <b>Reduce R_s</b> to raise the driver current and the gradient k.";
    }
    var where = s.l < s.l0 ? "left" : "right";
    if (s.balanced) {
      var why = bridge
        ? "the wire p.d. V_AJ equals the p.d. across X, so B and J are at the same potential. Here X = R₂·l ÷ (100 − l) = <b>" + s.result.replace(/^.*= /, "") + "</b>."
        : "V_AJ = k·l equals the " + (s.mode === "pot-shunt" ? "cell's terminal p.d." : "cell's EMF") + ", so <b>no current is drawn from the cell</b> (no lost volts). " + s.resultLabel.replace(/^\S+ /, "").split(" (")[0] + " gives <b>" + s.result + "</b>.";
      return "<b>Null point.</b> The curve crosses zero at l₀ = " + f1(s.l0) + " cm: " + why + " Tap <b>📝 Log</b> to plot it.";
    }
    var side = tab === "ig"
      ? "I_g is <b>" + (s.Ig < 0 ? "negative" : "positive") + "</b> to the " + where + " of l₀ = " + f1(s.l0) + " cm and swaps sign as you pass it. The needle only reads zero at the crossing."
      : "V_AJ is " + (s.l < s.l0 ? "<b>less</b>" : "<b>more</b>") + " than the " + (bridge ? "p.d. across X" : "cell p.d.") + ", so current flows through G. The lines cross at the balance length l₀ = " + f1(s.l0) + " cm.";
    var tip = bridge && (s.l0 < 30 || s.l0 > 70) ? " Tip: choose R₂ closer to X so l₀ sits near 50 cm (smaller end error)." : "";
    return "Move the jockey to the <b>" + (where === "left" ? "right" : "left") + "</b>. " + side + tip;
  }

  function schedule() { if (!raf) raf = requestAnimationFrame(paint); }

  document.addEventListener("l5:bench", function (e) { if (e.detail) { snap = e.detail; schedule(); } });
  document.addEventListener("bench:record", function (e) {
    var d = e.detail;
    if (!d || !d.model) return;
    var key = keyOf(d);
    logs = logs.filter(function (r) { return !(r.key === key && Math.abs(r.l - d.l) < 0.05); });
    logs.push({ key: key, l: +d.l.toFixed(2), Ig: d.Ig, v: d.model.vWire(d.l) });
    schedule();
  });

  var tabs = document.getElementById("nb-tabs");
  if (tabs) tabs.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("button[data-tab]");
    if (!b) return;
    tab = b.getAttribute("data-tab");
    tabs.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
    schedule();
  });

  paint();
})();
