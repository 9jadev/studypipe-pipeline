---
slug: ss2-phy-simple-harmonic-motion
title: Simple Harmonic Motion — Oscillations, the Loaded Spring, the Simple Pendulum and Resonance
subject: Physics
class: SS2
exams: [WAEC, NECO, JAMB]
lessons: 7
duration_min: 80
version: 1
---

# Multi-Lesson Unit Plan: Simple Harmonic Motion (`ss2-phy-simple-harmonic-motion`)

> Contract: `01-topic-map.md` (7 lessons, mystery *The Cracked Crates of Ridge Road*). All prose, dialogue, examples and data below are original. Story numbers are a constructed teaching model (not measured data) and are internally consistent; every figure was recomputed for this plan with `g = 9.8 m s⁻²` unless a lesson says otherwise.

### Story model — the numbers every lesson must reuse (do not change one without changing all)

| Quantity | Value | How it follows |
|---|---|---|
| Sprung rear load (rider + carrier + usual crates) | `m = 200 kg` | model |
| Rear spring constant | `k = 3.16 × 10⁴ N m⁻¹` | model |
| Angular frequency | `ω = √(k/m) = √158 = 12.57 rad s⁻¹ ≈ 4π` | |
| Natural frequency / period | `f₀ = ω/2π = 2.00 Hz`, `T₀ = 0.500 s` | |
| Timing check (Lesson 01) | 20 bounces in `10.0 s` → `T = 0.50 s` | `T = t/n` |
| Static sag | `mg/k = 200 × 9.8 ÷ 31 600 = 0.0620 m = 6.2 cm` | Hooke |
| Lift-off threshold at `f₀` | `ω²A ≥ g` → `A ≥ g/ω² = 9.8 ÷ 158 = 6.2 cm` | equals the sag |
| Ridge spacing | `d = 2.5 m` | model (see realism note) |
| Resonant speed | `v = d f₀ = 2.5 × 2.00 = 5.0 m s⁻¹ = 18 km/h` | `f = v/d` |
| With two extra crates (+50 kg in the model) | `m = 250 kg`, `ω = 11.24 rad s⁻¹`, `f₀ = 1.79 Hz`, `T₀ = 0.56 s`, `v = 4.47 m s⁻¹ ≈ 16 km/h`; new sag / lift-off threshold `7.8 cm` | |
| Matching pendulum | `l = gT₀²/4π² = 9.8 × 0.25 ÷ 39.48 = 0.0621 m ≈ 6.2 cm` (equals the sag because `m/k = sag/g`) | Lesson 04 |
| Ridge-induced base motion (for the resonance rig) | `Y = 1.0 cm` | model |
| Damping ratio | healthy shock absorber `ζ = 0.30`; leaking one `ζ = 0.05` | model |
| Response amplitude, 200 kg, leaking damper (`ζ = 0.05`) | 10 km/h `1.4 cm` · 14 km/h `2.5 cm` · 16 km/h `4.4 cm` · **18 km/h `10.0 cm` (> 6.2 cm → lift-off)** · 20 km/h `3.9 cm` · 30 km/h `0.6 cm` | base-excitation response `A = Y√(1 + (2ζr)²)/√((1 − r²)² + (2ζr)²)`, `r = f/f₀` |
| Same, healthy damper (`ζ = 0.30`) | peak about `2.0 cm` near 16–18 km/h — never near 6.2 cm | |
| 250 kg, leaking damper | `10.0 cm` at 16 km/h (> 7.8 cm → lift-off); 18 km/h only `3.7 cm` | |

The response formula is for the kit and the teacher notes only; students never need it. Students use: `f = v/d`, resonance when `f = f₀`, lift-off when `ω²A ≥ g`.

---

## Part I: Unit Welcome Hub (`html/index.html`)

### 1. Hero & 3D Hero Lab
- **Eyebrow:** `SS2 PHYSICS · WAEC · NECO · JAMB · PAPER 3 PRACTICAL`
- **Display title:** Simple Harmonic Motion: *The Cracked Crates of Ridge Road*
- **Lede:** Dayo's okada carries Hajia Ramatu's eggs over the same row of drainage ridges every morning. At a crawl the trays survive; at a brisk pace they survive; but at one in-between speed the back of the bike pumps up and down until the crates leap off the carrier and crack. Time a bounce, pull a spring, swing a pendulum, measure `g` in your own lab — and work out the exact speed Dayo must never ride.
- **CTAs:** `Start guided tour (en-NG) ▷` (`data-tour`) · `Begin Lesson 1 →` (`lessons/lesson-01/index.html`)
- **Hero meta:** `7 lessons · ~9 h 20 min` · `7 virtual labs + 7 zooms` · `84 quiz questions + 7 × 30-mark papers` · `Paper 3: pendulum T²–l, loaded spring`
- **3D Hero Lab (`#lab-canvas`, `window.StudyLab`; one retort stand, three switchable rigs):**
  - `spring` (kit `mass-spring` v2): a helical spiral spring with a slotted-mass hanger, pointer and metre rule. Sliders `m` (`0.05–0.50 kg`), `k` (`10–60 N m⁻¹`). The spring visibly stretches with load and bounces; HUD shows `x₀ = mg/k`, `T = 2π√(m/k)`, `f`.
  - `pendulum` (kit `pendulum` v3): split cork in a clamp boss, thread, brass bob, chalk rest mark, stopwatch. Sliders `l` (`0.20–1.20 m`), `g` (`Earth 9.8 / Moon 1.6`), mass toggle (`50 / 100 g`), angle (`5°–30°`). HUD: `T = 2π√(l/g)`, live elapsed time.
  - `ridge` (kits `mass-spring` okada variant + `ridge-road-props`): the okada's rear coil-over shock on a short stretch of ridges with a crate on the carrier. Sliders: road speed `v` (`5–35 km/h`), load (`200 / 250 kg`), damper (`healthy / leaking`). HUD: forcing `f = v/d`, `f₀`, live amplitude `A`, threshold `g/ω²` computed with the **driving** angular frequency `ω = 2πf = 2πv/d` (at resonance this equals `ω₀`, giving 6.2 cm); the crate visibly lifts off (and a red "CRACK" flag shows) when `A ≥ g/ω²`. Uses the story model table above.
  - HUD readouts common to all modes: mode, `T`, `f`, `ω`, amplitude.

### 2. Marquee (12 terms)
oscillation · amplitude `A` · period `T = t/n` · frequency `f = 1/T` · angular frequency `ω = 2πf` · restoring force `F = −kx` · SHM `a = −ω²x` · `x = A sin ωt` · `v = ω√(A² − x²)` · pendulum `T = 2π√(l/g)` · spring `T = 2π√(m/k)` · resonance `f = f₀`

### 3. Unit Mystery Case File (`#mystery`)
- **Narrative:** Outside Ogbomoso, Hajia Ramatu packs trays of eggs into crates every dawn, and Dayo rides them to the town market on his okada. Halfway there, the laterite road crosses a run of low concrete drainage ridges laid by the council, all about the same distance apart. Her daughter Zainab, an SS2 student, has kept a notebook of the losses, and the pattern is strange: slow trips are fine, fast trips are fine, but trips at one middle speed end in broken eggs. Her classmate Tunde is sure that faster always means worse. Their physics teacher, Mrs Okafor, says the bike is behaving like a mass on a spring — and that physics can name the dangerous speed before another tray is lost.
- **Realism note (visible to students, `.case-note` under the clue cards):** *Story numbers are a teaching model: chosen to be realistic and easy to work with, not measured on a real okada or road.* (Teachers: 200 kg on the rear spring, 2 Hz bounce, ridges 2.5 m apart; real suspensions and roads vary.)
- **Clue cards (`.case-card`, 4):** crates whole at 10 km/h and at 30 km/h · crates crack at about 18 km/h · with two extra crates the bad speed falls to about 16 km/h · Mallam Sule finds the rear shock absorber weeping oil.
- **Exam-weight stats (`.stat`, qualitative):** `Marks at stake`: SHM theory and the pendulum practical recur across WAEC/NECO Papers 1–3 · `Exam boards`: WAEC · NECO · JAMB · `Core laws`: `a = −ω²x`, `T = 2π√(l/g)`, resonance `f = f₀`. No numeric weighting is shown (none is published per topic).

### 4. Lesson Journey (`#journey`)
Seven `<article class="lesson reveal is-live">` cards linking to `lessons/lesson-01/index.html` … `lesson-07/index.html`, each `80 min`, with tags and a one-line promise:
1. **Things That Repeat** — put a number on a bounce (`T`, `f`, `ω`). Tags: `periodic` `timing` `practical`.
2. **The Pull Back to the Middle** — restoring force, the SHM condition and the loaded spring. Tags: `Hooke` `T = 2π√(m/k)` `graph`.
3. **SHM as a Circle's Shadow** — when exactly do the crates leave the carrier? Tags: `x, v, a` `reference circle` `2D`.
4. **The Simple Pendulum** — does a heavier bob or a bigger swing change the timing? Tags: `T = 2π√(l/g)` `ratios` `myths`.
5. **WAEC Practical: Finding g** — the Paper 3 pendulum, end to end. Tags: `Paper 3` `T²–l graph` `precautions`.
6. **Energy in SHM and Damping** — where does the bounce energy go? Tags: `KE ⇄ PE` `½kA²` `shock absorber`.
7. **Forced Vibration and Resonance** — solve the Ridge Road case. Tags: `Barton's pendulums` `f = v/d` `verdict`.
- **Thread note (`.thread-note`):** every lesson's Do Now pulls cards from earlier lessons, and every lesson hands Zainab one more clue; by Lesson 07 the students have the period, the spring constant, the lift-off rule, the local `g` and the damping story needed to name the dangerous speed.

### 5. Explorer (`#explorer`) — 2D Paper.js (`welcome-explorer.js`, `#combo-canvas` / `#combo-curve` + `#combo-marker`)
Five `.combo-tab` buttons (the topic map asks for five; the renderer extends the usual four-tab pattern). Each tab redraws a Paper.js curve; the marker runs along it; detail card fields `#combo-title`, `#combo-jump` (link to the lesson), `#combo-eq`, `#combo-ind`, `#combo-why`.
1. *x, v, a against t* — three sine curves on one time axis: `x = A sin ωt`, `v` a quarter-cycle ahead (`ωA cos ωt`), `a` the mirror image of `x` (`−ω²A sin ωt`). Jump → Lesson 03. Why: speed peaks where displacement is zero.
2. *a against x* — a straight line through the origin with negative gradient `−ω²`. Jump → Lesson 02. Why: this straight line *is* the definition of SHM.
3. *Energy against x* — PE parabola `½kx²` opening upwards, KE inverted parabola, flat total line `½kA²`; curves cross at `x = ±A/√2`. Jump → Lesson 06.
4. *T² against l* — a straight line through the origin, gradient `4π²/g ≈ 4.03 s² m⁻¹`. Jump → Lesson 05.
5. *Amplitude against driving frequency* — resonance peak at `f₀ = 2.0 Hz`; a damping toggle lowers and widens the peak (`ζ = 0.05` vs `0.30`, using the model formula). Jump → Lesson 07.

### 6. Mastery (`#master`)
- **Outcomes (`01`–`06`):** classify and measure oscillations · state and use the SHM condition · use `x`, `v`, `a` relations and where each peaks · use both period formulas in ratio problems · carry out the pendulum practical and deduce `g` · explain energy, damping and resonance with real examples.
- **6 calculation archetypes (`#archetypes`, StudyMath chains):**
  1. Timing: `T = t/n`, `f = 1/T`, `ω = 2πf = 2π/T`.
  2. SHM kinematics: `x = A sin ωt`, `v = ω√(A² − x²)`, `v_max = ωA`, `a = −ω²x`, `a_max = ω²A`.
  3. Loaded spring: `F = kx`, `T = 2π√(m/k)`, `T ∝ √m`, `k = 4π²/slope` of `T²`–`m`.
  4. Simple pendulum: `T = 2π√(l/g)`, `T₂/T₁ = √(l₂/l₁)`, seconds pendulum `l ≈ 0.99 m`, change of `g`.
  5. Practical `g`: `g = 4π²/slope` of `T²`–`l`; ceiling-height variant (negative slope; intercept gives the height).
  6. Energy and resonance: `E = ½kA² = ½mω²A²`, `KE = ½mω²(A² − x²)`, `PE = ½mω²x²`; resonant speed `v = d f₀`.
- **Formula strip (`.formula-strip`):** `a = −ω²x` · `ω = 2πf` · `v = ω√(A² − x²)` · `T = 2π√(m/k)` · `T = 2π√(l/g)` · `E = ½kA²` · `f = f₀`
- **Myths (`#myths`, 3 flip cards):**
  1. *"A heavier bob swings more slowly."* → For a simple pendulum, mass cancels out; only `l` and `g` set the period (small swings).
  2. *"It moves fastest at the ends, where it turns round hardest."* → At the ends it is momentarily still; that is where **acceleration** is greatest. **Speed** is greatest at the middle, where acceleration is zero.
  3. *"Resonance means vibrating very fast."* → Resonance means the push arrives at the system's own natural frequency, so amplitude builds; the okada's resonance is only 2 Hz.

### 7. Method (`#method`) & Kit (`#kit`)
The 5-step inquiry loop (1. Wonder → 2. Investigate → 3. Make sense → 4. Apply → 5. Reflect), the "What's inside every lesson" list (Do Now cards, 3D story, Wonder Wall, sort game, virtual lab, zoom, worked examples, the Bridge, 12-question quiz, self-rating, 30-mark assignment), finale CTA to Lesson 1.

### 8. Spaced Retrieval Bank (`assets/js/retrieval-bank.js`)
`l01` … `l07`, each with `donow` (4 cards with `from`), `quiz` and `recall` arrays, exactly as listed in each lesson's Phase 0 and Phase 5. Cards in `l02`–`l07` carry *"Revisit Lesson X →"* links.

### 9. Kit Plan (for `lesson-renderer` / `kit-builder`)

| Kit | Status | Needed by | What must be added |
|---|---|---|---|
| `mass-spring` → **v2** | upgrade (v1 below HeartKit v2 fidelity) | Hub, L01, L02, L06, L07 | True helical spring (`CatmullRomCurve3` helix + `TubeGeometry`) whose pitch stretches with load; slotted-mass hanger (50 g discs, slotted), pointer on a vertical metre rule with readable cm scale; clamp + retort stand. Modes: `hooke` (add masses → static extension `x₀ = mg/k`; emits reading), `period` (bounce, built-in stopwatch, `n` oscillations, `T²`–`m`), `forces` (restoring-force arrow ∝ displacement, always towards equilibrium; velocity and acceleration arrows), `energy` (KE / PE / total bars), `damping` (card vane in air / water beaker / oil beaker; amplitude decays by a ratio per cycle; per-cycle amplitude events), `testtube` (weighted test-tube bobbing upright in a beaker of water, lead-shot visible), `okada` (rear coil-over shock: coil around a damper body with cut-away piston, orifices and oil; params `m`, `k`, `zeta`, `leak`; crate on carrier lifts off when `A ≥ g/ω_d²` with `ω_d = 2πv/d` (equal to `g/ω₀²` at resonance); driven by ridges with forcing `f = v/d` using the story-model response formula). |
| `pendulum` → **v3** | upgrade | Hub, L01, L04, L05, L06, L07 | Proper split-cork halves (two `LatheGeometry`/extruded half-cylinders gripping the thread) in a clamp boss; chalk/pin rest marker; metre rule with readable scale and a set-square to the bob centre; bob with visible centre line (thread + radius callout); stopwatch with lap; repeat-timing events (`t₁`, `t₂`); modes `laws` (one variable at a time: mass, angle with exact large-angle period, length, `g`), `trace` (ghost markers A → O → B → O → A, phase labels), `forces` (context view only for the L04 zoom: swinging bob and thread; the force diagram itself is the Paper.js `pendulum-forces` scene), `practical` (full Paper 3 bench; `fault` param: `count-from-1`, `time-from-extreme`, `length-to-top`, `wide-angle`, `conical`, `draught`), `ceiling` (height `y` of bob centre above floor, ceiling `H`), `energy` (KE / PE bars, height above lowest point), `barton` (heavy driver bob + 5 paper-cone pendulums on a taut cord, steady-state amplitudes from the driven-oscillator model). |
| `shm-kinematics-2d` → **Paper.js port** | port + extend (now raw Canvas 2D; rule 5b) | Hub explorer, L01 (inline phase strip), L03, L04, L06, L07 | Rebuild on `window.paper`. Scenes: `wheel` (side view of a rotating okada wheel with a mud lump; ground "shadow" sliding in SHM; radius line, angle `ωt`, live `x`, `v`, `a` arrows on the shadow), `circle` (abstract reference circle + projection + synced `x/v/a`–`t` traces), `graphs` (three traces only), `energy` (parabolas vs `x`), `damping-trace` (decaying sine for light/heavy/critical), `resonance` (amplitude–frequency curve with damping slider and a live operating-point marker), `pendulum-forces` (L04: thread at angle `θ` with arc, arrows `mg`, tension, `mg cos θ`, `mg sin θ`, shaded small-angle triangle `x`/`l`, 50 g ↔ 100 g swap: force arrows double, acceleration arrow unchanged). |
| `ridge-road-props` | **new** story kit | Story L01–L07, Hub `ridge` | Okada (frame, tank, seat, rear carrier with egg crates and trays), Dayo rider pose, drainage ridges on laterite road (evenly spaced, model 2.5 m), Hajia Ramatu's farm gate and poultry pen, Mallam Sule's roadside shed (bench, oil-stained shock absorber, tools), the school lab dressing (retort stands, Barton frame). Animations: rear-end bounce at a set frequency/amplitude, crate lift and crack. |
| `study-graph` | reuse (no gap) | L02, L05, L06, L07 | `T²`–`m` and `T²`–`l` best-fit lines (`fit: "origin"` / `fit: "line"`), ceiling variant with negative slope, amplitude-decay points, resonance curve `fn`. |
| `math-solver` | reuse | all lessons | LaTeX worked-example chains. |

---

## Part II: The Seven Lessons

Shared lesson shell (all seven): top nav with breadcrumb `← Unit Overview` (`../../index.html`), lesson switcher `L1`–`L7`, prev/next footer; phases `#donow`, `#story`, `#wonder`, `#sort`, `#practical`, `#concepts`, `#zoom`, `#examples`, `#bridge`, `#quiz`, `#reflect`, `#assignment`, `#teacher-notes`. Story sets: **Set 1** Ridge Road (laterite road with ridges, okada, farm gate; Sule's shed dressed into it) and **Set 2** the school physics laboratory. Cast keys: `zainab`, `tunde`, `okafor`, `dayo`, `ramatu`, `sule`.

---

### LESSON 01: Things That Repeat — Periodic Motion, Oscillation and Its Measures
- **Folder:** `html/lessons/lesson-01/` · **Duration:** 80 min · **Competences:** L1, L2, L4, L5
- **Guiding question:** How can we put a number on a bounce?
- **Objectives:**
  1. **01** · Tell periodic motion, oscillation and non-repeating motion apart with Nigerian examples.
  2. **02** · Define one complete oscillation, amplitude `A`, period `T`, frequency `f` and angular frequency `ω`, with SI units.
  3. **03** · Find `T`, `f` and `ω` from timing data using `T = t/n`, `f = 1/T`, `ω = 2πf`.
  4. **04** · Explain why many oscillations are timed instead of one, and where the stopwatch should start.
  5. **05** · Find the distance covered in whole periods from the amplitude (`4A` per cycle).

#### 0. Do Now (5 min, `from: 0`)
1. **Q:** A bus covers 120 m in 8.0 s at steady speed. Find its speed. **A:** `v = d/t = 120 ÷ 8.0 = 15 m s⁻¹`.
2. **Q:** Express 0.25 s in milliseconds and 2 minutes 5 seconds in seconds. **A:** `250 ms`; `125 s`.
3. **Q:** What is "reaction time" when you use a stopwatch? **A:** The short delay between seeing an event and pressing the button, often a few tenths of a second; it adds an error to every start and stop.
4. **Q:** What does "the reciprocal of 4" mean, and what is it? **A:** One divided by the number: `1/4 = 0.25`.

#### 1. Wonder · Story & Wonder Wall (10 min)
- **3D Story (`story.js`, scene key `story`), Set 1 then Set 2:**
  1. `shot: [[0, 2.4, 8.0], [0, 1.0, 0]]`, `who: "ramatu"` — at the farm gate, holding a cracked tray: "Third time this month, Zainab. Dayo swears he rode carefully." `caption: "Hajia Ramatu's farm, outside Ogbomoso."`
  2. `shot: [[4, 1.6, 5], [0, 0.6, 0]]`, `who: "dayo"` — on the parked okada: "Slow, nothing breaks. Fast, nothing breaks. But somewhere in the middle, the back starts to jump like a goat." The rear of the bike bobs gently as he shifts his weight.
  3. `who: "tunde"` — "Simple. The faster you ride, the more it bounces. Ride slowly every time and finish."
  4. `who: "zainab"` — she presses down on the carrier and lets go; it bobs up and down several times. "Look — it bounces at its own rhythm even when the bike is standing still."
  5. `shot: [[0, 2.2, 6.5], [0, 1.2, 0]]` (Set 2), `who: "okafor"` — beside a pendulum and a loaded spring: "Before we argue about speed, let's measure that rhythm. Anything that repeats can be timed."
  6. `who: "okafor"` — "Count twenty bounces, not one. Then we'll know how long one takes, and how many happen in a second."
- **Transcript (`#story-text`):** collapsible full dialogue.
- **Wonder Wall (`#wonder`) prompt:** *If you had only a phone stopwatch, how would you measure how long one bounce of the okada takes — as accurately as possible?*
- **Seed notes (4):** "Time one bounce and press very fast? (Tunde)" · "Film it and count frames (Zainab)" · "Does the bounce slow down as it dies away? (Dayo)" · "Is a bounce the same thing as a swing? (Hajia Ramatu)".

#### 2. Investigate · Sort Game & Virtual Practical (25 min)
- **2A Sort (`#sort`, `sort-dnd.js`):** *Does it repeat, and does it go to-and-fro?* Bins (3): `osc` (oscillation: repeats, to-and-fro about a rest position) · `periodic` (repeats at regular intervals but goes round, not to-and-fro) · `non` (does not repeat). Items (10):
  - playground swing in a compound → `osc` (to and fro through the lowest point)
  - okada carrier bobbing on its spring → `osc`
  - plucked guitar string → `osc`
  - weighted test-tube bobbing upright in water → `osc`
  - ceiling-fan blade → `periodic` (comes round again, but circles)
  - minute hand of a wall clock → `periodic`
  - the Earth spinning once a day → `periodic`
  - ripe mango falling from a tree → `non`
  - a car speeding up along the expressway → `non`
  - a ball rolling down a slope and away → `non`
  Each item shows a one-line *why* after checking.
- **2B Virtual Practical (`#practical`, scene key `bench`, 3D Three.js — kits `pendulum` v3 `trace`/`laws` + `mass-spring` v2 `period`):**
  - **Method cards (4):**
    1. Displace the pendulum bob (or pull the loaded spring down) a small distance and release; let it settle into a steady swing.
    2. Start the stopwatch as the bob passes the rest mark, counting "zero" — not "one".
    3. Count 20 complete oscillations (back to the mark, moving the same way) and stop the watch.
    4. Calculate `T = t/20`, `f = 1/T`, `ω = 2π/T`; repeat the timing and take the mean.
  - **Scene (`bench`):** `SceneKit.createStage`; toggle rig `pendulum` / `spring` / `okada` (kit `mass-spring` v2 `okada`, parked bike, press and release, 200 kg). Named parts: `bob`, `thread`, `cork`, `marker`, `stopwatch`, `spring`, `hanger`, `pointer`, `ruler`. Controls: rig, **Release**, **Start / Stop** stopwatch (manual, with a simulated reaction delay of 0.1–0.3 s), count of oscillations (`1`, `10`, `20`), **Reset**. A counter overlay ticks each pass of the marker. Emits `l1:bench` per timing, `l1:bench-done` after both rigs timed with `n = 20`.
  - **Results table (`#results-table`):** Rig · `n` · `t / s` (2 d.p.) · `T = t/n / s` (3 s.f.) · `f / Hz` (3 s.f.) · `ω / rad s⁻¹` (3 s.f.).
  - **Expected results (`#expected`):** pendulum `l = 0.80 m`: `t = 35.90 s` for 20 → `T = 1.80 s`, `f = 0.557 Hz`, `ω = 3.50 rad s⁻¹`. Spring `m = 0.20 kg`, `k = 24.5 N m⁻¹`: `t = 11.35 s` for 20 → `T = 0.568 s`, `f = 1.76 Hz`, `ω = 11.1 rad s⁻¹`. A note shows that timing `n = 1` with a 0.2 s reaction error is wrong by about 11 % for the pendulum, but timing 20 cuts that to about 0.6 %. The interactive table accepts `f` within ±0.001 Hz (`1/1.80 = 0.556 Hz` from the rounded `T`, `0.557 Hz` from the unrounded `1.795 s`).
  - **Precautions (past tense):** timing started and stopped as the bob passed the rest mark, where it moves fastest and the instant is sharpest · counting began at "zero" · 20 oscillations were timed and the timing repeated · the bob was displaced only slightly.
  - **Sources of error:** reaction time at start and stop (shared out over 20 cycles) · miscounting oscillations · air resistance slowly reducing the amplitude (it does not noticeably change `T`).
  - **Analysis questions (5, locked):** Why time 20 oscillations rather than 1? · Why start counting at zero? · Why start at the rest mark rather than at an end? · The amplitude shrank during timing; did `T` change? (no, not noticeably) · Which rig had the higher frequency, and how do you know from `T`?

#### 3. Make Sense · Concepts & 3D Zoom (15 min)
- **Definitions (`#concepts`):** *periodic motion* repeats itself in equal intervals of time. *Oscillation* (vibration) is periodic to-and-fro motion about a fixed rest (equilibrium) position. *One complete oscillation* is the motion from a point back to the same point, moving in the same direction (for a pendulum: A → O → B → O → A). *Amplitude `A`* is the greatest displacement from the rest position (m). *Period `T`* is the time for one complete oscillation (s). *Frequency `f`* is the number of complete oscillations per second (Hz = s⁻¹). *Angular frequency `ω`* is `2π` times the frequency (rad s⁻¹).
- **Equations (`.eq`):** `T = t/n` · `f = 1/T` · `ω = 2πf = 2π/T` · distance in one period `= 4A`.
- **`.callout.big`:** *amplitude* is measured from the middle to one end — not from end to end.
- **Comparison table (`#props-table`):** periodic vs oscillatory vs non-repeating — repeats? to-and-fro? fixed rest position? example.
- **Position Explorer (`#pos-explorer`):** pins along one swing of the `T = 1.80 s` pendulum: A (`t = 0`), O (`0.45 s`), B (`0.90 s`), O (`1.35 s`), A (`1.80 s`); each shows the fraction of a cycle completed and the direction of motion.
- **3D Zoom (`#zoom`, scene key `zoom`, kit `pendulum` v3 `trace`):** slow-motion pendulum leaving glowing ghost markers at A, O, B, O, A with the cycle fraction (`0`, `¼`, `½`, `¾`, `1`); an amplitude ruler from O to A; a split-screen stopwatch showing a 0.2 s reaction error on 1 swing vs 20 swings. Counters: elapsed `t`, oscillations counted, `T` estimate, % error.

#### 4. Apply (20 min)
- **Worked Example 1 (the okada's rhythm — 3 steps):** Zainab counts 20 bounces of the loaded, parked okada in `10.0 s`. Find `T`, `f` and `ω`.
  1. `T = t/n = 10.0 ÷ 20 = 0.50 s`.
  2. `f = 1/T = 1 ÷ 0.50 = 2.0 Hz`.
  3. `ω = 2πf = 2 × 3.142 × 2.0 = 12.6 rad s⁻¹`.
  - **Answer:** `T = 0.50 s`, `f = 2.0 Hz`, `ω ≈ 12.6 rad s⁻¹`.
  - **Model note (`.note`):** *Story numbers are a teaching model, not real measurements.*
- **Worked Example 2 (the swing — 3 steps):** A child on a compound swing makes 15 complete oscillations in `42.0 s`. Find the period, frequency and angular frequency.
  1. `T = 42.0 ÷ 15 = 2.80 s`.
  2. `f = 1 ÷ 2.80 = 0.357 Hz`.
  3. `ω = 2π ÷ 2.80 = 6.283 ÷ 2.80 = 2.24 rad s⁻¹`.
  - **Answer:** `T = 2.80 s`, `f = 0.357 Hz`, `ω = 2.24 rad s⁻¹`.
- **Worked Example 3 (why 20 swings — 3 steps):** A student's reaction error is `0.2 s`. A pendulum's true period is `1.80 s`. Compare the percentage error from timing one oscillation with that from timing 20.
  1. One oscillation: `% error = (0.2 ÷ 1.80) × 100 = 11.1 %`.
  2. Twenty oscillations take `20 × 1.80 = 36.0 s`; the same `0.2 s` error gives `(0.2 ÷ 36.0) × 100 = 0.56 %`.
  3. Ratio: `11.1 ÷ 0.56 ≈ 20`, so the error is shared out twenty times.
  - **Answer:** about `11 %` vs about `0.6 %`.
- **Worked Example 4 (amplitude and distance — 3 steps):** A bob swings between two points `12.0 cm` apart with frequency `0.50 Hz`. Find the amplitude, the period and the distance the bob travels in `10 s`.
  1. `A = 12.0 ÷ 2 = 6.0 cm`.
  2. `T = 1/f = 1 ÷ 0.50 = 2.0 s`, so `10 s` is `10 ÷ 2.0 = 5` complete oscillations.
  3. Each oscillation covers `4A = 24 cm`, so distance `= 5 × 24 = 120 cm = 1.20 m`.
  - **Answer:** `A = 6.0 cm`, `T = 2.0 s`, distance `1.20 m`.
- **The Bridge (`#bridge`):** the student uses the bench's okada mode (parked bike, press and release) to time 1 bounce, then 20 bounces. One-bounce timings scatter (0.3–0.7 s); 20 bounces give `10.0 s` consistently. Verdict (`.vt-verdict`): *the okada's rear has its own steady rhythm, `T = 0.50 s`, `f = 2.0 Hz` — whatever causes the crash must be connected with this number.* `.callout.big#big-idea`: *an oscillation is measured by its period and frequency, `f = 1/T`; time many cycles to beat reaction time.*
- **Quiz (`#quiz`):** 12 questions from `03-questions.md` § Lesson 01.

#### 5. Reflect & Assignment (10 min + 40 min home)
- **I can (1–4):** tell oscillation from other periodic motion · define `A`, `T`, `f`, `ω` with units · calculate `T`, `f`, `ω` from timing data · explain why 20 oscillations are timed from the rest mark · find distance from amplitude.
- **Exit ticket (2 marks):** A talking-drum membrane vibrates 600 times in 2.0 s. Find `f` and `T`. (`f = 600 ÷ 2.0 = 300 Hz`; `T = 1 ÷ 300 = 3.3 × 10⁻³ s`.)
- **Blank-page recall (`#recall-box`):** periodic vs oscillation · one complete oscillation · `A` middle-to-end · `T = t/n` · `f = 1/T` · `ω = 2πf` · count from zero at the rest mark.
- **Assignment:** Part A — tie a stone to a 1 m thread, time 20 swings twice, and find `T` and `f`; repeat with the thread halved and note which changed. Part B — 30 marks from `03-questions.md` § Lesson 01 (locked solutions).
- **Teacher notes (`#teacher-notes`):** timetable 0–5 Do Now · 5–15 Wonder · 15–40 Investigate · 40–45 results discussion · **45–50 movement break** ("human pendulum": students sway arms in time to a teacher's clap, then double the clap rate and feel the frequency change) · 50–65 Make Sense · 65–75 Apply · 75–80 Reflect. Competences: L1 (predict, then test timing methods), L2 (farm-to-market trade; local oscillators like the swing and talking drum), L4 (tables, units), L5 (virtual stopwatch). Support: give the counting script "0, 1, 2…"; stretch: estimate the frequency of a ceiling fan's blades passing a point.

---

### LESSON 02: The Pull Back to the Middle — Restoring Force, the SHM Condition and the Loaded Spring
- **Folder:** `html/lessons/lesson-02/` · **Duration:** 80 min · **Competences:** L1, L4, L5, L6
- **Guiding question:** What makes a motion *simple harmonic*, and why do extra crates slow the bounce?
- **Objectives:**
  1. **01** · State Hooke's law and find a spring constant `k` from load and extension.
  2. **02** · Explain restoring force and state the SHM condition: acceleration proportional to displacement and directed towards the equilibrium position (`a = −ω²x`).
  3. **03** · Show that for a loaded spring `a = −(k/m)x`, so `ω² = k/m` and `T = 2π√(m/k)`.
  4. **04** · Find `k` from the slope of a `T²`–`m` graph.
  5. **05** · Solve ratio problems with `T ∝ √m` and explain why more load lowers the bounce frequency.

#### 0. Do Now (`from: 1`)
1. **Q:** 20 oscillations take `12.0 s`. Find `T` and `f`. **A:** `T = 0.60 s`; `f = 1.67 Hz`. *(Revisit Lesson 1 →)*
2. **Q:** Define amplitude. **A:** The greatest displacement from the equilibrium position.
3. **Q:** Write `ω` in terms of `T`. **A:** `ω = 2π/T`.
4. **Q:** What force does the Earth exert on a 0.50 kg mass (`g = 9.8 m s⁻²`)? **A:** `W = mg = 4.9 N`.

#### 1. Wonder
- **3D Story, Set 1 then Set 2:**
  1. `shot: [[3.5, 1.8, 5.5], [0, 0.7, 0]]`, `who: "dayo"` — loading two extra crates: "Hajia wants more eggs today. Heavier load, steadier ride — that's what my oga used to say."
  2. `who: "tunde"` — "Exactly. Heavy things don't bounce."
  3. `who: "zainab"` — she presses the loaded carrier and times it: the bounce looks lazier. "It's still bouncing — just slower."
  4. `who: "okafor"` (Set 2) — hangs slotted masses on a spiral spring; the pointer drops step by step. "Every extra 50 grams pulls it down by the same amount. That even pull-back is the secret."
  5. `who: "okafor"` — she pulls the hanger down and releases it. "The further you pull, the harder the spring pulls back — always towards the middle. That is what makes the motion simple harmonic."
- **Wonder Wall prompt:** *Two extra crates are on the carrier. Will the okada bounce faster, slower or at the same rhythm? Why?* Seeds: "Heavier = steadier (Tunde)" · "Heavier = slower bounce (Zainab)" · "Does a stiffer spring bounce faster? (Dayo)" · "Is the pull of the spring the same at every point? (Hajia Ramatu)".

#### 2. Investigate
- **2A Sort (`#sort`):** *Is it simple harmonic?* Bins (3): `shm` (restoring force ∝ displacement, towards the middle) · `periodic-not-shm` (repeats, but not SHM — no restoring force proportional to displacement) · `not-osc` (no restoring force at all). Items (11): mass bobbing on a spiral spring → shm · a bar hung by two parallel threads (bifilar suspension) twisted slightly and released → shm · small-angle simple pendulum → shm · weighted test-tube bobbing upright in water → shm · prong of a struck tuning fork → shm · okada rear on its coil spring (gentle bounce) → shm · ball bouncing on a concrete floor → periodic-not-shm (force acts only at impact) · ball rolling to and fro in a V-shaped trough → periodic-not-shm (constant slope force, not ∝ x) · ceiling-fan blade → periodic-not-shm (circles) · mango falling → not-osc · bus moving at steady speed → not-osc.
- **2B Virtual Practical (`#practical`, scene key `bench`, 3D — kit `mass-spring` v2 `hooke` then `period`):**
  - **Method cards (4):**
    1. Hang the spiral spring from the clamp, attach the empty hanger and record the pointer reading on the metre rule.
    2. Add 50 g slotted masses one at a time up to 250 g; record each pointer reading and find the extension `x`.
    3. For each load, pull the hanger down slightly, release, and time 20 oscillations (twice).
    4. Tabulate `m`, `x`, `t`, `T`, `T²`; plot `F` against `x` (slope `k`) and `T²` against `m` (slope `4π²/k`).
  - **Scene (`bench`):** parts `spring`, `hanger`, `slotted-mass`, `pointer`, `ruler`, `clamp`, `stopwatch`. Controls: rig `lab spring` / `okada` (kit `mass-spring` v2 `okada`, parked, press and release; load `200 / 250 kg`), **Add 50 g / Remove 50 g**, mode toggle `Hooke` / `Time it`, **Pull & release**, **Time 20**, **Reset**. The helix visibly stretches (pitch increases) as mass is added. Model `k = 24.5 N m⁻¹` (light spring, its own mass ignored). Emits `l2:bench`, `l2:bench-done` after 5 loads timed.
  - **Results table (`#results-table`):** `m / kg` · `F = mg / N` (3 s.f.) · `x / cm` (1 d.p.) · `t / s` for 20 (2 d.p.) · `T / s` (3 s.f.) · `T² / s²` (3 s.f.).
  - **Expected results (`#expected`, `study-graph`):**

    | m / kg | F / N | x / cm | t / s | T / s | T² / s² |
    |---|---|---|---|---|---|
    | 0.050 | 0.490 | 2.0 | 5.68 | 0.284 | 0.0806 |
    | 0.100 | 0.980 | 4.0 | 8.03 | 0.401 | 0.161 |
    | 0.150 | 1.47 | 6.0 | 9.83 | 0.492 | 0.242 |
    | 0.200 | 1.96 | 8.0 | 11.35 | 0.568 | 0.322 |
    | 0.250 | 2.45 | 10.0 | 12.69 | 0.635 | 0.403 |

    `F`–`x`: straight line through the origin, slope `2.45 ÷ 0.100 = 24.5 N m⁻¹`. `T²`–`m`: straight line through the origin (`fit: "origin"`), slope `0.403 ÷ 0.250 = 1.61 s² kg⁻¹`, so `k = 4π² ÷ 1.61 = 24.5 N m⁻¹` — the two methods agree. `T` and `T²` are worked from the unrounded times, so squaring the displayed `T` can differ in the last digit (`0.2839 s → 0.0806 s²`; `8.028 s → 0.401 s`).
  - **Precautions (past tense):** the pointer was read with the eye level with it to avoid parallax · the spring was not loaded beyond its elastic limit (it returned to its original reading when unloaded) · the mass was pulled down only slightly so it moved vertically without swinging · timing was from the equilibrium position and repeated.
  - **Sources of error:** the spring's own mass (makes `T` slightly longer than `2π√(m/k)`) · sideways swaying of the load · reaction time.
  - **Analysis questions (5, locked):** Why does equal added mass give equal added extension? · What does the slope of `F`–`x` give? · Why is `T²`, not `T`, plotted against `m`? · How does `k` follow from the `T²`–`m` slope? · What would a stiffer spring do to the `T²`–`m` line? (smaller slope).

#### 3. Make Sense
- **Hooke's law (`.callout`):** within the elastic limit, the extension of a spring is directly proportional to the stretching force: `F = kx`; `k` (N m⁻¹) is the force per metre of extension.
- **Restoring force & SHM condition (`.callout.big`):** displace a mass from equilibrium and the spring pushes or pulls it back with `F = −kx` — proportional to displacement and opposite to it. Newton's second law gives `a = F/m = −(k/m)x`. Any motion with `a = −ω²x` (a constant `ω²`) is **simple harmonic**: the acceleration is proportional to the displacement from a fixed point and always directed towards that point.
- **Equations (`.eq`):** `F = kx` · `F = −kx` · `a = −(k/m)x` · `ω² = k/m` · `T = 2π√(m/k)` · `f = (1/2π)√(k/m)` · `T² = (4π²/k) m`.
- **Comparison table (`#props-table`):** heavier load vs stiffer spring vs bigger amplitude — effect on `T` (↑ as √m · ↓ as 1/√k · none) and on `f`.
- **Position Explorer (`#pos-explorer`):** mass pins `50–250 g` on the `k = 24.5 N m⁻¹` spring → extension, `T`, `f`, `T²` live, plus the okada pins `200 kg` / `250 kg` on `k = 3.16 × 10⁴ N m⁻¹` → `T = 0.50 s` / `0.56 s`.
- **3D Zoom (`#zoom`, scene key `zoom`, kit `mass-spring` v2 `forces` + `testtube`):** close-up of the oscillating mass with a red restoring-force arrow whose length grows with displacement and always points to the equilibrium line (zero length at the centre, longest at the ends); a dashed equilibrium plane. Toggle to the weighted test-tube in water: the extra upthrust when pushed down acts as the restoring force. Counters: `x`, `F = −kx`, `a = −(k/m)x`.

#### 4. Apply
- **Worked Example 1 (finding k, then T — 4 steps):** A 0.30 kg load stretches a spring by 6.0 cm. Find `k` and the period when the load bounces (`g = 9.8 m s⁻²`).
  1. `F = mg = 0.30 × 9.8 = 2.94 N`; `x = 6.0 cm = 0.060 m`.
  2. `k = F/x = 2.94 ÷ 0.060 = 49 N m⁻¹`.
  3. `T = 2π√(m/k) = 2π√(0.30 ÷ 49) = 2π√(0.006 12)`.
  4. `= 2 × 3.142 × 0.0782 = 0.49 s`.
  - **Answer:** `k = 49 N m⁻¹`, `T ≈ 0.49 s`.
- **Worked Example 2 (the SHM condition — 3 steps):** For the spring in Example 1, find the acceleration of the load when it is 2.0 cm below equilibrium, and the angular frequency.
  1. `a = −(k/m)x = −(49 ÷ 0.30) × 0.020`.
  2. `= −163 × 0.020 = −3.3 m s⁻²` (directed upwards, towards equilibrium).
  3. `ω = √(k/m) = √163 = 12.8 rad s⁻¹`.
  - **Answer:** `a ≈ 3.3 m s⁻²` towards equilibrium; `ω ≈ 12.8 rad s⁻¹`.
- **Worked Example 3 (the okada — 4 steps):** The okada's rear spring has `k = 3.16 × 10⁴ N m⁻¹`. Find the bounce period with `200 kg` and with `250 kg` on it.
  1. `T₁ = 2π√(200 ÷ 31 600) = 2π√(6.33 × 10⁻³)`.
  2. `= 2 × 3.142 × 0.0796 = 0.50 s` (`f = 2.0 Hz`).
  3. `T₂ = 2π√(250 ÷ 31 600) = 2π√(7.91 × 10⁻³) = 2 × 3.142 × 0.0889`.
  4. `= 0.56 s` (`f = 1.79 Hz`).
  - **Answer:** `0.50 s` → `0.56 s`: the heavier load bounces more *slowly*, not less.
  - **Model note (`.note`):** *Story numbers are a teaching model, not real measurements.*
- **Worked Example 4 (ratio — 3 steps):** A load of 0.20 kg on a spring has period `0.60 s`. Find the period with 0.45 kg on the same spring.
  1. `T ∝ √m`, so `T₂/T₁ = √(m₂/m₁)`.
  2. `= √(0.45 ÷ 0.20) = √2.25 = 1.5`.
  3. `T₂ = 1.5 × 0.60 = 0.90 s`.
  - **Answer:** `T₂ = 0.90 s`.
- **The Bridge (`#bridge`):** load the bench's okada mode with 200 kg, then 250 kg; time 20 bounces each (`10.0 s` → `11.2 s`). Verdict: *Tunde's "heavier is steadier" fails — extra crates don't stop the bounce, they slow its rhythm from 2.0 Hz to 1.8 Hz.* `.callout.big#big-idea`: *a restoring force proportional to displacement gives SHM; for a spring `T = 2π√(m/k)`, so more mass means a longer period.*
- **Quiz:** 12 questions from `03-questions.md` § Lesson 02.

#### 5. Reflect & Assignment
- **I can (1–4):** state Hooke's law and find `k` · state the SHM condition and explain the minus sign · use `T = 2π√(m/k)` · find `k` from the `T²`–`m` slope · solve `T ∝ √m` ratios.
- **Exit ticket (2 marks):** A spring stretches 5.0 cm under a 0.25 kg load. Find `k`. (`k = 0.25 × 9.8 ÷ 0.050 = 49 N m⁻¹`.)
- **Recall:** `F = kx` · restoring force `−kx` · `a = −ω²x` definition in words · `ω² = k/m` · `T = 2π√(m/k)` · `T²`–`m` slope `4π²/k`.
- **Assignment:** Part A — hang a bunch of keys from a rubber band or spring, add one key at a time and measure the stretch with a ruler; does it stretch evenly? Part B — 30 marks from `03-questions.md` § Lesson 02.
- **Teacher notes:** 0–5 Do Now · 5–15 Wonder · 15–45 Investigate · **45–50 movement break** ("be the spring": pairs pull a partner's outstretched arms gently; the further the pull, the harder the partner resists back to the middle) · 50–65 Make Sense · 65–75 Apply · 75–80 Reflect. Competences: L1 (test Tunde's claim), L4 (two graphs, two slopes), L5 (sliders), L6 (a vehicle loader's real decision). Support: pre-drawn axes; stretch: why a spring's own mass makes `T` slightly longer.

---

### LESSON 03: SHM as a Circle's Shadow — Displacement, Velocity and Acceleration
- **Folder:** `html/lessons/lesson-03/` · **Duration:** 80 min · **Competences:** L1, L3, L4, L5
- **Guiding question:** When exactly do the crates leave the carrier?
- **Objectives:**
  1. **01** · Describe SHM as the projection of uniform circular motion on a diameter.
  2. **02** · Use `x = A sin ωt`, with `ωt` in radians.
  3. **03** · Use `v = ω√(A² − x²)`, `v_max = ωA`, `a = −ω²x`, `a_max = ω²A`.
  4. **04** · State where speed, acceleration and restoring force are zero and greatest, and sketch `x`, `v`, `a` against `t`.
  5. **05** · Explain and apply the lift-off condition `ω²A ≥ g`.

#### 0. Do Now (`from: 1, 2`)
1. **Q:** A wheel turns at `ω = 4.0 rad s⁻¹` with radius `0.30 m`. Find the speed of a point on its rim. **A:** `v = ωr = 1.2 m s⁻¹` (SS2 circular motion).
2. **Q:** State the condition for SHM. **A:** Acceleration ∝ displacement and directed towards the equilibrium position, `a = −ω²x`. *(Revisit Lesson 2 →)*
3. **Q:** `T = 0.50 s`. Find `ω`. **A:** `ω = 2π/T = 12.6 rad s⁻¹`. *(Revisit Lesson 1 →)*
4. **Q:** Convert 90° and 30° to radians. **A:** `π/2 = 1.57 rad`; `π/6 = 0.524 rad`.

#### 1. Wonder
- **3D Story, Set 1:**
  1. `shot: [[5, 1.4, 4], [0, 0.6, 0]]`, `who: "dayo"` — riding past the ridges at a moderate pace: the carrier pumps, the crates rattle but stay down.
  2. `who: "zainab"` — watching from the roadside: "The crates stay on the carrier while it rises. They only jump when it's at the top and starting down."
  3. `who: "tunde"` — "They jump because that's where the bike is moving fastest."
  4. `shot: [[1.5, 0.8, 3], [0, 0.4, 0]]`, `who: "okafor"` — the okada on its centre stand; she spins the rear wheel slowly; a lump of red mud on the tyre goes round; the midday sun throws its shadow on the ground, sliding to and fro. "Watch the mud's shadow. It moves exactly like the bounce."
  5. `who: "okafor"` — "At the top of the bounce the carrier is barely moving — but it is accelerating downwards harder than anywhere else. If that downward acceleration beats `g`, the carrier falls away faster than the crate can."
- **Wonder Wall prompt:** *Where in the bounce is the carrier moving fastest, and where is its acceleration biggest? Same place or different?* Seeds: "Fastest at the top (Tunde)" · "Fastest in the middle (Zainab)" · "Acceleration is zero at the top because it stops (Dayo)" · "Why should a wheel have anything to do with a spring? (Hajia Ramatu)".

#### 2. Investigate
- **2A Sort (`#sort`):** *Where does it happen?* Bins (3): `centre` (at equilibrium, `x = 0`) · `ends` (at `x = ±A`) · `nowhere` (never true in SHM). Items (10): speed is greatest → centre · acceleration is zero → centre · restoring force is zero → centre · kinetic energy is greatest → centre · velocity is momentarily zero → ends · acceleration is greatest → ends · restoring force is greatest → ends · the body changes direction → ends · acceleration points away from the centre → nowhere · speed is the same at every point → nowhere.
- **2B Virtual Practical (`#practical`, scene key `bench`, **2D Paper.js** — kit `shm-kinematics-2d` (Paper.js port) `wheel` scene; rule 5b: planar projection):**
  - **Method cards (4):**
    1. Set the wheel's radius `A` and period `T`; press **Spin**. Watch the mud lump go round and its shadow slide along the ground line.
    2. Pause at the marked angles `ωt = 0°, 30°, 60°, 90°`; read the shadow's displacement `x`, velocity `v` and acceleration `a` from the arrows.
    3. Record them in the table and compare with `x = A sin ωt`, `v = ωA cos ωt`, `a = −ω²x`.
    4. Switch on the three time-graphs and match each arrow to its trace.
  - **Scene (`bench`):** side-view wheel (tyre, spokes, hub) with a mud lump; radius line and angle arc `ωt`; a ground "shadow" dot with live arrows: `v` (teal), `a` (amber, always pointing to the centre O). Named parts: `wheel`, `lump`, `radius`, `angle`, `shadow`, `v-arrow`, `a-arrow`, `centre`. Controls: `A` (`0.10–0.40 m`, default `0.30 m`), `T` (`1.0–4.0 s`, default `2.0 s`), **Spin / Pause**, **Step 30°**, **Graphs on/off**. Emits `l3:bench` per recorded angle, `l3:bench-done` after four angles.
  - **Results table:** `ωt / °` · `x / m` (3 s.f.) · `v / m s⁻¹` (3 s.f.) · `a / m s⁻²` (3 s.f.).
  - **Expected results (`#expected`), `A = 0.30 m`, `T = 2.0 s` (`ω = π = 3.14 rad s⁻¹`):** `0°`: `x = 0`, `v = 0.942`, `a = 0` · `30°`: `0.150`, `0.816`, `−1.48` · `60°`: `0.260`, `0.471`, `−2.56` · `90°`: `0.300`, `0`, `−2.96`. Graphs: `x`–`t` a sine curve; `v`–`t` a cosine (peaks where `x = 0`); `a`–`t` an inverted copy of `x`–`t`.
  - **Analysis questions (5, locked):** At which angle is the shadow fastest, and why? · Why is `a` always opposite in sign to `x`? · Show that `a/x` is the same at 30° and 60° (`−9.87 s⁻²` = `−ω²`) · What happens to `v_max` if `T` is halved? (doubles) · And to `a_max`? (×4).

#### 3. Make Sense
- **Reference circle (`.callout.big`):** a point moving round a circle of radius `A` at steady angular speed `ω` casts a shadow on a diameter that moves in SHM with amplitude `A` and the same `ω`. The shadow's displacement is `x = A sin ωt` (timing from the centre).
- **Equations (`.eq`):** `x = A sin ωt` · `v = ω√(A² − x²)` · `v_max = ωA` (at `x = 0`) · `a = −ω²x` · `a_max = ω²A` (at `x = ±A`).
- **Lift-off rule (`.callout`):** The carrier can push the crate up but it cannot pull it down; only gravity pulls the crate down, so the crate can never accelerate downwards faster than `g`. At the top of the bounce the carrier accelerates downwards at `ω²A`; if `ω²A > g` the carrier drops away faster than the crate can fall, and the crate leaves it. So crates stay on only while `A < g/ω²`.
- **Comparison table (`#props-table`):** at `x = 0` vs at `x = ±A`: displacement · speed · acceleration · restoring force (zero/max pairs).
- **Position Explorer (`#pos-explorer`):** phase pins `0°, 30°, 45°, 60°, 90°, 180°, 270°` on the `A = 0.30 m`, `T = 2.0 s` circle → `x`, `v`, `a`.
- **2D Zoom (`#zoom`, scene key `zoom`, **Paper.js** `shm-kinematics-2d` `circle` + `graphs`):** abstract reference circle left, three synchronised traces right (`x`, `v`, `a` against `t`), a vertical cursor linking them; a toggle overlays a horizontal `g` line on the `a` trace with the okada numbers (`ω = 12.6 rad s⁻¹`) — drag `A` from 2 cm to 8 cm and watch the `a_max` peak cross `g` at 6.2 cm. Counters: `x`, `v`, `a`, `a_max`, `g/ω²`.

#### 4. Apply
- **Worked Example 1 (speed and acceleration at a point — 4 steps):** A body moves in SHM with `A = 0.10 m` and `ω = 5.0 rad s⁻¹`. Find its speed and acceleration when `x = 0.060 m`, and its maximum speed.
  1. `v = ω√(A² − x²) = 5.0√(0.010 − 0.0036)`.
  2. `= 5.0√0.0064 = 5.0 × 0.080 = 0.40 m s⁻¹`.
  3. `a = −ω²x = −25 × 0.060 = −1.5 m s⁻²`.
  4. `v_max = ωA = 5.0 × 0.10 = 0.50 m s⁻¹`.
  - **Answer:** `v = 0.40 m s⁻¹`, `a = 1.5 m s⁻²` towards the centre, `v_max = 0.50 m s⁻¹`.
- **Worked Example 2 (displacement at a time — 3 steps):** The okada's carrier bounces with `A = 5.0 cm` and `f = 2.0 Hz`, timed from the centre. Find its displacement at `t = 0.0625 s`.
  1. `ω = 2πf = 4π rad s⁻¹`.
  2. `ωt = 4π × 0.0625 = π/4 rad` (calculator in **radians**).
  3. `x = A sin ωt = 5.0 × sin(π/4) = 5.0 × 0.707 = 3.5 cm`.
  - **Answer:** `x ≈ 3.5 cm`.
  - **Model note (`.note`):** *Story numbers are a teaching model, not real measurements.*
- **Worked Example 3 (a gentle bounce — 3 steps):** At `f = 2.0 Hz` the carrier bounces with `A = 3.0 cm`. Find `v_max` and `a_max`; do the crates stay on?
  1. `ω = 12.6 rad s⁻¹`; `v_max = ωA = 12.6 × 0.030 = 0.38 m s⁻¹`.
  2. `a_max = ω²A = 158 × 0.030 = 4.7 m s⁻²`.
  3. Compare: `4.7 < 9.8`, so the carrier never accelerates downwards faster than `g`.
  - **Answer:** `v_max ≈ 0.38 m s⁻¹`, `a_max ≈ 4.7 m s⁻²`; the crates stay on.
- **Worked Example 4 (the lift-off threshold — 3 steps):** Find the smallest amplitude at which the crates leave the carrier at `f = 2.0 Hz`.
  1. Lift-off when `ω²A = g`, so `A = g/ω²`.
  2. `ω² = (12.57)² = 158 s⁻²`.
  3. `A = 9.8 ÷ 158 = 0.062 m = 6.2 cm`.
  - **Answer:** `A ≥ 6.2 cm` — the same as the okada's static sag (`mg/k`).
- **The Bridge (`#bridge`):** in the zoom, set `A = 3 cm` (`a_max = 4.7 m s⁻²`, crate stays) and `A = 8 cm` (`a_max = 12.6 m s⁻² > g`, crate lifts). Verdict: *the crates fly at the **top** of the bounce, where speed is zero but downward acceleration is greatest — not where the bike moves fastest. Lift-off needs `A ≥ 6.2 cm`. Something on Ridge Road must be pumping the bounce that big.* `.callout.big#big-idea`: *in SHM speed peaks at the centre (`ωA`), acceleration peaks at the ends (`ω²A`).*
- **Quiz:** 12 questions from `03-questions.md` § Lesson 03.

#### 5. Reflect & Assignment
- **I can (1–4):** link SHM to a reference circle · use `x = A sin ωt` in radians · use `v = ω√(A² − x²)` and `a = −ω²x` · say where `v` and `a` are zero/greatest · apply `ω²A ≥ g`.
- **Exit ticket (2 marks):** SHM with `A = 4.0 cm`, `ω = 10 rad s⁻¹`. Find `v_max` and `a_max`. (`0.40 m s⁻¹`; `4.0 m s⁻²`.)
- **Recall:** shadow of circular motion · `x = A sin ωt` · `v = ω√(A² − x²)`, `v_max = ωA` · `a = −ω²x`, `a_max = ω²A` · centre: fastest, `a = 0` · ends: still, `a` greatest · lift-off `A ≥ g/ω²`.
- **Assignment:** Part A — tape a bottle cap to a bicycle wheel, turn it slowly beside a wall with a torch shining from the side, and sketch how the shadow moves; mark where it moves fastest. Part B — 30 marks from `03-questions.md` § Lesson 03.
- **Teacher notes:** 0–5 Do Now · 5–15 Wonder · 15–45 Investigate · **45–50 movement break** ("shadow dance": one student walks a circle, a partner on the wall line copies only their side-to-side position) · 50–65 Make Sense · 65–75 Apply · 75–80 Reflect. Competences: L1 (challenge "fastest at the top"), L3 (why bumps at speed throw loads), L4 (three graphs), L5 (2D simulation). Support: table of `sin` values in degrees; stretch: show `v_max/a_max = 1/ω`.

---

### LESSON 04: The Simple Pendulum — Restoring Force, Small Angles and T = 2π√(l/g)
- **Folder:** `html/lessons/lesson-04/` · **Duration:** 80 min · **Competences:** L1, L2, L4, L5
- **Guiding question:** Does a heavier bob or a bigger swing change the timing?
- **Objectives:**
  1. **01** · Identify the restoring force on a pendulum bob (`mg sin θ`) and explain why the motion is SHM only for small angles.
  2. **02** · Show that `a = −(g/l)x`, so `T = 2π√(l/g)`.
  3. **03** · Show by fair tests that `T` does not depend on bob mass or (small) amplitude but depends on `l` and `g`.
  4. **04** · Solve ratio problems (`T ∝ √l`, `T ∝ 1/√g`) including the seconds pendulum and the Moon.
  5. **05** · Contrast the pendulum (mass has no effect) with the spring (`T ∝ √m`).

#### 0. Do Now (`from: 1, 2, 3`)
1. **Q:** Where is acceleration greatest in SHM? **A:** At the extremes, `x = ±A` (`a_max = ω²A`). *(Revisit Lesson 3 →)*
2. **Q:** For a spring, what happens to `T` if `m` is quadrupled? **A:** `T` doubles (`T ∝ √m`). *(Revisit Lesson 2 →)*
3. **Q:** A 2.0 N force acts at 30° to a slope. Find its component along the slope. **A:** `2.0 cos 30° = 1.73 N` (components).
4. **Q:** For a small angle `θ = 0.10 rad`, compare `sin θ` with `θ`. **A:** `sin 0.10 = 0.0998` — almost equal (`sin θ ≈ θ` for small angles).

#### 1. Wonder
- **3D Story, Set 2:**
  1. `shot: [[0, 2.0, 6.0], [0, 1.2, 0]]`, `who: "tunde"` — holding two bobs, brass and wood: "This heavy one will swing slowly, steady like a loaded lorry. I'm sure."
  2. `who: "zainab"` — "And if I pull it back further, it must take longer — it has further to go."
  3. `who: "okafor"` — "Two claims, two fair tests. Change one thing at a time and time 20 swings."
  4. `who: "okafor"` — she points at a short pendulum, about the length of a finger: "And here's a puzzle for later. This little pendulum keeps exactly the okada's time. Why that length?"
  5. `who: "zainab"` — she sets two pendulums of equal length, one brass, one wood, swinging side by side; they stay in step. "Tunde… they're together."
- **Wonder Wall prompt:** *Rank what you think changes a pendulum's period: bob mass, release angle, thread length, the planet you're on.* Seeds: "Mass matters most (Tunde)" · "Bigger angle = longer time (Zainab)" · "Length surely matters (Dayo)" · "On the Moon would it stop? (Hajia Ramatu)".

#### 2. Investigate
- **2A Sort (`#sort`):** *Does it change the pendulum's period?* Bins (2+1): `changes` · `no-change` · `only-large-angles` (changes only when the swing is wide). Items (9): doubling the thread length → changes · moving the pendulum to the Moon → changes · bob of brass instead of wood (same size) → no-change · doubling the bob's mass → no-change · release angle 5° instead of 10° → no-change · using a thread that stretches less (same length) → no-change · release at 45° instead of 10° → only-large-angles · measuring on a hill vs at sea level → changes (*why:* `g` is very slightly smaller up a hill, so `T` is very slightly longer, too small to see with a stopwatch) · the bob's colour → no-change.
- **2B Virtual Practical (`#practical`, scene key `bench`, 3D — kit `pendulum` v3 `laws`):**
  - **Method cards (4):**
    1. Fix `l = 0.50 m`, angle 10°; time 20 oscillations with the 50 g bob, then the 100 g bob.
    2. Keep the 100 g bob and `l = 0.50 m`; time 20 oscillations at 5°, 10° and 30°.
    3. Keep 10°; time 20 oscillations at `l = 0.25 m`, `0.50 m`, `1.00 m`.
    4. Switch `g` to the Moon (`1.6 m s⁻²`) at `l = 0.50 m` and time again.
  - **Scene (`bench`):** parts `bob`, `thread`, `cork`, `clamp`, `marker`, `protractor`, `ruler`, `stopwatch`. Controls: mass (`50 / 100 g`), angle (`5° / 10° / 30°`; protractor arc shows it), length (`0.25 / 0.50 / 1.00 m`), `g` (`Earth 9.8 / Moon 1.6`), **Release & time 20**, **Reset**. The period uses the exact large-angle value (so 30° runs about 1.7 % slow). Emits `l4:bench`, `l4:bench-done` once each variable has been changed at least once.
  - **Results table:** Test · variable changed · value · `t / s` (20 osc, 2 d.p.) · `T / s` (3 s.f.) · changed? (✓/✗).
  - **Expected results (`#expected`):** `l = 0.50 m`, 10°: 50 g → `28.44 s`, 100 g → `28.44 s` (`T = 1.42 s`) · 5° → `28.40 s`, 10° → `28.44 s`, 30° → `28.88 s` (`T = 1.44 s`, about 1.7 % longer than at 5°) · `l = 0.25 m` → `20.11 s` (`T = 1.01 s`); `1.00 m` → `40.22 s` (`T = 2.01 s`) — quadrupling `l` doubles `T` · Moon, `0.50 m` → `70.38 s` (`T = 3.52 s`) (all at 10°, exact large-angle period).
  - **Precautions (past tense):** only one variable was changed at a time · the angle was kept small (≤ 10°) for the fair tests · the bob swung in one plane, not in a circle · timing started at the rest mark.
  - **Sources of error:** reaction time at start and stop (shared over 20 oscillations) · the support moved slightly, adding to the effective length.
  - **Analysis questions (5, locked):** Which variables changed `T`? · Why did 30° give a slightly longer period? · By what factor did `T` grow when `l` was quadrupled? · Why did the Moon lengthen `T`? · Why was the bob mass test a *fair* test?

#### 3. Make Sense
- **Forces on the bob (`.callout`):** the weight `mg` splits into `mg cos θ` along the thread (balanced by tension) and `mg sin θ` along the arc, pulling the bob back towards the lowest point — the restoring force.
- **Small-angle step (`.callout.big`):** for small `θ` (in radians), `sin θ ≈ θ ≈ x/l`, so the restoring force is `F ≈ −mg(x/l)` and `a = F/m = −(g/l)x`. Mass cancels. This matches `a = −ω²x` with `ω² = g/l`, so `T = 2π√(l/g)`. For large angles `sin θ` falls noticeably below `θ`, the force is no longer proportional to `x`, and the period grows.
- **Equations (`.eq`):** `F = −mg sin θ` · `a ≈ −(g/l)x` · `ω² = g/l` · `T = 2π√(l/g)` · `T₂/T₁ = √(l₂/l₁)` · `l = gT²/4π²`.
- **Comparison table (`#props-table`):** simple pendulum vs loaded spring — period formula · depends on mass? (no / yes, `√m`) · depends on `g`? (yes / no) · depends on small amplitude? (no / no) · what gives the restoring force (weight component / spring tension).
- **Position Explorer (`#pos-explorer`):** angle pins `5°, 10°, 20°, 30°, 45°` → `θ` in rad, `sin θ`, % difference (`0.13, 0.51, 2.0, 4.5, 10 %`) and true period increase (`0.05, 0.19, 0.77, 1.7, 4.0 %`), showing why WAEC says "small angle".
- **Zoom (`#zoom`, scene key `zoom`) — 2D Paper.js `pendulum-forces` panel (kit `shm-kinematics-2d` Paper.js port; rule 5b: planar vectors and angles) with a small 3D context view (kit `pendulum` v3, bob and thread swinging, context only):** the Paper.js panel draws the thread at angle `θ` (angle arc), the bob, and arrows `mg` (down), tension `T` (along the thread), and the components `mg cos θ` (along the thread) and `mg sin θ` (along the arc, towards the lowest point); a shaded thin triangle with sides `x` and `l` shows `sin θ ≈ θ = x/l`; drag `θ` (`2°–45°`) and the panel shows `sin θ` vs `θ` (rad); a **50 g ↔ 100 g** swap doubles every force arrow while the acceleration arrow `g sin θ` stays the same length. Counters: `θ`, `mg sin θ`, `a = g sin θ`, `x/l`.

#### 4. Apply
- **Worked Example 1 (period — 3 steps):** Find the period of a simple pendulum `0.90 m` long (`g = 9.8 m s⁻²`).
  1. `T = 2π√(l/g) = 2π√(0.90 ÷ 9.8)`.
  2. `= 2π√0.0918 = 2 × 3.142 × 0.303`.
  3. `= 1.90 s`.
  - **Answer:** `T ≈ 1.90 s`.
- **Worked Example 2 (ratio — 3 steps):** A pendulum `0.40 m` long has period `1.27 s`. The thread is lengthened to `0.90 m`. Find the new period.
  1. `T₂/T₁ = √(l₂/l₁) = √(0.90 ÷ 0.40)`.
  2. `= √2.25 = 1.5`.
  3. `T₂ = 1.5 × 1.27 = 1.90 s`.
  - **Answer:** `T₂ ≈ 1.90 s` (agrees with Example 1).
- **Worked Example 3 (the Moon — 3 steps):** A pendulum has period `2.0 s` on Earth. Find its period on the Moon, where `g` is one-sixth of Earth's.
  1. `T ∝ 1/√g`, so `T_M/T_E = √(g_E/g_M) = √6`.
  2. `√6 = 2.45`.
  3. `T_M = 2.0 × 2.45 = 4.9 s`.
  - **Answer:** `T ≈ 4.9 s`.
- **Worked Example 4 (seconds pendulum — 3 steps):** A "seconds pendulum" ticks once per second, so its period is `2.0 s`. Find its length.
  1. Rearrange: `l = gT²/4π²`.
  2. `= 9.8 × (2.0)² ÷ 39.5 = 39.2 ÷ 39.5`.
  3. `= 0.99 m`.
  - **Answer:** `l ≈ 0.99 m`.
- **The Bridge (`#bridge`):** (a) run Tunde's test on the bench: 50 g and 100 g bobs at `l = 0.50 m` stay in step (`T = 1.42 s`). (b) Solve Mrs Okafor's puzzle: the pendulum that matches the okada's `0.50 s` has `l = gT²/4π² = 9.8 × 0.25 ÷ 39.5 = 0.062 m = 6.2 cm` — exactly the okada's static sag. Verdict: *mass doesn't set a pendulum's rhythm, and the okada's bounce period is the swing of a 6.2 cm pendulum, because `m/k = sag/g`.* `.callout.big#big-idea`: *`T = 2π√(l/g)`: only length and gravity count, for small swings.*
- **Quiz:** 12 questions from `03-questions.md` § Lesson 04.

#### 5. Reflect & Assignment
- **I can (1–4):** name the restoring force on a bob · explain the small-angle condition · use `T = 2π√(l/g)` · solve length and `g` ratio problems · contrast pendulum and spring.
- **Exit ticket (2 marks):** A pendulum's length is reduced to one quarter. What happens to its period? (Halved: `T ∝ √l`, `√(1/4) = 1/2`.)
- **Recall:** restoring force `mg sin θ` · small angle `sin θ ≈ θ` · `a = −(g/l)x` · `T = 2π√(l/g)` · mass and small amplitude don't matter · seconds pendulum ≈ 0.99 m · Moon `T × √6`.
- **Assignment:** Part A — make two thread pendulums of the same length, one with a key, one with a padlock; release together and observe whether they stay in step. Part B — 30 marks from `03-questions.md` § Lesson 04.
- **Teacher notes:** 0–5 Do Now · 5–15 Wonder · 15–45 Investigate · **45–50 movement break** (students stand and swing one arm loosely, then hold a bag in that hand: the free swing rate hardly changes; then bend the elbow — a shorter "pendulum" — and feel it quicken) · 50–65 Make Sense · 65–75 Apply · 75–80 Reflect. Competences: L1 (fair testing), L2 (clock pendulums, playground swings), L4 (force diagrams), L5. Support: ratio card `T ∝ √l`; stretch: why a grandfather clock loses time if its rod expands in the afternoon heat.

---

### LESSON 05: WAEC Practical — Determining g with a Simple Pendulum
- **Folder:** `html/lessons/lesson-05/` · **Duration:** 80 min · **Competences:** L1, L3, L4, L6
- **Guiding question:** What is `g` in our own lab, and how good is our measurement?
- **Objectives:**
  1. **01** · Set up the Paper 3 pendulum correctly (split cork, rest marker, effective length to the bob's centre).
  2. **02** · Record a composite table (`l`, `t₁`, `t₂`, `t̄`, `T`, `T²`) to consistent decimal places.
  3. **03** · Plot `T²` against `l`, find the slope with a large triangle and deduce `g = 4π²/slope`.
  4. **04** · Handle the ceiling-height variant (negative slope; intercept gives the height).
  5. **05** · Write precautions in the past tense and distinguish them from sources of error.

#### 0. Do Now (`from: 1, 2, 3, 4`)
1. **Q:** Write `T = 2π√(l/g)` with `T²` as the subject. **A:** `T² = (4π²/g) l`. *(Revisit Lesson 4 →)*
2. **Q:** For `y = mx + c`, what are `m` and `c`? **A:** `m` = slope (gradient), `c` = intercept on the `y`-axis.
3. **Q:** Why time 20 oscillations? **A:** To share out reaction-time error over many cycles. *(Revisit Lesson 1 →)*
4. **Q:** Does bob mass affect `T`? **A:** No (simple pendulum, small angles). *(Revisit Lesson 4 →)*

#### 1. Wonder
- **3D Story, Set 2:**
  1. `shot: [[0, 2.2, 6.0], [0, 1.3, 0]]`, `who: "okafor"` — "The lift-off rule needs `g`. Textbooks say 9.8. Let's measure our own, here in Ogbomoso."
  2. `who: "tunde"` — measures the thread with a ruler only to the top of the bob: "Eighty centimetres. Done."
  3. `who: "zainab"` — "The bob's centre is lower. The pendulum swings from the cork to the centre of the bob."
  4. `who: "tunde"` — starts the stopwatch as the bob leaves his hand and counts "one!" — Mrs Okafor stops him.
  5. `who: "okafor"` — "Small slips like these are exactly where WAEC candidates lose marks. Let's do it the examiner's way and see how much each slip costs."
- **Wonder Wall prompt:** *Which single slip do you think spoils the value of `g` most: wrong length, wrong count, wrong starting point, or a wide swing?* Seeds: "Length to the top is fine (Tunde)" · "Counting from 1 is a big mistake (Zainab)" · "Why not one length only? (Dayo)" · "Why a graph instead of the formula? (Hajia Ramatu)".

#### 2. Investigate
- **2A Sort (`#sort`):** *Precaution or source of error?* Bins (2): `precaution` (something that was done to improve the result, written in past tense) · `error` (something that spoils the result). Items (10): "I ensured the bob swung through a small angle" → precaution · "I avoided parallax when reading the metre rule" → precaution · "I started timing as the bob passed the rest mark" → precaution · "I ensured the bob swung in a vertical plane, not in a circle" → precaution · "I ensured the cork was tightly clamped" → precaution · reaction time in starting the stopwatch → error · air draughts in the room → error · the support moving slightly → error · stretching of the thread → error · miscounting the oscillations → error.
- **2B Virtual Practical (`#practical`, scene key `bench`, 3D — kit `pendulum` v3 `practical`):**
  - **Apparatus:** retort stand, clamp and boss, split cork, light inextensible thread, metal bob of radius `2.0 cm` (`r` shown), metre rule, stopwatch, chalk mark at rest position, protractor.
  - **Method cards (5):**
    1. Clamp the thread between the split-cork halves; measure thread length from the cork's lower edge to the top of the bob and **add the radius** to get `l`.
    2. Mark the rest position with chalk; displace the bob through a small angle (about 10°) in one plane.
    3. Start timing as the bob passes the mark, counting "zero"; time 20 complete oscillations; repeat for `t₂`.
    4. Repeat for `l = 0.400, 0.550, 0.700, 0.850, 1.000 m`.
    5. Find `t̄`, `T = t̄/20`, `T²`; plot `T²` (vertical) against `l` (horizontal); draw the best-fit line; use a large triangle for the slope `s`; `g = 4π²/s`.
  - **Scene (`bench`):** parts `cork`, `clamp`, `thread`, `bob`, `bob-centre`, `ruler`, `marker`, `stopwatch`, `protractor`. Controls: length presets, **Measure** (ruler animates to the cork; a callout adds `r`), **Release**, **Time 20** (twice), **Fault** dropdown (`none`, `count-from-1`, `time-from-extreme`, `length-to-top`, `wide-angle 40°`, `conical swing`), **Reset**. The model uses `g = 9.79 m s⁻²`. Teacher note: the local value near Ogbomoso is about 9.78 m s⁻²; the bench uses 9.79 m s⁻² as a realistic class measurement (0.1 % high). Emits `l5:bench`, `l5:bench-done` after five lengths.
  - **Composite table (`#results-table`):** `l / m` (3 d.p.) · `t₁ / s` · `t₂ / s` · `t̄ / s` (2 d.p.) · `T / s` (3 d.p.) · `T² / s²` (3 d.p.).
  - **Expected results (`#expected`, `study-graph`):**

    | l / m | t₁ / s | t₂ / s | t̄ / s | T / s | T² / s² |
    |---|---|---|---|---|---|
    | 0.400 | 25.36 | 25.44 | 25.40 | 1.270 | 1.613 |
    | 0.550 | 29.82 | 29.76 | 29.79 | 1.490 | 2.219 |
    | 0.700 | 33.57 | 33.63 | 33.60 | 1.680 | 2.822 |
    | 0.850 | 37.06 | 37.00 | 37.03 | 1.852 | 3.428 |
    | 1.000 | 40.13 | 40.19 | 40.16 | 2.008 | 4.032 |

    (`T²` is computed from the unrounded `T`; the interactive table accepts ±0.002 s² in the `T²` column, since squaring the displayed `T` gives 2.220 at 0.550 m and 3.430 at 0.850 m.) Straight line through the origin (`fit: "origin"`). Slope triangle from `(0.400, 1.613)` to `(1.000, 4.032)`: `s = 2.419 ÷ 0.600 = 4.03 s² m⁻¹`, so `g = 39.48 ÷ 4.03 = 9.79 m s⁻²`.
  - **Precautions (past tense):** I measured the length to the centre of the bob · I ensured the angle of swing was small · I started and stopped timing at the rest position · I repeated each timing and used the mean · I avoided parallax on the metre rule · I ensured the bob swung in one vertical plane · I ensured the cork was firmly clamped so the point of suspension did not move.
  - **Sources of error (with effect):** length measured to the top of the bob → every `l` too small by `r`; slope unchanged but the line misses the origin · counting from "one" → only 19 oscillations were really timed but `t` was divided by 20, so `T` too small (factor `19/20`) and `g` too large (by `(20/19)² ≈ 1.11`, about 11 %) · wide angle → `T` slightly too large, `g` slightly too small · reaction time (random) · conical swing (path not in a plane) → shorter period, `g` too large.
  - **Analysis questions (5, locked):** Why plot `T²`, not `T`, against `l`? · How is `g` obtained from the slope? · Why use a large triangle? · If the radius were left out, how would the graph change? · Why is the slope better than one reading put into the formula?

#### 3. Make Sense
- **From formula to straight line (`.callout.big`):** `T² = (4π²/g) l` has the form `y = mx` with `y = T²`, `x = l`, slope `4π²/g`, so `g = 4π²/slope`. The graph averages many readings and exposes a constant error (an intercept) that a single reading would hide.
- **Ceiling variant (`.callout`):** if the ceiling is out of reach, measure the height `y` of the bob's centre above the floor; then `l = H − y` and `T² = (4π²/g)(H − y)`. The `T²`–`y` line slopes **downwards** (slope `−4π²/g`), and it cuts the horizontal (`y`) axis, where `T² = 0`, at `y = H`, the ceiling height.
- **Equations (`.eq`):** `l = thread + r` · `T = t̄/n` · `T² = (4π²/g) l` · `g = 4π²/s` · ceiling: `T² = (4π²/g)(H − y)`.
- **Comparison table (`#props-table`):** precaution vs source of error — definition · tense · example · does it earn marks under "precautions"?
- **Position Explorer (`#pos-explorer`):** length pins `0.400–1.000 m` → `T`, `T²` and the point on the line; a "length to top" switch shifts all points left by `0.020 m`.
- **3D Zoom (`#zoom`, scene key `zoom`, kit `pendulum` v3 `practical` + `ceiling`):** "Error detective": the student picks a fault and the 3D pendulum replays it in slow motion (counting overlay "1, 2, 3…" vs "0, 1, 2…"; stopwatch starting at the extreme; ruler stopping at the top of the bob; a wide 40° swing; a conical path seen from above), while a mini `T²`–`l` graph beside it (kit `study-graph`) shows how the plotted points and `g` shift. A second toggle shows the ceiling rig with `y` measured from the floor. Counters: `l`, `T`, `g` obtained, % error.

#### 4. Apply
- **Worked Example 1 (g from the slope — 3 steps):** The best-fit line of a `T²`–`l` graph passes through `(0.400 m, 1.613 s²)` and `(1.000 m, 4.032 s²)`. Find `g`.
  1. `s = ΔT²/Δl = (4.032 − 1.613) ÷ (1.000 − 0.400)`.
  2. `= 2.419 ÷ 0.600 = 4.03 s² m⁻¹`.
  3. `g = 4π²/s = 39.48 ÷ 4.03 = 9.79 m s⁻²`.
  - **Answer:** `g ≈ 9.79 m s⁻²`.
- **Worked Example 2 (one reading — 4 steps):** A thread is `0.780 m` from cork to the top of a bob of radius `2.0 cm`. Twenty oscillations take `35.90 s`. Find `g`.
  1. `l = 0.780 + 0.020 = 0.800 m`.
  2. `T = 35.90 ÷ 20 = 1.795 s`; `T² = 3.222 s²`.
  3. `g = 4π² l / T² = 39.48 × 0.800 ÷ 3.222`.
  4. `= 31.58 ÷ 3.222 = 9.80 m s⁻²`.
  - **Answer:** `g ≈ 9.80 m s⁻²`.
- **Worked Example 3 (cost of a slip — 3 steps):** In Example 2, Tunde forgets the radius and uses `l = 0.780 m`. Find his `g` and the percentage error.
  1. `g = 39.48 × 0.780 ÷ 3.222 = 9.56 m s⁻²`.
  2. Error `= 9.80 − 9.56 ≈ 0.25 m s⁻²` (using unrounded values, `9.802 − 9.557 = 0.245`).
  3. `% error = 0.245 ÷ 9.80 × 100 = 2.5 %` (too low) — the same as `r/l = 0.020 ÷ 0.800`.
  - **Answer:** `g ≈ 9.56 m s⁻²`, about `2.5 %` too low.
- **Worked Example 4 (ceiling variant — 4 steps):** With the bob's centre `1.80 m` above the floor, `T² = 4.028 s²`; at `2.20 m`, `T² = 2.417 s²`. Find `g` and the ceiling height `H`.
  1. Slope `= (2.417 − 4.028) ÷ (2.20 − 1.80) = −1.611 ÷ 0.40 = −4.03 s² m⁻¹`.
  2. `g = 4π²/|slope| = 39.48 ÷ 4.03 = 9.80 m s⁻²`.
  3. At the ceiling, `T² = 0`: from `y = 1.80 m`, `Δy = 4.028 ÷ 4.03 = 1.00 m`.
  4. `H = 1.80 + 1.00 = 2.80 m`.
  - **Answer:** `g ≈ 9.80 m s⁻²`, `H ≈ 2.80 m`.
- **The Bridge (`#bridge`):** take the class value `g = 9.79 m s⁻²` and the okada's `ω = 12.57 rad s⁻¹`: lift-off threshold `A = g/ω² = 9.79 ÷ 158 = 0.062 m = 6.2 cm`. Verdict: *our measured `g` confirms Zainab's danger line — crates leave the carrier once the bounce amplitude reaches about 6.2 cm.* `.callout.big#big-idea`: *plot `T²` against `l`; `g = 4π²/slope`; precautions are things you did, errors are things that went wrong.*
- **Quiz:** 12 questions from `03-questions.md` § Lesson 05.

#### 5. Reflect & Assignment
- **I can (1–4):** set up the pendulum with `l` to the bob's centre · fill a composite table to consistent decimals · deduce `g` from a large slope triangle · handle the ceiling variant · write past-tense precautions.
- **Exit ticket (2 marks):** A `T²`–`l` slope is `4.10 s² m⁻¹`. Find `g`. (`39.48 ÷ 4.10 = 9.63 m s⁻²`.)
- **Recall:** `l = thread + r` · count from zero at the rest mark · composite table columns · `T²` vertical, `l` horizontal · `g = 4π²/slope` · ceiling: negative slope, intercept `H` · 5 precautions in past tense.
- **Assignment:** Part A — with a thread and a stone, time 20 swings at three lengths at home, plot `T²` against `l` on graph paper and estimate `g`. Part B — 30 marks (Paper 3 style) from `03-questions.md` § Lesson 05.
- **Teacher notes:** 0–5 Do Now · 5–15 Wonder · 15–45 Investigate · **45–50 movement break** (students form a living `T²`–`l` graph: five students stand at the plotted heights, the class checks they lie on a line) · 50–65 Make Sense · 65–75 Apply · 75–80 Reflect. Competences: L1 (error detective), L3 (clamping and safe bench practice), L4 (composite table, graph), L6 (precision measurement as a job skill). Support: pre-ruled table; stretch: the `T²`–`r` variant (fixed thread, bobs of different radius).

---

### LESSON 06: Energy in SHM and Damping
- **Folder:** `html/lessons/lesson-06/` · **Duration:** 80 min · **Competences:** L1, L3, L4, L6
- **Guiding question:** Where does the bounce energy go — and what is the shock absorber for?
- **Objectives:**
  1. **01** · Describe the interchange of kinetic and potential energy during SHM with constant total energy (no losses).
  2. **02** · Use `E = ½kA² = ½mω²A²`, `PE = ½kx²`, `KE = ½k(A² − x²)`.
  3. **03** · Sketch energy against displacement and find where `KE = PE` (`x = A/√2`).
  4. **04** · Define damping; distinguish light, heavy and critical damping and give uses (shock absorbers, meter needles).
  5. **05** · Explain that light damping shrinks amplitude while leaving the period almost unchanged.

#### 0. Do Now (`from: 2, 3, 4, 5`)
1. **Q:** Write `KE` and gravitational `PE`. **A:** `KE = ½mv²`, `PE = mgh`.
2. **Q:** Where is speed greatest in SHM, and what is it? **A:** At equilibrium; `v_max = ωA`. *(Revisit Lesson 3 →)*
3. **Q:** For a spring, `ω² = ?` **A:** `k/m`. *(Revisit Lesson 2 →)*
4. **Q:** Give one precaution from the pendulum practical, in the past tense. **A:** e.g. "I ensured the angle of swing was small." *(Revisit Lesson 5 →)*

#### 1. Wonder
- **3D Story, Set 1 (Sule's shed):**
  1. `shot: [[2.5, 1.5, 4.5], [0, 0.7, 0]]`, `who: "sule"` — he unbolts the rear shock absorber; dark oil streaks its body. "See this? It is weeping. The oil inside is what kills the bounce."
  2. `who: "dayo"` — "Kills the bounce? The spring is still strong."
  3. `who: "sule"` — he pushes the new and old dampers side by side: the new one resists firmly and slowly; the old one slides freely. "A spring stores the energy and gives it back. The oil turns it to heat. Without oil, nothing takes the energy away."
  4. `who: "zainab"` — "So every time the bike bounces, the energy just keeps going round and round?"
  5. `who: "okafor"` (Set 2) — releasing a pendulum and a bouncing spring with live energy bars: "Let's watch where the energy is at every point — and what happens when we make it work through water."
- **Wonder Wall prompt:** *Does a pendulum ever really stop by itself? Where would its energy go?* Seeds: "It keeps going forever (Tunde)" · "Air slows it (Zainab)" · "Does a slowing pendulum tick slower? (Dayo)" · "Why does my new car seat feel less bouncy? (Hajia Ramatu)".

#### 2. Investigate
- **2A Sort (`#sort`):** *Kinetic, potential or both?* Bins (3): `ke-max` · `pe-max` · `equal` (`KE = PE`). Items (9): pendulum bob passing its lowest point → ke-max · spring load at the top of its bounce → pe-max · spring load at the bottom of its bounce → pe-max (elastic) · load passing equilibrium → ke-max · pendulum bob at the end of its swing → pe-max · body at `x = A/√2` → equal · instant of zero speed → pe-max · instant of zero acceleration → ke-max · halfway in energy, about 71 % of the way to the end → equal.
- **2B Virtual Practical (`#practical`, scene key `bench`, 3D — kit `mass-spring` v2 `energy` + `damping`; `pendulum` v3 `energy`):**
  - **Method cards (4):**
    1. Release the spring load (`m = 0.20 kg`, `k = 24.5 N m⁻¹`) with `A = 5.0 cm`; watch the KE, PE and total bars.
    2. Fit the card vane; repeat in **air**, then with the vane in a beaker of **water**, then **oil**.
    3. Record the amplitude at the end of each cycle for 5 cycles.
    4. Time 10 oscillations in air and in water; compare the periods.
  - **Scene (`bench`):** parts `spring`, `mass`, `vane`, `beaker`, `ruler`, `pointer`, `ke-bar`, `pe-bar`, `total-bar`. Controls: medium (`air / water / oil`), `A` (`2–6 cm`), **Release**, **Record amplitude**, **Reset**. Amplitude ratio per cycle (model): air `0.97`, water `0.75`, oil `0.40`. Emits `l6:bench`, `l6:bench-done` after three media.
  - **Results table:** Cycle `0–5` · `A_air / cm` · `A_water / cm` · `A_oil / cm` (2 d.p.).
  - **Expected results (`#expected`, illustrative model values):** air `5.00, 4.85, 4.70, 4.56, 4.43, 4.29` · water `5.00, 3.75, 2.81, 2.11, 1.58, 1.19` · oil `5.00, 2.00, 0.80, 0.32, 0.13, 0.05`. Total energy at the start `E = ½kA² = ½ × 24.5 × 0.050² = 0.0306 J`. Ten oscillations: air `5.68 s`, water about the same (`≈ 5.7 s`) — light damping barely changes `T`. Plot amplitude against cycle number (`study-graph`, `join: true`): three decaying curves.
  - **Precautions (past tense):** the vane was kept fully immersed at the same depth in each liquid · the amplitude was read with the eye level with the pointer to avoid parallax · the load was released from the same starting amplitude each time.
  - **Sources of error:** the vane touched the beaker wall (extra friction) · the load swayed sideways instead of moving vertically · misreading the moving pointer at the end of each cycle.
  - **Analysis questions (5, locked):** Where is KE greatest, where PE? · Why did the total bar shrink in water? · Where did the lost energy go? · Did damping change the period noticeably? · Which medium would suit a shock absorber, and why?

#### 3. Make Sense
- **Energy interchange (`.callout.big`):** in SHM without losses, the total energy stays fixed while it changes form: all potential at the ends, all kinetic at the centre. For a spring `E = ½kA²`; at displacement `x`, `PE = ½kx²` and `KE = ½k(A² − x²)`. Since `k = mω²`, `E = ½mω²A²`. Total energy is proportional to `A²`.
- **Damping (`.callout`):** a resistive force (air, liquid, friction) takes energy out each cycle, so the amplitude dies away. *Light damping*: many shrinking oscillations; period almost unchanged. *Heavy damping*: slow creep back, no oscillation. *Critical damping*: the quickest return to rest without overshoot — what a good shock absorber and a moving-coil meter's needle aim for.
- **Equations (`.eq`):** `E = ½kA² = ½mω²A²` · `PE = ½kx²` · `KE = ½k(A² − x²)` · `KE = PE` at `x = ±A/√2` · pendulum: `E = mgh` at the end `= ½mv_max²`.
- **Comparison table (`#props-table`):** free vs lightly damped vs heavily damped vs critically damped — amplitude over time · oscillates? · example.
- **Position Explorer (`#pos-explorer`):** displacement pins `x = −0.10, −0.06, 0, 0.06, 0.0707, 0.10 m` for `k = 50 N m⁻¹`, `m = 0.50 kg`, `A = 0.10 m` → `PE`, `KE`, `v` (e.g. at `0.06 m`: `0.09 J`, `0.16 J`, `0.80 m s⁻¹`).
- **3D Zoom (`#zoom`, scene key `zoom`, kit `mass-spring` v2 `okada`):** cut-away coil-over shock absorber: coil spring outside; inside, a piston with small orifices moving through oil; oil jets through the holes and glows warm (heat) on each stroke. Toggle `healthy` / `leaking`: in the leaking one the oil level is low, the piston slides through air, little energy is taken and the bounce keeps going. A side panel (Paper.js `damping-trace`) draws the matching displacement–time trace for each. Counters: amplitude, energy per cycle removed (J), oil level.

#### 4. Apply
- **Worked Example 1 (energy at a point — 4 steps):** A `0.50 kg` mass on a spring of `k = 50 N m⁻¹` oscillates with `A = 0.10 m`. Find the total energy, and PE, KE and speed at `x = 0.060 m`.
  1. `E = ½kA² = ½ × 50 × 0.10² = 0.25 J`.
  2. `PE = ½kx² = ½ × 50 × 0.060² = 0.090 J`.
  3. `KE = E − PE = 0.25 − 0.090 = 0.16 J`.
  4. `v = √(2KE/m) = √(2 × 0.16 ÷ 0.50) = √0.64 = 0.80 m s⁻¹`.
  - **Answer:** `E = 0.25 J`, `PE = 0.090 J`, `KE = 0.16 J`, `v = 0.80 m s⁻¹` (check: `ω = 10 rad s⁻¹`, `v = 10√(0.010 − 0.0036) = 0.80`).
- **Worked Example 2 (where KE = PE — 3 steps):** For the same oscillator, where is `KE = PE`?
  1. `KE = PE` means each is `E/2`, so `½kx² = ½ × ½kA²`.
  2. `x² = A²/2`, `x = A/√2`.
  3. `x = 0.10 ÷ 1.414 = 0.071 m`.
  - **Answer:** `x = ±0.071 m` (about 71 % of the way out, not halfway).
- **Worked Example 3 (pendulum energy — 3 steps):** A `0.10 kg` bob is released from `5.0 cm` above its lowest point. Find its total energy and its greatest speed (`g = 9.8 m s⁻²`).
  1. `E = mgh = 0.10 × 9.8 × 0.050 = 0.049 J`.
  2. At the lowest point all is KE: `½mv² = 0.049`.
  3. `v = √(2gh) = √(2 × 9.8 × 0.050) = √0.98 = 0.99 m s⁻¹`.
  - **Answer:** `E = 0.049 J`, `v_max ≈ 0.99 m s⁻¹`.
- **Worked Example 4 (the okada's bounce energy — 3 steps):** For the okada's rear (`k = 3.16 × 10⁴ N m⁻¹`), compare the energy in a gentle `2.0 cm` bounce with that in a `6.2 cm` lift-off bounce.
  1. `E₁ = ½ × 31 600 × 0.020² = 6.3 J`.
  2. `E₂ = ½ × 31 600 × 0.062² = 61 J`.
  3. `E₂/E₁ = (6.2/2.0)² = 9.6`.
  - **Answer:** about `6.3 J` vs `61 J` — nearly ten times as much energy must build up for lift-off.
  - **Model note (`.note`):** *Story numbers are a teaching model, not real measurements.*
- **The Bridge (`#bridge`):** in the zoom, feed the healthy and the leaking shock the same small push every half-second for ten pushes; the healthy one turns most of each push into heat and settles near `2 cm`, the leaking one stores it and climbs past `6 cm`. Verdict (Mallam Sule): *a working shock absorber takes energy out each cycle; this leaking one hardly does, so energy put in by the road can pile up — but only if the pushes keep arriving in time with the bounce.* `.callout.big#big-idea`: *in SHM, `E = ½kA²` sloshes between KE and PE; damping drains it.*
- **Quiz:** 12 questions from `03-questions.md` § Lesson 06.

#### 5. Reflect & Assignment
- **I can (1–4):** describe the KE–PE interchange · calculate `E`, `KE`, `PE` at a point · find where `KE = PE` · define and compare types of damping · explain what a shock absorber does.
- **Exit ticket (2 marks):** The amplitude of an oscillator is doubled. By what factor does its energy change? (×4, because `E ∝ A²`.)
- **Recall:** `E = ½kA²` · `PE = ½kx²` · `KE = ½k(A² − x²)` · ends: all PE; centre: all KE · `KE = PE` at `A/√2` · light/heavy/critical damping · damping barely changes `T`.
- **Assignment:** Part A — push down on the back of a parked vehicle (with the owner's permission) and count how many bounces follow; compare two vehicles and say which has the better shock absorbers. Part B — 30 marks from `03-questions.md` § Lesson 06.
- **Teacher notes:** 0–5 Do Now · 5–15 Wonder · 15–45 Investigate · **45–50 movement break** (squat-and-rise "energy swap": down = PE stored, rising fast = KE, stand still at the top; then "add damping" by moving through imagined thick oil) · 50–65 Make Sense · 65–75 Apply · 75–80 Reflect. Damping note: textbooks describe shock absorbers as near-critical; real ones are set a little under critical (ζ ≈ 0.2–0.4) for comfort, which the model's healthy 0.30 reflects. Competences: L1, L3 (worn shock absorbers are a road-safety hazard), L4 (energy graphs), L6 (a mechanic's diagnosis). Support: energy bars worksheet; stretch: show `KE = ½mω²(A² − x²)` from `v = ω√(A² − x²)`.

---

### LESSON 07: Forced Vibration and Resonance — Solving the Ridge Road Case
- **Folder:** `html/lessons/lesson-07/` · **Duration:** 80 min · **Competences:** L1, L2, L3, L6, L7
- **Guiding question:** Why does exactly 18 km/h over the ridges cause disaster?
- **Objectives:**
  1. **01** · Distinguish free, damped and forced vibration.
  2. **02** · Define resonance (driving frequency equal to natural frequency, giving maximum amplitude) and demonstrate it with Barton's pendulums.
  3. **03** · Calculate a forcing frequency from speed and spacing (`f = v/d`) and a resonant speed (`v = d f₀`).
  4. **04** · Explain how damping and load change the resonance curve and the dangerous speed.
  5. **05** · Give useful and harmful examples of resonance and how harmful resonance is prevented.

#### 0. Do Now (`from: 1–6`)
1. **Q:** Find `f₀` for the okada (`T₀ = 0.50 s`). **A:** `2.0 Hz`. *(Revisit Lesson 1 →)*
2. **Q:** What does extra load do to a spring's natural frequency? **A:** Lowers it (`f₀ ∝ 1/√m`). *(Revisit Lesson 2 →)*
3. **Q:** What is the lift-off condition? **A:** `ω²A ≥ g` → `A ≥ 6.2 cm` here. *(Revisit Lesson 3 →)*
4. **Q:** What does damping do to amplitude? **A:** Makes it die away (energy removed each cycle). *(Revisit Lesson 6 →)*

#### 1. Wonder
- **3D Story, Set 1 then Set 2:**
  1. `shot: [[6, 2.0, 6], [0, 0.5, 0]]`, `who: "dayo"` — riding over the ridges at about 10 km/h: the carrier bumps once per ridge, small and untidy; crates fine.
  2. `who: "dayo"` — at about 30 km/h: the ridges blur, the rear barely moves; crates fine.
  3. `who: "dayo"` — at about 18 km/h: each ridge arrives just as the last bounce comes back; the rear pumps higher and higher; a crate lifts and cracks. `caption: "Ridge Road, 18 km/h."`
  4. `who: "tunde"` — "So it's not 'faster is worse' after all…"
  5. `who: "okafor"` (Set 2) — sets a heavy pendulum swinging on a taut cord hung with paper-cone pendulums of different lengths: only the one with the same length as the heavy driver swings wide. "Pushes that arrive at a system's own rhythm add up. That has a name: resonance."
  6. `who: "ramatu"` — "Then tell Dayo the speed to avoid — and what to fix."
- **Wonder Wall prompt:** *The ridges are 2.5 m apart and the okada bounces naturally at 2.0 Hz. Can you predict the dangerous speed before we test it?* Seeds: "Faster = worse (Tunde)" · "Each ridge must arrive once per bounce (Zainab)" · "Why does my speed change it with extra crates? (Dayo)" · "Can a building do this too? (Hajia Ramatu)".

#### 2. Investigate
- **2A Sort (`#sort`):** *Useful resonance or harmful resonance?* Bins (2): `useful` · `harmful`. Items (10): tuning a radio to a station → useful · a guitar's hollow body amplifying the string → useful · a talking drum's body booming with the membrane → useful · pushing a child on a swing in time → useful · blowing across the mouth of an empty bottle to make it hum → useful · soldiers breaking step on a footbridge (to avoid it) → harmful · a car's steering wheel shaking at one speed → harmful · a washing machine walking across the floor during spin → harmful · window louvres rattling when a heavy generator runs → harmful · Dayo's crates on Ridge Road → harmful.
- **2B Virtual Practical (`#practical`, scene key `bench`, 3D — kit `pendulum` v3 `barton`, then `mass-spring` v2 `okada` + `ridge-road-props`):**
  - **Method cards (4):**
    1. **Barton's pendulums:** set the heavy driver to `0.60 m`; five light paper-cone pendulums hang from the same cord at `0.30, 0.45, 0.60, 0.75, 0.90 m`. Set the driver swinging and wait for the steady state.
    2. Record which cone swings widest; change the driver length to `0.45 m` and repeat.
    3. **Ridge rig:** set load `200 kg`, damper `leaking`; sweep the speed `10 → 30 km/h` in steps; record forcing `f = v/d` and amplitude `A`; note any lift-off.
    4. Repeat with damper `healthy`, then with `250 kg` (leaking).
  - **Scene (`bench`):** parts — Barton: `driver`, `cord`, `cone-1` … `cone-5`, `ruler`; ridge: `okada`, `rear-shock`, `carrier`, `crate`, `ridges`, `speedometer`. Controls: Barton driver length (`0.30–0.90 m`), **Start**; ridge speed slider (`5–35 km/h`), load (`200 / 250 kg`), damper (`healthy / leaking`), **Ride**, **Reset**. Amplitudes from the story-model response table. Emits `l7:bench` per run, `l7:bench-done` after Barton + one full speed sweep.
  - **Results table:** Speed `v / km h⁻¹` · `v / m s⁻¹` (2 d.p.) · `f = v/d / Hz` (2 d.p.) · `A / cm` (1 d.p.) · lift-off? (✓/✗).
  - **Expected results (`#expected`, study-graph `A`–`v` curve):** Barton: driver `0.60 m` (`T = 1.55 s`, `f = 0.64 Hz`) → the `0.60 m` cone swings widest, neighbours less, far ones least. Ridge, `200 kg`, leaking: `10 km/h` (`2.78 m s⁻¹`, `1.11 Hz`) `1.4 cm` ✗ · `14` (`1.56 Hz`) `2.5 cm` ✗ · `16` (`1.78 Hz`) `4.4 cm` ✗ · `18` (`2.00 Hz`) `10.0 cm` ✓ · `20` (`2.22 Hz`) `3.9 cm` ✗ · `30` (`3.33 Hz`) `0.6 cm` ✗. Healthy damper: peak about `2.0 cm`, never lift-off. `250 kg`, leaking: peak `10.0 cm` at `16 km/h` (threshold `7.8 cm`) ✓; `18 km/h` only `3.7 cm`.
  - **Precautions (past tense):** only one cone length (or one setting) was changed at a time · the driver was released through a small angle · the amplitudes were read only after the steady state was reached.
  - **Sources of error:** the cord was not taut, which reduced the coupling between driver and cones · draughts disturbed the light paper cones · cones of nearly equal length swung against each other.
  - **Analysis questions (5, locked):** Why did only the equal-length cone swing widely? · Why does `f` rise with speed? · At what forcing frequency was `A` largest, and how does that compare with `f₀`? · What did the healthy damper do to the peak? · Why did the extra load move the peak to a lower speed?

#### 3. Make Sense
- **Kinds of vibration (`.callout`):** *free* — the system oscillates at its own natural frequency `f₀` with no outside push (and no losses). *Damped* — amplitude dies away as energy is removed. *Forced* — an outside periodic push makes the system vibrate at the **driving** frequency.
- **Resonance (`.callout.big`):** when the driving frequency equals the natural frequency, each push arrives in step with the motion, energy builds up, and the amplitude becomes greatest. Damping lowers and widens the resonance peak.
- **Ridge forcing (`.callout`):** a vehicle at speed `v` meets ridges spaced `d` apart at a rate `f = v/d` per second. Resonance when `v/d = f₀`, i.e. `v = d f₀`.
- **Equations (`.eq`):** `f = v/d` · `v_res = d f₀` · `f₀ = (1/2π)√(k/m)` · lift-off `ω²A ≥ g`.
- **Comparison table (`#props-table`):** free vs damped vs forced vs resonant — frequency of vibration · amplitude · energy source · example.
- **Position Explorer (`#pos-explorer`):** speed pins `10, 14, 16, 18, 20, 25, 30 km/h` → `f = v/d`, ratio `f/f₀`, `A` (leaking vs healthy), lift-off flag (threshold `g/ω²` with the driving `ω = 2πf`: e.g. 5.0 cm at 20 km/h, 2.2 cm at 30 km/h; 6.2 cm at resonance).
- **2D Zoom (`#zoom`, scene key `zoom`, **Paper.js** `shm-kinematics-2d` `resonance`; rule 5b: a graph):** amplitude against driving frequency with a live operating-point dot driven by a speed slider; damping slider (`ζ 0.05 → 0.30`) flattens the peak; load toggle slides the peak from `2.0 Hz` to `1.79 Hz`; a dashed lift-off threshold drawn as the curve `g/(2πf)²` using the driving frequency (it crosses `6.2 cm` / `7.8 cm` at the resonance peak), labelled "lift-off threshold". Counters: `v`, `f`, `f₀`, `A`, threshold.

#### 4. Apply
- **Worked Example 1 (the dangerous speed — 4 steps):** Ridges are `2.5 m` apart and the loaded okada's natural frequency is `2.0 Hz`. Find the speed at which resonance occurs, in m s⁻¹ and km/h.
  1. Resonance when `f = f₀`, and `f = v/d`.
  2. `v = d f₀ = 2.5 × 2.0 = 5.0 m s⁻¹`.
  3. Convert: `1 m s⁻¹ = 3.6 km/h`.
  4. `v = 5.0 × 3.6 = 18 km h⁻¹`.
  - **Answer:** `5.0 m s⁻¹ = 18 km h⁻¹`.
  - **Model note (`.note`):** *Story numbers are a teaching model, not real measurements.*
- **Worked Example 2 (two extra crates — 4 steps):** With `250 kg` on the same spring (`k = 3.16 × 10⁴ N m⁻¹`), find the new natural frequency and dangerous speed.
  1. `f₀ = (1/2π)√(k/m) = (1/2π)√(31 600 ÷ 250) = (1/2π)√126.4`.
  2. `= 11.24 ÷ 6.283 = 1.79 Hz`.
  3. `v = d f₀ = 2.5 × 1.79 = 4.47 m s⁻¹`.
  4. `= 4.47 × 3.6 = 16 km h⁻¹`.
  - **Answer:** `f₀ ≈ 1.79 Hz`; dangerous speed `≈ 16 km h⁻¹`.
- **Worked Example 3 (Barton's pendulums — 3 steps):** The driver of a Barton's set is `0.60 m` long. Find its frequency and say which paper cone resonates.
  1. `T = 2π√(0.60 ÷ 9.8) = 2π × 0.2474 = 1.55 s`.
  2. `f = 1/T = 0.64 Hz`.
  3. The cone with the same natural frequency — the same length, `0.60 m` — resonates.
  - **Answer:** `f ≈ 0.64 Hz`; the `0.60 m` cone.
- **Worked Example 4 (a keke on speed bumps — 3 steps):** A keke's suspension has natural frequency `1.5 Hz`. Speed bumps are `4.0 m` apart. At what speed would it resonate?
  1. `v = d f₀ = 4.0 × 1.5`.
  2. `= 6.0 m s⁻¹`.
  3. `= 6.0 × 3.6 = 21.6 km h⁻¹ ≈ 22 km h⁻¹`.
  - **Answer:** about `22 km h⁻¹`.
- **The Bridge (`#bridge`, mystery solved):** run the ridge rig at 10, 18 and 30 km/h with the leaking damper (crates fine, crack, fine), then at 16 km/h with 250 kg (crack), then with a healthy damper at every speed (fine). **Verdict (`.vt-verdict`):** *At 18 km/h the ridges push the rear at `f = 5.0 ÷ 2.5 = 2.0 Hz`, exactly its natural frequency — resonance. With the leaking shock absorber the energy builds until `A` passes `g/ω² = 6.2 cm`, and the crates leave the carrier at the top of each bounce. Extra crates lower `f₀` to 1.79 Hz, moving the danger to 16 km/h. Tunde's "faster is worse" fails: 30 km/h is safe because it is far from resonance.* *(Story numbers are a teaching model, not real measurements.)* **Advice to Dayo and Hajia Ramatu:** replace the rear shock absorber (Mallam Sule); until then, cross the ridge stretch at about 10 km/h or below, well under the resonance band, whatever the load. `.callout.big#big-idea`: *resonance happens when the driving frequency matches the natural frequency; damping limits it, and changing mass or stiffness moves it.*
- **Exam clinic (WAEC Paper 2 style):** two structured items modelled on the unit — define resonance with one useful and one harmful example; a resonant-speed calculation with a load change.
- **Quiz:** 12 questions from `03-questions.md` § Lesson 07.

#### 5. Reflect & Assignment
- **I can (1–4):** distinguish free, damped and forced vibration · define resonance and explain Barton's pendulums · compute `f = v/d` and the resonant speed · explain how damping and load change the danger · give useful and harmful examples.
- **Exit ticket (2 marks):** Ridges are `3.0 m` apart and a vehicle's `f₀ = 2.0 Hz`. Find the resonant speed. (`v = 3.0 × 2.0 = 6.0 m s⁻¹ = 21.6 km h⁻¹`.)
- **Recall:** free / damped / forced · resonance definition · Barton's pendulums: equal length resonates · `f = v/d`, `v = d f₀` · damping lowers the peak · more mass → lower `f₀` → lower danger speed · one useful, one harmful example.
- **Assignment:** Part A — push a friend on a swing (safely, gently) once per swing, then twice per swing, then at a random rhythm; describe which builds the biggest swing and why. Part B — 30 marks from `03-questions.md` § Lesson 07, including a unit-wide synoptic question.
- **Teacher notes:** 0–5 Do Now · 5–15 Wonder · 15–45 Investigate · **45–50 movement break** ("resonance clap": the class sways side to side; the teacher claps on, then off, the sway rhythm — on-beat claps make the sway bigger) · 50–65 Make Sense · 65–75 Apply · 75–80 Reflect. Competences: L1 (predict the speed before testing), L2 (talking drum and guitar resonance), L3 (safe speeds on ridged roads), L6 (a practical delivery plan for Hajia Ramatu), L7 (less food waste; designing bridges and roads to avoid resonance). Lift-off note: away from resonance the threshold is `g/ω²` with the driving `ω`; at resonance the two are equal (6.2 cm). Support: speed-conversion card (`× 3.6`); stretch: why marching soldiers break step on a bridge.

---

## 6. Narrator Choreography Blueprint (`window.NARRATION`, Nigerian English `en-NG` ranked #1)
- **Welcome Hub (`welcome-narration.js`, ~12 steps):** hero title → 3D Hero Lab (`spring` → `pendulum` → `ridge` modes, with `action` to raise the ridge speed to 18 km/h and show the crate lift) → mystery case file and clue cards → journey cards → explorer tabs 1–5 (wait `combo` once) → archetypes → formula strip → myths (wait `myth` flip) → method → finale CTA.
- **Each lesson (`lessons/lesson-0X/narration.js`, 26–30 steps):** hero → Do Now (wait `donow`) → story playback (`story:0`–`story:5`) → Wonder Wall (wait `note`) → sort (wait `sort`) → bench (`bench.setMode`, demo `action`, spotlight parts, wait `lX:bench-done`) → results table and expected graph → concepts and `.eq` → Position Explorer → zoom (`zoom.setMode`) → worked examples → explainer video (Lessons 02, 03, 07) → the Bridge (wait `bridge`) → quiz (wait `quiz`) → reflect and assignment.
- **Chapters:** `Welcome`, `Do Now`, `The Story`, `Wonder Wall`, `Sort Game`, `Virtual Lab`, `Make Sense`, `Zoom`, `Worked Examples`, `Solving the Mystery`, `Quiz & Reflection`.
- **Key spotlight parts:** L01 `stopwatch`, `marker`; L02 `spring`, `pointer`, `slotted-mass`; L03 `lump`, `shadow`, `a-arrow`; L04 `bob`, `protractor`; L05 `bob-centre`, `cork`, `ruler`; L06 `vane`, `total-bar`, piston; L07 `driver`, `cone-3`, `rear-shock`, `crate`. Every `wait` pauses with "Your turn!".
- **Voice notes:** say "omega", "two pi root L over g", "kilometres per hour"; spell out "T squared"; read SI units in full the first time.

---

## 7. Explainer Video Plan
video_cap: 3

Scored with `references/video-criteria.md`; each score equals the sum of its reasons. Six lessons reach ≥ 5; the cap of 3 keeps lessons 07 (10), 02 (9) and 03 (9). Lessons 06, 05 and 04 qualify but are dropped by the cap.

| lesson | score | recommend | reasons | video would cover |
|---|---|---|---|---|
| lesson-01 | 3 | no | +3 multi-step calculations · +2 frequently examined · −2 recall or revision | — mostly definitions and timing; the bench and zoom already show T = t/n and why 20 cycles are timed |
| lesson-02 | 9 | yes | +3 multi-step calculations · +2 frequently examined · +2 misconception · +1 graph reading · +1 derivation | restoring force grows with displacement, a = −(k/m)x → T = 2π√(m/k), heavier is slower not steadier, k from the T²–m slope, two worked examples (finding k then T; the okada 200 → 250 kg) · kits: graph, board; KIT GAP: pendulum and mass–spring SHM video kit (on the video backlog) |
| lesson-03 | 9 | yes | +3 multi-step calculations · +2 frequently examined · +2 misconception · +1 graph reading · +1 derivation | the circle's shadow, x = A sin ωt, where v and a peak (fastest at the centre, not the ends), x/v/a time-graphs, the lift-off rule ω²A ≥ g with two worked examples · kits: graph, board; KIT GAP: unit circle video kit (on the video backlog) |
| lesson-04 | 5 | yes | +3 multi-step calculations · +2 frequently examined · +2 misconception · +1 derivation · −3 practical-led | mg sin θ, small angles, T = 2π√(l/g), ratio problems — but the laws bench shows mass and angle live, so it is dropped by the cap · kits: board; pendulum video kit gap |
| lesson-05 | 6 | yes | +3 multi-step calculations · +2 frequently examined · +2 misconception · +1 graph reading · +1 staged process · −3 practical-led | the Paper 3 procedure, T²–l slope and the ceiling variant — but the student has just done it on the bench, so it is dropped by the cap · kits: graph |
| lesson-06 | 8 | yes | +3 multi-step calculations · +2 misconception · +2 invisible mechanism · +1 graph reading | KE ⇄ PE interchange, E = ½kA², light/heavy/critical damping, oil turning bounce energy into heat — dropped by the cap (lower score than 02, 03, 07) · kits: graph, board |
| lesson-07 | 10 | yes | +3 multi-step calculations · +2 frequently examined · +2 misconception · +2 invisible mechanism · +1 graph reading | forced vibration, energy pumped in step, Barton's pendulums, the resonance curve and damping, f = v/d and the 18 → 16 km/h worked examples that solve the case · kits: graph, board; KIT GAP: pendulum and mass–spring SHM video kit |
