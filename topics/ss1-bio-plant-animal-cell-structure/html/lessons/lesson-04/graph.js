/* Lesson 04 · Live graph: % change in mass (y) against concentration (x).
   Draws a smooth, monotone curve through the plotted points (never a straight regression line), a zero line,
   the isotonic marker where the curve crosses 0 %, and a sources-of-error panel with computed effects. */
(function () {
  "use strict";
  var el = document.getElementById("osm-graph");
  if (!el || !window.StudyGraph) return;

  var D = window.L04 || {};
  var TECH = D.techniques || { careful: { name: "Careful technique", tone: "teal", flag: null } };
  var ORDER = ["careful", "unblotted", "overBlotted", "evaporation"];
  var rec = {};   // technique -> { conc: pct }
  ORDER.forEach(function (k) { rec[k] = {}; });
  var lastTech = "careful";

  var g = StudyGraph.create(el, {
    theme: "paper",
    x: { label: "Concentration of sucrose", unit: "mol dm⁻³", min: 0, max: 1.1, step: 0.2, decimals: 1 },
    y: { label: "% change in mass", unit: "%", min: -20, max: 20, step: 5, decimals: 0 },
    aria: "Graph of percentage change in mass against sucrose concentration for the potato strips, drawn as a smooth curve that crosses zero near 0.34 mol per decimetre cubed"
  });

  // ---- monotone cubic (Fritsch-Carlson), the same curve family as the kit and the hub explorer ----
  function tangents(xs, ys) {
    var n = xs.length, d = [], m = [], k;
    for (k = 0; k < n - 1; k++) d[k] = (ys[k + 1] - ys[k]) / (xs[k + 1] - xs[k]);
    m[0] = d[0]; m[n - 1] = d[n - 2];
    for (k = 1; k < n - 1; k++) m[k] = (d[k - 1] * d[k] <= 0) ? 0 : (d[k - 1] + d[k]) / 2;
    for (k = 0; k < n - 1; k++) {
      if (d[k] === 0) { m[k] = 0; m[k + 1] = 0; continue; }
      var a = m[k] / d[k], b = m[k + 1] / d[k], s = a * a + b * b;
      if (s > 9) { var t = 3 / Math.sqrt(s); m[k] = t * a * d[k]; m[k + 1] = t * b * d[k]; }
    }
    return m;
  }
  function curveThrough(pts) {
    if (pts.length < 2) return null;
    var xs = pts.map(function (p) { return p[0]; }), ys = pts.map(function (p) { return p[1]; });
    var m = tangents(xs, ys), n = xs.length;
    return function (x) {
      var k = 0;
      while (k < n - 2 && x > xs[k + 1]) k++;
      var h = xs[k + 1] - xs[k], t = (x - xs[k]) / h, t2 = t * t, t3 = t2 * t;
      return (2 * t3 - 3 * t2 + 1) * ys[k] + (t3 - 2 * t2 + t) * h * m[k] + (-2 * t3 + 3 * t2) * ys[k + 1] + (t3 - t2) * h * m[k + 1];
    };
  }
  function zeroOf(f, pts) {
    for (var k = 0; k + 1 < pts.length; k++) {
      if (pts[k][1] > 0 && pts[k + 1][1] <= 0) {
        var lo = pts[k][0], hi = pts[k + 1][0];
        for (var i = 0; i < 50; i++) { var mid = (lo + hi) / 2; if (f(mid) > 0) lo = mid; else hi = mid; }
        return (lo + hi) / 2;
      }
    }
    return null;
  }
  function pointsOf(t) {
    return Object.keys(rec[t]).map(Number).sort(function (a, b) { return a - b; }).map(function (c) { return [c, rec[t][c]]; });
  }
  function signed(v, d) { return (v > 0 ? "+" : v < 0 ? "−" : "") + Math.abs(v).toFixed(d); }

  function paint() {
    var series = [], total = 0, marker = null, isoText = "–", noteIso = null;
    ORDER.forEach(function (t) {
      var p = pointsOf(t);
      total += p.length;
      if (!p.length) return;
      var s = { id: t, name: TECH[t].name, tone: TECH[t].tone, points: p };
      var f = curveThrough(p);
      if (f) { s.fn = f; s.fnRange = [p[0][0], p[p.length - 1][0]]; s.dashed = t !== "careful"; }
      series.push(s);
      if (t === lastTech) {
        var z = f ? zeroOf(f, p) : null;
        if (z != null) { marker = { x: z, y: 0, label: "Isotonic ≈ " + z.toFixed(2), tone: "amber", labelPos: "below" }; isoText = z.toFixed(2) + " mol dm⁻³"; noteIso = z; }
      }
    });
    g.set({
      series: series,
      guides: [{ axis: "y", value: 0, label: "0 % (no change)", tone: "muted" }],
      marker: marker
    });

    var badge = document.getElementById("g-badge");
    if (badge) { badge.textContent = total + (total === 1 ? " point" : " points"); badge.classList.toggle("wait", !total); }

    var stats = document.getElementById("g-stats");
    if (stats) {
      var cur = pointsOf(lastTech), all = cur.map(function (q) { return q[1]; });
      var h = '<div class="gc-stat"><span>Points (this run)</span><b>' + cur.length + ' of 6</b></div>';
      h += '<div class="gc-stat"><span>Isotonic point</span><b>' + isoText + '</b></div>';
      if (all.length) {
        h += '<div class="gc-stat"><span>Biggest gain</span><b>' + signed(Math.max.apply(null, all), 1) + ' %</b></div>';
        h += '<div class="gc-stat"><span>Biggest loss</span><b>' + signed(Math.min.apply(null, all), 1) + ' %</b></div>';
      }
      stats.innerHTML = h;
    }

    var note = document.getElementById("g-note");
    if (note) {
      var cp = pointsOf(lastTech), n = cp.length, msg;
      if (!total) msg = "Weigh, leave and re-weigh the strips on the bench. Each tube adds one dot here, and from three dots a smooth curve is drawn through them.";
      else if (n < 3) msg = "Keep going: you need at least three dots before a curve can be drawn. Complete all six tubes.";
      else if (noteIso == null) msg = "Every dot so far is on the same side of the 0 % line. Re-weigh more tubes to find where the curve crosses zero.";
      else if (lastTech === "careful") msg = "The dots fall along a <b>curve</b>, so we draw a smooth curve of best fit, never a straight line. It crosses the <b>0 % line at about " + noteIso.toFixed(2) + " mol dm⁻³</b>: the isotonic point. Above it water enters the strip; below it water leaves.";
      else msg = "With <b>" + TECH[lastTech].name.toLowerCase() + "</b> the curve crosses zero at about <b>" + noteIso.toFixed(2) + " mol dm⁻³</b> instead of 0.34. The error shifted the whole curve and moved your answer, which is why technique matters.";
      note.innerHTML = msg;
    }
    paintErrors();
  }

  // ---- sources of error: each row shows its direction and the effect the model gives ----
  function effectText(key) {
    if (!window.OsmometerKit || !OsmometerKit.model) return "";
    var M = OsmometerKit.model, flags = { unblotted: false, overBlotted: false, evaporation: false };
    flags[key] = true;
    function pct(m0, c) { var m1 = M.finalMass(m0, c, 30, flags); return Math.round((m1 - m0) / m0 * 1000) / 10; }
    function base(m0, c) { var m1 = M.finalMass(m0, c, 30, {}); return Math.round((m1 - m0) / m0 * 1000) / 10; }
    var a = [2.50, 0.0], b = [2.54, 1.0];
    return "0.0 tube: " + signed(base(a[0], a[1]), 1) + " → " + signed(pct(a[0], a[1]), 1) + " %  ·  1.0 tube: " + signed(base(b[0], b[1]), 1) + " → " + signed(pct(b[0], b[1]), 1) + " %";
  }
  function paintErrors() {
    var box = document.getElementById("err-panel");
    if (!box || !D.errors) return;
    var flag = TECH[lastTech] ? TECH[lastTech].flag : null;
    var h = "<h5>Sources of error and which way they push your result</h5>";
    D.errors.forEach(function (e) {
      h += '<div class="err-item' + (flag === e.key ? " on" : "") + '"><b>' + e.head + '</b><span class="dir">' + e.dir + '</span><p>' + e.text + '</p><span class="fx">' + effectText(e.key) + '</span></div>';
    });
    h += '<p class="gc-note">Try each technique on the bench (the Technique buttons), run the six tubes again, and watch the dashed curve move away from the careful one.</p>';
    box.innerHTML = h;
  }
  // phone: each row shows one line; tap it to read the rest
  document.addEventListener("click", function (e) {
    var it = e.target.closest && e.target.closest("#err-panel .err-item");
    if (it) it.classList.toggle("open");
  });

  document.addEventListener("l4:bench", function (e) {
    var d = e.detail || {};
    if (!d.rows) return;
    d.rows.forEach(function (r) {
      var t = (d.tech && d.tech[r.i]) || d.technique || "careful";
      if (!rec[t]) return;
      if (r.pct != null && r.done) { rec[t][r.conc] = r.pct; lastTech = t; }
    });
    paint();
  });
  document.addEventListener("l4:bench-tech", function (e) {
    var t = (e.detail || {}).tech;
    if (t && rec[t]) { lastTech = t; paint(); }
  });
  document.addEventListener("l4:bench-reset", function () {
    // a new run replaces the runs for the technique now selected; other techniques stay for comparison
    rec[lastTech] = {};
    paint();
  });

  window.L04 = window.L04 || {};
  window.L04.graph = { curveThrough: curveThrough, zeroOf: zeroOf, repaint: paint };
  paint();
})();
