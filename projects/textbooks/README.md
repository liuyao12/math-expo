# Linear Algebra

*From Euclidean geometry to higher and even infinite-dimensional spaces.*

A draft linear algebra textbook that begins with Euclidean geometry in three and higher dimensions, then develops inner product spaces through functions and Fourier approximation.

The website sources are in `course-site/`. Chapter sketches and essential definitions are in `course-site/chapters.js`; the reader and interactive figures are in `course-site/app.js`. All mathematical notation uses LaTeX and is typeset by the vendored KaTeX renderer.

Run `npm run check` to validate the chapter mathematics, then `npm run build` to produce the static website in `dist/`. To preview, serve that directory with `python3 -m http.server 8000 --directory dist --bind 127.0.0.1`.

The projection animation and its static companion are in `assets/`. Regenerate them with `python3 scripts/render_projection.py` in a Python environment with Pillow. The static image is used when the animation is paused or reduced motion is preferred.

This independent textbook project is part of the shared [Math Expo repository](https://github.com/liuyao12/math-expo). Its root GitHub Actions workflow publishes the text at [Math Expo / Textbooks](https://liuyao12.github.io/math-expo/textbooks/). General vector spaces, groups, and finite geometries are planned later chapters.

The hat–turtle example uses a fixed fourteen-vertex lift from the existing geometric-tree-search project. `course-site/hat-turtle.js` contains its coordinates and projection. The original lift is due to Nan Ma and Arnaud Chéritat; the retained hatviz license is in `course-site/vendor/hatviz/LICENSE`. Checks verify the lift has rank four and that its projected edge lengths agree with the viewing matrix.

The opening uses the convex regular polytope classification to motivate geometry in four dimensions. The `higher-geometry.js` figures compare regular polytope shadows and ball/cube volumes. Lattices introduce the hat–turtle construction after the Gram matrix.

Each reader page has a persistent row/column-matrix toggle. The vector \(v\), its coordinate list \(x=v.c\), and its one-row matrix \([x]\) are distinct. Literal lists always stay fixed; the toggle transposes only matrix representations and reverses the factor order of compositions. Both modes use ordinary multiplication and row-first indexing. Inline matrices remain nested lists even when they have a single row. Gram and projection equations use named matrices \(X,Y,C,D\); scalar pairings are explicitly enclosed as \(1\times1\) matrices. Checks cover dimensions, mixed Gram pairings, basis changes, projection residuals, scalar extraction, and the live tile matrix. Stable per-entry tags animate rectangular and square transposes.

The lattice chapter’s `tile-lattice-demo.js` animates the viewing angle, displays the live projection matrix, and plots a finite sample of the rank-four lattice. Dot opacity uses the two perpendicular coordinates; a movable round window makes depth visible, with the starting radius enclosing every tile vertex. The full projected lattice is discrete when the tangent of the viewing angle divided by the square root of three is rational, and dense otherwise. A separate interior rational preset makes clear that hat and turtle are not the only discrete views. This is a lattice-window illustration, not a generated hat tiling.


Editorial convention: abstract functions evaluate on the right, \(v.L.K\), with \(v.(LK)=(v.L).K\). Coordinate maps are named functions rather than basis subscripts. The left superscript \({}^{g}\!f=g\,f\,\rho(g)^{-1}\) is reserved for a later induced group action; group-action material remains deferred.
