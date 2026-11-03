# HTML standards for StudyPipe lessons

## Why these rules exist
Lessons are opened from local files inside an Android WebView, offline, on low-end phones.
On `file://`: ES modules (`<script type="module">`) and `fetch()` of local files are blocked.
So everything is classic `<script src>` and data is a JS object, not a JSON file.

## Folder layout produced per topic
```
html/
  index.html          ← shell (do not edit structure; theme via lesson.css)
  lesson.css
  player.js           ← renders sections, narration, quizzes, kit mounting
  lesson-data.js      ← window.LESSON = {...}
  vendor/three-bundle.min.js   (only if a 3D kit is used)
  kits/<kit-id>/kit.js (+ kit.css, assets/)
  img/                (optional local images, compressed)
```

## window.LESSON structure
```js
window.LESSON = {
  slug: "ss2-chem-acid-base-titration",
  title: "Acid–Base Titration",
  subject: "Chemistry", class: "SS2", exams: ["WAEC","NECO","JAMB"],
  objectives: ["Calculate ...", "..."],
  kits: ["titration-bench"],            // kit folders to load (player adds script tags)
  sections: [
    { id: "hook", title: "Why is vinegar sour?", kind: "text",
      html: "<p>...</p>", narration: "..." },
    { id: "explore", title: "Do the titration", kind: "kit",
      kit: "titration-bench", params: { acid: "HCl" },
      html: "<p class='do'>Tap the burette tap to start.</p>", narration: "..." },
    { id: "we1", title: "Worked example 1", kind: "steps",
      steps: [{ html: "n = c × V ...", why: "because ..." }], narration: "..." },
    { id: "check1", title: "Quick check", kind: "quiz", questions: ["q1","q4"] }
  ],
  questions: {
    q1: { type: "mcq", stem: "...", options: { A: ["text","why"], B: ["text","why"] },
          answer: "B", working: "..." }
  }
};
```
Section kinds supported by `player.js`: `text`, `kit`, `steps`, `quiz`, `svg` (put SVG in `html`).

## Visual rules
- Mobile first: 360×740 viewport; tap targets ≥ 44 px; font ≥ 16 px.
- One section per screen with Next/Back; narration button on each screen.
- Colours: use the CSS variables in lesson.css; check contrast (≥ 4.5:1 for text).
- Chemistry/biology colours must be realistic (precipitate colours, indicator colours, tissue).
- SVG: always `viewBox`, no fixed pixel width; labels as `<text>` close to the part.
- 3D: cap pixel ratio at 2, ≤ 50k triangles per scene, pause rendering when the section is hidden.
- No external fonts, CDNs, analytics, iframes, or network requests of any kind.
