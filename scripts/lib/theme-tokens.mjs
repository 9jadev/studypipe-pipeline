/**
 * StudyPipe · theme token map (shared by scripts/apply-theme.mjs and the shell tokenizer).
 *
 * The lesson shell CSS was written with literal colours and font names. A theme can only
 * restyle what goes through a CSS variable, so this module rewrites those literals into
 * var(--token) references — in place, idempotently, without touching any other rule.
 * That makes it safe on topic folders whose CSS has been customised.
 *
 * Every token used here MUST be defined by every theme's theme.css (see themes/README.md).
 */

// Literal hex → token. Keys are lower-case 6-digit hex.
export const HEX_TO_TOKEN = {
  "#060912": "--ink-950",
  "#0a0f1d": "--ink-900",
  "#0e1426": "--ink-850",
  "#121a30": "--ink-800",
  "#f5efe4": "--paper",
  "#ece3d3": "--paper-2",
  "#1b1813": "--paper-ink",
  "#6b6253": "--paper-muted",
  "#fffaf2": "--paper-card",
  "#3d362c": "--paper-text",
  "#a79e8e": "--paper-faint",
  "#ded5c4": "--on-ink-soft",
  "#ff3d8b": "--pink",
  "#ff8cbc": "--pink-soft",
  "#ffb23f": "--amber",
  "#ff7a2f": "--orange",
  "#3ee6c4": "--teal",
  "#7cc4ff": "--sky",
  "#d22e56": "--crimson",
  "#c6f36b": "--lime",
  "#9b8cff": "--violet",
  "#1b1206": "--on-amber",
  "#0d9c7e": "--ok",
  "#0b7d65": "--ok-deep",
  "#e7f7f1": "--ok-tint",
  "#f1faf6": "--ok-tint-2",
  "#f0faf5": "--ok-tint-2",
  "#fff4f4": "--bad-tint",
  "#fdecee": "--bad-tint",
  "#fff1ec": "--bad-tint-2",
  "#d98a00": "--warn",
  "#3b6cf6": "--info",
};

// Literal rgba(r, g, b, …) triplet → "-rgb" token (value "r, g, b").
export const RGB_TO_TOKEN = {
  "6,9,18": "--ink-950-rgb",
  "10,15,29": "--ink-900-rgb",
  "27,24,19": "--paper-ink-rgb",
  "245,239,228": "--paper-rgb",
  "210,46,86": "--crimson-rgb",
  "62,230,196": "--teal-rgb",
  "255,178,63": "--amber-rgb",
  "255,61,139": "--pink-rgb",
  "155,140,255": "--violet-rgb",
  "124,196,255": "--sky-rgb",
  "13,156,126": "--ok-rgb",
  "217,138,0": "--warn-rgb",
  "59,108,246": "--info-rgb",
};

// Literal font stacks → font tokens. Matched on the first family name in a font-family declaration.
export const FONT_TO_TOKEN = {
  fraunces: "--font-display",
  manrope: "--font-body",
  "jetbrains mono": "--font-mono",
};

/**
 * Rewrite literals to tokens. The `:root { … }` blocks are left alone (they define tokens,
 * and rewriting them would make tokens refer to themselves).
 * @param {string} css
 * @param {{mathFile?: boolean}} [opts]  math.css uses --font-math for its serif stacks
 * @returns {{css: string, changes: number}}
 */
export function tokenizeCss(css, opts = {}) {
  let changes = 0;
  const parts = css.split(/(:root\s*\{[^}]*\})/g); // odd indices are :root blocks
  for (let i = 0; i < parts.length; i += 2) {
    let s = parts[i];

    s = s.replace(/#([0-9a-fA-F]{6})\b/g, (m) => {
      const tok = HEX_TO_TOKEN[m.toLowerCase()];
      if (!tok) return m;
      changes++;
      return `var(${tok})`;
    });

    s = s.replace(/rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,/g, (m, r, g, b) => {
      const tok = RGB_TO_TOKEN[`${r},${g},${b}`];
      if (!tok) return m;
      changes++;
      return `rgba(var(${tok}),`;
    });

    s = s.replace(/font-family:\s*([^;{}]+)(;|\})/g, (m, stack, end) => {
      if (stack.includes("var(")) return m;
      const first = stack.split(",")[0].trim().replace(/^["']|["']$/g, "").toLowerCase();
      let tok = FONT_TO_TOKEN[first];
      if (!tok) return m;
      if (opts.mathFile && tok === "--font-display") tok = "--font-math";
      changes++;
      return `font-family: var(${tok})${end}`;
    });

    // Roundness dial: single-value pixel radii scale with --corner (1 = shell default).
    // Pills (>= 99px) and percentages stay as they are.
    s = s.replace(/border-radius:\s*(\d{1,2})px\s*(;|\}|!)/g, (m, n, end) => {
      if (Number(n) < 3) return m;
      changes++;
      return `border-radius: calc(${n}px * var(--corner, 1))${end === "!" ? " !" : end}`;
    });

    parts[i] = s;
  }
  return { css: parts.join(""), changes };
}

/** JS patches so canvas labels and Wonder-Wall notes follow the theme. Idempotent. */
export function themeJs(name, src) {
  let changes = 0;
  if (name === "scene-kit.js") {
    src = src.replace(/\(opts\.font \|\| "Manrope, sans-serif"\)/g, () => {
      changes++;
      return '(opts.font || (getComputedStyle(document.documentElement).getPropertyValue("--font-label").trim() || "Manrope, sans-serif"))';
    });
  }
  if (name === "lesson-kit.js") {
    src = src.replace(/var COLORS = \[("#[0-9a-fA-F]{6}",?\s*)+\];/, () => {
      changes++;
      return 'var COLORS = (getComputedStyle(document.documentElement).getPropertyValue("--wall-notes").trim() || "#ffe58a,#ffc7d9,#bff0e1,#cfe3ff,#ffd8b0").split(",").map(function (s) { return s.trim(); });';
    });
  }
  return { src, changes };
}
