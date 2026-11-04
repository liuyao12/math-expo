# Stacks Reader

The third Math Expo project reimagines reading the Stacks Project: longer continuous documents, full source statements and proofs, and a concrete example that develops alongside the mathematics. It is independent of the papers and textbooks projects.

The first reading, **Gluing local data**, combines three complete source sections: locally ringed spaces (26.2), gluing sheaves (6.33), and gluing schemes (26.14). The Riemann sphere is the familiar special case. The side column explicitly assigns each source symbol to an object in that case, identifies its mathematical type, checks hypotheses, and specializes the conclusion. Marked inline symbols link to their entries. The reader assumes familiarity with the special case; it does not aim to teach the sphere itself. All seven source proofs start collapsed and can be opened individually or together. The companion distinguishes analytic holomorphic functions from algebraic regular functions explicitly.

## Build

No package installation is required. From this directory run `node scripts/build.mjs` and `node scripts/check.mjs`, or build all projects from the repository root. The reader is published at `/math-expo/stacks/`.

## Source and future readings

`upstream/manifest.json` pins the source repository commit and selected sections. Complete retained LaTeX sections live in `upstream/sections/`. `src/latex.mjs` renders source prose, statement environments, lists, references, display mathematics, and Xy-pic diagrams, failing on missing references or invalid KaTeX. Diagrams are rendered as equivalent LaTeX arrays. Proofs are attached to their statements and rendered as native `details` elements, closed by default. Original labels and tags are retained. The build runs offline.

`src/matches.mjs` contains the structured object assignments, hypothesis checks, specialized conclusions, and proof explanations. `src/examples.mjs` associates these specializations with source passages. New readings should define their source sections and one persistent example in the same way; choose units by mathematical continuity rather than by individual tags. `src/chapters.json` is the broader Stacks chapter directory. Original-chapter links are clearly identified as upstream references, not companion readings.

The sphere sketch is optional and closed by default. It illustrates the relation between two coordinates. Its charts below the sphere are schematic, with a compressed radial drawing; the numerical coordinate readout uses the actual reciprocal relation. The underlying scheme and its analytic complex points must not be conflated.

## Attribution and license

Mathematical text: The Stacks Project Authors. Copyright (C) 2005–2025 Johan de Jong, as stated in the retained source edition. Reader design, example commentary, and drawings: Math Expo, 2026. This is an independent modified edition under the GNU Free Documentation License, Version 1.2 or any later version, with no Invariant Sections, no Front-Cover Texts, and no Back-Cover Texts. The complete license is `upstream/COPYING`; the public About page contains attribution and modification history and links to editable source. KaTeX retains its MIT license.

### History

2026-11-04: First Math Expo Stacks Reader edition. Selected and reordered three complete source sections, rendered them as one continuous HTML document, typeset mathematics and diagrams, made proofs collapsible, retained reference tags, and added the Riemann sphere example and interactive drawing.

2026-11-04: Replaced general narration with precise passage-level object matching and proof-specific explanations. Added keyboard-accessible source-symbol links and made the visual optional. Retained all source statements and proof defaults.
