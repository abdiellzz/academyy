import { useEffect, useMemo, useRef, useState } from "react";
import { PixelIcon } from "../PixelArt";
import { Term } from "../ui";
import { WidgetShell } from "./CommonWidgets";
import { modPow } from "../../lib/crypto";
import { cn } from "../../utils/cn";

/* ═══════════════════════════════════════════════════════════════════════
   Laboratorio de criptografía · simuladores con cripto de verdad
   Todo corre en tu navegador: WebCrypto (SHA-256, HMAC, PBKDF2, AES-GCM)
   y aritmética modular escrita a mano para RSA.
   ═══════════════════════════════════════════════════════════════════════ */

const enc = new TextEncoder();
const hex = (u: Uint8Array) => [...u].map((x) => x.toString(16).padStart(2, "0")).join("");
const bits8 = (n: number) => n.toString(2).padStart(8, "0");
const AB = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function Pista({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-3 border-l-4 border-[var(--violet)] bg-[#1b1233] p-2.5 text-[14px] leading-relaxed text-[var(--text-2)]">
      {children}
    </p>
  );
}

/* ───────────────────────── 1 · XOR a nivel de bit ───────────────────────── */

export function XorLab() {
  const [txt, setTxt] = useState("HOLA");
  const [key, setKey] = useState("KEY");
  const [flip, setFlip] = useState<number | null>(null);

  const claro = useMemo(() => [...enc.encode(txt || " ")].slice(0, 10), [txt]);
  const clave = useMemo(() => {
    const b = [...enc.encode(key || "A")];
    return b.length ? b : [65];
  }, [key]);

  const cifrado = claro.map((b, i) => b ^ clave[i % clave.length]);
  const alterado = cifrado.map((b, i) => (i === flip ? b ^ 0b00010000 : b));
  const recuperado = alterado.map((b, i) => b ^ clave[i % clave.length]);
  const alteradoReal = flip !== null;
  const char = (n: number) => (n >= 32 && n < 127 ? String.fromCharCode(n) : "·");

  return (
    <WidgetShell title="XOR bit a bit — el ladrillo de todo cifrado" badge={<span className="chip !text-[9px]">10 bytes</span>}>
      <div className="grid gap-2 sm:grid-cols-2">
        <label>
          <span className="label">Mensaje claro</span>
          <input className="field mono mt-1" value={txt} maxLength={10} onChange={(e) => setTxt(e.target.value)} />
        </label>
        <label>
          <span className="label">Clave</span>
          <input className="field mono mt-1" value={key} maxLength={5} onChange={(e) => setKey(e.target.value)} />
        </label>
      </div>

      <div className="mt-3 overflow-x-auto border-2 border-black bg-[var(--bg-sunken)]">
        <table className="w-full min-w-[430px] border-collapse text-center" style={{ fontFamily: "var(--font-mono)", fontSize: 15 }}>
          <thead>
            <tr className="bg-[var(--surface-3)]">
              {["byte", "claro", "clave", "XOR", "resultado"].map((h) => (
                <th key={h} className="label border border-black px-1 py-1">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {claro.map((b, i) => {
              const k = clave[i % clave.length];
              const c2 = alterado[i];
              const cambiado = alteradoReal && i === flip;
              return (
                <tr key={i} className={cn(cambiado && "bg-[#3a2a08]")}>
                  <td className="border border-black px-1 text-[var(--text-3)]">{i}</td>
                  <td className="border border-black px-1">{bits8(b)} <span className="text-[var(--accent)]">{char(b)}</span></td>
                  <td className="border border-black px-1 text-[var(--cyan)]">{bits8(k)}</td>
                  <td className="border border-black px-1 text-[var(--violet)]">{bits8(c2)}</td>
                  <td className={cn("border border-black px-1", cambiado ? "text-[var(--accent)]" : "text-[var(--green)]")}>{char(c2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="label">Torcer 1 bit (bit 5) del byte</span>
        {cifrado.slice(0, 5).map((_, i) => (
          <button key={i} className={cn("btn btn-xs", flip === i && "btn-primary")} onClick={() => setFlip(flip === i ? null : i)}>
            {i}
          </button>
        ))}
      </div>

      <Term title="mensaje recuperado">
        {recuperado.map((b, i) => (
          <span key={i} style={{ color: flip === i ? "var(--accent)" : "var(--green)" }}>{char(b)}</span>
        ))}
        {alteradoReal ? "   ← un solo bit torcido cambia una letra" : ""}
      </Term>

      <Pista>
        XOR es la operación <b>a XOR b XOR b = a</b>, por eso sirve para cifrar y descifrar con la misma clave.
        Fíjate en dos cosas: la clave se <b>repite</b> cuando el mensaje es más largo que ella, y al torcer
        un bit del cifrado el claro cambia en ese mismo bit. Lo primero es lo que rompe los cifrados
        caseros (es un César disfrazado de binario); lo segundo es lo que obliga a añadir un <b>MAC</b>:
        cifrar sin comprobar integridad deja que te alteren el mensaje sin enterarte.
      </Pista>
    </WidgetShell>
  );
}

/* ───────────────────────── 2 · RSA de juguete, paso a paso ─────────────── */

const PRIMOS = [7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];

function mcd(a: number, b: number): number {
  return b === 0 ? a : mcd(b, a % b);
}
function inverso(e: number, phi: number): number | null {
  for (let d = 1; d < phi; d++) if ((e * d) % phi === 1) return d;
  return null;
}

export function RsaLab() {
  const [p, setP] = useState(61);
  const [q, setQ] = useState(53);
  const [e, setE] = useState(17);
  const [msg, setMsg] = useState("H");
  const n = p * q;
  const phi = (p - 1) * (q - 1);
  const valido = mcd(e, phi) === 1 && p !== q;
  const d = valido ? inverso(e, phi) : null;
  const m = ((msg.toUpperCase().charCodeAt(0) || 65) - 65 + 1) % n;
  const c = modPow(m, e, n);
  const descifrado = d ? modPow(c, d, n) : 0;
  const conPublica = modPow(c, e, n); // intento equivocado: usar la pública para descifrar
  const firma = d ? modPow(m, d, n) : 0;
  const verifica = modPow(firma, e, n) === m;

  return (
    <WidgetShell title="RSA de verdad (con números que caben en la cabeza)" badge={<span className="chip !text-[9px]">n = {n}</span>}>
      <div className="grid gap-2 sm:grid-cols-4">
        <label>
          <span className="label">primo p</span>
          <select className="field mono mt-1" value={p} onChange={(ev) => setP(+ev.target.value)}>
            {PRIMOS.map((x) => <option key={x} value={x}>{x}</option>)}
          </select>
        </label>
        <label>
          <span className="label">primo q</span>
          <select className="field mono mt-1" value={q} onChange={(ev) => setQ(+ev.target.value)}>
            {PRIMOS.map((x) => <option key={x} value={x}>{x}</option>)}
          </select>
        </label>
        <label>
          <span className="label">exponente e</span>
          <select className="field mono mt-1" value={e} onChange={(ev) => setE(+ev.target.value)}>
            {[3, 17, 37, 65537].map((x) => <option key={x} value={x}>{x}</option>)}
          </select>
        </label>
        <label>
          <span className="label">letra a cifrar</span>
          <input className="field mono mt-1" maxLength={1} value={msg} onChange={(ev) => setMsg(ev.target.value)} />
        </label>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <Term title="cuentas">
          {`n = p·q        = ${p}·${q} = ${n}\nφ(n) = (p-1)(q-1) = ${phi}\ne = ${e}   (pública)\nd = ${d ?? "—"}   (privada, porque e·d ≡ 1 mod φ)`}
        </Term>
        <Term title="cifrar / descifrar">
          {`m = ${m}   (letra "${String.fromCharCode(64 + m)}" → número)\nc = m^e mod n = ${c}\nm' = c^d mod n = ${descifrado}\ncon la PÚBLICA sale: ${conPublica} ${conPublica === m ? "" : "← no sirve"}`}
        </Term>
      </div>

      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        <div className="border-2 border-black bg-[#16301f] p-2">
          <p className="label !text-[var(--green)]">Clave pública (n, e)</p>
          <p className="mono text-[18px]">({n}, {e})</p>
          <p className="text-[13px] text-[var(--text-2)]">Se la das a todo el mundo: solo sirve para cifrar y verificar.</p>
        </div>
        <div className="border-2 border-black bg-[#2a1016] p-2">
          <p className="label !text-[var(--red)]">Clave privada (n, d)</p>
          <p className="mono text-[18px]">({n}, {d ?? "—"})</p>
          <p className="text-[13px] text-[var(--text-2)]">Nunca sale de tu máquina: descifra y firma.</p>
        </div>
      </div>

      <div className="mt-2 border-2 border-black bg-[var(--bg-sunken)] p-2">
        <p className="label">Firmar en vez de cifrar</p>
        <p className="mono mt-1 text-[15px]">
          firma = m^d mod n = <b className="text-[var(--accent)]">{firma}</b> · verificar: firma^e mod n = {modPow(firma, e, n)}{" "}
          {verifica ? <span className="text-[var(--green)]">✔ válida</span> : <span className="text-[var(--red)]">✘</span>}
        </p>
      </div>

      <Pista>
        Cifrar usa la <b>pública</b>, descifrar la <b>privada</b>. Firmar es al revés: firmas con la privada y
        cualquiera verifica con la pública. La seguridad no viene de esconder el método, viene de que
        <b> factorizar n</b> en p·q es facilísimo con 2 cifras e imposible con 300. Aquí n tiene 4 cifras:
        con una calculadora lo rompes en un segundo, y esa es justo la lección.
      </Pista>
    </WidgetShell>
  );
}

/* ───────────────────────── 3 · Firma con HMAC-SHA256 real ──────────────── */

async function hmacHex(clave: string, mensaje: string): Promise<string> {
  try {
    const k = await crypto.subtle.importKey("raw", enc.encode(clave), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    return hex(new Uint8Array(await crypto.subtle.sign("HMAC", k, enc.encode(mensaje))));
  } catch {
    return "(WebCrypto no disponible)";
  }
}

export function FirmaLab() {
  const [clave, setClave] = useState("clave-del-banco");
  const [msg, setMsg] = useState("transferir 10 a maria");
  const [alterado, setAlterado] = useState<string | null>(null);
  const [firma, setFirma] = useState("");
  const [firmaAlt, setFirmaAlt] = useState("");

  useEffect(() => {
    let vivo = true;
    hmacHex(clave, msg).then((f) => vivo && setFirma(f));
    if (alterado !== null) hmacHex(clave, alterado).then((f) => vivo && setFirmaAlt(f));
    else setFirmaAlt("");
    return () => {
      vivo = false;
    };
  }, [clave, msg, alterado]);

  const valida = alterado === null || alterado === msg;
  const mismoTamano = alterado === null || alterado.length === msg.length;

  return (
    <WidgetShell title="Firma digital con HMAC-SHA256 (de verdad)" badge={<span className="chip !text-[9px] !text-[var(--green)]">WebCrypto</span>}>
      <div className="grid gap-2 sm:grid-cols-2">
        <label>
          <span className="label">Clave secreta compartida</span>
          <input className="field mono mt-1" value={clave} onChange={(e) => setClave(e.target.value)} />
        </label>
        <label>
          <span className="label">Mensaje que viaja</span>
          <input className="field mono mt-1" value={msg} onChange={(e) => { setMsg(e.target.value); setAlterado(null); }} />
        </label>
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        <button className="btn btn-sm" onClick={() => setAlterado(msg.includes("10") ? msg.replace("10", "9999") : msg.replace(/maria/i, "atacante") === msg ? msg + "!" : msg.replace(/maria/i, "atacante"))}>
          Alterar el mensaje en el camino
        </button>
        <button className="btn btn-sm" onClick={() => setAlterado(null)}>Restaurar</button>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <Term title="firma del original">{firma || "…"}</Term>
        <Term title="firma de lo recibido">{(alterado !== null ? firmaAlt : firma) || "…"}</Term>
      </div>

      <div className={cn("mt-3 border-2 border-black p-2", valida ? "bg-[#16301f]" : "bg-[#3a1418]")}>
        <p className="label">verificación</p>
        <p className="mt-1 font-bold" style={{ color: valida ? "var(--green)" : "var(--red)" }}>
          {valida ? "✔ Firma válida: el mensaje llegó intacto." : "✘ Firma inválida: alguien tocó el mensaje."}
        </p>
        {alterado !== null && (
          <p className="mono mt-1 text-[14px] text-[var(--text-2)]">
            recibido: “{alterado}” {mismoTamano ? "(misma longitud, 1 cambio)" : ""}
          </p>
        )}
      </div>

      <Pista>
        Un hash solo no basta: si el atacante cambia el mensaje, recalcula el hash y listo. La firma
        mezcla el mensaje con una <b>clave que el atacante no tiene</b>. Cambia una letra y mira cómo
        cambian los 64 caracteres de la firma: eso es el <b>efecto avalancha</b>. En la vida real
        (certificados, apps, actualizaciones) se usa RSA o Ed25519, donde firmas con tu clave privada
        y cualquiera verifica con tu pública.
      </Pista>
    </WidgetShell>
  );
}

/* ───────────────────────── 4 · Rompe un cifrado por frecuencia ──────────── */

const FREC_ES: Record<string, number> = {
  a: 12.2, b: 1.4, c: 4.6, d: 5.9, e: 13.7, f: 0.7, g: 1.0, h: 0.7, i: 6.2, j: 0.4,
  k: 0.0, l: 4.9, m: 3.2, n: 6.7, o: 8.7, p: 2.5, q: 0.9, r: 6.9, s: 7.9, t: 4.6,
  u: 3.9, v: 0.9, w: 0.0, x: 0.2, y: 1.0, z: 0.5,
};
const MUESTRA = "LA CIBERSEGURIDAD NO ES UN PRODUCTO QUE SE COMPRA SINO UNA PRACTICA QUE SE MANTIENE CADA DIA EN CADA EQUIPO Y EN CADA PERSONA";
const CIFRADO_EJEMPLO = MUESTRA.replace(/[A-Z]/g, (c) => String.fromCharCode(((c.charCodeAt(0) - 65 + 7) % 26) + 65));

function descifrarCesar(txt: string, k: number) {
  return txt.replace(/[A-Z]/g, (c) => AB[(((c.charCodeAt(0) - 65 - k) % 26) + 26) % 26]);
}

export function FrecuenciaLab() {
  const [cifrado, setCifrado] = useState(CIFRADO_EJEMPLO);
  const [roto, setRoto] = useState<number | null>(null);

  const letras = useMemo(() => cifrado.toUpperCase().replace(/[^A-ZÑ]/g, ""), [cifrado]);
  const conteo = useMemo(() => {
    const m = new Map<string, number>();
    for (const c of letras) m.set(c, (m.get(c) ?? 0) + 1);
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [letras]);

  const ranking = useMemo(() => {
    const total = letras.length || 1;
    return Array.from({ length: 26 }, (_, k) => {
      const texto = descifrarCesar(cifrado, k);
      const cuenta = new Map<string, number>();
      for (const c of texto.toUpperCase().replace(/[^A-Z]/g, "")) cuenta.set(c, (cuenta.get(c) ?? 0) + 1);
      let score = 0;
      for (const [c, n] of cuenta) score += (FREC_ES[c.toLowerCase()] ?? 0) * (n / total);
      return { k, score, texto };
    }).sort((a, b) => b.score - a.score);
  }, [cifrado, letras.length]);

  const ioc = useMemo(() => {
    const n = letras.length;
    if (n < 2) return 0;
    const suma = conteo.reduce((acc, [, c]) => acc + c * (c - 1), 0);
    return suma / (n * (n - 1));
  }, [conteo, letras.length]);

  const max = conteo[0]?.[1] ?? 1;

  return (
    <WidgetShell title="Rompe el cifrado con estadística" badge={<span className="chip !text-[9px]">criptoanálisis</span>}>
      <label>
        <span className="label">Mensaje cifrado (César con desplazamiento desconocido)</span>
        <textarea className="field mono mt-1 min-h-[84px]" value={cifrado} onChange={(e) => { setCifrado(e.target.value); setRoto(null); }} />
      </label>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="border-2 border-black bg-[var(--bg-sunken)] p-2">
          <p className="label">Frecuencia de letras</p>
          <div className="mt-1 space-y-[3px]">
            {conteo.slice(0, 8).map(([c, n]) => (
              <div key={c} className="flex items-center gap-2">
                <span className="mono w-4 text-[var(--accent)]">{c}</span>
                <div className="h-3 flex-1 border border-black bg-[var(--surface-3)]">
                  <div className="h-full bg-[var(--violet)]" style={{ width: `${(n / max) * 100}%` }} />
                </div>
                <span className="mono w-6 text-right text-[13px] text-[var(--text-3)]">{n}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="border-2 border-black bg-[var(--bg-sunken)] p-2">
          <p className="label">Índice de coincidencia</p>
          <p className="mono mt-1 text-[26px] text-[var(--cyan)]">{ioc.toFixed(3)}</p>
          <p className="mt-1 text-[13px] leading-snug text-[var(--text-2)]">
            Español ≈ 0,077 · texto aleatorio ≈ 0,038. Si se parece a 0,077, el texto está en un idioma
            real: la estadística tiene de dónde agarrarse.
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button className="btn btn-primary btn-sm" onClick={() => setRoto(ranking[0].k)}>
          <PixelIcon name="pickaxe" size={12} /> Romper automáticamente
        </button>
        {roto !== null && <span className="chip !text-[var(--green)]">desplazamiento = {roto}</span>}
      </div>

      <Term title="texto recuperado">
        {roto !== null ? descifrarCesar(cifrado, roto) : descifrarCesar(cifrado, ranking[0].k)}
      </Term>

      <div className="mt-2 space-y-1">
        <p className="label">Los 3 candidatos más probables</p>
        {ranking.slice(0, 3).map((r, i) => (
          <button
            key={r.k}
            onClick={() => setRoto(r.k)}
            className={cn("block w-full border-2 border-black p-2 text-left", i === 0 ? "bg-[#16301f]" : "bg-[var(--surface-2)] hover:bg-[var(--surface-3)]")}
          >
            <span className="mono text-[13px] text-[var(--accent)]">k={r.k}</span>{" "}
            <span className="mono text-[14px] text-[var(--text-2)]">{r.texto.slice(0, 52)}…</span>
          </button>
        ))}
      </div>

      <Pista>
        En español la <b>E</b> aparece ~13,7% de las veces, la <b>A</b> ~12,2%. El cifrado César no cambia
        el orden de las letras: solo las desplaza, así que la letra más común del cifrado es casi siempre
        la E. Probando 26 desplazamientos y quedándote con el que deja un texto "en español" aciertas
        siempre. Esto es criptoanálisis: no se rompe el algoritmo, se explota la estructura del mensaje.
        Por eso los cifrados modernos mezclan el texto hasta que la estadística no dice nada.
      </Pista>
    </WidgetShell>
  );
}

/* ───────────────────────── 5 · KDF: PBKDF2 con sal ─────────────────────── */

async function pbkdf2(pass: string, salt: Uint8Array, iter: number): Promise<string> {
  try {
    const k = await crypto.subtle.importKey("raw", enc.encode(pass), "PBKDF2", false, ["deriveBits"]);
    const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt: salt as unknown as BufferSource, iterations: iter, hash: "SHA-256" }, k, 256);
    return hex(new Uint8Array(bits));
  } catch {
    return "(WebCrypto no disponible)";
  }
}

const salAleatoria = () => hex(crypto.getRandomValues(new Uint8Array(8)));

export function KdfLab() {
  const [pass, setPass] = useState("panama2026");
  const [sal, setSal] = useState(salAleatoria);
  const [iter, setIter] = useState(100000);
  const [res, setRes] = useState<{ clave: string; ms: number } | null>(null);
  const [res2, setRes2] = useState<{ clave: string; ms: number } | null>(null);
  const [cargando, setCargando] = useState(false);

  async function derivar() {
    setCargando(true);
    const t0 = performance.now();
    const clave = await pbkdf2(pass, enc.encode(sal), iter);
    setRes({ clave, ms: Math.round(performance.now() - t0) });
    const otra = await pbkdf2(pass, enc.encode("sal-completamente-distinta"), iter);
    setRes2({ clave: otra, ms: 0 });
    setCargando(false);
  }

  const intentos = 1e9; // un atacante con GPU prueba ~1000 millones de claves por segundo contra un hash simple
  const ms = res?.ms ?? 0;
  const anios = ms > 0 ? (intentos * (ms / 1000)) / 31536000 : 0;

  return (
    <WidgetShell title="PBKDF2: cómo se guarda una contraseña" badge={<span className="chip !text-[9px] !text-[var(--green)]">WebCrypto</span>}>
      <div className="grid gap-2 sm:grid-cols-3">
        <label className="sm:col-span-1">
          <span className="label">Contraseña</span>
          <input className="field mono mt-1" value={pass} onChange={(e) => setPass(e.target.value)} />
        </label>
        <label>
          <span className="label">Sal (aleatoria)</span>
          <input className="field mono mt-1" value={sal} onChange={(e) => setSal(e.target.value)} />
        </label>
        <label>
          <span className="label">Iteraciones</span>
          <select className="field mono mt-1" value={iter} onChange={(e) => setIter(+e.target.value)}>
            {[1000, 10000, 100000, 300000].map((x) => <option key={x} value={x}>{x.toLocaleString("es")}</option>)}
          </select>
        </label>
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        <button className="btn btn-primary btn-sm" onClick={derivar} disabled={cargando}>
          {cargando ? "Derivando…" : "Derivar clave"}
        </button>
        <button className="btn btn-sm" onClick={() => { setSal(salAleatoria()); setRes(null); setRes2(null); }}>Nueva sal</button>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <Term title={`clave derivada · sal ${sal}`}>{res ? res.clave.slice(0, 32) : "pulsa derivar"}</Term>
        <Term title="misma contraseña, otra sal">{res2 ? res2.clave.slice(0, 32) : "pulsa derivar"}</Term>
      </div>

      {res && (
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <div className="border-2 border-black bg-[var(--bg-sunken)] p-2">
            <p className="label">Coste aquí</p>
            <p className="mono text-[22px] text-[var(--accent)]">{ms} ms</p>
          </div>
          <div className="border-2 border-black bg-[var(--bg-sunken)] p-2">
            <p className="label">Iteraciones</p>
            <p className="mono text-[22px] text-[var(--cyan)]">{iter.toLocaleString("es")}</p>
          </div>
          <div className="border-2 border-black bg-[var(--bg-sunken)] p-2">
            <p className="label">10⁹ pruebas tardarían</p>
            <p className="mono text-[18px] text-[var(--violet)]">{anios < 1 ? `${(anios * 365).toFixed(0)} días` : `${anios.toFixed(0)} años`}</p>
          </div>
        </div>
      )}

      <Pista>
        Nunca se guarda la contraseña: se guarda el resultado de un <b>KDF</b> con una <b>sal</b> única por
        usuario. La sal mata las tablas precalculadas (rainbow tables) porque la misma contraseña da claves
        distintas en cada cuenta. Las <b>iteraciones</b> son trabajo extra: al servidor le cuesta unos
        milisegundos, al atacante le multiplica el coste por millones. Hoy se recomienda Argon2id antes que
        PBKDF2, y contraseñas largas antes que cualquier truco.
      </Pista>
    </WidgetShell>
  );
}

/* ───────────────────────── 6 · Fuerza bruta real ───────────────────────── */

async function shaHex(t: string): Promise<string> {
  const b = await crypto.subtle.digest("SHA-256", enc.encode(t));
  return hex(new Uint8Array(b));
}

export function BruteLab() {
  const [pin, setPin] = useState(() => String(Math.floor(1000 + Math.random() * 9000)));
  const [objetivo, setObjetivo] = useState("");
  const [probado, setProbado] = useState(0);
  const [encontrado, setEncontrado] = useState<string | null>(null);
  const [ms, setMs] = useState(0);
  const [corriendo, setCorriendo] = useState(false);
  const vivo = useRef(true);

  useEffect(() => {
    vivo.current = true;
    return () => {
      vivo.current = false;
    };
  }, []);

  useEffect(() => {
    shaHex(pin).then(setObjetivo);
    setProbado(0);
    setEncontrado(null);
    setMs(0);
  }, [pin]);

  async function atacar() {
    setCorriendo(true);
    setEncontrado(null);
    setProbado(0);
    const t0 = performance.now();
    let hallado: string | null = null;
    for (let i = 0; i < 10000; i++) {
      const cand = String(i).padStart(4, "0");
      // el navegador nos deja respirar: probamos de 200 en 200
      if (i % 200 === 0) await new Promise((r) => setTimeout(r, 0));
      if (!vivo.current) return;
      if ((await shaHex(cand)) === objetivo) {
        hallado = cand;
        setProbado(i + 1);
        break;
      }
      if (i % 250 === 0) setProbado(i);
    }
    setMs(Math.round(performance.now() - t0));
    setEncontrado(hallado);
    setProbado(10000);
    setCorriendo(false);
  }

  const velocidad = ms > 0 ? Math.round(10000 / (ms / 1000)) : 0;
  const segundos8 = velocidad > 0 ? Math.pow(26, 8) / velocidad : 0;
  const anios8 = segundos8 / 31536000;
  const pct = Math.round((probado / 10000) * 100);

  return (
    <WidgetShell title="Fuerza bruta real contra un PIN" badge={<span className="chip !text-[9px]">10 000 intentos</span>}>
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="border-2 border-black bg-[var(--bg-sunken)] p-2">
          <p className="label">PIN secreto (no lo mires 👀)</p>
          <p className="mono mt-1 text-[22px] text-[var(--accent)]">{pin}</p>
        </div>
        <div className="border-2 border-black bg-[var(--bg-sunken)] p-2">
          <p className="label">Lo único que ve el atacante</p>
          <p className="mono mt-1 break-all text-[11px] text-[var(--text-2)]">SHA-256 = {objetivo.slice(0, 32)}…</p>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        <button className="btn btn-primary btn-sm" onClick={atacar} disabled={corriendo}>
          {corriendo ? "Probando…" : "Atacar por fuerza bruta"}
        </button>
        <button className="btn btn-sm" onClick={() => setPin(String(Math.floor(1000 + Math.random() * 9000)))}>
          Otro PIN
        </button>
        <span className="chip">{probado.toLocaleString("es")} / 10 000</span>
      </div>

      <div className="mt-2 h-4 border-2 border-black bg-[var(--surface-3)]">
        <div className="h-full bg-[var(--accent)]" style={{ width: `${pct}%` }} />
      </div>

      <div className="mt-3">
        {encontrado && (
          <Term title="resultado">
            {`PIN encontrado: ${encontrado}  en ${ms} ms\nvelocidad: ${velocidad.toLocaleString("es")} hashes/s`}
          </Term>
        )}
        {velocidad > 0 && (
          <div className="mt-2 border-2 border-black bg-[#2a1016] p-2">
            <p className="label !text-[var(--red)]">¿Y con letras?</p>
            <p className="mt-1 text-[15px] text-[var(--text-2)]">
              Una contraseña de 8 letras minúsculas tiene 26⁸ ≈ 208 827 064 576 combinaciones. A{" "}
              <b>{velocidad.toLocaleString("es")} por segundo</b> tardarías{" "}
              <b className="text-[var(--accent)]">
                {anios8 > 1 ? `${Math.round(anios8).toLocaleString("es")} años` : `${Math.round(segundos8).toLocaleString("es")} segundos`}
              </b>{" "}
              en este navegador. Cinco caracteres más y el número deja de caber en la cabeza.
            </p>
          </div>
        )}
      </div>

      <Pista>
        El PIN se rompe porque solo hay 10 000 posibilidades: la fuerza bruta no piensa, solo prueba. Lo que
        de verdad protege no es la "complejidad" (P@ssw0rd! sigue siendo un diccionario), es la
        <b> longitud</b>: cada carácter multiplica el trabajo del atacante. Y por eso los servidores añaden
        límite de intentos y bloqueo: si solo puedes probar 5 veces, 10 000 posibilidades ya son
        inalcanzables.
      </Pista>
    </WidgetShell>
  );
}

/* ───────────────────────── 7 · Vigenère + IC por columnas ──────────────── */

export function VigenereLab() {
  const [txt, setTxt] = useState("ATAQUE AL AMANECER EN EL PUERTO");
  const [clave, setClave] = useState("PANAMA");
  const limpio = txt.toUpperCase().replace(/[^A-Z]/g, "");
  const k = clave.toUpperCase().replace(/[^A-Z]/g, "") || "A";
  const cifrado = [...limpio].map((c, i) => AB[(AB.indexOf(c) + AB.indexOf(k[i % k.length])) % 26]).join("");
  const descifrado = [...cifrado].map((c, i) => AB[(AB.indexOf(c) - AB.indexOf(k[i % k.length]) + 260) % 26]).join("");

  const columnas = useMemo(() => {
    const cols: string[] = Array.from({ length: k.length }, () => "");
    [...cifrado].forEach((c, i) => {
      cols[i % k.length] += c;
    });
    return cols;
  }, [cifrado, k.length]);

  return (
    <WidgetShell title="Vigenère: la clave que se repite (y cómo se cae)" badge={<span className="chip !text-[9px]">clave {k.length} letras</span>}>
      <div className="grid gap-2 sm:grid-cols-2">
        <label>
          <span className="label">Mensaje</span>
          <input className="field mono mt-1" value={txt} onChange={(e) => setTxt(e.target.value)} />
        </label>
        <label>
          <span className="label">Clave</span>
          <input className="field mono mt-1" value={clave} onChange={(e) => setClave(e.target.value)} />
        </label>
      </div>

      <Term title="cifrado">
        {cifrado || "—"}
        {"\n"}<span style={{ color: "#7fbf8f" }}>{descifrado}</span>{"  ← descifrado con la misma clave"}
      </Term>

      <div className="mt-3 overflow-x-auto">
        <div className="flex min-w-[420px] gap-2">
          {columnas.map((c, i) => (
            <div key={i} className="flex-1 border-2 border-black bg-[var(--bg-sunken)] p-1">
              <p className="label !text-[10px] text-center">col {i + 1}</p>
              <p className="mono break-all text-center text-[12px] text-[var(--text-2)]">{c || "—"}</p>
            </div>
          ))}
        </div>
      </div>

      <Pista>
        Vigenère son 26 cifrados César encadenados. Parecía irrompible hasta que Kasiski se dio cuenta de
        algo: si la clave mide <b>{k.length}</b> letras, cada columna se cifró con un desplazamiento
        <b> fijo</b>. Ordena las letras por columnas (arriba) y cada una vuelve a ser un César normal: la
        letra más frecuente de cada columna menos la E te da el desplazamiento, y con los desplazamientos
        tienes la clave. Romper un cifrado casi nunca es adivinar la clave: es encontrar dónde el patrón
        se repite.
      </Pista>
    </WidgetShell>
  );
}
