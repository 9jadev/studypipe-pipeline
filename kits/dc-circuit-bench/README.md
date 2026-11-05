# `dc-circuit-bench` (v1)

Parametric 3D Direct-Current Electricity apparatus kit for StudyPipe Physics lessons.

## Concepts Covered
- Ohm's Law (`V = IR`) & Wire Resistivity (`R = 4ρL / πd²`)
- Electromotive Force (`E`), Terminal P.D. (`V = E - Ir`), Lost Volts (`v = Ir`), and Internal Resistance (`r`)
- Series & Parallel Resistor Networks, Parallel Cell Arrays (`E_eq = E`, `r_eq = r/n`), and Cell Efficiency (`η = R/(R+r)`)
- Galvanometer Conversion (Parallel Ammeter Shunt `R_s` & Series Voltmeter Multiplier `R_m`)
- Wheatstone Metre Bridge (`R_1/R_2 = l/(100-l)`) & 100 cm Slide-Wire Potentiometer (`E_1/E_2 = l_1/l_2`, null balance `I_g = 0`)

## Key Parameters
- `E_volts`: Open-circuit EMF of the accumulator/cell (`1.5` to `15.0 V`)
- `r_ohms`: Internal resistance of the cell (`0.1` to `3.0 Ω`)
- `R_load_ohms`: External load or standard resistance (`0.5` to `25.0 Ω`)
- `wire_length_cm`: Constantan wire or jockey position (`5` to `100 cm`)
- `wire_diameter_mm`: Conductor diameter (`0.30` to `1.20 mm`)
- `mode`: `"ohms-law"`, `"internal-resistance"`, `"network-cells"`, `"galvanometer"`, `"bridge-potentiometer"`
