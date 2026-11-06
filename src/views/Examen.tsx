import { useEffect, useMemo, useRef, useState } from "react";
import { PixelIcon } from "../components/PixelArt";
import { Bar } from "../components/ui";
import { C } from "../lib/content";
import { guardarExamen, useProgreso } from "../lib/store";
import { sfx } from "../lib/sonido";
import type { Ruta } from "../types";
import { cn } from "../utils/cn";

/* ═══════════════════════════════════════════════════════════════════
   EXAMEN FINAL · 20 preguntas al azar de todos los mundos, 20 minutos.
   Aprobar (70+) desbloquea el certificado de finalización.
   ═══════════════════════════════════════════════════════════════════ */

interface Pregunta {
  mundo: string;
  mundoColor: string;
  titulo: string;
  pregunta: string;
  opciones: string[];
  respuesta: number;
  explicacion: string;
}

const TOTAL = 20;
const MINUTOS = 20;
const APROBADO = 70;

function barajar<T>(lista: T[]): T[] {
  const a = [...lista];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function banco(): Pregunta[] {
  return C.mundos.flatMap((m) =>
    m.niveles.map((n) => ({
      mundo: m.nombre.replace("Mundo ", ""),
      mundoColor: m.color,
      titulo: n.titulo,
      pregunta: n.reto.pregunta,
      opciones: n.reto.opciones,
      respuesta: n.reto.respuesta,
      explicacion: n.reto.explicacion,
    })),
  );
}

const dosDigitos = (n: number) => String(n).padStart(2, "0");

export function Examen({ go }: { go: (r: Ruta) => void }) {
  const [p] = useProgreso();
  const [fase, setFase] = useState<"intro" | "curso" | "fin">("intro");
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [i, setI] = useState(0);
  const [respuestas, setRespuestas] = useState<Record<number, number>>({});
  const [restante, setRestante] = useState(MINUTOS * 60);
  const [nota, setNota] = useState(0);
  const [segundos, setSegundos] = useState(0);
  const finRef = useRef(false);

  const total = useMemo(() => banco().length, []);

  useEffect(() => {
    if (fase !== "curso") return;
    const t = window.setInterval(() => {
      setRestante((r) => {
        if (r <= 1) {
          window.clearInterval(t);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => window.clearInterval(t);
  }, [fase]);

  useEffect(() => {
    if (fase === "curso" && restante === 0) terminar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restante, fase]);

  function empezar() {
    setPreguntas(barajar(banco()).slice(0, TOTAL));
    setRespuestas({});
    setI(0);
    setRestante(MINUTOS * 60);
    finRef.current = false;
    setFase("curso");
  }

  function terminar() {
    if (finRef.current) return;
    finRef.current = true;
    const aciertos = preguntas.reduce((a, q, k) => a + (respuestas[k] === q.respuesta ? 1 : 0), 0);
    const n = Math.round((aciertos / Math.max(1, preguntas.length)) * 100);
    const usados = MINUTOS * 60 - restante;
    setNota(n);
    setSegundos(usados);
    guardarExamen({ nota: n, aciertos, total: preguntas.length, fecha: new Date().toISOString(), segundos: usados });
    sfx(n >= APROBADO ? "subir" : "error");
    setFase("fin");
  }

  const q = preguntas[i];
  const contestadas = Object.keys(respuestas).length;

  /* ───────────── intro ───────────── */
  if (fase === "intro") {
    return (
      <main id="main" className="mx-auto max-w-[900px] px-4 py-10">
        <p className="label !text-[var(--accent)]">Examen final</p>
        <h1 className="mt-2">La prueba de la bóveda</h1>
        <p className="mt-3 text-[17px] leading-relaxed text-[var(--text-2)]">
          {TOTAL} preguntas sacadas al azar de los {total} niveles, {MINUTOS} minutos y una sola regla:
          nada de mirar la teoría. Con <b className="text-[var(--text)]">{APROBADO} o más</b> desbloqueas el
          certificado de finalización.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            { icon: "sword" as const, t: `${TOTAL} preguntas`, d: `De un banco de ${total}, todas de nivel.` },
            { icon: "torch" as const, t: `${MINUTOS} minutos`, d: "Si se acaba el tiempo, se entrega lo que haya." },
            { icon: "diamond" as const, t: `${APROBADO}/100`, d: "Para aprobar. 90+ es matrícula de honor." },
          ].map((x) => (
            <div key={x.t} className="card p-4">
              <PixelIcon name={x.icon} size={26} />
              <p className="mt-2 text-[17px] font-bold">{x.t}</p>
              <p className="mt-1 text-[14px] text-[var(--text-2)]">{x.d}</p>
            </div>
          ))}
        </div>

        {p.examenes > 0 && (
          <div className="card mt-4 flex flex-wrap items-center gap-4 p-4">
            <div>
              <p className="label">Tu mejor nota</p>
              <p className="mono text-[28px]" style={{ color: p.examenMejor >= APROBADO ? "var(--green)" : "var(--accent)" }}>
                {p.examenMejor}/100
              </p>
            </div>
            <div>
              <p className="label">Intentos</p>
              <p className="mono text-[28px] text-[var(--text-2)]">{p.examenes}</p>
            </div>
            {p.ultimoExamen && (
              <p className="text-[14px] text-[var(--text-3)]">
                Último: {new Date(p.ultimoExamen.fecha).toLocaleDateString("es")} · {p.ultimoExamen.aciertos}/
                {p.ultimoExamen.total} aciertos
              </p>
            )}
            {p.examenMejor >= APROBADO && (
              <button className="btn btn-sm ml-auto" onClick={() => go({ v: "certificado" })}>
                <PixelIcon name="chest" size={12} /> Ver mi certificado
              </button>
            )}
          </div>
        )}

        <button className="btn btn-primary mt-6 w-full sm:w-auto" onClick={empezar}>
          <PixelIcon name="sword" size={16} /> Empezar el examen
        </button>
        <p className="mt-3 text-[13px] text-[var(--text-3)]">
          Se puede repetir las veces que quieras: guarda tu mejor nota, no la última.
        </p>
      </main>
    );
  }

  /* ───────────── en curso ───────────── */
  if (fase === "curso" && q) {
    const min = Math.floor(restante / 60);
    const seg = restante % 60;
    return (
      <main id="main" className="mx-auto max-w-[820px] px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="label !text-[var(--accent)]">
            Pregunta {i + 1} de {preguntas.length}
          </p>
          <div className="flex items-center gap-3">
            <span className="chip">{contestadas} contestadas</span>
            <span
              className="chip mono"
              style={{ color: restante < 120 ? "var(--red)" : "var(--text-2)", borderColor: restante < 120 ? "var(--red)" : undefined }}
            >
              ⏱ {dosDigitos(min)}:{dosDigitos(seg)}
            </span>
          </div>
        </div>
        <div className="mt-2">
          <Bar value={(contestadas / preguntas.length) * 100} color="var(--accent)" />
        </div>

        <div className="card mt-5 p-5">
          <p className="label" style={{ color: q.mundoColor }}>
            {q.mundo}
          </p>
          <p className="mt-2 text-[21px] font-bold leading-snug">{q.pregunta}</p>
          <div className="mt-4 grid gap-2" role="radiogroup" aria-label="Opciones">
            {q.opciones.map((o, k) => {
              const sel = respuestas[i] === k;
              return (
                <button
                  key={o}
                  role="radio"
                  aria-checked={sel}
                  onClick={() => setRespuestas((r) => ({ ...r, [i]: k }))}
                  className={cn(
                    "flex items-center gap-3 border-2 border-black p-3 text-left",
                    sel ? "bg-[var(--surface-3)] shadow-[inset_4px_0_0_var(--accent)]" : "bg-[var(--surface-2)] hover:bg-[var(--surface-3)]",
                  )}
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center border-2 border-black bg-black/40 text-[10px]" style={{ fontFamily: "var(--font-title)" }}>
                    {String.fromCharCode(65 + k)}
                  </span>
                  {o}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button className="btn" onClick={() => setI((v) => Math.max(0, v - 1))} disabled={i === 0}>
            ◀ Anterior
          </button>
          {i < preguntas.length - 1 ? (
            <button className="btn btn-primary" onClick={() => setI((v) => v + 1)}>
              Siguiente ▶
            </button>
          ) : (
            <button className="btn btn-primary" onClick={terminar}>
              Entregar examen
            </button>
          )}
          <div className="ml-auto flex flex-wrap gap-1">
            {preguntas.map((_, k) => (
              <button
                key={k}
                onClick={() => setI(k)}
                aria-label={`Ir a la pregunta ${k + 1}`}
                className={cn(
                  "h-6 w-6 border-2 border-black text-[10px]",
                  k === i ? "bg-[var(--accent)] text-black" : respuestas[k] !== undefined ? "bg-[var(--surface-3)]" : "bg-[var(--surface-2)] text-[var(--text-3)]",
                )}
              >
                {k + 1}
              </button>
            ))}
          </div>
        </div>
      </main>
    );
  }

  /* ───────────── resultado ───────────── */
  const aprobado = nota >= APROBADO;
  const aciertos = preguntas.reduce((a, qq, k) => a + (respuestas[k] === qq.respuesta ? 1 : 0), 0);
  const fallos = preguntas.map((qq, k) => ({ qq, k })).filter(({ qq, k }) => respuestas[k] !== qq.respuesta);

  return (
    <main id="main" className="mx-auto max-w-[860px] px-4 py-10">
      <p className="label !text-[var(--accent)]">Resultado</p>
      <h1 className="mt-2">{aprobado ? "¡Aprobado!" : "Todavía no"}</h1>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="card p-4 sm:col-span-1">
          <p className="label">Nota final</p>
          <p className="mono text-[44px] leading-none" style={{ color: aprobado ? "var(--green)" : "var(--red)" }}>
            {nota}
            <span className="text-[20px] text-[var(--text-3)]">/100</span>
          </p>
          <p className="mt-2 text-[14px] text-[var(--text-2)]">
            {aciertos} de {preguntas.length} correctas en {Math.floor(segundos / 60)} min {segundos % 60} s
          </p>
        </div>
        <div className="card p-4 sm:col-span-2">
          <p className="label">Qué significa</p>
          <p className="mt-1 text-[15px] leading-relaxed text-[var(--text-2)]">
            {aprobado
              ? `Has demostrado que puedes explicar y aplicar los conceptos de los ${C.mundos.length} mundos. El certificado de finalización ya está disponible con tu nombre.`
              : `Necesitas ${APROBADO} para el certificado. Repasa los mundos donde fallaste y vuelve a intentarlo: puedes repetirlo sin límite.`}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {aprobado ? (
              <button className="btn btn-primary" onClick={() => go({ v: "certificado" })}>
                <PixelIcon name="chest" size={14} /> Ver el certificado
              </button>
            ) : (
              <button className="btn btn-primary" onClick={empezar}>
                Repetir examen
              </button>
            )}
            <button className="btn" onClick={() => go({ v: "inicio" })}>
              Volver al inicio
            </button>
          </div>
        </div>
      </div>

      {fallos.length > 0 && (
        <section className="mt-6">
          <p className="label">Para repasar ({fallos.length})</p>
          <div className="mt-2 space-y-2">
            {fallos.map(({ qq, k }) => (
              <div key={k} className="card p-3">
                <p className="label" style={{ color: qq.mundoColor }}>
                  {qq.mundo} · {qq.titulo}
                </p>
                <p className="mt-1 text-[16px] font-bold">{qq.pregunta}</p>
                <p className="mt-1 text-[15px] text-[var(--green)]">Correcta: {qq.opciones[qq.respuesta]}</p>
                <p className="mt-1 text-[14px] text-[var(--text-2)]">{qq.explicacion}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
