/* Lesson 04 · Galvanometer Conversion — Ammeter Shunts & Voltmeter Multipliers
   Sort cards, meter-range explorer pins, the bridge reasoning, and the 12 quiz questions
   (03-questions.md § Lesson 04). Nkechi's own galvanometer is always I_g = 15 mA, R_g = 18.0 Ω. */
(function () {
  "use strict";

  // Nkechi's bench coil (the one all the bench, explorer and bridge numbers use)
  var IG = 0.015, RG = 18.0;
  function sf3(x) {
    if (!isFinite(x)) return "–";
    var a = Math.abs(x);
    if (a >= 1000) return Math.round(x).toLocaleString("en-NG").replace(/,/g, " ");
    return (+x.toPrecision(3)).toString();
  }
  function shunt(I) { return IG * RG / (I - IG); }                 // R_s
  function mult(V) { return V / IG - RG; }                         // R_m
  function rtotalV(V) { return V / IG; }                           // whole voltmeter
  function rmeterA(I) { var Rs = shunt(I); return (RG * Rs) / (RG + Rs); }   // coil ∥ shunt

  window.L04 = {
    IG: IG, RG: RG, sf3: sf3, shunt: shunt, mult: mult, rtotalV: rtotalV, rmeterA: rmeterA,

    // ---- 2A sort: Ammeter, voltmeter, or galvanometer truth? (10 cards) ----
    bins: {
      ammeter: "Ammeter (shunt in parallel)",
      voltmeter: "Voltmeter (multiplier in series)",
      galv: "Galvanometer truth"
    },
    items: [
      { id: "i1", emo: "🔀", name: "Needs a low-resistance shunt in parallel", bin: "ammeter", why: "The shunt gives most of the current an easy bypass around the coil." },
      { id: "i2", emo: "🔗", name: "Connected in series with the circuit", bin: "ammeter", why: "An ammeter carries the line current, so it goes in series." },
      { id: "i3", emo: "⬇️", name: "Ideally has very low total resistance", bin: "ammeter", why: "In series, a low resistance hardly changes the current it measures." },
      { id: "i4", emo: "🏃", name: "Most of the line current bypasses the coil", bin: "ammeter", why: "At full scale the coil keeps only I_g; the shunt takes the rest." },
      { id: "i5", emo: "🛡️", name: "Needs a high-resistance multiplier in series", bin: "voltmeter", why: "The multiplier drops the extra voltage so the coil still sees only I_g." },
      { id: "i6", emo: "📏", name: "Connected in parallel across a component", bin: "voltmeter", why: "A voltmeter reads the p.d. between two points, so it goes in parallel." },
      { id: "i7", emo: "⬆️", name: "Ideally has very high total resistance", bin: "voltmeter", why: "In parallel, a high resistance draws almost no current and barely disturbs the p.d." },
      { id: "i8", emo: "💧", name: "Draws almost no current from the circuit", bin: "voltmeter", why: "A good voltmeter's huge resistance keeps its own current tiny." },
      { id: "i9", emo: "🧭", name: "Deflects fully at a tiny current I_g", bin: "galv", why: "Full-scale deflection comes at the small current I_g (15 mA here)." },
      { id: "i10", emo: "🌀", name: "Has its own coil resistance R_g", bin: "galv", why: "The fine moving coil has resistance R_g (18 Ω here) that must be allowed for." }
    ],

    // ---- Make-sense explorer pins (#pos-explorer): the SAME 15 mA, 18 Ω coil ----
    pins: [
      { mode: "ammeter", target: 1.0, label: "1.0 A ammeter" },
      { mode: "ammeter", target: 2.0, label: "2.0 A ammeter" },
      { mode: "ammeter", target: 3.0, label: "3.0 A ammeter" },
      { mode: "ammeter", target: 5.0, label: "5.0 A ammeter" },
      { mode: "voltmeter", target: 5.0, label: "5.0 V voltmeter" },
      { mode: "voltmeter", target: 10.0, label: "10 V voltmeter" },
      { mode: "voltmeter", target: 40.0, label: "40 V voltmeter" },
      { mode: "voltmeter", target: 150.0, label: "150 V voltmeter" }
    ],

    // ---- The Bridge: kit out Nkechi's own 15 mA, 18 Ω coil, two instruments ----
    bridge: [
      {
        q: "To read the 3 A starter line safely, what do you add to Nkechi's 15 mA, 18 Ω coil?",
        o: ["A small shunt in parallel", "A large resistor in series", "Nothing — push the 3 A straight through it"],
        a: 0,
        why: "A small shunt in parallel gives the 3 A an easy bypass, so the coil still keeps only its safe 15 mA."
      },
      {
        q: "What shunt turns that coil into a 3.0 A ammeter?",
        o: ["0.0905 Ω", "0.270 Ω", "2 650 Ω"],
        a: 0,
        why: "R_s = I_g R_g ÷ (I − I_g) = 0.270 ÷ 2.985 = 0.0905 Ω. The 0.270 Ω is only I_g R_g, the coil's full-scale p.d."
      },
      {
        q: "To read the 40 V bank, what do you add to the SAME coil?",
        o: ["A 2 650 Ω multiplier in series", "Another shunt in parallel", "The same 0.0905 Ω resistor"],
        a: 0,
        why: "R_m = V ÷ I_g − R_g = 2 667 − 18 = 2 649 ≈ 2 650 Ω, in series — and you always subtract R_g to get the resistor you add."
      }
    ]
  };

  // ---- 12 interactive MCQs (03-questions.md § Lesson 04 Part 1) ----
  window.LESSON_QUIZ = [
    {
      q: "To turn a sensitive galvanometer into an ammeter, what must be connected to it?",
      o: ["A large resistor in series with the coil", "A large resistor in parallel with the coil", "A small resistor in parallel with the coil", "A small resistor in series with the coil"],
      a: 2,
      e: "A small resistor (the shunt) in parallel offers the current an easy bypass, so only the tiny full-scale current I_g passes through the delicate coil. A is the voltmeter conversion (a multiplier). B would carry very little current, protecting nothing. D puts the small resistor in the coil's own path, so the full line current would still flow through the coil and burn it out."
    },
    {
      q: "Why should a good ammeter have a very low resistance?",
      o: ["So that putting it in series hardly changes the current it is measuring", "So that it draws hardly any current from the circuit it is connected across", "So that the whole line current can pass safely through its coil", "So that it can be connected in parallel with the component under test"],
      a: 0,
      e: "An ammeter is inserted in series, so its resistance adds to the circuit; a very low value leaves the current almost unchanged. B is the reason a voltmeter needs a high resistance. C is false: in a converted ammeter most of the current flows through the shunt, not the coil. D gives the wrong position; an ammeter in parallel would act almost as a short circuit."
    },
    {
      q: "A galvanometer has a coil resistance of 9.8 Ω and gives full-scale deflection at 20 mA. What shunt resistance converts it into an ammeter reading up to 0.50 A?",
      o: ["0.392 Ω", "235 Ω", "0.196 Ω", "0.408 Ω"],
      a: 3,
      e: "I_g = 0.020 A; the shunt carries I − I_g = 0.48 A; equal p.d. gives R_s = I_g R_g ÷ (I − I_g) = (0.020 × 9.8) ÷ 0.48 = 0.196 ÷ 0.48 = 0.408 Ω. A divided by the full 0.50 A instead of the shunt current. B turned the formula upside down. C is the coil p.d. in volts, not a resistance."
    },
    {
      q: "A galvanometer of coil resistance 75 Ω gives full-scale deflection at 2.5 mA. How is it converted into a voltmeter reading up to 20 V?",
      o: ["8 000 Ω in series", "7 925 Ω in series", "8 075 Ω in series", "7 925 Ω in parallel"],
      a: 1,
      e: "Total resistance needed R_total = V ÷ I_g = 20 ÷ 0.0025 = 8 000 Ω; the coil supplies 75 Ω, so the multiplier is R_m = 8 000 − 75 = 7 925 Ω, in series. A forgot to subtract R_g. C added R_g instead of subtracting it. D has the right value in the wrong position."
    },
    {
      q: "An ammeter is made by connecting a 0.10 Ω shunt across a galvanometer of coil resistance 40 Ω. When the ammeter reads its full scale of 4.0 A, what current flows through the coil?",
      o: ["0.40 A", "3.99 A", "1600 A", "10 mA"],
      a: 3,
      e: "Coil and shunt share the same p.d.: 40·I_g = 0.10(4.0 − I_g), so 40.1·I_g = 0.40 and I_g = 0.00998 A ≈ 10 mA. A is the p.d. across the shunt read as a current. B is the current through the shunt, not the coil. C used the resistance ratio the wrong way; the larger resistance takes the smaller current."
    },
    {
      q: "A galvanometer of coil resistance 60 Ω reaches full-scale deflection when the p.d. across its coil is 30 mV. What multiplier converts it into a 15 V voltmeter?",
      o: ["30 000 Ω", "500 Ω", "29 940 Ω", "2 940 Ω"],
      a: 2,
      e: "Find I_g first: I_g = V_g ÷ R_g = 0.030 ÷ 60 = 5.0 × 10⁻⁴ A. Then R_total = 15 ÷ (5.0 × 10⁻⁴) = 30 000 Ω, and R_m = 30 000 − 60 = 29 940 Ω. A is the total resistance, R_g not subtracted. B divided the range by the coil's p.d. instead of its current. D came from a factor-of-ten slip on 30 mV."
    },
    {
      q: "A galvanometer of coil resistance 100 Ω is fitted with a 0.20 Ω shunt. What is the resistance of the finished ammeter, as seen by the circuit?",
      o: ["About 0.20 Ω (just under the shunt value)", "100.2 Ω", "100 Ω", "50.1 Ω"],
      a: 0,
      e: "Coil and shunt are in parallel: R = (100 × 0.20) ÷ (100 + 0.20) = 20 ÷ 100.2 = 0.1996 Ω ≈ 0.20 Ω. A parallel pair is always a little smaller than its smaller member. B added them as if in series. C ignored the shunt. D averaged them, which is meaningless for a parallel pair."
    },
    {
      q: "Two 10 kΩ resistors are in series across a 12.0 V supply of negligible internal resistance. Chinedu connects a voltmeter of total resistance 10 kΩ across one of the resistors. What does it read?",
      o: ["6.0 V", "4.0 V", "8.0 V", "12.0 V"],
      a: 1,
      e: "The voltmeter in parallel with one 10 kΩ resistor makes a 5.0 kΩ combination; the supply now sees 10 + 5.0 = 15 kΩ, so the p.d. across the combination is 12.0 × 5.0 ÷ 15 = 4.0 V. A low-resistance voltmeter draws current and pulls the reading down. A is the ideal (infinite-resistance) reading. C is the p.d. across the other resistor. D is the whole supply p.d."
    },
    {
      q: "A voltmeter reads up to 5.0 V and has a total resistance of 1 000 Ω. How can its range be extended to 25 V?",
      o: ["Add 4 000 Ω in series", "Add 5 000 Ω in series", "Add 4 000 Ω in parallel", "Add 200 Ω in series"],
      a: 0,
      e: "Full-scale current I_g = 5.0 ÷ 1 000 = 0.005 A. For 25 V the total resistance must be 25 ÷ 0.005 = 5 000 Ω, so the extra series resistance is 5 000 − 1 000 = 4 000 Ω. B is the new total, not the resistor added. C has the right value but the wrong position. D divided the meter's resistance by the range factor, muddling it with the shunt idea."
    },
    {
      q: "When building a voltmeter, Tobe used the value V ÷ I_g as the multiplier, forgetting to subtract the coil resistance. How did his finished voltmeter read when tested against a standard meter?",
      o: ["Too high, because more current passed through the coil than intended", "Exactly right, because the coil resistance is always too small to matter", "Too high, because the meter drew extra current from the circuit", "Too low, because its total resistance was larger than V ÷ I_g, so the coil carried less than I_g at the intended full-scale voltage"],
      a: 3,
      e: "Tobe's meter has total resistance V/I_g + R_g, larger than needed, so at any p.d. the coil current (and the deflection) is slightly smaller than it should be, and every reading comes out too low. A and C reverse the effect: a larger resistance means less current. B is wrong: the error is small only when R_g is tiny compared with V/I_g; for a low range it can be large, and WAEC penalises the omission."
    },
    {
      q: "From her drawer, Engr. Nkechi picks a more sensitive 25 mA galvanometer (not her 15 mA one) and converts it into a 6.0 A ammeter. What percentage of the line current passes through the shunt at full scale?",
      o: ["0.42 %", "99.6 %", "50 %", "24 %"],
      a: 1,
      e: "The coil takes I_g = 0.025 A, so the shunt takes 6.0 − 0.025 = 5.975 A, which is 5.975 ÷ 6.0 × 100 % = 99.6 % of the line current. A is the share through the coil. C assumes an equal split, true only for equal resistances. D treated 25 mA as 25 A, a unit slip."
    },
    {
      q: "To test Emeka's 12 V battery and its starter line, Nkechi reaches for a spare galvanometer from her drawer (not her 15 mA, 18 Ω coil) of coil resistance 30 Ω and full-scale current 1.0 mA. She needs a 0–15 V voltmeter and a 0–5.0 A ammeter. Which choice is correct?",
      o: ["Shunt of 14 970 Ω in series for the voltmeter; multiplier of 0.0060 Ω in parallel for the ammeter", "Multiplier of 15 000 Ω in series; shunt of 0.0060 Ω in parallel", "Multiplier of 14 970 Ω in series; shunt of 0.0060 Ω in parallel", "Multiplier of 14 970 Ω in parallel; shunt of 0.0060 Ω in series"],
      a: 2,
      e: "Voltmeter: R_m = V ÷ I_g − R_g = 15 ÷ 0.0010 − 30 = 15 000 − 30 = 14 970 Ω, in series. Ammeter: R_s = I_g R_g ÷ (I − I_g) = (0.0010 × 30) ÷ 4.999 = 0.0060 Ω, in parallel. A swaps the names. B forgot to subtract R_g. D has both resistors in the wrong positions."
    }
  ];
})();
