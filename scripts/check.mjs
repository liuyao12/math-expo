import { readFileSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
for (const project of ['papers', 'textbooks', 'stacks']) {
  const result = spawnSync(process.execPath, ['scripts/check.mjs'], { cwd: path.join(root, 'projects', project), stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
for (const file of ['index.html', 'papers/index.html', 'papers/riemann-1854/index.html', 'papers/riemann-1859/index.html', 'papers/euler-1740/index.html', 'papers/people/riemann/index.html', 'papers/concepts/function-1859/index.html', 'papers/catalog.json', 'textbooks/index.html', 'textbooks/assets/orthogonal-projection.gif']) {
  if (!existsSync(path.join(root, 'dist', file))) throw Error(`Missing published page or asset: ${file}`);
}
const home = readFileSync(path.join(root, 'dist/index.html'), 'utf8');
for (const target of ['papers/', 'textbooks/', 'stacks/']) if (!home.includes(`href="${target}"`)) throw Error(`Missing project link: ${target}`);
for (const file of ['stacks/index.html','stacks/read/gluing/index.html','stacks/about/index.html','stacks/license/index.html']) if (!existsSync(path.join(root, 'dist', file))) throw Error(`Missing Stacks reader page: ${file}`);
console.log('Validated the shared site and all three project routes.');
