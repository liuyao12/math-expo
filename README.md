# Math Expo

Two independent mathematics projects in one repository.

| Project | Source | Website |
| --- | --- | --- |
| Classical papers | `projects/classical-papers/` | [Read the papers](https://liuyao12.github.io/math-expo/classical-papers/) |
| Reimagined textbooks | `projects/textbooks/` | [Read the textbook](https://liuyao12.github.io/math-expo/textbooks/) |

The [Math Expo homepage](https://liuyao12.github.io/math-expo/) links to both projects. They share a repository and deployment but retain their own source, design, build scripts, and checks.

## Classical papers

Historical mathematical papers with modern commentary, worked details, and margin drawings. The first sample is Riemann’s geometry lecture, including the introduction and line-element passage, with links to the manuscript, printed facsimile, and historical English translation. The [Riemann reader](https://liuyao12.github.io/math-expo/classical-papers/riemann-1854/) uses the collection’s author-year URL convention.

## Reimagined textbooks

New expositions of established mathematics. The current working text, *Geometry becomes algebra*, develops linear algebra from Euclidean geometry toward inner product spaces of functions and Fourier approximation.

## Build and validate

Requires Node.js 24. No dependency installation is needed; the math renderer and fonts are vendored.

```sh
npm run build
npm run check
python3 -m http.server 8000 --directory dist
```

The root build assembles both projects into `dist/classical-papers/` and `dist/textbooks/`, with a shared homepage in `dist/index.html`. All links and asset paths support GitHub Pages’ `/math-expo/` prefix.

Each project can also be built independently:

```sh
npm run build:papers
npm run build:textbooks
```

The workflow in `.github/workflows/pages.yml` builds, checks, and publishes both projects to GitHub Pages on pushes to `main`. Mathematical notation uses LaTeX, typeset with KaTeX. Third-party licenses are retained with the vendored assets.
