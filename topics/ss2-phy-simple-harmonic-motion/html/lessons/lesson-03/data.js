/* Lesson 01 · Simple Harmonic Motion & Simple Pendulum — content data and 12 WAEC/NECO/JAMB quiz questions */
(function () {
  "use strict";

  window.L01 = {
    // ---- 1. Motion sort items ----
    items: [
      { id: "pendulum", name: "Pendulum swinging through 8°", emo: "🕰️", bin: "shm", why: "At small angles, the restoring pull −mg sin θ is directly proportional to displacement x towards the centre." },
      { id: "spring", name: "Mass bouncing on a spiral spring", emo: "🔩", bin: "shm", why: "Hooke's law gives a restoring force F = −kx proportional to extension or compression from equilibrium." },
      { id: "tuning", name: "Vibrating prong of a tuning fork", emo: "🎵", bin: "shm", why: "Elasticity of the steel prong pulls it back towards its rest position in proportion to displacement." },
      { id: "testtube", name: "Loaded test-tube bobbing in water", emo: "🧪", bin: "shm", why: "Extra upthrust when pushed down (or extra weight when lifted) is proportional to vertical displacement x." },
      { id: "fan", name: "Ceiling fan spinning at steady speed", emo: "🌀", bin: "periodic", why: "Repeats every rotation, so it is periodic — but it moves in one circular direction, not to-and-fro through an equilibrium centre." },
      { id: "earth", name: "Earth orbiting the Sun each year", emo: "🌍", bin: "periodic", why: "Repeats every 365.25 days (periodic), but does not oscillate back and forth along a restoring path." },
      { id: "ball", name: "Rubber ball bouncing on concrete", emo: "🏀", bin: "periodic", why: "Periodic while bouncing steadily, but acceleration is constant (−g) in the air rather than proportional to displacement x." },
      { id: "heartbeat", name: "Heartbeat repeating 72 times/min", emo: "💓", bin: "periodic", why: "Rhythmic and periodic, but driven by biological muscle impulses rather than a linear restoring force −kx." },
      { id: "mango", name: "Mango falling straight from a tree", emo: "🥭", bin: "non", why: "One-way accelerated fall under gravity; it does not repeat in cycles." },
      { id: "danfo", name: "Danfo bus braking at a bus stop", emo: "🚌", bin: "non", why: "One-off deceleration to rest; there is no oscillation or cycle." },
      { id: "stone", name: "Football kicked across a pitch", emo: "⚽", bin: "non", why: "Parabolic projectile flight from kick to landing — not periodic." },
      { id: "rain", name: "Rainwater flowing down a gutter", emo: "🌧️", bin: "non", why: "Continuous one-way flow with no repeating equilibrium cycle." }
    ],

    // ---- 2. 3D Pendulum bench trials (N = 20 oscillations, g = 9.81 m/s²) ----
    trials: [
      { label: "A", L: 0.40, t: "25.38", T: "1.269", T2: "1.61" },
      { label: "B", L: 0.60, t: "31.08", T: "1.554", T2: "2.42" },
      { label: "C", L: 0.80, t: "35.88", T: "1.794", T2: "3.22" },
      { label: "D", L: 1.00, t: "40.12", T: "2.006", T2: "4.02" },
      { label: "E", L: 1.20, t: "43.96", T: "2.198", T2: "4.83" }
    ],
    tOptions: ["25.38", "31.08", "35.88", "40.12", "43.96"],
    TOptions: ["1.269", "1.554", "1.794", "2.006", "2.198"],
    T2Options: ["1.61", "2.42", "3.22", "4.02", "4.83"],

    // ---- 3. Swing Position Explorer pins (from -A to +A, A = 0.10 m, ω = 4.0 rad/s) ----
    pins: [
      { frac: -1.0, label: "−A", emo: "🛑", x: "−0.10 m", v: "0.00 m s⁻¹ (zero)", a: "+1.60 m s⁻² (max → right)", ke: "0%", pe: "100%", note: "Left extreme: the bob stops for an instant to reverse direction. Speed and KE are zero, while restoring acceleration and PE are at their maximum!" },
      { frac: -0.6, label: "−0.6A", emo: "↗️", x: "−0.06 m", v: "0.32 m s⁻¹", a: "+0.96 m s⁻² (→ right)", ke: "64%", pe: "36%", note: "Partway in: potential energy is rapidly converting into kinetic energy as the restoring force pulls the bob towards the centre." },
      { frac: -0.3, label: "−0.3A", emo: "⚡", x: "−0.03 m", v: "0.38 m s⁻¹", a: "+0.48 m s⁻² (→ right)", ke: "91%", pe: "9%", note: "Approaching the centre: speed is nearly at its peak and acceleration is shrinking rapidly as x approaches zero." },
      { frac: 0.0,  label: "x = 0", emo: "🎯", x: "0.00 m", v: "0.40 m s⁻¹ (MAX)", a: "0.00 m s⁻² (ZERO)", ke: "100%", pe: "0%", note: "Equilibrium centre (fiducial mark): displacement, restoring force, acceleration and PE are all ZERO, while speed (vmax = ωA) and KE are 100% maximum!" },
      { frac: 0.3,  label: "+0.3A", emo: "⚡", x: "+0.03 m", v: "0.38 m s⁻¹", a: "−0.48 m s⁻² (← left)", ke: "91%", pe: "9%", note: "Just past the centre: inertia carries the bob rightward, but restoring acceleration immediately flips leftward to slow it down." },
      { frac: 0.6,  label: "+0.6A", emo: "↖️", x: "+0.06 m", v: "0.32 m s⁻¹", a: "−0.96 m s⁻² (← left)", ke: "64%", pe: "36%", note: "Climbing the right arc: speed drops as kinetic energy turns back into gravitational potential energy." },
      { frac: 1.0,  label: "+A", emo: "🛑", x: "+0.10 m", v: "0.00 m s⁻¹ (zero)", a: "−1.60 m s⁻² (max ← left)", ke: "0%", pe: "100%", note: "Right extreme: speed hits zero at the top of the swing, while inward acceleration reaches its maximum (−ω²A) to pull the bob back." }
    ]
  };

  // ---- 4. 12 WAEC / NECO / JAMB Quiz Questions ----
  window.LESSON_QUIZ = [
    {
      q: "Which statement correctly defines <strong>simple harmonic motion (SHM)</strong>?",
      o: [
        "Any motion that repeats itself in equal intervals of time",
        "Motion in which acceleration is proportional to displacement from equilibrium and always directed towards it",
        "Motion with constant speed along a circular path",
        "Motion in which restoring force acts in the same direction as displacement"
      ],
      a: 1,
      e: "All SHM is periodic, but only motions obeying <strong>a = −ω²x</strong> (acceleration proportional to displacement and directed <em>towards</em> the equilibrium centre) are simple harmonic.",
      src: "WAEC-style"
    },
    {
      q: "A student records <strong>36.0 s</strong> for <strong>20 complete oscillations</strong> of a simple pendulum. What are the period <strong>T</strong> and frequency <strong>f</strong>?",
      o: [
        "T = 0.56 s, f = 1.80 Hz",
        "T = 1.80 s, f = 0.56 Hz",
        "T = 18.0 s, f = 0.056 Hz",
        "T = 720 s, f = 0.0014 Hz"
      ],
      a: 1,
      e: "Period <strong>T = t ÷ N = 36.0 ÷ 20 = 1.80 s</strong>. Frequency <strong>f = 1 ÷ T = 1 ÷ 1.80 = 0.56 Hz</strong>.",
      src: "WAEC Practical"
    },
    {
      q: "If the effective length of a simple pendulum is <strong>quadrupled (L → 4L)</strong> at the same location, its period T:",
      o: [
        "becomes four times as large (4T)",
        "doubles (2T)",
        "is halved (½T)",
        "remains unchanged (T)"
      ],
      a: 1,
      e: "From <strong>T = 2π√(L/g)</strong>, period is proportional to <strong>√L</strong>. Multiplying L by 4 multiplies T by <strong>√4 = 2</strong>.",
      src: "JAMB-style"
    },
    {
      q: "A simple pendulum has a 50 g brass bob and a period of <strong>1.60 s</strong>. If the bob is replaced with a <strong>150 g lead bob</strong> at the exact same effective length L, the new period is:",
      o: ["4.80 s", "2.77 s", "1.60 s", "0.53 s"],
      a: 2,
      e: "Mass <strong>m</strong> does not appear in <strong>T = 2π√(L/g)</strong> because gravitational pull and inertia scale equally with mass. The period remains <strong>1.60 s</strong>.",
      src: "NECO-style"
    },
    {
      q: "As an oscillating pendulum bob passes through its <strong>equilibrium centre (x = 0)</strong>, which pair of quantities is correct?",
      o: [
        "Velocity is zero; acceleration is maximum",
        "Velocity is maximum; acceleration is zero",
        "Both velocity and acceleration are maximum",
        "Potential energy is maximum; kinetic energy is zero"
      ],
      a: 1,
      e: "At <strong>x = 0</strong>, acceleration <strong>a = −ω²(0) = 0</strong> and all potential energy has turned into kinetic energy, so speed reaches <strong>v<sub>max</sub> = ωA</strong>.",
      src: "WAEC-style"
    },
    {
      q: "A body performs SHM with amplitude <strong>A = 0.05 m</strong> and angular frequency <strong>ω = 10 rad s<sup>−1</sup></strong>. What are its maximum speed <strong>v<sub>max</sub></strong> and maximum acceleration <strong>a<sub>max</sub></strong>?",
      o: [
        "0.50 m s⁻¹ and 5.0 m s⁻²",
        "5.0 m s⁻¹ and 0.50 m s⁻²",
        "0.50 m s⁻¹ and 0.05 m s⁻²",
        "200 m s⁻¹ and 2000 m s⁻²"
      ],
      a: 0,
      e: "<strong>v<sub>max</sub> = ωA = 10 × 0.05 = 0.50 m s⁻¹</strong>, and <strong>a<sub>max</sub> = ω²A = 10² × 0.05 = 5.0 m s⁻²</strong>.",
      src: "JAMB-style"
    },
    {
      q: "In a simple pendulum experiment, a student plots <strong>L (m)</strong> on the vertical axis against <strong>T<sup>2</sup> (s<sup>2</sup>)</strong> on the horizontal axis and obtains a slope <strong>S = 0.248 m s<sup>−2</sup></strong>. The value of g is:",
      o: [
        "g = 4π²S ≈ 9.79 m s⁻²",
        "g = 4π² ÷ S ≈ 159 m s⁻²",
        "g = 2πS ≈ 1.56 m s⁻²",
        "g = S ÷ 4π² ≈ 0.0063 m s⁻²"
      ],
      a: 0,
      e: "Since <strong>L = (g ÷ 4π²)T²</strong>, the slope S of L against T² equals <strong>g ÷ 4π²</strong>. Therefore <strong>g = 4π²S = 39.478 × 0.248 ≈ 9.79 m s⁻²</strong>.",
      src: "WAEC Practical"
    },
    {
      q: "Why do WAEC practical instructions ask candidates to place the fiducial reference mark at the <strong>centre of the swing</strong> rather than at one extreme end?",
      o: [
        "The bob stops at the centre so it is easier to see",
        "The bob moves fastest through the centre, making the instant of crossing sharp and reducing timing error",
        "Air resistance acts only at the extreme ends",
        "The thread is shortest at the centre"
      ],
      a: 1,
      e: "At the extreme ends the bob lingers as it reverses, making the turnaround moment blurry. At <strong>x = 0</strong> it flashes past the pointer at maximum speed, giving a crisp timing mark.",
      src: "WAEC Practical"
    },
    {
      q: "A particle in SHM has angular frequency <strong>ω = 3.0 rad s<sup>−1</sup></strong> and amplitude <strong>A = 0.10 m</strong>. Its speed at displacement <strong>x = 0.08 m</strong> is:",
      o: ["0.30 m s⁻¹", "0.24 m s⁻¹", "0.18 m s⁻¹", "0.06 m s⁻¹"],
      a: 2,
      e: "<strong>v = ω√(A² − x²) = 3.0 × √(0.10² − 0.08²) = 3.0 × √0.0036 = 3.0 × 0.06 = 0.18 m s⁻¹</strong>.",
      src: "NECO-style"
    },
    {
      q: "Which precaution is written in the exact style expected by <strong>WAEC Physics Paper 3</strong> examiners?",
      o: [
        "Avoid conical oscillation during the experiment.",
        "I will make sure the fan is switched off.",
        "Conical oscillation was avoided by displacing the bob through a small angle in a single vertical plane.",
        "Do not push the bob when releasing it."
      ],
      a: 2,
      e: "WAEC requires precautions to be stated in the <strong>past tense</strong>, describing what was done and how.",
      src: "WAEC Practical"
    },
    {
      q: "Why does a pendulum clock that keeps accurate time in Lagos <strong>lose time</strong> when taken to the top of a high mountain where gravity g is slightly smaller?",
      o: [
        "Smaller g makes the period T = 2π√(L/g) longer, so each swing takes more time and the clock ticks slowly",
        "Smaller g makes the period T shorter, so the clock ticks too fast",
        "The brass bob loses mass at high altitude",
        "Air resistance increases on a mountain"
      ],
      a: 0,
      e: "Because <strong>g</strong> is in the denominator of <strong>T = 2π√(L/g)</strong>, a smaller g produces a longer period T. Each tick takes longer than 1 second, so the clock falls behind.",
      src: "JAMB-style"
    },
    {
      q: "The gradual decrease in amplitude of a freely swinging pendulum due to air resistance is called:",
      o: ["Resonance", "Damping", "Diffraction", "Polarization"],
      a: 1,
      e: "<strong>Damping</strong> is the progressive loss of mechanical energy and amplitude due to resistive forces like air drag.",
      src: "NECO-style"
    }
  ];
})();
