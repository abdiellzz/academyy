import type { PixelIconName } from "../components/PixelArt";

export interface NivelRuta { mundo: string; nivel: string }
export interface RutaAprendizaje {
  id: string;
  titulo: string;
  para: string;
  icono: PixelIconName;
  niveles: NivelRuta[];
  proyecto: string;
  resultado: string;
}
export interface PasoProyecto {
  pregunta: string;
  opciones: string[];
  correcta: number;
  porQue: string;
}
export interface ProyectoFinal {
  id: string;
  titulo: string;
  subtitulo: string;
  objetivo: string;
  producto: string;
  pasos: PasoProyecto[];
}

export const PROYECTOS: ProyectoFinal[] = [
  {
    id: "escudo-cuenta",
    titulo: "Plan de defensa de una cuenta ficticia",
    subtitulo: "Practica decisiones de protección y recuperación sin usar datos personales.",
    objetivo: "Diseñar una secuencia razonable para proteger una cuenta importante.",
    producto: "Plan de respuesta: credenciales únicas, segundo factor y recuperación segura.",
    pasos: [
      { pregunta: "La cuenta comparte contraseña con un sitio que acaba de filtrar datos. ¿Qué haces primero?", opciones: ["Cambiarla por una variante con ! y seguir reutilizándola", "Desde el sitio oficial, poner una clave larga y única; priorizar el correo principal", "Esperar confirmación por SMS"], correcta: 1, porQue: "Una clave única reduce el efecto de una filtración; asegura primero el correo porque suele recuperar otras cuentas." },
      { pregunta: "¿Qué segundo factor ofrece mejor resistencia al phishing cuando el servicio lo permite?", opciones: ["Una passkey o llave de seguridad vinculada al sitio", "Un código TOTP dictado por teléfono a soporte", "Una pregunta de seguridad con el nombre de tu mascota"], correcta: 0, porQue: "Las passkeys y llaves FIDO2/WebAuthn están vinculadas al origen del sitio. Nunca compartas códigos de un solo uso." },
      { pregunta: "Aparece una sesión que no reconoces. ¿Cómo completas la respuesta?", opciones: ["Cerrar esa sesión, revocar las demás sesiones sospechosas y revisar recuperación/reenvíos", "Borrar la notificación para que no moleste", "Publicar la alerta para que otras personas prueben el enlace"], correcta: 0, porQue: "Cierra el acceso activo, revisa cambios de recuperación y reenvío, y vuelve a autenticarte desde una ruta confiable." },
    ],
  },
  {
    id: "triage-logs",
    titulo: "Triage de una alerta de acceso",
    subtitulo: "Analiza registros ficticios y escribe una respuesta defensiva proporcionada.",
    objetivo: "Distinguir una señal sospechosa de una conclusión no demostrada.",
    producto: "Nota de triage con evidencia, nivel de certeza y siguientes pasos.",
    pasos: [
      { pregunta: "Registro: FAIL desde 198.51.100.23 a las 10:22, 10:23 y 10:24; luego OK desde 10.0.0.8 a las 10:26. ¿Qué es la señal más clara?", opciones: ["Varios fallos desde una IP pública; merece investigación, pero por sí solo no prueba intrusión", "Certeza total de que la IP pública pertenece al atacante", "Un inicio de sesión exitoso desde la IP privada"], correcta: 0, porQue: "Los fallos repetidos son evidencia relevante, no atribución. Correlaciona usuario, ventana de tiempo y otros registros." },
      { pregunta: "¿Qué evidencia conviene preservar antes de cerrar el incidente?", opciones: ["Los registros originales, hora/zona horaria, cuenta afectada y contexto de autenticación", "Solo una captura recortada sin hora", "Borrar los intentos fallidos para evitar alarmas"], correcta: 0, porQue: "Preserva logs íntegros y contexto; documenta tiempos y cambios realizados para que otra persona pueda verificar el análisis." },
      { pregunta: "Si la persona confirma que no reconoce el acceso, ¿cuál es una respuesta inicial razonable?", opciones: ["Revocar sesiones, proteger la cuenta desde un dispositivo confiable y escalar según el procedimiento", "Ejecutar el archivo adjunto del registro", "Bloquear toda la red permanentemente sin avisar"], correcta: 0, porQue: "Limita el acceso y protege la cuenta con una respuesta proporcional. Conserva evidencia y sigue el procedimiento de escalamiento." },
    ],
  },
  {
    id: "triage-red",
    titulo: "Informe de tráfico de red ficticio",
    subtitulo: "Busca una conexión que se sale del patrón y propone el siguiente paso seguro.",
    objetivo: "Leer origen, destino, protocolo y puerto sin confundir una anomalía con una prueba concluyente.",
    producto: "Resumen de tráfico con flujo observado, hipótesis y verificación siguiente.",
    pasos: [
      { pregunta: "Flujos: 10.0.0.8→10.0.0.53 UDP/53; 10.0.0.8→203.0.113.18 TCP/443; 10.0.0.8→198.51.100.23 TCP/3389. ¿Cuál revisarías primero en una laptop de usuario?", opciones: ["La consulta DNS a su servidor configurado", "La conexión saliente TCP/3389, que puede ser legítima pero es inesperada en este contexto", "Todas son maliciosas porque incluyen direcciones IP"], correcta: 1, porQue: "RDP saliente puede tener usos legítimos, pero es una anomalía contextual que conviene validar; no basta para declarar compromiso." },
      { pregunta: "¿Qué paso evita sacar una conclusión precipitada?", opciones: ["Validar dueño, proceso, destino y política; correlacionar con DNS y registros del equipo", "Afirmar que el host está comprometido solo por el puerto", "Escanear direcciones públicas al azar"], correcta: 0, porQue: "El puerto describe una pista, no el proceso ni la intención. Correlaciona evidencias y valida el uso esperado con el responsable." },
      { pregunta: "¿Qué debe incluir el informe final?", opciones: ["Observación, hora, evidencia, hipótesis con nivel de confianza y siguiente acción", "Solo ‘ataque confirmado’", "Contraseñas capturadas para adjuntarlas al correo"], correcta: 0, porQue: "Un buen informe separa hechos de hipótesis y propone una acción segura y verificable." },
    ],
  },
];

export const RUTAS_APRENDIZAJE: RutaAprendizaje[] = [
  { id: "desde-cero", titulo: "Empiezo desde cero", para: "Entender lo esencial sin asumir conocimientos previos.", icono: "grass", niveles: [{ mundo: "seguridad", nivel: "que-es-seguridad" }, { mundo: "redes", nivel: "que-es-red" }, { mundo: "sistemas", nivel: "que-es-so" }], proyecto: "triage-red", resultado: "Leer un caso ficticio y explicar qué se sabe y qué falta comprobar." },
  { id: "vida-digital", titulo: "Quiero proteger mis cuentas", para: "Tomar mejores decisiones sobre claves, phishing y recuperación.", icono: "shield", niveles: [{ mundo: "seguridad", nivel: "contrasenas" }, { mundo: "social", nivel: "phishing" }, { mundo: "seguridad", nivel: "privacidad-incidentes" }], proyecto: "escudo-cuenta", resultado: "Preparar un plan de defensa para una cuenta de demostración." },
  { id: "analisis-tecnico", titulo: "Quiero probar lo técnico", para: "Explorar redes, registros y análisis defensivo con datos ficticios.", icono: "monitor", niveles: [{ mundo: "redes", nivel: "que-es-red" }, { mundo: "python", nivel: "logs" }, { mundo: "sistemas", nivel: "terminal-ctf" }], proyecto: "triage-logs", resultado: "Escribir una nota de triage sustentada en registros ficticios." },
];
