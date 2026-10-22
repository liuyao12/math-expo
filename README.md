# Math Expo

Two independent mathematics projects in one repository.

| Project | Source | Website |
| --- | --- | --- |
| Papers | `projects/papers/` | [Read the papers](https://liuyao12.github.io/math-expo/papers/) |
| Reimagined textbooks | `projects/textbooks/` | [Read the textbook](https://liuyao12.github.io/math-expo/textbooks/) |

The [Math Expo homepage](https://liuyao12.github.io/math-expo/) links to both projects. They share a repository and deployment but retain their own source, design, build scripts, and checks.

## Papers

Mathematical papers in modern English, with commentary, precise statements and proofs, and margin drawings. The [1859 prime-counting paper](https://liuyao12.github.io/math-expo/papers/riemann-1859/) is the first complete reading; the [geometry lecture](https://liuyao12.github.io/math-expo/papers/riemann-1854/) remains a selected reading sample. Both use author-year URLs and link original sources and existing translations. The collection connects work records, author bibliographies, paper-specific mathematical objects, and verified references and citing works. [Editorial principles](projects/papers/EDITORIAL.md) keep reconstructions within the author's intended cases and distinguish proofs, dependencies, conjectures, and outstanding gaps.

## Reimagined textbooks

New expositions of established mathematics. The current working text, *Linear Algebra — From Euclidean geometry to higher and even infinite-dimensional spaces*, develops linear algebra from Euclidean geometry toward inner product spaces of functions and Fourier approximation.

## Build and validate

Requires Node.js 24. No dependency installation is needed; the math renderer and fonts are vendored.

```sh
npm run build
npm run check
python3 -m http.server 8000 --directory dist
```

The root build assembles both projects into `dist/papers/` and `dist/textbooks/`, with a shared homepage in `dist/index.html`. All links and asset paths support GitHub Pages’ `/math-expo/` prefix.

Each project can also be built independently:

```sh
npm run build:papers
npm run build:textbooks
```

The workflow in `.github/workflows/pages.yml` builds, checks, and publishes both projects to GitHub Pages on pushes to `main`. Mathematical notation uses LaTeX, typeset with KaTeX. Third-party licenses are retained with the vendored assets.
