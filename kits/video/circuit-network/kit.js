/* =========================================================
   StudyPipe explainer-video kit · circuit-network
   One WAEC-style schematic loop: source block on the LEFT (n identical cells, in series as a column or in parallel as a
   rack between two bus bars, each with an optional internal resistor r inside a dashed outline), external network on the
   RIGHT (single load | series | parallel pair | R1 + (R2 ∥ R3)), wires closing the loop top and bottom.
   - The network collapses "inside out" (stage 0 → 1 → 2): the parallel pair merges into one dashed equivalent resistor,
     then the whole external network merges into one.
   - Charge dots move in the conventional direction (out of +, round the loop, back into −) and their speed in EVERY wire is
     computed by the kit from E, r, n, arr, R1–R3: series cells nE, nr; identical parallel cells E, r/n (each branch I/n);
     I = E_t/(R_ext + r_t); current division in the pair. One speed scale for every video (K px/s per ampere), same spacing.
   - Plan-supplied tags (current pills, p.d. brackets), an equivalent-cell badge, heat glow, and a power bar EI = useful + heat.
   Contract: .agents/skills/explainer-video/references/adding-a-kit.md · every frame is a pure function of (t, P).
   ========================================================= */
(window.VIDEO_KITS = window.VIDEO_KITS || {})["circuit-network"] = {
  title: "DC networks: series/parallel/mixed resistors, current splitting, cells in series vs parallel, power split",
  states: {
    n: "number of identical cells, 1–6 (default 1)",
    arr: "'series' | 'parallel': cell arrangement (cells slide between a column and a side-by-side rack)",
    E: "EMF per cell in V (flow physics only; default 1.5)",
    r: "internal resistance per cell in Ω (flow physics only; may be 0)",
    showr: "0/1: draw each cell's internal resistor r inside a dashed outline",
    cellLabel: "short label beside the source block ('' hides)",
    badge: "equivalent-cell pill under the source block ('' hides)",
    heat: "0–1: orange glow and rising shimmer on the cells",
    layout: "'single' | 'series' | 'parallel' | 'mixed' (R1 then R2 ∥ R3)",
    load: "'resistor' | 'pump' | 'lamp': symbol of the single load",
    R1: "resistance of R1 in Ω (flow physics)",
    R2: "resistance of R2 in Ω (flow physics)",
    R3: "resistance of R3 in Ω (flow physics; 0 = absent in series)",
    L1: "label beside R1 (≤ 10 chars)",
    L2: "label beside R2 (≤ 10 chars)",
    L3: "label beside R3 (≤ 10 chars)",
    stage: "0 full network · 1 parallel pair merged (Lp) · 2 whole external network merged (Lext, mixed only)",
    Lp: "label of the merged parallel pair",
    Lext: "label of the merged external network",
    flow: "0/1: charge dots (speed ∝ current in each wire)",
    split: "0/1: pulse the first junction and fan arrows into the branches",
    Imain: "current tag on the main wire near the source ('' hides)",
    I1: "current tag for R1's branch ('' hides)",
    I2: "current tag for R2's branch ('' hides)",
    I3: "current tag for R3's branch ('' hides)",
    V1: "p.d. tag across R1 ('' hides)",
    V2: "p.d. tag across R2 ('' hides)",
    V3: "p.d. tag across R3 ('' hides)",
    Vp: "p.d. tag across the parallel pair, node to node ('' hides)",
    bar: "0/1: power bar, total EI = useful + heat",
    Puse: "useful power segment size (only the ratio matters)",
    Pwaste: "wasted (heat in r) segment size",
    barLabels: "0/1: show PuseL / PwasteL under the bar",
    PuseL: "label under the useful segment",
    PwasteL: "label under the heat segment",
    focus: "dashed ring: 'src' | 'cells' | 'badge' | 'R1' | 'R2' | 'R3' | 'pair' | 'node' | 'load' | 'bar' | null",
  },
  // Camera close-ups: [x, y, w, h] in the 420×420 drawing.
  focus: {
    src: [0, 76, 172, 290],
    cells: [0, 146, 166, 186],
    badge: [0, 318, 172, 62],
    R1: [150, 24, 190, 196],
    R2: [216, 24, 204, 196],
    R3: [216, 70, 204, 240],
    pair: [184, 20, 236, 296],
    node: [156, 22, 196, 256],
    load: [150, 20, 270, 300],
    bar: [0, 350, 420, 70],
  },
  create(svg, api) {
    const { el, tx, mixN, lerp, clamp, frac, PAL, C, COLOR } = api;
    const role = (k, fb) => { const c = COLOR(k); return !c || c === k ? fb : c; };
    const cE = role("E", PAL.gold), cI = role("I", PAL.green), cV = role("V", PAL.blue), cR = role("R", PAL.orange), cr = role("r", PAL.red), cP = role("P", PAL.purple);
    const WIRE = (C && C.wire) || "#c9d6cf", INK = "#e8efe9", RING = "#ffe08a", BODY = "#1b222d";
    // ---- layout constants (drawing space 420×420) ----
    const YT = 150, YB = 322, SX = 80, XR = 406, YTOP = 98, YBOT = 202, BUS_T = 196, BUS_B = 276, RACK_Y = 236;
    const K = 30, VMIN = 9, VMAX = 165, D = 22;           // dot speed = K·I px/s (clamped), dot spacing ≈ D
    const num = (v, d) => (v == null || v === "" || isNaN(+v) ? d : +v);
    const str = (S, k) => (S && S[k] != null ? String(S[k]) : "");
    const LAYOUTS = ["single", "series", "parallel", "mixed"];

    // ---------- physics (per cell E, r; external network) ----------
    function phys(S) {
      const n = clamp(Math.round(num(S.n, 1)), 1, 6), E = num(S.E, 1.5), r = Math.max(0, num(S.r, 0));
      const par = S.arr === "parallel" && n > 1;
      const Et = par ? E : n * E, rt = par ? r / n : n * r;
      const R1 = Math.max(0, num(S.R1, 1)), R2 = Math.max(0, num(S.R2, 0)), R3 = Math.max(0, num(S.R3, 0));
      const lay = LAYOUTS.includes(S.layout) ? S.layout : "single";
      const pr = (a, b) => (a + b > 0 ? (a * b) / (a + b) : 0);
      const Rx = lay === "series" ? R1 + R2 + R3 : lay === "parallel" ? pr(R1, R2) : lay === "mixed" ? R1 + pr(R2, R3) : R1;
      const I = Rx + rt > 0 ? Et / (Rx + rt) : 0;
      let top = 0, bot = 0;
      if (lay === "parallel") { top = R1 + R2 > 0 ? (I * R2) / (R1 + R2) : I / 2; bot = I - top; }   // R1 top, R2 bottom
      if (lay === "mixed") { top = R2 + R3 > 0 ? (I * R3) / (R2 + R3) : I / 2; bot = I - top; }      // R2 top, R3 bottom
      return { n, par, lay, I, top, bot };
    }
    const poly = (pts) => { const sg = []; let L = 0; for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); sg.push(d); L += d; } return { pts, sg, L }; };
    const at = (P, d) => { for (let i = 0; i < P.sg.length; i++) { if (d <= P.sg[i] || i === P.sg.length - 1) { const u = P.sg[i] ? Math.min(1, d / P.sg[i]) : 0, a = P.pts[i], b = P.pts[i + 1]; return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u]; } d -= P.sg[i]; } return P.pts[0]; };

    // ---------- geometry of one configuration (cached; pure) ----------
    const cache = new Map();
    function geom(S) {
      const key = JSON.stringify([S.n, S.arr, S.E, S.r, S.layout, S.stage, S.load, S.R1, S.R2, S.R3]);
      if (cache.has(key)) return cache.get(key);
      const ph = phys(S), lay = ph.lay;
      const st = lay === "mixed" ? clamp(Math.round(num(S.stage, 0)), 0, 2) : lay === "parallel" ? Math.min(1, Math.max(0, Math.round(num(S.stage, 0)))) : 0;
      const load = ["pump", "lamp"].includes(S.load) && lay === "single" ? S.load : "resistor";
      const has3 = lay === "series" && num(S.R3, 0) > 0;
      const comps = {}, segs = [];
      let N1 = null, N2 = null, rc = null, pair = false;
      const main = (x, hw) => ({ x, y: YT, k: "main", hw: hw || 24, v: 1 });
      const chain = [];   // items along the main wire: { comp } or { pair }
      if (lay === "single") { comps.R1 = main(285, load === "resistor" ? 24 : 20); chain.push("R1"); }
      else if (lay === "series") {
        if (has3) { comps.R1 = main(200); comps.R2 = main(285); comps.R3 = main(370); chain.push("R1", "R2", "R3"); }
        else { comps.R1 = main(220); comps.R2 = main(330); chain.push("R1", "R2"); }
      } else if (lay === "parallel") {
        N1 = 200; N2 = 384; rc = 292;
        if (st === 0) { comps.R1 = { x: rc, y: YTOP, k: "top", hw: 24, v: 1 }; comps.R2 = { x: rc, y: YBOT, k: "bot", hw: 24, v: 1 }; comps.Rp = { x: rc, y: YT, k: "main", hw: 24, v: 0 }; chain.push("PAIR"); pair = true; }
        else { comps.Rp = main(rc); comps.R1 = { x: rc, y: YT, k: "main", hw: 24, v: 0 }; comps.R2 = { x: rc, y: YT, k: "main", hw: 24, v: 0 }; chain.push("Rp"); }
      } else {
        N1 = 240; N2 = 384; rc = 312;
        const ext = 290;
        if (st === 0) { comps.R1 = main(196); comps.R2 = { x: rc, y: YTOP, k: "top", hw: 24, v: 1 }; comps.R3 = { x: rc, y: YBOT, k: "bot", hw: 24, v: 1 }; comps.Rp = { x: rc, y: YT, k: "main", hw: 24, v: 0 }; comps.Rext = { x: ext, y: YT, k: "main", hw: 24, v: 0 }; chain.push("R1", "PAIR"); pair = true; }
        else if (st === 1) { comps.R1 = main(196); comps.Rp = main(rc); comps.R2 = { x: rc, y: YT, k: "main", hw: 24, v: 0 }; comps.R3 = { x: rc, y: YT, k: "main", hw: 24, v: 0 }; comps.Rext = { x: ext, y: YT, k: "main", hw: 24, v: 0 }; chain.push("R1", "Rp"); }
        else { comps.Rext = main(ext); for (const id of ["R1", "R2", "R3", "Rp"]) comps[id] = { x: ext, y: YT, k: "main", hw: 24, v: 0 }; chain.push("Rext"); }
      }
      // wires (each with its current), conventional direction: + (top of the source) → right → down → back along the bottom
      let cur = [SX, YT];
      const topI = lay === "parallel" ? ph.top : ph.top, botI = lay === "parallel" ? ph.bot : ph.bot;
      const topId = lay === "parallel" ? "R1" : "R2", botId = lay === "parallel" ? "R2" : "R3";
      for (const it of chain) {
        if (it === "PAIR") {
          segs.push({ pts: [cur, [N1, YT]], I: ph.I });
          const a = comps[topId], b = comps[botId];
          segs.push({ pts: [[N1, YT], [N1, YTOP], [a.x - a.hw, YTOP]], I: topI });
          segs.push({ pts: [[a.x + a.hw, YTOP], [N2, YTOP], [N2, YT]], I: topI });
          segs.push({ pts: [[N1, YT], [N1, YBOT], [b.x - b.hw, YBOT]], I: botI });
          segs.push({ pts: [[b.x + b.hw, YBOT], [N2, YBOT], [N2, YT]], I: botI });
          cur = [N2, YT];
        } else { const c = comps[it]; segs.push({ pts: [cur, [c.x - c.hw, YT]], I: ph.I }); cur = [c.x + c.hw, YT]; }
      }
      segs.push({ pts: [cur, [XR, YT], [XR, YB], [SX, YB]], I: ph.I });
      const wireD = segs.map((s) => "M" + s.pts.map((q) => q[0] + " " + q[1]).join(" L")).join(" ");
      // source: cell centres, scale, lead targets; source wires for the dots
      const n = ph.n, cells = [], ssegs = [];
      let xs = [SX];
      if (!ph.par) {
        const slot = (YB - YT) / n, sc = Math.min(1, (slot - 3) / 40);
        for (let i = 0; i < n; i++) cells.push({ x: SX, y: YT + slot * (i + 0.5), sc, tt: [SX, YT + slot * i], bt: [SX, YT + slot * (i + 1)] });
        ssegs.push({ pts: [[SX, YB], [SX, YT]], I: ph.I });       // up through the column (− → + inside each cell)
      } else {
        const sp = Math.min(40, 124 / (n - 1)), sc = Math.min(1, (sp - 2) / 38);
        xs = []; for (let i = 0; i < n; i++) xs.push(SX + (i - (n - 1) / 2) * sp);
        xs.forEach((x) => cells.push({ x, y: RACK_Y, sc, tt: [x, BUS_T], bt: [x, BUS_B] }));
        ssegs.push({ pts: [[SX, YB], [SX, BUS_B]], I: ph.I });
        ssegs.push({ pts: [[SX, BUS_T], [SX, YT]], I: ph.I });
        xs.forEach((x) => ssegs.push({ pts: [[x, BUS_B], [x, BUS_T]], I: ph.I / n }));
        const marks = [...new Set(xs.concat([SX]))].sort((a, b) => a - b);
        for (let i = 1; i < marks.length; i++) {
          const a = marks[i - 1], b = marks[i]; if (b - a < 0.5) continue;
          const outer = b <= SX ? xs.filter((x) => x <= a + 1e-6).length : xs.filter((x) => x >= b - 1e-6).length, Ib = (outer * ph.I) / n;
          if (b <= SX) { ssegs.push({ pts: [[a, BUS_B], [b, BUS_B]].reverse(), I: Ib }); ssegs.push({ pts: [[a, BUS_T], [b, BUS_T]], I: Ib }); }
          else { ssegs.push({ pts: [[a, BUS_B], [b, BUS_B]], I: Ib }); ssegs.push({ pts: [[b, BUS_T], [a, BUS_T]], I: Ib }); }
        }
      }
      const allSegs = segs.concat(ssegs).map((s) => Object.assign(poly(s.pts), { I: s.I }));
      const g = { sig: [lay, st, load, n, ph.par, has3].join("|"), ph, lay, st, load, comps, N1, N2, rc, pair, segs: allSegs, wireD, cells, par: ph.par, xs };
      cache.set(key, g);
      return g;
    }

    // ================= build the drawing once =================
    const root = el("g", {}, svg);
    // heat glow behind the source
    const heatG = el("g", { opacity: 0 }, root);
    const heatGlow = el("rect", { x: 2, y: 158, width: 156, height: 158, rx: 24, fill: "#ff7a2a", opacity: 0.2 }, heatG);
    const waves = el("g", {}, heatG);
    for (const x0 of [10, 150, 46, 114]) el("path", { d: `M${x0} 300 q7 -10 0 -20 q-7 -10 0 -20 q7 -10 0 -20`, fill: "none", stroke: "#ff9a4a", "stroke-width": 3, "stroke-linecap": "round" }, waves);
    // wires: network (previous + current configuration, crossfaded) and source leads/buses
    const wireP = el("path", { fill: "none", stroke: WIRE, "stroke-width": 4, "stroke-linecap": "round", "stroke-linejoin": "round" }, root);
    const wireS = el("path", { fill: "none", stroke: WIRE, "stroke-width": 4, "stroke-linecap": "round", "stroke-linejoin": "round" }, root);
    const busG = el("g", {}, root);
    const busT = el("path", { fill: "none", stroke: WIRE, "stroke-width": 4, "stroke-linecap": "round" }, busG);
    const busB = el("path", { fill: "none", stroke: WIRE, "stroke-width": 4, "stroke-linecap": "round" }, busG);
    const leads = []; for (let i = 0; i < 6; i++) leads.push(el("path", { fill: "none", stroke: WIRE, "stroke-width": 4, "stroke-linecap": "round", "stroke-linejoin": "round" }, root));
    // charge dots: two pools (previous and current configuration), each moving at its own constant speeds → no jumps
    const dotG = el("g", {}, root);
    const mkPool = () => { const g = el("g", {}, dotG), a = []; for (let i = 0; i < 130; i++) a.push(el("circle", { r: 4.2, fill: cI, opacity: 0 }, g)); return { g, a }; };
    const poolP = mkPool(), poolS = mkPool();
    // cells (drawn over the dots, so charge passes "behind" the plates)
    const cells = [];
    for (let i = 0; i < 6; i++) {
      const g = el("g", {}, root);
      const outline = el("rect", { x: -19, y: -17, width: 38, height: 38, rx: 5, fill: "none", stroke: "#9fb3a8", "stroke-width": 1.6, "stroke-dasharray": "4 3" }, g);
      const leadTop = el("line", { x1: 0, y1: -20, x2: 0, y2: -12, stroke: WIRE, "stroke-width": 4 }, g);
      const leadBot = el("line", { x1: 0, y1: -4, x2: 0, y2: 20, stroke: WIRE, "stroke-width": 4 }, g);
      const rbox = el("rect", { x: -5, y: 4, width: 10, height: 13, rx: 1.5, fill: BODY, stroke: cr, "stroke-width": 2.6 }, g);
      const plus = el("line", { x1: -15, x2: 15, y1: -12, y2: -12, stroke: cE, "stroke-width": 3, "stroke-linecap": "round" }, g);    // long thin = +
      const minus = el("line", { x1: -7.5, x2: 7.5, y1: -4, y2: -4, stroke: cE, "stroke-width": 7, "stroke-linecap": "butt" }, g);   // short thick = −
      const sign = tx("+", -17, -20, 12, cE, g, "middle", 800);
      cells.push({ g, outline, leadTop, leadBot, rbox, plus, minus, sign });
    }
    // components
    const ZIG = "M-24 0 l4 -9 l8 18 l8 -18 l8 18 l8 -18 l8 18 l4 -9";
    const comps = {};
    for (const id of ["R1", "R2", "R3", "Rp", "Rext"]) {
      const g = el("g", {}, root), merged = id === "Rp" || id === "Rext";
      const box = merged ? el("rect", { x: -31, y: -17, width: 62, height: 34, rx: 6, fill: "none", stroke: cR, "stroke-width": 2, "stroke-dasharray": "5 4" }, g) : null;
      const zig = el("path", { d: ZIG, fill: "none", stroke: cR, "stroke-width": 4, "stroke-linejoin": "round", "stroke-linecap": "round" }, g);
      let lamp = null, pump = null, imp = null;
      if (id === "R1") {
        lamp = el("g", {}, g);
        el("circle", { r: 20, fill: BODY, stroke: cR, "stroke-width": 3.5 }, lamp);
        el("path", { d: "M-14 -14 L14 14 M-14 14 L14 -14", stroke: cR, "stroke-width": 3, "stroke-linecap": "round" }, lamp);
        pump = el("g", {}, g);
        el("circle", { r: 20, fill: BODY, stroke: cR, "stroke-width": 3.5 }, pump);
        el("path", { d: "M-10 7 V-8 L-3 1 L4 -8 V7", fill: "none", stroke: cR, "stroke-width": 2.8, "stroke-linejoin": "round", "stroke-linecap": "round" }, pump);
        imp = el("g", {}, pump);
        el("path", { d: "M0 0 L0 -5 M0 0 L4.3 2.5 M0 0 L-4.3 2.5", stroke: cR, "stroke-width": 2.2, "stroke-linecap": "round" }, imp);
      }
      const lab = tx("", 0, 0, 14, cR, root, "middle", 800);
      comps[id] = { g, box, zig, lamp, pump, imp, lab };
    }
    const nodes = [el("circle", { r: 5.5, fill: WIRE }, root), el("circle", { r: 5.5, fill: WIRE }, root)];
    // split highlight at the first junction
    const splitG = el("g", { opacity: 0 }, root);
    const splitRing = el("circle", { r: 10, fill: "none", stroke: cI, "stroke-width": 3 }, splitG);
    const fanA = el("path", { fill: "none", stroke: cI, "stroke-width": 3, "stroke-linecap": "round", "stroke-linejoin": "round" }, splitG);
    // tags
    const mkI = () => { const g = el("g", { opacity: 0 }, root); const pill = el("rect", { height: 24, y: -12, rx: 12, fill: cI, "fill-opacity": 0.16, stroke: cI, "stroke-width": 1.6 }, g); const arr = el("path", { fill: cI }, g); const t = tx("", 0, 1, 13, cI, g, "middle", 800); return { g, pill, arr, t, k: "" }; };
    const mkV = () => { const g = el("g", { opacity: 0 }, root); const br = el("path", { fill: "none", stroke: cV, "stroke-width": 2, "stroke-linecap": "round" }, g); const t = tx("", 0, 0, 13, cV, g, "middle", 800); return { g, br, t }; };
    const TAG = { Imain: mkI(), I1: mkI(), I2: mkI(), I3: mkI(), V1: mkV(), V2: mkV(), V3: mkV(), Vp: mkV() };
    // source labels
    const cellLab = tx("", 10, 92, 15, cE, root, "start", 800);
    const badgeG = el("g", { opacity: 0 }, root);
    const badgePill = el("rect", { y: 334, height: 28, rx: 14, fill: cE, "fill-opacity": 0.14, stroke: cE, "stroke-width": 1.8 }, badgeG);
    const badgeT = tx("", SX, 349, 14, cE, badgeG, "middle", 800);
    // power bar
    const barG = el("g", { opacity: 0 }, root);
    const BX = 84, BW = 322, BY = 364, BH = 20;
    tx("total EI", 10, BY + BH / 2, 12, INK, barG, "start", 700);
    el("rect", { x: BX, y: BY, width: BW, height: BH, rx: 5, fill: "none", stroke: "#5c6675", "stroke-width": 1.5 }, barG);
    const useR = el("rect", { x: BX, y: BY, height: BH, rx: 4, fill: cP }, barG);
    const wasteR = el("rect", { y: BY, height: BH, rx: 4, fill: cr }, barG);
    const flame = el("path", { d: "M0 7 C-6 4 -5 -2 -1 -8 C0 -3 3 -3 3 -6 C7 -1 6 5 0 7 Z", fill: "#ffd25e", stroke: "#1b222d", "stroke-width": 1 }, barG);
    const barLabG = el("g", {}, barG);
    const useL = tx("", BX, 404, 13, cP, barLabG, "start", 800), wasteL = tx("", BX + BW, 404, 13, cr, barLabG, "end", 800);
    // focus ring
    const ring = el("rect", { fill: "none", stroke: RING, "stroke-width": 3, "stroke-dasharray": "7 6", rx: 14, opacity: 0 }, root);

    // ---------- helpers ----------
    const textMix = (k, p, s, u) => {   // crossfaded string state → [text, opacity]
      const a = str(p, k), b = str(s, k);
      if (a === b) return [b, b ? 1 : 0];
      return [u < 0.5 ? a || b : b || a, !a ? u : !b ? 1 - u : Math.abs(1 - 2 * u)];
    };
    const width = (t, fb) => { try { const w = t.getBBox().width; return w > 0 ? w : fb; } catch (e) { return fb; } };
    const setT = (node, s) => { if (node.textContent !== s) node.textContent = s; };
    const speed = (I) => (I > 1e-6 ? clamp(K * I, VMIN, VMAX) : 0);
    function placeDots(pool, G, t, op) {
      let k = 0;
      pool.g.setAttribute("opacity", op.toFixed(3));
      if (op > 0.005) for (const sgm of G.segs) {
        if (sgm.L < 8) continue;
        const m = Math.max(1, Math.round(sgm.L / D)), sp = sgm.L / m, v = speed(sgm.I);
        if (!v) continue;
        const shift = (t * v) / sp;
        for (let j = 0; j < m && k < pool.a.length; j++) {
          const q = frac((j + shift) / m) * sgm.L, xy = at(sgm, q), c = pool.a[k++];
          c.setAttribute("cx", xy[0].toFixed(1)); c.setAttribute("cy", xy[1].toFixed(1)); c.setAttribute("opacity", 1);
        }
      }
      for (; k < pool.a.length; k++) pool.a[k].setAttribute("opacity", 0);
    }
    const tagPos = (c, kind) => {   // positions of label / I pill / V bracket for a component of kind main | top | bot
      if (c.k === "top") return { L: [c.x, c.y - 28], I: [null, 42], V: [c.y + 18, c.y + 32] };
      if (c.k === "bot") return { L: [c.x, c.y + 28], I: [null, 258], V: [c.y - 18, c.y - 32] };
      return { L: [c.x, c.y - (c.hw < 24 ? 34 : 30)], I: [c.x, c.y - 60], V: [c.y + (c.hw < 24 ? 28 : 20), c.y + (c.hw < 24 ? 44 : 36)] };
    };

    return {
      draw(t, P) {
        const s = P.s, p = P.p, u = P.u;
        const GP = geom(p), GS = geom(s), structural = GP.sig !== GS.sig;
        const L = (a, b) => lerp(a, b, u);

        // ---- network wires ----
        if (GP.wireD === GS.wireD) { wireS.setAttribute("d", GS.wireD); wireS.setAttribute("opacity", 1); wireP.setAttribute("opacity", 0); }
        else { wireP.setAttribute("d", GP.wireD); wireS.setAttribute("d", GS.wireD); wireP.setAttribute("opacity", (1 - u).toFixed(3)); wireS.setAttribute("opacity", u.toFixed(3)); }

        // ---- source: cells glide between column and rack ----
        const sr = mixN(p, s, "showr", u);
        const parA = L(GP.par ? 1 : 0, GS.par ? 1 : 0);
        for (let i = 0; i < 6; i++) {
          const a = GP.cells[i], b = GS.cells[i], c = cells[i];
          const vis = L(a ? 1 : 0, b ? 1 : 0);
          if (vis < 0.01) { c.g.setAttribute("opacity", 0); leads[i].setAttribute("opacity", 0); continue; }
          const A = a || b, B = b || a;
          const x = L(A.x, B.x), y = L(A.y, B.y), sc = L(A.sc, B.sc);
          c.g.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${sc.toFixed(3)})`);
          c.g.setAttribute("opacity", vis.toFixed(3));
          const py = lerp(-4, -12, sr), my = lerp(4, -4, sr);
          c.plus.setAttribute("y1", py); c.plus.setAttribute("y2", py); c.minus.setAttribute("y1", my); c.minus.setAttribute("y2", my);
          c.leadTop.setAttribute("y2", py); c.leadBot.setAttribute("y1", my);
          c.rbox.setAttribute("opacity", sr.toFixed(3)); c.outline.setAttribute("opacity", (sr * 0.85).toFixed(3));
          c.sign.setAttribute("y", (py - 8).toFixed(1));
          const tt = [L(A.tt[0], B.tt[0]), L(A.tt[1], B.tt[1])], bt = [L(A.bt[0], B.bt[0]), L(A.bt[1], B.bt[1])];
          const yTop = y - 20 * sc, yBot = y + 20 * sc;
          leads[i].setAttribute("d", `M${x.toFixed(1)} ${yTop.toFixed(1)} V${tt[1].toFixed(1)} H${tt[0].toFixed(1)} M${x.toFixed(1)} ${yBot.toFixed(1)} V${bt[1].toFixed(1)} H${bt[0].toFixed(1)}`);
          leads[i].setAttribute("opacity", vis.toFixed(3));
        }
        const busSrc = GS.par ? GS : GP;
        if (parA > 0.005 && busSrc.par) {
          const x0 = Math.min(...busSrc.xs), x1 = Math.max(...busSrc.xs);
          busT.setAttribute("d", `M${x0} ${BUS_T} H${x1} M${SX} ${BUS_T} V${YT}`);
          busB.setAttribute("d", `M${x0} ${BUS_B} H${x1} M${SX} ${BUS_B} V${YB}`);
        }
        busG.setAttribute("opacity", parA.toFixed(3));
        const heat = mixN(p, s, "heat", u);
        heatG.setAttribute("opacity", heat.toFixed(3));
        heatGlow.setAttribute("opacity", (0.16 + 0.06 * Math.sin(t * 6)).toFixed(3));
        waves.setAttribute("transform", `translate(0 ${(-((t * 22) % 20)).toFixed(1)})`);

        // ---- components ----
        const loadW = (k) => (GP.load === k ? 1 - u : 0) + (GS.load === k ? u : 0);
        const CP = {};
        for (const id of ["R1", "R2", "R3", "Rp", "Rext"]) {
          const a = GP.comps[id], b = GS.comps[id], c = comps[id];
          const va = a ? a.v : 0, vb = b ? b.v : 0, vis = L(va, vb);
          const A = a || b, B = b || a;
          if (!A || vis < 0.01) { c.g.setAttribute("opacity", 0); c.lab.setAttribute("opacity", 0); CP[id] = { vis: 0 }; continue; }
          const x = L(A.x, B.x), y = L(A.y, B.y), hw = L(A.hw, B.hw);
          // kind: pick the side that is visible (for tag placement)
          const kd = vb >= va ? B.k : A.k;
          CP[id] = { x, y, hw, k: kd, vis };
          const shrink = id === "Rp" || id === "Rext" ? 1 : lerp(1, 0.6, clamp(1 - vis, 0, 1));
          c.g.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${shrink.toFixed(3)})`);
          c.g.setAttribute("opacity", vis.toFixed(3));
          if (id === "R1") {
            const wl = loadW("lamp"), wp = loadW("pump");
            c.zig.setAttribute("opacity", (1 - wl - wp).toFixed(3)); c.lamp.setAttribute("opacity", wl.toFixed(3)); c.pump.setAttribute("opacity", wp.toFixed(3));
            if (wp > 0.01) c.imp.setAttribute("transform", `translate(10 9) rotate(${((t * speed(GS.ph.I) * 4) % 360).toFixed(1)})`);
          }
          // resistor label
          const labKey = id === "Rp" ? "Lp" : id === "Rext" ? "Lext" : "L" + id[1];
          const [txt, o] = textMix(labKey, p, s, u);
          const tp = tagPos(CP[id]);
          setT(c.lab, txt); c.lab.setAttribute("x", tp.L[0].toFixed(1)); c.lab.setAttribute("y", tp.L[1].toFixed(1));
          c.lab.setAttribute("opacity", (o * vis).toFixed(3));
        }
        // nodes of the pair
        const N = (g, k) => (g[k] == null ? null : g[k]);
        const n1 = N(GS, "N1") != null ? (N(GP, "N1") != null ? L(GP.N1, GS.N1) : GS.N1) : N(GP, "N1");
        const n2 = N(GS, "N2") != null ? (N(GP, "N2") != null ? L(GP.N2, GS.N2) : GS.N2) : N(GP, "N2");
        const pairVis = L(GP.pair ? 1 : 0, GS.pair ? 1 : 0);
        nodes[0].setAttribute("opacity", n1 != null ? pairVis.toFixed(3) : 0); nodes[1].setAttribute("opacity", n2 != null ? pairVis.toFixed(3) : 0);
        if (n1 != null) { nodes[0].setAttribute("cx", n1.toFixed(1)); nodes[0].setAttribute("cy", YT); }
        if (n2 != null) { nodes[1].setAttribute("cx", n2.toFixed(1)); nodes[1].setAttribute("cy", YT); }
        const split = mixN(p, s, "split", u) * pairVis;
        splitG.setAttribute("opacity", n1 != null ? split.toFixed(3) : 0);
        if (n1 != null && split > 0.01) {
          splitRing.setAttribute("cx", n1.toFixed(1)); splitRing.setAttribute("cy", YT);
          splitRing.setAttribute("r", (9 + 6 * Math.abs(Math.sin(t * 4))).toFixed(1));
          const x = n1, ah = (x2, y2, dy) => `M${x2 - 7} ${y2 - dy * 1} L${x2} ${y2} L${x2 - 1} ${y2 + dy * 7}`;
          fanA.setAttribute("d", `M${x - 40} ${YT - 9} Q${x - 14} ${YT - 12} ${x + 18} ${YT - 30} ${ah(x + 18, YT - 30, 1)} M${x - 40} ${YT + 9} Q${x - 14} ${YT + 12} ${x + 18} ${YT + 30} ${ah(x + 18, YT + 30, -1)}`);
        }

        // ---- dots ----
        const fP = mixN(p, p, "flow", 1), fS = mixN(s, s, "flow", 1);
        const sameSpeeds = !structural && GP.segs.every((g, i) => Math.abs(g.I - GS.segs[i].I) < 1e-9);
        if (sameSpeeds) { placeDots(poolS, GS, t, L(fP, fS)); placeDots(poolP, GP, t, 0); }
        else if (!structural) { placeDots(poolP, GP, t, fP * (1 - u)); placeDots(poolS, GS, t, fS * u); }
        else { placeDots(poolP, GP, t, fP * clamp(1 - 2 * u, 0, 1)); placeDots(poolS, GS, t, fS * clamp(2 * u - 1, 0, 1)); }

        // ---- tags ----
        const setI = (tag, key, x, y, vis) => {
          const [txt, o] = textMix(key, p, s, u), op = o * vis;
          tag.g.setAttribute("opacity", op.toFixed(3));
          if (op < 0.005) return;
          setT(tag.t, txt);
          const tw = width(tag.t, txt.length * 8), w = tw + 30;
          tag.pill.setAttribute("x", (-w / 2).toFixed(1)); tag.pill.setAttribute("width", w.toFixed(1));
          const ax = -w / 2 + 8;
          tag.arr.setAttribute("d", `M${ax.toFixed(1)} -1.6 h6 v-4 l7 5.6 l-7 5.6 v-4 h-6 Z`);
          tag.t.setAttribute("x", (ax + 17 + tw / 2).toFixed(1));
          tag.g.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
        };
        const setV = (tag, key, x0, x1, yb, yt, vis) => {
          const [txt, o] = textMix(key, p, s, u), op = o * vis;
          tag.g.setAttribute("opacity", op.toFixed(3));
          if (op < 0.005) return;
          setT(tag.t, txt);
          const dir = yt > yb ? 1 : -1;   // ticks point toward the part
          tag.br.setAttribute("d", `M${x0.toFixed(1)} ${(yb - dir * 6).toFixed(1)} V${(yb + dir * 2).toFixed(1)} M${x1.toFixed(1)} ${(yb - dir * 6).toFixed(1)} V${(yb + dir * 2).toFixed(1)} M${x0.toFixed(1)} ${yb.toFixed(1)} H${x1.toFixed(1)} M${(x0 + 6).toFixed(1)} ${(yb - 4).toFixed(1)} L${x0.toFixed(1)} ${yb.toFixed(1)} L${(x0 + 6).toFixed(1)} ${(yb + 4).toFixed(1)} M${(x1 - 6).toFixed(1)} ${(yb - 4).toFixed(1)} L${x1.toFixed(1)} ${yb.toFixed(1)} L${(x1 - 6).toFixed(1)} ${(yb + 4).toFixed(1)}`);
          tag.t.setAttribute("x", ((x0 + x1) / 2).toFixed(1)); tag.t.setAttribute("y", yt.toFixed(1));
        };
        setI(TAG.Imain, "Imain", 122, 124, 1);
        for (const [id, ik, vk] of [["R1", "I1", "V1"], ["R2", "I2", "V2"], ["R3", "I3", "V3"]]) {
          const c = CP[id];
          if (!c || !c.vis) { TAG[ik].g.setAttribute("opacity", 0); TAG[vk].g.setAttribute("opacity", 0); continue; }
          const tp = tagPos(c);
          const ix = tp.I[0] != null ? tp.I[0] : (n1 != null ? n1 : c.x - 60) + 36;
          setI(TAG[ik], ik, ix, tp.I[1], c.vis);
          setV(TAG[vk], vk, c.x - 26, c.x + 26, tp.V[0], tp.V[1], c.vis);
        }
        const pv = Math.max(pairVis, L(GP.lay === "parallel" || GP.lay === "mixed" ? (GP.st < 2 ? 1 : 0) : 0, GS.lay === "parallel" || GS.lay === "mixed" ? (GS.st < 2 ? 1 : 0) : 0));
        if (n1 != null && n2 != null) setV(TAG.Vp, "Vp", n1, n2, 282, 300, pv); else TAG.Vp.g.setAttribute("opacity", 0);

        // ---- source labels, badge ----
        { const [txt, o] = textMix("cellLabel", p, s, u); setT(cellLab, txt); cellLab.setAttribute("opacity", o.toFixed(3)); }
        { const [txt, o] = textMix("badge", p, s, u); badgeG.setAttribute("opacity", o.toFixed(3));
          if (o > 0.005) { setT(badgeT, txt); const w = width(badgeT, txt.length * 8) + 26; badgePill.setAttribute("x", (SX - w / 2).toFixed(1)); badgePill.setAttribute("width", w.toFixed(1)); } }

        // ---- power bar ----
        const bar = mixN(p, s, "bar", u);
        barG.setAttribute("opacity", bar.toFixed(3));
        if (bar > 0.005) {
          const pu = Math.max(0, mixN(p, s, "Puse", u, 1)), pw = Math.max(0, mixN(p, s, "Pwaste", u, 0)), tot = pu + pw || 1;
          const wu = (BW * pu) / tot, ww = BW - wu;
          useR.setAttribute("width", Math.max(0, wu - 1).toFixed(1));
          wasteR.setAttribute("x", (BX + wu + 1).toFixed(1)); wasteR.setAttribute("width", Math.max(0, ww - 1).toFixed(1));
          flame.setAttribute("transform", `translate(${(BX + wu + ww / 2).toFixed(1)} ${(BY + BH / 2 - 1 + Math.sin(t * 7) * 0.8).toFixed(1)}) scale(${(0.9 + 0.08 * Math.sin(t * 9)).toFixed(3)})`);
          flame.setAttribute("opacity", ww > 12 ? 1 : 0);
          barLabG.setAttribute("opacity", mixN(p, s, "barLabels", u).toFixed(3));
          { const [a, o] = textMix("PuseL", p, s, u); setT(useL, a); useL.setAttribute("opacity", o.toFixed(3)); }
          { const [a, o] = textMix("PwasteL", p, s, u); setT(wasteL, a); wasteL.setAttribute("opacity", o.toFixed(3)); }
        }

        // ---- focus ring ----
        let R = null;
        const f = s.focus, cc = f && CP[f];
        if (f === "src") R = [4, 76, 160, 262];
        else if (f === "cells") R = [2, 152, 156, 176];
        else if (f === "badge") R = [12, 328, 136, 40];
        else if (f === "bar") R = [BX - 6, BY - 8, BW + 12, BH + 16];
        else if (f === "load") R = [160, 60, 254, 196];
        else if (f === "node" && n1 != null) R = [n1 - 18, YT - 18, 36, 36];
        else if (f === "pair" && n1 != null) R = GS.pair ? [n1 - 10, YTOP - 22, n2 - n1 + 20, YBOT - YTOP + 44] : [GS.rc - 38, YT - 24, 76, 48];
        else if (cc && cc.vis) R = cc.k === "main" ? [cc.x - cc.hw - 10, cc.y - 22, 2 * cc.hw + 20, 44] : [cc.x - cc.hw - 8, cc.y - 15, 2 * cc.hw + 16, 30];
        ring.setAttribute("opacity", R ? (0.6 + 0.4 * Math.sin(t * 5)).toFixed(2) : 0);
        if (R) { ring.setAttribute("x", R[0].toFixed(1)); ring.setAttribute("y", R[1].toFixed(1)); ring.setAttribute("width", R[2].toFixed(1)); ring.setAttribute("height", R[3].toFixed(1)); ring.setAttribute("stroke-dashoffset", ((t * 20) % 13).toFixed(1)); }
      },
    };
  },
};
