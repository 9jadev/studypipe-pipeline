/* Lesson 04 · 3D zoom (window.StudyScenes.zoom): the beating HeartKit heart in "pace" mode (SAN spark spreading over the atria,
   pausing at the AVN, racing down the septum and up the ventricle walls) and in "sys" mode (valves in slow motion with LUB and DUB captions).
   LUB and DUB come from the heart's own beat model (userData.beat.avOpen / slOpen); rate, cycle time and phase are computed, not typed.
   The heart (about 120 000 triangles) is built lazily, when the section is near the screen or the narrator / explorer needs it. */
(function () {
  "use strict";
  var root = document.getElementById("zoom-stage");
  var canvas = document.getElementById("zoom-canvas");
  var D = window.L04;
  if (!root || !canvas || !D || typeof THREE === "undefined" || !window.HeartKit) return;

  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var $ = function (s) { return document.querySelector(s); };
  var toastEl = $("#zoom-toast"), toastT;
  function toast(m) {
    if (!toastEl) return;
    toastEl.textContent = m; toastEl.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove("show"); }, 3400);
  }

  var NORMAL_BPM = D.cycleBpm || 75, SLOW_BPM = 18;
  var state = { mode: "pace", slow: false, hold: null, bpm: NORMAL_BPM };
  var heart = null, stage = null, hlr = null, built = false;
  var capEl = $("#zoom-cap"), capT = 0, capWord = "";
  var readoutEl = $("#zoom-readout");
  var modeBtns = Array.prototype.slice.call(document.querySelectorAll("#zoom-mode button"));
  var slowBtn = $("#zoom-slow");
  var prevAv = 1, prevSl = 0;

  // The same windows the HeartKit beat model uses, so the explorer can describe a frozen moment exactly
  function describe(ph) {
    var aSys = ph >= 0.02 && ph < 0.17, vSys = ph >= 0.2 && ph < 0.56;
    var avClosed = ph >= 0.2 && ph < 0.58, slOpen = ph >= 0.24 && ph < 0.54;
    var sound = ph >= 0.2 && ph < 0.3 ? "LUB" : ph >= 0.54 && ph < 0.64 ? "DUB" : "";
    var stg = aSys ? "Atria contract" : vSys ? "Ventricles contract" : ph >= 0.56 && ph < 0.64 ? "Ventricles relax" : "All chambers relaxed";
    return { aSys: aSys, vSys: vSys, avClosed: avClosed, slOpen: slOpen, sound: sound, stage: stg };
  }
  D.describe = describe;

  function flash(word) {
    if (!capEl) return;
    capWord = word; capEl.textContent = word; capEl.className = "zoom-cap show " + word.toLowerCase();
    capT = performance.now() + (state.slow ? 1400 : 420);
  }
  function frame(dt, t) {
    if (heart.userData.update) heart.userData.update(dt, t);
    if (hlr) hlr.update(dt, t);
    var b = heart.userData.beat;
    if (b && state.hold == null) {
      if (prevAv >= 0.5 && b.avOpen < 0.5 && state.mode === "sys") flash("LUB");
      if (prevSl >= 0.5 && b.slOpen < 0.5 && state.mode === "sys") flash("DUB");
      prevAv = b.avOpen; prevSl = b.slOpen;
    }
    if (capEl && capWord && performance.now() > capT) { capEl.className = "zoom-cap"; capWord = ""; }
  }

  function build() {
    if (built) return;
    built = true;
    heart = HeartKit.heart({ mode: "pace", bpm: state.bpm, labels: false });
    stage = window.SceneKit && SceneKit.createStage({
      root: root, canvas: canvas, fov: 36, zoomUi: true,
      target: new THREE.Vector3(0, 0, 0), pitch: 0.06, yaw: 0, distance: 6, portraitPitch: 0.02,
      minYaw: -0.9, maxYaw: 0.9, minHeight: 330, maxHeight: 470, onFrame: frame
    });
    if (stage) { stage.rig.add(heart); hlr = HeartKit.makeHighlighter ? HeartKit.makeHighlighter(stage.rig) : null; stage.start(); }
    api.heart = heart; api.stage = stage;
    heart.userData.setState({ mode: state.mode, bpm: state.bpm, hold: state.hold });
    paint();
  }

  function paint() {
    if (!readoutEl) return;
    var ph = heart ? heart.userData.phase || 0 : 0, d = describe(ph);
    readoutEl.innerHTML =
      '<div><span>Heart rate</span><b>' + state.bpm + ' bpm</b></div>' +
      '<div><span>One cycle</span><b>' + (60 / state.bpm).toFixed(2) + ' s</b></div>' +
      '<div class="hot"><span>Phase</span><b style="font-size:.82em">' + d.stage + '</b></div>' +
      '<div><span>AV valves</span><b>' + (d.avClosed ? "shut" : "open") + '</b></div>' +
      '<div><span>Semilunar</span><b>' + (d.slOpen ? "open" : "shut") + '</b></div>';
  }
  function setMode(m) {
    if (m !== "pace" && m !== "sys") return;
    build();
    state.mode = m; heart.userData.setState({ mode: m });
    modeBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-mode") === m)); });
    toast(m === "pace"
      ? "The spark starts at the SAN (patient's right atrium, top left of the screen), pauses at the AVN, then races down the septum and up both ventricle walls."
      : "Valves in slow motion. AV valves shut with a LUB as the ventricles start to squeeze; semilunar valves shut with a DUB as they relax.");
    paint(); emit("l4:zoom", { mode: m });
  }
  function setSlow(on) {
    build();
    state.slow = !!on; state.bpm = on ? SLOW_BPM : NORMAL_BPM;
    heart.userData.setState({ bpm: state.bpm });
    if (slowBtn) { slowBtn.setAttribute("aria-pressed", String(state.slow)); slowBtn.textContent = state.slow ? "Normal speed" : "Slow motion"; }
    paint(); emit("l4:zoom", { mode: state.mode, slow: state.slow });
  }
  function hold(ph) {
    build();
    state.hold = ph == null ? null : ph;
    heart.userData.setState({ hold: state.hold });
    if (capEl) {
      if (state.hold != null) { var d = describe(state.hold); capWord = ""; capEl.textContent = d.sound; capEl.className = d.sound ? "zoom-cap show held " + d.sound.toLowerCase() : "zoom-cap"; }
      else capEl.className = "zoom-cap";
    }
    paint();
  }
  function reset() { hold(null); setSlow(false); setMode("pace"); }

  modeBtns.forEach(function (b) { b.addEventListener("click", function () { setMode(b.getAttribute("data-mode")); }); });
  if (slowBtn) slowBtn.addEventListener("click", function () { setSlow(!state.slow); });
  var rs = $("#zoom-reset"); if (rs) rs.addEventListener("click", reset);

  var api = {
    setMode: function (m) { if (m === "slow") setSlow(true); else if (m === "normal") setSlow(false); else if (m === "free") hold(null); else setMode(m); },
    slow: setSlow, hold: hold, reset: reset, build: build,
    highlight: function (p) {
      build();
      var o = p && heart.userData.parts ? heart.userData.parts[p] : null;
      if (hlr) hlr.set(o || null);
    },
    rect: function (p) {
      build();
      if (!stage) return null;
      var o = (heart.userData.parts && heart.userData.parts[p]) || heart;
      return stage.rectOf(o, 12);
    },
    state: function () { return { mode: state.mode, slow: state.slow, hold: state.hold, bpm: state.bpm, phase: heart ? heart.userData.phase : 0 }; },
    heart: null, stage: null
  };
  window.StudyScenes = window.StudyScenes || {};
  window.StudyScenes.zoom = api;

  // build when the section is within about a screen of the viewport (or immediately without IntersectionObserver)
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      if (es.some(function (e) { return e.isIntersecting; })) { io.disconnect(); build(); }
    }, { rootMargin: "700px 0px" });
    io.observe(root);
  } else build();
  paint();
  setInterval(paint, 250);
})();
