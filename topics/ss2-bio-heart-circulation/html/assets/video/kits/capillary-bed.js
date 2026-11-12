/* =========================================================
   StudyPipe explainer-video kit · capillary-bed
   One capillary between tissue cells: arteriole (left) → capillary → venule (right). Red cells and plasma proteins stay inside;
   small molecules cross the one-cell-thick wall. Arrows at five points are driven by the physics: NFP = Pc − πc, where Pc falls
   linearly from the arterial end (pcA) to the venous end (pcV) and πc is constant. Out where NFP > 0, in where NFP < 0.
   Below: a blind-ended lymph capillary with one-way flap valves draining the extra tissue fluid. Oedema swells the tissue.
   Contract: .agents/skills/explainer-video/references/adding-a-kit.md · every frame is a pure function of (t, P).
   ========================================================= */
(window.VIDEO_KITS = window.VIDEO_KITS || {})["capillary-bed"] = {
  title: "Capillary bed: ultrafiltration, reabsorption, lymph drainage and oedema",
  states: {
    labels: "0/1: arteriole, venule, capillary wall, tissue fluid, lymph capillary",
    cells: "0/1: red blood cells flowing in single file (they never leave)",
    proteins: "0/1: plasma-protein dots inside (they never leave)",
    filtration: "0/1: show outward movement where NFP > 0",
    reabsorption: "0/1: show inward movement where NFP < 0",
    pcA: "blood (hydrostatic) pressure at the arterial end, mmHg (default 35)",
    pcV: "blood pressure at the venous end, mmHg (default 15)",
    pi: "plasma-protein osmotic pressure, mmHg, constant along the capillary (default 25)",
    gauges: "0/1: Pc readings at both ends, πc, and NFP at both ends",
    lymph: "0/1: lymph capillary with drainage to the lymph node",
    blocked: "0/1: lymph vessel blocked (no drainage), as in elephantiasis",
    oedema: "0–1: tissue swelling with trapped fluid",
    wall: "0/1: highlight the one-cell-thick capillary wall",
    focus: "ring a part: 'arterial' | 'venous' | 'lymph' | 'wall' | null",
  },
  focus: {
    arterial: [14, 92, 206, 228], venous: [200, 92, 206, 228], lymph: [92, 270, 320, 140], wall: [116, 128, 188, 128], tube: [14, 120, 392, 160],
  },
  create(svg, api) {
    const { el, tx, mixN, frac, clamp } = api;
    const RED = "#e2464f", BLUE = "#4f7fe0", ORANGE = "#ffa04d", PURPLE = "#c39bff", FLUID = "#8fd3ff", WALL = "#e7b8a8", GOLD = "#ffe08a";
    const X0 = 44, X1 = 376, YT = 172, YB = 228;            // capillary lumen
    const POS = [0, .25, .5, .75, 1], xAt = q => X0 + 20 + q * (X1 - X0 - 40);
    const rnd = (() => { let a = 11; return () => { a = (a * 9301 + 49297) % 233280; return a / 233280; }; })();   // seeded: no Math.random at draw time

    // ---------- tissue ----------
    const tissue = el("g", {}, svg);
    el("rect", { x: 8, y: 40, width: 404, height: 360, rx: 22, fill: "#2a2128", stroke: "#4a3a44", "stroke-width": 2 }, tissue);
    const swell = el("rect", { x: 8, y: 40, width: 404, height: 360, rx: 22, fill: FLUID, opacity: 0 }, tissue);
    const cells = [];
    [[60, 80], [150, 70], [250, 78], [345, 74], [70, 270], [345, 262], [210, 268]].forEach(([cx, cy]) => {
      const c = el("ellipse", { cx, cy, rx: 34, ry: 22, fill: "#6b4f5f", stroke: "#8a6a7c", "stroke-width": 2 }, tissue);
      el("circle", { cx: cx + 6, cy, r: 6, fill: "#4a3242" }, tissue); cells.push({ c, cx, cy });
    });

    // ---------- capillary ----------
    const defs = el("defs", {}, svg), grad = el("linearGradient", { id: "capgrad", x1: 0, y1: 0, x2: 1, y2: 0 }, defs);
    el("stop", { offset: 0, "stop-color": "rgba(226,70,79,.45)" }, grad); el("stop", { offset: 1, "stop-color": "rgba(79,127,224,.45)" }, grad);
    el("rect", { x: X0, y: YT, width: X1 - X0, height: YB - YT, fill: "url(#capgrad)" }, svg);
    const wallG = el("g", {}, svg);
    for (let i = 0; i < 8; i++) {           // endothelial cells: one cell thick, top and bottom
      const x = X0 + i * (X1 - X0) / 8, w = (X1 - X0) / 8 - 3;
      [YT - 7, YB + 1].forEach(y => { el("rect", { x, y, width: w, height: 6, rx: 3, fill: WALL }, wallG); el("ellipse", { cx: x + w / 2, cy: y + 3, rx: 5, ry: 2.2, fill: "#b07a6c" }, wallG); });
    }
    const wallHi = el("g", { opacity: 0 }, svg);
    el("rect", { x: X0 - 2, y: YT - 9, width: X1 - X0 + 4, height: 10, rx: 4, fill: "none", stroke: GOLD, "stroke-width": 2.5 }, wallHi);
    el("rect", { x: X0 - 2, y: YB - 1, width: X1 - X0 + 4, height: 10, rx: 4, fill: "none", stroke: GOLD, "stroke-width": 2.5 }, wallHi);
    el("path", { d: `M${X0 - 30} ${YT} H${X0} M${X0 - 30} ${YB} H${X0}`, stroke: RED, "stroke-width": 4 }, svg);       // arteriole stub
    el("path", { d: `M${X1} ${YT} H${X1 + 30} M${X1} ${YB} H${X1 + 30}`, stroke: BLUE, "stroke-width": 4 }, svg);     // venule stub

    // red cells and proteins: inside only
    const rbcG = el("g", {}, svg), rbc = [];
    for (let i = 0; i < 9; i++) rbc.push({ e: el("ellipse", { rx: 13, ry: 8, fill: "#d9343f", stroke: "#ff8a8a", "stroke-width": 1.5 }, rbcG), off: i / 9 });
    const protG = el("g", {}, svg), prot = [];
    for (let i = 0; i < 12; i++) prot.push({ e: el("circle", { r: 4, fill: PURPLE }, protG), off: rnd(), y: YT + 10 + rnd() * (YB - YT - 20), ph: rnd() * 6.28 });

    // ---------- NFP arrows (physics-driven) + moving fluid ----------
    const arrows = POS.map(q => {
      const g = el("g", {}, svg), mk = () => el("path", { fill: "none", "stroke-width": 4, "stroke-linecap": "round", "stroke-linejoin": "round" }, g);
      return { q, x: xAt(q), g, up: mk(), dn: mk(), dots: [0, 1, 2].map(() => el("circle", { r: 3.5, fill: FLUID }, g)) };
    });
    const arrowPath = (x, yWall, dir, len, out) => {        // dir: -1 above the tube, +1 below; out: away from the tube
      const y0 = out ? yWall : yWall + dir * len, y1 = out ? yWall + dir * len : yWall, h = y1 > y0 ? -7 : 7;
      return `M${x} ${y0} V${y1} M${x - 6} ${y1 + h} L${x} ${y1} L${x + 6} ${y1 + h}`;
    };

    // ---------- lymph capillary (blind-ended, one-way valves) ----------
    const lymphG = el("g", {}, svg);
    const LY = 322, LH = 26;
    el("path", { d: `M402 ${LY} H150 A13 13 0 0 0 150 ${LY + LH} H402`, fill: "rgba(195,155,255,.18)", stroke: PURPLE, "stroke-width": 3 }, lymphG);
    [200, 260, 320].forEach(x => { el("path", { d: `M${x} ${LY} l10 8 M${x} ${LY + LH} l10 -8`, stroke: PURPLE, "stroke-width": 2.5 }, lymphG); });
    const lymphDots = [0, 1, 2, 3, 4, 5].map(i => ({ e: el("circle", { r: 3.5, fill: FLUID }, lymphG), off: i / 6 }));
    const drainDots = [0, 1, 2].map(i => ({ e: el("circle", { r: 3.5, fill: FLUID }, lymphG), x: 190 + i * 60 }));
    const block = el("g", { opacity: 0 }, lymphG);
    el("path", { d: `M282 ${LY - 8} l26 ${LH + 16} M308 ${LY - 8} l-26 ${LH + 16}`, stroke: RED, "stroke-width": 5, "stroke-linecap": "round" }, block);
    tx("blocked", 295, LY - 20, 14, RED, block, "middle", 800);

    // ---------- labels, gauges, focus ----------
    const labG = el("g", {}, svg);
    tx("arteriole", 40, 152, 14, RED, labG, "middle", 800); tx("venule", 384, 152, 14, BLUE, labG, "middle", 800);
    tx("capillary wall", 210, 152, 13, WALL, labG, "middle", 700); tx("tissue fluid", 210, 120, 13, FLUID, labG, "middle", 700);
    tx("tissue cell", 345, 46, 12, "#cfb7c4", labG, "middle", 700);
    const lymLab = el("g", {}, svg);
    tx("lymph capillary", 220, 372, 13, PURPLE, lymLab, "middle", 800); tx("→ lymph node", 372, 306, 12, PURPLE, lymLab, "middle", 700);
    const gaugeG = el("g", {}, svg);
    const pcA = tx("", 72, 252, 15, ORANGE, gaugeG, "middle", 800), pcV = tx("", 350, 252, 15, ORANGE, gaugeG, "middle", 800);
    const piT = tx("", 210, 252, 15, "#8fb8ff", gaugeG, "middle", 800);
    const nfA = tx("", 72, 108, 16, "#7cf0a5", gaugeG, "middle", 900), nfV = tx("", 350, 108, 16, "#7cf0a5", gaugeG, "middle", 900);
    const ring = el("circle", { fill: "none", stroke: GOLD, "stroke-width": 3, "stroke-dasharray": "7 6", opacity: 0 }, svg);
    const SPOT = { arterial: [96, 200, 66], venous: [324, 200, 66], lymph: [210, 335, 70], wall: [210, 172, 40] };
    const sgn = v => (v > 0 ? "+" : v < 0 ? "−" : "") + Math.abs(Math.round(v));

    return {
      draw(t, P) {
        const s = P.s, p = P.p, u = P.u;
        const A = mixN(p, s, "pcA", u, 35), Vv = mixN(p, s, "pcV", u, 15), PI = mixN(p, s, "pi", u, 25);
        const oed = mixN(p, s, "oedema", u);
        swell.setAttribute("opacity", (oed * .3).toFixed(3));
        cells.forEach(({ c, cx, cy }) => { const k = 1 + oed * .12; c.setAttribute("transform", `translate(${cx} ${cy}) scale(${k.toFixed(3)}) translate(${-cx} ${-cy})`); });
        // red cells in single file, proteins drifting: both stay inside the lumen
        rbcG.setAttribute("opacity", mixN(p, s, "cells", u).toFixed(2));
        rbc.forEach(r => { const x = X0 + 6 + frac(r.off + t * .07) * (X1 - X0 - 12); r.e.setAttribute("cx", x.toFixed(1)); r.e.setAttribute("cy", (200 + Math.sin(t * 2 + r.off * 9) * 3).toFixed(1)); });
        protG.setAttribute("opacity", mixN(p, s, "proteins", u).toFixed(2));
        prot.forEach(o => { const x = X0 + 6 + frac(o.off + t * .05) * (X1 - X0 - 12), y = clamp(o.y + Math.sin(t * 3 + o.ph) * 8, YT + 6, YB - 6); o.e.setAttribute("cx", x.toFixed(1)); o.e.setAttribute("cy", y.toFixed(1)); });
        // arrows from NFP = Pc − πc along the capillary
        const fil = mixN(p, s, "filtration", u), rea = mixN(p, s, "reabsorption", u);
        arrows.forEach(a => {
          const nfp = (A + (Vv - A) * a.q) - PI, out = nfp > 0, show = out ? fil : rea, len = Math.min(52, 10 + Math.abs(nfp) * 2.2);
          const vis = Math.abs(nfp) < .5 ? 0 : show;
          a.g.setAttribute("opacity", vis.toFixed(2));
          const col = out ? ORANGE : "#8fb8ff";
          a.up.setAttribute("d", arrowPath(a.x, YT - 9, -1, len, out)); a.dn.setAttribute("d", arrowPath(a.x, YB + 9, 1, len, out));
          a.up.setAttribute("stroke", col); a.dn.setAttribute("stroke", col);
          a.dots.forEach((d, k) => {
            const q = frac(t * (.35 + Math.abs(nfp) * .02) + k / 3), side = k % 2 ? 1 : -1, wallY = side < 0 ? YT - 9 : YB + 9;
            const dist = (out ? q : 1 - q) * len;
            d.setAttribute("cx", (a.x + 10).toFixed(1)); d.setAttribute("cy", (wallY + side * dist).toFixed(1));
          });
        });
        // lymph
        const ly = mixN(p, s, "lymph", u), blk = mixN(p, s, "blocked", u);
        lymphG.setAttribute("opacity", ly.toFixed(2)); lymLab.setAttribute("opacity", (ly * mixN(p, s, "labels", u)).toFixed(2));
        block.setAttribute("opacity", blk.toFixed(2));
        const flowing = 1 - blk;
        lymphDots.forEach(d => { const x = 160 + frac(d.off + t * .12) * 240; d.e.setAttribute("cx", (blk > .5 ? Math.min(x, 270) : x).toFixed(1)); d.e.setAttribute("cy", (LY + LH / 2).toFixed(1)); d.e.setAttribute("opacity", (blk > .5 && x > 270 ? 0 : 1).toFixed(2)); });
        drainDots.forEach((d, k) => { const q = frac(t * .4 + k / 3); d.e.setAttribute("cx", d.x); d.e.setAttribute("cy", (262 + q * (LY - 262)).toFixed(1)); d.e.setAttribute("opacity", (flowing * (1 - q * .5)).toFixed(2)); });
        // labels, gauges, wall, focus
        labG.setAttribute("opacity", mixN(p, s, "labels", u).toFixed(2));
        const gg = mixN(p, s, "gauges", u); gaugeG.setAttribute("opacity", gg.toFixed(2));
        pcA.textContent = `Pc ${Math.round(A)}`; pcV.textContent = `Pc ${Math.round(Vv)}`; piT.textContent = `πc ${Math.round(PI)}`;
        nfA.textContent = `NFP ${sgn(A - PI)}`; nfV.textContent = `NFP ${sgn(Vv - PI)}`;
        wallHi.setAttribute("opacity", mixN(p, s, "wall", u).toFixed(2));
        const spot = SPOT[s.focus];
        ring.setAttribute("opacity", spot ? (.65 + .35 * Math.sin(t * 5)).toFixed(2) : 0);
        if (spot) { ring.setAttribute("cx", spot[0]); ring.setAttribute("cy", spot[1]); ring.setAttribute("r", spot[2]); }
      },
    };
  },
};
