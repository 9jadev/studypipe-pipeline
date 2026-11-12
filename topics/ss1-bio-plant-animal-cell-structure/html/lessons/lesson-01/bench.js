/* Lesson 01 · 3D microscope practical (MicroscopeBench kit): focus, change power, measure, fill the results table.
   All readings come from scope.reading(): M = eyepiece x objective, field = 160 / M, cells = field / cell width. */
(function () {
  "use strict";
  var root = document.getElementById("bench-stage");
  var canvas = document.getElementById("bench-canvas");
  if (!root || !canvas || !window.L01 || typeof THREE === "undefined") return;

  var D = window.L01;
  var toastEl = document.getElementById("bench-toast");
  var hintEl = document.getElementById("bench-hint");
  var readoutEl = document.getElementById("bench-readout");
  var eyeCv = document.getElementById("eye-canvas");
  var eyeCtx = eyeCv && eyeCv.getContext ? eyeCv.getContext("2d") : null;
  var tbody = document.querySelector("#results-table tbody");
  var tableNote = document.getElementById("results-note");
  var toastT;
  function toast(m) {
    if (!toastEl) return;
    toastEl.textContent = m;
    toastEl.classList.add("show");
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.classList.remove("show"); }, 3400);
  }
  function emit(n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); }
  function fmtField(mm) { return (mm < 1 ? mm.toFixed(2) : mm.toFixed(1)) + " mm"; }

  var scope = null, stage = null;
  var recorded = {};          /* "slide|objectiveIndex" -> reading (the table rows) */
  var objDone = {};           /* objectiveIndex -> true, any slide */
  var everSharp = false, sharp40 = false, doneFired = false, measuredOnce = false;
  var last = null;            /* the last recorded reading, for the readout */
  var highlightPart = null;

  var api = {
    setObjective: function (i) { if (scope) { scope.setObjective(+i); sync(); } },
    setSlide: function (k) { if (scope) { scope.setSlide(k); sync(); } },
    setMirror: function (k) { if (scope) { scope.setMirror(k); sync(); } },
    coarse: function (n) { if (scope) { scope.coarse(+n || 1); sync(); } },
    fine: function (n) { if (scope) { scope.fine(+n || 1); sync(); } },
    autoFocus: function () { if (scope) { scope.autoFocus(); sync(); } },
    blur: function () { if (scope) { scope.setState({ focus: 0.3 }); sync(); } },
    /* narrator demo: select a power, focus it, say the reading; nothing is recorded in the learner's table */
    show: function (i) {
      if (!scope) return;
      scope.setObjective(+i); scope.autoFocus(); sync();
      var r = scope.reading();
      toast("×" + r.M + " · field " + fmtField(r.field_mm) + " · " + r.slideName);
    },
    measure: measure,
    reset: reset,
    method: setMethod,
    rect: function (part) {
      if (part === "eye" && eyeCv) { var b = eyeCv.getBoundingClientRect(); return { left: b.left, top: b.top, width: b.width, height: b.height }; }
      if (!stage || !scope) return null;
      var o = scope.parts[part] || scope.parts.eyepiece;
      return stage.rectOf(o, 10);
    },
    highlight: function (p) { highlightPart = p || null; if (scope) { if (p && p !== "eye") scope.highlight(p, true); else scope.highlight(null); } },
    state: function () { return { measured: Object.keys(objDone).length, rows: Object.keys(recorded).length }; }
  };
  window.StudyScenes = window.StudyScenes || {};
  window.StudyScenes.bench = api;

  if (window.MicroscopeBench && window.SceneKit) {
    stage = SceneKit.createStage({
      root: root, canvas: canvas, fov: 34, target: new THREE.Vector3(0.1, 1.2, 0),
      pitch: 0.12, yaw: 0.45, distance: 9, minYaw: -0.9, maxYaw: 0.9, onFrame: frame
    });
  }
  if (stage) {
    stage.visible = false;      /* stays asleep until the page scrolls it into view (IntersectionObserver in SceneKit wakes it) */
    scope = MicroscopeBench.create({ objective: 0, slide: "onion", mirror: "plane", startBlurred: true, view: "none", labels: false });
    stage.rig.add(scope);
    scope.setCamera(stage.camera);
    if (root.clientWidth >= 560) scope.setLabels(true);
    scope.on("coarse-locked", function (d) { toast((d && d.message) || "Fine knob only at ×40"); });
    scope.on("measure", onMeasure);
    ["objective", "slide", "mirror", "focus"].forEach(function (n) { scope.on(n, sync); });
    stage.start();

    /* tap a part of the 3D microscope to use it */
    var down = null;
    canvas.addEventListener("pointerdown", function (e) { down = { x: e.clientX, y: e.clientY, t: performance.now() }; });
    canvas.addEventListener("pointerup", function (e) {
      if (!down || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 7 || performance.now() - down.t > 450) return;
      var hit = stage.pick(e, scope.pickables);
      if (!hit) return;
      var part = scope.partOf(hit.object);
      if (!part || part === "view") return;
      scope.highlight(part, true);
      setTimeout(function () { scope.highlight(highlightPart && highlightPart !== "eye" ? highlightPart : null, !!highlightPart); }, 800);
      scope.tap(part);
      toast(partTip(part));
      sync();
    });
  }
  wireButtons();
  sync();

  function partTip(p) {
    var t = {
      eyepiece: "Eyepiece: the lens you look through (×10).",
      objective: "Objective lenses: ×4, ×10 and ×40. Tap to turn to the next one.",
      nosepiece: "Nosepiece: turn it to change objective.",
      stage: "Stage: the slide sits flat here and the clips hold it.",
      slide: "Slide: tap to change the specimen.",
      mirror: "Mirror: plane or concave, it sends light up through the specimen.",
      coarse: "Coarse knob: big focus movements, ×4 only.",
      fine: "Fine knob: tiny movements. The only knob allowed at ×40.",
      iris: "Iris diaphragm: controls how much light passes.",
      condenser: "Condenser: gathers light onto the slide."
    };
    return t[p] || "Tap the controls under the picture to use the microscope.";
  }

  function frame(dt, t) {
    if (!scope) return;
    scope.update(dt, t);
    if (eyeCtx) {
      var w = eyeCv.width;
      eyeCtx.clearRect(0, 0, w, w);
      eyeCtx.drawImage(scope.viewCanvas, 0, 0, w, w);
    }
  }

  /* ---------- measuring ---------- */
  function measure() {
    if (!scope) { toast("The 3D bench could not start here. Use a device with WebGL."); return null; }
    return scope.measure();
  }
  function onMeasure(r) {
    if (!r.focused) {
      toast("The image is blurred. Focus first: coarse knob at ×4, fine knob at ×10 and ×40.");
      return;
    }
    var key = r.slide + "|" + r.objectiveIndex;
    recorded[key] = r;
    objDone[r.objectiveIndex] = true;
    last = r;
    measuredOnce = true;
    paintTable();
    var n = Object.keys(objDone).length;
    toast("Recorded: ×" + r.M + ", " + r.cells + " cells across " + fmtField(r.field_mm) + " → " + r.width_um + " µm each.");
    sync();
    emit("l1:bench", {
      M: r.M, field_mm: r.field_mm, cells: r.cells, width_mm: r.width_mm, width_um: r.width_um,
      slide: r.slide, objective: r.objective, count: n, rows: Object.keys(recorded).length
    });
    if (n >= 3 && !doneFired) {
      doneFired = true;
      emit("l1:bench-done", { count: n });
    }
  }

  function paintTable() {
    if (!tbody) return;
    var keys = Object.keys(recorded).sort(function (a, b) {
      var ra = recorded[a], rb = recorded[b];
      return ra.slide === rb.slide ? ra.objectiveIndex - rb.objectiveIndex : (ra.slide < rb.slide ? -1 : 1);
    });
    if (!keys.length) {
      tbody.innerHTML = '<tr class="empty"><td colspan="6">Focus the image, then press <b>Measure</b>. Each measurement adds a row here.</td></tr>';
      if (tableNote) tableNote.textContent = "";
      return;
    }
    tbody.innerHTML = keys.map(function (k) {
      var r = recorded[k];
      return "<tr><td><b>×" + r.objective + "</b> · " + D.slideNames[r.slide] + "</td><td>×" + r.M + "</td><td>" + (r.field_mm < 1 ? r.field_mm.toFixed(2) : r.field_mm.toFixed(1)) +
        "</td><td>" + r.cells + "</td><td>" + r.width_mm.toFixed(3) + "</td><td><b>" + r.width_um + "</b></td></tr>";
    }).join("");
    if (tableNote) tableNote.innerHTML = "Look down the last two columns: the cell width stays the same at every power. Magnifying changes the <b>image</b>, not the cell.";
  }

  /* ---------- readout + controls ---------- */
  function setPressed(sel, attr, val) {
    root.querySelectorAll(sel).forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute(attr) === String(val))); });
  }

  function methodStep(r) {
    var n = Object.keys(objDone).length;
    if (r) { if (r.focused) everSharp = true; if (r.focused && r.objectiveIndex === 2) sharp40 = true; }
    if (n >= 3) return 5;
    if (measuredOnce) return 4;
    if (sharp40) return 3;
    if (everSharp) return 2;
    return 1;
  }
  function setMethod(step) {
    document.querySelectorAll("#method-cards .method").forEach(function (m, i) {
      m.classList.toggle("now", i + 1 === step);
      m.classList.toggle("done", i + 1 < step);
    });
  }

  function sync() {
    if (!scope) { paintReadout(null); paintHint(); return; }
    var r = scope.reading();
    setPressed("#bench-obj [data-obj]", "data-obj", r.objectiveIndex);
    setPressed("#bench-slide [data-slide]", "data-slide", r.slide);
    setPressed("#bench-mirror [data-mirror]", "data-mirror", r.mirror);
    var cb = root.querySelectorAll("[data-ctl=coarse]");
    cb.forEach(function (b) { b.classList.toggle("locked", r.objectiveIndex === 2); });
    paintReadout(r);
    paintHint();
    setMethod(methodStep(r));
  }

  function paintReadout(r) {
    if (!readoutEl) return;
    if (!r) { readoutEl.innerHTML = '<div><span>3D bench</span><b>needs WebGL</b></div>'; return; }
    var cells = last && last.slide === r.slide && last.objectiveIndex === r.objectiveIndex;
    readoutEl.innerHTML =
      '<div><span>Eyepiece × obj</span><b>' + r.eyepiece + "×" + r.objective + " = ×" + r.M + "</b></div>" +
      '<div><span>Field diameter</span><b>' + fmtField(r.field_mm) + "</b></div>" +
      '<div class="' + (r.focused ? "" : "hot") + '"><span>Image</span><b>' + (r.focused ? "sharp" : "blurred") + "</b></div>" +
      '<div><span>Slide</span><b>' + r.slideName + "</b></div>" +
      '<div><span>Cells across</span><b>' + (cells ? last.cells : "measure it") + "</b></div>" +
      '<div><span>Cell width</span><b>' + (cells ? last.width_um + " µm" : "work it out") + "</b></div>";
  }

  function paintHint() {
    var n = Object.keys(objDone).length;
    if (hintEl) hintEl.innerHTML = "Measured <b>" + n + " of 3</b> powers";
    root.querySelectorAll("#bench-obj [data-obj]").forEach(function (b) {
      b.classList.toggle("seen", !!objDone[b.getAttribute("data-obj")]);
    });
  }

  function reset() {
    recorded = {}; objDone = {}; last = null; everSharp = false; sharp40 = false; measuredOnce = false; doneFired = false;
    if (scope) { scope.setSlide("onion"); scope.setObjective(0); scope.setState({ focus: 0.3 }); scope.setMirror("plane"); }
    paintTable(); sync();
    emit("l1:bench-reset");
    toast("Bench reset. The slide is blurred again: start on ×4 with the coarse knob.");
  }

  function wireButtons() {
    root.querySelectorAll("[data-obj]").forEach(function (b) { b.addEventListener("click", function () { api.setObjective(b.getAttribute("data-obj")); }); });
    root.querySelectorAll("[data-slide]").forEach(function (b) { b.addEventListener("click", function () { api.setSlide(b.getAttribute("data-slide")); }); });
    root.querySelectorAll("[data-mirror]").forEach(function (b) { b.addEventListener("click", function () { api.setMirror(b.getAttribute("data-mirror")); }); });
    root.querySelectorAll("[data-ctl]").forEach(function (b) {
      b.addEventListener("click", function () {
        var kind = b.getAttribute("data-ctl"), dir = +b.getAttribute("data-dir") || 1;
        if (kind === "coarse") api.coarse(dir); else api.fine(dir);
      });
    });
    var af = document.getElementById("bench-auto"); if (af) af.addEventListener("click", function () { api.autoFocus(); toast("Auto-focus used. In the exam you must do this with the knobs."); });
    var ms = document.getElementById("bench-measure"); if (ms) ms.addEventListener("click", measure);
    var rs = document.getElementById("bench-reset"); if (rs) rs.addEventListener("click", reset);
  }

  paintTable();
  setMethod(1);
})();
