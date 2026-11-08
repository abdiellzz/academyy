import { PixelIcon, type PixelIconName } from "./PixelArt";
import { cn } from "../utils/cn";

export interface LearningStep { label: string; icon: PixelIconName }

const STEPS: LearningStep[] = [
  { label: "Observar", icon: "search" },
  { label: "Entender", icon: "torch" },
  { label: "Probar", icon: "pickaxe" },
  { label: "Explicar", icon: "flag" },
];

/** Recordatorio visual del ciclo de aprendizaje basado en evidencia. */
export function LearningFlow({
  className = "",
  title = "Ciclo de aprendizaje",
  steps = STEPS,
}: {
  className?: string;
  title?: string;
  steps?: LearningStep[];
}) {
  return (
    <div className={cn("border-2 border-black bg-black/20 p-2.5", className)} role="group" aria-label={`${title}: ${steps.map((s) => s.label).join(", ")}`}>
      <p className="label mb-2 !text-[var(--text-3)]">{title}</p>
      <ol className="m-0 flex list-none flex-wrap items-center gap-1 p-0">
        {steps.map((step, i) => <li key={step.label} className="flex min-w-0 flex-1 items-center gap-1">
          <span className="flex min-h-9 min-w-0 flex-1 items-center justify-center gap-1.5 border border-white/10 bg-[var(--surface-2)] px-1.5 py-1 text-center">
            <PixelIcon name={step.icon} size={15} />
            <span className="text-[10px] font-bold sm:text-[11px]">{step.label}</span>
          </span>
          {i < steps.length - 1 && <span className="text-[var(--accent)]" aria-hidden="true">›</span>}
        </li>)}
      </ol>
    </div>
  );
}
