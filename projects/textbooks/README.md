# Linear Algebra

*From Euclidean geometry to higher and even infinite-dimensional spaces.*

A draft linear algebra textbook that begins with Euclidean geometry in three and higher dimensions, then develops inner product spaces through functions and Fourier approximation.

The website sources are in `course-site/`. Chapter sketches and essential definitions are in `course-site/chapters.js`; the reader and interactive figures are in `course-site/app.js`. All mathematical notation uses LaTeX and is typeset by the vendored KaTeX renderer.

Run `npm run check` to validate the chapter mathematics, then `npm run build` to produce the static website in `dist/`. To preview, serve that directory with `python3 -m http.server 8000 --directory dist --bind 127.0.0.1`.

The projection animation and its static companion are in `assets/`. Regenerate them with `python3 scripts/render_projection.py` in a Python environment with Pillow. The static image is used when the animation is paused or reduced motion is preferred.

This independent textbook project is part of the shared [Math Expo repository](https://github.com/liuyao12/math-expo). Its root GitHub Actions workflow publishes the text at [Math Expo / Textbooks](https://liuyao12.github.io/math-expo/textbooks/). General vector spaces, groups, and finite geometries are planned later chapters.

The hat–turtle example uses a fixed fourteen-vertex lift from the existing geometric-tree-search project. `course-site/hat-turtle.js` contains its coordinates and projection. The original lift is due to Nan Ma and Arnaud Chéritat; the retained hatviz license is in `course-site/vendor/hatviz/LICENSE`. Checks verify the lift has rank four and that its projected edge lengths agree with the viewing matrix.
