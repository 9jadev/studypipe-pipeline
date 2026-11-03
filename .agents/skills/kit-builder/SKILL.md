---
name: kit-builder
description: Builds a new reusable, parametric 3D or SVG kit (three.js or SVG) for a scene that no existing kit covers, tests it, and registers it in kits/catalog.md. Called by lesson-renderer; can also be run directly ("build a kit for ...").
---

# Kit Builder

A **kit** is a reusable visual or interactive building block (e.g. `pendulum`, `titration-bench`,
`plant-cell-3d`, `circle-theorems`). Kits are the studio's long-term asset: build each one so many
future topics can reuse it by changing parameters.

Read first: `references/kit-contract.md` (required). Look at `kits/pendulum/` as the reference kit.

## Procedure
1. Re-check `kits/catalog.md`. If an existing kit can do it with new params or a small,
   backward-compatible extension, extend that kit instead (bump its `version` in kit.json).
2. Design the kit's **parameters** and **events** first (what can a future topic change?
   what student actions should be reported?). Write them into `kit.json`.
3. Build `kits/<kit-id>/kit.js` following the contract. Realism matters: correct proportions,
   realistic colours for chemicals and tissues, correct physics (use real equations, real units).
4. Build `kits/<kit-id>/demo.html` that mounts the kit full screen with default params.
5. Test: `node scripts/qa.mjs kits/<kit-id>/demo.html`. Fix every console error; look at the
   screenshot. Then **self-review** against the checklist below and fix before finishing.
6. Add one row to `kits/catalog.md`.

## Self-review checklist
- [ ] Scientifically correct (values, colours, motion, labels)
- [ ] Obvious first action shown in the scene; reset button works
- [ ] Labels beside what they label; never covering moving parts
- [ ] Works with touch (tap, drag, pinch/rotate where relevant) at 360×740
- [ ] `destroy()` stops animation frames, listeners and disposes WebGL resources
- [ ] No network requests, no ES modules, only `window.THREE` from the vendor bundle
- [ ] ≤ 50k triangles; smooth on a low-end phone (pixel ratio capped at 2)
- [ ] All params documented in kit.json with defaults
