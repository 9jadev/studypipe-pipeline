# `cell-bio` (`window.CellKit`)

Reusable parametric 3D cell-biology, microscopy, protist, osmometry, and ultrastructure builder kit for StudyPipe Biology topics.

## Builders (`window.CellKit`)
- `CellKit.plantCell(opts)` — 3D Plant Cell (cellulose wall with double-line edges, plasma membrane, central sap vacuole with tonoplast, peripheral nucleus & nucleolus, chloroplasts with grana & cytoplasmic streaming, mitochondria, rough ER, Golgi body, ribosomes; live `tonicity` from `+1` turgid to `-1` plasmolysed).
- `CellKit.animalCell(opts)` — 3D Animal Cell (irregular lipoprotein membrane, central nucleus & nucleolus, centrioles, mitochondria, lysosomes, small vacuoles, Golgi body, rough ER, glycogen granules, ribosomes; live `tonicity` swelling/bursting & crenation).
- `CellKit.rbc(opts)` — 3D Biconcave Mammalian Red Blood Cell (`tonicity` drives hypotonic swelling/haemolysis vs hypertonic crenation).
- `CellKit.bacterium(opts)` — 3D Prokaryotic Rod Bacterium (slime capsule, peptidoglycan wall, plasma membrane, circular nucleoid DNA, plasmids, 70S ribosomes, rotating flagellum).
- `CellKit.microscope(opts)` — 3D Compound Light Microscope (illuminator lamp, condenser beam, stage & clips, slide, revolving nosepiece with `×4`, `×10`, `×40` objectives, body tube, eyepiece, coarse & fine adjustment knobs).
- `CellKit.protist(type, opts)` — 3D models of `amoeba`, `paramecium`, `euglena`, `chlamydomonas`, `volvox`, `spirogyra`, and `hydra`.
- `CellKit.cube(L, opts)` — 3D Surface-Area-to-Volume ($\frac{SA}{V}$) diffusion cube.
- `CellKit.slide(opts)` — 3D Wet-Mount Glass Slide, Stain Drop, Specimen, $45^\circ$ Coverslip & Mounting Needle, and Trapped Air Bubbles.
- `CellKit.mitochondrion(opts)`, `CellKit.chloroplast(opts)`, `CellKit.bilayer(opts)` — High-detail 3D ultrastructure cut-aways (cristae & ATP, thylakoid grana & stroma, phospholipid bilayer with aquaporin & ATP active-transport pump).
