import { readFileSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
for (const project of ['classical-papers', 'textbooks']) {
  const result = spawnSync(process.execPath, ['scripts/check.mjs'], { cwd: path.join(root, 'projects', project), stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
for (const file of ['index.html', 'classical-papers/index.html', 'classical-papers/riemann/index.html', 'textbooks/index.html', 'textbooks/assets/orthogonal-projection.gif']) {
  if (!existsSync(path.join(root, 'dist', file))) throw Error(`Missing published page or asset: ${file}`);
}
const home = readFileSync(path.join(root, 'dist/index.html'), 'utf8');
for (const target of ['classical-papers/', 'textbooks/']) if (!home.includes(`href="${target}"`)) throw Error(`Missing project link: ${target}`);
console.log('Validated the shared site and both project routes.');
