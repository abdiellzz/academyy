/* ═══════════════════════════════════════════════════════════════
   FactionVault · content.js  —  FUENTE DE DATOS DE LA ACADEMIA
   Todo el contenido (mundos, niveles, retos, glosario, tutoriales,
   phishing y snippets) vive aquí. La app lo lee desde window.FV_CONTENT.
   Para reemplazar el contenido: pega aquí tu objeto con el mismo esquema
   (ver README.md → «Esquema de content.js») y vuelve a construir.
   © 2026 @abdiellzz · github.com/abdiellzz
   ═══════════════════════════════════════════════════════════════ */
const FV_CONTENT = {
 "meta": {
  "nombre": "FactionVault",
  "subtitulo": "academia pixel de ciberseguridad",
  "autor": "@abdiellzz",
  "github": "https://github.com/abdiellzz",
  "version": "4.0"
 },
 "mundos": [
  {
   "id": "redes",
   "nombre": "Mundo Redes",
   "bioma": "Bioma Océano",
   "tagline": "Cómo viajan los datos de tu PC al servidor y de vuelta.",
   "descripcion": "Bits, IP, subredes, TCP/UDP, puertos, DNS, ping y firewalls. Desde cero, con simuladores.",
   "color": "#5fd3ff",
   "fondo": "#0c1f2c",
   "icono": "globe",
   "intro": "Aquí entenderás qué pasa exactamente cuando entras a un servidor de Minecraft o a una partida de Fortnite: quién habla con quién, por dónde viajan los datos y cómo se protegen.",
   "niveles": [
    {
     "id": "que-es-red",
     "nivel": 0,
     "titulo": "¿Qué es una red?",
     "subtitulo": "Nivel 0: cero conocimientos previos. Empezamos aquí.",
     "minutos": 7,
     "icono": "globe",
     "objetivos": [
      "Explicar qué es una red con tus propias palabras.",
      "Distinguir LAN, WAN e Internet.",
      "Saber qué hacen el router, el switch y el módem."
     ],
     "teoria": [
      {
       "t": "why",
       "text": "Todo lo que haces en ciberseguridad pasa por una red. Un ataque, una defensa, un juego online… sin entender la red, solo ves magia. Cuando la entiendes, ves el camino exacto de cada dato."
      },
      {
       "t": "p",
       "text": "Una red es simplemente un grupo de dispositivos (computadoras, celulares, consolas, servidores) conectados para intercambiar información. Pueden conectarse con cable (Ethernet) o sin cable (Wi-Fi)."
      },
      {
       "t": "h",
       "text": "Los tres tamaños de red"
      },
      {
       "t": "table",
       "head": [
        "Tipo",
        "Qué es",
        "Ejemplo"
       ],
       "rows": [
        [
         "LAN",
         "Red local, un mismo lugar",
         "Tu casa, el laboratorio del colegio"
        ],
        [
         "WAN",
         "Red que une lugares lejanos",
         "Las sucursales de un banco en todo Panamá"
        ],
        [
         "Internet",
         "La red de todas las redes",
         "Todo el planeta conectado"
        ]
       ]
      },
      {
       "t": "h",
       "text": "Los aparatos que hacen que funcione"
      },
      {
       "t": "steps",
       "items": [
        {
         "t": "Mira tu red",
         "d": "En Windows abre «cmd» y escribe ipconfig. En Mac/Linux, abre la terminal y escribe ip a o ifconfig."
        },
        {
         "t": "Busca tu IP",
         "d": "Verás algo como 192.168.1.15: esa es la dirección de tu equipo dentro de tu LAN."
        },
        {
         "t": "Busca la puerta de enlace",
         "d": "La «puerta de enlace predeterminada» (por ejemplo 192.168.1.1) es tu router: la salida hacia Internet."
        }
       ]
      },
      {
       "t": "result",
       "text": "Deberías poder identificar dos direcciones: la de tu equipo y la del router. Si ambas empiezan igual (192.168.1.x), estás en la misma red local."
      }
     ],
     "ejemplos": [
      {
       "juego": "minecraft",
       "titulo": "Tu servidor de Minecraft es una red",
       "texto": "Cuando juegas en LAN con tu primo en la misma casa, sus computadoras forman una red local. Cuando entras a un servidor público como Hypixel, tu PC se conecta a una computadora lejana a través de Internet: una red de redes."
      },
      {
       "juego": "panama",
       "titulo": "El Metro de Panamá",
       "texto": "Imagina cada estación del Metro como un dispositivo y las vías como cables. La Línea 1 sería una red (LAN). Cuando la Línea 1 se conecta con la Línea 2 en San Miguelito, formas una red más grande. Internet sería como si todos los metros del mundo estuvieran conectados entre sí."
      }
     ],
     "practica": [
      {
       "tipo": "widget",
       "w": "layers",
       "props": {
        "title": "Del celular a Internet",
        "layers": [
         {
          "name": "Tu dispositivo",
          "desc": "PC, celular o consola. Envía y recibe datos.",
          "example": "Tu PS5 pidiendo entrar a Fortnite"
         },
         {
          "name": "Switch",
          "desc": "Conecta dispositivos DENTRO de la red local y entrega cada dato al aparato correcto.",
          "example": "Las 30 PCs del laboratorio del colegio"
         },
         {
          "name": "Router",
          "desc": "Conecta TU red con OTRAS redes. Decide por dónde enviar cada paquete.",
          "example": "La cajita Wi-Fi de tu casa"
         },
         {
          "name": "Módem / ONT",
          "desc": "Traduce la señal de tu proveedor (fibra, cable) a datos digitales.",
          "example": "El aparato que instaló tu compañía de internet"
         },
         {
          "name": "Internet",
          "desc": "Millones de routers de proveedores enlazados por cables submarinos y fibra.",
          "example": "Los cables que llegan a Panamá por el mar"
         }
        ]
       }
      }
     ],
     "reto": {
      "pregunta": "¿Qué aparato conecta tu red de casa con Internet?",
      "opciones": [
       "El switch",
       "El router",
       "El monitor",
       "El teclado"
      ],
      "respuesta": 1,
      "explicacion": "El router une redes distintas: tu LAN con la red de tu proveedor. El switch solo reparte datos dentro de la misma red."
     }
    },
    {
     "id": "binario",
     "nivel": 1,
     "titulo": "Bits, bytes y binario",
     "subtitulo": "El idioma de las máquinas: solo encendido y apagado.",
     "minutos": 9,
     "icono": "torch",
     "objetivos": [
      "Entender qué es un bit y un byte.",
      "Convertir números entre decimal y binario.",
      "Ver por qué las IP van de 0 a 255."
     ],
     "teoria": [
      {
       "t": "why",
       "text": "Las direcciones IP, las máscaras de red y los permisos de archivos se basan en binario. Si dominas esto, las subredes dejan de ser un misterio."
      },
      {
       "t": "p",
       "text": "Un bit es la unidad mínima de información: 0 o 1, apagado o encendido. Un byte son 8 bits juntos. Con 8 bits puedes formar 256 combinaciones distintas (de 0 a 255)."
      },
      {
       "t": "steps",
       "items": [
        {
         "t": "Escribe 10 en binario",
         "d": "Busca los valores que suman 10: 8 + 2. Enciende las lámparas 8 y 2 → 00001010."
        },
        {
         "t": "Escribe 255",
         "d": "Enciende todas: 128+64+32+16+8+4+2+1 = 255 → 11111111. Por eso ningún número de una IP pasa de 255."
        },
        {
         "t": "Escribe 192",
         "d": "128 + 64 = 192 → 11000000. Este número aparece en casi todas las IP de casa (192.168…)."
        }
       ]
      },
      {
       "t": "result",
       "text": "Con el simulador, al encender 128 y 64 deberías ver 192. Si enciendes todas, 255."
      },
      {
       "t": "tip",
       "text": "Truco rápido: memoriza la escalera 128-64-32-16-8-4-2-1. Para convertir, ve de izquierda a derecha restando lo que quepa."
      }
     ],
     "ejemplos": [
      {
       "juego": "minecraft",
       "titulo": "Lámparas de redstone",
       "texto": "Pon 8 lámparas de redstone en fila. Cada una puede estar apagada (0) o encendida (1). La de la derecha vale 1, la siguiente 2, luego 4, 8, 16, 32, 64 y 128. Para escribir el número 5 enciendes la de 4 y la de 1: 00000101. ¡Acabas de construir un byte!"
      },
      {
       "juego": "fortnite",
       "titulo": "Velocidad de internet",
       "texto": "Cuando tu plan dice «100 Mbps» son megaBITS por segundo, no megaBYTES. Divide entre 8: descargarías ~12,5 MB por segundo. Por eso la actualización de 20 GB de Fortnite tarda más de lo que parece."
      }
     ],
     "practica": [
      {
       "tipo": "widget",
       "w": "binary",
       "props": {}
      }
     ],
     "reto": {
      "pregunta": "¿Cuánto vale 00010001 en decimal?",
      "opciones": [
       "11",
       "17",
       "9",
       "34"
      ],
      "respuesta": 1,
      "explicacion": "Están encendidas las posiciones 16 y 1: 16 + 1 = 17."
     }
    },
    {
     "id": "ip-subredes",
     "nivel": 2,
     "titulo": "Direcciones IP y subredes",
     "subtitulo": "La dirección de cada casa en el barrio digital.",
     "minutos": 12,
     "icono": "flag",
     "objetivos": [
      "Leer una IPv4 y su máscara.",
      "Calcular red, broadcast y hosts de una subred.",
      "Distinguir IP pública de privada."
     ],
     "teoria": [
      {
       "t": "why",
       "text": "En ciberseguridad lo primero que haces es mapear la red: qué IPs existen y qué rango cubren. Sin saber subredes, no sabrías ni dónde buscar."
      },
      {
       "t": "p",
       "text": "Una dirección IPv4 son 4 números de 0 a 255 separados por puntos (32 bits en total), como 192.168.1.20. Identifica a un dispositivo dentro de una red, igual que una dirección postal identifica una casa."
      },
      {
       "t": "h",
       "text": "La máscara: dónde termina el barrio y empieza la casa"
      },
      {
       "t": "p",
       "text": "La máscara (o el /24 del CIDR) dice cuántos bits son de red. /24 significa que los primeros 24 bits (tres números) son el barrio y el último número es la casa. Así, en 192.168.1.0/24 caben 254 dispositivos (.1 a .254)."
      },
      {
       "t": "steps",
       "items": [
        {
         "t": "Prueba 192.168.1.20/24",
         "d": "Verás red 192.168.1.0, broadcast 192.168.1.255 y 254 hosts útiles."
        },
        {
         "t": "Cambia a /26",
         "d": "Ahora solo 6 bits para hosts: 62 dispositivos. Útil para separar, por ejemplo, las cámaras del resto."
        },
        {
         "t": "Cambia a /30",
         "d": "Solo 2 hosts: típico para enlazar dos routers entre sí."
        }
       ]
      },
      {
       "t": "result",
       "text": "Cuanto más grande el número después de la barra, más pequeña la subred. /24 = 254 hosts, /26 = 62, /30 = 2."
      },
      {
       "t": "table",
       "head": [
        "Rango privado",
        "Uso típico"
       ],
       "rows": [
        [
         "10.0.0.0/8",
         "Empresas grandes"
        ],
        [
         "172.16.0.0/12",
         "Empresas medianas, Docker"
        ],
        [
         "192.168.0.0/16",
         "Casas y oficinas pequeñas"
        ]
       ]
      },
      {
       "t": "p",
       "text": "Las IP privadas solo existen dentro de tu red: miles de casas en Panamá usan 192.168.1.x a la vez sin chocar. Hacia Internet, tu router usa una sola IP pública (eso se llama NAT; lo verás en la lección de firewalls)."
      }
     ],
     "ejemplos": [
      {
       "juego": "panama",
       "titulo": "Direcciones en Panamá",
       "texto": "Piensa en «Provincia de Panamá → Distrito de San Miguelito → Corregimiento → Casa 20». La parte de red de la IP es como provincia-distrito-corregimiento (dónde está el barrio) y la parte de host es el número de casa."
      },
      {
       "juego": "fortnite",
       "titulo": "Coordenadas del mapa",
       "texto": "En Fortnite, la cuadrícula del mapa (B4, C6…) te dice la zona; luego afinas el punto exacto. La IP funciona igual: la parte de red te lleva a la zona y la parte de host al jugador exacto."
      }
     ],
     "practica": [
      {
       "tipo": "widget",
       "w": "subnet",
       "props": {}
      }
     ],
     "reto": {
      "pregunta": "¿Cuántos hosts útiles tiene una red /24?",
      "opciones": [
       "256",
       "255",
       "254",
       "24"
      ],
      "respuesta": 2,
      "explicacion": "256 direcciones menos 2 reservadas (la de red .0 y la de broadcast .255) = 254 hosts."
     }
    },
    {
     "id": "osi",
     "nivel": 3,
     "titulo": "Capas y encapsulamiento",
     "subtitulo": "Cofres dentro de cofres: cómo se empaqueta un dato.",
     "minutos": 11,
     "icono": "chest",
     "objetivos": [
      "Nombrar las capas del modelo TCP/IP.",
      "Entender el encapsulamiento.",
      "Saber en qué capa ocurre cada ataque."
     ],
     "teoria": [
      {
       "t": "why",
       "text": "Cuando un analista dice «es un ataque de capa 7» o «capa 2», está hablando de este modelo. Te permite ubicar cualquier problema: ¿falla el cable, la IP o la aplicación?"
      },
      {
       "t": "p",
       "text": "Enviar datos por la red es como enviar un regalo: lo metes en una caja, esa caja en otra con la dirección, y esa en un contenedor. Cada capa añade su propia «caja» (cabecera) con la información que necesita. Eso es el encapsulamiento."
      },
      {
       "t": "steps",
       "items": [
        {
         "t": "Avanza el simulador",
         "d": "Pulsa «Siguiente capa» y mira cómo el mensaje se envuelve en cabeceras HTTP → TCP → IP → Ethernet."
        },
        {
         "t": "Fíjate en el tamaño",
         "d": "Cada capa añade bytes. Un mensaje de 20 bytes acaba ocupando ~74 en el cable."
        },
        {
         "t": "Desencapsula",
         "d": "En el receptor el proceso se invierte: cada capa quita su cabecera y pasa el resto hacia arriba."
        }
       ]
      },
      {
       "t": "result",
       "text": "Al final deberías ver 4 cajas anidadas: [Ethernet [IP [TCP [HTTP: mensaje]]]]."
      }
     ],
     "ejemplos": [
      {
       "juego": "minecraft",
       "titulo": "Cofres dentro de shulkers",
       "texto": "Tu mensaje es un diamante. Lo metes en un cofre (capa aplicación), el cofre en una caja de shulker con etiqueta del puerto (transporte), esa caja en un carrito con la dirección de destino (red) y el carrito en los rieles (enlace/físico). Al llegar, se abre todo al revés."
      },
      {
       "juego": "panama",
       "titulo": "El Canal de Panamá y los contenedores",
       "texto": "Un barco que cruza el Canal lleva contenedores. Dentro de cada contenedor hay cajas, y dentro de las cajas, productos. Al barco solo le importa llegar al puerto correcto (capa de red); al contenedor, ir al almacén correcto (transporte); a la caja, el cliente final (aplicación)."
      }
     ],
     "practica": [
      {
       "tipo": "widget",
       "w": "encap",
       "props": {}
      },
      {
       "tipo": "widget",
       "w": "layers",
       "props": {
        "title": "Modelo TCP/IP (4 capas) ↔ OSI (7 capas)",
        "layers": [
         {
          "name": "Aplicación (OSI 5-7)",
          "desc": "Lo que ve el usuario: HTTP, DNS, SSH, el protocolo del juego.",
          "example": "Ataques: phishing, inyección SQL, DDoS de capa 7"
         },
         {
          "name": "Transporte (OSI 4)",
          "desc": "TCP o UDP. Puertos, orden y fiabilidad de la entrega.",
          "example": "Ataques: SYN flood, escaneo de puertos"
         },
         {
          "name": "Red / Internet (OSI 3)",
          "desc": "Direcciones IP y enrutamiento entre redes.",
          "example": "Ataques: IP spoofing, ataques al enrutamiento"
         },
         {
          "name": "Enlace + Físico (OSI 1-2)",
          "desc": "Direcciones MAC, Wi-Fi, cables, señales eléctricas.",
          "example": "Ataques: ARP spoofing, wifi falsas, cortar el cable"
         }
        ]
       }
      }
     ],
     "reto": {
      "pregunta": "Un escaneo de puertos ocurre principalmente en la capa…",
      "opciones": [
       "Física",
       "Transporte",
       "Aplicación",
       "Enlace"
      ],
      "respuesta": 1,
      "explicacion": "Los puertos son cosa de la capa de transporte (TCP/UDP). El escáner prueba qué puertos responden."
     }
    },
    {
     "id": "tcp-udp",
     "nivel": 4,
     "titulo": "TCP, UDP y puertos",
     "subtitulo": "Por qué Fortnite usa UDP y tu banco usa TCP.",
     "minutos": 12,
     "icono": "ship",
     "objetivos": [
      "Explicar el saludo de 3 pasos de TCP.",
      "Elegir TCP o UDP según el caso.",
      "Reconocer los puertos más importantes."
     ],
     "teoria": [
      {
       "t": "why",
       "text": "Los atacantes buscan puertos abiertos como quien busca puertas sin llave. Saber qué servicio vive en cada puerto es la base del reconocimiento y de la defensa."
      },
      {
       "t": "p",
       "text": "La IP lleva el paquete hasta la computadora correcta, pero dentro de esa computadora hay muchos programas. El puerto indica a qué programa va: es un número de 0 a 65535."
      },
      {
       "t": "h",
       "text": "TCP: la llamada formal"
      },
      {
       "t": "p",
       "text": "TCP garantiza que todo llegue completo y en orden. Antes de hablar, hace un saludo de tres pasos (3-way handshake). Si algo se pierde, lo reenvía."
      },
      {
       "t": "h",
       "text": "UDP: el grito rápido"
      },
      {
       "t": "p",
       "text": "UDP envía sin saludar y sin confirmar. Es más rápido pero puede perder paquetes. Ideal cuando la velocidad importa más que la perfección."
      },
      {
       "t": "warn",
       "text": "El puerto 3389 (RDP) o 22 (SSH) expuestos a Internet con contraseñas débiles son de las entradas más usadas por atacantes. Ciérralos o protégelos con VPN y llaves."
      }
     ],
     "ejemplos": [
      {
       "juego": "panama",
       "titulo": "Las esclusas del Canal",
       "texto": "La IP es el puerto de Balboa (la ciudad). El número de puerto es el muelle exacto: muelle 443 para la web segura, muelle 22 para el acceso remoto, muelle 25565 para Minecraft. Un barco con la ciudad correcta pero el muelle equivocado no descarga nada."
      },
      {
       "juego": "fortnite",
       "titulo": "Por qué los juegos usan UDP",
       "texto": "En Fortnite tu posición se envía decenas de veces por segundo. Si un paquete se pierde, no tiene sentido reenviarlo: ya llegó uno más nuevo. Con TCP, esperar el reenvío causaría «lag». Por eso los juegos online usan UDP, y la tienda de V-Bucks (pagos) usa TCP/HTTPS."
      }
     ],
     "practica": [
      {
       "tipo": "widget",
       "w": "flow",
       "props": {
        "title": "Saludo TCP de 3 pasos",
        "actors": [
         "Tu PC",
         "Servidor"
        ],
        "steps": [
         {
          "from": 0,
          "to": 1,
          "label": "SYN",
          "detail": "«Hola, ¿podemos hablar? Mi número de secuencia es 100.»"
         },
         {
          "from": 1,
          "to": 0,
          "label": "SYN-ACK",
          "detail": "«Sí, recibí tu 100. Mi número es 300.»"
         },
         {
          "from": 0,
          "to": 1,
          "label": "ACK",
          "detail": "«Recibí tu 300.» → Conexión establecida."
         },
         {
          "from": 0,
          "to": 1,
          "label": "DATOS",
          "detail": "Ahora sí viajan los datos (por ejemplo la petición web)."
         }
        ]
       }
      },
      {
       "tipo": "widget",
       "w": "match",
       "props": {
        "title": "Une cada puerto con su servicio",
        "pairs": [
         [
          "22",
          "SSH (acceso remoto)"
         ],
         [
          "53",
          "DNS"
         ],
         [
          "80",
          "HTTP (web sin cifrar)"
         ],
         [
          "443",
          "HTTPS (web segura)"
         ],
         [
          "3389",
          "Escritorio remoto Windows"
         ],
         [
          "25565",
          "Servidor de Minecraft"
         ]
        ]
       }
      }
     ],
     "reto": {
      "pregunta": "Para una videollamada en vivo, ¿qué protocolo de transporte encaja mejor?",
      "opciones": [
       "TCP, porque nunca pierde nada",
       "UDP, porque prioriza la velocidad",
       "Ninguno",
       "FTP"
      ],
      "respuesta": 1,
      "explicacion": "En tiempo real es mejor perder un fotograma que congelar la llamada esperando reenvíos. UDP gana."
     }
    },
    {
     "id": "dns",
     "nivel": 5,
     "titulo": "DNS: la guía telefónica",
     "subtitulo": "Cómo «minecraft.net» se convierte en una IP.",
     "minutos": 9,
     "icono": "key",
     "objetivos": [
      "Explicar para qué sirve DNS.",
      "Seguir una resolución DNS paso a paso.",
      "Reconocer ataques DNS comunes."
     ],
     "teoria": [
      {
       "t": "why",
       "text": "Si alguien controla tu DNS, puede mandarte a una web falsa aunque escribas bien la dirección. Es uno de los trucos favoritos del phishing."
      },
      {
       "t": "p",
       "text": "Las computadoras se hablan con IPs (números), pero los humanos recordamos nombres. DNS (Domain Name System) traduce nombres como minecraft.net a direcciones IP."
      },
      {
       "t": "steps",
       "items": [
        {
         "t": "Pruébalo en tu PC",
         "d": "Abre la terminal y escribe: nslookup minecraft.net"
        },
        {
         "t": "Lee la respuesta",
         "d": "Verás el servidor DNS que respondió y una o varias IP del dominio."
        },
        {
         "t": "Compara",
         "d": "Haz nslookup google.com: varias IPs, porque grandes servicios reparten la carga."
        }
       ]
      },
      {
       "t": "result",
       "text": "nslookup devuelve un bloque «Non-authoritative answer» con Name y Address(es). Esas son las IP a las que realmente te conectas."
      },
      {
       "t": "warn",
       "text": "DNS spoofing / envenenamiento: un atacante falsea respuestas DNS para mandarte a su servidor. Defensas: DNS sobre HTTPS (DoH), DNSSEC y fijarte siempre en el candado y el dominio exacto."
      }
     ],
     "ejemplos": [
      {
       "juego": "panama",
       "titulo": "La guía telefónica de toda la vida",
       "texto": "Antes, si querías llamar a la pizzería, buscabas su nombre en la guía y obtenías el número. DNS es esa guía: das el nombre del sitio y te devuelve su «número» (la IP)."
      }
     ],
     "practica": [
      {
       "tipo": "widget",
       "w": "flow",
       "props": {
        "title": "Resolviendo www.minecraft.net",
        "actors": [
         "Tu PC",
         "Resolver",
         "Raíz",
         "TLD .net",
         "DNS de minecraft"
        ],
        "steps": [
         {
          "from": 0,
          "to": 1,
          "label": "¿IP de www.minecraft.net?",
          "detail": "Tu PC pregunta al resolver de tu proveedor (o 1.1.1.1 / 8.8.8.8). Primero revisa su caché."
         },
         {
          "from": 1,
          "to": 2,
          "label": "¿Quién maneja .net?",
          "detail": "El resolver pregunta a un servidor raíz. Hay 13 identidades raíz repartidas por el mundo."
         },
         {
          "from": 2,
          "to": 1,
          "label": "Pregunta al TLD .net",
          "detail": "La raíz no sabe la IP, pero sabe quién administra .net."
         },
         {
          "from": 1,
          "to": 3,
          "label": "¿Quién maneja minecraft.net?",
          "detail": "El servidor del TLD .net indica los servidores autoritativos del dominio."
         },
         {
          "from": 3,
          "to": 1,
          "label": "Pregunta a ns1.minecraft…",
          "detail": "Te pasa la dirección del DNS autoritativo de Minecraft."
         },
         {
          "from": 1,
          "to": 4,
          "label": "¿IP de www?",
          "detail": "Pregunta final al dueño del dominio."
         },
         {
          "from": 4,
          "to": 1,
          "label": "→ 13.107.x.x",
          "detail": "Respuesta con la IP y un TTL (cuánto tiempo guardarla en caché)."
         },
         {
          "from": 1,
          "to": 0,
          "label": "IP lista",
          "detail": "Tu PC ya puede conectarse por TCP al puerto 443. Todo esto suele tardar menos de 50 ms."
         }
        ]
       }
      }
     ],
     "reto": {
      "pregunta": "¿Qué devuelve una consulta DNS de tipo A?",
      "opciones": [
       "Una dirección IPv4",
       "Una contraseña",
       "Un puerto",
       "Un archivo"
      ],
      "respuesta": 0,
      "explicacion": "El registro A asocia un nombre con una dirección IPv4. El registro AAAA hace lo mismo con IPv6."
     }
    },
    {
     "id": "ping",
     "nivel": 6,
     "titulo": "Ping, latencia y traceroute",
     "subtitulo": "Por qué tienes 120 de ping jugando desde Panamá.",
     "minutos": 9,
     "icono": "pickaxe",
     "objetivos": [
      "Medir latencia con ping.",
      "Seguir saltos con traceroute.",
      "Entender por qué la distancia importa."
     ],
     "teoria": [
      {
       "t": "why",
       "text": "Ping y traceroute son las primeras herramientas de diagnóstico de cualquier técnico. También sirven para descubrir qué hosts están vivos en una red."
      },
      {
       "t": "p",
       "text": "La latencia (ping) es el tiempo que tarda un paquete en ir y volver, medido en milisegundos (ms). No depende solo de tu velocidad contratada: depende sobre todo de la distancia y de cuántos routers hay por el medio."
      },
      {
       "t": "term",
       "title": "Así se ve en tu terminal",
       "text": "$ ping -c 3 minecraft.net\n64 bytes from 13.107.x.x: icmp_seq=1 ttl=117 time=61.8 ms\n64 bytes from 13.107.x.x: icmp_seq=2 ttl=117 time=62.4 ms\n64 bytes from 13.107.x.x: icmp_seq=3 ttl=117 time=60.9 ms\n--- 3 packets transmitted, 3 received, 0% packet loss"
      },
      {
       "t": "steps",
       "items": [
        {
         "t": "Haz ping",
         "d": "Windows: ping google.com · Mac/Linux: ping -c 4 google.com"
        },
        {
         "t": "Haz traceroute",
         "d": "Windows: tracert google.com · Mac/Linux: traceroute google.com"
        },
        {
         "t": "Interpreta",
         "d": "Busca el salto donde la latencia salta de golpe: ahí está el tramo largo o el cuello de botella."
        }
       ]
      },
      {
       "t": "result",
       "text": "Verás tiempos en ms y el porcentaje de pérdida. 0% de pérdida y tiempos estables = conexión sana."
      },
      {
       "t": "tip",
       "text": "El campo TTL de la respuesta delata pistas: Linux suele empezar en 64 y Windows en 128. Los analistas lo usan para adivinar el sistema operativo remoto."
      }
     ],
     "ejemplos": [
      {
       "juego": "fortnite",
       "titulo": "El ping en partida",
       "texto": "Si juegas en servidores de NA-Este desde Panamá, tus datos viajan miles de kilómetros: ~50-80 ms. Si el juego te manda a Europa, ~150+ ms y los disparos «no registran». La luz es rápida, pero la Tierra es grande."
      }
     ],
     "practica": [
      {
       "tipo": "widget",
       "w": "flow",
       "props": {
        "title": "Traceroute: Ciudad de Panamá → servidor en Virginia",
        "actors": [
         "Tu PC",
         "Router casa",
         "Proveedor PA",
         "Cable submarino",
         "Miami",
         "Servidor"
        ],
        "steps": [
         {
          "from": 0,
          "to": 1,
          "label": "salto 1 · 1 ms",
          "detail": "Tu router: lo más cercano. Si aquí ya hay mucha latencia, el problema es tu Wi-Fi."
         },
         {
          "from": 1,
          "to": 2,
          "label": "salto 2 · 8 ms",
          "detail": "La red de tu proveedor en Panamá."
         },
         {
          "from": 2,
          "to": 3,
          "label": "salto 3 · 12 ms",
          "detail": "Salida hacia los cables submarinos que conectan Panamá con el mundo."
         },
         {
          "from": 3,
          "to": 4,
          "label": "salto 4 · 38 ms",
          "detail": "Llegada a Miami, uno de los grandes puntos de intercambio de América."
         },
         {
          "from": 4,
          "to": 5,
          "label": "salto 5 · 62 ms",
          "detail": "Servidor de destino. Latencia total ida y vuelta ~62 ms."
         }
        ]
       }
      }
     ],
     "reto": {
      "pregunta": "Tienes 300 ms de ping en el salto 1 (tu router). ¿Dónde está el problema?",
      "opciones": [
       "En el servidor del juego",
       "En tu red local o Wi-Fi",
       "En el cable submarino",
       "En DNS"
      ],
      "respuesta": 1,
      "explicacion": "El salto 1 es tu propio router. Si ahí ya hay latencia alta, el problema está en casa: Wi-Fi saturado, interferencias o el router."
     }
    },
    {
     "id": "firewall",
     "nivel": 7,
     "titulo": "Firewall, NAT y Wi-Fi seguro",
     "subtitulo": "El guardia en la puerta del castillo.",
     "minutos": 12,
     "icono": "sword",
     "objetivos": [
      "Escribir reglas de firewall básicas.",
      "Entender NAT.",
      "Proteger tu Wi-Fi."
     ],
     "teoria": [
      {
       "t": "why",
       "text": "El firewall es la primera línea de defensa de cualquier red. Configurarlo bien bloquea la mayoría de ataques automáticos antes de que toquen tus equipos."
      },
      {
       "t": "p",
       "text": "Un firewall revisa cada paquete y decide según reglas: permitir o bloquear. Las reglas se leen de arriba abajo y la primera que coincide gana. Al final suele haber una regla «bloquear todo lo demás»."
      },
      {
       "t": "steps",
       "items": [
        {
         "t": "Analiza el tráfico",
         "d": "Mira los paquetes que llegan: web, SSH, Minecraft y un escaneo sospechoso."
        },
        {
         "t": "Escribe las reglas",
         "d": "Permite 443 y 25565, permite 22 solo desde tu IP de confianza y bloquea todo lo demás."
        },
        {
         "t": "Simula",
         "d": "Ejecuta y revisa qué paquetes pasaron. El objetivo: 0 paquetes maliciosos dentro."
        }
       ]
      },
      {
       "t": "result",
       "text": "Con una política «denegar por defecto», todo lo que no permitiste expresamente queda fuera. Ese es el principio de mínimo privilegio aplicado a la red."
      },
      {
       "t": "h",
       "text": "NAT: muchas casas, una sola dirección"
      },
      {
       "t": "p",
       "text": "Tu router traduce las IP privadas de tus dispositivos (192.168.1.x) a una única IP pública. Desde fuera, toda tu casa parece un solo dispositivo. Como efecto secundario, nadie de Internet puede iniciar conexiones hacia tus equipos sin que tú abras un puerto."
      },
      {
       "t": "list",
       "items": [
        "Usa WPA3 (o WPA2-AES) en tu Wi-Fi, nunca WEP.",
        "Cambia la contraseña del panel del router (no dejes admin/admin).",
        "Desactiva WPS: su PIN se puede romper por fuerza bruta.",
        "Crea una red de invitados para visitas y aparatos inteligentes.",
        "Actualiza el firmware del router."
       ]
      },
      {
       "t": "warn",
       "text": "Abrir puertos en el router (port forwarding) para tu servidor de Minecraft expone tu equipo a todo Internet. Hazlo solo en el puerto necesario y mantén el servidor actualizado."
      }
     ],
     "ejemplos": [
      {
       "juego": "minecraft",
       "titulo": "La whitelist de tu servidor",
       "texto": "En tu servidor de Minecraft activas la whitelist: solo entran los jugadores de la lista, el resto es rechazado. Un firewall es una whitelist para paquetes: solo pasan los puertos y direcciones que tú permites."
      },
      {
       "juego": "panama",
       "titulo": "El edificio con un solo apartado postal",
       "texto": "Imagina un edificio en Bella Vista donde todas las cartas llegan a un único apartado postal y el conserje las reparte por apartamento. Desde fuera solo se conoce el apartado (IP pública); el conserje (router con NAT) sabe a quién va cada carta."
      }
     ],
     "practica": [
      {
       "tipo": "widget",
       "w": "firewall",
       "props": {}
      }
     ],
     "reto": {
      "pregunta": "¿Qué significa «denegar por defecto» en un firewall?",
      "opciones": [
       "Permitir todo y bloquear lo malo conocido",
       "Bloquear todo salvo lo permitido expresamente",
       "Apagar el router",
       "Bloquear solo el Wi-Fi"
      ],
      "respuesta": 1,
      "explicacion": "Es la política más segura: si no hay una regla que lo permita, se bloquea. Así lo desconocido no entra."
     }
    }
   ]
  },
  {
   "id": "sistemas",
   "nombre": "Mundo Sistemas Operativos",
   "bioma": "Bioma Cueva",
   "tagline": "El jefe invisible que manda en tu computadora.",
   "descripcion": "Kernel, procesos, CPU, memoria, archivos, usuarios, permisos y la terminal de Linux. Con simuladores y un mini-CTF.",
   "color": "#3ee07a",
   "fondo": "#0d1f12",
   "icono": "monitor",
   "intro": "Aprenderás qué pasa por dentro cuando abres Minecraft: quién le da memoria, quién reparte la CPU, dónde se guardan tus mundos y quién tiene permiso para tocarlos.",
   "niveles": [
    {
     "id": "que-es-so",
     "nivel": 0,
     "titulo": "¿Qué es un sistema operativo?",
     "subtitulo": "Nivel 0: el gerente que nadie ve pero todo lo controla.",
     "minutos": 7,
     "icono": "monitor",
     "objetivos": [
      "Explicar qué hace un sistema operativo.",
      "Distinguir hardware, kernel y aplicaciones.",
      "Conocer Windows, Linux, macOS y Android."
     ],
     "teoria": [
      {
       "t": "why",
       "text": "Los atacantes buscan escalar privilegios dentro del sistema operativo: pasar de usuario normal a administrador. Para defenderlo hay que saber cómo está organizado."
      },
      {
       "t": "p",
       "text": "El sistema operativo (SO) es el programa principal que administra el hardware (CPU, memoria, disco, pantalla) y lo reparte entre las aplicaciones. Sin él, cada juego tendría que saber hablar directamente con tu tarjeta gráfica y tu disco."
      },
      {
       "t": "table",
       "head": [
        "Sistema",
        "Dónde lo ves",
        "Dato de seguridad"
       ],
       "rows": [
        [
         "Windows",
         "La mayoría de PCs",
         "Objetivo nº1 del malware por popularidad"
        ],
        [
         "Linux",
         "Servidores, Android, routers",
         "Domina Internet: ~90% de servidores"
        ],
        [
         "macOS",
         "Computadoras Apple",
         "Basado en Unix, permisos al estilo Linux"
        ],
        [
         "Android / iOS",
         "Celulares",
         "Cada app vive aislada en su «caja» (sandbox)"
        ]
       ]
      }
     ],
     "ejemplos": [
      {
       "juego": "panama",
       "titulo": "La ACP y el Canal",
       "texto": "La Autoridad del Canal de Panamá decide qué barco pasa, cuándo, por qué esclusa y cuánta agua usa. Los barcos (aplicaciones) no deciden solos: piden turno. El sistema operativo hace lo mismo con la CPU, la memoria y el disco."
      },
      {
       "juego": "minecraft",
       "titulo": "Minecraft corre sobre capas",
       "texto": "Minecraft Java no habla con tu hardware: corre sobre Java (JVM), que le pide recursos al sistema operativo, que usa los drivers para mover tu GPU. Por eso el mismo .jar funciona en Windows, Mac y Linux: cada SO pone su propia «base»."
      }
     ],
     "practica": [
      {
       "tipo": "widget",
       "w": "layers",
       "props": {
        "title": "Las capas de una computadora",
        "layers": [
         {
          "name": "Aplicaciones",
          "desc": "Lo que usas: Minecraft, Chrome, Discord. Piden recursos al SO.",
          "example": "Minecraft pide 4 GB de RAM"
         },
         {
          "name": "Llamadas al sistema",
          "desc": "La «ventanilla» para pedir cosas al kernel: abrir archivo, crear proceso, enviar a la red.",
          "example": "open(), read(), fork()"
         },
         {
          "name": "Kernel (núcleo)",
          "desc": "El corazón del SO. Maneja memoria, procesos, drivers y seguridad. Corre con privilegios máximos.",
          "example": "Linux, el kernel de Windows NT, XNU de macOS"
         },
         {
          "name": "Drivers",
          "desc": "Traductores entre el kernel y cada pieza de hardware concreta.",
          "example": "El driver de tu tarjeta gráfica NVIDIA/AMD"
         },
         {
          "name": "Hardware",
          "desc": "Lo físico: CPU, RAM, SSD, GPU, tarjeta de red.",
          "example": "Tu procesador de 8 núcleos"
         }
        ]
       }
      }
     ],
     "reto": {
      "pregunta": "¿Qué parte del sistema operativo tiene los privilegios máximos?",
      "opciones": [
       "El navegador",
       "El kernel",
       "El fondo de pantalla",
       "Los juegos"
      ],
      "respuesta": 1,
      "explicacion": "El kernel controla todo el hardware y la memoria. Por eso un fallo en el kernel es lo más grave que puede pasar en seguridad."
     }
    },
    {
     "id": "procesos",
     "nivel": 1,
     "titulo": "Procesos e hilos",
     "subtitulo": "Cada programa abierto es un jugador en la partida.",
     "minutos": 9,
     "icono": "sword",
     "objetivos": [
      "Diferenciar programa, proceso e hilo.",
      "Leer un administrador de tareas.",
      "Detectar procesos sospechosos."
     ],
     "teoria": [
      {
       "t": "why",
       "text": "Casi todo malware termina siendo un proceso corriendo en tu equipo. Saber leer la lista de procesos es la forma más directa de detectarlo."
      },
      {
       "t": "p",
       "text": "Un programa es un archivo quieto en el disco (minecraft.exe). Cuando lo abres, el SO crea un proceso: el programa en ejecución, con su propia memoria, un número de identificación (PID) y un dueño (usuario). Un proceso puede tener varios hilos que trabajan en paralelo."
      },
      {
       "t": "steps",
       "items": [
        {
         "t": "Abre el administrador",
         "d": "Windows: Ctrl+Shift+Esc · Mac: Monitor de actividad · Linux: comando top o htop."
        },
        {
         "t": "Ordena por CPU",
         "d": "Mira quién consume más. Un proceso desconocido al 100% de CPU sin motivo puede ser un minero de criptomonedas."
        },
        {
         "t": "Investiga nombres raros",
         "d": "Busca el nombre exacto del proceso en Internet y revisa la ruta del archivo. «svch0st.exe» con cero no es «svchost.exe»."
        }
       ]
      },
      {
       "t": "result",
       "text": "En el simulador, el proceso «xmrig_helper» con usuario desconocido y CPU altísima es el sospechoso. Al terminarlo, la CPU vuelve a la normalidad."
      },
      {
       "t": "tip",
       "text": "Los malware imitan nombres legítimos: svchost, explorer, chrome. Mira siempre la ruta: los de Windows viven en C:\\Windows\\System32, no en Descargas o AppData\\Temp."
      }
     ],
     "ejemplos": [
      {
       "juego": "fortnite",
       "titulo": "Jugadores en la isla",
       "texto": "El juego instalado es el programa. Cada partida activa es un proceso. Dentro de la partida, tu personaje dispara, construye y se mueve a la vez: esos son los hilos, tareas paralelas del mismo proceso."
      }
     ],
     "practica": [
      {
       "tipo": "widget",
       "w": "procs",
       "props": {}
      }
     ],
     "reto": {
      "pregunta": "¿Qué es un PID?",
      "opciones": [
       "Una contraseña",
       "El número que identifica a cada proceso",
       "Un tipo de virus",
       "Un puerto de red"
      ],
      "respuesta": 1,
      "explicacion": "PID = Process ID. El SO numera cada proceso para gestionarlo; con él puedes terminarlo (kill PID en Linux)."
     }
    },
    {
     "id": "cpu",
     "nivel": 2,
     "titulo": "Planificación de la CPU",
     "subtitulo": "Cómo un procesador atiende a 200 programas «a la vez».",
     "minutos": 10,
     "icono": "xp",
     "objetivos": [
      "Entender el reparto de tiempo de CPU.",
      "Comparar FCFS y Round Robin.",
      "Calcular tiempos de espera."
     ],
     "teoria": [
      {
       "t": "why",
       "text": "Entender la planificación explica por qué un proceso malicioso puede ralentizar todo el sistema y cómo el SO protege a los procesos importantes."
      },
      {
       "t": "p",
       "text": "Un núcleo de CPU solo ejecuta una cosa a la vez. El SO cambia de proceso cientos de veces por segundo (cambio de contexto) para que parezca que todo corre simultáneamente. La parte del kernel que decide a quién le toca se llama planificador (scheduler)."
      },
      {
       "t": "steps",
       "items": [
        {
         "t": "Ejecuta FCFS",
         "d": "Observa el diagrama: el proceso largo bloquea a los cortos. El tiempo de espera medio sube."
        },
        {
         "t": "Cambia a Round Robin",
         "d": "Con un quantum (turno) de 2, todos avanzan por turnos. Los cortos terminan antes."
        },
        {
         "t": "Juega con el quantum",
         "d": "Quantum muy grande = se parece a FCFS. Muy pequeño = demasiados cambios de contexto (desperdicio)."
        }
       ]
      },
      {
       "t": "result",
       "text": "Con estos procesos, Round Robin reduce la espera media de los procesos cortos aunque el largo tarde un poco más. Así se siente fluido un sistema interactivo."
      }
     ],
     "ejemplos": [
      {
       "juego": "panama",
       "titulo": "La fila del diablo rojo",
       "texto": "FCFS (el primero que llega, el primero que se atiende) es como la fila de la parada: si sube primero alguien con 20 bultos, todos esperan. Round Robin es como si el pavo dejara subir a cada pasajero un ratito por turnos: nadie se queda esperando eternamente."
      },
      {
       "juego": "minecraft",
       "titulo": "Los ticks de Minecraft",
       "texto": "Un servidor de Minecraft procesa el mundo en «ticks»: 20 por segundo. Si hay demasiadas granjas de redstone, cada tick tarda más y el servidor «laguea» (TPS bajos). Es el mismo problema: demasiado trabajo para el tiempo de CPU disponible."
      }
     ],
     "practica": [
      {
       "tipo": "widget",
       "w": "scheduler",
       "props": {}
      }
     ],
     "reto": {
      "pregunta": "¿Qué ventaja tiene Round Robin frente a FCFS?",
      "opciones": [
       "Usa menos memoria",
       "Ningún proceso acapara la CPU indefinidamente",
       "Es más fácil de programar",
       "No necesita kernel"
      ],
      "respuesta": 1,
      "explicacion": "Cada proceso recibe turnos de tiempo fijo. Uno largo no puede bloquear a los demás."
     }
    },
    {
     "id": "memoria",
     "nivel": 3,
     "titulo": "Memoria: RAM vs disco",
     "subtitulo": "La hotbar, el inventario y el cofre.",
     "minutos": 9,
     "icono": "chest",
     "objetivos": [
      "Ordenar la jerarquía de memoria.",
      "Explicar memoria virtual y swap.",
      "Saber por qué la RAM se borra al apagar."
     ],
     "teoria": [
      {
       "t": "why",
       "text": "Muchos ataques avanzados viven solo en la RAM (malware «sin archivos») para no dejar rastro en el disco. Y los analistas forenses capturan la RAM para encontrar contraseñas y claves."
      },
      {
       "t": "p",
       "text": "Hay memorias rápidas y pequeñas (registros, caché) y lentas y enormes (SSD, disco duro). La RAM está en el medio: rápida, pero volátil: se borra al apagar."
      },
      {
       "t": "result",
       "text": "Si un registro tardara 1 segundo, leer del SSD tardaría ~1-2 días y de un disco duro mecánico ~meses. Por eso el SO intenta tener en RAM lo que más usas."
      },
      {
       "t": "h",
       "text": "Memoria virtual y swap"
      },
      {
       "t": "p",
       "text": "Cada proceso cree tener toda la memoria para él (memoria virtual). El SO traduce esas direcciones a la RAM real y aísla a cada proceso: Minecraft no puede leer la memoria de tu navegador. Si la RAM se llena, el SO pasa trozos poco usados al disco (swap / archivo de paginación), y todo se vuelve lento."
      },
      {
       "t": "tip",
       "text": "Ese aislamiento es una barrera de seguridad clave. Los exploits famosos (como Meltdown y Spectre) consistían justamente en romper ese aislamiento para leer memoria ajena."
      }
     ],
     "ejemplos": [
      {
       "juego": "minecraft",
       "titulo": "Hotbar, inventario y cofres",
       "texto": "La hotbar (9 casillas) es la caché: lo que usas ya, al instante. El inventario es la RAM: más espacio, a un par de clics. Los cofres de tu base son el disco: caben miles de cosas, pero tienes que caminar hasta ellos. Y si mueres sin keepInventory… pierdes el inventario (la RAM se borra), pero los cofres siguen ahí (el disco persiste)."
      }
     ],
     "practica": [
      {
       "tipo": "widget",
       "w": "memory",
       "props": {}
      }
     ],
     "reto": {
      "pregunta": "Apagas la PC de golpe. ¿Qué se pierde?",
      "opciones": [
       "Los archivos del disco",
       "Lo que estaba solo en la RAM",
       "El sistema operativo",
       "Nada"
      ],
      "respuesta": 1,
      "explicacion": "La RAM es volátil: sin corriente, se borra. Lo guardado en disco persiste. Por eso «guardar» significa copiar de RAM a disco."
     }
    },
    {
     "id": "archivos",
     "nivel": 4,
     "titulo": "Archivos, rutas y la terminal",
     "subtitulo": "Tus primeros comandos en Linux.",
     "minutos": 12,
     "icono": "pickaxe",
     "objetivos": [
      "Moverte por carpetas con cd, ls y pwd.",
      "Leer y crear archivos desde la terminal.",
      "Entender rutas absolutas y relativas."
     ],
     "teoria": [
      {
       "t": "why",
       "text": "El 90% de los servidores del mundo son Linux y se administran desde la terminal. En ciberseguridad, la terminal es tu herramienta principal: rápida, precisa y automatizable."
      },
      {
       "t": "p",
       "text": "Los archivos se organizan en carpetas (directorios) que forman un árbol. En Linux todo empieza en la raíz «/». Tu carpeta personal es /home/tu_usuario, abreviada como «~»."
      },
      {
       "t": "table",
       "head": [
        "Comando",
        "Qué hace",
        "Ejemplo"
       ],
       "rows": [
        [
         "pwd",
         "Dice dónde estás",
         "pwd → /home/steve"
        ],
        [
         "ls",
         "Lista el contenido",
         "ls -la (incluye ocultos)"
        ],
        [
         "cd",
         "Cambia de carpeta",
         "cd mundos · cd .. (subir)"
        ],
        [
         "cat",
         "Muestra un archivo",
         "cat notas.txt"
        ],
        [
         "mkdir",
         "Crea carpeta",
         "mkdir base"
        ],
        [
         "touch",
         "Crea archivo vacío",
         "touch diario.txt"
        ],
        [
         "echo",
         "Escribe texto",
         "echo hola"
        ]
       ]
      },
      {
       "t": "result",
       "text": "Al completar la misión habrás navegado por el árbol, listado archivos ocultos y leído un archivo. Son los movimientos básicos de cualquier administrador."
      },
      {
       "t": "tip",
       "text": "Usa la tecla Tab para autocompletar y la flecha ↑ para repetir comandos anteriores. En el simulador también funcionan."
      }
     ],
     "ejemplos": [
      {
       "juego": "minecraft",
       "titulo": "Coordenadas F3",
       "texto": "Una ruta absoluta es como dar coordenadas exactas (X: 120, Z: -340): funciona desde cualquier lugar. Una ruta relativa es «dos bloques a la izquierda de donde estoy»: depende de tu posición. /home/steve/mundos es absoluta; mundos/survival es relativa."
      }
     ],
     "practica": [
      {
       "tipo": "widget",
       "w": "terminal",
       "props": {
        "mission": "basico"
       }
      }
     ],
     "reto": {
      "pregunta": "Estás en /home/steve. ¿A dónde te lleva «cd ..»?",
      "opciones": [
       "/home",
       "/home/steve/..",
       "/",
       "A ninguna parte"
      ],
      "respuesta": 0,
      "explicacion": "«..» significa la carpeta padre. Desde /home/steve subes a /home."
     }
    },
    {
     "id": "permisos",
     "nivel": 5,
     "titulo": "Usuarios y permisos",
     "subtitulo": "Quién es OP en el servidor.",
     "minutos": 11,
     "icono": "key",
     "objetivos": [
      "Leer permisos rwx.",
      "Calcular permisos en octal (chmod 755).",
      "Entender root y el mínimo privilegio."
     ],
     "teoria": [
      {
       "t": "why",
       "text": "Un archivo con permisos mal puestos (por ejemplo, contraseñas legibles por todos) es una de las vulnerabilidades más comunes en servidores reales."
      },
      {
       "t": "p",
       "text": "Cada archivo tiene un dueño, un grupo y permisos para tres tipos de personas: el dueño (u), el grupo (g) y los demás (o). Cada uno puede tener r (leer), w (escribir) y x (ejecutar)."
      },
      {
       "t": "p",
       "text": "En octal, r = 4, w = 2, x = 1. Se suman: rwx = 7, r-x = 5, r-- = 4. Así, chmod 755 significa dueño rwx, grupo r-x, otros r-x."
      },
      {
       "t": "steps",
       "items": [
        {
         "t": "Script ejecutable",
         "d": "Marca rwx para el dueño y r-x para el resto → 755. Típico de programas."
        },
        {
         "t": "Archivo privado",
         "d": "Solo rw para el dueño → 600. Ideal para llaves SSH (~/.ssh/id_ed25519)."
        },
        {
         "t": "El error clásico",
         "d": "777 = todos pueden todo. Nunca lo uses «para que funcione»: es una puerta abierta."
        }
       ]
      },
      {
       "t": "result",
       "text": "Si marcas solo lectura y escritura para el dueño, verás 600 y -rw-------. Ese es el permiso correcto para archivos secretos."
      },
      {
       "t": "warn",
       "text": "Principio de mínimo privilegio: cada usuario y programa debe tener solo los permisos que necesita. No juegues ni navegues como administrador: si un malware te infecta, heredará todos tus poderes."
      }
     ],
     "ejemplos": [
      {
       "juego": "minecraft",
       "titulo": "OP y permisos del servidor",
       "texto": "En tu servidor, el admin con OP (root) puede todo: /gamemode, /ban, /stop. Los jugadores normales solo construyen. Los moderadores (un grupo) tienen algunos poderes extra. Si le das OP a cualquiera, alguien acabará borrando tu spawn."
      }
     ],
     "practica": [
      {
       "tipo": "widget",
       "w": "chmod",
       "props": {}
      }
     ],
     "reto": {
      "pregunta": "¿Qué significa chmod 644 notas.txt?",
      "opciones": [
       "Todos pueden escribir",
       "Dueño lee y escribe; el resto solo lee",
       "Nadie puede leer",
       "Es ejecutable para todos"
      ],
      "respuesta": 1,
      "explicacion": "6 = rw- para el dueño, 4 = r-- para el grupo, 4 = r-- para otros."
     }
    },
    {
     "id": "terminal-ctf",
     "nivel": 6,
     "titulo": "Misión: caza la bandera",
     "subtitulo": "Mini-CTF en una terminal Linux simulada.",
     "minutos": 14,
     "icono": "flag",
     "objetivos": [
      "Usar grep para buscar en archivos.",
      "Encontrar archivos ocultos.",
      "Leer logs como un analista."
     ],
     "teoria": [
      {
       "t": "why",
       "text": "Los CTF (Capture The Flag) son competencias donde se aprende ciberseguridad resolviendo retos. Encontrar una «flag» escondida en un servidor es exactamente lo que harás aquí."
      },
      {
       "t": "p",
       "text": "Nuevos comandos para esta misión: grep (buscar texto dentro de archivos), ls -la (ver archivos ocultos, que empiezan por punto), whoami (quién eres), history (comandos anteriores) y cat sobre logs."
      },
      {
       "t": "term",
       "title": "Ejemplos de grep",
       "text": "$ grep \"Failed\" auth.log      # líneas que contienen Failed\n$ grep -i flag notas.txt      # sin distinguir mayúsculas\n$ grep -c \"Failed\" auth.log   # cuenta coincidencias"
      },
      {
       "t": "result",
       "text": "La bandera tiene el formato FV{...}. Está escondida en un archivo oculto, y la pista para encontrarla está en un log de accesos."
      },
      {
       "t": "tip",
       "text": "Metodología de un analista: 1) ¿quién soy y dónde estoy? (whoami, pwd) 2) ¿qué hay aquí, incluso oculto? (ls -la) 3) ¿qué dicen los logs? (grep) 4) seguir las pistas."
      }
     ],
     "ejemplos": [
      {
       "juego": "fortnite",
       "titulo": "Buscar cofres en la isla",
       "texto": "Al caer en la isla no sabes dónde están los cofres dorados: exploras edificios, escuchas el sonido y revisas rincones. En un CTF exploras carpetas, archivos ocultos y logs hasta dar con la bandera."
      }
     ],
     "practica": [
      {
       "tipo": "widget",
       "w": "terminal",
       "props": {
        "mission": "ctf"
       }
      }
     ],
     "reto": {
      "pregunta": "¿Cómo ves los archivos ocultos en Linux?",
      "opciones": [
       "ls",
       "ls -la",
       "cat",
       "pwd"
      ],
      "respuesta": 1,
      "explicacion": "La opción -a muestra todo, incluidos los archivos que empiezan por punto, y -l da el detalle (permisos, dueño, tamaño)."
     }
    },
    {
     "id": "malware-defensa",
     "nivel": 7,
     "titulo": "Malware y cómo se defiende el SO",
     "subtitulo": "Creepers digitales y cómo evitar que exploten.",
     "minutos": 10,
     "icono": "heart",
     "objetivos": [
      "Reconocer tipos de malware.",
      "Conocer las defensas del SO.",
      "Armar tu checklist de seguridad."
     ],
     "teoria": [
      {
       "t": "why",
       "text": "Saber cómo entra el malware y qué capas lo frenan te convierte en la persona que protege a su familia, su colegio o su empresa."
      },
      {
       "t": "table",
       "head": [
        "Tipo",
        "Qué hace",
        "Ejemplo de vida real"
       ],
       "rows": [
        [
         "Virus",
         "Se pega a archivos y se propaga al abrirlos",
         "Un «crack» de un juego infectado"
        ],
        [
         "Gusano",
         "Se propaga solo por la red",
         "WannaCry en 2017"
        ],
        [
         "Troyano",
         "Parece útil pero esconde algo malo",
         "Un «hack de V-Bucks gratis»"
        ],
        [
         "Ransomware",
         "Cifra tus archivos y pide rescate",
         "Ataques a hospitales y empresas"
        ],
        [
         "Spyware / stealer",
         "Roba contraseñas y sesiones",
         "Robo de cuentas de Discord y Steam"
        ]
       ]
      },
      {
       "t": "list",
       "items": [
        "Activa las actualizaciones automáticas.",
        "Usa una cuenta normal para el día a día.",
        "Descarga solo de tiendas y webs oficiales.",
        "Activa la verificación en dos pasos en tus cuentas de juego.",
        "Haz copias de seguridad de tus mundos y archivos importantes."
       ]
      }
     ],
     "ejemplos": [
      {
       "juego": "fortnite",
       "titulo": "«V-Bucks gratis»",
       "texto": "Las webs y archivos que prometen V-Bucks o skins gratis son el troyano más clásico entre gamers: descargas un «generador» y en realidad instalas un ladrón de cuentas. Regla de oro: si es gratis y demasiado bueno, el producto eres tú."
      },
      {
       "juego": "panama",
       "titulo": "El mensaje de «premio» por WhatsApp",
       "texto": "«¡Felicidades, ganaste un bono del Super 99, entra aquí!» Ese enlace te lleva a instalar una app o poner tus datos. No es suerte: es phishing con malware. Verifica siempre en la web o app oficial."
      }
     ],
     "practica": [
      {
       "tipo": "widget",
       "w": "layers",
       "props": {
        "title": "Defensas en capas del sistema operativo",
        "layers": [
         {
          "name": "Actualizaciones",
          "desc": "Cierran los agujeros conocidos. La mayoría de infecciones usan fallos ya parcheados.",
          "example": "Windows Update, apt upgrade"
         },
         {
          "name": "Antivirus / EDR",
          "desc": "Detectan archivos y comportamientos maliciosos.",
          "example": "Microsoft Defender"
         },
         {
          "name": "Cuentas sin privilegios",
          "desc": "Usar un usuario normal limita lo que el malware puede hacer.",
          "example": "UAC en Windows, sudo en Linux"
         },
         {
          "name": "Aislamiento (sandbox)",
          "desc": "Cada app encerrada en su caja con permisos mínimos.",
          "example": "Apps de Android/iOS, el navegador"
         },
         {
          "name": "Cifrado de disco",
          "desc": "Si te roban el equipo, no pueden leer tus datos.",
          "example": "BitLocker, FileVault, LUKS"
         },
         {
          "name": "Copias de seguridad",
          "desc": "La cura contra el ransomware: restaurar sin pagar.",
          "example": "Regla 3-2-1: 3 copias, 2 medios, 1 fuera de casa"
         }
        ]
       }
      }
     ],
     "reto": {
      "pregunta": "¿Cuál es la mejor defensa contra el ransomware?",
      "opciones": [
       "Pagar rápido",
       "Tener copias de seguridad desconectadas",
       "Apagar el monitor",
       "Cambiar el fondo de pantalla"
      ],
      "respuesta": 1,
      "explicacion": "Con copias de seguridad fuera del alcance del malware, puedes restaurar tus archivos sin pagar."
     }
    }
   ]
  },
  {
   "id": "python",
   "nombre": "Mundo Python",
   "bioma": "Bioma Jungla",
   "tagline": "Programa tus propias herramientas de ciberseguridad.",
   "descripcion": "Desde print() hasta un detector de fuerza bruta y un escáner de puertos. Código real que ejecutas aquí mismo.",
   "color": "#ffd43b",
   "fondo": "#221d0a",
   "icono": "snake",
   "intro": "Python es el lenguaje favorito de la ciberseguridad: corto, legible y con librerías para todo. Cada lección tiene código que puedes editar y ejecutar en tu navegador con un intérprete de Python real.",
   "niveles": [
    {
     "id": "hola",
     "nivel": 0,
     "titulo": "¿Qué es programar? Tu primer print",
     "subtitulo": "Nivel 0: darle órdenes a la computadora.",
     "minutos": 8,
     "icono": "snake",
     "objetivos": [
      "Entender qué es un programa.",
      "Usar print() y comentarios.",
      "Hacer cuentas con Python."
     ],
     "teoria": [
      {
       "t": "why",
       "text": "Los profesionales de seguridad automatizan: en vez de revisar 10.000 líneas de log a mano, escriben 10 líneas de Python que lo hacen en un segundo. Programar es tu superpoder."
      },
      {
       "t": "p",
       "text": "Programar es escribir instrucciones exactas para que la computadora las siga, una tras otra, de arriba abajo. Python lee tu código línea por línea y ejecuta cada orden."
      },
      {
       "t": "steps",
       "items": [
        {
         "t": "Pulsa «Ejecutar»",
         "d": "La primera vez se descarga el intérprete de Python (unos segundos). Después es instantáneo."
        },
        {
         "t": "Cambia el mensaje",
         "d": "Escribe tu nombre dentro de las comillas y vuelve a ejecutar."
        },
        {
         "t": "Rompe algo a propósito",
         "d": "Borra una comilla y ejecuta: verás un SyntaxError. Leer errores es la mitad de programar."
        }
       ]
      },
      {
       "t": "table",
       "head": [
        "Operador",
        "Qué hace",
        "Ejemplo → resultado"
       ],
       "rows": [
        [
         "+ - * /",
         "Suma, resta, multiplica, divide",
         "10 / 4 → 2.5"
        ],
        [
         "//",
         "División entera",
         "10 // 4 → 2"
        ],
        [
         "%",
         "Resto (módulo)",
         "10 % 4 → 2"
        ],
        [
         "**",
         "Potencia",
         "2 ** 8 → 256"
        ]
       ]
      },
      {
       "t": "result",
       "text": "Si ves los números en la salida sin errores, tu primer programa funciona."
      }
     ],
     "ejemplos": [
      {
       "juego": "minecraft",
       "titulo": "Bloques de comandos",
       "texto": "Si alguna vez usaste un bloque de comandos con /say ¡Hola!, ya programaste: diste una orden y el juego la ejecutó. En Python, el equivalente es print(\"¡Hola!\")."
      }
     ],
     "practica": [
      {
       "tipo": "codigo",
       "codigo": "# Esto es un comentario: Python lo ignora. Sirve para explicar.\nprint(\"¡Qué xopá, FactionVault!\")\nprint(\"Python sabe sumar:\", 2 + 3)\nprint(\"Y multiplicar:\", 7 * 6)",
       "salida": "¡Qué xopá, FactionVault!\nPython sabe sumar: 5\nY multiplicar: 42",
       "explicacion": "print() muestra en pantalla lo que le pases. Puedes mezclar texto (entre comillas) y cálculos separados por comas."
      },
      {
       "tipo": "codigo",
       "codigo": "# 2 elevado a 8: las combinaciones de un byte\nprint(2 ** 8)\n# ¿Cuántas claves tiene un candado de 4 dígitos?\nprint(10 ** 4)",
       "salida": "256\n10000",
       "explicacion": "¡Acabas de calcular espacios de claves! Un PIN de 4 dígitos solo tiene 10.000 combinaciones: un programa las prueba en milisegundos.",
       "reto": {
        "enunciado": "Reto: modifica el código para calcular las combinaciones de una contraseña de 6 letras minúsculas (26 ** 6).",
        "pista": "Cambia una de las líneas por print(26 ** 6).",
        "debes_ver": "308915776"
       }
      }
     ],
     "reto": {
      "pregunta": "¿Qué hace la línea # hola en Python?",
      "opciones": [
       "Muestra «hola»",
       "Nada: es un comentario",
       "Da error",
       "Borra el programa"
      ],
      "respuesta": 1,
      "explicacion": "Todo lo que va después de # es un comentario: Python lo ignora. Sirve para que los humanos entiendan el código."
     }
    },
    {
     "id": "variables",
     "nivel": 1,
     "titulo": "Variables y tipos de datos",
     "subtitulo": "Las casillas del inventario.",
     "minutos": 9,
     "icono": "chest",
     "objetivos": [
      "Crear y usar variables.",
      "Distinguir int, float, str y bool.",
      "Usar f-strings para mostrar resultados."
     ],
     "teoria": [
      {
       "t": "why",
       "text": "Toda herramienta guarda datos: IPs, puertos, usuarios, hashes. Las variables son el lugar donde los guardas para usarlos después."
      },
      {
       "t": "p",
       "text": "Una variable es un nombre que apunta a un valor. Se crea con =. El tipo de dato dice qué clase de valor es: número entero (int), decimal (float), texto (str) o verdadero/falso (bool)."
      },
      {
       "t": "h",
       "text": "Variables en ciberseguridad"
      },
      {
       "t": "tip",
       "text": "Ponle nombres claros a tus variables: puerto_ssh es mejor que p. Dentro de 2 semanas no recordarás qué era «p»."
      }
     ],
     "ejemplos": [
      {
       "juego": "minecraft",
       "titulo": "Las casillas del inventario",
       "texto": "Cada casilla del inventario guarda un tipo de objeto: espadas, bloques, comida. Una variable es una casilla con nombre: vidas = 3, nombre = \"Steve\", tiene_espada = True."
      },
      {
       "juego": "panama",
       "titulo": "La cuenta del raspao",
       "texto": "Un raspao cuesta 1.50 y quieres 3 con leche condensada extra (0.25 cada una). Con variables calculas el total sin repetir números por todo el código."
      }
     ],
     "practica": [
      {
       "tipo": "codigo",
       "codigo": "jugador = \"Steve\"\nvidas = 3\noro = 12.5\ntiene_espada = True\n\nprint(jugador, \"tiene\", vidas, \"vidas\")\nprint(type(jugador), type(vidas), type(oro), type(tiene_espada))",
       "salida": "Steve tiene 3 vidas\n<class 'str'> <class 'int'> <class 'float'> <class 'bool'>",
       "explicacion": "type() te dice el tipo de cada variable. Python lo deduce solo por el valor que le das."
      },
      {
       "tipo": "codigo",
       "codigo": "precio_raspao = 1.50\nextra_leche = 0.25\ncantidad = 3\n\ntotal = (precio_raspao + extra_leche) * cantidad\nprint(f\"Total a pagar: B/. {total:.2f}\")",
       "salida": "Total a pagar: B/. 5.25",
       "explicacion": "Una f-string (f\"...\") mete variables dentro del texto entre llaves. El :.2f muestra 2 decimales.",
       "reto": {
        "enunciado": "Reto: cambia la cantidad a 5 raspaos y ejecuta. ¿Cuánto pagas?",
        "pista": "Pon cantidad = 5.",
        "debes_ver": "8.75"
       }
      },
      {
       "tipo": "codigo",
       "codigo": "ip_objetivo = \"192.168.1.10\"\npuerto = 22\nservicio = \"SSH\"\nabierto = True\n\nprint(f\"[+] {ip_objetivo}:{puerto} ({servicio}) abierto={abierto}\")",
       "salida": "[+] 192.168.1.10:22 (SSH) abierto=True",
       "explicacion": "Así reportan los resultados muchas herramientas reales: datos guardados en variables y mostrados con formato."
      }
     ],
     "reto": {
      "pregunta": "¿Qué tipo de dato es \"443\" (entre comillas)?",
      "opciones": [
       "int",
       "str",
       "float",
       "bool"
      ],
      "respuesta": 1,
      "explicacion": "Las comillas lo convierten en texto (str). Para usarlo como número tendrías que hacer int(\"443\")."
     }
    },
    {
     "id": "listas-bucles",
     "nivel": 2,
     "titulo": "Listas y bucles",
     "subtitulo": "Recorrer todos los jugadores del lobby.",
     "minutos": 11,
     "icono": "storm",
     "objetivos": [
      "Crear y recorrer listas.",
      "Usar for y range().",
      "Automatizar tareas repetitivas."
     ],
     "teoria": [
      {
       "t": "why",
       "text": "Escanear 1000 puertos, probar 500 contraseñas o revisar 10.000 logs: todo es «repite esto para cada elemento». Los bucles son la base de la automatización."
      },
      {
       "t": "p",
       "text": "Una lista guarda varios valores en orden, entre corchetes. Un bucle for recorre la lista y ejecuta el mismo bloque de código para cada elemento. El bloque se marca con sangría (4 espacios)."
      },
      {
       "t": "h",
       "text": "range(): contar automáticamente"
      },
      {
       "t": "h",
       "text": "Caso real: revisar puertos de una lista"
      },
      {
       "t": "result",
       "text": "Cada elemento de la lista produce una línea. Si añades elementos a la lista, el bucle los procesa sin cambiar nada más."
      },
      {
       "t": "warn",
       "text": "Python usa la sangría para saber qué está dentro del bucle. Si mezclas espacios y tabulaciones o te olvidas de sangrar, obtendrás IndentationError."
      }
     ],
     "ejemplos": [
      {
       "juego": "fortnite",
       "titulo": "El lobby de 100 jugadores",
       "texto": "Al empezar la partida, el juego recorre la lista de jugadores y a cada uno le asigna un sitio en el autobús de batalla. Eso es un bucle for: «para cada jugador de la lista, haz esto»."
      }
     ],
     "practica": [
      {
       "tipo": "codigo",
       "codigo": "escuadron = [\"Jonesy\", \"Peely\", \"Raven\", \"Midas\"]\n\nprint(\"Jugadores:\", len(escuadron))\nfor jugador in escuadron:\n    print(\"-> Saltando del autobús:\", jugador)",
       "salida": "Jugadores: 4\n-> Saltando del autobús: Jonesy\n-> Saltando del autobús: Peely\n-> Saltando del autobús: Raven\n-> Saltando del autobús: Midas",
       "explicacion": "len() cuenta los elementos. El for repite la línea con sangría una vez por cada nombre."
      },
      {
       "tipo": "codigo",
       "codigo": "# range(1, 6) genera 1, 2, 3, 4, 5 (el 6 no se incluye)\nfor intento in range(1, 6):\n    print(\"Intento de conexión\", intento)",
       "salida": "Intento de conexión 1\nIntento de conexión 2\nIntento de conexión 3\nIntento de conexión 4\nIntento de conexión 5",
       "explicacion": "range(a, b) cuenta desde a hasta b-1. Muy útil para repetir algo un número fijo de veces."
      },
      {
       "tipo": "codigo",
       "codigo": "puertos = [21, 22, 80, 443, 3389]\npeligrosos = [21, 3389]\n\nfor p in puertos:\n    if p in peligrosos:\n        print(f\"Puerto {p}: ¡revisar! Servicio de riesgo\")\n    else:\n        print(f\"Puerto {p}: ok\")",
       "salida": "Puerto 21: ¡revisar! Servicio de riesgo\nPuerto 22: ok\nPuerto 80: ok\nPuerto 443: ok\nPuerto 3389: ¡revisar! Servicio de riesgo",
       "explicacion": "«in» comprueba si un valor está en una lista. Combinado con for, revisas listas enteras en segundos.",
       "reto": {
        "enunciado": "Reto: añade el puerto 23 (Telnet, sin cifrar) a ambas listas y ejecuta.",
        "pista": "puertos = [21, 22, 23, ...] y peligrosos = [21, 23, 3389]",
        "debes_ver": "Puerto 23: ¡revisar!"
       }
      }
     ],
     "reto": {
      "pregunta": "¿Qué números genera range(3)?",
      "opciones": [
       "1, 2, 3",
       "0, 1, 2",
       "0, 1, 2, 3",
       "3"
      ],
      "respuesta": 1,
      "explicacion": "range(n) empieza en 0 y termina en n-1. Con 3: 0, 1 y 2."
     }
    },
    {
     "id": "condiciones-funciones",
     "nivel": 3,
     "titulo": "Condiciones y funciones",
     "subtitulo": "Redstone lógica y recetas reutilizables.",
     "minutos": 12,
     "icono": "torch",
     "objetivos": [
      "Tomar decisiones con if, elif y else.",
      "Crear funciones con def.",
      "Programar un verificador de contraseñas."
     ],
     "teoria": [
      {
       "t": "why",
       "text": "Las herramientas de seguridad toman decisiones todo el tiempo: ¿esta contraseña es débil? ¿esta IP es sospechosa? ¿este archivo es malicioso? Eso son condiciones."
      },
      {
       "t": "h",
       "text": "Funciones: recetas que reutilizas"
      },
      {
       "t": "p",
       "text": "Una función agrupa código bajo un nombre para usarlo muchas veces. Se crea con def, puede recibir datos (parámetros) y devolver un resultado con return."
      },
      {
       "t": "result",
       "text": "La función devuelve un nivel distinto según la contraseña. Fíjate que «123456» saca «Débil» solo porque tiene números, y «Panama2026!» saca «Fuerte» aunque es predecible: las reglas simples tienen límites."
      },
      {
       "t": "tip",
       "text": "Este verificador es educativo. Los de verdad (como zxcvbn) también comparan con diccionarios de contraseñas filtradas, porque «Password1!» cumple todas las reglas y aun así es pésima."
      }
     ],
     "ejemplos": [
      {
       "juego": "minecraft",
       "titulo": "Puertas lógicas de redstone",
       "texto": "Una puerta que se abre SI pulsas el botón Y tienes la placa de presión activa es un «if» con «and». Los circuitos de redstone son programas con condiciones hechos de bloques."
      },
      {
       "juego": "panama",
       "titulo": "La receta del sancocho",
       "texto": "La receta del sancocho es una función: recibe ingredientes (gallina, ñame, culantro) y devuelve un sancocho. No reescribes la receta cada domingo: la «llamas» y listo."
      }
     ],
     "practica": [
      {
       "tipo": "codigo",
       "codigo": "ping = 85\n\nif ping < 50:\n    print(\"Conexión excelente\")\nelif ping < 100:\n    print(\"Conexión jugable\")\nelse:\n    print(\"Lag total, revisa tu Wi-Fi\")",
       "salida": "Conexión jugable",
       "explicacion": "Python revisa las condiciones de arriba abajo y ejecuta solo la primera que se cumple."
      },
      {
       "tipo": "codigo",
       "codigo": "def evaluar_password(pw):\n    puntos = 0\n    if len(pw) >= 12:\n        puntos += 1\n    if any(c.isdigit() for c in pw):\n        puntos += 1\n    if any(c.isupper() for c in pw):\n        puntos += 1\n    if any(not c.isalnum() for c in pw):\n        puntos += 1\n    niveles = [\"Muy débil\", \"Débil\", \"Media\", \"Fuerte\", \"Excelente\"]\n    return niveles[puntos]\n\nfor pw in [\"123456\", \"panama2026\", \"Panama2026!\", \"Taza-Montaña-Río-42\"]:\n    print(f\"{pw:22} -> {evaluar_password(pw)}\")",
       "salida": "123456                 -> Débil\npanama2026             -> Débil\nPanama2026!            -> Fuerte\nTaza-Montaña-Río-42    -> Excelente",
       "explicacion": "Cada condición suma un punto: longitud, dígitos, mayúsculas y símbolos. any() comprueba si al menos un carácter cumple algo.",
       "reto": {
        "enunciado": "Reto: llama a la función con una contraseña que dé «Excelente» distinta a la del ejemplo (añádela a la lista).",
        "pista": "Necesita 12+ caracteres, un número, una mayúscula y un símbolo.",
        "debes_ver": "-> Excelente"
       }
      }
     ],
     "reto": {
      "pregunta": "¿Para qué sirve return en una función?",
      "opciones": [
       "Para repetir la función",
       "Para devolver un resultado a quien la llamó",
       "Para borrar variables",
       "Para imprimir"
      ],
      "respuesta": 1,
      "explicacion": "return termina la función y entrega un valor que puedes guardar en una variable o usar directamente."
     }
    },
    {
     "id": "strings-cesar",
     "nivel": 4,
     "titulo": "Texto, bytes y tu propio César",
     "subtitulo": "Programa un cifrado con tus manos.",
     "minutos": 12,
     "icono": "key",
     "objetivos": [
      "Recorrer cadenas de texto.",
      "Usar ord() y chr().",
      "Programar y romper un cifrado César."
     ],
     "teoria": [
      {
       "t": "why",
       "text": "Entender cómo un texto se convierte en números es la base de todo cifrado, codificación y hash. Y programar uno tú mismo es la mejor forma de entenderlo."
      },
      {
       "t": "p",
       "text": "Para la computadora, cada letra es un número. ord(\"A\") da 65 y chr(65) da \"A\". Si sumas números a las letras, ¡cifras!"
      },
      {
       "t": "h",
       "text": "Ahora rómpelo: fuerza bruta"
      },
      {
       "t": "result",
       "text": "La fuerza bruta encuentra la clave en milisegundos. Con AES-256 harían falta más años que la edad del universo."
      }
     ],
     "ejemplos": [
      {
       "juego": "minecraft",
       "titulo": "Libros encantados",
       "texto": "Las letras raras de la mesa de encantamientos (el alfabeto galáctico estándar) son un cifrado de sustitución: cada letra normal tiene su símbolo. Es exactamente lo que vas a programar, pero con desplazamientos."
      }
     ],
     "practica": [
      {
       "tipo": "codigo",
       "codigo": "for letra in \"HOLA\":\n    print(letra, \"->\", ord(letra))\n\nprint(chr(70), chr(86))",
       "salida": "H -> 72\nO -> 79\nL -> 76\nA -> 65\nF V",
       "explicacion": "ord() convierte letra en número (código Unicode) y chr() hace lo contrario."
      },
      {
       "tipo": "codigo",
       "codigo": "def cesar(texto, k):\n    resultado = \"\"\n    for c in texto.upper():\n        if \"A\" <= c <= \"Z\":\n            pos = (ord(c) - 65 + k) % 26\n            resultado += chr(pos + 65)\n        else:\n            resultado += c\n    return resultado\n\nsecreto = cesar(\"ATACAR AL AMANECER\", 3)\nprint(\"Cifrado:  \", secreto)\nprint(\"Descifrado:\", cesar(secreto, -3))",
       "salida": "Cifrado:   DWDFDU DO DPDQHFHU\nDescifrado: ATACAR AL AMANECER",
       "explicacion": "Restamos 65 para que A=0, sumamos la clave, usamos % 26 para dar la vuelta al alfabeto (Z+1 = A) y volvemos a letra."
      },
      {
       "tipo": "codigo",
       "codigo": "def cesar(texto, k):\n    return \"\".join(chr((ord(c) - 65 + k) % 26 + 65) if c.isalpha() else c for c in texto)\n\ninterceptado = \"FDQDO GH SDQDPD\"\nfor k in range(1, 26):\n    intento = cesar(interceptado, -k)\n    if \"CANAL\" in intento:\n        print(f\"¡Clave encontrada! k={k}: {intento}\")",
       "salida": "¡Clave encontrada! k=3: CANAL DE PANAMA",
       "explicacion": "Probamos las 25 claves posibles y buscamos una palabra conocida. Así de fácil cae César: por eso no se usa para nada serio.",
       "reto": {
        "enunciado": "Reto: cambia interceptado por \"KRUD SDQDPHULFDQD\" y busca la palabra \"PANAMERICANA\".",
        "pista": "Cambia también el if: if \"PANAMERICANA\" in intento:",
        "debes_ver": "PANAMERICANA"
       }
      }
     ],
     "reto": {
      "pregunta": "¿Para qué sirve % 26 en el cifrado César?",
      "opciones": [
       "Para dividir el texto",
       "Para dar la vuelta al alfabeto (Z → A)",
       "Para borrar espacios",
       "Para mayúsculas"
      ],
      "respuesta": 1,
      "explicacion": "El resto de dividir entre 26 hace que, al pasar de la Z, se vuelva a empezar por la A."
     }
    },
    {
     "id": "hashlib",
     "nivel": 5,
     "titulo": "Hashes con hashlib",
     "subtitulo": "Verifica archivos y entiende por qué las contraseñas débiles caen.",
     "minutos": 12,
     "icono": "diamond",
     "objetivos": [
      "Calcular hashes SHA-256 con hashlib.",
      "Comparar huellas para verificar integridad.",
      "Ver un ataque de diccionario en acción."
     ],
     "teoria": [
      {
       "t": "why",
       "text": "Verificar integridad con hashes y auditar contraseñas débiles son tareas diarias de un analista. Con hashlib lo haces en 3 líneas."
      },
      {
       "t": "h",
       "text": "Ataque de diccionario (educativo)"
      },
      {
       "t": "p",
       "text": "Si una base de datos guarda contraseñas como SHA-256 sin sal y se filtra, un atacante calcula el hash de miles de contraseñas comunes y compara. Mira lo rápido que cae una contraseña débil:"
      },
      {
       "t": "warn",
       "text": "Practica solo con hashes que tú generes. Atacar contraseñas ajenas sin permiso es delito. Para guardar contraseñas de verdad se usa Argon2id o bcrypt con sal, nunca SHA-256 a secas."
      }
     ],
     "ejemplos": [
      {
       "juego": "minecraft",
       "titulo": "La semilla del mundo",
       "texto": "Con la misma semilla, Minecraft genera exactamente el mismo mundo, siempre. Un hash es parecido: el mismo texto da siempre la misma huella. Pero cambia una letra de la semilla y el mundo es totalmente otro: eso es el efecto avalancha."
      }
     ],
     "practica": [
      {
       "tipo": "codigo",
       "codigo": "import hashlib\n\nmensaje = \"FactionVault\"\nhuella = hashlib.sha256(mensaje.encode()).hexdigest()\nprint(huella)\nprint(\"Longitud:\", len(huella), \"caracteres hex\")",
       "salida": "df1211484f8e9570b48f88109dbe6a526d2eebaab1fe77258d7856c6a95140e0\nLongitud: 64 caracteres hex",
       "explicacion": ".encode() convierte el texto en bytes (los hashes trabajan con bytes) y .hexdigest() muestra la huella en hexadecimal."
      },
      {
       "tipo": "codigo",
       "codigo": "import hashlib\n\ndef sha(t):\n    return hashlib.sha256(t.encode()).hexdigest()\n\na = sha(\"transferir 100\")\nb = sha(\"transferir 900\")\nprint(a[:16])\nprint(b[:16])\nprint(\"¿Iguales?\", a == b)",
       "salida": "e94adb2f8037f80b\n007a84c27558045f\n¿Iguales? False",
       "explicacion": "Un solo carácter distinto produce huellas completamente diferentes. Comparando hashes detectas cualquier modificación."
      },
      {
       "tipo": "codigo",
       "codigo": "import hashlib\n\nfiltrado = hashlib.sha256(\"panama123\".encode()).hexdigest()\ndiccionario = [\"123456\", \"password\", \"qwerty\", \"panama\", \"panama123\", \"chombo2024\"]\n\nfor intento in diccionario:\n    if hashlib.sha256(intento.encode()).hexdigest() == filtrado:\n        print(\"¡Contraseña encontrada!:\", intento)\n        break\nelse:\n    print(\"No está en el diccionario\")",
       "salida": "¡Contraseña encontrada!: panama123",
       "explicacion": "El atacante no «descifra» el hash: prueba candidatos hasta que uno coincide. Por eso las contraseñas comunes caen al instante.",
       "reto": {
        "enunciado": "Reto: cambia la contraseña filtrada a una que NO esté en la lista y comprueba que el ataque falla.",
        "pista": "Por ejemplo: hashlib.sha256(\"tazamontañarío\".encode())",
        "debes_ver": "No está en el diccionario"
       }
      }
     ],
     "reto": {
      "pregunta": "¿Por qué hay que hacer .encode() antes de hashear?",
      "opciones": [
       "Para cifrar el texto",
       "Porque los hashes trabajan con bytes, no con texto",
       "Para hacerlo más corto",
       "No hace falta"
      ],
      "respuesta": 1,
      "explicacion": "Las funciones hash operan sobre bytes. encode() convierte la cadena a bytes usando UTF-8."
     }
    },
    {
     "id": "logs",
     "nivel": 6,
     "titulo": "Diccionarios y análisis de logs",
     "subtitulo": "Detecta un ataque de fuerza bruta como un analista SOC.",
     "minutos": 13,
     "icono": "flag",
     "objetivos": [
      "Usar diccionarios (clave → valor).",
      "Procesar líneas de un log.",
      "Detectar IPs con demasiados intentos fallidos."
     ],
     "teoria": [
      {
       "t": "why",
       "text": "En un SOC (centro de operaciones de seguridad) los analistas leen millones de líneas de logs. Un script que cuenta intentos fallidos por IP detecta ataques de fuerza bruta automáticamente."
      },
      {
       "t": "p",
       "text": "Un diccionario guarda pares clave → valor entre llaves: {\"Steve\": 3}. Es perfecto para contar: la clave es la IP y el valor, cuántas veces apareció."
      },
      {
       "t": "h",
       "text": "El detector de fuerza bruta"
      },
      {
       "t": "result",
       "text": "La IP 45.33.12.9 intentó entrar 5 veces con usuarios distintos: patrón clásico de fuerza bruta. Herramientas como fail2ban hacen exactamente esto y la bloquean."
      }
     ],
     "ejemplos": [
      {
       "juego": "fortnite",
       "titulo": "El marcador de eliminaciones",
       "texto": "El marcador de una partida es un diccionario: a cada jugador (clave) le corresponde su número de eliminaciones (valor). Cada vez que alguien elimina a otro, se suma 1 a su valor."
      },
      {
       "juego": "panama",
       "titulo": "El guardia de la garita",
       "texto": "En la garita de una urbanización de Costa del Este, si alguien intenta entrar 5 veces con nombres distintos («vengo donde el señor Pérez… no, donde González…»), el guardia no lo deja pasar. Tu script es ese guardia."
      }
     ],
     "practica": [
      {
       "tipo": "codigo",
       "codigo": "kills = {\"Jonesy\": 2, \"Raven\": 5}\nkills[\"Jonesy\"] += 1\nkills[\"Peely\"] = 1\n\nfor jugador, n in kills.items():\n    print(jugador, \"->\", n)",
       "salida": "Jonesy -> 3\nRaven -> 5\nPeely -> 1",
       "explicacion": ".items() recorre pares clave-valor. Puedes sumar a un valor existente o crear claves nuevas."
      },
      {
       "tipo": "codigo",
       "codigo": "log = [\n    \"08:01 FAILED login user=admin ip=45.33.12.9\",\n    \"08:01 FAILED login user=root ip=45.33.12.9\",\n    \"08:02 OK login user=maria ip=190.140.5.20\",\n    \"08:02 FAILED login user=admin ip=45.33.12.9\",\n    \"08:03 FAILED login user=test ip=45.33.12.9\",\n    \"08:03 FAILED login user=maria ip=190.140.5.20\",\n    \"08:04 FAILED login user=admin ip=45.33.12.9\",\n]\n\nfallos = {}\nfor linea in log:\n    if \"FAILED\" in linea:\n        ip = linea.split(\"ip=\")[1]\n        fallos[ip] = fallos.get(ip, 0) + 1\n\nUMBRAL = 3\nfor ip, n in fallos.items():\n    estado = \"BLOQUEAR\" if n >= UMBRAL else \"vigilar\"\n    print(f\"{ip:15} fallos={n} -> {estado}\")",
       "salida": "45.33.12.9      fallos=5 -> BLOQUEAR\n190.140.5.20    fallos=1 -> vigilar",
       "explicacion": "split(\"ip=\")[1] corta la línea y se queda con lo que va después de ip=. fallos.get(ip, 0) devuelve 0 si la IP aún no está en el diccionario.",
       "reto": {
        "enunciado": "Reto: baja el UMBRAL a 1 y comprueba que ambas IPs se marcan para bloquear.",
        "pista": "Cambia UMBRAL = 3 por UMBRAL = 1.",
        "debes_ver": "fallos=1 -> BLOQUEAR"
       }
      }
     ],
     "reto": {
      "pregunta": "¿Qué devuelve fallos.get(\"1.2.3.4\", 0) si esa IP no está en el diccionario?",
      "opciones": [
       "Un error",
       "0",
       "None siempre",
       "1.2.3.4"
      ],
      "respuesta": 1,
      "explicacion": "get() devuelve el segundo argumento como valor por defecto cuando la clave no existe."
     }
    },
    {
     "id": "proyecto-scanner",
     "nivel": 7,
     "titulo": "Proyecto: escáner de puertos",
     "subtitulo": "Tu primera herramienta de reconocimiento (simulada y real).",
     "minutos": 14,
     "icono": "sword",
     "objetivos": [
      "Combinar todo lo aprendido en un proyecto.",
      "Entender cómo funciona un escáner de puertos.",
      "Conocer el código real con sockets y su ética."
     ],
     "teoria": [
      {
       "t": "why",
       "text": "El escaneo de puertos es la primera fase de cualquier prueba de penetración: saber qué servicios expone un sistema. Programarlo tú mismo te enseña qué hacen herramientas como Nmap por dentro."
      },
      {
       "t": "p",
       "text": "Un escáner intenta conectarse a cada puerto de una IP. Si la conexión TCP se establece, el puerto está abierto. Como el navegador no permite abrir sockets, primero lo simulamos con un diccionario que representa una red de laboratorio."
      },
      {
       "t": "h",
       "text": "El código real (para ejecutar en tu PC, solo contra equipos tuyos)"
      },
      {
       "t": "term",
       "title": "escaner.py — requiere Python instalado en tu computadora",
       "text": "import socket\n\nobjetivo = \"127.0.0.1\"   # tu propia máquina\nfor puerto in [22, 80, 443, 3306, 8080]:\n    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)\n    s.settimeout(0.5)\n    resultado = s.connect_ex((objetivo, puerto))  # 0 = abierto\n    print(puerto, \"ABIERTO\" if resultado == 0 else \"cerrado\")\n    s.close()"
      },
      {
       "t": "steps",
       "items": [
        {
         "t": "Instala Python",
         "d": "Descárgalo de python.org (marca «Add to PATH» en Windows)."
        },
        {
         "t": "Guarda el archivo",
         "d": "Copia el código anterior en escaner.py."
        },
        {
         "t": "Ejecútalo contra ti",
         "d": "En la terminal: python escaner.py. Escanea 127.0.0.1, que eres tú mismo."
        }
       ]
      },
      {
       "t": "result",
       "text": "Verás cada puerto con ABIERTO o cerrado. connect_ex devuelve 0 cuando el saludo TCP de 3 pasos se completa."
      },
      {
       "t": "warn",
       "text": "Escanear redes o equipos que no son tuyos sin autorización escrita es ilegal en Panamá y en casi todos los países. Practica en tu red, en máquinas virtuales o en plataformas legales como TryHackMe y HackTheBox."
      }
     ],
     "ejemplos": [
      {
       "juego": "minecraft",
       "titulo": "Explorar una base ajena",
       "texto": "Es como recorrer una base en un servidor buscando puertas: cuáles están abiertas, cuáles con llave, cuáles con trampa. Solo que, en la vida real, recorrer bases ajenas sin permiso tiene consecuencias legales."
      }
     ],
     "practica": [
      {
       "tipo": "codigo",
       "codigo": "import random\n\nred_lab = {\n    \"10.0.0.5\":  {22: \"SSH\", 80: \"HTTP\"},\n    \"10.0.0.8\":  {25565: \"Minecraft\", 22: \"SSH\"},\n    \"10.0.0.12\": {3389: \"RDP\", 445: \"SMB\"},\n}\nPUERTOS = [21, 22, 80, 443, 445, 3389, 25565]\nRIESGO = {21, 445, 3389}\n\ndef escanear(ip):\n    servicios = red_lab.get(ip, {})\n    abiertos = []\n    for p in PUERTOS:\n        if p in servicios:\n            abiertos.append((p, servicios[p]))\n    return abiertos\n\nfor ip in red_lab:\n    print(f\"== {ip} ==\")\n    for p, nombre in escanear(ip):\n        alerta = \"  <- RIESGO\" if p in RIESGO else \"\"\n        print(f\"  {p:<6} abierto  {nombre}{alerta}\")",
       "salida": "== 10.0.0.5 ==\n  22     abierto  SSH\n  80     abierto  HTTP\n== 10.0.0.8 ==\n  22     abierto  SSH\n  25565  abierto  Minecraft\n== 10.0.0.12 ==\n  445    abierto  SMB  <- RIESGO\n  3389   abierto  RDP  <- RIESGO",
       "explicacion": "Usamos todo lo aprendido: diccionarios anidados, listas, bucles, funciones, condiciones, tuplas y f-strings. {p:<6} alinea el número a la izquierda en 6 espacios.",
       "reto": {
        "enunciado": "Reto: añade a red_lab el host \"10.0.0.20\" con el puerto 21 (FTP) y ejecuta.",
        "pista": "\"10.0.0.20\": {21: \"FTP\"},",
        "debes_ver": "21     abierto  FTP  <- RIESGO"
       }
      }
     ],
     "reto": {
      "pregunta": "¿Qué significa que connect_ex devuelva 0?",
      "opciones": [
       "Que el puerto está cerrado",
       "Que la conexión TCP se estableció: puerto abierto",
       "Que hubo un error de Python",
       "Que el host no existe"
      ],
      "respuesta": 1,
      "explicacion": "connect_ex devuelve 0 si la conexión tuvo éxito. Cualquier otro número indica error (cerrado, filtrado, timeout…)."
     }
    }
   ]
  },
  {
   "id": "cripto",
   "nombre": "Mundo Criptografía",
   "bioma": "Bioma Nether",
   "tagline": "El arte de esconder mensajes a plena vista.",
   "descripcion": "César, hashes, contraseñas, AES real, clave pública y TLS. Cifras, rompes y entiendes por qué.",
   "color": "#ffb02e",
   "fondo": "#2a1408",
   "icono": "chest",
   "intro": "Aquí vas a cifrar mensajes, romper cifrados viejos con tus propias manos y entender por qué el candadito del navegador te protege cuando entras a tu banco.",
   "niveles": [
    {
     "id": "que-es-cripto",
     "nivel": 0,
     "titulo": "¿Qué es la criptografía?",
     "subtitulo": "Nivel 0: no es esconder, es que aunque lo vean no lo entiendan.",
     "minutos": 7,
     "icono": "chest",
     "objetivos": [
      "Distinguir cifrar, codificar y hashear.",
      "Explicar confidencialidad, integridad y autenticación.",
      "Entender por qué el secreto está en la clave y no en el método."
     ],
     "teoria": [
      {
       "t": "why",
       "text": "Cada vez que mandas un WhatsApp, pagas con Yappy o entras a tu banco, hay criptografía trabajando. Si la entiendes, sabes en quién confías y por qué."
      },
      {
       "t": "p",
       "text": "Criptografía significa «escritura oculta». Es convertir un mensaje legible (texto plano) en algo ilegible (texto cifrado) usando una clave. Solo quien tiene la clave puede volver al mensaje original."
      },
      {
       "t": "h",
       "text": "Las tres cosas que protege"
      },
      {
       "t": "table",
       "head": [
        "Propiedad",
        "Qué significa",
        "Ejemplo"
       ],
       "rows": [
        [
         "Confidencialidad",
         "Solo lo lee quien debe",
         "Nadie más ve tus chats"
        ],
        [
         "Integridad",
         "Nadie lo cambió por el camino",
         "Transferiste 10, no 1000"
        ],
        [
         "Autenticación",
         "Es quien dice ser",
         "Es tu banco y no un estafador"
        ]
       ]
      },
      {
       "t": "p",
       "text": "Ojo con tres palabras que la gente confunde: cifrar (necesita clave y se puede revertir con ella), codificar (cambiar el formato, como Base64, sin clave: cualquiera lo revierte) y hashear (sacar una huella que no se puede revertir)."
      },
      {
       "t": "tip",
       "text": "Principio de Kerckhoffs: un sistema debe ser seguro aunque el enemigo conozca el algoritmo. El secreto es la clave, nunca el método. Si alguien te dice «es seguro porque nadie sabe cómo funciona», desconfía."
      }
     ],
     "ejemplos": [
      {
       "juego": "minecraft",
       "titulo": "Tu cofre con candado",
       "texto": "Guardar diamantes en un cofre de tu base es confidencialidad (solo tú los ves). Saber que nadie te cambió el contenido es integridad. Y que el cartel «Base de Steve» sea realmente de Steve es autenticación. La criptografía hace lo mismo con matemáticas."
      },
      {
       "juego": "panama",
       "titulo": "La notita en el salón",
       "texto": "¿Te acuerdas de pasar notitas en clase escritas «en clave» para que la maestra no entendiera? Esa era tu primera criptografía. El problema: si la maestra descubría el truco, se acababa el secreto para siempre."
      }
     ],
     "practica": [
      {
       "tipo": "widget",
       "w": "match",
       "props": {
        "title": "¿Cifrar, codificar o hashear?",
        "pairs": [
         [
          "Base64",
          "Codificar (sin clave)"
         ],
         [
          "AES",
          "Cifrar (con clave)"
         ],
         [
          "SHA-256",
          "Hashear (sin vuelta atrás)"
         ],
         [
          "Morse",
          "Codificar (tabla pública)"
         ],
         [
          "César",
          "Cifrar (clave 0-25)"
         ]
        ]
       }
      }
     ],
     "reto": {
      "pregunta": "Un compañero «protege» contraseñas guardándolas en Base64. ¿Qué le dices?",
      "opciones": [
       "Perfecto, nadie lo entiende",
       "Base64 no cifra: cualquiera lo revierte sin clave",
       "Mejor en Morse",
       "Solo es inseguro los fines de semana"
      ],
      "respuesta": 1,
      "explicacion": "Base64 es una codificación: cambia el formato pero no tiene clave. Cualquiera la decodifica en un segundo."
     }
    },
    {
     "id": "cesar",
     "nivel": 1,
     "titulo": "El cifrado César",
     "subtitulo": "Rota el alfabeto… y rómpelo en segundos.",
     "minutos": 9,
     "icono": "key",
     "objetivos": [
      "Cifrar y descifrar con un desplazamiento.",
      "Romper César por fuerza bruta.",
      "Entender qué es el espacio de claves."
     ],
     "teoria": [
      {
       "t": "why",
       "text": "César es el «hola mundo» de la criptografía: en 5 minutos entiendes qué es una clave, qué es fuerza bruta y por qué el tamaño del secreto lo es todo."
      },
      {
       "t": "p",
       "text": "Julio César movía cada letra 3 posiciones: A→D, B→E, C→F… La clave es el número de posiciones, entre 0 y 25. Para descifrar, se mueve hacia atrás."
      },
      {
       "t": "term",
       "title": "La fórmula",
       "text": "cifrar:    E(x) = (x + k) mod 26\ndescifrar: D(y) = (y - k) mod 26\n(A=0, B=1 ... Z=25; mod 26 = dar la vuelta al alfabeto)"
      },
      {
       "t": "p",
       "text": "El problema: solo hay 26 claves posibles. Probarlas todas (fuerza bruta) tarda microsegundos. Un AES de 256 bits tiene unas 1,15 × 10⁷⁷ claves: más que átomos en la Tierra."
      },
      {
       "t": "steps",
       "items": [
        {
         "t": "Cifra tu nombre",
         "d": "Usa el simulador con desplazamiento 3."
        },
        {
         "t": "Pásale el texto a alguien",
         "d": "Sin decirle la clave."
        },
        {
         "t": "Que lo rompa",
         "d": "Que pruebe desplazamientos con el deslizador hasta que salga algo legible. ¡Lo logrará rapidito!"
        }
       ]
      },
      {
       "t": "result",
       "text": "«HOLA» con clave 3 da «KROD». Con la rueda puedes ver la tabla completa de equivalencias."
      }
     ],
     "ejemplos": [
      {
       "juego": "panama",
       "titulo": "El código del salón",
       "texto": "Escribir «Ipmb» en vez de «Hola» (cada letra la siguiente) es un César con clave 1. La maestra lo descifraba en segundos porque solo hay 26 posibilidades."
      },
      {
       "juego": "minecraft",
       "titulo": "Lámparas en clave",
       "texto": "Imagina que en tu servidor escribes en carteles con César para que los nuevos no encuentren tu base. Cualquier jugador con paciencia prueba 25 claves y lee tus carteles. Ofuscar no es proteger."
      }
     ],
     "practica": [
      {
       "tipo": "cesar"
      },
      {
       "tipo": "escribir",
       "pregunta": "Descifra este mensaje con clave 3: «FDQDO»",
       "respuestas": [
        "canal"
       ],
       "pista": "Retrocede 3 letras: F→C, D→A…",
       "explicacion": "F-3=C, D-3=A, Q-3=N, D-3=A, O-3=L → CANAL."
      }
     ],
     "reto": {
      "pregunta": "¿Por qué César no sirve para proteger nada hoy?",
      "opciones": [
       "Porque es muy lento",
       "Porque solo tiene 26 claves y se prueba todo al instante",
       "Porque solo funciona en latín",
       "Porque lo prohibieron"
      ],
      "respuesta": 1,
      "explicacion": "Un espacio de claves de 26 se agota por fuerza bruta en microsegundos. La seguridad moderna exige claves de 128 bits o más."
     }
    },
    {
     "id": "hash",
     "nivel": 2,
     "titulo": "Hashes: la huella digital",
     "subtitulo": "Mismo texto, misma huella. Una letra distinta, huella irreconocible.",
     "minutos": 9,
     "icono": "diamond",
     "objetivos": [
      "Explicar qué es una función hash.",
      "Ver el efecto avalancha.",
      "Saber por qué las contraseñas no se guardan con un hash rápido."
     ],
     "teoria": [
      {
       "t": "why",
       "text": "Los hashes verifican tus descargas, guardan contraseñas y encadenan los bloques de las blockchains. Son la forma más barata de decir «esto no ha cambiado»."
      },
      {
       "t": "p",
       "text": "Una función hash toma cualquier dato (una palabra o una película entera) y devuelve una huella de tamaño fijo. SHA-256 siempre da 64 caracteres hexadecimales."
      },
      {
       "t": "list",
       "items": [
        "Determinista: mismo dato, misma huella, siempre.",
        "Unidireccional: de la huella no se puede volver al dato.",
        "Efecto avalancha: cambia una letra y cambia ~la mitad de la huella.",
        "Resistente a colisiones: casi imposible encontrar dos datos con la misma huella."
       ]
      },
      {
       "t": "warn",
       "text": "Un hash no es cifrado: no tiene clave ni se «descifra». Pero un atacante sí puede probar millones de palabras comunes y comparar huellas (ataque de diccionario). Para contraseñas se usan funciones LENTAS con sal: Argon2id o bcrypt."
      },
      {
       "t": "result",
       "text": "En el simulador, «factionvault» y «Factionvault» dan huellas totalmente distintas. Fíjate en el porcentaje de diferencia: anda por el 90% de caracteres."
      }
     ],
     "ejemplos": [
      {
       "juego": "minecraft",
       "titulo": "La semilla del mundo",
       "texto": "La misma semilla genera siempre el mismo mundo, pero cambia un solo número y aparece otro mundo totalmente distinto. Un hash funciona igual con los datos."
      },
      {
       "juego": "fortnite",
       "titulo": "La actualización oficial",
       "texto": "Cuando Epic publica un parche, tu cliente compara el hash del archivo descargado con el oficial. Si alguien metió algo raro por el camino, la huella no cuadra y el juego no lo instala."
      }
     ],
     "practica": [
      {
       "tipo": "hash"
      }
     ],
     "reto": {
      "pregunta": "Se filtra una base de datos con contraseñas en SHA-256 sin sal. ¿Cuáles caen primero?",
      "opciones": [
       "Las largas y aleatorias",
       "Las comunes como «panama123»",
       "Ninguna, SHA-256 no se puede atacar",
       "Todas al mismo tiempo"
      ],
      "respuesta": 1,
      "explicacion": "El atacante calcula el hash de millones de contraseñas comunes y compara. Las populares aparecen al instante; las largas y aleatorias no están en ningún diccionario."
     }
    },
    {
     "id": "passwords",
     "nivel": 3,
     "titulo": "Contraseñas que aguantan",
     "subtitulo": "Por qué «P@ssw0rd!» es mala y una frase larga es buena.",
     "minutos": 8,
     "icono": "key",
     "objetivos": [
      "Medir la entropía de una contraseña.",
      "Crear frases de paso fuertes.",
      "Activar la verificación en dos pasos."
     ],
     "teoria": [
      {
       "t": "why",
       "text": "El eslabón más débil de casi todos los sistemas eres tú escogiendo contraseña. Cinco minutos aquí valen más que cualquier antivirus."
      },
      {
       "t": "p",
       "text": "La fuerza de una contraseña se mide en bits de entropía: cuántas posibilidades tendría que probar un atacante. Cada bit extra duplica el trabajo. Una tarjeta gráfica moderna prueba unos 10.000 millones de contraseñas por segundo."
      },
      {
       "t": "table",
       "head": [
        "Contraseña",
        "Problema"
       ],
       "rows": [
        [
         "123456",
         "La nº1 de todas las filtraciones"
        ],
        [
         "P@ssw0rd!",
         "Los diccionarios ya incluyen esos cambios"
        ],
        [
         "Panama2026",
         "Palabra + año: lo primero que se prueba"
        ],
        [
         "taza-montaña-río-bosque-42",
         "Larga y aleatoria: ¡buena!"
        ]
       ]
      },
      {
       "t": "steps",
       "items": [
        {
         "t": "Usa frases",
         "d": "4 o 5 palabras al azar unidas por guiones + un número."
        },
        {
         "t": "Una por sitio",
         "d": "Si se filtra una, no caen las demás. Usa un gestor de contraseñas."
        },
        {
         "t": "Activa 2FA",
         "d": "Verificación en dos pasos con app (no SMS si puedes). Aunque roben la contraseña, no entran."
        }
       ]
      },
      {
       "t": "tip",
       "text": "Nadie legítimo te va a pedir tu contraseña ni tu código de verificación por WhatsApp. Ni tu banco, ni Epic, ni Mojang, ni «el primo que trabaja en la compañía»."
      }
     ],
     "ejemplos": [
      {
       "juego": "fortnite",
       "titulo": "La cuenta con skins raras",
       "texto": "Una cuenta con skins de la temporada 1 vale real, y los ladrones lo saben. Si tu contraseña es «fortnite123», un programa la saca en segundos. Frase larga + 2FA = cuenta blindada."
      },
      {
       "juego": "panama",
       "titulo": "«Mami, cambié de número»",
       "texto": "La estafa clásica: un número desconocido te escribe «soy yo, cambié de número, pásame el código que te llegó». Ese código es tu verificación de WhatsApp. Lo das y pierdes la cuenta."
      }
     ],
     "practica": [
      {
       "tipo": "password"
      }
     ],
     "reto": {
      "pregunta": "¿Cuál de estas contraseñas aguanta más?",
      "opciones": [
       "P@ssw0rd!",
       "qwerty12345",
       "Faction2026",
       "taza-montaña-río-bosque-42"
      ],
      "respuesta": 3,
      "explicacion": "La longitud y la aleatoriedad mandan. Los cambios tipo @ por a ya están en todos los diccionarios de ataque."
     }
    },
    {
     "id": "aes",
     "nivel": 4,
     "titulo": "AES: cifrado de verdad",
     "subtitulo": "El candado que usa medio planeta, funcionando aquí mismo.",
     "minutos": 10,
     "icono": "chest",
     "objetivos": [
      "Entender el cifrado simétrico.",
      "Cifrar y descifrar con AES-GCM real.",
      "Saber qué son la sal, el IV y la etiqueta."
     ],
     "teoria": [
      {
       "t": "why",
       "text": "AES protege tu disco, tus backups, tu Wi-Fi (WPA2/3) y casi todo el tráfico de internet. Es el estándar mundial desde 2001 y nadie ha logrado romperlo."
      },
      {
       "t": "p",
       "text": "AES es simétrico: la misma clave cifra y descifra. Es rapidísimo. Su modo moderno, GCM, además pone un «sello» (etiqueta) que detecta cualquier modificación."
      },
      {
       "t": "list",
       "items": [
        "Clave: se deriva de tu contraseña con PBKDF2 (miles de repeticiones para hacerlo lento al atacante).",
        "Sal: datos aleatorios para que dos contraseñas iguales no den la misma clave. No es secreta.",
        "IV (vector inicial): número único por mensaje. Cifrar dos veces lo mismo da resultados distintos.",
        "Etiqueta: el sello. Si cambias un solo carácter del cifrado, el descifrado falla."
       ]
      },
      {
       "t": "warn",
       "text": "La regla de oro de GCM: nunca reutilizar el mismo IV con la misma clave. Y nunca inventes tu propio cifrado: usa librerías probadas."
      },
      {
       "t": "result",
       "text": "En el simulador, cifra un mensaje dos veces: saldrán dos textos distintos (por la sal y el IV aleatorios). Altera una letra del cifrado y descifra: verás el error de autenticación."
      }
     ],
     "ejemplos": [
      {
       "juego": "panama",
       "titulo": "El sobre sellado del notario",
       "texto": "El notario mete tu documento en un sobre (cifrado) y le pone sello de lacre (etiqueta GCM). Si alguien abre el sobre o rompe el sello, se nota al instante."
      },
      {
       "juego": "minecraft",
       "titulo": "El cofre de Ender",
       "texto": "El cofre de Ender es tuyo en cualquier parte del mundo y nadie más puede abrirlo. AES con tu clave es parecido: el mismo «cofre» de datos, solo accesible para quien tiene la clave."
      }
     ],
     "practica": [
      {
       "tipo": "aes"
      }
     ],
     "reto": {
      "pregunta": "Cambias un carácter de un mensaje cifrado con AES-GCM e intentas descifrarlo. ¿Qué pasa?",
      "opciones": [
       "Sale el mensaje con una letra cambiada",
       "Falla: la etiqueta detecta la manipulación",
       "Sale el mensaje normal",
       "Se borra la contraseña"
      ],
      "respuesta": 1,
      "explicacion": "GCM autentica los datos. Cualquier cambio rompe la etiqueta y el descifrado se rechaza sin mostrar nada."
     }
    },
    {
     "id": "clave-publica",
     "nivel": 5,
     "titulo": "Clave pública y el candado HTTPS",
     "subtitulo": "Cómo dos desconocidos crean un secreto a la vista de todos.",
     "minutos": 11,
     "icono": "globe",
     "objetivos": [
      "Diferenciar clave pública y privada.",
      "Simular un intercambio Diffie-Hellman.",
      "Entender qué te protege el candado del navegador."
     ],
     "teoria": [
      {
       "t": "why",
       "text": "Sin clave pública no existirían las compras online ni la mensajería segura. Es lo que permite hablar con un servidor que nunca has visto y acabar con un secreto compartido."
      },
      {
       "t": "p",
       "text": "En criptografía asimétrica cada uno tiene dos claves: una pública (la reparte a todo el mundo) y una privada (nunca sale de su equipo). Lo cifrado con la pública solo se abre con la privada."
      },
      {
       "t": "p",
       "text": "Diffie-Hellman permite que dos personas acuerden un número secreto enviándose solo números públicos. Un espía ve todo el intercambio y aun así no puede calcular el secreto."
      },
      {
       "t": "steps",
       "items": [
        {
         "t": "Lo público",
         "d": "Ana y Beto acuerdan p=23 y g=5. Todo el mundo los ve."
        },
        {
         "t": "Lo secreto",
         "d": "Ana elige a=6, Beto elige b=15. No se lo dicen a nadie."
        },
        {
         "t": "El intercambio",
         "d": "Ana envía 5⁶ mod 23 = 8. Beto envía 5¹⁵ mod 23 = 19."
        },
        {
         "t": "La magia",
         "d": "Ana calcula 19⁶ mod 23 = 2. Beto calcula 8¹⁵ mod 23 = 2. ¡Mismo secreto sin enviarlo nunca!"
        }
       ]
      },
      {
       "t": "p",
       "text": "HTTPS (TLS) usa esto: tu navegador y el servidor acuerdan claves con Diffie-Hellman, el servidor demuestra quién es con un certificado firmado, y luego todo viaja cifrado con AES."
      },
      {
       "t": "warn",
       "text": "El candado NO significa que la página sea honesta: solo que la conexión está cifrada. Una web de phishing también puede tener candado. Revisa siempre el dominio exacto."
      }
     ],
     "ejemplos": [
      {
       "juego": "panama",
       "titulo": "El buzón de Correos",
       "texto": "Cualquiera puede echar una carta por la ranura de tu buzón (clave pública), pero solo tú tienes la llave para abrirlo (clave privada)."
      },
      {
       "juego": "fortnite",
       "titulo": "Entrar al lobby",
       "texto": "Cuando inicias sesión en Epic, tu PC y sus servidores hacen un saludo TLS en milisegundos. Por eso alguien en el mismo Wi-Fi del café no puede ver tu contraseña aunque capture todo el tráfico."
      }
     ],
     "practica": [
      {
       "tipo": "dh"
      }
     ],
     "reto": {
      "pregunta": "Ves el candado 🔒 en una web que imita a tu banco. ¿Qué garantiza?",
      "opciones": [
       "Que es tu banco de verdad",
       "Solo que la conexión va cifrada; el dominio puede ser falso",
       "Que no hay virus",
       "Que el precio es justo"
      ],
      "respuesta": 1,
      "explicacion": "El candado indica cifrado, no honestidad. Los estafadores consiguen certificados gratis. La defensa es revisar el dominio letra por letra."
     }
    }
   ]
  },
  {
   "id": "social",
   "nombre": "Mundo Ingeniería Social",
   "bioma": "Bioma Aldea",
   "tagline": "Hackear personas es más fácil que hackear computadoras.",
   "descripcion": "Phishing, estafas por WhatsApp, pretexting, contraseñas robadas y cómo no caer. El mundo más práctico de todos.",
   "color": "#ff5a6a",
   "fondo": "#2a0d14",
   "icono": "heart",
   "intro": "La mayoría de los ataques reales no empiezan con código: empiezan con un mensaje bien escrito. Aquí aprendes a reconocerlos antes de que te reconozcan a ti.",
   "niveles": [
    {
     "id": "que-es",
     "nivel": 0,
     "titulo": "¿Qué es la ingeniería social?",
     "subtitulo": "Nivel 0: cuando el objetivo eres tú, no tu computadora.",
     "minutos": 7,
     "icono": "heart",
     "objetivos": [
      "Definir ingeniería social.",
      "Reconocer los 4 gatillos emocionales.",
      "Entender por qué funciona con gente lista."
     ],
     "teoria": [
      {
       "t": "why",
       "text": "Más del 70% de los incidentes empiezan con un engaño a una persona. Puedes tener el mejor antivirus del mundo y perderlo todo por responder un mensaje."
      },
      {
       "t": "p",
       "text": "Ingeniería social es manipular a una persona para que haga algo que no debería: dar una contraseña, abrir un archivo, transferir plata o dejar pasar a alguien. No ataca la tecnología, ataca la confianza."
      },
      {
       "t": "table",
       "head": [
        "Gatillo",
        "Cómo suena",
        "Qué busca"
       ],
       "rows": [
        [
         "Urgencia",
         "«Tu cuenta se bloquea en 1 hora»",
         "Que no pienses"
        ],
        [
         "Miedo",
         "«Detectamos un cargo de $500»",
         "Que actúes asustado"
        ],
        [
         "Codicia",
         "«Ganaste un iPhone / V-Bucks gratis»",
         "Que bajes la guardia"
        ],
        [
         "Autoridad o cariño",
         "«Soy del banco» / «Mami, soy yo»",
         "Que obedezcas sin verificar"
        ]
       ]
      },
      {
       "t": "p",
       "text": "No funciona porque la gente sea tonta: funciona porque somos humanos. El estafador prueba con miles de personas y solo necesita que una pique. Como dicen: no te eligen a ti, eligen al que se deja."
      },
      {
       "t": "tip",
       "text": "La regla de oro: si un mensaje te mete prisa y te pide algo (dinero, código, contraseña, clic), detente y verifica por OTRO canal: llama tú al número oficial, pregúntale en persona a tu familiar."
      }
     ],
     "ejemplos": [
      {
       "juego": "panama",
       "titulo": "«Mami, cambié de número»",
       "texto": "Llega un mensaje de un número nuevo: «Hola mami, se me dañó el celular, este es mi número nuevo. Necesito que me hagas un Yappy urgente, luego te explico». Urgencia + cariño. La defensa: llamar al número viejo o hacer una pregunta que solo tu hijo sabría."
      },
      {
       "juego": "fortnite",
       "titulo": "El regalo de V-Bucks",
       "texto": "Un desconocido en Discord: «Soy moderador de Epic, ganaste 13.500 V-Bucks, solo entra aquí con tu cuenta». Codicia + falsa autoridad. Epic jamás regala V-Bucks por Discord."
      }
     ],
     "practica": [
      {
       "tipo": "widget",
       "w": "match",
       "props": {
        "title": "Une cada frase con su gatillo",
        "pairs": [
         [
          "«Tu cuenta se bloquea hoy»",
          "Urgencia"
         ],
         [
          "«Cargo sospechoso de $500»",
          "Miedo"
         ],
         [
          "«Ganaste un premio del Super 99»",
          "Codicia"
         ],
         [
          "«Soy el gerente, hazlo ya»",
          "Autoridad"
         ]
        ]
       }
      }
     ],
     "reto": {
      "pregunta": "Tu «primo» te escribe desde un número nuevo pidiendo $50 urgentes por Yappy. ¿Qué haces primero?",
      "opciones": [
       "Le mando la plata, es familia",
       "Lo llamo al número de siempre o le pregunto algo que solo él sabría",
       "Le pido el número de cuenta",
       "Le reenvío el mensaje a todos"
      ],
      "respuesta": 1,
      "explicacion": "Verificar por otro canal rompe el engaño. Si es tu primo de verdad, no le molestará la llamada."
     }
    },
    {
     "id": "phishing",
     "nivel": 1,
     "titulo": "Phishing: el anzuelo",
     "subtitulo": "Correos, SMS y mensajes que parecen reales.",
     "minutos": 10,
     "icono": "flag",
     "objetivos": [
      "Leer un enlace y encontrar el dominio real.",
      "Detectar las señales de un mensaje falso.",
      "Saber qué hacer si ya hiciste clic."
     ],
     "teoria": [
      {
       "t": "why",
       "text": "El phishing es la puerta de entrada número uno de los atacantes. Aprender a leer un enlace te salva más veces que cualquier herramienta."
      },
      {
       "t": "p",
       "text": "Phishing viene de «fishing» (pescar): el atacante lanza un anzuelo (un mensaje falso) y espera que alguien muerda (haga clic y ponga sus datos). Si es por SMS se llama smishing; por llamada, vishing."
      },
      {
       "t": "h",
       "text": "Cómo leer un enlace"
      },
      {
       "t": "p",
       "text": "En una dirección web, lo que importa es el dominio: la parte justo antes de la primera barra «/», leyendo de derecha a izquierda desde el final (.com, .pa…)."
      },
      {
       "t": "table",
       "head": [
        "Enlace",
        "Dominio real",
        "¿Seguro?"
       ],
       "rows": [
        [
         "https://www.banco.com.pa/login",
         "banco.com.pa",
         "Sí (si es el oficial)"
        ],
        [
         "https://banco.com.pa.verificar-cuenta.net/",
         "verificar-cuenta.net",
         "NO"
        ],
        [
         "https://bänco.com.pa",
         "otro dominio con «ä»",
         "NO"
        ],
        [
         "https://epicgames.com-promo.xyz",
         "com-promo.xyz",
         "NO"
        ]
       ]
      },
      {
       "t": "list",
       "items": [
        "Remitente raro o que no coincide con la empresa.",
        "Saludo genérico: «Estimado cliente».",
        "Urgencia o amenaza.",
        "Faltas de ortografía o traducción extraña.",
        "Enlaces acortados o con dominios raros.",
        "Te piden datos que la empresa ya tiene o jamás pediría."
       ]
      },
      {
       "t": "steps",
       "items": [
        {
         "t": "Si ya hiciste clic pero no pusiste nada",
         "d": "Cierra la página. Por lo general no pasa nada."
        },
        {
         "t": "Si pusiste tu contraseña",
         "d": "Cámbiala YA desde la app o web oficial, y en cualquier sitio donde la repitas."
        },
        {
         "t": "Si diste datos bancarios",
         "d": "Llama al número oficial del banco (el de atrás de tu tarjeta) y bloquea."
        },
        {
         "t": "Activa 2FA",
         "d": "Y avisa a tus contactos si te robaron una cuenta de mensajería."
        }
       ]
      }
     ],
     "ejemplos": [
      {
       "juego": "panama",
       "titulo": "El paquete retenido",
       "texto": "«Correos de Panamá: su paquete está retenido, pague $1.99 de aduana aquí: bit.ly/…». Casi nadie espera un paquete y aun así pica porque son solo $1.99. Lo que roban es la tarjeta completa."
      },
      {
       "juego": "minecraft",
       "titulo": "El servidor con regalo",
       "texto": "«Entra a minecraft-free-skins.net e inicia sesión con tu cuenta Microsoft para reclamar tu capa exclusiva». La capa no existe; el login falso se queda con tu cuenta."
      }
     ],
     "practica": [
      {
       "tipo": "phishing",
       "cantidad": 5
      }
     ],
     "reto": {
      "pregunta": "¿Cuál es el dominio real de https://login.banco.com.pa.seguridad-web.com/acceso?",
      "opciones": [
       "banco.com.pa",
       "login.banco.com.pa",
       "seguridad-web.com",
       "acceso"
      ],
      "respuesta": 2,
      "explicacion": "Se lee desde el final hacia la izquierda antes de la primera «/»: seguridad-web.com. Todo lo de la izquierda son subdominios que el atacante inventa."
     }
    },
    {
     "id": "pretexting",
     "nivel": 2,
     "titulo": "Pretexting, vishing y el falso técnico",
     "subtitulo": "Cuando te llaman con una historia bien armada.",
     "minutos": 8,
     "icono": "monitor",
     "objetivos": [
      "Reconocer un pretexto.",
      "Aplicar el protocolo de verificación.",
      "Proteger los códigos de un solo uso."
     ],
     "teoria": [
      {
       "t": "why",
       "text": "Las estafas por llamada (vishing) son de las más efectivas porque una voz segura y amable genera mucha confianza. Muchas empresas han perdido millones por una sola llamada."
      },
      {
       "t": "p",
       "text": "Pretexting es inventar un escenario creíble (un pretexto) para pedirte algo: «Soy del soporte técnico, detectamos un virus en tu PC, instala esta app para que te ayude». La app les da control total de tu computadora."
      },
      {
       "t": "steps",
       "items": [
        {
         "t": "Escucha la petición",
         "d": "¿Te piden un código, una contraseña, instalar algo o transferir?"
        },
        {
         "t": "Cuelga con educación",
         "d": "«Gracias, yo llamo directamente al número oficial»."
        },
        {
         "t": "Verifica por tu cuenta",
         "d": "Busca el número oficial tú mismo (web oficial, tarjeta, factura). Nunca uses el que te dieron."
        },
        {
         "t": "Reporta",
         "d": "Avisa a la empresa real y, si te afectó, a la policía."
        }
       ]
      },
      {
       "t": "warn",
       "text": "Un código de verificación (SMS o app) es como la llave de tu casa: el banco, WhatsApp o Epic NUNCA te lo van a pedir. Quien te lo pide, te está robando."
      }
     ],
     "ejemplos": [
      {
       "juego": "panama",
       "titulo": "«Llamamos de la compañía de luz»",
       "texto": "«Su servicio se corta hoy por falta de pago, pero si paga ahora por esta línea con su tarjeta se lo dejamos activo». Urgencia + autoridad. La compañía real no te corta por teléfono con 10 minutos de aviso."
      },
      {
       "juego": "fortnite",
       "titulo": "El «moderador» por voz",
       "texto": "En un chat de voz alguien se hace pasar por staff: «Para verificar que eres el dueño, léeme el código que te acaba de llegar». Ese código era para entrar a tu cuenta desde otro equipo."
      }
     ],
     "practica": [
      {
       "tipo": "orden",
       "titulo": "Ordena el protocolo ante una llamada sospechosa",
       "pasos": [
        "Escuchar sin dar ningún dato",
        "Notar la petición (código, pago, instalar app)",
        "Colgar con educación",
        "Buscar el número oficial por tu cuenta",
        "Llamar tú y confirmar",
        "Reportar el intento"
       ]
      }
     ],
     "reto": {
      "pregunta": "Te llaman «del banco» y te piden el código que te acaba de llegar por SMS «para cancelar un cargo». ¿Qué es?",
      "opciones": [
       "Un trámite normal",
       "Una estafa: el banco nunca pide códigos",
       "Una encuesta",
       "Un error del sistema"
      ],
      "respuesta": 1,
      "explicacion": "El código sirve para autorizar algo en tu cuenta. Si lo das, el estafador completa la operación. Cuelga y llama al número oficial."
     }
    },
    {
     "id": "defensa",
     "nivel": 3,
     "titulo": "Tu escudo personal",
     "subtitulo": "Checklist para ti y para tu familia.",
     "minutos": 8,
     "icono": "sword",
     "objetivos": [
      "Armar tu checklist de higiene digital.",
      "Configurar 2FA y recuperación.",
      "Enseñarle a tu familia lo básico."
     ],
     "teoria": [
      {
       "t": "why",
       "text": "Saber esto te convierte en la persona que protege a su mamá, a su abuelo y a sus panas. La seguridad también es comunidad."
      },
      {
       "t": "list",
       "items": [
        "Contraseñas únicas con gestor y frases largas.",
        "2FA activado en correo, banco, WhatsApp, Epic, Microsoft y Discord.",
        "PIN de verificación en dos pasos de WhatsApp (Ajustes → Cuenta).",
        "Actualizaciones automáticas en celular y PC.",
        "Copias de seguridad de lo importante.",
        "Nunca compartir códigos de verificación con nadie.",
        "Desconfiar de lo urgente, lo gratis y lo demasiado bueno."
       ]
      },
      {
       "t": "p",
       "text": "El correo es la llave maestra: con él se recuperan todas tus otras cuentas. Protégelo primero, con la contraseña más fuerte y 2FA."
      },
      {
       "t": "tip",
       "text": "Acuerda con tu familia una «palabra clave» secreta. Si alguien pide plata urgente diciendo ser familia, pregunten la palabra. Las estafas de voz clonada con IA ya existen."
      },
      {
       "t": "result",
       "text": "Al final de este nivel deberías tener 2FA en al menos tu correo y tu WhatsApp. ¡Hazlo ahora, toma 3 minutos!"
      }
     ],
     "ejemplos": [
      {
       "juego": "minecraft",
       "titulo": "Iluminar la base",
       "texto": "En Minecraft llenas tu base de antorchas para que no aparezcan monstruos. Las buenas costumbres digitales son tus antorchas: no evitan todo, pero hacen muchísimo más difícil que algo malo aparezca."
      },
      {
       "juego": "panama",
       "titulo": "La palabra clave de la familia",
       "texto": "Igual que algunas familias tienen una frase para cuando alguien desconocido va a recoger a los niños al colegio, tengan una palabra clave para pedidos de plata por mensaje."
      }
     ],
     "practica": [
      {
       "tipo": "orden",
       "titulo": "Ordena por prioridad qué proteger primero",
       "pasos": [
        "Correo principal (llave maestra)",
        "Banca y billeteras (Yappy, banco)",
        "WhatsApp (PIN de dos pasos)",
        "Cuentas de juego y redes sociales",
        "Resto de cuentas"
       ]
      }
     ],
     "reto": {
      "pregunta": "¿Por qué el correo es la cuenta más importante de proteger?",
      "opciones": [
       "Porque tiene fotos",
       "Porque con él se recuperan casi todas tus demás cuentas",
       "Porque es gratis",
       "No es importante"
      ],
      "respuesta": 1,
      "explicacion": "Quien controla tu correo puede pedir «olvidé mi contraseña» en todos tus servicios. Es la llave maestra."
     }
    }
   ]
  }
 ],
 "retos": [
  {
   "id": "cesar",
   "titulo": "El mensaje del emperador",
   "categoria": "Cifrados clásicos",
   "dificultad": "Fácil",
   "puntos": 100,
   "enunciado": "Interceptamos un mensaje cifrado con César y sabemos que el desplazamiento es 3. Recupera el texto original en mayúsculas.",
   "pista": "Retrocede tres posiciones en el alfabeto. K → H, R → O…",
   "aceptadas": [
    "hola mundo"
   ],
   "solucion": "HOLA MUNDO",
   "explicacion": "Aplicando D(y) = (y − 3) mod 26 a cada letra: K→H, R→O, O→L, D→A, P→M, X→U, Q→N, G→D, R→O. Resultado: HOLA MUNDO.",
   "tipo": "texto",
   "mundo": "cripto",
   "cifrado": "KROD PXQGR"
  },
  {
   "id": "atbash",
   "titulo": "El espejo del alfabeto",
   "categoria": "Cifrados clásicos",
   "dificultad": "Fácil",
   "puntos": 100,
   "enunciado": "Este mensaje usa Atbash: cada letra se sustituye por su opuesta (A↔Z, B↔Y, C↔X…). ¿Qué esconde?",
   "pista": "M es la opuesta de N, L es la opuesta de O… La palabra resultante nombra los bloques del laboratorio.",
   "aceptadas": [
    "nodo"
   ],
   "solucion": "NODO",
   "explicacion": "Atbash refleja el alfabeto: M→N, L→O, W→D, L→O. El mensaje es NODO. Fíjate en que cifrar y descifrar son la misma operación.",
   "tipo": "texto",
   "mundo": "cripto",
   "cifrado": "MLWL"
  },
  {
   "id": "morse",
   "titulo": "Puntos y rayas",
   "categoria": "Codificación",
   "dificultad": "Fácil",
   "puntos": 100,
   "enunciado": "Una señal de socorro interceptada por radio. Decodifica este mensaje en morse (las palabras se separan con /).",
   "pista": "... es S, --- es O. La segunda palabra es el nombre de esta app sin «faction».",
   "aceptadas": [
    "sos vault",
    "sosvault"
   ],
   "solucion": "SOS VAULT",
   "explicacion": "... --- ... = SOS, y ...- .- ..- .-.. - = VAULT. El morse no es cifrado: es una codificación pública, cualquiera con la tabla lo lee.",
   "tipo": "texto",
   "mundo": "cripto",
   "cifrado": "... --- ... / ...- .- ..- .-.. -"
  },
  {
   "id": "vigenere",
   "titulo": "La llave repetida",
   "categoria": "Cifrados clásicos",
   "dificultad": "Media",
   "puntos": 150,
   "enunciado": "Este texto se cifró con Vigenère y la clave NODO. Descifra el mensaje secreto.",
   "pista": "Resta cada letra de la clave (N=13, O=14, D=3, O=14, N=13) a su letra del cifrado, módulo 26.",
   "aceptadas": [
    "cifra"
   ],
   "solucion": "CIFRA",
   "explicacion": "P−N = 15−13 = 2→C; W−O = 22−14 = 8→I; I−D = 8−3 = 5→F; F−O = 5−14 = −9→R; N−N = 0→A. El mensaje es CIFRA.",
   "tipo": "texto",
   "mundo": "cripto",
   "cifrado": "PWIFN"
  },
  {
   "id": "afin",
   "titulo": "La doble llave",
   "categoria": "Cifrados clásicos",
   "dificultad": "Media",
   "puntos": 150,
   "enunciado": "Cifrado afín con a=5 y b=8, fórmula E(x) = (5x + 8) mod 26. Recupera el mensaje original.",
   "pista": "Descifra con D(y) = a⁻¹·(y − b) mod 26. El inverso de 5 módulo 26 es 21, porque 5×21 = 105 = 1 mod 26.",
   "aceptadas": [
    "hola"
   ],
   "solucion": "HOLA",
   "explicacion": "Con a⁻¹=21: R(17)→21×(17−8)=189 mod 26=7→H; A(0)→21×(0−8)=−168 mod 26=14→O; L(11)→21×3=63 mod 26=11→L; I(8)→21×0=0→A. Resultado: HOLA.",
   "tipo": "texto",
   "mundo": "cripto",
   "cifrado": "RALI"
  },
  {
   "id": "rail",
   "titulo": "La valla de rieles",
   "categoria": "Cifrados clásicos",
   "dificultad": "Media",
   "puntos": 150,
   "enunciado": "Transposición por valla (rail fence) con 3 rieles. Las letras no cambiaron, solo se reordenaron. Reconstruye el mensaje.",
   "pista": "Reparte las 12 letras en zigzag sobre 3 rieles (filas de 4, 6 y 2… no: calcula el patrón 0,1,2,1,0,1,2,1…), y lee en zigzag.",
   "aceptadas": [
    "criptografia"
   ],
   "solucion": "CRIPTOGRAFIA",
   "explicacion": "El patrón de 3 rieles reparte las letras en filas de 3, 6 y 3: CTA | RPORFA | IGI. Leyendo en zigzag (0,1,2,1,0,1,2,1,0,1,2,1) se reconstruye CRIPTOGRAFIA.",
   "tipo": "texto",
   "mundo": "cripto",
   "cifrado": "CTARPORFAIGI"
  },
  {
   "id": "base64",
   "titulo": "No todo lo raro es secreto",
   "categoria": "Codificación",
   "dificultad": "Fácil",
   "puntos": 100,
   "enunciado": "Un compañero «cifró» su proyecto con esto. Decodifícalo y dime la palabra original.",
   "pista": "Termina en ==: es Base64. Decodifica los bytes y léelos como texto.",
   "aceptadas": [
    "faction"
   ],
   "solucion": "FACTION",
   "explicacion": "ZmFjdGlvbg== en Base64 decodifica a «faction». Recuerda: Base64 no tiene clave, cualquiera lo revierte. Es codificación, no cifrado.",
   "tipo": "texto",
   "mundo": "cripto",
   "cifrado": "ZmFjdGlvbg=="
  },
  {
   "id": "identifica-hash",
   "titulo": "Firma en hexadecimal",
   "categoria": "Integridad",
   "dificultad": "Fácil",
   "puntos": 100,
   "enunciado": "Encontramos esta huella en una base de datos. Su longitud es una gran pista. ¿Qué algoritmo la generó?",
   "pista": "Cuenta los caracteres hexadecimales. Cada byte son dos caracteres. Compara con 32 (MD5), 40 (SHA-1), 64 (SHA-256) y 128 (SHA-512).",
   "aceptadas": [
    "sha-256",
    "sha256",
    "sha 256",
    "sha-2"
   ],
   "solucion": "SHA-256",
   "explicacion": "Tiene 64 caracteres hexadecimales = 256 bits = 32 bytes. Es SHA-256, concretamente el hash de la palabra «cifra».",
   "tipo": "texto",
   "mundo": "cripto",
   "cifrado": "4b08d6579bf6895852080a8c8a86e820443deb5f9939e79428dbd7b869687c85"
  },
  {
   "id": "frecuencia",
   "titulo": "El delator silencioso",
   "categoria": "Criptoanálisis",
   "dificultad": "Media",
   "puntos": 150,
   "enunciado": "Un texto largo en español, cifrado por sustitución simple, tiene como letra más repetida la «X» (casi 14% del texto). ¿Qué letra original esconde probablemente?",
   "pista": "En español, ¿qué letra aparece cerca del 13-14% en cualquier texto largo? Piensa en la más común de todas.",
   "aceptadas": [
    "e",
    "la e",
    "letra e"
   ],
   "solucion": "E",
   "explicacion": "La E ronda el 13,7% en español. En una sustitución simple las frecuencias se conservan, así que la letra más repetida del cifrado casi seguro es la E. Por eso estos cifrados caen con suficiente texto.",
   "tipo": "texto",
   "mundo": "cripto"
  },
  {
   "id": "xor-reuse",
   "titulo": "El keystream reutilizado",
   "categoria": "Criptoanálisis",
   "dificultad": "Media",
   "puntos": 150,
   "enunciado": "Dos mensajes M1 y M2 se cifraron con la MISMA secuencia XOR: C1 = M1 ⊕ K y C2 = M2 ⊕ K. Un atacante calcula C1 ⊕ C2. ¿Qué obtiene?",
   "pista": "Recuerda: K ⊕ K = 0 y X ⊕ 0 = X. Desarrolla (M1 ⊕ K) ⊕ (M2 ⊕ K).",
   "aceptadas": [
    "c"
   ],
   "solucion": "C",
   "explicacion": "(M1⊕K)⊕(M2⊕K) = M1⊕M2⊕(K⊕K) = M1⊕M2. La clave desaparece y queda el XOR de los dos mensajes, que conociendo uno revela el otro. Por eso nunca se reutiliza un keystream ni un IV.",
   "tipo": "opciones",
   "mundo": "cripto",
   "opciones": [
    "La clave K directamente.",
    "Ceros: la operación se cancela por completo.",
    "El XOR de los dos mensajes (M1 ⊕ M2), sin rastro de la clave.",
    "Un valor aleatorio sin ninguna información útil."
   ]
  },
  {
   "id": "diffie-hellman",
   "titulo": "Dos claves, un secreto",
   "categoria": "Clave pública",
   "dificultad": "Difícil",
   "puntos": 200,
   "enunciado": "Ana y Beto usan Diffie-Hellman con p = 23 y g = 5. Ana elige a = 6; Beto elige b = 15. Calcula el secreto compartido.",
   "pista": "Primero calcula A = 5⁶ mod 23 y B = 5¹⁵ mod 23. Después eleva la clave pública del otro a tu secreto: S = A^b mod 23 = B^a mod 23.",
   "aceptadas": [
    "2",
    "dos"
   ],
   "solucion": "2",
   "explicacion": "A = 5⁶ mod 23 = 8. B = 5¹⁵ mod 23 = 19. El secreto es B⁶ mod 23 = 19⁶ mod 23 = 2, y también A¹⁵ mod 23 = 8¹⁵ mod 23 = 2. Los dos llegan al mismo número sin enviarlo nunca.",
   "tipo": "texto",
   "mundo": "cripto"
  },
  {
   "id": "hmac-why",
   "titulo": "El hash que no bastó",
   "categoria": "Integridad",
   "dificultad": "Media",
   "puntos": 150,
   "enunciado": "Marta envía un mensaje con su SHA-256 para «garantizar integridad», pero el atacante controla la red y puede modificar ambos. ¿Qué debería usar en su lugar?",
   "pista": "El problema es que el atacante puede recalcular el hash. ¿Qué mecanismo necesita un secreto que el atacante no tiene?",
   "aceptadas": [
    "b"
   ],
   "solucion": "B",
   "explicacion": "Un HMAC añade una clave secreta al hash: sin la clave, el atacante no puede generar un MAC válido para su mensaje modificado. La firma digital también valdría si hay infraestructura de clave pública.",
   "tipo": "opciones",
   "mundo": "cripto",
   "opciones": [
    "SHA-512 en vez de SHA-256, porque es más largo.",
    "Un HMAC con una clave compartida (o una firma digital).",
    "Cifrar el hash con César para ocultarlo.",
    "Enviar el hash por el mismo canal dos veces."
   ]
  },
  {
   "id": "password-best",
   "titulo": "La contraseña que aguanta",
   "categoria": "Seguridad práctica",
   "dificultad": "Media",
   "puntos": 150,
   "enunciado": "Un atacante con GPUs prueba 10.000 millones de contraseñas por segundo. ¿Cuál de estas aguanta más?",
   "pista": "La entropía manda: longitud × variedad. Los trucos tipo «@ por a» los conocen todos los diccionarios con reglas.",
   "aceptadas": [
    "d"
   ],
   "solucion": "D",
   "explicacion": "«taza-montaña-río-bosque-42» combina 5 elementos (~70 bits). «P@ssw0rd!» cae por diccionario con reglas, «qwerty12345» es top de filtraciones y «Faction2026» es predecible (palabra + año).",
   "tipo": "opciones",
   "mundo": "social",
   "opciones": [
    "P@ssw0rd!",
    "qwerty12345",
    "Faction2026",
    "taza-montaña-río-bosque-42"
   ]
  },
  {
   "id": "mitm",
   "titulo": "El error de siempre",
   "categoria": "Seguridad práctica",
   "dificultad": "Media",
   "puntos": 150,
   "enunciado": "Un compañero propone guardar una contraseña con Base64 para que «no se pueda leer». ¿Cuál es la respuesta correcta?",
   "pista": "La pregunta no es si parece ilegible, sino si hace falta una clave para revertirlo.",
   "aceptadas": [
    "b"
   ],
   "solucion": "B",
   "explicacion": "Base64 es una codificación reversible sin clave. Cualquiera puede decodificarla. Para contraseñas se usa Argon2id (o bcrypt/scrypt) con sal, y para cifrar de verdad AES-GCM o ChaCha20-Poly1305.",
   "tipo": "opciones",
   "mundo": "social",
   "opciones": [
    "Es seguro porque el texto parece ilegible.",
    "Base64 no cifra: es reversible sin clave. No protege la contraseña.",
    "Es más fuerte que SHA-256 porque usa 64 símbolos.",
    "Solo es inseguro si la contraseña tiene menos de 8 caracteres."
   ]
  },
  {
   "id": "subred",
   "titulo": "¿Cuántos caben?",
   "categoria": "Redes",
   "dificultad": "Fácil",
   "puntos": 100,
   "enunciado": "La red de las cámaras del colegio es 192.168.10.0/26. ¿Cuántos dispositivos (hosts útiles) caben?",
   "pista": "Con /26 quedan 32 − 26 = 6 bits para hosts. 2⁶ = 64, menos 2 reservadas (red y broadcast).",
   "aceptadas": [
    "62"
   ],
   "solucion": "62",
   "explicacion": "2⁶ = 64 direcciones − la de red − la de broadcast = 62 hosts útiles.",
   "tipo": "texto",
   "mundo": "redes"
  },
  {
   "id": "puerto-mc",
   "titulo": "El muelle del creeper",
   "categoria": "Redes",
   "dificultad": "Fácil",
   "puntos": 100,
   "enunciado": "Tu amigo abrió un puerto en el router para su servidor de Minecraft Java. ¿Qué número de puerto es el predeterminado?",
   "pista": "Es un número de 5 cifras que empieza por 255.",
   "aceptadas": [
    "25565"
   ],
   "solucion": "25565",
   "explicacion": "Minecraft Java Edition usa por defecto el puerto TCP 25565.",
   "tipo": "texto",
   "mundo": "redes"
  },
  {
   "id": "chmod-secreto",
   "titulo": "La llave bajo el tapete",
   "categoria": "Sistemas",
   "dificultad": "Media",
   "puntos": 150,
   "enunciado": "¿Qué permiso octal debe tener tu llave privada SSH para que SOLO tu usuario pueda leerla y escribirla?",
   "pista": "Dueño rw- (4+2), grupo ---, otros ---.",
   "aceptadas": [
    "600",
    "chmod 600"
   ],
   "solucion": "600",
   "explicacion": "6 = rw- para el dueño, 0 para grupo y otros. SSH rechaza llaves con permisos más abiertos.",
   "tipo": "texto",
   "mundo": "sistemas"
  },
  {
   "id": "py-out",
   "titulo": "Predice la salida",
   "categoria": "Python",
   "dificultad": "Fácil",
   "puntos": 100,
   "enunciado": "¿Qué imprime este código?  for i in range(3): print(i * 2)  (escribe los números separados por espacio)",
   "pista": "range(3) da 0, 1, 2. Multiplica cada uno por 2.",
   "aceptadas": [
    "0 2 4",
    "024",
    "0,2,4",
    "0, 2, 4"
   ],
   "solucion": "0 2 4",
   "explicacion": "i toma 0, 1 y 2; al multiplicar por 2 salen 0, 2 y 4.",
   "tipo": "texto",
   "mundo": "python"
  },
  {
   "id": "dominio",
   "titulo": "El dominio impostor",
   "categoria": "Ingeniería social",
   "dificultad": "Media",
   "puntos": 150,
   "enunciado": "Te llega este enlace: https://yappy.com.pa.premio-seguro.net/reclamar — ¿cuál es el dominio REAL?",
   "pista": "Busca la parte justo antes de la primera barra y léela desde el final.",
   "aceptadas": [
    "premio-seguro.net"
   ],
   "solucion": "premio-seguro.net",
   "explicacion": "Todo lo de la izquierda (yappy.com.pa.) son subdominios que el atacante inventa. El dominio registrado es premio-seguro.net.",
   "tipo": "texto",
   "mundo": "social"
  },
  {
   "id": "codigo-wa",
   "titulo": "El código de seis cifras",
   "categoria": "Ingeniería social",
   "dificultad": "Fácil",
   "puntos": 100,
   "enunciado": "Un «amigo» te dice que te llegó por error un código de WhatsApp suyo y te pide que se lo reenvíes. ¿Qué haces?",
   "pista": "¿Para qué sirve ese código realmente?",
   "aceptadas": [
    "b"
   ],
   "solucion": "B",
   "explicacion": "Ese código registra TU número en SU celular. Si lo das, te roban la cuenta y estafan a tus contactos.",
   "tipo": "opciones",
   "mundo": "social",
   "opciones": [
    "Se lo reenvío, es mi amigo",
    "No lo envío: ese código es para robar mi cuenta. Activo el PIN de dos pasos",
    "Se lo envío pero borro el chat",
    "Lo publico en mi estado"
   ]
  }
 ],
 "glosario": [
  {
   "termino": "2FA",
   "categoria": "Fundamentos",
   "definicion": "Verificación en dos pasos: contraseña + algo que tienes.",
   "detalle": "Aunque roben tu contraseña, sin tu celular o llave no entran. Prefiere app autenticadora a SMS."
  },
  {
   "termino": "AEAD",
   "categoria": "Simétrica",
   "definicion": "Cifrado autenticado con datos asociados.",
   "detalle": "Proporciona confidencialidad e integridad en una sola operación. Ejemplos: AES-GCM y ChaCha20-Poly1305. Evita combinar cifrado y MAC a mano."
  },
  {
   "termino": "AES",
   "categoria": "Simétrica",
   "definicion": "Estándar de cifrado de bloque adoptado en 2001.",
   "detalle": "Advanced Encryption Standard. Bloque de 128 bits con claves de 128, 192 o 256 bits. En producción se usa con modos AEAD como GCM."
  },
  {
   "termino": "Afín",
   "categoria": "Clásicos",
   "definicion": "Cifrado clásico E(x) = (a·x + b) mod 26.",
   "detalle": "Solo funciona si «a» es coprimo con 26. Con 312 claves posibles cae ante fuerza bruta y frecuencias, pero enseña aritmética modular jugando."
  },
  {
   "termino": "Análisis de frecuencias",
   "categoria": "Ataques",
   "definicion": "Estudio de la repetición de símbolos para romper cifrados.",
   "detalle": "En español la E ronda el 13,7%. Los cifrados de sustitución preservan el patrón de frecuencias, por lo que se rompen con suficiente texto."
  },
  {
   "termino": "Argon2id",
   "categoria": "Integridad",
   "definicion": "Función de derivación de claves lenta y resistente a GPU.",
   "detalle": "Ganadora del Password Hashing Competition. Recomendada para almacenar contraseñas: configura memoria, iteraciones y paralelismo, y usa una sal única."
  },
  {
   "termino": "Ataque de diccionario",
   "categoria": "Ataques",
   "definicion": "Probar contraseñas reales filtradas y sus variantes.",
   "detalle": "Usa listas como rockyou.txt con reglas (mayúsculas, 123, !). Rompe la mayoría de contraseñas humanas. Se defiende con longitud y gestores."
  },
  {
   "termino": "Atbash",
   "categoria": "Clásicos",
   "definicion": "Sustitución espejo: A↔Z, B↔Y…",
   "detalle": "De origen hebreo antiguo. Cifrar y descifrar son la misma operación. Cero seguridad hoy, pero perfecto para entender qué es una sustitución."
  },
  {
   "termino": "Bit",
   "categoria": "Redes",
   "definicion": "La unidad mínima de información: 0 o 1.",
   "detalle": "8 bits forman un byte. Las velocidades de internet se miden en bits por segundo (Mbps), los archivos en bytes (MB)."
  },
  {
   "termino": "Bucle for",
   "categoria": "Python",
   "definicion": "Repite un bloque de código para cada elemento de una lista.",
   "detalle": "La base de la automatización: revisar mil puertos o mil líneas de log con tres líneas de código."
  },
  {
   "termino": "Certificado digital",
   "categoria": "Protocolos",
   "definicion": "Documento firmado que vincula una clave pública con una identidad.",
   "detalle": "Una CA lo emite. El navegador valida la cadena de confianza, la fecha y el dominio antes de aceptar la conexión TLS."
  },
  {
   "termino": "chmod",
   "categoria": "Sistemas",
   "definicion": "Comando para cambiar permisos de archivos en Linux.",
   "detalle": "chmod 600 = solo el dueño lee y escribe. chmod 777 = todos pueden todo (nunca lo uses)."
  },
  {
   "termino": "Clave pública",
   "categoria": "Asimétrica",
   "definicion": "Parte de un par que se puede distribuir libremente.",
   "detalle": "Se usa para cifrar hacia el destinatario o verificar sus firmas. La clave privada correspondiente nunca se comparte."
  },
  {
   "termino": "Colisión",
   "categoria": "Integridad",
   "definicion": "Dos entradas distintas con el mismo hash.",
   "detalle": "Toda función hash las tiene (más entradas que salidas). Lo importante es que sean imposibles de encontrar: MD5 y SHA-1 ya cayeron aquí."
  },
  {
   "termino": "Confidencialidad",
   "categoria": "Fundamentos",
   "definicion": "Impedir que quien no está autorizado lea la información.",
   "detalle": "Se consigue con cifrado simétrico o asimétrico, junto con una gestión correcta de claves."
  },
  {
   "termino": "CTF",
   "categoria": "Sistemas",
   "definicion": "Capture The Flag: competencia de retos de ciberseguridad.",
   "detalle": "El objetivo es encontrar «banderas» (textos secretos como FV{...}) resolviendo problemas."
  },
  {
   "termino": "Curva elíptica",
   "categoria": "Asimétrica",
   "definicion": "Grupo matemático con claves más cortas y misma seguridad.",
   "detalle": "X25519 y Ed25519 son primitivas modernas de Diffie-Hellman y firmas. Una clave de 256 bits de curva equivale aproximadamente a una RSA de 3072 bits."
  },
  {
   "termino": "César",
   "categoria": "Clásicos",
   "definicion": "Desplazamiento fijo del alfabeto.",
   "detalle": "E(x) = (x + k) mod 26. Solo 26 claves: se rompe por fuerza bruta en microsegundos. El «hola mundo» de la criptografía."
  },
  {
   "termino": "Diceware",
   "categoria": "Fundamentos",
   "definicion": "Método de contraseñas con palabras aleatorias lanzando dados.",
   "detalle": "4-6 palabras de una lista de 7776 dan 50-77 bits de entropía real y son memorizables. La receta recomendada en esta academia."
  },
  {
   "termino": "Diffie-Hellman",
   "categoria": "Asimétrica",
   "definicion": "Protocolo para acordar un secreto sobre un canal público.",
   "detalle": "Cada parte elige un secreto y calcula una clave pública. El secreto compartido se obtiene elevando la clave pública ajena al secreto propio. No autentica por sí solo."
  },
  {
   "termino": "Dirección IP",
   "categoria": "Redes",
   "definicion": "Número que identifica a un dispositivo en una red.",
   "detalle": "IPv4 son 4 números de 0 a 255 (192.168.1.20). Las privadas solo existen dentro de tu red; la pública es la que ve internet."
  },
  {
   "termino": "DNS",
   "categoria": "Redes",
   "definicion": "Sistema que traduce nombres de dominio a direcciones IP.",
   "detalle": "Es la «guía telefónica» de internet. Si lo falsean, te mandan a sitios falsos."
  },
  {
   "termino": "Efecto avalancha",
   "categoria": "Integridad",
   "definicion": "Un cambio mínimo altera gran parte de la salida.",
   "detalle": "En un buen cifrado o hash, cambiar un bit de entrada cambia aproximadamente la mitad de los bits de salida, sin relación predecible."
  },
  {
   "termino": "Entropía",
   "categoria": "Fundamentos",
   "definicion": "Medida de la incertidumbre de una clave o contraseña.",
   "detalle": "Se mide en bits: longitud × log₂(alfabeto). 128 bits de entropía real hacen inviable una búsqueda exhaustiva."
  },
  {
   "termino": "Firewall",
   "categoria": "Redes",
   "definicion": "Filtro que permite o bloquea tráfico según reglas.",
   "detalle": "La política más segura es «denegar por defecto»: solo pasa lo que permites expresamente."
  },
  {
   "termino": "Firma digital",
   "categoria": "Asimétrica",
   "definicion": "Prueba verificable de autenticidad e integridad.",
   "detalle": "El emisor firma un hash con su clave privada; cualquiera verifica con su clave pública. Aporta autenticación y no repudio."
  },
  {
   "termino": "Forward secrecy",
   "categoria": "Protocolos",
   "definicion": "Las sesiones pasadas siguen seguras si cae la clave privada.",
   "detalle": "Se logra con claves de sesión efímeras que se destruyen al terminar. TLS 1.3 la ofrece por defecto con Diffie-Hellman efímero."
  },
  {
   "termino": "Función",
   "categoria": "Python",
   "definicion": "Bloque de código con nombre que puedes reutilizar.",
   "detalle": "Se crea con def, recibe parámetros y devuelve resultados con return."
  },
  {
   "termino": "Función hash",
   "categoria": "Integridad",
   "definicion": "Convierte datos de longitud variable en una huella fija.",
   "detalle": "Debe ser determinista, unidireccional y resistente a colisiones. No cifra: cualquiera puede calcular el hash de una entrada."
  },
  {
   "termino": "GCM",
   "categoria": "Simétrica",
   "definicion": "Modo Galois/Counter para AES.",
   "detalle": "Convierte AES en AEAD: cifra y autentica a la vez con una etiqueta de 128 bits. Rápido y paralelizable. Su regla de oro: nunca repetir (clave, IV)."
  },
  {
   "termino": "HMAC",
   "categoria": "Integridad",
   "definicion": "Código de autenticación con una clave secreta.",
   "detalle": "Verifica integridad y autenticidad entre dos partes que comparten la clave. Distinto de una firma digital: no hay no repudio."
  },
  {
   "termino": "Ingeniería social",
   "categoria": "Ataques",
   "definicion": "Manipular personas para que den acceso o información.",
   "detalle": "Usa urgencia, miedo, codicia y autoridad. Se defiende verificando por otro canal."
  },
  {
   "termino": "IV",
   "categoria": "Simétrica",
   "definicion": "Valor inicial aleatorio para un modo de cifrado.",
   "detalle": "Evita que mensajes repetidos produzcan el mismo cifrado. En GCM debe ser único por operación; en CBC debe ser impredecible. No es secreto."
  },
  {
   "termino": "KDF",
   "categoria": "Integridad",
   "definicion": "Función de derivación de claves.",
   "detalle": "Convierte una contraseña en una clave criptográfica con sal, iteraciones y memoria (Argon2id, PBKDF2, scrypt). Lenta a propósito."
  },
  {
   "termino": "Kerckhoffs",
   "categoria": "Fundamentos",
   "definicion": "La seguridad debe depender solo del secreto de la clave.",
   "detalle": "Principio del siglo XIX: un sistema cuyo secreto es el algoritmo no es seguro. Todo puede ser público menos la clave."
  },
  {
   "termino": "Kernel",
   "categoria": "Sistemas",
   "definicion": "Núcleo del sistema operativo con privilegios máximos.",
   "detalle": "Maneja memoria, procesos, drivers y seguridad. Un fallo en el kernel es lo más grave posible."
  },
  {
   "termino": "MITM",
   "categoria": "Ataques",
   "definicion": "Ataque de intermediario entre dos partes.",
   "detalle": "El atacante se sitúa entre ambas, aparentando ser la otra. TLS lo evita autenticando el servidor con certificados y firmas en el handshake."
  },
  {
   "termino": "Modelo de amenaza",
   "categoria": "Fundamentos",
   "definicion": "Suposiciones explícitas sobre qué puede hacer un atacante.",
   "detalle": "Define si el adversario solo observa, puede modificar mensajes o accede al dispositivo. Sin modelo de amenaza, «es seguro» no significa nada."
  },
  {
   "termino": "Morse",
   "categoria": "Clásicos",
   "definicion": "Codificación de letras en puntos y rayas.",
   "detalle": "De los 1840s, para telégrafo. Es codificación pública, no cifrado: cualquiera con la tabla lo lee. Sigue vivo en radioafición y aviación."
  },
  {
   "termino": "Máscara de subred",
   "categoria": "Redes",
   "definicion": "Indica qué parte de la IP es la red y qué parte es el equipo.",
   "detalle": "/24 = 255.255.255.0: los tres primeros números son la red y caben 254 equipos."
  },
  {
   "termino": "NAT",
   "categoria": "Redes",
   "definicion": "Traducción de muchas IPs privadas a una pública.",
   "detalle": "Tu router la usa para que toda tu casa salga a internet con una sola dirección."
  },
  {
   "termino": "Nonce",
   "categoria": "Simétrica",
   "definicion": "Número usado una sola vez.",
   "detalle": "En protocolos y cifrados autenticados debe ser único. Repetirlo con la misma clave puede ser catastrófico."
  },
  {
   "termino": "OTP",
   "categoria": "Simétrica",
   "definicion": "Libreta de un solo uso: el cifrado perfecto.",
   "detalle": "One-Time Pad: XOR con una clave aleatoria tan larga como el mensaje, usada una vez. Irrompible en teoría, impracticable por la distribución de claves."
  },
  {
   "termino": "PBKDF2",
   "categoria": "Integridad",
   "definicion": "Derivación de claves por iteraciones de HMAC.",
   "detalle": "Aplica HMAC miles de veces con sal. Mejor que un hash directo, pero Argon2id es superior hoy por usar memoria además de CPU."
  },
  {
   "termino": "Phishing",
   "categoria": "Ataques",
   "definicion": "Engaño con mensajes falsos para robar datos o instalar malware.",
   "detalle": "Por SMS se llama smishing; por llamada, vishing. Se detecta leyendo el dominio real del enlace."
  },
  {
   "termino": "Proceso",
   "categoria": "Sistemas",
   "definicion": "Un programa en ejecución, con su memoria y su PID.",
   "detalle": "Casi todo malware termina siendo un proceso; por eso se revisa el administrador de tareas."
  },
  {
   "termino": "Puerto",
   "categoria": "Redes",
   "definicion": "Número (0-65535) que indica a qué programa va un dato dentro de un equipo.",
   "detalle": "443 = HTTPS, 22 = SSH, 53 = DNS, 25565 = Minecraft."
  },
  {
   "termino": "Rail fence",
   "categoria": "Clásicos",
   "definicion": "Transposición en zigzag sobre rieles.",
   "detalle": "Reordena letras sin cambiarlas. Las frecuencias se conservan, así que el ataque es probar pocos rieles y buscar idioma legible."
  },
  {
   "termino": "Rainbow table",
   "categoria": "Ataques",
   "definicion": "Tabla precalculada de hash → contraseña.",
   "detalle": "Permite revertir hashes rápidos al instante. La defensa es la sal única por usuario: obliga a recalcular la tabla para cada sal."
  },
  {
   "termino": "Root",
   "categoria": "Sistemas",
   "definicion": "El superusuario de Linux: puede hacer absolutamente todo.",
   "detalle": "Por seguridad se trabaja con un usuario normal y se usa sudo solo cuando hace falta."
  },
  {
   "termino": "Router",
   "categoria": "Redes",
   "definicion": "Aparato que conecta redes distintas y decide por dónde va cada paquete.",
   "detalle": "El de tu casa une tu red local con la de tu proveedor de internet y hace NAT."
  },
  {
   "termino": "RSA",
   "categoria": "Asimétrica",
   "definicion": "Sistema de clave pública basado en factorizar primos.",
   "detalle": "De 1977. Con 2048+ bits sigue válido para firmas; para intercambio se prefieren curvas elípticas (X25519)."
  },
  {
   "termino": "Sal",
   "categoria": "Integridad",
   "definicion": "Datos aleatorios añadidos antes de un hash.",
   "detalle": "Evita que contraseñas iguales generen hashes iguales y bloquea las tablas precalculadas. No es secreta, pero no debe repetirse."
  },
  {
   "termino": "Self-XSS",
   "categoria": "Ataques",
   "definicion": "Engaño para que pegues código malicioso en la consola de tu navegador.",
   "detalle": "«Pega esto en F12 y gana premios». Ese código roba tu sesión. Nunca pegues código que no entiendes."
  },
  {
   "termino": "SHA-256",
   "categoria": "Integridad",
   "definicion": "Función hash de 256 bits de la familia SHA-2.",
   "detalle": "Produce 64 caracteres hexadecimales. Se usa en firmas, certificados, integridad de archivos y Bitcoin. No debe usarse solo para contraseñas."
  },
  {
   "termino": "TCP",
   "categoria": "Redes",
   "definicion": "Protocolo de transporte fiable: confirma y reordena todo.",
   "detalle": "Empieza con el saludo de 3 pasos SYN, SYN-ACK, ACK. Lo usan la web, el correo y los pagos."
  },
  {
   "termino": "Timing attack",
   "categoria": "Ataques",
   "definicion": "Ataque que mide tiempos de respuesta.",
   "detalle": "Diferencias de nanosegundos pueden filtrar claves o bytes correctos. Se defiende con código en tiempo constante y sin ramas secretas."
  },
  {
   "termino": "TLS",
   "categoria": "Protocolos",
   "definicion": "Capa de transporte segura que protege conexiones.",
   "detalle": "TLS 1.3 combina autenticación por certificados, acuerdo de claves efímero y cifrado AEAD. Es el candado de HTTPS."
  },
  {
   "termino": "UDP",
   "categoria": "Redes",
   "definicion": "Protocolo de transporte rápido sin confirmaciones.",
   "detalle": "Ideal para juegos y llamadas en tiempo real, donde es mejor perder un paquete que esperar."
  },
  {
   "termino": "Variable",
   "categoria": "Python",
   "definicion": "Nombre que guarda un valor para usarlo después.",
   "detalle": "puerto = 22. Python deduce el tipo según el valor."
  },
  {
   "termino": "Vector de ataque",
   "categoria": "Ataques",
   "definicion": "Camino concreto que usa un atacante.",
   "detalle": "Técnico, humano (phishing) o de implementación (IV repetido). La criptografía no arregla una mala arquitectura."
  },
  {
   "termino": "Vigenère",
   "categoria": "Clásicos",
   "definicion": "Cifrado polialfabético con clave repetida.",
   "detalle": "Una César distinta por posición. Resistió 300 años hasta Kasiski y Friedman. Se rompe estimando la longitud de clave y atacando cada César."
  },
  {
   "termino": "XOR",
   "categoria": "Simétrica",
   "definicion": "Operación bit a bit exclusiva.",
   "detalle": "Reversible: (a ⊕ k) ⊕ k = a. Base de cifrados de flujo; nunca debe reutilizarse el keystream."
  },
  {
   "termino": "Zero-knowledge",
   "categoria": "Fundamentos",
   "definicion": "Prueba sin revelar el secreto que la sustenta.",
   "detalle": "Permite demostrar un hecho sin mostrar los datos que lo hacen cierto. Se usa en autenticación avanzada y privacidad."
  }
 ],
 "tutoriales": [
  {
   "id": "primer-hash",
   "titulo": "Tu primer hash en 5 minutos",
   "descripcion": "Calcula un SHA-256, entiende por qué cambia todo con una letra y verifica la integridad de un archivo.",
   "nivel": "Básico",
   "minutos": 5,
   "icono": "fingerprint",
   "pasos": [
    {
     "titulo": "Qué vas a conseguir",
     "texto": "Al terminar sabrás calcular una huella SHA-256, explicar el efecto avalancha y verificar que un archivo no fue modificado. Sin instalar nada."
    },
    {
     "titulo": "Calcula tu primera huella",
     "texto": "Ve a Herramientas → Hashes. Escribe tu nombre y observa la huella SHA-256. Cambia una sola letra: la huella cambia por completo. Eso es el efecto avalancha.",
     "accion": {
      "label": "Abrir herramientas",
      "vista": "cripto"
     }
    },
    {
     "titulo": "Compara dos mensajes",
     "texto": "Usa el comparador con «hola» y «Hola». Fíjate en el porcentaje de diferencia: cerca del 50% de los caracteres cambian aunque solo varíe una mayúscula."
    },
    {
     "titulo": "Verifica algo real",
     "texto": "Descarga cualquier programa que publique su SHA-256 oficial, calcula el hash de tu archivo y compáralos. Si coinciden, nadie lo manipuló por el camino."
    },
    {
     "titulo": "Cierra el círculo",
     "texto": "Lee la lección de hashes para entender preimagen, colisiones y por qué un hash solo no autentica. Después intenta el reto «Firma en hexadecimal».",
     "accion": {
      "label": "Ir al reto",
      "vista": "retos"
     }
    }
   ]
  },
  {
   "id": "cesar-a-mano",
   "titulo": "Cifra y rompe César a mano",
   "descripcion": "El flujo completo de atacante y defensor: cifra un mensaje, intercámbialo y rómpelo por fuerza bruta.",
   "nivel": "Básico",
   "minutos": 7,
   "icono": "rotate",
   "pasos": [
    {
     "titulo": "Cifra tu mensaje",
     "texto": "Abre el laboratorio y carga la receta «César + Base64». Escribe un mensaje secreto y pon desplazamiento 7. Copia el resultado: es tu mensaje interceptado.",
     "accion": {
      "label": "Abrir laboratorio",
      "vista": "cripto"
     }
    },
    {
     "titulo": "Ponte en la piel del espía",
     "texto": "Borra la entrada mentalmente: solo tienes el cifrado. Como hay 26 claves, prueba desplazamientos del 0 al 25 hasta que aparezca español legible. Eso es fuerza bruta."
    },
    {
     "titulo": "El atajo inteligente",
     "texto": "Con textos largos no hacen falta 26 pruebas: busca la letra más repetida del cifrado y supón que es la E. Una sola resta te da la clave."
    },
    {
     "titulo": "La moraleja",
     "texto": "26 claves no son nada. Compara con AES-256: 2²⁵⁶ claves, más átomos que en el universo observable. La lección de César te lo cuenta con números.",
     "accion": {
      "label": "Ver lección",
      "vista": "cripto"
     }
    }
   ]
  },
  {
   "id": "nodos-pro",
   "titulo": "Encadena nodos como un pro",
   "descripcion": "Del flujo lineal a pensar en pipelines: orden correcto, puntos de inspección y recetas reutilizables.",
   "nivel": "Intermedio",
   "minutos": 8,
   "icono": "network",
   "pasos": [
    {
     "titulo": "El orden importa",
     "texto": "Cargar «César → Hash» y luego «Hash → César» con la misma entrada. Los resultados son totalmente distintos: cada paso transforma lo que recibe, no hay conmutatividad."
    },
    {
     "titulo": "Inspecciona cada paso",
     "texto": "Haz clic en cada nodo del lienzo: el inspector muestra qué entra, qué sale y por qué. Acostúmbrate a verificar intermedios, no solo el final.",
     "accion": {
      "label": "Abrir laboratorio",
      "vista": "cripto"
     }
    },
    {
     "titulo": "Piensa en bytes",
     "texto": "Fíjate en el contador de bytes de la salida. Base64 crece ~33%, el hex duplica, el hash fija el tamaño. El tamaño delata el algoritmo: un atacante también lo mira."
    },
    {
     "titulo": "Guarda tu receta",
     "texto": "Exporta tu flujo en JSON y vuelve a importarlo. Así se comparten pipelines en equipos reales: configuración versionada, no capturas de pantalla."
    }
   ]
  },
  {
   "id": "hmac-verify",
   "titulo": "Verifica integridad con HMAC",
   "descripcion": "Por qué un hash solo no basta en una red hostil, y cómo una clave compartida lo arregla.",
   "nivel": "Intermedio",
   "minutos": 8,
   "icono": "medal",
   "pasos": [
    {
     "titulo": "El problema",
     "texto": "Si envías mensaje + SHA-256 por una red que controla el atacante, él modifica ambos y nadie lo nota. El hash verifica integridad solo contra errores, no contra adversarios."
    },
    {
     "titulo": "La solución con clave",
     "texto": "Abre la lección de firmas y usa la demo: firma un mensaje con HMAC y una clave. Cambia una letra del mensaje y verifica: la firma ya no cuadra.",
     "accion": {
      "label": "Ver demo de firmas",
      "vista": "cripto"
     }
    },
    {
     "titulo": "Por qué el atacante no puede",
     "texto": "Sin la clave secreta no puede generar un MAC válido para su mensaje falso. La seguridad no está en el algoritmo (público) sino en la clave (secreta). Kerckhoffs, de nuevo."
    },
    {
     "titulo": "Cuándo subir de nivel",
     "texto": "HMAC sirve entre dos partes que comparten secreto. Si necesitas que cualquiera verifique (software, webs), pasa a firmas digitales con clave privada. El reto «El hash que no bastó» te lo pone a prueba.",
     "accion": {
      "label": "Intentar el reto",
      "vista": "retos"
     }
    }
   ]
  },
  {
   "id": "dh-secreto",
   "titulo": "Crea un secreto Diffie-Hellman",
   "descripcion": "Acuerda un número secreto con alguien a la vista de todos, paso a paso y con números pequeños.",
   "nivel": "Avanzado",
   "minutos": 10,
   "icono": "key",
   "pasos": [
    {
     "titulo": "Acuerda lo público",
     "texto": "Ana y Beto publican p=23 y g=5. Todo el mundo los ve, incluido el espía. No pasa nada: lo público no es lo secreto."
    },
    {
     "titulo": "Elige tu secreto",
     "texto": "Ana elige a=6 (nadie lo sabe), Beto elige b=15 (nadie lo sabe). En la demo de la lección puedes mover estos valores y ver qué cambia.",
     "accion": {
      "label": "Abrir simulador DH",
      "vista": "cripto"
     }
    },
    {
     "titulo": "Intercambia claves públicas",
     "texto": "Ana envía A = 5⁶ mod 23 = 8. Beto envía B = 5¹⁵ mod 23 = 19. El espía los intercepta. Sigue sin poder hacer nada útil con ellos."
    },
    {
     "titulo": "Calcula el secreto",
     "texto": "Ana hace B^a mod 23 = 2. Beto hace A^b mod 23 = 2. Mismo número, cero transmisión del secreto. Ese 2 (en la vida real, 256 bits) cifra la conversación."
    },
    {
     "titulo": "El matiz que falta",
     "texto": "DH no autentica: un intermediario podría hacer dos intercambios. Por eso TLS añade certificados y firmas. Lee la lección de TLS para ver el handshake completo."
    }
   ]
  },
  {
   "id": "aes-real",
   "titulo": "Cifra de verdad con AES-GCM",
   "descripcion": "Un cifrado auténtico con contraseña, sal aleatoria e IV único. Entiende cada pieza del formato final.",
   "nivel": "Intermedio",
   "minutos": 9,
   "icono": "zap",
   "pasos": [
    {
     "titulo": "Cifra tu primer mensaje",
     "texto": "Ve a la lección de AES-GCM y usa la demo: escribe un mensaje y una contraseña. Obtendrás algo como FV1.salt.iv.datos. Cifra dos veces lo mismo: sale distinto. Bien.",
     "accion": {
      "label": "Abrir demo AES",
      "vista": "cripto"
     }
    },
    {
     "titulo": "Lee el formato",
     "texto": "FV1 = versión. salt = sal aleatoria para derivar la clave (PBKDF2, 120.000 iteraciones). iv = vector único por mensaje. datos = cifrado + etiqueta de autenticación."
    },
    {
     "titulo": "Rompe algo a propósito",
     "texto": "Cambia un carácter del bloque de datos e intenta descifrar: falla. Esa es la etiqueta GCM protegiéndote. Sin autenticación, habrías obtenido basura silenciosa."
    },
    {
     "titulo": "Contraseña equivocada",
     "texto": "Prueba descifrar con otra contraseña: también falla, sin revelar nada. Un buen sistema no distingue «clave mal» de «datos corruptos»."
    },
    {
     "titulo": "Llévalo al mundo real",
     "texto": "Este esquema (PBKDF2 + AES-GCM + sal/IV aleatorios) es el patrón correcto para cifrar archivos o backups. En producción usa además Argon2id y librerías auditadas."
    }
   ]
  },
  {
   "id": "primer-servidor",
   "titulo": "Protege tu servidor de Minecraft",
   "descripcion": "Whitelist, puertos y contraseñas: lo mínimo antes de invitar a tus panas.",
   "nivel": "Básico",
   "minutos": 8,
   "icono": "grass",
   "pasos": [
    {
     "titulo": "Activa la whitelist",
     "texto": "En server.properties pon white-list=true y agrega a tus amigos con /whitelist add nombre. Así solo entra quien tú quieras.",
     "accion": {
      "label": "Ver mundo Redes",
      "vista": "redes"
     }
    },
    {
     "titulo": "Abre solo el puerto necesario",
     "texto": "En el router redirige únicamente el 25565 TCP a la IP de tu PC. Nada de abrir rangos enteros ni activar la «DMZ».",
     "accion": {
      "label": "Practicar con el firewall",
      "vista": "redes"
     }
    },
    {
     "titulo": "Mantén online-mode=true",
     "texto": "Así el servidor verifica que cada jugador tenga una cuenta legítima. Con false, cualquiera entra con cualquier nombre (incluido el tuyo de admin)."
    },
    {
     "titulo": "No des OP a la ligera",
     "texto": "Los permisos de operador son como root: solo para ti y alguien de máxima confianza.",
     "accion": {
      "label": "Ver lección de permisos",
      "vista": "sistemas"
     }
    },
    {
     "titulo": "Haz backups",
     "texto": "Copia la carpeta del mundo cada semana a otro disco o a la nube. Si alguien lo destruye o un plugin falla, restauras en minutos."
    }
   ]
  },
  {
   "id": "cuenta-blindada",
   "titulo": "Blinda tu WhatsApp en 3 minutos",
   "descripcion": "PIN de dos pasos, privacidad y cómo reaccionar si te roban la cuenta.",
   "nivel": "Básico",
   "minutos": 5,
   "icono": "heart",
   "pasos": [
    {
     "titulo": "Activa la verificación en dos pasos",
     "texto": "Ajustes → Cuenta → Verificación en dos pasos → Activar. Crea un PIN de 6 dígitos que no sea tu cumpleaños y agrega un correo de recuperación."
    },
    {
     "titulo": "Revisa los dispositivos vinculados",
     "texto": "Ajustes → Dispositivos vinculados. Si ves una sesión que no reconoces, ciérrala."
    },
    {
     "titulo": "Ajusta quién te agrega a grupos",
     "texto": "Ajustes → Privacidad → Grupos → Mis contactos. Corta de raíz los grupos de estafas."
    },
    {
     "titulo": "Si te roban la cuenta",
     "texto": "Reinstala WhatsApp y registra tu número para recibir el SMS. Avisa a tus contactos por otro medio que no respondan pedidos de plata.",
     "accion": {
      "label": "Entrenar con el detector de phishing",
      "vista": "phishing"
     }
    }
   ]
  }
 ],
 "phishing": [
  {
   "id": "p1",
   "canal": "whatsapp",
   "remitente": "+507 6xxx-4821 (número nuevo)",
   "mensaje": "Hola mami 😢 se me cayó el cel al agua, este es mi número nuevo. Necesito que me hagas un Yappy de $80 urgente, es para pagar algo de la U, luego te explico porfa",
   "es_phishing": true,
   "senales": [
    "Número desconocido que dice ser familia",
    "Urgencia",
    "Pide dinero",
    "«Luego te explico» para que no preguntes"
   ],
   "explicacion": "La clásica «mami, cambié de número». Llama al número de siempre o haz una pregunta que solo tu hijo/a sabría."
  },
  {
   "id": "p2",
   "canal": "sms",
   "remitente": "CorreosPA",
   "mensaje": "Su paquete #PA8812 esta retenido en aduana. Pague $1.99 antes de 24h o sera devuelto: https://correos-pa.entregas-aduana.top/pago",
   "enlace": "https://correos-pa.entregas-aduana.top/pago",
   "es_phishing": true,
   "senales": [
    "Dominio real: entregas-aduana.top",
    "Monto pequeño para que no lo pienses",
    "Plazo de 24 h",
    "Sin tildes ni tu nombre"
   ],
   "explicacion": "Roban los datos completos de tu tarjeta, no los $1.99. El dominio real es entregas-aduana.top."
  },
  {
   "id": "p3",
   "canal": "email",
   "remitente": "Epic Games <help@acct.epicgames.com>",
   "asunto": "Tu código de seguridad",
   "mensaje": "Hola, aquí tienes el código que solicitaste para iniciar sesión: 482 913. Si no fuiste tú, cambia tu contraseña desde la web oficial. Nunca compartas este código con nadie.",
   "es_phishing": false,
   "senales": [
    "No pide hacer clic ni responder",
    "Te recuerda no compartir el código",
    "Dominio oficial epicgames.com"
   ],
   "explicacion": "Mensaje legítimo: solo informa. Pero ojo, si no pediste el código, alguien tiene tu contraseña: cámbiala."
  },
  {
   "id": "p4",
   "canal": "dm",
   "remitente": "EpicMod_Oficial (Discord)",
   "mensaje": "🎉 ¡Felicidades! Fuiste seleccionado para recibir 13.500 V-Bucks por tu actividad. Inicia sesión aquí para reclamar antes de que expire: epicgames.com-recompensas.xyz",
   "enlace": "epicgames.com-recompensas.xyz",
   "es_phishing": true,
   "senales": [
    "Regalo demasiado bueno",
    "Dominio real: com-recompensas.xyz",
    "Plazo de expiración",
    "Epic no da premios por DM"
   ],
   "explicacion": "Codicia + falsa autoridad. El dominio real termina en .xyz; «epicgames.com-» es solo un subdominio inventado."
  },
  {
   "id": "p5",
   "canal": "sms",
   "remitente": "BancoPA",
   "mensaje": "ALERTA: se detecto un cargo de $547.00 en su tarjeta. Si no lo reconoce llame YA al 800-0000 o ingrese a bancopa-seguridad.com para cancelar.",
   "enlace": "bancopa-seguridad.com",
   "es_phishing": true,
   "senales": [
    "Miedo por un cargo grande",
    "Número y web que no son los oficiales",
    "Mayúsculas y prisa"
   ],
   "explicacion": "Te asustan para que llames a SU número. Llama siempre al número detrás de tu tarjeta."
  },
  {
   "id": "p6",
   "canal": "email",
   "remitente": "Microsoft <account-security-noreply@accountprotection.microsoft.com>",
   "asunto": "Nuevo inicio de sesión en tu cuenta",
   "mensaje": "Detectamos un inicio de sesión en tu cuenta Microsoft desde Windows, Panamá. Si fuiste tú, puedes ignorar este mensaje. Si no, revisa la actividad reciente entrando tú mismo a account.microsoft.com.",
   "es_phishing": false,
   "senales": [
    "Dominio oficial microsoft.com",
    "No exige actuar con urgencia",
    "Te indica entrar tú mismo a la web oficial"
   ],
   "explicacion": "Legítimo. Fíjate que no trae botón de «verificar ahora»: te pide que entres tú escribiendo la dirección."
  },
  {
   "id": "p7",
   "canal": "whatsapp",
   "remitente": "Super99 Promos 🎁",
   "mensaje": "¡Felicidades! 🎉 Por el aniversario del Super 99 ganaste un bono de $500. Responde la encuesta y compártelo con 10 grupos para activarlo: super99-aniversario.club",
   "enlace": "super99-aniversario.club",
   "es_phishing": true,
   "senales": [
    "Premio sin haber participado",
    "Te pide compartirlo con grupos (para propagarse)",
    "Dominio .club no oficial"
   ],
   "explicacion": "Estas «encuestas» roban datos y se propagan solas porque te obligan a reenviarlas."
  },
  {
   "id": "p8",
   "canal": "dm",
   "remitente": "tu_pana_luis (Instagram)",
   "mensaje": "bro mira esto jajaja 😂 eres tú en este video?? instagram-video.watch-now.cc/v/8812",
   "enlace": "instagram-video.watch-now.cc",
   "es_phishing": true,
   "senales": [
    "Curiosidad o vergüenza como gatillo",
    "Dominio real: watch-now.cc",
    "Cuenta de un amigo posiblemente robada"
   ],
   "explicacion": "Cuando roban la cuenta de alguien, la usan para engañar a sus contactos. Pregúntale a Luis por otro medio."
  },
  {
   "id": "p9",
   "canal": "email",
   "remitente": "Soporte TI <soporte@tu-colegio.edu.pa>",
   "asunto": "Mantenimiento programado del Wi-Fi",
   "mensaje": "Hola. Este sábado de 8:00 a 10:00 a. m. haremos mantenimiento al Wi-Fi del colegio y no habrá conexión. No necesitas hacer nada. Saludos, Departamento de TI.",
   "es_phishing": false,
   "senales": [
    "No pide datos ni clics",
    "Información concreta y verificable",
    "Dominio del colegio"
   ],
   "explicacion": "Mensaje informativo normal. Un buen indicador: no te pide nada."
  },
  {
   "id": "p10",
   "canal": "sms",
   "remitente": "+1 (415) 555-0199",
   "mensaje": "Tu cuenta de WhatsApp sera suspendida. Para evitarlo envia el codigo de 6 digitos que recibiste a este numero.",
   "es_phishing": true,
   "senales": [
    "Pide tu código de verificación",
    "Amenaza de suspensión",
    "Número extranjero"
   ],
   "explicacion": "WhatsApp nunca pide tu código. Quien lo tenga puede registrar tu número en su celular."
  },
  {
   "id": "p11",
   "canal": "email",
   "remitente": "Recursos Humanos <rrhh@empresa-pagos.com>",
   "asunto": "URGENTE: actualiza tu cuenta para recibir tu salario",
   "mensaje": "Estimado colaborador, debido a un cambio de sistema debe actualizar sus datos bancarios hoy antes de las 5 p. m. o su pago de la quincena se retrasará. Descargue el formulario adjunto: formulario_pago.exe",
   "es_phishing": true,
   "senales": [
    "Adjunto .exe (programa ejecutable)",
    "Urgencia con la quincena",
    "Saludo genérico",
    "Dominio que no es el de tu empresa"
   ],
   "explicacion": "Un formulario nunca es un .exe. Ese archivo es malware. RRHH real no cambia datos bancarios por correo con prisa."
  },
  {
   "id": "p12",
   "canal": "dm",
   "remitente": "MinecraftSkins (Discord)",
   "mensaje": "Hola! Estamos probando una nueva skin exclusiva 🔥 descarga el launcher beta para tenerla gratis: mc-launcher-beta.zip (es seguro, desactiva el antivirus porque da falso positivo)",
   "es_phishing": true,
   "senales": [
    "Te pide desactivar el antivirus",
    "Archivo de origen desconocido",
    "Regalo exclusivo"
   ],
   "explicacion": "«Desactiva el antivirus» es la señal más roja de todas. Es un ladrón de sesiones (stealer) disfrazado."
  }
 ],
 "snippets": [
  {
   "id": "s1",
   "titulo": "Ver tu IP y tu router",
   "lenguaje": "bash",
   "categoria": "Redes",
   "codigo": "# Windows\nipconfig\n\n# Linux / Mac\nip a\nip route | grep default",
   "explicacion": "Muestra la IP de tu equipo y la puerta de enlace (tu router). Es lo primero que se revisa al diagnosticar una red."
  },
  {
   "id": "s2",
   "titulo": "Ping y traceroute",
   "lenguaje": "bash",
   "categoria": "Redes",
   "codigo": "ping -c 4 google.com        # Linux/Mac (en Windows: ping google.com)\ntraceroute google.com       # Windows: tracert google.com",
   "explicacion": "Mide la latencia y muestra cada salto (router) hasta el destino."
  },
  {
   "id": "s3",
   "titulo": "Preguntar al DNS",
   "lenguaje": "bash",
   "categoria": "Redes",
   "codigo": "nslookup minecraft.net\n# o, más detallado en Linux/Mac:\ndig minecraft.net A +short",
   "explicacion": "Traduce un dominio a su IP. Útil para comprobar si te están redirigiendo a un sitio falso."
  },
  {
   "id": "s4",
   "titulo": "Buscar intentos fallidos en un log",
   "lenguaje": "bash",
   "categoria": "Sistemas",
   "codigo": "grep \"Failed password\" /var/log/auth.log | awk '{print $(NF-3)}' | sort | uniq -c | sort -rn | head",
   "explicacion": "Cuenta los intentos de contraseña fallidos por IP en un servidor Linux. Las IPs de arriba son candidatas a ataque de fuerza bruta."
  },
  {
   "id": "s5",
   "titulo": "Permisos seguros para tu llave SSH",
   "lenguaje": "bash",
   "categoria": "Sistemas",
   "codigo": "chmod 700 ~/.ssh\nchmod 600 ~/.ssh/id_ed25519\nls -la ~/.ssh",
   "explicacion": "Tu llave privada solo debe poder leerla tu usuario. SSH incluso se niega a usarla si tiene permisos abiertos."
  },
  {
   "id": "s6",
   "titulo": "Procesos que más CPU usan",
   "lenguaje": "bash",
   "categoria": "Sistemas",
   "codigo": "ps aux --sort=-%cpu | head -n 10",
   "explicacion": "Lista los 10 procesos que más CPU consumen. Un nombre raro al 100% puede ser un minero de criptomonedas."
  },
  {
   "id": "s7",
   "titulo": "Hash SHA-256 de un archivo",
   "lenguaje": "python",
   "categoria": "Python",
   "codigo": "import hashlib\n\ndef sha256_archivo(ruta):\n    h = hashlib.sha256()\n    with open(ruta, \"rb\") as f:\n        for bloque in iter(lambda: f.read(8192), b\"\"):\n            h.update(bloque)\n    return h.hexdigest()\n\nprint(sha256_archivo(\"instalador.exe\"))",
   "explicacion": "Lee el archivo por bloques (sirve para archivos enormes) y devuelve su huella. Compárala con la publicada por el desarrollador."
  },
  {
   "id": "s8",
   "titulo": "Detector de fuerza bruta",
   "lenguaje": "python",
   "categoria": "Python",
   "codigo": "from collections import Counter\n\nfallos = Counter()\nwith open(\"auth.log\") as f:\n    for linea in f:\n        if \"Failed password\" in linea:\n            ip = linea.split(\"from \")[1].split()[0]\n            fallos[ip] += 1\n\nfor ip, n in fallos.most_common(5):\n    print(f\"{ip:15} {n} fallos\")",
   "explicacion": "Counter es un diccionario que cuenta solo. most_common(5) devuelve las 5 IPs más insistentes."
  },
  {
   "id": "s9",
   "titulo": "Escáner de puertos (solo tu equipo)",
   "lenguaje": "python",
   "categoria": "Python",
   "codigo": "import socket\n\nfor puerto in [22, 80, 443, 3306, 8080]:\n    s = socket.socket()\n    s.settimeout(0.5)\n    abierto = s.connect_ex((\"127.0.0.1\", puerto)) == 0\n    print(puerto, \"ABIERTO\" if abierto else \"cerrado\")\n    s.close()",
   "explicacion": "connect_ex devuelve 0 si el saludo TCP se completa. Úsalo solo contra 127.0.0.1 o equipos donde tengas permiso escrito."
  },
  {
   "id": "s10",
   "titulo": "Generar una contraseña segura",
   "lenguaje": "python",
   "categoria": "Python",
   "codigo": "import secrets\n\npalabras = [\"taza\", \"montaña\", \"río\", \"bosque\", \"farol\", \"duna\", \"cobre\", \"marea\"]\nfrase = \"-\".join(secrets.choice(palabras) for _ in range(5))\nprint(frase + \"-\" + str(secrets.randbelow(90) + 10))",
   "explicacion": "El módulo secrets usa aleatoriedad criptográfica (random no sirve para seguridad). Con una lista grande de palabras obtienes frases fuertes y memorables."
  },
  {
   "id": "s11",
   "titulo": "Cifrado César en una línea",
   "lenguaje": "python",
   "categoria": "Criptografía",
   "codigo": "cesar = lambda t, k: \"\".join(chr((ord(c) - 65 + k) % 26 + 65) if c.isalpha() else c for c in t.upper())\nprint(cesar(\"CANAL DE PANAMA\", 3))   # FDQDO GH SDQDPD",
   "explicacion": "Resta 65 para que A=0, suma la clave, da la vuelta con % 26 y vuelve a letra."
  },
  {
   "id": "s12",
   "titulo": "Verificar un hash en la terminal",
   "lenguaje": "bash",
   "categoria": "Criptografía",
   "codigo": "# Linux\nsha256sum archivo.iso\n# Mac\nshasum -a 256 archivo.iso\n# Windows (PowerShell)\nGet-FileHash archivo.iso -Algorithm SHA256",
   "explicacion": "Calcula la huella SHA-256 de cualquier descarga para compararla con la oficial."
  }
 ]
};

if (typeof window !== "undefined") window.FV_CONTENT = window.FV_CONTENT || FV_CONTENT;
export default FV_CONTENT;
