/* ==========================================================
   StudyPipe — Welcome Hub Explorer · The Human Heart and Blood Circulation
   Four live graphs drawn as SVG (#combo-curve) from real relationships:
     sav       SA : V = 6/L                              (L = 1 … 30 mm, Lesson 1)
     pulse     heart rate after exercise, smooth curve    (Chidi's recovery, 132 → 68 bpm, Lesson 4)
     pressure  mean pressure along the circuit            (approximate teaching values, Lesson 5)
     capillary Pc falls 36 → 16 mmHg against flat πc 25   (NFP = Pc − πc, crosses 55% along, Lesson 5)
   Defines window.WELCOME_COMBOS (text fields, used by welcome.js) and draws the chart + slider.
   Also renders the archetype step chains with StudyMath when it is available.
   Load BEFORE welcome.js. Classic script, offline.
   ========================================================== */
(function () {
  "use strict";

  /* ---------------- data ---------------- */
  // Fritsch–Carlson monotone cubic: a smooth curve through the points that never overshoots
  function monotone(X, Y) {
    var n = X.length, d = [], m = [];
    for (var i = 0; i < n - 1; i++) d.push((Y[i + 1] - Y[i]) / (X[i + 1] - X[i]));
    m[0] = d[0]; m[n - 1] = d[n - 2];
    for (var j = 1; j < n - 1; j++) m[j] = d[j - 1] * d[j] <= 0 ? 0 : 2 / (1 / d[j - 1] + 1 / d[j]);
    return function (x) {
      var k = 0;
      while (k < n - 2 && x > X[k + 1]) k++;
      var h = X[k + 1] - X[k], t = (x - X[k]) / h, t2 = t * t, t3 = t2 * t;
      return (2 * t3 - 3 * t2 + 1) * Y[k] + (t3 - 2 * t2 + t) * h * m[k] + (-2 * t3 + 3 * t2) * Y[k + 1] + (t3 - t2) * h * m[k + 1];
    };
  }
  var PULSE_X = [0, 1, 2, 3, 4, 5], PULSE_Y = [132, 116, 96, 80, 72, 68];
  var pulse = monotone(PULSE_X, PULSE_Y);
  var STAGES = [
    { name: "aorta", p: 100, note: "pushed out by the left ventricle" },
    { name: "arteries", p: 96, note: "elastic walls keep the pressure up" },
    { name: "arterioles", p: 55, note: "the steepest fall: narrow tubes resist the flow" },
    { name: "capillaries", p: 25, note: "slow, gentle flow for exchange" },
    { name: "venules", p: 12, note: "pressure almost spent" },
    { name: "veins", p: 6, note: "valves and the muscle pump do the lifting" },
    { name: "venae cavae", p: 2, note: "blood returns to the right atrium" }
  ];
  var press = monotone(STAGES.map(function (s, i) { return i; }), STAGES.map(function (s) { return s.p; }));
  function pc(u) { return 36 - 20 * u; }
  var PI_C = 25;
  function sgn(v) { return (v > 0 ? "+" : v < 0 ? "\u2212" : "") + Math.abs(v).toFixed(1); }

  var CHARTS = {
    sav: {
      x: [0, 30], xt: [0, 5, 10, 15, 20, 25, 30], xl: "Cube side L / mm",
      y: [0, 6], yt: [0, 2, 4, 6], yl: "SA : V / mm\u207b\u00b9",
      dom: [1, 30], f: function (L) { return 6 / L; },
      pts: [[1, 6], [2, 3], [5, 1.2], [10, 0.6], [20, 0.3], [30, 0.2]],
      slide: "Slide: grow the cube",
      read: function (L) { return [["Side L", L + " mm"], ["SA / V", fmt(6 * L * L) + " / " + fmt(L * L * L)], ["SA : V", (6 / L).toFixed(L > 6 ? 2 : 1) + " mm\u207b\u00b9"]]; },
      snap: function (L) { return Math.max(1, Math.round(L)); }
    },
    pulse: {
      x: [0, 5], xt: [0, 1, 2, 3, 4, 5], xl: "Time after exercise / min",
      y: [60, 140], yt: [60, 80, 100, 120, 140], yl: "Heart rate / bpm",
      dom: [0, 5], f: pulse, hline: 68, hnote: "resting rate 68 bpm",
      pts: PULSE_X.map(function (x, i) { return [x, PULSE_Y[i]]; }),
      slide: "Slide: move through the minutes",
      read: function (t) { var r = pulse(t); return [["Time", t.toFixed(1) + " min"], ["Heart rate", Math.round(r) + " bpm"], ["Cycle time", (60 / r).toFixed(2) + " s"]]; },
      snap: function (t) { return Math.round(t * 2) / 2; }
    },
    pressure: {
      x: [-0.5, 6.5], xt: [], xl: "", cats: STAGES.map(function (s) { return s.name.replace("venae cavae", "v. cavae").replace("arterioles", "arterioles"); }),
      y: [0, 100], yt: [0, 25, 50, 75, 100], yl: "Mean pressure / mmHg",
      dom: [0, 6], f: press,
      pts: STAGES.map(function (s, i) { return [i, s.p]; }),
      slide: "Slide: follow the blood round",
      read: function (i) { i = Math.round(i); var s = STAGES[i]; return [["Vessel", s.name], ["Pressure", "about " + s.p + " mmHg"], ["Fall from last", i ? "\u2212" + (STAGES[i - 1].p - s.p) + " mmHg" : "start"]]; },
      snap: function (i) { return Math.round(i); }
    },
    capillary: {
      x: [0, 1], xt: [0, 0.25, 0.5, 0.75, 1], xl: "Position along the capillary (0 = arterial end)",
      y: [10, 40], yt: [10, 20, 30, 40], yl: "Pressure / mmHg",
      dom: [0, 1], f: pc, line2: { y: PI_C, label: "\u03c0c = 25 (pulls water in)" }, zoneAt: 0.55, note: "NFP = 0",
      pts: [[0, 36], [0.25, 31], [0.5, 26], [0.75, 21], [1, 16]],
      slide: "Slide: move along the capillary",
      read: function (u) { var p = pc(u), n = p - PI_C; return [["Pc", p.toFixed(0) + " mmHg"], ["NFP = Pc \u2212 \u03c0c", sgn(n) + " mmHg"], ["Fluid", Math.abs(n) < 0.5 ? "balanced" : n > 0 ? "leaves the blood" : "returns to the blood"]]; },
      snap: function (u) { return Math.round(u * 20) / 20; }
    }
  };

  window.WELCOME_COMBOS = {
    sav: {
      title: "Surface area : volume of a cube",
      example: "Cubes from 1 mm up to 30 mm, as on the Lesson 1 cube bench",
      jump: "SA : V = 6L\u00b2 \u00f7 L\u00b3 = 6/L",
      eq: "Falls steeply, then levels off",
      ind: "Double the side, halve the ratio", indClass: "ind-both",
      why: "A tiny Amoeba has a huge surface for its volume, so diffusion alone can feed it. A body the size of Chidi has far too little surface for its volume, so it needs a heart and blood to carry materials to every cell."
    },
    pulse: {
      title: "Chidi\u2019s pulse after the sprint",
      example: "Lesson 4 data: 132 bpm at once, then every minute for 5 minutes",
      jump: "Heart rate = beats counted \u00d7 60 \u00f7 seconds",
      eq: "Smooth falling curve that levels off near 68 bpm",
      ind: "Recovery time \u2248 5 min", indClass: "ind-both",
      why: "Exercise makes the cardiac centre and adrenaline speed up the heart. Once the sprint stops, the rate falls quickly at first, then slowly, until it meets the resting rate. A fitter heart recovers sooner."
    },
    pressure: {
      title: "Pressure along the circuit",
      example: "From the aorta to the venae cavae (approximate teaching values)",
      jump: "Highest in the aorta, lowest in the venae cavae",
      eq: "Falls all the way; steepest across the arterioles",
      ind: "Blood always flows from high to low pressure", indClass: "ind-both",
      why: "The pressure is spent pushing blood through narrower and narrower tubes. By the time blood reaches the veins there is almost none left, which is why vein valves and the muscle pump matter."
    },
    capillary: {
      title: "Tissue fluid in one capillary",
      example: "Blood pressure Pc falls from 36 to 16 mmHg; plasma proteins pull inward at 25 mmHg",
      jump: "NFP = Pc \u2212 \u03c0c",
      eq: "The lines cross 55% of the way along",
      ind: "Out at the start, back in at the end", indClass: "ind-both",
      why: "At the arterial end Pc is bigger than \u03c0c, so fluid is squeezed out into the tissues. At the venous end Pc has dropped below \u03c0c, so most of it is drawn back. If the venous pressure stays high, as in Mama Bisi\u2019s legs, too much stays out and the ankles swell."
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
  var cur = "sav";

  function fmt(v) { return Math.abs(v - Math.round(v)) < 1e-9 ? String(Math.round(v)) : String(+v.toFixed(2)); }
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
      el.grid.appendChild(mk("text", { "class": "cx-tick", x: sx(c, v), y: PB + 15, "text-anchor": "middle" }, fmt(v)));
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
    // horizontal reference line and second curve
    if (c.hline != null) {
      el.extra.appendChild(mk("line", { "class": "cx-zero", x1: PL, x2: PR, y1: sy(c, c.hline), y2: sy(c, c.hline) }));
      el.extra.appendChild(mk("text", { "class": "cx-note", x: PR - 4, y: sy(c, c.hline) - 6, "text-anchor": "end" }, c.hnote));
    }
    if (c.line2) {
      el.extra.appendChild(mk("line", { "class": "cx-zero", x1: PL, x2: PR, y1: sy(c, c.line2.y), y2: sy(c, c.line2.y) }));
      el.extra.appendChild(mk("text", { "class": "cx-note", x: PR - 4, y: sy(c, c.line2.y) + 14, "text-anchor": "end" }, c.line2.label));
    }
    if (c.zoneAt != null) c.zone = [c.zoneAt - 0.012, c.zoneAt + 0.012];
    // marked band (where NFP = 0)
    if (c.zone) {
      el.zone.setAttribute("x", sx(c, c.zone[0])); el.zone.setAttribute("width", sx(c, c.zone[1]) - sx(c, c.zone[0]));
      el.zone.setAttribute("y", PT); el.zone.setAttribute("height", PB - PT);
      el.extra.appendChild(mk("text", { "class": "cx-note", x: sx(c, c.zone[1]) + 6, y: PT + 12 }, c.note));
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
    }
    el.curve.setAttribute("d", d);
    // data points
    c.pts.forEach(function (p) { el.pts.appendChild(mk("circle", { "class": "cx-pt", cx: sx(c, p[0]), cy: sy(c, p[1]), r: 4.5 })); });
    el.slideLabel.textContent = c.slide;
    el.slider.value = key === "sav" ? 100 : key === "pulse" ? 400 : key === "pressure" ? 330 : 300;
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
  draw("sav");

  /* ---------------- archetype chains: typeset with StudyMath when it loads ---------------- */
  function typeset() {
    if (!window.StudyMath || !StudyMath.tex) return;
    document.querySelectorAll(".arch-steps .tex[data-tex]").forEach(function (n) {
      try { var html = StudyMath.tex(n.getAttribute("data-tex"), false); if (html) n.innerHTML = html; } catch (e) { /* keep the plain-text fallback */ }
    });
  }
  if (document.readyState === "complete") typeset(); else window.addEventListener("load", typeset);
})();
