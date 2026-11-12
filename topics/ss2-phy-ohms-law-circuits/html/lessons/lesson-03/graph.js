/* Lesson 03 · Live P–R and η–R graphs. Both are SMOOTH curves (never straight lines):
   load power P = E²R/(R+r)² peaks at R = r, efficiency η = R/(R+r) climbs towards 100 %.
   Measured single-cell points land on the active curve as the bench records them. */
(function () {
  "use strict";
  var el = document.getElementById("load-graph");
  if (!el || !window.StudyGraph || !window.L03) return;

  var E = L03.cell.E, r = L03.cell.r;               // 5.0 V, 0.5 Ω
  var view = "power";
  var P = {}, H = {};                                // measured points keyed by R

  function powerFn(R) { return E * E * R / ((R + r) * (R + r)); }
  function effFn(R) { return 100 * R / (R + r); }

  var g = null;
  function build() {
    var cfg = view === "power"
      ? { y: { label: "Load power P", unit: "W", min: 0, max: 14 }, aria: "Graph of load power P against load resistance R" }
      : { y: { label: "Efficiency η", unit: "%", min: 0, max: 100 }, aria: "Graph of efficiency against load resistance R" };
    g = StudyGraph.create(el, {
      theme: "paper",
      x: { label: "Load R", unit: "Ω", min: 0, max: 4.5 },
      y: cfg.y, aria: cfg.aria
    });
  }

  function pts(store) { return Object.keys(store).sort(function (a, b) { return a - b; }).map(function (k) { return store[k]; }); }

  function paint(last) {
    if (!g) build();
    var isP = view === "power";
    var store = isP ? P : H;
    var series = [
      { id: "theory", name: isP ? "P = E²R/(R+r)²" : "η = R/(R+r)", tone: isP ? "amber" : "teal", fn: isP ? powerFn : effFn, fnRange: [0, 4.5] },
      { id: "pts", name: "your readings", tone: isP ? "pink" : "violet", points: pts(store) }
    ];
    var guides = isP ? [{ axis: "x", value: r, label: "R = r (peak)", tone: "sky" }] : [];
    g.set({
      series: series, guides: guides,
      marker: last ? { x: last.R, y: isP ? last.P : last.eta, label: "R = " + last.R.toFixed(1) + " Ω", tone: "amber" } : null
    });

    var badge = document.getElementById("load-badge");
    var n = Object.keys(store).length;
    if (badge) { badge.textContent = n + (n === 1 ? " point" : " points"); badge.classList.toggle("wait", !n); }

    var note = document.getElementById("load-note");
    if (note) {
      note.innerHTML = isP
        ? (n ? "Load power is a <b>smooth curve</b>: it is zero at R = 0, rises to a single peak of <b>12.5 W at R = r = 0.5 Ω</b>, then falls. This is maximum power transfer." : "Record the single-cell loads on the bench. Each one lands on this <b>curve</b> of P against R, which peaks where R = r.")
        : (n ? "Efficiency η = R/(R+r) is a <b>smooth curve climbing towards 100 %</b>. At the power peak (R = r) it is only 50 %: maximum power is <b>not</b> maximum efficiency." : "Switch between <b>Power</b> and <b>Efficiency</b>. Efficiency keeps rising as R grows, unlike the power, which has a single peak.");
    }
  }

  document.addEventListener("l3:bench", function (e) {
    var d = e.detail || {}; if (d.arr !== "single" || d.R_eq == null) return;
    var k = d.R_eq.toFixed(2);
    P[k] = [d.R_eq, +d.P.toFixed(2)];
    H[k] = [d.R_eq, +d.eta_pct.toFixed(1)];
    paint({ R: d.R_eq, P: d.P, eta: d.eta_pct });
  });
  document.addEventListener("l3:bench-reset", function () { P = {}; H = {}; paint(null); });

  var modeBtns = Array.prototype.slice.call(document.querySelectorAll("#graph-mode [data-g]"));
  modeBtns.forEach(function (b) {
    b.addEventListener("click", function () {
      view = b.getAttribute("data-g");
      modeBtns.forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      build(); paint(null);
    });
  });

  build(); paint(null);
})();
