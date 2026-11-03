---
name: kit-builder
description: Builds reusable, studio-lit 3D or interactive stages using SceneKit (scene-kit.js) and three.js — supporting 3D part spotlighting (rect/highlight) and narrator actions/events. Called by lesson-renderer or directly.
---

# Kit & 3D Stage Builder

Goal: build studio-quality, physically accurate 3D laboratory benches and concept zoom stages using `SceneKit` (`assets/js/scene-kit.js`) and `window.THREE` (`kits/_vendor/three-bundle.min.js`), registered on `window.StudyScenes[name]` (and optionally `window.StudyPipeKits[kitId]`).

Read first: `references/kit-contract.md` (required).

## Procedure
1. Check `kits/catalog.md` to see if an existing kit covers the scene or can be extended.
2. Build 3D scenes on top of `window.SceneKit.createStage({ root, canvas, fov, target, pitch, yaw, fitWidth, distance, onFrame })` which automatically provides:
   - Procedural studio PMREM environment lighting + ACES Filmic tone mapping + key/rim/fill lights
   - Smooth touch/pointer orbit + pinch/wheel zoom
   - Automatic pause when scrolled off-screen (`IntersectionObserver`) or tab hidden
   - `SceneKit.labelTexture(text, opts)` for crisp 3D sprite labels
   - `SceneKit.glowSprite(color, size)` for soft additive highlight halos
   - `stage.rectOf(objOrArray, padPx)` to project any 3D mesh/group to a 2D `{ left, top, width, height }` screen box for `StudyNarrator` spotlighting!
   - `stage.pick(event, objects)` for raycast tap/click selection on 3D apparatus.
3. Register the scene on `window.StudyScenes[sceneName]` with:
   - `rect(part)`: returns `stage.rectOf(...)` for every named part referenced in `narration.js`
   - `highlight(part)`: pulses a glow ring or emissive highlight on the named part
   - Action methods callable from `narration.js` (e.g. `test(i)`, `setLength(L)`, `setMode(m)`, `reset()`)
   - Custom DOM events (`document.dispatchEvent(new CustomEvent(...))`) when the student completes an investigation so `StudyNarrator`'s `"Your turn!"` waits trigger and react automatically.
4. Test with `node scripts/qa.mjs` and verify zero console errors and crisp visual layout at `360×740`.
