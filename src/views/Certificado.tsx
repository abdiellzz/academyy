import { useState } from "react";
import { PixelIcon } from "../components/PixelArt";
import { LOGO_SRC } from "../assets/logo";
import { C, totalNiveles } from "../lib/content";
import { LABS } from "./Labs";
import { nivelesCompletos, notify, setEstudiante, useProgreso } from "../lib/store";
import { descargarPDF, descargarPNG, type DatosCert } from "../lib/certificado";
import type { Ruta } from "../types";

/* ═══════════════════════════════════════════════════════════════════
   CERTIFICADO DE FINALIZACIÓN
   Documento de la propia plataforma (no una certificación oficial):
   acredita que se completó la ruta y se aprobó el examen final.
   Se imprime con Ctrl+P o se guarda como PDF desde el navegador.
   ═══════════════════════════════════════════════════════════════════ */

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
  const aprobado = p.examenMejor >= APROBADO;
  const demo = !aprobado && verEjemplo;

  // En el ejemplo se muestra el documento completo, con datos de muestra.
  const nota = demo ? 92 : p.examenMejor;
  const completados = demo ? totalNiveles : nivelesCompletos(p);
  const labsHechos = demo ? LABS.length : p.labs.length;
  const retosHechos = demo ? C.retos.length : p.retos.length;

  const fecha = demo ? new Date().toISOString() : p.ultimoExamen?.fecha ?? new Date().toISOString();
  const fechaTxt = new Date(fecha).toLocaleDateString("es", { day: "2-digit", month: "2-digit", year: "numeric" });
  const id = idCertificado(fecha, nombre || "anonimo");

  const datos: DatosCert = {
    nombre: demo ? nombre || "Nombre del estudiante" : nombre || p.estudiante || "Nombre del estudiante",
    nota,
    progreso: { niveles: completados, totalNiveles, labs: labsHechos, totalLabs: LABS.length, retos: retosHechos, totalRetos: C.retos.length },
    mundos: C.mundos.length,
    fecha,
    id,
    demo,
  };

  async function bajar(tipo: "pdf" | "png") {
    if (generando) return;
    setGenerando(tipo);
    try {
      if (nombre !== p.estudiante) setEstudiante(nombre);
      if (tipo === "pdf") await descargarPDF(datos);
      else await descargarPNG(datos);
      notify({ titulo: tipo === "pdf" ? "PDF listo" : "PNG listo", texto: "Revisa tus descargas.", icono: "chest" });
    } catch {
      notify({ titulo: "No se pudo generar", texto: "Prueba con «Imprimir» y elige Guardar como PDF.", icono: "storm" });
    } finally {
      setGenerando(null);
    }
  }

  if (!aprobado && !demo) {
    return (
      <main id="main" className="mx-auto max-w-[760px] px-4 py-12 text-center">
        <PixelIcon name="chest" size={54} />
        <h1 className="mt-4">Todavía no hay certificado</h1>
        <p className="mt-3 text-[17px] leading-relaxed text-[var(--text-2)]">
          El certificado se desbloquea aprobando el examen final con {APROBADO} o más. Ahora mismo tu mejor
          nota es <b className="text-[var(--accent)]">{p.examenMejor}/100</b>.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button className="btn btn-primary" onClick={() => go({ v: "examen" })}>
            <PixelIcon name="sword" size={14} /> Ir al examen final
          </button>
          <button className="btn" onClick={() => setVerEjemplo(true)}>
            <PixelIcon name="chest" size={14} /> Ver un ejemplo del diseño
          </button>
        </div>
      </main>
    );
  }

  return (
    <main id="main" className="mx-auto max-w-[1120px] px-4 py-8">
      {demo && (
        <div className="no-print mb-3 flex flex-wrap items-center gap-3 border-2 border-black bg-[#2a1d0c] p-3">
          <span className="chip !text-[var(--accent)]">ejemplo</span>
          <p className="text-[15px] text-[var(--text-2)]">
            Así se verá tu certificado cuando apruebes el examen. Los datos son de muestra.
          </p>
          <button className="btn btn-xs ml-auto" onClick={() => setVerEjemplo(false)}>
            volver ✕
          </button>
        </div>
      )}

      <div className="no-print flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="label !text-[var(--accent)]">Certificado</p>
          <h1 className="mt-1">Tu certificado de finalización</h1>
          <p className="mt-2 max-w-[640px] text-[15px] leading-relaxed text-[var(--text-2)]">
            Escribe tu nombre y descárgalo en <b>PDF</b> (A4 horizontal, listo para imprimir) o en PNG. El ID de
            abajo identifica tu emisión.
          </p>
        </div>
        <div className="flex flex-wrap items-end gap-2">
          <label className="block">
            <span className="label">Tu nombre</span>
            <input
              className="field mt-1 w-[240px]"
              value={nombre}
              maxLength={38}
              placeholder="Nombre y apellido"
              onChange={(e) => setNombre(e.target.value)}
              onBlur={() => setEstudiante(nombre)}
            />
          </label>
          <button className="btn btn-primary" onClick={() => bajar("pdf")} disabled={generando !== null}>
            <PixelIcon name="chest" size={13} /> {generando === "pdf" ? "Generando…" : "Descargar PDF"}
          </button>
          <button className="btn" onClick={() => bajar("png")} disabled={generando !== null}>
            {generando === "png" ? "Generando…" : "PNG"}
          </button>
          <button className="btn btn-sm" onClick={() => window.print()} title="Imprimir o guardar como PDF del navegador">
            Imprimir
          </button>
        </div>
      </div>

      {/* ── documento ── */}
      <div className="cert mt-6">
        <div className="cert-marco">
          <span className="cert-esq cert-esq-a" />
          <span className="cert-esq cert-esq-b" />
          <span className="cert-esq cert-esq-c" />
          <span className="cert-esq cert-esq-d" />

          <div className="cert-cab">
            <img src={LOGO_SRC} alt="FactionVault" className="cert-logo" />
            <div>
              <p className="cert-marca">FACTION VAULT</p>
              <p className="cert-sub">CENTRO DE MANDO · CERTIFICADO DE LA PLATAFORMA</p>
            </div>
          </div>

          <p className="cert-titulo">CERTIFICADO</p>
          <p className="cert-subtitulo">DE FINALIZACIÓN</p>

          <p className="cert-etiqueta">OTORGADO A</p>
          <p className="cert-nombre">{nombre || "Nombre del estudiante"}</p>
          <span className="cert-linea" />

          <p className="cert-cuerpo">
            Por completar la ruta de {C.mundos.length} mundos de FactionVault —{totalNiveles} niveles,{" "}
            {LABS.length} laboratorios y {C.retos.length} retos CTF— y aprobar el examen final con una nota de{" "}
            <b>{nota}/100</b>, demostrando criterio técnico en redes, sistemas operativos, Python,
            criptografía, ingeniería social y seguridad informática.
          </p>

          <div className="cert-pie">
            <div className="cert-datos">
              <p className="cert-etiqueta">PROGRESO</p>
              <p className="cert-dato">
                {completados}/{totalNiveles} niveles · {labsHechos}/{LABS.length} labs · {retosHechos}/{C.retos.length} retos
              </p>
              <p className="cert-etiqueta mt-3">NOTA FINAL</p>
              <p className="cert-nota">{nota}/100</p>
            </div>

            <div className="cert-sello">
              <span className="cert-sello-cinta cert-cinta-a" />
              <span className="cert-sello-cinta cert-cinta-b" />
              <span className="cert-sello-cara">FV</span>
              <span className="cert-sello-pct">{nota}%</span>
            </div>

            <div className="cert-firmas">
              <div>
                <span className="cert-firma-linea" />
                <p className="cert-firma">DIEL · INSTRUCTOR</p>
              </div>
              <div>
                <span className="cert-firma-linea" />
                <p className="cert-firma">FACTIONVAULT</p>
              </div>
            </div>
          </div>

          <div className="cert-final">
            <span>Emitido el {fechaTxt} · ID {id}</span>
            <span className="cert-aviso">
              Certificado de finalización de la plataforma · no es una certificación oficial
            </span>
          </div>
        </div>
      </div>

      <div className="no-print mt-6 card p-4">
        <p className="label">Qué es esto exactamente</p>
        <p className="mt-1 text-[15px] leading-relaxed text-[var(--text-2)]">
          Es un <b className="text-[var(--text)]">certificado de finalización de FactionVault</b>: acredita que
          terminaste la ruta y aprobaste el examen de la plataforma, con tu ID de emisión y tu nota. No es una
          certificación oficial ni sustituye a CompTIA Security+, CCNA o Cisco CyberOps: esas las emite cada
          fabricante con su propio examen. Lo que sí demuestra es práctica real —{C.mundos.length} mundos,{" "}
          {LABS.length} laboratorios y {C.retos.length} retos— y sirve para tu portafolio o para tu CV junto al
          repo.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button className="btn btn-sm" onClick={() => go({ v: "examen" })}>Repetir el examen</button>
          <button className="btn btn-sm" onClick={() => go({ v: "progreso" })}>Ver mi progreso</button>
        </div>
      </div>
    </main>
  );
}
