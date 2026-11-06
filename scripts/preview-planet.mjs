/* Vista previa del planeta sin navegador.
   Uso: node --experimental-strip-types scripts/preview-planet.mjs
   Escribe /tmp/planeta.ppm (y con ImageMagick, /tmp/planeta.png). */
import { writeFileSync } from "node:fs";
import { SIZE, renderGlobe } from "../src/lib/planet.ts";

const buf = new Uint8ClampedArray(SIZE * SIZE * 4);
const frames = Number(process.argv[2] ?? 1);
const rot0 = Number(process.argv[3] ?? 0.9);

for (let f = 0; f < frames; f++) {
  renderGlobe(buf, rot0 + f * 0.5, [255, 176, 46], f * 900, [
    { lat: 8.9, lon: -79.5, color: "#ffb02e" },
    { lat: 52.3, lon: 4.9, color: "#3ee07a" },
  ]);
  // PPM P6 sobre fondo oscuro para ver la transparencia
  const out = Buffer.alloc(SIZE * SIZE * 3);
  for (let i = 0; i < SIZE * SIZE; i++) {
    const a = buf[i * 4 + 3] / 255;
    out[i * 3] = buf[i * 4] * a + 13 * (1 - a);
    out[i * 3 + 1] = buf[i * 4 + 1] * a + 11 * (1 - a);
    out[i * 3 + 2] = buf[i * 4 + 2] * a + 16 * (1 - a);
  }
  const name = `/tmp/planeta-${f}`;
  writeFileSync(`${name}.ppm`, Buffer.concat([Buffer.from(`P6\n${SIZE} ${SIZE}\n255\n`), out]));
  console.log(name);
}
