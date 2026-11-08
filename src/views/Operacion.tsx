import { useState } from "react";
import { LearningFlow } from "../components/LearningFlow";
import { PixelIcon } from "../components/PixelArt";
import { guardarPasoOperacion, reiniciarOperacion, useProgreso } from "../lib/store";
import { cn } from "../utils/cn";

interface Opcion { texto: string; correcta: boolean; razon: string }
interface Etapa {
  titulo: string;
  etiqueta: string;
  hora: string;
  pregunta: string;
  opciones: Opcion[];
}

const ETAPAS: Etapa[] = [
  {
    titulo: "Un mensaje urgente",
    etiqueta: "Correo recibido",
    hora: "08:41",
    pregunta: "¿Cuál es el siguiente paso más seguro para comprobar el aviso?",
    opciones: [
      { texto: "Abrir el portal desde la app o dirección oficial que ya conoces; no usar el enlace del mensaje.", correcta: true, razon: "La verificación por un canal independiente evita seguir un enlace controlado por quien envió el mensaje." },
      { texto: "Abrir el enlace en modo incógnito para comprobar si la cuenta está activa.", correcta: false, razon: "El modo incógnito no convierte un dominio falso en uno legítimo ni impide que el sitio recopile los datos que escribas." },
      { texto: "Responder al remitente y pedir que confirme que trabaja en soporte.", correcta: false, razon: "La persona que envió el mensaje podría confirmar su propio pretexto. Busca tú un canal oficial independiente." },
    ],
  },
  {
    titulo: "Inicio de sesión desconocido",
    etiqueta: "Registro de acceso",
    hora: "08:47",
    pregunta: "La titular confirma que no reconoce el inicio. ¿Qué respuesta inicial protege mejor la cuenta?",
    opciones: [
      { texto: "Desde un dispositivo confiable, cambiar la clave por una única, revocar sesiones y revisar los métodos de recuperación.", correcta: true, razon: "Recupera el control por una ruta confiable, invalida sesiones activas y comprueba que no hayan cambiado los medios de recuperación." },
      { texto: "Borrar el registro para que no vuelva a aparecer la alerta.", correcta: false, razon: "Borrar evidencia no cierra sesiones ni corrige el acceso; además dificulta entender qué ocurrió." },
      { texto: "Cambiar solo el nombre visible y esperar otro aviso.", correcta: false, razon: "El nombre visible no invalida credenciales ni sesiones posiblemente expuestas." },
    ],
  },
  {
    titulo: "Una regla que nadie recuerda",
    etiqueta: "Configuración de correo",
    hora: "08:52",
    pregunta: "Aparece un reenvío automático a una dirección desconocida. ¿Qué conviene hacer?",
    opciones: [
      { texto: "Documentar la regla, desactivarla desde el panel oficial, revisar reglas y recuperación, y avisar al equipo responsable.", correcta: true, razon: "El reenvío puede mantener acceso a mensajes. Preserva los datos relevantes, elimina la persistencia y revisa cambios relacionados." },
      { texto: "Vaciar toda la bandeja y cerrar la pestaña.", correcta: false, razon: "Vaciar la bandeja no elimina la regla ni permite averiguar cuándo o cómo se creó." },
      { texto: "Enviar un mensaje a la dirección desconocida para preguntar quién es.", correcta: false, razon: "No contactes una dirección sospechosa ni reveles más información; usa canales de soporte que tú busques." },
    ],
  },
  {
    titulo: "Una conexión fuera de patrón",
    etiqueta: "Tráfico simulado",
    hora: "09:03",
    pregunta: "La captura muestra una conexión poco habitual justo después del acceso. ¿Qué informe es responsable?",
    opciones: [
      { texto: "Registrar hora, proceso y destino; correlacionar con DNS y registros, escalar al equipo autorizado y evitar atribuir intención sin más evidencia.", correcta: true, razon: "Una anomalía es una pista, no una conclusión. Correlaciona fuentes y comunica observaciones separadas de hipótesis." },
      { texto: "Declarar que el puerto demuestra quién atacó y publicar la IP.", correcta: false, razon: "Un puerto o una IP por sí solos no prueban identidad ni compromiso. No publiques acusaciones o datos de terceros." },
      { texto: "Escanear direcciones públicas al azar para encontrar el origen.", correcta: false, razon: "Eso sale del alcance autorizado y no valida la evidencia observada. Limítate a los sistemas y procedimientos aprobados." },
    ],
  },
];

function Evidencia({ paso }: { paso: number }) {
  if (paso === 0) return (
    <div className="overflow-hidden border-2 border-black bg-[#111821]">
      <div className="flex items-center gap-2 border-b-2 border-black bg-[#1c2633] px-3 py-2"><PixelIcon name="chest" size={16} /><span className="label">Bandeja · cuenta de demostración</span></div>
      <dl className="grid gap-2 p-3 text-[13px] sm:grid-cols-[90px_1fr]">
        <dt className="text-[var(--text-3)]">De</dt><dd className="m-0 break-all">soporte@cuenta-lucero.example</dd>
        <dt className="text-[var(--text-3)]">Asunto</dt><dd className="m-0">Acción requerida en 15 minutos</dd>
        <dt className="text-[var(--text-3)]">Enlace visible</dt><dd className="mono m-0 break-all text-[var(--accent)]">https://acceso-lucero.example.verificacion.invalid</dd>
        <dt className="text-[var(--text-3)]">Mensaje</dt><dd className="m-0">“Evita el cierre inmediato. Confirma tu contraseña y el código recibido.”</dd>
      </dl>
      <p className="border-t border-white/10 px-3 py-2 text-[11px] text-[var(--text-3)]">Caso ficticio · los dominios .example y .invalid son de demostración.</p>
    </div>
  );
  if (paso === 1) return (
    <div className="overflow-hidden border-2 border-black bg-[#101820]">
      <div className="border-b-2 border-black bg-[#1c2633] px-3 py-2"><span className="label">auth.log · fragmento ficticio</span></div>
      <div className="space-y-1 p-3 font-mono text-[12px] leading-relaxed">
        <p className="m-0 text-[var(--text-3)]">08:43:10 sshd: Failed password · usuario=lucia · origen=198.51.100.24</p>
        <p className="m-0 text-[var(--text-3)]">08:44:02 sshd: Failed password · usuario=lucia · origen=198.51.100.24</p>
        <p className="m-0 text-[var(--accent)]">08:47:19 auth: sesión correcta · equipo=nuevo · origen=203.0.113.18</p>
        <p className="m-0 text-[var(--green)]">08:48:01 aviso: titular indica “no fui yo”</p>
      </div>
      <p className="border-t border-white/10 px-3 py-2 text-[11px] text-[var(--text-3)]">Direcciones reservadas para documentación; no son objetivos.</p>
    </div>
  );
  if (paso === 2) return (
    <div className="overflow-hidden border-2 border-black bg-[#111821]">
      <div className="flex items-center gap-2 border-b-2 border-black bg-[#1c2633] px-3 py-2"><PixelIcon name="key" size={16} /><span className="label">Reglas de reenvío</span></div>
      <div className="grid gap-2 p-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
        <div className="border border-white/10 bg-[var(--surface-2)] p-3"><p className="label">Bandeja principal</p><p className="mono mt-1 text-[13px]">lucia@lucero.example</p></div>
        <span className="text-center text-[var(--red)]" aria-hidden>━━▶</span>
        <div className="border-2 border-[var(--red)] bg-[#2a1016] p-3"><p className="label !text-[var(--red)]">Reenvío no reconocido</p><p className="mono mt-1 break-all text-[13px]">archivo@buzon-desconocido.example</p></div>
      </div>
      <p className="border-t border-white/10 px-3 py-2 text-[11px] text-[var(--text-3)]">No envíes mensajes a direcciones que no reconoces.</p>
    </div>
  );
  return (
    <div className="overflow-hidden border-2 border-black bg-[#111821]">
      <div className="border-b-2 border-black bg-[#1c2633] px-3 py-2"><span className="label">Flujos observados · laboratorio ficticio</span></div>
      <div className="divide-y divide-white/10">
        {[
          ["09:02:10", "10.0.0.18", "10.0.0.1:53", "DNS", "Consulta habitual a resolver local"],
          ["09:02:14", "10.0.0.18", "198.51.100.41:443", "HTTPS", "Portal educativo conocido"],
          ["09:03:02", "10.0.0.18", "203.0.113.77:443", "HTTPS", "Destino nuevo; correlacionar antes de concluir"],
        ].map(([hora, origen, destino, protocolo, nota]) => <div key={hora} className="grid gap-1 px-3 py-2 text-[12px] sm:grid-cols-[74px_1fr_90px] sm:items-center">
          <span className="mono text-[var(--text-3)]">{hora}</span><span className="mono break-all">{origen} <span className="text-[var(--cyan)]">→</span> {destino} <span className="chip ml-1">{protocolo}</span></span><span className="text-[var(--text-3)] sm:col-span-3">{nota}</span>
        </div>)}
      </div>
      <p className="border-t border-white/10 px-3 py-2 text-[11px] text-[var(--text-3)]">Un destino o puerto inusual es una señal que requiere contexto, no una prueba aislada.</p>
    </div>
  );
}

export function Operacion() {
  const [p] = useProgreso();
  const etapaIndex = Math.min(p.operacion.paso, ETAPAS.length - 1);
  const etapa = ETAPAS[etapaIndex];
  const [seleccion, setSeleccion] = useState<number | null>(null);
  const [intentos, setIntentos] = useState(0);
  const correcta = seleccion !== null && etapa.opciones[seleccion]?.correcta;

  function elegir(i: number) {
    setSeleccion(i);
    setIntentos((x) => x + 1);
  }

  if (p.operacion.completada) return (
    <main id="main" className="mx-auto max-w-[900px] px-4 py-10">
      <section className="card overflow-hidden p-0">
        <div className="border-b-2 border-black bg-[#102719] p-5 sm:p-7">
          <p className="label !text-[var(--green)]">Incidente contenido · misión completada</p>
          <h1 className="mt-2">Informe de Operación Bóveda</h1>
          <p className="mt-2 max-w-[720px] text-[15px] text-[var(--text-2)]">Seguiste un canal independiente, recuperaste el control, encontraste una regla de reenvío y trataste la conexión como evidencia que necesita contexto.</p>
        </div>
        <div className="space-y-3 p-5 sm:p-7">
          {ETAPAS.map((x, i) => <article key={x.titulo} className="flex gap-3 border-l-2 border-[var(--green)] pl-3">
            <span className="grid h-8 w-8 shrink-0 place-items-center border-2 border-black bg-[#16301f] text-[var(--green)]">✓</span>
            <div><p className="label !text-[var(--green)]">{x.hora} · {x.etiqueta}</p><h2 className="mt-1 text-[16px]">{x.titulo}</h2><p className="mt-1 text-[14px] text-[var(--text-2)]">{x.opciones[p.operacion.decisiones[i] ?? 0]?.razon}</p></div>
          </article>)}
          <div className="border-2 border-black bg-[#0c1f2c] p-4">
            <p className="label !text-[var(--cyan)]">Regla de analista</p>
            <p className="mt-2 text-[15px]">Registra <b>observaciones</b>, separa las <b>hipótesis</b> y recomienda el siguiente paso autorizado. Una IP, un puerto o una alerta no identifican por sí solos a una persona ni confirman un incidente.</p>
          </div>
          <p className="text-[12px] text-[var(--text-3)]">Caso íntegramente ficticio · progreso guardado solo en este navegador · {p.operacion.xpOtorgada ? "+100 XP otorgados una sola vez" : "repetición de práctica"}.</p>
          <div className="flex flex-wrap gap-2"><button className="btn btn-primary" onClick={reiniciarOperacion}>Repetir misión</button><a className="btn" href="#/repaso">Ir al repaso inteligente</a></div>
        </div>
      </section>
    </main>
  );

  return (
    <main id="main" className="mx-auto max-w-[1000px] px-4 py-8">
      <header className="border-b-2 border-black bg-[#111d28] p-5 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div><p className="label !text-[var(--cyan)]">Misión defensiva · datos ficticios</p><h1 className="mt-2">Operación Bóveda</h1><p className="mt-2 max-w-[700px] text-[15px] leading-relaxed text-[var(--text-2)]">Investiga una cuenta comprometida como analista: revisa evidencia visual, decide el siguiente paso seguro y explica qué sabes —y qué todavía no puedes afirmar.</p></div>
          <span className="chip !text-[var(--green)]"><PixelIcon name="shield" size={14} /> +100 XP al completar</span>
        </div>
        <LearningFlow title="Tu investigación" className="mt-4 max-w-[760px]" steps={[{ label: "Verificar", icon: "search" }, { label: "Contener", icon: "shield" }, { label: "Investigar", icon: "torch" }, { label: "Informar", icon: "flag" }]} />
        <div className="mt-4 flex flex-wrap gap-2" aria-label="Progreso de la misión">
          {ETAPAS.map((x, i) => <span key={x.titulo} className={cn("chip", i < p.operacion.paso && "!text-[var(--green)]", i === p.operacion.paso && "!border-[var(--cyan)] !text-[var(--cyan)]")}><span className="mono mr-1">{String(i + 1).padStart(2, "0")}</span>{x.etiqueta}</span>)}
        </div>
      </header>

      <section className="mt-5 grid gap-4 lg:grid-cols-[1.15fr_.85fr]">
        <article className="card p-4 sm:p-5" aria-labelledby="operacion-evidencia">
          <div className="flex items-center justify-between gap-2"><div><p className="label !text-[var(--accent)]">Evidencia {etapaIndex + 1} de {ETAPAS.length} · {etapa.hora}</p><h2 id="operacion-evidencia" className="mt-1 text-[19px]">{etapa.titulo}</h2></div><PixelIcon name="search" size={24} /></div>
          <div className="mt-4"><Evidencia paso={etapaIndex} /></div>
          <p className="mt-3 text-[12px] text-[var(--text-3)]">Entorno de simulación: no se envían peticiones ni se contactan sistemas reales.</p>
        </article>

        <article className="card p-4 sm:p-5" aria-labelledby="operacion-decision">
          <p className="label !text-[var(--accent)]">Decisión {etapaIndex + 1}/4 · intentos sin penalización: {intentos}</p>
          <h2 id="operacion-decision" className="mt-2 text-[18px]">{etapa.pregunta}</h2>
          <fieldset className="mt-4 space-y-2 border-0 p-0">
            <legend className="sr-only">Elige una acción segura</legend>
            {etapa.opciones.map((opcion, i) => <label key={opcion.texto} className={cn("flex cursor-pointer items-start gap-3 border-2 border-black p-3 text-[14px] leading-relaxed", seleccion === i ? "bg-[var(--surface-3)]" : "bg-[var(--surface-2)] hover:bg-[var(--surface-3)]")}>
              <input className="mt-1 shrink-0" type="radio" name={`operacion-${etapaIndex}`} checked={seleccion === i} onChange={() => elegir(i)} />
              <span>{opcion.texto}</span>
            </label>)}
          </fieldset>
          {seleccion !== null && <div className={cn("mt-3 border-2 border-black p-3 text-[14px]", correcta ? "bg-[#102719]" : "bg-[#2a1d0c]")} role="status" aria-live="polite">
            <b className={correcta ? "text-[var(--green)]" : "text-[var(--accent)]"}>{correcta ? "Buena decisión. " : "Pausa y revisa el riesgo. "}</b>{etapa.opciones[seleccion].razon}
          </div>}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
            <p className="text-[11px] text-[var(--text-3)]">Ficticio · seguro · puedes reintentar</p>
            <button className="btn btn-primary" disabled={!correcta} onClick={() => { guardarPasoOperacion(seleccion!); setSeleccion(null); }}>
              {etapaIndex === ETAPAS.length - 1 ? "Cerrar incidente" : "Registrar decisión →"}
            </button>
          </div>
        </article>
      </section>
    </main>
  );
}
