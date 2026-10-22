# Papers

A growing library of mathematical papers in modern English, with commentary, precise statements and proofs, scoped mathematical references, and a sourced citation index.

The first complete reading is Riemann’s 1859 prime-counting paper, freshly rendered from the public-domain German text. It includes six precise statement records: four proofs with their dependencies, an inversion reduced to a stated Fourier theorem, and the unproved hypothesis. The reading explicitly marks the remaining proof gaps in the contour, product, zero count, and full explicit formula.

The geometry lecture remains a reading sample: the complete introduction and part II, §1, in modern English revised from Clifford’s translation. His historical wording is expandable beside each passage. Both readings link to original sources and existing translations.

The catalogue currently contains nineteen work records, eighteen people, eleven paper-specific mathematical references, and seven verified citation edges. A work record is not a claim that its full text has been translated or edited.

The [English-text shelf](https://liuyao12.github.io/math-expo/papers/english/) offers eleven checked English translations, including Euler, Gauss, Fourier, Dirichlet, Riemann, Dedekind, Hilbert, and Noether. Every source has a translator credit, a translation date or an explicit undated label, scope, and evidence. Two archive-listed translation leads are separated from the checked shelf. “Checked” means that the English text and credit were inspected; it does not claim full collation or mathematical review.

## Develop

Requires Node.js 24. There are no package dependencies to install.

```sh
npm run build
npm run check
python3 -m http.server 8000 --directory dist
```

The collection is generated as static HTML in `dist/`. All links are relative, so it works under the GitHub Pages project path. The readings are at `riemann-1854/` and `riemann-1859/`; author pages are under `people/`, and paper-specific object records under `concepts/`.

- `src/catalog.mjs`: works, people, scoped mathematical references, bibliographic fields, and checked citation edges.
- `src/translation-sources.mjs`: new source-work records and the English translation ledger, including inspection status and translator attribution.
- `src/riemann-1859.mjs`: new modern-English rendering and commentary.
- `src/statements-1859.mjs`: precise statements, proof status, and written proofs.
- `src/riemann.mjs`, `src/modern-1854.mjs`: historical wording and the modern-English revision.
- `src/figures.mjs`: geometric drawings.
- `src/figures-1859.mjs`: contour, strip, and counting diagrams.
- `public/`: styles, reader interactions, and vendored math assets.
- `scripts/build.mjs`: generates the collection and paper pages.
- `scripts/check.mjs`: checks all generated pages, LaTeX, cross-page anchors, citation reciprocity, English-source provenance and shelf membership, bibliographic exports, local assets, and JavaScript syntax.

Every work has references, citing works, and a downloadable BibTeX citation. Reverse citation lists are derived from the same checked edges. `catalog.json` exports the catalogue, evidence, and statement records. Citation coverage is selected and incomplete; no MathSciNet data or affiliation is implied. Author attributions, selected bibliography, and editorial sources are not automatically citation edges.

See [EDITORIAL.md](EDITORIAL.md) for the scope and proof conventions.

## Publish

This project belongs to the shared [Math Expo repository](https://github.com/liuyao12/math-expo). Its root workflow builds and publishes both the paper collection and the textbook project on pushes to `main`. The published collection is at [Math Expo / Papers](https://liuyao12.github.io/math-expo/papers/).

## Sources and third-party assets

Historical wording is distinguished from modern editorial commentary. Each reading includes its own sources and editorial notes. Mathematical notation is written in LaTeX and rendered with local KaTeX assets. The accompanying Computer Modern fonts are loaded locally as well. KaTeX’s license is retained in `public/vendor/katex/LICENSE`.

## Paper URLs

Use lowercase `author-year/` identifiers, such as `riemann-1854/`. The year refers to the original work: the delivery year for a lecture, or the initial publication year for a paper. It does not refer to the translation or this reading edition. If multiple works have the same author and year, add a short title to distinguish them, such as `author-year-short-title/`. Keep established identifiers stable.

