# Math Expo

Three independent mathematics projects in one repository.

| Project | Source | Website |
| --- | --- | --- |
| Papers | `projects/papers/` | [Read the papers](https://liuyao12.github.io/math-expo/papers/) |
| Reimagined textbooks | `projects/textbooks/` | [Read the textbook](https://liuyao12.github.io/math-expo/textbooks/) |
| Stacks Reader | `projects/stacks/` | [Read with an example](https://liuyao12.github.io/math-expo/stacks/) |

The [Math Expo homepage](https://liuyao12.github.io/math-expo/) links to all three projects. They share a repository and deployment but retain their own source, design, build scripts, and checks.

Desktop readers share the [margin layout](shared/anchored-margins.js). Each item declares a text anchor and its containing section. It starts at the anchor and scrolls with the reader until the next margin item in that section or the end of the section. Projects supply the content and keep their own narrow-screen layouts.

## Authoring side notes

Edit [passage notes](shared/passage-notes.json) by project and anchor. Papers uses passage IDs, Textbooks uses the `anchor` field in its [chapter source](projects/textbooks/course-site/chapters.js), and Stacks uses tags. Each record can have a `title`, prose in `body`, and a list in `points`. Use the same LaTeX delimiters as in the text and escape backslashes for JSON. The file contains a working example from each reader. Existing richer notes and demos also use the margin layout.

Whole-paper essays use the [authored commentary records](projects/papers/src/authored-commentaries.mjs). Their right-hand pane stays in view through the paper and has its own scrollbar.

To publish your own edition, fork the repository, edit the note records, and choose GitHub Actions as the Pages publishing source for the fork. [GitHub Pages setup](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

## Papers

A collection for mathematical literature across authors, periods, and subjects. Every catalogue entry is intended to become a complete on-site reading in modern English, with commentary, precise statements, proofs, margin drawings, and linked references. Current complete readings include Euler’s reciprocal series and prime-product paper, his complete circle chapter from the *Introductio*, Dedekind’s two foundational essays, and the prime-counting paper; the complete 1854 geometry lecture now includes all three parts and its closing synopsis. Gauss’s curved-surfaces paper is also available in full, with all 29 articles, geometric drawings, source comparisons, and six rigorous reconstructions. Source-only entries are explicitly labelled as awaiting a full reading. The [catalogue](https://liuyao12.github.io/math-expo/papers/) supports author, date, original-language, and keyword filters.

Each work is presented on its own mathematical terms. Connections between works appear where supported by actual citations or needed to explain a particular argument. [Editorial principles](projects/papers/EDITORIAL.md) keep reconstructions within the author’s intended cases and distinguish proofs, dependencies, conjectures, and outstanding gaps.

## Reimagined textbooks

New expositions of established mathematics. The current working text, *Linear Algebra — From Euclidean geometry to higher and even infinite-dimensional spaces*, develops linear algebra from Euclidean geometry toward inner product spaces of functions and Fourier approximation.

## Stacks Reader

A companion edition of the Stacks Project: longer continuous readings, original statements and expandable proofs, and one running example alongside the mathematics. The definition path collects the original sections used to define schemes and construct the structure sheaf. The wider reference collection includes supporting proofs and examples. A companion reading follows gluing with the Riemann sphere. [Source and editorial notes](projects/stacks/README.md).

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
