import { useMemo, useState } from "react";
import { Icon } from "../Icon";
import { PixelIcon } from "../PixelArt";
import { cn } from "../../utils/cn";

export function WidgetShell({ title, badge, children }: { title: string; badge?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between gap-2 border-b-2 border-black bg-[var(--surface-3)] px-3 py-2">
        <span className="flex items-center gap-2">
          <PixelIcon name="pickaxe" size={14} />
          <span className="label !text-[var(--text)]">{title}</span>
        </span>
        {badge ?? <span className="chip !text-[9px] !text-[var(--emerald)]">interactivo</span>}
      </div>
      <div className="p-3 sm:p-4">{children}</div>
    </div>
  );
}

/* ───────── Flujo paso a paso entre actores (TCP, DNS, traceroute…) ───────── */
interface FlowStep { from: number; to: number; label: string; detail: string }
export function FlowStepper({ title, actors, steps }: { title: string; actors: string[]; steps: FlowStep[] }) {
  const [i, setI] = useState(0);
  const step = steps[i];
  const colW = 100 / actors.length;
  const left = Math.min(step.from, step.to);
  const right = Math.max(step.from, step.to);
  const goingRight = step.to > step.from;
  return (
    <WidgetShell title={title} badge={<span className="chip !text-[9px]">paso {i + 1}/{steps.length}</span>}>
      <div className="overflow-x-auto">
        <div className="min-w-[460px]">
          <div className="flex">
            {actors.map((a, idx) => (
              <div key={a} className="flex flex-col items-center px-1 text-center" style={{ width: `${colW}%` }}>
                <span className={cn("grid h-10 w-10 place-items-center border-2 border-black", idx === step.from || idx === step.to ? "bg-[var(--accent)]" : "bg-[var(--surface-3)]")}>
                  <PixelIcon name={idx === 0 ? "monitor" : idx === actors.length - 1 ? "chest" : "globe"} size={20} />
                </span>
                <span className="mt-1 text-[13px] leading-tight text-[var(--text-2)]">{a}</span>
              </div>
            ))}
          </div>
          <div className="relative mt-3 h-10">
            <div className="absolute top-1/2 h-[2px] w-full -translate-y-1/2 bg-[var(--border-neutral-2)]" />
            <div
              className="absolute top-1/2 flex h-7 -translate-y-1/2 items-center justify-center border-2 border-black bg-[var(--accent)] text-[13px] font-bold text-[#1c0c03]"
              style={{ left: `${left * colW + colW / 2}%`, width: `${(right - left) * colW}%` }}
            >
              {goingRight ? "" : "◀ "}{step.label}{goingRight ? " ▶" : ""}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3 border-2 border-black bg-[var(--bg-sunken)] p-3">
        <p className="label !m-0 !text-[var(--accent-text)]">{actors[step.from]} → {actors[step.to]}</p>
        <p className="!m-0 mt-1 text-[15px] leading-relaxed text-[var(--text)]">{step.detail}</p>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <button onClick={() => setI((v) => Math.max(0, v - 1))} disabled={i === 0} className="btn btn-secondary btn-sm"><Icon name="arrow-left" size={12} /> Atrás</button>
        <div className="flex gap-1">{steps.map((_, k) => <span key={k} className={cn("h-2 w-3 border border-black", k <= i ? "bg-[var(--emerald)]" : "bg-[var(--surface-3)]")} />)}</div>
        {i < steps.length - 1
          ? <button onClick={() => setI((v) => v + 1)} className="btn btn-primary btn-sm">Siguiente <Icon name="arrow-right" size={12} /></button>
          : <button onClick={() => setI(0)} className="btn btn-emerald btn-sm"><Icon name="rotate" size={12} /> Repetir</button>}
      </div>
    </WidgetShell>
  );
}

/* ───────── Pila de capas clicables ───────── */
interface Layer { name: string; desc: string; example: string }
export function LayerStack({ title, layers }: { title: string; layers: Layer[] }) {
  const [sel, setSel] = useState(0);
  const palette = ["#f07a1e", "#ffcc33", "#3ee07a", "#5fd3ff", "#c08cff", "#ff5a5a"];
  return (
    <WidgetShell title={title} badge={<span className="chip !text-[9px]">toca cada capa</span>}>
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="flex flex-col gap-1">
          {layers.map((l, i) => (
            <button key={l.name} onClick={() => setSel(i)}
              className={cn("flex items-center gap-2 border-2 border-black px-3 py-2 text-left text-[15px] font-bold transition-transform", sel === i ? "translate-x-2" : "hover:translate-x-1")}
              style={{ background: sel === i ? palette[i % palette.length] : "var(--surface-2)", color: sel === i ? "#1c0c03" : "var(--text)", boxShadow: "inset 2px 2px 0 rgba(255,255,255,.12), inset -2px -2px 0 rgba(0,0,0,.35)" }}>
              <span className="mono text-[13px] opacity-70">{String(i + 1).padStart(2, "0")}</span> {l.name}
            </button>
          ))}
        </div>
        <div className="border-2 border-black bg-[var(--bg-sunken)] p-3">
          <p className="label !m-0" style={{ color: palette[sel % palette.length] }}>Capa {sel + 1}</p>
          <p className="!m-0 mt-1 text-[18px] font-bold">{layers[sel].name}</p>
          <p className="!m-0 mt-2 text-[15px] leading-relaxed text-[var(--text-2)]">{layers[sel].desc}</p>
          <div className="mt-3 border-2 border-black bg-[var(--surface-2)] p-2">
            <p className="label !m-0">Ejemplo</p>
            <p className="!m-0 mt-1 text-[14px] text-[var(--text)]">{layers[sel].example}</p>
          </div>
        </div>
      </div>
    </WidgetShell>
  );
}

/* ───────── Juego de emparejar ───────── */
export function MatchGame({ title, pairs }: { title: string; pairs: [string, string][] }) {
  const shuffled = useMemo(() => [...pairs].map((p) => p[1]).sort(() => Math.random() - 0.5), [pairs]);
  const [left, setLeft] = useState<string | null>(null);
  const [done, setDone] = useState<string[]>([]);
  const [wrong, setWrong] = useState<string | null>(null);
  const [tries, setTries] = useState(0);
  function pick(right: string) {
    if (!left) return;
    setTries((t) => t + 1);
    const ok = pairs.find((p) => p[0] === left)?.[1] === right;
    if (ok) { setDone((d) => [...d, left]); setLeft(null); }
    else { setWrong(right); setTimeout(() => setWrong(null), 600); }
  }
  const finished = done.length === pairs.length;
  return (
    <WidgetShell title={title} badge={<span className="chip !text-[9px]">{done.length}/{pairs.length} · {tries} intentos</span>}>
      <p className="!m-0 mb-2 text-[14px] text-[var(--text-2)]">1) Elige un elemento de la izquierda. 2) Elige su pareja a la derecha.</p>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1.5">
          {pairs.map(([l]) => (
            <button key={l} disabled={done.includes(l)} onClick={() => setLeft(l)}
              className={cn("mono border-2 border-black px-3 py-2 text-left text-[18px]", done.includes(l) ? "bg-[#1f5c33] text-[#bfffd2]" : left === l ? "bg-[var(--accent)] text-[#1c0c03]" : "bg-[var(--surface-2)] hover:bg-[var(--surface-3)]")}>
              {done.includes(l) ? "✔ " : ""}{l}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-1.5">
          {shuffled.map((r) => {
            const used = pairs.some((p) => p[1] === r && done.includes(p[0]));
            return (
              <button key={r} disabled={used} onClick={() => pick(r)}
                className={cn("border-2 border-black px-3 py-2 text-left text-[14px]", used ? "bg-[#1f5c33] text-[#bfffd2]" : wrong === r ? "blink-red bg-[#5a1414]" : "bg-[var(--surface-2)] hover:bg-[var(--surface-3)]")}>
                {r}
              </button>
            );
          })}
        </div>
      </div>
      {finished && (
        <div className="mt-3 flex items-center gap-2 border-2 border-black bg-[#1f5c33] p-2.5">
          <PixelIcon name="diamond" size={18} />
          <p className="!m-0 text-[15px] text-white">¡Completado en {tries} intentos! {tries === pairs.length ? "Perfecto, sin fallos." : "Repasa los que fallaste."}</p>
        </div>
      )}
    </WidgetShell>
  );
}
