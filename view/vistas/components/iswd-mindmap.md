---
name: iswd-mindmap
description: Mapa mental en SVG, sin Mermaid.
tag: iswd-mindmap
tags:
  - iswd-mindmap
category: diagrams
status: public
source: ./iswd-mindmap.ts
style: ./iswd-mindmap.scss
preview: ./iswd-mindmap.json
---
# `<iswd-mindmap>`


## Anatomía

`<iswd-mindmap>` es un Web Component vanilla (Shadow DOM, sin frameworks) del plugin `iswd-` de ISWC: el host recibe la configuración por JSON y pinta un único `<svg>` dentro de su shadow root; los colores salen de los tokens `--iswc-*` y del tema del diagrama.

## Propósito

Mapa mental en SVG, sin Mermaid. Declaras ideas con un `parent`
opcional y el componente arma el árbol, reparte las ramas y las une
con curvas suaves coloreadas por rama.

Este módulo registra `<iswd-mindmap>`.

## Cuándo usarlo

Relaciones, flujos, estados, estructura o tiempo desde payloads declarativos.

## Cuándo no usarlo

No inventar schemas ni usar specs/layout como custom elements.

## Importación

```js
import './iswd-mindmap.js';
```

## Ejemplos
```html
<iswd-mindmap></iswd-mindmap>
```

## API

### Atributos y propiedades

## Atributos observados
| Atributo | Tipo | Notas |
| --- | --- | --- |
| `color` | `viewer` \| color | `viewer` lo pinta como visor dentro del lightbox. |

## Props
| Propiedad | Acceso | Notas |
| --- | --- | --- |
| `isViewer` | solo lectura | Declarada por clase. |
| `payload` | lectura/escritura | Declarada por clase. |
| `spec` | solo lectura | Declarada por clase. |
| `layout` | solo lectura | Declarada por clase. |

## Slots
| Slot | Uso |
| --- | --- |
| `default` | Contenido proyectado. |

## Eventos
<!-- eventos: generado por scripts/sondas/eventos.ts desde declare static events -->

| Evento | detail | cancelable |
| --- | --- | --- |
| `iswc-render` | `DiagramRenderDetail` | no |
| `iswc-open-viewer` | `DiagramViewerDetail` | sí |

<!-- /eventos -->


| Evento | Descripción |
| --- | --- |
| `iswc-render` | Emitido al renderizar o redibujar el componente. |
| `iswc-open-viewer` | Emitido al abrir el visor ampliado (cancelable). |


<details>
<summary>Ejemplo en vivo</summary>

```js
const el = document.querySelector('iswd-mindmap');
el.addEventListener('iswc-render', (e) => {
  console.log('iswc-render', e.detail);
});
```

</details>

### Métodos y propiedades públicas

| Método | Uso |
| --- | --- |
| `updateComplete()` | Método público declarado. |

Propiedades públicas aparecen en tabla anterior; APIs heredadas se verifican en dependencia base.

### CSS parts

| Part | Uso |
| --- | --- |
| `base` | Personalizable con `::part(base)`. |
| `canvas` | Personalizable con `::part(canvas)`. |
| `tooltip` | Personalizable con `::part(tooltip)`. |

### Custom states

No expone.

### CSS custom properties

| Token | Uso |
| --- | --- |
| `--iswc-sans` | Token leído o definido por componente. |
| `--iswc-border` | Token leído o definido por componente. |
| `--iswc-text-soft` | Token leído o definido por componente. |

### Integración con formularios

No declara integración form-associated propia en este módulo.

## Comportamiento

Documentación de cabecera preservada desde fuente:

> <iswd-mindmap> — mapa mental en SVG, sin Mermaid.
>   <iswd-mindmap>
>     <script type="application/json">
>       { "mindmap": { "layout": "radial", "nodes": [...] } }
>     </script>
>   </iswd-mindmap>
> Mismo esqueleto que <iswd-flowchart>: shadow DOM, slot JSON + MutationObserver,
> tema por atributo `data-theme`, `color` (inline | viewer), lightbox propio.
> Atributos: color (inline | viewer), open-on-click
> Propiedades: payload, spec, layout
> Eventos: iswc-render, iswc-open-viewer

## Dependencias y componentes relacionados

- [`../_shared/adopt-css.js`](../_shared/adopt-css.js)
- [`./mindmap-spec.js`](./utils/mindmap-spec.js)
- [`./sequence-spec.js`](./utils/sequence-spec.js)
- [`../_shared/tk-hue.js`](../../core/color.js)
- [`../_shared/tk-inline-md.js`](../../core/tk-inline-md.js)
- [`../_shared/tk-icon-inline.js`](../../core/tk-text.js)
- [`../_shared/icon-loader.js`](../../core/icon-loader.js)
- [`./diagram-kinds.js`](./utils/diagram-model.js)

Tags del módulo: `<iswd-mindmap>`.

## Accesibilidad

Preservar semántica, foco, teclado, labels y ARIA. ARIA detectado: `aria-label`.

## Ejemplo avanzado

```html
<iswd-mindmap></iswd-mindmap>
```

## Errores comunes

- Usar tag sin importar módulo primero.
- Inventar API por similitud con otro componente.
- Pasar objeto complejo por atributo cuando API exige propiedad/payload.
- Copiar preview contra fuente actual; JS/CSS prevalecen.
- Crear size color; usar font-size contextual y em.

## Reglas para LLM

- Reusar componente y dependencias antes de implementación paralela.
- Mantener nombres exactos de tags y API.
- Booleano se activa por presencia; no usar `attr="false"` salvo contrato explícito.
- Leer callers/shared antes de cambiar; corregir raíz común.
- No modificar API basándose solo en preview.

## Fuentes

- [JavaScript](./mindmap.ts)
- [CSS](./mindmap.scss)
- [Índice de categoría](../../../specs/componentes.md)
- [Preview](./mindmap.json)

## App API

Visor: `demos/diagramas/app/view.html?kind=mindmap&json=<base64url>`.
Editor: `demos/diagramas/app/edit.html?kind=mindmap&json=<base64url>`.

`json` es el documento completo en base64url. Editar no reescribe ese parámetro: Compartir arma un enlace nuevo con el JSON resultante.
