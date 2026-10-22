# Editorial principles

The project makes the mathematics of each paper explicit and rigorous while preserving the cases its author is actually considering. It is not a vehicle for silently replacing historical objects with the most general contemporary ones.

## Text and statements

- Provide modern English. Identify the original edition and the translation basis, link existing translations, and distinguish a full rendering from selected passages. Keep substantive corrections visible rather than quietly making the author say something different.
- For each reconstructed statement, state the objects, domains, hypotheses, conclusion, and proof dependencies. Identify whether the paper proves it, sketches it, conjectures it, or needs repair. A new proof is an editorial reconstruction, not an attribution to the author.
- Keep original restrictions and conventions: variables, parameter ranges, summation order, branches, convergence domains, and values at discontinuities. Introduce an extension separately, with its own justification; an easy extension must still be named as such.
- “Function” does not automatically mean an arbitrary mapping between sets. Identify how the particular expression is given and used. Equally, do not attribute a universal formula-only or computability foundation to an author without evidence. A comparison with computable analysis needs representations and effective bounds, not merely an expression that converges.
- Written proofs are not proof-assistant verification. Reserve a machine-checked label for a linked proof artifact with an identified checker and dependencies. Record outstanding proof obligations explicitly.
- Use LaTeX for all mathematical notation, rendered with the local KaTeX installation. Use code-native vector diagrams when they clarify an argument; make their assumptions and schematic character explicit.

## Linked references

- Mark mentions explicitly with `[[person:id|label]]`, `[[work:id|label]]`, or `[[concept:id|label]]`. Avoid global keyword replacement, especially for generic words such as function and space.
- Mathematical reference IDs are scoped to a paper. Separate the author’s definition, the modern identification, and the modern comparison. A shared symbol is not evidence that two objects coincide.
- Person pages list edited works and selected bibliography separately. A source-only record has English metadata, a source link, and a clear statement that no reading edition is prepared here yet.
- Use author-year work IDs. Specify whether a date is composition, presentation, publication, or translation; append a short title for same-year collisions. Do not create redirects unless requested.

## Bibliography and citation evidence

- A citation edge needs a checked citing work, an identified cited work, a locator, an evidence description, and a source URL. Inspect the primary text or bibliography. Do not infer a direct citation merely from influence, a shared topic, or a person's name.
- Generate references and citing-work lists from one edge list. A zero means no verified edges recorded here, not that no citations exist. Qualify all displayed counts with coverage.
- Keep editorial sources and selected related reading separate from the author's citations. A historical name without a work identification remains a person attribution.
- Cite the original work in exports, with its original title and publication metadata. Explain how to cite the modern editorial reading separately. Preserve source provenance in the downloadable catalogue.
- Do not reproduce modern copyrighted translations or database records without permission. New translations can be made directly from public-domain originals, with the basis stated.
