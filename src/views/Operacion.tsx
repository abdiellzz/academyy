import { useState } from "react";
import { Adventurer, PixelIcon } from "../components/PixelArt";
import { LearningFlow } from "../components/LearningFlow";
import { guardarClasificacionOperacion, guardarNotaOperacion, guardarPasoOperacion, reiniciarOperacion, useProgreso } from "../lib/store";
import { cn } from "../utils/cn";

type Pista = { texto: string; categoria: number; porQue: string };
interface Opcion { texto: string; correcta: boolean; razon: string }
interface Etapa {
  titulo: string;
  etiqueta: string;
  hora: string;
  pregunta: string;
  pistas: Pista[];
  opciones: Opcion[];
}

const CATEGORIAS = [
  { nombre: "Hecho", icono: "diamond" as const, color: "var(--cyan)" },
  { nombre: "Hipótesis", icono: "torch" as const, color: "var(--accent)" },
  { nombre: "Por verificar", icono: "search" as const, color: "var(--violet)" },
];

const ETAPAS: Etapa[] = [
  {
    titulo: "Un mensaje urgente",
    etiqueta: "Correo recibido",
    hora: "08:41",
    pistas: [
      { texto: "El asunto exige actuar en 15 minutos.", categoria: 0, porQue: "Puedes observar directamente la frase y el plazo en el mensaje." },
      { texto: "La dirección pertenece al soporte oficial.", categoria: 1, porQue: "El nombre del remitente no demuestra quién controla la dirección ni el dominio." },
      { texto: "¿El servicio muestra el mismo aviso al abrir su app oficial?", categoria: 2, porQue: "Todavía no se ha consultado el canal oficial; hay que comprobarlo por separado." },
    ],
    pregunta: "¿Cómo verificas el aviso sin seguir el guion del mensaje?",
    opciones: [
      { texto: "Abrir el portal desde la app o dirección oficial que ya conoces; no usar el enlace del mensaje.", correcta: true, razon: "La verificación por un canal independiente evita seguir un enlace controlado por quien envió el mensaje." },
      { texto: "Abrir el enlace en modo incógnito para comprobar si la cuenta está activa.", correcta: false, razon: "El modo incógnito no convierte un dominio falso en uno legítimo ni impide que el sitio recopile los datos que escribas." },
      { texto: "Responder al remitente y pedir que confirme que trabaja en soporte.", correcta: false, razon: "Quien envió el mensaje podría confirmar su propio pretexto. Busca tú un canal oficial independiente." },
    ],
  },
  {
    titulo: "Inicio de sesión desconocido",
    etiqueta: "Registro de acceso",
    hora: "08:47",
    pistas: [
      { texto: "Hay dos intentos fallidos para la cuenta de Lucía.", categoria: 0, porQue: "Las dos líneas FAIL se ven en el fragmento del registro." },
      { texto: "La dirección de origen identifica a una persona atacante.", categoria: 1, porQue: "Una IP no identifica por sí sola a una persona ni demuestra intención." },
      { texto: "¿Qué resultado tuvo el segundo factor y quién usa el dispositivo nuevo?", categoria: 2, porQue: "El fragmento no incluye el resultado MFA ni el inventario del dispositivo." },
    ],
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
    pistas: [
      { texto: "La cuenta reenvía correo a archivo@buzon-desconocido.example.", categoria: 0, porQue: "La regla visible muestra esa dirección de destino." },
      { texto: "La regla la creó definitivamente la persona que inició la sesión.", categoria: 1, porQue: "La coincidencia temporal puede orientar una hipótesis, pero aún no prueba quién creó la regla." },
      { texto: "¿Cuándo se creó la regla y desde qué sesión?", categoria: 2, porQue: "Falta revisar el historial de cambios y correlacionarlo con las sesiones." },
    ],
    pregunta: "¿Qué haces con el reenvío desconocido?",
    opciones: [
      { texto: "Documentar la regla, desactivarla desde el panel oficial, revisar recuperación y avisar al equipo responsable.", correcta: true, razon: "El reenvío puede mantener acceso a mensajes. Preserva datos relevantes, elimina la persistencia y revisa cambios relacionados." },
      { texto: "Vaciar toda la bandeja y cerrar la pestaña.", correcta: false, razon: "Vaciar la bandeja no elimina la regla ni permite averiguar cuándo o cómo se creó." },
      { texto: "Enviar un mensaje a la dirección desconocida para preguntar quién es.", correcta: false, razon: "No contactes una dirección sospechosa ni reveles más información; usa canales de soporte que tú busques." },
    ],
  },
  {
    titulo: "Una conexión fuera de patrón",
    etiqueta: "Tráfico simulado",
    hora: "09:03",
    pistas: [
      { texto: "A las 09:03 se observa un flujo nuevo hacia 203.0.113.77:443.", categoria: 0, porQue: "La hora, el destino y el puerto están anotados en la captura ficticia." },
      { texto: "El puerto 443 confirma que el tráfico es seguro o malicioso.", categoria: 1, porQue: "El puerto no prueba seguridad, intención, proceso ni identidad." },
      { texto: "¿Qué proceso originó el flujo y había un cambio aprobado?", categoria: 2, porQue: "Se necesitan registros del equipo y contexto de cambios para entender la conexión." },
    ],
    pregunta: "¿Qué informe es responsable ante una conexión poco habitual?",
    opciones: [
      { texto: "Registrar hora, proceso y destino; correlacionar DNS y registros, escalar al equipo autorizado y evitar atribuir intención sin más evidencia.", correcta: true, razon: "Una anomalía es una pista, no una conclusión. Correlaciona fuentes y separa observaciones de hipótesis." },
      { texto: "Declarar que el puerto demuestra quién atacó y publicar la IP.", correcta: false, razon: "Un puerto o una IP no prueban identidad ni compromiso. No publiques acusaciones o datos de terceros." },
      { texto: "Escanear direcciones públicas al azar para encontrar el origen.", correcta: false, razon: "Eso sale del alcance autorizado y no valida la evidencia observada. Limítate a sistemas y procedimientos aprobados." },
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
      <p className="border-t border-white/10 px-3 py-2 text-[11px] text-[var(--text-3)]">Caso ficticio · dominios reservados .example y .invalid.</p>
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
        <span className="text-center text-[var(--red)]" aria-hidden="true">━━▶</span>
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
      <p className="border-t border-white/10 px-3 py-2 text-[11px] text-[var(--text-3)]">Una anomalía es una pregunta para investigar, no una prueba aislada.</p>
    </div>
  );
}

function pistasDeRonda(pistas: Pista[], ronda: number, sala: number): Pista[] {
  if (pistas.length < 2) return pistas;
  const desplazamiento = (ronda + sala) % pistas.length;
  return pistas.map((_, i) => pistas[(i + desplazamiento) % pistas.length]);
}

function SalaMapa({ actual, completadas }: { actual: number; completadas: number }) {
  const salas = [
    { icon: "heart" as const, nombre: "Correo" },
    { icon: "monitor" as const, nombre: "Accesos" },
    { icon: "key" as const, nombre: "Reglas" },
    { icon: "globe" as const, nombre: "Red" },
  ];
  return <ol className="grid grid-cols-4 gap-2" aria-label="Mapa de salas de Operación Bóveda">
    {salas.map((s, i) => <li key={s.nombre} className={cn("border-2 p-2 text-center", i === actual ? "border-[var(--cyan)] bg-[#0c1f2c]" : i < completadas ? "border-[var(--green)] bg-[#102719]" : "border-black bg-[var(--surface-2)]")}>
      <PixelIcon name={s.icon} size={24} className="mx-auto" />
      <span className="mt-1 block text-[10px] font-bold">{s.nombre}</span>
      <span className="sr-only">{i < completadas ? "Completada" : i === actual ? "Sala actual" : "Bloqueada"}</span>
    </li>)}
  </ol>;
}

export function Operacion() {
  const [p] = useProgreso();
  const etapaIndex = Math.min(p.operacion.paso, ETAPAS.length - 1);
  const etapaBase = ETAPAS[etapaIndex];
  const etapa = { ...etapaBase, pistas: pistasDeRonda(etapaBase.pistas, p.operacion.ronda, etapaIndex) };
  const [seleccion, setSeleccion] = useState<number | null>(null);
  const [intentos, setIntentos] = useState(0);
  const [pistaActiva, setPistaActiva] = useState<number | null>(null);
  const correcta = seleccion !== null && etapa.opciones[seleccion]?.correcta;
  const clasificados = p.operacion.clasificaciones[etapaIndex] ?? [];
  const cantidadHechos = clasificados.filter((x) => x === 0).length;
  const cantidadHipotesis = clasificados.filter((x) => x === 1).length;
  const cantidadPendientes = clasificados.filter((x) => x === 2).length;
  const tableroListo = etapa.pistas.every((pista, i) => clasificados[i] === pista.categoria);
  const nota = p.operacion.notas[etapaIndex] ?? "";
  const puedeAvanzar = tableroListo && correcta && nota.trim().length >= 14;

  function clasificar(i: number, categoria: number) {
    if (categoria === etapa.pistas[i].categoria) {
      guardarClasificacionOperacion(etapaIndex, i, categoria);
      setPistaActiva(i);
    } else setPistaActiva(i);
  }

  if (p.operacion.completada) return (
    <main id="main" className="mx-auto max-w-[1000px] px-4 py-8">
      <section className="card overflow-hidden p-0">
        <div className="border-b-2 border-black bg-[#102719] p-5 sm:p-8">
          <div className="flex flex-wrap items-center gap-4">
            <Adventurer who="diel" height={82} />
            <div className="min-w-0 flex-1"><p className="label !text-[var(--green)]">Incidente contenido · informe completo</p><h1 className="mt-2">¡La Bóveda vuelve a estar a salvo!</h1><p className="mt-2 max-w-[650px] text-[15px] text-[var(--text-2)]">Investigaste cuatro salas, separaste hechos de hipótesis y registraste qué falta comprobar. Ese es el criterio que protege a una organización de conclusiones apresuradas.</p></div>
            <span className="chip !text-[var(--green)]"><PixelIcon name="diamond" size={14} /> +100 XP una vez</span>
          </div>
          <div className="mt-5 grid grid-cols-4 gap-2" aria-label="Mapa de la misión completada">{ETAPAS.map((e) => <div key={e.etiqueta} className="border-2 border-[var(--green)] bg-[#16301f] p-2 text-center"><PixelIcon name="chest" size={20} className="mx-auto" /><span className="label mt-1 block !text-[var(--green)]">{e.etiqueta}</span></div>)}</div>
        </div>
        <div className="space-y-4 p-4 sm:p-7">
          {ETAPAS.map((base, i) => {
            const e = { ...base, pistas: pistasDeRonda(base.pistas, p.operacion.ronda, i) };
            return <article key={e.titulo} className="border-2 border-black bg-[var(--surface-2)] p-4">
            <p className="label !text-[var(--cyan)]">Sala {i + 1} · {e.hora} · {e.etiqueta}</p><h2 className="mt-1 text-[17px]">{e.titulo}</h2>
            <p className="mt-2 text-[13px] text-[var(--text-2)]"><b>Decisión:</b> {e.opciones[p.operacion.decisiones[i] ?? 0]?.texto}</p>
            <p className="mt-1 text-[13px] text-[var(--green)]">{e.opciones[p.operacion.decisiones[i] ?? 0]?.razon}</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">{e.pistas.map((x) => <div key={x.texto} className="border border-white/10 bg-black/20 p-2"><span className="label" style={{ color: CATEGORIAS[x.categoria].color }}>{CATEGORIAS[x.categoria].nombre}</span><p className="mt-1 text-[12px]">{x.texto}</p></div>)}</div>
            <p className="mt-3 border-l-2 border-[var(--cyan)] pl-3 text-[14px] whitespace-pre-wrap"><b>Tu nota:</b> {p.operacion.notas[i] || "Sin anotación"}</p>
          </article>;
          })}
          <div className="border-2 border-[var(--cyan)] bg-[#0c1f2c] p-4"><p className="label !text-[var(--cyan)]">Sello de analista cuidadosa</p><p className="mt-2 text-[15px]">Antes de concluir: documenta lo observado, identifica qué es hipótesis y pide una verificación para lo que aún no sabes. Una IP, un puerto o una alerta aislada no identifican a una persona.</p></div>
          <p className="text-[12px] text-[var(--text-3)]">Caso ficticio · progreso y notas guardados solo en este navegador · el informe queda aquí, sin exportación.</p>
          <div className="flex flex-wrap gap-2"><button className="btn btn-primary" onClick={reiniciarOperacion}>Jugar otra vez</button><a className="btn" href="#/repaso">Ir al repaso inteligente</a></div>
        </div>
      </section>
    </main>
  );

  return (
    <main id="main" className="mx-auto max-w-[1120px] px-4 py-7">
      <header className="overflow-hidden border-2 border-black bg-[#101820]">
        <div className="relative bg-[#111d28] p-4 sm:p-6">
          <div aria-hidden="true" className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(90deg, transparent 49%, #5fd3ff 50%, transparent 51%), linear-gradient(transparent 49%, #5fd3ff 50%, transparent 51%)", backgroundSize: "24px 24px" }} />
          <div className="relative flex flex-wrap items-center gap-3 sm:gap-5">
            <Adventurer who="diel" height={76} className="drop-shadow-[3px_3px_0_#000]" />
            <div className="min-w-0 flex-1"><p className="label !text-[var(--cyan)]">CENTRO DE OPERACIONES · CASO 01 · RONDA {p.operacion.ronda + 1}</p><h1 className="mt-2">Operación Bóveda</h1><p className="mt-2 max-w-[720px] text-[14px] leading-relaxed text-[var(--text-2)]">Alerta en una cuenta de demostración. Recorre las salas, reúne indicios y protege la bóveda: <b>sin tiempo límite, sin penalización y sin tocar sistemas reales.</b></p></div>
            <div className="border-2 border-black bg-[#0c1f2c] p-3 text-center"><p className="label !text-[var(--cyan)]">RECOMPENSA</p><p className="mt-1 mono text-[18px] text-[var(--green)]">+100 XP</p><p className="label mt-1">una vez</p></div>
          </div>
          <LearningFlow title="Tu turno de guardia" className="relative mt-4 max-w-[760px]" steps={[{ label: "Inspeccionar", icon: "search" }, { label: "Clasificar", icon: "diamond" }, { label: "Decidir", icon: "shield" }, { label: "Informar", icon: "flag" }]} />
          <div className="relative mt-4"><SalaMapa actual={etapaIndex} completadas={p.operacion.paso} /></div>
        </div>
        <div className="grid grid-cols-3 border-t-2 border-black bg-[#0a0e14] text-center">
          {[
            ["HECHOS", cantidadHechos, "var(--cyan)"],
            ["HIPÓTESIS", cantidadHipotesis, "var(--accent)"],
            ["POR VERIFICAR", cantidadPendientes, "var(--violet)"],
          ].map(([nombre, cuenta, color]) => <div key={nombre} className="border-r border-white/10 p-2 last:border-r-0"><p className="label" style={{ color: color as string }}>{nombre}</p><p className="mono mt-1 text-[16px]">{cuenta}/{etapa.pistas.length}</p></div>)}
        </div>
      </header>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.05fr_.95fr]">
        <section className="card p-4 sm:p-5" aria-labelledby="operacion-evidencia">
          <div className="flex flex-wrap items-center justify-between gap-2"><div><p className="label !text-[var(--accent)]">SALA {etapaIndex + 1}/4 · {etapa.hora} · {etapa.etiqueta}</p><h2 id="operacion-evidencia" className="mt-1 text-[19px]">{etapa.titulo}</h2></div><PixelIcon name="search" size={24} /></div>
          <div className="mt-4"><Evidencia paso={etapaIndex} /></div>
          <p className="mt-3 text-[12px] text-[var(--text-3)]">Intel ficticia · IP de documentación · no se envían peticiones de red.</p>
          <div className="mt-4 border-t border-white/10 pt-3">
            <div className="flex flex-wrap items-center justify-between gap-2"><p className="label !text-[var(--cyan)]">TABLERO DE INTEL · clasifica cada pista</p><span className="chip">{clasificados.filter((x) => x !== undefined).length}/{etapa.pistas.length} ordenadas</span></div>
            <div className="mt-3 space-y-2">
              {etapa.pistas.map((pista, i) => {
                const categoriaGuardada = clasificados[i];
                const clasificada = categoriaGuardada === pista.categoria;
                return <article key={pista.texto} className={cn("border-2 border-black p-3", clasificada ? "bg-[#112319]" : "bg-[var(--surface-2)]")}>
                  <div className="flex items-start gap-2"><PixelIcon name={clasificada ? "flag" : "chest"} size={16} className="mt-0.5 shrink-0" /><p className="m-0 flex-1 text-[13px] leading-relaxed">{pista.texto}</p>{clasificada && <span className="label !text-[var(--green)]">ARCHIVADA</span>}</div>
                  <div className="mt-2 grid grid-cols-3 gap-1.5">
                    {CATEGORIAS.map((cat, j) => <button key={cat.nombre} type="button" aria-pressed={clasificada && categoriaGuardada === j} className={cn("btn btn-xs min-h-[36px] justify-center px-1 text-[9px] sm:text-[10px]", clasificada && categoriaGuardada === j && "border-[var(--green)] !text-[var(--green)]")} onClick={() => clasificar(i, j)}><PixelIcon name={cat.icono} size={12} />{cat.nombre}</button>)}
                  </div>
                  {pistaActiva === i && <p className={cn("mt-2 border-l-2 pl-2 text-[12px]", clasificada ? "border-[var(--green)] text-[var(--green)]" : "border-[var(--accent)] text-[var(--accent)]")} role="status" aria-live="polite">{clasificada ? pista.porQue : `Revisa la diferencia: ${pista.categoria === 0 ? "¿lo observas directamente en los datos?" : pista.categoria === 1 ? "¿es una explicación posible, pero todavía no demostrada?" : "¿qué dato aún necesitas comprobar?"}`}</p>}
                </article>;
              })}
            </div>
          </div>
        </section>

        <section className="card p-4 sm:p-5" aria-labelledby="operacion-decision">
          <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center border-2 border-black bg-[#0c1f2c]"><PixelIcon name="shield" size={22} /></span><div><p className="label !text-[var(--cyan)]">ACCIÓN DE DEFENSA · intento {intentos + 1}</p><h2 id="operacion-decision" className="mt-1 text-[17px]">{etapa.pregunta}</h2></div></div>
          <fieldset className="mt-4 space-y-2 border-0 p-0">
            <legend className="sr-only">Elige la acción más segura</legend>
            {etapa.opciones.map((opcion, i) => <label key={opcion.texto} className={cn("flex cursor-pointer items-start gap-3 border-2 border-black p-3 text-[13px] leading-relaxed", seleccion === i ? "bg-[var(--surface-3)]" : "bg-[var(--surface-2)] hover:bg-[var(--surface-3)]")}>
              <input className="mt-1 shrink-0" type="radio" name={`operacion-${etapaIndex}`} checked={seleccion === i} onChange={() => { setSeleccion(i); setIntentos((x) => x + 1); }} />
              <span>{opcion.texto}</span>
            </label>)}
          </fieldset>
          {seleccion !== null && <div className={cn("mt-3 border-2 border-black p-3 text-[13px] leading-relaxed", correcta ? "bg-[#102719]" : "bg-[#2a1d0c]")} role="status" aria-live="polite"><b className={correcta ? "text-[var(--green)]" : "text-[var(--accent)]"}>{correcta ? "Buena lectura. " : "La bóveda sigue protegida. "}</b>{etapa.opciones[seleccion].razon}</div>}

          <label className="mt-4 block"><span className="label !text-[var(--cyan)]">REGISTRO DE CAMPO · nota de la sala</span><span className="mt-1 block text-[12px] text-[var(--text-2)]">Anota un hecho, qué significa y qué falta comprobar. No pongas datos reales.</span><textarea maxLength={600} className="field mt-2 min-h-[94px] w-full text-[13px]" value={nota} onChange={(e) => guardarNotaOperacion(etapaIndex, e.target.value)} placeholder="Ej.: observé…; sospecho…; verificaría…" /></label>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-3">
            <p className="m-0 text-[11px] text-[var(--text-3)]">Para abrir la siguiente sala: ordena las pistas, elige la defensa y anota ≥14 caracteres.</p>
            <button className="btn btn-primary" disabled={!puedeAvanzar} onClick={() => { guardarPasoOperacion(seleccion!); setSeleccion(null); setPistaActiva(null); }}>
              {etapaIndex === ETAPAS.length - 1 ? "Cerrar incidente →" : "Desbloquear sala →"}
            </button>
          </div>
        </section>
      </div>
      <p className="mt-3 text-center text-[11px] text-[var(--text-3)]">Sin cronómetro ni vidas · reintenta las veces que necesites · progreso guardado en este navegador.</p>
    </main>
  );
}
