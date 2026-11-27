---
name: iswd-venn-diagram
description: Diagrama de **Venn** de dos o tres conjuntos en SVG, sin Mermaid, con las posiciones canónicas y las regiones etiquetadas.
tag: iswd-venn-diagram
tags:
  - iswd-venn-diagram
category: diagrams
status: public
source: ./iswd-venn-diagram.ts
style: ./iswd-venn-diagram.scss
preview: ./iswd-venn-diagram.json
---
# `<iswd-venn-diagram>`


## Anatomía

`<iswd-venn-diagram>` es un Web Component vanilla (Shadow DOM, sin frameworks) del plugin `iswd-` de ISWC: el host recibe la configuración por JSON y pinta un único `<svg>` dentro de su shadow root; los colores salen de los tokens `--iswc-*` y del tema del diagrama.

## Propósito

Diagrama de **Venn** de dos o tres conjuntos en SVG, sin Mermaid, con las
posiciones canónicas y las regiones etiquetadas.

Este módulo registra `<iswd-venn-diagram>`.

## Cuándo usarlo

Cuando el mensaje es solape: alcance pedido contra alcance entregado,
usuarios de dos módulos, cobertura de dos catálogos.

## Cuándo no usarlo

Con cuatro o más conjuntos: los círculos no pueden representar todas las
regiones y el diagrama miente. Si lo que hay es jerarquía → `<iswd-mindmap>`.

## Importación

```js
import './iswd-venn-diagram.js';
```

## Ejemplos
```html
<iswd-venn-diagram>
  <script type="application/json">
    {}
  </script>
</iswd-venn-diagram>
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
| `default` | Payload JSON en un `<script type="application/json">`. |

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
const el = document.querySelector('iswd-venn-diagram');
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

El relleno es translúcido y la intersección aparece por superposición, sin máscaras: el orden de declaración no altera el resultado. Un payload con menos de dos o más de tres conjuntos no se dibuja.

Documentación de cabecera preservada desde fuente:

> <iswd-venn-diagram> — diagrama de Venn (2 o 3 conjuntos) en SVG, sin Mermaid.
>   <iswd-venn-diagram>
>     <script type="application/json">
>       { "venn": { "sets": [...], "regions": [{ "sets": ["a","b"], "label": "Ambos" }] } }
>     </script>
>   </iswd-venn-diagram>
> Mismo esqueleto que <iswd-flowchart>: shadow DOM, slot JSON + MutationObserver,
> tema por atributo `data-theme`, `color` (inline | viewer), lightbox propio.
> Atributos: color (inline | viewer), open-on-click
> Propiedades: payload, spec, layout
> Eventos: iswc-render, iswc-open-viewer

## Dependencias y componentes relacionados

- [`../_shared/adopt-css.js`](../_shared/adopt-css.js)
- [`../_shared/diagram-element-base.js`](./utils/diagram-element-base.js)
- [`./venn-spec.js`](./utils/venn-spec.js)
- [`./sequence-spec.js`](./utils/sequence-spec.js)
- [`../_shared/tk-hue.js`](../../core/color.js)
- [`../_shared/tk-inline-md.js`](../../core/tk-inline-md.js)
- [`./diagram-kinds.js`](./utils/diagram-model.js)
- [`../_shared/define.js`](../_shared/define.js)
- [`../_shared/emit.js`](../_shared/emit.js)
- [`../_shared/svg-chart-engine.js`](../../core/svg-chart-engine.js)

Tags del módulo: `<iswd-venn-diagram>`.

## Accesibilidad

Preservar semántica, foco, teclado, labels y ARIA. ARIA detectado: `aria-label`.

## Ejemplo avanzado

Ver el preview de la galería, que trae el payload completo con grupos y estilos:
[`./venn-diagram.json`](./venn-diagram.json).

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

- [JavaScript](./venn-diagram.ts)
- [CSS](./venn-diagram.scss)
- [Spec y layout](./utils/venn-spec.js)
- [Índice de categoría](../../../specs/componentes.md)
- [Preview](./venn-diagram.json)

## App API

Visor: `demos/diagramas/app/view.html?kind=venn&json=<base64url>`.
Editor: `demos/diagramas/app/edit.html?kind=venn&json=<base64url>`.

`json` es el documento completo en base64url. Editar no reescribe ese parámetro: Compartir arma un enlace nuevo con el JSON resultante.
