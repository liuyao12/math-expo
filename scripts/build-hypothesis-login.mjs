import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

export const hypothesisLogin = '<span id="hypothesis-status" class="reader-login-status" role="status"></span><button id="open-hypothesis" class="reader-login" type="button" title="Open Hypothesis to log in">Log in</button>';

export function buildHypothesisLogin(destination) {
  const files = ['css', 'js'].map(extension => {
    const source = readFileSync(new URL('../shared/hypothesis-login.' + extension, import.meta.url));
    const version = createHash('sha256').update(source).digest('hex').slice(0, 12);
    const name = 'hypothesis-login-' + version + '.' + extension;
    writeFileSync(path.join(destination, name), source);
    return name;
  });
  const [css, js] = files;
  return (base = '') => `<link rel="stylesheet" href="${base}${css}"><script defer src="${base}${js}"></script>`;
}
