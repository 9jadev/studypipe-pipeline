/* ==========================================================
   StudyPipe — Welcome Hub Explorer · Plant and Animal Cells
   Four live graphs drawn as SVG (#combo-curve) from real relationships:
     magnification  image size = 0.05 mm × M            (M = ×40 … ×400)
     sav            SA : V = 6/L                         (L = 1 … 6 mm)
     osmosis        % change in mass vs sucrose c        (Lesson 4 data, smooth monotone curve,
                                                          crossing 0% at the isotonic point ≈ 0.34 mol dm⁻³)
     levels         step chart organelle → organism
   Defines window.WELCOME_COMBOS (text fields, used by welcome.js) and draws the chart + slider.
   Also renders the archetype step chains with StudyMath when it is available.
   Load BEFORE welcome.js. Classic script, offline.
   ========================================================== */
(function () {
  "use strict";

  /* ---------------- data ---------------- */
  var OSMO_X = [0, 0.2, 0.4, 0.6, 0.8, 1.0];
  var OSMO_Y = [14.0, 4.8, -2.0, -8.0, -12.2, -16.5];
  // Fritsch–Carlson monotone cubic: a smooth curve through the points that never overshoots
  var OSMO_M = (function () {
    var n = OSMO_X.length, d = [], m = [];
    for (var i = 0; i < n - 1; i++) d.push((OSMO_Y[i + 1] - OSMO_Y[i]) / (OSMO_X[i + 1] - OSMO_X[i]));
    m[0] = d[0]; m[n - 1] = d[n - 2];
    for (var j = 1; j < n - 1; j++) m[j] = d[j - 1] * d[j] <= 0 ? 0 : 2 / (1 / d[j - 1] + 1 / d[j]);
    return m;
  })();
  function osmo(x) {
    var i = Math.min(OSMO_X.length - 2, Math.max(0, Math.floor(x / 0.2)));
    var h = OSMO_X[i + 1] - OSMO_X[i], t = (x - OSMO_X[i]) / h, t2 = t * t, t3 = t2 * t;
    return (2 * t3 - 3 * t2 + 1) * OSMO_Y[i] + (t3 - 2 * t2 + t) * h * OSMO_M[i] + (-2 * t3 + 3 * t2) * OSMO_Y[i + 1] + (t3 - t2) * h * OSMO_M[i + 1];
  }
  var ISO = (function () { var lo = 0.2, hi = 0.4; for (var k = 0; k < 40; k++) { var mid = (lo + hi) / 2; if (osmo(mid) > 0) lo = mid; else hi = mid; } return (lo + hi) / 2; })();

  var LEVELS = [
    { name: "organelle", ex: "chloroplast, mitochondrion", from: "works inside one cell" },
    { name: "cell", ex: "Euglena, one cheek cell", from: "organelles" },
    { name: "tissue", ex: "Hydra’s layers, blood", from: "similar cells sharing a job" },
    { name: "organ", ex: "onion bulb, heart, leaf", from: "several tissues" },
    { name: "system", ex: "digestive, excretory", from: "organs working together" },
    { name: "organism", ex: "Chinedu, a mango tree", from: "systems" }
  ];

  var CHARTS = {
    magnification: {
      x: [0, 400], xt: [0, 100, 200, 300, 400], xl: "Total magnification (×)",
      y: [0, 20], yt: [0, 5, 10, 15, 20], yl: "Image of a 50 µm cell / mm",
      dom: [40, 400], f: function (M) { return 0.05 * M; },
      pts: [[40, 2], [100, 5], [400, 20]],
      slide: "Slide: change the magnification",
      read: function (M) { M = Math.round(M / 10) * 10; return [["Magnification", "×" + M], ["Image size", (0.05 * M).toFixed(1) + " mm"], ["Actual size", "50 µm"]]; },
      snap: function (M) { return Math.round(M / 10) * 10; }
    },
    sav: {
      x: [0, 6], xt: [0, 1, 2, 3, 4, 5, 6], xl: "Cube side L / mm",
      y: [0, 6], yt: [0, 2, 4, 6], yl: "SA : V / mm⁻¹",
      dom: [1, 6], f: function (L) { return 6 / L; },
      pts: [[1, 6], [2, 3], [3, 2], [4, 1.5], [6, 1]],
      slide: "Slide: grow the cube",
      read: function (L) { L = Math.round(L * 2) / 2; return [["Side L", L.toFixed(1) + " mm"], ["SA / V", fmt(6 * L * L) + " / " + fmt(L * L * L)], ["SA : V", (6 / L).toFixed(1) + " mm⁻¹"]]; },
      snap: function (L) { return Math.round(L * 2) / 2; }
    },
    osmosis: {
      x: [0, 1], xt: [0, 0.2, 0.4, 0.6, 0.8, 1.0], xl: "Sucrose concentration / mol dm⁻³",
      y: [-20, 20], yt: [-20, -10, 0, 10, 20], yl: "% change in mass",
      dom: [0, 1], f: osmo,
      pts: OSMO_X.map(function (x, i) { return [x, OSMO_Y[i]]; }),
      zero: true, zone: [ISO - 0.012, ISO + 0.012], note: "isotonic ≈ " + ISO.toFixed(2),
      slide: "Slide: make the solution saltier",
      read: function (c) { c = Math.round(c * 100) / 100; var p = osmo(c); return [["c / mol dm⁻³", c.toFixed(2)], ["% change", (p >= 0 ? "+" : "−") + Math.abs(p).toFixed(1) + "%"], ["Water", Math.abs(p) < 0.6 ? "in = out" : p > 0 ? "enters" : "leaves"]]; },
      snap: function (c) { return Math.round(c * 100) / 100; }
    },
    levels: {
      x: [-0.5, 5.5], xt: [], xl: "", cats: LEVELS.map(function (l) { return l.name; }),
      y: [0, 6], yt: [], yl: "Complexity",
      dom: [0, 5], f: function (i) { return Math.round(i) + 1; }, step: true,
      pts: LEVELS.map(function (l, i) { return [i, i + 1]; }),
      slide: "Slide: climb the levels",
      read: function (i) { var L = LEVELS[Math.round(i)]; return [["Level", L.name], ["Example", L.ex], ["Built from", L.from]]; },
      snap: function (i) { return Math.round(i); }
    }
  };

  window.WELCOME_COMBOS = {
    magnification: {
      title: "Magnification of one onion cell",
      example: "A 0.05 mm (50 µm) onion cell viewed from ×40 up to ×400",
      jump: "Image size = actual size × magnification",
      eq: "Straight line through the origin",
      ind: "The image grows; the cell does not", indClass: "ind-both",
      why: "Turning to a stronger objective makes the image bigger, but the onion cell itself stays 50 µm wide. That is why actual size = image size ÷ magnification always gives the same answer."
    },
    sav: {
      title: "Surface area : volume of a cube",
      example: "Agar cubes from 1 mm to 6 mm, as on the Lesson 3 cube bench",
      jump: "SA : V = 6L² ÷ L³ = 6/L",
      eq: "Falls steeply, then levels off",
      ind: "Double the side, halve the ratio", indClass: "ind-both",
      why: "A small cell has a lot of surface for its volume, so diffusion alone can feed every part of it, as in Amoeba. A big body has too little surface for its size, so it needs blood and a heart to carry materials."
    },
    osmosis: {
      title: "Potato strips in sucrose solutions",
      example: "Lesson 4 data: six strips, 0.0 to 1.0 mol dm⁻³, 30 minutes",
      jump: "% change = (final − initial) ÷ initial × 100",
      eq: "Smooth falling curve; crosses 0% at about 0.34 mol dm⁻³",
      ind: "Where it crosses zero = isotonic", indClass: "ind-both",
      why: "Strips gain mass in dilute solutions (water enters by osmosis) and lose mass in concentrated ones (water leaves). Where the curve crosses 0%, water enters and leaves equally: that solution is isotonic with the potato cells."
    },
    levels: {
      title: "Levels of organisation",
      example: "From one chloroplast to the whole of Chinedu",
      jump: "organelle → cell → tissue → organ → system → organism",
      eq: "Each step is built from the one below",
      ind: "Volvox is a colony, not a tissue", indClass: "ind-both",
      why: "Each level is made of units from the level below. In a tissue the cells share out the work and depend on one another; in a colony such as Volvox each cell can still live by itself."
    }
  };

  /* ---------------- SVG chart ---------------- */
  var svg = document.getElementById("combo-svg");
  if (!svg) return;
  var NS = "http://www.w3.org/2000/svg";
  var PL = 56, PR = 424, PT = 18, PB = 214;
  var el = {
    grid: document.getElementById("combo-grid"), curve: document.getElementById("combo-curve"),
    pts: document.getElementById("combo-points"), zone: document.getElementById("combo-zone"),
    extra: document.getElementById("combo-extra"), marker: document.getElementById("combo-marker"),
    dx: document.getElementById("combo-dropx"), dy: document.getElementById("combo-dropy"),
    slider: document.getElementById("combo-slider"), slideLabel: document.getElementById("combo-slide-label"),
    read: document.getElementById("combo-read")
  };
  var cur = "magnification";

  function fmt(v) { return Math.abs(v - Math.round(v)) < 1e-9 ? String(Math.round(v)) : v.toFixed(1); }
  function sx(c, x) { return PL + (x - c.x[0]) / (c.x[1] - c.x[0]) * (PR - PL); }
  function sy(c, y) { return PB - (y - c.y[0]) / (c.y[1] - c.y[0]) * (PB - PT); }
  function mk(tag, attrs, text) {
    var n = document.createElementNS(NS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (text != null) n.textContent = text;
    return n;
  }

  function draw(key) {
    var c = CHARTS[key]; if (!c) return;
    cur = key;
    el.grid.innerHTML = ""; el.pts.innerHTML = ""; el.extra.innerHTML = "";
    // gridlines + ticks
    c.yt.forEach(function (v) {
      el.grid.appendChild(mk("line", { "class": "cx-grid", x1: PL, x2: PR, y1: sy(c, v), y2: sy(c, v) }));
      el.grid.appendChild(mk("text", { "class": "cx-tick", x: PL - 6, y: sy(c, v) + 3.5, "text-anchor": "end" }, fmt(v)));
    });
    c.xt.forEach(function (v) {
      el.grid.appendChild(mk("line", { "class": "cx-grid", x1: sx(c, v), x2: sx(c, v), y1: PT, y2: PB }));
      el.grid.appendChild(mk("text", { "class": "cx-tick", x: sx(c, v), y: PB + 15, "text-anchor": "middle" }, key === "osmosis" ? v.toFixed(1) : fmt(v)));
    });
    if (c.cats) c.cats.forEach(function (name, i) {
      el.grid.appendChild(mk("text", { "class": "cx-tick", x: sx(c, i), y: PB + (i % 2 ? 26 : 14), "text-anchor": "middle" }, name));
    });
    // axes (x-axis at y = 0 when the range crosses zero)
    var y0 = c.y[0] < 0 ? sy(c, 0) : PB;
    el.grid.appendChild(mk("line", { "class": "cx-axis", x1: PL, x2: PR, y1: PB, y2: PB }));
    el.grid.appendChild(mk("line", { "class": "cx-axis", x1: PL, x2: PL, y1: PT, y2: PB }));
    if (c.zero) el.extra.appendChild(mk("line", { "class": "cx-zero", x1: PL, x2: PR, y1: y0, y2: y0 }));
    if (c.xl) el.grid.appendChild(mk("text", { "class": "cx-title", x: (PL + PR) / 2, y: 262, "text-anchor": "middle" }, c.xl));
    el.grid.appendChild(mk("text", { "class": "cx-title", x: 14, y: (PT + PB) / 2, "text-anchor": "middle", transform: "rotate(-90 14 " + (PT + PB) / 2 + ")" }, c.yl));
    // isotonic band
    if (c.zone) {
      el.zone.setAttribute("x", sx(c, c.zone[0])); el.zone.setAttribute("width", sx(c, c.zone[1]) - sx(c, c.zone[0]));
      el.zone.setAttribute("y", PT); el.zone.setAttribute("height", PB - PT);
      el.extra.appendChild(mk("text", { "class": "cx-note", x: sx(c, c.zone[1]) + 6, y: y0 - 8 }, c.note));
    } else { el.zone.setAttribute("width", 0); el.zone.setAttribute("height", 0); }
    // curve
    var d = "";
    if (c.step) {
      c.pts.forEach(function (p, i) {
        var x0 = sx(c, p[0] - 0.5), x1 = sx(c, p[0] + 0.5), yy = sy(c, p[1]);
        d += (i ? " L " : "M ") + x0.toFixed(1) + " " + yy.toFixed(1) + " L " + x1.toFixed(1) + " " + yy.toFixed(1);
      });
    } else {
      var N = 80;
      for (var i = 0; i <= N; i++) {
        var x = c.dom[0] + (c.dom[1] - c.dom[0]) * i / N;
        d += (i ? " L " : "M ") + sx(c, x).toFixed(1) + " " + sy(c, c.f(x)).toFixed(1);
      }
      if (key === "magnification") d = "M " + sx(c, 0) + " " + sy(c, 0) + " L " + d.slice(2);
    }
    el.curve.setAttribute("d", d);
    // data points
    c.pts.forEach(function (p) { el.pts.appendChild(mk("circle", { "class": "cx-pt", cx: sx(c, p[0]), cy: sy(c, p[1]), r: 4.5 })); });
    el.slideLabel.textContent = c.slide;
    el.slider.value = key === "osmosis" ? 340 : key === "levels" ? 200 : 500;
    move();
  }

  function move() {
    var c = CHARTS[cur];
    var u = (+el.slider.value) / 1000;
    var x = c.snap(c.dom[0] + (c.dom[1] - c.dom[0]) * u), y = c.f(x);
    var px = sx(c, x), py = sy(c, y), base = c.y[0] < 0 ? sy(c, 0) : PB;
    el.marker.setAttribute("cx", px); el.marker.setAttribute("cy", py);
    el.dx.setAttribute("x1", px); el.dx.setAttribute("x2", px); el.dx.setAttribute("y1", py); el.dx.setAttribute("y2", c.step ? PB : base);
    el.dy.setAttribute("x1", PL); el.dy.setAttribute("x2", px); el.dy.setAttribute("y1", py); el.dy.setAttribute("y2", py);
    el.read.innerHTML = "";
    c.read(x).forEach(function (r) {
      var div = document.createElement("div"), s = document.createElement("span"), b = document.createElement("b");
      s.textContent = r[0]; b.textContent = r[1]; div.appendChild(s); div.appendChild(b); el.read.appendChild(div);
    });
  }

  el.slider.addEventListener("input", move);
  document.querySelectorAll(".combo-tab[data-combo]").forEach(function (t) {
    t.addEventListener("click", function () { draw(t.getAttribute("data-combo")); });
  });
  draw("magnification");

  /* ---------------- archetype chains: typeset with StudyMath when it loads ---------------- */
  function typeset() {
    if (!window.StudyMath || !StudyMath.tex) return;
    document.querySelectorAll(".arch-steps .tex[data-tex]").forEach(function (n) {
      try { var html = StudyMath.tex(n.getAttribute("data-tex"), false); if (html) n.innerHTML = html; } catch (e) { /* keep the plain-text fallback */ }
    });
  }
  if (document.readyState === "complete") typeset(); else window.addEventListener("load", typeset);
})();
