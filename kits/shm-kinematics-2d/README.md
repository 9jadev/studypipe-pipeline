# shm-kinematics-2d · v2 (Paper.js) · `window.ShmKinematics2D`

Planar SHM scenes for the SS2 Simple Harmonic Motion unit, drawn with **Paper.js** (rule 5b: projections,
graphs and planar force diagrams are 2D). Classic script, offline, no modules, no `fetch()`.
Every number shown comes from `ShmKinematics2D.model`. Colours and the label font are read from the
theme's CSS variables at draw time (`--sky`, `--teal`, `--amber`, `--crimson`, `--violet`, `--lime`,
`--pink-soft`, `--fg`, `--fg-soft`, `--muted`, `--line`, `--line-strong`, `--ink-*`, `--font-mono`; the
`surface: "paper"` option swaps to the paper tokens). There are no literal colours or font names.

| File | What it is |
|---|---|
| `shm-kinematics-2d.js` | **v2 kit** → copy to `html/assets/js/shm-kinematics-2d.js` |
| `demo.html` | v2 demo: all 8 scenes, touch controls, live readout, built-in physics self-check (`window.SHM_CHECKS`) |
| `kit.js`, `demo-v1.html` | **legacy v1** (`StudyPipeKits["shm-kinematics-2d"].mount`, raw Canvas 2D). Left untouched for old topics; do not use in new lessons |
| `qa/` | screenshots of every scene at 360 × 740 and desktop |

## Load order

```html
<script src="../../assets/js/paper-core.min.js"></script>   <!-- window.paper -->
<script src="../../assets/js/shm-kinematics-2d.js"></script>
```

## API

```js
var k = ShmKinematics2D.create({
  canvas: document.getElementById("bench-canvas"), // a <canvas> (or a container: a canvas is created inside)
  scene: "wheel",                                  // see Scenes (alias: mode)
  A: 0.30, T: 2.0,                                 // any scene parameter (below)
  autoplay: true, labels: true, surface: "ink",    // "ink" = dark stage (default) | "paper"
  onChange: function (reading) { /* user drag / step / setState; bench.js emits l0X:bench from here */ }
});
```

The kit sizes itself to the canvas's **parent** (`.stage-canvas` with the canvas absolutely inset) and redraws on
resize (ResizeObserver). Each instance runs its own `new paper.PaperScope()`, so a bench and a zoom can share a page.

| Method | Does |
|---|---|
| `setState(patch)` | Change any parameter; `{ scene }` switches scene (resets to that scene's defaults, then applies the rest of the patch); `{ preset: "okada" \| "lab" }`; `{ angle_deg }` sets ωt; `{ t }` sets time; `{ playing }` |
| `setMode(scene)` | Same as `setState({ scene })` |
| `reading()` | Model values for the current instant (see Readings) |
| `rect(part)` | Viewport rect `{ left, top, width, height }` of a named part (Paper item bounds + canvas rect) for `StudyNarrator` spotlights; whole canvas if the part is not drawn |
| `highlight(part \| null)` | Pulsing dashed halo around the part |
| `play()` · `pause()` · `toggle()` · `isPlaying()` | Animation clock |
| `step(deg)` | Pause and advance the phase by `deg` (wheel/circle/graphs snap to the 30° grid: 0 → 30 → 60 → 90) |
| `reset()` · `resize()` · `refreshTheme()` · `destroy()` | Housekeeping (`destroy` stops the loop and removes listeners) |
| `parts()` | Part names for the current scene |
| `state()` | Copy of the current parameters |

Touch: drag or tap on the canvas sets the motion (wheel/circle: angle; traces: time cursor; energy: x; resonance:
speed; pendulum-forces: θ; phase-strip: position). The canvas keeps `touch-action: pan-y` from the stage CSS so the
page still scrolls on vertical swipes.

Statics: `ShmKinematics2D.model`, `.defaults`, `.sceneDefaults`, `.presets`, `.scenes` (= `.modes`), `.parts`,
`.format.sf(v, n)` (n significant figures, Unicode minus), `.format.fx(v, dp)`, `.version` (2).

## Scenes

| Scene | Parameters (defaults) | Parts | Lesson |
|---|---|---|---|
| `wheel` | `A` 0.30 m (0.10–0.40), `T` 2.0 s (1.0–4.0), `Amax` 0.40, `graphs` false | `wheel, lump, radius, angle, shadow, v-arrow, a-arrow, centre` (+ `trace-x, trace-v, trace-a, cursor` with graphs) | L03 bench |
| `circle` | `preset` `lab` (A 0.30 m, T 2.0 s) or `okada` (ω² = k/m = 158 s⁻², A 3 cm, Amax 8 cm, g line on), `gLine` | `circle, point, radius, angle, shadow, v-arrow, a-arrow, centre, trace-x, trace-v, trace-a, cursor, g-line` | L03 zoom |
| `graphs` | as `circle` | `trace-x, trace-v, trace-a, cursor, g-line` | L03 |
| `energy` | `k` 50 N m⁻¹, `m` 0.50 kg, `A` 0.10 m, `view` `both \| x \| t` | `mass, spring, track, pe-curve, ke-curve, total-line, crossover, cursor, pe-t, ke-t` | L06 |
| `damping-trace` | `set` `kinds` (light ζ 0.05 / critical 1 / heavy 3, T 1.0 s) or `shock` (healthy 0.30 / leaking 0.05, okada f₀), `forced` (ten pushes at f₀, Y = 1 cm), `show` [keys], `A0` 0.05 m | `light, critical, heavy, healthy, leaking, envelope, lift-line, pen` | L06 zoom side panel |
| `resonance` | `speed_kmh` 18, `zeta` 0.05 (0.05–0.30), `load_kg` 200 \| 250, `Y` 0.010 m, `d` 2.5 m, `kSpring` 4π²f₀²m ≈ 31 583 (f₀ = 2.00 Hz at 200 kg; quoted 3.16 × 10⁴) | `curve, leaking, healthy, threshold, f0-line, point, peak, gauge, danger` | L07 zoom |
| `pendulum-forces` | `theta_deg` 20 (2–45), `mass_g` 50 \| 100, `l` 0.50 m, `g` 9.8; `autoplay` false (holds at θ; `play()` swings) | `pivot, thread, bob, angle, mg, tension, mg-cos, mg-sin, triangle, a-arrow` | L04 zoom |
| `phase-strip` | `T` 1.80 s, `A` 0.10 m | `thread, bob, A, O, B, ruler, ghosts, progress` | L01 (optional) |

Colour code: x `--sky`, v `--teal`, a `--amber` (a always points to O), mg `--pink-soft`, T `--sky`, mg cos θ
`--violet`, mg sin θ `--amber`, a = g sin θ `--lime`, danger / lift-off `--crimson`.

## Readings (`reading()`)

- **wheel / circle / graphs:** `{ A, T, w, f, angle_deg, x, v, a, v_max, a_max, a_over_x, g_over_w2, lift, display: { angle, x, v, a (3 s.f.), a_max, g_over_w2_cm, A_cm } }`.
  L03 check (A 0.30, T 2.0): 0° `0, 0.942, 0` · 30° `0.150, 0.816, −1.48` · 60° `0.260, 0.471, −2.56` · 90° `0.300, 0, −2.96`.
  Okada preset: A 3 cm → a_max 4.7 (stays) · 8 cm → 12.6 > g (lifts) · g/ω² = 6.2 cm.
- **energy:** `{ x, PE, KE, E, sum, v, w, T, x_equal, display }` (x = 0.06 m → PE 0.09 J, KE 0.16 J, v 0.80 m s⁻¹; sum = 0.250 J).
- **damping-trace:** `{ set, forced, w0, span, tc, curves: { key: { zeta, x, ratioPerCycle, oscillates, finalAmp_cm? } } }` (forced: healthy 1.9 cm, leaking 9.6 cm after ten pushes).
- **resonance:** `{ speed_kmh, v, f, f0, r, A_cm, th_cm (g/(2πf)², driving f), th0_cm (g/ω₀²), lift, A_leaking_cm, A_healthy_cm, peak: { f, kmh, A_cm }, at_f0_cm, sag, kmh_res, display }`.
  200 kg leaking: 10 → 1.4 · 14 → 2.5 · 16 → 4.4 · **18 → 10.0 cm** · 20 → 3.9 · 30 → 0.6; threshold 6.2 cm at 2.0 Hz, 5.0 cm at 20 km/h, 2.2 cm at 30 km/h; healthy peak 2.0 cm; 250 kg: f₀ 1.79 Hz, 16 km/h → 10.0 cm, 18 → 3.7 cm, th₀ 7.8 cm.
- **pendulum-forces:** `{ theta_deg, theta_rad, sin, cos, mg, mg_cos, mg_sin, tension, a, x_over_l, arc, diff_pct, T_small, v, display }` ((θ − sin θ)/θ: 5° 0.13 %, 10° 0.51 %, 20° 2.0 %, 30° 4.5 %, 45° 10 %).
- **phase-strip:** `{ A, T, fraction, x, at: "A" | "O" | "B" | "" }`.

## Model (`ShmKinematics2D.model`)

`shm(A, T, θ)`, `speedAt(A, ω, x)`, `energy(k, m, A, x)`, `decay(ζ, ω₀, t, A0)` (released from rest; under-, critically
and over-damped), `envelope`, `ratioPerCycle(ζ)`, `response(f, f₀, ζ, Y)` = Y√(1+(2ζr)²)/√((1−r²)²+(2ζr)²),
`threshold(f, g)` = g/(2πf)², `okada(speed_kmh, mass, ζ, { k, d, Y, g })` (same as the hub's `welcome-lab.js`
`ridgeModel`), `peak(f₀, ζ, Y)`, `forced(ζ, ω₀, Y, tEnd, f, n)` (RK4 base-excited oscillator from rest),
`pendulum(θ, m, l, g, θ₀)`, `round(x, dp)`.

**Rounding note:** displayed values use ordinary single rounding (`round()`). The okada model is defined by
f₀ = 2.00 Hz exactly at 200 kg, so k = 4π²f₀²m ≈ 31 583 N m⁻¹ (quoted 3.16 × 10⁴ N m⁻¹). At 18 km/h (f = f₀) the
leaking response is 10.0499 cm → **10.0 cm**; the resonance marker shows this value at f₀ ("at f₀"). The numerical
maximum of the curve (10.06 cm at 17.96 km/h) is still available as `reading().peak` / `display.curve_max`; `display.peak` and `display.at_f0` show the value at f₀ (10.0 cm).

## Narration / bench glue (example)

```js
var bench = ShmKinematics2D.create({ canvas: document.getElementById("bench-canvas"), scene: "wheel",
  onChange: function (r) { document.dispatchEvent(new CustomEvent("l3:bench", { detail: r })); } });
window.StudyScenes = window.StudyScenes || {};
window.StudyScenes.bench = { rect: bench.rect, highlight: bench.highlight, setMode: bench.setMode, reset: bench.reset };
// narration: target { scene: "bench", part: "a-arrow" }
```
