/* ═══════════════════════════════════════════════════════════════
   planet.ts — motor del planeta pixelado en 3D
   Genera una máscara de continentes (equirectangular), calcula su
   albedo y renderiza un frame completo en un buffer RGBA.
   No toca el DOM: así también se puede verificar desde Node
   (scripts/preview-planet.mjs).

   Cómo se ve "3D": la esfera se proyecta en ortográfica, se ilumina
   con una luz lateral (terminador), el brillo se cuantiza en 9 bandas
   con tramado de tablero (dither) y se le añade atmósfera, nubes que
   giran a otra velocidad y la luna orbitando.
   ═══════════════════════════════════════════════════════════════ */

export const SIZE = 256;
export const RADIUS = 100;
const CX = SIZE / 2;
const CY = SIZE / 2;
const MW = 256; // ancho del mapa (columnas de longitud)
const MH = 128; // alto del mapa (filas de latitud)
const TAU = Math.PI * 2;
const TILT = 0.32; // inclinación del eje
const COS_T = Math.cos(TILT);
const SIN_T = Math.sin(TILT);

/* ── 1 · Geografía: continentes aproximados con elipses ───────────
   [longitud, latitud, radioX, radioY, giro] en grados. */
type Blob = [number, number, number, number, number];

const CONTINENTES: Blob[] = [
  // Norteamérica
  [-152, 64, 11, 4.5, -18],
  [-112, 60, 20, 9, 0],
  [-80, 56, 13, 10, -12],
  [-118, 41, 9, 7.5, -8],
  [-98, 39, 13, 7.5, 0],
  [-81, 36, 8, 6.5, -18],
  [-102, 24, 8, 5, -28],
  [-86, 13, 6, 2.4, -34],
  [-80, 26, 2.2, 4.5, 0],
  [-42, 73, 10, 5.5, 0], // Groenlandia
  // Sudamérica
  [-62, -4, 13, 9, -8],
  [-46, -12, 7.5, 8.5, -8],
  [-72, -14, 4.5, 12, 8],
  [-64, -30, 6.5, 9.5, 10],
  [-69, -45, 2.8, 7, 6],
  // África
  [12, 21, 21, 9.5, 0],
  [-6, 10, 9, 7, -10],
  [26, 2, 12, 11, 0],
  [24, -22, 8.5, 10, 0],
  [44, 8, 5.5, 4.5, 0],
  [47, -20, 2, 4.5, 0], // Madagascar
  // Europa
  [-4, 40, 4.5, 3, 0],
  [10, 48, 9, 5.5, 0],
  [18, 43, 6.5, 3.5, 0],
  [17, 62, 7.5, 4.5, 0],
  [-2, 54, 2.2, 3.5, 0], // Reino Unido
  // Asia
  [42, 34, 10, 5.5, 0],
  [95, 62, 42, 11, 0],
  [70, 48, 19, 9, 0],
  [108, 33, 17, 9.5, 0],
  [78, 22, 7.5, 8.5, -10],
  [103, 14, 5.5, 5.5, 0],
  [113, -3, 12, 2.2, 0],
  [138, 38, 1.8, 5.5, 18],
  [122, 12, 2.2, 5.5, 0],
  // Oceanía
  [133, -25, 13, 7.5, 0],
  [142, -5, 4.5, 1.8, 0],
  [173, -42, 1.6, 4.5, 15],
];

const DESIERTOS: [number, number, number, number][] = [
  [-17, 56, 14, 32], // Sáhara + Arabia
  [-122, -104, 28, 40], // Sonora / suroeste de EE. UU.
  [-70, -62, -30, -18], // Atacama
  [12, 26, -28, -18], // Kalahari
  [76, 112, 36, 48], // Gobi
  [118, 146, -32, -20], // interior de Australia
];

function hash(x: number, y: number) {
  let h = (x * 374761393 + y * 668265263) | 0;
  h = (h ^ (h >>> 13)) * 1274126177;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

/* KIND: 0 = agua · 1 = tierra · 2 = hielo */
const KIND = new Uint8Array(MW * MH);
const SHALLOW = new Uint8Array(MW * MH);
const TR = new Uint8Array(MW * MH);
const TG = new Uint8Array(MW * MH);
const TB = new Uint8Array(MW * MH);
const LIGHTS = new Uint8Array(MW * MH);
const CLOUDS = new Uint8Array(MW * MH);

(function buildMask() {
  for (let y = 0; y < MH; y++) {
    const lat = 90 - ((y + 0.5) / MH) * 180;
    for (let x = 0; x < MW; x++) {
      const lon = -180 + ((x + 0.5) / MW) * 360;
      const i = y * MW + x;
      let land = false;
      for (const [blon, blat, rx, ry, rot] of CONTINENTES) {
        let dx = lon - blon;
        if (dx > 180) dx -= 360;
        if (dx < -180) dx += 360;
        const a = (rot * Math.PI) / 180;
        const u = dx / rx;
        const v = (lat - blat) / ry;
        const px = u * Math.cos(a) - v * Math.sin(a);
        const py = u * Math.sin(a) + v * Math.cos(a);
        // costas irregulares: la elipse respira con ondas de baja frecuencia
        const polar = Math.max(0.25, Math.cos((lat * Math.PI) / 180));
        const wob =
          polar *
          (0.075 * Math.sin(lon * 0.9 + lat * 0.4) +
            0.05 * Math.sin(lat * 1.7 - lon * 0.6) +
            0.035 * Math.cos(lon * 2.3 + lat * 1.1));
        if (px * px + py * py <= 1.14 + wob) {
          land = true;
          break;
        }
      }
      KIND[i] = land ? 1 : 0;
    }
  }
  // islas sueltas cerca de las costas (archipiélagos)
  for (let y = 0; y < MH; y++) {
    for (let x = 0; x < MW; x++) {
      const i = y * MW + x;
      if (KIND[i] !== 0) continue;
      if (hash(x + 17, y + 41) > 0.02) continue;
      const vecino =
        KIND[y * MW + ((x + 1) % MW)] ||
        KIND[y * MW + ((x - 1 + MW) % MW)] ||
        KIND[Math.min(MH - 1, y + 1) * MW + x] ||
        KIND[Math.max(0, y - 1) * MW + x];
      if (vecino === 1) KIND[i] = 1;
    }
  }
  // casquetes polares y Groenlandia
  for (let y = 0; y < MH; y++) {
    const lat = 90 - ((y + 0.5) / MH) * 180;
    for (let x = 0; x < MW; x++) {
      const lon = -180 + ((x + 0.5) / MW) * 360;
      const i = y * MW + x;
      if (lat < -63) KIND[i] = 2;
      else if (lon > -58 && lon < -20 && lat > 64) KIND[i] = 2;
    }
  }
  // agua somera: a menos de 2 celdas de la costa
  for (let y = 0; y < MH; y++) {
    for (let x = 0; x < MW; x++) {
      const i = y * MW + x;
      if (KIND[i] !== 0) continue;
      let costa = false;
      for (let dy = -2; dy <= 2 && !costa; dy++) {
        const yy = Math.min(MH - 1, Math.max(0, y + dy));
        for (let dx = -2; dx <= 2; dx++) {
          const xx = (x + dx + MW) % MW;
          if (KIND[yy * MW + xx] !== 0) {
            costa = true;
            break;
          }
        }
      }
      SHALLOW[i] = costa ? 1 : 0;
    }
  }
})();

(function buildAlbedo() {
  for (let y = 0; y < MH; y++) {
    const lat = 90 - ((y + 0.5) / MH) * 180;
    for (let x = 0; x < MW; x++) {
      const lon = -180 + ((x + 0.5) / MW) * 360;
      const i = y * MW + x;
      const h = hash(x + 3, y + 7);
      let r: number, g: number, b: number;
      if (KIND[i] === 2) {
        r = 214;
        g = 232;
        b = 250;
      } else if (KIND[i] === 1) {
        const desierto =
          h < 0.58 &&
          DESIERTOS.some(([x0, x1, y0, y1]) => lon >= x0 && lon <= x1 && lat >= y0 && lat <= y1);
        if (Math.abs(lat) > 62) {
          r = 132;
          g = 141;
          b = 126; // tundra
        } else if (desierto) {
          r = 188;
          g = 160;
          b = 106;
        } else if (Math.abs(lat) < 12) {
          r = h < 0.45 ? 34 : 56;
          g = h < 0.45 ? 116 : 152;
          b = h < 0.45 ? 56 : 74; // selva
        } else {
          r = h < 0.4 ? 52 : h < 0.75 ? 78 : 36;
          g = h < 0.4 ? 148 : h < 0.75 ? 182 : 116;
          b = h < 0.4 ? 70 : h < 0.75 ? 86 : 56;
        }
        LIGHTS[i] = hash(x + 91, y + 13) > 0.55 ? 255 : 0;
      } else {
        const somera = SHALLOW[i] === 1;
        r = somera ? 60 : h < 0.3 ? 30 : 22;
        g = somera ? 156 : h < 0.3 ? 114 : 94;
        b = somera ? 220 : h < 0.3 ? 190 : 172;
      }
      if (KIND[i] === 1) {
        const borde =
          KIND[y * MW + ((x + 1) % MW)] === 0 ||
          KIND[y * MW + ((x - 1 + MW) % MW)] === 0 ||
          KIND[Math.min(MH - 1, y + 1) * MW + x] === 0 ||
          KIND[Math.max(0, y - 1) * MW + x] === 0;
        if (borde) {
          r *= 0.8;
          g *= 0.82;
          b *= 0.86;
        }
      }
      TR[i] = r;
      TG[i] = g;
      TB[i] = b;
    }
  }
})();

(function buildClouds() {
  for (let y = 0; y < MH; y++) {
    const la = ((y + 0.5) / MH - 0.5) * Math.PI;
    for (let x = 0; x < MW; x++) {
      const a = (x / MW) * TAU;
      // senos con frecuencias enteras: la textura cierra sin costura
      const polar = Math.max(0.12, 1 - Math.max(0, (Math.abs(la) - 0.95) / 0.5));
      const v =
        polar *
        (Math.sin(a * 3 + 0.4) * Math.cos(la * 4 - 0.3) +
          Math.sin(a * 6 - la * 3 + 1.1) * 0.7 +
          Math.sin(la * 9 + 2.0) * 0.5 +
          Math.sin(a * 11 + la * 5) * 0.35);
      CLOUDS[y * MW + x] = v > 1.3 ? 3 : v > 0.95 ? 2 : v > 0.62 ? 1 : 0;
    }
  }
})();

/* ── 2 · Geometría precalculada ───────────────────────────────────
   La latitud, la longitud base y la luz no dependen del giro: se
   calculan una sola vez y por frame solo se hace una suma. */
const LIGHT = (() => {
  const v = [-0.54, -0.2, 0.82];
  const n = Math.hypot(v[0], v[1], v[2]);
  return [v[0] / n, v[1] / n, v[2] / n];
})();

const SHADE = [0.1, 0.16, 0.24, 0.34, 0.46, 0.6, 0.74, 0.88, 1];

const cells: { x: number; y: number; my: number; lon: number; diff: number; nz: number; dith: number }[] = [];
for (let y = -RADIUS; y <= RADIUS; y++) {
  for (let x = -RADIUS; x <= RADIUS; x++) {
    if (x * x + y * y > RADIUS * RADIUS) continue;
    const nx = x / RADIUS;
    const ny = y / RADIUS;
    const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
    // y crece hacia abajo en pantalla: se invierte para que el norte quede arriba
    const nyUp = -ny;
    const y2 = nyUp * COS_T - nz * SIN_T;
    const z2 = nyUp * SIN_T + nz * COS_T;
    const lat = Math.asin(Math.max(-1, Math.min(1, y2)));
    cells.push({
      x: CX + x,
      y: CY + y,
      // fila 0 = polo norte, fila MH-1 = polo sur
      my: Math.min(MH - 1, Math.max(0, Math.floor(((Math.PI / 2 - lat) / Math.PI) * MH))),
      lon: Math.atan2(nx, z2),
      diff: nx * LIGHT[0] + ny * LIGHT[1] + nz * LIGHT[2],
      nz,
      dith: (x + y) & 1 ? 0.05 : -0.02,
    });
  }
}

const N = cells.length;
const CELL_X = new Uint16Array(N);
const CELL_Y = new Uint16Array(N);
const CELL_OFF = new Uint32Array(N);
const CELL_MY = new Uint8Array(N);
const CELL_LON = new Float32Array(N);
const CELL_DIFF = new Float32Array(N);
const CELL_NZ = new Float32Array(N);
const CELL_DITH = new Float32Array(N);
for (let i = 0; i < N; i++) {
  const c = cells[i];
  CELL_X[i] = c.x;
  CELL_Y[i] = c.y;
  CELL_OFF[i] = (c.y * SIZE + c.x) * 4;
  CELL_MY[i] = c.my;
  CELL_LON[i] = c.lon;
  CELL_DIFF[i] = c.diff;
  CELL_NZ[i] = c.nz;
  CELL_DITH[i] = c.dith;
}

/* Atmósfera: anillos pixelados alrededor del disco. */
const atmo: { x: number; y: number; a: number }[] = [];
const ATMO_ALPHA = [112, 88, 68, 52, 40, 30, 21, 14, 9, 5];
for (let y = -RADIUS - 10; y <= RADIUS + 10; y++) {
  for (let x = -RADIUS - 10; x <= RADIUS + 10; x++) {
    const d = Math.hypot(x, y);
    if (d <= RADIUS + 0.6 || d > RADIUS + 10.6) continue;
    atmo.push({ x: CX + x, y: CY + y, a: ATMO_ALPHA[Math.min(9, Math.floor(d - RADIUS - 0.6))] });
  }
}
const ATMO_N = atmo.length;
const ATMO_X = new Uint16Array(ATMO_N);
const ATMO_Y = new Uint16Array(ATMO_N);
const ATMO_A = new Uint8Array(ATMO_N);
atmo.forEach((c, i) => {
  ATMO_X[i] = c.x;
  ATMO_Y[i] = c.y;
  ATMO_A[i] = c.a;
});

/* ── 3 · Utilidades de color ─────────────────────────────────────── */

export function hexToRgb(hex: string): [number, number, number] {
  let h = hex.replace("#", "").trim();
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  const n = parseInt(h, 16);
  if (Number.isNaN(n)) return [255, 176, 46];
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function blend(out: Uint8ClampedArray, x: number, y: number, r: number, g: number, b: number, a: number) {
  if (x < 0 || y < 0 || x >= SIZE || y >= SIZE) return;
  const o = (y * SIZE + x) * 4;
  const ea = out[o + 3];
  if (ea === 0) {
    out[o] = r;
    out[o + 1] = g;
    out[o + 2] = b;
    out[o + 3] = a;
    return;
  }
  const f = a / 255;
  out[o] += (r - out[o]) * f;
  out[o + 1] += (g - out[o + 1]) * f;
  out[o + 2] += (b - out[o + 2]) * f;
  if (a > ea) out[o + 3] = a;
}

/* Un cohete de verdad: se rasteriza rotado sobre su tangente para que
   siempre apunte hacia donde vuela, y se esconde detrás del planeta. */
function paintRocket(
  out: Uint8ClampedArray,
  cx: number,
  cy: number,
  ang: number,
  time: number,
  behind: boolean,
) {
  const cos = Math.cos(ang);
  const sin = Math.sin(ang);
  const flare = 1 + 0.22 * Math.sin(time * 0.03);
  for (let dy = -10; dy <= 10; dy++) {
    for (let dx = -10; dx <= 10; dx++) {
      const u = dx * cos + dy * sin; // eje: +u = morro
      const v = -dx * sin + dy * cos; // lateral
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 255;
      if (u >= -3 && u <= 3.2 && Math.abs(v) <= 1.15) {
        r = 232; g = 240; b = 250; // fuselaje
        if (u > 2.2) { r = 210; g = 222; b = 238; }
        if (Math.abs(v) > 0.8) { r = 190; g = 202; b = 220; }
      } else if (u > 3.2 && u <= 5.6 && Math.abs(v) <= (5.6 - u) * 1.15) {
        r = 255; g = 90; b = 106; // morro
      } else if (u >= -3.4 && u < -1.4 && Math.abs(v) <= 2.2) {
        r = 255; g = 90; b = 106; // aletas
      } else if (u >= 0.2 && u <= 1.7 && Math.abs(v) <= 0.75) {
        r = 90; g = 210; b = 255; // ventana
      } else if (u < -3.2 && u > -7.2 * flare && Math.abs(v) <= (1.3 + u * 0.16) * flare) {
        if ((dx + dy) & 1) { r = 255; g = 176; b = 46; } else { r = 255; g = 225; b = 74; }
        a = u < -5.5 ? 150 : 255;
      } else {
        continue;
      }
      const px = Math.round(cx + dx);
      const py = Math.round(cy + dy);
      if (behind) {
        const ddx = px - CX;
        const ddy = py - CY;
        if (ddx * ddx + ddy * ddy < (RADIUS + 2) * (RADIUS + 2)) continue;
      }
      blend(out, px, py, r, g, b, a);
    }
  }
}

/* Estela de píxeles detrás del cohete. */
function paintTrail(out: Uint8ClampedArray, cx: number, cy: number, ang: number, behind: boolean) {
  const cos = Math.cos(ang);
  const sin = Math.sin(ang);
  for (let i = 4; i < 15; i++) {
    const px = Math.round(cx - cos * i);
    const py = Math.round(cy - sin * i);
    if (behind) {
      const ddx = px - CX;
      const ddy = py - CY;
      if (ddx * ddx + ddy * ddy < (RADIUS + 2) * (RADIUS + 2)) continue;
    }
    const fade = 1 - (i - 4) / 11;
    blend(out, px, py, 255, 190 + 40 * fade, 120, Math.round(170 * fade));
  }
}

/* ── 4 · Proyección de un punto geográfico ───────────────────────── */

export function project(lat: number, lon: number, rot: number) {
  const la = (lat * Math.PI) / 180;
  // la textura usa 0 = 180° O; el centro del disco es la longitud «rot»
  const lo = ((lon + 180) * Math.PI) / 180 - rot;
  const nx = Math.cos(la) * Math.sin(lo);
  const wy = Math.sin(la);
  const wz = Math.cos(la) * Math.cos(lo);
  return {
    nx,
    ny: -(wy * COS_T + wz * SIN_T),
    nz: -wy * SIN_T + wz * COS_T,
  };
}

export interface Marker {
  lat: number;
  lon: number;
  color: string;
  /** true = punto pequeño sin haz (por ejemplo, «estás acá»). */
  dot?: boolean;
}

/* ── 5 · Frame completo ─────────────────────────────────────────── */

export function renderGlobe(
  out: Uint8ClampedArray,
  rot: number,
  accent: [number, number, number],
  time: number,
  markers: Marker[] = [],
) {
  out.fill(0);
  const [ar, ag, ab] = accent;
  const atmoR = (ar * 0.28 + 108 * 0.72) | 0;
  const atmoG = (ag * 0.28 + 208 * 0.72) | 0;
  const atmoB = (ab * 0.28 + 255 * 0.72) | 0;

  // atmósfera exterior
  for (let i = 0; i < ATMO_N; i++) {
    const o = (ATMO_Y[i] * SIZE + ATMO_X[i]) * 4;
    out[o] = atmoR;
    out[o + 1] = atmoG;
    out[o + 2] = atmoB;
    out[o + 3] = ATMO_A[i];
  }

  const frame = (time * 0.012) | 0;
  const k = MW / TAU;

  // esfera. Cerca del limbo se promedian varias longitudes: si no, las
  // columnas del mapa se juntan y salen rayos (moiré) en los polos.
  for (let i = 0; i < N; i++) {
    const lon = CELL_LON[i] + rot;
    const nz = CELL_NZ[i];
    const ns = nz > 0.45 ? 1 : 3;
    const delta = ns === 1 ? 0 : (1 - nz) * 0.1;
    let r = 0;
    let g = 0;
    let b = 0;
    let cl = 0;
    let idx = 0;
    for (let s = 0; s < ns; s++) {
      const lo = lon + (s - 1) * delta;
      let mx = (lo * k) % MW;
      if (mx < 0) mx += MW;
      const j = CELL_MY[i] * MW + (mx | 0);
      r += TR[j];
      g += TG[j];
      b += TB[j];
      if (s === 1) idx = j;
      let cLon = lo * 1.9 + time * 0.00006;
      let cmx = (cLon * k) % MW;
      if (cmx < 0) cmx += MW;
      cl += CLOUDS[CELL_MY[i] * MW + (cmx | 0)];
    }
    if (ns > 1) {
      r /= ns;
      g /= ns;
      b /= ns;
      cl /= ns;
    }

    const kind = KIND[idx];
    const diff = CELL_DIFF[i];
    const lvl = diff + CELL_DITH[i];
    const sh = SHADE[lvl <= 0 ? 0 : lvl >= 1 ? 8 : (lvl * 8) | 0];
    r *= sh;
    g *= sh;
    b *= sh;

    if (kind === 1 && LIGHTS[idx] && diff < 0.06 && (idx * 7 + frame) % 11 === 0) {
      // luces de ciudades del lado noche
      r = 255;
      g = 208;
      b = 122;
    } else if (kind === 0 && diff > 0.9) {
      // el mar del lado del sol refleja: se nota la curvatura
      const q = Math.min(1, (diff - 0.9) / 0.09) * 0.55 + (CELL_DITH[i] > 0 ? 0.12 : 0);
      r += (150 - r) * q;
      g += (214 - g) * q;
      b += (248 - b) * q;
    } else {
      r += 4;
      g += 6;
      b += 14;
    }
    if (kind === 2) {
      r += 26;
      g += 34;
      b += 48;
    }

    // brillo del limbo con el color del mundo elegido
    if (nz < 0.22) {
      const t = (0.22 - nz) / 0.22;
      const q = t * t * 0.55;
      r += atmoR * q;
      g += atmoG * q;
      b += atmoB * q;
    }

    // nubes girando un poco más rápido que el suelo
    if (cl > 0.07) {
      const lit = Math.max(0, diff);
      const a = Math.min(0.55, cl * 0.14) * (0.5 + 0.65 * lit);
      const cw = Math.min(255, 252 * (0.42 + 0.66 * lit) + 8);
      r += (cw - r) * a;
      g += (cw - g) * a;
      b += (cw - b) * a;
    }

    const o = CELL_OFF[i];
    out[o] = r;
    out[o + 1] = g;
    out[o + 2] = b;
    out[o + 3] = 255;
  }

  // luna orbitando (pasa por detrás del planeta)
  const ang = time * 0.00022;
  const moonX = Math.round(CX + Math.cos(ang) * 118);
  const moonY = Math.round(CY + Math.sin(ang) * 40 - 10);
  const behind = Math.sin(ang) < 0;
  for (let dy = -5; dy <= 5; dy++) {
    for (let dx = -5; dx <= 5; dx++) {
      if (dx * dx + dy * dy > 26) continue;
      const px = moonX + dx;
      const py = moonY + dy;
      if (behind) {
        const ddx = px - CX;
        const ddy = py - CY;
        if (ddx * ddx + ddy * ddy < (RADIUS + 3) * (RADIUS + 3)) continue;
      }
      const crater = (dx === -1 && dy === -2) || (dx === 2 && dy === 1) || (dx === -2 && dy === 2);
      const lit = Math.min(1, Math.max(0.3, 0.55 + (-dx * 0.55 - dy * 0.5) / 9));
      const v = 226 * lit * (crater ? 0.72 : 1);
      blend(out, px, py, v, v * 0.99, v * 0.96, 255);
    }
  }

  // cohete dando la vuelta al planeta
  {
    const a = time * 0.00028 + 1.1;
    const rx = 116;
    const ry = 42;
    const rcx = CX + Math.cos(a) * rx;
    const rcy = CY + Math.sin(a) * ry - 16;
    const ang = Math.atan2(Math.cos(a) * ry, -Math.sin(a) * rx);
    const behind = Math.sin(a) < 0;
    paintTrail(out, rcx, rcy, ang, behind);
    paintRocket(out, rcx, rcy, ang, time, behind);
  }

  // marcadores: haz, núcleo y anillo pulsante
  markers.forEach((m, mi) => {
    const p = project(m.lat, m.lon, rot);
    if (p.nz <= 0.1) return;
    const px = Math.round(CX + p.nx * RADIUS);
    const py = Math.round(CY + p.ny * RADIUS);
    const [mr, mg, mb] = hexToRgb(m.color);
    if (m.dot) {
      blend(out, px, py, 255, 255, 255, 255);
      blend(out, px + 1, py, mr, mg, mb, 210);
      blend(out, px, py - 1, mr, mg, mb, 160);
      return;
    }
    for (let d = 1; d <= 8; d++) blend(out, px, py - d, mr, mg, mb, 210 - d * 22);
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const core = dx === 0 && dy === 0;
        blend(out, px + dx, py + dy, core ? 255 : mr, core ? 255 : mg, core ? 255 : mb, 255);
      }
    }
    const ph = ((time * 0.0022 + mi * 1.7) % 1 + 1) % 1;
    const rad = 3 + ph * 9;
    for (let s = 0; s < 32; s++) {
      const a = (s / 32) * TAU;
      blend(
        out,
        Math.round(px + Math.cos(a) * rad),
        Math.round(py + Math.sin(a) * rad),
        mr,
        mg,
        mb,
        Math.round(190 * (1 - ph)),
      );
    }
  });
}

/* ═══════════════════════════════════════════════════════════════════════
   PIXELADO · Del render suave al sprite de bloques.
   Se agrupa cada bloque de `pix`×`pix`, se aplica luz esférica + rim light,
   se cuantiza a una paleta fija de 15 colores y se dibuja contorno + halo.
   El resultado es la Tierra como sprite de pixel art, no una esfera 3D.
   ═══════════════════════════════════════════════════════════════════════ */

const PALETA_TIERRA: [number, number, number][] = [
  [8, 18, 34], // 0 contorno
  [16, 46, 78], // 1 océano profundo
  [28, 86, 136], // 2 océano
  [48, 126, 178], // 3 océano claro
  [88, 170, 210], // 4 costa
  [30, 92, 52], // 5 selva oscura
  [56, 134, 68], // 6 verde
  [106, 178, 86], // 7 verde claro
  [152, 120, 64], // 8 desierto
  [208, 172, 102], // 9 arena
  [232, 246, 255], // 10 hielo
  [162, 210, 234], // 11 hielo sombra
  [244, 250, 255], // 12 nube
  [186, 208, 228], // 13 nube sombra
  [30, 62, 96], // 14 halo
];

function colorMasCercano(r: number, g: number, b: number): number {
  let mejor = 0;
  let dist = Infinity;
  for (let i = 0; i < PALETA_TIERRA.length; i++) {
    const [R, G, B] = PALETA_TIERRA[i];
    const d = (r - R) ** 2 * 0.3 + (g - G) ** 2 * 0.5 + (b - B) ** 2 * 0.2;
    if (d < dist) {
      dist = d;
      mejor = i;
    }
  }
  return mejor;
}

/**
 * Convierte el buffer RGBA de `renderGlobe` (SIZE×SIZE) en un sprite de
 * bloques de `pix` píxeles dentro de `dst` (low×low RGBA).
 */
/* Buffers reutilizados entre frames: evita reservar memoria 30 veces por
   segundo y mantiene el giro suave incluso en móviles modestos. */
let bufIdx: Int16Array | null = null;
let bufSalida: Int16Array | null = null;

export function pixelarTierra(src: Uint8ClampedArray, pix: number, dst: Uint8ClampedArray, low = SIZE / pix): void {
  const n = low * low;
  if (!bufIdx || bufIdx.length !== n) {
    bufIdx = new Int16Array(n);
    bufSalida = new Int16Array(n);
  }
  const idx = bufIdx.fill(-1);
  const salida = bufSalida!;
  const centro = (low - 1) / 2;
  const radio = low / 2;

  for (let y = 0; y < low; y++) {
    for (let x = 0; x < low; x++) {
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;
      for (let dy = 0; dy < pix; dy++) {
        const fila = (y * pix + dy) * SIZE;
        for (let dx = 0; dx < pix; dx++) {
          const si = (fila + x * pix + dx) * 4;
          const al = src[si + 3];
          r += src[si] * al;
          g += src[si + 1] * al;
          b += src[si + 2] * al;
          a += al;
        }
      }
      if (a / (pix * pix) < 0.5 * 255) continue;

      // luz esférica: el sol viene de arriba a la izquierda
      const nx = (x - centro) / radio;
      const ny = (y - centro) / radio;
      const nz = Math.sqrt(Math.max(0.001, 1 - Math.min(1, nx * nx + ny * ny)));
      const dot = Math.max(0, nx * -0.45 + ny * -0.5 + nz * 0.74);
      const luz = 0.62 + 0.55 * dot;
      const rim = nz < 0.3 ? 0.35 * (1 - nz / 0.3) : 0;
      const mezcla = (v: number, objetivo: number) => v * (1 - rim) + objetivo * rim;

      idx[y * low + x] = colorMasCercano(
        Math.min(255, mezcla((r / a) * luz, 150)),
        Math.min(255, mezcla((g / a) * luz, 205)),
        Math.min(255, mezcla((b / a) * luz, 240)),
      );
    }
  }

  const opaco = (xx: number, yy: number) => xx >= 0 && yy >= 0 && xx < low && yy < low && idx[yy * low + xx] >= 0;
  salida.set(idx);

  for (let y = 0; y < low; y++) {
    for (let x = 0; x < low; x++) {
      const i = y * low + x;
      if (idx[i] < 0) continue;
      if (!(opaco(x - 1, y) && opaco(x + 1, y) && opaco(x, y - 1) && opaco(x, y + 1))) salida[i] = 0;
    }
  }
  for (let y = 0; y < low; y++) {
    for (let x = 0; x < low; x++) {
      const i = y * low + x;
      if (idx[i] >= 0) continue;
      if (opaco(x - 1, y) || opaco(x + 1, y) || opaco(x, y - 1) || opaco(x, y + 1)) salida[i] = 14;
    }
  }

  for (let i = 0; i < low * low; i++) {
    const c = salida[i] < 0 ? null : PALETA_TIERRA[salida[i]];
    const di = i * 4;
    if (!c) {
      dst[di] = 0;
      dst[di + 1] = 0;
      dst[di + 2] = 0;
      dst[di + 3] = 0;
    } else {
      dst[di] = c[0];
      dst[di + 1] = c[1];
      dst[di + 2] = c[2];
      dst[di + 3] = 255;
    }
  }
}
