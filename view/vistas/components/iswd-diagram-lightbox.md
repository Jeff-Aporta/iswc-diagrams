---
name: iswd-diagram-lightbox
description: Visor a pantalla completa pensado para diagramas: hereda del <iswc-lightbox> genérico el zoom anclado al cursor, el pan y el dialog top-layer, y le suma la barra de la animación tortuga (play / pause / prev / next), el anillo de auto-replay, el panel de código JSON y el enlace compartible con el payload en ?d=.
tag: iswd-diagram-lightbox
tags:
  - iswd-diagram-lightbox
category: diagrams
status: public
source: ./iswd-diagram-lightbox.ts
style: ./iswd-diagram-lightbox.scss
preview: ./iswd-diagram-lightbox.json
---
# `<iswd-diagram-lightbox>`


## Anatomía

`<iswd-diagram-lightbox>` es un Web Component vanilla (Shadow DOM, sin frameworks) del plugin `iswd-` de ISWC: el host recibe la configuración por JSON y pinta un único `<svg>` dentro de su shadow root; los colores salen de los tokens `--iswc-*` y del tema del diagrama.

## Propósito

Visor a pantalla completa pensado para diagramas: hereda del
<iswc-lightbox> genérico el zoom anclado al
cursor, el pan y el dialog top-layer, y le suma la barra de la animación
tortuga (play / pause / prev / next), el anillo de auto-replay, el panel
de código JSON y el enlace compartible con el payload en ?d=.

Este módulo registra `<iswd-diagram-lightbox>`.

## Cuándo usarlo

Relaciones, flujos, estados, estructura o tiempo desde payloads declarativos.

## Cuándo no usarlo

No inventar schemas ni usar specs/layout como custom elements.

## Importación

```js
import './iswd-diagram-lightbox.js';
```

## Ejemplos
```html
<iswd-diagram-lightbox id="lb" kind="sequence"></iswd-diagram-lightbox>
<script type="module">
const lb = document.getElementById('lb');
lb.payload = { preset: 'tk1437191' };
lb.open = true;
// O abrirlo con un click:
lb.addEventListener('iswc-share', (e) => {
console.log('Compartir:', e.detail.url);
});
</script>
```

## API

### Atributos y propiedades

## Atributos observados
| Atributo | Tipo | Notas |
| --- | --- | --- |
| `kind` | string | Tipo de diagrama. Por defecto `sequence`. |

## Props
| Propiedad | Acceso | Notas |
| --- | --- | --- |
| `kind` | lectura/escritura | Declarada por clase. |
| `payload` | lectura/escritura | Declarada por clase. |

## Slots
No expone.

## Eventos
| Evento | Descripción |
| --- | --- |
| `iswc-share` | Evento personalizado del componente (share). |

| Evento | detail | bubbles | composed | cancelable |
| --- | --- | --- | --- | --- |
| `iswc-share` | sí | sí | sí | no |


<details>
<summary>Ejemplo en vivo</summary>

```js
const el = document.querySelector('iswd-diagram-lightbox');
el.addEventListener('iswc-share', (e) => {
  console.log('iswc-share', e.detail);
});
```

</details>

### Métodos y propiedades públicas

| Método | Uso |
| --- | --- |
| `show()` | Método público declarado. |

Propiedades públicas aparecen en tabla anterior; APIs heredadas se verifican en dependencia base.

### CSS parts

No expone.

### Custom states

No expone.

### CSS custom properties

| Token | Uso |
| --- | --- |
| `--iswc-text-soft` | Token leído o definido por componente. |
| `--iswc-mono` | Token leído o definido por componente. |
| `--iswc-radius-sm` | Token leído o definido por componente. |
| `--iswc-border` | Token leído o definido por componente. |
| `--iswc-code-bg` | Token leído o definido por componente. |
| `--iswc-code-text` | Token leído o definido por componente. |
| `--iswc-focus` | Token leído o definido por componente. |
| `--iswc-danger-text` | Token leído o definido por componente. |
| `--iswc-control-border` | Token leído o definido por componente. |
| `--iswc-control-bg` | Token leído o definido por componente. |
| `--iswc-control-text` | Token leído o definido por componente. |
| `--iswc-control-bg-hover` | Token leído o definido por componente. |
| `--iswc-accent` | Token leído o definido por componente. |
| `--iswc-on-brand` | Token leído o definido por componente. |

### Integración con formularios

No declara integración form-associated propia en este módulo.

## Comportamiento

Documentación de cabecera preservada desde fuente:

> <iswd-diagram-lightbox> — colore del lightbox para diagramas.
> Es un <iswc-lightbox> con la barra específica de la animación tortuga
> (<< ▶/⏸ ■ >>), el anillo de cuenta regresiva del auto-replay, el botón
> de código JSON y el botón de compartir enlace. El resto del visor
> (zoom, pan, dialog, slots) lo hereda de iswc-lightbox.
> Conceptualmente, un diagrama es "un nodo que tiene un payload JSON y
> expone una API turtle {play,pause,stop,next,prev}". El visor hace de
> puente entre ese contrato y la barra por defecto. Si en algún momento
> hay otro componente con la misma forma, se hace un wrapper igual sin
> tocar el lightbox genérico.
> Atributos: kind (default "sequence"), open
>             + todos los de <iswc-lightbox>
> Propiedades: payload, kind, open
>              + todas las de <iswc-lightbox>
> Eventos: iswc-close, iswc-share, iswc-reposition
>          + iswc-turtle-state { playing, idx, total, replay }
>          + iswc-toggle-group { id }

## Dependencias y componentes relacionados

- [`../_shared/adopt-css.js`](../_shared/adopt-css.js)
- [`./lightbox.js`](./lightbox.js)
- [`./diagram-kinds.js`](./utils/diagram-model.js)
- [`./sequence-spec.js`](./utils/sequence-spec.js)
- [`../media/icon.js`](../media/icon.js)

Tags del módulo: `<iswd-diagram-lightbox>`.

## Accesibilidad

Preservar semántica, foco, teclado, labels y ARIA. ARIA detectado: `aria-label`, `aria-hidden`, `aria-live`.

## Ejemplo avanzado

```html
<iswd-diagram-lightbox id="lb" kind="sequence"></iswd-diagram-lightbox>
<script type="module">
const lb = document.getElementById('lb');
lb.payload = { preset: 'tk1437191' };
lb.open = true;
// O abrirlo con un click:
lb.addEventListener('iswc-share', (e) => {
console.log('Compartir:', e.detail.url);
});
</script>
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

- [JavaScript](./diagram-lightbox.ts)
- [CSS](./diagram-lightbox.scss)
- [Índice de categoría](../../../specs/componentes.md)
- [Preview](./diagram-lightbox.json)
