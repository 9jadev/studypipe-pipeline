/* =========================================================
   StudyPipe explainer-video kit · microscope
   Three scenes in one kit (state `scene`, cross-fades):
   - 'scope': a school compound light microscope, side view (eyepiece, body tube, revolving nosepiece with ×4 / ×10 / ×40
     objectives of increasing length, stage + slide + two clips, condenser with diaphragm lever, concave mirror, arm, base,
     coarse and fine knobs). The nosepiece swings the chosen objective down onto the optical axis; the ×40 sits closest to
     the slide. A light beam runs mirror → slide → objective → tube → eyepiece → eye. The readout card computes
     eyepiece × objective (never a sum). The knobs turn and move the stage (coarse: large travel, fine: tiny).
   - 'field': the view down the eyepiece. Cells are drawn TO SCALE: on-screen cell width = circle diameter × cell ÷ fov, so
     fov ÷ cell cells fit across the diameter. The counter shows N = round(fov ÷ cell), computed here. Cork (dead, empty
     walls), onion (iodine, box cells, nucleus, no chloroplasts), blood (biconcave anucleate red cells + one white cell),
     cheek (flat irregular cells, central nucleus, no wall).
   - 'photo': a photomicrograph with a measured cell; the cell lifts off and shrinks onto a 1 mm scale to its real size,
     actual = image ÷ magnification (2 significant figures), optionally in µm (× 1000).
   Contract: .agents/skills/explainer-video/references/adding-a-kit.md · every frame is a pure function of (t, P).
   ========================================================= */
(window.VIDEO_KITS = window.VIDEO_KITS || {}).microscope = {
  title: "Compound light microscope: parts, magnification, field of view and actual size",
  states: {
    scene: "'scope' | 'field' | 'photo' (cross-fades)",
    labels: "0/1: part labels in the current scene",
    focus: "ring a close-up: scope 'eyepiece' | 'objectives' | 'stage' | 'mirror' | 'knobs' | 'readout' · field 'field' | 'row' | 'ruler' | 'cell' · photo 'bracket' | 'actual' · or null",
    objective: "scope: 4 | 10 | 40, objective swung onto the slide (nosepiece animates; the active one glows)",
    eyepiece: "scope: eyepiece power, default 10 (engraved on the eyepiece, used by the readout)",
    light: "scope, 0/1: light beam mirror → slide → objective → tube → eyepiece → eye",
    readout: "scope, 0/1: card 'eyepiece × objective = total', computed by the kit (never a sum)",
    knob: "scope: null | 'coarse' | 'fine', that knob turns and the stage moves (coarse large travel, fine tiny)",
    slide: "field: 'cork' | 'onion' | 'blood' | 'cheek'",
    fov: "field: field-of-view diameter in mm (zoom animates; shown to 2 s.f.)",
    cell: "field: real cell width in mm, default 0.05 (sets the drawing scale; blood: red-cell diameter, e.g. 0.008)",
    mag: "field: total magnification badge, e.g. 40 | 100 | 200 | 400",
    ruler: "field, 0/1: the labelled diameter line",
    count: "field, 0/1: highlight one row of cells along the diameter + 'N cells', N = round(fov ÷ cell)",
    specimen: "photo: 'cheek' | 'onion'",
    image: "photo: measured image length in mm (bracket label)",
    shrink: "photo, 0–1: the cell lifts off the photo and shrinks to its real size on a 1 mm scale",
    um: "photo, 0/1: also show the actual size in µm (× 1000)",
  },
  // Camera close-ups ([x, y, w, h] in the 420×420 drawing). `cell` and `row` follow the current zoom (updated every frame).
  focus: {
    eyepiece: [24, 0, 210, 124], objectives: [24, 146, 240, 120], stage: [24, 214, 256, 98], mirror: [24, 270, 240, 130],
    knobs: [204, 146, 200, 110], readout: [248, 4, 172, 116],
    field: [50, 4, 320, 412], row: [56, 150, 308, 80], ruler: [56, 330, 308, 76], cell: [175, 155, 70, 70],
    bracket: [20, 148, 280, 100], actual: [20, 276, 320, 100],
  },
  create(svg, api) {
    const { el, tx, mixN, lerp, ease, clamp, seg, PAL, COLOR, meta } = api;
    const KREF = window.VIDEO_KITS.microscope;
    const role = (r, d) => (meta && meta.roles && meta.roles[r]) ? COLOR(r) : d;
    const sig2 = v => !(v > 0) ? "0" : v >= 99.5 ? String(Math.round(v)) : v.toPrecision(2);
    const int = v => String(Math.round(v));
    const mixLog = (p, s, k, u, d) => { const a = p[k] != null ? +p[k] : d, b = s[k] != null ? +s[k] : d; return Math.exp(lerp(Math.log(a), Math.log(b), u)); };
    const rnd = (() => { let a = 11; return () => { a = (a * 9301 + 49297) % 233280; return a / 233280; }; })();
    const GOLD = "#ffe08a", INK = "#e8efe9", DIM = "#cfd8d3", CARD = "#1d2430", EDGE = "#4a5266";
    const defs = el("defs", {}, svg);
    const scenes = { scope: el("g", {}, svg), field: el("g", {}, svg), photo: el("g", {}, svg) };
    const ring = el("rect", { fill: "none", stroke: GOLD, "stroke-width": 3, "stroke-dasharray": "7 6", opacity: 0, "vector-effect": "non-scaling-stroke" }, svg);
    const halo = (e, c = "#0d1117") => { e.setAttribute("stroke", c); e.setAttribute("paint-order", "stroke"); e.setAttribute("stroke-linejoin", "round"); e.style.strokeWidth = "0.24em"; return e; };
    const leader = (g, w = 1.5) => {
      const a = el("line", { stroke: "#0d1117", "stroke-width": w + 2, "vector-effect": "non-scaling-stroke", "stroke-linecap": "round" }, g);
      const b = el("line", { stroke: "#f3f6f4", "stroke-width": w, "vector-effect": "non-scaling-stroke", "stroke-linecap": "round" }, g);
      const d = el("circle", { r: 2.4, fill: GOLD, stroke: "#0d1117", "stroke-width": 1, "vector-effect": "non-scaling-stroke" }, g);
      return { set(x1, y1, x2, y2, r) { for (const l of [a, b]) { l.setAttribute("x1", x1.toFixed(1)); l.setAttribute("y1", y1.toFixed(1)); l.setAttribute("x2", x2.toFixed(1)); l.setAttribute("y2", y2.toFixed(1)); } d.setAttribute("cx", x2.toFixed(1)); d.setAttribute("cy", y2.toFixed(1)); if (r) d.setAttribute("r", r.toFixed(2)); } };
    };

    // ======================= scene: scope =======================
    const SC = scenes.scope;
    const METAL = "#3d4652", METAL_D = "#262c35", RIM = "#8e9aab", CHROME = "#c3ccd6", CHROME_D = "#8792a0", BRASS = "#d1a64b", BRASS_D = "#7d5f22", GLASS = "rgba(170,215,255,.6)";
    const AX = 170, PIV = 182;                                  // optical axis x, nosepiece pivot y
    const amber = role("eyepiece", PAL.amber), sky = role("objective", PAL.sky), green = role("M", PAL.green);
    // incoming light (from the window / lamp, lower left) and the beam: drawn first so the instrument sits on top of the glow
    const lightIn = el("g", { opacity: 0 }, SC);
    el("path", { d: "M44 282 L160 314", stroke: GOLD, "stroke-width": 10, opacity: .25, "stroke-linecap": "round" }, lightIn);
    const inDash = el("path", { d: "M44 282 L160 314", stroke: GOLD, "stroke-width": 3, "stroke-dasharray": "6 10", "stroke-linecap": "round" }, lightIn);
    // base, pillar, joint, arm
    el("path", { d: "M98 394 Q94 368 122 362 H262 Q292 366 288 394 Z", fill: METAL, stroke: RIM, "stroke-width": 2 }, SC);
    el("path", { d: "M226 364 V302 H256 V364 Z", fill: METAL, stroke: RIM, "stroke-width": 2 }, SC);
    const ARM = "M242 300 C254 262 260 222 254 182 C248 142 234 112 192 94";
    el("path", { d: ARM, fill: "none", stroke: RIM, "stroke-width": 30, "stroke-linecap": "round" }, SC);
    el("path", { d: ARM, fill: "none", stroke: METAL, "stroke-width": 26, "stroke-linecap": "round" }, SC);
    el("path", { d: "M250 288 C258 252 262 220 258 184", fill: "none", stroke: "#56606e", "stroke-width": 4, "stroke-linecap": "round" }, SC);  // highlight
    el("circle", { cx: 241, cy: 300, r: 10, fill: METAL_D, stroke: RIM, "stroke-width": 2 }, SC);
    // mirror on its yoke (concave face up-left, toward the light)
    el("path", { d: "M226 316 H196", stroke: CHROME_D, "stroke-width": 5 }, SC);
    const mirrorG = el("g", { transform: `rotate(-14 ${AX} 316)` }, SC);
    el("path", { d: "M144 310 Q170 326 196 310 L198 316 Q170 334 142 316 Z", fill: METAL_D, stroke: RIM, "stroke-width": 1.5 }, mirrorG);
    el("path", { d: "M146 310 Q170 324 194 310", fill: "none", stroke: "#e6f0fa", "stroke-width": 3 }, mirrorG);
    // body tube + eyepiece
    el("rect", { x: 153, y: 66, width: 34, height: 96, rx: 3, fill: METAL, stroke: RIM, "stroke-width": 2 }, SC);
    el("rect", { x: 158, y: 70, width: 5, height: 88, fill: "#56606e" }, SC);
    el("rect", { x: 150, y: 62, width: 40, height: 9, rx: 3, fill: METAL_D, stroke: RIM, "stroke-width": 1.5 }, SC);
    el("rect", { x: 156, y: 33, width: 28, height: 30, fill: "#4a535f", stroke: RIM, "stroke-width": 1.5 }, SC);
    el("rect", { x: 151, y: 26, width: 38, height: 9, rx: 3, fill: METAL_D, stroke: RIM, "stroke-width": 1.5 }, SC);
    el("ellipse", { cx: AX, cy: 26, rx: 13, ry: 2.6, fill: GLASS }, SC);
    // objectives (on the nosepiece): ×4 short, ×10 medium, ×40 long; colour bands red / yellow / light blue (DIN code)
    const objLayer = el("g", {}, SC);
    const OBJ = [{ p: 4, L: 27, wb: 16, band: "#e0464f" }, { p: 10, L: 38, wb: 14, band: "#f2cc3a" }, { p: 40, L: 55, wb: 10, band: "#6fc3ff" }].map((o, i) => {
      const g = el("g", {}, objLayer), L = o.L;
      const glow = el("path", { d: `M-12 0 H12 L${o.wb / 2 + 1} ${L} H${-o.wb / 2 - 1} Z`, fill: "none", stroke: GOLD, "stroke-width": 7, "stroke-linejoin": "round", opacity: 0 }, g);
      el("rect", { x: -12, y: 0, width: 24, height: 7, rx: 2, fill: CHROME_D, stroke: "#4d5662", "stroke-width": 1 }, g);
      el("path", { d: `M-11 7 H11 L${o.wb / 2 + 1} ${L - 6} H${-o.wb / 2 - 1} Z`, fill: CHROME, stroke: "#4d5662", "stroke-width": 1 }, g);
      el("path", { d: `M4 7 H11 L${o.wb / 2 + 1} ${L - 6} H${o.wb / 2 - 4} Z`, fill: CHROME_D, opacity: .55 }, g);
      el("rect", { x: -o.wb / 2 - .5, y: L - 6, width: o.wb + 1, height: 6, rx: 1.5, fill: "#5d6773", stroke: "#4d5662", "stroke-width": 1 }, g);
      el("rect", { x: -o.wb / 2 - .8, y: L - 11, width: o.wb + 1.6, height: 3, fill: o.band }, g);
      el("ellipse", { cx: 0, cy: L, rx: o.wb / 2 - 1.5, ry: 1.3, fill: GLASS }, g);
      return { g, glow, L, i, p: o.p, ey: 7 + (L - 18) * .42 };
    });
    // nosepiece (in front of the objective tops)
    el("path", { d: "M151 160 H189 L205 179 Q172 194 139 180 Z", fill: "#55606d", stroke: RIM, "stroke-width": 2 }, SC);
    el("path", { d: "M147 176 Q172 188 201 176", fill: "none", stroke: "#7d8896", "stroke-width": 2 }, SC);
    // condenser (with diaphragm lever) + stage + slide + clips: the stage group moves with the focus knobs
    const stageG = el("g", {}, SC);
    el("rect", { x: 157, y: 255, width: 26, height: 22, rx: 3, fill: METAL_D, stroke: RIM, "stroke-width": 1.5 }, stageG);
    el("ellipse", { cx: AX, cy: 256, rx: 11, ry: 2, fill: GLASS }, stageG);
    el("path", { d: "M183 270 L199 276", stroke: CHROME_D, "stroke-width": 3, "stroke-linecap": "round" }, stageG);
    el("circle", { cx: 200, cy: 276, r: 3, fill: CHROME }, stageG);
    el("rect", { x: 98, y: 244, width: 152, height: 11, rx: 2, fill: METAL_D, stroke: RIM, "stroke-width": 1.5 }, stageG);
    el("rect", { x: 118, y: 238.5, width: 104, height: 5.5, rx: 1, fill: GLASS, stroke: "#bfe3ff", "stroke-width": 1 }, stageG);
    const specimenSpot = el("ellipse", { cx: AX, cy: 241, rx: 9, ry: 1.8, fill: "#d9a441" }, stageG);
    for (const [x0, x1] of [[108, 136], [232, 204]]) {
      el("path", { d: `M${x0} 239 Q${(x0 + x1) / 2} 233.5 ${x1} 237`, fill: "none", stroke: CHROME, "stroke-width": 3.2, "stroke-linecap": "round" }, stageG);
      el("circle", { cx: x0, cy: 239.5, r: 3.4, fill: CHROME_D, stroke: "#4d5662", "stroke-width": 1 }, stageG);
    }
    // stage carrier on the arm
    el("rect", { x: 236, y: 240, width: 16, height: 20, rx: 2, fill: METAL, stroke: RIM, "stroke-width": 1.5 }, SC);
    // focus knobs (brass, knurled, with an index mark so rotation reads)
    const knob = (x, y, r) => {
      const g = el("g", {}, SC);
      el("circle", { cx: 0, cy: 0, r: r + 1.5, fill: BRASS_D }, g);
      el("circle", { cx: 0, cy: 0, r, fill: BRASS, stroke: BRASS_D, "stroke-width": 1.5 }, g);
      for (let k = 0; k < 14; k++) { const a = k / 14 * 6.2832; el("line", { x1: (Math.cos(a) * r * .72).toFixed(1), y1: (Math.sin(a) * r * .72).toFixed(1), x2: (Math.cos(a) * r).toFixed(1), y2: (Math.sin(a) * r).toFixed(1), stroke: BRASS_D, "stroke-width": 1.2 }, g); }
      el("circle", { cx: 0, cy: 0, r: r * .38, fill: "#a7832f", stroke: BRASS_D, "stroke-width": 1 }, g);
      el("line", { x1: 0, y1: 0, x2: 0, y2: -r * .95, stroke: "#fff6d8", "stroke-width": 2.2, "stroke-linecap": "round" }, g);
      return { g, x, y };
    };
    const coarse = knob(254, 174, 18), fine = knob(257, 222, 10);
    // light beam + eye
    const beam = el("g", { opacity: 0 }, SC);
    const beamPath = el("path", { fill: GOLD, opacity: .34 }, beam);
    const beamCore = el("path", { stroke: "#fff4c2", "stroke-width": 2.2, "stroke-dasharray": "5 9", fill: "none", "stroke-linecap": "round" }, beam);
    const eye = el("g", { opacity: 0 }, SC);
    el("path", { d: "M154 11 Q170 -1 186 11 Q170 23 154 11 Z", fill: "#f3f6f4", stroke: "#0d1117", "stroke-width": 1.5 }, eye);
    el("circle", { cx: AX, cy: 11, r: 4.6, fill: "#5a3d1f" }, eye); el("circle", { cx: AX, cy: 11, r: 2, fill: "#0d1117" }, eye);
    // engravings sit above the beam (chrome halo) so the light never cuts through them
    const engLayer = el("g", {}, SC);
    const eyeT = halo(tx("×10", AX, 49, 12, "#f3f6f4", engLayer, "middle", 900), "#4a535f");
    OBJ.forEach(o => { o.eg = el("g", {}, engLayer); o.eng = halo(tx("×" + o.p, 0, o.ey, 12, "#1b2330", o.eg, "middle", 900), CHROME); });
    // readout card: eyepiece × objective = total (computed)
    const ro = el("g", { opacity: 0 }, SC);
    el("rect", { x: 258, y: 12, width: 156, height: 100, rx: 12, fill: CARD, stroke: EDGE, "stroke-width": 2 }, ro);
    tx("eyepiece × objective", 336, 31, 12, DIM, ro, "middle", 700);
    const roE = tx("", 322, 60, 20, amber, ro, "end", 900), roX = tx("×", 336, 60, 18, INK, ro, "middle", 800), roO = tx("", 350, 60, 20, sky, ro, "start", 900);
    const roM = tx("", 336, 92, 22, green, ro, "middle", 900);
    // part labels: left column ends at x 94, right column starts at x 292; short horizontal leaders, none across the beam
    const labS = el("g", {}, SC), labStage = el("g", {}, stageG);
    const L1 = (g, text, lx, ly, x2, y2, anchor = "end") => { const ld = leader(g, 1.3); ld.set(anchor === "end" ? lx + 4 : lx - 4, ly, x2, y2); halo(tx(text, lx, ly, 13, INK, g, anchor, 800)); return ld; };
    L1(labS, "eyepiece", 94, 44, 154, 46); L1(labS, "body tube", 94, 108, 152, 108); L1(labS, "nosepiece", 94, 168, 147, 170);
    const objLead = L1(labS, "objective", 94, 208, 159, 214);
    L1(labStage, "clip", 94, 234, 108, 238); L1(labStage, "stage", 94, 262, 100, 251);
    L1(labS, "mirror", 94, 336, 146, 318); L1(labS, "base", 94, 384, 100, 380);
    L1(labS, "arm", 292, 132, 246, 140, "start"); L1(labS, "coarse knob", 292, 174, 273, 174, "start"); L1(labS, "fine knob", 292, 222, 268, 222, "start");

    // ======================= scene: field =======================
    const FG = scenes.field;
    const CX = 210, CY = 190, R = 146;
    const clip = el("clipPath", { id: "mscope-clip" }, defs); el("circle", { cx: CX, cy: CY, r: R }, clip);
    el("rect", { x: 0, y: 0, width: 420, height: 420, rx: 18, fill: "#07090c" }, FG);
    const pat = (id, w, h) => el("pattern", { id, patternUnits: "userSpaceOnUse", width: w, height: h }, defs);
    const wrap9 = (w, h, fn) => { for (const dx of [-w, 0, w]) for (const dy of [-h, 0, h]) fn(dx, dy); };
    const smooth = pts => { let d = ""; const n = pts.length; for (let i = 0; i < n; i++) { const a = pts[i], b = pts[(i + 1) % n], m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; d += (i ? " Q" : "M" + ((pts[n - 1][0] + a[0]) / 2).toFixed(3) + " " + ((pts[n - 1][1] + a[1]) / 2).toFixed(3) + " Q") + a[0].toFixed(3) + " " + a[1].toFixed(3) + " " + m[0].toFixed(3) + " " + m[1].toFixed(3); } return d + " Z"; };
    const blob = (cx, cy, rx, ry, jit, n = 10, rot = 0) => { const pts = []; for (let i = 0; i < n; i++) { const a = i / n * 6.2832, f = 1 - jit / 2 + rnd() * jit; pts.push([cx + Math.cos(a + rot) * rx * f, cy + Math.sin(a + rot) * ry * f]); } return smooth(pts); };
    const SLIDES = {};
    // --- cork: honeycomb of thick brown walls round EMPTY (air) spaces; one cell = 1 unit across (flat to flat) ---
    {
      const P = pat("mscope-cork", 1, 1.7321), rr = 0.5774;
      el("rect", { x: 0, y: 0, width: 1, height: 1.7321, fill: "#f6ecd6" }, P);
      const hex = (cx, cy) => { let d = ""; for (let k = 0; k < 6; k++) { const a = (k * 60 - 90) * Math.PI / 180; d += (k ? "L" : "M") + (cx + Math.cos(a) * rr).toFixed(4) + " " + (cy + Math.sin(a) * rr).toFixed(4); } return d + "Z"; };
      for (const [x, y] of [[.5, 0], [.5, 1.7321], [0, .866], [1, .866]]) {
        el("path", { d: hex(x, y), fill: "#fbf3e2", stroke: "#7a4a22", "stroke-width": .13, "stroke-linejoin": "round" }, P);
        el("path", { d: hex(x, y), fill: "none", stroke: "#b07a45", "stroke-width": .04, transform: `translate(${x} ${y}) scale(.82) translate(${-x} ${-y})` }, P);
      }
      SLIDES.cork = { pat: P, bg: "#f4e6c8", oy: 0, rowH: 1, target: [.5, 0] };
    }
    // --- onion (iodine): box cells 1 × 4 units, long axis vertical, staggered rows; wall, granular cytoplasm, one nucleus ---
    {
      const P = pat("mscope-onion", 4, 8);
      el("rect", { x: 0, y: 0, width: 4, height: 8, fill: "#e9c877" }, P);
      const nuc = [[.55, 1.4], [.4, 2.9], [.6, 1.1], [.35, 2.6], [.5, 2.2], [.62, 3.0], [.42, 1.6], [.58, 2.5], [.45, 1.9], [.55, 2.8]];
      let q = 0;
      for (let j = 0; j < 4; j++) {
        const off = (j % 2) * 2;
        for (const y0 of [off - 4, off, off + 4]) {
          el("rect", { x: j + .03, y: y0 + .03, width: .94, height: 3.94, fill: "#ecd28c", stroke: "#8a5a1a", "stroke-width": .085 }, P);
          el("rect", { x: j + .16, y: y0 + .2, width: .68, height: 3.6, rx: .2, fill: "#f3e2ad", opacity: .75 }, P);       // vacuole (pale)
          for (let k = 0; k < 7; k++) el("circle", { cx: j + .1 + rnd() * .8, cy: y0 + .15 + rnd() * 3.7, r: .03, fill: "#b8862e" }, P);
          const [nx, ny] = nuc[q++ % nuc.length];
          el("ellipse", { cx: j + nx, cy: y0 + ny, rx: .2, ry: .15, fill: "#7a4a12" }, P);
          el("circle", { cx: j + nx + .04, cy: y0 + ny - .02, r: .05, fill: "#4a2a08" }, P);
        }
      }
      SLIDES.onion = { pat: P, bg: "#f0dda0", oy: -2, rowH: 1, target: [.5, 0], nucleus: [.55, -.6] };
    }
    // --- blood: biconcave red cells (pale centre, NO nucleus, no wall) in pale plasma; one white cell with a lobed nucleus ---
    const rbcGrad = el("radialGradient", { id: "mscope-rbc" }, defs);
    el("stop", { offset: "0", "stop-color": "#f4b2b2" }, rbcGrad); el("stop", { offset: ".45", "stop-color": "#e7838a" }, rbcGrad); el("stop", { offset: "1", "stop-color": "#c9343f" }, rbcGrad);
    const rbc = (g, x, y, r = .5) => el("circle", { cx: x.toFixed(3), cy: y.toFixed(3), r, fill: "url(#mscope-rbc)", stroke: "#a8202c", "stroke-width": .04 }, g);
    {
      const W = 6, H = 6, P = pat("mscope-blood", W, H), pts = [[.5, 0]];
      el("rect", { x: 0, y: 0, width: W, height: H, fill: "#f6e6e2" }, P);
      for (let tries = 0; pts.length < 22 && tries < 3000; tries++) {
        const c = [rnd() * W, rnd() * H];
        if (pts.every(p => { let dx = Math.abs(p[0] - c[0]), dy = Math.abs(p[1] - c[1]); dx = Math.min(dx, W - dx); dy = Math.min(dy, H - dy); return dx * dx + dy * dy > 1.15 * 1.15; })) pts.push(c);
      }
      pts.forEach(([x, y]) => wrap9(W, H, (dx, dy) => rbc(P, x + dx, y + dy)));
      SLIDES.blood = { pat: P, bg: "#f6e6e2", oy: 0, rowH: 1.04, target: [.5, 0] };
    }
    // --- cheek: flat irregular cells (no wall), thin membrane, central nucleus, some folded / overlapping (methylene blue) ---
    {
      const W = 2.2, H = 1.9, P = pat("mscope-cheek", W, H);
      el("rect", { x: 0, y: 0, width: W, height: H, fill: "#e6eef7" }, P);
      const cells = [[.5, 0, .5, .46], [1.62, .32, .52, .44], [1.08, 1.0, .5, .47], [0.02, .95, .48, .45]].map(([x, y, rx, ry], i) => ({ x, y, d: blob(0, 0, rx, ry, .22, 11, i), n: [rnd() * .08 - .04, rnd() * .08 - .04], fold: i === 2 }));
      cells.forEach(c => wrap9(W, H, (dx, dy) => {
        const g = el("g", { transform: `translate(${(c.x + dx).toFixed(3)} ${(c.y + dy).toFixed(3)})` }, P);
        el("path", { d: c.d, fill: "#c9daef", "fill-opacity": .85, stroke: "#5f82b8", "stroke-width": .03 }, g);
        for (let k = 0; k < 6; k++) el("circle", { cx: (rnd() - .5) * .55, cy: (rnd() - .5) * .5, r: .022, fill: "#7d9bc8" }, g);
        if (c.fold) el("path", { d: "M-.3 -.25 Q0 -.05 .32 .2", fill: "none", stroke: "#86a3cf", "stroke-width": .03 }, g);
        el("ellipse", { cx: c.n[0], cy: c.n[1], rx: .1, ry: .085, fill: "#34519a" }, g);
      }));
      SLIDES.cheek = { pat: P, bg: "#e6eef7", oy: 0, rowH: 1, target: [.5, 0], nucleus: [.5 + cells[0].n[0], cells[0].n[1]] };
    }
    // specimens (one layer per slide, cross-faded), clipped to the field of view
    const specG = el("g", { "clip-path": "url(#mscope-clip)" }, FG);
    for (const k in SLIDES) { const g = el("g", {}, specG); el("rect", { x: -20, y: -20, width: 460, height: 460, fill: `url(#mscope-${k})` }, g); SLIDES[k].g = g; }
    // the white cell (one, drawn once, not tiled), in cell units from the field origin
    const wbcG = el("g", {}, SLIDES.blood.g), WBC = [2.7, 1.7];
    el("circle", { cx: 0, cy: 0, r: .95, fill: "#e7dcf2", stroke: "#9b84c9", "stroke-width": .05 }, wbcG);
    [[-.32, -.18], [.02, .22], [.34, -.12], [.05, -.3]].forEach(([x, y]) => el("circle", { cx: x, cy: y, r: .26, fill: "#6a3fb0" }, wbcG));
    el("path", { d: "M-.32 -.18 L.02 .22 L.34 -.12", stroke: "#6a3fb0", "stroke-width": .12, fill: "none" }, wbcG);
    // counted row: alternating tint along the diameter, aligned with the cells (blood gets its own straight row of red cells)
    const countG = el("g", { "clip-path": "url(#mscope-clip)", opacity: 0 }, FG);
    const bandBase = el("rect", { x: -20, width: 460, fill: "#f6e6e2" }, countG);
    const rowPat = pat("mscope-bloodrow", 1, 1.04); el("rect", { x: 0, y: 0, width: 1, height: 1.04, fill: "#f6e6e2" }, rowPat); rbc(rowPat, .5, .52, .49);
    const bandRow = el("rect", { x: -20, width: 460, fill: "url(#mscope-bloodrow)" }, countG);
    const cntPat = pat("mscope-count", 2, 1);
    el("rect", { x: 0, y: 0, width: 1, height: 1, fill: "#2fd17a", opacity: .42 }, cntPat);
    el("rect", { x: 1, y: 0, width: 1, height: 1, fill: "#2f8fe0", opacity: .34 }, cntPat);
    el("path", { d: "M0 0 V1 M1 0 V1", stroke: "#0d1117", "stroke-width": .05, opacity: .6 }, cntPat);
    const bandTint = el("rect", { x: -20, width: 460, fill: "url(#mscope-count)" }, countG);
    const diam = el("line", { x1: CX - R, x2: CX + R, y1: CY, y2: CY, stroke: "#0d1117", "stroke-width": 1.2, "stroke-dasharray": "4 4", "vector-effect": "non-scaling-stroke" }, countG);
    // vignette + rim
    const vig = el("radialGradient", { id: "mscope-vig" }, defs);
    el("stop", { offset: ".72", "stop-color": "#000", "stop-opacity": 0 }, vig); el("stop", { offset: "1", "stop-color": "#000", "stop-opacity": .38 }, vig);
    el("circle", { cx: CX, cy: CY, r: R, fill: "url(#mscope-vig)" }, FG);
    el("circle", { cx: CX, cy: CY, r: R, fill: "none", stroke: "#3a4250", "stroke-width": 3 }, FG);
    // magnification badge, cell counter, field-of-view label
    const badge = el("g", {}, FG);
    el("rect", { x: 10, y: 10, width: 78, height: 32, rx: 16, fill: CARD, stroke: EDGE, "stroke-width": 2 }, badge);
    const badgeT = tx("", 49, 26, 17, green, badge, "middle", 900);
    const counter = el("g", { opacity: 0 }, FG);
    el("rect", { x: 312, y: 10, width: 98, height: 32, rx: 16, fill: CARD, stroke: "#2fd17a", "stroke-width": 2 }, counter);
    const countT = tx("", 361, 26, 15, "#7cf0a5", counter, "middle", 900);
    const fovLab = el("g", { opacity: 0 }, FG);
    leader(fovLab, 1.3).set(CX, 33, CX, CY - R + 2);
    tx("field of view", CX, 22, 13, INK, fovLab, "middle", 800);
    // diameter ruler under the circle
    const rulerG = el("g", { opacity: 0 }, FG);
    for (const x of [CX - R, CX + R]) el("line", { x1: x, y1: CY + 8, x2: x, y2: 366, stroke: "#9fb3a8", "stroke-width": 1.2, "stroke-dasharray": "3 4" }, rulerG);
    el("path", { d: `M${CX - R} 356 H${CX + R} M${CX - R + 9} 350 L${CX - R} 356 L${CX - R + 9} 362 M${CX + R - 9} 350 L${CX + R} 356 L${CX + R - 9} 362`, stroke: GOLD, "stroke-width": 2.4, fill: "none", "stroke-linecap": "round" }, rulerG);
    const rulerT = tx("", CX, 380, 16, GOLD, rulerG, "middle", 900);
    tx("diameter", CX, 402, 12, DIM, rulerG, "middle", 700);
    // cell labels (placed round the target cell, scaled with the `cell` close-up so they fit at any zoom)
    const cellLab = el("g", { opacity: 0 }, FG);
    const CL = [0, 1, 2].map(() => { const g = el("g", {}, cellLab); const ld = leader(g, 1.3); const t = halo(tx("", 0, 0, 13, INK, g, "middle", 800)); return { g, ld, t }; });
    // label specs: [text, side, target(tcx, tcy, k, ox) → [x, y]]
    const LABS = {
      cork: [["cell wall", "tr", (x, y, k) => [x + .5 * k, y - .12 * k]], ["empty space", "bl", (x, y, k) => [x - .08 * k, y + .1 * k]]],
      onion: [["nucleus", "tl", (x, y, k) => [x + .05 * k, y - .6 * k]], ["cell wall", "tr", (x, y, k) => [x + .5 * k, y + .9 * k]], ["cytoplasm", "bl", (x, y, k) => [x - .25 * k, y + 1.2 * k]]],
      blood: [["red cell", "tl", (x, y, k) => [x - .22 * k, y - .22 * k]], ["white cell", "br", (x, y, k, ox) => [ox + (WBC[0] - .5) * k, CY + (WBC[1] - .4) * k]]],
      cheek: [["nucleus", "tr", (x, y, k) => [x + (SLIDES.cheek.nucleus[0] - .5) * k + .06 * k, y + SLIDES.cheek.nucleus[1] * k]], ["cytoplasm", "tl", (x, y, k) => [x - .22 * k, y - .2 * k]], ["membrane", "bl", (x, y, k) => [x - .44 * k, y + .2 * k]]],
    };

    // ======================= scene: photo =======================
    const PH = scenes.photo;
    const photoG = el("g", {}, PH);
    el("rect", { x: 20, y: 40, width: 280, height: 238, rx: 6, fill: "#000", opacity: .35 }, photoG);
    el("rect", { x: 16, y: 34, width: 280, height: 238, rx: 6, fill: "#f2efe8" }, photoG);
    const pclip = el("clipPath", { id: "mscope-photo" }, defs); el("rect", { x: 28, y: 46, width: 256, height: 194 }, pclip);
    const photoBg = el("rect", { x: 28, y: 46, width: 256, height: 194, fill: "#dfe8f1" }, photoG);
    const inner = el("g", { "clip-path": "url(#mscope-photo)" }, photoG);
    const bgCheek = el("g", {}, inner), bgOnion = el("g", {}, inner);
    el("path", { d: blob(44, 70, 42, 30, .25, 10), fill: "#ccdcee", stroke: "#8ea9cf", "stroke-width": 1.5, opacity: .8 }, bgCheek);
    el("path", { d: blob(270, 214, 46, 32, .25, 10, 1), fill: "#ccdcee", stroke: "#8ea9cf", "stroke-width": 1.5, opacity: .8 }, bgCheek);
    el("rect", { x: 28, y: 46, width: 256, height: 194, fill: "#f0dca0" }, bgOnion);
    for (let i = 0; i < 4; i++) { el("rect", { x: 28 + i * 70 - 20, y: 46, width: 70, height: 52, fill: "none", stroke: "#a77a34", "stroke-width": 3 }, bgOnion); el("rect", { x: 28 + i * 70 - 50, y: 188, width: 70, height: 52, fill: "none", stroke: "#a77a34", "stroke-width": 3 }, bgOnion); }
    el("rect", { x: 28, y: 46, width: 256, height: 194, fill: "none", stroke: "#cbc4b4", "stroke-width": 1 }, photoG);
    // the measured cell (local coords: length along x, extremes exactly ±95)
    const CELL_L = 190, P0 = [156, 136];
    const cheekPts = []; for (let i = 0; i < 14; i++) { const a = i / 14 * 6.2832, f = (i === 0 || i === 7) ? 1 : .86 + rnd() * .14; cheekPts.push([clamp(Math.cos(a) * 95 * f, -93, 93), Math.sin(a) * 40 * f]); }
    cheekPts[0] = [95, 0]; cheekPts[7] = [-95, 0];
    const cheekD = smooth(cheekPts), onionD = "M-95 -26 H95 V26 H-95 Z";
    const ghost = el("path", { fill: "none", stroke: "#4d5f7a", "stroke-width": 2, "stroke-dasharray": "5 5", opacity: 0, transform: `translate(${P0[0]} ${P0[1]})` }, photoG);
    // bracket + badge on the photo
    const brG = el("g", {}, photoG);
    el("path", { d: `M${P0[0] - 95} 150 V203 M${P0[0] + 95} 150 V203`, stroke: "#334055", "stroke-width": 1.4, "stroke-dasharray": "3 4" }, brG);
    el("path", { d: `M${P0[0] - 95} 196 H${P0[0] + 95} M${P0[0] - 95} 189 V203 M${P0[0] + 95} 189 V203`, stroke: "#c2410c", "stroke-width": 3, fill: "none", "stroke-linecap": "round" }, brG);
    const imgT = tx("", P0[0], 216, 15, "#7a2a05", brG, "middle", 900);
    el("rect", { x: 34, y: 212, width: 60, height: 24, rx: 12, fill: CARD }, photoG);
    const phBadge = tx("", 64, 224, 14, green, photoG, "middle", 900);
    // the cell that lifts off and shrinks
    const shadow = el("path", { fill: "#000", opacity: 0 }, PH);
    const liftG = el("g", {}, PH);
    const bigCheek = el("g", {}, liftG), bigOnion = el("g", {}, liftG);
    el("path", { d: cheekD, fill: "#bdd2ec", stroke: "#4f73ad", "stroke-width": 2.4 }, bigCheek);
    for (let k = 0; k < 40; k++) { const a = rnd() * 6.283, r = Math.sqrt(rnd()); el("circle", { cx: (Math.cos(a) * r * 80).toFixed(1), cy: (Math.sin(a) * r * 30).toFixed(1), r: 1.3, fill: "#7d9bc8" }, bigCheek); }
    el("path", { d: "M-60 -22 Q-20 -6 34 -26", fill: "none", stroke: "#86a3cf", "stroke-width": 2 }, bigCheek);
    el("ellipse", { cx: 6, cy: 3, rx: 13, ry: 10, fill: "#34519a" }, bigCheek);
    el("path", { d: onionD, fill: "#ecd08a", stroke: "#8a5a1a", "stroke-width": 4 }, bigOnion);
    el("rect", { x: -86, y: -18, width: 172, height: 36, rx: 8, fill: "#f3e2ad", opacity: .7 }, bigOnion);
    for (let k = 0; k < 30; k++) el("circle", { cx: (-88 + rnd() * 176).toFixed(1), cy: (-22 + rnd() * 44).toFixed(1), r: 1.2, fill: "#b8862e" }, bigOnion);
    el("ellipse", { cx: 32, cy: -4, rx: 12, ry: 9, fill: "#7a4a12" }, bigOnion);
    // real-size area: a 1 mm scale (100 units = 1 mm, ticks every 0.1 mm), computed actual size
    const realG = el("g", { opacity: 0 }, PH);
    const RX0 = 44, RY = 340;
    let tk = `M${RX0} ${RY} H${RX0 + 100}`; for (let i = 0; i <= 10; i++) tk += ` M${RX0 + i * 10} ${RY} V${RY + (i % 5 ? 6 : 11)}`;
    el("path", { d: tk, stroke: INK, "stroke-width": 1.6, fill: "none" }, realG);
    tx("1 mm", RX0 + 50, RY + 24, 13, DIM, realG, "middle", 800);
    const actT = tx("", 170, 322, 15, green, realG, "start", 900), umT = tx("", 170, 348, 15, sky, PH, "start", 900);
    const labP = el("g", {}, PH);
    const L2 = (text, lx, ly, x2, y2, anchor) => { const ld = leader(labP, 1.3); ld.set(anchor === "end" ? lx + 4 : lx - 4, ly, x2, y2); halo(tx(text, lx, ly, 13, INK, labP, anchor, 800)); };
    L2("photo", 304, 60, 290, 60, "start"); L2("image length", 304, 196, P0[0] + 97, 196, "start");
    const realLab = el("g", {}, labP); { const ld = leader(realLab, 1.3); realLab.__ld = ld; halo(tx("real size", RX0 - 4, 296, 13, INK, realLab, "start", 800)); }

    const showScene = P => {
      const s = P.s, p = P.p, u = P.u, cur = s.scene || "scope", prev = p.scene || cur;
      for (const k in scenes) scenes[k].setAttribute("opacity", (k === cur ? (prev === cur ? 1 : u) : k === prev ? 1 - u : 0).toFixed(3));
      return cur;
    };
    const SPOT = {
      eyepiece: [146, 20, 48, 50], objectives: [128, 156, 104, 94], stage: [94, 228, 162, 56], mirror: [134, 294, 74, 40], knobs: [228, 148, 54, 92], readout: [252, 6, 168, 112],
      field: [CX - R - 6, CY - R - 6, 2 * R + 12, 2 * R + 12], ruler: [CX - R - 8, 340, 2 * R + 16, 70],
      bracket: [44, 180, 230, 52], actual: [30, 282, 130, 70],
    };

    return {
      draw(t, P) {
        const s = P.s, p = P.p, u = P.u, scene = showScene(P), lab = mixN(p, s, "labels", u);
        let spot = SPOT[s.focus] || null;
        // ---------------- scope ----------------
        if (scene === "scope" || p.scene === "scope") {
          const idx = { 4: 0, 10: 1, 40: 2 }, a = mixN({ o: idx[p.objective] ?? 0 }, { o: idx[s.objective] ?? 0 }, "o", u);
          const B = 25 * Math.PI / 180, sb = Math.sin(B), cb = Math.cos(B);
          let activeL = 0, wsum = 0;
          const order = OBJ.map(o => {
            const psi = (o.i - a) * 2.0944, cp = Math.cos(psi);
            const dx = sb * cb * (1 - cp), dy = cb * cb + sb * sb * cp, dz = sb * Math.sin(psi), len = Math.hypot(dx, dy);
            const tr = `translate(${AX} ${PIV}) rotate(${(Math.atan2(-dx, dy) * 180 / Math.PI).toFixed(2)}) scale(1 ${len.toFixed(4)})`;
            o.g.setAttribute("transform", tr); o.eg.setAttribute("transform", tr);
            const on = clamp((cp - .9) / .1, 0, 1);
            o.glow.setAttribute("opacity", (on * (.55 + .25 * Math.sin(t * 4))).toFixed(2));
            o.eng.setAttribute("opacity", clamp((cp - .55) * 3, 0, 1).toFixed(2));
            const w = Math.max(0, cp) ** 8; activeL += w * o.L; wsum += w;
            return { o, z: dz + (cp > .95 ? 2 : 0) };
          }).sort((m, n) => m.z - n.z);
          order.forEach(m => objLayer.appendChild(m.o.g));
          activeL = wsum ? activeL / wsum : 27;
          objLead.set(98, 208, AX - 9, PIV + activeL * .62);
          const E = s.eyepiece != null ? +s.eyepiece : 10, O = s.objective != null ? +s.objective : 4;
          eyeT.textContent = "×" + int(E);
          roE.textContent = "×" + int(E); roO.textContent = "×" + int(O); roM.textContent = "= ×" + int(E * O);
          ro.setAttribute("opacity", mixN(p, s, "readout", u).toFixed(2));
          // knobs: stage travel tied to rotation (coarse 12 units per turn, downward only; fine ±1.2 units)
          const kc = lerp(p.knob === "coarse" ? 1 : 0, s.knob === "coarse" ? 1 : 0, u), kf = lerp(p.knob === "fine" ? 1 : 0, s.knob === "fine" ? 1 : 0, u);
          const ph = t * 1.1, cTurn = kc * (1 - Math.cos(ph)) / 2, fTurn = kf * Math.sin(ph);
          coarse.g.setAttribute("transform", `translate(${coarse.x} ${coarse.y}) rotate(${(cTurn * 360).toFixed(1)})`);
          fine.g.setAttribute("transform", `translate(${fine.x} ${fine.y}) rotate(${(fTurn * 360).toFixed(1)})`);
          const sy = cTurn * 12 - fTurn * 1.2;
          stageG.setAttribute("transform", `translate(0 ${sy.toFixed(2)})`);
          // beam
          const li = mixN(p, s, "light", u);
          beam.setAttribute("opacity", li.toFixed(2)); lightIn.setAttribute("opacity", li.toFixed(2)); eye.setAttribute("opacity", li.toFixed(2));
          const tip = PIV + activeL, sl = 241 + sy;
          const W = [[314, 9], [277 + sy, 6], [sl, 3.5], [Math.min(tip, sl - 1), 2.2], [PIV, 4.5], [70, 6], [28, 4], [16, 2]];
          beamPath.setAttribute("d", "M" + W.map(([y, w]) => `${AX - w} ${y.toFixed(1)}`).join(" L") + " L" + W.slice().reverse().map(([y, w]) => `${AX + w} ${y.toFixed(1)}`).join(" L") + " Z");
          beamCore.setAttribute("d", `M${AX} 312 V18`); beamCore.setAttribute("stroke-dashoffset", (t * 26).toFixed(1));
          inDash.setAttribute("stroke-dashoffset", (-t * 26).toFixed(1));
          specimenSpot.setAttribute("opacity", (.6 + .4 * li).toFixed(2));
          labS.setAttribute("opacity", lab.toFixed(2)); labStage.setAttribute("opacity", lab.toFixed(2));
          if (s.focus === "stage") spot = [94, 228 + sy, 162, 56];
        }
        // ---------------- field ----------------
        if (scene === "field" || p.scene === "field") {
          const slide = SLIDES[s.slide] ? s.slide : "onion", pslide = SLIDES[p.slide] ? p.slide : slide;
          for (const k in SLIDES) SLIDES[k].g.setAttribute("opacity", (k === slide ? (pslide === slide ? 1 : u) : k === pslide ? 1 - u : 0).toFixed(3));
          const fov = mixLog(p, s, "fov", u, 1.6), cell = mixLog(p, s, "cell", u, .05), k = 2 * R * cell / fov;
          const N = Math.round((s.fov ?? 1.6) / (s.cell ?? .05)), Np = Math.round((p.fov ?? 1.6) / (p.cell ?? .05));
          const ox = CX - lerp(Np % 2, N % 2, u) * .5 * k;
          for (const key in SLIDES) { const S = SLIDES[key]; S.pat.setAttribute("patternTransform", `translate(${ox.toFixed(3)} ${(CY + S.oy * k).toFixed(3)}) scale(${k.toFixed(4)})`); }
          wbcG.setAttribute("transform", `translate(${(ox + WBC[0] * k).toFixed(2)} ${(CY + WBC[1] * k).toFixed(2)}) scale(${k.toFixed(4)})`);
          // counted row
          const blood = slide === "blood", bh = k * SLIDES[slide].rowH;
          for (const r of [bandBase, bandRow]) { r.setAttribute("y", (CY - bh / 2).toFixed(2)); r.setAttribute("height", bh.toFixed(2)); r.setAttribute("opacity", blood ? 1 : 0); }
          rowPat.setAttribute("patternTransform", `translate(${ox.toFixed(3)} ${(CY - bh / 2).toFixed(3)}) scale(${k.toFixed(4)})`);
          bandTint.setAttribute("y", (CY - bh / 2).toFixed(2)); bandTint.setAttribute("height", bh.toFixed(2));
          cntPat.setAttribute("patternTransform", `translate(${ox.toFixed(3)} ${(CY - bh / 2).toFixed(3)}) scale(${k.toFixed(4)} ${(bh).toFixed(4)})`);
          const cnt = mixN(p, s, "count", u);
          countG.setAttribute("opacity", cnt.toFixed(2)); counter.setAttribute("opacity", cnt.toFixed(2));
          countT.textContent = `${N} cells`;
          badgeT.textContent = "×" + int(s.mag != null ? +s.mag : 100);
          rulerG.setAttribute("opacity", mixN(p, s, "ruler", u).toFixed(2)); rulerT.textContent = `${sig2(s.fov != null ? +s.fov : 1.6)} mm`;
          fovLab.setAttribute("opacity", lab.toFixed(2));
          // target cell + its labels (the `cell` close-up follows the zoom)
          const tcx = ox + SLIDES[slide].target[0] * k, tcy = CY + SLIDES[slide].target[1] * k;
          const Sz = Math.max(120, k * (slide === "onion" ? 4.8 : 2.8));
          KREF.focus.cell = [tcx - Sz / 2, tcy - Sz / 2, Sz, Sz];
          KREF.focus.row = [CX - R - 4, CY - Math.max(40, bh * 2), 2 * R + 8, Math.max(80, bh * 4)];
          const specs = LABS[slide];
          CL.forEach((c, i) => {
            const sp = specs[i];
            if (!sp) { c.g.setAttribute("opacity", 0); return; }
            c.g.setAttribute("opacity", 1);
            const [txt, side, fn] = sp, [x2, y2] = fn(tcx, tcy, k, ox), left = side[1] === "l", top = side[0] === "t";
            const lx = tcx + (left ? -.22 : .22) * Sz, ly = tcy + (top ? (left ? -.42 : -.22) : (left ? .42 : .24)) * Sz;
            c.t.textContent = txt; c.t.setAttribute("x", lx.toFixed(1)); c.t.setAttribute("y", ly.toFixed(1));
            c.ld.set(lx, ly + (top ? .035 : -.035) * Sz, x2, y2, Math.max(.8, Sz * .016));
          });
          cellLab.setAttribute("opacity", lab.toFixed(2));
          if (s.focus === "cell") spot = KREF.focus.cell.map((v, i) => i < 2 ? v + Sz * .06 : v - Sz * .12);
          if (s.focus === "row") spot = [CX - R + 2, CY - bh / 2 - 5, 2 * R - 4, bh + 10];
        }
        // ---------------- photo ----------------
        if (scene === "photo" || p.scene === "photo") {
          const sp = s.specimen === "onion" ? "onion" : "cheek", image = s.image != null ? +s.image : 24, mag = s.mag != null ? +s.mag : 400;
          const actual = image / mag;
          bigCheek.setAttribute("opacity", sp === "cheek" ? 1 : 0); bigOnion.setAttribute("opacity", sp === "onion" ? 1 : 0);
          bgCheek.setAttribute("opacity", sp === "cheek" ? 1 : 0); bgOnion.setAttribute("opacity", sp === "onion" ? 1 : 0);
          photoBg.setAttribute("fill", sp === "cheek" ? "#dfe8f1" : "#f0dca0");
          ghost.setAttribute("d", sp === "cheek" ? cheekD : onionD);
          imgT.textContent = `${sig2(image)} mm`; phBadge.textContent = "×" + int(mag);
          actT.textContent = `actual = ${sig2(actual)} mm`; umT.textContent = `= ${sig2(actual * 1000)} µm`;
          const sh = mixN(p, s, "shrink", u), lift = ease(seg(sh, 0, .25)), mv = ease(seg(sh, .2, 1));
          const wF = clamp(actual * 100, 2, 100), hF = wF * (sp === "cheek" ? 80 : 52) / CELL_L, T = [RX0 + wF / 2, RY - 3 - hF / 2];
          const sc = Math.exp(lerp(Math.log(1 + .06 * lift), Math.log(wF / CELL_L), mv));
          const x = lerp(P0[0], T[0], mv), y = lerp(P0[1] - 6 * lift, T[1], mv) - Math.sin(mv * Math.PI) * 30;
          liftG.setAttribute("transform", `translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${sc.toFixed(4)})`);
          shadow.setAttribute("d", sp === "cheek" ? cheekD : onionD);
          shadow.setAttribute("transform", `translate(${(x + 6 * lift * (1 - mv)).toFixed(2)} ${(y + 9 * lift * (1 - mv)).toFixed(2)}) scale(${sc.toFixed(4)})`);
          shadow.setAttribute("opacity", (.3 * lift * (1 - mv)).toFixed(2));
          ghost.setAttribute("opacity", seg(sh, 0, .2).toFixed(2));
          const done = seg(sh, .85, 1);
          realG.setAttribute("opacity", Math.max(seg(sh, .3, .6) * .9, done).toFixed(2)); actT.setAttribute("opacity", done.toFixed(2));
          umT.setAttribute("opacity", (mixN(p, s, "um", u) * done).toFixed(2));
          realLab.__ld.set(RX0 + 2, 304, T[0], T[1] - hF / 2 - 1);
          realLab.setAttribute("opacity", done.toFixed(2));
          labP.setAttribute("opacity", lab.toFixed(2));
        }
        ring.setAttribute("opacity", spot ? (.65 + .35 * Math.sin(t * 5)).toFixed(2) : 0);
        if (spot) { ring.setAttribute("x", spot[0].toFixed(1)); ring.setAttribute("y", spot[1].toFixed(1)); ring.setAttribute("width", spot[2].toFixed(1)); ring.setAttribute("height", spot[3].toFixed(1)); ring.setAttribute("rx", s.focus === "field" ? (spot[2] / 2).toFixed(1) : 10); }
      },
    };
  },
};
