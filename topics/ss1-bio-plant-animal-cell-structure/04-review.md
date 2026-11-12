# Review: ss1-bio-plant-animal-cell-structure (round 2)
verdict: PASS (round-2 blocking fix applied by author; human approved 2026-11-07)

Reviewed fresh: `01-topic-map.md`, `02-lesson.md` (version 2), `03-questions.md`, against `sources/Biology_Cell_Structure_WAEC_NECO_JAMB.pdf` (pdftotext, 7-word and 6-word overlap scans).
Overall this is a strong unit. Every calculation, MCQ key and mark total checks out, and the structure is complete. One accuracy problem blocks a PASS. It is quick to fix.

## Blocking issues (must fix)

1. **The unit's reason for "mitochondria can't be seen on a school slide" is wrong, and the unit's own numbers contradict it.**
   - **What is wrong.** Lesson 02 teaches that a light microscope resolves about 0.2 µm, and that an image ≥ 0.1 mm is visible to the eye (`02-lesson.md` L02 Make Sense *Resolution* callout and WE2; `03-questions.md` L02 Q9, b7(c)). L02 Q9 itself gives a mitochondrion as 0.8 µm wide. So a mitochondrion is 4 times **above** the resolution limit. At ×400, the magnification used for every Lesson 05 slide, its image would be 0.8 µm × 400 = 320 µm = 0.32 mm, which is "visible" by the unit's own rule. Mitochondria are roughly 0.5–1 µm wide and several µm long, and Golgi bodies are several µm across. Neither is below the resolution limit. They are not seen on a school slide because iodine and methylene blue do not stain them, so at ×400 they show no contrast and are at best indistinct specks. Seeing them needs special stains such as Janus green, high power or oil immersion, or an electron microscope for detail. Ribosomes (≈ 0.025 µm) really are below the limit; mitochondria are not. A student who applies the Lesson 02 method at ×400 gets the opposite of the Lesson 05 answer.
   - **Where.**
     - `03-questions.md` L05 Q12. The explanation says: "Mitochondria (like ribosomes, ER and Golgi bodies) are too small to be resolved by a school light microscope." This sentence is also a near-copy of the source note (p. 9, "…Golgi bodies are too small to see clearly…").
     - `03-questions.md` L05 Q12 option B (the key): "too small to be seen with a school light microscope".
     - `03-questions.md` L05 b7 model (iv): "(too small to see with a light microscope)".
     - `02-lesson.md` L02 objective 05: "mitochondria and ribosomes cannot be seen".
   - **Fix.**
     - L05 Q12 key B becomes: *"On an iodine- or methylene-blue-stained slide at ×400, mitochondria are too small and unstained to be made out clearly, so they are not visible on the slide."*
     - Rewrite the Q12 explanation to keep two cases apart. Ribosomes are below the light microscope's resolving limit (≈ 0.2 µm), so they can never be seen with it. Mitochondria and Golgi bodies are larger, a few µm, but the school stains do not colour them, so at ×400 they cannot be picked out. Special stains or an electron microscope are needed. The rule stays the same: label only what you can see on your slide.
     - L05 b7 (iv) becomes: "remove 'mitochondrion' (not visible on an iodine-stained slide at ×400)".
     - `02-lesson.md` L02 objective 05 becomes: "Explain why ribosomes can never be seen with a light microscope (below its resolving limit) and why mitochondria, ER and Golgi bodies are not visible on a stained school slide."
     - Add one sentence to the L02 *Resolution* callout: *"Mitochondria (about 1 µm) are above this limit, but iodine and methylene blue do not stain them, so on a school slide they are not visible."*
     - The keys and mark allocations do not change.

## Minor issues (fix if quick)

1. **Short phrases copied from the source.** Each is a factual fragment, but the rule is zero copying. Reword them all:
   - `02-lesson.md` L01 2A sort items: "described the living jelly inside cells", "stated that plants are made of cells" and "stated that animals are made of cells" are the source's scientist-table entries word for word (p. 3). Change them to, for example, "first reported the living jelly that fills cells", "concluded that every plant is built of cells" and "extended the idea to every animal".
   - `03-questions.md` L05 Part A *What a good answer shows*: "…because the bulb grows underground without light, so it has no chloroplasts" matches source pp. 9 and 14. Reword, for example: *"…colourless: bulb scales develop in the dark, so their cells never form chloroplasts."*
   - L05 Q11 option A follows the same source sentence closely. Reword, for example: *"Onion bulb scales form below the soil, where no light reaches them, so their cells never develop chloroplasts."*
2. **A Do Now card reuses the source's worked example.** `02-lesson.md` L05 Do Now 1 ("40 mm image at ×400 → 0.1 mm") uses the source's exact example (p. 10). Change the numbers, for example "a 36 mm image at ×400 → 0.09 mm (90 µm)".
3. **A Do Now card retrieves something no earlier lesson teaches.** `02-lesson.md` L03 Do Now 1 asks about the contractile vacuole, but neither L01 nor L02 teaches it (L02 only says the animal vacuole is "small and short-lived"). Add to the L02 *vacuole* entry: "in freshwater protozoa such as *Amoeba*, a contractile vacuole pumps out excess water". Otherwise, swap the card for something L02 does teach.
4. **The self-rating scale is not stated in four lessons.** Only L01 says "I can (1–4)". Write "**I can (1–4):**" in L02–L05 Phase 5, so the renderer builds the 1–4 rubric everywhere.
5. **Two benches have no method cards.** The L03 *Investigate* bench (pond survey and SA:V cubes) has no numbered method cards, and the L05 slide bench has its steps inline only. Add 3–4 numbered method cards to each, as L01, L02 and L04 have.
6. **One error direction is incomplete.** In `02-lesson.md` L04 *Sources of error*, evaporation from open tubes concentrates every solution, so gains are recorded **too small** as well as losses **too large**. Say both.
7. **The isotonic-point methods don't quite agree.** L04 WE3 uses straight-line interpolation (0.34), but the graph instruction asks for a smooth curve. Add to WE3: "(a straight line between the two points gives an estimate; reading the smooth curve gives about 0.33–0.34)".
8. **Two MCQ explanations are thin.** In L02 Q8, the explanation for option C ("forgets to divide properly") is vague, and option B (50 µm) is not explained. State it plainly: C is 0.005 mm mis-converted (×1000 too large, wrongly left in mm), and B is a ×10 slip.
9. **Two marks overlap in one model answer.** In L05 b1, marks 2 ("in a drop of water or dilute iodine") and 3 ("iodine added if not already in iodine") overlap. A candidate who mounts directly in iodine could be credited twice for one step. Make mark 2 "laid flat without folding on a clean slide" and mark 3 "stained with a drop of dilute iodine".
10. **Optional: competence L2 is unused.** No lesson uses L2 (cultural interaction). The standard of 2–3 competences per lesson is met, so this is not required, but L04 (market salting of vegetables) or L05 (clear written communication) would carry L2 naturally.

## Calculation audit

All values were recomputed independently.

- **Hub archetypes 1–6:** ×400 · 0.40/8 = 0.050 mm = 50 µm · 24/400 = 0.060 mm = 60 µm · 50/0.25 = ×200 · 6/2 = 3.0 mm⁻¹ · 0.35/2.50 = +14.0%. **All verified.**
- **L01**
  - Bench: 4.0/80, 1.6/32 and 0.40/8 all give 0.050 mm. The field × magnification product is 160 in every row, which is consistent. **Verified.**
  - Explorer: 2, 5 and 20 mm. **Verified.**
  - WE1 ×400, 50 µm · WE2 60 µm · WE3 ×200 and 37.5 mm. **Verified.**
  - Bridge: 0.40/50 = 8 µm · Exit ticket ×100, 100 µm · analysis ×600. **Verified.**
- **L01 quiz:** Q6 ×320 · Q8 1.2/15 = 0.08 mm = 80 µm · Q9 18/450 = 40 µm · Q10 28/0.07 = ×400. **Verified.**
- **L01 Part A:** mean of 2.5, 2.5 and 2.25 is 2.42, which rounds to ×2.4. **Verified.**
- **L01 Part B:** b4 ×480 · b5 0.075 mm, 75 µm, 0.45/0.075 = 6 · b6 0.002 mm = 2 µm, 32/0.008 = ×4000. Marks 3+4+3+3+5+5+4+3 = **30**. **Verified.**
- **L02**
  - WE1: 30/15 000 = 2 µm. **Verified.**
  - WE2: 0.025 × 400 = 10 µm = 0.010 mm; 0.2/0.025 = 8. **Verified.**
- **L02 quiz:** Q8 200/40 000 = 5 µm · Q9 0.8 × 100 = 80 µm = 0.08 mm. **Verified.**
- **L02 Part B:** b7 250/25 000 = 10 µm, 30/25 000 = 1.2 µm, 10 µm × 100 = 1 mm. Marks 4+3+4+4+4+3+5+3 = **30**. **Verified.**
- **L03**
  - Do Now: 30/600 = 0.05 mm. **Verified.**
  - Cube table rows 1, 2, 3, 4 and 6 mm (6.0, 3.0, 2.0, 1.5, 1.0). **Verified.**
  - WE1 3.0 · WE2 ×6 · WE3 60, 0.2, ×300 · Exit ticket 1.2 mm⁻¹. **Verified.**
- **L03 quiz:** Q9 384/512 = 0.75 · Q10 12/0.6 = 20 · Q11 6/0.4 = 15 mm. **Verified.**
- **L03 Part A:** SA:V 4.0, 2.4 and 1.7. Pale fractions 0.81/2.25 = 36%, 3.61/6.25 = 58%, 8.41/12.25 = 69%. **Verified.**
- **L03 Part B:** b5 0.24 mm², 0.008 mm³, 30, 0.15, ×200. Marks 4+4+4+4+5+3+4+2 = **30**. **Verified.**
- **L04**
  - Bench % changes: +14.0, +4.8, −2.0 (−1.98), −8.0, −12.2 (−12.195), −16.5 (−16.54). **Verified.**
  - WE1 +14.0% · WE2 −12.2% · WE3 4.8/6.8 = 0.71, giving 0.34 mol dm⁻³ · Exit ticket −10.0%. **Verified.**
  - Saline: 4.5 g in 500 cm³. **Verified.**
- **L04 quiz:** Q6 0.62/4.00 = +15.5% (B 13.4% is ÷ final) · Q7 3.20 − 0.24 = 2.96 g · Q9 0.25 + 0.6 × 0.1 = 0.31 · Q12 2.25 g. **Verified.**
- **L04 Part A:** +5.0, −1.7, −6.7%. One level teaspoon (≈ 6 g) in 500 cm³ is about 1.2%. **Verified.**
- **L04 Part B:** b5 +13.5, −1.6, −14.0% (given rows +6.1, −7.0, −11.0 also check); interpolation 6.1/7.7 = 0.79, giving 0.27 mol dm⁻³ · b8 9.0 g. Marks 4+3+6+4+6+3+2+2 = **30**. **Verified.**
- **L05**
  - WE1 80/0.40 = ×200 · WE2 ×3.0 · WE3 60/1500 = 0.04 mm = 40 µm. **Verified.**
  - Explorer ×4–×7 on 1.2 cm gives 4.8, 6.0, 7.2 and 8.4 cm. Exit ticket ×100. **Verified.**
- **L05 quiz:** Q8 72/0.06 = ×1200 · Q9 54/300 = 0.18 mm · Q10 ×7.5 gives 9.0 cm (×5 6.0, ×6 7.2, ×9 10.8). **Verified.**
- **L05 Part A:** 7.0, 7.5 and 7.2 cm. **Verified.**
- **L05 Part B:** b6 64/0.08 = ×800, 70/350 = 0.20 mm = 200 µm, 5 × 1.4 = 7.0 cm. Marks 5+3+4+3+4+5+4+2 = **30**. **Verified.**
- **MCQ keys** (12 per lesson, exactly one ✓ each, A/B/C/D counts):
  - L01: C A D B A D B C B A C D (3/3/3/3)
  - L02: A C D C B B A D B D C A (3/3/3/3)
  - L03: C A D B C A D B C D A B (3/3/3/3)
  - L04: C A D B D A B D A C B C (3/3/3/3)
  - L05: C A D B C B D A C D A B (3/3/3/3)
  - Every key is correct on the biology.
- **Facts checked:**
  - Dates: Hooke 1665, Dujardin 1835 ("sarcode"), Schleiden 1838, Schwann 1839, Virchow 1855.
  - Organelle membrane counts.
  - Resolution ≈ 0.2 µm and ribosome ≈ 0.025 µm.
  - 0.9% NaCl is isotonic with plasma.
  - Prokaryote ribosomes are smaller.
  - Cilia and flagella arise from basal bodies.
  - *Euglena* is saprophytic in darkness.
  - All correct. No `[VERIFY]` tags remain.
- **Explainer video plan (§ 7):** `node scripts/video-picks.mjs` reports no problems. Every score equals its reasons: 7, 5, 8, 10, 5.
  - "+3 multi-step" is honest in L01, L03, L04 and L05: each has ≥ 2 worked examples of ≥ 3 steps.
  - "+2 frequently examined" matches `01` §§ 1 and 8.
  - L05 is correctly marked −3 practical-led.
  - Resolved picks: lesson-01, lesson-03, lesson-04, within the cap of 3. L02 and L05 (5 each) are dropped by the cap, with stated reasons.

## Coverage matrix

| Objective | Taught in | Tested by (Quiz & Assignment) |
|---|---|---|
| LO1 cell theory, Hooke/Dujardin/Schleiden/Schwann; define cell and organelle | L01 sort, Make Sense | L01 Q1–5; b1, b2, b3 |
| LO2 magnification, actual size, mm ↔ µm | L01 bench + WE1–3; L02 WE1–2; L05 WE1–3 | L01 Q6, Q8–10; b4–b6 · L02 Q8–9; b7 · L05 Q8–10; b6 |
| LO3 structure/function of components; membranes 2/1/0 | L02 sort, dissector, organelle table, zoom | L02 Q1–3, Q6–7, Q10–12; b3–b6, b8 |
| LO4 plant vs animal, wall vs membrane, prokaryote vs eukaryote | L01 props table; L02 tables | L01 Q11–12; b7 · L02 Q4–5; b1, b2 |
| LO5 forms (free, colony, filament, tissue); colony vs tissue; nutrition | L03 sort, pond survey, forms table, callout | L03 Q1–6; b2, b3, b7 |
| LO6 levels of organisation; gains/costs; SA:V | L03 levels chain, complexity table, cube bench, WE1–3 | L03 Q7–12; b1, b4, b5, b6 |
| LO7 diffusion, osmosis, active transport; plasmolysis/turgor/haemolysis/crenation; isotonic point | L04 sort, potato bench, definitions, solutions table, WE1–3, Bridge | L04 Q1–12; b1–b8 |
| LO8 onion and cheek slides, drawing rules, observable differences | L05 sort, slide bench, drawing audit, rules callout | L05 Q1–7, Q11–12; b1–b5, b7, b8 |

## Confirmed 3D & Interactive Scenes for Renderer

| Scene ID | Type | Target parts / Events |
|---|---|---|
| hub `#lab-canvas` | StudyLab (`cell-bio`) | modes `cells` · `microscope` (×4/×10/×40 → ×40/×100/×400) · `osmosis` (water / 0.9% saline / salty water) |
| hub `#combo-curve` | SVG explorer | Magnification · SA:V = 6/L · Osmosis (zero at ≈ 0.34) · Levels step chart |
| L01 `bench` | SceneKit microscope | `eyepiece`, `objective`, `stage`, `mirror`, `coarse`, `fine`, `slide`; slides cork / onion / blood; `l1:bench`, `l1:bench-done` |
| L01 `zoom` | SceneKit | bacterium vs plant cell; toggles `nucleus`, `organelles`, `ribosomes` |
| L02 `bench` | SceneKit organelle dissector | `wall`, `membrane`, `nucleus`, `mitochondrion`, `chloroplast`, `vacuole`, `er`, `golgi`, `ribosome`, `lysosome`, `centrioles`; `l2:bench`, `l2:bench-done` (8 taps) |
| L02 `zoom` | SceneKit | mitochondrion (cristae, matrix), chloroplast (grana, stroma); protein route ribosome → RER → vesicle → Golgi → membrane |
| L03 `bench` | SceneKit pond survey + SA:V cubes | `amoeba`, `paramecium`, `euglena`, `chlamydomonas`, `volvox`, `spirogyra`, `hydra`; cubes L = 1, 2, 3, 4, 6 mm with dye front; `l3:bench`, `l3:bench-done` (4 cubes) |
| L03 `zoom` | SceneKit | *Volvox* colony vs *Hydra* two layers; level ladder |
| L04 `bench` | SceneKit potato-strip osmometer | `borer`, `strip`, `tube`, `balance`, `tile`, `blotter`; 6 tubes 0.0–1.0 mol dm⁻³; `l4:bench`, `l4:bench-done`; `graph.js` smooth curve |
| L04 `zoom` | SceneKit (`cell-bio` osmosis) | plant cell + red cell in hypo/iso/hypertonic: turgid/flaccid/plasmolysed; haemolysis/normal/crenation |
| L05 `bench` | SceneKit slide prep | `peel`, `iodine`, `coverslip`, `spatula`, `methylene`, `slide`, `stage`; wrong-step consequences; `l5:bench`, `l5:bench-done`; live 9-rule drawing audit |
| L05 `zoom` | SceneKit | onion slide at ×100 / ×400 vs textbook diagram; non-visible items fade (mitochondria, ER, Golgi: "not visible on a stained school slide", per blocking fix 1) |

## Author response (2026-11-07)
- Blocking 1 (mitochondria visibility reason) fixed exactly as specified in `02-lesson.md` (L02 objective 05, Resolution callout) and `03-questions.md` (L05 Q12 key B + explanation, b7 (iv)). Keys and marks unchanged.
- Minors fixed: 1 (source phrases reworded in L01 sort cards, L05 Part A, Q11 A, Q2 explanation), 2 (Do Now 36 mm → 0.09 mm), 3 (contractile vacuole added to L02 vacuole entry), 4 (I can (1–4) in L02–L05), 6 (both evaporation directions), 7 (interpolation vs smooth-curve note), 8 (L02 Q8 distractors explained), 9 (L05 b1 marks separated).
- Left for the renderer: 5 (numbered method cards for the L03/L05 benches). Declined: 10 (L2 optional).
- Two review loops used; remaining changes are rewordings with no key or mark changes, so the topic goes to the human for approval instead of a third loop.
