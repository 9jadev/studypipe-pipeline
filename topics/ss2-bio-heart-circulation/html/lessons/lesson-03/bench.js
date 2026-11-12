/* Lesson 03 · 3D route tracer bench (window.StudyScenes.bench)
   BodyCircuit (assets/js/body-circuit.js) beside a large beating HeartKit heart ("both" mode) on one SceneKit stage.
   Every route, valve count and lung check comes from BodyCircuit's circulation graph, never from typed text. */
(function () {
  "use strict";
  var root = document.getElementById("bench-stage");
  var canvas = document.getElementById("bench-canvas");
  var D = window.L03;
  if (!root || !canvas || !D || typeof THREE === "undefined" || !window.BodyCircuit) return;

  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var toastEl = $("#bench-toast"), toastT;
  function toast(m) {
    if (!toastEl) return;
    toastEl.textContent = m; toastEl.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove("show"); }, 3200);
  }

  var HK = window.HeartKit, BC = window.BodyCircuit;
  var EDGES = {}; BC.model.edges.forEach(function (e) { EDGES[e.id] = e; });
  // phones with little memory: start with the light view (the body is about 80 000 triangles)
  var light = (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 4) <= 2;
  var state = { mode: "watch", preset: null, skin: !light, labels: !light, done: {}, wrong: 0, lastStep: null, hl: null, freeMap: {} };

  var kit = BC.create({
    labels: state.labels, skin: state.skin, bpm: 72,
    onEvent: onKitEvent
  });
  var heart = HK ? HK.heart({ mode: "both", bpm: 72, labels: false }) : null;

  // The body stands at x = 0 (patient's right on screen left); the big heart sits beside it.
  var stage = window.SceneKit && SceneKit.createStage({
    root: root, canvas: canvas, fov: 34,
    target: new THREE.Vector3(0.9, 1.7, 0), pitch: 0.1, yaw: 0, distance: 9, portraitPitch: 0.04,
    minYaw: -0.8, maxYaw: 0.8, minHeight: 330, maxHeight: 520, onFrame: frame
  });
  var highlighter = null;
  if (stage) {
    stage.rig.add(kit);
    if (heart) {
      heart.scale.setScalar(1.15); heart.position.set(1.95, 2.0, 0.15);
      stage.rig.add(heart);
    }
    highlighter = HK && HK.makeHighlighter ? HK.makeHighlighter(stage.rig) : null;
    stage.start();
  }
  function frame(dt, t) {
    kit.update(dt, t);
    if (heart && heart.userData.update) heart.userData.update(dt, t);
    if (highlighter) highlighter.update(dt, t);
  }

  // body part ids to the big heart's own part names
  var HEART_PART = { ra: "ra", la: "la", rv: "rv", lv: "lv", tricuspid: "tricuspid", bicuspid: "bicuspid", aorticValve: "aorticValve", pulmValve: "pulmValve",
    aorta: "aorta", pulmonaryArtery: "pulmonaryArtery", pulmonaryVeins: "pulmonaryVeins", svc: "venaCava", ivc: "venaCava", coronary: "coronary" };
  function heartHL(partId) {
    var hp = HEART_PART[partId], o = hp && heart && heart.userData.parts ? heart.userData.parts[hp] : null;
    if (highlighter) highlighter.set(o || null);
  }

  // ---------- DOM ----------
  var readoutEl = $("#bench-readout"), hintEl = $("#bench-hint"), hintBtn = $("#bench-hint-btn");
  var tbody = $("#results-table tbody"), routeLine = $("#route-line");
  var chipsWrap = $("#free-chips"), chips = $("#chips"), freeCount = $("#free-count");
  var presetBtns = Array.prototype.slice.call(document.querySelectorAll("#bench-presets [data-preset]"));
  var modeBtns = Array.prototype.slice.call(document.querySelectorAll("#bench-mode [data-mode]"));
  var cards = ["m1", "m2", "m3", "m4"].map(function (id) { return document.getElementById(id); });
  var skinBtn = $("#bench-skin"), labBtn = $("#bench-labels"), resetBtn = $("#bench-reset");
  if (skinBtn) skinBtn.setAttribute("aria-pressed", String(state.skin));
  if (labBtn) labBtn.setAttribute("aria-pressed", String(state.labels));

  function cardState(done, now) {
    cards.forEach(function (c, i) { if (!c) return; c.classList.toggle("done", i < done); c.classList.toggle("now", i === now); });
  }
  function doneCount() { return Object.keys(state.done).length; }

  function buildTable() {
    if (!tbody) return;
    tbody.innerHTML = "";
    Object.keys(D.presets).forEach(function (k) {
      var tr = document.createElement("tr");
      tr.setAttribute("data-preset", k);
      tr.innerHTML = "<td><strong>" + D.presets[k] + '</strong></td><td class="route-cell empty" data-c="route">—</td><td class="empty" data-c="valves">—</td><td class="empty" data-c="lungs">—</td>';
      tr.addEventListener("click", function () { tr.classList.toggle("open"); });
      tbody.appendChild(tr);
    });
    paintLine();
  }
  function paintLine() { if (routeLine) routeLine.textContent = "Routes recorded: " + doneCount() + " of 3"; }
  function fillRow(preset, r) {
    var tr = tbody && tbody.querySelector('tr[data-preset="' + preset + '"]'); if (!tr) return;
    var startsInLungs = preset === "lungsHeart";
    var vals = { route: r.route.join(" · "), valves: String(r.valves), lungs: startsInLungs ? "starts there" : (r.passedLungs ? "yes" : "no") };
    Object.keys(vals).forEach(function (c) {
      var td = tr.querySelector('[data-c="' + c + '"]'); td.textContent = vals[c]; td.classList.remove("empty");
    });
    tr.querySelector('[data-c="lungs"]').classList.toggle("lungs-yes", r.passedLungs);
    Array.prototype.forEach.call(tbody.children, function (x) { x.classList.toggle("fresh", x === tr); });
  }

  var SHORT = { armBrain: "Arm → brain", ileumBrain: "Ileum → brain", liverKidney: "Liver → kidney", lungsHeart: "Lungs → heart" };
  function oxyWord(o) { return o == null ? "—" : o > 0.66 ? "red (oxygen-rich)" : o < 0.34 ? "blue (oxygen-poor)" : "changing colour"; }
  function paintReadout() {
    if (!readoutEl) return;
    var r = kit.reading();
    var now = state.lastStep ? state.lastStep.label : "—", ox = state.lastStep ? state.lastStep.oxy : null;
    readoutEl.innerHTML =
      '<div><span>Route</span><b class="sm">' + (state.preset ? (SHORT[state.preset] || D.presets[state.preset]) : "none yet") + '</b></div>' +
      '<div title="' + oxyWord(ox) + '"><span>Now in</span><b class="sm"><i class="' + (ox == null ? "" : ox > 0.66 ? "red" : ox < 0.34 ? "blue" : "") + '"></i>' + now + '</b></div>' +
      '<div class="hot"><span>Valves</span><b>' + (state.preset ? r.valves : 0) + '</b></div>' +
      '<div><span>Lungs?</span><b>' + (state.preset ? (r.passedLungs ? "yes" : "no") : "—") + '</b></div>';
  }

  // ---------- kit events ----------
  function onKitEvent(name, d) {
    if (name === "step") {
      state.lastStep = d; heartHL(d.part);
      if (d.lungs) cardState(3, 2);
    } else if (name === "route-done") {
      finishRoute(d);
    } else if (name === "tap-ok") {
      var ch = chips && chips.querySelector('[data-part="' + d.part + '"]');
      if (ch) { ch.classList.add("ok"); ch.disabled = true; }
      toast(d.label + (d.next ? "" : ". Route complete!"));
      updateFreeCount();
      heartHL(d.part);
      cardState(2, 2);
    } else if (name === "tap-wrong") {
      state.wrong++;
      var w = chips && chips.querySelector('[data-part="' + d.tapped + '"]');
      if (w) { w.classList.add("no"); setTimeout(function () { w.classList.remove("no"); }, 700); }
      toast("Not that one yet. Think: what does blood meet next? (Hint button)");
    }
  }
  function finishRoute(d) {
    var preset = state.preset; if (!preset) return;
    fillRow(preset, d);
    state.done[preset] = d;
    paintLine(); paintReadout();
    if (chipsWrap && state.mode === "free") chipsWrap.hidden = true;   // route finished: give the page its height back
    cardState(3, 3);
    hintEl.innerHTML = "Valves passed: <b>" + d.valves + "</b> · lungs: <b>" + (preset === "lungsHeart" ? "starts there" : d.passedLungs ? "yes" : "no") + "</b>";
    emit("l3:bench", Object.assign({ preset: preset }, d));
    if (doneCount() >= 3) {
      cardState(4, -1);
      toast("Three routes recorded. Every body-to-body trip passed the lungs.");
      emit("l3:bench-done", { count: doneCount(), routes: Object.keys(state.done) });
    }
  }

  // ---------- free trace chips ----------
  function buildChips(from, to) {
    chips.innerHTML = "";
    var path = kit.route(from, to) || [], seen = {}, list = [];
    path.slice(1).forEach(function (id) {
      var e = EDGES[id]; if (!e || seen[e.part]) return;
      seen[e.part] = true; list.push({ part: e.part, label: e.label.replace(/ \(.*\)/, "") });
    });
    ["hepaticPortal", "renalV", "femoralA", "jugular"].forEach(function (p) {
      if (list.length > 20 || seen[p]) return;
      var e = BC.model.edges.filter(function (x) { return x.part === p; })[0];
      if (e && list.length < list.length + 4) { seen[p] = true; list.push({ part: p, label: e.label, distractor: true }); }
    });
    // keep all real steps, add at most 3 distractors, then shuffle with a fixed seed so the page is stable
    var real = list.filter(function (x) { return !x.distractor; }), dis = list.filter(function (x) { return x.distractor; }).slice(0, 3);
    var all = real.concat(dis), s = 7;
    for (var i = all.length - 1; i > 0; i--) { s = (s * 1103515245 + 12345) & 0x7fffffff; var j = s % (i + 1); var t = all[i]; all[i] = all[j]; all[j] = t; }
    all.forEach(function (c) {
      var b = document.createElement("button"); b.type = "button"; b.className = "chip-btn"; b.setAttribute("data-part", c.part); b.textContent = c.label;
      b.addEventListener("click", function () { tapPart(c.part); });
      chips.appendChild(b);
    });
    state.freeTotal = real.length;
    updateFreeCount();
  }
  function updateFreeCount() {
    var r = kit.reading();
    if (freeCount && r.free) freeCount.textContent = "(" + (r.free.tapped - 1) + " of " + (r.free.of - 1) + ")";
    if (hintEl && state.mode === "free") {
      var rr = kit.reading();
      hintEl.innerHTML = rr.free && rr.free.next ? "Tap the next part · wrong taps <b>" + state.wrong + "</b>" : "Route complete";
    }
  }
  function tapPart(partId) { return kit.tap(partId); }

  // ---------- controls ----------
  function setMode(m) {
    if (m !== "watch" && m !== "free") return;
    state.mode = m;
    modeBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-mode") === m)); });
    chipsWrap.hidden = m !== "free";
    hintBtn.disabled = m !== "free" || !state.preset;
    if (state.preset) runPreset(state.preset);
  }
  function runPreset(name) {
    var P = BC.model.presets[name]; if (!P) return;
    state.preset = name; state.lastStep = null; state.wrong = 0;
    presetBtns.forEach(function (b) { b.classList.toggle("zobo", b.getAttribute("data-preset") === name); });
    kit.reset();
    cardState(1, 1);
    if (state.mode === "free") {
      chipsWrap.hidden = false;
      kit.freeTrace(P.from, P.to);
      buildChips(P.from, P.to);
      hintBtn.disabled = false;
      toast("The start is lit. Tap each part in the order blood meets it.");
    } else {
      kit.trace(name);
      hintBtn.disabled = true;
      hintEl.textContent = "Watch the tracer…";
    }
    paintReadout();
  }
  function hint() {
    var h = kit.hint();
    if (h) toast("Next: " + h);
    return h;
  }
  function resetAll() {
    kit.reset(); state.done = {}; state.preset = null; state.lastStep = null; state.wrong = 0;
    presetBtns.forEach(function (b) { b.classList.remove("zobo"); });
    if (chips) chips.innerHTML = "";
    hintBtn.disabled = true; hintEl.textContent = "Choose a route";
    heartHL(null); highlightBody(null);
    cardState(0, 0); buildTable(); paintReadout();
    emit("l3:bench-reset", {});
  }
  function highlightBody(list) {
    kit.highlight();                       // clears
    if (list) list.forEach(function (p) { kit.highlight(p, true); });
  }

  presetBtns.forEach(function (b) { b.addEventListener("click", function () { runPreset(b.getAttribute("data-preset")); }); });
  modeBtns.forEach(function (b) { b.addEventListener("click", function () { setMode(b.getAttribute("data-mode")); }); });
  hintBtn.addEventListener("click", hint);
  resetBtn.addEventListener("click", resetAll);
  skinBtn.addEventListener("click", function () { state.skin = !state.skin; skinBtn.setAttribute("aria-pressed", String(state.skin)); kit.setState({ skin: state.skin }); });
  labBtn.addEventListener("click", function () { state.labels = !state.labels; labBtn.setAttribute("aria-pressed", String(state.labels)); kit.setState({ labels: state.labels }); });

  // tapping the 3D model: taps the part in Free trace, otherwise names it
  if (stage) {
    var down = null, ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
    canvas.addEventListener("pointerdown", function (e) { down = { x: e.clientX, y: e.clientY }; });
    canvas.addEventListener("pointerup", function (e) {
      if (!down || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 6) { down = null; return; }
      down = null;
      var r = canvas.getBoundingClientRect();
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, stage.camera);
      var id = kit.pickPart(ray), fromHeart = false;
      if (!id && heart) {
        var names = Object.keys(heart.userData.parts || {}), objs = names.map(function (n) { return heart.userData.parts[n]; }).filter(Boolean);
        var hit = ray.intersectObjects(objs, true)[0];
        if (hit) {
          for (var i = 0; i < names.length && !id; i++) { var o = hit.object; while (o) { if (o === heart.userData.parts[names[i]]) { id = names[i]; break; } o = o.parent; } }
          fromHeart = !!id;
        }
      }
      if (!id) return;
      if (fromHeart) { var back = { venaCava: "svc" }; id = back[id] || id; }
      if (state.mode === "free" && kit.reading().free) tapPart(id);
      else toast(id.replace(/([A-Z])/g, " $1").toLowerCase());
    });
  }

  // ---------- scene API for the narrator, the explorer and the tests ----------
  var api = {
    setMode: function (m) { if (m === "watch" || m === "free") setMode(m); else if (D.presets[m]) { setMode("watch"); runPreset(m); } },
    preset: function (n) { runPreset(n); },
    trace: function (n) { setMode("watch"); runPreset(n); },
    tap: tapPart, hint: hint, reset: resetAll,
    highlight: function (p) { if (!p) { highlightBody(null); heartHL(null); return; } highlightBody(Array.isArray(p) ? p : [p]); heartHL(Array.isArray(p) ? p[0] : p); },
    lit: function (list) { highlightBody(list); },
    rect: function (p) {
      if (!stage) return null;
      var o = (kit.parts && kit.parts[p]) || (heart && heart.userData.parts && heart.userData.parts[p]);
      if (p === "heart" && heart) o = heart;
      if (p === "bench" || !o) o = [kit, heart].filter(Boolean);
      return stage.rectOf(o, 12);
    },
    reading: function () { return kit.reading(); },
    autoRun: function () { setMode("watch"); runPreset("armBrain"); },
    kit: kit, heart: heart, stage: stage, state: state
  };
  window.StudyScenes = window.StudyScenes || {};
  window.StudyScenes.bench = api;

  buildTable(); paintReadout(); cardState(0, 0);
  setInterval(function () { paintReadout(); if (state.mode === "free") updateFreeCount(); }, 350);
})();
