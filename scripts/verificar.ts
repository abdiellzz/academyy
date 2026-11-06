/* ═══════════════════════════════════════════════════════════════════
   Verificación de contenido y datos (sin navegador).
   Uso:  npm run verify
   Revisa ids duplicados, niveles incompletos, retos mal formados, enlaces
   de laboratorio al nivel equivocado y numeración de niveles.
   Sale con código 1 si algo está mal: sirve como puerta antes de commitear.
   ═══════════════════════════════════════════════════════════════════ */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import dirname from "node:path";

import { C, totalNiveles } from "../src/lib/content";
import { LABS } from "../src/views/Labs";

const problemas: string[] = [];
const avisos: string[] = [];
const mal = (m: string) => problemas.push(m);

/* 1 · Resumen ------------------------------------------------------- */
const niveles = C.mundos.flatMap((m) => m.niveles);
console.log(
  `Contenido: ${C.mundos.length} mundos · ${totalNiveles} niveles · ${C.retos.length} retos · ${LABS.length} laboratorios`,
);

/* 2 · Ids únicos ---------------------------------------------------- */
const dup = (lista: string[], que: string) => {
  const vistos = new Set<string>();
  for (const id of lista) {
    if (vistos.has(id)) mal(`${que} duplicado: ${id}`);
    vistos.add(id);
  }
};
dup(C.mundos.map((m) => m.id), "Mundo");
dup(C.mundos.flatMap((m) => m.niveles.map((n) => `${m.id}/${n.id}`)), "Nivel");
dup(C.retos.map((r) => r.id), "Reto");
dup(LABS.map((l) => l.id), "Laboratorio");

/* 3 · Cada nivel está completo -------------------------------------- */
for (const m of C.mundos) {
  for (const n of m.niveles) {
    const donde = `${m.id}/${n.id}`;
    if (!n.titulo || !n.subtitulo) mal(`${donde}: falta título o subtítulo`);
    if (!n.objetivos?.length) mal(`${donde}: sin objetivos`);
    if ((n.teoria?.length ?? 0) < 3) mal(`${donde}: teoría con menos de 3 bloques`);
    if (!n.practica?.length) mal(`${donde}: sin práctica`);
    const r = n.reto;
    if (!r) mal(`${donde}: sin reto`);
    else {
      if (r.opciones.length !== 4) mal(`${donde}/reto: ${r.opciones.length} opciones (deberían ser 4)`);
      if (r.respuesta < 0 || r.respuesta >= r.opciones.length) mal(`${donde}/reto: respuesta fuera de rango`);
      if (!r.explicacion) mal(`${donde}/reto: sin explicación`);
    }
    if (n.minutos <= 0 || n.minutos > 40) avisos.push(`${donde}: ${n.minutos} min parece raro`);
  }
}

/* 4 · Numeración de niveles (0..n-1, sin huecos) --------------------- */
for (const m of C.mundos) {
  const nums = m.niveles.map((n) => n.nivel);
  nums.forEach((v, i) => {
    if (v !== i) mal(`${m.id}: nivel «${m.niveles[i].id}» tiene nivel=${v} y debería ser ${i}`);
  });
}

/* 5 · Retos CTF ------------------------------------------------------ */
for (const r of C.retos) {
  if (!C.mundos.some((m) => m.id === r.mundo)) mal(`reto ${r.id}: mundo «${r.mundo}» no existe`);
  if (!r.titulo || !r.enunciado || !r.explicacion) mal(`reto ${r.id}: texto incompleto`);
  if (!r.aceptadas?.length) mal(`reto ${r.id}: sin respuestas aceptadas`);
  if (!r.solucion) mal(`reto ${r.id}: sin solución`);
  if (r.puntos < 50 || r.puntos > 300) avisos.push(`reto ${r.id}: ${r.puntos} puntos`);
  if (r.tipo === "opciones") {
    if (!r.opciones || r.opciones.length < 3) mal(`reto ${r.id}: opciones insuficientes`);
    // las opciones se responden con la letra: a, b, c…
    const validas = (r.opciones ?? []).map((_, i) => String.fromCharCode(97 + i));
    if (!r.aceptadas.some((a) => validas.includes(a.toLowerCase()))) {
      mal(`reto ${r.id}: ninguna respuesta aceptada corresponde a una letra de opción`);
    }
  }
}

/* 6 · Laboratorios --------------------------------------------------- */
for (const l of LABS) {
  if (!l.que || !l.haces) mal(`lab ${l.id}: falta el «qué es» o el «qué haces»`);
  if (!["Fácil", "Media", "Difícil"].includes(l.nivel)) mal(`lab ${l.id}: nivel «${l.nivel}» inválido`);
  const t = l.practica?.tipo;
  if (!t) mal(`lab ${l.id}: sin práctica`);
  if (t === "widget" && !("w" in l.practica)) mal(`lab ${l.id}: widget sin clave`);
}

/* 7 · LAB_LUGAR: el botón «Ver el nivel completo» --------------------- */
const fuente = readFileSync(fileURLToPath(new URL("../src/views/Labs.tsx", import.meta.url)), "utf8");
const bloque = fuente.slice(fuente.indexOf("const LAB_LUGAR"), fuente.indexOf("export function Laboratorio"));
const pares = [...bloque.matchAll(/["']?([\w-]+)["']?:\s*\{\s*mundo:\s*"([\w-]+)",\s*nivel:\s*"([\w-]+)"/g)];
if (!pares.length) mal("LAB_LUGAR: no se pudo leer el mapa");
for (const [, lab, mundo, nivel] of pares) {
  if (!LABS.some((l) => l.id === lab)) mal(`LAB_LUGAR: el lab «${lab}» no existe`);
  const m = C.mundos.find((x) => x.id === mundo);
  if (!m) mal(`LAB_LUGAR ${lab}: mundo «${mundo}» inexistente`);
  else if (!m.niveles.some((n) => n.id === nivel)) mal(`LAB_LUGAR ${lab}: nivel «${mundo}/${nivel}» inexistente`);
}
const sinLugar = LABS.filter((l) => !pares.some(([, id]) => id === l.id)).map((l) => l.id);
if (sinLugar.length) avisos.push(`labs sin nivel asignado (caen al mundo): ${sinLugar.join(", ")}`);

/* 8 · Metadatos ------------------------------------------------------ */
if (!C.meta?.nombre || !C.meta?.autor) mal("meta incompleta");
const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
const desc = html.match(/name="description"\s+content="([^"]+)"/)?.[1] ?? "";
if (!desc) mal("index.html: falta la descripción");
else if (!desc.includes(String(totalNiveles))) avisos.push("index.html: la descripción no menciona el número de niveles");

/* Resultado ---------------------------------------------------------- */
for (const a of avisos) console.log(`· aviso: ${a}`);
if (problemas.length) {
  console.log(`\n${problemas.length} problema(s):`);
  for (const p of problemas) console.log(`  ✗ ${p}`);
  process.exit(1);
}
console.log(`\n✔ Todo en orden (${niveles.length} niveles revisados, ${pares.length} enlaces de lab).`);
void dirname;
