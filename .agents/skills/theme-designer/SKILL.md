---
name: theme-designer
description: Designs a new visual theme (HTML template look) for StudyPipe units by interviewing the human about audience, mood, colours, fonts and shape, then building themes/<id>/ (theme.json + theme.css), validating it, screenshotting it on a real lesson and iterating until they approve. Also lists, compares, switches and edits existing themes. Use when asked to "design a template", "make a new theme/look/style", "change the fonts/colours", "show me the templates", or "use a different template for <topic>".
---

# Theme Designer

Goal: turn a human's description of how they want lessons to *feel* into a working, offline,
accessible theme that every topic can use. The page structure and engines are shared; a theme
changes fonts, colours, roundness and small visual details only.

Read first: `themes/README.md` (token contract, font library, rules) and `themes/catalog.md`.

This skill needs a human. In batch mode never design a theme: use the topic's `theme:` or the default.

## A. "Show me the templates" / choosing one

1. Run `node scripts/apply-theme.mjs --list`.
2. If any theme lacks `preview/`, run `node scripts/theme-preview.mjs --all`.
3. Tell the human to open `themes/gallery.html` (side-by-side phone previews). Describe each theme in
   one line (mood, fonts, best audience) and recommend one for their topic.
4. Apply their choice: `node scripts/apply-theme.mjs topics/<slug> <theme-id>`, then re-run QA
   (`node scripts/qa.mjs topics/<slug>`) and packaging if the topic was already packaged.
5. To change the studio default, write the id into `themes/default.txt`.

## B. Designing a new theme

### 1. Interview (one message, at most 7 questions, offer examples so it is easy to answer)

Ask:
1. **Who is it for?** JSS / SS1–SS2 / SS3 exam revision / a specific school or brand.
2. **Three words for the feeling**, e.g. calm, bold, playful, premium, serious, techy, warm, Afro-modern.
3. **Colours.** School or brand colours to use? Any to avoid? (Hex codes or "like the Nigerian flag",
   "like Lagos BRT buses".)
4. **Dark vs light.** The shell has dark stages (hub, lesson hero, labs) and light reading pages.
   How dark should the dark parts be (near-black / deep coloured / mid-tone), and what kind of page
   colour do they like (cream paper / pure white / cool grey / soft tint)?
5. **Type personality.** Offer 3 pairings from the library that fit their words, e.g.
   *Serif + clean sans* (Lora / Inter), *Techy* (Space Grotesk / Plus Jakarta Sans), *Rounded & friendly* (Baloo 2 / Nunito),
   *Exam-paper* (Source Serif 4 / Atkinson Hyperlegible).
6. **Shape.** Crisp corners, balanced, or soft and bubbly?
7. **References** (optional). Screenshots, a website, a poster. Ask them to drop images in `themes/<id>/refs/`, then look at them.

If the human gives a vague brief ("make it nicer", "something modern"), do not ask everything: propose
**three named directions** (2 lines each: mood, palette, fonts, shape), let them pick, then continue.

### 2. Write the brief back (3–6 lines) and get a yes

Name, id (kebab-case), audience, mood words, ink hue, paper tone, accent roles, font pairing, `--corner`.
State any request you cannot meet and the nearest alternative (see *Limits*).

### 3. Build

1. `mkdir themes/<id>` and copy `themes/editorial-ink/theme.css` as the starting point, so every token is present.
2. Write `theme.json`: `id`, `name`, `description` (1–2 sentences a teacher would understand),
   `audience`, `mood[]`, `fonts{display, body, mono, math}` (ids from `themes/_fonts/fonts.json`), `themeColor` (= `--ink-950`).
3. Set the tokens using this recipe:
   - **Ink scale.** Pick the ink hue and step lightness up gently: `--ink-950` (L≈6–10%) → `--ink-600` (L≈30–35%).
     Keep saturation moderate; neon ink tires the eyes. `--fg` near-white tinted with the hue, `--fg-soft` and
     `--muted` progressively greyer. `--line`/`--line-strong` = fg-tinted white at 0.09 / 0.18 alpha.
   - **Paper.** `--paper` light (L≥94%), `--paper-card` lighter or white, `--paper-2` one step darker.
     `--paper-ink` almost-black tinted to match, `--paper-text` softer, then `--paper-muted`, `--paper-faint`.
   - **Accents by role.** `--amber` is the highlight on ink (eyebrows, focus, active step). It may be any hue but must be
     bright on ink and carry `--on-amber` text. `--crimson` is heading emphasis on paper and errors, so keep it reddish/pink.
     `--ok` stays green, `--warn` amber/orange, `--info` blue. `--teal`, `--sky`, `--pink`, `--violet`, `--lime`, `--orange`
     are decorative glows and chart colours; harmonise them with the palette.
   - **Every `-rgb` token** = the matching hex as `r, g, b`.
   - **Fonts.** `--font-*` first family = the library family; add sensible fallbacks. `--font-math` = a serif with italic.
   - **Shape.** `--corner` 0.4–0.6 crisp, 1 balanced, 1.3–1.5 bubbly; set `--radius-sm/--radius/--radius-lg` to match.
4. Add component overrides below `:root` for personality (see README rules): heading weight, tracking and leading for the
   chosen display face; `em` without italic for fonts lacking one; optional texture on `.l-sec`. Keep it under ~60 lines.

### 4. Validate and preview (loop until clean)

```bash
node scripts/check-theme.mjs <id>          # must PASS: tokens, fonts, contrast, font budget
node scripts/theme-preview.mjs <id>        # themes/<id>/preview/*.png + rebuilds gallery.html & catalog.md
```
Look at every preview PNG yourself before showing the human. Check that headings fit at 360 px without
awkward breaks, emphasis words stand out, paper text is comfortable, buttons and badges are readable,
the hub doesn't look muddy, and nothing looks like a broken font (fallback serif/sans).
Fix and re-run until you would ship it.

### 5. Show, iterate, finish

- Show the human the phone previews (paths, or `themes/gallery.html`) with a 3-line summary of decisions.
- Apply their feedback (usually tokens or overrides), re-check, re-preview. Repeat until they approve.
- On approval: apply it where they asked (`node scripts/apply-theme.mjs topics/<slug> <id>`), set it as default if asked,
  and confirm `themes/catalog.md` lists it.
- If the feedback is a general rule ("never use pure white paper"), add it to *Lessons learned* below.

## Editing an existing theme

Edit `themes/<id>/theme.css` / `theme.json`, run check and preview again, then re-apply it to every topic that uses it.
Those topics are the ones whose `status.md` has `theme: <id>`. Re-run their QA.

## Limits (say so honestly, offer the nearest option)

- **Structure is shared.** Section order, widgets, 3D stages and narrator are the same in every theme.
  A request like "put the quiz in a sidebar" is a shell change, not a theme.
- **Dark stages stay dark, paper stays light.** The shell places white text on ink surfaces and dark text on paper.
  An all-white hub needs shell work. The nearest theme option is a mid-tone coloured ink (e.g. deep teal) with a white paper.
- **Fonts must come from `themes/_fonts/`.** New families can be added (see README) but must be OFL and offline, ≤450 KB per theme.
- **3D apparatus colours** belong to kits, not themes.

## Lessons learned
- (add general feedback rules here)
