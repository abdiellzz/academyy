/* ═══════════════════════════════════════════════════════════════════
   Sonidos 8-bit opcionales (WebAudio, sin archivos).
   Apagados por defecto: se encienden desde el menú y la elección se
   guarda en este navegador.
   ═══════════════════════════════════════════════════════════════════ */

export type Sfx = "click" | "ok" | "error" | "logro" | "subir";

const CLAVE = "factionvault-sonido";

let activo = (() => {
  try {
    return localStorage.getItem(CLAVE) === "1";
  } catch {
    return false;
  }
})();

let ctx: AudioContext | null = null;
const subs = new Set<(on: boolean) => void>();

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const W = window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext };
  const Ctor = W.AudioContext ?? W.webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) {
    try {
      ctx = new Ctor();
    } catch {
      return null;
    }
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

/** Una nota cuadrada con caída exponencial, al estilo consola de 8 bits. */
function nota(freq: number, inicio: number, dur: number, vol = 0.05, tipo: OscillatorType = "square"): void {
  const ac = audio();
  if (!ac) return;
  const t0 = ac.currentTime + inicio;
  const osc = ac.createOscillator();
  const gan = ac.createGain();
  osc.type = tipo;
  osc.frequency.setValueAtTime(freq, t0);
  gan.gain.setValueAtTime(0.0001, t0);
  gan.gain.exponentialRampToValueAtTime(vol, t0 + 0.008);
  gan.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gan).connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

const MELODIAS: Record<Sfx, () => void> = {
  click: () => nota(660, 0, 0.05, 0.035),
  ok: () => {
    nota(660, 0, 0.07, 0.045);
    nota(880, 0.07, 0.1, 0.045);
  },
  error: () => {
    nota(200, 0, 0.09, 0.05, "sawtooth");
    nota(150, 0.09, 0.14, 0.045, "sawtooth");
  },
  logro: () => {
    [523, 659, 784, 1047].forEach((f, i) => nota(f, i * 0.08, 0.12, 0.045));
  },
  subir: () => {
    [392, 523, 659, 784].forEach((f, i) => nota(f, i * 0.06, 0.18, 0.04, "triangle"));
  },
};

/** Reproduce un efecto. Silencioso si el usuario no lo activó. */
export function sfx(tipo: Sfx): void {
  if (!activo) return;
  try {
    MELODIAS[tipo]();
  } catch {
    /* sin audio disponible */
  }
}

export const sonidoActivo = () => activo;

export function setSonido(on: boolean): void {
  activo = on;
  try {
    localStorage.setItem(CLAVE, on ? "1" : "0");
  } catch {
    /* sin almacenamiento */
  }
  subs.forEach((s) => s(on));
  if (on) sfx("ok");
}

export function alternarSonido(): boolean {
  setSonido(!activo);
  return activo;
}

export function suscribirSonido(fn: (on: boolean) => void): () => void {
  subs.add(fn);
  return () => subs.delete(fn);
}
