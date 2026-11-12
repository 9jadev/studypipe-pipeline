/* Lesson 01 · Things That Repeat — periodic motion, oscillation and its measures.
   Content data + the 12 MCQs (window.LESSON_QUIZ) from 03-questions.md § Lesson 01 (order and keys unchanged).
   Live bench / zoom / explorer numbers come from the kit models (PendulumKit.model, MassSpringKit.model). */
(function () {
  "use strict";

  window.L01 = {
    // ---- 2A Sort game · "Does it repeat, and does it go to-and-fro?" ----
    bins: {
      osc: "Oscillation (repeats, to-and-fro about a rest position)",
      periodic: "Periodic only (repeats, but goes round)",
      non: "Does not repeat"
    },
    items: [
      { id: "swing", name: "Playground swing in a compound", emo: "🛝", bin: "osc", why: "It goes to and fro through its lowest point again and again, so it oscillates." },
      { id: "carrier", name: "Okada carrier bobbing on its spring", emo: "🏍️", bin: "osc", why: "The carrier moves up and down about its rest level, repeating at its own steady rhythm." },
      { id: "guitar", name: "Plucked guitar string", emo: "🎸", bin: "osc", why: "The string vibrates back and forth across its straight rest line many times a second." },
      { id: "testtube", name: "Weighted test-tube bobbing upright in water", emo: "🧪", bin: "osc", why: "It sinks a little, rises a little, and keeps moving to and fro about its floating level." },
      { id: "fan", name: "Ceiling-fan blade", emo: "🌀", bin: "periodic", why: "It comes round to the same place at regular intervals, but it circles; it never swings back and forth." },
      { id: "minute", name: "Minute hand of a wall clock", emo: "🕰️", bin: "periodic", why: "It repeats every hour, but it goes round and round, not to and fro about a rest position." },
      { id: "earth", name: "The Earth spinning once a day", emo: "🌍", bin: "periodic", why: "The spin repeats every day, so it is periodic, but it is a rotation, not an oscillation." },
      { id: "mango", name: "Ripe mango falling from a tree", emo: "🥭", bin: "non", why: "It falls once and stops; nothing repeats." },
      { id: "car", name: "A car speeding up along the expressway", emo: "🚗", bin: "non", why: "Its motion keeps changing and never comes back to repeat itself." },
      { id: "ball", name: "A ball rolling down a slope and away", emo: "⚽", bin: "non", why: "It rolls away once; there is no repeating pattern and no rest position it returns to." }
    ],

    // ---- Make Sense · Position Explorer: one swing of the l = 0.80 m pendulum (T from PendulumKit.model) ----
    pins: [
      { at: "A", frac: 0, label: "Start at end A", dir: "momentarily at rest, about to swing towards O", cycle: "0 (start)" },
      { at: "O", frac: 0.25, label: "First pass through O", dir: "moving fastest, heading towards B", cycle: "¼ of a cycle" },
      { at: "B", frac: 0.5, label: "Other end B", dir: "momentarily at rest, about to swing back", cycle: "½ of a cycle" },
      { at: "O", frac: 0.75, label: "Back through O", dir: "moving fastest, now heading towards A", cycle: "¾ of a cycle" },
      { at: "A", frac: 1, label: "Back at A", dir: "at rest again, moving the same way as at the start", cycle: "1 complete oscillation" }
    ],

    // ---- The Bridge: which period do you trust? ----
    bridgeQ: {
      q: "Which value of the okada's period should Zainab report?",
      o: [
        "The one-bounce timing: it measures a single bounce directly",
        "The twenty-bounce timing divided by 20, because the reaction error is shared over 20 bounces",
        "The average of the shortest and longest one-bounce timings"
      ],
      a: 1,
      why: "Each press of the stopwatch carries a reaction delay of a few tenths of a second. On one bounce of 0.5 s that is a huge fraction; spread over 20 bounces (10 s) it becomes tiny."
    }
  };

  // ---- 12 MCQs · 03-questions.md § Lesson 01 Part 1 (order and keys unchanged) ----
  window.LESSON_QUIZ = [
    { q: "On the way to the farm, Zainab lists four motions she can see. Which one is an <em>oscillation</em>?",
      o: ["The blade of the ceiling fan in the farm office", "A ripe mango dropping from its branch", "Her little brother on the swing in the compound", "A lorry speeding up along the expressway"],
      a: 2,
      e: "An oscillation is a to-and-fro motion that repeats about a fixed rest position. The swing goes back and forth through its lowest point again and again, so it oscillates. A repeats at regular intervals (it is periodic) but goes round in a circle; it never comes back along the same path towards a rest position. B and D do not repeat at all, so they are neither periodic nor oscillatory." },
    { q: "Chinedu times 30 complete oscillations of a pendulum and his stopwatch reads 48.0 s. What is the period of the pendulum?",
      o: ["1.60 s", "0.625 s", "1440 s", "0.80 s"],
      a: 0,
      e: "Period = time for one complete oscillation: <code>T = t/n = 48.0 ÷ 30 = 1.60 s</code>. B (0.625) is n/t, which is the frequency in hertz, not the period in seconds. C multiplied the time by the number of oscillations. D halves the correct value, which is what happens if every half-swing is counted as a whole oscillation." },
    { q: "The frame of a corn-grinding machine in Bodija market vibrates 1500 times every minute. What is the period of the vibration?",
      o: ["25 s", "0.040 s", "6.7 × 10⁻⁴ s", "0.40 s"],
      a: 1,
      e: "First change to vibrations per second: <code>f = 1500 ÷ 60 = 25 Hz</code>. Then <code>T = 1/f = 1 ÷ 25 = 0.040 s</code>. A gives the frequency's number (25) with the unit of period: f and T have been confused. C is 1 ÷ 1500, which is the period in <em>minutes</em>; the minute was never changed to 60 s. D is a decimal-place slip (1 ÷ 2.5)." },
    { q: "The bob of a pendulum swings between two marks on the bench that are 16 cm apart. What is its amplitude?",
      o: ["16 cm", "32 cm", "4.0 cm", "8.0 cm"],
      a: 3,
      e: "Amplitude is the greatest displacement <em>from the rest position</em>, which lies midway between the two end points: <code>A = 16 ÷ 2 = 8.0 cm</code>. A is the end-to-end distance, the most common slip. B is the distance covered going there and back (2 × 16 cm counts one full oscillation as 32 cm, which is 4A). C halves twice." },
    { q: "The loaded okada's rear bounces with a period of 0.50 s. What is its angular frequency?",
      o: ["3.14 rad s⁻¹", "12.6 rad s⁻¹", "0.080 rad s⁻¹", "4.0 rad s⁻¹"],
      a: 1,
      e: "<code>ω = 2π/T = 6.283 ÷ 0.50 = 12.6 rad s⁻¹</code> (the same as 2πf with f = 2.0 Hz). A multiplied 2π by T instead of dividing (2π × 0.50). C turned the fraction upside down (T ÷ 2π). D used 2/T and forgot the π." },
    { q: "A pendulum bob is released at end-point A, passes the rest position O, reaches the other end B and comes back. Which path is <strong>one complete oscillation</strong>?",
      o: ["A → O → B", "A → O", "A → O → B → O → A", "O → B → O"],
      a: 2,
      e: "One complete oscillation ends when the bob is back at its starting point <em>moving in the same direction</em>. Starting from A, that means A → O → B → O → A. A is only half an oscillation (a \"swing\" one way); B is a quarter; D is also only half, since the bob ends at O moving the opposite way from the way it started." },
    { q: "Why does Mrs Okafor ask the class to time 20 oscillations instead of just one?",
      o: ["The reaction-time error at the start and stop is shared over 20 periods, so the period found is far more accurate", "The pendulum swings faster after the first few oscillations, so the later ones are more typical", "Timing 20 removes the reaction-time error completely", "The stopwatch cannot measure a time as short as one period"],
      a: 0,
      e: "Each press of the stopwatch carries roughly the same reaction delay, however long the timing lasts. Spread over 20 periods, that fixed error becomes about one-twentieth as large a fraction of the period. B is false: the period stays the same even as the swing dies down. C goes too far: the error gets smaller but does not disappear. D is false: a stopwatch reads to 0.01 s, so it can show one period; the difficulty is human reaction time, not the watch." },
    { q: "Tunde's reaction error is about 0.3 s and the true period of a pendulum is 1.5 s. If he times 20 oscillations, roughly what percentage error does his reaction time add to the period?",
      o: ["20 %", "6.0 %", "0.050 %", "1.0 %"],
      a: 3,
      e: "Twenty oscillations take <code>20 × 1.5 = 30 s</code>, and the same 0.3 s error is now <code>(0.3 ÷ 30) × 100 = 1.0 %</code>. A (20 %) is the error for timing a single oscillation, (0.3 ÷ 1.5) × 100. B multiplied the 0.3 s error by 20 and read the result, 6.0, as a percentage. C divided by 20 twice." },
    { q: "Dayo's carrier bounces between two points 6.0 cm apart with a period of 0.50 s. How far does the carrier travel in 2.0 s?",
      o: ["12 cm", "24 cm", "48 cm", "96 cm"],
      a: 2,
      e: "Amplitude <code>A = 6.0 ÷ 2 = 3.0 cm</code>. In one oscillation the carrier moves out, back, out the other way and back: <code>4A = 12 cm</code>. In 2.0 s there are <code>2.0 ÷ 0.50 = 4</code> oscillations, so <code>distance = 4 × 12 = 48 cm</code>. A is the distance for only one oscillation. B used 2A (6 cm) per oscillation, forgetting the return half. D took the 6.0 cm end-to-end distance as the amplitude (4 × 4 × 6.0 cm)." },
    { q: "Which motion is periodic but <strong>not</strong> an oscillation?",
      o: ["A plucked guitar string", "The minute hand of a wall clock", "A weighted test-tube bobbing upright in water", "The okada carrier bouncing on its spring"],
      a: 1,
      e: "The minute hand repeats its motion every hour, so it is periodic, but it goes round and round; it never moves to and fro about a rest position. A, C and D all move back and forth through a rest (equilibrium) position, so they are oscillations as well as periodic." },
    { q: "Zainab starts and stops her stopwatch as the bob passes the chalk mark at its rest position rather than at the end of the swing. Why is this better?",
      o: ["The bob is momentarily at rest at the mark, so the instant is easy to see", "The bob moves slowest at the mark, so there is more time to press the button", "Timing from the mark makes the amplitude larger", "The bob is moving fastest at the mark, so the moment it passes is sharp and easy to judge"],
      a: 3,
      e: "At the rest position the bob is moving fastest, so it crosses the mark in a very short time and the start and stop instants are sharp. A and B have the misconception the wrong way round: the bob is momentarily at rest, and slowest, at the <em>ends</em> of the swing, where it lingers and makes the exact turning instant hard to judge. C is unrelated: where you time from cannot change the amplitude." },
    { q: "With two extra crates on the carrier, Zainab finds that 20 bounces of the parked okada take 11.2 s. What is the new bounce frequency?",
      o: ["1.79 Hz", "0.56 Hz", "2.0 Hz", "224 Hz"],
      a: 0,
      e: "<code>T = t/n = 11.2 ÷ 20 = 0.56 s</code>, then <code>f = 1/T = 1 ÷ 0.56 = 1.79 Hz</code> (or directly f = n/t = 20 ÷ 11.2 = 1.79 Hz). B is the period, stopped one step early and given the wrong unit. C is the frequency with the usual load (20 in 10.0 s), not the new one. D multiplied 20 by 11.2." }
  ];
  window.L01.quiz = window.LESSON_QUIZ;
})();
