/* Lesson 04 · 3D pulse bench (window.StudyScenes.bench)
   PulseBench (assets/js/pulse-bench.js) drives a live HeartKit heart and owns every number: counts, rates, cycle time, blood pressure.
   This file only wires buttons, the results table and the camera. Nothing here is a typed-in reading. */
(function () {
  "use strict";
  var root = document.getElementById("bench-stage");
  var canvas = document.getElementById("bench-canvas");
  if (!root || !canvas || typeof THREE === "undefined" || !window.PulseBench) return;

  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var $ = function (s) { return document.querySelector(s); };
  var toastEl = $("#bench-toast"), toastT;
  function toast(m) {
    if (!toastEl) return;
    toastEl.textContent = m; toastEl.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove("show"); }, 3200);
  }

  var state = { speed: 2, view: "all", xray: false, doneFired: false };
  var kit = null, stage = null, hl = null, built = false;
  var portrait = (root.clientWidth || window.innerWidth) < 600;
  var goal = { target: new THREE.Vector3(), dist: 9, yaw: 0 };

  // The bench (bench top plus a HeartKit heart, about 150 000 triangles) is built when the section is near the screen,
  // or at once when the narrator, the bridge or a button needs it.
  function K() { build(); return kit; }
  function build() {
    if (built) return;
    built = true;
    kit = PulseBench.create({ speed: state.speed, onEvent: onKitEvent });
    stage = window.SceneKit && SceneKit.createStage({
      root: root, canvas: canvas, fov: 40, autoFit: false, zoomUi: true,
      target: new THREE.Vector3(-0.5, 0.55, -0.2), pitch: 0.62, yaw: portrait ? -Math.PI / 2 : 0, distance: 9,
      minYaw: -2.7, maxYaw: 1.1, onFrame: frame
    });
    if (stage) { stage.rig.add(kit); hl = PulseBench.makeHighlighter(stage.rig); aim("all", true); stage.start(); }
    api.kit = kit; api.stage = stage;
    paint(true);
  }

  function aim(name, snap) {
    var v = K().viewFor(name || "all"), a = (stage && stage.camera.aspect) || 1;
    goal.target.fromArray(v.target);
    goal.dist = v.dist * Math.max(1, Math.min(1.8, 0.95 / a));
    goal.yaw = a < 1 ? v.yawPortrait : 0;
    goal.active = true;
    if (snap && stage) { stage.target.copy(goal.target); stage.dist = goal.dist; stage.yaw = goal.yaw; goal.active = false; }
  }
  function frame(dt, t) {
    K().update(dt, t);           // also advances the heart: never update K().parts.heart separately
    if (stage && goal.active) {
      var k = Math.min(1, dt * 4);
      stage.target.lerp(goal.target, k);
      stage.dist += (goal.dist - stage.dist) * k;
      stage.yaw += (goal.yaw - stage.yaw) * k;
      if (stage.target.distanceTo(goal.target) < 0.005 && Math.abs(stage.dist - goal.dist) < 0.01 && Math.abs(stage.yaw - goal.yaw) < 0.01) goal.active = false;
    }
  }

  // ---------- DOM ----------
  var readoutEl = $("#bench-readout"), hintEl = $("#bench-hint");
  var tbody = $("#results-table tbody"), noteEl = $("#count-line");
  var btn = {
    rest: $("#b-rest"), ex: $("#b-ex"), count: $("#b-count"), next: $("#b-next"), bp: $("#b-bp"),
    all: $("#b-all"), xray: $("#b-xray"), speed: $("#b-speed"), reset: $("#b-reset")
  };
  var cards = ["m1", "m2", "m3", "m4"].map(function (id) { return document.getElementById(id); });
  var viewBtns = Array.prototype.slice.call(document.querySelectorAll("#bench-views [data-view]"));
  function cardState(done, now) {
    cards.forEach(function (c, i) { if (!c) return; c.classList.toggle("done", i < done); c.classList.toggle("now", i === now); });
  }
  function setView(v) {
    state.view = v; aim(v);
    viewBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-view") === v)); });
  }

  function restRows(r) { return r.rows.filter(function (x) { return x.phase === "rest"; }); }
  function fmt(v, d) { return v == null ? "–" : (d != null ? (+v).toFixed(d) : String(v)); }

  function buildTable() {
    if (!tbody) return;
    var h = '<tr data-row="rest"><td><b>Rest</b> (mean of 3)</td><td class="empty">?</td><td class="empty">?</td></tr>';
    for (var i = 0; i <= 5; i++) h += '<tr data-row="' + i + '"><td><b>' + i + '</b></td><td class="empty">?</td><td class="empty">?</td></tr>';
    tbody.innerHTML = h;
  }
  var lastKey = "";
  function paintTable(r, fresh) {
    if (!tbody) return;
    var rr = restRows(r);
    var restRow = tbody.querySelector('[data-row="rest"]');
    if (rr.length && restRow) {
      var mean = r.restMean;
      restRow.children[1].textContent = rr.map(function (x) { return x.count15; }).join(", ") + " (mean " + fmt(mean, 1) + ")";
      restRow.children[2].textContent = fmt(Math.round(mean * 4));
      restRow.children[1].className = restRow.children[2].className = rr.length >= 3 ? "" : "empty";
    }
    r.table.forEach(function (x, i) {
      var tr = tbody.querySelector('[data-row="' + i + '"]'); if (!tr) return;
      var has = x.count15 != null;
      tr.children[1].textContent = has ? x.count15 : "?"; tr.children[2].textContent = has ? x.bpm : "?";
      tr.children[1].className = tr.children[2].className = has ? "" : "empty";
      tr.classList.toggle("fresh", !!fresh && has && fresh.t_min === x.t_min);
    });
  }

  function paint(fresh) {
    if (!built) return;
    var r = kit.reading();
    var rr = restRows(r), post = r.nPost || 0;
    var key = JSON.stringify([r.phase, r.t_min, r.trueBpm, r.beats, r.counting, r.busy, rr.length, post, r.bp, state.speed, !!fresh]);
    var changed = key !== lastKey; lastKey = key;
    // buttons
    var busy = !!r.busy;
    btn.rest.disabled = busy || r.phase !== "rest" || rr.length >= 3;
    btn.ex.disabled = busy || r.phase !== "rest" || rr.length < 3;
    var t = r.t_min == null ? 0 : r.t_min;
    btn.count.disabled = busy || r.phase !== "post" || (r.table[t] && r.table[t].count15 != null);
    btn.next.disabled = busy || r.phase !== "post" || t >= 5 || !(r.table[t] && r.table[t].count15 != null);
    btn.bp.disabled = busy;
    // cards
    var done = r.allDone;
    if (done) cardState(4, -1);
    else if (post >= 1) cardState(3, 3);
    else if (r.phase !== "rest" || rr.length >= 3) cardState(2, 2);
    else if (rr.length >= 1) cardState(1, 1);
    else cardState(0, 0);
    if (!changed && !fresh) return;
    // readout
    var stateTxt = r.phase === "rest" ? "At rest" : r.phase === "exercising" ? "Step-ups" : "+" + r.t_min + " min";
    var last = r.count15 != null ? r.count15 + " → " + r.bpm : "–";
    var live = r.counting ? "counting: " + r.beats : last;
    var bp = r.bp.measuring ? Math.round(r.bp.pressure) + " mmHg" : r.bp.sys != null ? r.bp.sys + "/" + r.bp.dia + " mmHg" : "–";
    if (readoutEl) readoutEl.innerHTML =
      '<div><span>Now</span><b>' + stateTxt + '</b></div>' +
      '<div class="hot"><span>Heart rate</span><b>' + Math.round(r.trueBpm) + ' bpm</b></div>' +
      '<div><span>One cycle</span><b>' + fmt(r.cycle_s, 2) + ' s</b></div>' +
      '<div><span>' + (r.counting ? "Beats so far" : "Count → bpm") + '</span><b>' + live + '</b></div>' +
      '<div><span>Blood pressure</span><b>' + bp + '</b></div>';
    // hint
    var h;
    if (r.counting) h = "Counting for 15 s… feel each beat at the wrist.";
    else if (r.phase === "exercising") h = "Chidi is doing step-ups for 2 minutes…";
    else if (r.phase === "rest") h = rr.length < 3 ? "Rest count " + (rr.length + 1) + " of 3: press Rest count." : "Three rest counts done. Press Exercise 2 min.";
    else if (r.allDone) h = "All six counts are in. Check the graph, then try Blood pressure.";
    else if (r.table[t] && r.table[t].count15 != null) h = "Counted. Press Next minute.";
    else h = "Press Count now (minute " + t + ").";
    if (hintEl) hintEl.textContent = h;
    if (noteEl) noteEl.textContent = "Counts recorded: " + (rr.length + post) + " of 9 (3 at rest, 6 after exercise)";
    paintTable(r, fresh);
  }

  // ---------- kit events ----------
  function onKitEvent(name, detail) {
    if (name === "counted") { var r = K().reading(); paint(r); emit("l4:bench", r); }
    else if (name === "exercise-start") { setView("step"); toast("Step-ups for 2 minutes: the heart speeds up."); }
    else if (name === "exercise-done") { setView("wrist"); toast("Stop! Count the pulse at once."); }
    else if (name === "bp-start") { setView("manometer"); }
    else if (name === "bp") { toast("Blood pressure " + (detail && detail.sys) + "/" + (detail && detail.dia) + " mmHg. The first sound is the top number."); }
    else if (name === "minute") { setView("wrist"); }
    else if (name === "done") { if (!state.doneFired) { state.doneFired = true; emit("l4:bench-done", K().reading()); } }
    else if (name === "reset") { state.doneFired = false; emit("l4:bench-reset", {}); }
    paint();
  }

  function guard(ok, msg) { if (ok === false) toast(msg); return ok; }
  btn.rest.addEventListener("click", function () { setView("wrist"); guard(K().restCount(), "Not now. Wait for the current count to finish."); paint(); });
  btn.ex.addEventListener("click", function () { guard(K().exercise(), "Take three rest counts first."); paint(); });
  btn.count.addEventListener("click", function () { guard(K().countNow(), "Not now. Finish the current step first."); paint(); });
  btn.next.addEventListener("click", function () { guard(K().nextMinute(), "Count this minute first."); paint(); });
  btn.bp.addEventListener("click", function () { guard(K().measureBP(), "Wait until the current step finishes."); paint(); });
  btn.xray.addEventListener("click", function () { state.xray = !state.xray; K().setState({ xray: state.xray }); btn.xray.setAttribute("aria-pressed", String(state.xray)); });
  btn.speed.addEventListener("click", function () {
    state.speed = state.speed === 1 ? 2 : state.speed === 2 ? 4 : 1;
    K().setState({ speed: state.speed }); btn.speed.textContent = "Speed ×" + state.speed; paint();
  });
  btn.all.addEventListener("click", function () { api.all(); });
  btn.reset.addEventListener("click", resetAll);
  viewBtns.forEach(function (b) { b.addEventListener("click", function () { setView(b.getAttribute("data-view")); }); });
  function resetAll() {
    K().reset(); state.doneFired = false; buildTable(); setView("all"); lastKey = ""; paint();
    emit("l4:bench-reset", {});
  }

  // tap a part to name it
  var ray = new THREE.Raycaster(), ptr = new THREE.Vector2(), down = null;
  var NAMES = { wrist: "Wrist: the radial artery runs just under the skin here", radialArtery: "Radial artery: it bulges with every beat", fingers: "Examiner's fingers (never the thumb)",
    stopwatch: "Stopwatch", step: "Step stool", mannequin: "Chidi doing step-ups", heart: "The heart: patient's right is on your left", san: "SAN, the pacemaker", avn: "AVN", his: "Bundle of His", purkinje: "Purkinje fibres",
    cuff: "Cuff", manometer: "Mercury column (mmHg)" };
  canvas.addEventListener("pointerdown", function (e) { down = [e.clientX, e.clientY]; });
  canvas.addEventListener("pointerup", function (e) {
    if (!down || !stage || Math.abs(e.clientX - down[0]) + Math.abs(e.clientY - down[1]) > 6) return;
    var rc = canvas.getBoundingClientRect();
    ptr.set(((e.clientX - rc.left) / rc.width) * 2 - 1, -((e.clientY - rc.top) / rc.height) * 2 + 1);
    ray.setFromCamera(ptr, stage.camera);
    var id = K().pickPart(ray);
    if (id) { if (hl) { hl.highlight(id); setTimeout(function () { hl.clear(); }, 900); } toast(NAMES[id] || id); }
  });

  // ---------- scene API for the narrator, the bridge and the tests ----------
  var api = {
    setMode: setView, view: setView,
    rest: function () { setView("wrist"); return K().restCount(); }, exercise: function () { return K().exercise(); },
    count: function () { return K().countNow(); }, next: function () { return K().nextMinute(); }, bp: function () { return K().measureBP(); },
    all: function () { resetAll(); state.speed = 4; K().setState({ speed: 4 }); btn.speed.textContent = "Speed ×4"; return K().runAll(); },
    speed: function (s) { state.speed = s; K().setState({ speed: s }); btn.speed.textContent = "Speed ×" + s; },
    reset: resetAll,
    highlight: function (p) { build(); if (hl) { if (p) hl.highlight(p); else hl.clear(); } },
    rect: function (p) {
      build();
      if (!stage) return null;
      var o = (K().parts && K().parts[p]) || null;
      if (!o) o = kit;
      return stage.rectOf(o, 12);
    },
    reading: function () { return K().reading(); },
    state: function () { var r = K().reading(); return { phase: r.phase, nPost: r.nPost, counts: r.nCounts, done: !!r.allDone, reading: r }; },
    kit: kit, stage: stage
  };
  window.StudyScenes = window.StudyScenes || {};
  window.StudyScenes.bench = api;

  buildTable(); cardState(0, 0);
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) { if (es.some(function (e) { return e.isIntersecting; })) { io.disconnect(); build(); } }, { rootMargin: "600px 0px" });
    io.observe(root);
  } else build();
  setInterval(function () { paint(); }, 250);
})();
