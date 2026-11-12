/* Lesson 05 · 3D Zoom "Error detective" (window.StudyScenes.zoom)
   PendulumKit v3 "practical" replays a chosen fault in slow motion (count overlay 1, 2, 3… vs 0, 1, 2…; watch started
   at the extreme; set-square stopping at the top of the bob; a 40° swing; a conical path seen from above) and
   "ceiling" shows the floor-height variant (H = 2.80 m, l = H − y). A mini StudyGraph in #zoom-graph shows how the
   points and g shift. Every number comes from PendulumKit.model. Emits l5:zoom { mode }. */
(function () {
  "use strict";
  var root = document.getElementById("zoom-stage");
  var canvas = document.getElementById("zoom-canvas");
  if (!root || !canvas) return;
  var $ = function (s) { return document.querySelector(s); };
  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };

  var FOURPI2 = 4 * Math.PI * Math.PI, G_CLASS = 9.79, L0 = 0.400, H = 2.80, G_CEIL = 9.8;
  var LABEL = { "none": "No fault", "count-from-1": "Counts from one", "time-from-extreme": "Starts at the extreme", "length-to-top": "Length to the top", "wide-angle": "Wide 40° swing", "conical": "Conical swing" };
  var HINT = {
    "none": "Counting starts at zero as the bob passes the rest mark.",
    "count-from-1": "Watch the counter: \"1\" at the start, so \"20\" is only 19 swings. T too small, g too large.",
    "time-from-extreme": "The bob is slowest at the extreme, so the start and stop are fuzzy. A random error.",
    "length-to-top": "The set-square stops at the top of the bob: every l is short by r. The line shifts left, the slope stays.",
    "wide-angle": "At 40° the period is about 3 % longer than 2π√(l/g), so g comes out too small.",
    "conical": "Seen from above the bob traces a circle. The period is shorter, so g comes out too large."
  };
  var YS = [1.80, 2.00, 2.20, 2.40];
  var st = { mode: "detective", fault: "count-from-1", y: 1.80 };

  var M = window.PendulumKit ? PendulumKit.model : null;
  var readout = $("#zoom-readout"), hint = $("#zoom-hint");
  var faultWrap = $("#zoom-faults"), yWrap = $("#zoom-ys");
  var faultBtns = Array.prototype.slice.call(document.querySelectorAll("#zoom-faults [data-f]"));
  var yBtns = Array.prototype.slice.call(document.querySelectorAll("#zoom-ys [data-y]"));
  var modeBtns = Array.prototype.slice.call(document.querySelectorAll("#zoom-mode [data-zm]"));

  // ---------- mini graph ----------
  var graphEl = $("#zoom-graph"), graph = null;
  if (graphEl && window.StudyGraph) graph = StudyGraph.create(graphEl, { theme: "paper", x: { label: "l", unit: "m", min: 0, max: 1.1, step: 0.2, decimals: 1 }, y: { label: "T²", unit: "s²", min: 0, max: 4.5, step: 1, decimals: 0 }, ratio: 0.7, aria: "Mini graph of T squared against l with and without the chosen fault" });

  function lineFit(pts) { return window.StudyGraph ? StudyGraph.leastSquares(pts, false) : null; }
  function faultPoints(f) { return M.presets.map(function (l) { var P = M.practical(l, { fault: f, g: G_CLASS }); return [+P.l.toFixed(3), +P.T2.toFixed(4)]; }); }

  function paintDetective() {
    var P = M.practical(L0, { fault: st.fault, g: G_CLASS }), pct = 100 * (P.g_from_T - G_CLASS) / G_CLASS;
    var good = faultPoints("none"), bad = faultPoints(st.fault), fg = lineFit(good), fb = lineFit(bad);
    var gSlope = fb ? FOURPI2 / fb.m : null;
    if (readout) readout.innerHTML =
      "<div><span>l / m</span><b>" + P.l.toFixed(3) + "</b></div>" +
      "<div><span>T / s</span><b>" + P.T.toFixed(3) + "</b></div>" +
      '<div class="' + (Math.abs(pct) > 0.5 ? "is-warn" : "is-ok") + '"><span>g · 1 reading</span><b>' + P.g_from_T.toFixed(2) + "</b></div>" +
      '<div class="' + (Math.abs(pct) > 0.5 ? "is-warn" : "is-ok") + '"><span>error</span><b>' + (pct >= 0 ? "+" : "−") + Math.abs(pct).toFixed(1) + " %</b></div>";
    if (graph) {
      var series = [{ id: "good", name: "Correct", tone: "teal", points: good, fit: "line", extend: true }];
      if (st.fault !== "none") series.push({ id: "bad", name: LABEL[st.fault] + " · g from slope " + gSlope.toFixed(2), tone: "pink", points: bad, fit: "line", extend: true, yIntercept: st.fault === "length-to-top" ? "c" : null, yDec: 3 });
      graph.set({ x: { label: "l", unit: "m", min: 0, max: 1.1, step: 0.2, decimals: 1 }, y: { label: "T²", unit: "s²", min: 0, max: 4.5, step: 1, decimals: 0 }, series: series, marker: null });
    }
    var gn = $("#zoom-graph-note");
    if (gn) gn.innerHTML = st.fault === "none"
      ? "Correct readings: slope " + fg.m.toFixed(2) + " s² m⁻¹ → g = <b>" + (FOURPI2 / fg.m).toFixed(2) + " m s⁻²</b>."
      : "With this fault the slope is " + fb.m.toFixed(2) + " s² m⁻¹ → g = <b>" + gSlope.toFixed(2) + " m s⁻²</b>" +
        (st.fault === "length-to-top" ? " — unchanged: the line only moves left and misses the origin. A single reading would be " + Math.abs(pct).toFixed(1) + " % too low." : ".");
    if (hint) hint.textContent = HINT[st.fault];
  }
  function paintCeiling() {
    var C = M.ceiling(H, st.y, G_CEIL, 20);
    if (readout) readout.innerHTML =
      "<div><span>y / m</span><b>" + st.y.toFixed(2) + "</b></div>" +
      "<div><span>l = H − y</span><b>" + C.l.toFixed(2) + " m</b></div>" +
      "<div><span>T² / s²</span><b>" + C.T2.toFixed(3) + "</b></div>" +
      '<div class="is-ok"><span>slope</span><b>' + C.slope.toFixed(2).replace("-", "−") + "</b></div>";
    if (graph) {
      var pts = YS.map(function (y) { return [y, +M.ceiling(H, y, G_CEIL, 20).T2.toFixed(3)]; });
      graph.set({ x: { label: "Height y", unit: "m", min: 0, max: 3.0, step: 0.5, decimals: 1 }, y: { label: "T²", unit: "s²", min: 0, max: 6, step: 1, decimals: 0 },
        series: [{ id: "ceil", name: "T² against y", tone: "violet", points: pts, fit: "line", extend: true, xIntercept: "H", xDec: 2 }],
        marker: { x: st.y, y: C.T2, label: "y " + st.y.toFixed(2), tone: "amber" } });
    }
    var gn = $("#zoom-graph-note");
    if (gn) gn.innerHTML = "The line slopes <b>downwards</b> (slope −4π²/g = " + C.slope.toFixed(2).replace("-", "−") + " s² m⁻¹, so g = " + (FOURPI2 / -C.slope).toFixed(2) + " m s⁻²) and cuts the horizontal (y) axis, where T² = 0, at <b>y = H = " + H.toFixed(2) + " m</b>, the height of the support.";
    if (hint) hint.textContent = "Ceiling rig: measure y, the height of the bob's centre above the floor; then l = H − y.";
  }
  function paint() { if (!M) return; if (st.mode === "ceiling") paintCeiling(); else paintDetective(); }

  // ---------- 3D ----------
  var kit = null, stage = null;
  if (typeof THREE !== "undefined" && window.PendulumKit && window.SceneKit) {
    kit = PendulumKit.create({ mode: "practical", g: G_CLASS, periodModel: "small", r_bob: 0.020, l: L0, fault: st.fault, speed: 0.4, labels: window.innerWidth >= 560 });
    stage = SceneKit.createStage({ root: root, canvas: canvas, fov: 32, target: new THREE.Vector3(0, 0.7, 0), pitch: 0.1, distance: 4, portraitPitch: 0.05, onFrame: function (dt, t) { kit.update(dt, t); } });
    if (stage) { stage.rig.add(kit); stage.start(); }
  } else {
    root.classList.add("no-webgl");
  }
  var replayT = null;
  function topView(on) {
    if (!stage) return;
    stage.resize();
    if (on) stage.pitch = 1.1;
  }
  function replay() {
    if (!kit) return;
    clearTimeout(replayT);
    if (st.mode === "ceiling") {
      kit.setState({ mode: "ceiling", y: st.y, H: H, g: G_CEIL, speed: 0.6 });
      kit.release();
      return;
    }
    kit.setState({ mode: "practical", l: L0, fault: st.fault, g: G_CLASS, speed: 0.4 });
    if (st.fault === "length-to-top") { kit.measure(); return; }
    kit.release();
    replayT = setTimeout(function () { kit.time(20); }, 1200);
  }

  function setFault(f) {
    if (!LABEL[f]) return;
    st.fault = f;
    faultBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-f") === f)); });
    if (st.mode !== "detective") setZoomMode("detective", true);
    paint(); replay();
    topView(f === "conical");
    emit("l5:zoom", { mode: "fault:" + f });
  }
  function setY(y) {
    st.y = +y;
    yBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(Math.abs(+b.getAttribute("data-y") - st.y) < 1e-6)); });
    paint(); replay();
    emit("l5:zoom", { mode: "ceiling", y: st.y });
  }
  function setZoomMode(m, quiet) {
    if (m !== "detective" && m !== "ceiling") return;
    st.mode = m;
    modeBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-zm") === m)); });
    if (faultWrap) faultWrap.hidden = m !== "detective";
    if (yWrap) yWrap.hidden = m !== "ceiling";
    if (kit) { kit.setState({ mode: m === "ceiling" ? "ceiling" : "practical" }); if (stage) { stage.refit(); } }
    if (!quiet) { paint(); replay(); topView(m === "detective" && st.fault === "conical"); emit("l5:zoom", { mode: m }); }
  }

  faultBtns.forEach(function (b) { b.addEventListener("click", function () { setFault(b.getAttribute("data-f")); }); });
  yBtns.forEach(function (b) { b.addEventListener("click", function () { setY(b.getAttribute("data-y")); }); });
  modeBtns.forEach(function (b) { b.addEventListener("click", function () { setZoomMode(b.getAttribute("data-zm")); }); });
  var rp = $("#zoom-replay"); if (rp) rp.addEventListener("click", replay);
  var rs = $("#zoom-reset"); if (rs) rs.addEventListener("click", function () { api.reset(); });

  var api = {
    setMode: function (m) {
      m = String(m || "");
      if (m.indexOf("fault:") === 0) setFault(m.slice(6));
      else if (m === "ceiling" || m === "detective") setZoomMode(m);
      else if (LABEL[m]) setFault(m);
    },
    setY: setY, replay: replay,
    reset: function () { st.y = 1.80; setZoomMode("detective", true); setFault("count-from-1"); },
    highlight: function (p) { if (kit) kit.highlight(p || null); },
    rect: function (p) {
      if (!stage || !kit) { var r = root.getBoundingClientRect(); return { left: r.left, top: r.top, width: r.width, height: r.height }; }
      var o = (p && kit.parts && kit.parts[p]) || kit;
      return stage.rectOf(o, 12);
    },
    state: st, kit: kit, stage: stage
  };
  window.StudyScenes = window.StudyScenes || {};
  window.StudyScenes.zoom = api;

  setZoomMode("detective", true);
  faultBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-f") === st.fault)); });
  yBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(+b.getAttribute("data-y") === st.y)); });
  paint();
  setTimeout(replay, 600);
})();
