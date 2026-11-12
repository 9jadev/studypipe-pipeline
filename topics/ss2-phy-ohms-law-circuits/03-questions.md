# 03 · Assessment Suite: Ohm's Law and Current Electricity (`ss2-phy-ohms-law-circuits`)

Five lessons × (12 interactive MCQs for `window.LESSON_QUIZ` + Part A home investigation + Part B 30-mark written paper with model solutions and mark-scheme notes). All stems, scenarios and numbers are original; answers are worked out from the physics, not from online keys. The tick symbol marks the correct option.

---

## Lesson 01 · Current, P.D., Ohm's Law & the Resistance of Wires

### Part 1 · 12 Interactive MCQs (`window.LESSON_QUIZ`)

1. **[JAMB-style · Remember]** Chinedu notices that his workshop voltmeter is marked in volts. One volt is the same as
   - **A.** one coulomb per second
   - **B.** one joule per coulomb ✓
   - **C.** one joule per second
   - **D.** one ohm per ampere
   - *Explanation:* Potential difference is energy changed per unit charge, V = W/Q, so 1 V = 1 J ÷ 1 C = 1 J C⁻¹. A (C s⁻¹) is the ampere: the definition of current (I = Q/t) has been mixed up with p.d. C (J s⁻¹) is the watt: power (energy per second) has been confused with energy per coulomb. D comes from rearranging V = IR wrongly: V equals ohms *multiplied by* amperes, not ohms divided by amperes.

2. **[WAEC-style · Apply]** Emeka leaves his keke headlamp on while he waits for a passenger. It draws a steady 1.6 A for 5.0 minutes. How much charge passes through the lamp?
   - **A.** 8.0 C
   - **B.** 187.5 C
   - **C.** 0.32 C
   - **D.** 480 C ✓
   - *Explanation:* Change the time to seconds first: t = 5.0 min × 60 = 300 s. Then Q = It = 1.6 A × 300 s = 480 C. A (8.0 C) multiplies 1.6 by 5.0: the minutes were never converted to seconds. B (187.5 C) divides 300 by 1.6: the formula was turned upside down (t ÷ I instead of I × t). C (0.32 C) divides 1.6 by 5.0, which both inverts the time and leaves it in minutes.

3. **[WAEC-style · Remember]** Engr. Nkechi says Ohm's law applies to a metal wire "only under one condition". Which condition does she mean?
   - **A.** The temperature and other physical conditions of the wire stay the same ✓
   - **B.** The current through the wire is kept below 1 A
   - **C.** The voltmeter is connected in parallel with the wire
   - **D.** The p.d. across the wire is raised in equal steps
   - *Explanation:* The current in a metallic conductor is proportional to the p.d. across it only while its temperature (and physical state) is unchanged; once the wire warms, its resistance rises and V/I is no longer constant. B invents a current limit: a small current matters only because it keeps the wire cool, and there is no fixed 1 A rule. C is a rule for connecting a meter correctly, not a condition for the law itself. D is a way of spreading readings across the range; the law holds whatever steps are chosen.

4. **[WAEC Practical · Analyse]** Tobe tests a small filament lamp on the bench and records (0.10 A, 0.20 V), (0.20 A, 0.60 V) and (0.30 A, 1.35 V). What do these readings show?
   - **A.** The lamp has a constant resistance of 2.0 Ω, so it is ohmic
   - **B.** The lamp's resistance falls as it heats up, so it is non-ohmic
   - **C.** The lamp's resistance rises as the filament heats up, so it is non-ohmic ✓
   - **D.** The lamp obeys Ohm's law, because V increases whenever I increases
   - *Explanation:* Work out V/I for each pair: 0.20 ÷ 0.10 = 2.0 Ω, 0.60 ÷ 0.20 = 3.0 Ω, 1.35 ÷ 0.30 = 4.5 Ω. The ratio is not constant, and it grows as the current (and so the filament temperature) grows, which is non-ohmic behaviour. A used only the first pair and assumed it held for all. B has the trend backwards: falling resistance with temperature describes a thermistor, not a metal filament. D mistakes "both increase" for "directly proportional"; Ohm's law needs V/I to stay the same, not merely to rise together.

5. **[NECO-style · Understand]** In the lesson's sort game, which of these would give a straight-line V–I graph through the origin?
   - **A.** A constantan resistance wire kept at room temperature ✓
   - **B.** A semiconductor diode
   - **C.** A thermistor
   - **D.** Salty water between two copper plates
   - *Explanation:* Constantan is a metal alloy whose resistance hardly changes, so at steady temperature V/I is constant and the graph is a straight line through the origin (ohmic). B, the diode, conducts easily one way and hardly at all the other way, so its graph is far from a straight line. C, the thermistor, loses resistance as it warms, so its graph curves. D, an electrolyte, does not keep V/I constant (gas forms at the plates and the solution changes), so it is non-ohmic as well.

6. **[JAMB-style · Apply]** Wires P and Q are made of the same alloy. Q is three times as long as P and has half its diameter. The resistance of P is 2.0 Ω. What is the resistance of Q?
   - **A.** 3.0 Ω
   - **B.** 24 Ω ✓
   - **C.** 12 Ω
   - **D.** 1.5 Ω
   - *Explanation:* R ∝ L/d². Tripling the length multiplies R by 3; halving the diameter makes the area one quarter, which multiplies R by 2² = 4. So R_Q = 2.0 × 3 × 4 = 24 Ω. A (3.0 Ω) simply multiplied by the length ratio and divided by the diameter ratio ("× 3 ÷ 2"), treating a smaller diameter as lowering R. C (12 Ω) used R ∝ 1/d instead of 1/d² (2.0 × 3 × 2). D (1.5 Ω) squared the diameter ratio the wrong way up (2.0 × 3 × ¼), as if a thinner wire had less resistance.

7. **[WAEC-style · Apply]** Chinedu fits a new copper battery lead 5.0 m long with a cross-sectional area of 2.5 mm². Copper has a resistivity of 1.7 × 10⁻⁸ Ω m. What is the resistance of the lead?
   - **A.** 1.4 × 10⁻³ Ω
   - **B.** 3.4 × 10⁻⁵ Ω
   - **C.** 8.5 × 10⁻¹⁵ Ω
   - **D.** 3.4 × 10⁻² Ω ✓
   - *Explanation:* Convert the area first: 1 mm² = 10⁻⁶ m², so A = 2.5 × 10⁻⁶ m². Then R = ρL/A = (1.7 × 10⁻⁸ × 5.0) ÷ (2.5 × 10⁻⁶) = (8.5 × 10⁻⁸) ÷ (2.5 × 10⁻⁶) = 3.4 × 10⁻² Ω (0.034 Ω). A divided ρ by both L and A (ρ/LA) instead of multiplying by L. B converted mm² to m² with 10⁻³ (the factor for mm to m) instead of 10⁻⁶. C multiplied by the area and divided by the length (ρA/L), turning the formula inside out.

8. **[WAEC Practical · Analyse]** On Chinedu's V–I graph for a coil, with V on the vertical axis, the line of best fit passes through the origin and through the points (0.30 A, 1.05 V) and (1.20 A, 4.20 V). What is the resistance of the coil?
   - **A.** 0.29 Ω
   - **B.** 4.0 Ω
   - **C.** 3.5 Ω ✓
   - **D.** 3.15 Ω
   - *Explanation:* The slope of a V–I graph is the resistance: R = ΔV/ΔI = (4.20 − 1.05) ÷ (1.20 − 0.30) = 3.15 ÷ 0.90 = 3.5 Ω. A (0.29 Ω) is ΔI/ΔV, the slope turned upside down. B (4.0) divides one voltage by the other (4.20 ÷ 1.05), a ratio with no unit, not a resistance. D (3.15) is ΔV on its own: the student forgot to divide by ΔI.

9. **[WAEC Practical · Analyse]** During the V–I practical, Tobe left the plug key closed for the whole session, and the constantan wire became warm. How did this most likely affect the slope of his V–I graph?
   - **A.** It was too low, because a warm wire has a lower resistance
   - **B.** It was too high, because the warm wire's resistance rose, so the later V readings were too high for their currents ✓
   - **C.** It was unaffected, because Ohm's law holds at any temperature
   - **D.** It was too low, because the ammeter read too high when the wire was warm
   - *Explanation:* In a metal, warming makes the ions vibrate more, so the drifting electrons collide more often and the resistance rises; each later V reading is then bigger than it should be for its current, and the slope (R) comes out too high. A gives the behaviour of a thermistor or semiconductor, not a metal. C forgets Ohm's law's own condition of steady temperature. D gets the meter wrong: a higher resistance gives a *smaller* current for a given p.d., so the ammeter would not read high.

10. **[WAEC-style · Apply]** Emeka has two copper jumper cables of the same length. The thin one has a diameter of 0.50 mm and the thick one 1.50 mm. When each carries the same current, what is the ratio of the heating power in the thin cable to that in the thick cable?
    - **A.** 9 : 1 ✓
    - **B.** 3 : 1
    - **C.** 1 : 9
    - **D.** 81 : 1
    - *Explanation:* R ∝ 1/d², so R_thin : R_thick = (1.50 ÷ 0.50)² = 3² = 9. With the same current, P = I²R, so the power is in the same ratio as the resistance: 9 : 1, and the thin cable runs hot. B used the diameter ratio without squaring it (R ∝ 1/d). C turned the ratio upside down, thinking the thick cable heats more. D squared twice, as if P depended on R² (or on 1/d⁴).

11. **[JAMB-style · Apply]** Nkechi's soldering iron is rated 60 W when it is connected to the 240 V mains. What is the resistance of its element when it is working?
    - **A.** 4.0 Ω
    - **B.** 0.25 Ω
    - **C.** 14 400 Ω
    - **D.** 960 Ω ✓
    - *Explanation:* From P = V²/R, R = V²/P = 240² ÷ 60 = 57 600 ÷ 60 = 960 Ω. (Check: I = P/V = 0.25 A, and R = V/I = 240 ÷ 0.25 = 960 Ω.) A (4.0) is V ÷ P, which is not a resistance formula. B (0.25) is P ÷ V: that is the current in amperes, and the student stopped one step early. C (14 400) multiplied V by P, which has no physical meaning here.

12. **[NECO-style · Understand]** Chinedu wants to halve the resistance of a length of constantan wire without changing the material. Which change does exactly that?
    - **A.** Doubling the length of the wire
    - **B.** Doubling the diameter of the wire
    - **C.** Doubling the cross-sectional area of the wire ✓
    - **D.** Halving the diameter of the wire
    - *Explanation:* R = ρL/A, so R is inversely proportional to the cross-sectional area: doubling A halves R. A doubles the resistance, since R ∝ L. B is the diameter-squared trap: doubling d makes the area four times larger, so R falls to one quarter, not one half. D makes the area one quarter, so R becomes four times larger.

### Part 2 · Home Investigation & 30-Mark Written Paper (Lesson 01)

**Part A · Home Investigation:** *Pencil-line resistors: how do length and width change resistance?*
You need: a soft pencil (2B or softer), a sheet of plain white paper, a 30 cm ruler, and a digital multimeter set to its resistance (Ω or kΩ) range (borrow one from a phone-repair or electrical shop, or from your school). Only the multimeter's own small battery is used; never connect anything to a wall socket or a generator.
1. On the paper, shade a narrow strip about 3 mm wide and 12 cm long. Go over it several times so the graphite is dark and even.
2. Shade a second strip of the same length but about 9 mm wide (three times as wide), using the same pressure and number of passes.
3. Mark both strips at 2, 4, 6, 8 and 10 cm from one end.
4. Hold one multimeter probe firmly on the zero end of the narrow strip and the other at the 2 cm mark. Record the resistance. Repeat at each mark, then do the same on the wide strip.
5. Repeat each reading once more and take the average.
6. Plot resistance (vertical) against length (horizontal) for both strips on one graph.

Sample results table (averages):

| Length L (cm) | Narrow strip R (kΩ) | Wide strip R (kΩ) |
|---|---|---|
| 2.0 | 18 | 6.2 |
| 4.0 | 37 | 12.1 |
| 6.0 | 54 | 18.5 |
| 8.0 | 73 | 24.0 |
| 10.0 | 90 | 30.2 |

*What a good answer shows:* for each strip the resistance rises in proportion to length, so R against L is roughly a straight line through the origin (R ∝ L); the wide strip, with about three times the cross-sectional area, has roughly one third of the narrow strip's resistance at each length (R ∝ 1/A); graphite is a far poorer conductor than copper, which is why the readings are in kilohms. A strong answer links this to the Ngwa Road workshop: Emeka's thin jumper cable has the smaller cross-section, so it has the larger resistance and heats more at the same current. It names one source of error with its direction, for example: pressing a probe harder squeezed it into the graphite and widened the contact, so that reading came out too low; uneven shading left thin patches that made some readings too high and spoiled the straight line.

**Part B · Written Paper (30 marks)**

**b1 · Definitions (3 marks)**
Define: (a) *electric current*; (b) *potential difference* between two points; (c) *resistance* of a conductor.
*Model solution:* (a) Electric current is the rate at which electric charge flows past a point in a circuit, I = Q/t; its unit is the ampere. (1) (b) The potential difference between two points is the electrical energy changed into other forms for every coulomb of charge that moves between them, V = W/Q; its unit is the volt. (1) (c) The resistance of a conductor is the ratio of the p.d. across it to the current through it, R = V/I, a measure of how much it opposes the current; its unit is the ohm. (1)
*Mark scheme note:* Equivalent wordings that keep the key ideas are credited. In (a) "flow of charge" alone, without the idea of *rate* (per unit time), is not credited. In (b) the idea of energy *per unit charge* is required; "the force that pushes current" scores zero. In (c) the ratio V/I (or "opposition to current") must be clear; giving only the unit is not enough.

**b2 · Ohm's Law (3 marks)**
(a) State Ohm's law. (b) State the condition under which it holds. (c) Name one device that does not obey Ohm's law and say how its V–I graph shows this.
*Model solution:* (a) The current through a metallic conductor is directly proportional to the potential difference across its ends. (1) (b) The temperature and other physical conditions of the conductor must stay constant. (1) (c) A filament lamp: its V–I graph is a curve, not a straight line through the origin, because V/I rises as the filament heats (a diode or an electrolyte is also accepted, with its matching graph description). (1)
*Mark scheme note:* Equivalent wordings that keep the key ideas are credited. In (a) "V = IR" on its own is a definition of resistance, not a statement of the law, and is not credited; "directly proportional" is needed. In (b) "keep the current small" is accepted only if it is linked to keeping the temperature steady. In (c) the device and the graph description must both be correct for the mark.

**b3 · Why the Thin Cable Gets Hot (4 marks)**
Chinedu finds that, after a test run, Emeka's thin jumper cable is hot while the thick one of the same length and material is cool, though both carried the same current. Explain this using the idea of free electrons and the equations of the lesson.
*Model solution:* (1) In a metal, the current is carried by free electrons that keep colliding with the vibrating positive ions of the lattice, and each collision passes energy to the ions as heat. (1) (2) The thin cable has a smaller cross-sectional area, and since R = ρL/A it has the larger resistance (R ∝ 1/d²). (1) (3) Both carry the same current, so by P = I²R the thin cable turns electrical energy into heat at the greater rate. (1) (4) As the thin cable warms, its ions vibrate more, its resistance rises further, so it heats even more strongly. (1)
*Mark scheme note:* Each point is credited once; restating point 2 as "thin wires have more resistance" without the area or R = ρL/A link earns no extra mark. Using P = V²/R with the same V for both cables is wrong here (the cables share the same current, not the same p.d.) and point 3 is then not awarded. "The thin wire is poor quality" (Tobe's idea) scores zero.

**b4 · Deriving the Diameter Rule (4 marks)**
A uniform wire of resistivity ρ has length L and diameter d.
(a) Show that its resistance is R = 4ρL/(πd²). (b) Hence show that a wire of the same material and length but twice the diameter has one quarter of the resistance.
*Model solution:* (a) The cross-section is a circle, so A = πr² = π(d/2)² = πd²/4. (1) Substituting into R = ρL/A gives R = ρL ÷ (πd²/4) = 4ρL/(πd²). (1) (b) For the new wire d₂ = 2d, so its area is π(2d)²/4 = 4 × πd²/4, four times the original area. (1) Then R₂ = 4ρL/(π(2d)²) = 4ρL/(4πd²) = ¼ × 4ρL/(πd²) = R/4. (1)
*Mark scheme note:* Writing A = πd² (using the diameter as the radius) loses the first mark and the second unless the error is corrected. In (b) a bare statement "R halves" or "R quarters" without showing (2d)² = 4d² earns no marks; the square of the diameter must appear.

**b5 · Designing a Heater Coil (5 marks)**
For a small bench heater, Nkechi needs a coil of resistance 6.0 Ω made from constantan wire of diameter 0.50 mm. The resistivity of constantan is 4.9 × 10⁻⁷ Ω m. The coil is then connected across a 12.0 V supply of negligible internal resistance.
(a) Calculate the cross-sectional area of the wire. (b) Calculate the length of wire needed. (c) Calculate the current in the coil. (d) Calculate the power of the heater. (e) Calculate the charge that flows through the coil in 2.5 minutes.
*Model solution:* (a) d = 0.50 mm = 5.0 × 10⁻⁴ m; A = πd²/4 = π × (5.0 × 10⁻⁴)² ÷ 4 = 1.96 × 10⁻⁷ m². (1) (b) L = RA/ρ = (6.0 × 1.96 × 10⁻⁷) ÷ (4.9 × 10⁻⁷) = 2.40 m (2.4 m). (1) (c) I = V/R = 12.0 ÷ 6.0 = 2.0 A. (1) (d) P = IV = 2.0 × 12.0 = 24 W. (1) (e) t = 2.5 × 60 = 150 s; Q = It = 2.0 × 150 = 300 C. (1)
*Mark scheme note:* Error carried forward is allowed from (a) to (b) and from (c) to (d) and (e). Using d in millimetres without converting, or using the radius formula with the diameter (π × (5.0 × 10⁻⁴)²), loses (a). In (e) using t = 2.5 (minutes) gives 5.0 C and loses the mark. Answers without units, or with the wrong unit (for example "300 A" or "24 J"), lose that mark.

**b6 · Practical: V–I Graph and Resistivity (6 marks)**
Chinedu tested a resistance wire of length 0.80 m and diameter 0.30 mm and recorded:

| I / A | 0.10 | 0.20 | 0.30 | 0.40 | 0.50 |
|---|---|---|---|---|---|
| V / V | 0.36 | 0.71 | 1.09 | 1.43 | 1.80 |

(a) State the quantity that goes on the vertical axis when you are told to "plot V against I". (b) Explain how the graph shows that the wire obeys Ohm's law. (c) Using a large triangle on the line of best fit, find the resistance of the wire. (d) Calculate the resistivity of the material of the wire.
*Model solution:* (a) V goes on the vertical axis and I on the horizontal axis. (1) (b) The points lie on a straight line that passes through the origin, so V is directly proportional to I (V/I is constant). (1) (c) Using two points on the line far apart, for example (0.05 A, 0.18 V) and (0.50 A, 1.80 V): slope = ΔV/ΔI = (1.80 − 0.18) ÷ (0.50 − 0.05) = 1.62 ÷ 0.45. (1) R = 3.6 Ω (accept 3.5 Ω to 3.7 Ω). (1) (d) A = πd²/4 = π × (3.0 × 10⁻⁴)² ÷ 4 = 7.07 × 10⁻⁸ m². (1) ρ = RA/L = (3.6 × 7.07 × 10⁻⁸) ÷ 0.80 = 3.2 × 10⁻⁷ Ω m. (1)
*Mark scheme note:* A triangle that spans less than half the line, or a slope worked from two table rows instead of the drawn line, loses the first mark in (c). "The graph is straight" without "through the origin" does not earn (b). ΔI/ΔV (0.28) is the slope inverted and loses both (c) marks. In (d) the unit must be Ω m; "Ω/m" or "Ω m²" loses the final mark. Error carried forward from (c) is allowed in (d).

**b7 · Practical: Precautions and Errors (3 marks)**
(a) State two precautions that were taken in the V–I experiment. (b) In one run a terminal screw was loose. State and explain its effect on the measured resistance of the wire, if the loose terminal was between the two points where the voltmeter was connected to the wire.
*Model solution:* (a) Any two, in the past tense: the plug key was opened between readings so the wire did not warm up (1); the connections were tightened and the terminals cleaned (1); the meters were checked for zero error before use (1); each meter was read with the eye directly above the pointer to avoid parallax (1); readings were repeated and spread over the whole range (1). (Maximum 2.) (b) The measured resistance was too high, because the loose contact added extra resistance in series that the voltmeter included, so each V reading was too large for its current. (1)
*Mark scheme note:* Precautions written as commands ("open the key") or in the future tense ("I will avoid parallax") score zero. Vague statements ("I was careful", "errors were avoided") and precautions from other experiments ("draught was avoided") are not accepted. In (b) both the direction (too high) and the reason (extra series resistance in the measured section) are needed for the mark.

**b8 · The Bridge: Settling Tobe's Claim (2 marks)**
Tobe says the hot jumper cable is "just bad quality" and the thick one is "fake copper" because it stays cool. Using the physics of this lesson, give two reasons why both cables can be genuine copper.
*Model solution:* (1) For the same material and length, resistance depends on 1/d², so the thinner cable naturally has a much larger resistance even if both are pure copper. (1) (2) Carrying the same current, the cable with the larger resistance changes more electrical energy into heat (P = I²R), so the thin cable getting hot is expected, not a sign of a fault; the right test is to measure each cable's R and compare it with ρL/A for copper. (1)
*Mark scheme note:* "Thin wires get hot" with no link to resistance or I²R scores zero. A reason that only repeats the first one ("thin means more resistance" twice) earns one mark. Answers saying that copper's resistivity changes with thickness are wrong and are not credited: resistivity is a property of the material, not of the wire's size.

---

## Lesson 02 · EMF, Terminal P.D., Lost Volts & Internal Resistance

### Part 1 · 12 Interactive MCQs (`window.LESSON_QUIZ`)

1. **[WAEC-style · Remember]** Which statement best describes the electromotive force (EMF) of a cell?
   - **A.** The p.d. across the cell's terminals while it is driving a current
   - **B.** The energy wasted inside the cell for each coulomb that passes through it
   - **C.** The total energy the cell gives to each coulomb of charge driven round the whole circuit ✓
   - **D.** The current the cell supplies for each ohm of external resistance
   - *Explanation:* EMF is the full energy per coulomb the source supplies to the complete circuit, inside and outside; it equals the terminal reading only when no current flows. A describes the terminal p.d. (V = E − Ir), which is less than the EMF once current flows. B describes the lost volts (Ir), only the internal share of the energy. D mixes up Ohm's law: current per ohm has no meaning as an energy per coulomb.

2. **[NECO-style · Understand]** Before switching on the starter, Chinedu clips a high-resistance voltmeter across Emeka's resting battery. Why does this reading equal the battery's EMF?
   - **A.** Almost no current flows, so the lost volts Ir inside the battery are practically zero ✓
   - **B.** The battery's internal resistance disappears while the key is open
   - **C.** The voltmeter adds its own EMF to the battery's terminal p.d.
   - **D.** The battery's EMF rises whenever no current is being drawn
   - *Explanation:* With (nearly) zero current, V = E − Ir = E − 0 = E, so the terminals show the full EMF. B is wrong: r belongs to the electrolyte and plates and is always there; what vanishes is the current through it. C is wrong: a voltmeter is not a source and adds no EMF. D is wrong: the EMF is fixed by the cell's chemistry; it is the terminal p.d., not the EMF, that changes with current.

3. **[WAEC-style · Apply]** Emeka's battery (EMF 12.0 V, internal resistance 1.2 Ω) is connected to his 4.8 Ω headlamp alone. What does a voltmeter across the battery terminals read?
   - **A.** 12.0 V
   - **B.** 2.4 V
   - **C.** 9.0 V
   - **D.** 9.6 V ✓
   - *Explanation:* I = E/(R + r) = 12.0 ÷ (4.8 + 1.2) = 12.0 ÷ 6.0 = 2.0 A. Lost volts = Ir = 2.0 × 1.2 = 2.4 V, so V = E − Ir = 12.0 − 2.4 = 9.6 V (check: V = IR = 2.0 × 4.8 = 9.6 V). A ignores the internal resistance and treats the voltmeter as reading the EMF under load. B is the lost volts, not the terminal p.d. C found the current as E/R = 2.5 A (forgot to add r to the circuit resistance), then subtracted 2.5 × 1.2.

4. **[JAMB-style · Apply]** A battery of EMF 9.0 V and internal resistance 0.50 Ω drives a current through a 4.0 Ω resistor. What are the lost volts?
   - **A.** 8.0 V
   - **B.** 1.0 V ✓
   - **C.** 1.125 V
   - **D.** 4.5 V
   - *Explanation:* I = E/(R + r) = 9.0 ÷ 4.5 = 2.0 A; lost volts = Ir = 2.0 × 0.50 = 1.0 V. A (8.0 V) is the terminal p.d. IR, the useful part rather than the lost part. C found I = E/R = 2.25 A (forgot the internal resistance in the total), then multiplied by r. D multiplied the EMF by r (9.0 × 0.50), skipping the current altogether.

5. **[WAEC-style · Apply]** A radio battery of EMF 4.5 V drives a current of 0.60 A through a 6.5 Ω resistor. What is its internal resistance?
   - **A.** 7.5 Ω
   - **B.** 0.60 Ω
   - **C.** 14 Ω
   - **D.** 1.0 Ω ✓
   - *Explanation:* E = I(R + r), so R + r = E/I = 4.5 ÷ 0.60 = 7.5 Ω and r = 7.5 − 6.5 = 1.0 Ω. (Or: terminal p.d. = 0.60 × 6.5 = 3.9 V, lost volts = 0.60 V, r = 0.60 ÷ 0.60 = 1.0 Ω.) A is the total resistance E/I: the student forgot to subtract the external 6.5 Ω. B is the lost volts (0.60 V) written as a resistance, without dividing by the current. C added R to the total (7.5 + 6.5) instead of subtracting it.

6. **[WAEC Practical · Analyse]** With a variable load, a cell's terminal p.d. is 1.40 V when the current is 0.20 A, and 1.10 V when the current is 0.80 A. What are its EMF and internal resistance?
   - **A.** 1.40 V and 0.50 Ω
   - **B.** 1.50 V and 2.0 Ω
   - **C.** 1.50 V and 0.50 Ω ✓
   - **D.** 1.25 V and 0.50 Ω
   - *Explanation:* V = E − Ir, so r = −ΔV/ΔI = (1.40 − 1.10) ÷ (0.80 − 0.20) = 0.30 ÷ 0.60 = 0.50 Ω, and E = V + Ir = 1.40 + 0.20 × 0.50 = 1.50 V (check: 1.10 + 0.80 × 0.50 = 1.50 V). A takes the first terminal reading as the EMF, forgetting that a current was already flowing. B used ΔI/ΔV, the gradient upside down. D averaged the two terminal readings, which gives neither the EMF nor anything physical.

7. **[WAEC Practical · Analyse]** Chinedu's V–I graph for a cell (V vertical, I horizontal) is a straight line that cuts the V axis at 3.0 V and the I axis at 4.0 A. What are the cell's EMF and internal resistance?
   - **A.** 3.0 V and 0.75 Ω ✓
   - **B.** 4.0 V and 0.75 Ω
   - **C.** 3.0 V and 1.33 Ω
   - **D.** 3.0 V and 12 Ω
   - *Explanation:* The vertical intercept (I = 0) is the EMF, E = 3.0 V. The magnitude of the gradient is r = 3.0 V ÷ 4.0 A = 0.75 Ω; the I-axis intercept is the short-circuit current, where V = 0 and E = Ir. B read the wrong axis for the EMF (an ampere value cannot be a voltage). C used ΔI/ΔV, the gradient inverted. D multiplied the intercepts instead of dividing them.

8. **[NECO-style · Understand]** Nkechi reduces the load resistance connected to a battery step by step, so that the battery supplies more and more current. What happens to its terminal p.d.?
   - **A.** It rises, because more current is flowing
   - **B.** It falls, because the larger current makes the lost volts Ir larger ✓
   - **C.** It stays equal to the EMF, because the EMF of the battery is constant
   - **D.** It falls, because the EMF of the battery falls as the load gets heavier
   - *Explanation:* V = E − Ir with E and r fixed, so as I grows the internal drop Ir grows and V falls; this is the straight, downward-sloping V–I line. A assumes "more current, more voltage", which is true for a fixed resistor, not for a cell's terminals. C confuses a constant EMF with a constant terminal p.d.; they are equal only when I = 0. D blames the EMF, which (for a given cell) does not change with the load: that is exactly Tobe's mistake.

9. **[WAEC-style · Analyse]** A month later Emeka's battery still has an EMF of 12.0 V, but when it drives the same 2.8 Ω starter the terminal p.d. is only 7.0 V. What is its internal resistance now?
   - **A.** 1.2 Ω
   - **B.** 2.8 Ω
   - **C.** 2.0 Ω ✓
   - **D.** 4.8 Ω
   - *Explanation:* I = V/R = 7.0 ÷ 2.8 = 2.5 A; lost volts = E − V = 12.0 − 7.0 = 5.0 V; r = 5.0 ÷ 2.5 = 2.0 Ω (check: 2.5 × (2.8 + 2.0) = 12.0 V). A repeats last month's value without using the new reading. B gives the starter's own resistance, not the battery's. D is E/I = 12.0 ÷ 2.5 = 4.8 Ω, the total circuit resistance: the external 2.8 Ω was not subtracted.

10. **[JAMB-style · Apply]** A 24 V battery bank of internal resistance 0.50 Ω supplies a 5.5 Ω motor. At what rate is energy wasted as heat inside the bank?
    - **A.** 88 W
    - **B.** 96 W
    - **C.** 2.0 W
    - **D.** 8.0 W ✓
    - *Explanation:* I = E/(R + r) = 24 ÷ 6.0 = 4.0 A; power wasted inside = I²r = 4.0² × 0.50 = 8.0 W. A (88 W) is I²R, the power delivered to the motor, not the waste. B (96 W) is EI, the total power the bank supplies. C (2.0 W) is Ir = 2.0, the lost volts written as watts: the student forgot to multiply by the current once more.

11. **[WAEC-style · Analyse]** A torch cell drives 0.30 A through a 4.5 Ω bulb and 0.50 A through a 2.5 Ω bulb. Assuming the bulbs keep these resistances, what are the cell's internal resistance and EMF?
    - **A.** 0.50 Ω and 1.5 V ✓
    - **B.** 0.50 Ω and 1.35 V
    - **C.** 2.0 Ω and 1.95 V
    - **D.** 0.10 Ω and 1.38 V
    - *Explanation:* The EMF is the same both times: 0.30(4.5 + r) = 0.50(2.5 + r), so 1.35 + 0.30r = 1.25 + 0.50r, giving 0.20r = 0.10 and r = 0.50 Ω; then E = 0.30 × (4.5 + 0.50) = 1.5 V. B found r correctly but took E as I₁R₁ = 1.35 V, forgetting the internal resistance in the EMF. C solved 0.20r = 0.10 the wrong way up (r = 0.20 ÷ 0.10). D wrote 0.10 (the left-hand side of 0.20r = 0.10) as r without dividing by 0.20.

12. **[WAEC Practical · Understand]** To measure the EMF on open circuit, Tobe used a cheap voltmeter whose resistance was not very high. How did this affect his value of E?
    - **A.** It was too high, because the voltmeter added its own p.d. to the cell's
    - **B.** It was too low, because the voltmeter drew a small current, so a little p.d. was lost across the internal resistance ✓
    - **C.** It was correct, because no current flows when the circuit is open
    - **D.** It was too low, because the voltmeter's resistance added to the cell's internal resistance
    - *Explanation:* Any voltmeter of finite resistance completes a circuit across the cell, so a small current flows and the reading is E − Ir, slightly below E. A wrongly treats the voltmeter as a source. C forgets that the voltmeter itself is a load: the circuit is "open" only for the main load. D has the direction right but the wrong reason: the meter is the external resistance, not part of r; the error comes from the current it draws through r.

### Part 2 · Home Investigation & 30-Mark Written Paper (Lesson 02)

**Part A · Home Investigation:** *New cell or tired cell: whose internal resistance is bigger?*
You need: one new and one well-used AA (1.5 V) torch cell, a 10 Ω resistor rated at least 0.5 W (from an electronics shop), two short insulated wires with crocodile clips (or tape), and a digital multimeter set to the 20 V DC range (borrowed from a phone-repair or electrical shop, or from school). Use only small torch cells: never a car, keke or inverter battery, never the mains, and never join a cell's two terminals with a bare wire.
1. Measure the voltage across the new cell with nothing else connected. Record it as E.
2. Clip the 10 Ω resistor across the cell, and at once read the voltage across the cell terminals. Record it as V, then unclip the resistor (do not leave it connected for more than about 10 seconds).
3. Repeat steps 1 and 2 two more times and average the readings.
4. Do the same for the used cell.
5. For each cell, work out the current I = V/10, the lost volts E − V, and the internal resistance r = (E − V)/I.
6. If an adult has a car or keke, watch (from a safe distance, engine area untouched) whether the headlamps dim while the engine is being started, and note it.

Sample results table (averages):

| Cell | E (open circuit) / V | V (with 10 Ω) / V | I = V/10 / A | Lost volts E − V / V | r / Ω |
|---|---|---|---|---|---|
| New | 1.58 | 1.52 | 0.152 | 0.06 | 0.39 |
| Used | 1.45 | 1.10 | 0.110 | 0.35 | 3.2 |

*What a good answer shows:* both cells show a voltage close to their EMF on open circuit, but the terminal p.d. drops once current flows; the used cell's EMF is only a little lower, while its internal resistance is several times larger, so it loses far more volts under load and delivers less current. The current is worked out from V/R using the *terminal* reading, not the EMF. A strong answer links this to Emeka: his battery's resting 12.0 V hides an internal resistance that only shows up when the starter draws a large current, just as the headlamps dim during starting. It names one source of error with its direction, for example: leaving the resistor connected too long let the cell's p.d. sag as it was drained, so V was too low and r came out too high; the meter's own resistance is very high, so the open-circuit E reading was only very slightly too low.

**Part B · Written Paper (30 marks)**

**b1 · Definitions (3 marks)**
Define: (a) the *electromotive force* of a cell; (b) the *internal resistance* of a cell; (c) the *terminal potential difference* of a cell.
*Model solution:* (a) The EMF of a cell is the total energy it supplies to each coulomb of charge it drives round the complete circuit, including through the cell itself; it equals the p.d. across the terminals when no current is drawn. (1) (b) The internal resistance of a cell is the opposition to current that comes from the cell's own materials, its electrolyte and plates. (1) (c) The terminal p.d. is the p.d. across the cell's terminals while it is supplying a current; it is the energy per coulomb available to the external circuit, V = E − Ir. (1)
*Mark scheme note:* Equivalent wordings that keep the key ideas are credited. In (a) the idea of energy per coulomb for the *whole* circuit (or the open-circuit reading) is required; "the voltage of the battery" scores zero. In (b) the opposition must be placed *inside* the cell. In (c) the condition "while current flows" is needed; without it the answer could describe the EMF.

**b2 · Where the 3.6 V Went (3 marks)**
Chinedu's voltmeter reads 12.0 V across Emeka's resting battery and 8.4 V while the starter runs. Explain why the two readings differ, without using any numbers other than those given.
*Model solution:* (1) With the starter off, almost no current flows through the battery, so nothing is dropped across its internal resistance and the voltmeter shows the EMF, 12.0 V. (1) (2) When the starter runs, a large current flows through the battery's internal resistance, and p.d. Ir is used up inside the battery (as heat), here 3.6 V. (1) (3) The voltmeter now shows only what is left for the external circuit, the terminal p.d. V = E − Ir = 8.4 V; the EMF itself has not fallen. (1)
*Mark scheme note:* "The battery is weak" or "the voltage is lost in the wires" scores zero (the volts are dropped inside the battery). Point 2 needs both the current *and* the internal resistance. Point 3 needs the statement that the EMF is unchanged; saying "the EMF dropped to 8.4 V" loses that mark.

**b3 · Deriving the Terminal P.D. Relation (4 marks)**
A cell of EMF E and internal resistance r drives a current I through an external resistor R.
(a) Starting from E = I(R + r), show that the terminal p.d. is V = E − Ir. (b) Show that V can also be written V = ER/(R + r). (c) Use this result to explain what V becomes when R is made very large.
*Model solution:* (a) Expanding, E = IR + Ir. (1) The terminal p.d. is the p.d. across R, V = IR, so E = V + Ir and V = E − Ir. (1) (b) The current is I = E/(R + r); substituting into V = IR gives V = ER/(R + r). (1) (c) As R becomes very large, R/(R + r) gets closer and closer to 1, so V approaches E: on open circuit the terminal p.d. equals the EMF. (1)
*Mark scheme note:* Each mark needs its own step; writing V = E − Ir as a remembered formula without the expansion earns only the second mark in (a). In (c) "V becomes zero" is the short-circuit case (R → 0) and is not credited.

**b4 · Emeka's Battery and the Horn (5 marks)**
Emeka's battery (EMF 12.0 V, internal resistance 1.2 Ω) is connected to his 6.8 Ω horn alone.
(a) Calculate the current. (b) Calculate the terminal p.d. (c) Calculate the lost volts. (d) Calculate the rate at which energy is wasted as heat inside the battery. (e) Calculate the percentage of the battery's total power that is delivered to the horn.
*Model solution:* (a) I = E/(R + r) = 12.0 ÷ (6.8 + 1.2) = 12.0 ÷ 8.0 = 1.5 A. (1) (b) V = IR = 1.5 × 6.8 = 10.2 V. (1) (c) Lost volts = Ir = 1.5 × 1.2 = 1.8 V (check: 12.0 − 10.2 = 1.8 V). (1) (d) P_wasted = I²r = 1.5² × 1.2 = 2.7 W. (1) (e) Power to horn = I²R = 1.5² × 6.8 = 15.3 W; total power = EI = 12.0 × 1.5 = 18.0 W; percentage = 15.3 ÷ 18.0 × 100 = 85 %. (1)
*Mark scheme note:* Error carried forward is allowed throughout. I = E/R = 1.76 A (internal resistance left out) loses (a). In (c) the check by subtraction does not earn a second mark. In (d) giving Ir (1.8) with the unit W loses the mark. In (e) R/(R + r) × 100 = 85 % is accepted as an equivalent method.

**b5 · Two Loads, One Battery (4 marks)**
A solar-charged battery drives a current of 0.40 A through a 22.0 Ω lamp, and 1.00 A through an 8.5 Ω fan motor. Assume both loads behave as fixed resistances.
(a) Write an equation for the EMF in each case. (b) Solve them to find the internal resistance. (c) Find the EMF.
*Model solution:* (a) E = 0.40(22.0 + r) and E = 1.00(8.5 + r). (1) (b) Equating: 0.40(22.0 + r) = 1.00(8.5 + r), so 8.8 + 0.40r = 8.5 + 1.00r. (1) 0.30 = 0.60r, so r = 0.50 Ω. (1) (c) E = 0.40 × (22.0 + 0.50) = 0.40 × 22.5 = 9.0 V (check: 1.00 × 9.0 = 9.0 V). (1)
*Mark scheme note:* The two EMF equations must both include r; writing E = 0.40 × 22.0 (no internal resistance) earns nothing in (a). An algebra slip in (b) loses only the mark where it occurs, and (c) may still be earned by error carried forward. Answers given as "r = 0.5" without a unit lose that mark.

**b6 · Practical: V–I Graph for a Cell (6 marks)**
Chinedu varied the load on an accumulator cell and recorded:

| I / A | 0.20 | 0.40 | 0.60 | 0.80 | 1.00 |
|---|---|---|---|---|---|
| V / V | 1.92 | 1.85 | 1.76 | 1.69 | 1.60 |

(a) He is told to "plot V against I". State which quantity goes on the vertical axis and why a straight line is expected. (b) From the line of best fit, extended to I = 0, find the EMF. (c) Using a large triangle, find the gradient of the line, and hence the internal resistance. (d) Find the current the cell would give if its terminals were short-circuited. (e) Use the graph to find the terminal p.d. when the current is 0.50 A.
*Model solution:* (a) V goes on the vertical axis; a straight line is expected because V = E − Ir, and E and r are constant, so V falls linearly as I increases. (1) (b) The line meets the V axis at E = 2.00 V (accept 1.98 V to 2.02 V). (1) (c) Using two points on the line far apart, for example (0.10 A, 1.96 V) and (1.10 A, 1.56 V): gradient = ΔV/ΔI = (1.56 − 1.96) ÷ (1.10 − 0.10) = −0.40 ÷ 1.00 = −0.40 V A⁻¹. (1) r = magnitude of the gradient = 0.40 Ω (accept 0.38 Ω to 0.42 Ω). (1) (d) At short circuit V = 0, so I = E/r = 2.00 ÷ 0.40 = 5.0 A (the I-axis intercept of the extended line). (1) (e) V = E − Ir = 2.00 − 0.50 × 0.40 = 1.80 V (read from the line). (1)
*Mark scheme note:* The line of best fit is a straight line here; joining the points dot to dot is not accepted. A triangle covering less than half the line loses the first mark in (c). Giving r as −0.40 Ω (a negative resistance) loses the second mark in (c). Error carried forward from (b) and (c) is allowed in (d) and (e).

**b7 · Practical: Precautions and Errors (3 marks)**
(a) State two precautions that were taken in the experiment of b6. (b) The cell polarised during the run (reaction products built up at its plates), and its internal resistance rose. State and explain the effect on the value of r obtained from the graph.
*Model solution:* (a) Any two, in the past tense: the key was opened between readings so the cell did not polarise and the resistor did not heat up (1); the open-circuit EMF was read with a high-resistance voltmeter so the current drawn was negligible (1); the connections were tightened and the terminals cleaned (1); parallax was avoided by reading each meter with the eye square to the scale (1); readings were repeated and spread over a wide range of current (1). (Maximum 2.) (b) The value of r was too high, because the later (higher-current) terminal readings sagged below the line they should have followed, making the gradient steeper. (1)
*Mark scheme note:* Commands ("open the key") and future-tense statements score zero, as do vague precautions ("I took care") or ones from other experiments. In (b) both the direction (too high) and the reason (later points too low, steeper gradient) are needed.

**b8 · The Verdict on Tobe's Claim (2 marks)**
Tobe says Emeka's battery "has lost its voltage" and must be thrown away. Using the evidence from Lesson 02, give two reasons why this conclusion is not justified yet.
*Model solution:* (1) On open circuit the battery still reads 12.0 V, so its EMF has not fallen; the chemistry is still supplying the full energy per coulomb. (1) (2) The drop to 8.4 V happens only while current flows, so it is caused by lost volts across the internal resistance (1.2 Ω), and the right next step is to measure r and compare it with a healthy battery's, not to discard the battery on the EMF. (1)
*Mark scheme note:* "The meter is faulty" scores zero. The second mark needs the link between the drop and the current through the internal resistance; "the voltage is lost in the wires" is not credited.

---

## Lesson 03 · Series & Parallel Networks, Cell Arrays, Power & Efficiency

### Part 1 · 12 Interactive MCQs (`window.LESSON_QUIZ`)

1. **[WAEC-style · Remember]** Chinedu wires three lamps side by side (in parallel) across one supply on the workshop board. Which statement about this arrangement is correct?
   - **A.** Every lamp carries the same current, whatever its resistance
   - **B.** Every lamp has the same p.d. across it, and the lamp currents add up to the supply current ✓
   - **C.** The combined resistance is larger than that of the largest lamp
   - **D.** The p.d.s across the three lamps add up to the supply p.d.
   - *Explanation:* Parallel branches are joined across the same two points, so each branch has the same p.d., and at the junction the current divides, so `I = I₁ + I₂ + I₃`. A is the series rule (one path, one current), wrongly carried over to parallel. C is also a series property; in parallel the combination is *smaller* than the smallest branch. D is the series rule for p.d.s, which add only when the parts are in a single line.

2. **[JAMB-style · Apply]** Resistors of 3.0 Ω, 6.0 Ω and 12.0 Ω are connected in parallel. What is their combined resistance?
   - **A.** 21 Ω
   - **B.** 0.58 Ω
   - **C.** 10.3 Ω
   - **D.** 1.71 Ω ✓
   - *Explanation:* `1/R = 1/3.0 + 1/6.0 + 1/12.0 = 0.333 + 0.167 + 0.083 = 0.583 Ω⁻¹`, so `R = 1 ÷ 0.583 = 1.71 Ω`. A added the resistances as if they were in series. B stopped at `1/R = 0.583` and forgot to take the reciprocal. C used "product over sum" for three resistors at once (`216 ÷ 21`), but that short cut works only for a pair.

3. **[WAEC-style · Apply]** In Emeka's backup lighting circuit, a 2.5 Ω resistor is in series with a parallel pair of 10 Ω and 15 Ω. What is the total resistance of the network?
   - **A.** 8.5 Ω ✓
   - **B.** 27.5 Ω
   - **C.** 1.76 Ω
   - **D.** 15.0 Ω
   - *Explanation:* Reduce the pair first: `R_p = (10 × 15) ÷ (10 + 15) = 150 ÷ 25 = 6.0 Ω`; then add the series resistor: `R = 2.5 + 6.0 = 8.5 Ω`. B added all three as if they were in series. C put all three in parallel. D replaced the parallel pair by the average of 10 and 15 (12.5 Ω) before adding 2.5 Ω; a parallel pair is always smaller than its smaller member.

4. **[WAEC-style · Apply]** A battery of EMF 9.0 V and internal resistance 0.50 Ω drives a 2.5 Ω resistor in series with a parallel pair of 4.0 Ω and 12.0 Ω. What current flows in the 12.0 Ω branch?
   - **A.** 1.5 A
   - **B.** 1.1 A
   - **C.** 0.38 A ✓
   - **D.** 0.75 A
   - *Explanation:* `R_p = (4.0 × 12.0) ÷ 16.0 = 3.0 Ω`; total `R + r = 2.5 + 3.0 + 0.50 = 6.0 Ω`; `I = E ÷ (R + r) = 9.0 ÷ 6.0 = 1.5 A`; p.d. across the pair `V_p = 1.5 × 3.0 = 4.5 V`; so `I₁₂ = 4.5 ÷ 12.0 = 0.375 A ≈ 0.38 A`. A is the total current, which was never split at the junction. B (`4.5 ÷ 4.0 = 1.1 A`) is the current in the 4.0 Ω branch: the larger share goes through the *smaller* resistance. D split the total equally between the branches, which only happens when the branches are equal.

5. **[NECO-style · Understand]** Three identical cells, each of EMF 2.0 V and internal resistance 0.90 Ω, are joined in parallel. What are the EMF and internal resistance of the combination?
   - **A.** 2.0 V and 0.30 Ω ✓
   - **B.** 6.0 V and 2.7 Ω
   - **C.** 6.0 V and 0.30 Ω
   - **D.** 2.0 V and 2.7 Ω
   - *Explanation:* Identical cells in parallel keep the EMF of one cell (2.0 V) and their internal resistances act as parallel branches: `r_t = r ÷ n = 0.90 ÷ 3 = 0.30 Ω`. B is the series result (EMF and `r` both multiplied by 3). C mixed the two rules: it added the EMFs (series) but divided `r` (parallel). D kept the single EMF but added the internal resistances, the reverse mix-up.

6. **[WAEC-style · Apply]** Four cells, each of EMF 1.5 V and internal resistance 0.50 Ω, are joined in series to light a 4.0 Ω inspection lamp. What current flows?
   - **A.** 1.5 A
   - **B.** 1.0 A ✓
   - **C.** 0.36 A
   - **D.** 1.3 A
   - *Explanation:* In series, `E_t = 4 × 1.5 = 6.0 V` and `r_t = 4 × 0.50 = 2.0 Ω`, so `I = E_t ÷ (R + r_t) = 6.0 ÷ (4.0 + 2.0) = 6.0 ÷ 6.0 = 1.0 A`. A (`6.0 ÷ 4.0`) forgot the internal resistance altogether. C used the parallel arrangement (`1.5 ÷ 4.125`) although the cells are in series. D (`6.0 ÷ 4.5`) added only one cell's internal resistance instead of all four.

7. **[WAEC-style · Analyse]** Emeka's backup pump has a resistance of only 0.40 Ω. He has two identical cells; each has an EMF of 1.5 V and an internal resistance of 1.0 Ω. Which arrangement drives the larger current through the pump, and how large is it?
   - **A.** Series, 1.25 A
   - **B.** Series, 7.5 A
   - **C.** Parallel, 3.75 A
   - **D.** Parallel, 1.67 A ✓
   - *Explanation:* Series: `I = 3.0 ÷ (0.40 + 2.0) = 1.25 A`. Parallel: `E_t = 1.5 V`, `r_t = 0.50 Ω`, so `I = 1.5 ÷ (0.40 + 0.50) = 1.67 A`, which is larger. For a low-resistance load, the internal resistance dominates, so halving it matters more than doubling the EMF. A is the true series current, but it is the smaller one (Tobe's "more voltage always wins" idea). B (`3.0 ÷ 0.40`) and C (`1.5 ÷ 0.40`) both ignored the internal resistance.

8. **[JAMB-style · Apply]** A keke headlamp is rated 24 W, 12 V. What is its resistance when it works normally?
   - **A.** 2.0 Ω
   - **B.** 288 Ω
   - **C.** 6.0 Ω ✓
   - **D.** 0.50 Ω
   - *Explanation:* `P = V²/R`, so `R = V² ÷ P = 12² ÷ 24 = 144 ÷ 24 = 6.0 Ω`. A (`24 ÷ 12`) is the current in amperes (`I = P/V`) wrongly labelled as a resistance. B multiplied the voltage by the power. D (`12 ÷ 24`) divided the voltage by the power, which has no physical meaning here.

9. **[NECO-style · Apply]** Engr. Nkechi's 750 W electric kettle is switched on for 4.0 minutes. How much electrical energy does it use?
   - **A.** 3.0 kJ
   - **B.** 180 kJ ✓
   - **C.** 187.5 J
   - **D.** 10.8 MJ
   - *Explanation:* Convert the time to seconds first: `t = 4.0 × 60 = 240 s`; then `W = Pt = 750 × 240 = 180 000 J = 180 kJ`. A (`750 × 4.0`) left the time in minutes. C divided the power by the time instead of multiplying. D (`750 × 4.0 × 3600`) treated the 4.0 minutes as 4.0 hours.

10. **[JAMB-style · Apply]** A cell of EMF 6.0 V and internal resistance 0.80 Ω drives a 3.2 Ω load. What is the efficiency of the cell?
    - **A.** 80 % ✓
    - **B.** 20 %
    - **C.** 25 %
    - **D.** 75 %
    - *Explanation:* `η = R ÷ (R + r) × 100 % = 3.2 ÷ (3.2 + 0.80) × 100 % = 3.2 ÷ 4.0 × 100 % = 80 %`. (Check: `I = 6.0 ÷ 4.0 = 1.5 A`; useful `I²R = 7.2 W`; total `EI = 9.0 W`; `7.2 ÷ 9.0 = 80 %`.) B (`0.80 ÷ 4.0`) is the fraction of the power *wasted* inside the cell. C divided `r` by `R` instead of `R` by `(R + r)`. D used `(R − r) ÷ R`, an invented formula.

11. **[WAEC Practical · Analyse]** Chinedu varies the load `R` connected to a cell of internal resistance 1.5 Ω and plots the power delivered to the load against `R`. Which description of the graph is correct?
    - **A.** A straight line through the origin, rising steadily as `R` increases
    - **B.** A line that falls steadily from its highest value at `R = 0`
    - **C.** A smooth curve that rises to a single maximum at `R = 1.5 Ω` and then falls ✓
    - **D.** A smooth curve with its maximum at `R = 1.5 Ω`, where the efficiency is 100 %
    - *Explanation:* Load power `P = E²R ÷ (R + r)²` is zero at `R = 0` (no p.d. across the load), zero again as `R` becomes very large (almost no current), and peaks where `R = r = 1.5 Ω`, so a smooth curve is drawn, never a straight regression line. A treats a curved relation as linear. B confuses load power with current, which *is* greatest at `R = 0`. D has the right shape but the wrong efficiency: at `R = r`, `η = R ÷ (R + r) = 50 %`, so half the power is wasted inside the cell.

12. **[WAEC-style · Analyse]** Emeka's worn battery (EMF 12.0 V, internal resistance 1.2 Ω) delivers 3.0 A to his starter. At what rate is energy turned into heat inside the battery itself?
    - **A.** 36 W
    - **B.** 25.2 W
    - **C.** 3.6 W
    - **D.** 10.8 W ✓
    - *Explanation:* The power wasted inside is `I²r = 3.0² × 1.2 = 9.0 × 1.2 = 10.8 W`, which is why the battery runs hot. A (`EI = 12.0 × 3.0`) is the total power the battery converts, not the part lost inside. B (`I²R = 9.0 × 2.8`) is the useful power delivered to the 2.8 Ω starter. C (`Ir = 3.0 × 1.2`) is the lost volts in volts; it was not multiplied by the current to give a power.

### Part 2 · Home Investigation & 30-Mark Written Paper (Lesson 03)

**Part A · Home Investigation:** *Two bulbs, two ways: which arrangement shines brighter and drains the cells faster?*
You need: two identical small torch bulbs (2.5 V or 3.8 V, from a torch or a market electrical stall), two new AA cells, a two-cell battery holder (or tape the cells end to end inside a paper tube), four short lengths of insulated wire with the ends stripped, cellotape, and a clock. **Use only torch cells. Never use mains electricity, and never join the cell terminals directly with a bare wire: a short circuit makes the cell hot.**
1. Join the two cells in series in the holder (about 3 V). Connect one bulb alone across them and note its brightness. Call this brightness 3 on a scale from 0 (off) to 5 (very bright).
2. Connect the two bulbs in series (one after the other) across the cells. Rate each bulb's brightness on the same 0–5 scale.
3. Disconnect, then connect the two bulbs in parallel (side by side, each bulb joined directly across the cells). Rate each bulb's brightness.
4. In the parallel set-up, unscrew one bulb. Note what happens to the other. Repeat for the series set-up.
5. Leave each set-up running for 10 minutes, then feel the cells gently with a fingertip and note whether they are cool or slightly warm. Disconnect everything when you finish.

Sample results table:

| Arrangement | Brightness of each bulb (0–5) | Effect of removing one bulb | Cells after 10 min |
|---|---|---|---|
| One bulb alone | 3 | (not tested) | cool |
| Two bulbs in series | 1 | Other bulb goes off | cool |
| Two bulbs in parallel | 3 | Other bulb stays lit | slightly warm |

*What a good answer shows:* in series the two bulbs share the cells' p.d., so each gets about half and glows dimly; in parallel each bulb gets the full p.d. and glows as brightly as a single bulb, but the cells must supply about twice the current, so they run down faster (the total power drawn is larger, `P = IV`). Removing one bulb breaks the only path in series but leaves the other branch complete in parallel, which is why workshop and house lamps are wired in parallel. A strong answer notes that the cells feel slightly warm in the parallel test because the larger current wastes more power inside them as `I²r`, and links this to Emeka's hot battery. It also names one limitation with its direction: brightness judged by eye is subjective, so small differences may be missed, and the cells' internal resistance rises as they warm, so brightness ratings taken late in the parallel run come out too low.

**Part B · Written Paper (30 marks)**

**b1 · Definitions (3 marks)**
Define each term: (a) *electrical power*; (b) *the kilowatt-hour*; (c) *the efficiency of a cell* in a circuit.
*Model solution:* (a) Electrical power is the rate at which electrical energy is changed into other forms, measured in watts (1 W = 1 J s⁻¹). (1) (b) The kilowatt-hour is the electrical energy used when a device of power 1 kW works for one hour; it equals `3.6 × 10⁶ J`. (1) (c) The efficiency of a cell is the fraction (or percentage) of the total power it supplies that is delivered to the external load: `η = useful power ÷ total power = R ÷ (R + r)`. (1)
*Mark scheme note:* Equivalent wordings that keep the key ideas are credited. In (a) "energy" alone, without "rate" or "per second", scores zero. In (b) calling the kilowatt-hour a unit of power is the commonest error and scores zero; it is a unit of *energy*. In (c) the answer must compare useful (load) power with total power; "how well the cell works" is too vague.

**b2 · Why Parallel? (3 marks)**
(a) Explain why the combined resistance of two resistors in parallel is smaller than either resistor alone. (b) Give two reasons why the lamps in Engr. Nkechi's workshop are wired in parallel rather than in series.
*Model solution:* (a) Adding a second branch gives the charge an extra path, so for the same p.d. more total current flows; since `R = V ÷ I`, a larger current for the same p.d. means a smaller combined resistance. (1) (b) Each lamp receives the full supply p.d., so every lamp works at its rated brightness. (1) If one lamp fails or is switched off, the other branches remain complete and stay lit. (1)
*Mark scheme note:* In (a) "because you divide" or a bare formula without the idea of an extra path or a larger current scores zero. In (b) "it is safer" or "it uses less current" is not credited: parallel lamps actually draw *more* total current. The two marks in (b) must be two different reasons.

**b3 · Deriving the Parallel Rule (4 marks)**
(a) Two resistors `R₁` and `R₂` are connected in parallel across a p.d. `V`. Starting from the behaviour of current and p.d. in parallel, derive the expression for their combined resistance `R`. (b) Use your result to show that two equal resistors, each of value `R₀`, in parallel have a combined resistance of `R₀/2`.
*Model solution:* (a) Both resistors have the same p.d. `V` across them. (1) The supply current divides at the junction, so `I = I₁ + I₂`. (1) Substituting `I = V/R`, `I₁ = V/R₁` and `I₂ = V/R₂` gives `V/R = V/R₁ + V/R₂`; dividing through by `V`, `1/R = 1/R₁ + 1/R₂`. (1) (b) `1/R = 1/R₀ + 1/R₀ = 2/R₀`, so `R = R₀/2`. (1)
*Mark scheme note:* The first two marks are for stating the two physical facts; writing the final formula from memory with no reasoning earns only the third mark if the substitution line is shown. Writing "the current is the same in each branch" is wrong and loses the second mark. In (b), "half because there are two" with no working is not credited.

**b4 · Solving a Mixed Network (5 marks)**
A battery of EMF 24.0 V and internal resistance 1.0 Ω is connected to a 5.0 Ω resistor in series with a parallel pair of 6.0 Ω and 3.0 Ω. Calculate: (a) the combined resistance of the parallel pair; (b) the current drawn from the battery; (c) the terminal p.d. of the battery; (d) the p.d. across the parallel pair; (e) the current in the 3.0 Ω resistor.
*Model solution:* (a) `R_p = (6.0 × 3.0) ÷ (6.0 + 3.0) = 18 ÷ 9.0 = 2.0 Ω`. (1) (b) External resistance `R = 5.0 + 2.0 = 7.0 Ω`; `I = E ÷ (R + r) = 24.0 ÷ (7.0 + 1.0) = 3.0 A`. (1) (c) `V = E − Ir = 24.0 − 3.0 × 1.0 = 21 V` (check: `IR = 3.0 × 7.0 = 21 V`). (1) (d) `V_p = I × R_p = 3.0 × 2.0 = 6.0 V`. (1) (e) `I₃ = V_p ÷ 3.0 = 6.0 ÷ 3.0 = 2.0 A`. (1)
*Mark scheme note:* Error carried forward is allowed from (a) and (b). Leaving out the 1.0 Ω internal resistance in (b) gives 3.4 A and loses that mark. Giving 24.0 V as the terminal p.d. in (c) is the voltmeter-reads-EMF trap and scores zero. In (e), dividing the full 21 V by 3.0 Ω ignores the drop across the 5.0 Ω resistor and is not credited. Units are required on every answer.

**b5 · Series or Parallel for the Pump? (5 marks)**
Six identical cells, each of EMF 1.5 V and internal resistance 0.60 Ω, are available to drive a pump of resistance 0.50 Ω. (a) Find the current through the pump when all six cells are in series. (b) Find the current when all six are in parallel. (c) State which arrangement Emeka should choose, supporting your answer with the power delivered to the pump in each case.
*Model solution:* (a) Series: `E_t = 6 × 1.5 = 9.0 V`, `r_t = 6 × 0.60 = 3.6 Ω`. (1) `I = 9.0 ÷ (0.50 + 3.6) = 9.0 ÷ 4.1 = 2.2 A`. (1) (b) Parallel: `E_t = 1.5 V`, `r_t = 0.60 ÷ 6 = 0.10 Ω`. (1) `I = 1.5 ÷ (0.50 + 0.10) = 1.5 ÷ 0.60 = 2.5 A`. (1) (c) Parallel: pump power `I²R = 2.5² × 0.50 = 3.1 W`, compared with `2.2² × 0.50 = 2.4 W` in series, so the parallel array delivers more current and more useful power to this low-resistance pump. (1)
*Mark scheme note:* Writing `E_t = 9.0 V` for the parallel case, or `r_t = 3.6 Ω` for it, is the classic series/parallel mix-up and loses the mark for that step. Ignoring internal resistance (giving 18 A in series) scores zero for that current. In (c) the choice must be backed by a comparison of currents or powers; "parallel is always better" without numbers is not credited.

**b6 · Practical: The Load-Power Curve (5 marks)**
A student connected a cell of EMF 3.0 V to a series of load resistors and recorded the current. Part of the results is shown.

| R / Ω | 0.5 | 1.0 | 2.0 | 4.0 | 8.0 |
|---|---|---|---|---|---|
| I / A | 1.20 | 1.00 | 0.75 | ? | 0.30 |
| P / W | 0.72 | 1.00 | 1.13 | ? | 0.72 |

(a) Given that the internal resistance of the cell is 2.0 Ω, calculate the missing current and the missing power for `R = 4.0 Ω`. (b) Describe the line that should be drawn through the points of a graph of `P` (vertical) against `R`. (c) Use the table to state the value of `R` at which `P` is greatest, and explain what this shows about the cell. (d) State the efficiency of the cell at that load.
*Model solution:* (a) `I = E ÷ (R + r) = 3.0 ÷ (4.0 + 2.0) = 0.50 A`. (1) `P = I²R = 0.50² × 4.0 = 1.00 W`. (1) (b) A smooth curve that rises to a single peak and then falls, drawn freehand through the points, not a straight line of best fit. (1) (c) `P` is greatest at `R = 2.0 Ω`; maximum power is delivered when the load equals the internal resistance, so this confirms `r = 2.0 Ω`. (1) (d) `η = R ÷ (R + r) = 2.0 ÷ 4.0 × 100 % = 50 %`. (1)
*Mark scheme note:* Readings in (a) must follow the table's decimal places (0.50 A, 1.00 W). In (b) a ruled straight line, or "dot-to-dot" with straight segments, loses the mark because power against load is not a linear relation. In (c) the reason (`R = r` for maximum power) is required for the mark. Giving 100 % in (d) confuses maximum power with maximum efficiency and scores zero.

**b7 · Practical: Precautions and Errors (3 marks)**
(a) State two precautions that were taken while measuring load power and efficiency on the cell-array bench. (b) During a long run, the cells polarised (reaction products built up at their plates). State and explain the effect on the efficiency values recorded for the later loads.
*Model solution:* (a) Any two, in the past tense: the key was opened between readings so the cells did not polarise (1); the same cells were used throughout so only the arrangement or load changed (1); the connections were cleaned and tightened (1); parallax error was avoided by reading each meter square to its scale (1). (Maximum 2.) (b) The later efficiency values were too low, because polarisation raised the internal resistance `r`, so a larger share of the power was wasted inside the cells and `R ÷ (R + r)` fell. (1)
*Mark scheme note:* Precautions written as commands ("open the key") or in the future tense lose the marks. "Avoid errors" or "be careful" is not a precaution. In (b) the direction (too low) and the reason (rise in `r`) must both be given for the mark.

**b8 · Why Emeka's Battery Runs Hot (2 marks)**
Emeka's worn battery has an EMF of 12.0 V and an internal resistance of 1.2 Ω and drives his 2.8 Ω starter. (a) Calculate the efficiency of the battery in this circuit. (b) A new battery of the same EMF has an internal resistance of only 0.10 Ω. Explain, in terms of power, why the worn battery runs hotter.
*Model solution:* (a) `η = R ÷ (R + r) = 2.8 ÷ (2.8 + 1.2) × 100 % = 2.8 ÷ 4.0 × 100 % = 70 %`. (1) (b) The worn battery's larger internal resistance turns a much bigger share of the power it supplies into heat inside itself (`I²r`), so 30 % of its power heats the battery, compared with only about 3 % for the new one (`0.10 ÷ 2.9`). (1)
*Mark scheme note:* In (a) using `r ÷ (R + r)` gives the wasted 30 % and scores zero. In (b) the answer must link the higher temperature to energy dissipated *inside* the battery as `I²r`; "the battery is old" or "the chemicals are weak" is not credited.

---

## Lesson 04 · Galvanometer Conversion — Ammeter Shunts & Voltmeter Multipliers

### Part 1 · 12 Interactive MCQs (`window.LESSON_QUIZ`)

1. **[JAMB-style · Remember]** To turn a sensitive galvanometer into an ammeter, what must be connected to it?
   - **A.** A large resistor in series with the coil
   - **B.** A large resistor in parallel with the coil
   - **C.** A small resistor in parallel with the coil ✓
   - **D.** A small resistor in series with the coil
   - *Explanation:* A small resistor (the shunt) placed in parallel offers the current an easy bypass, so only the tiny full-scale current `I_g` passes through the delicate coil. A is the voltmeter conversion (a multiplier). B would carry very little current, so it would protect nothing. D puts the small resistor in the same path as the coil, so the full line current would still flow through the coil and burn it out.

2. **[WAEC-style · Understand]** Why should a good ammeter have a very low resistance?
   - **A.** So that putting it in series hardly changes the current it is measuring ✓
   - **B.** So that it draws hardly any current from the circuit it is connected across
   - **C.** So that the whole line current can pass safely through its coil
   - **D.** So that it can be connected in parallel with the component under test
   - *Explanation:* An ammeter is inserted in series, so its resistance adds to the circuit; a very low value leaves the current almost unchanged. B is the reason a *voltmeter* needs a high resistance (it is connected across a component). C is false: in a converted ammeter most of the current flows through the shunt, not the coil. D gives the wrong position; an ammeter in parallel would act almost as a short circuit.

3. **[WAEC-style · Apply]** A galvanometer has a coil resistance of 9.8 Ω and gives full-scale deflection at 20 mA. What shunt resistance converts it into an ammeter reading up to 0.50 A?
   - **A.** 0.392 Ω
   - **B.** 235 Ω
   - **C.** 0.196 Ω
   - **D.** 0.408 Ω ✓
   - *Explanation:* `I_g = 20 mA = 0.020 A`; the shunt carries `I − I_g = 0.50 − 0.020 = 0.48 A`; equal p.d. across coil and shunt gives `R_s = I_g R_g ÷ (I − I_g) = (0.020 × 9.8) ÷ 0.48 = 0.196 ÷ 0.48 = 0.408 Ω`. A divided by the full 0.50 A instead of the shunt current `I − I_g`. B turned the formula upside down (`0.48 × 9.8 ÷ 0.020`). C (`0.020 × 9.8`) is the p.d. across the coil in volts, not a resistance.

4. **[JAMB-style · Apply]** A galvanometer of coil resistance 75 Ω gives full-scale deflection at 2.5 mA. How is it converted into a voltmeter reading up to 20 V?
   - **A.** 8 000 Ω in series
   - **B.** 7 925 Ω in series ✓
   - **C.** 8 075 Ω in series
   - **D.** 7 925 Ω in parallel
   - *Explanation:* Total resistance needed `R_total = V ÷ I_g = 20 ÷ 0.0025 = 8 000 Ω`; the coil already supplies 75 Ω, so the multiplier is `R_m = 8 000 − 75 = 7 925 Ω`, in series. A is the whole meter's resistance; it forgot to subtract `R_g`. C added `R_g` instead of subtracting it. D has the right value in the wrong position: a resistor in parallel would not limit the coil current.

5. **[WAEC-style · Apply]** An ammeter is made by connecting a 0.10 Ω shunt across a galvanometer of coil resistance 40 Ω. When the ammeter reads its full scale of 4.0 A, what current flows through the coil?
   - **A.** 0.40 A
   - **B.** 3.99 A
   - **C.** 1600 A
   - **D.** 10 mA ✓
   - *Explanation:* The coil and shunt share the same p.d.: `40 I_g = 0.10 (4.0 − I_g)`, so `40.1 I_g = 0.40` and `I_g = 0.40 ÷ 40.1 = 0.00998 A ≈ 10 mA`. A (`4.0 × 0.10`) is the p.d. across the shunt in volts, wrongly read as a current. B is the current through the *shunt*, not the coil. C (`4.0 × 40 ÷ 0.10`) used the resistance ratio the wrong way round; the larger resistance takes the *smaller* current.

6. **[WAEC-style · Apply]** A galvanometer of coil resistance 60 Ω reaches full-scale deflection when the p.d. across its coil is 30 mV. What multiplier converts it into a 15 V voltmeter?
   - **A.** 30 000 Ω
   - **B.** 500 Ω
   - **C.** 29 940 Ω ✓
   - **D.** 2 940 Ω
   - *Explanation:* Find the full-scale current first: `I_g = V_g ÷ R_g = 0.030 ÷ 60 = 5.0 × 10⁻⁴ A`. Then `R_total = 15 ÷ (5.0 × 10⁻⁴) = 30 000 Ω`, and `R_m = 30 000 − 60 = 29 940 Ω`. A is the total resistance, with `R_g` not subtracted. B (`15 ÷ 0.030`) divided the range by the coil's p.d. instead of by its current. D converted 30 mV to 0.30 V (a factor-of-ten slip), giving `I_g = 0.005 A` and `3 000 − 60`.

7. **[NECO-style · Analyse]** A galvanometer of coil resistance 100 Ω is fitted with a 0.20 Ω shunt. What is the resistance of the finished ammeter, as seen by the circuit?
   - **A.** About 0.20 Ω (just under the shunt value) ✓
   - **B.** 100.2 Ω
   - **C.** 100 Ω
   - **D.** 50.1 Ω
   - *Explanation:* Coil and shunt are in parallel: `R = (100 × 0.20) ÷ (100 + 0.20) = 20 ÷ 100.2 = 0.1996 Ω ≈ 0.20 Ω`. A parallel pair is always a little smaller than its smaller member, so the meter is almost as low as the shunt. B added the two as if they were in series. C gave only the coil's resistance and ignored the shunt. D averaged the two resistances, which has no meaning for a parallel pair.

8. **[WAEC-style · Analyse]** Two 10 kΩ resistors are in series across a 12.0 V supply of negligible internal resistance. Chinedu connects a voltmeter of total resistance 10 kΩ across one of the resistors. What does it read?
   - **A.** 6.0 V
   - **B.** 4.0 V ✓
   - **C.** 8.0 V
   - **D.** 12.0 V
   - *Explanation:* The voltmeter in parallel with one 10 kΩ resistor makes a 5.0 kΩ combination; the supply now sees `10 + 5.0 = 15 kΩ`, so the p.d. across the combination is `12.0 × 5.0 ÷ 15 = 4.0 V`. A low-resistance voltmeter draws current and pulls the reading down, which is why a good voltmeter needs a very high resistance. A is the reading an ideal (infinite-resistance) voltmeter would give. C (`12.0 − 4.0`) is the p.d. across the *other* resistor. D is the supply p.d., as if the voltmeter were across both resistors.

9. **[JAMB-style · Apply]** A voltmeter reads up to 5.0 V and has a total resistance of 1 000 Ω. How can its range be extended to 25 V?
   - **A.** Add 4 000 Ω in series ✓
   - **B.** Add 5 000 Ω in series
   - **C.** Add 4 000 Ω in parallel
   - **D.** Add 200 Ω in series
   - *Explanation:* Full-scale current `I_g = 5.0 ÷ 1 000 = 0.005 A`. For 25 V the total resistance must be `25 ÷ 0.005 = 5 000 Ω`, so the extra series resistance is `5 000 − 1 000 = 4 000 Ω` (equivalently, the extra resistor must drop `25 − 5.0 = 20 V` at 0.005 A). B is the new total, not the resistor added. C has the right value but the wrong position; extra voltage range always needs series resistance. D (`1 000 ÷ 5`) divided the meter's resistance by the range factor, a muddle with the shunt idea.

10. **[WAEC Practical · Analyse]** When building a voltmeter, Tobe used the value `V ÷ I_g` as the multiplier, forgetting to subtract the coil resistance. How did his finished voltmeter read when tested against a standard meter?
    - **A.** Too high, because more current passed through the coil than intended
    - **B.** Exactly right, because the coil resistance is always too small to matter
    - **C.** Too high, because the meter drew extra current from the circuit
    - **D.** Too low, because its total resistance was larger than `V ÷ I_g`, so the coil carried less than `I_g` at the intended full-scale voltage ✓
    - *Explanation:* Tobe's meter has total resistance `V/I_g + R_g`, larger than needed, so at any p.d. the coil current (and the deflection) is slightly smaller than it should be, and every reading comes out too low. A and C reverse the effect: a *larger* resistance means *less* current, not more. B is wrong: the error is small only when `R_g` is tiny compared with `V/I_g`; for a low range it can be large, and WAEC penalises the omission either way.

11. **[NECO-style · Apply]** Engr. Nkechi converts a 25 mA galvanometer into a 6.0 A ammeter. What percentage of the line current passes through the shunt at full scale?
    - **A.** 0.42 %
    - **B.** 99.6 % ✓
    - **C.** 50 %
    - **D.** 24 %
    - *Explanation:* The coil takes `I_g = 0.025 A`, so the shunt takes `6.0 − 0.025 = 5.975 A`, which is `5.975 ÷ 6.0 × 100 % = 99.6 %` of the line current. A (`0.025 ÷ 6.0`) is the share through the *coil*. C assumed the current divides equally, which happens only for equal resistances. D (`6.0 ÷ 25`) treated 25 mA as 25 A, a unit slip.

12. **[WAEC-style · Analyse]** To test Emeka's 12 V battery and its starter line, Nkechi uses a galvanometer of coil resistance 30 Ω and full-scale current 1.0 mA. She needs a 0–15 V voltmeter and a 0–5.0 A ammeter. Which choice is correct?
    - **A.** Shunt of 14 970 Ω in series for the voltmeter; multiplier of 0.0060 Ω in parallel for the ammeter
    - **B.** Multiplier of 15 000 Ω in series; shunt of 0.0060 Ω in parallel
    - **C.** Multiplier of 14 970 Ω in series; shunt of 0.0060 Ω in parallel ✓
    - **D.** Multiplier of 14 970 Ω in parallel; shunt of 0.0060 Ω in series
    - *Explanation:* Voltmeter: `R_m = V ÷ I_g − R_g = 15 ÷ 0.0010 − 30 = 15 000 − 30 = 14 970 Ω`, in series. Ammeter: `R_s = I_g R_g ÷ (I − I_g) = (0.0010 × 30) ÷ 4.999 = 0.0060 Ω`, in parallel. A has the right numbers but swaps the names: the large series resistor is the multiplier and the small parallel one is the shunt. B forgot to subtract `R_g` from the total. D has both resistors in the wrong positions.

### Part 2 · Home Investigation & 30-Mark Written Paper (Lesson 04)

**Part A · Home Investigation:** *The water shunt: how much flow takes the easy path?*
You need: an empty 1.5 litre plastic bottle, a narrow coffee stirrer or thin juice straw (about 3 mm across), a wide drinking straw (about 6–8 mm across), a nail to make holes (an adult heats or pushes it through), cellotape or candle wax to seal round the straws, two identical cups, a measuring cup or a 20 mL syringe, water, and a clock.
1. Ask an adult to make two holes on opposite sides of the bottle, about 3 cm above the base and at exactly the same height. Push a 4 cm piece of the narrow straw into one hole and a 4 cm piece of the wide straw into the other, and seal round each with tape or wax.
2. Cover both straw ends with your fingers, fill the bottle to a marked line, and hold one cup under each straw.
3. Release both straws together, collect for 20 seconds, then cover both ends again.
4. Measure the volume in each cup. Work out the percentage of the total flow that went through the narrow straw (the "coil") and through the wide straw (the "shunt").
5. Repeat twice more, refilling to the same line each time, and average. Then replace the wide straw with a second narrow straw and repeat, to see what happens when the "shunt" is no longer an easy path.
6. Pour the water onto a plant and dry the work area.

Sample results table:

| Set-up | Volume through narrow straw (mL) | Volume through other straw (mL) | % of total through narrow straw |
|---|---|---|---|
| Narrow + wide, trial 1 | 14 | 186 | 7.0 |
| Narrow + wide, trial 2 | 15 | 182 | 7.6 |
| Narrow + wide, trial 3 | 13 | 190 | 6.4 |
| Narrow + wide, average | 14 | 186 | 7.0 |
| Narrow + narrow | 48 | 50 | 49 |

*What a good answer shows:* both straws feel the same "push" (the same water depth, like the same p.d. across parallel branches), but the wide straw offers much less opposition, so it carries most of the flow, just as a low-resistance shunt carries most of the line current and protects the coil; when the two paths are alike the flow splits roughly equally, like equal resistors in parallel. Percentages are worked from the total of both cups. A strong answer links the result to Nkechi's 3 A starter test: the thinner the coil's path compared with the shunt, the smaller its share, so a very small shunt lets a delicate galvanometer measure a large current. It states one limitation of the model (water flow through a straw does not rise exactly in proportion to the push, unlike current in an ohmic resistor) and one source of error with its direction: the water level fell during the 20 s, so both flows were smaller than at the start and the volumes came out too low, although the percentage split changed much less.

**Part B · Written Paper (30 marks)**

**b1 · Definitions (3 marks)**
Define each term: (a) *shunt*; (b) *multiplier*; (c) the *full-scale deflection current* of a galvanometer.
*Model solution:* (a) A shunt is a resistor of very low value connected in parallel with a galvanometer coil, so that most of the current to be measured bypasses the coil, turning the galvanometer into an ammeter. (1) (b) A multiplier is a resistor of very high value connected in series with a galvanometer coil, so that the coil current stays within its limit when a large p.d. is applied, turning the galvanometer into a voltmeter. (1) (c) The full-scale deflection current is the smallest current through the coil that moves the pointer to the end of its scale. (1)
*Mark scheme note:* Equivalent wordings that keep the key ideas are credited. In (a) and (b), both the size (low / high) and the position (parallel / series) are needed for the mark. In (c) "the current the meter can take" is too vague; the idea of the pointer reaching the end of the scale is required.

**b2 · Why Convert at All? (3 marks)**
(a) Explain why a galvanometer of full-scale current 1 mA cannot be used directly to measure the 3 A current to Emeka's starter. (b) Explain why an ideal ammeter has a very low resistance. (c) Explain why an ideal voltmeter has a very high resistance.
*Model solution:* (a) A current thousands of times larger than its full-scale value would drive the pointer far off the scale, and the fine coil would overheat and burn out. (1) (b) It is placed in series, so a very low resistance adds almost nothing to the circuit and leaves the current being measured practically unchanged. (1) (c) It is placed in parallel across a component, so a very high resistance draws almost no current and leaves the p.d. being measured practically unchanged. (1)
*Mark scheme note:* In (b) and (c) the position of the meter (series / parallel) must be linked to its effect on the quantity measured; "so that it is accurate" alone scores zero. Saying an ammeter needs a high resistance "so the current does not damage it" is a recognised misconception and is not credited.

**b3 · Deriving the Shunt and Multiplier Formulae (5 marks)**
A galvanometer has coil resistance `R_g` and full-scale current `I_g`. (a) Derive an expression for the shunt resistance `R_s` that converts it into an ammeter of full-scale reading `I`. (b) Derive an expression for the multiplier resistance `R_m` that converts it into a voltmeter of full-scale reading `V`.
*Model solution:* (a) The coil and the shunt are in parallel, so the p.d. across each is the same. (1) At full scale the coil carries `I_g`, so the shunt carries the rest, `I − I_g`. (1) Equating the p.d.s, `I_g R_g = (I − I_g) R_s`, so `R_s = I_g R_g ÷ (I − I_g)`. (1) (b) The coil and the multiplier are in series and carry the same current, `I_g` at full scale, so `V = I_g (R_g + R_m)`. (1) Rearranging, `R_m = V ÷ I_g − R_g`. (1)
*Mark scheme note:* Each mark is for a separate step; quoting the final formulae with no reasoning earns only the final mark of each part. Writing the shunt current as `I` instead of `I − I_g` loses the second mark. In (b) stopping at `R = V ÷ I_g` and calling it the multiplier loses the last mark: that is the whole meter's resistance.

**b4 · Building an Ammeter (5 marks)**
A galvanometer of coil resistance 45 Ω gives full-scale deflection at 2.0 mA. It is to be converted into an ammeter reading up to 1.5 A. (a) Calculate the p.d. across the coil at full-scale deflection. (b) Find the current that must flow through the shunt at full scale. (c) Calculate the shunt resistance. (d) Calculate the total resistance of the finished ammeter and state how it is connected in a circuit.
*Model solution:* (a) `I_g = 2.0 mA = 0.0020 A`. (1) `V_g = I_g R_g = 0.0020 × 45 = 0.090 V`. (1) (b) `I − I_g = 1.5 − 0.0020 = 1.498 A`. (1) (c) `R_s = V_g ÷ (I − I_g) = 0.090 ÷ 1.498 = 0.0601 Ω`, in parallel with the coil. (1) (d) `R = (45 × 0.0601) ÷ (45 + 0.0601) = 0.0600 Ω`, so the ammeter is connected in series with the circuit. (1)
*Mark scheme note:* Using 2.0 instead of 0.0020 in (a) is the mA-as-A slip and loses both marks there, with error carried forward allowed afterwards. Dividing by 1.5 A instead of 1.498 A in (c) gives 0.0600 Ω; credit is given only if the subtraction in (b) is shown. In (d) both the value and "in series" are needed for the mark.

**b5 · Building a Voltmeter (5 marks)**
The same galvanometer (45 Ω, full scale 2.0 mA) is to be made into a voltmeter. (a) Calculate the total resistance needed for a 0–30 V range. (b) Calculate the multiplier and state how it is connected. (c) Later the range must be extended from 30 V to 75 V. Calculate the extra resistance that must be added in series. (d) On the 0–30 V range, the meter reads 12 V across Emeka's battery. Calculate the current the meter draws.
*Model solution:* (a) `R_total = V ÷ I_g = 30 ÷ 0.0020 = 15 000 Ω`. (1) (b) `R_m = 15 000 − 45 = 14 955 Ω`. (1) It is connected in series with the coil. (1) (c) New total `= 75 ÷ 0.0020 = 37 500 Ω`, so the extra series resistance is `37 500 − 15 000 = 22 500 Ω`. (1) (d) `I = V ÷ R_total = 12 ÷ 15 000 = 8.0 × 10⁻⁴ A = 0.80 mA`. (1)
*Mark scheme note:* Giving 15 000 Ω as the multiplier in (b) is the chief examiner's reported trap and scores zero for the value. In (c), subtracting only 45 Ω from 37 500 Ω (giving 37 455 Ω) gives the *whole* new multiplier, not the extra resistance added to the existing meter; it is not credited. In (d), using `R_m` instead of the meter's total resistance is accepted only if the answer rounds to 0.80 mA.

**b6 · Practical: Shunt Against Range (4 marks)**
A student calculated the shunt needed to give different ranges `I` for a galvanometer with `R_g = 20 Ω` and `I_g = 10 mA`.

| I / A | 0.05 | 0.10 | 0.20 | 0.50 | 1.00 |
|---|---|---|---|---|---|
| R_s / Ω | 5.00 | 2.22 | ? | 0.408 | 0.202 |

(a) Calculate the missing value of `R_s`. (b) Describe the graph of `R_s` (vertical) against `I`. (c) State which quantity should be plotted on the horizontal axis so that `R_s` gives a straight line through the origin. (d) State the gradient of that straight line and what it represents.
*Model solution:* (a) `R_s = (0.010 × 20) ÷ (0.20 − 0.010) = 0.20 ÷ 0.19 = 1.05 Ω`. (1) (b) A smooth curve falling steeply at first and then levelling off towards zero as `I` increases; it is not a straight line. (1) (c) `1 ÷ (I − I_g)`. (1) (d) Gradient `= I_g R_g = 0.010 × 20 = 0.20 V`, the p.d. across the coil at full-scale deflection. (1)
*Mark scheme note:* In (a), using `I` instead of `I − I_g` gives 1.00 Ω and loses the mark. In (b) a ruled straight line, or "inversely proportional to `I`" stated without the curve shape, is not credited. In (d) the unit (V) and the meaning are both needed.

**b7 · Practical: Precautions and Errors (3 marks)**
(a) State two precautions that were taken when the converted meters were built and tested. (b) The shunt of a home-made ammeter was joined to the coil with poor, high-resistance contacts. State and explain the effect on the ammeter's readings.
*Model solution:* (a) Any two, in the past tense: the shunt and multiplier values were calculated before any connection was made, so the coil was never overloaded (1); the shunt was joined with short, thick, tight connections of negligible resistance (1); the correct terminals and polarity were used (1); parallax error was avoided by reading the pointer square to the scale (1). (Maximum 2.) (b) The readings were too high: the contact resistance made the shunt branch effectively larger, so a bigger share of the line current passed through the coil and it deflected further than it should for that current. (1)
*Mark scheme note:* Precautions given as commands or in the future tense lose the marks. In (b) the direction (too high) and the reason (more current diverted through the coil) must both be given; "the reading is wrong" scores zero.

**b8 · The Starter-Test Mistake (2 marks)**
Tobe connects a finished ammeter of total resistance 0.050 Ω directly across the terminals of Emeka's battery (EMF 12.0 V, internal resistance 1.2 Ω) instead of in series with the starter. (a) Calculate the current that flows. (b) Explain why this is a serious mistake.
*Model solution:* (a) `I = E ÷ (r + R_A) = 12.0 ÷ (1.2 + 0.050) = 12.0 ÷ 1.25 = 9.6 A`. (1) (b) A low-resistance ammeter across the battery acts almost as a short circuit, so a current far above the meter's range flows, which can overheat and burn out the shunt and coil and heat the battery; an ammeter must always be connected in series. (1)
*Mark scheme note:* Leaving out the internal resistance in (a) gives 240 A and loses the mark. In (b) the idea of a near short circuit with a dangerously large current is required; "the meter will read wrongly" alone is not credited.

---

## Lesson 05 · Null Methods — Metre Bridge, Potentiometer & WAEC Practicals

### Part 1 · 12 Interactive MCQs (`window.LESSON_QUIZ`)

1. **[WAEC-style · Remember]** Engr. Nkechi tells Chinedu that her slide-wire potentiometer works on one simple principle. Which statement gives that principle?
   - **A.** The p.d. across a wire is the same whatever length of it is chosen.
   - **B.** With a steady current in a uniform wire, the p.d. between two points on it varies in direct proportion to the length of wire between them. ✓
   - **C.** The current in a uniform wire grows in direct proportion to its length.
   - **D.** The resistance of a wire grows in direct proportion to its cross-sectional area.
   - *Explanation:* When the same steady current flows all along a wire of even thickness and material, every centimetre has the same resistance, so each centimetre drops the same p.d.: V = kl, where k is the potential gradient in V cm⁻¹. Option A forgets that p.d. builds up with length, which is the whole reason a balance length means anything. Option C is wrong because in a single wire the current is the same at every point; it is the p.d., not the current, that depends on length. Option D turns R = ρL/A upside down: resistance falls as the area grows.

2. **[JAMB-style · Apply]** Chinedu connects a 6.3 Ω standard resistor across the left-hand gap of a metre bridge and an unknown coil across the right-hand gap. The galvanometer reads zero when the jockey is 70.0 cm from the left end. What is the resistance of the coil?
   - **A.** 14.7 Ω
   - **B.** 9.0 Ω
   - **C.** 4.4 Ω
   - **D.** 2.7 Ω ✓
   - *Explanation:* At balance the left resistance divided by the right one equals l/(100 − l); here 6.3/R = 70.0/30.0 and R = 6.3 × 30.0/70.0 = 2.7 Ω. The left gap balances against the longer side of the wire, so the left resistor must be the larger one, as it is. Option A inverts the length ratio (6.3 × 70.0/30.0), which puts the larger resistance in the wrong gap. Option B uses 100/l in place of (100 − l)/l (6.3 × 100/70.0). Option C uses l/100, comparing one side of the wire with the whole wire (6.3 × 70.0/100 = 4.4 Ω).

3. **[WAEC-style · Apply]** On Nkechi's potentiometer, a standard cell of EMF 1.08 V balances at 54.0 cm. A dry cell from Emeka's torch, connected in its place, balances at 72.5 cm on the same wire with the same driver current. What is the EMF of the dry cell?
   - **A.** 1.45 V ✓
   - **B.** 0.80 V
   - **C.** 0.37 V
   - **D.** 1.34 V
   - *Explanation:* E₁/E₂ = l₁/l₂, so E = 1.08 × 72.5/54.0 = 1.45 V. The dry cell needs a longer length to balance, so its EMF must be larger than 1.08 V. Option B inverts the ratio (1.08 × 54.0/72.5), giving a smaller EMF for the longer length. Option C uses only the difference in lengths (1.08 × 18.5/54.0). Option D stops at the length ratio (72.5/54.0) and forgets to multiply by the standard EMF.

4. **[WAEC-style · Understand]** Under the starter, Chinedu's voltmeter showed only 8.4 V across Emeka's battery, yet on the potentiometer the battery balanced at its full 12.0 V. Why does the potentiometer give the true EMF?
   - **A.** Its slide wire is much longer than a voltmeter's coil, so it is more sensitive to small voltages.
   - **B.** The driver cell adds its own EMF to the battery, making up the missing volts.
   - **C.** At the null point no current passes through the battery, so there is no Ir drop inside it and its terminal p.d. equals its EMF. ✓
   - **D.** It has a lower resistance than a voltmeter, so it draws a larger current and gets a fuller reading.
   - *Explanation:* At balance the galvanometer reads zero, so no current flows through the battery being tested. With I = 0 the lost volts Ir are zero, and V = E − Ir becomes V = E: the balance length measures the EMF itself. Option A mixes up sensitivity with the real reason, which is the zero current. Option B is wrong because at balance the driver's p.d. along the wire is opposed to the battery, not added to it. Option D reverses the idea: drawing more current would make the lost volts bigger and the reading smaller.

5. **[JAMB-style · Apply]** A cell balances at 84.0 cm on a potentiometer when it is on open circuit. When a 4.0 Ω resistor is connected across the cell, the balance length falls to 70.0 cm. What is the internal resistance of the cell?
   - **A.** 0.80 Ω ✓
   - **B.** 0.67 Ω
   - **C.** 20 Ω
   - **D.** 0.20 Ω
   - *Explanation:* r = R(l₁ − l₂)/l₂ = 4.0 × (84.0 − 70.0)/70.0 = 4.0 × 14.0/70.0 = 0.80 Ω. Option B divides by l₁ instead of l₂ (4.0 × 14.0/84.0). Option C turns the fraction upside down (4.0 × 70.0/14.0), giving a value far too large to be a cell's internal resistance. Option D forgets to multiply by R (14.0/70.0 = 0.20, which has no unit of ohms).

6. **[WAEC-style · Analyse]** A 100 cm potentiometer wire of resistance 4.0 Ω is connected in series with a 3.0 V driver accumulator (negligible internal resistance) and an 11.0 Ω resistor. At what length on the wire does a 0.060 V thermocouple balance?
   - **A.** 2.0 cm
   - **B.** 5.5 cm
   - **C.** 7.5 cm ✓
   - **D.** 2.7 cm
   - *Explanation:* The driver's 3.0 V is shared between the wire and the series resistor. I = 3.0/(4.0 + 11.0) = 3.0/15.0 = 0.20 A; V_wire = 0.20 × 4.0 = 0.80 V; k = 0.80/100 = 0.0080 V cm⁻¹; l = 0.060/0.0080 = 7.5 cm. Option A is the examiners' favourite trap: it assumes the whole 3.0 V sits across the wire (k = 0.030 V cm⁻¹). Option B leaves the wire's own 4.0 Ω out of the circuit total (I = 3.0/11.0). Option D uses the p.d. across the 11.0 Ω resistor (2.2 V) instead of the p.d. across the wire.

7. **[NECO-style · Understand]** In a Wheatstone bridge, resistors P and Q are joined in series on one side, R and S are joined in series on the other, and the galvanometer links the P–Q junction to the R–S junction. Which statement describes the balanced bridge?
   - **A.** P + Q = R + S, and the galvanometer reads zero.
   - **B.** P/Q = S/R, and the galvanometer reads zero.
   - **C.** P/Q = R/S, and the galvanometer current is at its largest.
   - **D.** P/Q = R/S, and no current flows through the galvanometer. ✓
   - *Explanation:* The bridge balances when the two junctions are at the same potential, which happens when each side divides the supply p.d. in the same ratio: P/Q = R/S. With no p.d. across it, the galvanometer carries no current (the null point). Option A adds the resistances on each side instead of comparing their ratios. Option B pairs the resistors the wrong way round. Option C has the right ratio but mistakes the null point for maximum current.

8. **[WAEC Practical · Analyse]** In a metre-bridge practical, equal lengths of two wires A and B of the same material were tested in turn. Chinedu plotted R_B (vertical axis) against R_A and got a straight line passing through the origin, of slope 2.25. What is d_A/d_B, the diameter of wire A divided by the diameter of wire B?
   - **A.** 2.25
   - **B.** 1.5 ✓
   - **C.** 0.67
   - **D.** 5.1
   - *Explanation:* For equal lengths of the same material, R ∝ 1/d², so R_B/R_A = d_A²/d_B². The slope equals R_B/R_A, so d_A/d_B = √2.25 = 1.5: wire A is the thicker one. Option A forgets to take the square root, treating R as proportional to 1/d. Option C gives d_B/d_A, the ratio upside down (1/1.5). Option D squares the slope (2.25² ≈ 5.1) instead of taking its root.

9. **[WAEC Practical · Analyse]** While comparing cells on a potentiometer, Chinedu found the standard cell's balance length first. Later in the session the driver accumulator ran down a little, but he still used his first potential gradient to work out the EMF of a cell he balanced at the end. How was that EMF affected?
   - **A.** It came out too low, because a weaker driver made the balance length shorter.
   - **B.** It was unaffected, because no current is drawn from the test cell at balance.
   - **C.** It came out too low, because the test cell supplied current through the galvanometer.
   - **D.** It came out too high, because the smaller potential gradient pushed the balance point to a longer length. ✓
   - *Explanation:* A weaker driver sends less current through the wire, so k (V per cm) falls. The test cell then needs more wire to balance, so its length l is longer than it should be, and E = k × l (with the old, larger k) comes out too high. Option A gives the wrong direction: a smaller k lengthens the balance length, it does not shorten it. Option B is true about the test cell but ignores that the wire's calibration itself has changed. Option C is wrong because at balance the test cell supplies no current.

10. **[WAEC Practical · Remember]** Which precaution for the potentiometer practical is written in a form a WAEC examiner would credit?
    - **A.** The jockey was pressed gently at each point on the wire and was not slid along it. ✓
    - **B.** I will make sure that all the connections are tight.
    - **C.** I was careful when taking all my readings.
    - **D.** The pendulum bob was given only a small angle of swing.
    - *Explanation:* A precaution must say what was actually done, in the past tense, and it must belong to this experiment; tapping the jockey stops it scraping and thinning the wire, which would spoil the uniform resistance per centimetre. Option B is in the future tense. Option C is too vague to show any real step taken. Option D belongs to a pendulum experiment, not to an electrical one.

11. **[JAMB-style · Analyse]** A metre bridge with a 3.0 Ω resistor in each gap balances at 50.0 cm. Chinedu then replaces the right-gap resistor with a 6.0 Ω coil, keeping 3.0 Ω on the left. Where is the new balance point, measured from the left end?
    - **A.** 66.7 cm
    - **B.** 33.3 cm ✓
    - **C.** 25.0 cm
    - **D.** 50.0 cm
    - *Explanation:* 3.0/6.0 = l/(100 − l), so 2l = 100 − l, 3l = 100 and l = 33.3 cm. The smaller resistor is on the left, so the left share of the wire must be the shorter one. Option A swaps the gaps, putting the balance on the wrong side of the centre. Option C halves the old length because the resistance doubled, treating l as simply inversely proportional to the right-gap resistance. Option D assumes a bridge always balances at the middle of the wire.

12. **[WAEC-style · Understand]** The potentiometer balances Emeka's battery at an EMF of 12.0 V. Under the 2.8 Ω starter, its terminal p.d. was 8.4 V. Tobe still says the battery is dead. What is the correct verdict?
    - **A.** The EMF has fallen to 8.4 V, so the battery should be thrown away.
    - **B.** The internal resistance is 8.4/3.0 = 2.8 Ω, so the plates are completely worn out.
    - **C.** The EMF is still 12.0 V; the internal resistance has risen to (12.0 − 8.4)/3.0 = 1.2 Ω, so the battery needs servicing, not dumping. ✓
    - **D.** The missing 3.6 V are lost in the connecting cables, so the battery's internal resistance is zero.
    - *Explanation:* I = V/R = 8.4/2.8 = 3.0 A; the lost volts are E − V = 12.0 − 8.4 = 3.6 V, so r = 3.6/3.0 = 1.2 Ω. The same result follows from r = R(E − V)/V = 2.8 × 3.6/8.4 = 1.2 Ω, which is the two-length formula with E and V in place of l₁ and l₂. The chemistry (EMF) is healthy; only r has risen. Option A is Tobe's error of reading the loaded terminal p.d. as the EMF. Option B divides the terminal p.d. by the current, which gives the starter's resistance, not the battery's. Option D blames the wires, but the potentiometer test and the drop inside the cell show the volts are lost across r.

### Part 2 · Home Investigation & 30-Mark Written Paper (Lesson 05)

**Part A · Home Investigation:** *Can a balance point find an unknown without a meter?*

A metre bridge never measures a resistance directly: it finds the point where nothing happens (zero galvanometer current) and reads a ratio of lengths. You will use the same null idea with a ruler balanced on a pencil to find the mass of an eraser in "bottle-cap units", using lengths only.

*You need:* a 30 cm ruler, a round pencil, about 8 identical plastic bottle caps (from pure-water or soft-drink bottles), an eraser, a flat table, your notebook and pencil.

*Safety:* Work on a flat table away from the edge; keep the caps away from small children, who could swallow them.

*Steps:*
1. Lay the pencil across the table and rest the empty ruler on it. Move the ruler until it balances level, and note the pencil's position on the ruler (the pivot). This is your "zero", like checking a meter's zero before you start.
2. Place the eraser on the ruler with its centre exactly 10.0 cm from the pivot on one side. Keep it there for the whole investigation.
3. Stack 3 caps and move the stack along the other side until the ruler balances level again. Record the distance d from the pivot to the centre of the stack.
4. Repeat with stacks of 4, 5, 6 and 8 caps. Repeat each balance twice and take the mean of d.
5. For each row, work out n × d, and then the eraser's mass in cap units: M = n × d/10.0.
6. Plot d (vertical) against 1/n and draw the best line.

*Sample results table:*

| Caps, n | d / cm (mean of 2) | 1/n | n × d / cap cm | M / caps |
|---|---|---|---|---|
| 3 | 20.2 | 0.333 | 60.6 | 6.06 |
| 4 | 14.9 | 0.250 | 59.6 | 5.96 |
| 5 | 12.1 | 0.200 | 60.5 | 6.05 |
| 6 | 9.9 | 0.167 | 59.4 | 5.94 |
| 8 | 7.5 | 0.125 | 60.0 | 6.00 |

*What a good answer shows:* the learner sees that d against n is a curve, but d against 1/n is a straight line through the origin, because n × d stays constant (about 60 cap cm), and finds the eraser's mass as about 6.0 caps from the mean of the last column or from the slope (≈ 60 cap cm ÷ 10.0 cm); the learner explains that the method is a null method: the ruler was judged only by whether it tipped or not, so no scale or spring balance was needed, just as a metre bridge needs only a zero on the galvanometer and the ratio l/(100 − l); the learner links the unknown to a standard through a ratio of lengths (M/n = d/10.0, compared with R/S = l/(100 − l)); precautions are written in the past tense (for example, the empty ruler was balanced first; each distance was measured to the centre of the stack; each balance was repeated); one error is named with its direction (for example, if the pivot had been placed off the ruler's own balance point, the ruler's weight would have helped one side, so every d on that side read too short); results are in a ruled table with units.

**Part B · Written Paper (30 marks)**

**b1 · Definitions and statements (3 marks)**
(a) State the principle behind the potentiometer. (b) State the condition for a Wheatstone bridge to be balanced. (c) What is meant by the potential gradient of a potentiometer wire?
*Model solution:* (a) If a steady current flows along a wire of uniform cross-section and material, the p.d. between any two points of the wire is directly proportional to the length between them (1). (b) The bridge is balanced when the ratio of the two resistances on one side equals the ratio of the two on the other side, P/Q = R/S, so that the galvanometer carries no current (1). (c) It is the p.d. per unit length along the wire, k = V/l, measured in V cm⁻¹ or V m⁻¹ (1). Equivalent wordings that keep the key ideas are credited.
*Mark scheme note:* In (a), "steady current" and "uniform wire" are both needed; "voltage is proportional to length" alone scores zero. In (b), the ratio with no mention of zero galvanometer current (or equal potentials at the junctions) is not credited. In (c), the unit is part of the mark.

**b2 · Why the null method wins (4 marks)**
Chinedu's voltmeter read 8.4 V across Emeka's battery while the starter was running, but Engr. Nkechi's potentiometer showed its EMF as 12.0 V. (a) Explain why the voltmeter reading is lower than the EMF. (b) Explain why the potentiometer reading is the true EMF. (c) State **one** other advantage of the potentiometer over a voltmeter for measuring a p.d.
*Model solution:* (a) While the battery delivers current, part of its EMF is used to drive that current through its own internal resistance (1), so the terminals, and the voltmeter, show only V = E − Ir, here 12.0 − 3.6 = 8.4 V (1). (b) At the balance point the galvanometer reads zero, so no current is drawn from the battery; with I = 0 there are no lost volts, so the p.d. balanced on the wire equals the EMF (1). (c) Any one: its accuracy does not depend on the calibration of a pointer scale, because it only needs a zero reading · it is more sensitive, as a small p.d. can be spread over a long length of wire · its range can be changed by adjusting the driver current (1).
*Mark scheme note:* In (a), "the voltmeter is faulty" or "volts are lost in the wires" scores zero; the two marks are for the cause (current through r) and the resulting equation, which are separate points. In (b), the answer must link zero current to zero lost volts; "it is more accurate" alone does not answer the question. In (c), do not credit an answer that repeats (b).

**b3 · Derivation (4 marks)**
A cell balances at length l₁ on a potentiometer when on open circuit, and at length l₂ when a resistor R is connected across its terminals. Show that the internal resistance of the cell is r = R(l₁ − l₂)/l₂.
*Model solution:* On open circuit the balance gives the EMF and on load it gives the terminal p.d., both with the same potential gradient k: E = kl₁ and V = kl₂, so E/V = l₁/l₂ (1). With current I in the closed circuit, E = I(R + r) and V = IR, so E/V = (R + r)/R (1). Equating the two ratios: l₁/l₂ = (R + r)/R = 1 + r/R (1). So r/R = l₁/l₂ − 1 = (l₁ − l₂)/l₂, giving r = R(l₁ − l₂)/l₂ (1).
*Mark scheme note:* The first mark needs the statement that l₁ corresponds to E and l₂ to V; swapping them loses it. The second mark is for the circuit equations, not for the length equations again. A candidate who simply quotes the result with no working scores zero.

**b4 · Calculation: metre bridge and resistivity (4 marks)**
A metre bridge has a 6.0 Ω standard resistor in its left-hand gap and a coil of constantan wire in its right-hand gap. The balance point is 37.5 cm from the left end.
(a) Calculate the resistance of the coil. (2 marks)
(b) The wire has a diameter of 0.40 mm. Taking the resistivity of constantan as 4.9 × 10⁻⁷ Ω m, calculate the length of wire in the coil. (2 marks)
*Model solution:* (a) 6.0/R = 37.5/(100 − 37.5) = 37.5/62.5 (1); R = 6.0 × 62.5/37.5 = 10.0 Ω (1). (b) A = πd²/4 = π × (4.0 × 10⁻⁴)²/4 = 1.26 × 10⁻⁷ m² (1); L = RA/ρ = (10.0 × 1.257 × 10⁻⁷)/(4.9 × 10⁻⁷) = 2.6 m (1).
*Mark scheme note:* In (a), the first mark is for the correct balance equation with the 6.0 Ω paired with the 37.5 cm length; R = 6.0 × 37.5/62.5 = 3.6 Ω (ratio inverted) scores 0 for the answer. In (b), using the diameter in place of the radius in πr², or leaving d in mm, loses the area mark; the length mark needs a unit.

**b5 · Calculation: the driver circuit trap (6 marks)**
A 100 cm potentiometer wire of resistance 8.0 Ω is connected in series with a rheostat set to 11.5 Ω and a driver accumulator of EMF 4.0 V and internal resistance 0.50 Ω.
(a) Calculate the current in the wire. (2 marks)
(b) Calculate the p.d. across the whole wire and the potential gradient. (2 marks)
(c) A cell balances on this wire at 70.0 cm. Find its EMF. (1 mark)
(d) Tobe assumed that the whole 4.0 V of the driver was across the wire. State the EMF he would have worked out for the same cell, and say whether it is too high or too low. (1 mark)
*Model solution:* (a) Total resistance = 8.0 + 11.5 + 0.50 = 20.0 Ω (1); I = 4.0/20.0 = 0.20 A (1). (b) V_wire = IR_wire = 0.20 × 8.0 = 1.6 V (1); k = 1.6/100 = 0.016 V cm⁻¹ (1). (c) E = kl = 0.016 × 70.0 = 1.12 V (1). (d) Tobe's gradient is 4.0/100 = 0.040 V cm⁻¹, giving 0.040 × 70.0 = 2.8 V, which is too high, because only 1.6 V of the 4.0 V is really across the wire (1).
*Mark scheme note:* In (a), leaving out the 0.50 Ω internal resistance gives 0.205 A and loses the first mark; the second mark may be earned on that error carried forward. In (b), the gradient needs its unit. In (d), the value without "too high" (or with "too low") scores zero.

**b6 · Practical: internal resistance by potentiometer (4 marks)**
A learner balanced a cell on open circuit at l₁ = 88.0 cm. She then connected different resistors R across the cell and recorded the new balance length l₂ each time:

| R / Ω | l₂ / cm |
|---|---|
| 1.0 | 55.0 |
| 2.0 | 67.7 |
| 4.0 | 76.5 |

(a) Calculate r = R(l₁ − l₂)/l₂ for each row, to 2 decimal places. (1 mark)
(b) Find the mean internal resistance of the cell. (1 mark)
(c) Explain why l₂ was always shorter than l₁. (1 mark)
(d) The driver accumulator ran down slightly after l₁ had been found but before the l₂ readings were taken. State the effect on the value of r obtained, and explain. (1 mark)
*Model solution:* (a) 1.0 × 33.0/55.0 = 0.60 Ω; 2.0 × 20.3/67.7 = 0.60 Ω; 4.0 × 11.5/76.5 = 0.60 Ω (1). (b) Mean r = 0.60 Ω (1). (c) With R connected, current flows through the cell, so a p.d. Ir is lost inside it; its terminal p.d. is less than its EMF, so it balances against a shorter length of wire (1). (d) r came out too low: the weaker driver lowered the potential gradient, so each l₂ was longer than it should have been, making (l₁ − l₂) too small and l₂ too large (1).
*Mark scheme note:* In (a), all three values are needed for the mark. In (b), the unit is required. In (c), "because R was added" without the lost-volts idea scores zero. In (d), a direction with no reason, or a reason with the wrong direction, scores zero.

**b7 · Good bridge practice (3 marks)**
(a) Why must a metre-bridge wire be of uniform cross-section? (1 mark)
(b) Why is a balance point near the middle of the wire preferred to one near either end? (1 mark)
(c) Why does a slightly mis-calibrated galvanometer scale not spoil a metre-bridge result? (1 mark)
*Model solution:* (a) Only then is the resistance per centimetre the same all along, so the resistances of the two parts of the wire are in the ratio of their lengths, l/(100 − l) (1). (b) Near the middle, neither l nor (100 − l) is small, so the fixed uncertainty in reading the rule (and any small resistance at the end joints) is a small percentage of each length, giving a more accurate ratio (1). (c) The method only uses the zero (null) reading of the galvanometer, not the size of a deflection, so the calibration of its scale does not enter the result (1).
*Mark scheme note:* In (a), "so that it is straight" scores zero. In (b), "it is easier to read" without the percentage-error idea is not credited. In (c), the key word is the null or zero reading.

**b8 · Precautions (2 marks)**
State **two** precautions that were taken during the potentiometer or metre-bridge experiment to get reliable readings.
*Model solution:* Any two (1 each): the key was removed after each reading so the wire did not warm up · the jockey was tapped lightly on the wire and not dragged along it · all connections were tight and the terminals were cleaned · the balance point was approached from both sides and the readings were repeated · parallax was avoided by reading the metre rule with the eye directly above the jockey.
*Mark scheme note:* Precautions must be in the past tense; "remove the key after each reading" is an instruction and loses the mark. "I was careful" or a precaution from another experiment scores zero.
