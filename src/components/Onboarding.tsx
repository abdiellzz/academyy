import { useEffect, useRef, useState } from "react";
import { PixelIcon, type PixelIconName } from "./PixelArt";

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
      "FactionVault es un curso interactivo de seguridad informática en pixel art. No hay vídeos de dos horas: hay seis mundos, cada uno con su terreno, y dentro se explica, se practica y se comprueba.",
    puntos: ["6 mundos · 41 niveles", "Todo en español y sin instalar nada", "Se guarda en tu navegador"],
  },
  {
    icono: "pickaxe",
    kicker: "2 de 3 · Cómo se usa",
    titulo: "Elige un mundo y síguelo en orden",
    texto:
      "Cada mundo es un tema: seguridad, redes, sistemas, Python, criptografía e ingeniería social. Empieza por el que te llame y avanza; el buscador (⌘K o Ctrl+K) te lleva a cualquier cosa en dos teclas.",
    puntos: ["Mundos arriba, en el menú", "⌘K abre el buscador", "El progreso y los logros se guardan solos"],
  },
  {
    icono: "torch",
    kicker: "3 de 3 · Qué es un nivel",
    titulo: "Teoría corta, práctica real y un reto",
    texto:
      "Cada nivel tiene tres fases: lees lo justo, lo haces en un laboratorio que funciona de verdad, y respondes un reto que te explica el porqué. Al terminar las tres, el nivel queda marcado.",
    puntos: ["Teoría con el «por qué»", "Laboratorio interactivo", "Reto con explicación"],
  },
];

export function Onboarding() {
  const [abierto, setAbierto] = useState(false);
  const [i, setI] = useState(0);
  const btn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    try {
      if (!localStorage.getItem(CLAVE)) setAbierto(true);
    } catch {
      /* sin almacenamiento, no molestamos */
    }
  }, []);

  useEffect(() => {
    if (!abierto) return;
    btn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") cerrar();
      if (e.key === "ArrowRight") setI((v) => Math.min(PASOS.length - 1, v + 1));
      if (e.key === "ArrowLeft") setI((v) => Math.max(0, v - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
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
      <div className="w-full max-w-[560px] border-4 border-black bg-[var(--surface)] shadow-[8px_8px_0_#000] rise">
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
