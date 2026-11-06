/* ═══════════════════════════════════════════════════════════════════
   Mini Python para el laboratorio.
   Traduce un subconjunto honesto de Python a JavaScript y lo ejecuta
   con un `print` de verdad. No pretende ser CPython: soporta variables,
   números, textos, f-strings, listas, if/elif/else, for-in y range.
   ═══════════════════════════════════════════════════════════════════ */

const PRELUDIO = `
const __p = (...a) => __salida.push(a.map((v) => __texto(v)).join(" "));
const __texto = (v) => {
  if (v === true) return "True";
  if (v === false) return "False";
  if (v === null || v === undefined) return "None";
  if (Array.isArray(v)) return "[" + v.map(__texto).join(", ") + "]";
  return String(v);
};
const __range = (a, b, c) => {
  let ini = 0, fin = a, paso = 1;
  if (b !== undefined) { ini = a; fin = b; }
  if (c !== undefined) paso = c;
  const r = [];
  for (let i = ini; paso > 0 ? i < fin : i > fin; i += paso) r.push(i);
  return r;
};
const __len = (x) => x.length;
const __sum = (x) => x.reduce((a, b) => a + b, 0);
const __sorted = (x) => [...x].sort((a, b) => (a > b ? 1 : a < b ? -1 : 0));
const __list = (x) => (typeof x === "string" ? [...x] : [...x]);
const __int = (x) => Math.trunc(Number(x));
const __str = (x) => __texto(x);
const __float = (x) => Number(x);
const __idiv = (a, b) => Math.floor(a / b);
`;

function traducirLinea(linea: string): string {
  let l = linea;
  // comentarios
  l = l.replace(/#(.*)$/, "//$1");
  // literales
  l = l.replace(/\bTrue\b/g, "true").replace(/\bFalse\b/g, "false").replace(/\bNone\b/g, "null");
  l = l.replace(/\band\b/g, "&&").replace(/\bor\b/g, "||").replace(/\bnot\b/g, "!");
  // f-strings → plantillas
  l = l.replace(/\bf(["'])([\s\S]*?)\1/g, (_m, _q, cuerpo) => "`" + cuerpo.replace(/\{([^}]+)\}/g, "${$1}") + "`");
  // funciones
  l = l.replace(/\bprint\s*\(/g, "__p(");
  l = l.replace(/\blen\s*\(/g, "__len(");
  l = l.replace(/\bsum\s*\(/g, "__sum(");
  l = l.replace(/\bsorted\s*\(/g, "__sorted(");
  l = l.replace(/\bint\s*\(/g, "__int(");
  l = l.replace(/\bstr\s*\(/g, "__str(");
  l = l.replace(/\bfloat\s*\(/g, "__float(");
  l = l.replace(/\brange\s*\(/g, "__range(");
  l = l.replace(/\blist\s*\(/g, "__list(");
  // métodos de texto y listas
  l = l.replace(/\.upper\s*\(\s*\)/g, ".toUpperCase()");
  l = l.replace(/\.lower\s*\(\s*\)/g, ".toLowerCase()");
  l = l.replace(/\.strip\s*\(\s*\)/g, ".trim()");
  l = l.replace(/\.append\s*\(/g, ".push(");
  // división entera
  l = l.replace(/([\w.\]]+)\s*\/\/\s*([\w.\]]+)/g, "__idiv($1, $2)");
  return l;
}

function traducirCabecera(codigo: string): string {
  let c = codigo.replace(/:\s*$/, "");
  if (/^for\s+/.test(c)) {
    const m = c.match(/^for\s+([A-Za-z_]\w*)\s+in\s+(.+)$/);
    if (m) return `for (let ${m[1]} of ${m[2]})`;
  }
  if (/^if\s+/.test(c)) return `if (${c.replace(/^if\s+/, "")})`;
  if (/^else if\s+/.test(c)) return `else if (${c.replace(/^else if\s+/, "")})`;
  if (/^elif\s+/.test(c)) return `else if (${c.replace(/^elif\s+/, "")})`;
  if (/^else$/.test(c.trim())) return "else";
  if (/^while\s+/.test(c)) return `while (${c.replace(/^while\s+/, "")})`;
  return c.replace(/:\s*$/, "");
}

export interface ResultadoPy {
  ok: boolean;
  salida: string[];
  error?: string;
}

/** Ejecuta el subconjunto de Python soportado y devuelve lo que imprimió. */
export function ejecutarPython(fuente: string): ResultadoPy {
  const lineas = fuente.replace(/\r/g, "").split("\n");
  const sangria = (l: string) => l.length - l.trimStart().length;
  const cuerpo: string[] = [];
  const pila: number[] = [];

  for (let i = 0; i < lineas.length; i++) {
    const cruda = lineas[i];
    if (!cruda.trim()) {
      cuerpo.push("");
      continue;
    }
    const san = sangria(cruda);
    let cerrados = 0;
    while (pila.length && san < pila[pila.length - 1]) {
      cuerpo.push("}");
      pila.pop();
      cerrados++;
    }

    let texto = traducirLinea(cruda.trim());
    const siguiente = lineas.slice(i + 1).find((l) => l.trim());
    const abre = siguiente ? sangria(siguiente) > san : false;
    const esElse = /^else\s*:?$/.test(texto) || texto.startsWith("else if") || texto.startsWith("elif ");

    if (texto.startsWith("elif ")) texto = "else if " + texto.slice(5);

    if (esElse) {
      const cabecera = texto.startsWith("else if") ? `${traducirCabecera(texto)} {` : "else {";
      cuerpo.push(cerrados ? cabecera : `} ${cabecera}`);
      if (abre) pila.push(siguiente ? sangria(siguiente) : san + 4);
      continue;
    }

    if (abre) {
      cuerpo.push(`${traducirCabecera(texto)} {`);
      pila.push(sangria(siguiente!));
    } else {
      cuerpo.push(texto.replace(/:\s*$/, ""));
    }
  }
  while (pila.length) {
    cuerpo.push("}");
    pila.pop();
  }

  const codigo = `${PRELUDIO}\n${cuerpo.join("\n")}`;
  const salida: string[] = [];
  try {
    const fn = new Function("__salida", codigo);
    fn(salida);
    return { ok: true, salida };
  } catch (e) {
    return { ok: false, salida, error: `Error: ${(e as Error).message}` };
  }
}
