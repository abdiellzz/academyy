import { useEffect, useRef, useState } from "react";
import { PixelIcon, type PixelIconName } from "./PixelArt";
import { C, totalNiveles } from "../lib/content";

/* ═══════════════════════════════════════════════════════════════════
   ONBOARDING · 30 segundos, tres pantallas, la primera vez.
   Explica qué es esto, cómo se usa y qué es un nivel.
   ═══════════════════════════════════════════════════════════════════ */

const CLAVE = "factionvault-onboarding-v1";

const PASOS: { icono: PixelIconName; kicker: string; titulo: string; texto: string; puntos: string[] }[] = [
  {
    icono: "globe",
    kicker: "1 de 3 · Qué es esto",
    titulo: "Una bóveda para aprender seguridad de verdad",
    texto:
      `FactionVault es un curso interactivo de seguridad informática en pixel art. No hay vídeos de dos horas: hay ${C.mundos.length} mundos, cada uno con su terreno, y dentro se explica, se practica y se comprueba.`,
    puntos: [`${C.mundos.length} mundos · ${totalNiveles} niveles · 3 rutas sugeridas`, "Prácticas seguras con datos ficticios", "El progreso queda en este navegador"],
  },
  {
    icono: "pickaxe",
    kicker: "2 de 3 · Cómo se usa",
    titulo: "Empieza por tu objetivo, no por un menú",
    texto:
      "Puedes comenzar desde cero, proteger tus cuentas o probar análisis técnico. Las rutas sugieren niveles y un proyecto final, pero no te bloquean: cambia de mundo cuando quieras. El buscador (⌘K o Ctrl+K) también te lleva directo a cualquier tema.",
    puntos: ["La portada recomienda una primera misión", "⌘K abre el buscador", "El progreso y tus proyectos se guardan en este navegador"],
  },
  {
    icono: "torch",
    kicker: "3 de 3 · Qué es un nivel",
    titulo: "Teoría corta, práctica real y un reto",
    texto:
      "Cada nivel combina explicación, práctica y reto. Los simuladores usan escenarios seguros; los ejercicios de Python corren en un intérprete didáctico limitado, no en un Python completo. Al terminar las fases, el nivel queda marcado.",
    puntos: ["Objetivos visibles", "Práctica segura y repetible", "Reto con pistas y explicación"],
  },
];

export function Onboarding() {
  const [abierto, setAbierto] = useState(false);
  const [i, setI] = useState(0);
  const btn = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  useEffect(() => {
    try {
      if (!localStorage.getItem(CLAVE)) setAbierto(true);
    } catch {
      /* sin almacenamiento, no molestamos */
    }
  }, []);

  useEffect(() => {
    if (!abierto) return;
    opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    btn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") cerrar();
      if (e.key === "ArrowRight") setI((v) => Math.min(PASOS.length - 1, v + 1));
      if (e.key === "ArrowLeft") setI((v) => Math.max(0, v - 1));
      if (e.key === "Tab") {
        const items = Array.from(dialog.current?.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])') ?? []);
        if (!items.length) { e.preventDefault(); return; }
        const first = items[0], last = items[items.length - 1];
        if (e.shiftKey && (document.activeElement === first || !dialog.current?.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && (document.activeElement === last || !dialog.current?.contains(document.activeElement))) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      opener.current?.focus();
      opener.current = null;
    };
  }, [abierto]);

  function cerrar() {
    try {
      localStorage.setItem(CLAVE, "1");
    } catch {
      /* nada */
    }
    setAbierto(false);
  }

  if (!abierto) return null;
  const p = PASOS[i];
  const ultimo = i === PASOS.length - 1;

  return (
    <div className="fixed inset-0 z-[120] grid place-items-center bg-black/80 p-3" role="dialog" aria-modal="true" aria-labelledby="onb-title">
      <div ref={dialog} className="w-full max-w-[560px] border-4 border-black bg-[var(--surface)] shadow-[8px_8px_0_#000] rise">
        <div className="flex items-center justify-between border-b-2 border-black bg-[var(--bg-soft)] px-4 py-2.5">
          <div className="flex items-center gap-2">
            <PixelIcon name="chest" size={16} />
            <p className="label !text-[var(--accent)]">Bienvenido a la bóveda</p>
          </div>
          <button className="btn btn-xs" onClick={cerrar} aria-label="Saltar la introducción">
            saltar ✕
          </button>
        </div>

        <div className="p-5">
          <p className="label">{p.kicker}</p>
          <div className="mt-3 flex items-start gap-3">
            <span className="grid h-14 w-14 shrink-0 place-items-center border-2 border-black bg-[var(--surface-3)]">
              <PixelIcon name={p.icono} size={30} className="bob" />
            </span>
            <div>
              <h2 id="onb-title" className="!text-[16px] leading-snug">
                {p.titulo}
              </h2>
              <p className="mt-2 text-[15px] leading-relaxed text-[var(--text-2)]">{p.texto}</p>
            </div>
          </div>

          <ul className="mt-4 space-y-1.5">
            {p.puntos.map((x) => (
              <li key={x} className="flex items-start gap-2 text-[14px] text-[var(--text-2)]">
                <span className="mt-0.5 text-[var(--green)]">✔</span>
                {x}
              </li>
            ))}
          </ul>

          <div className="mt-5 flex items-center justify-between gap-3">
            <div className="flex gap-1.5" aria-hidden>
              {PASOS.map((_, k) => (
                <span
                  key={k}
                  className="h-2.5 w-2.5 border border-black"
                  style={{ background: k === i ? "var(--accent)" : "var(--surface-3)" }}
                />
              ))}
            </div>
            <div className="flex gap-2">
              {i > 0 && (
                <button className="btn btn-sm" onClick={() => setI((v) => v - 1)}>
                  ◀ Atrás
                </button>
              )}
              <button
                ref={btn}
                className="btn btn-primary"
                onClick={() => (ultimo ? cerrar() : setI((v) => v + 1))}
              >
                {ultimo ? "Entrar a la bóveda ▶" : "Siguiente ▶"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
