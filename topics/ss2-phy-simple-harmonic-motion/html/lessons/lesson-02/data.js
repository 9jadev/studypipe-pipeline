/* Lesson 02 · The Pull Back to the Middle — restoring force, the SHM condition and the loaded spring.
   Sort cards (Is it simple harmonic?), position-explorer pins, bridge answers and the 12 quiz questions
   (03-questions.md § Lesson 02 Part 1 → window.LESSON_QUIZ, order and keys unchanged).
   No bench numbers live here: every reading comes from MassSpringKit.model (mass-spring v2). */
(function () {
  "use strict";

  window.L02 = {
    // ---- the lab spring and the okada (story model; 02-lesson.md) ----
    k: 24.5,                 // N m⁻¹, light spring, own mass ignored
    g: 9.8,
    loads: [0.050, 0.100, 0.150, 0.200, 0.250],   // kg (hanger = first 50 g)
    okadaMasses: [200, 250],                      // kg; k = 3.16 × 10⁴ N m⁻¹ (model)

    // ---- 2A sort: Is it simple harmonic? (3 bins, 11 cards) ----
    bins: {
      shm: "Simple harmonic",
      "periodic-not-shm": "Repeats, but not SHM",
      "not-osc": "Not an oscillation"
    },
    items: [
      { id: "spring", name: "A mass bobbing on a spiral spring", bin: "shm", emo: "🌀", why: "The spring pulls back with F = −kx: proportional to the displacement and towards the middle." },
      { id: "bifilar", name: "A bar hung by two parallel threads, twisted a little and released", bin: "shm", emo: "🪢", why: "For a small twist the threads give a turning pull back that grows with the twist, so it is SHM." },
      { id: "pendulum", name: "A simple pendulum swinging through a small angle", bin: "shm", emo: "⏱️", why: "The weight component mg sin θ pulls it back and, for small angles, is proportional to the displacement." },
      { id: "testtube", name: "A weighted test-tube bobbing upright in water", bin: "shm", emo: "🧪", why: "Push it down x and the extra upthrust (∝ x) pushes it back up towards its floating level." },
      { id: "fork", name: "The prong of a struck tuning fork", bin: "shm", emo: "🎵", why: "The bent steel pulls the prong back with a force proportional to how far it is bent." },
      { id: "okada", name: "The okada's rear end bouncing gently on its coil spring", bin: "shm", emo: "🏍️", why: "The rear coil spring is a loaded spring: F = −kx, so the gentle bounce is SHM." },
      { id: "ball", name: "A ball bouncing up and down on a concrete floor", bin: "periodic-not-shm", emo: "🏀", why: "It repeats, but between bounces only its constant weight acts; the floor pushes only at impact." },
      { id: "trough", name: "A ball rolling to and fro in a V-shaped trough", bin: "periodic-not-shm", emo: "📐", why: "The slope force is the same size at every point, not proportional to the displacement." },
      { id: "fan", name: "A ceiling-fan blade going round", bin: "periodic-not-shm", emo: "🌬️", why: "It repeats, but it goes round in a circle; nothing pulls it back to a middle point." },
      { id: "mango", name: "A mango falling from the tree", bin: "not-osc", emo: "🥭", why: "It falls once and stops. No restoring force, no repetition." },
      { id: "bus", name: "A bus moving along the road at steady speed", bin: "not-osc", emo: "🚌", why: "Steady motion in one direction: nothing pulls it back, nothing repeats." }
    ],

    // ---- position explorer (#pos-explorer): mass pins on the 24.5 N m⁻¹ spring + the two okada loads ----
    pins: [
      { key: "50", label: "50 g", m: 0.050, kind: "lab" },
      { key: "100", label: "100 g", m: 0.100, kind: "lab" },
      { key: "150", label: "150 g", m: 0.150, kind: "lab" },
      { key: "200", label: "200 g", m: 0.200, kind: "lab" },
      { key: "250", label: "250 g", m: 0.250, kind: "lab" },
      { key: "ok200", label: "Okada 200 kg", m: 200, kind: "okada" },
      { key: "ok250", label: "Okada 250 kg", m: 250, kind: "okada" }
    ],

    // ---- bridge (#bridge): load the okada with 200 kg then 250 kg ----
    bridge: {
      answers: { bounce: "still", period: "longer", freq: "1_8" }
    }
  };

  window.LESSON_QUIZ = [
    {
      q: "Which statement is Hooke's law?",
      o: [
        "The extension of a spring is the same whatever load hangs on it",
        "Provided the elastic limit is not exceeded, the extension of a spring is directly proportional to the force stretching it",
        "The force in a spring is inversely proportional to its extension",
        "A spring always returns to its original length, however large the load"
      ],
      a: 1,
      e: "Hooke's law says F = kx: double the stretching force and the extension doubles, as long as the elastic limit is not passed. A denies any link between load and stretch. C has the proportion upside down. D ignores the elastic limit; overloaded beyond it, a spring is permanently stretched and the law no longer holds."
    },
    {
      q: "A 0.60 kg load hung on a spiral spring stretches it by 12.0 cm. What is the spring constant? (Take g = 10 m s⁻².)",
      o: ["0.50 N m⁻¹", "5.0 N m⁻¹", "0.020 N m⁻¹", "50 N m⁻¹"],
      a: 3,
      e: "The stretching force is the weight: F = mg = 0.60 × 10 = 6.0 N. The extension in metres is x = 0.120 m. So k = F/x = 6.0 ÷ 0.120 = 50 N m⁻¹. A kept the extension in centimetres (6.0 ÷ 12). B used the mass instead of the weight (0.60 ÷ 0.120), forgetting g. C is x/F, the formula turned upside down."
    },
    {
      q: "A motion is simple harmonic when",
      o: [
        "the acceleration is directly proportional to the displacement from a fixed point and always directed towards that point",
        "the velocity is directly proportional to the displacement from a fixed point",
        "the acceleration is constant and directed towards a fixed point",
        "the acceleration is directly proportional to the displacement and directed away from the fixed point"
      ],
      a: 0,
      e: "The defining condition is a = −ω²x: the acceleration (and the restoring force) grows in step with the displacement and points back towards the equilibrium position. B uses velocity, which is actually greatest where the displacement is zero. C describes a ball rolling in a V-shaped trough: it repeats, but its acceleration does not grow with displacement, so it is not SHM. D has the right size rule but the wrong direction; a push away from the centre would drive the body further off instead of bringing it back."
    },
    {
      q: "For a body in simple harmonic motion, a graph of acceleration a (vertical) against displacement x (horizontal) is",
      o: [
        "a horizontal straight line",
        "a straight line through the origin with a positive gradient",
        "a straight line through the origin with a negative gradient",
        "a sine curve"
      ],
      a: 2,
      e: "Since a = −ω²x, a is directly proportional to x with a negative constant, so the graph is a straight line through the origin with gradient −ω². A would mean the acceleration never changes. B leaves out the minus sign, so the acceleration would point away from the centre. D is what you get when x or a is plotted against time, not against each other."
    },
    {
      q: "A 0.80 kg mass bounces on a spring of spring constant 20 N m⁻¹. What is its period?",
      o: ["1.26 s", "0.25 s", "0.20 s", "31.4 s"],
      a: 0,
      e: "T = 2π√(m/k) = 2π√(0.80 ÷ 20) = 2π√0.040 = 2 × 3.142 × 0.20 = 1.26 s. B forgot the square root (2π × 0.040). C forgot the 2π (√0.040 = 0.20). D put k over m (2π√(20 ÷ 0.80) = 2π × 5 = 31.4 s): a heavier load would then give a shorter period, which the bench shows is false."
    },
    {
      q: "A 0.30 kg load on a spring has a period of 0.80 s. The load is replaced by a 1.20 kg load on the same spring. What is the new period?",
      o: ["3.2 s", "0.40 s", "1.6 s", "0.80 s"],
      a: 2,
      e: "T ∝ √m, so T₂/T₁ = √(m₂/m₁) = √(1.20 ÷ 0.30) = √4 = 2, and T₂ = 2 × 0.80 = 1.6 s. A multiplied by 4, forgetting the square root. B divided by 2, as if more mass gave a faster bounce (Tunde's \"heavier is steadier\" idea in disguise). D treats the spring like a pendulum, whose period does not depend on mass; for a spring it does."
    },
    {
      q: "In the restoring-force equation F = −kx for a loaded spring, the minus sign shows that",
      o: [
        "the spring constant k is negative",
        "the force always acts in the opposite direction to the displacement, back towards equilibrium",
        "the force becomes smaller as the displacement grows",
        "the spring is being compressed, not stretched"
      ],
      a: 1,
      e: "The minus sign is about direction: displace the load downwards and the spring pulls it up; push it upwards and the net force acts down. Either way it points back to the equilibrium position. A is false: k is a positive constant (force per metre). C contradicts the equation, since F grows with x. D is wrong because the sign applies on both sides of equilibrium, whether the spring is stretched or squashed."
    },
    {
      q: "In Zainab's spiral-spring practical, the graph of T² (vertical) against m (horizontal) is a straight line through the origin with slope 0.80 s² kg⁻¹. What is the spring constant?",
      o: ["0.80 N m⁻¹", "1.25 N m⁻¹", "0.020 N m⁻¹", "49 N m⁻¹"],
      a: 3,
      e: "Squaring T = 2π√(m/k) gives T² = (4π²/k) m, so the slope is 4π²/k and k = 4π²/slope = 39.48 ÷ 0.80 = 49 N m⁻¹. A takes the slope itself as k. B is 1/slope, forgetting the 4π². C is slope ÷ 4π², the rearrangement turned upside down."
    },
    {
      q: "The okada's rear spring (k = 3.16 × 10⁴ N m⁻¹) carries 200 kg and bounces at 2.0 Hz. What total load on the same spring would make it bounce at 1.5 Hz?",
      o: ["356 kg", "267 kg", "150 kg", "113 kg"],
      a: 0,
      e: "f = (1/2π)√(k/m), so f ∝ 1/√m and m ∝ 1/f². Then m₂ = m₁ × (f₁/f₂)² = 200 × (2.0 ÷ 1.5)² = 200 × 1.778 = 356 kg. (Directly: m = k/(4π²f²) = 31 600 ÷ (39.48 × 2.25) = 356 kg.) B used m ∝ 1/f without squaring (200 × 2.0 ÷ 1.5). C has the ratio upside down and unsquared (200 × 1.5 ÷ 2.0), so it lowers the load. D squared the ratio the wrong way up (200 × (1.5 ÷ 2.0)²): a lighter load would raise the frequency."
    },
    {
      q: "Which change would <strong>lower</strong> the bounce frequency of a load on a spiral spring?",
      o: [
        "Replacing the spring with a stiffer one",
        "Pulling the load down further before releasing it",
        "Releasing it with a smaller amplitude",
        "Adding more slotted masses to the hanger"
      ],
      a: 3,
      e: "f = (1/2π)√(k/m): more mass gives a lower frequency. A raises k, which raises f. B and C change the amplitude only; in SHM the period and frequency do not depend on the amplitude, so neither changes f."
    },
    {
      q: "A 0.25 kg load on a spring of spring constant 40 N m⁻¹ is 3.0 cm below its equilibrium position. What is its acceleration at that instant?",
      o: [
        "4.8 m s⁻², directed downwards, away from equilibrium",
        "4.8 m s⁻², directed upwards, towards equilibrium",
        "1.2 m s⁻², directed upwards",
        "480 m s⁻², directed upwards"
      ],
      a: 1,
      e: "a = −(k/m)x = −(40 ÷ 0.25) × 0.030 = −160 × 0.030 = −4.8 m s⁻²; the minus sign means the acceleration is opposite to the displacement, so the load (below equilibrium) accelerates upwards. A has the right size but the wrong direction. C is kx = 40 × 0.030 = 1.2 N, the restoring force, not the acceleration (it was not divided by m). D kept x in centimetres (160 × 3.0)."
    },
    {
      q: "Which of these repeating motions is <strong>not</strong> simple harmonic?",
      o: [
        "A small-angle simple pendulum",
        "A weighted test-tube bobbing upright in water",
        "A ball bouncing up and down on a concrete floor",
        "A load bobbing gently on a spiral spring"
      ],
      a: 2,
      e: "The bouncing ball repeats, but between bounces the only force on it is its weight, which is constant; the floor pushes only during the brief impact. So its acceleration does not grow in step with how far it is from a fixed point, and the motion is not SHM. A, B and D all have a restoring force that grows with displacement and points back to equilibrium (the weight component, extra upthrust and spring tension, respectively)."
    }
  ];
})();
