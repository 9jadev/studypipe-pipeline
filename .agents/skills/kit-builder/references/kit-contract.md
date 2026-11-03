# Kit contract

## Folder
```
kits/<kit-id>/
  kit.json     ← metadata (required)
  kit.js       ← registers the kit (required, classic script)
  kit.css      ← optional; scope every rule under .kit-<kit-id>
  demo.html    ← standalone test page (required)
  assets/      ← optional small textures/SVGs (compressed)
```
`kit-id` is kebab-case and describes the concept, not the topic: `pendulum`, not `ss2-physics-pendulum`.

## kit.json
```json
{
  "id": "pendulum",
  "version": 1,
  "title": "Simple pendulum",
  "type": "interactive-3d",
  "needs3d": true,
  "subjects": ["Physics"],
  "concepts": ["simple harmonic motion", "period", "acceleration due to gravity"],
  "params": {
    "length_m": { "type": "number", "default": 0.8, "min": 0.2, "max": 1.5, "doc": "string length" },
    "angle_deg": { "type": "number", "default": 10, "min": 2, "max": 30, "doc": "release angle" },
    "g": { "type": "number", "default": 9.81, "doc": "gravitational field strength" }
  },
  "events": {
    "timed": "{ oscillations, seconds } when the student stops the stopwatch"
  },
  "used_in": ["ss2-physics-simple-pendulum"]
}
```

## kit.js
```js
(function () {
  window.StudyPipeKits = window.StudyPipeKits || {};
  window.StudyPipeKits["pendulum"] = {
    mount: function (container, params, api) {
      // container: a sized <div>. params: merged with kit.json defaults by the kit itself.
      // api.emit(name, data): report student actions to the player.
      // ... build scene, add UI inside container only ...
      return { destroy: function () { /* cancel RAF, remove listeners, dispose GL */ } };
    }
  };
})();
```

## Rules
- Use only `window.THREE` (three.js r160 + `THREE.OrbitControls`) from `vendor/three-bundle.min.js`.
- No ES modules, no `fetch`, no network, no globals other than `window.StudyPipeKits`.
- Size the renderer to the container and handle resize with a `ResizeObserver`.
- UI controls (buttons/sliders) are HTML inside the container, ≥ 44 px tall.
- Defaults must produce a sensible scene with no params at all.
