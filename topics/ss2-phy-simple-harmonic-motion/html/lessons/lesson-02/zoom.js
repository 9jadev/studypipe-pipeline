/* Lesson 02 · 3D Zoom (window.StudyScenes.zoom): MassSpringKit v2 `forces` (red F = −kx arrow that grows with x and
   always points to the dashed equilibrium plane, plus v and a arrows) and `testtube` (extra upthrust as the
   restoring force). Counters x, F = −kx, a = −(k/m)x come from kit.reading(). */
(function () {
  "use strict";
  var root = document.getElementById("zoom-stage");
  var canvas = document.getElementById("zoom-canvas");
  var D = window.L02;
  if (!root || !canvas || !D) return;

  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var $ = function (s) { return document.querySelector(s); };
  var toastEl = $("#zoom-toast"), toastT;
  function toast(m) {
    if (!toastEl) return;
    toastEl.textContent = m; toastEl.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove("show"); }, 3000);
  }
  if (typeof THREE === "undefined" || !window.MassSpringKit) {
    /* fallback: kit missing — the callouts and equations above carry the idea */
    root.classList.add("no-webgl");
    return;
  }

  var small = root.clientWidth < 560;
  var mode = "forces", slow = false;
  var kit = MassSpringKit.create({ mode: "forces", m: 0.20, k: D.k, labels: !small });
  var stage = window.SceneKit && SceneKit.createStage({
    root: root, canvas: canvas, fov: 32, pitch: 0.1, yaw: 0.3, autoFit: false, portraitPitch: 0.06, onFrame: function (dt, t) { kit.update(dt, t); }
  });
  if (stage) { stage.rig.add(kit); frameKit(stage, kit); stage.start(); }
  if (window.ResizeObserver && stage) new ResizeObserver(function () { setTimeout(function () { frameKit(stage, kit); }, 30); }).observe(canvas.parentElement);

  /* framing from the kit's own viewFor("all") (the stand and bench top would otherwise shrink the spring) */
  function frameKit(st, k, wide) {
    if (!st) return;
    var v = k.viewFor("all"), span = v.dist * 2 * Math.tan(20 * Math.PI / 180) / 1.25;
    st.target.set(v.target[0], v.target[1], v.target[2]);
    st.fitHeight = span * 1.06;
    st.fitWidth = span * 0.62;
    st.zoom = 1;
    if (st.resize) st.resize();
  }


  var readout = $("#zoom-readout"), modeBtns = Array.prototype.slice.call(document.querySelectorAll("#zoom-mode [data-mode]"));
  var slowBtn = $("#zoom-slow");

  function f(v, d) { return (Math.abs(v) < 0.5 * Math.pow(10, -d) ? 0 : v).toFixed(d).replace("-", "−"); }
  function paint() {
    if (!readout) return;
    var r = kit.reading(), x = r.x || 0, F = r.F || 0, a = mode === "forces" ? (r.a || 0) : F / (r.m || 1);
    readout.innerHTML =
      '<div><span>x / cm</span><b>' + f(x * 100, 1) + "</b></div>" +
      '<div class="hot"><span>F = −kx / N</span><b>' + f(F, 3) + "</b></div>" +
      '<div><span>a / m s⁻²</span><b>' + f(a, 2) + "</b></div>";
  }
  function setMode(m) {
    if (m !== "forces" && m !== "testtube") return;
    mode = m;
    kit.setState({ mode: m });
    kit.release(m === "forces" ? 0.05 : 0.02);
    modeBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-mode") === m)); });
    setTimeout(function () { frameKit(stage, kit); }, 30);
    toast(m === "forces" ? "Spring: the red arrow is the restoring force −kx." : "Test-tube: the extra upthrust pulls it back.");
    emit("l2:zoom", { mode: m });
  }
  function setSlow(on) {
    slow = !!on; kit.setState({ timeScale: slow ? 0.25 : 1 });
    if (slowBtn) slowBtn.setAttribute("aria-pressed", String(slow));
  }
  modeBtns.forEach(function (b) { b.addEventListener("click", function () { setMode(b.getAttribute("data-mode")); }); });
  var rel = $("#zoom-release"); if (rel) rel.addEventListener("click", function () { kit.release(mode === "forces" ? 0.05 : 0.02); });
  if (slowBtn) slowBtn.addEventListener("click", function () { setSlow(!slow); });
  var rs = $("#zoom-reset"); if (rs) rs.addEventListener("click", function () { setSlow(false); setMode("forces"); });

  window.StudyScenes = window.StudyScenes || {};
  window.StudyScenes.zoom = {
    setMode: setMode,
    slow: setSlow,
    release: function () { kit.release(mode === "forces" ? 0.05 : 0.02); },
    reset: function () { setSlow(false); setMode("forces"); },
    highlight: function (p) { if (!p) kit.clearHighlight(); else kit.highlight(p); },
    rect: function (p) {
      if (!stage) return null;
      var o = p && kit.parts && kit.parts[p];
      return stage.rectOf(o || kit, 10);
    },
    reading: function () { return kit.reading(); },
    kit: kit, stage: stage
  };

  kit.release(0.05);
  paint();
  setInterval(paint, 120);
})();
