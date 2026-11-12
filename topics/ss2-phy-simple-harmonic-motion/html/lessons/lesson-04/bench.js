/* Lesson 04 · 3D pendulum-laws bench (window.StudyScenes.bench)
   PendulumKit v3 "laws" mode, periodModel "exact" (02-lesson.md: 30° runs about 1.7 % slow).
   One variable at a time: bob 50/100 g, angle 5/10/30°, length 0.25/0.50/1.00 m, g Earth/Moon.
   Every number comes from the kit (reading() / PendulumKit.model); nothing is typed in.
   Phones frame the bob with kit.viewFor("bob") so it is not a speck at the foot of a tall stand. */
(function () {
  "use strict";
  var root = document.getElementById("bench-stage");
  var canvas = document.getElementById("bench-canvas");
  var D = window.L04;
  if (!root || !canvas || !D) return;

  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var toastEl = $("#bench-toast"), toastT;
  function toast(m) {
    if (!toastEl) return;
    toastEl.textContent = m; toastEl.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove("show"); }, 3400);
  }

  var small = window.innerWidth < 560;
  var BASE = { bob: 100, angle_deg: 10, l: 0.5, g: 9.8 };       // the fair-test baseline (02 method cards)
  var VARS = ["bob", "angle_deg", "l", "g"];
  var state = { bob: 100, angle_deg: 10, l: 0.5, g: 9.8, view: small ? "bob" : "all", fast: true, tested: {}, runs: 0, done: false };

  // ---------- kit + stage ----------
  var kit = null;
  if (window.PendulumKit && typeof THREE !== "undefined") {
    kit = PendulumKit.create({ mode: "laws", periodModel: "exact", l: 0.5, angle_deg: 10, bob: 100, g: 9.8, labels: !small, onEvent: onKitEvent });
    kit.setState({ speed: 4 });
  } else if (root) {
    // clearly marked fallback: no 3D, the controls still compute times from the model formula
    root.classList.add("no-webgl");
  }

  var FOV = 36;
  var stage = kit && window.SceneKit && SceneKit.createStage({
    root: root, canvas: canvas, fov: FOV, autoFit: false, zoomUi: true, portraitPitch: 0,
    target: new THREE.Vector3(0.1, 0.9, 0), pitch: 0.1, yaw: 0, distance: 3,
    minYaw: -0.8, maxYaw: 0.8, onFrame: frame
  });
  if (stage && kit) { stage.rig.add(kit); stage.start(); }

  var goal = { target: kit ? new THREE.Vector3(0.1, 0.9, 0) : null, dist: 3, pitch: 0.1 }, snapped = false, needAim = true;
  function fitDist(size) {
    var t = Math.tan(FOV * Math.PI / 360), a = (stage && stage.camera.aspect) || 1;
    return Math.max(size[1] / 2 / t, size[0] / 2 / (t * a)) * 1.1 + (size[2] || 0) / 2;
  }
  function aim() {
    if (!kit || !stage) return;
    var v;
    if (state.view === "bob") {
      // the bob's rest position from the kit; widen to the swing so the whole arc stays in frame
      v = kit.viewFor("bob");
      var halfW = state.l * Math.sin(state.angle_deg * Math.PI / 180) + 0.08;
      goal.target.fromArray(v.target); goal.target.y += 0.05;
      goal.dist = fitDist([2 * halfW, 0.34, 0.1]);
    } else {
      v = kit.viewFor("all");
      goal.target.fromArray(v.target);
      goal.dist = fitDist(v.size);
    }
    goal.pitch = v.pitch != null ? v.pitch : 0.1;
  }
  function frame(dt, t) {
    if (!kit) return;
    kit.update(dt, t);
    if (needAim) { needAim = false; aim(); }
    if (stage) {
      if (!snapped) { stage.target.copy(goal.target); stage.dist = goal.dist; snapped = true; }
      var k = Math.min(1, dt * 4);
      stage.target.lerp(goal.target, k); stage.dist += (goal.dist - stage.dist) * k;
      stage.pitch += (goal.pitch - stage.pitch) * k;
    }
  }

  // ---------- DOM ----------
  var readoutEl = $("#bench-readout"), hintEl = $("#bench-hint");
  var timeBtn = $("#bench-time"), speedBtn = $("#bench-speed"), resetBtn = $("#bench-reset");
  var tbody = $("#results-table tbody"), varsLine = $("#vars-line");
  var cards = ["m1", "m2", "m3", "m4"].map(function (id) { return document.getElementById(id); });
  var rows = Array.prototype.slice.call(document.querySelectorAll("#bench-ctl .pd-row"));
  var lastT = null;

  function f2(x) { return x == null ? "—" : x.toFixed(2); }
  function sf3(x) { return x == null ? "—" : (+x.toPrecision(3)).toString(); }
  function reading() {
    if (kit) return kit.reading();
    var T = D.period(state.l, state.g, state.angle_deg);
    return { mode: "laws", l: state.l, angle: state.angle_deg, g: state.g, bob: state.bob, n: 20, T: T, t: lastT, watch: { display: lastT != null ? lastT.toFixed(2) : "0.00", state: "idle" }, done: state.done };
  }
  function baseT() { return D.period(BASE.l, BASE.g, BASE.angle_deg); }

  function paintControls() {
    rows.forEach(function (row) {
      var key = row.getAttribute("data-var");
      Array.prototype.forEach.call(row.querySelectorAll("button"), function (b) {
        b.setAttribute("aria-pressed", String(+b.getAttribute("data-v") === +state[key]));
      });
    });
    if (speedBtn) { speedBtn.setAttribute("aria-pressed", String(state.fast)); speedBtn.textContent = state.fast ? "Fast ×4" : "Real time"; }
  }
  function paintReadout() {
    if (!readoutEl) return;
    var r = reading(), w = r.watch || {};
    var running = w.state === "running" || w.state === "armed";
    var T = r.t != null ? r.t / (r.n || 20) : null;
    readoutEl.innerHTML =
      '<div class="' + (running ? "hot" : "") + '"><span>Stopwatch</span><b>' + (w.display || "0.00") + ' s</b></div>' +
      '<div class="hot"><span>T = t/20</span><b>' + (T != null ? sf3(T) + " s" : "—") + '</b></div>' +
      '<div><span>Angle</span><b>' + r.angle + '°</b></div>' +
      '<div><span>' + (r.g < 5 ? "l · Moon" : "Length") + '</span><b>' + (+r.l).toFixed(2) + ' m</b></div>';
  }
  function cardState() {
    var map = { bob: 0, angle_deg: 1, l: 2, g: 3 }, now = -1;
    VARS.forEach(function (k) { var c = cards[map[k]]; if (c) c.classList.toggle("done", !!state.tested[k]); });
    for (var i = 0; i < VARS.length; i++) if (!state.tested[VARS[i]]) { now = i; break; }
    cards.forEach(function (c, i) { if (c) c.classList.toggle("now", i === now); });
    if (varsLine) {
      var n = VARS.filter(function (k) { return state.tested[k]; }).length;
      varsLine.textContent = "Variables tested: " + n + " of 4 (mass · angle · length · g)" + (n === 4 ? " ✓" : "");
    }
  }

  // ---------- results table: one compact row per timed run ----------
  function describe(r) {
    var bits = [];
    if (r.bob !== BASE.bob) bits.push("Mass " + r.bob + " g");
    if (r.angle !== BASE.angle_deg) bits.push("Angle " + r.angle + "°");
    if (+r.l !== BASE.l) bits.push("Length " + (+r.l).toFixed(2) + " m");
    if (r.g !== BASE.g) bits.push("Moon (g 1.6)");
    return bits.length ? bits.join(" · ") : "Baseline";
  }
  function addRow(r) {
    if (!tbody) return;
    var empty = tbody.querySelector(".pd-empty"); if (empty) empty.remove();
    var T = r.t / (r.n || 20), T0 = baseT(), rel = Math.abs(T - T0) / T0;
    var verdict = rel > 0.05 ? ["yes", "✓ yes"] : rel > 0.005 ? ["yes", "slightly"] : ["no", "✗ no"];
    var tr = document.createElement("tr");
    tr.className = "fresh";
    tr.innerHTML = "<td>" + describe(r) + "<small>" + r.bob + " g · " + r.angle + "° · " + (+r.l).toFixed(2) + " m · g " + r.g + "</small></td>" +
      "<td>" + f2(r.t) + "</td><td>" + sf3(T) + "</td><td class=\"" + verdict[0] + "\">" + verdict[1] + "</td>";
    Array.prototype.forEach.call(tbody.children, function (x) { x.classList.remove("fresh"); });
    tbody.appendChild(tr);
  }

  // ---------- kit events ----------
  function onKitEvent(name, d) {
    if (name === "timed") {
      var r = d || reading();
      state.runs++;
      // a variable counts as tested once a run is timed with it away from the baseline (or the baseline row exists for mass)
      if (r.bob !== BASE.bob) state.tested.bob = true;
      if (r.angle !== BASE.angle_deg) state.tested.angle_deg = true;
      if (+r.l !== BASE.l) state.tested.l = true;
      if (r.g !== BASE.g) state.tested.g = true;
      addRow(r); cardState(); paintReadout();
      if (timeBtn) timeBtn.disabled = false;
      var T = r.t / (r.n || 20);
      toast("20 oscillations: t = " + f2(r.t) + " s, so T = " + sf3(T) + " s.");
      if (hintEl) hintEl.textContent = "Change one setting, then time 20 oscillations.";
      emit("l4:bench", r);
    } else if (name === "done") {
      state.done = true;
      toast("All four variables tested. Only length and g changed T.");
      emit("l4:bench-done", d || reading());
    }
  }

  // ---------- controls ----------
  function setVar(key, val) {
    if (VARS.indexOf(key) < 0) return;
    if (+state[key] === +val) return;
    state[key] = +val;
    var patch = {}; patch[key] = +val;
    if (kit) kit.setState(patch);
    needAim = true;
    paintControls(); paintReadout();
    if (timeBtn) timeBtn.disabled = false;
    if (hintEl) hintEl.textContent = "Now press Release & time 20.";
  }
  function timeIt() {
    if (kit) {
      if (timeBtn) timeBtn.disabled = true;
      kit.time(20);
      if (hintEl) hintEl.textContent = state.fast ? "Timing 20 swings (shown 4× faster; the watch reads real seconds)…" : "Timing 20 swings in real time…";
    } else {
      // fallback: model time, no animation
      lastT = D.timeFor(20, state.l, state.g, state.angle_deg);
      onKitEvent("timed", { mode: "laws", l: state.l, angle: state.angle_deg, g: state.g, bob: state.bob, n: 20, t: lastT, T: lastT / 20 });
      if (!state.done && VARS.every(function (k) { return state.tested[k]; })) onKitEvent("done", null);
    }
  }
  function setFast(on) {
    state.fast = !!on;
    if (kit) kit.setState({ speed: state.fast ? 4 : 1 });
    paintControls();
  }
  function setView(v) {
    if (v !== "all" && v !== "bob") return;
    state.view = v; needAim = true;
  }
  function resetAll() {
    if (kit) { kit.reset(); kit.setState({ periodModel: "exact", speed: state.fast ? 4 : 1, labels: !small }); }
    state.bob = BASE.bob; state.angle_deg = BASE.angle_deg; state.l = BASE.l; state.g = BASE.g;
    state.tested = {}; state.runs = 0; state.done = false; lastT = null;
    if (tbody) tbody.innerHTML = '<tr class="pd-empty"><td colspan="4">Your timings appear here, one row per run.</td></tr>';
    if (timeBtn) timeBtn.disabled = false;
    needAim = true;
    paintControls(); paintReadout(); cardState();
    if (hintEl) hintEl.textContent = "Change one setting, then time 20 oscillations.";
    emit("l4:bench-reset", {});
  }

  rows.forEach(function (row) {
    var key = row.getAttribute("data-var");
    Array.prototype.forEach.call(row.querySelectorAll("button"), function (b) {
      b.addEventListener("click", function () { setVar(key, +b.getAttribute("data-v")); });
    });
  });
  if (timeBtn) timeBtn.addEventListener("click", timeIt);
  if (speedBtn) speedBtn.addEventListener("click", function () { setFast(!state.fast); });
  if (resetBtn) resetBtn.addEventListener("click", resetAll);

  // tap a part → name it (and a double-tap on the canvas swaps bob close-up / whole rig)
  var NAMES = { bob: "bob (centre band marks its centre)", thread: "thread", cork: "split cork", clamp: "clamp and boss", marker: "rest mark: start timing here", protractor: "protractor: release angle", ruler: "metre rule", "set-square": "set-square to the bob centre", stopwatch: "stopwatch" };
  if (stage && kit) {
    var ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), down = null, lastTap = 0;
    canvas.addEventListener("pointerdown", function (e) { down = [e.clientX, e.clientY]; });
    canvas.addEventListener("pointerup", function (e) {
      if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 6) { down = null; return; }
      down = null;
      var now = Date.now();
      if (now - lastTap < 320) { setView(state.view === "bob" ? "all" : "bob"); toast(state.view === "bob" ? "Close-up on the bob" : "Whole rig"); lastTap = 0; return; }
      lastTap = now;
      var rc = canvas.getBoundingClientRect();
      ndc.set(((e.clientX - rc.left) / rc.width) * 2 - 1, -((e.clientY - rc.top) / rc.height) * 2 + 1);
      ray.setFromCamera(ndc, stage.camera);
      var id = kit.pickPart(ray);
      if (id) { kit.highlight(id); toast(NAMES[id] || id); setTimeout(function () { kit.highlight(null); }, 1200); }
    });
  }

  // ---------- scene API for narrator / tests ----------
  var api = {
    setMode: function (m) { if (m === "all" || m === "bob") setView(m); },
    set: setVar, time: timeIt, setFast: setFast, view: setView, reset: resetAll,
    highlight: function (p) { if (kit) kit.highlight(p || null); },
    rect: function (p) {
      if (!stage || !kit) return null;
      var o = (kit.parts && p && kit.parts[p]) || kit;
      return stage.rectOf(o, 14);
    },
    reading: reading, kit: kit, stage: stage, state: state
  };
  window.StudyScenes = window.StudyScenes || {};
  window.StudyScenes.bench = api;

  paintControls(); paintReadout(); cardState();
  setInterval(paintReadout, 250);
})();
