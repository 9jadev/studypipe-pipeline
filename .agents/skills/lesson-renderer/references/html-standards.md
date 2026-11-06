# HTML & Design System Standards for StudyPipe Multi-Lesson Units

## 1. Offline WebView Rules
Units and lessons run from local files (`file://`) inside an Android WebView on low-end phones with no internet connection:
- **No ES modules** (`<script type="module">` fails on `file://`). Every script is a classic `<script src="...">`.
- **No `fetch()` or `XMLHttpRequest`**. All data lives in classic JS scripts (`retrieval-bank.js`, `data.js`, `narration.js`, `welcome-narration.js`).
- **No CDN links or external web fonts**. The theme's fonts are loaded locally from `assets/fonts/*.woff2` via `assets/css/fonts.css`, both installed by `scripts/apply-theme.mjs` from `themes/_fonts/`.
- **Nigerian English (`en-NG`) Voice Priority:** `assets/js/narrator.js` ranks Nigerian English (`en-NG` / `en_NG` / `Abeo` / `Ezinne`) at `#1` priority (`+500`) and defaults `u.lang = "en-NG"`.

## 2. Multi-Lesson Folder Layout Produced in `topics/<slug>/html/`
```text
topics/<slug>/html/
  index.html                      ← Unit Welcome Hub (3D Hero Lab, Mystery, Lesson Journey, Explorer, Archetypes, Myths, Method)
  assets/
    fonts/                        ← the theme's .woff2 files + OFL-<font>.txt (from themes/_fonts)
    css/
      fonts.css                   ← generated @font-face rules for the theme's fonts
      theme.css                   ← the topic's theme (tokens + overrides); linked LAST on every page
      style.css                   ← Unit Welcome Hub & shared editorial design tokens, typography, buttons, hero
      lesson.css                  ← sticky .l-rail, .l-sec paper & dark cards, tables, .stage, .quiz, .aq
      narrator.css                ← StudyNarrator dock, word highlight (.w.said/.w.now), .narr-spot, .narr-cue, sparkles
    js/
      three.min.js                ← Three.js r160 + OrbitControls bundle
      scene-kit.js                ← Studio-lit 3D stage wrapper + 3D-to-2D rect projection (stage.rectOf)
      lesson-kit.js               ← Rail tracker, Wonder Wall, Do Now, Quiz, Self-rating, Locked Solutions
      story-scene.js              ← 3D Nigerian StoryStage character & set engine
      narrator.js                 ← Nigerian English (en-NG priority) StudyNarrator guided tour engine
      welcome.js                  ← Welcome Hub scroll-reveal, Interactive Explorer tabs, Myth flip cards
      welcome-lab.js              ← Welcome Hub Hero 3D Lab (window.StudyLab)
      welcome-narration.js        ← Welcome Hub guided tour script (window.NARRATION)
      retrieval-bank.js           ← Shared spaced-retrieval bank (window.RETRIEVAL_BANK.l01 .. l0N)
  lessons/
    lesson-01/
      index.html                  ← Lesson 01 5-phase editorial lesson page
      data.js                     ← Lesson 01 items, lab data, window.LESSON_QUIZ
      story.js                    ← Lesson 01 3D opening phenomenon story beats
      bench.js                    ← Lesson 01 3D virtual practical bench (window.StudyScenes.bench)
      zoom.js                     ← Lesson 01 3D concept/vector/particle zoom stage (window.StudyScenes.zoom)
      lesson.js                   ← LessonKit.boot() + Sort game + Results table + Scale explorer + Bridge test
      narration.js                ← Lesson 01 window.NARRATION choreographed spotlight script
    lesson-02/
      ... (same 7 files)
    lesson-0N/
      ... (same 7 files)
```

## 3. Typography & Visual Rhythm Rules

Fonts and colours come from the topic's theme (`themes/<id>/theme.css`, see `themes/README.md`). Always style
with tokens (`--font-display`, `--font-body`, `--font-mono`, `--font-math`, `--ink-*`, `--paper-*`, `--crimson`,
`--amber`, `--ok`, …), never with literal colours or font names. The values below describe the default theme
(`editorial-ink`); the *roles* hold for every theme.

- **Display headings (`h1`, `h2`, `h3`):** `var(--font-display)` (`Fraunces`), optical sizing enabled, italic `<em>` phrases highlighted in crimson (on paper sections) or amber (on dark sections).
- **Body copy:** `var(--font-body)` (`Manrope`), `16.5px`, line-height `1.7`, aligned cleanly within `76ch` max width.
- **Monospace / Readouts / Equations / Badges:** `var(--font-mono)` (`JetBrains Mono`), `font-variant-numeric: tabular-nums` so numbers never jitter during live 3D timing.
- **Dual-Theme Rhythm:**
  - The **Unit Welcome Hub (`html/index.html`)** uses a sleek dark-ink studio aesthetic with radial glows, interactive 3D Hero Lab, lesson roadmap cards, and interactive explorer panels.
  - Inside each **Lesson (`html/lessons/lesson-0X/index.html`)**, `.l-hero` uses deep dark ink (`--ink-950: #060912`), while `.l-sec` uses warm editorial textbook paper (`--paper: #f5efe4` and `--paper-card: #fffaf2`) for comfortable reading, worked examples, and tables, embedding dark interactive widget panels (`.stage`, `.sort`, `.vt`, `.quiz`, `.donow`) for high-contrast visual focus.
