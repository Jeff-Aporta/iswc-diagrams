// @contexto INDICE.md · skills/build-component/SKILL.md
// migrar-fichas.mjs — lleva las fichas md de view/*/components a la plantilla del contrato W-COMP-08
// (name/description + Anatomía, Atributos observados, Props, Eventos, Slots, Ejemplos). Idempotente.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

for (const vista of ['vistas', 'editores']) {
  const dir = join('view', vista, 'components');
  for (const f of readdirSync(dir).filter((n) => n.endsWith('.md'))) {
    const ruta = join(dir, f);
    let md = readFileSync(ruta, 'utf8').replace(/^﻿/, '').replace(/\r\n/g, '\n');
    const tag = f.replace(/\.md$/, '');
    const fm = md.match(/^---\n([\s\S]*?)\n---\n/);
    if (!fm) throw new Error(`${f}: sin front matter`);
    let cuerpo = md.slice(fm[0].length);
    let resto = fm[1].split('\n').filter((l) => !/^(name|description):/.test(l)).join('\n');
    const prop = cuerpo.match(/## Propósito\n\n([\s\S]*?)\n\n/);
    const desc = (prop ? prop[1] : `Componente ${tag}`).replace(/\s+/g, ' ').trim().replace(/"/g, "'");
    const primera = desc.split(/(?<=\.)\s/)[0];
    cuerpo = cuerpo
      .replace(/^#### Atributos observados\s*$/m, '## Atributos observados')
      .replace(/^#### Propiedades públicas\s*$/m, '## Props')
      .replace(/^### Eventos\s*$/m, '## Eventos')
      .replace(/^### Slots\s*$/m, '## Slots')
      .replace(/^## Ejemplo mínimo\s*$/m, '## Ejemplos');
    if (!/^## Props\s*$/m.test(cuerpo)) cuerpo += '\n## Props\n\nVer «Atributos observados»: este componente no declara propiedades adicionales.\n';
    if (!/^## Atributos observados\s*$/m.test(cuerpo)) cuerpo += '\n## Atributos observados\n\nNo declara atributos propios más allá de los de `IswcElement`.\n';
    if (!/^## Eventos\s*$/m.test(cuerpo)) cuerpo += '\n## Eventos\n\nNo emite eventos propios.\n';
    if (!/^## Slots\s*$/m.test(cuerpo)) cuerpo += '\n## Slots\n\nNo declara slots: el contenido se configura por JSON (`<script type="application/json">` o la propiedad `payload`).\n';
    if (!/^## Ejemplos\s*$/m.test(cuerpo)) cuerpo += '\n## Ejemplos\n\nVer «Ejemplo mínimo» y la demo de la galería (`view/demo/`).\n';
    if (!/^## Anatomía\s*$/m.test(cuerpo)) {
      const ancla = cuerpo.indexOf('\n## ');
      const anat = `\n## Anatomía\n\n\`<${tag}>\` es un Web Component vanilla (Shadow DOM, sin frameworks) del plugin \`iswd-\` de ISWC: el host recibe la configuración por JSON y pinta un único \`<svg>\` dentro de su shadow root; los colores salen de los tokens \`--iswc-*\` y del tema del diagrama.\n`;
      cuerpo = cuerpo.slice(0, ancla) + '\n' + anat + cuerpo.slice(ancla);
    }
    writeFileSync(ruta, `---\nname: ${tag}\ndescription: ${primera}\n${resto}\n---\n${cuerpo.replace(/^\n+/, '')}`);
  }
}
