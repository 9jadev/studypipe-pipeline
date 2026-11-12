/* ==========================================================
   Lesson 01 · 3D Concept Zoom: The Translation Pipeline (window.StudyScenes.zoom)
   Mounts ProgrammingZoom (mode: "translation-pipeline") on a SceneKit stage.
   Parts: sourceStage, lexerStage, translatorGate, siliconDie, pulseStream.
   ========================================================== */
(function () {
  "use strict";
  var root = document.getElementById("zoom-stage");
  var canvas = document.getElementById("zoom-canvas");
  if (!root || !canvas || typeof THREE === "undefined") return;

  var small = window.innerWidth < 560;
  var state = {
    step: 0,
    translator: "compiler",
    raw_str: "85",
    addend: 20
  };

  var kit = window.ProgrammingZoom ? window.ProgrammingZoom.create({
    mode: "translation-pipeline",
    labels: !small
  }) : null;

  var stage = window.SceneKit && SceneKit.createStage({
    root: root,
    canvas: canvas,
    fov: 36,
    target: new THREE.Vector3(0, 0.75, 0),
    pitch: 0.22,
    yaw: 0.12,
    minYaw: -1.0,
    maxYaw: 1.0,
    minHeight: 300,
    maxHeight: 420,
    onFrame: function (dt, t) {
      if (kit && kit.update) kit.update(dt, t);
    }
  });

  if (stage && kit) {
    stage.rig.add(kit);
    if (kit.parts && stage.addPart) {
      Object.keys(kit.parts).forEach(function (k) {
        stage.addPart(k, kit.parts[k], k);
      });
    }
    stage.start();
  }

  var PART_ALIASES = {
    source: "sourceStage",
    lexer: "lexerStage",
    compiler: "translatorGate",
    interpreter: "translatorGate",
    binary: "pulseStream",
    cpu: "siliconDie"
  };
  var STEP_PARTS = ["sourceStage", "lexerStage", "translatorGate", "siliconDie"];
  var STEP_TITLES = [
    "Stage 1 · High-Level Source Code",
    "Stage 2 · Lexer & Parser Tokens (AST)",
    "Stage 3 · Compiler vs Interpreter Gate",
    "Stage 4 · 8-Bit Binary Bus & Silicon ALU"
  ];

  function resolvePart(p) {
    if (!p) return null;
    return PART_ALIASES[p] || p;
  }

  var countEl = document.getElementById("zoom-counters");
  var descEl = document.getElementById("zoom-desc");

  function paint() {
    var r = kit && kit.reading ? kit.reading() : {
      step: state.step,
      translator: state.translator,
      sourceExpr: 'total_kwh = int("' + state.raw_str + '") + ' + state.addend,
      tokenCount: 6,
      passes: state.translator === "compiler" ? 1 : 4,
      total_kwh: parseInt(state.raw_str, 10) + state.addend,
      binaryPulse: "01101001",
      hexOpcode: "0x69"
    };

    if (countEl) {
      countEl.innerHTML =
        '<span class="counter"><i style="--c:#3ee6c4"></i>Stage<b>' + (r.step + 1) + " / 4</b></span>" +
        '<span class="counter"><i style="--c:#ffb23f"></i>Translator<b>' + (r.translator === "compiler" ? "Compiler (1 pass)" : "Interpreter (line-by-line)") + "</b></span>" +
        '<span class="counter"><i style="--c:#7cc4ff"></i>Binary Bus<b>' + r.binaryPulse + "₂ (" + r.hexOpcode + ")</b></span>" +
        '<span class="counter"><i style="--c:#22c55e"></i>ALU Result<b>' + r.total_kwh + " kWh</b></span>";
    }

    if (descEl) {
      var detailText = "";
      if (r.step === 0) {
        detailText = "Human-readable Python expression <code>" + r.sourceExpr + "</code> enters the pipeline.";
      } else if (r.step === 1) {
        detailText = "The lexer splits characters into <b>" + r.tokenCount + " grammatical tokens</b> (identifier, assignment, function call, operator, literal).";
      } else if (r.step === 2) {
        detailText = r.translator === "compiler"
          ? "<b>Compiler mode:</b> translates the entire source program in <b>1 batch pass</b> into standalone native machine object code before execution."
          : "<b>Interpreter mode:</b> translates and dispatches bytecode <b>line-by-line at runtime</b> (" + r.passes + " passes), halting immediately on any syntax or type error.";
      } else {
        detailText = "Physical voltage pulses <code>" + r.binaryPulse + "₂</code> (<code>" + r.hexOpcode + "</code>) switch CPU logic gates to compute <b>" + r.total_kwh + " kWh</b>.";
      }
      descEl.innerHTML = "<strong>" + STEP_TITLES[r.step] + ":</strong> " + detailText;
    }
  }

  function syncUI() {
    root.querySelectorAll("#zoom-trans [data-trans]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-trans") === state.translator));
    });
    root.querySelectorAll("#zoom-steps [data-step]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(+b.getAttribute("data-step") === state.step));
    });
    root.querySelectorAll("#zoom-raw [data-raw]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-raw") === state.raw_str));
    });
  }

  function applyState(emitEvt) {
    if (kit && kit.setState) {
      kit.setState({
        step: state.step,
        translator: state.translator,
        raw_str: state.raw_str,
        addend: state.addend
      });
    }
    if (kit && kit.highlight) {
      kit.highlight(STEP_PARTS[state.step]);
    }
    syncUI();
    paint();
    if (emitEvt !== false) {
      document.dispatchEvent(new CustomEvent("l01:zoom", {
        detail: {
          mode: "translation-pipeline",
          step: state.step,
          translator: state.translator,
          raw_str: state.raw_str
        }
      }));
    }
  }

  function setStep(s) {
    state.step = Math.max(0, Math.min(3, +s || 0));
    applyState(true);
  }

  function setTranslator(t) {
    state.translator = t === "interpreter" ? "interpreter" : "compiler";
    applyState(true);
  }

  function setRawStr(val) {
    state.raw_str = String(val || "85");
    applyState(true);
  }

  function next() {
    state.step = (state.step + 1) % 4;
    applyState(true);
  }

  function reset() {
    state.step = 0;
    state.translator = "compiler";
    state.raw_str = "85";
    state.addend = 20;
    if (kit && kit.reset) kit.reset();
    syncUI();
    paint();
    document.dispatchEvent(new CustomEvent("l01:zoom", {
      detail: { mode: "translation-pipeline", step: 0, translator: "compiler" }
    }));
  }

  root.querySelectorAll("#zoom-trans [data-trans]").forEach(function (b) {
    b.addEventListener("click", function () { setTranslator(b.getAttribute("data-trans")); });
  });
  root.querySelectorAll("#zoom-steps [data-step]").forEach(function (b) {
    b.addEventListener("click", function () { setStep(+b.getAttribute("data-step")); });
  });
  root.querySelectorAll("#zoom-raw [data-raw]").forEach(function (b) {
    b.addEventListener("click", function () { setRawStr(b.getAttribute("data-raw")); });
  });
  var rst = document.getElementById("zoom-reset");
  if (rst) rst.addEventListener("click", reset);

  window.StudyScenes = window.StudyScenes || {};
  window.StudyScenes.zoom = {
    setMode: function (m) {
      if (m === "compiler" || m === "interpreter") setTranslator(m);
    },
    setStep: setStep,
    setStage: setStep,
    setTranslator: setTranslator,
    setRawStr: setRawStr,
    next: next,
    reset: reset,
    highlight: function (p) {
      var k = resolvePart(p);
      if (kit && kit.highlight) kit.highlight(k);
    },
    rect: function (p) {
      var k = resolvePart(p);
      var parts = kit && (kit.parts || (kit.userData && kit.userData.parts));
      return (stage && parts && parts[k]) ? stage.rectOf(parts[k], 14) : null;
    },
    reading: function () {
      return kit && kit.reading ? kit.reading() : null;
    }
  };

  applyState(false);
})();
