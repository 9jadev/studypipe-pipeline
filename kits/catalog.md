# Kit catalog

Read this before building any visual. One row per kit. Keep it sorted by subject, then id.
`lesson-renderer` and `kit-builder` update this file — never delete rows; bump versions instead.

| id | subject | type | concepts | key params | version | used in |
|---|---|---|---|---|---|---|
| cell-bio | Biology | interactive-3d | plant & animal cells, organelles, prokaryotic bacterium, compound microscope, protists (Amoeba, Paramecium, Euglena, Chlamydomonas, Volvox, Spirogyra, Hydra), osmosis/plasmolysis/haemolysis, wet-mount slide prep | tonicity, objective, type, onion, cheek | 1 | ss1-bio-plant-animal-cell-structure |
| dc-circuit-bench | Physics | interactive-3d | Ohm's law, resistivity, EMF & internal resistance, series/parallel cells, ammeter shunt, voltmeter multiplier, metre bridge, potentiometer | E_volts, r_ohms, R_load_ohms, wire_length_cm, wire_diameter_mm, mode | 1 | ss2-phy-ohms-law-circuits |
| mass-spring | Physics | interactive-3d | SHM, Hooke's law, spring constant, period of mass on spring | mass_kg, k_Npm, amplitude_m | 1 | ss2-phy-simple-harmonic-motion |
| math-solver | All (Math / Physics / Chemistry) | service-latex | offline LaTeX rendering (\frac, \sqrt, \boxed), atomic step-by-step calculation decomposition, plain-English explainer note under every equation line | latex, steps, displayMode, autoUpgrade | 1 | ss2-phy-refraction-rectangular-block, ss2-phy-ohms-law-circuits, ss2-phy-simple-harmonic-motion |
| pendulum | Physics | interactive-3d | SHM, period, g, oscillation, isochronism, energy, lab T² vs l | mode, length_m, angle_deg, g, mass_g, show_energy | 2 | _example-simple-pendulum, ss2-phy-simple-harmonic-motion |
| refraction-glass-block | Physics | interactive-3d | Snell's law, refractive index, rectangular glass block, lateral displacement, real & apparent depth, critical angle, total internal reflection, 4-pin ray tracing | n_index, thickness_cm, angle_i_deg, pin_spacing_cm, mode | 1 | ss2-phy-refraction-rectangular-block |
| shm-kinematics-2d | Physics | interactive-2d | SHM arrows, circular motion shadow, velocity & acceleration, damping, resonance | mode, amplitude_m, period_s | 1 | ss2-phy-simple-harmonic-motion |
| study-graph | Physics | interactive-2d | live lab graph plotting, gradient & intercept, best-fit line, V–I graphs, theory curves (P–R, η–R, I_g–l) | theme, x, y, series, guides, marker | 1 | ss2-phy-ohms-law-circuits |
