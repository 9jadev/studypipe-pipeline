/* ==========================================================
   StudyPipe — Welcome Hub UI interactions
   - Scroll-triggered reveal for .reveal blocks
   - Interactive Explorer tabs (window.WELCOME_COMBOS)
   - Myth-buster flip cards (.myth-card)
   ========================================================== */
(function () {
  "use strict";

  // 1. Scroll reveal
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // 2. Interactive Concept Explorer tabs
  var combos = window.WELCOME_COMBOS || {
    "strong-strong": {
      title: "Strong acid + Strong base",
      example: "e.g. HCl against NaOH",
      jump: "pH 3.0 → 10.5",
      eq: "pH 7.0 (neutral)",
      ind: "Methyl orange OR phenolphthalein",
      indClass: "ind-both",
      why: "The vertical jump at equivalence is huge (over 7 pH units), so both indicators change colour inside the same single drop.",
      path: "M 56 172 C 130 171, 200 168, 224 160 L 228 52 C 252 44, 330 40, 416 38",
      markerY: 105,
      zoneY: 48, zoneH: 114
    }
  };

  var tabs = document.querySelectorAll(".combo-tab");
  var fields = {
    title: document.getElementById("combo-title"),
    example: document.getElementById("combo-example"),
    jump: document.getElementById("combo-jump"),
    eq: document.getElementById("combo-eq"),
    ind: document.getElementById("combo-ind"),
    why: document.getElementById("combo-why"),
    curve: document.getElementById("combo-curve"),
    marker: document.getElementById("combo-marker"),
    zone: document.getElementById("combo-zone")
  };

  function selectCombo(key) {
    var d = combos[key];
    if (!d) return;
    tabs.forEach(function (t) {
      var active = t.getAttribute("data-combo") === key;
      t.classList.toggle("is-active", active);
      t.setAttribute("aria-selected", active ? "true" : "false");
    });
    if (fields.title && d.title !== undefined) fields.title.textContent = d.title;
    if (fields.example && d.example !== undefined) fields.example.textContent = d.example;
    if (fields.jump && d.jump !== undefined) fields.jump.textContent = d.jump;
    if (fields.eq && d.eq !== undefined) fields.eq.textContent = d.eq;
    if (fields.ind && d.ind !== undefined) {
      fields.ind.textContent = d.ind;
      if (d.indClass) fields.ind.className = "combo-pill " + d.indClass;
    }
    if (fields.why && d.why !== undefined) fields.why.textContent = d.why;
    if (fields.curve && d.path) fields.curve.setAttribute("d", d.path);
    if (fields.marker) {
      if (d.markerX !== undefined) fields.marker.setAttribute("cx", d.markerX);
      if (d.markerY !== undefined) fields.marker.setAttribute("cy", d.markerY);
    }
    if (fields.zone && d.zoneY !== undefined) {
      fields.zone.setAttribute("y", d.zoneY);
      fields.zone.setAttribute("height", d.zoneH);
    }
    // Generic data-combo-field support
    document.querySelectorAll("[data-combo-field]").forEach(function (el) {
      var f = el.getAttribute("data-combo-field");
      if (d[f] !== undefined) el.textContent = d[f];
    });
  }

  // 2b. Live graph for each explorer tab (StudyGraph), with a slider that walks a point along the line
  var GRAPHS = {
    ohmic: {
      x: { label: "Current I", unit: "A", min: 0, max: 1.4, step: 0.2 },
      y: { label: "P.d. V", unit: "V", min: 0, max: 3.5, step: 0.5 },
      range: [0.05, 1.35], slide: "Current I",
      f: function (I) { return 2.2 * I; },
      series: function (pt) {
        return [{ id: "w", name: "Constantan wire, R = 2.20 Ω", tone: "teal", fn: this.f, fnRange: [0, 1.4] }];
      },
      read: function (I, V) { return [["I", I.toFixed(2) + " A"], ["V", V.toFixed(2) + " V"], ["V ÷ I", (V / I).toFixed(2) + " Ω"]]; }
    },
    filament: {
      // illustrative shape only: V rises faster than I because the hot filament's R grows
      x: { label: "Current I", unit: "A", min: 0, max: 0.6, step: 0.1 },
      y: { label: "P.d. V", unit: "V", min: 0, max: 12, step: 2 },
      range: [0.04, 0.58], slide: "Current I",
      f: function (I) { return 4 * I + 40 * I * I * I; },
      series: function (pt) {
        return [{ id: "f", name: "Filament lamp (illustrative shape)", tone: "amber", fn: this.f, fnRange: [0, 0.6] },
                { id: "c", name: "V ÷ I at this point", tone: "pink", fn: function (x) { return pt.y / pt.x * x; }, dashed: true, fnRange: [0, pt.x] }];
      },
      read: function (I, V) { return [["I", I.toFixed(2) + " A"], ["V", V.toFixed(1) + " V"], ["V ÷ I", (V / I).toFixed(1) + " Ω"]]; }
    },
    internal: {
      x: { label: "Current I", unit: "A", min: 0, max: 10.5, step: 2 },
      y: { label: "Terminal p.d. V", unit: "V", min: 0, max: 13, step: 2 },
      range: [0, 10], slide: "Current drawn I",
      f: function (I) { return 12 - 1.2 * I; },
      series: function () {
        return [{ id: "c", name: "12.0 V cell, r = 1.20 Ω", tone: "sky", fn: this.f, fnRange: [0, 10] },
                { id: "e", name: "EMF E = 12.0 V (V at I = 0)", tone: "pink", fn: function () { return 12; }, dashed: true }];
      },
      read: function (I, V) { return [["I", I.toFixed(1) + " A"], ["V", V.toFixed(1) + " V"], ["Lost Ir", (12 - V).toFixed(1) + " V"]]; }
    },
    potentiometer: {
      x: { label: "Jockey distance l", unit: "cm", min: 0, max: 100, step: 20 },
      y: { label: "P.d. along wire V", unit: "V", min: 0, max: 3.2, step: 0.5 },
      range: [2, 98], slide: "Jockey position l",
      f: function (l) { return 0.03 * l; },
      guides: [{ axis: "x", value: 50, tone: "lime" }],
      series: function () {
        return [{ id: "k", name: "Wire, k = 0.030 V/cm", tone: "teal", fn: this.f, fnRange: [0, 100] },
                { id: "x", name: "Test cell E = 1.50 V", tone: "pink", fn: function () { return 1.5; }, dashed: true },
                { id: "n", name: "Balance at l = 50.0 cm", tone: "lime", hideLegend: false, fn: function () { return NaN; } }];
      },
      read: function (l, V) {
        var d = V - 1.5, st = Math.abs(d) < 0.015 ? "0 (null)" : d < 0 ? "≠ 0 (←)" : "≠ 0 (→)";
        return [["l", l.toFixed(1) + " cm"], ["V = kl", V.toFixed(2) + " V"], ["Galv. I_g", st]];
      }
    }
  };
  var graphEl = document.getElementById("combo-graph");
  var slider = document.getElementById("combo-slider");
  var readEl = document.getElementById("combo-read");
  var slideLabel = document.getElementById("combo-slide-label");
  var graph = graphEl && window.StudyGraph ? StudyGraph.create(graphEl, { theme: "dark", x: GRAPHS.ohmic.x, y: GRAPHS.ohmic.y, ratio: 0.7 }) : null;
  var gKey = "ohmic";
  function drawGraph() {
    var G = GRAPHS[gKey];
    if (!graph || !G) return;
    var u = slider ? +slider.value / 1000 : 0.5;
    var x = G.range[0] + (G.range[1] - G.range[0]) * u, y = G.f(x);
    var pt = { x: x, y: y };
    graph.set({ x: G.x, y: G.y, series: G.series(pt), guides: G.guides || [], marker: { x: x, y: y, tone: "amber" },
                aria: (combos[gKey] && combos[gKey].title || "Graph") + ": " + G.y.label + " against " + G.x.label });
    if (readEl) readEl.innerHTML = G.read(x, y).map(function (r) { return "<div><span>" + r[0] + "</span><b>" + r[1] + "</b></div>"; }).join("");
    if (slideLabel) slideLabel.textContent = "Slide to change " + G.slide;
  }
  if (slider) slider.addEventListener("input", function () { requestAnimationFrame(drawGraph); });
  var baseSelect = selectCombo;
  selectCombo = function (key) {
    baseSelect(key);
    if (GRAPHS[key]) { gKey = key; if (slider) slider.value = 500; drawGraph(); }
  };
  drawGraph();

  tabs.forEach(function (t) {
    t.addEventListener("click", function () {
      selectCombo(t.getAttribute("data-combo"));
    });
  });

  // 3. Myth flip cards
  var myths = document.querySelectorAll(".myth-card");
  myths.forEach(function (card) {
    card.addEventListener("click", function () {
      var open = card.classList.toggle("is-flipped");
      card.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  // 4. Whole-card click for live lessons
  document.querySelectorAll(".lesson.is-live").forEach(function (card) {
    card.addEventListener("click", function (e) {
      if (e.target.closest("a")) return;
      var a = card.querySelector("h3 a, a");
      if (a && a.href) window.location.href = a.href;
    });
  });
})();
