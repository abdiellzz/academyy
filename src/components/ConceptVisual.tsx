import { PixelIcon } from "./PixelArt";
import type { ConceptNode, ConceptVisual as ConceptDiagram } from "../lib/conceptos";
import { cn } from "../utils/cn";

function NodeCard({ node, index, compact = false }: { node: ConceptNode; index?: number; compact?: boolean }) {
  return (
    <div className={cn("concept-node flex w-full min-w-0 flex-1 items-center gap-3 border-2 border-black bg-[var(--surface-2)] p-3", compact && "p-2.5")}>
      <span className="grid h-11 w-11 shrink-0 place-items-center border-2 border-black bg-black/30 text-[var(--world)]">
        <PixelIcon name={node.icon} size={26} />
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-1.5">
          {index !== undefined && <span className="mono text-[10px] text-[var(--world)]">{String(index + 1).padStart(2, "0")}</span>}
          <span className="block text-[14px] font-bold leading-tight">{node.label}</span>
        </span>
        <span className="mt-1 block text-[12px] leading-snug text-[var(--text-2)]">{node.detail}</span>
      </span>
    </div>
  );
}

function Arrow() {
  return <span aria-hidden="true" className="concept-arrow grid shrink-0 place-items-center text-[var(--world)] rotate-90 md:rotate-0">
    <svg viewBox="0 0 32 20" width="28" height="18" fill="none"><path d="M2 10h23M18 3l8 7-8 7" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter" /></svg>
  </span>;
}

export function ConceptVisual({ diagram, lessonId }: { diagram: ConceptDiagram; lessonId: string }) {
  const titleId = `concept-title-${lessonId}`;
  return (
    <figure className="concept-visual card overflow-hidden p-0" aria-labelledby={titleId}>
      <div className="flex flex-wrap items-start justify-between gap-2 border-b-2 border-black bg-black/20 px-4 py-3">
        <div>
          <p className="label !text-[var(--world)]">Mapa visual · idea clave</p>
          <h3 id={titleId} className="mt-1 text-[16px]">{diagram.title}</h3>
        </div>
        <span className="chip text-[10px]">{diagram.kind === "flow" ? "PROCESO" : diagram.kind === "layers" ? "CAPAS" : "COMPARA"}</span>
      </div>
      <div className="p-3 sm:p-4">
        {diagram.kind === "flow" && <ol aria-label={diagram.title} className="m-0 flex list-none flex-col items-stretch gap-2 p-0 md:flex-row md:items-center md:gap-1">
          {diagram.nodes.map((node, i) => <li key={node.label} className="flex min-w-0 flex-col items-center gap-1 md:flex-1 md:flex-row">
            <NodeCard node={node} index={i} />
            {i < diagram.nodes.length - 1 && <Arrow />}
          </li>)}
        </ol>}
        {diagram.kind === "layers" && <ol aria-label={diagram.title} className="mx-auto m-0 grid max-w-[700px] list-none gap-1 p-0">
          {diagram.layers.map((layer, i) => <li key={layer.label} className="flex items-center gap-2">
            <span aria-hidden="true" className="grid h-7 w-7 shrink-0 place-items-center border-2 border-black text-[10px]" style={{ background: `color-mix(in srgb, var(--world) ${82 - i * 12}%, #101018)` }}>{i + 1}</span>
            <NodeCard node={layer} index={undefined} compact />
          </li>)}
        </ol>}
        {diagram.kind === "compare" && <div className="grid items-stretch gap-2 sm:grid-cols-[1fr_auto_1fr]">
          <NodeCard node={diagram.left} compact />
          <span className="grid place-items-center px-2 text-[11px] font-bold text-[var(--text-3)]">VS</span>
          <NodeCard node={diagram.right} compact />
        </div>}
      </div>
      <figcaption className="flex items-start gap-2 border-t-2 border-black bg-[var(--bg-sunken)] px-4 py-3 text-[13px] leading-relaxed text-[var(--text-2)]">
        <PixelIcon name="torch" size={15} className="mt-0.5 shrink-0" />
        <span><b className="text-[var(--text)]">Qué debes recordar:</b> {diagram.takeaway}</span>
      </figcaption>
    </figure>
  );
}
