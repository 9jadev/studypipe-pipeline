# 03 · Assessment Suite: Simple Harmonic Motion (`ss2-phy-simple-harmonic-motion`)

Seven lessons × (12 interactive MCQs for `window.LESSON_QUIZ` + Part A home investigation + Part B 30-mark written paper with model solutions and mark-scheme notes, locked until attempted). All stems, scenarios and numbers are original and were recomputed by script; answers come from the physics, not from any answer key. The tick symbol marks the correct option. Unless a stem states otherwise, no value of `g` is needed; where it is, the stem gives `g = 9.8 m s⁻²` or `g = 10 m s⁻²`, and Lesson 05 uses the class value `g = 9.79 m s⁻²` from `02-lesson.md`. Story numbers (*The Cracked Crates of Ridge Road*) match the story-model table in `02-lesson.md`: `m = 200 kg`, `k = 3.16 × 10⁴ N m⁻¹`, `f₀ = 2.0 Hz`, `T₀ = 0.50 s`, sag and lift-off threshold `6.2 cm`, ridges `2.5 m` apart, resonance at `18 km/h`; with `250 kg`, `f₀ = 1.79 Hz`, `16 km/h`, threshold `7.8 cm`.

Answer-key balance: each lesson uses A, B, C and D three times each (unit total A 21 · B 21 · C 21 · D 21).

---

## Lesson 01 · Things That Repeat — Periodic Motion, Oscillation and Its Measures

### Part 1 · 12 Interactive MCQs (`window.LESSON_QUIZ`)

1. **[WAEC-style · Remember]** On the way to the farm, Zainab lists four motions she can see. Which one is an *oscillation*?
   - **A.** The blade of the ceiling fan in the farm office
   - **B.** A ripe mango dropping from its branch
   - **C.** Her little brother on the swing in the compound ✓
   - **D.** A lorry speeding up along the expressway
   - *Explanation:* An oscillation is a to-and-fro motion that repeats about a fixed rest position. The swing goes back and forth through its lowest point again and again, so it oscillates. A repeats at regular intervals (it is periodic) but goes round in a circle; it never comes back along the same path towards a rest position. B and D do not repeat at all, so they are neither periodic nor oscillatory.

2. **[WAEC-style · Apply]** Chinedu times 30 complete oscillations of a pendulum and his stopwatch reads 48.0 s. What is the period of the pendulum?
   - **A.** 1.60 s ✓
   - **B.** 0.625 s
   - **C.** 1440 s
   - **D.** 0.80 s
   - *Explanation:* Period = time for one complete oscillation: T = t/n = 48.0 s ÷ 30 = 1.60 s. B (0.625) is n/t, which is the frequency in hertz, not the period in seconds. C multiplied the time by the number of oscillations. D halves the correct value, which is what happens if every half-swing is counted as a whole oscillation.

3. **[NECO-style · Apply]** The frame of a corn-grinding machine in Bodija market vibrates 1500 times every minute. What is the period of the vibration?
   - **A.** 25 s
   - **B.** 0.040 s ✓
   - **C.** 6.7 × 10⁻⁴ s
   - **D.** 0.40 s
   - *Explanation:* First change to vibrations per second: f = 1500 ÷ 60 s = 25 Hz. Then T = 1/f = 1 ÷ 25 = 0.040 s. A gives the frequency's number (25) with the unit of period: f and T have been confused. C is 1 ÷ 1500, which is the period in *minutes*; the minute was never changed to 60 s. D is a decimal-place slip (1 ÷ 2.5).

4. **[JAMB-style · Understand]** The bob of a pendulum swings between two marks on the bench that are 16 cm apart. What is its amplitude?
   - **A.** 16 cm
   - **B.** 32 cm
   - **C.** 4.0 cm
   - **D.** 8.0 cm ✓
   - *Explanation:* Amplitude is the greatest displacement *from the rest position*, which lies midway between the two end points: A = 16 cm ÷ 2 = 8.0 cm. A is the end-to-end distance, the most common slip. B is the distance covered going there and back (2 × 16 cm counts one full oscillation as 32 cm, which is 4A). C halves twice.

5. **[WAEC-style · Apply]** The loaded okada's rear bounces with a period of 0.50 s. What is its angular frequency?
   - **A.** 3.14 rad s⁻¹
   - **B.** 12.6 rad s⁻¹ ✓
   - **C.** 0.080 rad s⁻¹
   - **D.** 4.0 rad s⁻¹
   - *Explanation:* ω = 2π/T = 2 × 3.142 ÷ 0.50 = 6.283 ÷ 0.50 = 12.6 rad s⁻¹ (the same as 2πf with f = 2.0 Hz). A multiplied 2π by T instead of dividing (2π × 0.50). C turned the fraction upside down (T ÷ 2π). D used 2/T and forgot the π.

6. **[WAEC-style · Understand]** A pendulum bob is released at end-point A, passes the rest position O, reaches the other end B and comes back. Which path is **one complete oscillation**?
   - **A.** A → O → B
   - **B.** A → O
   - **C.** A → O → B → O → A ✓
   - **D.** O → B → O
   - *Explanation:* One complete oscillation ends when the bob is back at its starting point *moving in the same direction*. Starting from A, that means A → O → B → O → A. A is only half an oscillation (a "swing" one way); B is a quarter; D is also only half, since the bob ends at O moving the opposite way from the way it started.

7. **[WAEC Practical · Analyse]** Why does Mrs Okafor ask the class to time 20 oscillations instead of just one?
   - **A.** The reaction-time error at the start and stop is shared over 20 periods, so the period found is far more accurate ✓
   - **B.** The pendulum swings faster after the first few oscillations, so the later ones are more typical
   - **C.** Timing 20 removes the reaction-time error completely
   - **D.** The stopwatch cannot measure a time as short as one period
   - *Explanation:* Each press of the stopwatch carries roughly the same reaction delay, however long the timing lasts. Spread over 20 periods, that fixed error becomes about one-twentieth as large a fraction of the period. B is false: the period stays the same even as the swing dies down. C goes too far: the error gets smaller but does not disappear. D is false: a stopwatch reads to 0.01 s, so it can show one period; the difficulty is human reaction time, not the watch.

8. **[WAEC Practical · Apply]** Tunde's reaction error is about 0.3 s and the true period of a pendulum is 1.5 s. If he times 20 oscillations, roughly what percentage error does his reaction time add to the period?
   - **A.** 20 %
   - **B.** 6.0 %
   - **C.** 0.050 %
   - **D.** 1.0 % ✓
   - *Explanation:* Twenty oscillations take 20 × 1.5 s = 30 s, and the same 0.3 s error is now (0.3 ÷ 30) × 100 = 1.0 %. A (20 %) is the error for timing a single oscillation, (0.3 ÷ 1.5) × 100. B multiplied the 0.3 s error by 20 and read the result, 6.0, as a percentage. C divided by 20 twice.

9. **[JAMB-style · Apply]** Dayo's carrier bounces between two points 6.0 cm apart with a period of 0.50 s. How far does the carrier travel in 2.0 s?
   - **A.** 12 cm
   - **B.** 24 cm
   - **C.** 48 cm ✓
   - **D.** 96 cm
   - *Explanation:* Amplitude A = 6.0 ÷ 2 = 3.0 cm. In one oscillation the carrier moves out, back, out the other way and back: 4A = 12 cm. In 2.0 s there are 2.0 ÷ 0.50 = 4 oscillations, so distance = 4 × 12 cm = 48 cm. A is the distance for only one oscillation. B used 2A (6 cm) per oscillation, forgetting the return half. D took the 6.0 cm end-to-end distance as the amplitude (4 × 4 × 6.0 cm).

10. **[NECO-style · Understand]** Which motion is periodic but **not** an oscillation?
    - **A.** A plucked guitar string
    - **B.** The minute hand of a wall clock ✓
    - **C.** A weighted test-tube bobbing upright in water
    - **D.** The okada carrier bouncing on its spring
    - *Explanation:* The minute hand repeats its motion every hour, so it is periodic, but it goes round and round; it never moves to and fro about a rest position. A, C and D all move back and forth through a rest (equilibrium) position, so they are oscillations as well as periodic.

11. **[WAEC Practical · Analyse]** Zainab starts and stops her stopwatch as the bob passes the chalk mark at its rest position rather than at the end of the swing. Why is this better?
    - **A.** The bob is momentarily at rest at the mark, so the instant is easy to see
    - **B.** The bob moves slowest at the mark, so there is more time to press the button
    - **C.** Timing from the mark makes the amplitude larger
    - **D.** The bob is moving fastest at the mark, so the moment it passes is sharp and easy to judge ✓
    - *Explanation:* At the rest position the bob is moving fastest, so it crosses the mark in a very short time and the start and stop instants are sharp. A and B have the misconception the wrong way round: the bob is momentarily at rest, and slowest, at the *ends* of the swing, where it lingers and makes the exact turning instant hard to judge. C is unrelated: where you time from cannot change the amplitude.

12. **[WAEC-style · Apply]** With two extra crates on the carrier, Zainab finds that 20 bounces of the parked okada take 11.2 s. What is the new bounce frequency?
    - **A.** 1.79 Hz ✓
    - **B.** 0.56 Hz
    - **C.** 2.0 Hz
    - **D.** 224 Hz
    - *Explanation:* T = t/n = 11.2 ÷ 20 = 0.56 s, then f = 1/T = 1 ÷ 0.56 = 1.79 Hz (or directly f = n/t = 20 ÷ 11.2 = 1.79 Hz). B is the period, stopped one step early and given the wrong unit. C is the frequency with the usual load (20 in 10.0 s), not the new one. D multiplied 20 by 11.2.

### Part 2 · Home Investigation & 30-Mark Written Paper (Lesson 01)

**Part A · Home Investigation:** *A stone, a thread and a phone stopwatch.*
You need: a small stone or a padlock, about 1.2 m of strong thread, a nail or door hook to hang it from, a tape measure, and a phone stopwatch. Hang it where nobody will walk into it and keep the swing small.
1. Tie the stone to the thread and hang it so that the length from the hook to the middle of the stone is 1.00 m.
2. Put a mark (a piece of tape on the floor or wall) under the rest position of the stone.
3. Pull the stone aside about 10 cm and let go. When the swing is steady, start the stopwatch as the stone passes the mark, counting "zero".
4. Count 20 complete oscillations (back past the mark moving the same way) and stop the watch. Repeat once.
5. Halve the length to 0.50 m and repeat steps 3–4.
6. Also time just **one** oscillation three times at 1.00 m and note how much the three readings differ.

Sample results table:

| Length (m) | t₁ for 20 (s) | t₂ for 20 (s) | Mean t (s) | T = t/20 (s) | f = 1/T (Hz) |
|---|---|---|---|---|---|
| 1.00 | 40.3 | 40.0 | 40.2 | 2.01 | 0.498 |
| 0.50 | 28.5 | 28.3 | 28.4 | 1.42 | 0.704 |

Single-oscillation timings at 1.00 m: 1.8 s, 2.3 s, 2.0 s.

*What a good answer shows:* T is found as (mean time) ÷ 20 and f as 1/T, with units; the shorter thread gives the shorter period and the higher frequency (the length changed T; nothing else was changed, so it was a fair test); the three single-oscillation timings scatter by several tenths of a second while the two 20-oscillation timings agree within about 0.3 s, which shows why the reaction-time error is shared out by timing many cycles. A strong answer links this to Zainab timing 20 bounces of the okada rather than one, and names a source of error with its effect, for example: the stone swung slightly in an ellipse instead of a straight line, or a draught from the window nudged it.

**Part B · Written Paper (30 marks)**

**b1 · Definitions (3 marks)**
Define: (a) *periodic motion*; (b) *oscillation*; (c) *frequency* of an oscillation.
*Model solution:* (a) Periodic motion is motion that repeats itself in equal intervals of time. **(1)** (b) An oscillation (vibration) is a periodic to-and-fro motion about a fixed rest (equilibrium) position. **(1)** (c) Frequency is the number of complete oscillations made in one second; its unit is the hertz (Hz = s⁻¹). **(1)**
*Mark scheme note:* In (a) the idea of *equal* time intervals is required; "motion that repeats" alone is not credited. In (b) the to-and-fro idea and the fixed rest position are both needed; "moving up and down" alone scores zero. In (c) "complete" oscillations *per second* is needed; "how fast it vibrates" is not accepted.

**b2 · Amplitude, Period and Angular Frequency (3 marks)**
A pendulum bob swings between end-points A and B through its rest position O. (a) Define the *amplitude* and show it on a sketch of A, O and B. (b) Define the *period*. (c) Write the relation between angular frequency ω and period T, with the unit of ω.
*Model solution:* (a) Amplitude is the greatest displacement of the bob from its rest position; on the sketch it is the distance OA (or OB), not AB. **(1)** (b) The period is the time taken for one complete oscillation (A → O → B → O → A). **(1)** (c) ω = 2π/T (= 2πf), measured in radians per second (rad s⁻¹). **(1)**
*Mark scheme note:* Marking AB as the amplitude loses (a), even if the words are right. In (b), "time for one swing" is ambiguous and is credited only if the swing is clearly a complete back-and-forth cycle. In (c) both the relation and the unit are needed for the mark.

**b3 · Timing Like an Examiner (4 marks)**
Explain why, when finding the period of a pendulum, a careful student (a) times 20 oscillations, not one; (b) starts the stopwatch as the bob passes the rest position; (c) counts "zero", not "one", at the start. (d) State what would go wrong with T if the student counted half-swings as complete oscillations.
*Model solution:* (a) The reaction-time error made on pressing the stopwatch is about the same however long the timing is, so dividing by 20 makes it twenty times smaller as a fraction of T. **(1)** (b) The bob moves fastest at the rest position, so the instant it passes the mark is sharp and easy to judge; at the ends it lingers. **(1)** (c) Counting "one" at the start means only 19 complete oscillations are really timed when the count reaches 20, so T comes out too small; counting from zero makes the count match the oscillations timed. **(1)** (d) Each count would then be only half an oscillation, so the value of T obtained would be half the true period. **(1)**
*Mark scheme note:* In (a) "to be accurate" without the reaction-time idea earns nothing. In (b) "because the bob stops there" is the misconception reversed and scores zero. In (c) the direction "too small" (or "one oscillation fewer") is needed. In (d) "T is wrong" without "halved" (or "too small by half") scores zero.

**b4 · Connecting T, f and ω (4 marks)**
(a) A body makes n complete oscillations in time t. Show that its frequency is f = n/t and that f = 1/T. (b) Show that the distance a body moving between end-points covers in one complete oscillation is 4A, and hence write an expression for the distance covered in time t.
*Model solution:* (a) One oscillation takes T = t/n, so the number of oscillations in one second is n ÷ t: f = n/t. **(1)** Since T = t/n, n/t = 1/T, so f = 1/T. **(1)** (b) In one oscillation the body goes from O to an end (A), back to O (A), to the other end (A) and back to O (A): total 4A. **(1)** In time t there are t/T oscillations, so distance = (t/T) × 4A = 4Aft. **(1)**
*Mark scheme note:* In (a) a bare statement "f = 1/T" without linking it to T = t/n earns only one mark. In (b), "2A" (forgetting the return half) loses the first mark; error carried forward is allowed for the second.

**b5 · The Generator Mount (5 marks)**
A generator sits on rubber mounts. When it is switched off, Mallam Sule pushes it down and lets go: its frame bobs between the 12.0 cm and 18.0 cm marks on a ruler, and it makes 45 complete oscillations in 27.0 s. Calculate: (a) the period; (b) the frequency; (c) the angular frequency; (d) the amplitude; (e) the total distance the frame moves in the first 6.0 s, assuming the amplitude stays the same.
*Model solution:* (a) T = t/n = 27.0 ÷ 45 = 0.600 s. **(1)** (b) f = 1/T = 1 ÷ 0.600 = 1.67 Hz. **(1)** (c) ω = 2π/T = 6.283 ÷ 0.600 = 10.5 rad s⁻¹. **(1)** (d) The end-to-end distance is 18.0 − 12.0 = 6.0 cm, so A = 6.0 ÷ 2 = 3.0 cm. **(1)** (e) Number of oscillations = 6.0 ÷ 0.600 = 10; distance = 10 × 4A = 10 × 12.0 cm = 120 cm (1.20 m). **(1)**
*Mark scheme note:* Error carried forward is allowed from (a) into (b), (c) and (e). Using 18.0 cm or 6.0 cm as the amplitude loses (d); (e) may still be credited on error carried forward if 4A is used correctly. Units are required in every part; "1.67 s" for the frequency loses that mark.

**b6 · Practical: Choosing the Best Timing (6 marks)**
Zainab timed a pendulum three ways and recorded:

| Number of oscillations timed, n | 10 | 20 | 30 |
|---|---|---|---|
| Time t / s | 17.4 | 35.0 | 52.4 |

(a) Calculate T for each row, to 3 significant figures. (b) Find the mean period. (c) Using the 20-oscillation value, calculate the frequency and the angular frequency. (d) Assuming her reaction-time error was 0.2 s on each timing, calculate the percentage error in T for the 10-oscillation and the 30-oscillation timings, and say which timing is most reliable.
*Model solution:* (a) 17.4 ÷ 10 = 1.74 s; 35.0 ÷ 20 = 1.75 s; 52.4 ÷ 30 = 1.75 s (1.747 s). **(1)** (b) Mean T = (1.74 + 1.75 + 1.747) ÷ 3 = 1.75 s (1.746 s). **(1)** (c) f = 1 ÷ 1.75 = 0.571 Hz **(1)**; ω = 2π ÷ 1.75 = 3.59 rad s⁻¹. **(1)** (d) 10 oscillations: (0.2 ÷ 17.4) × 100 = 1.1 %; 30 oscillations: (0.2 ÷ 52.4) × 100 = 0.38 %. **(1)** The 30-oscillation timing is most reliable because the same reaction error is the smallest fraction of the time measured. **(1)**
*Mark scheme note:* All three values are needed for (a). In (c) the unit of ω must be rad s⁻¹ (accept s⁻¹). In (d) both percentages are needed for the first mark; choosing "30" without the reason scores zero for the second. Error carried forward is allowed throughout.

**b7 · Practical: Precautions and Errors (3 marks)**
(a) State **two** precautions Zainab took when timing the pendulum. (b) State one source of error that a precaution cannot remove completely.
*Model solution:* (a) Any two, in the past tense (1 each): I started and stopped the stopwatch as the bob passed the rest mark · I counted "zero" at the start · I timed 20 oscillations and repeated the timing · I displaced the bob only slightly so that it swung through a small angle · I ensured the bob swung in one plane. (Maximum 2.) **(2)** (b) Reaction time in starting and stopping the stopwatch (it can only be reduced, by timing many oscillations), or air resistance slowly reducing the amplitude. **(1)**
*Mark scheme note:* Precautions written as commands ("start at the rest mark") or in the future tense score zero. "I was careful" and "I avoided errors" are not credited. In (b) a precaution offered as an error ("I timed 20 oscillations") scores zero.

**b8 · The Bridge: Tunde's Single Bounce (2 marks)**
Tunde timed **one** bounce of the parked okada and got 0.7 s. Zainab timed 20 bounces in 10.0 s. (a) Find Zainab's period. (b) Explain why Tunde's value should not be trusted.
*Model solution:* (a) T = 10.0 ÷ 20 = 0.50 s. **(1)** (b) Tunde's reading includes a reaction error of a few tenths of a second, which is a large fraction (about 40 %) of a period of only 0.5 s; Zainab's error is shared over 20 bounces, so hers is far more reliable. **(1)**
*Mark scheme note:* In (b) the reaction-time idea is needed; "he did it fast" or "he is careless" scores zero.

---

## Lesson 02 · The Pull Back to the Middle — Restoring Force, the SHM Condition and the Loaded Spring

### Part 1 · 12 Interactive MCQs (`window.LESSON_QUIZ`)

1. **[WAEC-style · Remember]** Which statement is Hooke's law?
   - **A.** The extension of a spring is the same whatever load hangs on it
   - **B.** Provided the elastic limit is not exceeded, the extension of a spring is directly proportional to the force stretching it ✓
   - **C.** The force in a spring is inversely proportional to its extension
   - **D.** A spring always returns to its original length, however large the load
   - *Explanation:* Hooke's law says F = kx: double the stretching force and the extension doubles, *as long as the elastic limit is not passed*. A denies any link between load and stretch. C has the proportion upside down. D ignores the elastic limit; overloaded beyond it, a spring is permanently stretched and the law no longer holds.

2. **[NECO-style · Apply]** A 0.60 kg load hung on a spiral spring stretches it by 12.0 cm. What is the spring constant? (Take g = 10 m s⁻².)
   - **A.** 0.50 N m⁻¹
   - **B.** 5.0 N m⁻¹
   - **C.** 0.020 N m⁻¹
   - **D.** 50 N m⁻¹ ✓
   - *Explanation:* The stretching force is the weight: F = mg = 0.60 × 10 = 6.0 N. The extension in metres is x = 0.120 m. So k = F/x = 6.0 ÷ 0.120 = 50 N m⁻¹. A kept the extension in centimetres (6.0 ÷ 12). B used the mass instead of the weight (0.60 ÷ 0.120), forgetting g. C is x/F, the formula turned upside down.

3. **[WAEC-style · Understand]** A motion is *simple harmonic* when
   - **A.** the acceleration is directly proportional to the displacement from a fixed point and always directed towards that point ✓
   - **B.** the velocity is directly proportional to the displacement from a fixed point
   - **C.** the acceleration is constant and directed towards a fixed point
   - **D.** the acceleration is directly proportional to the displacement and directed away from the fixed point
   - *Explanation:* The defining condition is a = −ω²x: the acceleration (and the restoring force) grows in step with the displacement and points back towards the equilibrium position. B uses velocity, which is actually greatest where the displacement is zero. C describes a ball rolling in a V-shaped trough: it repeats, but its acceleration does not grow with displacement, so it is not SHM. D has the right size rule but the wrong direction; a push *away* from the centre would drive the body further off instead of bringing it back.

4. **[JAMB-style · Analyse]** For a body in simple harmonic motion, a graph of acceleration a (vertical) against displacement x (horizontal) is
   - **A.** a horizontal straight line
   - **B.** a straight line through the origin with a positive gradient
   - **C.** a straight line through the origin with a negative gradient ✓
   - **D.** a sine curve
   - *Explanation:* Since a = −ω²x, a is directly proportional to x with a negative constant, so the graph is a straight line through the origin with gradient −ω². A would mean the acceleration never changes. B leaves out the minus sign, so the acceleration would point away from the centre. D is what you get when x or a is plotted against *time*, not against each other.

5. **[WAEC-style · Apply]** A 0.80 kg mass bounces on a spring of spring constant 20 N m⁻¹. What is its period?
   - **A.** 1.26 s ✓
   - **B.** 0.25 s
   - **C.** 0.20 s
   - **D.** 31.4 s
   - *Explanation:* T = 2π√(m/k) = 2π√(0.80 ÷ 20) = 2π√0.040 = 2 × 3.142 × 0.20 = 1.26 s. B forgot the square root (2π × 0.040). C forgot the 2π (√0.040 = 0.20). D put k over m (2π√(20 ÷ 0.80) = 2π × 5 = 31.4 s): a heavier load would then give a *shorter* period, which the bench shows is false.

6. **[NECO-style · Apply]** A 0.30 kg load on a spring has a period of 0.80 s. The load is replaced by a 1.20 kg load on the same spring. What is the new period?
   - **A.** 3.2 s
   - **B.** 0.40 s
   - **C.** 1.6 s ✓
   - **D.** 0.80 s
   - *Explanation:* T ∝ √m, so T₂/T₁ = √(m₂/m₁) = √(1.20 ÷ 0.30) = √4 = 2, and T₂ = 2 × 0.80 = 1.6 s. A multiplied by 4, forgetting the square root. B divided by 2, as if more mass gave a faster bounce (Tunde's "heavier is steadier" idea in disguise). D treats the spring like a pendulum, whose period does not depend on mass; for a spring it does.

7. **[WAEC-style · Understand]** In the restoring-force equation F = −kx for a loaded spring, the minus sign shows that
   - **A.** the spring constant k is negative
   - **B.** the force always acts in the opposite direction to the displacement, back towards equilibrium ✓
   - **C.** the force becomes smaller as the displacement grows
   - **D.** the spring is being compressed, not stretched
   - *Explanation:* The minus sign is about *direction*: displace the load downwards and the spring pulls it up; push it upwards and the net force acts down. Either way it points back to the equilibrium position. A is false: k is a positive constant (force per metre). C contradicts the equation, since F grows with x. D is wrong because the sign applies on both sides of equilibrium, whether the spring is stretched or squashed.

8. **[WAEC Practical · Analyse]** In Zainab's spiral-spring practical, the graph of T² (vertical) against m (horizontal) is a straight line through the origin with slope 0.80 s² kg⁻¹. What is the spring constant?
   - **A.** 0.80 N m⁻¹
   - **B.** 1.25 N m⁻¹
   - **C.** 0.020 N m⁻¹
   - **D.** 49 N m⁻¹ ✓
   - *Explanation:* Squaring T = 2π√(m/k) gives T² = (4π²/k) m, so the slope is 4π²/k and k = 4π²/slope = 39.48 ÷ 0.80 = 49 N m⁻¹. A takes the slope itself as k. B is 1/slope, forgetting the 4π². C is slope ÷ 4π², the rearrangement turned upside down.

9. **[JAMB-style · Analyse]** The okada's rear spring (k = 3.16 × 10⁴ N m⁻¹) carries 200 kg and bounces at 2.0 Hz. What total load on the same spring would make it bounce at 1.5 Hz?
   - **A.** 356 kg ✓
   - **B.** 267 kg
   - **C.** 150 kg
   - **D.** 113 kg
   - *Explanation:* f = (1/2π)√(k/m), so f ∝ 1/√m and m ∝ 1/f². Then m₂ = m₁ × (f₁/f₂)² = 200 × (2.0 ÷ 1.5)² = 200 × 1.778 = 356 kg. (Directly: m = k/(4π²f²) = 31 600 ÷ (39.48 × 2.25) = 356 kg.) B used m ∝ 1/f without squaring (200 × 2.0 ÷ 1.5). C has the ratio upside down and unsquared (200 × 1.5 ÷ 2.0), so it lowers the load. D squared the ratio the wrong way up (200 × (1.5 ÷ 2.0)²): a lighter load would *raise* the frequency.

10. **[WAEC-style · Understand]** Which change would **lower** the bounce frequency of a load on a spiral spring?
    - **A.** Replacing the spring with a stiffer one
    - **B.** Pulling the load down further before releasing it
    - **C.** Releasing it with a smaller amplitude
    - **D.** Adding more slotted masses to the hanger ✓
    - *Explanation:* f = (1/2π)√(k/m): more mass gives a lower frequency. A raises k, which *raises* f. B and C change the amplitude only; in SHM the period and frequency do not depend on the amplitude, so neither changes f.

11. **[NECO-style · Apply]** A 0.25 kg load on a spring of spring constant 40 N m⁻¹ is 3.0 cm below its equilibrium position. What is its acceleration at that instant?
    - **A.** 4.8 m s⁻², directed downwards, away from equilibrium
    - **B.** 4.8 m s⁻², directed upwards, towards equilibrium ✓
    - **C.** 1.2 m s⁻², directed upwards
    - **D.** 480 m s⁻², directed upwards
    - *Explanation:* a = −(k/m)x = −(40 ÷ 0.25) × 0.030 = −160 × 0.030 = −4.8 m s⁻²; the minus sign means the acceleration is opposite to the displacement, so the load (below equilibrium) accelerates upwards. A has the right size but the wrong direction. C is kx = 40 × 0.030 = 1.2 N, the restoring *force*, not the acceleration (it was not divided by m). D kept x in centimetres (160 × 3.0).

12. **[WAEC-style · Analyse]** Which of these repeating motions is **not** simple harmonic?
    - **A.** A small-angle simple pendulum
    - **B.** A weighted test-tube bobbing upright in water
    - **C.** A ball bouncing up and down on a concrete floor ✓
    - **D.** A load bobbing gently on a spiral spring
    - *Explanation:* The bouncing ball repeats, but between bounces the only force on it is its weight, which is constant; the floor pushes only during the brief impact. So its acceleration does not grow in step with how far it is from a fixed point, and the motion is not SHM. A, B and D all have a restoring force that grows with displacement and points back to equilibrium (the weight component, extra upthrust and spring tension, respectively).

### Part 2 · Home Investigation & 30-Mark Written Paper (Lesson 02)

**Part A · Home Investigation:** *Does a spring (or rubber band) stretch evenly?*
You need: a spring from an old pen or a strong rubber band, a hook or nail, a light plastic bag or cup with a string handle, six identical keys (or identical coins), a 30 cm ruler, and tape.
1. Hang the spring or band from the hook and tape the ruler upright beside it. Hang the empty cup from it and note where its bottom edge is on the ruler.
2. Add one key at a time, up to six. After each, wait for the cup to stop moving and read the position with your eye level with the edge.
3. Work out the extension (the stretch beyond the empty-cup reading) for each number of keys.
4. Remove all the keys and check whether the cup returns to its first reading.
5. Plot extension (vertical) against number of keys (horizontal).

Sample results table (pen spring):

| Keys | 0 | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|---|
| Reading (cm) | 8.0 | 8.9 | 9.8 | 10.6 | 11.5 | 12.4 | 13.3 |
| Extension (cm) | 0 | 0.9 | 1.8 | 2.6 | 3.5 | 4.4 | 5.3 |

*What a good answer shows:* for the spring, each extra key adds roughly the same extension (about 0.9 cm), so the graph is a straight line through the origin: extension ∝ load, which is Hooke's law; the spring returned to 8.0 cm, so the elastic limit was not passed. A rubber band usually gives a curve (it stretches unevenly) and may not return exactly, so it does not obey Hooke's law well. A strong answer explains that this even "pull back" is why a spring gives SHM, links it to the okada's rear spring, and names an error with its effect, for example: reading the ruler from above made each reading slightly too small (parallax), or the cup swinging made it hard to read.

**Part B · Written Paper (30 marks)**

**b1 · Definitions (3 marks)**
Define: (a) the *spring constant* of a spring; (b) the *elastic limit*; (c) *restoring force*.
*Model solution:* (a) The spring constant is the force needed to produce unit extension (k = F/x); its unit is N m⁻¹. **(1)** (b) The elastic limit is the greatest load a spring can carry and still return to its original length when the load is removed. **(1)** (c) A restoring force is a force that acts on a displaced body in the direction back towards its equilibrium position. **(1)**
*Mark scheme note:* In (a) "the stiffness of the spring" alone scores zero; the force-per-unit-extension idea is needed. In (b) "the point where it breaks" is wrong (that is the breaking point). In (c) the direction towards equilibrium is essential.

**b2 · The SHM Condition (3 marks)**
(a) State the condition for a body to move with simple harmonic motion. (b) Write it as an equation and explain the minus sign. (c) Give two examples, other than a loaded spring, of systems that move with SHM.
*Model solution:* (a) The body's acceleration is directly proportional to how far it is displaced from a fixed (equilibrium) point and always points back towards that point. **(1)** (b) a = −ω²x; the minus sign shows that the acceleration is always opposite in direction to the displacement. **(1)** (c) Any two: a simple pendulum swinging through a small angle · a weighted test-tube bobbing upright in a liquid · the prong of a struck tuning fork · a plucked string. **(1)**
*Mark scheme note:* In (a) both "proportional to displacement" and "directed towards the fixed point" are needed. "Repeats its motion" alone describes periodic motion and scores zero. In (c) both examples must be correct; a bouncing ball is not accepted.

**b3 · Deriving the Spring Period (extension) (4 marks)**
A mass m hangs on a light spring of spring constant k. It is pulled down a further distance x below its equilibrium position. (a) Write the restoring force on the mass. (b) Use Newton's second law to find its acceleration. (c) Hence show that the motion is SHM and that T = 2π√(m/k).
*Model solution:* (a) The extra stretch x produces an extra spring force kx upwards, so the restoring force is F = −kx. **(1)** (b) a = F/m = −(k/m)x. **(1)** (c) Since k/m is a positive constant, a is proportional to x and opposite to it, which is the SHM condition a = −ω²x with ω² = k/m. **(1)** Then ω = √(k/m) and T = 2π/ω = 2π√(m/k). **(1)**
*Mark scheme note:* The minus sign must appear in (a) or (b) for the first two marks. In (c) the comparison with a = −ω²x is required; writing the formula from memory without the steps earns only the last mark.

**b4 · From Extension to Period (4 marks)**
A 0.20 kg mass stretches a spring by 4.0 cm. A 0.50 kg mass is then hung on the same spring and set bouncing. (Take g = 10 m s⁻².) Calculate: (a) the spring constant; (b) the period with the 0.50 kg mass; (c) its frequency; (d) the size of its acceleration when it is 2.0 cm from equilibrium.
*Model solution:* (a) k = F/x = (0.20 × 10) ÷ 0.040 = 2.0 ÷ 0.040 = 50 N m⁻¹. **(1)** (b) T = 2π√(m/k) = 2π√(0.50 ÷ 50) = 2π√0.010 = 2 × 3.142 × 0.10 = 0.628 s (0.63 s). **(1)** (c) f = 1/T = 1 ÷ 0.628 = 1.59 Hz. **(1)** (d) a = (k/m)x = (50 ÷ 0.50) × 0.020 = 100 × 0.020 = 2.0 m s⁻² (towards equilibrium). **(1)**
*Mark scheme note:* Error carried forward is allowed from (a). Using the 0.20 kg mass in (b) gives 0.40 s and loses the mark. Leaving x in centimetres in (a) or (d) loses that mark. Units are required.

**b5 · The Okada's Two Loads (5 marks)**
The okada's rear spring has k = 3.16 × 10⁴ N m⁻¹. (Take g = 9.8 m s⁻².) (a) Calculate the static sag (compression) of the spring with a 200 kg load. (b) Calculate the bounce period with 200 kg and with 250 kg. (c) Find the ratio of the two periods and show that it equals √(250/200). (d) How long do 20 bounces take with the 250 kg load?
*Model solution:* (a) x = mg/k = (200 × 9.8) ÷ 31 600 = 1960 ÷ 31 600 = 0.062 m (6.2 cm). **(1)** (b) T₁ = 2π√(200 ÷ 31 600) = 2π × 0.0796 = 0.50 s **(1)**; T₂ = 2π√(250 ÷ 31 600) = 2π × 0.0889 = 0.56 s. **(1)** (c) T₂/T₁ = 0.559 ÷ 0.500 = 1.12, and √(250/200) = √1.25 = 1.12, the same, because T ∝ √m. **(1)** (d) 20 × 0.559 = 11.2 s. **(1)**
*Mark scheme note:* In (a) using the mass (200 kg) as the force loses the mark. In (c) the √(m₂/m₁) statement must be shown. Accept 0.559 s or 0.56 s; error carried forward into (c) and (d).

**b6 · Practical: k from a T²–m Graph (6 marks)**
Zainab timed 20 oscillations of a spiral spring for five loads:

| m / kg | 0.100 | 0.200 | 0.300 | 0.400 | 0.500 |
|---|---|---|---|---|---|
| t / s (20 osc.) | 7.02 | 9.94 | 12.16 | 14.06 | 15.72 |

(a) Copy the table and add rows for T (3 d.p.) and T² (3 d.p.). (b) State what you would plot on each axis and the shape of graph you expect. (c) Using the points (0.100 kg, 0.123 s²) and (0.500 kg, 0.617 s²) read from the best-fit line, find the slope. (d) Deduce the spring constant.
*Model solution:* (a) T = t/20: 0.351, 0.497, 0.608, 0.703, 0.786 s **(1)**; T²: 0.123, 0.247, 0.370, 0.494, 0.618 s². **(1)** (b) T² on the vertical axis, m on the horizontal axis; a straight line through the origin. **(1)** (c) slope = (0.617 − 0.123) ÷ (0.500 − 0.100) = 0.494 ÷ 0.400 **(1)** = 1.235 s² kg⁻¹ (1.24). **(1)** (d) k = 4π²/slope = 39.48 ÷ 1.235 = 32 N m⁻¹. **(1)**
*Mark scheme note:* Accept T² values within ±0.002 s². In (c) a slope taken from two table rows close together, or inverted (Δm/ΔT²), loses both marks. In (d) "k = slope" scores zero; accept 31.5–32.5 N m⁻¹ on error carried forward.

**b7 · Practical: Precautions and Errors (3 marks)**
(a) State **two** precautions taken in the spiral-spring experiment. (b) The spring itself has some mass. State whether this makes the measured periods slightly too long or too short, and why.
*Model solution:* (a) Any two (1 each): I read the pointer with my eye level with it to avoid parallax · I ensured the spring was not loaded beyond its elastic limit (it returned to its original reading) · I pulled the load down only slightly so it bounced vertically without swinging · I started timing as the load passed the equilibrium position and repeated each timing. (Maximum 2.) **(2)** (b) Too long: part of the spring moves with the load, so the effective oscillating mass is a little more than m and T = 2π√(m/k) underestimates the real period. **(1)**
*Mark scheme note:* Past tense is required in (a). In (b) the direction and the reason are both needed for the mark.

**b8 · The Bridge: "Heavier Means Steadier" (2 marks)**
Dayo says that loading two extra crates makes the okada "steadier, so it won't bounce". Using T = 2π√(m/k), give two reasons why this is wrong.
*Model solution:* (1) The spring still provides a restoring force proportional to displacement, so the loaded okada still oscillates in SHM; extra mass does not remove the bounce. **(1)** (2) Extra mass makes the period longer (0.50 s → 0.56 s) and the frequency lower (2.0 Hz → 1.79 Hz): the bounce becomes slower, not smaller. **(1)**
*Mark scheme note:* "Heavy things still bounce" without a reason linked to the restoring force or to T ∝ √m scores zero. A second reason that only repeats the first earns no extra mark.

---

## Lesson 03 · SHM as a Circle's Shadow — Displacement, Velocity and Acceleration

### Part 1 · 12 Interactive MCQs (`window.LESSON_QUIZ`)

1. **[WAEC-style · Understand]** A lump of mud on a wheel of radius 0.30 m goes round at a steady 4.0 rad s⁻¹, and the midday sun casts its shadow on the ground. The shadow moves with simple harmonic motion of
   - **A.** amplitude 0.60 m and angular frequency 4.0 rad s⁻¹
   - **B.** amplitude 0.30 m and angular frequency 1.2 rad s⁻¹
   - **C.** amplitude 0.15 m and angular frequency 8.0 rad s⁻¹
   - **D.** amplitude 0.30 m and angular frequency 4.0 rad s⁻¹ ✓
   - *Explanation:* The shadow of a point moving uniformly round a circle moves in SHM along a diameter. Its amplitude equals the radius of the circle (0.30 m), and it completes one oscillation each time the lump goes round once, so its angular frequency equals the lump's angular speed (4.0 rad s⁻¹). A takes the diameter as the amplitude. B uses ωr = 1.2, which is the lump's *speed* in m s⁻¹, not an angular frequency. C halves the radius and doubles ω with no reason.

2. **[WAEC-style · Apply]** A body moves in SHM with amplitude 5.0 cm and angular frequency 8.0 rad s⁻¹. What is its speed when it is 3.0 cm from the equilibrium position?
   - **A.** 0.40 m s⁻¹
   - **B.** 0.32 m s⁻¹ ✓
   - **C.** 0.16 m s⁻¹
   - **D.** 0.24 m s⁻¹
   - *Explanation:* v = ω√(A² − x²) = 8.0 × √(0.050² − 0.030²) = 8.0 × √(0.0025 − 0.0009) = 8.0 × √0.0016 = 8.0 × 0.040 = 0.32 m s⁻¹. A is ωA, the *maximum* speed, which happens only at x = 0. C used ω(A − x), subtracting before squaring. D used ωx, which grows with displacement, the opposite of what really happens.

3. **[NECO-style · Apply]** A loudspeaker cone vibrates in SHM at 2.5 Hz with amplitude 4.0 cm while a test tone plays. What is its greatest acceleration?
   - **A.** 9.9 m s⁻² ✓
   - **B.** 0.63 m s⁻²
   - **C.** 0.25 m s⁻²
   - **D.** 987 m s⁻²
   - *Explanation:* ω = 2πf = 2π × 2.5 = 15.7 rad s⁻¹; a_max = ω²A = (15.7)² × 0.040 = 246.7 × 0.040 = 9.9 m s⁻². B is ωA = 0.63, which is the maximum *speed* in m s⁻¹. C used f² instead of ω² (2.5² × 0.040), leaving out (2π)². D kept the amplitude in centimetres (246.7 × 4.0).

4. **[JAMB-style · Understand]** Where is the speed of a body in simple harmonic motion greatest?
   - **A.** At each end of the motion, where the restoring force is greatest
   - **B.** Halfway between the equilibrium position and an end
   - **C.** At the equilibrium position ✓
   - **D.** It is the same at every point
   - *Explanation:* v = ω√(A² − x²) is largest when x = 0, at the equilibrium position, where v_max = ωA. A is Tunde's misconception: at the ends the body is momentarily at rest; it is the *acceleration* that is greatest there. B is a guess with no basis in the formula. D describes uniform motion, not SHM.

5. **[WAEC-style · Understand]** At an extreme position (x = ±A) of a body in SHM,
   - **A.** its velocity is greatest and its acceleration is zero
   - **B.** its velocity is zero and its acceleration is greatest ✓
   - **C.** both its velocity and its acceleration are zero
   - **D.** both its velocity and its acceleration are greatest
   - *Explanation:* At x = ±A, v = ω√(A² − A²) = 0, while |a| = ω²A, the largest value. A describes the equilibrium position instead. C is the common slip "it stops, so nothing is happening", but the restoring force is strongest at the ends, so the acceleration cannot be zero. D cannot happen in SHM, because speed and acceleration peak at different places.

6. **[NECO-style · Apply]** A body oscillates in SHM with amplitude 10 cm and period 1.2 s, timed from the equilibrium position so that x = A sin ωt. What is its displacement at t = 0.10 s?
   - **A.** 8.7 cm
   - **B.** 0.091 cm
   - **C.** 0.83 cm
   - **D.** 5.0 cm ✓
   - *Explanation:* ω = 2π/T = 2π ÷ 1.2 = 5.24 rad s⁻¹, so ωt = 5.24 × 0.10 = 0.524 rad (π/6). x = 10 × sin(π/6) = 10 × 0.500 = 5.0 cm. A used cos instead of sin (10 cos 30° = 8.7 cm), which would be correct only if timing started at an end. B worked out sin 0.524 with the calculator in *degree* mode. C assumed the displacement grows steadily with time (10 × 0.10 ÷ 1.2), ignoring the sine shape.

7. **[WAEC-style · Analyse]** On graphs of displacement and velocity against time for a body in SHM, how does the velocity–time curve compare with the displacement–time curve?
   - **A.** It is a quarter of a cycle ahead, so the velocity is greatest when the displacement is zero ✓
   - **B.** It is exactly the same shape and in step with it
   - **C.** It is the mirror image of it, being greatest where the displacement is greatest
   - **D.** It is a straight line, since velocity is constant
   - *Explanation:* If x = A sin ωt, then v = ωA cos ωt: a cosine curve, a quarter-cycle (90°) ahead of the sine, peaking whenever x passes through zero. B would put the greatest speed at the ends, which is false. C describes the *acceleration*–time curve (a = −ω²x), which is the inverted copy of x, and even then a is greatest in size where |x| is greatest, with opposite sign. D ignores that the body keeps speeding up and slowing down.

8. **[JAMB-style · Analyse]** A particle's acceleration is related to its displacement by a = −36x (SI units). What is its period?
   - **A.** 0.17 s
   - **B.** 6.0 s
   - **C.** 1.05 s ✓
   - **D.** 0.95 s
   - *Explanation:* Compare with a = −ω²x: ω² = 36, so ω = 6.0 rad s⁻¹ and T = 2π/ω = 6.283 ÷ 6.0 = 1.05 s. A is 2π ÷ 36: ω² was used in place of ω. B took ω itself as the period. D is ω ÷ 2π = 0.95, which is the frequency in hertz, not the period.

9. **[WAEC-style · Analyse]** A crate rests loosely on a carrier that bounces in SHM with amplitude 3.0 cm. Above what frequency will the crate start to leave the carrier at the top of each bounce? (Take g = 9.8 m s⁻².)
   - **A.** 18 Hz
   - **B.** 52 Hz
   - **C.** 0.35 Hz
   - **D.** 2.9 Hz ✓
   - *Explanation:* The crate leaves when the carrier's downward acceleration at the top exceeds g: ω²A > g. So ω² = g/A = 9.8 ÷ 0.030 = 327 s⁻², ω = 18.1 rad s⁻¹, and f = ω/2π = 18.1 ÷ 6.283 = 2.9 Hz. A stopped at ω (rad s⁻¹) and called it a frequency. B divided ω² by 2π instead of taking the square root first. C is 2π/ω, which is the *period* in seconds.

10. **[NECO-style · Apply]** The prong of a tuning fork vibrates at 256 Hz with an amplitude of 0.50 mm. What is its greatest speed?
    - **A.** 0.80 m s⁻¹ ✓
    - **B.** 0.13 m s⁻¹
    - **C.** 804 m s⁻¹
    - **D.** 1.3 × 10³ m s⁻¹
    - *Explanation:* ω = 2πf = 2π × 256 = 1608 rad s⁻¹ and A = 0.50 mm = 5.0 × 10⁻⁴ m, so v_max = ωA = 1608 × 5.0 × 10⁻⁴ = 0.80 m s⁻¹. B used f × A, leaving out the 2π. C left the amplitude in millimetres (1608 × 0.50). D is ω²A ≈ 1.3 × 10³, which is the maximum *acceleration* in m s⁻², not a speed.

11. **[WAEC-style · Understand]** The period of an oscillator is halved while its amplitude is kept the same. What happens to its maximum speed and its maximum acceleration?
    - **A.** Both double
    - **B.** Maximum speed is unchanged; maximum acceleration doubles
    - **C.** Maximum speed doubles; maximum acceleration becomes four times as large ✓
    - **D.** Both become four times as large
    - *Explanation:* Halving T doubles ω (ω = 2π/T). Then v_max = ωA doubles and a_max = ω²A grows by 2² = 4. A forgets that acceleration depends on ω squared. B wrongly assumes speed depends only on the amplitude. D squares for the speed too.

12. **[WAEC-style · Analyse]** Tunde says the crates jump off Dayo's carrier "because that is where the bike is moving fastest". Which statement correctly describes where and why the crates leave the carrier?
    - **A.** At the middle of the bounce, where the carrier's speed is greatest and it throws the crate upwards
    - **B.** At the top of the bounce, where the carrier's speed is zero but its downward acceleration is greatest; once that acceleration exceeds g, the carrier drops away faster than the crate can fall ✓
    - **C.** At the bottom of the bounce, where the carrier's upward acceleration is greatest
    - **D.** Anywhere, because a bigger bounce always throws crates off regardless of its size
    - *Explanation:* At the top, the carrier is momentarily still but accelerating downwards at ω²A. The crate is pulled down only by gravity, at g, so if ω²A > g the carrier falls away from under it and the crate lifts clear. A is Tunde's mix-up of speed with acceleration; at the middle the acceleration is zero. C is where the carrier pushes up *hardest* on the crate, pressing the crate firmly onto it, not letting it go. D ignores the threshold: the crates stay on while A < g/ω² (6.2 cm for the okada).

### Part 2 · Home Investigation & 30-Mark Written Paper (Lesson 03)

**Part A · Home Investigation:** *The shadow of a turning wheel.*
You need: a bicycle (or a basin lid or a round tray that can turn on a nail), a bottle cap and tape, a torch, a plain wall, a pencil and paper. Work with an adult; keep fingers away from the spokes.
1. Turn the bicycle upside down so the front wheel spins freely, or fix the lid on a nail so it can turn. Tape the bottle cap to the rim.
2. In a dim room, shine the torch from the side so the cap throws a shadow on the wall, moving up and down (or side to side).
3. Turn the wheel slowly and as steadily as you can. Watch the shadow, not the cap.
4. Mark on the wall (with tape) the two ends of the shadow's path and its middle.
5. Turn the wheel through quarter turns, pausing each time, and note where the shadow is.
6. Describe where the shadow moves fastest and where it slows down and turns round.

Sample observations:

| Cap position on wheel | Shadow position | How the shadow is moving |
|---|---|---|
| Level with the hub (side of wheel) | Middle mark | Fastest |
| Top of wheel | Top end mark | Stopped, turning round |
| Level with the hub (other side) | Middle mark | Fastest, other direction |
| Bottom of wheel | Bottom end mark | Stopped, turning round |

*What a good answer shows:* the shadow's path length equals the wheel's diameter, so the amplitude is the radius; the shadow is fastest at the middle and momentarily still at the ends, exactly like the bouncing carrier; one turn of the wheel equals one complete oscillation of the shadow, so they share the same period. A strong answer connects this to the reference circle, explains that the shadow must be accelerating hardest at the ends (it stops and reverses there), and names a source of error, for example: the wheel was not turned at a steady rate, or the torch was too close so the shadow was enlarged unevenly.

**Part B · Written Paper (30 marks)**

**b1 · Definitions (3 marks)**
(a) Define *simple harmonic motion* in terms of acceleration. (b) What is meant by the *reference circle* for an SHM? (c) Define *angular frequency*, and give its unit.
*Model solution:* (a) SHM is motion in which a body's acceleration is directly proportional to how far it is displaced from a fixed point and always points back towards that point. **(1)** (b) It is a circle of radius equal to the amplitude, round which a point moves at constant angular speed ω; the projection (shadow) of that point on a diameter moves with the SHM. **(1)** (c) Angular frequency is 2π times the frequency (ω = 2πf = 2π/T), the angle in radians swept per second by the point on the reference circle; unit rad s⁻¹. **(1)**
*Mark scheme note:* In (b) both "radius = amplitude" (or "point moving uniformly") and "projection on a diameter" are needed. In (c) the unit is required.

**b2 · Where Things Happen (3 marks)**
Copy and complete the table for a body in SHM, writing *zero* or *maximum* in each box.

| | Displacement | Speed | Acceleration |
|---|---|---|---|
| At the equilibrium position | | | |
| At an extreme position | | | |

*Model solution:* Equilibrium: displacement zero, speed maximum, acceleration zero. Extreme: displacement maximum, speed zero, acceleration maximum. **(1)** for the displacement column, **(1)** for the speed column, **(1)** for the acceleration column.
*Mark scheme note:* Each column must have both entries right for its mark. Writing "maximum" for speed at the extreme position (the "fastest at the ends" error) loses the speed mark.

**b3 · From the Circle to the Formulae (4 marks)**
A point P moves round a circle of radius A at constant angular speed ω, starting on the horizontal diameter at t = 0. N is the projection of P on the vertical diameter. (a) Show that the displacement of N from the centre is x = A sin ωt. (b) Given that the velocity of N is v = ωA cos ωt, show that v = ω√(A² − x²). (c) State the maximum speed and where it occurs.
*Model solution:* (a) After time t the radius OP has turned through angle θ = ωt; the vertical component of OP is A sin θ, so x = A sin ωt. **(1)** (b) cos ωt = √(1 − sin² ωt) = √(1 − x²/A²) **(1)**; so v = ωA√(1 − x²/A²) = ω√(A² − x²). **(1)** (c) v_max = ωA, when x = 0 (at the equilibrium position). **(1)**
*Mark scheme note:* In (a) the angle ωt must be identified. In (b) the identity sin² + cos² = 1 must be used or clearly implied; quoting the result without working earns no mark. In (c) the position is required.

**b4 · A Bouncing Load (5 marks)**
A load on a spring oscillates in SHM with amplitude 0.12 m and period 0.80 s, timed from the equilibrium position. Calculate: (a) its angular frequency; (b) its maximum speed; (c) its maximum acceleration; (d) its speed when it is 0.060 m from equilibrium; (e) its displacement at t = 0.10 s.
*Model solution:* (a) ω = 2π/T = 6.283 ÷ 0.80 = 7.85 rad s⁻¹. **(1)** (b) v_max = ωA = 7.85 × 0.12 = 0.94 m s⁻¹. **(1)** (c) a_max = ω²A = 61.7 × 0.12 = 7.4 m s⁻². **(1)** (d) v = ω√(A² − x²) = 7.85 × √(0.0144 − 0.0036) = 7.85 × 0.104 = 0.82 m s⁻¹. **(1)** (e) ωt = 7.85 × 0.10 = 0.785 rad (π/4); x = 0.12 × sin(π/4) = 0.12 × 0.707 = 0.085 m. **(1)**
*Mark scheme note:* Error carried forward from (a). In (e) a calculator in degree mode gives 0.0016 m and loses the mark. Units required.

**b5 · The Lift-off Threshold (4 marks)**
The okada's rear bounces at its natural frequency f₀. (Take g = 9.8 m s⁻².) (a) Explain why a crate resting loosely on the carrier leaves it when ω²A > g. (b) With 200 kg on the carrier, ω = 12.57 rad s⁻¹. Find the smallest amplitude for lift-off. (c) With 250 kg, ω = 11.24 rad s⁻¹. Find the new threshold and say whether a 7.0 cm bounce would now throw the crates.
*Model solution:* (a) At the top of the bounce the carrier accelerates downwards at ω²A; the crate can only fall at g, so if ω²A exceeds g the carrier moves down faster than the crate and they separate. **(1)** (b) A = g/ω² = 9.8 ÷ (12.57)² = 9.8 ÷ 158 = 0.062 m = 6.2 cm. **(1)** (c) A = 9.8 ÷ (11.24)² = 9.8 ÷ 126.4 = 0.078 m = 7.8 cm **(1)**; 7.0 cm is below 7.8 cm, so the crates would stay on (just). **(1)**
*Mark scheme note:* In (a) the comparison of the carrier's downward acceleration with g is essential; "the bike is going fast" scores zero. In (c) the conclusion must follow from the comparison, error carried forward allowed.

**b6 · Practical: The Wheel-and-Shadow Bench (6 marks)**
On the 2D bench, the wheel had radius A = 0.20 m and period T = 2.5 s. Zainab paused the shadow at four angles θ = ωt.
(a) Calculate ω. (b) Copy and complete the table (3 s.f.). (c) Show that a/x is the same at 30° and at 60°, and say what it equals. (d) State, with a reason, at which angle the shadow moved fastest.

| θ / ° | 0 | 30 | 60 | 90 |
|---|---|---|---|---|
| x / m | | | | |
| v / m s⁻¹ | | | | |
| a / m s⁻² | | | | |

*Model solution:* (a) ω = 2π ÷ 2.5 = 2.51 rad s⁻¹ (ω² = 6.32 s⁻²). **(1)** (b) x = A sin θ: 0, 0.100, 0.173, 0.200 m **(1)**; v = ωA cos θ: 0.503, 0.435, 0.251, 0 m s⁻¹ **(1)**; a = −ω²x: 0, −0.632, −1.09, −1.26 m s⁻². **(1)** (c) −0.632 ÷ 0.100 = −6.32 s⁻² and −1.094 ÷ 0.1732 = −6.32 s⁻² (using unrounded values); both equal −ω². **(1)** (d) At 0°, where x = 0 (equilibrium): the speed v = ωA cos θ is greatest when cos θ = 1. **(1)**
*Mark scheme note:* Each row of (b) needs all four entries (±1 in the last figure). Missing minus signs on a lose that row's mark. In (c) "−ω²" (or "minus omega squared") must be stated.

**b7 · Sketching x, v and a (3 marks)**
On one time axis, describe (or sketch) the graphs of x, v and a against t for one cycle of SHM starting at equilibrium, and state the phase relationship of v and of a to x.
*Model solution:* x is a sine curve starting at zero and rising. **(1)** v is a cosine curve starting at its maximum: it is a quarter of a cycle (90°) ahead of x. **(1)** a is an inverted sine curve, exactly opposite to x (half a cycle, 180°, out of phase), with its peaks of size ω²A where x = ±A. **(1)**
*Mark scheme note:* Sketches must be correctly aligned in time. "a is the same as x" (missing the inversion) loses the third mark.

**b8 · The Bridge: Correcting Tunde (2 marks)**
Tunde says the crates jump off "where the bike is moving fastest". Correct him in two sentences, using the ideas of this lesson.
*Model solution:* The carrier is fastest at the middle of its bounce, where its acceleration is zero, so it is not throwing anything off there. **(1)** The crates leave at the top of the bounce, where the carrier is momentarily still but has its greatest downward acceleration ω²A; when that exceeds g the carrier drops away from under them. **(1)**
*Mark scheme note:* Both "speed greatest at the middle" and "acceleration greatest at the top, compared with g" are needed for full marks.

---

## Lesson 04 · The Simple Pendulum — Restoring Force, Small Angles and T = 2π√(l/g)

### Part 1 · 12 Interactive MCQs (`window.LESSON_QUIZ`)

1. **[WAEC-style · Understand]** A pendulum bob of mass m is pulled aside so its thread makes an angle θ with the vertical. Which force pulls it back towards its lowest point?
   - **A.** mg sin θ, the component of its weight along the arc ✓
   - **B.** The tension in the thread
   - **C.** mg cos θ, the component of its weight along the thread
   - **D.** Its full weight, mg
   - *Explanation:* The weight splits into mg cos θ along the thread and mg sin θ along the arc. The tension balances the first part (and provides the centripetal pull), so the part left over to drive the bob back to the middle is mg sin θ. B acts along the thread, at right angles to the bob's path, so it cannot push the bob along the arc. C is the component the tension cancels. D acts straight down; only its component along the path restores the bob.

2. **[NECO-style · Apply]** A simple pendulum is 1.6 m long. What is its period? (Take g = 10 m s⁻².)
   - **A.** 0.40 s
   - **B.** 1.0 s
   - **C.** 2.5 s ✓
   - **D.** 15.7 s
   - *Explanation:* T = 2π√(l/g) = 2π√(1.6 ÷ 10) = 2π√0.16 = 2 × 3.142 × 0.40 = 2.5 s. A forgot the 2π (√0.16). B forgot the square root (2π × 0.16 = 1.0). D turned the fraction upside down (2π√(10 ÷ 1.6) = 2π × 2.5).

3. **[JAMB-style · Apply]** A pendulum 0.36 m long has a period of 1.2 s. Its thread is lengthened to 0.81 m. What is the new period?
   - **A.** 2.7 s
   - **B.** 0.80 s
   - **C.** 1.2 s
   - **D.** 1.8 s ✓
   - *Explanation:* T ∝ √l, so T₂/T₁ = √(l₂/l₁) = √(0.81 ÷ 0.36) = √2.25 = 1.5, giving T₂ = 1.5 × 1.2 = 1.8 s. A multiplied by 2.25, leaving out the square root. B divided by 1.5, as if a longer thread swung faster. C assumes the length makes no difference; length is the one thing (with g) that does.

4. **[WAEC-style · Understand]** Tunde replaces a 50 g wooden bob with a 100 g brass bob of the same size on the same thread and releases it through the same small angle. What happens to the period?
   - **A.** It doubles, because the brass bob is twice as heavy
   - **B.** It stays the same, because the period of a simple pendulum does not depend on the mass of the bob ✓
   - **C.** It becomes √2 times as long, because T ∝ √m
   - **D.** It halves, because gravity pulls the heavier bob harder
   - *Explanation:* In a = −(g/l)x the mass has cancelled: doubling m doubles both the restoring force and the inertia, so the acceleration at each point is unchanged and T = 2π√(l/g) stays the same. A and D are the "heavier changes the rhythm" myth in both directions. C borrows T ∝ √m from the loaded *spring*; it does not apply to a pendulum.

5. **[WAEC-style · Analyse]** A pendulum has a period of 1.5 s on Earth. What would its period be on the Moon, where g is only one-sixth of its value on Earth?
   - **A.** 9.0 s
   - **B.** 0.61 s
   - **C.** 3.7 s ✓
   - **D.** 0.25 s
   - *Explanation:* T ∝ 1/√g, so T_Moon = T_Earth × √(g_E/g_M) = 1.5 × √6 = 1.5 × 2.45 = 3.7 s. A multiplied by 6, leaving out the square root. B divided by √6, as if weaker gravity made the pendulum swing faster. D divided by 6.

6. **[NECO-style · Understand]** Why does the WAEC pendulum practical insist that the bob swings through a **small** angle?
   - **A.** Only for small angles is sin θ ≈ θ, so the restoring force is proportional to the displacement and the motion is simple harmonic ✓
   - **B.** A large angle would make the thread break
   - **C.** For a small angle the bob's mass no longer matters
   - **D.** A small angle makes the period shorter, so timing is quicker
   - *Explanation:* The restoring force is mg sin θ. Only when θ is small (in radians) is sin θ ≈ θ ≈ x/l, which makes the force proportional to x and gives a = −(g/l)x, the SHM condition behind T = 2π√(l/g). B is not the reason (a lab thread copes easily). C is wrong because mass cancels at *any* angle. D gets it backwards: in the small-angle range the period hardly changes at all.

7. **[WAEC-style · Apply]** A pendulum 0.900 m long makes 20 oscillations in 38.0 s. What value of g does this give?
   - **A.** 18.7 m s⁻²
   - **B.** 9.84 m s⁻² ✓
   - **C.** 0.102 m s⁻²
   - **D.** 1.57 m s⁻²
   - *Explanation:* T = 38.0 ÷ 20 = 1.90 s, so T² = 3.61 s². Rearranging T = 2π√(l/g) gives g = 4π²l/T² = 39.48 × 0.900 ÷ 3.61 = 9.84 m s⁻². A divided by T instead of T² (forgot to square). C is T²/(4π²l), the rearrangement upside down. D used 2π in place of 4π² (2π × 0.900 ÷ 3.61), forgetting that squaring 2π gives 4π².

8. **[JAMB-style · Analyse]** A simple pendulum and a mass on a spring both have a period of 1.0 s on Earth. Both are carried to the Moon. What happens to their periods there?
   - **A.** Both periods become longer
   - **B.** Both periods stay the same
   - **C.** The pendulum's period stays the same; the spring's becomes longer
   - **D.** The pendulum's period becomes longer; the spring's stays the same ✓
   - *Explanation:* The pendulum's restoring force comes from gravity, so T = 2π√(l/g) grows when g falls. The spring's restoring force comes from its stiffness, and T = 2π√(m/k) contains no g, so its period is unchanged (only its resting stretch changes). A and B treat the two systems alike; C swaps them.

9. **[NECO-style · Apply]** What length of simple pendulum has a period of 1.20 s? (Take g = 9.8 m s⁻².)
   - **A.** 0.30 m
   - **B.** 0.36 m ✓
   - **C.** 2.25 m
   - **D.** 5.80 m
   - *Explanation:* l = gT²/4π² = 9.8 × (1.20)² ÷ 39.48 = 9.8 × 1.44 ÷ 39.48 = 14.11 ÷ 39.48 = 0.36 m. A forgot to square T (9.8 × 1.20 ÷ 39.48). C divided by 2π instead of 4π². D turned the fraction upside down (4π²T²/g).

10. **[WAEC-style · Understand]** Zainab releases the same pendulum first at 10° and then at 45°. Which statement is correct?
    - **A.** The period is exactly the same at both angles
    - **B.** The period at 45° is much shorter because the bob moves faster
    - **C.** The period at 45° is exactly 4.5 times as long, because the bob goes further
    - **D.** The period at 45° is slightly longer, because sin θ is then noticeably less than θ and the restoring force is no longer proportional to displacement ✓
    - *Explanation:* At 45° the motion is no longer quite SHM: the restoring force grows less quickly than the displacement, so the bob takes a little longer (about 4 % here). A is true only within the small-angle range, which 45° is outside. B ignores that the extra distance outweighs the extra speed. C assumes the period grows in proportion to the angle; in fact the change is only a few per cent.

11. **[JAMB-style · Apply]** Pendulum Q is nine times as long as pendulum P, and both swing at the same place. What is the ratio of the frequency of P to the frequency of Q?
    - **A.** 3 : 1 ✓
    - **B.** 1 : 3
    - **C.** 9 : 1
    - **D.** 1 : 9
    - *Explanation:* T ∝ √l, so T_Q = √9 × T_P = 3T_P. Frequency is 1/T, so f_P : f_Q = 3 : 1: the shorter pendulum vibrates three times as often. B is the ratio of the *periods*, not the frequencies. C and D leave out the square root.

12. **[WAEC Practical · Analyse]** Using data from the pendulum-laws bench, which graph would give a straight line through the origin?
    - **A.** T against l
    - **B.** T against 1/l
    - **C.** T against √l ✓
    - **D.** T² against 1/l
    - *Explanation:* T = (2π/√g) × √l, so T is directly proportional to √l: plotting T against √l gives a straight line through the origin with gradient 2π/√g. (Equally, T² against l is a straight line through the origin.) A gives a curve that bends over, because T grows more slowly than l. B and D give curves, because T falls as 1/l grows, while the real T increases with l.

### Part 2 · Home Investigation & 30-Mark Written Paper (Lesson 04)

**Part A · Home Investigation:** *Key against padlock: does mass change the swing?*
You need: two pieces of thread about 80 cm long, a light key, a heavy padlock, a broom handle or rod laid across two chairs, tape, a tape measure and a phone stopwatch.
1. Tie the key to one thread and the padlock to the other. Hang both from the rod so that each length, from the rod to the middle of the object, is the same (say 60 cm). Keep them about 30 cm apart.
2. Pull both aside by the same small angle (about 10°, roughly 10 cm sideways) and release them together. Watch for 20 swings: do they stay in step?
3. Time 20 oscillations of each separately, twice.
4. Now shorten the key's thread to 30 cm and release both together again. Watch which one gets ahead.

Sample results table:

| Pendulum | Length (m) | t₁ for 20 (s) | t₂ for 20 (s) | T (s) |
|---|---|---|---|---|
| Key | 0.60 | 31.2 | 31.0 | 1.56 |
| Padlock | 0.60 | 31.1 | 31.2 | 1.56 |
| Key (shortened) | 0.30 | 22.1 | 21.9 | 1.10 |

*What a good answer shows:* the key and the padlock at the same length stay in step and have the same period within timing error (about 1.56 s), so the mass of the bob does not change T, which disproves Tunde's "heavier is steadier"; halving the length shortens the period by a factor of about √2 (1.56 ÷ 1.10 ≈ 1.4), so length does change it. A strong answer explains why mass cancels (bigger weight but also bigger inertia), notes that the angle was kept small and the same for a fair test, and names a source of error: the lengths were measured to the top of the objects rather than their centres, or a draught pushed the light key more than the padlock.

**Part B · Written Paper (30 marks)**

**b1 · Definitions (3 marks)**
Define: (a) a *simple pendulum*; (b) a *seconds pendulum*; (c) the *effective length* of a simple pendulum.
*Model solution:* (a) A small heavy bob hung from a fixed point by a light, inextensible thread, free to swing to and fro in a vertical plane. **(1)** (b) A simple pendulum that takes exactly 2 s for one complete oscillation (each swing from one end to the other takes 1 s). **(1)** (c) The distance from the point of suspension to the centre of mass (centre) of the bob. **(1)**
*Mark scheme note:* In (a) "light thread" and "heavy (small) bob" are both needed. In (b) "period 1 s" is a common error and scores zero. In (c) "the length of the thread" alone is not accepted.

**b2 · What Sets the Period? (3 marks)**
(a) Name the two quantities on which the period of a simple pendulum depends. (b) Name two quantities that do **not** affect it (for small swings). (c) Why must the swing be small?
*Model solution:* (a) The length l and the acceleration due to gravity g. **(1)** (b) The mass of the bob and the amplitude (angle) of a small swing; also accept the material or colour of the bob. **(1)** (c) Only for small angles is sin θ ≈ θ, so that the restoring force is proportional to displacement and the motion is SHM. **(1)**
*Mark scheme note:* Both answers are needed in (a) and in (b). "Small angles are safer" scores zero in (c).

**b3 · Deriving T = 2π√(l/g) (extension) (5 marks)**
A bob of mass m on a thread of length l is displaced through a small angle θ, its displacement along the arc being x. (a) Draw and label the forces on the bob. (b) Write the restoring force. (c) Using the small-angle approximation, show that a = −(g/l)x. (d) Hence show that the motion is SHM and that T = 2π√(l/g). (e) Explain why the mass of the bob does not appear.
*Model solution:* (a) Weight mg vertically down and tension along the thread towards the support; mg resolved into mg cos θ along the thread and mg sin θ along the arc. **(1)** (b) F = −mg sin θ (towards the lowest point). **(1)** (c) For small θ in radians, sin θ ≈ θ = x/l, so F ≈ −mg(x/l) and a = F/m = −(g/l)x. **(1)** (d) g/l is a positive constant, so a ∝ −x: SHM with ω² = g/l; T = 2π/ω = 2π√(l/g). **(1)** (e) m appears in both the restoring force and in F = ma, so it cancels. **(1)**
*Mark scheme note:* The small-angle step (sin θ ≈ θ = x/l) must be stated for (c). A formula quoted without derivation earns only (d) if the comparison with a = −ω²x is shown.

**b4 · A Long Pendulum (4 marks)**
A pendulum in a school hall is 1.21 m long. (Take g = 9.8 m s⁻².) Calculate: (a) its period; (b) the time for 50 oscillations; (c) the length needed for a period of 1.10 s; (d) the frequency of the 1.10 s pendulum.
*Model solution:* (a) T = 2π√(1.21 ÷ 9.8) = 2π√0.1235 = 2π × 0.3514 = 2.21 s. **(1)** (b) 50 × 2.208 = 110 s. **(1)** (c) l = gT²/4π² = 9.8 × 1.21 ÷ 39.48 = 0.300 m. **(1)** (d) f = 1 ÷ 1.10 = 0.909 Hz. **(1)**
*Mark scheme note:* Error carried forward into (b). In (c) forgetting to square T gives 0.273 m and loses the mark. Units required.

**b5 · Earth and Moon (5 marks)**
A clock pendulum has a period of 2.40 s on Earth (g = 9.8 m s⁻²). (a) Calculate its length. (b) Calculate its period on the Moon, where g is one-sixth of Earth's. (c) What length would give a period of 2.40 s on the Moon? (d) Explain why a pendulum clock taken to the Moon without adjustment would show the wrong time, and say whether it would gain or lose.
*Model solution:* (a) l = gT²/4π² = 9.8 × 5.76 ÷ 39.48 = 1.43 m. **(1)** (b) T_M = 2.40 × √6 = 2.40 × 2.449 = 5.88 s. **(1)** (c) For the same T, l ∝ g, so l_M = 1.43 ÷ 6 = 0.238 m (0.24 m). **(1)** (d) Each swing takes longer, so the clock ticks fewer times per real hour **(1)**: it loses time (runs slow). **(1)**
*Mark scheme note:* In (b) multiplying by 6 (14.4 s) loses the mark. In (c) "l × 6" is the inverse error. In (d) "gains" scores zero for the last mark.

**b6 · Practical: Testing the Pendulum Laws (5 marks)**
Zainab changed one variable at a time and timed 20 oscillations:

| Test | Length / m | Bob mass / g | Angle / ° | t (20 osc.) / s |
|---|---|---|---|---|
| 1 | 0.60 | 50 | 8 | 31.10 |
| 2 | 0.60 | 100 | 8 | 31.12 |
| 3 | 0.60 | 100 | 4 | 31.08 |
| 4 | 0.30 | 100 | 8 | 22.00 |
| 5 | 1.20 | 100 | 8 | 43.98 |

(a) Calculate T for tests 1, 4 and 5. (b) What do tests 1 and 2 show? (c) What do tests 2 and 3 show? (d) Use tests 4 and 5 to show that T ∝ √l.
*Model solution:* (a) T₁ = 31.10 ÷ 20 = 1.555 s; T₄ = 22.00 ÷ 20 = 1.100 s; T₅ = 43.98 ÷ 20 = 2.199 s. **(1)** (b) Doubling the mass left T unchanged (within 0.02 s in 31 s), so T does not depend on the bob's mass. **(1)** (c) Halving the (small) angle left T unchanged, so for small swings T does not depend on amplitude. **(1)** (d) l₅/l₄ = 1.20 ÷ 0.30 = 4 **(1)**; T₅/T₄ = 2.199 ÷ 1.100 = 2.0 = √4, so T ∝ √l. **(1)**
*Mark scheme note:* All three periods are needed in (a). In (b) and (c) the conclusion must name the variable. In (d) the ratio comparison is required; "T increases with l" alone earns no marks.

**b7 · Pendulum or Spring? (3 marks)**
For each change, say whether the period of (i) a simple pendulum and (ii) a mass on a spring increases, decreases or stays the same: (a) the mass of the bob or load is doubled; (b) the system is taken to the Moon; (c) the amplitude is halved (still small).
*Model solution:* (a) Pendulum: same; spring: increases (×√2). **(1)** (b) Pendulum: increases (×√6); spring: same. **(1)** (c) Both stay the same. **(1)**
*Mark scheme note:* Each part needs both systems right for its mark.

**b8 · The Bridge: The 6.2 cm Pendulum (2 marks)**
Mrs Okafor's short pendulum keeps time with the okada's bounce (T = 0.50 s). (Take g = 9.8 m s⁻².) (a) Calculate its length. (b) Show that it equals the okada's static sag, mg/k, with m = 200 kg and k = 3.16 × 10⁴ N m⁻¹.
*Model solution:* (a) l = gT²/4π² = 9.8 × 0.25 ÷ 39.48 = 0.062 m (6.2 cm). **(1)** (b) mg/k = 200 × 9.8 ÷ 31 600 = 0.062 m: the same, because the two periods are equal when l/g = m/k. **(1)**
*Mark scheme note:* In (b) the numerical check alone earns the mark; the l/g = m/k reason is credit-worthy but not required.

---

## Lesson 05 · WAEC Practical — Determining g with a Simple Pendulum

### Part 1 · 12 Interactive MCQs (`window.LESSON_QUIZ`)

1. **[WAEC Practical · Apply]** The thread of a pendulum measures 0.850 m from where it leaves the split cork down to the top of the bob. The bob's diameter is 3.0 cm. What is the effective length l?
   - **A.** 0.880 m
   - **B.** 0.850 m
   - **C.** 0.865 m ✓
   - **D.** 0.835 m
   - *Explanation:* The effective length runs from the point of suspension to the *centre* of the bob, so add the radius: l = 0.850 + 0.015 = 0.865 m. A added the whole diameter, measuring to the bottom of the bob. B is Tunde's slip of stopping at the top of the bob. D subtracted the radius instead of adding it.

2. **[WAEC Practical · Apply]** A candidate's graph of T² (vertical) against l (horizontal) has a slope of 4.00 s² m⁻¹. What value of g does it give?
   - **A.** 0.101 m s⁻²
   - **B.** 9.87 m s⁻² ✓
   - **C.** 158 m s⁻²
   - **D.** 1.57 m s⁻²
   - *Explanation:* T² = (4π²/g) l, so slope = 4π²/g and g = 4π²/slope = 39.48 ÷ 4.00 = 9.87 m s⁻². A is slope ÷ 4π², the rearrangement turned over. C multiplied the slope by 4π². D used 2π instead of 4π² (6.283 ÷ 4.00).

3. **[WAEC Practical · Analyse]** Why does the WAEC pendulum practical ask candidates to plot T² against l rather than T against l?
   - **A.** T² values are larger and so easier to plot
   - **B.** Squaring T removes the reaction-time error
   - **C.** The T–l graph would have a negative slope
   - **D.** T² is directly proportional to l, so the graph is a straight line through the origin whose slope, 4π²/g, gives g ✓
   - *Explanation:* Squaring T = 2π√(l/g) gives T² = (4π²/g) l, the form y = mx. A straight line is easy to draw as a best fit and its slope is easy to measure. A is not a reason examiners accept. B is false: squaring cannot remove an error, and it actually doubles the percentage error in T. C is false: T increases with l, but along a curve, not a straight line.

4. **[WAEC Practical · Analyse]** Throughout an experiment, Tunde measured every length to the **top** of the bob instead of its centre. How does this affect his T²–l graph?
   - **A.** The line no longer passes through the origin, but its slope, and so the value of g, is unaffected ✓
   - **B.** The slope becomes larger, so g comes out too small
   - **C.** The slope becomes smaller, so g comes out too large
   - **D.** The points scatter widely about the line
   - *Explanation:* Every length is too short by the same amount, the radius r, so every point shifts left by r. The line keeps the same slope but now cuts the T² axis above zero (at T² = 4π²r/g). Because g comes from the slope, it is unaffected; this is one reason the graph method beats a single reading. B and C would need an error that grows with length. D describes a random error; a constant mistake on every reading moves the line, not the scatter.

5. **[WAEC Practical · Analyse]** Tunde starts the stopwatch and says "one" as he does so, then stops at "twenty". How does this affect his period and his value of g?
   - **A.** T is too large, so g is too small
   - **B.** T and g are both unaffected
   - **C.** T is too large, so g is too large
   - **D.** T is too small, so g is too large ✓
   - *Explanation:* Counting "one" at the start means only 19 oscillations have passed when he says "twenty", but he still divides the time by 20. So T is too small (by the factor 19/20) and g = 4π²l/T² comes out too large, by about 11 %. A has the direction reversed. B ignores the miscount. C pairs a larger T with a larger g, which the formula rules out, since g ∝ 1/T².

6. **[WAEC Practical · Understand]** Which of these is correctly written as a **precaution** for the pendulum experiment?
   - **A.** Ensure that the angle of swing is small
   - **B.** I ensured that the bob swung through a small angle ✓
   - **C.** Reaction time when starting the stopwatch
   - **D.** I was careful when taking all my readings
   - *Explanation:* A precaution states something that *was done* to improve the result, in the past tense, and it is specific. A is an instruction (a command), which examiners do not credit. C is a source of error, not a precaution. D is too vague: it does not say what was done.

7. **[WAEC Practical · Apply]** For one length, Zainab's two timings of 20 oscillations were 31.62 s and 31.70 s. What value should she enter in the T² column, to 3 decimal places?
   - **A.** 1.583 s²
   - **B.** 2.500 s²
   - **C.** 2.506 s² ✓
   - **D.** 0.632 s²
   - *Explanation:* Mean time t̄ = (31.62 + 31.70) ÷ 2 = 31.66 s; T = 31.66 ÷ 20 = 1.583 s; T² = (1.583)² = 2.506 s². A is T itself, not squared. B used only the first timing ((31.62 ÷ 20)²), ignoring the repeat. D is 1/T.

8. **[WAEC Practical · Analyse]** The ceiling was too high to reach, so a class measured the height y of the bob's centre above the floor instead. Their graph of T² against y is a straight line of slope −4.04 s² m⁻¹ that cuts the horizontal axis (where T² = 0) at y = 3.10 m. What are g and the height H of the point of suspension?
   - **A.** g = 9.77 m s⁻², H = 3.10 m ✓
   - **B.** g = −9.77 m s⁻², H = 3.10 m
   - **C.** g = 9.77 m s⁻², H = 4.04 m
   - **D.** g = 0.102 m s⁻², H = 3.10 m
   - *Explanation:* Here l = H − y, so T² = (4π²/g)(H − y): the slope is −4π²/g and the line cuts the horizontal axis (T² = 0) at y = H. Then g = 4π²/|slope| = 39.48 ÷ 4.04 = 9.77 m s⁻² and H = 3.10 m. B keeps the minus sign; g cannot be negative, since the sign only shows that T² falls as y rises. C takes the slope's size as the height. D is |slope| ÷ 4π², the rearrangement upside down.

9. **[WAEC-style · Apply]** A thread is 0.580 m long from the cork to the top of a bob of radius 2.0 cm. Twenty oscillations take 31.20 s. What value of g does this single reading give?
   - **A.** 9.73 m s⁻² ✓
   - **B.** 9.41 m s⁻²
   - **C.** 15.2 m s⁻²
   - **D.** 0.024 m s⁻²
   - *Explanation:* l = 0.580 + 0.020 = 0.600 m; T = 31.20 ÷ 20 = 1.560 s; T² = 2.434 s²; g = 4π²l/T² = 39.48 × 0.600 ÷ 2.434 = 9.73 m s⁻². B left out the radius (l = 0.580 m). C divided by T instead of T². D used the whole time for 20 oscillations as if it were the period.

10. **[WAEC Practical · Understand]** When finding the slope of the T²–l line, why should the candidate use a large triangle?
    - **A.** A large triangle makes the slope come out larger
    - **B.** Examiners award marks only for the size of the drawing
    - **C.** The readings of ΔT² and Δl are then large, so the small uncertainty in reading the graph is a small percentage of each ✓
    - **D.** A large triangle forces the line through the origin
    - *Explanation:* Each value read from the graph carries roughly the same small reading uncertainty (about half a small square). Over a large Δ that uncertainty is a tiny fraction, so the slope is more accurate. A is false: the slope of a straight line is the same for any triangle drawn on it. B misses the physics. D is false: the triangle cannot change where the line goes.

11. **[WAEC Practical · Analyse]** Tunde released the bob through a wide angle of about 40° for every length. How did this most likely affect his value of g?
    - **A.** No effect, because the period does not depend on the amplitude at any angle
    - **B.** g came out slightly too small, because each period was slightly too long ✓
    - **C.** g came out slightly too large, because each period was slightly too short
    - **D.** g came out much too large, because the bob moved faster
    - *Explanation:* At 40° the restoring force is no longer proportional to displacement, so each period is a little longer (about 3 %) than 2π√(l/g). A longer T in g = 4π²l/T² gives a smaller g. A applies the small-angle rule outside its range. C has the direction reversed. D ignores that the bob also has further to travel; the overall effect is a slightly *longer* period.

12. **[WAEC-style · Apply]** The class's value is g = 9.79 m s⁻², and the okada's rear bounces with ω = 12.57 rad s⁻¹. What is the smallest bounce amplitude that makes the crates leave the carrier?
    - **A.** 0.78 m
    - **B.** 2.4 m
    - **C.** 16 m
    - **D.** 6.2 cm ✓
    - *Explanation:* Lift-off when ω²A ≥ g, so A = g/ω² = 9.79 ÷ (12.57)² = 9.79 ÷ 158 = 0.062 m = 6.2 cm. A divided by ω instead of ω². B divided by f² (2.0² = 4) instead of ω². C is ω²/g, the ratio upside down.

### Part 2 · Home Investigation & 30-Mark Written Paper (Lesson 05)

**Part A · Home Investigation:** *Measure g in your own house.*
You need: a stone or padlock, about 1.2 m of strong thread, a door frame or nail to hang it from, a tape measure, a phone stopwatch, and a sheet of graph paper.
1. Hang the stone so that the length from the support to the **middle** of the stone is 0.40 m. (Measure to the top of the stone, then add half its height.)
2. Put a mark under the rest position. Pull the stone aside by a small angle (no more than about 10 cm at this length) and release it so it swings in one plane.
3. Start timing as it passes the mark, counting "zero"; time 20 oscillations. Repeat and take the mean.
4. Repeat for lengths of 0.70 m and 1.00 m.
5. Find T and T² for each length. Plot T² (vertical) against l (horizontal), draw the best straight line through the origin, find its slope and calculate g = 4π²/slope.

Sample results table:

| l (m) | t₁ for 20 (s) | t₂ for 20 (s) | Mean t (s) | T (s) | T² (s²) |
|---|---|---|---|---|---|
| 0.40 | 25.5 | 25.2 | 25.4 | 1.27 | 1.61 |
| 0.70 | 33.4 | 33.7 | 33.6 | 1.68 | 2.82 |
| 1.00 | 40.0 | 40.3 | 40.2 | 2.01 | 4.04 |

Slope from two points read from the drawn line, e.g. (0.20, 0.81) and (1.00, 4.04): slope = 3.23 ÷ 0.80 = 4.04 s² m⁻¹, so g ≈ 39.48 ÷ 4.04 = 9.8 m s⁻².

*What a good answer shows:* a complete table with consistent decimal places; T² against l is close to a straight line through the origin; a slope found from a large triangle on the line, not from one table row; g within about ±0.3 m s⁻² of 9.8 m s⁻². A strong answer writes two or more precautions in the past tense (for example, "I measured the length to the middle of the stone", "I ensured the stone swung in one plane") and one source of error with its effect (for example, the stone is not a point mass and its middle was estimated, so each l may be out by a centimetre; the support moved slightly, adding to the effective length).

**Part B · Written Paper (30 marks, WAEC Paper 3 style)**

*The practical.* A candidate was given a retort stand with clamp and boss, a split cork, a light inextensible thread, a metal bob of diameter 3.0 cm, a metre rule and a stopwatch. She clamped the thread between the cork halves, set the length L of thread between the lower face of the cork and the top of the bob to 0.285 m, displaced the bob through a small angle and timed 20 complete oscillations twice. She repeated this for L = 0.435, 0.585, 0.735 and 0.885 m. Her readings were:

| L / m | 0.285 | 0.435 | 0.585 | 0.735 | 0.885 |
|---|---|---|---|---|---|
| t₁ / s | 21.96 | 26.90 | 31.14 | 34.82 | 38.06 |
| t₂ / s | 22.04 | 26.98 | 31.06 | 34.74 | 38.14 |

**b1 · Composite Table (4 marks)**
Copy the table and add rows for: the effective length l = L + r (3 d.p.); the mean time t̄ (2 d.p.); the period T = t̄/20 (3 d.p.); and T² (3 d.p.).
*Model solution:* r = 3.0 ÷ 2 = 1.5 cm = 0.015 m. l: 0.300, 0.450, 0.600, 0.750, 0.900 m **(1)** · t̄: 22.00, 26.94, 31.10, 34.78, 38.10 s **(1)** · T: 1.100, 1.347, 1.555, 1.739, 1.905 s **(1)** · T²: 1.210, 1.814, 2.418, 3.024, 3.629 s². **(1)**
*Mark scheme note:* One mark per correct row; all five values must be correct to the stated decimal places. Using L instead of l (no radius added), or adding the diameter, loses the l row; error carried forward is allowed in later parts. Inconsistent decimal places within a row lose that mark.

**b2 · The Graph (6 marks)**
Plot T² (vertical axis) against l (horizontal axis), starting both axes from zero. Draw the line of best fit.
*Model solution (what the examiner looks for):* both axes correctly labelled with quantity and unit, T²/s² vertical and l/m horizontal **(1)**; a sensible linear scale using at least half of the graph paper on each axis, for example 2 cm to 0.1 m and 2 cm to 0.5 s², not an awkward scale such as 3 cm to 0.1 **(1)**; all five points correctly plotted, within half a small square **(2: 1 mark for three or four correct)**; a single thin straight line of best fit passing through, or very close to, the origin with the points evenly spread about it **(1)**; a title or clear origin and an overall neat graph with fine points **(1)**.
*Mark scheme note:* Axes the wrong way round (l vertical) lose the axis mark and make the later slope the inverse; the examiner then allows only error carried forward. Joining the dots dot-to-dot, or a thick line, loses the line mark. A scale that cannot be read easily (multiples of 3 or 7) loses the scale mark.

**b3 · The Slope (4 marks)**
Determine the slope s of your graph, showing the triangle you used.
*Model solution:* A large right-angled triangle drawn on the line, using points read from the line (not from the table), for example (0.100 m, 0.403 s²) and (0.900 m, 3.628 s²) **(1)**; ΔT² = 3.628 − 0.403 = 3.225 s² **(1)**; Δl = 0.900 − 0.100 = 0.800 m **(1)**; s = 3.225 ÷ 0.800 = 4.03 s² m⁻¹ (accept 3.98–4.08). **(1)**
*Mark scheme note:* A triangle smaller than half the length of the line loses the first mark. Using two table points that are not on the drawn line loses the first mark. Δl/ΔT² (0.248) is the inverse slope and loses the last mark. The unit s² m⁻¹ is required for the last mark.

**b4 · The Value of g (3 marks)**
(a) Show that the slope of the graph is 4π²/g. (b) Use your slope to determine g.
*Model solution:* (a) T = 2π√(l/g), so T² = 4π²l/g = (4π²/g) l, which is y = mx with slope 4π²/g. **(1)** (b) g = 4π²/s **(1)** = 39.48 ÷ 4.03 = 9.79 m s⁻² (accept 9.68–9.92 m s⁻² on error carried forward). **(1)**
*Mark scheme note:* In (b) the unit m s⁻² is required. g = s/4π² or g = 4π² × s loses the last two marks.

**b5 · The Intercept (2 marks)**
(a) State where your line cuts the T² axis. (b) Explain what this shows about the way the lengths were measured.
*Model solution:* (a) At (or very near) the origin, T² ≈ 0 when l = 0. **(1)** (b) It shows that l was correctly measured to the centre of the bob (the radius was added), so no constant error was present in the lengths. **(1)**
*Mark scheme note:* In (b), "the graph is correct" earns nothing; the link between a zero intercept and correct effective lengths is needed.

**b6 · Precautions (3 marks)**
State **three** precautions that should have been taken to ensure accurate results.
*Model solution:* Any three (1 each), in the past tense: I ensured the bob swung through a small angle (about 10° or less) · I started and stopped the stopwatch as the bob passed its rest position · I measured the length to the centre of the bob · I ensured the bob swung in one vertical plane and not in a circle · I ensured the cork was firmly clamped so the point of suspension did not move · I repeated each timing and used the mean · I avoided parallax when reading the metre rule · I avoided draughts by closing the windows.
*Mark scheme note:* Precautions written as commands ("ensure the angle is small") or in the future tense score zero. "I repeated the experiment" without saying what was repeated, and "I was careful", are not credited. Sources of error ("reaction time") offered as precautions score zero.

**b7 · Errors and Their Effects (5 marks)**
(a) Why is the T² against l graph preferred to working out g from a single reading? (b) A second candidate measured every length to the top of the bob. State and explain the effect on (i) his graph and (ii) his value of g. (c) A third candidate started her stopwatch while counting "one". State and explain the effect on her value of g.
*Model solution:* (a) The graph averages many readings, so random errors partly cancel, and it exposes any constant error as an intercept instead of hiding it in the answer. **(1)** (b)(i) Every l is too small by r, so every point shifts left by 0.015 m and the line cuts the T² axis above the origin. **(1)** (ii) The slope is unchanged, so g from the slope is unaffected. **(1)** (c) Only 19 oscillations were really timed but the time was divided by 20 **(1)**, so T was too small and g = 4π²l/T² came out too large (by about 11 %). **(1)**
*Mark scheme note:* In (b)(ii) "g too small" scores zero, though it would be true for g calculated from a single reading. In (c) both the 19/20 reason and the direction "too large" are required for the two marks.

**b8 · The Ceiling Variant (3 marks)**
In another laboratory the support was out of reach, so a candidate measured the height y of the bob's centre above the floor. When y = 1.20 m, T² = 5.646 s²; when y = 1.80 m, T² = 3.226 s². (a) Calculate the slope of T² against y. (b) Hence find g. (c) Find the height H of the point of suspension above the floor.
*Model solution:* (a) slope = (3.226 − 5.646) ÷ (1.80 − 1.20) = −2.420 ÷ 0.60 = −4.03 s² m⁻¹. **(1)** (b) g = 4π²/|slope| = 39.48 ÷ 4.033 = 9.79 m s⁻². **(1)** (c) The line cuts the horizontal axis (T² = 0) at y = H: from y = 1.20 m, the extra height is 5.646 ÷ 4.033 = 1.40 m, so H = 1.20 + 1.40 = 2.60 m. **(1)**
*Mark scheme note:* A negative value of g loses (b). In (c) error carried forward is allowed from (a).

---

## Lesson 06 · Energy in SHM and Damping

### Part 1 · 12 Interactive MCQs (`window.LESSON_QUIZ`)

1. **[WAEC-style · Understand]** As a pendulum bob swings through its lowest point (the equilibrium position), its
   - **A.** potential energy is greatest and its kinetic energy is zero
   - **B.** kinetic energy is greatest and its potential energy is least ✓
   - **C.** kinetic and potential energies are equal
   - **D.** total energy is greatest
   - *Explanation:* At the lowest point the bob moves fastest (v_max = ωA), so its KE is greatest, and its height (PE) is least. A describes the ends of the swing. C happens at x = ±A/√2, part of the way out. D is false: with no losses, the total energy is the same at every point; only its form changes.

2. **[WAEC-style · Apply]** A load on a spring of spring constant 80 N m⁻¹ oscillates with an amplitude of 5.0 cm. What is the total energy of the oscillation?
   - **A.** 0.10 J ✓
   - **B.** 0.20 J
   - **C.** 2.0 J
   - **D.** 1000 J
   - *Explanation:* E = ½kA² = ½ × 80 × (0.050)² = 40 × 0.0025 = 0.10 J. B left out the ½. C used ½kA without squaring the amplitude (40 × 0.050). D kept the amplitude in centimetres (40 × 25).

3. **[NECO-style · Apply]** A 0.40 kg mass on a spring with k = 40 N m⁻¹ oscillates with amplitude 0.10 m. What is its kinetic energy when it is 0.050 m from equilibrium?
   - **A.** 0.050 J
   - **B.** 0.20 J
   - **C.** 0.15 J ✓
   - **D.** 0.10 J
   - *Explanation:* E = ½kA² = ½ × 40 × 0.010 = 0.20 J; PE = ½kx² = ½ × 40 × 0.0025 = 0.050 J; KE = E − PE = 0.20 − 0.050 = 0.15 J. A is the PE, not the KE. B is the total energy. D assumes the energy is shared equally halfway out, but PE grows with x², so at half the amplitude the PE is only a quarter of the total.

4. **[JAMB-style · Analyse]** A body oscillates in SHM with amplitude 8.0 cm. At what distance from equilibrium are its kinetic and potential energies equal?
   - **A.** 4.0 cm
   - **B.** 2.8 cm
   - **C.** 6.9 cm
   - **D.** 5.7 cm ✓
   - *Explanation:* KE = PE when each is half the total: ½kx² = ½ × ½kA², so x² = A²/2 and x = A/√2 = 8.0 ÷ 1.414 = 5.7 cm (about 71 % of the way out). A is the "halfway" guess, which forgets that PE depends on x². B divided by 2√2. C is A√3/2, which is where PE is three-quarters of the total.

5. **[WAEC-style · Apply]** Air resistance reduces the amplitude of Zainab's pendulum from 6.0 cm to 3.0 cm. What percentage of the original oscillation energy remains?
   - **A.** 25 % ✓
   - **B.** 50 %
   - **C.** 75 %
   - **D.** 12.5 %
   - *Explanation:* E ∝ A², so E₂/E₁ = (3.0 ÷ 6.0)² = (½)² = ¼ = 25 %. B assumes E ∝ A. C is the percentage *lost*, not the percentage remaining. D cubes the ratio.

6. **[NECO-style · Understand]** Which statement about a **lightly damped** oscillation is correct?
   - **A.** It stops after one swing without crossing the equilibrium position
   - **B.** Its period becomes much longer with each cycle
   - **C.** Its amplitude stays the same while its period shortens
   - **D.** Its amplitude decreases gradually while its period stays almost the same ✓
   - *Explanation:* Light damping takes a little energy away each cycle, so the oscillations go on for many cycles with shrinking amplitude, but the time for each cycle hardly changes. A describes heavy or critical damping, where there is no oscillation. B is the misconception that a dying swing ticks slower. C reverses the effect; damping attacks the amplitude, not the period.

7. **[WAEC-style · Understand]** A good shock absorber on a vehicle is designed to be close to **critically damped**. This means that after a bump the suspension
   - **A.** keeps oscillating with constant amplitude
   - **B.** returns to its equilibrium position in the shortest time without oscillating ✓
   - **C.** creeps back very slowly to equilibrium over many seconds
   - **D.** oscillates several times with gradually decreasing amplitude
   - *Explanation:* Critical damping is the amount that brings a displaced system back to rest at equilibrium as quickly as possible with no overshoot. A is undamped (free) oscillation. C is heavy (over-) damping, which is too sluggish for a vehicle. D is light damping, which is what a worn or leaking shock absorber gives.

8. **[NECO-style · Apply]** A pendulum bob is released from rest 3.2 cm above its lowest point. Ignoring air resistance, what is its speed at the lowest point? (Take g = 10 m s⁻².)
   - **A.** 0.64 m s⁻¹
   - **B.** 0.57 m s⁻¹
   - **C.** 0.80 m s⁻¹ ✓
   - **D.** 8.0 m s⁻¹
   - *Explanation:* All the PE becomes KE: mgh = ½mv², so v = √(2gh) = √(2 × 10 × 0.032) = √0.64 = 0.80 m s⁻¹. A is 2gh, with the square root forgotten. B is √(gh), with the 2 lost. D kept h in centimetres (√(2 × 10 × 3.2)).

9. **[WAEC-style · Analyse]** On one set of axes, graphs of energy against displacement x are drawn for an undamped oscillator of amplitude A. Which description is correct?
   - **A.** KE and PE are both straight lines crossing at x = A/2
   - **B.** PE is an inverted parabola, greatest at x = 0; KE is an upright parabola
   - **C.** PE is an upright parabola, zero at x = 0; KE is an inverted parabola, zero at x = ±A; the total is a horizontal line ✓
   - **D.** The total energy is a parabola that is greatest at the ends
   - *Explanation:* PE = ½kx² is a parabola opening upwards from zero at the centre; KE = ½k(A² − x²) is an inverted parabola that falls to zero at the ends; their sum ½kA² is constant, a horizontal line. A treats energy as linear in x and puts the crossing at the wrong place. B swaps KE and PE. D forgets that, without damping, the total energy does not change.

10. **[JAMB-style · Apply]** A 2.0 kg mass on a spring of spring constant 200 N m⁻¹ oscillates with amplitude 5.0 cm. What is its maximum speed?
    - **A.** 0.25 m s⁻¹
    - **B.** 0.50 m s⁻¹ ✓
    - **C.** 0.35 m s⁻¹
    - **D.** 0.71 m s⁻¹
    - *Explanation:* E = ½kA² = ½ × 200 × 0.0025 = 0.25 J, all of which is KE at the centre: ½mv² = 0.25, v = √(2 × 0.25 ÷ 2.0) = √0.25 = 0.50 m s⁻¹. (Check: ω = √(k/m) = 10 rad s⁻¹, ωA = 0.50 m s⁻¹.) A forgot the square root. C used v = √(E/m), losing the 2. D used E = kA² without the ½.

11. **[WAEC-style · Analyse]** Mallam Sule says the okada's leaking shock absorber is why the bounce "builds up instead of dying". Which explanation is correct?
    - **A.** The leaking absorber makes the spring stiffer, so the bounce frequency rises
    - **B.** Oil leaking out adds mass, so the bounce becomes bigger
    - **C.** A leaking absorber removes more energy each cycle than a healthy one
    - **D.** With little oil, the piston slides almost freely, so hardly any energy is turned into heat each cycle; energy fed in by the road can pile up ✓
    - *Explanation:* A healthy damper forces oil through small holes in the piston, turning bounce energy into heat in every stroke. With the oil gone, very little energy is removed (light damping), so pushes from the road that arrive in step can keep adding energy and the amplitude grows. A is wrong: the damper does not change the spring's stiffness or noticeably change the frequency. B is wrong: losing oil cannot add mass. C reverses the effect.

12. **[NECO-style · Apply]** With two extra crates, the okada's crates lift off once the bounce amplitude reaches 7.8 cm. How much energy is stored in the oscillation at that amplitude? (k = 3.16 × 10⁴ N m⁻¹.)
    - **A.** 96 J ✓
    - **B.** 192 J
    - **C.** 1232 J
    - **D.** 9.6 × 10⁵ J
    - *Explanation:* E = ½kA² = ½ × 31 600 × (0.078)² = 15 800 × 0.006 08 = 96 J. B left out the ½. C used ½kA without squaring A (15 800 × 0.078). D kept A in centimetres (15 800 × 7.8²).

### Part 2 · Home Investigation & 30-Mark Written Paper (Lesson 06)

**Part A · Home Investigation:** *Bounce test: whose shock absorbers are tired?*
You need: two parked vehicles (cars, a keke or motorcycles) **with the owners' permission**, a friend to watch, and a notebook. Make sure each vehicle is switched off, in gear or on its stand, and that nobody is in it or behind it.
1. Press down firmly on one corner (or the back of the seat of a motorcycle) and let go quickly.
2. Your friend counts how many times that corner rises and falls before it settles, and estimates how high the first rebound is.
3. Repeat three times for the same corner, then do the same on the second vehicle.
4. Ask each owner how old the shock absorbers are, if they know.

Sample results table:

| Vehicle | Bounces before settling (three trials) | Mean | Feel of first rebound |
|---|---|---|---|
| Neighbour's car (absorbers replaced last year) | 1, 1, 2 | 1.3 | Firm, comes straight back |
| Uncle's old car | 4, 3, 4 | 3.7 | Bouncy, overshoots several times |

*What a good answer shows:* a vehicle with healthy shock absorbers settles after about one rebound (close to critical damping); one with worn absorbers bounces several times with slowly shrinking amplitude (light damping), so less energy is being turned into heat each cycle. A strong answer links this to Mallam Sule's leaking shock absorber and explains that a lightly damped suspension lets energy from a bumpy road build up; it also gives a limitation, for example: the push was not the same size each time, or the counting depended on judging very small movements.

**Part B · Written Paper (30 marks)**

**b1 · Definitions (3 marks)**
Define: (a) *damping*; (b) *critical damping*; (c) a *free* oscillation.
*Model solution:* (a) Damping is the gradual loss of energy from an oscillating system, caused by resistive forces such as friction or air or liquid resistance, so that the amplitude decreases. **(1)** (b) Critical damping is the amount of damping that returns a displaced system to its equilibrium position in the shortest possible time without oscillating. **(1)** (c) A free oscillation is one in which the system vibrates at its own natural frequency with no outside periodic force and no loss of energy, so its amplitude stays constant. **(1)**
*Mark scheme note:* In (a) both "energy loss" (or a resistive force) and "amplitude decreases" are expected. In (b) "without oscillating" and "shortest time" are both needed. In (c) "natural frequency" or "constant amplitude" must appear.

**b2 · Energy Round a Swing (3 marks)**
A pendulum bob swings from end-point A through its lowest point O to the other end B. Describe the energy at A, at O, and halfway in energy between them, assuming no losses.
*Model solution:* At A (and B) the bob is momentarily at rest: all its energy is potential, PE is greatest and KE is zero. **(1)** At O it moves fastest: all its energy is kinetic, KE is greatest and PE is least (zero, taking O as the reference level). **(1)** In between, the energy is shared, with KE + PE always equal to the same total; they are equal at x = A/√2. **(1)**
*Mark scheme note:* "Total energy is constant" must appear in some form for the third mark.

**b3 · Deriving the Energy Expressions (4 marks)**
For a mass m on a spring of constant k oscillating with amplitude A: (a) using v = ω√(A² − x²) and ω² = k/m, show that KE = ½k(A² − x²); (b) show that KE + PE = ½kA², a constant; (c) show that KE = PE where x = A/√2.
*Model solution:* (a) KE = ½mv² = ½mω²(A² − x²) **(1)**; since mω² = k, KE = ½k(A² − x²). **(1)** (b) PE = ½kx², so KE + PE = ½kA² − ½kx² + ½kx² = ½kA², which does not depend on x. **(1)** (c) KE = PE gives ½k(A² − x²) = ½kx², so A² = 2x² and x = A/√2. **(1)**
*Mark scheme note:* The substitution mω² = k must be shown in (a). In (c) "x = A/2" scores zero.

**b4 · Energy at a Point (5 marks)**
A 0.80 kg mass on a spring of spring constant 20 N m⁻¹ oscillates with amplitude 0.15 m. Calculate: (a) the angular frequency; (b) the total energy; (c) the maximum speed; (d) the potential and kinetic energies at x = 0.090 m; (e) the speed at x = 0.090 m.
*Model solution:* (a) ω = √(k/m) = √(20 ÷ 0.80) = √25 = 5.0 rad s⁻¹. **(1)** (b) E = ½kA² = ½ × 20 × 0.0225 = 0.225 J. **(1)** (c) v_max = ωA = 5.0 × 0.15 = 0.75 m s⁻¹ (check: √(2 × 0.225 ÷ 0.80) = 0.75). **(1)** (d) PE = ½ × 20 × 0.0081 = 0.081 J; KE = 0.225 − 0.081 = 0.144 J. **(1)** (e) v = √(2 × 0.144 ÷ 0.80) = √0.36 = 0.60 m s⁻¹. **(1)**
*Mark scheme note:* Error carried forward allowed throughout. Both energies are needed for (d). Units required.

**b5 · A Swinging Bob (4 marks)**
A 0.20 kg bob is pulled aside until it is 4.0 cm above its lowest point, then released. (Take g = 10 m s⁻².) (a) Calculate its total energy. (b) Calculate its greatest speed. (c) Air resistance removes 20 % of its energy by the time it reaches the other side. How high does it rise there? (d) Where did the lost energy go?
*Model solution:* (a) E = mgh = 0.20 × 10 × 0.040 = 0.080 J. **(1)** (b) v = √(2gh) = √(2 × 10 × 0.040) = √0.80 = 0.89 m s⁻¹. **(1)** (c) Energy left = 0.80 × 0.080 = 0.064 J; h = E/mg = 0.064 ÷ 2.0 = 0.032 m = 3.2 cm. **(1)** (d) It was transferred to the surrounding air as heat (internal energy) and a little sound, by the work done against air resistance. **(1)**
*Mark scheme note:* In (c) giving 0.8 cm (the 20 % lost, not the height reached) or 4.8 cm loses the mark. In (d) "it was destroyed" scores zero.

**b6 · Practical: Damping in Water (6 marks)**
A 0.30 kg load on a spring (k = 23.5 N m⁻¹) carried a card vane dipping into a beaker of water. Zainab recorded the amplitude at the end of each cycle:

| Cycle | 0 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|
| Amplitude / cm | 6.00 | 4.50 | 3.38 | 2.53 | 1.90 | 1.42 |

Ten oscillations took 7.10 s with the vane in air and 7.14 s in water.
(a) Show that the amplitude falls by the same ratio each cycle, and find the ratio. (b) What fraction of the energy remains after each cycle? (c) Calculate the energy at cycle 0 and at cycle 5. (d) What do the two timings show about the effect of light damping on the period? (e) Describe the shape of a graph of amplitude against cycle number.
*Model solution:* (a) 4.50 ÷ 6.00 = 0.75, 3.38 ÷ 4.50 = 0.75, 2.53 ÷ 3.38 = 0.75 (and so on): a constant ratio of 0.75. **(1)** (b) E ∝ A², so 0.75² = 0.56 (56 %) remains each cycle, and about 44 % is lost. **(1)** (c) E₀ = ½ × 23.5 × (0.0600)² = 0.042 J **(1)**; E₅ = ½ × 23.5 × (0.0142)² = 0.0024 J. **(1)** (d) The periods are 0.710 s and 0.714 s: almost the same, so light damping hardly changes the period. **(1)** (e) A curve that falls steeply at first and then more gently, approaching zero but never quite reaching it (an exponential-type decay), not a straight line. **(1)**
*Mark scheme note:* In (a) at least three ratios must be shown. In (b) giving 0.75 (forgetting E ∝ A²) scores zero. In (c) amplitudes in centimetres lose the mark. In (e) "a straight line downwards" is not accepted.

**b7 · The Shock Absorber (3 marks)**
(a) Explain how an oil-filled shock absorber removes energy from a vehicle's bounce. (b) Why are shock absorbers designed to be close to critical damping rather than heavily damped? (c) Give one other device designed to be critically damped.
*Model solution:* (a) As the suspension moves, a piston is forced through oil; the oil is pushed through small holes, and the work done against this resistance turns the bounce energy into heat in the oil. **(1)** (b) Heavy damping would make the suspension return too slowly after each bump, so it would not be ready for the next one and the ride would be harsh; critical damping returns it quickly without bouncing. **(1)** (c) The pointer of a moving-coil meter (also accept a door closer). **(1)**
*Mark scheme note:* In (a) the conversion to heat must be stated. In (c) any correct example is accepted.

**b8 · The Bridge: Mallam Sule's Verdict (2 marks)**
For the okada's rear spring (k = 3.16 × 10⁴ N m⁻¹), (a) calculate the energy in a 2.0 cm bounce and in a 6.2 cm bounce, and (b) explain why a working shock absorber stops the bounce reaching 6.2 cm.
*Model solution:* (a) E₁ = ½ × 31 600 × 0.020² = 6.3 J; E₂ = ½ × 31 600 × 0.062² = 61 J (nearly ten times as much). **(1)** (b) The working damper turns a large share of each cycle's energy into heat in its oil, so the road can never pile up the 61 J needed; the leaking one removes very little, so energy can build up when the pushes arrive in step. **(1)**
*Mark scheme note:* Both energies are needed for (a). In (b) the energy-removal (heat) idea is essential.

---

## Lesson 07 · Forced Vibration and Resonance — Solving the Ridge Road Case

### Part 1 · 12 Interactive MCQs (`window.LESSON_QUIZ`)

1. **[WAEC-style · Remember]** Resonance occurs when
   - **A.** a system vibrates with a very high frequency
   - **B.** the damping on a system is made as large as possible
   - **C.** a system is left to vibrate freely after one push
   - **D.** the frequency of a periodic driving force matches the system's own natural frequency, so its amplitude becomes greatest ✓
   - *Explanation:* At resonance each push arrives in step with the motion, energy builds up, and the amplitude reaches its largest value. A is the myth that resonance means "fast"; the okada resonates at only 2 Hz. B does the opposite: damping *reduces* the resonant amplitude. C describes free vibration, with no driving force at all.

2. **[NECO-style · Understand]** A periodic force with a frequency of 5 Hz drives a system whose natural frequency is 2 Hz. Once the motion has settled, the system vibrates at
   - **A.** 2 Hz, its natural frequency
   - **B.** 3 Hz, the difference between the two
   - **C.** 5 Hz, the driving frequency ✓
   - **D.** 7 Hz, the sum of the two
   - *Explanation:* In a forced vibration the system is made to vibrate at the frequency of the driving force; its natural frequency only decides how *large* the response is (here small, being far from resonance). A describes free vibration. B and D are invented combinations with no physical basis.

3. **[WAEC-style · Apply]** Speed bumps on a school road are 2.0 m apart, and a keke's suspension has a natural frequency of 1.6 Hz. At what speed would the keke resonate?
   - **A.** 3.2 km/h
   - **B.** 11.5 km/h ✓
   - **C.** 2.9 km/h
   - **D.** 4.5 km/h
   - *Explanation:* Resonance when the bump rate equals f₀: v/d = f₀, so v = d f₀ = 2.0 × 1.6 = 3.2 m s⁻¹, and in km/h, 3.2 × 3.6 = 11.5 km/h. A gives the m s⁻¹ value with the wrong unit. C used f₀ ÷ d (1.6 ÷ 2.0 = 0.80 m s⁻¹, then × 3.6). D used d ÷ f₀ (1.25 m s⁻¹, then × 3.6).

4. **[WAEC-style · Apply]** Dayo crosses the ridges, 2.5 m apart, at 27 km/h. The loaded okada's natural frequency is 2.0 Hz. Which statement is correct?
   - **A.** The ridges push the rear at 3.0 Hz, well above 2.0 Hz, so there is no resonance ✓
   - **B.** The ridges push the rear at 10.8 Hz, so the bounce is very fast and violent
   - **C.** The ridges push the rear at 0.33 Hz, well below 2.0 Hz
   - **D.** The ridges push the rear at 2.0 Hz, so there is resonance
   - *Explanation:* v = 27 ÷ 3.6 = 7.5 m s⁻¹, so f = v/d = 7.5 ÷ 2.5 = 3.0 Hz. That is far from f₀ = 2.0 Hz, so the response is small, as on Dayo's fast trips. B forgot to change km/h to m s⁻¹ (27 ÷ 2.5). C used d/v, the time between ridges, as if it were a frequency. D assumes any speed gives resonance; only about 18 km/h does.

5. **[NECO-style · Understand]** In a Barton's pendulums demonstration, a heavy driver pendulum swings on a taut cord from which light paper-cone pendulums of different lengths hang. After a while, which cone swings with the largest amplitude?
   - **A.** The shortest one, because it has the highest natural frequency
   - **B.** The one with the same length as the driver, because its natural frequency equals the driving frequency ✓
   - **C.** The longest one, because it has the most room to swing
   - **D.** They all swing with the same amplitude, because the same cord drives them all
   - *Explanation:* All the cones are forced at the driver's frequency, but only the cone whose natural frequency matches it (the same length, since T = 2π√(l/g)) resonates and swings widely. A and C confuse a high or low natural frequency with a matched one. D ignores resonance: the cones respond very differently even though the driving is the same.

6. **[WAEC-style · Analyse]** Mallam Sule fits a healthy shock absorber in place of the leaking one. How does this change the okada's amplitude–frequency (resonance) curve?
   - **A.** The peak becomes lower and broader, at about the same frequency ✓
   - **B.** The peak becomes higher and sharper
   - **C.** The peak moves to a much higher frequency
   - **D.** The curve is unchanged, because damping does not affect forced vibration
   - *Explanation:* More damping removes more energy each cycle, so the resonant amplitude is much smaller (for the model, about 2.0 cm instead of 10 cm) and the peak is spread over a wider range of speeds; the peak frequency stays close to f₀. B describes *less* damping. C confuses damping with stiffness or mass, which are what set f₀. D is false: damping matters most at resonance.

7. **[JAMB-style · Analyse]** With two extra crates, the okada's sprung load rises from 200 kg to 250 kg on the same spring. What happens to its natural frequency and to the dangerous speed over the ridges?
   - **A.** Both increase
   - **B.** The natural frequency increases; the dangerous speed decreases
   - **C.** Both stay the same, because the spring is unchanged
   - **D.** Both decrease: f₀ falls from 2.0 Hz to 1.79 Hz, and the dangerous speed from 18 km/h to about 16 km/h ✓
   - *Explanation:* f₀ = (1/2π)√(k/m), so more mass lowers f₀: (1/2π)√(31 600 ÷ 250) = 1.79 Hz. The dangerous speed is v = d f₀ = 2.5 × 1.79 = 4.47 m s⁻¹ ≈ 16 km/h, also lower. A reverses the mass effect. B splits them, but v = d f₀ means they must change together. C forgets that f₀ depends on m as well as k.

8. **[WAEC-style · Understand]** Which of these is a **useful** application of resonance?
   - **A.** A footbridge swaying when a crowd marches across in step
   - **B.** A washing machine shaking violently at one spin speed
   - **C.** Tuning a radio receiver to pick out one station ✓
   - **D.** Window louvres rattling when a heavy generator runs
   - *Explanation:* A radio's tuning circuit is adjusted until its natural frequency matches the frequency of the wanted station's signal, which then produces a large response while other stations do not. A, B and D are all harmful resonances, where a periodic driving force matches a natural frequency of a structure or machine.

9. **[NECO-style · Understand]** Soldiers marching across a narrow bridge are often ordered to break step. Why?
   - **A.** To reduce the total weight on the bridge
   - **B.** To make the bridge's natural frequency higher
   - **C.** To make their footsteps quieter
   - **D.** So that their footsteps do not provide a periodic force that could match a natural frequency of the bridge and cause resonance ✓
   - *Explanation:* Marching in step applies a regular push at one frequency; if it matches one of the bridge's natural frequencies, the amplitude can build up dangerously. Breaking step spreads the pushes out in time so they do not add up. A is wrong because the soldiers weigh the same in or out of step. B is wrong because the bridge's natural frequency is fixed by its own mass and stiffness. C is not the safety reason.

10. **[WAEC-style · Apply]** The driver pendulum of a Barton's set is 0.40 m long. What is its frequency? (Take g = 9.8 m s⁻².)
    - **A.** 1.27 Hz
    - **B.** 4.95 Hz
    - **C.** 0.79 Hz ✓
    - **D.** 0.032 Hz
    - *Explanation:* T = 2π√(l/g) = 2π√(0.40 ÷ 9.8) = 2π × 0.202 = 1.27 s, so f = 1/T = 1 ÷ 1.27 = 0.79 Hz. A is the period, not the frequency. B is ω = √(g/l) = 4.95 rad s⁻¹, which is not in hertz. D is (1/2π)√(l/g), the ratio inside the root turned over.

11. **[WAEC-style · Analyse]** Tunde said "faster is always worse", yet at 30 km/h the crates arrive whole. Which explanation is correct?
    - **A.** At 30 km/h the ridges push the rear at about 3.3 Hz, far from its natural frequency of 2.0 Hz, so the amplitude stays small (about 0.6 cm), far too small to lift the crates (the threshold at 3.3 Hz is about 2.2 cm) ✓
    - **B.** At 30 km/h the okada moves too fast for the ridges to push it at all
    - **C.** At 30 km/h the natural frequency of the okada rises to match the ridges
    - **D.** At 30 km/h the shock absorber works better because the oil is hotter
    - *Explanation:* f = v/d = 8.33 ÷ 2.5 = 3.33 Hz, well above f₀, so the pushes do not arrive in step with the bounce and the response is small: 0.6 cm against a lift-off threshold of g/ω² ≈ 2.2 cm at that frequency. B is false: the ridges still push, just at a frequency that does not match. C is false: f₀ depends on m and k, not on road speed. D invents an effect; the absorber is leaking anyway.

12. **[WAEC-style · Evaluate]** Which single change would stop the crates lifting off at **every** speed across the ridges?
    - **A.** Loading two more crates, which makes the okada heavier and steadier
    - **B.** Replacing the leaking rear shock absorber, so that the resonant amplitude stays near 2 cm, far below the lift-off threshold ✓
    - **C.** Always riding at exactly 16 km/h
    - **D.** Fitting a new rear spring of exactly the same stiffness
    - *Explanation:* With a healthy shock absorber (ζ ≈ 0.30 in the model) the bounce never grows beyond about 2.0 cm at any speed, so ω²A never reaches g. A only moves the danger from 18 km/h to about 16 km/h (and raises the threshold to 7.8 cm), but lift-off still happens there. C is safe only with the usual load; with two extra crates 16 km/h is the *new* dangerous speed. D changes nothing, because an identical spring gives the same f₀ and the same resonance, and the damper is still leaking.

### Part 2 · Home Investigation & 30-Mark Written Paper (Lesson 07)

**Part A · Home Investigation:** *The swing that grows.*
You need: a playground or compound swing, a friend to sit on it (a younger child only with an adult present), and a phone stopwatch. Keep the swing low and gentle; stop at once if anyone is uneasy.
1. Pull the swing back a little and let it go; time 10 oscillations to find its natural period.
2. Give a gentle push **once per swing**, each time the swing reaches you and starts to move away. Count 10 pushes and note how high the swing goes.
3. Let it settle. Now push **twice as often** (each time it passes you, coming or going), for 10 pushes.
4. Let it settle. Now push at a random rhythm for 10 pushes.
5. Describe the amplitude after each set of pushes.

Sample results table:

| Pushing pattern | Frequency of pushes | Amplitude after 10 pushes |
|---|---|---|
| Once per swing, in step | Equal to the natural frequency (about 0.4 Hz) | Large and still growing |
| Twice as often | Double the natural frequency | Small; some pushes slowed the swing down |
| Random rhythm | Irregular | Small and uneven |

*What a good answer shows:* the natural period (for example 2.5 s, f₀ ≈ 0.4 Hz); the in-step pushes build the biggest swing because each push adds energy at the right moment (resonance, driving frequency = natural frequency); pushes at other rhythms sometimes act against the motion and take energy out. A strong answer links this to the ridges pushing Dayo's okada once per bounce at 18 km/h, notes that friction and air resistance (damping) stopped the swing growing for ever, and gives a safety point about keeping the amplitude small.

**Part B · Written Paper (30 marks)**

**b1 · Kinds of Vibration (3 marks)**
Define: (a) *free* vibration; (b) *damped* vibration; (c) *forced* vibration.
*Model solution:* (a) Vibration of a system at its own natural frequency, with no outside periodic force acting, after it is displaced and released (ideally with constant amplitude). **(1)** (b) Vibration whose amplitude decreases with time because energy is removed by resistive forces. **(1)** (c) Vibration of a system caused by an outside periodic force; the system vibrates at the frequency of that driving force. **(1)**
*Mark scheme note:* In (c) "at the driving frequency" is needed; "a vibration that is forced" scores zero.

**b2 · Resonance (3 marks)**
(a) Define resonance. (b) Give one example where resonance is useful and one where it is harmful.
*Model solution:* (a) Resonance occurs when a system is driven by a periodic force whose frequency equals its natural frequency, so that it vibrates with the greatest amplitude. **(1)** (b) Useful (any one): tuning a radio · the hollow body of a guitar or talking drum amplifying the sound · pushing a swing in time **(1)**. Harmful (any one): a bridge set swaying by marching feet or wind · a vehicle shaking violently at one speed (Dayo's okada) · machinery vibrating dangerously on its mounting **(1)**.
*Mark scheme note:* In (a) both "frequency equals natural frequency" and "greatest amplitude" are needed. "A big vibration" alone scores zero.

**b3 · Barton's Pendulums (4 marks)**
(a) Describe how Barton's pendulums are set up. (b) Describe what is seen when the driver is set swinging. (c) Explain the observation. (d) State the effect of putting a small weight inside each paper cone.
*Model solution:* (a) A heavy driver pendulum and several light paper-cone pendulums of different lengths hang from the same taut cord; one cone has the same length as the driver. **(1)** (b) All the cones begin to swing, but the one equal in length to the driver swings with by far the largest amplitude. **(1)** (c) The driver forces every cone at its own frequency through the cord; only the equal-length cone has a natural frequency equal to the driving frequency, so it resonates. **(1)** (d) Heavier cones are less affected by air resistance (relatively less damped), so the resonance becomes sharper: the matching cone swings even more widely compared with the others. **(1)**
*Mark scheme note:* In (c) the frequency-match idea is essential; "it is the same length" without linking length to natural frequency earns no mark.

**b4 · The Dangerous Speed (4 marks)**
A vehicle moves at speed v over ridges spaced d apart. (a) Show that it meets the ridges at a frequency f = v/d. (b) Hence write the speed at which it resonates. (c) Calculate this speed for Dayo's okada (d = 2.5 m, f₀ = 2.0 Hz) in m s⁻¹ and km/h.
*Model solution:* (a) The time between ridges is the distance between them divided by the speed, d/v; the number met per second is the reciprocal, f = v/d. **(1)** (b) Resonance when f = f₀, so v = d f₀. **(1)** (c) v = 2.5 × 2.0 = 5.0 m s⁻¹ **(1)**; 5.0 × 3.6 = 18 km/h. **(1)**
*Mark scheme note:* In (c) the conversion factor 3.6 must be applied correctly; 5.0 km/h loses the last mark.

**b5 · The Loaded Keke (5 marks)**
A keke's rear suspension carries a sprung load of 400 kg on springs of combined spring constant 5.0 × 10⁴ N m⁻¹. Speed bumps on its route are 3.0 m apart. (a) Calculate the natural frequency of the suspension. (b) Calculate the speed, in km/h, at which it resonates on the bumps. (c) Three passengers add 100 kg. Find the new natural frequency and the new resonant speed in km/h. (d) Explain why the driver should not simply assume the speed that was dangerous when empty is still the one to avoid.
*Model solution:* (a) ω = √(k/m) = √(50 000 ÷ 400) = √125 = 11.2 rad s⁻¹; f₀ = ω/2π = 11.18 ÷ 6.283 = 1.78 Hz. **(1)** (b) v = d f₀ = 3.0 × 1.78 = 5.34 m s⁻¹ = 5.34 × 3.6 = 19.2 km/h. **(1)** (c) f₀ = (1/2π)√(50 000 ÷ 500) = 10 ÷ 6.283 = 1.59 Hz **(1)**; v = 3.0 × 1.59 = 4.77 m s⁻¹ = 17.2 km/h. **(1)** (d) Extra load lowers the natural frequency, so the resonant speed moves lower; a speed chosen to avoid resonance when empty may now be close to the new dangerous speed. **(1)**
*Mark scheme note:* Error carried forward allowed. Forgetting to change m s⁻¹ to km/h loses one mark only once. In (d) the link "more mass → lower f₀ → lower dangerous speed" is required.

**b6 · Practical: Sweeping the Speed (6 marks)**
On the ridge rig (load 200 kg, leaking damper, ridges 2.5 m apart) Zainab recorded:

| v / km h⁻¹ | 10 | 14 | 16 | 18 | 20 | 30 |
|---|---|---|---|---|---|---|
| A / cm | 1.4 | 2.5 | 4.4 | 10.0 | 3.9 | 0.6 |

(a) Calculate the forcing frequency f for each speed (2 d.p.). (b) Describe the shape of a graph of A against f and state the frequency at the peak. (c) Compare the peak frequency with the okada's natural frequency and name the effect. (d) The crates lift off when A ≥ 6.2 cm. At which recorded speed(s) did lift-off happen? (e) With a healthy damper the largest amplitude was about 2.0 cm. State the effect of the healthy damper on the curve. (f) Why is 30 km/h safe?
*Model solution:* (a) v in m s⁻¹ is 2.78, 3.89, 4.44, 5.00, 5.56, 8.33; f = v/2.5 = 1.11, 1.56, 1.78, 2.00, 2.22, 3.33 Hz. **(1)** (b) A rises slowly, then steeply to a sharp peak, and falls away again: the peak is at f = 2.00 Hz. **(1)** (c) The peak frequency equals the natural frequency f₀ = 2.0 Hz: resonance. **(1)** (d) Only at 18 km/h (10.0 cm > 6.2 cm). **(1)** (e) The peak is much lower (about 2.0 cm, never reaching 6.2 cm) and broader, at about the same frequency. **(1)** (f) At 30 km/h the forcing frequency (3.33 Hz) is far from f₀, so the amplitude is only 0.6 cm. **(1)**
*Mark scheme note:* All six frequencies are needed in (a). In (c) the word *resonance* is required. In (e) both "lower" and "broader" (or "never reaches 6.2 cm") are needed.

**b7 · Synoptic: The Whole Case (3 marks)**
Zainab timed 20 bounces of the parked, loaded okada in 10.0 s; the sprung load is 200 kg. (Take g = 9.8 m s⁻².) (a) Find the period and hence the spring constant. (b) Find the static sag. (c) Explain, using the lift-off rule, why the sag tells you the amplitude at which crates begin to leave the carrier.
*Model solution:* (a) T = 10.0 ÷ 20 = 0.50 s; k = 4π²m/T² = 39.48 × 200 ÷ 0.25 = 3.16 × 10⁴ N m⁻¹. **(1)** (b) sag = mg/k = 200 × 9.8 ÷ 31 600 = 0.062 m = 6.2 cm. **(1)** (c) Lift-off needs ω²A ≥ g, so A ≥ g/ω² = g × m/k = mg/k: exactly the static sag, 6.2 cm. **(1)**
*Mark scheme note:* In (a) accept 3.2 × 10⁴ N m⁻¹. In (c) the step ω² = k/m must be used; the numerical coincidence alone is not credited.

**b8 · Advice to Dayo (2 marks)**
Using your answers, give Dayo and Hajia Ramatu two pieces of advice, each with a physics reason.
*Model solution:* (1) Replace the leaking rear shock absorber: a healthy damper turns bounce energy into heat and keeps the resonant amplitude near 2 cm, well below the 6.2 cm lift-off threshold. **(1)** (2) Until it is replaced, cross the ridge stretch slowly (about 10 km/h or below), well away from the resonant speeds of 18 km/h (usual load) and 16 km/h (extra crates), so the ridges do not push in step with the bounce. **(1)**
*Mark scheme note:* Advice without a reason scores zero. "Ride faster" alone is not credited: it means passing through the resonant speeds on the way and gives no margin.

---
