import { useCallback, useEffect, useState } from "react";
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";
import { Avisos, Hud } from "./components/ui";
import { mundoById } from "./lib/content";
import { nivelDe, notify, useProgreso, xpDe } from "./lib/store";
import { Home } from "./views/Home";
import { LevelView, NotFound, WorldView } from "./views/World";
import { Glosario, Phishing, Progreso, Retos, Snippets, Tutoriales } from "./views/Sections";
import type { Ruta } from "./types";

/* Rutas por hash: #/  #/mundo/redes  #/mundo/redes/ip-subredes  #/retos … */
function parse(): Ruta {
  const parts = window.location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  const [a, b, c] = parts;
  if (!a) return { v: "inicio" };
  if (a === "mundo" && b && c) return { v: "nivel", mundo: b, nivel: c, lab: parts[3] === "lab" };
  if (a === "mundo" && b) return { v: "mundo", id: b };
  if (["retos", "phishing", "tutoriales", "glosario", "snippets", "progreso"].includes(a)) return { v: a } as Ruta;
  if (mundoById(a)) return { v: "mundo", id: a };
  return { v: "inicio" };
}
function toHash(r: Ruta): string {
  if (r.v === "inicio") return "#/";
  if (r.v === "mundo") return `#/mundo/${r.id}`;
  if (r.v === "nivel") return `#/mundo/${r.mundo}/${r.nivel}${r.lab ? "/lab" : ""}`;
  return `#/${r.v}`;
}

export default function App() {
  const [ruta, setRuta] = useState<Ruta>(parse);
  const [warp, setWarp] = useState<{ color: string; k: number } | null>(null);
  const [p] = useProgreso();
  const { lvl } = nivelDe(xpDe(p));
  const [lastLvl, setLastLvl] = useState(lvl);

  useEffect(() => {
    if (lvl > lastLvl) notify({ titulo: "¡Subiste de nivel!", texto: `Ahora eres nivel ${lvl}`, icono: "xp" });
    setLastLvl(lvl);
  }, [lvl, lastLvl]);

  const go = useCallback((r: Ruta) => {
    // Warp-flash con el color del mundo al entrar a uno
    const destino = r.v === "mundo" ? r.id : r.v === "nivel" ? r.mundo : null;
    const origen = ruta.v === "mundo" ? ruta.id : ruta.v === "nivel" ? ruta.mundo : null;
    if (destino && destino !== origen) {
      const m = mundoById(destino);
      if (m) setWarp({ color: m.color, k: Date.now() });
    }
    window.location.hash = toHash(r);
  }, [ruta]);

  useEffect(() => {
    const on = () => { setRuta(parse()); window.scrollTo({ top: 0 }); };
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);

  useEffect(() => {
    const titles: Record<string, string> = { retos: "Retos CTF", phishing: "Detector de phishing", tutoriales: "Guías", glosario: "Glosario", snippets: "Snippets", progreso: "Tu progreso" };
    let t = "academia pixel de ciberseguridad";
    if (ruta.v === "mundo") t = mundoById(ruta.id)?.nombre ?? t;
    else if (ruta.v === "nivel") t = mundoById(ruta.mundo)?.niveles.find((n) => n.id === ruta.nivel)?.titulo ?? t;
    else if (titles[ruta.v]) t = titles[ruta.v];
    document.title = `FactionVault — ${t}`;
  }, [ruta]);

  return (
    <>
      <div className="space" aria-hidden><div className="nebula" /><div className="stars" /><div className="stars2" /><div className="stars3" /></div>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-[300] focus:bg-[var(--accent)] focus:p-2 focus:text-black">Saltar al contenido</a>
      <Nav ruta={ruta} go={go} />
      {ruta.v === "inicio" && <Home go={go} />}
      {ruta.v === "mundo" && <WorldView id={ruta.id} go={go} />}
      {ruta.v === "nivel" && <LevelView mundo={ruta.mundo} nivel={ruta.nivel} lab={ruta.lab} go={go} />}
      {ruta.v === "retos" && <Retos />}
      {ruta.v === "phishing" && <Phishing />}
      {ruta.v === "tutoriales" && <Tutoriales go={go} />}
      {ruta.v === "glosario" && <Glosario />}
      {ruta.v === "snippets" && <Snippets />}
      {ruta.v === "progreso" && <Progreso go={go} />}
      {!["inicio", "mundo", "nivel", "retos", "phishing", "tutoriales", "glosario", "snippets", "progreso"].includes(ruta.v) && <NotFound go={go} />}
      <Footer go={go} />
      {/* HUD flotante siempre visible al hacer scroll en móvil */}
      <div className="fixed bottom-3 left-3 z-40 border-2 border-black bg-[var(--surface)] p-1.5 shadow-[4px_4px_0_#000] sm:hidden"><Hud compact /></div>
      <Avisos />
      {warp && <div key={warp.k} className="warp" style={{ ["--world" as string]: warp.color }} onAnimationEnd={() => setWarp(null)} aria-hidden />}
    </>
  );
}
