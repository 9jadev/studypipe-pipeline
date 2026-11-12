# Review: ss2-phy-simple-harmonic-motion (round 2)
verdict: PASS

Reviewer: accuracy-reviewer (new, independent reviewer for round 2). Files reviewed: `01-topic-map.md`, `02-lesson.md`, `03-questions.md`, `sources/` (PDF notes, `links.md`, `README.md`).
Every number was recomputed by script (Python, `math` only) before the authors' working was compared. All 5 round-1 blocking issues and all 16 author-facing minor items are fixed correctly. The fresh full review found **no blocking issues**. Six small minor items are listed below; none would mislead a student or a WAEC examiner, and none blocks render.

---

## Round 1 summary (blocking issues and how each was resolved)

| # | Round-1 blocking issue | Resolution in round 2 | Status |
|---|---|---|---|
| 1 | L07 Barton driver 0.60 m given as `T = 1.56 s` | 2B *Expected results* and WE3 step 1 now read `2π × 0.2474 = 1.55 s`, `f = 0.64 Hz`. Script: `T = 1.5547 s`, `f = 0.6432 Hz`. | **Fixed** |
| 2 | L03 lift-off callout said the carrier "can pull it down at most at g" | Callout now says the carrier can push the crate up but cannot pull it down; only gravity pulls the crate down; the crate leaves when `ω²A > g`; crates stay on while `A < g/ω²`. Physically correct. | **Fixed** |
| 3 | Story numbers not labelled as a model for students | Part I § 3 realism note is now a student-visible `.case-note`; a `.note` "Story numbers are a teaching model, not real measurements." sits under the first story-number worked example in L01 (WE1), L02 (WE3), L03 (WE2), L06 (WE4), L07 (WE1) and in the L07 Bridge verdict. | **Fixed** |
| 4 | Rule 5b: L04 zoom (force resolution, small-angle triangle) specified in 3D | L04 zoom is now a 2D Paper.js `pendulum-forces` panel (thread at `θ`, arc, `mg`, tension, `mg cos θ`, `mg sin θ`, shaded `x`/`l` triangle, 50 g ↔ 100 g swap) with a small 3D context view. Kit Plan: `pendulum-forces` added to the `shm-kinematics-2d` row; `pendulum` v3 `forces` marked "context view only". | **Fixed** |
| 5 | `[VERIFY]` tags left in `02-lesson.md` | `grep` finds no `[VERIFY]` in `02` or `03`. Line 27 reads `model (see realism note)`; the weighting tag is gone; the L05 bench has the teacher note on local `g ≈ 9.78` vs the bench's 9.79. | **Fixed** |

### Round-1 minor items

| # | Item | Status |
|---|---|---|
| 1 | Lift-off threshold computed with the driving `ω` (Hub `ridge` HUD, `mass-spring` `okada`, L07 explorer) + teacher line | **Fixed** (Hub § 1, Kit Plan, L07 `#pos-explorer` "5.0 cm at 20 km/h, 2.2 cm at 30 km/h", L07 teacher note). The L07 *zoom* still draws a constant threshold line; see new minor R2-3. |
| 2 | Critical vs ζ = 0.30 teacher note | **Fixed** (L06 teacher notes) |
| 3 | L05 ceiling callout axis wording | **Fixed** |
| 4 | L06 and L07 precautions / sources of error | **Fixed** (3 + 3 each, past tense) |
| 5 | `okada` rig in L01 and L02 bench controls | **Fixed** |
| 6 | L02 sort bin label | **Fixed** |
| 7 | L05 `T²` tolerance ±0.002 s² | **Fixed** |
| 8 | Bifilar suspension | **Fixed** (L02 sort item → `shm`) |
| 9 | Phase names in L03–L07 timetables | **Fixed** (L02–L07 now name every phase) |
| 10 | `km h⁻¹` in formal answers | **Fixed** (L07 WE1, WE2, WE4, exit ticket) |
| 11 | L01 Q8 distractor B rationale | **Fixed** |
| 12 | L07 Q11 threshold wording | **Fixed** ("threshold at 3.3 Hz is about 2.2 cm"; script 2.23 cm) |
| 13 | L06 b7(c) accepted list | **Fixed** (meter pointer, door closer) |
| 14 | L05 Part A slope from line points | **Fixed** ((0.20, 0.81) → (1.00, 4.04), 4.04 s² m⁻¹) |
| 15 | L05 Q8 / b8 axis wording | **Fixed** |
| 16 | "(extension)" on derivation items | **Fixed** (L02 b3, L04 b3) |
| 17 | `study-graph` SVG for lab data graphs | Director decision accepted (status.md). Not an issue. |

---

## Blocking issues (must fix)

None.

---

## Minor issues (fix if quick; none blocks render)

**For exam-setter (`03-questions.md`)**
1. **R2-1 · L03 Q12, explanation of option C** (line ~412): "C is where the carrier pushes *hardest* on the crate, pressing it down, not letting it go." "pressing it down" could be read as the carrier pushing the crate downwards, which is the misconception round 1 removed from L03. *Fix:* "C is where the carrier pushes up *hardest* on the crate, pressing the crate firmly onto it, not letting it go."

**For lesson-architect (`02-lesson.md`)**
2. **R2-2 · L04 2B has precautions but no sources of error.** Add 2, e.g. "reaction time at start and stop (shared over 20 oscillations)" and "the support moved slightly, adding to the effective length". (L03 2B is a 2D simulation, so it needs none.)
3. **R2-3 · L07 2D zoom threshold line.** The zoom spec draws "a dashed horizontal line at the lift-off threshold (6.2 cm / 7.8 cm)", i.e. `g/ω₀²`, while the Hub HUD and L07 explorer now use `g/ω_d²`. Outcomes are the same at every speed and ζ I tested, but for consistency draw the threshold as the curve `g/(2πf)²` (it crosses 6.2 cm / 7.8 cm at the peak), or label the flat line "threshold at resonance".
4. **R2-4 · L05 zoom mini `T²`–`l` graph** has no kit named. State `study-graph` (the accepted lab-graph kit) so the renderer does not improvise.
5. **R2-5 · L01 2B expected results:** `T` is shown as `1.80 s` (3 s.f.) but `f = 0.557 Hz` comes from the unrounded 1.795 s. A student who uses 1.80 s gets 0.556 Hz. The interactive table should accept ±0.001 Hz (same idea as the L05 ±0.002 s² rule).
6. **R2-6 · L04 sort item "measuring on a hill vs at sea level → changes (very slightly)"** is arguable in the bin scheme (a student could reasonably put it in `no-change` at lab accuracy). Keep it, but make the after-check *why* line say "g is very slightly smaller up a hill, so T is very slightly longer, too small to see with a stopwatch."

**Note for the director (no change needed):** the L07 Bridge advice "about 10 km/h or below" is safe in the sinusoidal model at both loads (250 kg at 10 km/h: `A = 1.6 cm` vs threshold `20 cm`). Real ridges are sharp bumps, so a real rider could also feel a weaker sub-harmonic bounce near half the resonant speed. That is beyond the syllabus and the model; no student text needs to change.

---

## Calculation audit (round 2, all recomputed by script; `g = 9.8 m s⁻²` unless stated)

**Story model (02 § Story model table)**
- 200 kg: `ω = √(31 600/200) = 12.570 rad s⁻¹`, `ω² = 158.0`, `f₀ = 2.0005 Hz`, `T₀ = 0.4999 s`. Sag `mg/k = 6.203 cm` = threshold `g/ω² = 6.203 cm`. `v_res = 2.5 × 2.0005 = 5.001 m s⁻¹ = 18.00 km h⁻¹`. **Verified.**
- 250 kg: `ω = 11.243`, `ω² = 126.4`, `f₀ = 1.789 Hz`, `T₀ = 0.559 s`, `v_res = 4.473 m s⁻¹ = 16.10 km h⁻¹`, sag/threshold `7.75 → 7.8 cm`. **Verified.**
- Matching pendulum `l = gT₀²/4π² = 0.0621 m = 6.2 cm`. **Verified.**
- Lift-off rule `ω²A ≥ g`: threshold equals the sag because `m/k = 1/ω²`. **Verified.**
- Damper response (`Y = 1.0 cm`, base excitation). 200 kg, ζ = 0.05: 10 → 1.44 · 14 → 2.49 · 16 → 4.40 · 18 → 10.05 · 20 → 3.89 · 30 → 0.57 cm (table 1.4 / 2.5 / 4.4 / 10.1 / 3.9 / 0.6); peak 10.06 cm at 17.96 km h⁻¹. Healthy ζ = 0.30: peak 1.99 cm at 16.8 km h⁻¹ ("about 2.0 cm near 16–18 km/h"). 250 kg, ζ = 0.05: 16 → 10.03 cm, 18 → 3.68 cm, peak at 16.1 km h⁻¹. **All verified.**
- Lift-off with driving-frequency threshold `g/(2πf)²`: 200 kg leaking lifts at 17, 18, 19 km h⁻¹ (resonance band) and not at 10, 14, 16, 20, 25, 30, 35; 250 kg leaking lifts at 16 only among tabulated speeds; healthy damper never lifts at either load (5–35 km h⁻¹). Explorer thresholds 5.0 cm at 20 km h⁻¹ and 2.2 cm at 30 km h⁻¹ **verified**. Every tabulated pass/fail in 02 and 03 is correct.

**Lesson 01:** 2B pendulum 0.80 m → `t₂₀ = 35.90 s`, `T = 1.795 s`, `f = 0.557`, `ω = 3.50`; spring 0.20 kg / 24.5 N m⁻¹ → `11.35 s`, `0.568 s`, `1.76 Hz`, `11.1 rad s⁻¹`. WE1 0.50 s / 2.0 Hz / 12.6 · WE2 2.80 / 0.357 / 2.24 · WE3 11.1 % / 0.56 % · WE4 6.0 cm / 2.0 s / 1.20 m · exit 300 Hz, 3.3 × 10⁻³ s. **Verified.**

**Lesson 02:** expected table (`k = 24.5`): `x` 2.0–10.0 cm; `t₂₀` 5.68, 8.03, 9.83, 11.35, 12.69 s; `T²` 0.0806 … 0.403; slopes 24.5 N m⁻¹ and 1.61 s² kg⁻¹ → `k = 24.5`. WE1 49 N m⁻¹, 0.4917 → 0.49 s · WE2 3.27 → 3.3 m s⁻², 12.8 rad s⁻¹ · WE3 0.4999 → 0.50 s, 0.5589 → 0.56 s · WE4 0.90 s · Bridge 10.0 → 11.2 s · exit 49 N m⁻¹. **Verified.**

**Lesson 03:** expected (`A = 0.30`, `ω = π`) 0°: 0 / 0.942 / 0; 30°: 0.150 / 0.816 / −1.48; 60°: 0.260 / 0.471 / −2.56; 90°: 0.300 / 0 / −2.96; `a/x = −9.87`. WE1 0.40 / −1.5 / 0.50 · WE2 3.54 → 3.5 cm · WE3 0.38 m s⁻¹, 4.7 m s⁻² · WE4 6.2 cm · Bridge 12.6 m s⁻² · exit 0.40 / 4.0. **Verified.**

**Lesson 04:** bench, exact large-angle period (AGM): 5° 28.40 s · 10° 28.44 · 30° 28.88 · 0.25 m 20.11 · 1.00 m 40.22 · Moon 70.38. Explorer: sin-θ deficit 0.13 / 0.51 / 2.0 / 4.5 / 10 %; period increase 0.05 / 0.19 / 0.77 / 1.74 / 4.0 %. WE1 1.904 → 1.90 s · WE2 1.90 s · WE3 4.9 s · WE4 0.99 m · Bridge 6.2 cm. **Verified.**

**Lesson 05:** model `g = 9.79`: `t₂₀` 25.40, 29.79, 33.60, 37.03, 40.16 s; `T` 1.270, 1.490, 1.680, 1.852, 2.008; `T²` 1.613, 2.219, 2.822, 3.428, 4.032 (squaring displayed `T` gives 2.220 and 3.430, covered by the ±0.002 rule). Slope `(4.032 − 1.613)/0.600 = 4.0317 s² m⁻¹` → **g = 9.79 m s⁻²** (4.03 → 9.80 if the rounded slope is used, still 9.79–9.80). WE1 9.79 · WE2 9.80 · WE3 9.56, 2.5 % low · WE4 slope −4.03, `g = 9.80`, `H = 2.80 m` (consistent with `l = 1.00` and `0.60 m`) · Bridge 6.2 cm · exit 9.63. Count-from-one error `(20/19)² = 1.108` → +11 %. **Verified.**

**Lesson 06:** decay air 5.00, 4.85, 4.70, 4.56, 4.43, 4.29 · water 5.00, 3.75, 2.81, 2.11, 1.58, 1.19 · oil 5.00, 2.00, 0.80, 0.32, 0.13, 0.05; `E₀ = 0.0306 J`; 10 oscillations in air 5.68 s. Explorer `x = 0.0707` → PE = KE = 0.125 J. WE1 0.25 / 0.090 / 0.16 J / 0.80 m s⁻¹ · WE2 0.071 m · WE3 0.049 J / 0.99 m s⁻¹ · WE4 6.3 J / 61 J / ×9.6. **Verified.**

**Lesson 07:** Barton 0.60 m → **1.555 s → 1.55 s**, 0.643 → 0.64 Hz. Sweep 1.11 / 1.56 / 1.78 / 2.00 / 2.22 / 3.33 Hz. WE1 5.0 m s⁻¹ = 18 km h⁻¹ · WE2 1.79 Hz, 4.47 m s⁻¹, 16.1 km h⁻¹ · WE4 21.6 ≈ 22 km h⁻¹ · exit 21.6 km h⁻¹. **Verified.**

**03-questions.md: all 84 MCQs.** Every numerical key recomputed (e.g. L01 Q2 1.60 s, Q3 0.040 s, Q5 12.6, Q8 1.0 %, Q9 48 cm, Q12 1.79 Hz · L02 Q2 50, Q5 1.26 s, Q6 1.6 s, Q8 49, Q9 356 kg, Q11 4.8 · L03 Q2 0.32, Q3 9.9, Q6 5.0 cm, Q8 1.05 s, Q9 2.9 Hz, Q10 0.80 · L04 Q2 2.5 s, Q3 1.8 s, Q5 3.7 s, Q7 9.84, Q9 0.36 m · L05 Q1 0.865 m, Q2 9.87, Q7 2.506, Q8 9.77, Q9 9.73, Q12 6.2 cm · L06 Q2 0.10 J, Q3 0.15 J, Q4 5.7 cm, Q5 25 %, Q8 0.80, Q10 0.50, Q12 96 J · L07 Q3 11.5, Q4 3.0 Hz, Q7 16 km h⁻¹, Q10 0.79 Hz, Q11 3.33 Hz / 2.2 cm), and every distractor's stated slip reproduces its number. **No errors.**
- **Single defensible answer:** checked all 84. None ambiguous. (L04 Q12: `T²`–`l` is also linear but not offered. L05 Q4: B/C need a length-dependent error, correctly excluded.)
- **Key balance:** every lesson has A/B/C/D × 3; unit total **A 21 · B 21 · C 21 · D 21**. **Verified** by tally.

**7 × 30-mark papers.** Mark totals: L01 3+3+4+4+5+6+3+2, L02 3+3+4+4+5+6+3+2, L03 3+3+4+5+4+6+3+2, L04 3+3+5+4+5+5+3+2, L05 4+6+4+3+2+3+5+3, L06 3+3+4+5+4+6+3+2, L07 3+3+4+4+5+6+3+2: **all = 30**. Model answers recomputed: L01 b5 0.600 s / 1.67 Hz / 10.5 / 3.0 cm / 120 cm, b6 1.75 s / 0.571 / 3.59 / 1.1 % / 0.38 % · L02 b4 50 / 0.628 s / 1.59 Hz / 2.0, b5 6.2 cm / 0.50 / 0.56 / 1.12 / 11.2 s, b6 `T²` 0.123–0.618, slope 1.235, `k = 32.0` · L03 b4 7.85 / 0.94 / 7.40 / 0.82 / 0.085 m, b5 6.2 / 7.8 cm, b6 ω 2.51, rows exact, `a/x = −6.32` · L04 b4 2.21 s / 110 s / 0.300 m / 0.909 Hz, b5 1.43 m / 5.88 s / 0.238 m, b6 bench data consistent with `g = 9.8` · L05 b1 rows exact (`l` 0.300–0.900, `T²` 1.210–3.629, `T²/l` 4.030–4.033), b3 4.03, b4 9.79, b8 −4.03 / 9.79 / 2.60 m · L06 b4 5.0 / 0.225 / 0.75 / 0.081 & 0.144 / 0.60, b5 0.080 J / 0.89 / 3.2 cm, b6 ratio 0.75, 0.042 J / 0.0024 J, `T_air` 0.710 s · L07 b5 1.78 Hz / 19.2 / 1.59 Hz / 17.2 km h⁻¹, b7 `k = 3.16 × 10⁴`, 6.2 cm. Home-investigation sample tables are consistent with `g ≈ 9.8`. **No errors.**

---

## [VERIFY] status

| # | Item | Status |
|---|---|---|
| 1 | Ridge spacing 2.5 m / okada f₀ ≈ 2 Hz | **Resolved as a labelled teaching model** (student-visible note; numbers internally consistent). |
| 2 | Local `g` near Ogbomoso | **Resolved** (≈ 9.78 m s⁻²; teacher note in L05; bench 9.79 accepted as a class value). |
| 3 | Per-topic mark weighting | **Resolved** (none published; qualitative stats only). |
| 4 | WAEC "no proofs" wording (01 § 1) | Open at map level only; no student impact (derivations marked "extension"). |
| 5 | Spiral-spring practical frequency (01 § 1) | Open at map level only; no student impact. |
| 6 | Term placement (01 § 1) | Open at map level only; no student impact. |
| 7 | YouTube content (01 § 10) | Not needed; nothing in the unit depends on it. |
| 8 | Syllabus copies vs official PDFs (01 § 10) | Low risk; all scope items are standard WAEC/NECO/JAMB SHM content and now all covered (bifilar added). |

`02-lesson.md` and `03-questions.md` contain **no** `[VERIFY]` tags. The remaining tags are in `01-topic-map.md` only, which is not rendered.

---

## Originality / copyright

- 7-word n-gram scan against `sources/studypipe-module3-simple-pendulum-notes.pdf` (`pdftotext`, 9 459 words): `01` = 0, `03` = 0, `02` = 3, all the numeric run "0 30 0 45 0 60 0 75 0 90" (Barton cone lengths), not prose. **No copying.**
- Source hooks (swings, wall clock, cathedral lamp) not reused; Ridge Road scenario and all questions original. No external national curriculum named. British spelling ("metre", "centre"; "meter" only for the instrument).

---

## Structure (5-phase inquiry, L1–L7, self-rating, movement break)

| Check | Result |
|---|---|
| Do Now: 4 retrieval cards with `from` + "Revisit" links (L02–L07) | ✓ all 7 |
| Wonder: StoryStage shots + Wonder Wall prompt with 4 seeds, before definitions | ✓ all 7 |
| Investigate: Sort game + virtual practical with method cards, results table, expected results, 5 locked analysis questions | ✓ all 7 (L04 sources of error missing: R2-2) |
| Make Sense: definitions/callouts, `.eq`, comparison table, Position Explorer, zoom | ✓ all 7 |
| Apply: 4 worked examples (each ≥ 3 steps), Bridge, 12-question quiz | ✓ all 7 |
| Reflect: 5 "I can" statements self-rated 1–4, exit ticket, blank-page recall, Part A + 30-mark Part B (locked) | ✓ all 7 |
| Teacher notes: 45–50 min active movement break + named competences | ✓ all 7; L1–L7 all used across the unit (L7 in L07) |
| Rule 5b | Hub explorer, L03 bench/zoom, **L04 zoom (now Paper.js `pendulum-forces`)**, L06 `damping-trace` panel, L07 zoom: Paper.js ✓. 3D only for spatial rigs ✓. Sorting DOM ✓. Lab data graphs `study-graph` (accepted). L05 zoom mini-graph kit unnamed (R2-4). |
| Mystery thread | Opens L01 Wonder, one clue per lesson, resolved in L07 Bridge with advice ✓ |

---

## Coverage matrix

| Objective (01 § 5) | Taught in | Tested by (Quiz & Assignment) |
|---|---|---|
| LO1 periodic / oscillatory / SHM; A, T, f, ω with units | L01 Sort, Make Sense; L02 Sort (incl. bifilar) | L01 Q1, Q4, Q6, Q10; L01 b1, b2; L02 Q3, Q12; L02 b2 |
| LO2 T, f, ω from timing; why many oscillations | L01 Investigate, WE1–4 | L01 Q2, Q3, Q5, Q7, Q8, Q9, Q11, Q12; L01 b3–b6, b8 |
| LO3 SHM condition; Hooke; T = 2π√(m/k) | L02 (all phases) | L02 Q1–Q12; L02 b1–b8 |
| LO4 reference circle; x, v, a; maxima and where | L03 (all phases) | L03 Q1–Q12; L03 b1–b8 |
| LO5 pendulum, small angles, ratios, mass/amplitude independence | L04 (all phases) | L04 Q1–Q12; L04 b1–b8 |
| LO6 pendulum practical, table, T²–l slope, precautions vs errors | L05 (all phases) | L05 Q1–Q12; L05 Paper 3 b1–b8 |
| LO7 KE ⇄ PE, E = ½kA², damping | L06 (all phases) | L06 Q1–Q12; L06 b1–b8 |
| LO8 free/damped/forced, resonance, Barton's, useful/harmful | L07 (all phases) | L07 Q1–Q12; L07 b1–b8 (b7 synoptic) |

All 8 exam traps in 01 § 8 and all 8 misconceptions in 01 § 9 are taught and tested. No gaps.

---

## § 7 Explainer video plan check

- `node scripts/video-picks.mjs topics/ss2-phy-simple-harmonic-motion` reports **no problems**; every score equals the sum of its reasons. Resolved picks: **lesson-02 (9), lesson-03 (9), lesson-07 (10)**; lesson-06 (8), 05 (6), 04 (5) dropped by `video_cap: 3`.
- Points are honest: "+3 multi-step" — every lesson has ≥ 2 worked examples with ≥ 3 steps; "+2 frequently examined" matches 01 § 8 (L06 rightly does not claim it); "+2 misconception" matches 01 § 9; L01 "−2 recall" fair. The L04 "−3 practical-led" is debatable but changes nothing (still cut by the cap).
- **Video plan: OK.** No change.

---

## Confirmed 3D & Interactive Scenes for Renderer

| Scene ID | Type | Target parts / Events |
|---|---|---|
| Hub `#lab-canvas` | 3D (`mass-spring` v2, `pendulum` v3, `ridge-road-props`) | modes `spring` / `pendulum` / `ridge`; crate lift-off when `A ≥ g/ω_d²` |
| Hub `#combo-curve` | 2D Paper.js | 5 tabs: x/v/a–t, a–x, energy–x, T²–l, A–f resonance |
| L01 `bench` / `zoom` | 3D `pendulum` v3 `trace`/`laws` + `mass-spring` v2 `period` + `okada` | `stopwatch`, `marker`, `bob`, `spring`; `l1:bench`, `l1:bench-done` |
| L02 `bench` / `zoom` | 3D `mass-spring` v2 `hooke`, `period`, `okada`, `forces`, `testtube` | `spring`, `pointer`, `slotted-mass`; `l2:bench-done` |
| L03 `bench` / `zoom` | 2D Paper.js `shm-kinematics-2d` `wheel`, `circle`, `graphs` | `lump`, `shadow`, `v-arrow`, `a-arrow`; `l3:bench-done` |
| L04 `bench` | 3D `pendulum` v3 `laws` | `bob`, `protractor`; `l4:bench-done` |
| L04 `zoom` | 2D Paper.js `pendulum-forces` + small 3D `pendulum` v3 context view | `mg`, tension, `mg cos θ`, `mg sin θ`, small-angle triangle, 50 g ↔ 100 g |
| L05 `bench` / `zoom` | 3D `pendulum` v3 `practical` (fault dropdown), `ceiling`; mini graph `study-graph` (R2-4) | `bob-centre`, `cork`, `ruler`; `l5:bench-done` |
| L06 `bench` / `zoom` | 3D `mass-spring` v2 `energy`, `damping`, `okada` cut-away + Paper.js `damping-trace` | `vane`, `total-bar`, piston; `l6:bench-done` |
| L07 `bench` | 3D `pendulum` v3 `barton` + `mass-spring` v2 `okada` + `ridge-road-props` | `driver`, `cone-3`, `rear-shock`, `crate`; `l7:bench-done` |
| L07 `zoom` | 2D Paper.js `shm-kinematics-2d` `resonance` | operating point, ζ slider, load toggle, threshold (R2-3) |
