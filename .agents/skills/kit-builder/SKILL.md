---
name: kit-builder
description: Builds reusable, studio-lit 3D or interactive stages using SceneKit (scene-kit.js) and three.js — enforcing anatomical, chemical, and physical laboratory fidelity (extruded cross-sections, splines, lathes, procedural canvas textures, GLSL vertex deformation, and recognizable subject apparatus) while supporting 3D part spotlighting (rect/highlight) and narrator actions/events. Called by lesson-renderer or directly.
---

# Kit Builder — High-Fidelity 3D Anatomy, Chemistry & Physics Kits

Builds reusable, interactive 3D apparatus, anatomical organs, cellular structures, and laboratory benches using `window.SceneKit` (`assets/js/scene-kit.js`) and `window.THREE` (`three-bundle.min.js`).

> **Canonical Reference Implementation:** Always study [`kits/heart-circulation/heart-kit.js`](../../../kits/heart-circulation/heart-kit.js) (`HeartKit v2`) before creating a new kit. Every new kit must match or exceed its geometric, textural, and mechanical fidelity.

---

## 1. Zero-Tolerance Rule: Ban "Primitive Soup"

**NEVER** build an organ, organism, or laboratory apparatus out of raw, unshaped geometric primitives ("a group of cones for a heart", "two plain cylinders for an electrolytic cell", "a sphere for a cell", or "a box for a galvanometer").

Every 3D model must satisfy the **Unlabeled Recognition Test**:
> *If all text labels are hidden, a WAEC/NECO/JAMB student or examiner looking at the 3D canvas must immediately recognize the exact biological structure, chemical apparatus, or physics instrument — and distinguish every exam-tested sub-part by its true shape, proportion, material, and motion.*

### Required 3D Modeling Techniques (Instead of Raw Cones/Spheres/Boxes)

1. **Analytical Shell Deformation & Asymmetric Organic Sculpting**
   - Start with a high-resolution sphere or cylinder (`SphereGeometry(1, 64, 48)` or `72×48`) and apply a mathematical coordinate deformation function `place(x0, y0, z0)` to sculpt true organic silhouettes (e.g., ventricular taper, apex cant to the left, coronary sulcus indentation, atrial auricles with crinkled scalloped lobes).
   - Call `geo.computeVertexNormals()` after any vertex position deformation.

2. **True Extruded Cross-Sections with Cavity Holes (`THREE.Shape` + `ExtrudeGeometry`)**
   - When showing an anatomical or mechanical cut-away (e.g., frontal section of a 4-chamber heart, kidney cortex/medulla/pelvis, leaf lamina cross-section, or piston cylinder), construct the solid wall with `new THREE.Shape()` and `.splineThru(...)`, cut out internal chambers using `wallShape.holes.push(cavityPath)`, and extrude with `new THREE.ExtrudeGeometry(wallShape, { depth, bevelEnabled: true, curveSegments: 32 })`.
   - Encode exam-critical anatomical proportions directly into the cross-section coordinates (e.g., left ventricular myocardium `3×` thicker than right ventricular wall; interventricular septum separating left and right blood pools; distinct endocardial `THREE.LineLoop` lining).
   - Fill chambers with dynamic fluid/blood pool meshes clipped at a live fill level $y_{\text{cut}}$ using Sutherland–Hodgman polygon clipping (`clipY(pts, yCut, keepAbove)`) so chambers visibly fill during diastole and empty during systole (or burettes/beakers visibly drain/fill during titration/electrolysis).

3. **Curved Spline Tubes (`THREE.CatmullRomCurve3` + `THREE.TubeGeometry`)**
   - Use `CatmullRomCurve3` + `TubeGeometry` (with hemispherical end-caps or open lumen rings via `capEnds()`) for all curved tubular structures:
     - **Biology:** Aortic arch with its 3 superior branches (brachiocephalic, left common carotid, left subclavian), pulmonary trunk bifurcating into left/right pulmonary arteries, superior/inferior venae cavae, coronary arteries/veins hugging the epicardial surface, nephron tubules (proximal, loop of Henle hairpin, distal), xylem/phloem bundles.
     - **Chemistry & Physics:** Glass delivery tubes, Liebig condenser jackets, Hofmann voltameter arms, flexible rubber tubing, insulated connecting leads with crocodile clips.
   - Where a tube's state changes along its path (e.g., deoxygenated blue `#3b6ee8` $\rightarrow$ capillary purple `#9b4fd6` $\rightarrow$ oxygenated crimson `#e8323f`, or temperature/potential gradients), apply **per-vertex colour interpolation** (`geo.setAttribute('color', ...)` with `vertexColors: true`).

4. **Rotational Profiles (`THREE.LatheGeometry`)**
   - Use `THREE.LatheGeometry` with analytical profile functions for axially symmetric structures:
     - **Biology:** True biconcave disc profile for mammalian red blood cells ($t(\rho) = \sqrt{1-\rho^2}(c_0 + c_1\rho^2 + c_2\rho^4)$), concave watch-glass meniscuses, cup-shaped semilunar valve cusps (`Cup` / `Pocket` profile), stomatal guard cell pairs.
     - **Chemistry:** Conical flasks (Erlenmeyer), volumetric flasks with calibration etched rings, round-bottom flasks, glass funnels, burette tips with stopcocks, crucibles, and evaporating dishes.
     - **Physics:** Biconvex/biconcave lenses, parabolic reflectors, brass pendulum bobs with knurled hooks, pulleys with V-grooves.

5. **Dynamic Vertex-Updated Meshes for Articulated Soft Parts**
   - Parts that open, close, flex, or deflect (e.g., 2-cusp bicuspid/mitral and 3-cusp tricuspid valve leaflets, diaphragm dome, vocal cords, bimetal strips, leaf electroscope gold leaves, ammeter/galvanometer pointer needles) must be built with real articulating geometry (`BufferGeometry` with per-frame vertex updates or pivoted sub-groups):
     - Valve cusps must meet cleanly along a commissure when closed (`openAmt = 0`) and swing into the downstream lumen when open (`openAmt = 1`), with taut/slack `chordae tendineae` (`between(cyl, cuspTip, papillaryTip)`) anchored to conical `papillary muscles`.

6. **Procedural Canvas Textures & Bump Maps (100% Offline, Deterministic)**
   - Never leave organic tissues, wood bases, metal plates, or graduated glassware as flat plastic colours.
   - Generate deterministic (seeded PRNG `rng(seed)`) `THREE.CanvasTexture` diffuse and bump maps in memory:
     - Striated myocardium fibres (`muscleTex`), epicardial fat sheen, rough tunica externa collagen, plant cell wall cellulose fibril weave.
     - Crisp millimetre graduations and numbered scale markings on metre rules, burettes, measuring cylinders, thermometers, and protractors.
     - Metallic brushed grain on copper/zinc/platinum/graphite electrodes, crocodile clips, and brass binding posts.

7. **Synchronised GLSL Vertex Deformation + JS Coordinate Tracking**
   - When an organ or elastic body deforms continuously (e.g., cardiac systole/diastole via `mat.onBeforeCompile` injecting `uHkV` / `uHkA` uniforms), provide an **exact matching JavaScript deformation function** (`squeezeJS(pos, uV, uA)`) so all attached sub-structures (valves, chordae tendineae, pacemaker nodes, conduction sparks, flowing particles, and 3D highlight anchors) move in lockstep with the deforming surface without floating or clipping.

---

## 2. Subject-Specific Fidelity Checklists

### A. Chemistry Kits (Electrolysis, Titration, Gas Preparation, Periodic/Bonding)
When building a Chemistry kit (e.g., **Electrolysis**, **Electrochemical Cells**, **Acid-Base Titration**, **Fractional Distillation**):
- **Anode vs. Cathode Must Be Unmistakable:**
  - **Distinct Electrode Geometry & Material:** Render real rectangular plates or cylindrical carbon/graphite/copper/platinum rods held by an insulating electrode holder cap or crocodile clips — never floating nameless cylinders.
  - **Polarity & Wiring:** Clearly colour-code the DC power supply / battery (`+` red terminal wired to the **anode**, `−` black terminal wired to the **cathode** in electrolysis; or proper anode/cathode conventions in galvanic cells with a porous pot or KCl salt bridge U-tube plugged with cotton wool). Include an inline ammeter/galvanometer with a live deflecting needle and switch.
  - **Live Electrode Reactions (Show What Happens at Each Pole):**
    - **Cathode ($-$ in electrolysis):** If metal ions discharge (e.g., $\text{Cu}^{2+} + 2e^- \rightarrow \text{Cu(s)}$), visibly grow a **salmon-pink/reddish-brown copper deposit layer** on the submerged cathode surface as time/current progresses. If $\text{H}^+$ discharges, emit rising streams of fine $\text{H}_2$ gas bubbles from the cathode surface.
    - **Anode ($+$ in electrolysis):** If an active copper anode dissolves ($\text{Cu(s)} \rightarrow \text{Cu}^{2+} + 2e^-$), visibly **thin/erode** the submerged anode and shed blue $\text{Cu}^{2+}$ ion particles into the electrolyte. If $\text{OH}^-$ or $\text{Cl}^-$ discharges at an inert anode, emit $\text{O}_2$ or greenish-yellow $\text{Cl}_2$ bubbles.
    - **Stoichiometric Gas Collection:** In water electrolysis (Hofmann voltameter or inverted graduated test tubes over electrodes), visibly collect **$2\times$ the volume of $\text{H}_2$ gas above the cathode compared to $1\times$ $\text{O}_2$ above the anode**, pushing the liquid meniscus down proportionally!
    - **Electrolyte Colour Shift:** Gradually fade the deep blue $\text{CuSO}_4(\text{aq})$ tint when using inert carbon/platinum electrodes, or keep it constant when using active copper electrodes.

### B. Biology Kits (Organs, Cells, Transport, Ecology, Practical Specimens)
- **External + Cut-Away Modes:** Support switching or slicing between external morphology (coronary vessels, epicardial fat, auricles, great vessels) and internal longitudinal/transverse sections (wall thickness ratios, valves, lumens, tissue layers).
- **Multi-Layer Histology:** Show distinct concentric tissue layers where syllabus-tested (e.g., artery vs. vein `tunica externa`, thick vs. thin `tunica media` smooth muscle + elastic lamina, `tunica intima` endothelium + semilunar pocket valve in veins).
- **WAEC Paper 3 Practical Specimen Mode:** Include a toggle or mode for realistic preserved/dissected specimen appearance (e.g., formalin-fixed grey-tan myocardium, iodine-stained starch granules, methylene-blue stained nuclei) alongside the vibrant living view.

### C. Physics Kits (Optics, Electricity, Mechanics, Waves)
- **Authentic School Lab Bench:** Render recognizable Nigerian secondary school physics apparatus — wooden baseboard with grain, brass binding posts with knurled thumbscrews, resistance box with removable brass plugs, rheostat with sliding contact over coiled constantan wire, jockey knife-edge tapping a 100 cm metre-bridge wire over a graduated centimetre scale, optical pins with coloured heads, and glass block with internal refracted ray, emergent ray, normal dashed lines, and lateral displacement calipers.

---

## 3. Technical Contract & Compatibility API

Read [references/kit-contract.md](references/kit-contract.md) for the full code patterns and copy-pasteable geometry helpers.

Every kit must satisfy two integration layers:

### Layer 1: Reusable 3D Builder (`kits/<kit-id>/<kit-id>.js` & `html/assets/js/<kit-id>.js`)
1. **Classic Script Only:** Expose `window.<KitGlobal>` (e.g., `window.HeartKit`, `window.ElectrolysisKit`) via an IIFE `(function (global) { 'use strict'; ... })(window);`. No ES modules (`import`/`export`), no external textures, no `fetch()`.
2. **Universal Return Contract (`attachCompat(g)`):**
   Every builder function (`createHeart`, `createElectrolyticCell`, etc.) MUST return a `THREE.Group` `g` augmented with `attachCompat(g, parts, updateFn, setStateFn)` so any caller convention works seamlessly:
   - `g.isObject3D === true` (can be passed directly to `scene.add(g)`)
   - `g.group === g` (works if caller accesses `api.group`)
   - `g.parts === g.userData.parts` (named map of every exam-relevant sub-mesh for spotlighting/highlighting and raycasting, with `partMesh.userData.partId = key` set via `tagPart(obj, key)`)
   - `g.tick === g.update === g.userData.update` (`function(dt, t)`)
   - `g.setState === g.userData.setState` (`function(nextOpts)`)
   - `KitGlobal.makeHighlighter(scene)` helper for pulsing emissive highlights on named parts.

### Layer 2: Stage Mount (`bench.js` / `zoom.js`)
1. Register the stage on `window.StudyScenes['bench']` or `window.StudyScenes['zoom']` via `SceneKit.createStage(...)`.
2. Register every named sub-part from `kit.parts` with `stage.addPart(id, mesh, Label)` so `StudyNarrator` can spotlight (`target: 'bench:cathode'`), pulse (`highlight`), and point at individual 3D parts during the teacher's voiceover.
3. Expose `onAction(actionName, payload)` so `narration.js` can trigger live visual state changes (e.g., `'switch-mode'`, `'toggle-current'`, `'reverse-polarity'`, `'slice-organ'`) mid-sentence and emit `StudyNarrator.notifyAction(id)` when the student interacts during `"Your turn!"` waits.
4. Update `kits/catalog.md` whenever a new kit is created or its version is bumped.

---

## 4. Interactive 2D Planar Kits with Paper.js (`paper-core.min.js`)

When building kits for **Mathematics (plane geometry, Euclidean proofs, triangle drawing and construction, circle theorems, coordinate geometry, angles, vectors)** or planar physics/optics:
- **Do NOT build a 3D Three.js mesh for planar surfaces.**
- Build an **`interactive-2d` Paper.js kit** in `kits/<kit-id>/` using `window.paper` (offline `kits/_vendor/paper-core.min.js`).
- **Kit Architecture:**
  1. HTML `<canvas>` element mounted on `#bench-stage` or `#zoom-stage`.
  2. Setup with `paper.setup(canvas)`.
  3. Create responsive, high-precision vector items (`new paper.Path()`, `new paper.Point()`, `new paper.PointText()`).
  4. Use Paper.js geometry math:
     - Drag-and-drop handles/vertices (`item.onMouseDrag = function(event) { ... }`).
     - Dynamic angle arcs and degree measurements.
     - Triangle constraints (Pythagoras, Sine/Cosine rule, congruent triangle snaps).
     - Circle tangent and secant calculations.
  5. Expose canonical kit API:
     - `window.<Name>Kit = { create(opts), setState(state), reading(), reset() }`.
  6. Pass the **Unlabeled Recognition Test**: Clean lines, readable mathematical notation, vertex labels ($A, B, C$), arc angle degrees, and tick marks for equal sides.
  7. **100% Offline:** Paper.js is bundled offline in `kits/_vendor/paper-core.min.js` and copied to `html/assets/js/paper-core.min.js`. Never load from CDN.
