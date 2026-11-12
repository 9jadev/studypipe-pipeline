# `osmometer-bench` (`window.OsmometerKit`)

Potato-strip osmometer practical (Lesson 04, "The Cell and Its Environment"). Classic script, offline, three.js only.
Load after `three.min.js`: `<script src="osmometer-bench.js">`.

## Usage
```js
var kit = OsmometerKit.create({ onEvent: function (name, detail) {} });
scene.add(kit);            // THREE.Group
// each frame:  kit.update(dt, t)
```
`create(opts)`: `concs` (default `[0,0.2,0.4,0.6,0.8,1.0]` mol dm⁻³), `initialMasses` (default `2.50, 2.48, 2.52, 2.50, 2.46, 2.54` g),
`minutes` (30), `speed` (1; animation rate), `errors` (`{ unblotted, overBlotted, evaporation }`), `onEvent`.

## Model (the only source of readings)
`m1 = m0 (1 + p(c)/100 · phi(t))`, `p(c)` = Fritsch-Carlson monotone cubic through the 02-lesson table
(+14.0, +4.8, −2.0, −8.0, −12.2, −16.5 % at 0.0 … 1.0 mol dm⁻³); `phi(30 min) = 1`, `phi(t) = (1-e^(-t/9)) / (1-e^(-30/9))`, capped at 1.
Defaults reproduce the table exactly: final masses 2.85, 2.60, 2.47, 2.30, 2.16, 2.12 g; change +0.35, +0.12, −0.05, −0.20, −0.30, −0.42 g;
% change (from the 2 d.p. balance readings) +14.0, +4.8, −2.0, −8.0, −12.2, −16.5. Isotonic point from the model = 0.34 mol dm⁻³.
Strip size, firmness (bend / colour) and water particles are driven by the same `p`; visual swelling is exaggerated ×2.2 so a few percent is visible, readings are not.

### Error modes (`setState({ errors: { … } })`, applied at the final weighing)
| flag | effect on final mass | direction |
|---|---|---|
| `unblotted` | +0.08 g surface-water film (strip skips the blotter, glossy sheen) | too high: gain too large, loss too small |
| `overBlotted` | −0.06 g sap squeezed out (strip squashed, wetter blotter) | too low |
| `evaporation` | −0.03 g strip left on the tile **and** open tubes ≈ 8 % more concentrated (liquid level drops) | too low; losses too large, gains too small |
Flags combine additively. Values: `OsmometerKit.model.errors`. Defaults with `unblotted`: 2.93 2.68 2.55 2.38 2.24 2.20 g;
`overBlotted`: 2.79 2.54 2.41 2.24 2.10 2.06; `evaporation`: 2.82 2.55 2.41 2.24 2.10 2.05.

## Methods on the group
`select(i)` · `weigh(i)` (strip → blotter → pan → tile; initial mass) · `leave(minutes)` (all weighed strips into the tubes, clock runs) ·
`reweigh(i)` (tube → blotter → pan, final mass) · `runAll()` · `reset()` · `setState({ errors, minutes, speed, selected, onEvent, reset })` ·
`update(dt, t)` · `viewFor(part)` → `{ target:[x,y,z], dist }` camera framing · `pickPart(raycaster)` → partId or `null` ·
`OsmometerKit.makeHighlighter(scene).highlight(partName)`. Calls return `false` when not allowed (busy, wrong order).
Order: `weigh` each tube → `leave` → wait for `soaked` → `reweigh` each tube.

## `reading()`
`{ rows:[{ i, conc, m0, m1, change_g, pct, firmness, state: ready|weighed|soaking|soaked|done, weighed, inTube, done }], selected, minutes, elapsed_min, soaked, soaking, busy, balance_g, nWeighed, nDone, n, allDone, isotonic_est (interpolated from measured %), isotonic_model, errors, error_effects }`
`m1`, `change_g`, `pct` are `null` until re-weighed. Model helpers: `OsmometerKit.model.{pct(c), isotonic(), phi(min), finalMass(m0,c,min,errors)}`.

## Parts (`g.parts`, each tagged `userData.partId`)
`bench, rack, tube (group), tube0..tube5, strip (group), strip0..strip5, borer, potato, balance, pan, lcd, tile, blotter`.
`tube`/`strip`/`balance` are also `partGroup` ids; the highlighter matches either. 02-lesson part names `borer, strip, tube, balance, tile, blotter` all exist.

## Events (`onEvent(name, detail)`)
`select {i,conc}` · `weighed {i,phase:"initial",conc,mass_g}` · `soak-start {minutes}` · `soaked {minutes}` · `reweighed {row}` (a `reading().rows` row) · `done {reading}` (all weighed strips re-weighed) · `reset`.
Lesson glue: emit `l4:bench` on `reweighed` (detail = `reading()`), `l4:bench-done` when `reading().nDone === 6`.

## Geometry
Lathe boiling tubes (rounded base, rolled rim, wall thickness) with meniscus liquid, wrapped colour-banded labels; wooden rack from extruded shelves with drilled holes and end plates with handle slots (wood-grain canvas + bump);
brass cork borer (lathe, sharpened edge, T-handle, pusher rod); halved potato with bore holes; strips as 18-segment cylinders deformed live (size, bow); glazed tile and 3-sheet blotter with a live wet-stain canvas;
top-pan balance (extruded body and sloped console, lathe pan, live LCD `CanvasTexture`). Phone: ~12k triangles.
