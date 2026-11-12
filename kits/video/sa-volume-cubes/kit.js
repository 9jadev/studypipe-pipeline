/* =========================================================
   StudyPipe explainer-video kit · sa-volume-cubes
   One or two cubes in a clean 3-face (cabinet) view for surface area to volume ratio:
   SA = 6L², V = L³, SA:V = 6/L, all COMPUTED from L by the kit (never typed text).
   - faces: the six faces light up one by one (SA colour), "L² × n" counter reaches 6 (hidden faces dashed).
   - fill:  unit cubes fill the cube layer by layer (V colour) for whole-number L ≤ 4, else a translucent fill.
   - cut + dye: each cube is shown cut in half; dye soaks in from every face by the same distance
     (depth × dye, in the cube's own unit), leaving a pale centre square of side max(0, L − 2·depth·dye).
   - scale 'fit' draws each cube at a teaching size; 'true' draws both to one scale (tiny cubes get a finder ring).
   Role colours via COLOR('L'), COLOR('SA'), COLOR('V'), COLOR('SAV'), with gold / orange / blue / green fallbacks.
   Camera close-ups follow the cubes: the kit updates its own focus rectangles every frame (cubes move with L/scale).
   Contract: .agents/skills/explainer-video/references/adding-a-kit.md · every frame is a pure function of (t, P).
   ========================================================= */
(window.VIDEO_KITS = window.VIDEO_KITS || {})["sa-volume-cubes"] = {
  title: "Cubes for SA:V: SA = 6L², V = L³, SA:V = 6/L, and the agar dye test",
  states: {
    L: "side of cube A (number, animates; 0.1 … 40) in the current unit",
    L2: "side of cube B (0 = no cube B); B sits to the right on the same baseline",
    scale: "'fit' (default: each cube at a teaching size) | 'true' (both cubes to one scale)",
    unit: "'mm' (default) | 'cm'",
    faces: "0/1: the six faces light up one by one, counter L² × 6 (SA = 6L²)",
    fill: "0/1: unit cubes fill the cube layer by layer (V = L³); translucent fill if L > 4 or not whole",
    readout: "0/1: SA, V, SA:V table under each cube, computed from L",
    readoutA: "optional override for cube A's table: ['24 mm²', '8 mm³', '3.0 mm⁻¹'] (or null)",
    readoutB: "optional override for cube B's table (or null)",
    cut: "0/1: cubes shown cut in half, cut face towards the viewer",
    dye: "0–1: soaking progress (animates over ~4.5 s per full soak)",
    depth: "dye penetration at dye = 1, same unit as L (default 0.5)",
    arrows: "0/1: equal-length inward diffusion arrows on each cut face",
    tagA: "short tag under cube A (≤ 18 chars) or ''",
    tagB: "short tag under cube B (≤ 18 chars) or ''",
    focus: "ring a part: 'cubeA' | 'cubeB' | 'readout' | 'centre' | null",
  },
  // Camera close-ups [x, y, w, h] in the 420×420 drawing. These arrays are UPDATED IN PLACE every frame by draw(),
  // so the camera always frames the cube where it is now (it moves with L, L2 and scale).
  focus: {
    cubeA: [20, 30, 240, 320],
    cubeB: [190, 30, 225, 320],
    readout: [10, 306, 400, 96],
    centre: [190, 70, 220, 230],
  },
  create(svg, api) {
    const { el, tx, mixN, lerp, seg, clamp, PAL, COLOR, meta } = api;
    const KIT = this && this.focus ? this : window.VIDEO_KITS["sa-volume-cubes"], FOC = KIT.focus;

    // ---------- colours ----------
    const isCol = c => typeof c === "string" && /^(#|rgb|hsl)/.test(c);
    const role = (n, fb) => {
      const c = COLOR(n); if (isCol(c) && c !== n) return c;
      const r = meta && meta.roles && meta.roles[n]; if (r && isCol(r.color)) return r.color;
      return fb;
    };
    const cL = role("L", PAL.gold), cSA = role("SA", PAL.orange), cV = role("V", PAL.blue), cSAV = role("SAV", PAL.green);
    const mixHex = (a, b, k) => {          // blend two #rrggbb colours (falls back to a)
      if (!/^#[0-9a-f]{6}$/i.test(a) || !/^#[0-9a-f]{6}$/i.test(b)) return a;
      const h = (s, i) => parseInt(s.slice(i, i + 2), 16), o = [1, 3, 5].map(i => Math.round(h(a, i) + (h(b, i) - h(a, i)) * k));
      return "#" + o.map(v => v.toString(16).padStart(2, "0")).join("");
    };
    const vTop = mixHex(cV, "#ffffff", .35), vSide = mixHex(cV, "#000000", .3);
    const BASE_F = "#3b4a5e", BASE_T = "#50627c", BASE_R = "#2c3747", EDGE = "#cbd8e6";
    const DYE = "#9e1f5c", AGAR = "#efe3b8", GOLD = "#ffe08a", DIM = "#9fb3c8";
    const DX = .42, DY = -.30;                 // cabinet depth vector per px of depth
    const YB = 244;                            // bench line (bottom of the front faces)

    // ---------- number formats (computed, fixed) ----------
    const fmtQ = v => {                       // SA, V: up to 3 significant figures, trailing zeros dropped; 1000+ in full
      if (!isFinite(v)) return "–";
      if (v >= 1000) { const r = String(Math.round(v)); return r.length > 4 ? r.replace(/\B(?=(\d{3})+(?!\d))/g, " ") : r; }
      return String(Number(v.toPrecision(3)));
    };
    const fmtR = v => { const one = Number(v.toFixed(1)); return one < 10 ? v.toFixed(1) : String(Math.round(v)); };   // SA:V
    const fmtL = v => String(Number(v.toFixed(v < 1 ? 2 : 1)));
    const pts = a => a.map(q => q[0].toFixed(1) + "," + q[1].toFixed(1)).join(" ");

    // ---------- card ----------
    el("rect", { x: 8, y: 8, width: 404, height: 404, rx: 22, fill: "#1b222d", stroke: "#2c3746", "stroke-width": 2 }, svg);
    el("path", { d: `M18 ${YB + 1} H402`, stroke: "#3a4656", "stroke-width": 2, "stroke-linecap": "round" }, svg);

    // ---------- one cube ----------
    function makeCube() {
      const g = el("g", {}, svg);
      const poly = (a, par) => el("polygon", Object.assign({ points: "0,0" }, a), par || g);
      const hid = [0, 1, 2].map(() => poly({ fill: cSA, "fill-opacity": 0 }));             // left, back, bottom (hidden)
      const fillG = el("g", {}, g);
      const blk = [poly({ fill: cV, "fill-opacity": .7 }, fillG), poly({ fill: vTop, "fill-opacity": .8 }, fillG), poly({ fill: vSide, "fill-opacity": .7 }, fillG)];
      const units = [];
      for (let k = 3; k >= 0; k--) for (let j = 0; j < 4; j++) for (let i = 0; i < 4; i++) {   // painter's order: back → front, bottom → top, left → right
        const ug = el("g", { display: "none" }, fillG), st = { stroke: "#0e1a28", "stroke-width": 1, "stroke-linejoin": "round" };
        units.push({ i, j, k, g: ug, f: poly(Object.assign({ fill: cV }, st), ug), t: poly(Object.assign({ fill: vTop }, st), ug), r: poly(Object.assign({ fill: vSide }, st), ug) });
      }
      const face = { f: poly({ fill: BASE_F }), t: poly({ fill: BASE_T }), r: poly({ fill: BASE_R }) };
      const lit = { f: poly({ fill: cSA, opacity: 0 }), t: poly({ fill: cSA, opacity: 0 }), r: poly({ fill: cSA, opacity: 0 }) };
      const dyed = { f: poly({ fill: DYE, opacity: 0 }), t: poly({ fill: DYE, opacity: 0 }), r: poly({ fill: DYE, opacity: 0 }) };
      const hidEdge = el("path", { fill: "none", stroke: EDGE, "stroke-width": 1.6, "stroke-dasharray": "5 4", opacity: 0 }, g);   // hidden edges, dashed on top
      const cutG = el("g", { opacity: 0 }, g);
      const cutDye = el("rect", { fill: DYE }, cutG), cutPale = el("rect", { fill: AGAR }, cutG);
      const edge = el("path", { fill: "none", stroke: EDGE, "stroke-width": 2, "stroke-linejoin": "round" }, g);
      const arG = el("g", { opacity: 0 }, g);
      const arrows = [0, 1, 2, 3].map(() => ({
        u: el("path", { fill: "none", stroke: "#2a0c1c", "stroke-width": 6, "stroke-linecap": "round", "stroke-linejoin": "round" }, arG),
        m: el("path", { fill: "none", stroke: "#ffd6ea", "stroke-width": 3, "stroke-linecap": "round", "stroke-linejoin": "round" }, arG),
      }));
      const far = tx("too far", 0, 0, 12, "#7a4a62", g, "middle", 800);
      const faceLab = [0, 1, 2].map(() => tx("L²", 0, 0, 14, "#1b222d", g, "middle", 900));
      const cntF = tx("", 0, 0, 15, cSA, g, "middle", 900), cntV = tx("", 0, 0, 15, cV, g, "middle", 900);
      const ring = el("circle", { r: 10, fill: "none", stroke: GOLD, "stroke-width": 2.5, opacity: 0 }, g);
      const lLab = tx("", 0, 0, 14, cL, g, "middle", 800);
      const cutLab = tx("", 0, 0, 13, "#e9b3cf", g, "middle", 800);
      const tag = tx("", 0, 0, 14, "#e6edf3", g, "middle", 700);
      return { g, hid, hidEdge, blk, units, face, lit, dyed, cutG, cutDye, cutPale, edge, arG, arrows, far, faceLab, cntF, cntV, ring, lLab, cutLab, tag };
    }

    function drawCube(c, o) {
      // o: { x0, s, d, L, op, litA[6], fillProg, fillVis, nInt, cut, dye, depth, arrows, unit, tag }
      const { x0, s, d } = o, P3 = (x, y, z) => [x0 + x + z * DX, YB - y + z * DY];
      c.g.setAttribute("opacity", o.op.toFixed(3));
      c.g.setAttribute("display", o.op < .005 ? "none" : "inline");
      if (o.op < .005) return null;
      const F = [P3(0, 0, 0), P3(s, 0, 0), P3(s, s, 0), P3(0, s, 0)];
      const T = [P3(0, s, 0), P3(s, s, 0), P3(s, s, d), P3(0, s, d)];
      const R = [P3(s, 0, 0), P3(s, 0, d), P3(s, s, d), P3(s, s, 0)];
      const HL = [P3(0, 0, 0), P3(0, 0, d), P3(0, s, d), P3(0, s, 0)], HB = [P3(0, 0, d), P3(s, 0, d), P3(s, s, d), P3(0, s, d)], HD = [P3(0, 0, 0), P3(s, 0, 0), P3(s, 0, d), P3(0, 0, d)];
      // hidden faces (left, back, bottom): lit 4th, 5th, 6th
      [HL, HB, HD].forEach((q, i) => { c.hid[i].setAttribute("points", pts(q)); c.hid[i].setAttribute("fill-opacity", (o.litA[3 + i] * .3).toFixed(3)); });
      const hidOn = Math.max(o.litA[3], o.litA[4], o.litA[5]);
      const b0 = P3(0, 0, d), b1 = P3(0, s, d), b2 = P3(s, 0, d), b3 = P3(0, 0, 0);
      c.hidEdge.setAttribute("d", `M${b0[0].toFixed(1)} ${b0[1].toFixed(1)} L${b1[0].toFixed(1)} ${b1[1].toFixed(1)} M${b0[0].toFixed(1)} ${b0[1].toFixed(1)} L${b2[0].toFixed(1)} ${b2[1].toFixed(1)} M${b0[0].toFixed(1)} ${b0[1].toFixed(1)} L${b3[0].toFixed(1)} ${b3[1].toFixed(1)}`);
      c.hidEdge.setAttribute("opacity", (Math.max(o.faceMode, o.fillVis) * .75 * (1 - o.cut)).toFixed(3));
      c.hidEdge.setAttribute("stroke", hidOn > .5 ? cSA : EDGE);
      // fill: unit cubes (whole L ≤ 4) or a translucent block
      const fv = o.fillVis * (1 - o.cut);
      if (o.nInt && fv > .005) {
        const n = o.nInt, a = s / n, b = d / n, shown = o.fillProg * n;
        c.blk.forEach(e => e.setAttribute("display", "none"));
        c.units.forEach(q => {
          const vis = q.i < n && q.j < n && q.k < n ? clamp(shown - q.j, 0, 1) : 0;
          if (vis <= 0) { q.g.setAttribute("display", "none"); return; }
          q.g.setAttribute("display", "inline"); q.g.setAttribute("opacity", (vis * fv).toFixed(3));
          const x = q.i * a, y = q.j * a, z = q.k * b;
          q.f.setAttribute("points", pts([P3(x, y, z), P3(x + a, y, z), P3(x + a, y + a, z), P3(x, y + a, z)]));
          q.t.setAttribute("points", pts([P3(x, y + a, z), P3(x + a, y + a, z), P3(x + a, y + a, z + b), P3(x, y + a, z + b)]));
          q.r.setAttribute("points", pts([P3(x + a, y, z), P3(x + a, y, z + b), P3(x + a, y + a, z + b), P3(x + a, y + a, z)]));
        });
      } else {
        c.units.forEach(q => q.g.setAttribute("display", "none"));
        const h = s * o.fillProg, show = fv > .005 && h > .5;
        c.blk.forEach(e => e.setAttribute("display", show ? "inline" : "none"));
        if (show) {
          c.blk[0].setAttribute("points", pts([P3(0, 0, 0), P3(s, 0, 0), P3(s, h, 0), P3(0, h, 0)]));
          c.blk[1].setAttribute("points", pts([P3(0, h, 0), P3(s, h, 0), P3(s, h, d), P3(0, h, d)]));
          c.blk[2].setAttribute("points", pts([P3(s, 0, 0), P3(s, 0, d), P3(s, h, d), P3(s, h, 0)]));
          c.blk.forEach(e => e.setAttribute("opacity", fv.toFixed(3)));
        }
      }
      // visible faces: see-through while the fill or the face count is on
      const see = clamp(Math.max(fv * .85, o.faceMode * .45), 0, .88);
      [["f", F], ["t", T], ["r", R]].forEach(([k, q], i) => {
        c.face[k].setAttribute("points", pts(q)); c.face[k].setAttribute("fill-opacity", (1 - see).toFixed(3));
        c.lit[k].setAttribute("points", pts(q)); c.lit[k].setAttribute("opacity", (o.litA[i] * .7 * (k === "f" ? 1 - o.cut : 1)).toFixed(3));
        c.dyed[k].setAttribute("points", pts(q)); c.dyed[k].setAttribute("opacity", (Math.min(1, o.dye * 3) * .9 * (k === "f" ? 1 - o.cut : 1)).toFixed(3));
      });
      // cut face: dyed border + pale centre of side max(0, L − 2·depth·dye)
      const pale = Math.max(0, o.L - 2 * o.depth * o.dye), ps = s * pale / o.L;
      c.cutG.setAttribute("opacity", o.cut.toFixed(3));
      c.cutDye.setAttribute("x", x0.toFixed(1)); c.cutDye.setAttribute("y", (YB - s).toFixed(1)); c.cutDye.setAttribute("width", s.toFixed(1)); c.cutDye.setAttribute("height", s.toFixed(1));
      c.cutPale.setAttribute("x", (x0 + (s - ps) / 2).toFixed(2)); c.cutPale.setAttribute("y", (YB - s + (s - ps) / 2).toFixed(2));
      c.cutPale.setAttribute("width", ps.toFixed(2)); c.cutPale.setAttribute("height", ps.toFixed(2));
      // edges
      const e = [...F, F[0]].map((q, i) => (i ? "L" : "M") + q[0].toFixed(1) + " " + q[1].toFixed(1)).join(" ");
      const t1 = P3(0, s, d), t2 = P3(s, s, d), t3 = P3(s, 0, d), f2 = P3(s, s, 0), f3 = P3(0, s, 0);
      c.edge.setAttribute("d", `${e} M${f3[0].toFixed(1)} ${f3[1].toFixed(1)} L${t1[0].toFixed(1)} ${t1[1].toFixed(1)} L${t2[0].toFixed(1)} ${t2[1].toFixed(1)} L${t3[0].toFixed(1)} ${t3[1].toFixed(1)} L${F[1][0].toFixed(1)} ${F[1][1].toFixed(1)} M${f2[0].toFixed(1)} ${f2[1].toFixed(1)} L${t2[0].toFixed(1)} ${t2[1].toFixed(1)}`);
      c.edge.setAttribute("stroke-width", s < 30 ? 1.2 : 2);
      // diffusion arrows: all the same length (the dye depth on this cube's scale; at least 14 px so they can be seen)
      const cx = x0 + s / 2, cy = YB - s / 2, la = Math.min(Math.max(o.depth * s / o.L, 14), s / 2 - 2), arOp = o.arrows * o.cut * (s >= 40 ? 1 : 0);
      c.arG.setAttribute("opacity", arOp.toFixed(3));
      if (arOp > .005) {
        const m = 7;
        [[cx, YB - s, 0, 1], [cx, YB, 0, -1], [x0, cy, 1, 0], [x0 + s, cy, -1, 0]].forEach(([x, y, ux, uy], i) => {
          const ex = x + ux * la, ey = y + uy * la, px = -uy, py = ux;
          const d2 = `M${x.toFixed(1)} ${y.toFixed(1)} L${ex.toFixed(1)} ${ey.toFixed(1)} M${(ex - ux * m + px * m * .7).toFixed(1)} ${(ey - uy * m + py * m * .7).toFixed(1)} L${ex.toFixed(1)} ${ey.toFixed(1)} L${(ex - ux * m - px * m * .7).toFixed(1)} ${(ey - uy * m - py * m * .7).toFixed(1)}`;
          c.arrows[i].u.setAttribute("d", d2); c.arrows[i].m.setAttribute("d", d2);
        });
      }
      const farOn = o.arrows * o.cut * (s >= 90 && o.depth <= o.L / 4 ? 1 : 0);
      c.far.setAttribute("x", cx.toFixed(1)); c.far.setAttribute("y", cy.toFixed(1)); c.far.setAttribute("opacity", (farOn * .85).toFixed(3));
      // face labels L² (only when the cube is big enough to hold them)
      const fl = [P3(s / 2, s / 2, 0), P3(s / 2, s, d / 2), P3(s, s / 2, d / 2)];
      c.faceLab.forEach((t, i) => { t.setAttribute("x", fl[i][0].toFixed(1)); t.setAttribute("y", fl[i][1].toFixed(1)); t.setAttribute("opacity", (s >= 70 ? clamp(o.litA[i] * 2 - 1, 0, 1) * (i === 0 ? 1 - o.cut : 1) : 0).toFixed(3)); });
      // counters above the cube
      const topY = YB - s + d * DY, mid = x0 + (s + d * DX) / 2, nLit = o.litA.filter(v => v >= .5).length;
      c.cntF.textContent = `L² × ${nLit}`;
      c.cntF.setAttribute("x", mid.toFixed(1)); c.cntF.setAttribute("y", Math.max(18, topY - 14).toFixed(1)); c.cntF.setAttribute("opacity", o.faceMode.toFixed(3));
      const layers = o.nInt ? Math.min(o.nInt, Math.ceil(o.fillProg * o.nInt - 1e-6)) : 0;
      c.cntV.textContent = o.nInt ? `${o.nInt} × ${o.nInt} × ${layers}` : "L × L × L";
      c.cntV.setAttribute("x", mid.toFixed(1)); c.cntV.setAttribute("y", Math.max(18, topY - 14 - o.faceMode * 22).toFixed(1)); c.cntV.setAttribute("opacity", fv.toFixed(3));
      // finder ring for a tiny cube (true scale)
      const tiny = s < 20 ? 1 : 0;
      c.ring.setAttribute("cx", cx.toFixed(1)); c.ring.setAttribute("cy", cy.toFixed(1)); c.ring.setAttribute("r", Math.max(9, s / 2 + 5).toFixed(1)); c.ring.setAttribute("opacity", tiny * .9);
      // labels under the cube: L, cut result, tag
      c.lLab.textContent = `L = ${fmtL(o.L)} ${o.unit}`; c.lLab.setAttribute("x", cx.toFixed(1)); c.lLab.setAttribute("y", YB + 20);
      const cutVis = o.cut * clamp((o.dye - .03) * 8, 0, 1);
      c.cutLab.textContent = pale <= 1e-9 ? "dyed through" : "pale centre";
      c.cutLab.setAttribute("x", cx.toFixed(1)); c.cutLab.setAttribute("y", YB + 40); c.cutLab.setAttribute("opacity", cutVis.toFixed(3));
      c.tag.textContent = o.tag || ""; c.tag.setAttribute("x", cx.toFixed(1)); c.tag.setAttribute("y", (YB + 40 + 20 * cutVis).toFixed(1));
      // bounding box (drawing + counters + labels) for focus/ring
      const top = Math.min(topY, cy - 10) - (Math.max(o.faceMode, fv) > .05 ? 30 : 8), right = x0 + s + d * DX;
      const bottom = YB + (o.tag ? 40 + 20 * cutVis : cutVis > .05 ? 40 : 20) + 12;
      const labW = 92;
      const left = Math.min(x0, cx - labW / 2), rr = Math.max(right, cx + labW / 2);
      return { box: [left, top, rr - left, bottom - top], face: [x0, YB - s, s, s], cx, cy };
    }

    const A = makeCube(), B = makeCube();

    // ---------- readout tables ----------
    function makeTable() {
      const g = el("g", { opacity: 0 }, svg);
      const bg = el("rect", { y: YB + 76, width: 180, height: 78, rx: 12, fill: "rgba(255,255,255,.06)", stroke: "rgba(255,255,255,.12)" }, g);
      const rows = [["SA", cSA], ["V", cV], ["SA:V", cSAV]].map(([n, col], i) => ({
        n: tx(n, 0, YB + 92 + i * 24, 15, col, g, "start", 900), v: tx("", 0, YB + 92 + i * 24, 15, col, g, "end", 800),
      }));
      return { g, bg, rows };
    }
    function drawTable(T, cx, L, unit, over, op) {
      T.g.setAttribute("opacity", op.toFixed(3)); if (op < .005) return;
      T.bg.setAttribute("x", (cx - 90).toFixed(1));
      const vals = Array.isArray(over) && over.length === 3 ? over.map(String)
        : [`${fmtQ(6 * L * L)} ${unit}²`, `${fmtQ(L * L * L)} ${unit}³`, `${fmtR(6 / L)} ${unit}⁻¹`];
      T.rows.forEach((r, i) => { r.n.setAttribute("x", (cx - 80).toFixed(1)); r.v.setAttribute("x", (cx + 80).toFixed(1)); r.v.textContent = vals[i]; });
    }
    const TA = makeTable(), TB = makeTable();

    const ringR = el("rect", { fill: "none", stroke: GOLD, "stroke-width": 3, "stroke-dasharray": "8 6", rx: 14, opacity: 0 }, svg);
    const setR = (arr, r) => { for (let i = 0; i < 4; i++) arr[i] = +r[i].toFixed(1); };
    const minBox = (r, mw, mh) => { const w = Math.max(r[2], mw), h = Math.max(r[3], mh); return [r[0] + r[2] / 2 - w / 2, r[1] + r[3] / 2 - h / 2, w, h]; };
    const pad = (r, k) => [r[0] - k, r[1] - k, r[2] + 2 * k, r[3] + 2 * k];

    // eased turn-on/turn-off helpers for 0/1 states
    const on = (o, k) => !!+(o[k] || 0);
    const blend = (p, s, k, u) => lerp(on(p, k) ? 1 : 0, on(s, k) ? 1 : 0, u);

    return {
      draw(t, P) {
        const s = P.s || {}, p = P.p || s, u = P.u, tIn = t - (P.t0 || 0);
        const unit = s.unit === "cm" ? "cm" : "mm";
        // sides
        const LA = Math.max(.01, u >= 1 ? +(s.L != null ? s.L : 2) : mixN(p, s, "L", u, 2));
        const hasP = +(p.L2 || 0) > 0, hasS = +(s.L2 || 0) > 0;
        const bOn = lerp(hasP ? 1 : 0, hasS ? 1 : 0, u);
        const LB = Math.max(.01, hasP && hasS ? (u >= 1 ? +s.L2 : mixN(p, s, "L2", u)) : hasS ? +s.L2 : hasP ? +p.L2 : 1);
        // sizes: fit vs true scale
        const m = lerp(p.scale === "true" ? 1 : 0, s.scale === "true" ? 1 : 0, u);
        const grow = L => .6 + .4 * clamp(Math.log(Math.max(L, 1)) / Math.log(8), 0, 1);
        const base = lerp(160, 112, bOn);
        const twoTrue = hasS || hasP, big = Math.max(LA, twoTrue ? LB : 0), small = twoTrue ? Math.min(LA, LB) : LA;
        const Sbig = twoTrue ? Math.min(150, 374 / 1.42 / (1 + small / big)) : 165;
        const k = Sbig / big;
        const sA = lerp(base * grow(LA), Math.max(3, LA * k), m), sB = lerp(base * grow(LB), Math.max(3, LB * k), m);
        // dye / cut / arrows
        const cut = blend(p, s, "cut", u), arrows = blend(p, s, "arrows", u);
        const dS = +(s.dye || 0), dP = +(p.dye || 0);
        const dye = dS === dP ? dS : lerp(dP, dS, seg(tIn, .2, .2 + 4.5 * Math.abs(dS - dP)));
        const depth = mixN(p, s, "depth", u, .5);
        const dfrac = lerp(1, .5, cut);                      // a cube cut in half keeps half its depth
        const dA = sA * dfrac, dB = sB * dfrac, wA = sA + dA * DX, wB = sB + dB * DX;
        // positions on one baseline
        const cA = lerp(210, 105, bOn), cB = 315;
        let xB = Math.min(cB - wB / 2, 404 - wB), xA = Math.max(16, cA - wA / 2);
        if (bOn > 0 && xA + wA + 14 > xB) { xA = Math.max(16, xB - 14 - wA); if (xA + wA + 14 > xB) xB = xA + wA + 14; }
        // faces: light one after another (front, top, right, then the three hidden faces)
        const fOn = on(s, "faces"), fWas = on(p, "faces");
        const litA = [0, 1, 2, 3, 4, 5].map(f => fOn ? (fWas ? 1 : clamp((tIn - .3 - f * .55) / .3, 0, 1)) : fWas ? 1 - u : 0);
        const faceMode = fOn ? (fWas ? 1 : clamp((tIn - .2) / .3, 0, 1)) : fWas ? 1 - u : 0;
        // fill: layer by layer
        const vOn = on(s, "fill"), vWas = on(p, "fill");
        const nInt = L => (Math.abs(L - Math.round(L)) < 1e-6 && L >= 1 && L <= 4.0000001 ? Math.round(L) : 0);
        const fillP = (L) => { const n = nInt(L); return vOn ? (vWas ? 1 : seg(tIn, .3, .3 + (n ? .6 * n : 2.2))) : vWas ? 1 : 0; };
        const fillVis = vOn ? 1 : vWas ? 1 - u : 0;

        const common = { cut, dye, depth, arrows, unit, litA, faceMode, fillVis };
        const bxA = drawCube(A, Object.assign({}, common, { x0: xA, s: sA, d: dA, L: LA, op: 1, fillProg: fillP(LA), nInt: nInt(LA), tag: s.tagA || "" }));
        const bxB = drawCube(B, Object.assign({}, common, { x0: xB, s: sB, d: dB, L: LB, op: bOn, fillProg: fillP(LB), nInt: nInt(LB), tag: s.tagB || "" }));

        // readout tables (computed from L unless the plan overrides)
        const ro = blend(p, s, "readout", u);
        drawTable(TA, cA, LA, unit, s.readoutA, ro);
        drawTable(TB, cB, LB, unit, s.readoutB, ro * bOn);

        // close-ups follow the cubes (arrays updated in place; the camera reads them every frame)
        setR(FOC.cubeA, minBox(pad(bxA.box, 12), 170, 170));
        setR(FOC.cubeB, bxB ? minBox(pad(bxB.box, 12), 170, 170) : FOC.cubeA);
        const roBox = bOn > .5 ? [12, YB + 44, 396, 122] : [cA - 104, YB + 44, 208, 122];
        setR(FOC.readout, roBox);
        const cf = (bOn > .5 && bxB ? bxB : bxA);
        setR(FOC.centre, minBox([cf.face[0] - 14, cf.face[1] - 14, cf.face[2] + 28, cf.face[3] + 70], 160, 160));

        // focus ring
        const R = s.focus === "cubeA" ? pad(bxA.box, 4) : s.focus === "cubeB" && bxB ? pad(bxB.box, 4) : s.focus === "readout" ? [roBox[0] + 4, YB + 70, roBox[2] - 8, 90]
          : s.focus === "centre" ? [cf.face[0] - 8, cf.face[1] - 8, cf.face[2] + 16, cf.face[3] + 16] : null;
        ringR.setAttribute("opacity", R ? (.6 + .4 * Math.sin(t * 5)).toFixed(2) : 0);
        if (R) { ringR.setAttribute("x", R[0].toFixed(1)); ringR.setAttribute("y", R[1].toFixed(1)); ringR.setAttribute("width", Math.max(20, R[2]).toFixed(1)); ringR.setAttribute("height", Math.max(20, R[3]).toFixed(1)); ringR.setAttribute("stroke-dashoffset", ((t * 20) % 14).toFixed(1)); }
      },
    };
  },
};
