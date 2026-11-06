import { useCallback, useState, type ReactNode } from "react";
import { LOGO_SRC } from "../assets/logo";
import { PixelIcon, type PixelIconName } from "./PixelArt";
import { nivelDe, useAvisos, useProgreso, xpDe, type Aviso } from "../lib/store";
import type { TeoriaBloque } from "../types";
import { cn } from "../utils/cn";

/** Logo oficial: el mono con el cofre y el wordmark FACTION VAULT. */
export function Logo({ size = 34, className }: { size?: number; className?: string }) {
  return (
    <img
      src={LOGO_SRC}
      alt="FactionVault"
      draggable={false}
      className={cn("logo-img select-none", className)}
      style={{ height: size, width: "auto" }}
    />
  );
}

const JUEGOS: Record<string, { label: string; icon: PixelIconName; bg: string; color: string }> = {
  minecraft: { label: "Así pasa en Minecraft", icon: "grass", bg: "#12230f", color: "#7cff3a" },
  fortnite: { label: "Así pasa en Fortnite", icon: "storm", bg: "#1c1238", color: "#c9a2ff" },
  panama: { label: "Así pasa en Panamá", icon: "diablo", bg: "#2a1016", color: "#ff8a7a" },
};

export function GameBox({ juego, titulo, children }: { juego: string; titulo: string; children: ReactNode }) {
  const g = JUEGOS[juego] ?? JUEGOS.panama;
  return (
    <div className="card p-4" style={{ background: g.bg }}>
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center border-2 border-black bg-black/40"><PixelIcon name={g.icon} size={26} /></span>
        <div>
          <p className="label" style={{ color: g.color }}>{g.label}</p>
          <p className="mt-0.5 text-[18px] font-bold">{titulo}</p>
        </div>
      </div>
      <p className="mt-2.5 leading-relaxed text-[var(--text)]">{children}</p>
    </div>
  );
}

function Caja({ icon, label, color, bg, children }: { icon: PixelIconName; label: string; color: string; bg: string; children: ReactNode }) {
  return (
    <div className="card p-3.5" style={{ background: bg }}>
      <div className="flex items-center gap-2"><PixelIcon name={icon} size={16} /><span className="label" style={{ color }}>{label}</span></div>
      <div className="mt-1.5 leading-relaxed">{children}</div>
    </div>
  );
}

export function Term({ title = "terminal", children }: { title?: string; children: ReactNode }) {
  return (
    <div className="term" data-allow-copy>
      <div className="term-bar"><i style={{ background: "var(--red)" }} /><i style={{ background: "var(--accent)" }} /><i style={{ background: "var(--green)" }} /><span className="label ml-2">{title}</span></div>
      <div className="term-body">{children}</div>
    </div>
  );
}

/** Renderiza un bloque de teoría del content.js. */
export function Bloque({ b }: { b: TeoriaBloque }) {
  switch (b.t) {
    case "p": return <p className="text-[18px] leading-[1.7] text-[var(--text-2)]">{b.text}</p>;
    case "h": return <h3 className="!mt-6 flex items-center gap-2 text-[var(--text)]"><span className="h-3 w-3 shrink-0 border-2 border-black bg-[var(--world)]" />{b.text}</h3>;
    case "list": return (
      <ul className="m-0 list-none space-y-2 p-0">
        {b.items.map((it) => <li key={it} className="flex gap-2.5 text-[17px] leading-relaxed text-[var(--text-2)]"><PixelIcon name="xp" size={12} className="mt-1.5 shrink-0" />{it}</li>)}
      </ul>
    );
    case "why": return <Caja icon="torch" label="¿Por qué aprender esto?" color="var(--green)" bg="#0f2418">{b.text}</Caja>;
    case "porque": return <Caja icon="shield" label="¿Por qué funciona así?" color="var(--violet)" bg="#1b1233">{b.text}</Caja>;
    case "tip": return <Caja icon="key" label="Tip pro" color="var(--accent)" bg="#2a1d0c">{b.text}</Caja>;
    case "warn": return <Caja icon="heart" label="Cuidado" color="var(--red)" bg="#2a0e14">{b.text}</Caja>;
    case "result": return <Caja icon="diamond" label="Resultado esperado" color="var(--cyan)" bg="#0c1f2c">{b.text}</Caja>;
    case "steps": return (
      <div className="card p-2">
        <p className="label px-2 pt-1.5 !text-[var(--accent)]">Paso a paso</p>
        {b.items.map((s, i) => (
          <div key={s.t} className={cn("flex gap-3 p-2.5", i < b.items.length - 1 && "border-b-2 border-dashed border-[var(--border-neutral)]")}>
            <span className="step-dot now">{i + 1}</span>
            <div><p className="font-bold">{s.t}</p><p className="text-[16px] text-[var(--text-2)]">{s.d}</p></div>
          </div>
        ))}
      </div>
    );
    case "table": return (
      <div className="card overflow-x-auto !p-0">
        <table className="vault-table min-w-[460px]">
          <thead><tr>{b.head.map((h) => <th key={h} scope="col">{h}</th>)}</tr></thead>
          <tbody>{b.rows.map((r, i) => <tr key={i}>{r.map((c, k) => <td key={k} className={k === 0 ? "font-bold text-[var(--text)]" : ""}>{c}</td>)}</tr>)}</tbody>
        </table>
      </div>
    );
    case "term": return <Term title={b.title}>{b.text}</Term>;
  }
}

/** HUD de nivel y XP, siempre visible. */
export function Hud({ compact = false }: { compact?: boolean }) {
  const [p] = useProgreso();
  const xp = xpDe(p);
  const { lvl, pct, falta } = nivelDe(xp);
  return (
    <div className="flex items-center gap-2" role="status" aria-label={`Nivel ${lvl}, ${xp} XP, faltan ${falta} para el siguiente nivel`}>
      <span className="grid h-8 min-w-8 place-items-center border-2 border-black bg-[var(--green)] px-1 text-[10px] text-[#04220f]" style={{ fontFamily: "var(--font-title)" }}>{lvl}</span>
      <div className={compact ? "w-[72px]" : "w-[110px]"}>
        <div className="xp-bar"><span style={{ width: `${Math.max(3, pct)}%` }} /></div>
        {!compact && <p className="label mt-1 !text-[9px]">{xp} XP · faltan {falta}</p>}
      </div>
    </div>
  );
}

/** Pila de avisos tipo «¡Logro desbloqueado!». */
export function Avisos() {
  const [list, setList] = useState<Aviso[]>([]);
  const add = useCallback((a: Aviso) => {
    setList((l) => [...l.slice(-2), a]);
    setTimeout(() => setList((l) => l.filter((x) => x.id !== a.id)), 3600);
  }, []);
  useAvisos(add);
  return (
    <div className="fixed right-3 top-20 z-[150] flex w-[300px] max-w-[calc(100vw-24px)] flex-col gap-2" aria-live="polite">
      {list.map((a) => (
        <div key={a.id} className="toast card flex items-center gap-3 bg-[#1a1a1a] px-3 py-2.5">
          <span className="grid h-10 w-10 shrink-0 place-items-center border-2 border-black bg-[#333]"><PixelIcon name={a.icono as PixelIconName} size={24} /></span>
          <div className="min-w-0">
            <p className="label !text-[var(--accent)]">{a.titulo}</p>
            <p className="truncate text-white">{a.texto}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function SectionHead({ kicker, title, children }: { kicker: string; title: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
      <div>
        <p className="label !text-[var(--accent)]">▶ {kicker}</p>
        <h2 className="mt-2">{title}</h2>
      </div>
      {children}
    </div>
  );
}

export function Bar({ value, color = "var(--accent)" }: { value: number; color?: string }) {
  return <div className="xp-bar"><span style={{ width: `${Math.max(0, Math.min(100, value))}%`, background: color }} /></div>;
}

export function CopyBtn({ value }: { value: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button className="btn btn-xs" aria-label="Copiar al portapapeles" onClick={async () => { try { await navigator.clipboard.writeText(value); setOk(true); setTimeout(() => setOk(false), 1400); } catch { /* sin permiso */ } }}>
      {ok ? "¡Copiado!" : "Copiar"}
    </button>
  );
}
