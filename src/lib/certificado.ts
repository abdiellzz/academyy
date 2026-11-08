import { LOGO_SRC } from "../assets/logo";

/* ═══════════════════════════════════════════════════════════════════
   CERTIFICADO EN IMAGEN Y PDF
   - Se dibuja en un <canvas> (misma composición que la versión HTML).
   - El PDF se arma a mano: una página A4 horizontal con esa imagen
     comprimida con deflate. Sin librerías, sin internet.
   ═══════════════════════════════════════════════════════════════════ */

export interface DatosCert {
  nombre: string;
  nota: number;
  progreso: { niveles: number; totalNiveles: number; labs: number; totalLabs: number; retos: number; totalRetos: number };
  mundos?: number;
  estacionesPracticas?: number;
  fecha: string;
  id: string;
  demo?: boolean;
}

/* Geometría lógica del documento (se escala al rasterizar). */
const W = 1400;
const H = 990;

const C = {
  fondo: "#090b10",
  panel: "#11151c",
  oro: "#dfc184",
  oroClaro: "#f0d99f",
  oroOscuro: "#1a2528",
  crema: "#f0f3f7",
  texto2: "#c6ced8",
  texto3: "#8994a3",
  verde: "#78dbba",
  negro: "#090b10",
  cinta: "#18382f",
  cinta2: "#24473e",
};

const F_TITULO = '"Press Start 2P", "Courier New", monospace';
const F_LABEL = '"Pixelify Sans", Arial, sans-serif';
const F_TEXTO = '"Pixelify Sans", Arial, sans-serif';
const F_MONO = 'ui-monospace, "Courier New", monospace';

type Align = "left" | "center" | "right";

interface TxtOpts {
  font?: string;
  size?: number;
  color?: string;
  align?: Align;
  espaciado?: number;
  sombra?: number;
  maxAncho?: number;
  peso?: number;
}

function fuente(o: TxtOpts): string {
  return `${o.peso ?? 500} ${o.size ?? 18}px ${o.font ?? F_TEXTO}`;
}

function medir(ctx: CanvasRenderingContext2D, texto: string, o: TxtOpts): number {
  ctx.font = fuente(o);
  const base = ctx.measureText(texto).width;
  return base + (o.espaciado ?? 0) * Math.max(0, texto.length - 1);
}

/** Texto con alineación, espaciado entre letras y sombra dura opcional. */
function txt(ctx: CanvasRenderingContext2D, texto: string, x: number, y: number, o: TxtOpts = {}): void {
  const ancho = medir(ctx, texto, o);
  const x0 = o.align === "center" ? x - ancho / 2 : o.align === "right" ? x - ancho : x;
  ctx.font = fuente(o);
  ctx.textBaseline = "alphabetic";

  const pintar = (dx: number, dy: number, color: string) => {
    ctx.fillStyle = color;
    if (!o.espaciado) {
      ctx.fillText(texto, dx, dy);
      return;
    }
    let cx = dx;
    for (const ch of texto) {
      ctx.fillText(ch, cx, dy);
      cx += ctx.measureText(ch).width + o.espaciado;
    }
  };

  if (o.sombra) pintar(x0 + o.sombra, y + o.sombra, C.negro);
  pintar(x0, y, o.color ?? C.crema);
}

function rect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string): void {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

/** Parte un texto en líneas que quepan en `max`. */
function envolver(ctx: CanvasRenderingContext2D, texto: string, o: TxtOpts, max: number): string[] {
  ctx.font = fuente(o);
  const palabras = texto.split(/\s+/);
  const lineas: string[] = [];
  let actual = "";
  for (const p of palabras) {
    const prueba = actual ? `${actual} ${p}` : p;
    if (ctx.measureText(prueba).width > max && actual) {
      lineas.push(actual);
      actual = p;
    } else {
      actual = prueba;
    }
  }
  if (actual) lineas.push(actual);
  return lineas;
}

/** Borde punteado hecho de bloques, como en la versión HTML. */
function bordePunteado(ctx: CanvasRenderingContext2D): void {
  const m = 38;
  rect(ctx, m, m, W - 2 * m, 3, "#425a47");
  rect(ctx, m, H - m - 3, W - 2 * m, 3, "#425a47");
  rect(ctx, m, m, 3, H - 2 * m, "#425a47");
  rect(ctx, W - m - 3, m, 3, H - 2 * m, "#425a47");
  rect(ctx, m + 8, m + 9, W - 2 * m - 16, 3, C.verde);
  for (let x = m + 16; x < W - m - 16; x += 32) {
    rect(ctx, x, H - m - 12, 16, 4, x % 3 === 0 ? C.oro : "#52766e");
  }
  rect(ctx, 64, 64, W - 128, 1, "#29382f");
  rect(ctx, 64, H - 65, W - 128, 1, "#29382f");
}

function esquinas(ctx: CanvasRenderingContext2D): void {
  // Bloques escalonados de esmeralda y cobre, sin usar recursos de terceros.
  const corners = [[58, 58, 1, 1], [W - 92, 58, -1, 1], [58, H - 92, 1, -1], [W - 92, H - 92, -1, -1]];
  for (const [x, y, dx, dy] of corners) {
    rect(ctx, x, y, 22, 22, "#17231b");
    rect(ctx, x + 4 * dx, y + 4 * dy, 14, 14, "#4c8058");
    rect(ctx, x + 8 * dx, y + 8 * dy, 7, 7, C.verde);
    rect(ctx, x + 22 * dx, y + 4 * dy, 7, 7, C.oro);
    rect(ctx, x + 4 * dx, y + 22 * dy, 7, 7, "#a76e3a");
  }
}

function fondo(ctx: CanvasRenderingContext2D): void {
  rect(ctx, 0, 0, W, H, C.fondo);
  rect(ctx, 28, 28, W - 56, H - 56, C.panel);
}

function sello(ctx: CanvasRenderingContext2D, cx: number, cy: number, nota: number): void {
  const w = 128;
  const h = 90;
  const x = cx - w / 2;
  const y = cy - h / 2;
  rect(ctx, x - 5, y - 5, w + 10, h + 10, "#090b10");
  rect(ctx, x - 2, y - 2, w + 4, h + 4, "#617d58");
  rect(ctx, x, y, w, h, "#17251b");
  rect(ctx, x, y, w, 7, C.verde);
  rect(ctx, x + 8, y + 12, 8, 8, C.oro);
  rect(ctx, x + w - 16, y + h - 20, 8, 8, C.oro);
  txt(ctx, "FV", cx, y + 48, { font: F_TITULO, size: 25, peso: 700, color: C.crema, align: "center" });
  txt(ctx, `${nota}/100`, cx, y + 73, { font: F_LABEL, size: 17, peso: 700, color: C.verde, align: "center" });
}

function dibujarCabecera(ctx: CanvasRenderingContext2D, logo: HTMLImageElement | null): void {
  if (logo && logo.complete && logo.naturalWidth) {
    const lado = Math.min(logo.naturalWidth, logo.naturalHeight);
    const tam = 64;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(logo, 0, 0, lado, lado, 108, 88 - tam / 2, tam, tam);
  }
  txt(ctx, "FACTIONVAULT", 194, 99, { font: F_TITULO, size: 25, peso: 700, color: C.crema });
  txt(ctx, "CONSTANCIA DE FINALIZACIÓN", 196, 128, {
    font: F_LABEL, size: 12, peso: 600, color: C.texto3, espaciado: 1.3,
  });
}

function formatearFecha(iso: string): string {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear()}`;
}

/** Dibuja el certificado completo en un canvas de 1400×990 (×escala). */
export function dibujarCertificado(canvas: HTMLCanvasElement, d: DatosCert, logo: HTMLImageElement | null, escala = 1): void {
  canvas.width = Math.round(W * escala);
  canvas.height = Math.round(H * escala);
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.setTransform(escala, 0, 0, escala, 0, 0);

  fondo(ctx);
  bordePunteado(ctx);
  esquinas(ctx);
  dibujarCabecera(ctx, logo);
  rect(ctx, W - 352, 76, 236, 34, "#121d17");
  rect(ctx, W - 352, 76, 6, 34, C.verde);
  txt(ctx, "RUTA COMPLETADA", W - 232, 99, { font: F_LABEL, size: 12, peso: 700, color: C.verde, align: "center", espaciado: 1 });

  rect(ctx, W / 2 - 150, 196, 300, 34, "#19271d");
  rect(ctx, W / 2 - 150, 196, 8, 34, C.oro);
  rect(ctx, W / 2 + 142, 196, 8, 34, C.oro);
  txt(ctx, "LOGRO DESBLOQUEADO", W / 2, 218, { font: F_LABEL, size: 13, peso: 700, color: C.oroClaro, align: "center", espaciado: 1.1 });
  txt(ctx, "CERTIFICADO", W / 2, 330, { font: F_TITULO, size: 58, peso: 700, color: C.crema, align: "center", espaciado: 1 });
  txt(ctx, "DE FINALIZACIÓN", W / 2, 382, { font: F_TITULO, size: 21, peso: 600, color: C.verde, align: "center", espaciado: 3 });

  txt(ctx, "OTORGADO A", W / 2, 455, { font: F_LABEL, size: 14, peso: 700, color: C.texto3, align: "center", espaciado: 2.6 });
  txt(ctx, d.nombre || "Nombre del estudiante", W / 2, 505, {
    font: F_TITULO,
    size: 34,
    peso: 700,
    color: C.crema,
    align: "center",
  });

  // Separador fino en verde agua.
  const lw = 480;
  rect(ctx, W / 2 - lw / 2, 526, lw, 2, C.verde);

  // cuerpo
  const practicaExamen = d.estacionesPracticas ? ` con ${d.estacionesPracticas} estaciones prácticas de Python y análisis de redes` : "";
  const cuerpo =
    `Por completar la ruta de ${d.mundos ?? 7} mundos de FactionVault —${d.progreso.totalNiveles} niveles, ` +
    `${d.progreso.totalLabs} laboratorios y ${d.progreso.totalRetos} retos CTF— y aprobar el examen final ` +
    `con una nota de ${d.nota}/100${practicaExamen}, demostrando criterio técnico en seguridad informática, ` +
    `redes, sistemas operativos, Python, criptografía, ingeniería social y desarrollo web seguro.`;
  const opts: TxtOpts = { font: F_TEXTO, size: 20, peso: 450, color: C.texto2 };
  const lineas = envolver(ctx, cuerpo, opts, 900);
  lineas.forEach((l, i) => txt(ctx, l, W / 2, 578 + i * 29, { ...opts, align: "center" }));

  // columna izquierda: progreso y nota
  txt(ctx, "PROGRESO", 110, 748, { font: F_LABEL, size: 13, peso: 700, color: C.texto3, espaciado: 2.2 });
  txt(ctx, `${d.progreso.niveles}/${d.progreso.totalNiveles} niveles · ${d.progreso.labs}/${d.progreso.totalLabs} labs`, 110, 776, {
    font: F_MONO,
    size: 19,
    peso: 600,
    color: C.texto2,
  });
  txt(ctx, `${d.progreso.retos}/${d.progreso.totalRetos} retos CTF`, 110, 802, { font: F_MONO, size: 19, peso: 600, color: C.texto2 });
  txt(ctx, "NOTA FINAL", 110, 840, { font: F_LABEL, size: 13, peso: 700, color: C.texto3, espaciado: 2.2 });
  txt(ctx, `${d.nota}/100`, 108, 878, { font: F_TITULO, size: 30, peso: 700, color: C.verde });

  // sello y firmas
  sello(ctx, W - 270, 770, d.nota);

  const firmas: [number, string][] = [
    [560, "DIEL · INSTRUCTOR"],
    [900, "FACTIONVAULT"],
  ];
  for (const [x, etiqueta] of firmas) {
    rect(ctx, x - 95, 886, 190, 3, C.texto3);
    txt(ctx, etiqueta, x, 910, { font: F_LABEL, size: 12, color: C.texto2, align: "center", espaciado: 1.8 });
  }

  // pie
  txt(ctx, `Emitido el ${formatearFecha(d.fecha)} · ID ${d.id}`, 110, 934, {
    font: F_LABEL,
    size: 11,
    color: C.texto3,
    espaciado: 1.4,
  });
  txt(ctx, "CERTIFICADO DE FINALIZACIÓN DE LA PLATAFORMA · NO ES UNA CERTIFICACIÓN OFICIAL", 110, 950, {
    font: F_LABEL,
    size: 9,
    color: "#a2adba",
    espaciado: 1.1,
  });

  if (d.demo) {
    ctx.save();
    ctx.globalAlpha = 0.2;
    txt(ctx, "VISTA PREVIA · SIN VALIDEZ", W / 2, 700, { font: F_TITULO, size: 36, peso: 700, color: C.oroClaro, align: "center", espaciado: 2 });
    ctx.restore();
  }
}

/* ── Utilidades de descarga ─────────────────────────────────────── */

function cargarLogo(): Promise<HTMLImageElement | null> {
  return new Promise((resolver) => {
    try {
      const img = new Image();
      img.onload = () => resolver(img);
      img.onerror = () => resolver(null);
      img.src = LOGO_SRC;
    } catch {
      resolver(null);
    }
  });
}

function nombreArchivo(d: DatosCert): string {
  const limpio = (d.nombre || "factionvault")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
  return `factionvault-certificado-${limpio || "alumno"}`;
}

/** Escala de rasterizado: 2× en escritorio, 1.6× en móvil (memoria del canvas). */
function escalaOptima(): number {
  if (typeof window === "undefined") return 2;
  return window.innerWidth < 720 ? 1.6 : 2;
}

export async function rasterizar(d: DatosCert, escala = escalaOptima()): Promise<HTMLCanvasElement> {
  const canvas = document.createElement("canvas");
  const logo = await cargarLogo();
  // Las fuentes pixel vienen de Google Fonts: esperamos a que estén listas.
  try {
    await (document as unknown as { fonts?: { ready: Promise<unknown> } }).fonts?.ready;
  } catch {
    /* sin fuente, se usa la de respaldo */
  }
  dibujarCertificado(canvas, d, logo, escala);
  return canvas;
}

export async function descargarPNG(d: DatosCert): Promise<void> {
  if (d.demo) throw new Error("La vista de muestra no se puede exportar");
  const canvas = await rasterizar(d);
  const url = canvas.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = url;
  a.download = `${nombreArchivo(d)}.png`;
  a.click();
}

/* ═══════════════════════════════════════════════════════════════════
   PDF a mano: A4 horizontal, una imagen RGB comprimida con deflate.
   ═══════════════════════════════════════════════════════════════════ */

/** Comprime con zlib (lo que espera /FlateDecode). */
async function deflate(datos: Uint8Array): Promise<Uint8Array> {
  const Quizas = globalThis as unknown as { CompressionStream?: new (formato: string) => CompressionStream };
  if (Quizas.CompressionStream) {
    const cs = new Quizas.CompressionStream("deflate");
    const stream = new Blob([datos as unknown as BlobPart]).stream().pipeThrough(cs);
    const buf = await new Response(stream).arrayBuffer();
    return new Uint8Array(buf);
  }
  throw new Error("sin CompressionStream");
}

function jpegDeCanvas(canvas: HTMLCanvasElement): Uint8Array {
  const b64 = canvas.toDataURL("image/jpeg", 0.94).split(",")[1];
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

interface Imagen {
  datos: Uint8Array;
  ancho: number;
  alto: number;
  filtro: "FlateDecode" | "DCTDecode";
  canales: number;
}

/** Arma el PDF completo a partir de la imagen. Función pura y comprobable. */
export function construirPDF(img: Imagen): Uint8Array {
  const encoder = new TextEncoder();
  const trozos: Uint8Array[] = [];
  const offsets: number[] = [];
  let largo = 0;

  const push = (dato: Uint8Array | string) => {
    const bytes = typeof dato === "string" ? encoder.encode(dato) : dato;
    trozos.push(bytes);
    largo += bytes.length;
  };

  const objeto = (n: number, cuerpo: string, stream?: Uint8Array) => {
    offsets[n] = largo;
    push(`${n} 0 obj\n${cuerpo}\n`);
    if (stream) {
      push("stream\n");
      push(stream);
      push("\nendstream\n");
    }
    push("endobj\n");
  };

  // A4 horizontal en puntos
  const PW = 841.89;
  const PH = 595.28;
  const margen = 14;
  const escala = Math.min((PW - margen * 2) / img.ancho, (PH - margen * 2) / img.alto);
  const w = img.ancho * escala;
  const h = img.alto * escala;
  const x = (PW - w) / 2;
  const y = (PH - h) / 2;

  const contenido = encoder.encode(
    `q\n${w.toFixed(2)} 0 0 ${h.toFixed(2)} ${x.toFixed(2)} ${y.toFixed(2)} cm\n/Im0 Do\nQ\n`,
  );

  push("%PDF-1.4\n");
  push(new Uint8Array([0x25, 0xe2, 0xe3, 0xcf, 0xd3, 0x0a])); // marca binaria

  objeto(1, "<< /Type /Catalog /Pages 2 0 R >>");
  objeto(2, "<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
  objeto(
    3,
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PW.toFixed(2)} ${PH.toFixed(2)}] /Resources << /XObject << /Im0 5 0 R >> >> /Contents 4 0 R >>`,
  );
  objeto(4, `<< /Length ${contenido.length} >>`, contenido);

  const color = img.canales === 4 ? "/DeviceCMYK" : "/DeviceRGB";
  objeto(
    5,
    `<< /Type /XObject /Subtype /Image /Width ${img.ancho} /Height ${img.alto} /ColorSpace ${color} /BitsPerComponent 8 /Filter /${img.filtro} /Length ${img.datos.length} >>`,
    img.datos,
  );
  objeto(6, "<< /Producer (FactionVault) /Title (Certificado de finalizacion) /Creator (FactionVault) >>");

  const inicioXref = largo;
  push("xref\n0 7\n");
  push("0000000000 65535 f \n");
  for (let i = 1; i <= 6; i++) push(`${String(offsets[i]).padStart(10, "0")} 00000 n \n`);
  push(`trailer\n<< /Size 7 /Root 1 0 R /Info 6 0 R >>\nstartxref\n${inicioXref}\n%%EOF\n`);

  const salida = new Uint8Array(largo);
  let p = 0;
  for (const t of trozos) {
    salida.set(t, p);
    p += t.length;
  }
  return salida;
}

/** PNG → PDF: rasteriza, extrae los bytes RGB y arma el archivo. */
export async function descargarPDF(d: DatosCert): Promise<void> {
  if (d.demo) throw new Error("La vista de muestra no se puede exportar");
  const canvas = await rasterizar(d);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("sin canvas");

  const { width, height } = canvas;
  const rgba = ctx.getImageData(0, 0, width, height).data;
  const rgb = new Uint8Array(width * height * 3);
  for (let i = 0, j = 0; i < rgba.length; i += 4, j += 3) {
    // sobre negro: la transparencia no existe en el documento, pero por si acaso
    const a = rgba[i + 3] / 255;
    rgb[j] = rgba[i] * a;
    rgb[j + 1] = rgba[i + 1] * a;
    rgb[j + 2] = rgba[i + 2] * a;
  }

  let img: Imagen;
  try {
    img = { datos: await deflate(rgb), ancho: width, alto: height, filtro: "FlateDecode", canales: 3 };
  } catch {
    img = { datos: jpegDeCanvas(canvas), ancho: width, alto: height, filtro: "DCTDecode", canales: 3 };
  }

  const pdf = construirPDF(img);
  const blob = new Blob([pdf as unknown as BlobPart], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${nombreArchivo(d)}.pdf`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
