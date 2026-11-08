import { useEffect, useState } from "react";
import { PixelIcon } from "../components/PixelArt";
import { LearningFlow } from "../components/LearningFlow";
import { useProgreso, guardarNotaProyecto, guardarProyecto } from "../lib/store";
import { PROYECTOS, RUTAS_APRENDIZAJE, type ProyectoFinal } from "../lib/learning";
import { cn } from "../utils/cn";

export function Proyectos({ id }: { id?: string }) {
  const [p] = useProgreso();
  const [seleccionado, setSeleccionado] = useState(PROYECTOS.some((x) => x.id === id) ? id! : PROYECTOS[0].id);
  useEffect(() => { if (PROYECTOS.some((x) => x.id === id)) setSeleccionado(id!); }, [id]);
  const proyecto = PROYECTOS.find((x) => x.id === seleccionado) ?? PROYECTOS[0];
  const ruta = RUTAS_APRENDIZAJE.find((x) => x.proyecto === proyecto.id);

  return (
    <main id="main">
      <section className="border-b-2 border-black bg-[#121c18]">
        <div className="mx-auto max-w-[1100px] px-4 py-10">
          <p className="label !text-[var(--green)]">Proyectos de cierre · auditorías seguras con datos ficticios</p>
          <h1 className="mt-2">Construye algo y explica cómo lo hiciste</h1>
          <p className="mt-3 max-w-[760px] text-[17px] leading-relaxed text-[var(--text-2)]">Cada proyecto te guía a delimitar el alcance, revisar evidencia, ejecutar un análisis, anotar lo que encuentras y justificar una recomendación. El informe se arma paso a paso y queda guardado localmente; no escanea ni se conecta a sistemas reales.</p>
          <LearningFlow title="Método de trabajo" className="mt-4 max-w-[720px]" steps={[{ label: "Delimitar", icon: "shield" }, { label: "Auditar", icon: "search" }, { label: "Anotar", icon: "torch" }, { label: "Explicar", icon: "flag" }]} />
          <p className="mt-3 text-[13px] text-[var(--text-3)]">{p.proyectosFinalizados.length}/{PROYECTOS.length} proyectos completados · cada proyecto suma 50 XP una sola vez. No escribas secretos ni datos personales en las notas.</p>
        </div>
      </section>

      <section className="mx-auto max-w-[1100px] px-4 py-8" aria-labelledby="elige-proyecto">
        <h2 id="elige-proyecto" className="text-[20px]">Elige qué quieres construir</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {PROYECTOS.map((x) => {
            const activo = x.id === proyecto.id;
            const listo = p.proyectosFinalizados.includes(x.id);
            const notas = (p.proyectosNotas[x.id] ?? []).filter((n) => n?.trim()).length;
            return <button key={x.id} className={cn("card p-4 text-left transition-colors", activo && "ring-2 ring-[var(--green)]")} aria-pressed={activo} onClick={() => setSeleccionado(x.id)}>
              <div className="flex items-start justify-between gap-2"><span className="label !text-[var(--green)]">{listo ? "✔ completado" : "Proyecto guiado"}</span><PixelIcon name={listo ? "diamond" : "flag"} size={22} /></div>
              <h3 className="mt-2 text-[17px]">{x.titulo}</h3>
              <p className="mt-2 text-[14px] text-[var(--text-2)]">{x.subtitulo}</p>
              <p className="mt-3 border-t border-[var(--border-neutral)] pt-2 text-[13px] text-[var(--cyan)]">Entrega: {x.producto}</p>
              <p className="label mt-2">{x.pasos.length} pasos · {x.minutos} min · {notas}/{x.pasos.length} notas guardadas</p>
            </button>;
          })}
        </div>

        {ruta && <div className="card mt-4 flex flex-wrap items-center gap-3 p-4">
          <PixelIcon name={ruta.icono} size={26} />
          <div className="min-w-0 flex-1"><p className="label">Ruta sugerida · {ruta.titulo}</p><p className="mt-1 text-[14px] text-[var(--text-2)]">{ruta.resultado}</p></div>
          <span className="chip">{ruta.niveles.length} niveles sugeridos</span>
        </div>}

        <ProjectFlow key={proyecto.id} proyecto={proyecto} yaCompletado={p.proyectosFinalizados.includes(proyecto.id)} />
      </section>
    </main>
  );
}

function ProjectFlow({ proyecto, yaCompletado }: { proyecto: ProyectoFinal; yaCompletado: boolean }) {
  const [p] = useProgreso();
  const [paso, setPaso] = useState(0);
  const [seleccion, setSeleccion] = useState<number | null>(null);
  const [respuestas, setRespuestas] = useState<number[]>([]);
  const [informe, setInforme] = useState(false);
  const pregunta = proyecto.pasos[paso];
  const nota = p.proyectosNotas[proyecto.id]?.[paso] ?? "";
  const correcto = seleccion === pregunta.correcta;
  const puedeAvanzar = correcto && nota.trim().length >= 12;

  function avanzar() {
    if (!puedeAvanzar) return;
    setRespuestas((r) => [...r.slice(0, paso), seleccion!]);
    if (paso === proyecto.pasos.length - 1) {
      setInforme(true);
      guardarProyecto(proyecto.id);
      return;
    }
    setPaso((i) => i + 1);
    setSeleccion(null);
  }

  function reiniciar() {
    setPaso(0);
    setSeleccion(null);
    setRespuestas([]);
    setInforme(false);
  }

  return (
    <section className="card mt-5 p-4 sm:p-6" aria-labelledby="proyecto-activo-title">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><p className="label !text-[var(--green)]">Taller guiado · {proyecto.pasos.length} entregables</p><h2 id="proyecto-activo-title" className="mt-1">{proyecto.titulo}</h2></div>
        {yaCompletado && <span className="chip !text-[var(--green)]">Proyecto completado · puedes revisarlo</span>}
      </div>
      <p className="mt-2 text-[14px] text-[var(--text-2)]"><b>Objetivo:</b> {proyecto.objetivo}</p>
      <div className="mt-3 flex items-start gap-2 border-l-4 border-[var(--cyan)] bg-[#0c1f2c] p-3 text-[13px] text-[var(--text-2)]"><PixelIcon name="shield" size={16} className="mt-0.5 shrink-0" /><p className="m-0"><b className="text-[var(--text)]">Regla del taller:</b> usa únicamente el material ficticio mostrado. Las anotaciones se guardan en este navegador; no escribas contraseñas, datos personales ni información de sistemas reales.</p></div>

      {!informe ? <>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-2"><p className="label">Paso {paso + 1} de {proyecto.pasos.length} · {pregunta.entregaParcial}</p><span className="mono text-[12px] text-[var(--text-3)]">{respuestas.length} decisiones justificadas</span></div>
        <div className="mt-2 h-2 border border-black bg-[var(--surface-3)]" role="progressbar" aria-label="Avance del proyecto" aria-valuemin={0} aria-valuemax={proyecto.pasos.length} aria-valuenow={paso}><span className="block h-full bg-[var(--green)] transition-[width]" style={{ width: `${(paso / proyecto.pasos.length) * 100}%` }} /></div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[.95fr_1.05fr]">
          <div className="space-y-4">
            <section className="border-2 border-black bg-[var(--surface-2)] p-4" aria-labelledby="instrucciones-proyecto">
              <p className="label !text-[var(--accent)]">Qué hacer, paso a paso</p>
              <h3 id="instrucciones-proyecto" className="mt-1 text-[16px]">{pregunta.titulo}</h3>
              <ol className="mt-3 space-y-2 pl-5 text-[14px] leading-relaxed text-[var(--text-2)]">{pregunta.instrucciones.map((instruccion, i) => <li key={instruccion} className="pl-1"><span className="font-bold text-[var(--text)]">{String(i + 1).padStart(2, "0")} · </span>{instruccion}</li>)}</ol>
            </section>
            <section className="overflow-hidden border-2 border-black" aria-labelledby="evidencia-proyecto">
              <div className="border-b-2 border-black bg-[#101820] px-3 py-2"><p id="evidencia-proyecto" className="label !text-[var(--cyan)]">Evidencia / material de trabajo</p></div>
              <pre className="m-0 overflow-x-auto whitespace-pre-wrap break-words bg-[#080d12] p-3 font-mono text-[12px] leading-relaxed text-[var(--text-2)]">{pregunta.evidencia}</pre>
            </section>
          </div>

          <div className="space-y-4">
            <fieldset className="border-0 p-0">
              <legend className="text-[16px] font-bold">Comprueba tu análisis: {pregunta.pregunta}</legend>
              <div className="mt-3 grid gap-2">
                {pregunta.opciones.map((opcion, i) => <label key={opcion} className={cn("flex cursor-pointer items-start gap-3 border-2 border-black p-3 text-[14px] leading-relaxed", seleccion === i ? "bg-[var(--surface-3)]" : "bg-[var(--surface-2)] hover:bg-[var(--surface-3)]")}>
                  <input className="mt-1 shrink-0" type="radio" name={`proyecto-${proyecto.id}-${paso}`} checked={seleccion === i} onChange={() => setSeleccion(i)} />
                  <span>{opcion}</span>
                </label>)}
              </div>
            </fieldset>
            {seleccion !== null && <div className={cn("border-2 border-black p-3 text-[14px] leading-relaxed", correcto ? "bg-[#16301f]" : "bg-[#2a1d0c]")} role="status" aria-live="polite">
              {correcto ? <><b className="text-[var(--green)]">Análisis correcto.</b> {pregunta.porQue}</> : <><b className="text-[var(--accent)]">Vuelve a la evidencia.</b> Esta opción no está respaldada por los datos. Revisa las instrucciones e inténtalo otra vez; no hay penalización.</>}
            </div>}
            <label className="block">
              <span className="label !text-[var(--cyan)]">Anota tu trabajo · {pregunta.entregaParcial}</span>
              <span className="mt-1 block text-[13px] text-[var(--text-2)]">{pregunta.registro}</span>
              <textarea className="field mt-2 min-h-[112px] w-full text-[14px] leading-relaxed" value={nota} onChange={(e) => guardarNotaProyecto(proyecto.id, paso, e.target.value)} placeholder="Escribe tu observación, evidencia y razonamiento…" aria-describedby={`nota-ayuda-${proyecto.id}-${paso}`} />
              <span id={`nota-ayuda-${proyecto.id}-${paso}`} className="mt-1 block text-[11px] text-[var(--text-3)]">Borrador guardado localmente · escribe al menos 12 caracteres para registrar tu hallazgo · no incluyas datos reales.</span>
            </label>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
          <p className="m-0 max-w-[520px] text-[12px] text-[var(--text-3)]">Al final tendrás una hoja de trabajo con tus notas, decisiones y justificación. El informe se muestra aquí; no se exporta.</p>
          <button className="btn btn-primary" onClick={avanzar} disabled={!puedeAvanzar}>{paso === proyecto.pasos.length - 1 ? "Construir informe final" : "Guardar entregable y continuar →"}</button>
        </div>
        {!correcto && seleccion !== null && <p className="mt-2 text-right text-[12px] text-[var(--accent)]">Selecciona la recomendación respaldada por la evidencia.</p>}
        {correcto && nota.trim().length < 12 && <p className="mt-2 text-right text-[12px] text-[var(--cyan)]">Anota tu hallazgo para habilitar el siguiente paso.</p>}
      </> : <div className="mt-5 border-2 border-[var(--green)] bg-[#0f2418] p-4 sm:p-5" aria-labelledby="informe-final-title">
        <p className="label !text-[var(--green)]">Informe de trabajo · {new Date().toLocaleDateString("es")}</p>
        <h3 id="informe-final-title" className="mt-2 text-[20px]">{proyecto.producto}</h3>
        <p className="mt-2 text-[14px] text-[var(--text-2)]"><b>Objetivo del proyecto:</b> {proyecto.objetivo}</p>
        <div className="mt-4 grid gap-3">
          {proyecto.pasos.map((item, i) => <article key={item.titulo} className="border border-white/15 bg-black/20 p-3">
            <p className="label !text-[var(--green)]">Entregable {i + 1} · {item.entregaParcial}</p>
            <h4 className="mt-1 text-[15px]">{item.titulo}</h4>
            <p className="mt-2 text-[12px] text-[var(--text-3)]">Evidencia consultada</p>
            <pre className="mt-1 whitespace-pre-wrap break-words font-mono text-[11px] leading-relaxed text-[var(--text-2)]">{item.evidencia}</pre>
            <p className="mt-2 text-[12px] text-[var(--text-3)]">Mi anotación</p>
            <p className="mt-1 whitespace-pre-wrap text-[14px]">{p.proyectosNotas[proyecto.id]?.[i] || "Sin anotación"}</p>
            <p className="mt-2 text-[13px] text-[var(--green)]"><b>Decisión revisada:</b> {item.opciones[respuestas[i] ?? item.correcta]}</p>
            <p className="mt-1 text-[12px] text-[var(--text-2)]"><b>Explicación:</b> {item.porQue}</p>
          </article>)}
        </div>
        <div className="mt-4 border-t border-white/20 pt-3">
          <p className="text-[12px] text-[var(--text-3)]">Caso ficticio. La hoja se conserva en este navegador; no es certificación ni evidencia de una auditoría real. No contiene datos personales salvo que tú los escribas.</p>
          <button className="btn btn-sm mt-3" onClick={reiniciar}>Revisar o repetir proyecto</button>
        </div>
      </div>}
    </section>
  );
}
