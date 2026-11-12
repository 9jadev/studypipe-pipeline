# Review: ss2-bio-heart-circulation (round 2, independent)
verdict: PASS

Reviewed fresh: `01-topic-map.md`, `02-lesson.md` (version 3, hub + 7 lessons), `03-questions.md` (84 MCQs, 7 home investigations,
7 x 30-mark papers), against `sources/The Human Heart and Blood Circulation — WAEC, NECO & JAMB Study Guide.pdf` (pdftotext)
and `lesson-designer/references/video-criteria.md`. Every number below was recomputed in python3. The round-1 blocking items
are confirmed fixed: Mama Bisi's swelling is now caused by long standing, leaky varicose-vein valves and raised venous-end
capillary pressure (`02-lesson.md` L07 Bridge; `03-questions.md` L07 Q12 key and explanation, with her 160/100 treated as a
separate risk), and there is no `[VERIFY]` tag left in any of the three files (`grep -ci verify` = 0). The salt guidance in
L07 Part A is worded as the World Health Organization's advice of under 5 g a day, which is correct.

## Blocking issues (must fix)

None. Zero factual errors, zero wrong keys, zero broken mark totals, zero copied passages found.

## Minor issues (fix if quick)

1. **Slightly wrong ratio in a spoken line.** `02-lesson.md` L01 › 1. Wonder › Story step 2 (line 85): Dr Aisha says "Your heart
   has more than doubled its speed". 132 ÷ 68 = 1.94, so it did not quite double (L04 WE3 correctly says "almost double").
   Fix: "Your heart has nearly doubled its speed."
2. **Test-wise bias in the keys.** The correct option is also the longest in 49 of the 84 MCQs (L01 7, L02 5, L03 8, L04 6,
   L05 7, L06 7, L07 9 of 12; chance would be about 21). Worst cases: `03-questions.md` L07 Q12 (key A is far longer than B to D),
   L03 Q9, Q12, L07 Q6 and Q9. Fix if quick: lengthen the distractors or shorten the keys in those items. Letter balance (3/3/3/3)
   is already perfect, so no key letters need to move.
3. **Six-word run from the source.** "blood passes through the heart twice" appears in `03-questions.md` L01 Q9 option D (line 71)
   and `01-topic-map.md` §9 row 6 (line 128). It is a short factual phrase, not a copied sentence (the 7-word scan finds only the
   topic name "haemolytic disease of the newborn" plus an option letter in L07 Q6, which is a different question from the
   source's). Fix if quick: "blood goes through the heart two times in each circuit" (the wording already used in `02-lesson.md`).
4. **Competence L2 missing from the topic map.** `02-lesson.md` L07 uses L2 (genotype and blood donation discussed respectfully)
   but `01-topic-map.md` §7 lists only L1, L3, L4, L5, L6, L7. Add one L2 line to §7.
5. **"I can (1–4)" is labelled only in Lesson 01** (line 139); Lessons 02–07 say "I can:". Use "I can (1–4)" in all seven so the
   renderer builds the same 1–4 self-rating everywhere.
6. **Video plan, L01 row (line 600).** It says "KIT GAP: circulation-types", but `kits/video/sa-volume-cubes` exists and would
   cover the SA : V cube work. Add it to "kits" so the director does not log a false gap if the cap is ever raised. No effect on
   the current picks.
7. **Housekeeping for the director (not content).** `status.md` step 3 still lists a "new [VERIFY]" for the WHO salt figure,
   which no longer exists. `06-videos/` holds direction scripts for lessons 03, 04, 05 from the earlier run, but the resolved
   picks are lessons 04, 05, 06: lesson-03's script is stale and lesson-06 needs a new one.
8. **Earthworm in the L01 sort** is binned `closed-single`. Defensible (one circuit, no lung loop), but textbooks rarely label
   an earthworm "single". If a student challenges it, the one-line *why* should say "closed; not a lung-and-body double loop".
   Fine to leave.

## Calculation audit

All verified in python3; every `02` value matches its `03` counterpart (shared constants: Pc 36 to 16 and πc 25 mmHg; plasma 55%;
5 million red cells per mm³; 120/80 and the 140/90 line; LV : RV about 3; 0.8 s cycle at 75 bpm).

- Hub archetypes 1–6: 6/20 = 0.30 mm⁻¹; 18 × 4 = 72 bpm, T = 0.83 s; 68 × 70 = 4760 cm³ = 4.76 dm³; +11 and −9 mmHg; Q = 84 cm³ s⁻¹, v = 0.035 cm s⁻¹; 480 ÷ 0.020 × 200 = 4.8 × 10⁶: verified.
- L01 bench table (3.0 mm penetration): SA 150/600/2400/5400, V 125/1000/8000/27 000, SA : V 1.2/0.60/0.30/0.20, pink 0/64/2744/13 824 mm³, colourless 100/93.6/65.7/48.8%: verified. WE1 3.0 cm⁻¹ = 0.30 mm⁻¹; WE2 30 ÷ 0.015 = 2000; WE3 65.7%; Exit ticket 1.2 mm⁻¹: verified.
- L02 bench means 1.5/2.0/4.0/12.0/11.0 mm, LV : RV = 3.0; WE2 ×1.5; WE3 18 ÷ 1.5 = 12 mm = 1.2 cm: verified.
- L03: 13-card sort sequence counted (13); every route's valve count (4, 4, 4, 2) verified.
- L04: bench 17/33/29/24/20/18/17 beats in 15 s = 68/132/116/96/80/72/68 bpm; WE1 72 bpm, 0.83 s; WE2 4.76 and 12.54 dm³ min⁻¹, ratio 2.63; WE3 94.1%; WE4 0.50 ÷ 0.80 = 62.5%; Exit ticket 84 bpm, 0.71 s: verified. Cycle stages 0.4 + 0.1 + 0.3 = 0.8 s.
- L05: NFP 11/6/1/−4/−9 on a straight line, zero at 11/20 = 55%; WE2 84 cm³ s⁻¹ (5040 cm³ min⁻¹), 0.035 cm s⁻¹, ratio 1000; WE3 +5 mmHg; WE4 125 cm³ h⁻¹ (15%); Exit ticket +9: verified.
- L06: 98 + 92 + 101 + 95 + 94 = 480 → 24 000 → 4.8 × 10⁶; 15 mm ÷ 2000 = 7.5 µm; 2.5 × 10¹³ cells; 1.5 ÷ 5.0 = 30%; 55% of 5.0 dm³ = 2.75 dm³: verified.
- L07: tile table and the rider's bag choice (B−, then O−) verified against the antigen/antibody rule; pulse pressure 60 vs 40 mmHg; eleven disorders counted (11).
- MCQs, all 84 keys re-derived. Numerical items re-computed: L01 Q3 1.5, Q4 4, Q5 70.4%, Q12 5000 · L02 Q4 3.125 ≈ 3.1, Q11 ×2.0, Q12 4.4 mm · L03 Q10 4 valves · L04 Q2 100 bpm/0.60 s, Q4 largest fall 20 between 1 and 2 min, Q6 4.80 dm³, Q8 120%, Q11 70% · L05 Q3 −6, Q5 +6, Q6 0.030 cm s⁻¹, Q10 +1 and +21 mmHg · L06 Q7 4.3 × 10⁶, Q8 12 µm, Q11 4.4 cm³ · L07 Q8 152/96 only. Every wrong option's trap arithmetic also checked (e.g. L01 Q5 D = 42.1%, L06 Q7 C = 2.15 × 10⁷, L04 Q8 A = 54.5%).
- Part B model answers recomputed: L01 b4 384 mm², 512 mm³, 0.75 mm⁻¹, 7.5 cm⁻¹, 0.375; b5 0.33, 13 mm, 2197 mm³, 62.3% · L02 b6 12.9/4.3 mm, 3.0, ×2.0 · L04 b5 88 bpm, 0.68 s, 5720 cm³ = 5.72 dm³, 37.5% (wrong-method 27.3% also correct); b6 falls 16/20/16/10/4/2, recovery 6 min · L05 b5 +6/−12/one third/+2; b6 0.80/2.4/0.35/3.8 mm, ratios 0.33/0.092 · L06 b6 460 → 4.6 × 10⁶ (wrong-method 115 also correct); b8 7.0 µm · L07 b5 A+/O+/AB+, b8 52 mmHg. Home-investigation sample tables (L01 78.4/40.7/27.1%; L06 56 → 11.2 → 1680; L07 4 × 4 grid, 0.6 teaspoon per person) verified.
- Part B totals (each question's marks sum, mark points are separate and non-overlapping within each question):
  L01 3+4+4+5+5+3+4+2 = 30 · L02 3+4+3+4+3+5+4+4 = 30 · L03 3+6+4+3+4+5+3+2 = 30 · L04 3+5+3+4+6+5+2+2 = 30 · L05 3+5+3+4+6+4+3+2 = 30 · L06 3+4+5+4+2+5+4+3 = 30 · L07 4+3+5+5+3+4+3+3 = 30.
- MCQ structure (parsed by script): 12 per lesson, exactly one ✓ per question (the ✓ in the file's intro paragraph is decorative), keys A/B/C/D = 3/3/3/3 in every lesson, and every wrong option is explained in the *Explanation* line.

## Originality and language
- 6-word and 7-word scans against the source text: `02-lesson.md` 0 seven-word matches; `03-questions.md` 2 (both "haemolytic disease of the newborn" plus an option letter, from different questions); `01-topic-map.md` 5 (the repeated file title line only). Factual phrases such as the L02 position-of-the-heart sentence follow the source's idea but are reworded with new detail; every scenario, number and question is new. Rule 1 satisfied.
- No external national curriculum is named. British spelling and SI units throughout (the only "-ization" is the proper noun World Health Organization). Nigerian context is strong (Oja Oba, UCH, Adeoyo, okada, amala, ugu, zobo, garri-style market voice).

## Structure standards
- Every lesson has Phases 0–5 in order: Do Now (4 cards with `from`), Wonder (story, Wonder Wall prompt, seed notes), Investigate (sort game and 3D practical with method cards, results table, expected values, past-tense precautions, directional errors, five locked analysis questions), Make Sense (concepts, comparison table, explorer, second 3D zoom), Apply (3–4 worked examples, Bridge, 12 questions), Reflect (I can, exit ticket, recall, assignment, teacher notes).
- The 45–50 min movement break and competences are in every lesson's teacher notes; Part A and Part B are in every assignment; the hub has the hero lab, explorer tabs, six archetypes and three myth cards.

## Explainer video plan (§ 7)
`node scripts/video-picks.mjs topics/ss2-bio-heart-circulation` reports no problems. Every score equals the sum of its reasons:
L01 7, L02 2, L03 7, L04 11, L05 10, L06 10, L07 5. Each "+3 multi-step calculations" is backed by at least two worked examples
with at least three steps (L01 4/4/4/–, L05 4/4/3/3, L06 4/3/3, L04 3/3/3/3, L02 3/3/3 with −3 and −2 applied). Cap of 3 applied:
videos are L04, L05, L06; L01, L03, L07 are recommended but dropped by the cap. L02 is correctly not recommended
(practical-led and recall). A reason is written for every lesson. See minor issue 6 and 7.

## Coverage matrix
| Objective | Taught in | Tested by (Quiz & Assignment) |
|---|---|---|
| LO1 Why large animals need transport; materials carried | L01 Make Sense, WE1–3 | L01 Q1, Q3, Q4, Q11, Q12; b2, b3, b4 |
| LO2 Open/closed, single/double, advantages | L01 sort, tables, circuit zoom | L01 Q7–Q10; b1, b7, b8 |
| LO3 Coverings, chambers, valves, septum, chordae, great vessels, wall thickness | L02 | L02 Q1–Q9; b1–b5 |
| LO4 Draw/label section; magnification and actual size | L02 WE2–3, drawing rules | L02 Q11, Q12; b6, b8; Part A |
| LO5 Pulmonary, systemic, hepatic portal, coronary routes | L03 | L03 Q1–Q12; b1–b7 |
| LO6 Cardiac cycle, sounds, conduction; heart rate, cycle time, output; pulse, BP; rate factors | L04 | L04 Q1–Q12; b1–b8 |
| LO7 Vessel table; tissue fluid and NFP; lymph; speed | L05 | L05 Q1–Q12; b1–b8 |
| LO8 Blood composition, cells, clotting; counts and sizes | L06 | L06 Q1–Q12; b1–b8 |
| LO9 ABO, Rhesus, transfusion, HDN, disorders | L07 | L07 Q1–Q12; b1–b8 |
| Misconceptions (all 9 in map §9) | arteries/oxygen L02–L05, blue blood L05, myogenic L04, coronary L03, thick side L02, fish L01, tissue fluid L05, AB L07, Rh mother L07 | L02 Q8, Q9; L03 Q7; L04 Q3; L05 Q2, Q7; L07 Q3, Q6 |

## Confirmed 3D & Interactive Scenes for Renderer
| Scene ID | Type | Target parts / Events |
|---|---|---|
| hub `StudyLab` | 3D hero lab (`HeartKit.heart both/pace`, `circuitCompare`) | `lv`, `septum`; modes heart / circuit / pace; bpm slider 60–180 |
| L01 bench | `HeartKit.cube` agar-cube practical | cube, beaker, acid, forceps, ruler, tile, blade; `l1:bench`, `l1:bench-done` (4 cubes) |
| L01 zoom | `circuitCompare` open → single → double | counters: trips per circuit 1/1/2, pressure low/reduced/high |
| L02 bench | `HeartKit.heart` dissect/specimen | ra, la, rv, lv, septum, valves, chordae, papillary, great vessels, scalpel, ruler; `l2:bench` ×5 walls |
| L02 zoom | `HeartKit.valve` | open slider, setCusps(3)/(2), cut-the-chordae toggle |
| L03 bench | `HeartKit.heart both` + body map route tracer | route presets; `l3:bench` per route, `l3:bench-done` after 3 |
| L03 zoom | gut → hepatic portal → liver; aorta root and coronaries | block toggle |
| L04 bench | `HeartKit.heart pace` + wrist model | san, avn, his, purkinje, stopwatch, step; `l4:bench-done` after 6 counts |
| L04 zoom | `pace` then `sys` modes | LUB/DUB captions; counters bpm, cycle time, phase |
| L05 bench | `HeartKit.vessels` + `capillaryBed` probe | probe 0 to 1, modes normal/congest/kwash/blocked; `l5:bench-done` |
| L05 zoom | `capillaryBed` | normal → congest → kwash → blocked |
| L06 bench | `HeartKit.bloodSmear` smear and haemocytometer | magnification ×100/×400, 5 squares, `clot` slider; `l6:bench-done` |
| L06 zoom | `bloodSmear` clot 0 → 1 | fibrin weave; citrate toggle |
| L07 bench | typing tile with `bloodSmear` clump view | anti-A/B/D wells, Rider and Donors 1–4; `l7:bench-done` after 5 |
| L07 zoom | `bloodSmear` agglutination; Rh sensitisation over two pregnancies | antibody bridges |
