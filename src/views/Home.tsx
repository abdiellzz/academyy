import { useMemo, useRef, useState, type CSSProperties } from "react";
import { Globe } from "../components/Globe";
import { Adventurer, PixelIcon, type PixelIconName } from "../components/PixelArt";
import { BiomaGrid } from "../components/Biome";
import { Bar, GameBox, Logo, SectionHead } from "../components/ui";
import { C, totalNiveles } from "../lib/content";
import { LOGROS, nivelCompleto, nivelDe, nivelesCompletos, useProgreso, xpDe } from "../lib/store";
import type { Marker } from "../lib/planet";
import type { Mundo, Nivel, Ruta } from "../types";
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

/* Laboratorios: se buscan en el contenido para que los enlaces nunca queden viejos. */
const LABS: { key: string; label: string; icon: PixelIconName; desc: string }[] = [
  { key: "w:terminal", label: "Terminal Linux", icon: "monitor", desc: "Un mini-CTF dentro de una terminal real." },
  { key: "w:subnet", label: "Subredes", icon: "globe", desc: "Máscaras, hosts y rangos sin fórmulas raras." },
  { key: "w:firewall", label: "Firewall", icon: "shield", desc: "Abre y cierra puertos y mira quién pasa." },
  { key: "w:chmod", label: "Permisos chmod", icon: "key", desc: "r/w/x sobre archivos, con binario incluido." },
  { key: "password", label: "Medidor de contraseñas", icon: "key", desc: "Entropía real y tiempo de descifrado." },
  { key: "phishing", label: "Detector de phishing", icon: "flag", desc: "Diez mensajes: legítimo o anzuelo." },
  { key: "w:xor", label: "XOR bit a bit", icon: "diamond", desc: "El ladrillo de todo cifrado, torciendo bits." },
  { key: "w:vigenere", label: "Vigenère", icon: "chest", desc: "La clave que se repite, y por qué se cae." },
  { key: "w:frecuencia", label: "Criptoanálisis", icon: "torch", desc: "Rompe un cifrado con estadística del idioma." },
  { key: "w:rsa", label: "RSA paso a paso", icon: "globe", desc: "Clave pública y privada con números pequeños." },
  { key: "w:kdf", label: "PBKDF2 y sales", icon: "key", desc: "Cómo se guarda (de verdad) una contraseña." },
  { key: "w:brute", label: "Fuerza bruta", icon: "sword", desc: "10 000 intentos reales contra un PIN de 4 cifras." },
];

function coords(lat: number, lon: number) {
  const ns = lat >= 0 ? "N" : "S";
  const ow = lon >= 0 ? "E" : "O";
  return `${Math.abs(lat).toFixed(1)}° ${ns} · ${Math.abs(lon).toFixed(1)}° ${ow}`;
}

export function Home({ go }: { go: (r: Ruta) => void }) {
  const [p] = useProgreso();
  const [sel, setSel] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const dock = useRef<HTMLDivElement | null>(null);

  const done = nivelesCompletos(p);
  const xp = xpDe(p);
  const { lvl, falta } = nivelDe(xp);

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

  const labs = useMemo(() => {
    const out: { key: string; label: string; icon: PixelIconName; desc: string; mundo: Mundo; nivel: Nivel }[] = [];
    for (const l of LABS) {
      buscar: for (const m of C.mundos)
        for (const n of m.niveles)
          for (const p of n.practica) {
            const k = p.tipo === "widget" ? `w:${p.w}` : p.tipo;
            if (k === l.key) {
              out.push({ ...l, mundo: m, nivel: n });
              break buscar;
            }
          }
    }
    return out;
  }, []);

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

  const accesos: { v: Ruta["v"]; label: string }[] = [
    { v: "retos", label: "Retos" },
    { v: "phishing", label: "Phishing" },
    { v: "tutoriales", label: "Guías" },
    { v: "glosario", label: "Glosario" },
  ];

  const secciones: {
    v: Ruta["v"];
    icon: PixelIconName;
    color: string;
    fondo: string;
    titulo: string;
    desc: string;
    cuenta: string;
  }[] = [
    {
      v: "retos",
      icon: "sword",
      color: "var(--accent)",
      fondo: "#2a1d0c",
      titulo: "Retos CTF",
      desc: "Banderas escondidas en archivos, hashes y tráfico. Pista, solución y puntos.",
      cuenta: `${C.retos.length} retos`,
    },
    {
      v: "phishing",
      icon: "flag",
      color: "var(--red)",
      fondo: "#2a0e14",
      titulo: "Detector de phishing",
      desc: "SMS, WhatsApp, correo y Discord falsos. Aprende a ver la señal antes del clic.",
      cuenta: `${C.phishing.length} mensajes`,
    },
    {
      v: "tutoriales",
      icon: "torch",
      color: "var(--green)",
      fondo: "#0f2418",
      titulo: "Guías paso a paso",
      desc: "Recetas cortas para hacer cosas reales: tu primera VPN, respaldos, 2FA.",
      cuenta: `${C.tutoriales.length} guías`,
    },
    {
      v: "glosario",
      icon: "chest",
      color: "var(--cyan)",
      fondo: "#0c1f2c",
      titulo: "Glosario",
      desc: "Todo término raro explicado como si fuera la primera vez que lo escuchas.",
      cuenta: `${C.glosario.length} términos`,
    },
    {
      v: "snippets",
      icon: "snake",
      color: "var(--violet)",
      fondo: "#1c1238",
      titulo: "Snippets",
      desc: "Comandos de terminal y Python listos para copiar, con la explicación al lado.",
      cuenta: `${C.snippets.length} recetas`,
    },
    {
      v: "progreso",
      icon: "diamond",
      color: "var(--green)",
      fondo: "#0b2419",
      titulo: "Tu progreso",
      desc: "XP, nivel, avance por mundo y logros. Se guarda en este navegador.",
      cuenta: `Nivel ${lvl} · ${p.logros.length}/${LOGROS.length} logros`,
    },
  ];

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
                ▶ Tu escuadrón
              </p>
              <p className="mt-1 flex flex-wrap items-center gap-1.5">
                <span className="chip">Nivel {lvl}</span>
                <span className="chip">{xp} XP</span>
                <span className="chip">
                  {p.logros.length}/{LOGROS.length} logros
                </span>
              </p>
              <p className="mt-1.5 max-w-[220px] text-[13px] leading-snug text-[var(--text-3)]">
                Diel y Hailey despegan contigo: cada mundo es una misión y cada nivel, una expedición.
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 mx-auto max-w-[1240px] px-4">
          <div className="flex justify-end pb-8 pt-2 lg:pb-12 lg:pt-10">
            <div className="w-full max-w-[560px]">
              <h1 id="destino-title" className="hero-title">
                Elige tu <span className="text-[var(--accent)]">destino</span>
              </h1>
              <p className="mt-3 text-[17px] leading-relaxed text-[var(--text-2)]">
                {C.mundos.length} planetas, {C.mundos.length} misiones. Pasa el mouse para explorarlos y haz
                clic para apuntar la nave. <b className="text-[var(--text)]">{done}</b> de {totalNiveles}{" "}
                niveles ya están en tu mochila.
              </p>

              <div
                role="listbox"
                aria-label="Elige un mundo"
                aria-activedescendant={`dest-${mundo.id}`}
                className="mt-5 space-y-2"
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

              <p className="mt-2 text-[13px] text-[var(--text-3)]">
                Clic para elegir · <b className="text-[var(--text-2)]">Enter</b> para despegar · flechas para
                cambiar de mundo
              </p>

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
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  <span className="chip">{mundo.niveles.length} niveles</span>
                  <span className="chip">teoría + práctica + reto</span>
                  <span className="chip">{coord ? coords(coord.lat, coord.lon) : ""}</span>
                </div>
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
                <p className="mt-2 text-[13px] text-[var(--text-3)]">
                  {pctMundo}% completado · {mundo.niveles.length - doneMundo} niveles te faltan aquí
                </p>
              </div>

              <p className="mt-2 text-[13px] text-[var(--text-3)]">
                💡 Arrastra la Tierra para girarla: Diel y Hailey te marcan el destino.
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <span className="label">O salta directo a</span>
                {accesos.map((a) => (
                  <button key={a.v} className="chip chip-btn" onClick={() => go({ v: a.v } as Ruta)}>
                    {a.label}
                  </button>
                ))}
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

      {/* ── Tablero de progreso ── */}
      <section className="mx-auto max-w-[1240px] px-4 py-8" aria-label="Tu tablero">
        <div className="stat-strip rise">
          {[
            { k: "Nivel", v: String(lvl), s: `faltan ${falta} XP` },
            { k: "XP total", v: String(xp), s: "experiencia acumulada" },
            { k: "Niveles", v: `${done}/${totalNiveles}`, s: "completados" },
            { k: "Logros", v: `${p.logros.length}/${LOGROS.length}`, s: "desbloqueados" },
          ].map((s, i) => (
            <div key={s.k} className="stat">
              <p className="label">{s.k}</p>
              <p className="stat-num">{s.v}</p>
              <p className="text-[13px] text-[var(--text-3)]">{s.s}</p>
              {i === 2 && (
                <div className="mt-2">
                  <Bar value={(done / totalNiveles) * 100} color="var(--green)" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Laboratorio abierto ── */}
      <section className="mx-auto max-w-[1240px] px-4 pb-4" aria-labelledby="lab-title">
        <SectionHead kicker="Aprende haciendo" title="Laboratorio abierto">
          <p className="max-w-[460px] text-[14px] text-[var(--text-3)]">
            Simuladores de verdad, sin instalar nada. Entras directo a la práctica y cada una te explica el porqué.
          </p>
        </SectionHead>
        <h2 id="lab-title" className="sr-only">
          Laboratorio abierto
        </h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {labs.map((l) => (
            <button
              key={l.key}
              onClick={() => go({ v: "nivel", mundo: l.mundo.id, nivel: l.nivel.id, lab: true })}
              className="card card-hover flex items-start gap-3 p-3.5 text-left"
              style={{ ["--world" as string]: l.mundo.color }}
            >
              <span
                className="grid h-11 w-11 shrink-0 place-items-center border-2 border-black"
                style={{ background: l.mundo.fondo }}
              >
                <PixelIcon name={l.icon} size={24} className="bob" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="label" style={{ color: l.mundo.color }}>
                  {l.mundo.nombre.replace("Mundo ", "")}
                </span>
                <span className="mt-0.5 block text-[17px] font-bold leading-tight">{l.label}</span>
                <span className="mt-1 block text-[14px] leading-snug text-[var(--text-2)]">{l.desc}</span>
              </span>
              <span className="vault-arrow" aria-hidden>
                →
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ── Los seis biomas ── */}
      <section className="mx-auto max-w-[1240px] px-4 pb-4" aria-labelledby="biomas-title">
        <SectionHead kicker="Seis mundos, seis terrenos" title="Los biomas de la bóveda">
          <p className="max-w-[460px] text-[14px] text-[var(--text-3)]">
            Cada mundo tiene su propio terreno, su color y sus reglas. Entra al que te pida el cuerpo.
          </p>
        </SectionHead>
        <h2 id="biomas-title" className="sr-only">
          Biomas
        </h2>
        <div className="mt-6">
          <BiomaGrid mundos={C.mundos} go={(id) => go({ v: "mundo", id })} />
        </div>
      </section>

      {/* ── Todo lo que hay en la bóveda ── */}
      <section className="mx-auto max-w-[1240px] px-4 pb-4" aria-labelledby="vault-title">
        <SectionHead kicker="Todo en un solo lugar" title="Explora la bóveda">
          <p className="max-w-[420px] text-[14px] text-[var(--text-3)]">
            No todo son niveles: aquí tienes práctica suelta para el día a día.
          </p>
        </SectionHead>
        <h2 id="vault-title" className="sr-only">
          Secciones de la bóveda
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {secciones.map((s) => (
            <button
              key={s.v}
              onClick={() => go({ v: s.v } as Ruta)}
              className="card card-hover group flex flex-col p-4 text-left"
              style={{ ["--world" as string]: s.color }}
            >
              <div className="flex items-start gap-3">
                <span
                  className="grid h-12 w-12 shrink-0 place-items-center border-2 border-black"
                  style={{ background: s.fondo }}
                >
                  <PixelIcon name={s.icon} size={30} className="bob" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="label" style={{ color: s.color }}>
                    {s.cuenta}
                  </p>
                  <p className="mt-1 text-[19px] font-bold leading-tight">{s.titulo}</p>
                </div>
                <span className="vault-arrow" aria-hidden>
                  →
                </span>
              </div>
              <p className="mt-2.5 flex-1 text-[15px] leading-relaxed text-[var(--text-2)]">{s.desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* ── La promesa de cada nivel ── */}
      <section className="mx-auto max-w-[1240px] px-4 py-10" aria-labelledby="promesa-title">
        <SectionHead kicker="La promesa" title="Así funciona cada nivel" />
        <h2 id="promesa-title" className="sr-only">
          Cómo funciona cada nivel
        </h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: "torch", t: "1 · Teoría", d: "La idea explicada desde cero, con cada término definido la primera vez." },
            { icon: "grass", t: "2 · Ejemplo", d: "Lo mismo, pero con Minecraft, Fortnite o algo bien de aquí de Panamá." },
            { icon: "pickaxe", t: "3 · Práctica", d: "Simuladores: terminal, firewall, subredes, cifrados reales, phishing…" },
            { icon: "sword", t: "4 · Reto", d: "Una pregunta para comprobar que lo entendiste. ¡Y +XP!" },
          ].map((x) => (
            <div key={x.t} className="card p-4">
              <PixelIcon name={x.icon as PixelIconName} size={30} />
              <h3 className="mt-3">{x.t}</h3>
              <p className="mt-2 text-[16px] text-[var(--text-2)]">{x.d}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <GameBox juego="panama" titulo="«Mami, cambié de número»">
            La estafa más famosa del país se aprende a esquivar en el Mundo Ingeniería Social. Spoiler: no te
            eligen a ti, eligen al que se deja.
          </GameBox>
          <GameBox juego="minecraft" titulo="Tu servidor, tus reglas">
            Whitelist, puertos y permisos explicados como lo que son: las reglas de tu servidor de Minecraft.
          </GameBox>
          <GameBox juego="fortnite" titulo="Por qué hay lag">
            UDP, latencia y traceroute desde Panamá hasta el servidor. Entenderás tus 120 de ping.
          </GameBox>
        </div>
      </section>

      {/* cierre */}
      <section className="mx-auto max-w-[1240px] px-4 pb-10">
        <div className="card flex flex-col items-start justify-between gap-4 p-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <Logo size={46} />
            <div>
              <p className="text-[17px] font-bold">¿Listo para el primer bloque?</p>
              <p className="text-[14px] text-[var(--text-3)]">
                {siguiente
                  ? `Siguiente parada: ${siguiente.m.nombre} · ${siguiente.n.titulo}`
                  : "Ya completaste todo. Ahora van los retos CTF."}
              </p>
            </div>
          </div>
          <button
            className="btn btn-primary shrink-0"
            onClick={() =>
              siguiente
                ? go({ v: "nivel", mundo: siguiente.m.id, nivel: siguiente.n.id })
                : go({ v: "retos" })
            }
          >
            <PixelIcon name={siguiente ? "grass" : "sword"} size={16} />
            {siguiente ? (done ? "Continuar donde iba" : "Empezar desde cero") : "Ir a los retos"}
          </button>
        </div>
      </section>
    </main>
  );
}
