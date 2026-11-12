/* Lesson 06 · Energy in SHM and Damping
   Sort cards, position-explorer pins, the bridge steps, and the 12 quiz questions
   (03-questions.md § Lesson 06 Part 1, order and keys unchanged).
   Lab spring: m = 0.20 kg, k = 24.5 N m⁻¹. Explorer oscillator (WE1): k = 50 N m⁻¹, m = 0.50 kg, A = 0.10 m. */
(function () {
  "use strict";

  var EX = { k: 50, m: 0.50, A: 0.10 };
  function energyAt(x) {
    var E = 0.5 * EX.k * EX.A * EX.A, PE = 0.5 * EX.k * x * x, KE = Math.max(0, E - PE);
    return { x: x, E: E, PE: PE, KE: KE, v: Math.sqrt(2 * KE / EX.m) };
  }

  window.L06 = {
    EX: EX, energyAt: energyAt,

    // ---- 2A sort: kinetic, potential or both? (9 cards) ----
    bins: { "ke-max": "KE greatest", "pe-max": "PE greatest", "equal": "KE = PE" },
    items: [
      { id: "i1", emo: "⏬", name: "Pendulum bob passing its lowest point", bin: "ke-max", why: "Fastest at the centre, lowest height: all the energy is kinetic." },
      { id: "i2", emo: "⬆️", name: "Spring load at the top of its bounce", bin: "pe-max", why: "Momentarily at rest at an end: all the energy is potential." },
      { id: "i3", emo: "⬇️", name: "Spring load at the bottom of its bounce", bin: "pe-max", why: "The other end: at rest, spring most stretched, so elastic PE is greatest." },
      { id: "i4", emo: "🎯", name: "Load passing the equilibrium position", bin: "ke-max", why: "x = 0, so PE = ½kx² = 0 and the speed is ωA, the greatest." },
      { id: "i5", emo: "↔️", name: "Pendulum bob at the end of its swing", bin: "pe-max", why: "Highest point, zero speed: all potential energy." },
      { id: "i6", emo: "√2", name: "Body at x = A/√2", bin: "equal", why: "½kx² = ¼kA², exactly half the total, so KE = PE." },
      { id: "i7", emo: "⏸️", name: "The instant of zero speed", bin: "pe-max", why: "Zero speed means zero KE, so all the energy is potential (an end point)." },
      { id: "i8", emo: "0️⃣", name: "The instant of zero acceleration", bin: "ke-max", why: "a = −ω²x is zero only at x = 0, where the speed is greatest." },
      { id: "i9", emo: "📏", name: "About 71 % of the way to the end", bin: "equal", why: "0.71A ≈ A/√2: halfway in energy, not halfway in distance." }
    ],

    // ---- Make-sense position explorer pins (WE1 oscillator) ----
    pins: [
      { x: -0.10, label: "x = −0.10 m" },
      { x: -0.06, label: "x = −0.06 m" },
      { x: 0, label: "x = 0" },
      { x: 0.06, label: "x = 0.06 m" },
      { x: 0.0707, label: "x = 0.0707 m" },
      { x: 0.10, label: "x = 0.10 m" }
    ],

    // ---- The Bridge: Mallam Sule's push test (numbers filled from MassSpringKit.model in lesson.js) ----
    bridge: [
      {
        q: "Ten equal pushes, one every half-second, reach the HEALTHY shock. Where does its bounce settle?",
        o: ["Near 2 cm", "Past 6 cm", "It grows for ever"],
        a: 0,
        why: "The oil turns most of each push into heat, so the bounce levels off near 2 cm."
      },
      {
        q: "The LEAKING shock gets the same ten pushes. What happens?",
        o: ["It settles near 2 cm", "It climbs past 6 cm", "It stops after one push"],
        a: 1,
        why: "With little oil, hardly any energy is removed, so each push adds to the last and the bounce climbs past 6 cm."
      },
      {
        q: "How many times more energy is stored in a 6.2 cm bounce than in a 2.0 cm bounce?",
        o: ["About 3.1 times", "About 9.6 times", "The same"],
        a: 1,
        why: "E ∝ A², so (6.2 ÷ 2.0)² = 3.1² = 9.6: about 6.3 J against 61 J."
      }
    ]
  };

  // ---- 12 interactive MCQs (03-questions.md § Lesson 06 Part 1) ----
  window.LESSON_QUIZ = [
    {
      src: "WAEC-STYLE · UNDERSTAND",
      q: "As a pendulum bob swings through its lowest point (the equilibrium position), its",
      o: ["potential energy is greatest and its kinetic energy is zero", "kinetic energy is greatest and its potential energy is least", "kinetic and potential energies are equal", "total energy is greatest"],
      a: 1,
      e: "At the lowest point the bob moves fastest (v_max = ωA), so its KE is greatest, and its height (PE) is least. A describes the ends of the swing. C happens at x = ±A/√2, part of the way out. D is false: with no losses, the total energy is the same at every point; only its form changes."
    },
    {
      src: "WAEC-STYLE · APPLY",
      q: "A load on a spring of spring constant 80 N m⁻¹ oscillates with an amplitude of 5.0 cm. What is the total energy of the oscillation?",
      o: ["0.10 J", "0.20 J", "2.0 J", "1000 J"],
      a: 0,
      e: "E = ½kA² = ½ × 80 × (0.050)² = 40 × 0.0025 = 0.10 J. B left out the ½. C used ½kA without squaring the amplitude (40 × 0.050). D kept the amplitude in centimetres (40 × 25)."
    },
    {
      src: "NECO-STYLE · APPLY",
      q: "A 0.40 kg mass on a spring with k = 40 N m⁻¹ oscillates with amplitude 0.10 m. What is its kinetic energy when it is 0.050 m from equilibrium?",
      o: ["0.050 J", "0.20 J", "0.15 J", "0.10 J"],
      a: 2,
      e: "E = ½kA² = ½ × 40 × 0.010 = 0.20 J; PE = ½kx² = ½ × 40 × 0.0025 = 0.050 J; KE = E − PE = 0.20 − 0.050 = 0.15 J. A is the PE, not the KE. B is the total energy. D assumes the energy is shared equally halfway out, but PE grows with x², so at half the amplitude the PE is only a quarter of the total."
    },
    {
      src: "JAMB-STYLE · ANALYSE",
      q: "A body oscillates in SHM with amplitude 8.0 cm. At what distance from equilibrium are its kinetic and potential energies equal?",
      o: ["4.0 cm", "2.8 cm", "6.9 cm", "5.7 cm"],
      a: 3,
      e: "KE = PE when each is half the total: ½kx² = ½ × ½kA², so x² = A²/2 and x = A/√2 = 8.0 ÷ 1.414 = 5.7 cm (about 71 % of the way out). A is the “halfway” guess, which forgets that PE depends on x². B divided by 2√2. C is A√3/2, which is where PE is three-quarters of the total."
    },
    {
      src: "WAEC-STYLE · APPLY",
      q: "Air resistance reduces the amplitude of Zainab's pendulum from 6.0 cm to 3.0 cm. What percentage of the original oscillation energy remains?",
      o: ["25 %", "50 %", "75 %", "12.5 %"],
      a: 0,
      e: "E ∝ A², so E₂/E₁ = (3.0 ÷ 6.0)² = (½)² = ¼ = 25 %. B assumes E ∝ A. C is the percentage lost, not the percentage remaining. D cubes the ratio."
    },
    {
      src: "NECO-STYLE · UNDERSTAND",
      q: "Which statement about a <strong>lightly damped</strong> oscillation is correct?",
      o: ["It stops after one swing without crossing the equilibrium position", "Its period becomes much longer with each cycle", "Its amplitude stays the same while its period shortens", "Its amplitude decreases gradually while its period stays almost the same"],
      a: 3,
      e: "Light damping takes a little energy away each cycle, so the oscillations go on for many cycles with shrinking amplitude, but the time for each cycle hardly changes. A describes heavy or critical damping, where there is no oscillation. B is the misconception that a dying swing ticks slower. C reverses the effect; damping attacks the amplitude, not the period."
    },
    {
      src: "WAEC-STYLE · UNDERSTAND",
      q: "A good shock absorber on a vehicle is designed to be close to <strong>critically damped</strong>. This means that after a bump the suspension",
      o: ["keeps oscillating with constant amplitude", "returns to its equilibrium position in the shortest time without oscillating", "creeps back very slowly to equilibrium over many seconds", "oscillates several times with gradually decreasing amplitude"],
      a: 1,
      e: "Critical damping is the amount that brings a displaced system back to rest at equilibrium as quickly as possible with no overshoot. A is undamped (free) oscillation. C is heavy (over-) damping, which is too sluggish for a vehicle. D is light damping, which is what a worn or leaking shock absorber gives."
    },
    {
      src: "NECO-STYLE · APPLY",
      q: "A pendulum bob is released from rest 3.2 cm above its lowest point. Ignoring air resistance, what is its speed at the lowest point? (Take g = 10 m s⁻².)",
      o: ["0.64 m s⁻¹", "0.57 m s⁻¹", "0.80 m s⁻¹", "8.0 m s⁻¹"],
      a: 2,
      e: "All the PE becomes KE: mgh = ½mv², so v = √(2gh) = √(2 × 10 × 0.032) = √0.64 = 0.80 m s⁻¹. A is 2gh, with the square root forgotten. B is √(gh), with the 2 lost. D kept h in centimetres (√(2 × 10 × 3.2))."
    },
    {
      src: "WAEC-STYLE · ANALYSE",
      q: "On one set of axes, graphs of energy against displacement x are drawn for an undamped oscillator of amplitude A. Which description is correct?",
      o: ["KE and PE are both straight lines crossing at x = A/2", "PE is an inverted parabola, greatest at x = 0; KE is an upright parabola", "PE is an upright parabola, zero at x = 0; KE is an inverted parabola, zero at x = ±A; the total is a horizontal line", "The total energy is a parabola that is greatest at the ends"],
      a: 2,
      e: "PE = ½kx² is a parabola opening upwards from zero at the centre; KE = ½k(A² − x²) is an inverted parabola that falls to zero at the ends; their sum ½kA² is constant, a horizontal line. A treats energy as linear in x and puts the crossing at the wrong place. B swaps KE and PE. D forgets that, without damping, the total energy does not change."
    },
    {
      src: "JAMB-STYLE · APPLY",
      q: "A 2.0 kg mass on a spring of spring constant 200 N m⁻¹ oscillates with amplitude 5.0 cm. What is its maximum speed?",
      o: ["0.25 m s⁻¹", "0.50 m s⁻¹", "0.35 m s⁻¹", "0.71 m s⁻¹"],
      a: 1,
      e: "E = ½kA² = ½ × 200 × 0.0025 = 0.25 J, all of which is KE at the centre: ½mv² = 0.25, v = √(2 × 0.25 ÷ 2.0) = √0.25 = 0.50 m s⁻¹. (Check: ω = √(k/m) = 10 rad s⁻¹, ωA = 0.50 m s⁻¹.) A forgot the square root. C used v = √(E/m), losing the 2. D used E = kA² without the ½."
    },
    {
      src: "WAEC-STYLE · ANALYSE",
      q: "Mallam Sule says the okada's leaking shock absorber is why the bounce “builds up instead of dying”. Which explanation is correct?",
      o: ["The leaking absorber makes the spring stiffer, so the bounce frequency rises", "Oil leaking out adds mass, so the bounce becomes bigger", "A leaking absorber removes more energy each cycle than a healthy one", "With little oil, the piston slides almost freely, so hardly any energy is turned into heat each cycle; energy fed in by the road can pile up"],
      a: 3,
      e: "A healthy damper forces oil through small holes in the piston, turning bounce energy into heat in every stroke. With the oil gone, very little energy is removed (light damping), so pushes from the road that arrive in step can keep adding energy and the amplitude grows. A is wrong: the damper does not change the spring's stiffness or noticeably change the frequency. B is wrong: losing oil cannot add mass. C reverses the effect."
    },
    {
      src: "NECO-STYLE · APPLY",
      q: "With two extra crates, the okada's crates lift off once the bounce amplitude reaches 7.8 cm. How much energy is stored in the oscillation at that amplitude? (k = 3.16 × 10⁴ N m⁻¹.)",
      o: ["96 J", "192 J", "1232 J", "9.6 × 10⁵ J"],
      a: 0,
      e: "E = ½kA² = ½ × 31 600 × (0.078)² = 15 800 × 0.006 08 = 96 J. B left out the ½. C used ½kA without squaring A (15 800 × 0.078). D kept A in centimetres (15 800 × 7.8²)."
    }
  ];
})();
