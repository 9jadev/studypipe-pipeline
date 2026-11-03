/* ==========================================================
   StudyPipe — Spaced Retrieval Bank for Simple Harmonic Motion (L1–L5)
   Used by LessonKit across lessons/lesson-01 .. lesson-05
   ========================================================== */
window.RETRIEVAL_BANK = {
  l01: {
    title: "The Clock Mystery & What Makes Motion Harmonic",
    donow: [
      {
        from: 0, sec: "concepts", where: "Kinematics",
        q: "Define linear acceleration and state its SI unit.",
        a: "Acceleration is the <strong>rate of change of velocity with time</strong> (a = Δv ÷ t), measured in <strong>m s<sup>−2</sup></strong>."
      },
      {
        from: 0, sec: "neutralise", where: "Work & Energy",
        q: "Write the formulas for kinetic energy (KE) and gravitational potential energy (PE).",
        a: "<strong>KE = ½mv<sup>2</sup></strong> and <strong>PE = mgh</strong>, both measured in <strong>joules (J)</strong>."
      },
      {
        from: 0, sec: "practical", where: "Measurement & Units",
        q: "Convert 80.0 cm into metres and find its square root to 3 significant figures.",
        a: "80.0 cm = <strong>0.800 m</strong>, and √0.800 = <strong>0.894 m<sup>½</sup></strong>."
      },
      {
        from: 0, sec: "practical", where: "Laboratory Skills",
        q: "Why must you keep your line of sight perpendicular to a metre rule when reading a length?",
        a: "To avoid <strong>parallax error</strong>, which makes scale readings systematically too high or too low."
      }
    ],
    recall: {
      prompt: "Without looking back at the notes, tick off every core idea from Lesson 1 you can state from memory:",
      points: [
        "Periodic motion repeats in equal time intervals; SHM additionally requires acceleration proportional to displacement and directed towards equilibrium (a = −ω²x).",
        "Equilibrium position (x = 0) is the central point where net restoring force and acceleration are zero.",
        "Amplitude (A) is the maximum displacement from equilibrium to either extreme (half the peak-to-peak distance).",
        "Period (T = t ÷ N) is the time for one complete oscillation; frequency f = 1 ÷ T = N ÷ t (in Hz).",
        "The minus sign in a = −ω²x shows that acceleration always opposes the displacement vector x."
      ]
    }
  },

  l02: {
    title: "Kinematics of SHM — Period, Frequency, Velocity & Acceleration",
    donow: [
      {
        from: 1, sec: "concepts", where: "Defining SHM",
        q: "State the two conditions that distinguish Simple Harmonic Motion from ordinary periodic motion.",
        a: "1) Acceleration is <strong>directly proportional to displacement</strong> from a fixed point (a ∝ x), and 2) Acceleration is always <strong>directed towards that fixed equilibrium point</strong> (a = −ω²x)."
      },
      {
        from: 1, sec: "concepts", where: "Amplitude & Swing",
        q: "A pendulum swings from its extreme left mark to its extreme right mark across a total horizontal distance of 16.0 cm. What is its amplitude A in metres?",
        a: "Peak-to-peak distance = 2A = 16.0 cm, so amplitude <strong>A = 8.0 cm = 0.080 m</strong>."
      },
      {
        from: 1, sec: "concepts", where: "Period & Frequency",
        q: "A vibrating tuning fork completes 250 oscillations in 0.50 s. Calculate its frequency f and period T.",
        a: "<strong>f = N ÷ t = 250 ÷ 0.50 = 500 Hz</strong>. Period <strong>T = 1 ÷ f = 0.0020 s (2.0 ms)</strong>."
      },
      {
        from: 1, sec: "neutralise", where: "Equilibrium Centre",
        q: "In the equation a = −ω²x, what happens to the magnitude of acceleration when the bob passes through x = 0?",
        a: "At x = 0, the restoring acceleration is <strong>momentarily zero (a = 0 m s⁻²)</strong> and reverses sign as the bob crosses equilibrium."
      }
    ],
    recall: {
      prompt: "Without scrolling up, write down the core kinematic equations of SHM from Lesson 2 and tick what you remembered:",
      points: [
        "Angular frequency ω = 2πf = 2π ÷ T, measured in radians per second (rad s⁻¹).",
        "Instantaneous speed at displacement x is v = ω√(A² − x²).",
        "Maximum speed occurs at the equilibrium centre (x = 0): vmax = ωA.",
        "Maximum acceleration magnitude occurs at the extreme turning points (x = ±A): amax = ω²A.",
        "Velocity leads displacement by 90° (π/2 rad), while acceleration is 180° (π rad) out of phase with displacement."
      ]
    }
  },

  l03: {
    title: "The Simple Pendulum Practical — Apparatus, Fiducial Mark & Timing 20 Swings",
    donow: [
      {
        from: 2, sec: "concepts", where: "Maximum Speed",
        q: "A body in SHM has angular frequency ω = 5.0 rad s⁻¹ and amplitude A = 0.12 m. Calculate its maximum speed vmax.",
        a: "<strong>vmax = ωA = 5.0 × 0.12 = 0.60 m s⁻¹</strong> (occurring at equilibrium x = 0)."
      },
      {
        from: 2, sec: "concepts", where: "Maximum Acceleration",
        q: "For the same oscillator (ω = 5.0 rad s⁻¹, A = 0.12 m), calculate the magnitude of its maximum acceleration amax.",
        a: "<strong>amax = ω²A = (5.0)² × 0.12 = 25 × 0.12 = 3.0 m s⁻²</strong> (occurring at x = ±A)."
      },
      {
        from: 1, sec: "concepts", where: "Centre vs Extreme",
        q: "At which position in a pendulum's swing is its speed fastest, and at which position does it momentarily pause?",
        a: "Speed is <strong>fastest at the central equilibrium position (x = 0)</strong> and <strong>momentarily zero at the two extreme turning points (x = ±A)</strong>."
      },
      {
        from: 2, sec: "examples", where: "Instantaneous Speed",
        q: "Calculate the speed v of an oscillator with ω = 4.0 rad s⁻¹ and A = 0.050 m when it is at displacement x = 0.030 m.",
        a: "<strong>v = ω√(A² − x²) = 4.0 × √(0.050² − 0.030²) = 4.0 × 0.040 = 0.16 m s⁻¹</strong>."
      }
    ],
    recall: {
      prompt: "Close your notes and recall the core experimental rules of the Simple Pendulum Practical:",
      points: [
        "Period of a simple pendulum for small angles (θ ≤ 10°) is T = 2π√(L/g).",
        "Effective length L is measured from the bottom of the split cork to the centre of gravity of the spherical bob (L = l_thread + r_bob).",
        "A split cork clamps the thread firmly so the point of suspension stays fixed and does not slip sideways.",
        "The fiducial mark is placed at the equilibrium position (x = 0) because the bob moves fastest there, minimising timing uncertainty.",
        "Timing 20 oscillations and dividing by 20 reduces random human reaction-time error by a factor of 20."
      ]
    }
  },

  l04: {
    title: "Determining Gravity (g) — L–T² Graphs, Slope, Precautions & Error Detective",
    donow: [
      {
        from: 3, sec: "practical", where: "Fiducial Mark",
        q: "Why do we place the vertical chalk fiducial mark at the centre of the swing (x = 0) rather than at the extreme turning point?",
        a: "Because the bob moves at <strong>maximum speed (vmax = ωA) through equilibrium</strong>, crossing the mark in the shortest instant and minimising timing uncertainty."
      },
      {
        from: 3, sec: "concepts", where: "Effective Length",
        q: "A student measures thread length 78.8 cm from the split cork to the top hook of a spherical bob of diameter 2.4 cm. What is the effective length L?",
        a: "Radius r = 2.4 ÷ 2 = 1.2 cm. Effective length <strong>L = 78.8 + 1.2 = 80.0 cm = 0.800 m</strong>."
      },
      {
        from: 3, sec: "practical", where: "Bob Mass Myth",
        q: "In a pendulum experiment, if a student replaces a 50 g brass bob with a 150 g lead bob of the same radius at the same length L, how does the period T change?",
        a: "<strong>Period T remains unchanged</strong> because T = 2π√(L/g) is independent of the mass of the bob."
      },
      {
        from: 2, sec: "examples", where: "Scaling Law",
        q: "If the effective length L of a simple pendulum is quadrupled (multiplied by 4), what happens to its period T and frequency f?",
        a: "Since T ∝ √L, quadrupling L <strong>doubles the period (2T)</strong> and <strong>halves the frequency (½f)</strong>."
      }
    ],
    recall: {
      prompt: "Without looking back, recall how to linearise the pendulum equation, find g from the slope, and state WAEC precautions:",
      points: [
        "Squaring T = 2π√(L/g) gives the linear equation T² = (4π²/g)L, or L = (g/4π²)T².",
        "For a graph of L (m) on the vertical axis against T² (s²) on the horizontal axis, slope S = ΔL ÷ ΔT² = g ÷ 4π², so g = 4π²S.",
        "For a graph of T² (s²) on the vertical axis against L (m) on the horizontal axis, slope S' = ΔT² ÷ ΔL = 4π² ÷ g, so g = 4π² ÷ S'.",
        "WAEC table convention: L in cm (1 d.p.), t₁ and t₂ in s (1–2 d.p.), mean t in s, T in s (3 d.p.), and T² in s² (3 d.p.).",
        "WAEC Paper 3 precautions must be written in acceptable past-tense language (e.g. 'Conical oscillation was avoided by displacing the bob through a small angle < 10°')."
      ]
    }
  },

  l05: {
    title: "Energy in SHM, Loaded Spiral Springs, Damping, Resonance & Solving the Clock Case",
    donow: [
      {
        from: 4, sec: "concepts", where: "Slope to Gravity g",
        q: "A student plots L (in m) against T² (in s²) and obtains a gradient S = 0.249 m s⁻². Taking π = 3.142, calculate the acceleration due to gravity g.",
        a: "<strong>g = 4π²S = 4 × (3.142)² × 0.249 = 39.489 × 0.249 = 9.83 m s⁻²</strong>."
      },
      {
        from: 4, sec: "bridge", where: "Error Detective",
        q: "In a WAEC Paper 3 practical, a stopwatch runs 5% fast (over-reading time t and period T). How does this systematic error affect the calculated value of g?",
        a: "Since g = 4π²L ÷ T², an over-read T makes T² artificially large in the denominator, yielding a <strong>lower calculated value of g</strong>."
      },
      {
        from: 3, sec: "practical", where: "Paper 3 Precautions",
        q: "Write two acceptable WAEC Paper 3 precautions taken during the simple pendulum experiment in the past tense.",
        a: "1) <em>Conical oscillation was avoided by displacing the bob through a small angle (&lt; 10°).</em> 2) <em>Parallax error was avoided by reading the metre rule at eye level.</em>"
      },
      {
        from: 2, sec: "concepts", where: "SHM Kinematics",
        q: "Write the formula for maximum speed vmax in terms of angular frequency ω and amplitude A.",
        a: "<strong>vmax = ωA</strong>."
      }
    ],
    recall: {
      prompt: "Without scrolling up, write down the core energy, spiral spring, damping, and resonance principles from Lesson 5:",
      points: [
        "Total mechanical energy in undamped SHM is constant: E_total = ½mω²A² = ½kA².",
        "At displacement x, potential energy PE = ½mω²x² and kinetic energy KE = ½mω²(A² − x²).",
        "For a mass m oscillating on a spiral spring of force constant k, the period is T = 2π√(m/k) — independent of gravity g.",
        "Damping is the progressive loss of mechanical energy and amplitude due to resistive forces (air drag, friction).",
        "Resonance occurs when a periodic driving frequency f_d matches the system's natural frequency f₀, producing maximum amplitude energy transfer."
      ]
    }
  }
};
