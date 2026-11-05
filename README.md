# Math Expo

Three independent mathematics projects in one repository.

| Project | Source | Website |
| --- | --- | --- |
| Papers | `projects/papers/` | [Read the papers](https://liuyao12.github.io/math-expo/papers/) |
| Reimagined textbooks | `projects/textbooks/` | [Read the textbook](https://liuyao12.github.io/math-expo/textbooks/) |
| Stacks Reader | `projects/stacks/` | [Read with an example](https://liuyao12.github.io/math-expo/stacks/) |

The [Math Expo homepage](https://liuyao12.github.io/math-expo/) links to all three projects. They share a repository and deployment but retain their own source, design, build scripts, and checks.

## Papers

A collection for mathematical literature across authors, periods, and subjects. Every catalogue entry is intended to become a complete on-site reading in modern English, with commentary, precise statements, proofs, margin drawings, and linked references. Current complete readings include Euler’s reciprocal series and prime-product paper, his complete circle chapter from the *Introductio*, Dedekind’s two foundational essays, and the prime-counting paper; the complete 1854 geometry lecture now includes all three parts and its closing synopsis. Gauss’s curved-surfaces paper is also available in full, with all 29 articles, geometric drawings, source comparisons, and six rigorous reconstructions. Source-only entries are explicitly labelled as awaiting a full reading. The [catalogue](https://liuyao12.github.io/math-expo/papers/) supports author, date, original-language, and keyword filters.

Each work is presented on its own mathematical terms. Connections between works appear where supported by actual citations or needed to explain a particular argument. [Editorial principles](projects/papers/EDITORIAL.md) keep reconstructions within the author’s intended cases and distinguish proofs, dependencies, conjectures, and outstanding gaps.

## Reimagined textbooks

New expositions of established mathematics. The current working text, *Linear Algebra — From Euclidean geometry to higher and even infinite-dimensional spaces*, develops linear algebra from Euclidean geometry toward inner product spaces of functions and Fourier approximation.

## Stacks Reader

A companion edition of the Stacks Project: longer continuous readings, original statements and expandable proofs, and one running example alongside the mathematics. The foundation path collects 78 complete original sections leading to the definition of scheme, preserving original chapter and section titles, with complex function theory alongside. A companion reading follows gluing with the Riemann sphere. [Source and editorial notes](projects/stacks/README.md).

## Build and validate

Requires Node.js 24. No dependency installation is needed; the math renderer and fonts are vendored.

```sh
npm run build
npm run check
python3 -m http.server 8000 --directory dist
```

The root build assembles all three projects into `dist/papers/`, `dist/textbooks/`, and `dist/stacks/`, with a shared homepage in `dist/index.html`. All links and asset paths support GitHub Pages’ `/math-expo/` prefix.

Each project can also be built independently:

```sh
npm run build:papers
npm run build:textbooks
npm run build:stacks
```

The workflow in `.github/workflows/pages.yml` builds, checks, and publishes all three projects to GitHub Pages on pushes to `main`. Mathematical notation uses LaTeX, typeset with KaTeX. Third-party licenses are retained with the vendored assets.
