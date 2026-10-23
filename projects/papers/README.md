# Papers

A growing library of mathematical papers in modern English, with commentary, precise statements and proofs, scoped mathematical references, and a sourced citation index.

The collection covers mathematical literature across authors, periods, and subjects. Every catalogue entry is intended eventually to become a complete on-site reading with commentary. Describe each work in terms of its own mathematics; retain genuine citation edges without organizing unrelated works around a featured paper.

Current complete readings include Euler’s reciprocal-series paper (all nineteen sections), Dedekind’s *Continuity and Irrational Numbers* (all seven sections and the preface), *The Nature and Meaning of Numbers* (all 172 numbered paragraphs and both author prefaces), and the 1859 prime-counting paper. The complete 1854 geometry lecture includes the introduction, all eleven numbered subsections in parts I–III, and the closing synopsis, with Clifford’s historical English available beside each modernized passage. Its commentary preserves the exploratory scope and explicitly qualifies the curvature-prescription and local-to-global claims. Other catalogue records are interim source records awaiting full readings.

The Dedekind readings lightly modernize Beman’s public-domain English (1901), preserving all 25 source footnotes. They include three margin drawings, five precise written proofs, scoped definition records, and commentary on the nonempty-system convention, undecidable membership, the proof of infinity, and the choice assumption in §159. Original German editions and the English source are linked. The readings have not been fully collated against the German; selected reconstructions do not amount to a complete foundational verification.

Two further Euler readings cover the full E72 paper (1744, all nineteen theorems and seventeen corollaries) and the complete Chapter VIII of the *Introductio* (1748, §§126–142). The chapter is catalogued as a chapter, not as a complete edition of the book. Nine written reconstructions establish the imaginary-exponential limit, its identity consequence, local logarithm formula, series bounds, rational circle computation, distinct-perfect-power sum, convergent prime product, reciprocal-prime divergence, and double-logarithm growth. Boundary products and signed sums in E72 retain explicit outstanding proof obligations. Six margin figures include an interactive unit circle and a finite reciprocal-prime plot.

The 1751 logarithm controversy paper (E168) is a complete independent modern-English rendering from the French: seven arguments, nine objections, the resolution and theorem, four problems, all ten examples and their value progressions, and the final calculation. Five written reconstructions distinguish selected logarithms from all-value families, scaling from independent sums, and fixed-index limits from unconstrained root choices. Three margin diagrams include an interactive logarithm-value ladder. Langton’s 1999 English translation is linked for comparison, not reproduced. The 1745 Leibniz–Bernoulli correspondence has an interim bibliographic record because Euler explicitly cites its letters; the citation is generated in both directions.

The complete bridges reading (E53, 1741, §§1–21) preserves both counting tables, the fifteen-bridge route, and the final pair-removal suggestion. Seven drawings retain Euler’s region and bridge labels, with a step control for the printed route. Four written proofs justify the word notation, endpoint counts, seven-bridge impossibility, and the finite connected-case criterion. The independent rendering comes from the Latin scan and plate; the external English file remains an unverified archive lead. The English-availability filter includes our own complete English readings as well as inspected external translations.

The catalogue currently contains twenty-three works, forty people, thirty-one scoped mathematical references, and nine verified citation edges. Completeness of an imported text and completeness of its mathematical reconstruction are distinct.

The unified [work catalogue](https://liuyao12.github.io/math-expo/papers/) presents all works together, with author, original-language, decade, inclusive year-range, and reading-option filters. Search covers original and English titles, summaries, translators, and editorial modern terminology. Filter state is retained in the URL. The fourteen inspected translation sources keep their provenance in each work’s source panel; one uninspected lead remains labelled as such. “Inspected” is a source check, not a separate class of mathematical works or a claim of full collation.

## Develop

Requires Node.js 24. There are no package dependencies to install.

```sh
npm run build
npm run check
python3 -m http.server 8000 --directory dist
```

The collection is generated as static HTML in `dist/`. All links are relative, so it works under the GitHub Pages project path. The readings are at `riemann-1854/`, `riemann-1859/`, `euler-1740/`, `dedekind-1872/`, `dedekind-1888/`, `euler-1744/`, `euler-1748-circle/`, `euler-1751/`, and `euler-1741/`; author pages are under `people/`, and paper-specific object records under `concepts/`.

- `src/catalog.mjs`: works, people, scoped mathematical references, bibliographic fields, and checked citation edges.
- `src/translation-sources.mjs`: new source-work records and the English translation ledger, including inspection status and translator attribution.
- `src/riemann-1859.mjs`: new modern-English rendering and commentary.
- `src/statements-1859.mjs`: precise statements, proof status, and written proofs.
- `src/riemann.mjs`, `src/modern-1854.mjs`: historical wording and the modern-English revision.
- `src/figures.mjs`: geometric drawings.
- `src/figures-1859.mjs`: contour, strip, and counting diagrams.
- `src/euler-1740.mjs`, `src/statements-euler-1740.mjs`, `src/figures-euler-1740.mjs`, `src/concepts-euler-1740.mjs`: Euler’s full rendering, commentary, proofs, drawings, and scoped references.
- `scripts/check-euler-arithmetic.mjs`: independent exact coefficient extraction and checks of the numerical formulas, not verification of the analytic proofs.
- `src/discovery.mjs`: editorial discovery terms and shared filtering logic, also exported in the catalogue data.
- `src/euler-1744.mjs`, `src/euler-1748-circle.mjs`, `src/euler-more-catalog.mjs`, `src/statements-euler-more.mjs`, `src/figures-euler-more.mjs`: complete new readings, scoped records, nine written proofs, and margin figures.
- `src/euler-more-sources.json`: source URLs, checksums, reading extents, and inspection evidence. Modern English comparison texts are linked, not reproduced.
- `scripts/check-euler-more.mjs`: independent perfect-power table generation, multiplicative sign checks, rational bounds for decimal coefficients, and finite numerical checks.
- `src/euler-1751.mjs`, `src/euler-1751-catalog.mjs`, `src/statements-euler-1751.mjs`, `src/figures-euler-1751.mjs`: full logarithm reading, scoped records, five written reconstructions, and three drawings.
- `src/euler-1741.mjs`, `src/figures-euler-1741.mjs`, `src/statements-euler-1741.mjs`, `src/euler-1741-catalog.mjs`, `src/bridges-data.mjs`: full bridge reading, scoped references, original endpoint data and route, drawings, and finite proofs.
- `src/euler-1741-source.json`, `scripts/check-euler-1741.mjs`: original-page mapping, source evidence, exact route and table checks, and independent finite crossing verification.
- `src/euler-1751-source.json`: original and comparison-text provenance, checksums, extent, and disclosed printing repairs.
- `scripts/check-euler-1751.mjs`: complete passage inventory, rational checks of every logarithm progression, independent product and quartic checks, and finite root-limit error samples.
- `src/dedekind.mjs`: commentary, named references, scoped definitions, diagrams, and precise proofs for both essays.
- `src/dedekind-text.json`: complete texts with import provenance and an explicit list of prose modernizations.
- `src/sources/dedekind-beman-1901.tex`: pinned public-domain source, converted from ISO-8859-1 to UTF-8 with line endings normalized and trailing spaces removed.
- `scripts/import-dedekind.mjs`: restricted TeX importer; unknown commands fail rather than disappear. Run it to regenerate the texts; `--check` verifies the generated file. Both author prefaces and all mathematical paragraphs and footnotes are included. Publisher advertisements, the index, and the translator’s introductory note are outside the essay text.
- `public/`: styles, reader interactions, and vendored math assets.
- `scripts/build.mjs`: generates the collection and paper pages.
- `scripts/check.mjs`: checks all generated pages, LaTeX, cross-page anchors, citation reciprocity, English-source provenance and catalogue membership, bibliographic exports, local assets, and JavaScript syntax.

Every work has references, citing works, and a downloadable BibTeX citation. Reverse citation lists are derived from the same checked edges. `catalog.json` exports the catalogue, evidence, and statement records. Citation coverage is selected and incomplete; no MathSciNet data or affiliation is implied. Author attributions, selected bibliography, and editorial sources are not automatically citation edges.

See [EDITORIAL.md](EDITORIAL.md) for the scope and proof conventions.

## Publish

This project belongs to the shared [Math Expo repository](https://github.com/liuyao12/math-expo). Its root workflow builds and publishes both the paper collection and the textbook project on pushes to `main`. The published collection is at [Math Expo / Papers](https://liuyao12.github.io/math-expo/papers/).

## Sources and third-party assets

Historical wording is distinguished from modern editorial commentary. Each reading includes its own sources and editorial notes. Mathematical notation is written in LaTeX and rendered with local KaTeX assets. The accompanying Computer Modern fonts are loaded locally as well. KaTeX’s license is retained in `public/vendor/katex/LICENSE`.

## Paper URLs

Use lowercase `author-year/` identifiers, such as `riemann-1854/`. The year refers to the original work: the delivery year for a lecture, or the initial publication year for a paper. It does not refer to the translation or this reading edition. If multiple works have the same author and year, add a short title to distinguish them, such as `author-year-short-title/`. Keep established identifiers stable.


Euler’s E262 (1761), **Theorems on residues obtained by the division of powers**, is a complete fresh modern-English reading of all 78 numbered paragraphs and twenty theorems. Five editorial figures explain repeated squaring, a remainder cycle, disjoint multiplied lists, prime-factor restrictions, and finite differences. Six written proofs keep the prime and nonzero hypotheses explicit. The Latin scan and Bell’s separately credited comparison translation are linked; corrections are documented in `src/euler-1761-source.json`. Two direct references without catalogue records retain their source evidence in the reading and exported work metadata. `scripts/check-euler-1761.mjs` checks period partitions, power-residue cases, numerical examples, and hypothesis counterexamples.

The catalogue uses a left search-and-filter sidebar with checkbox facets for author, original language, decade, and reading access, plus an inclusive year range. Alternatives within a facet combine with OR; different facets and search combine with AND. Counts apply the query and other facets while leaving the counted facet unrestricted. Unselected zero-count choices disappear; selected choices remain removable even at zero. Active selections have removal chips, repeated URL parameters preserve multi-selection, and clear-all restores the catalogue. On narrow screens the sidebar becomes an expandable filter panel. Pure filtering/count checks and browser checks cover the combined behavior.

## Riemann’s complete geometry lecture

- `src/riemann-complete.mjs`: the complete modern-English reading, source comparisons, margin commentary, and synopsis.
- `src/sources/riemann-WKCGeom-1998.tex` and `riemann-Geom-1998.tex`: pinned Wilkins transcriptions of Clifford’s English and the German lecture.
- `scripts/import-riemann-1854.mjs`: reproducible import of all 45 consecutive source intervals and the closing synopsis; source hashes and substantive variations are recorded in `src/riemann-1854-source.json`.
- `scripts/check-riemann-1854.mjs`: coverage, historical comparisons, and independent metric/circle and curvature-normalization checks.
- `src/figures-riemann-1854.mjs`: five additional margin drawings, making ten in the complete reading.

## Gauss’s complete curved-surfaces paper

The 1827/1828 paper now has a complete modern-English reading of Articles 1–29, adapted from Morehead and Hiltebeitel’s public-domain 1902 translation. Source subdivisions, all 934 mathematical expressions, and the author’s footnote are retained. Expand each article to compare the standardized source wording. The six written reconstructions concern regular surface patches in Euclidean three-space; higher-order series remain explicitly marked as not fully independently checked.

- `src/gauss-1828.mjs`: reading sections, source-page links, commentary, and edition statement.
- `src/modern-gauss.mjs`: prose revision, with formulas and markup protected; checks preserve their complete ordered sequence.
- `src/sources/gauss-morehead-hiltebeitel-1902.tex`: pinned source for the complete primary paper.
- `scripts/import-gauss.mjs` and `src/gauss-text.json`: reproducible conversion, source hash, source errata, and six separately logged editorial repair locations.
- `src/statements-gauss-1828.mjs`: six proofs, including intrinsic curvature, first variation, radial orthogonality, and the triangle excess formula.
- `src/figures-gauss-1828.mjs`: drawings and the surveying comparison.
- `scripts/check-gauss.mjs`: source and rendering coverage, formula preservation, 3125 exact curvature identities, sphere checks, and independent numerical triangle integrals.

The squared metric determinant in Article 11 was checked in the Latin first printing, p. 23 (ETH / e-rara, PDF p. 28). The complete reading has not been collated line by line against the Latin. The original printing and the 1902 English edition remain linked above the reading.
