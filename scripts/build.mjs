import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { buildHypothesisLogin, hypothesisLogin } from './build-hypothesis-login.mjs';
const root = fileURLToPath(new URL('../', import.meta.url));
const destination = path.join(root, 'dist');
rmSync(destination, { recursive: true, force: true });
mkdirSync(destination, { recursive: true });
for (const project of ['papers', 'textbooks', 'stacks']) {
  const directory = path.join(root, 'projects', project);
  const result = spawnSync(process.execPath, ['scripts/build.mjs'], { cwd: directory, stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
  cpSync(path.join(directory, 'dist'), path.join(destination, project), { recursive: true });
}
const hypothesisAssets = buildHypothesisLogin(destination);
const hub = readFileSync(path.join(root, 'hub/index.html'), 'utf8')
  .replace('</head>', hypothesisAssets() + '</head>')
  .replace('</header>', hypothesisLogin + '</header>');
writeFileSync(path.join(destination, 'index.html'), hub);
writeFileSync(path.join(destination, '.nojekyll'), '');
console.log('Built Math Expo: /papers/, /textbooks/, and /stacks/.');
