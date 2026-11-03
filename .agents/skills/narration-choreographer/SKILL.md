---
name: narration-choreographer
description: Authors welcome-narration.js (for the Unit Welcome Hub) and narration.js (for each lesson) — choreographing Nigerian English (en-NG) teacher voice dialogue, DOM & 3D spotlight targets, bouncing pointer cues, sparkle bursts, live scene actions, and interactive "Your turn!" waits with dynamic score reactions.
---

# Narration Choreographer

Goal: turn both the **Unit Welcome Hub (`html/index.html`)** and **every individual lesson (`html/lessons/lesson-0X/index.html`)** into a live, one-on-one interactive tour with a warm **Nigerian science teacher (`en-NG` voice priority)** using `StudyNarrator` (`assets/js/narrator.js`).

## Nigerian English (`en-NG`) Voice Priority
`StudyNarrator` (`assets/js/narrator.js`) is engineered to **strictly prioritise Nigerian English (`en-NG`)**:
1. **Voice Ranking (`rankVoice`):**
   - **#1 Priority (`+500`):** Any Nigerian English voice (`lang` matching `en-NG` / `en_NG` or voice name containing `Nigeria`, `Nigerian`, `Abeo`, `Ezinne`), whether `localService` is true or false.
   - **#2 Priority (`+200`):** Other African English voices (`en-GH`, `en-KE`, `en-ZA`, `en-TZ`).
   - **#3 Priority (`+60`):** British English (`en-GB`, matching WAEC terminology).
   - **Default Utterance Locale:** Even when a generic fallback voice is used by the OS WebView, `u.lang` defaults to `"en-NG"` so Android/iOS TTS engines apply Nigerian English pronunciation rules.
2. **Writing Style for `en-NG` TTS Clarity:**
   - Write warm, encouraging, natural Nigerian classroom English (*"Welcome! Let's step into Mama Ngozi's clock stall in Yaba Market…"*, *"Look closely at the brass bob as it crosses the chalk mark…"*).
   - Spell out symbols and units inside `say` strings so the TTS engine pronounces them naturally:
     - Write `"two pi root L over g"` instead of `"2π√(L/g)"`.
     - Write `"metres per second squared"` instead of `"m s⁻²"`.
     - Write `"omega squared x"` instead of `"ω²x"`.
     - Write `"T squared"` instead of `"T²"`.

## How `StudyNarrator` Works (`assets/js/narrator.js`)
`StudyNarrator` reads `window.NARRATION = { rate, pitch, waits, actions, script }`:
1. **Word-by-word live highlight:** Every word in `step.say` is wrapped in `<span class="w">` and highlighted with `.said` and `.now` (amber pill) in real time.
2. **Smooth Scroll + Conic Spotlight (`.narr-spot`):**
   - `target: "#objectives"` → spotlights a single DOM element.
   - `target: ["#vt-a", "#vt-b"]` → spotlights the bounding union of multiple elements.
   - `target: { part: "bob" }` → spotlights a 3D part on the Welcome Hub's `window.StudyLab`.
   - `target: { scene: "bench", part: "bob" }` → calls `window.StudyScenes.bench.rect("bob")` and `.highlight("bob")` to spotlight and pulse-glow a specific 3D object inside a lesson's Three.js canvas.
3. **Bouncing Hand Pointer Cue (`.narr-cue`):** When `cue: "Read the scale"` is set on a step, a pill with a pointing hand (`👉` / `👈` / `👇`) floats right beside the spotlighted target.
4. **Sparkle Bursts (`sparkle: true`):** Spawns animated SVG star bursts around key reveal moments (`data-hook` headings, big callouts, or solved mysteries).
5. **Live Page & 3D Choreography (`action`):**
   - Built-in patterns in `narrator.js`:
     - `"story:2"` → advances 3D `StoryStage` to beat `2`.
     - `"method:1"` → highlights `.method` card `1`.
     - `"open:#expected"` → opens a `<details>` reveal box.
     - `"bench:test:0"` → triggers a method on `window.StudyScenes.bench`.
     - `"combo:weak-strong"` / `"myth:0"` → switches tabs or flips myth cards on the Welcome Hub.
   - Custom actions defined in `window.NARRATION.actions["my-action"] = function() { ... }`.
6. **"Your Turn!" Interactive Waits (`wait`):**
   - Displays a pulsing teal **"Your turn!"** badge (`prompt`), undims the spotlight so the student can interact, and listens for the configured DOM `CustomEvent`.
   - Speaks `waits[name].react(detail)` aloud dynamically based on the student's score or lab result before advancing.

## Two Narration Scripts Required Per Topic
1. **Unit Welcome Hub Narration (`html/assets/js/welcome-narration.js`):**
   - 9 chapters guiding the student through the Welcome Hub:
     - `Welcome` (Hero title, meta, 3D Hero Lab overview)
     - `The 3D Lab` (spotlighting `{ part: "..." }` on `window.StudyLab`, triggering demo actions, and `"Your turn!"` wait on `lab:result`)
     - `The Mystery` (`#mystery`, `.case-card`, `.stats`)
     - `Your Lesson Journey` (`#journey`, spotlighting each lesson card `L1`–`LN` and `.thread-note`)
     - `Interactive Explorer` (`#explorer`, auto-clicking `.combo-tab` tabs and spotlighting `#combo-curve` & `#combo-ind`)
     - `What You Will Master` (`#master`, `.outcomes`)
     - `Calculation Archetypes` (`#archetypes`, `.formula-strip`)
     - `Three Myths to Bust` (`#myths`, flipping each `.myth-card` with `action: "myth:0"`, `"myth:1"`, `"myth:2"`)
     - `Ready to Begin` (`#method`, `.finale`)
2. **Per-Lesson Narration (`html/lessons/lesson-0X/narration.js`):**
   - 8–10 chapters per lesson: `Welcome & Do Now`, `The Story`, `Wonder Wall`, `Sort Game`, `Virtual Lab Bench`, `Make Sense`, `3D Concept Zoom`, `Worked Examples`, `Solving the Mystery (The Bridge)`, and `Quiz & Reflection`.
