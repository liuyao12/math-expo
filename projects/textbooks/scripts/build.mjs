import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { buildAnchoredMargins } from '../../../scripts/build-anchored-margins.mjs';
import { buildHypothesisLogin, hypothesisLogin } from '../../../scripts/build-hypothesis-login.mjs';
import passageNotes from '../../../shared/passage-notes.json' with { type: 'json' };
const root = fileURLToPath(new URL('../', import.meta.url));
const destination = path.join(root, 'dist');
rmSync(destination, { recursive: true, force: true });
mkdirSync(destination, { recursive: true });
for (const file of readdirSync(path.join(root, 'course-site'))) {
  if (file !== 'dist') cpSync(path.join(root, 'course-site', file), path.join(destination, file), { recursive: true });
}
const marginAssets = buildAnchoredMargins(destination);
const hypothesisAssets = buildHypothesisLogin(destination);
const chaptersPath = path.join(destination, 'chapters.js');
writeFileSync(chaptersPath, readFileSync(chaptersPath, 'utf8')
  + '\nwindow.COURSE.passageNotes = ' + JSON.stringify(passageNotes.textbooks) + ';\n');
const indexPath = path.join(destination, 'index.html');
let index = readFileSync(indexPath, 'utf8')
  .replace('anchored-margins.js', marginAssets.js)
  .replace('anchored-margins.css', marginAssets.css)
  .replace('</head>', hypothesisAssets() + '</head>')
  .replace('</header>', hypothesisLogin + '</header>');
for (const asset of ['app.js', 'chapters.js']) {
  const version = createHash('sha256').update(readFileSync(path.join(destination, asset))).digest('hex').slice(0, 12);
  index = index.replace(`src="${asset}"`, `src="${asset}?v=${version}"`);
}
writeFileSync(indexPath, index);
mkdirSync(path.join(destination, 'assets'), { recursive: true });
for (const name of ['orthogonal-projection.gif', 'orthogonal-projection-still.png', 'function-inner-product.gif', 'function-inner-product-still.png', 'tangent-area.gif', 'tangent-area-still.png']) {
  const source = path.join(root, 'assets', name);
  if (!existsSync(source)) throw new Error(`Missing textbook asset: ${name}`);
  cpSync(source, path.join(destination, 'assets', name));
}
console.log('Built the textbook reader in dist/');
