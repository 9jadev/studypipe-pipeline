# 05 · Build Plan — `ss1-bio-plant-animal-cell-structure` (Plant and Animal Cells)

Written by **unit-renderer** (step 5, Phase A) · 2026-11-07 · theme `editorial-ink` · source of truth: approved `02-lesson.md` + `03-questions.md`.

## Already built (shared, owned by unit-renderer — do not edit from a lesson)

| Path | What it is |
|---|---|
| `html/index.html` | Welcome Hub: hero + 3D Hero Lab, marquee, mystery case file, 5 journey cards, 4-tab explorer, 8 outcomes, 6 archetypes (StudyMath), 3 myths, method, finale |
| `html/assets/css/` | shell `style.css`, `lesson.css`, `narrator.css`, `math.css`, `lesson-video.css` + `hub.css` (hub only) + `fonts.css`/`theme.css` (apply-theme) |
| `html/assets/fonts/` | Fraunces, Manrope, JetBrains Mono (editorial-ink) |
| `html/assets/js/three.min.js` | three.js r160 + OrbitControls (`window.THREE`) |
| `html/assets/js/cell-kit.js` | **copy of `kits/cell-bio/cell-kit.js` v1** (`window.CellKit`). Lessons load it from here. If kit-engineer ships v2, unit-renderer re-copies it in Phase B |
| `html/assets/js/scene-kit.js`, `study-graph.js`, `story-scene.js`, `lesson-kit.js`, `narrator.js`, `math-kit.js`, `welcome.js`, `video-embed.js` | shell engines (unchanged) |
| `html/assets/js/welcome-lab.js` | Hero Lab (`window.StudyLab`: modes `cells` / `microscope` / `osmosis`) |
| `html/assets/js/welcome-explorer.js` | Explorer graphs + `window.WELCOME_COMBOS` + archetype typesetting |
| `html/assets/js/welcome-narration.js` | Hub tour (10 chapters, 3 "Your turn" waits on `lab:result`) |
| `html/assets/js/retrieval-bank.js` | `window.RETRIEVAL_BANK.l01 … l05` — Do Now (4 cards each, exactly the 02-lesson Do Now items), review quiz (2 MCQs for l02–l05), blank-page recall |

Hub checked in Chromium at 360×740 and 1280×800: no console errors, no network requests, no horizontal overflow, 3D lab renders in all three modes, organelle taps resolve, StudyMath typesets the archetypes.

## Lessons

| lesson | title | story set + characters | bench: kit-id (reuse/new) | zoom: kit-id (reuse/new) | graph | prev / next |
|---|---|---|---|---|---|---|
| lesson-01 | Discovering the Cell: Microscopes, Cell Theory and Prokaryotes vs Eukaryotes | Set 1 market → Set 2 lab · `ngozi`, `cust1` = Chinedu, `cust2` = Coach Danjuma, `amaka` · 5 beats (02 § L01 Wonder) | **Microscope bench** — `cell-bio` `CellKit.microscope` + `CellKit.slide` (reuse) **upgraded by new kit `microscope-bench`** (mirror, condenser, cork / onion / blood slides, eyepiece view). 4 method cards, objective ×4/×10/×40, slide cork/onion/blood, *Measure*; parts `eyepiece, objective, stage, mirror, coarse, fine, slide`; emits `l1:bench`, `l1:bench-done` after 3 objectives | `CellKit.bacterium` beside `CellKit.plantCell` at the same scale (reuse); toggles nucleus / organelles / ribosomes; counters membrane-bound organelles 0 vs many | no (results table; cell width constant 50 µm) | ← Hub (`../../index.html`) · → lesson-02 |
| lesson-02 | Inside the Cell: Organelles, Plant vs Animal Cells | Set 2 lab · `amaka`, `cust2`, `cust1` · 5 beats | **Organelle dissector** — `CellKit.plantCell` + `CellKit.animalCell` (reuse; same pick logic as `welcome-lab.js`, copy the `INFO` table and the "non-generic hit first" rule). Parts `wall, membrane, nucleus, mitochondrion, chloroplast, vacuole, er, golgi, ribosome, lysosome, centrioles`; 4 method cards; emits `l2:bench`, `l2:bench-done` after 8 organelles | `CellKit.mitochondrion` + `CellKit.chloroplast` cut-aways (reuse) + protein route ribosome → rough ER → vesicle → Golgi → membrane (**gap: new kit `protein-route`**) | no | ← lesson-01 · → lesson-03 |
| lesson-03 | Forms of Cells and Levels of Organisation | Set 1 market (drain-water jar) → Set 2 lab · `cust1`, `cust2`, `amaka` · 5 beats | Two stations: **pond survey** `CellKit.protist(amoeba … hydra)` (reuse) + **SA:V cube bench** — new kit `agar-cube-bench` (cubes L = 1, 2, 3, 4, 6 mm, dye diffusion front). **3–4 numbered method cards required (round-2 review):** (1) tap each of the seven organisms and note its form and nutrition; (2) choose a cube side L and press *Calculate*; (3) record SA, V and SA : V in the table; (4) compare the undyed centre of the small and large cubes. Emits `l3:bench`, `l3:bench-done` after 4 cubes | `CellKit.protist("volvox")` beside `CellKit.protist("hydra")` (reuse) + level ladder (HTML/SVG steps animated, organelle → organism) | yes: SA : V against L (6/L curve with the 5 points) in `graph.js` | ← lesson-02 · → lesson-04 |
| lesson-04 | The Cell and Its Environment: Diffusion, Osmosis and Active Transport | Set 1 market (salty wash) → Set 2 lab (drip) · `ngozi`, `cust2`, `amaka`, `cust1` · 5 beats | **Potato-strip osmometer** — **new kit `osmometer-bench`**: 6 boiling tubes 0.0–1.0 mol dm⁻³, cork borer, strips, blotting paper, tile, top-pan balance; *Weigh* / *Leave 30 min* / *Re-weigh*; 4 method cards; masses computed from a model (see kit spec), not pasted text; emits `l4:bench`, `l4:bench-done` after 6 tubes | `CellKit.plantCell` + `CellKit.rbc` in hypotonic / isotonic / hypertonic solution with water particles (reuse; copy the water-molecule + burst-fragment code from `welcome-lab.js` `makeWater` / `animateBurst`) + `CellKit.bilayer` for diffusion / osmosis / active transport (reuse) | **yes**: % change in mass (y) against concentration (x), smooth monotone curve (no straight regression), zero line, isotonic marker ≈ 0.34 mol dm⁻³ (same Fritsch–Carlson curve as `welcome-explorer.js`) | ← lesson-03 · → lesson-05 |
| lesson-05 | WAEC Paper 3 Clinic: Slides, Biological Drawing and Magnification | Set 2 lab · `cust1`, `cust2`, `amaka` · 5 beats | **Slide-preparation bench** — `CellKit.slide` (reuse) **extended by new kit `slide-prep-bench`** (onion bulb + peeled epidermis, iodine dropper, methylene-blue dropper, spatula, disinfectant beaker, cover slip at 45°, bubbles / folded peel / no-stain consequences). **3–4 numbered method cards required (round-2 review):** (1) peel the thin inner epidermis and lay it flat in a drop of iodine; (2) lower the cover slip from one edge at about 45°; (3) scrape the cheek gently, smear, add methylene blue and a cover slip, put the spatula in disinfectant; (4) view each slide on low power, then high power. Drawing audit is an HTML/SVG widget in `lesson.js` (9 rules, two drawings). Emits `l5:bench`, `l5:bench-done` | Onion slide at ×100 and ×400 vs a textbook diagram, non-visible items fade (`CellKit.plantCell({ onion: true })` reuse + **new kit `slide-view`** for the 2D-in-3D eyepiece disc, can reuse the eyepiece drawing in `welcome-lab.js` `drawFov`) | no | ← lesson-04 · → Hub (`../../index.html`, "Back to the unit") |

Story: every lesson uses `StoryStage.wire("story-stage", "story", beats, { names: { ngozi: "Mama Ngozi", cust1: "Chinedu", cust2: "Coach Danjuma", amaka: "Dr Amaka" } })`. Set 1 = market stall (ugu basket, bowl of salty water), Set 2 = LUTH teaching lab (microscope prop).

## New kits (for kit-engineer, step 6) — HeartKit v2 fidelity (`.agents/skills/kit-builder/SKILL.md`)

`cell-bio` v1 is reused everywhere it honestly fits, but several of its builders are primitive stacks (box arm and base on the microscope, box plant-cell wall, capsule + torus mitochondrion) and fall below the HeartKit v2 bar. Each new kit below lives in `kits/<id>/` with `README.md` + `demo.html`, exposes `group.userData.parts`, `update(dt, t)`, `setState()`, and must stay **backward compatible** with the `CellKit` calls listed above (the hub's `welcome-lab.js` uses `plantCell`, `animalCell`, `rbc`, `microscope` and their `parts` names).

1. **`cell-bio` v2 (upgrade, same API)** — purpose: bring the core cells and microscope to anatomical/lab fidelity. Parameters unchanged (`tonicity`, `objective`, `onion`, `cheek`, `w/h/d`, `r`, `size`) plus `mirror: true|false`.
   - Microscope: curved C-arm and horseshoe foot from `THREE.Shape` + `ExtrudeGeometry` (bevelled), `LatheGeometry` eyepiece/objectives with colour bands and engraved `×4/×10/×40` canvas textures, knurled coarse/fine knobs (bump-mapped `CanvasTexture`), stage with central aperture hole, spring clips, iris diaphragm, condenser; **plane/concave mirror option** (WAEC school microscopes) as part `mirror`; light path cone.
   - Plant cell: rounded-box cellulose wall built as an extruded frame with a **cut-away face** showing wall thickness (double line), plasmodesmata pits, tonoplast as a distinct membrane, protoplast that peels from the wall corners on plasmolysis (not a uniform scale), chloroplasts with visible grana.
   - Animal cell: keep blob membrane; nucleus with double envelope + pores (instanced), rough ER as folded sheets (not tori), Golgi cisternae as curved extruded plates.
   - Mitochondrion: outer membrane + inner membrane with cristae folds as a cut-away extrusion (matrix visible).
2. **`microscope-bench`** (L01) — purpose: Paper-3-style microscope practical. Params: `objective` (0/1/2), `slide: "cork" | "onion" | "blood"`, `eyepiece` (default 10). Provides an eyepiece-view `CanvasTexture` disc whose cells-across count follows field diameters 4.0 / 1.6 / 0.40 mm and cell widths cork ≈ 0.05 mm (empty walls), onion 0.050 mm (side nucleus, iodine yellow-brown), blood ≈ 0.008 mm (round, no wall, no nucleus). `reading()` returns `{ M, field_mm, cells, width_mm, width_um }` computed from the model. Coarse knob locked (shake + toast) at ×40.
3. **`agar-cube-bench`** (L03) — purpose: SA:V with diffusion. Params: `L_mm` (1–6), `t_min`, `dyeDepth_mm` (default 1.0). Translucent agar cubes (pink phenolphthalein-style dye front advancing inward at fixed depth), cut-away to show the undyed core; ruler; `reading()` → `{ SA, V, ratio: 6/L, undyedFraction }`.
4. **`osmometer-bench`** (L04) — purpose: potato-strip practical. Params: `concs` (default [0, 0.2, 0.4, 0.6, 0.8, 1.0] mol dm⁻³), `initialMasses` (default 2.50, 2.48, 2.52, 2.50, 2.46, 2.54 g), `minutes` (30). Boiling-tube rack (`LatheGeometry` tubes with meniscus, labelled), cork borer, potato strips that visibly swell/shrink and go firm/limp (bend), white tile, blotting paper, top-pan balance with live LCD `CanvasTexture`. Final mass from the model `m₁ = m₀ (1 + p(c)/100)` with `p` the Fritsch–Carlson curve through the 02-lesson table (+14.0, +4.8, −2.0, −8.0, −12.2, −16.5 %), so the expected results reproduce exactly. Optional `errors: { unblotted, overBlotted, evaporation }` shift masses in the documented directions.
5. **`slide-prep-bench`** (L05) — purpose: onion and cheek wet mounts. Params: `specimen: "onion" | "cheek"`, `stain: "iodine" | "methylene" | "none" | "salt"`, `coverslipAngle_deg`, `folded: bool`. Onion bulb scale with a peelable thin epidermis, dropper bottles (Lathe glass, coloured liquid), spatula, disinfectant beaker, cover slip lowered on a needle; consequences: angle < 30° → trapped air bubbles (dark-rimmed circles), folded peel → overlapping layers, no stain → nucleus invisible, salt → plasmolysed onion cells.
6. **`protein-route`** (L02 zoom) — purpose: secretion pathway. Params: `step` 0–4, `speed`. Ribosome on rough ER sheet → protein enters lumen → transport vesicle buds → Golgi cisternae (cis → trans) → secretory vesicle fuses with membrane (exocytosis). Uses `CatmullRomCurve3` path for the vesicle, membrane-fusion morph.
7. **`slide-view`** (L05 zoom) — purpose: "what you can really see". Params: `M` (100 / 400), `specimen`, `showTextbook: bool`. Eyepiece disc of iodine-stained onion cells beside a textbook cell diagram; items not visible on a stained school slide (mitochondria, ER, Golgi, ribosomes, chloroplasts in onion) fade out with a short reason label.

Video kits (step 5v, not for kit-engineer): the 02-lesson § 7 gaps — microscope, organisms/levels, osmosis cells — go to the video-kit-engineer.

## Shared conventions (every lesson-builder must follow)

**Files per lesson:** `index.html`, `data.js`, `story.js`, `bench.js`, `zoom.js`, `lesson.js`, `narration.js`, plus `graph.js` for lesson-03 and lesson-04. Never edit `html/index.html` or `html/assets/**`.

**Script order** in `lessons/lesson-0X/index.html`:
`../../assets/js/three.min.js` → `scene-kit.js` → `cell-kit.js` → `retrieval-bank.js` → `data.js` → `lesson-kit.js` → `story-scene.js` → `story.js` → `bench.js` → (`study-graph.js` → `graph.js`) → `zoom.js` → `lesson.js` → `narration.js` → `narrator.js` → `math-kit.js`. New kit files (when kit-engineer ships them) go after `cell-kit.js`; until then build benches from `CellKit` and keep kit-specific code inside `bench.js` behind a `window.<Kit>` check so the page never throws.
**CSS links:** `fonts.css`, `style.css`, `lesson.css`, `narrator.css`, `math.css`, then `theme.css` last (apply-theme re-links it). Do **not** link `hub.css`.

**Body:** `<body class="lesson-page" data-lesson="l0X">` (`l01` … `l05`, matches the `RETRIEVAL_BANK` keys).

**Section ids (the retrieval bank's revisit links point at these — keep them exactly):**
`#donow` (with `#donow-list`), `#story` (`#story-stage`, `#story-text`), `#wonder`, `#sort`, `#practical` (`#method-cards` with `#m1`–`#m4`, `#bench-stage`, `#bench-canvas`, `#bench-readout`, `#results-table`, `#expected`), `#concepts` (`#props-table`, `#pos-explorer`), `#zoom` (`#zoom-stage`, `#zoom-canvas`), `#examples` (`#ex1`–`#ex3`, `ol.steps-sol` for StudyMath), `#bridge` (`#big-idea`), `#quiz` (`#quiz-list`), `#reflect` (`#rate-list`), `#assignment`. Lessons 03 and 04: `#graph-card` with `.graph-card` under the bench.

**Make Sense for explainer videos (lessons 01, 03, 04 — `apply-video.mjs` finds it):** the `#concepts` section must keep `<span class="phase" …><b>3</b>Make sense · …</span>` **and** an `<h2>` directly in that section. Do not rename the label, and keep `StudyNarrator.pause()` untouched. Do this in lessons 02 and 05 too, for consistency.

**CustomEvents** (`document.dispatchEvent(new CustomEvent(name, { detail }))`):
- `l0X:bench` (each trial/measurement, detail = the computed `reading()`), `l0X:bench-done` (completion rule in the table above), `l0X:bench-reset`.
- `l0X:zoom` (mode change, `{ mode }`), `l0X:bridge` (bridge answered, `{ correct }`).
- LessonKit already emits `kit:donow`, `kit:note`, `kit:quiz-done`, `kit:rated`, `kit:solution` (the narrator has a built-in `donow` wait only). The sort game is lesson code: `lesson.js` must emit `l0X:sort` (`{ correct, total }`) on *Check*, and each `narration.js` defines its own `waits` for `note`, `sort`, `bench`, `bridge` and `quiz` on these events.

**3D scene API** (`window.StudyScenes.bench` / `.zoom`): `rect(part)`, `highlight(part)`, `setMode(mode)`, `reset()`, plus lesson actions called by narration as `"bench:<method>:<arg>"`. Part names exactly as in the table above (e.g. L01 `eyepiece, objective, stage, mirror, coarse, fine, slide`). Bench stages use `SceneKit.createStage` with default auto-framing; story stages pass `autoFit: false, zoomUi: false, portraitPitch: 0`.

**Phone rules:** live values in an HTML `.bench-readout` under the canvas (hide floating 3D HUD sprites below 560 px); 3D labels ≤ ~20 characters; never `text-transform: uppercase` on anything with units or symbols (µm, mm, mol dm⁻³, ×400).

**CSS class names to reuse:** `.l-sec`, `.phase` (`--pc` token colour), `.stage`, `.bench-readout`, `.graph-card`, `.tbl`, `.eq`, `.callout`, `.callout.big`, `.example`, `ol.steps-sol`, `.answer-line`, `.aq`, `.solution .reveal-body`, `.sort`, `.quiz`, `.donow`. Any lesson-specific CSS goes in a `<style>` block in the lesson page using tokens only (`var(--paper-card)`, `rgba(var(--ok-rgb), .1)`, `var(--font-mono)`), never literal colours or font names.

**Data:** `window.LESSON_QUIZ` in `data.js` = the 12 MCQs from `03-questions.md` § Lesson 0X, `{ q, o: [4], a: index, e }`, keys unchanged. LessonKit appends the bank's review MCQs after them.

**Narration:** `window.NARRATION` per lesson, 26–28 steps (02 § 6), Nigerian English, symbols spelled out in `say` ("times four hundred", "micrometres", "moles per decimetre cubed", "zero point nine percent").

**Facts to keep consistent with the hub:** onion cell width 50 µm (fields 4.0 / 1.6 / 0.40 mm, 80 / 32 / 8 cells); total magnification = eyepiece × objective; isotonic point ≈ 0.34 mol dm⁻³; 0.9% saline = 0.9 g per 100 cm³; membrane counts as in 02 L02 objective 2 (cell wall is not a membrane).
