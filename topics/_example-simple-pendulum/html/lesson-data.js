window.LESSON = {
  slug: "_example-simple-pendulum",
  title: "Simple Pendulum (example)",
  subject: "Physics", class: "SS2", exams: ["WAEC", "NECO", "JAMB"],
  lang: "en-GB", version: 1, needs3d: true,
  objectives: ["Measure the period of a simple pendulum", "Determine g from a graph of T² against l"],
  kits: ["pendulum"],
  sections: [
    { id: "hook", title: "Why does a swing keep its rhythm?", kind: "text",
      html: "<p>Watch a child on a playground swing. Big push or small push, each swing takes about the same time. Today you will find out why, and use it to measure gravity itself.</p>",
      narration: "Watch a child on a playground swing. Big push or small push, each swing takes about the same time. Today you will find out why, and use it to measure gravity itself." },
    { id: "explore", title: "Time 20 oscillations", kind: "kit", kit: "pendulum",
      params: { length_m: 0.8, angle_deg: 10 },
      html: "<p class='do'>Tap <b>Release bob</b>, then <b>Start stopwatch</b>. Stop it after 20 oscillations.</p>",
      narration: "Tap release bob. When it is swinging steadily, start the stopwatch, count twenty complete oscillations, then stop it." },
    { id: "we1", title: "Worked example: finding the period", kind: "steps",
      steps: [
        { html: "20 oscillations took 36.0 s.", why: "Timing many oscillations reduces the effect of your reaction time." },
        { html: "T = 36.0 ÷ 20 = 1.80 s", why: "The period is the time for one complete oscillation." },
        { html: "T² = 3.24 s²", why: "We plot T² against l because T² is proportional to l, giving a straight line." }
      ],
      narration: "Twenty oscillations took thirty-six seconds. So one oscillation, the period, is one point eight seconds." },
    { id: "check1", title: "Quick check", kind: "quiz", questions: ["q1"] }
  ],
  questions: {
    q1: { type: "mcq", stem: "Why do we time 20 oscillations instead of one?",
          options: {
            A: ["To make the pendulum swing faster", "Timing does not change how the pendulum swings."],
            B: ["To reduce the effect of reaction-time error", "Correct: the same reaction error is spread over 20 oscillations."],
            C: ["Because WAEC says 20 is the law", "20 is a convenient choice, not a law."],
            D: ["To increase the amplitude", "Amplitude depends on the release angle."]
          },
          answer: "B" }
  }
};
