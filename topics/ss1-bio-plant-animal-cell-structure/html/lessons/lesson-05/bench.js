/* Lesson 05 · 3D slide-preparation bench (window.StudyScenes.bench) — SlidePrepBench kit.
   Onion epidermis in iodine (A) and cheek cells in methylene blue (B). Every number in the readout comes from kit.reading(),
   which is computed by the kit's model: cover slip angle -> air bubbles, folded peel -> 2 layers, no stain -> nucleus invisible. */
(function () {
  "use strict";
  var root = document.getElementById("bench-stage");
  var canvas = document.getElementById("bench-canvas");
  if (!root || !canvas || typeof THREE === "undefined" || !window.SlidePrepBench) return;

  var DATA = window.L05 || { stepText: { onion: [], cheek: [] } };
  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var toastEl = document.getElementById("bench-toast");
  var toastT;
  function toast(m) {
    if (!toastEl) return;
    toastEl.textContent = m;
    toastEl.classList.add("show");
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.classList.remove("show"); }, 3600);
  }

  // ---- what the learner has chosen (the "method") ----
  var choice = { specimen: "onion", angle: 45, folded: false, stain: "right", view: 100 };
  var done = { onion: false, cheek: false };
  var trials = [];
  var viewed = { 100: false, 400: false };
  var benchDone = false;
  var highlightPart = null;
  var lastReading = null;

  function stainFor(spec, st) {
    if (st === "none") return "none";
    if (st === "salt") return "salt";
    return spec === "onion" ? "iodine" : "methylene";
  }

  var kit = SlidePrepBench.create({
    specimen: "onion", stain: "iodine", coverslipAngle_deg: 45, folded: false, view: 100,
    labels: root.clientWidth >= 560
  });
  var api = window.StudyScenes.bench = window.StudyScenes.bench || {};

  // ---- 3D stage ----
  var stage = window.SceneKit && window.SceneKit.createStage({
    root: root, canvas: canvas, fov: 32, pitch: 0.82, yaw: 0, minYaw: -0.55, maxYaw: 0.55,
    portraitPitch: 0.1, target: new THREE.Vector3(0, 0.5, 2), distance: 40, maxHeight: 520, minHeight: 300,
    onFrame: frame
  });
  var glow = null;
  if (stage) {
    stage.rig.add(kit);
    stage.envOff = true;   // the shared stage builds its own reflection map on load; ours is built on the first visible frame
    glow = SceneKit.glowSprite("rgba(255,178,63,0.9)", 4.6);
    glow.material.opacity = 0; glow.userData.noFit = true;
    stage.rig.add(glow);
    stage.start();
  }
  var tmpV = new THREE.Vector3();
  var envBuilt = false;
  function frame(dt, t) {
    if (!envBuilt && stage) { envBuilt = true; try { stage.scene.environment = SlidePrepBench.environment(stage.renderer); } catch (e) {} }
    kit.update(dt, t);
    if (glow) {
      var obj = highlightPart && kit.parts[highlightPart];
      if (obj) {
        obj.getWorldPosition(tmpV);
        stage.rig.worldToLocal(tmpV);
        glow.position.copy(tmpV); glow.position.y += 0.4;
      }
      glow.material.opacity += ((obj ? 0.45 + 0.25 * Math.sin(t * 5) : 0) - glow.material.opacity) * Math.min(1, dt * 7);
    }
  }
  // keep the animation moving when there is no WebGL (the model and readout still work)
  if (!stage) {
    var last = performance.now();
    (function tick() { var n = performance.now(); kit.update(Math.min(0.05, (n - last) / 1000), n / 1000); last = n; requestAnimationFrame(tick); })();
  }

  // ---- readout, hint, method cards (all painted from the kit's reading) ----
  var readoutEl = document.getElementById("bench-readout");
  var noteEl = document.getElementById("bench-note");
  var hintEl = document.getElementById("bench-hint");
  var faultWords = {
    "air-bubbles": function (r) { return "air bubbles (" + r.bubbles + "): the slip was held at only " + r.angle_deg + "°, so air was trapped"; },
    "folded-peel": function () { return "folded peel: two layers of cells overlap and look dark"; },
    "no-stain": function () { return "no stain: the walls are faint and the nucleus cannot be seen"; },
    "plasmolysed": function () { return "plasmolysed: the membrane has pulled away from the wall in strong salt"; },
    "crenated": function () { return "crenated: the cheek cells have shrunk and look spiky in strong salt"; }
  };
  function stainWord(r) { return r.stain_colour === "none" ? "none" : r.stain_colour; }
  function paint() {
    var r = kit.reading();
    lastReading = r;
    if (readoutEl) {
      readoutEl.innerHTML =
        "<div><span>Slide</span><b>" + (r.specimen === "onion" ? "A onion" : "B cheek") + "</b></div>" +
        "<div><span>Stain colour</span><b>" + stainWord(r) + "</b></div>" +
        "<div><span>Cover slip</span><b>" + r.angle_deg + "°</b></div>" +
        '<div class="' + (r.bubbles ? "hot" : "") + '"><span>Air bubbles</span><b>' + r.bubbles + "</b></div>" +
        "<div><span>Layers</span><b>" + r.layers + "</b></div>" +
        "<div><span>View</span><b>×" + r.magnification + "</b></div>" +
        "<div><span>Field</span><b>" + (r.field_um / 1000).toFixed(1) + " mm</b></div>" +
        "<div><span>Cells across</span><b>" + r.cells_across + "</b></div>";
    }
    if (noteEl) {
      if (!r.mounted) noteEl.innerHTML = "Mount the slide to see what the examiner would see.";
      else if (!r.faults.length) noteEl.innerHTML = "<b>Good slide.</b> One flat layer, stained, no air bubbles. The nucleus is " + (r.nucleusVisible ? "easy to see" : "faint") + (r.specimen === "onion" ? ", at the side of each cell." : ", near the middle of each cell.");
      else noteEl.innerHTML = "<b>Poor slide.</b> " + r.faults.map(function (f) { return faultWords[f](r); }).join("; ") + ".";
      noteEl.classList.toggle("bad", !!(r.mounted && r.faults.length));
    }
    var step = r.step;
    if (hintEl) {
      var txt = (DATA.stepText[r.specimen] || [])[step] || "";
      hintEl.innerHTML = "Step <b>" + step + " of 5</b> · " + txt;
    }
    paintCards(r);
    var nxt = document.getElementById("bench-next");
    if (nxt) nxt.textContent = step >= 5 ? "Start again" : "Next step ▶";
    var prog = document.getElementById("bench-progress");
    if (prog) prog.innerHTML = "Good slides: onion <b>" + (done.onion ? "✓" : "–") + "</b> · cheek <b>" + (done.cheek ? "✓" : "–") + "</b> · viewed ×100 <b>" + (viewed[100] ? "✓" : "–") + "</b> · ×400 <b>" + (viewed[400] ? "✓" : "–") + "</b>";
  }
  function paintCards(r) {
    var on = 0;
    if (r.specimen === "onion") on = r.step === 0 ? 0 : (r.step <= 2 ? 1 : 2);
    else on = r.step === 0 ? 0 : 3;
    if (r.mounted && viewed[r.view]) on = 4;
    for (var i = 1; i <= 4; i++) {
      var c = document.getElementById("m" + i);
      if (c) c.classList.toggle("now", i === on);
    }
  }
  function setPressed(sel, attr, val) {
    root.querySelectorAll(sel).forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute(attr)) === String(val) ? "true" : "false"); });
  }
  function syncButtons() {
    setPressed("#bench-spec [data-spec]", "data-spec", choice.specimen);
    setPressed("#bench-angle [data-angle]", "data-angle", choice.angle);
    setPressed("#bench-peel [data-peel]", "data-peel", choice.folded ? "folded" : "flat");
    setPressed("#bench-stain [data-stain]", "data-stain", choice.stain);
    setPressed("#bench-view [data-view]", "data-view", choice.view);
    var peelRow = document.getElementById("bench-peel-row");
    if (peelRow) peelRow.hidden = choice.specimen !== "onion";
  }

  // ---- recording a mounted slide ----
  function record(r) {
    var t = { n: trials.length + 1, specimen: r.specimen, quality: r.quality, faults: r.faults.slice(), bubbles: r.bubbles, layers: r.layers, view: r.view };
    trials.push(t);
    viewed[r.view] = true;
    if (r.quality === "good" && !done[r.specimen]) {
      done[r.specimen] = true;
      toast("Good " + (r.specimen === "onion" ? "onion" : "cheek") + " slide mounted.");
    } else if (r.quality !== "good") {
      toast("Poor slide: " + r.faults.map(function (f) { return f.replace("-", " "); }).join(", ") + ". Fix the method and mount again.");
    }
    paint();
    emit("l5:bench", { trial: t.n, specimen: r.specimen, quality: r.quality, faults: r.faults, reading: r, count: trials.length, done: { onion: done.onion, cheek: done.cheek } });
    if (!benchDone && done.onion && done.cheek) {
      benchDone = true;
      emit("l5:bench-done", { count: trials.length, onion: true, cheek: true });
    }
  }
  var quiet = false;
  kit.onEvent = function (name, detail) {
    if (name === "mounted") record(detail);
    else if (name === "step" || name === "state") {
      if (name === "state" && detail && detail.mounted && !quiet) { record(detail); return; }
      paint();
    }
  };

  // ---- actions ----
  function applyChoice(extra) {
    // only pass what changed: the kit resets the bench to step 0 whenever specimen or stain is passed
    var want = {
      specimen: choice.specimen, stain: stainFor(choice.specimen, choice.stain),
      coverslipAngle_deg: choice.angle, folded: choice.specimen === "onion" && choice.folded, view: choice.view
    };
    var o = {};
    for (var k0 in want) if (kit.params[k0] !== want[k0]) o[k0] = want[k0];
    if (extra) for (var k in extra) o[k] = extra[k];
    kit.setState(o);
    syncButtons();
    paint();
  }
  function setSpecimen(s) {
    if (s !== "onion" && s !== "cheek") return;
    choice.specimen = s; if (s === "cheek") choice.folded = false;
    applyChoice({ step: 0 });
    paint();
  }
  function setAngle(a) { choice.angle = +a; applyChoice(); }
  function setPeel(f) { choice.folded = f === "folded" || f === true; applyChoice(); }
  function setStain(s) { choice.stain = s; applyChoice(); }
  function setView(v) { v = +v; if (v !== 100 && v !== 400) return; choice.view = v; quiet = true; kit.setState({ view: v }); quiet = false; syncButtons(); var r = kit.reading(); if (r.mounted) { viewed[v] = true; } paint(); emit("l5:bench-view", { view: v }); }
  function nextStep() {
    if (kit.reading().step >= 5) { kit.reset(); applyChoice({ step: 0 }); return; }
    kit.nextStep(); paint();
  }
  function mountNow() {
    kit.pause();
    kit.setState({ step: 0 });
    applyChoice({ step: 4 });
    kit.settle(9);
    paint();
  }
  function play() { kit.pause(); kit.setState({ step: 0 }); kit.play(); paint(); }
  function reset() {
    trials = []; done = { onion: false, cheek: false }; viewed = { 100: false, 400: false }; benchDone = false;
    choice = { specimen: "onion", angle: 45, folded: false, stain: "right", view: 100 };
    kit.pause();
    kit.setState({ specimen: "onion", stain: "iodine", coverslipAngle_deg: 45, folded: false, view: 100, step: 0 });
    syncButtons(); paint();
    emit("l5:bench-reset");
    toast("Bench reset. Prepare slide A and slide B again.");
  }

  // ---- narrator API: rect / highlight / setMode / lesson actions ----
  api.rect = function (part) {
    if (!stage) return null;
    var obj = part && kit.parts[part];
    return obj ? stage.rectOf(obj, 14) : stage.rectOf(kit, 0);
  };
  api.highlight = function (part) { highlightPart = part || null; };
  api.setMode = function (m) {
    m = String(m);
    if (m === "onion" || m === "cheek") setSpecimen(m);
    else if (m === "x100") setView(100);
    else if (m === "x400") setView(400);
    else if (m === "bubbles") { setSpecimen("onion"); setAngle(10); }
    else if (m === "folded") { setSpecimen("onion"); setAngle(45); setPeel("folded"); }
    else if (m === "nostain") { setStain("none"); }
    else if (m === "salt") { setSpecimen("onion"); setAngle(45); setPeel("flat"); setStain("salt"); }
    else if (m === "good") { setSpecimen("onion"); choice.angle = 45; choice.folded = false; choice.stain = "right"; applyChoice(); }
  };
  api.setSpecimen = setSpecimen; api.setAngle = setAngle; api.setPeel = setPeel; api.setStain = setStain; api.setView = setView;
  api.nextStep = nextStep; api.mount = mountNow; api.play = play; api.reset = reset;
  api.setStep = function (n) { kit.pause(); kit.setStep(+n); paint(); };
  api.reading = function (specimen, stain) {
    var cur = kit.reading();
    if (!specimen || (specimen === cur.specimen && !stain)) return cur;
    var p = {}; for (var k in SlidePrepBench.DEFAULTS) p[k] = SlidePrepBench.DEFAULTS[k];
    p.specimen = specimen; p.stain = stain || (specimen === "onion" ? "iodine" : "methylene");
    return SlidePrepBench.model(p);   // the kit's own model: nothing typed by hand
  };
  api.state = function () { return { choice: choice, done: done, trials: trials.length, viewed: viewed }; };
  api.kit = kit;
  api.stage = stage;

  // ---- wire the buttons ----
  function on(sel, attr, fn) {
    root.querySelectorAll(sel).forEach(function (b) { b.addEventListener("click", function () { fn(b.getAttribute(attr)); }); });
  }
  on("#bench-spec [data-spec]", "data-spec", setSpecimen);
  on("#bench-angle [data-angle]", "data-angle", setAngle);
  on("#bench-peel [data-peel]", "data-peel", setPeel);
  on("#bench-stain [data-stain]", "data-stain", setStain);
  on("#bench-view [data-view]", "data-view", setView);
  var b;
  if ((b = document.getElementById("bench-next"))) b.addEventListener("click", nextStep);
  if ((b = document.getElementById("bench-run"))) b.addEventListener("click", play);
  if ((b = document.getElementById("bench-mount"))) b.addEventListener("click", mountNow);
  if ((b = document.getElementById("bench-reset"))) b.addEventListener("click", reset);

  // the numbered method cards also drive the bench
  [["m1", function () { setSpecimen("onion"); kit.setState({ step: 2 }); }],
   ["m2", function () { setSpecimen("onion"); kit.setState({ step: 4 }); }],
   ["m3", function () { setSpecimen("cheek"); kit.setState({ step: 2 }); }],
   ["m4", function () { var r = kit.reading(); if (!r.mounted) mountNow(); setView(choice.view === 100 ? 400 : 100); }]
  ].forEach(function (p) {
    var el = document.getElementById(p[0]);
    if (!el) return;
    el.setAttribute("tabindex", "0"); el.setAttribute("role", "button");
    function go() { p[1](); var st = document.getElementById("bench-stage"); if (st && st.scrollIntoView && false) st.scrollIntoView(); }
    el.addEventListener("click", go);
    el.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
  });

  syncButtons();
  paint();
})();
