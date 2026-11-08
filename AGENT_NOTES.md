# Notas para el siguiente agente — FactionVault

**Última actualización:** 2026-11-06 · **Rama de trabajo actual:** `arena/2a137eec-academyy` (activa; mantener este nombre)
Documento de traspaso: si algo aquí no coincide con el código, **manda el código** y actualiza este archivo.
El detalle de producto/arquitectura está en `FACTIONVAULT_CONTEXT.md`; este es el manual operativo.

---

## TL;DR

FactionVault es un curso interactivo de ciberseguridad en pixel art: **7 mundos · 50 niveles · 42 retos CTF · 29 laboratorios · 3 proyectos finales · 20 logros**, con examen final, certificado descargable en PDF, PWA offline y sonidos 8-bit opcionales.
Se compila a **un único `dist/index.html` autocontenido** (CSS, JS y datos dentro) más `public/` (iconos, manifest, service worker), con presupuesto de 950 kB / 315 kB gzip.
Está todo en español panameño, tú a tú, y **nada de backend**: el progreso vive en `localStorage`. El examen selecciona 18 preguntas equilibradas entre mundos más dos estaciones prácticas; el progreso incluye un mapa filtrable de objetivos y una acción local para borrarlo. No hay exportación de copia.

---

## Cómo correr y verificar

```bash
npm install                                   # una vez
npm run dev -- --host 0.0.0.0 --port 5173 --strictPort
npm run build                                 # → dist/ (index.html + assets de public/)
npm run verify                                # valida TODO el contenido (falla con exit 1)
npx tsc -p tsconfig.json --noEmit             # tipos
```

- **Vista previa:** el servidor debe escuchar en `0.0.0.0` (no `127.0.0.1`) o el iframe de Arena no carga.
- **Nunca** metas un guard anti-iframe (`window.top !== window`): rompe la vista previa. Ese código se borró a propósito.
- `npm run verify` es la puerta rápida antes de commitear: revisa ids, objetivos, fuentes fechadas, contenido, rutas de labs, el muestreo estratificado del examen, el intérprete Python acotado y la compatibilidad de AES-GCM.

### Recetas de verificación sin navegador (no hay navegador headless en el sandbox)

| Qué | Cómo |
|---|---|
| Que una vista renderiza | esbuild SSR: `npx esbuild /tmp/ssr.tsx --bundle --format=esm --platform=node --jsx=automatic --external:react --external:react-dom --banner:js='<stubs de localStorage/window/document>' --outfile=.ssr.mjs && node .ssr.mjs` y luego borrarlo |
| El certificado en imagen | `npm i --no-save @napi-rs/canvas`, dibujar `dibujarCertificado()` en un `createCanvas(1400,990)` y abrir el PNG |
| El PDF | Node 22 tiene `CompressionStream`: comprimir los bytes RGB, `construirPDF()`, y validar con Python (`zlib.decompress` del stream = `ancho*alto*3` y `startxref` apuntando a `xref`) |
| El planeta | `node --experimental-strip-types scripts/preview-planet.mjs 4` → PPM/PNG en `/tmp` |
| Datos | `npm run verify` |

Los stubs mínimos para SSR: `localStorage` (Map), `window` (`addEventListener`, `matchMedia`, `location.hash`, `setInterval`), `document` (`addEventListener`, `querySelector`, `createElement`), `navigator` (con `Object.defineProperty`, es getter de solo lectura en Node 22).

---

## Mapa del código

| Ruta | Qué hace |
|---|---|
| `src/content.js` | **Datos**: meta, 7 mundos con sus niveles (teoría, ejemplos, práctica, reto), 42 retos CTF, glosario, tutoriales, phishing, snippets. Define `window.FV_CONTENT`. |
| `src/extra-niveles.ts` | 4 niveles que amplían Ingeniería Social + 2 de Criptografía. |
| `src/mundo-web.ts` | Mundo Web completo (5 niveles) + 3 retos. **Plantilla para mundos nuevos.** |
| `src/lib/content.ts` | `C` (contenido), `mundoById`, `totalNiveles`. **Aquí se inyectan** `ampliar(C)` y `agregarMundoWeb(C)` **antes** de calcular `totalNiveles`. |
| `src/lib/store.ts` | Progreso en `localStorage` (`factionvault-v4`), metas semanales/racha, XP, niveles, mejor resultado detallado del examen, 20 logros y helpers de progreso. |
| `src/views/` | `Home`, `World` (mundo/nivel + `NotFound`), `Labs` (+`LABS`), `Examen`, `Certificado`, `Sections` (retos, phishing, guías, glosario, snippets, progreso). |
| `src/lib/certificado.ts` | Dibuja el diploma en canvas y arma el PDF A4 horizontal a mano (6 objetos, xref, `/FlateDecode` o `/DCTDecode`). |
| `src/lib/sonido.ts` | Efectos 8-bit con WebAudio, **apagados por defecto**, preferencia en `localStorage`. |
| `src/lib/pwa.ts` | Registra `public/sw.js` solo en producción y solo si el archivo existe (evita 404). |
| `src/lib/planet.ts` + `Globe.tsx` | Tierra pixel art en canvas 256×256, ~30 fps, con buffers reutilizados entre frames. |
| `src/index.css` | Paleta, `.card/.btn/.chip/.label/.field`, biomas, hero, certificado (`.cert-*`) y `@media print`. |
| `public/` | `manifest.webmanifest`, `sw.js`, iconos 192/512/maskable, `favicon.ico`, `apple-touch-icon*`, `robots.txt`. |

**Rutas (hash):** `#/`, `#/mundo/:id`, `#/mundo/:mundo/:nivel[/lab]`, `#/retos`, `#/laboratorio`, `#/examen`, `#/certificado`, `#/progreso`, `#/proyectos/:id?`, `#/operacion`, `#/repaso`, `#/terminos`, `#/privacidad`, `#/propiedad-intelectual`, `#/phishing`, `#/tutoriales`, `#/glosario`, `#/snippets`.

---

## Cómo añadir cosas

**Nivel nuevo** → añádelo a `src/extra-niveles.ts` (o al array del mundo en `content.js`). Campos obligatorios del tipo `Nivel`: `id, nivel (0-indexado y en orden), titulo, subtitulo, minutos, icono, objetivos[], teoria[]` (mínimo 3 bloques, con `why` y `result`), `ejemplos[]` (2), `practica[]`, `reto{ pregunta, 4 opciones, respuesta (índice), explicacion }`. Luego `npm run verify`.

**Mundo nuevo** → copia `src/mundo-web.ts`, define color/fondo/bioma/icono, añade su paleta en `PALETAS` de `src/components/Biome.tsx` con la misma clave del `id`, e inyéctalo en `content.ts`. Los textos con «6 mundos» ya son dinámicos (`C.mundos.length`), pero revisa `index.html` (descripción) y `public/manifest.webmanifest`.

**Laboratorio nuevo** → entrada en `LABS` (`src/views/Labs.tsx`) con `que` (qué es) y `haces` (qué vas a hacer, en segunda persona), widget en `src/components/widgets/*`, registro en `Practices.tsx` y su pareja en `LAB_LUGAR` apuntando al nivel exacto.

**Reto CTF** → `aceptadas[]` en minúsculas y sin acentos raros (se comparan normalizadas); si `tipo: "opciones"` las respuestas aceptadas son letras (`"a"`, `"b"`…).

---

## Reglas de producto (vienen del autor — no romper)

1. Pixel art **explícito**: bordes de 2px negros, sombras duras, cero `border-radius`, cero blur, cero degradados como protagonistas.
2. El logo es **el mono**, arriba a la izquierda, **sin filos blancos**, y es el logo principal.
3. El instructor se llama **Diel** (antes «Allen» en textos sueltos: si lo ves, cámbialo).
4. **Nunca** escribir la frase «academia pixel».
5. Cada práctica explica **el porqué**; cada lab dice qué es y para qué sirve («pista»).
6. Voz: español de Panamá, tú a tú, sin tecnicismos sin explicar.
7. **Prohibido** exportar/importar el progreso como JSON (el autor lo rechazó explícitamente).
8. El certificado **no es una certificación oficial** y debe decirlo en el propio documento.
9. Botones cómodos (≥42px de alto) y acciones principales evidentes (`.btn-xl`).
10. La app **debe** funcionar dentro del iframe de la vista previa.

---

## Trampas conocidas (no repetir estos errores)

- **Anti-iframe**: existió en `src/lib/protect.ts` y dejaba la vista previa en blanco. No volver a meterlo.
- **Tailwind v4**: `!` y modificadores de opacidad sobre variables arbitrarias son poco fiables; para detalles finos, escribe la regla en `src/index.css`.
- **`content.js`**: los ids de nivel no siempre coinciden con el título (`passwords`, `logs`, `terminal-ctf`…). Compruébalos antes de enlazar.
- **Logo**: no hay `vite/client`, así que el PNG va como data URI en `src/assets/logo.ts`.
- **`py.ts`**: intérprete educativo de Python limitado y sin `eval`/`new Function`; no añadir APIs arbitrarias del navegador. Los retos ejecutables tienen pruebas en `scripts/verificar.ts`.
- **`content.ts`**: `totalNiveles` se calcula al importar; si añades niveles **después**, la cuenta queda vieja (por eso `ampliar(C)` va antes).
- **Fuentes**: Google Fonts (Press Start 2P, Pixelify Sans, VT323, Silkscreen) no cargan en el sandbox. En el certificado hay fallback monoespaciado; `document.fonts.ready` se espera antes de dibujar.
- **`/favicon.ico`** era el 404 clásico en consola: ya está `public/favicon.ico` (+ `apple-touch-icon-precomposed.png`).
- **jsdom + React 19**: montar la app en jsdom no cuajó (render sin commit). No pierdas tiempo ahí: usa SSR + pruebas de datos.

---

## Estado por área

| Área | Estado |
|---|---|
| Portada | Promesa clara, CTA a la primera misión de 8 min, tres rutas por objetivo con progreso y proyecto de cierre; pixel art responsive. Prueba física pendiente. |
| Contenido | 50 niveles con objetivos explícitos, teoría/ejemplo/práctica/reto y 42 retos; retroalimentación gradual al fallar. |
| Laboratorio | 29 simuladores en cinco áreas, con modos Guiado/Reto, pistas graduadas y reinicio local de práctica. |
| Proyectos | Tres proyectos seguros de decisiones defensivas; informe final en pantalla y progreso/50 XP persistido localmente. |
| Examen | Bloqueado hasta completar los niveles; 18 preguntas estratificadas (2–3 por mundo) de un banco de 64, más dos estaciones prácticas; 25 min y repaso. Muestreo cubierto por pruebas. |
| Certificado | PDF/PNG con estética voxel/pixel; se basa en el mejor intento y expone las prácticas cuando corresponden. La muestra tiene marca de agua. |
| Progreso | Mapa filtrable de objetivos por mundo y fase, XP, labs, proyectos, examen, logros y metas semanales. El avance vive localmente y se puede borrar; no se ofrece exportación de copia. |
| PWA | Manifest, iconos, service worker; instala y abre offline. |
| Extras | ⌘K, onboarding de 3 pasos, sonidos 8-bit opcionales, biomas por mundo. |

---

## Backlog priorizado (lo que queda después de esta ronda)

1. **QA manual de accesibilidad y móvil**: recorrer teclado, NVDA/VoiceOver, zoom, contraste y tamaños reales. La lista reproducible está en `docs/QA-EDUCATIVA.md`; el sandbox no tiene navegador/dispositivo para certificar esos puntos.
2. **Revisión pedagógica con principiantes/especialistas**: validar comprensión y detectar ambigüedades de preguntas en todos los mundos; las pruebas de datos no sustituyen a estudiantes.
3. **Variantes de laboratorio y feedback por distractor**: generar casos reproducibles para que repetir una práctica mida comprensión, no memoria; añadir razones específicas por opción en los retos que aún no las tienen.
4. **Laboratorios web más realistas**: visor seguro de petición HTTP, SQLi/XSS defensivos y pruebas en datos ficticios, nunca contra servicios externos.
5. **Más pruebas puras**: convertir lógica de progreso, certificado y criptografía en pruebas unitarias separadas; hoy `npm run verify` ya cubre las rutas críticas de contenido, Python y AES.
6. **Certificado verificable**: explorar una página offline que explique el ID; no presentarlo como credencial oficial ni asumir verificación con backend.
7. **Rendimiento móvil adicional**: mantener el presupuesto del HTML único y medir en teléfonos reales; el planeta ya pausa fuera de pantalla, pestañas ocultas y con movimiento reducido.
8. **Sostener las fuentes**: revisar los enlaces fechados periódicamente y extender citas a más objetivos cuando corresponda.

---

## Convenciones de trabajo

- Commits en **español**, en imperativo y con el qué + por qué (`Fuera el 404 de favicon: …`).
- Antes de commitear: `npm run verify` + `npx tsc --noEmit` + `npm run build` (el `dist/` **sí** se versiona).
- Docs que se actualizan al cerrar una ronda: `README.md` (qué trae), `FACTIONVAULT_CONTEXT.md` (arquitectura), `AGENT_NOTES.md` (este archivo: estado, trampas, backlog).
- Al terminar cualquier ronda, decirle al autor **qué se puede mejorar** (es una preferencia explícita suya).
