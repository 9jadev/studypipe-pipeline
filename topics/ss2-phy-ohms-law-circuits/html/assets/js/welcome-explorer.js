/* ==========================================================
   StudyPipe — Welcome Hub Explorer · Ohm's Law & Current Electricity
   Four live graphs drawn as SVG from the real relationships (02-lesson.md § 5):
     ohmic     I (vertical) against V: wire I = V/2.20 (straight, through O) and an
               illustrative filament lamp whose curve bends over as it heats (Lesson 01)
     terminal  V = E − Ir with E = 6.0 V, r = 1.5 Ω (Lesson 02 data): intercept E, gradient −r
     power     P = E²R/(R + r)² and η = R/(R + r) for E = 5.0 V, r = 0.5 Ω (Lesson 03 data)
     pot       V = kl with k = 0.0200 V cm⁻¹ (Lesson 05): straight line through the origin
   Defines window.WELCOME_COMBOS (text fields, used by welcome.js), draws the chart + slider,
   and typesets the archetype chains with StudyMath when it loads.
   Load BEFORE welcome.js. Classic script, offline.
   ========================================================== */
(function () {
  "use strict";

  var LAMP = function (V) { return V <= 0 ? 0 : Math.pow(V / 2.2, 0.55); };   // illustrative only
  var PW = function (R) { return 25 * R / Math.pow(R + 0.5, 2); };
  var ETA = function (R) { return 100 * R / (R + 0.5); };

  function fx(v, d) { return v.toFixed(d); }

  var CHARTS = {
    ohmic: {
      x: [0, 2.5], xt: [0, 0.5, 1, 1.5, 2, 2.5], xl: "p.d. V / V",
      y: [0, 1.2], yt: [0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2], yl: "current I / A",
      dom: [0, 2.5], f: function (V) { return V / 2.2; },
      f2: LAMP, f2note: "filament lamp (bends over)", fnote: "wire: straight through O",
      pts: [[0.44, 0.2], [0.88, 0.4], [1.32, 0.6], [1.76, 0.8], [2.2, 1.0]],
      slide: "Slide: raise the p.d.",
      read: function (V) {
        var Iw = V / 2.2, Il = LAMP(V);
        return [["p.d. V", fx(V, 2) + " V"], ["Wire I", fx(Iw, 2) + " A (R = 2.20 Ω)"], ["Lamp I", fx(Il, 2) + " A (R = " + (Il > 0.001 ? fx(V / Il, 2) : "—") + " Ω)"]];
      },
      snap: function (V) { return Math.round(V * 50) / 50; }, start: 0.7
    },
    terminal: {
      x: [0, 4], xt: [0, 1, 2, 3, 4], xl: "current I / A",
      y: [0, 7], yt: [0, 1, 2, 3, 4, 5, 6, 7], yl: "terminal p.d. V / V",
      dom: [0, 4], f: function (I) { return 6.0 - 1.5 * I; },
      hline: 6.0, hnote: "intercept E = 6.0 V",
      pts: [[0.5, 5.25], [1.0, 4.5], [1.5, 3.75], [2.0, 3.0], [2.5, 2.25]],
      slide: "Slide: draw more current",
      read: function (I) { var V = 6.0 - 1.5 * I; return [["Current I", fx(I, 2) + " A"], ["Terminal V", fx(V, 2) + " V"], ["Lost volts Ir", fx(1.5 * I, 2) + " V"]]; },
      snap: function (I) { return Math.round(I * 20) / 20; }, start: 0.3
    },
    power: {
      x: [0, 4], xt: [0, 0.5, 1, 2, 3, 4], xl: "load resistance R / Ω",
      y: [0, 14], yt: [0, 2, 4, 6, 8, 10, 12, 14], yl: "load power P / W",
      y2: [0, 100], y2t: [0, 25, 50, 75, 100], y2l: "efficiency η / %",
      dom: [0.02, 4], f: PW, f2: function (R) { return ETA(R) * 14 / 100; }, f2note: "η climbs towards 100 %", fnote: "P peaks at R = r",
      vline: 0.5, vnote: "R = r = 0.5 Ω",
      pts: [[0.1, 6.94], [0.5, 12.5], [1.0, 11.1], [2.0, 8.0], [4.0, 4.94]],
      pts2: [[0.1, 16.7], [0.5, 50.0], [1.0, 66.7], [2.0, 80.0], [4.0, 88.9]],
      slide: "Slide: change the load",
      read: function (R) { return [["Load R", fx(R, 2) + " Ω"], ["Power P", fx(PW(R), 2) + " W"], ["Efficiency η", fx(ETA(R), 1) + " %"]]; },
      snap: function (R) { return Math.max(0.05, Math.round(R * 20) / 20); }, start: 0.125
    },
    pot: {
      x: [0, 100], xt: [0, 20, 40, 60, 80, 100], xl: "balance length l / cm",
      y: [0, 2], yt: [0, 0.5, 1, 1.5, 2], yl: "p.d. along the wire V / V",
      dom: [0, 100], f: function (l) { return 0.02 * l; },
      hline: 1.5, hnote: "cell of EMF 1.50 V balances at 75.0 cm",
      pts: [[20, 0.4], [40, 0.8], [60, 1.2], [80, 1.6], [100, 2.0]],
      slide: "Slide: move the jockey",
      read: function (l) { var V = 0.02 * l; return [["Length l", fx(l, 1) + " cm"], ["p.d. kl", fx(V, 3) + " V"], ["Against 1.50 V", Math.abs(V - 1.5) < 0.005 ? "balanced (null)" : V < 1.5 ? "galvanometer deflects" : "deflects the other way"]]; },
      snap: function (l) { return Math.round(l * 2) / 2; }, start: 0.5
    }
  };

  window.WELCOME_COMBOS = {
    ohmic: {
      title: "Ohmic or not? I against V",
      example: "Lesson 1: a 2.20 Ω wire (Worked Example 3) beside a filament lamp",
      jump: "V = IR, with R constant at steady temperature",
      eq: "Wire: straight line through O. Lamp: a curve that flattens",
      ind: "Here I is vertical; Lesson 1 plots V vertical, where the lamp curve bends up", indClass: "ind-both",
      why: "The wire keeps the same resistance, so doubling V doubles I. The lamp filament heats up as the current grows, its resistance rises, and each extra volt buys less current, so its curve bends over towards the V axis."
    },
    terminal: {
      title: "Terminal p.d. V = E − Ir",
      example: "Lesson 2 data: E = 6.0 V, r = 1.5 Ω",
      jump: "Vertical intercept = E; gradient = −r",
      eq: "A straight line falling as the current rises",
      ind: "Open circuit (I = 0): the voltmeter shows E", indClass: "ind-both",
      why: "Every coulomb gets E joules from the cell but spends Ir of them inside it. The more current you draw, the bigger the lost volts and the smaller the p.d. left at the terminals. That is why Emeka's 12.0 V battery showed 8.4 V on load."
    },
    power: {
      title: "Power and efficiency against load R",
      example: "Lesson 3 data: E = 5.0 V, r = 0.5 Ω",
      jump: "P = E²R/(R + r)²;  η = R/(R + r)",
      eq: "Two smooth curves, never straight lines",
      ind: "Most power at R = r, but then η is only 50 %", indClass: "ind-both",
      why: "A tiny load draws a big current but wastes most of the power inside the cell. A huge load wastes little but takes little. Power peaks when R equals r; efficiency keeps climbing towards 100 % as R grows much bigger than r."
    },
    pot: {
      title: "Potentiometer: V = kl",
      example: "Lesson 5: k = 0.0200 V per cm on a uniform 100 cm wire",
      jump: "V ∝ l;  E₁/E₂ = l₁/l₂",
      eq: "A straight line through the origin",
      ind: "At balance no current is drawn: true EMF", indClass: "ind-both",
      why: "A steady current in a uniform wire drops the same p.d. in every centimetre. Slide the jockey until that p.d. equals the cell's EMF: the galvanometer reads zero, the cell gives no current, so no lost volts hide the true value."
    }
  };

  /* ---------------- SVG chart ---------------- */
  var svg = document.getElementById("combo-svg");
  if (!svg) return;
  var NS = "http://www.w3.org/2000/svg";
  var PL = 56, PR = 400, PT = 18, PB = 214;
  var el = {
    grid: document.getElementById("combo-grid"), curve: document.getElementById("combo-curve"), curve2: document.getElementById("combo-curve2"),
    pts: document.getElementById("combo-points"), zone: document.getElementById("combo-zone"),
    extra: document.getElementById("combo-extra"), marker: document.getElementById("combo-marker"), marker2: document.getElementById("combo-marker2"),
    dx: document.getElementById("combo-dropx"), dy: document.getElementById("combo-dropy"),
    slider: document.getElementById("combo-slider"), slideLabel: document.getElementById("combo-slide-label"),
    read: document.getElementById("combo-read")
  };
  var cur = "ohmic";

  function nf(v) { return Math.abs(v - Math.round(v)) < 1e-9 ? String(Math.round(v)) : String(+v.toFixed(2)); }
  function sx(c, x) { return PL + (x - c.x[0]) / (c.x[1] - c.x[0]) * (PR - PL); }
  function sy(c, y) { return PB - (y - c.y[0]) / (c.y[1] - c.y[0]) * (PB - PT); }
  function mk(tag, attrs, text) {
    var n = document.createElementNS(NS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (text != null) n.textContent = text;
    return n;
  }
  function path(c, fn) {
    var d = "", N = 90;
    for (var i = 0; i <= N; i++) {
      var x = c.dom[0] + (c.dom[1] - c.dom[0]) * i / N, y = Math.min(c.y[1], Math.max(c.y[0], fn(x)));
      d += (i ? " L " : "M ") + sx(c, x).toFixed(1) + " " + sy(c, y).toFixed(1);
    }
    return d;
  }

  function draw(key) {
    var c = CHARTS[key]; if (!c) return;
    cur = key;
    el.grid.innerHTML = ""; el.pts.innerHTML = ""; el.extra.innerHTML = "";
    c.yt.forEach(function (v) {
      el.grid.appendChild(mk("line", { "class": "cx-grid", x1: PL, x2: PR, y1: sy(c, v), y2: sy(c, v) }));
      el.grid.appendChild(mk("text", { "class": "cx-tick", x: PL - 6, y: sy(c, v) + 3.5, "text-anchor": "end" }, nf(v)));
    });
    c.xt.forEach(function (v) {
      el.grid.appendChild(mk("line", { "class": "cx-grid", x1: sx(c, v), x2: sx(c, v), y1: PT, y2: PB }));
      el.grid.appendChild(mk("text", { "class": "cx-tick", x: sx(c, v), y: PB + 15, "text-anchor": "middle" }, nf(v)));
    });
    el.grid.appendChild(mk("line", { "class": "cx-axis", x1: PL, x2: PR, y1: PB, y2: PB }));
    el.grid.appendChild(mk("line", { "class": "cx-axis", x1: PL, x2: PL, y1: PT, y2: PB }));
    el.grid.appendChild(mk("text", { "class": "cx-title", x: (PL + PR) / 2, y: 248, "text-anchor": "middle" }, c.xl));
    el.grid.appendChild(mk("text", { "class": "cx-title", x: 14, y: (PT + PB) / 2, "text-anchor": "middle", transform: "rotate(-90 14 " + (PT + PB) / 2 + ")" }, c.yl));
    if (c.y2) {
      el.grid.appendChild(mk("line", { "class": "cx-axis cx-axis2", x1: PR, x2: PR, y1: PT, y2: PB }));
      c.y2t.forEach(function (v) {
        var yy = PB - (v - c.y2[0]) / (c.y2[1] - c.y2[0]) * (PB - PT);
        el.grid.appendChild(mk("text", { "class": "cx-tick cx-tick2", x: PR + 5, y: yy + 3.5, "text-anchor": "start" }, nf(v)));
      });
      el.grid.appendChild(mk("text", { "class": "cx-title cx-tick2", x: 432, y: (PT + PB) / 2, "text-anchor": "middle", transform: "rotate(90 432 " + (PT + PB) / 2 + ")" }, c.y2l));
    }
    if (c.hline != null) {
      el.extra.appendChild(mk("line", { "class": "cx-zero", x1: PL, x2: PR, y1: sy(c, c.hline), y2: sy(c, c.hline) }));
      el.extra.appendChild(mk("text", { "class": "cx-note", x: PR - 4, y: sy(c, c.hline) - 6, "text-anchor": "end" }, c.hnote));
    }
    if (c.vline != null) {
      el.extra.appendChild(mk("line", { "class": "cx-zero", x1: sx(c, c.vline), x2: sx(c, c.vline), y1: PT, y2: PB }));
      el.extra.appendChild(mk("text", { "class": "cx-note", x: sx(c, c.vline) + 5, y: PB - 8 }, c.vnote));
    }
    el.zone.setAttribute("width", 0); el.zone.setAttribute("height", 0);
    el.curve.setAttribute("d", path(c, c.f));
    el.curve2.setAttribute("d", c.f2 ? path(c, c.f2) : "M 0 0");
    el.curve2.style.display = c.f2 ? "" : "none";
    el.marker2.style.display = c.f2 ? "" : "none";
    if (c.fnote) el.extra.appendChild(mk("text", { "class": "cx-note cx-note-a", x: PL + 150, y: PT + 12 }, c.fnote));
    if (c.f2note) el.extra.appendChild(mk("text", { "class": "cx-note cx-note-b", x: PL + 150, y: PT + 26 }, c.f2note));
    c.pts.forEach(function (p) { el.pts.appendChild(mk("circle", { "class": "cx-pt", cx: sx(c, p[0]), cy: sy(c, p[1]), r: 4.5 })); });
    (c.pts2 || []).forEach(function (p) { el.pts.appendChild(mk("circle", { "class": "cx-pt cx-pt2", cx: sx(c, p[0]), cy: sy(c, p[1] * (c.y[1] / c.y2[1])), r: 4 })); });
    el.slideLabel.textContent = c.slide;
    el.slider.value = Math.round(c.start * 1000);
    move();
  }

  function move() {
    var c = CHARTS[cur];
    var u = (+el.slider.value) / 1000;
    var x = c.snap(c.dom[0] + (c.dom[1] - c.dom[0]) * u), y = c.f(x);
    var px = sx(c, x), py = sy(c, Math.min(c.y[1], y));
    el.marker.setAttribute("cx", px); el.marker.setAttribute("cy", py);
    if (c.f2) { el.marker2.setAttribute("cx", px); el.marker2.setAttribute("cy", sy(c, Math.min(c.y[1], c.f2(x)))); }
    el.dx.setAttribute("x1", px); el.dx.setAttribute("x2", px); el.dx.setAttribute("y1", py); el.dx.setAttribute("y2", PB);
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
  draw("ohmic");

  /* ---------------- archetype chains: typeset with StudyMath when it loads ---------------- */
  function typeset() {
    if (!window.StudyMath || !StudyMath.tex) return;
    document.querySelectorAll(".arch-steps .tex[data-tex]").forEach(function (n) {
      try { var html = StudyMath.tex(n.getAttribute("data-tex"), false); if (html) n.innerHTML = html; } catch (e) { /* keep the plain-text fallback */ }
    });
  }
  if (document.readyState === "complete") typeset(); else window.addEventListener("load", typeset);
})();
