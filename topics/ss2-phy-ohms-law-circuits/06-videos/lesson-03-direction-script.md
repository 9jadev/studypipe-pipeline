# Direction Script: Lesson 03 · Series & Parallel Networks, Cell Arrays, Power & Efficiency

## Overview
The video settles Emeka's question (three cells in a line or side by side for his low-resistance backup pump?) and Chinedu's (why does the worn battery run hot?). It builds the series and parallel rules, collapses the lesson's mixed network, compares the two cell arrays, then covers power, the kilowatt-hour, the power split `EI = I²R + I²r`, efficiency, and the P–R and η–R smooth curves (maximum power at `R = r`). It opens the **Make Sense** phase, after the network-and-cells bench. Quizzes stay in Apply.

| Item | Decision |
| --- | --- |
| Running time | About 11.9 minutes, 12 chapters, 67 narration lines (inside the 14 minute limit) |
| Narrator | One teacher voice, Nigerian English |
| Level | SS2 Physics, WAEC / NECO / JAMB |
| Theme | Unit theme (`meta.theme` unset) |
| Kits used | `circuit-network` (plug-in, built on the fly from the kit request; `kits/video/circuit-network/`) for every circuit picture · built-in `graph` for the P–R and η–R curves · board only for the power and kilowatt-hour chapter, the mistakes, the summary |
| Camera | Wide by default; push-ins on the junction, the parallel pair, the cell array, the equivalent-cell badge and the power bar; board shots for the long calculations; wide + focus on the peak of the P–R curve |
| End card | `meta.next: '#apply'`, `nextLabel: 'Continue to Apply →'` |

**Colour roles** (kept consistent with the lesson-02 video):

| Symbol | Meaning | Colour |
| --- | --- | --- |
| `E` | EMF (also `E_t`) | gold |
| `I` | current (also `I₁`, `I₆`, branch currents) | green |
| `V` | p.d. across a resistor or a branch (`V₁`, `V_p`) | blue |
| `R` | external resistance (`R₁`, `R_p`, `R_ext`) | orange |
| `r` | internal resistance and the power wasted inside, `I²r` | red |
| `P` | useful power, energy and efficiency `η` | purple |

**Accuracy notes:**
- Chapters 2–3 use **teaching numbers that are not in 02-lesson.md**: an *ideal* 12 V supply (no internal resistance, said aloud) with 4.0 Ω and 6.0 Ω. Series: 10 Ω, 1.2 A, 4.8 V + 7.2 V = 12 V. Parallel: 3.0 A + 2.0 A = 5.0 A, R = 2.4 Ω (product over sum 24/10 agrees). This pair is in no worked example, MCQ or Part B item, so no quiz answer is given away. It is not Emeka's battery and is not called his.
- Worked examples 1–3 use the lesson's exact numbers (02-lesson.md § Lesson 03, Apply). `I₆ = 7.0/6.0 = 1.1667 → 1.17 A`, `I₁₂ = 7.0/12.0 = 0.5833 → 0.58 A`; the rounded values add back to exactly 1.75 A.
- The worn battery (chapter 8) is treated **qualitatively** (bar proportions, heat glow, no numbers on screen or in narration), because its numbers (10.8 W lost, 70 % efficiency) are answers to MCQ 12 and Part B b8.
- Curves: `E = 5.0 V`, `r = 0.5 Ω` as the lesson bench. `P = E²R/(R + r)²` through the bench points (0.1, 6.94), (0.5, 12.5), (1.0, 11.1), (2.0, 8.00), (4.0, 4.94) — a smooth computed curve, peak 12.5 W at R = r = 0.5 Ω. `η = R/(R + r)` through (0.1, 16.7), (0.5, 50.0), (1.0, 66.7), (2.0, 80.0), (4.0, 88.9) — a smooth curve rising towards a dashed 100 % limit it never reaches. Never straight lines.
- 6.7 says "for a high-resistance load, series wins". True for this set of four cells above R = 2.0 Ω (where both arrays give 0.60 A); the narration gives no number, only the principle.
- Kilowatt-hour: "one unit" on a NEPA/PHCN prepaid meter = 1 kWh = 3.6 × 10⁶ J; the 750 W freezer for 8.0 h is the lesson's own Make Sense line (6.0 kWh = 2.16 × 10⁷ J). It is an energy unit, never power.
- **Your-turn numbers are fresh** (two series cells of 2.0 V and 0.25 Ω each, feeding 2.0 Ω ∥ 6.0 Ω; answers R_p = 1.5 Ω, I = 2.0 A, P = 6.0 W, η = 75 %). Grepped 02-lesson.md and 03-questions.md: 0.25 Ω cells, the 2.0 Ω ∥ 6.0 Ω pair and this question appear nowhere (75 % only as a wrong MCQ distractor; the L03 exit ticket, 0.60 Ω / 5.4 Ω, is not touched).
- Kit dot speeds show relative current only (faster = more current); the plan's labels carry the numbers.

> **Approved 2026-11-08; Phase 2 sync.** The chapter tables below are generated from `lesson-03.plan.cjs` (plan-to-script), so narration and screen match the plan word for word. To keep the film under 12 minutes, the narration is tighter than the first draft: "See the pattern" (4.9) is merged into the check line 4.8; the summary (11.1–11.4) is merged into two lines; mistake 10.5 is merged into 10.4; spoken arithmetic is shorter in several steps. No worked example, check or number was dropped. 67 lines, about 11.9 min.

## Chapter 1: Emeka's backup pump

| # | Narration | On screen |
| --- | --- | --- |
| 1.1 | Emeka's shop needs a backup pump, and he has three cells. Should he join them in a line, or side by side? | New board: "Line or side by side?"<br>Kit circuit-network: n=3, arr=series, cellLabel=E, r, showr=1, E=1.5, r=1, layout=single, load=pump, L1=pump, R1=1, flow=1<br>Board: 3 cells → 1 pump |
| 1.2 | Tobe says side by side gives more voltage. But the pump has a low resistance and pulls a big current. | Kit circuit-network: arr=parallel<br>Board: Tobe: side by side = more V ? |
| 1.3 | And why was the worn battery hot after the last test? | Kit circuit-network: heat=1<br>📷 WIDE → src<br>Board: worn battery runs hot. Why? |
| 1.4 | By the end, you will reduce networks, combine cells, and calculate power, energy and efficiency. | New board: "By the end of this video"<br>Kit circuit-network: heat=0<br>📷 WIDE<br>Board: ☐ series and parallel R<br>Board: ☐ mixed networks<br>Board: ☐ cells in series / parallel<br>Board: ☐ power, kWh, efficiency |

## Chapter 2: One path: series

| # | Narration | On screen |
| --- | --- | --- |
| 2.1 | Here are four point zero and six point zero ohm resistors in series, on an ideal twelve volt supply with no internal resistance. | New board: "Series: one path"<br>Kit circuit-network: n=1, cellLabel=12 V ideal, showr=0, E=12, r=0, layout=series, R1=4, R2=6, R3=0, L1=4.0 Ω, L2=6.0 Ω, flow=1<br>Board: 4.0 Ω and 6.0 Ω, 12 V |
| 2.2 | There is only one path, so the current is the same everywhere in a series circuit. | Kit circuit-network: focus=load<br>Highlight I<br>Board: same I everywhere |
| 2.3 | The resistances simply add. Four point zero plus six point zero gives ten ohms. | Highlight R<br>Board: R = R_1 + R_2<br>Board: R = 4.0 + 6.0 = 10 Ω |
| 2.4 | So the current is twelve over ten, which is one point two amps, through both resistors. | Kit circuit-network: focus=null, I1=1.2 A, I2=1.2 A<br>Board: I = 12/10 = 1.2 A |
| 2.5 | Each resistor takes its share of the p d. Four point eight volts across the first, seven point two volts across the second. | New board: "P.d.s add"<br>Kit circuit-network: V1=4.8 V, V2=7.2 V<br>Board: V_1 = 1.2 × 4.0 = 4.8 V<br>Board: V_2 = 1.2 × 6.0 = 7.2 V |
| 2.6 | Together they make the whole twelve volts. Series rule: one current, the p d s add, and the resistances add. | Board: 4.8 + 7.2 = 12 V<br>Board: R = R_1 + R_2 +<br>Box p4 |

## Chapter 3: Side by side: parallel

| # | Narration | On screen |
| --- | --- | --- |
| 3.1 | Now put the same two resistors side by side, across the same twelve volt supply. | New board: "Parallel: shared p.d."<br>Kit circuit-network: layout=parallel, I1=, I2=, V1=, V2=<br>Board: 4.0 Ω 6.0 Ω on 12 V |
| 3.2 | Each branch sits straight across the supply, so each gets the full twelve volts. In parallel, the p d is the same. | Kit circuit-network: V1=12 V, V2=12 V<br>Highlight V<br>Board: same V across each branch |
| 3.3 | At the junction the current splits. Twelve over four point zero is three point zero amps. Twelve over six point zero is two point zero amps. | Kit circuit-network: split=1, I1=3.0 A, I2=2.0 A<br>📷 WIDE → node<br>Board: I_1 = 12/4.0 = 3.0 A<br>Board: I_2 = 12/6.0 = 2.0 A |
| 3.4 | The branch currents add up. Three point zero plus two point zero is five point zero amps from the supply. | Kit circuit-network: split=0, Imain=5.0 A<br>📷 WIDE<br>Board: I = 3.0 + 2.0 = 5.0 A |
| 3.5 | So the whole network behaves like twelve over five point zero, which is two point four ohms. | New board: "Equivalent resistance"<br>Kit circuit-network: stage=1, Lp=2.4 Ω, V1=, V2=, I1=, I2=<br>Board: R = 12/5.0 = 2.4 Ω |
| 3.6 | The rule is one over R equals one over R one plus one over R two. For two resistors, use product over sum: twenty-four over ten, two point four ohms again. | Board: 1/R = 1/R_1 + 1/R_2<br>Board: R = R_1R_2/(R_1 + R_2)<br>Board: R = 24/10 = 2.4 Ω<br>Box e3 |
| 3.7 | Notice. Two point four ohms is smaller than the smaller branch. An extra path lets more current through. | Kit circuit-network: stage=0<br>Board: 2.4 Ω < 4.0 Ω (note: extra path) |

## Chapter 4: Collapsing a mixed network

| # | Narration | On screen |
| --- | --- | --- |
| 4.1 | Worked example. A fourteen point zero volt battery with internal resistance one point zero ohm feeds three point zero ohms, in series with six point zero and twelve point zero ohms in parallel. | New board: "Mixed network"<br>Kit circuit-network: n=1, cellLabel=14.0 V · 1.0 Ω, showr=1, E=14, r=1, layout=mixed, R1=3, R2=6, R3=12, L1=3.0 Ω, L2=6.0 Ω, L3=12.0 Ω, flow=1<br>Board: E = 14.0 V, r = 1.0 Ω<br>Board: 3.0 Ω + (6.0 Ω 12.0 Ω) |
| 4.2 | Find the total current and the current in the six point zero ohm branch. Collapse the network from the inside out. | 📷 WIDE → pair<br>Board: I = ? I_6 = ? |
| 4.3 | Step one. Reduce the parallel pair. Six point zero times twelve point zero, over their sum. Seventy-two over eighteen is four point zero ohms. | New board: "Step 1: the pair"<br>📷 WIDE<br>Board: R_p = (6.0 × 12.0)/(6.0 + 12.0)<br>Kit circuit-network: stage=1, Lp=4.0 Ω<br>Board: R_p = 72/18 = 4.0 Ω |
| 4.4 | Step two. Now the outside is all in series. Three point zero plus four point zero is seven point zero ohms. | Kit circuit-network: stage=2, Lext=7.0 Ω<br>Board: R_ext = 3.0 + 4.0 = 7.0 Ω |
| 4.5 | Step three. Add the internal resistance. Fourteen point zero over eight point zero is one point seven five amps. | New board: "Step 3: total current"<br>Highlight r<br>Board: I = E/(R_ext + r)<br>Board: I = 14.0/8.0 = 1.75 A<br>Box m8<br>Kit circuit-network: Imain=1.75 A |
| 4.6 | Step four. Open the pair back up. The p d across it is one point seven five times four point zero, which is seven point zero volts. | New board: "Step 4: the branches"<br>Kit circuit-network: stage=0, Vp=7.0 V<br>📷 WIDE → pair<br>Board: V_p = 1.75 × 4.0 = 7.0 V |
| 4.7 | So the six ohm branch takes seven point zero over six point zero, one point one seven amps. | Kit circuit-network: I2=1.17 A<br>Board: I_6 = 7.0/6.0 = 1.17 A<br>Box m10 |
| 4.8 | Check. The twelve ohm branch takes seven point zero over twelve point zero, zero point five eight amps. Together, one point seven five amps. It works. The smaller resistance takes the bigger share. | Kit circuit-network: I3=0.58 A<br>📷 WIDE → node<br>Board: I_12 = 7.0/12.0 = 0.58 A<br>Board: 1.17 + 0.58 = 1.75 A ✓<br>📷 WIDE<br>Board: smaller R → bigger share of I |

## Chapter 5: Cells in series and in parallel

| # | Narration | On screen |
| --- | --- | --- |
| 5.1 | Back to Emeka's three cells. Each cell has an E M F, capital E, and an internal resistance, small r. | New board: "Cell arrays"<br>Kit circuit-network: n=3, arr=series, cellLabel=E, r, showr=1, E=1.5, r=1, layout=single, load=pump, L1=pump, R1=1, flow=1<br>📷 WIDE → cells<br>Board: each cell: E and r |
| 5.2 | In series, the E M Fs add, but so do the internal resistances. Three cells give three E and three r. | Kit circuit-network: badge=3E, 3r<br>📷 WIDE → badge<br>Board: series: E_t = nE, r_t = nr |
| 5.3 | In parallel, the E M F stays that of one cell. Sorry Tobe, side by side does not add voltage. | Kit circuit-network: arr=parallel, badge=E, r/3<br>📷 WIDE<br>Board: parallel: E_t = E (note: Tobe ✗) |
| 5.4 | But the internal resistances divide. Three identical cells give r over three. Less resistance inside means more current. | Highlight r<br>Board: parallel: r_t = r/n<br>Box c4 |

## Chapter 6: Which array drives the pump?

| # | Narration | On screen |
| --- | --- | --- |
| 6.1 | Worked example. Four identical cells, each one point five volts with internal resistance two point zero ohms, feed a one point zero ohm pump. Compare parallel with series. | New board: "Four cells, one pump"<br>Kit circuit-network: n=4, arr=parallel, cellLabel=1.5 V · 2.0 Ω, showr=1, E=1.5, r=2, layout=single, load=pump, L1=1.0 Ω pump, R1=1, flow=1<br>Board: each cell: 1.5 V, 2.0 Ω<br>Board: pump: 1.0 Ω |
| 6.2 | Step one, parallel. The E M F stays one point five volts. The internal resistance is two point zero over four, zero point five ohm. | New board: "Step 1: parallel"<br>Kit circuit-network: badge=1.5 V · 0.5 Ω<br>Board: E_t = 1.5 V<br>Board: r_t = 2.0/4 = 0.5 Ω |
| 6.3 | The current is one point five over one point zero plus zero point five, which is one point zero amp. | Board: I = 1.5/(1.0 + 0.5)<br>Board: I = 1.0 A<br>Box w6<br>Kit circuit-network: Imain=1.0 A |
| 6.4 | Step two, series. The E M Fs add to six point zero volts, but the internal resistances add to eight point zero ohms. | New board: "Step 2: series"<br>Kit circuit-network: arr=series, badge=6.0 V · 8.0 Ω, Imain=<br>Board: E_t = 4 × 1.5 = 6.0 V<br>Board: r_t = 4 × 2.0 = 8.0 Ω |
| 6.5 | The current is six point zero over one point zero plus eight point zero, only zero point six seven amps. | 📷 WIDE → load<br>Board: I = 6.0/(1.0 + 8.0)<br>Board: I = 0.67 A<br>Kit circuit-network: Imain=0.67 A |
| 6.6 | One point zero amp beats zero point six seven amps. For a low resistance pump, parallel wins. Tobe's extra voltage was eaten inside the cells. | New board: "Verdict"<br>📷 WIDE<br>Board: 1.0 A > 0.67 A<br>Board: parallel wins here<br>Box w12 |
| 6.7 | For a high resistance load, series would win instead. It depends on the load. | Board: high-R load → series |

## Chapter 7: Power and the kilowatt-hour

| # | Narration | On screen |
| --- | --- | --- |
| 7.1 | Electrical power is the rate at which electrical energy changes into other forms, in watts, or joules per second. | New board: "Electrical power"<br>Kit panel off<br>📷 WIDE<br>Highlight P<br>Board: P = IV (note: 1 W = 1 J/s) |
| 7.2 | Using V equals I R gives two more forms: I squared R, and V squared over R. Pick the one that fits your data. | Board: P = IV = I^2R = V^2/R<br>Box k2 |
| 7.3 | Energy is power multiplied by time, so W equals I V t. | Board: W = Pt = IVt |
| 7.4 | On a NEPA prepaid meter, one unit is one kilowatt-hour. That is one thousand watts for three thousand six hundred seconds, which is three point six million joules. | New board: "The kilowatt-hour"<br>Board: 1 kWh = 1000 W × 3600 s<br>Board: 1 kWh = 3.6 × 10^6 J<br>Box k5 |
| 7.5 | A seven hundred and fifty watt freezer runs for eight point zero hours. Zero point seven five kilowatts times eight point zero hours is six point zero kilowatt-hours. | Board: 0.75 kW × 8.0 h = 6.0 kWh |
| 7.6 | That is two point one six times ten to the seven joules. The kilowatt-hour is energy, never power. | Board: = 2.16 × 10^7 J (note: energy, not power)<br>Box k7 |

## Chapter 8: Where the power goes

| # | Narration | On screen |
| --- | --- | --- |
| 8.1 | The cell's total power, E times I, splits. The load gets I squared R. The rest, I squared r, heats the cell. | New board: "The power split"<br>Kit circuit-network: n=1, cellLabel=5.0 V · 0.5 Ω, showr=1, E=5, r=0.5, layout=single, load=resistor, R1=4.5, L1=4.5 Ω, flow=1, bar=1, Puse=4.5, Pwaste=0.5, barLabels=0<br>📷 WIDE → bar<br>Highlight P, r<br>Board: EI = I^2R + I^2r |
| 8.2 | Worked example. A five point zero volt cell with zero point five ohm internal resistance drives four point five ohms. Find the load power and efficiency. | 📷 WIDE<br>Board: 5.0 V, 0.5 Ω, 4.5 Ω |
| 8.3 | Step one. The current is five point zero over four point five plus zero point five, which is one point zero amp. | New board: "Steps 1 and 2"<br>📷 BOARD SHOT<br>Board: I = 5.0/(4.5 + 0.5) = 1.0 A |
| 8.4 | Step two. Load power, I squared R, is one point zero squared times four point five, four point five watts. Total power, E times I, is five point zero watts. | Board: P = 1.0^2 × 4.5 = 4.5 W<br>Board: EI = 5.0 × 1.0 = 5.0 W |
| 8.5 | So zero point five watts is lost inside as heat. That is I squared r, one point zero squared times zero point five. | 📷 WIDE → bar<br>Kit circuit-network: barLabels=1, PuseL=4.5 W useful, PwasteL=0.5 W heat<br>Board: I^2r = 1.0^2 × 0.5 = 0.5 W |
| 8.6 | Step three. Efficiency is useful power over total power. Four point five over five point zero is ninety percent. The short cut, R over R plus r, gives the same. | New board: "Step 3: efficiency"<br>📷 WIDE<br>Board: = 4.5/5.0 × 100 = 90 \%<br>Box x7<br>Board: = R/(R + r) = V/E |
| 8.7 | Emeka's worn battery has a bigger internal resistance, so a much bigger share of its power burns inside as I squared r. That is why it runs hot. | Kit circuit-network: cellLabel=worn: big r, E=12, r=1.2, R1=2.8, L1=2.8 Ω, Puse=25.2, Pwaste=10.8, barLabels=0, heat=1<br>📷 WIDE → src<br>Board: bigger r → more I^2r heat |

## Chapter 9: Maximum power is not maximum efficiency

| # | Narration | On screen |
| --- | --- | --- |
| 9.1 | Keep the same cell and change the load. Load power is E squared R over R plus r, all squared. | New board: "Power against load"<br>Kit graph [pr]: show=pts<br>📷 WIDE<br>Board: P = E^2R/(R + r)^2 |
| 9.2 | Tiny R gives almost no p d across the load. Huge R gives almost no current. In between, the power peaks. | Kit graph: show=pts+curve<br>Board: smooth curve, one peak |
| 9.3 | The peak is at R equals r, zero point five ohm: twelve point five watts. Maximum power comes when the load matches the internal resistance. | Kit graph: show=pts+curve+pguide+peak, pulse=peak<br>📷 WIDE → peak + pguide<br>Board: max P when R = r<br>Box g3<br>Board: 12.5 W at 0.5 Ω |
| 9.4 | But at that peak, the efficiency is zero point five over one point zero, only fifty percent. Half the power heats the cell. | New board: "Efficiency against load"<br>📷 WIDE<br>Kit graph [eta]: show=curve+g50+p50<br>Board: R = r: = 0.5/1.0 = 50 \% |
| 9.5 | As R grows, efficiency climbs towards one hundred percent. At four point zero ohms it is eighty-eight point nine percent, but the power is only four point nine four watts. | Kit graph: show=curve+g50+p50+pts+limit+limtxt+p4, pulse=p4<br>Board: 4.0 Ω: = 88.9 \%<br>Board: but P = 4.94 W |
| 9.6 | So, maximum power needs R equal to r. High efficiency needs R much bigger than r. Draw both graphs as smooth curves, never straight lines. | New board: "The trade-off"<br>Board: high needs R r<br>Box g8<br>Board: smooth curves, not lines |

## Chapter 10: Mistakes that cost marks

| # | Narration | On screen |
| --- | --- | --- |
| 10.1 | First mistake: adding the E M Fs of parallel cells. They keep one E M F; only r divides. | New board: "Common mistakes"<br>Kit panel off<br>Board: × parallel: E_t = nE<br>Board: ✓ parallel: E_t = E, r_t = r/n |
| 10.2 | Second: stopping at one over R. If one over R is zero point five zero, R is two point zero ohms. | Board: × stop at 1/R<br>Board: ✓ 1/R = 0.50 → R = 2.0 Ω |
| 10.3 | Third. Calling the kilowatt-hour a unit of power. It is a unit of energy, three point six million joules. | New board: "More mistakes"<br>Board: × kWh = power<br>Board: ✓ kWh = energy = 3.6 × 10^6 J |
| 10.4 | Fourth: maximum power is not one hundred percent efficient. At R equals r, it is fifty percent. And never leave out small r. | Board: × max P → 100 \%<br>Board: ✓ R = r → = 50 \%<br>Board: ✓ I = E/(R + r) |

## Chapter 11: Summary

| # | Narration | On screen |
| --- | --- | --- |
| 11.1 | To sum up. Series: one current, resistances add. Parallel: one p d, one over R adds. Cells: n E and n r in series, E and r over n in parallel. | New board: "Summary"<br>Board: series: same I, R = R<br>Board: parallel: same V, 1/R = 1/R<br>Board: cells: nE, nr / E, r/n |
| 11.2 | Power is I V, I squared R, or V squared over R. Maximum power at R equals r; high efficiency needs R much bigger than r. So Emeka's pump cells go in parallel, and his worn battery wastes I squared r as heat. | Board: P = IV = I^2R = V^2/R<br>Board: max P: R = r; high : R r<br>Box u5 |

## Chapter 12: Your turn

| # | Narration | On screen |
| --- | --- | --- |
| 12.1 | Your turn. Two cells in series, each two point zero volts and zero point two five ohm, feed two point zero and six point zero ohms in parallel. | New board: "Your turn"<br>Kit circuit-network: n=2, arr=series, cellLabel=2.0 V · 0.25 Ω, showr=1, E=2, r=0.25, layout=parallel, R1=2, R2=6, L1=2.0 Ω, L2=6.0 Ω, flow=1<br>Board: 2 cells in series: 2.0 V, 0.25 Ω<br>Board: 2.0 Ω 6.0 Ω |
| 12.2 | Find the current from the cells, the power delivered to the pair, and the efficiency. Pause and try it now. | Board: find I, P and<br>Pause-and-try countdown 15 s |
| 12.3 | Step one. The pair is twelve over eight, one point five ohms. The cells give four point zero volts and zero point five zero ohm. | New board: "Solution"<br>Kit circuit-network: stage=1, Lp=1.5 Ω, badge=4.0 V · 0.50 Ω<br>Board: R_p = 12/8 = 1.5 Ω<br>Board: E_t = 4.0 V, r_t = 0.50 Ω |
| 12.4 | Step two. The current is four point zero over one point five plus zero point five zero, which is two point zero amps. | Kit circuit-network: Imain=2.0 A<br>Board: I = 4.0/2.0 = 2.0 A<br>Box y6 |
| 12.5 | Step three. Power to the pair is two point zero squared times one point five, six point zero watts. Efficiency is one point five over two point zero, seventy-five percent. | Board: P = 2.0^2 × 1.5 = 6.0 W<br>Board: = 1.5/2.0 = 75 \%<br>Box y8 |
| 12.6 | Check. E times I is eight point zero watts, and six point zero over eight point zero is seventy-five percent. Well done. | New board: "Check"<br>Board: EI = 4.0 × 2.0 = 8.0 W<br>Board: 6.0/8.0 = 75 \% ✓ |

## Build checks and kit gaps

| Check | Computed | Expected |
| --- | --- | --- |
| series R | 4.0 + 6.0 | 10 Ω |
| series I | 12/10 | 1.2 A |
| V₁, V₂ | 1.2 × 4.0, 1.2 × 6.0 | 4.8 V, 7.2 V |
| p.d.s add | 4.8 + 7.2 | 12 V |
| parallel I₁, I₂ | 12/4.0, 12/6.0 | 3.0 A, 2.0 A |
| parallel I | 3.0 + 2.0 | 5.0 A |
| parallel R | 12/5.0; 24/10; 1/(1/4 + 1/6) | 2.4 Ω (all three agree) |
| WE1 R_p | 72/18 | 4.0 Ω |
| WE1 R_ext | 3.0 + 4.0 | 7.0 Ω |
| WE1 I | 14.0/(7.0 + 1.0) | 1.75 A |
| WE1 V_p | 1.75 × 4.0 | 7.0 V |
| WE1 I₆ | 7.0/6.0 = 1.1667 | 1.17 A (2 d.p.) |
| WE1 I₁₂ | 7.0/12.0 = 0.5833 | 0.58 A (2 d.p.) |
| WE1 check | 1.17 + 0.58 | 1.75 A |
| WE2 parallel | 2.0/4; 1.5/(1.0 + 0.5) | 0.5 Ω; 1.0 A |
| WE2 series | 4 × 1.5; 4 × 2.0; 6.0/9.0 | 6.0 V; 8.0 Ω; 0.67 A |
| (6.7 crossover, not shown) | 6/(2+8) = 1.5/(2+0.5) | 0.60 A at R = 2.0 Ω |
| kWh | 1000 × 3600 | 3.6 × 10⁶ J |
| freezer | 0.75 × 8.0; 6.0 × 3.6 × 10⁶ | 6.0 kWh; 2.16 × 10⁷ J |
| WE3 | 5.0/5.0; 1.0² × 4.5; 5.0 × 1.0; 1.0² × 0.5 | 1.0 A; 4.5 W; 5.0 W; 0.5 W |
| WE3 η | 4.5/5.0; 4.5/(4.5 + 0.5) | 90 % |
| power split | 4.5 + 0.5 | 5.0 W |
| worn-battery bar (no labels) | 3.0² × 2.8; 3.0² × 1.2 | 25.2 W; 10.8 W (proportions only) |
| P–R points | 25R/(R + 0.5)² at 0.1, 0.5, 1.0, 2.0, 4.0 | 6.94, 12.5, 11.1, 8.00, 4.94 W |
| P–R peak | 25 × 0.5/1.0² | 12.5 W at R = 0.5 Ω |
| η–R points | 100R/(R + 0.5) | 16.7, 50.0, 66.7, 80.0, 88.9 % |
| mistake 2 | 1/0.50 | 2.0 Ω |
| your turn R_p | 12/8 = (2.0 × 6.0)/(2.0 + 6.0) | 1.5 Ω |
| your turn cells | 2 × 2.0; 2 × 0.25 | 4.0 V; 0.50 Ω |
| your turn I | 4.0/(1.5 + 0.50) | 2.0 A |
| your turn P | 2.0² × 1.5 | 6.0 W |
| your turn η | 1.5/2.0; 6.0/(4.0 × 2.0) | 75 % |

**Kits:** `graph` (built-in, two specs: PR and ETA, curves computed from `fn`, never straight lines except the dashed 100 % limit guide).

**Kit `circuit-network`** (requested in `06-videos/kit-requests/circuit-network.md`, now built in `kits/video/circuit-network/`): it covers chapters 1–6, 8 and 12. The plan follows its README (parallel → R1 top, R2 bottom; mixed → R1 series, R2 top = 6.0 Ω, R3 bottom = 12.0 Ω; the kit computes dot speed from E, r, n, arr and R1–R3).
