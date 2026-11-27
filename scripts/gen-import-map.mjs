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
const SHA_POR_DEFECTO = "2a651e44bbd1316b96942f14f26ff1c6175ac2c8";

const args = Deno.args;
const shaIdx = args.indexOf("--sha");
const sha = shaIdx >= 0 ? args[shaIdx + 1] : SHA_POR_DEFECTO;
const escribir = args.includes("--escribir");
const CDN = `https://cdn.jsdelivr.net/gh/Jeff-Aporta/is-webcomponents@${sha}/dist/cdn/`;

/** Archivos de dist/cdn del kit EN ESE SHA, por el listado plano de jsDelivr (hermético: nunca rutas locales). */
async function listarKit(sha) {
  const r = await fetch(`https://data.jsdelivr.com/v1/packages/gh/Jeff-Aporta/is-webcomponents@${sha}?structure=flat`);
  if (!r.ok) throw new Error(`jsDelivr no lista el kit @${sha}: HTTP ${r.status}`);
  const { files } = await r.json();
  return files.map((f) => f.name).filter((n) => n.startsWith("/dist/cdn/") && (n.endsWith(".ts") || n.endsWith(".mjs"))).map((n) => n.slice("/dist/cdn/".length));
}

const entradas = new Map();
for (const r of await listarKit(sha)) {
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
  for (const k of Object.keys(cfg.imports)) if (k.startsWith("https://cdn.jsdelivr.net/gh/Jeff-Aporta/is-webcomponents@")) delete cfg.imports[k]; // sin restos de otros SHA
  for (const [k, v] of entradas) cfg.imports[k] = v;
  cfg.imports["@jeff-aporta/iswc-base/"] = CDN;
  Deno.writeTextFileSync(ruta, JSON.stringify(cfg, null, 2) + "\n");
  console.log(`deno.json actualizado con ${entradas.size} entradas (sha ${sha})`);
}