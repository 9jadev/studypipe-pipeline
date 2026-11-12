/* Lesson 02 · 3D spiral-spring bench (window.StudyScenes.bench)
   MassSpringKit v2: `hooke` (add 50 g slotted masses, read the pointer) then `period` (pull, release, time 20),
   plus the parked `okada` (200 / 250 kg, press & release, time 20 bounces). Every number on this page comes from
   kit.reading() / MassSpringKit.model — nothing is typed in. Emits l2:bench (reading + rows), l2:bench-done, l2:bench-reset. */
(function () {
  "use strict";
  var root = document.getElementById("bench-stage");
  var canvas = document.getElementById("bench-canvas");
  var D = window.L02;
  if (!root || !canvas || !D) return;

  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  var toastEl = $("#bench-toast"), toastT;
  function toast(m) {
    if (!toastEl) return;
    toastEl.textContent = m; toastEl.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove("show"); }, 3400);
  }

  if (typeof THREE === "undefined" || !window.MassSpringKit) {
    /* fallback: kit missing — never throw; the table, expected results and worked examples still work */
    toast("The 3D spring bench is not available on this device. Use the expected results below.");
    root.classList.add("no-webgl");
    return;
  }

  var M = MassSpringKit.model;
  var small = root.clientWidth < 560;
  var state = { rig: "lab", mode: "hooke", okMass: 200 };
  var rows = {};          // keyed by mass (g): { m, F, x_cm, t, T, T2 } — one compact row per load
  var okRows = {};        // keyed by okada mass: { mass, t, T, f0 }
  var doneSent = false;

  var kit = MassSpringKit.create({ mode: "hooke", m: 0.05, k: D.k, labels: !small, onEvent: onKitEvent });

  var stage = window.SceneKit && SceneKit.createStage({
    root: root, canvas: canvas, fov: 32, pitch: 0.1, yaw: 0.3, autoFit: false, portraitPitch: 0.06,
    minYaw: -0.9, maxYaw: 0.9, onFrame: frame
  });
  if (stage) { stage.rig.add(kit); frameKit(stage, kit, false); stage.start(); }
  function frame(dt, t) { kit.update(dt, t); }
  function refit() { setTimeout(function () { frameKit(stage, kit, state.rig === "okada"); }, 30); }
  if (window.ResizeObserver && stage) new ResizeObserver(function () { refit(); }).observe(canvas.parentElement);

  /* framing from the kit's own viewFor("all") (the stand and bench top would otherwise shrink the spring) */
  function frameKit(st, k, wide) {
    if (!st) return;
    var v = k.viewFor("all"), span = v.dist * 2 * Math.tan(20 * Math.PI / 180) / 1.25;
    st.target.set(v.target[0], v.target[1], v.target[2]);
    st.fitHeight = span * (wide ? 0.62 : 1.06);
    st.fitWidth = span * (wide ? 1.08 : 0.5);
    st.zoom = 1;
    if (st.resize) st.resize();
  }


  // ---------- DOM ----------
  var readoutEl = $("#bench-readout"), hintEl = $("#bench-hint");
  var tbody = $("#results-table tbody"), okBody = $("#okada-table tbody"), rowsLine = $("#rows-line");
  var rigBtns = $$("#bench-rig [data-rig]"), modeBtns = $$("#bench-mode [data-mode]");
  var labCtl = $("#bench-lab"), okCtl = $("#bench-okada"), modeBar = $("#bench-mode");
  var cards = ["m1", "m2", "m3", "m4"].map(function (id) { return document.getElementById(id); });

  function gKey(m) { return String(Math.round(m * 1000)); }
  function hookeRow(m) {
    var h = M.hooke(m, D.k, D.g);
    var r = rows[gKey(m)] || (rows[gKey(m)] = { m: m });
    r.F = h.F; r.Fs = h.F.toPrecision(3); r.x = h.x; r.x_cm = h.display.x_cm; r.pointer = h.display.pointer_cm;
    return r;
  }
  function list() { return Object.keys(rows).map(function (k) { return rows[k]; }).sort(function (a, b) { return a.m - b.m; }); }
  function timedCount() { return list().filter(function (r) { return r.t != null; }).length; }

  function cardState() {
    var n = list().length, tc = timedCount(), done, now;
    if (tc >= 5) { done = 4; now = -1; }
    else if (tc >= 1) { done = 2; now = 2; }
    else if (n >= 2) { done = 1; now = state.mode === "period" ? 2 : 1; }
    else { done = 0; now = n ? 1 : 0; }
    cards.forEach(function (c, i) { if (!c) return; c.classList.toggle("done", i < done); c.classList.toggle("now", i === now); });
  }

  function tile(lbl, val, hot) { return '<div' + (hot ? ' class="hot"' : "") + '><span>' + lbl + '</span><b>' + val + "</b></div>"; }
  function paintReadout() {
    if (!readoutEl) return;
    var r = kit.reading();
    if (state.rig === "okada") {
      var w = r.watch || { t: 0 };
      readoutEl.innerHTML = tile("load / kg", String(state.okMass)) + tile("t / s", (w.t || 0).toFixed(1), w.running) +
        tile("T₀ / s", r.display ? r.display.T : "–") + tile("f₀ / Hz", r.display ? r.display.f0 : "–");
      return;
    }
    var h = M.hooke(kit.getState().m, D.k, D.g);
    var wt = r.watch ? r.watch.t : 0, timed = r.watch && r.watch.timed;
    readoutEl.innerHTML = tile("m / kg", h.display.m) + tile("x / cm", h.display.x_cm) +
      tile("t / s", state.mode === "period" ? (wt || 0).toFixed(2) : "–", r.watch && r.watch.running) +
      tile("T / s", state.mode === "period" && timed ? r.display.T : "–");
  }

  function paintTable() {
    if (tbody) {
      tbody.innerHTML = "";
      list().forEach(function (r) {
        var tr = document.createElement("tr");
        if (Math.abs(r.m - kit.getState().m) < 1e-6 && state.rig === "lab") tr.className = "fresh";
        tr.innerHTML = "<td>" + r.m.toFixed(3) + "</td><td>" + r.Fs + "</td><td>" + r.x_cm + "</td>" +
          "<td>" + (r.t != null ? r.t : "–") + "</td><td>" + (r.T != null ? r.T : "–") + "</td><td>" + (r.T2 != null ? r.T2 : "–") + "</td>";
        tbody.appendChild(tr);
      });
    }
    if (okBody) {
      okBody.innerHTML = "";
      D.okadaMasses.forEach(function (mk) {
        var o = okRows[mk]; if (!o) return;
        var tr = document.createElement("tr");
        tr.innerHTML = "<td>" + mk + "</td><td>" + o.t + "</td><td>" + o.T + "</td><td>" + o.f0 + "</td>";
        okBody.appendChild(tr);
      });
      var wrap = $("#okada-wrap"); if (wrap) wrap.hidden = !Object.keys(okRows).length;
    }
    if (rowsLine) rowsLine.textContent = "Loads read: " + list().length + " of 5 · timed: " + timedCount() + " of 5";
    cardState();
  }

  function detail() {
    var r = kit.reading();
    r.rig = state.rig; r.rows = list().map(function (x) { return { m: x.m, F: x.F, x: x.x, t: x.t != null ? +x.t : null, T: x.T != null ? +x.T : null, T2: x.T2 != null ? +x.T2 : null }; });
    r.okada = Object.keys(okRows).map(function (k) { return okRows[k]; });
    return r;
  }
  function publish() { paintTable(); paintReadout(); emit("l2:bench", detail()); }

  function paintBtns() {
    rigBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-rig") === state.rig)); });
    modeBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-mode") === state.mode)); });
    if (labCtl) labCtl.hidden = state.rig !== "lab";
    if (okCtl) okCtl.hidden = state.rig !== "okada";
    if (modeBar) modeBar.hidden = state.rig !== "lab";
    var m = kit.getState().m;
    var add = $("#bench-add"), rem = $("#bench-remove");
    if (add) add.disabled = state.rig !== "lab" || m >= 0.25 - 1e-6;
    if (rem) rem.disabled = state.rig !== "lab" || m <= 0.05 + 1e-6;
    $$("#bench-okada [data-mass]").forEach(function (b) { b.setAttribute("aria-pressed", String(+b.getAttribute("data-mass") === state.okMass)); });
  }

  // ---------- kit events ----------
  function onKitEvent(name, d) {
    if (name === "mass") {
      if (state.rig !== "lab") return;
      var r = hookeRow(d.m);
      hint("Load " + r.m.toFixed(3) + " kg: pointer " + r.pointer + " cm, x = " + r.x_cm + " cm.");
      publish(); paintBtns();
    } else if (name === "timed") {
      if (state.rig === "okada") {
        var o = kit.reading();
        okRows[state.okMass] = { mass: state.okMass, t: o.display.t, T: o.display.T, f0: o.display.f0 };
        toast("20 bounces with " + state.okMass + " kg: " + o.display.t + " s, so T₀ = " + o.display.T + " s.");
        hint("Okada " + state.okMass + " kg: 20 bounces in " + o.display.t + " s.");
        publish(); return;
      }
      var rd = kit.reading(), row = hookeRow(rd.m);
      row.t = rd.display.t; row.T = rd.display.T; row.T2 = rd.display.T2;
      toast("20 oscillations: " + rd.display.t + " s, so T = " + rd.display.T + " s.");
      hint("Timed " + rd.m.toFixed(3) + " kg. " + (timedCount() < 5 ? "Add 50 g and time the next load." : "All five loads timed."));
      publish();
      if (timedCount() >= 5 && !doneSent) {
        doneSent = true;
        toast("Five loads timed. The two graphs below each give k.");
        emit("l2:bench-done", { count: 5 });
      }
    } else if (name === "press") {
      hint("Okada " + state.okMass + " kg pressed and released. Press Time 20.");
    }
  }
  function hint(t) { if (hintEl) hintEl.textContent = t; }

  // ---------- controls ----------
  function setRig(rig) {
    if (rig === state.rig) return;
    state.rig = rig;
    if (rig === "okada") kit.setState({ mode: "okada", view: "bench", parked: true, mass: state.okMass });
    else kit.setState({ mode: state.mode });
    paintBtns(); paintReadout(); refit();
    hint(rig === "okada" ? "Okada parked with " + state.okMass + " kg. Press, then Time 20." : "Lab spring, k = 24.5 N m⁻¹.");
  }
  function setMode(mode) {
    if (mode === "okada") { setRig("okada"); return; }
    if (state.rig !== "lab") setRig("lab");
    if (mode === state.mode) return;
    state.mode = mode;
    kit.setState({ mode: mode });
    paintBtns(); paintReadout();
    hint(mode === "hooke" ? "Hooke: add 50 g at a time and read the pointer." : "Time it: Pull & release, then Time 20.");
  }
  function addMass() { if (state.rig !== "lab") setRig("lab"); kit.addMass(0.05); paintBtns(); }
  function removeMass() { if (state.rig !== "lab") setRig("lab"); kit.removeMass(0.05); paintBtns(); }
  function release() {
    if (state.rig === "okada") { kit.press(0.03); return; }
    if (state.mode !== "period") setMode("period");
    kit.release(0.02);
    hint("Released from 2 cm below. Press Time 20.");
  }
  function time20() {
    if (state.rig === "okada") { kit.press(0.03); kit.timeN(20); hint("Timing 20 bounces…"); return; }
    if (state.mode !== "period") setMode("period");
    if (!kit.reading().released) kit.release(0.02);
    kit.timeN(20);
    hint("Timing 20 oscillations from the equilibrium pass…");
  }
  function okLoad(mass) {
    state.okMass = +mass;
    if (state.rig !== "okada") setRig("okada");
    kit.setState({ mass: state.okMass, parked: true });
    paintBtns(); paintReadout();
    hint("Okada with " + state.okMass + " kg (" + (state.okMass === 250 ? "two extra crates" : "the usual load") + "). Press, then Time 20.");
  }
  function resetAll() {
    rows = {}; okRows = {}; doneSent = false;
    state.rig = "lab"; state.mode = "hooke"; state.okMass = 200;
    kit.setState({ mode: "hooke", mass: 200 });
    kit.reset();
    kit.setState({ m: 0.05 });
    hookeRow(0.05);
    paintBtns(); publish(); refit();
    hint("Empty hanger (50 g) on the spring. Add 50 g at a time.");
    emit("l2:bench-reset", {});
  }

  rigBtns.forEach(function (b) { b.addEventListener("click", function () { setRig(b.getAttribute("data-rig")); }); });
  modeBtns.forEach(function (b) { b.addEventListener("click", function () { setMode(b.getAttribute("data-mode")); }); });
  $$("#bench-okada [data-mass]").forEach(function (b) { b.addEventListener("click", function () { okLoad(b.getAttribute("data-mass")); }); });
  [["#bench-add", addMass], ["#bench-remove", removeMass], ["#bench-release", release], ["#bench-time", time20],
   ["#bench-press", release], ["#bench-oktime", time20], ["#bench-reset", resetAll]].forEach(function (p) {
    var el = $(p[0]); if (el) el.addEventListener("click", p[1]);
  });

  // tapping the 3D model names a part
  if (stage) {
    var down = null, ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
    canvas.addEventListener("pointerdown", function (e) { down = { x: e.clientX, y: e.clientY }; });
    canvas.addEventListener("pointerup", function (e) {
      if (!down || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 6) { down = null; return; }
      down = null;
      var r = canvas.getBoundingClientRect();
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, stage.camera);
      var id = kit.pickPart(ray);
      if (id) { toast(id.replace(/-/g, " ")); kit.highlight(id); setTimeout(function () { kit.clearHighlight(); }, 1200); }
    });
  }

  // ---------- scene API (narrator, bridge, explorer) ----------
  var api = {
    setMode: setMode,
    rig: setRig,
    addMass: addMass, removeMass: removeMass, release: release, time: time20, okLoad: okLoad,
    reset: resetAll,
    setMass: function (m) { if (state.rig !== "lab") setRig("lab"); kit.setState({ m: m }); paintBtns(); },
    okadaRun: function (mass) { okLoad(mass); kit.press(0.03); kit.timeN(20); hint("Timing 20 bounces with " + mass + " kg…"); },
    highlight: function (p) { if (!p) kit.clearHighlight(); else kit.highlight(p); },
    rect: function (p) {
      if (!stage) return null;
      if (!p || p === "bench") return stage.rectOf(kit, 12);
      var o = kit.parts && kit.parts[p];
      return stage.rectOf(o || kit, 10);
    },
    reading: function () { return kit.reading(); },
    rows: list,
    kit: kit, stage: stage, state: state
  };
  window.StudyScenes = window.StudyScenes || {};
  window.StudyScenes.bench = api;

  hookeRow(0.05);
  paintBtns(); publish();
  hint("Empty hanger (50 g) on the spring. Add 50 g at a time.");
  setInterval(paintReadout, 250);
})();
