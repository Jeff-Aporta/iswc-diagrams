#!/usr/bin/env -S deno run -A
/**
 * gen-import-map.mjs — genera el bloque "imports" del deno.json de iswc-diagrams.
 *
 * POR QUE EXISTE: Deno NO resuelve un import remoto ".js" hacia un archivo ".ts" (solo lo hace
 * para rutas locales). El dist de iswc-base se publica como TypeScript y sus modulos se importan
 * entre si con extension ".js" (p. ej. lib/obj.ts -> "../schemas.js"). Consumido por CDN, eso
 * da "Module not found". La unica salida sin reescribir iswc-base es mapear en el import map
 * cada URL ".js" a su archivo real (".ts" si existe, ".mjs" si esta compilado).
 *
 * USO:  deno run -A scripts/gen-import-map.mjs [--sha <sha>] [--escribir]
 *       (sin --escribir solo imprime el bloque, para revisar antes de aplicar)
 */

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const RAIZ = dirname(dirname(fileURLToPath(import.meta.url)));
const DIST_ISWC_BASE = "D:/VPS/transversales/iswc-base/dist/cdn";
const SHA_POR_DEFECTO = "2a651e44bbd1316b96942f14f26ff1c6175ac2c8";

const args = Deno.args;
const shaIdx = args.indexOf("--sha");
const sha = shaIdx >= 0 ? args[shaIdx + 1] : SHA_POR_DEFECTO;
const escribir = args.includes("--escribir");
const CDN = `https://cdn.jsdelivr.net/gh/Jeff-Aporta/is-webcomponents@${sha}/dist/cdn/`;

function recorrer(dir, rel = "") {
  const salida = [];
  for (const e of Deno.readDirSync(dir)) {
    const r = rel ? `${rel}/${e.name}` : e.name;
    if (e.isDirectory) salida.push(...recorrer(`${dir}/${e.name}`, r));
    else if (r.endsWith(".ts") || r.endsWith(".mjs")) salida.push(r);
  }
  return salida;
}

const entradas = new Map();
for (const r of recorrer(DIST_ISWC_BASE)) {
  const stem = r.slice(0, r.lastIndexOf("."));
  entradas.set(`${CDN}${stem}.js`, `${CDN}${r}`);
}

if (!escribir) {
  console.log([
    "    /**Mapeo .js -> archivo real (.ts o .mjs) de los modulos remotos de iswc-base.",
    "     *  Lo genera scripts/gen-import-map.mjs. Sin esto, Deno no resuelve .js -> .ts por HTTPS. */",
    ...[...entradas.entries()].sort().map(([k, v]) => `    "${k}": "${v}"`),
  ].join("\n"));
} else {
  const ruta = join(RAIZ, "deno.json");
  const cfg = JSON.parse(Deno.readTextFileSync(ruta));
  for (const [k, v] of entradas) cfg.imports[k] = v;
  cfg.imports["@jeff-aporta/iswc-base/"] = CDN;
  Deno.writeTextFileSync(ruta, JSON.stringify(cfg, null, 2) + "\n");
  console.log(`deno.json actualizado con ${entradas.size} entradas (sha ${sha})`);
}