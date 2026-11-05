# `refraction-glass-block` (v1)

Parametric 3D Optical Refraction, Rectangular Glass Block, Apparent Depth, Critical Angle & Four-Pin Ray-Tracing apparatus kit for StudyPipe Physics lessons.

## Concepts Covered
- Snell's Law (`n₁ sin θ₁ = n₂ sin θ₂`, `n = sin i / sin r = c / v = λ₁ / λ₂`) & Wavefront Pivoting
- Rectangular Glass Block Parallel Emergence (`e = i`, net angular deviation `0°`) & Lateral Displacement (`d = t sin(i - r) / cos r`)
- Far-Face Shift (`EF = t(tan i - tan r)`, WASSCE 2023 practical) & Red/Violet Lateral Dispersion
- Real & Apparent Depth (`n = t / d_app`), Upward Shift (`Δd = t(1 - 1/n)`), Multi-Layer Slabs, and No-Parallax Search-Pin Alignment
- Critical Angle (`sin C = 1/n = n_less / n_more`), Total Internal Reflection (TIR), Optical Fibres, and `45°` Prism Periscopes
- WAEC/NECO Paper 3 Four-Pin Ray-Tracing Practical (`P₁, P₂, P₃, P₄` pin-base sighting & all 7 official graph variants)

## Key Parameters
- `n_index`: Refractive index of block or medium (`1.33` to `2.42`, default `1.50`)
- `thickness_cm`: Width/thickness `t` of rectangular glass block (`4.0` to `15.0 cm`, default `6.0 cm`)
- `angle_i_deg`: Angle of incidence `i` to the normal (`0°` to `85°`, default `45°`)
- `pin_spacing_cm`: Optical pin separation (`4.0` to `5.0 cm`)
- `mode`: `"snell-wavefront"`, `"lateral-shift"`, `"apparent-depth"`, `"critical-tir"`, `"four-pin-practical"`
