import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";
import { PixelIcon, type PixelIconName } from "./PixelArt";
import { Hud, Logo } from "./ui";
import { C } from "../lib/content";
import type { Ruta } from "../types";
import { cn } from "../utils/cn";

/* Menú principal: cuatro puertas claras y una lista de mundos.
   Menos ruido, mismos sitios. */

const HERRAMIENTAS: { v: Ruta["v"]; label: string; icon: PixelIconName; d: string }[] = [
  { v: "tutoriales", label: "Guías", icon: "torch", d: "Paso a paso para tareas concretas" },
  { v: "glosario", label: "Glosario", icon: "chest", d: "Cada término, en cristiano" },
  { v: "snippets", label: "Snippets", icon: "snake", d: "Código listo para copiar" },
  { v: "phishing", label: "Phishing", icon: "flag", d: "Entrena el ojo con mensajes reales" },
];

const PRINCIPAL: { v: Ruta["v"]; label: string; icon: PixelIconName }[] = [
  { v: "laboratorio", label: "Laboratorio", icon: "pickaxe" },
  { v: "retos", label: "Retos", icon: "sword" },
  { v: "progreso", label: "Progreso", icon: "diamond" },
];

export function Nav({ ruta, go, onBuscar }: { ruta: Ruta; go: (r: Ruta) => void; onBuscar?: () => void }) {
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<"mundos" | "herr" | null>(null);
  const caja = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setOpen(false);
    setMenu(null);
  }, [ruta]);

  useEffect(() => {
    const fuera = (e: MouseEvent) => {
      if (caja.current && !caja.current.contains(e.target as Node)) setMenu(null);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setMenu(null);
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
      "flex items-center gap-1.5 border-2 px-2.5 py-1.5 text-[8px] uppercase tracking-wide",
      on
        ? "border-black bg-[var(--accent)] text-[#1a0f00] shadow-[3px_3px_0_#000]"
        : "border-transparent text-[var(--text-2)] hover:border-black hover:bg-[var(--surface-2)] hover:text-[var(--text)]",
    );

  return (
    <header ref={caja} className="sticky top-0 z-50 border-b-2 border-black bg-[#0d0b10]/95 shadow-[0_4px_0_#000]">
      <div className="mx-auto flex h-16 max-w-[1240px] items-center gap-3 px-4">
        <button onClick={() => go({ v: "inicio" })} aria-label="FactionVault, ir al inicio" className="shrink-0">
          <Logo />
        </button>

        <nav aria-label="Navegación principal" className="ml-auto hidden items-center gap-0.5 min-[1180px]:flex" style={{ fontFamily: "var(--font-title)" }}>
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
            <button key={it.v} className={claseBtn(activo(it.v))} onClick={() => go({ v: it.v } as Ruta)} aria-current={ruta.v === it.v ? "page" : undefined}>
              <PixelIcon name={it.icon} size={12} /> {it.label}
            </button>
          ))}

          <div className="relative">
            <button
              className={claseBtn(!!activo("tutoriales") || menu === "herr")}
              onClick={() => setMenu(menu === "herr" ? null : "herr")}
              aria-expanded={menu === "herr"}
              aria-haspopup="true"
            >
              Más <span aria-hidden>▾</span>
            </button>
            {menu === "herr" && (
              <div className="absolute right-0 top-[calc(100%+6px)] w-[300px] border-2 border-black bg-[var(--surface)] p-1.5 shadow-[5px_5px_0_#000]">
                {HERRAMIENTAS.map((h) => (
                  <button
                    key={h.v}
                    onClick={() => go({ v: h.v } as Ruta)}
                    className="flex w-full items-start gap-2.5 border-2 border-transparent px-2 py-1.5 text-left hover:border-black hover:bg-[var(--surface-2)]"
                  >
                    <PixelIcon name={h.icon} size={16} className="mt-0.5 shrink-0" />
                    <span>
                      <span className="block text-[15px] font-bold normal-case">{h.label}</span>
                      <span className="block text-[12px] normal-case text-[var(--text-3)]">{h.d}</span>
                    </span>
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
          <Icon name={open ? "x" : "menu"} size={18} />
        </button>
      </div>

      {open && (
        <nav id="menu-movil" aria-label="Navegación móvil" className="border-t-2 border-black bg-[var(--surface)] p-3 min-[1180px]:hidden">
          <div className="mb-3">
            <Hud />
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <button onClick={() => go({ v: "inicio" })} className={cn("flex items-center gap-2 border-2 border-black px-3 py-2.5 text-left font-bold", ruta.v === "inicio" ? "bg-[var(--accent)] text-[#1a0f00]" : "bg-[var(--surface-2)]")}>
              <PixelIcon name="home" size={16} /> Inicio
            </button>
            {[{ v: "laboratorio", label: "Laboratorio", icon: "pickaxe" as PixelIconName }, { v: "retos", label: "Retos", icon: "sword" as PixelIconName }, { v: "progreso", label: "Progreso", icon: "diamond" as PixelIconName }, ...HERRAMIENTAS].map((it) => (
              <button
                key={it.v}
                onClick={() => go({ v: it.v } as Ruta)}
                className={cn("flex items-center gap-2 border-2 border-black px-3 py-2.5 text-left font-bold", ruta.v === it.v ? "bg-[var(--accent)] text-[#1a0f00]" : "bg-[var(--surface-2)]")}
              >
                <PixelIcon name={it.icon} size={16} /> {it.label}
              </button>
            ))}
          </div>
          <p className="label mt-3 mb-1">Mundos</p>
          <div className="grid gap-1.5">
            {C.mundos.map((m) => (
              <button key={m.id} onClick={() => go({ v: "mundo", id: m.id })} className="flex items-center gap-2 border-2 border-black bg-[var(--surface-2)] px-3 py-2 text-left">
                <PixelIcon name={m.icono} size={16} />
                <span className="font-bold">{m.nombre}</span>
                <span className="label ml-auto">{m.bioma}</span>
              </button>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
