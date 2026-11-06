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
  fecha: string;
  id: string;
  demo?: boolean;
}

/* Geometría lógica del documento (se escala al rasterizar). */
const W = 1400;
const H = 990;

const C = {
  fondo: "#0d0b10",
  oro: "#ffb02e",
  oroClaro: "#ffd67a",
  oroOscuro: "#3a2400",
  crema: "#f3ecff",
  texto2: "#c3b6df",
  texto3: "#8d81a8",
  verde: "#3ee07a",
  negro: "#000000",
  cinta: "#96283c",
  cinta2: "#6e1a2a",
};

const F_TITULO = '"Press Start 2P", "Courier New", monospace';
const F_LABEL = '"Silkscreen", "Courier New", monospace';
const F_TEXTO = '"Pixelify Sans", "Trebuchet MS", system-ui, sans-serif';
const F_MONO = '"VT323", "Courier New", monospace';

type Align = "left" | "center" | "right";

interface TxtOpts {
  font?: string;
  size?: number;
  color?: string;
  align?: Align;
  espaciado?: number;
  sombra?: number;
  maxAncho?: number;
}

function fuente(o: TxtOpts): string {
  return `${o.size ?? 18}px ${o.font ?? F_TEXTO}`;
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
  const inset = 12;
  const grosor = 10;
  const lado = 10;
  const hueco = 12;
  const x0 = inset;
  const y0 = inset;
  const x1 = W - inset - grosor;
  const y1 = H - inset - grosor;

  for (let x = x0; x < x1; x += lado + hueco) {
    const w = Math.min(lado, x1 - x);
    rect(ctx, x, y0, w, grosor, C.oro);
    rect(ctx, x, y1, w, grosor, C.oro);
  }
  for (let y = y0; y < y1; y += lado + hueco) {
    const h = Math.min(lado, y1 - y);
    rect(ctx, x0, y, grosor, h, C.oro);
    rect(ctx, x1, y, grosor, h, C.oro);
  }
}

function esquinas(ctx: CanvasRenderingContext2D): void {
  const s = 34;
  const pos: [number, number][] = [
    [6, 6],
    [W - 6 - s, 6],
    [6, H - 6 - s],
    [W - 6 - s, H - 6 - s],
  ];
  for (const [x, y] of pos) {
    rect(ctx, x - 3, y - 3, s + 6, s + 6, C.negro);
    rect(ctx, x, y, s, s, C.oroClaro);
  }
}

function fondo(ctx: CanvasRenderingContext2D): void {
  rect(ctx, 0, 0, W, H, C.fondo);
  // trama de tablero de 8 px, muy suave
  ctx.fillStyle = "rgba(255,255,255,.028)";
  for (let y = 0; y < H; y += 8) {
    for (let x = 0; x < W; x += 8) {
      if (((x / 8) | 0) % 2 === ((y / 8) | 0) % 2) ctx.fillRect(x, y, 4, 4);
    }
  }
}

function sello(ctx: CanvasRenderingContext2D, cx: number, cy: number, nota: number): void {
  const w = 128;
  const h = 86;
  const x = cx - w / 2;
  const y = cy - h / 2;

  // cintas detrás, colgando de la medalla
  rect(ctx, cx - 42, y + h - 18, 30, 80, C.cinta);
  rect(ctx, cx + 12, y + h - 18, 30, 80, C.cinta2);

  // medalla: borde negro, cuerpo oscuro y remate dorado
  rect(ctx, x - 4, y - 4, w + 8, h + 8, C.negro);
  rect(ctx, x, y, w, h, C.oroOscuro);
  rect(ctx, x, y, w, 10, C.oroClaro);
  rect(ctx, x, y + h - 6, w, 6, C.negro);

  txt(ctx, "FV", cx, y + 52, { font: F_TITULO, size: 26, color: C.oroClaro, align: "center", sombra: 3 });
  txt(ctx, `${nota}%`, cx, y + 76, { font: F_LABEL, size: 14, color: C.verde, align: "center" });
}

function dibujarCabecera(ctx: CanvasRenderingContext2D, logo: HTMLImageElement | null): void {
  if (logo && logo.complete && logo.naturalWidth) {
    // El logo trae el nombre al lado; aquí se recorta al mono para no
    // repetir «FACTION VAULT» justo al lado del título.
    const lado = Math.min(logo.naturalWidth, logo.naturalHeight);
    const tam = 74;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(logo, 0, 0, lado, lado, 102, 80 - tam / 2, tam, tam);
  }
  txt(ctx, "FACTION VAULT", 210, 116, { font: F_TITULO, size: 32, color: C.crema, sombra: 3 });
  txt(ctx, "CENTRO DE MANDO · CERTIFICADO DE LA PLATAFORMA", 212, 160, {
    font: F_LABEL,
    size: 13,
    color: C.texto3,
    espaciado: 2.2,
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

  txt(ctx, "CERTIFICADO", W / 2, 330, { font: F_TITULO, size: 66, color: C.oro, align: "center", espaciado: 1, sombra: 5 });
  txt(ctx, "DE FINALIZACIÓN", W / 2, 424, { font: F_TITULO, size: 25, color: C.crema, align: "center", sombra: 4 });

  txt(ctx, "OTORGADO A", W / 2, 496, { font: F_LABEL, size: 13, color: C.texto3, align: "center", espaciado: 2.6 });
  txt(ctx, d.nombre || "Nombre del estudiante", W / 2, 538, {
    font: F_TITULO,
    size: 27,
    color: C.crema,
    align: "center",
    sombra: 3,
  });

  // línea dorada
  const lw = 520;
  rect(ctx, W / 2 - lw / 2, 566, lw, 6, C.negro);
  rect(ctx, W / 2 - lw / 2, 562, lw, 5, C.oro);

  // cuerpo
  const cuerpo =
    `Por completar la ruta de ${d.mundos ?? 7} mundos de FactionVault —${d.progreso.totalNiveles} niveles, ` +
    `${d.progreso.totalLabs} laboratorios y ${d.progreso.totalRetos} retos CTF— y aprobar el examen final ` +
    `con una nota de ${d.nota}/100, demostrando criterio técnico en seguridad informática, redes, ` +
    `sistemas operativos, Python, criptografía, ingeniería social y desarrollo web seguro.`;
  const opts: TxtOpts = { font: F_TEXTO, size: 19, color: C.texto2 };
  const lineas = envolver(ctx, cuerpo, opts, 800);
  lineas.forEach((l, i) => txt(ctx, l, W / 2, 608 + i * 27, { ...opts, align: "center" }));

  // columna izquierda: progreso y nota
  txt(ctx, "PROGRESO", 110, 748, { font: F_LABEL, size: 13, color: C.texto3, espaciado: 2.2 });
  txt(ctx, `${d.progreso.niveles}/${d.progreso.totalNiveles} niveles · ${d.progreso.labs}/${d.progreso.totalLabs} labs`, 110, 776, {
    font: F_MONO,
    size: 21,
    color: C.texto2,
  });
  txt(ctx, `${d.progreso.retos}/${d.progreso.totalRetos} retos CTF`, 110, 802, { font: F_MONO, size: 21, color: C.texto2 });
  txt(ctx, "NOTA FINAL", 110, 840, { font: F_LABEL, size: 13, color: C.texto3, espaciado: 2.2 });
  txt(ctx, `${d.nota}/100`, 108, 878, { font: F_TITULO, size: 30, color: C.verde, sombra: 3 });

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
    color: "#6d6382",
    espaciado: 1.1,
  });

  if (d.demo) {
    ctx.save();
    ctx.globalAlpha = 0.14;
    txt(ctx, "EJEMPLO", W / 2, 700, { font: F_TITULO, size: 90, color: C.oro, align: "center", espaciado: 8 });
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

export async function rasterizar(d: DatosCert, escala = 2): Promise<HTMLCanvasElement> {
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
  const canvas = await rasterizar(d, 2);
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
  const canvas = await rasterizar(d, 2);
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
