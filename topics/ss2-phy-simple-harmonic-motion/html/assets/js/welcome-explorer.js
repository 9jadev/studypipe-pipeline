/* ==========================================================
   StudyPipe — Welcome Hub Explorer · Simple Harmonic Motion
   Five live 2D graphs drawn with Paper.js (rule 5b; window.paper from assets/js/paper-core.min.js),
   every curve computed from the unit's own numbers (02-lesson.md Part I § 5):
     xva        x = A sin ωt, v = ωA cos ωt, a = −ω²A sin ωt  (A = 0.30 m, T = 2.0 s: Lesson 03 bench)
     ax         a = −ω²x for the okada (ω² = 158 s⁻²): a straight line through O; |a| = g at x = 6.2 cm (Lesson 02/03)
     energy     PE = ½kx², KE = ½k(A² − x²), E = ½kA²  (k = 50 N m⁻¹, A = 0.10 m, m = 0.50 kg: Lesson 06 WE1)
     t2l        T² = (4π²/g) l with the Lesson 05 class data, g = 9.79 m s⁻², slope 4.03 s² m⁻¹
     resonance  A = Y√(1 + (2ζr)²)/√((1 − r²)² + (2ζr)²), Y = 1.0 cm, f0 = 2.0 Hz, ζ 0.05 / 0.30, with the
                lift-off threshold g/(2πf)² (Lesson 07 story model)
   DOM: #combo-curve (wrapper) > #combo-canvas (Paper.js) + #combo-marker (DOM dot that follows the
   live point, so the narrator can spotlight it); #combo-slider, #combo-read, #combo-damp.
   Defines window.WELCOME_COMBOS (text fields, used by welcome.js) and typesets the archetype chains
   with StudyMath when it loads. Load BEFORE welcome.js. Classic script, offline.
   ========================================================== */
(function () {
  "use strict";

  var G = 9.8, W2_OKADA = 158;
  var KSP = 50, ASP = 0.10, MSP = 0.50, ESP = 0.5 * KSP * ASP * ASP;
  var SLOPE = 4 * Math.PI * Math.PI / 9.79;
  var damp = { zeta: 0.05 };

  function respA(f, z) { var r = f / 2.0; return 1.0 * Math.sqrt(1 + Math.pow(2 * z * r, 2)) / Math.sqrt(Math.pow(1 - r * r, 2) + Math.pow(2 * z * r, 2)); }
  function thresh(f) { var w = 2 * Math.PI * f; return w > 0 ? 100 * G / (w * w) : Infinity; }
  function fx(v, d) { return (Math.round(v * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d); }

  var CHARTS = {
    xva: {
      x: [0, 4], xt: [0, 1, 2, 3, 4], xl: "time t / s",
      y: [-1.2, 1.2], yt: [-1, 0, 1], ytl: ["−1", "0", "+1"], yl: "value ÷ its peak",
      curves: [
        { fn: function (t) { return Math.sin(Math.PI * t); }, c: "--amber", label: "x", w: 3 },
        { fn: function (t) { return Math.cos(Math.PI * t); }, c: "--teal", label: "v", w: 2.4 },
        { fn: function (t) { return -Math.sin(Math.PI * t); }, c: "--pink-soft", label: "a", w: 2.4, dash: [7, 5] }
      ],
      markOn: [0, 1, 2], vcursor: true,
      dom: [0, 4], start: 0.125, slide: "Slide: move through time",
      snap: function (t) { return Math.round(t * 40) / 40; },
      read: function (t) {
        var x = 0.30 * Math.sin(Math.PI * t), v = 0.30 * Math.PI * Math.cos(Math.PI * t), a = -Math.PI * Math.PI * x;
        return [["t", fx(t, 2) + " s"], ["x", fx(x, 3) + " m"], ["v", fx(v, 3) + " m/s"], ["a", fx(a, 2) + " m/s²"]];
      }
    },
    ax: {
      x: [-0.08, 0.08], xt: [-0.08, -0.04, 0, 0.04, 0.08], xtl: ["−8", "−4", "0", "4", "8"], xl: "displacement x / cm",
      y: [-13, 13], yt: [-12, -8, -4, 0, 4, 8, 12], yl: "acceleration a / m s⁻²",
      curves: [{ fn: function (x) { return -W2_OKADA * x; }, c: "--amber", label: "a = −ω²x", w: 3 }],
      hlines: [{ y: -G, label: "−g" }, { y: G, label: "+g" }], vlines: [{ x: 0.062, label: "6.2 cm" }, { x: -0.062, label: "" }],
      markOn: [0], dom: [-0.08, 0.08], start: 0.8, slide: "Slide: move the carrier up and down",
      snap: function (x) { return Math.round(x * 1000) / 1000; },
      read: function (x) {
        var a = -W2_OKADA * x;
        var note = x > 0 && -a > G ? "falls away faster than g" : x > 0 ? "crate stays on" : "pushing the crate up";
        return [["x", fx(x * 100, 1) + " cm"], ["a", fx(a, 1) + " m/s²"], ["Carrier", note]];
      }
    },
    energy: {
      x: [-0.1, 0.1], xt: [-0.1, -0.05, 0, 0.05, 0.1], xtl: ["−0.10", "−0.05", "0", "0.05", "0.10"], xl: "displacement x / m",
      y: [0, 0.3], yt: [0, 0.1, 0.2, 0.3], yl: "energy / J",
      curves: [
        { fn: function (x) { return 0.5 * KSP * x * x; }, c: "--amber", label: "PE", w: 3 },
        { fn: function (x) { return ESP - 0.5 * KSP * x * x; }, c: "--teal", label: "KE", w: 2.6 },
        { fn: function () { return ESP; }, c: "--fg-soft", label: "total", w: 1.6, dash: [6, 5] }
      ],
      vlines: [{ x: ASP / Math.SQRT2, label: "KE = PE" }, { x: -ASP / Math.SQRT2, label: "" }],
      markOn: [0, 1], vcursor: true, dom: [-0.1, 0.1], start: 0.8, slide: "Slide: move the mass along its path",
      snap: function (x) { return Math.round(x * 1000) / 1000; },
      read: function (x) {
        var pe = 0.5 * KSP * x * x, ke = ESP - pe;
        return [["x", fx(x, 3) + " m"], ["PE", fx(pe, 3) + " J"], ["KE", fx(ke, 3) + " J"], ["speed", fx(Math.sqrt(2 * Math.max(0, ke) / MSP), 2) + " m/s"]];
      }
    },
    t2l: {
      x: [0, 1.1], xt: [0, 0.2, 0.4, 0.6, 0.8, 1.0], xl: "length l / m",
      y: [0, 4.5], yt: [0, 1, 2, 3, 4], yl: "T² / s²",
      curves: [{ fn: function (l) { return SLOPE * l; }, c: "--amber", label: "best fit through O", w: 2.6 }],
      pts: [[0.4, 1.613], [0.55, 2.219], [0.7, 2.822], [0.85, 3.428], [1.0, 4.032]],
      tri: [[0.4, 1.613], [1.0, 4.032]],
      markOn: [0], dom: [0, 1.1], start: 0.727, slide: "Slide: choose a length",
      snap: function (l) { return Math.round(l * 200) / 200; },
      read: function (l) {
        var T2 = SLOPE * l;
        return [["l", fx(l, 3) + " m"], ["T", fx(Math.sqrt(T2), 3) + " s"], ["T²", fx(T2, 3) + " s²"], ["g = 4π²/slope", "9.79 m/s²"]];
      }
    },
    resonance: {
      x: [0, 4], xt: [0, 1, 2, 3, 4], xl: "driving frequency f / Hz",
      y: [0, 12], yt: [0, 2, 4, 6, 8, 10, 12], yl: "amplitude A / cm",
      curves: [
        { fn: function (f) { return respA(f, damp.zeta); }, c: "--amber", label: "response", w: 3, live: true },
        { fn: thresh, c: "--pink-soft", label: "lift-off g/ω²", w: 1.8, dash: [6, 5] }
      ],
      vlines: [{ x: 2.0, label: "f₀ = 2.0 Hz" }],
      markOn: [0], dom: [0.05, 4], start: 0.25, slide: "Slide: ride faster over the ridges", damp: true,
      snap: function (f) { return Math.round(f * 100) / 100; },
      read: function (f) {
        var A = respA(f, damp.zeta), th = thresh(f);
        return [["Speed", fx(f * 2.5 * 3.6, 1) + " km/h"], ["f = v/d", fx(f, 2) + " Hz"], ["A", fx(A, 1) + " cm"], ["Crates", A >= th ? "lift off!" : "stay on"]];
      }
    }
  };

  window.WELCOME_COMBOS = {
    xva: {
      title: "x, v and a against time",
      example: "Lesson 3 bench: A = 0.30 m, T = 2.0 s (the mud lump's shadow)",
      jump: "x = A sin ωt · v = ωA cos ωt · a = −ω²x",
      eq: "v runs a quarter-cycle ahead of x; a is x upside down",
      ind: "Speed peaks where x = 0; acceleration peaks at the ends", indClass: "ind-both",
      why: "Slide through one cycle. Wherever the amber x curve crosses zero, the teal v curve is at a peak: the body is fastest in the middle. At the ends v is zero but the dashed a curve is at its biggest, pointing back to the centre."
    },
    ax: {
      title: "a against x: the definition of SHM",
      example: "Lessons 2–3: the okada, ω² = k/m = 158 s⁻²",
      jump: "a = −ω²x: a straight line through O with gradient −ω²",
      eq: "Straight line, negative slope, through the origin",
      ind: "|a| reaches g when x = g/ω² = 6.2 cm", indClass: "ind-both",
      why: "The minus sign says the acceleration always points back to the middle, and the straight line says it grows in step with the displacement. Above x = 6.2 cm the carrier would accelerate downwards faster than gravity can pull a crate: that is the lift-off line."
    },
    energy: {
      title: "Energy against displacement",
      example: "Lesson 6: k = 50 N/m, A = 0.10 m, E = ½kA² = 0.25 J",
      jump: "PE = ½kx² · KE = ½k(A² − x²) · total ½kA²",
      eq: "Two parabolas that always add up to a flat line",
      ind: "KE = PE at x = ±A/√2 ≈ ±0.071 m, not halfway", indClass: "ind-both",
      why: "With no losses the total stays fixed: all potential at the ends, all kinetic in the middle. The two curves cross about 71 % of the way out, because energy depends on x squared."
    },
    t2l: {
      title: "T² against l: the Paper 3 graph",
      example: "Lesson 5 class data: five lengths from 0.400 m to 1.000 m",
      jump: "T² = (4π²/g) l, so g = 4π²/slope",
      eq: "A straight line through the origin, slope 4.03 s² m⁻¹",
      ind: "Use a large slope triangle; g = 39.48 ÷ 4.03 = 9.79 m/s²", indClass: "ind-both",
      why: "Plotting T against l gives a curve, but squaring T turns the formula into y = mx. The slope triangle averages all five readings, and a line that misses the origin exposes a constant error such as measuring only to the top of the bob."
    },
    resonance: {
      title: "Amplitude against driving frequency",
      example: "Lesson 7: the okada on Ridge Road, ridges 2.5 m apart, f₀ = 2.0 Hz",
      jump: "Resonance when f = f₀; f = v/d, so v = d f₀ = 18 km/h",
      eq: "A sharp peak at f₀; damping lowers and widens it",
      ind: "Lift-off where the curve rises above the dashed g/ω² line", indClass: "ind-both",
      why: "Slow or fast, the ridges push out of step with the bounce and little energy builds up. At 2.0 Hz every push arrives in time, and with a leaking damper the amplitude climbs past the lift-off line. Tap the damper button: a healthy shock absorber flattens the peak."
    }
  };

  /* ---------------- Paper.js chart ---------------- */
  var wrap = document.getElementById("combo-curve");
  var canvas = document.getElementById("combo-canvas");
  var el = {
    marker: document.getElementById("combo-marker"), slider: document.getElementById("combo-slider"),
    slideLabel: document.getElementById("combo-slide-label"), read: document.getElementById("combo-read"),
    damp: document.getElementById("combo-damp"), fallback: document.getElementById("combo-fallback")
  };
  var cur = "xva", ps = null, liveLayer = null;
  var PAD = { l: 50, r: 14, t: 14, b: 40 };

  function tok(name) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || getComputedStyle(document.body).color;
  }
  function col(name, alpha) { var c = new ps.Color(tok(name)); if (alpha != null) c.alpha = alpha; return c; }
  function font() { return tok("--font-mono").split(",")[0].replace(/["']/g, "").trim() || "monospace"; }

  function size() {
    var w = Math.max(260, wrap.clientWidth || 320);
    var h = Math.round(Math.max(220, Math.min(340, w * 0.62)));
    return { w: w, h: h };
  }
  function mapper(c, s) {
    var x0 = PAD.l, x1 = s.w - PAD.r, y0 = s.h - PAD.b, y1 = PAD.t;
    return {
      X: function (x) { return x0 + (x - c.x[0]) / (c.x[1] - c.x[0]) * (x1 - x0); },
      Y: function (y) { return y0 - (Math.max(c.y[0], Math.min(c.y[1], y)) - c.y[0]) / (c.y[1] - c.y[0]) * (y0 - y1); },
      x0: x0, x1: x1, y0: y0, y1: y1
    };
  }
  function text(pt, str, color, sizePx, just) {
    return new ps.PointText({ point: pt, content: str, fillColor: color, fontFamily: font(), fontSize: sizePx || 10.5, justification: just || "left" });
  }
  function curvePath(c, m, fn) {
    var p = new ps.Path(), N = 140, a = c.dom[0], b = c.dom[1];
    for (var i = 0; i <= N; i++) {
      var x = a + (b - a) * i / N, y = fn(x);
      if (!isFinite(y)) continue;
      if (y > c.y[1] * 1.02) { if (p.segments.length) { p.add(new ps.Point(m.X(x), m.Y(c.y[1]))); } continue; }
      p.add(new ps.Point(m.X(x), m.Y(y)));
    }
    return p;
  }

  function draw(key) {
    var c = CHARTS[key]; if (!c || !ps) return;
    cur = key;
    var s = size();
    ps.view.viewSize = new ps.Size(s.w, s.h);
    wrap.style.height = s.h + "px";
    ps.project.clear();
    var base = new ps.Layer(), m = mapper(c, s);
    var grid = col("--line-strong"), muted = col("--muted"), soft = col("--fg-soft");
    // grid + ticks
    c.yt.forEach(function (v, i) {
      var y = m.Y(v);
      new ps.Path.Line({ from: [m.x0, y], to: [m.x1, y], strokeColor: col("--line"), strokeWidth: 1 });
      text([m.x0 - 6, y + 3.5], c.ytl ? c.ytl[i] : String(+v.toFixed(2)), muted, 10, "right");
    });
    c.xt.forEach(function (v, i) {
      var x = m.X(v);
      new ps.Path.Line({ from: [x, m.y1], to: [x, m.y0], strokeColor: col("--line"), strokeWidth: 1 });
      text([x, m.y0 + 15], c.xtl ? c.xtl[i] : String(+v.toFixed(2)), muted, 10, "center");
    });
    // axes through zero where zero is on the chart
    var yz = c.y[0] < 0 && c.y[1] > 0 ? m.Y(0) : m.y0, xz = c.x[0] < 0 && c.x[1] > 0 ? m.X(0) : m.x0;
    new ps.Path.Line({ from: [m.x0, yz], to: [m.x1, yz], strokeColor: grid, strokeWidth: 1.4 });
    new ps.Path.Line({ from: [xz, m.y1], to: [xz, m.y0], strokeColor: grid, strokeWidth: 1.4 });
    text([(m.x0 + m.x1) / 2, s.h - 6], c.xl, soft, 11, "center");
    var yl = text([12, (m.y0 + m.y1) / 2], c.yl, soft, 11, "center"); yl.rotate(-90, yl.point);
    yl.position = new ps.Point(11, (m.y0 + m.y1) / 2);
    // guide lines
    (c.hlines || []).forEach(function (h) {
      new ps.Path.Line({ from: [m.x0, m.Y(h.y)], to: [m.x1, m.Y(h.y)], strokeColor: col("--pink-soft"), strokeWidth: 1.3, dashArray: [5, 5] });
      if (h.label) text([m.x1 - 4, m.Y(h.y) - 5], h.label, col("--pink-soft"), 10.5, "right");
    });
    (c.vlines || []).forEach(function (v) {
      new ps.Path.Line({ from: [m.X(v.x), m.y1], to: [m.X(v.x), m.y0], strokeColor: col("--sky"), strokeWidth: 1.2, dashArray: [4, 4] });
      var right = v.x > (c.x[0] + c.x[1]) / 2;
      if (v.label) text([m.X(v.x) + (right ? -4 : 4), m.y0 - 6], v.label, col("--sky"), 10, right ? "right" : "left");
    });
    // slope triangle
    if (c.tri) {
      var a = c.tri[0], b = c.tri[1];
      new ps.Path({ segments: [[m.X(a[0]), m.Y(a[1])], [m.X(b[0]), m.Y(a[1])], [m.X(b[0]), m.Y(b[1])]], closed: true, fillColor: col("--teal", 0.12), strokeColor: col("--teal"), strokeWidth: 1.2, dashArray: [4, 3] });
      text([m.X((a[0] + b[0]) / 2), m.Y(a[1]) + 13], "Δl = 0.600 m", col("--teal"), 10, "center");
      text([m.X(b[0]) - 5, m.Y(a[1] + (b[1] - a[1]) * 0.28)], "ΔT² = 2.419 s²", col("--teal"), 10, "right");
    }
    // inactive damping curve (ghost) on the resonance tab
    if (c.damp) {
      var other = damp.zeta < 0.1 ? 0.30 : 0.05;
      var gp = curvePath(c, m, function (f) { return respA(f, other); });
      gp.strokeColor = col("--fg-soft", 0.35); gp.strokeWidth = 1.4; gp.dashArray = [2, 4];
    }
    // curves + legend
    c.paths = [];
    c.curves.forEach(function (cv, i) {
      var p = curvePath(c, m, cv.fn);
      p.strokeColor = col(cv.c); p.strokeWidth = cv.w; p.strokeCap = "round"; p.strokeJoin = "round";
      if (cv.dash) p.dashArray = cv.dash;
      c.paths.push(p);
      var lx = m.x0 + 8 + i * Math.min(110, (m.x1 - m.x0 - 16) / c.curves.length);
      new ps.Path.Line({ from: [lx, m.y1 + 4], to: [lx + 14, m.y1 + 4], strokeColor: col(cv.c), strokeWidth: 3, dashArray: cv.dash || [] });
      text([lx + 18, m.y1 + 7.5], cv.label, col(cv.c), 10.5, "left");
    });
    if (c.damp) text([m.x0 + 8, m.y1 + 22], "ζ = " + damp.zeta.toFixed(2) + (damp.zeta < 0.1 ? " (leaking)" : " (healthy)"), col("--amber"), 10.5, "left");
    // data points
    (c.pts || []).forEach(function (p) {
      new ps.Path.Circle({ center: [m.X(p[0]), m.Y(p[1])], radius: 4.5, fillColor: col("--ink-950"), strokeColor: col("--amber"), strokeWidth: 2 });
    });
    liveLayer = new ps.Layer();
    c.m = m;
    if (el.slideLabel) el.slideLabel.textContent = c.slide;
    if (el.damp) el.damp.hidden = !c.damp;
    base.activate();
    move();
  }

  function move() {
    var c = CHARTS[cur]; if (!c || !c.m || !liveLayer) return;
    var m = c.m, u = (+el.slider.value) / 1000;
    var x = c.snap(c.dom[0] + (c.dom[1] - c.dom[0]) * u);
    liveLayer.removeChildren(); liveLayer.activate();
    var first = null;
    if (c.vcursor) new ps.Path.Line({ from: [m.X(x), m.y1], to: [m.X(x), m.y0], strokeColor: col("--fg-soft", 0.55), strokeWidth: 1, dashArray: [3, 4] });
    c.markOn.forEach(function (ci, k) {
      var cv = c.curves[ci], y = cv.fn(x);
      if (!isFinite(y)) return;
      var pt = new ps.Point(m.X(x), m.Y(y));
      if (k === 0 && !c.vcursor) {
        new ps.Path.Line({ from: [pt.x, pt.y], to: [pt.x, m.y0], strokeColor: col(cv.c, 0.7), strokeWidth: 1, dashArray: [3, 4] });
        new ps.Path.Line({ from: [m.x0, pt.y], to: [pt.x, pt.y], strokeColor: col(cv.c, 0.7), strokeWidth: 1, dashArray: [3, 4] });
      }
      new ps.Path.Circle({ center: pt, radius: k === 0 ? 7 : 5.5, fillColor: col(cv.c), strokeColor: col("--ink-950"), strokeWidth: 2 });
      if (!first) first = pt;
    });
    ps.view.update();
    if (el.marker && first) { el.marker.style.left = first.x + "px"; el.marker.style.top = first.y + "px"; }
    if (el.read) {
      el.read.innerHTML = "";
      c.read(x).forEach(function (r) {
        var div = document.createElement("div"), sp = document.createElement("span"), b = document.createElement("b");
        sp.textContent = r[0]; b.textContent = r[1]; div.appendChild(sp); div.appendChild(b); el.read.appendChild(div);
      });
    }
  }

  function selectTab(key) {
    var c = CHARTS[key]; if (!c) return;
    if (el.slider) el.slider.value = Math.round(c.start * 1000);
    draw(key);
  }

  if (wrap && canvas && el.slider && window.paper) {
    try {
      ps = new paper.PaperScope();
      ps.setup(canvas);
      el.slider.addEventListener("input", move);
      document.querySelectorAll(".combo-tab[data-combo]").forEach(function (t) {
        t.addEventListener("click", function () { selectTab(t.getAttribute("data-combo")); });
      });
      if (el.damp) el.damp.addEventListener("click", function () {
        damp.zeta = damp.zeta < 0.1 ? 0.30 : 0.05;
        el.damp.setAttribute("aria-pressed", damp.zeta < 0.1 ? "false" : "true");
        el.damp.textContent = damp.zeta < 0.1 ? "Fit a healthy damper" : "Back to the leaking damper";
        draw(cur);
        document.dispatchEvent(new CustomEvent("hub:damp", { detail: { zeta: damp.zeta } }));
      });
      var rt = null, lastW = 0;
      var onResize = function () {
        clearTimeout(rt);
        rt = setTimeout(function () { var w = wrap.clientWidth; if (Math.abs(w - lastW) > 2) { lastW = w; draw(cur); } }, 120);
      };
      if (window.ResizeObserver) new ResizeObserver(onResize).observe(wrap); else window.addEventListener("resize", onResize);
      selectTab("xva");
      lastW = wrap.clientWidth;
      // fonts load after first paint: redraw once so the axis text uses the theme's mono face
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { draw(cur); });
    } catch (e) {
      if (window.console) console.warn("Explorer: Paper.js chart disabled", e);
      if (el.fallback) el.fallback.hidden = false;
    }
  } else if (el.fallback) { el.fallback.hidden = false; }

  /* ---------------- archetype chains: typeset with StudyMath when it loads ---------------- */
  function typeset() {
    if (!window.StudyMath || !StudyMath.tex) return;
    document.querySelectorAll(".arch-steps .tex[data-tex]").forEach(function (n) {
      try { var html = StudyMath.tex(n.getAttribute("data-tex"), false); if (html) n.innerHTML = html; } catch (e) { /* keep the plain-text fallback */ }
    });
  }
  if (document.readyState === "complete") typeset(); else window.addEventListener("load", typeset);
})();
