# Review: ss2-phy-ohms-law-circuits (round 2 of unit version 3, 2026-11-08)
verdict: PASS (round-2 blocking fixes applied by author; human blanket approval 2026-11-08)

Reviewed fresh by an independent reviewer: `01-topic-map.md`, `02-lesson.md` (v3), `03-questions.md`, checked against `sources/Current Electricity Past Questions Bank (WAEC, NECO, JAMB).pdf` (pdftotext). Every value was recomputed with python3. This file replaces the round-1 review.

**Round-1 blocking items: all 8 are fixed.**
1. L03 load-power data now reads 6.94 / 12.5 / 11.1 / 8.00 / 4.94 W, which is correct for E = 5.0 V, r = 0.5 Ω.
2. The L01 loose-contact error now applies only when the contact lies between the voltmeter tapping points.
3. The L02 poor-contact error now applies only when the contact sits at the cell's own terminals.
4. L04 uses one coil (15 mA, 18 Ω) everywhere: the story, the bench expected values (0.0905 Ω and 2 649 ≈ 2 650 Ω), the explorer and the Bridge. WE2 is labelled as a second galvanometer.
5. L03 exit ticket is now 0.60 Ω / 5.4 Ω, giving 90 %.
6. L04 exit ticket is now 90 Ω, 3.0 mA, 18 V, giving 5 910 Ω.
7. L02 exit ticket is now 7.5 V / 0.40 Ω / 2.1 Ω, giving 6.3 V.
8. L05 WE1 is now a 7.0 Ω standard balancing at 56.0 cm, giving 5.50 Ω, then 1.25 m of 0.36 mm wire, giving 4.48 × 10⁻⁷ Ω m. None of these reuse a source item.

Round-1 minors 1–4, 5, 7 and 9–12 are also fixed. Two new blocking problems turned up in Lesson 01. Everything else is accurate.

## Blocking issues (must fix)

1. **L01 expected results cannot come from any bench setting (02-lesson.md, Lesson 01 › 2B › "Expected results & graph", line 104, read with the bench controls on line 102).**
   - The expected table is a "constantan wire (`R = 2.20 Ω`)". The bench only offers constantan at `L = 20/40/60/80/100 cm` and `d = 0.30/0.60/1.20 mm`, and it computes `R = ρL/A`.
   - With ρ = 4.9 × 10⁻⁷ Ω m (topic map § 10), the 15 possible resistances are:
     - `d = 0.30 mm`: 1.39 / 2.77 / 4.16 / 5.55 / 6.93 Ω
     - `d = 0.60 mm`: 0.35 / 0.69 / 1.04 / 1.39 / 1.73 Ω
     - `d = 1.20 mm`: 0.09 / 0.17 / 0.26 / 0.35 / 0.43 Ω
   - None of them is 2.20 Ω. A student who runs the bench can never reproduce the "expected" line, so the table, the narration and the results check will disagree. This is the same kind of fault as round-1 blocking item 4.
   - **Fix:** tie the expected table to a real preset. Use "constantan, `L = 40 cm`, `d = 0.30 mm`: `R = 2.77 Ω`" with points `(0.20, 0.55)`, `(0.40, 1.11)`, `(0.60, 1.66)`, `(0.80, 2.22)`, `(1.00, 2.77)` and a slope triangle giving `R ≈ 2.77 Ω`. Make it the bench's default state.
   - WE3 (2.20 Ω from `(0.20, 0.44)` and `(1.00, 2.20)`) can stay as a separate textbook graph, but drop any wording that says it is the bench's line.
   - The other option is to keep 2.20 Ω and add a preset that gives it (for example `d = 0.30 mm`, `L = 31.7 cm`). That is awkward, so it is not recommended.

2. **L01 Part B b7(b) describes the voltmeter in the wrong place (03-questions.md, Lesson 01 › b7, line 159).**
   - The stem says "if the voltmeter was connected across the whole series circuit, including the loose terminal".
   - A voltmeter across the whole series loop reads the cell's terminal p.d. Then `V/I` is the total external resistance: wire + rheostat + ammeter + contact. It would be far "too high" even with no loose terminal, so the item no longer tests the loose-contact idea.
   - It also contradicts the method the unit teaches (02 L01 method card 1: voltmeter across the wire only). The model answer and mark note ("extra series resistance in the measured section") only make sense for the correct arrangement.
   - **Fix:** reword the stem to "…if the loose terminal was between the two points where the voltmeter was connected to the wire". Leave the model answer as it is ("too high", because the contact resistance was measured as part of the wire). Optionally add to the mark note: "a loose terminal elsewhere in the loop only lowers I and does not bias V/I".

## Minor issues (fix if quick)

1. **Which galvanometer Nkechi uses in L04 (03-questions.md L04 MCQ 11 line 564, MCQ 12 line 571, b2(a) line 609).** The unit says Nkechi's galvanometer is the 15 mA, 18 Ω coil. MCQ 12 has her use a 30 Ω, 1.0 mA coil for the same starter-line test, MCQ 11 gives her a 25 mA coil, and b2(a) uses a 1 mA coil on "Emeka's starter". Label them as other instruments, as WE2 already does. For example: "a more sensitive galvanometer from Nkechi's drawer (not her 15 mA one)…".
2. **The L03 Bridge gives no reason or numbers (02-lesson.md line 288).** "For his low-resistance pump the three cells go in parallel" is true only when the pump's resistance is less than one cell's internal resistance. For n identical cells, parallel beats series exactly when `R < r`. Add that condition and one numerical check, e.g. three cells of 1.5 V, `r = 2.0 Ω`, pump 1.0 Ω: parallel `1.5/(1.0 + 0.667) = 0.90 A`, series `4.5/(1.0 + 6.0) = 0.64 A`. Also note that the story has three cells while WE2 has four. That is fine, but say so.
3. **"Healthy 12.0 V" (01-topic-map.md § 2, "it reads a healthy 12.0 V"; 02-lesson.md L05 story beat 4, line 397, "The EMF is healthy").** A fully charged 12 V lead-acid battery rests at about 12.6–12.7 V, so 12.0 V is a partly discharged battery. The physics point (EMF unchanged, r risen) stands, but word it as "normal-looking" or "the EMF has not fallen". The hub lede and the L02 story already do this.
4. **L05 Do Now card 4 does not retrieve an earlier lesson (02-lesson.md line 390).** "On a balanced bridge, what flows through the galvanometer?" is new Lesson 05 content and has no "Revisit" link. Swap it for a real L03/L04 retrieval item (e.g. "In a parallel pair, which one carries the larger current?" (Revisit Lesson 3)), or tag it clearly as a primer.
5. **The L05 sort item is imprecise (02-lesson.md line 402).** "The slope of `R₂` vs `R₁` gives a diameter ratio" should read "gives the square of the diameter ratio, `(d_A/d_B)²`", to match line 411 and MCQ 8.
6. **The L03 bench cell is unspecified (02-lesson.md lines 255–257).** The expected results use a "fixed cell `E = 5.0 V`, `r = 0.5 Ω`", but the bench has `cellA–C` with series/parallel arrangements. Tell the kit builder which preset gives 5.0 V / 0.5 Ω, so the bench reproduces the P–R and η–R points.
7. **The L02 warming-cell error has a hidden condition (02-lesson.md line 183).** "The later points sagged and the gradient… came out too high" assumes the readings were taken from low to high current. Add "(readings taken in order of increasing current)". L02 b7(b) already says "later (higher-current)".
8. **L05 bench precaution mentions meters it doesn't have (02-lesson.md line 412).** It refers to "the meters", but the parts list (line 409) has only a galvanometer. Say "the metre rule and the galvanometer", or add `ammeter` to the parts.
9. **Wording (03-questions.md L03 MCQ 7, line 377).** "every one has an EMF" should be "each has an EMF".

## Originality scan
- 7-word overlap against the source: **no prose matches**. The only hits are the source's own title (cited in topic map § 10) and the formula string `R_left/R_right = l/(100 − l)`.
- 6-word hits are stock physics phrases only ("a straight line through the origin", "the internal resistance of a cell", "opened between readings so the wire", "potentiometer over a voltmeter for measuring").
- **Item-level reuse:** no item reuses a source item's numbers with its set-up. Canonical set-ups that come back with all-new numbers are acceptable:
  - driver-circuit trap: L05 WE2, MCQ 6, b5 vs source WAEC Q6
  - shunt-current split: L04 MCQ 5 vs source JAMB Q12
  - left-gap → right-gap bridge: L05 exit ticket, MCQ 2 vs source Q9
  - two-readings method: L02 WE2, MCQ 11, b5 vs source JAMB Q5
  - potentiometer internal resistance: L05 WE3, MCQ 5 vs source Q10
- No external national curriculum is named. British spelling is consistent. "Meter" means an instrument and "metre" a length, used correctly. No `[VERIFY]` tags remain.

## Standards check
- **Structure:** all 5 lessons have the 5 phases in order, with Wonder (story + wall) before any definitions. Each has a Do Now with 4 cards and `from:`. Each has a sort plus a 3D practical with 4 method cards, a results table with units and decimal places, and 5 locked analysis questions. Make Sense has definitions, `.eq`, a comparison table, a pin explorer and a zoom. Apply has 3 worked examples per lesson, each with ≥ 3 steps, plus the Bridge and a 12-item quiz. Reflect has "I can (1–4)", an exit ticket, recall, Parts A/B and teacher notes ✓.
- **Timing:** L01 phase labels are 5 + 10 + 30 + 15 + 10 + 5 = 75 min plus the break = 80 min. Every timetable has 0–45, a **45–50 min movement break**, then 50–80 ✓.
- **Competences:** L1–L7 are all tagged somewhere: L2 in L01, L3 in L05, L5 in L01, L7 in L03 ✓.
- **Language and context:** precautions are in the past tense throughout. Nigerian context (Aba, Onitsha, keke, NEPA/PHCN units, pure-water caps), SI units and sensible significant figures throughout ✓.
- **Error directions** checked and correct:
  - L01: warming wire (slope too high); contact between the voltmeter tappings (too high); low-R voltmeter (`V/I` too low)
  - L02: finite-R voltmeter (E too low); warming cell (r too high, see minor 7); terminal contact (r too high)
  - L03: warming cells (η and I too low); ammeter resistance (I and P below the model)
  - L04: shunt contact resistance and warming shunt (reads too high); `R_total` used as the multiplier (reads too low)
  - L05: warmed coil (too high); uniform wire warming cancels; driver running down (E too high)
  - 03: L02 Part A drain (r too high); L03 b7 (η too low); L04 b7 (too high); L05 MCQ 9 (too high); L05 b6(d) (r too low); L05 Part A off-centre pivot
  - The one problem is the stem of L01 b7(b) (blocking 2).
- **Graph shapes:**
  - straight lines: V–I for a wire (through the origin); V–I for a cell (intercept E, gradient −r); `V = kl` (through the origin); R₂–R₁ (through the origin, slope `(d_A/d_B)²`); `R_s` vs `1/(I − I_g)`; d vs 1/n
  - smooth curves: P–R (peak at R = r, never a straight regression line); η–R (rising towards 100 %); `R_s`–I (falling)
  - filament lamp: bends upwards with V vertical, and over towards the V axis with I vertical (hub tab states its axes)
  - All ✓.

## Questions audit (03-questions.md)
- 12 MCQs per lesson with exactly one key each. Keys per lesson (A/B/C/D): L01 3/3/3/3 · L02 3/3/3/3 · L03 3/3/3/3 · L04 3/3/3/3 · L05 3/3/3/3 ✓. Every distractor has an explanation, and each distractor value was recomputed and matches its named slip ✓.
- Part B totals, all 30 ✓:
  - L01: 3+3+4+4+5+6+3+2
  - L02: 3+3+4+5+4+6+3+2
  - L03: 3+3+4+5+5+5+3+2
  - L04: 3+3+5+5+5+4+3+2
  - L05: 3+4+4+4+6+4+3+2
- No mark points overlap: checks by subtraction are explicitly unrewarded, and "any two" lists are capped.
- Mystery numbers (12.0 V, 8.4 V, 2.8 Ω, 3.0 A, 1.2 Ω, 3.6 V) are used identically across 01, 02 and 03. The L04 coil (15 mA, 18 Ω → 0.0905 Ω / 2 649 Ω) is consistent across the 02 story, bench, explorer and Bridge (but see minor 1 for 03).

## Calculation audit
- **Lesson 01**
  - 02-lesson: Do Now π(4.0 × 10⁻⁴)²/4 = 1.26 × 10⁻⁷ m² ✓. WE1 5.0 A, 1 200 W, 600 C ✓. WE2 ρ = 1.1 × 10⁻⁶ Ω m, R₂ = 4.40 × 1.5 × 0.25 = 1.65 Ω ✓. WE3 1.76/0.80 = 2.20 Ω ✓. Bridge (1.20/0.30)² = 16 ✓. Exit 1.0 × 10⁻⁶ Ω m ✓. Expected table internally consistent but not reachable on the bench (blocking 1).
  - MCQs: 2 480 C (8.0, 187.5, 0.32) · 4 2.0/3.0/4.5 Ω · 6 24 Ω (3.0, 12, 1.5) · 7 3.4 × 10⁻² Ω (1.4 × 10⁻³, 3.4 × 10⁻⁵, 8.5 × 10⁻¹⁵) · 8 3.5 Ω (0.29, 4.0, 3.15) · 10 9:1 · 11 960 Ω ✓.
  - Part B: b5 A = 1.96 × 10⁻⁷ m², L = 2.40 m, 2.0 A, 24 W, 300 C ✓. b6 least-squares slope 3.60 Ω (intercept ≈ 0), A = 7.07 × 10⁻⁸ m², ρ = 3.2 × 10⁻⁷ Ω m ✓. Part A wide/narrow ≈ 1/3 ✓.
- **Lesson 02**
  - 02-lesson: expected V = 6.0 − 1.5I (5.25 … 2.25) ✓. Explorer I = 0, 0.80, 1.33, 1.71, 2.40 A ✓. WE1 3.0 A / 3.6 V / 1.2 Ω ✓. WE2 0.30r = 0.30, so r = 1.0 Ω, E = 4.0 V ✓. WE3 4.2 V ✓. Exit 3.0 A, 6.3 V ✓.
  - MCQs: 3 9.6 V (C = 12 − 2.5 × 1.2 = 9.0) · 4 1.0 V (1.125) · 5 1.0 Ω · 6 1.50 V, 0.50 Ω · 7 3.0 V, 0.75 Ω · 9 2.0 Ω (4.8) · 10 8.0 W (88, 96, 2.0) · 11 0.50 Ω, 1.5 V (1.35; 2.0/1.95; 0.10/1.38) ✓.
  - Part B: Part A r = 0.39, 3.2 Ω ✓. b4 1.5 A, 10.2 V, 1.8 V, 2.7 W, 85 % ✓. b5 r = 0.50 Ω, E = 9.0 V ✓. b6 least-squares gradient −0.400, intercept 2.00 V, I_sc = 5.0 A, V(0.50) = 1.80 V ✓.
- **Lesson 03**
  - 02-lesson: P(R) for E = 5.0 V, r = 0.5 Ω is 6.94 / 12.5 / 11.1 / 8.00 / 4.94 W and η is 16.7 / 50.0 / 66.7 / 80.0 / 88.9 % ✓. WE1 4.0 Ω, 1.75 A, I₆ = 1.17 A ✓. WE2 1.0 A vs 0.67 A ✓. WE3 4.5 W, 90 % ✓. Exit 90 % ✓. Freezer 6.0 kWh = 2.16 × 10⁷ J ✓.
  - MCQs: 2 1.71 Ω (0.58, 10.3) · 3 8.5 Ω (27.5, 1.76, 15.0) · 4 0.375 A (1.1) · 5 2.0 V/0.30 Ω · 6 1.0 A (1.5, 0.36, 1.33) · 7 1.67 vs 1.25 A · 8 6.0 Ω · 9 180 kJ (10.8 MJ) · 10 80 % · 12 10.8 W (36, 25.2, 3.6) ✓.
  - Part B: b4 2.0 Ω, 3.0 A, 21 V, 6.0 V, 2.0 A (no-r slip 3.4 A) ✓. b5 2.2 A vs 2.5 A, 2.4 W vs 3.1 W (no-r 18 A) ✓. b6 E = 3.0 V, r = 2.0 Ω table all correct, missing 0.50 A / 1.00 W ✓. b8 70 %, new battery waste 0.10/2.9 ≈ 3 % ✓.
- **Lesson 04**
  - 02-lesson: Do Now 0.27 V ✓. Bench and Bridge R_s = 0.270/2.985 = 0.0905 Ω, R_m = 2 666.7 − 18 = 2 649 ≈ 2 650 Ω ✓. Coil share 0.5 % ✓. WE1 0.0905 Ω ✓. WE2 4 975 Ω ✓. WE3 2.5 mA → 9 960 Ω ✓. Exit 5 910 Ω ✓.
  - MCQs: 3 0.408 Ω (0.392, 235, 0.196) · 4 7 925 Ω · 5 9.98 mA (1 600 A) · 6 29 940 Ω (500, 2 940) · 7 0.1996 Ω · 8 4.0 V · 9 4 000 Ω · 11 99.6 % (0.42, 24) · 12 14 970 Ω / 0.0060 Ω ✓.
  - Part B: b4 0.090 V, 1.498 A, 0.0601 Ω, 0.0600 Ω ✓. b5 15 000, 14 955, 22 500 Ω, 0.80 mA ✓. b6 R_s(0.20 A) = 1.05 Ω (row values 5.00, 2.22, 0.408, 0.202 ✓), gradient 0.20 V ✓. b8 9.6 A (240 A slip) ✓. Part A percentages 7.0 / 7.6 / 6.4 / 49 ✓.
- **Lesson 05**
  - 02-lesson: story k = 0.150 V cm⁻¹ × 80.0 cm = 12.0 V (24 V driver) ✓. WE1 5.50 Ω, A = 1.018 × 10⁻⁷ m², ρ = 4.48 × 10⁻⁷ Ω m ✓. WE2 0.10 A, 0.50 V, 8.0 cm ✓. WE3 / explorer 0.75 Ω ✓. Expected 0.0200 × 75.0 = 1.50 V ✓. Exit 6.75 Ω ✓.
  - MCQs: 2 2.7 Ω (14.7, 9.0, 4.4) · 3 1.45 V (0.80, 0.37, 1.34) · 5 0.80 Ω (0.67, 20, 0.20) · 6 7.5 cm (2.0, 5.5, 2.7) · 8 1.5 (5.1) · 11 33.3 cm (66.7, 25.0) · 12 1.2 Ω ✓.
  - Part B: b4 10.0 Ω (inverted 3.6), L = 2.6 m ✓. b5 0.20 A (0.205 slip), 1.6 V, 0.016 V cm⁻¹, 1.12 V, Tobe 2.8 V (too high) ✓. b6 0.60 / 0.60 / 0.60 Ω ✓. Part A n × d ≈ 60, M ≈ 6.0 caps ✓.

## Explainer video plan (§ 7)
`node scripts/video-picks.mjs topics/ss2-phy-ohms-law-circuits` reports no problems.
- **Scores equal their reasons:** L01 5, L02 10, L03 9, L04 10, L05 6.
- **The points are honest:**
  - "+3 multi-step": every lesson has ≥ 2 worked examples with ≥ 3 steps.
  - "+2 frequently examined": matches topic map § 8 and the source's weighting table.
  - "−3 practical-led": applied to L01 and L05, the bench-led lessons.
  - L04 "+1 derivation": the shunt and multiplier are derived in Make Sense.
- **Picks:** L01 and L05 are marked "yes" but say they are dropped by the cap, which is acceptable because the reason is stated. The cap resolves to **lesson-02, lesson-03, lesson-04**, which matches the human decision frozen in `status.md`. No change.

## Coverage matrix
| Objective | Taught in | Tested by (Quiz & Assignment) |
|---|---|---|
| LO1 Define I, V, EMF, r; Ohm's law and its condition | L01 Make Sense; L02 Make Sense | L01 MCQ 1, 3; L01 b1, b2; L02 MCQ 1, 2; L02 b1 |
| LO2 V = IR, Q = It, P = IV = I²R = V²/R (incl. kWh) | L01 WE1; L03 Make Sense (kWh line), WE3 | L01 MCQ 2, 11; L01 b5; L03 MCQ 8, 9; L03 b1 |
| LO3 R = ρL/A, R ∝ L/d², ohmic vs non-ohmic | L01 Investigate, WE2, WE3, Bridge | L01 MCQ 4–8, 10, 12; L01 b3, b4, b6; L05 b4 |
| LO4 E, terminal p.d., lost volts; two readings; graph | L02 all phases | L02 MCQ 3–12; L02 b2–b7 |
| LO5 Networks and cell arrays | L03 Investigate, WE1, WE2 | L03 MCQ 1–7; L03 b2–b5 |
| LO6 Energy, power, efficiency; P–R, η–R | L03 Make Sense, WE3, explorer | L03 MCQ 9–12; L03 b1, b6–b8; L02 MCQ 10, b4 |
| LO7 Shunt and multiplier; ideal meter resistances | L04 all phases | L04 MCQ 1–12; L04 b1–b8 |
| LO8 Metre bridge, potentiometer, precautions, error direction | L05 all phases | L05 MCQ 1–12; L05 b1–b8 |

## Confirmed 3D & Interactive Scenes for Renderer
| Scene ID | Type | Target parts / Events |
|---|---|---|
| hub `#lab-canvas` | StudyLab (`dc-circuit-bench`) | modes `ohms-law`, `internal-resistance`, `null`; HUD E, r, R, I, V, Ir |
| L01 `story` / `bench` / `zoom` | StoryStage / SceneKit / SceneKit | `cell`, `key`, `ammeter`, `voltmeter`, `rheostat`, `wire`, `leads`; `l1:bench`, `l1:bench-done`; lattice drift counters. **Expected line must match a real preset (blocking 1)** |
| L02 `story` / `bench` / `zoom` | StoryStage / SceneKit / SceneKit | `cell`, `key`, `ammeter`, `voltmeter`, `rheostat`, `leads`; `l2:bench`, `l2:bench-done`; inside-cell energy bar (E, Ir, V) |
| L03 `story` / `bench` / `zoom` | StoryStage / SceneKit / SceneKit | `cellA–C`, `R1–R3`, `ammeter`, `voltmeter`, `node`; `l3:bench`, `l3:bench-done`; node split + power-partition bar (cell preset E = 5.0 V, r = 0.5 Ω; minor 6) |
| L04 `story` / `bench` / `zoom` | StoryStage / SceneKit / SceneKit | `coil`, `pointer`, `shunt`, `multiplier`, `terminals`, `scale`; `l4:bench`, `l4:bench-done`; one coil 15 mA / 18 Ω → 0.0905 Ω shunt, 2 649 Ω multiplier |
| L05 `story` / `bench` / `zoom` | StoryStage / SceneKit / SceneKit | `slidewire`, `jockey`, `galvanometer`, `leftgap`, `rightgap`, `driver`, `standard`, `scale`; `l5:bench`, `l5:bench-done`; bridge 7.0 Ω @ 56.0 cm → 5.50 Ω; potentiometer k = 0.0200 V cm⁻¹; potential ramp to null |
| graphs | StudyGraph | `fit: "origin"` (V–I wire, V = kl, R₂–R₁), `fit: "line"` (cell V–I), `fn` smooth curves (P–R, η–R, R_s–I), `join: true` (filament) |

Re-review needed after fixes: only blocking items 1 (02-lesson.md L01 line 104, plus the bench default) and 2 (03-questions.md L01 b7(b) stem).

## Author response (2026-11-08)
- Blocking 1 fixed: Lesson 01 Expected results now use the bench default (constantan, L = 40 cm, d = 0.30 mm → R = 2.77 Ω; points (0.20, 0.55) … (1.00, 2.77)); defaults stated in the bench controls. Worked Example 3 stays at 2.20 Ω as a separate textbook graph.
- Blocking 2 fixed: L01 Part B b7(b) stem now places the loose terminal between the voltmeter's connection points on the wire.
- Minors fixed: 3 ("healthy" → "normal-looking"/"unchanged"), 5 (square of the diameter ratio), 6 (L03 cell preset 5.0 V / 0.5 Ω named in the bench), 7 (increasing-current order), 8 (galvanometer scale), 9 ("each has"). Left for the renderer/builders or accepted: 1 (label L04 extra galvanometers as other instruments), 2 (parallel-cell condition), 4 (L05 Do Now card 4).
- Two review loops used; the remaining changes are wording/number-consistency fixes with no key or mark change, and the human has given blanket approval to finish, so the unit proceeds to the build.
