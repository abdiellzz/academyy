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

/* ───────────────────────── Redes activas (ping / nmap) ─────────────────── */

interface Host {
  ip: string;
  nombre: string;
  puertos: { p: number; servicio: string }[];
  nota?: string;
}

const RED: Host[] = [
  { ip: "10.0.0.1", nombre: "router", puertos: [{ p: 53, servicio: "domain" }, { p: 80, servicio: "http" }, { p: 443, servicio: "https" }] },
  { ip: "10.0.0.10", nombre: "web-prod", puertos: [{ p: 22, servicio: "ssh" }, { p: 80, servicio: "http" }, { p: 443, servicio: "https" }, { p: 8080, servicio: "http-alt" }] },
  { ip: "10.0.0.11", nombre: "db-postgres", puertos: [{ p: 22, servicio: "ssh" }, { p: 5432, servicio: "postgresql" }], nota: "La base de datos no debería oírse fuera de la red interna." },
  { ip: "10.0.0.12", nombre: "backup", puertos: [{ p: 21, servicio: "ftp" }, { p: 22, servicio: "ssh" }, { p: 445, servicio: "microsoft-ds" }], nota: "FTP manda contraseña en claro: huele a servidor viejo." },
  { ip: "10.0.0.20", nombre: "impresora", puertos: [{ p: 80, servicio: "http" }, { p: 9100, servicio: "jetdirect" }] },
  { ip: "10.0.0.30", nombre: "camara-ip", puertos: [{ p: 23, servicio: "telnet" }, { p: 80, servicio: "http" }, { p: 554, servicio: "rtsp" }], nota: "Telnet en una cámara: contraseña por la red sin cifrar." },
  { ip: "10.0.0.99", nombre: "desconocido", puertos: [{ p: 3389, servicio: "ms-wbt-server" }, { p: 445, servicio: "microsoft-ds" }], nota: "Este equipo no está en el inventario y tiene escritorio remoto abierto. Eso es lo que hay que investigar." },
];

const PISTAS_CMD = ["nmap 10.0.0.0/24", "ping 10.0.0.10", "nmap -p 22,3389 10.0.0.99", "traceroute 8.8.8.8", "arp -a"];

export function ejecutarComando(cmd: string): { salida: string[]; hallazgo?: string } {
  const partes = cmd.trim().split(/\s+/);
  const prog = (partes[0] ?? "").toLowerCase();

  if (!cmd.trim() || prog === "help") {
    return {
      salida: [
        "Comandos disponibles en este simulador:",
        "  ping <ip>                → ¿está vivo el equipo?",
        "  nmap <rango|ip>          → descubre equipos y puertos abiertos",
        "  nmap -p 22,80 <ip>       → escanea solo esos puertos",
        "  traceroute <ip>          → por dónde sale tu tráfico",
        "  arp -a                   → qué equipos ve tu red local",
      ],
    };
  }

  if (prog === "ping") {
    const ip = partes[1] ?? "10.0.0.1";
    const host = RED.find((h) => h.ip === ip);
    if (!host && !/^\d+\.\d+\.\d+\.\d+$/.test(ip)) return { salida: [`ping: ${ip}: nombre desconocido`] };
    const base = ip.startsWith("10.0.0.") ? 1 : 24;
    return {
      salida: [
        `PING ${ip} 56 bytes de datos:`,
        `64 bytes desde ${ip}: icmp_seq=1 ttl=${64 - base} tiempo=${base}.${Math.floor(Math.random() * 9)} ms`,
        `64 bytes desde ${ip}: icmp_seq=2 ttl=${64 - base} tiempo=${base}.${Math.floor(Math.random() * 9)} ms`,
        "",
        `--- ${ip} estadísticas ---`,
        "2 paquetes transmitidos, 2 recibidos, 0% perdidos",
        host ? `→ Responde y el TTL dice que está a ${base} saltos.` : "→ Responde, pero no está en la lista de equipos conocidos.",
      ],
    };
  }

  if (prog === "nmap") {
    const conPuertos = partes[1] === "-p";
    const lista = conPuertos ? (partes[2] ?? "").split(",").map(Number) : null;
    const objetivo = (conPuertos ? partes[3] : partes[1]) ?? "10.0.0.0/28";
    let hosts: Host[] = [];
    if (objetivo.includes("/")) {
      const [base, mascara] = objetivo.split("/");
      const prefijo = base.split(".").slice(0, 3).join(".");
      const n = Math.pow(2, 32 - Number(mascara));
      const desde = Number(base.split(".")[3]);
      const rango = [desde, Math.min(255, desde + n - 1)];
      hosts = RED.filter((h) => h.ip.startsWith(prefijo + ".") && Number(h.ip.split(".")[3]) >= rango[0] && Number(h.ip.split(".")[3]) <= rango[1]);
    } else {
      const h = RED.find((x) => x.ip === objetivo);
      if (h) hosts = [h];
    }
    if (!hosts.length) return { salida: [`Nmap: el host ${objetivo} parece caer (0 hosts up).`] };

    const salida: string[] = [
      `Starting Nmap 7.94 ( simulado ) — ${new Date().toLocaleTimeString("es")}`,
      `Nmap scan report for ${objetivo}`,
    ];
    for (const h of hosts) {
      const abiertos = lista ? h.puertos.filter((p) => lista.includes(p.p)) : h.puertos;
      salida.push(`Nmap scan report for ${h.nombre} (${h.ip})`);
      salida.push("PORT     STATE  SERVICE");
      for (const p of abiertos) salida.push(`${String(p.p).padEnd(8)} open   ${p.servicio}`);
      if (!abiertos.length) salida.push("(ninguno de esos puertos abierto)");
      salida.push("");
    }
    salida.push(`Nmap done: ${hosts.length} host(s) up`);
    // Priorizamos el equipo que no está en el inventario: es el hallazgo de verdad.
    const desconocido = hosts.find((h) => h.nombre === "desconocido") ?? hosts.find((h) => h.nota);
    return { salida, hallazgo: desconocido ? `${desconocido.ip} (${desconocido.nombre}): ${desconocido.nota}` : undefined };
  }

  if (prog === "traceroute") {
    const ip = partes[1] ?? "8.8.8.8";
    return {
      salida: [
        `traceroute to ${ip}, 30 saltos máximo:`,
        " 1  10.0.0.1        1.204 ms  1.118 ms  1.061 ms   (tu router)",
        " 2  190.14.2.1     12.882 ms 12.554 ms 13.010 ms   (tu proveedor)",
        " 3  200.57.14.9    28.441 ms 28.117 ms 28.990 ms   (salida internacional)",
        " 4  108.170.245.1  48.220 ms 47.880 ms 48.901 ms   (red del proveedor de internet)",
        ` 5  ${ip}          55.102 ms 54.887 ms 55.640 ms`,
        "",
        "→ Cada salto suma latencia. Si a partir del 3 todo tarda 200 ms, el problema no es tu wifi.",
      ],
    };
  }

  if (prog === "arp") {
    return {
      salida: RED.slice(0, 6).map(
        (h, i) => `${h.ip.padEnd(12)} a4:2b:8c:01:11:${(9 + i).toString(16).padStart(2, "0")}  ${i ? "dinámico" : "estático"}  ${h.nombre}`,
      ),
    };
  }

  return { salida: [`${prog}: comando no reconocido. Escribe help.`] };
}

export function RedesLab() {
  const [cmd, setCmd] = useState("nmap 10.0.0.0/24");
  const [historial, setHistorial] = useState<{ cmd: string; salida: string[]; hallazgo?: string }[]>([]);

  function correr(texto: string) {
    const limpio = texto.trim();
    if (!limpio) return;
    const r = ejecutarComando(limpio);
    setHistorial((h) => [...h, { cmd: limpio, ...r }].slice(-6));
    setCmd("");
  }

  return (
    <WidgetShell title="Red activa — ping, nmap y traceroute" badge={<span className="chip !text-[9px] !text-[var(--green)]">red 10.0.0.0/24</span>}>
      <p className="text-[14px] leading-relaxed text-[var(--text-2)]">
        Esta es la red de una oficina pequeña. Explórala como lo haría un técnico: descubre equipos,
        mira qué servicios tienen abiertos y encuentra lo que no debería estar ahí.
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {PISTAS_CMD.map((c) => (
          <button key={c} className="chip chip-btn" onClick={() => correr(c)}>
            {c}
          </button>
        ))}
      </div>

      <div
        className="mt-3 max-h-[300px] overflow-y-auto border-2 border-black bg-[var(--bg-sunken)] p-2"
        style={{ fontFamily: "var(--font-mono)", fontSize: 14 }}
        role="log"
        aria-live="polite"
        aria-label="Salida de los comandos de red"
      >
        {historial.length === 0 && <p className="text-[var(--text-3)]">Escribe un comando abajo o pulsa una pista de arriba.</p>}
        {historial.map((h, i) => (
          <div key={i} className="mb-3">
            <p className="text-[var(--accent)]">$ {h.cmd}</p>
            <pre className="m-0 whitespace-pre-wrap text-[var(--text-2)]">{h.salida.join("\n")}</pre>
            {h.hallazgo && <p className="mt-1 border-l-4 border-[var(--red)] pl-2 text-[var(--red)]">⚠ {h.hallazgo}</p>}
          </div>
        ))}
      </div>

      <div className="mt-2 flex gap-2">
        <input
          className="field mono"
          placeholder="escribe un comando… (help para ver la lista)"
          value={cmd}
          onChange={(e) => setCmd(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && correr(cmd)}
          aria-label="Comando de red"
        />
        <button className="btn btn-primary btn-sm shrink-0" onClick={() => correr(cmd)}>
          Ejecutar
        </button>
      </div>

      <p className="mt-2 border-l-4 border-[var(--violet)] bg-[#1b1233] p-2.5 text-[14px] leading-relaxed text-[var(--text-2)]">
        Escanear una red que no es tuya es delito en casi todos los países, aunque «solo mires». En este
        laboratorio la red es ficticia; en la vida real necesitas permiso por escrito antes de tocar nada.
      </p>
    </WidgetShell>
  );
}

/* ───────────────────────── Lectura de logs ─────────────────────────────── */

interface Linea {
  hora: string;
  host: string;
  servicio: string;
  texto: string;
  ip?: string;
  tipo: "fallo" | "ok" | "sudo" | "normal";
}

function construirLog(): Linea[] {
  const l: Linea[] = [];
  const push = (h: string, servicio: string, texto: string, tipo: Linea["tipo"], ip?: string) =>
    l.push({ hora: h, host: "srv-fv-01", servicio, texto, tipo, ip });

  push("08:02:11", "sshd", "Accepted publickey for ana from 190.14.2.7 port 51222 ssh2", "ok", "190.14.2.7");
  push("08:02:40", "sudo", "ana : TTY=pts/0 ; PWD=/var/www ; USER=root ; COMMAND=/bin/systemctl restart nginx", "sudo");
  push("08:10:03", "cron", "(root) CMD (/usr/local/bin/backup.sh)", "normal");
  push("08:31:19", "sshd", "Accepted password for luis from 190.14.2.9 port 49880 ssh2", "ok", "190.14.2.9");

  // fuerza bruta
  for (let i = 0; i < 14; i++) {
    const hora = `09:${String(2 + Math.floor(i / 3)).padStart(2, "0")}:${String((i * 7) % 60).padStart(2, "0")}`;
    push(hora, "sshd", `Failed password for root from 45.13.22.9 port ${51900 + i * 13} ssh2`, "fallo", "45.13.22.9");
  }
  push("09:07:52", "sshd", "Failed password for invalid user admin from 45.13.22.9 port 52340 ssh2", "fallo", "45.13.22.9");
  push("09:08:30", "sshd", "Accepted password for root from 45.13.22.9 port 52411 ssh2", "ok", "45.13.22.9");
  push("09:09:02", "sshd", "session opened for user root by (uid=0)", "normal");
  push("09:12:44", "sudo", "root : TTY=pts/1 ; PWD=/root ; USER=root ; COMMAND=/usr/sbin/useradd soporte", "sudo");
  push("09:13:20", "sshd", "session closed for user root", "normal");

  // ruido normal
  const ruido = [
    "Accepted publickey for ana from 190.14.2.7 port 51290 ssh2",
    "Disconnected from 190.14.2.7 port 51290 [preauth]",
    "Received disconnect from 190.14.2.11 port 40022: 11: Bye Bye",
    "Invalid user prueba from 181.50.9.14 port 60221",
  ];
  ruido.forEach((t, i) => push(`10:${String(10 + i * 4).padStart(2, "0")}:05`, "sshd", t, t.startsWith("Accepted") ? "ok" : "fallo", "190.14.2.7"));
  push("10:31:00", "cron", "(root) CMD (/usr/local/bin/backup.sh)", "normal");
  return l.sort((a, b) => a.hora.localeCompare(b.hora));
}

const LOG = construirLog();

export function LogsLab() {
  const [filtro, setFiltro] = useState("");
  const [analizado, setAnalizado] = useState(false);

  const fallos = LOG.filter((l) => l.tipo === "fallo");
  const topIp = useMemo(() => {
    const m = new Map<string, number>();
    for (const l of fallos) if (l.ip) m.set(l.ip, (m.get(l.ip) ?? 0) + 1);
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  }, [fallos]);
  const atacante = analizado && topIp[0] && topIp[0][1] >= 5 ? topIp[0][0] : null;

  const visibles = LOG.filter((l) => !filtro || `${l.hora} ${l.servicio} ${l.texto} ${l.ip ?? ""}`.toLowerCase().includes(filtro.toLowerCase()));

  return (
    <WidgetShell title="Lectura de logs — /var/log/auth.log" badge={<span className="chip !text-[9px]">{LOG.length} líneas</span>}>
      <p className="text-[14px] leading-relaxed text-[var(--text-2)]">
        Esto es lo único que ve un administrador cuando algo pasa: líneas. Tu trabajo es leer, filtrar y
        encontrar el patrón. Fíjate en las horas, en las IPs y en qué viene <b>después</b> de los fallos.
      </p>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <input className="field mono flex-1" placeholder="filtrar: failed, 45.13, sudo…" value={filtro} onChange={(e) => setFiltro(e.target.value)} aria-label="Filtro de logs" />
        <button className="btn btn-primary btn-sm" onClick={() => setAnalizado(true)}>
          Analizar
        </button>
      </div>

      <div
        className="mt-3 max-h-[280px] overflow-y-auto border-2 border-black bg-[var(--bg-sunken)] p-2"
        style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}
        role="log"
        aria-live="polite"
        aria-label="Líneas de auth.log"
      >
        {visibles.map((l, i) => {
          const esAtacante = atacante && l.ip === atacante;
          return (
            <div
              key={i}
              className={cn("whitespace-pre-wrap", esAtacante && "bg-[#3a1418]")}
              style={{ color: l.tipo === "fallo" ? "#ff9aa6" : l.tipo === "ok" ? "#9ff2bd" : l.tipo === "sudo" ? "#ffd98a" : "var(--text-3)" }}
            >
              {l.hora} {l.host} {l.servicio}: {l.texto}
            </div>
          );
        })}
        {!visibles.length && <p className="text-[var(--text-3)]">Ninguna línea coincide.</p>}
      </div>

      {analizado && (
        <div className="mt-3 grid gap-2 sm:grid-cols-2" aria-live="polite">
          <div className="border-2 border-black bg-[#2a1016] p-3">
            <p className="label !text-[var(--red)]">Hallazgo</p>
            <p className="mt-1 text-[15px] text-[var(--text-2)]">
              {atacante ? (
                <>
                  <b className="text-[var(--red)]">{atacante}</b> acumula <b>{topIp[0][1]}</b> intentos fallidos y
                  después <b>un acceso correcto</b>. Eso es fuerza bruta con éxito: hay que asumir el equipo
                  como comprometido.
                </>
              ) : (
                "Sin patrones de fuerza bruta evidentes en estas líneas."
              )}
            </p>
          </div>
          <div className="border-2 border-black bg-[var(--bg-sunken)] p-3">
            <p className="label">Qué harías ahora</p>
            <ol className="mt-1 ml-4 list-decimal text-[14px] leading-relaxed text-[var(--text-2)]">
              <li>Cortar el acceso de esa IP y de esa cuenta root.</li>
              <li>Revisar qué se creó: aparece un <span className="mono">useradd soporte</span>.</li>
              <li>Prohibir login de root por SSH (<span className="mono">PermitRootLogin no</span>).</li>
              <li>Poner límite de intentos (fail2ban) y 2FA.</li>
            </ol>
          </div>
        </div>
      )}

      <p className="mt-2 border-l-4 border-[var(--violet)] bg-[#1b1233] p-2.5 text-[14px] leading-relaxed text-[var(--text-2)]">
        Un log no grita: susurra. El patrón (14 fallos en 4 minutos desde la misma IP, y un acierto justo
        después) es la firma clásica de un ataque de diccionario. Aprender a leer eso vale más que
        memorizar herramientas.
      </p>
    </WidgetShell>
  );
}
