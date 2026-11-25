// @contexto INDICE.md · skills/iswc-foundation/SKILL.md
/**
 * componentes.schemas.ts — forma de las `props` de cada componente y tipos auxiliares de la base.
 *
 * Regla: los tipos salen de `z.infer<>`; no hay `type`/`interface` sueltos fuera de `*.schemas.ts`.
 * Datos que vienen de fuera (API, URL, almacenamiento) se PARSEAN con su schema (`safeParse`),
 * nunca se castean con `as`.
 */
/** Base (`componente.ts`): atributos e hijos del helper `el()`. */
export type Atributos = Record<string, unknown>;
export type Hijos = Array<Node | string | null | undefined> | Node | string | null | undefined;
