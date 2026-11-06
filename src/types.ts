import type { PixelIconName } from "./components/PixelArt";

export type Juego = "minecraft" | "fortnite" | "panama";

export type TeoriaBloque =
  | { t: "p"; text: string }
  | { t: "h"; text: string }
  | { t: "list"; items: string[] }
  | { t: "why"; text: string }
  | { t: "porque"; text: string }
  | { t: "tip"; text: string }
  | { t: "warn"; text: string }
  | { t: "result"; text: string }
  | { t: "steps"; items: { t: string; d: string }[] }
  | { t: "table"; head: string[]; rows: string[][] }
  | { t: "term"; text: string; title?: string };

export type PracticaBase =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | { tipo: "widget"; w: string; props?: any }
  | { tipo: "codigo"; codigo: string; salida: string; explicacion?: string; reto?: { enunciado: string; pista?: string; debes_ver: string } }
  | { tipo: "orden"; titulo: string; pasos: string[] }
  | { tipo: "escribir"; pregunta: string; respuestas: string[]; pista?: string; explicacion?: string }
  | { tipo: "phishing"; cantidad?: number }
  | { tipo: "cesar" | "hash" | "password" | "aes" | "dh" };

/** Cada práctica puede explicar por qué se hace así. */
export type Practica = PracticaBase & { porque?: string };

export interface Reto { pregunta: string; opciones: string[]; respuesta: number; explicacion: string }

export interface Nivel {
  id: string;
  nivel: number;
  titulo: string;
  subtitulo: string;
  minutos: number;
  icono: PixelIconName;
  objetivos: string[];
  teoria: TeoriaBloque[];
  ejemplos: { juego: Juego; titulo: string; texto: string }[];
  practica: Practica[];
  reto: Reto;
}

export interface Mundo {
  id: string;
  nombre: string;
  bioma: string;
  tagline: string;
  descripcion: string;
  color: string;
  fondo: string;
  icono: PixelIconName;
  intro: string;
  niveles: Nivel[];
}

export interface RetoCTF {
  id: string; titulo: string; categoria: string; dificultad: "Fácil" | "Media" | "Difícil"; puntos: number;
  enunciado: string; cifrado?: string; pista: string; aceptadas: string[]; solucion: string; explicacion: string;
  tipo: "texto" | "opciones"; opciones?: string[]; mundo: string;
}

export interface Termino { termino: string; categoria: string; definicion: string; detalle: string }
export interface Tutorial { id: string; titulo: string; descripcion: string; nivel: string; minutos: number; icono: string; pasos: { titulo: string; texto: string; accion?: { label: string; vista: string } }[] }
export interface MensajePhishing { id: string; canal: "sms" | "whatsapp" | "email" | "dm"; remitente: string; asunto?: string; mensaje: string; enlace?: string; es_phishing: boolean; senales: string[]; explicacion: string }
export interface Snippet { id: string; titulo: string; lenguaje: string; categoria: string; codigo: string; explicacion: string }

export interface Contenido {
  meta: { nombre: string; subtitulo: string; autor: string; github: string; version: string };
  mundos: Mundo[];
  retos: RetoCTF[];
  glosario: Termino[];
  tutoriales: Tutorial[];
  phishing: MensajePhishing[];
  snippets: Snippet[];
}

export type Ruta =
  | { v: "inicio" }
  | { v: "mundo"; id: string }
  | { v: "nivel"; mundo: string; nivel: string; lab?: boolean }
  | { v: "retos" }
  | { v: "laboratorio" }
  | { v: "examen" }
  | { v: "certificado" }
  | { v: "phishing" }
  | { v: "tutoriales" }
  | { v: "glosario" }
  | { v: "snippets" }
  | { v: "progreso" };
