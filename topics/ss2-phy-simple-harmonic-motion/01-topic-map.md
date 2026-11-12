---
slug: ss2-phy-simple-harmonic-motion
subject: Physics
class: SS2
exams: [WAEC, NECO, JAMB]
practical: true
lessons_count: 7
duration_per_lesson_min: 80
---

# Topic Map: Simple Harmonic Motion — Oscillations, the Loaded Spring, the Simple Pendulum and Resonance

## 1. Paraphrased Syllabus Scope (WAEC | NECO | JAMB)

| Board | What candidates must be able to do (paraphrased) |
|---|---|
| **WAEC SSCE (Theory, Papers 1 & 2)** | Tell periodic motion apart from motion that does not repeat, and recognise oscillation (to-and-fro motion about a fixed rest position) as a special kind of periodic motion. Explain what makes a motion *simple harmonic*: a pull back towards the rest position that grows in step with the displacement and always points the opposite way, so that acceleration is proportional to displacement and opposite in sign. Name everyday and laboratory systems that move this way (simple pendulum at small angles, a load bobbing on a spiral spring, a weighted test-tube floating upright in a liquid, a bifilar suspension, a vibrating string or prong). Define and connect amplitude, period, frequency and angular frequency; link linear and angular speed and acceleration by treating SHM as the shadow (projection) of a point moving uniformly round a circle. Work out speed and acceleration at any displacement and their maximum values. Describe how energy passes back and forth between kinetic and potential forms while the total stays fixed (when there is no loss). Explain free, damped and forced vibration, and resonance, with examples where resonance helps and where it harms. Simple numerical problems may be set; full mathematical proofs for the spring, bifilar and test-tube systems are not demanded `[VERIFY: wording of the WAEC exclusion note against the current official syllabus PDF]`. |
| **WAEC Paper 3 (Practical)** | Set up a simple pendulum held between the two halves of a split cork in a clamped retort stand; measure the effective length to the centre of the bob; time a stated number of complete oscillations (commonly 20 or 30) for at least five lengths; tabulate `l, t, T, T²` to consistent decimal places; plot the graph the question asks for (usually `T²` against `l`, sometimes against a height measured from the ceiling or floor); find the slope with a large triangle and deduce `g` and any intercept; state precautions in past-tense first-person wording. A loaded spiral-spring practical (extension against load, then period against load, deducing the spring constant) also appears `[VERIFY: frequency of the spiral-spring practical in recent WAEC/NECO Paper 3]`. |
| **NECO SSCE** | The same senior-secondary scope as WAEC. NECO items frequently ask for the period of a loaded spring `T = 2π√(m/k)` alongside the pendulum `T = 2π√(l/g)`, and for the positions of greatest speed, greatest acceleration and greatest restoring force. |
| **JAMB UTME** (Motion → SHM) | Define and explain SHM and give examples of systems that perform it; relate period, frequency and amplitude; handle velocity and acceleration in SHM; analyse the energy changes during an oscillation (simple treatment); identify kinds of forced vibration and list applications of resonance. Supporting areas pulled into SHM items: motion in a circle (angular velocity, `v = ωr`, centripetal acceleration) and elasticity (Hooke's law, spring constant, energy stored `½kx²`). Short ratio problems (length quadrupled, pendulum moved to the Moon) are very common. |

Placement: SS2 Physics, first term (after motion in a circle and before waves) in common Nigerian schemes of work `[VERIFY: term placement varies by state scheme]`. Section numbers change between syllabus editions, so none are quoted.

## 2. Unit Mystery Thread & 3D Story Cast

**The case: The Cracked Crates of Ridge Road.**
Every morning **Dayo**, an okada rider, carries trays of eggs from **Hajia Ramatu's poultry farm** outside Ogbomoso to the market in town. Halfway along, the laterite road crosses a stretch where the local council has laid a run of low concrete drainage ridges, evenly spaced about **2.5 m** apart. Hajia's daughter **Zainab** (SS2) notices a strange pattern in her mother's losses:
- At a crawl (about 10 km/h) the crates arrive whole. At a brisk 30 km/h they also arrive whole.
- At about **18 km/h** the back of the okada starts to pump up and down harder and harder, the crates jump clear of the carrier, and whole trays crack.
- On days when Dayo carries **two extra crates**, the "bad speed" drops to about **16 km/h**.
- Mallam **Sule**, the roadside mechanic, finds the rear shock absorber weeping oil.

Zainab's classmate **Tunde** has three confident answers: *"More speed always means more bouncing, so the faster you go, the more eggs break"*, *"Load more crates; heavier means steadier"*, and *"The okada is old, that's all."* Their physics teacher, **Mrs Ebere Okafor**, challenges the two students to model the okada's rear end as a **mass on a spring**, find its natural bounce period, measure `g` in the school lab, and predict exactly when the crates will leave the carrier.

**Driving unit question:** *Why does one particular speed over evenly spaced ridges make the okada bounce wildly, why does extra load shift that speed, why do the eggs fly up only when the bounce passes a certain size — and what should Dayo change?*

Modelled numbers (internally consistent, chosen for teaching; not measured data): sprung load on the rear `m = 200 kg`, spring constant `k ≈ 3.16 × 10⁴ N m⁻¹`, so `f₀ = 2.0 Hz`, `T₀ = 0.50 s`, `ω = 4π ≈ 12.6 rad s⁻¹`; static sag `mg/k ≈ 6.2 cm`; crates lift off when `ω²A ≥ g`, i.e. `A ≥ 6.2 cm`; ridge forcing frequency `f = v/d`, so resonance at `v = d f₀ = 2.5 × 2.0 = 5.0 m s⁻¹ = 18 km/h`; with `m = 250 kg`, `f₀ ≈ 1.79 Hz` and the bad speed falls to `≈ 16 km/h`. Unifying clue: a pendulum whose length equals the static sag (6.2 cm) has the same period as the bouncing okada, because `m/k = sag/g`.

| Lesson | The piece of the mystery it unlocks |
|---|---|
| 01 | The bounce is an oscillation with a measurable period: Zainab times 20 bounces of the parked, loaded okada and gets `T ≈ 0.50 s`, `f ≈ 2 Hz`. |
| 02 | Why the okada bounces at all: the rear spring pulls back in proportion to how far it is pushed (Hooke), the defining condition for SHM; `T = 2π√(m/k)` explains why extra crates slow the bounce. |
| 03 | When the eggs fly: a mud lump on the turning wheel shows SHM as a circle's shadow; acceleration is greatest at the extremes, and once `ω²A` exceeds `g` the carrier drops away faster than the crates can fall. |
| 04 | Tunde's "heavier means steadier" tested on pendulums: mass and (small) amplitude do not change the period; only length and `g` do. |
| 05 | Measuring the local `g` that sets the lift-off threshold: the WAEC pendulum practical, `T²` against `l`, slope `4π²/g`. |
| 06 | Where the energy goes: KE and PE trade places each cycle, and a working shock absorber drains energy (damping); the leaking one barely does. |
| 07 | **The resolution:** evenly spaced ridges push the okada at `f = v/d`; at 18 km/h that matches `f₀` — resonance. Verdict: replace the shock absorber, cross the ridge stretch slowly (well below the resonance band), and expect the danger speed to shift with load. |

**StoryStage cast:** `zainab` = Zainab (SS2 student, the learner) · `tunde` = Tunde (classmate who holds the misconceptions) · `okafor` = Mrs Ebere Okafor (physics teacher, the expert) · `dayo` = Dayo (okada rider) · `ramatu` = Hajia Ramatu (poultry farmer, whose losses are the case) · `sule` = Mallam Sule (roadside mechanic, appears in L06–L07). **Sets:** Set 1 — the laterite Ridge Road with the drainage ridges, the egg-laden okada and the farm gate; Set 2 — the school physics laboratory (retort stands, split corks, spiral springs, Barton's pendulum frame); Mallam Sule's roadside shed can be dressed into Set 1.

## 3. Unit Welcome Hub Specification

- **3D Hero Lab (`#lab-canvas`, `window.StudyLab`):** an "oscillator bench" with three switchable rigs on one retort stand — a **loaded spiral spring** (slotted masses on a hanger, pointer against a metre rule), a **simple pendulum** (split cork, chalk mark at the rest position, stopwatch) and the **okada rear suspension** (coil spring around a damper, crate on the carrier). HUD modes: `spring` (vary `m`, `k`; live `T = 2π√(m/k)`) · `pendulum` (vary `l`, `g`, mass, angle; live `T = 2π√(l/g)`) · `ridge` (vary speed `v` and damping; driving `f = v/d`, live amplitude, crate lifts off when `A ≥ g/ω²`).
- **Marquee (12 terms):** oscillation · amplitude `A` · period `T = t/n` · frequency `f = 1/T` · angular frequency `ω = 2πf` · restoring force `F = −kx` · SHM `a = −ω²x` · `x = A sin ωt` · `v = ω√(A² − x²)` · pendulum `T = 2π√(l/g)` · spring `T = 2π√(m/k)` · resonance `f = f₀`.
- **Unit Mystery Case File (`#mystery`):** the cracked crates on Ridge Road, with clue cards (crates fine at 10 and 30 km/h · cracked at 18 km/h · bad speed 16 km/h with extra load · leaking shock absorber) and three exam-weight stat cards (`Marks at stake` · `Exam boards: WAEC · NECO · JAMB` · `Core laws: a = −ω²x, T = 2π√(l/g), resonance`). Exam-weight figures must be phrased qualitatively unless the director supplies counted data `[VERIFY: no official mark weighting is published per topic]`.
- **Explorer tabs (5, live 2D Paper.js curve, `#combo-curve`):** *1. Displacement, velocity, acceleration against time* (three sine curves; `v` a quarter-cycle ahead of `x`, `a` exactly opposite to `x`) · *2. Acceleration against displacement* (straight line through the origin, gradient `−ω²`) · *3. Energy against displacement* (PE parabola `½kx²`, KE inverted parabola, flat total line) · *4. `T²` against `l`* (straight line through the origin, gradient `4π²/g`) · *5. Amplitude against driving frequency* (resonance peak at `f₀`; lower, broader peak with more damping).
- **6 calculation archetypes:**
  1. Period and frequency from timing: `T = t/n`, `f = 1/T`, `ω = 2πf = 2π/T`.
  2. SHM kinematics: `x = A sin ωt`, `v = ω√(A² − x²)`, `v_max = ωA`, `a = −ω²x`, `a_max = ω²A`.
  3. Loaded spring: `F = kx` (static extension), `T = 2π√(m/k)`, `T ∝ √m`, `k` from the slope of `T²` against `m` (`4π²/k`).
  4. Simple pendulum: `T = 2π√(l/g)`, ratio problems `T₂/T₁ = √(l₂/l₁)`, seconds pendulum (`T = 2 s`, `l ≈ 0.99 m`), changing `g` (Moon, lift).
  5. Practical deduction of `g`: slope `s` of `T²` against `l` gives `g = 4π²/s`; height-from-ceiling variant (negative slope, intercept gives the ceiling height).
  6. Energy and resonance: `E = ½kA² = ½mω²A²`, `KE = ½mω²(A² − x²)`, `PE = ½mω²x²`; resonant driving speed `v = d f₀`.
- **3 myth-buster flip cards:**
  1. *"A heavier bob swings more slowly."* — The period of a simple pendulum does not depend on the bob's mass; only length and `g` matter (for small swings).
  2. *"An oscillating body is fastest at the ends, where it turns round hardest."* — At the ends it stops for an instant; there its **acceleration** is greatest. Its **speed** is greatest at the rest position, where acceleration is zero.
  3. *"Resonance means the system is vibrating very fast."* — Resonance means the driving frequency **matches** the natural frequency, so amplitude builds up; the frequency itself need not be high.

## 4. Multi-Lesson Breakdown

| Lesson | Title | Driving question | 3D lab bench | 3D zoom | Bridge | Retrieval |
|---|---|---|---|---|---|---|
| **01** | **Things That Repeat — Periodic Motion, Oscillation and Its Measures** | How can we put a number on a bounce? | Oscillator sort + timing bench: classify motions (ceiling-fan blade, swing, okada bounce, falling mango, heartbeat, rolling ball); time `n` oscillations of a pendulum and of a loaded spring; tabulate `t`, `T = t/n`, `f` | One complete oscillation traced A → O → B → O → A with markers; amplitude ruler; why timing 20 cycles beats timing one (reaction-time error shared out) | Time 20 bounces of the loaded okada (`10.0 s`) → `T = 0.50 s`, `f = 2.0 Hz`, `ω ≈ 12.6 rad s⁻¹` | from: 0 (speed, units, reaction time, reading a stopwatch) |
| **02** | **The Pull Back to the Middle — Restoring Force, the SHM Condition and the Loaded Spring** | What makes a motion *simple harmonic*, and why do extra crates slow the bounce? | Spiral-spring bench: add slotted masses, read extension (Hooke: `F = kx`, find `k`); then set it bouncing and time it for several masses; plot `T²` against `m` (straight line, slope `4π²/k`) | Restoring-force arrows that grow with displacement and always point to the centre; `a = −(k/m)x` → `ω² = k/m`; floating test-tube as a second example | Use `k` and `m` for the okada: `T = 2π√(200/3.16×10⁴) ≈ 0.50 s`; with 250 kg, `T ≈ 0.56 s` | from: 1 |
| **03** | **SHM as a Circle's Shadow — Displacement, Velocity and Acceleration** | When exactly do the crates leave the carrier? | Wheel-and-shadow bench (2D planar, Paper.js): a mud lump on a rotating okada wheel, its shadow sliding on the ground in SHM; live `x`, `v`, `a` arrows; phase dial `ωt` | Reference circle: `x = A sin ωt`, `v = ω√(A² − x²)`, `a = −ω²x`; where each is zero or greatest; graphs of `x`, `v`, `a` against `t` | Crates lift off when `a_max = ω²A ≥ g` → `A ≥ 6.2 cm` (equal to the static sag) | from: 1, 2 |
| **04** | **The Simple Pendulum — Restoring Force, Small Angles and T = 2π√(l/g)** | Does a heavier bob or a bigger swing change the timing? | Pendulum laws bench: one variable at a time — bob mass, release angle (5°, 10°, 30°), length, `g` (Earth/Moon) — time 20 oscillations each; record which ones change `T` | Force resolution on the bob: `mg sin θ` restores, small-angle `sin θ ≈ x/l` gives `a = −(g/l)x`; mass cancels; isochronism breaks down for large angles | Test Tunde's "heavier is steadier" on pendulums; find the pendulum length that matches the okada's 0.50 s (≈ 6.2 cm) | from: 1, 2, 3 |
| **05** | **WAEC Practical: Determining g with a Simple Pendulum** | What is `g` in our own lab, and how good is our measurement? | Full Paper 3 bench: split cork in clamp, chalk/pin marker at rest position, metre rule to the centre of the bob (`l = thread + radius`), stopwatch; five lengths (e.g. 0.40–1.00 m), 20 oscillations, repeat timings; composite table; plot `T²` against `l`; large slope triangle; `g = 4π²/s` | Error detective: counting from 1 instead of 0, timing from an extreme, measuring to the top of the bob, wide angles, a swinging (elliptical) path, draughts; precautions vs sources of error; ceiling-height variant | Use the class value of `g` to fix the lift-off threshold `g/ω²` for Dayo's okada | from: 1, 2, 3, 4 |
| **06** | **Energy in SHM and Damping** | Where does the bounce energy go — and what is the shock absorber for? | Energy bench: pendulum and spring with live KE / PE / total bars; damping vane (card in air, then in water/oil) on the spring; record amplitude after each cycle | Energy against displacement parabolas; `E = ½kA²`; light, heavy and critical damping traces; inside a shock absorber (piston, orifices, oil) — a leaking one loses its damping | Mallam Sule's verdict: the leaking damper lets amplitude build; compare `E` stored at `A = 2 cm` vs `A = 6.2 cm` | from: 2, 3, 4, 5 |
| **07** | **Forced Vibration and Resonance — Solving the Ridge Road Case** | Why does exactly 18 km/h over the ridges cause disaster? | Barton's pendulums bench: heavy driver plus light paper-cone pendulums of different lengths; the one of equal length swings widest; then the ridge-road rig: vary speed, watch forcing `f = v/d` sweep through `f₀` | Amplitude–frequency resonance curve with damping slider; useful resonance (tuning a radio, drum and guitar strings) and harmful resonance (bridges, machinery, vehicle shimmy) | **Solve the mystery:** resonance at `v = d f₀ = 18 km/h`; extra load lowers `f₀` → 16 km/h; fix the damper, cross slowly; WAEC Paper 2 exam clinic | from: 1–6 |

## 5. Unit Learning Objectives

1. **LO1 (Remember, Understand):** Distinguish periodic, oscillatory and simple harmonic motion, giving Nigerian everyday examples of each, and define amplitude, period, frequency and angular frequency with their SI units.
2. **LO2 (Apply):** Find `T`, `f` and `ω` from timing data (`T = t/n`, `f = 1/T`, `ω = 2π/T`) and explain why many oscillations are timed.
3. **LO3 (Understand, Apply):** State the condition for SHM (restoring force, hence acceleration, proportional to displacement and directed towards the equilibrium position) and apply Hooke's law and `T = 2π√(m/k)` to a loaded spring.
4. **LO4 (Understand, Apply):** Describe SHM as the projection of uniform circular motion and use `x = A sin ωt`, `v = ω√(A² − x²)` and `a = −ω²x`, including maximum speed and maximum acceleration and where they occur.
5. **LO5 (Apply, Analyse):** Explain why a simple pendulum performs SHM only for small angles, use `T = 2π√(l/g)` in ratio problems, and show that the period does not depend on the bob's mass or (small) amplitude.
6. **LO6 (Apply, Evaluate):** Carry out the simple-pendulum practical, tabulate correctly, plot `T²` against `l`, deduce `g` from the slope, and state precautions (past tense) separately from sources of error.
7. **LO7 (Analyse):** Describe the interchange of kinetic and potential energy in SHM, calculate `E = ½kA²`, and explain damping and its practical uses.
8. **LO8 (Understand, Evaluate):** Distinguish free, damped and forced vibration, explain resonance with Barton's pendulums, and judge where resonance is useful and where it must be prevented.

## 6. Prerequisites & Spaced Retrieval Matrix

| Lesson | Retrieves from | Key retrieval points |
|---|---|---|
| 01 | Prerequisites (from: 0) | Speed = distance/time; SI units and prefixes; reading a stopwatch and reaction time; plotting a point on a graph. |
| 02 | Lesson 01 | One complete oscillation; `T = t/n`; `f = 1/T`; `ω = 2πf`. |
| 03 | Lessons 01–02 | Restoring force `F = −kx`; `a = −ω²x`; `T = 2π√(m/k)`; motion in a circle (`v = ωr`, centripetal acceleration `ω²r`) from SS2 circular motion. |
| 04 | Lessons 01–03 | Where speed and acceleration are greatest; `a_max = ω²A`; resolving a force into two components (`sin θ`, `cos θ`); radians and `sin θ ≈ θ` for small angles. |
| 05 | Lessons 01–04 | `T = 2π√(l/g)`; `T ∝ √l`; period independent of mass; `y = mx + c` and finding a slope. |
| 06 | Lessons 02–05 | `KE = ½mv²`, `PE = mgh`, energy stored in a spring `½kx²`; `v_max = ωA`; precautions vs errors. |
| 07 | Lessons 01–06 | Natural frequency `f₀ = (1/2π)√(k/m)`; damping reduces amplitude; `f = 1/T`; speed = distance/time (`f = v/d`). |

## 7. Transversal Competences (L1–L7)

- **L1 · Thinking and learning to learn:** predicting on the Wonder Wall before testing; controlling one variable at a time on the pendulum bench; checking a result against the model numbers.
- **L2 · Cultural interaction and self-expression:** the okada egg trade, the farm-to-market economy, playground swings and talking-drum membranes as oscillators; writing clear past-tense precautions.
- **L3 · Managing daily life and safety:** safe okada speeds on ridged and corrugated roads; why worn shock absorbers are dangerous; resonance hazards in buildings and machines.
- **L4 · Multiliteracy:** moving between 3D rigs, force diagrams, sine graphs, energy parabolas, the `T²`–`l` line and the resonance curve.
- **L5 · Digital and simulation competence:** operating virtual stopwatches, sliders for `m`, `k`, `l`, `g`, damping and road speed.
- **L6 · Working-life skills and entrepreneurship:** cutting Hajia Ramatu's losses with a physics-based delivery plan; a mechanic's diagnosis of suspension faults.
- **L7 · Building a sustainable future:** less food waste on farm-to-market roads; designing roads and footbridges to avoid harmful resonance.

## 8. Exam Emphasis & Chief Examiner Traps

1. **Effective length is to the centre of the bob.** Measuring only to the hook (or to the bottom of the bob) shifts the `T²`–`l` line off the origin; examiners expect `l = thread length + radius`.
2. **Counting oscillations.** Start the stopwatch on "zero" as the bob passes the marker at the rest position, and count a complete oscillation as a return to that point moving the same way. Counting half-swings as whole ones halves `T`.
3. **Plot what is asked, the right way round.** "Plot `T²` against `l`" puts `T²` on the vertical axis; then `g = 4π²/slope`. Inverting the slope (or forgetting to square `T`) is a frequent loss of marks. Use a large slope triangle and read points from the line, not the table.
4. **Precautions are not errors.** Precautions describe what *was done* ("I ensured the bob swung through a small angle"; "I avoided parallax when reading the metre rule"); vague lines such as "I repeated the experiment" without saying what, or listing a source of error as a precaution, earn nothing.
5. **Speed and acceleration peak in different places.** Speed is greatest at the equilibrium position (`v_max = ωA`); acceleration and restoring force are greatest at the extremes (`a_max = ω²A`). Swapping these is one of the commonest theory errors.
6. **Mass and amplitude do not change a pendulum's period** (small angles), but mass *does* change a spring's period (`T ∝ √m`). Candidates mix the two systems.
7. **Ratio problems.** Quadrupling `l` doubles `T`; reducing `g` to one-sixth multiplies `T` by `√6`. Working these without square roots is a classic objective-paper trap.
8. **Resonance is a frequency match, not just "a big vibration".** Define it as the driving frequency equalling the natural frequency, giving maximum amplitude; give one useful and one harmful example.

## 9. Known Misconceptions

| Misconception | What the unit teaches instead |
|---|---|
| A heavier bob makes a pendulum swing more slowly (or more quickly). | For a simple pendulum the period depends only on length and `g`; mass cancels out. |
| A bigger swing always takes longer. | For small angles (about 10° or less) the period stays the same (isochronism); only large angles lengthen it. |
| The oscillator is fastest at the ends. | It is momentarily at rest at the ends; it is fastest passing the equilibrium position. |
| Acceleration is zero at the ends because the body stops there. | Velocity is zero at the ends; acceleration (and restoring force) is greatest there. |
| Any repeating motion is SHM. | SHM needs a restoring force proportional to displacement; a bouncing ball or a ball rolling in a V-shaped trough repeats but is not SHM. |
| Extra load makes a vehicle bounce less. | Extra load on the same spring lowers the natural frequency (`T ∝ √m`); it shifts, rather than removes, the resonance speed. |
| Resonance only happens at high frequencies. | Resonance happens whenever driving frequency equals natural frequency, whatever its value. |
| Damping changes the period a lot. | Light damping mainly shrinks amplitude over time; the period stays almost the same. |

## 10. Sources Consulted (paraphrased)

- `sources/studypipe-module3-simple-pendulum-notes.pdf` (studio's own planning notes on the simple pendulum): used for scope, practical procedure, graph variants (`T²` against `l` and the ceiling/floor-height form), error and precaution lists, and misconceptions. Its hooks (playground swings, a village wall clock, a cathedral lamp story) were deliberately **not** reused; the Ridge Road mystery is new.
- `sources/links.md`: an SS2/WAEC-level SHM video tutorial (definition, characteristics, period, frequency, amplitude, circular-motion link, velocity and acceleration). Not watched in full by this agent; listed for the lesson designer `[VERIFY: content of the video against this map]`.
- Web, for syllabus scope only (third-party copies, not the official PDFs, so marked for checking): syllabus.ng and schoolngr.com JAMB Physics syllabus pages (SHM topics and objectives; elasticity; motion in a circle); a WAEC syllabus copy and scheme-of-work summaries noting SHM energy, forced vibration and resonance, demonstrations with a loaded test-tube, pendulum, spiral spring and bifilar suspension, and the "no proofs required" note; the federal e-learning SS2 Physics listing (definition, speed and acceleration, period/frequency/amplitude, energy, forced vibration and resonance) `[VERIFY: confirm against the official WAEC and JAMB syllabus PDFs]`.
- Standard physics results (`T = 2π√(l/g)`, `T = 2π√(m/k)`, `a = −ω²x`, `E = ½kA²`) and the reference value `g ≈ 9.8 m s⁻²` are textbook-standard. Local `g` near Ogbomoso is close to `9.78 m s⁻²` `[VERIFY]`; lessons should use 9.8 (or the class's measured value).
- The okada/ridge numbers in § 2 are a constructed teaching model. Whether real drainage ridges or corrugations on Nigerian laterite roads are spaced about 2.5 m apart, and whether an okada's loaded rear suspension bounces near 2 Hz, are plausible but unmeasured `[VERIFY: realism of ridge spacing ≈ 2.5 m and rear-suspension f₀ ≈ 2 Hz]`.

### Build notes & kit gaps (for `lesson-renderer` / `kit-builder`)
- **`kits/mass-spring/` (v1, ~190 lines) is below HeartKit v2 fidelity.** It has only `mass_kg`, `k_Npm`, `amplitude_m`. Needed: a true helical spring (`CatmullRomCurve3`/`TubeGeometry` that stretches with load), slotted-mass hanger, pointer and metre rule, modes `hooke` (load → extension → `k`), `period` (time `n` bounces, `T²` against `m`), `damping` (vane in air vs liquid, amplitude decay), and an **okada rear-suspension** variant (coil-over shock with damper piston/oil, `damping` and `leak` params, crate lift-off when `A ≥ g/ω²`).
- **`kits/pendulum/` (v2) needs a fidelity pass for the Lesson 05 practical:** its split cork is a plain box. Needed: proper split-cork halves in a clamp boss, chalk/pin rest marker, metre rule with readable scale, bob with visible centre (thread + radius), repeat-timing table events, ceiling-height (`y`) variant, and a **Barton's pendulums** mode (driver + paper-cone pendulums on a taut cord) for Lesson 07.
- **`kits/shm-kinematics-2d/` uses a raw Canvas 2D context, not Paper.js.** CLAUDE.md rule 5b requires planar SHM visuals (reference circle and shadow, `x/v/a` graphs, resonance curve) and the Hub Explorer curve to be Paper.js; port or wrap it. Add the wheel-and-mud-lump projection scene for Lesson 03.
- **No story-prop kit** for Ridge Road (okada with egg crates and carrier, drainage ridges, farm gate, roadside mechanic shed). `auto-workshop-props` has a keke, not an okada. New `ridge-road-props` kit needed.
- **`kits/study-graph/`** covers the `T²`–`l`, `T²`–`m` straight lines and the `fn` smooth curves (sine, energy parabolas, resonance peak). No gap.
- **Video kits:** "pendulum & mass–spring SHM" and "unit circle" are already on the video-kit backlog in `kits/catalog.md`; lessons 03 and 07 are the likeliest video picks.
