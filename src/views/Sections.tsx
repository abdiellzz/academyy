import { useMemo, useState } from "react";
import { PixelIcon, type PixelIconName } from "../components/PixelArt";
import { PhishingGame } from "../components/Practices";
import { Bar, CopyBtn, SectionHead, Term } from "../components/ui";
import { C, mundoById, totalNiveles } from "../lib/content";
import { normalizar } from "../lib/crypto";
import { LOGROS, nivelDe, nivelesCompletos, notify, resetProgreso, useProgreso, xpDe } from "../lib/store";
import type { RetoCTF, Ruta } from "../types";
import { cn } from "../utils/cn";

function Hero({ icon, kicker, title, children }: { icon: PixelIconName; kicker: string; title: string; children: React.ReactNode }) {
  return (
    <section className="border-b-2 border-black bg-[#150f26]">
      <div className="mx-auto flex max-w-[1100px] flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center">
        <span className="grid h-20 w-20 shrink-0 place-items-center border-2 border-black bg-black/40 shadow-[4px_4px_0_#000]"><PixelIcon name={icon} size={48} /></span>
        <div><p className="label !text-[var(--accent)]">▶ {kicker}</p><h1 className="mt-2">{title}</h1><p className="mt-2 max-w-[680px] text-[18px] text-[var(--text-2)]">{children}</p></div>
      </div>
    </section>
  );
}

/* ═════════ RETOS CTF ═════════ */
export function Retos() {
  const [p, update] = useProgreso();
  const cats = ["Todos", ...Array.from(new Set(C.retos.map((r) => r.categoria)))];
  const [cat, setCat] = useState("Todos");
  const list = C.retos.filter((r) => cat === "Todos" || r.categoria === cat);
  const [sel, setSel] = useState(C.retos.find((r) => !p.retos.includes(r.id))?.id ?? C.retos[0].id);
  const r = C.retos.find((x) => x.id === sel)!;
  const score = C.retos.filter((x) => p.retos.includes(x.id)).reduce((a, x) => a + x.puntos, 0);
  const max = C.retos.reduce((a, x) => a + x.puntos, 0);
  function solve(rt: RetoCTF) {
    update((s) => ({ ...s, retos: s.retos.includes(rt.id) ? s.retos : [...s.retos, rt.id] }));
    notify({ titulo: "¡Bandera capturada!", texto: `${rt.titulo} · +${rt.puntos} XP`, icono: "flag" });
  }
  return (
    <main id="main">
      <Hero icon="sword" kicker={`${C.retos.length} retos · ${score}/${max} puntos`} title="Retos CTF">Capture The Flag: problemas sueltos para demostrar lo que sabes. Equivocarse es parte del juego; cada reto trae pista y solución explicada.</Hero>
      <section className="mx-auto max-w-[1100px] px-4 py-8">
        <div className="no-scrollbar flex gap-1.5 overflow-x-auto pb-2" role="tablist" aria-label="Categorías de retos">
          {cats.map((c) => <button key={c} role="tab" aria-selected={cat === c} className={cn("tab-btn shrink-0", cat === c && "active")} onClick={() => setCat(c)}>{c}</button>)}
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-[300px_1fr]">
          <ul className="card m-0 max-h-[560px] list-none overflow-auto p-2" aria-label="Lista de retos">
            {list.map((x) => {
              const ok = p.retos.includes(x.id);
              return (
                <li key={x.id}>
                  <button onClick={() => setSel(x.id)} aria-current={sel === x.id ? "true" : undefined} className={cn("flex w-full items-center gap-2 border-2 p-2 text-left", sel === x.id ? "border-black bg-[var(--surface-3)]" : "border-transparent hover:bg-[var(--surface-2)]")}>
                    <PixelIcon name={ok ? "diamond" : "flag"} size={18} />
                    <span className="min-w-0 flex-1"><span className="block truncate font-bold">{x.titulo}</span><span className="label">{x.dificultad} · {x.puntos} pts</span></span>
                  </button>
                </li>
              );
            })}
          </ul>
          <RetoCard key={r.id} r={r} solved={p.retos.includes(r.id)} onSolve={() => solve(r)} />
        </div>
      </section>
    </main>
  );
}

function RetoCard({ r, solved, onSolve }: { r: RetoCTF; solved: boolean; onSolve: () => void }) {
  const [v, setV] = useState("");
  const [fails, setFails] = useState(0);
  const [hint, setHint] = useState(false);
  const [wrong, setWrong] = useState(false);
  function check(val = v) {
    if (solved || !val.trim()) return;
    if (r.aceptadas.some((a) => normalizar(a) === normalizar(val))) onSolve();
    else { setFails((f) => f + 1); setWrong(true); setTimeout(() => setWrong(false), 500); }
  }
  const m = mundoById(r.mundo);
  return (
    <article className="card p-5" aria-labelledby={`r-${r.id}`}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="chip">{r.categoria}</span><span className="chip">{r.dificultad}</span><span className="chip !text-[var(--accent)]">+{r.puntos} XP</span>
        {m && <span className="chip" style={{ color: m.color }}>{m.nombre}</span>}
      </div>
      <h2 id={`r-${r.id}`} className="mt-4">{r.titulo}</h2>
      <p className="mt-3 text-[18px] text-[var(--text-2)]">{r.enunciado}</p>
      {r.cifrado && <div className="mt-3"><Term title="interceptado">{r.cifrado}</Term></div>}
      {r.tipo === "opciones" ? (
        <div className="mt-4 grid gap-2">
          {r.opciones?.map((o, i) => (
            <button key={o} disabled={solved} onClick={() => check(String.fromCharCode(97 + i))} className="flex items-start gap-3 border-2 border-black bg-[var(--surface-2)] p-3 text-left hover:bg-[var(--surface-3)]">
              <span className="grid h-7 w-7 shrink-0 place-items-center border-2 border-black bg-black/40 text-[9px]" style={{ fontFamily: "var(--font-title)" }}>{String.fromCharCode(65 + i)}</span>{o}
            </button>
          ))}
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <label htmlFor={`in-${r.id}`} className="sr-only">Tu respuesta</label>
          <input id={`in-${r.id}`} className={cn("field mono", wrong && "shake")} value={v} disabled={solved} onChange={(e) => setV(e.target.value)} onKeyDown={(e) => e.key === "Enter" && check()} placeholder="tu respuesta…" />
          <button className="btn btn-primary" onClick={() => check()} disabled={solved}>Enviar</button>
        </div>
      )}
      {fails > 0 && !solved && <p className="mt-2 text-[var(--red)]" role="status">No es esa (intento {fails}). Sin pena: así se aprende.</p>}
      {solved && <div className="mt-4 border-2 border-black bg-[#16301f] p-3" role="status"><p className="label !text-[var(--green)]">✔ Solución: {r.solucion}</p><p className="mt-1">{r.explicacion}</p></div>}
      {!solved && (
        <div className="mt-4 flex flex-wrap gap-2">
          <button className="btn btn-sm" onClick={() => setHint((h) => !h)}>{hint ? "Ocultar pista" : "Ver pista"}</button>
          {fails >= 2 && <button className="btn btn-sm btn-ghost" onClick={() => alert(`Solución: ${r.solucion}\n\n${r.explicacion}`)}>Rendirme y ver solución</button>}
        </div>
      )}
      {hint && !solved && <p className="mt-2 border-2 border-black bg-[#2a1d0c] p-3">{r.pista}</p>}
    </article>
  );
}

/* ═════════ PHISHING ═════════ */
export function Phishing() {
  const [p, update] = useProgreso();
  const [run, setRun] = useState(0);
  return (
    <main id="main">
      <Hero icon="flag" kicker={`Récord: ${p.phishingBest}/10 · partidas: ${p.phishingPlayed}`} title="Detector de phishing">
        Diez mensajes reales de SMS, WhatsApp, correo y Discord. Decide si son legítimos o un anzuelo. Recuerda: no te eligen a ti, eligen al que se deja.
      </Hero>
      <section className="mx-auto max-w-[760px] px-4 py-8">
        <PhishingGame key={run} cantidad={10} onFinish={(ok) => update((s) => ({ ...s, phishingBest: Math.max(s.phishingBest, ok), phishingPlayed: s.phishingPlayed + 1 }))} />
        <button className="btn btn-sm mt-4" onClick={() => setRun((x) => x + 1)}>Nueva ronda con otros mensajes</button>
        <div className="card mt-6 p-4">
          <h3>Las 5 señales rojas</h3>
          <ul className="m-0 mt-3 list-none space-y-2 p-0 text-[var(--text-2)]">
            {["Prisa o amenaza: «hoy», «en 24 h», «se bloquea».", "Te piden un código, una contraseña o plata.", "El dominio real del enlace no es el oficial (léelo desde el final).", "Premios que no pediste o regalos demasiado buenos.", "Número o remitente nuevo que dice ser alguien conocido."].map((x) => <li key={x} className="flex gap-2"><PixelIcon name="heart" size={12} className="mt-1.5 shrink-0" />{x}</li>)}
          </ul>
        </div>
      </section>
    </main>
  );
}

/* ═════════ GUÍAS ═════════ */
export function Tutoriales({ go }: { go: (r: Ruta) => void }) {
  const [p, update] = useProgreso();
  const [sel, setSel] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const t = C.tutoriales.find((x) => x.id === sel);
  if (t) {
    const last = step === t.pasos.length - 1;
    const done = p.tutoriales.includes(t.id);
    const paso = t.pasos[step];
    return (
      <main id="main" className="mx-auto max-w-[860px] px-4 py-8">
        <button className="btn btn-ghost btn-xs" onClick={() => { setSel(null); setStep(0); }}>◀ Todas las guías</button>
        <h1 className="mt-4">{t.titulo}</h1>
        <p className="mt-2 text-[var(--text-2)]">{t.descripcion}</p>
        <div className="mt-4"><Bar value={((step + 1) / t.pasos.length) * 100} /></div>
        <ol className="no-scrollbar mt-4 flex list-none gap-1 overflow-x-auto p-0">
          {t.pasos.map((s, i) => <li key={s.titulo}><button onClick={() => setStep(i)} aria-current={i === step ? "step" : undefined} className={cn("step-dot", i < step && "done", i === step && "now")} aria-label={`Paso ${i + 1}: ${s.titulo}`}>{i + 1}</button></li>)}
        </ol>
        <div className="card mt-4 p-5">
          <p className="label !text-[var(--accent)]">Paso {step + 1} de {t.pasos.length}</p>
          <h2 className="mt-2">{paso.titulo}</h2>
          <p className="mt-3 text-[18px] leading-relaxed text-[var(--text-2)]">{paso.texto}</p>
          {paso.accion && <button className="btn btn-sm mt-4" onClick={() => { const v = paso.accion!.vista; if (mundoById(v)) go({ v: "mundo", id: v }); else go({ v } as Ruta); }}>{paso.accion.label} ▶</button>}
          <div className="mt-6 flex justify-between border-t-2 border-black pt-4">
            <button className="btn btn-sm" disabled={step === 0} onClick={() => setStep(step - 1)}>◀ Anterior</button>
            {last ? <button className={cn("btn btn-sm", done ? "btn-green" : "btn-primary")} disabled={done} onClick={() => { update((s) => ({ ...s, tutoriales: [...s.tutoriales, t.id] })); notify({ titulo: "Guía completada", texto: `${t.titulo} · +50 XP`, icono: "torch" }); }}>{done ? "✔ Completada" : "Completar guía"}</button>
              : <button className="btn btn-primary btn-sm" onClick={() => setStep(step + 1)}>Siguiente ▶</button>}
          </div>
        </div>
      </main>
    );
  }
  return (
    <main id="main">
      <Hero icon="torch" kicker={`${C.tutoriales.length} guías paso a paso`} title="Guías prácticas">Misiones cortas para hacer en tu PC o tu celular: hashes, servidores de Minecraft, WhatsApp blindado y más.</Hero>
      <section className="mx-auto grid max-w-[1100px] gap-4 px-4 py-8 sm:grid-cols-2 lg:grid-cols-3">
        {C.tutoriales.map((x) => (
          <button key={x.id} className="card card-hover flex flex-col p-4 text-left" onClick={() => { setSel(x.id); setStep(0); }}>
            <div className="flex items-center justify-between"><PixelIcon name={(x.icono in { grass: 1, heart: 1 } ? x.icono : "torch") as PixelIconName} size={30} />{p.tutoriales.includes(x.id) && <span className="chip !text-[var(--green)]">✔ hecha</span>}</div>
            <h3 className="mt-3">{x.titulo}</h3>
            <p className="mt-2 flex-1 text-[15px] text-[var(--text-2)]">{x.descripcion}</p>
            <p className="label mt-3">{x.nivel} · {x.minutos} min · {x.pasos.length} pasos</p>
          </button>
        ))}
      </section>
    </main>
  );
}

/* ═════════ GLOSARIO ═════════ */
export function Glosario() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("Todos");
  const cats = ["Todos", ...Array.from(new Set(C.glosario.map((g) => g.categoria))).sort()];
  const list = useMemo(() => C.glosario.filter((g) => (cat === "Todos" || g.categoria === cat) && (!q || normalizar(g.termino + " " + g.definicion + " " + g.detalle).includes(normalizar(q)))), [q, cat]);
  return (
    <main id="main">
      <Hero icon="chest" kicker={`${C.glosario.length} términos`} title="Glosario">Cada palabra rara, explicada en cristiano. Si en un nivel algo no te cuadra, búscalo aquí.</Hero>
      <section className="mx-auto max-w-[1100px] px-4 py-8">
        <label htmlFor="g-q" className="sr-only">Buscar en el glosario</label>
        <input id="g-q" className="field" placeholder="Busca «DNS», «hash», «phishing»…" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="no-scrollbar mt-3 flex gap-1.5 overflow-x-auto pb-1">{cats.map((c) => <button key={c} className={cn("tab-btn shrink-0", cat === c && "active")} onClick={() => setCat(c)} aria-pressed={cat === c}>{c}</button>)}</div>
        <p className="label mt-3">{list.length} resultados</p>
        <dl className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((g) => (
            <div key={g.termino} className="card p-4">
              <p className="label !text-[var(--cyan)]">{g.categoria}</p>
              <dt className="mt-1 text-[19px] font-bold">{g.termino}</dt>
              <dd className="m-0 mt-1 text-[var(--text)]">{g.definicion}</dd>
              <dd className="m-0 mt-2 border-t-2 border-dashed border-[var(--border-neutral)] pt-2 text-[15px] text-[var(--text-2)]">{g.detalle}</dd>
            </div>
          ))}
        </dl>
        {!list.length && <p className="card mt-4 p-6 text-center text-[var(--text-2)]">Nada por aquí. Prueba otra palabra.</p>}
      </section>
    </main>
  );
}

/* ═════════ SNIPPETS ═════════ */
export function Snippets() {
  const cats = ["Todos", ...Array.from(new Set(C.snippets.map((s) => s.categoria)))];
  const [cat, setCat] = useState("Todos");
  return (
    <main id="main">
      <Hero icon="snake" kicker={`${C.snippets.length} snippets`} title="Snippets útiles">Recetas cortas de terminal y Python para el día a día. Cópialas, pruébalas en TU equipo y lee la explicación antes de ejecutar nada.</Hero>
      <section className="mx-auto max-w-[1100px] px-4 py-8">
        <div className="no-scrollbar flex gap-1.5 overflow-x-auto pb-1">{cats.map((c) => <button key={c} className={cn("tab-btn shrink-0", cat === c && "active")} onClick={() => setCat(c)} aria-pressed={cat === c}>{c}</button>)}</div>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {C.snippets.filter((s) => cat === "Todos" || s.categoria === cat).map((s) => (
            <article key={s.id} className="card p-4">
              <div className="flex items-center justify-between gap-2"><div><p className="label !text-[var(--accent)]">{s.categoria} · {s.lenguaje}</p><h3 className="mt-1">{s.titulo}</h3></div><CopyBtn value={s.codigo} /></div>
              <pre className="code-pixel mt-3 p-3" data-allow-copy>{s.codigo}</pre>
              <p className="mt-3 text-[16px] text-[var(--text-2)]"><b className="text-[var(--green)]">Qué hace: </b>{s.explicacion}</p>
            </article>
          ))}
        </div>
        <p className="card mt-6 bg-[#2a0e14] p-4 text-[15px]">⚠️ Nunca pegues en tu terminal ni en la consola del navegador código que no entiendes. Los escáneres solo contra equipos propios o con permiso escrito.</p>
      </section>
    </main>
  );
}

/* ═════════ PROGRESO ═════════ */
export function Progreso({ go }: { go: (r: Ruta) => void }) {
  const [p] = useProgreso();
  const xp = xpDe(p);
  const { lvl, pct, falta } = nivelDe(xp);
  const done = nivelesCompletos(p);
  return (
    <main id="main">
      <Hero icon="diamond" kicker={`Nivel ${lvl} · ${xp} XP`} title="Tu progreso">Todo se guarda en este navegador (sin cuentas ni servidores). Si borras los datos del sitio, empiezas de nuevo.</Hero>
      <section className="mx-auto max-w-[1100px] px-4 py-8">
        <div className="grid gap-3 sm:grid-cols-4">
          {[["Nivel", lvl, "var(--green)"], ["XP", xp, "var(--accent)"], ["Niveles", `${done}/${totalNiveles}`, "var(--cyan)"], ["Retos", `${p.retos.length}/${C.retos.length}`, "var(--violet)"]].map(([l, v, c]) => (
            <div key={l as string} className="card p-4 text-center"><p className="label">{l}</p><p className="mt-2 text-[18px]" style={{ fontFamily: "var(--font-title)", color: c as string }}>{v}</p></div>
          ))}
        </div>
        <div className="card mt-4 p-4"><div className="mb-1 flex justify-between"><span className="label">Hacia el nivel {lvl + 1}</span><span className="label">faltan {falta} XP</span></div><Bar value={pct} color="var(--green)" /></div>
        <SectionHead kicker="Mundos" title="Avance por mundo" />
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {C.mundos.map((m) => { const n = m.niveles.filter((l) => p.niveles[`${m.id}/${l.id}`]?.reto).length; return (
            <button key={m.id} className="card card-hover p-3 text-left" onClick={() => go({ v: "mundo", id: m.id })} style={{ ["--world" as string]: m.color }}>
              <PixelIcon name={m.icono} size={28} /><p className="mt-2 font-bold" style={{ color: m.color }}>{m.nombre.replace("Mundo ", "")}</p><div className="mt-2"><Bar value={(n / m.niveles.length) * 100} color={m.color} /></div><p className="label mt-1">{n}/{m.niveles.length}</p>
            </button>); })}
        </div>
        <div className="mt-10"><SectionHead kicker={`${p.logros.length}/${LOGROS.length}`} title="Logros" /></div>
        <ul className="m-0 mt-4 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {LOGROS.map((l) => { const ok = p.logros.includes(l.id); return (
            <li key={l.id} className={cn("card flex items-center gap-3 p-3", !ok && "opacity-55")}>
              <span className="grid h-12 w-12 shrink-0 place-items-center border-2 border-black bg-black/40" aria-hidden>{ok ? <PixelIcon name={l.icono as PixelIconName} size={28} /> : <span className="text-[18px]">🔒</span>}</span>
              <div><p className="font-bold">{l.titulo}</p><p className="text-[14px] text-[var(--text-2)]">{l.desc}</p><span className="sr-only">{ok ? "desbloqueado" : "bloqueado"}</span></div>
            </li>); })}
        </ul>
        <button className="btn btn-ghost btn-sm mt-8" onClick={() => { if (confirm("¿Seguro? Se borra todo tu progreso de este navegador.")) resetProgreso(); }}>Reiniciar progreso</button>
      </section>
    </main>
  );
}
