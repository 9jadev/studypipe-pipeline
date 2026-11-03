# 3D Stage & Kit Contract (`SceneKit` + `StudyScenes`)

## 1. HTML Stage Container Pattern
Every 3D stage in a lesson uses the `.stage` container structure from `lesson.css`:

```html
<div class="stage" id="bench-stage">
  <div class="stage-canvas">
    <canvas id="bench-canvas" aria-label="3D interactive apparatus description"></canvas>
    <div class="stage-label"><i></i>3D virtual practical · drag to rotate</div>
    <div class="stage-toast" id="bench-toast" role="status" aria-live="polite"></div>
    <div class="stage-fallback"><p>The 3D view couldn't start on this device. Use the controls and table below.</p></div>
  </div>
  <div class="stage-bar">
    <!-- Segmented mode buttons (.seg), action buttons (.vt-btn), and live readout counters (.counters) -->
  </div>
</div>
```

## 2. `window.StudyScenes[name]` API Contract
Every 3D scene script (e.g. `bench.js`, `zoom.js`) registers an API object on `window.StudyScenes[name]` so `StudyNarrator` can spotlight 3D parts, highlight them, and trigger actions mid-speech:

```js
(function () {
  "use strict";
  var root = document.getElementById("bench-stage");
  var canvas = document.getElementById("bench-canvas");
  if (!root || !canvas) return;

  var highlightPart = null;
  var api = {
    rect: function (part) {
      // Return stage.rectOf(meshOrGroup, padPx) for each named 3D part
      return null;
    },
    highlight: function (part) {
      highlightPart = part || null;
    },
    reset: reset
    // Plus topic-specific action methods (e.g. test, runTrial, setLength)
  };
  window.StudyScenes = window.StudyScenes || {};
  window.StudyScenes.bench = api;

  var stage = window.SceneKit && window.SceneKit.createStage({
    root: root,
    canvas: canvas,
    fov: 32,
    target: new THREE.Vector3(0, 0.95, 0),
    pitch: 0.25,
    yaw: 0,
    fitWidth: 8.5,
    distance: 8,
    onFrame: frame
  });
  if (stage) build();
})();
```

## 3. Standalone Reusable Kits (`kits/<kit-id>/`)
When saving a reusable kit into `kits/<kit-id>/`:
- `kit.json`: metadata, parameters, events, `used_in`
- `kit.js`: registers both `window.StudyPipeKits["<kit-id>"]` and (when mounted inside a `.stage`) `window.StudyScenes`
- `demo.html`: standalone test page verified with `node scripts/qa.mjs kits/<kit-id>/demo.html`.
