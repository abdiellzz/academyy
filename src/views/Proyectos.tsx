import { useEffect, useState } from "react";
import { PixelIcon } from "../components/PixelArt";
import { LearningFlow } from "../components/LearningFlow";
import { useProgreso, guardarProyecto } from "../lib/store";
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
          <p className="label !text-[var(--green)]">Proyectos de cierre · casos ficticios</p>
          <h1 className="mt-2">Demuestra lo que sabes hacer</h1>
          <p className="mt-3 max-w-[760px] text-[17px] leading-relaxed text-[var(--text-2)]">Elige una misión breve, toma decisiones con evidencia y termina con un informe. No se conecta a cuentas ni redes reales; puedes repetirlo para practicar.</p>
          <LearningFlow title="De caso a informe" className="mt-4 max-w-[680px]" steps={[{ label: "Observar", icon: "search" }, { label: "Decidir", icon: "key" }, { label: "Justificar", icon: "torch" }, { label: "Informar", icon: "flag" }]} />
          <p className="mt-3 text-[13px] text-[var(--text-3)]">{p.proyectosFinalizados.length}/{PROYECTOS.length} proyectos completados · cada proyecto suma 50 XP una sola vez.</p>
        </div>
      </section>

      <section className="mx-auto max-w-[1100px] px-4 py-8" aria-labelledby="elige-proyecto">
        <h2 id="elige-proyecto" className="sr-only">Elige una misión final</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {PROYECTOS.map((x) => {
            const activo = x.id === proyecto.id;
            const listo = p.proyectosFinalizados.includes(x.id);
            return <button key={x.id} className={cn("card p-4 text-left transition-colors", activo && "ring-2 ring-[var(--green)]")} aria-pressed={activo} onClick={() => setSeleccionado(x.id)}>
              <div className="flex items-start justify-between gap-2"><span className="label !text-[var(--green)]">{listo ? "✔ completado" : "Proyecto práctico"}</span><PixelIcon name={listo ? "diamond" : "flag"} size={22} /></div>
              <h3 className="mt-2 text-[17px]">{x.titulo}</h3>
              <p className="mt-2 text-[14px] text-[var(--text-2)]">{x.subtitulo}</p>
              <p className="mt-3 border-t border-[var(--border-neutral)] pt-2 text-[13px] text-[var(--cyan)]">Entrega: {x.producto}</p>
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
  const [paso, setPaso] = useState(0);
  const [seleccion, setSeleccion] = useState<number | null>(null);
  const [respuestas, setRespuestas] = useState<number[]>([]);
  const [informe, setInforme] = useState(false);
  const pregunta = proyecto.pasos[paso];
  const correcto = seleccion === pregunta.correcta;

  function avanzar() {
    if (!correcto) return;
    const nuevas = [...respuestas, seleccion!];
    setRespuestas(nuevas);
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
        <div><p className="label !text-[var(--green)]">Misión final · {proyecto.pasos.length} decisiones</p><h2 id="proyecto-activo-title" className="mt-1">{proyecto.titulo}</h2></div>
        {yaCompletado && <span className="chip !text-[var(--green)]">Mejor práctica guardada</span>}
      </div>
      <p className="mt-2 text-[14px] text-[var(--text-2)]"><b>Objetivo:</b> {proyecto.objetivo}</p>

      {!informe ? <>
        <div className="mt-4 flex items-center justify-between gap-3"><p className="label">Paso {paso + 1} de {proyecto.pasos.length}</p><span className="mono text-[13px] text-[var(--text-3)]">{respuestas.length} decisiones validadas</span></div>
        <div className="mt-2 h-2 border border-black bg-[var(--surface-3)]" role="progressbar" aria-label="Avance del proyecto" aria-valuemin={0} aria-valuemax={proyecto.pasos.length} aria-valuenow={paso}><span className="block h-full bg-[var(--green)] transition-[width]" style={{ width: `${(paso / proyecto.pasos.length) * 100}%` }} /></div>
        <fieldset className="mt-4 border-0 p-0">
          <legend className="text-[17px] font-bold">{pregunta.pregunta}</legend>
          <div className="mt-3 grid gap-2">
            {pregunta.opciones.map((opcion, i) => <label key={opcion} className={cn("flex cursor-pointer items-start gap-3 border-2 border-black p-3", seleccion === i ? "bg-[var(--surface-3)]" : "bg-[var(--surface-2)] hover:bg-[var(--surface-3)]")}>
              <input type="radio" name={`proyecto-${proyecto.id}-${paso}`} checked={seleccion === i} onChange={() => setSeleccion(i)} />
              <span>{opcion}</span>
            </label>)}
          </div>
        </fieldset>
        {seleccion !== null && <div className={cn("mt-3 border-2 border-black p-3", correcto ? "bg-[#16301f]" : "bg-[#2a1d0c]")} role="status" aria-live="polite">
          {correcto ? <><b className="text-[var(--green)]">Buena decisión.</b> {pregunta.porQue}</> : <><b className="text-[var(--accent)]">Revisa la evidencia.</b> Inténtalo de nuevo; no hay penalización.</>}
        </div>}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <p className="text-[12px] text-[var(--text-3)]">El informe separa observaciones de hipótesis; no es una certificación profesional.</p>
          <button className="btn btn-primary" onClick={avanzar} disabled={!correcto}>{paso === proyecto.pasos.length - 1 ? "Generar informe" : "Siguiente paso →"}</button>
        </div>
      </> : <div className="mt-5 border-2 border-[var(--green)] bg-[#0f2418] p-4" aria-labelledby="informe-final-title">
        <p className="label !text-[var(--green)]">Informe completado · {new Date().toLocaleDateString("es")}</p>
        <h3 id="informe-final-title" className="mt-2 text-[18px]">{proyecto.producto}</h3>
        <p className="mt-2 text-[14px] text-[var(--text-2)]"><b>Objetivo:</b> {proyecto.objetivo}</p>
        <ol className="mt-3 space-y-3 pl-5">
          {proyecto.pasos.map((item, i) => <li key={item.pregunta} className="pl-1">
            <p className="font-bold">{item.pregunta}</p>
            <p className="mt-1 text-[14px] text-[var(--green)]">Decisión: {item.opciones[respuestas[i]]}</p>
            <p className="mt-1 text-[13px] text-[var(--text-2)]">Razón: {item.porQue}</p>
          </li>)}
        </ol>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-white/20 pt-3">
          <p className="text-[12px] text-[var(--text-3)]">Caso completamente ficticio. No contiene datos personales ni evidencia de un sistema real.</p>
          <button className="btn btn-sm" onClick={reiniciar}>Repetir proyecto</button>
        </div>
      </div>}
    </section>
  );
}
