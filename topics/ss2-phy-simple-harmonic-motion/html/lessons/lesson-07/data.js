/* Lesson 07 · Forced Vibration and Resonance — Solving the Ridge Road Case.
   window.L07 holds the sort cards, the speed explorer pins and the mystery-verdict bridge.
   window.LESSON_QUIZ = the 12 MCQs of 03-questions.md § Lesson 07 Part 1 (order and keys unchanged).
   Every bench / zoom / explorer number comes from the kits' models (MassSpringKit.model, PendulumKit.model,
   ShmKinematics2D.model), never from this file. */
(function () {
  "use strict";

  window.L07 = {
    // ---- 2A sort: useful or harmful resonance ----
    bins: { useful: "Useful resonance", harmful: "Harmful resonance" },
    items: [
      { id: "radio",   bin: "useful",  name: "Tuning a radio to one station", why: "The tuning circuit is set so its natural frequency matches the wanted station, which then gives a big response." },
      { id: "guitar",  bin: "useful",  name: "A guitar's hollow body making the string louder", why: "The air and wood in the body vibrate in step with the string and spread the sound." },
      { id: "drum",    bin: "useful",  name: "A talking drum's body booming with its skin", why: "The drum's body resonates with the beaten membrane, so the note carries far." },
      { id: "swing",   bin: "useful",  name: "Pushing a child on a swing in time", why: "Each push arrives once per swing, in step, so energy builds and the swing goes higher." },
      { id: "bottle",  bin: "useful",  name: "Blowing across an empty bottle to make it hum", why: "The air column inside vibrates at its own natural frequency and the note grows loud." },
      { id: "soldiers",bin: "harmful", name: "Soldiers breaking step on a footbridge", why: "They break step to stop their footsteps driving the bridge at one of its natural frequencies." },
      { id: "steering",bin: "harmful", name: "A car's steering wheel shaking at one speed", why: "At that speed a wheel's wobble matches a natural frequency of the steering, so the shake grows." },
      { id: "washer",  bin: "harmful", name: "A washing machine walking across the floor during spin", why: "At one spin speed the drum's push matches the machine's natural frequency on its feet." },
      { id: "louvres", bin: "harmful", name: "Window louvres rattling when a big generator runs", why: "The engine's steady hum matches the louvres' natural frequency, so they rattle loudly." },
      { id: "crates",  bin: "harmful", name: "Dayo's egg crates cracking on Ridge Road", why: "At 18 km/h the ridges push the rear at 2.0 Hz, the okada's own frequency: resonance throws the crates." }
    ],

    // ---- speed explorer (#pos-explorer) ----
    pins: [10, 14, 16, 18, 20, 25, 30],

    // ---- the Bridge: five test runs on the ridge rig (numbers from MassSpringKit.model.okada) ----
    runs: [
      { id: "r10", label: "10 km/h · leaking", kmh: 10, mass: 200, leak: true },
      { id: "r18", label: "18 km/h · leaking", kmh: 18, mass: 200, leak: true },
      { id: "r30", label: "30 km/h · leaking", kmh: 30, mass: 200, leak: true },
      { id: "r16", label: "16 km/h · 250 kg", kmh: 16, mass: 250, leak: true },
      { id: "rh",  label: "Healthy damper · every speed", kmh: null, mass: 200, leak: false }
    ],
    bridge: [
      {
        q: "Why do the crates crack at 18 km/h, and not at 30 km/h?",
        o: ["At 18 km/h the ridges push the rear at 2.0 Hz, its natural frequency: resonance", "18 km/h is the fastest Dayo rides", "The spring becomes stiffer at 18 km/h"],
        a: 0,
        why: "f = v/d = 5.0 ÷ 2.5 = 2.0 Hz = f₀. At 30 km/h, f = 3.3 Hz, far from f₀, so the bounce stays small."
      },
      {
        q: "With two extra crates (250 kg), the dangerous speed becomes…",
        o: ["about 20 km/h", "still 18 km/h", "about 16 km/h"],
        a: 2,
        why: "More mass lowers f₀ to 1.79 Hz, so v = d f₀ = 2.5 × 1.79 = 4.47 m/s ≈ 16 km/h."
      },
      {
        q: "What should Dayo and Hajia Ramatu do?",
        o: ["Replace the rear shock absorber; until then cross the ridges at about 10 km/h or below", "Ride at 30 km/h every time to get past quickly", "Load extra crates so the okada is heavier and steadier"],
        a: 0,
        why: "A healthy damper keeps the peak near 2 cm at every speed; 10 km/h is well below both danger speeds (16 and 18 km/h)."
      }
    ]
  };

  window.LESSON_QUIZ = [
    {
      q: "Resonance occurs when",
      o: [
        "a system vibrates with a very high frequency",
        "the damping on a system is made as large as possible",
        "a system is left to vibrate freely after one push",
        "the frequency of a periodic driving force matches the system's own natural frequency, so its amplitude becomes greatest"
      ],
      a: 3,
      e: "At resonance each push arrives in step with the motion, energy builds up, and the amplitude reaches its largest value. A is the myth that resonance means \"fast\"; the okada resonates at only 2 Hz. B does the opposite: damping <em>reduces</em> the resonant amplitude. C describes free vibration, with no driving force at all."
    },
    {
      q: "A periodic force with a frequency of 5 Hz drives a system whose natural frequency is 2 Hz. Once the motion has settled, the system vibrates at",
      o: ["2 Hz, its natural frequency", "3 Hz, the difference between the two", "5 Hz, the driving frequency", "7 Hz, the sum of the two"],
      a: 2,
      e: "In a forced vibration the system is made to vibrate at the frequency of the driving force; its natural frequency only decides how <em>large</em> the response is (here small, being far from resonance). A describes free vibration. B and D are invented combinations with no physical basis."
    },
    {
      q: "Speed bumps on a school road are 2.0 m apart, and a keke's suspension has a natural frequency of 1.6 Hz. At what speed would the keke resonate?",
      o: ["3.2 km/h", "11.5 km/h", "2.9 km/h", "4.5 km/h"],
      a: 1,
      e: "Resonance when the bump rate equals f₀: v/d = f₀, so v = d f₀ = 2.0 × 1.6 = 3.2 m s⁻¹, and in km/h, 3.2 × 3.6 = 11.5 km/h. A gives the m s⁻¹ value with the wrong unit. C used f₀ ÷ d (1.6 ÷ 2.0 = 0.80 m s⁻¹, then × 3.6). D used d ÷ f₀ (1.25 m s⁻¹, then × 3.6)."
    },
    {
      q: "Dayo crosses the ridges, 2.5 m apart, at 27 km/h. The loaded okada's natural frequency is 2.0 Hz. Which statement is correct?",
      o: [
        "The ridges push the rear at 3.0 Hz, well above 2.0 Hz, so there is no resonance",
        "The ridges push the rear at 10.8 Hz, so the bounce is very fast and violent",
        "The ridges push the rear at 0.33 Hz, well below 2.0 Hz",
        "The ridges push the rear at 2.0 Hz, so there is resonance"
      ],
      a: 0,
      e: "v = 27 ÷ 3.6 = 7.5 m s⁻¹, so f = v/d = 7.5 ÷ 2.5 = 3.0 Hz. That is far from f₀ = 2.0 Hz, so the response is small, as on Dayo's fast trips. B forgot to change km/h to m s⁻¹ (27 ÷ 2.5). C used d/v, the time between ridges, as if it were a frequency. D assumes any speed gives resonance; only about 18 km/h does."
    },
    {
      q: "In a Barton's pendulums demonstration, a heavy driver pendulum swings on a taut cord from which light paper-cone pendulums of different lengths hang. After a while, which cone swings with the largest amplitude?",
      o: [
        "The shortest one, because it has the highest natural frequency",
        "The one with the same length as the driver, because its natural frequency equals the driving frequency",
        "The longest one, because it has the most room to swing",
        "They all swing with the same amplitude, because the same cord drives them all"
      ],
      a: 1,
      e: "All the cones are forced at the driver's frequency, but only the cone whose natural frequency matches it (the same length, since T = 2π√(l/g)) resonates and swings widely. A and C confuse a high or low natural frequency with a matched one. D ignores resonance: the cones respond very differently even though the driving is the same."
    },
    {
      q: "Mallam Sule fits a healthy shock absorber in place of the leaking one. How does this change the okada's amplitude–frequency (resonance) curve?",
      o: [
        "The peak becomes lower and broader, at about the same frequency",
        "The peak becomes higher and sharper",
        "The peak moves to a much higher frequency",
        "The curve is unchanged, because damping does not affect forced vibration"
      ],
      a: 0,
      e: "More damping removes more energy each cycle, so the resonant amplitude is much smaller (for the model, about 2.0 cm instead of 10 cm) and the peak is spread over a wider range of speeds; the peak frequency stays close to f₀. B describes <em>less</em> damping. C confuses damping with stiffness or mass, which are what set f₀. D is false: damping matters most at resonance."
    },
    {
      q: "With two extra crates, the okada's sprung load rises from 200 kg to 250 kg on the same spring. What happens to its natural frequency and to the dangerous speed over the ridges?",
      o: [
        "Both increase",
        "The natural frequency increases; the dangerous speed decreases",
        "Both stay the same, because the spring is unchanged",
        "Both decrease: f₀ falls from 2.0 Hz to 1.79 Hz, and the dangerous speed from 18 km/h to about 16 km/h"
      ],
      a: 3,
      e: "f₀ = (1/2π)√(k/m), so more mass lowers f₀: (1/2π)√(31 600 ÷ 250) = 1.79 Hz. The dangerous speed is v = d f₀ = 2.5 × 1.79 = 4.47 m s⁻¹ ≈ 16 km/h, also lower. A reverses the mass effect. B splits them, but v = d f₀ means they must change together. C forgets that f₀ depends on m as well as k."
    },
    {
      q: "Which of these is a <strong>useful</strong> application of resonance?",
      o: [
        "A footbridge swaying when a crowd marches across in step",
        "A washing machine shaking violently at one spin speed",
        "Tuning a radio receiver to pick out one station",
        "Window louvres rattling when a heavy generator runs"
      ],
      a: 2,
      e: "A radio's tuning circuit is adjusted until its natural frequency matches the frequency of the wanted station's signal, which then produces a large response while other stations do not. A, B and D are all harmful resonances, where a periodic driving force matches a natural frequency of a structure or machine."
    },
    {
      q: "Soldiers marching across a narrow bridge are often ordered to break step. Why?",
      o: [
        "To reduce the total weight on the bridge",
        "To make the bridge's natural frequency higher",
        "To make their footsteps quieter",
        "So that their footsteps do not provide a periodic force that could match a natural frequency of the bridge and cause resonance"
      ],
      a: 3,
      e: "Marching in step applies a regular push at one frequency; if it matches one of the bridge's natural frequencies, the amplitude can build up dangerously. Breaking step spreads the pushes out in time so they do not add up. A is wrong because the soldiers weigh the same in or out of step. B is wrong because the bridge's natural frequency is fixed by its own mass and stiffness. C is not the safety reason."
    },
    {
      q: "The driver pendulum of a Barton's set is 0.40 m long. What is its frequency? (Take g = 9.8 m s⁻².)",
      o: ["1.27 Hz", "4.95 Hz", "0.79 Hz", "0.032 Hz"],
      a: 2,
      e: "T = 2π√(l/g) = 2π√(0.40 ÷ 9.8) = 2π × 0.202 = 1.27 s, so f = 1/T = 1 ÷ 1.27 = 0.79 Hz. A is the period, not the frequency. B is ω = √(g/l) = 4.95 rad s⁻¹, which is not in hertz. D is (1/2π)√(l/g), the ratio inside the root turned over."
    },
    {
      q: "Tunde said \"faster is always worse\", yet at 30 km/h the crates arrive whole. Which explanation is correct?",
      o: [
        "At 30 km/h the ridges push the rear at about 3.3 Hz, far from its natural frequency of 2.0 Hz, so the amplitude stays small (about 0.6 cm), far too small to lift the crates (the threshold at 3.3 Hz is about 2.2 cm)",
        "At 30 km/h the okada moves too fast for the ridges to push it at all",
        "At 30 km/h the natural frequency of the okada rises to match the ridges",
        "At 30 km/h the shock absorber works better because the oil is hotter"
      ],
      a: 0,
      e: "f = v/d = 8.33 ÷ 2.5 = 3.33 Hz, well above f₀, so the pushes do not arrive in step with the bounce and the response is small: 0.6 cm against a lift-off threshold of g/ω² ≈ 2.2 cm at that frequency. B is false: the ridges still push, just at a frequency that does not match. C is false: f₀ depends on m and k, not on road speed. D invents an effect; the absorber is leaking anyway."
    },
    {
      q: "Which single change would stop the crates lifting off at <strong>every</strong> speed across the ridges?",
      o: [
        "Loading two more crates, which makes the okada heavier and steadier",
        "Replacing the leaking rear shock absorber, so that the resonant amplitude stays near 2 cm, far below the lift-off threshold",
        "Always riding at exactly 16 km/h",
        "Fitting a new rear spring of exactly the same stiffness"
      ],
      a: 1,
      e: "With a healthy shock absorber (ζ ≈ 0.30 in the model) the bounce never grows beyond about 2.0 cm at any speed, so ω²A never reaches g. A only moves the danger from 18 km/h to about 16 km/h (and raises the threshold to 7.8 cm), but lift-off still happens there. C is safe only with the usual load; with two extra crates 16 km/h is the <em>new</em> dangerous speed. D changes nothing, because an identical spring gives the same f₀ and the same resonance, and the damper is still leaking."
    }
  ];
})();
