/* ==========================================================
   StudyPipe — Welcome Hub Explorer · Introduction to Computer Programming
   Four live interactive SVG visualizers + mathematical curves (02-lesson.md § 5):
     hierarchy  Language Abstraction Ladder: High-Level Python → Assembly → 8-bit Binary
     variables  Variable Memory Container Model: int, float, str, bool in RAM
     control    Control Flow Pathways & Loop Accumulator: IF-ELSE + sum(1..5) = 15
     arrays     Contiguous Array Grid (0..N−1): Addr = 1000 + 4i & Index 8 Out-of-Bounds
   Defines window.WELCOME_COMBOS (text fields, used by welcome.js), draws the SVG + slider,
   and typesets the 6 calculation archetypes with StudyMath when it loads.
   Load BEFORE welcome.js. Classic script, 100% offline.
   ========================================================== */
(function () {
  "use strict";

  window.WELCOME_COMBOS = {
    hierarchy: {
      title: "Language Abstraction Ladder",
      example: "Lesson 1: High-Level Python → Assembly Mnemonics → 8-bit Binary Machine Code",
      jump: "Hardware only executes binary (0 and 1); translators bridge the gap",
      eq: "Compiler: whole program at once. Interpreter: line by line at runtime",
      ind: "Machine code needs no translator; assembly uses an assembler",
      indClass: "ind-both",
      why: "Humans think in formulas like energy = units * 68.0, whereas the CPU ALU only switches transistors on (+3.3 V = 1) and off (0 V = 0). A compiler or interpreter parses high-level tokens and emits exact machine instructions."
    },
    variables: {
      title: "Variable Memory Container Model",
      example: "Lesson 1: 0x01 units = 120 (int) · 0x02 tariff = 68.0 (float) · 0x04 site = \"Ikogosi\" (str)",
      jump: "Every variable has 4 attributes: Identifier, Data Type, Address, and Value",
      eq: "int(\"150\") + 20 = 170 (math)  vs  \"150\" + \"20\" = \"15020\" (concatenation)",
      ind: "Assigning a new value overwrites the previous value in that RAM slot",
      indClass: "ind-both",
      why: "Quotation marks tell the translator to store characters as a text string rather than a binary number. Casting with int() or float() converts digit strings into numeric values before arithmetic."
    },
    control: {
      title: "Control Flow & Loop Accumulator",
      example: "Lessons 2 & 3: IF-ELIF-ELSE branching and FOR i IN range(1, 6): sum += i",
      jump: "Sequential (top-to-bottom) · Selection (IF diamond) · Iteration (FOR/WHILE loop)",
      eq: "sum = 1 + 2 + 3 + 4 + 5 = 15  (range(1, 6) stops before 6)",
      ind: "Every WHILE loop must update its condition variable to avoid an infinite loop",
      indClass: "ind-both",
      why: "Standard code runs sequentially line by line. A conditional diamond diverts execution along True or False branches, while a loop jumps backwards to repeat a block until its counter or condition finishes."
    },
    arrays: {
      title: "Contiguous Array Grid (0..N−1)",
      example: "Lesson 4: 8 lithium cells at indices 0..7 (Base = 1000, Size = 4 bytes)",
      jump: "Address(i) = Base + i × Size;  last valid index = N − 1",
      eq: "For N = 8 cells: valid indices are 0..7;  cells[8] raises IndexError",
      ind: "The 1st element is at index 0 (zero byte offset from the base address)",
      indClass: "ind-both",
      why: "Because array elements sit side-by-side in contiguous RAM, index i simply counts how many element widths to step forward from the base address. Starting at 0 means the 8th item is at index 7."
    }
  };

  var svg = document.getElementById("combo-svg");
  if (!svg) return;
  var NS = "http://www.w3.org/2000/svg";
  var el = {
    grid: document.getElementById("combo-grid"),
    curve: document.getElementById("combo-curve"),
    curve2: document.getElementById("combo-curve2"),
    pts: document.getElementById("combo-points"),
    zone: document.getElementById("combo-zone"),
    extra: document.getElementById("combo-extra"),
    marker: document.getElementById("combo-marker"),
    marker2: document.getElementById("combo-marker2"),
    dx: document.getElementById("combo-dropx"),
    dy: document.getElementById("combo-dropy"),
    slider: document.getElementById("combo-slider"),
    slideLabel: document.getElementById("combo-slide-label"),
    read: document.getElementById("combo-read")
  };

  var cur = "hierarchy";

  function mk(tag, attrs, text) {
    var n = document.createElementNS(NS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (text != null) n.textContent = text;
    return n;
  }

  function clearAll() {
    el.grid.innerHTML = "";
    el.pts.innerHTML = "";
    el.extra.innerHTML = "";
    el.zone.setAttribute("width", 0);
    el.zone.setAttribute("height", 0);
    el.curve.setAttribute("d", "M 0 0");
    el.curve2.setAttribute("d", "M 0 0");
    el.curve2.style.display = "none";
    el.marker2.style.display = "none";
    el.dx.setAttribute("x1", 0); el.dx.setAttribute("x2", 0); el.dx.setAttribute("y1", 0); el.dx.setAttribute("y2", 0);
    el.dy.setAttribute("x1", 0); el.dy.setAttribute("x2", 0); el.dy.setAttribute("y1", 0); el.dy.setAttribute("y2", 0);
  }

  function setReadout(rows) {
    el.read.innerHTML = "";
    rows.forEach(function (r) {
      var div = document.createElement("div"), s = document.createElement("span"), b = document.createElement("b");
      s.textContent = r[0]; b.textContent = r[1];
      div.appendChild(s); div.appendChild(b);
      el.read.appendChild(div);
    });
  }

  /* ---------------- 1. Language Hierarchy Ladder ---------------- */
  var TIERS = [
    {
      level: "Level 3 · High-Level (Python / BASIC)",
      code: "energy = units * 68.0",
      trans: "Compiler (whole file) or Interpreter (line-by-line)",
      hw: "Portable across CPUs · Human-readable",
      y: 46, cx: 105
    },
    {
      level: "Level 2 · Low-Level Assembly",
      code: "LOAD R1, [0x01]  ·  MULT R1, 68.0",
      trans: "Assembler (mnemonics → object code)",
      hw: "1-to-1 with CPU registers",
      y: 122, cx: 225
    },
    {
      level: "Level 1 · Machine Code (Binary / Hex)",
      code: "10110001 01111110  (0xB1 0x7E)",
      trans: "None — executed directly by CPU gates",
      hw: "+3.3 V (1) and 0 V (0) pulses",
      y: 198, cx: 345
    }
  ];

  function renderHierarchy(u) {
    clearAll();
    var idx = Math.min(2, Math.floor(u * 3));
    // Draw ladder boxes
    TIERS.forEach(function (t, i) {
      var active = i === idx;
      el.extra.appendChild(mk("rect", {
        "class": active ? "cx-box-hi" : "cx-box",
        x: 36, y: t.y - 26, width: 368, height: 52, rx: 8
      }));
      el.extra.appendChild(mk("text", {
        "class": active ? "cx-note cx-note-a" : "cx-title",
        x: 52, y: t.y - 6
      }, t.level));
      el.extra.appendChild(mk("text", {
        "class": "cx-tick",
        x: 52, y: t.y + 14
      }, t.code));
      if (i < 2) {
        el.extra.appendChild(mk("line", {
          "class": "cx-drop", x1: 220, y1: t.y + 26, x2: 220, y2: TIERS[i + 1].y - 26
        }));
      }
    });
    el.curve.setAttribute("d", "M 105 46 L 225 122 L 345 198");
    var curT = TIERS[idx];
    el.marker.setAttribute("cx", curT.cx);
    el.marker.setAttribute("cy", curT.y);
    setReadout([
      ["Layer", curT.level.split(" · ")[1]],
      ["Instruction", curT.code],
      ["Translator", curT.trans]
    ]);
  }

  /* ---------------- 2. Variable Memory Boxes ---------------- */
  var VARS = [
    { addr: "0x01", name: "units", type: "int (2 B)", val: "120", op: "units + 30 → 150", x: 38, y: 36 },
    { addr: "0x02", name: "tariff", type: "float (4 B)", val: "68.0", op: "120 * 68.0 → 8160.0", x: 232, y: 36 },
    { addr: "0x04", name: "raw_str", type: "str (3 B)", val: '"150"', op: '"150" + "20" → "15020" (Trap!)', x: 38, y: 136 },
    { addr: "0x05", name: "cast_int", type: "int (2 B)", val: 'int("150")', op: 'int("150") + 20 → 170 (Fixed!)', x: 232, y: 136 }
  ];

  function renderVariables(u) {
    clearAll();
    var idx = Math.min(3, Math.floor(u * 4));
    VARS.forEach(function (v, i) {
      var active = i === idx;
      var cls = active ? (i === 2 ? "cx-box-err" : "cx-box-hi") : "cx-box";
      el.extra.appendChild(mk("rect", { "class": cls, x: v.x, y: v.y, width: 170, height: 82, rx: 8 }));
      el.extra.appendChild(mk("text", { "class": "cx-tick cx-tick2", x: v.x + 12, y: v.y + 20 }, v.addr + " · " + v.type));
      el.extra.appendChild(mk("text", { "class": "cx-title", x: v.x + 12, y: v.y + 44 }, v.name + " = " + v.val));
      el.extra.appendChild(mk("text", { "class": "cx-note", x: v.x + 12, y: v.y + 66 }, v.op));
    });
    var sel = VARS[idx];
    el.marker.setAttribute("cx", sel.x + 154);
    el.marker.setAttribute("cy", sel.y + 20);
    setReadout([
      ["RAM Address", sel.addr + " (" + sel.name + ")"],
      ["Data Type", sel.type],
      ["Evaluation", sel.op]
    ]);
  }

  /* ---------------- 3. Control Flow & Loop Accumulator ---------------- */
  var PL = 56, PR = 400, PT = 22, PB = 212;
  function sx(x, x0, x1) { return PL + (x - x0) / (x1 - x0) * (PR - PL); }
  function sy(y, y0, y1) { return PB - (y - y0) / (y1 - y0) * (PB - PT); }

  function renderControl(u) {
    clearAll();
    var step = Math.max(1, Math.min(5, Math.round(1 + u * 4)));
    var xt = [1, 2, 3, 4, 5], yt = [0, 3, 6, 9, 12, 15];
    yt.forEach(function (v) {
      var py = sy(v, 0, 16);
      el.grid.appendChild(mk("line", { "class": "cx-grid", x1: PL, x2: PR, y1: py, y2: py }));
      el.grid.appendChild(mk("text", { "class": "cx-tick", x: PL - 8, y: py + 3.5, "text-anchor": "end" }, String(v)));
    });
    xt.forEach(function (v) {
      var px = sx(v, 1, 5);
      el.grid.appendChild(mk("line", { "class": "cx-grid", x1: px, x2: px, y1: PT, y2: PB }));
      el.grid.appendChild(mk("text", { "class": "cx-tick", x: px, y: PB + 16, "text-anchor": "middle" }, "i=" + v));
    });
    el.grid.appendChild(mk("line", { "class": "cx-axis", x1: PL, x2: PR, y1: PB, y2: PB }));
    el.grid.appendChild(mk("line", { "class": "cx-axis", x1: PL, x2: PL, y1: PT, y2: PB }));
    el.grid.appendChild(mk("text", { "class": "cx-title", x: (PL + PR) / 2, y: 248, "text-anchor": "middle" }, "Loop counter i in range(1, 6)"));
    el.grid.appendChild(mk("text", { "class": "cx-title", x: 16, y: (PT + PB) / 2, "text-anchor": "middle", transform: "rotate(-90 16 " + (PT + PB) / 2 + ")" }, "Accumulator sum"));

    var d = "";
    var sum = 0;
    for (var i = 1; i <= 5; i++) {
      sum += i;
      var px = sx(i, 1, 5), py = sy(sum, 0, 16);
      d += (i === 1 ? "M " : " L ") + px.toFixed(1) + " " + py.toFixed(1);
      el.pts.appendChild(mk("circle", { "class": "cx-pt", cx: px, cy: py, r: 4.5 }));
    }
    el.curve.setAttribute("d", d);
    el.extra.appendChild(mk("text", { "class": "cx-note cx-note-a", x: PL + 16, y: PT + 16 }, "for i in range(1, 6): sum += i"));

    var curSum = step * (step + 1) / 2;
    var mx = sx(step, 1, 5), my = sy(curSum, 0, 16);
    el.marker.setAttribute("cx", mx);
    el.marker.setAttribute("cy", my);
    el.dx.setAttribute("x1", mx); el.dx.setAttribute("x2", mx); el.dx.setAttribute("y1", my); el.dx.setAttribute("y2", PB);
    el.dy.setAttribute("x1", PL); el.dy.setAttribute("x2", mx); el.dy.setAttribute("y1", my); el.dy.setAttribute("y2", my);

    setReadout([
      ["Pass / Counter", "i = " + step + " (of 5)"],
      ["Step Addition", (curSum - step) + " + " + step + " = " + curSum],
      ["Condition i < 6", step < 5 ? "True (continue loop)" : "Next i=6 → False (exit)"]
    ]);
  }

  /* ---------------- 4. Array Contiguous Grid (0..N−1) ---------------- */
  var CELLS = [3.25, 3.18, 3.30, 2.95, 3.22, 3.15, 3.28, 3.20];

  function renderArrays(u) {
    clearAll();
    var idx = Math.min(8, Math.floor(u * 9)); // 0..7 valid, 8 = IndexError
    var startX = 22, boxW = 43, boxH = 74, boxY = 76;

    el.extra.appendChild(mk("text", { "class": "cx-title", x: 220, y: 34, "text-anchor": "middle" },
      "8-Element Array: cells[0..7]  ·  Base = 1000, Size = 4 bytes"));

    for (var i = 0; i <= 8; i++) {
      var x = startX + i * 44;
      var isOOB = i === 8;
      var active = i === idx;
      var cls = active ? (isOOB ? "cx-box-err" : "cx-box-hi") : (isOOB ? "cx-box-err" : "cx-box");
      el.extra.appendChild(mk("rect", { "class": cls, x: x, y: boxY, width: boxW, height: boxH, rx: 6 }));
      el.extra.appendChild(mk("text", {
        "class": isOOB ? "cx-note" : "cx-tick cx-tick2",
        x: x + boxW / 2, y: boxY - 8, "text-anchor": "middle"
      }, "[" + i + "]"));
      el.extra.appendChild(mk("text", {
        "class": "cx-title",
        x: x + boxW / 2, y: boxY + 34, "text-anchor": "middle"
      }, isOOB ? "ERR" : String(CELLS[i])));
      el.extra.appendChild(mk("text", {
        "class": "cx-tick",
        x: x + boxW / 2, y: boxY + 58, "text-anchor": "middle"
      }, String(1000 + i * 4)));
      el.extra.appendChild(mk("text", {
        "class": "cx-tick",
        x: x + boxW / 2, y: boxY + boxH + 18, "text-anchor": "middle"
      }, isOOB ? "OOB!" : "#" + (i + 1)));
    }

    var selX = startX + idx * 44 + boxW / 2;
    el.marker.setAttribute("cx", selX);
    el.marker.setAttribute("cy", boxY + boxH + 34);

    if (idx < 8) {
      setReadout([
        ["Index / Pos", "cells[" + idx + "] (" + (idx + 1) + (idx === 0 ? "st" : idx === 1 ? "nd" : idx === 2 ? "rd" : "th") + " item)"],
        ["Byte Address", "1000 + " + idx + "×4 = " + (1000 + idx * 4)],
        ["Stored Value", CELLS[idx].toFixed(2) + " V (Valid)"]
      ]);
    } else {
      setReadout([
        ["Index Tried", "cells[8] (9th item — does not exist!)"],
        ["Max Valid Index", "N − 1 = 8 − 1 = 7"],
        ["Result", "IndexError: list index out of range"]
      ]);
    }
  }

  var SLIDE_LABELS = {
    hierarchy: "Slide: step down from Python to Binary",
    variables: "Slide: inspect each RAM container",
    control: "Slide: step loop counter i from 1 to 5",
    arrays: "Slide: dial array index 0..7 (and try index 8!)"
  };

  function draw(key) {
    if (!SLIDE_LABELS[key]) key = "hierarchy";
    cur = key;
    if (el.slideLabel) el.slideLabel.textContent = SLIDE_LABELS[key];
    el.slider.value = key === "arrays" ? 0 : 200;
    move();
  }

  function move() {
    var u = (+el.slider.value) / 1000;
    if (cur === "hierarchy") renderHierarchy(u);
    else if (cur === "variables") renderVariables(u);
    else if (cur === "control") renderControl(u);
    else renderArrays(u);
  }

  el.slider.addEventListener("input", move);
  document.querySelectorAll(".combo-tab[data-combo]").forEach(function (t) {
    t.addEventListener("click", function () { draw(t.getAttribute("data-combo")); });
  });
  draw("hierarchy");

  /* ---------------- archetype chains: typeset with StudyMath when it loads ---------------- */
  function typeset() {
    if (!window.StudyMath || !StudyMath.tex) return;
    document.querySelectorAll(".arch-steps .tex[data-tex]").forEach(function (n) {
      try {
        var html = StudyMath.tex(n.getAttribute("data-tex"), false);
        if (html) n.innerHTML = html;
      } catch (e) { /* keep plain-text fallback */ }
    });
  }
  if (document.readyState === "complete") typeset();
  else window.addEventListener("load", typeset);
})();
