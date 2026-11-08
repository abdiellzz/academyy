import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";
import { PixelIcon, type PixelIconName } from "./PixelArt";
import { Hud, Logo } from "./ui";
import { C } from "../lib/content";
import { alternarSonido, sonidoActivo, suscribirSonido } from "../lib/sonido";
import type { Ruta } from "../types";
import { cn } from "../utils/cn";

/* Menú principal: cuatro puertas claras y una lista de mundos.
   Menos ruido, mismos sitios. */

const HERRAMIENTAS: { v: Ruta["v"]; label: string; d: string }[] = [
  { v: "operacion", label: "Operación Bóveda", d: "Investiga un incidente simulado" },
  { v: "repaso", label: "Repaso inteligente", d: "Recuerda preguntas que te costaron" },
  { v: "tutoriales", label: "Guías", d: "Pasos cortos para hacer algo útil" },
  { v: "glosario", label: "Glosario", d: "Significados claros, sin vueltas" },
  { v: "snippets", label: "Snippets", d: "Comandos explicados antes de copiarlos" },
  { v: "proyectos", label: "Proyectos", d: "Misiones finales con informe práctico" },
  { v: "phishing", label: "Detector de phishing", d: "Practica reconocer mensajes trampa" },
  { v: "certificado", label: "Certificado", d: "Consulta tu diploma y tus resultados" },
];

const PRINCIPAL: { v: Ruta["v"]; label: string; icon: PixelIconName }[] = [
  { v: "laboratorio", label: "Laboratorio", icon: "pickaxe" },
  { v: "retos", label: "Retos", icon: "sword" },
  { v: "examen", label: "Examen", icon: "diamond" },
  { v: "progreso", label: "Progreso", icon: "chest" },
];

export function Nav({ ruta, go, onBuscar }: { ruta: Ruta; go: (r: Ruta) => void; onBuscar?: () => void }) {
  const [open, setOpen] = useState(false);
  const [audio, setAudio] = useState(sonidoActivo());
  const [menu, setMenu] = useState<"mundos" | "herr" | null>(null);
  const caja = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setOpen(false);
    setMenu(null);
  }, [ruta]);

  useEffect(() => suscribirSonido(setAudio), []);

  useEffect(() => {
    const fuera = (e: MouseEvent) => {
      if (caja.current && !caja.current.contains(e.target as Node)) setMenu(null);
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setMenu(null); setOpen(false); }
    };
    document.addEventListener("mousedown", fuera);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", fuera);
      document.removeEventListener("keydown", esc);
    };
  }, []);

  const activo = (v: Ruta["v"]) => v === ruta.v;
  const enMundo = ruta.v === "mundo" || ruta.v === "nivel";

  const claseBtn = (on: boolean) =>
    cn(
      "nav-link flex min-h-[36px] items-center gap-1.5 px-2.5 transition-colors",
      on ? "nav-link-active" : "",
    );

  return (
    <header ref={caja} className="sticky top-0 z-50 border-b-2 border-black bg-[#0d0b10]/95 shadow-[0_4px_0_#000]">
      <div className="mx-auto flex h-16 max-w-[1240px] items-center gap-3 px-4">
        <button onClick={() => go({ v: "inicio" })} aria-label="FactionVault, ir al inicio" className="shrink-0">
          <Logo />
        </button>

        <nav aria-label="Navegación principal" className="ml-auto hidden items-center gap-1 min-[1180px]:flex">
          <button className={claseBtn(ruta.v === "inicio")} onClick={() => go({ v: "inicio" })} aria-current={ruta.v === "inicio" ? "page" : undefined}>
            Inicio
          </button>

          <div className="relative">
            <button
              className={claseBtn(enMundo || menu === "mundos")}
              onClick={() => setMenu(menu === "mundos" ? null : "mundos")}
              aria-expanded={menu === "mundos"}
              aria-haspopup="true"
            >
              Mundos <span aria-hidden>▾</span>
            </button>
            {menu === "mundos" && (
              <div className="absolute left-0 top-[calc(100%+6px)] w-[290px] border-2 border-black bg-[var(--surface)] p-1.5 shadow-[5px_5px_0_#000]">
                {C.mundos.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => go({ v: "mundo", id: m.id })}
                    className="flex w-full items-center gap-2.5 border-2 border-transparent px-2 py-1.5 text-left hover:border-black hover:bg-[var(--surface-2)]"
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center border-2 border-black" style={{ background: m.fondo }}>
                      <PixelIcon name={m.icono} size={16} />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[15px] font-bold normal-case">{m.nombre.replace("Mundo ", "")}</span>
                      <span className="label block !text-[9px]" style={{ color: m.color }}>{m.bioma}</span>
                    </span>
                    <span className="label ml-auto shrink-0 !text-[9px]">{m.niveles.length}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {PRINCIPAL.map((it) => (
            <button
              key={it.v}
              className={claseBtn(activo(it.v))}
              onClick={() => go({ v: it.v } as Ruta)}
              aria-current={ruta.v === it.v ? "page" : undefined}
              title={it.label}
            >
              <PixelIcon name={it.icon} size={13} /> {it.label}
            </button>
          ))}

          <div className="relative">
            <button
              className={cn(claseBtn(menu === "herr" || ["operacion", "repaso", "tutoriales", "glosario", "snippets", "proyectos", "phishing", "certificado"].includes(ruta.v)), "nav-more")}
              onClick={() => setMenu(menu === "herr" ? null : "herr")}
              aria-label="Más opciones"
              title="Más opciones"
              aria-expanded={menu === "herr"}
              aria-controls="nav-overflow"
            >
              <Icon name="more-vertical" size={19} />
            </button>
            {menu === "herr" && (
              <div id="nav-overflow" className="nav-overflow absolute right-0 top-[calc(100%+9px)] w-[310px]" role="group" aria-label="Más secciones">
                <p className="label nav-overflow-heading">Para aprender</p>
                {HERRAMIENTAS.slice(0, 4).map((h) => (
                  <button key={h.v} onClick={() => go({ v: h.v } as Ruta)} className="nav-overflow-item">
                    <span><b>{h.label}</b><small>{h.d}</small></span><span className="nav-overflow-arrow" aria-hidden>↗</span>
                  </button>
                ))}
                <p className="label nav-overflow-heading nav-overflow-heading-later">Para ponerlo a prueba</p>
                {HERRAMIENTAS.slice(4).map((h) => (
                  <button key={h.v} onClick={() => go({ v: h.v } as Ruta)} className="nav-overflow-item">
                    <span><b>{h.label}</b><small>{h.d}</small></span><span className="nav-overflow-arrow" aria-hidden>↗</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {onBuscar && (
          <button
            onClick={onBuscar}
            className="ml-auto flex items-center gap-2 border-2 border-black bg-[var(--surface-2)] px-2 py-1.5 text-[var(--text-2)] hover:bg-[var(--surface-3)] hover:text-[var(--text)] min-[1180px]:ml-2 min-[1180px]:px-2.5"
            aria-label="Buscar en FactionVault (Ctrl+K)"
          >
            <PixelIcon name="search" size={13} />
            <span className="label hidden md:inline">Buscar</span>
          </button>
        )}

        <button
          onClick={() => setAudio(alternarSonido())}
          className={cn(
            "grid h-9 w-9 shrink-0 place-items-center border-2 border-black text-[13px]",
            audio ? "bg-[var(--accent)] text-[#1a0f00]" : "bg-[var(--surface-2)] text-[var(--text-3)] hover:text-[var(--text)]",
          )}
          aria-pressed={audio}
          title={audio ? "Sonidos activados" : "Sonidos desactivados"}
          aria-label={audio ? "Desactivar sonidos 8-bit" : "Activar sonidos 8-bit"}
        >
          {audio ? "♪" : "×"}
        </button>

        <div className="min-[1180px]:ml-1">
          <Hud compact />
        </div>

        <button
          className="grid h-10 w-10 place-items-center border-2 border-black bg-[var(--surface-2)] min-[1180px]:hidden"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          aria-controls="menu-movil"
          onClick={() => setOpen((v) => !v)}
        >
          <Icon name={open ? "x" : "more-vertical"} size={19} />
        </button>
      </div>

      {open && (
        <nav id="menu-movil" aria-label="Navegación móvil" className="nav-mobile min-[1180px]:hidden">
          <div className="nav-mobile-inner">
            <p className="label nav-mobile-heading">Sigue aprendiendo</p>
            <div className="nav-mobile-core">
              {PRINCIPAL.map((it) => (
                <button key={it.v} onClick={() => go({ v: it.v } as Ruta)} aria-current={ruta.v === it.v ? "page" : undefined}>
                  <PixelIcon name={it.icon} size={15} />{it.label}
                </button>
              ))}
            </div>
            <p className="label nav-mobile-heading">Explora</p>
            <div className="nav-mobile-links">
              {HERRAMIENTAS.map((it) => (
                <button key={it.v} onClick={() => go({ v: it.v } as Ruta)} aria-current={ruta.v === it.v ? "page" : undefined}>
                  <span>{it.label}</span><span className="nav-mobile-description">{it.d}</span>
                </button>
              ))}
            </div>
            <p className="label nav-mobile-heading">Mundos</p>
            <div className="nav-mobile-worlds">
              {C.mundos.map((m) => (
                <button key={m.id} onClick={() => go({ v: "mundo", id: m.id })} aria-current={(ruta.v === "mundo" && ruta.id === m.id) || (ruta.v === "nivel" && ruta.mundo === m.id) ? "page" : undefined}>
                  <span className="nav-world-dot" style={{ background: m.color }} aria-hidden />
                  <span>{m.nombre.replace("Mundo ", "")}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
