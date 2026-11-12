/* Lesson 07 · 3D practical bench (window.StudyScenes.bench)
   Two rigs on one SceneKit stage (one visible at a time):
   1. PendulumKit v3 "barton": heavy driver + five paper cones (0.30 … 0.90 m) on a taut cord.
      Driver 0.60 m → T 1.55 s, f 0.64 Hz → cone-3 widest (PendulumKit.model.barton).
   2. MassSpringKit v2 "okada" (body + road from RidgeRoadProps): ride over 2.5 m ridges.
      200 kg leaking: 10 → 1.4 · 14 → 2.5 · 16 → 4.4 · 18 → 10.0 (lift-off) · 20 → 3.9 · 30 → 0.6 cm;
      healthy peak ≈ 2.0 cm; 250 kg leaking 16 → 10.0 cm (lift-off), 18 → 3.7 cm (MassSpringKit.model.okada).
   Every number shown or recorded comes from kit.reading(); nothing is typed in.
   Events: l7:bench (detail = reading + row), l7:bench-done, l7:bench-reset. */
(function () {
  "use strict";
  var root = document.getElementById("bench-stage");
  var canvas = document.getElementById("bench-canvas");
  if (!root || !canvas) return;

  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var $ = function (s) { return document.querySelector(s); };
  var toastEl = $("#bench-toast"), toastT;
  function toast(m) {
    if (!toastEl) return;
    toastEl.textContent = m; toastEl.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove("show"); }, 3400);
  }
  function f1(v) { return (Math.round(v * 10) / 10).toFixed(1); }
  function f2(v) { return (Math.round(v * 100) / 100).toFixed(2); }

  var narrow = window.innerWidth < 560;
  var state = {
    rig: "barton", driverL: 0.60, speed: 10, mass: 200, leak: true,
    riding: false, rideT: 0, recordedKey: null, sweep: null, sweepWait: 0,
    bartonDone: false, done: false, rows: {}, bartonRows: {}
  };

  // ---------- kits (guarded: the page still works as text without them) ----------
  var pend = null, ms = null;
  if (typeof THREE !== "undefined" && window.PendulumKit) {
    try { pend = PendulumKit.create({ mode: "barton", driverL: 0.60, labels: !narrow, onEvent: onPend }); } catch (e) { pend = null; }
  }
  if (typeof THREE !== "undefined" && window.MassSpringKit) {
    try { ms = MassSpringKit.create({ mode: "okada", view: "bench", mass: 200, leak: true, speed_kmh: 10, parked: true, labels: !narrow, onEvent: onMs }); } catch (e) { ms = null; }
  }
  if (!pend && !ms) { root.classList.add("no-webgl"); }

  var stage = (pend || ms) && window.SceneKit && SceneKit.createStage({
    root: root, canvas: canvas, fov: 40, autoFit: false, zoomUi: true, portraitPitch: 0,
    target: new THREE.Vector3(0, 0.8, 0), pitch: 0.2, yaw: 0.6, distance: 3,
    minYaw: -1.2, maxYaw: 1.2, onFrame: frame
  });
  if (stage) {
    if (pend) stage.rig.add(pend);
    if (ms) stage.rig.add(ms);
  }

  // ---------- camera framing from kit.viewFor() (auto-fit would frame the whole stand tiny) ----------
  var goal = null, TAN = Math.tan(20 * Math.PI / 180);
  function aim(part) {
    if (!stage) return;
    var k = active(); if (!k || !k.viewFor) return;
    var v = k.viewFor(part || "all"), a = stage.camera.aspect || 1, d;
    if (v.size) d = Math.max(v.size[1] / 2 / TAN, v.size[0] / 2 / (TAN * a)) * 1.1 + (v.size[2] || 0) / 2;
    else d = v.dist * Math.max(1, Math.min(2.2, 1 / a));
    goal = { target: new THREE.Vector3().fromArray(v.target), dist: d, pitch: v.pitch != null ? v.pitch : 0.2, yaw: state.rig === "ridge" ? 0.45 : (v.yaw != null ? v.yaw : 0.6) };
    stage.zoom = 1;
  }
  function active() { return state.rig === "barton" ? pend : ms; }

  function frame(dt, t) {
    var k = active();
    if (k && k.update) k.update(dt, t);
    if (goal && stage) {
      var q = Math.min(1, dt * 4);
      stage.target.lerp(goal.target, q);
      stage.dist += (goal.dist - stage.dist) * q;
      stage.pitch += (goal.pitch - stage.pitch) * q;
      stage.yaw += (goal.yaw - stage.yaw) * q;
      if (stage.target.distanceTo(goal.target) < 0.003 && Math.abs(stage.dist - goal.dist) < 0.005 && Math.abs(stage.yaw - goal.yaw) < 0.004) goal = null;
    }
    if (state.rig === "ridge" && ms) stepRide(dt);
  }

  // ---------- DOM ----------
  var readoutEl = $("#bench-readout"), line = $("#bench-line");
  var tbody = $("#results-table tbody"), btbody = $("#barton-table tbody");
  var rigBtns = Array.prototype.slice.call(document.querySelectorAll("#bench-rig [data-rig]"));
  var lenBtns = Array.prototype.slice.call(document.querySelectorAll("#barton-len [data-l]"));
  var loadBtns = Array.prototype.slice.call(document.querySelectorAll("#ridge-load [data-mass]"));
  var dampBtns = Array.prototype.slice.call(document.querySelectorAll("#ridge-damper [data-leak]"));
  var ctlB = $("#ctl-barton"), ctlR = $("#ctl-ridge"), bHint = $("#barton-hint"), rHint = $("#ridge-hint");
  var speedIn = $("#ridge-speed"), speedVal = $("#ridge-speed-val");
  var cards = ["m1", "m2", "m3", "m4"].map(function (id) { return document.getElementById(id); });
  function cardState(done, now) { cards.forEach(function (c, i) { if (!c) return; c.classList.toggle("done", i < done); c.classList.toggle("now", i === now); }); }
  function progress() {
    var nb = Object.keys(state.bartonRows).length, nr = Object.keys(state.rows).length;
    if (line) line.textContent = "Barton: " + (nb ? nb + " driver length" + (nb > 1 ? "s" : "") : "not yet") + " · ridge rows: " + nr;
    var step = !nb ? 0 : nb < 2 ? 1 : !sweepComplete() ? 2 : 3;
    cardState(state.done ? 4 : step, state.done ? -1 : step);
  }

  function tile(lab, val, cls) { return '<div class="' + (cls || "") + '"><span>' + lab + '</span><b>' + val + '</b></div>'; }
  function paintReadout() {
    if (!readoutEl) return;
    if (state.rig === "barton") {
      if (!pend) { readoutEl.innerHTML = ""; return; }
      var b = pend.reading();
      readoutEl.innerHTML = tile("Driver l", f2(b.driverL) + " m") + tile("T", f2(b.T) + " s") + tile("f", f2(b.fDriver) + " Hz") +
        tile("Widest", b.running ? (b.steady ? "cone-" + b.widest : "building…") : "—", b.steady ? "l7-ok" : "");
    } else {
      if (!ms) { readoutEl.innerHTML = ""; return; }
      var r = ms.reading(), riding = !r.parked;
      var A = riding ? r.Acur * 100 : 0;
      readoutEl.innerHTML = tile("f = v/d", riding ? r.display.f + " Hz" : "—") + tile("f₀", r.display.f0 + " Hz") +
        tile("A", riding ? f1(A) + " cm" : "—", riding && r.lift && A >= r.th * 100 * 0.98 ? "l7-hot" : "") +
        tile("Lifts at", riding ? r.display.th_cm + " cm" : f1(r.th0 * 100) + " cm");
    }
  }

  // ---------- Barton ----------
  function onPend(name, d) {
    if (name === "steady" && d) {
      var key = f2(d.driverL);
      state.bartonRows[key] = true;
      addBartonRow(d);
      state.bartonDone = true;
      toast("Steady: cone-" + d.widest + " (" + f2(d.widestL) + " m) swings widest — the same length as the driver.");
      emit("l7:bench", assign({ rig: "barton" }, d));
      progress(); checkDone();
    }
    if (name === "state" || name === "release" || name === "reset") paintReadout();
  }
  function addBartonRow(d) {
    if (!btbody) return;
    var key = f2(d.driverL), tr = btbody.querySelector('tr[data-k="' + key + '"]');
    if (!tr) { tr = document.createElement("tr"); tr.setAttribute("data-k", key); btbody.appendChild(tr); }
    tr.innerHTML = "<td>" + key + "</td><td>" + f2(d.T) + "</td><td>" + f2(d.fDriver) + "</td><td>cone-" + d.widest + "<small>" + f2(d.widestL) + " m</small></td>";
    Array.prototype.forEach.call(btbody.children, function (x) { x.classList.toggle("fresh", x === tr); });
  }
  function setDriver(L) {
    state.driverL = L;
    lenBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(Math.abs(+b.getAttribute("data-l") - L) < 1e-6)); });
    if (pend) pend.setState({ driverL: L });
    if (bHint) bHint.textContent = "Driver length " + L.toFixed(2) + " m. Tap Start, then wait for the steady state.";
    paintReadout();
  }
  function startBarton(L) {
    if (L != null) setDriver(L);
    if (state.rig !== "barton") setRig("barton");
    if (pend) { pend.start(); toast("Driver released. The cones build up — wait for the steady state."); }
  }

  // ---------- ridge rig ----------
  function cfgKey() { return state.mass + (state.leak ? "L" : "H"); }
  function setSpeed(v) {
    state.speed = Math.max(5, Math.min(35, Math.round(v)));
    if (speedIn) speedIn.value = String(state.speed);
    if (speedVal) speedVal.textContent = state.speed + " km/h";
    if (ms && state.riding) { ms.setState({ speed_kmh: state.speed }); state.rideT = 0; state.recordedKey = null; }
  }
  function setLoad(m) {
    state.mass = m;
    loadBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(+b.getAttribute("data-mass") === m)); });
    if (ms) ms.setState({ mass: m });
    if (state.riding) restartRide(); else paintReadout();
  }
  function setDamper(leak) {
    state.leak = !!leak;
    dampBtns.forEach(function (b) { b.setAttribute("aria-pressed", String((b.getAttribute("data-leak") === "1") === state.leak)); });
    if (ms) ms.setState({ leak: state.leak });
    if (state.riding) restartRide(); else paintReadout();
  }
  function restartRide() { if (ms) { ms.setState({ parked: false, speed_kmh: state.speed }); } state.rideT = 0; state.recordedKey = null; state.riding = true; }
  function ride(kmh) {
    if (kmh != null) setSpeed(kmh);
    if (state.rig !== "ridge") setRig("ridge");
    if (!ms) return;
    ms.setState({ timeScale: state.sweep ? 3 : 1 });
    restartRide();
    if (rHint) rHint.textContent = "Riding at " + state.speed + " km/h (" + state.mass + " kg, " + (state.leak ? "leaking" : "healthy") + " damper). Waiting for a steady bounce…";
  }
  function stepRide(dt) {
    if (!state.riding) { return; }
    state.rideT += dt;
    if (state.sweepWait > 0) { state.sweepWait -= dt; if (state.sweepWait <= 0) nextSweep(); return; }
    var r = ms.reading(), key = cfgKey() + ":" + state.speed;
    if (state.recordedKey === key) return;
    var settled = state.rideT > 0.8 && Math.abs(r.Acur - r.A) <= 0.03 * r.A;
    if (settled || state.rideT > 30) record(r, key);
  }
  function record(r, key) {
    state.recordedKey = key;
    var row = { key: key, cfg: cfgKey(), mass: state.mass, leak: state.leak, speed_kmh: state.speed, v: r.v, f: r.f, f0: r.f0, A_cm: r.A * 100, th_cm: r.th * 100, lift: !!r.lift,
      display: { v: r.display.v, f: r.display.f, A: r.display.A_cm } };
    state.rows[key] = row;
    addRow(row);
    if (rHint) rHint.textContent = state.speed + " km/h: A = " + row.display.A + " cm, threshold " + r.display.th_cm + " cm → " + (row.lift ? "crates lift off!" : "crates stay on.");
    if (!state.sweep) toast(row.lift ? "Resonance! A = " + row.display.A + " cm is above the " + r.display.th_cm + " cm threshold." : "Steady: A = " + row.display.A + " cm. Recorded.");
    emit("l7:bench", assign({ rig: "ridge", row: row }, r));
    progress(); checkDone();
    if (state.sweep) state.sweepWait = 0.6;
  }
  function addRow(row) {
    if (!tbody) return;
    var tr = tbody.querySelector('tr[data-k="' + row.key + '"]');
    if (!tr) {
      tr = document.createElement("tr"); tr.setAttribute("data-k", row.key);
      // keep rows grouped by setting, then by speed
      var after = null;
      Array.prototype.forEach.call(tbody.children, function (x) {
        var c = x.getAttribute("data-k").split(":"), s = +c[1];
        if (c[0] === row.cfg && s < row.speed_kmh) after = x;
      });
      if (after) tbody.insertBefore(tr, after.nextSibling); else {
        var firstSame = Array.prototype.filter.call(tbody.children, function (x) { return x.getAttribute("data-k").split(":")[0] === row.cfg; })[0];
        if (firstSame) tbody.insertBefore(tr, firstSame); else tbody.appendChild(tr);
      }
    }
    tr.innerHTML = "<td>" + row.speed_kmh + "<small>" + row.mass + " kg · " + (row.leak ? "leaking" : "healthy") + "</small></td><td>" + row.display.v + "</td><td>" + row.display.f + "</td><td>" + row.display.A + "</td><td>" +
      (row.lift ? '<span class="l7-yes">✓ lifts</span>' : '<span class="l7-no">✗</span>') + "</td>";
    Array.prototype.forEach.call(tbody.children, function (x) { x.classList.toggle("fresh", x === tr); });
  }
  var SWEEP = [10, 14, 16, 18, 20, 30];
  function sweep() {
    if (!ms) return;
    if (state.rig !== "ridge") setRig("ridge");
    state.sweep = { i: 0 };
    toast("Sweeping 10 → 30 km/h (" + state.mass + " kg, " + (state.leak ? "leaking" : "healthy") + ").");
    ride(SWEEP[0]);
  }
  function nextSweep() {
    if (!state.sweep) return;
    state.sweep.i++;
    if (state.sweep.i >= SWEEP.length) { state.sweep = null; ms.setState({ timeScale: 1 }); toast("Sweep complete. Look at the table and the graph: where is the peak?"); return; }
    ride(SWEEP[state.sweep.i]);
  }
  function sweepComplete() {
    var by = {};
    Object.keys(state.rows).forEach(function (k) { var r = state.rows[k]; (by[r.cfg] = by[r.cfg] || []).push(r.speed_kmh); });
    return Object.keys(by).some(function (c) { var s = by[c]; return s.length >= 5 && Math.min.apply(null, s) <= 12 && Math.max.apply(null, s) >= 25; });
  }
  function checkDone() {
    if (state.done || !state.bartonDone || !sweepComplete()) return;
    state.done = true; progress();
    emit("l7:bench-done", { barton: Object.keys(state.bartonRows), rows: Object.keys(state.rows).map(function (k) { return state.rows[k]; }) });
    toast("Barton's pendulums and a full sweep done. Resonance at f = f₀!");
  }
  function stopRide() { state.riding = false; state.sweep = null; if (ms) ms.setState({ parked: true, timeScale: 1 }); }

  // ---------- rig switch ----------
  function setRig(r) {
    if (r !== "barton" && r !== "ridge") return;
    state.rig = r;
    rigBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-rig") === r)); });
    if (pend) pend.visible = r === "barton";
    if (ms) ms.visible = r === "ridge";
    if (ctlB) ctlB.hidden = r !== "barton";
    if (ctlR) ctlR.hidden = r !== "ridge";
    var lab = root.querySelector(".stage-label");
    if (lab) lab.innerHTML = "<i></i>" + (r === "barton" ? "Barton's pendulums" : "Ridge rig · d = 2.5 m");
    if (r === "barton" && state.riding) stopRide();
    aim("all"); paintReadout();
  }
  function reset() {
    stopRide();
    state.rows = {}; state.bartonRows = {}; state.bartonDone = false; state.done = false;
    if (tbody) tbody.innerHTML = ""; if (btbody) btbody.innerHTML = "";
    if (pend) pend.reset();
    if (ms) ms.reset();
    setDriver(0.60); setSpeed(10); setLoad(200); setDamper(true);
    setRig("barton"); progress();
    emit("l7:bench-reset", {});
  }

  // ---------- controls ----------
  rigBtns.forEach(function (b) { b.addEventListener("click", function () { setRig(b.getAttribute("data-rig")); }); });
  lenBtns.forEach(function (b) { b.addEventListener("click", function () { setDriver(+b.getAttribute("data-l")); }); });
  loadBtns.forEach(function (b) { b.addEventListener("click", function () { setLoad(+b.getAttribute("data-mass")); }); });
  dampBtns.forEach(function (b) { b.addEventListener("click", function () { setDamper(b.getAttribute("data-leak") === "1"); }); });
  if (speedIn) speedIn.addEventListener("input", function () { setSpeed(+speedIn.value); });
  var on = function (id, fn) { var el = document.getElementById(id); if (el) el.addEventListener("click", fn); };
  on("barton-start", function () { startBarton(); });
  on("barton-reset", function () { if (pend) pend.reset(); setDriver(state.driverL); });
  on("ridge-ride", function () { state.sweep = null; ride(); });
  on("ridge-sweep", sweep);
  on("ridge-reset", function () { stopRide(); if (ms) ms.reset(); paintReadout(); if (rHint) rHint.textContent = "Ride records a row once the bounce is steady."; });
  function onMs(name, d) {
    if (name === "crack" && !state.sweep) toast("Crack! The crate left the carrier and landed hard.");
  }

  // tapping the 3D bench names the part
  if (stage) {
    var down = null, ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
    canvas.addEventListener("pointerdown", function (e) { down = { x: e.clientX, y: e.clientY }; });
    canvas.addEventListener("pointerup", function (e) {
      if (!down || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 6) { down = null; return; }
      down = null;
      var k = active(); if (!k || !k.pickPart) return;
      var rct = canvas.getBoundingClientRect();
      ndc.set(((e.clientX - rct.left) / rct.width) * 2 - 1, -((e.clientY - rct.top) / rct.height) * 2 + 1);
      ray.setFromCamera(ndc, stage.camera);
      var id = k.pickPart(ray);
      if (id) toast(id.replace(/-/g, " "));
    });
  }

  function assign(a, b) { for (var k in b) a[k] = b[k]; return a; }

  // ---------- scene API for the narrator, the bridge and tests ----------
  var BARTON_PARTS = ["driver", "cord", "cone-1", "cone-2", "cone-3", "cone-4", "cone-5", "ruler"];
  function kitFor(part) { return BARTON_PARTS.indexOf(part) >= 0 ? pend : ms; }
  var api = {
    setMode: function (m) { setRig(m === "ridge" || m === "okada" ? "ridge" : "barton"); },
    rig: function () { return state.rig; },
    startBarton: startBarton,
    ride: function (kmh, o) { o = o || {}; state.sweep = null; if (o.mass) setLoad(o.mass); if (o.leak != null) setDamper(o.leak); ride(kmh); },
    sweep: sweep,
    stop: stopRide,
    reset: reset,
    scrollIntoView: function () { if (root.scrollIntoView) root.scrollIntoView({ behavior: "smooth", block: "center" }); },
    highlight: function (p) {
      if (pend) pend.highlight(null); if (ms) ms.highlight(null);
      if (!p) return;
      var k = kitFor(p);
      if (k === pend && state.rig !== "barton") setRig("barton");
      if (k === ms && state.rig !== "ridge") setRig("ridge");
      if (k && k.highlight) k.highlight(p);
    },
    rect: function (p) {
      if (!stage) return null;
      var k = p ? kitFor(p) : active();
      var o = (p && k && k.parts && k.parts[p]) || k;
      if (!o || (k && !k.visible)) return stage.rectOf(active() || stage.rig, 12);
      return stage.rectOf(o, 12);
    },
    reading: function () { var k = active(); return k ? k.reading() : null; },
    rows: function () { return Object.keys(state.rows).map(function (k) { return state.rows[k]; }); },
    pend: pend, ms: ms, stage: stage, state: state
  };
  window.StudyScenes = window.StudyScenes || {};
  window.StudyScenes.bench = api;

  if (stage) stage.start();
  setRig("barton"); setDriver(0.60); setSpeed(10); progress();
  if (stage) { aim("all"); if (goal) { stage.target.copy(goal.target); stage.dist = goal.dist; stage.pitch = goal.pitch; stage.yaw = goal.yaw; goal = null; } }
  if (window.ResizeObserver && stage) new ResizeObserver(function () { aim("all"); }).observe(canvas.parentElement);
  setInterval(paintReadout, 250);
})();
