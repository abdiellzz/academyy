import { useEffect, useMemo, useRef, useState } from "react";
import { PixelIcon } from "../components/PixelArt";
import { LearningFlow } from "../components/LearningFlow";
import { Bar } from "../components/ui";
import { ejecutarPython } from "../lib/py";
import { C, totalNiveles } from "../lib/content";
import { guardarExamen, nivelCompleto, registrarFalloRepaso, useProgreso } from "../lib/store";
import { sfx } from "../lib/sonido";
import type { Ruta } from "../types";
import { cn } from "../utils/cn";

/* ═══════════════════════════════════════════════════════════════════
   EXAMEN FINAL · 18 preguntas aleatorias + 2 laboratorios prácticos, 25 min.
   Banco de nivel + casos de transferencia; desbloqueo tras completar la ruta.
   ═══════════════════════════════════════════════════════════════════ */

interface PreguntaBase {
  mundo: string;
  mundoColor: string;
  titulo: string;
  pregunta: string;
  explicacion: string;
}
interface PreguntaOpcion extends PreguntaBase { tipo: "opcion"; opciones: string[]; respuesta: number }
interface PreguntaPython extends PreguntaBase { tipo: "python"; codigoInicial: string; esperado: string; respuesta: string; pista: string }
interface FlujoRed { hora: string; origen: string; destino: string; protocolo: string; nota: string }
interface PreguntaCaptura extends PreguntaBase { tipo: "captura"; flujos: FlujoRed[]; respuesta: number }
type Pregunta = PreguntaOpcion | PreguntaPython | PreguntaCaptura;

const TOTAL = 20;
const ESTACIONES_PRACTICAS = 2;
const MINUTOS = 25;
const APROBADO = 70;

function barajar<T>(lista: T[]): T[] {
  const a = [...lista];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function crearBancoExamen(): PreguntaOpcion[] {
  const deNiveles = C.mundos.flatMap((m) =>
    m.niveles.map((n) => ({
      tipo: "opcion" as const,
      mundo: m.nombre.replace("Mundo ", ""),
      mundoColor: m.color,
      titulo: n.titulo,
      pregunta: n.reto.pregunta,
      opciones: n.reto.opciones,
      respuesta: n.reto.respuesta,
      explicacion: n.reto.explicacion,
    })),
  );
  return [...deNiveles, ...TRANSFERENCIA.map((q) => {
    const m = C.mundos.find((x) => x.id === q.mundo);
    return { ...q, mundo: m?.nombre.replace("Mundo ", "") ?? q.mundo, mundoColor: m?.color ?? "var(--accent)" };
  })];
}

/** Muestreo estratificado: incluye todos los mundos y mantiene sus cuotas a ±1. */
export function seleccionarPreguntasEquilibradas(lista: PreguntaOpcion[], cantidad: number): PreguntaOpcion[] {
  if (cantidad <= 0) return [];
  if (lista.length <= cantidad) return barajar(lista);
  const porMundo = new Map<string, PreguntaOpcion[]>();
  for (const pregunta of barajar(lista)) porMundo.set(pregunta.mundo, [...(porMundo.get(pregunta.mundo) ?? []), pregunta]);
  const grupos = barajar([...porMundo].map(([mundo, preguntas]) => ({ mundo, preguntas })));
  const elegidas: PreguntaOpcion[] = [];
  const conteo = new Map(grupos.map(({ mundo }) => [mundo, 0]));
  // Primera y segunda vuelta: al menos dos preguntas de cada mundo cuando hay banco suficiente.
  for (let vuelta = 0; vuelta < 2 && elegidas.length < cantidad; vuelta++) {
    for (const grupo of grupos) {
      if (elegidas.length >= cantidad) break;
      const pregunta = grupo.preguntas.pop();
      if (pregunta) {
        elegidas.push(pregunta);
        conteo.set(grupo.mundo, (conteo.get(grupo.mundo) ?? 0) + 1);
      }
    }
  }
  while (elegidas.length < cantidad) {
    const disponibles = grupos.filter((g) => g.preguntas.length && (conteo.get(g.mundo) ?? 0) === Math.min(...grupos.filter((x) => x.preguntas.length).map((x) => conteo.get(x.mundo) ?? 0)));
    if (!disponibles.length) break;
    const grupo = disponibles[Math.floor(Math.random() * disponibles.length)];
    const pregunta = grupo.preguntas.pop();
    if (pregunta) {
      elegidas.push(pregunta);
      conteo.set(grupo.mundo, (conteo.get(grupo.mundo) ?? 0) + 1);
    }
  }
  return barajar(elegidas);
}

const transferencia = (mundo: string, titulo: string, pregunta: string, opciones: string[], respuesta: number, explicacion: string): PreguntaOpcion => ({
  tipo: "opcion", mundo, mundoColor: "", titulo, pregunta, opciones, respuesta, explicacion,
});

// Preguntas nuevas de transferencia: aplican el concepto a un caso distinto al reto del nivel.
export const TRANSFERENCIA: PreguntaOpcion[] = [
  transferencia("seguridad", "Recuperación de cuenta", "Detectas un inicio de sesión que no reconoces en tu correo. ¿Qué acción es más segura primero?", [
    "Responder al mensaje de alerta y enviar el código que te soliciten",
    "Desde un dispositivo confiable, cambiar la clave, revocar sesiones y revisar los métodos de recuperación",
    "Borrar la aplicación de correo del teléfono",
    "Cambiar solo el nombre visible de la cuenta"
  ], 1, "Usa una ruta confiable para recuperar el control, invalida sesiones activas y revisa reenvíos y factores de recuperación. No uses enlaces del aviso sospechoso."),
  transferencia("seguridad", "Contraseña reutilizada", "Una filtración expone la contraseña que también usabas para tu correo. ¿Qué cambio reduce mejor el riesgo en las demás cuentas?", [
    "Añadir un signo de exclamación a la misma contraseña en cada sitio",
    "Cambiar primero el correo principal por una clave única, cerrar sesiones y actualizar las demás claves reutilizadas",
    "Esperar a que cada sitio envíe un aviso",
    "Usar la misma clave con mayúsculas distintas"
  ], 1, "Las variaciones predecibles siguen siendo reutilización. Protege primero el correo y usa claves distintas guardadas en un gestor."),
  transferencia("redes", "Rutas dentro de una LAN", "Un equipo 10.0.0.24/24 contacta a 10.0.0.90/24. ¿Qué ocurre normalmente si ambos están en la misma subred?", [
    "El tráfico debe pasar por el router de Internet",
    "El host resuelve la dirección de enlace y envía el tráfico dentro de la LAN",
    "El servidor DNS cifra la conexión",
    "El firewall del proveedor asigna la dirección MAC"
  ], 1, "Con la misma máscara /24 comparten subred; la comunicación local no necesita salir al gateway, aunque puede atravesar un switch o controles internos."),
  transferencia("redes", "DNS o conectividad", "Una captura muestra respuesta DNS con la IP correcta, pero la conexión TCP a HTTPS agota el tiempo. ¿Qué conviene revisar después?", [
    "La resolución DNS: no devolvió dirección",
    "Ruta, filtrado o disponibilidad del servicio TCP/443",
    "El cifrado AES de la página",
    "El nombre de usuario del servidor"
  ], 1, "DNS ya resolvió el nombre. Sigue el flujo hacia la IP: ruta, firewall, puerto o servicio pueden impedir TCP aunque DNS funcione."),
  transferencia("sistemas", "Mínimo privilegio", "Un servicio solo necesita leer archivos de una carpeta. ¿Cómo limitarías el impacto si su proceso se compromete?", [
    "Ejecutarlo como administrador para evitar errores de permisos",
    "Usar una cuenta de servicio dedicada y conceder lectura solo a esa carpeta",
    "Dar permisos de escritura a todos los usuarios",
    "Desactivar todos los registros del sistema"
  ], 1, "Una cuenta dedicada con permisos mínimos reduce qué puede leer, cambiar o ejecutar el proceso comprometido."),
  transferencia("sistemas", "Cambio sospechoso en el sistema", "Un registro indica que un ejecutable nuevo se inicia desde una carpeta temporal al iniciar sesión. ¿Qué respuesta defensiva es mejor?", [
    "Ejecutarlo con sudo para ver qué hace",
    "Aislar el equipo según el procedimiento, conservar evidencia y verificar el archivo con herramientas confiables",
    "Borrar todos los registros para que no se repita la alerta",
    "Subir el archivo a un foro público"
  ], 1, "No ejecutes el artefacto. Conserva registros y contexto, limita exposición y usa un proceso de análisis autorizado."),
  transferencia("python", "Filtrar antes de contar", "Necesitas contar fallos de inicio de sesión de una IP concreta. ¿Qué lógica es más clara?", [
    "Contar todas las líneas y restar las exitosas a ojo",
    "Recorrer los eventos y aumentar un contador solo cuando coincidan el estado fallido y la IP",
    "Ordenar las IP y asumir que la primera es sospechosa",
    "Convertir todos los eventos a mayúsculas y borrarlos"
  ], 1, "Una condición explícita sobre estado e indicador hace el conteo repetible; valida también la ventana temporal y el contexto."),
  transferencia("python", "Manejo de datos", "Un script calcula promedio con suma/longitud. ¿Qué control debe añadir si la lista puede estar vacía?", [
    "Añadir 1 a la suma siempre",
    "Comprobar que haya elementos antes de dividir y definir qué hacer si no hay datos",
    "Cambiar el resultado a texto",
    "Ordenar la lista antes de dividir"
  ], 1, "Trata explícitamente la lista vacía: informa que no hay datos o devuelve un valor definido por el programa."),
  transferencia("cripto", "Integridad o confidencialidad", "Publicas el SHA-256 de un archivo para detectar cambios accidentales. ¿Qué garantiza por sí solo ese hash?", [
    "Que el archivo permanezca secreto",
    "Una huella para comparar integridad; no cifra el archivo ni prueba quién lo publicó",
    "Que el autor sea quien dice ser",
    "Que el archivo no contenga malware"
  ], 1, "Un hash permite comparar huellas, pero sin un canal auténtico alguien podría reemplazar tanto el archivo como el hash. No es cifrado ni antivirus."),
  transferencia("cripto", "Cifrado autenticado", "Una aplicación necesita cifrar datos y detectar alteraciones. ¿Qué aporta AES-GCM correctamente usado?", [
    "Compresión y anonimato",
    "Confidencialidad e integridad/autenticidad del mensaje cifrado",
    "Una firma digital verificable por cualquiera sin clave",
    "Una contraseña imposible de adivinar"
  ], 1, "AES-GCM es cifrado autenticado: detecta alteraciones. Requiere una clave segura y no reutilizar un nonce con la misma clave."),
  transferencia("social", "Verificación por otro canal", "Alguien que dice ser soporte te llama y pide el código TOTP para cancelar una compra. ¿Qué haces?", [
    "Leer el código si conoce tu nombre completo",
    "No compartirlo; cortar la llamada y contactar al servicio por un canal oficial que tú busques",
    "Pedirle un enlace para verificar su identidad",
    "Compartir solo los primeros tres dígitos"
  ], 1, "Un código de un solo uso puede completar una autenticación. Corta el contacto entrante y verifica por un canal oficial independiente."),
  transferencia("social", "Enlace con urgencia", "Un mensaje dice que tu cuenta se borrará en diez minutos e incluye un enlace abreviado. ¿Cuál es la respuesta más segura?", [
    "Abrirlo en modo incógnito",
    "No usar el enlace; abrir la app o dirección oficial por separado y revisar allí el aviso",
    "Reenviarlo a amistades para ver qué opinan",
    "Responder con tu correo para confirmar la cuenta"
  ], 1, "La urgencia y el enlace opaco son señales para pausar. Verifica por una ruta que ya conoces, no por la que entrega el mensaje."),
  transferencia("web", "Consulta SQL segura", "Una búsqueda debe encontrar una cuenta cuyo nombre llegó desde un formulario. ¿Cómo integras el dato en SQL?", [
    "Concatenarlo tras borrar comillas con replace()",
    "Enviarlo como parámetro separado en una consulta preparada",
    "Codificarlo en Base64 y concatenarlo",
    "Ocultar el campo del formulario"
  ], 1, "Los parámetros separan valores de la sintaxis SQL. La validación complementa, pero no sustituye, la parametrización."),
  transferencia("web", "Autorización por recurso", "La ruta /facturas/204 devuelve datos. ¿Qué debe comprobar el servidor en cada petición autenticada?", [
    "Que el usuario conoce el número de factura",
    "Que la identidad actual tiene permiso sobre esa factura concreta",
    "Que el botón de la interfaz estaba oculto",
    "Que la URL usa HTTPS, por sí solo"
  ], 1, "La autenticación identifica al usuario; la autorización comprueba si puede acceder a ese objeto. No confíes en ocultar IDs en la interfaz."),
];

const PRACTICAS: (PreguntaPython | PreguntaCaptura)[] = [
  {
    tipo: "python",
    mundo: "Python",
    mundoColor: "#72d7ab",
    titulo: "Triage de registros",
    pregunta: "Ejecuta el código y completa el contador para averiguar cuántos intentos fallidos provienen de 198.51.100.23.",
    codigoInicial: `eventos = ["OK 10.0.0.8", "FAIL 198.51.100.23", "FAIL 198.51.100.23", "FAIL 192.0.2.9"]\nsospechoso = "FAIL 198.51.100.23"\ncontador = 0\nfor evento in eventos:\n    if evento == sospechoso:\n        pass\nprint(f"Intentos sospechosos: {contador}")`,
    esperado: "Intentos sospechosos: 2",
    respuesta: "Intentos sospechosos: 2",
    pista: "Dentro del if, suma uno al contador con: contador += 1",
    explicacion: "El filtro cuenta solo coincidencias exactas del indicador. En un análisis real, valida el contexto y no atribuyas actividad maliciosa solo por una IP.",
  },
  {
    tipo: "captura",
    mundo: "Redes · laboratorio",
    mundoColor: "#55c7d4",
    titulo: "Inspección de tráfico",
    pregunta: "Tras ejecutar un archivo descargado, ¿qué flujo priorizarías para investigar? La captura es ficticia y usa rangos reservados para ejemplos.",
    flujos: [
      { hora: "10:14:02", origen: "10.0.0.24", destino: "10.0.0.1:53", protocolo: "UDP · DNS", nota: "Consulta a nombre interno" },
      { hora: "10:14:05", origen: "10.0.0.24", destino: "198.51.100.42:443", protocolo: "TCP · HTTPS", nota: "Sesión con portal educativo" },
      { hora: "10:14:08", origen: "10.0.0.24", destino: "203.0.113.77:4444", protocolo: "TCP", nota: "Conexión persistente; aparece justo después de ejecutar el archivo" },
      { hora: "10:14:12", origen: "10.0.0.24", destino: "192.0.2.123:123", protocolo: "UDP · NTP", nota: "Sincronización de hora" },
    ],
    respuesta: 2,
    explicacion: "El flujo merece prioridad por la coincidencia temporal con la ejecución y el destino/puerto inesperados. Un puerto por sí solo no prueba compromiso: correlaciónalo con proceso, DNS, registros del equipo y contexto.",
  },
];

function esCorrecta(q: Pregunta, valor: number | string | undefined): boolean {
  if (q.tipo === "python") return typeof valor === "string" && valor.trim() === q.esperado.trim();
  return valor === q.respuesta;
}

const dosDigitos = (n: number) => String(n).padStart(2, "0");

export function Examen({ go }: { go: (r: Ruta) => void }) {
  const [p] = useProgreso();
  const rutaCompleta = C.mundos.every((m) => m.niveles.every((n) => nivelCompleto(p, `${m.id}/${n.id}`)));
  const mundoPendiente = C.mundos.find((m) => !m.niveles.every((n) => nivelCompleto(p, `${m.id}/${n.id}`)));
  const [fase, setFase] = useState<"intro" | "curso" | "fin">("intro");
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [i, setI] = useState(0);
  const [respuestas, setRespuestas] = useState<Record<number, number | string>>({});
  const [codigos, setCodigos] = useState<Record<number, string>>({});
  const [salidasPy, setSalidasPy] = useState<Record<number, { texto: string; error?: string }>>({});
  const [restante, setRestante] = useState(MINUTOS * 60);
  const [nota, setNota] = useState(0);
  const [segundos, setSegundos] = useState(0);
  const finRef = useRef(false);

  const total = useMemo(() => crearBancoExamen().length, []);
  const nivelesHechos = C.mundos.reduce((sum, m) => sum + m.niveles.filter((n) => nivelCompleto(p, `${m.id}/${n.id}`)).length, 0);

  useEffect(() => {
    if (fase !== "curso") return;
    const t = window.setInterval(() => {
      setRestante((r) => {
        if (r <= 1) {
          window.clearInterval(t);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => window.clearInterval(t);
  }, [fase]);

  useEffect(() => {
    if (fase === "curso" && restante === 0) terminar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restante, fase]);

  function empezar() {
    // El estado de React no basta como control de acceso: volver a validar justo antes del examen.
    if (!rutaCompleta) return;
    const preguntasBase = seleccionarPreguntasEquilibradas(crearBancoExamen(), TOTAL - ESTACIONES_PRACTICAS);
    setPreguntas(barajar([...preguntasBase, ...PRACTICAS]));
    setRespuestas({});
    setCodigos({});
    setSalidasPy({});
    setI(0);
    setRestante(MINUTOS * 60);
    finRef.current = false;
    setFase("curso");
  }

  function terminar() {
    if (finRef.current) return;
    finRef.current = true;
    const aciertos = preguntas.reduce((a, q, k) => a + (esCorrecta(q, respuestas[k]) ? 1 : 0), 0);
    const n = Math.round((aciertos / Math.max(1, preguntas.length)) * 100);
    for (const [k, pregunta] of preguntas.entries()) {
      if (esCorrecta(pregunta, respuestas[k]) || pregunta.tipo === "python") continue;
      registrarFalloRepaso({
        id: `examen-${pregunta.mundo}-${pregunta.tipo}-${pregunta.titulo}`,
        tema: `Examen · ${pregunta.mundo}`,
        pregunta: pregunta.pregunta,
        opciones: pregunta.tipo === "opcion" ? pregunta.opciones : pregunta.flujos.map((f) => `${f.protocolo} · ${f.origen} → ${f.destino}`),
        respuesta: pregunta.respuesta,
        explicacion: pregunta.explicacion,
      });
    }
    const usados = MINUTOS * 60 - restante;
    setNota(n);
    setSegundos(usados);
    guardarExamen({ nota: n, aciertos, total: preguntas.length, fecha: new Date().toISOString(), segundos: usados, estacionesPracticas: ESTACIONES_PRACTICAS });
    sfx(n >= APROBADO ? "subir" : "error");
    setFase("fin");
  }

  const q = preguntas[i];
  const contestadas = Object.keys(respuestas).length;
  const codigoActual = q?.tipo === "python" ? codigos[i] ?? q.codigoInicial : "";
  function editarCodigo(codigo: string) {
    setCodigos((c) => ({ ...c, [i]: codigo }));
    setRespuestas((r) => { const next = { ...r }; delete next[i]; return next; });
    setSalidasPy((s) => { const next = { ...s }; delete next[i]; return next; });
  }
  function correrPython() {
    if (!q || q.tipo !== "python") return;
    const result = ejecutarPython(codigoActual);
    const texto = result.salida.join("\n");
    setSalidasPy((s) => ({ ...s, [i]: { texto, error: result.error } }));
    setRespuestas((r) => ({ ...r, [i]: result.error ? "" : texto }));
  }

  /* ───────────── intro ───────────── */
  if (fase === "intro") {
    return (
      <main id="main" className="mx-auto max-w-[900px] px-4 py-10">
        <p className="label !text-[var(--accent)]">Examen final</p>
        <h1 className="mt-2">La prueba de la bóveda</h1>
        <p className="mt-3 text-[17px] leading-relaxed text-[var(--text-2)]">
          {TOTAL - ESTACIONES_PRACTICAS} preguntas de conocimiento equilibradas entre los 7 mundos (al menos dos por mundo) y {ESTACIONES_PRACTICAS} estaciones prácticas de Python y análisis de tráfico, en {MINUTOS} minutos. Sin mirar la teoría: interpreta evidencias, ejecuta código y explica decisiones. Para recibir el certificado, completa primero todos los mundos y aprueba con <b className="text-[var(--text)]">{APROBADO} o más</b>.
        </p>
        <LearningFlow title="Qué harás durante la prueba" className="mt-4 max-w-[720px]" steps={[{ label: "Interpretar", icon: "search" }, { label: "Razonar", icon: "torch" }, { label: "Practicar", icon: "pickaxe" }, { label: "Revisar", icon: "flag" }]} />

        <div className="exam-prep-grid mt-6">
          <section className="exam-requirements card" aria-labelledby="exam-requirements-title">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="label !text-[var(--accent)]">Antes de empezar</p>
                <h2 id="exam-requirements-title" className="mt-1">{rutaCompleta ? "Ruta completa" : "Primero completa los mundos"}</h2>
              </div>
              <span className={rutaCompleta ? "exam-ready" : "exam-locked"} aria-live="polite">{rutaCompleta ? "LISTA" : "BLOQUEADO"}</span>
            </div>
            <p className="mt-2 text-[14px] text-[var(--text-2)]">{nivelesHechos}/{totalNiveles} niveles completados</p>
            <div className="mt-2"><Bar value={(nivelesHechos / Math.max(1, totalNiveles)) * 100} color={rutaCompleta ? "var(--green)" : "var(--accent)"} label="Niveles completados para desbloquear el examen" /></div>
            <ul className="exam-world-list" aria-label="Avance por mundo">
              {C.mundos.map((m) => {
                const hechos = m.niveles.filter((n) => nivelCompleto(p, `${m.id}/${n.id}`)).length;
                const completo = hechos === m.niveles.length;
                return <li key={m.id} className={completo ? "is-complete" : ""}><span aria-hidden>{completo ? "✓" : "·"}</span><span>{m.nombre.replace("Mundo ", "")}</span><small>{hechos}/{m.niveles.length}</small></li>;
              })}
            </ul>
            {!rutaCompleta && mundoPendiente && (
              <button className="btn btn-sm mt-3" onClick={() => go({ v: "mundo", id: mundoPendiente.id })}>
                Continuar con {mundoPendiente.nombre.replace("Mundo ", "")} <span aria-hidden>→</span>
              </button>
            )}
          </section>
          <section className="exam-certificate-card" aria-label="Vista previa no editable del certificado">
            <p className="label">Así se verá tu certificado</p>
            <div className="exam-certificate-preview" aria-label="Muestra estática, no editable">
              <span className="exam-preview-brand">FACTIONVAULT <small>CONSTANCIA</small></span>
              <h2>Certificado</h2>
              <p>DE FINALIZACIÓN</p>
              <small>OTORGADO A</small>
              <b>Nombre de ejemplo</b>
              <span className="exam-preview-rule" />
              <footer><span>{C.mundos.length} mundos<br />{totalNiveles} niveles</span><strong>70+<small>/100</small></strong></footer>
              <span className="exam-preview-watermark">VISTA PREVIA</span>
            </div>
            <p className="mt-2 text-[12px] text-[var(--text-3)]">Diseño de muestra · sin edición, descarga ni impresión.</p>
          </section>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            { icon: "sword" as const, t: `${TOTAL - ESTACIONES_PRACTICAS} preguntas`, d: `Elegidas al azar de un banco de ${total} retos y casos de transferencia.` },
            { icon: "pickaxe" as const, t: `${ESTACIONES_PRACTICAS} mini laboratorios`, d: "Escribe y ejecuta Python; analiza una captura de red ficticia." },
            { icon: "diamond" as const, t: `${MINUTOS} min · ${APROBADO}/100`, d: "El tiempo incluye los laboratorios. 90+ es matrícula de honor." },
          ].map((x) => (
            <div key={x.t} className="card p-4">
              <PixelIcon name={x.icon} size={26} />
              <p className="mt-2 text-[17px] font-bold">{x.t}</p>
              <p className="mt-1 text-[14px] text-[var(--text-2)]">{x.d}</p>
            </div>
          ))}
        </div>

        {p.examenes > 0 && (
          <div className="card mt-4 flex flex-wrap items-center gap-4 p-4">
            <div>
              <p className="label">Tu mejor nota</p>
              <p className="mono text-[28px]" style={{ color: p.examenMejor >= APROBADO ? "var(--green)" : "var(--accent)" }}>
                {p.examenMejor}/100
              </p>
            </div>
            <div>
              <p className="label">Intentos</p>
              <p className="mono text-[28px] text-[var(--text-2)]">{p.examenes}</p>
            </div>
            {p.ultimoExamen && (
              <p className="text-[14px] text-[var(--text-3)]">
                Último: {new Date(p.ultimoExamen.fecha).toLocaleDateString("es")} · {p.ultimoExamen.aciertos}/
                {p.ultimoExamen.total} aciertos
              </p>
            )}
            {p.examenMejor >= APROBADO && rutaCompleta && (
              <button className="btn btn-sm ml-auto" onClick={() => go({ v: "certificado" })}>
                <PixelIcon name="chest" size={12} /> Ver mi certificado
              </button>
            )}
            {p.examenMejor >= APROBADO && !rutaCompleta && mundoPendiente && (
              <button className="btn btn-sm ml-auto" onClick={() => go({ v: "mundo", id: mundoPendiente.id })}>
                Completar {mundoPendiente.nombre.replace("Mundo ", "")}
              </button>
            )}
          </div>
        )}

        <button className="btn btn-primary mt-6 w-full sm:w-auto" onClick={empezar} disabled={!rutaCompleta} aria-describedby={!rutaCompleta ? "exam-lock-reason" : undefined}>
          <PixelIcon name={rutaCompleta ? "sword" : "shield"} size={16} /> {rutaCompleta ? "Empezar el examen" : "Examen bloqueado"}
        </button>
        <p id="exam-lock-reason" className="mt-3 text-[13px] text-[var(--text-3)]">
          {rutaCompleta ? "Se puede repetir las veces que quieras: guarda tu mejor nota, no la última." : "Completa el reto final de cada nivel en los 7 mundos para habilitar el examen."}
        </p>
      </main>
    );
  }

  /* ───────────── en curso ───────────── */
  if (fase === "curso" && q) {
    const min = Math.floor(restante / 60);
    const seg = restante % 60;
    return (
      <main id="main" className="mx-auto max-w-[820px] px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="label !text-[var(--accent)]">
            Pregunta {i + 1} de {preguntas.length}
          </p>
          <div className="flex items-center gap-3">
            <span className="chip">{contestadas} contestadas</span>
            <span
              className="chip mono"
              role="timer"
              aria-label={`Tiempo restante: ${min} minutos y ${seg} segundos`}
              aria-live="off"
              style={{ color: restante < 120 ? "var(--red)" : "var(--text-2)", borderColor: restante < 120 ? "var(--red)" : undefined }}
            >
              ⏱ {dosDigitos(min)}:{dosDigitos(seg)}
            </span>
          </div>
        </div>
        <div className="mt-2">
          <Bar value={(contestadas / preguntas.length) * 100} color="var(--accent)" label="Preguntas contestadas del examen" />
        </div>

        <article className="card mt-5 p-5" aria-labelledby={`question-${i}`}>
          <div className="flex flex-wrap items-center gap-2">
            <p className="label" style={{ color: q.mundoColor }}>{q.mundo}</p>
            {q.tipo !== "opcion" && <span className="chip !text-[var(--green)]">Estación práctica · {q.tipo === "python" ? "Python" : "redes"}</span>}
          </div>
          <h2 id={`question-${i}`} className="mt-2 text-[20px]" aria-live="polite">{q.titulo}</h2>
          <p className="mt-2 text-[16px] leading-relaxed text-[var(--text-2)]">{q.pregunta}</p>
          {q.tipo === "opcion" && (
            <fieldset className="exam-options mt-4">
              <legend className="sr-only">Selecciona una respuesta</legend>
              {q.opciones.map((o, k) => {
                const sel = respuestas[i] === k;
                return (
                  <label key={o} className={cn("exam-option", sel && "is-selected")}>
                    <input type="radio" name={`respuesta-${i}`} value={k} checked={sel} onChange={() => setRespuestas((r) => ({ ...r, [i]: k }))} />
                    <span className="exam-option-letter" aria-hidden>{String.fromCharCode(65 + k)}</span>
                    <span>{o}</span>
                  </label>
                );
              })}
            </fieldset>
          )}
          {q.tipo === "python" && (
            <div className="exam-lab mt-4">
              <label className="label" htmlFor={`exam-code-${i}`}>Editor Python · se ejecuta localmente con funciones limitadas</label>
              <textarea id={`exam-code-${i}`} className="field mono mt-2 min-h-[210px] w-full leading-relaxed" spellCheck={false} value={codigoActual} onChange={(e) => editarCodigo(e.target.value)} />
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <button className="btn btn-primary btn-sm" onClick={correrPython}>Ejecutar y comprobar</button>
                <details className="text-[13px] text-[var(--text-3)]"><summary className="cursor-pointer underline">Ver pista</summary><p className="mt-1">{q.pista}</p></details>
              </div>
              <div className="mt-3 border border-[var(--border-neutral)] bg-[var(--bg-sunken)] p-3" aria-live="polite">
                <p className="label">Salida de la consola</p>
                <pre className="mono mt-2 whitespace-pre-wrap text-[14px]">{salidasPy[i]?.error ? <span className="text-[var(--red)]">{salidasPy[i].error}</span> : salidasPy[i]?.texto || "Ejecuta el código para comprobar tu solución."}</pre>
                {respuestas[i] !== undefined && <p className={cn("mt-2 text-[13px]", esCorrecta(q, respuestas[i]) ? "text-[var(--green)]" : "text-[var(--accent)]")} role="status">{esCorrecta(q, respuestas[i]) ? "Resultado correcto. Estación completada." : "Aún no coincide; corrige el programa y vuelve a ejecutar."}</p>}
              </div>
            </div>
          )}
          {q.tipo === "captura" && (
            <fieldset className="exam-options mt-4">
              <legend className="sr-only">Selecciona el flujo que investigarías primero</legend>
              {q.flujos.map((f, k) => {
                const sel = respuestas[i] === k;
                return <label key={`${f.hora}-${f.destino}`} className={cn("exam-option items-start", sel && "is-selected")}>
                  <input className="mt-1" type="radio" name={`flujo-${i}`} value={k} checked={sel} onChange={() => setRespuestas((r) => ({ ...r, [i]: k }))} />
                  <span className="min-w-0"><b className="mono block text-[var(--text)]">{f.hora} · {f.protocolo}</b><span className="mono mt-1 block break-all text-[12px]">{f.origen} → {f.destino}</span><small className="mt-1 block text-[13px] text-[var(--text-3)]">{f.nota}</small></span>
                </label>;
              })}
            </fieldset>
          )}
        </article>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button className="btn" onClick={() => setI((v) => Math.max(0, v - 1))} disabled={i === 0}>
            ◀ Anterior
          </button>
          {i < preguntas.length - 1 ? (
            <button className="btn btn-primary" onClick={() => setI((v) => v + 1)}>
              Siguiente ▶
            </button>
          ) : (
            <button className="btn btn-primary" onClick={terminar}>
              Entregar examen
            </button>
          )}
          <div className="ml-auto flex flex-wrap gap-1">
            {preguntas.map((_, k) => (
              <button
                key={k}
                onClick={() => setI(k)}
                aria-label={`Ir a la pregunta ${k + 1}${respuestas[k] !== undefined ? ", contestada" : ", sin contestar"}`}
                aria-current={k === i ? "step" : undefined}
                className={cn(
                  "h-6 w-6 border-2 border-black text-[10px]",
                  k === i ? "bg-[var(--accent)] text-black" : respuestas[k] !== undefined ? "bg-[var(--surface-3)]" : "bg-[var(--surface-2)] text-[var(--text-3)]",
                )}
              >
                {k + 1}
              </button>
            ))}
          </div>
        </div>
      </main>
    );
  }

  /* ───────────── resultado ───────────── */
  const aprobado = nota >= APROBADO;
  const aciertos = preguntas.reduce((a, qq, k) => a + (esCorrecta(qq, respuestas[k]) ? 1 : 0), 0);
  const fallos = preguntas.map((qq, k) => ({ qq, k })).filter(({ qq, k }) => !esCorrecta(qq, respuestas[k]));

  return (
    <main id="main" className="mx-auto max-w-[860px] px-4 py-10">
      <p className="label !text-[var(--accent)]">Resultado</p>
      <h1 className="mt-2">{aprobado ? "¡Aprobado!" : "Todavía no"}</h1>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="card p-4 sm:col-span-1">
          <p className="label">Nota final</p>
          <p className="mono text-[44px] leading-none" style={{ color: aprobado ? "var(--green)" : "var(--red)" }}>
            {nota}
            <span className="text-[20px] text-[var(--text-3)]">/100</span>
          </p>
          <p className="mt-2 text-[14px] text-[var(--text-2)]">
            {aciertos} de {preguntas.length} correctas en {Math.floor(segundos / 60)} min {segundos % 60} s
          </p>
        </div>
        <div className="card p-4 sm:col-span-2">
          <p className="label">Qué significa</p>
          <p className="mt-1 text-[15px] leading-relaxed text-[var(--text-2)]">
            {aprobado
              ? rutaCompleta
                ? `Aprobaste el examen y completaste todos los mundos. Ya puedes emitir tu certificado de finalización.`
                : `Aprobaste el examen. Para habilitar el certificado, todavía debes completar todos los niveles de los mundos.`
              : `Necesitas ${APROBADO} para aprobar. Repasa las respuestas y vuelve a intentarlo: puedes repetirlo sin límite.`}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {aprobado && rutaCompleta ? (
              <button className="btn btn-primary" onClick={() => go({ v: "certificado" })}>
                <PixelIcon name="chest" size={14} /> Ver el certificado
              </button>
            ) : aprobado && mundoPendiente ? (
              <button className="btn btn-primary" onClick={() => go({ v: "mundo", id: mundoPendiente.id })}>
                <PixelIcon name="grass" size={14} /> Seguir con {mundoPendiente.nombre.replace("Mundo ", "")}
              </button>
            ) : (
              <button className="btn btn-primary" onClick={empezar}>
                Repetir examen
              </button>
            )}
            <button className="btn" onClick={() => go({ v: "inicio" })}>
              Volver al inicio
            </button>
          </div>
        </div>
      </div>

      {fallos.length > 0 && (
        <section className="mt-6">
          <p className="label">Para repasar ({fallos.length})</p>
          <div className="mt-2 space-y-2">
            {fallos.map(({ qq, k }) => (
              <div key={k} className="card p-3">
                <p className="label" style={{ color: qq.mundoColor }}>
                  {qq.mundo} · {qq.titulo}
                </p>
                <p className="mt-1 text-[16px] font-bold">{qq.titulo}</p>
                <p className="mt-1 text-[14px] text-[var(--text-2)]">{qq.pregunta}</p>
                {qq.tipo === "opcion" && <><p className="mt-2 text-[13px] text-[var(--text-3)]">Tu respuesta: {typeof respuestas[k] === "number" ? qq.opciones[respuestas[k] as number] : "Sin responder"}</p><p className="mt-1 text-[15px] text-[var(--green)]">Correcta: {qq.opciones[qq.respuesta]}</p></>}
                {qq.tipo === "python" && <><p className="mt-2 text-[13px] text-[var(--text-3)]">Tu salida: {typeof respuestas[k] === "string" && respuestas[k] ? respuestas[k] : salidasPy[k]?.error ?? "Sin ejecutar"}</p><p className="mt-1 text-[15px] text-[var(--green)]">Salida esperada: {qq.esperado}</p></>}
                {qq.tipo === "captura" && <><p className="mt-2 text-[13px] text-[var(--text-3)]">Tu selección: {typeof respuestas[k] === "number" ? qq.flujos[respuestas[k] as number]?.destino : "Sin responder"}</p><p className="mt-1 text-[15px] text-[var(--green)]">Flujo a investigar: {qq.flujos[qq.respuesta].destino}</p></>}
                <p className="mt-1 text-[14px] text-[var(--text-2)]">{qq.explicacion}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
