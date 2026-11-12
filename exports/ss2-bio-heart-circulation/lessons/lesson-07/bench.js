/* Lesson 07 · 3D ABO and Rhesus typing bench (window.StudyScenes.bench)
   Wraps AboTypingBench (assets/js/abo-typing-bench.js) on a SceneKit stage. Clumping, groups and verdicts all come from the kit's model. */
(function () {
  "use strict";
  var root = document.getElementById("bench-stage");
  var canvas = document.getElementById("bench-canvas");
  var D = window.L07;
  if (!root || !canvas || !D || typeof THREE === "undefined" || !window.AboTypingBench) return;

  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var toastEl = document.getElementById("bench-toast"), toastT;
  function toast(m) {
    if (!toastEl) return;
    toastEl.textContent = m; toastEl.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove("show"); }, 3600);
  }
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var ABT = window.AboTypingBench;

  var COND = {
    careful: { earlyRead: false, reusedStirrer: false, dryingEdge: false },
    early: { earlyRead: true, reusedStirrer: false, dryingEdge: false },
    stirrer: { earlyRead: false, reusedStirrer: true, dryingEdge: false },
    drying: { earlyRead: false, reusedStirrer: false, dryingEdge: true }
  };
  var COND_NOTE = {
    careful: "Careful technique: fresh stirrers and the full 2 minutes.",
    early: "Reading too soon: weak clumps may be missed (false negative).",
    stirrer: "One stirrer for every well: serum can be carried between wells (false positive).",
    drying: "A drying edge can look grainy and be mistaken for clumping (false positive)."
  };
  var kit = ABT.create({ sample: "rider", view: "bench", patient: D.patient, labels: false });
  var P = kit.parts;
  var state = { cond: "careful", step: 0, busy: 0, hl: null, labels: false, auto: false, rows: {}, active: "rider", done: 0 };

  var stage = window.SceneKit && SceneKit.createStage({
    root: root, canvas: canvas, fov: 36,
    target: new THREE.Vector3(0, 0.5, 1.2), pitch: 0.9, yaw: 0, distance: 40, fitWidth: 24, fitHeight: 28,
    minYaw: -0.9, maxYaw: 0.9, autoFit: false, portraitPitch: 0, onFrame: frame
  });
  var highlighter = null, scratch = new THREE.PerspectiveCamera(36, 1, 0.5, 300);
  if (stage) {
    stage.rig.add(kit);
    ABT.lights(stage.scene);
    try { stage.scene.environment = ABT.environment(stage.renderer); stage.envOff = true; } catch (er) {}
    highlighter = kit.attachHighlighter(stage.scene);
    stage.start();
    refit();
    if (window.ResizeObserver) new ResizeObserver(refit).observe(canvas.parentElement); else window.addEventListener("resize", refit);
  }
  // frame the view the way the kit asks (AboTypingBench.fit), then hand the result to the stage
  function refit() {
    if (!stage) return;
    var h = canvas.parentElement;
    var w = h.clientWidth || 360, ht = h.clientHeight || 400;
    ABT.fit(scratch, null, w / ht, kit.params.view);
    var tgt = new THREE.Vector3(), dir;
    // recover target (the kit looks at its own target) from the quaternion: use the forward ray and the known distance
    var fwd = new THREE.Vector3(0, 0, -1).applyQuaternion(scratch.quaternion);
    var view = kit.params.view, ty = view === "bench" || !view ? [0.5, 1.2] : view === "agglutination" ? [0.2, 0] : [2.2, 0];
    tgt.set(0, ty[0], ty[1]);
    var dist = scratch.position.distanceTo(tgt);
    var pitch = Math.asin(Math.max(-1, Math.min(1, (scratch.position.y - tgt.y) / dist)));
    stage.target.copy(tgt); stage.pitch = pitch; stage.dist = dist; stage.zoom = 1; stage.yaw = 0;
    stage.fitWidth = null; stage.fitHeight = null;
  }
  function frame(dt, t) {
    kit.update(dt, t);
    if (state.busy > 0) { state.busy -= dt; if (state.busy <= 0) syncButtons(); }
  }

  // ---------- DOM ----------
  var readoutEl = $("#bench-readout"), hint = $("#bench-hint"), safeLine = $("#safe-line");
  var btns = [1, 2, 3, 4].map(function (n) { return $("#bench-s" + n); });
  var autoBtn = $("#bench-auto"), resetBtn = $("#bench-reset"), labBtn = $("#bench-labels");
  var sampleBtns = Array.prototype.slice.call(document.querySelectorAll("#bench-sample [data-sample]"));
  var condBtns = Array.prototype.slice.call(document.querySelectorAll("#bench-cond [data-cond]"));
  var tbody = $("#results-table tbody");
  var cards = ["m1", "m2", "m3", "m4"].map(function (id) { return document.getElementById(id); });
  function cardState(done, now) {
    cards.forEach(function (c, i) { if (!c) return; c.classList.toggle("done", i < done); c.classList.toggle("now", i === now); });
  }
  function rhText(rh) { return rh === "+" ? "Rh+" : "Rh−"; }
  function buildTable() {
    if (!tbody) return;
    tbody.innerHTML = "";
    D.order.forEach(function (k) {
      var tr = document.createElement("tr");
      tr.setAttribute("data-sample", k);
      tr.innerHTML = "<td><strong>" + D.names[k] + '</strong></td><td class="empty" data-c="A">—</td><td class="empty" data-c="B">—</td><td class="empty" data-c="D">—</td><td class="empty" data-c="abo">—</td><td class="empty" data-c="rh">—</td><td class="empty" data-c="safe">—</td>';
      tbody.appendChild(tr);
    });
  }
  function setCell(tr, c, text, cls) {
    var td = tr.querySelector('[data-c="' + c + '"]'); if (!td) return;
    td.textContent = text; td.className = text === "—" ? "empty" : (cls || "");
  }
  function paintRow(r, flash) {
    var tr = tbody && tbody.querySelector('tr[data-sample="' + r.sample + '"]'); if (!tr) return;
    var pm = function (b) { return b ? "+" : "−"; };
    setCell(tr, "A", pm(r.A), r.A ? "pos" : ""); setCell(tr, "B", pm(r.B), r.B ? "pos" : ""); setCell(tr, "D", pm(r.D), r.D ? "pos" : "");
    setCell(tr, "abo", r.abo); setCell(tr, "rh", rhText(r.rh));
    if (r.sample === "rider") setCell(tr, "safe", "(patient)");
    else {
      var c = ABT.compat(D.patient, { abo: r.abo, rh: r.rh });
      setCell(tr, "safe", c.safe ? "yes" : "no", c.safe ? "yes" : "no");
    }
    tr.classList.toggle("fresh", !!flash);
  }
  function clearRow(sample) {
    var tr = tbody && tbody.querySelector('tr[data-sample="' + sample + '"]'); if (!tr) return;
    ["A", "B", "D", "abo", "rh", "safe"].forEach(function (c) { setCell(tr, c, "—"); });
    tr.classList.remove("fresh");
  }
  function paintSafeLine() {
    if (!safeLine) return;
    var n = Object.keys(state.rows).length;
    if (n < D.order.length) { safeLine.textContent = "Read all five rows to choose the rider's bag. Rows read: " + n + " of 5."; return; }
    var safeDonors = D.order.filter(function (k) {
      var r = state.rows[k]; return k !== "rider" && r && ABT.compat(D.patient, { abo: r.abo, rh: r.rh }).safe;
    }).map(function (k) { return D.names[k] + " (" + state.rows[k].abo + rhText(state.rows[k].rh).replace("Rh", "") + ")"; });
    var bagList = ABT.bags(D.patient).filter(function (b) { return b.safe; }).map(function (b) { return b.bag; });
    safeLine.innerHTML = "Safe for the rider from your tile: <strong>" + (safeDonors.join(", ") || "none") + "</strong>. Safe bags in the cool box: <strong>" + bagList.join(" and ") + "</strong> (B− first, O− if B− runs out).";
  }
  function paintReadout() {
    if (!readoutEl) return;
    var r = kit.reading();
    var pat = r.pattern, rock = r.step >= 4 ? Math.round(r.rock_s) + " s" : "0 s";
    readoutEl.innerHTML =
      "<div><span>Sample</span><b>" + r.label + "</b></div>" +
      "<div><span>Step</span><b>" + Math.min(r.step, 5) + " / 5</b></div>" +
      "<div><span>Rocking</span><b>" + rock + "</b></div>" +
      (r.read
        ? '<div class="hot"><span>A/B/D</span><b>' + pat + "</b></div><div class=\"hot\"><span>Group</span><b>" + String(r.group).replace("Rh-", "Rh−") + "</b></div>"
        : "<div><span>A/B/D</span><b>? ? ?</b></div><div><span>Group</span><b>read first</b></div>");
  }
  function paintHint() {
    if (hint) hint.innerHTML = "Samples read: <b>" + state.done + " of 5</b>";
    sampleBtns.forEach(function (b) {
      var k = b.getAttribute("data-sample"), isDone = !!state.rows[k];
      b.classList.toggle("isdone", isDone);
      b.setAttribute("aria-pressed", String(k === state.active));
      b.disabled = isDone && k !== state.active;
    });
  }
  function syncButtons() {
    var locked = state.busy > 0 || state.auto;
    btns.forEach(function (b, i) {
      if (!b) return;
      b.disabled = locked || state.step !== NEED[i] || !!state.rows[state.active];
      b.classList.toggle("zobo", !b.disabled);
    });
    condBtns.forEach(function (b) { b.disabled = state.step > 0 || !!state.rows[state.active]; });
    if (resetBtn) resetBtn.disabled = state.step === 0 && !state.rows[state.active];
    var mapDone = state.step === 0 ? 0 : state.step === 1 ? 1 : state.step <= 3 ? 2 : state.step === 4 ? 3 : 4;
    cardState(state.rows[state.active] ? 4 : mapDone, state.rows[state.active] ? -1 : Math.min(mapDone, 3));
  }

  // ---------- kit events ----------
  kit.onEvent = function (name, detail) {
    if (name === "step") {
      var n = detail.step, prev = state.step; state.step = n;
      // the sequence is 5 steps in the kit and 4 method cards: serum(1), sample+mix(2,3), rock(4), read(5)
      state.busy = Math.max(0.6, Math.abs(n - prev) * 1.3);
      syncButtons(); paintReadout();
    } else if (name === "sample") {
      var r = detail; state.rows[r.sample] = r; state.done = Object.keys(state.rows).length;
      paintRow(r, true); paintHint(); paintSafeLine(); syncButtons(); paintReadout();
      if (r.faults && r.faults.length) toast(D.faultNote[r.faults[0]] || "Your technique affected this reading.");
      else toast(D.names[r.sample] + " read: " + String(r.group).replace("Rh-", "Rh−") + ". Choose the next sample.");
      emit("l7:bench", r);
    } else if (name === "done") {
      toast("All five samples read. Check the rider's bag in the table.");
      emit("l7:bench-done", detail);
    }
  };
  // ---------- controls ----------
  var NEED = [0, 1, 3, 4], TARGET = [1, 3, 4, 5];     // kit step needed before each button, and the kit step it runs to
  function go(n) {
    if (state.rows[state.active] || state.step !== NEED[n - 1]) return;
    kit.setStep(TARGET[n - 1]);
  }
  btns.forEach(function (b, i) { b && b.addEventListener("click", function () { go(i + 1); }); });
  function pickSample(k) {
    if (!k || k === state.active || state.rows[k]) return;
    state.active = k; state.step = 0; state.busy = 0;
    kit.pause(); state.auto = false; autoBtn.setAttribute("aria-pressed", "false"); autoBtn.textContent = "Auto-run";
    kit.setState({ sample: k });
    syncButtons(); paintHint(); paintReadout(); toast(D.names[k] + " selected.");
  }
  sampleBtns.forEach(function (b) { b.addEventListener("click", function () { pickSample(b.getAttribute("data-sample")); }); });
  function setCond(c) {
    if (!COND[c]) return;
    state.cond = c;
    kit.setState({ errors: COND[c] });
    condBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-cond") === c)); });
    toast(COND_NOTE[c]);
    paintReadout(); syncButtons();
    emit("l7:bench-reset", { cond: c });
  }
  condBtns.forEach(function (b) { b.addEventListener("click", function () { setCond(b.getAttribute("data-cond")); }); });
  function redo() {
    var k = state.active;
    kit.pause(); state.auto = false; autoBtn.setAttribute("aria-pressed", "false"); autoBtn.textContent = "Auto-run";
    kit.reset(); state.step = 0; state.busy = 0;
    if (state.rows[k]) { delete state.rows[k]; state.done = Object.keys(state.rows).length; clearRow(k); }
    paintHint(); paintSafeLine(); syncButtons(); paintReadout();
    emit("l7:bench-reset", { sample: k });
  }
  resetBtn.addEventListener("click", redo);
  autoBtn.addEventListener("click", function () {
    if (state.rows[state.active]) return;
    state.auto = !state.auto;
    autoBtn.setAttribute("aria-pressed", String(state.auto)); autoBtn.textContent = state.auto ? "Pause" : "Auto-run";
    if (state.auto) kit.play(); else kit.pause();
    syncButtons();
  });
  labBtn.addEventListener("click", function () {
    state.labels = !state.labels; labBtn.setAttribute("aria-pressed", String(state.labels));
    toast(state.labels ? "Labels are shown in the readout and the narration." : "Labels hidden.");
  });
  function reset() {
    kit.pause(); state.auto = false; autoBtn.setAttribute("aria-pressed", "false"); autoBtn.textContent = "Auto-run";
    kit.setState({ errors: COND.careful, sample: "rider" });
    kit.reset();
    state.cond = "careful"; state.step = 0; state.busy = 0; state.rows = {}; state.done = 0; state.active = "rider";
    condBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-cond") === "careful")); });
    buildTable(); paintHint(); paintSafeLine(); syncButtons(); paintReadout();
    emit("l7:bench-reset", {});
  }

  // ---------- scene API for the narrator and the tests ----------
  function wellObj(col) {
    var cells = P.wells && P.wells.userData.cells, row = D.order.indexOf(state.active);
    var c = cells && cells[row * 3 + col]; return c ? c.group : null;
  }
  function partObj(p) {
    if (p === "wellA") return wellObj(0);
    if (p === "wellB") return wellObj(1);
    if (p === "wellD") return wellObj(2);
    return P[p] || null;
  }
  function setHighlight(name) {
    state.hl = name || null;
    if (!highlighter) return;
    highlighter.set(name ? partObj(name) : null);
  }
  function finishSample(sample) {      // used by the narrator: run one full careful sample quickly
    if (sample && sample !== state.active) pickSample(sample);
    kit.pause(); state.auto = false; autoBtn.textContent = "Auto-run"; autoBtn.setAttribute("aria-pressed", "false");
    kit.setState({ errors: COND.careful });
    kit.setStep(5);
  }
  var api = {
    step: function (n) { go(n); },
    sample: pickSample, cond: setCond, reset: reset, redo: redo,
    fill: function () { kit.fillAll(); D.order.forEach(function () {}); kit.settle(1); },
    run: finishSample,
    setMode: function (m) { if (m === "reset") reset(); },
    highlight: setHighlight,
    rect: function (p) {
      if (!stage) return null;
      var o = partObj(p);
      if (p === "bench" || !o) o = kit;
      return stage.rectOf(o, 14);
    },
    reading: function () { return kit.reading(); },
    kit: kit, stage: stage, refit: refit
  };
  window.StudyScenes = window.StudyScenes || {};
  window.StudyScenes.bench = api;

  buildTable(); paintHint(); paintSafeLine(); syncButtons(); paintReadout();
  setInterval(function () { paintReadout(); }, 400);
})();
