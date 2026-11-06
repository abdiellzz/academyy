import FV_CONTENT from "../content.js";
import type { Contenido } from "../types";

/** Fuente de verdad: window.FV_CONTENT (content.js). */
export const C: Contenido = ((typeof window !== "undefined" && (window as unknown as { FV_CONTENT?: Contenido }).FV_CONTENT) || FV_CONTENT) as Contenido;

export const mundoById = (id: string) => C.mundos.find((m) => m.id === id);
export const totalNiveles = C.mundos.reduce((a, m) => a + m.niveles.length, 0);
export const nivelKey = (mundo: string, nivel: string) => `${mundo}/${nivel}`;
