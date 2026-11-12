/* =========================================================
   StudyPipe explainer-video kit · heart
   Front (ventral) view of the mammalian heart, drawn the WAEC way: the patient's RIGHT side is on the viewer's LEFT.
   Chambers + septum (LV wall ≈ 3× RV), great vessels, four valves that open and close on real cardiac-cycle timing
   (0.1 s atrial systole · 0.3 s ventricular systole · 0.4 s diastole at 75 bpm), "LUB"/"DUB", the SAN → AVN → Bundle of His
   → Purkinje wave, and deoxygenated (blue) / oxygenated (red) blood flow.
   Contract: .agents/skills/explainer-video/references/adding-a-kit.md · every frame is a pure function of (t, P).
   ========================================================= */
(window.VIDEO_KITS = window.VIDEO_KITS || {}).heart = {
  title: "Front-view mammalian heart: chambers, valves, cardiac cycle, conduction, blood flow",
  states: {
    beat: "0/1: the heart beats through the cardiac cycle (uses hr)",
    hr: "heart rate in bpm (default 75 → 0.8 s cycle)",
    phase: "freeze one phase for teaching: 'atrial' | 'ventricular' | 'diastole' | null",
    flow: "0/1: blood flows (blue right side, red left side)",
    conduct: "0/1: show the conduction system and its wave (SAN → AVN → Bundle of His → Purkinje)",
    labels: "0/1: chamber and vessel labels",
    valveLabels: "0/1: valve labels (tricuspid, bicuspid, semilunar)",
    sounds: "0/1: show LUB when the AV valves close and DUB when the semilunar valves close",
    walls: "0/1: show the wall-thickness callout (LV ≈ 3× RV)",
    focus: "ring one part: 'RA' | 'RV' | 'LA' | 'LV' | 'SAN' | 'AVN' | 'tricuspid' | 'bicuspid' | 'aortic' | 'pulmonary' | 'septum' | null",
  },
  focus: {
    RA: [52, 92, 166, 140], RV: [52, 206, 176, 170], LA: [204, 92, 166, 140], LV: [196, 206, 196, 180],
    right: [24, 30, 214, 360], left: [184, 30, 226, 360], valves: [72, 168, 312, 96],
    tricuspid: [78, 178, 132, 84], bicuspid: [228, 178, 132, 84], conduction: [120, 92, 186, 300],
    SAN: [126, 86, 112, 96], arteries: [160, 14, 248, 236],
  },
  create(svg, api) {
    const { el, tx, mixN, clamp, frac, seg } = api;
    const BLUE = "#4f7fe0", BLUE_F = "rgba(79,127,224,.30)", RED = "#e2464f", RED_F = "rgba(226,70,79,.30)", WALL = "#e7b8a8", GOLD = "#ffd25e";
    const g = el("g", {}, svg);

    // ---------- great vessels (behind the chambers) ----------
    el("path", { d: "M100 40 H132 V118 H100 Z", fill: BLUE_F, stroke: BLUE, "stroke-width": 3 }, g);                // superior vena cava
    el("path", { d: "M18 170 H74 V196 H18 Z", fill: BLUE_F, stroke: BLUE, "stroke-width": 3 }, g);                  // inferior vena cava (drawn entering from the side)
    el("path", { d: "M199 226 V64 C199 40 168 40 150 44 M221 226 V64 C221 40 252 40 270 44", fill: "none", stroke: BLUE, "stroke-width": 3 }, g); // pulmonary artery → lungs
    el("rect", { x: 200, y: 60, width: 20, height: 166, fill: BLUE_F }, g);
    el("path", { d: "M352 226 V58 C352 26 384 26 398 40 M374 226 V60", fill: "none", stroke: RED, "stroke-width": 3 }, g);   // aorta
    el("rect", { x: 353, y: 60, width: 20, height: 166, fill: RED_F }, g);
    el("path", { d: "M252 40 V112 M298 40 V112", stroke: RED, "stroke-width": 9, "stroke-linecap": "round", fill: "none", opacity: .7 }, g); // pulmonary veins

    // ---------- chambers ----------
    const chamber = (x, y, w, h, fill, stroke, sw) => {
      const cg = el("g", {}, g);
      el("rect", { x, y, width: w, height: h, rx: 22, fill, stroke, "stroke-width": sw }, cg);
      return { g: cg, cx: x + w / 2, cy: y + h / 2 };
    };
    const RA = chamber(70, 112, 126, 104, BLUE_F, WALL, 5);
    const LA = chamber(226, 112, 126, 104, RED_F, WALL, 5);
    const RV = chamber(70, 226, 134, 128, BLUE_F, WALL, 6);
    const LV = chamber(214, 226, 152, 148, RED_F, WALL, 18);     // thick left-ventricle wall
    const septum = el("rect", { x: 203, y: 222, width: 12, height: 146, rx: 5, fill: WALL }, g);

    // ---------- valves ----------
    const flap = () => el("line", { stroke: "#fff4e8", "stroke-width": 5, "stroke-linecap": "round" }, g);
    const valve = (x0, x1, y, dir) => ({ x0, x1, y, dir, a: flap(), b: flap() });   // dir +1 opens downward (AV), -1 upward (semilunar)
    const V = { tricuspid: valve(92, 176, 221, 1), bicuspid: valve(240, 324, 221, 1), pulmonary: valve(200, 220, 226, -1), aortic: valve(353, 373, 226, -1) };
    const setValve = (v, open) => {
      const L = (v.x1 - v.x0) / 2, a = open * (v.dir > 0 ? 1.25 : 1.35), dx = L * Math.cos(a), dy = v.dir * L * Math.sin(a);
      v.a.setAttribute("x1", v.x0); v.a.setAttribute("y1", v.y); v.a.setAttribute("x2", (v.x0 + dx).toFixed(1)); v.a.setAttribute("y2", (v.y + dy).toFixed(1));
      v.b.setAttribute("x1", v.x1); v.b.setAttribute("y1", v.y); v.b.setAttribute("x2", (v.x1 - dx).toFixed(1)); v.b.setAttribute("y2", (v.y + dy).toFixed(1));
    };

    // ---------- blood flow ----------
    const path = (pts) => { const seg = []; let L = 0; for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); L += d; } return { pts, seg, L }; };
    const at = (P, q) => { let d = q * P.L; for (let i = 0; i < P.seg.length; i++) { if (d <= P.seg[i]) { const u = d / P.seg[i], a = P.pts[i], b = P.pts[i + 1]; return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u]; } d -= P.seg[i]; } return P.pts[P.pts.length - 1]; };
    const RIGHT = path([[116, 44], [116, 150], [134, 200], [134, 236], [118, 300], [170, 330], [210, 250], [210, 70], [176, 46]]);
    const LEFT = path([[275, 44], [275, 150], [282, 200], [282, 236], [258, 320], [330, 340], [363, 250], [363, 64], [392, 38]]);
    const dots = [];
    const flowG = el("g", {}, g);
    for (let i = 0; i < 14; i++) dots.push({ c: el("circle", { r: 5.5, fill: BLUE, stroke: "#fff", "stroke-width": 1 }, flowG), P: RIGHT, off: i / 14 });
    for (let i = 0; i < 14; i++) dots.push({ c: el("circle", { r: 5.5, fill: RED, stroke: "#fff", "stroke-width": 1 }, flowG), P: LEFT, off: i / 14 + .035 });

    // ---------- conduction system ----------
    const condG = el("g", {}, g);
    el("path", { d: "M182 128 L206 214", stroke: GOLD, "stroke-width": 2, "stroke-dasharray": "4 5", fill: "none", opacity: .7 }, condG);
    el("path", { d: "M209 220 V340 M209 340 C160 372 96 350 84 300 M209 340 C262 384 350 370 360 300", stroke: GOLD, "stroke-width": 3, fill: "none", opacity: .75 }, condG);
    el("circle", { cx: 182, cy: 128, r: 8, fill: GOLD }, condG);      // SAN
    el("circle", { cx: 207, cy: 214, r: 7, fill: GOLD }, condG);      // AVN
    const condLab = el("g", {}, condG);
    tx("SAN", 158, 102, 15, GOLD, condLab, "middle", 800); tx("AVN", 176, 238, 13, GOLD, condLab, "end", 800);
    tx("Bundle of His", 224, 356, 13, GOLD, condLab, "start", 700); tx("Purkinje fibres", 120, 386, 13, GOLD, condLab, "middle", 700);
    const wave = el("circle", { r: 11, fill: "#fff3b0", stroke: GOLD, "stroke-width": 3 }, condG);
    const atrialGlow = el("rect", { x: 66, y: 108, width: 290, height: 112, rx: 26, fill: GOLD, opacity: 0 }, g);
    const SAN_AVN = path([[182, 128], [207, 214]]), HIS = path([[209, 220], [209, 340], [180, 360], [110, 350], [84, 300]]), HIS_L = path([[209, 340], [262, 380], [350, 370], [360, 300]]);
    const wave2 = el("circle", { r: 9, fill: "#fff3b0", stroke: GOLD, "stroke-width": 3 }, condG);

    // ---------- labels, sounds, wall callout, focus ring ----------
    const labG = el("g", {}, g);
    tx("RA", 133, 166, 22, "#e8efe9", labG, "middle", 800); tx("LA", 289, 166, 22, "#e8efe9", labG, "middle", 800);
    tx("RV", 137, 292, 22, "#e8efe9", labG, "middle", 800); tx("LV", 290, 300, 22, "#e8efe9", labG, "middle", 800);
    tx("vena cava", 94, 62, 13, BLUE, labG, "end", 700); tx("to lungs", 168, 26, 13, BLUE, labG, "middle", 700);
    tx("from lungs", 276, 26, 13, RED, labG, "middle", 700); tx("aorta", 376, 16, 13, RED, labG, "middle", 700);
    const vLab = el("g", {}, g);
    tx("tricuspid", 134, 252, 12, "#fff4e8", vLab, "middle", 700); tx("bicuspid", 282, 252, 12, "#fff4e8", vLab, "middle", 700);
    tx("semilunar", 210, 202, 11, "#fff4e8", vLab, "middle", 700);   // inside the pulmonary artery, above its valve tx("semilunar", 380, 244, 11, "#fff4e8", vLab, "start", 700);
    const wallG = el("g", {}, g);
    el("path", { d: "M70 300 h-14 M76 300 h-6", stroke: "#ffe08a", "stroke-width": 2 }, wallG);
    tx("thin wall", 60, 398, 13, "#ffe08a", wallG, "start", 700);
    tx("thick wall ≈ 3×", 300, 398, 13, "#ffe08a", wallG, "middle", 800);
    el("line", { x1: 364, y1: 330, x2: 364, y2: 382, stroke: "#ffe08a", "stroke-width": 2 }, wallG);
    const lub = tx("LUB", 210, 262, 28, "#ffffff", g, "middle", 900), dub = tx("DUB", 210, 262, 28, "#ffffff", g, "middle", 900);   // just below the valves, inside the `valves` close-up, between the valve labels
    const ring = el("circle", { r: 44, fill: "none", stroke: "#ffe08a", "stroke-width": 3, "stroke-dasharray": "7 6", opacity: 0 }, g);
    const SPOT = { RA: [133, 164, 62], RV: [137, 290, 70], LA: [289, 164, 62], LV: [290, 300, 82], SAN: [182, 128, 26], AVN: [207, 214, 24],
      tricuspid: [134, 222, 50], bicuspid: [282, 222, 50], aortic: [363, 226, 22], pulmonary: [210, 226, 22], septum: [209, 296, 34] };

    const squeeze = (ch, k) => ch.g.setAttribute("transform", `translate(${ch.cx} ${ch.cy}) scale(${k.toFixed(4)}) translate(${-ch.cx} ${-ch.cy})`);
    const PHASE_AT = { atrial: .06, ventricular: .3, diastole: .75 };

    return {
      draw(t, P) {
        const s = P.s, p = P.p, u = P.u;
        const hr = Math.max(30, mixN(p, s, "hr", u, 75)), beat = mixN(p, s, "beat", u);
        // cardiac cycle position c ∈ [0,1): 0–.125 atrial systole · .125–.5 ventricular systole · .5–1 diastole (0.1/0.3/0.4 s at 75 bpm)
        const c = s.phase && PHASE_AT[s.phase] != null ? PHASE_AT[s.phase] : beat > .5 ? frac(t * hr / 60) : .75;
        const atr = c < .125 ? Math.sin(Math.PI * c / .125) : 0, ven = c >= .125 && c < .5 ? Math.sin(Math.PI * (c - .125) / .375) : 0;
        squeeze(RA, 1 - .07 * atr); squeeze(LA, 1 - .07 * atr); squeeze(RV, 1 - .08 * ven); squeeze(LV, 1 - .08 * ven);
        const avOpen = c < .125 ? 1 : c < .14 ? 1 - seg(c, .125, .14) : c < .55 ? 0 : seg(c, .55, .6);
        const slOpen = c < .16 ? 0 : c < .19 ? seg(c, .16, .19) : c < .47 ? 1 : c < .5 ? 1 - seg(c, .47, .5) : 0;
        setValve(V.tricuspid, avOpen); setValve(V.bicuspid, avOpen); setValve(V.pulmonary, slOpen); setValve(V.aortic, slOpen);
        // sounds: LUB as the AV valves slam (start of ventricular systole), DUB as the semilunar valves snap (start of diastole)
        const snd = mixN(p, s, "sounds", u), live = s.phase ? 0 : 1;
        const lubK = c >= .125 && c < .3 ? 1 - seg(c, .125, .3) : 0, dubK = c >= .5 && c < .66 ? 1 - seg(c, .5, .66) : 0;
        lub.setAttribute("opacity", (snd * (live ? lubK : s.phase === "ventricular" ? 1 : 0)).toFixed(2));
        dub.setAttribute("opacity", (snd * (live ? dubK : s.phase === "diastole" ? 1 : 0)).toFixed(2));
        // flow
        const flow = mixN(p, s, "flow", u);
        flowG.setAttribute("opacity", flow.toFixed(2));
        if (flow > .01) dots.forEach(d => { const q = frac(d.off + t * (.05 + hr / 60 * .05)), xy = at(d.P, q); d.c.setAttribute("cx", xy[0].toFixed(1)); d.c.setAttribute("cy", xy[1].toFixed(1)); });
        // conduction
        const cond = mixN(p, s, "conduct", u);
        condG.setAttribute("opacity", cond.toFixed(2));
        if (cond > .01) {
          let w1 = null, w2 = null;
          if (c < .1) w1 = at(SAN_AVN, c / .1);                 // across the atria to the AVN
          else if (c < .125) w1 = at(SAN_AVN, 1);               // the AVN delay (~0.1 s)
          else if (c < .22) { const q = seg(c, .125, .22); w1 = at(HIS, q); w2 = at(HIS_L, clamp((q - .45) / .55, 0, 1)); }
          wave.setAttribute("opacity", w1 ? 1 : 0); if (w1) { wave.setAttribute("cx", w1[0].toFixed(1)); wave.setAttribute("cy", w1[1].toFixed(1)); }
          wave2.setAttribute("opacity", w2 && c >= .125 + .095 * .45 ? 1 : 0); if (w2) { wave2.setAttribute("cx", w2[0].toFixed(1)); wave2.setAttribute("cy", w2[1].toFixed(1)); }
          atrialGlow.setAttribute("opacity", (cond * .16 * atr).toFixed(3));
        } else atrialGlow.setAttribute("opacity", 0);
        labG.setAttribute("opacity", mixN(p, s, "labels", u).toFixed(2));
        condLab.setAttribute("opacity", mixN(p, s, "labels", u).toFixed(2));
        vLab.setAttribute("opacity", mixN(p, s, "valveLabels", u).toFixed(2));
        wallG.setAttribute("opacity", mixN(p, s, "walls", u).toFixed(2));
        const spot = SPOT[s.focus];
        ring.setAttribute("opacity", spot ? (.65 + .35 * Math.sin(t * 5)).toFixed(2) : 0);
        if (spot) { ring.setAttribute("cx", spot[0]); ring.setAttribute("cy", spot[1]); ring.setAttribute("r", spot[2]); }
      },
    };
  },
};
