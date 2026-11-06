import { useMemo, useState } from "react";
import { PixelIcon, type PixelIconName } from "../components/PixelArt";
import { PracticaView } from "../components/Practices";
import { Term } from "../components/ui";
import type { Practica, Ruta } from "../types";
import { cn } from "../utils/cn";

/* ═══════════════════════════════════════════════════════════════════
   LABORATORIO · todos los simuladores en un solo sitio, por área.
   Cada tarjeta explica qué es, qué vas a hacer y cuánto cuesta.
   ═══════════════════════════════════════════════════════════════════ */

interface Lab {
  id: string;
  area: string;
  nombre: string;
  icono: PixelIconName;
  que: string;
  haces: string;
  nivel: "Fácil" | "Media" | "Difícil";
  minutos: number;
  practica: Practica;
  extra?: string;
}

const AREAS: { id: string; nombre: string; icono: PixelIconName; desc: string }[] = [
  {
    id: "cripto",
    nombre: "Criptografía",
    icono: "diamond",
    desc: "Cifrar, firmar, derivar claves y romper cifrados con estadística. Todo con cripto real del navegador.",
  },
  {
    id: "redes",
    nombre: "Redes",
    icono: "globe",
    desc: "Direcciones, subredes, puertos y paquetes de verdad capturados en una sesión normal.",
  },
  {
    id: "sistemas",
    nombre: "Sistemas",
    icono: "monitor",
    desc: "La terminal, los permisos, los procesos y la memoria: lo que de verdad pasa dentro del equipo.",
  },
  {
    id: "python",
    nombre: "Python",
    icono: "snake",
    desc: "Programa tus propias herramientas: una consola que ejecuta código de verdad, con retos.",
  },
  {
    id: "seguridad",
    nombre: "Seguridad",
    icono: "shield",
    desc: "Contraseñas, phishing y decisiones que tomas todos los días sin darte cuenta.",
  },
];

export const LABS: Lab[] = [
  {
    id: "xor",
    area: "cripto",
    nombre: "XOR bit a bit",
    icono: "diamond",
    que: "La operación con la que se construyen casi todos los cifrados simétricos.",
    haces: "Cifra un mensaje, mira los bytes en binario y tuerce un bit para ver qué cambia.",
    nivel: "Fácil",
    minutos: 6,
    practica: { tipo: "widget", w: "xor" },
  },
  {
    id: "vigenere",
    area: "cripto",
    nombre: "Vigenère",
    icono: "chest",
    que: "Un César con clave que se repite: el cifrado que parecía irrompible durante 300 años.",
    haces: "Cifra, y luego mira las columnas para entender por qué se cae.",
    nivel: "Fácil",
    minutos: 7,
    practica: { tipo: "widget", w: "vigenere" },
  },
  {
    id: "frecuencia",
    area: "cripto",
    nombre: "Criptoanálisis por frecuencia",
    icono: "torch",
    que: "Romper un cifrado sin la clave, solo midiendo qué letras aparecen más.",
    haces: "Pega un texto cifrado y deja que el índice de coincidencia adivine el desplazamiento.",
    nivel: "Media",
    minutos: 8,
    practica: { tipo: "widget", w: "frecuencia" },
  },
  {
    id: "rsa",
    area: "cripto",
    nombre: "RSA paso a paso",
    icono: "globe",
    que: "La matemática detrás del candado del navegador y de las firmas digitales.",
    haces: "Elige primos, calcula n, φ y d, cifra, descifra y firma. Verás por qué la pública no sirve para descifrar.",
    nivel: "Media",
    minutos: 10,
    practica: { tipo: "widget", w: "rsa" },
  },
  {
    id: "firma",
    area: "cripto",
    nombre: "Firma digital (HMAC)",
    icono: "shield",
    que: "Cómo saber que un mensaje llegó intacto y de quien dice ser.",
    haces: "Firma un mensaje, altéralo en el camino y mira cómo la verificación lo detecta.",
    nivel: "Media",
    minutos: 6,
    practica: { tipo: "widget", w: "firma" },
  },
  {
    id: "kdf",
    area: "cripto",
    nombre: "PBKDF2 y sales",
    icono: "key",
    que: "La forma correcta de guardar contraseñas (y la razón de que las filtraciones importen).",
    haces: "Deriva claves de verdad, cambia la sal y las iteraciones y mide el tiempo que le costaría a un atacante.",
    nivel: "Media",
    minutos: 8,
    practica: { tipo: "widget", w: "kdf" },
  },
  {
    id: "brute",
    area: "cripto",
    nombre: "Fuerza bruta real",
    icono: "sword",
    que: "Por qué un PIN de 4 cifras no protege nada y una frase larga sí.",
    haces: "Rompe un PIN probando los 10 000 hashes en tu navegador y mide cuánto tarda.",
    nivel: "Fácil",
    minutos: 5,
    practica: { tipo: "widget", w: "brute" },
  },
  {
    id: "aes",
    area: "cripto",
    nombre: "AES-GCM de verdad",
    icono: "diamond",
    que: "Cifrado en bloque con autenticación: el estándar que usa tu banco y tu wifi.",
    haces: "Cifra un texto con contraseña y sal, y comprueba que un solo byte cambiado rompe la integridad.",
    nivel: "Media",
    minutos: 7,
    practica: { tipo: "aes" },
  },
  {
    id: "hash",
    area: "cripto",
    nombre: "SHA-256",
    icono: "diamond",
    que: "La huella digital de cualquier dato: misma entrada, misma huella.",
    haces: "Compara dos textos casi iguales y mira el efecto avalancha carácter por carácter.",
    nivel: "Fácil",
    minutos: 5,
    practica: { tipo: "hash" },
  },

  {
    id: "paquetes",
    area: "redes",
    nombre: "Captura de paquetes",
    icono: "globe",
    que: "El tráfico real de una laptop abriendo una web, con ARP, DNS, TCP, TLS e ICMP.",
    haces: "Filtra como en Wireshark y abre un paquete para ver sus cuatro capas.",
    nivel: "Fácil",
    minutos: 8,
    practica: { tipo: "widget", w: "paquetes" },
  },
  {
    id: "subredes",
    area: "redes",
    nombre: "Calculadora de subredes",
    icono: "globe",
    que: "Cómo se parte una red en trozos y por qué eso te protege sin comprar nada.",
    haces: "Mueve la máscara y mira cuántos hosts entran, dónde empieza el rango y dónde está el broadcast.",
    nivel: "Media",
    minutos: 9,
    practica: { tipo: "widget", w: "subnet" },
  },
  {
    id: "firewall",
    area: "redes",
    nombre: "Firewall",
    icono: "shield",
    que: "Una lista de decisiones: todo cerrado y solo abres lo que hace falta.",
    haces: "Abre y cierra puertos y observa qué conexiones pasan y cuáles se rechazan.",
    nivel: "Fácil",
    minutos: 6,
    practica: { tipo: "widget", w: "firewall" },
  },
  {
    id: "binario",
    area: "redes",
    nombre: "Binario e IP",
    icono: "xp",
    que: "Por qué una IP se escribe con cuatro números de 0 a 255.",
    haces: "Convierte octetos a bits y entiende qué significa cada bit de la dirección.",
    nivel: "Fácil",
    minutos: 5,
    practica: { tipo: "widget", w: "binary" },
  },
  {
    id: "encap",
    area: "redes",
    nombre: "Encapsulamiento",
    icono: "chest",
    que: "Cómo cada capa envuelve a la anterior como una cebolla.",
    haces: "Sigue un paquete bajando capas y míralo por dentro capa por capa.",
    nivel: "Media",
    minutos: 6,
    practica: { tipo: "widget", w: "encap" },
  },
  {
    id: "capas",
    area: "redes",
    nombre: "Modelo de capas",
    icono: "chest",
    que: "El mapa que explica por qué tu navegador no necesita saber si estás en wifi o en cable.",
    haces: "Arrastra y ordena las capas, y ubica cada protocolo donde toca.",
    nivel: "Fácil",
    minutos: 5,
    practica: { tipo: "widget", w: "layers" },
  },

  {
    id: "terminal",
    area: "sistemas",
    nombre: "Terminal Linux",
    icono: "monitor",
    que: "La puerta de entrada a cualquier servidor del mundo.",
    haces: "Misión guiada: navega, lista, lee archivos y encuentra la bandera sin romper nada.",
    nivel: "Fácil",
    minutos: 10,
    practica: { tipo: "widget", w: "terminal", props: { mission: "basico" } },
  },
  {
    id: "chmod",
    area: "sistemas",
    nombre: "Permisos chmod",
    icono: "key",
    que: "El control de acceso más viejo de Unix y el que más servidores salva.",
    haces: "Cambia los permisos de un archivo y comprueba quién puede leer, escribir y ejecutar.",
    nivel: "Media",
    minutos: 7,
    practica: { tipo: "widget", w: "chmod" },
  },
  {
    id: "procesos",
    area: "sistemas",
    nombre: "Procesos",
    icono: "monitor",
    que: "Cada programa corriendo es un proceso con dueño, memoria y CPU.",
    haces: "Mata, prioriza y observa cuál se come tu equipo.",
    nivel: "Fácil",
    minutos: 6,
    practica: { tipo: "widget", w: "procs" },
  },
  {
    id: "planificador",
    area: "sistemas",
    nombre: "Planificador de CPU",
    icono: "torch",
    que: "Quién usa el procesador y por cuánto tiempo: el origen del lag que no es de red.",
    haces: "Prueba round-robin y prioridades y mira el orden de ejecución.",
    nivel: "Media",
    minutos: 7,
    practica: { tipo: "widget", w: "scheduler" },
  },
  {
    id: "memoria",
    area: "sistemas",
    nombre: "Memoria",
    icono: "diamond",
    que: "Bloques, páginas y el motivo real de los cierres repentinos.",
    haces: "Asigna y libera memoria hasta ver qué pasa cuando se acaba.",
    nivel: "Media",
    minutos: 6,
    practica: { tipo: "widget", w: "memory" },
  },

  {
    id: "python",
    area: "python",
    nombre: "Consola de Python",
    icono: "snake",
    que: "El lenguaje con el que se automatiza la seguridad: scripts, parseo y análisis.",
    haces: "Escribes código y se ejecuta de verdad, con cuatro retos que comprueban la salida.",
    nivel: "Fácil",
    minutos: 12,
    practica: { tipo: "widget", w: "python" },
  },

  {
    id: "password",
    area: "seguridad",
    nombre: "Medidor de contraseñas",
    icono: "key",
    que: "Entropía real y tiempo de descifrado, sin mitos de símbolos raros.",
    haces: "Prueba contraseñas y compara longitud contra complejidad.",
    nivel: "Fácil",
    minutos: 5,
    practica: { tipo: "password" },
  },
  {
    id: "phishing",
    area: "seguridad",
    nombre: "Detector de phishing",
    icono: "flag",
    que: "El ataque que empieza casi todos los demás.",
    haces: "Diez mensajes reales: decide cuál es legítimo y cuál es anzuelo, con explicación.",
    nivel: "Fácil",
    minutos: 6,
    practica: { tipo: "phishing", cantidad: 10 },
  },
];

const COLOR_NIVEL: Record<Lab["nivel"], string> = { Fácil: "var(--green)", Media: "var(--accent)", Difícil: "var(--red)" };

export function Laboratorio({ go }: { go: (r: Ruta) => void }) {
  const [area, setArea] = useState("cripto");
  const [abierto, setAbierto] = useState<Lab | null>(null);

  const lista = useMemo(() => LABS.filter((l) => l.area === area), [area]);
  const info = AREAS.find((a) => a.id === area)!;

  return (
    <main id="main">
      <section className="border-b-2 border-black bg-[var(--bg-soft)]">
        <div className="mx-auto max-w-[1160px] px-4 py-9">
          <p className="label !text-[var(--accent)]">Laboratorio</p>
          <h1 className="mt-2">Práctica real, en tu navegador</h1>
          <p className="mt-3 max-w-[720px] text-[17px] leading-relaxed text-[var(--text-2)]">
            {LABS.length} simuladores técnicos ordenados por área. Aquí no se mira: se escribe, se rompe
            y se compara. Casi todo corre con cripto de verdad y todos dicen qué son y para qué sirven.
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            <span className="chip">{LABS.length} laboratorios</span>
            <span className="chip">sin instalar nada</span>
            <span className="chip">con pistas y explicación</span>
          </div>
        </div>
      </section>

      <div className="sticky top-16 z-30 border-b-2 border-black bg-[var(--surface)]">
        <div className="mx-auto flex max-w-[1160px] gap-1 overflow-x-auto px-4 py-2" role="tablist" aria-label="Áreas del laboratorio">
          {AREAS.map((a) => (
            <button
              key={a.id}
              role="tab"
              aria-selected={area === a.id}
              className={cn("tab-btn shrink-0", area === a.id && "active")}
              onClick={() => {
                setArea(a.id);
                setAbierto(null);
              }}
            >
              <PixelIcon name={a.icono} size={13} /> {a.nombre}
            </button>
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-[1160px] px-4 py-7">
        <div className="card p-4">
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center border-2 border-black bg-[var(--surface-3)]">
              <PixelIcon name={info.icono} size={24} />
            </span>
            <div>
              <p className="label !text-[var(--accent)]">{info.nombre}</p>
              <p className="mt-1 text-[15px] leading-relaxed text-[var(--text-2)]">{info.desc}</p>
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {lista.map((l) => {
            const activo = abierto?.id === l.id;
            return (
              <div key={l.id} className={cn("card p-4", activo && "ring-2 ring-[var(--accent)]")}>
                <div className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center border-2 border-black bg-[var(--surface-3)]">
                    <PixelIcon name={l.icono} size={22} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[18px] font-bold leading-tight">{l.nombre}</p>
                    <p className="label mt-1" style={{ color: COLOR_NIVEL[l.nivel] }}>
                      {l.nivel} · {l.minutos} min
                    </p>
                  </div>
                </div>
                <p className="mt-2 text-[15px] leading-relaxed text-[var(--text-2)]">
                  <b className="text-[var(--text)]">¿Qué es?</b> {l.que}
                </p>
                <p className="mt-1.5 text-[15px] leading-relaxed text-[var(--text-2)]">
                  <b className="text-[var(--text)]">Qué vas a hacer:</b> {l.haces}
                </p>
                <button className={cn("btn btn-sm mt-3 w-full", activo ? "" : "btn-primary")} onClick={() => setAbierto(activo ? null : l)}>
                  <PixelIcon name="pickaxe" size={12} /> {activo ? "Cerrar laboratorio" : "Abrir laboratorio"}
                </button>
              </div>
            );
          })}
        </div>

        {abierto && (
          <div className="mt-5 rise">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <p className="label !text-[var(--accent)]">▸ En marcha · {abierto.nombre}</p>
              <button className="btn btn-xs" onClick={() => setAbierto(null)}>
                cerrar ✕
              </button>
            </div>
            <PracticaView p={abierto.practica} onDone={() => undefined} />
            <div className="card mt-3 flex flex-wrap items-center justify-between gap-3 p-3">
              <p className="text-[14px] text-[var(--text-2)]">
                ¿Quieres el nivel completo con teoría, ejemplo y reto?
              </p>
              <button className="btn btn-sm" onClick={() => go({ v: "mundo", id: AREA_MUNDO[abierto.area] ?? "cripto" })}>
                Ver el mundo ▶
              </button>
            </div>
          </div>
        )}

        <div className="mt-8">
          <Term title="cómo usar el laboratorio">
            {`1. Lee el "¿Qué es?" de cada tarjeta: te dice qué tecnología estás tocando.
2. Abre el laboratorio y cambia los valores: casi todo es reversible.
3. Lee el bloque "¿Por qué funciona así?" al final de cada práctica.
4. Si quieres la explicación completa, entra al mundo correspondiente.`}
          </Term>
        </div>
      </section>
    </main>
  );
}

const AREA_MUNDO: Record<string, string> = {
  cripto: "cripto",
  redes: "redes",
  sistemas: "sistemas",
  python: "python",
  seguridad: "seguridad",
};
