# Papers

A growing collection of mathematical papers, carefully typeset with modern commentary, worked details, and geometric drawings in the margins.

The first reading is a sample from Bernhard Riemann’s geometry lecture: the complete introduction and part II, §1 in William Kingdon Clifford’s historical English translation. The edition links to the handwritten manuscript at Göttingen, an original printed facsimile at ETH Zürich, and the full English translation at Trinity College Dublin.

## Develop

Requires Node.js 24. There are no package dependencies to install.

```sh
npm run build
npm run check
python3 -m http.server 8000 --directory dist
```

The collection is generated as static HTML in `dist/`. All links are relative, so the collection works under a GitHub Pages project path. The Riemann reader is at `riemann-1854/`.

- `src/riemann.mjs`: historical passages and modern commentary.
- `src/figures.mjs`: geometric drawings.
- `public/`: styles, reader interactions, and vendored math assets.
- `scripts/build.mjs`: generates the collection and paper pages.
- `scripts/check.mjs`: checks LaTeX expressions, links, resources, and JavaScript syntax.

## Publish

This project belongs to the shared [Math Expo repository](https://github.com/liuyao12/math-expo). Its root workflow builds and publishes both the paper collection and the textbook project on pushes to `main`. The published collection is at [Math Expo / Papers](https://liuyao12.github.io/math-expo/papers/).

## Sources and third-party assets

Historical wording is distinguished from modern editorial commentary. Each reading includes its own sources and editorial notes. Mathematical notation is written in LaTeX and rendered with local KaTeX assets. The accompanying Computer Modern fonts are loaded locally as well. KaTeX’s license is retained in `public/vendor/katex/LICENSE`.

## Paper URLs

Use lowercase `author-year/` identifiers, such as `riemann-1854/`. The year refers to the original work: the delivery year for a lecture, or the initial publication year for a paper. It does not refer to the translation or this reading edition. If multiple works have the same author and year, add a short title to distinguish them, such as `author-year-short-title/`. Keep established identifiers stable.

