/* ==========================================================
   StudyPipe — Lesson 06 Concept Zoom: The Silicon Bridge
   Mounts ProgrammingZoom (mode: "silicon-bridge") on a SceneKit stage.
   Exposes window.StudyScenes.zoom.
   ========================================================== */
(function () {
  "use strict";
  var root = document.getElementById("zoom-stage");
  var canvas = document.getElementById("zoom-canvas");
  if (!root || !canvas || typeof THREE === "undefined") return;

  var small = window.innerWidth < 560;
  var state = { tier: 0, byteVal: 0x7E };

  var z = (window.ProgrammingZoom && ProgrammingZoom.create)
    ? ProgrammingZoom.create({ mode: "silicon-bridge", labels: !small })
    : null;

  var stage = window.SceneKit && SceneKit.createStage({
    root: root, canvas: canvas, fov: 36,
    target: new THREE.Vector3(0, 0.85, 0), pitch: 0.22, yaw: 0.14,
    minYaw: -1.0, maxYaw: 1.0, minHeight: 300, maxHeight: 430,
    onFrame: function (dt, t) { if (z && z.update) z.update(dt, t); }
  });

  var PART_ALIASES = {
    transistorGate: "cmosTier",
    byteRegister: "hexTier",
    hexDecoder: "hexTier",
    pythonTrace: "pythonTier"
  };

  if (stage && z) {
    stage.rig.add(z);
    if (stage.addPart) {
      var parts = z.parts || (z.userData && z.userData.parts) || {};
      Object.keys(parts).forEach(function (k) {
        stage.addPart(k, parts[k], k);
      });
      Object.keys(PART_ALIASES).forEach(function (alias) {
        var target = parts[PART_ALIASES[alias]];
        if (target) stage.addPart(alias, target, alias);
      });
    }
    stage.start();
  }

  var countEl = document.getElementById("zoom-counters");
  var TIER_LABELS = ["1 · Python source", "2 · Assembly ISA", "3 · Hex / binary byte", "4 · CMOS logic gates"];

  function paint() {
    if (!countEl) return;
    var r = (z && z.reading) ? z.reading() : {
      tier: state.tier,
      hexCode: "0x7E",
      binary8: "01111110",
      railVoltage_V: 3.3,
      logicState: "HIGH (1)",
      nmosState: "ON (Conducting)"
    };
    countEl.innerHTML =
      '<span class="counter"><i style="--c:#3ee6c4"></i>Tier<b>' + TIER_LABELS[state.tier] + "</b></span>" +
      '<span class="counter"><i style="--c:#ffb23f"></i>Byte<b>' + r.hexCode + " (" + r.binary8 + "₂)</b></span>" +
      '<span class="counter"><i style="--c:#7cc4ff"></i>CMOS Rail<b>' + (r.railVoltage_V != null ? r.railVoltage_V.toFixed(1) : "3.3") + " V · " + r.logicState + "</b></span>" +
      '<span class="counter"><i style="--c:#f43f5e"></i>Gate<b>' + r.nmosState + "</b></span>";
  }

  function syncUi() {
    root.querySelectorAll("#zoom-tiers [data-tier]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(+b.getAttribute("data-tier") === state.tier));
    });
    root.querySelectorAll("#zoom-bytes [data-byte]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(+b.getAttribute("data-byte") === state.byteVal));
    });
  }

  function setTier(t) {
    state.tier = Math.max(0, Math.min(3, Math.round(+t || 0)));
    if (z && z.setState) z.setState({ tier: state.tier, byteVal: state.byteVal });
    syncUi();
    paint();
    document.dispatchEvent(new CustomEvent("l06:zoom", { detail: { mode: "silicon-bridge", tier: state.tier, byteVal: state.byteVal } }));
  }

  function setByte(b) {
    state.byteVal = Math.max(0, Math.min(255, Math.round(+b || 0)));
    if (z && z.setState) z.setState({ tier: state.tier, byteVal: state.byteVal });
    syncUi();
    paint();
    document.dispatchEvent(new CustomEvent("l06:zoom", { detail: { mode: "silicon-bridge", tier: state.tier, byteVal: state.byteVal } }));
  }

  function reset() {
    state.tier = 0;
    state.byteVal = 0x7E;
    if (z && z.reset) z.reset();
    if (z && z.setState) z.setState({ tier: 0, byteVal: 0x7E });
    syncUi();
    paint();
  }

  function resolvePart(p) {
    return PART_ALIASES[p] || p;
  }

  root.querySelectorAll("#zoom-tiers [data-tier]").forEach(function (b) {
    b.addEventListener("click", function () { setTier(+b.getAttribute("data-tier")); });
  });
  root.querySelectorAll("#zoom-bytes [data-byte]").forEach(function (b) {
    b.addEventListener("click", function () { setByte(+b.getAttribute("data-byte")); });
  });
  var rst = document.getElementById("zoom-reset");
  if (rst) rst.addEventListener("click", reset);

  window.StudyScenes = window.StudyScenes || {};
  window.StudyScenes.zoom = {
    setMode: function () {},
    setTier: setTier,
    setByte: setByte,
    next: function () { setTier((state.tier + 1) % 4); },
    reset: reset,
    highlight: function (p) { if (z && z.highlight) z.highlight(resolvePart(p) || null); },
    rect: function (p) {
      var k = resolvePart(p);
      var parts = (z && z.parts) || (z && z.userData && z.userData.parts) || {};
      return (stage && parts[k]) ? stage.rectOf(parts[k], 14) : null;
    },
    reading: function () { return z && z.reading ? z.reading() : null; }
  };

  syncUi();
  paint();
})();
