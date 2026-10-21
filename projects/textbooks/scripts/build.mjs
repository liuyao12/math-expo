import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const destination = path.join(root, 'dist');
rmSync(destination, { recursive: true, force: true });
mkdirSync(destination, { recursive: true });
for (const file of readdirSync(path.join(root, 'course-site'))) {
  if (file !== 'dist') cpSync(path.join(root, 'course-site', file), path.join(destination, file), { recursive: true });
}
mkdirSync(path.join(destination, 'assets'), { recursive: true });
for (const name of ['orthogonal-projection.gif', 'orthogonal-projection-still.png']) {
  const source = path.join(root, 'assets', name);
  if (!existsSync(source)) throw new Error(`Missing projection asset: ${name}`);
  cpSync(source, path.join(destination, 'assets', name));
}
console.log('Built the textbook reader in dist/');
