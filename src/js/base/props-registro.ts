// @contexto INDICE.md · skills/iswc-foundation/SKILL.md
/**
 * props-registro.ts — qué claves de `.props` reconoce cada tag. Lo que no está aquí se avisa.
 *
 * Al crear un componente con `props`: su schema va en `consts/schemas/componentes.schemas.ts` y se
 * registra AQUÍ con una línea. Todo setter de `props` pasa por `revisarProps`.
 */
import { avisarPropsNoIdentificadas, clavesDe, instalarVigilanciaAtributos } from './zod.js';

const MAPA = new Map<string, ReadonlySet<string>>();

export function registrarClaves(tag: string, esquema: { shape: object }): void {
  MAPA.set(tag, clavesDe(esquema));
}

// Los diagramas (`iswd-*`) reciben su dato por `payload`/atributos: aquí solo se registran los componentes con `props`.

export function revisarProps(tag: string, valor: unknown): void {
  if (!valor || typeof valor !== 'object') return;
  const claves = MAPA.get(tag);
  if (claves) avisarPropsNoIdentificadas(tag, claves, valor);
}

if (typeof document !== 'undefined') instalarVigilanciaAtributos('iswd');
