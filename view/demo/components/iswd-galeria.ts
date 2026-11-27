// @contexto INDICE.md · skills/iswc-foundation/SKILL.md
/**
 * Galería de componentes `iswd-*` (estándar iswc-foundation).
 *
 * Lee `view/demo/manifest.json` ({tag, file} → definición `iswc-preview/v1`), VALIDA cada definición
 * con Zod (lo que no cumple se avisa y no se muestra), pinta el índice y monta la elegida en
 * `<iswc-preview-component>` del kit. Por cada bloque `demo`:
 *   - `props` del JSON se asignan a `target.props` al montar;
 *   - `controls` se pintan con `<iswc-preview-controls>`; `attr:x` escribe el atributo, `prop:x` la
 *     propiedad JS y `props:x` mezcla `{ x }` en `.props` (componentes con props).
 * Un componente nuevo entra a la galería solo con su línea en `manifest.json`.
 */
import { KIT_TAGS, tagsArranque } from '../../../src/js/kit-tags.js';
import {
  type ConProps, type ControlDemo, type DefinicionDemo, DefinicionDemoSchema, type LoaderGaleria, ManifestDemoSchema,
} from '../../../src/js/consts/schemas/demo.schemas.js';

const L = (globalThis as { iswcLoader?: LoaderGaleria }).iswcLoader;
if (!L) throw new Error('galería: falta iswcLoader');
const cdn = new URL('../', L.selfBase).href; // …/dist/cdn/ del kit
await Promise.all([
  L.load('iswc-preview-controls', 'iswc-callout', ...KIT_TAGS, ...tagsArranque()),
  import(new URL('preview/preview-component.min.mjs', cdn).href),
  import(new URL('preview/preview-controls.min.mjs', cdn).href),
]);

function aplicar(host: Element, c: ControlDemo, valor: unknown): void {
  const [modo, nombre] = c.prop.includes(':') ? (c.prop.split(':', 2) as [string, string]) : ['attr', c.prop];
  if (modo === 'props') (host as ConProps).props = { [nombre]: c.control === 'number' ? Number(valor) : valor };
  else if (modo === 'prop') Reflect.set(host, nombre, valor);
  else if (valor === false || valor == null || valor === '') host.removeAttribute(nombre);
  else host.setAttribute(nombre, valor === true ? '' : String(valor));
}

function montarBloques(def: DefinicionDemo, main: ParentNode): void {
  for (const seccion of def.sections) {
    const caja = main.querySelector<HTMLElement>(`#${CSS.escape(seccion.id)}`);
    if (!caja) continue;
    const demos = [...caja.querySelectorAll<HTMLElement>('.demo-block')];
    let n = 0;
    for (const b of seccion.blocks) {
      if (b.kind && b.kind !== 'demo') continue;
      const zona = demos[n++] ?? caja;
      const host = b.target ? zona.querySelector(b.target) : null;
      if (!host) continue;
      if (b.props) (host as ConProps).props = { ...b.props };
      if (!b.controls?.length) continue;
      const panel = document.createElement('iswc-preview-controls') as HTMLElement & { spec: unknown[] };
      panel.setAttribute('label', 'Controles');
      panel.spec = b.controls.map((c) => ({ ...c, value: c.default ?? null }));
      panel.addEventListener('iswc-controls-change', (e) => {
        const d = (e as CustomEvent<{ def: ControlDemo; valor: unknown }>).detail;
        if (d?.def) aplicar(host, d.def, d.valor);
      });
      zona.append(panel);
    }
  }
}

const base = new URL('./', location.href); // view/demo/
// `?v=` de este módulo (lo escribe el build): sirve de buster para el manifiesto; cada ficha trae el suyo dentro.
const vModulo = new URL(import.meta.url).searchParams.get('v');
const urlManifiesto = new URL('manifest.json', base);
if (vModulo) urlManifiesto.searchParams.set('v', vModulo);
const indice = ManifestDemoSchema.parse(await fetch(urlManifiesto).then((r) => r.json()));
const defs: DefinicionDemo[] = [];
for (const item of indice) {
  const r = DefinicionDemoSchema.safeParse(await fetch(new URL(item.file, base)).then((x) => x.json()));
  if (r.success) defs.push(r.data);
  else console.warn(`[galería] ${item.file} no cumple iswc-preview/v1:`, r.error.issues);
}

const nav = document.getElementById('nav')!;
const split = document.getElementById('split') as HTMLElement & { collapse?: string | null };
const drawer = document.getElementById('drawer') as HTMLElement & { open?: boolean };
const preview = document.getElementById('preview') as HTMLElement & { preview?: unknown };

function elegir(def: DefinicionDemo): void {
  for (const b of nav.querySelectorAll('iswc-button')) b.toggleAttribute('aria-current', b.getAttribute('data-tag') === def.tag);
  preview.preview = { definition: def, mount: (ctx: { main?: ParentNode }) => ctx.main && montarBloques(def, ctx.main) };
  history.replaceState(null, '', `#${def.tag}`);
  if (movil.matches) drawer.open = false;
}

// sm/xs: el panel izquierdo pasa a drawer (el menú de la barra lo abre); en escritorio es un panel redimensionable.
const movil = matchMedia('(max-width: 48em)');
function acomodarNav(): void {
  if (movil.matches) {
    split.collapse = 'start';
    drawer.append(nav);
  } else {
    drawer.open = false;
    nav.setAttribute('slot', 'start');
    split.collapse = null;
    split.prepend(nav);
  }
}
movil.addEventListener('change', acomodarNav);
document.getElementById('menu')!.addEventListener('iswc-click', () => { drawer.open = true; });

for (const def of defs) {
  const b = document.createElement('iswc-button');
  b.setAttribute('variant', 'plain');
  b.setAttribute('data-tag', def.tag);
  b.textContent = def.navTitle;
  b.addEventListener('iswc-click', () => elegir(def));
  nav.append(b);
}
acomodarNav();
const inicial = defs.find((d) => `#${d.tag}` === location.hash) ?? defs[0];
if (inicial) elegir(inicial);
document.documentElement.setAttribute('data-app-ready', '');
