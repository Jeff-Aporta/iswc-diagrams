// @contexto INDICE.md · skills/iswc-foundation/SKILL.md
// vendor-scss.mjs — trae del kit, AL PIN de deno.json, los parciales SCSS que usan los componentes (`@use 'kit'`,
// `@use 'diagram-kit'`) a `.cache/iswc-base/scss/` (gitignored: se regenera, no se versiona). Consumo por CDN con SHA (jsDelivr), nunca rutas locales entre repos.
// `deno task vendor:scss` (lo mueve `deno task pin` junto con el resto del vendor).
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const RAIZ = join(import.meta.dirname, '..', '..');
const deno = JSON.parse(readFileSync(join(RAIZ, 'deno.json'), 'utf8'));
const m = String(deno.imports?.['@jeff-aporta/iswc-base/'] ?? '').match(/gh\/([^/]+\/[^@/]+)@([0-9a-f]{40})\//);
if (!m) throw new Error('vendor-scss: deno.json no trae el alias @jeff-aporta/iswc-base/ con repo@sha40');
const [, repo, sha] = m;
// origen en el kit → destino bajo .cache/iswc-base/scss/
const ARCHIVOS = {
  'src/styles/_kit.scss': '_kit.scss',
  'src/styles/kit/_familias.scss': 'kit/_familias.scss',
  'src/styles/kit/_funciones.scss': 'kit/_funciones.scss',
  'src/styles/kit/_mixins.scss': 'kit/_mixins.scss',
  'src/core/diagram-kit.scss': 'diagram-kit.scss',
};
const sello = new Date().toISOString();
for (const [origen, destino] of Object.entries(ARCHIVOS)) {
  const url = `https://cdn.jsdelivr.net/gh/${repo}@${sha}/${origen}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`vendor-scss: ${r.status} ${url}`);
  const salida = join(RAIZ, '.cache', 'iswc-base', 'scss', destino);
  mkdirSync(dirname(salida), { recursive: true });
  writeFileSync(salida, `// @vendor ${sello} ${repo}@${sha} ${origen}\n${await r.text()}`);
}
console.log(`[vendor:scss] ${Object.keys(ARCHIVOS).length} parciales <- ${repo}@${sha.slice(0, 12)}`);
