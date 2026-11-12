/* Lesson 03 · SHM as a Circle's Shadow — displacement, velocity and acceleration.
   Sort cards ("where does it happen?"), Position Explorer pins, bench targets and the 12 quiz
   questions of 03-questions.md § Lesson 03 Part 1 (order and keys unchanged).
   Numbers for the bench and the explorer are computed live from ShmKinematics2D.model (A = 0.30 m, T = 2.0 s). */
(function () {
  "use strict";

  window.L03 = {
    lab: { A: 0.30, T: 2.0 },                    // reference wheel: ω = π rad s⁻¹
    targets: [0, 30, 60, 90],                    // angles ωt (°) the method asks for
    okada: { w: 12.57, g: 9.8 },                 // story model: ω₀ ≈ 4π, threshold g/ω² = 6.2 cm

    // ---- 2A sort: where does it happen? (10 cards, 3 bins) ----
    bins: [
      { id: "centre", label: "At the centre", hint: "equilibrium, x = 0" },
      { id: "ends", label: "At the ends", hint: "x = ±A" },
      { id: "nowhere", label: "Nowhere", hint: "never true in SHM" }
    ],
    items: [
      { id: "i1", name: "Speed is greatest", bin: "centre", why: "v = ω√(A² − x²) is largest when x = 0, so v_max = ωA at the centre." },
      { id: "i2", name: "Acceleration is zero", bin: "centre", why: "a = −ω²x, and x = 0 at the centre, so a = 0 there." },
      { id: "i3", name: "Restoring force is zero", bin: "centre", why: "The restoring force F = −kx vanishes at the equilibrium position." },
      { id: "i4", name: "Kinetic energy is greatest", bin: "centre", why: "Kinetic energy follows the speed, and the speed peaks at the centre." },
      { id: "i5", name: "Velocity is momentarily zero", bin: "ends", why: "At x = ±A, v = ω√(A² − A²) = 0: the body stops for an instant." },
      { id: "i6", name: "Acceleration is greatest", bin: "ends", why: "|a| = ω²|x| is largest where |x| is largest: a_max = ω²A at the ends." },
      { id: "i7", name: "Restoring force is greatest", bin: "ends", why: "The pull back is strongest where the body is furthest from the centre." },
      { id: "i8", name: "The body changes direction", bin: "ends", why: "It stops at each end and turns back towards the centre." },
      { id: "i9", name: "Acceleration points away from the centre", bin: "nowhere", why: "The minus sign in a = −ω²x means a always points back to the centre." },
      { id: "i10", name: "Speed is the same at every point", bin: "nowhere", why: "That is uniform motion. In SHM the body speeds up and slows down every cycle." }
    ],

    // ---- Position Explorer pins on the A = 0.30 m, T = 2.0 s reference circle ----
    pins: [
      { deg: 0, note: "The shadow is at the centre O, moving fastest (v_max = ωA) with zero acceleration." },
      { deg: 30, note: "x = A sin 30° = A/2. Speed has dropped a little; acceleration points back to O." },
      { deg: 45, note: "Halfway round the quarter turn, but not halfway in speed: v = ωA cos 45° ≈ 0.71 ωA." },
      { deg: 60, note: "x ≈ 0.87 A. The shadow is slowing hard; a is now large and still points to O." },
      { deg: 90, note: "The end x = +A: the shadow stops for an instant, and |a| = ω²A is greatest." },
      { deg: 180, note: "Back through O the other way: the speed is ωA again, but the velocity is negative." },
      { deg: 270, note: "The other end x = −A: v = 0 and a = +ω²A, pointing back up to O." }
    ]
  };

  window.LESSON_QUIZ = [
    {
      q: "A lump of mud on a wheel of radius 0.30 m goes round at a steady 4.0 rad s⁻¹, and the midday sun casts its shadow on the ground. The shadow moves with simple harmonic motion of",
      o: [
        "amplitude 0.60 m and angular frequency 4.0 rad s⁻¹",
        "amplitude 0.30 m and angular frequency 1.2 rad s⁻¹",
        "amplitude 0.15 m and angular frequency 8.0 rad s⁻¹",
        "amplitude 0.30 m and angular frequency 4.0 rad s⁻¹"
      ],
      a: 3,
      e: "The shadow of a point moving uniformly round a circle moves in SHM along a diameter. Its amplitude equals the radius of the circle (0.30 m), and it completes one oscillation each time the lump goes round once, so its angular frequency equals the lump's angular speed (4.0 rad s⁻¹). A takes the diameter as the amplitude. B uses ωr = 1.2, which is the lump's <em>speed</em> in m s⁻¹, not an angular frequency. C halves the radius and doubles ω with no reason."
    },
    {
      q: "A body moves in SHM with amplitude 5.0 cm and angular frequency 8.0 rad s⁻¹. What is its speed when it is 3.0 cm from the equilibrium position?",
      o: ["0.40 m s⁻¹", "0.32 m s⁻¹", "0.16 m s⁻¹", "0.24 m s⁻¹"],
      a: 1,
      e: "v = ω√(A² − x²) = 8.0 × √(0.050² − 0.030²) = 8.0 × √(0.0025 − 0.0009) = 8.0 × √0.0016 = 8.0 × 0.040 = 0.32 m s⁻¹. A is ωA, the <em>maximum</em> speed, which happens only at x = 0. C used ω(A − x), subtracting before squaring. D used ωx, which grows with displacement, the opposite of what really happens."
    },
    {
      q: "A loudspeaker cone vibrates in SHM at 2.5 Hz with amplitude 4.0 cm while a test tone plays. What is its greatest acceleration?",
      o: ["9.9 m s⁻²", "0.63 m s⁻²", "0.25 m s⁻²", "987 m s⁻²"],
      a: 0,
      e: "ω = 2πf = 2π × 2.5 = 15.7 rad s⁻¹; a_max = ω²A = (15.7)² × 0.040 = 246.7 × 0.040 = 9.9 m s⁻². B is ωA = 0.63, which is the maximum <em>speed</em> in m s⁻¹. C used f² instead of ω² (2.5² × 0.040), leaving out (2π)². D kept the amplitude in centimetres (246.7 × 4.0)."
    },
    {
      q: "Where is the speed of a body in simple harmonic motion greatest?",
      o: [
        "At each end of the motion, where the restoring force is greatest",
        "Halfway between the equilibrium position and an end",
        "At the equilibrium position",
        "It is the same at every point"
      ],
      a: 2,
      e: "v = ω√(A² − x²) is largest when x = 0, at the equilibrium position, where v_max = ωA. A is Tunde's misconception: at the ends the body is momentarily at rest; it is the <em>acceleration</em> that is greatest there. B is a guess with no basis in the formula. D describes uniform motion, not SHM."
    },
    {
      q: "At an extreme position (x = ±A) of a body in SHM,",
      o: [
        "its velocity is greatest and its acceleration is zero",
        "its velocity is zero and its acceleration is greatest",
        "both its velocity and its acceleration are zero",
        "both its velocity and its acceleration are greatest"
      ],
      a: 1,
      e: "At x = ±A, v = ω√(A² − A²) = 0, while |a| = ω²A, the largest value. A describes the equilibrium position instead. C is the common slip \"it stops, so nothing is happening\", but the restoring force is strongest at the ends, so the acceleration cannot be zero. D cannot happen in SHM, because speed and acceleration peak at different places."
    },
    {
      q: "A body oscillates in SHM with amplitude 10 cm and period 1.2 s, timed from the equilibrium position so that x = A sin ωt. What is its displacement at t = 0.10 s?",
      o: ["8.7 cm", "0.091 cm", "0.83 cm", "5.0 cm"],
      a: 3,
      e: "ω = 2π/T = 2π ÷ 1.2 = 5.24 rad s⁻¹, so ωt = 5.24 × 0.10 = 0.524 rad (π/6). x = 10 × sin(π/6) = 10 × 0.500 = 5.0 cm. A used cos instead of sin (10 cos 30° = 8.7 cm), which would be correct only if timing started at an end. B worked out sin 0.524 with the calculator in <em>degree</em> mode. C assumed the displacement grows steadily with time (10 × 0.10 ÷ 1.2), ignoring the sine shape."
    },
    {
      q: "On graphs of displacement and velocity against time for a body in SHM, how does the velocity–time curve compare with the displacement–time curve?",
      o: [
        "It is a quarter of a cycle ahead, so the velocity is greatest when the displacement is zero",
        "It is exactly the same shape and in step with it",
        "It is the mirror image of it, being greatest where the displacement is greatest",
        "It is a straight line, since velocity is constant"
      ],
      a: 0,
      e: "If x = A sin ωt, then v = ωA cos ωt: a cosine curve, a quarter-cycle (90°) ahead of the sine, peaking whenever x passes through zero. B would put the greatest speed at the ends, which is false. C describes the <em>acceleration</em>–time curve (a = −ω²x), which is the inverted copy of x, and even then a is greatest in size where |x| is greatest, with opposite sign. D ignores that the body keeps speeding up and slowing down."
    },
    {
      q: "A particle's acceleration is related to its displacement by a = −36x (SI units). What is its period?",
      o: ["0.17 s", "6.0 s", "1.05 s", "0.95 s"],
      a: 2,
      e: "Compare with a = −ω²x: ω² = 36, so ω = 6.0 rad s⁻¹ and T = 2π/ω = 6.283 ÷ 6.0 = 1.05 s. A is 2π ÷ 36: ω² was used in place of ω. B took ω itself as the period. D is ω ÷ 2π = 0.95, which is the frequency in hertz, not the period."
    },
    {
      q: "A crate rests loosely on a carrier that bounces in SHM with amplitude 3.0 cm. Above what frequency will the crate start to leave the carrier at the top of each bounce? (Take g = 9.8 m s⁻².)",
      o: ["18 Hz", "52 Hz", "0.35 Hz", "2.9 Hz"],
      a: 3,
      e: "The crate leaves when the carrier's downward acceleration at the top exceeds g: ω²A > g. So ω² = g/A = 9.8 ÷ 0.030 = 327 s⁻², ω = 18.1 rad s⁻¹, and f = ω/2π = 18.1 ÷ 6.283 = 2.9 Hz. A stopped at ω (rad s⁻¹) and called it a frequency. B divided ω² by 2π instead of taking the square root first. C is 2π/ω, which is the <em>period</em> in seconds."
    },
    {
      q: "The prong of a tuning fork vibrates at 256 Hz with an amplitude of 0.50 mm. What is its greatest speed?",
      o: ["0.80 m s⁻¹", "0.13 m s⁻¹", "804 m s⁻¹", "1.3 × 10³ m s⁻¹"],
      a: 0,
      e: "ω = 2πf = 2π × 256 = 1608 rad s⁻¹ and A = 0.50 mm = 5.0 × 10⁻⁴ m, so v_max = ωA = 1608 × 5.0 × 10⁻⁴ = 0.80 m s⁻¹. B used f × A, leaving out the 2π. C left the amplitude in millimetres (1608 × 0.50). D is ω²A ≈ 1.3 × 10³, which is the maximum <em>acceleration</em> in m s⁻², not a speed."
    },
    {
      q: "The period of an oscillator is halved while its amplitude is kept the same. What happens to its maximum speed and its maximum acceleration?",
      o: [
        "Both double",
        "Maximum speed is unchanged; maximum acceleration doubles",
        "Maximum speed doubles; maximum acceleration becomes four times as large",
        "Both become four times as large"
      ],
      a: 2,
      e: "Halving T doubles ω (ω = 2π/T). Then v_max = ωA doubles and a_max = ω²A grows by 2² = 4. A forgets that acceleration depends on ω squared. B wrongly assumes speed depends only on the amplitude. D squares for the speed too."
    },
    {
      q: "Tunde says the crates jump off Dayo's carrier \"because that is where the bike is moving fastest\". Which statement correctly describes where and why the crates leave the carrier?",
      o: [
        "At the middle of the bounce, where the carrier's speed is greatest and it throws the crate upwards",
        "At the top of the bounce, where the carrier's speed is zero but its downward acceleration is greatest; once that acceleration exceeds g, the carrier drops away faster than the crate can fall",
        "At the bottom of the bounce, where the carrier's upward acceleration is greatest",
        "Anywhere, because a bigger bounce always throws crates off regardless of its size"
      ],
      a: 1,
      e: "At the top, the carrier is momentarily still but accelerating downwards at ω²A. The crate is pulled down only by gravity, at g, so if ω²A > g the carrier falls away from under it and the crate lifts clear. A is Tunde's mix-up of speed with acceleration; at the middle the acceleration is zero. C is where the carrier pushes up <em>hardest</em> on the crate, pressing the crate firmly onto it, not letting it go. D ignores the threshold: the crates stay on while A < g/ω² (6.2 cm for the okada)."
    }
  ];
})();
