/* ==========================================================
   Lesson 01 · 3D Variable & Memory Allocation Bench (window.StudyScenes.bench)
   Mounts ProgrammingBench (mode: "memory-stage") on a SceneKit stage.
   Parts: pcb, cpu, alu, bus, slot1..slot6, display, led.
   Emits l01:bench per allocation/execution and l01:bench-done after 5 steps.
   ========================================================== */
(function () {
  "use strict";
  var root = document.getElementById("bench-stage");
  var canvas = document.getElementById("bench-canvas");
  if (!root || !canvas || typeof THREE === "undefined") return;

  var emit = function (n, d) { document.dispatchEvent(new CustomEvent(n, { detail: d || {} })); };
  var readoutEl = document.getElementById("bench-readout");
  var hintEl = document.getElementById("bench-hint");

  var PRESETS = [
    {
      key: "slot1",
      part: "slot1",
      exprMode: "cast",
      slotIndex: 0,
      addr: "0x01",
      varName: "voltage",
      type: "int",
      rawVal: "230",
      bytes: 2,
      status: "OK · 0x01 (2 B)"
    },
    {
      key: "slot2",
      part: "slot2",
      exprMode: "cast",
      slotIndex: 1,
      addr: "0x02",
      varName: "tariff",
      type: "float",
      rawVal: "68.5",
      bytes: 4,
      status: "OK · 0x02 (4 B)"
    },
    {
      key: "slot3",
      part: "slot3",
      exprMode: "cast",
      slotIndex: 2,
      addr: "0x03",
      varName: "location",
      type: "str",
      rawVal: '"Ikogosi"',
      bytes: 7,
      status: "OK · 0x03 (7 B)"
    },
    {
      key: "mismatch",
      part: "alu",
      exprMode: "mismatch",
      slotIndex: 4,
      addr: "0x05 + ALU",
      varName: 'a + b ("150" + 20)',
      type: "TypeError",
      rawVal: '"150" + 20',
      bytes: 5,
      status: "TypeError (str + int)"
    },
    {
      key: "cast",
      part: "display",
      exprMode: "cast",
      slotIndex: 5,
      addr: "0x06",
      varName: "int(a) + b",
      type: "int (cast)",
      rawVal: "170",
      bytes: 2,
      status: "OK · 170 kWh"
    },
    {
      key: "concat",
      part: "slot5",
      exprMode: "concat",
      slotIndex: 4,
      addr: "0x05",
      varName: 'str(a) + "20"',
      type: "str",
      rawVal: '"15020"',
      bytes: 5,
      status: 'Joined · "15020"'
    },
    {
      key: "precedence",
      part: "alu",
      exprMode: "precedence",
      slotIndex: 5,
      addr: "ALU",
      varName: "12 + 8*2 - 6/2",
      type: "float",
      rawVal: "25.0",
      bytes: 4,
      status: "OK · BODMAS = 25.0"
    },
    {
      key: "bonus",
      part: "cpu",
      exprMode: "bonus",
      slotIndex: 5,
      addr: "ALU",
      varName: "1500 + (1500*0.20)",
      type: "float",
      rawVal: "1800",
      bytes: 4,
      status: "OK · ₦1,800.00"
    }
  ];

  var state = { presetIdx: 0, recorded: 0 };

  var kit = window.ProgrammingBench ? window.ProgrammingBench.create({
    mode: "memory-stage",
    onEvent: onKitEvent
  }) : null;

  var stage = window.SceneKit && SceneKit.createStage({
    root: root,
    canvas: canvas,
    fov: 36,
    target: new THREE.Vector3(0, 0.35, 0),
    pitch: 0.58,
    yaw: 0.06,
    minYaw: -0.95,
    maxYaw: 0.95,
    minHeight: 310,
    maxHeight: 420,
    onFrame: function (dt, t) {
      if (kit && kit.update) kit.update(dt, t);
    }
  });

  if (stage && kit) {
    stage.rig.add(kit);
    if (kit.userData && kit.userData.parts && stage.addPart) {
      Object.keys(kit.userData.parts).forEach(function (k) {
        stage.addPart(k, kit.userData.parts[k], k);
      });
    }
    stage.start();
  }

  function resolvePartName(p) {
    if (!p) return null;
    if (p === "board") return "pcb";
    if (p === "console") return "display";
    return p;
  }

  function currentPreset() {
    return PRESETS[state.presetIdx] || PRESETS[0];
  }

  function paintReadout() {
    if (!readoutEl) return;
    var p = currentPreset();
    var isErr = p.key === "mismatch";
    readoutEl.innerHTML =
      '<div><span>Identifier / Expr</span><b class="sm">' + p.varName + "</b></div>" +
      "<div><span>Type</span><b>" + p.type + "</b></div>" +
      "<div><span>Address / Size</span><b>" + p.addr + " · " + p.bytes + " B</b></div>" +
      '<div class="' + (isErr ? "hot" : "") + '"><span>Value / Status</span><b class="sm">' + (isErr ? "TypeError!" : p.rawVal) + "</b></div>";
  }

  function paintHint() {
    if (!hintEl) return;
    var done = Math.min(state.recorded, 5);
    hintEl.innerHTML = "Completed <b>" + done + " of 5</b> core memory steps";
  }

  function syncButtons() {
    var p = currentPreset();
    root.querySelectorAll("[data-preset]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-preset") === p.key));
    });
  }

  function selectPreset(keyOrIdx) {
    var idx = typeof keyOrIdx === "number" ? keyOrIdx : -1;
    if (idx < 0) {
      for (var i = 0; i < PRESETS.length; i++) {
        if (PRESETS[i].key === keyOrIdx) { idx = i; break; }
      }
    }
    if (idx < 0) idx = 0;
    state.presetIdx = idx % PRESETS.length;
    var p = currentPreset();
    if (kit && kit.setState) {
      kit.setState({ exprMode: p.exprMode, slotIndex: p.slotIndex });
    }
    if (kit && kit.highlight) {
      kit.highlight(p.part);
    }
    syncButtons();
    paintReadout();
    updateMethodCards();
  }

  function updateMethodCards() {
    var m1 = document.getElementById("m1");
    var m2 = document.getElementById("m2");
    var m3 = document.getElementById("m3");
    var m4 = document.getElementById("m4");
    var cards = [m1, m2, m3, m4];
    var active = state.presetIdx < 2 ? 0 : (state.presetIdx === 2 ? 1 : (state.presetIdx === 3 ? 2 : 3));
    cards.forEach(function (c, i) {
      if (!c) return;
      c.classList.toggle("now", i === active);
      c.classList.toggle("done", state.recorded > i);
    });
  }

  var suppressKitEcho = false;
  function onKitEvent(name) {
    if (suppressKitEcho) return;
    if (name === "reset") {
      emit("l01:bench-reset", {});
    }
  }

  function take() {
    var p = currentPreset();
    suppressKitEcho = true;
    if (kit) {
      kit.setState({ exprMode: p.exprMode, slotIndex: p.slotIndex });
      kit.takeReading();
      kit.highlight(p.part);
    }
    suppressKitEcho = false;

    state.recorded++;
    var rd = kit ? kit.reading() : {};
    var detail = Object.assign({}, rd, {
      stepNumber: state.recorded,
      key: p.key,
      addr: p.addr,
      varName: p.varName,
      type: p.type,
      rawVal: p.rawVal,
      bytes: p.bytes,
      status: p.status
    });

    paintReadout();
    paintHint();
    updateMethodCards();
    emit("l01:bench", detail);

    if (state.recorded >= 5) {
      emit("l01:bench-done", { count: state.recorded, reading: detail });
    }

    // Advance to next preset for seamless 5-step progression
    state.presetIdx = (state.presetIdx + 1) % 5;
    syncButtons();
  }

  function stepMode() {
    selectPreset((state.presetIdx + 1) % PRESETS.length);
  }

  function reset() {
    state.presetIdx = 0;
    state.recorded = 0;
    suppressKitEcho = true;
    if (kit) {
      kit.reset();
      kit.clearHighlight();
    }
    suppressKitEcho = false;
    syncButtons();
    paintReadout();
    paintHint();
    updateMethodCards();
    emit("l01:bench-reset", {});
  }

  function wire() {
    root.querySelectorAll("[data-preset]").forEach(function (b) {
      b.addEventListener("click", function () {
        selectPreset(b.getAttribute("data-preset"));
      });
    });
    var tk = document.getElementById("bench-take");
    if (tk) tk.addEventListener("click", take);
    var st = document.getElementById("bench-step");
    if (st) st.addEventListener("click", stepMode);
    var rs = document.getElementById("bench-reset");
    if (rs) rs.addEventListener("click", reset);
  }

  window.StudyScenes = window.StudyScenes || {};
  window.StudyScenes.bench = {
    selectPreset: selectPreset,
    setMode: function (m) { selectPreset(m); },
    step: stepMode,
    take: take,
    takeReading: take,
    reset: reset,
    highlight: function (p) {
      var k = resolvePartName(p);
      if (kit && kit.highlight) kit.highlight(k);
    },
    rect: function (p) {
      var k = resolvePartName(p);
      var parts = kit && (kit.parts || (kit.userData && kit.userData.parts));
      return (stage && parts && parts[k]) ? stage.rectOf(parts[k], 14) : null;
    },
    reading: function () {
      return kit ? kit.reading() : null;
    }
  };

  wire();
  selectPreset(0);
  paintHint();
})();
