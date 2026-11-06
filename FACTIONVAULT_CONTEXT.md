# FactionVault — contexto para futuros agentes (v4.0, reconstrucción)

Dueño y autor: **@abdiellzz** (github.com/abdiellzz). El crédito «HECHA POR @abdiellzz (github.com/abdiellzz)» vive en el Footer, los avisos de consola y LICENSE. **No eliminarlo.**

## Qué es
Ciberseguridad de verdad, en español panameño, siempre oscura y en pixel art. Cada nivel tiene 4 fases: **Teoría → Ejemplo → Práctica → Reto**.
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
src/assets/logo.ts    logo oficial (mono + cofre) en data URI: el build sigue siendo un archivo
src/lib/py.ts         mini Python → JS para el laboratorio (variables, f-strings, listas,
                      if/elif/else, for-in, range) con print real
src/lib/busqueda.ts   puente de una línea para que el buscador rellene el glosario
src/lib/planet.ts     motor de la Tierra en 3D sin DOM: máscara de continentes (equirect 256×128),
                      albedo, geometría precalculada y render de un frame RGBA (atmósfera, nubes
                      girando, luces de ciudades, luna, cohete en órbita con estela y pines de
                      cada mundo)
src/lib/store.ts      progreso en localStorage "factionvault-v4", XP (teoría 20 / práctica 40 / reto 60,
                      CTF = puntos, guía 50, phishing 10 por acierto récord, lab 30, examen 2×nota),
                      nivelDe (80·n²), 19 LOGROS, labs[], examenMejor/examenes/ultimoExamen, estudiante, notify()
src/lib/pwa.ts        registra public/sw.js solo en producción (en dev desregistra para no cachear)
src/lib/sonido.ts     efectos 8-bit con WebAudio (oscilador cuadrado + envolvente), apagados por defecto,
                      preferencia en localStorage y suscripción para el interruptor del menú
src/lib/certificado.ts  dibuja el diploma en canvas (misma composición que la versión HTML) y arma un PDF
                      A4 horizontal a mano: 6 objetos, xref clásico y la imagen en /FlateDecode
                      (CompressionStream) o /DCTDecode (JPEG) si no hay soporte
src/mundo-web.ts      Mundo Web: 5 niveles (HTTP, formularios, XSS, SQLi, sesiones) y 3 retos CTF.
                      content.ts lo inyecta con agregarMundoWeb(C) junto a extra-niveles
src/extra-niveles.ts  6 niveles añadidos (social 4 + cripto 2). content.ts llama ampliar(C) ANTES de
                      calcular totalNiveles, para que todo el resto los vea como niveles normales
src/views/Examen.tsx  20 preguntas al azar (banco = 45 retos de nivel), 20 min, nota /100, guarda la mejor
src/views/Certificado.tsx  documento CSS (no canvas) rellenable con el nombre, ID de emisión y @media print
src/lib/crypto.ts     caesar, normalizar, sha (WebCrypto), entropia, tiempoCrack, modPow, AES-GCM + PBKDF2
src/lib/protect.ts    aviso self-XSS en consola y copia masiva con atribución. El anti-iframe está
                      desactivado (rompía las vistas previas embebidas)
src/components/
  Globe.tsx           la Tierra del inicio: canvas 256×256, ~30 fps, arrastrable con el mouse y con
                      la atmósfera del color del mundo elegido (usa lib/planet.ts)
  ui.tsx              Logo, GameBox, Bloque (render de teoría), Term, Hud, Avisos, Bar, CopyBtn, SectionHead
  Practices.tsx       PracticaView dispatcher + motores: Codigo, Orden, Escribir, PhishingGame, Cesar, Hash,
                      Password, Aes, DH, Widget (puente a widgets/)
  widgets/            motores heredados y probados de la v3 (Common/Net/Os)
  PixelArt.tsx        PixelArt, MONKEY_GRID, Adventurer (Diel y Hailey, los monos
                      astronautas del hero), 18 PixelIcon (incluye search y shield)
  Biome.tsx           paisaje de cada mundo: siluetas escalonadas generadas con semilla
                      fija (BiomeScene), banner del mundo (BiomeBanner) y rejilla (BiomaGrid)
  CommandPalette.tsx  buscador global ⌘K sobre mundos, niveles, retos, glosario, guías
                      y snippets; navega con ↑↓/Enter
  widgets/CryptoWidgets.tsx  xor, vigenere, frecuencia, rsa, firma, kdf y brute
  Nav.tsx / Footer.tsx
src/views/            Labs (Laboratorio: 25 simuladores en 5 áreas, tarjeta explicativa y widget
                      en línea), Home («centro de mando»: Allen y Hailey, Tierra 3D con cohete en la esquina,
                      lista de destinos con preview, tablero, laboratorio abierto y accesos a todas
                      las secciones), World (WorldView + LevelView + reto),
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

## Mundo Seguridad (nuevo)
Primer mundo del juego (id `seguridad`, 5 niveles): tríada CIA, contraseñas y 2FA, enlaces falsos,
malware/parches/respaldos 3-2-1 y privacidad + plan de incidentes. Es el mundo más práctico: casi
todo son simuladores y cada práctica cierra con `porque` («¿por qué funciona así?»).
El bloque de teoría `porque` se pinta con el mismo componente `Caja` que `why`, en violeta.

## Mundo Web
Séptimo mundo (id `web`, bioma «Ruinas del foro», color `#b98bff`): HTTP y códigos de estado, formularios
y mass assignment, XSS (reflejado/almacenado/DOM), SQLi y consultas parametrizadas, y sesiones
(cookies HttpOnly/Secure/SameSite, JWT, IDOR, CSRF). Todo explicado con casos de Panamá y de Minecraft.
Su paleta vive en `PALETAS` de `src/components/Biome.tsx` con la clave `web`.

## Examen y certificado
- `#/examen`: 20 preguntas al azar de los 45 niveles, 20 minutos, nota entera sobre 100, aprobado en 70.
  Se guarda la mejor nota (no la última); el resultado lista los fallos con su explicación.
- `#/certificado`: solo con 70+. Documento en HTML/CSS (marco punteado, esquinas, sello y cintas) con
  nombre editable, progreso real, nota, fecha e ID derivado (`FV-XXYY-ZZZZ`). `Ctrl+P` → PDF.
  Dice explícitamente que **es un certificado de finalización de la plataforma, no una certificación oficial**.
- Descarga: «Descargar PDF» rasteriza a 2× (1.6× en móvil), extrae los bytes RGB y arma el PDF; «PNG» guarda
  la misma imagen. «Imprimir» sigue ahí como plan B. Sin aprobar se puede ver con `verEjemplo` (marca «EJEMPLO»).

## Backlog
- Fuentes offline embebidas (woff2 en base64) para que el archivo sea 100% autónomo.
- Mundo «Web/OWASP» (XSS, SQLi simulados) y mundo «Forense».
- Certificado por mundo (no solo el final) y verificación del ID en línea.
- Sonidos: más variedad y un volumen ajustable.
- Sonidos 8-bit opcionales con WebAudio, respetando reduced-motion y un toggle.
- Tests unitarios (vitest) para crypto, store y las calculadoras.
