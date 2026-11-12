/* Lesson 07 · 3D zoom (window.StudyScenes.zoom): antibodies bridging red cells, and Rhesus sensitisation over two pregnancies.
   The same AboTypingBench kit, in its "agglutination" and "rhesus" views. */
(function () {
  "use strict";
  var root = document.getElementById("zoom-stage");
  var canvas = document.getElementById("zoom-canvas");
  var D = window.L07;
  if (!root || !canvas || !D || typeof THREE === "undefined" || !window.AboTypingBench) return;

  var ABT = window.AboTypingBench;
  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var toastEl = document.getElementById("zoom-toast"), toastT;
  function toast(m) {
    if (!toastEl) return;
    toastEl.textContent = m; toastEl.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove("show"); }, 3600);
  }

  var kit = ABT.create({ view: "agglutination", donor: "B", donorRh: "-", serum: "anti-B", patient: D.patient, labels: false });
  var P = kit.parts;
  var state = { mode: "agglutination", auto: true, inject: false, hl: null };

  var stage = window.SceneKit && SceneKit.createStage({
    root: root, canvas: canvas, fov: 36,
    target: new THREE.Vector3(0, 0.2, 0), pitch: 0.08, yaw: 0, distance: 40,
    minYaw: -0.9, maxYaw: 0.9, autoFit: false, portraitPitch: 0, zoomUi: true, onFrame: frame
  });
  var highlighter = null, scratch = new THREE.PerspectiveCamera(36, 1, 0.5, 300);
  function refit() {
    if (!stage) return;
    var h = canvas.parentElement, w = h.clientWidth || 360, ht = h.clientHeight || 420;
    var view = kit.params.view;
    ABT.fit(scratch, null, w / ht, view);
    var ty = view === "agglutination" ? 0.2 : 2.2, tgt = new THREE.Vector3(0, ty, 0);
    var dist = scratch.position.distanceTo(tgt);
    stage.target.copy(tgt); stage.pitch = Math.asin(Math.max(-1, Math.min(1, (scratch.position.y - tgt.y) / dist)));
    stage.dist = dist; stage.zoom = 1; stage.yaw = 0; stage.fitWidth = null; stage.fitHeight = null;
  }
  if (stage) {
    stage.rig.add(kit);
    ABT.lights(stage.scene);
    try { stage.scene.environment = ABT.environment(stage.renderer); stage.envOff = true; } catch (er) {}
    highlighter = kit.attachHighlighter(stage.scene);
    stage.start(); refit();
    if (window.ResizeObserver) new ResizeObserver(refit).observe(canvas.parentElement); else window.addEventListener("resize", refit);
  }
  function frame(dt, t) { kit.update(dt, t); }

  var readoutEl = $("#zoom-readout");
  var aggBar = [$("#zoom-agg-bar"), $("#zoom-agg-bar2")], rhBar = $("#zoom-rh-bar");
  var aggIn = $("#zoom-agg"), autoBtn = $("#zoom-auto"), injBtn = $("#zoom-inject"), playBtn = $("#zoom-play");
  function setPressed(sel, attr, val) {
    Array.prototype.forEach.call(document.querySelectorAll(sel), function (b) { b.setAttribute("aria-pressed", String(b.getAttribute(attr) === String(val))); });
  }
  function paint() {
    if (!readoutEl) return;
    var r = kit.reading();
    if (r.view === "agglutination") {
      readoutEl.innerHTML =
        '<div class="hot"><span>Top panel</span><b>' + r.donor + (r.donorRh === "+" ? " Rh+" : " Rh−") + " cells in " + r.serum + "</b></div>" +
        "<div><span>Result</span><b>" + (r.clump ? "clump" : "free cells") + "</b></div>" +
        "<div><span>Bridged</span><b>" + Math.round(r.bridged * 100) + "%</b></div>" +
        "<div><span>Lower panel</span><b>" + r.controlSerum + (r.controlClump ? " clumps" : " free") + "</b></div>";
      if (aggIn && state.auto) aggIn.value = String(r.bridged);
    } else {
      readoutEl.innerHTML =
        "<div><span>Stage</span><b>" + (r.stage + 1) + " of 4</b></div>" +
        "<div><span>Injection</span><b>" + (r.prevent ? "anti-D given" : "none") + "</b></div>" +
        "<div><span>Mother's anti-D</span><b>" + (r.motherAntiD ? "yes" : "no") + "</b></div>" +
        '<div class="hot"><span>Baby</span><b>' + (r.haemolytic ? "attacked" : r.babyAtRisk ? "at risk" : "healthy") + "</b></div>";
      setPressed("#zoom-stage-seg [data-st]", "data-st", r.stage);
    }
  }
  setInterval(paint, 300);

  function setMode(m) {
    if (m !== "agglutination" && m !== "rhesus") return;
    state.mode = m;
    kit.setState({ view: m });
    refit();
    setPressed("#zoom-mode [data-mode]", "data-mode", m);
    aggBar.forEach(function (b) { if (b) b.hidden = m !== "agglutination"; });
    if (rhBar) rhBar.hidden = m !== "rhesus";
    setHighlight(null); paint();
    emit("l7:zoom", { mode: m });
  }
  function setDonor(d) {
    kit.setState({ donor: d }); setPressed("#zoom-donor [data-donor]", "data-donor", d); paint(); emit("l7:zoom", { mode: state.mode, donor: d });
  }
  function setSerum(s) {
    kit.setState({ serum: s }); setPressed("#zoom-serum [data-serum]", "data-serum", s); paint(); emit("l7:zoom", { mode: state.mode, serum: s });
  }
  function setAuto(on) {
    state.auto = !!on;
    autoBtn.setAttribute("aria-pressed", String(state.auto));
    kit.setState({ agg: state.auto ? null : +aggIn.value });
  }
  function setAgg(v) {
    state.auto = false; autoBtn.setAttribute("aria-pressed", "false");
    aggIn.value = String(v); kit.setState({ agg: +v }); paint();
  }
  function setStage(n) {
    kit.pause(); playBtn.textContent = "▶ Play";
    kit.setState({ stage: n }); paint(); emit("l7:zoom", { mode: "rhesus", stage: n });
  }
  function setInject(on) {
    state.inject = !!on;
    injBtn.setAttribute("aria-pressed", String(state.inject)); injBtn.classList.toggle("zobo", state.inject);
    kit.setState({ prevent: state.inject });
    toast(state.inject ? "Anti-D injection given after the first birth: no sensitisation." : "No injection: the mother makes her own anti-D.");
    paint(); emit("l7:zoom", { mode: "rhesus", prevent: state.inject });
  }
  function play() {
    if (kit.isPlaying()) { kit.pause(); playBtn.textContent = "▶ Play"; }
    else { kit.play(); playBtn.textContent = "❚❚ Pause"; }
  }
  function setHighlight(name) {
    state.hl = name || null;
    if (kit.highlight) kit.highlight(name || null);
  }
  function reset() {
    kit.pause(); playBtn.textContent = "▶ Play";
    kit.setState({ donor: "B", donorRh: "-", serum: "anti-B", prevent: false, stage: 0 });
    state.inject = false; injBtn.setAttribute("aria-pressed", "false"); injBtn.classList.remove("zobo");
    setDonor("B"); setSerum("anti-B"); setAuto(true); setMode("agglutination");
  }

  // used by the explorer: put donor cells into a patient's plasma and show the antigen-antibody rule on the 3D smear
  function mix(donor, patient) {
    var c = ABT.compat(patient, donor);
    var ABS = { A: ["B"], B: ["A"], AB: [], O: ["A", "B"] };      // antigen letters the patient's plasma attacks
    var clash = [];
    (donor.abo === "AB" ? ["A", "B"] : donor.abo === "O" ? [] : [donor.abo]).forEach(function (x) { if (ABS[patient.abo].indexOf(x) >= 0) clash.push(x); });
    var serum = null;
    if (clash.length) serum = "anti-" + clash[0];
    else if (donor.rh === "+" && patient.rh === "-") serum = "anti-D";
    else {                                                        // a serum whose antigen the donor lacks: nothing for it to grip
      var have = (donor.abo === "AB" ? ["A", "B"] : donor.abo === "O" ? [] : [donor.abo]);
      serum = !have.length ? "anti-A" : have.indexOf("A") < 0 ? "anti-A" : have.indexOf("B") < 0 ? "anti-B" : (donor.rh === "-" ? "anti-D" : null);
    }
    setMode("agglutination");
    kit.setState({ donor: donor.abo, donorRh: donor.rh, serum: serum || "anti-D" });
    setPressed("#zoom-donor [data-donor]", "data-donor", donor.abo);
    setPressed("#zoom-serum [data-serum]", "data-serum", serum || "anti-D");
    if (c.safe && !serum) { state.auto = false; autoBtn.setAttribute("aria-pressed", "false"); kit.setState({ agg: 0 }); aggIn.value = "0"; }
    else setAuto(true);
    paint();
    return { safe: c.safe, serum: serum, reason: c.reason };
  }

  Array.prototype.forEach.call(document.querySelectorAll("#zoom-mode button"), function (b) { b.addEventListener("click", function () { setMode(b.getAttribute("data-mode")); }); });
  Array.prototype.forEach.call(document.querySelectorAll("#zoom-donor button"), function (b) { b.addEventListener("click", function () { setDonor(b.getAttribute("data-donor")); }); });
  Array.prototype.forEach.call(document.querySelectorAll("#zoom-serum button"), function (b) { b.addEventListener("click", function () { setSerum(b.getAttribute("data-serum")); }); });
  Array.prototype.forEach.call(document.querySelectorAll("#zoom-stage-seg button"), function (b) { b.addEventListener("click", function () { setStage(+b.getAttribute("data-st")); }); });
  aggIn.addEventListener("input", function () { setAgg(aggIn.value); });
  autoBtn.addEventListener("click", function () { setAuto(!state.auto); });
  injBtn.addEventListener("click", function () { setInject(!state.inject); });
  playBtn.addEventListener("click", play);

  var api = {
    setMode: setMode, donor: setDonor, serum: setSerum, auto: setAuto, agg: setAgg,
    stageTo: setStage, inject: setInject, play: play, reset: reset, mix: mix,
    highlight: setHighlight,
    rect: function (p) {
      if (!stage) return null;
      var o = P[p] || (state.mode === "rhesus" ? P.rhesus : P.agglutination);
      return stage.rectOf(o, 12);
    },
    state: function () { return { mode: state.mode, reading: kit.reading() }; },
    kit: kit, stage: stage
  };
  window.StudyScenes = window.StudyScenes || {};
  window.StudyScenes.zoom = api;
  setMode("agglutination"); paint();
})();
