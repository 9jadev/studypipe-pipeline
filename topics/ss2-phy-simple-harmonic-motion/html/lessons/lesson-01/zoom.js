/* Lesson 01 · 3D concept zoom (window.StudyScenes.zoom): one complete oscillation, in slow motion.
   PendulumKit v3 "trace" (l = 0.80 m, speed 0.35): ghost bobs at A·0, O·¼, B·½, O·¾, A·1, amplitude ruler O→A,
   and a stopwatch face showing the 0.2 s reaction error as a % of 1 swing vs 20 swings.
   Counters come from kit.reading(): t, oscillations counted, T estimate, % error. */
(function () {
  "use strict";
  var root = document.getElementById("zoom-stage");
  var canvas = document.getElementById("zoom-canvas");
  if (!root || !canvas) return;

  var small = root.clientWidth < 560;
  var kit = window.PendulumKit ? PendulumKit.create({ mode: "trace", l: 0.80, speed: 0.35, labels: !small, onEvent: function (n) { if (n === "timed") paint(); } }) : null;

  var stage = (typeof THREE !== "undefined") && window.SceneKit && SceneKit.createStage({
    root: root, canvas: canvas, fov: 34,
    target: new THREE.Vector3(0, 0.7, 0), pitch: 0.12, yaw: 0.0,
    minYaw: -0.8, maxYaw: 0.8, minHeight: 300, maxHeight: 440,
    onFrame: function (dt, t) { if (kit) kit.update(dt, t); tick += dt; if (tick > 0.12) { tick = 0; paint(); } }
  });
  var tick = 0;
  if (stage && kit) { stage.rig.add(kit); stage.start(); }

  var countEl = document.getElementById("zoom-counters");
  function paint() {
    if (!countEl) return;
    if (!kit) { countEl.innerHTML = '<span class="counter">The zoom kit is not loaded on this device.</span>'; return; }
    var r = kit.reading(), w = r.watch || {};
    var n = w.n || 0, t = parseFloat(w.display || "0") || 0;
    var Test = n > 0 ? (t / n).toFixed(3) + " s" : "–";
    countEl.innerHTML =
      '<span class="counter"><i style="--c:var(--amber)"></i>t<b>' + (w.display || "0.00") + " s</b></span>" +
      '<span class="counter"><i style="--c:var(--teal)"></i>Counted<b>' + n + "</b></span>" +
      '<span class="counter"><i style="--c:var(--sky)"></i>T estimate<b>' + Test + "</b></span>" +
      '<span class="counter wide"><i style="--c:var(--crimson)"></i>0.2 s error<b>' + r.errOne_pct.toFixed(1) + "% (1) · " + r.errTwenty_pct.toFixed(2) + "% (20)</b></span>" +
      '<span class="counter"><i style="--c:var(--violet)"></i>Phase<b>' + (r.phase || "A") + " · " + fracName(r.fraction) + "</b></span>";
  }
  function fracName(f) {
    if (f == null) return "0";
    var q = Math.round(f * 4) % 4;
    return ["0", "¼", "½", "¾"][q];
  }

  function release() { if (kit) kit.release(); emit(); }
  function time(n) { if (kit) kit.time(n || 1); emit(); }
  function reset() { if (kit) { kit.reset(); kit.setState({ speed: 0.35, labels: !small }); } paint(); }
  function emit() { document.dispatchEvent(new CustomEvent("l1:zoom", { detail: { mode: "trace" } })); }

  var on = function (id, fn) { var el = document.getElementById(id); if (el) el.addEventListener("click", fn); };
  on("zoom-release", release);
  on("zoom-time1", function () { time(1); });
  on("zoom-reset", reset);

  window.StudyScenes = window.StudyScenes || {};
  window.StudyScenes.zoom = {
    setMode: function () { /* single mode: trace */ }, release: release, time: time, reset: reset,
    highlight: function (p) { if (kit) kit.highlight(p || null); },
    rect: function (p) { return (stage && kit && kit.parts && kit.parts[p]) ? stage.rectOf(kit.parts[p], 14) : null; },
    reading: function () { return kit ? kit.reading() : null; }
  };
  paint();
})();
