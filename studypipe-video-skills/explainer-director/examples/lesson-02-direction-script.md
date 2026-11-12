# Direction Script: EMF, Terminal P.D. & Internal Resistance

Lesson 02 · Where do the lost volts go?

| Item | Decision |
| --- | --- |
| Level | Physics SS2–SS3 · WAEC / NECO / JAMB |
| Theme | safari |

**Colour roles:** E = EMF (gold) · V = terminal p.d. (blue) · v = lost volts (red) · r = internal resistance (red) · I = current (green)

## Chapter 1: The Aba mystery

| # | Narration | On screen |
| --- | --- | --- |
| 1.1 | Welcome back to Chinedu's workshop in Aba. Chinedu is testing an old car battery that customers say keeps failing. | New board: "Chinedu's workshop, Aba"<br>Kit circuit: sw=0, A=0, V=12, R=2.8 Ω, bat=12 V, amax=5, vmax=15<br>Board: An old 12 V car battery |
| 1.2 | With the switch open, no current flows. The voltmeter across the battery reads twelve point zero volts. | Kit circuit: focus=V<br>Board: Switch open: I = 0<br>Board: voltmeter = 12.0 V |
| 1.3 | Now Chinedu closes the switch. Current flows through the two point eight ohm load, and the ammeter reads three point zero amps. | Kit circuit: sw=1, A=3, focus=A<br>Board: Switch closed: I = 3.0 A |
| 1.4 | But look at the voltmeter. It has dropped to eight point four volts. | Kit circuit: V=8.4, ghost=1, ghostTo=12, focus=V<br>Board: voltmeter = 8.4 V |
| 1.5 | The battery didn't change. The wires didn't change. So where did three point six volts go? | Board: 12.0 - 8.4 = 3.6 V ?<br>Box h6<br>Highlight v |
| 1.6 | By the end of this video, you'll be able to find those missing volts, and calculate the battery's hidden internal resistance, without ever cutting it open. | New board: "By the end of this video"<br>Kit panel off<br>Board: ☐ Find the lost volts<br>Board: ☐ Find E and r from two readings |

## Chapter 2: EMF and terminal p.d.

| # | Narration | On screen |
| --- | --- | --- |
| 2.1 | To solve this, we need two different ideas of voltage. | New board: "Two kinds of voltage" |
| 2.2 | The first is the electromotive force, or E M F, written as capital E. It is the energy the battery gives to each coulomb of charge that passes through it. | Board: E = energy given to each coulomb (note: unit: J/C = V)<br>Highlight E |
| 2.3 | For this battery, E is twelve volts. Every coulomb leaving the chemical reactions carries twelve joules of energy. | Kit toll: stage=1, nums=0<br>Board: E = 12 J per coulomb = 12 V |
| 2.4 | The second idea is the terminal potential difference, written as capital V. It is the voltage across the battery's terminals, the voltage the outside circuit actually receives. | Kit circuit: sw=0, A=0, V=12, ghost=0, focus=term<br>Board: V = p.d. across the terminals<br>Highlight V |
| 2.5 | When no current flows, nothing is lost inside the battery, so the terminal p.d. equals the E M F. That's why the voltmeter read twelve volts with the switch open. | Kit circuit: focus=V<br>Board: I = 0 ⇒ V = E = 12.0 V |
| 2.6 | This gives the exam definition. The E M F of a cell is the potential difference across its terminals when it is not delivering current. | Board: EMF = terminal p.d. on open circuit<br>Box d5 |
| 2.7 | When current flows, the terminal p.d. is less than the E M F. Something inside the battery takes a share. | Kit circuit: sw=1, A=3, V=8.4, focus=bat<br>Board: I > 0 ⇒ V < E |

## Chapter 3: Inside the battery

| # | Narration | On screen |
| --- | --- | --- |
| 3.1 | Let's go inside the battery. | New board: "Inside the battery"<br>Kit cell: labels=0, ions=0, drag=0, rlabel=0, worn=0, heat=0 |
| 3.2 | A car battery contains lead plates standing in sulfuric acid. The chemical reactions at the plates are what give the charges their energy. | Kit cell: labels=1<br>Board: lead plates in sulfuric acid |
| 3.3 | But to complete the circuit, current must also flow through the battery itself: through the acid and the plates. | Kit cell: ions=1<br>Board: current flows through the battery too |
| 3.4 | That material resists the flow, just like any resistor. We call this the internal resistance of the battery, written as small r. | Kit cell: drag=1, rlabel=1<br>Board: internal resistance: r<br>Highlight r |
| 3.5 | In an old, worn-out battery like Chinedu's, the plates are damaged, so the internal resistance becomes much larger. | Kit cell: worn=1<br>Board: worn plates ⇒ large r |
| 3.6 | Pushing current through this internal resistance uses up some of each coulomb's energy, and it becomes heat. That's why a battery gets warm when it delivers a large current. | Kit cell: heat=1<br>Board: energy lost inside → heat |
| 3.7 | The voltage used up inside the battery is called the lost volts, small v. Like any resistor, it follows Ohm's law: v equals I times r. | Board: v = Ir (note: lost volts)<br>Box c6<br>Highlight v, r |
| 3.8 | Here's a way to picture it. Think of each coulomb as a traveller on a toll road. | New board: "The energy tollgate"<br>Kit toll: stage=0, nums=0 |
| 3.9 | At the source, every coulomb receives twelve joules. That's the E M F. | Kit toll: stage=1<br>Board: receives at the source: E |
| 3.10 | Before it can leave the battery, it pays a toll at the internal gate. That toll is the lost volts. | Kit toll: stage=2<br>Board: pays a toll inside: Ir |
| 3.11 | Whatever is left, it spends in the external circuit, lighting lamps or running motors. That's the terminal p.d. | Kit toll: stage=3<br>Board: spends outside: IR |
| 3.12 | Every joule is accounted for. What the source gives equals the toll, plus what is spent outside. | Kit toll: stage=4<br>Board: 12 J = toll + spent outside<br>Box t4 |

## Chapter 4: The complete circuit equation

| # | Narration | On screen |
| --- | --- | --- |
| 4.1 | Now let's turn the toll road into an equation. | New board: "The complete circuit equation"<br>Kit panel off |
| 4.2 | The E M F equals the terminal p.d. plus the lost volts. E equals V plus small v. | Board: E = V + v |
| 4.3 | The terminal p.d. drives current through the external load, so V equals I times capital R. The lost volts drive the same current through the internal resistance, so small v equals I times small r. | Board: E = IR + Ir<br>Highlight V, v |
| 4.4 | Notice the same current flows through both. So we can factorise. E equals I, times R plus r. | Board: E = I(R + r)<br>Highlight I |
| 4.5 | Rearranging gives the current. I equals E, divided by R plus r. | Board: I = ER + r<br>Box q4 |
| 4.6 | Think of it this way: the battery sees a total resistance of R plus r, the outside load plus its own inside. | Kit circuit: sw=1, A=3, V=8.4, ghost=0, focus=null, showr=1, bracket=1, loss= |
| 4.7 | And one more form you'll use often. Since V equals E minus the lost volts, V equals E minus I r. | Board: V = E - Ir<br>Box q5 |

## Chapter 5: Solving the Aba mystery

| # | Narration | On screen |
| --- | --- | --- |
| 5.1 | Back to Chinedu's battery. We know E is twelve point zero volts, the terminal p.d. is eight point four volts, and the load is two point eight ohms. | New board: "Example 2.1: the Aba mystery"<br>Kit circuit: sw=1, A=3, V=8.4, R=2.8 Ω, bat=12 V, amax=5, vmax=15, showr=0, bracket=0, focus=null, ghost=0, loss=, tickA=0<br>Board: E = 12.0 V, V = 8.4 V, R = 2.8 Ω |
| 5.2 | Step one. Find the current from the external load. I equals V over R, eight point four over two point eight, which is three point zero amps. | Board: I = (V)/(R) = (8.4)/(2.8) = 3.0 A (note: step 1) |
| 5.3 | That matches the ammeter reading. Good. | Kit circuit: focus=A, tickA=1 |
| 5.4 | Step two. Find the lost volts. v equals E minus V, twelve point zero minus eight point four, which is three point six volts. | Board: v = E - V = 12.0 - 8.4 = 3.6 V (note: step 2)<br>Kit circuit: focus=null, tickA=0 |
| 5.5 | There they are: the missing three point six volts were used up inside the battery. | Kit circuit: loss=3.6 V lost inside, focus=bat<br>Highlight v |
| 5.6 | Step three. Find the internal resistance. r equals v over I, three point six over three point zero, which is one point two ohms. | Board: r = (v)/(I) = (3.6)/(3.0) = 1.2 Ω (note: step 3)<br>Box x4 |
| 5.7 | Let's check with the complete circuit equation. I equals E over R plus r: twelve over two point eight plus one point two, which is twelve over four, three amps. It works. | Board: I = (12.0)/(2.8 + 1.2) = (12.0)/(4.0) = 3.0 A ✓ |
| 5.8 | Each coulomb gets twelve joules, pays three point six joules as heat inside the battery, and delivers eight point four joules to the load. | Kit toll: stage=4, nums=1<br>Board: 12 J = 3.6 J + 8.4 J<br>Box x6 |

## Chapter 6: The V–I graph

| # | Narration | On screen |
| --- | --- | --- |
| 6.1 | Look at V equals E minus I r again. Does it remind you of a straight line, y equals m x plus c? | New board: "The V–I graph"<br>Kit panel off<br>Board: V = E - rI<br>Board: y = mx + c |
| 6.2 | Rewrite it as V equals minus r times I, plus E. If we plot V on the vertical axis against I on the horizontal axis, we get a straight line. | Board: V = -r I + E<br>Kit graph [aba]: show= |
| 6.3 | Here is Chinedu's battery. When no current flows, V is twelve volts. At three amps, V is eight point four volts. | Kit graph: show=pts<br>Kit graph: show=pts+line |
| 6.4 | The vertical intercept, where I is zero, is the E M F. Twelve volts. | Kit graph: show=pts+line+E<br>Board: vertical intercept = E = 12.0 V |
| 6.5 | The gradient is minus r. The line falls three point six volts over three amps, so the gradient is minus one point two. The internal resistance is one point two ohms. Same answer as before. | Kit graph: show=pts+line+E+grad+gradtxt<br>Board: gradient = (-3.6)/(3.0) = -1.2 ⇒ r = 1.2 Ω |
| 6.6 | Where the line meets the horizontal axis, V is zero. That's the short-circuit current, when the terminals are joined by a wire with almost no resistance. I equals E over r, twelve over one point two, ten amps. | Kit graph: show=pts+line+E+grad+gradtxt+isc<br>Board: I_sc = (E)/(r) = (12.0)/(1.2) = 10 A |
| 6.7 | Never short-circuit a battery. All of that energy turns to heat inside it. | Board: Never short-circuit a battery! (note: safety) |
| 6.8 | Now Example 2.3. A cell's V I graph has a vertical intercept of six point zero volts, and a horizontal intercept of four point zero amps. Find r, and the terminal p.d. when the current is one point two amps. | New board: "Example 2.3"<br>Kit graph [ex23]: show=line+E+isc<br>Board: intercepts: V = 6.0 V, I = 4.0 A<br>Board: Find r, and V when I = 1.2 A |
| 6.9 | The vertical intercept gives E equals six point zero volts. The horizontal intercept is the short-circuit current, so r equals E over I s c: six over four, one point five ohms. | Board: E = 6.0 V<br>Board: r = EI_sc = (6.0)/(4.0) = 1.5 Ω |
| 6.10 | Now the terminal p.d. at one point two amps. V equals E minus I r: six minus one point two times one point five, which is six minus one point eight, four point two volts. | Board: V = 6.0 - (1.2)(1.5) = 6.0 - 1.8 = 4.2 V<br>Box e5<br>Kit graph: show=line+E+isc+guide+pt, pulse=pt |
| 6.11 | And the point one point two, four point two lies exactly on the line, as it should. | Board: (1.2, 4.2) lies on the line ✓ |

## Chapter 7: Two readings, same cell

| # | Narration | On screen |
| --- | --- | --- |
| 7.1 | Remember the question from the start: how can we find E and r without cutting the battery open? Here's the method examiners love. | New board: "Two readings, same cell"<br>Kit circuit: sw=1, A=0.8, V=3.2, R=4.0 Ω, bat=cell, amax=1, vmax=5, showr=0, bracket=0, focus=null, ghost=0, loss=, tickA=0 |
| 7.2 | Connect the same cell to two different resistors, one at a time, and measure the current each time. | Kit circuit: focus=A<br>Kit circuit: R=7.0 Ω, A=0.5, V=3.5 |
| 7.3 | Example 2.2. A cell supplies zero point eight zero amps to a four point zero ohm resistor, and zero point five zero amps to a seven point zero ohm resistor. Find r and E. | Board: I_1 = 0.80 A, R_1 = 4.0 Ω<br>Board: I_2 = 0.50 A, R_2 = 7.0 Ω<br>Kit circuit: focus=null |
| 7.4 | The key idea: it's the same cell, so E and r are the same both times. Only R and I change. | Board: same cell ⇒ E and r do not change (note: the key idea)<br>Highlight E, r |
| 7.5 | Write E equals I, times R plus r, for each reading. Since both equal E, we can set them equal to each other. | New board: "Example 2.2"<br>Board: E = 0.80(4.0 + r)<br>Board: E = 0.50(7.0 + r)<br>Board: 0.80(4.0 + r) = 0.50(7.0 + r) |
| 7.6 | Expand both sides. Three point two plus zero point eight r equals three point five plus zero point five r. | Board: 3.2 + 0.8r = 3.5 + 0.5r |
| 7.7 | Collect the r terms on one side and the numbers on the other. Zero point three r equals zero point three. | Board: 0.8r - 0.5r = 3.5 - 3.2<br>Board: 0.3r = 0.3 |
| 7.8 | So r equals one point zero ohm. | Board: r = 1.0 Ω<br>Box w10 |
| 7.9 | Now substitute back to find E. E equals zero point eight zero, times four point zero plus one point zero, which is four point zero volts. | Board: E = 0.80(4.0 + 1.0) = 0.80 × 5.0 = 4.0 V<br>Box w11 |
| 7.10 | Always check with the other reading: zero point five zero times seven point zero plus one point zero is also four point zero volts. Both readings agree. | Board: 0.50(7.0 + 1.0) = 4.0 V ✓ |
| 7.11 | If you prefer a formula, rearranging gives r equals I two R two, minus I one R one, all over I one minus I two. Use it to check, but in exams, show the simultaneous equation working. | Board: r = (I_2R_2 - I_1R_1)/(I_1 - I_2) = (3.5 - 3.2)/(0.30) = 1.0 Ω (note: check only) |

## Chapter 8: Mistakes, summary and your turn

| # | Narration | On screen |
| --- | --- | --- |
| 8.1 | Here are the mistakes that cost students marks in WAEC and NECO. | New board: "Common mistakes"<br>Kit panel off |
| 8.2 | One. Using I equals E over R, and forgetting the internal resistance. The current is E over R plus r. | Board: × I = (E)/(R) ✓ I = (E)/(R + r) |
| 8.3 | Two. Assuming a voltmeter across a battery always reads the E M F. It only reads E when no current flows. | Board: voltmeter reads E only when I = 0 |
| 8.4 | Three. Getting the sign of the gradient wrong. The V I line slopes down, so the gradient is minus r, and r itself is positive. | Board: gradient = -r, r > 0 |
| 8.5 | Four. Mixing up capital V and small v. Capital V is what the load gets. Small v is what's lost inside. | Board: V: outside v: lost inside |
| 8.6 | To sum up. E M F is the energy given to each coulomb, and it equals the terminal p.d. on open circuit. | New board: "Summary"<br>Board: E = energy per coulomb = V on open circuit |
| 8.7 | When current flows, E equals V plus v, so E equals I, times R plus r. | Board: E = V + v = I(R + r) |
| 8.8 | The terminal p.d. is V equals E minus I r. On a V I graph, the intercept is E and the gradient is minus r. | Board: V = E - Ir: intercept = E, gradient = -r |
| 8.9 | And with two readings from the same cell, solve simultaneous equations to find both E and r. | Board: two readings → simultaneous equations → E, r |
| 8.10 | Now it's your turn. A cell of E M F nine point zero volts and internal resistance zero point five ohms is connected to a four point zero ohm resistor. Find the current, the terminal p.d., and the lost volts. Pause the video and try it. | New board: "Your turn"<br>Board: E = 9.0 V, r = 0.5 Ω, R = 4.0 Ω<br>Board: Find I, V and v<br>Pause-and-try countdown 15 s |
| 8.11 | Here's the solution. I equals E over R plus r: nine over four point five, which is two point zero amps. | Board: I = (9.0)/(4.0 + 0.5) = 2.0 A |
| 8.12 | The terminal p.d. is I R: two times four, which is eight point zero volts. | Board: V = IR = 2.0 × 4.0 = 8.0 V |
| 8.13 | And the lost volts are I r: two times zero point five, one point zero volt. Check: eight plus one is nine. It works. | Board: v = Ir = 2.0 × 0.5 = 1.0 V<br>Board: 8.0 + 1.0 = 9.0 V = E ✓<br>Box y6 |
| 8.14 | Well done. Next, try the Bridge Challenge and the quiz to lock it in. | — |

## Checks

- Aba current 8.4/2.8: expected 3
- Aba lost volts: expected 3.6
- Aba r = 3.6/3.0: expected 1.2
- Aba I = 12/(2.8+1.2): expected 3
- Aba energy 3.6+8.4: expected 12
- Aba line at I=3: expected 8.4
- Aba short circuit 12/1.2: expected 10
- Ex2.3 r = 6/4: expected 1.5
- Ex2.3 V at 1.2 A: expected 4.2
- Ex2.2 r from equation: expected 1
- Ex2.2 E reading 1: expected 4
- Ex2.2 E reading 2: expected 4
- Ex2.2 expansions: expected 3.2
- Ex2.2 expansions: expected 3.5
- Practice I: expected 2
- Practice V: expected 8
- Practice v: expected 1
- Practice V+v: expected 9
- Ex2.2 voltmeter reading 1 (IR): expected 3.2
- Ex2.2 voltmeter reading 2 (IR): expected 3.5

About 12 minutes of narration (1669 words).
