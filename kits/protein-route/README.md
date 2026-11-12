# `protein-route` (`window.ProteinRouteKit`) v1

The secretory pathway of a eukaryotic cell in 3D: **ribosome on rough ER -> protein enters the ER lumen -> transport vesicle buds and fuses with the Golgi body (cis face) -> protein passes cis -> trans -> secretory vesicle buds, travels and fuses with the cell membrane (exocytosis)**. Built for lesson-02 (zoom). Classic script, offline, three.js only (`window.THREE`).

Load after `three.min.js`: `<script src="protein-route.js"></script>` then

```js
var kit = ProteinRouteKit.create({ step: 0, play: true, onEvent: function (name, detail) {} });
scene.add(kit);                          // a THREE.Group
// each frame:  kit.update(dt, elapsedSeconds);
```

## Parameters (`create(opts)` and `setState(obj)`)
| Name | Default | Meaning |
|---|---|---|
| `step` | 0 | 0 translation on the ribosome, 1 protein in the ER lumen, 2 transport vesicle, 3 Golgi cis -> trans (ends with the secretory vesicle budding), 4 vesicle travels, fuses, protein released |
| `t` | 0 | progress inside the step, 0..1 (setting `t` pauses and scrubs) |
| `play` | true | animate `t`; the step holds at `t = 1` |
| `speed` | 1 | playback multiplier (a step takes `stepSeconds / speed`) |
| `stepSeconds` | 6 | create-time only |
| `autoAdvance` | false | run on to the next step automatically |
| `labels` | true | short sprite labels (Ribosome, Rough ER, Golgi body, cis, trans, Cell membrane, Outside) |
| `paths` | false | `setState` only: faint tubes showing the three `CatmullRomCurve3` vesicle paths |
| `aaTotal` | 120 | create-time: length of the polypeptide used for the amino-acid counter |

## Parts (`kit.parts` / `kit.userData.parts`, each tagged with `userData.partId`)
`ribosome` (the translating one: large + small subunit, lumpy shells) · `mRNA` · `polypeptide` (grows through the translocon) · `translocon` · `ribosomes` (instanced studs) · `roughER` (3 stacked cisternae, closed pillow sacs, ribosomes on the cytosolic faces) · `lumen` · `transportVesicle` · `hopVesicle` (small Golgi shuttle) · `golgi` (5 curved cisternae) · `cis` · `trans` · `secretoryVesicle` · `membrane` (bilayer slab: phospholipid heads on both faces, embedded channels, omega-shaped bulge when the vesicle fuses) · `cargo` (the protein) · `paths`.
`kit.userData.stepNames` has the five step titles. `kit.userData.camera` gives the overview framing; `kit.userData.focusFor(step)` returns `{ target:[x,y,z], span }` close-up framing for a phone (span = horizontal scene units to fit).

## reading() (computed from the model, never typed text)
`{ step, stepName, t, p, compartment, aaBuilt, aaTotal, fusionEvents, bilayersCrossed, vesicleSteps, golgiCisterna (0 or 1..5), modified (0..1 through the Golgi), secreted }`.
`bilayersCrossed` is 1 once the chain threads through the ER membrane; every later move is vesicle budding and fusion (the protein never crosses another bilayer, even when it leaves the cell).

## Events (CustomEvent on `document`, also passed to `opts.onEvent(name, detail)`)
`protein-route:step` `{ step, name, reading }` · `protein-route:fusion` `{ site: "golgi" | "membrane", reading }` · `protein-route:step-done` `{ step, reading }` · `protein-route:done` `{ reading }` (end of step 4).

## API
`kit.setState(obj)`, `kit.update(dt, t)` (aliases `tick`, `userData.update`), `kit.reading()`, `kit.userData.api = { play, pause, goTo(step), reset }`, `ProteinRouteKit.makeHighlighter(scene).highlight(partId, hex)`.

## Geometry notes (HeartKit v2 bar)
Cisternae are closed `BufferGeometry` pillow sacs (analytic thickness profile, ruffled rims, translucent membrane over a lumen mesh), Golgi cisternae are bowl-bent with swollen trans rims and cis -> trans colour grading, vesicles travel on `CatmullRomCurve3` paths, the polypeptide is a `TubeGeometry` revealed with `setDrawRange`, the membrane is a vertex-displaced slab whose bulge and lipid-head instances follow the same `wallX` function, and ribosomes are lumpy two-subunit models with grain/bump `CanvasTexture`s. Sizes are schematic (not to scale).
