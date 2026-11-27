// @contexto INDICE.md · skills/iswc-foundation/SKILL.md
/**
 * import-map.ts — el import map que necesita la página host de un render: los componentes `iswd-*` importan el kit por
 * alias (`@jeff-aporta/iswc-base/…`) y `zod`, y la página de prueba no tiene el import map de la app. Sale del pin de
 * `deno.json` (un solo SHA): nunca una ruta local al kit.
 */
const deno = JSON.parse(Deno.readTextFileSync(new URL('../../deno.json', import.meta.url))) as { imports: Record<string, string> };
const KIT = deno.imports['@jeff-aporta/iswc-base/']!;

export const IMPORT_MAP_HOST: Record<string, string> = {
  '@jeff-aporta/iswc-base/': KIT,
  zod: `${KIT}lib/zod.min.mjs`,
};
