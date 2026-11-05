# `study-graph` (v1)

Phone-first live SVG graph plotter for lab readings. Classic script, no dependencies, offline.
API is documented at the top of `kit.js` (`StudyGraph.create(el, opts)` → `g.set({ series, guides, marker })`).

- Axes with nice ticks, unit titles (`V / V`), grid, axes through zero
- Dots (animated as they arrive), best-fit line (`fit: "line" | "origin"`) with optional extension to the axes
- Slope triangle with ΔX / ΔY labels and gradient in the legend; labelled y/x intercepts
- Smooth theory curves (`fn`), dashed guides with labels, a live marker with drop lines
- Tap a dot to read its coordinates; re-renders at real pixel width (crisp text on phones)
- Works with `notation.js` (underscored symbols become SVG subscripts)

Lesson use: put `<div class="graph-card">…<div id="x-graph"></div>…</div>` under a bench and drive it from
a per-lesson `graph.js` listening to the bench's CustomEvents. Reference: `topics/ss2-phy-ohms-law-circuits/html/lessons/lesson-01/graph.js`.
Test: `node scripts/qa.mjs kits/study-graph/demo.html`
