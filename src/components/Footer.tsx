import { PixelIcon } from "./PixelArt";
import { Logo } from "./ui";
import { C } from "../lib/content";
import type { Ruta } from "../types";

export function Footer({ go }: { go: (r: Ruta) => void }) {
  return (
    <footer className="mt-16">
      <div className="grass" aria-hidden />
      <div className="bg-[#1e140c]" style={{ backgroundImage: "repeating-conic-gradient(rgba(0,0,0,.28) 0% 25%, transparent 0% 50%)", backgroundSize: "10px 10px" }}>
        <div className="mx-auto grid max-w-[1240px] gap-8 px-4 py-10 md:grid-cols-[1.3fr_1fr_1.3fr]">
          <div>
            <Logo size={44} />
            <p className="mt-3 max-w-[320px] text-[var(--text-2)]">{C.meta.nombre}, {C.meta.subtitulo}. Teoría + ejemplo + práctica + reto en cada nivel, desde cero absoluto.</p>
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
            <a href={C.meta.github} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-[13px] text-[var(--accent)] underline-offset-4 hover:underline" style={{ fontFamily: "var(--font-title)" }}>
              HECHA POR {C.meta.autor}
            </a>
            <p className="mono mt-1 text-[var(--text-3)]">(github.com/abdiellzz)</p>
            <p className="mt-3 text-[15px] leading-relaxed text-[var(--text-2)]">
              Herramienta educativa: practica solo en sistemas propios o autorizados. Comparte el enlace, no el código 😉
            </p>
          </div>
        </div>
        <div className="border-t-2 border-black/60">
          <p className="label mx-auto max-w-[1240px] px-4 py-3">© 2026 {C.meta.nombre} · {C.meta.autor} · v{C.meta.version}</p>
        </div>
      </div>
    </footer>
  );
}
