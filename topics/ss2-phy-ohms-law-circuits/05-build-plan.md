# 05 · Build Plan — `ss2-phy-ohms-law-circuits` (Ohm's Law & Current Electricity)

Written by **unit-renderer** (step 5, Phase A) · 2026-11-08 · theme `editorial-ink` · source of truth: approved `02-lesson.md` (v3, 5 lessons) + `03-questions.md` (04-review PASS).

## Already built (shared, owned by unit-renderer — do not edit from a lesson)

| Path | What it is |
|---|---|
| `html/index.html` | Welcome Hub: hero + 3D Hero Lab, 12-term marquee, mystery case file (4 clue cards + realism note), 5 journey cards, 4-tab explorer, 8 outcomes, 6 archetypes (StudyMath), 3 myths, method, finale |
| `html/assets/css/` | shell `style.css`, `lesson.css`, `narrator.css`, `math.css`, `lesson-video.css` + `hub.css` (hub only) + `fonts.css`/`theme.css` (apply-theme already run once) |
| `html/assets/fonts/` | Fraunces, Manrope, JetBrains Mono (editorial-ink) |
| `html/assets/js/three.min.js` | three.js r160 + OrbitControls (`window.THREE`) |
| `html/assets/js/scene-kit.js`, `study-graph.js`, `story-scene.js`, `lesson-kit.js`, `narrator.js`, `math-kit.js`, `sort-dnd.js`, `welcome.js`, `video-embed.js` | shell engines (unchanged) |
| `html/assets/js/welcome-lab.js` | Hero Lab (`window.StudyLab`: modes `ohms` / `ir` / `null`; parts `battery, driver, key, rheostat, ammeter, voltmeter, galv, wire, lamp, board, jockey`; every number from a model: E = 12.0 V, r = 1.2 Ω, 2.20 Ω test wire, k = 0.150 V cm⁻¹ → null at 80.0 cm). Resume fix: `build3D()` was called before `var M = {}` etc. were assigned (3D silently disabled); it now runs at the end of the file |
| `html/assets/js/welcome-explorer.js` | Explorer graphs (I–V ohmic vs lamp; V = E − Ir with E 6.0 V, r 1.5 Ω; P–R and η–R for E 5.0 V, r 0.5 Ω; V = kl with k 0.0200 V cm⁻¹) + `window.WELCOME_COMBOS` + archetype typesetting |
| `html/assets/js/welcome-narration.js` | Hub tour (10 chapters, 5 "Your turn" waits: `ohms`, `ir`, `nullpt` on `lab:result`; `tab` on `hub:tab`; `flip` on `hub:flip`) |
| `html/assets/js/retrieval-bank.js` | `window.RETRIEVAL_BANK.l01 … l05` — Do Now (4 cards = the 02-lesson Do Now items; L05 card 4 swapped for a real L03 retrieval item, review minor 4), 2 original review MCQs for l02–l05, blank-page recall |

**To copy in later (director → `html/assets/js/`):** `dc-circuit-bench.js` (from `kits/dc-circuit-bench/kit.js` v2, being rebuilt now) and any new kit below once shipped.

Hub checked in Chromium (SwiftShader WebGL) at 360×740 and 1280×800: 0 console errors, 0 network requests, no horizontal overflow (only the clipped marquee track), 3D lab renders in all three modes (`ohms`, `ir` with the 8.4 V reading, `null` balancing at 80.0 cm), explorer draws all four graphs, guided tour starts.

## Cast mapping (StoryStage)

02-lesson beats use `who: "emeka" | "chinedu" | "tobe" | "nkechi"`. StoryStage looks up `people[who]` for bubbles, `rect()` and `highlight()`, so every `story.js` adds **aliases** in `opts.setup(api)`:

| 02 character | Set 1 (`market` = Nkechi's auto-electric workshop, Ngwa Road) | Set 2 (`lab` = Nkechi's test bench) |
|---|---|---|
| Engr. Nkechi | `api.people.nkechi = api.people.ngozi` (Ankara + gele) | `api.people.nkechi = api.people.amaka` (coat + goggles) |
| Chinedu (apprentice) | `api.people.chinedu = api.people.cust1` | reparent `cust1` into `api.props.lab` (`lab.add(cust1)`, local x ≈ 0.9, z ≈ −0.9), alias `chinedu` |
| Tobe (battery seller next door) | new `StoryStage.person({ skin: …, outfit: "#7a3b1d", pants: "#1c2433", hair: "short" })` added to `market` and `api.people.tobe` | same, added to `lab` when present |
| Emeka (keke rider) | new `StoryStage.person({ … outfit: "#e2b33a", hair: "short" })` in `market`, `api.people.emeka`, standing by the keke prop | — |
| `cust2` | hide (`api.people.cust2.visible = false`) — not in this cast | — |

`opts.names = { nkechi: "Engr. Nkechi", ngozi: "Engr. Nkechi", amaka: "Engr. Nkechi", chinedu: "Chinedu", cust1: "Chinedu", tobe: "Tobe", emeka: "Emeka" }`. Signs: `StoryStage.sign("NKECHI AUTO-ELECTRIC · NGWA RD, ABA", …)` for `mSign`, `StoryStage.sign("NKECHI TEST BENCH", …)` for `lSign`. Props per beat (battery, jumper cables, keke) come from the **`auto-workshop-props`** kit below; until it ships, use simple `DCCircuitKit.createAccumulatorCell(THREE, …)` for batteries behind `if (window.DCCircuitKit)`.

## Lessons

| lesson | title | story set + characters | bench: kit-id (reuse/new) | zoom: kit-id (reuse/new) | graph | prev / next |
|---|---|---|---|---|---|---|
| lesson-01 | Current, P.D., Ohm's Law & the Resistance of Wires | Set 1 workshop · `emeka`, `chinedu`, `tobe`, `nkechi` · 5 beats (02 § L01; thin hot / thick cool jumper cables) | `dc-circuit-bench` v2 **reuse (rebuilt)**, `mode: "ohms-law"`. Controls: component (constantan / copper / filament lamp), `L` 20–100 cm (default 40), `d` 0.30 / 0.60 / 1.20 mm (default 0.30), rheostat slider, **Take reading**, **Reset**. Parts `cell, key, ammeter, voltmeter, rheostat, wire, leads`. Emits `l1:bench` per reading, `l1:bench-done` after 5 readings on one component. Expected (constantan, 40 cm, 0.30 mm, R = 2.77 Ω): (0.20, 0.55) (0.40, 1.11) (0.60, 1.66) (0.80, 2.22) (1.00, 2.77) | **new `dc-concept-zoom`** `mode: "lattice"` (drifting electrons, vibrating ions; thin vs thick wire, temperature) — counters drift speed, collisions s⁻¹, temperature | **yes**: V (y) against I (x), `fit: "origin"`, slope triangle R = 2.77 Ω; lamp series `join: true`, no fit (curve bends up) | ← Hub (`../../index.html`) · → lesson-02 |
| lesson-02 | EMF, Terminal P.D., Lost Volts & Internal Resistance | Set 1 workshop · `chinedu`, `tobe`, `nkechi` · 5 beats (12.0 → 8.4 V) | `dc-circuit-bench` v2, `mode: "internal-resistance"`. Controls: E preset, r preset (default **E = 6.0 V, r = 1.5 Ω**), load R, key open/closed, **Take reading**, **Reset**. Parts `cell, key, ammeter, voltmeter, rheostat, leads`. Open → V = E; closed → I = E/(R + r), V = E − Ir. Emits `l2:bench`, `l2:bench-done` after 5 loads. Expected (0.50, 5.25) (1.00, 4.50) (1.50, 3.75) (2.00, 3.00) (2.50, 2.25) | **new `dc-concept-zoom`** `mode: "cell"` (ions crossing the electrolyte; energy-per-coulomb bar splitting into IR and Ir) — counters E, Ir, V | **yes**: V against I, `fit: "line"`, `extend: true`; intercept E = 6.0 V, gradient −1.5 → r = 1.5 Ω | ← lesson-01 · → lesson-03 |
| lesson-03 | Series & Parallel Networks, Cell Arrays, Power & Efficiency | Set 1 workshop · `emeka`, `tobe`, `nkechi`, `chinedu` · 5 beats (three backup cells, hot worn battery) | `dc-circuit-bench` v2, `mode: "network-cells"`. Controls: cell preset (**single fixed cell E = 5.0 V, r = 0.5 Ω** for the P/η trials — review minor 6; the three-cell arrangement uses `cellA–C`, each 1.5 V, r = 2.0 Ω, for the series/parallel comparison), cell arrangement series / parallel, network series / parallel / mixed, load R, **Measure**, **Reset**. Parts `cellA, cellB, cellC, R1, R2, R3, ammeter, voltmeter, node`. Emits `l3:bench`, `l3:bench-done` after both arrangements and 4 loads. Expected P: (0.1, 6.94) (0.5, 12.5) (1.0, 11.1) (2.0, 8.00) (4.0, 4.94); η: (0.1, 16.7) (0.5, 50.0) (1.0, 66.7) (2.0, 80.0) (4.0, 88.9) | **new `dc-concept-zoom`** `mode: "node"` (beads splitting by branch resistance, rejoining) + power-partition bar EI = I²R + I²r | **yes**: P (y) and η (y2) against R, `fn` smooth curves (P peaks at R = r = 0.5 Ω), never straight lines | ← lesson-02 · → lesson-04 |
| lesson-04 | Galvanometer Conversion — Ammeter Shunts & Voltmeter Multipliers | Set 2 test bench · `chinedu`, `nkechi`, `tobe` · 5 beats | `dc-circuit-bench` v2, `mode: "galvanometer"`. Controls: conversion (ammeter shunt / voltmeter multiplier), `I_g` (default 15 mA), `R_g` (default 18.0 Ω), target I or V, **Build & test**, **Reset**. Parts `coil, pointer, shunt, multiplier, terminals, scale`. Emits `l4:bench`, `l4:bench-done` after one of each. Expected 3.0 A → R_s = 0.0905 Ω (coil 15 mA, shunt 2.985 A); 40 V → R_total 2 667 Ω, R_m = 2 649 ≈ 2 650 Ω | **new `dc-concept-zoom`** `mode: "coil"` (moving coil in a radial field, hairspring, pointer; copper shunt strip ~99 % of the current; multiplier bobbin) | optional: R_s against target I, smooth falling curve (`fn`) | ← lesson-03 · → lesson-05 |
| lesson-05 | Null Methods — Metre Bridge, Potentiometer & WAEC Practicals | Set 2 test bench · `nkechi`, `chinedu` · 5 beats (24 V driver, k = 0.150 V cm⁻¹, balance at 80.0 cm = 12.0 V) | `dc-circuit-bench` v2, `mode: "bridge-potentiometer"` (sub-mode metre bridge / potentiometer). Controls: sub-mode, standard value, unknown / test cell, jockey position, **Find balance**, **Reset**. Parts `slidewire, jockey, galvanometer, leftgap, rightgap, driver, standard, scale`. Emits `l5:bench`, `l5:bench-done` after a bridge balance and a potentiometer balance. Expected: bridge R_x = 7.0 Ω balances at 56.0 cm → 5.50 Ω; potentiometer k = 0.0200 V cm⁻¹, 1.50 V cell at 75.0 cm; Emeka's battery at 80.0 cm on k = 0.150 | **new `dc-concept-zoom`** `mode: "ramp"` (potential falling along the slide wire as a ramp; jockey height vs cell EMF; galvanometer current fading at null) | **yes**: V_AJ against l, `fit: "origin"` (k = 0.0200 V cm⁻¹); optional R₂ vs R₁ through the origin | ← lesson-04 · → Hub (`../../index.html`, "Back to the unit") |

Hub ↔ lesson links: the hub's journey cards and CTAs point at `lessons/lesson-0X/index.html`; every lesson's top nav links `../../index.html`.

## Kit audit

- `kits/dc-circuit-bench`: being rebuilt into `window.DcCircuitBench.create(opts)` (model functions `solveOhms, solveIR, solveNetwork, solveGalv, solveBridge, solvePot` already in `kit.js`; 3D not yet). Covers all five benches. Part names above come from 02-lesson.md; when the kit ships, read `g.parts` and, if names differ, map them in one `ALIAS` table at the top of `bench.js` so narration targets stay as listed.
- `kits/study-graph` (`window.StudyGraph`): drives every lesson's `graph.js` (already in `html/assets/js/study-graph.js`; its CSS is in `style.css`). Reference graph.js: `git show HEAD:topics/ss2-phy-ohms-law-circuits/html/lessons/lesson-01/graph.js` (previous run).
- Video kits `cell`, `circuit`, `toll`, `graph` exist; `circuit-network` and `galvanometer` video kits are already requested in `06-videos/kit-requests/` (video-director's lane, not step 6).
- No catalog kit covers the five zoom scenes or the workshop story props → two new kits below.

## New kits (for kit-engineer, step 6) — HeartKit v2 fidelity (`.agents/skills/kit-builder/SKILL.md`)

Each lives in `kits/<id>/` with `README.md` + `demo.html`, a classic script exposing `window.<Name>`, `userData.parts`, `update(dt, t)`, `setState()`, `reading()` from a model, `highlight(part)`, offline with `window.THREE` + `window.SceneKit`. No primitive soup.

1. **`dc-circuit-bench` v2** (in progress, listed for completeness): five modes as in the table; `reading()` must reproduce every Expected result above exactly (rounded as in 02-lesson.md).
2. **`dc-concept-zoom`** — `window.DcConceptZoom.create({ mode })`, modes:
   - `lattice`: metal ion lattice (instanced spheres with thermal jitter ∝ T), free electrons drifting against E with collision flashes; params `d_mm` (0.30/1.20 → crowding), `T_C`; `reading()` → `{ drift_mm_s, collisions_per_s, T_C, R_rel }` (R_rel ∝ (1 + αΔT)/d²).
   - `cell`: lead-acid cell cross-section (extruded case, PbO₂ / Pb plates, electrolyte with moving ions), energy-per-coulomb bar splitting E into IR (external) and Ir (internal); params `E`, `r`, `R`; `reading()` → `{ I, V, lost }`.
   - `node`: junction where tube-guided beads split I₁ : I₂ = R₂ : R₁ and rejoin; power bar EI = I²R + I²r; params `R1`, `R2`, `E`, `r`.
   - `coil`: moving-coil galvanometer (curved pole pieces, soft-iron cylinder, rectangular coil on a former, hairsprings, pointer, scale) + thick copper shunt strip and a wound multiplier bobbin; params `I_g`, `R_g`, `target`, `conversion`; `reading()` → `{ R_s | R_m, I_coil, I_shunt }`.
   - `ramp`: slide wire with a sloping potential "ramp" surface, jockey, cell EMF level line, galvanometer needle ∝ (E − kl); params `k`, `E_cell`, `l`; `reading()` → `{ V_l, diff, balanced }`.
3. **`auto-workshop-props`** — `window.AutoWorkshopProps`: keke (three-wheeler with canopy, handlebar, headlamp that can dim via `setLamp(0–1)`), 12 V lead-acid battery (vent caps, posts, clamps), thin and thick jumper cables (`TubeGeometry`, `setHeat(0–1)` glow on the thin one), workbench tool board, coil of resistance wire, filament bulb. Shared by all five `story.js` files so the workshop looks the same in every lesson.

## Shared conventions (every lesson-builder must follow)

**Files per lesson:** `index.html`, `data.js`, `story.js`, `bench.js`, `zoom.js`, `lesson.js`, `narration.js`, `graph.js` (all five lessons; L04 optional). Never edit `html/index.html` or `html/assets/**`.

**Script order** in `lessons/lesson-0X/index.html`:
`../../assets/js/three.min.js` → `scene-kit.js` → `dc-circuit-bench.js` → (`dc-concept-zoom.js`, `auto-workshop-props.js` once shipped and copied) → `retrieval-bank.js` → `data.js` → `lesson-kit.js` → `sort-dnd.js` → `story-scene.js` → `story.js` → `bench.js` → `study-graph.js` → `graph.js` → `zoom.js` → `lesson.js` → `narration.js` → `narrator.js` → `math-kit.js`.
Guard every kit call: `if (window.DcCircuitBench) { … } else { /* clearly marked fallback that never throws */ }` (same for `DcConceptZoom`, `AutoWorkshopProps`); the real kit replaces the fallback without changing part names.
**CSS links:** `fonts.css`, `style.css`, `lesson.css`, `narrator.css`, `math.css`, then `theme.css` last. Do **not** link `hub.css`.

**Body:** `<body class="lesson-page" data-lesson="l0X">` (`l01` … `l05`, the `RETRIEVAL_BANK` keys).

**Section ids (the bank's revisit links use `concepts`, `practical`, `examples` — keep all exactly):**
`#donow` (`#donow-list`), `#story` (`#story-stage`, `#story-text`), `#wonder`, `#sort`, `#practical` (`#method-cards` `#m1`–`#m4`, `#bench-stage`, `#bench-canvas`, `#bench-readout`, `#results-table`, `#expected`, `#graph-card`), `#concepts` (`#props-table`, `#pos-explorer`), `#zoom` (`#zoom-stage`, `#zoom-canvas`), `#examples` (`#ex1`–`#ex3`, `ol.steps-sol`), `#bridge` (`#big-idea`), `#quiz` (`#quiz-list`), `#reflect` (`#rate-list`), `#assignment`.

**Make Sense for explainer videos (lessons 02, 03, 04 — `apply-video.mjs`):** in **every** lesson `#concepts` keeps `<span class="phase">…Make sense…</span>` **and** an `<h2>` directly inside `#concepts`. Keep `StudyNarrator.pause()` untouched.

**Sort games:** `SortDnD.attach(item, { bins: bins, onDrop: place, onTap: pick })` with `assets/js/sort-dnd.js` loaded before `lesson.js`. **Never** hand-write pointer drag code. `lesson.js` emits `l0X:sort` (`{ correct, total }`) on *Check*.

**Compact benches at 360 px (standing human feedback, `lesson-renderer/SKILL.md` + `html-standards.md` § 4):** every control bar (`.stage-bar`, `.bench-mode`, segmented controls, chip rows, `.bench-readout`) under **260 px** tall; everything below the canvas inside `#bench-stage` under **~600 px**; whole `#practical` under ~2300 px. Method cards = number badge + heading + one line of **≤ 9 words** (tight list on phones, 2×2 on desktop). Readout = only the tiles needed, **one row**, short values that cannot overflow. One control block: full-width segmented control → equal-size buttons in an even grid → small toggles in one row with the hint under them; no wordy caption per row. Results table = **one compact row per trial** (long text as a smaller second line that expands on tap). **Never reuse shared class names** `.lab`, `.stage`, `.hud`, `.hero`, `.tbl`, `.seg`, `.chips` for small lesson elements — prefix lesson classes (e.g. `.ohm-blab`, `.ir-chip`).

**Readout cards:** never put large text in a narrow column. The shell `lesson.css` stacks `.vt-cups` to one column on phones; do not override that, and keep readout values ≤ ~16 px in tiles narrower than 120 px (QA flagged 28 px text in 101 px columns in the previous run).

**Bench numbers** come from the kit model only (`g.reading()` / `DcCircuitBench.model`) and must match the Expected results in the lesson table above (= 02-lesson.md). No typed-in numbers, no `Math.random()` noise unless the kit models it.

**Narration actions:** `narrator.js` has **no** built-in `story:`, `open:` or `bench:` actions. Each `narration.js` defines its own in `NARRATION.actions` (`story`, `open`, `bench`, `zoom`, `graph`, …), following `topics/ss2-bio-heart-circulation/html/lessons/lesson-03/narration.js` (actions receive the text after the first `:`). 26–28 steps per lesson (02 § 6), en-NG, symbols spelled out in `say` ("E minus I r", "zero point zero nine zero five ohms", "R g", "k l").

**CustomEvents** (`document.dispatchEvent(new CustomEvent(name, { detail }))`): `l0X:bench` (detail = `reading()`), `l0X:bench-done`, `l0X:bench-reset`, `l0X:zoom` (`{ mode }`), `l0X:bridge` (`{ correct }`), `l0X:sort`, `l0X:pin` (position explorer). LessonKit emits `kit:donow`, `kit:note`, `kit:quiz-done`, `kit:rated`, `kit:solution`. Hub-only events: `lab:result`, `hub:tab`, `hub:flip`.

**3D scene API** (`window.StudyScenes.bench` / `.zoom` / `.story`): `rect(part)`, `highlight(part)`, `setMode(mode)`, `reset()`, plus lesson methods. Bench stages use `SceneKit.createStage` with default auto-framing; story stages pass `autoFit: false, zoomUi: false, portraitPitch: 0`. Live values in HTML `.bench-readout` (hide 3D HUD sprites below 560 px); 3D labels ≤ ~20 characters; never `text-transform: uppercase` anything with symbols (l ≠ L, r ≠ R, η, I_g, R_g).

**Data:** `window.LESSON_QUIZ` in `data.js` = the 12 MCQs of `03-questions.md` § Lesson 0X Part 1, `{ q, o: [4], a, e }`, keys unchanged. LessonKit appends the bank's 2 review MCQs (l02 on).

**Review minors left for the build (apply them):**
1. **L04:** in `data.js` (MCQs 11 and 12) and the assignment (b2(a)), label the extra galvanometers as other instruments, e.g. "a more sensitive galvanometer from Nkechi's drawer (not her 15 mA one)". Nkechi's own coil is always 15 mA, 18 Ω.
2. **L03:** state the condition for cells in parallel in `#concepts` and the Bridge: the parallel cell rule E_t = E, r_t = r/n holds for **identical** cells, and for n identical cells **parallel gives more current than series exactly when R < r**. Numerical check in the Bridge: three cells, 1.5 V each, r = 2.0 Ω, pump 1.0 Ω → parallel 1.5/(1.0 + 0.667) = 0.90 A, series 4.5/(1.0 + 6.0) = 0.64 A. (The story has three cells; WE2 has four — say so.)
3. **L05:** the Do Now stays retrieval — it comes from `RETRIEVAL_BANK.l05.donow` (card 4 is now an L03 item, not the bridge null question). Do not hard-code Do Now cards in the page.
Also: L05 bench precaution says "the metre rule and the galvanometer" (no other meters on that bench); never call 12.0 V "healthy" — say "normal-looking" or "unchanged".

**Facts to keep consistent with the hub:** Emeka's battery E = 12.0 V, r = 1.2 Ω, starter test load 2.8 Ω → I = 3.0 A, lost volts 3.6 V, terminal 8.4 V; potentiometer 24 V driver, k = 0.150 V cm⁻¹, balance 80.0 cm; L02 bench cell E = 6.0 V, r = 1.5 Ω; L03 cell E = 5.0 V, r = 0.5 Ω (P peaks 12.5 W at R = 0.5 Ω, η 50 %); Nkechi's galvanometer 15 mA, 18.0 Ω (0.0905 Ω shunt for 3.0 A, 2 649 ≈ 2 650 Ω multiplier for 40 V); metre bridge 7.0 Ω at 56.0 cm → 5.50 Ω; constantan ρ = 4.9 × 10⁻⁷ Ω m. The hub hero lab's test wire is 2.20 Ω (Worked Example 3 value); the L01 bench default is 2.77 Ω (40 cm, 0.30 mm) — both are correct for their wires.
