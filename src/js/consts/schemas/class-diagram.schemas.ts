// @contexto INDICE.md · skills/iswc-foundation/SKILL.md
/**
 * class-diagram.schemas.ts — tipos de `<iswd-class-diagram>`.
 */
import type { DiagramTurtleDetail, DiagramRenderDetail, DiagramToggleDetail, DiagramViewerDetail } from './diagram-base.schemas.js';


/** Eventos del componente (HOW-6): `declare static events` en la clase; los documenta scripts/sondas/eventos.ts. */
export type ClassDiagramEventos = { 'iswc-turtle-state': DiagramTurtleDetail; 'iswc-render': DiagramRenderDetail; 'iswc-toggle-group': DiagramToggleDetail; 'iswc-open-viewer': DiagramViewerDetail };
