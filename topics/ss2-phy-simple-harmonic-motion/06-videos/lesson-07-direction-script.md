# Direction Script: Lesson 07 · Forced Vibration and Resonance — Solving the Ridge Road Case

## Overview
The video closes the unit mystery. It sorts free, damped and forced vibration, builds resonance from "pushes in step", proves it with Barton's pendulums (driver 0.60 m → 1.55 s → 0.64 Hz), turns the ridges into a driver (`f = v/d`), finds the dangerous speed (2.5 m × 2.0 Hz = 5.0 m s⁻¹ = 18 km/h), shows the resonance curve with the leaking and the healthy damper, moves the danger to 16 km/h with two extra crates, and gives the verdict (replace the damper; cross the ridges at 10 km/h or below). It opens the **Make Sense** phase, after the Barton and ridge-rig bench. The 12 quiz questions and the exam clinic stay in Apply.

| Item | Decision |
| --- | --- |
| Running time | About 11–12 minutes, 13 chapters, 69 narration lines (inside the 14 minute limit) |
| Narrator | One teacher voice, Nigerian English |
| Level | SS2 Physics, WAEC / NECO / JAMB |
| Theme | Unit theme (`meta.theme` unset; the unit uses `editorial-ink`) |
| Kits used | **`shm-oscillator`** (plug-in; lesson-07 scenes appended to `06-videos/kit-requests/shm-oscillator.md`, which the lesson-02 video also uses for scene `spring`): scene `ridge` (okada rear on Ridge Road) and scene `barton` (Barton's pendulums) · built-in `graph` for the free / damped / forced traces and the amplitude–speed resonance curves · board only for the worked examples, useful/harmful resonance, mistakes, summary and your turn |
| Camera | Wide by default; push-ins on the crate, the bounce trace, the matched cone, the ridges, the frequency readout and the damper; one kit shot (no board writing) for the Barton reveal; board shots for worked examples 1–3 |
| End card | `meta.next: '#apply'`, `nextLabel: 'Continue to Apply →'` |

**Colour roles:**

| Symbol | Meaning | Colour |
| --- | --- | --- |
| `f` | driving (forcing) frequency, `f = v/d` | blue |
| `f₀` | natural frequency (also `T`, `l` of a pendulum when it sets `f₀`) | gold |
| `v` | speed of the okada | orange |
| `d` | ridge spacing | green |
| `A` | amplitude of the bounce / swing | purple |
| `g` | lift-off threshold (`ω²A ≥ g`, the red dashed line) | red |

On the graph kit: leaking-damper curve purple, healthy-damper curve `sky` (not green, which is `d`), 250 kg curve `pink`, lift-off line red dashed, bench points purple.

**Accuracy notes:**
- All Ridge Road numbers are the unit's **story model** (02-lesson.md § Story model): a teaching model, not measurements on a real okada or road. Line 1.1 says so aloud ("a teaching model"), and the board shows "story model" on the first Ridge Road board and again in Case closed.
- Amplitudes come from the model's base-excitation response `A = Y√(1 + (2ζr)²)/√((1 − r²)² + (2ζr)²)`, `Y = 1.0 cm`, `r = f/f₀`, `ζ = 0.05` leaking, `0.30` healthy. Recomputed: 200 kg leaking 10 → 1.44, 14 → 2.49, 16 → 4.40, 18 → **10.05** (10.0496 with `f₀ = 2.00` exactly; 10.0 cm to 3 s.f., as the corrected lesson), 20 → 3.89, 30 → 0.57 cm; healthy peak 1.99 cm at 16.7 km/h; 250 kg leaking peak 10.03 cm at 16.1 km/h, 18 km/h → 3.68 cm. Students never see the formula; the curve is plotted from it.
- The lift-off line is `g/ω²` with the **driving** `ω = 2πv/d` (as in the lesson's zoom). It does not depend on the load, so one red line serves both curves. It crosses 6.2 cm at 18 km/h (6.21) and 7.8 cm at the 250 kg resonance, 16.1 km/h (7.75 = the 250 kg sag). At exactly 16.0 km/h it is 7.85 cm; narration says "seven point eight" only for the line at the new resonance.
- Lift-off bands (leaking): 200 kg from about 17.0 to 19.3 km/h; 250 kg from about 15.6 to 16.9 km/h. Narration says "a narrow band around eighteen" with no band edges. The healthy damper never reaches the line at any speed or load (checked 5–35 km/h).
- The verdict "10 km/h or below" gives `f ≤ 1.11 Hz`, ratio ≤ 0.56 (200 kg) and ≤ 0.62 (250 kg); amplitude ≤ 1.6 cm against a threshold of about 20 cm. "Riding fast" is not advised, as in b8: it passes through both danger bands.
- Barton: `T = 2π√(0.60/9.8) = 2π × 0.2474 = 1.5547 s → 1.55 s`. Dividing 1 by the **rounded** 1.55 gives 0.645 → 0.65 Hz, which disagrees with the lesson's 0.64 Hz; the board therefore uses the 3 d.p. period, `f = 1/1.555 = 0.643 → 0.64 Hz`, and line 4.7 says why.
- In steady state every cone swings at the **driver's** frequency; only the matched cone resonates. (Kit detail, not narrated: the matched cone lags the driver by a quarter cycle, shorter cones swing nearly in step with it, longer ones nearly opposite.)
- The free / damped / forced traces in chapter 2 are shapes, not data: free at the okada's 2.0 Hz, damped with a shrinking envelope, forced at the 30 km/h ridge rate (3.33 Hz) with a small steady amplitude. The only numbers on that graph are 2.0 Hz and 3.33 Hz.
- "Each ridge lifts the wheel about one centimetre" is the model's base motion `Y = 1.0 cm`; 10.0/1.0 = 10 times.
- Worked examples 1–3 are the lesson's own (02-lesson.md § Lesson 07, Apply, WE1–WE3), with the lesson's numbers. WE4 (keke, 4.0 m, 1.5 Hz) is left for Apply.
- **Your-turn numbers are fresh**: danfo `f₀ = 1.2 Hz`, bumps `4.5 m` apart → 5.4 m s⁻¹ = 19.44 ≈ 19 km/h. Grepped 02-lesson.md and 03-questions.md: 4.5 m, 1.2 Hz and 19 km/h appear nowhere (the exit ticket's 3.0 m / 21.6 km/h, MCQ 3's 2.0 m / 1.6 Hz and b5's keke are not touched).
- WAEC wording: resonance = driving frequency equal to the natural frequency, giving the greatest amplitude (both parts, as the b2 mark scheme demands); forced vibration = vibration at the frequency of the driving force (as b1).

## Chapter 1: Three speeds on Ridge Road (hook, about 55 s)
The mystery in three rides: fine, fine, cracked. Tunde's rule fails.

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 1.1 | Every dawn, Dayo carries Hajia Ramatu's eggs to Ogbomoso market. Halfway, the road crosses low concrete ridges, two point five metres apart in our teaching model. | New board: "The Cracked Crates" · Kit shm-oscillator: scene ridge, v 10, load 200, damper leaking, labels on, trace off · Board: ridges: d = 2.5 m (note: story model) | hook, set the scene |
| 1.2 | At ten kilometres per hour, the carrier bumps a little at each ridge. The crates are fine. | Kit: v 10 (small untidy bumps) · Board: 10 km/h → fine ✓ | observation 1 |
| 1.3 | At thirty kilometres per hour, the rear hardly moves at all. Fine again. | Kit: v 30 (tiny bounce) · Board: 30 km/h → fine ✓ | observation 2 |
| 1.4 | But at eighteen kilometres per hour, the rear pumps higher and higher, until a crate lifts off the carrier and cracks. | Kit: v 18, build from rest, crate lifts and cracks · 📷 WIDE → crate · Board: 18 km/h → cracked ✗ | surprise |
| 1.5 | Tunde was sure that faster is always worse. The road says no. So why is one middle speed the dangerous one? | 📷 WIDE · Board: Why only 18 km/h? | the question the video answers |
| 1.6 | By the end, you will name three kinds of vibration, explain resonance with Barton's pendulums, and calculate the dangerous speed. | New board: "By the end of this video" · Board: ☐ free, damped, forced · ☐ resonance, Barton's · ☐ f = v/d, v = d f₀ · ☐ damping and load | objectives |

## Chapter 2: Free, damped, forced (core idea 1, about 55 s)
Three kinds of vibration, each with its trace; forced vibration follows the driver.

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 2.1 | First, three kinds of vibration. Push the parked okada down once and let go. It bounces at its own natural frequency, two point zero hertz. | New board: "Three kinds of vibration" · Kit graph (spec TRACE, x: time 0–2 s, y: displacement): show free (sine, 2.0 Hz, constant amplitude), label "free: 2.0 Hz" · Board: free: at its own f₀ · Highlight f₀ | definition: free |
| 2.2 | With no losses, that free vibration would keep the same amplitude for ever. No outside push is needed. | Board: no outside push (note: ideal, no losses) | definition: free, completed |
| 2.3 | Real systems lose energy to air, friction or oil. The amplitude dies away, cycle after cycle. That is damped vibration. | Kit graph: show damped (decaying sine with dashed envelope), hide free · Board: damped: A dies away · Highlight A | definition: damped |
| 2.4 | Now ride over the ridges. The road pushes the rear again and again, and the rear is made to vibrate at the frequency of those pushes, not its own. | Kit graph: show forced (small steady sine at 3.33 Hz), label "forced: driver's f" · Board: forced: at the driving f · Highlight f | definition: forced (WAEC b1 wording) |
| 2.5 | So in forced vibration, the driver sets the frequency. The natural frequency only decides how big the response is. | Board: f₀ decides how big · Box | key distinction (MCQ 2 idea, no MCQ numbers) |

## Chapter 3: Pushes in step (core idea 2: resonance, about 60 s)
Energy builds when each push arrives in step; that is resonance.

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 3.1 | Think of pushing a friend on a swing. Push once per swing, just as it starts to move away, and every push adds energy. | New board: "Pushes in step" · Kit shm-oscillator: scene ridge, v 18, trace on (bounce trace with a tick at every ridge hit), build from rest · Board: in step → energy adds | analogy |
| 3.2 | Push at the wrong moments, and some pushes fight the motion and take energy out. The swing stays small. | Kit: v 30 (ticks fall all over the bounce; trace stays small) · Board: out of step → stays small | contrast |
| 3.3 | On Ridge Road at eighteen, each ridge arrives just as the last bounce comes back. Every push lands in step. | Kit: v 18, build from rest (ticks line up with each bounce, trace grows) · 📷 WIDE → trace, drift .4 | the mechanism, seen |
| 3.4 | Each ridge lifts the wheel only about one centimetre. Yet the carrier builds up to ten centimetres. Ten times bigger. | Kit: amplitude gauge climbs to 10.0 cm · 📷 WIDE · Board: ridge push ≈ 1.0 cm · Board: bounce → 10.0 cm · Highlight A | size of the effect |
| 3.5 | That has a name. Resonance is when the driving frequency equals the natural frequency, so the system vibrates with its greatest amplitude. | New board: "Resonance" · Board: driving f = f₀ · Board: → greatest amplitude · Box | definition (both mark points, b2) |

## Chapter 4: Barton's pendulums (experiment + worked example 3, about 1 min 40 s)
The laboratory proof, then the driver's frequency from `T = 2π√(l/g)`.

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 4.1 | The classic laboratory proof is Barton's pendulums. A heavy driver hangs from a taut cord, beside five light paper cones of different lengths. | New board: "Barton's pendulums" · Kit shm-oscillator: scene barton, driverL 0.60, cones 0.30 / 0.45 / 0.60 / 0.75 / 0.90 m, swing off, labels on · Board: driver: 0.60 m · Board: cones: 0.30 to 0.90 m | experiment setup |
| 4.2 | Set the driver swinging. Through the cord, it pushes every cone at the driver's own frequency. Watch which cone answers. | Kit: swing on (cones build from rest) · 📷 KIT CLOSE-UP, slow drift (no board writing) | predict / watch |
| 4.3 | All five swing, but the zero point six zero metre cone swings widest. Its neighbours swing less, and the far ones least. | Kit: highlight the 0.60 m cone · 📷 WIDE → matched cone · Board: 0.60 m cone swings widest | observation |
| 4.4 | Why that one? Its length equals the driver's, so its natural frequency equals the driving frequency. It resonates. | 📷 WIDE · Board: same l → same f₀ → resonance · Highlight f₀ | explanation (b3c: link length to f₀) |
| 4.5 | Let's find that frequency. Step one. T equals two pi root L over g, so two pi times the root of zero point six zero over nine point eight. | New board: "Driver frequency" · 📷 BOARD SHOT · Board: T = 2π√(l/g) · Board: T = 2π√(0.60/9.8) | WE3 step 1 |
| 4.6 | The root is zero point two four seven four. Times two pi, that is one point five five seconds. | Board: = 2π × 0.2474 = 1.55 s | WE3 step 1, finished |
| 4.7 | Step two. f equals one over T. Keep the unrounded period, one point five five five, and f is zero point six four hertz. | Board: f = 1/T = 1/1.555 · Board: \phantom{f} = 0.64 Hz · Box · note: unrounded T | WE3 step 2 (rounding care) |
| 4.8 | Shorten the driver to zero point four five metres, and the widest swing moves to the zero point four five metre cone. Match the length, match the frequency. | 📷 WIDE · Kit: driverL 0.45 (0.45 m cone takes over) · Board: driver 0.45 m → 0.45 m cone | method card 2; generalise |

## Chapter 5: The ridges are the driver (core idea 3: f = v/d, about 70 s)
Derive the forcing frequency and find it at 18, 10 and 30 km/h.

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 5.1 | Back to Ridge Road. Here the ridges are the driver. How often do they push? | New board: "How often do ridges push?" · Kit shm-oscillator: scene ridge, v 18, trace off · 📷 WIDE → ridges · Board: d = 2.5 m between ridges · Highlight d | link to the story |
| 5.2 | At speed v, the okada takes d over v seconds to get from one ridge to the next. | 📷 WIDE · Board: time between ridges = d/v | derivation step 1 (b4a) |
| 5.3 | The number of ridges per second is the reciprocal. So the driving frequency is f equals v over d. | Board: f = v/d · Box · Highlight f | derivation step 2 |
| 5.4 | Speed must be in metres per second. At eighteen kilometres per hour, divide by three point six. That gives five point zero metres per second. | New board: "At 18 km/h" · Board: v = 18/3.6 = 5.0 m/s · Highlight v | units |
| 5.5 | So f equals five point zero over two point five, which is two point zero hertz. One ridge every zero point five zero seconds. | Kit: readout f = 2.0 Hz · 📷 WIDE → readout · Board: f = 5.0/2.5 = 2.0 Hz | calculation |
| 5.6 | That is exactly the okada's natural frequency. At ten kilometres per hour, the pushes come at one point one one hertz. At thirty, three point three three hertz. Both miss. | 📷 WIDE · Board: 10 km/h → f = 1.11 Hz · Board: 30 km/h → f = 3.33 Hz · note: both ≠ 2.0 Hz | the three rides explained |

## Chapter 6: Worked example 1 — the dangerous speed (about 70 s)
WE1 with every step, then the lift-off check from Lesson 03.

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 6.1 | Worked example one. Ridges are two point five metres apart, and the loaded okada's natural frequency is two point zero hertz. Find the dangerous speed. | New board: "Worked example 1" · 📷 BOARD SHOT · Board: d = 2.5 m, f₀ = 2.0 Hz · Board: v = ? | givens |
| 6.2 | Step one. Resonance happens when the driving frequency equals the natural frequency. So v over d equals f nought. | Board: f = f₀, so v/d = f₀ | method |
| 6.3 | Step two. Rearrange. v equals d times f nought, two point five times two point zero, which is five point zero metres per second. | Board: v = d f₀ = 2.5 × 2.0 · Board: \phantom{v} = 5.0 m/s | step |
| 6.4 | Step three. Convert, times three point six. Five point zero times three point six is eighteen kilometres per hour. | Board: 5.0 × 3.6 = 18 km/h · Box | answer |
| 6.5 | Will the crates lift? From lesson three, they leave the carrier when omega squared A is at least g. At two point zero hertz, that needs six point two centimetres. | New board: "Will the crates lift?" · Board: ω²A ≥ g · Board: A ≥ g/ω² = 6.2 cm · Highlight g | link to Lesson 03 |
| 6.6 | With the leaking damper, the bounce at eighteen reaches ten point zero centimetres. That is well past six point two. Off go the crates. | Kit shm-oscillator: scene ridge, v 18, gauge with threshold line, crate lifts · 📷 WIDE → crate · Board: 10.0 cm > 6.2 cm → lift-off | check against the story |

## Chapter 7: The resonance curve and the damper (graph reading, about 75 s)
The A–v curve from the bench, the lift-off line, and what a healthy damper does.

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 7.1 | Zainab swept the speed on the ridge rig and plotted the bounce against speed. Look at the shape. | New board: "The resonance curve" · Kit graph (spec AV, x: v 8–32 km/h, y: A 0–12 cm): show bench points (10, 1.4) (14, 2.5) (16, 4.4) (18, 10.0) (20, 3.9) (30, 0.6) · Board: A against v, leaking damper | graph setup (bench data) |
| 7.2 | Small at low speed, a sharp peak at eighteen kilometres per hour, then small again. The peak sits where f equals f nought. | Kit graph: show leaking curve (computed, through the points), pulse peak · 📷 WIDE → peak · Board: peak at 18 km/h, f = f₀ | read the peak |
| 7.3 | The red dashed line is the lift-off line. Only in a narrow band around eighteen does the curve climb above it. | Kit graph: show lift-off line (g/ω², red dashed) · Board: above red line → lift-off · Highlight g | threshold reading |
| 7.4 | Now Mallam Sule fits a healthy shock absorber. Its oil turns each bounce into heat, taking energy out every cycle. | New board: "A healthy damper" · Kit graph: show healthy curve · Board: damper: bounce energy → heat | damping, mechanism |
| 7.5 | The peak drops to about two point zero centimetres and spreads wider. It never reaches the lift-off line, at any speed. | Kit graph: pulse healthy peak · 📷 WIDE → healthy peak · Board: peak ≈ 2.0 cm, lower, broader · Board: never lifts off | damping, effect (MCQ 6 idea) |
| 7.6 | Notice that the peak stays near the same speed. Damping changes how high the peak is. Mass and stiffness decide where it is. | 📷 WIDE · Board: damping → height · Board: m and k → position | key distinction |

## Chapter 8: Worked example 2 — two extra crates (about 85 s)
WE2 with every step; the peak slides to 16 km/h.

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 8.1 | Worked example two. Two extra crates raise the sprung load to two hundred and fifty kilograms, on the same spring, three point one six times ten to the four newtons per metre. | New board: "Worked example 2" · 📷 BOARD SHOT · Board: m = 250 kg · Board: k = 3.16 × 10⁴ N/m | givens |
| 8.2 | Step one. f nought equals one over two pi, times root k over m. Thirty-one thousand six hundred over two hundred and fifty is one hundred and twenty-six point four. | Board: f₀ = (1/2π)√(k/m) · Board: k/m = 31 600/250 = 126.4 · Highlight f₀ | step 1 |
| 8.3 | Its square root is eleven point two four. Divide by two pi, six point two eight three, and f nought is one point seven nine hertz. | Board: f₀ = 11.24/6.283 = 1.79 Hz | step 1, finished |
| 8.4 | Step two. v equals d f nought, two point five times one point seven nine, which is four point four seven metres per second. | New board: "Step 2: the new speed" · Board: v = 2.5 × 1.79 = 4.47 m/s | step 2 |
| 8.5 | Step three. Four point four seven times three point six is about sixteen kilometres per hour. More load, lower f nought, lower dangerous speed. | Board: 4.47 × 3.6 ≈ 16 km/h · Box · note: more m → lower f₀ | answer + rule |
| 8.6 | On the graph, the whole peak slides left to sixteen. It reaches ten point zero centimetres, past the line's seven point eight there. At eighteen it is only three point seven. | Kit graph (AV): show 250 kg curve (pink) with the lift-off line, pulse its peak · 📷 WIDE → 250 kg peak · Board: 250 kg: 10.0 cm > 7.8 cm · Board: at 18 km/h: only 3.7 cm | the clue explained |

## Chapter 9: Case closed (the verdict, about 70 s)
Answer the hook, reject Tunde's rule, give the advice.

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 9.1 | Case closed. At eighteen kilometres per hour, the ridges push at two point zero hertz, exactly the natural frequency. That is resonance. | New board: "Case closed" · Kit shm-oscillator: scene ridge, v 18, load 200, damper leaking, trace on · Board: 18 km/h: f = 2.0 Hz = f₀ (note: story model) | return to the hook |
| 9.2 | The leaking damper lets the energy pile up until the bounce passes six point two centimetres, and the crates leave the carrier. | Kit: focus damper (low oil, piston in air) · 📷 WIDE → damper · Board: leaking damper → A > 6.2 cm | cause |
| 9.3 | Tunde's rule fails. Thirty is safe because it is far from resonance, not because it is fast. | 📷 WIDE · Kit: v 30 · Board: 30 km/h: far from f₀ · note: not "faster = worse" | misconception closed |
| 9.4 | Now the advice for Dayo and Hajia Ramatu. One. Let Mallam Sule replace the rear shock absorber. | New board: "Advice" · Kit: damper healthy, v 18 (small bounce, no lift-off) · Board: 1. replace the damper | advice 1 with reason (seen) |
| 9.5 | Two. Until then, cross the ridges at ten kilometres per hour or below. That is well under both danger speeds, whatever the load. | Kit: damper leaking, v 10 · Board: 2. cross at ≤ 10 km/h · note: below 16 and 18 | advice 2 |
| 9.6 | Why not just ride fast? To reach thirty, he must pass through sixteen and eighteen on the way, and that leaves no margin. | Board: fast = passing 16–18 km/h | why "ride faster" earns no mark (b8) |

## Chapter 10: Useful and harmful resonance (applications, about 40 s)
One useful and one harmful example, and the three ways to prevent harmful resonance.

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 10.1 | Resonance is not always the villain. A radio is tuned until its circuit resonates with one station. A guitar or talking drum body booms in resonance with the string or skin. | New board: "Useful resonance" · Kit off · Board: tuning a radio · Board: guitar, talking drum body | useful examples |
| 10.2 | Harmful resonance must be prevented. Soldiers break step on a bridge, so their footsteps cannot match its natural frequency. | New board: "Harmful: prevent it" · Board: soldiers break step on bridges | harmful example |
| 10.3 | Engineers prevent it the same ways as Dayo. Add damping, change the mass or stiffness to move f nought, or avoid that driving frequency. | Board: add damping · Board: move f₀ (change m or k) · Board: avoid that driving f | prevention (objective 05) |

## Chapter 11: Common mistakes (about 55 s)
Four errors that cost marks, each wrong then right.

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 11.1 | Mistake one. Resonance does not mean very fast vibration. The okada resonates at only two point zero hertz. Resonance means a frequency match. | New board: "Common mistakes" · Board: ✗ resonance = very fast · Board: ✓ resonance: f = f₀ | myth (topic map misconception) |
| 11.2 | Mistake two. Forgetting the units. Two point five times two point zero is five point zero metres per second, not five kilometres per hour. | Board: ✗ v = 5.0 km/h · Board: ✓ 5.0 m/s = 18 km/h | b4 mark-scheme trap |
| 11.3 | Mistake three. Flipping the fraction. d over v is the time between ridges. The frequency is v over d. | New board: "More mistakes" · Board: ✗ f = d/v · Board: ✓ f = v/d | MCQ 3/4 trap (no MCQ numbers) |
| 11.4 | Mistake four. A forced system does not vibrate at its own frequency; it follows the driver. And extra load does not steady it. It moves the danger lower. | Board: ✓ forced: at the driving f · Board: ✓ more load → lower danger speed | two misconceptions |

## Chapter 12: Summary (about 35 s)
The whole lesson on one board.

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 12.1 | To sum up. Free vibration is at f nought, damped vibration dies away, and forced vibration follows the driver. | New board: "Summary" · Board: free: f₀ · damped: A dies · Board: forced: at driving f | summary |
| 12.2 | Resonance is when the driving frequency equals f nought, giving the greatest amplitude. Barton's equal-length cone shows it. | Board: resonance: f = f₀, A greatest | summary |
| 12.3 | Ridges push at f equals v over d, so the danger speed is v equals d f nought. Damping lowers the peak. More mass moves it lower. | Board: f = v/d, v = d f₀ · Board: damping lowers, mass shifts | summary |

## Chapter 13: Your turn (about 70 s with the pause)
A fresh resonant-speed question with a load change, then the full solution.

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 13.1 | Your turn. A loaded danfo's suspension has a natural frequency of one point two hertz. Speed bumps on an estate road are four point five metres apart. | New board: "Your turn" · Board: f₀ = 1.2 Hz, d = 4.5 m | practice question |
| 13.2 | Find the speed that causes resonance, in kilometres per hour. Then say what happens to it when more passengers board. Pause the video and try it now. | Board: (a) resonant v in km/h? · Board: (b) more passengers? · hold 15 s | pause-and-try |
| 13.3 | Here is the solution. v equals d f nought, four point five times one point two, which is five point four metres per second. | New board: "Solution" · Board: v = 4.5 × 1.2 = 5.4 m/s | worked answer (a) |
| 13.4 | Times three point six gives nineteen point four four, about nineteen kilometres per hour. | Board: 5.4 × 3.6 = 19.44 · Board: \phantom{v} ≈ 19 km/h · Box | answer (a) |
| 13.5 | More passengers mean more mass, a lower natural frequency, and so a lower dangerous speed. Now on to the Apply questions. | Board: more m → lower f₀ → lower v | answer (b), hand-off to Apply |

## Build checks and kit gaps

All values recomputed with a script (`g = 9.8 m s⁻²`, `k = 31 600 N m⁻¹`, `d = 2.5 m`, `Y = 1.0 cm`).

| Check | Computed | Expected |
| --- | --- | --- |
| okada f₀ (200 kg) | √(31 600/200)/2π = 12.570/6.283 | 2.0005 → 2.0 Hz (T₀ 0.500 s) |
| Barton √ | √(0.60/9.8) | 0.24744 → 0.2474 |
| Barton T | 2π × 0.24744 | 1.5547 → 1.55 s (3 d.p. 1.555) |
| Barton f | 1/1.5547; 1/1.555 | 0.6432; 0.6431 → 0.64 Hz |
| (rounding trap, not shown) | 1/1.55 | 0.645 → 0.65 (why 1.555 is used) |
| driver 0.45 m (named only) | 2π√(0.45/9.8); 1/T | 1.346 s; 0.743 Hz (no number shown) |
| 18 km/h in m/s | 18/3.6 | 5.0 m/s |
| f at 18 km/h | 5.0/2.5 | 2.0 Hz |
| ridge gap time at 18 | 2.5/5.0 | 0.50 s (= T₀) |
| f at 10 km/h | 10/3.6/2.5 = 2.778/2.5 | 1.111 → 1.11 Hz |
| f at 30 km/h | 30/3.6/2.5 = 8.333/2.5 | 3.333 → 3.33 Hz |
| WE1 v | 2.5 × 2.0 | 5.0 m/s |
| WE1 km/h | 5.0 × 3.6 | 18 km/h |
| lift-off threshold 200 kg | 9.8/158 = 9.8/12.57² | 0.0620 m = 6.2 cm |
| bounce at 18, 200 kg leaking | response, r = 1.000, ζ 0.05 | 10.0496 (f₀ = 2.00) → 10.0 cm |
| 10.0 vs 1.0 | 10.0/1.0 | ≈ 10 × the ridge push |
| bench points (200 kg, leaking) | response at 10, 14, 16, 18, 20, 30 km/h | 1.44, 2.49, 4.40, 10.05, 3.89, 0.57 → 1.4, 2.5, 4.4, 10.0, 3.9, 0.6 cm |
| leaking peak | max over 5–35 km/h | 10.06 cm at 17.96 ≈ 18 km/h |
| lift-off line at 18 km/h | 9.8/(2π × 2.0)² | 6.21 → 6.2 cm |
| lift-off band, 200 kg leaking | A ≥ g/ω² | about 17.0 to 19.3 km/h ("narrow band") |
| healthy peak 200 kg | max of response, ζ 0.30 | 1.99 → 2.0 cm at 16.7 km/h |
| healthy never lifts off | A ≥ g/ω² anywhere 5–35 km/h, 200 and 250 kg | no speed |
| WE2 k/m | 31 600/250 | 126.4 |
| WE2 √ | √126.4 | 11.243 → 11.24 |
| WE2 f₀ | 11.24/6.283 | 1.789 → 1.79 Hz |
| WE2 v | 2.5 × 1.79 | 4.475 → 4.47 m/s (exact 4.473) |
| WE2 km/h | 4.47 × 3.6 | 16.09 → 16 km/h |
| 250 kg peak | max of response, ζ 0.05 | 10.03 → 10.0 cm at 16.06 km/h |
| line at 250 kg resonance | 9.8/(k/250) = 250 × 9.8/31 600 | 0.0775 m → 7.8 cm (= 250 kg sag) |
| 250 kg at 18 km/h | response | 3.68 → 3.7 cm |
| lift-off band, 250 kg leaking | A ≥ g/ω² | about 15.6 to 16.9 km/h |
| verdict ≤ 10 km/h | f ≤ 1.11 Hz; r ≤ 0.56 (200 kg), 0.62 (250 kg); A 1.44 / 1.62 cm vs line 20.1 cm | safe at any load |
| your turn v | 4.5 × 1.2 | 5.4 m/s |
| your turn km/h | 5.4 × 3.6 | 19.44 ≈ 19 km/h |

**Graph kit (built-in), two specs:**
- `TRACE` (chapter 2): x time 0–2 s, y displacement (no units, shapes only). `free = sin(2π·2.0·x)`; `damped = e^(−1.5x) sin(2π·2.0·x)` with a dashed envelope; `forced = 0.3 sin(2π·3.33·x)`. Labels "free: 2.0 Hz", "damped", "forced: driver's f".
- `AV` (chapters 7–8): x speed 8–32 km/h (ticks 4), y amplitude 0–12 cm (ticks 2). Curves computed from the story-model response with `r = x/(9 f₀)` (since `f = x/3.6/2.5 = x/9`): leaking 200 kg (`f₀ = 2.0`, ζ 0.05, purple), healthy 200 kg (`f₀ = 2.0`, ζ 0.30, sky), leaking 250 kg (`f₀ = 1.79`, ζ 0.05, pink); lift-off line `980/(2π x/9)²` cm, red dashed, domain 13–32 km/h (it leaves the top of the axes at 11.9 cm near 13 km/h). Bench points from the lesson's expected-results table. Curves, never straight segments.

**KIT GAP → kit request `shm-oscillator`, scenes `barton` and `ridge`** (appended to `06-videos/kit-requests/shm-oscillator.md`; scene `spring` is the lesson-02 request): scene `ridge` (okada rear on Ridge Road: speed, load, damper, bounce trace with ridge ticks, crate lift-off, amplitude gauge with threshold, `f = v/d` readout) and scene `barton` (driver + five paper cones on a taut cord, steady-state amplitudes from the driven-oscillator model). Used in chapters 1, 3, 4, 5, 6, 9.
*Fallback if the kit cannot be built:* chapter 1/3/5/6/9 lose the moving okada; use the board plus the `graph` kit (an `x`–`t` trace of the rear growing at 18 km/h, ridge hits as `points`); chapter 4 becomes board-only with a `graph` bar-style plot of cone amplitude against length (peak at 0.60 m). The film would teach the same steps but lose the "pushes in step" picture, which is the heart of the lesson, so the kit is strongly preferred.
