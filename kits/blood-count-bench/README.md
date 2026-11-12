# `blood-count-bench` (v1)

Lesson 06 bench: a **stained blood smear** at x100 and x400 and a **Neubauer-style haemocytometer red cell count** (5 medium squares, 1 in 200 dilution).
Self-contained (needs only `window.THREE`; no SceneKit, no HeartKit). Classic script, offline. 1 scene unit = 1 cm, Y up.

Bench: haemocytometer (thick glass slide, engraved H-shaped moat as an extruded `Shape` with a hole, two ruled chambers on a `CanvasTexture`, cover slip), blood-film slide with a feathered smear, 1 : 200 dilution tube, glass pipette with rubber teat (`LatheGeometry`), an **eyepiece view disc** (768 px `CanvasTexture` drawn from the model), and a back **3D blood film plinth**: biconcave red cells (instanced lathe), lobed phagocyte (tube through four lobes, granular cytoplasm), round-nucleus lymphocyte, platelets, fibrin threads (tubes, shown with `clot`), crescent sickle cells (instanced tapered tube, shown with `sickle`).

Grid: each chamber is a 3 mm x 3 mm ruled area; the centre 1 mm square is bounded by triple lines and split into 25 medium squares of 0.2 x 0.2 mm (depth 0.1 mm, volume 0.004 mm3 each), each ruled into 16 small squares. The five counted squares are the four corners and the centre of the 25.

## Use

```html
<script src="three.min.js"></script>
<script src="blood-count-bench.js"></script>
```
```js
var kit = BloodCountBench.create({ mode: "count", view: 400 });
scene.add(kit);                         // THREE.Group (kit.isKit, kit.group === kit)
BloodCountBench.lights(scene);          // optional
scene.environment = BloodCountBench.environment(renderer);   // optional, for the glass
BloodCountBench.fit(camera, controls, aspect);               // optional
// per frame: kit.update(dt, t)   (alias kit.tick)
kit.onEvent = function (name, detail) {};
var r = kit.nextSquare();               // r.count, r.total, r.diluted ...
```
`StudyPipeKits["blood-count-bench"].mount(container, params, host)` builds a full page; `demo.html` uses it.

## Parameters (`create(opts)` / `setState(obj)`)

| name | values | default | effect |
|---|---|---|---|
| `mode` | `"smear"` \| `"count"` | `"smear"` | what the eyepiece disc shows |
| `view` | `100` \| `400` | 400 | total magnification. Field: x100 = 1800 micrometres, x400 = 360 micrometres (both modes). At x100 red cells are only dots and white cells dark purple dots |
| `sickle` | bool | false | about one red cell in three becomes a crescent (disc, 3D plinth, and counted grid) |
| `clot` | 0..1 | 0 | smear: platelets gather into clumps and fibrin threads grow between them (disc and 3D) |
| `dilution` | number | 200 | 1 in `dilution` (changing it resets the count) |
| `rbc_per_mm3` | number | 4.8e6 | true undiluted red cell count; sets the seeded per-square counts (resets the count) |
| `counts` | array of 5 or `null` | `null` | explicit per-square counts (overrides `rbc_per_mm3`) |
| `focus` | `null` `"rbc"` `"phagocyte"` `"lymphocyte"` `"platelet"` `"fibrin"` `"grid"` `"coverslip"` `"haemocytometer"` `"pipette"` `"tube"` | `null` | amber rings and labels in the x400 smear view, pulsing emissive on the 3D part |
| `annotate` | bool | false | permanent phagocyte / lymphocyte captions on the x400 smear |
| `square` / `counted` | int | -1 / 0 | which square is framed, and how many have been counted (normally driven by `nextSquare()`) |

## Methods

`nextSquare()` (switches to `count` mode, frames the next of the five squares in order top-left, top-right, bottom-left, bottom-right, centre; returns the reading with `count` = the cells drawn in that square; emits `count`, and `count-done` after the fifth) · `reset()` · `highlight(part)` (= focus) · `setState(obj)` · `update(dt, t)` · `settle(seconds)` · `dispose()`.

## Model

Default counts `[98, 92, 101, 95, 94]` (sum 480). The same number of cells is drawn in each square, so the student's count matches the readout. Other squares get a seeded 95 +/- 7 cells. Cells are kept inside their square (edge rule: count cells touching the top and left lines, not the bottom and right).
`volume_mm3 = squares x 0.004`, `diluted = total / volume`, `undiluted = diluted x dilution`. After five squares: 0.020 mm3, 24 000 mm^-3 diluted, 4.8 x 10^6 mm^-3 undiluted.

`reading()` returns
`{ mode, view, field_um, square, squares, counts[], count, total, volume_mm3, dilution, diluted, undiluted, mean_per_square, done, unit, sickle, clot, focus }` (`count` is the current square's count, or `null`).

## Events (`kit.onEvent`)

`count` (reading after each square) · `count-done` (after the fifth, or on `nextSquare()` when already done) · `focus` (`{ focus }`) · `state` (reading).

## `parts` (also `userData.parts`; each has `userData.partId`)

`slide` (blood film), `haemocytometer`, `grid` (the two ruled chambers), `coverslip`, `pipette`, `tube`, `view`, `rbc` (instanced mesh), `sickleCells` (instanced mesh), `phagocyte`, `lymphocyte`, `platelet`, `fibrin`.
