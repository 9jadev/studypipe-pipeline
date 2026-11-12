# Direction Script: Lesson 02 · EMF, Terminal P.D. & Internal Resistance

## Overview
The video resolves the unit mystery's first clue: why Emeka's keke battery reads 12.0 V at rest but 8.4 V on Nkechi's 2.8 Ω starter test load (I = 3.0 A), and where the 3.6 V goes. It builds EMF vs terminal p.d., internal resistance and lost volts (inside the lead–acid cell), the energy tollgate, E = I(R + r) and V = E − Ir, then works Example 1 (the mystery battery: I = 3.0 A, lost volts 3.6 V, r = 1.2 Ω), reads E (intercept) and r (−gradient) from the virtual-lab V–I line (E = 6.0 V, r = 1.5 Ω), and works Example 2 (two readings, same cell: r = 1.0 Ω, E = 4.0 V). It opens the **Make Sense** phase, after the bench; Worked Example 3 and the quiz stay in Apply.

| Item | Decision |
| --- | --- |
| Running time | About 12.4 minutes on the build timeline (1587 words, 9 chapters, 65 narration lines; inside the 14 minute limit) |
| Narrator | One teacher voice, Nigerian English |
| Level | SS2 Physics, WAEC / NECO / JAMB |
| Theme | Unit theme (`meta.theme` unset; follows `editorial-ink`) |
| Kits used | built-in `circuit` (bench, ghost arc, internal r, loss label, tick), `cell` (lead–acid cross-section, ions, drag, r label, worn plates, heat), `toll` (energy tollgate, symbols then numbers), `graph` (straight V–I line: V = E − Ir is linear). No KIT GAP. |
| Camera | Wide by default; kit close-up drift entering the cell and on the tollgate intro; board shots for every worked step; push-ins on the voltmeter, ammeter, battery, r label, intercept, gradient triangle and I(sc) |
| End card | `next: '#apply'`, "Continue to Apply →" |

**Colour roles:** E = EMF (gold) · V = terminal p.d. (blue) · v / Ir = lost volts (red) · r = internal resistance (orange) · I = current (green).

**Accuracy notes:**
- All mystery numbers match 02-lesson.md exactly: E = 12.0 V, r = 1.2 Ω, 2.8 Ω starter test load, I = 3.0 A, terminal p.d. 8.4 V, lost volts 3.6 V.
- Realism (from the unit's case-file note): a real keke starter draws far more current; line 1.3 says the 2.8 Ω test load is a stand-in that keeps the numbers simple. Line 6.8 says 1.2 Ω is huge for a lead–acid battery (a healthy one has a small fraction of an ohm), so the battery is called worn, not normal.
- EMF defined both ways WAEC accepts: energy given to each coulomb round the whole circuit, and terminal p.d. on open circuit.
- The tollgate analogy's limit is stated (line 4.4: charges carry energy, not coins). The "volts lost in the wires" misconception is answered in 3.7.
- V–I graph: the virtual-lab expected readings (0.50, 5.25) … (2.50, 2.25) for E = 6.0 V, r = 1.5 Ω; a straight line (the physics is linear), large gradient triangle from 0.50 A to 2.50 A, I(sc) = E/r = 4.0 A with a safety line.
- **Your-turn numbers are fresh:** 12.6 V (open circuit) and 11.2 V (on load), answers 1.4 V lost volts and 0.35 Ω, were grepped and appear nowhere in 02-lesson.md or 03-questions.md (no worked example, Do Now, bench table, exit ticket, MCQ or Part A/B item). The question deliberately reuses Nkechi's 2.8 Ω test load (the story's fixed load, not a question value) so the new battery's 1.4 V loss compares directly with Emeka's 3.6 V; the derived current 4.0 A is incidental. The Reflect exit ticket (7.5 V, 0.40 Ω, 2.1 Ω) is not given away.
## Chapter 1: The keke battery mystery

| # | Narration | On screen |
| --- | --- | --- |
| 1.1 | On Ngwa Road in Aba, Emeka the keke rider brings his battery to Engineer Nkechi's workshop. It was charged last week, but now the engine starts weakly. | New board: "Nkechi's workshop, Aba"<br>Kit circuit: sw=0, A=0, V=12, R=2.8 Ω, bat=12 V, amax=5, vmax=15 |
| 1.2 | Chinedu clips a voltmeter across the resting battery. No current flows, and the meter reads twelve point zero volts. | Kit circuit: focus=V<br>Board: at rest: voltmeter = 12.0 V<br>📷 WIDE → V |
| 1.3 | Nkechi switches in her two point eight ohm starter test load. A real starter draws far more, but this keeps the numbers simple. The ammeter reads three point zero amps. | Kit circuit: sw=1, A=3, focus=A<br>Board: on load: I = 3.0 A<br>📷 WIDE → A |
| 1.4 | Now look at the voltmeter. It crashes to eight point four volts, and the headlamp dims. | Kit circuit: V=8.4, ghost=1, ghostTo=12, focus=V<br>Board: on load: voltmeter = 8.4 V<br>📷 WIDE → V |
| 1.5 | Twelve point zero minus eight point four is three point six volts. So where did those three point six volts go? | Board: 12.0 - 8.4 = 3.6 V ?<br>Box h4<br>Highlight v<br>📷 WIDE |
| 1.6 | Tobe says the battery has lost its voltage, so dump it. Nkechi says, measure it a cleverer way before you throw it away. | New board: "Who is right?"<br>Board: Tobe: "it is finished"<br>Board: Nkechi: "measure it first" |
| 1.7 | By the end, you will find the missing volts, work out the battery's hidden internal resistance, and get E and r from a graph or from two readings. | New board: "By the end of this video"<br>Kit panel off<br>Board: ☐ find the lost volts<br>Board: ☐ find r of the battery<br>Board: ☐ E and r from a graph<br>Board: ☐ E and r from two readings |

## Chapter 2: Two kinds of voltage

| # | Narration | On screen |
| --- | --- | --- |
| 2.1 | We need two ideas of voltage. The first is the electromotive force, or E M F, capital E. It is the total energy the battery gives to each coulomb it drives round the whole circuit. | New board: "Two kinds of voltage"<br>Board: E = energy per coulomb (note: J/C = V)<br>Highlight E |
| 2.2 | For Emeka's battery, E is twelve point zero volts. Every coulomb gets twelve point zero joules from the chemical reactions inside. | Kit toll: stage=1, nums=1, values=12+3.6+8.4<br>Board: E = 12.0 J per coulomb<br>📷 WIDE → source |
| 2.3 | The second is the terminal potential difference, capital V. It is the p.d. across the battery's terminals, the energy per coulomb left for the outside circuit. | Kit circuit: sw=0, A=0, V=12, R=2.8 Ω, bat=12 V, amax=5, vmax=15, focus=term<br>Board: V = p.d. across the terminals<br>Highlight V<br>📷 WIDE |
| 2.4 | With the switch open, no current flows, so nothing is used up inside, and the terminal p.d. equals the E M F, twelve point zero volts. | Kit circuit: focus=V<br>Board: I = 0 ⇒ V = E = 12.0 V<br>📷 WIDE → V |
| 2.5 | That gives the exam definition. The E M F of a cell is the p.d. across its terminals when it is not delivering current, that is, on open circuit. | New board: "Open circuit vs on load"<br>Board: EMF = terminal p.d. on open circuit<br>Box d5<br>📷 WIDE |
| 2.6 | Close the switch and current flows. Now the terminal p.d. is less than the E M F. Something inside the battery takes a share. | Kit circuit: sw=1, A=3, V=8.4, focus=bat<br>Board: I > 0 ⇒ V < E<br>📷 WIDE → bat |
| 2.7 | So Tobe is wrong. The E M F has not fallen. The question is where part of it is spent. | Board: E is still 12.0 V (note: Tobe is wrong)<br>Highlight E<br>📷 WIDE |

## Chapter 3: Inside the battery

| # | Narration | On screen |
| --- | --- | --- |
| 3.1 | Let's go inside the battery. | New board: "Inside the battery"<br>Kit cell: labels=0, ions=0, drag=0, rlabel=0, worn=0, heat=0<br>📷 KIT CLOSE-UP · slow drift |
| 3.2 | A lead acid cell has a lead plate and a lead dioxide plate in dilute sulfuric acid. Reactions at the plates give each coulomb its energy. | Kit cell: labels=1<br>Board: plates in dilute sulfuric acid<br>📷 WIDE |
| 3.3 | But the current must also pass through the battery itself, through the acid and the plates. That material opposes it, like any resistor. This is the internal resistance, small r. | Kit cell: ions=1<br>Board: current flows through it too<br>Kit cell: drag=1, rlabel=1<br>Board: internal resistance: r<br>Highlight r<br>📷 WIDE → r |
| 3.4 | In a tired battery like Emeka's, the plates are worn and coated, so the internal resistance is much larger than in a new one. | Kit cell: worn=1<br>Board: worn plates ⇒ large r<br>📷 WIDE → neg |
| 3.5 | Pushing current through r costs energy, and that energy becomes heat inside. That is why a battery feels warm under heavy load. | Kit cell: heat=1<br>New board: "Lost volts"<br>Board: energy lost inside → heat<br>📷 WIDE → acid |
| 3.6 | The p.d. used up inside is called the lost volts, small v. Like any resistor, r obeys Ohm's law, so small v equals I times small r. | Board: v = Ir (note: lost volts)<br>Box c6<br>Highlight v, r<br>📷 WIDE |
| 3.7 | And the wires? Their resistance is tiny. The missing volts are spent inside the battery, not in the wires. | Board: not in the wires: inside! |

## Chapter 4: The energy tollgate

| # | Narration | On screen |
| --- | --- | --- |
| 4.1 | Here is a picture. Think of each coulomb as a traveller on a toll road. At the source, it receives E joules. That is the E M F. | New board: "The energy tollgate"<br>Kit toll: stage=0, nums=0<br>Kit toll: stage=1<br>Board: receives at the source: E<br>📷 WIDE → source |
| 4.2 | Before it leaves the battery, it pays a toll at the internal gate, I r joules. That toll is the lost volts. | Kit toll: stage=2<br>Board: pays inside: Ir<br>📷 WIDE → toll |
| 4.3 | Whatever is left, it spends in the outside circuit, on the headlamp or the starter. That is I times capital R, the terminal p.d. | Kit toll: stage=3<br>Board: spends outside: IR<br>📷 WIDE → load |
| 4.4 | Every joule is accounted for. What the source gives equals the toll plus what is spent outside. It is only a picture: charges carry energy, not coins. | Kit toll: stage=4<br>Board: E = Ir + IR<br>Box k4<br>📷 WIDE |

## Chapter 5: The complete circuit equation

| # | Narration | On screen |
| --- | --- | --- |
| 5.1 | Now turn the toll road into an equation. The E M F equals the terminal p.d. plus the lost volts. | New board: "The circuit equation"<br>Kit panel off<br>Board: E = V + v |
| 5.2 | Capital V drives the current through the outside load, so it is I R. Small v drives the same current through r, so it is I r. | Board: E = IR + Ir<br>Highlight V, v |
| 5.3 | The same current flows through both, so factorise. E equals I, times R plus r. | Board: E = I(R + r)<br>Box q3<br>Highlight I |
| 5.4 | Rearrange for the current. I equals E over R plus r: the load outside plus the battery's own inside. | Board: I = ER + r<br>Box q4<br>Kit circuit: sw=1, A=3, V=8.4, R=2.8 Ω, bat=12 V, amax=5, vmax=15, showr=1, bracket=1 |
| 5.5 | One more form you will use often. V equals E minus I r. So the bigger the current, the bigger the lost volts, and the smaller the terminal p.d. | New board: "Terminal p.d."<br>Board: V = E - Ir<br>Box q5<br>Board: bigger I ⇒ smaller V<br>📷 WIDE → V |

## Chapter 6: Solving Emeka's mystery

| # | Narration | On screen |
| --- | --- | --- |
| 6.1 | Worked example one. Emeka's battery reads twelve point zero volts on open circuit, and eight point four volts on the two point eight ohm load. Find the current, the lost volts, and r. | New board: "Example 1: the keke battery"<br>Kit circuit: sw=1, A=3, V=8.4, R=2.8 Ω, bat=12 V, amax=5, vmax=15<br>📷 WIDE<br>Board: E = 12.0 V, V = 8.4 V<br>Board: R = 2.8 Ω |
| 6.2 | Step one. The current, from the load. I equals V over R, eight point four over two point eight, which is three point zero amps. That matches the ammeter. | Board: I = (V)/(R) = (8.4)/(2.8) (note: step 1)<br>Board: I = 3.0 A<br>Kit circuit: focus=A, tickA=1<br>📷 BOARD SHOT |
| 6.3 | Step two. The lost volts. Small v equals E minus V, twelve point zero minus eight point four, which is three point six volts. | New board: "Example 1: steps 2 and 3"<br>Kit circuit: focus=null, tickA=0<br>Board: v = E - V (note: step 2)<br>Board: v = 12.0 - 8.4 = 3.6 V<br>📷 BOARD SHOT |
| 6.4 | There they are. The missing three point six volts were used up inside the battery, across its internal resistance. | Kit circuit: showr=1, loss=3.6 V lost inside, focus=bat<br>Highlight v<br>📷 KIT CLOSE-UP → bat (1.3s) |
| 6.5 | Step three. The internal resistance. Small r equals v over I, three point six over three point zero, which is one point two ohms. | Board: r = (v)/(I) = (3.6)/(3.0) (note: step 3)<br>Board: r = 1.2 Ω<br>Box x5b<br>📷 BOARD SHOT |
| 6.6 | Check. Three point zero, times two point eight plus one point two, is three point zero times four point zero, twelve point zero volts. It works. | Board: 3.0(2.8 + 1.2) = 12.0 V ✓ |
| 6.7 | So each coulomb gets twelve point zero joules, pays three point six joules as heat inside, and delivers eight point four joules to the load. | New board: "Where the energy goes"<br>Kit toll: stage=4, nums=1, values=12+3.6+8.4<br>Board: 12.0 J = 3.6 J + 8.4 J<br>Box x7<br>📷 WIDE |
| 6.8 | One point two ohms is huge; a healthy battery has a small fraction of an ohm. Nkechi's verdict: the E M F is fine, the inside is worn. | Board: r = 1.2 Ω: worn inside (note: healthy: tiny r)<br>Highlight r |

## Chapter 7: The V–I graph

| # | Narration | On screen |
| --- | --- | --- |
| 7.1 | Look again at V equals E minus I r. Does it look like a straight line, y equals m x plus c? The intercept c is E, and the gradient m is minus r. | New board: "The V–I graph"<br>Kit panel off<br>Board: V = E - rI<br>Board: y = c + mx<br>Board: intercept = E, gradient = -r<br>Highlight E, r |
| 7.2 | Here are our virtual lab readings: one cell, five loads, V up the side, I along the bottom. Zero point five zero amps gives five point two five volts. | Kit graph [bench]: show=pts<br>📷 WIDE |
| 7.3 | They lie on a straight line. Draw it and extend it back to the V axis. | Kit graph: show=pts+line |
| 7.4 | The vertical intercept, where I is zero, is the E M F. Six point zero volts. | New board: "Reading the graph"<br>Kit graph: show=pts+line+E<br>Board: E = 6.0 V (note: intercept)<br>📷 WIDE → E |
| 7.5 | For the gradient, use a big triangle. From zero point five zero to two point five zero amps, V falls by three point zero volts over two point zero amps. The gradient is minus one point five. | Kit graph: show=pts+line+E+grad<br>Board: gradient = (-3.0)/(2.0) = -1.5<br>📷 WIDE → grad |
| 7.6 | So the internal resistance is one point five ohms. Notice that r is positive. Only the gradient is negative. | Kit graph: show=pts+line+E+grad+gradtxt<br>Board: r = 1.5 Ω<br>Box g6<br>Highlight r<br>📷 WIDE |
| 7.7 | Where the line meets the I axis, V is zero. That is the short circuit current, E over r, six point zero over one point five, four point zero amps. Never short a battery: it overheats. | New board: "Short-circuit current"<br>Kit graph: show=pts+line+E+grad+gradtxt+isc<br>Board: I_sc = (E)/(r) = (6.0)/(1.5)<br>Board: I_sc = 4.0 A<br>Board: never short-circuit a battery (note: safety)<br>📷 WIDE → isc |

## Chapter 8: Two readings, same cell

| # | Narration | On screen |
| --- | --- | --- |
| 8.1 | No graph? Two readings are enough. Connect the same cell to two different lamps, one at a time, and read the current each time. | New board: "Two readings, same cell"<br>Kit circuit: sw=1, A=0.8, V=3.2, R=4.0 Ω, bat=cell, amax=1, vmax=5<br>Kit circuit: R=7.0 Ω, A=0.5, V=3.5<br>📷 WIDE → A |
| 8.2 | Worked example two. A cell drives zero point eight zero amps through a four point zero ohm lamp, and zero point five zero amps through a seven point zero ohm lamp. Find r and E. | Board: I_1 = 0.80 A, R_1 = 4.0 Ω<br>Board: I_2 = 0.50 A, R_2 = 7.0 Ω<br>📷 WIDE |
| 8.3 | The key idea: it is the same cell, so E and r do not change. Only the load and the current change. | Board: same cell: E, r fixed (note: the key idea)<br>Highlight E, r |
| 8.4 | So write E equals I, times R plus r, for each reading, and set the two equal. | New board: "Example 2"<br>Board: E = 0.80(4.0 + r)<br>Board: E = 0.50(7.0 + r)<br>Board: 0.80(4.0 + r) = 0.50(7.0 + r)<br>📷 BOARD SHOT |
| 8.5 | Expand both sides. Three point two plus zero point eight zero r equals three point five plus zero point five zero r. | New board: "Example 2: solve for r"<br>Board: 3.2 + 0.80r = 3.5 + 0.50r |
| 8.6 | Collect like terms. Zero point three zero r equals zero point three zero, so r equals one point zero ohm. | Board: 0.30r = 0.30<br>Board: r = 1.0 Ω<br>Box w9 |
| 8.7 | Substitute back. E equals zero point eight zero, times four point zero plus one point zero. That is zero point eight zero times five point zero, which is four point zero volts. | Board: E = 0.80(4.0 + 1.0)<br>Board: E = 4.0 V<br>Box w10b |
| 8.8 | Check the other reading: zero point five zero, times seven point zero plus one point zero, is also four point zero volts. And both voltmeter readings, three point two and three point five volts, sit below it. | Board: 0.50(7.0 + 1.0) = 4.0 V ✓<br>Kit circuit: focus=V |

## Chapter 9: Mistakes, summary and your turn

| # | Narration | On screen |
| --- | --- | --- |
| 9.1 | Here are the mistakes that cost marks in WAEC and NECO. | New board: "Common mistakes"<br>Kit panel off<br>📷 WIDE |
| 9.2 | One. Writing I equals E over R and forgetting r. The current is E over R plus r. | Board: × I = (E)/(R) ✓ I = (E)/(R + r) |
| 9.3 | Two. Saying a voltmeter across a battery always reads the E M F. It reads E only when no current flows. | Board: reads E only when I = 0 |
| 9.4 | Three. Giving r as a negative number. The gradient is minus r, but r itself is positive. | Board: gradient = -r, r > 0 |
| 9.5 | To sum up. The E M F is the energy per coulomb, and it equals the terminal p.d. on open circuit. | New board: "Summary"<br>Board: E = V on open circuit |
| 9.6 | On load, E equals V plus the lost volts, which is I times R plus r. | Board: E = V + Ir = I(R + r) |
| 9.7 | The terminal p.d. is E minus I r. On a V I graph, the intercept is E and the gradient is minus r. Or use two readings. | Board: V = E - Ir<br>Board: intercept E, gradient -r<br>Board: two readings → E, r |
| 9.8 | Your turn. Nkechi fits a brand new battery. On open circuit it reads twelve point six volts. On the same two point eight ohm test load, it reads eleven point two volts. Find the current, the lost volts, and r. Pause and try. | New board: "Your turn"<br>Board: E = 12.6 V, V = 11.2 V<br>Board: R = 2.8 Ω<br>Board: Find I, v, r<br>Pause-and-try countdown 15 s |
| 9.9 | Here is the solution. I equals V over R, eleven point two over two point eight, which is four point zero amps. | New board: "Solution"<br>Board: I = (11.2)/(2.8) = 4.0 A |
| 9.10 | The lost volts are twelve point six minus eleven point two, which is one point four volts. | Board: v = 12.6 - 11.2 = 1.4 V |
| 9.11 | So r is one point four over four point zero, which is zero point three five ohms. Check: four point zero, times three point one five, is twelve point six. It works. | Board: r = (1.4)/(4.0) = 0.35 Ω<br>Box y6<br>Board: 4.0(2.8 + 0.35) = 12.6 ✓ |
| 9.12 | Same load, but the new battery loses only one point four volts, against three point six for Emeka's. Smaller r, fewer lost volts. Next, rebuild Emeka's circuit in Apply. | Kit circuit: sw=1, A=4, V=11.2, R=2.8 Ω, bat=12.6 V, amax=5, vmax=15, showr=1, loss=1.4 V lost inside, focus=bat<br>📷 WIDE → bat |

## Build checks and kit gaps
Every number is verified in `lesson-02.plan.cjs` (39 checks, all pass): 8.4/2.8 = 3.0 A; 12.0 − 8.4 = 3.6 V; open circuit V = E = 12.0 V; 12.0/(2.8 + 1.2) = 3.0 A; 12.0 − 3.0 × 1.2 = 3.0 × 2.8 = 8.4 V; r = 3.6/3.0 = 1.2 Ω; 3.0(2.8 + 1.2) = 12.0 V; 3.6 + 8.4 = 12.0 J; 1.2 Ω ≫ 0.1 Ω (worn); bench points all on V = 6.0 − 1.5I; V(0.50) = 5.25, V(2.50) = 2.25; rise 3.0 V, run 2.0 A, gradient −1.5; I(sc) = 6.0/1.5 = 4.0 A; WE2 3.2, 3.5, 0.30r = 0.30, r = 1.0 Ω, E = 0.80 × 5.0 = 4.0 V, check 0.50 × 8.0 = 4.0 V, voltmeter readings 3.2 V and 3.5 V; your turn 11.2/2.8 = 4.0 A, 12.6 − 11.2 = 1.4 V, 1.4/4.0 = 0.35 Ω, 4.0 × 3.15 = 12.6 V.

Kits: `circuit`, `cell`, `toll`, `graph` (all built-in). No KIT GAP.

Validation: `node scripts/apply-video.mjs … --lesson lesson-02 --check-only` cannot run yet (the unit is not rendered: no `html/assets/css/theme.css`), so the plan was validated with `.agents/skills/explainer-video/scripts/build.cjs <plan> --check-only` (plan valid, all checks pass) and a full standalone test build in the session scratchpad (KaTeX renders, 65 lines, ~12.4 min).
