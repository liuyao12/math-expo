import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

export function buildAnchoredMargins(destination, { stylesheet = true } = {}) {
  const assets = {};
  for (const extension of stylesheet ? ['js', 'css'] : ['js']) {
    const source = readFileSync(new URL('../shared/anchored-margins.' + extension, import.meta.url));
    const version = createHash('sha256').update(source).digest('hex').slice(0, 12);
    const name = 'anchored-margins-' + version + '.' + extension;
    writeFileSync(path.join(destination, name), source);
    assets[extension] = name;
  }
  return assets;
}
