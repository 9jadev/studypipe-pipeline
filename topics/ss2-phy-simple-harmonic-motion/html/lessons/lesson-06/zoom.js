/* Lesson 06 · Zoom: inside the okada's coil-over shock absorber.
   3D: MassSpringKit v2 mode "okada", view "shock" (cut-away: piston with orifices in oil, oil jets that warm,
   low oil when leaking) in #zoom-canvas → window.StudyScenes.zoom.
   2D: ShmKinematics2D v2 (Paper.js) "damping-trace" side panel in #zoom-trace → window.StudyScenes.trace.
   Every number comes from the kits' reading() / model. Emits l6:zoom and l6:pushes. */
(function () {
  "use strict";
  var root = document.getElementById("zoom-stage");
  var canvas = document.getElementById("zoom-canvas");
  if (!root || !canvas) return;

  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  var toastEl = $("#zoom-toast"), toastT;
  function toast(m) {
    if (!toastEl) return;
    toastEl.textContent = m; toastEl.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove("show"); }, 3400);
  }
  var small = window.innerWidth < 560;
  var state = { damper: "healthy", traceSet: "shock", forced: false };

  // ---------- 3D cut-away shock ----------
  var kit = null;
  if (window.MassSpringKit) {
    kit = MassSpringKit.create({
      mode: "okada", view: "shock", mass: 200, leak: false, labels: !small,
      onEvent: function (name) {
        if (name === "pushes-done") {
          var r = kit.reading();
          var last = r.peaks && r.peaks.length ? r.peaks[r.peaks.length - 1] : null;
          toast((r.leak ? "Leaking: " : "Healthy: ") + "after ten pushes the bounce is " + (last != null ? last.toFixed(1) : "–") + " cm.");
          emit("l6:pushes", { damper: r.damper, peaks: r.peaks, last: last });
        }
      }
    });
  }
  var stage = (window.SceneKit && typeof THREE !== "undefined") ? SceneKit.createStage({
    root: root, canvas: canvas, fov: 40, target: new THREE.Vector3(0, 0.5, 0),
    pitch: 0.1, yaw: 0.25, distance: 1.6, minHeight: 300, maxHeight: 420, onFrame: function (dt, t) { if (kit) kit.update(dt, t); },
    autoFit: false, portraitPitch: 0
  }) : null;
  function frameKit() {
    if (!stage || !kit || !kit.viewFor) return;
    var v = kit.viewFor("all"); if (!v || !v.target) return;
    stage.target.set(v.target[0], v.target[1], v.target[2]);
    var span = 2 * v.dist * Math.tan(THREE.MathUtils.degToRad(stage.camera.fov) / 2);
    stage.fitHeight = span; stage.fitWidth = span * 0.9;
    if (v.pitch != null) stage.pitch = v.pitch;
    stage.resize();
  }
  if (stage && kit) { stage.rig.add(kit); stage.start(); frameKit(); }

  // ---------- 2D Paper.js damping trace ----------
  var traceCanvas = document.getElementById("zoom-trace-canvas");
  var trace = null;
  if (window.ShmKinematics2D && window.paper && traceCanvas) {
    try {
      trace = ShmKinematics2D.create({ canvas: traceCanvas, scene: "damping-trace", set: "shock", forced: false, autoplay: true, labels: true });
    } catch (e) { trace = null; }
  }
  if (!trace) { var tw = document.getElementById("zoom-trace"); if (tw) tw.classList.add("l6-off"); }

  // ---------- 2D Paper.js ten-push panel: the SAME push-train model as the 3D shock ----------
  // MassSpringKit (README "shock pushes"): x'' + 2ζω0x' + ω0²x = 0, semi-implicit Euler h = 1/2000 s,
  // a 0.326 m/s kick every 0.5 s, 200 kg, k from f0 = 2.00 Hz. Peaks are cross-checked against
  // MassSpringKit.model.shockPushes(), so the panel, the 3D readout and the bridge share one source.
  var M = window.MassSpringKit ? MassSpringKit.model : null;
  var STORY = M && M.STORY ? M.STORY : { kOkada: 4 * Math.PI * Math.PI * 4 * 200, pushDv: 0.326, pushEvery: 0.5 };
  var W0 = Math.sqrt(STORY.kOkada / 200), H = 1 / 2000, TH0 = ((M && M.G) || 9.8) / (W0 * W0) * 100;  // lift-off g/ω0² in cm
  function pushRun(zeta) {
    var st = { x: 0, v: 0 }, pts = [], peaks = [], steps = Math.round(STORY.pushEvery / H), t = 0;
    for (var p = 0; p < 10; p++) {
      st.v -= STORY.pushDv; var mx = 0;
      for (var i = 0; i < steps; i++) {
        var a = -2 * zeta * W0 * st.v - W0 * W0 * st.x; st.v += a * H; st.x += st.v * H; t += H;
        mx = Math.max(mx, Math.abs(st.x));
        if (i % 10 === 0) pts.push([t, -st.x * 100]);          // compression drawn upwards, cm
      }
      peaks.push(Math.round(mx * 10000) / 100);
    }
    var ref = M && M.shockPushes ? M.shockPushes(zeta, 200, 10) : null;
    return { pts: pts, peaks: ref || peaks, span: t, matches: !ref || ref.every(function (v, k) { return Math.abs(v - peaks[k]) < 0.011; }) };
  }
  var RUNS = { healthy: pushRun(0.30), leaking: pushRun(0.05) };
  var pushCanvas = document.getElementById("zoom-push-canvas"), push = null;
  if (window.paper && pushCanvas) {
    try {
      push = (function () {
        var ps = new paper.PaperScope(); ps.setup(pushCanvas);
        var holder = pushCanvas.parentElement, t0 = 0, raf = 0, shown = false;
        function css(n) { return getComputedStyle(document.documentElement).getPropertyValue(n).trim(); }
        function C(n, a) { var c = new ps.Color(css(n) || css("--fg")); if (a != null) c.alpha = a; return c; }
        function txt(pt, s, col, size, just, bold) {
          return new ps.PointText({ point: pt, content: s, fillColor: col, fontSize: size, justification: just || "left", fontFamily: css("--font-mono") || "monospace", fontWeight: bold ? "bold" : "normal" });
        }
        function draw(frac) {
          ps.activate(); ps.project.activeLayer.removeChildren();
          var w = holder.clientWidth, h = holder.clientHeight; ps.view.viewSize = new ps.Size(w, h);
          var r = { x: 40, y: 34, w: w - 52, h: h - 66 }, span = RUNS.leaking.span, yr = 10;
          var X = function (t) { return r.x + t / span * r.w; }, Y = function (v) { return r.y + r.h / 2 - v / yr * r.h / 2; };
          new ps.Path.Rectangle({ rectangle: new ps.Rectangle(r.x, r.y, r.w, r.h), strokeColor: C("--line-strong"), strokeWidth: 1 });
          [-10, -5, 0, 5, 10].forEach(function (v) {
            new ps.Path.Line({ from: [r.x, Y(v)], to: [r.x + r.w, Y(v)], strokeColor: C("--line"), strokeWidth: v ? 1 : 1.4 });
            txt(new ps.Point(r.x - 5, Y(v) + 3), String(v).replace("-", "−"), C("--muted"), 9, "right");
          });
          for (var k = 0; k <= 5; k++) txt(new ps.Point(X(k), r.y + r.h + 13), k.toFixed(1), C("--muted"), 9, "center");
          txt(new ps.Point(r.x + r.w, r.y + r.h + 26), "t / s · push every 0.5 s", C("--fg-soft"), 9.5, "right");
          var yl = txt(new ps.Point(0, 0), "bounce / cm", C("--fg-soft"), 9.5, "center"); yl.rotate(-90); yl.position = new ps.Point(r.x - 30, r.y + r.h / 2);
          [TH0, -TH0].forEach(function (v, i) { new ps.Path.Line({ from: [r.x, Y(v)], to: [r.x + r.w, Y(v)], strokeColor: C("--crimson", i ? 0.5 : 1), strokeWidth: 1.2, dashArray: [6, 4] }); });
          txt(new ps.Point(r.x + 4, Y(TH0) - 4), "lift-off " + TH0.toFixed(1) + " cm", C("--crimson"), 9.5, "left", true);
          for (var q = 1; q < 10; q++) new ps.Path.Line({ from: [X(q * 0.5), r.y], to: [X(q * 0.5), r.y + r.h], strokeColor: C("--line", 0.5), strokeWidth: 1, dashArray: [2, 4] });
          var tEnd = span * frac;
          [["healthy", "--teal"], ["leaking", "--crimson"]].forEach(function (d) {
            var run = RUNS[d[0]], path = new ps.Path({ strokeColor: C(d[1]), strokeWidth: 2.4, strokeJoin: "round" });
            for (var j = 0; j < run.pts.length && run.pts[j][0] <= tEnd; j++) path.add(new ps.Point(X(run.pts[j][0]), Y(Math.max(-yr, Math.min(yr, run.pts[j][1])))));
          });
          var hp = RUNS.healthy.peaks, lp = RUNS.leaking.peaks, nDone = Math.min(10, Math.floor(tEnd / STORY.pushEvery + 1e-6));
          txt(new ps.Point(r.x, 14), "— healthy " + (nDone ? hp[nDone - 1].toFixed(1) + " cm" : ""), C("--teal"), 10.5, "left", true);
          txt(new ps.Point(r.x + r.w, 14), "leaking " + (nDone ? lp[nDone - 1].toFixed(1) + " cm" : "") + " —", C("--crimson"), 10.5, "right", true);
          var first = -1; for (var z = 0; z < lp.length; z++) if (lp[z] > TH0) { first = z; break; }
          if (first >= 0 && nDone > first) {
            var tx = X((first + 1) * STORY.pushEvery);
            new ps.Path.Circle({ center: [tx, Y(TH0)], radius: 4, fillColor: C("--crimson") });
            txt(new ps.Point(r.x + 6, Y(-yr) - 6), "past " + TH0.toFixed(1) + " cm at push " + (first + 1), C("--crimson"), 9.5, "left");
          }
          txt(new ps.Point(r.x + r.w, r.y + 12), "pushes " + nDone + " / 10", C("--fg-soft"), 9.5, "right");
          ps.view.update();
        }
        function loop(now) {
          if (!t0) t0 = now;
          var f = Math.min(1, (now - t0) / 1000 / RUNS.leaking.span);
          // never run ahead of the 3D shock (its loop pauses off-screen): cap at its delivered pushes
          if (kit) { var kr = kit.reading(); if (kr && kr.pushes != null) f = Math.min(f, kr.pushes / 10); }
          draw(f);
          if (f < 1 && shown) raf = requestAnimationFrame(loop);
        }
        if (window.ResizeObserver) new ResizeObserver(function () { if (shown && !raf) draw(1); }).observe(holder);
        return {
          show: function (on) {
            shown = on; cancelAnimationFrame(raf); raf = 0;
            pushCanvas.style.visibility = on ? "visible" : "hidden";
            if (traceCanvas) traceCanvas.style.visibility = on ? "hidden" : "visible";
            if (on) { t0 = 0; raf = requestAnimationFrame(loop); }
          },
          runs: RUNS
        };
      })();
    } catch (e) { push = null; }
  }

  // ---------- readout ----------
  var readoutEl = $("#zoom-readout");
  function reading() { return kit ? kit.reading() : null; }
  function paint() {
    if (!readoutEl) return;
    var r = reading();
    readoutEl.innerHTML =
      '<div><span>Bounce / cm</span><b>' + (r ? (r.A_cm || 0).toFixed(1) : "–") + '</b></div>' +
      '<div class="hot"><span>Heat / cycle</span><b>' + (r ? (r.E_removed_per_cycle || 0).toFixed(2) + " J" : "–") + '</b></div>' +
      '<div><span>Oil level</span><b>' + (r && r.oilLevel != null ? Math.round(r.oilLevel * 100) + "%" : "–") + '</b></div>' +
      '<div><span>Pushes</span><b>' + (r ? r.pushes : "–") + '</b></div>';
  }

  // ---------- controls ----------
  var damperBtns = $$("#zoom-damper [data-damper]"), setBtns = $$("#zoom-trace-set [data-set]");
  function pressed(btns, attr, v) { btns.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute(attr) === v)); }); }

  function setDamper(d) {
    if (d !== "healthy" && d !== "leaking") return;
    state.damper = d;
    pressed(damperBtns, "data-damper", d);
    if (kit) kit.setState({ leak: d === "leaking" });
    if (trace && state.traceSet === "shock") trace.setState({ show: null });
    paint();
    toast(d === "leaking" ? "Leaking: oil level low, the piston slides through air." : "Healthy: the piston forces oil through the orifices.");
    emit("l6:zoom", { mode: d });
  }
  function setTraceSet(s) {
    if (s !== "shock" && s !== "kinds") return;
    state.traceSet = s; state.forced = false;
    pressed(setBtns, "data-set", s);
    if (trace) trace.setState({ scene: "damping-trace", set: s, forced: false });
    if (push) push.show(false);
    emit("l6:zoom", { mode: "trace-" + s });
  }
  function pushOnce() { if (kit) kit.push(); if (state.forced) { state.forced = false; if (push) push.show(false); } }
  function pushTen() {
    root.scrollIntoView({ behavior: "smooth", block: "center" });   // the loop pauses off-screen
    if (kit) kit.pushTrain(10, 0.5);
    if (state.traceSet !== "shock") setTraceSet("shock");
    state.forced = true;
    if (push) push.show(true);
    toast("Ten equal pushes, one every half-second…");
    emit("l6:zoom", { mode: "pushes-" + state.damper });
  }
  function resetZoom() {
    if (kit) kit.setState({ reset: true });
    state.forced = false;
    if (push) push.show(false);
    paint();
  }

  damperBtns.forEach(function (b) { b.addEventListener("click", function () { setDamper(b.getAttribute("data-damper")); }); });
  setBtns.forEach(function (b) { b.addEventListener("click", function () { setTraceSet(b.getAttribute("data-set")); }); });
  var p1 = $("#zoom-push"), p10 = $("#zoom-push10"), rs = $("#zoom-reset");
  if (p1) p1.addEventListener("click", pushOnce);
  if (p10) p10.addEventListener("click", pushTen);
  if (rs) rs.addEventListener("click", resetZoom);

  // ---------- scene APIs ----------
  window.StudyScenes = window.StudyScenes || {};
  window.StudyScenes.zoom = {
    setMode: setDamper, setDamper: setDamper, pushOnce: pushOnce, pushTen: pushTen, reset: resetZoom, reading: reading,
    highlight: function (p) { if (kit) kit.highlight(p || null); },
    rect: function (p) {
      if (!stage || !kit) return null;
      var o = (kit.parts && p && kit.parts[p]) || kit;
      return stage.rectOf(o, 12);
    },
    kit: kit, stage: stage
  };
  window.StudyScenes.trace = {
    setMode: setTraceSet,
    rect: function (p) { return trace ? trace.rect(p) : null; },
    highlight: function (p) { if (trace) trace.highlight(p || null); },
    reset: function () { setTraceSet("shock"); },
    reading: function () { return state.forced && push ? { set: "pushes", runs: push.runs } : (trace ? trace.reading() : null); },
    handle: trace
  };

  pressed(damperBtns, "data-damper", "healthy");
  pressed(setBtns, "data-set", "shock");
  paint();
  setInterval(paint, 300);
})();
