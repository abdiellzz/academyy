/* ═══════════════════════════════════════════════════════════════════
   Verificación de contenido y datos (sin navegador).
   Uso:  npm run verify
   Revisa ids duplicados, niveles incompletos, retos mal formados, enlaces
   de laboratorio, banco práctico del examen, Python seguro, cifrado y numeración.
   Sale con código 1 si algo está mal: sirve como puerta antes de commitear.
   ═══════════════════════════════════════════════════════════════════ */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import dirname from "node:path";

import { C, totalNiveles } from "../src/lib/content";
import { LABS } from "../src/views/Labs";
import { ejecutarPython } from "../src/lib/py";
import { aesCifrar, aesDescifrar } from "../src/lib/crypto";
import { PROYECTOS, RUTAS_APRENDIZAJE } from "../src/lib/learning";
import { CONCEPTOS } from "../src/lib/conceptos";
import { siguienteRepaso } from "../src/lib/review";
import { crearBancoExamen, seleccionarPreguntasEquilibradas, TRANSFERENCIA } from "../src/views/Examen";

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
    else if (n.objetivos.some((o) => !o.trim()) || new Set(n.objetivos.map((o) => o.trim().toLowerCase())).size !== n.objetivos.length) mal(`${donde}: objetivo vacío o duplicado`);
    if ((n.teoria?.length ?? 0) < 3) mal(`${donde}: teoría con menos de 3 bloques`);
    if (!n.practica?.length) mal(`${donde}: sin práctica`);
    for (const [i, practica] of (n.practica ?? []).entries()) {
      if (practica.tipo === "escribir" && (!practica.pregunta || !practica.respuestas.length)) mal(`${donde}/práctica ${i + 1}: escritura sin respuesta aceptada`);
      if (practica.tipo === "orden" && practica.pasos.length < 2) mal(`${donde}/práctica ${i + 1}: orden requiere al menos 2 pasos`);
      if (practica.tipo === "codigo" && (!practica.codigo || !practica.salida)) mal(`${donde}/práctica ${i + 1}: código sin ejemplo/salida`);
    }
    const r = n.reto;
    if (!r) mal(`${donde}: sin reto`);
    else {
      if (r.opciones.length !== 4) mal(`${donde}/reto: ${r.opciones.length} opciones (deberían ser 4)`);
      if (r.respuesta < 0 || r.respuesta >= r.opciones.length) mal(`${donde}/reto: respuesta fuera de rango`);
      if (!r.explicacion) mal(`${donde}/reto: sin explicación`);
    }
    for (const bloque of n.teoria) {
      if (bloque.t === "source" && (!bloque.title || !bloque.url.startsWith("https://") || !/^\d{4}-\d{2}-\d{2}$/.test(bloque.revisado) || Number.isNaN(Date.parse(`${bloque.revisado}T12:00:00Z`)))) mal(`${donde}: referencia sin título, URL segura o fecha de revisión válida`);
    }
    if (n.minutos <= 0 || n.minutos > 40) avisos.push(`${donde}: ${n.minutos} min parece raro`);
  }
}

const fuentesCurso = niveles.flatMap((n) => n.teoria.filter((b) => b.t === "source"));
if (fuentesCurso.length < 5) mal(`Fuentes: solo ${fuentesCurso.length} referencias fechadas en el curso`);

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

/* 7 · Banco de transferencia del examen ------------------------------- */
if (TRANSFERENCIA.length !== 14) mal(`Examen: hay ${TRANSFERENCIA.length} casos de transferencia; se esperan 14`);
for (const q of TRANSFERENCIA) {
  if (!C.mundos.some((m) => m.id === q.mundo)) mal(`Examen: mundo inválido en «${q.titulo}»`);
  if (q.opciones.length !== 4 || q.respuesta < 0 || q.respuesta >= q.opciones.length) mal(`Examen: opciones/respuesta inválidas en «${q.titulo}»`);
  if (!q.explicacion || !q.pregunta) mal(`Examen: caso sin explicación en «${q.titulo}»`);
}
const bancoExamen = crearBancoExamen();
if (bancoExamen.length !== 64) mal(`Examen: banco de ${bancoExamen.length}; se esperan 64 preguntas`);
for (let prueba = 0; prueba < 40; prueba++) {
  const muestra = seleccionarPreguntasEquilibradas(bancoExamen, 18);
  const cuenta = new Map<string, number>();
  for (const q of muestra) cuenta.set(q.mundo, (cuenta.get(q.mundo) ?? 0) + 1);
  const valores = [...cuenta.values()];
  if (muestra.length !== 18 || cuenta.size !== C.mundos.length || valores.some((n) => n < 2 || n > 3) || Math.max(...valores) - Math.min(...valores) > 1 || new Set(muestra).size !== muestra.length) {
    mal(`Examen: muestreo no equilibrado en iteración ${prueba + 1}`);
    break;
  }
}
console.log(`✔ Examen: ${TRANSFERENCIA.length} casos nuevos; banco de 64 y 40 muestras estratificadas (18, cobertura de 7 mundos) validados.`);

/* 7 · Rutas sugeridas y proyectos finales ---------------------------- */
dup(PROYECTOS.map((x) => x.id), "Proyecto final");
dup(RUTAS_APRENDIZAJE.map((x) => x.id), "Ruta de aprendizaje");
if (PROYECTOS.length !== 3 || RUTAS_APRENDIZAJE.length !== 3) mal("Se esperan 3 rutas y 3 proyectos de cierre");
for (const ruta of RUTAS_APRENDIZAJE) {
  if (!PROYECTOS.some((x) => x.id === ruta.proyecto)) mal(`Ruta ${ruta.id}: proyecto «${ruta.proyecto}» inexistente`);
  for (const ref of ruta.niveles) {
    const m = C.mundos.find((x) => x.id === ref.mundo);
    if (!m?.niveles.some((n) => n.id === ref.nivel)) mal(`Ruta ${ruta.id}: nivel «${ref.mundo}/${ref.nivel}» inexistente`);
  }
}
for (const proyecto of PROYECTOS) {
  if (proyecto.pasos.length < 4 || !proyecto.objetivo || !proyecto.producto) mal(`Proyecto ${proyecto.id}: requiere al menos 4 pasos, objetivo y una entrega`);
  for (const [i, paso] of proyecto.pasos.entries()) {
    if (paso.instrucciones.length < 3 || !paso.evidencia || !paso.entregaParcial || !paso.registro) mal(`Proyecto ${proyecto.id}, paso ${i + 1}: faltan instrucciones, evidencia o espacio de anotación`);
    if (paso.opciones.length < 3 || paso.correcta < 0 || paso.correcta >= paso.opciones.length || !paso.porQue) mal(`Proyecto ${proyecto.id}, paso ${i + 1}: pregunta o explicación inválida`);
  }
}
console.log(`✔ Rutas de aprendizaje y ${PROYECTOS.length} proyectos ficticios validados.`);

/* 7b · Diagramas visuales por nivel -------------------------------- */
const idsNiveles = new Set(niveles.map((n) => n.id));
for (const id of idsNiveles) {
  const visual = CONCEPTOS[id];
  if (!visual) mal(`Diagrama educativo: falta representación visual para «${id}»`);
  else if (visual.kind === "flow" && visual.nodes.length < 3) mal(`Diagrama educativo: flujo incompleto para «${id}»`);
  else if (visual.kind === "layers" && visual.layers.length < 3) mal(`Diagrama educativo: capas incompletas para «${id}»`);
  else if (visual.kind === "compare" && (!visual.left.detail || !visual.right.detail || !visual.takeaway)) mal(`Diagrama educativo: comparación incompleta para «${id}»`);
}
for (const id of Object.keys(CONCEPTOS)) if (!idsNiveles.has(id)) mal(`Diagrama educativo: nivel inexistente «${id}»`);
console.log(`✔ ${Object.keys(CONCEPTOS).length} diagramas conceptuales enlazados a los niveles del curso.`);

/* 7c · Programación de repaso espaciado ------------------------------ */
const fechaPrueba = new Date(2026, 0, 31, 12);
const primerRepaso = siguienteRepaso(0, true, fechaPrueba);
const repasoProgresivo = siguienteRepaso(1, true, fechaPrueba);
const repasoDificil = siguienteRepaso(4, false, fechaPrueba);
if (primerRepaso.nivel !== 1 || primerRepaso.dias !== 1 || primerRepaso.proxima !== "2026-02-01") mal("Repaso: primer intervalo o cruce de mes incorrecto");
if (repasoProgresivo.nivel !== 2 || repasoProgresivo.dias !== 3 || repasoProgresivo.proxima !== "2026-02-03") mal("Repaso: el intervalo no crece tras recordar");
if (repasoDificil.nivel !== 0 || repasoDificil.dias !== 1 || repasoDificil.proxima !== "2026-02-01") mal("Repaso: una tarjeta difícil no vuelve a mañana");
console.log("✔ Repaso espaciado: intervalos crecientes, reinicio si cuesta y fechas al cruzar mes validados.");

/* 8 · Intérprete seguro de Python para laboratorios ------------------ */
const pruebasPython = [
  { nombre: "f-string y variables", codigo: 'ip = "10.0.0.8"\npuerto = 443\nprint(f"{ip}:{puerto}")', esperado: "10.0.0.8:443" },
  { nombre: "bucle y condición", codigo: "total = 0\nfor n in range(1, 6):\n    if n % 2 == 0:\n        total += n\nprint(total)", esperado: "6" },
  { nombre: "listas y append", codigo: 'xs = []\nfor x in ["a", "b"]:\n    xs.append(x)\nprint(xs)', esperado: "[a, b]" },
  { nombre: "estación Python inicial del examen", codigo: 'eventos = ["OK 10.0.0.8", "FAIL 198.51.100.23", "FAIL 198.51.100.23", "FAIL 192.0.2.9"]\nsospechoso = "FAIL 198.51.100.23"\ncontador = 0\nfor evento in eventos:\n    if evento == sospechoso:\n        pass\nprint(f"Intentos sospechosos: {contador}")', esperado: "Intentos sospechosos: 0" },
  { nombre: "solución Python del examen", codigo: 'eventos = ["OK 10.0.0.8", "FAIL 198.51.100.23", "FAIL 198.51.100.23", "FAIL 192.0.2.9"]\nsospechoso = "FAIL 198.51.100.23"\ncontador = 0\nfor evento in eventos:\n    if evento == sospechoso:\n        contador += 1\nprint(f"Intentos sospechosos: {contador}")', esperado: "Intentos sospechosos: 2" },
];
for (const prueba of pruebasPython) {
  const resultado = ejecutarPython(prueba.codigo);
  if (!resultado.ok || resultado.salida.join("\n") !== prueba.esperado) mal(`Python ${prueba.nombre}: salida inesperada (${resultado.error ?? resultado.salida.join(" / ")})`);
}
const escapePython = ejecutarPython('print(globalThis.constructor.constructor("return 1")())');
if (escapePython.ok) mal("Python: se ejecutó una expresión fuera del subconjunto seguro");
else console.log(`✔ Intérprete Python seguro: ${pruebasPython.length} casos y rechazo de JavaScript fuera del lenguaje admitido.`);

/* 9 · Cifrado didáctico: versión nueva y compatibilidad ---------------- */
try {
  const [nuevo, nuevo2] = await Promise.all([aesCifrar("texto ficticio", "clave-de-prueba"), aesCifrar("texto ficticio", "clave-de-prueba")]);
  const descifrado = await aesDescifrar(nuevo, "clave-de-prueba");
  if (!nuevo.startsWith("FV2.") || nuevo === nuevo2 || !descifrado.ok || descifrado.texto !== "texto ficticio") mal("AES-GCM FV2: cifrado aleatorio o ida y vuelta incorrectos");
  const salt = new Uint8Array(16).fill(7), iv = new Uint8Array(12).fill(9);
  const base = await crypto.subtle.importKey("raw", new TextEncoder().encode("clave-de-prueba"), "PBKDF2", false, ["deriveKey"]);
  const key = await crypto.subtle.deriveKey({ name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" }, base, { name: "AES-GCM", length: 256 }, false, ["encrypt"]);
  const bytes = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode("mensaje anterior")));
  const b64 = (u: Uint8Array) => btoa(String.fromCharCode(...u));
  const anterior = await aesDescifrar(`FV.${b64(salt)}.${b64(iv)}.${b64(bytes)}`, "clave-de-prueba");
  if (!anterior.ok || anterior.texto !== "mensaje anterior") mal("AES-GCM: no se pudo leer un paquete FV anterior");
  else console.log("✔ AES-GCM: formato FV2 aleatorio y lectura retrocompatible de FV validados.");
} catch (error) {
  mal(`AES-GCM: prueba fallida (${(error as Error).message})`);
}

/* 10 · LAB_LUGAR: el botón «Ver el nivel completo» --------------------- */
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

/* 11 · Metadatos ---------------------------------------------------- */
if (!C.meta?.nombre || !C.meta?.autor) mal("meta incompleta");
const html = readFileSync(fileURLToPath(new URL("../index.html", import.meta.url)), "utf8");
const desc = html.match(/name="description"\s+content="([^"]+)"/)?.[1] ?? "";
if (!desc) mal("index.html: falta la descripción");
else if (!desc.includes(String(totalNiveles))) avisos.push("index.html: la descripción no menciona el número de niveles");
if (!desc.includes(String(LABS.length))) mal("index.html: la descripción no coincide con el número de laboratorios");
const manifiesto = JSON.parse(readFileSync(fileURLToPath(new URL("../public/manifest.webmanifest", import.meta.url)), "utf8")) as { description?: string };
if (!manifiesto.description?.includes(String(LABS.length))) mal("manifest: descripción desactualizada en número de laboratorios");
const legal = readFileSync(fileURLToPath(new URL("../src/views/Legal.tsx", import.meta.url)), "utf8");
const footer = readFileSync(fileURLToPath(new URL("../src/components/Footer.tsx", import.meta.url)), "utf8");
const app = readFileSync(fileURLToPath(new URL("../src/App.tsx", import.meta.url)), "utf8");
if (!legal.includes("Términos y condiciones") || !legal.includes("Privacidad") || !legal.includes("Google Fonts") || !legal.includes("borrador informativo") || !legal.toLowerCase().includes("política de propiedad intelectual") || !legal.includes("una política no bloquea la copia") || !legal.includes("linkedin.com/in/camargoabdiel")) mal("Documentos legales: falta cobertura de propiedad, transparencia de terceros, crédito LinkedIn o aviso de revisión jurídica");
if (!footer.includes("#/terminos") || !footer.includes("#/privacidad") || !footer.includes("#/propiedad-intelectual") || !footer.includes("C.meta.linkedin") || !app.includes("ruta.v === \"terminos\"") || !app.includes("ruta.v === \"privacidad\"") || !app.includes("ruta.v === \"propiedad\"")) mal("Documentos legales: rutas, crédito LinkedIn o enlaces del footer incompletos");
if (!C.meta.linkedin?.startsWith("https://www.linkedin.com/in/")) mal("Metadatos: falta el perfil de LinkedIn válido del creador");
const nav = readFileSync(fileURLToPath(new URL("../src/components/Nav.tsx", import.meta.url)), "utf8");
const operacion = readFileSync(fileURLToPath(new URL("../src/views/Operacion.tsx", import.meta.url)), "utf8");
const repaso = readFileSync(fileURLToPath(new URL("../src/views/Repaso.tsx", import.meta.url)), "utf8");
const proyectosUI = readFileSync(fileURLToPath(new URL("../src/views/Proyectos.tsx", import.meta.url)), "utf8");
const store = readFileSync(fileURLToPath(new URL("../src/lib/store.ts", import.meta.url)), "utf8");
if (!app.includes("a === \"operacion\"") || !app.includes("a === \"repaso\"") || !app.includes("ruta.v === \"operacion\"") || !app.includes("ruta.v === \"repaso\"") || !footer.includes("#/operacion") || !footer.includes("#/repaso") || !nav.includes("Operación Bóveda") || !nav.includes("Repaso inteligente")) mal("Misión y repaso: faltan rutas o puntos de entrada");
if (!operacion.includes("203.0.113") || !operacion.includes(".example") || !operacion.includes("Caso ficticio") || !operacion.includes("guardarPasoOperacion") || (operacion.match(/correcta: true/g) ?? []).length !== 4 || operacion.includes("fetch(") || operacion.includes("new WebSocket") || operacion.includes("XMLHttpRequest")) mal("Operación Bóveda: evidencia/etapas ficticias, guardado local o aislamiento de red incompletos");
if (!operacion.includes("guardarClasificacionOperacion") || !operacion.includes("guardarNotaOperacion") || !operacion.includes("pistasDeRonda") || !operacion.includes("sin penalización") || !store.includes("ronda: state.operacion.ronda + 1") || !store.includes("clasificaciones: saved.operacion?.clasificaciones") || !legal.includes("clasificaciones de pistas y notas de Operación Bóveda")) mal("Operación Bóveda: clasificación, notas locales, rejugabilidad o aviso de privacidad incompletos");
if (!repaso.includes("calificarRepaso") || !repaso.includes("intervalos crecientes") || !legal.includes("tarjetas de repaso")) mal("Repaso: flujo de tarjetas o transparencia de almacenamiento local incompletos");
if (!store.includes("proyectosNotas") || !store.includes("guardarNotaProyecto") || !proyectosUI.includes("pregunta.instrucciones.map") || !proyectosUI.includes("pregunta.evidencia") || !proyectosUI.includes("guardarNotaProyecto") || !proyectosUI.includes("informe se muestra aquí; no se exporta") || !legal.includes("notas que escribas en los proyectos")) mal("Proyectos: instrucciones paso a paso, evidencia, notas locales o transparencia de privacidad/exportación incompletas");
const proteccionCliente = readFileSync(fileURLToPath(new URL("../src/lib/protect.ts", import.meta.url)), "utf8");
if (proteccionCliente.includes('addEventListener("copy"')) mal("Protección cliente: no interceptar el portapapeles como mecanismo anti-copia");
else console.log("✔ Términos, privacidad, propiedad intelectual, navegación legal y metadatos validados.");

/* Resultado ---------------------------------------------------------- */
for (const a of avisos) console.log(`· aviso: ${a}`);
if (problemas.length) {
  console.log(`\n${problemas.length} problema(s):`);
  for (const p of problemas) console.log(`  ✗ ${p}`);
  process.exit(1);
}
console.log(`\n✔ Todo en orden (${niveles.length} niveles revisados, ${pares.length} enlaces de lab).`);
void dirname;
