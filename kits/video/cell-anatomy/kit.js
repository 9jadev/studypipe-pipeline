/* =========================================================
   StudyPipe explainer-video kit · cell-anatomy
   Scene 'compare': two cells side by side (a left and a right slot), each one of
     'bacterium' (prokaryote): rod; cell wall (not cellulose) outside the membrane; one circular DNA loop lying free in the
        cytoplasm (nucleoid, NO nuclear membrane); a plasmid ring; many small (70S) ribosomes; a flagellum.
        No mitochondria, ER, Golgi, chloroplasts or vacuole.
     'plant' (eukaryote): box shape; cellulose wall; membrane; cytoplasm; large central vacuole lined by the tonoplast;
        nucleus pushed to the side (double nuclear membrane with pores, nucleolus, linear chromosomes); mitochondria (cristae);
        chloroplasts (grana); rough ER studded with ribosomes; Golgi body; larger (80S) free ribosomes.
     'animal' (eukaryote): rounded, membrane only (NO wall); central nucleus; mitochondria; rough ER; Golgi body; centrosome
        (a pair of centrioles at right angles); lysosomes; small vacuoles; ribosomes; no chloroplasts.
   Scale: 'zoom' (default) shows the bacterium enlarged in a magnifier inset (tagged "enlarged") with its real-size dot
   below; 'true' shrinks it to scale (≈ 2 µm beside a ≈ 50 µm plant cell). Never drawn as if the same size.
   Highlights (nucleus, dna, organelles, ribosomes, wall) make the matching parts glow while the rest dims.
   Every organelle is drawn by a stand-alone helper (ORG.*) so a later scene (single cell, organelle close-ups for the
   plant/animal lesson) can reuse it at any size.
   Contract: .agents/skills/explainer-video/references/adding-a-kit.md · every frame is a pure function of (t, P).
   ========================================================= */
(window.VIDEO_KITS = window.VIDEO_KITS || {})["cell-anatomy"] = {
  title: "Cell anatomy: prokaryote vs eukaryote, plant and animal cells, organelles",
  states: {
    scene: "'compare' (two cells side by side)",
    left: "kind of cell in the left slot: 'bacterium' | 'plant' | 'animal' (default 'bacterium')",
    right: "kind of cell in the right slot: 'bacterium' | 'plant' | 'animal' (default 'plant')",
    scale: "'zoom' (default: bacterium enlarged in a magnifier inset) | 'true' (bacterium drawn to scale, tiny)",
    titles: "0/1: 'prokaryote' / 'eukaryote' above each cell ('plant cell' / 'animal cell' when both are eukaryotes)",
    labels: "0/1: part labels (with a highlight on, only that highlight's labels show)",
    nucleus: "0/1: nuclear membrane glows; the bacterium shows a dashed 'no membrane' ring round its DNA + 'no nucleus'",
    dna: "0/1: DNA glows: circular loop (prokaryote) vs linear chromosomes in the nucleus (eukaryote)",
    organelles: "0/1: membrane-bound organelles glow (mitochondria, ER, Golgi, chloroplasts, vacuole, lysosomes) + counters 0 vs many",
    ribosomes: "0/1: ribosomes glow in both cells: 'smaller' (prokaryote) vs 'larger' (eukaryote)",
    wall: "0/1: the wall glows on the bacterium AND the plant cell ('no wall' on an animal cell)",
    focus: "ring: 'left' | 'right' | 'prokaryote' | 'eukaryote' | 'nucleus' | 'dna' | 'organelles' | 'ribosomes' | null",
  },
  // Camera close-ups in the 420×420 drawing. prokaryote/dna = left slot, eukaryote/nucleus/organelles = right slot
  // (the convention: put the bacterium on the left; nucleus/organelles are framed on a PLANT cell in the right slot).
  focus: {
    left: [0, 34, 210, 380], right: [210, 34, 210, 380],
    prokaryote: [4, 56, 202, 276], eukaryote: [212, 36, 206, 306],
    nucleus: [222, 46, 124, 104], dna: [24, 92, 164, 132], organelles: [270, 42, 146, 166], ribosomes: [8, 66, 404, 192],
  },
  create(svg, api) {
    const { el, tx, mixN, lerp, clamp } = api;
    // ---------- palette (textbook conventions on the dark card) ----------
    const K = {
      wallP: "#8f9b3d", wallB: "#b48c4c", memb: "#f6e7a8", cyto: "#cfc8a4", vac: "#bfe3f2", tono: "#4f93bb",
      nuc: "#ae90da", env: "#5a3897", nucleolus: "#462a7c", dna: "#e0457b", mito: "#f39a4a", mitoS: "#a85612", crist: "#7a3a08",
      chl: "#62b24c", chlS: "#2d6b23", gran: "#1d561a", er: "#6f86a3", golgi: "#7f9bc2", ribo: "#3a2a24", lyso: "#c58fb0",
      centri: "#5d6b7a", flag: "#d8bf86", gold: "#ffd25e", ink: "#eef3ef", pill: "rgba(14,18,26,.84)", dim: "#aab6ae",
    };
    const HL = ["nucleus", "dna", "organelles", "ribosomes", "wall"];
    const rnd = (() => { let a = 11; return () => { a = (a * 9301 + 49297) % 233280; return a / 233280; }; })();
    const f1 = (n) => (+n).toFixed(1);

    // ================= ORGANELLE HELPERS (reusable at any size) =================
    // Each returns { g, outline } : g is positioned with a transform, outline is the element the glow halo copies.
    const ORG = {
      mito(parent, x, y, rot = 0, L = 26, W = 13) {
        const g = el("g", { transform: `translate(${x} ${y}) rotate(${rot})` }, parent), h = W / 2, l = L / 2;
        const outline = el("rect", { x: -l, y: -h, width: L, height: W, rx: h, fill: K.mito, stroke: K.mitoS, "stroke-width": 1.6 }, g);
        let d = `M${f1(-l + h * .7)} 0`; const n = Math.max(3, Math.round(L / 6)); // folded inner membrane = cristae
        for (let i = 0; i < n; i++) { const xx = -l + h * .7 + (i + .5) * (L - h * 1.4) / n; d += ` L${f1(xx)} ${f1((i % 2 ? 1 : -1) * h * .62)}`; }
        d += ` L${f1(l - h * .7)} 0`;
        el("path", { d, fill: "none", stroke: K.crist, "stroke-width": 1.4, "stroke-linejoin": "round" }, g);
        return { g, outline };
      },
      chloro(parent, x, y, rot = 0, L = 32, W = 15) {
        const g = el("g", { transform: `translate(${x} ${y}) rotate(${rot})` }, parent);
        const outline = el("ellipse", { cx: 0, cy: 0, rx: L / 2, ry: W / 2, fill: K.chl, stroke: K.chlS, "stroke-width": 1.6 }, g);
        el("line", { x1: -L * .36, y1: 0, x2: L * .36, y2: 0, stroke: K.gran, "stroke-width": .9, opacity: .8 }, g);  // lamellae
        [-L * .25, 0, L * .25].forEach((gx) => { for (let k = 0; k < 3; k++) el("rect", { x: f1(gx - 2.6), y: f1(-W * .28 + k * W * .2), width: 5.2, height: f1(W * .13), rx: .8, fill: K.gran }, g); }); // grana stacks
        return { g, outline };
      },
      nucleus(parent, x, y, rx, ry) {
        const g = el("g", { transform: `translate(${x} ${y})` }, parent);
        const outline = el("ellipse", { cx: 0, cy: 0, rx, ry, fill: K.nuc, stroke: K.env, "stroke-width": 2 }, g);   // outer membrane
        el("ellipse", { cx: 0, cy: 0, rx: rx - 3.6, ry: ry - 3.6, fill: "none", stroke: K.env, "stroke-width": 1.4 }, g); // inner membrane
        for (let i = 0; i < 8; i++) { const a = i / 8 * 6.283 + .3; el("circle", { cx: f1(Math.cos(a) * (rx - 1.8)), cy: f1(Math.sin(a) * (ry - 1.8)), r: 1.7, fill: K.cyto }, g); } // pores
        el("circle", { cx: f1(rx * .28), cy: f1(-ry * .18), r: f1(Math.min(rx, ry) * .26), fill: K.nucleolus }, g);   // nucleolus
        return { g, outline };
      },
      chromosomes(parent, x, y, rx, ry) {                       // linear strands (with free ends) inside a nucleus
        const g = el("g", { transform: `translate(${x} ${y})` }, parent), pts = [[-.55, -.3, .3], [-.45, .25, -.4], [.0, .45, .1], [.1, -.55, -.2], [-.15, -.05, .6]];
        let outline = null;
        pts.forEach(([px, py, a]) => {
          const cx = px * rx, cy = py * ry, L = rx * .38, dx = Math.cos(a) * L / 2, dy = Math.sin(a) * L / 2;
          const p = el("path", { d: `M${f1(cx - dx)} ${f1(cy - dy)} q${f1(dx * .5 - dy * .5)} ${f1(dy * .5 + dx * .5)} ${f1(dx)} ${f1(dy)} t${f1(dx)} ${f1(dy)}`, fill: "none", stroke: K.dna, "stroke-width": 2.4, "stroke-linecap": "round" }, g);
          if (!outline) outline = p;
        });
        return { g, outline };
      },
      dnaLoop(parent, x, y, R) {                                // one closed, coiled circular chromosome (nucleoid)
        const g = el("g", { transform: `translate(${x} ${y})` }, parent);
        let d = ""; for (let i = 0; i <= 72; i++) { const a = i / 72 * 6.2832, r = R * (1 + .22 * Math.sin(a * 5) + .1 * Math.sin(a * 9 + 1)); d += (i ? " L" : "M") + f1(Math.cos(a) * r * 1.25) + " " + f1(Math.sin(a) * r * .85); }
        const outline = el("path", { d: d + " Z", fill: "none", stroke: K.dna, "stroke-width": 2.2, "stroke-linejoin": "round" }, g);
        return { g, outline };
      },
      rer(parent, x, y, w, n = 3, gap = 9) {                    // rough ER: stacked wavy membrane channels; returns ribosome sites
        const g = el("g", { transform: `translate(${x} ${y})` }, parent), sites = []; let outline = null;
        for (let k = 0; k < n; k++) {
          const yy = k * gap, d = `M0 ${yy} q${f1(w / 8)} -4 ${f1(w / 4)} 0 t${f1(w / 4)} 0 t${f1(w / 4)} 0 t${f1(w / 4)} 0`;
          const p = el("path", { d, fill: "none", stroke: K.er, "stroke-width": 4.2, "stroke-linecap": "round" }, g);
          if (!outline) outline = p;
          for (let i = 0; i <= 4; i++) sites.push([x + i * w / 4, y + yy - 3.4]);
        }
        return { g, outline, sites };
      },
      golgi(parent, x, y, w, rot = 0) {                         // a pile of flattened curved sacs + budding vesicles
        const g = el("g", { transform: `translate(${x} ${y}) rotate(${rot})` }, parent); let outline = null;
        for (let k = 0; k < 4; k++) { const ww = w * (1 - k * .1), yy = k * 6; const p = el("path", { d: `M${f1(-ww / 2)} ${yy} Q0 ${f1(yy - 9)} ${f1(ww / 2)} ${yy}`, fill: "none", stroke: K.golgi, "stroke-width": 3.6, "stroke-linecap": "round" }, g); if (!outline) outline = p; }
        el("circle", { cx: f1(-w / 2 - 2), cy: 14, r: 2.6, fill: K.golgi }, g); el("circle", { cx: f1(w / 2 + 3), cy: 16, r: 2.6, fill: K.golgi }, g);
        return { g, outline };
      },
      centrosome(parent, x, y) {                                // two centrioles at right angles (no membrane)
        const g = el("g", { transform: `translate(${x} ${y})` }, parent);
        const outline = el("rect", { x: -7, y: -3, width: 14, height: 6, rx: 1.5, fill: K.centri, stroke: "#2f3a45", "stroke-width": 1 }, g);
        el("rect", { x: 4, y: -9, width: 6, height: 14, rx: 1.5, fill: K.centri, stroke: "#2f3a45", "stroke-width": 1 }, g);
        return { g, outline };
      },
      lysosome(parent, x, y, r = 6) {
        const g = el("g", { transform: `translate(${x} ${y})` }, parent);
        const outline = el("circle", { cx: 0, cy: 0, r, fill: K.lyso, stroke: "#7d4a6a", "stroke-width": 1.3 }, g);
        [[-2, -1], [2, 1.5], [0, 2.5], [1.5, -2.5]].forEach(([a, b]) => el("circle", { cx: a, cy: b, r: .9, fill: "#5a2e4a" }, g));
        return { g, outline };
      },
    };

    // ================= CELL INSTANCES =================
    // inst.body holds the drawing; parts[key] = { g, hls } for dimming; halo[hl] holds glow outlines (under the parts).
    function newInst(root, kind) {
      const g = el("g", {}, root), body = el("g", {}, g);
      const inst = { kind, g, body, parts: {}, under: el("g", {}, body), haloRoot: null, halo: {}, items: [], extras: {} };
      inst.haloRoot = el("g", {}, body); HL.forEach((h) => (inst.halo[h] = el("g", { opacity: 0 }, inst.haloRoot)));
      inst.over = el("g", {}, body);
      inst.labels = el("g", {}, g);
      return inst;
    }
    const part = (inst, key, hls, parent) => { if (!inst.parts[key]) inst.parts[key] = { g: el("g", {}, parent || inst.over), hls }; return inst.parts[key].g; };
    function halo(inst, hl, o, w = 7) {
      const hg = el("g", { transform: o.g.getAttribute("transform") || "" }, inst.halo[hl]), c = o.outline.cloneNode(false);
      c.setAttribute("fill", "none"); c.setAttribute("stroke", K.gold); c.setAttribute("stroke-width", w); c.setAttribute("stroke-linecap", "round"); c.setAttribute("stroke-linejoin", "round"); c.removeAttribute("stroke-dasharray");
      hg.appendChild(c);
    }
    function dots(inst, list, r, hl = "ribosomes") {
      const g = part(inst, "ribo", [hl]);
      list.forEach(([x, y]) => { el("circle", { cx: f1(x), cy: f1(y), r: r + 2.6, fill: K.gold }, inst.halo[hl]); el("circle", { cx: f1(x), cy: f1(y), r, fill: K.ribo }, g); });
    }
    // Labels and tags. modes: 'all' (shown when no highlight is on) and/or highlight names. tag = gold, shows with its highlight
    // even when labels are off. [ax, ay] = what the ruled leader points at (null = no leader).
    function item(inst, text, lx, ly, ax, ay, modes, tag = false, anchor = "middle") {
      const g = el("g", { opacity: 0 }, inst.labels);
      const leader = ax == null ? null : el("line", { stroke: tag ? K.gold : K.ink, "stroke-width": 1.4 }, g);
      const tip = ax == null ? null : el("circle", { cx: ax, cy: ay, r: 2, fill: tag ? K.gold : K.ink }, g);
      const pill = el("rect", { rx: 5, fill: K.pill, stroke: tag ? K.gold : "none", "stroke-width": 1.2 }, g);
      const t = tx(text, lx, ly, 12, tag ? K.gold : K.ink, g, anchor, tag ? 800 : 700);
      inst.items.push({ g, leader, tip, pill, t, lx, ly, ax, ay, modes: modes.split(" "), tag, anchor, k: -1 });
    }

    // ---------- bacterium (prokaryote) ----------
    // Body coordinates: rod x −58…38, y −24…24; flagellum 38…84. In the slot the body sits at BX, BY (zoom) or shrinks to the
    // real-size spot TINY (true scale: ≈ 2 µm long beside a 186-unit ≈ 50 µm plant cell → ≈ 7.4 units).
    const BX = -16, BY = -30, ZS = 1.25, TINY = [0, 102], TSCALE = 7.4 / 96, INSET = [0, -30, 92];
    function buildBacterium(root) {
      const inst = newInst(root, "bacterium");
      const lens = el("g", {}, inst.g); inst.g.insertBefore(lens, inst.body);
      el("circle", { cx: INSET[0], cy: INSET[1], r: INSET[2], fill: "rgba(255,255,255,.05)", stroke: "#8fa3b8", "stroke-width": 2.5 }, lens);
      const t1 = Math.acos(INSET[2] / (TINY[1] - INSET[1])); // magnifier cone: tangents from the real-size dot to the inset
      [-1, 1].forEach((sgn) => el("line", { x1: TINY[0], y1: TINY[1], x2: f1(INSET[0] + sgn * INSET[2] * Math.sin(t1)), y2: f1(INSET[1] + INSET[2] * Math.cos(t1)), stroke: "#8fa3b8", "stroke-width": 1.2, "stroke-dasharray": "4 4" }, lens));
      const mini = el("g", { transform: `translate(${TINY[0]} ${TINY[1]})` }, lens);                    // the real-size bacterium
      el("rect", { x: -3.7, y: -1.9, width: 7.4, height: 3.8, rx: 1.9, fill: K.cyto, stroke: K.wallB, "stroke-width": .9 }, mini);
      inst.extras.lens = lens;
      // body
      const cy = part(inst, "cyto", [], inst.under);
      el("rect", { x: -58, y: -24, width: 96, height: 48, rx: 24, fill: K.cyto }, cy);
      inst.extras.flag = el("path", { fill: "none", stroke: K.flag, "stroke-width": 2.2, "stroke-linecap": "round" }, part(inst, "flag", [], inst.under));
      const dna = { g: part(inst, "dna", ["dna", "nucleus"]), outline: null };
      const loop = ORG.dnaLoop(dna.g, -14, 0, 10.5); halo(inst, "dna", loop, 6);
      const pl = el("circle", { cx: 18, cy: -9, r: 4, fill: "none", stroke: K.dna, "stroke-width": 1.8 }, part(inst, "plasmid", ["dna"]));
      halo(inst, "dna", { g: pl, outline: pl }, 5);
      // many small ribosomes, free in the cytoplasm (none inside the DNA tangle); one fixed at (22, 12) for the leader
      const rib = [[22, 12]];
      while (rib.length < 30) { const x = -48 + rnd() * 80, y = -15 + rnd() * 30; if (Math.hypot((x + 14) / 1.25, y / .85) < 17 || Math.hypot(x - 18, y + 9) < 8 || rib.some(([a, b]) => Math.hypot(a - x, b - y) < 6)) continue; if (Math.abs(y) > 14 && (x < -40 || x > 20)) continue; rib.push([x, y]); }
      dots(inst, rib, 1.5);
      const memb = el("rect", { x: -53, y: -19, width: 86, height: 38, rx: 19, fill: "none", stroke: K.memb, "stroke-width": 1.8 }, part(inst, "memb", []));
      const wall = el("rect", { x: -57, y: -23, width: 94, height: 46, rx: 23, fill: "none", stroke: K.wallB, "stroke-width": 5 }, part(inst, "wall", ["wall"]));
      halo(inst, "wall", { g: wall, outline: wall }, 12); void memb;
      // the dashed "no membrane here" ring round the free DNA (nucleus highlight)
      inst.extras.ring = el("ellipse", { cx: -14, cy: 0, rx: 21, ry: 15.5, fill: "none", stroke: K.gold, "stroke-width": 2, "stroke-dasharray": "4 4", opacity: 0 }, inst.body);
      // labels / tags (slot coordinates: body + (BX, BY))
      const S = (x, y) => [x * ZS + BX, y * ZS + BY];
      item(inst, "membrane", -16, -104, ...S(-6, -19), "all");
      item(inst, "cell wall", -52, -80, ...S(-34, -23), "all wall");
      item(inst, "flagellum", 46, -80, ...S(60, -3), "all");
      item(inst, "circular DNA", -24, 18, ...S(-14, 9), "all");
      item(inst, "ribosomes", 34, 42, ...S(22, 12), "all");
      item(inst, "ribosomes", 38, 18, ...S(22, 12), "ribosomes");
      item(inst, "circular", -26, 18, ...S(-16, 9), "dna", true);
      item(inst, "no nucleus", -26, 44, null, null, "nucleus", true);
      item(inst, "smaller", 38, 44, null, null, "ribosomes", true);
      item(inst, "no cellulose", -4, 22, null, null, "wall", true);
      item(inst, "enlarged", 60, -118, null, null, "zoom", true);
      item(inst, "≈ 2 µm", 0, 128, null, null, "size", true);
      return inst;
    }

    // ---------- plant cell (eukaryote) ----------
    // Slot coordinates: wall −93…93 × −146…146; vacuole −40…56 × −56…110; nucleus at the side, top left.
    function buildPlant(root) {
      const inst = newInst(root, "plant");
      const cy = part(inst, "cyto", [], inst.under);
      el("rect", { x: -86, y: -139, width: 172, height: 278, rx: 8, fill: K.cyto }, cy);
      const vg = part(inst, "vacuole", ["organelles"], inst.under);
      const vac = el("rect", { x: -40, y: -56, width: 96, height: 166, rx: 30, fill: K.vac, stroke: K.tono, "stroke-width": 2.6 }, vg);   // tonoplast
      halo(inst, "organelles", { g: vac, outline: vac }, 8);
      const nu = ORG.nucleus(part(inst, "nucleus", ["nucleus"]), -42, -100, 31, 24); halo(inst, "nucleus", nu, 8);
      const ch = ORG.chromosomes(part(inst, "chrom", ["dna"]), -46, -98, 26, 19);
      ch.g.querySelectorAll("path").forEach((p) => halo(inst, "dna", { g: ch.g, outline: p }, 6));
      const og = part(inst, "orgs", ["organelles"]);
      const er = ORG.rer(og, -2, -124, 40, 3, 11); halo(inst, "organelles", er, 9);
      er.g.querySelectorAll("path").forEach((p, i) => i && halo(inst, "organelles", { g: er.g, outline: p }, 9));
      const go = ORG.golgi(og, 66, -110, 30); go.g.querySelectorAll("path").forEach((p) => halo(inst, "organelles", { g: go.g, outline: p }, 8));
      [[-64, -14, 90], [-64, 66, 90], [72, -14, 90], [72, 90, 90], [-26, 125, 0], [30, 125, 0]].forEach(([x, y, r]) => halo(inst, "organelles", ORG.chloro(og, x, y, r), 7));
      [[-64, 30, 90], [72, 34, 90], [-64, 124, 0], [73, 126, 0]].forEach(([x, y, r]) => halo(inst, "organelles", ORG.mito(og, x, y, r, 24, 12), 7));
      // larger ribosomes: free ones + those on the rough ER
      dots(inst, [[0, -66], [16, -64], [-22, -66], [36, -70], [-78, -60], [-76, -120], [12, -136], [84, -60], [-72, 98], [84, 110], [-8, 133], [54, 136], [-52, -132]], 2.8);
      dots(inst, er.sites, 2.4);
      const memb = el("rect", { x: -86, y: -139, width: 172, height: 278, rx: 8, fill: "none", stroke: K.memb, "stroke-width": 2 }, part(inst, "memb", []));
      const wall = el("rect", { x: -90, y: -143, width: 180, height: 286, rx: 11, fill: "none", stroke: K.wallP, "stroke-width": 7 }, part(inst, "wall", ["wall"]));
      halo(inst, "wall", { g: wall, outline: wall }, 14); void memb;
      // labels (inside the vacuole, ruled leaders out to the parts)
      item(inst, "nucleus", -38, -40, -38, -77, "all");
      item(inst, "ER", 6, -40, 8, -101, "all organelles");
      item(inst, "Golgi body", 63, -40, 66, -96, "all organelles");
      item(inst, "chloroplast", -34, -14, -57, -14, "all organelles", false, "start");
      item(inst, "mitochondrion", 52, 34, 65, 34, "all organelles", false, "end");
      item(inst, "vacuole", 8, 60, null, null, "all organelles");
      item(inst, "cell wall", 52, 82, 89, 82, "all wall", false, "end");
      item(inst, "membrane", -34, 100, -86, 100, "all", false, "start");
      item(inst, "nuclear membrane", 8, -34, -36, -77, "nucleus");
      item(inst, "linear", 14, -76, null, null, "dna", true);
      item(inst, "ribosomes", 8, -32, 0, -66, "ribosomes");
      item(inst, "larger", 8, -8, null, null, "ribosomes", true);
      item(inst, "cytoplasm", -34, 46, -48, 46, "ribosomes", false, "start");
      item(inst, "cellulose", 8, 104, null, null, "wall", true);
      item(inst, "≈ 50 µm wide", 0, 172, null, null, "size", true);
      inst.extras.ruler = el("path", { d: "M-90 158 V152 M-90 155 H90 M90 152 V158", fill: "none", stroke: K.gold, "stroke-width": 1.6, opacity: 0 }, inst.g);
      inst.nucleusAt = [-42, -100, 40, 33]; inst.orgAt = [36, -96, 64, 54]; inst.riboAt = [6, -68, 60, 24];
      return inst;
    }

    // ---------- animal cell (eukaryote, for reuse) ----------
    function buildAnimal(root) {
      const inst = newInst(root, "animal");
      let d = ""; for (let i = 0; i <= 64; i++) { const a = i / 64 * 6.2832, r = 1 + .05 * Math.sin(a * 3 + .6) + .03 * Math.sin(a * 5); d += (i ? " L" : "M") + f1(Math.cos(a) * 86 * r) + " " + f1(Math.sin(a) * 128 * r); }
      d += " Z";
      el("path", { d, fill: K.cyto }, part(inst, "cyto", [], inst.under));
      const nu = ORG.nucleus(part(inst, "nucleus", ["nucleus"]), -4, -8, 34, 29); halo(inst, "nucleus", nu, 8);
      const ch = ORG.chromosomes(part(inst, "chrom", ["dna"]), -8, -6, 28, 22);
      ch.g.querySelectorAll("path").forEach((p) => halo(inst, "dna", { g: ch.g, outline: p }, 6));
      const og = part(inst, "orgs", ["organelles"]);
      const er = ORG.rer(og, -30, -66, 44, 2, 10); er.g.querySelectorAll("path").forEach((p) => halo(inst, "organelles", { g: er.g, outline: p }, 9));
      const go = ORG.golgi(og, 46, 52, 30, -20); go.g.querySelectorAll("path").forEach((p) => halo(inst, "organelles", { g: go.g, outline: p }, 8));
      [[-50, -78, 60], [56, -40, 100], [-58, 52, 80], [30, 90, 10]].forEach(([x, y, r]) => halo(inst, "organelles", ORG.mito(og, x, y, r, 26, 13), 7));
      [[-24, 64], [58, 10]].forEach(([x, y]) => halo(inst, "organelles", ORG.lysosome(og, x, y, 6), 6));
      [[-60, 4, 7], [26, -96, 6]].forEach(([x, y, r]) => { const v = el("circle", { cx: x, cy: y, r, fill: K.vac, stroke: K.tono, "stroke-width": 1.6 }, og); halo(inst, "organelles", { g: v, outline: v }, 6); });
      ORG.centrosome(part(inst, "centro", []), 40, -6);
      dots(inst, [[-10, -40], [6, -42], [24, -60], [-40, -30], [-70, -30], [50, -82], [-30, 100], [40, 106], [-56, 82], [54, 78], [-12, 116], [30, 30], [-36, 36]], 2.8);
      dots(inst, er.sites, 2.4);
      const memb = el("path", { d, fill: "none", stroke: K.memb, "stroke-width": 2.4 }, part(inst, "memb", []));
      void memb;
      item(inst, "nucleus", -4, 38, -4, 20, "all");
      item(inst, "membrane", -54, -130, -43, -111, "all");
      item(inst, "mitochondrion", -32, 100, -54, 56, "all organelles");
      item(inst, "ER", -48, -92, -26, -68, "all organelles");
      item(inst, "Golgi body", 44, 74, 46, 56, "all organelles");
      item(inst, "centrosome", 40, -130, 40, -10, "all");
      item(inst, "nuclear membrane", 0, 46, -4, 20, "nucleus");
      item(inst, "linear", -4, 66, null, null, "dna", true);
      item(inst, "ribosomes", -40, 130, -12, 116, "ribosomes");
      item(inst, "larger", 36, 130, null, null, "ribosomes", true);
      item(inst, "no wall", 0, -142, null, null, "wall", true);
      item(inst, "membrane only", 0, 140, null, null, "wall");
      inst.nucleusAt = [-4, -8, 44, 38]; inst.orgAt = [4, 10, 80, 96]; inst.riboAt = [0, 98, 58, 26];
      return inst;
    }

    // ================= LAYOUT =================
    const SLOT = { left: [105, 190], right: [315, 190] };
    const slots = {};
    for (const side of ["left", "right"]) {
      const root = el("g", { transform: `translate(${SLOT[side][0]} ${SLOT[side][1]})` }, svg);
      const kinds = { bacterium: buildBacterium(root), plant: buildPlant(root), animal: buildAnimal(root) };
      const title = tx("", 0, -170, 15, K.ink, root, "middle", 800);
      const cnt = el("g", { opacity: 0 }, root);
      tx("membrane-bound", 0, 192, 12, K.dim, cnt, "middle", 700);
      const cntN = tx("", 0, 218, 14, K.gold, cnt, "middle", 900);
      slots[side] = { root, kinds, title, cnt, cntN };
    }
    const ringA = el("ellipse", { fill: "none", stroke: K.gold, "stroke-width": 3, "stroke-dasharray": "7 6", opacity: 0 }, svg);
    const ringB = el("ellipse", { fill: "none", stroke: K.gold, "stroke-width": 3, "stroke-dasharray": "7 6", opacity: 0 }, svg);

    // blend a string state: 1 when it equals val (previous → current over u)
    const sb = (p, s, key, u, val, def) => { const c = s[key] != null ? s[key] : def, pv = p[key] != null ? p[key] : c; return lerp(pv === val ? 1 : 0, c === val ? 1 : 0, u); };
    const isEuk = (k) => k === "plant" || k === "animal";

    function sizeItem(it, kk) {                                 // pills/leaders follow the text's real size (phones boost labels)
      let b; try { b = it.t.getBBox(); } catch (e) { return; }
      if (!b || !b.width) return;
      it.k = kk;
      it.pill.setAttribute("x", f1(b.x - 4)); it.pill.setAttribute("y", f1(b.y - 1.5)); it.pill.setAttribute("width", f1(b.width + 8)); it.pill.setAttribute("height", f1(b.height + 3));
      if (it.leader) {
        let sx = it.lx, sy = it.ly;
        if (it.anchor === "start") sx = b.x - 4; else if (it.anchor === "end") sx = b.x + b.width + 4;
        else if (Math.abs(it.ay - it.ly) > b.height / 2) sy = it.ay < it.ly ? b.y - 1.5 : b.y + b.height + 1.5;
        else sx = it.ax < it.lx ? b.x - 4 : b.x + b.width + 4;
        it.leader.setAttribute("x1", f1(sx)); it.leader.setAttribute("y1", f1(sy)); it.leader.setAttribute("x2", it.ax); it.leader.setAttribute("y2", it.ay);
      }
    }

    return {
      draw(t, P) {
        const s = P.s, p = P.p, u = P.u, kk = svg.__k || 1;
        const lab = mixN(p, s, "labels", u), tit = mixN(p, s, "titles", u);
        const h = {}; let any = 0; HL.forEach((k) => { h[k] = clamp(mixN(p, s, k, u), 0, 1); any = Math.max(any, h[k]); });
        const zf = sb(p, s, "scale", u, "zoom", "zoom");
        const pulse = .55 + .4 * Math.sin(t * 5);
        const kindOf = { left: s.left || "bacterium", right: s.right || "plant" };
        const bothEuk = isEuk(kindOf.left) && isEuk(kindOf.right);

        for (const side of ["left", "right"]) {
          const S = slots[side], def = side === "left" ? "bacterium" : "plant";
          for (const kind in S.kinds) {
            const inst = S.kinds[kind], vis = sb(p, s, side, u, kind, def);
            inst.g.setAttribute("opacity", vis.toFixed(3));
            inst.g.style.display = vis < .005 ? "none" : "";
            if (vis < .005) continue;
            // dim what is not highlighted; glow what is
            for (const key in inst.parts) { const pt = inst.parts[key]; let hi = 0; pt.hls.forEach((k) => (hi = Math.max(hi, h[k]))); pt.g.setAttribute("opacity", (1 - .45 * any * (1 - hi)).toFixed(3)); }
            HL.forEach((k) => inst.halo[k].setAttribute("opacity", (h[k] * pulse * .85).toFixed(3)));
            let zoomK = 1, sizeK = 0;
            if (kind === "bacterium") {
              const sc = lerp(TSCALE, ZS, zf), bx = lerp(TINY[0], BX, zf), by = lerp(TINY[1], BY, zf);
              inst.body.setAttribute("transform", `translate(${f1(bx)} ${f1(by)}) scale(${sc.toFixed(4)})`);
              inst.extras.lens.setAttribute("opacity", zf.toFixed(3));
              let d = "M38 0"; for (let i = 1; i <= 23; i++) { const x = 38 + i * 2; d += ` L${x} ${f1(5 * Math.sin(i * .55 - t * 6) * Math.min(1, i / 5))}`; }
              inst.extras.flag.setAttribute("d", d);
              inst.extras.ring.setAttribute("opacity", (h.nucleus * (.6 + .4 * Math.sin(t * 5))).toFixed(3));
              zoomK = zf; sizeK = 1;
            } else if (kind === "plant") {
              const other = slots[side === "left" ? "right" : "left"], bact = sb(p, s, side === "left" ? "right" : "left", u, "bacterium", side === "left" ? "plant" : "bacterium");
              sizeK = bact * (1 - zf); inst.extras.ruler.setAttribute("opacity", sizeK.toFixed(3)); void other;
            }
            // labels and tags
            inst.items.forEach((it) => {
              if (it.k !== kk || !it.pill.getAttribute("width")) sizeItem(it, kk);
              let w = 0;
              it.modes.forEach((m) => {
                if (m === "all") w = Math.max(w, (1 - any) * (it.tag ? 1 : lab));
                else if (m === "zoom") w = Math.max(w, zf);
                else if (m === "size") w = Math.max(w, sizeK);
                else if (h[m] != null) w = Math.max(w, h[m] * (it.tag ? 1 : lab));
              });
              if (m0(it)) w *= zoomK;
              it.g.setAttribute("opacity", w.toFixed(3));
            });
          }
          // title + organelle counter
          const k = kindOf[side];
          S.title.textContent = bothEuk ? (k === "plant" ? "plant cell" : "animal cell") : (k === "bacterium" ? "prokaryote" : "eukaryote");
          S.title.setAttribute("opacity", tit.toFixed(3));
          S.cntN.textContent = k === "bacterium" ? "organelles: 0" : "organelles: many";
          S.cnt.setAttribute("opacity", h.organelles.toFixed(3));
        }

        // focus ring(s): resolved against what is actually in each slot
        const sideOf = (want) => (want === "prokaryote" ? ["left", "right"].find((sd) => kindOf[sd] === "bacterium") : ["right", "left"].find((sd) => isEuk(kindOf[sd])));
        const whole = (sd) => { const [x, y] = SLOT[sd]; return kindOf[sd] === "bacterium" && (s.scale || "zoom") === "zoom" ? [x + INSET[0], y + INSET[1], INSET[2] + 6, INSET[2] + 6] : kindOf[sd] === "bacterium" ? [x + TINY[0], y + TINY[1], 14, 12] : [x, y, 100, 156]; };
        const at = (sd, r) => { const [x, y] = SLOT[sd]; return [x + r[0], y + r[1], r[2], r[3]]; };
        const rings = [];
        const f = s.focus;
        if (f === "left" || f === "right") rings.push(whole(f));
        else if (f === "prokaryote" || f === "eukaryote") { const sd = sideOf(f); if (sd) rings.push(whole(sd)); }
        else if (f === "nucleus") { const sd = sideOf("eukaryote"); if (sd) rings.push(at(sd, S_(sd).nucleusAt)); }
        else if (f === "dna") { const sd = sideOf("prokaryote"); if (sd && (s.scale || "zoom") === "zoom") rings.push(at(sd, [BX - 14 * ZS, BY, 34, 28])); else { const e = sideOf("eukaryote"); if (e) rings.push(at(e, S_(e).nucleusAt)); } }
        else if (f === "organelles") { const sd = sideOf("eukaryote"); if (sd) rings.push(at(sd, S_(sd).orgAt)); }
        else if (f === "ribosomes") { ["left", "right"].forEach((sd) => { const k = kindOf[sd]; if (k === "bacterium") { if ((s.scale || "zoom") === "zoom") rings.push(at(sd, [BX + 4 * ZS, BY, 66, 38])); } else rings.push(at(sd, S_(sd).riboAt)); }); }
        [ringA, ringB].forEach((r, i) => {
          const q = rings[i];
          r.setAttribute("opacity", q ? (.65 + .35 * Math.sin(t * 5)).toFixed(2) : 0);
          if (q) { r.setAttribute("cx", f1(q[0])); r.setAttribute("cy", f1(q[1])); r.setAttribute("rx", f1(q[2])); r.setAttribute("ry", f1(q[3])); }
        });
        function S_(sd) { return slots[sd].kinds[kindOf[sd]]; }
        function m0(it) { return !it.modes.includes("size"); }
      },
    };
  },
};
