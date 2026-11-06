import { PixelIcon, type PixelIconName } from "./PixelArt";
import type { Mundo } from "../types";

/* ═══════════════════════════════════════════════════════════════════
   Bioma de cada mundo: paisaje de siluetas escalonadas (pixel art puro,
   sin una sola curva) generado con una semilla fija por mundo.
   ═══════════════════════════════════════════════════════════════════ */

interface Paleta {
  cielo: string;
  lejos: string;
  medio: string;
  cerca: string;
  acento: string;
  icono: PixelIconName;
  astro: string;
}

const PALETAS: Record<string, Paleta> = {
  seguridad: { cielo: "#07160f", lejos: "#16402a", medio: "#0f2c1d", cerca: "#0a1c12", acento: "#3ee07a", icono: "shield", astro: "#d8ffe6" },
  redes: { cielo: "#06151f", lejos: "#164058", medio: "#0e2c3f", cerca: "#081b27", acento: "#5fd3ff", icono: "globe", astro: "#e8fbff" },
  sistemas: { cielo: "#0a0f0a", lejos: "#22421f", medio: "#172c16", cerca: "#0b170b", acento: "#3ee07a", icono: "torch", astro: "#c9ff9a" },
  python: { cielo: "#151004", lejos: "#463a12", medio: "#2e270d", cerca: "#181307", acento: "#ffd43b", icono: "grass", astro: "#fff3b0" },
  cripto: { cielo: "#1a0800", lejos: "#632e09", medio: "#401e07", cerca: "#220e03", acento: "#ffb02e", icono: "storm", astro: "#ffd9a0" },
  social: { cielo: "#1a060c", lejos: "#53151f", medio: "#360e17", cerca: "#1e070c", acento: "#ff5a6a", icono: "home", astro: "#ffd0d6" },
  web: { cielo: "#0a0920", lejos: "#2f2a6b", medio: "#1d1845", cerca: "#0c0a26", acento: "#b98bff", icono: "monitor", astro: "#e8dcff" },
};

const FALLBACK: Paleta = PALETAS.cripto;

function semilla(id: string): number {
  let h = 7;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 100000;
  return h;
}

function azar(seed: number) {
  let s = seed || 1;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

/** Silueta escalonada: devuelve un clip-path polygon con escalones duros. */
function escalones(seed: number, pasos: number, arriba: number, abajo: number): string {
  const r = azar(seed);
  const ancho = 100 / pasos;
  const alturas: number[] = [];
  let h = (arriba + abajo) / 2;
  for (let i = 0; i < pasos; i++) {
    h += (r() - 0.5) * (abajo - arriba) * 0.9;
    h = Math.max(arriba, Math.min(abajo, h));
    alturas.push(Math.round(h / 2) * 2);
  }
  const pts: string[] = ["0% 100%", "0% " + alturas[0] + "%"];
  for (let i = 0; i < pasos; i++) {
    const x = Math.round((i + 1) * ancho * 100) / 100;
    pts.push(x + "% " + alturas[i] + "%");
    if (i + 1 < pasos) pts.push(x + "% " + alturas[i + 1] + "%");
  }
  pts.push("100% 100%");
  return `polygon(${pts.join(", ")})`;
}

export function BiomeScene({ mundo, alto = 120 }: { mundo: Mundo; alto?: number }) {
  const p = PALETAS[mundo.id] ?? FALLBACK;
  const s = semilla(mundo.id);
  return (
    <div className="biome" style={{ height: alto, background: p.cielo }} aria-hidden>
      <span
        className="biome-astro"
        style={{ background: p.astro, width: Math.max(14, alto * 0.17), height: Math.max(14, alto * 0.17) }}
      />
      <span className="biome-dither" />
      <span className="biome-capa" style={{ background: p.lejos, clipPath: escalones(s + 3, 9, 18, 46) }} />
      <span className="biome-capa" style={{ background: p.medio, clipPath: escalones(s + 17, 7, 38, 64) }} />
      <span className="biome-capa" style={{ background: p.cerca, clipPath: escalones(s + 41, 5, 56, 80) }} />
      <span className="biome-horizonte" style={{ background: p.acento }} />
    </div>
  );
}

/** Bioma del mundo + su explicación, para la cabecera de cada mundo. */
export function BiomeBanner({ mundo }: { mundo: Mundo }) {
  const p = PALETAS[mundo.id] ?? FALLBACK;
  const desc = (mundo as Mundo & { biomaDesc?: string }).biomaDesc;
  return (
    <div className="mt-5 overflow-hidden border-2 border-black bg-[var(--bg-sunken)]" style={{ boxShadow: "var(--hard-sm)" }}>
      <BiomeScene mundo={mundo} alto={104} />
      <div className="flex items-start gap-3 border-t-2 border-black p-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center border-2 border-black" style={{ background: p.medio }}>
          <PixelIcon name={p.icono} size={22} />
        </span>
        <div>
          <p className="label" style={{ color: p.acento }}>
            Bioma · {mundo.bioma}
          </p>
          <p className="mt-1 text-[15px] leading-relaxed text-[var(--text-2)]">
            {desc ?? `El terreno de ${mundo.nombre}: puro pixel art, con sus propias reglas.`}
          </p>
        </div>
      </div>
    </div>
  );
}

/** Rejilla de los biomas (uno por mundo) para el inicio. */
export function BiomaGrid({ mundos, go }: { mundos: Mundo[]; go: (id: string) => void }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {mundos.map((m) => {
        const p = PALETAS[m.id] ?? FALLBACK;
        const desc = (m as Mundo & { biomaDesc?: string }).biomaDesc ?? "";
        return (
          <button
            key={m.id}
            onClick={() => go(m.id)}
            className="card card-hover overflow-hidden p-0 text-left"
            style={{ ["--world" as string]: m.color }}
          >
            <BiomeScene mundo={m} alto={86} />
            <div className="p-3">
              <p className="label" style={{ color: p.acento }}>
                {m.bioma}
              </p>
              <p className="mt-0.5 text-[17px] font-bold leading-tight">{m.nombre}</p>
              <p className="mt-1 line-clamp-2 text-[14px] leading-snug text-[var(--text-2)]">{desc}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
