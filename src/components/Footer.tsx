import { PixelIcon } from "./PixelArt";
import { C } from "../lib/content";
import type { Ruta } from "../types";

export function Footer({ go }: { go: (r: Ruta) => void }) {
  return (
    <footer className="mt-16">
      <div className="grass" aria-hidden />
      <div className="bg-[#1e140c]" style={{ backgroundImage: "repeating-conic-gradient(rgba(0,0,0,.28) 0% 25%, transparent 0% 50%)", backgroundSize: "10px 10px" }}>
        <div className="mx-auto grid max-w-[1240px] gap-8 px-4 py-10 md:grid-cols-2 xl:grid-cols-[1.2fr_1fr_1.25fr_.7fr]">
          <div>
            <p className="font-bold tracking-wide text-[var(--text)]">{C.meta.nombre}</p>
            <p className="mt-2 max-w-[320px] text-[var(--text-2)]">{C.meta.subtitulo}. Teoría + ejemplo + práctica + reto en cada nivel, desde cero absoluto.</p>
          </div>
          <div>
            <p className="label mb-3">Mundos</p>
            <ul className="m-0 grid list-none gap-1.5 p-0">
              {C.mundos.map((m) => (
                <li key={m.id}><button onClick={() => go({ v: "mundo", id: m.id })} className="text-left text-[var(--text-2)] hover:text-[var(--accent)]">▸ {m.nombre}</button></li>
              ))}
            </ul>
          </div>
          <div className="card bg-[var(--surface)] p-4">
            <div className="flex items-center gap-2"><PixelIcon name="heart" size={16} /><p className="label !text-[var(--text)]">Hecha por</p></div>
            <p className="mt-2 text-[13px] text-[var(--accent)]" style={{ fontFamily: "var(--font-title)" }}>CREADA POR {C.meta.autor}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <a href={C.meta.github} target="_blank" rel="noopener noreferrer" className="btn btn-xs" aria-label="GitHub de Abdiel Camargo">GitHub ↗</a>
              <a href={C.meta.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-xs" aria-label="LinkedIn de Abdiel Camargo">LinkedIn ↗</a>
            </div>
            <p className="mt-3 text-[15px] leading-relaxed text-[var(--text-2)]">
              Herramienta educativa: practica solo en sistemas propios o autorizados. Comparte el enlace oficial para que más personas practiquen.
            </p>
          </div>
          <nav aria-label="Legal y recursos">
            <p className="label mb-3">Información</p>
            <ul className="m-0 grid list-none gap-2 p-0">
              <li><a href="#/operacion" className="text-[14px] text-[var(--text-2)] underline-offset-4 hover:text-[var(--accent)] hover:underline">Operación Bóveda</a></li>
              <li><a href="#/repaso" className="text-[14px] text-[var(--text-2)] underline-offset-4 hover:text-[var(--accent)] hover:underline">Repaso inteligente</a></li>
              <li><a href="#/terminos" className="text-[14px] text-[var(--text-2)] underline-offset-4 hover:text-[var(--accent)] hover:underline">Términos y condiciones</a></li>
              <li><a href="#/privacidad" className="text-[14px] text-[var(--text-2)] underline-offset-4 hover:text-[var(--accent)] hover:underline">Privacidad</a></li>
              <li><a href="#/propiedad-intelectual" className="text-[14px] text-[var(--text-2)] underline-offset-4 hover:text-[var(--accent)] hover:underline">Propiedad intelectual</a></li>
            </ul>
          </nav>
        </div>
        <div className="border-t-2 border-black/60">
          <p className="label mx-auto max-w-[1240px] px-4 py-3">© 2026 {C.meta.nombre} · {C.meta.autor} · v{C.meta.version}</p>
        </div>
      </div>
    </footer>
  );
}
