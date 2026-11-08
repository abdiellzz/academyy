import { readFileSync, statSync } from "node:fs";
import { gzipSync } from "node:zlib";

const ruta = new URL("../dist/index.html", import.meta.url);
let archivo;
try {
  archivo = readFileSync(ruta);
} catch {
  console.error("✘ Falta dist/index.html; ejecuta vite build primero.");
  process.exit(1);
}

const bytes = statSync(ruta).size;
const gzip = gzipSync(archivo).byteLength;
const maxBytes = 950_000;
const maxGzip = 315_000;
const kb = (n) => `${(n / 1000).toFixed(1)} kB`;
console.log(`Presupuesto del archivo único: ${kb(bytes)} sin comprimir · ${kb(gzip)} gzip (límites ${kb(maxBytes)} / ${kb(maxGzip)}).`);
if (bytes > maxBytes || gzip > maxGzip) {
  console.error("✘ El build superó el presupuesto. Revisa dependencias, estilos y recursos pesados.");
  process.exit(1);
}
console.log("✔ Presupuesto de tamaño del build dentro del límite.");
