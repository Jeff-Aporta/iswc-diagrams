// @contexto INDICE.md · skills/iswc-foundation/SKILL.md
/**
 * build.ts — `deno task build` (después de `build:scss`): el conversor del kit `construirApp`, al MISMO SHA que el pin
 * (`deno task pin` mueve esta URL con el resto). `src/js/**` y `view/**` → `dist/cdn/*.min.mjs` con splitting, `boot.ts`
 * en IIFE, `?v=`, `deps.json`, registrador `iswdLoader.min.mjs`, el manifiesto de plugin `plugin.json` (contrato
 * `iswc-plugin/v1` de `iswcLoader.loadPlugin`) y el bloque `iswc:precarga` de cada HTML.
 * Guía: skills/iswc-foundation/references/02-deno-y-build.md del kit.
 */
import { cpSync, existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
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

/**
 * Convención del kit «con `?v=` si el origen es mutable»: cada `file` de `view/demo/manifest.json` lleva el hash corto de su
 * contenido, así un JSON de vista cambiado nunca se sirve desde la caché del navegador. La galería suma el `?v=` del
 * propio módulo al pedir el manifiesto.
 */
function sellarManifiesto(): void {
  const ruta = join(raiz, 'view/demo/manifest.json');
  const lista = JSON.parse(readFileSync(ruta, 'utf8')) as { tag: string; file: string }[];
  for (const item of lista) {
    const limpio = item.file.replace(/\?v=.*$/, '');
    const hash = createHash('sha1').update(readFileSync(join(raiz, 'view/demo', limpio))).digest('hex').slice(0, 8);
    item.file = `${limpio}?v=${hash}`;
  }
  writeFileSync(ruta, JSON.stringify(lista, null, 2) + '\n');
}

/**
 * Modulos ES (`.mjs`) de una carpeta, recursivo.
 */
function modulosDe(dir: string): string[] {
  const out: string[] = [];
  const caminar = (d: string) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, e.name);
      if (e.isDirectory()) caminar(p);
      else if (e.name.endsWith('.mjs')) out.push(p);
    }
  };
  if (existsSync(dir)) caminar(dir);
  return out;
}

/**
 * `zod` por URL absoluta en los modulos construidos.
 *
 * El navegador NO resuelve el specifier desnudo `zod`: lo resuelve el import map de la pagina que carga el modulo.
 * El render del kit (`render-diagram.ts`) arma su pagina host SIN import map, asi que un bundle con
 * `import ... from "zod"` no carga ("Failed to resolve module specifier 'zod'"). Se apunta al MISMO archivo del kit
 * que usa el import map de las paginas de la app (`lib/zod.min.mjs` al pin): la misma libreria, por URL absoluta
 * (resoluble con o sin mapa).
 */
function zodPorUrlAbsoluta(): void {
  const cfg = JSON.parse(readFileSync(join(raiz, 'deno.json'), 'utf8')) as { imports: Record<string, string> };
  const kit = cfg.imports['@jeff-aporta/iswc-base/'];
  if (!kit) throw new Error('build: deno.json no mapea @jeff-aporta/iswc-base/');
  const url = `${kit}lib/zod.min.mjs`;
  let n = 0;
  for (const modulo of modulosDe(join(raiz, 'dist/cdn'))) {
    const antes = readFileSync(modulo, 'utf8');
    const despues = antes.replace(/(\bfrom|\bimport)(["'])zod\2/g, `$1$2${url}$2`);
    if (despues === antes) continue;
    writeFileSync(modulo, despues);
    n++;
  }
  if (n) console.log(`[build] zod por URL absoluta en ${n} modulos (${url})`);
}

sellarManifiesto();
await construirApp(opts);
recursos();
zodPorUrlAbsoluta();
if (Deno.args.includes('--watch')) {
  await vigilarApp(opts, async () => {
    const r = await new Deno.Command(Deno.execPath(), { args: ['task', 'build:scss'], cwd: raiz }).output();
    recursos();
    zodPorUrlAbsoluta();
    return r;
  });
} else await stop();
