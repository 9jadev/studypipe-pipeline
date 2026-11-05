/* Lesson 02 · Live V–I graph for the cell — intercept = EMF E, |gradient| = internal resistance r */
(function () {
  "use strict";
  var el = document.getElementById("vi-graph");
  if (!el || !window.StudyGraph) return;

  var LETTERS = "ABCDE";
  var rec = {};          // trial index -> [I, V] (key closed)
  var openPt = null;     // [0, E] once the key-open reading is taken
  var cond = "std", pair = null, last = null, view = "near", EMF = 12.0;

  var VIEWS = {
    near: { x: { min: 0, max: 4, step: 0.5 }, y: { min: 6, max: 13, step: 1 } },
    far: { x: { min: 0, max: 11, step: 2 }, y: { min: 0, max: 13, step: 2 } }
  };

  var g = StudyGraph.create(el, {
    theme: "paper",
    x: { label: "Current I", unit: "A", min: 0, max: 4, step: 0.5 },
    y: { label: "Terminal p.d. V", unit: "V", min: 6, max: 13, step: 1 },
    aria: "Graph of terminal potential difference V against current I for the cell"
  });

  // tabs: your readings vs the line extended to the short-circuit current
  var tabs = document.createElement("div");
  tabs.className = "gc-tabs";
  tabs.setAttribute("role", "group");
  tabs.setAttribute("aria-label", "Graph view");
  tabs.innerHTML = '<button type="button" data-v="near" aria-pressed="true">Your readings</button>' +
    '<button type="button" data-v="far" aria-pressed="false">Extend to V = 0</button>';
  el.parentNode.insertBefore(tabs, el);
  tabs.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("button[data-v]");
    if (!b) return;
    view = b.getAttribute("data-v");
    tabs.querySelectorAll("button").forEach(function (q) { q.setAttribute("aria-pressed", q === b ? "true" : "false"); });
    paint();
  });

  function pts() { return Object.keys(rec).sort().map(function (k) { return rec[k]; }); }
  function n() { return Object.keys(rec).length; }
  function fit() { return n() >= 2 ? StudyGraph.leastSquares(pts(), false) : null; }
  function f2(v) { return v.toFixed(2); }

  function paint() {
    var p = pts(), F = fit(), far = view === "far";
    var main = { id: "closed", name: "Key closed", tone: "teal", points: p };
    if (F) {
      main.fit = "line";
      main.extend = true;
      main.yIntercept = "E";
      if (far) { main.xIntercept = "I₀"; main.note = "r = " + f2(Math.abs(F.m)) + " Ω"; }
      else main.slope = { dx: "ΔI", dy: "ΔV", name: "r = |gradient|", unit: "Ω", abs: true };
    }
    var series = [main];
    if (openPt) series.push({ id: "open", name: "Key open (I = 0)", tone: "pink", shape: "square", points: [openPt] });
    if (cond === "wide" && pair && rec[pair[0]] && rec[pair[1]]) {
      series.push({ id: "pair", name: "Two readings " + LETTERS.charAt(pair[0]) + " & " + LETTERS.charAt(pair[1]), tone: "violet", join: true, points: [rec[pair[0]], rec[pair[1]]] });
    }

    var Eline = openPt ? openPt[1] : F ? F.c : null;
    g.set({
      x: VIEWS[view].x,
      y: VIEWS[view].y,
      series: series,
      guides: Eline != null ? [{ axis: "y", value: Eline, tone: "amber" }] : [],
      marker: last && !last.open && !far ? { x: last.I, y: last.V, label: F ? null : "Trial " + last.label, tone: "amber" } : null
    });

    var total = n() + (openPt ? 1 : 0);
    var badge = document.getElementById("vi-badge");
    if (badge) { badge.textContent = total + (total === 1 ? " point" : " points"); badge.classList.toggle("wait", !total); }

    var stats = document.getElementById("vi-stats");
    if (stats) {
      var h = "";
      if (F) {
        var r = Math.abs(F.m);
        h += stat("E = V-intercept", f2(F.c) + " V") + stat("r = |gradient|", f2(r) + " Ω") + stat("I₀ = E ÷ r", (F.c / r).toFixed(1) + " A");
      } else if (total) {
        h += stat(openPt ? "E (key open)" : "E = V-intercept", openPt ? f2(openPt[1]) + " V" : "need 2 pts") + stat("r = |gradient|", "need 2 pts");
      }
      if (cond === "wide" && pair && rec[pair[0]] && rec[pair[1]]) {
        var a = rec[pair[0]], b = rec[pair[1]];
        h += stat("r from 2 readings", f2((a[1] - b[1]) / (b[0] - a[0])) + " Ω");
      }
      stats.innerHTML = h;
    }

    var note = document.getElementById("vi-note");
    if (!note) return;
    var msg;
    if (!total) msg = "Tap <b>Key OPEN</b> to plot the I = 0 reading, then record <b>Trials A–E</b>. Each reading lands here as a dot.";
    else if (!n()) msg = "With the key open no current flows, so there are <b>no lost volts</b>: the voltmeter reads the full EMF, V = E = " + f2(openPt[1]) + " V. This point sits on the V-axis. Now close the key and record Trials A–E.";
    else if (n() === 1) {
      var q = p[0];
      msg = "One reading: V = " + f2(q[1]) + " V at I = " + f2(q[0]) + " A. That is " + f2(EMF - q[1]) + " V below E = " + f2(EMF) + " V: those are the <b>lost volts Ir</b>. Record another trial — a straight line needs at least two points.";
    } else if (far) {
      msg = "Extending the line down to V = 0 gives the <b>short-circuit current</b> I₀ = E ÷ r = " + f2(F.c) + " ÷ " + f2(Math.abs(F.m)) + " = " + (F.c / Math.abs(F.m)).toFixed(1) + " A. Here R = 0, so all of E is lost inside the cell as heat. Never short a real accumulator!";
    } else if (cond === "wide" && pair && rec[pair[0]] && rec[pair[1]]) {
      var a2 = rec[pair[0]], b2 = rec[pair[1]];
      msg = "The violet segment joins Trials " + LETTERS.charAt(pair[0]) + " and " + LETTERS.charAt(pair[1]) + ". Just two readings fix the line: r = (" + f2(a2[1]) + " − " + f2(b2[1]) + ") ÷ (" + f2(b2[0]) + " − " + f2(a2[0]) + ") = " + f2((a2[1] - b2[1]) / (b2[0] - a2[0])) + " Ω, the same as the best-fit gradient.";
    } else {
      var lt = last && !last.open ? last : { I: p[p.length - 1][0], V: p[p.length - 1][1], label: "" };
      msg = "A straight line sloping <b>down</b>: V = E − rI. Where it meets the V-axis (I = 0) is the <b>EMF, E ≈ " + f2(F.c) + " V</b>; the gradient is −r, so <b>r ≈ " + f2(Math.abs(F.m)) + " Ω</b>. " +
        "The gap between the dashed E line and each dot is the lost volts Ir" + (lt.label ? " — for Trial " + lt.label + ", " + f2(EMF - lt.V) + " V at " + f2(lt.I) + " A" : "") + ". More current, bigger gap.";
      if (!openPt) msg += " Tap <b>Key OPEN</b> to check the intercept against a real I = 0 reading.";
      msg += " <i>(This close-up starts the V-axis at 6 V; tap Extend to V = 0 for the full line.)</i>";
    }
    note.innerHTML = msg;
  }

  function stat(k, v) { return '<div class="gc-stat"><span>' + k + "</span><b>" + v + "</b></div>"; }

  document.addEventListener("l1:bench", function (e) {
    var d = e.detail || {};
    if (d.I == null) return;
    if (d.E) EMF = d.E;
    cond = d.cond || "std";
    pair = d.pair || null;
    rec[d.trial] = [+d.I.toFixed(3), +d.V.toFixed(3)];
    last = { I: d.I, V: d.V, label: LETTERS.charAt(d.trial), open: false };
    paint();
  });
  document.addEventListener("l1:bench-cond", function (e) {
    var d = e.detail || {};
    cond = d.cond || "std";
    pair = d.pair || null;
    if (d.open) { openPt = [0, +d.V.toFixed(3)]; last = { open: true }; }
    paint();
  });
  document.addEventListener("l1:bench-reset", function () { rec = {}; openPt = null; cond = "std"; pair = null; last = null; paint(); });

  paint();
})();
