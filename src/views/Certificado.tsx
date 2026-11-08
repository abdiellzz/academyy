import { useState } from "react";
import { PixelIcon } from "../components/PixelArt";
import { LOGO_SRC } from "../assets/logo";
import { C, totalNiveles } from "../lib/content";
import { LABS } from "./Labs";
import { nivelCompleto, nivelesCompletos, notify, setEstudiante, useProgreso } from "../lib/store";
import { descargarPDF, descargarPNG, type DatosCert } from "../lib/certificado";
import type { Ruta } from "../types";

const APROBADO = 70;

function idCertificado(fecha: string, nombre: string): string {
  let h = 7;
  const s = `${fecha}|${nombre}|factionvault`;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 16777216;
  const hex = h.toString(16).toUpperCase().padStart(6, "0");
  return `FV-${hex.slice(0, 2)}${hex.slice(3, 5)}-${hex.slice(2, 6)}`;
}

export function Certificado({ go }: { go: (r: Ruta) => void }) {
  const [p] = useProgreso();
  const [nombre, setNombre] = useState(p.estudiante);
  const [verEjemplo, setVerEjemplo] = useState(false);
  const [generando, setGenerando] = useState<"pdf" | "png" | null>(null);
  const [fechaEmision] = useState(() => new Date().toISOString());
  const mundosHechos = C.mundos.filter((m) => m.niveles.every((n) => nivelCompleto(p, `${m.id}/${n.id}`))).length;
  const rutaCompleta = mundosHechos === C.mundos.length;
  const examenAprobado = p.examenMejor >= APROBADO;
  const disponible = rutaCompleta && examenAprobado;
  const demo = !disponible && verEjemplo;
  const mundoPendiente = C.mundos.find((m) => !m.niveles.every((n) => nivelCompleto(p, `${m.id}/${n.id}`)));

  const nota = demo ? 92 : p.examenMejor;
  const completados = demo ? totalNiveles : nivelesCompletos(p);
  const labsHechos = demo ? LABS.length : p.labs.length;
  const retosHechos = demo ? C.retos.length : p.retos.length;
  const fecha = demo ? "2026-01-15T12:00:00.000Z" : fechaEmision;
  const fechaTxt = new Date(fecha).toLocaleDateString("es", { day: "2-digit", month: "long", year: "numeric" });
  const nombreDocumento = demo ? "ESTUDIANTE DE MUESTRA" : nombre.trim() || p.estudiante || "Nombre del estudiante";
  const id = idCertificado(fecha, nombreDocumento);
  const estacionesPracticas = demo ? 2 : p.examenMejorDetalle?.estacionesPracticas;

  const datos: DatosCert = {
    nombre: nombreDocumento,
    nota,
    progreso: { niveles: completados, totalNiveles, labs: labsHechos, totalLabs: LABS.length, retos: retosHechos, totalRetos: C.retos.length },
    mundos: C.mundos.length,
    estacionesPracticas,
    fecha,
    id,
    demo,
  };

  async function bajar(tipo: "pdf" | "png") {
    // Defensa adicional: una vista de muestra nunca se puede exportar.
    if (demo || !disponible || generando) return;
    setGenerando(tipo);
    try {
      if (nombre.trim() !== p.estudiante) setEstudiante(nombre.trim());
      if (tipo === "pdf") await descargarPDF(datos);
      else await descargarPNG(datos);
      notify({ titulo: tipo === "pdf" ? "PDF listo" : "PNG listo", texto: "Revisa tus descargas.", icono: "chest" });
    } catch {
      notify({ titulo: "No se pudo generar", texto: "Inténtalo de nuevo en un momento.", icono: "storm" });
    } finally {
      setGenerando(null);
    }
  }

  if (!disponible && !demo) {
    return (
      <main id="main" className="mx-auto max-w-[820px] px-4 py-12">
        <div className="cert-gate card">
          <span className="cert-gate-icon"><PixelIcon name="chest" size={30} /></span>
          <p className="label mt-5 !text-[var(--accent)]">Ruta de aprendizaje</p>
          <h1 className="mt-2">El certificado se gana paso a paso</h1>
          <p className="mt-3 max-w-[620px] text-[16px] leading-relaxed text-[var(--text-2)]">
            Para obtenerlo, primero completa todos los niveles de los {C.mundos.length} mundos y después aprueba el examen final con {APROBADO}/100 o más.
          </p>

          <div className="cert-checklist mt-6">
            <div className={rutaCompleta ? "cert-check-row is-done" : "cert-check-row"}>
              <span>{rutaCompleta ? "✓" : "1"}</span>
              <div><b>Completar todos los mundos</b><small>{mundosHechos}/{C.mundos.length} mundos · {completados}/{totalNiveles} niveles</small></div>
            </div>
            <div className={examenAprobado ? "cert-check-row is-done" : "cert-check-row"}>
              <span>{examenAprobado ? "✓" : "2"}</span>
              <div><b>Aprobar el examen final</b><small>Mejor nota: {p.examenMejor}/100 · se necesita {APROBADO}</small></div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {!rutaCompleta && mundoPendiente && (
              <button className="btn btn-primary" onClick={() => go({ v: "mundo", id: mundoPendiente.id })}>
                <PixelIcon name="grass" size={15} /> Seguir con {mundoPendiente.nombre.replace("Mundo ", "")}
              </button>
            )}
            {rutaCompleta && !examenAprobado && (
              <button className="btn btn-primary" onClick={() => go({ v: "examen" })}>
                <PixelIcon name="sword" size={15} /> Ir al examen final
              </button>
            )}
            {!rutaCompleta && examenAprobado && (
              <button className="btn" onClick={() => go({ v: "examen" })}>Ver resultado del examen</button>
            )}
            <button className="btn" onClick={() => setVerEjemplo(true)}>Ver diseño de muestra</button>
          </div>
          <p className="mt-4 text-[12px] text-[var(--text-3)]">La muestra es solo una vista previa: no se puede editar, imprimir ni descargar.</p>
        </div>
      </main>
    );
  }

  return (
    <main id="main" className="mx-auto max-w-[1120px] px-4 py-8">
      {demo ? (
        <div className="demo-note no-print mb-5">
          <div><span className="label !text-[var(--accent)]">Vista de muestra</span><p className="mt-1 text-[14px] text-[var(--text-2)]">Datos ficticios. No tiene validez y las acciones de edición, impresión y descarga están desactivadas.</p></div>
          <button className="btn btn-sm" onClick={() => setVerEjemplo(false)}>Cerrar muestra</button>
        </div>
      ) : (
        <div className="no-print mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="label !text-[var(--accent)]">Ruta completada · {C.mundos.length} mundos</p>
            <h1 className="mt-1">Tu certificado</h1>
            <p className="mt-2 max-w-[600px] text-[14px] text-[var(--text-2)]">Personaliza el nombre y descarga la constancia en PDF o PNG.</p>
          </div>
          <div className="flex flex-wrap items-end gap-2">
            <label className="block">
              <span className="label">Nombre en el certificado</span>
              <input className="field mt-1 w-[240px]" value={nombre} maxLength={38} placeholder="Nombre y apellido" onChange={(e) => setNombre(e.target.value)} onBlur={() => setEstudiante(nombre.trim())} />
            </label>
            <button className="btn btn-primary" onClick={() => bajar("pdf")} disabled={generando !== null || !nombre.trim()}>
              {generando === "pdf" ? "Preparando PDF…" : "Descargar PDF"}
            </button>
            <button className="btn" onClick={() => bajar("png")} disabled={generando !== null || !nombre.trim()}>
              {generando === "png" ? "Preparando PNG…" : "Descargar PNG"}
            </button>
            <button className="btn btn-sm" onClick={() => window.print()}>Imprimir</button>
          </div>
        </div>
      )}

      <div className={`cert${demo ? " cert-demo" : ""}`}>
        <div className="cert-marco">
          <div className="cert-cab">
            <img src={LOGO_SRC} alt="FactionVault" className="cert-logo" />
            <span className="cert-sub">CONSTANCIA DE FINALIZACIÓN</span>
          </div>
          <p className="cert-titulo">Certificado</p>
          <p className="cert-subtitulo">DE FINALIZACIÓN</p>
          <p className="cert-etiqueta">OTORGADO A</p>
          <p className="cert-nombre">{nombreDocumento}</p>
          <span className="cert-linea" />
          <p className="cert-cuerpo">
            Por completar los {C.mundos.length} mundos de FactionVault ({totalNiveles} niveles) y aprobar el examen final con una nota de <b>{nota}/100</b>{estacionesPracticas ? `, incluyendo ${estacionesPracticas} estaciones prácticas de Python y análisis de redes` : ""}. Este recorrido incluye práctica guiada en redes, sistemas, Python, criptografía e ingeniería social.
          </p>

          <div className="cert-pie">
            <div className="cert-datos">
              <p className="cert-etiqueta">PROGRESO</p>
              <p className="cert-dato">{completados}/{totalNiveles} niveles <span>·</span> {labsHechos}/{LABS.length} labs <span>·</span> {retosHechos}/{C.retos.length} retos</p>
            </div>
            <div className="cert-score"><span>NOTA FINAL</span><b>{nota}<small>/100</small></b></div>
            <div className="cert-emision"><span>EMITIDO EL</span><b>{fechaTxt}</b><span>ID DE EMISIÓN</span><b className="cert-id">{id}</b></div>
          </div>

          <div className="cert-final">
            <span>FactionVault · aprendizaje práctico de ciberseguridad</span>
            <span className="cert-aviso">Documento de la plataforma · no es una certificación oficial</span>
          </div>
        </div>
      </div>

      {!demo && (
        <div className="no-print mt-5 flex flex-wrap items-center justify-between gap-3 text-[13px] text-[var(--text-3)]">
          <span>El certificado acredita tu recorrido en esta plataforma; no sustituye una certificación profesional.</span>
          <button className="btn btn-ghost btn-sm" onClick={() => go({ v: "progreso" })}>Ver mi progreso</button>
        </div>
      )}
    </main>
  );
}
