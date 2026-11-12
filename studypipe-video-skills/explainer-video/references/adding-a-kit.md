# Adding a kit

A kit is an SVG drawing plus one function that draws it for any moment of the video. Build kits carefully once; every video reuses them.

## Rules

1. **Deterministic.** `draw(t, P)` must depend only on `t` (video seconds) and `P` (state). No `Date.now()`, no `Math.random()` at draw time, no CSS animations or transitions for anything the timeline controls. Seed any randomness when building.
2. **State, not steps.** Expose a small state object (numbers and flags). The runtime interpolates numbers between keyframes; read them with `mixN(p, s, 'field', u, default)`.
3. **Readable on dark cards.** Use the palette (`PAL`) and role colours; keep labels at 13 px or larger in the 420×420 viewBox.
4. **Light.** Plain SVG elements; avoid filters and huge paths. Target 60 fps on a mid-range phone.

## Steps

1. In `runtime/runtime.js`, next to the other kits, create the SVG once:
   ```js
   const myKit = el('svg', { viewBox: '0 0 420 420' }); const MK = {};
   (() => { /* build elements into myKit, keep references in MK */ })();
   function drawMyKit(t, P) { const s = P.s, p = P.p, u = P.u; /* set attributes from state */ }
   ```
   `P.s` is the current state, `P.p` the previous keyframe's state (same kit), `P.u` the eased 0→1 transition progress, `P.t0` when the current keyframe started.
2. Register it in `KITS` in `runtime/runtime.js`: `mykit: { svg: myKit, draw: drawMyKit }`.
3. Add the name to the `KITS` array in `scripts/build.cjs` so plans can use it.
4. Document its state fields and an example op in `references/kits.md` in **both** skills (the director chooses kits from that file).
5. Write a short example plan in `examples/` that exercises every state field, build it, and run `scripts/qa.cjs` on it and on the existing examples.
