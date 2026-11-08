/*
 * Intérprete educativo y limitado de Python.
 * Interpreta expresiones permitidas directamente: nunca genera ni evalúa JavaScript.
 * No es CPython; cubre las construcciones enseñadas por los laboratorios.
 */

type Valor = number | string | boolean | null | Valor[];
type Token = { tipo: "numero" | "texto" | "ftexto" | "nombre" | "op" | "fin"; valor: string };

export interface ResultadoPy {
  ok: boolean;
  salida: string[];
  error?: string;
}

const MAX_CODIGO = 6000;
const MAX_LINEAS = 300;
const MAX_ITERACIONES = 1000;
const MAX_OPERACIONES = 20000;
const MAX_SALIDA = 100;

function texto(v: Valor): string {
  if (v === null) return "None";
  if (v === true) return "True";
  if (v === false) return "False";
  if (Array.isArray(v)) return `[${v.map(texto).join(", ")}]`;
  return String(v);
}

function verdad(v: Valor): boolean {
  if (v === null || v === false || v === 0 || v === "") return false;
  return true;
}

function tokensDe(fuente: string): Token[] {
  const salida: Token[] = [];
  let i = 0;
  while (i < fuente.length) {
    const c = fuente[i];
    if (/\s/.test(c)) { i++; continue; }
    if ((c === "f" || c === "F") && (fuente[i + 1] === "'" || fuente[i + 1] === '"')) {
      const quote = fuente[i + 1]; i += 2;
      let raw = "";
      while (i < fuente.length && fuente[i] !== quote) {
        if (fuente[i] === "\\" && i + 1 < fuente.length) raw += fuente[i++] + fuente[i++];
        else raw += fuente[i++];
      }
      if (fuente[i] !== quote) throw new Error("Falta cerrar una cadena f-string.");
      i++;
      salida.push({ tipo: "ftexto", valor: decodificar(raw) });
      continue;
    }
    if (c === "'" || c === '"') {
      const quote = c; i++;
      let raw = "";
      while (i < fuente.length && fuente[i] !== quote) {
        if (fuente[i] === "\\" && i + 1 < fuente.length) raw += fuente[i++] + fuente[i++];
        else raw += fuente[i++];
      }
      if (fuente[i] !== quote) throw new Error("Falta cerrar una cadena.");
      i++;
      salida.push({ tipo: "texto", valor: decodificar(raw) });
      continue;
    }
    const numero = fuente.slice(i).match(/^(?:\d+\.?\d*|\.\d+)/);
    if (numero) { salida.push({ tipo: "numero", valor: numero[0] }); i += numero[0].length; continue; }
    const nombre = fuente.slice(i).match(/^[A-Za-z_]\w*/);
    if (nombre) { salida.push({ tipo: "nombre", valor: nombre[0] }); i += nombre[0].length; continue; }
    const op = ["==", "!=", "<=", ">=", "//", "**"].find((x) => fuente.startsWith(x, i));
    if (op) { salida.push({ tipo: "op", valor: op }); i += op.length; continue; }
    if ("+-*/%<>()[],.".includes(c)) { salida.push({ tipo: "op", valor: c }); i++; continue; }
    throw new Error(`Carácter no admitido: «${c}».`);
  }
  salida.push({ tipo: "fin", valor: "" });
  return salida;
}

function decodificar(s: string): string {
  return s.replace(/\\([\\'"nrt])/g, (_m, c: string) => ({ "n": "\n", "r": "\r", "t": "\t", "\\": "\\", "'": "'", '"': '"' })[c] ?? c);
}

function misma(a: Valor, b: Valor): boolean {
  if (Array.isArray(a) && Array.isArray(b)) return a.length === b.length && a.every((v, i) => misma(v, b[i]));
  return a === b;
}

function comparar(a: Valor, b: Valor, op: string): boolean {
  if (op === "==") return misma(a, b);
  if (op === "!=") return !misma(a, b);
  if (op === "in" || op === "not in") {
    const found = Array.isArray(b) ? b.some((v) => misma(a, v)) : typeof b === "string" ? b.includes(texto(a)) : false;
    return op === "in" ? found : !found;
  }
  if (typeof a !== typeof b || (typeof a !== "number" && typeof a !== "string")) throw new Error("Compara valores del mismo tipo.");
  const left = a as number | string, right = b as number | string;
  if (op === "<") return left < right;
  if (op === ">") return left > right;
  if (op === "<=") return left <= right;
  return left >= right;
}

class Expresion {
  private i = 0;
  constructor(private ts: Token[], private vars: Map<string, Valor>, private nivel = 0) {
    if (nivel > 12) throw new Error("La expresión tiene demasiados niveles.");
  }
  private ver() { return this.ts[this.i] ?? { tipo: "fin" as const, valor: "" }; }
  private tomar() { return this.ts[this.i++]; }
  private aceptar(v: string) { if (this.ver().valor === v) { this.i++; return true; } return false; }
  leer(): Valor {
    const result = this.binaria(0);
    if (this.ver().tipo !== "fin") throw new Error(`No se pudo interpretar «${this.ver().valor}».`);
    return result;
  }
  private binaria(min: number): Valor {
    let left = this.unaria();
    while (true) {
      let op = this.ver().valor;
      if (op === "not" && this.ts[this.i + 1]?.valor === "in") op = "not in";
      const p = this.precedencia(op);
      if (p < min) break;
      this.i += op === "not in" ? 2 : 1;
      const right = this.binaria(p + 1);
      left = this.aplicar(left, right, op);
    }
    return left;
  }
  private precedencia(op: string): number {
    if (op === "or") return 1;
    if (op === "and") return 2;
    if (["==", "!=", "<", ">", "<=", ">=", "in", "not in"].includes(op)) return 3;
    if (["+", "-"].includes(op)) return 4;
    if (["*", "/", "//", "%"].includes(op)) return 5;
    if (op === "**") return 6;
    return -1;
  }
  private unaria(): Valor {
    if (this.aceptar("not")) return !verdad(this.unaria());
    if (this.aceptar("-")) { const v = this.unaria(); if (typeof v !== "number") throw new Error("El signo menos necesita un número."); return -v; }
    if (this.aceptar("+")) { const v = this.unaria(); if (typeof v !== "number") throw new Error("El signo más necesita un número."); return v; }
    return this.primaria();
  }
  private primaria(): Valor {
    let value: Valor;
    const t = this.tomar();
    if (t.tipo === "numero") value = Number(t.valor);
    else if (t.tipo === "texto") value = t.valor;
    else if (t.tipo === "ftexto") value = t.valor.replace(/\{([^{}]+)\}/g, (_m, expr: string) => texto(evaluar(expr, this.vars, this.nivel + 1)));
    else if (t.valor === "(") { value = this.binaria(0); if (!this.aceptar(")")) throw new Error("Falta cerrar el paréntesis."); }
    else if (t.valor === "[") {
      const list: Valor[] = [];
      if (!this.aceptar("]")) { do { list.push(this.binaria(0)); } while (this.aceptar(",") && this.ver().valor !== "]"); if (!this.aceptar("]")) throw new Error("Falta cerrar la lista."); }
      value = list;
    }
    else if (t.tipo === "nombre") {
      if (t.valor === "True") value = true;
      else if (t.valor === "False") value = false;
      else if (t.valor === "None") value = null;
      else if (this.aceptar("(")) {
        const args: Valor[] = [];
        if (!this.aceptar(")")) { do { args.push(this.binaria(0)); } while (this.aceptar(",") && this.ver().valor !== ")"); if (!this.aceptar(")")) throw new Error("Falta cerrar la llamada."); }
        value = builtin(t.valor, args);
      } else {
        if (!this.vars.has(t.valor)) throw new Error(`La variable «${t.valor}» aún no existe.`);
        value = this.vars.get(t.valor)!;
      }
    } else throw new Error("Se esperaba un valor.");

    while (true) {
      if (this.aceptar("[")) {
        const index = this.binaria(0);
        if (!this.aceptar("]")) throw new Error("Falta cerrar el índice.");
        if (!Array.isArray(value) && typeof value !== "string") throw new Error("Solo puedes indexar una lista o un texto.");
        if (typeof index !== "number" || !Number.isInteger(index)) throw new Error("El índice debe ser un entero.");
        const idx = index < 0 ? value.length + index : index;
        const got = value[idx];
        if (got === undefined) throw new Error("Ese índice no existe.");
        value = got as Valor;
      } else if (this.aceptar(".")) {
        const method = this.tomar();
        if (method.tipo !== "nombre" || !this.aceptar("(")) throw new Error("Ese método no está permitido.");
        const args: Valor[] = [];
        if (!this.aceptar(")")) { do { args.push(this.binaria(0)); } while (this.aceptar(",") && this.ver().valor !== ")"); if (!this.aceptar(")")) throw new Error("Falta cerrar el método."); }
        if (method.valor === "append" && Array.isArray(value) && args.length === 1) { value.push(args[0]); }
        else if (["upper", "lower", "strip"].includes(method.valor) && typeof value === "string" && !args.length) {
          value = method.valor === "upper" ? value.toUpperCase() : method.valor === "lower" ? value.toLowerCase() : value.trim();
        } else throw new Error(`El método «${method.valor}» no está disponible para este valor.`);
      } else break;
    }
    return value;
  }
  private aplicar(a: Valor, b: Valor, op: string): Valor {
    if (op === "and") return verdad(a) && verdad(b);
    if (op === "or") return verdad(a) || verdad(b);
    if (["==", "!=", "<", ">", "<=", ">=", "in", "not in"].includes(op)) return comparar(a, b, op);
    if (op === "+") {
      if (typeof a === "number" && typeof b === "number") return a + b;
      if (typeof a === "string" && typeof b === "string") return a + b;
      if (Array.isArray(a) && Array.isArray(b)) return [...a, ...b];
      throw new Error("Con + combina dos números, dos textos o dos listas.");
    }
    if (typeof a !== "number" || typeof b !== "number") throw new Error("Esta operación necesita números.");
    if ((op === "/" || op === "//" || op === "%") && b === 0) throw new Error("No se puede dividir entre cero.");
    if (op === "-") return a - b;
    if (op === "*") return a * b;
    if (op === "/") return a / b;
    if (op === "//") return Math.floor(a / b);
    if (op === "%") return a % b;
    return a ** b;
  }
}

function evaluar(source: string, vars: Map<string, Valor>, nivel = 0): Valor {
  return new Expresion(tokensDe(source), vars, nivel).leer();
}

function builtin(name: string, args: Valor[]): Valor {
  if (name === "len" && args.length === 1 && (Array.isArray(args[0]) || typeof args[0] === "string")) return args[0].length;
  if (name === "sum" && args.length === 1 && Array.isArray(args[0])) {
    if (args[0].some((x) => typeof x !== "number")) throw new Error("sum() solo suma números.");
    return (args[0] as number[]).reduce((a, b) => a + b, 0);
  }
  if (name === "sorted" && args.length === 1 && Array.isArray(args[0])) return [...args[0]].sort((a, b) => typeof a === "number" && typeof b === "number" ? a - b : texto(a).localeCompare(texto(b))) as Valor[];
  if (name === "int" && args.length === 1) { const n = Number(args[0]); if (!Number.isFinite(n)) throw new Error("int() necesita un número válido."); return Math.trunc(n); }
  if (name === "float" && args.length === 1) { const n = Number(args[0]); if (!Number.isFinite(n)) throw new Error("float() necesita un número válido."); return n; }
  if (name === "str" && args.length === 1) return texto(args[0]);
  if (name === "list" && args.length === 1) { const v = args[0]; if (Array.isArray(v)) return [...v]; if (typeof v === "string") return [...v]; throw new Error("list() necesita un texto o lista."); }
  if (name === "range" && args.length >= 1 && args.length <= 3 && args.every((x) => typeof x === "number" && Number.isInteger(x))) {
    const [a, b, c] = args as number[];
    const start = args.length === 1 ? 0 : a;
    const stop = args.length === 1 ? a : b;
    const step = args.length === 3 ? c : 1;
    if (step === 0) throw new Error("range() no puede avanzar en pasos de cero.");
    const out: number[] = [];
    for (let n = start; step > 0 ? n < stop : n > stop; n += step) { if (out.length >= MAX_ITERACIONES) throw new Error("El rango es demasiado grande."); out.push(n); }
    return out;
  }
  throw new Error(`La función «${name}» no está disponible o recibió argumentos incorrectos.`);
}

type Nodo =
  | { tipo: "print"; expr: string }
  | { tipo: "expresion"; expr: string }
  | { tipo: "pass" }
  | { tipo: "asigna"; nombre: string; op: string; expr: string }
  | { tipo: "for"; nombre: string; expr: string; cuerpo: Nodo[] }
  | { tipo: "if"; ramas: { condicion: string | null; cuerpo: Nodo[] }[] };

class Programa {
  private i = 0;
  constructor(private lineas: { sangria: number; texto: string }[]) {}
  parsear(): Nodo[] { return this.bloque(this.lineas[0]?.sangria ?? 0, 0); }
  private bloque(sangria: number, profundidad: number): Nodo[] {
    if (profundidad > 12) throw new Error("El código tiene demasiados bloques anidados.");
    const nodos: Nodo[] = [];
    while (this.i < this.lineas.length) {
      const linea = this.lineas[this.i];
      if (linea.sangria < sangria) break;
      if (linea.sangria > sangria) throw new Error(`Sangría inesperada cerca de «${linea.texto}».`);
      if (/^(elif\b|else\s*:)/.test(linea.texto)) break;
      this.i++;
      const loop = linea.texto.match(/^for\s+([A-Za-z_]\w*)\s+in\s+(.+):$/);
      if (loop) {
        const cuerpo = this.siguienteBloque(sangria, profundidad);
        nodos.push({ tipo: "for", nombre: loop[1], expr: loop[2], cuerpo });
        continue;
      }
      const cond = linea.texto.match(/^if\s+(.+):$/);
      if (cond) { nodos.push(this.parseIf(cond[1], sangria, profundidad)); continue; }
      const print = linea.texto.match(/^print\s*\((.*)\)\s*$/);
      if (print) { nodos.push({ tipo: "print", expr: print[1] }); continue; }
      if (linea.texto === "pass") { nodos.push({ tipo: "pass" }); continue; }
      if (/^[A-Za-z_]\w*\.(append|upper|lower|strip)\s*\(.*\)$/.test(linea.texto)) { nodos.push({ tipo: "expresion", expr: linea.texto }); continue; }
      const assignment = linea.texto.match(/^([A-Za-z_]\w*)\s*(\+=|-=|\*=|\/=|=)\s*(.+)$/);
      if (assignment) { nodos.push({ tipo: "asigna", nombre: assignment[1], op: assignment[2], expr: assignment[3] }); continue; }
      throw new Error(`No reconozco esta instrucción: «${linea.texto}».`);
    }
    return nodos;
  }
  private siguienteBloque(sangria: number, profundidad: number): Nodo[] {
    if (this.i >= this.lineas.length || this.lineas[this.i].sangria <= sangria) throw new Error("Añade una instrucción indentada después de for, if o else.");
    return this.bloque(this.lineas[this.i].sangria, profundidad + 1);
  }
  private parseIf(cond: string, sangria: number, profundidad: number): Nodo {
    const ramas: { condicion: string | null; cuerpo: Nodo[] }[] = [{ condicion: cond, cuerpo: this.siguienteBloque(sangria, profundidad) }];
    while (this.i < this.lineas.length && this.lineas[this.i].sangria === sangria) {
      const line = this.lineas[this.i].texto;
      const elif = line.match(/^elif\s+(.+):$/);
      if (elif) { this.i++; ramas.push({ condicion: elif[1], cuerpo: this.siguienteBloque(sangria, profundidad) }); continue; }
      if (/^else\s*:$/.test(line)) { this.i++; ramas.push({ condicion: null, cuerpo: this.siguienteBloque(sangria, profundidad) }); }
      break;
    }
    return { tipo: "if", ramas };
  }
}

function ejecutar(nodos: Nodo[], vars: Map<string, Valor>, salida: string[], pasos: { n: number }): void {
  for (const nodo of nodos) {
    pasos.n++;
    if (pasos.n > MAX_OPERACIONES) throw new Error("El reto superó el límite de operaciones.");
    if (nodo.tipo === "print") {
      if (salida.length >= MAX_SALIDA) throw new Error("La salida es demasiado larga.");
      const args = argumentosPrint(nodo.expr, vars);
      salida.push(args.map(texto).join(" "));
    } else if (nodo.tipo === "pass") {
      continue;
    } else if (nodo.tipo === "expresion") {
      evaluar(nodo.expr, vars);
    } else if (nodo.tipo === "asigna") {
      const value = evaluar(nodo.expr, vars);
      if (nodo.op === "=") vars.set(nodo.nombre, value);
      else {
        if (!vars.has(nodo.nombre)) throw new Error(`La variable «${nodo.nombre}» aún no existe.`);
        const op = nodo.op.slice(0, -1);
        vars.set(nodo.nombre, new Expresion(tokensDe(`${nodo.nombre} ${op} (${nodo.expr})`), vars).leer());
      }
    } else if (nodo.tipo === "for") {
      const iterable = evaluar(nodo.expr, vars);
      if (!Array.isArray(iterable) && typeof iterable !== "string") throw new Error("El valor después de in debe ser una lista, texto o range().");
      const items = typeof iterable === "string" ? [...iterable] : iterable;
      if (items.length > MAX_ITERACIONES) throw new Error("El bucle tiene demasiadas vueltas.");
      for (const item of items) { vars.set(nodo.nombre, item); ejecutar(nodo.cuerpo, vars, salida, pasos); }
    } else {
      for (const rama of nodo.ramas) {
        if (rama.condicion === null || verdad(evaluar(rama.condicion, vars))) { ejecutar(rama.cuerpo, vars, salida, pasos); break; }
      }
    }
  }
}

function argumentosPrint(source: string, vars: Map<string, Valor>): Valor[] {
  const ts = tokensDe(source);
  if (ts[0]?.tipo === "fin") return [];
  const args: Valor[] = [];
  let start = 0, depth = 0;
  for (let i = 0; i < ts.length; i++) {
    if (ts[i].valor === "(" || ts[i].valor === "[") depth++;
    else if (ts[i].valor === ")" || ts[i].valor === "]") depth--;
    if (ts[i].valor === "," && depth === 0) {
      args.push(evaluar(renderTokens(ts.slice(start, i)), vars)); start = i + 1;
    }
  }
  const final = renderTokens(ts.slice(start).filter((t) => t.tipo !== "fin"));
  if (final.trim()) args.push(evaluar(final, vars));
  return args;
}

function renderTokens(ts: Token[]): string {
  return ts.map((t) => t.tipo === "texto" ? JSON.stringify(t.valor) : t.tipo === "ftexto" ? `f${JSON.stringify(t.valor)}` : t.valor).join(" ");
}

/** Ejecuta un subconjunto acotado de Python, sin eval ni acceso a APIs del navegador. */
export function ejecutarPython(fuente: string): ResultadoPy {
  const salida: string[] = [];
  try {
    if (fuente.length > MAX_CODIGO) throw new Error(`El código supera el máximo de ${MAX_CODIGO} caracteres.`);
    const raw = fuente.replace(/\r/g, "").split("\n");
    if (raw.length > MAX_LINEAS) throw new Error(`El reto admite hasta ${MAX_LINEAS} líneas.`);
    const lineas = raw.flatMap((line) => {
      if (line.includes("\t")) throw new Error("Usa espacios para indentar, no tabuladores.");
      const trim = line.trim();
      if (!trim || trim.startsWith("#")) return [];
      const sangria = line.length - line.trimStart().length;
      if (sangria % 4 !== 0) throw new Error("Usa sangría de cuatro espacios.");
      return [{ sangria, texto: trim }];
    });
    if (!lineas.length) throw new Error("Escribe algo de código primero.");
    const program = new Programa(lineas).parsear();
    const vars = new Map<string, Valor>();
    ejecutar(program, vars, salida, { n: 0 });
    return { ok: true, salida };
  } catch (e) {
    return { ok: false, salida, error: `Error: ${(e as Error).message}` };
  }
}
