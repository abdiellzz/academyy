import { useMemo, useRef, useState, type CSSProperties } from "react";
import { Globe } from "../components/Globe";
import { Adventurer, PixelIcon } from "../components/PixelArt";
import { Bar } from "../components/ui";
import { C, totalNiveles } from "../lib/content";
import { PROYECTOS, RUTAS_APRENDIZAJE } from "../lib/learning";
import { nivelCompleto, nivelDe, nivelesCompletos, useProgreso, xpDe } from "../lib/store";
import type { Marker } from "../lib/planet";
import type { Ruta } from "../types";
import { cn } from "../utils/cn";

/* Coordenadas del pin de cada mundo en el planeta. */
const COORDS: Record<string, { lat: number; lon: number }> = {
  seguridad: { lat: 9.0, lon: -79.5 }, // Panamá: tu base
  redes: { lat: 37.4, lon: -122.1 }, // Silicon Valley
  sistemas: { lat: 47.6, lon: -122.3 }, // Redmond
  python: { lat: 52.3, lon: 4.9 }, // Ámsterdam
  cripto: { lat: 47.4, lon: 8.5 }, // Zúrich
  social: { lat: 25.2, lon: 55.3 }, // Dubái
};

export function Home({ go }: { go: (r: Ruta) => void }) {
  const [p] = useProgreso();
  const [sel, setSel] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const dock = useRef<HTMLDivElement | null>(null);

  const done = nivelesCompletos(p);
  const xp = xpDe(p);
  const { lvl } = nivelDe(xp);

  const preview = hover ?? sel;
  const mundo = C.mundos[preview];
  const doneMundo = mundo.niveles.filter((n) => nivelCompleto(p, `${mundo.id}/${n.id}`)).length;
  const pctMundo = Math.round((doneMundo / mundo.niveles.length) * 100);
  const coord = COORDS[mundo.id] ?? { lat: 0, lon: 0 };

  const markers = useMemo<Marker[]>(
    () => [
      { lat: 8.98, lon: -79.52, color: "#5ad2ff", dot: true }, // tú estás acá
      { lat: coord.lat, lon: coord.lon, color: mundo.color },
    ],
    [coord.lat, coord.lon, mundo.color],
  );

  const siguiente = useMemo(() => {
    for (const m of C.mundos)
      for (const n of m.niveles)
        if (!nivelCompleto(p, `${m.id}/${n.id}`)) return { m, n };
    return null;
  }, [p]);

  function onKey(e: React.KeyboardEvent, i: number) {
    const total = C.mundos.length;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      go({ v: "mundo", id: C.mundos[i].id });
      return;
    }
    const step = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
    let next = -1;
    if (step) next = (i + step + total) % total;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = total - 1;
    if (next < 0) return;
    e.preventDefault();
    setSel(next);
    setHover(null);
    refs.current[next]?.focus();
  }

  // parallax suave de la Tierra siguiendo el mouse
  function onMove(e: React.MouseEvent) {
    const el = dock.current;
    if (!el) return;
    const x = e.clientX / window.innerWidth - 0.5;
    const y = e.clientY / window.innerHeight - 0.5;
    el.style.setProperty("--px", x.toFixed(3));
    el.style.setProperty("--py", y.toFixed(3));
  }

  return (
    <main id="main">
      {/* ── Centro de mando ── */}
      <section className="cmd-hero" onMouseMove={onMove} aria-labelledby="destino-title" style={{ ["--world" as string]: mundo.color }}>
        <div className="cmd-hero-bg" aria-hidden>
          <span className="px-a" />
          <span className="px-b" />
          <span className="px-c" />
          <span className="px-d" />
        </div>

        {/* Marca y nivel: arriba a la izquierda, como el HUD de la nave */}
        <div className="hero-brand">
          <div className="flex flex-wrap items-end gap-3">
            <div className="squad">
              <Adventurer who="diel" height={66} className="bob" />
              <span className="squad-name">Diel</span>
            </div>
            <div className="squad">
              <Adventurer who="hailey" height={66} className="bob squad-b" />
              <span className="squad-name">Hailey</span>
            </div>
            <div className="pb-1">
              <p className="label" style={{ color: "var(--accent)" }}>
                Tu escuadrón
              </p>
              <p className="mt-1 flex flex-wrap items-center gap-1.5">
                <span className="chip">Nivel {lvl}</span>
                <span className="chip">{xp} XP</span>
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 mx-auto max-w-[1240px] px-4">
          <div className="flex justify-end pb-8 pt-2 lg:pb-12 lg:pt-10">
            <div className="w-full max-w-[560px]">
              <h1 id="destino-title" className="hero-title">
                Aprende <span className="text-[var(--accent)]">ciberseguridad</span> de verdad
              </h1>
              <p className="mt-3 text-[17px] leading-relaxed text-[var(--text-2)]">
                {C.mundos.length} mundos, {totalNiveles} niveles y laboratorios que funcionan en el navegador.
                Teoría corta, práctica larga y un reto al final de cada nivel: de cero a criterio técnico.
              </p>
              <p className="mt-3 text-[13px] text-[var(--text-3)]">{done}/{totalNiveles} niveles completados · progreso privado en este navegador</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <button className="btn btn-primary" onClick={() => siguiente ? go({ v: "nivel", mundo: siguiente.m.id, nivel: siguiente.n.id }) : go({ v: "proyectos" })}>
                  {done === 0 ? "Empezar mi primera misión · 8 min" : siguiente ? "Continuar mi ruta" : "Elegir un proyecto final"}
                </button>
                <button className="btn" onClick={() => go({ v: "proyectos" })}>Ver proyectos</button>
              </div>
              <p className="mt-2 text-[12px] text-[var(--text-3)]">Sin cuenta, sin instalación y solo en entornos ficticios y seguros.</p>

              <div className="mt-6 mb-2 flex items-baseline justify-between gap-3">
                <p className="label !text-[var(--text)]">Elige un mundo</p>
                <p className="text-[12px] text-[var(--text-3)]">clic o ↑ ↓ · arrastra la Tierra</p>
              </div>

              <div
                role="listbox"
                aria-label="Elige un mundo"
                aria-activedescendant={`dest-${mundo.id}`}
                className="cmd-world-list mt-5 space-y-2"
              >
                {C.mundos.map((m, i) => {
                  const n = m.niveles.filter((l) => nivelCompleto(p, `${m.id}/${l.id}`)).length;
                  const pct = Math.round((n / m.niveles.length) * 100);
                  const activo = i === preview;
                  return (
                    <button
                      key={m.id}
                      id={`dest-${m.id}`}
                      ref={(el) => {
                        refs.current[i] = el;
                      }}
                      role="option"
                      aria-selected={i === sel}
                      tabIndex={i === sel ? 0 : -1}
                      onFocus={() => setSel(i)}
                      onMouseEnter={() => setHover(i)}
                      onMouseLeave={() => setHover(null)}
                      onClick={() => (i === sel ? go({ v: "mundo", id: m.id }) : (setSel(i), setHover(null)))}
                      onKeyDown={(e) => onKey(e, i)}
                      className={cn("dest", activo && "dest-on")}
                      style={{ "--world": m.color } as CSSProperties}
                    >
                      <span className="dest-hash">{String(i + 1).padStart(2, "0")}</span>
                      <span className="dest-tile" style={{ background: m.fondo }}>
                        <PixelIcon name={m.icono} size={26} />
                      </span>
                      <span className="dest-main">
                        <span className="dest-bioma" style={{ color: m.color }}>
                          {m.bioma}
                        </span>
                        <span className="dest-nombre">{m.nombre.replace("Mundo ", "")}</span>
                        <span className="dest-barra">
                          <span style={{ width: `${Math.max(2, pct)}%`, background: m.color }} />
                        </span>
                      </span>
                      <span className="dest-meta">
                        <span className="dest-pct">{pct}%</span>
                        <span className="dest-flecha" aria-hidden>
                          ▸
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>

              <div
                key={mundo.id}
                aria-live="polite"
                className="dest-detalle rise"
                style={{ "--world": mundo.color } as CSSProperties}
              >
                <p className="label" style={{ color: mundo.color }}>
                  ▶ Destino seleccionado · {mundo.bioma}
                </p>
                <p className="mt-1 text-[20px] font-bold leading-tight">{mundo.nombre}</p>
                <p className="mt-1 line-clamp-3 text-[15px] leading-relaxed text-[var(--text-2)]">
                  {mundo.descripcion}
                </p>
                <p className="mt-2 text-[13px] text-[var(--text-3)]">{mundo.niveles.length} niveles · {pctMundo}% completado</p>
                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <button
                    className="btn btn-primary flex-1"
                    onClick={() => go({ v: "mundo", id: mundo.id })}
                  >
                    <PixelIcon name="grass" size={16} /> Despegar
                    <span className="hidden sm:inline"> a {mundo.nombre.replace("Mundo ", "")}</span>
                  </button>
                  {siguiente && (
                    <button
                      className="btn"
                      onClick={() =>
                        go({ v: "nivel", mundo: siguiente.m.id, nivel: siguiente.n.id })
                      }
                    >
                      Seguir mi ruta
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* La Tierra, grande en la esquina */}
        <div ref={dock} className="globe-dock">
          <div className="globe-float">
            <Globe accent={mundo.color} markers={markers} />
          </div>
          <span className="globe-tag chip">
            <span className="live-dot" /> Tierra en vivo · arrástrame
          </span>
        </div>
      </section>

      <section id="rutas-aprendizaje" className="mx-auto max-w-[1120px] px-4 py-8" aria-labelledby="rutas-title">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div><p className="label !text-[var(--green)]">Aprende con un propósito</p><h2 id="rutas-title" className="mt-2">Elige tu ruta</h2><p className="mt-2 max-w-[680px] text-[15px] text-[var(--text-2)]">Rutas sugeridas, no bloqueos: puedes cambiar de mundo cuando quieras. Cada una termina con un proyecto de práctica.</p></div>
          <button className="btn btn-sm" onClick={() => go({ v: "proyectos" })}>Ver todos los proyectos →</button>
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          {RUTAS_APRENDIZAJE.map((ruta) => {
            const avance = ruta.niveles.filter((ref) => nivelCompleto(p, `${ref.mundo}/${ref.nivel}`)).length;
            const pendiente = ruta.niveles.find((ref) => !nivelCompleto(p, `${ref.mundo}/${ref.nivel}`));
            const proyecto = PROYECTOS.find((x) => x.id === ruta.proyecto)!;
            return <article key={ruta.id} className="card flex flex-col p-4">
              <div className="flex items-center gap-2"><PixelIcon name={ruta.icono} size={22} /><p className="label !text-[var(--green)]">Ruta · {avance}/{ruta.niveles.length}</p></div>
              <h3 className="mt-2 text-[18px]">{ruta.titulo}</h3>
              <p className="mt-1 min-h-[42px] text-[14px] text-[var(--text-2)]">{ruta.para}</p>
              <ol className="mt-3 list-decimal space-y-1 pl-5 text-[13px] text-[var(--text-2)]">
                {ruta.niveles.map((ref) => {
                  const mundoRuta = C.mundos.find((m) => m.id === ref.mundo);
                  const nivelRuta = mundoRuta?.niveles.find((n) => n.id === ref.nivel);
                  return <li key={`${ref.mundo}/${ref.nivel}`}>{nivelRuta?.titulo ?? ref.nivel}</li>;
                })}
              </ol>
              <p className="mt-3 border-t border-[var(--border-neutral)] pt-2 text-[13px]"><b>Proyecto final:</b> {proyecto.titulo}</p>
              <button className="btn btn-primary btn-sm mt-3" onClick={() => pendiente ? go({ v: "nivel", mundo: pendiente.mundo, nivel: pendiente.nivel }) : go({ v: "proyectos", id: ruta.proyecto })}>
                {pendiente ? avance ? "Continuar ruta" : "Empezar ruta" : "Abrir proyecto final"} →
              </button>
            </article>;
          })}
        </div>
        <div className="card mt-4 grid gap-3 p-4 text-[13px] text-[var(--text-2)] md:grid-cols-3" aria-label="Compromisos de aprendizaje">
          <p><b className="text-[var(--green)]">Práctica segura.</b> Los casos son ficticios; no requieren probar en sistemas ajenos.</p>
          <p><b className="text-[var(--cyan)]">Aprendizaje visible.</b> Cada nivel muestra objetivos y las fases completadas.</p>
          <p><b className="text-[var(--accent)]">Transparencia.</b> Las referencias muestran fecha de revisión y el certificado no es una credencial oficial.</p>
        </div>
      </section>

      <section className="home-next mx-auto max-w-[1120px] px-4 py-8" aria-label="Tu siguiente paso">
        <div className="home-next-card">
          <div className="min-w-0 flex-1">
            <p className="label !text-[var(--accent)]">Tu ruta · {done}/{totalNiveles} niveles</p>
            <h2 className="mt-2">{siguiente ? siguiente.n.titulo : "Completaste todos los mundos"}</h2>
            <p className="mt-2 text-[15px] text-[var(--text-2)]">
              {siguiente
                ? `${siguiente.m.nombre} · continúa desde donde te quedaste.`
                : "Buen trabajo. Si quieres seguir practicando, los retos CTF te esperan."}
            </p>
            <div className="mt-4 max-w-[520px]"><Bar value={(done / totalNiveles) * 100} color="var(--green)" label="Niveles completados" /></div>
          </div>
          <button
            className="btn btn-primary home-next-action"
            onClick={() => siguiente
              ? go({ v: "nivel", mundo: siguiente.m.id, nivel: siguiente.n.id })
              : go({ v: "retos" })}
          >
            {siguiente ? "Continuar" : "Ir a los retos"}<span aria-hidden>→</span>
          </button>
        </div>
        <div className="home-shortcuts" aria-label="Accesos rápidos">
          <button onClick={() => go({ v: "laboratorio" })}><b>Laboratorio</b><span>Practica en entorno ficticio</span></button>
          <button onClick={() => go({ v: "proyectos" })}><b>Proyectos finales</b><span>Entrega un informe práctico</span></button>
          <button onClick={() => go({ v: "retos" })}><b>Retos CTF</b><span>{C.retos.length} desafíos para resolver</span></button>
          <button onClick={() => go({ v: "progreso" })}><b>Tu progreso</b><span>Nivel {lvl} · {xp} XP</span></button>
        </div>
      </section>
    </main>
  );
}
