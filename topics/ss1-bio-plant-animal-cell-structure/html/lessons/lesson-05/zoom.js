/* Lesson 05 · 3D zoom (window.StudyScenes.zoom) — SlideViewKit: what you can really see on a school slide.
   The eyepiece disc shows the onion (or cheek) slide at ×100 or ×400 beside a textbook diagram. Structures that cannot be seen
   on the stained slide fade out of the diagram, and the reason comes from the kit's visibility model (kit.reading()). */
(function () {
  "use strict";
  var root = document.getElementById("zoom-stage");
  var canvas = document.getElementById("zoom-canvas");
  if (!root || !canvas || typeof THREE === "undefined" || !window.SlideViewKit) return;

  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var state = { M: 400, specimen: "onion", seen: {}, picked: null };
  var kit = SlideViewKit.create({ M: state.M, specimen: state.specimen, showTextbook: true, aspect: 0.8 });
  var api = window.StudyScenes.zoom = window.StudyScenes.zoom || {};

  var holder = canvas.parentElement;
  var stage = window.SceneKit && window.SceneKit.createStage({
    root: root, canvas: canvas, fov: 32, pitch: 0, yaw: 0, minYaw: 0, maxYaw: 0, portraitPitch: 0,
    target: new THREE.Vector3(0, 0, 0), distance: 1, autoFit: false, adaptiveHeight: false,
    onFrame: function (dt, t) { kit.update(dt, t); frame(dt, t); }
  });
  var glow = null, highlightPart = null, hl = null, tmp = new THREE.Vector3();
  if (stage) {
    stage.rig.add(kit);
    glow = SceneKit.glowSprite("rgba(255,178,63,0.9)", 1.6);
    glow.material.opacity = 0; stage.rig.add(glow);
    hl = SlideViewKit.makeHighlighter(stage.scene);
    refit();
    stage.start();
    if (window.ResizeObserver) new ResizeObserver(refit).observe(holder); else window.addEventListener("resize", refit);
  } else {
    var last = performance.now();
    (function tick() { var n = performance.now(); kit.update(Math.min(0.05, (n - last) / 1000), n / 1000); last = n; requestAnimationFrame(tick); })();
  }
  function refit() {
    var w = holder.clientWidth, h = holder.clientHeight;
    if (!w || !h) return;
    var f = kit.layout(w / h);
    stage.fitHeight = f.h * 1.06; stage.fitWidth = f.w * 1.06;
    stage.target.set(f.target[0], f.target[1], f.target[2]);
    stage.resize();
  }
  function frame(dt, t) {
    if (!glow) return;
    var obj = highlightPart && kit.parts[highlightPart];
    if (obj) { obj.getWorldPosition(tmp); stage.rig.worldToLocal(tmp); glow.position.set(tmp.x, tmp.y, tmp.z + 0.25); }
    glow.material.opacity += ((obj ? 0.4 + 0.2 * Math.sin(t * 5) : 0) - glow.material.opacity) * Math.min(1, dt * 7);
  }

  // ---- readout + structure chips (painted from the kit's reading) ----
  var readoutEl = document.getElementById("zoom-readout");
  var itemsEl = document.getElementById("zoom-items");
  var noteEl = document.getElementById("zoom-note");
  function paint() {
    var r = kit.reading();
    if (readoutEl) {
      readoutEl.innerHTML =
        "<div><span>Slide</span><b>" + (r.specimen === "onion" ? "onion" : "cheek") + "</b></div>" +
        "<div><span>Total mag.</span><b>×" + r.M + "</b></div>" +
        "<div><span>Field</span><b>" + r.field_mm + " mm</b></div>" +
        "<div><span>Cells across</span><b>" + r.cells_across + "</b></div>" +
        "<div><span>Visible</span><b>" + r.visibleCount + "</b></div>" +
        '<div class="hot"><span>Not visible</span><b>' + r.hiddenCount + "</b></div>";
    }
    if (itemsEl) {
      itemsEl.innerHTML = "";
      r.items.forEach(function (it) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "zi " + (it.visible ? "vis" : "hid") + (state.picked === it.id ? " on" : "");
        b.setAttribute("data-id", it.id);
        b.setAttribute("aria-pressed", state.picked === it.id ? "true" : "false");
        b.innerHTML = '<i aria-hidden="true">' + (it.visible ? "✓" : "✕") + "</i>" + it.name;
        b.addEventListener("click", function () { pick(it.id); });
        itemsEl.appendChild(b);
      });
    }
    if (noteEl && !state.picked) {
      noteEl.innerHTML = r.visibleCount + " structures can be seen and drawn from this slide; " + r.hiddenCount + " cannot. Tap a structure to see why.";
    }
    root.querySelectorAll("#zoom-mag [data-mag]").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-mag")) === String(state.M) ? "true" : "false"); });
    root.querySelectorAll("#zoom-spec [data-spec]").forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-spec") === state.specimen ? "true" : "false"); });
  }
  function pick(id) {
    state.picked = id;
    var it = kit.pickItem(id);
    if (it && noteEl) {
      noteEl.innerHTML = "<b>" + it.name + ":</b> " + (it.visible ? "visible on this slide. " : "not visible on this slide (" + it.reason + "). ") + it.why;
    }
    api.highlight(id);
    paint();
  }
  function setMode(m) {
    m = String(m);
    if (m === "x100" || m === "100") state.M = 100;
    else if (m === "x400" || m === "400") state.M = 400;
    else if (m === "onion" || m === "cheek") state.specimen = m;
    else if (m === "book") { kit.setState({ showTextbook: true }); refit && stage && refit(); }
    else if (m === "eyepiece") { kit.setState({ showTextbook: false }); stage && refit(); }
    kit.setState({ M: state.M, specimen: state.specimen });
    state.seen[state.specimen + "-" + state.M] = true;
    state.picked = null;
    paint();
    emit("l5:zoom", { mode: m, M: state.M, specimen: state.specimen, seen: Object.keys(state.seen).length, reading: kit.reading() });
  }

  api.rect = function (part) {
    if (!stage) return null;
    var obj = part && kit.parts[part];
    if (obj && obj.visible === false) obj = null;
    return stage.rectOf(obj || kit, 14);
  };
  api.highlight = function (part) {
    highlightPart = part || null;
    if (hl) hl.highlight(part && /^(eyepiece|bezel)$/.test(part) ? part : null);
  };
  api.setMode = setMode;
  api.reset = function () { state.picked = null; state.specimen = "onion"; state.M = 400; state.seen = {}; kit.setState({ M: 400, specimen: "onion", showTextbook: true }); stage && refit(); paint(); };
  api.pick = pick;
  api.reading = function () { return kit.reading(); };
  api.kit = kit;
  api.stage = stage;

  // taps on the diagram rows
  if (stage) {
    canvas.addEventListener("pointerup", function (e) {
      if (Math.abs(e.movementX || 0) > 6) return;
      var objs = kit.userData.itemIds.map(function (i) { return kit.parts[i]; }).filter(function (o) { return o && o.visible; });
      var hit = stage.pick(e, objs);
      if (hit) pick(hit.object.userData.partId);
    });
  }

  root.querySelectorAll("#zoom-mag [data-mag]").forEach(function (b) { b.addEventListener("click", function () { setMode(b.getAttribute("data-mag")); }); });
  root.querySelectorAll("#zoom-spec [data-spec]").forEach(function (b) { b.addEventListener("click", function () { setMode(b.getAttribute("data-spec")); }); });
  var rs = document.getElementById("zoom-reset");
  if (rs) rs.addEventListener("click", api.reset);

  state.seen[state.specimen + "-" + state.M] = true;
  paint();
})();
