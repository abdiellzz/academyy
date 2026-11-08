import { useEffect, useState } from "react";
import { LearningFlow } from "../components/LearningFlow";
import { PixelIcon } from "../components/PixelArt";
import { Bar } from "../components/ui";
import { calificarRepaso, useProgreso } from "../lib/store";
import { cn } from "../utils/cn";

function hoyClave() {
  const hoy = new Date();
  return `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}-${String(hoy.getDate()).padStart(2, "0")}`;
}

export function Repaso() {
  const [p] = useProgreso();
  const hoy = hoyClave();
  const pendientes = p.repaso.filter((x) => x.proxima <= hoy).sort((a, b) => a.proxima.localeCompare(b.proxima));
  const [revisadas, setRevisadas] = useState(0);
  const [seleccion, setSeleccion] = useState<number | null>(null);
  const [comprobada, setComprobada] = useState(false);
  const tarjeta = pendientes[0];
  const totalSesion = revisadas + pendientes.length;
  const respondida = comprobada && seleccion !== null;
  const acerto = respondida && seleccion === tarjeta?.respuesta;

  useEffect(() => { setSeleccion(null); setComprobada(false); }, [tarjeta?.id]);

  function calificar(recordada: boolean) {
    if (!tarjeta || !respondida) return;
    calificarRepaso(tarjeta.id, recordada);
    setRevisadas((n) => n + 1);
    setSeleccion(null);
  }

  const siguienteFecha = p.repaso.map((x) => x.proxima).filter((x) => x > hoy).sort()[0];

  return (
    <main id="main" className="mx-auto max-w-[900px] px-4 py-8">
      <header className="border-b-2 border-black bg-[#151026] p-5 sm:p-7">
        <p className="label !text-[var(--violet)]">Memoria activa · solo en este navegador</p>
        <h1 className="mt-2">Repaso inteligente</h1>
        <p className="mt-2 max-w-[680px] text-[15px] leading-relaxed text-[var(--text-2)]">Las preguntas que te costaron vuelven en intervalos crecientes. Recuperar la idea de memoria ayuda a conservarla mejor que releerla una sola vez.</p>
        <LearningFlow title="Recuerda · responde · decide cuándo volver" className="mt-4 max-w-[720px]" steps={[{ label: "Recuerda", icon: "search" }, { label: "Comprueba", icon: "diamond" }, { label: "Programa", icon: "xp" }, { label: "Consolida", icon: "shield" }]} />
      </header>

      <section className="mt-5">
        {tarjeta ? <article className="card p-5 sm:p-7" aria-labelledby="repaso-pregunta">
          <div className="flex flex-wrap items-center justify-between gap-2"><span className="chip !text-[var(--cyan)]">{tarjeta.tema}</span><span className="label">{revisadas + 1} de {totalSesion} hoy</span></div>
          <div className="mt-3"><Bar value={(revisadas / Math.max(1, totalSesion)) * 100} color="var(--violet)" label="Tarjetas revisadas en esta sesión" /></div>
          <h2 id="repaso-pregunta" className="mt-5 text-[20px]">{tarjeta.pregunta}</h2>
          <fieldset className="mt-4 grid gap-2 border-0 p-0">
            <legend className="sr-only">Selecciona una respuesta</legend>
            {tarjeta.opciones.map((opcion, i) => <label key={opcion} className={cn("flex cursor-pointer items-start gap-3 border-2 border-black p-3 text-[14px] leading-relaxed", seleccion === i ? "bg-[var(--surface-3)]" : "bg-[var(--surface-2)] hover:bg-[var(--surface-3)]")}>
              <input className="mt-1 shrink-0" type="radio" name={`repaso-${tarjeta.id}`} checked={seleccion === i} onChange={() => setSeleccion(i)} />
              <span>{opcion}</span>
            </label>)}
          </fieldset>
          {respondida && <div className={cn("mt-4 border-2 border-black p-4", acerto ? "bg-[#102719]" : "bg-[#2a1d0c]")} role="status" aria-live="polite">
            <p className={cn("font-bold", acerto ? "text-[var(--green)]" : "text-[var(--accent)]")}>{acerto ? "¡Bien recordado!" : "Esta idea necesita otra vuelta."}</p>
            <p className="mt-2 text-[14px] text-[var(--text-2)]"><b>Respuesta:</b> {tarjeta.opciones[tarjeta.respuesta]}</p>
            <p className="mt-2 text-[14px] leading-relaxed">{tarjeta.explicacion}</p>
          </div>}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
            <p className="text-[12px] text-[var(--text-3)]">Sin puntos negativos; el objetivo es recordar, no castigar.</p>
            {!respondida ? <button className="btn btn-primary" disabled={seleccion === null} onClick={() => setComprobada(true)}>Comprobar respuesta</button> : acerto ? <div className="flex flex-wrap gap-2"><button className="btn" onClick={() => calificar(false)}>Me costó · mañana</button><button className="btn btn-primary" onClick={() => calificar(true)}>Lo recordé · programar repaso</button></div> : <button className="btn btn-primary" onClick={() => calificar(false)}>Repasar mañana →</button>}
          </div>
        </article> : <div className="card p-6 sm:p-8">
          <div className="flex items-start gap-4"><span className="grid h-14 w-14 shrink-0 place-items-center border-2 border-black bg-[#102719]"><PixelIcon name="chest" size={32} /></span><div>
            <p className="label !text-[var(--green)]">No hay tarjetas pendientes</p><h2 className="mt-1 text-[20px]">Bóveda despejada por ahora</h2>
            <p className="mt-2 text-[14px] leading-relaxed text-[var(--text-2)]">Cuando falles una pregunta de nivel o examen, aparecerá aquí para practicarla de nuevo. {siguienteFecha ? `La próxima tarjeta está programada para ${new Intl.DateTimeFormat("es", { dateStyle: "long" }).format(new Date(`${siguienteFecha}T12:00:00`))}.` : "Sigue con una misión o un nivel para generar tu primera tarjeta."}</p>
            <div className="mt-4 flex flex-wrap gap-2"><a className="btn btn-primary" href="#/operacion">Jugar Operación Bóveda</a><a className="btn" href="#/">Volver al mapa</a></div>
          </div></div>
        </div>}
      </section>
      <p className="mt-4 text-[11px] text-[var(--text-3)]">Los repasos se almacenan localmente. Borrar los datos del sitio también borra estas tarjetas.</p>
    </main>
  );
}
