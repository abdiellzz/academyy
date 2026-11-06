# FactionVault — academia pixel de ciberseguridad

¡Qué xopá! FactionVault enseña ciberseguridad **desde cero absoluto**, en español de Panamá y con estética pixel-art.
Cada nivel sigue la misma promesa: **teoría + ejemplo + práctica + reto**.

Hecha por **@abdiellzz** · [github.com/abdiellzz](https://github.com/abdiellzz)

## Qué trae

| Sección | Contenido |
|---|---|
| 5 mundos | Redes (8 niveles), Sistemas Operativos (8), Python (8), Criptografía (6), Ingeniería Social (4) |
| Prácticas | Terminal Linux con mini-CTF, firewall, calculadora de subredes, binario, encapsulamiento, procesos, planificador de CPU, memoria, chmod, código Python con salida verificada, César, SHA-256, medidor de contraseñas, AES-GCM real, Diffie-Hellman, ordenar pasos, escribir respuesta y detector de phishing |
| Retos CTF | 20 retos con pista, solución y puntos |
| Detector de phishing | 12 mensajes (SMS, WhatsApp, correo, Discord), rondas de 10 |
| Guías | 8 tutoriales paso a paso |
| Glosario | 64 términos con buscador y filtros |
| Snippets | 12 recetas de terminal y Python |
| Progreso | XP, nivel, avance por mundo y 15 logros (se guarda en `localStorage`) |

## Cómo se usa

- **Archivo final:** `dist/index.html`. Es un único HTML **autocontenido**: el CSS, el JS y los datos van dentro. Se puede abrir con doble clic o subir a cualquier hosting estático.
- **Para regenerarlo** después de editar: `npm install` y luego `npm run build`.
- **Sin internet:** todo funciona salvo las fuentes pixel (*Press Start 2P*, *Pixelify Sans*, *VT323*, *Silkscreen*), que vienen de Google Fonts. Sin conexión caen a monoespaciadas del sistema (Courier New / Lucida Console) y la app sigue siendo usable. Si quieres las fuentes también offline, descarga los `.woff2` y decláralos con `@font-face` en `src/index.css`.
- **AES y SHA-256** usan WebCrypto. En `file://` funcionan en Chrome, Edge y Firefox. Si algún navegador lo bloquea, sirve la página por `https` o `localhost`.

## Esquema de `content.js`

Todo el contenido vive en `src/content.js`, que define `window.FV_CONTENT`. Para usar tu propio contenido, reemplaza ese objeto conservando este esquema y vuelve a compilar.

```js
const FV_CONTENT = {
  meta: { nombre, subtitulo, autor, github, version },
  mundos: [{
    id, nombre, bioma, tagline, descripcion, color, fondo, icono, intro,
    niveles: [{
      id, nivel, titulo, subtitulo, minutos, icono, objetivos: [""],
      teoria: [ /* bloques: {t:"p"|"h"|"why"|"tip"|"warn"|"result", text}
                   {t:"list", items:[]}  {t:"steps", items:[{t,d}]}
                   {t:"table", head:[], rows:[[]]}  {t:"term", title, text} */ ],
      ejemplos: [{ juego: "minecraft"|"fortnite"|"panama", titulo, texto }],
      practica: [ /* {tipo:"widget", w:"terminal"|"firewall"|"subnet"|"binary"|"encap"|"procs"|"scheduler"|"memory"|"chmod"|"flow"|"layers"|"match", props}
                     {tipo:"codigo", codigo, salida, explicacion, reto?:{enunciado,pista,debes_ver}}
                     {tipo:"orden", titulo, pasos:[]}   (en el orden correcto; la app los desordena)
                     {tipo:"escribir", pregunta, respuestas:[], pista, explicacion}
                     {tipo:"phishing", cantidad}
                     {tipo:"cesar"|"hash"|"password"|"aes"|"dh"} */ ],
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

## Aviso

Herramienta educativa: practica solo en sistemas propios o autorizados. Comparte el enlace, no el código 😉
Licencia: ver `LICENSE` (todos los derechos reservados, © @abdiellzz).
