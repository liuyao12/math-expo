"""Download a pinned, self-hosted KaTeX distribution and its font files."""
from pathlib import Path
import re
import subprocess
from concurrent.futures import ThreadPoolExecutor

destination = Path(__file__).resolve().parents[1] / 'course-site' / 'vendor' / 'katex'
destination.mkdir(parents=True, exist_ok=True)
base = 'https://cdn.jsdelivr.net/npm/katex@0.16.11/'
def download(source, target):
    if target.exists() and target.stat().st_size:
        return
    subprocess.run(['curl', '-fsSL', '--retry', '3', '--max-time', '45',
                    base + source, '-o', str(target)], check=True)

for source, target in [('dist/katex.min.js', 'katex.min.js'),
                       ('dist/contrib/auto-render.min.js', 'auto-render.min.js'),
                       ('dist/katex.min.css', 'katex.min.css'), ('LICENSE', 'LICENSE')]:
    download(source, destination / target)
css = (destination / 'katex.min.css').read_text()
fonts = sorted(set(re.findall(r'fonts/[^)]+', css)))
(destination / 'fonts').mkdir(exist_ok=True)
with ThreadPoolExecutor(max_workers=4) as pool:
    list(pool.map(lambda font: download('dist/' + font, destination / font), fonts))
print(f'Vendored KaTeX 0.16.11 with {len(fonts)} font files')
