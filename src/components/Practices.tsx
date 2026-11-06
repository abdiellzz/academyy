import { useEffect, useMemo, useState } from "react";
import { PixelIcon } from "./PixelArt";
import { Bar, CopyBtn, Term } from "./ui";
import { FlowStepper, LayerStack, MatchGame } from "./widgets/CommonWidgets";
import { BinaryWidget, EncapWidget, FirewallWidget, SubnetWidget } from "./widgets/NetWidgets";
import { ChmodWidget, MemoryWidget, ProcessWidget, SchedulerWidget, TerminalWidget } from "./widgets/OsWidgets";
import { aesCifrar, aesDescifrar, caesar, entropia, modPow, normalizar, sha, tiempoCrack } from "../lib/crypto";
import { BruteLab, FirmaLab, FrecuenciaLab, KdfLab, RsaLab, VigenereLab, XorLab } from "./widgets/CryptoWidgets";
import { LogsLab, PaquetesLab, PythonLab, RedesLab } from "./widgets/LabWidgets";
import { C } from "../lib/content";
import type { MensajePhishing, Practica } from "../types";
import { cn } from "../utils/cn";

type Done = () => void;

function Shell({ title, icon = "pickaxe", children }: { title: string; icon?: Parameters<typeof PixelIcon>[0]["name"]; children: React.ReactNode }) {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center gap-2 border-b-2 border-black bg-[var(--surface-3)] px-3 py-2">
        <PixelIcon name={icon} size={15} /><span className="label !text-[var(--text)]">{title}</span>
        <span className="chip ml-auto !text-[9px] !text-[var(--green)]">práctica</span>
      </div>
      <div className="p-3 sm:p-4">{children}</div>
    </div>
  );
}

function Hecho({ onDone, texto = "Ya lo practiqué" }: { onDone: Done; texto?: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button className={cn("btn btn-sm mt-3", ok ? "btn-green" : "")} onClick={() => { setOk(true); onDone(); }} disabled={ok}>
      <PixelIcon name={ok ? "diamond" : "xp"} size={12} /> {ok ? "¡Práctica completada!" : texto}
    </button>
  );
}

/* ───────── Código con ejecución simulada (salida verificada con Python real) ───────── */
function Codigo({ p, onDone }: { p: Extract<Practica, { tipo: "codigo" }>; onDone: Done }) {
  const [shown, setShown] = useState(0);
  const [running, setRunning] = useState(false);
  const [guess, setGuess] = useState("");
  const [guessed, setGuessed] = useState<null | boolean>(null);
  const firstLine = p.salida.split("\n")[0];
  function run() {
    setRunning(true); setShown(0);
    const total = p.salida.length;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setShown(total); setRunning(false); onDone(); return; }
    let i = 0;
    const t = setInterval(() => { i += Math.max(2, Math.ceil(total / 40)); setShown(Math.min(i, total)); if (i >= total) { clearInterval(t); setRunning(false); onDone(); } }, 30);
  }
  return (
    <Shell title="main.py · Python 3" icon="snake">
      <div className="flex items-center justify-between gap-2"><p className="label">Código</p><CopyBtn value={p.codigo} /></div>
      <pre className="code-pixel mt-1.5 p-3" data-allow-copy>{p.codigo}</pre>
      <div className="mt-3 border-2 border-black bg-[var(--surface-2)] p-3">
        <label className="label !text-[var(--accent)]" htmlFor={`g-${firstLine}`}>Antes de ejecutar: ¿qué crees que imprime la primera línea?</label>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input id={`g-${firstLine}`} className="field mono" value={guess} onChange={(e) => { setGuess(e.target.value); setGuessed(null); }} placeholder="tu predicción…" />
          <button className="btn btn-sm" onClick={() => setGuessed(normalizar(guess) === normalizar(firstLine))}>Comprobar</button>
        </div>
        {guessed !== null && <p className={cn("mt-2", guessed ? "text-[var(--green)]" : "text-[var(--accent)]")}>{guessed ? "¡Exacto! Leíste el código como una máquina." : "No exactamente. Ejecútalo y compara: así se entrena el ojo."}</p>}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button className="btn btn-green btn-sm" onClick={run} disabled={running}><PixelIcon name="xp" size={12} /> {running ? "Ejecutando…" : "Ejecutar"}</button>
        <span className="self-center text-[14px] text-[var(--text-3)]">Ejecución simulada: la salida fue verificada con Python 3 real.</span>
      </div>
      {shown > 0 && <div className="mt-3"><Term title="salida">{p.salida.slice(0, shown)}{running && <span className="caret">█</span>}</Term></div>}
      {p.explicacion && shown > 0 && !running && <p className="mt-3 border-2 border-black bg-[#0f2418] p-3"><b className="text-[var(--green)]">¿Por qué? </b>{p.explicacion}</p>}
      {p.reto && (
        <div className="mt-3 border-2 border-black bg-[#2a1d0c] p-3">
          <p className="label !text-[var(--accent)]">Reto para tu PC</p>
          <p className="mt-1 font-bold">{p.reto.enunciado}</p>
          {p.reto.pista && <p className="mono mt-1 text-[var(--text-2)]">Pista: {p.reto.pista}</p>}
          <p className="mt-1 text-[15px] text-[var(--text-2)]">Si lo haces bien, deberías ver: <span className="mono text-[var(--green)]">{p.reto.debes_ver}</span></p>
        </div>
      )}
    </Shell>
  );
}

/* ───────── Ordenar pasos ───────── */
function Orden({ p, onDone }: { p: Extract<Practica, { tipo: "orden" }>; onDone: Done }) {
  const initial = useMemo(() => { const a = [...p.pasos]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } if (a.join() === p.pasos.join()) a.reverse(); return a; }, [p.pasos]);
  const [list, setList] = useState(initial);
  const [check, setCheck] = useState<null | boolean>(null);
  const move = (i: number, d: number) => { const j = i + d; if (j < 0 || j >= list.length) return; const a = [...list]; [a[i], a[j]] = [a[j], a[i]]; setList(a); setCheck(null); };
  return (
    <Shell title={p.titulo} icon="torch">
      <p className="text-[15px] text-[var(--text-2)]">Usa las flechas para ponerlos en el orden correcto.</p>
      <ol className="m-0 mt-3 list-none space-y-1.5 p-0">
        {list.map((s, i) => (
          <li key={s} className={cn("flex items-center gap-2 border-2 border-black p-2", check === null ? "bg-[var(--surface-2)]" : s === p.pasos[i] ? "bg-[#16301f]" : "bg-[#3a1418]")}>
            <span className="step-dot">{i + 1}</span>
            <span className="flex-1">{s}</span>
            <button className="btn btn-xs" aria-label={`Subir «${s}»`} onClick={() => move(i, -1)} disabled={i === 0}>▲</button>
            <button className="btn btn-xs" aria-label={`Bajar «${s}»`} onClick={() => move(i, 1)} disabled={i === list.length - 1}>▼</button>
          </li>
        ))}
      </ol>
      <button className="btn btn-primary btn-sm mt-3" onClick={() => { const ok = list.join("|") === p.pasos.join("|"); setCheck(ok); if (ok) onDone(); }}>Comprobar orden</button>
      {check !== null && <p className={cn("mt-2", check ? "text-[var(--green)]" : "text-[var(--accent)]")}>{check ? "¡Orden perfecto! Eso es pensar como un profesional." : "Todavía no. Los pasos en rojo están fuera de lugar."}</p>}
    </Shell>
  );
}

/* ───────── Escribir la respuesta ───────── */
function Escribir({ p, onDone }: { p: Extract<Practica, { tipo: "escribir" }>; onDone: Done }) {
  const [v, setV] = useState("");
  const [res, setRes] = useState<null | boolean>(null);
  const [pista, setPista] = useState(false);
  function check() { const ok = p.respuestas.some((r) => normalizar(r) === normalizar(v)); setRes(ok); if (ok) onDone(); }
  return (
    <Shell title="Responde tú" icon="key">
      <label htmlFor={`e-${p.pregunta}`} className="block text-[18px] font-bold">{p.pregunta}</label>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <input id={`e-${p.pregunta}`} className={cn("field mono", res === false && "shake")} value={v} onChange={(e) => { setV(e.target.value); setRes(null); }} onKeyDown={(e) => e.key === "Enter" && check()} />
        <button className="btn btn-primary btn-sm" onClick={check}>Comprobar</button>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        {p.pista && <button className="text-[14px] text-[var(--accent)] underline" onClick={() => setPista((x) => !x)}>{pista ? "Ocultar pista" : "Ver pista"}</button>}
        <span className="text-[13px] text-[var(--text-3)]">No importan mayúsculas ni tildes.</span>
      </div>
      {pista && <p className="mono mt-1 text-[var(--text-2)]">{p.pista}</p>}
      {res !== null && <p className={cn("mt-2 border-2 border-black p-2.5", res ? "bg-[#16301f]" : "bg-[#2a1d0c]")}>{res ? <><b className="text-[var(--green)]">¡Correcto! </b>{p.explicacion}</> : "Mmm, no. Revisa la pista e inténtalo otra vez."}</p>}
    </Shell>
  );
}

/* ───────── Detector de phishing ───────── */
const CANAL: Record<MensajePhishing["canal"], { label: string; bg: string }> = {
  sms: { label: "SMS", bg: "#12202c" }, whatsapp: { label: "WhatsApp", bg: "#0f2418" }, email: { label: "Correo", bg: "#1d1730" }, dm: { label: "Mensaje directo", bg: "#241030" },
};
export function PhishingGame({ cantidad = 5, onFinish }: { cantidad?: number; onFinish?: (aciertos: number, total: number) => void }) {
  const ronda = useMemo(() => [...C.phishing].sort(() => Math.random() - 0.5).slice(0, Math.min(cantidad, C.phishing.length)), [cantidad]);
  const [i, setI] = useState(0);
  const [answer, setAnswer] = useState<null | boolean>(null);
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const m = ronda[i];
  function pick(esPhish: boolean) { if (answer !== null) return; setAnswer(esPhish); if (esPhish === m.es_phishing) setScore((s) => s + 1); }
  function next() {
    if (i + 1 >= ronda.length) { setOver(true); onFinish?.(score, ronda.length); return; }
    setI(i + 1); setAnswer(null);
  }
  if (over) return (
    <Shell title="Detector de phishing" icon="flag">
      <div className="text-center">
        <PixelIcon name={score === ronda.length ? "diamond" : "heart"} size={48} />
        <p className="mt-3 text-[22px]" style={{ fontFamily: "var(--font-title)" }}>{score}/{ronda.length}</p>
        <p className="mt-2 text-[var(--text-2)]">{score === ronda.length ? "¡Impecable! No te eligen a ti, eligen al que se deja… y tú no te dejas." : score >= ronda.length * 0.6 ? "¡Bien! Repasa los que fallaste: el detalle está en el dominio y en la prisa." : "Ojo, que así es como pican. Vuelve a leer las señales y repite."}</p>
        <button className="btn btn-primary btn-sm mt-4" onClick={() => { setI(0); setScore(0); setAnswer(null); setOver(false); }}>Jugar otra vez</button>
      </div>
    </Shell>
  );
  const correct = answer !== null && answer === m.es_phishing;
  return (
    <Shell title={`Detector de phishing · ${i + 1}/${ronda.length}`} icon="flag">
      <Bar value={(i / ronda.length) * 100} />
      <div className="mt-3 border-2 border-black p-3" style={{ background: CANAL[m.canal].bg }}>
        <div className="flex flex-wrap items-center gap-2"><span className="chip">{CANAL[m.canal].label}</span><span className="mono text-[var(--text-2)]">{m.remitente}</span></div>
        {m.asunto && <p className="mt-2 font-bold">Asunto: {m.asunto}</p>}
        <p className="mt-2 whitespace-pre-wrap text-[18px] leading-relaxed">{m.mensaje}</p>
        {m.enlace && <p className="mono mt-2 break-all text-[var(--cyan)] underline">{m.enlace}</p>}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button className="btn" onClick={() => pick(false)} disabled={answer !== null} aria-pressed={answer === false}>✔ Es legítimo</button>
        <button className="btn" onClick={() => pick(true)} disabled={answer !== null} aria-pressed={answer === true}>🎣 Es phishing</button>
      </div>
      {answer !== null && (
        <div className={cn("mt-3 border-2 border-black p-3", correct ? "bg-[#16301f]" : "bg-[#3a1418]")} role="status">
          <p className="font-bold">{correct ? "¡Bien visto!" : "¡Picaste!"} Era {m.es_phishing ? "PHISHING" : "LEGÍTIMO"}.</p>
          <ul className="m-0 mt-2 list-none space-y-1 p-0">{m.senales.map((s) => <li key={s} className="flex gap-2 text-[15px]"><PixelIcon name={m.es_phishing ? "heart" : "xp"} size={11} className="mt-1 shrink-0" />{s}</li>)}</ul>
          <p className="mt-2 text-[15px] text-[var(--text-2)]">{m.explicacion}</p>
          <button className="btn btn-primary btn-sm mt-3" onClick={next}>{i + 1 >= ronda.length ? "Ver resultado" : "Siguiente mensaje"}</button>
        </div>
      )}
    </Shell>
  );
}

/* ───────── Cripto ───────── */
function Cesar({ onDone }: { onDone: Done }) {
  const [t, setT] = useState("QUE XOPA PANAMA");
  const [k, setK] = useState(3);
  const [dec, setDec] = useState(false);
  const out = caesar(t, k, dec);
  const AB = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return (
    <Shell title="Rueda de César" icon="key">
      <div className="flex gap-1">{(["Cifrar", "Descifrar"] as const).map((x, i) => <button key={x} className={cn("tab-btn", dec === (i === 1) && "active")} onClick={() => setDec(i === 1)}>{x}</button>)}</div>
      <label className="label mt-3 block" htmlFor="ces-t">Mensaje</label>
      <input id="ces-t" className="field mono mt-1" value={t} onChange={(e) => setT(e.target.value)} />
      <label className="mt-3 flex items-center gap-3"><span className="label">Clave</span><input type="range" min={0} max={25} value={k} onChange={(e) => setK(+e.target.value)} className="flex-1" aria-label="Desplazamiento" /><span className="mono text-[24px] text-[var(--accent)]">{k}</span></label>
      <div className="mt-3 overflow-x-auto border-2 border-black bg-[var(--bg-sunken)] p-2">
        <div className="flex min-w-[460px] gap-[2px]">{AB.split("").map((c, i) => <div key={c} className="flex-1 text-center"><div className="mono text-[var(--text-3)]">{c}</div><div className="mono border border-black bg-[var(--surface-3)]">{AB[(i + k) % 26]}</div></div>)}</div>
      </div>
      <Term title="resultado">{out || "—"}</Term>
      <Hecho onDone={onDone} />
    </Shell>
  );
}

function Hash({ onDone }: { onDone: Done }) {
  const [a, setA] = useState("factionvault");
  const [b, setB] = useState("Factionvault");
  const [h, setH] = useState({ a: "", b: "" });
  useEffect(() => { let live = true; Promise.all([sha(a), sha(b)]).then(([x, y]) => live && setH({ a: x, b: y })); return () => { live = false; }; }, [a, b]);
  const diff = h.a && h.b ? Math.round(([...h.a].filter((c, i) => c !== h.b[i]).length / h.a.length) * 100) : 0;
  return (
    <Shell title="Laboratorio de huellas SHA-256" icon="diamond">
      <div className="grid gap-2 sm:grid-cols-2">
        <label><span className="label">Texto A</span><input className="field mono mt-1" value={a} onChange={(e) => setA(e.target.value)} /></label>
        <label><span className="label">Texto B</span><input className="field mono mt-1" value={b} onChange={(e) => setB(e.target.value)} /></label>
      </div>
      <div className="mt-3 space-y-2">
        <Term title="SHA-256 de A">{h.a}</Term>
        <Term title="SHA-256 de B">{[...h.b].map((c, i) => <span key={i} style={{ color: c !== h.a[i] ? "var(--accent)" : "#4a6a52" }}>{c}</span>)}</Term>
      </div>
      <p className="mt-2">Caracteres distintos: <b className="mono text-[24px] text-[var(--accent)]">{diff}%</b> {diff > 80 ? "— ¡efecto avalancha!" : a === b ? "— mismo texto, misma huella." : ""}</p>
      <Hecho onDone={onDone} />
    </Shell>
  );
}

function Password({ onDone }: { onDone: Done }) {
  const [pw, setPw] = useState("panama2026");
  const [show, setShow] = useState(false);
  const bits = entropia(pw);
  const col = bits < 40 ? "var(--red)" : bits < 60 ? "var(--accent)" : bits < 80 ? "var(--green)" : "var(--cyan)";
  const verdict = bits < 40 ? "Muy débil" : bits < 60 ? "Floja" : bits < 80 ? "Fuerte" : "Blindada";
  return (
    <Shell title="Medidor de contraseñas" icon="key">
      <label className="label" htmlFor="pw">Escribe una contraseña (no sale de tu navegador)</label>
      <div className="mt-1 flex gap-2">
        <input id="pw" type={show ? "text" : "password"} className="field mono" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="off" />
        <button className="btn btn-sm" onClick={() => setShow((x) => !x)} aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}>{show ? "Ocultar" : "Ver"}</button>
      </div>
      <div className="mt-2 flex flex-wrap gap-1">{["123456", "P@ssw0rd!", "Panama2026", "taza-montaña-río-bosque-42"].map((x) => <button key={x} className="chip hover:text-white" onClick={() => setPw(x)}>{x}</button>)}</div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div className="border-2 border-black bg-[var(--bg-sunken)] p-2"><p className="label">Entropía</p><p className="mono text-[28px]" style={{ color: col }}>{bits} bits</p></div>
        <div className="border-2 border-black bg-[var(--bg-sunken)] p-2"><p className="label">Veredicto</p><p className="mt-1 font-bold" style={{ color: col }}>{verdict}</p></div>
        <div className="border-2 border-black bg-[var(--bg-sunken)] p-2"><p className="label">Fuerza bruta</p><p className="mt-1 text-[14px] font-bold">{tiempoCrack(bits)}</p></div>
      </div>
      <div className="mt-2"><Bar value={(bits / 110) * 100} color={col} /></div>
      <p className="mt-2 text-[14px] text-[var(--text-3)]">Supone un atacante con tarjetas gráficas (10.000 millones de intentos por segundo). Las palabras comunes cuentan la mitad.</p>
      <Hecho onDone={onDone} />
    </Shell>
  );
}

function Aes({ onDone }: { onDone: Done }) {
  const [msg, setMsg] = useState("Los planos están en la bóveda");
  const [pass, setPass] = useState("taza-montaña-río");
  const [ct, setCt] = useState("");
  const [res, setRes] = useState<null | { ok: boolean; texto: string }>(null);
  return (
    <Shell title="AES-256-GCM real (WebCrypto)" icon="chest">
      <div className="grid gap-2 sm:grid-cols-2">
        <label><span className="label">Mensaje</span><input className="field mt-1" value={msg} onChange={(e) => setMsg(e.target.value)} /></label>
        <label><span className="label">Contraseña</span><input className="field mono mt-1" value={pass} onChange={(e) => setPass(e.target.value)} /></label>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button className="btn btn-primary btn-sm" onClick={async () => { setCt(await aesCifrar(msg, pass)); setRes(null); }}>🔒 Cifrar</button>
        <button className="btn btn-sm" disabled={!ct} onClick={async () => { const r = await aesDescifrar(ct, pass); setRes(r); if (r.ok) onDone(); }}>🔓 Descifrar</button>
      </div>
      {ct && (
        <div className="mt-3">
          <label className="label" htmlFor="aes-ct">Cifrado (edítalo para «hackearlo» y vuelve a descifrar)</label>
          <textarea id="aes-ct" className="field mono mt-1 break-all" rows={3} value={ct} onChange={(e) => { setCt(e.target.value); setRes(null); }} />
          <p className="mt-1 text-[14px] text-[var(--text-3)]">Formato FV.sal.iv.datos — cifra otra vez y verás que cambia todo por la sal y el IV aleatorios.</p>
        </div>
      )}
      {res && <p className={cn("mt-2 border-2 border-black p-2.5", res.ok ? "bg-[#16301f]" : "bg-[#3a1418]")}>{res.ok ? <>Descifrado: <b>{res.texto}</b></> : res.texto}</p>}
    </Shell>
  );
}

function DH({ onDone }: { onDone: Done }) {
  const p = 23, g = 5;
  const [a, setA] = useState(6);
  const [b, setB] = useState(15);
  const A = modPow(g, a, p), B = modPow(g, b, p);
  const sa = modPow(B, a, p), sb = modPow(A, b, p);
  return (
    <Shell title="Diffie-Hellman sin magia" icon="globe">
      <p className="mono text-[var(--text-2)]">Público: p = {p}, g = {g}</p>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        <div className="border-2 border-black bg-[#0c1f2c] p-3"><label className="label !text-[var(--cyan)]">Ana · secreto a = {a}</label><input type="range" min={2} max={20} value={a} onChange={(e) => setA(+e.target.value)} className="mt-2 w-full" aria-label="Secreto de Ana" /><p className="mono">envía A = 5^{a} mod 23 = <b className="text-[var(--cyan)]">{A}</b></p></div>
        <div className="border-2 border-black bg-[#241030] p-3"><label className="label !text-[var(--violet)]">Beto · secreto b = {b}</label><input type="range" min={2} max={20} value={b} onChange={(e) => setB(+e.target.value)} className="mt-2 w-full" aria-label="Secreto de Beto" /><p className="mono">envía B = 5^{b} mod 23 = <b className="text-[var(--violet)]">{B}</b></p></div>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2 text-center">
        <div className="border-2 border-black bg-[var(--bg-sunken)] p-2"><p className="label">Ana calcula B^a</p><p className="mono text-[30px] text-[var(--green)]">{sa}</p></div>
        <div className="border-2 border-black bg-[var(--bg-sunken)] p-2"><p className="label">Beto calcula A^b</p><p className="mono text-[30px] text-[var(--green)]">{sb}</p></div>
      </div>
      <p className="mt-2">{sa === sb ? "¡Mismo secreto y nunca lo enviaron! El espía vio 5, 23, " + A + " y " + B + ", pero no puede calcularlo." : ""}</p>
      <Hecho onDone={onDone} />
    </Shell>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Widget({ w, props, onDone }: { w: string; props?: any; onDone: Done }) {
  const map: Record<string, React.ReactNode> = {
    flow: <FlowStepper {...props} />, layers: <LayerStack {...props} />, match: <MatchGame {...props} />,
    binary: <BinaryWidget />, subnet: <SubnetWidget />, encap: <EncapWidget />, firewall: <FirewallWidget />,
    procs: <ProcessWidget />, scheduler: <SchedulerWidget />, memory: <MemoryWidget />, chmod: <ChmodWidget />,
    terminal: <TerminalWidget mission={props?.mission} />,
    xor: <XorLab />, rsa: <RsaLab />, firma: <FirmaLab />, frecuencia: <FrecuenciaLab />,
    kdf: <KdfLab />, brute: <BruteLab />, vigenere: <VigenereLab />,
    python: <PythonLab />, paquetes: <PaquetesLab />, redes: <RedesLab />, logs: <LogsLab />,
  };
  return <div>{map[w] ?? <p>Simulador «{w}» no disponible.</p>}<Hecho onDone={onDone} /></div>;
}

/* Explicación por defecto cuando la práctica no trae su propio «porque».
   Así TODO el laboratorio explica por qué se hace lo que se hace. */
const PORQUE_GENERICO: Record<string, string> = {
  codigo:
    "Predecir la salida antes de ejecutar y después comparar es la forma más rápida de aprender: la diferencia entre lo que esperabas y lo que salió es exactamente lo que te faltaba entender.",
  orden:
    "El orden es la lección. En seguridad y en redes, hacer lo correcto en el orden equivocado deja el mismo hueco: primero se corta el acceso, después se limpia.",
  escribir:
    "Escribirlo con tus palabras obliga al cerebro a recuperarlo, no solo a reconocerlo. Lo que recuperas se queda; lo que solo lees se olvida al día siguiente.",
  phishing:
    "Los reflejos se entrenan con ejemplos reales. La próxima vez no vas a tener tiempo de razonar: vas a tener dos segundos para notar el remitente o el dominio.",
  cesar:
    "Un César se rompe probando 25 posibilidades. La lección no es el cifrado, es que la fuerza bruta siempre gana cuando el espacio de claves es pequeño.",
  hash:
    "Un hash no se puede revertir y cambia por completo con un solo carácter: por eso sirve para comprobar integridad y para guardar contraseñas sin guardar la contraseña.",
  password:
    "La entropía manda. La longitud multiplica las combinaciones mucho más rápido que cualquier símbolo raro, y eso es justo lo que mide el medidor.",
  aes:
    "Cifrar de verdad (con WebCrypto, no una simulación) muestra por qué hacen falta contraseña, sal y un algoritmo serio: ahí no hay adornos.",
  dh:
    "Dos desconocidos acuerdan un secreto sin enviarlo nunca. Eso es la base de cada conexión HTTPS que abres todos los días.",
  "w:terminal":
    "En la terminal se ve lo que de verdad pasa en el sistema, sin ventanas de por medio. Por eso casi todos los manuales de seguridad te mandan ahí.",
  "w:subnet":
    "Dividir una red en subredes es decidir quién puede hablar con quién sin comprar un router nuevo: es segmentación, la misma idea que un firewall pero a nivel de direcciones.",
  "w:firewall":
    "Un firewall es una lista de decisiones: por defecto se niega todo y se abre solo lo que hace falta. Ese «por defecto cerrado» es lo que evita la mayoría de sorpresas.",
  "w:chmod":
    "Los permisos son el control de acceso más antiguo de Unix y siguen salvando servidores: si un archivo no necesita ser escribible por todos, no debe serlo.",
  "w:binary":
    "Todo lo que hace la computadora es binario con nombre bonito. Verlo te quita el miedo y te explica por qué una IP tiene cuatro números de 0 a 255.",
  "w:encap":
    "Cada capa envuelve a la anterior como una cebolla: entender el encapsulamiento es entender por qué un paquete llega aunque cambie de red por el camino.",
  "w:procs":
    "Un proceso es un programa con vida propia y dueño. Saber leerlos es cómo descubres qué está consumiendo tu PC o qué se coló sin permiso.",
  "w:scheduler":
    "El planificador decide quién usa el CPU y por cuánto tiempo. De ahí salen la sensación de lentitud y los cuelgues que parecen misteriosos.",
  "w:memory":
    "La memoria se administra por bloques y páginas: cuando se acaba, el sistema empieza a matar procesos. Eso explica los cierres repentinos.",
  "w:flow":
    "Seguir el flujo de un paquete paso a paso convierte «internet no sirve» en un diagnóstico con culpable.",
  "w:layers":
    "El modelo de capas existe para que puedas cambiar el wifi sin reescribir tu navegador. Cada capa solo habla con la de al lado.",
  "w:match":
    "Emparejar conceptos obliga a distinguirlos. En seguridad, confundir «autenticación» con «autorización» es el error que abre puertas.",
};

function porQueDe(p: Practica): string | undefined {
  if (p.porque) return p.porque;
  return PORQUE_GENERICO[p.tipo === "widget" ? `w:${p.w}` : p.tipo];
}

function PorQue({ texto }: { texto: string }) {
  return (
    <div className="card mt-3 p-3" style={{ background: "#1b1233", borderLeft: "4px solid var(--violet)" }}>
      <p className="label" style={{ color: "var(--violet)" }}>¿Por qué funciona así?</p>
      <p className="mt-1 text-[16px] leading-relaxed text-[var(--text-2)]">{texto}</p>
    </div>
  );
}

export function PracticaView({ p, onDone }: { p: Practica; onDone: Done }) {
  return (
    <>
      {<Contenido p={p} onDone={onDone} />}
      {porQueDe(p) && <PorQue texto={porQueDe(p)!} />}
    </>
  );
}

function Contenido({ p, onDone }: { p: Practica; onDone: Done }) {
  switch (p.tipo) {
    case "widget": return <Widget w={p.w} props={p.props} onDone={onDone} />;
    case "codigo": return <Codigo p={p} onDone={onDone} />;
    case "orden": return <Orden p={p} onDone={onDone} />;
    case "escribir": return <Escribir p={p} onDone={onDone} />;
    case "phishing": return <PhishingGame cantidad={p.cantidad} onFinish={() => onDone()} />;
    case "cesar": return <Cesar onDone={onDone} />;
    case "hash": return <Hash onDone={onDone} />;
    case "password": return <Password onDone={onDone} />;
    case "aes": return <Aes onDone={onDone} />;
    case "dh": return <DH onDone={onDone} />;
  }
}
