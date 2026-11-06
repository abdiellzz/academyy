import { useEffect, useMemo, useRef, useState } from "react";
import { PixelIcon, type PixelIconName } from "./PixelArt";
import { C } from "../lib/content";
import { LABS } from "../views/Labs";
import { pedirBusqueda } from "../lib/busqueda";
import type { Ruta } from "../types";
import { cn } from "../utils/cn";

/* ═══════════════════════════════════════════════════════════════════
   Buscador global (⌘K / Ctrl+K): mundos, niveles, retos, términos y guías
   en un solo sitio. Todo lo que hay en la bóveda, a dos teclas.
   ═══════════════════════════════════════════════════════════════════ */

interface Hit {
  key: string;
  tipo: string;
  titulo: string;
  sub: string;
  icon: PixelIconName;
  ruta: Ruta;
  q?: string;
}

const normal = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

function construir(): Hit[] {
  const out: Hit[] = [];
  for (const m of C.mundos) {
    out.push({
      key: `m-${m.id}`,
      tipo: "Mundo",
      titulo: m.nombre,
      sub: `Bioma ${m.bioma} · ${m.niveles.length} niveles`,
      icon: m.icono,
      ruta: { v: "mundo", id: m.id },
    });
    for (const n of m.niveles) {
      out.push({
        key: `n-${m.id}-${n.id}`,
        tipo: "Nivel",
        titulo: n.titulo,
        sub: `${m.nombre} · nivel ${n.nivel} · ${n.minutos} min`,
        icon: n.icono,
        ruta: { v: "nivel", mundo: m.id, nivel: n.id, lab: true },
      });
    }
  }
  for (const l of LABS) {
    out.push({
      key: `l-${l.id}`,
      tipo: "Laboratorio",
      titulo: l.nombre,
      sub: `${l.area} · ${l.nivel} · ${l.minutos} min`,
      icon: l.icono,
      ruta: { v: "laboratorio" },
    });
  }
  for (const r of C.retos) {
    out.push({
      key: `r-${r.id}`,
      tipo: "Reto CTF",
      titulo: r.titulo,
      sub: `${r.categoria} · ${r.dificultad} · ${r.puntos} pts`,
      icon: "sword",
      ruta: { v: "retos" },
    });
  }
  for (const g of C.glosario) {
    out.push({
      key: `g-${g.termino}`,
      tipo: "Término",
      titulo: g.termino,
      sub: g.definicion,
      icon: "torch",
      ruta: { v: "glosario" },
      q: g.termino,
    });
  }
  for (const t of C.tutoriales) {
    out.push({
      key: `t-${t.id}`,
      tipo: "Guía",
      titulo: t.titulo,
      sub: `${t.descripcion} · ${t.minutos} min`,
      icon: "pickaxe",
      ruta: { v: "tutoriales" },
    });
  }
  for (const s of C.snippets) {
    out.push({
      key: `s-${s.id}`,
      tipo: "Snippet",
      titulo: s.titulo,
      sub: `${s.categoria} · ${s.lenguaje}`,
      icon: "snake",
      ruta: { v: "snippets" },
    });
  }
  return out;
}

let cache: Hit[] | null = null;

export function CommandPalette({ abierto, onCerrar, go }: { abierto: boolean; onCerrar: () => void; go: (r: Ruta) => void }) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const input = useRef<HTMLInputElement | null>(null);
  const todos = useMemo(() => (cache ??= construir()), []);

  useEffect(() => {
    if (!abierto) return;
    setQ("");
    setSel(0);
    const t = window.setTimeout(() => input.current?.focus(), 40);
    return () => window.clearTimeout(t);
  }, [abierto]);

  const hits = useMemo(() => {
    const t = normal(q.trim());
    if (!t) return todos.slice(0, 8);
    return todos.filter((h) => normal(h.titulo + " " + h.sub + " " + h.tipo).includes(t)).slice(0, 12);
  }, [q, todos]);

  if (!abierto) return null;

  function elegir(h: Hit | undefined) {
    if (!h) return;
    if (h.q) pedirBusqueda(h.q);
    go(h.ruta);
    onCerrar();
  }

  return (
    <div className="fixed inset-0 z-[400] flex items-start justify-center bg-black/70 px-4 pt-[12vh]" onClick={onCerrar} role="presentation">
      <div
        className="w-full max-w-[620px] border-2 border-black bg-[var(--surface)] shadow-[6px_6px_0_#000]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Buscar en FactionVault"
      >
        <div className="flex items-center gap-2 border-b-2 border-black bg-[var(--surface-3)] px-3 py-2">
          <PixelIcon name="search" size={16} />
          <span className="label !text-[var(--text)]">Buscar en la bóveda</span>
          <button className="ml-auto label hover:text-[var(--accent)]" onClick={onCerrar}>
            esc
          </button>
        </div>
        <input
          ref={input}
          className="w-full border-0 bg-[var(--bg-sunken)] px-3 py-3 text-[18px] outline-none"
          placeholder="nivel, reto, término, guía…  (ej: RSA, firewall, phishing)"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setSel(0);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setSel((s) => Math.min(s + 1, hits.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setSel((s) => Math.max(s - 1, 0));
            } else if (e.key === "Enter") {
              e.preventDefault();
              elegir(hits[sel]);
            } else if (e.key === "Escape") {
              onCerrar();
            }
          }}
          aria-label="Texto a buscar"
        />
        <div className="max-h-[46vh] overflow-y-auto">
          {hits.length === 0 && (
            <p className="px-4 py-6 text-center text-[15px] text-[var(--text-3)]">
              Nada por aquí. Prueba con «hash», «subredes» o «ransomware».
            </p>
          )}
          {hits.map((h, i) => (
            <button
              key={h.key}
              onMouseEnter={() => setSel(i)}
              onClick={() => elegir(h)}
              className={cn("flex w-full items-center gap-3 border-b border-[var(--border-neutral)] px-3 py-2 text-left", i === sel && "bg-[var(--surface-3)]")}
            >
              <span className="chip !text-[9px] shrink-0">{h.tipo}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[16px] font-bold">{h.titulo}</span>
                <span className="block truncate text-[13px] text-[var(--text-3)]">{h.sub}</span>
              </span>
              <span className="label shrink-0">{i === sel ? "↵" : ""}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 border-t-2 border-black px-3 py-1.5 text-[12px] text-[var(--text-3)]">
          <span>↑↓ moverse</span>
          <span>↵ abrir</span>
          <span className="ml-auto">{todos.length} cosas indexadas</span>
        </div>
      </div>
    </div>
  );
}
