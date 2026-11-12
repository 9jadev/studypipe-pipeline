# `slide-view` (`window.SlideViewKit`) v1

"What you can really see on a school slide." A 3D eyepiece disc (iodine-stained onion epidermis, or methylene-blue cheek cells) beside a textbook cell diagram. Every structure that cannot be seen on the stained school slide fades out on the diagram, is struck through, and gets a short reason label. Built for lesson-05 (zoom). Classic script, offline, three.js only.

```js
var kit = SlideViewKit.create({ M: 400, specimen: "onion", showTextbook: true, onEvent: function (name, detail) {} });
scene.add(kit);
kit.layout(canvasWidth / canvasHeight);   // returns { target:[x,y,z], w, h } = what the camera must frame
// each frame:  kit.update(dt, elapsedSeconds);
```
Camera: look down -z at `fit.target`, distance `max((h/2)/tan(fov/2), (w/2)/(tan(fov/2)*aspect))`. Portrait (aspect < 0.95) stacks eyepiece above the book; landscape puts them side by side; `showTextbook:false` centres the eyepiece alone.

## Parameters (`create(opts)` and `setState(obj)`)
| Name | Default | Meaning |
|---|---|---|
| `M` | 400 | total magnification (eyepiece x10 times objective). Field = 160 / M mm, so 4.0 / 1.6 / 0.40 mm at x40 / x100 / x400. Any value works; the disc zooms smoothly |
| `specimen` | `"onion"` | `"onion"` (plant cell, iodine, cell width 50 um, long box-shaped cells) or `"cheek"` (animal cell, methylene blue, 60 um, scattered flat cells) |
| `showTextbook` | true | show or hide the diagram book |
| `aspect` | 0.8 | initial layout aspect (see `layout()`) |

## The visibility model (computed, not typed)
For each structure of the chosen cell type `judge()` applies, in order: **absent from this specimen** (e.g. chloroplasts in an onion bulb) -> **below the 0.2 um resolving limit** of a school light microscope -> **image smaller than 0.1 mm** at this M (`size_um x M / 1000`, the unaided eye limit) -> **neither self-contrasting nor stained** by this stain (e.g. mitochondria, lysosomes). Otherwise it is visible. So the answer changes with `M` and with the stain. Sizes are the smallest defining dimension, rounded textbook values (see `SPECIMENS` in the source). The eyepiece drawing uses the same results: the nucleus, wall, cytoplasm tint and vacuole are only painted if the model says they are visible; ER, Golgi, ribosomes, mitochondria are never painted.

## Parts (`kit.parts`, tagged `userData.partId`)
`eyepiece` (barrel, knurled collar, bezel, rubber eye cup) · `view` (the field disc) · `bezel` · `book` · `diagram` · and one invisible hit quad per diagram row: `wall, membrane, cytoplasm, nucleus, vacuole, chloroplast, mitochondrion, lysosome, centrioles, er, golgi, ribosome` (only the rows of the current specimen are `visible`; use `rect(part)` / `highlight(part)` on these). `kit.userData.itemIds` lists them.

## reading()
`{ M, eyepiece:10, objective, specimen, stain, field_mm, cellWidth_um, cells_across, resolvingLimit_um, eyeLimit_mm, items:[{ id, name, size_um, image_mm, visible, reason, why }], visibleCount, hiddenCount, visible:[ids], hidden:[ids] }`
Expected onion values: x100 -> field 1.6 mm, 32 cells; x400 -> 0.4 mm, 8 cells; visible at x100 and x400: wall, cytoplasm, nucleus, vacuole (4); hidden (6): membrane, chloroplast, mitochondrion, ER, Golgi, ribosome.

## Events (CustomEvent on `document`, also `opts.onEvent`)
`slide-view:change` `{ ...reading }` on any change of `M` or `specimen` (and on `setState({ force: true })`) · `slide-view:item` `{ id, name, visible, reason, why, ... }` from `kit.pickItem(id)` (the demo calls it when a row is tapped).

## API
`setState(obj)`, `update(dt, t)` (aliases `tick`, `userData.update`), `reading()`, `layout(aspect)`, `pickItem(id)`, `SlideViewKit.makeHighlighter(scene).highlight(partId, hex)`.
