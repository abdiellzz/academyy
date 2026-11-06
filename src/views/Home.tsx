import { useRef, useState } from "react";
import { Earth } from "../components/Earth";
import { PixelIcon } from "../components/PixelArt";
import { Bar, GameBox, Logo, SectionHead } from "../components/ui";
import { C, totalNiveles } from "../lib/content";
import { nivelCompleto, nivelesCompletos, useProgreso } from "../lib/store";
import type { Ruta } from "../types";

export function Home({ go }: { go: (r: Ruta) => void }) {
  const [p] = useProgreso();
  const [focus, setFocus] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const done = nivelesCompletos(p);

  // Navegación por teclado: flechas mueven entre mundos, Enter entra (roving tabindex)
  function onKey(e: React.KeyboardEvent, i: number) {
    const cols = window.innerWidth >= 1024 ? 5 : window.innerWidth >= 640 ? 2 : 1;
    const map: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: cols, ArrowUp: -cols };
    if (e.key in map) {
      e.preventDefault();
      const n = Math.max(0, Math.min(C.mundos.length - 1, i + map[e.key]));
      setFocus(n); refs.current[n]?.focus();
    } else if (e.key === "Home") { e.preventDefault(); setFocus(0); refs.current[0]?.focus(); }
    else if (e.key === "End") { e.preventDefault(); const n = C.mundos.length - 1; setFocus(n); refs.current[n]?.focus(); }
  }

  const siguiente = (() => {
    for (const m of C.mundos) for (const n of m.niveles) if (!nivelCompleto(p, `${m.id}/${n.id}`)) return { m, n };
    return null;
  })();

  return (
    <main id="main">
      <section className="mx-auto grid max-w-[1240px] items-center gap-8 px-4 pb-10 pt-10 lg:grid-cols-[1.1fr_0.9fr] lg:pt-14">
        <div className="rise">
          <Logo size={72} />
          <h1 className="mt-7">Aprende ciberseguridad <span className="text-[var(--accent)]">bloque a bloque.</span></h1>
          <p className="mt-5 max-w-[580px] text-[19px] leading-relaxed text-[var(--text-2)]">
            ¡Qué xopá! Esto es <b className="text-[var(--text)]">{C.meta.nombre}</b>, tu {C.meta.subtitulo}. Redes, sistemas operativos, Python, criptografía y cómo no caer en estafas,
            explicado desde cero. En cada nivel: <b className="text-[var(--text)]">teoría + ejemplo + práctica + reto</b>. Sin jerga sin explicar, sin condescendencia.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {siguiente ? (
              <button className="btn btn-primary" onClick={() => go({ v: "nivel", mundo: siguiente.m.id, nivel: siguiente.n.id })}>
                <PixelIcon name="grass" size={16} /> {done ? "Continuar donde iba" : "Empezar desde cero"}
              </button>
            ) : (
              <button className="btn btn-primary" onClick={() => go({ v: "retos" })}><PixelIcon name="sword" size={16} /> ¡Todo completado! Ir a retos</button>
            )}
            <button className="btn" onClick={() => go({ v: "phishing" })}><PixelIcon name="flag" size={14} /> Detector de phishing</button>
          </div>
          {siguiente && (
            <p className="mt-3 text-[15px] text-[var(--text-3)]">Siguiente: <b className="text-[var(--text-2)]">{siguiente.m.nombre} · {siguiente.n.titulo}</b></p>
          )}
          <div className="mt-6 max-w-[420px]">
            <div className="mb-1 flex justify-between"><span className="label">Progreso total</span><span className="label !text-[var(--accent)]">{done}/{totalNiveles} niveles</span></div>
            <Bar value={(done / totalNiveles) * 100} color="var(--green)" />
          </div>
        </div>
        <div className="flex justify-center">
          <div className="relative">
            <Earth size={420} label="Tierra pixelada girando con su luna: el planeta conectado que vas a proteger" />
            <span className="chip absolute bottom-2 left-1/2 -translate-x-1/2"><span className="live-dot" /> {C.mundos.length} mundos por explorar</span>
          </div>
        </div>
      </section>

      <div className="grass" aria-hidden />

      <section className="mx-auto max-w-[1240px] px-4 py-12" aria-labelledby="mundos-title">
        <SectionHead kicker="Elige tu mundo" title="Cinco mundos, todos desde el nivel 0">
          <p className="text-[14px] text-[var(--text-3)]">Usa las flechas ← → ↑ ↓ y Enter para moverte con el teclado.</p>
        </SectionHead>
        <h2 id="mundos-title" className="sr-only">Mundos</h2>
        <div role="list" className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {C.mundos.map((m, i) => {
            const n = m.niveles.filter((l) => nivelCompleto(p, `${m.id}/${l.id}`)).length;
            return (
              <div role="listitem" key={m.id}>
                <button
                  ref={(el) => { refs.current[i] = el; }}
                  tabIndex={i === focus ? 0 : -1}
                  onFocus={() => setFocus(i)}
                  onKeyDown={(e) => onKey(e, i)}
                  onClick={() => go({ v: "mundo", id: m.id })}
                  aria-label={`${m.nombre}: ${m.tagline} ${n} de ${m.niveles.length} niveles completados`}
                  className="card card-hover flex h-full w-full flex-col overflow-hidden text-left"
                  style={{ ["--world" as string]: m.color }}
                >
                  <div className="relative grid h-[118px] place-items-center border-b-2 border-black" style={{ background: m.fondo }}>
                    <span className="label absolute left-2 top-2 !text-white/70">0{i + 1}</span>
                    <PixelIcon name={m.icono} size={60} className="bob" />
                  </div>
                  <div className="flex flex-1 flex-col p-3.5">
                    <p className="label" style={{ color: m.color }}>{m.bioma}</p>
                    <p className="mt-1 text-[19px] font-bold leading-tight">{m.nombre.replace("Mundo ", "")}</p>
                    <p className="mt-1.5 flex-1 text-[15px] text-[var(--text-2)]">{m.tagline}</p>
                    <div className="mt-3"><Bar value={(n / m.niveles.length) * 100} color={m.color} /></div>
                    <p className="label mt-1.5">{n}/{m.niveles.length} niveles</p>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-4 pb-6">
        <SectionHead kicker="La promesa" title="Así funciona cada nivel" />
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: "torch", t: "1 · Teoría", d: "La idea explicada desde cero, con cada término definido la primera vez." },
            { icon: "grass", t: "2 · Ejemplo", d: "Lo mismo, pero con Minecraft, Fortnite o algo bien de aquí de Panamá." },
            { icon: "pickaxe", t: "3 · Práctica", d: "Simuladores: terminal, firewall, subredes, cifrados reales, phishing…" },
            { icon: "sword", t: "4 · Reto", d: "Una pregunta para comprobar que lo entendiste. ¡Y +XP!" },
          ].map((x) => (
            <div key={x.t} className="card p-4">
              <PixelIcon name={x.icon as "torch"} size={30} />
              <h3 className="mt-3">{x.t}</h3>
              <p className="mt-2 text-[16px] text-[var(--text-2)]">{x.d}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <GameBox juego="panama" titulo="«Mami, cambié de número»">La estafa más famosa del país se aprende a esquivar en el Mundo Ingeniería Social. Spoiler: no te eligen a ti, eligen al que se deja.</GameBox>
          <GameBox juego="minecraft" titulo="Tu servidor, tus reglas">Whitelist, puertos y permisos explicados como lo que son: las reglas de tu servidor de Minecraft.</GameBox>
          <GameBox juego="fortnite" titulo="Por qué hay lag">UDP, latencia y traceroute desde Panamá hasta el servidor. Entenderás tus 120 de ping.</GameBox>
        </div>
      </section>
    </main>
  );
}
