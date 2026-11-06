# FactionVault — contexto para futuros agentes (v4.0, reconstrucción)

Dueño y autor: **@abdiellzz** (github.com/abdiellzz). El crédito «HECHA POR @abdiellzz (github.com/abdiellzz)» vive en el Footer, los avisos de consola y LICENSE. **No eliminarlo.**

## Qué es
Academia pixel de ciberseguridad en español panameño, siempre oscura. Cada nivel tiene 4 fases: **Teoría → Ejemplo → Práctica → Reto**.
El entregable es `dist/index.html`, un único archivo autocontenido generado con Vite + `vite-plugin-singlefile`. No necesita servidor ni dependencias en tiempo de ejecución, salvo Google Fonts, que es opcional y tiene fallback.

## Fuente de datos
`src/content.js` → `window.FV_CONTENT`. El esquema está documentado en `README.md` y los tipos en `src/types.ts`.
**No hardcodear contenido en los componentes:** todo sale de `C` (`src/lib/content.ts`).

Origen del contenido actual:
- No llegó ningún `content.js` del usuario y su especificación se cortó en la sección 3.
- Redes, Sistemas Operativos y Python se tomaron literalmente del contenido verificado de la v3 y se transformaron a teoría / ejemplos / práctica / reto.
- Criptografía (6 niveles), Ingeniería Social (4), phishing (12), snippets (12), 6 retos y 22 términos extra se escribieron nuevos con el mismo tono.
- Las salidas de los bloques `codigo` de Python fueron verificadas con Python 3 real.

## Arquitectura
```
index.html            lang=es, CSP (solo propio + Google Fonts), fuentes pixel
src/main.tsx          importa content.js, installProtection(), favicon pixel del mono
src/App.tsx           router por hash (#/, #/mundo/:id, #/mundo/:id/:nivel, #/retos, #/phishing,
                      #/tutoriales, #/glosario, #/snippets, #/progreso), warp-flash, HUD móvil, avisos
src/index.css         sistema visual: paleta oficial, .card .chip .btn .btn-primary .label .term .vault-table .mono,
                      cielo con estrellas, .grass, .warp, reduced-motion
src/lib/content.ts    C = window.FV_CONTENT; helpers
src/lib/planet.ts     motor de la Tierra en 3D sin DOM: máscara de continentes (equirect 256×128),
                      albedo, geometría precalculada y render de un frame RGBA (atmósfera, nubes
                      girando, luces de ciudades, luna y pines de cada mundo)
src/lib/store.ts      progreso en localStorage "factionvault-v4", XP (teoría 20 / práctica 40 / reto 60,
                      CTF = puntos, guía 50, phishing 10 por acierto récord), nivelDe (80·n²), 15 LOGROS, notify()
src/lib/crypto.ts     caesar, normalizar, sha (WebCrypto), entropia, tiempoCrack, modPow, AES-GCM + PBKDF2
src/lib/protect.ts    aviso self-XSS en consola, anti-iframe, copia masiva con atribución
src/components/
  Globe.tsx           la Tierra del inicio: canvas 256×256, ~30 fps, arrastrable con el mouse y con
                      la atmósfera del color del mundo elegido (usa lib/planet.ts)
  ui.tsx              Logo, GameBox, Bloque (render de teoría), Term, Hud, Avisos, Bar, CopyBtn, SectionHead
  Practices.tsx       PracticaView dispatcher + motores: Codigo, Orden, Escribir, PhishingGame, Cesar, Hash,
                      Password, Aes, DH, Widget (puente a widgets/)
  widgets/            motores heredados y probados de la v3 (Common/Net/Os)
  PixelArt.tsx        PixelArt, MONKEY_GRID (logo del mono), 16 PixelIcon
  Nav.tsx / Footer.tsx
src/views/            Home («centro de mando»: Tierra 3D en la esquina, lista de destinos con preview,
                      tablero de progreso y accesos a todas las secciones), World (WorldView + LevelView + reto),
                      Sections (Retos, Phishing, Tutoriales, Glosario, Snippets, Progreso)
```

## Reglas de diseño (no romper)
- Paleta: `#0d0b10` · `#151024 / #1d1730 / #251d3d` · texto `#f3ecff / #c3b6df / #8d81a8` · acentos `#ffb02e`, `#3ee07a`, `#ff5a6a`, `#5ad2ff`, `#b98bff`.
- Bordes negros de 2px, sombra dura `4px 4px 0 #000`, `border-radius: 0` global, sin blur.
- Fuentes: Press Start 2P (títulos, botones), Pixelify Sans (cuerpo), VT323 y Silkscreen (apoyo).
- Tono: tú a tú, panameño, cada término definido la primera vez.

## Verificación hecha (Playwright sobre dist/index.html vía file://)
- 0 desbordes a 390, 768, 1024, 1280, 1440 y 1920 px; 0 errores de consola.
- La Tierra pinta píxeles en el canvas.
- Las flechas del teclado mueven el foco entre mundos y Enter entra, con warp-flash.
- Un nivel completo (teoría → práctica escribir → reto) otorga XP, logro y subida de nivel.
- La práctica de ordenar, la ronda de 10 del phishing, un reto CTF, la ejecución simulada de código y el cifrado/descifrado AES funcionan.
- El progreso persiste.

## Verificación del planeta
`node --experimental-strip-types scripts/preview-planet.mjs 4` escribe PPM de cuatro ángulos en /tmp
para revisar continentes y sombreado sin abrir el navegador (convertir con ImageMagick a PNG).

## Backlog
- Fuentes offline embebidas (woff2 en base64) para que el archivo sea 100% autónomo.
- Mundo «Web/OWASP» (XSS, SQLi simulados) y mundo «Forense».
- Exportar e importar el progreso; certificado pixel por mundo (canvas → PNG).
- Sonidos 8-bit opcionales con WebAudio, respetando reduced-motion y un toggle.
- Tests unitarios (vitest) para crypto, store y las calculadoras.
