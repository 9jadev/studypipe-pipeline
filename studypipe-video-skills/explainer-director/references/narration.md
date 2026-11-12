# Narration: writing for the ear

`say` is read aloud by a speech engine and shown as the caption. Write it exactly as a good Nigerian teacher would say it.

## Rules

- Spoken words only. No LaTeX, no `^`, `\`, `$`, no symbols like Ω, ±, √, ≈ in `say`.
- 8–40 words per line; split anything longer. Some browsers cut off speech after about 15 seconds.
- Say numbers with the same significant figures as the board: 3.0 A is "three point zero amps", not "three amps".
- Avoid brackets and dashes in narration; use commas and short sentences instead.
- Say what you are doing before the board does it: "Step two. Move the constant to the right."

## Spoken forms

| On the board | Say |
| --- | --- |
| x² · x³ | x squared · x cubed |
| (x + 3)² | x plus three, all squared |
| √11 · 3√2 | root eleven · three root two |
| ± | plus or minus |
| 3/2 · b/2a | three over two · b over two a |
| −4 | minus four |
| ≈ 0.32 | approximately zero point three two |
| ≥, ≤ | greater than or equal to, less than or equal to |
| sin²x | sine squared x |
| I₁, R₂ | I one, R two |
| Ω · A · V · J · °C · cm³ · mol dm⁻³ | ohms · amps · volts · joules · degrees Celsius · centimetres cubed · moles per decimetre cubed |
| H₂SO₄ · Cu²⁺ · SO₄²⁻ | H two S O four · copper two ions · sulfate ions |
| PbBr₂ · lead(II) | lead two bromide · lead two |
| 96 500 | ninety-six thousand, five hundred |

## Acronyms and captions

Speech engines mispronounce some acronyms. Spell them with spaces in `say` ("E M F", "V I graph") and map them back for captions with `meta.captionFixes`:

```js
captionFixes: { 'E M F': 'EMF', 'V I graph': 'V–I graph', 'I s c': 'I(sc)' }
```

Use `caption` on a single line only when its caption must differ in more than spelling.

## Voice

The player picks a Nigerian English voice when the device has one (for example Microsoft "Ezinne" in Edge, or English (Nigeria) in Google's Android speech engine), otherwise British, then American English. Write in plain international English with Nigerian context; avoid idioms that only work in one accent.
