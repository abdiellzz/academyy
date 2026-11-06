import { useEffect, useState } from "react";
import { PixelIcon } from "../components/PixelArt";
import { PracticaView } from "../components/Practices";
import { Bar, Bloque, GameBox } from "../components/ui";
import { mundoById } from "../lib/content";
import { marcarFase, notify, nivelCompleto, useProgreso } from "../lib/store";
import type { Mundo, Nivel, Ruta } from "../types";
import { cn } from "../utils/cn";

export function WorldView({ id, go }: { id: string; go: (r: Ruta) => void }) {
  const m = mundoById(id);
  const [p] = useProgreso();
  if (!m) return <NotFound go={go} />;
  const done = m.niveles.filter((n) => nivelCompleto(p, `${m.id}/${n.id}`)).length;
  const next = m.niveles.find((n) => !nivelCompleto(p, `${m.id}/${n.id}`)) ?? m.niveles[0];
  return (
    <main id="main" style={{ ["--world" as string]: m.color }}>
      <section className="border-b-2 border-black" style={{ background: m.fondo }}>
        <div className="mx-auto max-w-[1100px] px-4 py-10">
          <button className="btn btn-ghost btn-xs" onClick={() => go({ v: "inicio" })} aria-label="Volver a todos los mundos">◀ Mundos</button>
          <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-[640px]">
              <span className="chip" style={{ color: m.color }}><PixelIcon name={m.icono} size={12} /> {m.bioma}</span>
              <h1 className="mt-4" style={{ color: m.color }}>{m.nombre}</h1>
              <p className="mt-3 text-[19px]">{m.tagline}</p>
              <p className="mt-2 text-[var(--text-2)]">{m.intro}</p>
            </div>
            <div className="card w-full max-w-[280px] p-4">
              <div className="flex items-center gap-3"><PixelIcon name={m.icono} size={40} /><div><p className="text-[18px]" style={{ fontFamily: "var(--font-title)", color: m.color }}>{Math.round((done / m.niveles.length) * 100)}%</p><p className="label mt-1">{done}/{m.niveles.length} niveles</p></div></div>
              <div className="mt-3"><Bar value={(done / m.niveles.length) * 100} color={m.color} /></div>
              <button className="btn btn-primary btn-sm mt-3 w-full" onClick={() => go({ v: "nivel", mundo: m.id, nivel: next.id })}>{done ? "Continuar" : "Empezar en el nivel 0"}</button>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-[1100px] px-4 py-10" aria-label="Mapa de niveles">
        <ol className="relative m-0 list-none space-y-3 p-0">
          <span aria-hidden className="absolute bottom-6 left-[29px] top-6 w-1 bg-[repeating-linear-gradient(180deg,var(--border-neutral-2)_0_8px,transparent_8px_14px)]" />
          {m.niveles.map((n, i) => {
            const k = `${m.id}/${n.id}`;
            const fases = p.niveles[k] ?? {};
            const isDone = nivelCompleto(p, k);
            const isNext = !isDone && m.niveles.slice(0, i).every((x) => nivelCompleto(p, `${m.id}/${x.id}`));
            return (
              <li key={n.id}>
                <button className="card card-hover relative flex w-full items-center gap-4 p-3 text-left" onClick={() => go({ v: "nivel", mundo: m.id, nivel: n.id })}
                  aria-label={`Nivel ${n.nivel}: ${n.titulo}. ${isDone ? "Completado" : isNext ? "Siguiente" : "Pendiente"}`}>
                  <span className={cn("relative z-10 grid h-14 w-14 shrink-0 place-items-center border-2 border-black", isDone ? "bg-[var(--green)]" : isNext ? "bg-[var(--accent)]" : "bg-[var(--surface-3)]")}>
                    <PixelIcon name={isDone ? "diamond" : n.icono} size={30} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2"><span className="label" style={{ color: m.color }}>Nivel {n.nivel}</span>{isNext && <span className="chip !py-0 !text-[var(--accent)]">▶ siguiente</span>}</span>
                    <span className="mt-1 block text-[19px] font-bold leading-tight">{n.titulo}</span>
                    <span className="mt-0.5 block truncate text-[15px] text-[var(--text-2)]">{n.subtitulo}</span>
                  </span>
                  <span className="hidden shrink-0 gap-1 sm:flex" aria-hidden>
                    {(["teoria", "practica", "reto"] as const).map((f) => <span key={f} title={f} className={cn("h-3 w-3 border-2 border-black", fases[f] ? "bg-[var(--green)]" : "bg-[var(--surface-3)]")} />)}
                  </span>
                  <span className="label hidden shrink-0 md:block">{n.minutos} min</span>
                </button>
              </li>
            );
          })}
        </ol>
      </section>
    </main>
  );
}

const FASES = [
  { id: "teoria", label: "Teoría", icon: "torch" },
  { id: "ejemplo", label: "Ejemplo", icon: "grass" },
  { id: "practica", label: "Práctica", icon: "pickaxe" },
  { id: "reto", label: "Reto", icon: "sword" },
] as const;

export function LevelView({ mundo, nivel, go }: { mundo: string; nivel: string; go: (r: Ruta) => void }) {
  const m = mundoById(mundo);
  const n = m?.niveles.find((x) => x.id === nivel);
  const [fase, setFase] = useState(0);
  const [prog] = useProgreso();
  const hechas = prog.niveles[`${mundo}/${nivel}`] ?? {};
  useEffect(() => { setFase(0); window.scrollTo({ top: 0 }); }, [mundo, nivel]);
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [fase]);
  if (!m || !n) return <NotFound go={go} />;
  const idx = m.niveles.indexOf(n);
  const key = `${m.id}/${n.id}`;
  return (
    <main id="main" style={{ ["--world" as string]: m.color }}>
      <section className="border-b-2 border-black" style={{ background: m.fondo }}>
        <div className="mx-auto max-w-[900px] px-4 py-7">
          <nav aria-label="Ruta" className="flex flex-wrap items-center gap-2">
            <button className="btn btn-ghost btn-xs" onClick={() => go({ v: "mundo", id: m.id })}>◀ {m.nombre}</button>
            <span className="label">Nivel {n.nivel} · {idx + 1}/{m.niveles.length} · {n.minutos} min</span>
          </nav>
          <div className="mt-4 flex items-start gap-4">
            <span className="hidden h-16 w-16 shrink-0 place-items-center border-2 border-black bg-black/40 sm:grid"><PixelIcon name={n.icono} size={40} /></span>
            <div><h1>{n.titulo}</h1><p className="mt-2 text-[18px] text-[var(--text-2)]">{n.subtitulo}</p></div>
          </div>
          <div className="card mt-5 p-3.5">
            <p className="label !text-[var(--accent)]">Al terminar podrás…</p>
            <ul className="m-0 mt-2 grid list-none gap-1.5 p-0 sm:grid-cols-3">{n.objetivos.map((o) => <li key={o} className="flex gap-2 text-[15px]"><PixelIcon name="xp" size={11} className="mt-1 shrink-0" />{o}</li>)}</ul>
          </div>
        </div>
      </section>

      <div className="sticky top-16 z-30 border-b-2 border-black bg-[var(--surface)]">
        <div className="mx-auto flex max-w-[900px] gap-1 overflow-x-auto px-4 py-2" role="tablist" aria-label="Fases del nivel">
          {FASES.map((f, i) => (
            <button key={f.id} role="tab" aria-selected={fase === i} aria-controls="fase-panel" className={cn("tab-btn shrink-0", fase === i && "active")} onClick={() => setFase(i)}>
              <PixelIcon name={f.icon} size={13} /> {f.label}
              {f.id !== "ejemplo" && hechas[f.id] ? <span aria-label="completada"> ✔</span> : null}
            </button>
          ))}
        </div>
      </div>

      <section id="fase-panel" role="tabpanel" className="mx-auto max-w-[860px] space-y-5 px-4 py-8">
        {fase === 0 && <>
          {n.teoria.map((b, i) => <Bloque key={i} b={b} />)}
          <Siguiente label="Entendido, ver el ejemplo" onClick={() => { marcarFase(key, "teoria"); setFase(1); }} />
        </>}
        {fase === 1 && <>
          {n.ejemplos.length ? n.ejemplos.map((e) => <GameBox key={e.titulo} juego={e.juego} titulo={e.titulo}>{e.texto}</GameBox>) : <p className="text-[var(--text-2)]">Este nivel no trae ejemplo extra: ¡pasa directo a la práctica!</p>}
          <Siguiente label="¡A practicar!" onClick={() => setFase(2)} />
        </>}
        {fase === 2 && <>
          {n.practica.map((pr, i) => <PracticaView key={`${key}-${i}`} p={pr} onDone={() => { if (!hechas.practica) notify({ titulo: "Práctica completada", texto: `${n.titulo} · +40 XP`, icono: "pickaxe" }); marcarFase(key, "practica"); }} />)}
          <Siguiente label="Ir al reto final" onClick={() => setFase(3)} />
        </>}
        {fase === 3 && <RetoNivel n={n} m={m} k={key} go={go} next={m.niveles[idx + 1]} />}
      </section>
    </main>
  );
}

function Siguiente({ label, onClick }: { label: string; onClick: () => void }) {
  return <div className="flex justify-end pt-2"><button className="btn btn-primary" onClick={onClick}>{label} ▶</button></div>;
}

function RetoNivel({ n, m, k, go, next }: { n: Nivel; m: Mundo; k: string; go: (r: Ruta) => void; next?: Nivel }) {
  const [p] = useProgreso();
  const [pick, setPick] = useState<number | null>(null);
  const yaHecho = nivelCompleto(p, k);
  const correct = pick === n.reto.respuesta;
  function choose(i: number) {
    setPick(i);
    if (i === n.reto.respuesta && !yaHecho) {
      marcarFase(k, "reto");
      notify({ titulo: "¡Nivel superado!", texto: `${n.titulo} · +60 XP`, icono: "diamond" });
    }
  }
  return (
    <div className="space-y-5">
      <div className="card p-5">
        <div className="flex items-center gap-2"><PixelIcon name="sword" size={20} /><span className="label !text-[var(--accent)]">Reto del nivel</span>{yaHecho && <span className="chip ml-auto !text-[var(--green)]">✔ superado</span>}</div>
        <p className="mt-3 text-[20px] font-bold">{n.reto.pregunta}</p>
        <div className="mt-4 grid gap-2" role="radiogroup" aria-label="Opciones de respuesta">
          {n.reto.opciones.map((o, i) => {
            const right = pick !== null && i === n.reto.respuesta && correct;
            const wrong = pick === i && i !== n.reto.respuesta;
            return (
              <button key={o} role="radio" aria-checked={pick === i} onClick={() => choose(i)} disabled={correct}
                className={cn("flex items-center gap-3 border-2 border-black p-3 text-left", right ? "bg-[#16301f]" : wrong ? "blink-red bg-[#3a1418]" : "bg-[var(--surface-2)] hover:bg-[var(--surface-3)]")}>
                <span className="grid h-8 w-8 shrink-0 place-items-center border-2 border-black bg-black/40 text-[10px]" style={{ fontFamily: "var(--font-title)" }}>{String.fromCharCode(65 + i)}</span>{o}
              </button>
            );
          })}
        </div>
        {pick !== null && (
          <p className={cn("mt-4 border-2 border-black p-3", correct ? "bg-[#16301f]" : "bg-[#2a1d0c]")} role="status">
            <b className={correct ? "text-[var(--green)]" : "text-[var(--accent)]"}>{correct ? "¡Correcto! " : "Casi, inténtalo otra vez. "}</b>{correct ? n.reto.explicacion : "Pista: vuelve a la teoría si hace falta, no hay apuro."}
          </p>
        )}
      </div>
      {correct && (
        <div className="card flex flex-col items-start justify-between gap-3 bg-[#16301f] p-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3"><PixelIcon name="chest" size={34} /><p><b>Nivel completado.</b> {next ? `Siguiente: ${next.titulo}` : `¡Terminaste ${m.nombre}!`}</p></div>
          {next ? <button className="btn btn-primary" onClick={() => go({ v: "nivel", mundo: m.id, nivel: next.id })}>Siguiente nivel ▶</button>
            : <button className="btn btn-primary" onClick={() => go({ v: "retos" })}>Ir a los retos CTF ▶</button>}
        </div>
      )}
    </div>
  );
}

export function NotFound({ go }: { go: (r: Ruta) => void }) {
  return (
    <main id="main" className="mx-auto max-w-[700px] px-4 py-20 text-center">
      <PixelIcon name="heart" size={48} />
      <h1 className="mt-4">404 · Bloque no encontrado</h1>
      <p className="mt-3 text-[var(--text-2)]">Este camino no existe (todavía). Vuelve al spawn.</p>
      <button className="btn btn-primary mt-6" onClick={() => go({ v: "inicio" })}>Volver al inicio</button>
    </main>
  );
}
