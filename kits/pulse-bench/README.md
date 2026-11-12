# `pulse-bench` (`window.PulseBench`)

Radial-pulse, exercise and blood-pressure practical (SS2 Lesson 04, "The Beating Heart"). Classic script, offline, three.js only.
Load after `three.min.js`; for the live heart also load `heart-kit.js` (`window.HeartKit`, v2 or later) **before** `pulse-bench.js`.
Without HeartKit the kit still runs: the heart stand is empty, `san / avn / his / purkinje` are empty groups, and a built-in metronome produces the beats.

## Usage
```js
var kit = PulseBench.create({ onEvent: function (name, detail) {} });
scene.add(kit);            // THREE.Group (about 9.6 x 5.4 bench top, arm along x, hand at +x, viewer on +z)
// each frame:  kit.update(dt, t)      (also advances the heart; do NOT update kit.parts.heart yourself)
```
`create(opts)`: `speed` (1; scales the 15 s count, the minute change and the cuff deflation), `bpmRest` (68), `exerciseSeconds` (6, real seconds the 2-minute step-ups take on screen), `xray` (false), `onEvent`.

## Model (the only source of readings)
| quantity | rule |
|---|---|
| resting rate | 68 bpm |
| after exercise | 132 bpm at 0 min; `bpm(t)` = Fritsch-Carlson monotone cubic through 132, 116, 96, 80, 72, 68 at t = 0..5 min (then 68). Same curve as the hub explorer. |
| 15 s count | `round(bpm x 15 / 60)`: rest 17; minutes 0..5 give 33, 29, 24, 20, 18, 17 |
| repeats | the first count in each context (rest, or each minute) is exact; repeat counts are +1 / -1 in turn, so three rest counts read 17, 18, 16 (mean 17.0) |
| heart rate from a count | `count15 x 4` (so a +/-1 beat count is +/-4 bpm) |
| cycle time | `60 / bpm` s (68 bpm: 0.88 s, 132 bpm: 0.45 s) |
| blood pressure | 120 / 80 mmHg (cuff to 160, deflates at 12 mmHg s-1 x `speed`; first sound at 120, last at 80) |
| pulse wave | the heart's ventricular systole starts each beat; the wave reaches the wrist 0.2 s later (sharp rise, slow fall, dicrotic notch); above 120 mmHg in the cuff the artery is flattened and the pulse is gone |

## Methods on the group
`restCount()` (a 15 s count at rest; call it three times for the mean) - `exercise()` (step-ups for 2 min, compressed to `exerciseSeconds`) -
`countNow()` (15 s count in the current context: rest, or the minute you are at) - `nextMinute()` (advance one minute after exercise, up to 5) -
`measureBP()` - `runAll()` (the whole practical, then BP) - `reset()` - `setState({ speed, xray, bpmRest, t_min, onEvent, reset })` -
`update(dt, t)` - `viewFor(part)` -> `{ target:[x,y,z], dist, yawPortrait }` (camera helper; `yawPortrait` = -PI/2 for `all/bench/arm` so the arm runs up a phone screen) -
`pickPart(raycaster)` -> partId or `null` - `PulseBench.makeHighlighter(scene).highlight(partName)`.
Calls return `false` when not allowed (busy, wrong phase). Order: `restCount` (x3) -> `exercise` -> `countNow` -> (`nextMinute` -> `countNow`) x5.

## `reading()`
`{ t_min, count15, bpm, cycle_s, resting }` as the brief asks, plus
`phase` (`rest | exercising | post`), `trueBpm` (live model rate), `model_count15`, `nCounts`, `nPost` (post-exercise minutes counted), `restMean` (mean beats per 15 s at rest),
`rows` (every count: `{ context, phase, t_min, attempt, count15, bpm, trueBpm, cycle_s }`), `table` (six rows `{ t_min, count15, bpm }` for 0..5 min, `null` until counted),
`counting`, `beats` (live tally during a count), `busy`, `bp: { sys, dia, pressure, measuring }`, `allDone`.
`count15 / bpm / cycle_s` describe the **last completed count** (`null` before the first; `cycle_s` falls back to the live rate).
Model helpers: `PulseBench.model.{bpmAt(t), count15(bpm, attempt, ctx), knots, REST_BPM, PEAK_BPM, BP}`.

## Parts (`g.parts`, each tagged `userData.partId`)
`wrist` (lower forearm and wrist skin; the bulge happens here), `radialArtery` (a live tube whose radius follows the wave), `fingers` (examiner's index and middle fingertips, nails, hand),
`stopwatch`, `step` (stool), `mannequin` (the figure doing step-ups), `heart`, `san`, `avn`, `his`, `purkinje` (inside `HeartKit.heart`, `pace` mode),
plus `bench, arm, hand, cuff, manometer, mercury, pump, aortaLine, restFingers`. All 02-lesson names exist.

## Events (`onEvent(name, detail)`)
`count-start {context}` - `counted` (detail = `reading()`) - `exercise-start {minutes}` - `exercise-done {bpm}` - `minute {t_min}` - `bp-start` - `korotkoff-first {pressure}` - `korotkoff-last {pressure}` - `bp` (`{ sys, dia, reading }`) - `done` (detail = `reading()`, after 6 post-exercise minutes are counted) - `reset`.
Lesson glue: emit `l4:bench` on `counted` (detail = `reading()`), and `l4:bench-done` on `done`.
The practical's expected table is exactly `reading().table`: 33, 29, 24, 20, 18, 17 beats per 15 s = 132, 116, 96, 80, 72, 68 bpm.

## Geometry (about 36k triangles for the bench itself; HeartKit.heart adds its own, about 120k in v2.1, so pass a lighter heart on low-end phones if needed)
Forearm, wrist and hand are three analytic sweeps of an elliptical cross-section (flat wrist, thenar and knuckle taper, per-vertex colour with a lighter palm side, skin-pore texture and bump); four fingers and a thumb are
tapered `CatmullRomCurve3` sweeps with creases. The radial artery is a swept tube refilled every frame (radius = wave) and the skin over it is displaced along its normals by the same wave. The examiner's fingers are curved sweeps with nails and a palm block.
Stopwatch: lathe steel case, crown, side button and bow, live face on a `CanvasTexture` (60 ticks, 15 s sector, red second hand, digital readout). Step stool: extruded top with a grip slot, lathe legs, rubber tread, rails;
the manikin is built from lathes (torso, capsule limbs, shoes) and really steps up and down. Cuff: navy cloth sweep that inflates (refilled geometry), two `TubeGeometry` hoses, lathe rubber bulb and valve.
Mercury manometer: backing plate, `CanvasTexture` scale card (0 to 300 mmHg, readable at phone size), glass tube (thin-walled lathe), live mercury column with domed meniscus, brass caps. A faint tube plus a travelling bead (`aortaLine`) carries each beat from the heart to the wrist.
`setState({ xray: true })` makes the skin see-through so the artery shows.
