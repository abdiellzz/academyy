import { useEffect, useState } from "react";
import { Icon } from "./Icon";
import { PixelIcon, type PixelIconName } from "./PixelArt";
import { Hud, Logo } from "./ui";
import type { Ruta } from "../types";
import { cn } from "../utils/cn";

const ITEMS: { v: Ruta["v"]; label: string; icon: PixelIconName }[] = [
  { v: "inicio", label: "Inicio", icon: "home" },
  { v: "retos", label: "Retos", icon: "sword" },
  { v: "phishing", label: "Phishing", icon: "flag" },
  { v: "tutoriales", label: "Guías", icon: "torch" },
  { v: "snippets", label: "Snippets", icon: "snake" },
  { v: "glosario", label: "Glosario", icon: "chest" },
  { v: "progreso", label: "Progreso", icon: "diamond" },
];

export function Nav({ ruta, go, onBuscar }: { ruta: Ruta; go: (r: Ruta) => void; onBuscar?: () => void }) {
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [ruta]);
  const isActive = (v: Ruta["v"]) => v === ruta.v || (v === "inicio" && (ruta.v === "mundo" || ruta.v === "nivel"));

  return (
    <header className="sticky top-0 z-50 border-b-2 border-black bg-[#0d0b10]/95 shadow-[0_4px_0_#000]">
      <div className="mx-auto flex h-16 max-w-[1240px] items-center gap-3 px-4">
        <button onClick={() => go({ v: "inicio" })} aria-label="FactionVault, ir al inicio" className="shrink-0"><Logo /></button>
        <nav aria-label="Navegación principal" className="ml-auto hidden items-center gap-0.5 min-[1360px]:flex">
          {ITEMS.map((it) => (
            <button key={it.v} onClick={() => go({ v: it.v } as Ruta)} aria-current={isActive(it.v) ? "page" : undefined}
              className={cn("flex items-center gap-1.5 border-2 px-2 py-1.5 text-[8px] uppercase", isActive(it.v) ? "border-black bg-[var(--accent)] text-[#1a0f00] shadow-[3px_3px_0_#000]" : "border-transparent text-[var(--text-2)] hover:border-black hover:bg-[var(--surface-2)]")}
              style={{ fontFamily: "var(--font-title)" }}>
              <span className="hidden min-[1500px]:inline-flex"><PixelIcon name={it.icon} size={13} /></span>{it.label}
            </button>
          ))}
        </nav>
        {onBuscar && (
          <button
            onClick={onBuscar}
            className="ml-auto flex items-center gap-2 border-2 border-black bg-[var(--surface-2)] px-2 py-1.5 text-[var(--text-2)] hover:bg-[var(--surface-3)] hover:text-[var(--text)] min-[1360px]:hidden"
            aria-label="Buscar en FactionVault (Ctrl+K)"
          >
            <PixelIcon name="search" size={14} />
            <span className="label hidden sm:inline">Buscar</span>
          </button>
        )}
        {onBuscar && (
          <button
            onClick={onBuscar}
            className="hidden items-center gap-2 border-2 border-black bg-[var(--surface-2)] px-2.5 py-1.5 text-[var(--text-2)] hover:bg-[var(--surface-3)] hover:text-[var(--text)] min-[1360px]:flex"
            aria-label="Buscar en FactionVault (Ctrl+K)"
          >
            <PixelIcon name="search" size={13} />
            <span className="label">Buscar</span>
            <span className="label !text-[9px] text-[var(--text-3)]">⌘K</span>
          </button>
        )}
        <div className="ml-auto min-[1360px]:ml-3"><Hud compact /></div>
        <button className="grid h-10 w-10 place-items-center border-2 border-black bg-[var(--surface-2)] min-[1360px]:hidden" aria-label={open ? "Cerrar menú" : "Abrir menú"} aria-expanded={open} aria-controls="menu-movil" onClick={() => setOpen((v) => !v)}>
          <Icon name={open ? "x" : "menu"} size={18} />
        </button>
      </div>
      {open && (
        <nav id="menu-movil" aria-label="Navegación móvil" className="border-t-2 border-black bg-[var(--surface)] p-3 min-[1360px]:hidden">
          <div className="mb-3"><Hud /></div>
          <div className="grid grid-cols-2 gap-1.5">
            {ITEMS.map((it) => (
              <button key={it.v} onClick={() => go({ v: it.v } as Ruta)} aria-current={isActive(it.v) ? "page" : undefined}
                className={cn("flex items-center gap-2 border-2 border-black px-3 py-2.5 text-left font-bold", isActive(it.v) ? "bg-[var(--accent)] text-[#1a0f00]" : "bg-[var(--surface-2)]")}>
                <PixelIcon name={it.icon} size={16} />{it.label}
              </button>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
