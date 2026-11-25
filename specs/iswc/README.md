# specs/iswc — skills del kit iswc-base para esta app

Copias sembradas por `create-iswc-app` desde el kit (`iswc-base/skills/iswc-foundation`). Son el
estándar común de TODAS las apps ISWC: si una regla cambia, cambia en el kit y se vuelve a sembrar.

| Skill | Cuándo |
| --- | --- |
| [`kit/SKILL.md`](kit/SKILL.md) · [`kit/catalog.md`](kit/catalog.md) · [`kit/reference.md`](kit/reference.md) | **Primero, siempre**: la skill general del kit con el índice de TODOS los componentes `iswc-*` (catálogo) y el mapa intención → componente. Antes de crear una pieza, busca aquí la que ya existe |
| [`nuevo-componente.md`](nuevo-componente.md) | Crear un componente `iswd-*` (4 archivos + registro + props Zod) |
| [`demo-componente.md`](demo-componente.md) | Escribir o ampliar el playground `.json` y la ficha `.md` de un componente |
| [`nueva-vista.md`](nueva-vista.md) | Crear una vista `view/<v>/` (shell, index aislado, demo, utils) |
| [`actualizar-pin.md`](actualizar-pin.md) | Subir el kit a otro SHA (pin + vendor + gate) |

Specs y pruebas se escriben con [`../especificar-what.md`](../especificar-what.md). El estándar
completo (arquitectura, build, estilos, Zod, pruebas, sync):
[iswc-foundation/SKILL.md](https://github.com/Jeff-Aporta/is-webcomponents/blob/92208c8e9e9bca9e0fa6fa944b5ee2ee98f08a0c/skills/iswc-foundation/SKILL.md).
`kit/` es una copia fijada al SHA del pin (no se edita): `deno task vendor:ISWC` la refresca al
subir el pin, junto con las herramientas del kit.
