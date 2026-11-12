/* =========================================================
   StudyPipe explainer-video kit · membrane-transport
   Three scenes in one kit (state `scene`, cross-fades like kits/video/blood):
   - 'membrane': one tank split by a membrane. mode 'diffusion' (no barrier; solute dots spread crowded → even and keep
     jiggling), 'osmosis' (selectively permeable membrane with pores; water dots cross BOTH ways, more left → right; sugar dots
     are too big for the pores and never cross; the concentrated side's level rises), 'active' (pores closed; one carrier
     protein moves an ion from the scarce side to the plentiful side, changing shape, with an ATP → ADP spark each cycle).
   - 'cells': a plant cell (cellulose wall, membrane, cytoplasm, sap vacuole + tonoplast, nucleus, chloroplasts) and a red cell
     (biconcave, no nucleus, NO wall) in one bath. hypo → turgid (wall bulges, never bursts) | swells and bursts (haemolysis);
     iso → flaccid | normal; hyper → plasmolysed (membrane pulls off the wall, gap filled with the bath) | crenated.
   - 'strip': potato strip in a boiling tube of sucrose (conc label), top-pan balance (mass, 2 d.p.), strip size from % change.
   Contract: .agents/skills/explainer-video/references/adding-a-kit.md · every frame is a pure function of (t, P).
   ========================================================= */
(window.VIDEO_KITS = window.VIDEO_KITS || {})["membrane-transport"] = {
  title: "Membrane transport: diffusion, osmosis, active transport; cells in solutions; potato-strip osmometer",
  states: {
    scene: "'membrane' | 'cells' | 'strip' (cross-fades)",
    mode: "membrane scene: 'diffusion' | 'osmosis' | 'active'",
    spread: "membrane/diffusion, 0–1: solute crowded on the left → evenly spread (dots keep jiggling at 1)",
    level: "membrane/osmosis, 0–1: right (concentrated) level rises, left level falls; 0 = equal levels",
    flow: "membrane, 0/1 (default 1): molecules moving; 0 freezes all motion and crossing (a 'predict first' moment)",
    arrows: "0/1: net-movement arrows (membrane: left → right in every mode; cells: water in / both ways / out; strip: water into or out of the strip)",
    pump: "membrane/active, 0/1 (default 0): carrier cycles, one ion crosses scarce → plentiful per cycle with an ATP → ADP spark; 0 = nothing crosses",
    labels: "0/1: part labels in the current scene",
    solution: "cells: 'hypo' | 'iso' | 'hyper' (a change resets both cells to normal and replays progress from 0)",
    progress: "cells, 0–1: how far the change has gone (the red cell bursts only above 0.85 in hypo)",
    plant: "cells, 0/1 (default 1): show the plant cell",
    rbc: "cells, 0/1 (default 1): show the red blood cell",
    terms: "cells, 0/1: state word under each cell (turgid / flaccid / plasmolysed · haemolysis / normal / crenated)",
    conc: "strip: sucrose concentration in mol dm⁻³, shown on the tube label to 1 d.p.",
    mass: "strip: balance reading in g, 2 d.p. (counts smoothly between values)",
    change: "strip: % change in mass, −20 … +20 (+ longer and firmer, − shorter and limp, 0 unchanged)",
    onBalance: "strip, 0/1: the strip is lifted out of the tube onto the balance pan",
    focus: "ring a part: 'membrane' 'pore' 'pump' 'left' 'right' · 'plant' 'rbc' 'wall' 'bath' · 'tube' 'strip' 'balance' · null",
  },
  focus: {
    membrane: [146, 88, 128, 286], pore: [158, 214, 112, 104], pump: [126, 138, 168, 162], left: [4, 6, 212, 406], right: [204, 6, 212, 406],
    plant: [14, 56, 202, 300], rbc: [212, 56, 204, 300], wall: [18, 62, 172, 128], bath: [96, 2, 228, 74],
    tube: [16, 22, 172, 366], strip: [36, 110, 128, 196], balance: [226, 170, 190, 216],
  },
  create(svg, api) {
    const { el, tx, mixN, clamp, lerp, ease, frac, PAL, C } = api;
    // ---------- palette (theme palette via api.PAL / api.C; neutrals as in the reference kits) ----------
    const hex = h => { const s = String(h).replace("#", ""); return [0, 2, 4].map(i => parseInt(s.slice(i, i + 2), 16) || 0); };
    const mixC = (a, b, k) => "#" + hex(a).map((v, i) => Math.round(v + (hex(b)[i] - v) * k).toString(16).padStart(2, "0")).join("");
    const rgba = (h, a) => { const [r, g, b] = hex(h); return `rgba(${r},${g},${b},${a})`; };
    const INK = "#0e1319", HALO = "#141a22";
    const WATER = PAL.sky, SOLUTE = PAL.amber, ION = PAL.purple, ATP = PAL.gold, LAB = C.wire, DIM = C.dim;
    const WALLC = mixC(mixC(PAL.green, PAL.orange, .45), INK, .12), RBC = mixC(PAL.red, INK, .22), RBC_L = mixC(PAL.red, PAL.white, .18);
    const MEM = C.wire, GLASS = rgba(PAL.white, .06);
    const n1 = v => Math.round(v * 10) / 10;
    const rnd = (() => { let a = 11; return () => { a = (a * 9301 + 49297) % 233280; return a / 233280; }; })();
    const lab = (s, x, y, size, fill, parent, anchor = "middle", w = 800) => {      // label with a dark halo (readable over drawings)
      const e = tx(s, x, y, size, fill, parent, anchor, w);
      e.setAttribute("stroke", HALO); e.setAttribute("stroke-width", 4); e.setAttribute("paint-order", "stroke"); e.setAttribute("stroke-linejoin", "round");
      return e;
    };
    const arrowD = (x1, y1, x2, y2, h = 7, both = false) => {
      const a = Math.atan2(y2 - y1, x2 - x1), hd = (x, y, ang) => `M${n1(x - h * Math.cos(ang - .5))} ${n1(y - h * Math.sin(ang - .5))} L${n1(x)} ${n1(y)} L${n1(x - h * Math.cos(ang + .5))} ${n1(y - h * Math.sin(ang + .5))}`;
      return `M${n1(x1)} ${n1(y1)} L${n1(x2)} ${n1(y2)} ` + hd(x2, y2, a) + (both ? " " + hd(x1, y1, a + Math.PI) : "");
    };
    const box = (x0, y0, x1, y1, r, b) => {     // rounded rect whose sides bulge outward by b (turgor)
      r = Math.max(0, Math.min(r, (x1 - x0) / 2, (y1 - y0) / 2)); const mx = (x0 + x1) / 2, my = (y0 + y1) / 2, q = 2 * b;
      return `M${n1(x0 + r)} ${n1(y0)} Q${n1(mx)} ${n1(y0 - q)} ${n1(x1 - r)} ${n1(y0)} Q${n1(x1)} ${n1(y0)} ${n1(x1)} ${n1(y0 + r)} Q${n1(x1 + q)} ${n1(my)} ${n1(x1)} ${n1(y1 - r)} ` +
        `Q${n1(x1)} ${n1(y1)} ${n1(x1 - r)} ${n1(y1)} Q${n1(mx)} ${n1(y1 + q)} ${n1(x0 + r)} ${n1(y1)} Q${n1(x0)} ${n1(y1)} ${n1(x0)} ${n1(y1 - r)} Q${n1(x0 - q)} ${n1(my)} ${n1(x0)} ${n1(y0 + r)} Q${n1(x0)} ${n1(y0)} ${n1(x0 + r)} ${n1(y0)} Z`;
    };
    const jig = (o, t, a) => [a * Math.sin(t * o.w1 + o.p1), a * Math.sin(t * o.w2 + o.p2)];
    const wob = () => ({ w1: .9 + rnd() * 1.6, w2: .7 + rnd() * 1.5, p1: rnd() * 6.283, p2: rnd() * 6.283 });
    const fade = (g, v) => g.setAttribute("opacity", clamp(v, 0, 1).toFixed(3));

    const scenes = { membrane: el("g", {}, svg), cells: el("g", {}, svg), strip: el("g", {}, svg) };
    const ring = el("ellipse", { fill: "none", stroke: PAL.gold, "stroke-width": 3, "stroke-dasharray": "7 6", opacity: 0 }, svg);

    // =====================================================================
    // scene: membrane
    // =====================================================================
    const M = scenes.membrane;
    const VX0 = 16, VX1 = 404, VY0 = 84, VY1 = 362, MX = 210, BASE = 140, DL = 30, PY = [196, 246, 296, 340];
    const liqL = el("rect", { x: VX0 + 2, width: MX - VX0 - 2, fill: rgba(WATER, .13) }, M);
    const liqR = el("rect", { x: MX, width: VX1 - 2 - MX, fill: rgba(WATER, .13) }, M);
    const liqRS = el("rect", { x: MX, width: VX1 - 2 - MX, fill: rgba(SOLUTE, .10) }, M);         // concentrated side tint (osmosis)
    const startLine = el("line", { x1: VX0 + 4, x2: VX1 - 4, y1: BASE, y2: BASE, stroke: DIM, "stroke-width": 1.5, "stroke-dasharray": "5 6", opacity: 0 }, M);
    el("path", { d: `M${VX0} ${VY0} V${VY1 - 16} Q${VX0} ${VY1} ${VX0 + 16} ${VY1} H${VX1 - 16} Q${VX1} ${VY1} ${VX1} ${VY1 - 16} V${VY0}`, fill: GLASS, stroke: LAB, "stroke-width": 3 }, M);
    // membrane: a wall with pores (gaps) and lipid heads on both faces
    const memG = el("g", {}, M);
    const gaps = PY.map(y => [y - 7, y + 7]), runs = []; let y0m = VY0 + 2;
    gaps.forEach(([a, b]) => { runs.push([y0m, a]); y0m = b; }); runs.push([y0m, VY1 - 2]);
    runs.forEach(([a, b]) => {
      el("rect", { x: MX - 7, y: a, width: 14, height: b - a, rx: 4, fill: rgba(MEM, .55) }, memG);
      for (let y = a + 4; y <= b - 3; y += 8) { el("circle", { cx: MX - 6, cy: y, r: 3, fill: MEM }, memG); el("circle", { cx: MX + 6, cy: y, r: 3, fill: MEM }, memG); }
    });
    const plugs = el("g", {}, memG);                                                            // active mode: no open pores
    PY.forEach(y => el("rect", { x: MX - 7, y: y - 8, width: 14, height: 16, fill: rgba(MEM, .55) }, plugs));
    // particles
    const yIn = (fy, top) => top + 12 + fy * (VY1 - 24 - top);
    const resid = (n, xa, xb, r, fill, parent) => Array.from({ length: n }, (_, i) => Object.assign({ e: el("circle", { r, fill }, parent), fx: xa + rnd() * (xb - xa), fy: (i + .1 + rnd() * .8) / n }, wob()));
    const gD = el("g", {}, M), gO = el("g", {}, M), gA = el("g", {}, M);
    const diff = Array.from({ length: 30 }, (_, i) => Object.assign({ e: el("circle", { r: 6, fill: SOLUTE }, gD), sx: 30 + rnd() * 92, ex: 30 + (i + .1 + rnd() * .8) / 30 * 362, fy: rnd(), fy2: rnd() }, wob()));
    const wL = resid(24, 30, 168, 4.5, WATER, gO), wR = resid(10, 258, 390, 4.5, WATER, gO), sug = resid(9, 264, 386, 10, SOLUTE, gO);
    const bounce = [[2, 0], [3, .5]].map(([pi, ph]) => ({ e: el("circle", { r: 10, fill: SOLUTE }, gO), py: PY[pi], ph }));
    const CR = [[1, 0, 0], [1, 1, .17], [1, 2, .33], [1, 3, .5], [1, 1, .67], [1, 2, .83], [-1, 1, .25], [-1, 3, .75]];   // 6 left→right, 2 right→left: net flow L → R
    const cross = CR.map(([dir, pi, ph]) => Object.assign({ e: el("circle", { r: 4.5, fill: WATER }, gO), dir, py: PY[pi], ph,
      a: [rnd(), pi === 1 ? .62 + rnd() * .36 : rnd()], d: [rnd(), pi === 1 ? .62 + rnd() * .36 : rnd()] }, wob()));
    const ionL = resid(5, 30, 164, 6, ION, gA), ionR = resid(16, 258, 390, 6, ION, gA);
    const ionT = el("circle", { r: 6, fill: ION, stroke: PAL.white, "stroke-width": 1.5 }, gA);
    // carrier protein (two lobes forming a channel that opens to one side at a time)
    const carG = el("g", {}, M);
    const lobeT = el("path", { fill: mixC(ION, INK, .5), stroke: ION, "stroke-width": 3, "stroke-linejoin": "round" }, carG);
    const lobeB = el("path", { fill: mixC(ION, INK, .5), stroke: ION, "stroke-width": 3, "stroke-linejoin": "round" }, carG);
    const sparkG = el("g", {}, M);
    for (let i = 0; i < 8; i++) { const a = i / 8 * 6.283; el("line", { x1: n1(242 + Math.cos(a) * 5), y1: n1(204 + Math.sin(a) * 5), x2: n1(242 + Math.cos(a) * 13), y2: n1(204 + Math.sin(a) * 13), stroke: ATP, "stroke-width": 3, "stroke-linecap": "round" }, sparkG); }
    el("circle", { cx: 242, cy: 204, r: 4, fill: ATP }, sparkG);
    const atpT = lab("ATP → ADP", 210, 174, 13, ATP, M, "middle", 900);
    // net arrow (left → right in every mode)
    const netA = el("path", { d: arrowD(148, 66, 268, 66, 10), stroke: SOLUTE, "stroke-width": 4, fill: "none", "stroke-linecap": "round" }, M);
    const netT = lab("against gradient", 210, 44, 14, ION, M, "middle", 800);
    // labels per mode
    const LD = el("g", {}, M), LO = el("g", {}, M), LA = el("g", {}, M), LM = el("g", {}, M);
    const crowdT = tx("crowded", 80, 24, 15, SOLUTE, LD, "middle", 800), fewT = tx("fewer", 340, 24, 15, SOLUTE, LD, "middle", 800);
    const evenT = tx("evenly spread", 210, 24, 15, SOLUTE, LD, "middle", 800);
    el("circle", { cx: 34, cy: 392, r: 6, fill: SOLUTE }, LD); tx("particles", 46, 392, 13, LAB, LD, "start", 700);
    tx("dilute", 80, 24, 15, WATER, LO, "middle", 800); tx("more water", 80, 46, 12, DIM, LO, "middle", 700);
    tx("concentrated", 340, 24, 15, SOLUTE, LO, "middle", 800); tx("less water", 340, 46, 12, DIM, LO, "middle", 700);
    el("circle", { cx: 34, cy: 392, r: 5, fill: WATER }, LO); tx("water", 46, 392, 13, LAB, LO, "start", 700);
    el("circle", { cx: 320, cy: 392, r: 10, fill: SOLUTE }, LO); tx("sugar", 336, 392, 13, LAB, LO, "start", 700);
    lab("pore", 237, 228, 13, LAB, LO, "middle", 800);
    tx("outside", 80, 24, 15, ION, LA, "middle", 800); tx("few ions", 80, 46, 12, DIM, LA, "middle", 700);
    tx("inside", 340, 24, 15, ION, LA, "middle", 800); tx("many ions", 340, 46, 12, DIM, LA, "middle", 700);
    el("circle", { cx: 34, cy: 392, r: 6, fill: ION }, LA); tx("ions", 46, 392, 13, LAB, LA, "start", 700);
    lab("carrier", 210, 284, 13, ION, LA, "middle", 800);
    tx("membrane", 210, 392, 13, LAB, LM, "middle", 800);
    const MODES = ["diffusion", "osmosis", "active"];

    // =====================================================================
    // scene: cells
    // =====================================================================
    const K = scenes.cells;
    const bath = el("rect", { x: 10, y: 46, width: 400, height: 340, rx: 18, stroke: rgba(LAB, .35), "stroke-width": 2 }, K);
    const bathLab = tx("", 210, 24, 17, LAB, K, "middle", 900);
    const speckG = el("g", {}, K), speckP = el("g", {}, speckG), specks = [];
    for (let i = 0; i < 44; i++) {
      const inPlant = i < 16, x = inPlant ? 46 + rnd() * 128 : 18 + rnd() * 384, y = inPlant ? 112 + rnd() * 176 : 100 + rnd() * 210;
      specks.push(Object.assign({ e: el("circle", { r: 2.6, fill: SOLUTE }, inPlant ? speckP : speckG), x, y }, wob()));
    }
    // plant cell
    const PG = el("g", {}, K), W0 = { x0: 35, y0: 100, x1: 185, y1: 300 };
    const proto = el("path", { fill: mixC(PAL.green, INK, .78), stroke: LAB, "stroke-width": 2 }, PG);
    const vac = el("path", { fill: mixC(WATER, INK, .66), stroke: DIM, "stroke-width": 1.5 }, PG);
    const nuc = el("circle", { r: 9, fill: mixC(ION, INK, .3), stroke: ION, "stroke-width": 1.5 }, PG);
    const chl = [0, 1, 2, 3].map(() => el("ellipse", { rx: 7, ry: 3.5, fill: PAL.green }, PG));
    const wall = el("path", { fill: "none", stroke: WALLC, "stroke-width": 9, "stroke-linejoin": "round" }, PG);
    const PL = el("g", {}, PG);
    tx("cell wall", 66, 78, 13, WALLC, PL, "middle", 800); el("line", { x1: 66, y1: 86, x2: 66, y2: 98, stroke: WALLC, "stroke-width": 2 }, PL);
    tx("membrane", 152, 78, 13, LAB, PL, "middle", 800); const memLead = el("line", { x1: 152, y1: 86, x2: 152, y2: 108, stroke: LAB, "stroke-width": 2 }, PL);
    const vacT = lab("vacuole", 120, 200, 13, LAB, PL, "middle", 800);
    // red cell
    const RG = el("g", {}, K), RC = [315, 200];
    const hb = [[0, 0], [-22, 14], [20, -16], [16, 22], [-18, -18]].map(([dx, dy]) => el("circle", { cx: RC[0] + dx, cy: RC[1] + dy, fill: RBC, opacity: 0 }, RG));
    const rbcBody = el("g", {}, RG);
    const rbcPath = el("path", { fill: RBC, stroke: RBC_L, "stroke-width": 2 }, rbcBody);
    const rbcPale = el("circle", { cx: RC[0], cy: RC[1], fill: RBC_L, opacity: .55 }, rbcBody);
    const frags = [0, 1, 2, 3, 4, 5].map(i => ({ e: el("path", { fill: "none", stroke: RBC_L, "stroke-width": 3, "stroke-linecap": "round", opacity: 0 }, RG), a: i / 6 * 6.283 + .3 }));
    const RL = el("g", {}, RG);
    tx("red cell", 278, 78, 13, RBC_L, RL, "middle", 800); el("line", { x1: 284, y1: 86, x2: 298, y2: 144, stroke: RBC_L, "stroke-width": 2 }, RL);
    tx("no wall", 372, 78, 13, LAB, RL, "middle", 800); el("line", { x1: 368, y1: 86, x2: 358, y2: 154, stroke: LAB, "stroke-width": 2 }, RL);
    // water crossing paths: [outside point, inside point] (inside recomputed for the plant as its membrane moves)
    const mkW = parent => ({ ar: el("path", { stroke: WATER, "stroke-width": 3, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" }, parent),
      dots: [0, 1, 2, 3].map(j => el("circle", { r: 4, fill: WATER, stroke: INK, "stroke-width": 1 }, parent)) });
    const pW = [mkW(PG), mkW(PG), mkW(PG), mkW(PG)], rW = [mkW(RG), mkW(RG), mkW(RG), mkW(RG)];
    const plantTerm = tx("", 110, 340, 16, PAL.green, PG, "middle", 900), rbcTerm = tx("", 315, 340, 16, RBC_L, RG, "middle", 900);
    const TV = { hypo: 0, iso: 1, hyper: 2 };
    const BATH_LAB = { hypo: "hypotonic", iso: "isotonic", hyper: "hypertonic" };
    const TERM_P = { hypo: "turgid", iso: "flaccid", hyper: "plasmolysed" }, TERM_R = { hypo: "haemolysis", iso: "normal", hyper: "crenated" };

    // =====================================================================
    // scene: strip
    // =====================================================================
    const S = scenes.strip;
    const TX0 = 52, TX1 = 128, TY0 = 70, TY1 = 344, TR = 38, SOLY = 112, TC = 90;
    const tubeD = y => `M${TX0} ${y} V${TY1 - TR} A${TR} ${TR} 0 0 0 ${TX1} ${TY1 - TR} V${y}`;
    const sol = el("path", { d: tubeD(SOLY) + " Z" }, S);
    const solTop = el("line", { x1: TX0 + 2, x2: TX1 - 2, y1: SOLY, y2: SOLY, "stroke-width": 2 }, S);
    el("path", { d: tubeD(TY0), fill: GLASS, stroke: LAB, "stroke-width": 3 }, S);
    el("rect", { x: TX0 - 6, y: TY0 - 4, width: TX1 - TX0 + 12, height: 8, rx: 4, fill: LAB }, S);
    const concT = tx("", TC, 44, 15, LAB, S, "middle", 900);
    // rack (in front of the tube)
    const RACK = mixC(PAL.orange, INK, .55);
    el("rect", { x: 28, y: 300, width: 124, height: 16, rx: 4, fill: RACK }, S);
    el("rect", { x: 34, y: 316, width: 10, height: 58, fill: RACK }, S); el("rect", { x: 136, y: 316, width: 10, height: 58, fill: RACK }, S);
    el("rect", { x: 20, y: 372, width: 140, height: 8, rx: 3, fill: RACK }, S);
    // balance
    const BAL = mixC(LAB, INK, .72);
    el("rect", { x: 240, y: 262, width: 164, height: 92, rx: 12, fill: BAL, stroke: rgba(LAB, .5), "stroke-width": 2 }, S);
    el("rect", { x: 318, y: 238, width: 14, height: 26, fill: mixC(LAB, INK, .45) }, S);
    el("rect", { x: 260, y: 230, width: 130, height: 9, rx: 4, fill: LAB }, S);
    el("rect", { x: 262, y: 280, width: 120, height: 52, rx: 8, fill: INK, stroke: rgba(PAL.green, .45), "stroke-width": 2 }, S);
    const massT = tx("", 322, 307, 26, PAL.green, S, "middle", 900);
    massT.setAttribute("style", "font-variant-numeric: tabular-nums");
    // the strip (local frame: long axis vertical, centred on 0,0)
    const stripG = el("g", {}, S);
    const stripBody = el("path", { fill: "none", "stroke-linecap": "round" }, stripG);
    const stripHi = el("path", { fill: "none", stroke: rgba(PAL.white, .45), "stroke-linecap": "round" }, stripG);
    const sArrows = el("path", { stroke: WATER, "stroke-width": 3, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" }, S);
    const SL = el("g", {}, S);
    tx("sucrose", 190, 128, 13, SOLUTE, SL, "middle", 800); el("line", { x1: 158, y1: 128, x2: 120, y2: 140, stroke: SOLUTE, "stroke-width": 2 }, SL);
    const stripLab = tx("potato strip", 190, 186, 13, LAB, SL, "middle", 800), stripLead = el("line", { stroke: LAB, "stroke-width": 2 }, SL);
    tx("balance", 322, 374, 13, LAB, SL, "middle", 800);

    const showScene = (P) => {
      const s = P.s, p = P.p, u = P.u, cur = s.scene || "membrane", prev = p.scene || cur;
      for (const k in scenes) scenes[k].setAttribute("opacity", (k === cur ? (prev === cur ? 1 : u) : k === prev ? 1 - u : 0).toFixed(3));
      return cur;
    };

    return {
      draw(t, P) {
        const s = P.s, p = P.p, u = P.u, scene = showScene(P), labels = mixN(p, s, "labels", u), arrows = mixN(p, s, "arrows", u);
        let spot = null;

        // ------------------------------ membrane ------------------------------
        if (scene === "membrane") {
          const cur = MODES.includes(s.mode) ? s.mode : "osmosis", prv = MODES.includes(p.mode) ? p.mode : cur;
          const w = k => (k === cur ? (prv === cur ? 1 : u) : k === prv ? 1 - u : 0), wD = w("diffusion"), wO = w("osmosis"), wA = w("active");
          const fl = mixN(p, s, "flow", u, 1), sp = ease(clamp(mixN(p, s, "spread", u), 0, 1)), lvl = clamp(mixN(p, s, "level", u), 0, 1) * wO;
          const pump = mixN(p, s, "pump", u) * wA;
          const topL = BASE + DL * lvl, topR = BASE - DL * lvl;
          liqL.setAttribute("y", n1(topL)); liqL.setAttribute("height", n1(VY1 - 2 - topL));
          liqR.setAttribute("y", n1(topR)); liqR.setAttribute("height", n1(VY1 - 2 - topR));
          liqRS.setAttribute("y", n1(topR)); liqRS.setAttribute("height", n1(VY1 - 2 - topR)); fade(liqRS, wO);
          fade(startLine, wO * clamp(lvl * 8, 0, 1));
          fade(memG, wO + wA); fade(plugs, wA);
          fade(gD, wD); fade(gO, wO); fade(gA, wA); fade(carG, wA);
          // diffusion: crowded → even; random motion continues
          if (wD > 0) diff.forEach(o => { const j = jig(o, t, 7 * fl), x = lerp(o.sx, o.ex, sp), y = yIn(lerp(o.fy, o.fy2, sp), BASE);
            o.e.setAttribute("cx", n1(clamp(x + j[0], 24, 396))); o.e.setAttribute("cy", n1(clamp(y + j[1], BASE + 8, VY1 - 8))); });
          // osmosis: residents, sugar bouncing off the membrane, water crossing both ways (net L → R)
          if (wO > 0) {
            const put = (o, top) => { const j = jig(o, t, 6 * fl); o.e.setAttribute("cx", n1(o.fx + j[0])); o.e.setAttribute("cy", n1(clamp(yIn(o.fy, top) + j[1], top + 6, VY1 - 8))); };
            wL.forEach(o => put(o, topL)); wR.forEach(o => put(o, topR)); sug.forEach(o => put(o, topR));
            bounce.forEach(o => { const q = Math.abs(frac(t * .45 + o.ph) * 2 - 1); o.e.setAttribute("cx", n1(MX + 18 + 40 * q * Math.max(fl, .0001) + (1 - fl) * 20)); o.e.setAttribute("cy", o.py); });
            cross.forEach(o => {
              const q = frac(t / 5 + o.ph), src = o.dir > 0 ? topL : topR, dst = o.dir > 0 ? topR : topL;
              const hx = (f, side) => side < 0 ? 34 + f * 128 : 268 + f * 118;
              const A = [hx(o.a[0], -o.dir), yIn(o.a[1], src)], D = [hx(o.d[0], o.dir), yIn(o.d[1], dst)];
              const Bp = [MX - o.dir * 52, o.py], B = [MX - o.dir * 13, o.py], Cc = [MX + o.dir * 13, o.py], E = [MX + o.dir * 52, o.py];
              const legs = [[0, .08, A, A], [.08, .35, A, Bp], [.35, .45, Bp, B], [.45, .58, B, Cc], [.58, .68, Cc, E], [.68, .92, E, D], [.92, 1, D, D]];
              const L = legs.find(l => q <= l[1]) || legs[6], k = ease(clamp((q - L[0]) / (L[1] - L[0]), 0, 1));
              const inPore = q > .35 && q < .68, j = inPore ? [0, 0] : jig(o, t, 4);
              o.e.setAttribute("cx", n1(lerp(L[2][0], L[3][0], k) + j[0])); o.e.setAttribute("cy", n1(lerp(L[2][1], L[3][1], k) + j[1]));
              fade(o.e, fl * clamp(Math.min(q / .08, (1 - q) / .08), 0, 1));
            });
          }
          // active transport: carrier cycles only while pumping (ATP); ions never cross elsewhere
          if (wA > 0) {
            const put = (o) => { const j = jig(o, t, 5 * fl); o.e.setAttribute("cx", n1(o.fx + j[0])); o.e.setAttribute("cy", n1(clamp(yIn(o.fy, BASE) + j[1], BASE + 6, VY1 - 8))); };
            ionL.forEach(put); ionR.forEach(put);
            const q = frac(t / 3.6), on = pump * fl;
            const kOpen = on * (q < .34 ? 0 : q < .5 ? ease((q - .34) / .16) : q < .76 ? 1 : 1 - ease(clamp((q - .76) / .2, 0, 1)));
            const gL = lerp(20, 2, kOpen), gR = lerp(2, 20, kOpen), cy = 230;
            lobeT.setAttribute("d", `M188 ${cy - 30} L232 ${cy - 30} L232 ${n1(cy - gR / 2)} L188 ${n1(cy - gL / 2)} Z`);
            lobeB.setAttribute("d", `M188 ${cy + 30} L232 ${cy + 30} L232 ${n1(cy + gR / 2)} L188 ${n1(cy + gL / 2)} Z`);
            const A = [52, 236], Bs = [210, cy], D = [330, 250];
            let x, y; if (q < .3) { const k = ease(q / .3); x = lerp(A[0], Bs[0], k); y = lerp(A[1], Bs[1], k); } else if (q < .5) { x = Bs[0]; y = Bs[1]; }
            else if (q < .76) { const k = ease((q - .5) / .26); x = lerp(Bs[0], D[0], k); y = lerp(Bs[1], D[1], k); } else { x = D[0]; y = D[1]; }
            ionT.setAttribute("cx", n1(x)); ionT.setAttribute("cy", n1(y));
            fade(ionT, on * clamp(Math.min(q / .06, (.9 - q) / .08), 0, 1));
            const fl2 = on * (q > .3 && q < .5 ? Math.sin((q - .3) / .2 * Math.PI) : 0);
            fade(sparkG, fl2); sparkG.setAttribute("transform", `translate(242 204) scale(${n1(.7 + .5 * fl2)}) translate(-242 -204)`);
            fade(atpT, wA * Math.max(pump * .35, fl2));
          } else { fade(sparkG, 0); fade(atpT, 0); }
          // net arrow: diffusion fades as spreading ends; osmosis water; active needs the pump
          netA.setAttribute("stroke", wA > .5 ? ION : wO > .5 ? WATER : SOLUTE);
          fade(netA, arrows * (wD * (1 - sp) + wO + wA * pump));
          fade(netT, arrows * wA * pump);
          fade(LD, labels * wD); fade(LO, labels * wO); fade(LA, labels * wA); fade(LM, labels * (wO + wA));
          fade(crowdT, 1 - clamp((sp - .6) / .3, 0, 1)); fade(fewT, 1 - clamp((sp - .6) / .3, 0, 1)); fade(evenT, clamp((sp - .7) / .3, 0, 1));
          spot = { membrane: [MX, 228, 28, 142], pore: [214, 266, 46, 56], pump: [210, 228, 50, 56], left: [110, 228, 100, 140], right: [310, 228, 100, 140] }[s.focus];
        }

        // ------------------------------ cells ------------------------------
        if (scene === "cells") {
          const sol = TV[s.solution] != null ? s.solution : "iso", psol = TV[p.solution] != null ? p.solution : sol;
          const tv = lerp(TV[psol], TV[sol], u), same = p.solution === s.solution && p.progress != null;
          const pr = clamp(lerp(same ? +p.progress : 0, s.progress != null ? +s.progress : 0, u), 0, 1);
          const bc = tv < 1 ? mixC(WATER, mixC(WATER, SOLUTE, .4), tv) : mixC(mixC(WATER, SOLUTE, .4), SOLUTE, tv - 1);
          bath.setAttribute("fill", rgba(bc, (.10 + .05 * tv).toFixed(3)));
          bathLab.textContent = BATH_LAB[sol]; bathLab.setAttribute("fill", sol === "hypo" ? WATER : sol === "hyper" ? SOLUTE : LAB);
          fade(speckG, clamp(tv - 1, 0, 1));
          if (tv > 1) specks.forEach(o => { const j = jig(o, t, 2.5); o.e.setAttribute("cx", n1(o.x + j[0])); o.e.setAttribute("cy", n1(o.y + j[1])); });
          const dirW = sol === "hypo" ? 1 : sol === "hyper" ? -1 : 0;           // +1 water in, −1 out, 0 equal both ways
          const drawW = (o, out, inn, vis, ph) => {
            const dx = inn[0] - out[0], dy = inn[1] - out[1], L = Math.hypot(dx, dy) || 1, nx = -dy / L * 9, ny = dx / L * 9;
            o.ar.setAttribute("d", dirW > 0 ? arrowD(out[0] + nx, out[1] + ny, inn[0] + nx, inn[1] + ny, 7) : dirW < 0 ? arrowD(inn[0] + nx, inn[1] + ny, out[0] + nx, out[1] + ny, 7) : arrowD(out[0] + nx, out[1] + ny, inn[0] + nx, inn[1] + ny, 7, true));
            fade(o.ar, vis);
            o.dots.forEach((d, j) => {
              const dir = dirW !== 0 ? dirW : (j % 2 ? -1 : 1), q = frac(t / 2.4 + j / 4 + ph), a = dir > 0 ? q : 1 - q;
              d.setAttribute("cx", n1(lerp(out[0], inn[0], a))); d.setAttribute("cy", n1(lerp(out[1], inn[1], a))); fade(d, vis * Math.sin(Math.PI * q));
            });
          };
          // plant cell
          fade(PG, mixN(p, s, "plant", u, 1)); fade(speckP, mixN(p, s, "plant", u, 1));
          const e = ease(pr);
          const i = sol === "hypo" ? 9.5 : sol === "iso" ? 10.5 : 10.5 + 25 * e, rp = sol === "hyper" ? 10 + 50 * e : 10;
          const bw = sol === "hypo" ? 5 * e : 0, cyt = sol === "hypo" ? 12 - 5 * e : sol === "hyper" ? 12 - 3 * e : 12;
          const px0 = W0.x0 + i, py0 = W0.y0 + i, px1 = W0.x1 - i, py1 = W0.y1 - i, my = (py0 + py1) / 2, pmx = (px0 + px1) / 2;
          wall.setAttribute("d", box(W0.x0 + 4.5, W0.y0 + 4.5, W0.x1 - 4.5, W0.y1 - 4.5, 14, bw));
          proto.setAttribute("d", box(px0, py0, px1, py1, rp, bw));
          const vx0 = px0 + cyt + 20, vy0 = py0 + cyt, vx1 = px1 - cyt, vy1 = py1 - cyt;
          vac.setAttribute("d", box(vx0, vy0, vx1, vy1, Math.max(5, rp - cyt), bw));
          nuc.setAttribute("cx", n1(px0 + (cyt + 20) / 2 + 1)); nuc.setAttribute("cy", n1(my));
          [[pmx + 6, py0 + cyt / 2 - bw * .9, 0], [pmx + 6, py1 - cyt / 2 + bw * .9, 0], [px1 - cyt / 2 + bw * .9, my - 24, 90], [px1 - cyt / 2 + bw * .9, my + 24, 90]].forEach(([x, y, r], k) => {
            chl[k].setAttribute("cx", n1(x)); chl[k].setAttribute("cy", n1(y)); chl[k].setAttribute("transform", r ? `rotate(90 ${n1(x)} ${n1(y)})` : "");
            chl[k].setAttribute("ry", n1(Math.min(3.5, cyt / 2 - .5)));
          });
          vacT.setAttribute("x", n1((vx0 + vx1) / 2)); vacT.setAttribute("y", n1(my));
          memLead.setAttribute("y2", n1(py0 - bw * 1.6 + 1));
          const pIn = (side, y) => [side < 0 ? px0 + cyt + 4 : px1 - cyt - 4, y];
          [[-1, 165], [-1, 235], [1, 165], [1, 235]].forEach(([side, y], k) => drawW(pW[k], [side < 0 ? 14 : 206, y], pIn(side, y), arrows, k * .37));
          fade(PL, labels);
          plantTerm.textContent = TERM_P[sol];
          fade(plantTerm, mixN(p, s, "terms", u) * (sol === "iso" ? 1 : clamp((pr - .55) / .3, 0, 1)));
          // red cell: swell → burst (hypo) · normal (iso) · shrink + crenate (hyper)
          fade(RG, mixN(p, s, "rbc", u, 1));
          const sw = sol === "hypo" ? ease(clamp(pr / .85, 0, 1)) : 0, burst = sol === "hypo" ? clamp((pr - .85) / .15, 0, 1) : 0;
          const R = sol === "hypo" ? 60 + 14 * sw : sol === "hyper" ? 60 - 13 * e : 60, spk = sol === "hyper" ? 7 * e : 0;
          let d = ""; for (let k = 0; k <= 120; k++) { const a = k / 120 * 6.283, r = R + spk * (Math.pow(Math.max(0, Math.cos(14 * a)), 4) * 1.5 - .35);
            d += (k ? "L" : "M") + n1(RC[0] + r * Math.cos(a)) + " " + n1(RC[1] + r * Math.sin(a)); }
          rbcPath.setAttribute("d", d + "Z");
          rbcPale.setAttribute("r", n1(R * .42)); fade(rbcPale, .55 * (1 - sw) * (sol === "hyper" ? 1 - .4 * e : 1));
          fade(rbcBody, 1 - burst);
          hb.forEach((c, k) => { c.setAttribute("r", n1(16 + (36 + k * 4) * burst)); fade(c, .26 * burst); });
          frags.forEach(f => { const rr = R + 34 * burst, a0 = f.a, a1 = f.a + .55;
            f.e.setAttribute("d", `M${n1(RC[0] + rr * Math.cos(a0))} ${n1(RC[1] + rr * Math.sin(a0))} A${n1(rr)} ${n1(rr)} 0 0 1 ${n1(RC[0] + rr * Math.cos(a1))} ${n1(RC[1] + rr * Math.sin(a1))}`);
            fade(f.e, burst > 0 ? Math.sin(Math.PI * burst) : 0); });
          [0, 180, 125, 55].forEach((deg, k) => { const a = deg * Math.PI / 180, c = Math.cos(a), sn = Math.sin(a);
            drawW(rW[k], [RC[0] + c * 90, RC[1] + sn * 90], [RC[0] + c * 34, RC[1] + sn * 34], arrows * (1 - burst), k * .29); });
          fade(RL, labels * (1 - burst));
          rbcTerm.textContent = TERM_R[sol];
          fade(rbcTerm, mixN(p, s, "terms", u) * (sol === "iso" ? 1 : sol === "hypo" ? clamp((pr - .85) / .12, 0, 1) : clamp((pr - .55) / .3, 0, 1)));
          spot = { plant: [110, 200, 104, 128], rbc: [315, 200, 96, 128], wall: [W0.x0 + 10, W0.y0 + 10, 30, 30], bath: [210, 24, 76, 20] }[s.focus];
        }

        // ------------------------------ strip ------------------------------
        if (scene === "strip") {
          const conc = s.conc != null ? +s.conc : 0, cm = clamp(mixN(p, s, "conc", u, conc), 0, 1.2);
          const sc = mixC(WATER, SOLUTE, clamp(cm, 0, 1));
          sol.setAttribute("fill", rgba(sc, (.16 + .14 * clamp(cm, 0, 1)).toFixed(3))); solTop.setAttribute("stroke", rgba(sc, .8));
          concT.textContent = `${conc.toFixed(1)} mol dm⁻³`;
          const mass = mixN(p, s, "mass", u, s.mass != null ? +s.mass : 0);
          massT.textContent = `${mass.toFixed(2)} g`;
          const ch = clamp(mixN(p, s, "change", u), -20, 20), ob = clamp(mixN(p, s, "onBalance", u), 0, 1), ob2 = ease(ob);
          const Ls = 120 * (1 + ch * .01), ws = 22 * (1 + ch * .006), bend = Math.max(0, -ch) * .9 * (1 - ease(clamp(mixN(p, s, "onBalance", u), 0, 1)));
          const cream = mixC(SOLUTE, PAL.white, .62), limp = mixC(cream, DIM, .45);
          stripBody.setAttribute("d", `M0 ${n1(-Ls / 2)} Q${n1(bend * 2)} 0 0 ${n1(Ls / 2)}`); stripBody.setAttribute("stroke-width", n1(ws));
          stripBody.setAttribute("stroke", mixC(cream, limp, clamp(-ch / 20, 0, 1)));
          stripHi.setAttribute("d", `M${n1(-ws * .22)} ${n1(-Ls / 2 + 4)} Q${n1(bend * 2 - ws * .22)} 0 ${n1(-ws * .22)} ${n1(Ls / 2 - 4)}`); stripHi.setAttribute("stroke-width", n1(ws * .22));
          const gx = lerp(TC, 325, ob2), gy = lerp(205, 230 - ws / 2, ob2) - 90 * Math.sin(Math.PI * ob);
          stripG.setAttribute("transform", `translate(${n1(gx)} ${n1(gy)}) rotate(${n1(90 * ob2)})`);
          // water arrows beside the strip: in when it gains mass, out when it loses
          const sg = ch > .2 ? 1 : ch < -.2 ? -1 : 0, ax = ws / 2 + 2;
          let ad = ""; [175, 240].forEach(y => [-1, 1].forEach(side => { const xo = TC + side * (ax + 18), xi = TC + side * (ax + 3);
            ad += sg > 0 ? arrowD(xo, y, xi, y, 6) + " " : sg < 0 ? arrowD(xi, y, xo, y, 6) + " " : ""; }));
          sArrows.setAttribute("d", ad || "M0 0"); fade(sArrows, arrows * (1 - ob) * (sg ? 1 : 0));
          fade(SL, labels);
          const sx = lerp(TC + ws / 2 + 4, 325, ob2), sy = lerp(186, 230 - ws - 2, ob2);
          stripLab.setAttribute("x", n1(lerp(190, 325, ob2))); stripLab.setAttribute("y", n1(lerp(186, 192, ob2)));
          stripLead.setAttribute("x1", n1(lerp(146, 325, ob2))); stripLead.setAttribute("y1", n1(lerp(190, 200, ob2)));
          stripLead.setAttribute("x2", n1(sx)); stripLead.setAttribute("y2", n1(sy));
          spot = { tube: [TC, 208, 64, 166], strip: [n1(gx), n1(gy), n1(lerp(ws + 14, Ls / 2 + 14, ob2)), n1(lerp(Ls / 2 + 14, ws + 14, ob2))], balance: [322, 290, 92, 72] }[s.focus];
        }

        ring.setAttribute("opacity", spot ? (.65 + .35 * Math.sin(t * 5)).toFixed(2) : 0);
        if (spot) { ring.setAttribute("cx", spot[0]); ring.setAttribute("cy", spot[1]); ring.setAttribute("rx", spot[2]); ring.setAttribute("ry", spot[3]); }
      },
    };
  },
};
