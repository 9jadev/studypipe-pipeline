# Direction Script: Lesson 04 · One Coil, Two Meters

## Overview
The video resolves Chinedu's near-mistake at the starter test: Nkechi's 15 mA, 18 Ω moving-coil galvanometer would burn out on the 3.0 A line or the 40 V bank, so she turns it into a 3.0 A ammeter with a 0.0905 Ω shunt in parallel and a 40 V voltmeter with a 2 649 Ω (≈ 2 650 Ω) multiplier in series. It shows what is inside the meter, derives both formulae from the parallel and series rules, works both conversions on the same coil, tests the finished meters on Emeka's battery to show why an ammeter must be low-resistance and a voltmeter high-resistance, and lists the mark-losing mistakes. It opens the **Make Sense** phase, after the galvanometer bench. Practice quizzes stay in Apply.

| Item | Decision |
| --- | --- |
| Running time | About 9–10 minutes, 10 chapters, 56 narration lines (inside the 14 minute limit) |
| Narrator | One teacher voice, Nigerian English |
| Level | SS2 Physics, WAEC / NECO / JAMB |
| Theme | Unit theme (`meta.theme` unset) |
| Kits used | **`galvanometer`** (built on the fly from `06-videos/kit-requests/galvanometer.md`; `kits/video/galvanometer/`) — scenes `dial`, `convert`, `test`. No other kit needed; the board carries the sums. |
| Camera | Wide by default; kit close-up for the burn-out and the look inside the coil; board shots for both derivations and both worked examples; push-ins on the junction, shunt, multiplier, p.d. brackets, meter box and the two test meters |
| End card | `meta.next: '#apply'`, `nextLabel: 'Continue to Apply →'` |

**Colour roles:**

| Symbol | Meaning | Colour |
| --- | --- | --- |
| `I` | line current (the current to be measured) | sky |
| `I_g` | coil (full-scale) current | gold |
| `R_g` | coil resistance | pink |
| `R_s` | shunt | green |
| `R_m` | multiplier | orange |

**Accuracy notes:**
- Coil numbers exactly as 02-lesson.md: `I_g = 15 mA = 0.015 A`, `R_g = 18.0 Ω`, full-scale coil p.d. `0.015 × 18 = 0.27 V` (Do Now 2).
- Shunt: `R_s = 0.270 / 2.985 = 0.090452… = 0.0905 Ω` (3 s.f.); coil 15 mA (0.5 %), shunt 2.985 A (99.5 %).
- The finished ammeter's resistance is the parallel pair: `18 × 0.090452 / 18.090452 = 0.0900 Ω`, which equals `V_g / I = 0.27 / 3.0` exactly (same p.d. drives the whole 3.0 A). Used again in mistake two: dividing by `I` instead of `I − I_g` gives the meter's total, not the shunt.
- Multiplier: `R_total = 40 / 0.015 = 2 666.7 ≈ 2 667 Ω`; `R_m = 2 667 − 18 = 2 649 Ω ≈ 2 650 Ω` (3 s.f.), as the lesson states. The multiplier's p.d. is given as `40 − 0.27 = 39.73 V` (not as `0.015 × 2 649 = 39.735`, which would round differently).
- 40 V straight across the bare coil: `40 / 18 = 2.22 A ≈ 2.2 A`, which is `≈ 148`, said "about one hundred and fifty times" the 15 mA limit. 3.0 A / 0.015 A = 200 exactly.
- **Test on Emeka's battery (chapter 7):** the lesson's loop is E = 12.0 V, r = 1.2 Ω, 2.8 Ω starter load, I = 3.0 A, terminal p.d. 8.4 V. Inserting the 0.0900 Ω ammeter honestly lowers the current to `12.0 / 4.09 = 2.93 A ≈ 2.9 A`, so the video says "about two point nine amps, almost unchanged" rather than claiming the ammeter reads 3.0 A. The "what if the ammeter were 18 Ω" contrast: `12.0 / 22.0 = 0.545 ≈ 0.55 A`. The voltmeter test is done with the ammeter removed: the 2 667 Ω voltmeter in parallel with the 2.8 Ω load changes the current by about 0.07 %, so it reads 8.4 V (computed 8.397 V); it draws `8.4 / 2 667 = 3.15 mA`, said "about three milliamps", about one thousandth of 3.0 A.
- Mistake one's direction (voltmeter reads too low when `R_total` is used as `R_m`) matches the lesson's sources of error and MCQ 10.
- **Your-turn numbers are fresh** (R_g = 35 Ω, I_g = 4.0 mA, a 2.4 A ammeter and a 14 V voltmeter → 0.0584 Ω and 3 465 Ω). Grepped against the source past-questions bank (pdftotext of `sources/*.pdf`), 01-topic-map.md, 02-lesson.md (worked examples, Do Nows, bench expected results, Position Explorer, exit ticket) and 03-questions.md (all MCQs and Part A/B): none of 35 Ω, 4.0 mA / 4 mA, 2.4 A, 14 V, 0.14 V, 2.396, 0.0584, 3 500 or 3 465 appears. (An earlier draft used 50 Ω / 5.0 mA, which is the same instrument as source-bank item 11, so it was replaced.) The Onitsha exit ticket (90 Ω, 3.0 mA, 18 V) is not given away.

## Chapter 1: Chinedu's three-amp test (hook, about 0 min 50 s)
A delicate coil against a 3.0 A line: the student sees why a galvanometer cannot be used as it is.

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 1.1 | At Engineer Nkechi's workshop, Chinedu reaches for a small galvanometer to check Emeka's starter line. Three point zero amps flow in that line. | New board: "The starter test"<br>Kit galvanometer: scene=dial, labels=0, inside=0, scaleMax=15, unit=mA, defl=0, burn=0, rg=''<br>Board: line current: 3.0 A | hook, story |
| 1.2 | Nkechi stops his hand. This coil swings to full scale at only fifteen milliamps. That is zero point zero one five amps. | Board: full scale: 15 mA = 0.015 A<br>Highlight I_g<br>📷 WIDE → scale | the limit |
| 1.3 | Three point zero divided by zero point zero one five is two hundred. The line carries two hundred times what the coil can take. | Board: 3.0 ÷ 0.015 = 200 | size of the problem |
| 1.4 | Push that through the coil, and the pointer slams against its stop. The fine wire overheats and burns out. | Kit: defl=1.2, burn=1<br>📷 KIT CLOSE-UP → coil (no board writing) | consequence, shown |
| 1.5 | Nkechi says one movement can become two safe instruments. By the end of this video, you will design both. | Kit: burn=0, defl=0<br>📷 WIDE<br>New board: "By the end of this video"<br>Board: ☐ why a galvanometer is converted<br>Board: ☐ size a shunt: ammeter<br>Board: ☐ size a multiplier: voltmeter<br>Board: ☐ total vs added resistance | objectives |

## Chapter 2: Inside the moving coil (core idea, about 1 min)
What a galvanometer is and the two numbers that describe it.

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 2.1 | Let us look inside. A light coil of fine copper wire sits between the curved poles of a permanent magnet, held by a hairspring. | Kit: inside=1, labels=1<br>📷 KIT CLOSE-UP → coil, slow drift (no board writing) | reveal |
| 2.2 | When current flows in the coil, the magnet's field turns it against the spring. More current, more turn. The deflection is proportional to the current. | Kit: defl=0.6<br>📷 WIDE → coil<br>New board: "The moving coil"<br>Board: deflection ∝ current | mechanism |
| 2.3 | Two numbers describe every galvanometer. The full scale current, I g, is fifteen milliamps here. The coil resistance, R g, is eighteen ohms. | Kit: defl=1, rg='R_g = 18 Ω'<br>Board: I_g = 15 mA (full scale)<br>Board: R_g = 18 Ω (coil)<br>Highlight I_g, R_g | definitions |
| 2.4 | At full scale, the p.d. across the coil is I g times R g. Zero point zero one five times eighteen is zero point two seven volts. | Board: V_g = I_g R_g<br>Board: = 0.015 × 18 = 0.27 V<br>Box | full-scale p.d. (Do Now link) |
| 2.5 | So on its own, this meter reads at most fifteen milliamps, or zero point two seven volts. To go further, we add one resistor. Where we put it decides everything. | 📷 WIDE<br>New board: "On its own"<br>Board: max 15 mA or 0.27 V | bridge to the two conversions |

## Chapter 3: A bypass in parallel (core idea, about 1 min 10 s)
The shunt idea and the derivation of `R_s` from "same p.d. in parallel".

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 3.1 | To read three amps, we give most of the current a bypass. A small resistor, called the shunt, is joined in parallel with the coil. | Kit: scene=convert, mode=ammeter, labels=1, scaleMax=15, unit=mA, defl=0, flow=0, split=0, pd=0, box=0, rs='', rg='R_g = 18 Ω'<br>📷 WIDE → shunt<br>New board: "Ammeter: add a shunt"<br>Board: shunt R_s in parallel | idea |
| 3.2 | The line current, I, arrives at the junction and splits. I g goes through the coil. The rest, I minus I g, goes through the shunt. | Kit: flow=1, split=1, iLine='I', iCoil='I_g', iShunt='I − I_g', defl=1<br>📷 WIDE → junction<br>Board: coil: I_g<br>Board: shunt: I − I_g | current split |
| 3.3 | Coil and shunt are in parallel, so they have the same p.d. across them. | Kit: pd=1, vCoil='same p.d.'<br>📷 WIDE → pd<br>Board: same p.d. across both | the key rule (Lesson 3 link) |
| 3.4 | So I g times R g equals I minus I g, times R s. | New board: "Deriving R_s"<br>📷 BOARD SHOT<br>Board: I_g R_g = (I − I_g) R_s | derivation step |
| 3.5 | Divide both sides by I minus I g. The shunt is I g R g, over I minus I g. | Board: R_s = I_g R_g / (I − I_g)<br>Box<br>Highlight R_s | formula boxed |

## Chapter 4: Nkechi's 3.0 A ammeter (worked example, about 1 min 40 s)
Worked Example 1 of the lesson, then what the numbers mean on the meter.

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 4.1 | Worked example. Nkechi's coil has R g of eighteen point zero ohms and full scale at fifteen milliamps. What shunt makes a three point zero amp ammeter? | New board: "Worked example: 3.0 A ammeter"<br>📷 BOARD SHOT<br>Board: R_g = 18.0 Ω, I_g = 15 mA<br>Board: I = 3.0 A, R_s = ? | question, givens |
| 4.2 | Step one. Change milliamps to amps. Fifteen milliamps is zero point zero one five amps. | Board: I_g = 0.015 A<br>Note: ÷ 1000 | step 1 |
| 4.3 | Step two. Substitute. Zero point zero one five times eighteen point zero, over three point zero minus zero point zero one five. | Board: R_s = (0.015 × 18.0) / (3.0 − 0.015) | step 2 |
| 4.4 | Step three. That is zero point two seven zero over two point nine eight five, which is zero point zero nine zero five ohms, to three significant figures. | Board: = 0.270 / 2.985<br>Board: = 0.0905 Ω (in parallel)<br>Box | step 3, answer |
| 4.5 | Now watch the split. The coil still carries only fifteen milliamps. The shunt carries the other two point nine eight five amps. | Kit: rs='R_s = 0.0905 Ω', iLine='3.0 A', iCoil='15 mA', iShunt='2.985 A', pd=0<br>📷 WIDE → junction<br>New board: "The split"<br>Board: coil: 15 mA<br>Board: shunt: 2.985 A | meaning of the answer |
| 4.6 | Fifteen milliamps out of three point zero amps is just zero point five percent. Ninety-nine point five percent takes the bypass. | Board: 0.015 ÷ 3.0 = 0.5 % | share (bench analysis Q) |
| 4.7 | So when the pointer reaches full scale, it now means three amps. We relabel the dial, zero to three amps. | Kit: scaleMax=3, unit=A, defl=1<br>📷 WIDE → G | the converted scale |
| 4.8 | What is the resistance of the whole ammeter? The same zero point two seven volts drives all three point zero amps, so zero point two seven over three point zero, zero point zero nine zero zero ohms. | Kit: box=1, total='meter = 0.0900 Ω'<br>📷 WIDE → box<br>Board: meter: 0.27 ÷ 3.0 = 0.0900 Ω | total resistance of the meter |
| 4.9 | Tiny. A good ammeter has a very low resistance, and it is connected in series. | 📷 WIDE<br>Board: low R, connected in series<br>Box | objective 5 (ammeter) |

## Chapter 5: A big resistor in series (core idea, about 1 min 10 s)
Why 40 V burns the bare coil, the multiplier idea, and the derivation of `R_m`.

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 5.1 | Now the forty volt battery bank. Put forty volts straight across the bare coil, and the current would be forty over eighteen, about two point two amps. | Kit: mode=bare, box=0, split=1, iLine='≈ 2.2 A', rs='', scaleMax=15, unit=mA, defl=1.2, burn=1<br>📷 WIDE → G<br>New board: "Voltmeter: the 40 V bank"<br>Board: 40 ÷ 18 ≈ 2.2 A | problem |
| 5.2 | That is about one hundred and fifty times the coil's limit. Burnt again. | Board: ≈ 150 × I_g ✗ | size of the problem |
| 5.3 | So we add a large resistor in series, called the multiplier. The coil and the multiplier now share the forty volts, and the current is held down. | Kit: mode=voltmeter, burn=0, defl=0, split=0, rm='R_m = ?'<br>📷 WIDE → multiplier<br>Board: multiplier R_m in series<br>Highlight R_m | idea |
| 5.4 | In series, the same current flows through both. At full scale, that current is just I g. | Kit: flow=1, split=1, iLine='I_g', iCoil='I_g', defl=1<br>Board: same current I_g through both | the key rule |
| 5.5 | So V equals I g times R g plus R m. Rearrange, and R m equals V over I g, minus R g. | New board: "Deriving R_m"<br>📷 BOARD SHOT<br>Board: V = I_g (R_g + R_m)<br>Board: R_m = V / I_g − R_g<br>Box | formula boxed |

## Chapter 6: Nkechi's 40 V voltmeter (worked example, about 1 min 20 s)
The Bridge's voltmeter on the same coil, then the p.d. split and the meter's total resistance.

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 6.1 | Worked example. Make the same coil, fifteen milliamps and eighteen ohms, into a forty volt voltmeter. | New board: "Worked example: 40 V voltmeter"<br>📷 BOARD SHOT<br>Board: I_g = 0.015 A, R_g = 18 Ω<br>Board: V = 40 V, R_m = ? | question, givens |
| 6.2 | Step one. The whole meter must pass fifteen milliamps at forty volts. R total is forty over zero point zero one five, about two thousand six hundred and sixty-seven ohms. | Board: R_total = 40 / 0.015<br>Board: = 2 667 Ω (whole meter) | step 1 |
| 6.3 | Step two. The coil already gives eighteen ohms, so subtract it. Two thousand six hundred and sixty-seven minus eighteen is two thousand six hundred and forty-nine ohms. | Board: R_m = 2 667 − 18<br>Board: = 2 649 Ω | step 2 |
| 6.4 | To three significant figures, that is two thousand six hundred and fifty ohms, in series with the coil. | New board: "Answer"<br>Board: R_m ≈ 2 650 Ω, in series<br>Box | answer |
| 6.5 | Check the p.d. split. The coil takes zero point two seven volts. The multiplier drops the rest, forty minus zero point two seven, thirty-nine point seven three volts. | Kit: rm='R_m = 2 649 Ω', pd=1, vCoil='0.27 V', vOther='39.73 V', vTotal='40 V', split=0<br>📷 WIDE → pd<br>Board: coil 0.27 V + R_m 39.73 V = 40 V ✓ | check |
| 6.6 | At full scale the pointer now means forty volts. We relabel the dial, zero to forty volts. | Kit: scaleMax=40, unit=V, defl=1<br>📷 WIDE → G | converted scale |
| 6.7 | The whole voltmeter is two thousand six hundred and sixty-seven ohms. Huge. A good voltmeter has a very high resistance, and it is connected in parallel. | Kit: box=1, total='meter = 2 667 Ω'<br>📷 WIDE → box<br>Board: high R, connected in parallel<br>Box | objectives 4–5 (voltmeter) |

## Chapter 7: Why tiny, why huge (testing on Emeka's battery, about 1 min 20 s)
The finished meters on the lesson's loop: what the meter's resistance does to the thing it measures.

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 7.1 | Back to Emeka's battery. Twelve point zero volts, internal resistance one point two ohms, driving the two point eight ohm starter load at three point zero amps. | Kit: scene=test, labels=1, bat='12.0 V', r='r = 1.2 Ω', R='2.8 Ω', I=3.0, imax=3, ammeter=0, voltmeter=0, verdict=null<br>📷 WIDE<br>New board: "Testing Emeka's battery"<br>Board: E = 12.0 V, r = 1.2 Ω<br>Board: R = 2.8 Ω, I = 3.0 A | set-up (unit mystery) |
| 7.2 | Our ammeter goes in series. It adds only zero point zero nine ohms to the four ohms already there. Twelve point zero over four point zero nine is about two point nine amps. Almost unchanged. | Kit: ammeter=1, aMax=3, aDefl=0.978, aRead='≈ 2.9 A', aR='0.0900 Ω', I=2.93, verdict=ok<br>📷 WIDE → ammeter<br>Board: 12.0 ÷ 4.09 ≈ 2.9 A ✓ | low R in series barely disturbs I |
| 7.3 | Now imagine an ammeter with eighteen ohms inside. The current would fall to twelve point zero over twenty-two, about zero point five five amps. The meter would spoil the very current it measures. | Kit: aR='18 Ω', aDefl=0.18, aRead='≈ 0.55 A', I=0.55, verdict=bad<br>Board: 12.0 ÷ 22.0 ≈ 0.55 A ✗ | why not high R |
| 7.4 | The voltmeter goes in parallel, across the battery. It reads eight point four volts, the terminal p.d., and draws only about three milliamps. | Kit: ammeter=0, verdict=null, I=3.0, voltmeter=1, vMax=40, vDefl=0.21, vRead='8.4 V', vR='2 667 Ω'<br>📷 WIDE → voltmeter<br>New board: "The voltmeter"<br>Board: 8.4 ÷ 2 667 ≈ 3 mA | high R in parallel draws little |
| 7.5 | Three milliamps beside three amps is about one thousandth. The battery hardly notices the voltmeter. | Board: ≈ 1/1000 of 3.0 A | size of the effect |
| 7.6 | So a shunt is tiny and in parallel, making a low resistance ammeter for series use. A multiplier is huge and in series, making a high resistance voltmeter for parallel use. | 📷 WIDE<br>Board: shunt: tiny, parallel → ammeter<br>Board: multiplier: huge, series → voltmeter | big idea |

## Chapter 8: Mistakes that cost marks (common mistakes, about 1 min 10 s)
Four errors examiners report, each shown wrong then right.

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 8.1 | Mistake one. Giving R total as the multiplier. Forty over zero point zero one five is the whole meter, two thousand six hundred and sixty-seven ohms. The resistor you add is two thousand six hundred and forty-nine. | Kit: panel off<br>📷 WIDE<br>New board: "Common mistakes"<br>Board: ✗ R_m = 2 667 Ω<br>Board: ✓ R_m = 2 667 − 18 = 2 649 Ω | total vs added (objective 4) |
| 8.2 | Forget to subtract R g, and the meter's resistance is too big. Less current flows in the coil, so it reads too low. | Board: forgot R_g → reads too low | direction of error |
| 8.3 | Mistake two. Dividing by I instead of I minus I g. Zero point two seven over three point zero gives zero point zero nine zero zero ohms. That is the whole ammeter, not the shunt. | New board: "Mistake two"<br>Board: ✗ 0.27 ÷ 3.0 = 0.0900 Ω<br>Board: ✓ 0.270 ÷ 2.985 = 0.0905 Ω | shunt current is I − I_g |
| 8.4 | Mistake three. Forgetting milliamps. Fifteen milliamps is zero point zero one five amps, never fifteen. | Board: 15 mA = 0.015 A, not 15 | unit slip |
| 8.5 | Mistake four. Swapping places. A small resistor in series with the coil protects nothing. The full current still runs through the coil. | Kit: scene=convert, mode=ammeter, wrong=shunt-series, rs='small R', rg='R_g = 18 Ω', scaleMax=15, unit=mA, flow=1, split=1, iLine='3.0 A', iCoil='3.0 A', pd=0, box=0, defl=1.2, burn=1<br>📷 WIDE → G<br>New board: "Mistake four"<br>Board: ✗ shunt in series: burnt<br>Board: ✓ shunt in parallel | position matters |

## Chapter 9: One board (summary, about 0 min 40 s)

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 9.1 | Here is the whole lesson on one board. Ammeter: a shunt in parallel, R s equals I g R g over I minus I g. Voltmeter: a multiplier in series, R m equals V over I g minus R g. | Kit: panel off<br>📷 WIDE<br>New board: "Summary"<br>Board: R_s = I_g R_g / (I − I_g), parallel<br>Board: R_m = V / I_g − R_g, series | formulae |
| 9.2 | The ammeter has low resistance and goes in series. The voltmeter has high resistance and goes in parallel. Always subtract R g. | Board: ammeter: low R, in series<br>Board: voltmeter: high R, in parallel | rules |
| 9.3 | So Nkechi's one coil becomes a three amp ammeter with a zero point zero nine zero five ohm shunt, and a forty volt voltmeter with a two thousand six hundred and fifty ohm multiplier. | New board: "One coil, two meters"<br>Board: 3.0 A: R_s = 0.0905 Ω<br>Board: 40 V: R_m ≈ 2 650 Ω<br>Box | mystery thread closed |

## Chapter 10: Your turn (pause and try, about 1 min 20 s)

| # | Narration | On screen | Purpose |
| --- | --- | --- | --- |
| 10.1 | Your turn. A galvanometer has coil resistance thirty-five ohms and full scale current four point zero milliamps. Find the shunt for a two point four amp ammeter, and the multiplier for a fourteen volt voltmeter. | New board: "Your turn"<br>📷 WIDE<br>Board: R_g = 35 Ω, I_g = 4.0 mA<br>Board: (a) R_s for 2.4 A?<br>Board: (b) R_m for 14 V? | practice question |
| 10.2 | Pause the video and try both. Remember to change milliamps to amps first. | Board: pause and try<br>hold 15 s | thinking time |
| 10.3 | Part a. I g is zero point zero zero four zero amps. The shunt is zero point zero zero four zero times thirty-five, over two point four minus zero point zero zero four zero. | New board: "Answer (a)"<br>📷 BOARD SHOT<br>Board: I_g = 0.0040 A<br>Board: R_s = (0.0040 × 35) / (2.4 − 0.0040) | step |
| 10.4 | That is zero point one four over two point three nine six, which is zero point zero five eight four ohms, in parallel. | Board: = 0.14 / 2.396<br>Board: = 0.0584 Ω, in parallel<br>Box | answer (a) |
| 10.5 | Part b. R total is fourteen over zero point zero zero four zero, which is three thousand five hundred ohms. Subtract thirty-five. The multiplier is three thousand four hundred and sixty-five ohms, in series. | New board: "Answer (b)"<br>Board: R_total = 14 / 0.0040 = 3 500 Ω<br>Board: R_m = 3 500 − 35 = 3 465 Ω<br>Box | answer (b) |
| 10.6 | Well done. Now continue to Apply, and test yourself on the quiz. | 📷 WIDE<br>End card: Continue to Apply → (`#apply`) | close |

## Build checks and kit gaps

| Quantity | Working | Expected value (as shown / said) |
| --- | --- | --- |
| I_g in amps | 15 ÷ 1000 | 0.015 A |
| line / coil ratio | 3.0 ÷ 0.015 | 200 |
| coil p.d. at full scale V_g | 0.015 × 18 | 0.27 V |
| shunt numerator | 0.015 × 18.0 | 0.270 |
| shunt current I − I_g | 3.0 − 0.015 | 2.985 A |
| R_s | 0.270 ÷ 2.985 = 0.090452 | 0.0905 Ω (3 s.f.) |
| coil share | 0.015 ÷ 3.0 × 100 | 0.5 % |
| shunt share | 2.985 ÷ 3.0 × 100 | 99.5 % |
| ammeter total (parallel pair) | 18 × 0.090452 ÷ (18 + 0.090452) | 0.0900 Ω |
| ammeter total (shortcut) | 0.27 ÷ 3.0 | 0.0900 Ω (must equal the line above) |
| 40 V on bare coil | 40 ÷ 18 = 2.222 | ≈ 2.2 A |
| ratio to limit | 2.222 ÷ 0.015 = 148 | "about 150" (check 140–160) |
| R_total (voltmeter) | 40 ÷ 0.015 = 2 666.7 | 2 667 Ω |
| R_m | 2 667 − 18 | 2 649 Ω |
| R_m (3 s.f.) | 2 648.7 → | 2 650 Ω |
| multiplier p.d. | 40 − 0.27 | 39.73 V |
| p.d. sum | 0.27 + 39.73 | 40 V |
| current with ammeter in loop | 12.0 ÷ (1.2 + 2.8 + 0.0900) = 2.934 | ≈ 2.9 A; aDefl = 2.934 ÷ 3 = 0.978 |
| loop resistance without meter | 1.2 + 2.8 | 4.0 Ω |
| current with an 18 Ω ammeter | 12.0 ÷ (4.0 + 18) = 0.5455 | ≈ 0.55 A; aDefl = 0.5455 ÷ 3 = 0.18 |
| voltmeter reading (ammeter removed) | I = 12.0 ÷ (1.2 + 2.8‖2 667) = 3.002; 12.0 − 1.2 × 3.002 = 8.397 | 8.4 V; vDefl = 8.4 ÷ 40 = 0.21 |
| voltmeter current | 8.4 ÷ 2 667 = 3.15 mA | "about 3 mA" (check 2.5–3.5) |
| voltmeter / load current | 0.00315 ÷ 3.0 = 0.00105 | "about one thousandth" (check 0.0008–0.0012) |
| Mystery loop consistency | 3.0 × (2.8 + 1.2); 3.0 × 2.8; 3.0 × 1.2 | 12.0 V; 8.4 V; 3.6 V |
| Your turn: I_g | 4.0 ÷ 1000 | 0.0040 A |
| Your turn: numerator | 0.0040 × 35 | 0.14 |
| Your turn: shunt current | 2.4 − 0.0040 | 2.396 A |
| Your turn: R_s | 0.14 ÷ 2.396 = 0.058431 | 0.0584 Ω |
| Your turn: R_total | 14 ÷ 0.0040 | 3 500 Ω |
| Your turn: R_m | 3 500 − 35 | 3 465 Ω |

**Kit `galvanometer` (requested as a KIT GAP, now built: `kits/video/galvanometer/`)** (`06-videos/kit-requests/galvanometer.md`). Needed for chapters 1–8: the moving-coil
dial with cut-away (magnet, coil, hairspring, radial field), a rescalable scale, burn-out, the conversion schematic (bare / shunt in
parallel with a split current stream / multiplier in series with p.d. brackets, the finished-meter box with its total resistance, the
"shunt in series" mistake) and the test loop with a series ammeter and a parallel voltmeter. The built-in `circuit` kit cannot do this
(fixed topology, no branches, voltmeter scale only 5 or 15 V). **Fallback if the kit cannot be built:** use the built-in `circuit` kit
for chapter 7 only (ammeter in series, voltmeter across the battery at `vmax: 15`, readings 2.9 A and 8.4 V) and carry chapters 1–6
and 8 on the board alone; this loses the current split and the p.d. split, which are the heart of the lesson, so the kit is recommended.
