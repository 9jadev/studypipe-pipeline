/* Lesson 07 · 2D Paper.js zoom (window.StudyScenes.zoom): ShmKinematics2D "resonance" (rule 5b: a graph).
   A against driving f for the okada, live operating point from the speed slider (or a drag on the graph),
   ζ slider 0.05 → 0.30 (peak 10.0 cm → ≈ 2.0 cm), load 200 ↔ 250 kg (peak 2.00 → 1.79 Hz),
   dashed lift-off threshold g/(2πf)². Every number from ShmKinematics2D reading(). Emits l7:zoom. */
(function () {
  "use strict";
  var canvas = document.getElementById("zoom-canvas"), root = document.getElementById("zoom-stage");
  if (!canvas || !root) return;
  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var $ = function (s) { return document.querySelector(s); };
  if (!window.paper || !window.ShmKinematics2D) { root.classList.add("no-webgl"); return; }

  var readoutEl = $("#zoom-readout"), speedIn = $("#zoom-speed"), speedVal = $("#zoom-speed-val");
  var zetaIn = $("#zoom-zeta"), zetaVal = $("#zoom-zeta-val");
  var loadBtns = Array.prototype.slice.call(document.querySelectorAll("#zoom-load [data-mass]"));
  var lastEmit = 0;

  function tile(lab, val, cls) { return '<div class="' + (cls || "") + '"><span>' + lab + '</span><b>' + val + '</b></div>'; }
  function paint(r) {
    if (!r || r.scene !== "resonance") return;
    if (readoutEl) readoutEl.innerHTML = tile("v", r.display.v.replace(" m/s", "")) + tile("f", r.display.f) + tile("f₀", r.display.f0) +
      tile("A", r.display.A, r.lift ? "l7-hot" : "") + tile("Lifts at", r.display.threshold);
    if (speedIn && document.activeElement !== speedIn) speedIn.value = String(r.speed_kmh);
    if (speedVal) speedVal.textContent = (Math.round(r.speed_kmh * 10) / 10) + " km/h";
    var now = Date.now();
    if (now - lastEmit > 150) { lastEmit = now; emit("l7:zoom", { mode: "resonance", speed_kmh: r.speed_kmh, zeta: r.zeta, load_kg: r.load_kg, A_cm: r.A_cm, lift: r.lift }); }
  }

  var z;
  try {
    z = ShmKinematics2D.create({ canvas: canvas, scene: "resonance", speed_kmh: 18, zeta: 0.05, load_kg: 200, labels: true, surface: "ink", onChange: paint });
  } catch (e) { root.classList.add("no-webgl"); return; }

  function set(p) { z.setState(p); paint(z.reading()); }
  if (speedIn) speedIn.addEventListener("input", function () { set({ speed_kmh: +speedIn.value }); });
  if (zetaIn) zetaIn.addEventListener("input", function () { var v = +zetaIn.value; if (zetaVal) zetaVal.textContent = v.toFixed(2); set({ zeta: v }); });
  function setLoad(m) { loadBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(+b.getAttribute("data-mass") === m)); }); set({ load_kg: m }); }
  loadBtns.forEach(function (b) { b.addEventListener("click", function () { setLoad(+b.getAttribute("data-mass")); }); });
  function setZeta(v) { if (zetaIn) zetaIn.value = String(v); if (zetaVal) zetaVal.textContent = v.toFixed(2); set({ zeta: v }); }

  window.StudyScenes = window.StudyScenes || {};
  window.StudyScenes.zoom = {
    rect: function (p) { return z.rect(p); },
    highlight: function (p) { z.highlight(p || null); },
    setMode: function (m) {
      // presets the narrator uses: "leaking" (ζ 0.05, 200 kg, 18 km/h), "healthy", "heavy" (250 kg, 16 km/h), "far" (30 km/h)
      if (m === "healthy") setZeta(0.30);
      else if (m === "heavy") { setZeta(0.05); setLoad(250); set({ speed_kmh: 16 }); }
      else if (m === "far") { set({ speed_kmh: 30 }); }
      else { setZeta(0.05); setLoad(200); set({ speed_kmh: 18 }); }
      emit("l7:zoom", { mode: m || "leaking" });
    },
    setSpeed: function (v) { set({ speed_kmh: v }); },
    reset: function () { this.setMode("leaking"); },
    reading: function () { return z.reading(); },
    kit: z
  };
  paint(z.reading());
})();
