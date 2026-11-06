import { useMemo, useState } from "react";
import { Icon } from "../Icon";
import { PixelIcon } from "../PixelArt";
import { WidgetShell } from "./CommonWidgets";
import { cn } from "../../utils/cn";

/* ───────── Lámparas binarias de redstone ───────── */
export function BinaryWidget() {
  const [bits, setBits] = useState<boolean[]>([true, true, false, false, false, false, false, false]);
  const weights = [128, 64, 32, 16, 8, 4, 2, 1];
  const value = bits.reduce((acc, b, i) => acc + (b ? weights[i] : 0), 0);
  const [target] = useState(() => [10, 42, 77, 168, 200, 255][Math.floor(Math.random() * 6)]);
  function setFromNumber(n: number) {
    const v = Math.max(0, Math.min(255, n || 0));
    setBits(weights.map((w, i) => Boolean(v & weights[i]) && w > 0));
  }
  return (
    <WidgetShell title="Lámparas de redstone: 1 byte">
      <div className="overflow-x-auto">
        <div className="flex min-w-[420px] gap-1.5">
          {bits.map((b, i) => (
            <button key={i} onClick={() => setBits((prev) => prev.map((x, k) => (k === i ? !x : x)))} className="flex flex-1 flex-col items-center gap-1" aria-label={`Bit de valor ${weights[i]}`}>
              <span className={cn("grid h-12 w-full place-items-center border-2 border-black text-[22px] font-bold", b ? "bg-[#ffcc33] text-[#3d2a00]" : "bg-[#3a2a1a] text-[#7a6a5a]")}
                style={{ boxShadow: b ? "0 0 14px #ffcc33, inset 2px 2px 0 #fff3b0, inset -2px -2px 0 #b38a00" : "inset 2px 2px 0 #4f3a28, inset -2px -2px 0 #1a120a" }}>
                {b ? 1 : 0}
              </span>
              <span className="mono text-[17px] text-[var(--text-2)]">{weights[i]}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <div className="border-2 border-black bg-[var(--bg-sunken)] p-2 text-center">
          <p className="label !m-0">Decimal</p>
          <p className="pixel-heading !m-0 mt-1 text-[20px] text-[var(--accent)]">{value}</p>
        </div>
        <div className="border-2 border-black bg-[var(--bg-sunken)] p-2 text-center">
          <p className="label !m-0">Binario</p>
          <p className="mono !m-0 mt-1 text-[24px] text-[var(--emerald)]">{bits.map((b) => (b ? 1 : 0)).join("")}</p>
        </div>
        <div className="border-2 border-black bg-[var(--bg-sunken)] p-2 text-center">
          <p className="label !m-0">Hex</p>
          <p className="mono !m-0 mt-1 text-[24px] text-[var(--blue)]">0x{value.toString(16).toUpperCase().padStart(2, "0")}</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-2 text-[14px] text-[var(--text-2)]">Escribe un número (0-255):
          <input type="number" min={0} max={255} defaultValue={192} onChange={(e) => setFromNumber(Number(e.target.value))} className="field mono !w-24 !py-1 !text-[18px]" />
        </label>
        <span className={cn("chip", value === target ? "!bg-[#1f5c33] !text-white" : "")}>
          <PixelIcon name="xp" size={12} /> Reto: forma el {target} {value === target ? "✔ ¡logrado!" : ""}
        </span>
      </div>
    </WidgetShell>
  );
}

/* ───────── Calculadora de subredes ───────── */
function ipToInt(ip: string): number | null {
  const parts = ip.trim().split(".");
  if (parts.length !== 4) return null;
  const nums = parts.map((p) => Number(p));
  if (nums.some((n) => !Number.isInteger(n) || n < 0 || n > 255 || p(n))) return null;
  return ((nums[0] << 24) >>> 0) + (nums[1] << 16) + (nums[2] << 8) + nums[3];
  function p(_n: number) { return false; }
}
function intToIp(n: number): string {
  return [24, 16, 8, 0].map((s) => (n >>> s) & 255).join(".");
}
function toBin(n: number): string {
  return [24, 16, 8, 0].map((s) => ((n >>> s) & 255).toString(2).padStart(8, "0")).join(".");
}

export function SubnetWidget() {
  const [ip, setIp] = useState("192.168.1.20");
  const [cidr, setCidr] = useState(24);
  const data = useMemo(() => {
    const n = ipToInt(ip);
    if (n === null) return null;
    const mask = cidr === 0 ? 0 : (0xffffffff << (32 - cidr)) >>> 0;
    const network = (n & mask) >>> 0;
    const broadcast = (network | (~mask >>> 0)) >>> 0;
    const hosts = cidr >= 31 ? (cidr === 32 ? 1 : 2) : 2 ** (32 - cidr) - 2;
    const first = cidr >= 31 ? network : network + 1;
    const last = cidr >= 31 ? broadcast : broadcast - 1;
    const first8 = n >>> 24;
    const second = (n >>> 16) & 255;
    const priv = first8 === 10 || (first8 === 172 && second >= 16 && second <= 31) || (first8 === 192 && second === 168);
    return { n, mask, network, broadcast, hosts, first, last, priv, loop: first8 === 127 };
  }, [ip, cidr]);

  return (
    <WidgetShell title="Calculadora de subredes IPv4">
      <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <label className="block">
          <span className="label">Dirección IP</span>
          <input value={ip} onChange={(e) => setIp(e.target.value)} className="field mono mt-1 !text-[20px]" aria-label="Dirección IP" />
        </label>
        <label className="block">
          <span className="label">Prefijo CIDR: /{cidr}</span>
          <input type="range" min={8} max={32} value={cidr} onChange={(e) => setCidr(Number(e.target.value))} className="mt-3 w-full" aria-label="Prefijo CIDR" />
        </label>
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        {["192.168.1.20", "10.0.5.77", "172.20.10.3", "8.8.8.8"].map((x) => (
          <button key={x} onClick={() => setIp(x)} className="mono border-2 border-black bg-[var(--surface-2)] px-2 py-0.5 text-[16px] hover:bg-[var(--surface-3)]">{x}</button>
        ))}
        {[24, 26, 28, 30, 16].map((c) => (
          <button key={c} onClick={() => setCidr(c)} className={cn("mono border-2 border-black px-2 py-0.5 text-[16px]", cidr === c ? "bg-[var(--accent)] text-[#1c0c03]" : "bg-[var(--surface-2)]")}>/{c}</button>
        ))}
      </div>
      {data ? (
        <>
          <div className="mt-3 overflow-x-auto border-2 border-black bg-[var(--bg-sunken)] p-2">
            <p className="label !m-0">En binario: <span className="text-[var(--accent-text)]">red</span> | <span className="text-[var(--emerald)]">host</span></p>
            <p className="mono !m-0 mt-1 whitespace-nowrap text-[19px]">
              {toBin(data.n).split("").map((ch, i, arr) => {
                const bitIndex = arr.slice(0, i).filter((c) => c !== ".").length;
                if (ch === ".") return <span key={i} className="text-[var(--text-3)]">.</span>;
                return <span key={i} className={bitIndex < cidr ? "text-[var(--accent-text)]" : "text-[var(--emerald)]"}>{ch}</span>;
              })}
            </p>
          </div>
          <table className="vault-table mt-2 border-2 border-black">
            <tbody>
              <tr><td>Máscara</td><td className="mono text-[18px] text-[var(--text)]">{intToIp(data.mask)}</td></tr>
              <tr><td>Dirección de red</td><td className="mono text-[18px] text-[var(--text)]">{intToIp(data.network)}</td></tr>
              <tr><td>Broadcast</td><td className="mono text-[18px] text-[var(--text)]">{intToIp(data.broadcast)}</td></tr>
              <tr><td>Rango de hosts</td><td className="mono text-[18px] text-[var(--text)]">{intToIp(data.first)} → {intToIp(data.last)}</td></tr>
              <tr><td>Hosts útiles</td><td className="mono text-[18px] text-[var(--accent-text)]">{data.hosts.toLocaleString("es")}</td></tr>
              <tr><td>Tipo</td><td className="text-[15px]">{data.loop ? "Loopback (tu propio equipo)" : data.priv ? "Privada (solo dentro de tu red)" : "Pública (visible en Internet)"}</td></tr>
            </tbody>
          </table>
        </>
      ) : (
        <p className="mt-3 border-2 border-black bg-[#2a0f0f] p-2 text-[15px]">IP no válida: deben ser 4 números de 0 a 255 separados por puntos.</p>
      )}
    </WidgetShell>
  );
}

/* ───────── Encapsulamiento ───────── */
const ENCAP = [
  { name: "Aplicación · HTTP", color: "#c08cff", header: "GET /skins HTTP/1.1  Host: tienda.juego", bytes: 20 },
  { name: "Transporte · TCP", color: "#3ee07a", header: "Puerto origen 51234 → destino 443 · seq=100", bytes: 20 },
  { name: "Red · IP", color: "#5fd3ff", header: "IP 192.168.1.20 → 13.107.4.50 · TTL=64", bytes: 20 },
  { name: "Enlace · Ethernet", color: "#ffcc33", header: "MAC aa:bb:cc:11:22:33 → router dd:ee:ff:44:55:66", bytes: 14 },
];
export function EncapWidget() {
  const [level, setLevel] = useState(0);
  const total = 20 + ENCAP.slice(1, level + 1).reduce((a, l) => a + l.bytes, 0);
  function nest(i: number): React.ReactNode {
    if (i < 0) return <span className="mono block border-2 border-black bg-white px-2 py-1 text-[18px] text-black">«Quiero la skin de Peely»</span>;
    const l = ENCAP[i];
    return (
      <div className="border-2 border-black p-1.5" style={{ background: l.color }}>
        <p className="label !m-0 !text-black">{l.name}</p>
        <p className="mono !m-0 text-[15px] text-black/80">{l.header}</p>
        <div className="mt-1">{nest(i - 1)}</div>
      </div>
    );
  }
  return (
    <WidgetShell title="Encapsulamiento: cofres dentro de cofres" badge={<span className="chip !text-[9px]">{total} bytes</span>}>
      <div className="min-h-[120px]">{nest(level)}</div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <button onClick={() => setLevel((v) => Math.max(0, v - 1))} disabled={level === 0} className="btn btn-secondary btn-sm"><Icon name="arrow-left" size={12} /> Quitar capa</button>
        <span className="text-[14px] text-[var(--text-2)]">{level < 3 ? `Siguiente: ${ENCAP[level + 1].name}` : "¡Listo para viajar por el cable!"}</span>
        <button onClick={() => setLevel((v) => Math.min(3, v + 1))} disabled={level === 3} className="btn btn-primary btn-sm">Siguiente capa <Icon name="arrow-right" size={12} /></button>
      </div>
    </WidgetShell>
  );
}

/* ───────── Firewall ───────── */
interface Packet { id: number; src: string; port: number; desc: string; bad: boolean }
const PACKETS: Packet[] = [
  { id: 1, src: "200.46.1.8", port: 443, desc: "Visitante abriendo tu web", bad: false },
  { id: 2, src: "190.140.5.20", port: 25565, desc: "Amigo entrando a tu servidor Minecraft", bad: false },
  { id: 3, src: "190.140.5.99", port: 22, desc: "Tú, administrando por SSH", bad: false },
  { id: 4, src: "45.33.12.9", port: 22, desc: "Bot probando contraseñas SSH", bad: true },
  { id: 5, src: "45.33.12.9", port: 3389, desc: "Bot buscando escritorio remoto", bad: true },
  { id: 6, src: "103.77.2.1", port: 23, desc: "Escaneo Telnet de una botnet", bad: true },
];
interface Rule { action: "PERMITIR" | "BLOQUEAR"; port: string; src: string }

export function FirewallWidget() {
  const [rules, setRules] = useState<Rule[]>([{ action: "PERMITIR", port: "443", src: "*" }]);
  const [defaultDeny, setDefaultDeny] = useState(false);
  const [ran, setRan] = useState(false);
  function evaluate(p: Packet): { pass: boolean; rule: string } {
    for (let i = 0; i < rules.length; i += 1) {
      const r = rules[i];
      const portOk = r.port === "*" || Number(r.port) === p.port;
      const srcOk = r.src === "*" || r.src.trim() === p.src;
      if (portOk && srcOk) return { pass: r.action === "PERMITIR", rule: `regla ${i + 1}` };
    }
    return { pass: !defaultDeny, rule: defaultDeny ? "política: denegar" : "política: permitir" };
  }
  const results = PACKETS.map((p) => ({ p, ...evaluate(p) }));
  const goodIn = results.filter((r) => r.pass && !r.p.bad).length;
  const badIn = results.filter((r) => r.pass && r.p.bad).length;
  const perfect = ran && badIn === 0 && goodIn === 3;
  return (
    <WidgetShell title="Configura tu firewall" badge={<span className={cn("chip !text-[9px]", perfect && "!bg-[#1f5c33] !text-white")}>{perfect ? "¡red asegurada!" : "objetivo: 3 buenos, 0 malos"}</span>}>
      <div className="space-y-1.5">
        {rules.map((r, i) => (
          <div key={i} className="flex flex-wrap items-center gap-1.5 border-2 border-black bg-[var(--surface-2)] p-1.5">
            <span className="mono w-6 text-[17px] text-[var(--text-3)]">{i + 1}</span>
            <select value={r.action} onChange={(e) => setRules((rs) => rs.map((x, k) => (k === i ? { ...x, action: e.target.value as Rule["action"] } : x)))} className="field !w-auto !py-1 !text-[13px]" aria-label="Acción">
              <option>PERMITIR</option><option>BLOQUEAR</option>
            </select>
            <span className="text-[13px] text-[var(--text-3)]">puerto</span>
            <input value={r.port} onChange={(e) => setRules((rs) => rs.map((x, k) => (k === i ? { ...x, port: e.target.value } : x)))} className="field mono !w-20 !py-1 !text-[17px]" aria-label="Puerto" />
            <span className="text-[13px] text-[var(--text-3)]">desde IP</span>
            <input value={r.src} onChange={(e) => setRules((rs) => rs.map((x, k) => (k === i ? { ...x, src: e.target.value } : x)))} className="field mono !w-36 !py-1 !text-[17px]" aria-label="IP de origen" />
            <button onClick={() => setRules((rs) => rs.filter((_, k) => k !== i))} className="btn btn-ghost btn-xs ml-auto" aria-label="Eliminar regla"><Icon name="trash" size={12} /></button>
          </div>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button onClick={() => setRules((rs) => [...rs, { action: "PERMITIR", port: "*", src: "*" }])} className="btn btn-secondary btn-xs"><Icon name="plus" size={11} /> Añadir regla</button>
        <label className="flex cursor-pointer items-center gap-2 text-[14px]">
          <input type="checkbox" checked={defaultDeny} onChange={(e) => setDefaultDeny(e.target.checked)} className="h-4 w-4 accent-[var(--accent)]" />
          Al final: <b>{defaultDeny ? "BLOQUEAR todo lo demás" : "permitir todo lo demás"}</b>
        </label>
        <button onClick={() => setRan(true)} className="btn btn-primary btn-sm ml-auto"><Icon name="play" size={12} /> Simular tráfico</button>
      </div>
      {ran && (
        <div className="mt-3 space-y-1">
          {results.map(({ p, pass, rule }) => (
            <div key={p.id} className={cn("flex flex-wrap items-center gap-2 border-2 border-black px-2 py-1.5 text-[14px]", pass ? (p.bad ? "bg-[#5a1414]" : "bg-[#1f4a2c]") : (p.bad ? "bg-[#1f3a4a]" : "bg-[#4a3a14]"))}>
              <PixelIcon name={pass ? (p.bad ? "heart" : "xp") : "sword"} size={14} />
              <span className="mono text-[17px]">{p.src}:{p.port}</span>
              <span className="text-[var(--text-2)]">{p.desc}</span>
              <span className="ml-auto label !text-white">{pass ? "PASA" : "BLOQUEADO"} · {rule}</span>
            </div>
          ))}
          <p className="!m-0 pt-1 text-[14px] text-[var(--text-2)]">
            Buenos dentro: <b className="text-[var(--emerald)]">{goodIn}/3</b> · Malos dentro: <b className={badIn ? "text-[var(--danger)]" : "text-[var(--emerald)]"}>{badIn}</b>
            {perfect ? " — ¡Perfecto! Así se configura un firewall real." : " — Pista: permite 443 y 25565 a todos, 22 solo desde 190.140.5.99 y activa «bloquear todo lo demás»."}
          </p>
        </div>
      )}
    </WidgetShell>
  );
}
