import { useCallback, useEffect, useState } from "react";
import { C, totalNiveles } from "./content";
import { sfx } from "./sonido";
import { fechaLocalClave, siguienteRepaso } from "./review";

export interface ExamenResultado {
  nota: number;      // 0-100
  aciertos: number;
  total: number;
  fecha: string;     // ISO
  segundos: number;
  estacionesPracticas?: number;
}

export interface TarjetaRepaso {
  id: string;
  tema: string;
  pregunta: string;
  opciones: string[];
  respuesta: number;
  explicacion: string;
  proxima: string;
  nivel: number;
}

export interface EstadoOperacion {
  paso: number;
  decisiones: number[];
  completada: boolean;
  xpOtorgada: boolean;
}

export interface Progreso {
  niveles: Record<string, { teoria?: boolean; practica?: boolean; reto?: boolean }>;
  retos: string[];
  tutoriales: string[];
  phishingBest: number;
  phishingPlayed: number;
  logros: string[];
  labs: string[];
  proyectosFinalizados: string[];
  repaso: TarjetaRepaso[];
  operacion: EstadoOperacion;
  examenMejor: number;
  examenMejorDetalle: ExamenResultado | null;
  examenes: number;
  ultimoExamen: ExamenResultado | null;
  estudiante: string;
  metaEstudio: { objetivoSemanal: number; semana: string; nivelesCompletados: number; diasActivos: string[] };
}

const KEY = "factionvault-v4";
const EMPTY: Progreso = { niveles: {}, retos: [], tutoriales: [], phishingBest: 0, phishingPlayed: 0, logros: [], labs: [], proyectosFinalizados: [], repaso: [], operacion: { paso: 0, decisiones: [], completada: false, xpOtorgada: false }, examenMejor: 0, examenMejorDetalle: null, examenes: 0, ultimoExamen: null, estudiante: "", metaEstudio: { objetivoSemanal: 3, semana: "", nivelesCompletados: 0, diasActivos: [] } };

function load(): Progreso {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const saved = JSON.parse(raw) as Partial<Progreso>;
    const ultimoExamen = saved.ultimoExamen ?? null;
    const examenMejorDetalle = saved.examenMejorDetalle ?? (ultimoExamen && ultimoExamen.nota === (saved.examenMejor ?? 0) ? ultimoExamen : null);
    return { ...EMPTY, ...saved, proyectosFinalizados: saved.proyectosFinalizados ?? [], repaso: saved.repaso ?? [], operacion: { ...EMPTY.operacion, ...saved.operacion, decisiones: saved.operacion?.decisiones ?? [] }, ultimoExamen, examenMejorDetalle, metaEstudio: { ...EMPTY.metaEstudio, ...saved.metaEstudio } };
  } catch {
    return EMPTY;
  }
}

/* XP: teoría 20 · práctica 40 · reto 60 · CTF por puntos · guía 50 · phishing 10 por récord · lab 30 · proyecto final 50 · Operación Bóveda 100 (una vez) · examen 2×nota */
export function xpDe(p: Progreso): number {
  let xp = 0;
  for (const n of Object.values(p.niveles)) xp += (n.teoria ? 20 : 0) + (n.practica ? 40 : 0) + (n.reto ? 60 : 0);
  xp += C.retos.filter((r) => p.retos.includes(r.id)).reduce((a, r) => a + r.puntos, 0);
  xp += p.tutoriales.length * 50 + p.phishingBest * 10;
  xp += p.labs.length * 30 + p.proyectosFinalizados.length * 50 + (p.operacion?.xpOtorgada ? 100 : 0) + Math.round(p.examenMejor * 2);
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

function fechaClave(fecha: Date): string { return fechaLocalClave(fecha); }

export function registrarFalloRepaso(tarjeta: Omit<TarjetaRepaso, "proxima" | "nivel">) {
  const anterior = state.repaso.find((x) => x.id === tarjeta.id);
  const nueva: TarjetaRepaso = { ...tarjeta, proxima: fechaClave(new Date()), nivel: 0 };
  commit({ ...state, repaso: [...state.repaso.filter((x) => x.id !== tarjeta.id), anterior ? { ...anterior, ...nueva } : nueva] });
}

export function calificarRepaso(id: string, loRecordo: boolean) {
  const tarjeta = state.repaso.find((x) => x.id === id);
  if (!tarjeta) return;
  const plan = siguienteRepaso(tarjeta.nivel, loRecordo);
  commit({ ...state, repaso: state.repaso.map((x) => x.id === id ? { ...x, nivel: plan.nivel, proxima: plan.proxima } : x) });
}

export function semanaActual(fecha = new Date()): string {
  const lunes = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
  lunes.setDate(lunes.getDate() - ((lunes.getDay() + 6) % 7));
  return fechaClave(lunes);
}
export function diasSemanaActual(fecha = new Date()): string[] {
  const lunes = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
  lunes.setDate(lunes.getDate() - ((lunes.getDay() + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => { const d = new Date(lunes); d.setDate(lunes.getDate() + i); return fechaClave(d); });
}
export function rachaEstudio(p: Progreso, hoy = new Date()): number {
  const activos = new Set(p.metaEstudio?.diasActivos ?? []);
  const cursor = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  if (!activos.has(fechaClave(cursor))) cursor.setDate(cursor.getDate() - 1);
  let dias = 0;
  while (activos.has(fechaClave(cursor))) { dias++; cursor.setDate(cursor.getDate() - 1); }
  return dias;
}
export function actualizarObjetivoSemanal(objetivoSemanal: number) {
  const objetivo = Math.max(1, Math.min(7, Math.round(objetivoSemanal)));
  commit({ ...state, metaEstudio: { ...state.metaEstudio, objetivoSemanal: objetivo } });
}

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
  const niveles = { ...state.niveles, [key]: { ...state.niveles[key], [fase]: true } };
  let metaEstudio = state.metaEstudio;
  if (fase === "reto") {
    const hoy = fechaClave(new Date());
    const semana = semanaActual();
    const diasActivos = [...new Set([...(metaEstudio.diasActivos ?? []), hoy])].slice(-90);
    metaEstudio = {
      ...metaEstudio,
      semana,
      nivelesCompletados: metaEstudio.semana === semana ? metaEstudio.nivelesCompletados + 1 : 1,
      diasActivos,
    };
  }
  commit({ ...state, niveles, metaEstudio });
  sfx("ok");
}

/** Marca un laboratorio como terminado (una sola vez). */
export function marcarLab(id: string) {
  if (state.labs.includes(id)) return;
  commit({ ...state, labs: [...state.labs, id] });
  notify({ titulo: "Laboratorio completado", texto: "+30 XP", icono: "pickaxe" });
  sfx("ok");
}

export function guardarProyecto(id: string) {
  if (state.proyectosFinalizados.includes(id)) return;
  commit({ ...state, proyectosFinalizados: [...state.proyectosFinalizados, id] });
  notify({ titulo: "Proyecto finalizado", texto: "+50 XP · guardado en este navegador", icono: "diamond" });
  sfx("subir");
}

export function guardarPasoOperacion(decision: number) {
  const actual = state.operacion;
  if (actual.completada || actual.paso >= 4) return;
  const paso = actual.paso + 1;
  const completada = paso >= 4;
  const xpOtorgada = actual.xpOtorgada || completada;
  commit({ ...state, operacion: { paso, decisiones: [...actual.decisiones, decision], completada, xpOtorgada } });
  if (completada) {
    notify({ titulo: "Operación completada", texto: `${actual.xpOtorgada ? "Repetición terminada" : "+100 XP · informe de incidente listo"}`, icono: "shield" });
    sfx("subir");
  }
}

export function reiniciarOperacion() {
  commit({ ...state, operacion: { ...state.operacion, paso: 0, decisiones: [], completada: false } });
}

export function guardarExamen(r: ExamenResultado) {
  const nuevoRecord = r.nota >= state.examenMejor ? r : state.examenMejorDetalle;
  commit({
    ...state,
    ultimoExamen: r,
    examenMejorDetalle: nuevoRecord,
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
