# Direction Script: Lesson 03 · SHM as a Circle's Shadow: Displacement, Velocity and Acceleration

## Overview
The video answers the lesson's guiding question, *when exactly do the crates leave the carrier?* It turns Mrs Okafor's
spinning wheel into the reference circle, derives `x = A sin ωt`, `v = ω√(A² − x²)` and `a = −ω²x`, shows that speed peaks at
the centre and acceleration at the ends (against Tunde's "fastest" idea), reads the three time-graphs, works the lesson's
examples, and ends with the lift-off rule `ω²A ≥ g`. It opens the **Make Sense** phase, after the wheel-and-shadow bench.
Quizzes stay in Apply.

| Item | Decision |
| --- | --- |
| Running time | About 12 minutes (1 612 words at about 2.4 words per second, plus a 5 s and a 15 s hold), 13 chapters, 66 narration lines; under the 14 minute split limit |
| Narrator | One teacher voice, Nigerian English |
| Level | SS2 Physics, WAEC / NECO / JAMB |
| Theme | Unit theme (`meta.theme` unset; the unit is editorial-ink) |
| Kits used | `reference-circle` (plug-in, **requested**: `06-videos/kit-requests/reference-circle.md`) in its four scenes `wheel`, `circle`, `traces`, `carrier` · board only for worked example 1, the mistakes, the summary and the your-turn |
| Camera | Wide by default; wide + focus on the lump, the shadow, the angle, the crate and the carrier top; board shot for worked example 1 |
| End card | `meta.next: '#apply'`, `nextLabel: 'Continue to Apply →'` |

**Colour roles** (match the lesson bench: `v` teal → `sky`, `a` amber):

| Symbol | Meaning | Colour |
| --- | --- | --- |
| `x` | displacement of the shadow / carrier | green |
| `v` | velocity, speed, `v_max` | sky |
| `a` | acceleration, `a_max`, `ω²A` | amber |
| `ω` | angular frequency, the angle `ωt` | purple |
| `g` | acceleration of free fall, the crate's weight | red |

**Accuracy notes:**
- **Story numbers are a teaching model** (02-lesson.md story model table), not measurements. Said aloud in 8.1 and 9.1 and
  tagged "model" on the board. Okada: `ω = √(k/m) = √158 = 12.57 rad s⁻¹` (≈ 4π), `ω² = 158 s⁻²`, `f₀ = 2.00 Hz`,
  `g = 9.8 m s⁻²`, threshold `g/ω² = 6.2 cm` = static sag `mg/k`. The okada scene plays in slow motion (said in 9.1).
- **Lift-off, physically:** the carrier can only push up on the crate; only gravity pulls it down, so the crate's downward
  acceleration can never exceed `g`. The carrier's downward acceleration is `ω²x`, greatest at the top (`ω²A`). Strictly, the
  crate separates where `ω²x` first exceeds `g` (in the upper part of the travel, while the carrier is still rising and
  slowing) and this is the very top only at the threshold. So narration says "**near** the top" and "almost still", and the
  rule is stated as the lesson states it: lift-off when `ω²A ≥ g`; crates stay on while `A < g/ω²`. The kit computes the
  separation point (kit request § Accuracy).
- **Timing from the centre:** `x = A sin ωt` with P starting level with O (3.3). Lab wheel `A = 0.30 m`, `T = 2.0 s`,
  `ω = π = 3.14 rad s⁻¹` exactly as the bench table: 30° → x 0.150 m, a −1.48 m s⁻²; v_max 0.942 m s⁻¹; a_max 2.96 m s⁻².
  On the lab board, angles are given in degrees (sin 30°) because the bench pauses at marked angles; when `ωt` comes from a
  time (example 2) it is in radians, and the video says so twice (3.5, 8.3) and makes it mistake three.
- `v = ω√(A² − x²)` is the **speed** (size); 4.4 says so. The sign of `v` is shown by the kit arrow only.
- Worked examples 1–4 use the lesson's exact numbers (02-lesson.md § Lesson 03, Apply). Example 3 uses `ω = 12.6` for
  `v_max` as the lesson does (12.6 × 0.030 = 0.378 ≈ 0.38 m s⁻¹; with 12.57 it is 0.377, the same to 2 s.f.).
- Nothing here gives away a Lesson 03 MCQ or Part B answer that the lesson does not already show (b5(b) = worked example 4,
  which the lesson prints in Apply). MCQ 12 (Tunde) is the hook's question, but the video's wording differs and the MCQ
  stays in the quiz.
- **Your-turn numbers are fresh:** a garri-mill sieve shaking at 4.0 Hz; answer `A = g/ω² = 9.8/632 = 0.0155 m ≈ 1.6 cm`.
  Grepped 02-lesson.md and 03-questions.md: no 4.0 Hz, 631/632 or 1.6 cm item. (A 5.0 Hz version was rejected because its
  `ω² ≈ 987` is a distractor in MCQ 3.)
- 10.7 links the threshold to the static sag (`mg/k = g/ω²`) and only teases the resonance cause ("a later lesson");
  the 18 km/h answer belongs to lesson 07.

## Chapter 1: When do the crates jump? (hook, about 45 s)
The lesson's question and Tunde's claim, then the promise of the video.

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 1.1 | Dayo rides his okada over the ridges, and the egg crates rattle on the carrier. Sometimes they jump clean off. But at what moment, exactly? | New board: "When do the crates jump?" · Kit reference-circle: scene=carrier, A=3.0 cm, omega=12.57, slow=0.25, spin=1, forces=0, verdict=0 | hook |
| 1.2 | Tunde is sure. He says they jump where the bike is moving fastest. Zainab is not so sure. | Board: Tunde: "where it's fastest" ? | misconception on the table |
| 1.3 | Mrs Okafor puts the okada on its stand and spins the back wheel. Watch the shadow of a mud lump on the tyre. | Kit: scene=wheel, A=0.30 m, omega=3.14, slow=1, spin=1, sun=1, labels=1 · 📷 WIDE → lump | the story's model |
| 1.4 | By the end, you will use x equals A sine omega t, find speed and acceleration anywhere in the bounce, and predict when the crates leave. | New board: "By the end of this video" · Board: ☐ SHM = a circle's shadow · ☐ x = A sin ωt · ☐ v and a anywhere · ☐ lift-off: ω²A ≥ g · 📷 WIDE | objectives |

## Chapter 2: The mud lump's shadow (about 55 s)
The shadow of steady circular motion moves in SHM, with amplitude = radius and the same period.

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 2.1 | The lump goes round the wheel at a steady rate. The midday sun is overhead, so its shadow falls straight down onto the ground. | New board: "The lump's shadow" · Kit: focus=lump · Board: steady circle above | observe the cause |
| 2.2 | Now watch only the shadow. It slows and stops at each end, and rushes through the middle. That is the carrier's bounce: simple harmonic motion. | Kit: focus=shadow · 📷 WIDE → ground · Board: shadow slides to and fro · Board: shadow → SHM | observe and name it |
| 2.3 | Two things to notice. The shadow's path is one diameter long, so its amplitude equals the radius of the wheel. | Kit: focus=null, bracket=1 · 📷 WIDE · Board: amplitude A = radius | property 1 |
| 2.4 | And one turn of the wheel is one full oscillation of the shadow. So they share the same period, and the same omega. | Board: same T, same ω · Box | property 2 |

## Chapter 3: The reference circle and x = A sin ωt (about 1 min 25 s)
From the wheel to the abstract reference circle, and the displacement formula with the lab numbers.

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 3.1 | Now shine the light from the side instead. The shadow climbs and falls on a wall, up and down, just like the carrier. | New board: "The reference circle" · Kit: scene=circle, A=0.30 m, omega=3.14, spin=1, labels=1, bracket=0 | turn the picture upright |
| 3.2 | This is the reference circle. Its radius is the amplitude, A. The point P goes round at a steady angular speed, omega. | Board: radius = A · Board: P turns at steady ω · Highlight ω | definition |
| 3.3 | We start the clock when P is level with the centre, so the shadow N starts at the middle, moving up. | Kit: spin=0, theta=0, xbar=1 · 📷 WIDE → shadow · Board: t = 0: x = 0 | timing from the centre |
| 3.4 | After a time t, the radius has turned through an angle omega t. The height of P, and of its shadow, is A sine omega t. | Kit: theta=30 · 📷 WIDE → angle · Board: angle turned = ωt · Board: x = A sin ωt · Box | derivation |
| 3.5 | Omega t is an angle in radians. Ninety degrees is pi over two, and thirty degrees is pi over six, about zero point five two four radians. | New board: "Angles in radians" · 📷 WIDE · Board: 90° = π/2 rad · Board: 30° = π/6 = 0.524 rad (note: RAD mode) | radians |
| 3.6 | Try the lab wheel: radius zero point three zero metres, period two point zero seconds. Omega is two pi over two point zero, about three point one four radians per second. | Board: A = 0.30 m, T = 2.0 s · Board: ω = 2π/2.0 = 3.14 rad/s | lab numbers |
| 3.7 | At thirty degrees, x is zero point three zero times sine thirty degrees, which is zero point one five zero metres, as in the lab table. | Kit: theta=30, pins=[30], readout=1 · Board: x = 0.30 sin 30° = 0.150 m | check with the bench |

## Chapter 4: Where is the shadow fastest? (about 1 min 25 s)
Speed peaks at the centre: `v = ωA cos ωt = ω√(A² − x²)`, `v_max = ωA`.

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 4.1 | Pause and predict. Where does the shadow move fastest, at the middle, or at the ends? | New board: "Where is it fastest?" · Board: middle or ends? · Kit: spin=1, readout=0, pins=[] · **hold 5 s** | predict |
| 4.2 | P always moves at the same speed, omega A, along the circle. But only the up and down part of that velocity moves the shadow. | Kit: spin=0, theta=30, components=1, varrow=1 · 📷 WIDE → lump · Board: P's speed = ωA, always | cause |
| 4.3 | At the middle, P is moving straight up, so the shadow gets all of omega A. At the top, P moves sideways, and the shadow stops. | Kit: theta=0, then theta=90 (at 5 s) · 📷 WIDE → shadow · Board: middle: v = ωA · Board: top: v = 0 | the two extremes |
| 4.4 | In between, the shadow's velocity is omega A cos omega t. Using sine squared plus cos squared equals one, its speed is omega root A squared minus x squared. | New board: "Speed anywhere" · Kit: theta=60, components=0 · 📷 WIDE · Board: v = ωA cos ωt · Board: v = ω√(A² − x²) · Box | formula |
| 4.5 | So the speed is greatest at the centre, where x is zero. V max equals omega A, zero point nine four two metres per second for the lab wheel. | Kit: theta=0, readout=1 · Board: v_max = ωA (at x = 0) · Board: = 3.14 × 0.30 = 0.942 m/s · Highlight v | v_max with lab number |
| 4.6 | Tunde's idea fails already. The ends are where the carrier is momentarily still, not fastest. | Kit: theta=90 · Board: ends: v = 0 (note: not fastest!) | misconception corrected |

## Chapter 5: Acceleration always points home (about 1 min 35 s)
`a = −ω²x`: zero at the centre, greatest (`ω²A`) at the ends; checked against the bench.

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 5.1 | The shadow speeds up towards the middle and slows down away from it. So its acceleration always points back to the centre. | New board: "Acceleration" · Kit: spin=1, varrow=1, aarrow=1, readout=0 · 📷 WIDE → shadow · Board: a always towards O | observe |
| 5.2 | P is in circular motion, so it has a centripetal acceleration of omega squared A, towards the centre. The shadow gets only its up and down part. | Kit: spin=0, theta=60, components=2 · 📷 WIDE · Board: P: ω²A towards O | cause (SS2 circular motion) |
| 5.3 | That part is minus omega squared x. It is the SHM condition from lesson two: acceleration proportional to displacement, and opposite to it. | Board: a = −ω²x · Box · Highlight a | formula, link back |
| 5.4 | So the acceleration is zero at the centre, and greatest at the ends, where its size is omega squared A. | Kit: components=0, theta=0, then theta=90 (at 3 s) · Board: a_max = ω²A (at x = ±A) | where a peaks |
| 5.5 | On the lab wheel, a max is pi squared times zero point three zero, which is two point nine six metres per second squared. | New board: "Check with the lab" · Kit: readout=1 · Board: a_max = π² × 0.30 = 2.96 m/s² | lab number |
| 5.6 | At thirty degrees, a over x is minus one point four eight over zero point one five zero. That is minus nine point eight seven, which is minus pi squared, minus omega squared. | Kit: theta=30, pins=[30, 60] · Board: a/x = −1.48 ÷ 0.150 · Board: = −9.87 = −π² = −ω² | check |
| 5.7 | So speed peaks at the centre, and acceleration peaks at the ends. Never in the same place. | Kit: pins=[0, 90], readout=0 · Board: v_max at centre, a_max at ends · Box | big idea |

## Chapter 6: Three graphs, one motion (about 55 s)
x, v and a against t, in true phase.

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 6.1 | Let the wheel turn, and plot all three against time on one time line. | New board: "x, v, a against t" · Kit: scene=traces, spin=1, show=[], cursor=1, pins=[] · 📷 WIDE | set up |
| 6.2 | Displacement is a sine curve, starting at zero and rising. | Kit: show=[x] · 📷 WIDE → traces-x · Board: x: sine, starts at 0 | graph 1 |
| 6.3 | Velocity is a cosine curve. It is a quarter of a cycle ahead, at its peak whenever x passes through zero. | Kit: show=[x, v] · 📷 WIDE → traces-v · Board: v: cosine, ¼ cycle ahead | graph 2 |
| 6.4 | Acceleration is x turned upside down, half a cycle out of step. Where x is greatest, a is most negative. | Kit: show=[x, v, a] · 📷 WIDE → traces-a · Board: a: x upside down | graph 3 |

## Chapter 7: Speed and acceleration at a point (worked example 1, about 1 min 20 s)
Lesson worked example 1, every step on the board.

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 7.1 | Worked example. A body in SHM has amplitude zero point one zero metres and omega five point zero radians per second. Find its speed and acceleration when x is zero point zero six zero metres. | New board: "Example 1" · Kit off (panel null) · 📷 BOARD SHOT · Board: A = 0.10 m, ω = 5.0 rad/s · Board: x = 0.060 m: v = ? a = ? | question |
| 7.2 | Step one, the speed. V equals omega root A squared minus x squared. Square first, then subtract: zero point zero one zero minus zero point zero zero three six. | Board: v = 5.0√(0.010 − 0.0036) (note: square first) | step 1 |
| 7.3 | That leaves zero point zero zero six four. Its root is zero point zero eight zero, and five point zero times that is zero point four zero metres per second. | Board: = 5.0 × 0.080 = 0.40 m/s · Box | step 1 result |
| 7.4 | Step two, the acceleration. Minus omega squared x is minus twenty-five times zero point zero six zero, which is minus one point five metres per second squared. The minus sign means it points towards the centre. | New board: "Example 1 (continued)" · Board: a = −25 × 0.060 = −1.5 m/s² · Board: 1.5 m/s² towards centre | step 2, sign meaning |
| 7.5 | Step three. The maximum speed is omega A, five point zero times zero point one zero, which is zero point five zero metres per second. Our zero point four zero is less. It works. | Board: v_max = 5.0 × 0.10 = 0.50 m/s · Board: 0.40 < 0.50 ✓ · Box · 📷 WIDE | step 3 and check |

## Chapter 8: Radians, not degrees (worked example 2, about 1 min 5 s)
Lesson worked example 2 on the okada model, and the degree-mode trap.

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 8.1 | Example two, on the okada model. The carrier bounces with amplitude five point zero centimetres at two point zero hertz, timed from the centre. Find x at zero point zero six two five seconds. | New board: "Example 2 (model)" · Kit: scene=circle, A=5.0 cm, omega=12.57, spin=0, theta=0, labels=1, xbar=1, varrow=0, aarrow=0 · Board: A = 5.0 cm, f = 2.0 Hz · Board: t = 0.0625 s: x = ? | question |
| 8.2 | Step one. Omega is two pi f, which is four pi radians per second. | Board: ω = 2πf = 4π rad/s | step 1 |
| 8.3 | Step two. Omega t is four pi times zero point zero six two five, which is pi over four radians. Put your calculator in radian mode. | Kit: theta=45 · 📷 WIDE → angle · Board: ωt = 4π × 0.0625 = π/4 rad (note: RAD mode) | step 2 |
| 8.4 | Step three. x is five point zero times sine pi over four. That is five point zero times zero point seven zero seven, about three point five centimetres. | New board: "Example 2: step 3" · Kit: readout=1 · 📷 WIDE · Board: x = 5.0 sin(π/4) · Board: = 5.0 × 0.707 ≈ 3.5 cm · Box | step 3 |
| 8.5 | In degree mode, the same keys give about zero point zero six nine centimetres. A shadow that has hardly moved. That is the classic radian slip. | Board: degree mode: 0.069 cm ✗ | the trap |

## Chapter 9: Why the crates lift off (about 1 min 25 s)
Only gravity pulls the crate down; the carrier can only push up. Lift-off when `ω²A ≥ g`.

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 9.1 | Now the real question. In our story model, omega is twelve point five seven radians per second, so omega squared is one hundred and fifty-eight. Teaching numbers, shown in slow motion. | New board: "The crate on the carrier" · Kit: scene=carrier, A=3.0 cm, omega=12.57, slow=0.25, spin=1, forces=0, verdict=0 · Board: ω = 12.57 rad/s (model) · Board: ω² = 158 s⁻² | model, labelled |
| 9.2 | Look at the forces on a crate. Gravity pulls it down. The carrier pushes it up. But the carrier cannot pull it down. It can only push. | Kit: forces=1 · 📷 WIDE → crate · Board: weight ↓, carrier's push ↑ (note: no pull down) | forces |
| 9.3 | So nothing can make the crate accelerate downwards faster than g, nine point eight metres per second squared. Only gravity pulls it down. | Board: crate's a downwards ≤ g · Board: g = 9.8 m/s² · Highlight g | the key limit |
| 9.4 | Near the top of the bounce, the carrier is almost still, but it accelerates downwards hardest, at omega squared A. | New board: "At the top" · Kit: spin=0, theta=90 · 📷 WIDE → carrier · Board: carrier: a = ω²A downwards | the carrier's side |
| 9.5 | If omega squared A is bigger than g, the carrier drops away faster than the crate can fall. The crate is left in the air. | Kit: A=8.0 cm, spin=1 · 📷 WIDE → crate · Board: ω²A > g: carrier drops away · Board: lift-off: ω²A ≥ g · Box | the rule |
| 9.6 | So Tunde was wrong. The crates leave where the carrier is almost still but accelerating down hardest, not where it moves fastest. | Kit: A=3.0 cm · 📷 WIDE · Board: not fastest: biggest a ↓ | close the hook |

## Chapter 10: Stay on or fly? (worked examples 3 and 4, about 1 min 40 s)
A gentle bounce, the threshold amplitude, and an 8 cm bounce that throws the crate.

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 10.1 | Example three. A gentle bounce of amplitude three point zero centimetres. A max is one hundred and fifty-eight times zero point zero three zero, which is four point seven metres per second squared. | New board: "Example 3: A = 3.0 cm" · Kit: A=3.0 cm, verdict=1 · Board: a_max = 158 × 0.030 · Board: = 4.7 m/s² | example 3, step 1 |
| 10.2 | Four point seven is less than nine point eight. The carrier never falls away faster than the crate. The crates stay on. | 📷 WIDE → crate · Board: 4.7 < 9.8: crates stay ✓ | compare |
| 10.3 | Its top speed, omega A, is twelve point six times zero point zero three zero, only about zero point three eight metres per second. | 📷 WIDE · Board: v_max = 12.6 × 0.030 ≈ 0.38 m/s | example 3, v_max |
| 10.4 | Example four. What is the smallest amplitude that throws the crates? Set omega squared A equal to g, so A equals g over omega squared. | New board: "Example 4: threshold" · Board: ω²A = g → A = g/ω² | example 4, step 1 |
| 10.5 | A is nine point eight over one hundred and fifty-eight, which is zero point zero six two metres, or six point two centimetres. | Board: A = 9.8/158 = 0.062 m · Board: \phantom{A} = 6.2 cm · Box | example 4 result |
| 10.6 | Watch an eight centimetre bounce. A max is about twelve point six metres per second squared, more than g. Up goes the crate. | Kit: A=8.0 cm, spin=1 · 📷 WIDE → crate · Board: A = 8 cm: 12.6 > 9.8, lifts ✗ | see the rule work |
| 10.7 | Notice: six point two centimetres is also the okada's static sag, since m g over k equals g over omega squared. What pumps the bounce that big? A later lesson. | New board: "A clue" · Kit: A=3.0 cm · 📷 WIDE · Board: sag = mg/k = g/ω² = 6.2 cm | link + mystery thread |

## Chapter 11: Common mistakes (about 55 s)
Each error shown wrong, then right.

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 11.1 | Mistake one. Fastest at the ends. No. At the ends the body stops and turns round. It is fastest at the centre. | New board: "Common mistakes" · Kit off (panel null) · Board: ✗ fastest at ends → ✓ centre | mistake 1 |
| 11.2 | Mistake two. Acceleration is zero at the top because it stops. No. The speed is zero there, but the acceleration is greatest. | Board: ✗ a = 0 at ends → ✓ a = ω²A | mistake 2 |
| 11.3 | Mistake three. Degree mode when omega t comes from a time. Omega t is in radians. | Board: ✗ DEG mode → ✓ RAD for ωt | mistake 3 |
| 11.4 | Mistake four. Amplitude left in centimetres. For metres per second, change A to metres first. | New board: "More mistakes" · Board: ✗ A in cm → ✓ A in metres | mistake 4 |
| 11.5 | Mistake five. Mixing them up. Omega A is the top speed; omega squared A is the top acceleration. | Board: ωA = v_max · Board: ω²A = a_max | mistake 5 |

## Chapter 12: Summary (about 35 s)

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 12.1 | To sum up. SHM is the shadow of steady circular motion, with amplitude equal to the radius. Displacement is A sine omega t, with omega t in radians. | New board: "Summary: a circle's shadow" · Board: x = A sin ωt (radians) | summary |
| 12.2 | Speed is omega root A squared minus x squared, greatest at the centre. Acceleration is minus omega squared x, greatest at the ends. And a loose load lifts off when omega squared A reaches g. | Board: v = ω√(A² − x²), max ωA · Board: a = −ω²x, max ω²A · Board: lift-off: ω²A ≥ g · Box | summary |

## Chapter 13: Your turn (about 1 min 15 s)
Fresh numbers; pause-and-try, then the full solution.

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 13.1 | Your turn. A garri sieve shakes up and down in SHM at four point zero hertz. Taking g as nine point eight, what is the smallest amplitude that makes the grains hop? Pause and try. | New board: "Your turn" · Board: sieve: f = 4.0 Hz, g = 9.8 m/s² · Board: smallest A for hopping? · **hold 15 s** | practice |
| 13.2 | Omega is two pi times four point zero, about twenty-five point one radians per second. Omega squared is about six hundred and thirty-two. | Board: ω = 2π × 4.0 = 25.1 rad/s · Board: ω² ≈ 632 s⁻² | solution 1 |
| 13.3 | A equals g over omega squared, nine point eight over six hundred and thirty-two. That is about zero point zero one five five metres, or one point six centimetres. | Board: A = 9.8/632 ≈ 0.0155 m · Board: \phantom{A} ≈ 1.6 cm · Box | solution 2 |
| 13.4 | Any bigger, and the tray falls away faster than the grains can fall. Now go on to Apply. | Board: A > 1.6 cm: grains hop | close |

## Build checks and kit gaps

All values recomputed with a script (`g = 9.8`, `π` unrounded).

| Check | Computed | Expected |
| --- | --- | --- |
| lab ω | 2π/2.0 | π = 3.14 rad s⁻¹ |
| 30° in rad | π/6 | 0.524 rad |
| lab x at 30° | 0.30 sin 30° | 0.150 m |
| lab v_max | π × 0.30 = 0.9425 | 0.942 m s⁻¹ |
| lab a_max | π² × 0.30 = 2.9609 | 2.96 m s⁻² |
| lab a at 30° (bench table) | −π² × 0.150 = −1.4804 | −1.48 m s⁻² |
| a/x at 30° | −1.48/0.150 = −9.867; −π² = −9.8696 | −9.87 s⁻² |
| WE1 inside root | 0.10² − 0.060² | 0.0064 m² |
| WE1 root | √0.0064 | 0.080 m |
| WE1 v | 5.0 × 0.080 | 0.40 m s⁻¹ |
| WE1 ω² | 5.0² | 25 s⁻² |
| WE1 a | −25 × 0.060 | −1.5 m s⁻² |
| WE1 v_max | 5.0 × 0.10 | 0.50 m s⁻¹ |
| WE2 ω | 2π × 2.0 | 4π = 12.57 rad s⁻¹ |
| WE2 ωt | 4π × 0.0625 = 0.7854 | π/4 rad |
| WE2 sin(π/4) | 0.70711 | 0.707 |
| WE2 x | 5.0 × 0.70711 = 3.536 | ≈ 3.5 cm |
| WE2 degree-mode slip | 5.0 × sin(0.7854°) = 0.06854 | ≈ 0.069 cm |
| okada ω, ω² | √(31 600/200) = √158 = 12.570 | 12.57 rad s⁻¹, 158 s⁻² |
| WE3 a_max | 158 × 0.030 = 4.74 | 4.7 m s⁻² |
| WE3 compare | 4.74 < 9.8 | stays on |
| WE3 v_max | 12.6 × 0.030 = 0.378 (12.57 × 0.030 = 0.377) | ≈ 0.38 m s⁻¹ |
| WE4 threshold | 9.8/158 = 0.06203 | 0.062 m = 6.2 cm |
| 8 cm bounce | 158 × 0.080 = 12.64 | ≈ 12.6 m s⁻² (> 9.8, lifts) |
| static sag | 200 × 9.8/31 600 = 0.06203 | 6.2 cm (= g/ω²) |
| your-turn ω | 2π × 4.0 = 25.13 | 25.1 rad s⁻¹ |
| your-turn ω² | 25.133² = 631.65 | ≈ 632 s⁻² |
| your-turn A | 9.8/631.65 = 0.015515 (9.8/632 = 0.015506) | ≈ 0.0155 m ≈ 1.6 cm |
| kit: lab table (kit readouts) | 0°, 30°, 60°, 90° | x 0, 0.150, 0.260, 0.300 m · v 0.942, 0.816, 0.471, 0 m s⁻¹ · a 0, −1.48, −2.56, −2.96 m s⁻² |

**KIT GAP → requested: `reference-circle`** (`06-videos/kit-requests/reference-circle.md`). Scenes `wheel` (chapters 1–2),
`circle` (3–5, 8), `traces` (6), `carrier` (1, 9–10). States used above: `scene, A, unit, omega, spin, theta, slow, labels,
sun, bracket, xbar, varrow, aarrow, components, pins, readout, show, cursor, forces, verdict, focus`. Close-ups used: `lump`,
`ground`, `shadow`, `angle`, `traces-x/v/a`, `carrier`, `crate`. The plan is written only once the kit exists, using the
state names from its README (rename in the plan if the engineer's README differs).
**Fallback if the kit cannot be built:** chapters 3–5 and 8 on the board with the built-in `graph` kit drawing a circle
(`fn` halves) and a vertical axis with points; chapter 6 with `graph` (`0.30*sin(PI*x)`, `0.942*cos(PI*x)`,
`-2.96*sin(PI*x)` on three specs); chapters 1, 2, 9, 10 board-only with Mrs Okafor's wheel and the crate named, not shown.
This loses the key visual (the crate leaving the carrier), so the kit is strongly preferred.
