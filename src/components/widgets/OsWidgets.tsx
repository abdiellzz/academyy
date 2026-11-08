import { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "../Icon";
import { PixelIcon } from "../PixelArt";
import { WidgetShell } from "./CommonWidgets";
import { cn } from "../../utils/cn";

/* ═════════ Administrador de procesos ═════════ */
interface Proc { pid: number; name: string; user: string; cpu: number; mem: number; path: string; system?: boolean; evil?: boolean }
const BASE_PROCS: Proc[] = [
  { pid: 1, name: "systemd", user: "root", cpu: 0.2, mem: 12, path: "/usr/lib/systemd/systemd", system: true },
  { pid: 412, name: "Xorg", user: "root", cpu: 2.1, mem: 88, path: "/usr/bin/Xorg", system: true },
  { pid: 1337, name: "java (Minecraft)", user: "steve", cpu: 24, mem: 2900, path: "/usr/bin/java" },
  { pid: 1402, name: "discord", user: "steve", cpu: 3.5, mem: 410, path: "/opt/discord/Discord" },
  { pid: 1588, name: "chrome", user: "steve", cpu: 6.2, mem: 820, path: "/opt/google/chrome/chrome" },
  { pid: 2044, name: "xmrig_helper", user: "???", cpu: 61, mem: 640, path: "/tmp/.x/xmrig_helper", evil: true },
];

export function ProcessWidget() {
  const [procs, setProcs] = useState<Proc[]>(BASE_PROCS);
  const [sel, setSel] = useState<number>(2044);
  const [msg, setMsg] = useState<{ text: string; tone: "ok" | "bad" | "info" } | null>(null);
  useEffect(() => {
    const t = setInterval(() => {
      setProcs((ps) => ps.map((p) => ({ ...p, cpu: Math.max(0.1, +(p.evil ? 55 + Math.random() * 12 : p.cpu * (0.85 + Math.random() * 0.3)).toFixed(1)) })));
    }, 1200);
    return () => clearInterval(t);
  }, []);
  const total = Math.min(100, procs.reduce((a, p) => a + p.cpu, 0));
  const selected = procs.find((p) => p.pid === sel);
  function kill(p: Proc) {
    if (p.system) {
      setMsg({ text: `¡Cuidado! «${p.name}» es un proceso del sistema. Matarlo podría colgar o reiniciar el equipo. El SO lo protege y lo relanza.`, tone: "bad" });
      return;
    }
    setProcs((ps) => ps.filter((x) => x.pid !== p.pid));
    setMsg(p.evil
      ? { text: "¡Amenaza eliminada! Era un minero de criptomonedas escondido en /tmp/.x/. La CPU vuelve a la normalidad. Siguiente paso real: borrar el archivo y buscar cómo entró.", tone: "ok" }
      : { text: `Cerraste «${p.name}». No era peligroso: era tuyo. Ojo con cerrar cosas sin investigar.`, tone: "info" });
    setSel(-1);
  }
  return (
    <WidgetShell title="Administrador de tareas (simulado)" badge={<span className="chip !text-[9px]">CPU {total.toFixed(0)}%</span>}>
      <div className="xp-bar !h-4 mb-3"><span style={{ width: `${total}%`, background: total > 80 ? "#ff5a5a" : total > 50 ? "#ffcc33" : "#3ee07a" }} /></div>
      <div className="overflow-x-auto border-2 border-black">
        <table className="vault-table min-w-[520px]">
          <thead><tr><th>PID</th><th>Proceso</th><th>Usuario</th><th>CPU %</th><th>RAM MB</th></tr></thead>
          <tbody>
            {procs.map((p) => (
              <tr key={p.pid} onClick={() => setSel(p.pid)} className={cn("cursor-pointer", sel === p.pid ? "bg-[var(--surface-3)]" : "hover:bg-[var(--surface-2)]")}>
                <td className="mono text-[17px]">{p.pid}</td>
                <td className="text-[15px] text-[var(--text)]">{p.name}</td>
                <td className={cn("mono text-[17px]", p.user === "???" && "text-[var(--danger)]")}>{p.user}</td>
                <td className={cn("mono text-[17px]", p.cpu > 40 && "text-[var(--danger)]")}>{p.cpu}</td>
                <td className="mono text-[17px]">{p.mem}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selected && (
        <div className="mt-3 flex flex-wrap items-center gap-2 border-2 border-black bg-[var(--bg-sunken)] p-2.5">
          <div className="min-w-0 flex-1">
            <p className="!m-0 text-[15px] font-bold">{selected.name} <span className="mono text-[16px] text-[var(--text-3)]">PID {selected.pid}</span></p>
            <p className="mono !m-0 truncate text-[16px] text-[var(--text-2)]">ruta: {selected.path}</p>
          </div>
          <button onClick={() => kill(selected)} className="btn btn-secondary btn-sm"><Icon name="x" size={12} /> Terminar (kill {selected.pid})</button>
        </div>
      )}
      {msg && (
        <p className={cn("!m-0 mt-2 border-2 border-black p-2.5 text-[15px]", msg.tone === "ok" ? "bg-[#1f5c33]" : msg.tone === "bad" ? "bg-[#5a1414]" : "bg-[#3a3014]")}>{msg.text}</p>
      )}
      <button onClick={() => { setProcs(BASE_PROCS); setSel(2044); setMsg(null); }} className="btn btn-ghost btn-xs mt-2"><Icon name="rotate" size={11} /> Reiniciar simulación</button>
    </WidgetShell>
  );
}

/* ═════════ Planificador de CPU ═════════ */
const JOBS = [
  { id: "P1", burst: 8, color: "#f07a1e", label: "Render de Minecraft" },
  { id: "P2", burst: 2, color: "#3ee07a", label: "Mensaje de Discord" },
  { id: "P3", burst: 3, color: "#5fd3ff", label: "Música" },
  { id: "P4", burst: 1, color: "#c08cff", label: "Clic del ratón" },
];
function schedule(alg: "FCFS" | "RR", q: number) {
  const seg: { id: string; start: number; end: number }[] = [];
  const finish: Record<string, number> = {};
  if (alg === "FCFS") {
    let t = 0;
    JOBS.forEach((j) => { seg.push({ id: j.id, start: t, end: t + j.burst }); t += j.burst; finish[j.id] = t; });
  } else {
    const rem: Record<string, number> = Object.fromEntries(JOBS.map((j) => [j.id, j.burst]));
    const queue = JOBS.map((j) => j.id);
    let t = 0;
    while (queue.length) {
      const id = queue.shift() as string;
      const run = Math.min(q, rem[id]);
      const last = seg[seg.length - 1];
      if (last && last.id === id) last.end += run; else seg.push({ id, start: t, end: t + run });
      t += run; rem[id] -= run;
      if (rem[id] > 0) queue.push(id); else finish[id] = t;
    }
  }
  const waits = JOBS.map((j) => finish[j.id] - j.burst);
  return { seg, finish, waits, avg: waits.reduce((a, b) => a + b, 0) / waits.length, total: JOBS.reduce((a, j) => a + j.burst, 0) };
}

export function SchedulerWidget() {
  const [alg, setAlg] = useState<"FCFS" | "RR">("FCFS");
  const [q, setQ] = useState(2);
  const r = useMemo(() => schedule(alg, q), [alg, q]);
  const fcfs = useMemo(() => schedule("FCFS", 2), []);
  return (
    <WidgetShell title="Planificador de CPU (diagrama de Gantt)">
      <div className="flex flex-wrap items-center gap-2">
        {(["FCFS", "RR"] as const).map((a) => (
          <button key={a} onClick={() => setAlg(a)} className={cn("tab-btn border-2 !border-black", alg === a && "active")}>{a === "FCFS" ? "FCFS (orden de llegada)" : "Round Robin"}</button>
        ))}
        {alg === "RR" && (
          <label className="flex items-center gap-2 text-[14px]">Quantum: <b className="mono text-[18px]">{q}</b>
            <input type="range" min={1} max={8} value={q} onChange={(e) => setQ(Number(e.target.value))} aria-label="Quantum" />
          </label>
        )}
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {JOBS.map((j) => <span key={j.id} className="chip" style={{ color: j.color }}>{j.id} · {j.label} · {j.burst}u</span>)}
      </div>
      <div className="mt-3 overflow-x-auto">
        <div className="flex min-w-[480px] border-2 border-black">
          {r.seg.map((s, i) => {
            const job = JOBS.find((j) => j.id === s.id)!;
            return (
              <div key={i} className="flex h-12 items-center justify-center border-r-2 border-black text-[14px] font-bold text-[#1c0c03] last:border-r-0" style={{ width: `${((s.end - s.start) / r.total) * 100}%`, background: job.color }}>
                {s.id}
              </div>
            );
          })}
        </div>
        <div className="relative min-w-[480px]" style={{ height: 22 }}>
          {[0, ...r.seg.map((s) => s.end)].map((t, i) => (
            <span key={i} className="mono absolute text-[15px] text-[var(--text-3)]" style={{ left: `calc(${(t / r.total) * 100}% - 4px)` }}>{t}</span>
          ))}
        </div>
      </div>
      <table className="vault-table mt-2 border-2 border-black">
        <thead><tr><th>Proceso</th><th>Termina en</th><th>Esperó</th></tr></thead>
        <tbody>
          {JOBS.map((j, i) => (
            <tr key={j.id}><td style={{ color: j.color }}>{j.id} · {j.label}</td><td className="mono text-[17px]">{r.finish[j.id]}</td><td className="mono text-[17px]">{r.waits[i]}</td></tr>
          ))}
        </tbody>
      </table>
      <p className="!m-0 mt-2 border-2 border-black bg-[var(--bg-sunken)] p-2.5 text-[15px]">
        Espera media: <b className="mono text-[19px] text-[var(--accent-text)]">{r.avg.toFixed(2)}</b> unidades
        {alg === "RR" && <> (FCFS: {fcfs.avg.toFixed(2)}). {r.avg < fcfs.avg ? "Round Robin atiende antes a los procesos cortos: el clic del ratón ya no espera al render." : "Con este quantum la mejora es pequeña: prueba con 1 o 2."}</>}
        {alg === "FCFS" && <> El «Clic del ratón» (1 unidad) tiene que esperar 13: así se siente un equipo «trabado».</>}
      </p>
    </WidgetShell>
  );
}

/* ═════════ Jerarquía de memoria ═════════ */
const MEM = [
  { name: "Registros CPU", mc: "Lo que tienes en la mano", ns: 0.3, human: "1 segundo", size: "bytes" },
  { name: "Caché L1/L2", mc: "Hotbar (9 casillas)", ns: 1.5, human: "5 segundos", size: "KB-MB" },
  { name: "Memoria RAM", mc: "Inventario", ns: 90, human: "5 minutos", size: "8-32 GB" },
  { name: "SSD NVMe", mc: "Cofre en tu base", ns: 25000, human: "1 día", size: "1-2 TB" },
  { name: "Disco duro (HDD)", mc: "Cofre en otra aldea", ns: 5000000, human: "6 meses", size: "4+ TB" },
  { name: "Internet / nube", mc: "Ir al Nether a buscarlo", ns: 60000000, human: "6 años", size: "∞" },
];
export function MemoryWidget() {
  const [apps, setApps] = useState(3);
  const ramGB = 16;
  const used = 3 + apps * 2.2;
  const swapping = used > ramGB;
  return (
    <WidgetShell title="Jerarquía de memoria y la RAM llena">
      <div className="space-y-1.5">
        {MEM.map((m) => (
          <div key={m.name} className="grid grid-cols-[150px_minmax(0,1fr)] items-center gap-2 sm:grid-cols-[190px_minmax(0,1fr)_120px]">
            <div>
              <p className="!m-0 text-[14px] font-bold">{m.name}</p>
              <p className="!m-0 text-[12px] text-[var(--text-3)]">{m.mc}</p>
            </div>
            <div className="xp-bar !h-5"><span style={{ width: `${Math.max(3, (Math.log10(m.ns * 10) / Math.log10(600000000)) * 100)}%`, background: "repeating-linear-gradient(90deg,#5fd3ff 0 8px,#2a8fd8 8px 10px)" }} /></div>
            <p className="mono !m-0 hidden text-right text-[17px] text-[var(--accent-text)] sm:block">≈ {m.human}</p>
          </div>
        ))}
      </div>
      <p className="!m-0 mt-2 text-[13px] text-[var(--text-3)]">Escala humana: si leer un registro tardara 1 segundo… (barra en escala logarítmica)</p>
      <div className="mt-4 border-2 border-black bg-[var(--bg-sunken)] p-3">
        <label className="flex flex-wrap items-center gap-2 text-[15px]">Programas abiertos: <b className="mono text-[20px]">{apps}</b>
          <input type="range" min={0} max={9} value={apps} onChange={(e) => setApps(Number(e.target.value))} className="flex-1" aria-label="Programas abiertos" />
        </label>
        <div className="mt-2 xp-bar !h-5"><span style={{ width: `${Math.min(100, (used / ramGB) * 100)}%`, background: swapping ? "#ff5a5a" : "#3ee07a" }} /></div>
        <p className="!m-0 mt-2 text-[15px]">RAM: <b className="mono text-[19px]">{used.toFixed(1)} / {ramGB} GB</b> · {swapping
          ? <span className="text-[var(--danger)]">¡RAM llena! El SO mueve datos al disco (swap). Todo va lentísimo: es como guardar el inventario en un cofre lejano cada vez que cambias de objeto.</span>
          : <span className="text-[var(--emerald)]">Todo cabe en RAM: el equipo va fluido.</span>}
        </p>
      </div>
    </WidgetShell>
  );
}

/* ═════════ Calculadora chmod ═════════ */
export function ChmodWidget() {
  const [perm, setPerm] = useState<boolean[]>([true, true, true, true, false, true, true, false, true]);
  const who = ["Dueño (u)", "Grupo (g)", "Otros (o)"];
  const kind = ["r leer", "w escribir", "x ejecutar"];
  const digits = [0, 1, 2].map((g) => (perm[g * 3] ? 4 : 0) + (perm[g * 3 + 1] ? 2 : 0) + (perm[g * 3 + 2] ? 1 : 0));
  const octal = digits.join("");
  const symbolic = "-" + perm.map((p, i) => (p ? "rwx"[i % 3] : "-")).join("");
  function setOctal(s: string) {
    if (!/^[0-7]{3}$/.test(s)) return;
    setPerm(s.split("").flatMap((d) => { const n = Number(d); return [!!(n & 4), !!(n & 2), !!(n & 1)]; }));
  }
  const verdict = octal === "777" ? { t: "PELIGRO: cualquiera puede modificar y ejecutar. Nunca lo uses.", c: "#5a1414" }
    : perm[7] ? { t: "Otros pueden escribir: riesgo alto.", c: "#5a1414" }
    : octal === "600" || octal === "400" ? { t: "Perfecto para secretos: llaves SSH, contraseñas, .env.", c: "#1f5c33" }
    : octal === "755" ? { t: "Típico de programas y scripts: todos ejecutan, solo el dueño modifica.", c: "#1f5c33" }
    : octal === "644" ? { t: "Típico de documentos: todos leen, solo el dueño escribe.", c: "#1f5c33" }
    : { t: "Revisa si cada grupo necesita realmente esos permisos (mínimo privilegio).", c: "#3a3014" };
  return (
    <WidgetShell title="Calculadora de permisos (chmod)">
      <div className="overflow-x-auto">
        <table className="vault-table min-w-[380px] border-2 border-black">
          <thead><tr><th></th>{kind.map((k) => <th key={k}>{k}</th>)}<th>octal</th></tr></thead>
          <tbody>
            {who.map((w, g) => (
              <tr key={w}>
                <td className="text-[15px] font-bold text-[var(--text)]">{w}</td>
                {[0, 1, 2].map((k) => (
                  <td key={k}>
                    <button onClick={() => setPerm((p) => p.map((x, i) => (i === g * 3 + k ? !x : x)))}
                      className={cn("grid h-9 w-9 place-items-center border-2 border-black text-[18px] font-bold", perm[g * 3 + k] ? "bg-[var(--emerald)] text-black" : "bg-[var(--surface-3)] text-[var(--text-3)]")}
                      aria-label={`${w} ${kind[k]}`}>{perm[g * 3 + k] ? "rwx"[k] : "-"}</button>
                  </td>
                ))}
                <td className="mono text-[24px] text-[var(--accent-text)]">{digits[g]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <div className="border-2 border-black bg-[var(--bg-sunken)] p-2">
          <p className="label !m-0">Comando</p>
          <p className="mono !m-0 mt-1 text-[22px] text-[var(--emerald)]">chmod {octal} archivo</p>
        </div>
        <div className="border-2 border-black bg-[var(--bg-sunken)] p-2">
          <p className="label !m-0">Lo que verías con ls -l</p>
          <p className="mono !m-0 mt-1 text-[22px] text-[var(--blue)]">{symbolic}</p>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        {["755", "644", "600", "777"].map((o) => (
          <button key={o} onClick={() => setOctal(o)} className={cn("mono border-2 border-black px-3 py-0.5 text-[18px]", octal === o ? "bg-[var(--accent)] text-black" : "bg-[var(--surface-2)]")}>{o}</button>
        ))}
        <input placeholder="escribe 3 dígitos" onChange={(e) => setOctal(e.target.value)} className="field mono !w-40 !py-1 !text-[17px]" aria-label="Permiso octal" maxLength={3} />
      </div>
      <p className="!m-0 mt-2 border-2 border-black p-2.5 text-[15px]" style={{ background: verdict.c }}>{verdict.t}</p>
    </WidgetShell>
  );
}

/* ═════════ Terminal Linux simulada con misiones ═════════ */
type FsNode = { type: "dir" } | { type: "file"; content: string };
type Fs = Record<string, FsNode>;

const FS_BASIC: Fs = {
  "/": { type: "dir" }, "/home": { type: "dir" }, "/home/steve": { type: "dir" },
  "/home/steve/notas.txt": { type: "file", content: "Recordatorio: hacer backup de mis mundos cada domingo." },
  "/home/steve/.config_secreta": { type: "file", content: "¡Encontraste un archivo oculto! Los archivos que empiezan por punto no salen con un ls normal." },
  "/home/steve/mundos": { type: "dir" },
  "/home/steve/mundos/semilla.txt": { type: "file", content: "Semilla del mundo survival: 8675309 — no la compartas, ¡hay diamantes cerca del spawn!" },
  "/home/steve/mundos/survival": { type: "dir" },
  "/home/steve/mundos/survival/level.dat": { type: "file", content: "[datos binarios del mundo]" },
  "/etc": { type: "dir" }, "/etc/hostname": { type: "file", content: "factionvault" },
};

const FS_CTF: Fs = {
  "/": { type: "dir" }, "/home": { type: "dir" }, "/home/analista": { type: "dir" },
  "/home/analista/notas.txt": { type: "file", content: "Turno de noche. El jefe dice que alguien entró al servidor del juego. Revisa todo, incluso lo que no se ve." },
  "/home/analista/.pista": { type: "file", content: "Pista: los accesos quedan registrados en /var/log/auth.log. Busca los que fueron ACEPTADOS: grep Accepted /var/log/auth.log" },
  "/var": { type: "dir" }, "/var/log": { type: "dir" },
  "/var/log/auth.log": { type: "file", content: [
    "Nov 06 02:11:04 sshd: Failed password for root from 45.33.12.9",
    "Nov 06 02:11:09 sshd: Failed password for admin from 45.33.12.9",
    "Nov 06 02:12:30 sshd: Failed password for admin from 45.33.12.9",
    "Nov 06 02:13:55 sshd: Accepted password for admin from 45.33.12.9 — sesión abrió /opt/juego",
    "Nov 06 02:14:02 sudo: admin : COMMAND=/bin/cp loot /opt/juego/.cofre_dorado",
    "Nov 06 06:00:00 cron: backup completado",
  ].join("\n") },
  "/opt": { type: "dir" }, "/opt/juego": { type: "dir" },
  "/opt/juego/server.properties": { type: "file", content: "server-port=25565\nwhite-list=false   <- ¡mal! cualquiera puede entrar\nonline-mode=true" },
  "/opt/juego/.cofre_dorado": { type: "file", content: "🏆 FV{gr3p_y_ls_-la_s0n_tu_p1c0_d3_d14m4nt3}\n¡BANDERA ENCONTRADA! Descubriste por dónde entró el atacante (fuerza bruta SSH desde 45.33.12.9) y dónde dejó el botín." },
};

interface Objective { text: string; done: (ctx: { cmd: string; cwd: string; fs: Fs; read?: string; flags: string }) => boolean }
const MISSIONS: Record<string, { user: string; home: string; fs: Fs; objectives: Objective[] }> = {
  basico: {
    user: "steve", home: "/home/steve", fs: FS_BASIC,
    objectives: [
      { text: "Averigua dónde estás (pwd)", done: ({ cmd }) => cmd === "pwd" },
      { text: "Lista los archivos (ls)", done: ({ cmd }) => cmd.startsWith("ls") },
      { text: "Entra en la carpeta mundos (cd mundos)", done: ({ cwd }) => cwd === "/home/steve/mundos" },
      { text: "Lee semilla.txt (cat semilla.txt)", done: ({ read }) => read === "/home/steve/mundos/semilla.txt" },
      { text: "Vuelve a tu carpeta personal (cd .. o cd ~)", done: ({ cwd, cmd }) => cwd === "/home/steve" && cmd.startsWith("cd") },
      { text: "Crea una carpeta llamada base (mkdir base)", done: ({ fs }) => !!fs["/home/steve/base"] },
      { text: "Encuentra el archivo oculto (ls -la) y léelo", done: ({ read }) => read === "/home/steve/.config_secreta" },
    ],
  },
  ctf: {
    user: "analista", home: "/home/analista", fs: FS_CTF,
    objectives: [
      { text: "¿Quién eres? (whoami)", done: ({ cmd }) => cmd === "whoami" },
      { text: "Busca archivos ocultos en tu carpeta (ls -la)", done: ({ cmd, cwd, flags }) => cmd.startsWith("ls") && flags.includes("a") && cwd === "/home/analista" },
      { text: "Lee la pista oculta", done: ({ read }) => read === "/home/analista/.pista" },
      { text: "Filtra los accesos aceptados con grep", done: ({ cmd }) => /^grep\b.*accepted/i.test(cmd) },
      { text: "Explora la carpeta del juego, incluso lo oculto", done: ({ cmd, cwd, flags }) => cmd.startsWith("ls") && flags.includes("a") && (cwd === "/opt/juego" || cmd.includes("/opt/juego")) },
      { text: "Captura la bandera FV{...}", done: ({ read }) => read === "/opt/juego/.cofre_dorado" },
    ],
  },
};

function resolvePath(cwd: string, home: string, p: string): string {
  let path = p.trim();
  if (!path || path === "~") return home;
  if (path.startsWith("~/")) path = home + path.slice(1);
  const parts = (path.startsWith("/") ? path : `${cwd}/${path}`).split("/");
  const stack: string[] = [];
  for (const part of parts) {
    if (!part || part === ".") continue;
    if (part === "..") stack.pop(); else stack.push(part);
  }
  return "/" + stack.join("/");
}

export function TerminalWidget({ mission = "basico" }: { mission?: string }) {
  const m = MISSIONS[mission] ?? MISSIONS.basico;
  const [fs, setFs] = useState<Fs>(m.fs);
  const [cwd, setCwd] = useState(m.home);
  const [lines, setLines] = useState<{ t: string; kind?: "cmd" | "err" | "ok" }[]>([
    { t: `Bienvenido a FactionVault OS (simulado). Escribe «help» para ver los comandos.`, kind: "ok" },
  ]);
  const [input, setInput] = useState("");
  const [hist, setHist] = useState<string[]>([]);
  const [hIdx, setHIdx] = useState(-1);
  const [done, setDone] = useState<boolean[]>(m.objectives.map(() => false));
  const scroller = useRef<HTMLDivElement>(null);
  useEffect(() => { scroller.current?.scrollTo({ top: scroller.current.scrollHeight }); }, [lines]);

  const shortCwd = cwd === m.home ? "~" : cwd.startsWith(m.home + "/") ? "~" + cwd.slice(m.home.length) : cwd;
  const prompt = `${m.user}@factionvault:${shortCwd}$`;
  const children = (dir: string, all: boolean) => Object.keys(fs)
    .filter((p) => p !== dir && p.startsWith(dir === "/" ? "/" : dir + "/") && !p.slice(dir === "/" ? 1 : dir.length + 1).includes("/"))
    .map((p) => p.slice(p.lastIndexOf("/") + 1))
    .filter((n) => all || !n.startsWith("."))
    .sort();

  function run(raw: string) {
    const cmdline = raw.trim();
    const out: { t: string; kind?: "cmd" | "err" | "ok" }[] = [{ t: `${prompt} ${cmdline}`, kind: "cmd" }];
    if (!cmdline) { setLines((l) => [...l, ...out]); return; }
    setHist((h) => [...h, cmdline]);
    const [cmd, ...args] = cmdline.split(/\s+/);
    const flags = args.filter((a) => a.startsWith("-")).join("").replace(/-/g, "");
    const pos = args.filter((a) => !a.startsWith("-"));
    let newCwd = cwd;
    let newFs = fs;
    let read: string | undefined;
    const say = (t: string, kind?: "err" | "ok") => out.push({ t, kind });

    switch (cmd) {
      case "help":
        say("Comandos: pwd, ls [-la] [ruta], cd [ruta], cat archivo, whoami, id, echo texto, mkdir nombre, touch nombre, rm archivo, grep [-i] [-c] patrón archivo, history, uname -a, ps, date, clear, sudo");
        break;
      case "pwd": say(cwd); break;
      case "whoami": say(m.user); break;
      case "id": say(`uid=1000(${m.user}) gid=1000(${m.user}) grupos=1000(${m.user}),27(sudo)`); break;
      case "date": say(new Date().toString()); break;
      case "uname": say(flags.includes("a") ? "Linux factionvault 6.8.0-fv #1 SMP x86_64 GNU/Linux" : "Linux"); break;
      case "echo": say(pos.join(" ")); break;
      case "history": hist.forEach((h, i) => say(`${String(i + 1).padStart(4)}  ${h}`)); break;
      case "ps": say("  PID TTY      CMD\n 1001 pts/0    bash\n 1337 pts/0    java -jar server.jar\n 2210 pts/0    ps"); break;
      case "clear": setLines([]); setInput(""); return;
      case "sudo": say(`[sudo] contraseña para ${m.user}: \n${m.user} no está en el archivo sudoers. Este incidente será reportado. 😅 (Buen intento: en un CTF real, escalar privilegios es otra fase.)`, "err"); break;
      case "ls": {
        const target = resolvePath(cwd, m.home, pos[0] ?? ".");
        const node = fs[target];
        if (!node) { say(`ls: no se puede acceder a '${pos[0]}': No existe el archivo o directorio`, "err"); break; }
        if (node.type === "file") { say(pos[0]); break; }
        const names = children(target, flags.includes("a"));
        if (flags.includes("l")) {
          if (flags.includes("a")) { say(`drwxr-xr-x  ${m.user} ${m.user}  4096 .`); say(`drwxr-xr-x  root  root   4096 ..`); }
          names.forEach((n) => {
            const full = target === "/" ? `/${n}` : `${target}/${n}`;
            const nd = fs[full];
            const isDir = nd.type === "dir";
            const size = nd.type === "file" ? nd.content.length : 4096;
            say(`${isDir ? "d" : "-"}${n.startsWith(".") ? "rw-------" : isDir ? "rwxr-xr-x" : "rw-r--r--"}  ${m.user} ${m.user} ${String(size).padStart(5)} ${n}${isDir ? "/" : ""}`);
          });
        } else say(names.map((n) => (fs[target === "/" ? `/${n}` : `${target}/${n}`].type === "dir" ? n + "/" : n)).join("   ") || "");
        break;
      }
      case "cd": {
        const target = resolvePath(cwd, m.home, pos[0] ?? "~");
        if (!fs[target]) say(`cd: ${pos[0]}: No existe el archivo o directorio`, "err");
        else if (fs[target].type !== "dir") say(`cd: ${pos[0]}: No es un directorio`, "err");
        else newCwd = target;
        break;
      }
      case "cat": {
        if (!pos[0]) { say("cat: falta el nombre del archivo", "err"); break; }
        const target = resolvePath(cwd, m.home, pos[0]);
        const node = fs[target];
        if (!node) say(`cat: ${pos[0]}: No existe el archivo o directorio`, "err");
        else if (node.type === "dir") say(`cat: ${pos[0]}: Es un directorio`, "err");
        else { node.content.split("\n").forEach((l) => say(l, target.includes("cofre") ? "ok" : undefined)); read = target; }
        break;
      }
      case "grep": {
        const [pattern, file] = pos;
        if (!pattern || !file) { say("uso: grep [-i] [-c] patrón archivo", "err"); break; }
        const target = resolvePath(cwd, m.home, file);
        const node = fs[target];
        if (!node || node.type !== "file") { say(`grep: ${file}: No existe el archivo`, "err"); break; }
        const re = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), flags.includes("i") ? "i" : "");
        const hits = node.content.split("\n").filter((l) => re.test(l));
        if (flags.includes("c")) say(String(hits.length)); else hits.forEach((h) => say(h, "ok"));
        break;
      }
      case "mkdir": case "touch": {
        if (!pos[0]) { say(`${cmd}: falta un operando`, "err"); break; }
        const target = resolvePath(cwd, m.home, pos[0]);
        if (fs[target]) { if (cmd === "mkdir") say(`mkdir: no se puede crear '${pos[0]}': El archivo ya existe`, "err"); break; }
        newFs = { ...fs, [target]: cmd === "mkdir" ? { type: "dir" } : { type: "file", content: "" } };
        break;
      }
      case "rm": {
        const target = resolvePath(cwd, m.home, pos[0] ?? "");
        if (!fs[target]) { say(`rm: no se puede borrar '${pos[0] ?? ""}': No existe`, "err"); break; }
        if (fs[target].type === "dir") { say(`rm: no se puede borrar '${pos[0]}': Es un directorio (usa rm -r con mucho cuidado)`, "err"); break; }
        const copy = { ...fs }; delete copy[target]; newFs = copy;
        break;
      }
      case "nano": case "vim": case "vi": say(`${cmd}: el editor no está disponible en el simulador. Usa echo y cat.`, "err"); break;
      default: say(`${cmd}: orden no encontrada. Escribe «help».`, "err");
    }

    setFs(newFs);
    setCwd(newCwd);
    const ctx = { cmd: cmdline.toLowerCase(), cwd: newCwd, fs: newFs, read, flags };
    const next = [...done];
    const firstPending = next.findIndex((d) => !d);
    if (firstPending !== -1 && m.objectives[firstPending].done({ ...ctx, cmd: cmdline })) {
      next[firstPending] = true;
      out.push({ t: `✔ Objetivo cumplido: ${m.objectives[firstPending].text}`, kind: "ok" });
      if (next.every(Boolean)) out.push({ t: "🏆 ¡MISIÓN COMPLETADA! Eres oficialmente peligroso con una terminal.", kind: "ok" });
    }
    setDone(next);
    setLines((l) => [...l, ...out]);
  }

  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") { run(input); setInput(""); setHIdx(-1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); const i = hIdx === -1 ? hist.length - 1 : Math.max(0, hIdx - 1); if (hist[i]) { setHIdx(i); setInput(hist[i]); } }
    else if (e.key === "ArrowDown") { e.preventDefault(); const i = hIdx + 1; if (i >= hist.length) { setHIdx(-1); setInput(""); } else { setHIdx(i); setInput(hist[i]); } }
    else if (e.key === "Tab") {
      e.preventDefault();
      const parts = input.split(" ");
      const last = parts[parts.length - 1];
      const base = last.includes("/") ? last.slice(0, last.lastIndexOf("/") + 1) : "";
      const dir = resolvePath(cwd, m.home, base || ".");
      const frag = last.slice(base.length);
      const opts = children(dir, frag.startsWith(".")).filter((n) => n.startsWith(frag));
      if (opts.length === 1) { parts[parts.length - 1] = base + opts[0]; setInput(parts.join(" ")); }
    }
  }

  const current = done.findIndex((d) => !d);
  return (
    <WidgetShell title={mission === "ctf" ? "Terminal · Misión CTF" : "Terminal Linux · Misión básica"} badge={<span className="chip !text-[9px]">{done.filter(Boolean).length}/{done.length} objetivos</span>}>
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_230px]">
        <div className="term" onClick={() => document.getElementById(`term-${mission}`)?.focus()} >
          <div ref={scroller} className="h-[300px] overflow-y-auto p-3">
            {lines.map((l, i) => (
              <div key={i} className={cn("whitespace-pre-wrap break-words", l.kind === "cmd" && "text-[#d8ffd8]", l.kind === "err" && "text-[#ff8a8a]", l.kind === "ok" && "text-[#ffe14a]")}>{l.t}</div>
            ))}
            <div className="flex gap-2">
              <span className="shrink-0 text-[#5fd3ff]">{prompt}</span>
              <input id={`term-${mission}`} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={onKey}
                className="min-w-0 flex-1 bg-transparent text-[#8dff9e] outline-none" autoComplete="off" spellCheck={false} aria-label="Comando de terminal" />
            </div>
          </div>
        </div>
        <div className="border-2 border-black bg-[var(--surface-2)] p-2.5">
          <p className="label !m-0 !text-[var(--accent-text)]">Objetivos</p>
          <ol className="m-0 mt-2 list-none space-y-1.5 p-0">
            {m.objectives.map((o, i) => (
              <li key={o.text} className={cn("flex gap-2 text-[14px] leading-snug", done[i] ? "text-[var(--emerald)]" : i === current ? "text-[var(--text)]" : "text-[var(--text-3)]")}>
                <span className="mono shrink-0 text-[17px]">{done[i] ? "✔" : i === current ? "▶" : "·"}</span>{o.text}
              </li>
            ))}
          </ol>
          <button onClick={() => { setFs(m.fs); setCwd(m.home); setLines([{ t: "Terminal reiniciada.", kind: "ok" }]); setDone(m.objectives.map(() => false)); setHist([]); }} className="btn btn-ghost btn-xs mt-3"><Icon name="rotate" size={11} /> Reiniciar</button>
          <div className="mt-2 flex items-center gap-1.5 text-[12px] text-[var(--text-3)]"><PixelIcon name="key" size={10} /> Tab autocompleta · ↑ repite</div>
        </div>
      </div>
    </WidgetShell>
  );
}
