import type { Contenido, Nivel } from "./types";

/* Niveles añadidos después del contenido original.
   Se inyectan en content.ts antes de contar niveles, para que todo
   (progreso, examen, buscador, portada) los vea como uno más. */

const SOCIAL: Nivel[] = [
  {
    id: "vishing",
    nivel: 4,
    titulo: "La voz del otro lado",
    subtitulo: "Llamadas, audios y voces clonadas con IA.",
    minutos: 9,
    icono: "storm",
    objetivos: [
      "Distinguir vishing (voz), smishing (SMS) y phishing (correo).",
      "Reconocer la urgencia como señal de alarma.",
      "Saber qué hacer cuando ya diste un dato."
    ],
    teoria: [
      { t: "why", text: "Una llamada se siente más real que un correo. Por eso funciona: la voz trae confianza prestada, y con diez segundos de audio público hoy se puede clonar." },
      { t: "p", text: "Vishing es ingeniería social por teléfono. El guion siempre es el mismo: alguien con autoridad (banco, soporte, aduana, tu jefe), un problema urgente y una solución que depende de que tú digas un dato o instales algo." },
      { t: "list", items: [
        "«Hay un cargo sospechoso, ¿me confirma el código?» → nunca se da.",
        "«Soy del soporte de Microsoft, su equipo tiene un virus» → no existen esas llamadas.",
        "«Ganó un premio, solo pague el envío» → el premio es el gancho.",
        "«Soy tu hijo, cambié de número, necesito plata ya» → pregunta algo que solo él sabría."
      ]},
      { t: "p", text: "La regla que corta el 95 % de estos intentos: colgar y llamar tú al número oficial. Si es real, el banco lo entenderá. Si no lo es, acabas de esquivarlo." },
      { t: "warn", text: "Ninguna entidad seria te pide por teléfono un código de verificación, una contraseña o que instales un programa de acceso remoto (AnyDesk, TeamViewer)." },
      { t: "result", text: "Al terminar deberías poder escuchar una llamada sospechosa y decir en diez segundos por qué lo es." }
    ],
    ejemplos: [
      { juego: "minecraft", titulo: "El aldeano que no es aldeano", texto: "En Minecraft, un jugador con skin de aldeano te ofrece diamantes si le sigues a un sitio raro. La skin no es identidad: la voz al teléfono tampoco." },
      { juego: "panama", titulo: "La llamada de la «aduana»", texto: "«Su paquete está retenido, pague 12 dólares aquí.» Llaman a cientos por día y siempre hay alguien esperando un paquete. La coincidencia no es casualidad: es el método." }
    ],
    practica: [
      { tipo: "orden", titulo: "Ordena cómo reaccionar a una llamada sospechosa", pasos: [
        "No dar ningún dato ni confirmar quién eres",
        "Colgar sin discutir",
        "Buscar el número oficial de la entidad",
        "Llamar tú y preguntar si hubo un contacto",
        "Si ya diste un dato: cambiar contraseña y avisar"
      ]}
    ],
    reto: {
      pregunta: "Un supuesto técnico te pide instalar AnyDesk para «revisar tu PC». ¿Cuál es el riesgo real?",
      opciones: [
        "Ninguno, es una herramienta de soporte",
        "Que esa persona tome control de tu equipo y de todo lo que hay dentro",
        "Solo que gaste datos",
        "Que se dañe el teclado"
      ],
      respuesta: 1,
      explicacion: "El acceso remoto legítimo lo inicias tú desde un soporte que tú contactaste. Si te lo piden por llamada entrante, es control de tu equipo entregado en bandeja."
    }
  },
  {
    id: "osint",
    nivel: 5,
    titulo: "Lo que publicas habla por ti",
    subtitulo: "Huella digital, OSINT y doxxing.",
    minutos: 8,
    icono: "search",
    objetivos: [
      "Ver tu propia huella digital como la vería un extraño.",
      "Entender cómo se combinan datos sueltos.",
      "Reducir la información que te expone."
    ],
    teoria: [
      { t: "why", text: "Un atacante no adivina tu contraseña a ciegas: primero te investiga. OSINT es información pública —fotos, perfiles, comentarios, repos, metadatos— y con ella se construye un perfil muy preciso." },
      { t: "p", text: "Cada dato suelto parece inofensivo: el colegio, tu ciudad en una foto, el nombre de tu perro, la empresa donde trabajas. Juntos responden las preguntas de seguridad y alimentan un ataque dirigido." },
      { t: "list", items: [
        "Una foto con GPS en el celular lleva la ubicación dentro del archivo (EXIF).",
        "El «cumpleaños» en un perfil público es media contraseña de mucha gente.",
        "Un repo de GitHub con una clave pegada es una puerta abierta con el cartel «pase».",
        "Buscar tu propio correo o usuario entre comillas muestra dónde estás registrado."
      ]},
      { t: "tip", text: "Hazte el ejercicio una vez: busca tu nombre + tu ciudad, y tu usuario principal. Mira qué aparece. Eso es tu superficie pública." },
      { t: "warn", text: "Publicar datos de otra persona para exponerla (doxxing) tiene consecuencias legales y reales. Aquí se aprende a defenderse, no a hacerlo." },
      { t: "result", text: "Deberías poder listar tres cosas que publicaste y que hoy quitarías o restringirías." }
    ],
    ejemplos: [
      { juego: "minecraft", titulo: "El mapa del servidor", texto: "Si publicas capturas de tu base con coordenadas, cualquiera sabe dónde cavar. En la vida real, las coordenadas son la hora, el colegio y la calle de tu foto." },
      { juego: "panama", titulo: "El «te vi en el estadio»", texto: "Subes la foto del partido en vivo. Quien la ve sabe que no estás en casa. El dato no es la dirección: es la ausencia." }
    ],
    practica: [
      { tipo: "escribir", pregunta: "¿Qué dato de una foto puede revelar dónde la tomaste aunque no lo escribas?", respuestas: ["exif", "los metadatos", "metadatos", "exif/metadatos", "gps"], pista: "Está dentro del archivo, no en la imagen.", explicacion: "Los metadatos EXIF pueden incluir coordenadas GPS, modelo de cámara y hora exacta. Muchas redes los borran al publicar; los chats y el correo a veces no." }
    ],
    reto: {
      pregunta: "Quieres publicar una foto sin revelar tu ubicación. ¿Qué es lo más fiable?",
      opciones: [
        "Poner la cuenta en privado y ya",
        "Quitar los metadatos y revisar qué se ve en el fondo de la foto",
        "Subirla y borrarla a los cinco minutos",
        "Cambiar el nombre del archivo"
      ],
      respuesta: 1,
      explicacion: "Privacidad de la cuenta no borra metadatos ni el reflejo en el espejo. Quitar EXIF y mirar el fondo delata menos que confiar en un ajuste."
    }
  },
  {
    id: "insider",
    nivel: 6,
    titulo: "El enemigo ya está dentro",
    subtitulo: "USB, colas y confianza mal puesta.",
    minutos: 9,
    icono: "key",
    objetivos: [
      "Conocer los ataques que no necesitan red.",
      "Entender el «tailgating» y el USB abandonado.",
      "Aplicar la regla de verificar sin ofender."
    ],
    teoria: [
      { t: "why", text: "La mayoría de las brechas no empiezan con un hacker en una habitación oscura: empiezan con una persona que confía, un dispositivo encontrado o un empleado molesto." },
      { t: "p", text: "El ataque físico también es ingeniería social. Dejar USBs en un parqueadero (baiting), entrar detrás de alguien con credencial (tailgating), o ganarse al de la recepción durante una semana, sigue funcionando mejor que cualquier exploit." },
      { t: "list", items: [
        "USB desconocido: nunca se conecta. Se entrega a quien corresponda.",
        "Nadie entra «de cortesía»: se verifica credencial, aunque parezca grosero.",
        "La información sensible no se comenta en la fila del almuerzo.",
        "Un exempleado con accesos vivos es una amenaza interna: se revocan el mismo día."
      ]},
      { t: "p", text: "La amenaza interna no siempre es maliciosa: a veces es alguien con prisa que manda una base de datos por WhatsApp para «avanzar»." },
      { t: "tip", text: "Verifica siempre por un canal distinto al que te contactaron. Si te escribieron por WhatsApp, confirma por el interno de la oficina." },
      { t: "result", text: "Deberías tener claro qué hacer con un USB que aparece y cómo frenar a alguien sin credencial." }
    ],
    ejemplos: [
      { juego: "minecraft", titulo: "El cofre trampa", texto: "Un cofre regalado en medio del camino con diamantes dentro suele tener TNT debajo. El USB con etiqueta «nómina 2026» es ese cofre." },
      { juego: "panama", titulo: "El de la caja", texto: "Alguien con uniforme de repartidor y una caja grande espera a que salga un empleado y entra detrás. No forzó nada: usó la cortesía." }
    ],
    practica: [
      { tipo: "orden", titulo: "Qué hacer con un USB que aparece en el estacionamiento", pasos: [
        "No conectarlo a ningún equipo",
        "Guardarlo en una bolsa y etiquetarlo",
        "Avisar a seguridad o a TI",
        "Que lo analicen en un equipo aislado si hace falta",
        "Recordar al equipo por qué no se conecta nada ajeno"
      ]}
    ],
    reto: {
      pregunta: "Alguien con credencial entra detrás de ti sin pasar su tarjeta porque «se le olvidó». ¿Qué haces?",
      opciones: [
        "Le dejo pasar, es una molestia innecesaria",
        "Le pido amablemente que pase su credencial o lo acompaño a recepción",
        "Le pregunto el nombre y ya",
        "Le tomo una foto y lo publico"
      ],
      respuesta: 1,
      explicacion: "El tailgating vive de la pena social. Pedirlo con amabilidad, o acompañar a recepción, detiene el ataque sin acusar a nadie: puede ser un empleado nuevo de verdad."
    }
  },
  {
    id: "etica",
    nivel: 7,
    titulo: "El límite legal",
    subtitulo: "Permiso, ética y consecuencias reales.",
    minutos: 8,
    icono: "shield",
    objetivos: [
      "Saber cuándo una prueba es legal y cuándo es delito.",
      "Entender qué es un alcance (scope) por escrito.",
      "Conocer el camino correcto para practicar."
    ],
    teoria: [
      { t: "why", text: "Saber hacer algo no es permiso para hacerlo. La diferencia entre un profesional de seguridad y un delincuente es un documento firmado: el permiso." },
      { t: "p", text: "Escanear una red, probar contraseñas o leer tráfico sin autorización es un delito en Panamá y en casi todo el mundo, aunque no dañes nada y aunque «solo querías ver». La intención no cambia el hecho." },
      { t: "list", items: [
        "Alcance escrito: qué sistemas, qué fechas, qué técnicas permitidas.",
        "Nunca tocar lo que no está en la lista, ni «de pasada».",
        "Si encuentras datos de personas, se reportan, no se copian.",
        "Los laboratorios y las plataformas legales existen para practicar sin riesgo."
      ]},
      { t: "p", text: "Este curso está hecho para que practiques en simuladores propios: la red 10.0.0.0/24 del laboratorio es ficticia y nada de lo que hagas aquí sale de tu navegador." },
      { t: "warn", text: "El «hackeo ético» sin contrato no existe: es intrusión con buenas intenciones, y las buenas intenciones no se defienden en un juzgado." },
      { t: "result", text: "Deberías poder explicar a alguien por qué el permiso por escrito es lo primero que se pide en cualquier trabajo de seguridad." }
    ],
    ejemplos: [
      { juego: "minecraft", titulo: "Servidor ajeno", texto: "Entrar a un servidor con un bug para «avisar» sigue siendo entrar sin permiso. Lo correcto: escribir al dueño y reportar el fallo." },
      { juego: "panama", titulo: "El examen de la universidad", texto: "Tener la habilidad de ver el examen del profesor no te da derecho a mirarlo. La ética es lo que haces cuando nadie te ve." }
    ],
    practica: [
      { tipo: "escribir", pregunta: "Antes de una prueba de penetración, ¿qué documento define qué puedes tocar?", respuestas: ["el alcance", "alcance", "scope", "el scope", "contrato"], pista: "En inglés se llama scope.", explicacion: "El alcance fija sistemas, fechas y técnicas permitidas. Todo lo que quede fuera de él está prohibido, aunque sea fácil." }
    ],
    reto: {
      pregunta: "Encuentras una web de tu ciudad con una falla evidente. ¿Cuál es el camino correcto?",
      opciones: [
        "Aprovecharla para demostrar que existe",
        "Contactar al dueño o a un programa de divulgación responsable y no tocar nada más",
        "Publicarla en redes para que la arreglen rápido",
        "Venderla a alguien que la compre"
      ],
      respuesta: 1,
      explicacion: "La divulgación responsable avisa en privado, da tiempo a arreglar y no explota el fallo. Publicar o usar la falla te convierte en el atacante."
    }
  }
];

const CRIPTO: Nivel[] = [
  {
    id: "firma",
    nivel: 6,
    titulo: "Firmas digitales",
    subtitulo: "Quién lo dijo y que no cambió nada.",
    minutos: 9,
    icono: "key",
    objetivos: [
      "Diferenciar cifrar de firmar.",
      "Entender hash + clave privada = firma.",
      "Verificar una firma y saber qué garantiza."
    ],
    teoria: [
      { t: "why", text: "Cifrar esconde el mensaje. Firmar demuestra quién lo escribió y que nadie lo cambió. Son dos problemas distintos y se resuelven con herramientas distintas." },
      { t: "p", text: "Una firma digital es un hash del mensaje cifrado con la clave privada del autor. Cualquiera con su clave pública recalcula el hash y comprueba dos cosas: que la firma corresponde a ese mensaje y que el mensaje no cambió ni un punto." },
      { t: "list", items: [
        "Firma: autenticidad + integridad. No da confidencialidad.",
        "Cifrado: confidencialidad. No dice quién escribió.",
        "Si el mensaje cambia, el hash cambia y la firma deja de validar.",
        "La clave privada firma; la pública verifica. Al revés no funciona."
      ]},
      { t: "tip", text: "TLS, las actualizaciones del sistema y los commits firmados usan exactamente esta idea: hash + clave privada." },
      { t: "result", text: "Deberías poder explicar por qué una firma válida no significa que el mensaje sea verdad, solo que lo escribió quien dice." }
    ],
    ejemplos: [
      { juego: "minecraft", titulo: "El sello del rey", texto: "El sello demuestra que la carta viene del rey y que nadie la abrió, pero no la hace secreta: cualquiera puede leerla." },
      { juego: "panama", titulo: "La firma del notario", texto: "El notario no guarda secreto de lo que firmas: certifica que fuiste tú y que el documento es ese y no otro." }
    ],
    practica: [
      { tipo: "hash" }
    ],
    reto: {
      pregunta: "Recibes un archivo con su firma digital y la firma es válida. ¿Qué puedes afirmar?",
      opciones: [
        "Que el archivo es seguro y no tiene virus",
        "Que lo firmó quien dice y que no se modificó desde entonces",
        "Que el archivo viajó cifrado",
        "Que el archivo es legal"
      ],
      respuesta: 1,
      explicacion: "La firma habla de autoría e integridad. Un instalador firmado por una empresa real puede seguir siendo un programa que no quieres en tu equipo."
    }
  },
  {
    id: "tls",
    nivel: 7,
    titulo: "El túnel: TLS de verdad",
    subtitulo: "El candado negocia una clave en milisegundos.",
    minutos: 10,
    icono: "globe",
    objetivos: [
      "Entender qué pasa cuando abres una web con HTTPS.",
      "Ver el papel de los certificados y las autoridades.",
      "Distinguir cifrado de confianza."
    ],
    teoria: [
      { t: "why", text: "Cuando entras a un banco, tu navegador y el servidor acuerdan una clave secreta en milisegundos sin que nadie más pueda copiarla. Eso es TLS, y es lo que hace usable la criptografía asimétrica." },
      { t: "steps", items: [
        { t: "1 · Hola", d: "El navegador dice qué versiones y cifrados soporta." },
        { t: "2 · Certificado", d: "El servidor responde con su certificado, firmado por una autoridad (CA)." },
        { t: "3 · Verificación", d: "El navegador comprueba la firma de la CA y que el dominio coincida." },
        { t: "4 · Acuerdo de clave", d: "Intercambio Diffie-Hellman: ambos calculan la misma clave sin enviarla." },
        { t: "5 · Túnel", d: "Todo el tráfico va cifrado y autenticado con esa clave de sesión." }
      ]},
      { t: "p", text: "TLS mezcla las dos familias: asimétrica para identificarse y acordar la clave, simétrica para el volumen. Esa es la receta de casi todo lo seguro que usas." },
      { t: "warn", text: "Un certificado válido solo dice que el dominio es ese. Un sitio de phishing con certificado válido sigue siendo phishing: mira siempre el dominio, no el candado." },
      { t: "result", text: "Deberías poder contar el handshake de memoria y explicar por qué el candado no es un sello de confianza." }
    ],
    ejemplos: [
      { juego: "minecraft", titulo: "La puerta blindada", texto: "TLS es la puerta blindada del servidor: te protege del que escucha en el pasillo, pero no te dice si el dueño de la casa es buena gente." },
      { juego: "panama", titulo: "El sobre y el sello", texto: "El sobre cerrado (cifrado) protege el contenido; el sello (certificado) dice de dónde viene. Necesitas los dos, y ninguno te dice si el remitente te quiere estafar." }
    ],
    practica: [
      { tipo: "orden", titulo: "Ordena el handshake de TLS", pasos: [
        "ClientHello: versiones y cifrados",
        "ServerHello + certificado",
        "El navegador verifica la CA y el dominio",
        "Intercambio de claves Diffie-Hellman",
        "Tráfico cifrado con la clave de sesión"
      ]}
    ],
    reto: {
      pregunta: "¿Por qué TLS usa cifrado simétrico para los datos y no solo asimétrico?",
      opciones: [
        "Porque el simétrico es más rápido y el asimétrico se reserva para acordar la clave",
        "Porque el asimétrico es ilegal en algunos países",
        "Porque el simétrico no necesita contraseña",
        "Porque el asimétrico no se puede romper"
      ],
      respuesta: 0,
      explicacion: "El asimétrico es caro computacionalmente; el simétrico vuela. TLS usa lo mejor de cada uno: identidad asimétrica, volumen simétrico."
    }
  }
];

export function ampliar(C: Contenido): void {
  C.mundos.find((m) => m.id === "social")?.niveles.push(...SOCIAL);
  C.mundos.find((m) => m.id === "cripto")?.niveles.push(...CRIPTO);
}
