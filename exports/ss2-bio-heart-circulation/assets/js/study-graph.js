/* =========================================================
   StudyPipe · StudyGraph — phone-first SVG graph plotter
   Classic script, no dependencies, fully offline.

   var g = StudyGraph.create(el, {
     theme: "paper" | "dark",
     x: { label: "Current I", unit: "A", min: 0, max: 1.5 },
     y: { label: "Potential difference V", unit: "V", min: 0, max: 3 },
     aria: "Graph of V against I"
   });
   g.set({
     series: [{
       id: "std", name: "Constantan", tone: "teal",
       points: [[0.25, 0.55], ...],      // plotted dots
       fit: "line" | "origin" | null,    // least-squares best-fit line
       extend: true,                     // stretch fit line to the axes
       join: false,                      // join dots in order (non-linear data)
       fn: function (x) { ... },         // smooth theory curve y = f(x)
       fnRange: [x0, x1], dashed: false,
       slope: { dx: "ΔI", dy: "ΔV", unit: "Ω", name: "R" },   // slope triangle on the fit
       yIntercept: "E", xIntercept: "I_short"                  // label the intercepts
     }],
     guides: [{ axis: "y", value: 1.5, label: "E_x = 1.50 V", tone: "pink" }],
     marker: { x: 0.75, y: 1.65, label: "Now", tone: "amber" }
   });
   g.fitOf("std") -> { m, c } or null
   ========================================================= */
(function () {
  "use strict";
  var NS = "http://www.w3.org/2000/svg";

  function niceStep(range, target) {
    var raw = range / Math.max(1, target);
    var p = Math.pow(10, Math.floor(Math.log10(raw)));
    var f = raw / p;
    var n = f < 1.5 ? 1 : f < 3 ? 2 : f < 7 ? 5 : 10;
    return n * p;
  }
  function decimalsFor(step) {
    if (step >= 1) return 0;
    return Math.min(4, Math.ceil(-Math.log10(step) - 1e-9));
  }
  function fmt(v, d) {
    if (Math.abs(v) < 1e-9) v = 0;
    var s = v.toFixed(d);
    return s.replace("-", "−");
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function leastSquares(pts, throughOrigin) {
    if (!pts || pts.length < (throughOrigin ? 1 : 2)) return null;
    var n = pts.length, sx = 0, sy = 0, sxx = 0, sxy = 0;
    pts.forEach(function (p) { sx += p[0]; sy += p[1]; sxx += p[0] * p[0]; sxy += p[0] * p[1]; });
    if (throughOrigin) return sxx ? { m: sxy / sxx, c: 0 } : null;
    var den = n * sxx - sx * sx;
    if (Math.abs(den) < 1e-12) return null;
    var m = (n * sxy - sx * sy) / den;
    return { m: m, c: (sy - m * sx) / n };
  }

  function create(el, opts) {
    if (!el) return null;
    opts = opts || {};
    var state = { series: [], guides: [], marker: null, prevKeys: {} };
    el.classList.add("sg", "sg-" + (opts.theme || "paper"));
    el.innerHTML = "";
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", opts.aria || "Graph");
    el.appendChild(svg);
    var legend = document.createElement("div");
    legend.className = "sg-legend";
    el.appendChild(legend);

    var tip = { key: null };

    function axisRange(ax) {
      var min = ax.min != null ? ax.min : 0, max = ax.max != null ? ax.max : 1;
      if (ax.auto) {
        var vals = [];
        state.series.forEach(function (s) { (s.points || []).forEach(function (p) { vals.push(ax === opts.x ? p[0] : p[1]); }); });
        if (vals.length) {
          var hi = Math.max.apply(null, vals);
          if (hi > max) max = hi * 1.12;
        }
      }
      return { min: min, max: max };
    }

    function render() {
      var cs = getComputedStyle(el), padX = (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0);
      var W = Math.max(260, Math.round((el.clientWidth || 320) - padX));
      var H = Math.round(Math.max(220, Math.min(380, W * (opts.ratio || 0.74))));
      var small = W < 380;
      var fs = small ? 11 : 12;
      var pad = { l: small ? 46 : 54, r: small ? 14 : 20, t: 18, b: small ? 44 : 48 };
      var pw = W - pad.l - pad.r, ph = H - pad.t - pad.b;
      var xr = axisRange(opts.x || {}), yr = axisRange(opts.y || {});
      var xs = opts.x.step || niceStep(xr.max - xr.min, small ? 5 : 7);
      var ys = opts.y.step || niceStep(yr.max - yr.min, small ? 5 : 6);
      var xd = opts.x.decimals != null ? opts.x.decimals : decimalsFor(xs);
      var yd = opts.y.decimals != null ? opts.y.decimals : decimalsFor(ys);
      // widen the left margin so long tick labels never collide with the rotated y title
      var widest = Math.max(fmt(yr.max, yd).length, fmt(yr.min, yd).length);
      pad.l = Math.max(pad.l, Math.round(widest * fs * 0.62 + (small ? 26 : 30)));
      pw = W - pad.l - pad.r;
      function X(v) { return pad.l + (v - xr.min) / (xr.max - xr.min) * pw; }
      function Y(v) { return pad.t + ph - (v - yr.min) / (yr.max - yr.min) * ph; }
      function inX(v) { return v >= xr.min - 1e-9 && v <= xr.max + 1e-9; }
      function inY(v) { return v >= yr.min - 1e-9 && v <= yr.max + 1e-9; }

      svg.setAttribute("viewBox", "0 0 " + W + " " + H);
      svg.setAttribute("width", W);
      svg.setAttribute("height", H);
      var o = [];
      o.push('<defs><clipPath id="' + clipId + '"><rect x="' + pad.l + '" y="' + pad.t + '" width="' + pw + '" height="' + ph + '"/></clipPath></defs>');
      o.push('<rect class="sg-plot" x="' + pad.l + '" y="' + pad.t + '" width="' + pw + '" height="' + ph + '" rx="6"/>');

      // grid + ticks
      var v, i;
      for (v = Math.ceil(xr.min / xs) * xs, i = 0; v <= xr.max + xs * 1e-6 && i < 40; v += xs, i++) {
        var gx = X(v).toFixed(1);
        o.push('<line class="sg-grid" x1="' + gx + '" y1="' + pad.t + '" x2="' + gx + '" y2="' + (pad.t + ph) + '"/>');
        o.push('<text class="sg-tick" x="' + gx + '" y="' + (pad.t + ph + fs + 5) + '" text-anchor="middle" font-size="' + fs + '">' + fmt(v, xd) + "</text>");
      }
      for (v = Math.ceil(yr.min / ys) * ys, i = 0; v <= yr.max + ys * 1e-6 && i < 40; v += ys, i++) {
        var gy = Y(v).toFixed(1);
        o.push('<line class="sg-grid" x1="' + pad.l + '" y1="' + gy + '" x2="' + (pad.l + pw) + '" y2="' + gy + '"/>');
        o.push('<text class="sg-tick" x="' + (pad.l - 7) + '" y="' + (+gy + 4) + '" text-anchor="end" font-size="' + fs + '">' + fmt(v, yd) + "</text>");
      }
      // axes through zero when in range, else at the plot edge
      var ax0 = inY(0) ? Y(0) : pad.t + ph, ay0 = inX(0) ? X(0) : pad.l;
      o.push('<line class="sg-axis" x1="' + pad.l + '" y1="' + ax0 + '" x2="' + (pad.l + pw) + '" y2="' + ax0 + '"/>');
      o.push('<line class="sg-axis" x1="' + ay0 + '" y1="' + pad.t + '" x2="' + ay0 + '" y2="' + (pad.t + ph) + '"/>');
      // axis titles
      function title(ax) { return esc(ax.label || "") + (ax.unit ? " / " + esc(ax.unit) : ""); }
      o.push('<text class="sg-title" x="' + (pad.l + pw / 2) + '" y="' + (H - 8) + '" text-anchor="middle" font-size="' + (fs + 0.5) + '">' + title(opts.x) + "</text>");
      o.push('<text class="sg-title" transform="translate(' + (small ? 12 : 15) + "," + (pad.t + ph / 2) + ') rotate(-90)" text-anchor="middle" font-size="' + (fs + 0.5) + '">' + title(opts.y) + "</text>");

      var labels = [], post = [];
      o.push('<g clip-path="url(#' + clipId + ')">');
      // guides
      state.guides.forEach(function (g) {
        var t = "sg-t-" + (g.tone || "muted");
        if (g.axis === "y" && inY(g.value)) {
          o.push('<line class="sg-guide ' + t + '" x1="' + pad.l + '" y1="' + Y(g.value) + '" x2="' + (pad.l + pw) + '" y2="' + Y(g.value) + '"/>');
          if (g.label) labels.push({ x: pad.l + pw - 4, y: Y(g.value) + (Y(g.value) < pad.t + 16 ? 14 : -6), a: "end", cls: t + " sg-strong", txt: g.label });
        } else if (g.axis === "x" && inX(g.value)) {
          o.push('<line class="sg-guide ' + t + '" x1="' + X(g.value) + '" y1="' + pad.t + '" x2="' + X(g.value) + '" y2="' + (pad.t + ph) + '"/>');
          if (g.label) labels.push({ x: X(g.value) + (X(g.value) > pad.l + pw * 0.7 ? -5 : 5), y: pad.t + 13, a: X(g.value) > pad.l + pw * 0.7 ? "end" : "start", cls: t + " sg-strong", txt: g.label });
        }
      });
      // curves + fits
      state.series.forEach(function (s) {
        var t = "sg-t-" + (s.tone || "teal");
        if (s.fn) {
          var a = s.fnRange ? s.fnRange[0] : xr.min, b = s.fnRange ? s.fnRange[1] : xr.max, d = [], N = 90;
          for (var k = 0; k <= N; k++) {
            var xx = a + (b - a) * k / N, yy = s.fn(xx);
            if (!isFinite(yy)) continue;
            yy = Math.max(yr.min - (yr.max - yr.min), Math.min(yr.max + (yr.max - yr.min), yy));
            d.push((d.length ? "L" : "M") + X(xx).toFixed(1) + " " + Y(yy).toFixed(1));
          }
          o.push('<path class="sg-curve ' + t + (s.dashed ? " sg-dash" : "") + '" d="' + d.join(" ") + '"/>');
        }
        if (s.join && s.points && s.points.length > 1) {
          var sorted = s.points.slice().sort(function (p, q) { return p[0] - q[0]; });
          o.push('<polyline class="sg-join ' + t + '" points="' + sorted.map(function (p) { return X(p[0]).toFixed(1) + "," + Y(p[1]).toFixed(1); }).join(" ") + '"/>');
        }
        var fit = s.fit ? leastSquares(s.points, s.fit === "origin") : null;
        s._fit = fit;
        if (fit) {
          var xa, xb;
          if (s.extend) {
            xa = xr.min; xb = xr.max;
            if (fit.m !== 0) {
              // stop at the x-axis / top edge so the line doesn't run off the plot
              var xAtYmin = (yr.min - fit.c) / fit.m, xAtYmax = (yr.max - fit.c) / fit.m;
              var lo = Math.min(xAtYmin, xAtYmax), hi = Math.max(xAtYmin, xAtYmax);
              xa = Math.max(xa, lo); xb = Math.min(xb, hi);
            }
          } else {
            var xsx = s.points.map(function (p) { return p[0]; });
            xa = Math.min.apply(null, xsx); xb = Math.max.apply(null, xsx);
          }
          o.push('<line class="sg-fit ' + t + '" x1="' + X(xa) + '" y1="' + Y(fit.m * xa + fit.c) + '" x2="' + X(xb) + '" y2="' + Y(fit.m * xb + fit.c) + '"/>');
          if (s.slope && s.points.length >= 2) {
            var px = s.points.map(function (p) { return p[0]; });
            var x1 = Math.min.apply(null, px), x2 = Math.max.apply(null, px);
            var sx1 = x1 + (x2 - x1) * 0.2, sx2 = x1 + (x2 - x1) * 0.8;
            var sy1 = fit.m * sx1 + fit.c, sy2 = fit.m * sx2 + fit.c;
            // right-angle corner sits below a rising line and above a falling one
            var cx = sx2, cy = sy1;
            o.push('<path class="sg-tri ' + t + '" d="M' + X(sx1) + " " + Y(sy1) + " L" + X(cx) + " " + Y(cy) + " L" + X(sx2) + " " + Y(sy2) + '"/>');
            labels.push({ x: (X(sx1) + X(cx)) / 2, y: Y(cy) + (fit.m >= 0 ? 14 : -7), a: "middle", cls: t, txt: (s.slope.dx || "Δx") + " = " + fmt(sx2 - sx1, s.slope.dxDec != null ? s.slope.dxDec : 2) });
            labels.push({ x: X(cx) + 6, y: (Y(cy) + Y(sy2)) / 2 + 4, a: "start", cls: t, txt: (s.slope.dy || "Δy") + " = " + fmt(sy2 - sy1, s.slope.dyDec != null ? s.slope.dyDec : 2) });
          }
          if (s.yIntercept && inY(fit.c) && inX(0)) {
            post.push('<circle class="sg-int ' + t + '" cx="' + X(0) + '" cy="' + Y(fit.c) + '" r="5"/>');
            labels.push({ x: X(0) + 9, y: Y(fit.c) - 8, a: "start", cls: t + " sg-strong", txt: s.yIntercept + " = " + fmt(fit.c, s.yDec != null ? s.yDec : 2) + (opts.y.unit ? " " + opts.y.unit : "") });
          }
          if (s.xIntercept && fit.m !== 0) {
            var xi = -fit.c / fit.m;
            if (inX(xi) && inY(0)) {
              post.push('<circle class="sg-int ' + t + '" cx="' + X(xi) + '" cy="' + Y(0) + '" r="5"/>');
              labels.push({ x: X(xi) - 6, y: Y(0) - 9, a: "end", cls: t + " sg-strong", txt: s.xIntercept + " = " + fmt(xi, s.xDec != null ? s.xDec : 2) + (opts.x.unit ? " " + opts.x.unit : "") });
            }
          }
        }
      });
      o.push("</g>");
      o.push(post.join(""));

      // points (outside the clip so edge dots stay round)
      var keys = {}, placed = [];
      state.series.forEach(function (s) {
        var t = "sg-t-" + (s.tone || "teal");
        (s.points || []).forEach(function (p, idx) {
          if (!inX(p[0]) || !inY(p[1])) return;
          var key = (s.id || s.name) + ":" + p[0] + ":" + p[1];
          keys[key] = true;
          var isNew = !state.prevKeys[key];
          // a dot from another series on the same spot is nudged sideways so both stay visible
          var px0 = X(p[0]), py0 = Y(p[1]), nudge = 0;
          placed.forEach(function (q) { if (q.s !== s && Math.abs(q.x - px0) < 4 && Math.abs(q.y - py0) < 4) nudge += 7; });
          placed.push({ x: px0, y: py0, s: s });
          o.push('<g class="sg-pt ' + t + (isNew ? " sg-new" : "") + '" data-k="' + esc(key) + '" data-x="' + p[0] + '" data-y="' + p[1] + '" data-s="' + esc(s.name || "") + '" transform="translate(' + (px0 + nudge).toFixed(1) + "," + py0.toFixed(1) + ')">' +
            '<circle class="sg-hit" r="14"/>' + (s.shape === "square" ? '<rect x="-4.5" y="-4.5" width="9" height="9" rx="1.5"/>' : '<circle r="5"/>') + "</g>");
        });
      });
      state.prevKeys = keys;

      // live marker
      if (state.marker && inX(state.marker.x) && inY(state.marker.y)) {
        var m = state.marker, mt = "sg-t-" + (m.tone || "amber");
        o.push('<line class="sg-drop ' + mt + '" x1="' + X(m.x) + '" y1="' + Y(m.y) + '" x2="' + X(m.x) + '" y2="' + ax0 + '"/>');
        o.push('<line class="sg-drop ' + mt + '" x1="' + X(m.x) + '" y1="' + Y(m.y) + '" x2="' + ay0 + '" y2="' + Y(m.y) + '"/>');
        o.push('<g class="sg-marker ' + mt + '" transform="translate(' + X(m.x).toFixed(1) + "," + Y(m.y).toFixed(1) + ')"><circle class="sg-halo" r="11"/><circle r="6"/></g>');
        if (m.label) labels.push({ x: X(m.x) + (X(m.x) > pad.l + pw * 0.7 ? -10 : 10), y: Y(m.y) + (m.labelPos === "below" ? 20 : -12), a: X(m.x) > pad.l + pw * 0.7 ? "end" : "start", cls: mt + " sg-strong", txt: m.label });
      }

      // tapped point readout
      if (tip.key) {
        var hit = null;
        state.series.forEach(function (s) { (s.points || []).forEach(function (p) { if ((s.id || s.name) + ":" + p[0] + ":" + p[1] === tip.key) hit = { s: s, p: p }; }); });
        if (hit) {
          var tx = X(hit.p[0]), ty = Y(hit.p[1]);
          var txt = "(" + fmt(hit.p[0], Math.max(xd, 2)) + ", " + fmt(hit.p[1], Math.max(yd, 2)) + ")";
          labels.push({ x: tx + (tx > pad.l + pw * 0.6 ? -10 : 10), y: ty + (ty < pad.t + 30 ? 22 : -12), a: tx > pad.l + pw * 0.6 ? "end" : "start", cls: "sg-t-" + (hit.s.tone || "teal") + " sg-strong", txt: txt });
        }
      }

      labels.forEach(function (lb) {
        var x = Math.max(4, Math.min(W - 4, lb.x));
        lb.y = Math.max(pad.t + 10, Math.min(pad.t + ph + 2, lb.y));
        o.push('<text class="sg-lab ' + lb.cls + '" x="' + x.toFixed(1) + '" y="' + lb.y.toFixed(1) + '" text-anchor="' + lb.a + '" font-size="' + fs + '">' + esc(lb.txt) + "</text>");
      });

      svg.innerHTML = o.join("");
      paintLegend();
    }

    function paintLegend() {
      var items = state.series.filter(function (s) { return s.name && !s.hideLegend; }).map(function (s) {
        var extra = "";
        if (s._fit && s.slope) {
          extra = ' <span class="sg-leg-v">' + esc(s.slope.name || "gradient") + " = " + fmt(s.slope.abs ? Math.abs(s._fit.m) : s._fit.m, s.slope.dec != null ? s.slope.dec : 2) + (s.slope.unit ? " " + esc(s.slope.unit) : "") + "</span>";
        } else if (s.note) extra = ' <span class="sg-leg-v">' + esc(s.note) + "</span>";
        var sw = s.fn && !s.points ? "sg-sw-line" : "sg-sw-dot";
        return '<span class="sg-leg sg-t-' + (s.tone || "teal") + '"><i class="' + sw + (s.dashed ? " sg-dash" : "") + '"></i><span>' + esc(s.name) + extra + "</span></span>";
      });
      legend.innerHTML = items.join("");
      legend.hidden = !items.length;
    }

    var clipId = "sgc" + Math.random().toString(36).slice(2, 8);

    svg.addEventListener("click", function (e) {
      var pt = e.target.closest && e.target.closest(".sg-pt");
      tip.key = pt ? (tip.key === pt.getAttribute("data-k") ? null : pt.getAttribute("data-k")) : null;
      render();
    });

    var raf = 0;
    function schedule() { cancelAnimationFrame(raf); raf = requestAnimationFrame(render); }
    if (window.ResizeObserver) new ResizeObserver(schedule).observe(el); else window.addEventListener("resize", schedule);

    var api = {
      set: function (o2) {
        if (o2.series) state.series = o2.series;
        if (o2.guides) state.guides = o2.guides;
        if ("marker" in o2) state.marker = o2.marker;
        if (o2.x) opts.x = Object.assign({}, opts.x, o2.x);
        if (o2.y) opts.y = Object.assign({}, opts.y, o2.y);
        if (o2.aria) svg.setAttribute("aria-label", o2.aria);
        render();
        return api;
      },
      marker: function (m) { state.marker = m; render(); return api; },
      fitOf: function (id) {
        var s = state.series.filter(function (q) { return q.id === id; })[0];
        return s ? s._fit || null : null;
      },
      render: render,
      el: el
    };
    render();
    return api;
  }

  window.StudyGraph = { create: create, leastSquares: leastSquares, niceStep: niceStep };
})();
