# Direction Script: Lesson 02 · The Pull Back to the Middle — Restoring Force, the SHM Condition and the Loaded Spring

## Overview
The video answers the lesson's guiding question (what makes a motion *simple harmonic*, and why do extra crates slow the bounce?). It goes from Hooke's law, through the restoring force `F = −kx`, the SHM condition `a = −ω²x`, to `T = 2π√(m/k)`. Then it works the two § 7 examples (finding k then T; the okada going from 200 kg to 250 kg) and finds k from the bench's `T²`–`m` graph. It settles Tunde's "heavier is steadier". It opens the **Make Sense** phase, after the spring bench (2B). The 12-question quiz and Worked Examples 2 and 4 stay in Apply.

| Item | Decision |
| --- | --- |
| Running time | About 10.5 minutes, 11 chapters, 61 narration lines, plus one 15 s pause-and-try |
| Narrator | One teacher voice, Nigerian English |
| Level | SS2 Physics, WAEC / NECO / JAMB |
| Theme | Unit theme (`meta.theme` unset; the unit uses editorial-ink) |
| Kits used | `shm-oscillator` (plug-in, **requested**: `06-videos/kit-requests/shm-oscillator.md`) for the lab spring and the okada model · built-in `graph` for the F–x, a–x and T²–m graphs · board only for the worked-example steps, mistakes and summary |
| Camera | Wide by default. Push-ins on the pointer, the mass and its arrows, and the two springs side by side. Board shots for the worked examples. Wide + focus on the gradient triangles. One kit close-up (no board writing) while the arrow follows the moving mass |
| End card | `meta.next: '#apply'`, `nextLabel: 'Continue to Apply →'` |
| Caption fixes | `'S H M'` → `'SHM'` · `'F x graph'` → `'F–x graph'` · `'a x graph'` → `'a–x graph'` · `'T squared m graph'` → `'T²–m graph'` |

**Colour roles** (match the lesson's 3D zoom, where the restoring-force arrow is red and the equilibrium line is dashed):

| Symbol | Meaning | Colour |
| --- | --- | --- |
| `x` | displacement from equilibrium (also extension) | blue |
| `F` | force: weight, stretching force, restoring force | red |
| `a` | acceleration (`ω²` too) | purple |
| `m` | mass / load | orange |
| `k` | spring constant | green |
| `T` | period (and `f`) | gold |

**Accuracy notes:**
- **Story model.** The okada values (k = 3.16 × 10⁴ N m⁻¹, 200 kg / 250 kg) are the unit's **teaching model, not measurements**. Line 1.3 says so aloud. The kit's okada tags carry "(model)", and the board in chapter 7 carries the note "model".
- **Where x is measured from.** For a vertical spring, x is measured from the **loaded equilibrium position**, not from the natural length. At equilibrium the static stretch already balances the weight (kx₀ = mg, 0.200 kg → x₀ = 8.0 cm on the bench spring). The *extra* stretch x then gives the restoring force −kx. Line 3.1 shows the balance and line 3.7 says this aloud.
- **Bench spring.** All lab numbers come from the lesson's model spring, k = 24.5 N m⁻¹ (its own mass ignored, as 02-lesson.md says), and its expected-results table: 50 g → 2.0 cm … 250 g → 10.0 cm, T² = 0.0806 … 0.403 s². Gradient 0.403 ÷ 0.250 = 1.61 s² kg⁻¹ and k = 39.5 ÷ 1.61 = 24.5 N m⁻¹. These agree with Hooke's law, exactly as the lesson says.
- **Chapters 3–5 use bench values that are not in the lesson.** These are 200 g displaced 2.0 cm and 4.0 cm (restoring force 0.49 N and 0.98 N), k/m = 122.5 s⁻², a = 2.45 m s⁻², and T = 0.568 s at amplitudes 1.0 cm and 3.0 cm. They come from the same k = 24.5 N m⁻¹ spring. None of them is an MCQ or Part B answer (MCQ 11 uses 40 N m⁻¹ / 0.25 kg / 3.0 cm → 4.8 m s⁻²; it is not touched).
- **Worked examples** use 02-lesson.md's exact numbers: WE1 (0.30 kg, 6.0 cm → 49 N m⁻¹, 0.49 s) and WE3 (okada 0.50 s → 0.56 s, 2.0 Hz → 1.79 Hz). Line 7.3 links T₁ = 0.50 s to Lesson 01's timing (20 bounces in 10.0 s). The ratio check √1.25 = 1.12 is the method of Part B b5(c). The video shows it as a *check*, so b5 still needs the student's own working.
- **Bouncing-ball contrast (4.7).** Between bounces the only force is the weight, so a = −9.8 m s⁻² at every height: a flat line on an a–x sketch. This is the reason given in MCQ 12. The video gives the principle without quoting the MCQ. The sketch is labelled "ball (between bounces)".
- **Mistakes chapter** names the errors behind MCQ 2, 5 and 10 (mass used as force, centimetres not converted, √(k/m) upside down, amplitude thought to change T). It uses WE1's numbers, never an MCQ's own numbers, so no quiz answer is given away.
- **Your-turn numbers are fresh.** The question is 0.40 kg stretching a spring by 4.9 cm, g = 9.8 m s⁻² → k = 80 N m⁻¹, T = 0.44 s. I grepped 02-lesson.md and 03-questions.md: "80 N m⁻¹" appears only in L06 MCQ 2 (an energy question, different mass). "0.40 kg" appears only in L06 MCQ 3 (k = 40). No loaded-spring k-then-T question uses these numbers. The check uses m/k = x/g (from kx = mg), the same identity as WE1's check and the story model's "sag/g".
- "Heavier is slower, not steadier" is stated for **springs**. Lesson 04 shows that a pendulum's period does not depend on mass. The video says nothing about pendulums, so the two lessons do not clash.

## Chapter 1: Heavier means steadier? (hook and objectives, about 0 min 50 s)
Raises Tunde's misconception with the story, then sets the exam tasks.

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 1.1 | Dayo has loaded two extra crates for Hajia Ramatu. Tunde is sure about it. Heavy things don't bounce, so a heavier okada should ride steadier. | New board: "Heavier = steadier?" · Kit shm-oscillator: scene spring, skin okada, n 1, m 200, k 31600, tag "200 kg (model)", eq 1, osc 1, A 0.02 · Board: Tunde: heavy → no bounce? | Hook (story, misconception) |
| 1.2 | But Zainab presses the loaded carrier and watches. It still bounces. It just looks lazier. So who is right? | Kit: n 2, m2 250, tag2 "250 kg (model)", osc2 1, A2 0.02 · 📷 WIDE → both springs · Board: Zainab: still bounces, slower? | Hook (the two claims side by side) |
| 1.3 | A quick note. These okada numbers are a teaching model, not measurements from a real motorcycle. | 📷 WIDE · Board: okada numbers = model (note: not measured) | Accuracy (story model labelled) |
| 1.4 | By the end of this video, you will find a spring constant, state the condition for S H M, use T equals two pi root m over k, and find k from a graph. | New board: "By the end of this video" · Board: ☐ find k from F = kx · Board: ☐ state the SHM condition · Board: ☐ use T = 2π√(m/k) · Board: ☐ k from a T²–m graph | Objectives |

## Chapter 2: An even pull: Hooke's law (about 1 min 20 s)
Equal steps of load give equal steps of stretch. The spring constant is the gradient of F against x.

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 2.1 | Now to Mrs Okafor's lab. A spiral spring hangs from a clamp, with a pointer beside a metre rule. | New board: "Hooke's law" · Kit shm-oscillator: skin lab, n 1, m 0, k 24.5, ruler 1, eq 0, osc 0, tag "" · 📷 WIDE | Setup (experiment shown before anything happens) |
| 2.2 | She adds fifty grams. Its weight, zero point four nine zero newtons, pulls the pointer down two point zero centimetres. | Kit: m 0.050, reading "2.0 cm" · 📷 WIDE → pointer · Board: 0.050 kg → 0.490 N, 2.0 cm | Observation |
| 2.3 | Another fifty grams, another two point zero centimetres. A third, and the same again. Equal steps of load give equal steps of stretch. | Kit: m 0.100, reading "4.0 cm", then (at 3 s) m 0.150, reading "6.0 cm" · Board: 0.100 kg → 4.0 cm · Board: 0.150 kg → 6.0 cm | Pattern |
| 2.4 | This is Hooke's law. Provided the elastic limit is not exceeded, the extension is directly proportional to the stretching force. | 📷 WIDE · Board: F = kx (note: within elastic limit) · Box | Definition (WAEC wording) |
| 2.5 | Plot all five loads, up to two hundred and fifty grams. The F x graph is a straight line through the origin. Its gradient is the spring constant, k. | New board: "The spring constant" · Kit graph [FX]: show pts, then line · Board: F–x: straight line through 0 | Graph |
| 2.6 | Gradient: two point four five newtons over zero point one zero zero metres. That is twenty-four point five newtons per metre. | Kit graph: show pts+line+tri, pulse tri · 📷 WIDE → tri · Board: k = 2.45/0.100 · Board: \phantom{k} = 24.5 N m⁻¹ · Box | Step |
| 2.7 | So k is the force needed for each metre of extension. Always change centimetres to metres before you divide. | 📷 WIDE · Board: k = F/x, unit N m⁻¹ (note: x in metres) | Consolidate (unit trap) |

## Chapter 3: The pull back to the middle (about 1 min 25 s)
The restoring force grows with displacement and always points back to equilibrium: F = −kx.

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 3.1 | Hang two hundred grams and let it settle. This resting point is the equilibrium position. Here the spring's pull exactly balances the weight. | New board: "Restoring force" · Kit shm-oscillator: skin lab, m 0.200, reading "8.0 cm", eq 1, balance 1, x 0 · 📷 WIDE → mass · Board: at rest: spring pull = mg | Setup (equilibrium) |
| 3.2 | Pull the mass down two point zero centimetres more. The spring stretches further and pulls back with an extra zero point four nine newtons, upwards. | Kit: balance 0, x 0.020, xArrow 1, xLabel "2.0 cm", force 1, forceLabel "0.49 N" · Board: x = 2.0 cm → F = 0.49 N up | Observation |
| 3.3 | Pull it four point zero centimetres down. The pull back doubles, to zero point nine eight newtons. Double the displacement, double the force. | Kit: x 0.040, xLabel "4.0 cm", forceLabel "0.98 N" · Board: x = 4.0 cm → F = 0.98 N up · Board: F ∝ x | Proportionality |
| 3.4 | Now push it two point zero centimetres above the middle. The net force now acts downwards. Either way, it points back to the equilibrium position. | Kit: x −0.020, xLabel "2.0 cm", forceLabel "0.49 N" · Board: above → F down | Direction |
| 3.5 | This is the restoring force. F equals minus k x. The minus sign means the force is always opposite to the displacement. | New board: "F = −kx" · 📷 WIDE · Board: F = −kx · Box · Board: minus = opposite direction | Definition (the minus sign) |
| 3.6 | Now release it and watch the red arrow. Longest at the ends, zero as the mass passes the middle, then growing again on the other side. | Kit: xArrow 0, osc 1, A 0.040, slow 4 (tag "slow motion") · 📷 KIT CLOSE-UP → mass, slow drift | Visualise (no board writing in this shot) |
| 3.7 | Remember, x is measured from the equilibrium position, not from the spring's natural length. The weight is already balanced there. | 📷 WIDE · Board: x from equilibrium (note: not natural length) | Accuracy |

## Chapter 4: The SHM condition (about 1 min 35 s)
Newton's second law turns F = −kx into a = −(k/m)x. Any motion with a = −ω²x is SHM. The bouncing ball is the contrast.

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 4.1 | Newton's second law turns force into acceleration. a equals F over m, so a equals minus k over m, times x. | New board: "The SHM condition" · Kit shm-oscillator: osc 0, x 0, slow 1 · Board: a = F/m · Board: a = −(k/m)x | Derivation |
| 4.2 | For our spring, k over m is twenty-four point five over zero point two zero zero. That is one hundred and twenty-two point five per second squared, a constant. | Board: k/m = 24.5/0.200 · Board: \phantom{k/m} = 122.5 s⁻² | Step |
| 4.3 | So two point zero centimetres below the middle, the acceleration is one hundred and twenty-two point five times zero point zero two zero. That is two point four five metres per second squared, upwards. | Kit: x 0.020, accel 1, accelLabel "2.45 m s⁻²" · 📷 WIDE → mass · Board: a = −122.5 × 0.020 · Board: \phantom{a} = −2.45 m s⁻² (note: upwards) | Step (sign = direction) |
| 4.4 | Any motion where the acceleration is minus a constant times x is simple harmonic. We call that constant omega squared. | New board: "Definition" · 📷 WIDE · Board: a = −ω²x · Box | Definition |
| 4.5 | In words, as examiners want it. The acceleration is directly proportional to the displacement from a fixed point, and always directed towards that point. | Board: a ∝ x from a fixed point · Board: a always towards that point | WAEC wording (both parts) |
| 4.6 | Plot a against x for the spring. You get a straight line through the origin, sloping downwards. Its gradient is minus omega squared. | New board: "a against x" · Kit graph [AX]: show spring line, point (0.020, −2.45) · Board: a–x: straight line through 0 · Board: gradient = −ω² | Graph |
| 4.7 | A ball bouncing on a floor repeats too. But between bounces its acceleration is g, nine point eight metres per second squared downwards, at every height. A flat line. So it is not simple harmonic. | Kit graph: show spring+pt+ball, pulse ball · 📷 WIDE → ball · Board: ball: a = −9.8 at all heights · Board: not ∝ x → not SHM | Misconception contrast |

## Chapter 5: From the condition to the period (about 1 min 5 s)
ω² = k/m gives T = 2π√(m/k). Amplitude is not in the formula.

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 5.1 | Compare the two equations. Minus omega squared x, and minus k over m x. So omega squared equals k over m. | New board: "The spring's period" · Kit shm-oscillator: skin lab, n 1, m 0.200, x 0, accel 0, force 0, osc 0 · Board: ω² = k/m · Board: ω = √(k/m) | Derivation |
| 5.2 | One full oscillation takes T equals two pi over omega. Put in omega, and you get T equals two pi root m over k. | Board: T = 2π/ω · Board: T = 2π√(m/k) · Box | Formula (boxed) |
| 5.3 | Read it. A bigger mass gives a longer period. A stiffer spring gives a shorter period. Frequency is one over T. | New board: "Reading the formula" · Board: m ↑ → T ↑ · Board: k ↑ → T ↓ · Board: f = 1/T = (1/2π)√(k/m) | Interpret |
| 5.4 | And notice what is missing: the amplitude. Here is the same two hundred grams, pulled down one point zero centimetre and three point zero centimetres. | Kit: n 2, m2 0.200, osc 1, A 0.010, osc2 1, A2 0.030, slow 2, tag "A = 1.0 cm", tag2 "A = 3.0 cm" · 📷 WIDE → both springs · Board: amplitude is not in T | Misconception (amplitude) |
| 5.5 | They stay in step. Both take zero point five six eight seconds per oscillation. A bigger pull just means a bigger swing, in the same time. | Kit: periodLabel "T = 0.568 s", periodLabel2 "T = 0.568 s" · Board: both: T = 0.568 s | Evidence |

## Chapter 6: Worked example: k, then T (about 1 min 15 s)
02-lesson.md Worked Example 1, every step shown.

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 6.1 | Worked example. A zero point three zero kilogram load stretches a spring by six point zero centimetres. Find k, and the period when the load bounces. Take g as nine point eight. | New board: "Example 1" · Kit panel off · 📷 BOARD SHOT · Board: m = 0.30 kg, x = 6.0 cm · Board: g = 9.8 m s⁻² · Board: k = ? T = ? | Givens |
| 6.2 | Step one. The stretching force is the weight. Zero point three zero times nine point eight is two point nine four newtons. And six point zero centimetres is zero point zero six zero metres. | Highlight F · Board: F = mg = 0.30 × 9.8 · Board: \phantom{F} = 2.94 N · Board: x = 0.060 m (note: cm → m) | Step |
| 6.3 | Step two. k equals F over x. Two point nine four over zero point zero six zero is forty-nine newtons per metre. | Highlight k · Board: k = 2.94/0.060 = 49 N m⁻¹ · Box | Step |
| 6.4 | Step three. T equals two pi root m over k. Zero point three zero over forty-nine is zero point zero zero six one two. | New board: "Step 3: the period" · Board: T = 2π√(0.30/49) · Board: \phantom{T} = 2π√0.00612 | Step |
| 6.5 | Its square root is zero point zero seven eight two. Two times three point one four two times zero point zero seven eight two gives zero point four nine seconds. | Highlight T · Board: = 2 × 3.142 × 0.0782 · Board: = 0.49 s · Box | Answer |
| 6.6 | Check. Because k x equals m g, m over k equals x over g. Root of zero point zero six zero over nine point eight is zero point zero seven eight two again. It works. | New board: "Check" · Board: m/k = x/g (note: kx = mg) · Board: √(0.060/9.8) = 0.0782 ✓ | Check |

## Chapter 7: The okada: 200 kg, then 250 kg (about 1 min 35 s)
02-lesson.md Worked Example 3 answers the hook: heavier is slower, not steadier.

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 7.1 | Now Dayo's okada. In our model, the rear spring has k equals three point one six times ten to the four newtons per metre. Find the bounce period with two hundred kilograms, then two hundred and fifty. | New board: "Example 2: the okada" · Kit shm-oscillator: skin okada, n 2, m 200, m2 250, k 31600, tag "200 kg (model)", tag2 "250 kg (model)", osc 0, osc2 0, eq 1 · 📷 WIDE · Board: k = 3.16 × 10⁴ N m⁻¹ (note: model) · Board: m = 200 kg, then 250 kg | Givens (story model labelled) |
| 7.2 | Step one. Two hundred over thirty-one thousand six hundred is six point three three times ten to the minus three. Its square root is zero point zero seven nine six. | New board: "Step 1: 200 kg" · 📷 BOARD SHOT · Board: T₁ = 2π√(200/31 600) · Board: \phantom{T₁} = 2π√(6.33 × 10⁻³) · Board: \phantom{T₁} = 2 × 3.142 × 0.0796 | Step |
| 7.3 | So T one is zero point five zero seconds, a frequency of two point zero hertz. That matches Zainab's twenty bounces in ten point zero seconds. | Board: T₁ = 0.50 s, f = 2.0 Hz · Box · Board: 10.0 s ÷ 20 = 0.50 s ✓ | Answer + link to Lesson 01 |
| 7.4 | Step two. Two hundred and fifty over thirty-one thousand six hundred is seven point nine one times ten to the minus three. Its square root is zero point zero eight eight nine. | New board: "Step 2: 250 kg" · Board: T₂ = 2π√(7.91 × 10⁻³) · Board: \phantom{T₂} = 2 × 3.142 × 0.0889 | Step |
| 7.5 | So T two is zero point five six seconds, and the frequency falls to one point seven nine hertz. | Board: T₂ = 0.56 s, f = 1.79 Hz · Box | Answer |
| 7.6 | Watch them side by side. The heavier okada still bounces. It just bounces more slowly, and slips behind. | Kit: osc 1, osc2 1, A 0.02, A2 0.02, periodLabel "0.50 s", periodLabel2 "0.56 s" · 📷 KIT CLOSE-UP → both springs, slow drift | Visual evidence (no board writing in this shot) |
| 7.7 | Check with a ratio. T is proportional to root m, so T two over T one should be root one point two five, one point one two. And zero point five six over zero point five zero is one point one two. It works. | New board: "Check" · 📷 WIDE · Board: T ∝ √m · Board: √(250/200) = 1.12 · Board: 0.56/0.50 = 1.12 ✓ | Check |
| 7.8 | So, sorry Tunde. Extra crates do not stop the bounce. They slow it, from two point zero to one point seven nine hertz. Heavier is slower, not steadier. | 📷 WIDE → both springs · Board: heavier = slower, not steadier · Box | Resolve the hook |

## Chapter 8: k from a T²–m graph (about 1 min 15 s)
The practical method: plot T² against m, then gradient = 4π²/k. It agrees with Hooke's law.

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 8.1 | In the practical, examiners want k from a graph. Square both sides of T equals two pi root m over k. | New board: "k from a graph" · Kit panel off · 📷 WIDE · Board: T² = (4π²/k) × m | Derivation |
| 8.2 | So T squared against m is a straight line through the origin, with gradient four pi squared over k. That is why we plot T squared, not T. | Kit graph [TM]: show axes · Board: gradient = 4π²/k (note: plot T², not T) | Why T² |
| 8.3 | Here are the bench results, from fifty to two hundred and fifty grams. Draw the best straight line through the origin. | Kit graph: show pts, then line · 📷 WIDE | Data |
| 8.4 | Gradient: zero point four zero three over zero point two five zero. That is one point six one seconds squared per kilogram. | Kit graph: show pts+line+tri, pulse tri · 📷 WIDE → tri · Board: gradient = 0.403/0.250 · Board: \phantom{g} = 1.61 s² kg⁻¹ | Step |
| 8.5 | So k equals four pi squared over the gradient. Thirty-nine point five over one point six one is twenty-four point five newtons per metre. | New board: "Find k" · 📷 WIDE · Board: k = 4π²/gradient · Board: \phantom{k} = 39.5/1.61 = 24.5 N m⁻¹ · Box | Step |
| 8.6 | That is exactly what Hooke's law gave us. Two methods, one spring, one answer. | Board: Hooke's law: 24.5 N m⁻¹ ✓ | Check (two methods agree) |

## Chapter 9: Mistakes that cost marks (about 0 min 55 s)
Each mistake shown wrong, then right.

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 9.1 | Mistake one. Using the mass as the force. To find k, the force is the weight, m g, in newtons. | New board: "Common mistakes" · Kit panel off · 📷 WIDE · Board: ✗ k = m/x · Board: ✓ k = mg/x | Mistake |
| 9.2 | Mistake two. Leaving the extension in centimetres. Change it to metres before you divide. | Board: ✗ 2.94/6.0 · Board: ✓ 2.94/0.060 | Mistake |
| 9.3 | Mistake three. Turning the root upside down. If a heavier load gives you a shorter period, you have used k over m. | New board: "More mistakes" · Board: ✗ T = 2π√(k/m) · Board: ✓ T = 2π√(m/k) | Mistake |
| 9.4 | Mistake four. Thinking a bigger pull changes the period. Amplitude is not in the formula. And the S H M definition needs both parts: proportional, and towards the fixed point. | Board: ✗ bigger A → longer T · Board: ✓ T does not depend on A | Mistake |

## Chapter 10: Summary (about 0 min 35 s)

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 10.1 | To sum up. Hooke's law, F equals k x, holds within the elastic limit. The restoring force, minus k x, always points back to equilibrium. | New board: "Summary" · Board: F = kx · Board: F = −kx | Summary |
| 10.2 | S H M means a equals minus omega squared x. For a spring, T equals two pi root m over k, and the T squared m graph has gradient four pi squared over k. More crates, slower bounce. | Board: a = −ω²x · Board: T = 2π√(m/k) · Board: T²–m gradient = 4π²/k · Box | Summary |

## Chapter 11: Your turn (about 1 min 15 s, plus the pause)
A fresh k-then-T question with a pause, a full solution and a check.

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 11.1 | Your turn. A zero point four zero kilogram load stretches a spring by four point nine centimetres. Find k, and the period of its bounce. Take g as nine point eight. | New board: "Your turn" · Board: m = 0.40 kg, x = 4.9 cm · Board: g = 9.8 m s⁻² · Board: find k and T | Practice question |
| 11.2 | Pause and try it now. | Pause-and-try countdown 15 s (`hold`) | Thinking time |
| 11.3 | Step one. F equals zero point four zero times nine point eight, three point nine two newtons. k equals three point nine two over zero point zero four nine, which is eighty newtons per metre. | New board: "Solution" · 📷 BOARD SHOT · Board: F = 0.40 × 9.8 = 3.92 N · Board: k = 3.92/0.049 = 80 N m⁻¹ · Box | Step |
| 11.4 | Step two. T equals two pi root zero point four zero over eighty. That is two pi root zero point zero zero five, or two pi times zero point zero seven zero seven. | Board: T = 2π√(0.40/80) · Board: \phantom{T} = 2π√0.005 · Board: \phantom{T} = 2π × 0.0707 | Step |
| 11.5 | So T is zero point four four seconds. Check: root of zero point zero four nine over nine point eight is zero point zero seven zero seven too. Well done. | 📷 WIDE · Board: T = 0.44 s · Box · Board: √(0.049/9.8) = 0.0707 ✓ | Answer + check |

## Build checks and kit gaps

Every number below was recomputed by script (`node`, g = 9.8 m s⁻², π from `Math.PI`) before this script was written.

| Check | Computed | Expected (as on board / spoken) |
| --- | --- | --- |
| Bench weights | 0.050, 0.100, 0.150 × 9.8 | 0.490, 0.980, 1.47 N |
| Bench extensions | m g ÷ 24.5 | 2.0, 4.0, 6.0 (… 8.0, 10.0) cm |
| F–x gradient | 2.45 ÷ 0.100 | 24.5 N m⁻¹ |
| Static stretch, 0.200 kg | 0.200 × 9.8 ÷ 24.5 | 0.080 m = 8.0 cm |
| Restoring force at 2.0 cm, 4.0 cm | 24.5 × 0.020; 24.5 × 0.040 | 0.49 N; 0.98 N |
| k/m (bench, 200 g) | 24.5 ÷ 0.200 | 122.5 s⁻² |
| a at 2.0 cm | 122.5 × 0.020 | 2.45 m s⁻² (upwards; shown as −2.45) |
| a–x line end (graph) | −122.5 × 0.040 | −4.9 m s⁻² at x = 0.040 m |
| Ball between bounces | −g | −9.8 m s⁻², all heights |
| Period, 200 g, any amplitude | 2π√(0.200 ÷ 24.5) = 0.5677 | 0.568 s (both A = 1.0 cm and 3.0 cm) |
| WE1 force | 0.30 × 9.8 | 2.94 N |
| WE1 k | 2.94 ÷ 0.060 | 49 N m⁻¹ |
| WE1 m/k | 0.30 ÷ 49 = 0.006122 | 0.00612 |
| WE1 root | √0.006122 = 0.07825 | 0.0782 |
| WE1 T | 2π × 0.07825 = 0.4916; 2 × 3.142 × 0.0782 = 0.4914 | 0.49 s |
| WE1 check | √(0.060 ÷ 9.8) = 0.07825 | 0.0782 ✓ |
| Okada m/k, 200 kg | 200 ÷ 31 600 = 0.006329 | 6.33 × 10⁻³ |
| Okada root, 200 kg | 0.07956 | 0.0796 |
| Okada T₁, f₁ | 2π × 0.07956 = 0.4999; 1 ÷ 0.4999 = 2.0005 | 0.50 s; 2.0 Hz |
| Lesson 01 link | 10.0 ÷ 20 | 0.50 s |
| Okada m/k, 250 kg | 250 ÷ 31 600 = 0.007911 | 7.91 × 10⁻³ |
| Okada root, 250 kg | 0.08895 | 0.0889 |
| Okada T₂, f₂ | 2π × 0.08895 = 0.5589; 1 ÷ 0.5589 = 1.789 | 0.56 s; 1.79 Hz |
| Ratio check | √(250 ÷ 200) = 1.118; 0.56 ÷ 0.50 = 1.12 | 1.12 = 1.12 |
| T²–m gradient | 0.403 ÷ 0.250 = 1.612 | 1.61 s² kg⁻¹ |
| 4π² | 39.478 | 39.5 |
| k from graph | 39.478 ÷ 1.61 = 24.52; 39.5 ÷ 1.61 = 24.53 | 24.5 N m⁻¹ (= Hooke) |
| T² points (graph) | (2π)² m ÷ 24.5 at 0.050 … 0.250 | 0.0806, 0.161, 0.242, 0.322, 0.403 s² (lesson table) |
| Best-fit line end (graph) | 1.61 × 0.28 | 0.451 s² at 0.28 kg |
| Your turn F | 0.40 × 9.8 | 3.92 N |
| Your turn k | 3.92 ÷ 0.049 | 80 N m⁻¹ |
| Your turn m/k, root | 0.40 ÷ 80 = 0.005; √0.005 = 0.07071 | 0.005; 0.0707 |
| Your turn T | 2π × 0.07071 = 0.4443 | 0.44 s |
| Your turn check | √(0.049 ÷ 9.8) = 0.07071 | 0.0707 ✓ |

**Graph specs (built-in `graph` kit):**
- `FX`: x = extension / m `[0, 0.12, 0.02]`, y = F / N `[0, 3, 0.5]`; `pts` = the five bench points (0.020, 0.490) … (0.100, 2.45); `line` (0, 0) → (0.11, 2.695); `tri` from (0, 0) to (0.100, 2.45), labels dx "0.100 m", dy "2.45 N". Colours: x blue, F red, line green (k).
- `AX`: x = displacement / m `[−0.05, 0.05, 0.01]`, y = a / m s⁻² `[−12, 12, 2]`; `spring` fn `-122.5*x` on `[−0.045, 0.045]` (purple, label "spring: a = −122.5x"); `pt` at (0.020, −2.45); `ball` line (−0.045, −9.8) → (0.045, −9.8), label "ball (between bounces)".
- `TM`: x = m / kg `[0, 0.30, 0.05]`, y = T² / s² `[0, 0.50, 0.1]`; `pts` = (0.050, 0.0806), (0.100, 0.161), (0.150, 0.242), (0.200, 0.322), (0.250, 0.403); `line` (0, 0) → (0.28, 0.451); `tri` from (0, 0) to (0.250, 0.403), labels dx "0.250 kg", dy "0.403 s²". Colours: m orange, T² gold.

**KIT GAP → kit request `shm-oscillator`** (`06-videos/kit-requests/shm-oscillator.md`). This is the "pendulum & mass–spring SHM" gap on the video-kit backlog. Chapters 1, 2, 3, 4 (4.1–4.3), 5 and 7 need a vertical spring whose helix stretches evenly with load and whose pointer reads against a metre rule. They also need a dashed equilibrium line, a held displacement with a blue x bracket, a red restoring-force arrow ∝ x that always points to equilibrium (zero at the centre), a purple acceleration arrow, true-period oscillation (2π√(m/k), optional slow motion with the true period ratio kept), two springs side by side, and an okada skin labelled "(model)". The states this script uses are in the request. Fallback if the kit cannot be built: the `graph` kit draws x–t curves for the two loads, and the board carries the force words. This is clearly weaker, because the restoring-force arrow is the core visual of the lesson. **The plan will be written once the kit exists** (its README fixes the exact state names; the names above are the requested ones).
