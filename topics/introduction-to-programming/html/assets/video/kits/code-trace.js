/* =========================================================
   StudyPipe explainer-video kit · code-trace
   Three scenes in one kit (selected by `scene: 'memory' | 'loop' | 'array'`, cross-faded cleanly):
   1. 'memory' (Lesson 01):
      - Top translation pipeline bar: High-Level Python ("150" + 20) -> Translator (Compiler batch vs Interpreter line-by-line) -> Machine Binary (10110001).
      - Middle RAM memory bank: 3 labelled memory lockers (0x01: raw_str, 0x02: offset, 0x03: total) with data-type badges (str, int) and stored values.
      - Bottom ALU operation box: red TypeError / String Concatenation trap ("150" + 20 / "200" + "50" = "20050") when cast: 0, green type-cast arithmetic (int("150") + 20 = 170, 200 + 50 = 250) when cast: 1, plus operator precedence mode (prec: 1 showing 12 + 8 × 2 − 6 ÷ 2 = 12 + 16 − 3 = 25).
   2. 'loop' (Lesson 03):
      - Left code & flowchart loop block: header diamond (i < 7 or count <= 5), body box (total += read[i]), step box (i = i + 1), and animated curved back-edge arrow jumping from bottom of loop back to condition diamond.
      - Right trace register & 7-day solar bar strip ([45, 52, 60, 58, 49, 63, 55] kWh): highlights current index step (0..7), shows live counter i, current reading, and running accumulator total (0 -> 45 -> 97 -> 157 -> 215 -> 264 -> 327 -> 382 kWh, mean 54.57 kWh), or when bug: 1 shows the red runaway infinite-loop warning (count = 1 frozen, CPU 99%).
   3. 'array' (Lesson 04):
      - Contiguous 8-slot RAM locker rack (Index 0 .. Index 7) at base address 0x1000 (4 bytes per slot: 0x1000 to 0x101C), holding the 8 Ikogosi clinic battery cell voltages [3.25, 3.18, 3.30, 2.95, 3.22, 3.15, 3.28, 3.20] V, plus a red cross-hatched out-of-bounds zone at Index 8 (0x1020).
      - Animated pointer needle aimed at slot idx (0..8), live offset calculation box Addr = 0x1000 + idx × 4, minimum-tracker badge (min = 2.95V @ idx 3), and red IndexError alarm when idx: 8 (oob: 1).
   Contract: .agents/skills/explainer-video/references/adding-a-kit.md · every frame is a pure function of (t, P).
   ========================================================= */
(window.VIDEO_KITS = window.VIDEO_KITS || {})["code-trace"] = {
  title: "Code execution & memory trace: translators, RAM variables & type casting, FOR/WHILE loop flowchart & accumulator, contiguous array & offset math",
  states: {
    scene: "'memory' | 'loop' | 'array' (selects active scene)",
    stage: "0..4: progressive reveal within the active scene",
    translator: "'none' | 'compiler' | 'interpreter' (memory scene translator mode)",
    cast: "0 | 1: 0 = uncast string trap, 1 = int() cast fixed (memory scene)",
    prec: "0 | 1: show operator precedence evaluation 12 + 8*2 - 6/2 = 25 (memory scene)",
    step: "0..7: loop iteration index 0..7 (loop scene)",
    bug: "0 | 1: 1 = missing increment infinite loop alarm (loop scene)",
    idx: "0..8: array pointer index 0..8 (array scene)",
    oob: "0 | 1: 1 = highlight Index 8 out-of-bounds crash (array scene)",
    minTrack: "0 | 1: 1 = show min_voltage & min_index tracker badge (array scene)",
    labels: "0 | 1: show/hide secondary descriptive labels",
    focus: "null | 'pipeline' | 'ram' | 'alu' | 'flowchart' | 'trace' | 'rack' | 'offset' | 'oob'",
  },
  focus: {
    pipeline: [16, 16, 388, 120],
    ram: [16, 130, 388, 150],
    alu: [16, 270, 388, 134],
    flowchart: [14, 30, 200, 360],
    trace: [206, 30, 200, 360],
    rack: [14, 40, 392, 200],
    offset: [14, 240, 392, 160],
    oob: [260, 40, 150, 200],
  },
  create(svg, api) {
    const { el, tx, mixN, lerp, clamp, frac, PAL, COLOR } = api;
    const role = (k, fb) => {
      const c = COLOR && COLOR(k);
      return !c || c === k ? fb : c;
    };
    const GOLD = role("gold", PAL.gold || "#ffe08a");
    const GREEN = role("green", PAL.green || "#4cd97b");
    const SKY = role("sky", PAL.sky || "#5ec4ff");
    const RED = role("red", PAL.red || "#ff6464");
    const ORANGE = role("orange", PAL.orange || "#ff9f43");
    const PURPLE = role("purple", PAL.purple || "#b78cff");
    const INK = "#e8efe9";
    const DIM = "#9fb3a8";
    const CARD = "#161d26";
    const PANEL = "#1d2633";
    const EDGE = "#39485c";

    const setT = (node, str) => {
      if (node.textContent !== str) node.textContent = str;
    };

    const defs = el("defs", {}, svg);
    // Cross-hatch pattern for OOB memory zone
    const pat = el("pattern", { id: "ct-oob-hatch", width: 8, height: 8, patternUnits: "userSpaceOnUse", patternTransform: "rotate(45)" }, defs);
    el("line", { x1: 0, y1: 0, x2: 0, y2: 8, stroke: RED, "stroke-width": 2.2, opacity: 0.45 }, pat);

    const root = el("g", {}, svg);
    const gMem = el("g", { opacity: 0 }, root);
    const gLoop = el("g", { opacity: 0 }, root);
    const gArr = el("g", { opacity: 0 }, root);

    // =========================================================
    // SCENE 1: 'memory' (Pipeline + RAM Lockers + ALU)
    // =========================================================
    // 1A. Pipeline [16, 16, 388, 120]
    const pipeG = el("g", {}, gMem);
    el("rect", { x: 18, y: 18, width: 384, height: 108, rx: 10, fill: CARD, stroke: EDGE, "stroke-width": 1.8 }, pipeG);
    tx("1. TRANSLATOR", 30, 36, 12, SKY, pipeG, "start", 800);
    const trModeT = tx("Source → CPU", 390, 36, 12, GOLD, pipeG, "end", 700);

    // 3 boxes: Python [28..132], Translator [154..266], Binary [288..392]
    const pyBox = el("rect", { x: 28, y: 48, width: 104, height: 66, rx: 7, fill: PANEL, stroke: SKY, "stroke-width": 1.6 }, pipeG);
    const trBox = el("rect", { x: 154, y: 48, width: 112, height: 66, rx: 7, fill: PANEL, stroke: GOLD, "stroke-width": 1.8 }, pipeG);
    const binBox = el("rect", { x: 288, y: 48, width: 104, height: 66, rx: 7, fill: PANEL, stroke: GREEN, "stroke-width": 1.6 }, pipeG);

    // Connecting arrows + animated signal dots
    el("path", { d: "M134 81 H150 M146 77 L151 81 L146 85", fill: "none", stroke: DIM, "stroke-width": 2, "stroke-linecap": "round" }, pipeG);
    el("path", { d: "M268 81 H284 M280 77 L285 81 L280 85", fill: "none", stroke: DIM, "stroke-width": 2, "stroke-linecap": "round" }, pipeG);
    const pipeDot1 = el("circle", { cy: 81, r: 3.5, fill: SKY }, pipeG);
    const pipeDot2 = el("circle", { cy: 81, r: 3.5, fill: GREEN }, pipeG);
    const scanLine = el("line", { x1: 162, x2: 258, y1: 60, y2: 60, stroke: GOLD, "stroke-width": 2, opacity: 0.45 }, pipeG);

    const pyHeadT = tx("Python code", 80, 70, 12, DIM, pipeG, "middle", 700);
    const pyCodeT = tx('"150" + 20', 80, 98, 12, INK, pipeG, "middle", 800);
    const trHeadT = tx("Translator", 210, 70, 13, GOLD, pipeG, "middle", 800);
    const trSubT = tx("High → Binary", 210, 98, 12, INK, pipeG, "middle", 700);
    const binHeadT = tx("CPU Binary", 340, 70, 12, DIM, pipeG, "middle", 700);
    const binCodeT = tx("10110001", 340, 98, 13, GREEN, pipeG, "middle", 800);

    // 1B. RAM Lockers [16, 130, 388, 150]
    const ramG = el("g", {}, gMem);
    el("rect", { x: 18, y: 134, width: 384, height: 132, rx: 10, fill: CARD, stroke: EDGE, "stroke-width": 1.8 }, ramG);
    tx("2. RAM LOCKERS", 30, 152, 12, PURPLE, ramG, "start", 800);
    const ramSubLab = tx("Addr · Name · Val", 390, 152, 12, DIM, ramG, "end", 700);

    const lockers = [
      { x: 28, addr: "0x01 · str", name: "raw_str", val: '"150"', col: ORANGE },
      { x: 153, addr: "0x02 · int", name: "offset", val: "20", col: SKY },
      { x: 278, addr: "0x03 · int", name: "total", val: "ERR!", col: GREEN },
    ].map((lk) => {
      const cx = lk.x + 57;
      const box = el("rect", { x: lk.x, y: 162, width: 114, height: 94, rx: 7, fill: PANEL, stroke: lk.col, "stroke-width": 1.8 }, ramG);
      el("line", { x1: lk.x + 8, x2: lk.x + 106, y1: 190, y2: 190, stroke: EDGE, "stroke-width": 1.2 }, ramG);
      const addrT = tx(lk.addr, cx, 180, 12, lk.col, ramG, "middle", 800);
      const nameT = tx(lk.name, cx, 208, 12, DIM, ramG, "middle", 700);
      const valPill = el("rect", { x: lk.x + 14, y: 220, width: 86, height: 26, rx: 5, fill: CARD, stroke: lk.col, "stroke-width": 1.3 }, ramG);
      const valT = tx(lk.val, cx, 238, 13, INK, ramG, "middle", 800);
      return { box, addrT, nameT, valPill, valT };
    });

    // 1C. ALU Box [16, 270, 388, 134]
    const aluG = el("g", {}, gMem);
    const aluFrame = el("rect", { x: 18, y: 274, width: 384, height: 128, rx: 10, fill: CARD, stroke: EDGE, "stroke-width": 2 }, aluG);
    tx("3. ALU ENGINE", 30, 294, 12, GOLD, aluG, "start", 800);
    const aluBadgeT = tx("TYPE CLASH!", 390, 294, 12, RED, aluG, "end", 800);
    const aluLine1 = tx('"150" + 20 → ERR', 210, 326, 13, RED, aluG, "middle", 800);
    const aluLine2 = tx('"200"+"50"="20050"', 210, 356, 12, ORANGE, aluG, "middle", 700);
    const aluLine3 = tx("Fix: int(raw_str)", 210, 386, 12, GREEN, aluG, "middle", 800);

    // =========================================================
    // SCENE 2: 'loop' (Flowchart + Solar Accumulator Trace)
    // =========================================================
    // 2A. Left Flowchart [14, 30, 200, 360]
    const flowG = el("g", {}, gLoop);
    el("rect", { x: 16, y: 32, width: 188, height: 356, rx: 10, fill: CARD, stroke: EDGE, "stroke-width": 1.8 }, flowG);
    tx("LOOP FLOWCHART", 110, 52, 12, SKY, flowG, "middle", 800);

    // Init box
    const initBox = el("rect", { x: 42, y: 66, width: 136, height: 34, rx: 6, fill: PANEL, stroke: SKY, "stroke-width": 1.6 }, flowG);
    const initT = tx("total=0, i=0", 110, 88, 12, INK, flowG, "middle", 700);

    // Arrow Init -> Diamond
    el("path", { d: "M110 100 V116 M106 112 L110 117 L114 112", fill: "none", stroke: DIM, "stroke-width": 1.8 }, flowG);

    // Condition Diamond (cx=110, cy=148)
    const condDia = el("polygon", { points: "110,118 178,148 110,178 42,148", fill: PANEL, stroke: GOLD, "stroke-width": 2 }, flowG);
    const condT = tx("i < 7 ?", 110, 152, 13, GOLD, flowG, "middle", 800);

    // Arrow Diamond -> Body
    el("path", { d: "M110 178 V200 M106 196 L110 201 L114 196", fill: "none", stroke: GREEN, "stroke-width": 1.8 }, flowG);

    // Body Box
    const bodyBox = el("rect", { x: 38, y: 202, width: 144, height: 42, rx: 6, fill: PANEL, stroke: GREEN, "stroke-width": 1.8 }, flowG);
    const bodyT = tx("total += read[i]", 110, 228, 12, INK, flowG, "middle", 800);

    // Arrow Body -> Step
    el("path", { d: "M110 244 V268 M106 264 L110 269 L114 264", fill: "none", stroke: SKY, "stroke-width": 1.8 }, flowG);

    // Step Box
    const stepBox = el("rect", { x: 38, y: 270, width: 144, height: 42, rx: 6, fill: PANEL, stroke: SKY, "stroke-width": 1.8 }, flowG);
    const stepT = tx("i = i + 1", 110, 296, 13, SKY, flowG, "middle", 800);

    // Back-edge curved path from Step bottom (110, 312) -> left (26, 312) -> up (26, 148) -> Diamond left (42, 148)
    const backEdge = el("path", { d: "M110 312 V324 H26 V148 H40 M36 144 L41 148 L36 152", fill: "none", stroke: GOLD, "stroke-width": 2.2, "stroke-dasharray": "5 4", "stroke-linecap": "round", "stroke-linejoin": "round" }, flowG);
    const backDot = el("circle", { r: 4.5, fill: GOLD }, flowG);

    // Bottom status / exit pill
    const exitBox = el("rect", { x: 38, y: 336, width: 144, height: 38, rx: 6, fill: PANEL, stroke: EDGE, "stroke-width": 1.6 }, flowG);
    const exitT = tx("Back-edge jump", 110, 360, 12, GOLD, flowG, "middle", 800);

    // 2B. Right Trace & Solar Bars [206, 30, 200, 360]
    const traceG = el("g", {}, gLoop);
    el("rect", { x: 212, y: 32, width: 192, height: 356, rx: 10, fill: CARD, stroke: EDGE, "stroke-width": 1.8 }, traceG);
    tx("SOLAR TRACE (kWh)", 308, 52, 12, GREEN, traceG, "middle", 800);
    const dayReadT = tx("Day 1: 45 kWh", 308, 82, 12, GOLD, traceG, "middle", 800);

    const SOLAR = [45, 52, 60, 58, 49, 63, 55];
    const CUM = [45, 97, 157, 215, 264, 327, 382];
    const bars = SOLAR.map((val, i) => {
      const bx = 226 + i * 24;
      const bh = Math.round((val / 65) * 62);
      const by = 164 - bh;
      const r = el("rect", { x: bx, y: by, width: 18, height: bh, rx: 3, fill: SKY, stroke: EDGE, "stroke-width": 1.2 }, traceG);
      return { r, bx, by, bh, val };
    });
    const barPtr = el("polygon", { points: "0,0 -5,-8 5,-8", fill: GOLD }, traceG);
    el("line", { x1: 222, x2: 394, y1: 166, y2: 166, stroke: DIM, "stroke-width": 1.4 }, traceG);
    const barAxisLab = tx("Days 0..6 (7 days)", 308, 184, 12, DIM, traceG, "middle", 700);

    // 3 Trace Register Cards
    const reg1Box = el("rect", { x: 222, y: 202, width: 172, height: 46, rx: 6, fill: PANEL, stroke: SKY, "stroke-width": 1.6 }, traceG);
    const reg1T = tx("i = 0 · read = 45", 308, 230, 12, INK, traceG, "middle", 800);

    const reg2Box = el("rect", { x: 222, y: 258, width: 172, height: 50, rx: 6, fill: PANEL, stroke: GREEN, "stroke-width": 1.8 }, traceG);
    const reg2T = tx("total = 45 kWh", 308, 288, 13, GREEN, traceG, "middle", 800);

    const reg3Box = el("rect", { x: 222, y: 318, width: 172, height: 54, rx: 6, fill: PANEL, stroke: GOLD, "stroke-width": 1.6 }, traceG);
    const reg3T = tx("Sum: 45→..→382", 308, 350, 12, GOLD, traceG, "middle", 800);

    // =========================================================
    // SCENE 3: 'array' (Contiguous 8-Slot Rack + OOB + Offset)
    // =========================================================
    // 3A. Top Rack [14, 40, 392, 200] & OOB [260, 40, 150, 200]
    const rackG = el("g", {}, gArr);
    el("rect", { x: 18, y: 40, width: 384, height: 194, rx: 10, fill: CARD, stroke: EDGE, "stroke-width": 1.8 }, rackG);
    tx("CELLS[0..7] (V)", 28, 60, 12, SKY, rackG, "start", 800);
    const oobHeadT = tx("idx 8: OOB!", 392, 60, 12, RED, rackG, "end", 800);

    // Pointer status row at y=86 (left badge + right OOB badge)
    const ptrBadgeT = tx("Ptr → idx 0", 120, 86, 12, GOLD, rackG, "middle", 800);
    const oobBadgeT = tx("End: idx 7", 335, 86, 12, ORANGE, rackG, "middle", 800);

    const CELLS = [3.25, 3.18, 3.30, 2.95, 3.22, 3.15, 3.28, 3.20];
    const slots = [];
    for (let i = 0; i < 9; i++) {
      const sx = 22 + i * 42;
      const isOob = i === 8;
      const isMin = i === 3;
      const box = el("rect", {
        x: sx,
        y: 104,
        width: 38,
        height: 82,
        rx: 5,
        fill: isOob ? "url(#ct-oob-hatch)" : PANEL,
        stroke: isOob ? RED : isMin ? GOLD : SKY,
        "stroke-width": isOob ? 2 : 1.6,
        "stroke-dasharray": isOob ? "4 3" : null,
      }, rackG);
      let fillBar = null;
      if (!isOob) {
        const v = CELLS[i];
        const fh = Math.round(((v - 2.7) / 0.7) * 58);
        fillBar = el("rect", {
          x: sx + 5,
          y: 180 - fh,
          width: 28,
          height: fh,
          rx: 3,
          fill: isMin ? ORANGE : GREEN,
          opacity: 0.32,
        }, rackG);
      }
      slots.push({ box, fillBar, sx, cx: sx + 19 });
    }

    // Animated pointer needle aimed at active slot idx (0..8)
    const needleG = el("g", {}, rackG);
    const needleLine = el("path", { d: "M41 92 V102", stroke: GOLD, "stroke-width": 2.5, "stroke-linecap": "round" }, needleG);
    const needleHead = el("polygon", { points: "0,104 -6,94 6,94", fill: GOLD }, needleG);

    // 3 well-spaced callout labels across the rack (x = 58, 188, 344 -> >130 units apart!)
    const slot0Lab = tx("[0] 3.25", 58, 148, 12, INK, rackG, "middle", 800);
    const slot3Lab = tx("[3] 2.95", 188, 148, 12, GOLD, rackG, "middle", 800);
    const slotEndLab = tx("[7] 3.20", 344, 148, 12, INK, rackG, "middle", 800);

    // Rack footer at y=216
    const baseAddrLab = tx("Base: 0x1000", 28, 216, 12, DIM, rackG, "start", 700);
    const activeSlotT = tx("Slot [0] = 3.25V", 392, 216, 12, GREEN, rackG, "end", 800);

    // 3B. Bottom Offset & Minimum Tracker [14, 240, 392, 160]
    const offG = el("g", {}, gArr);
    const offFrame = el("rect", { x: 18, y: 244, width: 384, height: 152, rx: 10, fill: CARD, stroke: EDGE, "stroke-width": 1.8 }, offG);
    tx("OFFSET FORMULA", 30, 268, 12, PURPLE, offG, "start", 800);
    const sizeLab = tx("4 bytes / float", 390, 268, 12, DIM, offG, "end", 700);

    const offFormulaT = tx("Addr = 0x1000+i×4", 210, 300, 13, SKY, offG, "middle", 800);
    const offCalcT = tx("0x1000+0×4=0x1000", 210, 332, 13, GOLD, offG, "middle", 800);

    const minPill = el("rect", { x: 60, y: 348, width: 300, height: 34, rx: 8, fill: PANEL, stroke: GREEN, "stroke-width": 1.8 }, offG);
    const minTrackT = tx("Valid idx: 0..7", 210, 370, 13, GREEN, offG, "middle", 800);

    // Focus highlight ring (drawn on top)
    const ring = el("rect", {
      fill: "none",
      stroke: GOLD,
      "stroke-width": 3,
      "stroke-dasharray": "7 6",
      rx: 12,
      opacity: 0,
    }, root);

    const FOCUS_BOX = {
      pipeline: [16, 16, 388, 120],
      ram: [16, 130, 388, 150],
      alu: [16, 270, 388, 134],
      flowchart: [14, 30, 200, 360],
      trace: [206, 30, 200, 360],
      rack: [14, 40, 392, 200],
      offset: [14, 240, 392, 160],
      oob: [260, 40, 150, 200],
    };

    // Back-edge path helper for animated pulse dot
    const backPts = [
      [110, 312],
      [110, 324],
      [26, 324],
      [26, 148],
      [42, 148],
    ];
    const backSegs = [];
    let backLen = 0;
    for (let i = 1; i < backPts.length; i++) {
      const d = Math.hypot(backPts[i][0] - backPts[i - 1][0], backPts[i][1] - backPts[i - 1][1]);
      backSegs.push(d);
      backLen += d;
    }
    const pointOnBackEdge = (u01) => {
      let d = frac(u01) * backLen;
      for (let i = 0; i < backSegs.length; i++) {
        if (d <= backSegs[i] || i === backSegs.length - 1) {
          const f = backSegs[i] > 0 ? d / backSegs[i] : 0;
          return [
            lerp(backPts[i][0], backPts[i + 1][0], f),
            lerp(backPts[i][1], backPts[i + 1][1], f),
          ];
        }
        d -= backSegs[i];
      }
      return backPts[0];
    };

    return {
      draw(t, P) {
        const s = P.s || {};
        const p = P.p || s;
        const u = P.u == null ? 1 : P.u;

        const scS = ["memory", "loop", "array"].includes(s.scene) ? s.scene : "memory";
        const scP = ["memory", "loop", "array"].includes(p.scene) ? p.scene : scS;

        // Non-overlapping crossfade so two scenes never exceed 0.3 opacity simultaneously
        const sceneOp = (name) => {
          if (scP === scS) return scS === name ? 1 : 0;
          if (name === scP) return clamp(1 - 2.4 * u, 0, 1);
          if (name === scS) return clamp(2.4 * u - 1.4, 0, 1);
          return 0;
        };

        const opMem = sceneOp("memory");
        const opLoop = sceneOp("loop");
        const opArr = sceneOp("array");
        gMem.setAttribute("opacity", opMem.toFixed(3));
        gLoop.setAttribute("opacity", opLoop.toFixed(3));
        gArr.setAttribute("opacity", opArr.toFixed(3));

        const stage = mixN(p, s, "stage", u, 4);
        const labelsOn = mixN(p, s, "labels", u, 1);

        // ---------------------------------------------------------
        // Update Scene 1: 'memory'
        // ---------------------------------------------------------
        if (opMem > 0.01) {
          const tr = s.translator || "none";
          const cast = Math.round(mixN(p, s, "cast", u, 0));
          const prec = Math.round(mixN(p, s, "prec", u, 0));

          if (tr === "compiler") {
            setT(trModeT, "Compiler: batch");
            setT(trHeadT, "Compiler");
            setT(trSubT, "All at once");
            scanLine.setAttribute("y1", (56 + ((t * 28) % 50)).toFixed(1));
            scanLine.setAttribute("y2", (56 + ((t * 28) % 50)).toFixed(1));
            scanLine.setAttribute("opacity", "0.65");
          } else if (tr === "interpreter") {
            setT(trModeT, "Interp: line");
            setT(trHeadT, "Interpreter");
            setT(trSubT, "Line by line");
            const rowY = 62 + Math.floor((t * 2) % 3) * 16;
            scanLine.setAttribute("y1", rowY);
            scanLine.setAttribute("y2", rowY);
            scanLine.setAttribute("opacity", "0.85");
          } else {
            setT(trModeT, "Source → CPU");
            setT(trHeadT, "Translator");
            setT(trSubT, "High → Binary");
            scanLine.setAttribute("opacity", "0.2");
          }

          if (prec === 1) {
            setT(pyCodeT, "12+8*2-6/2");
            setT(binCodeT, "00011001");
          } else if (cast === 1) {
            setT(pyCodeT, 'int("150")+20');
            setT(binCodeT, "10101010");
          } else {
            setT(pyCodeT, '"150" + 20');
            setT(binCodeT, "10110001");
          }

          // Animated signal dots along pipeline arrows
          const d1x = lerp(134, 152, frac(t * 0.9));
          const d2x = lerp(268, 286, frac(t * 0.9 + 0.5));
          pipeDot1.setAttribute("cx", d1x.toFixed(1));
          pipeDot2.setAttribute("cx", d2x.toFixed(1));

          // RAM lockers
          ramSubLab.setAttribute("opacity", labelsOn.toFixed(2));
          const ramAlpha = clamp(0.35 + 0.65 * clamp(stage, 0, 1), 0.35, 1);
          ramG.setAttribute("opacity", ramAlpha.toFixed(2));

          if (cast === 1) {
            setT(lockers[0].addrT, "0x01 · int");
            setT(lockers[0].valT, "150");
            lockers[0].box.setAttribute("stroke", GREEN);
            lockers[0].valPill.setAttribute("stroke", GREEN);
          } else {
            setT(lockers[0].addrT, "0x01 · str");
            setT(lockers[0].valT, '"150"');
            lockers[0].box.setAttribute("stroke", ORANGE);
            lockers[0].valPill.setAttribute("stroke", ORANGE);
          }

          if (prec === 1) {
            setT(lockers[2].addrT, "0x03 · int");
            setT(lockers[2].valT, "25");
            lockers[2].box.setAttribute("stroke", GOLD);
            lockers[2].valPill.setAttribute("stroke", GOLD);
          } else if (cast === 1) {
            setT(lockers[2].addrT, "0x03 · int");
            setT(lockers[2].valT, "170");
            lockers[2].box.setAttribute("stroke", GREEN);
            lockers[2].valPill.setAttribute("stroke", GREEN);
          } else {
            setT(lockers[2].addrT, "0x03 · err");
            setT(lockers[2].valT, "TypeError!");
            lockers[2].box.setAttribute("stroke", RED);
            lockers[2].valPill.setAttribute("stroke", RED);
          }

          // ALU operation box
          const aluAlpha = clamp(0.35 + 0.65 * clamp(stage - 1, 0, 1), 0.35, 1);
          aluG.setAttribute("opacity", aluAlpha.toFixed(2));
          if (prec === 1) {
            aluFrame.setAttribute("stroke", GOLD);
            setT(aluBadgeT, "BODMAS order");
            aluBadgeT.setAttribute("fill", GOLD);
            setT(aluLine1, "12 + 8×2 − 6÷2");
            aluLine1.setAttribute("fill", INK);
            setT(aluLine2, "= 12 + 16 − 3");
            aluLine2.setAttribute("fill", SKY);
            setT(aluLine3, "Result = 25");
            aluLine3.setAttribute("fill", GREEN);
          } else if (cast === 1) {
            aluFrame.setAttribute("stroke", GREEN);
            setT(aluBadgeT, "INT ADD OK");
            aluBadgeT.setAttribute("fill", GREEN);
            setT(aluLine1, 'int("150") + 20');
            aluLine1.setAttribute("fill", INK);
            setT(aluLine2, "150 + 20 = 170");
            aluLine2.setAttribute("fill", GREEN);
            setT(aluLine3, "200 + 50 = 250");
            aluLine3.setAttribute("fill", SKY);
          } else {
            aluFrame.setAttribute("stroke", RED);
            setT(aluBadgeT, "TYPE CLASH!");
            aluBadgeT.setAttribute("fill", RED);
            setT(aluLine1, '"150" + 20 → ERR');
            aluLine1.setAttribute("fill", RED);
            setT(aluLine2, '"200"+"50"="20050"');
            aluLine2.setAttribute("fill", ORANGE);
            setT(aluLine3, "Fix: int(raw_str)");
            aluLine3.setAttribute("fill", GREEN);
          }
          pyHeadT.setAttribute("opacity", labelsOn.toFixed(2));
          binHeadT.setAttribute("opacity", labelsOn.toFixed(2));
        }

        // ---------------------------------------------------------
        // Update Scene 2: 'loop'
        // ---------------------------------------------------------
        if (opLoop > 0.01) {
          const stepNum = clamp(Math.round(mixN(p, s, "step", u, 0)), 0, 7);
          const bug = Math.round(mixN(p, s, "bug", u, 0));

          // Back-edge dot animation
          const speed = bug === 1 ? 1.6 : stepNum >= 7 ? 0 : 0.65;
          const [bx, by] = pointOnBackEdge(t * speed);
          backDot.setAttribute("cx", bx.toFixed(1));
          backDot.setAttribute("cy", by.toFixed(1));
          backDot.setAttribute("opacity", stepNum >= 7 && bug === 0 ? "0" : "1");
          backEdge.setAttribute("stroke", bug === 1 ? RED : stepNum >= 7 ? DIM : GOLD);

          if (bug === 1) {
            setT(initT, "count = 1");
            setT(condT, "count <= 5 ?");
            condDia.setAttribute("stroke", RED);
            setT(bodyT, "print(count)");
            stepBox.setAttribute("stroke", RED);
            stepBox.setAttribute("stroke-dasharray", "5 3");
            setT(stepT, "NO STEP! (bug)");
            stepT.setAttribute("fill", RED);
            exitBox.setAttribute("stroke", RED);
            setT(exitT, "INFINITE LOOP!");
            exitT.setAttribute("fill", RED);

            setT(dayReadT, "Runaway loop!");
            dayReadT.setAttribute("fill", RED);
            setT(reg1T, "count = 1 (stuck)");
            reg1Box.setAttribute("stroke", RED);
            setT(reg2T, "CPU 99% · FROZEN");
            reg2T.setAttribute("fill", RED);
            reg2Box.setAttribute("stroke", RED);
            setT(reg3T, "Missing count+=1");
            reg3T.setAttribute("fill", ORANGE);
            reg3Box.setAttribute("stroke", RED);
          } else {
            setT(initT, "total=0, i=0");
            setT(condT, "i < 7 ?");
            condDia.setAttribute("stroke", stepNum >= 7 ? GREEN : GOLD);
            setT(bodyT, "total += read[i]");
            stepBox.setAttribute("stroke", SKY);
            stepBox.removeAttribute("stroke-dasharray");
            setT(stepT, "i = i + 1");
            stepT.setAttribute("fill", SKY);

            if (stepNum >= 7) {
              exitBox.setAttribute("stroke", GREEN);
              setT(exitT, "Exit: i = 7");
              exitT.setAttribute("fill", GREEN);
              setT(dayReadT, "7 days: 382 kWh");
              dayReadT.setAttribute("fill", GREEN);
              setT(reg1T, "i = 7 · loop done");
              reg1Box.setAttribute("stroke", GREEN);
              setT(reg2T, "total = 382 kWh");
              reg2T.setAttribute("fill", GREEN);
              reg2Box.setAttribute("stroke", GREEN);
              setT(reg3T, "Mean = 54.57 kWh");
              reg3T.setAttribute("fill", GOLD);
              reg3Box.setAttribute("stroke", GOLD);
            } else {
              const curVal = SOLAR[stepNum];
              const curSum = CUM[stepNum];
              exitBox.setAttribute("stroke", GOLD);
              setT(exitT, "Back-edge jump");
              exitT.setAttribute("fill", GOLD);
              setT(dayReadT, `Day ${stepNum + 1}: ${curVal} kWh`);
              dayReadT.setAttribute("fill", GOLD);
              setT(reg1T, `i = ${stepNum} · read = ${curVal}`);
              reg1Box.setAttribute("stroke", SKY);
              setT(reg2T, `total = ${curSum} kWh`);
              reg2T.setAttribute("fill", GREEN);
              reg2Box.setAttribute("stroke", GREEN);
              setT(reg3T, `Sum: 45→..→${curSum}`);
              reg3T.setAttribute("fill", GOLD);
              reg3Box.setAttribute("stroke", EDGE);
            }
          }

          // Highlight solar bars up to stepNum
          const activeBarIdx = clamp(stepNum, 0, 6);
          bars.forEach((b, i) => {
            if (bug === 1) {
              b.r.setAttribute("fill", i === 0 ? RED : PANEL);
              b.r.setAttribute("stroke", RED);
            } else if (stepNum >= 7) {
              b.r.setAttribute("fill", GREEN);
              b.r.setAttribute("stroke", GREEN);
            } else if (i === activeBarIdx) {
              b.r.setAttribute("fill", GOLD);
              b.r.setAttribute("stroke", GOLD);
            } else if (i < activeBarIdx) {
              b.r.setAttribute("fill", GREEN);
              b.r.setAttribute("stroke", SKY);
            } else {
              b.r.setAttribute("fill", PANEL);
              b.r.setAttribute("stroke", EDGE);
            }
          });
          const ptrX = bars[activeBarIdx].bx + 9;
          barPtr.setAttribute("transform", `translate(${ptrX} 176)`);
          barAxisLab.setAttribute("opacity", labelsOn.toFixed(2));
        }

        // ---------------------------------------------------------
        // Update Scene 3: 'array'
        // ---------------------------------------------------------
        if (opArr > 0.01) {
          const idxFloat = clamp(mixN(p, s, "idx", u, 0), 0, 8);
          const idxRound = clamp(Math.round(idxFloat), 0, 8);
          const oob = Math.round(mixN(p, s, "oob", u, 0)) === 1 || idxRound === 8;
          const minTrack = Math.round(mixN(p, s, "minTrack", u, 0)) === 1;

          // Smooth pointer needle x
          const needleX = 22 + idxFloat * 42 + 19;
          needleHead.setAttribute("transform", `translate(${needleX.toFixed(1)} 0)`);
          needleLine.setAttribute("d", `M${needleX.toFixed(1)} 92 V102`);
          const needleCol = oob ? RED : idxRound === 3 ? GOLD : SKY;
          needleHead.setAttribute("fill", needleCol);
          needleLine.setAttribute("stroke", needleCol);

          setT(ptrBadgeT, `Ptr → idx ${idxRound}`);
          ptrBadgeT.setAttribute("fill", needleCol);

          if (oob) {
            setT(oobBadgeT, "0x1020 CRASH");
            oobBadgeT.setAttribute("fill", RED);
            setT(slotEndLab, "[8] ERR!");
            slotEndLab.setAttribute("fill", RED);
            setT(activeSlotT, "idx 8: IndexError");
            activeSlotT.setAttribute("fill", RED);
          } else {
            setT(oobBadgeT, "End: idx 7");
            oobBadgeT.setAttribute("fill", ORANGE);
            setT(slotEndLab, "[7] 3.20");
            slotEndLab.setAttribute("fill", INK);
            setT(activeSlotT, `Slot [${idxRound}] = ${CELLS[idxRound].toFixed(2)}V`);
            activeSlotT.setAttribute("fill", idxRound === 3 ? GOLD : GREEN);
          }

          slots.forEach((sl, i) => {
            const active = i === idxRound;
            if (i === 8) {
              sl.box.setAttribute("stroke-width", active || oob ? "2.8" : "1.8");
            } else {
              sl.box.setAttribute("stroke", active ? GOLD : i === 3 && minTrack ? ORANGE : SKY);
              sl.box.setAttribute("stroke-width", active ? "2.6" : "1.5");
            }
          });

          // Offset formula & calculation
          const addrHex = (0x1000 + idxRound * 4).toString(16).toUpperCase();
          setT(offFormulaT, "Addr = 0x1000+i×4");
          if (oob) {
            offFrame.setAttribute("stroke", RED);
            setT(offCalcT, "0x1020 IndexError");
            offCalcT.setAttribute("fill", RED);
            minPill.setAttribute("stroke", RED);
            setT(minTrackT, "IndexError: i=8");
            minTrackT.setAttribute("fill", RED);
          } else {
            offFrame.setAttribute("stroke", EDGE);
            setT(offCalcT, `0x1000+${idxRound}×4=0x${addrHex}`);
            offCalcT.setAttribute("fill", GOLD);
            if (minTrack) {
              minPill.setAttribute("stroke", GOLD);
              setT(minTrackT, "min=2.95V @ idx 3");
              minTrackT.setAttribute("fill", GOLD);
            } else {
              minPill.setAttribute("stroke", GREEN);
              setT(minTrackT, "Valid idx: 0..7");
              minTrackT.setAttribute("fill", GREEN);
            }
          }

          baseAddrLab.setAttribute("opacity", labelsOn.toFixed(2));
          sizeLab.setAttribute("opacity", labelsOn.toFixed(2));
          slot0Lab.setAttribute("opacity", labelsOn.toFixed(2));
          slot3Lab.setAttribute("opacity", labelsOn.toFixed(2));
          slotEndLab.setAttribute("opacity", labelsOn.toFixed(2));
        }

        // ---------------------------------------------------------
        // Focus Ring
        // ---------------------------------------------------------
        const f = s.focus && FOCUS_BOX[s.focus] ? FOCUS_BOX[s.focus] : null;
        if (f) {
          ring.setAttribute("x", f[0]);
          ring.setAttribute("y", f[1]);
          ring.setAttribute("width", f[2]);
          ring.setAttribute("height", f[3]);
          ring.setAttribute("opacity", (0.65 + 0.35 * Math.sin(t * 5)).toFixed(2));
          ring.setAttribute("stroke-dashoffset", ((t * 18) % 13).toFixed(1));
        } else {
          ring.setAttribute("opacity", "0");
        }
      },
    };
  },
};
