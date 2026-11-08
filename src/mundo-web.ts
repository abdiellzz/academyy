import type { Contenido, Mundo, RetoCTF } from "./types";

/* ═══════════════════════════════════════════════════════════════════
   Mundo Web · cómo funciona una web y por dónde se rompe
   (HTTP, formularios, XSS, SQLi y sesiones). Todo simulado.
   ═══════════════════════════════════════════════════════════════════ */

export const MUNDO_WEB: Mundo = {
  id: "web",
  nombre: "Mundo Web",
  bioma: "Ruinas del foro",
  tagline: "La web por dentro: peticiones, formularios y sus grietas.",
  descripcion:
    "Todo lo que usas vive en una web: el banco, el colegio, tu juego. Aquí ves qué viaja en cada clic y por qué un formulario mal hecho regala la base de datos.",
  color: "#b98bff",
  fondo: "#1f1233",
  icono: "monitor",
  intro:
    "Una web son dos programas hablando: el navegador pide, el servidor responde. Casi todas las brechas famosas nacen de no desconfiar de lo que llega en esa petición.",
  niveles: [
    {
      id: "que-es-web",
      nivel: 0,
      titulo: "Cómo viaja una página",
      subtitulo: "HTTP en una petición y una respuesta.",
      minutos: 8,
      icono: "globe",
      objetivos: [
        "Leer una petición HTTP de verdad.",
        "Entender métodos, cabeceras y códigos de estado.",
        "Saber dónde se puede colar algo raro."
      ],
      teoria: [
        { t: "why", text: "Si no sabes qué viaja en un clic, no puedes defenderlo. Toda la seguridad web es leer peticiones y decidir si son legítimas." },
        { t: "p", text: "Tu navegador manda una petición: un método (GET para pedir, POST para enviar), una ruta, cabeceras con contexto y, a veces, un cuerpo. El servidor contesta con un código y el contenido." },
        { t: "table", head: ["Código", "Significa", "Cuándo lo ves"], rows: [
          ["200", "Todo bien", "La página carga"],
          ["301 / 302", "Se mudó", "Redirección a otra URL"],
          ["403", "Prohibido", "No tienes permiso"],
          ["401", "No identificado", "Falta iniciar sesión"],
          ["404", "No existe", "URL mal escrita"],
          ["500", "Error del servidor", "El programa falló"]
        ]},
        { t: "p", text: "Cada parte de la petición es una entrada que el servidor debe tratar como hostil: la ruta, las cabeceras, las cookies y el cuerpo. Si una de esas se cuela en una consulta o en una página, tienes una brecha." },
        { t: "tip", text: "En el navegador, F12 → Red (Network) muestra cada petición con sus cabeceras. Es la herramienta más útil para entender esto." },
        { t: "result", text: "Deberías poder explicar la diferencia entre un 401 y un 403, y por qué importa." }
      ],
      ejemplos: [
        { juego: "minecraft", titulo: "El cartero del servidor", texto: "Tu navegador es un cartero: lleva una carta con remitente, destinatario y a veces un paquete. El servidor responde con otra carta y un sello (el código de estado)." },
        { juego: "panama", titulo: "El mostrador del banco", texto: "Llegas a la ventanilla, dices qué quieres (método) y muestras tu cédula (cookie). Si la cédula es falsa o el formulario está mal pedido, el cajero no debería entregar nada." }
      ],
      practica: [
        { tipo: "orden", titulo: "Ordena cómo se carga una página con sesión", pasos: [
          "El navegador escribe la URL y resuelve el DNS",
          "Abre la conexión TLS con el servidor",
          "Envía GET /cuenta con la cookie de sesión",
          "El servidor valida la cookie y consulta la base de datos",
          "Responde 200 con el HTML ya rellenado"
        ]}
      ],
      reto: {
        pregunta: "Un servidor responde 401 a una petición tuya. ¿Qué te está diciendo?",
        opciones: [
          "Que la página no existe",
          "Que no sabe quién eres: falta identificarte",
          "Que el servidor se cayó",
          "Que tienes permiso pero el servidor está lento"
        ],
        respuesta: 1,
        explicacion: "401 es «no autenticado» (falta identidad). 403 es «te conozco, pero no puedes pasar» (falta permiso). Confundirlos esconde errores de diseño."
      }
    },
    {
      id: "formularios",
      nivel: 1,
      titulo: "Lo que el navegador cree",
      subtitulo: "Validar en el cliente no es validar.",
      minutos: 9,
      icono: "key",
      objetivos: [
        "Ver por qué el navegador no es de fiar.",
        "Entender campos ocultos y mass assignment.",
        "Validar siempre en el servidor."
      ],
      teoria: [
        { t: "why", text: "Todo lo que está en el navegador lo puede cambiar el usuario. Si confías en él, cualquiera se pone el sueldo que quiera en un formulario." },
        { t: "p", text: "Un formulario envía pares nombre/valor. El HTML puede limitar con `maxlength`, `type=email` o JavaScript, pero eso es comodidad para el usuario, no seguridad: se saltan con F12, con curl o cambiando el HTML." },
        { t: "list", items: [
          "Validación en el cliente: ayuda y experiencia. Se evade en segundos.",
          "Validación en el servidor: la única que cuenta.",
          "Campos ocultos (input hidden) no son secretos: se ven en el HTML.",
          "Si el servidor acepta cualquier campo, puedes mandar `rol=admin` aunque no exista en el formulario."
        ]},
        { t: "warn", text: "Nunca pongas precios, roles ni identificadores críticos en campos que el navegador controla. Se deciden en el servidor." },
        { t: "result", text: "Deberías poder explicar por qué «si no se puede escribir, no se puede enviar» es falso." }
      ],
      ejemplos: [
        { juego: "minecraft", titulo: "El cartel del precio", texto: "Poner el precio en un cartel que el cliente puede editar es pedir que te paguen 1 esmeralda por un diamante. El precio lo decide la tienda, no el cartel." },
        { juego: "panama", titulo: "La boleta del sorteo", texto: "Si tú mismo rellenas el número premiado de la boleta, el sorteo no existe. En una web, el «número premiado» lo pone el servidor." }
      ],
      practica: [
        { tipo: "escribir", pregunta: "¿Dónde se valida de verdad un formulario: en el navegador o en el servidor?", respuestas: ["en el servidor", "servidor", "el servidor", "backend"], pista: "Donde el usuario no puede tocar el código.", explicacion: "El navegador es del usuario: puede modificar el HTML, saltarse el JavaScript y enviar lo que quiera. El servidor es el único punto de control real." }
      ],
      reto: {
        pregunta: "Una tienda calcula el total en JavaScript y lo manda en un campo oculto. ¿Cuál es el fallo?",
        opciones: [
          "Ninguno, el campo está oculto",
          "El total lo pone el cliente: se puede cambiar antes de enviar",
          "Es lento calcular en el navegador",
          "El campo oculto gasta datos"
        ],
        respuesta: 1,
        explicacion: "Oculto no es seguro: el valor viaja en la petición y se edita con F12. El servidor debe recalcular el total con los precios de su base de datos."
      }
    },
    {
      id: "xss",
      nivel: 2,
      titulo: "Cuando tu web habla por otros",
      subtitulo: "XSS: el código que se ejecuta en el navegador ajeno.",
      minutos: 10,
      icono: "storm",
      objetivos: [
        "Entender qué es XSS y por qué es grave.",
        "Distinguir reflejado, almacenado y DOM.",
        "Evitarlo con renderizado seguro y escape según el contexto.",
        "Entender CSP y HttpOnly como capas de defensa, no como cura."
      ],
      teoria: [
        { t: "why", text: "XSS hace que el navegador trate datos no confiables como código del sitio. Ese código puede actuar con los permisos de la víctima y cambiar lo que ve o hace. Si la cookie es HttpOnly, el script no la lee directamente, pero todavía podría realizar acciones desde esa sesión." },
        { t: "p", text: "Ocurre cuando la web mete datos del usuario en el HTML sin escaparlos. Si un comentario dice `<script>…</script>` y el servidor lo pinta tal cual, el navegador lo ejecuta como parte de la página." },
        { t: "list", items: [
          "Reflejado: el dato vuelve en la misma respuesta (un buscador, un mensaje de error).",
          "Almacenado: el dato queda guardado y puede afectar a muchas personas hasta que se corrige o elimina.",
          "DOM: el JavaScript de la página coloca datos en una zona que interpreta HTML (por ejemplo, innerHTML).",
          "Primera defensa: usa APIs que tratan los datos como texto y el escape automático del framework.",
          "Si necesitas HTML enriquecido, usa un sanitizador mantenido; valida el formato, pero no lo confundas con escape de salida.",
          "CSP y cookies HttpOnly limitan ciertos impactos: son capas adicionales, no reemplazan la prevención."
        ]},
        { t: "warn", text: "HttpOnly impide que JavaScript lea el valor de la cookie, pero no detiene el XSS ni todas las acciones hechas desde una sesión comprometida." },
        { t: "source", title: "OWASP · Cross Site Scripting Prevention Cheat Sheet", url: "https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.md", text: "Guía técnica para escoger una defensa según el contexto de salida y evitar APIs DOM inseguras.", revisado: "2026-11-06" },
        { t: "result", text: "Deberías distinguir entre mostrar un dato como texto, insertarlo como HTML y usar una defensa secundaria como CSP." }
      ],
      ejemplos: [
        { juego: "minecraft", titulo: "El libro firmado", texto: "Si alguien puede escribir en tu libro y tú copias el texto sin mirar, acabas firmando lo que esa persona escribió. Pintar HTML ajeno es firmar su código." },
        { juego: "panama", titulo: "El letrero del vecino", texto: "Prestas tu pared para un anuncio y alguien escribe una dirección falsa. XSS es eso: tu web mostrando el mensaje de otro." }
      ],
      practica: [
        { tipo: "escribir", pregunta: "¿Qué propiedad de JavaScript evita ejecutar HTML cuando quieres mostrar texto del usuario?", respuestas: ["textcontent", "textContent", "innertext", "innerText"], pista: "Hay una que inserta HTML (innerHTML) y otra que solo escribe texto.", explicacion: "textContent escribe texto plano y nunca lo interpreta. innerHTML parsea HTML: si el dato viene del usuario, es la puerta de entrada del XSS." }
      ],
      reto: {
        pregunta: "Un buscador muestra «No hay resultados para: <b>lo que escribiste</b>» sin escaparlo. ¿Qué riesgo hay?",
        opciones: [
          "Ninguno, es solo texto",
          "XSS reflejado: puedo meter una etiqueta que ejecute código en mi propia respuesta y enviar el enlace a otros",
          "Que la página se vea en negrita",
          "Que el buscador sea más lento"
        ],
        respuesta: 1,
        explicacion: "El dato vuelve en la respuesta y el navegador lo interpreta. Aunque el ataque lo dispares tú, el enlace se comparte y la víctima ejecuta el código dentro del dominio real."
      }
    },
    {
      id: "sqli",
      nivel: 3,
      titulo: "La consulta que miente",
      subtitulo: "SQLi: cuando el dato se vuelve instrucción.",
      minutos: 10,
      icono: "snake",
      objetivos: [
        "Ver cómo un dato se convierte en código SQL.",
        "Entender por qué las consultas parametrizadas lo cortan.",
        "Aplicar permisos mínimos a la base de datos."
      ],
      teoria: [
        { t: "why", text: "Si tu web arma la consulta pegando texto, el usuario puede cerrar la comilla y escribir SQL. Eso puede devolver toda la tabla, saltarse el login o borrar datos." },
        { t: "p", text: "La consulta clásica es `SELECT * FROM usuarios WHERE usuario = '<dato>'`. Si el dato es `' OR 1=1 --`, la consulta se convierte en «tráeme todos los usuarios» y el resto se comenta." },
        { t: "list", items: [
          "La defensa real: consultas parametrizadas (el dato nunca se concatena).",
          "Validar formato y longitud también ayuda, pero no sustituye a parametrizar.",
          "Los parámetros protegen valores; nombres de tablas o columnas deben salir de opciones fijas controladas por la app.",
          "La cuenta de la base de datos recibe solo los permisos que necesita.",
          "No muestres errores internos de SQL al usuario; registra el detalle de forma segura."
        ]},
        { t: "source", title: "OWASP · SQL Injection Prevention Cheat Sheet", url: "https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.md", text: "Referencia sobre consultas parametrizadas, elección segura de partes dinámicas y principio de menor privilegio.", revisado: "2026-11-06" },
        { t: "term", title: "la consulta, paso a paso", text: "SELECT * FROM usuarios\nWHERE usuario = '<lo que escribe el usuario>'\n\nsi el usuario escribe:  ' OR 1=1 --\n\nla consulta queda:\nSELECT * FROM usuarios WHERE usuario = '' OR 1=1 --'\n                                        ^ siempre verdadero" },
        { t: "result", text: "Deberías poder explicar por qué `' OR 1=1 --` funciona y cómo lo detiene un parámetro." }
      ],
      ejemplos: [
        { juego: "minecraft", titulo: "El comando del chat", texto: "Si escribes `/give @p diamante` en el chat y el servidor lo ejecuta sin distinguir jugador de comando, acabas dando objetos con una frase. SQLi es esa confusión." },
        { juego: "panama", titulo: "La fila del banco", texto: "«Quiero hablar con el cajero» y alguien grita «¡todos!». Si el sistema obedece la palabra «todos», no está comprobando a quién te referías." }
      ],
      practica: [
        { tipo: "escribir", pregunta: "¿Qué técnica impide que un dato se convierta en SQL?", respuestas: ["parametrizadas", "consultas parametrizadas", "parametrizada", "prepared statements", "consultas preparadas"], pista: "El dato viaja aparte de la instrucción.", explicacion: "En una consulta parametrizada el motor recibe la instrucción y los valores por separado: aunque el valor tenga comillas o guiones, se trata como texto, nunca como código." }
      ],
      reto: {
        pregunta: "¿Por qué `' OR 1=1 --` permite entrar sin contraseña en un login mal hecho?",
        opciones: [
          "Porque adivina la contraseña",
          "Porque cierra la comilla del dato, añade una condición siempre verdadera y comenta el resto de la consulta",
          "Porque reinicia la base de datos",
          "Porque desactiva el firewall"
        ],
        respuesta: 1,
        explicacion: "La comilla cierra el valor, `OR 1=1` hace que la condición sea cierta para todas las filas y `--` comenta lo que quedaba (la comprobación de contraseña)."
      }
    },
    {
      id: "sesiones",
      nivel: 4,
      titulo: "Quién eres en cada petición",
      subtitulo: "Cookies, JWT, CSRF e IDOR.",
      minutos: 9,
      icono: "chest",
      objetivos: [
        "Entender cómo una web recuerda que iniciaste sesión.",
        "Configurar cookies y tokens sin regalar la sesión.",
        "Reconocer IDOR y CSRF."
      ],
      teoria: [
        { t: "why", text: "HTTP no recuerda nada. Ese «recuerdo» es una cookie o un token, y si se filtra, el atacante es tú para el servidor." },
        { t: "p", text: "Al iniciar sesión el servidor crea una sesión y te da un identificador. En cada petición lo devuelves. Si alguien lo copia, entra sin contraseña." },
        { t: "list", items: [
          "Cookie de sesión: HttpOnly (que el JS no la lea), Secure (solo por HTTPS) y SameSite=Lax o Strict.",
          "Un identificador de sesión equivale temporalmente a la credencial: evita filtrarlo y revócalo al cerrar sesión.",
          "JWT: el contenido normalmente se puede leer; la firma permite detectar cambios, no ocultar secretos.",
          "IDOR: cambiar /factura/1024 por /factura/1025 y ver la de otro. El servidor debe autorizar cada objeto en cada petición.",
          "CSRF: otra web intenta enviar una petición en tu nombre. SameSite ayuda; las acciones sensibles también requieren defensas anti-CSRF."
        ]},
        { t: "tip", text: "Cierra sesión en equipos ajenos y revisa los dispositivos conectados de tu correo. El cierre debe invalidar la sesión del lado del servidor." },
        { t: "source", title: "OWASP · Session Management Cheat Sheet", url: "https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Session_Management_Cheat_Sheet.md", text: "Profundiza en identificadores de sesión, su ciclo de vida y la revocación al cerrar sesión.", revisado: "2026-11-06" },
        { t: "result", text: "Deberías explicar cómo se protege y revoca una sesión y por qué cada petición necesita autorización." }
      ],
      ejemplos: [
        { juego: "minecraft", titulo: "La llave del cofre", texto: "Entrar con sesión iniciada es llevar la llave puesta. Si alguien la copia, no necesita saber tu contraseña: abre igual." },
        { juego: "panama", titulo: "El recibo con tu nombre", texto: "IDOR es pedir el recibo número 1025 y que te lo den aunque no sea tuyo. El mostrador debe comprobar el nombre, no solo el número." }
      ],
      practica: [
        { tipo: "orden", titulo: "Ordena cómo se protege una sesión", pasos: [
          "Cookie con HttpOnly, Secure y SameSite",
          "Expiración corta y renovación por uso",
          "Comprobar el dueño del recurso en cada petición (anti-IDOR)",
          "Token anti-CSRF en formularios sensibles",
          "Cerrar sesión de verdad en el servidor"
        ]}
      ],
      reto: {
        pregunta: "Cambias /factura/1024 por /factura/1025 y ves la factura de otra persona. ¿Cómo se llama y cómo se arregla?",
        opciones: [
          "XSS: se arregla escapando el HTML",
          "IDOR: el servidor debe comprobar que el recurso es tuyo en cada petición",
          "SQLi: se arregla con parametrizadas",
          "CSRF: se arregla con SameSite"
        ],
        respuesta: 1,
        explicacion: "IDOR (referencia directa insegura a objetos): el servidor confía en el número que le das sin comprobar el dueño. Se corrige autorizando el recurso, no ocultando el enlace."
      }
    }
  ]
};

export const RETOS_WEB: RetoCTF[] = [
  {
    id: "web-codigo-401",
    titulo: "El sello del servidor",
    categoria: "Web",
    dificultad: "Fácil",
    puntos: 90,
    enunciado: "Pides /panel sin haber iniciado sesión y el servidor responde con un código. ¿Cuál es el correcto para «no sé quién eres»?",
    pista: "401 es identidad; 403 es permiso.",
    aceptadas: ["401"],
    solucion: "401",
    explicacion: "401 Unauthorized significa «falta autenticación». 403 Forbidden es «te conozco y no puedes». Un buen servidor no mezcla los dos.",
    tipo: "texto",
    mundo: "web"
  },
  {
    id: "web-xss-payload",
    titulo: "El comentario travieso",
    categoria: "Web",
    dificultad: "Media",
    puntos: 130,
    enunciado: "Un campo de comentarios pinta el texto tal cual en la página. ¿Qué carácter hay que escapar primero para cortar un XSS? (un carácter)",
    pista: "Es el que abre una etiqueta HTML.",
    aceptadas: ["<", "menor que", "el <", "\u003c"],
    solucion: "<",
    explicacion: "Escapar < (y > y las comillas) impide que el navegador interprete etiquetas. Junto a una CSP que bloquea scripts en línea, el XSS se queda sin sitio.",
    tipo: "texto",
    mundo: "web"
  },
  {
    id: "web-sqli-entrada",
    titulo: "Romper la consulta",
    categoria: "Web",
    dificultad: "Difícil",
    puntos: 160,
    enunciado: "La consulta es: SELECT * FROM usuarios WHERE usuario = '<dato>'. Escribe el dato clásico que devuelve todos los usuarios y comenta el resto.",
    pista: "Comilla, condición siempre verdadera y dos guiones.",
    aceptadas: ["' or 1=1 --", "' or 1=1--", "' or 1=1 -- -", "or 1=1 --", "' or '1'='1"],
    solucion: "' OR 1=1 --",
    explicacion: "La comilla cierra el valor y rompe la instrucción original. `OR 1=1` es cierto para todas las filas y `--` comenta la parte que quedaba, incluida la comprobación de contraseña.",
    tipo: "texto",
    mundo: "web"
  }
];

export function agregarMundoWeb(C: Contenido): void {
  if (!C.mundos.some((m) => m.id === "web")) C.mundos.push(MUNDO_WEB);
  const existentes = new Set(C.retos.map((r) => r.id));
  for (const r of RETOS_WEB) if (!existentes.has(r.id)) C.retos.push(r);
}
