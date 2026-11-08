# FactionVault — ciberseguridad de verdad

¡Qué xopá! FactionVault enseña ciberseguridad **desde cero absoluto**, en español de Panamá y con estética pixel-art.
Cada nivel sigue la misma promesa: **teoría + mapa visual propio + ejemplo + práctica + reto**. Los diagramas explican flujos, capas y comparaciones clave.

Creada por **Abdiel Camargo (@abdiellzz)** · [GitHub](https://github.com/abdiellzz) · [LinkedIn](https://www.linkedin.com/in/camargoabdiel/)

## Qué trae

| Sección | Contenido |
|---|---|
| 7 mundos | Seguridad (5 niveles), Redes (8), Sistemas (8), Python (8), Criptografía (8), Ingeniería Social (8), Web (5) · 50 niveles en total |
| Laboratorio | 29 simuladores en 5 áreas. Incluye Terminal Linux con mini-CTF, redes, criptografía y cuatro micro-retos de Python editables y ejecutables con un intérprete educativo limitado y seguro. Cada práctica explica qué hace y por qué |
| Retos CTF | 42 retos con pista, solución y puntos |
| Detector de phishing | 12 mensajes (SMS, WhatsApp, correo, Discord), rondas de 10 |
| Guías | 8 tutoriales paso a paso |
| Glosario | 72 términos con buscador y filtros |
| Snippets | 12 recetas de terminal y Python |
| Progreso | XP, avance por mundo y objetivos filtrables, laboratorios, proyectos, 20 logros y meta semanal configurable con racha de estudio (se guarda en `localStorage`) |
| Examen final | Se desbloquea al completar los 50 niveles de los 7 mundos. Evalúa 18 preguntas estratificadas de un banco de 64 (al menos 2 por mundo; 50 de nivel + 14 casos de transferencia) y 2 laboratorios prácticos (Python y análisis de tráfico) en 25 minutos; nota sobre 100 y repaso explicado |
| Certificado | Se habilita al completar todos los mundos y aprobar el examen con 70/100. Se descarga en **PDF** (A4 horizontal) o **PNG**, con estética voxel/pixel, nombre, nota, progreso real e ID de emisión. Aclara que **no es una certificación oficial**. La vista de muestra lleva marca de agua y no ofrece acciones para editar, imprimir o descargar |
| Referencias | Las lecciones de XSS, SQLi, sesiones, autenticación y criptografía enlazan guías de OWASP fechadas. Se corrigieron estimaciones de contraseñas y afirmaciones absolutas sobre cifrado. |
| Términos y privacidad | Páginas públicas en el footer con reglas de uso seguro, datos locales, servicios externos y una política explícita de propiedad intelectual/uso autorizado. Son borradores informativos que requieren revisión jurídica antes de usarse como contrato. |
| Proyectos finales | Tres misiones seguras con datos ficticios: plan de defensa de una cuenta, triage de inicios de sesión y análisis de tráfico. Cada una genera un informe en pantalla y da 50 XP una sola vez. |
| Operación Bóveda | Investigación defensiva en 4 etapas con correo, registros, regla de reenvío y captura de red ficticios. Las decisiones correctas llevan a un informe explicativo y 100 XP una sola vez; no contacta sistemas reales. |
| Repaso inteligente | Las respuestas incorrectas en retos de nivel y examen generan tarjetas locales para hoy; al recordar, los intervalos crecen (1, 3, 7, 14 y 30 días). No penaliza ni comparte progreso. |
| Laboratorio de red | `ping`, `nmap` y `traceroute` contra la red ficticia 10.0.0.0/24, con puertos, servicios y un equipo intruso que hay que encontrar |
| Logs | Lectura de `/var/log/auth.log` con filtro, detección de fuerza bruta y plan de respuesta |
| PWA | `manifest.webmanifest`, iconos y service worker: se instala y funciona sin internet |
| Primer arranque | Onboarding de 3 pantallas que explica qué es, cómo se usa y qué es un nivel |
| Sonidos | Efectos 8-bit generados con WebAudio (sin archivos), apagados por defecto y con interruptor en el menú |

## Cómo se usa

- **Archivo final:** `dist/index.html`. Es un único HTML **autocontenido**: el CSS, el JS y los datos van dentro. Se puede abrir con doble clic o subir a cualquier hosting estático.
- **Para regenerarlo** después de editar: `npm install` y luego `npm run build`.
- **Comprobar calidad básica:** `npm run verify` revisa objetivos y referencias fechadas, rutas y proyectos finales, enlaces a laboratorios, 40 muestras equilibradas del examen, el intérprete Python acotado y pruebas de cifrado/lectura de formatos anteriores. Sale con código 1 si algo falla.
- **Presupuesto de rendimiento:** `npm run build` comprueba que el HTML único no exceda 950 kB (315 kB gzip). El planeta pausa su animación fuera de pantalla, en pestañas ocultas y con movimiento reducido.
- **QA manual pendiente:** sigue `docs/QA-EDUCATIVA.md` para teclado, lector de pantalla, contraste, tamaños móviles y revisión pedagógica; esas pruebas requieren navegador/dispositivo y no se declaran aprobadas por el build.
- **Si eres un agente o vienes de fuera:** lee `AGENT_NOTES.md` (estado, trampas y backlog) y `FACTIONVAULT_CONTEXT.md` (arquitectura).
- **PDF sin librerías:** el certificado se dibuja en un `<canvas>` a 2× y se mete en un PDF A4 horizontal armado a mano (`src/lib/certificado.ts`), comprimido con `CompressionStream` (`FlateDecode`). Si el navegador no lo soporta, cae a JPEG (`DCTDecode`).
- **PWA:** en `npm run build` el service worker (`public/sw.js`) guarda la app. Instalada, abre offline; en desarrollo se desregistra a propósito para no cachear archivos a medio editar.
- **Sin internet:** todo funciona salvo las fuentes pixel (*Press Start 2P*, *Pixelify Sans*, *VT323*, *Silkscreen*), que vienen de Google Fonts. Sin conexión caen a monoespaciadas del sistema (Courier New / Lucida Console) y la app sigue siendo usable. Si quieres las fuentes también offline, descarga los `.woff2` y decláralos con `@font-face` en `src/index.css`.
- **AES y SHA-256** usan WebCrypto. En `file://` funcionan en Chrome, Edge y Firefox. Si algún navegador lo bloquea, sirve la página por `https` o `localhost`.

## Esquema de `content.js`

Todo el contenido vive en `src/content.js`, que define `window.FV_CONTENT`. Para usar tu propio contenido, reemplaza ese objeto conservando este esquema y vuelve a compilar.

```js
const FV_CONTENT = {
  meta: { nombre, subtitulo, autor, github, linkedin, version },
  mundos: [{
    id, nombre, bioma, tagline, descripcion, color, fondo, icono, intro,
    niveles: [{
      id, nivel, titulo, subtitulo, minutos, icono, objetivos: [""],
      teoria: [ /* bloques: {t:"p"|"h"|"why"|"porque"|"tip"|"warn"|"result", text}
                   {t:"list", items:[]}  {t:"steps", items:[{t,d}]}
                   {t:"table", head:[], rows:[[]]}  {t:"term", title, text} */ ],
      ejemplos: [{ juego: "minecraft"|"fortnite"|"panama", titulo, texto }],
      practica: [ /* {tipo:"widget", w:"terminal"|"firewall"|"subnet"|"binary"|"encap"|"procs"|"scheduler"|"memory"|"chmod"|"flow"|"layers"|"match", props}
                     {tipo:"codigo", codigo, salida, explicacion, reto?:{enunciado,pista,debes_ver}}
                     {tipo:"orden", titulo, pasos:[]}   (en el orden correcto; la app los desordena)
                     {tipo:"escribir", pregunta, respuestas:[], pista, explicacion}
                     {tipo:"phishing", cantidad}
                     {tipo:"cesar"|"hash"|"password"|"aes"|"dh"} */
                     /* cualquier práctica acepta "porque": "..." y la app lo muestra
                        como bloque «¿por qué funciona así?» */ ],
      reto: { pregunta, opciones: [""], respuesta: 0, explicacion }
    }]
  }],
  retos:      [{ id, titulo, categoria, dificultad, puntos, enunciado, cifrado?, pista, aceptadas:[""], solucion, explicacion, tipo:"texto"|"opciones", opciones?, mundo }],
  glosario:   [{ termino, categoria, definicion, detalle }],
  tutoriales: [{ id, titulo, descripcion, nivel, minutos, icono, pasos:[{ titulo, texto, accion?:{ label, vista } }] }],
  phishing:   [{ id, canal:"sms"|"whatsapp"|"email"|"dm", remitente, asunto?, mensaje, enlace?, es_phishing, senales:[""], explicacion }],
  snippets:   [{ id, titulo, lenguaje, categoria, codigo, explicacion }]
};
```

Notas:
- `icono` usa los nombres de `src/components/PixelArt.tsx` (grass, chest, storm, diablo, ship, heart, diamond, snake, monitor, globe, pickaxe, key, xp, flag, torch, sword).
- Las respuestas escritas se comparan sin mayúsculas, tildes ni signos de puntuación.
- En los retos de `tipo: "opciones"`, `aceptadas` es la letra de la opción correcta (`"a"`, `"b"`…).

## Accesibilidad

- `lang="es"`, enlace «Saltar al contenido», `aria-label` en los botones de icono y `aria-current` en el menú activo.
- Foco visible de 3px y navegación por teclado en el inicio (flechas, Inicio/Fin y Enter sobre los mundos).
- Pestañas y opciones con roles ARIA; los avisos se anuncian con `aria-live`.
- `prefers-reduced-motion` desactiva las animaciones, la Tierra girando y el warp-flash.
- En el inicio la Tierra también gira arrastrándola con el mouse; las flechas mueven el destino y Enter despega.
- La Tierra lleva un cohete en órbita y la atmósfera toma el color del mundo elegido; las rutas `#/mundo/:id/:nivel/lab` abren el nivel directo en el laboratorio.

## Aviso

Herramienta educativa: practica solo en sistemas propios o autorizados. Comparte el enlace, no el código 😉
Derechos de autor: ver `LICENSE` (material original; componentes de terceros conservan sus licencias, recogidas en `THIRD_PARTY_NOTICES.md`).
