# Stacks Reader

The third Math Expo project reimagines reading the Stacks Project: longer continuous documents, full source statements and proofs, and a concrete example that develops alongside the mathematics. It is independent of the papers and textbooks projects.

The gluing reading, **Gluing local data**, combines three complete source sections: locally ringed spaces (26.2), gluing sheaves (6.33), and gluing schemes (26.14). The Riemann sphere is the familiar special case. The side column explicitly assigns each source symbol to an object in that case, identifies its mathematical type, checks hypotheses, and specializes the conclusion. The side column follows the current source passage without adding marks or buttons to the original text. The reader assumes familiarity with the special case; it does not aim to teach the sphere itself. All seven source proofs start collapsed and can be opened individually or together. The companion distinguishes analytic holomorphic functions from algebraic regular functions explicitly.

The definition path selects complete sections for the definitions and the construction of the structure sheaf. `upstream/scheme-core.json` records the role of each section. The full reference collection contains **78 complete original sections** under the seven original chapter titles: Categories, Topology, Sheaves on Spaces, Commutative Algebra, Homological Algebra, Sheaves of Modules, and Schemes. It assumes sets and basic undergraduate algebra. Original section titles, numbering, mathematical wording, and proofs are preserved. Examples from algebra, topology, and complex analysis appear in the side column. The margin’s source pane provides verbatim LaTeX, downloads, stable Stacks tags, and links to the exact retained source lines. Source-only history, slogans, and reference notes also stay in this pane. The main column contains only original printed headings and text, with proof-collapse controls as the sole added interface.

**Algebraic curves** builds on the scheme definition path. It follows modules and projective space, sheaf cohomology and Čech complexes, and plane curves, ending with the section containing Lemma 53.9.3. The dependency graph links to statements in the reading and to the scheme definition in the first path. Other cross-references can lead to the chapter collection or to Stacks.

`upstream/scheme-selection.json` records the starting sections and explicit reference exceptions for the reference collection. `scripts/import-scheme-path.py /path/to/pinned/stacks-source` follows references recursively to assemble the full collection. Assumed background and additional examples, comparisons, and alternative proofs are explicitly classified, with reasons, rather than silently skipped. `upstream/scheme-path.json` records the result, original titles, exact source hashes, routes, and a reference audit. Full original chapter sources are retained in `upstream/chapters/`. Reader URLs sit directly under `/stacks/`, including `/stacks/scheme/`, `/stacks/curves/`, and `/stacks/grr/`. Earlier `/stacks/read/` URLs are retired without redirects.

All three selected readings use `scripts/reading-generator.mjs`. `src/readings.json` lists their target Stacks tags, selected section tags, prerequisite readings, and graph data. `src/readings.mjs` resolves those tags against the shared `upstream/sections.json` catalog and assembles complete sections in their original chapter order. Reused prerequisites link back to their reading. The source importer uses the same configuration, so a reading’s scope is defined in one place.

`scripts/audit-dependencies.py` checks all three selected readings offline against the retained pinned chapter sources. It follows references in required statements and **every attached proof**, including a proof separated from its statement by prose, and checks each section's introductory setup. `src/dependency-scope.json` records additional dependencies expressed through terminology rather than citations, including graded shifts, the topological construction of Proj, locally free sheaves, dimension functions, internal Hom, and Chern roots. Definitions in prose use the original **section tag**, not an invented definition number. The detailed result is retained in `upstream/dependency-audit.json`; ordinary checks fail if a required section or an earlier-reading prerequisite disappears.

Refresh with `python3 scripts/audit-dependencies.py --refresh /path/to/pinned/stacks-source`, then render missing diagrams with `scripts/render-diagrams.py --missing-only`. The importer retains complete sections in original order and shares earlier material between readings. Additional comparisons, examples, alternative constructions, and announcements of later results are explicitly classified with reasons. Complete sections provide context; the unrelated later results inside them do not recursively become new targets. The inset graphs remain overviews of key prerequisites rather than every proof citation. This combines a reproducible source-reference audit with a reviewed terminology map; it is not an automatic check of mathematical sufficiency. GRR still ends at the formula: the pinned Stacks source does not supply its final proof.

Dependency graph nodes display a type initial and the original number, such as `D 5.5.1` or `L 10.17.2`. Their stable Stacks tags continue to identify links and source passages. A yellow number opens a compact, nonmodal inset beside that number, centered at a readable scale on its neighborhood. Pan or zoom out to explore the rest of the graph; select a node to read its passage. Escape, Close, or a click outside dismisses the inset.

`src/scheme-notes.mjs` contains the separate authored commentary. Its `sectionGroups` and `passageNotes` attach examples to stable Stacks section or statement tags. `notesFor(sectionTag, passageTag)` returns those cards in any reading containing the passage. Notes are optional. An unannotated tag produces no card, and multiple examples can share a tag. The optional complex-analysis examples assume familiarity with holomorphic functions.

On desktop, each tagged group starts beside its source heading and floats down the margin until the next annotated tag pushes it away. Opening proofs and resizing repositions the anchors. Every example heading stays outside the scrolling body. Opening an example closes the others attached to that tag; clicking it again closes it. Long bodies scroll within the space left after reserving all the headings. The mobile panel shares the same accordion choices.

Examples should recall a recognizable construction through concise formulas and a brief explanation where useful. They need not assign every source symbol or supply a proof. Use a commutative diagram whenever it communicates the example, analogy, or comment more clearly. Simple squares can use KaTeX’s `CD` environment inside display math. A note can have an empty `bindings` array and consist entirely of displayed formulas, a diagram, and short prose.

All example introductions, bindings, calculations, and conclusions use bullets for parallel identifications, assignments, and properties. An optional `points` array supports additional bullets with the same inline and displayed LaTeX as the rest of the note.

Keep example headings succinct: name the concept or construction, such as “fundamental group” or “tangent space.” Put explanations and claims in the body.

Cards support `kind: 'analogy'` and `kind: 'non-example'`, with ordinary examples as the default. A non-example can have a brief `correction` explaining the change that makes it an example; this appears as a final bullet.

When reviewing examples with the user, work one chapter at a time and prioritize the dependency graph nodes. Post two numbered retained Stacks statements directly in chat, verbatim and with source links. Accept answers in separate messages and start implementing the first answer while the second is pending; do not require a joint submission. A diagram can be written out directly, with its indexing category made explicit. An example can also occur elsewhere in Stacks; keep it beside the concept it illustrates and link to the upstream occurrence.

## Build

No npm installation is required. Builds use Node; checks also use Python 3. From this directory run `node scripts/build.mjs` and `node scripts/check.mjs`, or build all projects from the repository root. The reader is published at `/math-expo/stacks/`.

The optional browser regression `scripts/check-example-accordion.mjs` uses an installed Playwright and Chromium. Set `PLAYWRIGHT_MODULE` to the module's absolute path and, if necessary, `BROWSER_PATH` to the browser executable. Set `STACKS_BASE` to the local or deployed Stacks base URL, ending in `/`.

Selected readings retain complete native MathML generated by the same pinned KaTeX renderer, including formulas inside closed proofs. `public/math-lazy.js` applies KaTeX's HTML layout near the viewport and when a proof becomes visible. This reduces the initial document size without fetching, omitting, or rewriting any source passages; native math remains available without JavaScript. Math macros are shared with the offline renderer.

`scripts/check-dependency-inset.mjs` uses the same variables to check compact local graph views, typed numbers, zoom, dismissal, and navigation on desktop and mobile.

## Source and future readings

For example, a reading’s configuration has `slug`, `readingTitle`, `target`, `sections` (section tags), and `prerequisites` (reading slugs). The generator rejects unknown tags, targets outside the selection, duplicate sections, and cyclic reading prerequisites. Section metadata and unchanged LaTeX live separately from this configuration. The current selections retain their existing scopes; adding a new target still requires choosing its needed sections from the Stacks dependencies.

`upstream/manifest.json` pins the source repository commit and selected sections. Complete retained LaTeX sections live in `upstream/sections/`. `src/latex.mjs` renders source prose, statement environments, lists, references, display mathematics, and Xy-pic diagrams, failing on missing references or invalid KaTeX. LaTeX/Xy-pic and dvisvgm render the commutative diagrams directly from the unmodified source formulas. The retained SVGs keep normal builds offline. `src/diagrams.json` records exact formulas and hashes. To regenerate them, use `scripts/render-diagrams.py` with LaTeX, Xy-pic, dvisvgm, and Node installed. `--texmf-home` can point to an isolated package tree. Proofs are attached to their statements and rendered as native `details` elements, closed by default. Original labels and tags are retained.

`src/matches.mjs` contains the legacy gluing reader’s object assignments, hypothesis checks, specialized conclusions, and proof explanations. `src/examples.mjs` associates these specializations with source passages. `src/source-column.mjs` keeps source tools and nonprinting source notes in the margin. To add a selected reading, list its target and needed section tags in `src/readings.json`, import any missing source sections, and optionally attach notes to those tags. `src/reference-readings.json` retains the earlier twisting-sheaves reference reading. `src/chapters.json` is the broader Stacks chapter directory. Original-chapter links are clearly identified as upstream references.

The sphere sketch is optional and closed by default. It illustrates the relation between two coordinates. Its charts below the sphere are schematic, with a compressed radial drawing; the numerical coordinate readout uses the actual reciprocal relation. The underlying scheme and its analytic complex points must not be conflated.

## Attribution and license

Mathematical text: The Stacks Project Authors. Copyright (C) 2005–2025 Johan de Jong, as stated in the retained source edition. Reader design, example commentary, and drawings: Math Expo, 2026. This is an independent modified edition under the GNU Free Documentation License, Version 1.2 or any later version, with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts. The complete license is `upstream/COPYING`; the public About page contains attribution and modification history and links to editable source. KaTeX retains its MIT license.

### History

2026-11-04: First Math Expo Stacks Reader edition. Selected and reordered three complete source sections, rendered them as one continuous HTML document, typeset mathematics and diagrams, made proofs collapsible, retained reference tags, and added the Riemann sphere example and interactive drawing.

2026-11-04: Replaced general narration with precise passage-level object matching and proof-specific explanations. Added keyboard-accessible source-symbol links and made the visual optional. Retained all source statements and proof defaults.

2026-11-04: Added the foundation path to the definition of scheme, complex-function models, retained source anchors and cross-reading navigation, and extended the renderer to additional statement types, footnotes, citations, nested lists, and commutative diagrams.

2026-11-04: Reorganized the foundation collection under the original chapter titles, expanded and recursively audited prerequisites, retained verbatim section source and source-only notes, rendered original LaTeX diagrams, and added an independent source-to-rendered-prose check.

2026-11-04: Adopted the Papers reader’s separation of source text and commentary. Removed editorial introductions, prompts, source disclosures, and symbol buttons from the main columns, retaining only original printed text and proof-collapse controls.
