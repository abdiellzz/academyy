import { useMemo, useState } from "react";
import { PixelIcon } from "../PixelArt";
import { Term } from "../ui";
import { WidgetShell } from "./CommonWidgets";
import { ejecutarPython } from "../../lib/py";
import { cn } from "../../utils/cn";

/* ═══════════════════════════════════════════════════════════════════
   Laboratorio de Python y laboratorio de redes (captura de paquetes).
   ═══════════════════════════════════════════════════════════════════ */

const EJEMPLOS: { nombre: string; code: string }[] = [
  {
    nombre: "contar vocales",
    code: `frase = "la seguridad empieza por ti"
vocales = 0
for letra in frase:
    if letra in "aeiou":
        vocales += 1
print(f"vocales: {vocales}")`,
  },
  {
    nombre: "fizzbuzz",
    code: `for n in range(1, 16):
    if n % 15 == 0:
        print("FizzBuzz")
    elif n % 3 == 0:
        print("Fizz")
    elif n % 5 == 0:
        print("Buzz")
    else:
        print(n)`,
  },
  {
    nombre: "filtrar palabras",
    code: `palabras = ["red", "criptografia", "hash", "firewall", "ip"]
largas = []
for p in palabras:
    if len(p) > 3:
        largas.append(p)
print(largas)
print(f"{len(largas)} de {len(palabras)} son largas")`,
  },
  {
    nombre: "puertos abiertos",
    code: `puertos = [22, 80, 443, 3306, 8080]
riesgo = 0
for p in puertos:
    if p in [22, 3306]:
        riesgo += 1
print("puertos de riesgo:", riesgo)
print("mayor puerto:", sorted(puertos)[-1])`,
  },
];

const RETOS: { titulo: string; enunciado: string; esperado: string; pista: string }[] = [
  {
    titulo: "Suma del 1 al 10",
    enunciado: "Suma los números del 1 al 10 con un for y muestra el total.",
    esperado: "55",
    pista: "total = 0 · for i in range(1, 11): total += i · print(total)",
  },
  {
    titulo: "Contar letras",
    enunciado: "Muestra cuántas letras tiene la palabra «criptografia».",
    esperado: "12",
    pista: "print(len(\"criptografia\"))",
  },
  {
    titulo: "Solo los pares",
    enunciado: "Recorre 1..10 y muestra solo los números pares, uno por línea.",
    esperado: "2\n4\n6\n8\n10",
    pista: "if n % 2 == 0: print(n)",
  },
  {
    titulo: "Promedio",
    enunciado: "De la lista [8, 6, 10, 4] muestra el promedio.",
    esperado: "7.0",
    pista: "print(sum(notas) / len(notas))",
  },
];

export function PythonLab() {
  const [code, setCode] = useState(EJEMPLOS[0].code);
  const [salida, setSalida] = useState<string[]>([]);
  const [error, setError] = useState<string | undefined>();
  const [reto, setReto] = useState(0);

  const r = RETOS[reto];

  function correr() {
    const res = ejecutarPython(code);
    setSalida(res.salida);
    setError(res.error);
  }

  const correcto = useMemo(
    () => salida.join("\n").trim() === r.esperado.trim() && !error,
    [salida, error, r.esperado],
  );

  return (
    <WidgetShell title="Consola de Python" badge={<span className="chip !text-[9px] !text-[var(--green)]">ejecuta de verdad</span>}>
      <p className="mb-2 text-[14px] leading-relaxed text-[var(--text-2)]">
        Escribe código y pulsa <b>Ejecutar</b>. Corre en tu navegador con un subconjunto real de Python:
        variables, textos, f-strings, listas, <span className="mono">if/elif/else</span>,
        <span className="mono"> for … in …</span> y <span className="mono">range()</span>.
      </p>
      <div className="mb-2 flex flex-wrap gap-1.5">
        {EJEMPLOS.map((e) => (
          <button
            key={e.nombre}
            className="chip chip-btn"
            onClick={() => {
              setCode(e.code);
              setSalida([]);
              setError(undefined);
            }}
          >
            {e.nombre}
          </button>
        ))}
      </div>
      <textarea
        className="field mono min-h-[190px] w-full leading-relaxed"
        spellCheck={false}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        aria-label="Código Python"
      />
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button className="btn btn-primary btn-sm" onClick={correr}>
          <PixelIcon name="snake" size={12} /> Ejecutar
        </button>
        <button
          className="btn btn-sm"
          onClick={() => {
            setCode("");
            setSalida([]);
            setError(undefined);
          }}
        >
          Limpiar
        </button>
        <span className="label ml-auto">4 espacios de sangría</span>
      </div>

      <div className="mt-3">
        <Term title="salida">
          {error ? <span style={{ color: "var(--red)" }}>{error}</span> : salida.length ? salida.join("\n") : "—"}
        </Term>
      </div>

      <div className="mt-4 border-2 border-black bg-[var(--bg-sunken)] p-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <p className="label !text-[var(--accent)]">Retos de código</p>
          {RETOS.map((x, i) => (
            <button key={x.titulo} className={cn("chip chip-btn", i === reto && "chip-live")} onClick={() => setReto(i)}>
              {i + 1}
            </button>
          ))}
        </div>
        <p className="mt-2 text-[16px] font-bold">{r.titulo}</p>
        <p className="mt-1 text-[15px] text-[var(--text-2)]">{r.enunciado}</p>
        <p className="mono mt-2 text-[13px] text-[var(--text-3)]">salida esperada: {JSON.stringify(r.esperado)}</p>
        <p className="mt-2 text-[13px] text-[var(--text-3)]">💡 {r.pista}</p>
        {correcto && (
          <p className="mt-2 border-2 border-black bg-[#16301f] p-2 text-[15px] text-[var(--green)]">
            ✔ Correcto. Esa es la salida exacta.
          </p>
        )}
      </div>
    </WidgetShell>
  );
}

/* ───────────────────────── Captura de paquetes ───────────────────────── */

interface Paquete {
  n: number;
  t: string;
  origen: string;
  destino: string;
  proto: "TCP" | "UDP" | "ARP" | "ICMP";
  puerto: string;
  info: string;
  ttl: number;
  mac: string;
  app: string;
}

const PAQUETES: Paquete[] = [
  { n: 1, t: "0.000", origen: "192.168.1.24", destino: "192.168.1.1", proto: "ARP", puerto: "—", info: "¿Quién tiene 192.168.1.1? Decídmelo", ttl: 0, mac: "ff:ff:ff:ff:ff:ff", app: "Capa 2: nadie sabe aún la MAC del router" },
  { n: 2, t: "0.003", origen: "192.168.1.1", destino: "192.168.1.24", proto: "ARP", puerto: "—", info: "192.168.1.1 está en a4:2b:8c:01:11:9f", ttl: 0, mac: "a4:2b:8c:01:11:9f", app: "El router responde: aquí está mi MAC" },
  { n: 3, t: "0.010", origen: "192.168.1.24", destino: "1.1.1.1", proto: "UDP", puerto: "53112 → 53", info: "DNS query A factionvault.app", ttl: 64, mac: "a4:2b:8c:01:11:9f", app: "DNS: preguntamos la IP del dominio" },
  { n: 4, t: "0.041", origen: "1.1.1.1", destino: "192.168.1.24", proto: "UDP", puerto: "53 → 53112", info: "DNS response A 104.21.8.7", ttl: 57, mac: "a4:2b:8c:01:11:9f", app: "DNS: nos devuelve la IP" },
  { n: 5, t: "0.048", origen: "192.168.1.24", destino: "104.21.8.7", proto: "TCP", puerto: "49772 → 443", info: "[SYN] Seq=0 Win=64240", ttl: 64, mac: "a4:2b:8c:01:11:9f", app: "TCP: pedimos abrir conexión segura" },
  { n: 6, t: "0.092", origen: "104.21.8.7", destino: "192.168.1.24", proto: "TCP", puerto: "443 → 49772", info: "[SYN, ACK] Seq=0 Ack=1", ttl: 55, mac: "a4:2b:8c:01:11:9f", app: "TCP: el servidor acepta" },
  { n: 7, t: "0.093", origen: "192.168.1.24", destino: "104.21.8.7", proto: "TCP", puerto: "49772 → 443", info: "[ACK] Seq=1 Ack=1", ttl: 64, mac: "a4:2b:8c:01:11:9f", app: "TCP: conexión establecida (3 vías)" },
  { n: 8, t: "0.140", origen: "192.168.1.24", destino: "104.21.8.7", proto: "TCP", puerto: "49772 → 443", info: "TLS Client Hello (SNI=factionvault.app)", ttl: 64, mac: "a4:2b:8c:01:11:9f", app: "TLS: empieza el saludo cifrado" },
  { n: 9, t: "0.240", origen: "104.21.8.7", destino: "192.168.1.24", proto: "TCP", puerto: "443 → 49772", info: "TLS Server Hello + Certificate", ttl: 55, mac: "a4:2b:8c:01:11:9f", app: "TLS: el servidor presenta su certificado" },
  { n: 10, t: "0.401", origen: "192.168.1.24", destino: "104.21.8.7", proto: "TCP", puerto: "49772 → 443", info: "Application Data (1.1 kB)", ttl: 64, mac: "a4:2b:8c:01:11:9f", app: "HTTP cifrado: ya viaja la página" },
  { n: 11, t: "1.204", origen: "8.8.8.8", destino: "192.168.1.24", proto: "ICMP", puerto: "—", info: "Echo (ping) request", ttl: 118, mac: "a4:2b:8c:01:11:9f", app: "ICMP: alguien hace ping" },
  { n: 12, t: "1.209", origen: "192.168.1.24", destino: "8.8.8.8", proto: "ICMP", puerto: "—", info: "Echo (ping) reply", ttl: 64, mac: "a4:2b:8c:01:11:9f", app: "ICMP: respondemos" },
];

const FILTROS = ["tcp", "udp", "dns", "443", "arp", "icmp", "1.1.1.1"];

export function PaquetesLab() {
  const [filtro, setFiltro] = useState("");
  const [sel, setSel] = useState<number | null>(null);

  const visibles = useMemo(() => {
    const f = filtro.trim().toLowerCase();
    if (!f) return PAQUETES;
    return PAQUETES.filter((p) =>
      `${p.proto} ${p.origen} ${p.destino} ${p.puerto} ${p.info} ${p.app}`.toLowerCase().includes(f),
    );
  }, [filtro]);

  const paquete = PAQUETES.find((p) => p.n === sel) ?? null;

  return (
    <WidgetShell title="Captura de paquetes (mini Wireshark)" badge={<span className="chip !text-[9px]">{visibles.length}/{PAQUETES.length}</span>}>
      <p className="text-[14px] leading-relaxed text-[var(--text-2)]">
        Esto es una captura de tráfico real de una laptop abriendo una web: ARP, DNS, TCP, TLS e ICMP.
        Filtra como en Wireshark y haz clic en un paquete para ver sus capas.
      </p>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <input
          className="field mono flex-1"
          placeholder="filtro: tcp, dns, 443, 1.1.1.1…"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          aria-label="Filtro de paquetes"
        />
        {FILTROS.map((f) => (
          <button key={f} className={cn("chip chip-btn", filtro === f && "chip-live")} onClick={() => setFiltro(filtro === f ? "" : f)}>
            {f}
          </button>
        ))}
      </div>

      <div className="mt-3 max-h-[260px] overflow-auto border-2 border-black bg-[var(--bg-sunken)]">
        <table className="w-full min-w-[520px] border-collapse text-left" style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}>
          <thead className="sticky top-0 bg-[var(--surface-3)]">
            <tr>
              {["#", "tiempo", "origen", "destino", "proto", "puertos", "info"].map((h) => (
                <th key={h} className="label border border-black px-1.5 py-1">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibles.map((p) => (
              <tr
                key={p.n}
                onClick={() => setSel(sel === p.n ? null : p.n)}
                className={cn("cursor-pointer", sel === p.n ? "bg-[#2a2350]" : "hover:bg-[var(--surface-2)]")}
              >
                <td className="border border-black px-1.5 text-[var(--text-3)]">{p.n}</td>
                <td className="border border-black px-1.5">{p.t}</td>
                <td className="border border-black px-1.5">{p.origen}</td>
                <td className="border border-black px-1.5">{p.destino}</td>
                <td className="border border-black px-1.5" style={{ color: p.proto === "TCP" ? "var(--cyan)" : p.proto === "UDP" ? "var(--violet)" : "var(--accent)" }}>{p.proto}</td>
                <td className="border border-black px-1.5">{p.puerto}</td>
                <td className="border border-black px-1.5 text-[var(--text-2)]">{p.info}</td>
              </tr>
            ))}
            {visibles.length === 0 && (
              <tr>
                <td colSpan={7} className="px-2 py-4 text-center text-[13px] text-[var(--text-3)]">
                  Ningún paquete coincide con «{filtro}».
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {paquete && (
        <div className="mt-3 grid gap-2 sm:grid-cols-4">
          {[
            { capa: "2 · Enlace", dato: `MAC destino ${paquete.mac}`, nota: "La trama viaja a la MAC del router, no a la IP final." },
            { capa: "3 · Red", dato: `${paquete.origen} → ${paquete.destino}`, nota: paquete.ttl ? `TTL ${paquete.ttl}: cada salto lo resta.` : "ARP no tiene IP: vive en la capa 2." },
            { capa: "4 · Transporte", dato: `${paquete.proto} ${paquete.puerto}`, nota: paquete.proto === "TCP" ? "TCP: con acuses y orden garantizado." : paquete.proto === "UDP" ? "UDP: sin acuses, más rápido." : "ICMP: mensajes de control, no lleva datos." },
            { capa: "7 · Aplicación", dato: paquete.app, nota: "Lo que la app entiende: DNS, TLS, HTTP…" },
          ].map((c) => (
            <div key={c.capa} className="border-2 border-black bg-[var(--surface-2)] p-2">
              <p className="label !text-[var(--accent)]">{c.capa}</p>
              <p className="mono mt-1 break-words text-[13px]">{c.dato}</p>
              <p className="mt-1 text-[12px] leading-snug text-[var(--text-3)]">{c.nota}</p>
            </div>
          ))}
        </div>
      )}
    </WidgetShell>
  );
}
