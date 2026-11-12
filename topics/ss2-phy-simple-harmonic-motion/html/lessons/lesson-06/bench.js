/* Lesson 06 · 3D energy & damping bench (window.StudyScenes.bench)
   MassSpringKit v2 "energy" + "damping" (lab spring m = 0.20 kg, k = 24.5 N m⁻¹, card vane in air / water / oil)
   and PendulumKit v3 "energy" (KE / PE / total bars), one SceneKit stage, one rig visible at a time.
   Every number comes from the kits' reading() / model; nothing is typed in. Emits l6:bench, l6:bench-done, l6:bench-reset. */
(function () {
  "use strict";
  var root = document.getElementById("bench-stage");
  var canvas = document.getElementById("bench-canvas");
  if (!root || !canvas) return;

  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var toastEl = $("#bench-toast"), toastT;
  function toast(m) {
    if (!toastEl) return;
    toastEl.textContent = m; toastEl.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove("show"); }, 3200);
  }

  var small = window.innerWidth < 560;
  var MEDIA = ["air", "water", "oil"];
  var NAME = { air: "Air", water: "Water", oil: "Oil" };
  var state = { rig: "energy", medium: "air", Acm: 5, released: false, rec: {}, t10: {}, A0: {}, doneSent: false, pendReleased: false };

  // ---------- kits ----------
  var spring = null, pend = null;
  if (window.MassSpringKit) {
    spring = MassSpringKit.create({ mode: "energy", m: 0.20, k: 24.5, A: 0.05, medium: "air", labels: !small });
  }
  if (window.PendulumKit) {
    pend = PendulumKit.create({ mode: "energy", labels: !small });
    pend.visible = false;
  }
  var model = window.MassSpringKit ? MassSpringKit.model : null;

  var stage = (window.SceneKit && typeof THREE !== "undefined") ? SceneKit.createStage({
    root: root, canvas: canvas, fov: 40, target: new THREE.Vector3(0, 0.5, 0),
    pitch: 0.12, yaw: 0.2, distance: 3, minHeight: 320, maxHeight: 440, onFrame: frame,
    autoFit: false, portraitPitch: 0
  }) : null;
  // frame the active rig with the kit's own viewFor() (auto-fit would frame the whole stand and look tiny)
  function frameRig() {
    var k = active(); if (!stage || !k || !k.viewFor) return;
    var v = k.viewFor("all"); if (!v || !v.target) return;
    stage.target.set(v.target[0], v.target[1], v.target[2]);
    var t = Math.tan(THREE.MathUtils.degToRad(stage.camera.fov) / 2), span;
    if (v.size) span = Math.max(v.size[0], v.size[1]) * 1.15;
    else span = 2 * v.dist * t;
    stage.fitHeight = span; stage.fitWidth = span * 0.9;
    if (v.pitch != null) stage.pitch = v.pitch;
    stage.resize();
  }
  if (stage) {
    if (spring) stage.rig.add(spring);
    if (pend) stage.rig.add(pend);
    stage.start();
    frameRig();
  }
  function frame(dt, t) {
    if (spring && spring.visible) spring.update(dt, t);
    if (pend && pend.visible) pend.update(dt, t);
  }
  function active() { return state.rig === "pendulum" ? pend : spring; }

  // ---------- DOM ----------
  var readoutEl = $("#bench-readout"), hintEl = $("#bench-hint");
  var rigBtns = $$("#bench-rig [data-rig]"), medBtns = $$("#bench-medium [data-medium]"), ampBtns = $$("#bench-amp [data-a]");
  var relBtn = $("#bench-release"), recBtn = $("#bench-record"), resetBtn = $("#bench-reset");
  var tbody = $("#results-table tbody"), tfoot = $("#results-table tfoot"), tally = $("#bench-tally");
  var cards = ["m1", "m2", "m3", "m4"].map(function (id) { return document.getElementById(id); });

  function cardState(done, now) {
    cards.forEach(function (c, i) { if (!c) return; c.classList.toggle("done", i < done); c.classList.toggle("now", i === now); });
  }
  function fJ(v) { return v == null || !isFinite(v) ? "–" : (Math.abs(v) < 0.1 ? v.toFixed(4) : v.toFixed(3)); }
  function f2(v) { return v == null || !isFinite(v) ? "–" : v.toFixed(2); }

  function reading() {
    var k = active();
    return k ? k.reading() : null;
  }
  function fallbackDamping(medium) {
    // used only if the kit failed to load: same rule as MassSpringKit.model.damping
    var ratio = { air: 0.97, water: 0.75, oil: 0.40 }[medium];
    var amps = []; for (var i = 0; i <= 5; i++) amps.push(Math.round(state.Acm * Math.pow(ratio, i) * 100) / 100);
    return { amps: amps, t10: null, E0: 0.5 * 24.5 * Math.pow(state.Acm / 100, 2) };
  }

  function tile(lab, val, hot) { return '<div' + (hot ? ' class="hot"' : "") + '><span>' + lab + '</span><b>' + val + '</b></div>'; }
  function paintReadout() {
    if (!readoutEl) return;
    var r = reading(), h = "";
    if (state.rig === "pendulum") {
      h = tile("h / cm", r ? f2((r.h || 0) * 100) : "–") + tile("PE / J", r ? fJ(r.PE) : "–") + tile("KE / J", r ? fJ(r.KE) : "–") + tile("Total / J", r ? fJ(r.E) : "–", true);
    } else if (state.rig === "energy") {
      h = tile("x / cm", r ? f2((r.x || 0) * 100) : "–") + tile("PE / J", r ? fJ(r.PE) : "–") + tile("KE / J", r ? fJ(r.KE) : "–") + tile("Total / J", r ? fJ(r.E) : "–", true);
    } else {
      h = tile("A / cm", r && r.A ? f2(r.A * 100) : "–") + tile("Cycle", r ? String(r.cycles || 0) : "–") + tile("E / J", r ? fJ(r.E) : "–", true) + tile("10T / s", r && r.display ? r.display.t10 : "–");
    }
    readoutEl.innerHTML = h;
  }

  // ---------- results table ----------
  function paintTable() {
    if (!tbody) return;
    var rows = "";
    for (var i = 0; i <= 5; i++) {
      rows += '<tr><td data-label="Cycle"><strong>' + i + '</strong></td>';
      MEDIA.forEach(function (m) {
        var a = state.rec[m];
        rows += '<td data-label="A ' + m + ' / cm">' + (a && a[i] != null ? a[i].toFixed(2) : "–") + "</td>";
      });
      rows += "</tr>";
    }
    tbody.innerHTML = rows;
    if (tfoot) {
      tfoot.innerHTML = '<tr><td data-label="Cycle"><strong>10 osc / s</strong></td>' + MEDIA.map(function (m) {
        return '<td data-label="10 osc ' + m + '">' + (state.t10[m] != null ? state.t10[m].toFixed(2) : "–") + "</td>";
      }).join("") + "</tr>";
    }
    var n = MEDIA.filter(function (m) { return state.rec[m] && state.rec[m].length >= 6; }).length;
    if (tally) tally.textContent = "Media recorded: " + n + " of 3 (air, water, oil)" + (n ? " · E₀ = ½kA² = " + fJ(0.5 * 24.5 * Math.pow(state.A0[state.medium] || state.Acm / 100, 2)) + " J" : "");
    return n;
  }

  // ---------- controls ----------
  function pressed(btns, attr, val) { btns.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute(attr) === String(val))); }); }
  function setHint(t) { if (hintEl) hintEl.textContent = t; }

  function setRig(rig) {
    if (["energy", "damping", "pendulum"].indexOf(rig) < 0) return;
    state.rig = rig; state.released = false;
    pressed(rigBtns, "data-rig", rig);
    if (spring) spring.visible = rig !== "pendulum";
    if (pend) pend.visible = rig === "pendulum";
    if (spring && rig !== "pendulum") spring.setState(rig === "energy" ? { mode: "energy", medium: "air", A: state.Acm / 100 } : { mode: "damping", medium: state.medium, A: state.Acm / 100 });
    if (pend && rig === "pendulum") pend.setState({ h0: state.Acm / 100 });
    medBtns.forEach(function (b) { b.classList.toggle("l6-dim", rig !== "damping"); });
    if (recBtn) recBtn.disabled = rig !== "damping";
    if (stage) setTimeout(frameRig, 30);
    setHint(rig === "energy" ? "Release, then watch KE and PE swap." : rig === "damping" ? "Pick a medium, Release, then Record after 5 cycles." : "Release the bob: PE at the ends, KE at the bottom.");
    cardState(rig === "energy" ? 0 : rig === "damping" ? 1 : 0, rig === "energy" ? 0 : rig === "damping" ? 1 : 0);
    paintReadout();
    emit("l6:bench-mode", { rig: rig });
  }
  function setMedium(m) {
    if (MEDIA.indexOf(m) < 0) return;
    if (state.rig !== "damping") setRig("damping");
    state.medium = m; state.released = false;
    pressed(medBtns, "data-medium", m);
    if (spring) spring.setState({ medium: m });
    setHint(NAME[m] + ": Release, wait for 5 cycles, then Record.");
    paintReadout();
  }
  function setA(cm) {
    cm = Math.max(2, Math.min(6, Math.round(+cm)));
    state.Acm = cm; state.released = false;
    pressed(ampBtns, "data-a", cm);
    if (spring) spring.setState({ A: cm / 100, reset: true });
    if (pend && state.rig === "pendulum") pend.setState({ h0: cm / 100 });
    paintReadout();
  }
  function release() {
    var k = active();
    if (state.rig === "pendulum") { if (pend) pend.release(); }
    else if (spring) { spring.setState({ reset: true }); spring.release(state.Acm / 100); }
    state.released = true;
    if (state.rig === "energy") { cardState(1, 1); toast("Released from A = " + state.Acm + " cm: E = ½kA² = " + fJ(0.5 * 24.5 * Math.pow(state.Acm / 100, 2)) + " J."); }
    else if (state.rig === "damping") { cardState(2, 2); toast("Released in " + NAME[state.medium].toLowerCase() + ". Record after 5 cycles."); }
    else toast("Released from h = " + state.Acm + " cm. Watch PE turn into KE.");
    emit("l6:bench", k ? k.reading() : { rig: state.rig });
  }
  function record() {
    if (state.rig !== "damping") { toast("Choose Damping to record amplitudes."); return null; }
    var out = null, r = null;
    if (spring) {
      if (!state.released) { toast("Release the load first."); return null; }
      out = spring.recordAmplitude(); r = spring.reading();
      if (!out) { toast("Release the load first."); return null; }
    } else {
      var fb = fallbackDamping(state.medium); out = { medium: state.medium, cycles: 5, amps: fb.amps }; r = { t10: null, E0: fb.E0 };
    }
    var amps = out.amps.slice(0, 6);
    state.rec[state.medium] = amps;
    state.A0[state.medium] = state.Acm / 100;
    if (out.cycles >= 5 && r && r.t10 != null) state.t10[state.medium] = +r.t10.toFixed(2);
    var n = paintTable();
    if (out.cycles < 5) toast(out.cycles + " cycle" + (out.cycles === 1 ? "" : "s") + " so far. Wait and Record again for 5.");
    else toast(NAME[state.medium] + " recorded: ratio " + (amps[1] / amps[0]).toFixed(2) + " per cycle.");
    var detail = { rig: "damping", medium: state.medium, amps: amps, cycles: out.cycles, ratio: out.ratio, A0: state.Acm, t10: state.t10[state.medium], E0: r ? r.E0 : null, recorded: n };
    emit("l6:bench", detail);
    if (n >= 3) {
      cardState(4, -1);
      if (!state.doneSent) { state.doneSent = true; emit("l6:bench-done", { media: 3, t10: state.t10 }); toast("All three media done. Compare the curves on the graph."); }
    } else if (n >= 1) cardState(3, 3);
    return detail;
  }
  function demo(medium) {
    // the stage loop pauses off-screen, so bring the bench into view before the timed run
    root.scrollIntoView({ behavior: "smooth", block: "center" });
    setMedium(medium || "water");
    setTimeout(function () {
      release();
      var tries = 0, iv = setInterval(function () {
        var r = reading(); tries++;
        if ((r && r.cycles >= 5) || tries > 60 || !spring) { clearInterval(iv); record(); }
      }, 300);
    }, 600);
  }
  function resetAll() {
    if (spring) spring.setState({ reset: true });
    if (pend) pend.setState({ reset: true });
    state.rec = {}; state.t10 = {}; state.A0 = {}; state.doneSent = false; state.released = false;
    paintTable(); setA(5); setRig("energy"); cardState(0, 0);
    emit("l6:bench-reset", {});
  }

  rigBtns.forEach(function (b) { b.addEventListener("click", function () { setRig(b.getAttribute("data-rig")); }); });
  medBtns.forEach(function (b) { b.addEventListener("click", function () { setMedium(b.getAttribute("data-medium")); }); });
  ampBtns.forEach(function (b) { b.addEventListener("click", function () { setA(b.getAttribute("data-a")); }); });
  if (relBtn) relBtn.addEventListener("click", release);
  if (recBtn) recBtn.addEventListener("click", record);
  if (resetBtn) resetBtn.addEventListener("click", resetAll);

  // tap a part → name it
  if (stage) {
    var ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), down = null;
    canvas.addEventListener("pointerdown", function (e) { down = [e.clientX, e.clientY]; });
    canvas.addEventListener("pointerup", function (e) {
      if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 6) { down = null; return; }
      down = null;
      var k = active(); if (!k || !k.pickPart) return;
      var rc = canvas.getBoundingClientRect();
      ndc.set(((e.clientX - rc.left) / rc.width) * 2 - 1, -((e.clientY - rc.top) / rc.height) * 2 + 1);
      ray.setFromCamera(ndc, stage.camera);
      var id = k.pickPart(ray);
      if (id) { k.highlight(id); toast(id.replace(/-/g, " ")); setTimeout(function () { k.highlight(null); }, 1200); }
    });
  }

  // ---------- scene API for narrator / tests ----------
  var PEND_PARTS = { "ke-bar": 1, "pe-bar": 1, "total-bar": 1, bob: 1, thread: 1, cork: 1, "h-marker": 1 };
  var api = {
    setMode: setRig, setRig: setRig, setMedium: setMedium, setA: setA, release: release, record: record, demo: demo, reset: resetAll,
    highlight: function (p) {
      if (spring) spring.highlight(state.rig !== "pendulum" ? (p || null) : null);
      if (pend) pend.highlight(state.rig === "pendulum" ? (p || null) : null);
    },
    rect: function (p) {
      if (!stage) return null;
      var k = active(); if (!k) return null;
      var o = (k.parts && p && k.parts[p]) || k;
      return stage.rectOf(o, 12);
    },
    reading: reading, state: state, kit: spring, pendulum: pend, stage: stage, model: model, parts: PEND_PARTS
  };
  window.StudyScenes = window.StudyScenes || {};
  window.StudyScenes.bench = api;

  paintTable(); setA(5); setRig("energy"); cardState(0, 0);
  setInterval(paintReadout, 250);
})();
