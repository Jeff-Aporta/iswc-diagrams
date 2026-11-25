// @contexto INDICE.md · skills/iswc-foundation/SKILL.md
/**
 * build.ts — `deno task build` (después de `build:scss`): el conversor del kit `construirApp`, al MISMO SHA que el pin
 * (`deno task pin` mueve esta URL con el resto). `src/js/**` y `view/**` → `dist/cdn/*.min.mjs` con splitting, `boot.ts`
 * en IIFE, `?v=`, `deps.json`, registrador `iswdLoader.min.mjs`, el manifiesto de plugin `plugin.json` (contrato
 * `iswc-plugin/v1` de `iswcLoader.loadPlugin`) y el bloque `iswc:precarga` de cada HTML.
 * Guía: skills/iswc-foundation/references/02-deno-y-build.md del kit.
 */
import { cpSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { stop } from 'esbuild';
import { construirApp, vigilarApp } from 'https://cdn.jsdelivr.net/gh/Jeff-Aporta/is-webcomponents@2a651e44bbd1316b96942f14f26ff1c6175ac2c8/dist/cdn/build/construir-app.ts';
import { KIT_TAGS, mapaRutas, PREFIJO } from '../js/kit-tags.ts';

const fuente = (rel: string) => (rel.startsWith('js/') ? `src/${rel}` : rel).replace(/\.js$/, '.ts');
const raiz = join(import.meta.dirname!, '..', '..');
const opts = {
  raiz,
  prefijo: PREFIJO,
  planos: ['src/js/boot.ts'],
  tags: Object.fromEntries(Object.entries(mapaRutas()).map(([t, r]) => [t, fuente(r)])),
  html: [
    { archivo: 'view/demo/index.html', kit: [...KIT_TAGS], app: ['view/demo/components/iswd-galeria.ts'] },
    // Páginas «visor» y «editor» de diagramas por enlace (?kind=&json=): su cierre es el del estudio.
    { archivo: 'view/estudio/view.html', kit: ['iswc-button', 'iswc-icon', 'iswc-theme-toggle'], app: ['src/js/diagrams/utils/diagram-studio.ts'] },
    { archivo: 'view/estudio/edit.html', kit: ['iswc-button', 'iswc-icon', 'iswc-theme-toggle'], app: ['src/js/diagrams/utils/diagram-studio.ts'] },
  ],
  plugin: { app: 'diagrams', repo: 'Jeff-Aporta/iswc-diagrams', titulo: 'Diagramas ISWC' },
};

/**
 * Recursos que `construirApp` no empaqueta: los temas JSON, junto a su módulo (`diagram-styles`), y la ficha
 * `iswc-preview/v1` de cada componente junto a su módulo (el estudio toma de ahí el ejemplo de cada diagrama).
 */
function recursos(): void {
  cpSync(join(raiz, 'src/js/diagrams/utils/themes'), join(raiz, 'dist/cdn/js/diagrams/utils/themes'), { recursive: true });
  for (const carpeta of ['vistas', 'editores']) {
    const origen = join(raiz, 'view', carpeta, 'components');
    if (!existsSync(origen)) continue;
    for (const f of readdirSync(origen).filter((n) => n.endsWith('.json'))) cpSync(join(origen, f), join(raiz, 'dist/cdn/view', carpeta, 'components', f));
  }
}

await construirApp(opts);
recursos();
if (Deno.args.includes('--watch')) {
  await vigilarApp(opts, async () => {
    const r = await new Deno.Command(Deno.execPath(), { args: ['task', 'build:scss'], cwd: raiz }).output();
    recursos();
    return r;
  });
} else await stop();
