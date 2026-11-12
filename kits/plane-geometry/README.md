# PlaneGeometryKit (Paper.js 2D Kit)

Canonical 2D vector kit for WAEC / NECO / JAMB plane geometry, Euclidean proofs, and planar mathematical figures using **Paper.js** (`kits/_vendor/paper-core.min.js`).

## Features
- **Interactive Triangles:** Draggable vertices ($A, B, C$), live side lengths, interior angle arcs with degree readouts, right-angle markers.
- **Circle Theorems & Tangents:** Incircle, circumcircle, tangent lines, and secants.
- **Euclidean Proof Geometry:** Congruence tick marks, angle bisectors, medians, perpendicular bisectors.
- **100% Offline & Mobile-First:** Runs without CDNs or network access using bundled `paper-core.min.js`.

## API
```javascript
const geom = PlaneGeometryKit.create({
  container: document.getElementById('bench-stage'),
  mode: 'triangle', // 'triangle' | 'pythagoras' | 'circle-tangent' | 'angles'
  initialVertices: [[60, 240], [300, 240], [180, 80]],
  showAngles: true,
  showSideLengths: true,
  draggable: true
});

geom.reading(); // returns { angles: [A, B, C], sides: [a, b, c], area, perimeter }
geom.setState({ mode: 'pythagoras' });
```
