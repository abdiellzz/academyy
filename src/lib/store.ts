import { useCallback, useEffect, useState } from "react";
import { C, totalNiveles } from "./content";
import { sfx } from "./sonido";

export interface ExamenResultado {
  nota: number;      // 0-100
  aciertos: number;
  total: number;
  fecha: string;     // ISO
  segundos: number;
}

export interface Progreso {
  niveles: Record<string, { teoria?: boolean; practica?: boolean; reto?: boolean }>;
  retos: string[];
  tutoriales: string[];
  phishingBest: number;
  phishingPlayed: number;
  logros: string[];
  labs: string[];
  examenMejor: number;
  examenes: number;
  ultimoExamen: ExamenResultado | null;
  estudiante: string;
}

const KEY = "factionvault-v4";
const EMPTY: Progreso = { niveles: {}, retos: [], tutoriales: [], phishingBest: 0, phishingPlayed: 0, logros: [], labs: [], examenMejor: 0, examenes: 0, ultimoExamen: null, estudiante: "" };

function load(): Progreso {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
  } catch {
    return EMPTY;
  }
}

/* XP: teoría 20 · práctica 40 · reto 60 (= 120 por nivel) · retos CTF = sus puntos · tutorial 50 · phishing 10 por acierto récord */
export function xpDe(p: Progreso): number {
  let xp = 0;
  for (const n of Object.values(p.niveles)) xp += (n.teoria ? 20 : 0) + (n.practica ? 40 : 0) + (n.reto ? 60 : 0);
  xp += C.retos.filter((r) => p.retos.includes(r.id)).reduce((a, r) => a + r.puntos, 0);
  xp += p.tutoriales.length * 50 + p.phishingBest * 10;
  xp += p.labs.length * 30 + Math.round(p.examenMejor * 2);
  return xp;
}

/** Curva tipo juego: nivel n requiere 80·n² XP. */
export function nivelDe(xp: number) {
  const lvl = Math.floor(Math.sqrt(xp / 80));
  const cur = 80 * lvl * lvl;
  const next = 80 * (lvl + 1) * (lvl + 1);
  return { lvl, pct: ((xp - cur) / (next - cur)) * 100, falta: next - xp };
}

export const nivelCompleto = (p: Progreso, key: string) => !!p.niveles[key]?.reto;
export const nivelesCompletos = (p: Progreso) => Object.values(p.niveles).filter((n) => n.reto).length;

export interface Logro { id: string; titulo: string; desc: string; icono: string; check: (p: Progreso) => boolean }
export const LOGROS: Logro[] = [
  { id: "primer-paso", titulo: "Primer bloque", desc: "Completa la teoría de tu primer nivel.", icono: "grass", check: (p) => Object.values(p.niveles).some((n) => n.teoria) },
  { id: "primer-nivel", titulo: "¡Qué xopá, hacker!", desc: "Completa tu primer nivel entero.", icono: "xp", check: (p) => nivelesCompletos(p) >= 1 },
  { id: "cinco", titulo: "Racha de cinco", desc: "Completa 5 niveles.", icono: "torch", check: (p) => nivelesCompletos(p) >= 5 },
  { id: "mitad", titulo: "Medio mapa", desc: "Completa la mitad de todos los niveles.", icono: "pickaxe", check: (p) => nivelesCompletos(p) >= Math.ceil(totalNiveles / 2) },
  ...C.mundos.map((m) => ({ id: `mundo-${m.id}`, titulo: `Dueño de ${m.nombre.replace("Mundo ", "")}`, desc: `Completa todos los niveles de ${m.nombre}.`, icono: m.icono as string, check: (p: Progreso) => m.niveles.every((n) => p.niveles[`${m.id}/${n.id}`]?.reto) })),
  { id: "ctf-1", titulo: "Primera bandera", desc: "Resuelve tu primer reto CTF.", icono: "flag", check: (p) => p.retos.length >= 1 },
  { id: "ctf-10", titulo: "Cazabanderas", desc: "Resuelve 10 retos CTF.", icono: "sword", check: (p) => p.retos.length >= 10 },
  { id: "ctf-all", titulo: "Maestro de la bóveda", desc: "Resuelve todos los retos.", icono: "chest", check: (p) => C.retos.every((r) => p.retos.includes(r.id)) },
  { id: "anzuelo", titulo: "No muerdo el anzuelo", desc: "Saca 10/10 en el detector de phishing.", icono: "heart", check: (p) => p.phishingBest >= 10 },
  { id: "tutor", titulo: "Aprendiz aplicado", desc: "Termina 3 tutoriales.", icono: "key", check: (p) => p.tutoriales.length >= 3 },
  { id: "lab-1", titulo: "Manos a la obra", desc: "Termina tu primer laboratorio.", icono: "pickaxe", check: (p) => p.labs.length >= 1 },
  { id: "lab-10", titulo: "Técnico de laboratorio", desc: "Termina 10 laboratorios.", icono: "monitor", check: (p) => p.labs.length >= 10 },
  { id: "examen", titulo: "Examen superado", desc: "Aprueba el examen final con 70 o más.", icono: "diamond", check: (p) => p.examenMejor >= 70 },
  { id: "examen-90", titulo: "Matrícula de honor", desc: "Saca 90 o más en el examen final.", icono: "chest", check: (p) => p.examenMejor >= 90 },
];

let state: Progreso = load();
const subs = new Set<(p: Progreso) => void>();

function commit(next: Progreso) {
  // Logros nuevos
  const nuevos = LOGROS.filter((l) => !next.logros.includes(l.id) && l.check(next));
  if (nuevos.length) next = { ...next, logros: [...next.logros, ...nuevos.map((l) => l.id)] };
  state = next;
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* sin almacenamiento */ }
  subs.forEach((s) => s(state));
  nuevos.forEach((l) => notify({ titulo: "¡Logro desbloqueado!", texto: l.titulo, icono: l.icono }));
  if (nuevos.length) sfx("logro");
}

export function useProgreso() {
  const [p, setP] = useState(state);
  useEffect(() => { subs.add(setP); return () => { subs.delete(setP); }; }, []);
  const update = useCallback((fn: (p: Progreso) => Progreso) => commit(fn(state)), []);
  return [p, update] as const;
}

export function marcarFase(key: string, fase: "teoria" | "practica" | "reto") {
  if (state.niveles[key]?.[fase]) return;
  commit({ ...state, niveles: { ...state.niveles, [key]: { ...state.niveles[key], [fase]: true } } });
  sfx("ok");
}

/** Marca un laboratorio como terminado (una sola vez). */
export function marcarLab(id: string) {
  if (state.labs.includes(id)) return;
  commit({ ...state, labs: [...state.labs, id] });
  notify({ titulo: "Laboratorio completado", texto: "+30 XP", icono: "pickaxe" });
  sfx("ok");
}

export function guardarExamen(r: ExamenResultado) {
  commit({
    ...state,
    ultimoExamen: r,
    examenes: state.examenes + 1,
    examenMejor: Math.max(state.examenMejor, r.nota),
  });
}

export function setEstudiante(nombre: string) {
  commit({ ...state, estudiante: nombre });
}

export function resetProgreso() {
  commit({ ...EMPTY });
}

/* ── Notificaciones tipo «logro» ── */
export interface Aviso { titulo: string; texto: string; icono: string; id?: number }
const avisoSubs = new Set<(a: Aviso) => void>();
export function notify(a: Aviso) { avisoSubs.forEach((s) => s({ ...a, id: Date.now() + Math.random() })); }
export function useAvisos(cb: (a: Aviso) => void) {
  useEffect(() => { avisoSubs.add(cb); return () => { avisoSubs.delete(cb); }; }, [cb]);
}
