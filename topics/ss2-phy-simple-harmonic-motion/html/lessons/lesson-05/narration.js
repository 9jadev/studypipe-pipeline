/* Lesson 05 · StudyNarrator choreography: WAEC Practical — finding g (en-NG). 30 steps.
   Key spotlight parts: bob-centre, cork, ruler (bench); fault replays (zoom). Every wait shows "Your turn!". */
window.NARRATION = {
  rate: 0.96,
  pitch: 1.01,
  pillTitle: "Play the guided practical",

  waits: {
    note: {
      event: "kit:note", timeout: 120000,
      prompt: "Your turn! Pin your idea to the Wonder Wall, or tap a seed note",
      react: function () { return "Pinned! Keep that idea in mind. The bench will tell us which slip costs the most."; }
    },
    sort: {
      event: "l5:sort", timeout: 180000,
      prompt: "Your turn! Sort all ten cards into precaution or source of error, then tap Check",
      react: function (d) {
        if (!d || d.total == null) return "No problem. You can come back to the sort later.";
        if (d.correct === d.total) return "Perfect, ten out of ten! Every precaution starts with I, and it is in the past tense.";
        return "You got " + d.correct + " out of " + d.total + ". Remember: a precaution is something you did, written in the past tense. An error is something that spoilt the result.";
      }
    },
    bench: {
      event: "l5:bench-done", timeout: 420000,
      prompt: "Your turn! Time 20 oscillations twice at all five lengths, with the fault set to none",
      react: function () { return "Excellent! Five lengths, each timed twice. That is a complete composite table, just like the examiner wants."; }
    },
    table: {
      event: "l5:table", timeout: 300000,
      prompt: "Your turn! Type t bar, T and T squared for each row, then tap Check my table",
      filter: function (d) { return d && d.total > 0; },
      react: function (d) {
        if (!d) return "Fine. You can finish the table later; the working is below it.";
        if (d.correct === d.total) return "Every cell is correct. Look at the graph: your points sit on one straight line through the origin.";
        return d.correct + " of " + d.total + " cells are right. Fix the red ones, and remember to square the period, not the time.";
      }
    },
    pin: {
      event: "l5:pin", timeout: 120000,
      prompt: "Your turn! Tap a length pin, then try the length to top switch",
      react: function () { return "See how each length gives one point on the same straight line."; }
    },
    zoom: {
      event: "l5:zoom", timeout: 150000,
      prompt: "Your turn! Pick another fault and watch how the points and g shift",
      react: function (d) { return d && d.mode === "ceiling" ? "The ceiling line slopes downwards and meets the axis at H." : "Good detective work. Compare the pink line with the correct teal line."; }
    },
    bridge: {
      event: "l5:bridge", timeout: 180000,
      prompt: "Your turn! Answer the three questions and give your verdict",
      react: function (d) {
        return d && d.correct
          ? "Case strengthened! With our own g, the danger amplitude is still about six point two centimetres."
          : "Not quite. g is four pi squared over the slope, and lift-off needs omega squared A to reach g. Check the green rings.";
      }
    },
    quiz: {
      event: "kit:quiz-done", timeout: 600000,
      prompt: "Your turn! Answer all the quiz questions, or press Next to skip",
      react: function (d) {
        if (!d) return "Quiz complete!";
        if (d.score >= d.total - 2) return "Excellent, " + d.score + " out of " + d.total + "! You are ready for Paper 3.";
        return "You scored " + d.score + " out of " + d.total + ". Read the explanations, especially on the faults and their directions.";
      }
    }
  },

  actions: {
    story: function (arg) { if (window.StudyScenes && StudyScenes.story) StudyScenes.story.beat(+arg); },
    open: function (arg) { var el = document.querySelector(arg); if (el && el.tagName === "DETAILS") el.open = true; },
    method: function (arg) {
      document.querySelectorAll("#method-cards .method").forEach(function (c, i) { c.classList.toggle("now", i === +arg - 1); });
    },
    bench: function (arg) {
      var b = window.StudyScenes && StudyScenes.bench; if (!b) return;
      var p = String(arg).split(":");
      if (p[0] === "reset") b.reset();
      else if (p[0] === "demo") b.demo && b.demo();
      else if (p[0] === "fault") b.setFault && b.setFault(p[1]);
      else if (p[0] === "len") b.setLength && b.setLength(+p[1]);
      else if (p[0] === "measure") b.measure && b.measure();
      else if (p[0] === "release") b.release && b.release();
    },
    zoom: function (arg) {
      var z = window.StudyScenes && StudyScenes.zoom; if (!z) return;
      var p = String(arg).split(":");
      if (p[0] === "mode") z.setMode(p.slice(1).join(":"));
      else if (p[0] === "y") z.setY(+p[1]);
      else if (p[0] === "reset") z.reset();
    },
    pin: function (arg) { if (window.L05 && L05.showPin) L05.showPin(+arg, true); }
  },

  script: [
    {
      title: "Welcome",
      steps: [
        { target: ".l-hero .display", cue: "Lesson 5 · Finding g", sparkle: true,
          say: "Welcome to Lesson 5. Today you do the real WAEC Paper 3 practical: finding g, the acceleration due to gravity, with a simple pendulum, here in our own lab." },
        { target: ".l-hero .question", cue: "Our guiding question",
          say: "Our guiding question: what is g in our own lab, and how good is our measurement? By the end, you will fill a composite table, plot T squared against l, and get g from the slope." }
      ]
    },
    {
      title: "Do Now",
      steps: [
        { target: "#donow-list", cue: "Your turn", wait: "donow",
          say: "First, four Do Now cards from earlier lessons. Answer each one from memory, reveal it, and mark yourself honestly." }
      ]
    },
    {
      title: "The Story",
      steps: [
        { target: { scene: "story", part: "okafor" }, action: "story:0", cue: "Mrs Okafor",
          say: "In the physics lab, Mrs Okafor says the lift-off rule needs g. Textbooks say nine point eight. She wants our own value, measured here in Ogbomoso." },
        { target: { scene: "story", part: "tunde" }, action: "story:1", cue: "Tunde's ruler",
          say: "Tunde lays the ruler along the thread and stops at the top of the bob. Eighty centimetres, done, he says." },
        { target: { scene: "story", part: "zainab" }, action: "story:2", cue: "The centre of the bob",
          say: "Zainab disagrees. The pendulum swings from the cork to the centre of the bob, so the centre is lower." },
        { target: { scene: "story", part: "tunde" }, action: "story:3", cue: "Counting one",
          say: "Then Tunde lets go, presses the stopwatch and shouts one! Mrs Okafor stops him at once." },
        { target: { scene: "story", part: "okafor" }, action: "story:4", cue: "The examiner's way",
          say: "Small slips like these are where WAEC candidates lose marks. Let us do it the examiner's way, and see how much each slip costs." }
      ]
    },
    {
      title: "Wonder Wall",
      steps: [
        { target: "#wall-wonder", cue: "Your turn", wait: "note",
          say: "Which single slip spoils g the most? Wrong length, wrong count, wrong starting point, or a wide swing? Pin your prediction." }
      ]
    },
    {
      title: "Sort Game",
      steps: [
        { target: "#l05-sort", cue: "Precaution or error?", wait: "sort",
          say: "Examiners give marks only for precautions written in the past tense. Sort the ten cards: precaution, or source of error? Drag each card, or tap it and then tap a bin." }
      ]
    },
    {
      title: "Virtual Lab",
      steps: [
        { target: "#method-cards", action: "method:1", cue: "Five method cards",
          say: "Now the bench. Follow the five method cards: clamp and measure, mark and release, time twenty oscillations twice, repeat for five lengths, then table and graph." },
        { target: { scene: "bench", part: "cork" }, action: "bench:demo", cue: "The split cork",
          say: "The thread is gripped between the two halves of a split cork. That fixes the point of suspension, so the length cannot slip." },
        { target: { scene: "bench", part: "ruler" }, action: "method:1", cue: "Measure to the cork",
          say: "Watch the metre rule. It measures the thread from the lower edge of the cork to the top of the bob, and then we add the radius, two point zero centimetres." },
        { target: { scene: "bench", part: "bob-centre" }, cue: "Length to the centre",
          say: "So the effective length l runs to the centre of the bob. For the first length, l is zero point four zero zero metres." },
        { target: "#bench-stage", action: "method:3", cue: "Your turn", wait: "bench",
          say: "Your turn. For each length, press Release, then Time 20 twice for t one and t two. Count from zero as the bob passes the rest mark. Do all five lengths with the fault set to none." },
        { target: "#results-table", cue: "Your turn", wait: "table",
          say: "Each length added a row. Now you work it out: t bar is the mean of t one and t two, T is t bar divided by twenty, then T squared. Type them in and tap Check." },
        { target: "#graph-card", action: "open:#expected", cue: "T squared against l",
          say: "Your correct rows plot here: T squared up the side, l along the bottom, on one line through the origin. From a large triangle on the drawn line the slope is about four point zero three seconds squared per metre, so g equals thirty nine point four eight over four point zero three, which is nine point seven nine metres per second squared." },
        { target: "#fault-trials", action: "bench:fault:count-from-1", cue: "Try a fault",
          say: "Now try a slip. Set the fault to counts from one and time the first length twice. Only nineteen swings are timed, so g jumps to about ten point eight five. That is eleven percent too big." }
      ]
    },
    {
      title: "Make Sense",
      steps: [
        { target: "#t2l-box", action: "bench:fault:none", cue: "From formula to line",
          say: "Why does this work? Square T equals two pi root l over g, and you get T squared equals four pi squared over g, times l. That is y equals m x, with slope four pi squared over g." },
        { target: "#ceiling-box", cue: "The ceiling variant",
          say: "If the ceiling is out of reach, measure y, the height of the bob's centre above the floor. Then l equals H minus y. The T squared against y line slopes downwards, and it meets the y axis at H, the ceiling height." },
        { target: "#props-table", cue: "Precaution or error",
          say: "Learn this table. A precaution is something you did, in the past tense, and it earns marks. A source of error is something that spoilt the result." },
        { target: "#pos-explorer", action: "pin:2", cue: "Your turn", wait: "pin",
          say: "Your turn. Tap a length to see its T and T squared on the line. Then switch on length to top, and watch every point slide left by two centimetres." }
      ]
    },
    {
      title: "Zoom",
      steps: [
        { target: "#zoom-stage", action: "zoom:mode:fault:count-from-1", cue: "Count from one",
          say: "The error detective. Watch the counter in slow motion: Tunde says one at the start, so twenty means only nineteen swings. The pink line is too low, so g comes out too large." },
        { target: "#zoom-stage", action: "zoom:mode:fault:length-to-top", cue: "Length to the top",
          say: "Now length to the top. Every point moves left by the radius. The line misses the origin, but its slope, and so g, is unchanged. That is why the graph beats a single reading." },
        { target: "#zoom-stage", action: "zoom:mode:ceiling", cue: "Your turn", wait: "zoom",
          say: "Your turn. Try the wide forty degree swing or the conical swing, or the ceiling rig. Watch how the points and g shift." }
      ]
    },
    {
      title: "Worked Examples",
      steps: [
        { target: ["#ex1", "#ex2", "#ex3", "#ex4"], action: "zoom:reset", cue: "Four worked examples",
          say: "Four worked examples. One: g from the slope, nine point seven nine. Two: one reading, add the radius first, nine point eight zero. Three: forgetting the radius makes one reading two point five percent too low. Four: the ceiling variant, g nine point eight zero and H two point eight zero metres." }
      ]
    },
    {
      title: "Solving the Mystery",
      steps: [
        { target: "#bridge-card", cue: "Your turn", wait: "bridge",
          say: "Back to Ridge Road. Use our class g, nine point seven nine, and the okada's omega, twelve point five seven radians per second. Answer the three questions and give your verdict." },
        { target: "#big-idea", cue: "The big idea", sparkle: true,
          say: "The big idea: plot T squared against l, and g equals four pi squared over the slope. Precautions are things you did; errors are things that went wrong." }
      ]
    },
    {
      title: "Quiz & Reflection",
      steps: [
        { target: "#quiz-list", cue: "Your turn", wait: "quiz",
          say: "Now the quiz: twelve WAEC style questions, plus two review questions from earlier lessons." },
        { target: ["#reflect", "#assignment"], cue: "Reflect and assignment",
          say: "Rate yourself from one to four on each goal, then do the exit ticket and the blank page recall. Your assignment: measure g at home with a stone and a thread, then the thirty mark Paper 3 question. Write your answer before you unlock each model solution. Well done today!" }
      ]
    }
  ]
};
