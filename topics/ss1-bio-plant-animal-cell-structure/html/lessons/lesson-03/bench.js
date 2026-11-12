/* Lesson 03 · 3D bench with two stations: Station A pond survey (CellKit.protist) and Station B SA:V agar-cube bench (AgarCubeKit) */
(function () {
  "use strict";
  var root = document.getElementById("bench-stage");
  var canvas = document.getElementById("bench-canvas");
  var D = window.L03;
  if (!root || !canvas || !D) return;

  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var toastEl = document.getElementById("bench-toast"), toastT;
  function toast(m) {
    if (!toastEl) return;
    toastEl.textContent = m; toastEl.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove("show"); }, 3200);
  }
  var readoutEl = document.getElementById("bench-readout");
  var infoEl = document.getElementById("survey-info");
  var noteEl = document.getElementById("cube-note");
  var hintEl = document.getElementById("bench-hint");

  var ORG = {}; D.orgs.forEach(function (o) { ORG[o.id] = o; });
  var LAYOUT = { // scale and vertical offset so every organism fills the dish
    amoeba: { s: 1.6, y: 0 }, paramecium: { s: 1.5, y: 0 }, euglena: { s: 1.15, y: 0 },
    chlamydomonas: { s: 2.4, y: 0 }, volvox: { s: 1.5, y: 0 }, spirogyra: { s: 1.0, y: 0 }, hydra: { s: 1.2, y: -0.62 }
  };

  var state = { mode: "pond", org: null, seen: {}, L: 3, calc: {}, order: [], undyedShown: false };
  var highlightPart = null, calcT;

  var api = {
    setMode: setMode, org: showOrg, pick: pickL, calc: calculate, reset: reset,
    rect: function () { return null }, highlight: function (p) { highlightPart = p || null; },
    state: function () { return { mode: state.mode, org: state.org, seen: Object.keys(state.seen).length, cubes: Object.keys(state.calc).length }; }
  };
  window.StudyScenes = window.StudyScenes || {};
  window.StudyScenes.bench = api;

  var stage = window.SceneKit && window.SceneKit.createStage({
    root: root, canvas: canvas, fov: 34, target: new THREE.Vector3(0, 0.4, 0), pitch: 0.36, yaw: 0.14,
    fitWidth: 4.6, distance: 6, minHeight: 300, minYaw: -0.8, maxYaw: 0.8, onFrame: frame
  });

  var pond, dish, orgGroups = {}, kit, hl, glow, tagSprites = {};

  if (stage) build();
  buildControls();
  paintAll();

  function build() {
    var scene = stage.rig;

    // ---------- Station A: pond water in a watch glass ----------
    pond = new THREE.Group(); scene.add(pond);
    var glassM = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.05, transparent: true, opacity: 0.25, clearcoat: 1, depthWrite: false });
    dish = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.0, 0.07, 56), glassM); dish.position.y = -0.62; pond.add(dish);
    var water = new THREE.Mesh(new THREE.CylinderGeometry(1.93, 1.93, 0.05, 56), new THREE.MeshStandardMaterial({ color: 0x6fae60, roughness: 0.2, transparent: true, opacity: 0.5 }));
    water.position.y = -0.6; pond.add(water);
    dish.userData.noFit = true; water.userData.noFit = true;
    if (window.CellKit) {
      D.orgs.forEach(function (o) {
        var g = new THREE.Group();
        var m = window.CellKit.protist(o.id);
        m.scale.setScalar(LAYOUT[o.id].s);
        m.position.y = LAYOUT[o.id].y;
        g.add(m);
        var tag = window.CellKit.label(o.tag, { h: 0.2, depthTest: false });
        tag.position.set(0, o.id === "hydra" ? 1.15 : 1.0, 0);
        g.add(tag);
        g.visible = false; g.userData.cell = m;
        pond.add(g); orgGroups[o.id] = g;
      });
    }

    // ---------- Station B: agar cube ----------
    if (window.AgarCubeKit) {
      kit = window.AgarCubeKit.create({ L_mm: state.L, t_min: 0, dyeDepth_mm: D.DYE_DEPTH, tau_min: D.TAU, cutaway: true, labels: root.clientWidth >= 560 });
      kit.visible = false;
      scene.add(kit);
      hl = window.AgarCubeKit.makeHighlighter(stage.scene);
      kit.addEventListener("diffusion-done", function () { state.undyedShown = true; paintReadout(); paintNote(); });
    }

    glow = SceneKit.glowSprite("rgba(255,178,63,0.92)", 1.4);
    glow.material.opacity = 0; glow.userData.noFit = true; scene.add(glow);

    applyMode(true);

    api.rect = function (part) {
      if (!stage) return null;
      if (ORG[part]) return stage.rectOf(state.mode === "pond" && orgGroups[part] && orgGroups[part].visible ? orgGroups[part] : pond, 12);
      if (part === "pond") return stage.rectOf(pond, 8);
      if (kit && kit.visible) return stage.rectOf(kit.parts[part] || kit, 12);
      return stage.rectOf(state.mode === "cube" && kit ? kit : pond, 10);
    };
    stage.start();
  }

  function applyMode(first) {
    if (!stage) return;
    pond.visible = state.mode === "pond";
    if (kit) kit.visible = state.mode === "cube";
    if (state.mode === "pond" && !state.org) showOrg("volvox", true);
    stage.refit();
    if (!first) stage.recentre();
  }

  // ---------- controls ----------
  function buildControls() {
    var chips = document.getElementById("org-chips");
    if (chips) D.orgs.forEach(function (o) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "vt-btn"; b.setAttribute("data-org", o.id); b.setAttribute("aria-pressed", "false");
      b.innerHTML = "<i>" + o.name + "</i>";
      b.addEventListener("click", function () { showOrg(o.id); });
      chips.appendChild(b);
    });
    var ls = document.getElementById("cube-l");
    if (ls) D.cubes.forEach(function (L) {
      var b = document.createElement("button");
      b.type = "button"; b.setAttribute("data-L", L); b.setAttribute("aria-pressed", L === state.L ? "true" : "false");
      b.textContent = "L = " + L + " mm";
      b.addEventListener("click", function () { pickL(L); });
      ls.appendChild(b);
    });
    root.querySelectorAll("#bench-mode [data-mode]").forEach(function (b) {
      b.addEventListener("click", function () { setMode(b.getAttribute("data-mode")); });
    });
    var c = document.getElementById("cube-calc"); if (c) c.addEventListener("click", function () { calculate(); });
    var r = document.getElementById("cube-reset"); if (r) r.addEventListener("click", reset);
  }

  function setMode(m) {
    if (m !== "pond" && m !== "cube") return;
    state.mode = m;
    root.querySelectorAll("#bench-mode [data-mode]").forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-mode") === m ? "true" : "false"); });
    document.getElementById("pane-pond").hidden = m !== "pond";
    document.getElementById("pane-cube").hidden = m !== "cube";
    infoEl.hidden = m !== "pond";
    noteEl.hidden = m !== "cube";
    applyMode(false);
    paintAll();
    emit("l3:mode", { mode: m });
  }

  function showOrg(id, silent) {
    var o = ORG[id]; if (!o) return;
    if (state.mode !== "pond") setMode("pond");
    state.org = id;
    Object.keys(orgGroups).forEach(function (k) { orgGroups[k].visible = k === id; });
    if (!silent) {
      var first = !state.seen[id];
      state.seen[id] = true;
      emit("l3:survey", { org: id, seen: Object.keys(state.seen).length, first: first });
    }
    if (stage) stage.refit();
    paintAll();
  }

  function pickL(L) {
    if (D.cubes.indexOf(+L) < 0) return;
    if (state.mode !== "cube") setMode("cube");
    state.L = +L; state.undyedShown = !!state.calc[state.L];
    if (kit) kit.setState({ L_mm: state.L, t_min: state.calc[state.L] ? D.DYE_MIN : 0 });
    paintAll();
  }

  function calculate(L) {
    if (L != null) pickL(L);
    else if (state.mode !== "cube") setMode("cube");
    var m = D.model(state.L);
    var firstTime = !state.calc[state.L];
    state.calc[state.L] = true;
    if (firstTime) state.order.push(state.L);
    state.undyedShown = false;
    if (kit) {
      kit.setState({ L_mm: state.L, t_min: D.DYE_MIN }); kit.play();
      // the readout never depends on the animation finishing (slow phones, tab hidden)
      var Lnow = state.L;
      clearTimeout(calcT);
      calcT = setTimeout(function () { if (state.L === Lnow && state.calc[Lnow] && !state.undyedShown) { state.undyedShown = true; paintReadout(); paintNote(); } }, 4600);
    } else state.undyedShown = true;
    var n = Object.keys(state.calc).length;
    toast("L = " + state.L + " mm: SA = " + m.SA + " mm², V = " + m.V + " mm³, SA : V = " + m.ratio.toFixed(1) + " mm⁻¹");
    paintAll();
    emit("l3:bench", { L: m.L, L_mm: m.L, SA: m.SA, V: m.V, ratio: m.ratio, core_mm: m.core_mm, depth_mm: m.depth_mm, undyedFraction: m.undyedFraction, count: n, first: firstTime });
    if (n >= 4) emit("l3:bench-done", { count: n });
  }

  function reset() {
    state.calc = {}; state.order = []; state.undyedShown = false; state.L = 3;
    if (kit) kit.setState({ L_mm: 3, t_min: 0 });
    paintAll();
    emit("l3:bench-reset");
    toast("Cube bench reset. Pick a side L and press Calculate.");
  }

  // ---------- painting ----------
  function paintAll() { paintReadout(); paintInfo(); paintNote(); paintHint(); paintButtons(); }

  function paintReadout() {
    if (!readoutEl) return;
    if (state.mode === "pond") {
      var o = ORG[state.org];
      readoutEl.innerHTML = o
        ? '<div><span>Organism</span><b><i>' + o.name + '</i></b></div><div><span>Form</span><b>' + o.form + '</b></div><div><span>Seen</span><b>' + Object.keys(state.seen).length + ' / 7</b></div><div class="wide"><span>Nutrition</span><b>' + o.nut + '</b></div>'
        : "";
      return;
    }
    var m = D.model(state.L), done = !!state.calc[state.L];
    var und = done && state.undyedShown ? (m.undyedFraction * 100).toFixed(1).replace(/\.0$/, "") + " %" : "–";
    readoutEl.innerHTML =
      '<div><span>L / mm</span><b>' + state.L + '</b></div>' +
      '<div><span>SA / mm²</span><b>' + (done ? m.SA : "?") + '</b></div>' +
      '<div><span>V / mm³</span><b>' + (done ? m.V : "?") + '</b></div>' +
      '<div><span>SA : V / mm⁻¹</span><b>' + (done ? m.ratio.toFixed(1) : "?") + '</b></div>' +
      '<div class="' + (done && state.undyedShown && m.undyedFraction > 0 ? "hot" : "") + '"><span>Undyed centre</span><b>' + und + '</b></div>';
  }

  function paintInfo() {
    if (!infoEl) return;
    var o = ORG[state.org];
    infoEl.hidden = state.mode !== "pond";
    if (!o) { infoEl.innerHTML = '<p>Tap an organism to begin the survey.</p>'; return; }
    infoEl.innerHTML =
      '<div class="num" style="color:var(--teal)"><i>' + o.name + '</i><small>' + o.form + ' · ' + o.nut + '</small></div>' +
      '<p>' + o.info + '</p><p><b>To draw:</b> ' + o.draw + '</p>';
  }

  function paintNote() {
    if (!noteEl) return;
    noteEl.hidden = state.mode !== "cube";
    if (state.mode !== "cube") return;
    var ks = Object.keys(state.calc).map(Number).sort(function (a, b) { return a - b; });
    var msg = "Pick a cube side L, then press <b>Calculate</b>. The dye soaks in from every face.";
    if (state.calc[state.L]) {
      var m = D.model(state.L);
      if (!state.undyedShown) msg = "The dye is soaking in…";
      else if (m.core_mm < 0.01) msg = "The dye soaked in <b>" + m.depth_mm.toFixed(1) + " mm</b> from every face and met in the middle: the <b>" + state.L + " mm cube is fully dyed</b>.";
      else msg = "The dye soaked in <b>" + m.depth_mm.toFixed(1) + " mm</b> from every face. The undyed centre is <b>" + m.core_mm.toFixed(1) + " mm</b> wide, <b>" + (m.undyedFraction * 100).toFixed(1) + " %</b> of the volume.";
    }
    if (ks.length >= 2) {
      var a = D.model(ks[0]), z = D.model(ks[ks.length - 1]);
      msg += " Compare: the " + ks[0] + " mm cube keeps " + (a.undyedFraction * 100).toFixed(1).replace(/\.0$/, "") + " % undyed; the " + ks[ks.length - 1] + " mm cube keeps " + (z.undyedFraction * 100).toFixed(1).replace(/\.0$/, "") + " %.";
    }
    noteEl.innerHTML = msg;
  }

  function paintHint() {
    if (hintEl) hintEl.innerHTML = "Pond: <b>" + Object.keys(state.seen).length + " of 7</b> seen · Cubes: <b>" + Object.keys(state.calc).length + " of 5</b> calculated";
  }

  function paintButtons() {
    root.querySelectorAll("#org-chips [data-org]").forEach(function (b) {
      var id = b.getAttribute("data-org");
      b.setAttribute("aria-pressed", id === state.org ? "true" : "false");
      b.classList.toggle("seen", !!state.seen[id]);
    });
    root.querySelectorAll("#cube-l [data-L]").forEach(function (b) {
      var L = +b.getAttribute("data-L");
      b.setAttribute("aria-pressed", L === state.L ? "true" : "false");
      b.classList.toggle("seen", !!state.calc[L]);
    });
  }

  // ---------- frame ----------
  var tmpBox, tmpV, lastHl = null;
  function frame(dt, t) {
    if (state.mode === "pond") {
      var g = orgGroups[state.org];
      if (g && g.userData.cell && g.userData.cell.update) g.userData.cell.update(dt, t);
      if (g) g.rotation.y = Math.sin(t * 0.35) * 0.25;
    } else if (kit) {
      kit.update(dt, t);
    }
    // narrator highlight
    var target = null;
    if (highlightPart) {
      if (ORG[highlightPart] && orgGroups[highlightPart] && orgGroups[highlightPart].visible) target = orgGroups[highlightPart];
      else if (highlightPart === "pond") target = pond;
    }
    if (hl) {
      var want = state.mode === "cube" && highlightPart && kit && kit.parts[highlightPart] ? highlightPart : null;
      if (want !== lastHl) { hl.highlight(want); lastHl = want; }
    }
    if (glow) {
      if (target) {
        tmpBox = tmpBox || new THREE.Box3(); tmpV = tmpV || new THREE.Vector3();
        tmpBox.setFromObject(target); tmpBox.getCenter(glow.position);
        glow.scale.setScalar(Math.max(1.8, tmpBox.getSize(tmpV).length() * 0.9));
      }
      glow.material.opacity += ((target ? 0.4 + 0.2 * Math.sin(t * 5) : 0) - glow.material.opacity) * Math.min(1, dt * 8);
    }
  }
})();
