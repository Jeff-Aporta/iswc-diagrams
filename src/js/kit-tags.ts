// @contexto INDICE.md · skills/iswc-foundation/SKILL.md
/**
 * kit-tags.ts — REGISTRO ÚNICO de tags de la app (estándar iswc-foundation).
 *
 * iswc-diagrams es un PLUGIN de iswc-base: sus tags (`iswd-*`) los carga `iswcLoader.loadPlugin({ app: 'diagrams',
 * repo: 'Jeff-Aporta/iswc-diagrams', sha, prefijo: 'iswd-' })` leyendo `dist/cdn/plugin.json` (lo escribe `construirApp`).
 * Todo lo demás se deriva de aquí: el registrador (`iswdLoader.min.mjs`), el manifiesto del plugin, la galería de demos y
 * los guardianes. Un componente nuevo se declara UNA vez, en la lista que le toca:
 *
 *   KIT_TAGS   → tags `iswc-*` del kit que la galería pide al loader (solo padres registrables).
 *   SHELL_CRITICO → los de KIT_TAGS del primer pintado: su cierre se precarga desde el HTML (modulepreload).
 *   APP_TAGS   → componentes transversales → `dist/cdn/js/components/iswd/<tag>.min.mjs` (ninguno por ahora).
 *   VIEW_TAGS  → componentes de cada vista → `dist/cdn/view/<vista>/components/<tag>.min.mjs`:
 *                `vistas` (solo dibujan: reciben `payload`) y `editores` (dibujan y dejan editar).
 *
 * APP_TAGS y la unión de VIEW_TAGS son disjuntos: una vista no importa componentes de otra; lo
 * compartido (`src/js/diagrams/`: specs, layout, routing, temas) vive fuera de los componentes.
 */
export const KIT_TAGS = [
  'iswc-button',
  'iswc-callout',
  'iswc-card',
  'iswc-code',
  'iswc-dialog',
  'iswc-drawer',
  'iswc-icon',
  'iswc-split-panel',
  'iswc-tag',
  'iswc-theme-toggle',
  'iswc-toast',
] as const;

/**
 * Shell crítico: tags del kit que se ven en el primer pintado. El build lee su cierre de módulos en
 * `src/vendor/iswc-base/deps.json` (`tags[tag]`) y emite un `<link rel="modulepreload">` por ruta en cada HTML.
 */
export const SHELL_CRITICO = ['iswc-theme-toggle', 'iswc-toast'] as const satisfies readonly (typeof KIT_TAGS)[number][];

export const PREFIJO = 'iswd';

export const APP_TAGS = [] as const satisfies readonly `iswd-${string}`[];

export const VIEW_TAGS = {
  vistas: [
    'iswd-flowchart',
    'iswd-sequence-diagram',
    'iswd-diagram-lightbox',
    'iswd-class-diagram',
    'iswd-state-diagram',
    'iswd-er-diagram',
    'iswd-block-diagram',
    'iswd-component-diagram',
    'iswd-mindmap',
    'iswd-gantt',
    'iswd-timeline',
    'iswd-org-chart',
    'iswd-sankey-diagram',
    'iswd-quadrant-chart',
    'iswd-venn-diagram',
    'iswd-use-case-diagram',
    'iswd-swimlane-diagram',
    'iswd-journey-map',
  ],
  editores: [
    'iswd-er-editor',
  ],
} as const satisfies Record<string, readonly `iswd-${string}`[]>;

export type AppTag = (typeof APP_TAGS)[number] | (typeof VIEW_TAGS)[keyof typeof VIEW_TAGS][number];
export type Vista = keyof typeof VIEW_TAGS;

/** Carpeta publicada (relativa a `dist/cdn/`) de un componente propio; `null` si no es de la app. */
export function rutaComponente(tag: string): string | null {
  if ((APP_TAGS as readonly string[]).includes(tag)) return `js/components/${PREFIJO}/`;
  for (const [vista, tags] of Object.entries(VIEW_TAGS)) {
    if ((tags as readonly string[]).includes(tag)) return `view/${vista}/components/`;
  }
  return null;
}

/** tag → ruta del módulo relativa a `dist/cdn/` (exige el prefijo de la app). */
export function mapaRutas(): Record<string, string> {
  const mapa: Record<string, string> = {};
  for (const tag of [...APP_TAGS, ...Object.values(VIEW_TAGS).flat()]) {
    if (!tag.startsWith(`${PREFIJO}-`)) throw new Error(`kit-tags: ${tag} no lleva el prefijo ${PREFIJO}-`);
    mapa[tag] = `${rutaComponente(tag)}${tag}.js`;
  }
  return mapa;
}

/** Tags que la galería pide al arrancar (transversales + todas las vistas). */
export const tagsArranque = (): string[] => [...APP_TAGS, ...Object.values(VIEW_TAGS).flat()];
