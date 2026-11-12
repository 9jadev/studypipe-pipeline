/* Lesson 05 · two-station 3D bench.
   Station 1: VesselSlideBench (artery + vein slide, graticule calibrated against a stage micrometre, wall and lumen measuring).
   Station 2: HeartKit.capillaryBed with the pressure probe (Pc computed from the lesson model in data.js).
   Emits l5:bench for every vessel measurement and every recorded probe point, l5:station on a station switch,
   l5:calibrate, l5:bench-reset, and l5:bench-done once both stations are complete. */
(function () {
  "use strict";
  var root = document.getElementById("bench-stage");
  var canvas = document.getElementById("bench-canvas");
  var D = window.L05;
  if (!root || !canvas || !D) return;

  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var toastEl = document.getElementById("bench-toast"), toastT;
  function toast(m) {
    if (!toastEl) return;
    toastEl.textContent = m; toastEl.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove("show"); }, 3600);
  }
  var $ = function (id) { return document.getElementById(id); };
  var readoutEl = $("bench-readout"), hintEl = $("bench-hint"), vStatus = $("v-status"), pStatus = $("p-status");
  var st1Ctl = $("st1-ctl"), st2Ctl = $("st2-ctl"), range = $("probe-range");

  var state = {
    station: 1, tech: "ok",
    viewed: false, calibrated: false, calibrating: false,
    meas: {},            // part -> reading (latest)
    good: {},            // part -> true when measured calibrated and without a technique fault
    capFound: false,
    mode: "normal", probe: 0, rec: {}, st2Done: false, st1Done: false, done: false
  };
  var highlightPart = null;
  var timers = [];
  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }

  var api = {
    station: setStation, view: view, calibrate: calibrate, measure: measureVessel, findCapillary: findCapillary, tech: setTech,
    probe: setProbe, record: record, frame: frameBench, bedMode: setBedMode, reset: resetAll,
    setMode: function (m) { if (D.MODES[m]) { setStation(2); setBedMode(m); } else if (m === "1" || m === "2") setStation(+m); },
    rect: function () { return null; },
    highlight: function (p) { highlightPart = p || null; },
    state: function () { return { station: state.station, tech: state.tech, calibrated: state.calibrated, vessels: Object.keys(state.good).length, points: Object.keys(state.rec).length, mode: state.mode, done: state.done }; }
  };
  window.StudyScenes = window.StudyScenes || {};
  window.StudyScenes.bench = api;

  var stage = window.SceneKit && window.SceneKit.createStage({
    root: root, canvas: canvas, fov: 34, target: new THREE.Vector3(0, 0.3, 0), pitch: 0.7, yaw: 0.0,
    distance: 14, minYaw: -0.8, maxYaw: 0.8, onFrame: frame
  });

  var vk = null, bed = null, glow = null;
  if (stage) build();
  buildControls();
  paintAll();

  function build() {
    if (window.VesselSlideBench) {
      vk = window.VesselSlideBench.create({ calibrated: false, errors: {} });
      vk.onEvent = onVesselEvent;
      stage.rig.add(vk);
    }
    if (window.HeartKit && window.HeartKit.capillaryBed) {
      bed = window.HeartKit.capillaryBed({ labels: root.clientWidth >= 560 });
      bed.userData.setState({ mode: "normal", probe: 0, nfp: D.nfp(0, "normal") });
      stage.rig.add(bed);
    }
    glow = SceneKit.glowSprite("rgba(255,178,63,0.92)", 1.6);
    glow.material.opacity = 0; glow.userData.noFit = true; stage.rig.add(glow);
    applyStationView();
    api.rect = function (part) {
      var obj = partObject(part);
      return stage.rectOf(obj || (state.station === 1 ? vk : bed), 12);
    };
    stage.start();
  }

  // ---- parts ----
  var BED_ALIAS = { tissueFluid: "fluid", lymphCapillary: "lymph", tissueCells: "tissueCells", capillary: "capillary", probe: "probe", artery: "arteriole", vein: "venule" };
  function partObject(part) {
    if (!part) return null;
    if (state.station === 1) return vk && vk.parts ? vk.parts[part] : null;
    var key = BED_ALIAS[part] || part;
    return bed && bed.userData.parts ? bed.userData.parts[key] : null;
  }
  var FOCUS = { artery: "artery", vein: "vein", tunicaMedia: "media", lumen: "lumen", valve: "valve", capillary: "capillary" };

  function applyStationView() {
    if (vk) vk.visible = state.station === 1;
    if (bed) bed.visible = state.station === 2;
    if (stage) {
      stage.pitch = state.station === 1 ? 0.7 : 0.14;
      stage.refit();
      frameBench(state.station === 1 ? "eye" : "wide");
    }
  }
  // station 1 opens close on the slide and the eyepiece view (where the readings are taken); "wide" shows the whole bench
  function frameBench(mode) {
    if (!stage) return;
    if (state.station === 1 && mode === "eye") {
      stage.zoom = root.clientWidth < 560 ? 0.66 : 0.8;
      stage.target.set(0.5, 0.9, 9.0);
    } else stage.recentre();
  }

  // ---- station 1 ----
  function onVesselEvent(name, d) {
    if (name === "measure" && d) {
      var part = d.part;
      var faults = (d.errors || []).slice();
      var ok = state.calibrated && !faults.length && d.calibrated !== false;
      state.meas[part] = d;
      if (ok) state.good[part] = true; else delete state.good[part];
      var detail = { station: 1, part: part, wall_mm: d.wall_mm, lumen_mm: d.lumen_mm, ratio: d.ratio, calibrated: !!d.calibrated, faults: faults, tech: state.tech, good: ok, count: Object.keys(state.good).length };
      emit("l5:bench", detail);
      checkDone();
    }
  }
  function techErrors() {
    return { slant: state.tech === "slant", collapsedVein: state.tech === "collapsed", noCalibration: state.tech === "nocal" };
  }
  function view() {
    if (!vk) { fallbackNote(); return; }
    setStation(1);
    state.viewed = true;
    vk.setState({ focus: "artery" });
    toast("Low power: the artery is on the left and the vein on the right. Note the thick artery wall and the wide vein lumen.");
    later(function () { if (state.station === 1) vk.setState({ focus: "vein" }); }, 1500);
    later(function () { if (state.station === 1) vk.setState({ focus: null }); paintAll(); }, 3000);
    paintAll();
  }
  function calibrate() {
    if (!vk) { fallbackNote(); return; }
    setStation(1);
    if (state.calibrated || state.calibrating) { toast("The graticule is already calibrated: one division is 0.080 mm."); return; }
    state.calibrating = true;
    frameBench("eye");
    vk.setState({ calibrating: true });
    toast("Stage micrometre in view: 1 mm covers 12.5 graticule divisions, so one division is 0.080 mm.");
    paintAll();
    later(function () {
      vk.calibrate();
      state.calibrating = false; state.calibrated = true;
      emit("l5:calibrate", { mm_per_div: 0.08 });
      toast("Calibrated: one division equals 0.080 mm. Now measure each vessel.");
      paintAll();
    }, 1800);
  }
  function measureVessel(part) {
    if (!vk) { fallbackNote(); return; }
    if (part !== "artery" && part !== "vein") return;
    setStation(1);
    if (!state.calibrated && state.tech !== "nocal") { toast("Calibrate the graticule first, as a real worker would. Then measure."); return; }
    vk.setState({ errors: techErrors() });
    var r = vk.measure(part);
    var msg = part + ": wall " + r.wall_mm.toFixed(2) + " mm, lumen " + r.lumen_mm.toFixed(1) + " mm.";
    if (state.tech === "slant") msg += " The slanted cut made it look oval, so the wall reads too high.";
    else if (state.tech === "collapsed" && part === "vein") msg += " The vein had collapsed, so its lumen reads too low.";
    else if (state.tech === "nocal") msg += " The graticule was never calibrated, so every reading is 1.25 times too big.";
    toast(msg);
    paintAll();
  }
  function findCapillary() {
    if (!vk) { fallbackNote(); return; }
    setStation(1);
    vk.setState({ focus: "capillary" });
    state.capFound = true;
    var c = vk.reading().capillary || {};
    emit("l5:bench", { station: 1, part: "capillary", lumen_um: c.lumen_um, wall_um: c.wall_um, cellsWide: c.cellsWide, good: true, count: Object.keys(state.good).length });
    toast("A capillary: its wall is one flat cell thick and red cells squeeze through in single file.");
    later(function () { if (state.station === 1 && highlightPart !== "capillary") vk.setState({ focus: null }); }, 3200);
    checkDone();
    paintAll();
  }
  function setTech(t) {
    if (["ok", "slant", "collapsed", "nocal"].indexOf(t) < 0) return;
    state.tech = t;
    if (vk) vk.setState({ errors: techErrors() });
    state.good = {};   // a technique change means the vessels must be measured again
    state.st1Done = false; state.done = false;
    toast(t === "ok" ? "Careful technique: right angles to the wall, calibrated graticule."
      : t === "slant" ? "Section cut at a slant: both vessels look stretched, so walls and lumens read too high. Measure again."
      : t === "collapsed" ? "The vein collapsed during preparation: its lumen reads too low. Measure again."
      : "Skipping calibration: every reading is the same wrong factor, systematic error. Measure again.");
    paintAll();
  }
  function resetStation1() {
    timers.forEach(clearTimeout); timers = [];
    if (vk) { vk.reset(); vk.setState({ calibrated: false, calibrating: false, errors: {}, focus: null }); }
    state.viewed = state.calibrated = state.calibrating = state.capFound = false;
    state.meas = {}; state.good = {}; state.tech = "ok"; state.st1Done = false; state.done = false;
    emit("l5:bench-reset", { station: 1 });
    paintAll();
  }

  // ---- station 2 ----
  function setProbe(x) {
    x = Math.max(0, Math.min(1, Math.round(+x * 4) / 4));
    if (isNaN(x)) return;
    setStation(2);
    state.probe = x;
    if (range) range.value = x;
    pushProbe();
    paintAll();
  }
  function pushProbe() {
    if (bed) bed.userData.setState({ probe: state.probe, nfp: D.nfp(state.probe, state.mode) });
  }
  function setBedMode(m) {
    if (!D.MODES[m]) return;
    setStation(2);
    state.mode = m;
    if (bed) bed.userData.setState({ mode: m, probe: state.probe, nfp: D.nfp(state.probe, m) });
    toast(m === "normal" ? "Normal leg: readings can be recorded." : D.MODES[m].label + ": explore it, but go back to Normal to record your results.");
    paintAll();
  }
  function record() {
    if (!bed) { fallbackNote(); return; }
    setStation(2);
    if (state.mode !== "normal") { toast("Switch back to Normal to record your readings."); return; }
    var x = state.probe;
    var k = D.mode("normal"), p = D.pc(x, "normal"), n = D.nfp(x, "normal");
    state.rec[x] = { pos: x, pc: p, pi: k.pi, nfp: n };
    var count = Object.keys(state.rec).length;
    emit("l5:bench", { station: 2, pos: x, pc: p, pi: k.pi, nfp: n, dir: D.dir(n), count: count, good: true });
    toast("Position " + x.toFixed(2) + ": Pc = " + p + " mmHg, πc = " + k.pi + " mmHg. Now work out NFP.");
    if (count === D.POSITIONS.length) state.st2Done = true;
    checkDone();
    paintAll();
  }
  function resetStation2() {
    state.rec = {}; state.st2Done = false; state.done = false; state.probe = 0; state.mode = "normal";
    if (range) range.value = 0;
    if (bed) bed.userData.setState({ mode: "normal", probe: 0, nfp: D.nfp(0, "normal") });
    emit("l5:bench-reset", { station: 2 });
    paintAll();
  }

  function checkDone() {
    state.st1Done = !!(state.good.artery && state.good.vein && state.capFound);
    if (state.st1Done && state.st2Done && !state.done) {
      state.done = true;
      emit("l5:bench-done", { vessels: 2, points: D.POSITIONS.length });
      toast("Both stations complete. Look at how the two ends of the capillary differ.");
    }
  }
  function resetAll() { resetStation1(); resetStation2(); setStation(1); toast("Bench reset."); }

  function setStation(n) {
    n = +n;
    if (n !== 1 && n !== 2) return;
    if (state.station === n) return;
    state.station = n;
    applyStationView();
    emit("l5:station", { station: n });
    paintAll();
  }
  function fallbackNote() { toast("The 3D bench is not available on this device. Use the expected results below the tables."); }

  // ---- controls ----
  function buildControls() {
    root.querySelectorAll("#station-pick [data-station]").forEach(function (b) {
      b.addEventListener("click", function () { setStation(b.getAttribute("data-station")); });
    });
    $("v-view").addEventListener("click", view);
    $("v-cal").addEventListener("click", calibrate);
    $("v-art").addEventListener("click", function () { measureVessel("artery"); });
    $("v-vein").addEventListener("click", function () { measureVessel("vein"); });
    $("v-cap").addEventListener("click", findCapillary);
    $("v-reset").addEventListener("click", resetStation1);
    root.querySelectorAll("#v-tech [data-tech]").forEach(function (b) {
      b.addEventListener("click", function () { setTech(b.getAttribute("data-tech")); });
    });
    if (range) range.addEventListener("input", function () { setProbe(range.value); });
    $("probe-record").addEventListener("click", record);
    $("p-reset").addEventListener("click", resetStation2);
    root.querySelectorAll("#bed-mode [data-mode]").forEach(function (b) {
      b.addEventListener("click", function () { setBedMode(b.getAttribute("data-mode")); });
    });
  }

  // ---- painting ----
  function paintAll() { paintReadout(); paintButtons(); paintStatus(); }

  function cell(label, val, hot) { return '<div class="' + (hot ? "hot" : "") + '"><span>' + label + '</span><b>' + val + '</b></div>'; }
  function paintReadout() {
    if (!readoutEl) return;
    if (state.station === 1) {
      var a = state.meas.artery, v = state.meas.vein;
      readoutEl.innerHTML =
        cell("1 div /mm", state.calibrated ? "0.080" : (state.calibrating ? "…" : "?"), state.calibrated) +
        cell("Artery wall /mm", a ? a.wall_mm.toFixed(2) : "?") +
        cell("Artery lumen /mm", a ? a.lumen_mm.toFixed(1) : "?") +
        cell("Vein wall /mm", v ? v.wall_mm.toFixed(2) : "?") +
        cell("Vein lumen /mm", v ? v.lumen_mm.toFixed(1) : "?");
    } else {
      var x = state.probe, k = D.mode(state.mode), p = D.pc(x, state.mode), n = D.nfp(x, state.mode);
      readoutEl.innerHTML =
        cell("Position", x.toFixed(2)) +
        cell("Pc /mmHg", p) +
        cell("πc /mmHg", k.pi) +
        cell("NFP /mmHg", D.sgn(n), n > 0) +
        cell("Moves", D.dir(n));
    }
  }
  function paintButtons() {
    root.querySelectorAll("#station-pick [data-station]").forEach(function (b) {
      b.setAttribute("aria-pressed", +b.getAttribute("data-station") === state.station ? "true" : "false");
    });
    root.querySelectorAll("#v-tech [data-tech]").forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-tech") === state.tech ? "true" : "false"); });
    root.querySelectorAll("#bed-mode [data-mode]").forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-mode") === state.mode ? "true" : "false"); });
    st1Ctl.hidden = state.station !== 1; st2Ctl.hidden = state.station !== 2;
    $("v-cal").disabled = state.calibrated || state.calibrating;
    $("v-cal").textContent = state.calibrated ? "2 · Calibrated ✓" : "2 · Calibrate";
    $("v-view").textContent = state.viewed ? "1 · Viewed ✓" : "1 · View slide";
    $("v-art").textContent = state.good.artery ? "3 · Artery ✓" : "3 · Artery";
    $("v-vein").textContent = state.good.vein ? "3 · Vein ✓" : "3 · Vein";
    $("v-cap").textContent = state.capFound ? "4 · Capillary ✓" : "4 · Capillary";
    $("probe-record").textContent = state.rec[state.probe] != null ? "Recorded ✓" : "Record Pc";
  }
  function paintStatus() {
    var n = Object.keys(state.good).length;
    if (vStatus) vStatus.innerHTML = "Measured <b>" + n + "</b>/2 · calibrated <b>" + (state.calibrated ? "yes" : "no") + "</b>";
    var c = Object.keys(state.rec).length;
    if (pStatus) pStatus.innerHTML = "Recorded <b>" + c + "</b>/5 points";
    if (hintEl) {
      hintEl.textContent = state.done ? "Both stations complete: fill in the tables"
        : state.station === 1
          ? (!state.viewed ? "Station 1: view the slide, then calibrate" : !state.calibrated ? "Now calibrate the graticule" : n < 2 ? "Measure the artery and the vein" : !state.capFound ? "Find the capillary" : "Station 1 done: go to Station 2")
          : (c < 5 ? "Station 2: slide the probe and record all five points" : "Station 2 done" + (state.st1Done ? "" : ": finish Station 1"));
    }
  }

  // ---- frame ----
  var tmpBox, tmpV, lastFocus = undefined;
  function frame(dt, t) {
    if (state.station === 1 && vk) {
      vk.update(dt, t);
      var want = highlightPart && FOCUS[highlightPart] ? FOCUS[highlightPart] : undefined;
      if (want !== lastFocus) {
        if (want) vk.setState({ focus: want }); else if (lastFocus) vk.setState({ focus: null });
        lastFocus = want;
      }
    } else if (state.station === 2 && bed) bed.userData.update(dt, t);
    if (glow) {
      var target = highlightPart ? partObject(highlightPart) : null;
      if (target && !target.visible) target = null;
      if (target) {
        tmpBox = tmpBox || new THREE.Box3(); tmpV = tmpV || new THREE.Vector3();
        tmpBox.setFromObject(target);
        tmpBox.getCenter(glow.position);
        stage.rig.worldToLocal(glow.position);
        glow.scale.setScalar(Math.max(state.station === 1 ? 1.8 : 0.45, tmpBox.getSize(tmpV).length() * 0.9));
      }
      glow.material.opacity += ((target ? 0.4 + 0.2 * Math.sin(t * 5) : 0) - glow.material.opacity) * Math.min(1, dt * 8);
    }
  }
})();
