/**
 * StudyPipe · math-chain (scripts/lib/math-chain.mjs)
 *
 * Build-time engine behind scripts/compile-math.mjs. Turns a plain calculation chain as it is
 * written in a lesson (e.g. "T = 2π√(0.30 ÷ 49) = 2π√0.00612 = 0.49 s") into:
 *   - a real parse tree (proper operator precedence, never regex guessing),
 *   - LaTeX generated from that tree (so the LaTeX always means what the author wrote),
 *   - a numeric check of every "=" (each step must equal the next, within the rounding shown),
 *   - step tags and notes computed from what actually changed between two steps.
 *
 * Nothing here runs in the browser. Anything it cannot parse is reported, never guessed.
 */

// ---------------------------------------------------------------- tokens
const SUP = { "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4", "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9", "⁻": "-", "⁺": "+", "ⁿ": "n" };
const SUB = { "₀": "0", "₁": "1", "₂": "2", "₃": "3", "₄": "4", "₅": "5", "₆": "6", "₇": "7", "₈": "8", "₉": "9", "ₐ": "a", "ₑ": "e", "ₒ": "o", "ₓ": "x", "ₕ": "h", "ₖ": "k", "ₗ": "l", "ₘ": "m", "ₙ": "n", "ₚ": "p", "ₛ": "s", "ₜ": "t", "ᵢ": "i", "ᵣ": "r" };
const GREEK = { "α": "alpha", "β": "beta", "γ": "gamma", "δ": "delta", "Δ": "Delta", "ε": "varepsilon", "θ": "theta", "λ": "lambda", "μ": "mu", "ρ": "rho", "σ": "sigma", "τ": "tau", "φ": "phi", "ϕ": "phi", "ω": "omega", "Ω": "Omega", "η": "eta", "ν": "nu", "Φ": "Phi" };
const FUNCS = new Set(["sin", "cos", "tan", "sec", "cosec", "cot", "log", "ln", "lg", "exp"]);
// Multi-letter quantity names that must not be split into single-letter products.
const NAMES = new Set(["slope", "gradient", "KE", "PE", "emf", "p.d.", "max", "min", "rms", "Slope"]);
const STOP = new Set(["is", "so", "of", "to", "in", "at", "as", "by", "or", "an", "if", "it", "be", "on", "we", "us", "up", "no", "the", "and", "for", "are", "was", "its", "not", "but", "has", "use", "put", "get", "per", "now", "all", "one", "two", "new", "old", "set"]);
// Units: SI scale of each atom. Only recognised straight after a number (with a space), or ° / %.
const UNITS = {
  m: 1, s: 1, kg: 1, g: 1e-3, N: 1, J: 1, W: 1, V: 1, A: 1, "Ω": 1, Hz: 1, C: 1, K: 1, mol: 1, rad: 1, Pa: 1,
  cm: 1e-2, mm: 1e-3, km: 1e3, nm: 1e-9, dm: 0.1, h: 3600, min: 60, ms: 1e-3,
  kW: 1e3, MW: 1e6, kWh: 3.6e6, kJ: 1e3, MJ: 1e6, mA: 1e-3, kΩ: 1e3, "MΩ": 1e6, kHz: 1e3, kPa: 1e3, mV: 1e-3, kV: 1e3,
};
const UNIT_TEX = { "Ω": "\\Omega", kΩ: "k\\Omega", "MΩ": "M\\Omega" };

const isDigit = (c) => c >= "0" && c <= "9";
const isLatin = (c) => /[A-Za-z]/.test(c);

/** Normalise a raw string (already plain text, as produced by the page's StudyMath.norm). */
export function normText(s) {
  return String(s)
    .replace(/[     ]/g, " ")
    .replace(/[–−]/g, "−").replace(/\*/g, "×")
    .replace(/\s+/g, " ").trim();
}

function tokenize(src) {
  const s = normText(src);
  const out = [];
  let i = 0, sp = false;
  const push = (t) => { t.sp = sp; sp = false; out.push(t); };
  while (i < s.length) {
    const c = s[i];
    if (c === " ") { sp = true; i++; continue; }
    if (isDigit(c) || (c === "." && isDigit(s[i + 1] || ""))) {
      let j = i;
      while (j < s.length && (isDigit(s[j]) || (s[j] === "." && isDigit(s[j + 1] || "")))) j++;
      let text = s.slice(i, j);
      // thousands groups "31 600", "1 000 000": a space then exactly three digits, no decimal point yet
      while (!text.includes(".") && s[j] === " " && /^\d{3}(?!\d)/.test(s.slice(j + 1)) && !/^\d{3}\.\d/.test(s.slice(j + 1))) {
        text += " " + s.slice(j + 1, j + 4); j += 4;
      }
      push({ k: "num", s: text }); i = j; continue;
    }
    if (SUP[c] !== undefined) {
      let j = i, e = "";
      while (j < s.length && SUP[s[j]] !== undefined) e += SUP[s[j++]];
      push({ k: "sup", s: e.replace(/^-/, "-") }); i = j; continue;
    }
    if (SUB[c] !== undefined) {
      let j = i, e = "";
      while (j < s.length && SUB[s[j]] !== undefined) e += SUB[s[j++]];
      push({ k: "sub", s: e }); i = j; continue;
    }
    if (c === "^" || c === "_") {
      let j = i + 1, e = "";
      if (s[j] === "{") { const close = s.indexOf("}", j); if (close < 0) { push({ k: "bad", s: c }); i++; continue; } e = s.slice(j + 1, close); j = close + 1; }
      else { const m = s.slice(j).match(/^[−\-]?[A-Za-z0-9.]+/); e = m ? m[0] : ""; j += e.length; }
      push({ k: c === "^" ? "sup" : "sub", s: e.replace(/−/g, "-") }); i = j; continue;
    }
    if (isLatin(c)) {
      let j = i;
      while (j < s.length && isLatin(s[j])) j++;
      push({ k: "word", s: s.slice(i, j) }); i = j; continue;
    }
    if (GREEK[c]) { push({ k: "greek", s: c }); i++; continue; }
    if (c === "π") { push({ k: "pi", s: c }); i++; continue; }
    if ("+−-×·÷/=≈()[]√°%½¼¾′".includes(c)) { push({ k: "op", s: c === "-" ? "−" : c }); i++; continue; }
    push({ k: "stop", s: c }); i++;
  }
  return out;
}

// ---------------------------------------------------------------- parser
class ParseError extends Error {}

function parseChain(tokens) {
  // split at top-level = / ≈
  const parts = [], rels = [];
  let cur = [], depth = 0;
  for (const t of tokens) {
    if (t.k === "op" && "([".includes(t.s)) depth++;
    if (t.k === "op" && ")]".includes(t.s)) depth--;
    if (t.k === "op" && (t.s === "=" || t.s === "≈") && depth === 0) { parts.push(cur); rels.push(t.s); cur = []; continue; }
    cur.push(t);
  }
  parts.push(cur);
  if (parts.some((p) => !p.length)) throw new ParseError("empty side of an equals sign");
  return { parts: parts.map(parseExpr), rels };
}

function parseExpr(toks) {
  const p = new P(toks);
  const e = p.sum();
  if (!p.end()) throw new ParseError(`unexpected "${p.peek().s}"`);
  return e;
}

class P {
  constructor(t) { this.t = t; this.i = 0; }
  peek(o = 0) { return this.t[this.i + o]; }
  end() { return this.i >= this.t.length; }
  next() { return this.t[this.i++]; }
  isOp(s, o = 0) { const t = this.peek(o); return t && t.k === "op" && s.includes(t.s); }

  sum() {
    const terms = [];
    let sign = "+";
    if (this.isOp("+−")) sign = this.next().s;
    terms.push({ sign, e: this.term() });
    while (this.isOp("+−")) { const s = this.next().s; terms.push({ sign: s, e: this.term() }); }
    if (terms.length === 1 && sign === "+") return terms[0].e;
    return { t: "sum", terms };
  }

  term() {
    let acc = this.impl();
    while (this.isOp("×·÷/")) {
      const op = this.next().s;
      const rhs = this.impl();
      if (op === "÷" || op === "/") acc = { t: "div", a: acc, b: rhs, op };
      else if (acc.t === "mul" && !acc.closed) { acc.f.push(rhs); acc.ops.push(op); }
      else acc = { t: "mul", f: [acc, rhs], ops: [op] };
    }
    if (acc.t === "mul") acc.closed = true;
    return acc;
  }

  // implicit multiplication binds tighter than × and ÷ (so 1/2π = 1/(2π), 4π²/s = (4π²)/s)
  impl() {
    const f = [this.unary()];
    while (!this.end() && this.startsFactor(f[f.length - 1])) f.push(this.unary());
    return f.length === 1 ? f[0] : { t: "mul", f, ops: f.slice(1).map(() => ""), closed: true };
  }

  startsFactor(prev) {
    const t = this.peek();
    if (!t) return false;
    if (t.k === "num") return prev.t !== "num" && !isNumericLeaf(prev) && !t.sp; // "2 3" is not a product
    if (t.k === "word") return !this.unitAhead(prev);
    if (t.k === "greek" || t.k === "pi") return !(t.s === "Ω" && this.unitAhead(prev));
    if (t.k === "op") return "(√½¼¾[".includes(t.s);
    return false;
  }

  unary() {
    if (this.isOp("−")) { this.next(); return { t: "neg", e: this.unary() }; }
    return this.postfix();
  }

  postfix() {
    let e = this.power();
    for (;;) {
      if (this.isOp("°")) { this.next(); e = { t: "deg", e }; continue; }
      if (this.isOp("%")) { this.next(); e = { t: "pct", e }; continue; }
      break;
    }
    // units straight after a number: "2.94 N", "49 N m⁻¹", "3.6 × 10⁶ J"
    const u = this.tryUnits(e);
    if (u) e = { t: "qty", e, unit: u };
    return e;
  }

  power() {
    let b = this.primary();
    while (this.peek() && this.peek().k === "sup" && !this.peek().sp) {
      b = { t: "pow", b, e: parseSup(this.next().s) };
    }
    return b;
  }

  primary() {
    const t = this.next();
    if (!t) throw new ParseError("expression ends too early");
    if (t.k === "num") {
      const dot = t.s.indexOf(".");
      return { t: "num", s: t.s, v: parseFloat(t.s.replace(/ /g, "")), dec: dot < 0 ? -1 : t.s.length - dot - 1 };
    }
    if (t.k === "pi") return { t: "const", name: "pi" };
    if (t.k === "greek") return this.withSub({ t: "sym", name: t.s });
    if (t.k === "op") {
      if (t.s === "(" || t.s === "[") {
        const close = t.s === "(" ? ")" : "]";
        const inner = this.sum();
        if (!this.isOp(close)) throw new ParseError(`missing "${close}"`);
        this.next();
        return { t: "grp", e: inner, open: t.s };
      }
      if (t.s === "√") return { t: "sqrt", e: this.power() };
      if (t.s === "½") return { t: "frac", n: 1, d: 2 };
      if (t.s === "¼") return { t: "frac", n: 1, d: 4 };
      if (t.s === "¾") return { t: "frac", n: 3, d: 4 };
      throw new ParseError(`unexpected "${t.s}"`);
    }
    if (t.k === "word") {
      const w = t.s;
      if (FUNCS.has(w)) return this.func(w);
      if (NAMES.has(w)) return this.withSub({ t: "name", s: w });
      if (STOP.has(w.toLowerCase()) && w.length > 1) throw new ParseError(`word "${w}"`);
      if (w.length > 3) throw new ParseError(`word "${w}"`);
      // "mgh" → m·g·h : put the remaining letters back as separate symbols
      if (w.length > 1) {
        const rest = w.slice(1).split("").map((ch) => ({ k: "word", s: ch, sp: false }));
        this.t.splice(this.i, 0, ...rest);
      }
      return this.withSub({ t: "sym", name: w[0] });
    }
    throw new ParseError(`unexpected "${t.s}"`);
  }

  withSub(node) {
    const t = this.peek();
    if (t && t.k === "sub" && !t.sp) { this.next(); node.sub = t.s; }
    return node;
  }

  func(name) {
    let inv = false, pw = null;
    if (this.peek() && this.peek().k === "sup" && !this.peek().sp) {
      const s = this.next().s;
      if (s === "-1") inv = true; else pw = parseSup(s);
    }
    if (this.end()) throw new ParseError(`${name} has no argument`);
    const arg = this.isOp("(") ? this.postfix() : this.implNoFunc();
    return { t: "fn", name, inv, pw, arg };
  }

  // argument of "sin ωt" / "sin 30°": a run of implicit factors, stopping at the next function
  implNoFunc() {
    const f = [this.unary()];
    while (!this.end() && this.startsFactor(f[f.length - 1]) && !(this.peek().k === "word" && FUNCS.has(this.peek().s))) f.push(this.unary());
    return f.length === 1 ? f[0] : { t: "mul", f, ops: f.slice(1).map(() => ""), closed: true };
  }

  unitAhead(prev) {
    return !!this.scanUnits(prev, true);
  }

  tryUnits(e) {
    const u = this.scanUnits(e, false);
    return u;
  }

  // Units only after a numeric factor, separated by a space, and only if the unit run is followed
  // by the end, an operator, ")" or a relation (so "2 A" in "4A" never becomes amps).
  scanUnits(prev, dry) {
    if (!prev || !isNumericOnly(prev)) return null;
    let j = this.i;
    const first = this.t[j];
    if (!first || !first.sp || !(first.k === "word" || (first.k === "greek" && first.s === "Ω"))) return null;
    const unit = [];
    while (j < this.t.length) {
      const t = this.t[j];
      if (!(t.k === "word" || (t.k === "greek" && t.s === "Ω"))) break;
      if (unit.length && !t.sp) break;
      let name = t.s, k = j + 1;
      // kΩ / MΩ written as word + Ω
      if (t.k === "word" && this.t[k] && this.t[k].k === "greek" && this.t[k].s === "Ω" && !this.t[k].sp) { name += "Ω"; k++; }
      if (UNITS[name] === undefined) break;
      let p = 1;
      if (this.t[k] && this.t[k].k === "sup" && !this.t[k].sp) { p = parseFloat(this.t[k].s); if (isNaN(p)) break; k++; }
      unit.push({ u: name, p });
      j = k;
    }
    if (!unit.length) return null;
    const after = this.t[j];
    const okAfter = !after || (after.k === "op" && "=≈+−×·÷/)]".includes(after.s));
    if (!okAfter) return null;
    if (!dry) this.i = j;
    return unit;
  }
}

function parseSup(s) {
  const e = String(s).replace(/−/g, "-");
  if (/^[+-]?\d+(\.\d+)?$/.test(e)) {
    const v = parseFloat(e);
    if (v < 0) return { t: "neg", e: { t: "num", s: String(-v), v: -v, dec: -1 } };
    return { t: "num", s: String(v), v, dec: -1 };
  }
  return parseExpr(tokenize(e));
}

function isNumericLeaf(n) { return n.t === "num" || (n.t === "pow" && n.b.t === "num"); }
function isNumericOnly(n) { return freeSyms(n).length === 0 && n.t !== "qty" && n.t !== "pct" && n.t !== "deg"; }

// ---------------------------------------------------------------- tree helpers
function kids(n) {
  switch (n.t) {
    case "sum": return n.terms.map((x) => x.e);
    case "mul": return n.f;
    case "div": return [n.a, n.b];
    case "pow": return [n.b, n.e];
    case "neg": case "grp": case "sqrt": case "deg": case "pct": case "qty": return [n.e];
    case "fn": return n.pw ? [n.arg, n.pw] : [n.arg];
    default: return [];
  }
}
export function freeSyms(n) {
  if (n.t === "sym" || n.t === "name") return [n];
  return kids(n).flatMap(freeSyms);
}
function numLeaves(n) {
  if (n.t === "num") return [n];
  return kids(n).flatMap(numLeaves);
}
function hasNum(n) { return numLeaves(n).length > 0; }
function hasDeg(n) { return n.t === "deg" || kids(n).some(hasDeg); }

// ---------------------------------------------------------------- LaTeX
const symTex = (n) => {
  let base = n.t === "name" ? `\\text{${n.s}}` : GREEK[n.name] ? `\\${GREEK[n.name]}` : n.name;
  if (n.sub != null) {
    const sub = /^[A-Za-z]{2,}$/.test(n.sub) ? `\\text{${n.sub}}` : n.sub;
    base += `_{${sub}}`;
  }
  return base;
};
const numTex = (s) => s.replace(/ /g, "\\,");
const unitTex = (u) => u.map(({ u: name, p }) => (UNIT_TEX[name] || name) + (p !== 1 ? `^{${p}}` : "")).join("\\,");

function needsParensAsBase(n) { return ["sum", "mul", "div", "neg", "qty", "frac", "fn", "deg", "pct"].includes(n.t); }

export function toTex(n) {
  switch (n.t) {
    case "num": return numTex(n.s);
    case "const": return "\\pi";
    case "sym": case "name": return symTex(n);
    case "grp": return `\\left(${toTex(n.e)}\\right)`;
    case "frac": return `\\tfrac{${n.n}}{${n.d}}`;
    case "neg": return `-${n.e.t === "sum" ? `\\left(${toTex(n.e)}\\right)` : toTex(n.e)}`;
    case "sum": return n.terms.map((x, i) => (i === 0 ? (x.sign === "−" ? "-" : "") : x.sign === "−" ? " - " : " + ") + toTex(x.e)).join("");
    case "mul": return n.f.map((x, i) => {
      let tx = toTex(x);
      if (x.t === "sum") tx = `\\left(${tx}\\right)`;
      if (i === 0) return tx;
      const op = n.ops[i - 1];
      if (op === "" && x.t === "num") return ` \\times ${tx}`; // never glue two numbers
      return (op === "" ? " " : " \\times ") + tx;
    }).join("");
    case "div": return `\\dfrac{${toTex(stripGrp(n.a))}}{${toTex(stripGrp(n.b))}}`;
    case "pow": {
      const b = needsParensAsBase(n.b) ? `\\left(${toTex(n.b)}\\right)` : toTex(n.b);
      return `${b}^{${toTex(n.e)}}`;
    }
    case "sqrt": return `\\sqrt{${toTex(stripGrp(n.e))}}`;
    case "fn": {
      const name = n.name === "cosec" ? "\\operatorname{cosec}" : n.name === "lg" ? "\\operatorname{lg}" : `\\${n.name}`;
      const sup = n.inv ? "^{-1}" : n.pw ? `^{${toTex(n.pw)}}` : "";
      const arg = n.arg.t === "grp" ? toTex(n.arg) : ` ${toTex(n.arg)}`;
      return name + sup + arg;
    }
    case "deg": return `${toTex(n.e)}^{\\circ}`;
    case "pct": return `${toTex(n.e)}\\,\\%`;
    case "qty": return `${toTex(n.e)}\\ \\mathrm{${unitTex(n.unit)}}`;
    default: throw new Error("toTex: " + n.t);
  }
}
const stripGrp = (n) => (n.t === "grp" ? n.e : n);

// ---------------------------------------------------------------- evaluation
const unitScale = (u) => u.reduce((acc, { u: name, p }) => acc * Math.pow(UNITS[name], p), 1);

export function evaluate(n, si = true) {
  switch (n.t) {
    case "num": return n.v;
    case "const": return Math.PI;
    case "sym": case "name": return NaN;
    case "grp": case "deg": case "pct": return evaluate(n.e, si);
    case "frac": return n.n / n.d;
    case "neg": return -evaluate(n.e, si);
    case "sum": return n.terms.reduce((a, x) => a + (x.sign === "−" ? -1 : 1) * evaluate(x.e, si), 0);
    case "mul": return n.f.reduce((a, x) => a * evaluate(x, si), 1);
    case "div": return evaluate(n.a, si) / evaluate(n.b, si);
    case "pow": return Math.pow(evaluate(n.b, si), evaluate(n.e, si));
    case "sqrt": return Math.sqrt(evaluate(n.e, si));
    case "qty": return evaluate(n.e, si) * (si ? unitScale(n.unit) : 1);
    case "fn": {
      let x = evaluate(n.arg, si);
      const deg = hasDeg(n.arg);
      if (n.inv) {
        const r = n.name === "sin" ? Math.asin(x) : n.name === "cos" ? Math.acos(x) : n.name === "tan" ? Math.atan(x) : NaN;
        return (r * 180) / Math.PI; // inverse trig answers are given in degrees
      }
      if (deg) x = (x * Math.PI) / 180;
      let r;
      switch (n.name) {
        case "sin": r = Math.sin(x); break;
        case "cos": r = Math.cos(x); break;
        case "tan": r = Math.tan(x); break;
        case "sec": r = 1 / Math.cos(x); break;
        case "cosec": r = 1 / Math.sin(x); break;
        case "cot": r = 1 / Math.tan(x); break;
        case "log": case "lg": r = Math.log10(x); break;
        case "ln": r = Math.log(x); break;
        case "exp": r = Math.exp(x); break;
        default: r = NaN;
      }
      return n.pw ? Math.pow(r, evaluate(n.pw, si)) : r;
    }
    default: return NaN;
  }
}

// Relative rounding uncertainty carried by the numbers as they are written.
function relErr(n) {
  switch (n.t) {
    case "num": return n.dec < 0 || n.v === 0 ? 0 : (0.5 * Math.pow(10, -n.dec)) / Math.abs(n.v);
    case "mul": return n.f.reduce((a, x) => a + relErr(x), 0);
    case "div": return relErr(n.a) + relErr(n.b);
    case "pow": { const e = Math.abs(evaluate(n.e)); return (isFinite(e) ? e : 1) * relErr(n.b); }
    case "sqrt": return 0.5 * relErr(n.e);
    case "sum": {
      const tot = Math.abs(evaluate(n));
      const abs = n.terms.reduce((a, x) => a + Math.abs(evaluate(x.e)) * relErr(x.e), 0);
      return tot > 0 ? abs / tot : abs;
    }
    case "fn": return 3 * relErr(n.arg);
    default: return kids(n).reduce((a, x) => a + relErr(x), 0);
  }
}

function compareSidesMode(A, B, si) {
  const a = evaluate(A, si), b = evaluate(B, si);
  if (!isFinite(a) || !isFinite(b)) return { status: "error" };
  const tol = Math.abs(a) * (relErr(A) + relErr(B)) * 1.0001 + 1e-12 * Math.max(1, Math.abs(a));
  return { status: Math.abs(a - b) <= tol ? "ok" : "error" };
}
function opCount(n) {
  const N = n;
  let own = 0;
  if (N.t === "mul") own = N.f.length - 1; else if (N.t === "sum") own = N.terms.length - 1;
  else if (["div", "pow", "sqrt", "fn"].includes(N.t)) own = 1;
  if (N.t === "pow" && N.b.t === "num" && N.b.v === 10) own = 0; // powers of ten are notation
  return own + kids(N).reduce((a, x) => a + opCount(x), 0);
}

/** Compare two numeric sides. Returns {status: ok|warn|error, a, b, tol}. Tries SI and as-written values. */
export function compareSides(A, B) {
  let best = null;
  for (const si of [true, false]) {
    const a = evaluate(A, si), b = evaluate(B, si);
    if (!isFinite(a) || !isFinite(b)) continue;
    const tol = Math.abs(a) * (relErr(A) + relErr(B)) * 1.0001 + 1e-12 * Math.max(1, Math.abs(a));
    const d = Math.abs(a - b);
    const rel = Math.abs(a) > 0 ? d / Math.abs(a) : d;
    const status = d <= tol ? "ok" : rel <= 0.01 || d <= 2 * tol ? "warn" : "error";
    const r = { status, a, b, tol, rel };
    const rank = { ok: 0, warn: 1, error: 2 };
    if (!best || rank[r.status] < rank[best.status]) best = r;
  }
  return best || { status: "error", a: NaN, b: NaN, tol: 0, rel: NaN };
}

// ---------------------------------------------------------------- steps
function unwrap(n) { return n.t === "grp" ? unwrap(n.e) : n; }

// Pairs of sub-trees that differ between two consecutive steps (same shape elsewhere).
function align(a, b, out) {
  const A = unwrap(a), B = unwrap(b);
  if (A.t === B.t) {
    if (A.t === "num") { if (A.v !== B.v) out.push([a, b]); return out; }
    if (A.t === "sym" || A.t === "name") { if (symTex(A) !== symTex(B)) out.push([a, b]); return out; }
    if (A.t === "const") return out;
    if (A.t === "qty" && unitTex(A.unit) !== unitTex(B.unit)) { out.push([a, b]); return out; }
    if (A.t === "fn" && (A.name !== B.name || A.inv !== B.inv)) { out.push([a, b]); return out; }
    if (A.t === "sum" && A.terms.map((x) => x.sign).join() !== B.terms.map((x) => x.sign).join()) { out.push([a, b]); return out; }
    const ka = kids(A), kb = kids(B);
    if (ka.length === kb.length && ka.length > 0) { ka.forEach((x, i) => align(x, kb[i], out)); return out; }
  }
  out.push([a, b]);
  return out;
}

const OPNAME = { div: "Divide", mul: "Multiply", sqrt: "Square root", fn: "Trig value" };
function opTag(n) {
  const N = unwrap(n);
  if (N.t === "pow") { const e = evaluate(N.e); return e === 2 ? "Square" : e === 0.5 ? "Square root" : "Power"; }
  if (N.t === "sum") return N.terms.some((x, i) => i > 0 && x.sign === "−") ? "Subtract" : "Add";
  if (N.t === "fn") return N.inv ? "Inverse trig" : ["log", "lg", "ln"].includes(N.name) ? "Logarithm" : "Trig value";
  if (N.t === "neg") return opTag(N.e);
  return OPNAME[N.t] || "Simplify";
}

const tx = (n) => toTex(n);

/**
 * Build the explained steps of a chain.
 * Returns { lines:[{tag, tex, note:[[kind,text]...], check}], tex, issues:[{level,msg}] }
 */
export function buildChain(raw) {
  const tokens = tokenize(raw);
  const bad = tokens.find((t) => t.k === "stop" || t.k === "bad");
  if (bad) throw new ParseError(`cannot read "${bad.s}"`);
  const { parts, rels } = parseChain(tokens);
  const relTex = (r) => (r === "≈" ? "\\approx" : "=");
  const full = parts.map((p, i) => (i ? ` ${relTex(rels[i - 1])} ` : "") + tx(p)).join("");
  const issues = [];
  const lines = [];
  const numeric = parts.map((p) => freeSyms(p).length === 0);
  const lhsMode = !hasNum(parts[0]) && parts.length > 1;
  const lhs = lhsMode ? tx(parts[0]) : null;
  const startK = lhsMode ? 1 : 0;

  for (let k = startK; k < parts.length; k++) {
    const cur = parts[k];
    const last = k === parts.length - 1;
    const body = last && numeric[k] && parts.length > 1 ? `\\boxed{${tx(cur)}}` : tx(cur);
    const tex = lhsMode ? `${lhs} ${relTex(rels[k - 1])} ${body}` : k === startK ? body : `${relTex(rels[k - 1])} ${body}`;
    let tag, note = [], check = null;
    const prev = k > startK ? parts[k - 1] : null;

    if (!prev) {
      if (!numeric[k]) { tag = "Formula"; note = lhsMode ? [["t", "Start from the formula for "], ["m", lhs], ["t", "."]] : [["t", "Start from this expression."]]; }
      else if (lhsMode) { tag = "Substitute"; note = [["t", "Put the known values into the formula for "], ["m", lhs], ["t", "."]]; }
      else { tag = "Calculation"; note = [["t", "Start from the values given."]]; }
    } else if (!numeric[k - 1] && !numeric[k]) {
      const pairs = align(prev, cur, []);
      const subs = pairs.filter(([a, b]) => freeSyms(a).length && !freeSyms(b).length);
      if (subs.length && subs.length === pairs.length) { tag = "Substitute"; note = subNote(subs); }
      else { tag = "Rearrange"; note = [["t", "Rearrange the formula."]]; }
    } else if (!numeric[k - 1] && numeric[k]) {
      const pairs = align(prev, cur, []);
      const pure = pairs.every(([a, b]) => freeSyms(a).length && isNumericLeafish(b));
      tag = "Substitute";
      note = pure ? subNote(pairs) : [["t", "Put in the known values."]];
    } else if (numeric[k - 1] && numeric[k]) {
      check = compareSides(prev, cur);
      const pairs = align(prev, cur, []);
      const raw = compareSidesMode(prev, cur, false);
      const conv = check.status === "ok" && raw.status === "error";
      const pairChecks = pairs.map(([a, b]) => (freeSyms(a).length ? { status: "error" } : compareSides(a, b)));
      const pairsOk = pairs.length && pairs.length <= 3 && pairChecks.every((c) => c.status !== "error");
      if (conv) { tag = "Convert units"; note = [["t", "Change the units: "], ["m", `${tx(stripGrp(prev))} = ${tx(stripGrp(cur))}`], ["t", "."]]; }
      else if (pairsOk) {
        const tags = [...new Set(pairs.map(([a]) => (unwrap(a).t === "const" ? "Use π" : opTag(a))))];
        tag = tags.length === 1 ? tags[0] : "Simplify";
        note = [];
        pairs.forEach(([a, b], i) => {
          const A = unwrap(a);
          if (i) note.push(["t", i === pairs.length - 1 ? " and " : ", "]);
          if (A.t === "const") note.push(["t", i ? "use " : "Use "], ["m", `\\pi \\approx ${tx(b)}`]);
          else note.push(["t", i ? "" : "Work out "], ["m", `${tx(stripGrp(a))} = ${tx(stripGrp(b))}`]);
        });
        note.push(["t", "."]);
      } else { tag = opTag(prev); note = [["t", "Work out "], ["m", `${tx(stripGrp(prev))} = ${tx(stripGrp(cur))}`], ["t", "."]]; }
      const ops = pairsOk ? Math.max(...pairs.map(([a]) => opCount(a))) : opCount(prev);
      if (ops > 3 && !conv) issues.push({ level: "jump", msg: `step ${k - startK}→${k - startK + 1} does ${ops} operations at once: ${plain(prev)} → ${plain(cur)}` });
      if (check.status === "error") issues.push({ level: "error", msg: `step ${k - startK}→${k - startK + 1}: ${plain(prev)} = ${round(check.a)}, but the chain says ${plain(cur)}` });
      else if (check.status === "warn") issues.push({ level: "warn", msg: `step ${k - startK}→${k - startK + 1}: ${plain(prev)} = ${round(check.a)}; ${plain(cur)} is ${(check.rel * 100).toFixed(2)} % off (rounding drift)` });
    } else {
      tag = "Step";
    }
    if (last && numeric[k] && parts.length > 1 && k > startK) tag = tag === "Convert units" ? tag : "Answer";
    lines.push({ tag, tex, note, check });
  }
  const equation = !lhsMode && !numeric[0];
  return { tex: full, lines, issues, parts, rels, numeric, equation };
}

function isNumericLeafish(n) { return freeSyms(n).length === 0; }
function subNote(pairs) {
  const note = [["t", "Substitute "]];
  pairs.forEach(([a, b], i) => {
    if (i) note.push(["t", i === pairs.length - 1 ? " and " : ", "]);
    note.push(["m", `${tx(stripGrp(a))} = ${tx(stripGrp(b))}`]);
  });
  note.push(["t", "."]);
  return note;
}
const round = (v) => (isFinite(v) ? Number(v.toPrecision(5)).toString() : String(v));
function plain(n) { return toTex(n).replace(/\\left|\\right|\\,|\\ /g, "").replace(/\\dfrac\{([^}]*)\}\{([^}]*)\}/g, "($1)/($2)").replace(/\\times/g, "×").replace(/\\/g, "").replace(/\s+/g, " "); }

/** Parse a chain; returns null (not thrown) if it is not math. */
export function tryChain(raw) {
  try { return buildChain(raw); } catch (e) { if (e instanceof ParseError) return { error: e.message }; throw e; }
}

// ---------------------------------------------------------------- prose
/**
 * Find calculation chains inside a sentence of prose (quiz explanations, Do Now answers).
 * Only maximal runs that parse completely and contain at least two "=" and a number are returned.
 */
export function chainsInProse(text) {
  const s = normText(text);
  // cut at sentence/clause punctuation (keeping decimal points), arrows and "so"/"then"-like words
  const pieces = s.split(/(?:[,;:!?"“”]|\.(?!\d)|⇒|→|\s(?:so|then|thus|therefore|and|which|giving|gives|or)\s)/i);
  const found = [];
  for (const piece of pieces) {
    if ((piece.match(/[=≈]/g) || []).length < 2 || !/\d/.test(piece)) continue;
    const words = piece.trim().split(" ");
    let hit = null;
    // drop leading prose words one at a time until the rest parses
    for (let start = 0; start < words.length && !hit; start++) {
      for (let end = words.length; end > start; end--) {
        const cand = words.slice(start, end).join(" ");
        if ((cand.match(/[=≈]/g) || []).length < 2) break;
        const r = tryChain(cand);
        if (r && !r.error && r.parts.length >= 3 && r.parts.some((p) => hasNum(p))) { hit = { text: cand, chain: r }; break; }
      }
    }
    if (hit) found.push(hit);
  }
  return found;
}
