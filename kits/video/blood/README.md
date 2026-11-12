# Video kit · blood

Three scenes in one kit (`scene`): **cells** (centrifuged sample 55% plasma / 45% cells; biconcave red cell with no nucleus,
face and side view; phagocyte with lobed nucleus; lymphocyte with large round nucleus; platelets), **clot** (a cut vessel and the
cascade: thromboplastin → thrombin with Ca²⁺ and vitamin K → fibrin mesh that traps cells and stops the leak), and **match**
(ABO cross-matching). In *match* the outcome is **computed from the rules**: donor red cells carry antigens (A ▲, B ●), recipient
plasma carries antibodies (A: anti-b, B: anti-a, AB: none, O: anti-a + anti-b), and cells clump (agglutination) only when a donor
antigen meets its matching antibody.

## States (`{ panel: 'blood', s: { … } }`)

| State | Scene | Meaning |
|---|---|---|
| `scene` | all | `'cells'` · `'clot'` · `'match'` (cross-fades) |
| `labels` | all | 0/1 labels |
| `plasma` · `rbc` · `wbc` · `platelets` | cells | 0/1 each: tube · red cell · white cells · platelets |
| `stage` | clot | 0 intact · 1 cut (cells leak) · 2 thromboplastin · 3 thrombin · 4 fibrin clot (leak stops) |
| `donor` · `recipient` | match | `'A'` `'B'` `'AB'` `'O'` |
| `mix` | match | 0/1: donor cells into recipient plasma → clumping or "safe", worked out from the groups |
| `focus` | all | ring `tube` `rbc` `wbc` `platelets` `cut` `cascade` `donor` `recipient`, or `null` |

## Camera close-ups

`tube` `rbc` `wbc` `platelets` · `cut` `cascade` · `donor` `recipient` `result`

## Good for

Composition of blood, red-cell adaptations, white-cell types, the clotting cascade (and clotting vs agglutination), ABO blood
groups, transfusion compatibility, universal donor/recipient.

## Used in

- `ss2-bio-heart-circulation` lesson-05 video
- Demo: `kits/video/blood/demo.plan.cjs` (its checks prove O = universal donor and AB = universal recipient from the same rules)
