# Kit Contract & High-Fidelity 3D Geometry Patterns

Every 3D stage in a lesson (`bench` or `zoom`) and every reusable kit in `kits/<kit-id>/` must follow this contract and use these proven geometry patterns (extracted from [`kits/heart-circulation/heart-kit.js`](../../../../kits/heart-circulation/heart-kit.js) `HeartKit v2`).

---

## 1. HTML Container & Stage Registration (`bench.js` / `zoom.js`)

```html
<div class="stage-3d" id="bench-stage">
  <canvas id="bench-canvas"></canvas>
  <div class="stage-overlay" id="bench-overlay"></div>
</div>
```

Every stage registers itself on `window.StudyScenes[name]` (`'bench'` or `'zoom'`):

```js
window.StudyScenes = window.StudyScenes || {};
window.StudyScenes.bench = {
  rect(partId) { /* returns { x, y, w, h } in viewport px, or stage rect if !partId */ },
  highlight(partId, on) { /* pulses emissive/scale on 3D part; if !partId clears all */ },
  setState(key, val) { /* sets a parameter and updates 3D + HUD */ },
  action(name, payload) { /* triggers a named demo action from narration.js */ }
};
```

When built with `SceneKit.createStage`, `rect`, `highlight`, `setState`, and `action` are wired automatically when you register parts via `stage.addPart(id, mesh, label)`.

---

## 2. Universal Kit Builder Compatibility Wrapper (`attachCompat`)

Every reusable kit (`window.HeartKit`, `window.ElectrolysisKit`, etc.) must tag its interactive parts for raycasting/highlighting and attach the universal compatibility aliases on the returned `THREE.Group`:

```js
function tagPart(obj, key) {
  if (!obj) return obj;
  obj.userData = obj.userData || {};
  obj.userData.partId = key;
  if (obj.traverse) {
    obj.traverse(function (c) {
      c.userData = c.userData || {};
      if (!c.userData.partId) c.userData.partId = key;
    });
  }
  return obj;
}

function attachCompat(g, parts, updateFn, setStateFn) {
  g.userData = g.userData || {};
  g.userData.parts = parts;
  g.userData.update = updateFn;
  g.userData.setState = setStateFn || function () {};
  g.group = g;
  g.parts = parts;
  g.tick = updateFn;
  g.update = updateFn;
  g.setState = g.userData.setState;
  return g;
}
```

Include a `makeHighlighter(scene)` utility on the kit namespace so any caller can pulse named parts:

```js
function makeHighlighter(scene) {
  var saved = [];
  function clear() {
    for (var i = 0; i < saved.length; i++) {
      var s = saved[i];
      if (s.mat && s.mat.emissive) {
        s.mat.emissive.copy(s.emissive);
        s.mat.emissiveIntensity = s.intensity;
      }
    }
    saved.length = 0;
  }
  function highlight(partName, colorHex) {
    clear();
    if (!partName || !scene) return;
    var col = new THREE.Color(colorHex != null ? colorHex : 0xffd166);
    scene.traverse(function (o) {
      if (o.isMesh && o.userData && o.userData.partId === partName && o.material) {
        var mats = Array.isArray(o.material) ? o.material : [o.material];
        mats.forEach(function (m) {
          if (!m || !m.emissive) return;
          var c = m.clone();
          saved.push({ mesh: o, origMat: m, mat: c, emissive: m.emissive.clone(), intensity: m.emissiveIntensity || 0 });
          c.emissive.copy(col);
          c.emissiveIntensity = 0.65;
          o.material = c;
        });
      }
    });
  }
  return { highlight: highlight, clear: clear };
}
```

---

## 3. High-Fidelity Geometry Toolkit (Copy-Paste Patterns)

### A. Deterministic PRNG & Procedural Canvas Textures (Offline)
Use a seeded PRNG so procedural fibres, graduations, metal brush lines, and electrode deposits look rich and identical on every run without external image files:

```js
function rng(seed) {
  var s = (seed || 1) >>> 0;
  return function () {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function srgb(tex) {
  if ('colorSpace' in tex && THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
  else if ('encoding' in tex && THREE.sRGBEncoding) tex.encoding = THREE.sRGBEncoding;
  return tex;
}
```

### B. Curved Spline Tubes with End Caps (`tube` & `capEnds`)
Use for blood vessels, nephron tubules, glass delivery tubes, rubber hoses, and insulated wire leads:

```js
function v3(a) { return Array.isArray(a) ? new THREE.Vector3(a[0], a[1], a[2]) : a; }

function tube(pts, r, segs, radSegs, mat) {
  var curve = new THREE.CatmullRomCurve3(pts.map(v3));
  var geo = new THREE.TubeGeometry(curve, segs || 36, r, radSegs || 16, false);
  var mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.userData.curve = curve;
  mesh.userData.radius = r;
  return mesh;
}

function capEnds(tubeMesh, openLumen, lumenMat) {
  var c = tubeMesh.userData.curve, r = tubeMesh.userData.radius;
  if (!c) return tubeMesh;
  var g = new THREE.Group();
  g.add(tubeMesh);
  [0, 1].forEach(function (u) {
    var p = c.getPoint(u);
    var tan = c.getTangent(u).normalize();
    if (u === 0) tan.negate();
    if (openLumen) {
      var ring = new THREE.Mesh(new THREE.RingGeometry(r * 0.62, r, 20), tubeMesh.material);
      var dark = new THREE.Mesh(new THREE.CircleGeometry(r * 0.63, 20),
        lumenMat || new THREE.MeshBasicMaterial({ color: 0x16040a, side: THREE.DoubleSide }));
      var q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), tan);
      ring.quaternion.copy(q); ring.position.copy(p);
      dark.quaternion.copy(q); dark.position.copy(p).addScaledVector(tan, -0.002);
      g.add(ring); g.add(dark);
    } else {
      var cap = new THREE.Mesh(
        new THREE.SphereGeometry(r, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.55),
        tubeMesh.material
      );
      cap.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tan);
      cap.position.copy(p);
      g.add(cap);
    }
  });
  return g;
}
```

### C. Struts, Chordae Tendineae, Crocodile Leads & Dynamic Connectors (`between`)
Orient and stretch any unit cylinder (`CylinderGeometry(rTop, rBot, 1, ...)`) smoothly between two moving 3D points `p1` and `p2`:

```js
var _up = new THREE.Vector3(0, 1, 0);
var _dir = new THREE.Vector3();

function between(mesh, p1, p2) {
  _dir.subVectors(p2, p1);
  var len = _dir.length();
  mesh.position.addVectors(p1, p2).multiplyScalar(0.5);
  mesh.scale.set(1, Math.max(0.0001, len), 1);
  if (len > 1e-5) mesh.quaternion.setFromUnitVectors(_up, _dir.divideScalar(len));
  return mesh;
}
```

### D. Extruded Anatomical / Apparatus Cross-Sections with Cavity Holes (`ExtrudeGeometry`)
When slicing an organ or vessel, create a smooth outer `THREE.Shape`, push internal chamber paths into `shape.holes`, and extrude:

```js
function splineShape(pts) {
  var v = pts.map(function (p) { return new THREE.Vector2(p[0], p[1]); });
  var s = new THREE.Shape();
  s.moveTo(v[0].x, v[0].y);
  s.splineThru(v.slice(1).concat([v[0]]));
  return s;
}

function splineHole(pts) {
  var v = pts.map(function (p) { return new THREE.Vector2(p[0], p[1]); });
  var p = new THREE.Path();
  p.moveTo(v[0].x, v[0].y);
  p.splineThru(v.slice(1).concat([v[0]]));
  return p;
}
```

### E. Dynamic Fluid / Electrolyte / Blood Level Clipping (`clipY` + `polyGeo`)
To fill an irregular chamber or vessel up to a live vertical level $y_{\text{cut}}$ (e.g., blood filling a ventricle, electrolyte in a cell, titrant in a flask), clip the 2D chamber polygon with Sutherland–Hodgman and triangulate:

```js
function clipY(pts, yCut, keepAbove) {
  var out = [], n = pts.length;
  if (!n) return out;
  function inside(p) { return keepAbove ? p.y >= yCut : p.y <= yCut; }
  function isect(a, b) {
    var t = (yCut - a.y) / ((b.y - a.y) || 1e-9);
    return new THREE.Vector2(a.x + (b.x - a.x) * t, yCut);
  }
  for (var i = 0; i < n; i++) {
    var cur = pts[i], prev = pts[(i + n - 1) % n];
    var cIn = inside(cur), pIn = inside(prev);
    if (cIn) {
      if (!pIn) out.push(isect(prev, cur));
      out.push(cur);
    } else if (pIn) {
      out.push(isect(prev, cur));
    }
  }
  return out;
}
```

### F. Synchronised GLSL Vertex Deformation + JS Overlay Tracking
When deforming a mesh on the GPU via `mat.onBeforeCompile`, always write the identical mathematical formula in JS so attached valves, electrodes, particles, and labels track the deformed vertices accurately. See `SQ_GLSL`, `squeezable(mat, uniforms)`, and `squeezeJS(p, uV, uA)` in [`kits/heart-circulation/heart-kit.js`](../../../../kits/heart-circulation/heart-kit.js).
