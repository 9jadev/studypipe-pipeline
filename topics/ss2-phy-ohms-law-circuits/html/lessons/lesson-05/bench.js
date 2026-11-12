/* Lesson 05 · 3D null-balance bench (window.StudyScenes.bench)
   DcCircuitBench in "bridge-potentiometer" mode on one SceneKit stage.
   Every reading (balance length, deduced R and E) comes from the kit's physics model, never typed text.
   Bridge: 7.0 Ω standard → balances at 56.0 cm → 5.50 Ω.
   Potentiometer (school driver, k = 0.0200): 1.50 V cell → balances at 75.0 cm.
   api.balanceKeke(): the mystery — Emeka's battery on the 24 V driver (k = 0.150) → 80.0 cm → 12.0 V. */
(function () {
  "use strict";
  var root = document.getElementById("bench-stage");
  var canvas = document.getElementById("bench-canvas");
  if (!root || !canvas || typeof THREE === "undefined" || !window.DcCircuitBench) return;

  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var $ = function (s) { return document.querySelector(s); };
  var toastEl = $("#bench-toast"), toastT;
  function toast(m) {
    if (!toastEl) return;
    toastEl.textContent = m; toastEl.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove("show"); }, 3200);
  }

  var narrow = window.innerWidth < 560;
  var state = { sub: "bridge", labels: !narrow, recorded: {} };

  var kit = DcCircuitBench.create({
    mode: "bridge-potentiometer", labels: state.labels,
    onEvent: onKitEvent
  });
  setBridgeDefaults();

  var stage = window.SceneKit && SceneKit.createStage({
    root: root, canvas: canvas, fov: 32,
    target: new THREE.Vector3(0, 0.4, 0.2), pitch: 0.62, yaw: 0, distance: 10, portraitPitch: 0.5,
    minYaw: -0.9, maxYaw: 0.9, onFrame: frame
  });
  if (stage) {
    stage.rig.add(kit);
    stage.start();
  }
  function frame(dt, t) { kit.update(dt, t); }

  function setBridgeDefaults() { kit.setState({ sub: "bridge", Rx: 7.0, Ru: 5.5, l: 30, key: true }); }
  function setSchoolPot() { kit.setState({ preset: "school-pot", l: 40, key: true }); }

  // ---------- DOM ----------
  var readoutEl = $("#bench-readout"), hintEl = $("#bench-hint"), line = $("#bench-line");
  var tbody = $("#results-table tbody");
  var slider = $("#bench-jockey"), lVal = $("#bench-l-val");
  var balanceBtn = $("#bench-balance"), labBtn = $("#bench-labels"), resetBtn = $("#bench-reset");
  var modeBtns = Array.prototype.slice.call(document.querySelectorAll("#bench-mode [data-sub]"));
  var cards = ["m1", "m2", "m3", "m4"].map(function (id) { return document.getElementById(id); });
  if (labBtn) labBtn.setAttribute("aria-pressed", String(state.labels));

  function cardState(done, now) {
    cards.forEach(function (c, i) { if (!c) return; c.classList.toggle("done", i < done); c.classList.toggle("now", i === now); });
  }

  function f1(v) { return (Math.round(v * 10) / 10).toFixed(1); }
  function f2(v) { return (Math.round(v * 100) / 100).toFixed(2); }
  function igmA(v) { return (Math.abs(v) < 2e-5 ? "0.00" : (v > 0 ? "+" : "−") + Math.abs(v * 1000).toFixed(2)); }

  function paintReadout() {
    if (!readoutEl) return;
    var r = kit.reading(), bridge = state.sub === "bridge", l = r.l != null ? r.l : 30, balanced = !!r.balanced;
    var third, result;
    if (bridge) {
      third = { lab: "100 − l", val: f1(100 - l) + " cm" };
      var R = l > 0 ? r.Rx * (100 - l) / l : 0;
      result = "R = " + f2(R) + " Ω";
    } else {
      third = { lab: "V_AJ = kl", val: f2((r.k_cal != null ? r.k_cal : r.k) * l) + " V" };
      result = "E = " + f2((r.k_cal != null ? r.k_cal : r.k) * l) + " V";
    }
    readoutEl.innerHTML =
      '<div><span>Jockey l</span><b>' + f1(l) + ' cm</b></div>' +
      '<div><span>' + third.lab + '</span><b>' + third.val + '</b></div>' +
      '<div class="' + (balanced ? "is-null" : "") + '"><span>Galvanometer I_g</span><b>' + (balanced ? "0.00 · NULL" : igmA(r.I_G) + " mA") + '</b></div>' +
      '<div class="' + (balanced ? "is-null" : "") + '"><span>Result</span><b>' + (balanced ? result : "—") + '</b></div>';
  }

  function addRow(row) {
    if (!tbody) return;
    var bridge = row.kind === "bridge";
    var who = bridge ? "Metre bridge · " + f1(row.Rx) + " Ω standard" : "Potentiometer · " + (row.cell || "test cell");
    var result = bridge
      ? "R = " + f1(row.Rx) + " × " + f1(row.l_rest) + "/" + f1(row.l) + " = " + f2(row.R) + " Ω"
      : "E = " + (row.k) + " × " + f1(row.l) + " = " + f2(row.E_deduced) + " V";
    var keyName = row.kind;
    var tr = tbody.querySelector('tr[data-kind="' + keyName + '"]');
    if (!tr) { tr = document.createElement("tr"); tr.setAttribute("data-kind", keyName); tbody.appendChild(tr); }
    tr.innerHTML = "<td>" + who + "</td><td>" + f1(row.l) + "</td><td>" + result + "</td>";
    Array.prototype.forEach.call(tbody.children, function (x) { x.classList.toggle("fresh", x === tr); });
    state.recorded[keyName] = true;
    var n = Object.keys(state.recorded).length;
    if (line) line.textContent = "Balances recorded: " + n + " of 2";
    cardState(n >= 2 ? 4 : 3, n >= 2 ? -1 : 2);
  }

  // ---------- kit events ----------
  function onKitEvent(name, d) {
    if (name === "reading" || name === "state") { paintReadout(); emit("l5:bench", kit.reading()); }
    else if (name === "mode") { paintReadout(); }
    else if (name === "balance") { addRow(d); paintReadout(); emit("l5:bench", kit.reading()); }
    else if (name === "search-start") { toast("Tapping the jockey towards the null point…"); }
    else if (name === "no-balance") { toast("No balance on this wire — adjust the driver or standard."); }
    else if (name === "done") { emit("l5:bench-done", kit.reading()); toast("Both balances recorded. The potentiometer reads the true EMF."); }
    else if (name === "reset") { paintReadout(); }
  }

  // ---------- controls ----------
  function syncSlider() {
    var r = kit.reading(), l = r.l != null ? r.l : 30;
    if (slider && document.activeElement !== slider) slider.value = String(l);
    if (lVal) lVal.textContent = f1(l) + " cm";
  }
  function setSub(sub) {
    if (sub !== "bridge" && sub !== "potentiometer") return;
    state.sub = sub;
    modeBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-sub") === sub)); });
    if (sub === "bridge") { setBridgeDefaults(); if (hintEl) hintEl.textContent = "Metre bridge: 7.0 Ω standard in the left gap. Find the null."; cardState(Object.keys(state.recorded).length >= 2 ? 4 : 0, 0); }
    else { setSchoolPot(); if (hintEl) hintEl.textContent = "Potentiometer: 1.50 V cell, k = 0.0200 V cm⁻¹. Find the null (75.0 cm)."; cardState(Object.keys(state.recorded).length >= 2 ? 4 : 1, 1); }
    syncSlider(); paintReadout();
  }
  function findNull() {
    if (kit.reading().busy) return;
    var ok = kit.findBalance();
    if (!ok) toast("Close the key, then find the null.");
    else cardState(state.sub === "bridge" ? 3 : 3, 2);
  }

  modeBtns.forEach(function (b) { b.addEventListener("click", function () { setSub(b.getAttribute("data-sub")); }); });
  if (slider) slider.addEventListener("input", function () {
    if (kit.reading().busy) { syncSlider(); return; }
    kit.setJockey(+slider.value); if (lVal) lVal.textContent = f1(+slider.value) + " cm";
  });
  if (balanceBtn) balanceBtn.addEventListener("click", findNull);
  if (labBtn) labBtn.addEventListener("click", function () { state.labels = !state.labels; labBtn.setAttribute("aria-pressed", String(state.labels)); kit.setState({ labels: state.labels }); });
  if (resetBtn) resetBtn.addEventListener("click", function () {
    state.recorded = {};
    if (tbody) tbody.innerHTML = "";
    if (line) line.textContent = "Balances recorded: 0 of 2";
    kit.reset(); setSub("bridge");
    emit("l5:bench-reset", {});
    toast("Bench reset.");
  });

  // tapping the 3D bench names the part
  if (stage) {
    var down = null, ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
    canvas.addEventListener("pointerdown", function (e) { down = { x: e.clientX, y: e.clientY }; });
    canvas.addEventListener("pointerup", function (e) {
      if (!down || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 6) { down = null; return; }
      down = null;
      var rct = canvas.getBoundingClientRect();
      ndc.set(((e.clientX - rct.left) / rct.width) * 2 - 1, -((e.clientY - rct.top) / rct.height) * 2 + 1);
      ray.setFromCamera(ndc, stage.camera);
      var id = kit.pickPart(ray);
      if (id) toast(id.replace(/([A-Z])/g, " $1").toLowerCase());
    });
  }

  // ---------- scene API for the narrator, the bridge and tests ----------
  var api = {
    setMode: function (m) { if (m === "bridge" || m === "potentiometer") setSub(m); },
    sub: function () { return state.sub; },
    findBalance: findNull,
    balanceKeke: function () {
      state.sub = "potentiometer";
      modeBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-sub") === "potentiometer")); });
      kit.setState({ preset: "keke-pot", l: 40, key: true });
      if (hintEl) hintEl.textContent = "Emeka's battery on the 24 V driver (k = 0.150 V cm⁻¹). Find the null (80.0 cm).";
      syncSlider(); paintReadout();
      setTimeout(findNull, 200);
    },
    highlight: function (p) { kit.highlight(p || null); },
    rect: function (p) {
      if (!stage) return null;
      var o = (p && kit.parts && kit.parts[p]) || kit;
      return stage.rectOf(o, 12);
    },
    reading: function () { return kit.reading(); },
    kit: kit, stage: stage, state: state
  };
  window.StudyScenes = window.StudyScenes || {};
  window.StudyScenes.bench = api;

  cardState(0, 0); setSub("bridge");
  setInterval(function () { syncSlider(); paintReadout(); }, 220);
})();
