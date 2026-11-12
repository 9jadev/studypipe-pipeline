/* Lesson 02 · 3D concept zoom — cut-away mitochondrion, chloroplast (CellKit) and the secretory protein route (ProteinRouteKit) */
(function () {
  "use strict";
  var root = document.getElementById("zoom-stage");
  var canvas = document.getElementById("zoom-canvas");
  if (!root || !canvas || typeof THREE === "undefined") return;

  var toastEl = document.getElementById("zoom-toast");
  var cardEl = document.getElementById("zoom-card");
  var readoutEl = document.getElementById("zoom-readout");
  var subEl = document.getElementById("zoom-sub");
  var toastT;
  function toast(m) {
    if (!toastEl) return;
    toastEl.textContent = m;
    toastEl.classList.add("show");
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.classList.remove("show"); }, 3200);
  }
  function emit(n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); }

  var state = { mode: "mito", part: null, step: 0, playing: true, built: {}, readT: 0 };

  /* ---------- text shown in the card for each selectable part ---------- */
  var TEXT = {
    mito: {
      _: "<b>Mitochondrion</b> · two membranes. The inner membrane is folded into <b>cristae</b> around the fluid <b>matrix</b>. It releases energy (ATP) in aerobic respiration. Tap a part.",
      outer: "<b>Outer membrane</b> · the first of the two membranes that wrap the mitochondrion.",
      inner: "<b>Inner membrane</b> · the second membrane. It folds inwards into cristae, giving a large surface area for respiration.",
      cristae: "<b>Cristae</b> · the folds of the inner membrane. More folds mean more surface area, so very active cells (muscle) have mitochondria with many cristae.",
      matrix: "<b>Matrix</b> · the fluid inside the inner membrane. It contains enzymes for aerobic respiration, which releases energy as ATP."
    },
    chloro: {
      _: "<b>Chloroplast</b> · two membranes around a fluid <b>stroma</b> holding stacks of <b>grana</b> with chlorophyll. It captures light to make food (photosynthesis). Tap a part.",
      envelope: "<b>Envelope</b> · the two membranes that wrap the chloroplast.",
      grana: "<b>Grana</b> · stacks of flat membrane discs that hold chlorophyll and trap light.",
      stroma: "<b>Stroma</b> · the fluid around the grana, where the sugar-making reactions take place.",
      starch: "<b>Starch grain</b> · stored food made from the sugar. Plant cells store starch, animal cells store glycogen."
    },
    route: { _: "<b>Protein route</b> · ribosome on the rough ER, then a vesicle to the Golgi body, then a vesicle to the cell membrane. Press a step." }
  };
  var STEPS = ["Make", "Enter ER", "Vesicle", "Golgi", "Exit"];
  var STEP_TEXT = [
    "<b>1 · Making the protein</b> · a ribosome on the rough ER reads the instruction and joins amino acids into a chain.",
    "<b>2 · Into the ER</b> · the growing chain threads into the rough ER and moves along its channels.",
    "<b>3 · Transport vesicle</b> · a small bubble buds from the ER, carries the protein, and fuses with the Golgi body.",
    "<b>4 · Golgi body</b> · the protein is modified and packed as it passes from the cis face to the trans face, then a secretory vesicle buds off.",
    "<b>5 · Out of the cell</b> · the secretory vesicle fuses with the cell membrane and releases the protein outside (exocytosis)."
  ];

  var api = {
    setMode: setMode, reset: reset, select: select, step: goStep,
    rect: function () { return null; },
    highlight: function (p) { if (p) select(p, true); else if (hi) hi.set(null); },
    state: function () { return { mode: state.mode, part: state.part, step: state.step }; }
  };
  window.StudyScenes = window.StudyScenes || {};
  window.StudyScenes.zoom = api;

  var stage = window.SceneKit && window.CellKit && window.SceneKit.createStage({
    root: root, canvas: canvas, fov: 34, target: new THREE.Vector3(0, 0, 0), pitch: 0.22, yaw: 0.1,
    distance: 1, fitHeight: 2.6, autoFit: false, portraitPitch: 0, onFrame: frame
  });

  var groups = {}, kits = {}, hi, pickLabel, box = new THREE.Box3(), tgt = new THREE.Vector3(), tgtNow = new THREE.Vector3();
  var routeKit = null, routeFocus = null;
  var FRAME = { mito: { h: 2.5, w: 3.4 }, chloro: { h: 2.5, w: 3.8 }, route: { h: 3.7, w: 9 } };

  if (stage) build();
  wireButtons();
  setMode("mito", true);

  function build() {
    var scene = stage.rig;
    groups.mito = new THREE.Group(); groups.chloro = new THREE.Group(); groups.route = new THREE.Group();
    scene.add(groups.mito, groups.chloro, groups.route);

    var m = CellKit.mitochondrion({ cut: true });
    m.scale.setScalar(1.15); m.rotation.set(0.0, 0.2, 0);
    groups.mito.add(m); kits.mito = m;

    var c = CellKit.chloroplast({});
    c.scale.setScalar(1.35); c.rotation.set(0.15, 0, 0);
    groups.chloro.add(c); kits.chloro = c;

    hi = CellKit.makeHighlighter(stage.scene);
    pickLabel = CellKit.label(" ", { h: 0.2 }); pickLabel.visible = false; stage.scene.add(pickLabel);

    api.rect = function (part) {
      var o = partObj(part);
      return o ? stage.rectOf(o, 14) : stage.rectOf(groups[state.mode], 12);
    };
    stage.start();
  }

  function ensureRoute() {
    if (routeKit || !stage || !window.ProteinRouteKit) return routeKit;
    routeKit = ProteinRouteKit.create({ step: 0, play: true, onEvent: function (name, d) {
      if (name === "protein-route:step") { state.step = d.step; paintStep(); }
    } });
    groups.route.add(routeKit); kits.route = routeKit;
    return routeKit;
  }

  function partObj(part) {
    var k = kits[state.mode];
    if (!k || !k.userData || !k.userData.parts) return null;
    var P = k.userData.parts;
    if (state.mode === "mito") return { outer: P.outer, inner: P.inner, matrix: P.inner, cristae: P.cristae }[part] || k;
    if (state.mode === "chloro") return { envelope: P.envelope, grana: P.grana, stroma: P.stroma, starch: P.starch }[part] || k;
    if (state.mode === "route") {
      var map = { ribosome: P.ribosome, roughER: P.roughER, er: P.roughER, golgi: P.golgi, membrane: P.membrane, vesicle: P.transportVesicle };
      return map[part] || k;
    }
    return null;
  }

  /* ---------- modes ---------- */
  function setMode(mode, quiet) {
    if (mode !== "chloro" && mode !== "route") mode = "mito";
    state.mode = mode; state.part = null;
    root.querySelectorAll("#zoom-modes [data-mode]").forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-mode") === mode ? "true" : "false"); });
    if (stage) {
      if (mode === "route") ensureRoute();
      Object.keys(groups).forEach(function (k) { groups[k].visible = k === mode; });
      hi.set(null); pickLabel.visible = false;
      var f = FRAME[mode];
      stage.fitHeight = f.h; stage.fitWidth = f.w;
      if (mode === "route" && routeKit) { routeKit.userData.api.goTo(0); focusRoute(0, true); }
      else { stage.target.set(0, 0, 0); tgt.set(0, 0, 0); tgtNow.set(0, 0, 0); }
      stage.yaw = mode === "route" ? 0.35 : 0.1;
      stage.zoom = 1;
      stage.resize();
    }
    buildSub();
    paintCard();
    paintReadout();
    if (!quiet) { emit("l2:zoom", { mode: mode }); toast(mode === "mito" ? "Cut-away mitochondrion: tap a part." : mode === "chloro" ? "Chloroplast: tap a part." : "Protein route: press the five steps."); }
  }

  function buildSub() {
    if (!subEl) return;
    subEl.innerHTML = "";
    var items = [];
    if (state.mode === "mito") items = [["outer", "Outer membrane"], ["inner", "Inner membrane"], ["cristae", "Cristae"], ["matrix", "Matrix"]];
    else if (state.mode === "chloro") items = [["envelope", "Envelope"], ["grana", "Grana"], ["stroma", "Stroma"], ["starch", "Starch grain"]];
    else {
      STEPS.forEach(function (s, i) { items.push(["step" + i, (i + 1) + ". " + s]); });
      items.push(["play", state.playing ? "Pause" : "Play"]);
    }
    items.forEach(function (it) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "vt-btn"; b.setAttribute("data-zpart", it[0]); b.setAttribute("aria-pressed", "false");
      b.textContent = it[1];
      b.addEventListener("click", function () {
        if (it[0] === "play") togglePlay();
        else if (it[0].indexOf("step") === 0) goStep(+it[0].slice(4));
        else select(it[0]);
      });
      subEl.appendChild(b);
    });
    if (state.mode === "route") paintStep();
  }

  function select(part, quiet) {
    if (state.mode === "route") return;
    var o = partObj(part), k = kits[state.mode];
    if (!stage || !o) return;
    state.part = part;
    hi.set(o);
    var label = (subEl && subEl.querySelector('[data-zpart="' + part + '"]')) ? subEl.querySelector('[data-zpart="' + part + '"]').textContent : part;
    CellKit.setLabelText(pickLabel, label, { h: 0.2 });
    pickLabel.userData.follow = o; pickLabel.visible = true;
    if (subEl) subEl.querySelectorAll("[data-zpart]").forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-zpart") === part ? "true" : "false"); });
    paintCard();
    if (!quiet) emit("l2:zoom-part", { mode: state.mode, part: part });
  }

  function paintCard() {
    if (!cardEl) return;
    var t = TEXT[state.mode] || {};
    if (state.mode === "route") { cardEl.innerHTML = STEP_TEXT[state.step] || t._; return; }
    cardEl.innerHTML = state.part && t[state.part] ? t[state.part] : t._;
  }

  /* ---------- readouts: computed from the live model ---------- */
  function paintReadout() {
    if (!readoutEl) return;
    var k = kits[state.mode], h = "";
    if (state.mode === "mito" && k) {
      var P = k.userData.parts;
      h = "<div><span>Membranes</span><b>2</b></div><div><span>Cristae</span><b>" + (P.cristae ? P.cristae.children.length : 0) + "</b></div><div><span>Job</span><b>energy</b></div>";
    } else if (state.mode === "chloro" && k) {
      var G = k.userData.parts.grana, stacks = G ? G.children.length : 0, discs = stacks && G.children[0].children ? G.children[0].children.length : 0;
      h = "<div><span>Membranes</span><b>2</b></div><div><span>Grana stacks</span><b>" + stacks + "</b></div><div><span>Discs / stack</span><b>" + discs + "</b></div><div><span>Job</span><b>food</b></div>";
    } else if (state.mode === "route" && routeKit) {
      var r = routeKit.reading();
      h = "<div><span>Where</span><b>" + (r.compartment || "") + "</b></div><div><span>Amino acids</span><b>" + r.aaBuilt + " / " + r.aaTotal + "</b></div><div><span>Fusions</span><b>" + r.fusionEvents + "</b></div><div><span>Bilayers crossed</span><b>" + r.bilayersCrossed + "</b></div>";
    }
    readoutEl.innerHTML = h;
  }

  /* ---------- protein route controls ---------- */
  function goStep(i) {
    if (!stage || !ensureRoute()) return;
    if (state.mode !== "route") setMode("route", true);
    i = Math.max(0, Math.min(4, i | 0));
    state.step = i; state.playing = true;
    routeKit.setState({ step: i, play: true });
    focusRoute(i);
    paintStep(); paintCard();
    emit("l2:route", { step: i });
  }
  function togglePlay() {
    if (!routeKit) return;
    state.playing = !state.playing;
    routeKit.setState({ play: state.playing });
    buildSub();
  }
  function focusRoute(step, snap) {
    if (!routeKit) return;
    var f = routeKit.userData.focusFor(step);
    tgt.set(f.target[0], f.target[1], f.target[2]);
    var span = Math.max(3.2, f.span);
    stage.fitWidth = span; stage.fitHeight = 3.2;
    stage.resize();
    if (snap) tgtNow.copy(tgt);
  }
  function paintStep() {
    if (!subEl) return;
    subEl.querySelectorAll('[data-zpart^="step"]').forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-zpart") === "step" + state.step ? "true" : "false");
    });
    paintCard();
  }

  function reset() {
    state.part = null;
    if (routeKit) { routeKit.userData.api.reset(); state.step = 0; state.playing = true; }
    if (hi) hi.set(null);
    if (pickLabel) pickLabel.visible = false;
    setMode("mito");
    toast("Zoom reset.");
  }

  function wireButtons() {
    root.querySelectorAll("#zoom-modes [data-mode]").forEach(function (b) {
      b.addEventListener("click", function () { setMode(b.getAttribute("data-mode")); });
    });
  }

  /* ---------- frame ---------- */
  function frame(dt, t) {
    if (!kits.mito) return;
    var k = kits[state.mode];
    if (k && k.userData && k.userData.update) k.userData.update(dt, t);
    hi.update(dt, t);
    if (pickLabel.visible && pickLabel.userData.follow) {
      box.setFromObject(pickLabel.userData.follow);
      if (!box.isEmpty()) { box.getCenter(pickLabel.position); pickLabel.position.y = box.max.y + 0.22; }
    }
    if (state.mode === "route" && routeKit) {
      tgtNow.lerp(tgt, Math.min(1, dt * 2.2));
      stage.target.copy(tgtNow);
    }
    state.readT += dt;
    if (state.readT > 0.25) { state.readT = 0; if (state.mode === "route") paintReadout(); }
  }
})();
