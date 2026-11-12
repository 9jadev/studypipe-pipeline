/* =========================================================
   StudyPipe explainer-video kit · blood
   Three scenes in one kit (state `scene`):
   - 'cells': a centrifuged blood sample (55% plasma, 45% cells), a biconcave red cell with no nucleus (face and side view),
     a phagocyte (lobed nucleus), a lymphocyte (large round nucleus) and platelets (cell fragments).
   - 'clot':  a cut vessel. Stage 0 intact → 1 cut, red cells leak → 2 platelets + damaged tissue release thromboplastin →
     3 prothrombin → thrombin (needs Ca²⁺ and vitamin K) → 4 fibrinogen → fibrin threads, a mesh that traps cells and stops the leak.
     A cascade ladder lights up stage by stage.
   - 'match': ABO cross-matching. Donor red cells carry antigens (A ▲, B ●); recipient plasma carries antibodies (anti-a, anti-b).
     Clumping (agglutination) happens only when a donor antigen meets the matching antibody. The kit works this out from
     `donor` and `recipient`; it is never hand-placed.
   Contract: .agents/skills/explainer-video/references/adding-a-kit.md · every frame is a pure function of (t, P).
   ========================================================= */
(window.VIDEO_KITS = window.VIDEO_KITS || {}).blood = {
  title: "Blood: cells, clotting cascade and ABO cross-matching",
  states: {
    scene: "'cells' | 'clot' | 'match'",
    labels: "0/1: labels in the current scene",
    plasma: "cells scene, 0/1: the centrifuged tube (55% plasma, 45% cells)",
    rbc: "cells scene, 0/1: red blood cell, face and side view (biconcave, no nucleus)",
    wbc: "cells scene, 0/1: phagocyte and lymphocyte",
    platelets: "cells scene, 0/1: platelets",
    stage: "clot scene, 0–4: intact · cut · thromboplastin · thrombin · fibrin clot",
    donor: "match scene: donor blood group 'A' | 'B' | 'AB' | 'O'",
    recipient: "match scene: recipient blood group 'A' | 'B' | 'AB' | 'O'",
    mix: "match scene, 0/1: donor cells mixed into the recipient's plasma",
    focus: "ring a part: 'tube' | 'rbc' | 'wbc' | 'platelets' | 'cut' | 'cascade' | 'donor' | 'recipient' | null",
  },
  focus: {
    tube: [6, 40, 190, 340], rbc: [196, 56, 218, 128], wbc: [196, 176, 218, 128], platelets: [196, 296, 218, 110],
    cut: [120, 6, 200, 190], cascade: [6, 196, 408, 214], donor: [6, 16, 210, 172], recipient: [206, 16, 210, 186], result: [6, 210, 408, 200],
  },
  create(svg, api) {
    const { el, tx, mixN, frac, clamp, lerp, ease } = api;
    const RED = "#d9343f", RED_L = "#ff8a8a", WALL = "#e7b8a8", PLASMA = "#f2d16b", LILAC = "#cdb8f0", PURPLE = "#7a4fc0", GOLD = "#ffe08a", A_COL = "#ffa04d", B_COL = "#73d6ff", OK = "#7cf0a5";
    const rnd = (() => { let a = 7; return () => { a = (a * 9301 + 49297) % 233280; return a / 233280; }; })();
    const scenes = { cells: el("g", {}, svg), clot: el("g", {}, svg), match: el("g", {}, svg) };
    const ring = el("circle", { fill: "none", stroke: GOLD, "stroke-width": 3, "stroke-dasharray": "7 6", opacity: 0 }, svg);
    const SPOT = { tube: [62, 220, 120], rbc: [300, 112, 70], wbc: [300, 232, 70], platelets: [300, 340, 60], cut: [215, 80, 70], cascade: [210, 300, 110], donor: [110, 95, 90], recipient: [312, 105, 95] };

    // ================= scene: cells =================
    const C = scenes.cells;
    const tubeG = el("g", {}, C);
    el("rect", { x: 34, y: 60, width: 58, height: 300, rx: 26, fill: "rgba(255,255,255,.06)", stroke: "#cfd8d3", "stroke-width": 3 }, tubeG);
    el("rect", { x: 38, y: 110, width: 50, height: 137, fill: PLASMA, opacity: .85 }, tubeG);            // 55% plasma
    el("rect", { x: 38, y: 247, width: 50, height: 109, rx: 22, fill: "#8e1d28" }, tubeG);               // 45% cells
    const tubeLab = el("g", {}, tubeG);
    tx("plasma 55%", 100, 178, 14, PLASMA, tubeLab, "start", 800); tx("cells 45%", 100, 302, 14, RED_L, tubeLab, "start", 800);
    const rbcG = el("g", {}, C);
    el("circle", { cx: 252, cy: 104, r: 32, fill: RED }, rbcG); el("circle", { cx: 252, cy: 104, r: 15, fill: "#b8232e" }, rbcG);   // face: pale centre = biconcave
    el("path", { d: "M318 88 C330 80 346 80 352 94 C356 102 360 102 364 94 C370 80 386 80 398 88 C408 96 408 112 398 120 C386 128 370 128 364 114 C360 106 356 106 352 114 C346 128 330 128 318 120 C308 112 308 96 318 88 Z", fill: RED }, rbcG); // side: dumbbell
    const rbcLab = el("g", {}, rbcG);
    tx("red cell: no nucleus", 300, 160, 14, RED_L, rbcLab, "middle", 800);
    tx("face", 252, 56, 12, "#cfd8d3", rbcLab, "middle", 700); tx("side", 358, 64, 12, "#cfd8d3", rbcLab, "middle", 700);
    const wbcG = el("g", {}, C);
    el("circle", { cx: 252, cy: 228, r: 30, fill: LILAC }, wbcG);
    [[240, 222], [252, 236], [264, 222]].forEach(([x, y]) => el("circle", { cx: x, cy: y, r: 8, fill: PURPLE }, wbcG));               // lobed nucleus
    el("path", { d: "M240 222 L252 236 L264 222", stroke: PURPLE, "stroke-width": 4, fill: "none" }, wbcG);
    el("circle", { cx: 356, cy: 228, r: 26, fill: LILAC }, wbcG); el("circle", { cx: 356, cy: 228, r: 19, fill: PURPLE }, wbcG);       // lymphocyte
    const wbcLab = el("g", {}, wbcG);
    tx("phagocyte", 252, 276, 13, LILAC, wbcLab, "middle", 800); tx("lymphocyte", 356, 276, 13, LILAC, wbcLab, "middle", 800);
    const pltG = el("g", {}, C), plts = [];
    for (let i = 0; i < 6; i++) plts.push({ e: el("ellipse", { cx: 228 + i * 30, cy: 330, rx: 7 + rnd() * 4, ry: 4 + rnd() * 2, fill: "#e8dcc8" }, pltG), ph: rnd() * 6 });
    const pltLab = el("g", {}, pltG);
    tx("platelets (fragments)", 300, 368, 13, "#e8dcc8", pltLab, "middle", 800);

    // ================= scene: clot =================
    const K = scenes.clot;
    el("rect", { x: 10, y: 6, width: 400, height: 70, rx: 10, fill: "#5a3a3e" }, K);                    // tissue above the vessel
    el("rect", { x: 14, y: 84, width: 392, height: 84, fill: "rgba(226,70,79,.25)" }, K);                 // lumen
    const wallL = el("rect", { x: 14, y: 74, width: 176, height: 12, rx: 4, fill: WALL }, K), wallR = el("rect", { x: 240, y: 74, width: 166, height: 12, rx: 4, fill: WALL }, K);
    const wallMid = el("rect", { x: 188, y: 74, width: 54, height: 12, fill: WALL }, K);
    el("rect", { x: 14, y: 166, width: 392, height: 12, rx: 4, fill: WALL }, K);
    const flow = [], leak = [];
    for (let i = 0; i < 10; i++) flow.push({ e: el("ellipse", { rx: 11, ry: 7, fill: RED }, K), off: i / 10, y: 106 + (i % 3) * 16 });
    for (let i = 0; i < 5; i++) leak.push({ e: el("ellipse", { rx: 9, ry: 6, fill: RED }, K), off: i / 5, x: 198 + (i % 3) * 14 });
    const pltClot = el("g", {}, K);
    [[194, 70], [206, 64], [222, 70], [236, 66], [214, 58], [200, 80], [230, 82]].forEach(([x, y]) => el("ellipse", { cx: x, cy: y, rx: 7, ry: 4, fill: "#e8dcc8" }, pltClot));
    const sparks = []; for (let i = 0; i < 8; i++) sparks.push({ e: el("circle", { r: 3, fill: GOLD }, K), a: i / 8 * 6.283 });
    const thrombinGlow = el("circle", { cx: 215, cy: 72, r: 46, fill: "#ff7a2a", opacity: 0 }, K);
    const fibrin = el("g", {}, K);
    for (let i = 0; i < 9; i++) { const y0 = 30 + rnd() * 60, y1 = 30 + rnd() * 60; el("line", { x1: 172 + rnd() * 10, y1: y0, x2: 248 + rnd() * 10, y2: y1, stroke: "#f4ecd8", "stroke-width": 2.2 }, fibrin); }
    [[200, 50], [228, 60], [212, 76]].forEach(([x, y]) => el("ellipse", { cx: x, cy: y, rx: 10, ry: 6, fill: RED }, fibrin));
    const clotLab = el("g", {}, K);
    tx("cut", 300, 40, 15, GOLD, clotLab, "middle", 800); tx("vessel", 60, 196, 13, WALL, clotLab, "middle", 700);
    // cascade ladder
    const rows = [
      ["damaged tissue + platelets", "thromboplastin", ""],
      ["prothrombin", "thrombin", "Ca²⁺ · vitamin K"],
      ["fibrinogen (soluble)", "fibrin (threads)", ""],
    ].map((r, i) => {
      const g = el("g", {}, K), y = 236 + i * 60;
      el("rect", { x: 14, y: y - 18, width: 188, height: 36, rx: 10, fill: "#262b38", stroke: "#4a5266", "stroke-width": 2 }, g);
      el("rect", { x: 246, y: y - 18, width: 160, height: 36, rx: 10, fill: "#33261c", stroke: "#ffa04d", "stroke-width": 2 }, g);
      tx(r[0], 108, y, 13, "#e8efe9", g, "middle", 700); tx(r[1], 326, y, 13, "#ffd0a0", g, "middle", 800);
      el("path", { d: `M206 ${y} H240 M232 ${y - 6} L240 ${y} L232 ${y + 6}`, stroke: GOLD, "stroke-width": 3, fill: "none" }, g);
      if (r[2]) tx(r[2], 224, y - 26, 12, GOLD, g, "middle", 800);
      return g;
    });

    // ================= scene: match =================
    const M = scenes.match;
    const ANT = { A: ["A"], B: ["B"], AB: ["A", "B"], O: [] };                 // antigens on red cells
    const ABS = { A: ["b"], B: ["a"], AB: [], O: ["a", "b"] };                 // antibodies in plasma
    el("rect", { x: 220, y: 34, width: 188, height: 160, rx: 14, fill: "rgba(242,209,107,.16)", stroke: PLASMA, "stroke-width": 2 }, M);
    const donorT = tx("", 110, 34, 15, "#e8efe9", M, "middle", 800), recipT = tx("", 314, 24, 15, "#e8efe9", M, "middle", 800);
    const cellsM = [[62, 96], [112, 82], [160, 102]].map(([x, y]) => {
      const g = el("g", {}, M);
      el("circle", { cx: 0, cy: 0, r: 21, fill: RED }, g); el("circle", { cx: 0, cy: 0, r: 9, fill: "#b8232e" }, g);
      const aG = el("g", {}, g), bG = el("g", {}, g);
      for (let k = 0; k < 4; k++) { const a = k / 4 * 6.283 + .4; el("path", { d: `M${(Math.cos(a) * 26).toFixed(1)} ${(Math.sin(a) * 26).toFixed(1)} l-5 7 h10 z`, fill: A_COL }, aG); }
      for (let k = 0; k < 4; k++) { const a = k / 4 * 6.283 + 1.2; el("circle", { cx: (Math.cos(a) * 26).toFixed(1), cy: (Math.sin(a) * 26).toFixed(1), r: 4.5, fill: B_COL }, bG); }
      return { g, x, y, aG, bG };
    });
    const Y = (col) => { const g = el("g", {}, M); el("path", { d: "M0 10 V0 L-7 -8 M0 0 L7 -8", stroke: col, "stroke-width": 3, fill: "none", "stroke-linecap": "round" }, g); return g; };
    const abA = [0, 1, 2, 3].map(i => ({ e: Y(A_COL), x: 240 + i * 44, y: 168 })), abB = [0, 1, 2, 3].map(i => ({ e: Y(B_COL), x: 252 + i * 44, y: 54 }));
    const bridges = el("g", {}, M);
    for (let i = 0; i < 4; i++) el("path", { d: "", stroke: GOLD, "stroke-width": 3, fill: "none" }, bridges);
    const legend = el("g", {}, M);
    el("path", { d: "M30 252 l-6 9 h12 z", fill: A_COL }, legend); tx("antigen A", 44, 258, 13, A_COL, legend, "start", 800);
    el("circle", { cx: 30, cy: 286, r: 5, fill: B_COL }, legend); tx("antigen B", 44, 290, 13, B_COL, legend, "start", 800);
    tx("on red cells", 44, 316, 12, "#cfd8d3", legend, "start", 700);
    el("path", { d: "M236 262 V252 L229 244 M236 252 L243 244", stroke: A_COL, "stroke-width": 3, fill: "none" }, legend); tx("anti-a", 252, 258, 13, A_COL, legend, "start", 800);
    el("path", { d: "M236 294 V284 L229 276 M236 284 L243 276", stroke: B_COL, "stroke-width": 3, fill: "none" }, legend); tx("anti-b", 252, 290, 13, B_COL, legend, "start", 800);
    tx("in plasma", 252, 316, 12, "#cfd8d3", legend, "start", 700);
    const result = tx("", 210, 372, 18, OK, M, "middle", 900);

    const showScene = (P) => {
      const s = P.s, p = P.p, u = P.u, cur = s.scene || "cells", prev = p.scene || cur;
      for (const k in scenes) scenes[k].setAttribute("opacity", (k === cur ? (prev === cur ? 1 : u) : k === prev ? 1 - u : 0).toFixed(3));
      return cur;
    };

    return {
      draw(t, P) {
        const s = P.s, p = P.p, u = P.u, scene = showScene(P), lab = mixN(p, s, "labels", u);
        // ---- cells ----
        if (scene === "cells") {
          tubeG.setAttribute("opacity", mixN(p, s, "plasma", u).toFixed(2)); tubeLab.setAttribute("opacity", lab.toFixed(2));
          rbcG.setAttribute("opacity", mixN(p, s, "rbc", u).toFixed(2)); rbcLab.setAttribute("opacity", lab.toFixed(2));
          wbcG.setAttribute("opacity", mixN(p, s, "wbc", u).toFixed(2)); wbcLab.setAttribute("opacity", lab.toFixed(2));
          pltG.setAttribute("opacity", mixN(p, s, "platelets", u).toFixed(2)); pltLab.setAttribute("opacity", lab.toFixed(2));
          rbcG.setAttribute("transform", `translate(0 ${(Math.sin(t * 1.4) * 3).toFixed(1)})`);
          plts.forEach(o => o.e.setAttribute("transform", `translate(0 ${(Math.sin(t * 2 + o.ph) * 4).toFixed(1)})`));
        }
        // ---- clot ----
        if (scene === "clot") {
          const st = mixN(p, s, "stage", u);
          const cut = clamp(st, 0, 1), plt = clamp(st - 1, 0, 1), thr = clamp(st - 2, 0, 1), fib = clamp(st - 3, 0, 1);
          wallMid.setAttribute("opacity", (1 - cut).toFixed(2));
          flow.forEach(o => { const x = 24 + frac(o.off + t * .08) * 372; o.e.setAttribute("cx", x.toFixed(1)); o.e.setAttribute("cy", o.y); });
          leak.forEach(o => { const q = frac(o.off + t * .3); o.e.setAttribute("cx", o.x); o.e.setAttribute("cy", (84 - q * 70).toFixed(1)); o.e.setAttribute("opacity", (cut * (1 - fib) * (1 - q * .6)).toFixed(2)); });
          pltClot.setAttribute("opacity", plt.toFixed(2));
          sparks.forEach(o => { const q = frac(t * .6 + o.a), r = 10 + q * 34; o.e.setAttribute("cx", (215 + Math.cos(o.a) * r).toFixed(1)); o.e.setAttribute("cy", (70 + Math.sin(o.a) * r * .6).toFixed(1)); o.e.setAttribute("opacity", (plt * (1 - fib * .7) * (1 - q)).toFixed(2)); });
          thrombinGlow.setAttribute("opacity", (thr * (1 - fib * .5) * (.22 + .08 * Math.sin(t * 5))).toFixed(3));
          fibrin.setAttribute("opacity", fib.toFixed(2));
          rows.forEach((g, i) => g.setAttribute("opacity", (.22 + .78 * clamp(st - 1 - i, 0, 1)).toFixed(2)));
          clotLab.setAttribute("opacity", (lab * cut).toFixed(2));
        }
        // ---- match ----
        if (scene === "match") {
          const d = ANT[s.donor] ? s.donor : "A", r = ABS[s.recipient] ? s.recipient : "B";
          const ag = ANT[d], ab = ABS[r], clump = ag.some(a => ab.includes(a.toLowerCase()));
          donorT.textContent = `donor: group ${d}`; recipT.textContent = `recipient ${r}: ${ab.length ? ab.map(x => "anti-" + x).join(" + ") : "no antibodies"}`;
          const mix = mixN(p, s, "mix", u), cl = clump ? ease(clamp((mix - .5) * 2, 0, 1)) : 0;
          cellsM.forEach((c, i) => {
            c.aG.setAttribute("opacity", ag.includes("A") ? 1 : 0); c.bG.setAttribute("opacity", ag.includes("B") ? 1 : 0);
            const tx0 = 270 + i * 44, ty0 = 112 + (i % 2) * 18, cx0 = 300 + (i - 1) * 24, cy0 = 112;     // mixed spot · clumped spot
            const x = lerp(lerp(c.x, tx0, ease(clamp(mix * 2, 0, 1))), cx0, cl), y = lerp(lerp(c.y, ty0, ease(clamp(mix * 2, 0, 1))), cy0, cl);
            c.g.setAttribute("transform", `translate(${x.toFixed(1)} ${(y + Math.sin(t * 2 + i) * 2 * (1 - cl)).toFixed(1)})`);
          });
          abA.forEach(o => { o.e.setAttribute("opacity", ab.includes("a") ? 1 : 0); o.e.setAttribute("transform", `translate(${o.x} ${(o.y + Math.sin(t * 1.5 + o.x) * 3).toFixed(1)})`); });
          abB.forEach(o => { o.e.setAttribute("opacity", ab.includes("b") ? 1 : 0); o.e.setAttribute("transform", `translate(${o.x} ${(o.y + Math.sin(t * 1.5 + o.x) * 3).toFixed(1)})`); });
          const bp = bridges.children; [[276, 112], [300, 98], [324, 112], [300, 126]].forEach(([x, y], i) => bp[i].setAttribute("d", `M${x - 8} ${y} l8 -6 l8 6`));
          bridges.setAttribute("opacity", cl.toFixed(2));
          result.textContent = clump ? "AGGLUTINATION ✗ unsafe" : "no clumping ✓ safe";
          result.setAttribute("fill", clump ? RED_L : OK);
          result.setAttribute("opacity", clamp((mix - .8) * 5, 0, 1).toFixed(2));
          legend.setAttribute("opacity", lab.toFixed(2));
        }
        const spot = SPOT[s.focus];
        ring.setAttribute("opacity", spot ? (.65 + .35 * Math.sin(t * 5)).toFixed(2) : 0);
        if (spot) { ring.setAttribute("cx", spot[0]); ring.setAttribute("cy", spot[1]); ring.setAttribute("r", spot[2]); }
      },
    };
  },
};
