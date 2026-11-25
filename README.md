# ISWC Diagrams (`iswd-*`)

Diagramas de web components (vanilla, sin framework) para el ecosistema ISWC: flujo, secuencia, clases, estados, ER,
componentes, bloques, Gantt, línea de tiempo, mapa mental, org chart, Sankey, cuadrantes, Venn, casos de uso, carriles
y mapa de recorrido. Es un **plugin** del kit [iswc-base](https://github.com/Jeff-Aporta/is-webcomponents): vive en su
propio repo, con su prefijo (`iswd-`), y el kit lo carga con `iswcLoader.loadPlugin`.

## Usarlo desde otra app (o desde iswc-base)

```js
import { iswcLoader as L } from 'https://cdn.jsdelivr.net/gh/Jeff-Aporta/is-webcomponents@<sha-del-kit>/dist/cdn/core/loader.min.mjs';

await L.loadPlugin({
  app: 'diagrams',
  repo: 'Jeff-Aporta/iswc-diagrams',
  sha: '<commit de 40 hex de este repo>',   // pin obligatorio (nunca main ni rutas locales)
  prefijo: 'iswd-',
  tags: ['iswd-flowchart'],                 // opcional; sin él solo se registran y el autoloader los pide al verlos
});
// <iswd-flowchart><script type="application/json">{ "flowchart": { … } }</script></iswd-flowchart>
```

El contrato (`iswc-plugin/v1`) es `dist/cdn/plugin.json`, que escribe el build (`construirApp({ plugin })`). Detalle en
`src/cdn/loader.md` del kit.

## Qué hay

| Carpeta | Contenido |
| --- | --- |
| `view/vistas/` | los componentes que **solo dibujan** (reciben `payload` o JSON en el light DOM): 17 diagramas y el visor `iswd-diagram-lightbox` |
| `view/editores/` | los que además **dejan editar**: `iswd-er-editor` |
| `view/estudio/` | fichas de las páginas «visor» y «editor» de diagramas por enlace (`diagram-studio`) |
| `view/demo/` | la galería (playground por componente, `manifest.json`) |
| `src/js/diagrams/utils/` | specs, layout, routing, temas y utilidades que comparten los componentes |
| `src/js/consts/schemas/` | los contratos Zod de cada diagrama |
| `src/vendor/iswc-base/` | herramientas, grafo y parciales SCSS del kit, **al pin de `deno.json`** (vendor por CDN con SHA) |
| `dist/cdn/` | lo publicado (se commitea): módulos `.min.mjs`, `plugin.json`, registrador `iswdLoader.min.mjs` |

Los componentes del kit que usa (`iswc-lightbox`, `iswc-icon`, `iswc-button`…) vienen del kit por el import map de la página;
este repo nunca referencia rutas locales de otro.

## Trabajar aquí

```bash
deno install
deno task build        # icons + SCSS + src/ + view/ → dist/cdn/ (+ plugin.json)
deno task serve        # http://127.0.0.1:4310/  (galería: /view/demo/)
deno task test:all     # build → check → pin → test:health → test:e2e (cooldown)
```

- Agentes: [`AGENTS.md`](AGENTS.md). Specs: [`specs/README.md`](specs/README.md).
- Subir el kit: `deno task pin --nuevo=<sha40|ultimo>` → `deno task vendor:ISWC` → `deno task vendor:scss` → build.
