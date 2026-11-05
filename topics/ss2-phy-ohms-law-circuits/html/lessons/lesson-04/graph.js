/* Lesson 04 · Live design graph — follows the bench.
   Ammeter tab:   R_s = I_g R_g / (I − I_g)   (hyperbola: bigger range → tinier shunt)
   Voltmeter tab: R_m = V / I_g − R_g         (straight line, gradient 1/I_g, intercept −R_g)
   The curve is drawn for the galvanometer now on the bench (its R_g and I_g). The x-axis is fixed
   to the bench slider's span, so dragging the range slides the design dot along the curve.
   Driven by the l4:bench / l4:bench-record CustomEvents from bench.js. */
(function () {
  "use strict";
  var el = document.getElementById("rs-graph");
  if (!el || !window.StudyGraph) return;

  // x-axis levels (bench sliders: 1–10 A, 5–100 V); the range sits at ≤ ~83% of the axis
  var LEVELS = { ammeter: [[2.5, 3], [5, 6], [10, 12]], voltmeter: [[16, 20], [40, 50], [100, 120]] };
  function pickLevel(mode, r) {
    var L = LEVELS[mode];
    for (var i = 0; i < L.length; i++) if (r <= L[i][0] + 1e-9) return L[i][1];
    return L[L.length - 1][1];
  }
  var logged = [];                                 // every design the learner logs
  var cur = window.StudyScenes && window.StudyScenes.bench ? snap(window.StudyScenes.bench.state()) : null;

  var g = StudyGraph.create(el, {
    theme: "paper",
    x: { label: "Ammeter range I", unit: "A", min: 0, max: 6 },
    y: { label: "Shunt Rₛ", unit: "mΩ", min: 0, max: 250 },
    aria: "Graph of the shunt resistance needed against the ammeter range"
  });

  function snap(s) {   // bench.state() → same shape as the l4:bench event detail
    var Ig = s.Ig_mA / 1000, amm = s.mode === "ammeter";
    return { mode: s.mode, Rg: s.Rg, Ig: Ig, Vg: Ig * s.Rg, range: amm ? s.targetI : s.targetV, Rs: s.Rs, Rm: s.Rm, Rtot: s.Rtot, share: s.bypassPct, valid: s.valid !== false, trial: s.trial };
  }

  // smallest "nice" number ≥ v (1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8 × 10^n)
  function niceCeil(v) {
    var p = Math.pow(10, Math.floor(Math.log10(v))), f = v / p;
    var steps = [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10];
    for (var i = 0; i < steps.length; i++) if (f <= steps[i] + 1e-9) return steps[i] * p;
    return 10 * p;
  }
  function num(v, n) {   // ≥ 100 → whole number (thin-space groups from 10 000); else n s.f.
    if (!isFinite(v)) return "–";
    if (Math.abs(v) >= 100) { var r = Math.round(v).toString(); return Math.abs(v) >= 10000 ? r.replace(/\B(?=(\d{3})+(?!\d))/g, " ") : r; }
    var q = +v.toPrecision(n);   // 99.99 → 1.0e+2 otherwise
    return Math.abs(q) >= 100 ? String(Math.round(q)) : v.toPrecision(n);
  }
  function amps(I) { return I < 1 ? String(+(I * 1000).toPrecision(3)) + " mA" : I.toPrecision(2) + " A"; }
  function rangeTxt(d) { return d.mode === "ammeter" ? d.range.toFixed(1) + " A" : (d.range < 100 ? d.range.toFixed(1) : d.range.toFixed(0)) + " V"; }
  function sameCoil(a, b) { return Math.abs(a.Rg - b.Rg) < 1e-9 && Math.abs(a.Ig - b.Ig) < 1e-12; }

  function paint() {
    if (!cur) return;
    var d = cur, amm = d.mode === "ammeter", Ig = d.Ig, Rg = d.Rg, Vg = d.Vg;
    // x-axis "zoom level": steps only when the range crosses a threshold, so dragging the range
    // slider slides the dot along a still curve most of the time
    var xMax = pickLevel(d.mode, d.range), series, marker = null, yMax, k, unit;
    // NB: SVG text cannot show the page's _x → <sub> notation, so graph strings use Rₛ / Rₘ and no "_"
    if (amm) {
      // tall enough that the curve enters at I ≈ xMax/6 and the dot sits low-right
      yMax = 1.12 * Vg / (xMax / 6 - Ig);
      unit = yMax < 1 ? "mΩ" : "Ω"; k = yMax < 1 ? 1000 : 1;   // mΩ keeps tick labels short on a phone
      yMax = niceCeil(yMax * k);
      series = [{
        id: "rs", name: "Shunt needed with this coil", tone: "teal",
        fn: function (I) { return I > Ig ? k * Ig * Rg / (I - Ig) : NaN; },
        fnRange: [Ig + k * Vg / (1.5 * yMax), xMax]
      }];
      if (d.valid) marker = { x: d.range, y: d.Rs * k, label: "Rₛ = " + num(d.Rs, 3) + " Ω", tone: "amber" };
    } else {
      var top = xMax / Ig - Rg;
      unit = top < 1000 ? "Ω" : "kΩ"; k = top < 1000 ? 1 : 0.001;
      yMax = niceCeil(top * k);
      series = [{
        id: "rm", name: "Multiplier needed with this coil", tone: "violet",
        fn: function (V) { return k * (V / Ig - Rg); },
        fnRange: [Math.min(Vg, xMax), xMax],
        note: "gradient " + num(1 / Ig, 3) + " Ω per V"
      }];
      if (d.valid) marker = { x: d.range, y: d.Rm * k, label: "Rₘ = " + num(d.Rm, 3) + " Ω", tone: "amber" };
    }

    // logged designs made with this same galvanometer sit on this curve
    var pts = logged.filter(function (r) { return r.mode === d.mode && sameCoil(r, d) && r.range <= xMax; }).map(function (r) {
      return [r.range, k * (amm ? r.Rs : r.Rm)];
    });
    var others = logged.filter(function (r) { return !(r.mode === d.mode && sameCoil(r, d)); }).length;
    if (pts.length) series.push({ id: "log", name: "Your logged designs (this coil)", tone: "pink", points: pts });

    g.set({
      x: amm ? { label: "Ammeter range I", unit: "A", min: 0, max: xMax, step: null } : { label: "Voltmeter range V", unit: "V", min: 0, max: xMax, step: null },
      y: { label: amm ? "Shunt Rₛ" : "Multiplier Rₘ", unit: unit, min: 0, max: yMax, step: null },
      series: series,
      guides: [],
      marker: marker,
      aria: (amm ? "Graph of shunt resistance against ammeter range" : "Graph of multiplier resistance against voltmeter range") +
        " for a galvanometer of coil resistance " + Rg + " ohms and full-scale current " + amps(Ig)
    });

    // tabs + title
    Array.prototype.forEach.call(document.querySelectorAll("#rs-card [data-gmode]"), function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-gmode") === d.mode ? "true" : "false");
    });
    var title = document.getElementById("rs-title");
    if (title) title.innerHTML = amm ? "Shunt R<sub>s</sub> against ammeter range I" : "Multiplier R<sub>m</sub> against voltmeter range V";

    var badge = document.getElementById("rs-badge");
    if (badge) { badge.textContent = logged.length + " logged"; badge.classList.toggle("wait", !logged.length); }

    var stats = document.getElementById("rs-stats");
    if (stats) {
      var rows = [
        ["Coil R_g", Rg.toFixed(1) + " Ω"],
        ["Full scale I_g", amps(Ig)],
        ["V_g = I_g R_g", num(Vg, 3) + " V"]
      ];
      if (amm) rows.push(["Shunt R_s", d.valid ? num(d.Rs, 3) + " Ω" : "–"], ["Through shunt", d.valid ? d.share.toFixed(1) + "%" : "–"], ["Meter R_g∥R_s", d.valid ? num(d.Rtot, 3) + " Ω" : "–"]);
      else rows.push(["Multiplier R_m", d.valid ? num(d.Rm, 3) + " Ω" : "–"], ["P.d. across R_m", d.valid ? d.share.toFixed(1) + "%" : "–"], ["Meter R_g + R_m", d.valid ? num(d.Rtot, 3) + " Ω" : "–"]);
      stats.innerHTML = rows.map(function (r) { return '<div class="gc-stat"><span>' + r[0] + "</span><b>" + r[1] + "</b></div>"; }).join("");
    }

    var note = document.getElementById("rs-note");
    if (note) {
      var msg;
      if (!d.valid) {
        msg = amm ? "This range is not bigger than I<sub>g</sub>, so no shunt can work. Raise the range."
                  : "The range V = " + rangeTxt(d) + " is not bigger than V<sub>g</sub> = " + num(Vg, 3) + " V, so no multiplier can work. The line only starts at V = V<sub>g</sub>.";
      } else if (amm) {
        msg = "The shunt is in <b>parallel</b>, so it has the same p.d. as the coil (" + num(Vg, 3) + " V). Only I<sub>g</sub> = " + amps(Ig) +
          " may pass through the coil, so the shunt carries the other " + num(d.range - Ig, 3) + " A (<b>" + d.share.toFixed(1) + "%</b>). That needs a <b>tiny R<sub>s</sub> = " + num(d.Rs, 3) + " Ω</b>. " +
          "The curve falls as I rises: a <b>bigger range needs a smaller shunt</b>.";
      } else {
        msg = "The multiplier is in <b>series</b>, so it carries the same I<sub>g</sub> = " + amps(Ig) + " as the coil. At full scale the coil takes only " + num(Vg, 3) +
          " V, so R<sub>m</sub> must drop the other " + num(d.range - Vg, 3) + " V (<b>" + d.share.toFixed(1) + "%</b>). That needs a <b>large R<sub>m</sub> = " + num(d.Rm, 3) + " Ω</b>. " +
          "Straight line, gradient 1/I<sub>g</sub>: <b>each extra volt of range needs another " + num(1 / Ig, 3) + " Ω</b>. Its intercept is −R<sub>g</sub>, so it meets the V-axis at V = V<sub>g</sub> = " + num(Vg, 3) + " V, where no multiplier is needed.";
      }
      if (others) msg += " <i>" + (others === 1 ? "One logged design uses" : others + " logged designs use") + " a different coil or meter type, so " + (others === 1 ? "it is" : "they are") + " not on this curve.</i>";
      note.innerHTML = msg;
    }
  }

  Array.prototype.forEach.call(document.querySelectorAll("#rs-card [data-gmode]"), function (b) {
    b.addEventListener("click", function () {
      var m = b.getAttribute("data-gmode");
      var bench = window.StudyScenes && window.StudyScenes.bench;
      if (bench && bench.setConfig) bench.setConfig({ mode: m });   // the bench fires l4:bench, which repaints
      else if (cur) { cur.mode = m; paint(); }
    });
  });

  document.addEventListener("l4:bench", function (e) { cur = e.detail; paint(); });
  document.addEventListener("l4:bench-record", function (e) {
    var d = e.detail;
    logged = logged.filter(function (r) { return !(r.mode === d.mode && sameCoil(r, d) && r.range === d.range); });
    logged.push(d);
    paint();
  });

  paint();
})();
