/* =========================================================
   StudyPipe explainer-video kit · cell-forms
   Forms of life, drawn the way WAEC biological drawings show them (outline + key features, not cartoons).
   Three scenes in one kit (state `scene`, cross-fades like kits/video/blood):
   - 'gallery': a pond-water drop under the microscope holding 1–4 organisms (1 = centred and large, 2 = side by side,
     3–4 = a 2 × 2 grid). Amoeba (pseudopodia, nucleus, contractile vacuole, food vacuoles, optional engulfing loop),
     Paramecium (slipper, cilia beating in a wave, oral groove, macro- + micronucleus, two star-shaped contractile vacuoles),
     Euglena (spindle, ONE flagellum, red eyespot, chloroplasts, flexible pellicle, no wall), Chlamydomonas (cellulose wall,
     TWO equal flagella, ONE cup-shaped chloroplast with a pyrenoid, eyespot, nucleus in the cup); Volvox / Spirogyra / Hydra
     use the compare drawings, scaled. Nutrition badges follow `light`: in the dark Euglena turns saprophytic (dissolved food
     diffuses in through its surface; it never engulfs) and Chlamydomonas makes no food (its chloroplast dulls).
   - 'compare': Volvox (colony: hollow ball of identical cells joined by cytoplasmic strands, daughter colonies inside),
     Spirogyra (unbranched filament of identical cells, spiral ribbon chloroplasts), Hydra (tissue level: tentacles round the
     mouth, basal disc, cut-away of ectoderm + endoderm). `jobs` colour-codes Hydra's specialised cells; `separate` lifts one
     cell out of each: the Volvox and Spirogyra cells live alone, the Hydra stinging cell cannot.
   - 'levels': the ladder organelle → cell → tissue → organ → system → organism (animal or plant examples), `swap` shows the
     classic wrong order (organ ↔ system).
   Close-ups follow the organisms: gallery focus is by organism id wherever it sits in `show` (camera regions are live getters).
   Contract: .agents/skills/explainer-video/references/adding-a-kit.md · every frame is a pure function of (t, P).
   ========================================================= */
(function () {
  const FULL = [0, 0, 420, 420];
  const LIVE = { scene: "gallery", slots: {} };            // written by draw() before the camera reads the focus getters
  const GALLERY_IDS = ["amoeba", "paramecium", "euglena", "chlamydomonas", "volvox", "spirogyra", "hydra"];
  const COMPARE_F = { volvox: [2, 70, 140, 196], spirogyra: [128, 30, 144, 296], hydra: [232, 22, 188, 318], layers: [226, 112, 180, 110] };
  const LEVEL_F = { low: [6, 212, 408, 182], high: [6, 22, 408, 196], ladder: [0, 4, 420, 412] };
  const galleryRect = id => { const s = LIVE.slots[id]; if (!s) return FULL.slice(); const w = 212 * s.sc, h = 202 * s.sc; return [s.x - w / 2, s.y - 94 * s.sc, w, h]; };
  const focus = {};
  const def = (name, fn) => Object.defineProperty(focus, name, { enumerable: true, get: fn });
  ["amoeba", "paramecium", "euglena", "chlamydomonas"].forEach(id => def(id, () => (LIVE.scene === "gallery" ? galleryRect(id) : FULL.slice())));
  ["volvox", "spirogyra", "hydra"].forEach(id => def(id, () => (LIVE.scene === "compare" ? COMPARE_F[id].slice() : LIVE.scene === "gallery" ? galleryRect(id) : FULL.slice())));
  def("field", () => FULL.slice());
  def("layers", () => (LIVE.scene === "compare" ? COMPARE_F.layers.slice() : FULL.slice()));
  ["low", "high", "ladder"].forEach(id => def(id, () => (LIVE.scene === "levels" ? LEVEL_F[id].slice() : FULL.slice())));

  (window.VIDEO_KITS = window.VIDEO_KITS || {})["cell-forms"] = {
    title: "Forms of life: free-living protists, colony vs filament vs tissue, levels of organisation",
    states: {
      scene: "'gallery' | 'compare' | 'levels' (cross-fades)",
      show: "gallery: array of 1–4 ids in grid order from amoeba paramecium euglena chlamydomonas volvox spirogyra hydra (new ids fade in 0.4 s apart)",
      move: "0/1: cilia beat, flagella whip, pseudopodia flow (gallery); Volvox rolls, Hydra tentacles sway (compare)",
      engulf: "gallery 0/1: the Amoeba feeding loop (two pseudopodia close round a particle → new food vacuole, every 6 s)",
      labels: "0/1: part labels + italic organism names (gallery); names, form words, ectoderm/endoderm, strands, spiral chloroplast (compare); examples (levels)",
      nutrition: "gallery 0/1: nutrition badges (holozoic / autotrophic / saprophytic / no food made)",
      light: "gallery 0/1 (default 1): 1 bright field + lamp; 0 dark field: Euglena saprophytic (absorbs dissolved food), Chlamydomonas makes no food",
      jobs: "compare 0/1: colour Hydra's cells by job (stinging: catch food · endoderm: digest · ectoderm: cover) with a key; Volvox/Spirogyra stay 'all alike'",
      separate: "compare 0/1: lift one cell out of each organism (~3 s): Volvox ✓ lives alone, Spirogyra ✓ lives alone, Hydra stinging cell ✗ can't live alone",
      example: "levels: 'animal' (default) | 'plant'",
      level: "levels 0–6 (default 6): rungs shown from the bottom; each new rung slides up and the newest glows",
      swap: "levels 0/1: organ and system trade places with ✗ wrong order; back to 0 slides them home with ✓",
      focus: "ring a close-up: amoeba paramecium euglena chlamydomonas volvox spirogyra hydra field layers low high ladder, or null",
    },
    focus,
    create(svg, api) {
      const { el, tx, mixN, lerp, ease, seg, clamp, frac, PAL } = api;
      const f1 = n => n.toFixed(1), f2 = n => n.toFixed(2);
      const TAU = Math.PI * 2;
      const OUT = "#d6e6de", CYTO = "rgba(205,230,218,.16)", NUC = "#8f84ad", NUC_D = "#5f5480", GREEN = "#4fb35e", GREEN_D = "#2c7a3c",
        DULL = "#66705f", EYE = "#ff4040", CVF = "rgba(150,210,255,.30)", CVS = "#a9dcff", FOOD = "#c79a62", INK = "#e8efe9", LEAD = "#cfd8d3",
        STING = PAL.amber, DIGEST = "#ff9a7a", COVER = PAL.sky, NEUTRAL = "#d9cbb3", GOLD = PAL.gold;
      const rnd = (() => { let a = 11; return () => { a = (a * 9301 + 49297) % 233280; return a / 233280; }; })();
      const hex = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
      const mixCol = (a, b, k) => { const A = hex(a), B = hex(b); return "#" + A.map((v, i) => Math.round(lerp(v, B[i], clamp(k, 0, 1))).toString(16).padStart(2, "0")).join(""); };
      const gauss = (d, s) => Math.exp(-(d * d) / (2 * s * s));
      const angD = (a, b) => { let d = a - b; while (d > Math.PI) d -= TAU; while (d < -Math.PI) d += TAU; return d; };
      const smooth = pts => {                                // closed Catmull-Rom → cubic Béziers
        const n = pts.length; let d = `M${f1(pts[0][0])} ${f1(pts[0][1])}`;
        for (let i = 0; i < n; i++) {
          const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
          d += ` C${f1(p1[0] + (p2[0] - p0[0]) / 6)} ${f1(p1[1] + (p2[1] - p0[1]) / 6)} ${f1(p2[0] - (p3[0] - p1[0]) / 6)} ${f1(p2[1] - (p3[1] - p1[1]) / 6)} ${f1(p2[0])} ${f1(p2[1])}`;
        }
        return d + "Z";
      };
      const line = pts => "M" + pts.map(p => f1(p[0]) + " " + f1(p[1])).join(" L");
      const ital = e => { e.setAttribute("font-style", "italic"); return e; };
      // a part label with a leader line: text at (x, y), pointing at (px, py)
      const label = (parent, text, x, y, anchor, px, py, col) => {
        const g = el("g", {}, parent);
        const sx = anchor === "start" ? x - 4 : anchor === "end" ? x + 4 : x, sy = anchor === "middle" ? (py > y ? y + 8 : y - 8) : y;
        el("path", { d: `M${sx} ${sy} L${px} ${py}`, stroke: LEAD, "stroke-width": 1.3, opacity: .75, fill: "none" }, g);
        el("circle", { cx: px, cy: py, r: 1.8, fill: LEAD }, g);
        tx(text, x, y, 12, col || INK, g, anchor, 700);
        return g;
      };
      const pick = (P, key, val, d) => lerp(((P.p[key] != null ? P.p[key] : d) === val) ? 1 : 0, ((P.s[key] != null ? P.s[key] : d) === val) ? 1 : 0, P.u);

      const scenes = { gallery: el("g", {}, svg), compare: el("g", {}, svg), levels: el("g", {}, svg) };

      // ================= organism builders (local coordinates, centred on 0,0) =================
      function buildAmoeba(g) {
        const SX = 1.15, SY = .9, TH_F = .15;
        const lobes = [[-2.5, 16, 0], [2.45, 15, 1.7], [-1.05, 9, 3.1]];
        const outer = el("path", { fill: CYTO, stroke: OUT, "stroke-width": 2.2 }, g);
        const endo = el("path", { fill: "rgba(205,230,218,.10)" }, g);
        const gran = []; for (let i = 0; i < 16; i++) { const a = rnd() * TAU, r = 6 + rnd() * 20; gran.push(el("circle", { cx: f1(Math.cos(a) * r * SX), cy: f1(Math.sin(a) * r * SY), r: .9 + rnd() * .8, fill: "#b9c9c0", opacity: .7 }, g)); }
        el("ellipse", { cx: -14, cy: -6, rx: 10, ry: 8, fill: NUC, stroke: NUC_D, "stroke-width": 1.5 }, g);
        const cv = el("circle", { cx: 14, cy: -14, r: 6, fill: CVF, stroke: CVS, "stroke-width": 1.5 }, g);
        el("circle", { cx: -4, cy: 15, r: 6.5, fill: "rgba(199,154,98,.18)", stroke: FOOD, "stroke-width": 1.3 }, g);
        el("circle", { cx: -4, cy: 15, r: 2.6, fill: FOOD }, g);
        const vac = el("circle", { r: 7, fill: "rgba(199,154,98,.18)", stroke: FOOD, "stroke-width": 1.3, opacity: 0 }, g);
        const part = el("circle", { r: 3.6, fill: FOOD, opacity: 0 }, g);
        const labs = el("g", {}, g);
        label(labs, "pseudopodium", -40, -72, "middle", -44, -28);
        label(labs, "contractile vac.", 26, -52, "middle", 14, -20);
        label(labs, "food vacuole", -14, 50, "middle", -6, 22);
        return {
          labs,
          update(t, st) {
            const mv = st.mv, eng = st.eng, q = frac(t / 6);
            let A = 0, w = .55;                                   // two pseudopodia grow either side of the particle, then close over it
            if (q < .6) { A = 34 * ease(seg(q, .15, .4)); w = lerp(.55, .1, ease(seg(q, .4, .58))); }
            else { A = 34 * (1 - ease(seg(q, .62, .92))); w = .1; }
            A *= eng;
            const R = th => {
              let b = 0;
              lobes.forEach(([a, amp, ph]) => { const ac = a + mv * .18 * Math.sin(t * .35 + ph), Ac = amp * (1 + mv * .35 * Math.sin(t * .5 + ph)); b = Math.max(b, Ac * gauss(angD(th, ac), .38)); });
              if (A > 0) b = Math.max(b, A * gauss(angD(th, TH_F - w), .2), A * gauss(angD(th, TH_F + w), .2));
              return 34 + mv * 2.5 * Math.sin(3 * th + t * .7) + b;
            };
            const po = [], pi = [];
            for (let i = 0; i < 48; i++) { const th = i / 48 * TAU, r = R(th); po.push([Math.cos(th) * r * SX, Math.sin(th) * r * SY]); pi.push([Math.cos(th) * (r - 7) * SX, Math.sin(th) * (r - 7) * SY]); }
            outer.setAttribute("d", smooth(po)); endo.setAttribute("d", smooth(pi));
            const c = frac(t / 3.5), rc = c < .8 ? 3 + 5 * (c / .8) : 8 - 5 * ((c - .8) / .2);
            cv.setAttribute("r", f1(lerp(6, rc, mv)));
            const d = q < .6 ? lerp(80, 57, ease(seg(q, 0, .25))) : lerp(57, 18, ease(seg(q, .62, .92)));
            const px = Math.cos(TH_F) * d * SX, py = Math.sin(TH_F) * d * SY;
            const op = eng * seg(q, 0, .08) * (1 - seg(q, .9, 1));
            part.setAttribute("cx", f1(px)); part.setAttribute("cy", f1(py)); part.setAttribute("opacity", f2(op));
            vac.setAttribute("cx", f1(px)); vac.setAttribute("cy", f1(py)); vac.setAttribute("opacity", f2(op * seg(q, .58, .66)));
          },
        };
      }

      function buildParamecium(g) {
        const N = 46, base = [];
        for (let i = 0; i < N; i++) {
          const ph = i / N * TAU, x = -64 * Math.cos(ph), top = Math.sin(ph) > 0;
          const taper = 1 - .32 * Math.pow(Math.max(0, x / 64), 1.4);
          let y = -Math.sin(ph) * 23 * taper;
          if (!top) y -= 9 * gauss(x + 6, 13);              // the oral groove: a dip on the lower side
          base.push([x, y]);
        }
        const norms = base.map((p, i) => { const a = base[(i - 1 + N) % N], b = base[(i + 1) % N]; let nx = b[1] - a[1], ny = -(b[0] - a[0]); const L = Math.hypot(nx, ny) || 1; return [nx / L, ny / L]; });
        const cil = el("g", {}, g), cilia = base.map(() => el("line", { stroke: "#c9e6d8", "stroke-width": 1.3, "stroke-linecap": "round" }, cil));
        el("path", { d: smooth(base), fill: CYTO, stroke: OUT, "stroke-width": 2.2 }, g);
        el("path", { d: "M-40 8 C-28 12 -14 16 2 10", stroke: "#93a79c", "stroke-width": 2.4, fill: "none", "stroke-linecap": "round" }, g);   // groove → gullet
        el("circle", { cx: 6, cy: 8, r: 3.8, fill: "rgba(199,154,98,.18)", stroke: FOOD, "stroke-width": 1.2 }, g);
        [[-20, -4], [24, 9], [-6, -12]].forEach(([x, y]) => { el("circle", { cx: x, cy: y, r: 3.4, fill: "rgba(199,154,98,.18)", stroke: FOOD, "stroke-width": 1 }, g); el("circle", { cx: x, cy: y, r: 1.3, fill: FOOD }, g); });
        el("ellipse", { cx: 6, cy: -5, rx: 15, ry: 8, fill: NUC, stroke: NUC_D, "stroke-width": 1.5 }, g);      // macronucleus
        el("circle", { cx: 24, cy: -9, r: 3.4, fill: NUC_D }, g);                                                  // micronucleus
        const cvs = [[-38, -4], [40, -3]].map(([x, y]) => {
          const cg = el("g", { transform: `translate(${x} ${y})` }, g), inner = el("g", {}, cg);
          for (let k = 0; k < 6; k++) { const a = k / 6 * TAU; el("line", { x1: 0, y1: 0, x2: f1(Math.cos(a) * 8), y2: f1(Math.sin(a) * 8), stroke: CVS, "stroke-width": 1.6 }, inner); }
          el("circle", { r: 3.4, fill: CVF, stroke: CVS, "stroke-width": 1.4 }, inner);
          return inner;
        });
        const labs = el("g", {}, g);
        label(labs, "cilia", -42, -52, "middle", -42, -27);
        label(labs, "macronucleus", 10, -72, "middle", 8, -12);
        label(labs, "oral groove", -16, 46, "middle", -16, 17);
        return {
          labs,
          update(t, st) {
            const mv = st.mv;
            cilia.forEach((c, i) => {
              const [x, y] = base[i], [nx, ny] = norms[i], a = .3 + mv * .6 * Math.sin(t * 9 - i * .55), ca = Math.cos(a), sa = Math.sin(a);
              const dx = nx * ca - ny * sa, dy = nx * sa + ny * ca;
              c.setAttribute("x1", f1(x)); c.setAttribute("y1", f1(y)); c.setAttribute("x2", f1(x + dx * 7)); c.setAttribute("y2", f1(y + dy * 7));
            });
            cvs.forEach((c, k) => { const q = frac(t / 3 + k * .5), s = lerp(1, q < .75 ? .7 + .5 * q / .75 : 1.07 - .37 * (q - .75) / .25, mv); c.setAttribute("transform", `scale(${f2(s)})`); });
          },
        };
      }

      function buildEuglena(g) {
        const X0 = -86, X1 = 14, W = 17;
        const w = x => { const s = (x - X0) / (X1 - X0); return s < .62 ? W * Math.pow(Math.max(0, s / .62), 1.15) : W * Math.sqrt(Math.max(0, 1 - Math.pow((s - .62) / .38, 2))); };
        const pts = [];
        for (let i = 0; i <= 40; i++) { const x = X0 + (X1 - X0) * i / 40; pts.push([x, -w(x)]); }
        for (let i = 39; i >= 1; i--) { const x = X0 + (X1 - X0) * i / 40; pts.push([x, w(x) * .95]); }
        const food = el("g", {}, g), dots = [];
        for (let i = 0; i < 12; i++) { const x = -74 + i * 7.5, side = i % 2 ? 1 : -1; dots.push({ e: el("circle", { r: 2.2, fill: "#e6c38a" }, food), x, y: side * w(x) * .95, side, off: rnd() }); }
        el("path", { d: line(pts) + "Z", fill: CYTO, stroke: OUT, "stroke-width": 2, "stroke-linejoin": "round" }, g);
        for (let x = X0 + 10; x < X1 - 6; x += 7) { const h = w(x) * .82; el("line", { x1: f1(x - 3), y1: f1(-h), x2: f1(x + 3), y2: f1(h), stroke: "rgba(214,230,222,.22)", "stroke-width": 1 }, g); }  // pellicle strips
        const chl = [[-66, -1, 20], [-56, 6, -15], [-47, -6, 10], [-22, -7, -20], [-19, 7, 15], [-8, -2, 30]].map(([x, y, r]) => el("ellipse", { cx: x, cy: y, rx: 5.2, ry: 3, fill: GREEN, stroke: GREEN_D, "stroke-width": 1, transform: `rotate(${r} ${x} ${y})` }, g));
        el("ellipse", { cx: -34, cy: 1, rx: 9, ry: 7, fill: NUC, stroke: NUC_D, "stroke-width": 1.5 }, g);
        el("ellipse", { cx: 6, cy: -2, rx: 5.5, ry: 3.6, fill: "rgba(20,30,30,.35)", stroke: "#b9c9c0", "stroke-width": 1 }, g);    // reservoir
        el("circle", { cx: 3, cy: 6, r: 2.6, fill: CVF, stroke: CVS, "stroke-width": 1 }, g);
        el("ellipse", { cx: 2, cy: -9.5, rx: 3.6, ry: 2.6, fill: EYE }, g);                                                        // eyespot
        const flag = el("path", { stroke: INK, "stroke-width": 2, fill: "none", "stroke-linecap": "round" }, g);
        const labs = el("g", {}, g);
        label(labs, "flagellum", 60, -52, "middle", 58, -13);
        label(labs, "eyespot", -8, -72, "middle", 2, -12);
        label(labs, "chloroplast", -40, 44, "middle", -56, 9);
        return {
          labs,
          update(t, st) {
            const ph = 11 * t * st.mv, fp = [];
            for (let i = 0; i <= 26; i++) { const u = i / 26; fp.push([X1 + 76 * u, -2 + 9 * u * Math.sin(9 * u - ph)]); }
            flag.setAttribute("d", line(fp));
            const dark = 1 - st.light;
            chl.forEach(c => c.setAttribute("fill", mixCol(GREEN, DULL, dark * .45)));
            food.setAttribute("opacity", f2(dark));
            dots.forEach(o => { const q = frac(t * .32 + o.off), y = o.y + o.side * (1 - q) * 28; o.e.setAttribute("cx", f1(o.x)); o.e.setAttribute("cy", f1(y)); o.e.setAttribute("opacity", f2(Math.min(1, q / .15) * (1 - seg(q, .82, 1)))); });
          },
        };
      }

      function buildChlamy(g) {
        const ell = (cx, cy, rx, ry, a) => [cx + rx * Math.cos(a), cy + ry * Math.sin(a)];
        const flags = [el("path", { stroke: INK, "stroke-width": 2, fill: "none", "stroke-linecap": "round" }, g), el("path", { stroke: INK, "stroke-width": 2, fill: "none", "stroke-linecap": "round" }, g)];
        el("ellipse", { cx: 0, cy: 4, rx: 28, ry: 33, fill: "rgba(232,240,216,.07)", stroke: "#e8f0d8", "stroke-width": 2.6 }, g);   // cellulose wall
        el("path", { d: "M-4 -28 Q0 -34 4 -28", fill: "none", stroke: "#e8f0d8", "stroke-width": 2.4 }, g);                         // papilla
        el("ellipse", { cx: 0, cy: 4, rx: 24, ry: 29, fill: CYTO, stroke: OUT, "stroke-width": 1.3 }, g);                             // membrane
        const a1 = -.6, a2 = Math.PI + .6, cp = [];
        for (let i = 0; i <= 24; i++) cp.push(ell(0, 4, 21, 26, a1 + (a2 - a1) * i / 24));
        for (let i = 24; i >= 0; i--) cp.push(ell(0, 0, 12, 14, a1 + (a2 - a1) * i / 24));
        const cup = el("path", { d: line(cp) + "Z", fill: GREEN, stroke: GREEN_D, "stroke-width": 1.3, "stroke-linejoin": "round" }, g);
        const pyr = el("circle", { cx: 0, cy: 22, r: 4.5, fill: GREEN_D, stroke: "#bfe8c4", "stroke-width": 1.2 }, g);
        el("circle", { cx: 0, cy: 0, r: 7.5, fill: NUC, stroke: NUC_D, "stroke-width": 1.5 }, g);
        el("circle", { cx: -6, cy: -19, r: 2.4, fill: CVF, stroke: CVS, "stroke-width": 1 }, g); el("circle", { cx: 6, cy: -19, r: 2.4, fill: CVF, stroke: CVS, "stroke-width": 1 }, g);
        el("circle", { cx: 19, cy: -8, r: 3.2, fill: EYE }, g);
        const labs = el("g", {}, g);
        label(labs, "eyespot", 38, -8, "start", 22, -8);
        label(labs, "cell wall", 38, 22, "start", 25, 20);
        label(labs, "cup chloroplast", 0, 50, "middle", 0, 28);
        return {
          labs,
          update(t, st) {
            const b = lerp(.3, .5 - .5 * Math.cos(t * 7), st.mv);
            [1, -1].forEach((sd, k) => {
              const a = -Math.PI / 2 + .35 + 1.3 * b, bx = 3 * sd, by = -29, ca = a - .35 * (1 - b);
              const c = [bx + sd * 26 * Math.cos(ca), by + 26 * Math.sin(ca)], e = [bx + sd * 46 * Math.cos(a), by + 46 * Math.sin(a)];
              flags[k].setAttribute("d", `M${bx} ${by} Q${f1(c[0])} ${f1(c[1])} ${f1(e[0])} ${f1(e[1])}`);
            });
            const dark = 1 - st.light;
            cup.setAttribute("fill", mixCol(GREEN, DULL, dark * .85)); pyr.setAttribute("fill", mixCol(GREEN_D, "#4a5048", dark * .85));
          },
        };
      }

      function buildVolvox(g, R) {
        const k = R / 54, N = 60, P3 = [];
        for (let i = 0; i < N; i++) { const y = 1 - 2 * (i + .5) / N, r = Math.sqrt(1 - y * y), th = i * 2.39996; P3.push([r * Math.cos(th), y, r * Math.sin(th)]); }
        const pairs = [];
        P3.forEach((a, i) => { P3.map((b, j) => [j, Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])]).filter(x => x[0] > i).sort((x, y) => x[1] - y[1]).slice(0, 2).forEach(x => { if (x[1] < .5) pairs.push([i, x[0]]); }); });
        el("circle", { r: R, fill: "rgba(120,200,130,.08)", stroke: "#9fd9a8", "stroke-width": 1.6 * Math.max(k, .7) }, g);
        const dg = [[-14, 12, 14, 9], [17, -12, 10, 7]].map(([x, y, r, n]) => {
          const gg = el("g", { transform: `translate(${x * k} ${y * k})` }, g);
          el("circle", { r: r * k, fill: "rgba(79,179,94,.22)", stroke: GREEN, "stroke-width": 1.2 }, gg);
          const inner = el("g", {}, gg);
          for (let i = 0; i < n; i++) { const a = i / n * TAU; el("circle", { cx: f1(Math.cos(a) * r * k * .78), cy: f1(Math.sin(a) * r * k * .78), r: f2(1.7 * k + .3), fill: GREEN_D }, inner); }
          return inner;
        });
        const sg = el("g", {}, g), strands = pairs.map(() => el("line", { stroke: "#bfe8c4", "stroke-width": f2(Math.max(.7, 1.1 * k)) }, sg));
        const cells = P3.map(() => el("circle", { fill: GREEN, stroke: GREEN_D, "stroke-width": .8 }, g));
        return {
          update(t, mv) {
            const rot = .4 + mv * t * .35, tilt = .35, ct = Math.cos(tilt), stl = Math.sin(tilt);
            const pr = P3.map(([x, y, z]) => { const xr = x * Math.cos(rot) + z * Math.sin(rot), zr = -x * Math.sin(rot) + z * Math.cos(rot); const y2 = y * ct - zr * stl, z2 = y * stl + zr * ct; return [xr * R, y2 * R, z2]; });
            cells.forEach((c, i) => { const [x, y, z] = pr[i]; c.setAttribute("cx", f1(x)); c.setAttribute("cy", f1(y)); c.setAttribute("r", f2((z > 0 ? 3.3 : 2.4) * k + .4)); c.setAttribute("opacity", f2(z > 0 ? .55 + .45 * z : .2)); });
            strands.forEach((s, i) => { const [a, b] = pairs[i], A = pr[a], B = pr[b], z = (A[2] + B[2]) / 2; s.setAttribute("x1", f1(A[0])); s.setAttribute("y1", f1(A[1])); s.setAttribute("x2", f1(B[0])); s.setAttribute("y2", f1(B[1])); s.setAttribute("opacity", f2(z > 0 ? .35 + .5 * z : .1)); });
            dg.forEach((d, i) => d.setAttribute("transform", `rotate(${f1((rot * 57.3 * (i ? -1 : 1)) % 360)})`));
          },
        };
      }

      function buildSpirogyra(g) {
        const H = 52, Wd = 17, cells = [];
        for (let i = 0; i < 4; i++) {
          const y0 = -104 + i * H, cg = el("g", {}, g);
          el("rect", { x: -Wd, y: y0, width: 2 * Wd, height: H, rx: 7, fill: "rgba(120,200,130,.10)", stroke: "#bfe8c4", "stroke-width": 2 }, cg);
          const kk = TAU / 24, ph = i * 1.1, front = [], back = [];
          let curF = null, curB = null;
          for (let y = y0 + 3; y <= y0 + H - 3; y += 1) {
            const a = kk * (y - y0) + ph, x = 12.5 * Math.sin(a), isF = Math.cos(a) > 0;
            if (isF) { if (!curF) { curF = []; front.push(curF); } curF.push([x, y]); curB = null; } else { if (!curB) { curB = []; back.push(curB); } curB.push([x, y]); curF = null; }
          }
          back.forEach(s => s.length > 1 && el("path", { d: line(s), stroke: "#3e8a4b", "stroke-width": 2.4, fill: "none", "stroke-linecap": "round", opacity: .7 }, cg));
          [-.6, 0, .6].forEach(a => { const yy = y0 + H / 2; el("line", { x1: 0, y1: yy, x2: f1(Math.sin(a) * 13), y2: f1(yy + (a ? 14 : -15) * (a < 0 ? -1 : 1)), stroke: "rgba(214,230,222,.35)", "stroke-width": .9 }, cg); el("line", { x1: 0, y1: yy, x2: f1(-Math.sin(a) * 13), y2: f1(yy + 15 * (a <= 0 ? 1 : -1)), stroke: "rgba(214,230,222,.35)", "stroke-width": .9 }, cg); });
          front.forEach(s => s.length > 1 && el("path", { d: line(s), stroke: GREEN, "stroke-width": 4.6, fill: "none", "stroke-linecap": "round" }, cg));
          el("ellipse", { cx: 0, cy: y0 + H / 2, rx: 5, ry: 4, fill: NUC, stroke: NUC_D, "stroke-width": 1.2 }, cg);
          cells.push(cg);
        }
        return { cells };
      }

      function buildHydra(g) {
        const side = [[-14, -76], [-21, -50], [-22, -10], [-21, 30], [-16, 62], [-13, 78]];
        const bodyPts = side.concat([[-20, 84], [0, 88], [20, 84]], side.slice().reverse().map(([x, y]) => [-x, y]));
        const body = el("path", { d: line(bodyPts) + "Z", "stroke-width": 2, "stroke-linejoin": "round" }, g);
        el("ellipse", { cx: 0, cy: 84, rx: 21, ry: 5.5, fill: "rgba(217,203,179,.35)", stroke: NEUTRAL, "stroke-width": 1.6 }, g);      // basal disc
        const hyp = el("path", { d: "M-14 -76 Q-8 -90 0 -92 Q8 -90 14 -76", "stroke-width": 2 }, g);
        el("ellipse", { cx: 0, cy: -91, rx: 4, ry: 1.8, fill: "#131820" }, g);                                                        // mouth
        // cut-away strip: ectoderm (outer) and endoderm (inner) round the enteron
        const cut = el("g", {}, g);
        el("rect", { x: -22, y: -38, width: 44, height: 76, fill: "#141a22" }, cut);
        const ecto = [], endo = [];
        [-1, 1].forEach(sd => {
          for (let i = 0; i < 12; i++) ecto.push(el("rect", { x: sd < 0 ? -22 : 16, y: f1(-38 + i * 76 / 12 + .4), width: 6, height: f1(76 / 12 - .8), rx: 1.5, "stroke-width": .8, stroke: "#141a22" }, cut));
          for (let i = 0; i < 8; i++) { const y = -38 + i * 9.5 + .5; endo.push(el("rect", { x: sd < 0 ? -15 : 6.5, y: f1(y), width: 8.5, height: 8.5, rx: 2.5, "stroke-width": .8, stroke: "#141a22" }, cut)); el("circle", { cx: sd < 0 ? -10.8 : 10.8, cy: f1(y + 4.2), r: 1.4, fill: NUC_D }, cut); }
          el("line", { x1: sd * 15.6, y1: -38, x2: sd * 15.6, y2: 38, stroke: "#f3f6f4", "stroke-width": 1, opacity: .8 }, cut);    // mesoglea
        });
        el("path", { d: "M-23 -38 H23 M-23 38 H23", stroke: "#f3f6f4", "stroke-width": 1.2, "stroke-dasharray": "3 2", opacity: .7 }, cut);
        const tent = [], NT = 6, ANG = [-1.25, -.8, -.3, .3, .8, 1.25], LEN = [70, 60, 48, 48, 60, 70];
        for (let i = 0; i < NT; i++) {
          const path = el("path", { "stroke-width": 3.8, fill: "none", "stroke-linecap": "round" }, g);
          const nem = [0, 1, 2].map(() => el("circle", { r: 2.7, stroke: "#141a22", "stroke-width": .6 }, g));
          const coil = el("path", { d: "M0 0 c2 -3 5 -1 3 2 c-2 3 -6 1 -4 -3 c2 -4 8 -3 7 2", stroke: STING, "stroke-width": 1, fill: "none" }, g);
          tent.push({ path, nem, coil, a: ANG[i], L: LEN[i], bx: -12 + i * 4.8, ph: i * 1.3 });
        }
        const tip = (o, u, t, mv) => {
          const a = o.a + .16 * mv * Math.sin(t * 1.3 + o.ph), bx = o.bx, by = -85;
          const ac = clamp(a * 1.3, -1.62, 1.62), ae = a * .85;
          const c = [bx + Math.sin(ac) * o.L * .6, by - Math.cos(ac) * o.L * .6], e = [bx + Math.sin(ae) * o.L, by - Math.cos(ae) * o.L];
          const q = (p0, p1, p2) => (1 - u) * (1 - u) * p0 + 2 * (1 - u) * u * p1 + u * u * p2;
          return { d: `M${f1(bx)} ${by} Q${f1(c[0])} ${f1(c[1])} ${f1(e[0])} ${f1(e[1])}`, x: q(bx, c[0], e[0]), y: q(by, c[1], e[1]) };
        };
        return {
          tipAt: (t, mv) => tip(tent[5], .86, t, mv),
          update(t, mv, jobs) {
            const cov = mixCol(NEUTRAL, COVER, jobs), dig = mixCol(NEUTRAL, DIGEST, jobs), sting = mixCol(NEUTRAL, STING, jobs);
            body.setAttribute("fill", mixCol("#3b3a36", "#24465a", jobs)); body.setAttribute("stroke", cov);
            hyp.setAttribute("fill", mixCol("#3b3a36", "#24465a", jobs)); hyp.setAttribute("stroke", cov);
            ecto.forEach(e => e.setAttribute("fill", cov)); endo.forEach(e => e.setAttribute("fill", dig));
            tent.forEach(o => {
              const T = tip(o, 1, t, mv); o.path.setAttribute("d", T.d); o.path.setAttribute("stroke", cov);
              [.4, .63, .86].forEach((u, k) => { const p = tip(o, u, t, mv); o.nem[k].setAttribute("cx", f1(p.x)); o.nem[k].setAttribute("cy", f1(p.y)); o.nem[k].setAttribute("fill", sting); });
              const p = tip(o, .63, t, mv); o.coil.setAttribute("transform", `translate(${f1(p.x + 2)} ${f1(p.y - 2)})`); o.coil.setAttribute("opacity", f2(jobs));
            });
          },
        };
      }

      // ================= scene: gallery =================
      const G = scenes.gallery;
      const fieldC = el("circle", { cx: 210, cy: 210, r: 206, fill: "rgba(214,240,228,.13)", stroke: "#9fb8ad", "stroke-width": 3 }, G);
      const fieldDark = el("circle", { cx: 210, cy: 210, r: 204, fill: "#05080b", opacity: 0 }, G);
      const sun = el("g", { transform: "translate(398 22)" }, G);
      el("circle", { r: 9, fill: GOLD }, sun);
      for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; el("line", { x1: f1(Math.cos(a) * 12), y1: f1(Math.sin(a) * 12), x2: f1(Math.cos(a) * 17), y2: f1(Math.sin(a) * 17), stroke: GOLD, "stroke-width": 2.4, "stroke-linecap": "round" }, sun); }
      const moon = el("path", { d: "M402 12 A12 12 0 1 0 408 34 A9 9 0 1 1 402 12 Z", fill: "#7d8aa0", opacity: 0 }, G);
      const NUT = { amoeba: ["holozoic", "holozoic"], paramecium: ["holozoic", "holozoic"], hydra: ["holozoic", "holozoic"], euglena: ["autotrophic", "saprophytic"], chlamydomonas: ["autotrophic", "no food made"], volvox: ["autotrophic", "no food made"], spirogyra: ["autotrophic", "no food made"] };
      const NUT_COL = { holozoic: PAL.orange, autotrophic: PAL.green, saprophytic: PAL.purple, "no food made": "#a7b3ad" };
      const NAMES = { amoeba: "Amoeba", paramecium: "Paramecium", euglena: "Euglena", chlamydomonas: "Chlamydomonas", volvox: "Volvox", spirogyra: "Spirogyra", hydra: "Hydra" };
      const pill = (parent, text) => { const g = el("g", {}, parent), c = NUT_COL[text], w = text.length * 9.2 + 18; el("rect", { x: f1(-w / 2), y: 82, width: f1(w), height: 22, rx: 11, fill: c + "2e", stroke: c, "stroke-width": 1.5 }, g); tx(text, 0, 93.5, 12, c, g, "middle", 800); return g; };
      const ORG = {};
      GALLERY_IDS.forEach(id => {
        const g = el("g", { opacity: 0 }, G), body = el("g", {}, g);
        let o;
        if (id === "amoeba") o = buildAmoeba(body);
        else if (id === "paramecium") o = buildParamecium(body);
        else if (id === "euglena") o = buildEuglena(body);
        else if (id === "chlamydomonas") o = buildChlamy(body);
        else if (id === "volvox") { const v = buildVolvox(body, 40); o = { update: (t, st) => v.update(t, st.mv) }; }
        else if (id === "spirogyra") { const inner = el("g", { transform: "rotate(-90) scale(.72)" }, body); buildSpirogyra(inner); o = { update() {} }; }
        else { const inner = el("g", { transform: "translate(0 2) scale(.42)" }, body); const h = buildHydra(inner); o = { update: (t, st) => h.update(t, st.mv, 0) }; }
        const name = ital(tx(NAMES[id], 0, 70, 14, GOLD, g, "middle", 800));
        const nut = el("g", {}, g), bL = pill(nut, NUT[id][0]), bD = NUT[id][1] !== NUT[id][0] ? pill(nut, NUT[id][1]) : null;
        ORG[id] = { g, o, name, nut, bL, bD };
      });
      const slotOf = (i, n) => n <= 1 ? { x: 210, y: 192, sc: 1.68 } : n === 2 ? { x: [106, 314][i], y: 200, sc: 1 } : { x: [106, 314, 106, 314][i], y: [112, 112, 304, 304][i], sc: 1 };
      const showList = s => (Array.isArray(s.show) ? s.show : ["amoeba", "paramecium", "euglena", "chlamydomonas"]).filter(id => ORG[id]).slice(0, 4);

      // ================= scene: compare =================
      const K = scenes.compare;
      const VX = 70, VY = 152, SXc = 200, SYc = 160, HX = 335, HY = 168;
      const volG = el("g", { transform: `translate(${VX} ${VY})` }, K), vol = buildVolvox(volG, 54);
      const spiG = el("g", { transform: `translate(${SXc} ${SYc})` }, K), spi = buildSpirogyra(spiG);
      const hydG = el("g", { transform: `translate(${HX} ${HY})` }, K), hyd = buildHydra(hydG);
      // lifted cells (separate)
      const vCell = el("g", {}, K);
      el("path", { d: "M-2 -6 Q-10 -16 -6 -26 M2 -6 Q10 -16 6 -26", stroke: INK, "stroke-width": 1.6, fill: "none" }, vCell);
      el("ellipse", { rx: 6.5, ry: 7.5, fill: GREEN, stroke: GREEN_D, "stroke-width": 1.2 }, vCell);
      el("circle", { cx: 3.5, cy: -3, r: 1.6, fill: EYE }, vCell);
      const vFlag = vCell.firstChild;
      const sCell = spi.cells[3];
      const hCell = el("g", {}, K);
      const hCap = el("ellipse", { rx: 5.5, ry: 4.2, stroke: "#141a22", "stroke-width": .8 }, hCell);
      const hThr = el("path", { d: "M4 -2 c3 -4 7 -2 5 2 c-2 4 -7 2 -5 -3 c2 -5 10 -4 9 3", fill: "none", "stroke-width": 1.2 }, hCell);
      // labels
      const kLab = el("g", {}, K);
      [["Volvox", VX], ["Spirogyra", SXc], ["Hydra", HX]].forEach(([n, x]) => ital(tx(n, x, 18, 15, GOLD, kLab, "middle", 800)));
      label(kLab, "strands", VX, 228, "middle", VX + 4, VY + 40);
      const spLab = el("g", {}, kLab);
      label(spLab, "spiral", SXc, 284, "middle", SXc + 8, SYc + 92);
      tx("chloroplast", SXc, 300, 12, INK, spLab, "middle", 700);
      label(kLab, "ectoderm", 300, HY - 26, "end", HX - 19, HY - 26);
      label(kLab, "endoderm", 300, HY + 22, "end", HX - 11, HY + 22);
      const formG = el("g", {}, kLab);
      [["colony", VX], ["filament", SXc], ["tissue level", HX]].forEach(([n, x]) => tx(n, x, 394, 15, INK, formG, "middle", 800));
      const jobKey = el("g", {}, K);
      [["catch food", STING], ["digest", DIGEST], ["cover", COVER]].forEach(([n, c], i) => { el("rect", { x: 268, y: 278 + i * 19, width: 12, height: 12, rx: 3, fill: c }, jobKey); tx(n, 286, 284 + i * 19, 12, c, jobKey, "start", 800); });
      const alike = el("g", {}, K);
      tx("all alike", VX, 250, 12, GREEN, alike, "middle", 800); tx("all alike", SXc, 320, 12, GREEN, alike, "middle", 800);
      const okV = tx("✓ lives alone", VX, 352, 12, PAL.green, K, "middle", 800), okS = tx("✓ lives alone", SXc, 352, 12, PAL.green, K, "middle", 800), noH = tx("✗ can't live alone", HX + 4, 352, 12, PAL.red, K, "middle", 800);

      // ================= scene: levels =================
      const L = scenes.levels;
      const RUNG_Y = i => 362 - 58 * i;
      el("path", { d: "M40 386 V64", stroke: GOLD, "stroke-width": 4, "stroke-linecap": "round" }, L);
      el("path", { d: "M30 74 L40 56 L50 74 Z", fill: GOLD }, L);
      const mc = tx("more complex", 0, 0, 13, GOLD, L, "middle", 800); mc.setAttribute("transform", "translate(17 224) rotate(-90)");
      const LEVELS = [
        ["organelle", PAL.purple, ["mitochondrion", "chloroplast"]],
        ["cell", PAL.sky, ["heart muscle cell", "palisade cell"]],
        ["tissue", PAL.green, ["heart muscle", "palisade layer"]],
        ["organ", PAL.orange, ["heart", "leaf"]],
        ["system", PAL.pink, ["circulatory sys.", "shoot system"]],
        ["organism", GOLD, ["Chinedu", "ugu plant"]],
      ];
      const ICON = {
        animal: [
          g => { el("ellipse", { rx: 17, ry: 10, fill: "#e59a5c", stroke: "#ffd0a0", "stroke-width": 1.5 }, g); el("path", { d: "M-12 0 l3 -6 l3 9 l3 -9 l3 9 l3 -9 l3 9 l3 -6", stroke: "#8a4a22", "stroke-width": 1.6, fill: "none" }, g); },
          g => { el("path", { d: "M-18 -5 H6 L14 -12 M6 -5 V5 L14 12 M6 5 H-18 Z", fill: "rgba(226,90,100,.35)", stroke: "#ff8a8a", "stroke-width": 1.8, "stroke-linejoin": "round" }, g); for (let x = -15; x < 6; x += 3.5) el("line", { x1: x, y1: -4, x2: x, y2: 4, stroke: "#ff8a8a", "stroke-width": 1 }, g); el("ellipse", { cx: -6, cy: 0, rx: 3.5, ry: 2.2, fill: NUC }, g); },
          g => { [-10, 0, 10].forEach((y, r) => { el("rect", { x: -18, y: y - 3.5, width: 36, height: 7, rx: 2, fill: "rgba(226,90,100,.35)", stroke: "#ff8a8a", "stroke-width": 1.2 }, g); for (let x = -15; x < 18; x += 4) el("line", { x1: x, y1: y - 3, x2: x, y2: y + 3, stroke: "#ff8a8a", "stroke-width": .8 }, g); }); el("path", { d: "M-6 -6.5 L-1 -3.5 M8 3.5 L13 6.5 M-12 3.5 L-7 6.5", stroke: "#ffd0a0", "stroke-width": 1.6 }, g); },
          g => { el("path", { d: "M-15 -6 C-17 -16 -5 -18 -1 -10 C3 -18 17 -15 15 -4 C13 8 6 13 9 18 C-3 15 -15 7 -15 -6 Z", fill: "#c9444e", stroke: "#ff8a8a", "stroke-width": 1.5 }, g); el("path", { d: "M1 -11 C1 -20 10 -21 11 -13", stroke: "#e2464f", "stroke-width": 3, fill: "none" }, g); el("path", { d: "M-8 -12 V-19", stroke: "#4f7fe0", "stroke-width": 3 }, g); },
          g => { el("ellipse", { rx: 18, ry: 14, fill: "none", stroke: "#4f7fe0", "stroke-width": 2.6 }, g); el("path", { d: "M-18 0 A18 14 0 0 1 18 0", fill: "none", stroke: "#e2464f", "stroke-width": 2.6 }, g); el("path", { d: "M-7 -2 C-8 -7 -2 -8 0 -4 C2 -8 8 -7 7 -2 C6 3 1 5 0 8 C-2 5 -6 3 -7 -2 Z", fill: "#c9444e" }, g); },
          g => { el("circle", { cx: 0, cy: -11, r: 6.5, fill: "#e8efe9" }, g); el("path", { d: "M-12 18 V2 Q-12 -3 -6 -3 H6 Q12 -3 12 2 V18 Z", fill: PAL.sky }, g); el("path", { d: "M-3 -3 L0 4 L3 -3", stroke: "#1b222d", "stroke-width": 1.5, fill: "none" }, g); },
        ],
        plant: [
          g => { el("ellipse", { rx: 17, ry: 10, fill: GREEN, stroke: "#bfe8c4", "stroke-width": 1.5 }, g); [-9, -2, 5, 11].forEach(x => { el("rect", { x: x - 2.5, y: -3.5, width: 5, height: 7, rx: 1, fill: GREEN_D }, g); }); el("line", { x1: -13, y1: 0, x2: 14, y2: 0, stroke: GREEN_D, "stroke-width": 1 }, g); },
          g => { el("rect", { x: -8, y: -17, width: 16, height: 34, rx: 5, fill: "rgba(120,200,130,.15)", stroke: "#bfe8c4", "stroke-width": 1.6 }, g); [[-4, -12], [4, -7], [-4, -2], [4, 3], [-4, 8], [4, 12]].forEach(([x, y]) => el("ellipse", { cx: x, cy: y, rx: 2.8, ry: 2, fill: GREEN }, g)); },
          g => { [-15, -5, 5, 15].forEach(x => { el("rect", { x: x - 4.5, y: -16, width: 9, height: 32, rx: 3, fill: "rgba(120,200,130,.15)", stroke: "#bfe8c4", "stroke-width": 1.2 }, g); [-9, -1, 7].forEach(y => el("circle", { cx: x, cy: y, r: 2, fill: GREEN }, g)); }); },
          g => { el("path", { d: "M-16 12 C-14 -6 2 -16 17 -16 C16 0 4 14 -16 12 Z", fill: GREEN, stroke: "#bfe8c4", "stroke-width": 1.4 }, g); el("path", { d: "M-19 16 L-16 12 L13 -12 M-4 2 L-2 -8 M4 -4 L8 -12 M-8 6 L-10 -2", stroke: "#bfe8c4", "stroke-width": 1.2, fill: "none" }, g); },
          g => { el("path", { d: "M0 19 V-17", stroke: "#bfe8c4", "stroke-width": 2.2 }, g); el("path", { d: "M0 6 C-6 2 -16 4 -18 -4 C-10 -6 -4 -2 0 4 Z M0 -4 C6 -8 16 -6 18 -14 C10 -16 4 -12 0 -6 Z", fill: GREEN }, g); el("circle", { cx: 0, cy: -18, r: 3, fill: "#9fd9a8" }, g); el("path", { d: "M-14 19 H14", stroke: "#a07a50", "stroke-width": 2 }, g); },
          g => { el("path", { d: "M-2 19 C-6 6 4 -4 -2 -18", stroke: "#bfe8c4", "stroke-width": 2, fill: "none" }, g); [[-2, 4, -1], [1, -8, 1]].forEach(([x, y, sd]) => [-.7, 0, .7].forEach(a => { const an = (sd > 0 ? -.6 : -2.5) + a; el("ellipse", { cx: f1(x + Math.cos(an) * 8), cy: f1(y + Math.sin(an) * 8), rx: 7, ry: 3.4, fill: GREEN, transform: `rotate(${f1(an * 57.3)} ${f1(x + Math.cos(an) * 8)} ${f1(y + Math.sin(an) * 8)})` }, g); })); el("path", { d: "M-2 -18 c4 -2 6 2 3 4 c-3 2 -5 -2 -2 -3", stroke: "#bfe8c4", "stroke-width": 1, fill: "none" }, g); },
        ],
      };
      const rungs = LEVELS.map(([word, col, ex], i) => {
        const g = el("g", {}, L);
        const box = el("rect", { x: 64, y: -24, width: 342, height: 48, rx: 12, fill: "#1f2733", stroke: "#4a5266", "stroke-width": 2 }, g);
        const glow = el("rect", { x: 61, y: -27, width: 348, height: 54, rx: 14, fill: "none", stroke: GOLD, "stroke-width": 3, opacity: 0 }, g);
        el("circle", { cx: 96, cy: 0, r: 21, fill: "rgba(255,255,255,.05)" }, g);
        const ia = el("g", { transform: "translate(96 0)" }, g), ip = el("g", { transform: "translate(96 0)" }, g);
        ICON.animal[i](ia); ICON.plant[i](ip);
        tx(word, 128, 0, 15, col, g, "start", 800);
        const exG = el("g", {}, g), ea = tx(ex[0], 396, 0, 13, INK, exG, "end", 700), ep = tx(ex[1], 396, 0, 13, INK, exG, "end", 700);
        return { g, box, glow, ia, ip, ea, ep, exG };
      });
      const wrong = tx("✗ wrong order", 220, 22, 15, PAL.red, L, "middle", 800), right = tx("✓ right order", 220, 22, 15, PAL.green, L, "middle", 800);

      // ================= focus ring =================
      const ringR = el("rect", { fill: "none", stroke: GOLD, "stroke-width": 3, "stroke-dasharray": "7 6", rx: 18, opacity: 0 }, svg);
      const ringC = el("circle", { cx: 210, cy: 210, r: 200, fill: "none", stroke: GOLD, "stroke-width": 3, "stroke-dasharray": "7 6", opacity: 0 }, svg);

      return {
        draw(t, P) {
          const s = P.s, p = P.p, u = P.u, cur = s.scene || "gallery", prev = p.scene || cur;
          for (const k in scenes) scenes[k].setAttribute("opacity", f2(k === cur ? (prev === cur ? 1 : u) : k === prev ? 1 - u : 0));
          LIVE.scene = cur;
          const lab = mixN(p, s, "labels", u), mv = mixN(p, s, "move", u);
          const vis = k => k === cur || (k === prev && u < 1);

          // ---- gallery ----
          if (vis("gallery")) {
            const now = showList(s), was = p.scene === "gallery" || !p.scene ? showList(p) : now;
            const light = mixN(p, s, "light", u, 1), nut = mixN(p, s, "nutrition", u), eng = mixN(p, s, "engulf", u);
            fieldC.setAttribute("fill", `rgba(214,240,228,${f2(.04 + .1 * light)})`);
            fieldDark.setAttribute("opacity", f2(.55 * (1 - light)));
            sun.setAttribute("opacity", f2(light)); moon.setAttribute("opacity", f2(1 - light));
            const st = { mv, eng, light };
            LIVE.slots = {};
            const fresh = now.filter(id => !was.includes(id));
            GALLERY_IDS.forEach(id => {
              const O = ORG[id], i = now.indexOf(id), j = was.indexOf(id);
              if (i < 0 && j < 0) { O.g.setAttribute("opacity", 0); return; }
              let pos, op;
              if (i >= 0 && j >= 0) { const a = slotOf(j, was.length), b = slotOf(i, now.length); pos = { x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), sc: lerp(a.sc, b.sc, u) }; op = 1; }
              else if (i >= 0) { pos = slotOf(i, now.length); op = clamp((t - P.t0 - .4 * fresh.indexOf(id)) / .6, 0, 1); }
              else { pos = slotOf(j, was.length); op = 1 - u; }
              if (i >= 0) LIVE.slots[id] = slotOf(i, now.length);
              O.g.setAttribute("opacity", f2(op));
              O.g.setAttribute("transform", `translate(${f1(pos.x)} ${f1(pos.y)}) scale(${f2(pos.sc)})`);
              O.o.update(t, st);
              if (O.o.labs) O.o.labs.setAttribute("opacity", f2(lab));
              O.name.setAttribute("opacity", f2(lab));
              O.nut.setAttribute("opacity", f2(nut));
              if (O.bD) { O.bL.setAttribute("opacity", f2(light)); O.bD.setAttribute("opacity", f2(1 - light)); }
            });
          }

          // ---- compare ----
          if (vis("compare")) {
            const jobs = mixN(p, s, "jobs", u);
            const sep = s.separate ? (p.separate ? 1 : clamp((t - P.t0) / 3, 0, 1)) : (p.separate ? 1 - u : 0), se = ease(sep);
            vol.update(t, mv); hyd.update(t, mv, jobs);
            kLab.setAttribute("opacity", f2(lab));
            spLab.setAttribute("opacity", f2(lab * (1 - se)));
            jobKey.setAttribute("opacity", f2(jobs)); alike.setAttribute("opacity", f2(jobs));
            // Volvox cell swims out of the colony to the lower left
            const vx = lerp(VX - 40, 32, se), vy = lerp(VY + 36, 300, se) + Math.sin(t * 3) * 3 * se;
            vCell.setAttribute("transform", `translate(${f1(vx)} ${f1(vy)}) rotate(${f1(lerp(-40, -150, se))})`);
            vCell.setAttribute("opacity", f2(clamp(sep * 5, 0, 1)));
            const fb = .5 - .5 * Math.cos(t * 8);
            vFlag.setAttribute("d", `M-2 -6 Q${f1(-10 - 4 * fb)} -16 ${f1(-6 - 6 * fb)} -26 M2 -6 Q${f1(10 + 4 * fb)} -16 ${f1(6 + 6 * fb)} -26`);
            // Spirogyra: the bottom cell slides out of the filament, still green
            sCell.setAttribute("transform", `translate(${f1(-46 * se)} ${f1(8 * se)})`);
            // Hydra: one stinging cell drifts away, greys and fades
            const tp = hyd.tipAt(t, mv), hx = HX + tp.x, hy = HY + tp.y;
            const gx = lerp(hx, 398, se), gy = lerp(hy, 120, se), grey = clamp((sep - .35) / .5, 0, 1);
            hCell.setAttribute("transform", `translate(${f1(gx)} ${f1(gy)})`);
            hCell.setAttribute("opacity", f2(clamp(sep * 5, 0, 1) * (1 - .68 * grey)));
            const hc = mixCol(STING, "#8a8f94", grey); hCap.setAttribute("fill", hc); hThr.setAttribute("stroke", hc);
            const res = clamp((sep - .8) / .2, 0, 1);
            okV.setAttribute("opacity", f2(res)); okS.setAttribute("opacity", f2(res)); noH.setAttribute("opacity", f2(res));
          }

          // ---- levels ----
          if (vis("levels")) {
            const lv = mixN(p, s, "level", u, 6), sw = ease(mixN(p, s, "swap", u)), an = pick(P, "example", "animal", "animal");
            const newest = (s.level != null ? +s.level : 6) > (p.level != null ? +p.level : 6) ? (s.level != null ? +s.level : 6) - 1 : -1;
            const gk = clamp((t - P.t0 - .6) / .4, 0, 1) * (1 - clamp((t - P.t0 - 2.6) / 1.2, 0, 1));
            rungs.forEach((r, i) => {
              const v = clamp(lv - i, 0, 1);
              let y = RUNG_Y(i);
              if (i === 3) y = lerp(RUNG_Y(3), RUNG_Y(4), sw); if (i === 4) y = lerp(RUNG_Y(4), RUNG_Y(3), sw);
              const dx = (i === 3 ? -1 : i === 4 ? 1 : 0) * Math.sin(sw * Math.PI) * 14;
              r.g.setAttribute("transform", `translate(${f1(dx)} ${f1(y + (1 - ease(v)) * 24)})`);
              r.g.setAttribute("opacity", f2(v));
              r.box.setAttribute("stroke", (i === 3 || i === 4) ? mixCol("#4a5266", "#ff6b6b", sw) : "#4a5266");
              r.glow.setAttribute("opacity", f2(i === newest ? gk * (.6 + .4 * Math.sin(t * 6)) : 0));
              r.ia.setAttribute("opacity", f2(an)); r.ip.setAttribute("opacity", f2(1 - an));
              r.ea.setAttribute("opacity", f2(an)); r.ep.setAttribute("opacity", f2(1 - an));
              r.exG.setAttribute("opacity", f2(lab));
            });
            wrong.setAttribute("opacity", f2(sw));
            right.setAttribute("opacity", f2(!s.swap && p.swap ? clamp((t - P.t0 - 1) / .5, 0, 1) : 0));
          }

          // ---- focus ring ----
          const fz = s.focus, pulse = .65 + .35 * Math.sin(t * 5);
          ringC.setAttribute("opacity", f2(fz === "field" ? pulse : 0));
          const BODY = { amoeba: [-64, -48, 128, 96], paramecium: [-76, -36, 152, 72], euglena: [-92, -26, 188, 52], chlamydomonas: [-38, -78, 76, 122], volvox: [-46, -46, 92, 92], spirogyra: [-80, -18, 160, 36], hydra: [-38, -64, 76, 108] };
          const sl = cur === "gallery" && LIVE.slots[fz];
          const R = sl ? [sl.x + (BODY[fz][0] - 8) * sl.sc, sl.y + (BODY[fz][1] - 8) * sl.sc, (BODY[fz][2] + 16) * sl.sc + 12, (BODY[fz][3] + 16) * sl.sc + 12]
            : fz && fz !== "field" && fz in focus ? focus[fz] : null;
          if (R && !(R[0] === 0 && R[2] === 420)) {
            const x = Math.max(4, R[0] + 6), y = Math.max(4, R[1] + 6), x2 = Math.min(416, R[0] + R[2] - 6), y2 = Math.min(416, R[1] + R[3] - 6);
            ringR.setAttribute("x", f1(x)); ringR.setAttribute("y", f1(y)); ringR.setAttribute("width", f1(x2 - x)); ringR.setAttribute("height", f1(y2 - y));
            ringR.setAttribute("opacity", f2(pulse));
          } else ringR.setAttribute("opacity", 0);
        },
      };
    },
  };
})();
